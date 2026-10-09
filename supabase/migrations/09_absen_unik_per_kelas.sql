-- ══════════════════════════════════════════════════════════════════════════
-- 09. GANTI PENGENAL UNIK DARI NISN MENJADI (KODE KELAS + NO. ABSEN)
-- ══════════════════════════════════════════════════════════════════════════
--
-- MENGAPA BERUBAH
--   Migrasi 08 memakai NISN sebagai pengenal unik siswa. Setelah dipakai,
--   dirasa terlalu merepotkan: NISN harus dicari dulu, panjangnya 10 digit,
--   dan salah ketik satu angka membuat akun ditolak.
--
--   Penggantinya: gabungan KODE KELAS + NO. ABSEN.
--
-- KENAPA INI TERLALU LEBIH BAIK DARI YANG TAMPAK
--   Nomor absen TIDAK unik secara nasional — setiap kelas punya nomor 1
--   sampai 30-an, dan dua siswa di kelas berbeda boleh sama. Karena itu
--   nomor absen saja TIDAK BISA dijadikan pengenal unik.
--
--   Tetapi gabungan (kode kelas + nomor absen) BISA, dan justru COCOK dengan
--   cara kerja aplikasi ini: akun siswa dibuat oleh GURU di dalam satu kelas
--   tertentu. Guru memilih kelasnya, lalu menentukan nomor absen siswa itu.
--   Dengan aturan "dalam satu kelas tidak boleh ada dua nomor absen yang
--   sama", tidak mungkin ada dua akun siswa yang sama di satu kelas.
--
--   Hasilnya KEAMANANNYA SETARA dengan NISN, tetapi:
--     - tidak perlu mencari dan mengetik 10 digit
--     - tidak ada aturan format yang bisa salah
--     - tidak ada data pribadi tambahan yang perlu disimpan
--
--   Catatan penting: cara ini hanya sama kuat dengan NISN KARENA pendaftaran
--   mandiri sudah ditutup. Kalau siswa diizinkan mendaftar sendiri lagi, ia
--   dapat memilih nomor absen yang berbeda-beda dan aturan ini tidak lagi
--   menghalanginya. Jangan buka pendaftaran mandiri selama aturan ini dipakai.
--
-- AMAN DIJALANKAN DENGAN ATAU TANPA MIGRASI 08
--   Migrasi ini tidak mengandaikan apakah 08 sudah dijalankan:
--     - kalau kolom `nisn` ada   -> dibuang
--     - kalau kolom `nisn` tidak -> dilewati tanpa galat
--   Semua langkah memakai IF EXISTS / IF NOT EXISTS, jadi aman dijalankan
--   berulang.
--
-- ⚠️ SEBELUM MENJALANKAN — SIMPAN NISN YANG SUDAH TERISI
--   Membuang kolom berarti data NISN di dalamnya HILANG. Bila sudah ada siswa
--   yang NISN-nya terisi, salin dulu dengan query di bagian 0 di bawah.
--
-- Aman dijalankan berulang. Jalankan di Supabase SQL Editor.
-- ══════════════════════════════════════════════════════════════════════════


-- ── 0. SIMPAN DULU (jalankan terpisah bila kolom nisn sudah ada) ──────────
-- Jalankan query berikut SENDIRI-SENDIRI sebelum menjalankan sisa berkas ini,
-- lalu simpan hasilnya (mis. ke Excel). Kolom `nisn` akan dibuang di bagian 1.
--
--   SELECT username, name, classroom_code, absent_number, nisn
--     FROM public.profiles
--    WHERE nisn IS NOT NULL AND nisn <> ''
--    ORDER BY classroom_code, absent_number;
--
-- Bila hasilnya kosong, tidak ada yang perlu disimpan.


-- ── 1. Buang kolom & index NISN ───────────────────────────────────────────
DROP INDEX IF EXISTS public.profiles_nisn_key;

ALTER TABLE public.profiles
  DROP COLUMN IF EXISTS nisn;


