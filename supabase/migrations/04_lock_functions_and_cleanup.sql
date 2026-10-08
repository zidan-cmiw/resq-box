-- ══════════════════════════════════════════════════════════════════════════
-- RESQ-BOX — MIGRASI 04: PENUTUPAN HAK FUNGSI + BERSIH TABEL ARSIP
--
-- Menutup dua temuan dari `diagnose_acl.sql`:
--
--   A. 3 policy longgar (`anon_select_*`) ternyata berada di TABEL ARSIP
--      `*_v2_legacy`. Policy itu ikut berpindah saat `ALTER TABLE ... RENAME`.
--      Karena `students_v2_legacy` masih memuat password plaintext, tabel
--      arsip itu HARUS dihapus — bukan sekadar ditutup.
--
--   B. `anon` masih punya EXECUTE pada 20 fungsi proyek lewat peran PUBLIC.
--      Blok REVOKE di dalam `EXECUTE format(...)` (migrasi 02) tidak bekerja,
--      sedangkan REVOKE eksplisit bekerja. Migrasi ini memakai REVOKE eksplisit.
--
-- Aman dijalankan berulang. Jalankan di Supabase SQL Editor.
-- ══════════════════════════════════════════════════════════════════════════

-- ══════════════════════════════════════════════════════════════════════════
-- BAGIAN A — HAPUS TABEL ARSIP SKEMA V2
--
-- ⚠️  PERMANEN. Bila Anda masih memerlukan daftar siswa atau nilai lama,
--     ekspor dulu: Dashboard → Table Editor → pilih tabel → Export as CSV.
--     Bila ragu, LEWATI bagian ini dan jalankan Bagian B saja — tetapi
--     ketahui bahwa `students_v2_legacy` memuat password plaintext yang
--     masih bisa dibaca anon selama tabelnya ada.
-- ══════════════════════════════════════════════════════════════════════════
DO $$
DECLARE
  v_rec RECORD;
  v_cnt BIGINT;
BEGIN
  FOR v_rec IN
    SELECT c.relname
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relkind = 'r' AND c.relname LIKE '%_v2_legacy'
    ORDER BY c.relname
  LOOP
    EXECUTE format('SELECT count(*) FROM public.%I', v_rec.relname) INTO v_cnt;
    RAISE NOTICE 'Menghapus arsip public.% (% baris)', v_rec.relname, v_cnt;
    EXECUTE format('DROP TABLE IF EXISTS public.%I CASCADE', v_rec.relname);
  END LOOP;
END $$;

-- ══════════════════════════════════════════════════════════════════════════
-- BAGIAN B — TUTUP HAK EKSEKUSI FUNGSI
-- ══════════════════════════════════════════════════════════════════════════

-- B1. Jaring pengaman: cabut hak pada SEMUA fungsi di skema public sekaligus.
--     Ini menangkap fungsi apa pun yang belum terdaftar, termasuk fungsi baru
--     di masa depan. REVOKE eksplisit (bukan di dalam EXECUTE format) terbukti
--     bekerja, sedangkan versi loop di migrasi 02 tidak.
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM anon;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM authenticated;

-- B2. Hak eksplisit: HANYA tiga fungsi ini yang boleh dipanggil tanpa login.
GRANT EXECUTE ON FUNCTION public.username_available(TEXT)    TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.class_code_info(TEXT)       TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.legacy_account_exists(TEXT) TO anon, authenticated;

