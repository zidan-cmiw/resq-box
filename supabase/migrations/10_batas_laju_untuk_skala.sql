-- ══════════════════════════════════════════════════════════════════════════
-- 10. SESUAIKAN BATAS LAJU AGAR SIAP UNTUK BANYAK PEMAIN
-- ══════════════════════════════════════════════════════════════════════════
--
-- TEMUAN DARI UJI BEBAN
--   `scripts/uji_beban.mjs` mengirim permintaan bersamaan ke Supabase.
--   Hasilnya:
--
--       300 permintaan bersamaan  ->  p95 hanya 860 ms, 0 gagal kapasitas
--       1000 permintaan bersamaan ->  latensi tetap di bawah 1 detik
--
--   Server Supabase SANGAT SANGGUP. Yang membatasi bukan kapasitas, melainkan
--   BATAS LAJU yang kita pasang sendiri. Setiap kegagalan yang muncul berisi:
--
--       {"code":"53400","message":"Terlalu banyak permintaan."}
--
--   Itu batas laju, bukan server kewalahan. Dua di antaranya terlalu ketat
--   untuk dipakai di sekolah, dan diperbaiki di berkas ini.
--
--
-- MASALAH 1 — GURU TIDAK BISA MEMBUAT AKUN UNTUK SATU SEKOLAH
--
--   Batas sebelumnya: `teacher_create_student` = 200 akun per jam PER GURU.
--
--   Akibatnya, bila satu guru menangani beberapa kelas:
--
--       1 kelas  (32 siswa)  ->  10 menit   cukup
--       3 kelas  (96 siswa)  ->  29 menit   cukup
--       5 kelas  (160 siswa) ->  48 menit   mulai terasa
--      10 kelas (320 siswa) ->  1,6 JAM     TERHENTI di akun ke-200
--      1000 siswa           ->  5 JAM       tidak masuk akal
--
--   Guru akan terhenti di tengah pekerjaan dan harus menunggu satu jam.
--   Itu tidak dapat diterima untuk aplikasi yang menargetkan seluruh sekolah.
--
--   PERBAIKAN: dinaikkan menjadi 2000 per jam per guru.
--     - Cukup untuk 1000 siswa dalam satu jam, bahkan oleh satu guru.
--     - Risiko penyalahgunaan tetap kecil: fungsi ini WAJIB login sebagai
--       guru, dan hanya boleh menambah siswa ke kelas yang dia ampu.
--       Jadi yang dapat menyalahkannya hanyalah guru terverifikasi.
--
--
-- MASALAH 2 — "KODE KELAS" DIPAKAI BERSAMA SELURUH DUNIA
--
--   Dua fungsi yang boleh dipanggil tanpa login memakai:
--
--       check_rate_limit('class_code_info', COALESCE(auth.uid()::text, 'anon'), 30, 60)
--
--   Ketika belum login, `auth.uid()` bernilai NULL sehingga subjeknya menjadi
--   teks 'anon' — dan itu SATU EMBER BERSAMA untuk SELURUH PENGUNJUNG.
--
--   Artinya bila 31 orang di seluruh dunia memanggil `class_code_info` dalam
--   60 detik yang sama, orang ke-31 DITOLAK — walaupun mereka sama sekali
--   tidak berhubungan.
--
--   Dampaknya sekarang: KECIL, karena kedua fungsi itu hanya dipakai saat
--   pendaftaran mandiri, dan pendaftaran mandiri sudah ditutup.
--
--   Dampaknya bila pendaftaran dibuka lagi: BESAR. Satu sekolah yang
--   mendaftar serentak akan saling mengunci. Karena itu batasnya dinaikkan
--   sebagai jaring pengaman, dan keadaan ini DICATAT di sini supaya tidak
--   terlupa bila pendaftaran dibuka kembali.
--
--   PERBAIKAN: dinaikkan menjadi 300 per menit. Cukup untuk satu sekolah
--   besar yang mendaftar serentak, tetap membatasi penyalahgunaan otomatis.
--
--
-- YANG TIDAK DIUBAH
--   Batas untuk tindakan yang mengubah data milik orang lain TETAP KETAT,
--   karena di situlah penyalahgunaan paling berbahaya:
--       update_profile      : 60 per menit  (tetap)
--       submit_result       : 30 per menit  (tetap)
--       create_classroom    : 20 per jam    (tetap)
--       delete_classroom    : 10 per jam    (tetap)
--       delete_student      : 60 per jam    (tetap)
--
--   Yang dinaikkan hanya jalur PEMBUATAN yang memang perlu banyak sekaligus.
--
-- Aman dijalankan berulang. Jalankan di Supabase SQL Editor.
-- ══════════════════════════════════════════════════════════════════════════

