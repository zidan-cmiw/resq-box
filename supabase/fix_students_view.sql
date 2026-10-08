-- ══════════════════════════════════════════════════════════════════════════
-- RESQ-BOX — PEMULIHAN: lepas sisa objek `students`
--
-- KAPAN DIPAKAI
--   Hanya bila `00_check_state.sql` bagian 4 melaporkan ADA objek bernama
--   `students` (biasanya berupa VIEW dari skema v2). Objek itu yang membuat
--   migrasi 01 gagal dengan:
--     ERROR 42883: function public.can_read_student(character varying) does not exist
--
--   Bila bagian 4 KOSONG, JANGAN jalankan berkas ini — langsung jalankan
--   `migrations/01_secure_schema.sql`.
--
-- Aman diulang kapan saja, termasuk pada database yang masih kosong.
-- ══════════════════════════════════════════════════════════════════════════

-- ── 1. Tampilkan sisa objek `students` (harus kosong setelah pemulihan) ──
SELECT
  '1_sebelum_pemulihan' AS bagian,
  c.relname AS nama,
  c.relkind::TEXT AS relkind
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relname = 'students';

-- ── 2. Lepas sisa objek `students` ───────────────────────────────────────
DO $$
DECLARE
  v_obj RECORD;
BEGIN
  -- 2a. VIEW / MATERIALIZED VIEW lebih dulu. `DROP TABLE ... CASCADE` akan
  --     ikut menghapus view, sehingga bila tabel dilepas lebih dulu, view
  --     tidak pernah terlepas secara eksplisit.
  FOR v_obj IN
    SELECT c.relname
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relname = 'students' AND c.relkind IN ('v', 'm')
  LOOP
    EXECUTE format('DROP VIEW IF EXISTS public.%I CASCADE', v_obj.relname);
    RAISE NOTICE 'View public.% dilepas.', v_obj.relname;
  END LOOP;

  -- 2b. Tabel fisik skema v2 (bila ada).
  FOR v_obj IN
    SELECT c.relname
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relname = 'students' AND c.relkind = 'r'
  LOOP
    EXECUTE format('ALTER TABLE public.%I DROP CONSTRAINT IF EXISTS fk_classroom', v_obj.relname);
    EXECUTE format('DROP TABLE IF EXISTS public.%I CASCADE', v_obj.relname);
    RAISE NOTICE 'Tabel public.% dilepas.', v_obj.relname;
  END LOOP;
END $$;

-- ── 3. Sabuk pengaman terakhir ──────────────────────────────────────────
DROP VIEW IF EXISTS public.students CASCADE;

-- ── 4. Verifikasi: WAJIB mengembalikan 0 baris ──────────────────────────
SELECT
  '4_setelah_pemulihan_harus_kosong' AS bagian,
  c.relname AS nama,
  c.relkind::TEXT AS relkind,
  'MASIH ADA — jangan lanjut, kabari pengembang' AS catatan
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relname = 'students';

-- ══════════════════════════════════════════════════════════════════════════
-- LANJUTKAN DENGAN (berurutan):
--   migrations/01_secure_schema.sql
--   migrations/02_rpc_and_hardening.sql
--   migrations/03_signup_role_control.sql
--   verify_security.sql
-- ══════════════════════════════════════════════════════════════════════════
