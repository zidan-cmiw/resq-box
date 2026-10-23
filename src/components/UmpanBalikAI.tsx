/**
 * Kotak umpan balik AI untuk evaluasi.
 *
 * Tampil setelah siswa menjawab, baik benar maupun salah. Resqy menjelaskan
 * MENGAPA jawaban itu benar, atau bagian mana yang perlu ditinjau - tanpa
 * pernah menyebutkan jawaban benarnya saat siswa masih salah.
 *
 * Catatan penting: kotak ini TIDAK menghalangi siswa. Bila AI luring atau
 * kuota habis, siswa tetap dapat melanjutkan permainan; hanya kotak ini yang
 * menampilkan keterangan.
 */
import PixelIcon from './PixelIcon';
import type { KeadaanUmpanBalik } from '../ai/useUmpanBalik';

interface Props {
  benar: boolean;
  keadaan: KeadaanUmpanBalik;
  /** Label kecil di atas, mis. "Umpan balik Resqy". */
  judul?: string;
}

export default function UmpanBalikAI({ benar, keadaan, judul = 'Umpan balik Resqy' }: Props) {
  const { memuat, teks, galat, ulangi } = keadaan;
  if (!memuat && !teks && !galat) return null;

  return (
    <div
      className={`w-full rounded-xl border-2 p-3 sm:p-3.5 text-left ${
        benar
          ? 'bg-emerald-50 border-emerald-600/60'
          : 'bg-amber-50 border-[#b45309]/60'
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2 mb-1.5">
        <PixelIcon name={benar ? 'check' : 'bulb'} size={16} className="text-[#78350f]" />
        <span className="font-pixel-title font-bold text-[12.5px] sm:text-[13.5px] text-[#78350f]">
          {judul}
        </span>
      </div>

      {memuat && (
        <p className="font-sans text-[13px] sm:text-[14.5px] leading-relaxed text-[#451a03] animate-pulse">
          Resqy sedang membaca jawabanmu...
        </p>
      )}

      {!memuat && teks && (
        <p className="font-sans text-[13px] sm:text-[14.5px] leading-relaxed text-[#291305] font-semibold whitespace-pre-line">
          {teks}
        </p>
      )}

      {!memuat && !teks && galat && (
        <div className="space-y-1.5">
          <p className="font-sans text-[12.5px] sm:text-[13.5px] leading-relaxed text-[#451a03]">
            {galat}
          </p>
          <button
            type="button"
            onClick={ulangi}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100 border-2 border-[#b45309]/50 text-[12px] font-bold text-[#451a03] cursor-pointer"
          >
            COBA LAGI
          </button>
        </div>
      )}
    </div>
  );
}
