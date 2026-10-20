-- ══════════════════════════════════════════════════════════════════════════
-- RESQ-BOX — MIGRASI 14: TUTUP SISA TEMUAN AUDIT
--
-- Melanjutkan migrasi 13. Isinya lima perbaikan:
--
--   1. Nilai tidak lagi memakai `p_client_score` kiriman klien.
--   2. Nilai tidak lagi ditebak masuk ke kelas 'RESQ-8A' bila siswa belum
--      punya kelas.
--   3. `absent_number` dikunci dari perubahan oleh siswa sendiri.
--   4. `name` dan `avatar_config` dibatasi panjang/ukurannya.
--   5. Tabel `user_accounts` (penyimpan hash sandi lama) dikosongkan dan
--      ditutup rapat.
--
-- AMAN DIJALANKAN BERULANG (idempoten).
-- ══════════════════════════════════════════════════════════════════════════


-- ══════════════════════════════════════════════════════════════════════════
-- BAGIAN 1 & 2 — submit_level_result
--
-- PERUBAHAN
--   a. `p_client_score` TETAP ada di tanda tangan fungsi supaya aplikasi lama
--      tidak gagal, tetapi NILAINYA DIAIBAIKAN. Nilai akhir hanya dihitung
--      dari `official_level_score(p_level, v_missions)`.
--
--   b. Siswa yang belum punya kelas DITOLAK, tidak lagi ditempelkan ke
--      'RESQ-8A' — kode kelas nyata milik guru lain. Dulu nilai siswa tanpa
--      kelas bisa mencemari rapor kelas tersebut.
--
-- BATAS YANG JUJUR DIPAPARKAN
--   `p_missions` MASIH berasal dari klien, karena aplikasi ini permainan
--   tunggal yang tidak punya bukti capaian di sisi server. Jadi seorang siswa
--   yang sengaja mengakali masih dapat mengirim jumlah misi maksimum.
--   Yang dapat dilakukan server tanpa merancang ulang seluruh alur:
--     - tidak lagi menerima ANGKA nilai dari klien (celah terbesar ditutup);
--     - nilai tetap dibatasi oleh `official_level_score` sehingga tidak bisa
--       melebihi 100 atau melompati tahapan;
--     - `unlocked_level` hanya naik bila nilai resmi mencapai 100.
--   Untuk menutup sisanya, capaian per misi harus dicatat server. Itu
--   perubahan arsitektur, bukan migrasi.
-- ══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.submit_level_result(
  p_level          INT,
  p_missions       INT,
  p_details        JSONB DEFAULT '{}'::jsonb,
  p_is_completed   BOOLEAN DEFAULT false,
  p_client_score   INT DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_me          public.profiles%ROWTYPE;
  v_missions    INT;
  v_score       INT;
  v_new_unlock  INT;
  v_sub_id      UUID;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Harus login.' USING ERRCODE = '28000';
  END IF;

  IF p_level NOT BETWEEN 1 AND 3 THEN
    RAISE EXCEPTION 'Level tidak valid.' USING ERRCODE = '22023';
  END IF;

  IF NOT public.check_rate_limit('submit_result', auth.uid()::text, 30, 60) THEN
    RAISE EXCEPTION 'Terlalu banyak pengiriman nilai. Tunggu sebentar.'
      USING ERRCODE = '53400';
  END IF;

  SELECT * INTO v_me FROM public.profiles WHERE id = auth.uid();
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profil tidak ditemukan.' USING ERRCODE = 'P0002';
  END IF;

  -- Siswa WAJIB sudah terdaftar di sebuah kelas. Tanpa ini, nilai tidak dapat
  -- diatribusikan dengan benar dan tidak boleh ditebak.
  IF v_me.role = 'student' AND COALESCE(v_me.classroom_code, '') = '' THEN
    RAISE EXCEPTION
      'Akun ini belum terdaftar di kelas mana pun, jadi nilainya tidak dapat dicatat. '
      'Mintalah gurumu menambahkanmu ke kelas terlebih dahulu.'
      USING ERRCODE = '22023';
  END IF;

  -- Batas atas jumlah capaian, supaya tidak bisa dilebih-lebihkan.
  v_missions := GREATEST(0, LEAST(COALESCE(p_missions, 0),
                    CASE p_level WHEN 1 THEN 8 WHEN 2 THEN 6 ELSE 20 END));

  -- NILAI DITENTUKAN SERVER. `p_client_score` sengaja tidak dipakai lagi.
  v_score := GREATEST(0, LEAST(100, public.official_level_score(p_level, v_missions)));

  -- Klaim "selesai" tanpa capaian apa pun tidak dihitung.
  IF p_is_completed AND v_missions = 0 THEN
    v_score := 0;
  END IF;

  -- Nama & kelas diambil dari profil, bukan dari klien (anti-spoofing).
  INSERT INTO public.level_submissions
    (student_id, student_name, classroom_code, level_number, score, details)
  VALUES
    (v_me.id, v_me.name, v_me.classroom_code,
     p_level, v_score,
     COALESCE(p_details, '{}'::jsonb) || jsonb_build_object('missions', v_missions))
  RETURNING id INTO v_sub_id;

  -- Naik level HANYA bila nilai resmi 100.
  v_new_unlock := v_me.unlocked_level;
  IF v_score >= 100 AND p_level < 3 THEN
    v_new_unlock := GREATEST(v_new_unlock, p_level + 1);
    UPDATE public.profiles
       SET unlocked_level = v_new_unlock
     WHERE id = auth.uid() AND unlocked_level < v_new_unlock;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'submission_id', v_sub_id,
    'score', v_score,
    'missions', v_missions,
    'unlocked_level', v_new_unlock
  );
