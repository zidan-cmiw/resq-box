-- ══════════════════════════════════════════════════════════════════════════
-- RESQ-BOX — MIGRASI 05: AKTIFKAN REALTIME UNTUK TABEL BARU
--
-- MASALAH YANG DIPERBAIKI
--   Dashboard guru berlangganan perubahan live ke tabel `profiles`
--   (`supabaseClient.ts:1050`), tetapi `profiles` TIDAK PERNAH didaftarkan
--   ke publikasi `supabase_realtime`. Akibatnya siswa yang baru mendaftar
--   tidak muncul di Posko Guru sampai halaman di-refresh manual.
--
--   Skema v2 lama mendaftarkan `students`, tetapi di skema baru `students`
--   adalah VIEW — dan Realtime tidak bisa memantau view (tidak punya primary
--   key, tidak menerima event WAL). Jadi penggantinya adalah `profiles`.
--
-- Aman dijalankan berulang. Jalankan di Supabase SQL Editor.
-- ══════════════════════════════════════════════════════════════════════════

-- ── 1. Daftarkan tabel yang benar-benar perlu dipantau live ──────────────
DO $$
BEGIN
  -- profiles: siswa baru, perubahan avatar/nama/level dari guru
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
    RAISE NOTICE 'profiles ditambahkan ke publikasi Realtime.';
  EXCEPTION WHEN duplicate_object THEN
    RAISE NOTICE 'profiles sudah terdaftar — dilewati.';
  END;

  -- level_submissions: nilai baru masuk
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.level_submissions;
    RAISE NOTICE 'level_submissions ditambahkan ke publikasi Realtime.';
  EXCEPTION WHEN duplicate_object THEN
    RAISE NOTICE 'level_submissions sudah terdaftar — dilewati.';
  END;

  -- classrooms: nama kelas berubah / kelas dihapus
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.classrooms;
    RAISE NOTICE 'classrooms ditambahkan ke publikasi Realtime.';
  EXCEPTION WHEN duplicate_object THEN
    RAISE NOTICE 'classrooms sudah terdaftar — dilewati.';
  END;
END $$;

-- ── 2. Lepas tabel basi dari publikasi (kalau masih terdaftar) ───────────
-- `students` sudah berupa VIEW dan `user_accounts` sudah tidak dipakai,
-- jadi keduanya hanya membuang-buang kapasitas Realtime.
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.students;
    RAISE NOTICE 'students dilepas dari publikasi (sekarang berupa view).';
  EXCEPTION WHEN undefined_object THEN
    NULL;  -- memang tidak terdaftar
  WHEN wrong_object_type THEN
    NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.user_accounts;
    RAISE NOTICE 'user_accounts dilepas dari publikasi (tidak dipakai lagi).';
  EXCEPTION WHEN undefined_object THEN
    NULL;
  END;
END $$;

-- ── 3. Verifikasi: tabel apa saja yang sekarang dipantau Realtime ────────
SELECT
  schemaname AS skema,
  tablename AS tabel,
  CASE tablename
    WHEN 'profiles'          THEN 'siswa baru & perubahan profil (dipakai Posko Guru)'
    WHEN 'level_submissions' THEN 'nilai baru masuk'
    WHEN 'classrooms'        THEN 'perubahan nama/hapus kelas'
    ELSE 'periksa — mungkin tidak lagi diperlukan'
  END AS keterangan
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
ORDER BY tablename;

-- ══════════════════════════════════════════════════════════════════════════
-- SETELAH MENJALANKAN INI
--   1. Muat ulang halaman Posko Guru (sekali saja).
--   2. Minta siswa lain mendaftar, atau daftarkan akun uji baru.
--   3. Siswa itu harus muncul SENDIRI di tabel tanpa refresh.
--
-- CATATAN: Realtime juga tunduk pada RLS. Guru hanya menerima event untuk
-- baris yang boleh ia baca — dan policy `profiles_select_owner` sudah
-- mengizinkan guru membaca siswa di kelas yang dia ampu. Jadi ini aman.
-- ══════════════════════════════════════════════════════════════════════════
