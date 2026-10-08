-- ══════════════════════════════════════════════════════════════════════════
-- RESQ-BOX — LANGKAH 0: PERIKSA KEADAAN DATABASE (jalankan ini DULU)
--
-- Skrip ini AMAN dijalankan kapan saja, bahkan pada database kosong.
-- Ia tidak mengubah apa pun — hanya melaporkan keadaan.
--
-- Latar belakang: di Supabase SQL Editor, satu script dijalankan dalam SATU
-- transaksi. Jadi bila ada satu pernyataan gagal, SELURUH script di-rollback
-- dan tidak ada tabel yang tersimpan. Itu sebabnya setelah error
-- "can_read_student(character varying)", tabel `profiles` bisa tidak ada.
-- ══════════════════════════════════════════════════════════════════════════

-- ── 1. Tabel apa saja yang ada di skema public saat ini ──────────────────
SELECT
  '1_tabel_yang_ada' AS bagian,
  c.relname AS nama_objek,
  CASE c.relkind
    WHEN 'r' THEN 'TABEL'
    WHEN 'v' THEN 'VIEW'
    WHEN 'm' THEN 'MATERIALIZED VIEW'
    ELSE c.relkind::TEXT
  END AS tipe
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relkind IN ('r', 'v', 'm')
ORDER BY c.relkind, c.relname;

-- ── 2. Ringkasan: berapa tabel inti yang sudah ada ───────────────────────
SELECT
  '2_ringkasan' AS bagian,
  t.nama AS objek_inti,
  (to_regclass('public.' || quote_ident(t.nama)) IS NOT NULL) AS ada,
  CASE WHEN to_regclass('public.' || quote_ident(t.nama)) IS NOT NULL
       THEN 'OK' ELSE 'BELUM ADA' END AS status
FROM (VALUES ('profiles'), ('classrooms'), ('level_submissions'), ('user_accounts'), ('students')) AS t(nama);

-- ── 3. Apakah skema aman sudah terpasang? ────────────────────────────────
SELECT
  '3_skema_aman' AS bagian,
  'fungsi can_read_student(uuid)' AS komponen,
  (to_regprocedure('public.can_read_student(uuid)') IS NOT NULL) AS ada
UNION ALL SELECT
  '3_skema_aman', 'fungsi is_class_member(text)',
  (to_regprocedure('public.is_class_member(text)') IS NOT NULL)
UNION ALL SELECT
  '3_skema_aman', 'fungsi submit_level_result(int,int,jsonb,bool,int)',
  (to_regprocedure('public.submit_level_result(integer,integer,jsonb,boolean,integer)') IS NOT NULL)
UNION ALL SELECT
  '3_skema_aman', 'fungsi teacher_create_student(text,text,text,text,text)',
  (to_regprocedure('public.teacher_create_student(text,text,text,text,text)') IS NOT NULL)
UNION ALL SELECT
  '3_skema_aman', 'trigger guard_profile_privileges',
  EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_profiles_guard')
UNION ALL SELECT
  '3_skema_aman', 'tabel rate_limits',
  (to_regclass('public.rate_limits') IS NOT NULL);

-- ── 4. Adakah sisa objek `students` yang menghalangi? ───────────────────
SELECT
  '4_sisa_objek_students' AS bagian,
  c.relname AS nama,
  c.relkind::TEXT AS relkind,
  CASE c.relkind
    WHEN 'v' THEN 'VIEW LAMA — inilah penyebab error 42883 (varchar)'
    WHEN 'r' THEN 'TABEL LAMA skema v2 — perlu dilepas'
    ELSE 'perlu diperiksa' END AS catatan
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relname = 'students';

-- ── 5. Adakah policy yang masih membolehkan SEMUA orang? ────────────────
SELECT
  '5_policy_terbuka' AS bagian,
  tablename, policyname,
  COALESCE(qual, with_check) AS ekspresi
FROM pg_policies
WHERE schemaname = 'public'
  AND (COALESCE(qual, '') IN ('true', '(true)') OR COALESCE(with_check, '') IN ('true', '(true)'));

-- ══════════════════════════════════════════════════════════════════════════
-- CARA MEMBACA HASILNYA
--
-- • Bila bagian 2 semuanya 'BELUM ADA' dan bagian 3 semuanya false:
--     → Database masih bersih. Jalankan `migrations/01_secure_schema.sql`
--       lalu 02 lalu 03. Tidak perlu apa-apa lagi. (INI KEMUNGKINAN TERBESAR
--       untuk kasus Anda.)
--
-- • Bila bagian 4 mengembalikan baris dengan relkind 'v':
--     → Jalankan `fix_students_view.sql` dulu, baru 01 → 02 → 03.
--
-- • Bila bagian 2 sebagian 'OK':
--     → Skema terpasang sebagian. Jalankan 01 (idempoten) sampai sukses,
--       baru lanjut 02 dan 03.
--
-- • Bila bagian 5 mengembalikan baris:
--     → Masih ada policy longgar; jalankan 02 untuk menutupnya.
-- ══════════════════════════════════════════════════════════════════════════