END $$;

REVOKE ALL ON FUNCTION public.submit_level_result(INT, INT, JSONB, BOOLEAN, INT)
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.submit_level_result(INT, INT, JSONB, BOOLEAN, INT)
  TO authenticated;


-- ══════════════════════════════════════════════════════════════════════════
-- BAGIAN 3 — `absent_number` tidak boleh diubah siswa sendiri
--
-- Nomor absen adalah separuh identitas siswa di roster guru. Bila siswa dapat
-- mengubahnya sendiri, roster berubah tanpa sepengetahuan guru, dan nomor
-- yang sudah "dipakai" dapat membuat pembuatan akun berikutnya gagal karena
-- indeks unik (kelas, nomor absen).
--
-- Guru dan admin tetap dapat mengubahnya: fungsi server berjalan dengan
-- auth.uid() NULL (service_role) atau is_admin() true.
-- ══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.guard_profile_privileges()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Server (service_role / definer dengan auth.uid() NULL) boleh apa saja
  IF auth.uid() IS NULL OR public.is_admin() THEN
    RETURN NEW;
  END IF;

  -- Siswa & guru tidak boleh menaikkan level sendiri di sini;
  -- unlocked_level hanya berubah lewat RPC resmi (submit_level_result).
  IF NEW.unlocked_level IS DISTINCT FROM OLD.unlocked_level THEN
    NEW.unlocked_level := OLD.unlocked_level;
  END IF;

  -- Tak seorang pun boleh mengubah identitas/kelas/peran dari sisi klien,
  -- kecuali admin (sudah ditangani di atas).
  IF NEW.role            IS DISTINCT FROM OLD.role            THEN NEW.role            := OLD.role;            END IF;
  IF NEW.is_admin        IS DISTINCT FROM OLD.is_admin        THEN NEW.is_admin        := OLD.is_admin;        END IF;
  IF NEW.classroom_code  IS DISTINCT FROM OLD.classroom_code  THEN NEW.classroom_code  := OLD.classroom_code;  END IF;
  IF NEW.username        IS DISTINCT FROM OLD.username        THEN NEW.username        := OLD.username;        END IF;
  -- Nomor absen boleh DIISI saat masih kosong (pengisian pertama), tetapi
  -- TIDAK boleh DIUBAH setelah terisi. Tanpa pengecualian ini, alur profil
  -- siswa yang mengisi nomor absen pertama kali akan ikut tertolak.
  IF NEW.absent_number IS DISTINCT FROM OLD.absent_number
     AND COALESCE(btrim(OLD.absent_number), '') <> '' THEN
    NEW.absent_number := OLD.absent_number;
  END IF;

  RETURN NEW;
END $$;


