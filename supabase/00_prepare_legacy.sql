-- ══════════════════════════════════════════════════════════════════════════
-- RESQ-BOX — LANGKAH PERSIAPAN: arsipkan tabel skema v2 lama
--
-- KAPAN DIPAKAI
--   Bila database Anda masih berisi tabel skema v2 lama:
--     students (TABEL), level_submissions (student_id TEXT), classrooms (PK id)
--   Tabel-tabel itu BENTROK dengan skema baru sehingga migrasi 01 gagal:
--     • `students`       → harus jadi VIEW, tapi nama sudah dipakai TABEL
--     • `level_submissions` → student_id lama TEXT, baru UUID + FK ke profiles
--     • `classrooms`     → PK lama `id`, baru `code`
--
-- APA YANG DILAKUKAN SKRIP INI
--   Mengganti nama tabel lama menjadi `<nama>_v2_legacy`.
--   TIDAK menghapus apa pun — data lama tetap ada dan bisa Anda periksa.
--   `user_accounts` SENGAJA TIDAK disentuh, karena migrasi 01 memakainya
--   untuk menyalin profil (nama, kelas, absen, avatar, level) ke `profiles`.
--
-- Aman diulang (idempoten). Jalankan SELURUHNYA sekaligus, lalu lanjutkan
-- ke migrations/01_secure_schema.sql.
-- ══════════════════════════════════════════════════════════════════════════

-- ── 1. Tampilkan keadaan SEBELUM ─────────────────────────────────────────
SELECT
  '1_sebelum' AS bagian,
  c.relname AS nama,
  CASE c.relkind WHEN 'r' THEN 'TABEL' WHEN 'v' THEN 'VIEW' ELSE c.relkind::TEXT END AS tipe,
  (SELECT count(*) FROM pg_attribute a
    WHERE a.attrelid = c.oid AND a.attnum > 0 AND NOT a.attisdropped) AS jumlah_kolom
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relkind IN ('r', 'v', 'm')
ORDER BY c.relkind, c.relname;

-- ── 2. Arsipkan tabel lama yang bentrok ──────────────────────────────────
DO $$
DECLARE
  v_target TEXT;
  v_exists_as_table BOOLEAN;
  v_exists_as_view  BOOLEAN;
  v_archive_name    TEXT;
BEGIN
  FOREACH v_target IN ARRAY ARRAY['students', 'level_submissions', 'classrooms']
  LOOP
    -- Hanya proses bila objeknya berupa TABEL dan belum diarsipkan.
    SELECT EXISTS (
      SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public' AND c.relname = v_target AND c.relkind = 'r'
    ) INTO v_exists_as_table;

    SELECT EXISTS (
      SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public' AND c.relname = v_target AND c.relkind IN ('v', 'm')
    ) INTO v_exists_as_view;

    -- Kalau ternyata VIEW (artinya langkah 3 sudah dijalankan), lepas saja view-nya.
    IF v_exists_as_view AND NOT v_exists_as_table THEN
      EXECUTE format('DROP VIEW IF EXISTS public.%I CASCADE', v_target);
      RAISE NOTICE 'View public.% dilepas (sisa percobaan sebelumnya).', v_target;
      CONTINUE;
    END IF;

    IF NOT v_exists_as_table THEN
      RAISE NOTICE 'public.% bukan tabel / sudah beres — dilewati.', v_target;
      CONTINUE;
    END IF;

    v_archive_name := v_target || '_v2_legacy';

    -- Bila arsip dengan nama itu sudah ada, tambahkan akhiran angka.
    WHILE EXISTS (
      SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public' AND c.relname = v_archive_name
    ) LOOP
      v_archive_name := v_archive_name || '_2';
    END LOOP;

    EXECUTE format('ALTER TABLE public.%I RENAME TO %I', v_target, v_archive_name);
    RAISE NOTICE 'public.% diarsipkan menjadi public.%', v_target, v_archive_name;
  END LOOP;
END $$;

-- ── 3. Pastikan tidak ada sisa objek bernama `students` ──────────────────
DROP VIEW IF EXISTS public.students CASCADE;

-- ── 4. Verifikasi: bagian ini WAJIB mengembalikan 0 baris ───────────────
SELECT
  '4_sisa_yang_bentrok' AS bagian,
  c.relname AS nama,
  c.relkind::TEXT AS tipe,
  'MASIH BENTROK — jangan lanjut, kirim hasil ini ke pengembang' AS catatan
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN ('students', 'level_submissions', 'classrooms');

-- ── 5. Tampilkan keadaan SESUDAH (tabel inti harus sudah tidak ada, ──────
--      kecuali yang sudah diarsipkan) ─────────────────────────────────────
SELECT
  '5_sesudah' AS bagian,
  c.relname AS nama,
  CASE c.relkind WHEN 'r' THEN 'TABEL' WHEN 'v' THEN 'VIEW' ELSE c.relkind::TEXT END AS tipe
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relkind IN ('r', 'v', 'm')
ORDER BY c.relkind, c.relname;

-- ══════════════════════════════════════════════════════════════════════════
-- SETELAH SELESAI — jalankan berurutan, SATU BERKAS = SATU KALI RUN:
--   migrations/01_secure_schema.sql
--   migrations/02_rpc_and_hardening.sql
--   migrations/03_signup_role_control.sql
--   verify_security.sql      ← semua baris harus 'AMAN'
--
-- CATATAN: setelah arsip ini, tabel `students`/`classrooms`/`level_submissions`
-- baru akan DIBUAT ULANG dengan skema yang benar. Data siswa lama (daftar
-- kelas) tidak ikut pindah; kelas bisa dibuat ulang lewat Posko Guru, dan
-- data lama tetap tersimpan sebagai `*_v2_legacy` bila sewaktu-waktu perlu.
-- ══════════════════════════════════════════════════════════════════════════
