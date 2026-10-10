-- ══════════════════════════════════════════════════════════════════════════
-- SIAPKAN DUA AKUN UJI ISOLASI
-- ══════════════════════════════════════════════════════════════════════════
--
-- MENGAPA BERKAS INI ADA
--   `supabase/test_isolation.mjs` membuktikan bahwa satu siswa tidak dapat
--   membaca data siswa lain — bukti langsung untuk permintaan "item yang cuma
--   bisa tampil di user #1 ya cuma #1 yang bisa lihat".
--
--   Tetapi uji itu membuat akunnya sendiri lewat endpoint pendaftaran
--   (`/auth/v1/signup`). Endpoint itu KINI TERTUTUP — justru karena keamanan
--   yang kita pasang. Jadi ujinya tidak dapat berjalan lagi tanpa akun yang
--   dibuat lebih dulu.
--
--   Berkas ini menyiapkan dua akun itu. Setelah dijalankan, uji isolasinya
--   dapat dijalankan dengan kredensial dari sini.
--
-- CARA PAKAI
--   1. Jalankan SELURUH isi berkas ini di Supabase SQL Editor
--   2. Salin kata sandi yang muncul di bagian akhir ke .env:
--          VITE_UJI_A_USERNAME=ujia
--          VITE_UJI_A_PASSWORD=...
--          VITE_UJI_B_USERNAME=ujib
--          VITE_UJI_B_PASSWORD=...
--   3. Jalankan:  npm run test:isolation
--   4. Setelah selesai, jalankan bagian PEMBERSIHAN di berkas ini
--
-- ⚠️ AKUN INI SEMENTARA. Bagian pembersihan di akhir berkas menghapusnya.
--    Jangan biarkan akun uji tertinggal sebelum lomba.
-- ══════════════════════════════════════════════════════════════════════════

DO $$
DECLARE
  v_kelas   TEXT := 'RESQ-8A';      -- kelas tempat akun uji ditempatkan
  v_sandi_a TEXT := 'UjiIsolasiA2026!';
  v_sandi_b TEXT := 'UjiIsolasiB2026!';
  v_a UUID := gen_random_uuid();
  v_b UUID := gen_random_uuid();
  v_sekolah TEXT;
