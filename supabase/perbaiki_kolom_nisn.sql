-- ══════════════════════════════════════════════════════════════════════════
-- PERBAIKAN: get_my_profile masih membaca kolom `nisn` yang sudah dibuang
-- ══════════════════════════════════════════════════════════════════════════
--
-- GEJALA
--   Login gagal dengan pesan "Profil tidak ditemukan", padahal akun dan
--   profilnya ada. Diagnosa menunjukkan:
--
--       {"code":"42703","message":"record \"v\" has no field \"nisn\""}
--
-- PENYEBAB — URUTAN MIGRASI TERBALIK
--   1. Migrasi 08 membuat kolom `nisn` beserta versi get_my_profile yang
--      mengembalikan kolom itu (`'nisn', v.nisn`).
--   2. Migrasi 09 membuang kolom `nisn`, TETAPI TIDAK memperbarui
--      get_my_profile.
--   3. Akibatnya fungsi yang tersimpan di database masih mencoba membaca
--      `v.nisn` — padahal kolomnya sudah tidak ada.
--
--   Ini kesalahan pada migrasi 09: ia mengubah bentuk tabel tanpa
--   menyesuaikan fungsi yang membaca tabel itu. Migrasi 09 sudah diperbaiki
--   di repositori supaya hal ini tidak terulang.
--
--   Fungsi yang perlu diperbarui ternyata BUKAN HANYA get_my_profile.
--   Seluruh fungsi di bawah ini menyebut `nisn` karena dibuat oleh migrasi 08,
--   sehingga SEMUANYA rusak setelah kolomnya dibuang. Berkas ini memperbaiki
--   ketiganya sekaligus.
--
-- Aman dijalankan berulang. Jalankan di Supabase SQL Editor.
-- ══════════════════════════════════════════════════════════════════════════


-- ── 1. get_my_profile — dipanggil SETIAP kali login ───────────────────────
--
-- Definisi ini disalin dari 02_rpc_and_hardening.sql (versi yang benar),
-- yaitu sebelum kolom `nisn` pernah ada. Kunci 'found' WAJIB ada: pemanggil
-- di aplikasi memeriksanya untuk membedakan "profil belum ada" dari "gagal
-- memuat profil".
CREATE OR REPLACE FUNCTION public.get_my_profile()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v public.profiles%ROWTYPE;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Harus login.' USING ERRCODE = '28000';
  END IF;

  SELECT * INTO v FROM public.profiles WHERE id = auth.uid();
  IF NOT FOUND THEN
    RETURN jsonb_build_object('found', false);
  END IF;

  RETURN jsonb_build_object(
    'found', true,
    'id', v.id,
    'username', v.username,
    'role', v.role,
    'is_admin', v.is_admin,
    'name', v.name,
    'absent_number', v.absent_number,
    'classroom_code', v.classroom_code,
    'school_name', v.school_name,
    'avatar_config', v.avatar_config,
    'unlocked_level', v.unlocked_level
  );
END $$;

REVOKE ALL ON FUNCTION public.get_my_profile() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_my_profile() TO authenticated;


-- ── 2. list_class_students — dipakai Posko Guru ───────────────────────────
--
-- Versi migrasi 08 memilih kolom `p.nisn`. Setelah kolomnya dibuang, fungsi
-- ini akan gagal dengan galat yang sama saat guru membuka daftar siswa.
-- Dikembalikan ke versi 02, yang sudah benar.
CREATE OR REPLACE FUNCTION public.list_class_students(p_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_me public.profiles%ROWTYPE;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Harus login.' USING ERRCODE = '28000';
  END IF;

  SELECT * INTO v_me FROM public.profiles WHERE id = auth.uid();
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profil tidak ditemukan.' USING ERRCODE = 'P0002';
  END IF;

  IF NOT (v_me.is_admin OR v_me.role = 'admin') THEN
    IF v_me.role <> 'teacher' THEN
      RAISE EXCEPTION 'Hanya guru yang boleh melihat rekap kelas.' USING ERRCODE = '42501';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM public.classrooms c
                   WHERE c.code = upper(trim(p_code)) AND c.teacher_username = v_me.username) THEN
      RAISE EXCEPTION 'Kelas bukan milik Anda.' USING ERRCODE = '42501';
    END IF;
  END IF;

  RETURN (
    SELECT COALESCE(jsonb_agg(row_to_json(s) ORDER BY s.absent_number::text, s.name), '[]'::jsonb)
    FROM (
      SELECT p.id, p.id AS user_id, p.classroom_code, p.name, p.username,
             COALESCE(c.name, 'Kelas VIII-A') AS class_name,
             p.absent_number, p.avatar_config, p.unlocked_level,
             p.created_at, p.updated_at
      FROM public.profiles p
      LEFT JOIN public.classrooms c ON c.code = p.classroom_code
      WHERE p.classroom_code = upper(trim(p_code)) AND p.role = 'student'
    ) s
  );