-- B3. Sisanya wajib login (daftar eksplisit, satu per satu).
GRANT EXECUTE ON FUNCTION public.get_my_profile()                      TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_my_profile(JSONB)              TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_progress()                     TO authenticated;
GRANT EXECUTE ON FUNCTION public.class_exists(TEXT)                    TO authenticated;
GRANT EXECUTE ON FUNCTION public.submit_level_result(INT, INT, JSONB, BOOLEAN, INT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.list_my_classrooms()                  TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_my_classroom(TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rename_my_classroom(TEXT, TEXT)       TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_my_classroom(TEXT)             TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_my_student(UUID)               TO authenticated;
GRANT EXECUTE ON FUNCTION public.list_class_students(TEXT)             TO authenticated;
GRANT EXECUTE ON FUNCTION public.list_class_submissions(TEXT)          TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_my_teacher_profile(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.teacher_create_student(TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;

-- B4. Hook Supabase Auth: hanya boleh dipanggil oleh peran auth-nya.
GRANT EXECUTE ON FUNCTION public.custom_access_token_hook(JSONB) TO supabase_auth_admin;
REVOKE ALL ON FUNCTION public.custom_access_token_hook(JSONB) FROM PUBLIC, anon, authenticated;

-- B5. Fungsi bantu RLS (dipakai di dalam ekspresi policy).
--
-- PENTING — pelajaran dari bug nyata:
--   PostgreSQL mengevaluasi `USING (...)` pada policy sebagai PERAN YANG
--   MEMINTA (yaitu `authenticated`), BUKAN sebagai pemilik tabel. Jadi fungsi
--   yang dipanggil di dalam policy WAJIB boleh dieksekusi oleh peran itu.
--   Mencabutnya dari `authenticated` membuat SELURUH policy gagal dengan
--   "permission denied for function can_read_student" — pengguna yang sudah
--   login tidak bisa membaca datanya sendiri.
--
--   Karena itu: `authenticated` BOLEH, `anon` dan PUBLIC TIDAK.
--   Ini tetap aman karena kelima fungsi memakai auth.uid() di dalamnya.
REVOKE ALL ON FUNCTION public.jwt_role()                              FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_teacher()                            FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_admin()                              FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_class_member(TEXT)                   FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.can_read_student(UUID)                  FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.official_level_score(INT, INT)          FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.jwt_role()                          TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_teacher()                        TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin()                          TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_class_member(TEXT)               TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_read_student(UUID)              TO authenticated;
GRANT EXECUTE ON FUNCTION public.official_level_score(INT, INT)      TO authenticated;

-- Fungsi internal yang TIDAK dipakai di policy — tetap tertutup sepenuhnya.
REVOKE ALL ON FUNCTION public.check_rate_limit(TEXT, TEXT, INT, INT)  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.prune_rate_limits()                     FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.touch_updated_at()                      FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.guard_profile_privileges()              FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_auth_user()                  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.admin_promote_to_admin(TEXT)            FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.admin_set_unlocked_level(TEXT, INT)     FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.admin_purge_legacy_password_hashes()    FROM PUBLIC, anon, authenticated;

-- ══════════════════════════════════════════════════════════════════════════
-- BAGIAN C — VERIFIKASI (harus semua AMAN)
-- ══════════════════════════════════════════════════════════════════════════
WITH fungsi_app AS (
  SELECT p.oid, p.proname
  FROM pg_proc p
  JOIN pg_namespace n ON n.oid = p.pronamespace
  WHERE n.nspname = 'public' AND p.prokind = 'f'
    AND NOT EXISTS (SELECT 1 FROM pg_depend d WHERE d.objid = p.oid AND d.deptype = 'e')
)
SELECT
  'C1 fungsi proyek bisa dipanggil anon (target <=3)' AS pemeriksaan,
  count(*)::text AS nilai,
  CASE WHEN count(*) <= 3 THEN 'AMAN' ELSE 'CEK LAGI' END AS status,
  COALESCE(string_agg(proname, ', ' ORDER BY proname), 'tidak ada') AS detail
FROM fungsi_app WHERE has_function_privilege('anon', oid, 'EXECUTE')

UNION ALL
SELECT
  'C2 policy longgar (target 0)',
  count(*)::text,
  CASE WHEN count(*) = 0 THEN 'AMAN' ELSE 'CEK LAGI' END,
  COALESCE(string_agg(policyname || '@' || tablename, ', '), 'tidak ada')
FROM pg_policies
WHERE schemaname = 'public'
  AND (COALESCE(qual, '') IN ('true', '(true)') OR COALESCE(with_check, '') IN ('true', '(true)'))

UNION ALL
SELECT
  'C3 tabel arsip v2 tersisa (target 0)',
  count(*)::text,
  CASE WHEN count(*) = 0 THEN 'AMAN' ELSE 'CEK LAGI' END,
  COALESCE(string_agg(relname, ', '), 'bersih')
FROM pg_class
WHERE relnamespace = 'public'::regnamespace AND relkind = 'r'
  AND relname LIKE '%_v2_legacy';
