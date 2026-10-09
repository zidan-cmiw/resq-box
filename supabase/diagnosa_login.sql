-- ══════════════════════════════════════════════════════════════════════════
-- DIAGNOSA LENGKAP: kenapa login menghasilkan "Profil tidak ditemukan"
-- ══════════════════════════════════════════════════════════════════════════
--
-- MENGAPA BERKAS INI ADA
--   Perbaikan hak akses fungsi sudah dijalankan, tetapi login masih gagal.
--   Berarti penyebabnya BUKAN (hanya) hak akses — atau perbaikannya belum
--   benar-benar berjalan.
--
--   Daripada menebak lagi, berkas ini MENJAWAB SEMUA kemungkinan yang tersisa
--   dalam satu kali jalan. Hasilnya berupa tabel yang dapat dibaca langsung.
--
-- CARA PAKAI
--   1. Buka Supabase -> SQL Editor
--   2. Tempel SELURUH isi berkas ini
--   3. Klik Run
--   4. Kirim seluruh hasilnya (ada 7 bagian)
--
-- Aman dijalankan: hanya membaca, tidak mengubah apa pun.
-- ══════════════════════════════════════════════════════════════════════════

-- ── BAGIAN 1: Kondisi akun guru & demo ────────────────────────────────────
SELECT '1. AKUN' AS bagian, u.email,
       u.email_confirmed_at IS NOT NULL AS terkonfirmasi,
       u.raw_app_meta_data ->> 'role'   AS role_di_app_metadata,
       p.username, p.role AS role_di_profil, p.is_admin,
       (p.id IS NOT NULL) AS profil_ada
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.id = u.id
 WHERE u.email IN ('guru@resqbox.local', 'demo@resqbox.local')
 ORDER BY u.email;


-- ── BAGIAN 2: Hak eksekusi fungsi yang dipakai saat login ─────────────────
SELECT '2. HAK FUNGSI' AS bagian,
       p.proname,
       pg_get_function_identity_arguments(p.oid) AS argumen,
       CASE WHEN p.proacl IS NULL THEN 'BAWAAN (semua boleh)'
            ELSE array_to_string(p.proacl, ' | ') END AS hak,
       has_function_privilege('authenticated', p.oid, 'EXECUTE') AS boleh_authenticated,
       has_function_privilege('anon',          p.oid, 'EXECUTE') AS boleh_anon
  FROM pg_proc p
  JOIN pg_namespace n ON n.oid = p.pronamespace
 WHERE n.nspname = 'public'
   AND p.proname IN ('get_my_profile', 'update_my_profile', 'get_my_progress',
                     'is_admin', 'is_teacher', 'jwt_role', 'teacher_create_student')
 ORDER BY p.proname;


-- ── BAGIAN 3: Apakah tabel profiles punya kolom yang dibaca RPC? ──────────
-- get_my_profile membaca kolom-kolom ini satu per satu lewat %ROWTYPE.
-- Bila ada yang hilang, pemanggilan fungsi akan GAGAL dengan galat 42703.
SELECT '3. KOLOM PROFILES' AS bagian, column_name, data_type
  FROM information_schema.columns
 WHERE table_schema = 'public' AND table_name = 'profiles'
 ORDER BY ordinal_position;


-- ── BAGIAN 4: Apakah trigger pembuatan profil terpasang? ──────────────────
SELECT '4. TRIGGER' AS bagian, tgname AS nama_trigger, tgenabled AS aktif
  FROM pg_trigger
 WHERE tgrelid = 'auth.users'::regclass AND NOT tgisinternal
 ORDER BY tgname;


-- ── BAGIAN 5: Custom Access Token Hook ────────────────────────────────────
-- Hook ini menitipkan 'role' dan 'classroom_code' ke dalam JWT. Bila hook
-- GAGAL dijalankan, Supabase dapat menolak menerbitkan token — dan gejalanya
-- menyerupai masalah profil.
SELECT '5. HOOK' AS bagian,
       p.proname,
       has_function_privilege('supabase_auth_admin', p.oid, 'EXECUTE') AS boleh_auth_admin
  FROM pg_proc p
  JOIN pg_namespace n ON n.oid = p.pronamespace
 WHERE n.nspname = 'public' AND p.proname = 'custom_access_token_hook';


-- ── BAGIAN 6: Kebijakan RLS pada profiles ────────────────────────────────
-- Bila tidak ada kebijakan SELECT, pengguna tidak dapat membaca profilnya
-- sendiri — dan gejalanya juga "Profil tidak ditemukan".
SELECT '6. RLS PROFILES' AS bagian, policyname, cmd AS perintah, roles
  FROM pg_policies
 WHERE schemaname = 'public' AND tablename = 'profiles'
 ORDER BY cmd, policyname;


-- ── BAGIAN 7: Apakah RLS aktif, dan berapa baris profil ──────────────────
SELECT '7. RINGKASAN' AS bagian,
       (SELECT relrowsecurity FROM pg_class WHERE oid = 'public.profiles'::regclass) AS rls_profiles,
       (SELECT count(*) FROM public.profiles) AS jumlah_profil,
       current_setting('server_version') AS versi_postgres;
