-- ══════════════════════════════════════════════════════════════════════════
-- RESQ-BOX — MIGRASI 06: PERBAIKI TRIGGER PROFIL (kelas siswa selalu NULL)
--
-- GEJALA
--   Setiap siswa yang mendaftar sendiri punya `profiles.classroom_code` NULL,
--   sehingga tidak pernah muncul di Posko Guru.
--
-- BUKTI (dari query metadata auth.users)
--   zidan@resqbox.local   app_kelas=(kosong)   meta_kelas=RESQ-8A
--   zidann@resqbox.local  app_kelas=(kosong)   meta_kelas=RESQ-8A
--   → Kode kelas DIKIRIM aplikasi, tapi trigger membacanya dari app_metadata
--     yang memang tidak diisi (sengaja, karena bisa dipalsukan klien).
--     Fallback ke user_metadata gagal karena Supabase menulis metadata itu
--     SETELAH baris auth.users dibuat, jadi trigger AFTER INSERT sudah jalan
--     lebih dulu dengan metadata masih kosong.
--
-- PERBAIKAN
--   1. Trigger dijalankan pada INSERT **dan** UPDATE, sehingga saat metadata
--      akhirnya terisi, profil ikut disinkronkan.
--   2. Membaca tiga sumber: app_metadata → user_metadata → raw_user_meta_data.
--   3. Hanya mengisi kolom yang BELUM terisi (tidak menimpa data yang benar).
--   4. Memperbaiki profil lama yang classroom_code-nya masih NULL.
--
-- Aman dijalankan berulang. Jalankan di Supabase SQL Editor.
-- ══════════════════════════════════════════════════════════════════════════

-- ── 1. Fungsi trigger yang tahan terhadap urutan penulisan metadata ──────
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_username TEXT;
  v_role     TEXT;
  v_class    TEXT;
  v_name     TEXT;
  v_absent   TEXT;
  v_school   TEXT;
  v_is_admin BOOLEAN;
  v_existing public.profiles%ROWTYPE;
