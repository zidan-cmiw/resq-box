-- ══════════════════════════════════════════════════════════════════════════
-- RESQ-BOX — VERIFIKASI KEAMANAN (SATU TABEL HASIL)
--
-- Semua pemeriksaan digabung menjadi SATU pernyataan, supaya SQL Editor
-- menampilkan seluruh hasil sekaligus. (Bila tiap pemeriksaan ditulis sebagai
-- SELECT terpisah, editor hanya menampilkan hasil query TERAKHIR sehingga
-- pemeriksaan penting seperti P1 tidak terlihat.)
--
-- Jalankan seluruh berkas ini. Target akhir: semua baris berstatus 'AMAN'
-- (kecuali P2b, yang bersifat informatif).
-- ══════════════════════════════════════════════════════════════════════════

WITH
-- Tabel aktif milik aplikasi (tanpa arsip, tanpa milik ekstensi)
tabel_aktif AS (
  SELECT c.oid, c.relname, c.relrowsecurity, c.relforcerowsecurity
  FROM pg_class c
  WHERE c.relnamespace = 'public'::regnamespace
    AND c.relkind = 'r'
    AND c.relname NOT LIKE 'pg_%'
    AND c.relname NOT LIKE '%_v2_legacy'
    AND NOT EXISTS (SELECT 1 FROM pg_depend d WHERE d.objid = c.oid AND d.deptype = 'e')
),
-- Fungsi milik aplikasi (bukan milik ekstensi)
fungsi_app AS (
  SELECT p.oid, p.proname, p.prosecdef, p.proconfig
  FROM pg_proc p
  JOIN pg_namespace n ON n.oid = p.pronamespace
  WHERE n.nspname = 'public'
    AND p.prokind = 'f'
    AND NOT EXISTS (SELECT 1 FROM pg_depend d WHERE d.objid = p.oid AND d.deptype = 'e')
),
policy_longgar AS (
  SELECT tablename, policyname, COALESCE(qual, with_check) AS ekspresi
  FROM pg_policies
  WHERE schemaname = 'public'
    AND (COALESCE(qual, '') IN ('true', '(true)')
      OR COALESCE(with_check, '') IN ('true', '(true)'))
),
rpc_lama AS (
  SELECT p.proname FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
  WHERE n.nspname = 'public' AND p.proname IN (
    'verify_login', 'register_student_account', 'register_teacher_account',
    'create_student_by_teacher', 'rpc_upsert_student', 'rpc_insert_submission',
    'rpc_create_classroom', 'rpc_update_classroom_name', 'rpc_delete_classroom',
    'rpc_delete_student', 'rpc_update_teacher_profile')
)
SELECT 1 AS no, 'P1 policy longgar (target 0)' AS pemeriksaan,
  count(*)::text AS nilai,
  CASE WHEN count(*) = 0 THEN 'AMAN' ELSE 'CEK LAGI' END AS status,
  COALESCE(string_agg(policyname || '=' || ekspresi, ', '), 'tidak ada policy longgar') AS detail
FROM policy_longgar

UNION ALL SELECT 2, 'P2 tabel aktif tanpa RLS+FORCE (target 0)',
  count(*)::text, CASE WHEN count(*) = 0 THEN 'AMAN' ELSE 'CEK LAGI' END,
  COALESCE(string_agg(relname, ', '), 'semua tabel aktif sudah RLS+FORCE')
FROM tabel_aktif WHERE NOT relrowsecurity OR NOT relforcerowsecurity

UNION ALL SELECT 3, 'P2b tabel arsip v2 (informatif)',
  count(*)::text, CASE WHEN count(*) = 0 THEN 'AMAN' ELSE 'INFO' END,
  COALESCE(string_agg(c.relname, ', '), 'tidak ada arsip tersisa')
FROM pg_class c
WHERE c.relnamespace = 'public'::regnamespace AND c.relkind = 'r'
  AND c.relname LIKE '%_v2_legacy'

UNION ALL SELECT 4, 'P3 fungsi proyek bisa dipanggil anon (target <=3)',
  count(*)::text, CASE WHEN count(*) <= 3 THEN 'AMAN' ELSE 'CEK LAGI' END,
  COALESCE(string_agg(proname, ', ' ORDER BY proname), 'tidak ada')
