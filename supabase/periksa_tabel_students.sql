-- ══════════════════════════════════════════════════════════════════════════
-- PERIKSA TABEL LAMA `students` YANG MENYIMPAN PASSWORD TEKS BIASA
-- ══════════════════════════════════════════════════════════════════════════
--
-- MENGAPA BERKAS INI ADA
--   Verifikasi keamanan database melaporkan:
--
--       pemeriksaan 11: siswa kolom password teks biasa -> MASALAH
--       rincian: students.password
--
--   Artinya masih ada tabel `students` (peninggalan skema v2) yang menyimpan
--   password sebagai TEKS BIASA, bukan hash. Password teks biasa jauh lebih
--   berbahaya daripada hash: siapa pun yang dapat membaca tabel itu langsung
--   melihat password aslinya, dan password itu kemungkinan dipakai ulang di
--   tempat lain.
--
--   Sebelum memutuskan menghapusnya, perlu diketahui tiga hal:
--     1. Apakah RLS aktif pada tabel itu
--     2. Apakah ada policy yang membuatnya dapat dibaca
--     3. Berapa banyak baris dan kolom yang dimilikinya
--
--   Bila tabel itu TIDAK dapat dibaca siapa pun lewat API, risikonya jauh
--   lebih kecil — tetapi password teks biasa tetap sebaiknya tidak disimpan.
--
-- Hanya membaca. Tidak mengubah apa pun.
-- ══════════════════════════════════════════════════════════════════════════

-- ── 1. Ringkasan tabel students ───────────────────────────────────────────
SELECT '1. Ringkasan' AS bagian,
       (SELECT count(*) FROM information_schema.columns
         WHERE table_schema = 'public' AND table_name = 'students') AS jumlah_kolom,
       (SELECT relrowsecurity FROM pg_class
         WHERE oid = 'public.students'::regclass) AS rls_aktif,
       (SELECT count(*) FROM pg_policies
         WHERE schemaname = 'public' AND tablename = 'students') AS jumlah_policy;

-- ── 2. Daftar policy pada tabel students ──────────────────────────────────
-- Bila hasilnya KOSONG, tabel itu tidak dapat dibaca siapa pun lewat API.
SELECT '2. Policy' AS bagian, policyname, cmd AS perintah, roles, qual AS syarat
  FROM pg_policies
 WHERE schemaname = 'public' AND tablename = 'students';

-- ── 3. Hak akses tingkat tabel ────────────────────────────────────────────
-- Siapa saja yang punya hak pada tabel ini, dan hak apa.
SELECT '3. Hak akses' AS bagian, grantee, privilege_type
  FROM information_schema.role_table_grants
 WHERE table_schema = 'public' AND table_name = 'students'
 ORDER BY grantee, privilege_type;

-- ── 4. Kolom-kolom tabel students ─────────────────────────────────────────
SELECT '4. Kolom' AS bagian, column_name, data_type
  FROM information_schema.columns
 WHERE table_schema = 'public' AND table_name = 'students'
 ORDER BY ordinal_position;

-- ── 5. Berapa baris isinya? ───────────────────────────────────────────────
-- Memakai query dinamis supaya tidak gagal bila tabelnya sudah tidak ada.
DO $$
DECLARE
  v_jumlah BIGINT;
BEGIN
  IF EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
              WHERE n.nspname = 'public' AND c.relname = 'students' AND c.relkind = 'r') THEN
    EXECUTE 'SELECT count(*) FROM public.students' INTO v_jumlah;
    RAISE NOTICE 'Tabel public.students ada dan berisi % baris.', v_jumlah;
  ELSE
    RAISE NOTICE 'Tabel public.students TIDAK ADA.';
  END IF;
END $$;
