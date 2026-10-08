-- ══════════════════════════════════════════════════════════════════════════
-- RESQ-BOX — DIAGNOSIS LENGKAP (satu tabel hasil, tidak akan terpotong)
--
-- Menjawab tiga pertanyaan sekaligus:
--   1. Semua policy: di tabel mana, milik peran apa, untuk perintah apa
--   2. Fungsi yang punya EXECUTE untuk anon — dan lewat JALUR MANA
--      (langsung ke anon, atau lewat PUBLIC = semua orang)
--   3. Ringkasan jumlah policy longgar
--
-- Poin penting: `has_function_privilege('anon', ...)` bisa bernilai TRUE
-- karena warisan dari peran PUBLIC, bukan karena grant langsung ke anon.
-- Query ini MEMBEDAKAN keduanya, dan perbedaan itulah yang menentukan
-- apakah ini masalah nyata atau hanya soal kebersihan hak akses.
--
-- Jalankan SELURUHNYA sekaligus. Semua hasil keluar dalam satu tabel.
-- ══════════════════════════════════════════════════════════════════════════

WITH fungsi_app AS (
  SELECT p.oid, p.proname, p.proacl, p.proowner
  FROM pg_proc p
  JOIN pg_namespace n ON n.oid = p.pronamespace
  WHERE n.nspname = 'public'
    AND p.prokind = 'f'
    AND NOT EXISTS (SELECT 1 FROM pg_depend d WHERE d.objid = p.oid AND d.deptype = 'e')
)
SELECT
  1 AS bagian,
  'POLICY' AS jenis,
  p.tablename AS objek,
  p.policyname AS nama,
  p.cmd || ' | ' || p.roles::text AS keterangan,
  COALESCE(p.qual, p.with_check) AS ekspresi
FROM pg_policies p
WHERE p.schemaname = 'public'
  AND p.tablename NOT LIKE '%_v2_legacy'

UNION ALL

SELECT
  2,
  'HAK_FUNGSI',
  f.proname,
  COALESCE(g.grantee::regrole::text, 'PUBLIC') AS nama,
  'EXECUTE' AS keterangan,
  CASE
    WHEN g.grantee = 0 THEN 'BAHAYA: PUBLIC (semua orang, termasuk anon)'
    WHEN g.grantee::regrole::text = 'anon' THEN 'langsung ke anon'
    WHEN g.grantee::regrole::text = 'authenticated' THEN 'hanya user login'
    ELSE g.grantee::regrole::text
  END AS ekspresi
FROM fungsi_app f
CROSS JOIN LATERAL aclexplode(
  COALESCE(f.proacl, acldefault('f', f.proowner))
) AS g
WHERE g.privilege_type = 'EXECUTE'
  AND (g.grantee = 0 OR g.grantee::regrole::text IN ('anon', 'authenticated'))

UNION ALL

SELECT
  3,
  'HITUNGAN_ANON',
  'fungsi yang bisa dieksekusi anon',
  count(*)::text,
  'target maksimal 3',
  CASE WHEN count(*) <= 3 THEN 'AMAN' ELSE 'CEK LAGI' END
FROM fungsi_app f
WHERE has_function_privilege('anon', f.oid, 'EXECUTE')

UNION ALL

SELECT
  4,
  'HITUNGAN_POLICY',
  'policy longgar (ekspresi true)',
  count(*)::text,
  'target 0',
  CASE WHEN count(*) = 0 THEN 'AMAN' ELSE 'CEK LAGI' END
FROM pg_policies
WHERE schemaname = 'public'
  AND (COALESCE(qual, '') IN ('true', '(true)')
    OR COALESCE(with_check, '') IN ('true', '(true)'))

ORDER BY bagian, objek, nama;
