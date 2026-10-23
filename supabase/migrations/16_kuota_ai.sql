-- ══════════════════════════════════════════════════════════════════════════
-- RESQ-BOX — MIGRASI 16: KUOTA PEMAKAIAN AI (chatbot & umpan balik)
--
-- MENGAPA MIGRASI INI ADA
--   Chatbot dan umpan balik evaluasi memanggil API berbayar (DeepSeek).
--   Tanpa batas, satu siswa yang menekan tombol berulang-ulang dapat
--   menghabiskan token seluruh angkatan dalam hitungan menit.
--
--   Batas disimpan di DATABASE, bukan di peramban, karena:
--     - localStorage dapat dihapus siswa kapan saja (Ctrl+Shift+Del),
--     - perangkat berbeda harus berbagi kuota yang sama.
--
-- BATAS HARIAN (keputusan pemilik proyek)
--     chat          : 20 pesan per siswa per hari
--     umpan_balik   : 40 kali per siswa per hari
--
--   Penghitung direset dengan sendirinya karena kuncinya memuat TANGGAL
--   (zona waktu Asia/Jakarta, agar "hari" mengikuti waktu sekolah).
--
-- AMAN DIJALANKAN BERULANG.
-- ══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.ai_usage (
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tanggal    DATE NOT NULL DEFAULT ((now() AT TIME ZONE 'Asia/Jakarta')::date),
  jenis      TEXT NOT NULL CHECK (jenis IN ('chat', 'umpan_balik')),
  jumlah     INT  NOT NULL DEFAULT 0,
  terakhir   TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (student_id, tanggal, jenis)
);

-- Tidak ada policy apa pun: tabel ini hanya disentuh lewat RPC di bawah,
-- yang berjalan SECURITY DEFINER. Klien tidak dapat membacanya langsung.
ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage FORCE ROW LEVEL SECURITY;

REVOKE ALL ON public.ai_usage FROM anon;
REVOKE ALL ON public.ai_usage FROM authenticated;


-- ══════════════════════════════════════════════════════════════════════════
-- minta_izin_ai(p_jenis)
--
-- Mengembalikan JSONB:
--   { "izin": true,  "terpakai": 3, "batas": 20, "sisa": 17 }
--   { "izin": false, "terpakai": 20, "batas": 20, "sisa": 0,
--     "pesan": "Kuota ... sudah habis untuk hari ini." }
--
-- Menambah penghitung HANYA bila izin diberikan. Jadi permintaan yang ditolak
-- tidak ikut menghabiskan kuota.
-- ══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.minta_izin_ai(p_jenis TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_me      public.profiles%ROWTYPE;
  v_batas   INT;
  v_tanggal DATE := (now() AT TIME ZONE 'Asia/Jakarta')::date;
  v_pakai   INT := 0;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Harus login.' USING ERRCODE = '28000';
  END IF;

  IF p_jenis NOT IN ('chat', 'umpan_balik') THEN
    RAISE EXCEPTION 'Jenis pemakaian tidak dikenal: %', p_jenis
      USING ERRCODE = '22023';
  END IF;

  SELECT * INTO v_me FROM public.profiles WHERE id = auth.uid();
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profil tidak ditemukan.' USING ERRCODE = 'P0002';
  END IF;

  -- Guru dan admin tidak dibatasi: mereka memakai untuk demonstrasi di kelas.
  IF v_me.role IN ('teacher', 'admin') OR v_me.is_admin THEN
    RETURN jsonb_build_object(
      'izin', true, 'terpakai', 0, 'batas', -1, 'sisa', -1);
  END IF;

  v_batas := CASE p_jenis WHEN 'chat' THEN 20 ELSE 40 END;

  SELECT jumlah INTO v_pakai
    FROM public.ai_usage
   WHERE student_id = v_me.id AND tanggal = v_tanggal AND jenis = p_jenis;

  IF COALESCE(v_pakai, 0) >= v_batas THEN
    RETURN jsonb_build_object(
      'izin', false,
      'terpakai', COALESCE(v_pakai, 0),
      'batas', v_batas,
      'sisa', 0,
      'pesan',
        CASE p_jenis
          WHEN 'chat' THEN 'Kuota tanya-jawab dengan Resqy sudah habis untuk hari ini. Coba lagi besok, atau baca materi di tiap pos.'
          ELSE 'Kuota umpan balik AI sudah habis untuk hari ini. Kerjakan evaluasinya dengan membaca materi, ya.'
        END);
  END IF;

  INSERT INTO public.ai_usage AS u (student_id, tanggal, jenis, jumlah, terakhir)
  VALUES (v_me.id, v_tanggal, p_jenis, 1, now())
  ON CONFLICT (student_id, tanggal, jenis)
  DO UPDATE SET jumlah = u.jumlah + 1, terakhir = now();

  RETURN jsonb_build_object(
    'izin', true,
    'terpakai', COALESCE(v_pakai, 0) + 1,
    'batas', v_batas,
    'sisa', v_batas - (COALESCE(v_pakai, 0) + 1));
END $$;

REVOKE ALL ON FUNCTION public.minta_izin_ai(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.minta_izin_ai(TEXT) TO authenticated;


-- ══════════════════════════════════════════════════════════════════════════
-- PEMERIKSAAN HASIL
-- ══════════════════════════════════════════════════════════════════════════

DO $$
DECLARE
  v_ada BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables
     WHERE table_schema = 'public' AND table_name = 'ai_usage'
  ) INTO v_ada;

  IF v_ada THEN
    RAISE NOTICE '[OK] Tabel ai_usage tersedia.';
  ELSE
    RAISE WARNING '[GAGAL] Tabel ai_usage tidak terbentuk.';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.routines
     WHERE routine_schema = 'public' AND routine_name = 'minta_izin_ai'
  ) THEN
    RAISE NOTICE '[OK] Fungsi minta_izin_ai tersedia.';
  ELSE
    RAISE WARNING '[GAGAL] Fungsi minta_izin_ai tidak terbentuk.';
  END IF;

  RAISE NOTICE 'Migrasi 16 selesai.';
END $$;
