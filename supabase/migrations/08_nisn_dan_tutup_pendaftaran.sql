-- ══════════════════════════════════════════════════════════════════════════
-- 08. NISN SEBAGAI IDENTITAS UNIK + PENDAFTARAN MANDIRI DITUTUP
-- ══════════════════════════════════════════════════════════════════════════
--
-- MASALAH YANG DIPERBAIKI
--   Sebelumnya SATU-SATUNYA kolom unik di tabel profiles adalah username:
--
--       CREATE UNIQUE INDEX profiles_username_lower_key
--         ON public.profiles (lower(username));
--
--   Kolom absent_number (nomor absen) TIDAK punya batasan unik. Akibatnya:
--
--     - Satu siswa dapat membuat BANYAK akun. Cukup memakai username berbeda
--       sementara nomor absennya sama, dan tidak ada satu pun aturan database
--       yang menolaknya.
--     - Setiap akun duplikat menambah 1 baris `profiles` dan sampai 3 baris
--       `level_submissions`. Inilah yang dimaksud "database jadi banyak"
--       pada masukan dosen.
--
--   Nomor absen juga bukan pengenal yang baik: nomornya diulang setiap tahun
--   ajaran dan hanya bermakna di dalam satu kelas. Dua siswa di kelas berbeda
--   boleh memiliki nomor absen yang sama, sehingga tidak dapat dijadikan unik.
--
-- PERUBAHAN PADA BERKAS INI
--   1. Tambah kolom `nisn` sebagai pengenal unik siswa.
--   2. Pasang batasan unik pada `nisn` (hanya bila terisi).
--   3. Perbarui trigger pembuatan profil agar membaca `nisn`.
--   4. Perbarui teacher_create_student agar WAJIB meminta `nisn` dan menolak
--      NISN yang sudah terpakai dengan pesan yang jelas.
--   5. Kirim `nisn` pada daftar siswa dan profil sehingga tampil di UI.
--
-- ⚠️ LANGKAH WAJIB DI LUAR SQL — TIDAK DAPAT DIKERJAKAN DARI SINI
--   Menutup pendaftaran mandiri sepenuhnya TIDAK bisa dilakukan lewat SQL.
--   Endpoint pendaftaran (GoTrue /auth/v1/signup) berjalan di luar PostgreSQL,
--   sehingga tidak ada trigger atau policy yang dapat memblokirnya.
--
--   Yang harus dilakukan di dashboard Supabase:
--
--       Authentication → Sign In / Providers → Email
--           matikan "Allow new users to sign up"
--
--   Setelah itu:
--     - Siswa tidak dapat lagi mendaftar sendiri.
--     - Guru tetap dapat membuat akun siswa, karena teacher_create_student
--       menulis LANGSUNG ke auth.users (bukan lewat endpoint signup), sehingga
--       tidak terpengaruh setelan itu.
--
--   Sampai langkah itu dilakukan, berkas ini BELUM menutup celah pendaftaran.
--
-- ⚠️ ATURAN FORMAT NISN — DIBACA SEBELUM MENGUBAH
--   Yang dapat diverifikasi: NISN adalah 10 digit angka.
--   Sumber: definisi resmi "NISN: kode pengenal identitas siswa yang bersifat
--   unik, standar, dan berlaku sepanjang masa".
--
--   Yang TIDAK diterapkan di sini: penguraian arti digitnya (mis. tiga digit
--   pertama sebagai tahun lahir) dan pemeriksaan digit pemeriksa (checksum).
--   Keduanya sengaja dilewati karena:
--     - Untuk checksum: saya tidak menemukan sumber resmi yang menyatakan NISN
--       memakai algoritma digit pemeriksa. Menebak algoritmanya berisiko
--       MENOLAK NISN yang sebenarnya sah.
--     - Untuk arti digit: memeriksa tahun lahir akan menolak siswa yang tahun
--       lahirnya di luar dugaan (mis. siswa yang naik kelas terlambat).
--
--   Jadi aturannya sengaja longgar: 10 digit angka. Lebih baik menerima NISN
--   yang sah secara keliru daripada menolak siswa yang berhak mendaftar.
--
-- Aman dijalankan berulang. Jalankan di Supabase SQL Editor.
-- ══════════════════════════════════════════════════════════════════════════

-- ── 1. Kolom NISN ─────────────────────────────────────────────────────────
-- Ditambahkan tanpa NOT NULL supaya migrasi tidak gagal bila sudah ada profil
-- siswa lama, dan supaya guru/admin yang belum punya NISN tetap sah.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS nisn TEXT;

COMMENT ON COLUMN public.profiles.nisn IS
  'NISN siswa (10 digit angka). Unik di seluruh sekolah. NULL untuk guru/admin.';

