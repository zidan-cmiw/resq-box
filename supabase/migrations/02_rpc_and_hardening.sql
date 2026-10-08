-- ══════════════════════════════════════════════════════════════════════════
-- RESQ-BOX — MIGRASI 02: RPC AMAN + PENUTUPAN LUBANG OTORISASI + HARDENING
-- Jalankan SETELAH 01_secure_schema.sql. Idempoten.
--
-- Yang diperbaiki di sini:
--   • 11 RPC lama yang terbuka untuk `anon` TANPA cek otorisasi → dibuang.
--   • Semua RPC baru: SECURITY DEFINER + cek auth.uid()/peran + SET search_path
--     + rate limit. anon hanya boleh memanggil 2 fungsi publik yang tidak
--     membocorkan data (cek ketersediaan username & cek kode kelas).
--   • Nilai (score) & unlocked_level dihitung di server, bukan dari klien.
-- ══════════════════════════════════════════════════════════════════════════

-- ══════════════════════════════════════════════════════════════════════════
-- 1. BUANG RPC LAMA YANG BERBAHAYA
-- ══════════════════════════════════════════════════════════════════════════
-- verify_login / register_* / rpc_* lama: SECURITY DEFINER + GRANT ke anon +
-- tanpa otorisasi = siapa pun bisa membuat akun guru dan menghapus seluruh
-- kelas. Semuanya dihapus. Penggantinya memakai Supabase Auth.
DROP FUNCTION IF EXISTS public.verify_login(TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS public.register_student_account(TEXT, TEXT, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS public.register_teacher_account(TEXT, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS public.create_student_by_teacher(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS public.rpc_upsert_student(JSONB);
DROP FUNCTION IF EXISTS public.rpc_insert_submission(JSONB);
DROP FUNCTION IF EXISTS public.rpc_create_classroom(TEXT, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS public.rpc_update_classroom_name(TEXT, TEXT);
DROP FUNCTION IF EXISTS public.rpc_delete_classroom(TEXT);
DROP FUNCTION IF EXISTS public.rpc_delete_student(UUID);
DROP FUNCTION IF EXISTS public.rpc_update_teacher_profile(TEXT, TEXT, TEXT);

-- `CREATE OR REPLACE FUNCTION` hanya mengganti fungsi dengan SIGNATURE yang
-- sama. Versi lama `submit_level_result` hanya punya 4 argumen (tanpa
-- `p_client_score`), jadi versi 5-argumen akan dibuat sebagai fungsi BARU dan
-- versi lama tetap tertinggal — yang membuat GRANT/REVOKE di bawah menunjuk
-- fungsi yang salah. Lepas versi lamanya secara eksplisit.
DROP FUNCTION IF EXISTS public.submit_level_result(INT, INT, JSONB, BOOLEAN);
DROP FUNCTION IF EXISTS public.official_level_score(INT, INT);

-- Trigger harus dilepas SEBELUM fungsinya, karena trigger bergantung padanya.
-- Keduanya dibuat ulang oleh migrasi 01.
DROP TRIGGER IF EXISTS trg_on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_auth_user();

-- ══════════════════════════════════════════════════════════════════════════
-- 2. PEMBATAS LAJU (anti brute-force & anti banjir perintah)
-- ══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.rate_limits (
  bucket       TEXT NOT NULL,
  subject      TEXT NOT NULL,
  window_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  hits         INT NOT NULL DEFAULT 0,
  PRIMARY KEY (bucket, subject)
);

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits FORCE ROW LEVEL SECURITY;
REVOKE ALL ON public.rate_limits FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_bucket    TEXT,
  p_subject   TEXT,
  p_max_hits  INT,
  p_window_s  INT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_row public.rate_limits%ROWTYPE;
BEGIN
  INSERT INTO public.rate_limits (bucket, subject, window_start, hits)
  VALUES (p_bucket, p_subject, now(), 1)
  ON CONFLICT (bucket, subject) DO UPDATE
    SET hits = CASE
                 WHEN public.rate_limits.window_start < now() - make_interval(secs => p_window_s)
                   THEN 1
                 ELSE public.rate_limits.hits + 1
               END,
        window_start = CASE
                 WHEN public.rate_limits.window_start < now() - make_interval(secs => p_window_s)
                   THEN now()
                 ELSE public.rate_limits.window_start
               END
  RETURNING * INTO v_row;

  RETURN v_row.hits <= p_max_hits;
END $$;

REVOKE ALL ON FUNCTION public.check_rate_limit(TEXT, TEXT, INT, INT) FROM PUBLIC, anon, authenticated;

-- Pembersihan berkala baris rate limit yang kedaluwarsa (dipanggil sesekali)
CREATE OR REPLACE FUNCTION public.prune_rate_limits()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  DELETE FROM public.rate_limits WHERE window_start < now() - interval '1 day';
$$;
REVOKE ALL ON FUNCTION public.prune_rate_limits() FROM PUBLIC, anon, authenticated;

-- ══════════════════════════════════════════════════════════════════════════
-- 3. FUNGSI PUBLIK (anon boleh — sengaja dibuat tidak membocorkan data)
-- ══════════════════════════════════════════════════════════════════════════

-- 3a. Cek ketersediaan username (untuk form registrasi).
--     Hanya mengembalikan boolean, bukan daftar akun.
CREATE OR REPLACE FUNCTION public.username_available(p_username TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_u TEXT := lower(trim(p_username));
BEGIN
  IF v_u !~ '^[a-z0-9._-]{3,30}$' THEN
    RETURN false;
  END IF;
  IF NOT public.check_rate_limit('username_available', COALESCE(auth.uid()::text, 'anon'), 30, 60) THEN
    RAISE EXCEPTION 'Terlalu banyak permintaan. Coba lagi sebentar lagi.'
      USING ERRCODE = '53400';
  END IF;
  RETURN NOT EXISTS (SELECT 1 FROM public.profiles WHERE lower(username) = v_u);
END $$;

-- 3b. Cek kode kelas (untuk form registrasi).
--     Mengembalikan HANYA nama sekolah/kelas, bukan seluruh baris kelas.
CREATE OR REPLACE FUNCTION public.class_code_info(p_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_class public.classrooms%ROWTYPE;
BEGIN
  IF NOT public.check_rate_limit('class_code_info', COALESCE(auth.uid()::text, 'anon'), 30, 60) THEN
    RAISE EXCEPTION 'Terlalu banyak permintaan. Coba lagi sebentar lagi.'
      USING ERRCODE = '53400';
  END IF;

  SELECT * INTO v_class FROM public.classrooms WHERE code = upper(trim(p_code));
  IF NOT FOUND THEN
    RETURN jsonb_build_object('found', false);
  END IF;

  RETURN jsonb_build_object(
    'found', true,
    'code', v_class.code,
    'name', v_class.name,
    'school_name', v_class.school_name
  );
END $$;

-- 3c. Pratinjau akun lama (untuk alur migrasi password).
--     TIDAK pernah mengembalikan hash; hanya "perlu migrasi atau tidak".
CREATE OR REPLACE FUNCTION public.legacy_account_exists(p_username TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_u TEXT := lower(trim(p_username));
BEGIN
  IF NOT public.check_rate_limit('legacy_check', COALESCE(auth.uid()::text, 'anon'), 10, 300) THEN
    RAISE EXCEPTION 'Terlalu banyak permintaan. Coba lagi beberapa menit lagi.'
      USING ERRCODE = '53400';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.tables
                 WHERE table_schema = 'public' AND table_name = 'user_accounts') THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1 FROM public.user_accounts ua
    WHERE lower(ua.username) = v_u
      AND NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = ua.id)
  );
END $$;

-- ══════════════════════════════════════════════════════════════════════════
-- 4. RPC UNTUK PENGGUNA YANG SUDAH LOGIN
-- ══════════════════════════════════════════════════════════════════════════

-- 4a. Profil milik sendiri (termasuk peran & level) — tidak bisa membaca orang lain.
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

-- 4b. Mengubah profil sendiri. Peran/kelas/level DIABAIKAN walau dikirim klien.
CREATE OR REPLACE FUNCTION public.update_my_profile(p_data JSONB)
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

  IF NOT public.check_rate_limit('update_profile', auth.uid()::text, 60, 60) THEN
    RAISE EXCEPTION 'Terlalu banyak perubahan profil. Coba lagi nanti.'
      USING ERRCODE = '53400';
  END IF;

  UPDATE public.profiles SET
    name          = COALESCE(NULLIF(trim(COALESCE(p_data->>'name', '')), ''), name),
    school_name   = COALESCE(NULLIF(trim(COALESCE(p_data->>'school_name', '')), ''), school_name),
    absent_number = COALESCE(NULLIF(trim(COALESCE(p_data->>'absent_number', '')), ''), absent_number),
    avatar_config = COALESCE(p_data->'avatar_config', avatar_config)
  WHERE id = auth.uid()
  RETURNING * INTO v;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profil tidak ditemukan.' USING ERRCODE = 'P0002';
  END IF;

  RETURN jsonb_build_object('success', true, 'profile', to_jsonb(v) - 'password');
END $$;

-- 4c. Kode kelas milik sendiri (untuk form registrasi: kode harus valid)
CREATE OR REPLACE FUNCTION public.class_exists(p_code TEXT)
RETURNS BOOLEAN
LANGUAGE sql STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (SELECT 1 FROM public.classrooms WHERE code = upper(trim(p_code)));
$$;

-- ══════════════════════════════════════════════════════════════════════════
-- 5. NILAI & KEMAJUAN — DIHITUNG SERVER
-- ══════════════════════════════════════════════════════════════════════════

-- 5a. Nilai resmi per level. Satu-satunya sumber kebenaran.
--     Level 1: 8 area geologis (12,5 poin per area).
--     Level 2: 6 area mitigasi (35 / 70 / 85 / 100 / 100 / 100).
--     Level 3: 20 misi (5 poin per misi).
--
--     Skor akhir = MAKSIMUM antara nilai resmi berbasis capaian dan nilai
--     yang dilaporkan klien. Alasannya: capaian (jumlah misi/kata) boleh
--     dilaporkan klien, tapi bila laporan itu lebih rendah daripada poin
--     yang sudah pasti ia raih, pakai angka resmi yang lebih tinggi supaya
--     siswa tidak dihukum karena urutan sinkronisasi.
CREATE OR REPLACE FUNCTION public.official_level_score(p_level INT, p_missions INT)
RETURNS INT
LANGUAGE sql IMMUTABLE
AS $$
  SELECT CASE
    WHEN p_level = 1 THEN CASE
      WHEN p_missions >= 8 THEN 100
      ELSE GREATEST(0, LEAST(100, ROUND(p_missions * 12.5)::INT))
    END
    WHEN p_level = 2 THEN CASE
      WHEN p_missions >= 6 THEN 100
      ELSE (ARRAY[0, 35, 70, 85, 100, 100])[GREATEST(0, LEAST(5, p_missions)) + 1]
    END
    WHEN p_level = 3 THEN GREATEST(0, LEAST(100, p_missions * 5))
    ELSE 0
  END;
$$;

-- 5b. Catat hasil level. Klien HANYA mengirim "apa yang dicapai";
--     nilai & level akhir ditentukan server.
CREATE OR REPLACE FUNCTION public.submit_level_result(
  p_level          INT,
  p_missions       INT,
  p_details        JSONB DEFAULT '{}'::jsonb,
  p_is_completed   BOOLEAN DEFAULT false,
  p_client_score   INT DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_me          public.profiles%ROWTYPE;
  v_missions    INT;
  v_server      INT;
  v_score       INT;
  v_new_unlock  INT;
  v_sub_id      UUID;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Harus login.' USING ERRCODE = '28000';
  END IF;

  IF p_level NOT BETWEEN 1 AND 3 THEN
    RAISE EXCEPTION 'Level tidak valid.' USING ERRCODE = '22023';
  END IF;

  IF NOT public.check_rate_limit('submit_result', auth.uid()::text, 30, 60) THEN
    RAISE EXCEPTION 'Terlalu banyak pengiriman nilai. Tunggu sebentar.'
      USING ERRCODE = '53400';
  END IF;

  SELECT * INTO v_me FROM public.profiles WHERE id = auth.uid();
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profil tidak ditemukan.' USING ERRCODE = 'P0002';
  END IF;

  -- Batas atas jumlah capaian supaya tidak bisa dilebih-lebihkan
  v_missions := GREATEST(0, LEAST(COALESCE(p_missions, 0),
                    CASE p_level WHEN 1 THEN 8 WHEN 2 THEN 6 ELSE 20 END));

  v_server := public.official_level_score(p_level, v_missions);

  -- Ambil yang lebih tinggi antara hitungan server dan laporan klien,
  -- tapi klien tetap tidak bisa melewati 100 atau melompati tahapan.
  v_score := GREATEST(
    v_server,
    LEAST(100, GREATEST(0, COALESCE(p_client_score, 0)))
  );

  -- Klaim "selesai" tanpa capaian apa pun tidak dihitung
  IF v_missions = 0 AND v_score < 100 THEN
    v_score := 0;
  END IF;
  IF p_is_completed AND v_missions = 0 THEN
    v_score := 0;
  END IF;

  -- Nama & kelas diambil dari profil, bukan dari klien (anti-spoofing)
  INSERT INTO public.level_submissions
    (student_id, student_name, classroom_code, level_number, score, details)
  VALUES
    (v_me.id, v_me.name, COALESCE(v_me.classroom_code, 'RESQ-8A'),
     p_level, v_score,
     COALESCE(p_details, '{}'::jsonb) || jsonb_build_object('missions', v_missions))
  RETURNING id INTO v_sub_id;

  -- Naik level HANYA bila nilai resmi 100
  v_new_unlock := v_me.unlocked_level;
  IF v_score >= 100 AND p_level < 3 THEN
    v_new_unlock := GREATEST(v_new_unlock, p_level + 1);
    UPDATE public.profiles
       SET unlocked_level = v_new_unlock
     WHERE id = v_me.id AND unlocked_level < v_new_unlock;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'submission_id', v_sub_id,
    'score', v_score,
    'missions', v_missions,
    'unlocked_level', v_new_unlock
  );
END $$;

-- 5c. Progres milik sendiri saja.
CREATE OR REPLACE FUNCTION public.get_my_progress()
RETURNS JSONB
LANGUAGE sql STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT COALESCE(jsonb_agg(row_to_json(s) ORDER BY s.level_number), '[]'::jsonb)
  FROM (
    SELECT level_number, MAX(score) AS score, MAX(completed_at) AS completed_at
    FROM public.level_submissions
    WHERE student_id = auth.uid()
    GROUP BY level_number
  ) s;
$$;

-- ══════════════════════════════════════════════════════════════════════════
-- 6. RPC GURU / ADMIN (wajib peran, wajib kepemilikan kelas)
-- ══════════════════════════════════════════════════════════════════════════

-- 6a. Kelas yang saya ampu (guru) atau semua (admin).
CREATE OR REPLACE FUNCTION public.list_my_classrooms()
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
    RETURN '[]'::jsonb;
  END IF;

  IF v_me.is_admin OR v_me.role = 'admin' THEN
    RETURN (SELECT COALESCE(jsonb_agg(to_jsonb(c) ORDER BY c.code), '[]'::jsonb)
            FROM public.classrooms c);
  END IF;

  IF v_me.role <> 'teacher' THEN
    RAISE EXCEPTION 'Hanya guru yang boleh melihat daftar kelas.' USING ERRCODE = '42501';
  END IF;

  RETURN (SELECT COALESCE(jsonb_agg(to_jsonb(c) ORDER BY c.code), '[]'::jsonb)
          FROM public.classrooms c WHERE c.teacher_username = v_me.username);
END $$;

-- 6b. Buat kelas baru (guru membuat kelas miliknya sendiri).
CREATE OR REPLACE FUNCTION public.create_my_classroom(
  p_code TEXT,
  p_name TEXT DEFAULT 'Kelas VIII-A',
  p_school TEXT DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_me   public.profiles%ROWTYPE;
  v_code TEXT := upper(trim(p_code));
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Harus login.' USING ERRCODE = '28000';
  END IF;

  SELECT * INTO v_me FROM public.profiles WHERE id = auth.uid();
  IF NOT FOUND OR NOT (v_me.role IN ('teacher', 'admin') OR v_me.is_admin) THEN
    RAISE EXCEPTION 'Hanya guru yang boleh membuat kelas.' USING ERRCODE = '42501';
  END IF;

  IF v_code !~ '^[A-Z0-9-]{2,20}$' THEN
    RAISE EXCEPTION 'Format kode kelas tidak valid.' USING ERRCODE = '22023';
  END IF;

  IF NOT public.check_rate_limit('create_classroom', v_me.id::text, 20, 3600) THEN
    RAISE EXCEPTION 'Terlalu banyak pembuatan kelas.' USING ERRCODE = '53400';
  END IF;

  INSERT INTO public.classrooms (code, name, teacher_username, school_name)
  VALUES (v_code, COALESCE(NULLIF(trim(p_name), ''), 'Kelas VIII-A'),
          v_me.username, COALESCE(NULLIF(trim(COALESCE(p_school, '')), ''), v_me.school_name, 'SMP Negeri 1'))
  ON CONFLICT (code) DO NOTHING;

  IF NOT EXISTS (SELECT 1 FROM public.classrooms c
                 WHERE c.code = v_code AND c.teacher_username = v_me.username) THEN
    RAISE EXCEPTION 'Kode kelas sudah dipakai.' USING ERRCODE = '23505';
  END IF;

  RETURN jsonb_build_object('success', true, 'code', v_code);
END $$;

-- 6c. Ganti nama kelas (hanya pemilik / admin)
CREATE OR REPLACE FUNCTION public.rename_my_classroom(p_code TEXT, p_name TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_me   public.profiles%ROWTYPE;
  v_rows INT;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Harus login.' USING ERRCODE = '28000';
  END IF;

  SELECT * INTO v_me FROM public.profiles WHERE id = auth.uid();
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profil tidak ditemukan.' USING ERRCODE = 'P0002';
  END IF;

  UPDATE public.classrooms
     SET name = COALESCE(NULLIF(trim(p_name), ''), name)
   WHERE code = upper(trim(p_code))
     AND (v_me.is_admin OR v_me.role = 'admin' OR teacher_username = v_me.username);
  GET DIAGNOSTICS v_rows = ROW_COUNT;

  IF v_rows = 0 THEN
    RAISE EXCEPTION 'Kelas tidak ditemukan atau bukan milik Anda.' USING ERRCODE = '42501';
  END IF;

  RETURN jsonb_build_object('success', true);
END $$;

-- 6d. Hapus kelas + seluruh siswa & nilainya (hanya pemilik / admin)
CREATE OR REPLACE FUNCTION public.delete_my_classroom(p_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_me   public.profiles%ROWTYPE;
  v_code TEXT := upper(trim(p_code));
  v_students INT := 0;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Harus login.' USING ERRCODE = '28000';
  END IF;

  SELECT * INTO v_me FROM public.profiles WHERE id = auth.uid();
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profil tidak ditemukan.' USING ERRCODE = 'P0002';
  END IF;

  IF NOT (v_me.is_admin OR v_me.role = 'admin'
          OR EXISTS (SELECT 1 FROM public.classrooms c
                     WHERE c.code = v_code AND c.teacher_username = v_me.username)) THEN
    RAISE EXCEPTION 'Kelas bukan milik Anda.' USING ERRCODE = '42501';
  END IF;

  IF NOT public.check_rate_limit('delete_classroom', v_me.id::text, 10, 3600) THEN
    RAISE EXCEPTION 'Terlalu banyak penghapusan.' USING ERRCODE = '53400';
  END IF;

  SELECT count(*) INTO v_students FROM public.profiles
   WHERE classroom_code = v_code AND role = 'student';

  -- Akun auth milik siswa kelas ini ikut dihapus (cascade ke profiles & nilai)
  DELETE FROM auth.users
   WHERE id IN (SELECT id FROM public.profiles
                 WHERE classroom_code = v_code AND role = 'student');

  DELETE FROM public.profiles WHERE classroom_code = v_code AND role = 'student';
  DELETE FROM public.classrooms WHERE code = v_code;

  RETURN jsonb_build_object('success', true, 'students_removed', v_students);
END $$;

-- 6e. Hapus 1 siswa (hanya dari kelas yang saya ampu / admin)
CREATE OR REPLACE FUNCTION public.delete_my_student(p_student_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
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

  IF NOT public.can_read_student(p_student_id) OR p_student_id = v_me.id THEN
    RAISE EXCEPTION 'Siswa tidak ditemukan atau di luar kelas Anda.' USING ERRCODE = '42501';
  END IF;

  IF NOT public.check_rate_limit('delete_student', v_me.id::text, 60, 3600) THEN
    RAISE EXCEPTION 'Terlalu banyak penghapusan.' USING ERRCODE = '53400';
  END IF;

  DELETE FROM auth.users WHERE id = p_student_id;
  DELETE FROM public.profiles WHERE id = p_student_id;

  RETURN jsonb_build_object('success', true);
END $$;

-- 6f. Rekap siswa kelas saya (guru) / semua (admin).
--     Mengembalikan data yang boleh dilihat guru — TANPA kolom password.
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

-- 6g. Rekap nilai kelas saya (guru) / semua (admin).
CREATE OR REPLACE FUNCTION public.list_class_submissions(p_code TEXT)
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
      RAISE EXCEPTION 'Hanya guru yang boleh melihat rekap nilai.' USING ERRCODE = '42501';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM public.classrooms c
                   WHERE c.code = upper(trim(p_code)) AND c.teacher_username = v_me.username) THEN
      RAISE EXCEPTION 'Kelas bukan milik Anda.' USING ERRCODE = '42501';
    END IF;
  END IF;

  RETURN (
    SELECT COALESCE(jsonb_agg(row_to_json(s) ORDER BY s.completed_at DESC), '[]'::jsonb)
    FROM (
      SELECT id, student_id, student_name, classroom_code, level_number,
             score, details, completed_at
      FROM public.level_submissions
      WHERE classroom_code = upper(trim(p_code))
    ) s
  );
END $$;

-- 6h. Guru mengubah nama sekolahnya sendiri (admin boleh siapa saja).
CREATE OR REPLACE FUNCTION public.update_my_teacher_profile(
  p_name TEXT DEFAULT NULL,
  p_school TEXT DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_me public.profiles%ROWTYPE;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Harus login.' USING ERRCODE = '28000';
  END IF;

  UPDATE public.profiles
     SET name        = COALESCE(NULLIF(trim(COALESCE(p_name, '')), ''), name),
         school_name = COALESCE(NULLIF(trim(COALESCE(p_school, '')), ''), school_name)
   WHERE id = auth.uid()
   RETURNING * INTO v_me;

  RETURN jsonb_build_object('success', true, 'profile', to_jsonb(v_me));
END $$;

-- ══════════════════════════════════════════════════════════════════════════
-- 7. HARDENING UMUM
-- ══════════════════════════════════════════════════════════════════════════

-- 7a. Cabut hak bawaan PUBLIC (default Postgres = semua orang boleh jalan)
--     HANYA untuk fungsi milik proyek ini. Penting: jangan menyapu seluruh
--     skema public, karena Supabase menaruh fungsi internalnya di sana dan
--     mencabut haknya bisa merusak auth/storage.
DO $$
DECLARE
  sig  TEXT;                                  -- variabel loop FOREACH
  sigs TEXT[] := ARRAY[
    'public.username_available(text)',
    'public.class_code_info(text)',
    'public.legacy_account_exists(text)',
    'public.get_my_profile()',
    'public.update_my_profile(jsonb)',
    'public.get_my_progress()',
    'public.class_exists(text)',
    'public.submit_level_result(integer,integer,jsonb,boolean,integer)',
    'public.official_level_score(integer,integer)',
    'public.list_my_classrooms()',
    'public.create_my_classroom(text,text,text)',
    'public.rename_my_classroom(text,text)',
    'public.delete_my_classroom(text)',
    'public.delete_my_student(uuid)',
    'public.list_class_students(text)',
    'public.list_class_submissions(text)',
    'public.update_my_teacher_profile(text,text)',
    'public.is_teacher()',
    'public.is_admin()',
    'public.is_class_member(text)',
    'public.can_read_student(uuid)'
  ];
BEGIN
  FOREACH sig IN ARRAY sigs LOOP
    BEGIN
      EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC', sig);
    EXCEPTION WHEN undefined_function THEN
      RAISE NOTICE 'Fungsi % belum ada — dilewati.', sig;
    END;
  END LOOP;
END $$;

-- Fungsi bantu otorisasi: `anon` TIDAK boleh, tetapi `authenticated` HARUS boleh.
--
-- PENTING (pelajaran dari bug nyata):
--   PostgreSQL mengevaluasi ekspresi policy `USING (...)` sebagai PERAN YANG
--   MEMINTA — yaitu `authenticated` — bukan sebagai pemilik tabel. Jadi fungsi
--   yang dipanggil di dalam policy WAJIB boleh dieksekusi oleh peran tersebut.
--   Mencabutnya dari `authenticated` membuat SELURUH policy gagal dengan
--   "permission denied for function can_read_student", sehingga pengguna yang
--   sudah login tidak bisa membaca datanya sendiri.
--
--   Ini tetap aman: kelima fungsi memakai auth.uid() di dalamnya, jadi
--   memanggilnya hanya mengembalikan boolean tentang DIRI SENDIRI.
DO $$
DECLARE
  -- Fungsi bantu RLS — boleh dipanggil `authenticated`, TIDAK boleh `anon`.
  sigs_auth TEXT[] := ARRAY[
    'public.is_teacher()',
    'public.is_admin()',
    'public.is_class_member(text)',
    'public.can_read_student(uuid)',
    'public.official_level_score(integer,integer)',
    'public.jwt_role()'
  ];
  -- Fungsi internal — tertutup untuk semua peran klien.
  sigs_internal TEXT[] := ARRAY[
    'public.check_rate_limit(text,text,integer,integer)',
    'public.prune_rate_limits()'
  ];
  sig TEXT;
BEGIN
  FOREACH sig IN ARRAY sigs_auth LOOP
    BEGIN
      EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon', sig);
      EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated', sig);
    EXCEPTION WHEN undefined_function THEN
      RAISE NOTICE 'Fungsi % belum ada — dilewati.', sig;
    END;
  END LOOP;

  FOREACH sig IN ARRAY sigs_internal LOOP
    BEGIN
      EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon, authenticated', sig);
    EXCEPTION WHEN undefined_function THEN
      RAISE NOTICE 'Fungsi % belum ada — dilewati.', sig;
    END;
  END LOOP;
END $$;

-- Hak eksplisit: hanya fungsi ini yang boleh dipanggil anon.
GRANT EXECUTE ON FUNCTION public.username_available(TEXT)   TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.class_code_info(TEXT)      TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.legacy_account_exists(TEXT) TO anon, authenticated;

-- Sisanya wajib login.
GRANT EXECUTE ON FUNCTION public.get_my_profile()                        TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_my_profile(JSONB)                TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_progress()                       TO authenticated;
GRANT EXECUTE ON FUNCTION public.class_exists(TEXT)                      TO authenticated;
GRANT EXECUTE ON FUNCTION public.submit_level_result(INT, INT, JSONB, BOOLEAN, INT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.list_my_classrooms()                    TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_my_classroom(TEXT, TEXT, TEXT)   TO authenticated;
GRANT EXECUTE ON FUNCTION public.rename_my_classroom(TEXT, TEXT)         TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_my_classroom(TEXT)               TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_my_student(UUID)                 TO authenticated;
GRANT EXECUTE ON FUNCTION public.list_class_students(TEXT)               TO authenticated;
GRANT EXECUTE ON FUNCTION public.list_class_submissions(TEXT)            TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_my_teacher_profile(TEXT, TEXT)   TO authenticated;

-- 7b. Batasi hak pada skema supaya tidak ada tabel baru yang otomatis terbuka.
REVOKE CREATE ON SCHEMA public FROM anon, authenticated;

-- 7c. Batas waktu per pernyataan untuk fungsi berat, supaya satu permintaan
--     nakal tidak menyandera koneksi. Sengaja TIDAK memakai ALTER ROLE:
--     pada Supabase peran `authenticated`/`anon` dipakai bersama oleh semua
--     aplikasi dalam satu project, jadi mengubahnya bisa berdampak ke luar.
ALTER FUNCTION public.submit_level_result(INT, INT, JSONB, BOOLEAN, INT) SET statement_timeout = '10s';
ALTER FUNCTION public.list_class_submissions(TEXT)                  SET statement_timeout = '10s';
ALTER FUNCTION public.list_class_students(TEXT)                     SET statement_timeout = '10s';

-- 7d. Statistik ulang setelah perubahan besar.
ANALYZE public.profiles;
ANALYZE public.level_submissions;
ANALYZE public.classrooms;

-- ══════════════════════════════════════════════════════════════════════════
-- 8. LAPORAN VERIFIKASI KEAMANAN
--    Jalankan query di bawah ini setelah migrasi untuk membuktikan hasilnya.
-- ══════════════════════════════════════════════════════════════════════════

-- 8a. Tabel mana yang masih punya policy "USING (true)" (harus KOSONG):
--   SELECT tablename, policyname, cmd, qual
--   FROM pg_policies
--   WHERE schemaname = 'public' AND (qual = 'true' OR with_check = 'true');
--
-- 8b. Fungsi apa saja yang masih bisa dipanggil anon (harus hanya 3 fungsi publik):
--   SELECT p.proname
--   FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
--   WHERE n.nspname = 'public'
--     AND has_function_privilege('anon', p.oid, 'EXECUTE');
--
-- 8c. Tabel dengan RLS aktif (harus semua):
--   SELECT relname, relrowsecurity, relforcerowsecurity
--   FROM pg_class WHERE relnamespace = 'public'::regnamespace AND relkind = 'r';
--
-- 8d. Bukti kebocoran password sudah tertutup — jalankan sebagai anon,
--     harus mengembalikan 0 baris / error permission denied:
--   SET ROLE anon;
--   SELECT * FROM public.user_accounts LIMIT 1;   -- harus GAGAL
--   RESET ROLE;