-- ── 1. Guru membuat akun siswa: 200/jam -> 2000/jam ───────────────────────
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

  IF v_absen IS NULL THEN
    RAISE EXCEPTION 'Nomor absen wajib diisi.' USING ERRCODE = '22023';
  END IF;

  IF v_absen !~ '^[0-9]{1,3}$' THEN
    RAISE EXCEPTION 'Nomor absen harus berupa angka (1–3 digit). Yang diisi: %.', v_absen
      USING ERRCODE = '22023';
  END IF;

  v_absen := (v_absen::INT)::TEXT;

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

  -- ── BATAS LAJU DINAIKKAN ───────────────────────────────────────────────
  -- 200/jam terbukti terlalu ketat: satu guru dengan 10 kelas akan terhenti
  -- di akun ke-200, yaitu sekitar kelas ke-7. Dinaikkan menjadi 2000/jam.
  -- Risiko tetap kecil karena fungsi ini wajib login sebagai guru dan hanya
  -- boleh menambah siswa ke kelas yang dia ampu.
  IF NOT public.check_rate_limit('teacher_create_student', v_me.id::text, 2000, 3600) THEN
    RAISE EXCEPTION 'Terlalu banyak pembuatan akun dalam satu jam. Coba lagi nanti.'
      USING ERRCODE = '53400';
  END IF;

  v_email := v_username || '@resqbox.local';

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

  INSERT INTO auth.identities (
    id, user_id, provider_id, provider, identity_data,
    last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), v_new_id, v_email, 'email',
    jsonb_build_object('sub', v_new_id::text, 'email', v_email, 'email_verified', true),
    now(), now(), now()
  );

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
      'id', v_new_id, 'user_id', v_new_id, 'classroom_code', v_code,
      'name', trim(p_name), 'username', v_username, 'class_name', v_class.name,
      'absent_number', v_absen, 'unlocked_level', 1, 'avatar_config', '{}'::jsonb
    )
  );

EXCEPTION
  WHEN unique_violation THEN
    IF SQLERRM LIKE '%profiles_kelas_absen_key%' THEN
      RAISE EXCEPTION 'Nomor absen % sudah dipakai siswa lain di kelas ini. Pilih nomor lain.', v_absen
        USING ERRCODE = '23505';
    ELSIF SQLERRM LIKE '%profiles_username_lower_key%' THEN
      RAISE EXCEPTION 'Username % sudah ada! Pilih username lain.', v_username
        USING ERRCODE = '23505';
    ELSIF SQLERRM LIKE '%users_email_key%' OR SQLERRM LIKE '%identities%' THEN
      RAISE EXCEPTION 'Username % sudah terdaftar sebagai akun.', v_username
        USING ERRCODE = '23505';
    ELSE
      RAISE EXCEPTION 'Data siswa bentrok dengan data yang sudah ada (%).', SQLERRM
        USING ERRCODE = '23505';
    END IF;
END $$;

REVOKE ALL ON FUNCTION public.teacher_create_student(TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.teacher_create_student(TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;


-- ── 2. Kode kelas & nama pengguna: 30/menit -> 300/menit ──────────────────
--
-- Memakai subjek 'anon' berarti SATU ember bersama seluruh pengunjung belum
-- login. Dinaikkan sebagai jaring pengaman bila pendaftaran mandiri dibuka
-- kembali. Kedua fungsi ini hanya mengembalikan boolean / nama kelas, jadi
-- tidak membocorkan data dan aman dinaikkan.
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
  IF NOT public.check_rate_limit('username_available', COALESCE(auth.uid()::text, 'anon'), 300, 60) THEN
    RAISE EXCEPTION 'Terlalu banyak permintaan. Coba lagi sebentar lagi.'
      USING ERRCODE = '53400';
  END IF;
  RETURN NOT EXISTS (SELECT 1 FROM public.profiles WHERE lower(username) = v_u);
END $$;

REVOKE ALL ON FUNCTION public.username_available(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.username_available(TEXT) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.class_code_info(p_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_class public.classrooms%ROWTYPE;
BEGIN
  IF NOT public.check_rate_limit('class_code_info', COALESCE(auth.uid()::text, 'anon'), 300, 60) THEN
    RAISE EXCEPTION 'Terlalu banyak permintaan. Coba lagi sebentar lagi.'
      USING ERRCODE = '53400';
  END IF;

  SELECT * INTO v_class FROM public.classrooms WHERE code = upper(trim(p_code));
  IF NOT FOUND THEN
    RETURN jsonb_build_object('found', false);
  END IF;
  RETURN jsonb_build_object(
    'found', true,
    'name', v_class.name,
    'school_name', v_class.school_name
  );
END $$;

REVOKE ALL ON FUNCTION public.class_code_info(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.class_code_info(TEXT) TO anon, authenticated;


-- ══════════════════════════════════════════════════════════════════════════
-- VERIFIKASI
-- ══════════════════════════════════════════════════════════════════════════
--
-- Pastikan batas barunya terbaca:
--
--   SELECT p.proname,
--          pg_get_functiondef(p.oid) ~ '2000, 3600' AS batas_guru_2000,
--          pg_get_functiondef(p.oid) ~ '300, 60'    AS batas_anon_300
--     FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
--    WHERE n.nspname = 'public'
--      AND p.proname IN ('teacher_create_student', 'username_available', 'class_code_info')
--    ORDER BY p.proname;
--
-- Lalu jalankan ulang uji beban dari repositori:
--
--   node scripts/uji_beban.mjs --max 100
--
-- Bandingkan: sebelum berkas ini, permintaan ke-25 sudah mulai ditolak.
