/**
 * Hook peminta umpan balik AI untuk evaluasi.
 *
 * Dipakai bersama oleh Wordle (Level 1), TTS (Level 2), dan validasi blok
 * (Level 3) supaya ketiganya berperilaku sama: minta sekali saat evaluasi
 * selesai, tampilkan keadaan memuat, dan sediakan tombol coba lagi bila gagal.
 *
 * PRINSIP: `data` TIDAK BOLEH memuat jawaban benar ketika siswa salah.
 * Endpoint server juga tidak menambahkannya, sehingga jawaban benar tidak
 * pernah sampai ke model. Lihat catatan di functions/api/chat.ts.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { mintaUmpanBalik } from './klienAI';

export interface KeadaanUmpanBalik {
  memuat: boolean;
  teks: string | null;
  galat: string | null;
  /** Minta ulang (mis. setelah jaringan pulih). */
  ulangi: () => void;
}

export function useUmpanBalik(
  jenis: 'wordle' | 'tts' | 'blok',
  benar: boolean,
  data: Record<string, unknown> | null,
  aktif: boolean,
): KeadaanUmpanBalik {
  const [memuat, setMemuat] = useState(false);
  const [teks, setTeks] = useState<string | null>(null);
  const [galat, setGalat] = useState<string | null>(null);
  const [percobaan, setPercobaan] = useState(0);
  const sudahDiminta = useRef<string>('');

  // Kunci permintaan: satu kombinasi data hanya diminta SEKALI, supaya
  // kuota harian tidak habis karena render ulang komponen.
  const kunci = data ? JSON.stringify(data) + `|${benar}|${percobaan}` : '';

  useEffect(() => {
    if (!aktif || !data) return;
    if (sudahDiminta.current === kunci) return;
    sudahDiminta.current = kunci;

    let batal = false;
    setMemuat(true);
    setGalat(null);

    void mintaUmpanBalik(jenis, benar, data).then((hasil) => {
      if (batal) return;
      setMemuat(false);
      if (hasil.ok && hasil.balasan) setTeks(hasil.balasan);
      else setGalat(hasil.galat ?? 'Umpan balik tidak tersedia.');
    });

    return () => {
      batal = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aktif, kunci]);

  const ulangi = useCallback(() => {
    sudahDiminta.current = '';
    setTeks(null);
    setGalat(null);
    setPercobaan((n) => n + 1);
  }, []);

  return { memuat, teks, galat, ulangi };
}
