/**
 * Penanda "sedang mengerjakan evaluasi".
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * MENGAPA ADA
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  Pemilik proyek meminta tombol chatbot HILANG saat siswa mengerjakan
 *  evaluasi (Wordle di Level 1 dan TTS di Level 2), supaya jawabannya tidak
 *  dicari lewat AI.
 *
 *  Penanda ini dipakai bersama:
 *    - modal evaluasi menyalakannya saat dibuka dan mematikannya saat ditutup,
 *    - `ChatbotSiswa` di App.tsx menyembunyikan tombol selama menyala.
 *
 *  Disimpan sebagai store, bukan state lokal, karena tombol chatbot berada di
 *  App.tsx sedangkan modalnya berada jauh di dalam pohon komponen Level 1/2.
 *
 *  Penghitung (bukan boolean) dipakai agar dua modal yang terbuka berurutan
 *  tidak saling mematikan: modal kedua menambah, penutupan pertama mengurangi.
 */
import { create } from 'zustand';

interface EvaluasiStore {
  /** Jumlah modal evaluasi yang sedang terbuka. */
  aktif: number;
  mulai: () => void;
  selesai: () => void;
  /** Apakah chatbot harus disembunyikan sekarang. */
  sedangEvaluasi: () => boolean;
}

export const useEvaluasiStore = create<EvaluasiStore>((set, get) => ({
  aktif: 0,
  mulai: () => set((s) => ({ aktif: s.aktif + 1 })),
  selesai: () => set((s) => ({ aktif: Math.max(0, s.aktif - 1) })),
  sedangEvaluasi: () => get().aktif > 0,
}));

/**
 * Pembantu untuk komponen: panggil di dalam useEffect saat modal dibuka.
 *
 *   useEffect(() => tandaiEvaluasi(), []);
 *
 * Mengembalikan fungsi pembersih yang otomatis dipanggil React saat bongkar.
 */
export function tandaiEvaluasi(): () => void {
  useEvaluasiStore.getState().mulai();
  return () => useEvaluasiStore.getState().selesai();
}
