// ── src/app/Level2/VolcanoRescueFailedModal.tsx ──────────────────────────────
// Modal Popup Kegagalan Evakuasi Fase 4 Erupsi Merapi (Area 5)
// Tampil saat batas waktu 15 detik evakuasi 3 warga dusun habis.
// Didesain dengan palet warna Perkamen Krem Hangat & Bingkai Kayu Retro Jati (100% Serasi Discovery Modal)

import React, { useEffect } from 'react';
import { retroAudio } from '../../utils/retroAudio';
import PixelIcon from '../../components/PixelIcon';

interface VolcanoRescueFailedModalProps {
  reason?: string;
  onRetry: () => void;
}

export const VolcanoRescueFailedModal: React.FC<VolcanoRescueFailedModalProps> = ({
  reason = 'Waktu evakuasi 15 detik telah habis! Awan panas dan material erupsi mulai meluncur turun lereng Merapi!',
  onRetry,
}) => {
  const handleRetryClick = () => {
    retroAudio.playSelect();
    onRetry();
  };

  // Dukungan tombol pintas [E] dan [Spasi] untuk mengulang
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'e' || e.key === 'E' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleRetryClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm select-none animate-fadeIn font-pixel">
      <div className="relative w-full max-w-xl sm:max-w-2xl bg-[#fef3c7] border-4 border-[#78350f] rounded-3xl p-6 sm:p-8 shadow-[0_16px_0_#451a03] text-[#451a03] text-center">
        {/* Sudut dekoratif retro piksel */}
        <div className="absolute top-2 left-2 w-3.5 h-3.5 bg-[#b45309]" />
        <div className="absolute top-2 right-2 w-3.5 h-3.5 bg-[#b45309]" />
        <div className="absolute bottom-2 left-2 w-3.5 h-3.5 bg-[#b45309]" />
        <div className="absolute bottom-2 right-2 w-3.5 h-3.5 bg-[#b45309]" />

        {/* Ikon Peringatan Kritis */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#fee2e2] border-3 border-[#dc2626] flex items-center justify-center text-[#dc2626] font-pixel-title text-2xl font-bold shadow-[0_4px_0_#991b1b] animate-bounce">
          <PixelIcon name="alert" size={34} />
        </div>

        {/* Judul Peringatan */}
        <h3 className="text-base sm:text-lg md:text-xl font-pixel-title text-[#991b1b] font-bold mb-3 tracking-wide">
          ▲ EVAKUASI DUSUN TERLAMBAT! ▲
        </h3>

        {/* Deskripsi Alasan Gagal */}
        <p className="font-sans text-base sm:text-lg md:text-xl font-bold text-[#451a03] leading-relaxed mb-5">
          {reason}
        </p>

        {/* Kotak Edukasi Tips Evakuasi Cepat */}
        <div className="bg-[#fef9c3] border-2 border-[#b45309] rounded-2xl p-4 sm:p-5 mb-6 text-left shadow-[0_4px_0_#78350f]">
          <div className="inline-block bg-[#78350f] text-[#fef3c7] font-pixel-title text-[13px] sm:text-[15px] px-3 py-1 rounded-md font-bold mb-2 tracking-wider">
            [TIPS KESIAPSIAGAAN AWAS MERAPI]
          </div>
          <p className="font-sans text-[15px] sm:text-base md:text-lg text-[#78350f] leading-relaxed font-bold">
            Saat sirine EWS Status Awas berbunyi, awan panas dapat meluncur turun lereng dengan sangat cepat! Segera dekati 3 warga dusun (Mbah Tejo, Bu Siti, dan Dani), tekan <span className="text-[#991b1b] font-extrabold">[E] / TAP</span> untuk menolong mereka agar ikut berbaris ke mobil evakuasi BPBD sebelum waktu 15 detik habis!
          </p>
        </div>

        {/* Tombol Ulangi Evakuasi */}
        <button
          onClick={handleRetryClick}
          className="w-full py-4 sm:py-4.5 rounded-2xl bg-[#dc2626] hover:bg-[#b91c1c] text-[#ffffff] border-3 border-[#7f1d1d] shadow-[0_5px_0_#450a0a] text-[13px] sm:text-[15px] md:text-base font-pixel-title flex items-center justify-center gap-3 cursor-pointer transition-transform active:translate-y-1 font-bold"
        >
          <PixelIcon name="refresh" size={22} />
          <span>[ ↺ ] ULANGI EVAKUASI WARGA (15 DETIK)</span>
        </button>
      </div>
    </div>
  );
};

export default VolcanoRescueFailedModal;
