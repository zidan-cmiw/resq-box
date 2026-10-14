// ── src/components/KuisBankSoal.tsx ──────────────────────────────────────────
// KUIS DARI BANK SOAL — mengerjakan beberapa soal yang diundi, satu per satu.
//
// ═══════════════════════════════════════════════════════════════════════════
// MENGAPA KOMPONEN INI DIPISAH
// ═══════════════════════════════════════════════════════════════════════════
//
//   Modal tantangan yang lama hanya dapat menampilkan SATU soal tetap
//   (`challenge.question`). Bank soal memerlukan lebih dari itu:
//
//     - beberapa soal dikerjakan berurutan, dengan penanda kemajuan,
//     - penjelasan muncul untuk SETIAP soal, bukan hanya soal terakhir,
//     - dan soal yang salah harus diulang sebelum boleh lanjut — supaya
//       gerbangnya benar-benar menguji pemahaman, bukan keberuntungan.
//
//   Komponen ini dibuat umum (hanya menerima daftar `Soal`) supaya Level 1 dan
//   Level 2 dapat memakainya tanpa saling menyalin.
//
// ═══════════════════════════════════════════════════════════════════════════
// CATATAN TENTANG NILAI
// ═══════════════════════════════════════════════════════════════════════════
//
//   Tidak ada ambang nilai angka di sini. Pemilik proyek sudah memutuskan untuk
//   TIDAK memakai passing grade 85. Gerbang terbuka bila seluruh soal pada
//   undian dijawab benar; soal yang salah dapat dicoba lagi.

import { useState } from 'react';
import type { Soal } from '../missions/data/bankSoal';
import { kunciJawaban } from '../missions/data/bankSoal';
import { retroAudio } from '../utils/retroAudio';
import PixelIcon from './PixelIcon';

const LABEL_TINGKAT: Record<string, { teks: string; kelas: string }> = {
  mudah: { teks: 'MUDAH', kelas: 'bg-emerald-100 text-emerald-900 border-emerald-600' },
  sedang: { teks: 'SEDANG', kelas: 'bg-amber-100 text-amber-900 border-amber-600' },
  sulit: { teks: 'SULIT', kelas: 'bg-rose-100 text-rose-900 border-rose-600' },
};

interface Props {
  /** Soal yang harus dikerjakan, sudah diundi dan berurutan dari mudah ke sulit. */
  soal: Soal[];
  /** Judul gerbang, mis. nama area. */
  judul: string;
  /** Dipanggil setelah SELURUH soal dijawab benar. */
  onSukses: () => void;
  /** Dipanggil saat siswa menutup kuis tanpa menuntaskannya. */
  onTutup: () => void;
}

