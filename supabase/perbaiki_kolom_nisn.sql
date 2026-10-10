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


-- ── 4. teacher_create_student — dipakai guru untuk membuat akun siswa ────
--
-- KELALAIAN YANG DIPERBAIKI DI SINI
--   Versi pertama berkas ini hanya memperbaiki TIGA fungsi. Padahal ada EMPAT
--   yang rusak, dan yang terlewat justru teacher_create_student — fungsi yang
--   dipakai guru setiap kali membuat akun siswa.
--
--   Akibatnya guru TIDAK DAPAT menambah siswa sama sekali. Kelalaian ini
--   ketahuan setelah verifikasi database melaporkan:
--       "Fungsi baca kolom terbuang: teacher_create_student"
--
--   Penyebabnya: versi rusak fungsi ini dibuat oleh migrasi 08 (yang menyebut
--   p_nisn), dan saya tidak memeriksa SELURUH fungsi yang menyebut kolom itu.
--   Pemeriksa otomatis pun tidak menangkapnya karena versi 5-argumen dari
--   migrasi 03 memang bersih — yang tersimpan di database adalah versi
--   6-argumen dari migrasi 08.
--
-- Fungsi ini juga memakai aturan baru: nomor absen WAJIB, hanya angka, nol di
-- depan dibuang, dan tidak boleh kembar dalam satu kelas.
CREATE OR REPLACE FUNCTION public.teacher_create_student(
  p_classroom_code TEXT,
  p_name           TEXT,
  p_absent_number  TEXT,
  p_username       TEXT,
  p_password       TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_me       public.profiles%ROWTYPE;
  v_username TEXT := lower(trim(p_username));
  v_code     TEXT := upper(trim(p_classroom_code));
  v_absen    TEXT := NULLIF(trim(COALESCE(p_absent_number, '')), '');
  v_new_id   UUID := gen_random_uuid();
  v_email    TEXT;
  v_class    public.classrooms%ROWTYPE;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Harus login.' USING ERRCODE = '28000';
  END IF;

  SELECT * INTO v_me FROM public.profiles WHERE id = auth.uid();
  IF NOT FOUND OR NOT (v_me.role IN ('teacher', 'admin') OR v_me.is_admin) THEN
    RAISE EXCEPTION 'Hanya guru yang boleh membuat akun siswa.' USING ERRCODE = '42501';
  END IF;

  -- Guru hanya boleh menambah siswa ke kelas yang dia ampu (admin bebas).
  IF NOT (v_me.is_admin OR v_me.role = 'admin') THEN
    IF NOT EXISTS (SELECT 1 FROM public.classrooms c
                   WHERE c.code = v_code AND c.teacher_username = v_me.username) THEN
      RAISE EXCEPTION 'Kelas % bukan milik Anda.', v_code USING ERRCODE = '42501';
    END IF;
  END IF;

  SELECT * INTO v_class FROM public.classrooms WHERE code = v_code;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Kode kelas % tidak ditemukan.', v_code USING ERRCODE = '23503';
  END IF;

  IF v_username !~ '^[a-z0-9._-]{3,30}$' THEN
    RAISE EXCEPTION 'Username hanya boleh huruf kecil, angka, titik, garis bawah, dan strip (3–30 karakter).'
      USING ERRCODE = '22023';
  END IF;

  IF length(COALESCE(p_password, '')) < 6 THEN
    RAISE EXCEPTION 'Password minimal 6 karakter.' USING ERRCODE = '22023';
  END IF;

  -- ── NOMOR ABSEN WAJIB ─────────────────────────────────────────────────
  -- Inilah pengganti NISN. Tanpa nilai ini, aturan "satu nomor absen satu
  -- siswa" tidak dapat ditegakkan, karena semua siswa tanpa nomor akan
  -- dianggap sama (atau sama-sama kosong).
  IF v_absen IS NULL THEN
    RAISE EXCEPTION 'Nomor absen wajib diisi.' USING ERRCODE = '22023';
  END IF;

  -- Hanya angka, supaya "01" dan "1" tidak dianggap dua siswa berbeda.
  -- Tanpa pemeriksaan ini, guru yang mengetik "01" pada satu siswa dan "1"
  -- pada siswa lain akan membuat dua akun untuk orang yang sama.
  IF v_absen !~ '^[0-9]{1,3}$' THEN
    RAISE EXCEPTION 'Nomor absen harus berupa angka (1–3 digit). Yang diisi: %.', v_absen
      USING ERRCODE = '22023';
  END IF;

  -- Samakan bentuknya: "01" dan "001" menjadi "1", sehingga tidak mungkin
  -- ada dua siswa berbeda hanya karena penulisan nol di depan.
  v_absen := (v_absen::INT)::TEXT;

  -- Tolak lebih awal dengan pesan yang dapat dibaca pengguna. Tanpa ini,
  -- pelanggaran index unik akan muncul sebagai galat database yang samar.
  IF EXISTS (
    SELECT 1 FROM public.profiles p
     WHERE p.classroom_code = v_code
       AND p.absent_number = v_absen
       AND p.role = 'student'
  ) THEN
    RAISE EXCEPTION 'Nomor absen % sudah dipakai siswa lain di kelas ini. Pilih nomor lain.', v_absen
      USING ERRCODE = '23505';
  END IF;

  IF EXISTS (SELECT 1 FROM public.profiles p WHERE lower(p.username) = v_username) THEN
    RAISE EXCEPTION 'Username % sudah ada!', v_username USING ERRCODE = '23505';
  END IF;

  IF NOT public.check_rate_limit('teacher_create_student', v_me.id::text, 200, 3600) THEN
    RAISE EXCEPTION 'Terlalu banyak pembuatan akun. Coba lagi nanti.' USING ERRCODE = '53400';
  END IF;

  v_email := v_username || '@resqbox.local';

  -- Akun Auth (email sintetis, langsung terkonfirmasi karena dibuat guru)
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data,
    confirmation_token, recovery_token, email_change_token_new, email_change
  ) VALUES (
    v_new_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    v_email, extensions.crypt(p_password, extensions.gen_salt('bf')),
    now(), now(), now(),
    jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email'),
                       'username', v_username, 'role', 'student', 'classroom_code', v_code),
    jsonb_build_object('username', v_username, 'name', trim(p_name),
                       'absent_number', v_absen,
                       'classroom_code', v_code, 'school_name', v_class.school_name),
    '', '', '', ''
  );

  -- Identitas email (wajib supaya bisa login via password)
  INSERT INTO auth.identities (
    id, user_id, provider_id, provider, identity_data,
    last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), v_new_id, v_email, 'email',
    jsonb_build_object('sub', v_new_id::text, 'email', v_email, 'email_verified', true),
    now(), now(), now()
  );

  -- Profil (trigger mungkin sudah membuatnya; pastikan tetap benar)
  INSERT INTO public.profiles (
    id, username, role, name, absent_number, classroom_code, school_name
  ) VALUES (
    v_new_id, v_username, 'student', trim(p_name), v_absen, v_code, v_class.school_name
  )
  ON CONFLICT (id) DO UPDATE SET
    name           = EXCLUDED.name,
    absent_number  = EXCLUDED.absent_number,
    classroom_code = EXCLUDED.classroom_code,
    school_name    = EXCLUDED.school_name;

  RETURN jsonb_build_object(
    'success', true,
    'student', jsonb_build_object(
      'id', v_new_id,
      'user_id', v_new_id,
      'classroom_code', v_code,
      'name', trim(p_name),
      'username', v_username,
      'class_name', v_class.name,
      'absent_number', v_absen,
      'unlocked_level', 1,
      'avatar_config', '{}'::jsonb
    )
  );

EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'Username % atau nomor absen % sudah terdaftar.', v_username, v_absen
      USING ERRCODE = '23505';
END $$;


REVOKE ALL ON FUNCTION public.teacher_create_student(TEXT, TEXT, TEXT, TEXT, TEXT)
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.teacher_create_student(TEXT, TEXT, TEXT, TEXT, TEXT)
  TO authenticated;

-- Cabut versi 6-argumen (yang memakai NISN) bila masih ada, supaya tidak ada
-- jalur pembuatan akun yang melewati pemeriksaan nomor absen.
DROP FUNCTION IF EXISTS public.teacher_create_student(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT);


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
