-- ══════════════════════════════════════════════════════════════════════════
-- VERIFIKASI KEAMANAN DATABASE — SATU TABEL, 12 PEMERIKSAAN
-- ══════════════════════════════════════════════════════════════════════════
--
-- MENGAPA DIBUAT SATU TABEL
--   Versi sebelumnya memakai 12 pernyataan SELECT terpisah. Supabase SQL
--   Editor hanya menampilkan hasil query TERAKHIR, sehingga yang terlihat
--   hanya pemeriksaan nomor 12 — sisanya tidak terbaca sama sekali.
--
--   Berkas ini menggabungkan semuanya, sehingga seluruh hasilnya tampil
--   dalam satu tabel yang dapat dibaca sekaligus.
--
-- CARA PAKAI
--   Salin SELURUH isi berkas ini ke Supabase SQL Editor, klik Run, lalu
--   kirim seluruh isi tabel hasilnya.
--
-- Hanya membaca. Tidak mengubah apa pun.
-- ══════════════════════════════════════════════════════════════════════════

WITH
fungsi_rusak AS (
  SELECT coalesce(string_agg(p.proname, ', '), 'tidak ada') AS rincian
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
   WHERE n.nspname = 'public'
     AND p.proname IN ('get_my_profile', 'list_class_students', 'handle_new_auth_user',
                       'teacher_create_student', 'update_my_profile')
     AND pg_get_functiondef(p.oid) ILIKE '%nisn%'
),
kolom_nisn AS (
  SELECT coalesce(string_agg(column_name, ', '), 'kolom nisn sudah tidak ada') AS rincian
    FROM information_schema.columns
   WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'nisn'
),
rls AS (
  SELECT string_agg(c.relname || '=' || CASE WHEN c.relrowsecurity THEN 'aktif' ELSE 'MATI' END, ', ') AS rincian,
         count(*) FILTER (WHERE NOT c.relrowsecurity) AS masalah
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
   WHERE n.nspname = 'public' AND c.relkind = 'r'
     AND c.relname IN ('profiles', 'classrooms', 'level_submissions', 'rate_limits')
),
anon_tulis AS (
  SELECT coalesce(string_agg(DISTINCT table_name || ':' || privilege_type, ', '),
                  'anon tidak punya hak tulis') AS rincian
    FROM information_schema.role_table_grants
   WHERE grantee = 'anon' AND table_schema = 'public'
     AND privilege_type IN ('INSERT', 'UPDATE', 'DELETE', 'TRUNCATE')
),
anon_fungsi AS (
  SELECT coalesce(string_agg(p.proname, ', '), 'tidak ada') AS rincian
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
   WHERE n.nspname = 'public' AND p.prokind = 'f'
     AND has_function_privilege('anon', p.oid, 'EXECUTE')
     AND p.proname NOT IN ('username_available', 'class_code_info',
                           'legacy_account_exists', 'custom_access_token_hook')
),
index_absen AS (
  SELECT coalesce(string_agg(indexname, ', '), 'index TIDAK ADA') AS rincian
    FROM pg_indexes
   WHERE schemaname = 'public' AND tablename = 'profiles'
     AND indexname = 'profiles_kelas_absen_key'
),
absen_kembar AS (
  SELECT coalesce(string_agg(classroom_code || ' absen ' || absent_number ||
                             ' (' || jumlah || 'x: ' || nama || ')', ' | '),
                  'tidak ada nomor absen kembar') AS rincian
    FROM (
      SELECT classroom_code, absent_number, count(*) AS jumlah, string_agg(name, ', ') AS nama
        FROM public.profiles
       WHERE role = 'student' AND classroom_code IS NOT NULL
       GROUP BY classroom_code, absent_number
      HAVING count(*) > 1
    ) x
),
trg AS (
  SELECT coalesce(string_agg(tgname || '=' || CASE WHEN tgenabled = 'O' THEN 'aktif' ELSE 'MATI' END, ', '),
                  'trigger TIDAK ADA') AS rincian
    FROM pg_trigger
   WHERE tgrelid = 'auth.users'::regclass AND NOT tgisinternal
     AND tgname = 'trg_on_auth_user_created'
),
tanpa_profil AS (
  SELECT coalesce(string_agg(u.email, ', '), 'semua akun punya profil') AS rincian
    FROM auth.users u
    LEFT JOIN public.profiles p ON p.id = u.id
   WHERE p.id IS NULL AND u.email LIKE '%@resqbox.local'
),
akun_uji AS (
  SELECT coalesce(string_agg(email, ', '), 'tidak ada akun uji') AS rincian
    FROM auth.users
   WHERE email LIKE 'zz_uji_%' OR email LIKE 'zz_cek_%'
),
password_teks AS (
  SELECT coalesce(string_agg(table_name || '.' || column_name, ', '), 'tidak ada') AS rincian
    FROM information_schema.columns
   WHERE table_schema = 'public'
     AND column_name IN ('password', 'password_plain', 'pass')
     AND table_name <> 'user_accounts'
),
tabel_lama AS (
  SELECT coalesce(string_agg(c.relname, ', '), 'tidak ada tabel lama') AS rincian
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
   WHERE n.nspname = 'public' AND c.relkind = 'r'
     AND (c.relname LIKE '%_v2_legacy' OR c.relname IN ('user_accounts', 'students_v2'))
)

