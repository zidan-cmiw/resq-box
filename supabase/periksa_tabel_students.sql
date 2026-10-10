-- ══════════════════════════════════════════════════════════════════════════
-- PERIKSA TABEL `students` YANG MENYIMPAN PASSWORD TEKS BIASA
-- (satu tabel hasil, supaya seluruhnya terbaca sekaligus)
-- ══════════════════════════════════════════════════════════════════════════
--
-- MENGAPA SATU TABEL
--   Versi sebelumnya memakai lima SELECT terpisah, dan Supabase SQL Editor
--   hanya menampilkan hasil query TERAKHIR — sehingga yang terlihat hanya
--   daftar kolom. Padahal justru bagian LAIN yang menentukan tingkat
--   risikonya: apakah tabel itu dapat dibaca lewat API.
--
-- PERTANYAAN YANG DIJAWAB
--   Tabel `students` (peninggalan skema v2) menyimpan password sebagai TEKS
--   BIASA, bukan hash. Yang perlu diketahui sebelum memutuskan menghapusnya:
--
--     1. Apakah RLS aktif?         -> kalau TIDAK, ada masalah serius
--     2. Apakah ada policy?        -> kalau KOSONG, tidak dapat dibaca siapa pun
--     3. Siapa punya hak?          -> `anon` dengan SELECT = bahaya
--     4. Berapa baris isinya?      -> menentukan apakah perlu diselamatkan
--
-- Hanya membaca. Tidak mengubah apa pun.
-- ══════════════════════════════════════════════════════════════════════════

WITH
ringkas AS (
  SELECT
    (SELECT relrowsecurity FROM pg_class WHERE oid = 'public.students'::regclass) AS rls_aktif,
    (SELECT count(*) FROM pg_policies WHERE schemaname = 'public' AND tablename = 'students') AS jumlah_policy,
    (SELECT count(*) FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'students') AS jumlah_kolom
),
policy AS (
  SELECT coalesce(string_agg(policyname || ' [' || cmd || ']', ', '), 'TIDAK ADA POLICY') AS rincian
    FROM pg_policies
   WHERE schemaname = 'public' AND tablename = 'students'
),
hak AS (
  SELECT coalesce(string_agg(DISTINCT grantee || ':' || privilege_type, ', '),
                  'tidak ada hak terdaftar') AS rincian
    FROM information_schema.role_table_grants
   WHERE table_schema = 'public' AND table_name = 'students'
),
hak_anon AS (
  SELECT count(*) AS jumlah
    FROM information_schema.role_table_grants
   WHERE table_schema = 'public' AND table_name = 'students'
     AND grantee = 'anon'
),
jumlah_baris AS (
  SELECT CASE
           WHEN EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
                         WHERE n.nspname = 'public' AND c.relname = 'students' AND c.relkind = 'r')
           THEN (SELECT count(*) FROM public.students)
           ELSE -1
         END AS n
)

SELECT 1 AS no,
       'RLS aktif pada tabel students' AS pemeriksaan,
       CASE WHEN ringkas.rls_aktif THEN 'OK' ELSE 'MASALAH' END AS hasil,
       CASE WHEN ringkas.rls_aktif
            THEN 'RLS aktif — baris disaring per pengguna'
            ELSE 'RLS MATI — seluruh isi tabel dapat dibaca lewat API!' END AS rincian
  FROM ringkas
UNION ALL
SELECT 2, 'Ada policy yang mengizinkan baca?',
       CASE WHEN ringkas.jumlah_policy = 0 THEN 'OK' ELSE 'PERIKSA' END,
       CASE WHEN ringkas.jumlah_policy = 0
            THEN 'TIDAK ADA policy — tabel tidak dapat dibaca siapa pun lewat API'
            ELSE policy.rincian END
  FROM ringkas, policy
UNION ALL
SELECT 3, 'anon punya hak pada tabel?',
       CASE WHEN hak_anon.jumlah = 0 THEN 'OK' ELSE 'MASALAH' END,
       COALESCE(hak.rincian, 'tidak ada') || '  (hak anon: ' || hak_anon.jumlah || ')'
  FROM hak, hak_anon
UNION ALL
SELECT 4, 'Berapa baris isinya?',
       CASE WHEN jumlah_baris.n = 0 THEN 'OK'
            WHEN jumlah_baris.n < 0 THEN 'PERIKSA'
            ELSE 'PERIKSA' END,
       CASE WHEN jumlah_baris.n < 0
            THEN 'tabel tidak ada'
            ELSE jumlah_baris.n || ' baris' END
  FROM jumlah_baris
UNION ALL
SELECT 5, 'Apakah kolom password berisi?',
       'PERIKSA',
       (SELECT CASE
                 WHEN EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
                               WHERE n.nspname = 'public' AND c.relname = 'students' AND c.relkind = 'r')
                 THEN 'perlu diperiksa terpisah — jalankan query di bawah'
                 ELSE 'tabel tidak ada' END)
ORDER BY no;

-- ══════════════════════════════════════════════════════════════════════════
-- TAMBAHAN — jalankan TERPISAH bila tabelnya memang ada
-- ══════════════════════════════════════════════════════════════════════════
--
-- Melihat apakah kolom password benar-benar berisi. Hasilnya hanya berupa
-- jumlah dan contoh yang DISAMARKAN, bukan password aslinya — supaya isi
-- tabelnya tidak ikut tersalin ke tangkapan layar atau obrolan.
--
--   SELECT count(*)                                        AS jumlah_baris,
--          count(password)                                 AS password_terisi,
--          count(*) FILTER (WHERE password IS NOT NULL
--                             AND password <> '')          AS password_ada_isi,
--          left(md5(coalesce(password, '')), 8)            AS contoh_hash_md5
--     FROM public.students
--    LIMIT 1;
--
-- Bila `password_ada_isi` lebih besar dari nol, tabel itu BENAR-BENAR
-- menyimpan password yang dapat dibaca. Itu perlu ditangani.
