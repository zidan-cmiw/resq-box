import { useState, useEffect } from 'react';
import type { DiscoveryPointL2 } from './level2Data';
import { retroAudio } from '../../utils/retroAudio';
import PixelIcon from '../../components/PixelIcon';
import { EarthquakePrepIllustration, EarthquakeActionIllustration, EarthquakePostSafetyIllustration, EarthquakePostCoordinationIllustration } from './ilustrasi/gempa';
import { VolcanoStatusIllustration, VolcanoResponseIllustration, VolcanoPostAshIllustration, VolcanoPostSanitationIllustration, VolcanoPostLaharIllustration } from './ilustrasi/gunung-api';
import { PangeaIllustration, ConvergentSubductionIllustration, CONVERGENT_LANDFORMS_DATA, ConvergentLandformsIllustration, MegathrustIllustration, SeismographPlatesIllustration, TRANSFORM_POINTS_DATA, TransformSanAndreasIllustration } from './ilustrasi/lempeng';

// Ekspor ulang agar pemakai lama tetap bekerja tanpa perubahan
export { EarthquakePrepIllustration, EarthquakeActionIllustration, EarthquakePostSafetyIllustration, EarthquakePostCoordinationIllustration } from './ilustrasi/gempa';
export { VolcanoStatusIllustration, VolcanoResponseIllustration, VolcanoPostAshIllustration, VolcanoPostSanitationIllustration, VolcanoPostLaharIllustration } from './ilustrasi/gunung-api';
export { PangeaIllustration, ConvergentSubductionIllustration, CONVERGENT_LANDFORMS_DATA, ConvergentLandformsIllustration, TrenchIllustration, FoldedMountainsIllustration, VolcanoIllustration, MegathrustIllustration, SeismographPlatesIllustration, TRANSFORM_POINTS_DATA, TransformSanAndreasIllustration } from './ilustrasi/lempeng';

interface DiscoveryModalProps {
  discovery: DiscoveryPointL2;
  areaName?: string;
  location?: string;
  onClose: () => void;
}

