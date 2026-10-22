-- ══════════════════════════════════════════════════════════════════════════
-- RESQ-BOX — MIGRASI 15: PERBAIKI LEVEL YANG TIDAK PERNAH NAIK
--
-- ═══════════════════════════════════════════════════════════════════════════
-- GEJALA
-- ═══════════════════════════════════════════════════════════════════════════
--
--   Siswa menuntaskan Level 1 (nilainya 100 dan TERSIMPAN di
--   level_submissions), tetapi Level 2 tetap terkunci. Di perangkat lain,
--   permainan mulai dari awal.
--
--   Data nyata dari database (dari scripts/diagnosa_progres.py):
--
--       33 profil siswa, 217 baris level_submissions
--       21 siswa punya nilai Level 1 = 100, TETAPI unlocked_level masih 1
--       5 siswa lain punya nilai 63..88 (memang belum tuntas) -> wajar
--
-- ═══════════════════════════════════════════════════════════════════════════
-- PENYEBAB
-- ═══════════════════════════════════════════════════════════════════════════
--
--   `submit_level_result` melakukan dua hal: mencatat nilai, lalu menaikkan
--   `profiles.unlocked_level`. Langkah kedua itu DIKEMBALIKAN oleh trigger
--   `guard_profile_privileges`, yang berbunyi:
--
--       IF NEW.unlocked_level IS DISTINCT FROM OLD.unlocked_level THEN
--         NEW.unlocked_level := OLD.unlocked_level;      -- dibatalkan
--       END IF;
--
--   Penjaga itu dimaksudkan menahan UPDATE dari KLIEN. Masalahnya ia tidak
--   dapat membedakan UPDATE dari klien dengan UPDATE dari RPC, karena keduanya
--   berjalan dengan JWT siswa yang sama — `auth.uid()` tidak NULL, dan
--   `is_admin()` bernilai salah.
--
--   Akibatnya RPC-nya sendiri diblokir. Ironisnya komentar pada trigger itu
--   menulis "unlocked_level hanya berubah lewat RPC resmi
--   (submit_level_result)" — padahal justru RPC itulah yang ditahannya.
--
--   Inilah sebabnya nilai TERSIMPAN dengan benar sementara level tidak pernah
--   naik: tidak ada yang salah pada perhitungan nilai.
--
-- ═══════════════════════════════════════════════════════════════════════════
-- PERBAIKAN
-- ═══════════════════════════════════════════════════════════════════════════
--
--   1. Penjaga diberi celah terkendali: bila RPC resmi menandai transaksi ini
--      dengan `resqbox.bebas_kunci_profil = 'on'` (set_config lokal transaksi),
--      kenaikan SATU tingkat diizinkan.
--
--      Pengaman berlapis: kenaikan hanya diterima bila
--        - tanda itu ada,
--        - baris yang diubah adalah milik pemanggil sendiri (NEW.id = auth.uid()),
--        - nilainya NAIK TEPAT SATU (bukan melompat, bukan turun),
--        - hasilnya tetap dalam 1..3.
--      Jadi sekalipun tandanya bocor, penjaga tetap tidak dapat dipakai untuk
--      melompati tahap atau mengubah profil orang lain.
--
--   2. `submit_level_result` memasang tanda itu tepat sebelum UPDATE dan
--      mencabutnya sesudahnya.
--
--   3. Data lama DIPERBAIKI: siswa yang sudah punya nilai 100 dinaikkan
--      levelnya sesuai capaian yang memang sudah tercatat.
--
-- AMAN DIJALANKAN BERULANG.
-- ══════════════════════════════════════════════════════════════════════════


-- ══════════════════════════════════════════════════════════════════════════
-- BAGIAN 1 — PENJAGA PROFIL: celah terkendali untuk RPC resmi
-- ══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.guard_profile_privileges()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_bebas BOOLEAN := COALESCE(
    current_setting('resqbox.bebas_kunci_profil', true) = 'on', false);
BEGIN
  -- Server (service_role / definer dengan auth.uid() NULL) boleh apa saja.
  IF auth.uid() IS NULL OR public.is_admin() THEN
    RETURN NEW;
  END IF;

  -- ── unlocked_level ──────────────────────────────────────────────────────
  -- Hanya boleh naik lewat RPC resmi, satu tingkat, dan hanya untuk dirinya.
  IF NEW.unlocked_level IS DISTINCT FROM OLD.unlocked_level THEN
    IF v_bebas
       AND NEW.id = auth.uid()
       AND NEW.unlocked_level = OLD.unlocked_level + 1
       AND NEW.unlocked_level BETWEEN 1 AND 3
    THEN
      NULL;   -- diizinkan: kenaikan satu tingkat dari submit_level_result
    ELSE
      NEW.unlocked_level := OLD.unlocked_level;
    END IF;
  END IF;

  -- Tak seorang pun boleh mengubah identitas/kelas/peran dari sisi klien.
  IF NEW.role            IS DISTINCT FROM OLD.role            THEN NEW.role            := OLD.role;            END IF;
  IF NEW.is_admin        IS DISTINCT FROM OLD.is_admin        THEN NEW.is_admin        := OLD.is_admin;        END IF;
  IF NEW.classroom_code  IS DISTINCT FROM OLD.classroom_code  THEN NEW.classroom_code  := OLD.classroom_code;  END IF;
  IF NEW.username        IS DISTINCT FROM OLD.username        THEN NEW.username        := OLD.username;        END IF;

  -- Nomor absen boleh DIISI saat masih kosong, tetapi tidak boleh DIUBAH
  -- setelah terisi (migrasi 14).
  IF NEW.absent_number IS DISTINCT FROM OLD.absent_number
     AND COALESCE(btrim(OLD.absent_number), '') <> '' THEN
    NEW.absent_number := OLD.absent_number;
  END IF;

  RETURN NEW;