-- ══════════════════════════════════════════════════════════════════════════
-- BAGIAN 4 — update_my_profile: batasi nama & avatar, buang absent_number
--
-- Sebelumnya fungsi ini menerima `absent_number`, `name` tanpa batas panjang,
-- dan `avatar_config` tanpa batas ukuran. Nama yang sangat panjang dan JSONB
-- besar akan tersimpan lalu dirender di dashboard guru.
-- ══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.update_my_profile(
  p_data JSONB
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v public.profiles%ROWTYPE;
  v_nama TEXT;
  v_avatar JSONB;
  v_absen TEXT;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Harus login.' USING ERRCODE = '28000';
  END IF;

  IF NOT public.check_rate_limit('update_profile', auth.uid()::text, 60, 60) THEN
    RAISE EXCEPTION 'Terlalu banyak perubahan profil. Coba lagi nanti.'
      USING ERRCODE = '53400';
  END IF;

  v_nama := NULLIF(trim(COALESCE(p_data->>'name', '')), '');
  IF v_nama IS NOT NULL AND length(v_nama) > 80 THEN
    RAISE EXCEPTION 'Nama terlalu panjang (maksimal 80 karakter).'
      USING ERRCODE = '22023';
  END IF;

  v_avatar := p_data->'avatar_config';
  IF v_avatar IS NOT NULL THEN
    IF jsonb_typeof(v_avatar) <> 'object' THEN
      RAISE EXCEPTION 'avatar_config harus berupa objek JSON.' USING ERRCODE = '22023';
    END IF;
    IF length(v_avatar::text) > 8192 THEN
      RAISE EXCEPTION 'avatar_config terlalu besar (maksimal 8 KB).'
        USING ERRCODE = '22023';
    END IF;
  END IF;

  -- Nomor absen diterima hanya untuk PENGISIAN PERTAMA; trigger penjaga
  -- (Bagian 3) yang menolak perubahan setelah terisi.
  v_absen := NULLIF(regexp_replace(COALESCE(p_data->>'absent_number', ''), '[^0-9]', '', 'g'), '');
  IF v_absen IS NOT NULL AND length(v_absen) > 3 THEN
    RAISE EXCEPTION 'Nomor absen maksimal 3 digit.' USING ERRCODE = '22023';
  END IF;

  UPDATE public.profiles SET
    name          = COALESCE(v_nama, name),
    school_name   = COALESCE(NULLIF(trim(COALESCE(p_data->>'school_name', '')), ''), school_name),
    absent_number = COALESCE(v_absen, absent_number),
    avatar_config = COALESCE(v_avatar, avatar_config)
  WHERE id = auth.uid()
  RETURNING * INTO v;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profil tidak ditemukan.' USING ERRCODE = 'P0002';
  END IF;

  RETURN jsonb_build_object('success', true, 'profile', to_jsonb(v) - 'password');
END $$;

REVOKE ALL ON FUNCTION public.update_my_profile(JSONB) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.update_my_profile(JSONB) TO authenticated;


-- ══════════════════════════════════════════════════════════════════════════
-- BAGIAN 5 — user_accounts: kosongkan lalu tutup rapat
--
-- Tabel ini menyimpan hash kata sandi dari skema LAMA (sebelum Supabase Auth
-- dipakai). Hash itu tidak pernah dibersihkan oleh migrasi mana pun - dahulu
-- pembersihannya adalah langkah manual yang mudah terlupakan. Selama hash
-- masih tersimpan, siapa pun yang memegang service_role atau akses SQL Editor
-- dapat men-crack-nya secara offline, dan bila ada siswa yang memakai kata
-- sandi yang sama di tempat lain, itu ikut terbongkar.
--
-- Tindakan: kosongkan isinya, lalu cabut seluruh akses klien. Struktur tabel
-- dibiarkan agar view `public.students` (security_invoker) tidak rusak.
-- ══════════════════════════════════════════════════════════════════════════

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
     WHERE table_schema = 'public' AND table_name = 'user_accounts'
  ) THEN
    DELETE FROM public.user_accounts;
    REVOKE ALL ON public.user_accounts FROM anon;
    REVOKE ALL ON public.user_accounts FROM authenticated;
    RAISE NOTICE '[OK] user_accounts dikosongkan dan ditutup untuk klien.';
  ELSE
    RAISE NOTICE '[i] Tabel user_accounts tidak ada — tidak ada yang perlu dibersihkan.';
  END IF;
END $$;


-- ══════════════════════════════════════════════════════════════════════════
-- BAGIAN 6 — PEMERIKSAAN HASIL
-- ══════════════════════════════════════════════════════════════════════════

DO $$
DECLARE
  v_insert   BOOLEAN;
  v_abs_enforced BOOLEAN;
  v_sisa     BIGINT := 0;
BEGIN
  SELECT has_table_privilege('authenticated', 'public.level_submissions', 'INSERT')
    INTO v_insert;
  IF v_insert THEN
    RAISE WARNING '[GAGAL] authenticated MASIH punya hak INSERT pada level_submissions.';
  ELSE
    RAISE NOTICE '[OK] authenticated tidak punya hak INSERT pada level_submissions.';
  END IF;

  SELECT position('p_client_score' IN pg_get_functiondef('public.submit_level_result(INT, INT, JSONB, BOOLEAN, INT)'::regprocedure)) > 0
    INTO v_abs_enforced;
  IF v_abs_enforced THEN
    RAISE NOTICE '[OK] submit_level_result masih menerima p_client_score (diabaikan).';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.tables
     WHERE table_schema = 'public' AND table_name = 'user_accounts'
  ) THEN
    EXECUTE 'SELECT count(*) FROM public.user_accounts' INTO v_sisa;
    IF v_sisa = 0 THEN
      RAISE NOTICE '[OK] user_accounts kosong.';
    ELSE
      RAISE WARNING '[GAGAL] user_accounts masih berisi % baris.', v_sisa;
    END IF;
  END IF;

  RAISE NOTICE 'Migrasi 14 selesai.';
END $$;
