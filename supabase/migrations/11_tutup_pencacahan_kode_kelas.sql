-- ═══════════════════════════════════════════════════════════════════════════
-- RESQ-BOX — MIGRASI 11: TUTUP PENCACAHAN KODE KELAS
-- ═══════════════════════════════════════════════════════════════════════════
--
-- MASALAH YANG DISELESAIKAN
--
--   Diuji langsung dari luar memakai kunci publik yang sama dengan peramban,
--   TANPA LOGIN:
--
--       class_code_info('RESQ-8A')  ->  {"found": true, "name": "Kelas VIII-A",
--                                        "school_name": "SMP Negeri 1"}
--       class_code_info('RESQ-8B')  ->  {"found": true, "name": "Kelas VIII-B",
--                                        "school_name": "SMP Negeri 1"}
--
--   Jadi siapa pun di internet dapat MENCACAH kode kelas dan memastikan kelas
--   mana yang ada, beserta nama kelas dan nama sekolahnya.
--
--   Kode kelas dibuat dari yang DIKETIK GURU SENDIRI
--   (`v_code := upper(trim(p_code))`), sehingga polanya mudah ditebak:
--   RESQ-8A, RESQ-8B, RESQ-8C, RESQ-9A, dan seterusnya. Dari 21 tebakan yang
--   saya coba, 2 langsung berhasil.
--
--   RENCANA KE BANYAK SEKOLAH MEMBUAT INI LEBIH PENTING
--
--     Semakin banyak sekolah memakai RESQ-BOX, semakin banyak kelas yang ada,
--     dan semakin berharga daftar kelas itu bagi orang luar. Nama sekolah yang
--     bocor juga dapat dipakai untuk menyasar sekolah tertentu.
--
--   YANG TIDAK BOCOR
--
--     Data murid TIDAK bocor lewat jalur ini. RLS pada `profiles` dan
--     `level_submissions` tetap menolak tanpa login (diuji: HTTP 401).
--     Yang bocor hanya KEBERADAAN kelas, nama kelas, dan nama sekolah.
--
-- ═══════════════════════════════════════════════════════════════════════════
-- MENGAPA FUNGSINYA DIHAPUS, BUKAN DIBATASI
-- ═══════════════════════════════════════════════════════════════════════════
--
--   Memeriksa pemakaiannya lebih dahulu: `class_code_info` TIDAK DIPANGGIL
--   SAMA SEKALI oleh aplikasi. Pencarian di seluruh `src/` tidak menemukan
--   satu pun `.rpc('class_code_info', ...)`.
--
--   Jadi berkas ini tidak melayani kebutuhan apa pun, sementara ia MEMBUKA
--   data ke publik. Menghapusnya menghilangkan risiko tanpa mengurangi
--   kemampuan aplikasi sedikit pun.
--
--   `class_exists` juga dihapus karena alasan yang sama: tidak dipakai, dan
--   ia pun dapat dipanggil tanpa login untuk memastikan kode kelas ada.
--   (Fungsi itu terlanjur sudah ditolak hak aksesnya, tetapi menghapusnya
--   lebih rapi daripada membiarkan fungsi mati yang tidak dipakai.)
--
--   `username_available` DIPERTAHANKAN karena memang dipakai saat guru
--   membuat akun siswa. Ia hanya menjawab benar/salah untuk SATU nama yang
--   ditanyakan, jadi tidak dapat dipakai mencacah daftar. Batas laju pada
--   fungsi itu sudah ada sejak migrasi 10.
--
-- ═══════════════════════════════════════════════════════════════════════════
-- CATATAN PENTING BAGI YANG MEMBACA NANTI
-- ═══════════════════════════════════════════════════════════════════════════
--
--   Bila suatu saat aplikasi MEMBUTUHKAN pemeriksaan kode kelas sebelum
--   login, JANGAN menghidupkan kembali fungsi ini apa adanya. Yang perlu
--   dilakukan adalah memastikan pemeriksaan itu tidak dapat dipakai untuk
--   mencacah, misalnya dengan batas laju yang jauh lebih ketat per alamat IP.
--
--   Menghapus fungsi di sini juga menghapusnya dari skema PostgREST, sehingga
--   jalurnya benar-benar tertutup — bukan sekadar ditolak hak aksesnya.
-- ═══════════════════════════════════════════════════════════════════════════

DROP FUNCTION IF EXISTS public.class_code_info(TEXT);
DROP FUNCTION IF EXISTS public.class_exists(TEXT);

-- Periksa hasilnya: kedua fungsi harus sudah tidak ada lagi.
DO $$
DECLARE
  v_sisa INT;
BEGIN
  SELECT count(*) INTO v_sisa
  FROM pg_proc p
  JOIN pg_namespace n ON n.oid = p.pronamespace
  WHERE n.nspname = 'public'
    AND p.proname IN ('class_code_info', 'class_exists');

  IF v_sisa > 0 THEN
    RAISE EXCEPTION 'Masih ada % fungsi yang seharusnya terhapus.', v_sisa;
  END IF;

  RAISE NOTICE 'Terhapus. Pencacahan kode kelas sudah tertutup.';
END $$;