SELECT 1 AS no, 'Fungsi baca kolom terbuang' AS pemeriksaan,
       CASE WHEN fungsi_rusak.rincian = 'tidak ada' THEN 'OK' ELSE 'MASALAH' END AS hasil,
       fungsi_rusak.rincian
  FROM fungsi_rusak
UNION ALL
SELECT 2, 'Kolom nisn masih ada?',
       CASE WHEN kolom_nisn.rincian LIKE '%sudah tidak ada%' THEN 'OK' ELSE 'MASALAH' END,
       kolom_nisn.rincian FROM kolom_nisn
UNION ALL
SELECT 3, 'RLS aktif di semua tabel',
       CASE WHEN rls.masalah = 0 THEN 'OK' ELSE 'MASALAH' END,
       rls.rincian FROM rls
UNION ALL
SELECT 4, 'anon punya hak tulis?',
       CASE WHEN anon_tulis.rincian LIKE '%tidak punya%' THEN 'OK' ELSE 'MASALAH' END,
       anon_tulis.rincian FROM anon_tulis
UNION ALL
SELECT 5, 'Fungsi sensitif terbuka ke anon',
       CASE WHEN anon_fungsi.rincian = 'tidak ada' THEN 'OK' ELSE 'MASALAH' END,
       anon_fungsi.rincian FROM anon_fungsi
UNION ALL
SELECT 6, 'Index unik kelas+absen',
       CASE WHEN index_absen.rincian LIKE '%profiles_kelas_absen_key%' THEN 'OK' ELSE 'MASALAH' END,
       index_absen.rincian FROM index_absen
UNION ALL
SELECT 7, 'Nomor absen kembar',
       CASE WHEN absen_kembar.rincian LIKE '%tidak ada%' THEN 'OK' ELSE 'MASALAH' END,
       absen_kembar.rincian FROM absen_kembar
UNION ALL
SELECT 8, 'Trigger profil terpasang',
       CASE WHEN trg.rincian LIKE '%aktif%' THEN 'OK' ELSE 'MASALAH' END,
       trg.rincian FROM trg
UNION ALL
SELECT 9, 'Akun tanpa profil',
       CASE WHEN tanpa_profil.rincian LIKE '%semua akun%' THEN 'OK' ELSE 'PERIKSA' END,
       tanpa_profil.rincian FROM tanpa_profil
UNION ALL
SELECT 10, 'Akun uji tertinggal',
       CASE WHEN akun_uji.rincian LIKE '%tidak ada%' THEN 'OK' ELSE 'PERIKSA' END,
       akun_uji.rincian FROM akun_uji
UNION ALL
SELECT 11, 'Kolom password teks biasa',
       CASE WHEN password_teks.rincian = 'tidak ada' THEN 'OK' ELSE 'MASALAH' END,
       password_teks.rincian FROM password_teks
UNION ALL
SELECT 12, 'Tabel lama tersisa',
       CASE WHEN tabel_lama.rincian = 'tidak ada tabel lama' THEN 'OK' ELSE 'PERIKSA' END,
       tabel_lama.rincian FROM tabel_lama
ORDER BY no;
