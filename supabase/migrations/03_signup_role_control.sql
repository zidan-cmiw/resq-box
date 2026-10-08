-- ══════════════════════════════════════════════════════════════════════════
-- RESQ-BOX — MIGRASI 03: KONTROL PERAN SAAT SIGNUP + RPC GURU + BOOTSTRAP
-- Jalankan SETELAH 02_rpc_and_hardening.sql. Idempoten.
--
-- Menutup celah terakhir: siapa pun bisa memanggil signUp() dengan
-- options.data.role='teacher'. Sekarang peran ditentukan server:
--   • Pendaftaran mandiri (signUp) HANYA bisa menjadi 'student'.
--   • Guru dibuat oleh admin (Dashboard / SQL) dan ditandai di app_metadata.
--   • Kode kelas divalidasi di trigger; kode palsu = pendaftaran ditolak.
-- ══════════════════════════════════════════════════════════════════════════

-- ══════════════════════════════════════════════════════════════════════════
-- 1. TRIGGER SIGNUP YANG DIPERKETAT
-- ══════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_username  TEXT;
  v_role      TEXT;
  v_class     TEXT;
  v_class_ok  BOOLEAN := false;
  v_name      TEXT;
  v_absent    TEXT;
  v_school    TEXT;
BEGIN
  v_username := lower(trim(COALESCE(
    NEW.raw_app_meta_data ->> 'username',
    NEW.raw_user_meta_data ->> 'username',
    split_part(COALESCE(NEW.email, ''), '@', 1)
  )));

  -- PERAN: hanya dari app_metadata (ditulis server / admin), TIDAK PERNAH
  -- dari user_metadata yang bisa diisi sendiri oleh pemanggil signUp().
  v_role := CASE
    WHEN COALESCE(NEW.raw_app_meta_data ->> 'role', '') IN ('teacher', 'admin')
      THEN NEW.raw_app_meta_data ->> 'role'
    ELSE 'student'
  END;

  -- Bila admin membuat akun guru, kelas tidak wajib.
  IF v_role = 'student' THEN
    v_class := upper(trim(COALESCE(
      NEW.raw_app_meta_data ->> 'classroom_code',
      NEW.raw_user_meta_data ->> 'classroom_code',
      ''
    )));

    SELECT EXISTS (SELECT 1 FROM public.classrooms c WHERE c.code = v_class) INTO v_class_ok;

    IF NOT v_class_ok THEN
      RAISE EXCEPTION
        'Kode kelas "%" tidak terdaftar. Mintalah kode yang benar dari gurumu.',
        COALESCE(NULLIF(v_class, ''), '(kosong)')
        USING ERRCODE = '23514';
    END IF;
  END IF;

  -- Nama & sekolah: app_metadata menang (dibuat admin), lalu user_metadata.
  v_name := COALESCE(
    NULLIF(trim(COALESCE(NEW.raw_app_meta_data ->> 'name', '')), ''),
    NULLIF(trim(COALESCE(NEW.raw_user_meta_data ->> 'name', '')), ''),
    'Petualang RESQ'
  );
  v_absent := COALESCE(
    NULLIF(trim(COALESCE(NEW.raw_app_meta_data ->> 'absent_number', '')), ''),
    NULLIF(trim(COALESCE(NEW.raw_user_meta_data ->> 'absent_number', '')), ''),
    '1'
  );
  v_school := COALESCE(
    NULLIF(trim(COALESCE(NEW.raw_app_meta_data ->> 'school_name', '')), ''),
    NULLIF(trim(COALESCE(NEW.raw_user_meta_data ->> 'school_name', '')), ''),
    'SMP Negeri 1'
  );

  INSERT INTO public.profiles (
    id, username, role, name, absent_number, classroom_code, school_name
  ) VALUES (
    NEW.id, v_username, v_role, v_name, v_absent, v_class, v_school
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END $$;

-- ══════════════════════════════════════════════════════════════════════════
-- 2. GURU MEMBUAT AKUN SISWA (satu-satunya jalur pembuatan akun oleh guru)
--    Menulis ke auth.users karena itu satu-satunya cara membuat akun yang
--    bisa login. Fungsi ini SECURITY DEFINER + memverifikasi bahwa pemanggil
--    benar-benar guru pemilik kelas tersebut.
-- ══════════════════════════════════════════════════════════════════════════
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
                       'absent_number', trim(COALESCE(p_absent_number, '1')),
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
    v_new_id, v_username, 'student', trim(p_name),
    trim(COALESCE(p_absent_number, '1')), v_code, v_class.school_name
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    absent_number = EXCLUDED.absent_number,
    classroom_code = EXCLUDED.classroom_code,
    school_name = EXCLUDED.school_name;

  RETURN jsonb_build_object(
    'success', true,
    'student', jsonb_build_object(
      'id', v_new_id,
      'user_id', v_new_id,
      'classroom_code', v_code,
      'name', trim(p_name),
      'username', v_username,
      'class_name', v_class.name,
      'absent_number', trim(COALESCE(p_absent_number, '1')),
      'unlocked_level', 1,
      'avatar_config', '{}'::jsonb
    )
  );

EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'Username % sudah ada!', v_username USING ERRCODE = '23505';
END $$;

REVOKE ALL ON FUNCTION public.teacher_create_student(TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.teacher_create_student(TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;

-- ══════════════════════════════════════════════════════════════════════════
-- 3. FUNGSI ADMIN (dipakai lewat SQL Editor / service_role saja)
--    Tidak diberikan ke anon/authenticated: mencegah siswa menaikkan diri.
-- ══════════════════════════════════════════════════════════════════════════

-- 3a. Menjadikan seseorang admin (jalankan sebagai postgres di SQL Editor)
CREATE OR REPLACE FUNCTION public.admin_promote_to_admin(p_username TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE v_id UUID;
BEGIN
  SELECT id INTO v_id FROM public.profiles WHERE lower(username) = lower(trim(p_username));
  IF v_id IS NULL THEN
    RAISE EXCEPTION 'Pengguna % tidak ditemukan.', p_username USING ERRCODE = 'P0002';
  END IF;

  UPDATE public.profiles SET is_admin = true, role = 'admin' WHERE id = v_id;
  UPDATE auth.users
     SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', 'admin')
   WHERE id = v_id;

  RETURN jsonb_build_object('success', true, 'user_id', v_id);
END $$;

-- 3b. Menetapkan level terbuka seseorang (mis. akun demo untuk juri)
CREATE OR REPLACE FUNCTION public.admin_set_unlocked_level(p_username TEXT, p_level INT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE v_id UUID;
BEGIN
  IF p_level NOT BETWEEN 1 AND 3 THEN
    RAISE EXCEPTION 'Level harus 1–3.' USING ERRCODE = '22023';
  END IF;

  SELECT id INTO v_id FROM public.profiles WHERE lower(username) = lower(trim(p_username));
  IF v_id IS NULL THEN
    RAISE EXCEPTION 'Pengguna % tidak ditemukan.', p_username USING ERRCODE = 'P0002';
  END IF;

  UPDATE public.profiles SET unlocked_level = p_level WHERE id = v_id;
  RETURN jsonb_build_object('success', true, 'unlocked_level', p_level);
END $$;

-- Fungsi admin TIDAK boleh dipanggil dari browser.
REVOKE ALL ON FUNCTION public.admin_promote_to_admin(TEXT)   FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.admin_set_unlocked_level(TEXT, INT) FROM PUBLIC, anon, authenticated;

-- 3c. Bersihkan hash password lama setelah semua akun pindah ke Supabase Auth.
--     JANGAN dijalankan sebelum verifikasi migrasi selesai (lihat supabase/README.md).
CREATE OR REPLACE FUNCTION public.admin_purge_legacy_password_hashes()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE v_rows INT := 0;
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_schema = 'public' AND table_name = 'user_accounts'
               AND column_name = 'password') THEN
    UPDATE public.user_accounts SET password = 'REVOKED' WHERE password <> 'REVOKED';
    GET DIAGNOSTICS v_rows = ROW_COUNT;
  END IF;
  RETURN jsonb_build_object('success', true, 'rows_revoked', v_rows);
END $$;

REVOKE ALL ON FUNCTION public.admin_purge_legacy_password_hashes() FROM PUBLIC, anon, authenticated;

-- ══════════════════════════════════════════════════════════════════════════
-- 4. BOOTSTRAP: KELAS AWAL
--    Tambahkan kelas sebelum siswa boleh mendaftar (trigger memvalidasi kode).
-- ══════════════════════════════════════════════════════════════════════════
INSERT INTO public.classrooms (code, name, teacher_username, school_name)
VALUES
  ('RESQ-8A', 'Kelas VIII-A', 'guru', 'SMP Negeri 1'),
  ('RESQ-8B', 'Kelas VIII-B', 'guru', 'SMP Negeri 1')
ON CONFLICT (code) DO NOTHING;

-- ══════════════════════════════════════════════════════════════════════════
-- 5. VERIFIKASI
-- ══════════════════════════════════════════════════════════════════════════
-- a) Trigger signup sudah memakai versi baru:
--      SELECT prosrc LIKE '%HANYA bisa menjadi%' FROM pg_proc WHERE proname='handle_new_auth_user';
--
-- b) Akun yang sudah terdaftar di Supabase Auth:
--      SELECT p.username, p.role, p.classroom_code, p.unlocked_level
--      FROM public.profiles p ORDER BY p.created_at;
--
-- c) Setelah membuat akun guru via Dashboard (lihat supabase/README.md), uji:
--      SELECT public.admin_set_unlocked_level('demo', 3);   -- untuk akun juri