FROM fungsi_app
WHERE has_function_privilege('anon', oid, 'EXECUTE')

UNION ALL SELECT 5, 'P4 user_accounts tertutup untuk anon',
  has_table_privilege('anon', 'public.user_accounts', 'SELECT')::text,
  CASE WHEN NOT has_table_privilege('anon', 'public.user_accounts', 'SELECT')
       THEN 'AMAN' ELSE 'CEK LAGI' END,
  'anon bisa SELECT = ' || has_table_privilege('anon', 'public.user_accounts', 'SELECT')::text

UNION ALL SELECT 6, 'P5 view students tanpa password aktif',
  count(*)::text, CASE WHEN count(*) = 0 THEN 'AMAN' ELSE 'CEK LAGI' END,
  'kolom password NOT NULL pada view students'
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'students'
  AND column_name = 'password' AND is_nullable = 'NO'

UNION ALL SELECT 7, 'P6 trigger pengunci kolom (target 2)',
  count(*)::text, CASE WHEN count(*) = 2 THEN 'AMAN' ELSE 'CEK LAGI' END,
  COALESCE(string_agg(tgname, ', '), 'TIDAK ADA')
FROM pg_trigger
WHERE tgrelid = 'public.profiles'::regclass AND NOT tgisinternal
  AND tgname IN ('trg_profiles_guard', 'trg_profiles_touch')

UNION ALL SELECT 8, 'P7 RPC lama sudah hilang (target 0)',
  count(*)::text, CASE WHEN count(*) = 0 THEN 'AMAN' ELSE 'CEK LAGI' END,
  COALESCE(string_agg(proname, ', '), 'semua RPC lama sudah dihapus')
FROM rpc_lama

UNION ALL SELECT 9, 'P8 SECURITY DEFINER punya search_path (target 0)',
  count(*)::text, CASE WHEN count(*) = 0 THEN 'AMAN' ELSE 'CEK LAGI' END,
  COALESCE(string_agg(proname, ', '), 'semua terkunci')
FROM fungsi_app
WHERE prosecdef
  AND proname NOT IN ('check_rate_limit', 'prune_rate_limits', 'custom_access_token_hook')
  AND (proconfig IS NULL
       OR NOT EXISTS (SELECT 1 FROM unnest(proconfig) cfg WHERE cfg LIKE 'search_path=%'))

UNION ALL SELECT 10, 'P9 tabel batas laju ada',
  (to_regclass('public.rate_limits') IS NOT NULL)::text,
  CASE WHEN to_regclass('public.rate_limits') IS NOT NULL THEN 'AMAN' ELSE 'CEK LAGI' END,
  'anti brute-force untuk RPC sensitif'

UNION ALL SELECT 11, 'P10 indeks skala (target >=5)',
  count(*)::text, CASE WHEN count(*) >= 5 THEN 'AMAN' ELSE 'CEK LAGI' END,
  COALESCE(string_agg(indexname, ', ' ORDER BY indexname), 'TIDAK ADA')
FROM pg_indexes
WHERE schemaname = 'public' AND indexname IN (
  'idx_profiles_classroom', 'idx_submissions_student_level',
  'idx_submissions_classroom_level', 'idx_submissions_completed',
  'idx_classrooms_teacher', 'idx_profiles_role')

ORDER BY no;

-- ══════════════════════════════════════════════════════════════════════════
-- CARA MEMBACA
--   Semua baris harus 'AMAN'. P2b bersifat informatif ('INFO' itu wajar bila
--   tabel arsip masih ada; tidak memengaruhi keamanan).
--
--   Yang paling menentukan:
--     P1  → 0     : tidak ada policy longgar lagi
--     P4  → false : hash password tidak bisa dibaca anon
--     P3  → <=3   : hanya 3 fungsi publik yang sengaja dibuka
--
-- UJI TAMBAHAN YANG DISARANKAN (uji perilaku, bukan konfigurasi):
--   node supabase/test_isolation.mjs
-- ══════════════════════════════════════════════════════════════════════════
