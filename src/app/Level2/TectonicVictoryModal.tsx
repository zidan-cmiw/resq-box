// ── src/app/Level2/TectonicVictoryModal.tsx ─────────────────────────
// Modal Kemenangan Akhir Level 2: Disaster Analyst
// Ditampilkan setelah murid menuntaskan 2 Zona Mitigasi Kebencanaan Geologis:
// Mitigasi Gempa Bumi & Mitigasi Erupsi Merapi
// Mengikuti desain visual, estetika retro pixel, dan layout Level 1 CoreChallengeModal

import { useNavigate } from 'react-router-dom';
import { retroAudio } from '../../utils/retroAudio';
import PixelTrophy from '../../components/PixelTrophy';
import PixelIcon from '../../components/PixelIcon';

interface TectonicVictoryModalProps {
  collectedCrystals: number;
  totalCrystals: number;
  onClose: () => void;
}

export default function TectonicVictoryModal({
  collectedCrystals,
  totalCrystals,
  onClose,
}: TectonicVictoryModalProps) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm select-none animate-fadeIn font-pixel">
      <div className="relative w-full max-w-2xl bg-[#fef3c7] border-4 border-[#451a03] rounded-3xl p-5 sm:p-7 shadow-[0_12px_0_#1c0d02] text-[#451a03] text-center max-h-[96vh] overflow-y-auto">
        {/* Close Button Top Right */}
        <div className="flex justify-end mb-1">
          <button
            onClick={() => {
              retroAudio.playSelect();
              onClose();
            }}
            className="w-8 h-8 rounded-lg bg-[#b45309]/20 hover:bg-[#b45309]/40 text-[#78350f] border border-[#78350f] font-pixel text-xs flex items-center justify-center cursor-pointer transition-transform active:translate-y-0.5"
            title="Tutup Modal & Jelajahi Map"
          >
            <PixelIcon name="cross" size={13} />
          </button>
        </div>

        {/* Pixel Trophy with Sparkles */}
        <div className="flex justify-center mb-3">
          <PixelTrophy size={96} showSparkles={true} />
        </div>

        {/* Gate Unlocked Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-500 text-emerald-800 text-[10px] font-pixel mb-2 shadow-sm font-bold">
          <PixelIcon name="star" size={14} className="text-emerald-600" />
          <span>3 ZONA MITIGASI GEMPA BUMI TUNTAS!</span>
        </div>

        {/* Level Title */}
        <h1 className="text-base sm:text-xl md:text-2xl font-pixel-title text-[#451a03] font-bold mb-3 tracking-wide">
          LEVEL 2: DISASTER ANALYST TUNTAS 100%!
        </h1>

        {/* Badges and Crystals Showcase (3 Master Badges) */}
        <div className="bg-[#fffbeb] border-3 border-[#b45309] rounded-2xl p-3.5 max-w-xl mx-auto mb-4 shadow-inner">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-3">
            {/* Badge 1: Earthquake Prep */}
            <div className="p-2.5 rounded-xl bg-sky-100 border-2 border-sky-500 text-center shadow-sm flex flex-col items-center">
              <div className="w-9 h-9 rounded-lg bg-sky-200 border border-sky-400 flex items-center justify-center shrink-0 mb-1.5">
                <PixelIcon name="shield" size={20} className="text-sky-700" />
              </div>
              <span className="text-[9px] font-pixel-title text-sky-950 font-bold block leading-tight">
                PRABENCANA
              </span>
              <span className="text-[7.5px] font-pixel text-sky-800 block mt-0.5">
                Tas Siaga 72 Jam
              </span>
            </div>

            {/* Badge 2: Earthquake Action */}
            <div className="p-2.5 rounded-xl bg-amber-100 border-2 border-amber-500 text-center shadow-sm flex flex-col items-center">
              <div className="w-9 h-9 rounded-lg bg-amber-200 border border-amber-400 flex items-center justify-center shrink-0 mb-1.5">
                <PixelIcon name="star" size={20} className="text-amber-700" />
              </div>
              <span className="text-[9px] font-pixel-title text-amber-950 font-bold block leading-tight">
                TANGGAP BENCANA
              </span>
              <span className="text-[7.5px] font-pixel text-amber-800 block mt-0.5">
                Drop-Cover-Hold On
              </span>
            </div>

            {/* Badge 3: Post-Disaster Master */}
            <div className="p-2.5 rounded-xl bg-emerald-100 border-2 border-emerald-500 text-center shadow-sm flex flex-col items-center">
              <div className="w-9 h-9 rounded-lg bg-emerald-200 border border-emerald-400 flex items-center justify-center shrink-0 mb-1.5">
                <PixelIcon name="heart" size={20} className="text-emerald-700" />
              </div>
              <span className="text-[9px] font-pixel-title text-emerald-950 font-bold block leading-tight">
                PASCABENCANA
              </span>
              <span className="text-[7.5px] font-pixel text-emerald-800 block mt-0.5">
                Titik Kumpul &amp; P3K
              </span>
            </div>
          </div>

          <div className="text-xs font-pixel text-cyan-800 bg-cyan-100 py-1.5 px-3.5 rounded-xl border border-cyan-400 inline-flex items-center gap-2 font-bold shadow-sm">
            <PixelIcon name="crystal" size={13} />
            <span>{collectedCrystals}/{totalCrystals} Kristal Mitigasi</span>
            <span>•</span>
            <PixelIcon name="star" size={13} />
            <span>Skor Sempurna 100 XP</span>
          </div>
        </div>

        {/* Narrative Transition to Level 3 */}
        <div className="bg-gradient-to-r from-amber-900 to-rose-950 text-amber-100 p-3.5 sm:p-4 rounded-2xl border-3 border-[#451a03] max-w-xl mx-auto mb-4 shadow-md text-left">
          <span className="font-pixel-title text-[9px] sm:text-[10px] text-amber-400 block mb-1 font-bold">
            JEMBATAN MISI TARUNA RESQ:
          </span>
          <p className="font-pixel text-xs leading-relaxed text-amber-100 italic">
            &ldquo;Selamat Chief Disaster Analyst! Kamu telah menuntaskan kesiapsiagaan darurat gempa 72 jam, membuktikan keahlian refleks Drop-Cover-Hold On di kelas, serta menguasai prosedur titik kumpul dan koordinasi medis pascabencana secara menyeluruh. Pilih kelanjutan misimu sekarang:&rdquo;
          </p>
        </div>

        {/* Two Main Choices: Menu Utama or Level 3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto mb-3">
          {/* Option 1: MENU UTAMA */}
          <button
            onClick={() => {
              retroAudio.playSelect();
              navigate('/');
            }}
            className="p-3.5 rounded-xl bg-[#fef3c7] hover:bg-[#fde68a] text-[#78350f] border-3 border-[#78350f] shadow-[0_4px_0_#451a03] cursor-pointer transition-transform active:translate-y-0.5 text-left flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-lg bg-[#b45309]/20 border border-[#b45309] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <PixelIcon name="globe" size={22} className="text-[#78350f]" />
            </div>
            <div>
              <span className="text-[11px] font-pixel-title font-bold block text-[#451a03]">
                MENU UTAMA
              </span>
              <span className="text-[9px] font-pixel text-[#92400e] block">
                Kembali ke Beranda Taruna
              </span>
            </div>
          </button>

          {/* Option 2: LANJUT KE LEVEL 3 */}
          <button
            onClick={() => {
              retroAudio.playUnlock();
              navigate('/level3');
            }}
            className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-3 border-[#064e3b] shadow-[0_5px_0_#064e3b] cursor-pointer transition-transform active:translate-y-0.5 text-left flex items-center gap-3 animate-pulse"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-950/40 border border-emerald-300 flex items-center justify-center shrink-0">
              <PixelIcon name="alert" size={22} className="text-emerald-100" />
            </div>
            <div>
              <span className="text-[11px] font-pixel-title font-bold block text-white flex items-center gap-1">
                LANJUT KE LEVEL 3
                <span className="text-amber-300">&gt;</span>
              </span>
              <span className="text-[9px] font-pixel text-emerald-100 block">
                Simulasi Mitigasi Bencana
              </span>
            </div>
          </button>
        </div>

        {/* Tertiary Action: Explore Area (close modal to roam) */}
        <div className="pt-2 border-t border-[#b45309]/30">
          <button
            onClick={() => {
              retroAudio.playSelect();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-[#d97706]/15 hover:bg-[#d97706]/25 text-[#92400e] border border-[#b45309] text-[10px] font-pixel cursor-pointer transition-colors inline-flex items-center gap-1.5"
          >
            <PixelIcon name="clipboard" size={14} />
            <span>JELAJAHI AREA (LIHAT GERBANG TERBUKA &amp; ZONA MITIGASI)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
