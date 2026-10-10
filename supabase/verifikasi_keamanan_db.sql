-- ══════════════════════════════════════════════════════════════════════════
-- VERIFIKASI KEAMANAN LANGSUNG DI DATABASE
-- ══════════════════════════════════════════════════════════════════════════
--
-- MENGAPA BERKAS INI ADA
--   `npm run cek:keamanan` hanya membaca berkas di repositori. Ia TIDAK dapat
--   membuktikan keadaan database yang sebenarnya. Perbedaan antara keduanya
--   bukan sekadar teori — justru itulah yang menyebabkan seluruh pengguna
--   gagal login: berkas migrasinya tampak benar, tetapi fungsi yang tersimpan
--   di database masih membaca kolom yang sudah dibuang.
--
--   Berkas ini menanyakan langsung ke database. Setiap jawabannya berasal dari
--   katalog PostgreSQL, bukan dari berkas.
--
-- CARA PAKAI
--   Salin seluruh isi berkas ini ke Supabase SQL Editor, jalankan, lalu
--   PERIKSA HASILNYA SATU PER SATU. Setiap baris punya kolom `hasil` berisi
--   OK atau MASALAH, beserta keterangannya.
--
-- Hanya membaca. Tidak mengubah apa pun.
-- ══════════════════════════════════════════════════════════════════════════

-- ═══ 1. APAKAH ADA FUNGSI YANG MEMBACA KOLOM YANG SUDAH DIBUANG? ═══════════
-- Inilah pemeriksaan yang tidak pernah dilakukan, dan yang menyebabkan
-- kegagalan login. Hasilnya HARUS KOSONG.
SELECT '1. Fungsi membaca kolom terbuang' AS pemeriksaan,
       CASE WHEN count(*) = 0 THEN 'OK' ELSE 'MASALAH' END AS hasil,
       coalesce(string_agg(p.proname, ', '), 'tidak ada') AS rincian
  FROM pg_proc p
  JOIN pg_namespace n ON n.oid = p.pronamespace
  LEFT JOIN information_schema.columns c
         ON c.table_schema = 'public' AND c.table_name = 'profiles'
 WHERE n.nspname = 'public'
   AND p.proname IN ('get_my_profile', 'list_class_students', 'handle_new_auth_user',
                     'teacher_create_student', 'update_my_profile')
   AND pg_get_functiondef(p.oid) ILIKE '%nisn%';


-- ═══ 2. APAKAH KOLOM `nisn` SUDAH BENAR-BENAR HILANG? ══════════════════════
SELECT '2. Kolom nisn masih ada?' AS pemeriksaan,
       CASE WHEN count(*) = 0 THEN 'OK' ELSE 'MASALAH' END AS hasil,
       coalesce(string_agg(column_name, ', '), 'kolom nisn sudah tidak ada') AS rincian
  FROM information_schema.columns
 WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'nisn';


-- ═══ 3. APAKAH RLS AKTIF DI SELURUH TABEL? ════════════════════════════════
SELECT '3. RLS aktif di semua tabel' AS pemeriksaan,
       CASE WHEN count(*) FILTER (WHERE NOT c.relrowsecurity) = 0
            THEN 'OK' ELSE 'MASALAH' END AS hasil,
       string_agg(c.relname || '=' || CASE WHEN c.relrowsecurity THEN 'aktif' ELSE 'MATI' END, ', ')
         AS rincian
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
 WHERE n.nspname = 'public' AND c.relkind = 'r'
   AND c.relname IN ('profiles', 'classrooms', 'level_submissions', 'rate_limits');


-- ═══ 4. APAKAH `anon` PUNYA HAK TULIS KE TABEL? ═══════════════════════════
-- RLS menyaring BARIS, tetapi hak tingkat tabel tetap perlu diperiksa.
-- `anon` TIDAK BOLEH punya INSERT/UPDATE/DELETE pada tabel mana pun.
SELECT '4. anon punya hak tulis?' AS pemeriksaan,
       CASE WHEN count(*) = 0 THEN 'OK' ELSE 'MASALAH' END AS hasil,
       coalesce(string_agg(DISTINCT table_name || ':' || privilege_type, ', '),
                'anon tidak punya hak tulis di tabel mana pun') AS rincian
  FROM information_schema.role_table_grants
 WHERE grantee = 'anon'
   AND table_schema = 'public'
   AND privilege_type IN ('INSERT', 'UPDATE', 'DELETE', 'TRUNCATE');


-- ═══ 5. APAKAH FUNGSI SENSITIF TERTUTUP DARI `anon`? ══════════════════════
-- Hanya tiga fungsi yang boleh dipanggil tanpa login.
SELECT '5. Fungsi sensitif terbuka ke anon' AS pemeriksaan,
       CASE WHEN count(*) = 0 THEN 'OK' ELSE 'MASALAH' END AS hasil,
       coalesce(string_agg(p.proname, ', '), 'tidak ada') AS rincian
  FROM pg_proc p
  JOIN pg_namespace n ON n.oid = p.pronamespace
 WHERE n.nspname = 'public'
   AND p.prokind = 'f'
   AND has_function_privilege('anon', p.oid, 'EXECUTE')
   AND p.proname NOT IN ('username_available', 'class_code_info',
                         'legacy_account_exists', 'custom_access_token_hook');