export default function DiscoveryModal({
  discovery,
  onClose,
  }: DiscoveryModalProps) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedLandform, setSelectedLandform] = useState<'trench' | 'mountains' | 'volcano'>('trench');

  const handleTriggerSimulate = () => {
    retroAudio.playSelect();
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 4500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm select-none animate-fadeIn font-pixel">
      {/* Main Parchment Board (100% Selaras Level 1) */}
      <div className="relative w-full max-w-5xl xl:max-w-6xl bg-[#fef3c7] border-4 sm:border-[5px] border-[#451a03] rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-[0_12px_0_#1c0d02] text-[#451a03] font-pixel max-h-[96vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-3 border-[#78350f] pb-3 sm:pb-4 mb-3 sm:mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#b45309]/20 border-2 border-[#b45309] flex items-center justify-center shrink-0 shadow-inner">
              <PixelIcon name="search" size={20} className="text-[#92400e]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#451a03] font-pixel-title font-bold mt-0.5 tracking-wide">
                {discovery.title}
              </h2>
            </div>
          </div>
          <button aria-label="Tutup"
            onClick={() => {
              retroAudio.playSelect();
              onClose();
            }}
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#b45309] hover:bg-[#92400e] text-amber-100 border-2 border-[#451a03] font-pixel-title text-[15px] sm:text-base flex items-center justify-center cursor-pointer active:translate-y-0.5 shadow-[0_3px_0_#451a03] shrink-0 transition-colors font-medium"
            title="Tutup"
          >
            ✕
          </button>
        </div>

        {/* Visual Illustration Area (Dimensi Presisi Level 1) */}
        <div className="w-full h-[360px] sm:h-[410px] md:h-[460px] bg-[#0c0a09] border-3 sm:border-4 border-[#78350f] rounded-xl sm:rounded-2xl overflow-hidden relative mb-3 sm:mb-4 flex items-center justify-center shadow-inner">
          {renderIllustration(discovery.illustrationType, isSimulating, handleTriggerSimulate, selectedLandform, setSelectedLandform)}
        </div>

        {/* ── PENJELASAN MATERI (RINGKAS & MUDAH DIPAHAMI UNTUK SMP) ── */}
        <div className="bg-[#fef9c3] p-3.5 sm:p-5 md:p-6 rounded-2xl border-3 border-[#b45309]/60 shadow-md text-[#291305] space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="px-2.5 py-1 rounded-md bg-[#b45309] text-amber-50 font-pixel-title text-[13px] sm:text-[15px] font-bold tracking-wider shadow-sm">
              MATERI PEMBELAJARAN
            </span>
          </div>
          <p className="font-sans text-base sm:text-lg md:text-xl leading-relaxed text-[#291305] font-bold tracking-wide">
            {discovery.shortDesc}
          </p>

          {/* Khusus untuk earthquake-prep: 4 Pilar Isi Tas Siaga Bencana (72 Jam) */}
          {discovery.illustrationType === 'earthquake-prep' && (
            <div className="mt-3 pt-3.5 border-t-2 border-[#b45309]/30 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#b45309] animate-pulse" />
                <span className="font-pixel-title text-[15px] sm:text-base md:text-lg font-bold text-[#78350f]">
                  4 KOMPONEN WAJIB TAS SIAGA BENCANA (STANDAR BNPB)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-1">
                <div className="bg-amber-100/90 border-2 border-[#b45309]/50 rounded-xl p-3 shadow-sm flex flex-col gap-1.5 hover:bg-amber-100 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0" />
                    <span className="font-pixel-title text-[13px] sm:text-[15px] font-bold text-[#78350f]">
                      1. AIR &amp; RANSUM
                    </span>
                  </div>
                  <p className="font-sans text-[13px] sm:text-[15px] text-[#291305] font-semibold leading-snug">
                    Min. 3 liter air per orang per hari serta biskuit/makanan kaleng kalori tinggi untuk 72 jam mandiri.
                  </p>
                </div>

                <div className="bg-amber-100/90 border-2 border-[#b45309]/50 rounded-xl p-3 shadow-sm flex flex-col gap-1.5 hover:bg-amber-100 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                    <span className="font-pixel-title text-[13px] sm:text-[15px] font-bold text-[#78350f]">
                      2. KOTAK P3K
                    </span>
                  </div>
                  <p className="font-sans text-[13px] sm:text-[15px] text-[#291305] font-semibold leading-snug">
                    Kasa steril, perban, plester, cairan antiseptik luka, pereda nyeri, dan obat-obatan rutin pribadi.
                  </p>
                </div>

                <div className="bg-amber-100/90 border-2 border-[#b45309]/50 rounded-xl p-3 shadow-sm flex flex-col gap-1.5 hover:bg-amber-100 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                    <span className="font-pixel-title text-[13px] sm:text-[15px] font-bold text-[#78350f]">
                      3. SENTER &amp; PELUIT
                    </span>
                  </div>
                  <p className="font-sans text-[13px] sm:text-[15px] text-[#291305] font-semibold leading-snug">
                    Senter LED waterproof dengan baterai cadangan serta peluit darurat untuk panggilan sinyal evakuasi SAR.
                  </p>
                </div>

                <div className="bg-emerald-100/90 border-2 border-emerald-600/70 rounded-xl p-3 shadow-sm flex flex-col gap-1.5 hover:bg-emerald-100 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                    <span className="font-pixel-title text-[13px] sm:text-[15px] font-bold text-emerald-900">
                      4. DOKUMEN &amp; UANG
                    </span>
                  </div>
                  <p className="font-sans text-[13px] sm:text-[15px] text-[#064e3b] font-bold leading-snug">
                    Fotokopi KK, KTP, ijazah, akta lahir dalam ziplock anti-air, serta uang tunai pecahan kecil.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Khusus untuk convergent-landforms: Penjelasan 3 Poin Kunci Bentang Alam yang sedang dipilih dengan ukuran besar & jelas */}
          {discovery.illustrationType === 'convergent-landforms' && (
            <div className="mt-3 pt-3.5 border-t-2 border-[#b45309]/30 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#b45309] animate-pulse" />
                  <span className="font-pixel-title text-[15px] sm:text-base md:text-lg font-bold text-[#78350f]">
                    {CONVERGENT_LANDFORMS_DATA[selectedLandform].title}
                  </span>
                </div>
                <span className="text-[13px] sm:text-[15px] font-pixel font-bold uppercase text-[#78350f] bg-amber-200/80 px-2.5 py-1 rounded-lg border border-[#b45309]/40">
                  {CONVERGENT_LANDFORMS_DATA[selectedLandform].subtitle}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                {CONVERGENT_LANDFORMS_DATA[selectedLandform].points.map((pt, idx) => (
                  <div
                    key={idx}
                    className="bg-amber-100/90 border-2 border-[#b45309]/50 rounded-xl p-3.5 sm:p-4 shadow-sm flex items-start gap-3 hover:bg-amber-100 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#b45309]/20 border border-[#b45309]/50 flex items-center justify-center shrink-0 mt-0.5 shadow-inner">
                      <PixelIcon name={pt.icon as any} size={15} className="text-[#92400e]" />
                    </div>
                    <p className="font-sans text-[15px] sm:text-base md:text-[19px] leading-relaxed text-[#291305] font-semibold">
                      {pt.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Khusus untuk transform-sanandreas: Penjelasan 3 Karakteristik Utama Batas Transform dengan ukuran besar & jelas */}
          {discovery.illustrationType === 'transform-sanandreas' && (
            <div className="mt-3 pt-3.5 border-t-2 border-[#b45309]/30 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#b45309] animate-pulse" />
                <span className="font-pixel-title text-[15px] sm:text-base md:text-lg font-bold text-[#78350f]">
                  3 KARAKTERISTIK UTAMA BATAS TRANSFORM
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                {TRANSFORM_POINTS_DATA.map((pt, idx) => (
                  <div
                    key={idx}
                    className="bg-amber-100/90 border-2 border-[#b45309]/50 rounded-xl p-3.5 sm:p-4 shadow-sm flex items-start gap-3 hover:bg-amber-100 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#b45309]/20 border border-[#b45309]/50 flex items-center justify-center shrink-0 mt-0.5 shadow-inner">
                      <PixelIcon name={pt.icon as any} size={15} className="text-[#92400e]" />
                    </div>
                    <div className="space-y-1">
                      <span className="font-pixel-title text-[13px] sm:text-[15px] font-bold text-[#78350f] block">
                        {pt.title}
                      </span>
                      <p className="font-sans text-[15px] sm:text-base md:text-[19px] leading-relaxed text-[#291305] font-semibold">
                        {pt.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {discovery.fact && (
            <div className="pt-3 border-t-2 border-[#b45309]/25 flex items-start gap-2.5 sm:gap-3">
              <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md bg-amber-700/20 text-[#78350f] border border-[#b45309]/40 font-pixel-title text-[13.5px] sm:text-[13px] md:text-[15px] font-bold shrink-0 mt-0.5">
                FAKTA KUNCI
              </span>
              <p className="font-sans text-base sm:text-lg md:text-xl leading-relaxed text-[#451a03] font-semibold italic">
                {discovery.fact}
              </p>
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t-2 border-[#b45309]/40 flex justify-end">
          <button aria-label="Lanjutkan"
            onClick={() => {
              retroAudio.playSelect();
              onClose();
            }}
            className="px-8 py-3 sm:px-10 sm:py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-50 border-3 sm:border-4 border-[#451a03] shadow-[0_5px_0_#231206] text-[15px] sm:text-base md:text-lg font-pixel-title cursor-pointer active:translate-y-1 flex items-center gap-2.5 transition-all font-medium"
          >
            <PixelIcon name="check" size={18} className="text-amber-200" />
            <span>SAYA MENGERTI!</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN: ANIMASI PEMEKARAN DIVERGEN (DARATAN AWAL NYAMBUNG & BEBAS TEKS)
// ═════════════════════════════════════════════════════════════════════════════
function DivergentAnimIllustration({
  isSimulating: externalIsSimulating,
  onSimulate,
  }: {
  isSimulating?: boolean;
  onSimulate?: () => void;
}) {
  const [isDiverged, setIsDiverged] = useState(false);

  useEffect(() => {
    if (externalIsSimulating) {
      setIsDiverged(true);
    }
  }, [externalIsSimulating]);

  const handleToggle = () => {
    retroAudio.playSelect?.();
    setIsDiverged(prev => !prev);
    onSimulate?.();
  };

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-between p-2 sm:p-3 overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Top Bar Controls */}
      <div className="w-full flex items-center justify-between px-3.5 py-2 bg-slate-900/95 border border-orange-500/70 rounded-xl z-10 shadow-lg">
        <span className="text-[13px] sm:text-[15px] font-bold text-orange-400 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
          <span>SIMULATOR GEOLOGI: PEMEKARAN DASAR SAMUDRA &amp; PEMATANG TENGAH</span>
        </span>
        <button aria-label="Tampilkan atau sembunyikan penjelasan"
          onClick={handleToggle}
          className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-xl text-white text-[13px] sm:text-[15px] font-bold border-2 cursor-pointer active:translate-y-0.5 transition-all flex items-center gap-2 shadow-md bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 border-orange-400/80 shadow-[0_3px_0_#7c2d12]"
        >
          <PixelIcon name="zap" size={15} />
          <span>{isDiverged ? '↺ GABUNGKAN KEMBALI DARATAN' : '▶ SIMULASI PEMISAHAN'}</span>
        </button>
      </div>

      {/* Realistic Geological SVG Cross-Section (100% Bebas Teks di Dalam Gambar) */}
      <div className="w-full flex-1 min-h-0 relative flex items-center justify-center overflow-hidden my-1">
        <svg
          viewBox="0 0 680 340"
          className="w-full h-full object-contain drop-shadow-2xl"
          shapeRendering="geometricPrecision"
        >
          <defs>
            {/* Gradasi Kolom Air Samudra */}
            <linearGradient id="divOceanGradL2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.85" />
              <stop offset="35%" stopColor="#0369a1" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#082f49" />
            </linearGradient>

            {/* Gradasi Mantel Astenosfer Panas */}
            <linearGradient id="divMantleGradL2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9a3412" />
              <stop offset="40%" stopColor="#7c2d12" />
              <stop offset="100%" stopColor="#3d1306" />
            </linearGradient>

            {/* Gradasi Dapur Magma */}
            <radialGradient id="divMagmaChamberGradL2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#fef08a" />
              <stop offset="60%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#dc2626" />
            </radialGradient>

            {/* Gradasi Asap Hidrotermal Black Smoker */}
            <linearGradient id="divSmokerGradL2" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#0f172a" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#334155" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#64748b" stopOpacity="0" />
            </linearGradient>

            {/* Gradasi Berkas Cahaya Laut Dalam */}
            <linearGradient id="divCausticRayL2" x1="0" y1="0" x2="0.3" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
            </linearGradient>
          </defs>

          <style>{`
            @keyframes divPlumeDriftL2 {
              0% { transform: translateY(0px) scale(0.95); opacity: 0.85; }
              50% { transform: translateY(-8px) scale(1.1); opacity: 0.95; }
              100% { transform: translateY(-18px) scale(1.25); opacity: 0.1; }
            }
            @keyframes divMagmaPulseL2 {
              0%, 100% { filter: drop-shadow(0 0 8px #f97316); opacity: 0.9; }
              50% { filter: drop-shadow(0 0 20px #fbbf24); opacity: 1; }
            }
            @keyframes divBubbleRiseL2 {
              0% { transform: translateY(0px); opacity: 0; }
              20% { opacity: 0.9; }
              100% { transform: translateY(-35px); opacity: 0; }
            }
            @keyframes divFlowPulseL2 {
              0% { stroke-dashoffset: 0; }
              100% { stroke-dashoffset: -30; }
            }
          `}</style>

          {/* ── 1. KOLOM AIR SAMUDRA LUAS ── */}
          <rect x="0" y="0" width="680" height="340" fill="url(#divOceanGradL2)" />

          {/* Permukaan Laut Riak Berombak Halus */}
          <path
            d="M 0 16 Q 40 10, 80 16 T 160 16 T 240 16 T 320 16 T 400 16 T 480 16 T 560 16 T 640 16 T 680 16 L 680 0 L 0 0 Z"
            fill="#38bdf8"
            opacity="0.3"
          />
          <line x1="0" y1="16" x2="680" y2="16" stroke="#7dd3fc" strokeWidth="1.5" opacity="0.6" />

          {/* Berkas Cahaya Bawah Laut */}
          <polygon points="60,16 110,16 170,120 110,120" fill="url(#divCausticRayL2)" />
          <polygon points="210,16 270,16 340,110 270,110" fill="url(#divCausticRayL2)" />
          <polygon points="410,16 470,16 530,110 460,110" fill="url(#divCausticRayL2)" />
          <polygon points="560,16 610,16 660,120 600,120" fill="url(#divCausticRayL2)" />

          {/* ── 2. MANTEL BUMI ASTENOSFER (DI BAWAH LITOSFER) ── */}
          <rect x="0" y="160" width="680" height="180" fill="url(#divMantleGradL2)" />

          {/* ARUS KONVEKSI MANTEL: Upwelling dan Pembelahan Dua Arah */}
          <g style={{ animation: 'divFlowPulseL2 2s linear infinite' }}>
            <path
              d="M 340 330 C 340 260, 340 215, 340 175"
              fill="none"
              stroke="#fb923c"
              strokeWidth="4"
              strokeDasharray="8 6"
            />
            <path
              d="M 340 175 C 300 175, 200 175, 120 190 C 60 200, 35 240, 45 285 C 55 320, 160 330, 330 330"
              fill="none"
              stroke="#ea580c"
              strokeWidth="3.2"
              strokeDasharray="8 6"
            />
            <path
              d="M 340 175 C 380 175, 480 175, 560 190 C 620 200, 645 240, 635 285 C 625 320, 520 330, 350 330"
              fill="none"
              stroke="#ea580c"
              strokeWidth="3.2"
              strokeDasharray="8 6"
            />
          </g>

          {/* Panah Indikator Arus Konveksi */}
          <polygon points="175,178 190,170 190,186" fill="#f97316" />
          <polygon points="505,178 490,170 490,186" fill="#f97316" />

          {/* ── 3. DAPUR MAGMA RETAKAN (AXIAL MAGMA CHAMBER) ── */}
          <g style={{ animation: 'divMagmaPulseL2 2.5s ease-in-out infinite' }}>
            <ellipse cx="340" cy="190" rx="55" ry="26" fill="url(#divMagmaChamberGradL2)" />
            <rect x="334" y="112" width="12" height="58" fill="#ff4500" rx="2" />
            <path d="M 326 145 L 336 125 L 344 125 L 354 145 Z" fill="#fb923c" opacity="0.8" />
          </g>

          {/* ── 4. MAGMA NAIK & PEMBENTUKAN KERAK DASAR LAUT DI CELAH LEMBAH ── */}
          <g style={{ opacity: isDiverged ? 1 : 0, transition: 'opacity 2.5s ease-in-out' }}>
            <rect x="328" y="108" width="24" height="32" fill="#ff4500" rx="3" />
            <ellipse cx="340" cy="114" rx="18" ry="7" fill="#fbbf24" />

            <path
              d="M 320 118 C 326 114, 333 116, 340 114 C 347 116, 354 114, 360 118 L 360 128 C 347 130, 333 130, 320 128 Z"
              fill="#18181b"
              stroke="#ea580c"
              strokeWidth="1.5"
            />
            <circle cx="336" cy="106" r="2.2" fill="#fed7aa" style={{ animation: 'divBubbleRiseL2 1.6s infinite 0.2s' }} />
            <circle cx="344" cy="102" r="2.5" fill="#fef08a" style={{ animation: 'divBubbleRiseL2 1.6s infinite 0.7s' }} />
            <circle cx="340" cy="108" r="1.8" fill="#ffffff" style={{ animation: 'divBubbleRiseL2 1.6s infinite 1.1s' }} />
          </g>

          {/* ── 5. LEMPENG BARAT (KIRI) — BERAWAL MENYATU (NYAMBUNG DI TENGAH X=340) ── */}
          <g
            style={{
              transform: isDiverged ? 'translateX(-56px)' : 'translateX(0)',
              transition: 'transform 3.5s cubic-bezier(0.2, 0.8, 0.35, 1)',
              }}
          >
            <path
              d="M 0 135 C 70 130, 160 115, 230 92 C 265 82, 305 78, 340 78 L 341 96 L 338 116 L 342 138 L 339 158 L 340 170 L 0 170 Z"
              fill="#1e3a2b"
              stroke="#0f172a"
              strokeWidth="2"
            />
            <path
              d="M 0 135 C 70 130, 160 115, 230 92 C 265 82, 305 78, 340 78 L 341 96 L 338 116 L 342 138 L 315 138 C 230 138, 120 145, 0 152 Z"
              fill="#1e293b"
            />
            <path
              d="M 0 135 C 70 130, 160 115, 230 92 C 265 82, 305 78, 340 78 L 341 96 L 338 116 L 315 116 C 230 116, 120 132, 0 140 Z"
              fill="#334155"
              stroke="#0f172a"
              strokeWidth="1.5"
            />
            <path
              d="M 0 135 C 60 131, 130 118, 190 102 L 190 106 C 130 122, 60 135, 0 139 Z"
              fill="#fef08a"
              opacity="0.85"
            />

            <line x1="275" y1="83" x2="275" y2="135" stroke="#0f172a" strokeWidth="2" />
            <line x1="298" y1="81" x2="298" y2="140" stroke="#0f172a" strokeWidth="2" />
            <line x1="322" y1="79" x2="322" y2="155" stroke="#0f172a" strokeWidth="2" />

            <path d="M 324 80 L 327 68 L 331 68 L 334 80 Z" fill="#18181b" stroke="#78350f" strokeWidth="1" />

            <g
              transform="translate(130, 52)"
              style={{
                opacity: isDiverged ? 1 : 0.4,
                transition: 'opacity 1.5s ease',
                }}
            >
              <polygon points="-55,10 -35,0 -35,20" fill="#38bdf8" filter="drop-shadow(0 0 6px #0284c7)" />
              <rect x="-35" y="6" width="65" height="8" rx="2" fill="#38bdf8" />
            </g>
          </g>

          {/* ── 6. LEMPENG TIMUR (KANAN) — BERAWAL MENYATU (NYAMBUNG DI TENGAH X=340) ── */}
          <g
            style={{
              transform: isDiverged ? 'translateX(56px)' : 'translateX(0)',
              transition: 'transform 3.5s cubic-bezier(0.2, 0.8, 0.35, 1)',
              }}
          >
            <path
              d="M 680 135 C 610 130, 520 115, 450 92 C 415 82, 375 78, 340 78 L 341 96 L 338 116 L 342 138 L 339 158 L 340 170 L 680 170 Z"
              fill="#1e3a2b"
              stroke="#0f172a"
              strokeWidth="2"
            />
            <path
              d="M 680 135 C 610 130, 520 115, 450 92 C 415 82, 375 78, 340 78 L 341 96 L 338 116 L 342 138 L 365 138 C 450 138, 560 145, 680 152 Z"
              fill="#1e293b"
            />
            <path
              d="M 680 135 C 610 130, 520 115, 450 92 C 415 82, 375 78, 340 78 L 341 96 L 338 116 L 365 116 C 450 116, 560 132, 680 140 Z"
              fill="#334155"
              stroke="#0f172a"
              strokeWidth="1.5"
            />
            <path
              d="M 680 135 C 620 131, 550 118, 490 102 L 490 106 C 550 122, 620 135, 680 139 Z"
              fill="#fef08a"
              opacity="0.85"
            />

            <line x1="405" y1="83" x2="405" y2="135" stroke="#0f172a" strokeWidth="2" />
            <line x1="382" y1="81" x2="382" y2="140" stroke="#0f172a" strokeWidth="2" />
            <line x1="358" y1="79" x2="358" y2="155" stroke="#0f172a" strokeWidth="2" />

            <path d="M 346 80 L 349 68 L 353 68 L 356 80 Z" fill="#18181b" stroke="#78350f" strokeWidth="1" />

            <g
              transform="translate(550, 52)"
              style={{
                opacity: isDiverged ? 1 : 0.4,
                transition: 'opacity 1.5s ease',
                }}
            >
              <polygon points="55,10 35,0 35,20" fill="#38bdf8" filter="drop-shadow(0 0 6px #0284c7)" />
              <rect x="-30" y="6" width="65" height="8" rx="2" fill="#38bdf8" />
            </g>
          </g>
        </svg>
      </div>

      {/* Scientific Legend & Process Overview (Keterangan Rapi di Luar Gambar) */}
      <div className="w-full bg-[#0f172a]/95 border-2 border-orange-500/70 rounded-xl p-2.5 sm:p-3 text-slate-200 text-[13px] sm:text-[15px] z-10 flex flex-wrap items-center justify-between gap-2 shadow-lg font-semibold">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-500 shrink-0" />
          <span className="font-bold text-orange-300">Pematang Tengah Samudra (Mid-Ocean Ridge):</span>
          <span className="text-slate-200">
            Dua lempeng memisah, magma naik mengisi celah dan membeku menjadi daratan kerak samudra baru.
          </span>
        </div>
      </div>
    </div>
  );
}

// ── RENDER ILUSTRASI DIAGRAM SAINS RETRO PIXEL ──
function renderIllustration(
  type: DiscoveryPointL2['illustrationType'],
  isSimulating: boolean,
  onSimulate: () => void,
  selectedLandform?: 'trench' | 'mountains' | 'volcano',
  onSelectLandform?: (lf: 'trench' | 'mountains' | 'volcano') => void
) {
  switch (type) {
    // ═════════════════════════════════════════════════════════════════════════
    // 1. TEORI APUNGAN BENUA (4 TAHAP EVOLUSI PANGEA - SESUAI GAMBAR REFERENSI)
    // ═════════════════════════════════════════════════════════════════════════
    case 'wegener-pangea':
      return <PangeaIllustration />;

    // ═════════════════════════════════════════════════════════════════════════
    // 2. BUKTI RANTAI PEGUNUNGAN KEMBAR (PETA BENUA REALISTIS DENGAN KONTUR BENAR)
    // ═════════════════════════════════════════════════════════════════════════
    case 'twin-mountains':
      return (
        <svg viewBox="0 0 600 320" className="w-full h-full object-contain" shapeRendering="crispEdges">
          {/* Lautan Samudra Luas */}
          <rect x="0" y="0" width="600" height="320" fill="#082f49" />

          {/* Garis Grid Kartografi */}
          <line x1="0" y1="160" x2="600" y2="160" stroke="#0284c7" strokeWidth="1" opacity="0.4" />
          <line x1="300" y1="0" x2="300" y2="320" stroke="#0284c7" strokeWidth="1" opacity="0.4" />

          {/* Banner Judul */}
          <rect x="30" y="6" width="540" height="26" rx="5" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="1.5" />
          <text x="300" y="23" textAnchor="middle" fill="#fef08a" fontSize="9.5" fontWeight="bold" fontFamily="sans-serif">
            REKONSTRUKSI PANGEA: PENYATUAN AMERIKA UTARA, EROPA, &amp; AFRIKA
          </text>

          {/* ── 1. BENUA AMERIKA UTARA (KONTUR GEOGRAFIS NYATA DENGAN LABRADOR, EAST COAST, FLORIDA) ── */}
          <path
            d="M 50 140 
               L 80 100 L 110 70 L 150 50 L 190 40 L 220 55 L 245 45 
               L 255 75 L 245 95 L 235 125 L 225 155 L 205 190 L 195 225 
               L 165 240 L 135 220 L 110 185 L 85 180 L 60 165 Z"
            fill="#15803d"
            stroke="#166534"
            strokeWidth="2"
          />
          {/* Label Amerika Utara */}
          <text x="130" y="140" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
            AMERIKA UTARA
          </text>
          <text x="130" y="153" fill="#bbf7d0" fontSize="8" fontFamily="sans-serif">
            (Pesisir Timur / Pangea)
          </text>

          {/* ── 2. BENUA EROPA (KONTUR NYATA DENGAN INGGRIS, SKANDINAVIA, & IBERIA) ── */}
          <path
            d="M 260 45 
               L 310 35 L 355 45 L 395 70 L 420 50 L 450 75 L 430 110 
               L 390 125 L 360 135 L 330 120 L 305 130 L 275 110 L 260 75 Z"
            fill="#166534"
            stroke="#14532d"
            strokeWidth="2"
          />
          <text x="360" y="85" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
            EROPA
          </text>
          <text x="360" y="98" fill="#bbf7d0" fontSize="8" fontFamily="sans-serif">
            (Inggris, Skotlandia, &amp; Skandinavia)
          </text>

          {/* ── 3. BENUA AFRIKA (KONTUR NYATA DENGAN MAROKO & BULGE AFRIKA BARAT) ── */}
          <path
            d="M 235 160 
               L 275 135 L 335 140 L 385 170 L 420 215 L 390 270 
               L 330 285 L 285 270 L 255 235 L 235 190 Z"
            fill="#9a3412"
            stroke="#78350f"
            strokeWidth="2"
          />
          <text x="310" y="210" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
            AFRIKA
          </text>
          <text x="310" y="223" fill="#fed7aa" fontSize="8" fontFamily="sans-serif">
            (Pesisir Barat Laut Afrika)
          </text>

          {/* ══════════════════════════════════════════════════════════════════
              SABUK RANTAI PEGUNUNGAN KEMBAR TERSAMBUNG KONTINU (OROGENESA)
              ══════════════════════════════════════════════════════════════════ */}
          {/* Jalur orogenik menghubungkan Appalachian -> British Isles -> Caledonian */}
          <path
            d="M 175 230 
               Q 205 180, 230 130 
               Q 250 95, 275 80 
               Q 310 65, 365 55 
               L 375 68 
               Q 320 80, 285 96 
               Q 260 115, 240 145 
               Q 215 195, 185 240 Z"
            fill="#ea580c"
            stroke="#facc15"
            strokeWidth="2"
          />

          {/* Simbol Puncak Pegunungan (Gold Peaks) */}
          <polygon points="182,215 188,198 194,215" fill="#fef08a" />
          <polygon points="208,175 215,158 222,175" fill="#fef08a" />
          <polygon points="230,135 238,118 246,135" fill="#fef08a" />
          <polygon points="268,95 275,78 282,95" fill="#fef08a" />
          <polygon points="305,78 313,62 321,78" fill="#fef08a" />
          <polygon points="345,68 353,52 361,68" fill="#fef08a" />

          {/* Kotak Callout 1: Appalachian */}
          <rect x="10" y="235" width="215" height="42" rx="5" fill="#0f172a" stroke="#facc15" strokeWidth="1.5" />
          <text x="117" y="252" textAnchor="middle" fill="#facc15" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
            PEG. APPALACHIAN (AMERIKA)
          </text>
          <text x="117" y="267" textAnchor="middle" fill="#e2e8f0" fontSize="8" fontFamily="sans-serif">
            Batuan Paleozoikum &amp; Umur Sama
          </text>
          <line x1="160" y1="235" x2="185" y2="215" stroke="#facc15" strokeWidth="1.5" />

          {/* Kotak Callout 2: Caledonian */}
          <rect x="350" y="115" width="235" height="42" rx="5" fill="#0f172a" stroke="#facc15" strokeWidth="1.5" />
          <text x="467" y="132" textAnchor="middle" fill="#facc15" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
            PEG. CALEDONIAN (EROPA/UK)
          </text>
          <text x="467" y="147" textAnchor="middle" fill="#e2e8f0" fontSize="8" fontFamily="sans-serif">
            Struktur Lipatan Identik Sempurna
          </text>
          <line x1="390" y1="115" x2="330" y2="85" stroke="#facc15" strokeWidth="1.5" />

          {/* Footer Callout */}
          <rect x="30" y="284" width="540" height="26" rx="5" fill="#18181b" stroke="#38bdf8" strokeWidth="1.5" />
          <text x="300" y="301" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
            FAKTA: JIKA BENUA DISATUKAN, KEDUA RANTAI MEMBENTUK SATU SABUK UTUH!
          </text>
        </svg>
      );

    // ═════════════════════════════════════════════════════════════════════════
    // 3. SIMULATOR BATAS DIVERGEN (GERAK PELAN & MAGMA MUNCRAT / MENYEMBUR NAIK)
    // ═════════════════════════════════════════════════════════════════════════
    case 'divergent-anim':
      return <DivergentAnimIllustration isSimulating={isSimulating} onSimulate={onSimulate} />;

    case 'convergent-subduction':
      return <ConvergentSubductionIllustration />;

    // ═════════════════════════════════════════════════════════════════════════
    // 5. TIGA BENTANG ALAM GEOLOGIS HASIL TUMBUKAN KONVERGEN
    // ═════════════════════════════════════════════════════════════════════════
    case 'convergent-landforms':
      return (
        <ConvergentLandformsIllustration
          selectedLandform={selectedLandform}
          onSelectLandform={onSelectLandform}
        />
      );

    // ═════════════════════════════════════════════════════════════════════════
    // 6. SIMULATOR SESAR MEGATHRUST & GELOMBANG GEMPA DAHSYAT
    // ═════════════════════════════════════════════════════════════════════════
    case 'megathrust-earthquake':
      return <MegathrustIllustration />;

    // ═════════════════════════════════════════════════════════════════════════
    // 7. SISMOGRAF MEKANIK KE SINYAL LISTRIK & BUKTI 20 LEMPENG TEKTONIK
    // ═════════════════════════════════════════════════════════════════════════
    case 'seismograph-plates':
      return <SeismographPlatesIllustration />;

    // ═════════════════════════════════════════════════════════════════════════
    // 8. BATAS TRANSFORM & SESAR SAN ANDREAS (OFFSET STREAM KALIFORNIA)
    // ═════════════════════════════════════════════════════════════════════════
    case 'transform-sanandreas':
      return <TransformSanAndreasIllustration />;

    // ═════════════════════════════════════════════════════════════════════════
    // 9. MITIGASI GEMPA: TAS SIAGA BENCANA 72 JAM
    // ═════════════════════════════════════════════════════════════════════════
    case 'earthquake-prep':
      return <EarthquakePrepIllustration />;

    // ═════════════════════════════════════════════════════════════════════════
    // 10. MITIGASI GEMPA: STANDAR DROP, COVER, HOLD ON
    // ═════════════════════════════════════════════════════════════════════════
    case 'earthquake-action':
      return <EarthquakeActionIllustration />;

    // ═════════════════════════════════════════════════════════════════════════
    // 11. MITIGASI ERUPSI: 4 TINGKAT STATUS PVMBG & KRB MERAPI
    // ═════════════════════════════════════════════════════════════════════════
    case 'volcano-status':
      return <VolcanoStatusIllustration />;

    // ═════════════════════════════════════════════════════════════════════════
    // 12. MITIGASI ERUPSI: PROTOKOL EVAKUASI, MASKER & ANCAMAN LAHAR
    // ═════════════════════════════════════════════════════════════════════════
    case 'volcano-response':
      return <VolcanoResponseIllustration />;

    // ═════════════════════════════════════════════════════════════════════════
    // 13. PASCABENCANA: PROSEDUR KESELAMATAN & MEDIS DARURAT (BNPB)
    // ═════════════════════════════════════════════════════════════════════════
    case 'earthquake-post-safety':
      return <EarthquakePostSafetyIllustration />;

    // ═════════════════════════════════════════════════════════════════════════
    // 14. PASCABENCANA: MANAJEMEN TITIK KUMPUL & KOMUNIKASI RESMI (BNPB/BMKG)
    // ═════════════════════════════════════════════════════════════════════════
    case 'earthquake-post-coordination':
      return <EarthquakePostCoordinationIllustration />;

    // ═════════════════════════════════════════════════════════════════════════
    // 15. PASCABENCANA ERUPSI: PENANGANAN ABU VULKANIK & ATAP (BNPB)
    // ═════════════════════════════════════════════════════════════════════════
    case 'volcano-post-ash':
      return <VolcanoPostAshIllustration />;

    // ═════════════════════════════════════════════════════════════════════════
    // 16. PASCABENCANA ERUPSI: KESEHATAN, SANITASI & AIR BERSIH TERTUTUP (PMI)
    // ═════════════════════════════════════════════════════════════════════════
    case 'volcano-post-sanitation':
      return <VolcanoPostSanitationIllustration />;

    // ═════════════════════════════════════════════════════════════════════════
    // 17. PASCABENCANA ERUPSI: BAHAYA SEKUNDER LAHAR DINGIN & EWS SUNGAI
    // ═════════════════════════════════════════════════════════════════════════
    case 'volcano-post-lahar':
      return <VolcanoPostLaharIllustration />;

    default:
      return null;
  }
}
