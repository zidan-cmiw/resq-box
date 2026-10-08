-- ══════════════════════════════════════════════════════════════════════════
-- RESQ-BOX — MIGRASI 07: PERBAIKI HAK EKSEKUSI FUNGSI BANTU RLS
--
-- GEJALA YANG DIPERBAIKI
--   Setiap pengguna yang SUDAH LOGIN tidak bisa membaca datanya sendiri:
--     GET /rest/v1/profiles  →  HTTP 403
--     {"code":"42501","message":"permission denied for function can_read_student"}
--
--   Akibatnya Posko Guru kosong, halaman Profil gagal memuat, dan daftar
--   siswa tidak muncul — padahal datanya ada dan benar.
--
-- PENYEBAB
--   Migrasi 04 mencabut hak eksekusi fungsi bantu dari `authenticated`:
--     REVOKE ALL ON FUNCTION public.can_read_student(UUID) FROM PUBLIC, anon, authenticated;
--
--   Asumsi saya saat itu: "policy dievaluasi sebagai pemilik tabel, jadi
--   `authenticated` tidak perlu hak eksekusi." **Asumsi itu SALAH.**
--   PostgreSQL mengevaluasi ekspresi policy `USING (...)` sebagai PERAN YANG
--   MEMINTA (yaitu `authenticated`), bukan sebagai pemilik tabel. Jadi fungsi
--   yang dipanggil di dalam policy WAJIB boleh dieksekusi oleh peran itu.
--
--   Yang tetap TIDAK boleh: `anon`. Fungsi-fungsi ini tetap tidak dapat
--   dipanggil tanpa login.
--
-- APAKAH INI MELEMAHKAN KEAMANAN?
--   Tidak. Kelima fungsi ini memakai `auth.uid()` di dalamnya, sehingga:
--     • can_read_student(x) → true hanya bila x = auth.uid() (milik sendiri),
--       atau pemanggil adalah guru kelas x, atau admin.
--     • is_class_member(x)  → true hanya bila pemanggil anggota kelas x.
--   Memanggilnya langsung dari RPC hanya mengembalikan boolean tentang
--   DIRI SENDIRI, bukan data orang lain.
--
-- Aman dijalankan berulang.
-- ══════════════════════════════════════════════════════════════════════════

-- ── 1. Beri hak eksekusi fungsi bantu kepada `authenticated` ────────────
-- Tanpa ini, SEMUA policy RLS yang memakai fungsi tersebut akan gagal.
GRANT EXECUTE ON FUNCTION public.can_read_student(UUID)              TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_class_member(TEXT)               TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_teacher()                        TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin()                          TO authenticated;
GRANT EXECUTE ON FUNCTION public.jwt_role()                          TO authenticated;
GRANT EXECUTE ON FUNCTION public.official_level_score(INT, INT)      TO authenticated;

-- `anon` TETAP tidak boleh — ini yang menjaga batas keamanan.
REVOKE ALL ON FUNCTION public.can_read_student(UUID)         FROM anon;
REVOKE ALL ON FUNCTION public.is_class_member(TEXT)          FROM anon;
REVOKE ALL ON FUNCTION public.is_teacher()                   FROM anon;
REVOKE ALL ON FUNCTION public.is_admin()                     FROM anon;
REVOKE ALL ON FUNCTION public.jwt_role()                     FROM anon;
REVOKE ALL ON FUNCTION public.official_level_score(INT, INT) FROM anon;

-- Pastikan `anon` juga tidak mendapatkannya lewat peran PUBLIC.
REVOKE ALL ON FUNCTION public.can_read_student(UUID)         FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_class_member(TEXT)          FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_teacher()                   FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_admin()                     FROM PUBLIC;
REVOKE ALL ON FUNCTION public.jwt_role()                     FROM PUBLIC;
REVOKE ALL ON FUNCTION public.official_level_score(INT, INT) FROM PUBLIC;

-- ── 2. Pastikan tabel inti masih memberi hak yang benar ke authenticated ─
GRANT SELECT, UPDATE                  ON public.profiles          TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE  ON public.classrooms        TO authenticated;
GRANT SELECT, INSERT                  ON public.level_submissions TO authenticated;
GRANT SELECT                          ON public.students          TO authenticated;

-- ── 3. Verifikasi ───────────────────────────────────────────────────────
SELECT
  'V1 fungsi bantu ada di authenticated' AS pemeriksaan,
  count(*)::text AS nilai,
  CASE WHEN count(*) = 8 THEN 'AMAN' ELSE 'CEK LAGI' END AS status,
  COALESCE(string_agg(p.proname, ', ' ORDER BY p.proname), '-') AS detail
FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.proname IN ('can_read_student','is_class_member','is_teacher','is_admin','jwt_role',
                    'official_level_score','get_my_profile','get_my_progress')
  AND has_function_privilege('authenticated', p.oid, 'EXECUTE')

UNION ALL

SELECT
  'V2 fungsi bantu TIDAK bisa dipanggil anon (harus 0)',
  count(*)::text,
  CASE WHEN count(*) = 0 THEN 'AMAN' ELSE 'CEK LAGI' END,
  COALESCE(string_agg(p.proname, ', '), 'tidak ada — benar')
FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.proname IN ('can_read_student','is_class_member','is_teacher','is_admin','jwt_role',
                    'official_level_score')
  AND has_function_privilege('anon', p.oid, 'EXECUTE');

-- ══════════════════════════════════════════════════════════════════════════
-- SETELAH MENJALANKAN INI
--   Uji dengan akun yang sudah login (bukan anon):
--     node supabase/test_isolation.mjs
--   Semua 10 pemeriksaan harus lolos.
-- ══════════════════════════════════════════════════════════════════════════
