-- ══════════════════════════════════════════════════════════════════════════
-- RESQ-BOX — MIGRASI 13: KUNCI JALUR TULIS NILAI & PERAN
--
-- HASIL AUDIT KEAMANAN
--   Dua kelemahan nyata ditemukan dan sudah diverifikasi langsung pada kode
--   migrasi, bukan dugaan:
--
--   1. KRITIS — siswa dapat MENULIS NILAI PALSU langsung ke tabel.
--      Policy `submissions_insert_own` (01:523-525) hanya memeriksa
--      `student_id = auth.uid()`. Kolom `score`, `level_number`, dan
--      `classroom_code` TIDAK diperiksa. Ditambah GRANT INSERT (01:611),
--      seorang siswa dapat mengirim POST ke REST API:
--
--          {"student_id": <uuid sendiri>, "level_number": 3,
--           "score": 100, "classroom_code": "<kode kelas guru lain>"}
--
--      Hasilnya: nilai 100 palsu, DAN baris itu muncul di rekap guru lain
--      karena `list_class_submissions` hanya menyaring `classroom_code`.
--
--      Komentar pada 01:521 menyatakan "hanya lewat RPC submit_level_result",
--      tetapi GRANT dan policy-nya TIDAK menegakkan hal itu. Komentar tidak
--      dapat mengamankan apa pun.
--
--   2. TINGGI — `jwt_role()` membaca `user_metadata.role` sebagai cadangan.
--      `user_metadata` dapat ditulis sendiri oleh pengguna lewat
--      `supabase.auth.updateUser({ data: { role: 'admin' } })`. Untuk akun
--      yang `app_metadata.role`-nya kosong, `is_admin()` menjadi true,
--      sehingga `guard_profile_privileges` melewati seluruh penguncian dan
--      pengguna dapat menaikkan perannya sendiri secara permanen.
--
-- APA YANG DILAKUKAN MIGRASI INI
--   Bagian 1: menutup jalur tulis langsung ke `level_submissions`.
--   Bagian 2: mempersempit `jwt_role()` agar hanya mempercayai app_metadata.
--   Bagian 3: memeriksa hasilnya dan melaporkan lewat NOTICE.
--
-- AMAN DIJALANKAN BERULANG (idempoten).
-- ══════════════════════════════════════════════════════════════════════════


-- ══════════════════════════════════════════════════════════════════════════
-- BAGIAN 1 — TUTUP JALUR TULIS LANGSUNG KE level_submissions
--
-- Setelah ini, satu-satunya cara menulis nilai adalah RPC
-- `submit_level_result`, yang berjalan SECURITY DEFINER (sebagai pemilik
-- fungsi, bukan sebagai klien), sehingga INSERT di dalamnya tetap berhasil.
--
-- Sudah diperiksa: aplikasi TIDAK PERNAH melakukan insert langsung ke tabel
-- ini. Satu-satunya pemakaian di klien adalah `.select(...)` untuk membaca
-- (src/utils/supabaseClient.ts:1443) dan pemanggilan
-- `supabase.rpc('submit_level_result', ...)` (baris 1254). Jadi pencabutan
-- GRANT ini tidak merusak aplikasi.
-- ══════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS submissions_insert_own ON public.level_submissions;

REVOKE INSERT ON public.level_submissions FROM authenticated;
REVOKE INSERT ON public.level_submissions FROM anon;

-- Baca tetap diizinkan; policy SELECT-nya sudah dibatasi can_read_student().
GRANT SELECT ON public.level_submissions TO authenticated;


-- ══════════════════════════════════════════════════════════════════════════
-- BAGIAN 2 — jwt_role() HANYA MEMPERCAYAI app_metadata
--
-- `app_metadata` hanya dapat ditulis server (service_role / SQL Editor).
-- `user_metadata` dapat ditulis pengguna sendiri, sehingga TIDAK BOLEH
-- dijadikan sumber peran.
--
-- Akun lama yang app_metadata.role-nya kosong tidak kehilangan haknya:
-- `is_teacher()` dan `is_admin()` tetap memeriksa tabel `profiles` sebagai
-- cadangan (01:245-252 dan seterusnya), jadi peran yang sah tetap dikenali.
-- ══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.jwt_role()
RETURNS TEXT
LANGUAGE sql STABLE
AS $$
  SELECT COALESCE(
    nullif(current_setting('request.jwt.claims', true), '')::jsonb
      -> 'app_metadata' ->> 'role',
    'student'
  );
$$;

REVOKE ALL ON FUNCTION public.jwt_role() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.jwt_role() TO authenticated;


-- ══════════════════════════════════════════════════════════════════════════
-- BAGIAN 3 — PEMERIKSAAN HASIL
-- ══════════════════════════════════════════════════════════════════════════

DO $$
DECLARE
  v_policy INT;
  v_insert BOOLEAN;
BEGIN
  SELECT count(*) INTO v_policy
    FROM pg_policies
   WHERE schemaname = 'public'
     AND tablename  = 'level_submissions'
     AND policyname = 'submissions_insert_own';

  IF v_policy = 0 THEN
    RAISE NOTICE '[OK] Policy INSERT pada level_submissions sudah hilang.';
  ELSE
    RAISE WARNING '[GAGAL] Policy submissions_insert_own MASIH ADA.';
  END IF;

  SELECT has_table_privilege('authenticated', 'public.level_submissions', 'INSERT')
    INTO v_insert;

  IF v_insert THEN
    RAISE WARNING '[GAGAL] authenticated MASIH punya hak INSERT pada level_submissions.';
  ELSE
    RAISE NOTICE '[OK] authenticated tidak lagi punya hak INSERT pada level_submissions.';
  END IF;

  IF position('user_metadata' IN pg_get_functiondef('public.jwt_role()'::regprocedure)) = 0 THEN
    RAISE NOTICE '[OK] jwt_role() tidak lagi membaca user_metadata.';
  ELSE
    RAISE WARNING '[GAGAL] jwt_role() masih merujuk user_metadata.';
  END IF;
END $$;