-- ── 2. Batasan unik ───────────────────────────────────────────────────────
-- Index parsial: hanya berlaku untuk baris yang nisn-nya terisi.
--
-- KENAPA PARSIAL, BUKAN UNIQUE BIASA:
--   - Guru dan admin tidak punya NISN. Tanpa syarat `WHERE`, semua baris
--     ber-NISN NULL akan saling dianggap duplikat pada sebagian database
--     (NULL dianggap sama), sehingga hanya SATU guru yang dapat dibuat.
--   - Sekaligus membuat migrasi ini aman dijalankan walau sudah ada data:
--     baris lama ber-NISN NULL tidak ikut diperiksa.
--
-- Kolom kosong ('') dinormalisasi menjadi NULL oleh trigger dan RPC, jadi
-- tidak ada dua siswa yang bisa "berbagi" NISN kosong.
CREATE UNIQUE INDEX IF NOT EXISTS profiles_nisn_key
  ON public.profiles (nisn)
  WHERE nisn IS NOT NULL AND nisn <> '';

-- ── 3. Trigger pembuatan profil: baca nisn ────────────────────────────────
-- Disalin dari 06_fix_profile_trigger.sql, dengan penambahan `nisn`.
-- Logika lain TIDAK diubah agar perbaikan sebelumnya tetap berlaku:
--   - prioritas app_metadata -> user_metadata -> email
--   - peran hanya dipercaya dari app_metadata
--   - penjaga agar login berulang tidak menulis ulang profil
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
  v_nisn     TEXT;
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

  -- Nomor absen tetap disimpan sebagai nomor urut di dalam kelas (bukan
  -- pengenal). NISN adalah pengenalnya.
  v_absent := COALESCE(
    NULLIF(trim(COALESCE(NEW.raw_app_meta_data  ->> 'absent_number', '')), ''),
    NULLIF(trim(COALESCE(NEW.raw_user_meta_data ->> 'absent_number', '')), ''),
    '1'
  );

  -- NISN: kosong -> NULL, supaya index parsial di atas bekerja benar dan
  -- supaya guru/admin (yang tidak punya NISN) tidak saling bentrok.
  v_nisn := NULLIF(trim(COALESCE(
    NEW.raw_app_meta_data  ->> 'nisn',
    NEW.raw_user_meta_data ->> 'nisn',
    ''
  )), '');

  v_school := COALESCE(
    NULLIF(trim(COALESCE(NEW.raw_app_meta_data  ->> 'school_name', '')), ''),
    NULLIF(trim(COALESCE(NEW.raw_user_meta_data ->> 'school_name', '')), ''),
    'SMP Negeri 1'
  );

  INSERT INTO public.profiles AS p (
    id, username, role, name, absent_number, nisn, classroom_code, school_name
  ) VALUES (
    NEW.id, v_username, v_role, v_name, v_absent, v_nisn, NULLIF(v_class, ''), v_school
  )
  ON CONFLICT (id) DO UPDATE SET
    name           = COALESCE(NULLIF(p.name, ''), EXCLUDED.name),
    absent_number  = COALESCE(NULLIF(p.absent_number, ''), EXCLUDED.absent_number),
    nisn           = COALESCE(EXCLUDED.nisn, p.nisn),
    classroom_code = COALESCE(EXCLUDED.classroom_code, p.classroom_code),
    school_name    = COALESCE(NULLIF(p.school_name, ''), EXCLUDED.school_name);

  RETURN NEW;
END $$;

