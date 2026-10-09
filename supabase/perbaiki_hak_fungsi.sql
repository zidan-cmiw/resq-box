-- ══════════════════════════════════════════════════════════════════════════
-- PERBAIKAN: PULIHKAN HAK EKSEKUSI FUNGSI (memperbaiki "Profil tidak ditemukan")
-- ══════════════════════════════════════════════════════════════════════════
--
-- GEJALA YANG DIPERBAIKI
--   Login gagal dengan pesan "Profil tidak ditemukan", padahal:
--     - akun ada di Authentication -> Users
--     - profilnya ada di tabel public.profiles
--     - emailnya benar, sudah terkonfirmasi, dan perannya benar
--
-- PENYEBAB
--   Migrasi 04 mencabut hak eksekusi SELURUH fungsi sekaligus:
--
--       REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC, anon, authenticated;
--
--   Setelah itu haknya dikembalikan satu per satu dengan GRANT. Ketika daftar
--   GRANT itu dijalankan ulang dan ada SATU perintah yang gagal — misalnya
--   karena menyebut tanda tangan fungsi yang tidak ada — Supabase SQL Editor
--   MEMBATALKAN SELURUH BLOK, sehingga GRANT untuk fungsi lain ikut hilang.
--
--   Akibatnya fungsi get_my_profile tidak dapat dipanggil oleh pengguna yang
--   sudah login. Login sendiri BERHASIL, tetapi pengambilan profil gagal, dan
--   aplikasi menampilkan "Profil tidak ditemukan".
--
-- KENAPA SKRIP INI TIDAK DAPAT GAGAL
--   Versi sebelumnya menuliskan GRANT satu per satu. Cara itu rapuh: satu
--   tanda tangan yang salah menggagalkan semuanya, dan kesalahannya baru
--   ketahuan setelah dijalankan.
--
--   Skrip ini memakai loop yang MEMBACA daftar fungsi dari katalog database
--   (pg_proc), lalu memberikan haknya satu per satu di dalam blok yang
--   MENANGKAP galat. Jadi:
--     - tanda tangan fungsi tidak perlu ditulis ulang, sehingga tidak mungkin
--       salah ketik
--     - fungsi yang tidak ada cukup dilewati, bukan menggagalkan semuanya
--     - aman dijalankan berulang
--
-- Aman dijalankan. Jalankan di Supabase SQL Editor.
-- ══════════════════════════════════════════════════════════════════════════

DO $$
DECLARE
  v_rec    RECORD;
  v_jumlah INT := 0;
  v_gagal  INT := 0;
BEGIN
  -- ── 1. Cabut dulu semuanya, supaya keadaannya pasti dan seragam ────────
  -- Ini mengembalikan ke keadaan "tertutup", lalu bagian 2 membukanya
  -- seperlunya. Dengan begitu tidak ada sisa hak dari percobaan sebelumnya.
  EXECUTE 'REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC, anon, authenticated';
  RAISE NOTICE 'Hak seluruh fungsi dicabut. Membuka kembali yang diperlukan...';

  -- ── 2. Buka untuk pengguna yang SUDAH LOGIN ───────────────────────────
  -- Seluruh fungsi proyek hanya boleh dipanggil pengguna yang sudah login,
  -- KECUALI empat fungsi di bagian 3 yang memang dipakai halaman login.
  FOR v_rec IN
    SELECT p.proname,
           pg_get_function_identity_arguments(p.oid) AS args
      FROM pg_proc p
      JOIN pg_namespace n ON n.oid = p.pronamespace
     WHERE n.nspname = 'public'
       AND p.prokind = 'f'
       AND p.proname NOT IN (
             'username_available', 'class_code_info', 'legacy_account_exists',
             'custom_access_token_hook'
           )
     ORDER BY p.proname
  LOOP
    BEGIN
      EXECUTE format('GRANT EXECUTE ON FUNCTION public.%I(%s) TO authenticated',
                     v_rec.proname, v_rec.args);
      v_jumlah := v_jumlah + 1;
    EXCEPTION WHEN OTHERS THEN
      -- Satu fungsi gagal tidak boleh menggagalkan sisanya.
      v_gagal := v_gagal + 1;
      RAISE NOTICE 'Dilewati: %.% (%) -- %', 'public', v_rec.proname, v_rec.args, SQLERRM;
    END;
  END LOOP;

  -- ── 3. Buka untuk pengunjung BELUM login (hanya yang memang perlu) ─────
  -- Ketiganya dipakai di halaman login SEBELUM pengguna punya sesi:
  --   username_available     -> memeriksa nama pengguna tersedia
  --   class_code_info        -> memeriksa kode kelas
  --   legacy_account_exists  -> membantu akun lama
  FOR v_rec IN
    SELECT p.proname,
           pg_get_function_identity_arguments(p.oid) AS args
      FROM pg_proc p
      JOIN pg_namespace n ON n.oid = p.pronamespace
     WHERE n.nspname = 'public'
       AND p.prokind = 'f'
       AND p.proname IN ('username_available', 'class_code_info', 'legacy_account_exists')
     ORDER BY p.proname
  LOOP
    BEGIN
      EXECUTE format('GRANT EXECUTE ON FUNCTION public.%I(%s) TO anon, authenticated',
                     v_rec.proname, v_rec.args);
      v_jumlah := v_jumlah + 1;
    EXCEPTION WHEN OTHERS THEN
      v_gagal := v_gagal + 1;
      RAISE NOTICE 'Dilewati: %(%) -- %', v_rec.proname, v_rec.args, SQLERRM;
    END;
  END LOOP;

  RAISE NOTICE 'Selesai. % fungsi dibuka, % dilewati.', v_jumlah, v_gagal;
END $$;


-- ══════════════════════════════════════════════════════════════════════════
-- VERIFIKASI — jalankan setelah perintah di atas
-- ══════════════════════════════════════════════════════════════════════════
--
-- Pastikan get_my_profile sudah punya hak untuk 'authenticated':
--
--   SELECT p.proname,
--          pg_get_function_identity_arguments(p.oid) AS argumen,
--          coalesce(array_to_string(p.proacl, ' | '), '(hak bawaan)') AS hak
--     FROM pg_proc p
--     JOIN pg_namespace n ON n.oid = p.pronamespace
--    WHERE n.nspname = 'public' AND p.proname IN ('get_my_profile', 'update_my_teacher_profile')
--    ORDER BY p.proname;
--
-- Yang dicari: pada kolom `hak` harus ada `authenticated=X`.
--
-- Setelah itu, coba login lagi di aplikasi.
