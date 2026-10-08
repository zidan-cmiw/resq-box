-- ══════════════════════════════════════════════════════════════════════════
-- RESQ-BOX — BERSIHKAN ARSIP SKEMA V2
--
-- KAPAN DIPAKAI
--   Setelah `verify_security.sql` menunjukkan P2 `AMAN` (tabel aktif sudah
--   ber-RLS) dan aplikasi berjalan normal di skema baru.
--
--   Tabel `*_v2_legacy` adalah salinan tabel skema v2 lama yang diarsipkan
--   oleh `00_prepare_legacy.sql`. Selama ada, ia:
--     • membuat pemeriksaan P2 melaporkan "tabel tanpa RLS"
--     • menahan ruang penyimpanan
--     • berisi hash password lama (di user_accounts_v2_legacy, bila ada)
--
--   Tabel-tabel ini TIDAK dipakai aplikasi sama sekali.
--
-- ⚠️  PERINGATAN: skrip ini MENGHAPUS data lama secara permanen.
--     Pastikan dulu Anda tidak memerlukan daftar siswa/nilai lama.
--     Bila ingin menyimpan sebagai cadangan, ekspor dulu:
--       Dashboard → Table Editor → pilih tabel → Export as CSV
-- ══════════════════════════════════════════════════════════════════════════

-- ── 1. Lihat dulu apa yang akan dihapus, beserta jumlah barisnya ─────────
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
    RAISE NOTICE 'Akan dihapus: public.% (% baris)', v_rec.relname, v_cnt;
  END LOOP;
END $$;

-- ── 2. Hapus tabel arsip ────────────────────────────────────────────────
DO $$
DECLARE
  v_rec RECORD;
BEGIN
  FOR v_rec IN
    SELECT c.relname
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relkind = 'r' AND c.relname LIKE '%_v2_legacy'
    ORDER BY c.relname
  LOOP
    EXECUTE format('DROP TABLE IF EXISTS public.%I CASCADE', v_rec.relname);
    RAISE NOTICE 'Terhapus: public.%', v_rec.relname;
  END LOOP;
END $$;

-- ── 3. Verifikasi: harus 0 baris ────────────────────────────────────────
SELECT
  '3_sisa_arsip_harus_kosong' AS bagian,
  c.relname AS nama,
  'MASIH ADA' AS catatan
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relname LIKE '%_v2_legacy';

-- ══════════════════════════════════════════════════════════════════════════
-- SETELAH SELESAI: jalankan `verify_security.sql` lagi.
--   P2  → harus AMAN
--   P2b → harus AMAN
-- ══════════════════════════════════════════════════════════════════════════