-- ── 4. Guru membuat akun siswa — NISN kini WAJIB ──────────────────────────
-- Tanda tangan bertambah satu parameter (p_nisn) sehingga menjadi 6 argumen.
-- Versi 5-argumen yang lama dicabut di bagian akhir berkas ini agar tidak ada
-- jalan pintas yang melewati pemeriksaan NISN.
CREATE OR REPLACE FUNCTION public.teacher_create_student(
  p_classroom_code TEXT,
  p_name           TEXT,
  p_absent_number  TEXT,
  p_username       TEXT,
  p_password       TEXT,
  p_nisn           TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_me       public.profiles%ROWTYPE;
  v_username TEXT := lower(trim(p_username));
  v_code     TEXT := upper(trim(p_classroom_code));
  v_nisn     TEXT := NULLIF(trim(COALESCE(p_nisn, '')), '');
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

  -- ── NISN WAJIB ────────────────────────────────────────────────────────
  -- Inilah inti masukan dosen: satu NISN hanya boleh dipakai satu akun.
  -- Tanpa nilai ini, penolakan duplikat tidak mungkin dilakukan.
  IF v_nisn IS NULL THEN
    RAISE EXCEPTION 'NISN wajib diisi.' USING ERRCODE = '22023';
  END IF;

  -- Format: tepat 10 digit angka. Lihat catatan di kepala berkas mengenai
  -- alasan checksum dan arti digit tidak diperiksa.
  IF v_nisn !~ '^[0-9]{10}$' THEN
    RAISE EXCEPTION 'NISN harus 10 digit angka (yang diisi: %).', v_nisn
      USING ERRCODE = '22023';
  END IF;

  -- Tolak lebih awal dengan pesan yang dapat dibaca pengguna. Tanpa ini,
  -- pelanggaran index unik akan muncul sebagai galat database yang samar.
  IF EXISTS (SELECT 1 FROM public.profiles p WHERE p.nisn = v_nisn) THEN
    RAISE EXCEPTION 'NISN % sudah terdaftar. Satu NISN hanya boleh memiliki satu akun.', v_nisn
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
                       'username', v_username, 'role', 'student', 'classroom_code', v_code,
                       'nisn', v_nisn),
    jsonb_build_object('username', v_username, 'name', trim(p_name),
                       'absent_number', trim(COALESCE(p_absent_number, '1')),
                       'nisn', v_nisn,
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
    id, username, role, name, absent_number, nisn, classroom_code, school_name
  ) VALUES (
    v_new_id, v_username, 'student', trim(p_name),
    trim(COALESCE(p_absent_number, '1')), v_nisn, v_code, v_class.school_name
  )
  ON CONFLICT (id) DO UPDATE SET
    name           = EXCLUDED.name,
    absent_number  = EXCLUDED.absent_number,
    nisn           = EXCLUDED.nisn,
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
      'absent_number', trim(COALESCE(p_absent_number, '1')),
      'nisn', v_nisn,
      'unlocked_level', 1,
      'avatar_config', '{}'::jsonb
    )
  );

EXCEPTION
  WHEN unique_violation THEN
    -- Dua kemungkinan: username atau NISN sudah ada. Pesannya menyebut
    -- keduanya supaya guru tidak menebak-nebak penyebabnya.
    RAISE EXCEPTION 'Username % atau NISN % sudah terdaftar.', v_username, v_nisn
      USING ERRCODE = '23505';
END $$;

REVOKE ALL ON FUNCTION public.teacher_create_student(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT)
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.teacher_create_student(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT)
  TO authenticated;

-- Cabut versi lama (5 argumen) supaya tidak ada jalur pembuatan akun yang
-- melewati pemeriksaan NISN.
DROP FUNCTION IF EXISTS public.teacher_create_student(TEXT, TEXT, TEXT, TEXT, TEXT);

-- ── 5. Fungsi pembaca: sertakan nisn ──────────────────────────────────────
-- get_my_profile: tambah nisn supaya halaman Profil dapat menampilkannya.
--
-- Definisi ini disalin dari 02_rpc_and_hardening.sql dan HANYA ditambah satu
-- kunci ('nisn'). Kunci 'found' WAJIB dipertahankan: pemanggil di aplikasi
-- memeriksanya untuk membedakan "profil belum ada" dari "gagal memuat", dan
-- tanpa kunci itu halaman login akan berhenti bekerja tanpa pesan galat.
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
    'nisn', v.nisn,
    'classroom_code', v.classroom_code,
    'school_name', v.school_name,
    'avatar_config', v.avatar_config,
    'unlocked_level', v.unlocked_level
  );
END $$;

REVOKE ALL ON FUNCTION public.get_my_profile() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_my_profile() TO authenticated;

-- list_class_students: sertakan nisn.
--
-- Definisi ini disalin dari 02_rpc_and_hardening.sql dan HANYA ditambah satu
-- kolom (p.nisn). Seluruh logika lain dipertahankan apa adanya, karena
-- Posko Guru bergantung pada kolom-kolom yang dikembalikannya:
-- user_id, class_name, created_at, dan updated_at.
--
-- Urutan tetap `s.absent_number::text, s.name` seperti aslinya. CAST nomor
-- absen (yang sudah bertipe TEXT) ke TEXT memang tidak mengubah apa pun,
-- sehingga urutannya praktis berdasarkan nama. Dipertahankan agar perilaku
-- tampilan tidak berubah tanpa sengaja.
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
             p.absent_number, p.nisn, p.avatar_config, p.unlocked_level,
             p.created_at, p.updated_at
      FROM public.profiles p
      LEFT JOIN public.classrooms c ON c.code = p.classroom_code
      WHERE p.classroom_code = upper(trim(p_code)) AND p.role = 'student'
    ) s
  );
END $$;

REVOKE ALL ON FUNCTION public.list_class_students(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.list_class_students(TEXT) TO authenticated;