END $$;

REVOKE ALL ON FUNCTION public.list_class_students(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.list_class_students(TEXT) TO authenticated;


-- ── 3. handle_new_auth_user — trigger pembuatan profil ────────────────────
--
-- Versi migrasi 08 membaca dan menulis kolom `nisn`. Setelah kolomnya
-- dibuang, SETIAP pembuatan akun baru akan gagal. Dikembalikan ke versi 06
-- dengan nomor absen dinormalkan (nol di depan dibuang), karena nomor absen
-- kini berperan sebagai pengenal unik bersama kode kelas.
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
  v_existing public.profiles%ROWTYPE;
BEGIN
  -- Penjaga: hindari kerja berulang saat pengguna login (trigger UPDATE).
  IF TG_OP = 'UPDATE' THEN
    SELECT * INTO v_existing FROM public.profiles WHERE id = NEW.id;
    IF FOUND
       AND COALESCE(v_existing.username, '') <> ''
       AND (v_existing.classroom_code IS NOT NULL
            OR v_existing.role IN ('teacher', 'admin')
            OR v_existing.is_admin)
    THEN
      RETURN NEW;
    END IF;
  END IF;

  v_username := lower(trim(COALESCE(
    NULLIF(NEW.raw_app_meta_data  ->> 'username', ''),
    NULLIF(NEW.raw_user_meta_data ->> 'username', ''),
    split_part(COALESCE(NEW.email, ''), '@', 1)
  )));

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
  -- Nol di depan dibuang: "01" dan "1" tidak boleh menjadi dua siswa berbeda.
  IF v_absent ~ '^[0-9]+$' THEN
    v_absent := (v_absent::INT)::TEXT;
  END IF;

  v_school := COALESCE(
    NULLIF(trim(COALESCE(NEW.raw_app_meta_data  ->> 'school_name', '')), ''),
    NULLIF(trim(COALESCE(NEW.raw_user_meta_data ->> 'school_name', '')), ''),
    'SMP Negeri 1'
  );

  INSERT INTO public.profiles AS p (
    id, username, role, name, absent_number, classroom_code, school_name
  ) VALUES (
    NEW.id, v_username, v_role, v_name, v_absent, NULLIF(v_class, ''), v_school
  )
  ON CONFLICT (id) DO UPDATE SET
    name           = COALESCE(NULLIF(p.name, ''), EXCLUDED.name),
    absent_number  = COALESCE(NULLIF(p.absent_number, ''), EXCLUDED.absent_number),
    classroom_code = COALESCE(EXCLUDED.classroom_code, p.classroom_code),
    school_name    = COALESCE(NULLIF(p.school_name, ''), EXCLUDED.school_name);

  RETURN NEW;
END $$;


-- ══════════════════════════════════════════════════════════════════════════
-- VERIFIKASI
-- ══════════════════════════════════════════════════════════════════════════
--
-- Pastikan tidak ada lagi fungsi yang menyebut kolom `nisn`. Hasilnya harus
-- KOSONG:
--
--   SELECT p.proname
--     FROM pg_proc p
--     JOIN pg_namespace n ON n.oid = p.pronamespace
--    WHERE n.nspname = 'public'
--      AND pg_get_functiondef(p.oid) ILIKE '%nisn%';
--
-- Lalu coba login lagi di aplikasi. Bila masih gagal, jalankan:
--
--   npm run diagnosa:akun guru <sandi-guru>
--
-- dan kirim hasilnya.