export default function KuisBankSoal({ soal, judul, onSukses, onTutup }: Props) {
  const [indeks, setIndeks] = useState(0);
  const [pilihan, setPilihan] = useState<string | null>(null);
  const [diperiksa, setDiperiksa] = useState(false);
  const [benar, setBenar] = useState(false);

  const aktif = soal[indeks];
  const terakhir = indeks === soal.length - 1;

  // Bank kosong — jangan tampilkan apa pun; pemanggil sudah seharusnya memakai
  // modal lama sebagai cadangan.
  if (!aktif) return null;

  const kunci = kunciJawaban(aktif);
  const label = LABEL_TINGKAT[aktif.tingkat];

  const pilih = (id: string) => {
    if (diperiksa) return;
    retroAudio.playSelect();
    setPilihan(id);
  };

  const periksa = () => {
    if (!pilihan || diperiksa) return;
    const tepat = pilihan === kunci;
    setDiperiksa(true);
    setBenar(tepat);
    if (tepat) retroAudio.playWin();
    else retroAudio.playHover();
  };

  /** Ulangi soal yang sama setelah jawaban salah. */
  const ulangi = () => {
    setDiperiksa(false);
    setBenar(false);
    setPilihan(null);
  };

  const lanjut = () => {
    retroAudio.playSelect();
    if (terakhir) {
      onSukses();
      return;
    }
    setIndeks(indeks + 1);
    setDiperiksa(false);
    setBenar(false);
    setPilihan(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm select-none animate-fadeIn font-pixel">
      <div className="relative w-full max-w-3xl sm:max-w-4xl bg-[#fef3c7] border-4 border-[#451a03] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-[0_16px_0_#1c0d02] text-[#451a03] max-h-[96vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-3 border-[#78350f] pb-3.5 mb-4 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#b45309]/20 border-2 border-[#b45309] flex items-center justify-center shrink-0">
              <PixelIcon name="bulb" size={22} className="text-[#92400e]" />
            </div>
            <div className="min-w-0">
              <span className="text-[13px] sm:text-[15px] text-[#b45309] uppercase tracking-widest block font-bold">
                EVALUASI PEMAHAMAN
              </span>
              <h2 className="text-[15px] sm:text-base md:text-xl text-[#451a03] font-pixel-title font-bold truncate">
                {judul}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Penanda kemajuan: siswa tahu masih ada berapa soal lagi. */}
            <span className="font-pixel-title text-[13px] sm:text-[15px] font-bold px-3 py-1.5 rounded-xl bg-[#b45309]/15 border-2 border-[#b45309]/50 whitespace-nowrap">
              Soal {indeks + 1}/{soal.length}
            </span>
            <button
              aria-label="Tutup"
              onClick={() => {
                retroAudio.playSelect();
                onTutup();
              }}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#b45309] hover:bg-[#92400e] text-amber-100 border-2 border-[#451a03] flex items-center justify-center cursor-pointer active:translate-y-0.5 shadow-[0_2px_0_#451a03] shrink-0"
            >
              <PixelIcon name="cross" size={14} />
            </button>
          </div>
        </div>

        {/* Tingkat kesulitan soal ini */}
        {label && (
          <div className="mb-3">
            <span
              className={`inline-block font-pixel-title text-[12.5px] font-bold px-2.5 py-1 rounded-lg border-2 ${label.kelas}`}
            >
              TINGKAT: {label.teks}
            </span>
          </div>
        )}

        {/* Pertanyaan */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-100/90 border-3 border-[#b45309]/40 mb-4 shadow-xs">
          <p className="font-sans text-base sm:text-lg md:text-xl font-semibold leading-relaxed text-[#291305]">
            {aktif.pertanyaan}
          </p>
        </div>

        {/* Pilihan */}
        <div className="space-y-3 mb-4">
          {aktif.opsi.map((opt) => {
            const dipilih = pilihan === opt.id;
            const iniKunci = opt.id === kunci;
            let gaya = 'bg-[#fffbeb] hover:bg-[#fde68a] border-[#b45309]/40 text-[#451a03]';

            if (diperiksa) {
              if (iniKunci) {
                gaya = 'bg-emerald-100 border-emerald-600 text-emerald-950 font-bold shadow';
              } else if (dipilih) {
                gaya = 'bg-rose-100 border-rose-600 text-rose-950';
              } else {
                gaya = 'opacity-40 bg-slate-100 border-slate-300 text-slate-500';
              }
            } else if (dipilih) {
              gaya = 'bg-amber-600 text-white border-amber-950 shadow-[0_3px_0_#451a03] -translate-y-0.5';
            }

            return (
              <button
                key={opt.id}
                onClick={() => pilih(opt.id)}
                disabled={diperiksa}
                className={`w-full p-3.5 sm:p-4 rounded-xl border-2 sm:border-3 text-left transition-all cursor-pointer flex items-start gap-3 ${gaya}`}
              >
                <span className="font-pixel-title text-[13px] sm:text-[15px] shrink-0 uppercase mt-0.5 font-bold">
                  [{opt.id}]
                </span>
                <span className="font-sans text-[15px] sm:text-base md:text-lg font-medium leading-relaxed">
                  {opt.teks}
                </span>
              </button>
            );
          })}
        </div>

        {/* Umpan balik + penjelasan */}
        {diperiksa && (
          <div
            className={`p-4 sm:p-5 rounded-2xl border-3 mb-4 font-sans leading-relaxed animate-fadeIn ${
              benar
                ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                : 'bg-rose-50 border-rose-500 text-rose-950'
            }`}
          >
            <span className="font-pixel-title text-[13px] sm:text-[15px] font-bold flex items-center gap-2 mb-2">
              <PixelIcon name={benar ? 'unlock' : 'alert'} size={16} />
              <span>{benar ? 'JAWABAN TEPAT' : 'JAWABAN BELUM TEPAT'}</span>
            </span>
            <p className="font-sans text-[15px] sm:text-base font-medium leading-relaxed">
              {aktif.penjelasan}
            </p>
            {!benar && aktif.petunjuk && (
              <p className="mt-2 font-sans text-[14.5px] sm:text-[15px] font-bold">
                Petunjuk: {aktif.petunjuk}
              </p>
            )}
          </div>
        )}

        {/* Tombol */}
        <div className="flex items-center justify-end pt-3 border-t-2 border-[#b45309]/30">
          {!diperiksa ? (
            <button
              onClick={periksa}
              disabled={!pilihan}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[13px] sm:text-[15px] md:text-base font-pixel-title font-bold border-3 border-[#451a03] shadow-[0_4px_0_#231206] cursor-pointer active:translate-y-0.5"
            >
              PERIKSA JAWABAN
            </button>
          ) : benar ? (
            <button
              onClick={lanjut}
              className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[13px] sm:text-[15px] md:text-base font-pixel-title font-bold border-3 border-emerald-950 shadow-[0_4px_0_#064e3b] cursor-pointer active:translate-y-0.5"
            >
              {terakhir ? 'SELESAIKAN EVALUASI ➔' : 'SOAL BERIKUTNYA ➔'}
            </button>
          ) : (
            <button
              onClick={ulangi}
              className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-[13px] sm:text-[15px] md:text-base font-pixel-title font-bold border-2 border-amber-950 shadow-[0_3px_0_#451a03] cursor-pointer active:translate-y-0.5"
            >
              COBA LAGI ↺
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