BEGIN
  -- ── PENJAGA: hindari kerja berulang ────────────────────────────────────
  -- Supabase memperbarui `updated_at` pada auth.users setiap kali pengguna
  -- login, dan itu memicu trigger UPDATE ini. Tanpa penjaga, setiap login
  -- akan menulis ulang tabel profiles — pemborosan yang terasa saat ribuan
  -- siswa login bersamaan. Jadi kita berhenti lebih awal bila profil sudah
  -- lengkap: username terisi, dan kelas sudah ada (atau memang bukan siswa).
  IF TG_OP = 'UPDATE' THEN
    SELECT * INTO v_existing FROM public.profiles WHERE id = NEW.id;
    IF FOUND
       AND COALESCE(v_existing.username, '') <> ''
       AND (v_existing.classroom_code IS NOT NULL
            OR v_existing.role IN ('teacher', 'admin')
            OR v_existing.is_admin)
    THEN
      RETURN NEW;   -- profil sudah lengkap, tidak perlu diapa-apakan
    END IF;
  END IF;

  -- Ambil nilai dari dua sumber yang PASTI ada di auth.users.
  -- `app_metadata` diutamakan karena hanya bisa ditulis server;
  -- `user_metadata` dipakai untuk pendaftaran mandiri oleh siswa.
  -- (Catatan: kolom `user_metadata` sengaja TIDAK dirujuk — di instance ini
  --  auth.users hanya punya `raw_app_meta_data` dan `raw_user_meta_data`.)
  v_username := lower(trim(COALESCE(
    NULLIF(NEW.raw_app_meta_data  ->> 'username', ''),
    NULLIF(NEW.raw_user_meta_data ->> 'username', ''),
    split_part(COALESCE(NEW.email, ''), '@', 1)
  )));

  -- PERAN hanya dipercaya dari app_metadata (tidak bisa dipalsukan klien).
  -- Tanpa itu, selalu 'student'.
  v_role := CASE
    WHEN COALESCE(NEW.raw_app_meta_data ->> 'role', '') IN ('teacher', 'admin')
      THEN NEW.raw_app_meta_data ->> 'role'
    ELSE 'student'
  END;

  v_class := upper(trim(COALESCE(
    NULLIF(NEW.raw_app_meta_data  ->> 'classroom_code', ''),
    NULLIF(NEW.raw_user_meta_data ->> 'classroom_code', '')
  )));

  v_name := COALESCE(
    NULLIF(trim(COALESCE(NEW.raw_app_meta_data  ->> 'name', '')), ''),
    NULLIF(trim(COALESCE(NEW.raw_user_meta_data ->> 'name', '')), ''),
    'Petualang RESQ'
  );

  v_absent := COALESCE(
    NULLIF(trim(COALESCE(NEW.raw_app_meta_data  ->> 'absent_number', '')), ''),
    NULLIF(trim(COALESCE(NEW.raw_user_meta_data ->> 'absent_number', '')), ''),
    '1'
  );

  v_school := COALESCE(
    NULLIF(trim(COALESCE(NEW.raw_app_meta_data  ->> 'school_name', '')), ''),
    NULLIF(trim(COALESCE(NEW.raw_user_meta_data ->> 'school_name', '')), ''),
    'SMP Negeri 1'
  );

  v_is_admin := COALESCE((NEW.raw_app_meta_data ->> 'is_admin')::BOOLEAN, false);

  -- Validasi kode kelas: kalau tidak terdaftar, biarkan NULL rather than gagal.
  -- (Pada INSERT kita tetap MELEMPAR error supaya pendaftaran dengan kode palsu
  --  ditolak; pada UPDATE kita cukup lewati agar tidak memblokir perubahan lain.)
  IF v_class <> '' AND NOT EXISTS (
    SELECT 1 FROM public.classrooms c WHERE c.code = v_class
  ) THEN
    IF TG_OP = 'INSERT' THEN
      RAISE EXCEPTION
        'Kode kelas "%" tidak terdaftar. Mintalah kode yang benar dari gurumu.',
        v_class
        USING ERRCODE = '23514';
    ELSE
      RAISE NOTICE 'Kode kelas % tidak terdaftar — dibiarkan kosong.', v_class;
      v_class := '';
    END IF;
  END IF;

  -- Upsert: buat bila belum ada, lengkapi bila sudah ada.
  -- GREATEST(1,...) melindungi kolom NOT NULL.
  INSERT INTO public.profiles AS p (
    id, username, role, is_admin, name, absent_number,
    classroom_code, school_name, unlocked_level
  ) VALUES (
    NEW.id,
    COALESCE(NULLIF(v_username, ''), 'user-' || left(NEW.id::text, 8)),
    v_role,
    v_is_admin,
    v_name,
    v_absent,
    NULLIF(v_class, ''),
    v_school,
    1
  )
  ON CONFLICT (id) DO UPDATE SET
    username       = COALESCE(NULLIF(EXCLUDED.username, ''), p.username),
    name           = COALESCE(NULLIF(EXCLUDED.name, ''), p.name),
    absent_number  = COALESCE(NULLIF(EXCLUDED.absent_number, ''), p.absent_number),
    school_name    = COALESCE(NULLIF(EXCLUDED.school_name, ''), p.school_name),
    -- Kelas hanya diisi bila sebelumnya kosong → tidak menimpa pemindahan kelas
    -- yang mungkin dilakukan guru.
    classroom_code = COALESCE(p.classroom_code, EXCLUDED.classroom_code),
    -- Peran hanya dinaikkan, tidak diturunkan (melindungi admin/guru).
    role           = CASE
                       WHEN EXCLUDED.role IN ('teacher', 'admin') THEN EXCLUDED.role
                       ELSE p.role
                     END,
    is_admin       = p.is_admin OR EXCLUDED.is_admin,
    updated_at     = now();

  RETURN NEW;
END $$;

-- ── 2. Pasang trigger pada INSERT **dan** UPDATE ─────────────────────────
--
-- PENTING: daftar nama kolom di `AFTER UPDATE OF ...` divalidasi saat migrasi
-- dijalankan. Karena struktur `auth.users` bisa berbeda antar instance Supabase,
-- kita periksa dulu kolom mana yang benar-benar ada — daripada mengasumsikan.
DROP TRIGGER IF EXISTS trg_on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS trg_on_auth_user_changed ON auth.users;

CREATE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

DO $$
DECLARE
  v_cols TEXT := '';
  v_col  TEXT;