-- ── 2. Batasan unik: satu nomor absen hanya sekali DALAM SATU KELAS ───────
--
-- Syarat tambahan yang penting:
--   - classroom_code IS NOT NULL :
--       siswa yang belum masuk kelas mana pun tidak ikut diperiksa. Tanpa
--       syarat ini, beberapa siswa tanpa kelas yang kebetulan bernomor absen
--       sama akan saling dianggap duplikat.
--   - role = 'student' :
--       memeriksa HANYA siswa. Guru dan admin juga punya kolom absent_number
--       (diisi '1' oleh bawaan), dan tanpa syarat ini dua guru di satu sekolah
--       akan saling dianggap duplikat sehingga hanya satu guru yang bisa ada.
--
-- Karena index ini unik, PostgreSQL otomatis menolak nomor absen kembar di
-- kelas yang sama pada tingkat database — bukan hanya di tampilan aplikasi.
--
-- ⚠️ Bila index ini GAGAL dibuat, artinya SUDAH ADA nomor absen kembar di
--    kelas yang sama. Cari dulu dengan query di bagian 5, perbaiki datanya,
--    lalu jalankan ulang.
CREATE UNIQUE INDEX IF NOT EXISTS profiles_kelas_absen_key
  ON public.profiles (classroom_code, absent_number)
  WHERE role = 'student' AND classroom_code IS NOT NULL;


-- ── 3. Guru membuat akun siswa — kembali ke 5 argumen, tanpa NISN ─────────

-- ⚠️ DROP DIJALANKAN SEBELUM GRANT — INI PENTING
--
--   Versi pertama migrasi ini menaruh DROP di BAGIAN AKHIR, setelah GRANT.
--   Di database yang masih memakai fungsi 6-argumen (hasil migrasi 08),
--   perintah GRANT untuk 5-argumen dijalankan lebih dulu — dan gagal, karena
--   fungsi dengan tanda tangan itu belum ada.
--
--   Kegagalan itu bukan sekadar satu baris yang dilewati: di Supabase SQL
--   Editor seluruh blok dijalankan sebagai SATU transaksi, sehingga perintah
--   yang gagal MEMBATALKAN SEMUA perintah sebelumnya di blok yang sama.
--   Akibatnya GRANT untuk fungsi lain (termasuk get_my_profile) ikut batal,
--   dan seluruh pengguna tidak dapat login dengan pesan "Profil tidak
--   ditemukan" — padahal profilnya ada dan haknya sudah ditulis di berkas.
--
--   Karena itu urutannya dibalik: bereskan tanda tangan fungsi DULU, baru
--   berikan haknya.
DROP FUNCTION IF EXISTS public.teacher_create_student(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT);

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

REVOKE ALL ON FUNCTION public.teacher_create_student(TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.teacher_create_student(TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;

-- Versi 6-argumen sudah dibuang di ATAS, sebelum GRANT. Tidak ada lagi
-- perintah di sini yang dapat gagal karena tanda tangan yang tidak cocok.


-- ── 4. Trigger pembuatan profil: hapus pembacaan nisn ─────────────────────
-- Disalin dari 08, dengan seluruh bagian `nisn` dibuang. Logika lain tidak
-- diubah agar perbaikan sebelumnya tetap berlaku.
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

  -- Nomor absen kini berperan ganda: nomor urut di kelas SEKALIGUS pengenal
  -- unik bersama kode kelas. Karena itu nol di depan dibuang agar "01" dan
  -- "1" tidak menjadi dua nilai berbeda.
  v_absent := COALESCE(
    NULLIF(trim(COALESCE(NEW.raw_app_meta_data  ->> 'absent_number', '')), ''),
    NULLIF(trim(COALESCE(NEW.raw_user_meta_data ->> 'absent_number', '')), ''),
    '1'
  );
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


-- ── 5. QUERY PEMERIKSA — jalankan bila index bagian 2 gagal dibuat ────────
-- Nomor absen kembar di kelas yang sama:
--
--   SELECT classroom_code, absent_number, count(*) AS jumlah,
--          string_agg(name, ', ') AS nama_siswa
--     FROM public.profiles
--    WHERE role = 'student' AND classroom_code IS NOT NULL
--    GROUP BY classroom_code, absent_number
--   HAVING count(*) > 1
--    ORDER BY classroom_code, absent_number;
--
-- Perbaiki dengan mengubah nomor absen salah satu siswa, misalnya:
--
--   UPDATE public.profiles
--      SET absent_number = '17'
--    WHERE username = 'nama_siswa_yang_salah';