-- ═══ 6. APAKAH INDEX UNIK NOMOR ABSEN SUDAH ADA? ══════════════════════════
SELECT '6. Index unik kelas+absen ada?' AS pemeriksaan,
       CASE WHEN count(*) = 1 THEN 'OK' ELSE 'MASALAH' END AS hasil,
       coalesce(string_agg(indexname, ', '), 'index TIDAK ADA — siswa bisa ganda') AS rincian
  FROM pg_indexes
 WHERE schemaname = 'public' AND tablename = 'profiles'
   AND indexname = 'profiles_kelas_absen_key';


-- ═══ 7. APAKAH ADA NOMOR ABSEN KEMBAR DI SATU KELAS? ══════════════════════
SELECT '7. Nomor absen kembar' AS pemeriksaan,
       CASE WHEN count(*) = 0 THEN 'OK' ELSE 'MASALAH' END AS hasil,
       coalesce(string_agg(classroom_code || ' absen ' || absent_number
                           || ' (' || jumlah || 'x: ' || nama || ')', ' | '),
                'tidak ada nomor absen kembar') AS rincian
  FROM (
    SELECT classroom_code, absent_number, count(*) AS jumlah,
           string_agg(name, ', ') AS nama
      FROM public.profiles
     WHERE role = 'student' AND classroom_code IS NOT NULL
     GROUP BY classroom_code, absent_number
    HAVING count(*) > 1
  ) x;


-- ═══ 8. APAKAH TRIGGER PEMBUATAN PROFIL TERPASANG? ════════════════════════
SELECT '8. Trigger profil terpasang' AS pemeriksaan,
       CASE WHEN count(*) = 1 THEN 'OK' ELSE 'MASALAH' END AS hasil,
       coalesce(string_agg(tgname || '=' || CASE WHEN tgenabled = 'O' THEN 'aktif' ELSE 'MATI' END, ', '),
                'trigger TIDAK ADA — akun baru tidak akan punya profil') AS rincian
  FROM pg_trigger
 WHERE tgrelid = 'auth.users'::regclass
   AND NOT tgisinternal
   AND tgname = 'trg_on_auth_user_created';


-- ═══ 9. APAKAH ADA AKUN SISWA TANPA PROFIL? ═══════════════════════════════
-- Akun seperti ini tidak dapat login (profilnya tidak ditemukan).
SELECT '9. Akun tanpa profil' AS pemeriksaan,
       CASE WHEN count(*) = 0 THEN 'OK' ELSE 'PERIKSA' END AS hasil,
       coalesce(string_agg(u.email, ', '), 'semua akun punya profil') AS rincian
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.id = u.id
 WHERE p.id IS NULL
   AND u.email LIKE '%@resqbox.local';


-- ═══ 10. APAKAH ADA AKUN UJI YANG TERTINGGAL? ═════════════════════════════
-- Akun uji sebaiknya dihapus sebelum lomba.
SELECT '10. Akun uji tertinggal' AS pemeriksaan,
       CASE WHEN count(*) = 0 THEN 'OK' ELSE 'PERIKSA' END AS hasil,
       coalesce(string_agg(email, ', '), 'tidak ada akun uji') AS rincian
  FROM auth.users
 WHERE email LIKE 'zz_uji_%' OR email LIKE 'zz_cek_%' OR email LIKE '%test%';


-- ═══ 11. APAKAH KOLOM PASSWORD LAMA MASIH ADA? ════════════════════════════
-- Skema v2 menyimpan password sebagai teks biasa. Bila kolomnya masih ada,
-- isinya dapat terbaca.
SELECT '11. Kolom password teks biasa' AS pemeriksaan,
       CASE WHEN count(*) = 0 THEN 'OK' ELSE 'MASALAH' END AS hasil,
       coalesce(string_agg(table_name || '.' || column_name, ', '),
                'tidak ada kolom password teks biasa') AS rincian
  FROM information_schema.columns
 WHERE table_schema = 'public'
   AND column_name IN ('password', 'password_plain', 'pass')
   AND table_name <> 'user_accounts';


-- ═══ 12. APAKAH TABEL LAMA MASIH ADA? ═════════════════════════════════════
SELECT '12. Tabel lama tersisa' AS pemeriksaan,
       CASE WHEN count(*) = 0 THEN 'OK' ELSE 'PERIKSA' END AS hasil,
       coalesce(string_agg(c.relname, ', '), 'tidak ada tabel lama') AS rincian
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
 WHERE n.nspname = 'public' AND c.relkind = 'r'
   AND (c.relname LIKE '%_v2_legacy' OR c.relname IN ('user_accounts', 'students_v2'));
