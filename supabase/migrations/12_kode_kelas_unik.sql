-- ═══════════════════════════════════════════════════════════════════════════
-- RESQ-BOX — MIGRASI 12: JAMIN KODE KELAS UNIK
-- ═══════════════════════════════════════════════════════════════════════════
--
-- MASALAH YANG DISELESAIKAN
--
--   Kode kelas TIDAK dijamin berbeda antar guru. Diukur:
--
--       Kode dibentuk sebagai: RESQ-<4 huruf nama kelas><3 angka acak>
--
--       'Kelas VIII-A'  ->  awalan 'KELA'
--       'Kelas VIII-B'  ->  awalan 'KELA'   <- SAMA!
--
--   Jadi setiap awalan hanya memiliki 900 kemungkinan angka
--   (100 sampai 999). Akibatnya, dengan problem ulang tahun:
--
--       kelas se-awalan     peluang bentrok
--              2                 0,11%
--             10                 4,89%
--             20                19,16%
--             30                38,66%
--             50                75,01%
--
--   Dan 'Kelas VIII-A' adalah NAMA BAWAAN kelas, sehingga guru yang tidak
--   mengganti namanya SEMUA memakai awalan 'KELA'. Jadi angka-angka di atas
--   sangat mungkin tercapai dalam satu sekolah, apalagi antar sekolah.
--
--   Ditambah lagi, klien hanya MENCOBA ULANG SATU KALI bila bentrok. Bila
--   bentrok dua kali berturut-turut, guru TIDAK DAPAT membuat kelas sama
--   sekali, dan pesan galatnya membingungkan karena berasal dari percobaan
--   pertama.
--
--
-- ═══════════════════════════════════════════════════════════════════════════
-- MENGAPA KODE INI MASIH DIPERLUKAN, WALAUPUN MURID TIDAK MENGETIKNYA
-- ═══════════════════════════════════════════════════════════════════════════
--
--   Diperiksa lebih dahulu: murid TIDAK PERNAH memasukkan kode kelas.
--   Halaman masuk tidak memiliki kolom kode kelas sama sekali. Akun murid
--   dibuatkan guru, dan kelasnya sudah melekat pada akun itu.
--
--   Meskipun begitu, kode kelas BUKAN sekadar hiasan:
--
--     1. `profiles.classroom_code` menautkan setiap murid ke kelasnya.
--        Tanpa kode, tidak ada cara mengetahui seorang murid milik kelas mana.
--
--     2. Pemeriksaan KEPEMILIKAN bergantung pada kode:
--
--            IF NOT EXISTS (SELECT 1 FROM classrooms c
--                           WHERE c.code = p_code
--                             AND c.teacher_username = v_me.username)
--
--        Bila kode dapat dipakai dua guru, pemeriksaan ini menjadi tidak
--        dapat diandalkan.
--
--     3. `level_submissions` dikelompokkan per kelas lewat kode itu.
--
--   Kode juga DITAMPILKAN kepada guru, dan ada tombol salinnya. Jadi ia tetap
--   dipakai — hanya saja bukan oleh murid.
--
--
-- ═══════════════════════════════════════════════════════════════════════════
-- PERBAIKAN: SERVER YANG MEMBUAT KODE, BUKAN KLIEN
-- ═══════════════════════════════════════════════════════════════════════════
--
--   KLIEN TIDAK LAGI mengirim kode buatan sendiri. Ia cukup mengirim nama
--   kelas, dan SERVER yang membuat kode yang dijamin belum terpakai.
--
--   Caranya: ulangi pembuatan kode sampai tidak ada bentrok, dengan batas
--   percobaan yang aman. Karena kode dibuat DI DALAM transaksi yang sama
--   dengan penyisipannya, tidak ada dua guru yang dapat memperoleh kode sama.
--
--   Ruang kode juga diperbesar: awalan nama + 6 angka acak, bukan 3.
--   6 angka memberikan 900.000 kemungkinan per awalan — 1000 kali lipat
--   lebih banyak, sehingga bentrok menjadi sangat jarang walaupun tetap
--   ditangani.
--
--   TETAP MENGHORMATI KODE YANG DIKIRIM. Bila pemanggil mengirim kode
--   (misalnya untuk mempertahankan perilaku lama atau untuk keperluan uji),
--   kode itu tetap dipakai apa adanya. Yang berubah hanyalah perilaku ketika
--   kode TIDAK dikirim.
--
-- ═══════════════════════════════════════════════════════════════════════════
-- CATATAN: KENAPA TIDAK MEMAKAI `ON CONFLICT ... DO UPDATE`
-- ═══════════════════════════════════════════════════════════════════════════
--
--   Versi sebelumnya memakai `ON CONFLICT (code) DO NOTHING`, lalu memeriksa
--   kepemilikan. Cara itu AMAN — ia tidak pernah menimpa kelas guru lain.
--   Tetapi galat yang dihasilkan sulit dipahami, dan pemulihannya dibebankan
--   ke klien yang hanya mencoba sekali.
--
--   Versi ini memindahkan pemulihan itu ke server, tempat ia dapat dilakukan
--   dengan andal di dalam transaksi.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.create_my_classroom(
  p_code TEXT DEFAULT NULL,
  p_name TEXT DEFAULT 'Kelas VIII-A',
  p_school TEXT DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_me       public.profiles%ROWTYPE;
  v_nama     TEXT;
  v_awalan   TEXT;
  v_kode     TEXT;
  v_percobaan INT := 0;
  v_maks     INT := 25;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Harus login.' USING ERRCODE = '28000';
  END IF;

  SELECT * INTO v_me FROM public.profiles WHERE id = auth.uid();
  IF NOT FOUND OR NOT (v_me.role IN ('teacher', 'admin') OR v_me.is_admin) THEN
    RAISE EXCEPTION 'Hanya guru yang boleh membuat kelas.' USING ERRCODE = '42501';
  END IF;

  IF NOT public.check_rate_limit('create_classroom', v_me.id::text, 20, 3600) THEN
    RAISE EXCEPTION 'Terlalu banyak pembuatan kelas.' USING ERRCODE = '53400';
  END IF;

  v_nama := COALESCE(NULLIF(trim(p_name), ''), 'Kelas VIII-A');

  -- ── Bila pemanggil MENGIRIM kode, pakai apa adanya (perilaku lama) ─────
  IF p_code IS NOT NULL AND trim(p_code) <> '' THEN
    v_kode := upper(trim(p_code));

    IF v_kode !~ '^[A-Z0-9-]{2,20}$' THEN
      RAISE EXCEPTION 'Format kode kelas tidak valid.' USING ERRCODE = '22023';
    END IF;

    INSERT INTO public.classrooms (code, name, teacher_username, school_name)
    VALUES (v_kode, v_nama, v_me.username,
            COALESCE(NULLIF(trim(COALESCE(p_school, '')), ''), v_me.school_name, 'SMP Negeri 1'))
    ON CONFLICT (code) DO NOTHING;

    IF NOT EXISTS (SELECT 1 FROM public.classrooms c
                   WHERE c.code = v_kode AND c.teacher_username = v_me.username) THEN
      RAISE EXCEPTION 'Kode kelas % sudah dipakai kelas lain.', v_kode
        USING ERRCODE = '23505';
    END IF;

    RETURN jsonb_build_object('success', true, 'code', v_kode, 'dibuat_server', false);
  END IF;

  -- ── Kode TIDAK dikirim: server membuat kode yang dijamin belum terpakai ─
  --
  --  Awalan diambil dari nama kelas supaya kodenya masih mudah dikenali guru
  --  (mis. 'Kelas VIII-A' -> 'RESQ-KELA123456').
  v_awalan := upper(regexp_replace(v_nama, '[^A-Za-z0-9]', '', 'g'));
  v_awalan := COALESCE(NULLIF(substr(v_awalan, 1, 4), ''), 'CLS');

  LOOP
    v_percobaan := v_percobaan + 1;

    -- 6 angka acak: 900.000 kemungkinan per awalan, bukan 900.
    v_kode := 'RESQ-' || v_awalan ||
              lpad((floor(random() * 900000) + 100000)::BIGINT::TEXT, 6, '0');

    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.classrooms c WHERE c.code = v_kode);

    IF v_percobaan >= v_maks THEN
      -- Praktis tidak akan pernah terjadi: 900.000 kemungkinan, 25 percobaan.
      -- Tetapi bila terjadi, lebih baik gagal dengan jelas daripada
      -- menggantung tanpa penjelasan.
      RAISE EXCEPTION 'Gagal membuat kode kelas unik setelah % percobaan.', v_maks
        USING ERRCODE = '53400';
    END IF;
  END LOOP;

  INSERT INTO public.classrooms (code, name, teacher_username, school_name)
  VALUES (v_kode, v_nama, v_me.username,
          COALESCE(NULLIF(trim(COALESCE(p_school, '')), ''), v_me.school_name, 'SMP Negeri 1'));

  RETURN jsonb_build_object('success', true, 'code', v_kode, 'dibuat_server', true);
END $$;

REVOKE ALL ON FUNCTION public.create_my_classroom(TEXT, TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_my_classroom(TEXT, TEXT, TEXT) TO authenticated;

-- ── Pemeriksaan: pastikan kode yang sudah ada memang unik ──────────────────
--
--  `code` adalah PRIMARY KEY, jadi keunikannya memang sudah dijamin oleh
--  basis data. Pemeriksaan ini memastikan tidak ada keadaan tak terduga.
DO $$
DECLARE
  v_ganda INT;
BEGIN
  SELECT count(*) INTO v_ganda FROM (
    SELECT code FROM public.classrooms GROUP BY code HAVING count(*) > 1
  ) x;

  IF v_ganda > 0 THEN
    RAISE EXCEPTION 'Ada % kode kelas yang ganda.', v_ganda;
  END IF;

  RAISE NOTICE 'Kode kelas unik. Kode baru dibuat server dengan 900.000 kemungkinan per awalan.';
END $$;