BEGIN
  -- Pastikan kelasnya ada; tanpa kelas, profil siswa tidak lengkap
  SELECT school_name INTO v_sekolah FROM public.classrooms WHERE code = v_kelas;
  IF v_sekolah IS NULL THEN
    RAISE EXCEPTION 'Kelas % tidak ada. Buat dulu kelasnya, atau ubah v_kelas di atas.', v_kelas;
  END IF;

  -- Bersihkan sisa percobaan sebelumnya supaya dapat dijalankan berulang
  DELETE FROM auth.users WHERE email IN ('ujia@resqbox.local', 'ujib@resqbox.local');

  -- ── Akun A ──────────────────────────────────────────────────────────────
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data,
    confirmation_token, recovery_token, email_change_token_new, email_change
  ) VALUES (
    v_a, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    'ujia@resqbox.local', extensions.crypt(v_sandi_a, extensions.gen_salt('bf')),
    now(), now(), now(),
    jsonb_build_object('provider','email','providers',jsonb_build_array('email'),
                       'username','ujia','role','student','classroom_code',v_kelas),
    jsonb_build_object('username','ujia','name','Siswa Uji A',
                       'absent_number','91','classroom_code',v_kelas,'school_name',v_sekolah),
    '', '', '', ''
  );
  INSERT INTO auth.identities (id, user_id, provider_id, provider, identity_data,
                               last_sign_in_at, created_at, updated_at)
  VALUES (gen_random_uuid(), v_a, 'ujia@resqbox.local', 'email',
          jsonb_build_object('sub', v_a::text, 'email','ujia@resqbox.local','email_verified',true),
          now(), now(), now());

  -- ── Akun B ──────────────────────────────────────────────────────────────
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data,
    confirmation_token, recovery_token, email_change_token_new, email_change
  ) VALUES (
    v_b, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    'ujib@resqbox.local', extensions.crypt(v_sandi_b, extensions.gen_salt('bf')),
    now(), now(), now(),
    jsonb_build_object('provider','email','providers',jsonb_build_array('email'),
                       'username','ujib','role','student','classroom_code',v_kelas),
    jsonb_build_object('username','ujib','name','Siswa Uji B',
                       'absent_number','92','classroom_code',v_kelas,'school_name',v_sekolah),
    '', '', '', ''
  );
  INSERT INTO auth.identities (id, user_id, provider_id, provider, identity_data,
                               last_sign_in_at, created_at, updated_at)
  VALUES (gen_random_uuid(), v_b, 'ujib@resqbox.local', 'email',
          jsonb_build_object('sub', v_b::text, 'email','ujib@resqbox.local','email_verified',true),
          now(), now(), now());

  -- Profil dibuat otomatis oleh trigger handle_new_auth_user. Pastikan ada.
  INSERT INTO public.profiles (id, username, role, name, absent_number, classroom_code, school_name)
  VALUES (v_a, 'ujia', 'student', 'Siswa Uji A', '91', v_kelas, v_sekolah)
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.profiles (id, username, role, name, absent_number, classroom_code, school_name)
  VALUES (v_b, 'ujib', 'student', 'Siswa Uji B', '92', v_kelas, v_sekolah)
  ON CONFLICT (id) DO NOTHING;

  RAISE NOTICE '';
  RAISE NOTICE '════════════════════════════════════════════════════════';
  RAISE NOTICE '  AKUN UJI SIAP';
  RAISE NOTICE '════════════════════════════════════════════════════════';
  RAISE NOTICE '  Username A : ujia     UUID: %', v_a;
  RAISE NOTICE '  Username B : ujib     UUID: %', v_b;
  RAISE NOTICE '';
  RAISE NOTICE '  Sandi keduanya ada di bagian atas berkas ini:';
  RAISE NOTICE '    v_sandi_a = UjiIsolasiA2026!';
  RAISE NOTICE '    v_sandi_b = UjiIsolasiB2026!';
  RAISE NOTICE '';
  RAISE NOTICE '  Tambahkan ke .env:';
  RAISE NOTICE '    VITE_UJI_A_USERNAME=ujia';
  RAISE NOTICE '    VITE_UJI_A_PASSWORD=UjiIsolasiA2026!';
  RAISE NOTICE '    VITE_UJI_B_USERNAME=ujib';
  RAISE NOTICE '    VITE_UJI_B_PASSWORD=UjiIsolasiB2026!';
  RAISE NOTICE '';
  RAISE NOTICE '  Setelah uji selesai, jalankan bagian PEMBERSIHAN';
  RAISE NOTICE '  di akhir berkas ini.';
  RAISE NOTICE '════════════════════════════════════════════════════════';
END $$;


-- Verifikasi: kedua akun dan profilnya harus ada
SELECT u.email, p.username, p.role, p.classroom_code, p.absent_number,
       u.email_confirmed_at IS NOT NULL AS terkonfirmasi
  FROM auth.users u
  JOIN public.profiles p ON p.id = u.id
 WHERE u.email IN ('ujia@resqbox.local', 'ujib@resqbox.local')
 ORDER BY u.email;


-- ══════════════════════════════════════════════════════════════════════════
-- PEMBERSIHAN — jalankan SETELAH uji isolasi selesai
-- ══════════════════════════════════════════════════════════════════════════
--
-- Menghapus kedua akun uji beserta profil dan nilainya.
-- Penghapusan akun juga menghapus profil lewat ON DELETE CASCADE.
-- Agar tidak ada akun uji yang tertinggal sebelum lomba.
--
--   DELETE FROM auth.users WHERE email IN ('ujia@resqbox.local', 'ujib@resqbox.local');
--   SELECT count(*) AS sisa_akun_uji FROM auth.users
--    WHERE email LIKE 'ujia@%' OR email LIKE 'ujib@%' OR email LIKE 'zz_uji_%';
--
-- Baris terakhir harus berjumlah 0.