END $$;


-- ══════════════════════════════════════════════════════════════════════════
-- BAGIAN 2 — submit_level_result: pasang tanda sebelum menaikkan level
--
-- Isi fungsi sama dengan versi migrasi 14 (nilai dihitung server, siswa tanpa
-- kelas ditolak). Yang ditambahkan hanya pasangan set_config berikut.
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

  IF v_me.role = 'student' AND COALESCE(v_me.classroom_code, '') = '' THEN
    RAISE EXCEPTION
      'Akun ini belum terdaftar di kelas mana pun, jadi nilainya tidak dapat dicatat. '
      'Mintalah gurumu menambahkanmu ke kelas terlebih dahulu.'
      USING ERRCODE = '22023';
  END IF;

  v_missions := GREATEST(0, LEAST(COALESCE(p_missions, 0),
                    CASE p_level WHEN 1 THEN 8 WHEN 2 THEN 6 ELSE 20 END));

  v_score := GREATEST(0, LEAST(100, public.official_level_score(p_level, v_missions)));

  IF p_is_completed AND v_missions = 0 THEN
    v_score := 0;
  END IF;

  INSERT INTO public.level_submissions
    (student_id, student_name, classroom_code, level_number, score, details)
  VALUES
    (v_me.id, v_me.name, v_me.classroom_code,
     p_level, v_score,
     COALESCE(p_details, '{}'::jsonb) || jsonb_build_object('missions', v_missions))
  RETURNING id INTO v_sub_id;

  v_new_unlock := v_me.unlocked_level;
  IF v_score >= 100 AND p_level < 3 THEN
    v_new_unlock := GREATEST(v_new_unlock, p_level + 1);

    -- Tanda bagi guard_profile_privileges bahwa UPDATE ini datang dari RPC
    -- resmi. set_config(..., true) berlaku hanya di dalam transaksi ini.
    PERFORM set_config('resqbox.bebas_kunci_profil', 'on', true);

    UPDATE public.profiles
       SET unlocked_level = v_new_unlock
     WHERE id = auth.uid() AND unlocked_level < v_new_unlock;

    PERFORM set_config('resqbox.bebas_kunci_profil', 'off', true);
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
-- BAGIAN 3 — PERBAIKI DATA LAMA
--
-- Siswa yang sudah mencatat nilai 100 pada Level 1 atau 2 dinaikkan levelnya
-- sesuai capaian itu. Dijalankan dari SQL Editor, tempat auth.uid() bernilai
-- NULL, sehingga penjaga profil mengizinkan perubahan.
-- ══════════════════════════════════════════════════════════════════════════

WITH capaian AS (
  SELECT student_id,
         LEAST(3, MAX(level_number) + 1) AS level_baru
    FROM public.level_submissions
   WHERE score >= 100
     AND level_number BETWEEN 1 AND 2
   GROUP BY student_id
)
UPDATE public.profiles p
   SET unlocked_level = c.level_baru
  FROM capaian c
 WHERE p.id = c.student_id
   AND p.unlocked_level < c.level_baru;


-- ══════════════════════════════════════════════════════════════════════════
-- BAGIAN 4 — PEMERIKSAAN HASIL
-- ══════════════════════════════════════════════════════════════════════════

DO $$
DECLARE
  v_tertinggal INT;
BEGIN
  SELECT count(*) INTO v_tertinggal
    FROM public.profiles p
   WHERE p.role = 'student'
     AND p.unlocked_level < 3
     AND EXISTS (
       SELECT 1 FROM public.level_submissions s
        WHERE s.student_id = p.id
          AND s.score >= 100
          AND s.level_number = p.unlocked_level
     );

  IF v_tertinggal = 0 THEN
    RAISE NOTICE '[OK] Tidak ada siswa yang nilainya 100 tetapi levelnya tertinggal.';
  ELSE
    RAISE WARNING '[GAGAL] Masih ada % siswa dengan nilai 100 tetapi level tertinggal.', v_tertinggal;
  END IF;

  RAISE NOTICE 'Migrasi 15 selesai.';
END $$;
