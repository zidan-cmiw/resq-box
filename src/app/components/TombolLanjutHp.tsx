import React from 'react';

/**
 * Tombol LANJUT untuk dialog cerita (visual novel) — HANYA tampil di layar HP.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * MENGAPA KOMPONEN INI ADA
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   MASALAH YANG DITEMUKAN
 *
 *     Baik `VisualNovelDialogue.tsx` (Level 1) maupun
 *     `VisualNovelDialogueL2.tsx` (Level 2) memakai petunjuk:
 *
 *         <span className="... hidden sm:inline">
 *           [Klik / SPASI untuk Lanjut ▶]
 *         </span>
 *
 *     Kelas `hidden sm:inline` membuat petunjuk itu TIDAK MUNCUL di layar HP.
 *
 *     Seluruh kotak dialog memang dapat DITEKAN untuk melanjutkan, dan di
 *     laptop itu ditambah petunjuk tulisan. Tetapi di HP tidak ada petunjuk
 *     apa pun — pemain hanya melihat teks percakapan tanpa tanda bahwa ia
 *     harus menekan sesuatu.
 *
 *     Pada layar sentuh hal ini lebih buruk daripada di laptop: pengguna HP
 *     tidak punya kebiasaan "menekan di mana saja", dan tidak ada kursor yang
 *     berubah menjadi tangan sebagai petunjuk.
 *
 *   MENGAPA DIJADIKAN SATU KOMPONEN
 *
 *     Kedua berkas itu adalah SALINAN satu sama lain. Ketika masalah ini
 *     diperbaiki di Level 1, Level 2 TIDAK ikut terperbaiki — karena
 *     perbaikannya ditulis di satu salinan saja.
 *
 *     Itulah bahaya kode yang disalin: satu perbaikan harus diulang di semua
 *     salinan, dan yang terlewat tidak menimbulkan galat apa pun. Ia hanya
 *     diam-diam tetap rusak.
 *
 *     Dengan menjadikannya satu komponen:
 *
 *       - perbaikan berikutnya cukup dilakukan SEKALI
 *       - tidak mungkin lagi ada salinan yang tertinggal
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * MENGAPA TOMBOL INI DITARUH DI BARIS PALING BAWAH DIALOG
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *     1. Berada paling dekat dengan ibu jari saat memegang perangkat
 *     2. Berada di BAWAH teks, bukan di atasnya — sehingga alur membacanya
 *        wajar: nama pembicara, isi percakapan, lalu tombol
 *     3. Hanya dirender di layar sempit (`sm:hidden`). Di laptop petunjuk
 *        tulisan sudah cukup dan tombolnya tidak diperlukan
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * CATATAN PENTING TENTANG PENEKANAN
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   Seluruh kartu dialog juga dapat ditekan untuk maju. Tanpa
 *   `e.stopPropagation()`, menekan tombol ini akan memicu DUA kemajuan
 *   sekaligus — melompati satu baris percakapan.
 *
 *   Karena itu penekanannya WAJIB dihentikan di sini, dan itu sudah
 *   ditangani oleh komponen ini. Pemanggil tidak perlu memikirkannya lagi.
 */
interface TombolLanjutHpProps {
  /** Dipanggil sekali saat tombol ditekan. */
  onLanjut: () => void;
  /**
   * Bila true, tulisan tombol menjadi "LEWATI" — karena saat teks sedang
   * diketik, menekan tombol berarti mempercepat tulisan, bukan maju.
   */
  sedangMengetik?: boolean;
}

export const TombolLanjutHp: React.FC<TombolLanjutHpProps> = ({
  onLanjut,
  sedangMengetik = false,
}) => (
  <div className="flex justify-end pt-2 sm:hidden">
    <button
      type="button"
      onClick={(e) => {
        // WAJIB: mencegah maju dua kali karena kartu dialog juga dapat ditekan.
        e.stopPropagation();
        onLanjut();
      }}
      className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 active:translate-y-0.5 text-amber-50 border-2 border-[#451a03] shadow-[0_3px_0_#231206] font-pixel-title text-[13px] font-bold flex items-center gap-1.5 cursor-pointer"
    >
      <span>{sedangMengetik ? 'LEWATI' : 'LANJUT'}</span>
      <span className="text-[11px]">▶</span>
    </button>
  </div>
);

export default TombolLanjutHp;