BEGIN
  -- Bangun daftar kolom metadata yang benar-benar ada di auth.users.
  FOREACH v_col IN ARRAY ARRAY['raw_user_meta_data', 'raw_app_meta_data', 'user_metadata']
  LOOP
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'auth' AND table_name = 'users' AND column_name = v_col
    ) THEN
      v_cols := v_cols || CASE WHEN v_cols = '' THEN '' ELSE ', ' END || v_col;
    END IF;
  END LOOP;

  IF v_cols = '' THEN
    RAISE WARNING 'Tidak menemukan kolom metadata di auth.users — trigger UPDATE dilewati.';
    RETURN;
  END IF;

  -- Inilah kuncinya: saat Supabase selesai menulis metadata (setelah INSERT),
  -- trigger ini menyinkronkan kelas & nama ke profil.
  EXECUTE format(
    'CREATE TRIGGER trg_on_auth_user_changed
       AFTER UPDATE OF %s ON auth.users
       FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user()',
    v_cols
  );
  RAISE NOTICE 'Trigger UPDATE dipasang untuk kolom: %', v_cols;
END $$;

-- ── 3. Perbaiki profil lama yang kelasnya masih NULL ─────────────────────
-- Membaca ulang metadata dari auth.users untuk akun siswa yang belum punya kelas.
DO $$
DECLARE
  v_fixed INT := 0;
BEGIN
  UPDATE public.profiles p
  SET classroom_code = cls.code
  FROM auth.users u,
       LATERAL (
         SELECT upper(trim(COALESCE(
           NULLIF(u.raw_app_meta_data  ->> 'classroom_code', ''),
           NULLIF(u.raw_user_meta_data ->> 'classroom_code', '')
         ))) AS code
       ) AS cls
  WHERE p.id = u.id
    AND p.role = 'student'
    AND p.classroom_code IS NULL
    AND cls.code IS NOT NULL
    AND cls.code <> ''
    AND EXISTS (SELECT 1 FROM public.classrooms c WHERE c.code = cls.code);

  GET DIAGNOSTICS v_fixed = ROW_COUNT;
  RAISE NOTICE 'Profil siswa yang diperbaiki kelasnya: %', v_fixed;
END $$;

-- ── 4. Verifikasi ───────────────────────────────────────────────────────
SELECT
  'V1 siswa tanpa kelas (target 0)' AS pemeriksaan,
  count(*)::text AS nilai,
  CASE WHEN count(*) = 0 THEN 'AMAN' ELSE 'CEK LAGI' END AS status,
  COALESCE(string_agg(username, ', '), 'semua siswa sudah punya kelas') AS detail
FROM public.profiles
WHERE role = 'student' AND classroom_code IS NULL

UNION ALL
SELECT
  'V2 isi profil per kelas',
  COALESCE(classroom_code, '<<NULL>>') || ' = ' || count(*)::text,
  CASE WHEN classroom_code IS NULL THEN 'CEK LAGI' ELSE 'OK' END,
  string_agg(username, ', ')
FROM public.profiles
WHERE role = 'student'
GROUP BY classroom_code

UNION ALL
SELECT
  'V3 trigger terpasang (target 2)',
  count(*)::text,
  CASE WHEN count(*) = 2 THEN 'AMAN' ELSE 'CEK LAGI' END,
  COALESCE(string_agg(tgname, ', '), 'TIDAK ADA')
FROM pg_trigger
WHERE tgrelid = 'auth.users'::regclass AND NOT tgisinternal
  AND tgname IN ('trg_on_auth_user_created', 'trg_on_auth_user_changed');

-- ══════════════════════════════════════════════════════════════════════════
-- SETELAH MENJALANKAN INI
--   1. Lihat bagian V1 — harus bernilai 0.
--   2. Buka Posko Guru → pilih kelas RESQ-8A → siswa harus muncul.
--   3. Uji pendaftaran siswa BARU, lalu jalankan:
--        SELECT username, role, COALESCE(classroom_code,'<<NULL>>')
--        FROM public.profiles ORDER BY created_at DESC LIMIT 3;
--      Akun baru itu HARUS punya classroom_code = 'RESQ-8A'.
-- ══════════════════════════════════════════════════════════════════════════
