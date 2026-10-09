import { useState, useEffect } from 'react';
import type { DiscoveryPointL2 } from './level2Data';
import { retroAudio } from '../../utils/retroAudio';
import { sifatTombol } from '../../utils/keyboard';
import PixelIcon from '../../components/PixelIcon';
import { tutupModalDenganKeyboard } from '../../utils/keyboard';
import { blokirRambatanTombol } from '../../utils/keyboard';

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

// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN: PANGEA SUPERCONTINENT MAP (PERSIS DENGAN GAMBAR 4 & GAMBAR 5)
// ═════════════════════════════════════════════════════════════════════════════
function PangeaIllustration() {
  const [selectedPlate, setSelectedPlate] = useState<string | null>(null);

  const colors = {
    ocean: '#93c5fd', // Pale Azure Ocean (Screenshot 3)
    land: '#8ec591', // Uniform Sage Green (Screenshot 3)
    landHover: '#a7f3d0', // Glowing Luminous Mint on hover
    stroke: '#1e293b', // Slate Charcoal Boundary Lines (Screenshot 3)
    strokeHover: '#047857',
    suture: '#264a38', // Faint internal terrane sutures
  };

  const plateDetails: Record<string, { title: string; desc: string }> = {
    eurasia: {
      title: 'EURASIA (Eropa & Asia)',
      desc: 'Massa daratan raksasa utara Pangea. Teluk Samudra Tethys menjorok ke sisi selatannya, dengan semenanjung panjang melengkung ke timur membungkus teluk purba.',
    },
    northAmerica: {
      title: 'AMERIKA UTARA',
      desc: 'Dahulu menempel erat dengan Eurasia di timur laut (Greenland & Skotlandia) dan berhadapan langsung dengan pesisir barat laut Afrika.',
    },
    southAmerica: {
      title: 'AMERIKA SELATAN',
      desc: 'Bukti puzzle paling ikonik Wegener: Tonjolan timur Brasil mengunci secara presisi ke dalam lekukan Teluk Guinea di pesisir barat Afrika!',
    },
    africa: {
      title: 'AFRIKA',
      desc: 'Pusat poros utama superkontinen Pangea! Bersentuhan langsung dengan Amerika Utara, Amerika Selatan, Eurasia, India, dan Antartika.',
    },
    india: {
      title: 'INDIA',
      desc: 'Kepingan benua yang terjepit di antara Afrika dan Antartika sebelum bergerak cepat melintasi Samudra Hindia menabrak Eurasia membentuk Pegunungan Himalaya.',
    },
    antarctica: {
      title: 'ANTARTIKA',
      desc: 'Massa daratan di kutub selatan Pangea. Dahulu beriklim tropis-hangat (terbukti dari fosil pakis purba Glossopteris) dan bersatu rapat dengan Australia.',
    },
    australia: {
      title: 'AUSTRALIA',
      desc: 'Melekat di pesisir timur benua Antartika sebelum retakan divergen memisahkannya ratusan juta tahun kemudian menuju posisinya saat ini.',
    },
  };

  const activePlateInfo = selectedPlate ? plateDetails[selectedPlate] : null;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between bg-[#93c5fd] select-none p-2 sm:p-3 overflow-hidden rounded-xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Top Header Mode Toggle */}
      <div className="w-full flex items-center justify-between px-3.5 py-2 bg-slate-900/95 border border-amber-500/70 rounded-xl z-10 shadow-lg">
        <span className="text-amber-300 font-bold text-[15px] sm:text-base flex items-center gap-2 tracking-wide">
          <PixelIcon name="globe" size={18} className="text-amber-400" />
          <span>SUPERKONTINEN PANGEA (~250 JUTA TAHUN LALU)</span>
        </span>
        <span className="hidden sm:inline-block text-[14.5px] text-slate-300 font-semibold bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
          Teori Alfred Wegener (1912)
        </span>
      </div>

      {/* Main SVG Pangea Map matching Screenshot 3 */}
      <div className="w-full flex-1 relative flex items-center justify-center overflow-hidden my-1">
        <svg
          viewBox="30 20 540 600"
          className="w-full h-full object-contain drop-shadow-xl"
        >
          {/* Lautan Samudra Panthalassa */}
          <rect x="-50" y="-50" width="700" height="720" fill={colors.ocean} />

          {/* Garis Grid Samudra Halus */}
          <line x1="0" y1="300" x2="600" y2="300" stroke="#60a5fa" strokeWidth="1" opacity="0.45" />
          <line x1="280" y1="0" x2="280" y2="640" stroke="#60a5fa" strokeWidth="1" opacity="0.45" />
          <text x="560" y="295" fill="#1e3a8a" fontSize="10" fontStyle="italic" textAnchor="end" opacity="0.75" fontWeight="600">
            Khatulistiwa Purba
          </text>
          <text x="45" y="45" fill="#1e3a8a" fontSize="12" fontWeight="800" opacity="0.8" letterSpacing="1">
            SAMUDRA PANTHALASSA
          </text>

          {/* Teluk Tethys Label */}
          <g transform="translate(390, 290)">
            <text x="0" y="0" fill="#1e3a8a" fontSize="12" fontWeight="bold" opacity="0.85" fontStyle="italic">
              Teluk Tethys
            </text>
            <path d="M -15 6 Q 25 1, 65 6" fill="none" stroke="#2563eb" strokeWidth="1.8" opacity="0.7" />
          </g>

          {/* ── 1. EURASIA (Bagian Utara & Ekor Semenanjung Melengkung) ── */}
          <g
            onMouseEnter={() => setSelectedPlate('eurasia')}
            onMouseLeave={() => setSelectedPlate(null)}
            onClick={() => setSelectedPlate('eurasia')}
            className="cursor-pointer transition-all"
          >
            <path
              d="M 185 115 
                 C 195 85, 235 52, 295 44 
                 C 355 42, 415 62, 455 95 
                 C 485 125, 498 155, 488 190 
                 C 478 215, 505 208, 528 230 
                 C 538 244, 532 258, 518 258 
                 C 495 245, 475 235, 450 230 
                 C 415 232, 375 245, 335 245 
                 C 295 245, 270 240, 252 235 
                 C 240 225, 230 212, 222 195 
                 C 212 180, 198 160, 188 140 
                 C 182 128, 182 120, 185 115 Z"
              fill={selectedPlate === 'eurasia' ? colors.landHover : colors.land}
              stroke={selectedPlate === 'eurasia' ? colors.strokeHover : colors.stroke}
              strokeWidth={selectedPlate === 'eurasia' ? '3.5' : '2.4'}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Pulau Kecil / Fragmen di Ujung Semenanjung Eurasia (Persis Screenshot 3) */}
            <path
              d="M 536 270 C 546 260, 554 270, 548 285 C 542 295, 532 290, 536 270 Z"
              fill={selectedPlate === 'eurasia' ? colors.landHover : colors.land}
              stroke={selectedPlate === 'eurasia' ? colors.strokeHover : colors.stroke}
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            {/* Garis Sutur/Patahan Internal Eurasia (Persis Tekstur Screenshot 3) */}
            <path d="M 255 52 C 272 82, 290 120, 308 145" fill="none" stroke={colors.suture} strokeWidth="1.4" opacity="0.6" />
            <path d="M 345 46 C 362 85, 370 135, 375 180" fill="none" stroke={colors.suture} strokeWidth="1.4" opacity="0.6" />
            <path d="M 420 72 C 435 110, 438 160, 432 200" fill="none" stroke={colors.suture} strokeWidth="1.4" opacity="0.6" />
            <path d="M 220 78 C 240 95, 245 115, 255 135" fill="none" stroke={colors.suture} strokeWidth="1.4" opacity="0.6" />

            <text x="340" y="135" fill="#0f172a" fontSize="18" fontWeight="800" textAnchor="middle">
              Eurasia
            </text>
          </g>

          {/* ── 2. NORTH AMERICA (Kiri Atas Pangea) ── */}
          <g
            onMouseEnter={() => setSelectedPlate('northAmerica')}
            onMouseLeave={() => setSelectedPlate(null)}
            onClick={() => setSelectedPlate('northAmerica')}
            className="cursor-pointer transition-all"
          >
            <path
              d="M 185 115 
                 C 165 98, 138 105, 118 120 
                 C 92 142, 78 175, 82 215 
                 C 72 245, 78 285, 92 315 
                 C 108 335, 132 340, 158 340 
                 C 178 330, 192 310, 202 280 
                 C 212 250, 222 195, 202 162 
                 C 192 145, 185 125, 185 115 Z"
              fill={selectedPlate === 'northAmerica' ? colors.landHover : colors.land}
              stroke={selectedPlate === 'northAmerica' ? colors.strokeHover : colors.stroke}
              strokeWidth={selectedPlate === 'northAmerica' ? '3.5' : '2.4'}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Garis Sutur Internal Amerika Utara (Persis Screenshot 3) */}
            <path d="M 152 125 C 158 165, 162 210, 168 250" fill="none" stroke={colors.suture} strokeWidth="1.4" opacity="0.6" />
            <path d="M 118 190 C 138 210, 158 230, 172 270" fill="none" stroke={colors.suture} strokeWidth="1.4" opacity="0.6" />

            <text x="135" y="240" fill="#0f172a" fontSize="15" fontWeight="800" textAnchor="middle">
              North
            </text>
            <text x="135" y="260" fill="#0f172a" fontSize="15" fontWeight="800" textAnchor="middle">
              America
            </text>
          </g>

          {/* ── 3. SOUTH AMERICA (Kiri Bawah Pangea, Mengunci dengan Afrika) ── */}
          <g
            onMouseEnter={() => setSelectedPlate('southAmerica')}
            onMouseLeave={() => setSelectedPlate(null)}
            onClick={() => setSelectedPlate('southAmerica')}
            className="cursor-pointer transition-all"
          >
            <path
              d="M 158 340 
                 C 128 345, 102 360, 88 390 
                 C 78 430, 82 470, 98 510 
                 C 112 545, 132 570, 152 580 
                 C 168 580, 178 570, 182 555 
                 C 188 525, 192 490, 198 460 
                 C 212 440, 228 420, 232 395 
                 C 228 370, 208 355, 188 345 
                 C 172 340, 158 340, 158 340 Z"
              fill={selectedPlate === 'southAmerica' ? colors.landHover : colors.land}
              stroke={selectedPlate === 'southAmerica' ? colors.strokeHover : colors.stroke}
              strokeWidth={selectedPlate === 'southAmerica' ? '3.5' : '2.4'}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Garis Sutur Internal Amerika Selatan (Persis Screenshot 3) */}
            <path d="M 138 370 C 148 420, 152 480, 148 540" fill="none" stroke={colors.suture} strokeWidth="1.4" opacity="0.6" />

            <text x="145" y="440" fill="#0f172a" fontSize="15" fontWeight="800" textAnchor="middle">
              South
            </text>
            <text x="145" y="460" fill="#0f172a" fontSize="15" fontWeight="800" textAnchor="middle">
              America
            </text>
          </g>

          {/* ── 4. AFRICA (Pusat Poros Tengah Pangea) ── */}
          <g
            onMouseEnter={() => setSelectedPlate('africa')}
            onMouseLeave={() => setSelectedPlate(null)}
            onClick={() => setSelectedPlate('africa')}
            className="cursor-pointer transition-all"
          >
            <path
              d="M 188 345 
                 C 198 320, 212 280, 222 245 
                 C 238 235, 258 235, 278 245 
                 C 298 255, 322 280, 342 320 
                 C 358 360, 368 400, 358 440 
                 C 348 460, 328 480, 308 500 
                 C 288 520, 262 535, 238 545 
                 C 222 545, 208 530, 198 495 
                 C 202 460, 218 435, 232 395 
                 C 228 370, 208 355, 188 345 Z"
              fill={selectedPlate === 'africa' ? colors.landHover : colors.land}
              stroke={selectedPlate === 'africa' ? colors.strokeHover : colors.stroke}
              strokeWidth={selectedPlate === 'africa' ? '3.5' : '2.4'}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Garis Sutur Internal Afrika (Persis Screenshot 3) */}
            <path d="M 252 240 C 262 300, 278 370, 288 440" fill="none" stroke={colors.suture} strokeWidth="1.4" opacity="0.6" />
            <path d="M 288 320 C 308 360, 318 410, 322 460" fill="none" stroke={colors.suture} strokeWidth="1.4" opacity="0.6" />

            <text x="275" y="400" fill="#0f172a" fontSize="17" fontWeight="800" textAnchor="middle">
              Africa
            </text>
          </g>

          {/* ── 5. INDIA (Kepingan Sudut di antara Afrika & Antartika) ── */}
          <g
            onMouseEnter={() => setSelectedPlate('india')}
            onMouseLeave={() => setSelectedPlate(null)}
            onClick={() => setSelectedPlate('india')}
            className="cursor-pointer transition-all"
          >
            <path
              d="M 358 440 
                 C 348 465, 332 485, 318 505 
                 C 332 520, 352 530, 372 525 
                 C 382 495, 378 465, 358 440 Z"
              fill={selectedPlate === 'india' ? colors.landHover : colors.land}
              stroke={selectedPlate === 'india' ? colors.strokeHover : colors.stroke}
              strokeWidth={selectedPlate === 'india' ? '3.5' : '2.4'}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <text x="352" y="490" fill="#0f172a" fontSize="12" fontWeight="800" textAnchor="middle">
              India
            </text>
          </g>

          {/* ── 6. ANTARCTICA (Kutub Selatan Pangea / Lengkungan Bawah) ── */}
          <g
            onMouseEnter={() => setSelectedPlate('antarctica')}
            onMouseLeave={() => setSelectedPlate(null)}
            onClick={() => setSelectedPlate('antarctica')}
            className="cursor-pointer transition-all"
          >
            <path
              d="M 182 555 
                 C 188 560, 202 560, 218 550 
                 C 238 545, 268 530, 292 520 
                 C 318 505, 342 515, 372 525 
                 C 392 525, 412 535, 428 550 
                 C 422 575, 392 595, 348 605 
                 C 298 605, 242 595, 202 580 
                 C 188 570, 182 560, 182 555 Z"
              fill={selectedPlate === 'antarctica' ? colors.landHover : colors.land}
              stroke={selectedPlate === 'antarctica' ? colors.strokeHover : colors.stroke}
              strokeWidth={selectedPlate === 'antarctica' ? '3.5' : '2.4'}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Garis Sutur Transantarktika (Persis Screenshot 3) */}
            <path d="M 258 560 C 288 570, 328 575, 368 565" fill="none" stroke={colors.suture} strokeWidth="1.4" opacity="0.6" />

            <text x="295" y="575" fill="#0f172a" fontSize="16" fontWeight="800" textAnchor="middle">
              Antarctica
            </text>
          </g>

          {/* ── 7. AUSTRALIA (Tenggara Pangea Menempel di Antartika) ── */}
          <g
            onMouseEnter={() => setSelectedPlate('australia')}
            onMouseLeave={() => setSelectedPlate(null)}
            onClick={() => setSelectedPlate('australia')}
            className="cursor-pointer transition-all"
          >
            <path
              d="M 372 525 
                 C 392 525, 412 535, 428 550 
                 C 452 560, 478 545, 482 515 
                 C 472 480, 452 455, 422 445 
                 C 402 455, 382 485, 372 525 Z"
              fill={selectedPlate === 'australia' ? colors.landHover : colors.land}
              stroke={selectedPlate === 'australia' ? colors.strokeHover : colors.stroke}
              strokeWidth={selectedPlate === 'australia' ? '3.5' : '2.4'}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Garis Sutur Internal Australia (Persis Screenshot 3) */}
            <path d="M 422 450 C 438 485, 448 520, 452 550" fill="none" stroke={colors.suture} strokeWidth="1.4" opacity="0.6" />

            <g transform="translate(432, 508) rotate(-35)">
              <text x="0" y="0" fill="#0f172a" fontSize="14" fontWeight="800" textAnchor="middle">
                Australia
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* Bottom Interactive Educational Banner */}
      <div className="w-full bg-[#0f172a] border-2 border-emerald-500/60 rounded-xl p-3 sm:p-3.5 text-slate-200 z-10 flex items-center justify-between gap-3 shadow-lg">
        {activePlateInfo ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 animate-fadeIn w-full">
            <span className="px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-[13px] sm:text-[15px] border border-emerald-500/50 whitespace-nowrap shadow-sm">
              {activePlateInfo.title}
            </span>
            <span className="text-slate-100 font-medium text-[13px] sm:text-[15px] leading-relaxed">
              {activePlateInfo.desc}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 text-slate-200 font-semibold text-[13px] sm:text-[15px]">
            <PixelIcon name="bulb" size={18} className="text-amber-400 shrink-0" />
            <span className="text-amber-400 font-bold text-[13px] sm:text-[15px]">PETUNJUK:</span>
            <span>Arahkan kursor atau sentuh tiap benua di atas untuk mempelajari kepingan Pangea!</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN: REALISTIK 3D ISOMETRIK BATAS KONVERGEN (SUBDUKSI LEMPENG)
// Model Blok 3D Pejal Kedap Celah (Watertight Solid 3D Cutaway Block)
// Animasi 60 FPS: Lempeng Saling Menumbuk, Menunjam ke Bawah & Melebur Magma
// ═════════════════════════════════════════════════════════════════════════════
export function ConvergentSubductionIllustration() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [animTime, setAnimTime] = useState(0);

  // Siklus Tektonik Otomatis 8000 ms:
  // 0 - 2400ms (0 - 30%): Tahap 1 - Kedua lempeng bergerak saling mendekat & bertabrakan
  // 2400 - 5400ms (30 - 67.5%): Tahap 2 - Lempeng samudra yang berat menunjam ke bawah astenosfer & palung terbentuk
  // 5400 - 7200ms (67.5 - 90%): Tahap 3 - Peleburan magma di mantel dalam, magma naik & letusan gunung api
  // 7200 - 8000ms (90 - 100%): Tahap 4 - Transisi mulus reset siklus alami
  useEffect(() => {
    let animId: number;
    let lastNow = performance.now();

    const loop = (now: number) => {
      const dt = now - lastNow;
      lastNow = now;

      if (isPlaying) {
        setAnimTime((prev) => (prev + dt) % 8000);
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  const handleTriggerSubduction = () => {
    retroAudio.playExplosion();
    setAnimTime(2400);
    setIsPlaying(true);
  };

  const t = animTime;
  const isApproaching = t < 2400;
  const isSubducting = t >= 2400 && t < 5400;
  const isMelting = t >= 5400 && t < 7200;
  const isResetting = t >= 7200;

  // 1. Kedalaman Penunjaman Lempeng Samudra (Subduction Depth 0 -> 1)
  let subduct = 0;
  if (isApproaching) {
    subduct = t > 1600 ? ((t - 1600) / 800) * 0.08 : 0;
  } else if (isSubducting) {
    const p = (t - 2400) / 3000;
    subduct = 0.08 + 0.92 * (0.5 - 0.5 * Math.cos(p * Math.PI));
  } else if (isMelting) {
    subduct = 1;
  } else if (isResetting) {
    const p = (t - 7200) / 800;
    subduct = 0.5 + 0.5 * Math.cos(p * Math.PI);
  }

  // 2. Elevasi Terangkatnya Gunung Api Benua (Orogenic Uplift)
  const mountainLift = subduct * 16;

  // 3. Peleburan Magma & Erupsi Vulkanik
  let magmaIntensity = 0;
  let ashPlumeScale = 0;
  if (isSubducting) {
    const p = (t - 2400) / 3000;
    magmaIntensity = p > 0.55 ? (p - 0.55) / 0.45 : 0;
  } else if (isMelting) {
    magmaIntensity = 1;
    ashPlumeScale = Math.min(1, (t - 5400) / 450);
  } else if (isResetting) {
    const p = (t - 7200) / 800;
    magmaIntensity = Math.max(0, 1 - p * 2);
    ashPlumeScale = Math.max(0, 1 - p * 2);
  }

  // Posisi Gelembung Magma Naik Melalui Diapir / Pipa Vulkanik
  const magmaBubbleY1 = 205 - ((t * 0.055) % 80);
  const magmaBubbleY2 = 205 - (((t * 0.055) + 40) % 80);

  // Status & Label HUD
  let statusBadge = '1. TUMBUKAN LEMPENG (SALING MENDEKATI & BERTABRAKAN)';
  let badgeStyle = 'text-cyan-300 bg-cyan-950/80 border-cyan-500/70';
  let dotAnim = 'bg-cyan-400 animate-pulse';

  if (isSubducting) {
    statusBadge = '2. PENUNJAMAN LEMPENG SAMUDRA KE BAWAH LEMPENG BENUA';
    badgeStyle = 'text-amber-300 bg-amber-950/80 border-amber-500/80 shadow-[0_0_10px_rgba(245,158,11,0.5)]';
    dotAnim = 'bg-amber-400 animate-ping';
  } else if (isMelting) {
    statusBadge = '3. PELEBURAN MAGMA DI MANTEL & LETUSAN GUNUNG API';
    badgeStyle = 'text-rose-200 bg-rose-950/90 border-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.6)] animate-pulse';
    dotAnim = 'bg-rose-400 animate-ping';
  } else if (isResetting) {
    statusBadge = 'SIKLUS TEKTONIK SUBDUKSI BERULANG SECARA ALAMI';
    badgeStyle = 'text-emerald-300 bg-emerald-950/80 border-emerald-500/70';
    dotAnim = 'bg-emerald-400';
  }

  // Koordinat Ujung Slab yang Menunjam (Dijaga selalu di dalam blok pejal Y <= 242 < 265)
  const tipX = 240 + subduct * 115;
  const tipY = 173 + subduct * 68;

  // Variasi Kedalaman Palung
  const trenchDepth = subduct * 14;

  // Posisi Puncak Kawah Gunung Api 3D
  const volcanoPeakX = 350;
  const volcanoPeakY = 104 - mountainLift;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between bg-[#050811] select-none font-pixel overflow-hidden">
      {/* ── TOP CONTROL & STATUS HEADER (TANPA TAB SELECTOR) ── */}
      <div className="w-full flex items-center justify-between px-3 py-2 bg-slate-950/95 border-b border-amber-800/60 z-20 shadow-md gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-amber-300 font-pixel-title text-[13px] sm:text-[15px] font-bold flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            DINAMIKA BATAS KONVERGEN: SUBDUKSI
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className={`px-2.5 py-1 rounded-full border text-[13.5px] sm:text-[13px] font-bold flex items-center gap-1.5 ${badgeStyle}`}>
            <span className={`w-2 h-2 rounded-full ${dotAnim}`} />
            <span>{statusBadge}</span>
          </div>

          <button
            onClick={handleTriggerSubduction}
            className="px-3 py-1 rounded bg-amber-600 hover:bg-amber-500 text-slate-950 text-[13px] font-bold transition-all active:scale-95 border border-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)] cursor-pointer hidden sm:flex items-center gap-1"
            title="Klik untuk memicu proses penunjaman dan peleburan magma"
          >
            <span>Picu Subduksi</span>
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[13px] font-bold border border-slate-600 transition-all cursor-pointer"
          >
            {isPlaying ? '⏸ Jeda' : '▶ Putar'}
          </button>
        </div>
      </div>

      {/* ── FULL-HEIGHT 3D ISOMETRIC SOLID BLOCK CANVAS (60 FPS) ── */}
      <div className="w-full flex-1 min-h-0 relative flex items-center justify-center overflow-hidden">
        <svg
          viewBox="0 0 640 280"
          className="w-full h-full object-contain drop-shadow-2xl"
          shapeRendering="geometricPrecision"
        >
          <defs>
            {/* Langit Latar Belakang */}
            <linearGradient id="skyConvGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#020617" />
              <stop offset="60%" stopColor="#0b1329" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            {/* Air Samudra (Permukaan Atas 3D) */}
            <linearGradient id="oceanSurfaceGrad" x1="0" y1="0" x2="1" y2="0.6">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="60%" stopColor="#0369a1" />
              <stop offset="100%" stopColor="#075985" />
            </linearGradient>

            {/* Kerak Samudra (Lapisan Hijau Basaltik sesuai Gambar Referensi) */}
            <linearGradient id="oceanCrustGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            {/* Litosfer Mantel Samudra (Lapisan Cokelat Litosfer) */}
            <linearGradient id="oceanLithoGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#78350f" />
              <stop offset="100%" stopColor="#5c260a" />
            </linearGradient>

            {/* Astenosfer (Mantel Panas Merah-Oranye Sesuai Gambar Referensi) */}
            <linearGradient id="astheGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ea580c" />
              <stop offset="40%" stopColor="#dc2626" />
              <stop offset="80%" stopColor="#991b1b" />
              <stop offset="100%" stopColor="#450a0a" />
            </linearGradient>

            {/* Kerak Benua (Lapisan Pasir/Granit Cokelat Muda Berbatu Sesuai Gambar Referensi) */}
            <linearGradient id="contCrustGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="50%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#92400e" />
            </linearGradient>

            {/* Permukaan Atas Daratan Benua 3D */}
            <linearGradient id="contTopSurfaceGrad" x1="0" y1="0" x2="1" y2="0.5">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="45%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>

            {/* Lereng Gunung Api Sisi Terang (Barat) */}
            <linearGradient id="volcanoWestGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            {/* Lereng Gunung Api Sisi Bayangan (Timur) */}
            <linearGradient id="volcanoEastGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>

            {/* Dinding Potongan Samping Kanan (3D Side Face) */}
            <linearGradient id="sideCrustGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
            <linearGradient id="sideLithoGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#5c260a" />
              <stop offset="100%" stopColor="#351404" />
            </linearGradient>
            <linearGradient id="sideAstheGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#b91c1c" />
              <stop offset="100%" stopColor="#7f1d1d" />
            </linearGradient>

            {/* Kantung Magma Melebur & Pipa Saluran Vulkanik */}
            <radialGradient id="magmaChamberGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#fef08a" />
              <stop offset="60%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
            </radialGradient>

            {/* Asap Vulkanik Gunung Berapi */}
            <linearGradient id="volcanoAshGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#475569" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#94a3b8" stopOpacity="0" />
            </linearGradient>

            {/* Glow Filter */}
            <filter id="convGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Shadow Blok 3D */}
            <filter id="convBlockShadow" x="-10%" y="-10%" width="125%" height="130%">
              <feDropShadow dx="0" dy="14" stdDeviation="12" floodColor="#000000" floodOpacity="0.85" />
            </filter>
          </defs>

          {/* Latar Belakang Kanvas */}
          <rect width="640" height="280" fill="url(#skyConvGrad)" />

          {/* Bayangan Blok Geologis 3D di Bagian Bawah (Kedap Celah) */}
          <polygon
            points="55,270 495,270 610,215 170,215"
            fill="#020617"
            opacity="0.8"
            filter="url(#convBlockShadow)"
          />

          {/* ══════════════════════════════════════════════════════════════════
              1. ASTENOSFER (MANTEL BUMI PANAS PEJAL - LAPISAN DASAR DI BAWAH)
              Terpasang solid dari X=65 sampai X=485, Y=195 sampai Y=265
              ══════════════════════════════════════════════════════════════════ */}
          <g id="asthenosphere-mantle">
            <polygon
              points="65,195 485,195 485,265 65,265"
              fill="url(#astheGrad)"
              stroke="#450a0a"
              strokeWidth="0.8"
            />
            {/* Gelombang Arus Konveksi Panas Mantel */}
            <path
              d="M 85,220 Q 140,240 200,225 Q 260,210 320,230 Q 380,250 440,235"
              fill="none"
              stroke="#fb923c"
              strokeWidth="1.5"
              opacity="0.3"
            />
            <path
              d="M 110,245 Q 170,255 230,240 Q 290,225 350,245 Q 410,260 470,245"
              fill="none"
              stroke="#fca5a5"
              strokeWidth="1.2"
              opacity="0.25"
            />
          </g>

          {/* ══════════════════════════════════════════════════════════════════
              2. PENAMPANG DEPAN: LEMPENG BENUA (LITOSFER & KERAK BENUA)
              Rapat presisi dari garis pantai X=240 sampai dinding kanan X=485
              ══════════════════════════════════════════════════════════════════ */}
          <g id="continental-plate-cross-section">
            {/* Litosfer Mantel Benua (Cokelat Tua) */}
            <polygon
              points="240,188 485,188 485,195 240,195"
              fill="#5c260a"
              stroke="#351404"
              strokeWidth="0.8"
            />

            {/* Kerak Benua Tebal (Cokelat Muda / Tan) */}
            <polygon
              points="240,145 485,145 485,188 240,188"
              fill="url(#contCrustGrad)"
              stroke="#78350f"
              strokeWidth="0.8"
            />

            {/* Tekstur Batuan Granit & Lapisan Geologis Benua */}
            <line x1="245" y1="162" x2="480" y2="162" stroke="#f59e0b" strokeWidth="1" opacity="0.35" strokeDasharray="6 3" />
            <line x1="245" y1="176" x2="480" y2="176" stroke="#fef08a" strokeWidth="0.8" opacity="0.3" />
          </g>

          {/* ══════════════════════════════════════════════════════════════════
              3. PENAMPANG DEPAN: LEMPENG SAMUDRA & SLAB MENUNJAM KE BAWAH
              Air rapat presisi ke garis pantai X=240, Y=145 tanpa celah/takikan!
              ══════════════════════════════════════════════════════════════════ */}
          <g id="oceanic-plate-cross-section">
            {/* Air Samudra (Potongan Depan) - Rapat sempurna ke X=240 */}
            <polygon
              points="65,145 240,145 240,161 65,161"
              fill="#0284c7"
              stroke="#0369a1"
              strokeWidth="0.8"
            />

            {/* Kerak Samudra (Lapisan Hijau Basaltik) yang Menunjam ke Bawah */}
            <path
              d={`
                M 65,161 
                L 215,161 
                Q 240,${162 + trenchDepth * 0.4} ${tipX},${tipY} 
                L ${tipX - 7},${tipY + 10} 
                Q 235,${174 + trenchDepth * 0.4} 215,173 
                L 65,173 
                Z
              `}
              fill="url(#oceanCrustGrad)"
              stroke="#065f46"
              strokeWidth="1"
            />

            {/* Litosfer Mantel Samudra (Lapisan Cokelat Litosfer) di Bawah Kerak */}
            <path
              d={`
                M 65,173 
                L 215,173 
                Q 235,${174 + trenchDepth * 0.4} ${tipX - 7},${tipY + 10} 
                L ${tipX - 18},${tipY + 24} 
                Q 230,${194 + trenchDepth * 0.4} 215,195 
                L 65,195 
                Z
              `}
              fill="url(#oceanLithoGrad)"
              stroke="#451a03"
              strokeWidth="1"
            />

            {/* Panah Dinamis pada Slab yang Menunjam ke Bawah-Kanan */}
            {subduct > 0.35 && (
              <g
                transform={`translate(${245 + subduct * 50}, ${182 + subduct * 30}) rotate(30)`}
                filter="url(#convGlow)"
              >
                <polygon
                  points="0,-4 14,-4 14,-8 24,0 14,8 14,4 0,4"
                  fill="#facc15"
                  stroke="#78350f"
                  strokeWidth="1.2"
                />
              </g>
            )}
          </g>

          {/* ══════════════════════════════════════════════════════════════════
              4. PELEBURAN MAGMA & PIPA SALURAN VULKANIK KE GUNUNG API
              ══════════════════════════════════════════════════════════════════ */}
          {magmaIntensity > 0.05 && (
            <g id="magma-melting-system" opacity={magmaIntensity}>
              {/* Kantung Peleburan Magma Primer di Atas Slab Menunjam */}
              <ellipse
                cx="320"
                cy="208"
                rx="22"
                ry="12"
                fill="url(#magmaChamberGlow)"
                filter="url(#convGlow)"
              />
              <ellipse
                cx="320"
                cy="208"
                rx="12"
                ry="6"
                fill="#ffffff"
                filter="url(#convGlow)"
              />

              {/* Saluran Pipa Magma Menembus Kerak Benua Menuju Gunung Api */}
              <path
                d={`
                  M 320,202 
                  Q 335,165 ${volcanoPeakX},${volcanoPeakY + 25} 
                  L ${volcanoPeakX},${volcanoPeakY + 5}
                `}
                fill="none"
                stroke="#f97316"
                strokeWidth="5"
                strokeLinecap="round"
                filter="url(#convGlow)"
              />
              <path
                d={`
                  M 320,202 
                  Q 335,165 ${volcanoPeakX},${volcanoPeakY + 25} 
                  L ${volcanoPeakX},${volcanoPeakY + 5}
                `}
                fill="none"
                stroke="#fef08a"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Gelembung Magma Pijar yang Bergerak Naik */}
              <circle
                cx={328 + (1 - (magmaBubbleY1 - 125) / 80) * 17}
                cy={magmaBubbleY1}
                r="3.5"
                fill="#ffffff"
                filter="url(#convGlow)"
              />
              <circle
                cx={328 + (1 - (magmaBubbleY2 - 125) / 80) * 17}
                cy={magmaBubbleY2}
                r="3"
                fill="#fef08a"
                filter="url(#convGlow)"
              />

              {/* Dapur Magma Sekunder di Bawah Gunung Api */}
              <ellipse
                cx={volcanoPeakX}
                cy={volcanoPeakY + 35}
                rx="15"
                ry="8"
                fill="url(#magmaChamberGlow)"
                filter="url(#convGlow)"
              />
            </g>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              5. PERMUKAAN ATAS ISOMETRIK 3D (OCEAN, TRENCH & CONTINENT)
              100% Solid & Kedap Celah (Unbroken Watertight Surfaces)
              ══════════════════════════════════════════════════════════════════ */}
          {/* A. Permukaan Air Samudra 3D (Sisi Kiri) */}
          <polygon
            points="65,145 180,90 355,90 240,145"
            fill="url(#oceanSurfaceGrad)"
            stroke="#0369a1"
            strokeWidth="1"
          />

          {/* Garis Gelombang Samudra Halus */}
          <line x1="95" y1="130" x2="185" y2="130" stroke="#38bdf8" strokeWidth="1.2" opacity="0.6" />
          <line x1="140" y1="112" x2="235" y2="112" stroke="#7dd3fc" strokeWidth="1" opacity="0.5" />
          <line x1="190" y1="98" x2="280" y2="98" stroke="#bae6fd" strokeWidth="0.8" opacity="0.4" />

          {/* Panah Samudra Bergerak ke Kanan (Tumbukan) */}
          <g transform="translate(155, 118)">
            <polygon
              points="0,-4 20,-4 20,-9 32,0 20,9 20,4 0,4"
              fill="#dc2626"
              stroke="#7f1d1d"
              strokeWidth="1.2"
              filter="url(#convGlow)"
            />
          </g>

          {/* B. Palung Laut (Garis Batas Pertemuan Lempeng Rapat & Arsir Kedalaman) */}
          <line x1="240" y1="145" x2="355" y2="90" stroke="#0369a1" strokeWidth="2" />
          <line x1="250" y1="140" x2="256" y2="143" stroke="#38bdf8" strokeWidth="1.2" opacity="0.8" />
          <line x1="270" y1="130" x2="276" y2="133" stroke="#38bdf8" strokeWidth="1.2" opacity="0.8" />
          <line x1="290" y1="120" x2="296" y2="123" stroke="#38bdf8" strokeWidth="1.2" opacity="0.8" />
          <line x1="310" y1="110" x2="316" y2="113" stroke="#38bdf8" strokeWidth="1.2" opacity="0.8" />
          <line x1="330" y1="100" x2="336" y2="103" stroke="#38bdf8" strokeWidth="1.2" opacity="0.8" />

          {/* C. Permukaan Dasar Daratan Benua 3D (Solid Quad Tanpa Celah, Rapat ke X=240) */}
          <polygon
            points="240,145 355,90 600,90 485,145"
            fill="url(#contTopSurfaceGrad)"
            stroke="#b45309"
            strokeWidth="1"
          />

          {/* D. Tubuh Kerucut Gunung Berapi 3D di Atas Daratan Benua (Simetris & Bersih) */}
          {/* Lereng Belakang Kerucut Gunung Api (Menghubungkan ke Puncak tanpa Sirip Liar) */}
          <path
            d={`
              M ${volcanoPeakX - 11},${volcanoPeakY} 
              Q ${volcanoPeakX},${volcanoPeakY - 4} ${volcanoPeakX + 11},${volcanoPeakY} 
              L 395,134 
              Q ${volcanoPeakX},116 295,134 
              Z
            `}
            fill="#854d0e"
            opacity="0.9"
          />

          {/* Lereng Barat Gunung Api (Sisi Terang Menghadap Samudra) */}
          <path
            d={`
              M ${volcanoPeakX - 11},${volcanoPeakY} 
              L 295,134 
              Q ${volcanoPeakX},150 ${volcanoPeakX},145 
              L ${volcanoPeakX},${volcanoPeakY + 4} 
              Z
            `}
            fill="url(#volcanoWestGrad)"
            stroke="#b45309"
            strokeWidth="0.8"
          />

          {/* Lereng Timur Gunung Api (Sisi Bayangan Menghadap Daratan) */}
          <path
            d={`
              M ${volcanoPeakX},${volcanoPeakY + 4} 
              L ${volcanoPeakX},145 
              Q ${volcanoPeakX},150 395,134 
              L ${volcanoPeakX + 11},${volcanoPeakY} 
              Z
            `}
            fill="url(#volcanoEastGrad)"
            stroke="#78350f"
            strokeWidth="0.8"
          />

          {/* Kawah Gunung Berapi di Puncak */}
          <ellipse
            cx={volcanoPeakX}
            cy={volcanoPeakY}
            rx="11"
            ry="5"
            fill={magmaIntensity > 0.3 ? '#ef4444' : '#451a03'}
            stroke="#991b1b"
            strokeWidth="1.2"
          />
          {magmaIntensity > 0.3 && (
            <ellipse
              cx={volcanoPeakX}
              cy={volcanoPeakY}
              rx="6.5"
              ry="2.8"
              fill="#fef08a"
              filter="url(#convGlow)"
            />
          )}

          {/* Letusan & Semburan Asap Vulkanik di Puncak Gunung */}
          {ashPlumeScale > 0.05 && (
            <g transform={`translate(${volcanoPeakX}, ${volcanoPeakY}) scale(${ashPlumeScale})`}>
              <ellipse cx="0" cy="-16" rx="13" ry="16" fill="url(#volcanoAshGrad)" />
              <ellipse cx="-7" cy="-28" rx="15" ry="13" fill="#334155" opacity="0.75" />
              <ellipse cx="7" cy="-32" rx="17" ry="14" fill="#475569" opacity="0.7" />
              <ellipse cx="0" cy="-45" rx="20" ry="15" fill="#64748b" opacity="0.5" />
              <circle cx="-3" cy="-5" r="2.5" fill="#facc15" filter="url(#convGlow)" />
              <circle cx="4" cy="-8" r="2" fill="#ef4444" filter="url(#convGlow)" />
            </g>
          )}

          {/* Panah Benua Bergerak ke Kiri (Tumbukan) */}
          <g transform="translate(470, 115)">
            <polygon
              points="0,-4 -20,-4 -20,-9 -32,0 -20,9 -20,4 0,4"
              fill="#dc2626"
              stroke="#7f1d1d"
              strokeWidth="1.2"
              filter="url(#convGlow)"
            />
          </g>

          {/* ══════════════════════════════════════════════════════════════════
              6. POTONGAN SAMPING KANAN BLOK 3D (SOLID WATERTIGHT SIDE FACE)
              Terpasang solid dari X=485 sampai X=600, menempel sempurna ke penampang depan
              ══════════════════════════════════════════════════════════════════ */}
          <g id="right-side-3d-cutaway">
            {/* Kerak Benua Samping Kanan */}
            <polygon
              points="485,145 600,90 600,133 485,188"
              fill="url(#sideCrustGrad)"
              stroke="#451a03"
              strokeWidth="0.8"
            />
            {/* Litosfer Mantel Samping Kanan */}
            <polygon
              points="485,188 600,133 600,140 485,195"
              fill="url(#sideLithoGrad)"
              stroke="#351404"
              strokeWidth="0.8"
            />
            {/* Astenosfer Samping Kanan */}
            <polygon
              points="485,195 600,140 600,210 485,265"
              fill="url(#sideAstheGrad)"
              stroke="#450a0a"
              strokeWidth="0.8"
            />
          </g>

          {/* ══════════════════════════════════════════════════════════════════
              7. INDIKATOR TITIK GEMPA MEGATHRUST
              ══════════════════════════════════════════════════════════════════ */}
          {subduct > 0.25 && (
            <g id="megathrust-hypocenters">
              <circle
                cx={240 + subduct * 26}
                cy={175 + subduct * 15}
                r="4.5"
                fill="#ffffff"
                stroke="#ef4444"
                strokeWidth="1.5"
                className="animate-ping"
              />
              <circle
                cx={240 + subduct * 26}
                cy={175 + subduct * 15}
                r="3"
                fill="#facc15"
              />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}

// 5. SUB-KOMPONEN: TIGA BENTANG ALAM GEOLOGIS HASIL TUMBUKAN KONVERGEN
// ═════════════════════════════════════════════════════════════════════════════
// 5. DATA & SUB-KOMPONEN: TIGA BENTANG ALAM GEOLOGIS HASIL TUMBUKAN KONVERGEN
// ═════════════════════════════════════════════════════════════════════════════
export const CONVERGENT_LANDFORMS_DATA = {
  trench: {
    tabLabel: '1. PALUNG LAUT',
    title: '1. PALUNG LAUT DALAM (DEEP SEA TRENCH)',
    subtitle: 'Ngarai Dasar Laut Terdalam di Bumi',
    points: [
      { icon: 'arrow-down', text: 'Terbentuk saat lempeng samudra yang berat menunjam curam ke bawah lempeng benua.' },
      { icon: 'search', text: 'Kedalaman 7.000 - 11.000 m! Palung Mariana adalah titik terdalam di dunia (11.034 m).' },
      { icon: 'bulb', text: 'Fakta: Gunung Everest (8.848 m) masih tenggelam >2.000 m jika dimasukkan ke palung ini!' },
    ],
  },
  mountains: {
    tabLabel: '2. PEGUNUNGAN',
    title: '2. RANTAI PEGUNUNGAN LIPATAN (FOLDED MOUNTAINS)',
    subtitle: 'Daratan Terangkat Akibat Tumbukan Lempeng',
    points: [
      { icon: 'layers', text: 'Dua lempeng saling menekan kuat, meremas dan melipat lapisan batuan kerak benua ke atas.' },
      { icon: 'flag', text: 'Puncak lipatan disebut Antiklin, sedangkan lembah cekungannya disebut Sinklin.' },
      { icon: 'check', text: 'Contoh nyata: Pegunungan Bukit Barisan di Sumatra dan Pegunungan Himalaya di Asia.' },
    ],
  },
  volcano: {
    tabLabel: '3. GUNUNG BERAPI',
    title: '3. BUSUR GUNUNG BERAPI AKTIF (VOLCANIC ARC)',
    subtitle: 'Jalur Erupsi Magma Peleburan Lempeng',
    points: [
      { icon: 'zap', text: 'Lempeng yang menunjam meleleh di mantel bumi bersuhu >1.200°C menjadi batuan cair (magma).' },
      { icon: 'arrow-up', text: 'Magma panas yang lebih ringan mendesak naik ke permukaan membentuk kantung magma.' },
      { icon: 'shield', text: 'Melahirkan jalur gunung berapi aktif Nusantara seperti Gunung Merapi, Semeru, & Krakatau.' },
    ],
  },
};

function ConvergentLandformsIllustration({
  selectedLandform = 'trench',
  onSelectLandform,
}: {
  selectedLandform?: 'trench' | 'mountains' | 'volcano';
  onSelectLandform?: (lf: 'trench' | 'mountains' | 'volcano') => void;
}) {
  const [internalLandform, setInternalLandform] = useState<'trench' | 'mountains' | 'volcano'>('trench');
  const activeLandform = onSelectLandform ? selectedLandform : internalLandform;
  const handleSelect = (lf: 'trench' | 'mountains' | 'volcano') => {
    retroAudio.playSelect();
    if (onSelectLandform) {
      onSelectLandform(lf);
    } else {
      setInternalLandform(lf);
    }
  };

  return (
    <div className="w-full h-full relative flex flex-col justify-between select-none">
      {/* Tab Switcher Top - Padding cukup agar tombol atas tidak terpotong */}
      <div className="w-full pt-2.5 px-2 sm:px-3 pb-2 flex items-center justify-between border-b border-slate-800 bg-slate-950/95 z-20 shrink-0 gap-1 overflow-x-auto">
        <span className="text-[13px] sm:text-[15px] font-pixel-title text-amber-400 font-bold shrink-0 flex items-center gap-1.5">
          <PixelIcon name="layers" size={14} className="text-amber-400" />
          <span className="hidden sm:inline">PILIH BENTANG ALAM:</span>
          <span className="sm:hidden">BENTANG ALAM:</span>
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => handleSelect('trench')}
            className={`px-3 py-1.5 rounded-lg text-[13px] sm:text-[14.5px] font-pixel-title cursor-pointer transition-colors border-2 ${activeLandform === 'trench'
              ? 'bg-cyan-600 text-white border-cyan-300 shadow-[0_2px_0_#083344]'
              : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200 hover:bg-slate-800'
              } font-semibold`}
          >
            [1. PALUNG LAUT]
          </button>
          <button
            onClick={() => handleSelect('mountains')}
            className={`px-3 py-1.5 rounded-lg text-[13px] sm:text-[14.5px] font-pixel-title cursor-pointer transition-colors border-2 ${activeLandform === 'mountains'
              ? 'bg-amber-600 text-white border-amber-300 shadow-[0_2px_0_#451a03]'
              : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200 hover:bg-slate-800'
              } font-semibold`}
          >
            [2. PEGUNUNGAN]
          </button>
          <button
            onClick={() => handleSelect('volcano')}
            className={`px-3 py-1.5 rounded-lg text-[13px] sm:text-[14.5px] font-pixel-title cursor-pointer transition-colors border-2 ${activeLandform === 'volcano'
              ? 'bg-rose-600 text-white border-rose-300 shadow-[0_2px_0_#4c0519]'
              : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200 hover:bg-slate-800'
              } font-semibold`}
          >
            [3. GUNUNG BERAPI]
          </button>
        </div>
      </div>

      {/* Main Illustration Canvas: Berganti Penuh Sesuai Tab Terpilih */}
      <div className="w-full flex-1 min-h-0 relative flex items-center justify-center overflow-hidden p-2 sm:p-4">
        {activeLandform === 'trench' && <TrenchIllustration />}
        {activeLandform === 'mountains' && <FoldedMountainsIllustration />}
        {activeLandform === 'volcano' && <VolcanoIllustration />}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GAMBAR 1: PALUNG LAUT DALAM (DEEP SEA TRENCH) — SESUAI 4 FOTO REFERENSI
// Kapal riset permukaan, jurang karang terjal, kapsul selam lampu sorot, skala kedalaman & komparasi Mt. Everest
// ─────────────────────────────────────────────────────────────────────────────
function TrenchIllustration() {
  return (
    <svg viewBox="0 0 560 250" className="w-full h-full object-contain" shapeRendering="geometricPrecision">
      <defs>
        {/* Sky gradient */}
        <linearGradient id="tSkyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#bae6fd" />
        </linearGradient>

        {/* Ocean water layers gradient */}
        <linearGradient id="tWaterGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="15%" stopColor="#0369a1" />
          <stop offset="40%" stopColor="#1e3a8a" />
          <stop offset="70%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>

        {/* Headlight cone of yellow research submersible */}
        <linearGradient id="subLightCone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
          <stop offset="40%" stopColor="#7dd3fc" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.05" />
        </linearGradient>

        {/* Continental rock wall gradient */}
        <linearGradient id="rockWallGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#44403c" />
          <stop offset="50%" stopColor="#292524" />
          <stop offset="100%" stopColor="#1c1917" />
        </linearGradient>

        {/* Mount Everest Underwater Depth Overlay Gradient */}
        <linearGradient id="everestDepthTint" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.1" />
          <stop offset="35%" stopColor="#0284c7" stopOpacity="0.25" />
          <stop offset="70%" stopColor="#0f172a" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#020617" stopOpacity="0.92" />
        </linearGradient>

        {/* Himalayan Rock Strata (Yellow Band) Gradient */}
        <linearGradient id="yellowBandGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a8a29e" />
          <stop offset="40%" stopColor="#d6d3d1" />
          <stop offset="70%" stopColor="#78716c" />
          <stop offset="100%" stopColor="#57534e" />
        </linearGradient>

        {/* Sunlit Snow Gradient */}
        <linearGradient id="sunlitSnowGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#f0f9ff" />
          <stop offset="100%" stopColor="#bae6fd" />
        </linearGradient>

        {/* Shaded Snow / Ice Gradient */}
        <linearGradient id="shadedIceGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
      </defs>

      {/* 1. Langit Permukaan Laut */}
      <rect x="0" y="0" width="560" height="38" fill="url(#tSkyGrad)" />
      {/* Matahari & Cahaya Permukaan */}
      <circle cx="280" cy="12" r="9" fill="#fef08a" />
      <circle cx="280" cy="12" r="16" fill="#fde047" opacity="0.3" />
      {/* Burung Camar Kecil */}
      <path d="M 120,12 Q 124,8 128,12 Q 132,8 136,12" fill="none" stroke="#0369a1" strokeWidth="1" />
      <path d="M 390,14 Q 394,10 398,14 Q 402,10 406,14" fill="none" stroke="#0369a1" strokeWidth="1" />

      {/* 2. Kolom Air Samudra Biru hingga Jurang Hitam */}
      <rect x="0" y="38" width="560" height="212" fill="url(#tWaterGrad)" />

      {/* Berkas Sinar Matahari Tembus Air (Sunbeams 0 - 200m) */}
      <polygon points="260,38 275,38 295,95 240,95" fill="#bae6fd" opacity="0.18" />
      <polygon points="285,38 298,38 340,95 290,95" fill="#bae6fd" opacity="0.15" />

      {/* Permukaan Air Laut Beriak */}
      <line x1="0" y1="38" x2="560" y2="38" stroke="#38bdf8" strokeWidth="1.5" />

      {/* 3. Kapal Riset Kelautan (Sesuai Foto Referensi 2) */}
      <g>
        {/* Lambung Kapal Putih & Garis Biru */}
        <polygon points="190,26 248,26 242,38 196,38" fill="#f8fafc" stroke="#0f172a" strokeWidth="1" />
        <line x1="192" y1="31" x2="246" y2="31" stroke="#1d4ed8" strokeWidth="1.5" />
        <line x1="196" y1="38" x2="242" y2="38" stroke="#dc2626" strokeWidth="1.5" />
        {/* Anjungan & Radar Kapal */}
        <rect x="202" y="18" width="22" height="8" fill="#f8fafc" stroke="#0f172a" strokeWidth="1" />
        <rect x="204" y="20" width="4" height="3" fill="#38bdf8" />
        <rect x="210" y="20" width="4" height="3" fill="#38bdf8" />
        <rect x="216" y="20" width="4" height="3" fill="#38bdf8" />
        <line x1="213" y1="18" x2="213" y2="12" stroke="#475569" strokeWidth="1" />
        <circle cx="213" cy="11" r="2" fill="#e2e8f0" />
        {/* Crane Belakang & Kabel Winch ke Laut */}
        <polygon points="234,26 238,18 240,18 238,26" fill="#334155" />
        <line x1="239" y1="18" x2="239" y2="135" stroke="#38bdf8" strokeWidth="1" opacity="0.6" />
        {/* Bendera Riset Merah Putih */}
        <rect x="200" y="14" width="4" height="2" fill="#ef4444" />
        <rect x="200" y="16" width="4" height="2" fill="#ffffff" />
      </g>

      {/* 4. Dinding Tebing Karang Ngarai Palung (Sesuai Foto Referensi 2 & 3) */}
      {/* Tebing Kiri: Landasan & Lereng Benua Curam */}
      <polygon
        points="55,55 110,65 145,100 170,140 195,190 220,246 0,246 0,55"
        fill="url(#rockWallGrad)"
        stroke="#1c1917"
        strokeWidth="1.5"
      />
      {/* Garis-Garis Fissure Batuan Karang Kiri */}
      <path d="M 60,65 L 105,72 L 135,115 L 165,155 L 190,210" fill="none" stroke="#57534e" strokeWidth="1" />
      <path d="M 95,95 L 125,105 L 140,145 L 175,195" fill="none" stroke="#1c1917" strokeWidth="1.5" />
      <text x="65" y="70" fill="#a8a29e" fontSize="6.5" fontWeight="bold">LANDASAN BENUA</text>
      <text x="105" y="115" fill="#78716c" fontSize="6" fontWeight="bold">LERENG BENUA</text>

      {/* Tebing Kanan: Lempeng Samudra & Ngarai Menjorok */}
      <polygon
        points="370,110 330,125 295,160 265,210 245,246 560,246 560,110"
        fill="url(#rockWallGrad)"
        stroke="#1c1917"
        strokeWidth="1.5"
      />
      {/* Fissure Batuan Tebing Kanan */}
      <path d="M 355,120 L 320,135 L 290,175 L 260,225" fill="none" stroke="#57534e" strokeWidth="1" />
      <path d="M 330,150 L 305,185 L 280,230" fill="none" stroke="#1c1917" strokeWidth="1.5" />

      {/* Dasar Palung Terdalam (V-Shaped Notch Abyss) */}
      <rect x="220" y="244" width="26" height="6" fill="#020617" />
      <line x1="220" y1="246" x2="246" y2="246" stroke="#0ea5e9" strokeWidth="1.5" />

      {/* 5. Lampu Sorot & Kapsul Selam Riset James Cameron (Foto Referensi 2) */}
      {/* Sorotan Lampu Menembus Jurang Gelap */}
      <polygon points="236,146 242,146 270,246 200,246" fill="url(#subLightCone)" />

      {/* Kapsul Selam Kuning (Deepsea Submersible) */}
      <g>
        <rect x="233" y="132" width="12" height="22" rx="5" fill="#facc15" stroke="#713f12" strokeWidth="1.2" />
        {/* Kubah Kaca Pengamat Cyan */}
        <circle cx="239" cy="138" r="3.5" fill="#38bdf8" stroke="#0284c7" strokeWidth="0.8" />
        <circle cx="238" cy="137" r="1" fill="#ffffff" />
        {/* Baling-Baling / Pendorong Samping */}
        <rect x="230" y="140" width="3" height="6" rx="1" fill="#475569" />
        <rect x="245" y="140" width="3" height="6" rx="1" fill="#475569" />
        {/* Lampu Sorot Ganda */}
        <circle cx="236" cy="146" r="1.5" fill="#fef08a" />
        <circle cx="242" cy="146" r="1.5" fill="#fef08a" />
      </g>

      {/* 6. Komparasi Gunung Everest Realistis (Sesuai Foto Referensi 3, 4, 5) */}
      <g id="realistic-mount-everest">
        {/* 1. Massive Mountain Base Silhouette (Wide Himalayan Triangle) */}
        <polygon
          points="
            390,78 
            410,95 435,120 460,150 485,185 515,220 530,246
            250,246 265,220 295,185 320,150 345,120 370,95
          "
          fill="#1e293b"
          stroke="#0f172a"
          strokeWidth="1.5"
        />

        {/* 2. Lower Mountain Flanks & Scree Slopes (Dark Rock Base with Snow Patches) */}
        <polygon
          points="250,246 530,246 500,205 440,195 380,210 320,195 270,215"
          fill="#0f172a"
        />
        {/* Lower Glacial Moraine Textures */}
        <polygon points="280,246 320,205 340,246" fill="#334155" opacity="0.7" />
        <polygon points="360,246 390,212 420,246" fill="#334155" opacity="0.7" />
        <polygon points="440,246 470,208 500,246" fill="#334155" opacity="0.7" />

        {/* 3. Broad North Face Mid-Slope Snowfields (Main Ice Body) */}
        <polygon
          points="
            370,95 390,78 410,95 
            425,125 450,165 470,210
            310,210 330,165 355,125
          "
          fill="url(#sunlitSnowGrad)"
        />

        {/* 4. East Face (Right Shaded Flank) */}
        <polygon
          points="390,78 410,95 425,125 450,165 470,210 505,215 485,185 460,150 435,120 410,95"
          fill="url(#shadedIceGrad)"
          opacity="0.85"
        />

        {/* 5. Famous Yellow Band Strata (Horizontal Limestone Cliff across face - Image 4) */}
        <polygon
          points="355,120 435,120 442,132 350,132"
          fill="url(#yellowBandGrad)"
          stroke="#44403c"
          strokeWidth="1"
        />
        {/* Second Step / Dark Rock Band below Yellow Band */}
        <polygon
          points="348,135 444,135 447,144 345,144"
          fill="#334155"
          stroke="#1e293b"
          strokeWidth="0.8"
        />

        {/* 6. Iconic Triangular Summit Horn Pyramid (Everest Peak) */}
        <polygon points="390,78 375,98 405,98" fill="#ffffff" />
        <polygon points="390,78 405,98 395,102 388,88" fill="#0f172a" opacity="0.65" />
        <polygon points="390,78 392,84 388,84" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.5" />

        {/* 7. Main Central Ridge (Northeast Ridge Divider line running down from summit) */}
        <path
          d="M 390,78 L 388,98 L 392,120 L 386,145 L 390,175 L 385,210 L 388,246"
          fill="none"
          stroke="#0f172a"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M 389,78 L 387,98 L 391,120 L 385,145 L 389,175 L 384,210 L 387,246"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* 8. Deep Vertical Snow Couloirs (Norton Couloir & Hornbein Couloir - Image 4) */}
        <path
          d="M 378,98 L 368,145 L 350,185 L 335,225"
          fill="none"
          stroke="#ffffff"
          strokeWidth="4.5"
          strokeLinecap="round"
          opacity="0.95"
        />
        <path
          d="M 378,98 L 368,145 L 350,185 L 335,225"
          fill="none"
          stroke="#e0f2fe"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M 365,115 L 348,155 L 328,195 L 310,235"
          fill="none"
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.9"
        />
        <path
          d="M 402,105 L 418,145 L 438,185 L 460,225"
          fill="none"
          stroke="#93c5fd"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.75"
        />

        {/* 9. Rocky Crags and Arêtes across North Face */}
        <polygon points="362,105 372,102 368,115 358,112" fill="#1e293b" />
        <polygon points="378,148 385,145 382,162 375,160" fill="#1e293b" />
        <polygon points="352,165 362,160 358,180 348,178" fill="#1e293b" />
        <polygon points="335,190 348,185 342,208 330,205" fill="#1e293b" />
        <polygon points="410,135 422,130 418,148 408,145" fill="#0f172a" />
        <polygon points="425,168 438,162 432,185 422,182" fill="#0f172a" />
        <polygon points="445,200 460,195 452,220 440,218" fill="#0f172a" />

        {/* 10. Atmospheric Depth Shading (Subtle Underwater Blend) */}
        <polygon
          points="
            390,78 
            410,95 435,120 460,150 485,185 515,220 530,246
            250,246 265,220 295,185 320,150 345,120 370,95
          "
          fill="url(#everestDepthTint)"
        />

        {/* 11. Horizontal Dashed Guide Line from Summit (Y=78) to Depth Ruler */}
        <line
          x1="55"
          y1="78"
          x2="390"
          y2="78"
          stroke="#38bdf8"
          strokeWidth="1.2"
          opacity="0.8"
        />

        {/* 12. Summit Elevation Point (Clean static golden dot without any smoke or pulsing) */}
        <circle cx="390" cy="78" r="3" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.2" />

        {/* 13. Information Callout Card above Summit */}
        <g id="everest-callout">
          <rect
            x="270"
            y="42"
            width="240"
            height="28"
            rx="4"
            fill="#082f49"
            stroke="#38bdf8"
            strokeWidth="1.5"
          />
          <text x="390" y="54" fill="#fef08a" fontSize="7" fontWeight="bold" textAnchor="middle">
            ▲ MT. EVEREST (8.848 m)
          </text>
          <text x="390" y="63" fill="#7dd3fc" fontSize="5.2" fontWeight="bold" textAnchor="middle">
            PUNCAK TERTINGGI BUMI TENGGELAM &gt;2.000 m DI PALUNG MARIANA!
          </text>
          <polygon points="386,70 394,70 390,76" fill="#38bdf8" />
        </g>
      </g>

      {/* 7. Biota Laut Dalam (Sesuai Foto Referensi 5) */}
      {/* Ikan Paus (Sperm Whale) di Zona Sedang */}
      <path d="M 85,75 Q 98,70 110,75 Q 115,80 110,83 Q 95,85 85,75 Z" fill="#334155" opacity="0.6" />
      {/* Ikan Sungut Ganda (Anglerfish) dengan Antena Pijar di Zona Gelap */}
      <g transform="translate(170, 160)">
        <ellipse cx="0" cy="0" rx="4" ry="3" fill="#3f3f46" />
        <path d="M 0,-3 Q 3,-6 5,-4" fill="none" stroke="#e4e4e7" strokeWidth="0.8" />
        <circle cx="5" cy="-4" r="1" fill="#fef08a" />
      </g>

      {/* 8. Skala Mistar Kedalaman di Sisi Kiri (Sesuai Foto Referensi 3 & 5) */}
      <g>
        {/* Garis Vertikal Mistar */}
        <line x1="30" y1="38" x2="30" y2="246" stroke="#94a3b8" strokeWidth="1" />

        {/* Tick 0 m */}
        <line x1="26" y1="38" x2="34" y2="38" stroke="#94a3b8" strokeWidth="1" />
        <text x="24" y="41" fill="#bae6fd" fontSize="5.5" textAnchor="end" fontWeight="bold">0 m</text>

        {/* Tick 200 m (Zona Sinar) */}
        <line x1="26" y1="65" x2="34" y2="65" stroke="#94a3b8" strokeWidth="1" />
        <line x1="34" y1="65" x2="180" y2="65" stroke="#38bdf8" strokeWidth="0.8" opacity="0.3" />
        <text x="24" y="68" fill="#7dd3fc" fontSize="5.5" textAnchor="end">200 m</text>
        <text x="36" y="63" fill="#38bdf8" fontSize="5" opacity="0.8">Zona Terang</text>

        {/* Tick 1.000 m (Zona Senja) */}
        <line x1="26" y1="105" x2="34" y2="105" stroke="#94a3b8" strokeWidth="1" />
        <line x1="34" y1="105" x2="250" y2="105" stroke="#38bdf8" strokeWidth="0.8" opacity="0.25" />
        <text x="24" y="108" fill="#93c5fd" fontSize="5.5" textAnchor="end">1.000 m</text>

        {/* Tick 4.000 m (Zona Gelap Abisal) */}
        <line x1="26" y1="165" x2="34" y2="165" stroke="#94a3b8" strokeWidth="1" />
        <line x1="34" y1="165" x2="270" y2="165" stroke="#38bdf8" strokeWidth="0.8" opacity="0.2" />
        <text x="24" y="168" fill="#cbd5e1" fontSize="5.5" textAnchor="end">4.000 m</text>
        <text x="36" y="163" fill="#94a3b8" fontSize="5" opacity="0.8">Zona Gelap Abisal</text>

        {/* Tick 11.000 m (Dasar Palung Mariana) */}
        <line x1="26" y1="246" x2="34" y2="246" stroke="#facc15" strokeWidth="1.5" />
        <text x="24" y="248" fill="#facc15" fontSize="6" textAnchor="end" fontWeight="bold">11.000 m</text>
      </g>

      {/* Label Titik Terdalam Palung */}
      <rect x="180" y="234" width="105" height="12" rx="2" fill="#020617" stroke="#38bdf8" strokeWidth="1" />
      <text x="232" y="242" fill="#38bdf8" fontSize="6" fontWeight="bold" textAnchor="middle">
        CHALLENGER DEEP: 11.034 m
      </text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GAMBAR 2: RANTAI PEGUNUNGAN LIPATAN (FOLDED MOUNTAINS)
// Kompresi mendatar dua lempeng, puncak lipatan antiklin, lembah sinklin & puncak salju
// ─────────────────────────────────────────────────────────────────────────────
function FoldedMountainsIllustration() {
  return (
    <svg viewBox="0 0 560 250" className="w-full h-full object-contain" shapeRendering="geometricPrecision">
      <defs>
        {/* Alpine Sky */}
        <linearGradient id="alpSkyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="60%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#e0f2fe" />
        </linearGradient>

        {/* Rock layer gradients */}
        <linearGradient id="layerSediment" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ca8a04" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#a16207" />
        </linearGradient>
      </defs>

      {/* 1. Langit Alpin Biru Cerah */}
      <rect x="0" y="0" width="560" height="105" fill="url(#alpSkyGrad)" />
      {/* Matahari Gunung */}
      <circle cx="90" cy="25" r="10" fill="#fef08a" />
      <circle cx="90" cy="25" r="18" fill="#fde047" opacity="0.3" />
      {/* Burung Rajawali Pegunungan */}
      <path d="M 440,25 Q 445,18 450,25 Q 455,18 460,25" fill="none" stroke="#0f172a" strokeWidth="1.2" />

      {/* 2. Pegunungan Latar Belakang (Distant Ranges) */}
      <polygon points="50,105 130,45 210,105" fill="#475569" opacity="0.6" />
      <polygon points="120,52 130,45 140,52" fill="#f8fafc" opacity="0.8" />
      <polygon points="350,105 430,40 510,105" fill="#475569" opacity="0.6" />
      <polygon points="420,48 430,40 440,48" fill="#f8fafc" opacity="0.8" />

      {/* 3. Barisan Puncak Lipatan Depan (Towering Folded Peaks) */}
      {/* Puncak Kiri (Bukit Lipatan Barat) */}
      <polygon points="0,105 90,48 180,105" fill="#64748b" />
      <polygon points="90,48 180,105 150,105" fill="#475569" />
      <polygon points="75,58 90,48 105,58 95,65 85,65" fill="#f8fafc" />

      {/* Puncak Tengah (Puncak Utama Tertinggi - Antiklin Akbar) */}
      <polygon points="170,105 280,24 390,105" fill="#64748b" />
      <polygon points="280,24 390,105 340,105" fill="#334155" />
      {/* Gletser & Topi Salju Abadi */}
      <polygon points="260,38 280,24 300,38 290,48 275,50 268,44" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
      <polygon points="280,24 300,38 290,48 280,36" fill="#cbd5e1" />

      {/* Puncak Kanan */}
      <polygon points="380,105 460,42 540,105" fill="#64748b" />
      <polygon points="460,42 540,105 500,105" fill="#475569" />
      <polygon points="445,52 460,42 475,52 465,60 455,60" fill="#f8fafc" />

      {/* Hutan Pinus & Lembah Hijau Kaki Gunung */}
      <rect x="0" y="98" width="560" height="7" fill="#15803d" />
      {/* Siluet Pohon Cemara */}
      {[40, 70, 110, 140, 200, 230, 330, 360, 410, 490, 520].map((tx, idx) => (
        <polygon key={idx} points={`${tx},98 ${tx + 3},91 ${tx + 6},98`} fill="#14532d" />
      ))}

      {/* 4. Penampang Bawah Tanah: Lapisan Batuan Terlipat (Antiklin & Sinklin) */}
      {/* Latar Kerak Benua */}
      <rect x="0" y="105" width="560" height="145" fill="#1e293b" />

      {/* Lapisan 1: Sedimen Kuning Emas Terlipat */}
      <path
        d="M 0,105 Q 60,78 120,108 Q 200,150 280,105 Q 360,150 440,108 Q 500,78 560,105 L 560,135 Q 500,108 440,138 Q 360,180 280,135 Q 200,180 120,138 Q 60,108 0,135 Z"
        fill="url(#layerSediment)"
        stroke="#78350f"
        strokeWidth="1.5"
      />

      {/* Lapisan 2: Batu Kapur Biru Abu-Abu Terlipat */}
      <path
        d="M 0,135 Q 60,108 120,138 Q 200,180 280,135 Q 360,180 440,138 Q 500,108 560,135 L 560,165 Q 500,138 440,168 Q 360,210 280,165 Q 200,210 120,168 Q 60,138 0,165 Z"
        fill="#475569"
        stroke="#0f172a"
        strokeWidth="1.5"
      />

      {/* Lapisan 3: Serpih Hijau Zaitun Terlipat */}
      <path
        d="M 0,165 Q 60,138 120,168 Q 200,210 280,165 Q 360,210 440,168 Q 500,138 560,165 L 560,195 Q 500,168 440,198 Q 360,240 280,195 Q 200,240 120,198 Q 60,168 0,195 Z"
        fill="#166534"
        stroke="#052e16"
        strokeWidth="1.5"
      />

      {/* Lapisan 4: Granit Merah Kerak Bawah */}
      <path
        d="M 0,195 Q 60,168 120,198 Q 200,240 280,195 Q 360,240 440,198 Q 500,168 560,195 L 560,250 L 0,250 Z"
        fill="#7f1d1d"
        stroke="#450a0a"
        strokeWidth="1.5"
      />

      {/* 5. Panah Gaya Kompresi Mendatar Lempeng */}
      {/* Panah Kiri Mendorong ke Kanan */}
      <g>
        <rect x="20" y="165" width="60" height="18" rx="3" fill="#ea580c" stroke="#fef08a" strokeWidth="1.5" />
        <text x="32" y="177" fill="#ffffff" fontSize="6.5" fontWeight="bold">TEKANAN</text>
        <polygon points="80,162 94,174 80,186" fill="#facc15" stroke="#78350f" strokeWidth="1" />
      </g>

      {/* Panah Kanan Mendorong ke Kiri */}
      <g>
        <rect x="480" y="165" width="60" height="18" rx="3" fill="#ea580c" stroke="#fef08a" strokeWidth="1.5" />
        <text x="490" y="177" fill="#ffffff" fontSize="6.5" fontWeight="bold">TEKANAN</text>
        <polygon points="480,162 466,174 480,186" fill="#facc15" stroke="#78350f" strokeWidth="1" />
      </g>

      {/* 6. Label Edukatif Antiklin & Sinklin */}
      {/* Callout Antiklin (Puncak Lipatan) */}
      <g>
        <rect x="215" y="70" width="130" height="18" rx="3" fill="#451a03" stroke="#f59e0b" strokeWidth="1.5" />
        <text x="280" y="82" fill="#fef08a" fontSize="6.5" fontWeight="bold" textAnchor="middle">
          PUNCAK LIPATAN (ANTIKLIN)
        </text>
        <line x1="280" y1="88" x2="280" y2="105" stroke="#f59e0b" strokeWidth="1.5" />
        <circle cx="280" cy="105" r="3" fill="#fef08a" />
      </g>

      {/* Callout Sinklin (Lembah Lipatan) */}
      <g>
        <rect x="145" y="195" width="125" height="18" rx="3" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
        <text x="207" y="207" fill="#7dd3fc" fontSize="6.5" fontWeight="bold" textAnchor="middle">
          LEMBAH LIPATAN (SINKLIN)
        </text>
        <line x1="200" y1="195" x2="200" y2="155" stroke="#38bdf8" strokeWidth="1.5" />
        <circle cx="200" cy="155" r="3" fill="#38bdf8" />
      </g>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GAMBAR 3: BUSUR GUNUNG BERAPI AKTIF (VOLCANIC ARC / STRATOVOLCANO)
// Subduksi lempeng, peleburan magma di mantel, dapur magma & erupsi stratovolcano
// ─────────────────────────────────────────────────────────────────────────────
function VolcanoIllustration() {
  return (
    <svg viewBox="0 0 560 250" className="w-full h-full object-contain" shapeRendering="geometricPrecision">
      <defs>
        {/* Sky gradient twilight volcanic */}
        <linearGradient id="volSkyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#18181b" />
          <stop offset="60%" stopColor="#27272a" />
          <stop offset="100%" stopColor="#3f3f46" />
        </linearGradient>

        {/* Magma chamber fiery radial gradient */}
        <radialGradient id="dapurMagmaGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="35%" stopColor="#f97316" />
          <stop offset="75%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </radialGradient>

        {/* Asthenosphere mantle gradient */}
        <linearGradient id="mantelGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#451a03" />
          <stop offset="100%" stopColor="#7c2d12" />
        </linearGradient>
      </defs>

      {/* 1. Langit Erupsi Gelap */}
      <rect x="0" y="0" width="560" height="115" fill="url(#volSkyGrad)" />

      {/* Kolom Awan Abu Panas & Gas Vulkanik (Wedhus Gembel) */}
      <g>
        <circle cx="330" cy="38" r="14" fill="#3f3f46" opacity="0.9" />
        <circle cx="318" cy="24" r="18" fill="#27272a" opacity="0.95" />
        <circle cx="342" cy="20" r="20" fill="#18181b" opacity="0.95" />
        <circle cx="368" cy="14" r="24" fill="#09090b" opacity="0.95" />
        <circle cx="395" cy="10" r="22" fill="#18181b" opacity="0.9" />
        {/* Lontaran Piroklastik Pijar Merah/Kuning */}
        <circle cx="325" cy="32" r="2.5" fill="#fef08a" />
        <circle cx="335" cy="22" r="2" fill="#f97316" />
        <circle cx="310" cy="18" r="1.5" fill="#ef4444" />
        <circle cx="350" cy="12" r="2" fill="#fef08a" />
      </g>

      {/* 2. Kerucut Stratovolcano (Gunung Merapi) */}
      {/* Lereng Gunung */}
      <polygon points="170,115 320,48 340,48 490,115" fill="#1c1917" stroke="#09090b" strokeWidth="1.5" />
      <polygon points="330,48 490,115 420,115" fill="#0f172a" />
      {/* Aliran Lava Pijar Menuruni Lereng */}
      <path d="M 324,50 Q 305,75 285,115" fill="none" stroke="#ef4444" strokeWidth="2.5" />
      <path d="M 324,50 Q 305,75 285,115" fill="none" stroke="#fef08a" strokeWidth="1" />
      <path d="M 336,50 Q 355,80 380,115" fill="none" stroke="#ea580c" strokeWidth="2.5" />
      <path d="M 336,50 Q 355,80 380,115" fill="none" stroke="#facc15" strokeWidth="1" />
      {/* Kawah Puncak Vulkanik */}
      <ellipse cx="330" cy="48" rx="10" ry="3" fill="#ef4444" />
      <ellipse cx="330" cy="48" rx="6" ry="1.5" fill="#fef08a" />

      {/* Kaki Gunung Berumput Hijau */}
      <rect x="0" y="112" width="560" height="6" fill="#15803d" />

      {/* 3. Penampang Bawah Tanah: Mantel & Kerak Benua */}
      <rect x="0" y="118" width="560" height="132" fill="#1e293b" />
      {/* Astenosfer Mantel Bumi Panas (>1200°C) */}
      <rect x="0" y="175" width="560" height="75" fill="url(#mantelGrad)" />
      <text x="15" y="240" fill="#fed7aa" fontSize="6.5" fontWeight="bold">
        ASTENOSFER MANTEL PANAS (SUHU &gt; 1.200°C)
      </text>

      {/* 4. Lempeng Samudra yang Menunjam (Subduksi) */}
      <polygon
        points="0,118 110,118 240,250 180,250 80,140 0,140"
        fill="#166534"
        stroke="#14532d"
        strokeWidth="1.5"
      />
      <text x="15" y="132" fill="#86efac" fontSize="6.5" fontWeight="bold">
        LEMPENG SAMUDRA (MENUNJAM)
      </text>

      {/* Peleburan Batuan & Butiran Magma Naik */}
      <g>
        <circle cx="190" cy="210" r="14" fill="#ea580c" opacity="0.6" />
        <circle cx="190" cy="210" r="7" fill="#fef08a" />
        <text x="210" y="214" fill="#fef08a" fontSize="6" fontWeight="bold">PELEBURAN SLAB</text>

        {/* Magma Naik ke Atas */}
        <path d="M 205,200 Q 240,195 270,185" fill="none" stroke="#f97316" strokeWidth="2" />
      </g>

      {/* 5. Dapur Magma Raksasa (Magma Chamber) */}
      <g>
        <ellipse cx="330" cy="175" rx="55" ry="26" fill="url(#dapurMagmaGrad)" stroke="#ef4444" strokeWidth="2" />
        {/* Turbulensi Panas di dalam Dapur Magma */}
        <ellipse cx="330" cy="175" rx="28" ry="12" fill="#fef08a" />
        <text x="330" y="178" fill="#450a0a" fontSize="7" fontWeight="bold" textAnchor="middle">
          DAPUR MAGMA (KANTUNG PIJAR)
        </text>
      </g>

      {/* 6. Pipa Magma Utama Menerobos ke Kawah */}
      <polygon points="325,150 335,150 334,50 326,50" fill="#f97316" stroke="#ea580c" strokeWidth="1" />
      <polygon points="328,150 332,150 331,50 329,50" fill="#fef08a" />

      {/* Rekahan Magma Samping */}
      <path d="M 326,110 Q 300,95 295,85" fill="none" stroke="#ef4444" strokeWidth="2" />

      {/* 7. Label-Label Penjelasan Step */}
      <g>
        <rect x="250" y="85" width="160" height="16" rx="3" fill="#450a0a" stroke="#f87171" strokeWidth="1.2" />
        <text x="330" y="96" fill="#fef08a" fontSize="6.5" fontWeight="bold" textAnchor="middle">
          BUSUR STRATOVOLCANO AKTIF MERAPI
        </text>
      </g>
    </svg>
  );
}

function MegathrustIllustration() {
  const [phase, setPhase] = useState<'locked' | 'rupture'>('locked');

  const handleTogglePhase = (targetPhase: 'locked' | 'rupture') => {
    if (targetPhase === 'rupture') {
      retroAudio.playExplosion();
    } else {
      retroAudio.playSelect();
    }
    setPhase(targetPhase);
  };

  const isRupture = phase === 'rupture';

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-between p-2 select-none">
      {/* Top Controller */}
      <div className="w-full flex items-center justify-between px-2 pb-1.5 border-b border-slate-800 z-10">
        <span className="text-[12.5px] font-pixel-title text-rose-400 font-bold flex items-center gap-1.5">
          <PixelIcon name="alert" size={13} className="text-rose-500 animate-pulse" />
          <span>SIMULATOR MEKANISME GEMPA MEGATHRUST &amp; TSUNAMI</span>
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleTogglePhase('locked')}
            className={`px-3 py-1 rounded-lg text-[12.5px] font-pixel-title font-bold border-2 cursor-pointer transition-all ${!isRupture
              ? 'bg-amber-600 text-white border-amber-300 shadow-[0_2px_0_#451a03] -translate-y-0.5'
              : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
          >
            [1. FASE TERKUNCI]
          </button>
          <button
            onClick={() => handleTogglePhase('rupture')}
            className={`px-3 py-1 rounded-lg text-[12.5px] font-pixel-title font-bold border-2 cursor-pointer transition-all ${isRupture
              ? 'bg-rose-600 text-white border-rose-300 shadow-[0_2px_0_#4c0519] -translate-y-0.5'
              : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
          >
            [2. RUPTUR &amp; TSUNAMI]
          </button>
        </div>
      </div>

      {/* Simulator SVG Canvas */}
      <svg viewBox="0 0 540 240" className="w-full h-full object-contain" shapeRendering="geometricPrecision">
        <style>{`
          @keyframes shockwavePulse {
            0% { r: 6px; opacity: 1; stroke-width: 3.5px; }
            50% { opacity: 0.8; }
            100% { r: 110px; opacity: 0; stroke-width: 1px; }
          }
          @keyframes tsunamiSurge {
            0% { transform: translateX(0px); }
            50% { transform: translateX(12px); }
            100% { transform: translateX(0px); }
          }
          @keyframes quakeShakeL2 {
            0% { transform: translate(0, 0); }
            25% { transform: translate(-2px, 1.5px); }
            50% { transform: translate(2px, -1.5px); }
            75% { transform: translate(-1.5px, -1px); }
            100% { transform: translate(0, 0); }
          }
          .anim-shockwave-1 { animation: shockwavePulse 1.8s ease-out infinite; }
          .anim-shockwave-2 { animation: shockwavePulse 1.8s ease-out infinite 0.45s; }
          .anim-shockwave-3 { animation: shockwavePulse 1.8s ease-out infinite 0.9s; }
          .anim-tsunami { animation: tsunamiSurge 2.5s ease-in-out infinite; }
          .anim-tremor { animation: quakeShakeL2 0.12s linear infinite; }
        `}</style>

        <defs>
          <linearGradient id="deepOceanTrenchGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="50%" stopColor="#0369a1" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          <linearGradient id="subductingSlabGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="60%" stopColor="#172554" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>

        {/* Sky Background */}
        <rect x="0" y="0" width="540" height="240" fill="#09090b" />

        {/* Asthenosphere Mantle */}
        <rect x="0" y="165" width="540" height="75" fill="#451a03" />
        <rect x="0" y="195" width="540" height="45" fill="#7c2d12" />
        <text x="18" y="230" fill="#fed7aa" fontSize="7" fontWeight="bold">
          ASTENOSFER MANTEL BUMI
        </text>

        {/* ── 1. LEMPENG SAMUDRA MENUNJAM (SUBDUCTING SLAB DIAGONAL) ── */}
        <g>
          <path
            d="M 0,105 L 180,120 L 320,240 L 260,240 L 140,140 L 0,128 Z"
            fill="url(#subductingSlabGrad)"
            stroke="#1e40af"
            strokeWidth="1.5"
          />
          {/* Panah Laju Penunjaman Lempeng Samudra */}
          <polygon points="55,112 85,112 85,109 97,115 85,121 85,118 55,118" fill="#38bdf8" />
          <text x="25" y="140" fill="#93c5fd" fontSize="7" fontWeight="bold">
            LEMPENG SAMUDRA (MENUNJAM)
          </text>
        </g>

        {/* ── 2. LEMPENG BENUA OVERRIDING (Ujung Mengalami Deformasi Fleksi / Rebound) ── */}
        <g className={isRupture ? 'anim-tremor' : ''}>
          {/* Posisi Ujung Kerak Benua: Menekuk ke Bawah (Locked) vs Mencelat Naik (Rupture Rebound) */}
          <path
            d={
              !isRupture
                ? 'M 175,128 Q 230,135 250,165 L 540,165 L 540,55 L 340,55 L 260,85 Q 210,120 175,128 Z'
                : 'M 170,95 Q 225,98 250,150 L 540,150 L 540,55 L 340,55 L 260,75 Q 200,90 170,95 Z'
            }
            fill="#1e293b"
            stroke="#334155"
            strokeWidth="2"
            style={{ transition: 'd 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28)' }}
          />

          {/* Permukaan Daratan Kerak Benua */}
          <path
            d={
              !isRupture
                ? 'M 260,85 L 340,55 L 540,55'
                : 'M 260,75 L 340,55 L 540,55'
            }
            fill="none"
            stroke="#64748b"
            strokeWidth="4"
          />

          {/* Bangunan Kota Pesisir di Daratan Benua */}
          <rect x="420" y="44" width="14" height="11" fill="#475569" stroke="#0f172a" strokeWidth="1" />
          <rect x="440" y="40" width="18" height="15" fill="#334155" stroke="#0f172a" strokeWidth="1" />
          <rect x="465" y="46" width="12" height="9" fill="#475569" stroke="#0f172a" strokeWidth="1" />
          <rect x="485" y="42" width="15" height="13" fill="#334155" stroke="#0f172a" strokeWidth="1" />

          {/* Pohon & Garis Pantai */}
          <rect x="360" y="50" width="8" height="5" fill="#15803d" />
          <rect x="380" y="48" width="10" height="7" fill="#15803d" />

          <text x="440" y="80" fill="#f8fafc" fontSize="8" fontWeight="bold">
            DARATAN KERAK BENUA EURASIA
          </text>
        </g>

        {/* ── 3. SAMUDRA & AIR LAUT (SURUT KETIKA TERKUNCI vs TSUNAMI KETIKA RUPTUR) ── */}
        <g>
          {/* Kolom Air Samudra */}
          <path
            d={
              !isRupture
                ? 'M 0,55 L 260,85 L 250,165 L 175,128 L 0,105 Z'
                : 'M 0,55 L 260,75 L 250,150 L 170,95 L 0,105 Z'
            }
            fill="url(#deepOceanTrenchGrad)"
            opacity="0.75"
            style={{ transition: 'd 0.5s ease' }}
          />

          {/* Permukaan Laut */}
          {!isRupture ? (
            // Air Laut Tenang (Pesisir mengalami sedikit depresi/surut)
            <g>
              <line x1="0" y1="55" x2="260" y2="85" stroke="#38bdf8" strokeWidth="2.5" />
              <text x="80" y="50" fill="#7dd3fc" fontSize="7" fontWeight="bold">
                PERMUKAAN AIR LAUT NORMAL
              </text>
            </g>
          ) : (
            // GELOMBANG TSUNAMI DAHSYAT (Bongkahan Air Terangkat Naik Akibat Rebound Seafloor)
            <g className="anim-tsunami">
              <path
                d="M 0,55 L 110,55 Q 165,12 210,35 Q 240,65 260,75"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="4"
              />
              <path
                d="M 120,55 Q 165,16 205,38"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
              />
              {/* Buih Puncak Gelombang Tsunami */}
              <circle cx="165" cy="18" r="3" fill="#ffffff" />
              <circle cx="172" cy="19" r="2.5" fill="#ffffff" />
              <circle cx="180" cy="22" r="2" fill="#ffffff" />

              <rect x="110" y="2" width="135" height="18" rx="4" fill="#082f49" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="177" y="14" fill="#fef08a" fontSize="7" fontWeight="bold" textAnchor="middle">
                GELOMBANG TSUNAMI MEGATHRUST &gt;&gt;
              </text>
            </g>
          )}
        </g>

        {/* ── 4. BIDANG KONTAK SESAR MEGATHRUST (FAULT CONTACT ZONE) ── */}
        <g>
          {/* Garis Sesar Kontak Antar Lempeng */}
          <line
            x1="175"
            y1={!isRupture ? 128 : 100}
            x2="245"
            y2={!isRupture ? 165 : 150}
            stroke={!isRupture ? '#f59e0b' : '#ef4444'}
            strokeWidth={!isRupture ? '4' : '6'}
            strokeLinecap="round"
            style={{ transition: 'all 0.5s ease' }}
          />

          {!isRupture ? (
            // Indikator Fase Terkunci: Gesekan & Akumulasi Tegangan
            <g>
              <circle cx="210" cy="146" r="10" fill="#dc2626" opacity="0.3" />
              <circle cx="210" cy="146" r="4" fill="#f59e0b" />
              {/* Panah Tegangan Terkunci Menekan Ujung Benua ke Bawah */}
              <polygon points="190,110 205,130 198,134 215,145 222,126 215,130 200,110" fill="#ef4444" />

              <rect x="255" y="110" width="160" height="22" rx="4" fill="#451a03" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="335" y="124" fill="#fef08a" fontSize="6.5" fontWeight="bold" textAnchor="middle">
                BIDANG SESAR TERKUNCI (LOCKED)
              </text>
              <line x1="255" y1="121" x2="225" y2="142" stroke="#f59e0b" strokeWidth="1.5" />
            </g>
          ) : (
            // Indikator Fase Ruptur: Gempa Dahsyat & Gelombang Seismik Meledak
            <g>
              {/* Gelombang Seismik P & S Raksasa Merambat Keluar dari Hiposentrum */}
              <circle cx="210" cy="125" r="15" fill="none" stroke="#fef08a" className="anim-shockwave-1" />
              <circle cx="210" cy="125" r="30" fill="none" stroke="#f97316" className="anim-shockwave-2" />
              <circle cx="210" cy="125" r="50" fill="none" stroke="#ef4444" className="anim-shockwave-3" />

              {/* Titik Hiposentrum Gempa Megathrust */}
              <circle cx="210" cy="125" r="7" fill="#fef08a" />
              <circle cx="210" cy="125" r="4" fill="#dc2626" />

              {/* Panah Rebound Elastis Melesat ke Atas */}
              <polygon points="160,115 160,85 152,85 165,70 178,85 170,85 170,115" fill="#22c55e" />
              <text x="120" y="85" fill="#86efac" fontSize="7" fontWeight="bold">
                REBOUND ELASTIS!
              </text>

              {/* Callout Hiposentrum */}
              <rect x="235" y="105" width="175" height="24" rx="4" fill="#450a0a" stroke="#ef4444" strokeWidth="2" />
              <text x="322" y="117" fill="#fef08a" fontSize="7" fontWeight="bold" textAnchor="middle">
                HIPOSENTRUM GEMPA MEGATHRUST
              </text>
              <text x="322" y="125" fill="#fca5a5" fontSize="5.5" textAnchor="middle">
                Pelepasan Energi Dahsyat M &gt; 8.5
              </text>
            </g>
          )}
        </g>
      </svg>

      {/* Bottom Educational Summary */}
      <div className="w-full bg-[#0f172a] border-2 border-rose-500/80 rounded-xl p-2.5 text-slate-200 text-[13px] flex items-center justify-between gap-3 shadow-lg font-semibold">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-rose-600/30 text-rose-300 font-pixel-title text-[12.5px] border border-rose-500 font-bold whitespace-nowrap">
            {!isRupture ? 'FASE 1: AKUMULASI TEGANGAN' : 'FASE 2: PELEPASAN & TSUNAMI'}
          </span>
          <p className="text-[13.5px] sm:text-[14.5px] leading-snug text-slate-300 font-semibold">
            {!isRupture
              ? 'Selama puluhan tahun, bidang kontak terkunci menahan gesekan. Ujung lempeng benua tertekuk ke bawah dan menyimpan tegangan elastis raksasa.'
              : 'Ketika batas elastis terlampaui, batuan patah mendadak! Ujung lempeng benua terpelanting naik (<Rebound Elastis>), mendesak miliaran kubik air laut membentuk Tsunami!'}
          </p>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN: SISMOGRAF MEKANIK KE SINYAL LISTRIK & BUKTI 20 LEMPENG BUMI
// ═════════════════════════════════════════════════════════════════════════════
export function SeismographPlatesIllustration() {
  const [activeTab, setActiveTab] = useState<'seismograph' | 'plates'>('seismograph');

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between bg-[#09090b] select-none p-1 sm:p-2 font-pixel">
      {/* Top Header Mode Switcher (Tab Anti-Clipping) */}
      <div className="w-full flex items-center justify-between px-2 pt-2 pb-1.5 bg-slate-950/95 border-b border-amber-800/60 text-[13.5px] z-10 shadow-sm gap-2 font-semibold">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              retroAudio.playSelect();
              setActiveTab('seismograph');
            }}
            className={`pt-2 px-3 pb-1.5 rounded-t-lg font-pixel-title text-[12.5px] font-bold cursor-pointer transition-all border-t-2 border-x-2 ${activeTab === 'seismograph'
              ? 'bg-[#1e1b4b] text-cyan-300 border-cyan-500 shadow-[0_-2px_6px_rgba(6,182,212,0.3)]'
              : 'bg-slate-900/80 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
          >
            [1. INSTRUMEN SISMOGRAF 3D]
          </button>
          <button
            onClick={() => {
              retroAudio.playSelect();
              setActiveTab('plates');
            }}
            className={`pt-2 px-3 pb-1.5 rounded-t-lg font-pixel-title text-[12.5px] font-bold cursor-pointer transition-all border-t-2 border-x-2 ${activeTab === 'plates'
              ? 'bg-[#1e1b4b] text-amber-300 border-amber-500 shadow-[0_-2px_6px_rgba(245,158,11,0.3)]'
              : 'bg-slate-900/80 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
          >
            [2. PETA 20 LEMPENG BUMI]
          </button>
        </div>
        <span className="text-[12px] text-slate-400 hidden sm:inline font-semibold">
          INSTRUMEN PENCATAT GELOMBANG SEISMIK
        </span>
      </div>

      {/* SVG Canvas Simulator 3D Mechanical Seismograph */}
      {activeTab === 'seismograph' ? (
        <svg viewBox="0 0 560 250" className="w-full h-full object-contain" shapeRendering="geometricPrecision">
          <defs>
            <linearGradient id="seismoBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#090d16" />
              <stop offset="50%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#090d16" />
            </linearGradient>

            <linearGradient id="basePlateTop" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="35%" stopColor="#cbd5e1" />
              <stop offset="70%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            <linearGradient id="basePlateFront" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            <linearGradient id="basePlateLeft" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            <linearGradient id="cFrameFront" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="40%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>

            <linearGradient id="cFrameSide" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            <linearGradient id="cFrameTop" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>

            <linearGradient id="inertiaBobTop" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f1f5f9" />
              <stop offset="50%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            <linearGradient id="inertiaBobBody" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="25%" stopColor="#cbd5e1" />
              <stop offset="60%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            <linearGradient id="drumPaper" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="30%" stopColor="#f8fafc" />
              <stop offset="70%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>

            <linearGradient id="drumCap" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            <linearGradient id="drumMount" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="50%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            <radialGradient id="boltGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="45%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#334155" />
            </radialGradient>

            <radialGradient id="baseShadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(0,0,0,0.7)" />
              <stop offset="80%" stopColor="rgba(0,0,0,0.3)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>
          </defs>

          <rect width="560" height="250" fill="url(#seismoBg)" rx="8" />
          <ellipse cx="280" cy="222" rx="255" ry="24" fill="url(#baseShadow)" />

          {/* 1. Pelat Dasar Logam Tebal Berbaut (Base Plate 3D) */}
          <polygon points="25,170 280,218 535,170 535,182 280,230 25,182" fill="url(#basePlateFront)" stroke="#0f172a" strokeWidth="1" />
          <polygon points="25,170 25,182 280,230 280,218" fill="url(#basePlateLeft)" />
          <polygon points="215,82 535,170 280,218 25,170" fill="url(#basePlateTop)" stroke="#64748b" strokeWidth="1.2" />

          {/* 4 Baut Sudut Baja (Bolts) */}
          <ellipse cx="50" cy="170" rx="9" ry="5.5" fill="url(#boltGrad)" stroke="#1e293b" strokeWidth="0.8" />
          <ellipse cx="280" cy="211" rx="9" ry="5.5" fill="url(#boltGrad)" stroke="#1e293b" strokeWidth="0.8" />
          <ellipse cx="510" cy="170" rx="9" ry="5.5" fill="url(#boltGrad)" stroke="#1e293b" strokeWidth="0.8" />
          <ellipse cx="225" cy="89" rx="8" ry="5" fill="url(#boltGrad)" stroke="#1e293b" strokeWidth="0.8" opacity="0.85" />

          {/* 2. Dudukan Poros Belakang Silinder Drum */}
          <polygon points="175,115 188,111 188,155 175,159" fill="#334155" stroke="#1e293b" strokeWidth="1" />
          <polygon points="162,118 175,115 175,159 162,162" fill="url(#drumMount)" stroke="#1e293b" strokeWidth="1" />

          {/* 3. Silinder Drum Horizontal & Kertas Seismogram */}
          <line x1="160" y1="124" x2="385" y2="175" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
          <g id="seismograph-drum">
            <ellipse cx="188" cy="122" rx="14" ry="26" fill="url(#drumCap)" stroke="#475569" strokeWidth="1" />
            <path
              d="M 188,96 L 360,140 A 15 28 0 0 1 360,196 L 188,148 A 15 28 0 0 1 188,96 Z"
              fill="url(#drumPaper)"
              stroke="#64748b"
              strokeWidth="1"
            />
            <ellipse cx="360" cy="168" rx="15" ry="28" fill="url(#drumCap)" stroke="#334155" strokeWidth="1.2" />
            <ellipse cx="360" cy="168" rx="13" ry="25" fill="#e2e8f0" opacity="0.6" />

            {/* Grid Garis Kertas Seismogram */}
            <path d="M 188,109 L 360,153" stroke="#cbd5e1" strokeWidth="0.8" opacity="0.8" />
            <path d="M 188,122 L 360,166" stroke="#94a3b8" strokeWidth="1" opacity="0.9" />
            <path d="M 188,135 L 360,179" stroke="#cbd5e1" strokeWidth="0.8" opacity="0.8" />

            {/* Rekaman Grafik Gelombang Gempa (Seismogram Waveform Trace P & S Waves) */}
            <path
              d="
                M 195,123 
                L 220,128 L 225,130 L 230,126 L 234,131 L 238,128 
                L 242,125 L 245,137 L 248,122 L 252,143 L 255,118 L 258,152 L 261,112 
                L 264,162 L 267,105 L 271,170 L 275,108 L 279,165 L 283,118 L 287,156 
                L 291,126 L 295,150 L 300,132 L 305,145 L 310,138 L 320,148 L 335,155 L 355,162
              "
              fill="none"
              stroke="#0f172a"
              strokeWidth="1.6"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </g>

          {/* Dudukan Poros Depan Silinder Drum */}
          <polygon points="380,145 394,141 394,198 380,203" fill="#334155" stroke="#1e293b" strokeWidth="1" />
          <polygon points="364,149 380,145 380,203 364,208" fill="url(#drumMount)" stroke="#1e293b" strokeWidth="1" />
          <circle cx="372" cy="176" r="3.5" fill="url(#boltGrad)" stroke="#1e293b" strokeWidth="0.8" />

          {/* 4. Rangka Baja Bentuk C (C-Frame Stand) */}
          <polygon points="90,45 110,38 110,172 90,165" fill="url(#cFrameSide)" stroke="#1e293b" strokeWidth="1" />
          <polygon points="110,38 135,46 135,180 110,172" fill="url(#cFrameFront)" stroke="#334155" strokeWidth="1" />
          <polygon points="135,150 160,170 160,186 135,180" fill="url(#cFrameFront)" stroke="#1e293b" strokeWidth="1" />

          <polygon points="110,38 310,38 310,54 135,54 135,46 110,38" fill="url(#cFrameFront)" stroke="#334155" strokeWidth="1" />
          <polygon points="90,28 290,28 310,38 110,38" fill="url(#cFrameTop)" stroke="#94a3b8" strokeWidth="1" />
          <polygon points="290,28 310,38 310,54 290,44" fill="url(#cFrameSide)" stroke="#1e293b" strokeWidth="1" />

          {/* 5. Kawat Suspensi, Beban Silinder Inersia & Jarum Pena Pencatat */}
          <line x1="240" y1="38" x2="240" y2="72" stroke="#64748b" strokeWidth="2" />
          <line x1="240" y1="38" x2="240" y2="72" stroke="#f1f5f9" strokeWidth="1" />

          <g id="inertia-pendulum-bob">
            <path
              d="M 200,82 L 280,82 L 280,104 A 40 14 0 0 1 200,104 Z"
              fill="url(#inertiaBobBody)"
              stroke="#1e293b"
              strokeWidth="1.2"
            />
            <ellipse cx="240" cy="82" rx="40" ry="14" fill="url(#inertiaBobTop)" stroke="#64748b" strokeWidth="1" />
            <ellipse cx="240" cy="82" rx="6" ry="2.5" fill="url(#boltGrad)" stroke="#1e293b" strokeWidth="0.8" />

            {/* Jarum Pena Pencatat Menyentuh Permukaan Kertas Drum */}
            <line x1="240" y1="104" x2="240" y2="135" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="240" y1="104" x2="240" y2="135" stroke="#f1f5f9" strokeWidth="1" strokeLinecap="round" />
            <circle cx="240" cy="135" r="1.5" fill="#dc2626" />
          </g>
        </svg>
      ) : (
        /* Peta 20 Lempeng Tektonik Global & Seismisitas */
        <svg viewBox="0 0 560 250" className="w-full h-full object-contain" shapeRendering="crispEdges">
          {/* World Projection Base (Lautan Samudra Biru Tua) */}
          <rect x="0" y="0" width="560" height="250" fill="#0c4a6e" />

          {/* Benua-Benua Utama (Siluet Hijau/Krem Retro) */}
          {/* Amerika Utara & Selatan */}
          <path d="M 60 40 L 120 30 L 160 50 L 140 100 L 110 120 L 130 150 L 145 200 L 115 220 L 95 160 L 80 120 L 60 70 Z" fill="#15803d" stroke="#166534" strokeWidth="1.5" />
          {/* Eurasia */}
          <path d="M 260 30 L 380 25 L 450 40 L 480 80 L 440 110 L 360 100 L 300 115 L 250 80 Z" fill="#166534" stroke="#14532d" strokeWidth="1.5" />
          {/* Afrika */}
          <path d="M 240 90 L 310 95 L 340 140 L 310 200 L 260 190 L 230 140 Z" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
          {/* India & Australia */}
          <path d="M 370 110 L 405 115 L 390 145 Z" fill="#047857" stroke="#065f46" strokeWidth="1.5" />
          <path d="M 420 160 L 480 155 L 490 200 L 430 210 Z" fill="#15803d" stroke="#166534" strokeWidth="1.5" />
          {/* Antartika */}
          <rect x="80" y="235" width="400" height="15" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />

          {/* ── BATAS 20 LEMPENG TEKTONIK (GARIS MERAH / EMAS BERSAMBUNGAN) ── */}
          {/* Cincin Api Pasifik (Ring of Fire) */}
          <path d="M 120 35 L 60 80 L 70 150 L 90 220" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
          <path d="M 480 45 L 460 110 L 420 150 L 430 210" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
          {/* Pematang Tengah Atlantik (Mid-Atlantic Ridge) */}
          <path d="M 190 20 Q 210 80, 195 140 Q 220 180, 200 230" fill="none" stroke="#f97316" strokeWidth="2.5" />
          {/* Sabuk Mediterania - Himalaya - Indonesia */}
          <path d="M 220 90 L 270 95 L 350 115 L 420 140 L 470 170" fill="none" stroke="#ef4444" strokeWidth="2.5" />

          {/* Label Nama Lempeng Tektonik Utama */}
          <text x="50" y="110" fill="#fef08a" fontSize="7" fontWeight="bold">LEMPENG PASIFIK</text>
          <text x="90" y="65" fill="#ffffff" fontSize="7" fontWeight="bold">AMERIKA UTARA</text>
          <text x="110" y="175" fill="#ffffff" fontSize="7" fontWeight="bold">AMERIKA SELATAN</text>
          <text x="340" y="60" fill="#ffffff" fontSize="7" fontWeight="bold">LEMPENG EURASIA</text>
          <text x="270" y="150" fill="#ffffff" fontSize="7" fontWeight="bold">LEMPENG AFRIKA</text>
          <text x="430" y="185" fill="#ffffff" fontSize="7" fontWeight="bold">INDO-AUSTRALIA</text>
          <text x="280" y="243" fill="#0f172a" fontSize="6.5" fontWeight="bold">LEMPENG ANTARTIKA</text>

          {/* Titik-Titik Episentrum Gempa (Membuktikan Batas Lempeng) */}
          {[
            [120, 35], [95, 60], [75, 100], [80, 130], [90, 170], [100, 200],
            [190, 30], [200, 70], [205, 105], [198, 140], [210, 180], [205, 215],
            [235, 92], [275, 96], [320, 105], [370, 118], [405, 130], [440, 148], [465, 168],
            [475, 55], [455, 95], [435, 130], [425, 165], [450, 195]
          ].map(([gx, gy], i) => (
            <g key={i}>
              <circle cx={gx} cy={gy} r="4" fill="#ef4444" opacity="0.4" className="animate-ping" />
              <circle cx={gx} cy={gy} r="2.5" fill="#fef08a" stroke="#dc2626" strokeWidth="1" />
            </g>
          ))}

          {/* Callout Titik Gempa Memetakan Lempeng */}
          <rect x="140" y="10" width="280" height="20" rx="4" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="280" y="23" fill="#fde68a" fontSize="7" fontWeight="bold" textAnchor="middle">
            ● TITIK EPISENTRUM GEMPA MEMETAKAN ~20 LEMPENG TEKTONIK
          </text>
        </svg>
      )}

      {/* 3-Card Scientific Explanation for SMP Kelas 8 */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
        <div className="bg-[#0f172a] border-2 border-cyan-500/80 rounded-xl p-2.5 text-slate-200 text-[13px] shadow-md font-semibold">
          <div className="flex items-center gap-1.5 mb-1.5 text-cyan-300 font-pixel-title text-[14px] sm:text-[13px] font-bold">
            <PixelIcon name="shield" size={14} />
            <span>1. INERSIA MASSA</span>
          </div>
          <p className="text-[13px] sm:text-[16px] leading-relaxed text-slate-100 font-sans font-medium">
            Bandul berat tetap diam di posisinya karena gaya inersia saat rangka penopang dan tanah bergetar hebat.
          </p>
        </div>

        <div className="bg-[#0f172a] border-2 border-amber-500/80 rounded-xl p-2.5 text-slate-200 text-[13px] shadow-md font-semibold">
          <div className="flex items-center gap-1.5 mb-1.5 text-amber-300 font-pixel-title text-[14px] sm:text-[13px] font-bold">
            <PixelIcon name="zap" size={14} />
            <span>2. SINYAL LISTRIK</span>
          </div>
          <p className="text-[13px] sm:text-[16px] leading-relaxed text-slate-100 font-sans font-medium">
            Gerak relatif bandul dan magnet menginduksi arus listrik di koil kawat, direkam sebagai grafik seismogram (Gelombang P &amp; S).
          </p>
        </div>

        <div className="bg-[#0f172a] border-2 border-rose-500/80 rounded-xl p-2.5 text-slate-200 text-[13px] shadow-md font-semibold">
          <div className="flex items-center gap-1.5 mb-1.5 text-rose-300 font-pixel-title text-[14px] sm:text-[13px] font-bold">
            <PixelIcon name="globe" size={14} />
            <span>3. 20 LEMPENG BUMI</span>
          </div>
          <p className="text-[13px] sm:text-[16px] leading-relaxed text-slate-100 font-sans font-medium">
            Titik-titik gempa global memetakan sekitar 20 keping lempeng tektonik yang bergerak di atas arus konveksi mantel bumi.
          </p>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN: BATAS TRANSFORM & SESAR SAN ANDREAS (3D SOLID CUBES BERGESER)
// ═════════════════════════════════════════════════════════════════════════════
export const TRANSFORM_POINTS_DATA = [
  {
    icon: 'compass',
    title: '1. GERAK MENDATAR',
    text: 'Dua lempeng bergesekan mendatar (horizontal) saling berlawanan arah secara sejajar sepanjang bidang sesar.',
  },
  {
    icon: 'shield',
    title: '2. BATAS KONSERVATIF',
    text: 'Tidak ada pembentukan lempeng baru dan tidak ada penghancuran kerak bumi (berbeda dari divergen & konvergen).',
  },
  {
    icon: 'zap',
    title: '3. GEMPA BUMI DANGKAL',
    text: 'Gesekan batuan yang saling mengunci melepaskan energi elastis secara tiba-tiba melahirkan gempa bumi dangkal destruktif.',
  },
];

export function TransformSanAndreasIllustration() {
  const [slip, setSlip] = useState(0); // 0 = menyatu utuh, 1 = pergeseran maksimum

  // Animasi Langsung Otomatis & Berulang Mulus:
  // 0 - 1200ms  : Menyatu utuh sebagai satu daratan (slip = 0)
  // 1200 - 3200ms: Bergeser perlahan ke atas & bawah (slip: 0 -> 1)
  // 3200 - 4500ms: Tahan di posisi pergeseran maksimum (slip = 1, tegangan gempa)
  // 4500 - 6000ms: Kembali menyatu perlahan (slip: 1 -> 0)
  useEffect(() => {
    let animId: number;
    const startTime = performance.now();
    const totalCycle = 6000;

    const tick = (now: number) => {
      const elapsed = (now - startTime) % totalCycle;
      let s = 0;
      if (elapsed < 1200) {
        s = 0;
      } else if (elapsed < 3200) {
        const p = (elapsed - 1200) / 2000;
        s = 0.5 - 0.5 * Math.cos(p * Math.PI);
      } else if (elapsed < 4400) {
        s = 1;
      } else {
        const p = (elapsed - 4400) / 1600;
        s = 0.5 + 0.5 * Math.cos(p * Math.PI);
      }

      setSlip(s);
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Geometri 3D Solid Cubes / Blocks (Isometric Oblique Projection)
  const W = 145; // Lebar balok
  const H = 100; // Tinggi balok
  const h1 = 28; // Lapisan 1: Kerak Atas (Tan Sandy Soil)
  const h2 = 34; // Lapisan 2: Kerak Tengah (Batuan Beku Cokelat)

  // Vektor Kedalaman Sesar (Depth Vector)
  const Dx = 80;
  const Dy = -48;

  // Nilai pergeseran relatif sepanjang vektor sesar
  const maxSlip = 32;
  const sx = slip * maxSlip * (80 / 93.3);
  const sy = slip * maxSlip * (48 / 93.3);

  // Titik temu sesar di tengah saat netral (slip = 0)
  const cx = 275;
  const cy = 135;

  // Koordinat Balok Kiri (Kerak Kiri - Meluncur ke Depan / Bawah-Kiri)
  const L_front_tl: [number, number] = [cx - W - sx, cy + sy];
  const L_front_tr: [number, number] = [cx - sx, cy + sy];
  const L_top_back_l: [number, number] = [cx - W - sx + Dx, cy + sy + Dy];
  const L_top_back_r: [number, number] = [cx - sx + Dx, cy + sy + Dy];

  // Koordinat Balok Kanan (Kerak Kanan - Meluncur ke Belakang / Atas-Kanan)
  const R_front_tl: [number, number] = [cx + sx, cy - sy];
  const R_front_tr: [number, number] = [cx + W + sx, cy - sy];
  const R_top_back_l: [number, number] = [cx + sx + Dx, cy - sy + Dy];
  const R_top_back_r: [number, number] = [cx + W + sx + Dx, cy - sy + Dy];

  // Mapping Parametris Panah Merah 3D di Permukaan Atas
  const getParamPoint = (front_tl: [number, number], u: number, v: number): string => {
    const px = front_tl[0] + u * W + v * Dx;
    const py = front_tl[1] + v * Dy;
    return `${px.toFixed(1)},${py.toFixed(1)}`;
  };

  // Panah Balok Kiri (Menunjuk ke Bawah-Depan sepanjang arah patahan)
  const leftArrowUV: [number, number][] = [
    [0.54, 0.74],
    [0.46, 0.74],
    [0.46, 0.46],
    [0.36, 0.49],
    [0.50, 0.18],
    [0.64, 0.49],
    [0.54, 0.46],
  ];
  const leftArrowPoints = leftArrowUV.map(([u, v]) => getParamPoint(L_front_tl, u, v)).join(' ');

  // Panah Balok Kanan (Menunjuk ke Atas-Belakang sepanjang arah patahan)
  const rightArrowUV: [number, number][] = [
    [0.46, 0.26],
    [0.54, 0.26],
    [0.54, 0.54],
    [0.64, 0.51],
    [0.50, 0.82],
    [0.36, 0.51],
    [0.46, 0.54],
  ];
  const rightArrowPoints = rightArrowUV.map(([u, v]) => getParamPoint(R_front_tl, u, v)).join(' ');

  // Titik Pin "Gerak Transform" di Pusat Patahan
  const pinX = cx + Dx * 0.45;
  const pinY = cy + Dy * 0.45;

  // Status Teks Edukatif
  let statusText = 'LEMPENG MENYATU (KONDISI AWAL)';
  let statusColor = 'text-sky-400';
  let dotColor = 'bg-sky-400';
  if (slip > 0.05 && slip < 0.9) {
    statusText = 'LEMPENG SEDANG BERGESER (SESAR AKTIF)';
    statusColor = 'text-amber-400';
    dotColor = 'bg-amber-400 animate-pulse';
  } else if (slip >= 0.9) {
    statusText = 'TEGANGAN GESER MAKSIMUM (GEMPA DANGKAL)';
    statusColor = 'text-rose-400';
    dotColor = 'bg-rose-500 animate-ping';
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between bg-[#09090b] select-none p-1 sm:p-2 font-pixel">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between px-2 pt-2 pb-1.5 bg-slate-950/95 border-b border-amber-800/60 text-[13.5px] z-10 shadow-sm gap-2 font-semibold">
        <span className="text-amber-300 font-pixel-title text-[12.5px] font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          BATAS TRANSFORM: SESAR GESER (3D CRUSTAL BLOCKS)
        </span>
        <span className={`text-[12px] font-bold flex items-center gap-1 ${statusColor}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
          {statusText}
        </span>
      </div>

      {/* SVG Canvas Simulator: 2 Balok Kubus 3D Pejal Menyatu & Bergeser */}
      <div className="w-full flex-1 min-h-0 relative flex items-center justify-center overflow-hidden my-1">
        <svg
          viewBox="0 0 600 270"
          className="w-full h-full object-contain drop-shadow-2xl"
          shapeRendering="geometricPrecision"
        >
          <defs>
            <linearGradient id="transCanvasBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0b0f19" />
              <stop offset="50%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#0b0f19" />
            </linearGradient>

            {/* Permukaan Atas Pasir Gurun (Top Surface) */}
            <linearGradient id="topSurfaceGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e2ba7d" />
              <stop offset="100%" stopColor="#c99c56" />
            </linearGradient>

            {/* Dinding Depan: 3 Lapisan Strata Geologis */}
            <linearGradient id="strataL1Front" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#b8936f" />
              <stop offset="100%" stopColor="#a47e5b" />
            </linearGradient>
            <linearGradient id="strataL2Front" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#734522" />
              <stop offset="100%" stopColor="#5c3417" />
            </linearGradient>
            <linearGradient id="strataL3Front" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#db5a38" />
              <stop offset="100%" stopColor="#be4424" />
            </linearGradient>

            {/* Dinding Samping / Bayangan Perspektif: 3 Lapisan Strata */}
            <linearGradient id="strataL1Side" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8c6646" />
              <stop offset="100%" stopColor="#704e33" />
            </linearGradient>
            <linearGradient id="strataL2Side" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#4e2c14" />
              <stop offset="100%" stopColor="#3d210d" />
            </linearGradient>
            <linearGradient id="strataL3Side" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#a63a1c" />
              <stop offset="100%" stopColor="#82280f" />
            </linearGradient>

            {/* Efek Bayangan Lembut Panah */}
            <filter id="arrowDropGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.5)" />
            </filter>
          </defs>

          {/* Latar Belakang Kanvas */}
          <rect width="600" height="270" fill="url(#transCanvasBg)" rx="8" />

          {/* Bayangan Tanah 3D di Bawah Kedua Balok */}
          <polygon
            points={`
              ${L_front_tl[0] - 8},${L_front_tl[1] + H + 10} 
              ${R_front_tr[0] + 12},${R_front_tr[1] + H + 10} 
              ${R_top_back_r[0] + 12},${R_top_back_r[1] + H + 6} 
              ${L_top_back_l[0] - 8},${L_top_back_l[1] + H + 6}
            `}
            fill="rgba(0,0,0,0.4)"
          />

          {/* ═════════════════════════════════════════════════════════════ */}
          {/* 1. BALOK KANAN (SOLID 3D CUBE - BERGERAK KE ATAS/BELAKANG)    */}
          {/* ═════════════════════════════════════════════════════════════ */}
          <g id="right-crust-block">
            {/* Dinding Samping Luar Kanan (3 Strata Bertingkat) */}
            <polygon
              points={`
                ${R_front_tr[0]},${R_front_tr[1]} 
                ${R_top_back_r[0]},${R_top_back_r[1]} 
                ${R_top_back_r[0]},${R_top_back_r[1] + h1} 
                ${R_front_tr[0]},${R_front_tr[1] + h1}
              `}
              fill="url(#strataL1Side)"
              stroke="#3d210d"
              strokeWidth="0.8"
            />
            <polygon
              points={`
                ${R_front_tr[0]},${R_front_tr[1] + h1} 
                ${R_top_back_r[0]},${R_top_back_r[1] + h1} 
                ${R_top_back_r[0]},${R_top_back_r[1] + h1 + h2} 
                ${R_front_tr[0]},${R_front_tr[1] + h1 + h2}
              `}
              fill="url(#strataL2Side)"
              stroke="#3d210d"
              strokeWidth="0.8"
            />
            <polygon
              points={`
                ${R_front_tr[0]},${R_front_tr[1] + h1 + h2} 
                ${R_top_back_r[0]},${R_top_back_r[1] + h1 + h2} 
                ${R_top_back_r[0]},${R_top_back_r[1] + H} 
                ${R_front_tr[0]},${R_front_tr[1] + H}
              `}
              fill="url(#strataL3Side)"
              stroke="#3d210d"
              strokeWidth="0.8"
            />

            {/* Dinding Muka Depan Balok Kanan (3 Strata Horizontal) */}
            <polygon
              points={`
                ${R_front_tl[0]},${R_front_tl[1]} 
                ${R_front_tr[0]},${R_front_tr[1]} 
                ${R_front_tr[0]},${R_front_tr[1] + h1} 
                ${R_front_tl[0]},${R_front_tl[1] + h1}
              `}
              fill="url(#strataL1Front)"
              stroke="#451a03"
              strokeWidth="0.8"
            />
            <polygon
              points={`
                ${R_front_tl[0]},${R_front_tl[1] + h1} 
                ${R_front_tr[0]},${R_front_tr[1] + h1} 
                ${R_front_tr[0]},${R_front_tr[1] + h1 + h2} 
                ${R_front_tl[0]},${R_front_tl[1] + h1 + h2}
              `}
              fill="url(#strataL2Front)"
              stroke="#451a03"
              strokeWidth="0.8"
            />
            <polygon
              points={`
                ${R_front_tl[0]},${R_front_tl[1] + h1 + h2} 
                ${R_front_tr[0]},${R_front_tr[1] + h1 + h2} 
                ${R_front_tr[0]},${R_front_tr[1] + H} 
                ${R_front_tl[0]},${R_front_tl[1] + H}
              `}
              fill="url(#strataL3Front)"
              stroke="#451a03"
              strokeWidth="0.8"
            />

            {/* Permukaan Atas Balok Kanan (Top Surface) */}
            <polygon
              points={`
                ${R_front_tl[0]},${R_front_tl[1]} 
                ${R_front_tr[0]},${R_front_tr[1]} 
                ${R_top_back_r[0]},${R_top_back_r[1]} 
                ${R_top_back_l[0]},${R_top_back_l[1]}
              `}
              fill="url(#topSurfaceGrad)"
              stroke="#784824"
              strokeWidth="1.2"
            />

            {/* Panah Merah Balok Kanan (Menunjuk ke Atas-Belakang) */}
            <polygon
              points={rightArrowPoints}
              fill="#dc2626"
              stroke="#7f1d1d"
              strokeWidth="1.2"
              filter="url(#arrowDropGlow)"
            />
          </g>

          {/* ═════════════════════════════════════════════════════════════ */}
          {/* 2. BIDANG SESAR TERBUKA (EXPOSED FAULT STEP WALL)             */}
          {/* Muncul saat balok bergeser relatif (slip > 0.005)            */}
          {/* ═════════════════════════════════════════════════════════════ */}
          {slip > 0.005 ? (
            <g id="exposed-fault-plane">
              {/* Dinding Gesekan Sesar: 3 Strata Bersambung Sempurna */}
              <polygon
                points={`
                  ${L_front_tr[0]},${L_front_tr[1]} 
                  ${R_front_tl[0]},${R_front_tl[1]} 
                  ${R_front_tl[0]},${R_front_tl[1] + h1} 
                  ${L_front_tr[0]},${L_front_tr[1] + h1}
                `}
                fill="url(#strataL1Side)"
                stroke="#3d210d"
                strokeWidth="0.8"
              />
              <polygon
                points={`
                  ${L_front_tr[0]},${L_front_tr[1] + h1} 
                  ${R_front_tl[0]},${R_front_tl[1] + h1} 
                  ${R_front_tl[0]},${R_front_tl[1] + h1 + h2} 
                  ${L_front_tr[0]},${L_front_tr[1] + h1 + h2}
                `}
                fill="url(#strataL2Side)"
                stroke="#3d210d"
                strokeWidth="0.8"
              />
              <polygon
                points={`
                  ${L_front_tr[0]},${L_front_tr[1] + h1 + h2} 
                  ${R_front_tl[0]},${R_front_tl[1] + h1 + h2} 
                  ${R_front_tl[0]},${R_front_tl[1] + H} 
                  ${L_front_tr[0]},${L_front_tr[1] + H}
                `}
                fill="url(#strataL3Side)"
                stroke="#3d210d"
                strokeWidth="0.8"
              />

              {/* Garis batas sesar alami */}
              <line
                x1={L_front_tr[0]}
                y1={L_front_tr[1]}
                x2={R_front_tl[0]}
                y2={R_front_tl[1]}
                stroke="#3d210d"
                strokeWidth="0.8"
              />
            </g>
          ) : (
            /* Garis Batas Patahan Halus Saat Kedua Balok Menyatu Utuh */
            <g id="fault-seam-unified">
              <line
                x1={cx}
                y1={cy}
                x2={cx}
                y2={cy + H}
                stroke="#451a03"
                strokeWidth="1.8"
                strokeDasharray="4,3"
              />
              <line
                x1={cx}
                y1={cy}
                x2={cx + Dx}
                y2={cy + Dy}
                stroke="#451a03"
                strokeWidth="1.8"
                strokeDasharray="4,3"
              />
            </g>
          )}

          {/* ═════════════════════════════════════════════════════════════ */}
          {/* 3. BALOK KIRI (SOLID 3D CUBE - BERGERAK KE BAWAH/DEPAN)       */}
          {/* ═════════════════════════════════════════════════════════════ */}
          <g id="left-crust-block">
            {/* Dinding Muka Depan Balok Kiri (3 Strata Horizontal) */}
            <polygon
              points={`
                ${L_front_tl[0]},${L_front_tl[1]} 
                ${L_front_tr[0]},${L_front_tr[1]} 
                ${L_front_tr[0]},${L_front_tr[1] + h1} 
                ${L_front_tl[0]},${L_front_tl[1] + h1}
              `}
              fill="url(#strataL1Front)"
              stroke="#451a03"
              strokeWidth="0.8"
            />
            <polygon
              points={`
                ${L_front_tl[0]},${L_front_tl[1] + h1} 
                ${L_front_tr[0]},${L_front_tr[1] + h1} 
                ${L_front_tr[0]},${L_front_tr[1] + h1 + h2} 
                ${L_front_tl[0]},${L_front_tl[1] + h1 + h2}
              `}
              fill="url(#strataL2Front)"
              stroke="#451a03"
              strokeWidth="0.8"
            />
            <polygon
              points={`
                ${L_front_tl[0]},${L_front_tl[1] + h1 + h2} 
                ${L_front_tr[0]},${L_front_tr[1] + h1 + h2} 
                ${L_front_tr[0]},${L_front_tr[1] + H} 
                ${L_front_tl[0]},${L_front_tl[1] + H}
              `}
              fill="url(#strataL3Front)"
              stroke="#451a03"
              strokeWidth="0.8"
            />

            {/* Permukaan Atas Balok Kiri (Top Surface) */}
            <polygon
              points={`
                ${L_front_tl[0]},${L_front_tl[1]} 
                ${L_front_tr[0]},${L_front_tr[1]} 
                ${L_top_back_r[0]},${L_top_back_r[1]} 
                ${L_top_back_l[0]},${L_top_back_l[1]}
              `}
              fill="url(#topSurfaceGrad)"
              stroke="#784824"
              strokeWidth="1.2"
            />

            {/* Panah Merah Balok Kiri (Menunjuk ke Bawah-Depan) */}
            <polygon
              points={leftArrowPoints}
              fill="#dc2626"
              stroke="#7f1d1d"
              strokeWidth="1.2"
              filter="url(#arrowDropGlow)"
            />
          </g>

          {/* ═════════════════════════════════════════════════════════════ */}
          {/* 4. PIN GANTUNG "Gerak Transform" DI ATAS PATAHAN              */}
          {/* ═════════════════════════════════════════════════════════════ */}
          <g id="transform-callout-pin">
            {/* Kotak Putih Label Pin */}
            <rect
              x={pinX - 65}
              y={16}
              width="130"
              height="30"
              rx="6"
              fill="#ffffff"
              stroke="#e2e8f0"
              strokeWidth="1.5"
              filter="url(#arrowDropGlow)"
            />
            <text
              x={pinX}
              y={36}
              fill="#0f172a"
              fontSize="12"
              fontFamily="'Segoe UI', Inter, sans-serif"
              fontWeight="bold"
              textAnchor="middle"
            >
              Gerak Transform
            </text>

            {/* Tiang Penusuk Pin */}
            <line
              x1={pinX}
              y1={46}
              x2={pinX}
              y2={pinY - 6}
              stroke="#ffffff"
              strokeWidth="2.5"
            />

            {/* Kepala Pin Hijau */}
            <circle
              cx={pinX}
              cy={pinY}
              r="8"
              fill="#15803d"
              stroke="#ffffff"
              strokeWidth="2.5"
              filter="url(#arrowDropGlow)"
            />
            <circle cx={pinX - 2} cy={pinY - 2} r="2.5" fill="#86efac" />
          </g>
        </svg>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN: TAS SIAGA BENCANA 72 JAM (AREA 4 TEMUAN 1)
// ═════════════════════════════════════════════════════════════════════════════
function EarthquakePrepIllustration() {
  const [activeItem, setActiveItem] = useState<'air' | 'p3k' | 'senter' | 'dokumen'>('air');

  const itemDetails = {
    air: {
      title: 'AIR MINUM & RANSUM ENERGI',
      desc: 'Minimal 3 liter air per orang per hari serta ransum biskuit/makanan kaleng tahan lama berkalori tinggi yang cukup untuk bertahan hidup mandiri minimal 72 jam pertama.',
      color: '#38bdf8',
    },
    p3k: {
      title: 'KOTAK P3K & OBAT PRIBADI',
      desc: 'Kasa steril, perban, plester, cairan antiseptik luka, obat pereda nyeri, dan obat-obatan rutin pribadi yang tersimpan rapat dalam wadah anti-air.',
      color: '#ef4444',
    },
    senter: {
      title: 'SENTER LED & PELUIT DARURAT',
      desc: 'Senter tahan air dengan baterai cadangan untuk penerangan saat listrik padam total, serta peluit darurat untuk memanggil tim SAR tanpa menguras tenaga vokal.',
      color: '#facc15',
    },
    dokumen: {
      title: 'DOKUMEN PENTING & UANG TUNAI',
      desc: 'Fotokopi Kartu Keluarga, ijazah, akta lahir, KTP, kartu identitas, dan uang tunai secukupnya yang terlindungi aman dalam kantung ziplock kedap air.',
      color: '#10b981',
    },
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-2 font-pixel">
      {/* Top Banner */}
      <div className="w-full flex items-center justify-between px-2 pb-1.5 border-b border-slate-800 shrink-0">
        <span className="text-[13px] sm:text-[15px] font-pixel-title text-sky-400 font-bold flex items-center gap-1.5">
          <PixelIcon name="shield" size={14} />
          TAS SIAGA BENCANA (SURVIVAL KIT 72 JAM)
        </span>
        <span className="text-[13.5px] sm:text-[13px] text-slate-400 font-pixel font-semibold">
          STANDAR BNPB &amp; BPBD
        </span>
      </div>

      {/* Button Switcher Item (Di Atas - 100% Selalu Terlihat, Tidak Akan Terpotong!) */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-1.5 py-1.5 shrink-0 z-10">
        <button
          onClick={() => {
            retroAudio.playSelect?.();
            setActiveItem('air');
          }}
          className={`px-2 py-1.5 sm:py-2 rounded-lg border-2 text-[13px] sm:text-[13px] font-pixel-title cursor-pointer transition-all active:translate-y-0.5 flex items-center justify-center gap-1.5 ${activeItem === 'air'
            ? 'bg-sky-500 text-slate-950 border-sky-300 font-bold shadow-[0_2px_0_#0369a1]'
            : 'bg-slate-800/90 text-sky-300 border-slate-700 hover:border-sky-500 hover:text-white'}`}
        >
          <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />
          <span>1. AIR &amp; RANSUM</span>
        </button>
        <button
          onClick={() => {
            retroAudio.playSelect?.();
            setActiveItem('p3k');
          }}
          className={`px-2 py-1.5 sm:py-2 rounded-lg border-2 text-[13px] sm:text-[13px] font-pixel-title cursor-pointer transition-all active:translate-y-0.5 flex items-center justify-center gap-1.5 ${activeItem === 'p3k'
            ? 'bg-rose-500 text-slate-950 border-rose-300 font-bold shadow-[0_2px_0_#991b1b]'
            : 'bg-slate-800/90 text-rose-300 border-slate-700 hover:border-rose-500 hover:text-white'}`}
        >
          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
          <span>2. KOTAK P3K</span>
        </button>
        <button
          onClick={() => {
            retroAudio.playSelect?.();
            setActiveItem('senter');
          }}
          className={`px-2 py-1.5 sm:py-2 rounded-lg border-2 text-[13px] sm:text-[13px] font-pixel-title cursor-pointer transition-all active:translate-y-0.5 flex items-center justify-center gap-1.5 ${activeItem === 'senter'
            ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold shadow-[0_2px_0_#92400e]'
            : 'bg-slate-800/90 text-amber-300 border-slate-700 hover:border-amber-400 hover:text-white'}`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
          <span>3. SENTER &amp; PELUIT</span>
        </button>
        <button
          onClick={() => {
            retroAudio.playSelect?.();
            setActiveItem('dokumen');
          }}
          className={`px-2 py-1.5 sm:py-2 rounded-lg border-2 text-[13px] sm:text-[13px] font-pixel-title cursor-pointer transition-all active:translate-y-0.5 flex items-center justify-center gap-1.5 ${activeItem === 'dokumen'
            ? 'bg-emerald-500 text-slate-950 border-emerald-300 font-bold shadow-[0_2px_0_#065f46]'
            : 'bg-slate-800/90 text-emerald-300 border-slate-700 hover:border-emerald-500 hover:text-white'}`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <span>4. DOKUMEN &amp; UANG</span>
        </button>
      </div>

      {/* SVG Backpack & Items Visual (High-Detail Pixel Art, NO text inside image) */}
      <div className="w-full flex-1 min-h-0 flex items-center justify-center p-1 sm:p-2">
        <svg viewBox="0 0 540 220" className="w-full h-full object-contain" shapeRendering="crispEdges">
          {/* Background Room Corner */}
          <rect x="0" y="0" width="540" height="220" fill="#0b0f19" />
          {/* Floor & Wall Line */}
          <rect x="0" y="0" width="540" height="175" fill="#0f172a" />
          <line x1="0" y1="175" x2="540" y2="175" stroke="#1e293b" strokeWidth="3" />
          <rect x="0" y="175" width="540" height="45" fill="#1e293b" />
          {/* Lantai Kayu Planks */}
          <line x1="120" y1="175" x2="100" y2="220" stroke="#0f172a" strokeWidth="2" />
          <line x1="260" y1="175" x2="240" y2="220" stroke="#0f172a" strokeWidth="2" />
          <line x1="400" y1="175" x2="380" y2="220" stroke="#0f172a" strokeWidth="2" />

          {/* ── DETAIL PIXEL BACKPACK (KIRI) ── */}
          <g transform="translate(45, 18)">
            {/* Bayangan Tas di Lantai */}
            <ellipse cx="65" cy="165" rx="55" ry="10" fill="#070b12" opacity="0.7" />

            {/* Matras Darurat Gulung di Atas Tas (Thermal Sleeping Mat Roll) */}
            <g transform="translate(18, 0)">
              <rect x="0" y="2" width="94" height="20" rx="6" fill="#0284c7" stroke="#0c4a6e" strokeWidth="2" />
              <rect x="4" y="6" width="86" height="4" fill="#38bdf8" />
              <circle cx="8" cy="12" r="6" fill="#0369a1" />
              <circle cx="8" cy="12" r="3" fill="#075985" />
              {/* Tali Pengikat Matras */}
              <rect x="24" y="0" width="6" height="24" fill="#1e293b" />
              <rect x="23" y="10" width="8" height="4" fill="#94a3b8" />
              <rect x="68" y="0" width="6" height="24" fill="#1e293b" />
              <rect x="67" y="10" width="8" height="4" fill="#94a3b8" />
            </g>

            {/* Tali Bahu Ransel Padded Straps Belakang */}
            <rect x="22" y="18" width="10" height="45" rx="4" fill="#7f1d1d" stroke="#450a0a" strokeWidth="2" />
            <rect x="98" y="18" width="10" height="45" rx="4" fill="#7f1d1d" stroke="#450a0a" strokeWidth="2" />

            {/* Bodi Utama Tas Ransel Merah BPBD */}
            <rect x="18" y="24" width="94" height="135" rx="14" fill="#b91c1c" stroke="#450a0a" strokeWidth="3" />
            <rect x="24" y="30" width="82" height="123" rx="10" fill="#dc2626" />

            {/* Highlight Sisi Atas Tas */}
            <path d="M 28 32 Q 65 28 102 32" stroke="#f87171" strokeWidth="2" fill="none" />

            {/* Kompartemen Depan Atas */}
            <rect x="28" y="42" width="74" height="32" rx="6" fill="#991b1b" stroke="#450a0a" strokeWidth="2" />
            <rect x="32" y="46" width="66" height="24" rx="4" fill="#b91c1c" />
            {/* Resleting Atas */}
            <line x1="36" y1="44" x2="94" y2="44" stroke="#e2e8f0" strokeWidth="1.5" />
            <rect x="60" y="41" width="5" height="4" fill="#facc15" />

            {/* Kompartemen Depan Utama Bawah */}
            <rect x="26" y="82" width="78" height="70" rx="8" fill="#991b1b" stroke="#450a0a" strokeWidth="2" />
            <rect x="30" y="86" width="70" height="62" rx="6" fill="#b91c1c" />
            {/* Resleting Bawah */}
            <path d="M 32 90 L 98 90" stroke="#e2e8f0" strokeWidth="2" />
            <rect x="62" y="87" width="6" height="5" fill="#facc15" />

            {/* Pita Scotlight Reflektor Kuning-Fluorescent */}
            <rect x="22" y="104" width="86" height="10" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
            <rect x="24" y="106" width="82" height="3" fill="#fef08a" />

            {/* Lambang Palang Putih Medis/Siaga (Tanpa Teks!) */}
            <rect x="58" y="122" width="14" height="18" rx="2" fill="#ffffff" />
            <rect x="52" y="125" width="26" height="12" rx="2" fill="#ffffff" />
            <rect x="60" y="124" width="10" height="14" fill="#dc2626" />
            <rect x="54" y="127" width="22" height="8" fill="#dc2626" />

            {/* Kantong Jaring Samping Kiri (Tempat Botol Air) */}
            <rect x="6" y="75" width="14" height="60" rx="3" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
            {/* Botol Air di Samping */}
            <rect x="8" y="52" width="10" height="30" rx="3" fill="#0284c7" />
            <rect x="10" y="46" width="6" height="7" fill="#38bdf8" />
            <rect x="11" y="43" width="4" height="4" fill="#e0f2fe" />
            {/* Pola Jaring Mesh */}
            <line x1="6" y1="85" x2="20" y2="95" stroke="#475569" strokeWidth="1" />
            <line x1="6" y1="95" x2="20" y2="105" stroke="#475569" strokeWidth="1" />
            <line x1="6" y1="105" x2="20" y2="115" stroke="#475569" strokeWidth="1" />

            {/* Kantong Jaring Samping Kanan (Tempat Senter) */}
            <rect x="110" y="75" width="14" height="60" rx="3" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="113" y="56" width="8" height="25" rx="2" fill="#334155" />
            <rect x="112" y="52" width="10" height="5" fill="#facc15" />

            {/* Pegangan Atas Tas (Top Grab Handle) */}
            <rect x="50" y="18" width="30" height="10" rx="4" fill="none" stroke="#7f1d1d" strokeWidth="4" />
          </g>

          {/* ── DETAIL GEAR SHOWCASE (KANAN) - 100% BEBAS TEKS DALAM GAMBAR ── */}
          <g transform="translate(205, 16)">
            {/* Frame Wadah Peralatan */}
            <rect x="0" y="0" width="315" height="175" rx="10" fill="#0f172a" stroke={itemDetails[activeItem].color} strokeWidth="2.5" />
            <rect x="0" y="0" width="315" height="28" rx="10" fill="#1e293b" />
            <text x="14" y="19" fill={itemDetails[activeItem].color} fontSize="11" fontWeight="bold" fontFamily="'Pixelify Sans', sans-serif">
              {itemDetails[activeItem].title}
            </text>

            {/* 1. VISUAL AIR & RANSUM ENERGI (BEBAS TEKS) */}
            {activeItem === 'air' && (
              <g transform="translate(10, 38)">
                {/* Botol Air Tritan Transparan dengan Skala Ukur */}
                <g transform="translate(0, 0)">
                  <rect x="4" y="24" width="36" height="76" rx="8" fill="#0369a1" stroke="#38bdf8" strokeWidth="2.5" />
                  {/* Air di dalam botol (Efek Gelombang & Gradien) */}
                  <rect x="8" y="38" width="28" height="58" rx="5" fill="#38bdf8" opacity="0.85" />
                  <line x1="8" y1="38" x2="36" y2="38" stroke="#ffffff" strokeWidth="1.5" />
                  {/* Pantulan Cahaya Botol */}
                  <line x1="12" y1="44" x2="12" y2="88" stroke="#e0f2fe" strokeWidth="2" strokeLinecap="round" />
                  {/* Garis Ukur Mililiter di Samping */}
                  <line x1="30" y1="50" x2="34" y2="50" stroke="#0c4a6e" strokeWidth="1.5" />
                  <line x1="28" y1="62" x2="34" y2="62" stroke="#0c4a6e" strokeWidth="1.5" />
                  <line x1="30" y1="74" x2="34" y2="74" stroke="#0c4a6e" strokeWidth="1.5" />
                  {/* Leher & Tutup Botol dengan Tali Gantungan */}
                  <rect x="12" y="12" width="20" height="14" rx="2" fill="#075985" stroke="#38bdf8" strokeWidth="1.5" />
                  <rect x="10" y="6" width="24" height="8" rx="2" fill="#0284c7" />
                  <path d="M 32 10 Q 42 16 40 28" fill="none" stroke="#0284c7" strokeWidth="2" />
                </g>

                {/* Kemasan Ransum Biskuit Kalori Foil Emas (Tanpa Tulisan) */}
                <g transform="translate(48, 14)">
                  <rect x="0" y="8" width="62" height="42" rx="4" fill="#d97706" stroke="#f59e0b" strokeWidth="2.5" />
                  {/* Segel Gigi Foil Atas & Bawah */}
                  <line x1="0" y1="12" x2="62" y2="12" stroke="#fef3c7" strokeWidth="1.5" />
                  <line x1="0" y1="46" x2="62" y2="46" stroke="#fef3c7" strokeWidth="1.5" />
                  {/* Emboss Grid Tekstur Biskuit */}
                  <rect x="8" y="18" width="46" height="22" rx="2" fill="#b45309" />
                  <circle cx="16" cy="24" r="2" fill="#fde68a" />
                  <circle cx="26" cy="24" r="2" fill="#fde68a" />
                  <circle cx="36" cy="24" r="2" fill="#fde68a" />
                  <circle cx="46" cy="24" r="2" fill="#fde68a" />
                  <circle cx="16" cy="34" r="2" fill="#fde68a" />
                  <circle cx="26" cy="34" r="2" fill="#fde68a" />
                  <circle cx="36" cy="34" r="2" fill="#fde68a" />
                  <circle cx="46" cy="34" r="2" fill="#fde68a" />
                </g>

                {/* Makanan Kaleng Darurat (Pull-Ring Tin Can) */}
                <g transform="translate(50, 64)">
                  <ellipse cx="28" cy="10" rx="26" ry="8" fill="#64748b" stroke="#94a3b8" strokeWidth="2" />
                  <rect x="2" y="10" width="52" height="25" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
                  <ellipse cx="28" cy="35" rx="26" ry="8" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
                  {/* Cincin Pembuka Tutup Kaleng */}
                  <circle cx="24" cy="9" r="4" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
                  <rect x="28" y="8" width="6" height="2" fill="#e2e8f0" />
                </g>
              </g>
            )}

            {/* 2. VISUAL KOTAK P3K & OBAT MEDIS (BEBAS TEKS) */}
            {activeItem === 'p3k' && (
              <g transform="translate(10, 36)">
                {/* Kotak Medis Merah dengan Palang Putih Timbul */}
                <g transform="translate(0, 5)">
                  <rect x="0" y="8" width="68" height="52" rx="6" fill="#dc2626" stroke="#991b1b" strokeWidth="2.5" />
                  <rect x="4" y="12" width="60" height="44" rx="4" fill="#ef4444" />
                  {/* Pegangan Koper Medis */}
                  <rect x="24" y="0" width="20" height="9" rx="3" fill="none" stroke="#dc2626" strokeWidth="3" />
                  {/* Lambang Palang Putih Bersih */}
                  <rect x="28" y="22" width="12" height="24" fill="#ffffff" />
                  <rect x="22" y="28" width="24" height="12" fill="#ffffff" />
                </g>

                {/* Botol Antiseptik dengan Pipet Tetes */}
                <g transform="translate(72, 5)">
                  <rect x="4" y="18" width="24" height="42" rx="4" fill="#92400e" stroke="#78350f" strokeWidth="2" />
                  <rect x="8" y="24" width="16" height="22" fill="#fef3c7" rx="2" />
                  <circle cx="16" cy="35" r="3" fill="#dc2626" />
                  {/* Leher & Pipet */}
                  <rect x="10" y="10" width="12" height="8" fill="#1e293b" />
                  <ellipse cx="16" cy="8" rx="6" ry="4" fill="#0f172a" />
                </g>

                {/* Strip Blister Obat Kapsul 6 Butir */}
                <g transform="translate(2, 68)">
                  <rect x="0" y="0" width="62" height="34" rx="3" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
                  {/* Kapsul 1, 2, 3 */}
                  <rect x="6" y="5" width="14" height="8" rx="4" fill="#3b82f6" />
                  <rect x="13" y="5" width="7" height="8" rx="4" fill="#ffffff" />
                  <rect x="24" y="5" width="14" height="8" rx="4" fill="#ef4444" />
                  <rect x="31" y="5" width="7" height="8" rx="4" fill="#ffffff" />
                  <rect x="42" y="5" width="14" height="8" rx="4" fill="#22c55e" />
                  <rect x="49" y="5" width="7" height="8" rx="4" fill="#ffffff" />
                  {/* Kapsul 4, 5, 6 */}
                  <rect x="6" y="19" width="14" height="8" rx="4" fill="#eab308" />
                  <rect x="13" y="19" width="7" height="8" rx="4" fill="#ffffff" />
                  <rect x="24" y="19" width="14" height="8" rx="4" fill="#a855f7" />
                  <rect x="31" y="19" width="7" height="8" rx="4" fill="#ffffff" />
                  <rect x="42" y="19" width="14" height="8" rx="4" fill="#06b6d4" />
                  <rect x="49" y="19" width="7" height="8" rx="4" fill="#ffffff" />
                </g>

                {/* Gulungan Perban Kasa Steril */}
                <g transform="translate(70, 58)">
                  <ellipse cx="20" cy="22" rx="16" ry="16" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
                  <ellipse cx="20" cy="22" rx="8" ry="8" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
                  <path d="M 28 32 L 38 40" stroke="#f8fafc" strokeWidth="4" />
                </g>
              </g>
            )}

            {/* 3. VISUAL SENTER TAKTIS & PELUIT SAR (BEBAS TEKS) */}
            {activeItem === 'senter' && (
              <g transform="translate(10, 36)">
                {/* Senter Taktis Logam dengan Sorot Lampu */}
                <g transform="translate(0, 8)">
                  {/* Sorot Cahaya Terang */}
                  <polygon points="45,18 105,2 105,48 45,30" fill="url(#senterBeamGrad)" opacity="0.65" />
                  {/* Kepala Senter Bezel */}
                  <polygon points="30,12 45,8 45,40 30,36" fill="#475569" stroke="#64748b" strokeWidth="2" />
                  <rect x="44" y="8" width="4" height="32" rx="2" fill="#38bdf8" />
                  {/* Bodi Tabung Senter Bertekstur Knurling */}
                  <rect x="0" y="17" width="30" height="14" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                  <line x1="6" y1="17" x2="6" y2="31" stroke="#475569" strokeWidth="1" />
                  <line x1="12" y1="17" x2="12" y2="31" stroke="#475569" strokeWidth="1" />
                  <line x1="18" y1="17" x2="18" y2="31" stroke="#475569" strokeWidth="1" />
                  <line x1="24" y1="17" x2="24" y2="31" stroke="#475569" strokeWidth="1" />
                  {/* Tombol Saklar Oranye */}
                  <rect x="12" y="13" width="6" height="4" rx="1" fill="#f97316" />
                </g>

                {/* Peluit Darurat Oranye Terang dengan Tali Gantungan */}
                <g transform="translate(6, 60)">
                  {/* Tali Gantungan Lanyard */}
                  <path d="M 12 18 Q 0 35 20 45 Q 40 50 35 24" fill="none" stroke="#f97316" strokeWidth="2.5" />
                  {/* Bodi Peluit */}
                  <rect x="25" y="12" width="35" height="16" rx="4" fill="#ea580c" stroke="#9a3412" strokeWidth="2" />
                  <rect x="48" y="15" width="18" height="10" fill="#f97316" />
                  {/* Lubang Udara & Bola Peluit */}
                  <rect x="36" y="9" width="8" height="6" fill="#431407" />
                  <circle cx="34" cy="20" r="4" fill="#ffffff" opacity="0.8" />
                </g>

                {/* 2 Baterai Cadangan AA */}
                <g transform="translate(74, 60)">
                  {/* Baterai 1 */}
                  <rect x="0" y="4" width="14" height="32" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                  <rect x="0" y="4" width="14" height="8" fill="#d97706" />
                  <rect x="4" y="0" width="6" height="4" fill="#d97706" />
                  {/* Baterai 2 */}
                  <rect x="18" y="4" width="14" height="32" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                  <rect x="18" y="4" width="14" height="8" fill="#d97706" />
                  <rect x="22" y="0" width="6" height="4" fill="#d97706" />
                </g>
              </g>
            )}

            {/* 4. VISUAL DOKUMEN PENTING & UANG (BEBAS TEKS) */}
            {activeItem === 'dokumen' && (
              <g transform="translate(10, 34)">
                {/* Kantong Ziplock Kedap Air (Waterproof Pouch) */}
                <rect x="0" y="4" width="102" height="74" rx="6" fill="#047857" opacity="0.25" stroke="#10b981" strokeWidth="2" />
                {/* Segel Klip Biru Ziplock */}
                <rect x="0" y="4" width="102" height="8" rx="2" fill="#0284c7" />
                <line x1="4" y1="8" x2="98" y2="8" stroke="#38bdf8" strokeWidth="2" />

                {/* Lembar Dokumen / Sertifikat Berlipat di Dalam Pouch */}
                <g transform="translate(8, 16)">
                  <rect x="0" y="0" width="55" height="54" rx="2" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
                  {/* Pita / Lambang Segel Garuda Merah */}
                  <circle cx="28" cy="14" r="6" fill="#dc2626" />
                  {/* Baris Dokumen Abstrak (Bukan Huruf/Kata) */}
                  <line x1="8" y1="26" x2="47" y2="26" stroke="#475569" strokeWidth="2" />
                  <line x1="8" y1="33" x2="42" y2="33" stroke="#94a3b8" strokeWidth="1.5" />
                  <line x1="8" y1="40" x2="47" y2="40" stroke="#94a3b8" strokeWidth="1.5" />
                  <line x1="8" y1="47" x2="35" y2="47" stroke="#94a3b8" strokeWidth="1.5" />
                </g>

                {/* Kartu Identitas / KTP dengan Foto Siluet */}
                <g transform="translate(44, 30)">
                  <rect x="0" y="0" width="46" height="30" rx="3" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1.5" />
                  {/* Foto Siluet */}
                  <rect x="4" y="5" width="14" height="20" rx="2" fill="#0369a1" />
                  <circle cx="11" cy="11" r="3.5" fill="#bae6fd" />
                  <path d="M 6 23 Q 11 17 16 23" fill="#bae6fd" />
                  {/* Garis Data ID */}
                  <line x1="22" y1="8" x2="40" y2="8" stroke="#0284c7" strokeWidth="2" />
                  <line x1="22" y1="14" x2="38" y2="14" stroke="#64748b" strokeWidth="1.5" />
                  <line x1="22" y1="20" x2="35" y2="20" stroke="#64748b" strokeWidth="1.5" />
                </g>

                {/* Gulungan Uang Tunai Pecahan Kecil dengan Karet Gelang */}
                <g transform="translate(16, 72)">
                  <ellipse cx="14" cy="15" rx="10" ry="14" fill="#15803d" stroke="#16a34a" strokeWidth="1.5" />
                  <rect x="14" y="1" width="48" height="28" fill="#16a34a" stroke="#22c55e" strokeWidth="1.5" />
                  <ellipse cx="62" cy="15" rx="10" ry="14" fill="#22c55e" stroke="#4ade80" strokeWidth="1.5" />
                  {/* Karet Gelang Pengikat Merah */}
                  <rect x="36" y="0" width="5" height="30" fill="#dc2626" />
                </g>
              </g>
            )}

            {/* Panel Teks Deskripsi (Di Sebelah Kanan Grafis - Luas, Terbaca Jelas & Anti-Cutoff) */}
            <foreignObject x="122" y="30" width="186" height="138">
              <div className="w-full h-full flex flex-col justify-center overflow-y-auto pr-1 select-none">
                <p className="text-[14.5px] sm:text-[15px] md:text-[15px] text-slate-100 leading-snug sm:leading-normal font-sans font-medium">
                  {itemDetails[activeItem].desc}
                </p>
              </div>
            </foreignObject>
          </g>

          {/* Gradients */}
          <defs>
            <linearGradient id="senterBeamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#fef08a" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN: STANDAR AKSI KESELAMATAN GEMPA BUMI (AREA 1 TEMUAN 2)
// GAMBAR MANUSIA PROPORSIONAL & REALISTIS: SISWA SMP SERAGAM PUTIH-BIRU
// ═════════════════════════════════════════════════════════════════════════════
// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN: POSTER STANDAR AKSI KESELAMATAN GEMPA BUMI (AREA 1 TEMUAN 2)
// 100% MENGIKUTI POSTER MITIGASI: MERUNDUK, LINDUNGI DIRI, BERTAHAN PEGANG ERAT,
// SERTA TETAP TENANG & EVAKUASI DENGAN 4 KARTU BERBINGKAI KUNING EMAS
// ═════════════════════════════════════════════════════════════════════════════
function EarthquakeActionIllustration() {
  const [activeTab, setActiveTab] = useState<1 | 2 | 3 | 4>(1);

  const cards = [
    {
      id: 1 as const,
      tabTitle: '1. MERUNDUK',
      title: 'MERUNDUK',
      desc: 'Jatuhkan badan ke posisi merangkak. Agar tidak terjatuh dan memudahkan bergerak merangkak menuju tempat berlindung.',
      themeColor: '#dc2626',
      badgeBg: 'bg-red-600',
    },
    {
      id: 2 as const,
      tabTitle: '2. LINDUNGI DIRI',
      title: 'LINDUNGI DIRI',
      desc: 'Lindungi kepala dan leher dengan satu tangan. Jika ada meja atau bangku yang kuat, merangkaklah ke bawahnya.',
      themeColor: '#eab308',
      badgeBg: 'bg-amber-500',
    },
    {
      id: 3 as const,
      tabTitle: '3. BERTAHAN',
      title: 'BERTAHAN PEGANG ERAT',
      desc: 'Pegang erat meja atau benda yang menutupimu agar tetap aman. Jika meja bergeser, ikut bergerak bersamanya sambil tetap berlindung.',
      themeColor: '#ca8a04',
      badgeBg: 'bg-yellow-600',
    },
    {
      id: 4 as const,
      tabTitle: '4. EVAKUASI & TENANG',
      title: 'TETAP TENANG & EVAKUASI',
      desc: 'Jangan panik, supaya bisa berpikir jernih. Setelah gempa reda, segera evakuasi tertib ke titik kumpul dengan melindungi kepala.',
      themeColor: '#16a34a',
      badgeBg: 'bg-emerald-600',
    },
  ];

  // Helper untuk merender grafik 2D PIXEL ART murni tanpa teks di setiap kartu
  const renderCardGraphic = (cardId: 1 | 2 | 3 | 4, _isCompact = false) => {
    switch (cardId) {
      // ═════════════════════════════════════════════════════════════════════════
      // 1. MERUNDUK (DROP): SISWA SMP MERANGKAK MENUJU KOLONG MEJA KAYU
      // ═════════════════════════════════════════════════════════════════════════
      case 1:
        return (
          <svg
            viewBox="0 0 360 120"
            className="w-full h-full object-contain"
            shapeRendering="crispEdges"
          >
            {/* ── LATAR RUANG KELAS & LANTAI KAYU PARQUET ── */}
            <rect x="0" y="0" width="360" height="92" fill="#f8fafc" />
            {/* Dinding bawah / Wainscoting lis kayu */}
            <rect x="0" y="88" width="360" height="4" fill="#78350f" />
            <rect x="0" y="92" width="360" height="28" fill="#e2e8f0" />
            <line x1="0" y1="92" x2="360" y2="92" stroke="#94a3b8" strokeWidth="1" />
            {/* Nat Ubin Keramik Bersih */}
            <line x1="45" y1="92" x2="30" y2="120" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="105" y1="92" x2="90" y2="120" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="165" y1="92" x2="150" y2="120" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="225" y1="92" x2="210" y2="120" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="285" y1="92" x2="270" y2="120" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="345" y1="92" x2="330" y2="120" stroke="#cbd5e1" strokeWidth="1" />

            {/* Aksi Skala Penuh & Terpusat (1.32x lebih besar, tegas dan terlihat jelas) */}
            <g transform="translate(44, -15) scale(1.32)">
              {/* ── MEJA BELAJAR SISWA SMP KOKOH (SISI KANAN) ── */}
              <g transform="translate(116, 24)">
                {/* Bayangan Meja di Lantai */}
                <rect x="0" y="60" width="70" height="4" fill="#0f172a" opacity="0.2" />

                {/* Kaki Meja Belakang (Warna Lebih Gelap) */}
                <rect x="14" y="10" width="5" height="50" fill="#5c2605" />
                <rect x="58" y="10" width="5" height="50" fill="#5c2605" />

                {/* Laci / Kolong Meja Buku */}
                <rect x="6" y="8" width="60" height="9" fill="#78350f" stroke="#451a03" strokeWidth="1" />
                <rect x="16" y="11" width="14" height="4" fill="#0284c7" />
                <rect x="34" y="11" width="18" height="4" fill="#f59e0b" />

                {/* Kaki Meja Depan Kayu Solid */}
                <rect x="4" y="8" width="7" height="52" fill="#92400e" />
                <rect x="4" y="8" width="2" height="52" fill="#b45309" />
                <rect x="62" y="8" width="7" height="52" fill="#92400e" />
                <rect x="62" y="8" width="2" height="52" fill="#b45309" />
                <rect x="4" y="44" width="65" height="3" fill="#78350f" />

                {/* Daun Meja Kayu Jati Kokoh */}
                <rect x="0" y="0" width="74" height="8" rx="1" fill="#b45309" stroke="#451a03" strokeWidth="1" />
                <rect x="2" y="1" width="70" height="2" fill="#d97706" />
              </g>

              {/* ── KARAKTER SISWA SMP 2D PIXEL: MERUNDUK & MERANGKAK BERTUMPU TANGAN & LUTUT ── */}
              <g transform="translate(16, 42)">
                {/* Bayangan Tubuh Siswa */}
                <ellipse cx="44" cy="42" rx="34" ry="4" fill="#0f172a" opacity="0.25" />

                {/* Kaki Belakang (Sepatu Kets Hitam & Kaus Kaki Putih) */}
                <rect x="2" y="38" width="8" height="4" fill="#0f172a" />
                <rect x="2" y="41" width="8" height="1" fill="#ffffff" />
                <rect x="8" y="35" width="4" height="4" fill="#f8fafc" />

                {/* Tungkai Bawah Kaki Belakang Melipat */}
                <rect x="10" y="32" width="12" height="6" fill="#172554" />

                {/* Kaki Depan (Lutut Kanan Menapak Kokoh di Lantai) */}
                <rect x="28" y="38" width="7" height="3" fill="#f5af7e" />
                <rect x="18" y="34" width="13" height="6" fill="#1e3a8a" />

                {/* Celana Pendek / Panjang Biru SMP & Sabuk */}
                <rect x="16" y="24" width="16" height="12" fill="#1e3a8a" />
                <rect x="18" y="24" width="14" height="3" fill="#2563eb" />
                <rect x="28" y="24" width="3" height="12" fill="#0f172a" />
                <rect x="29" y="28" width="2" height="2" fill="#cbd5e1" />

                {/* Tubuh / Kemeja Putih Seragam SMP Condong Rendah ke Depan */}
                <rect x="30" y="16" width="24" height="14" fill="#ffffff" />
                <rect x="32" y="26" width="20" height="4" fill="#cbd5e1" />
                {/* Saku Dada & Badge OSIS Biru */}
                <rect x="44" y="20" width="3" height="4" fill="#1e3a8a" />
                <rect x="45" y="21" width="1" height="2" fill="#ffffff" />
                {/* Dasi Biru SMP */}
                <rect x="50" y="20" width="3" height="8" fill="#1e3a8a" />

                {/* Lengan Kiri (Lengan Belakang) Menumpu Lantai */}
                <rect x="42" y="22" width="4" height="18" fill="#cbd5e1" />
                <rect x="41" y="40" width="6" height="2" fill="#f5af7e" />

                {/* Lengan Kanan (Lengan Depan) Menumpu Beban Tubuh */}
                <rect x="50" y="18" width="6" height="6" fill="#ffffff" />
                <rect x="52" y="24" width="5" height="16" fill="#f5af7e" />
                <rect x="52" y="24" width="1" height="16" fill="#e07a5f" />
                {/* Telapak & Jari-Jari Tangan Menapak di Lantai */}
                <rect x="52" y="40" width="8" height="2" fill="#f5af7e" />
                <rect x="54" y="40" width="1" height="2" fill="#b45309" />
                <rect x="57" y="40" width="1" height="2" fill="#b45309" />

                {/* Leher & Kepala Siswa Menatap ke Kolong Meja */}
                <rect x="52" y="14" width="6" height="5" fill="#f5af7e" />
                <rect x="54" y="6" width="13" height="11" fill="#f5af7e" />
                {/* Mata Siswa Fokus Rendah */}
                <rect x="62" y="9" width="2" height="2" fill="#0f172a" />
                <rect x="63" y="9" width="1" height="1" fill="#ffffff" />
                {/* Hidung & Telinga */}
                <rect x="67" y="11" width="1" height="2" fill="#e07a5f" />
                <rect x="55" y="9" width="2" height="3" fill="#e07a5f" />
                {/* Rambut Siswa SMP Hitam Rapi Bervolume */}
                <rect x="53" y="3" width="14" height="6" fill="#0f172a" />
                <rect x="53" y="3" width="3" height="9" fill="#0f172a" />
                <rect x="58" y="3" width="8" height="2" fill="#334155" />
                <rect x="63" y="6" width="3" height="3" fill="#0f172a" />
              </g>

              {/* Indikator Panah Gravitasi Rendah Pixel (Aman / Stabil) */}
              <g transform="translate(94, 60)">
                <rect x="2" y="0" width="3" height="12" fill="#f59e0b" />
                <polygon points="0,12 7,12 3.5,17" fill="#f59e0b" />
              </g>
            </g>
          </svg>
        );

      // ═════════════════════════════════════════════════════════════════════════
      // 2. LINDUNGI DIRI (COVER): SISWA MERINGKUK DI KOLONG MEJA MENDEKAP KEPALA
      // ═════════════════════════════════════════════════════════════════════════
      case 2:
        return (
          <svg
            viewBox="0 0 360 120"
            className="w-full h-full object-contain"
            shapeRendering="crispEdges"
          >
            {/* Latar Ruang Kelas & Lantai Keramik */}
            <rect x="0" y="0" width="360" height="92" fill="#f8fafc" />
            <rect x="0" y="88" width="360" height="4" fill="#78350f" />
            <rect x="0" y="92" width="360" height="28" fill="#e2e8f0" />
            <line x1="0" y1="92" x2="360" y2="92" stroke="#94a3b8" strokeWidth="1" />
            <line x1="45" y1="92" x2="30" y2="120" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="105" y1="92" x2="90" y2="120" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="165" y1="92" x2="150" y2="120" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="225" y1="92" x2="210" y2="120" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="285" y1="92" x2="270" y2="120" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="345" y1="92" x2="330" y2="120" stroke="#cbd5e1" strokeWidth="1" />

            <g transform="translate(48, -15) scale(1.32)">
              {/* Partikel Reruntuhan Langit-Langit Terbentur Daun Meja (Aman Terlindungi) */}
              <rect x="94" y="12" width="3" height="3" fill="#94a3b8" />
              <rect x="112" y="14" width="2" height="2" fill="#cbd5e1" />
              <rect x="80" y="13" width="2" height="3" fill="#cbd5e1" />
              {/* Percikan debu terpental dari atas meja */}
              <rect x="92" y="17" width="2" height="2" fill="#cbd5e1" />
              <rect x="100" y="16" width="3" height="1" fill="#94a3b8" />
              <rect x="116" y="18" width="2" height="2" fill="#cbd5e1" />

              {/* ── MEJA BELAJAR SISWA SMP KOKOH (DI TENGAH) ── */}
              <g transform="translate(45, 20)">
                {/* Bayangan Meja di Lantai */}
                <rect x="2" y="64" width="106" height="5" fill="#0f172a" opacity="0.25" />

                {/* Kaki Meja Belakang */}
                <rect x="18" y="10" width="6" height="54" fill="#5c2605" />
                <rect x="88" y="10" width="6" height="54" fill="#5c2605" />

                {/* Laci / Rak Buku Bawah Daun Meja */}
                <rect x="8" y="9" width="94" height="12" fill="#78350f" stroke="#451a03" strokeWidth="1" />
                <rect x="22" y="13" width="24" height="5" fill="#0284c7" />
                <rect x="52" y="13" width="28" height="5" fill="#f59e0b" />

                {/* ── SISWA SMP MERINGKUK DI KOLONG MEJA ── */}
                <g transform="translate(26, 26)">
                  {/* Bayangan Siswa */}
                  <ellipse cx="28" cy="38" rx="26" ry="4" fill="#070b12" opacity="0.35" />

                  {/* Sepatu Sekolah Hitam & Kaus Kaki Putih */}
                  <rect x="0" y="34" width="8" height="4" fill="#0f172a" />
                  <rect x="0" y="37" width="8" height="1" fill="#ffffff" />
                  <rect x="6" y="32" width="4" height="3" fill="#f8fafc" />

                  {/* Kaki & Lutut Melipat di Kolong (Celana Biru SMP) */}
                  <rect x="8" y="28" width="14" height="10" fill="#172554" />
                  <rect x="18" y="32" width="12" height="6" fill="#1e3a8a" />

                  {/* Punggung Melengkung Rendah (Kemeja Putih SMP) */}
                  <rect x="14" y="18" width="22" height="14" fill="#ffffff" />
                  <rect x="16" y="24" width="20" height="6" fill="#cbd5e1" />
                  <rect x="12" y="26" width="6" height="6" fill="#1e3a8a" />

                  {/* Kepala Menunduk Rapat Dekat Dada */}
                  <rect x="32" y="20" width="12" height="12" fill="#f5af7e" />
                  <rect x="32" y="18" width="12" height="8" fill="#0f172a" />
                  <rect x="42" y="24" width="2" height="2" fill="#0f172a" />

                  {/* KEDUA LENGAN MELINGKARI TENGKUK & KEPALA (STANDAR COVER BAKU) */}
                  <rect x="26" y="16" width="8" height="8" fill="#ffffff" />
                  <rect x="30" y="13" width="14" height="5" fill="#f5af7e" />
                  <rect x="30" y="13" width="14" height="1" fill="#fed7aa" />
                  {/* Tangan Mengunci Erat di Belakang Tengkuk */}
                  <rect x="40" y="15" width="6" height="5" fill="#e07a5f" />
                  <rect x="41" y="16" width="4" height="1" fill="#f5af7e" />
                  <rect x="41" y="18" width="4" height="1" fill="#f5af7e" />

                  {/* Lengan Lainnya Menopang Keseimbangan di Lantai */}
                  <rect x="36" y="28" width="4" height="10" fill="#f5af7e" />
                  <rect x="36" y="37" width="6" height="2" fill="#f5af7e" />
                </g>

                {/* Kaki Meja Depan Kayu Solid */}
                <rect x="6" y="8" width="8" height="56" fill="#92400e" />
                <rect x="6" y="8" width="2" height="56" fill="#b45309" />
                <rect x="96" y="8" width="8" height="56" fill="#92400e" />
                <rect x="96" y="8" width="2" height="56" fill="#b45309" />
                <rect x="6" y="50" width="98" height="3" fill="#78350f" />

                {/* Daun Meja Kayu Jati Kokoh Tebal */}
                <rect x="0" y="0" width="110" height="9" rx="1" fill="#b45309" stroke="#451a03" strokeWidth="1" />
                <rect x="2" y="1" width="106" height="2" fill="#d97706" />
              </g>

              {/* Perisai Garis Putus-Putus Cyan Menunjukkan Zona Aman Terlindungi */}
              <rect x="74" y="44" width="56" height="38" rx="4" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.8" />
            </g>
          </svg>
        );

      // ═════════════════════════════════════════════════════════════════════════
      // 3. BERTAHAN (HOLD ON): SISWA MENCENGKERAM ERAT KAKI MEJA
      // ═════════════════════════════════════════════════════════════════════════
      case 3:
        return (
          <svg
            viewBox="0 0 360 120"
            className="w-full h-full object-contain"
            shapeRendering="crispEdges"
          >
            {/* Latar Ruang Kelas & Lantai Keramik */}
            <rect x="0" y="0" width="360" height="92" fill="#f8fafc" />
            <rect x="0" y="88" width="360" height="4" fill="#78350f" />
            <rect x="0" y="92" width="360" height="28" fill="#e2e8f0" />
            <line x1="0" y1="92" x2="360" y2="92" stroke="#94a3b8" strokeWidth="1" />
            <line x1="45" y1="92" x2="30" y2="120" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="105" y1="92" x2="90" y2="120" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="165" y1="92" x2="150" y2="120" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="225" y1="92" x2="210" y2="120" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="285" y1="92" x2="270" y2="120" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="345" y1="92" x2="330" y2="120" stroke="#cbd5e1" strokeWidth="1" />

            <g transform="translate(48, -15) scale(1.32)">
              {/* Efek Garis Getar Dinamis (Goncangan Meja Bergerak Bersama) */}
              <g opacity="0.6">
                <line x1="38" y1="22" x2="43" y2="22" stroke="#f59e0b" strokeWidth="1.5" />
                <line x1="158" y1="22" x2="163" y2="22" stroke="#f59e0b" strokeWidth="1.5" />
                <line x1="40" y1="50" x2="45" y2="50" stroke="#f59e0b" strokeWidth="1.5" />
                <line x1="156" y1="50" x2="161" y2="50" stroke="#f59e0b" strokeWidth="1.5" />
              </g>

              {/* ── MEJA BELAJAR SISWA SMP KOKOH ── */}
              <g transform="translate(45, 20)">
                {/* Bayangan Meja */}
                <rect x="2" y="64" width="106" height="5" fill="#0f172a" opacity="0.25" />

                {/* Kaki Meja Belakang */}
                <rect x="18" y="10" width="6" height="54" fill="#5c2605" />
                <rect x="88" y="10" width="6" height="54" fill="#5c2605" />
                <rect x="8" y="9" width="94" height="12" fill="#78350f" stroke="#451a03" strokeWidth="1" />

                {/* ── SISWA SMP BERTAHAN & MEMEGANG ERAT KAKI MEJA ── */}
                <g transform="translate(24, 26)">
                  {/* Bayangan Siswa */}
                  <ellipse cx="32" cy="38" rx="28" ry="4" fill="#070b12" opacity="0.35" />

                  {/* Sepatu & Kaki Melipat */}
                  <rect x="0" y="34" width="8" height="4" fill="#0f172a" />
                  <rect x="0" y="37" width="8" height="1" fill="#ffffff" />
                  <rect x="6" y="32" width="4" height="3" fill="#f8fafc" />
                  <rect x="8" y="28" width="14" height="10" fill="#172554" />
                  <rect x="18" y="32" width="14" height="6" fill="#1e3a8a" />

                  {/* Punggung & Tubuh Condong Maju Menjangkau Kaki Meja */}
                  <rect x="14" y="18" width="24" height="14" fill="#ffffff" />
                  <rect x="16" y="24" width="22" height="6" fill="#cbd5e1" />
                  <rect x="12" y="26" width="6" height="6" fill="#1e3a8a" />

                  {/* Kepala Menunduk Fokus */}
                  <rect x="34" y="18" width="12" height="12" fill="#f5af7e" />
                  <rect x="34" y="16" width="12" height="8" fill="#0f172a" />
                  <rect x="44" y="22" width="2" height="2" fill="#0f172a" />

                  {/* Tangan Kiri Melindungi Belakang Kepala */}
                  <rect x="28" y="14" width="12" height="5" fill="#f5af7e" />
                  <rect x="38" y="15" width="4" height="4" fill="#e07a5f" />

                  {/* LENGAN KANAN MENJANGKAU KE DEPAN & MENCENGKERAM KAKI MEJA DEPAN */}
                  <rect x="28" y="18" width="8" height="8" fill="#ffffff" />
                  <rect x="34" y="22" width="38" height="6" fill="#f5af7e" />
                  <rect x="34" y="26" width="38" height="1" fill="#e07a5f" />

                  {/* JARI-JARI TANGAN MELINGKARI KAKI MEJA KAYU SOLID (GRIP TIGHT) */}
                  <rect x="70" y="20" width="8" height="10" rx="1" fill="#f5af7e" stroke="#b45309" strokeWidth="1" />
                  <rect x="72" y="21" width="5" height="2" fill="#e07a5f" />
                  <rect x="72" y="24" width="5" height="2" fill="#e07a5f" />
                  <rect x="72" y="27" width="5" height="2" fill="#e07a5f" />

                  {/* Pendaran Hijau Tanda Cengkeraman Erat Terkunci */}
                  <rect x="68" y="18" width="12" height="14" rx="2" fill="none" stroke="#10b981" strokeWidth="1.5" />
                </g>

                {/* Kaki Meja Depan Kayu Solid */}
                <rect x="6" y="8" width="8" height="56" fill="#92400e" />
                <rect x="6" y="8" width="2" height="56" fill="#b45309" />
                <rect x="96" y="8" width="8" height="56" fill="#92400e" />
                <rect x="96" y="8" width="2" height="56" fill="#b45309" />
                <rect x="6" y="50" width="98" height="3" fill="#78350f" />

                {/* Daun Meja Kayu Jati Kokoh Tebal */}
                <rect x="0" y="0" width="110" height="9" rx="1" fill="#b45309" stroke="#451a03" strokeWidth="1" />
                <rect x="2" y="1" width="106" height="2" fill="#d97706" />
              </g>
            </g>
          </svg>
        );

      // ═════════════════════════════════════════════════════════════════════════
      // 4. EVAKUASI TERTIB (EVACUATE): SISWA BERDIRI MEMAKAI TAS PELINDUNG KEPALA
      // ═════════════════════════════════════════════════════════════════════════
      case 4:
        return (
          <svg
            viewBox="0 0 360 120"
            className="w-full h-full object-contain"
            shapeRendering="crispEdges"
          >
            {/* Latar Ruang Kelas & Lantai Keramik Menuju Pintu Keluar */}
            <rect x="0" y="0" width="360" height="92" fill="#f8fafc" />
            <rect x="0" y="88" width="360" height="4" fill="#78350f" />
            <rect x="0" y="92" width="360" height="28" fill="#e2e8f0" />
            <line x1="0" y1="92" x2="360" y2="92" stroke="#94a3b8" strokeWidth="1" />
            <line x1="45" y1="92" x2="30" y2="120" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="105" y1="92" x2="90" y2="120" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="165" y1="92" x2="150" y2="120" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="225" y1="92" x2="210" y2="120" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="285" y1="92" x2="270" y2="120" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="345" y1="92" x2="330" y2="120" stroke="#cbd5e1" strokeWidth="1" />

            <g transform="translate(18, -10) scale(1.32)">
              {/* ── PINTU KELUAR RUANG KELAS TERBUKA MENUJU TITIK KUMPUL (SISI KANAN) ── */}
              <g transform="translate(148, 8)">
                {/* Kusen Pintu Kayu Jati */}
                <rect x="0" y="0" width="46" height="76" fill="#78350f" stroke="#451a03" strokeWidth="1" />

                {/* Rambu Hijau Darurat Evakuasi Tanpa Tulisan (Ikon Orang Lari & Panah Putih) */}
                <rect x="6" y="4" width="34" height="12" rx="2" fill="#16a34a" stroke="#15803d" strokeWidth="1" />
                {/* Sosok Siluet Putih Orang Berlari di Rambu */}
                <circle cx="16" cy="9" r="1.5" fill="#ffffff" />
                <rect x="15" y="11" width="3" height="3" fill="#ffffff" />
                <rect x="18" y="11" width="2" height="2" fill="#ffffff" />
                <rect x="14" y="14" width="2" height="2" fill="#ffffff" />
                {/* Panah Putih Keluar ➔ */}
                <rect x="25" y="9" width="7" height="2" fill="#ffffff" />
                <polygon points="32,7 36,10 32,13" fill="#ffffff" />

                {/* Bukaan Pintu Keluar dengan Cahaya Koridor Terang */}
                <rect x="4" y="18" width="38" height="58" fill="#bae6fd" />
                <rect x="4" y="18" width="10" height="58" fill="#7dd3fc" />
                <rect x="4" y="66" width="38" height="10" fill="#e2e8f0" />
              </g>

              {/* ── KARAKTER SISWA SMP 2D PIXEL: BERJALAN TERTIB MELINDUNGI KEPALA DENGAN TAS ── */}
              <g transform="translate(74, 18)">
                {/* Bayangan Siswa Melangkah di Lantai */}
                <ellipse cx="20" cy="66" rx="16" ry="4" fill="#0f172a" opacity="0.25" />

                {/* Kaki Belakang (Melangkah Celana Biru SMP & Sepatu) */}
                <rect x="8" y="48" width="6" height="16" fill="#172554" />
                <rect x="6" y="64" width="8" height="4" fill="#0f172a" />
                <rect x="6" y="67" width="8" height="1" fill="#ffffff" />

                {/* Kaki Depan (Melangkah Maju Menuju Pintu) */}
                <rect x="20" y="48" width="6" height="16" fill="#1e3a8a" />
                <rect x="22" y="64" width="8" height="4" fill="#0f172a" />
                <rect x="22" y="67" width="8" height="1" fill="#ffffff" />

                {/* Pinggul & Sabuk Siswa SMP */}
                <rect x="10" y="44" width="16" height="5" fill="#1e3a8a" />
                <rect x="10" y="44" width="16" height="2" fill="#0f172a" />
                <rect x="16" y="44" width="3" height="2" fill="#cbd5e1" />

                {/* Tubuh Tegak Berbusana Kemeja Putih Seragam SMP */}
                <rect x="10" y="24" width="16" height="20" fill="#ffffff" />
                <rect x="10" y="38" width="16" height="6" fill="#cbd5e1" />
                {/* Dasi Biru SMP */}
                <rect x="17" y="26" width="3" height="10" fill="#1e3a8a" />
                {/* Badge OSIS */}
                <rect x="12" y="28" width="2" height="3" fill="#1e3a8a" />

                {/* Kepala Siswa Terlindungi di Bawah Tas Ransel */}
                <rect x="13" y="16" width="11" height="10" fill="#f5af7e" />
                {/* Mata Siswa Menatap Tenang ke Depan */}
                <rect x="20" y="18" width="2" height="2" fill="#0f172a" />
                <rect x="21" y="18" width="1" height="1" fill="#ffffff" />
                {/* Rambut Siswa Rapi */}
                <rect x="12" y="15" width="12" height="4" fill="#0f172a" />
                <rect x="11" y="15" width="3" height="7" fill="#0f172a" />

                {/* TAS RANSEL MERAH DIANGKAT DI ATAS KEPALA (PERISAI JATUHAN) */}
                <rect x="2" y="0" width="30" height="14" rx="2" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
                <rect x="6" y="3" width="22" height="3" fill="#facc15" />
                <rect x="10" y="9" width="14" height="2" fill="#7f1d1d" />

                {/* Kedua Tangan Memegang Erat Sisi Kiri & Kanan Tas di Atas Kepala */}
                <rect x="4" y="12" width="6" height="4" fill="#f5af7e" />
                <rect x="24" y="12" width="6" height="4" fill="#f5af7e" />

                {/* Lengan Kiri & Kanan Terangkat Menopang Tas */}
                <rect x="6" y="16" width="5" height="12" fill="#ffffff" />
                <rect x="23" y="16" width="5" height="12" fill="#ffffff" />
              </g>

              {/* Jejak Kaki Panah Hijau Halus di Lantai Menuju Pintu */}
              <g transform="translate(116, 92)" fill="#16a34a" opacity="0.8">
                <polygon points="0,4 6,2 6,6" />
                <polygon points="12,4 18,2 18,6" />
                <polygon points="24,4 30,2 30,6" />
              </g>
            </g>
          </svg>
        );
    }
  };

  const currentCard = cards.find((c) => c.id === activeTab)!;

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-1.5 sm:p-2.5 font-pixel bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 select-none">
      {/* 1. Switcher 4 Tombol Tab di Bagian Paling Atas */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 pb-1.5 sm:pb-2 shrink-0 z-10">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => {
              retroAudio.playSelect?.();
              setActiveTab(card.id);
            }}
            className={`px-2 py-2 sm:py-2.5 rounded-xl border-2 text-[14px] sm:text-[13px] md:text-[15px] font-pixel-title cursor-pointer transition-all active:translate-y-0.5 flex items-center justify-center gap-1.5 sm:gap-2 ${activeTab === card.id
              ? 'bg-amber-400 text-slate-950 border-amber-200 font-bold shadow-[0_3px_0_#92400e]'
              : 'bg-slate-800/95 text-slate-300 border-slate-700 hover:border-amber-400 hover:text-white'
              }`}
          >
            <span className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${card.badgeBg} shrink-0`} />
            <span className="truncate">{card.tabTitle}</span>
          </button>
        ))}
      </div>

      {/* 2. Kartu Penuh Mengisi Seluruh Kotak (Full Frame) */}
      <div className="w-full flex-1 min-h-0 flex items-center justify-center overflow-hidden">
        <div className="w-full h-full bg-white rounded-2xl border-3 sm:border-4 border-[#facc15] shadow-2xl p-3 sm:p-4 md:p-5 flex flex-col items-center justify-between text-center animate-fadeIn relative">
          {/* Header: Nomor Urut Badge & Judul Kartu Resmi Poster */}
          <div className="w-full flex items-center justify-center gap-2.5 mb-1 sm:mb-2 shrink-0">
            <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-400 text-slate-950 font-pixel-title text-[15px] sm:text-base md:text-lg font-bold flex items-center justify-center border-2 border-amber-500 shadow-sm shrink-0">
              {currentCard.id}
            </span>
            <h3 className="font-extrabold text-[#0f172a] text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-wider uppercase font-sans">
              {currentCard.title}
            </h3>
          </div>

          {/* Ilustrasi Vektor Siluet Realistis (Memenuhi Kotak Secara Penuh & Jelas) */}
          <div className="w-full flex-1 min-h-0 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-amber-300/80 bg-[#f8fafc] shadow-inner flex items-center justify-center my-1.5 sm:my-2 relative">
            {renderCardGraphic(currentCard.id, false)}
          </div>

          {/* Teks Penjelasan Edukasi Baku (Font Jauh Lebih Besar, Jelas & Berbobot) */}
          <div className="w-full bg-gradient-to-r from-amber-50 via-amber-100/90 to-amber-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border-2 border-amber-400 shrink-0 shadow-sm">
            <p className="text-[15px] sm:text-base md:text-lg lg:text-xl xl:text-2xl text-[#0f172a] leading-relaxed font-sans font-bold text-center">
              {currentCard.desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN: 4 STATUS TINGKAT AKTIVITAS PVMBG & KRB (AREA 4 TEMUAN 1)
// Desain 100% Selaras Screenshot 2: Normal (tanpa asap), Waspada (asap putih),
// Siaga (asap abu-abu gelap), Awas (magma & lava pijar + awan letusan masif)
// ═════════════════════════════════════════════════════════════════════════════
function VolcanoStatusIllustration() {
  const [activeLevel, setActiveLevel] = useState<1 | 2 | 3 | 4 | 'all'>(4);

  const levels = [
    {
      lvl: 1 as const,
      name: 'NORMAL (LEVEL I)',
      shortName: 'NORMAL',
      color: '#22c55e',
      border: '#15803d',
      haloBg: '#e0f2fe',
      haloBorder: '#7dd3fc',
      desc: 'Aktivitas dasar magma stabil dan tenang. Tidak ada ancaman letusan. Seluruh kawasan lereng aman untuk aktivitas masyarakat.',
      radius: 'Zona aman (> 2 km dari kawah puncak)',
      visualFeature: 'Kawah tenang tanpa asap pekat, lereng hijau alami, kondisi stabil.',
    },
    {
      lvl: 2 as const,
      name: 'WASPADA (LEVEL II)',
      shortName: 'WASPADA',
      color: '#eab308',
      border: '#a16207',
      haloBg: '#fef9c3',
      haloBorder: '#fde047',
      desc: 'Peningkatan aktivitas seismik dan visual di atas batas normal. Terdeteksi gempa vulkanik dangkal. Dilarang mendekati kawah puncak.',
      radius: 'Radius bahaya 2 - 3 km dari kawah aktif',
      visualFeature: 'Kolom asap solfatara putih tipis hingga sedang mulai membubung.',
    },
    {
      lvl: 3 as const,
      name: 'SIAGA (LEVEL III)',
      shortName: 'SIAGA',
      color: '#f97316',
      border: '#c2410c',
      haloBg: '#ffedd5',
      haloBorder: '#fb923c',
      desc: 'Peningkatan aktivitas vulkanik sangat nyata. Kubah lava membesar cepat dan rawan longsor. Posko evakuasi mulai siaga penuh.',
      radius: 'Radius bahaya 3 - 5 km dari kawah puncak',
      visualFeature: 'Kubah lava membara & kepulan asap abu-abu pekat membubung tinggi.',
    },
    {
      lvl: 4 as const,
      name: 'AWAS (LEVEL IV)',
      shortName: 'AWAS',
      color: '#ef4444',
      border: '#991b1b',
      haloBg: '#ffe4e6',
      haloBorder: '#fb7185',
      desc: 'Erupsi utama sedang atau berpeluang besar segera terjadi! Semburan lava pijar & awan panas. Seluruh warga KRB III wajib segera evakuasi total!',
      radius: 'Radius bahaya > 5 - 10 km (KRB III Wajib Evakuasi Total)',
      visualFeature: 'Lontaran magma pijar, aliran lava lereng, & awan letusan kolosal.',
    },
  ];

  // Helper render vektor gunung stratovolcano untuk masing-masing level (persis SS 2)
  const renderVolcanoArtwork = (lvl: 1 | 2 | 3 | 4, isCompact: boolean = false) => {
    const cur = levels.find((l) => l.lvl === lvl)!;
    const w = isCompact ? 130 : 250;
    const h = isCompact ? 150 : 200;
    const cx = w / 2;
    const mountainBaseY = h * 0.78;
    const peakY = h * 0.44;

    return (
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full object-contain overflow-visible" shapeRendering="geometricPrecision">
        <defs>
          {/* Circular Aura Background Gradient */}
          <radialGradient id={`halo-${lvl}-${isCompact ? 'c' : 'f'}`} cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor={cur.haloBg} />
            <stop offset="95%" stopColor={cur.haloBorder} stopOpacity="0.8" />
            <stop offset="100%" stopColor={cur.haloBorder} stopOpacity="0" />
          </radialGradient>

          {/* Sisi Terang Gunung (Western Slope) */}
          <linearGradient id={`mtn-light-${lvl}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="50%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          {/* Sisi Bayangan Gunung (Eastern Slope) */}
          <linearGradient id={`mtn-dark-${lvl}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="60%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Magma / Lava Gradient */}
          <linearGradient id="lavaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="25%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>

        {/* 1. Lingkaran Halo Latar Belakang (Aura Berwarna Sesuai SS 2) */}
        <circle cx={cx} cy={h * 0.52} r={isCompact ? 54 : 84} fill={`url(#halo-${lvl}-${isCompact ? 'c' : 'f'})`} />

        {/* 2. EFEK ASAP & ERUPSI DI ATAS PUNCAK (SESUAI PERMINTAAN PENGGUNA) */}
        {/* LEVEL 1 (NORMAL): GUNUNG BIASA SAJA, GA ADA ASAP, GA ADA APA-APA */}
        {lvl === 1 && (
          // Tidak ada asap atau magma sama sekali! Bersih dan tenang.
          null
        )}

        {/* LEVEL 2 (WASPADA): GUNUNG MULAI KELUARIN ASAP PUTIH BERGUMPAL (SOLFATARA) */}
        {lvl === 2 && (
          <g>
            {/* Pendaran kawah tipis keemasan */}
            <ellipse cx={cx} cy={peakY} rx={isCompact ? 5 : 8} ry={isCompact ? 2 : 3} fill="#fef08a" opacity="0.9" />

            {/* Kolom kepulan asap putih organik berlapis-lapis membubung ke atas */}
            {/* Puff 1 (Bibir Kawah) */}
            <circle cx={cx - 1} cy={peakY - 6} r={isCompact ? 4 : 7} fill="#ffffff" opacity="0.95" />
            <circle cx={cx + 3} cy={peakY - 7} r={isCompact ? 5 : 8} fill="#f8fafc" opacity="0.9" />

            {/* Puff 2 (Membesar saat naik) */}
            <circle cx={cx + 1} cy={peakY - (isCompact ? 14 : 22)} r={isCompact ? 6 : 11} fill="#ffffff" opacity="0.95" />
            <circle cx={cx - 4} cy={peakY - (isCompact ? 16 : 24)} r={isCompact ? 7 : 12} fill="#f1f5f9" opacity="0.9" />
            <circle cx={cx + 5} cy={peakY - (isCompact ? 17 : 26)} r={isCompact ? 6 : 10} fill="#e2e8f0" opacity="0.85" />

            {/* Puff 3 (Tinggi melayang tertiup angin) */}
            <circle cx={cx + 3} cy={peakY - (isCompact ? 25 : 40)} r={isCompact ? 8 : 14} fill="#ffffff" opacity="0.95" />
            <circle cx={cx - 3} cy={peakY - (isCompact ? 28 : 44)} r={isCompact ? 7 : 13} fill="#f8fafc" opacity="0.9" />
            <circle cx={cx + 8} cy={peakY - (isCompact ? 27 : 42)} r={isCompact ? 7 : 12} fill="#e2e8f0" opacity="0.8" />

            {/* Puff 4 (Puncak asap putih lembut) */}
            <circle cx={cx + 4} cy={peakY - (isCompact ? 36 : 58)} r={isCompact ? 9 : 16} fill="#ffffff" opacity="0.9" />
            <circle cx={cx - 2} cy={peakY - (isCompact ? 39 : 62)} r={isCompact ? 8 : 14} fill="#f1f5f9" opacity="0.85" />
            <circle cx={cx + 10} cy={peakY - (isCompact ? 38 : 60)} r={isCompact ? 7 : 12} fill="#e2e8f0" opacity="0.75" />
          </g>
        )}

        {/* LEVEL 3 (SIAGA): ASAP GUNUNG BERUBAH WARNA JADI ABU-ABU AGAK KEHITAMAN MEMBUBUNG TINGGI */}
        {lvl === 3 && (
          <g>
            {/* Rekahan kawah membara oranye-kuning */}
            <ellipse cx={cx} cy={peakY} rx={isCompact ? 6 : 10} ry={isCompact ? 2.5 : 4} fill="#ea580c" />
            <ellipse cx={cx} cy={peakY} rx={isCompact ? 4 : 7} ry={isCompact ? 1.5 : 2.5} fill="#facc15" />
            <path d={`M ${cx - 3} ${peakY} Q ${cx - 5} ${peakY + 6} ${cx - 8} ${peakY + 12}`} stroke="#f97316" strokeWidth={isCompact ? 1.5 : 2} fill="none" />

            {/* Kolom gumpalan abu vulkanik abu-abu gelap kehitaman */}
            {/* Puff 1 (Dasar Kawah Jelaga) */}
            <circle cx={cx - 2} cy={peakY - 6} r={isCompact ? 5 : 8} fill="#292524" opacity="0.95" />
            <circle cx={cx + 3} cy={peakY - 7} r={isCompact ? 6 : 9} fill="#44403c" opacity="0.95" />
            <circle cx={cx} cy={peakY - 5} r={isCompact ? 3 : 5} fill="#f97316" opacity="0.5" />

            {/* Puff 2 (Abu Vulkanik Gelap Menggumpal) */}
            <circle cx={cx + 2} cy={peakY - (isCompact ? 15 : 23)} r={isCompact ? 8 : 13} fill="#44403c" opacity="0.95" />
            <circle cx={cx - 5} cy={peakY - (isCompact ? 17 : 26)} r={isCompact ? 7 : 12} fill="#292524" opacity="0.95" />
            <circle cx={cx + 6} cy={peakY - (isCompact ? 18 : 28)} r={isCompact ? 7 : 11} fill="#57534e" opacity="0.9" />

            {/* Puff 3 (Lapisan Tengah Abu Silika) */}
            <circle cx={cx + 4} cy={peakY - (isCompact ? 27 : 42)} r={isCompact ? 9 : 15} fill="#57534e" opacity="0.95" />
            <circle cx={cx - 4} cy={peakY - (isCompact ? 30 : 46)} r={isCompact ? 9 : 14} fill="#44403c" opacity="0.95" />
            <circle cx={cx + 9} cy={peakY - (isCompact ? 29 : 44)} r={isCompact ? 8 : 13} fill="#78716c" opacity="0.9" />

            {/* Puff 4 (Puncak Gumpalan Awan Kelabu Kehitaman) */}
            <circle cx={cx + 5} cy={peakY - (isCompact ? 39 : 62)} r={isCompact ? 11 : 18} fill="#44403c" opacity="0.95" />
            <circle cx={cx - 3} cy={peakY - (isCompact ? 43 : 67)} r={isCompact ? 10 : 16} fill="#292524" opacity="0.95" />
            <circle cx={cx + 12} cy={peakY - (isCompact ? 41 : 65)} r={isCompact ? 9 : 15} fill="#57534e" opacity="0.9" />
            <circle cx={cx - 8} cy={peakY - (isCompact ? 40 : 64)} r={isCompact ? 8 : 13} fill="#78716c" opacity="0.85" />
          </g>
        )}

        {/* LEVEL 4 (AWAS): GUNUNG NGELUARIN MAGMA-MAGMA, LELEHAN LAVA PIJAR & AWAN HITAM MASIF */}
        {lvl === 4 && (
          <g>
            {/* Lontaran Air Mancur Magma Pijar Membubung dari Puncak Kawah */}
            <path
              d={`M ${cx - 5} ${peakY} 
                  Q ${cx - 10} ${peakY - (isCompact ? 18 : 28)} ${cx - 16} ${peakY - (isCompact ? 10 : 16)}
                  M ${cx + 5} ${peakY} 
                  Q ${cx + 12} ${peakY - (isCompact ? 20 : 30)} ${cx + 18} ${peakY - (isCompact ? 12 : 18)}
                  M ${cx} ${peakY} 
                  Q ${cx + 2} ${peakY - (isCompact ? 24 : 36)} ${cx + 4} ${peakY - (isCompact ? 8 : 12)}`}
              stroke="#fbbf24"
              strokeWidth={isCompact ? 2 : 3}
              strokeLinecap="round"
              fill="none"
            />
            {/* Percikan Bom Vulkanik Pijar Melayang */}
            <circle cx={cx - 14} cy={peakY - (isCompact ? 12 : 20)} r={isCompact ? 1.5 : 2.5} fill="#ef4444" />
            <circle cx={cx + 16} cy={peakY - (isCompact ? 14 : 22)} r={isCompact ? 1.5 : 2.5} fill="#f59e0b" />
            <circle cx={cx - 8} cy={peakY - (isCompact ? 20 : 32)} r={isCompact ? 1.2 : 2} fill="#fbbf24" />
            <circle cx={cx + 8} cy={peakY - (isCompact ? 22 : 34)} r={isCompact ? 1.5 : 2.5} fill="#ef4444" />

            {/* Kolosal Cauliflower Eruption Ash Cloud (Hitam Pekat Berlapis-lapis) */}
            {/* Ash Core Atas */}
            <circle cx={cx + 6} cy={peakY - (isCompact ? 34 : 52)} r={isCompact ? 14 : 23} fill="#1c1917" opacity="0.98" />
            <circle cx={cx - 8} cy={peakY - (isCompact ? 36 : 56)} r={isCompact ? 13 : 21} fill="#292524" opacity="0.98" />
            <circle cx={cx + 16} cy={peakY - (isCompact ? 32 : 50)} r={isCompact ? 12 : 19} fill="#44403c" opacity="0.95" />
            <circle cx={cx - 18} cy={peakY - (isCompact ? 30 : 48)} r={isCompact ? 11 : 18} fill="#292524" opacity="0.95" />
            {/* Ash Crown Puncak */}
            <circle cx={cx} cy={peakY - (isCompact ? 48 : 74)} r={isCompact ? 15 : 25} fill="#292524" opacity="0.98" />
            <circle cx={cx - 12} cy={peakY - (isCompact ? 46 : 70)} r={isCompact ? 13 : 22} fill="#1c1917" opacity="0.98" />
            <circle cx={cx + 14} cy={peakY - (isCompact ? 47 : 72)} r={isCompact ? 13 : 21} fill="#44403c" opacity="0.95" />
            <circle cx={cx + 2} cy={peakY - (isCompact ? 58 : 88)} r={isCompact ? 12 : 20} fill="#57534e" opacity="0.9" />
          </g>
        )}

        {/* 3. TUBUH KERUCUT GUNUNG STRATOVOLCANO DENGAN FAKET SHADING REALISTIS */}
        {/* Lereng Barat / Sisi Terang (Light Slate Blue) */}
        <path
          d={`M ${cx - (isCompact ? 48 : 78)} ${mountainBaseY}
              L ${cx - (isCompact ? 12 : 20)} ${peakY + (isCompact ? 2 : 3)}
              L ${cx} ${peakY}
              L ${cx} ${mountainBaseY}
              Z`}
          fill={`url(#mtn-light-${lvl})`}
        />
        {/* Lereng Timur / Sisi Bayangan Tebing (Dark Slate) */}
        <path
          d={`M ${cx} ${peakY}
              L ${cx + (isCompact ? 14 : 22)} ${peakY + (isCompact ? 2 : 3)}
              L ${cx + (isCompact ? 48 : 78)} ${mountainBaseY}
              L ${cx} ${mountainBaseY}
              Z`}
          fill={`url(#mtn-dark-${lvl})`}
        />

        {/* Patahan Celah & Alur Lembah Vulkanik (Ridge & Ravines) */}
        <path
          d={`M ${cx} ${peakY}
              L ${cx - (isCompact ? 6 : 10)} ${mountainBaseY * 0.72}
              L ${cx - (isCompact ? 14 : 24)} ${mountainBaseY}`}
          stroke="#1e293b"
          strokeWidth={isCompact ? 1.5 : 2.5}
          fill="none"
        />
        <path
          d={`M ${cx + (isCompact ? 3 : 5)} ${peakY + 2}
              L ${cx + (isCompact ? 8 : 14)} ${mountainBaseY * 0.68}
              L ${cx + (isCompact ? 18 : 30)} ${mountainBaseY}`}
          stroke="#0f172a"
          strokeWidth={isCompact ? 1.5 : 2.5}
          fill="none"
        />
        <path
          d={`M ${cx - (isCompact ? 3 : 5)} ${peakY + 2}
              L ${cx - (isCompact ? 18 : 30)} ${mountainBaseY * 0.8}
              L ${cx - (isCompact ? 28 : 46)} ${mountainBaseY}`}
          stroke="#1e293b"
          strokeWidth={isCompact ? 1 : 1.5}
          fill="none"
        />

        {/* ALIRAN MAGMA / LELEHAN LAVA PIJAR PADA STATUS SIAGA & AWAS */}
        {lvl === 3 && (
          // Rekahan lava kawah menyala pada status Siaga
          <g>
            <path d={`M ${cx - 2} ${peakY} L ${cx - 5} ${peakY + (isCompact ? 8 : 14)}`} stroke="#f97316" strokeWidth={isCompact ? 1.5 : 2.5} fill="none" strokeLinecap="round" />
            <path d={`M ${cx + 1} ${peakY} L ${cx + 4} ${peakY + (isCompact ? 6 : 10)}`} stroke="#fbbf24" strokeWidth={isCompact ? 1.2 : 2} fill="none" strokeLinecap="round" />
          </g>
        )}

        {lvl === 4 && (
          // Lelehan lava pijar menyala merah-emas menuruni lembah pada status Awas (Persis SS 2)
          <g>
            {/* Aliran Lava Utama 1 (Tengah) */}
            <path
              d={`M ${cx} ${peakY} 
                  L ${cx - (isCompact ? 4 : 7)} ${mountainBaseY * 0.65} 
                  L ${cx - (isCompact ? 8 : 14)} ${mountainBaseY * 0.82} 
                  L ${cx - (isCompact ? 12 : 20)} ${mountainBaseY}`}
              stroke="url(#lavaGrad)"
              strokeWidth={isCompact ? 2.5 : 4}
              fill="none"
              strokeLinecap="round"
            />
            {/* Aliran Lava Cabang 2 (Kanan) */}
            <path
              d={`M ${cx + 3} ${peakY + 2} 
                  L ${cx + (isCompact ? 6 : 11)} ${mountainBaseY * 0.68} 
                  L ${cx + (isCompact ? 14 : 24)} ${mountainBaseY}`}
              stroke="#f97316"
              strokeWidth={isCompact ? 2 : 3}
              fill="none"
              strokeLinecap="round"
            />
            {/* Aliran Lava Cabang 3 (Kiri) */}
            <path
              d={`M ${cx - 3} ${peakY + 2} 
                  L ${cx - (isCompact ? 12 : 20)} ${mountainBaseY * 0.75} 
                  L ${cx - (isCompact ? 22 : 36)} ${mountainBaseY}`}
              stroke="#ea580c"
              strokeWidth={isCompact ? 1.8 : 2.8}
              fill="none"
              strokeLinecap="round"
            />
            {/* Kubah Kawah Membara */}
            <ellipse cx={cx} cy={peakY} rx={isCompact ? 6 : 10} ry={isCompact ? 2.5 : 4} fill="#fef08a" />
          </g>
        )}

        {/* 4. RUMPUN HUTAN HIJAU RIMBUN DI DASAR LERENG (LUSH BASE FOREST SKIRT) */}
        {/* Barisan kanopi pohon hijau melingkar di kaki gunung persis SS 2 */}
        <g>
          {/* Lapisan Pohon Hijau Tua (Belakang) */}
          <ellipse cx={cx - (isCompact ? 40 : 65)} cy={mountainBaseY + 2} rx={isCompact ? 12 : 18} ry={isCompact ? 7 : 10} fill="#14532d" />
          <ellipse cx={cx - (isCompact ? 22 : 36)} cy={mountainBaseY} rx={isCompact ? 14 : 22} ry={isCompact ? 8 : 12} fill="#166534" />
          <ellipse cx={cx} cy={mountainBaseY} rx={isCompact ? 16 : 24} ry={isCompact ? 8 : 13} fill="#15803d" />
          <ellipse cx={cx + (isCompact ? 22 : 36)} cy={mountainBaseY} rx={isCompact ? 14 : 22} ry={isCompact ? 8 : 12} fill="#166534" />
          <ellipse cx={cx + (isCompact ? 40 : 65)} cy={mountainBaseY + 2} rx={isCompact ? 12 : 18} ry={isCompact ? 7 : 10} fill="#14532d" />

          {/* Lapisan Pohon Hijau Terang (Depan) */}
          <ellipse cx={cx - (isCompact ? 32 : 52)} cy={mountainBaseY + 6} rx={isCompact ? 11 : 17} ry={isCompact ? 6 : 9} fill="#16a34a" />
          <ellipse cx={cx - (isCompact ? 12 : 20)} cy={mountainBaseY + 5} rx={isCompact ? 13 : 20} ry={isCompact ? 7 : 11} fill="#22c55e" />
          <ellipse cx={cx + (isCompact ? 12 : 20)} cy={mountainBaseY + 5} rx={isCompact ? 13 : 20} ry={isCompact ? 7 : 11} fill="#22c55e" />
          <ellipse cx={cx + (isCompact ? 32 : 52)} cy={mountainBaseY + 6} rx={isCompact ? 11 : 17} ry={isCompact ? 6 : 9} fill="#16a34a" />
        </g>
      </svg>
    );
  };

  const currentLevelData = typeof activeLevel === 'number' ? levels.find((l) => l.lvl === activeLevel)! : levels[3];

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-2 font-pixel">
      {/* Top Banner Header */}
      <div className="w-full flex items-center justify-between px-2 pb-1.5 border-b border-slate-800 shrink-0">
        <span className="text-[13px] sm:text-[15px] font-pixel-title text-rose-400 font-bold flex items-center gap-1.5">
          <PixelIcon name="volcano" size={14} />
          4 TINGKAT STATUS AKTIVITAS GUNUNG API PVMBG &amp; KRB
        </span>
        <span className="text-[13.5px] sm:text-[13px] text-slate-400 font-pixel font-semibold">
          STANDAR RESMI PVMBG / KESDM
        </span>
      </div>

      {/* Main Interactive Illustration Area */}
      <div className="w-full flex-1 flex items-center justify-center p-1.5 overflow-hidden">
        {activeLevel === 'all' ? (
          /* TAMPILAN LENGKAP 4 TINGKAT SEPERTI DI SCREENSHOT 2 (VERTICALLY / HORIZONTALLY STACKED) */
          <div className="w-full h-full grid grid-cols-2 sm:grid-cols-4 gap-2 p-1">
            {levels.map((l) => (
              <div
                key={l.lvl}
                {...sifatTombol(
                  () => {
                    retroAudio.playSelect();
                    setActiveLevel(l.lvl);
                  },
                  `Lihat materi tingkat ${l.lvl} ${l.shortName}`,
                )}
                onClick={() => {
                  retroAudio.playSelect();
                  setActiveLevel(l.lvl);
                }}
                className="bg-slate-900/90 border-2 rounded-xl p-2.5 flex flex-col items-center justify-between cursor-pointer hover:scale-[1.02] transition-transform shadow-lg group relative overflow-hidden"
                style={{ borderColor: l.color }}
              >
                {/* Header Badge */}
                <div
                  className="w-full py-1.5 px-1.5 rounded-md text-slate-950 font-bold text-[13px] sm:text-[14px] font-pixel-title text-center mb-1"
                  style={{ backgroundColor: l.color }}
                >
                  LV.{l.lvl} {l.shortName}
                </div>

                {/* Vektor Gunung Berapi Sesuai SS 2 */}
                <div className="w-full flex-1 flex items-center justify-center my-1 max-h-[140px]">
                  {renderVolcanoArtwork(l.lvl, true)}
                </div>

                {/* Keterangan Karakteristik Visual */}
                <div className="w-full bg-slate-950/80 rounded-md p-1.5 border border-slate-800 text-center">
                  <p className="text-[15.5px] sm:text-[15px] text-slate-100 leading-snug font-sans font-medium line-clamp-3">
                    {l.visualFeature}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* TAMPILAN FOKUS DETAIL LEVEL TERTENTU (HERO VIEW) */
          <div className="w-full h-full flex flex-col md:flex-row items-center justify-between gap-3 p-2 bg-slate-950/70 rounded-xl border border-slate-800">
            {/* Kiri: Artwork Vektor Resolusi Tinggi Gunung Berapi */}
            <div className="w-full md:w-1/2 h-[180px] md:h-full flex items-center justify-center p-2 relative bg-slate-900/50 rounded-lg border border-slate-800/80">
              {renderVolcanoArtwork(activeLevel as 1 | 2 | 3 | 4, false)}
            </div>

            {/* Kanan: Panel Fakta Edukasi & Rekomendasi Resmi PVMBG */}
            <div className="w-full md:w-1/2 h-full flex flex-col justify-between p-2 font-pixel">
              <div>
                {/* Status Badge */}
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="px-3.5 py-1.5 rounded-md text-base sm:text-lg font-bold font-pixel-title text-slate-950 shadow-sm"
                    style={{ backgroundColor: currentLevelData.color }}
                  >
                    {currentLevelData.name}
                  </span>
                </div>

                {/* Deskripsi Sains Resmi (Font Besar, Kontras Tinggi & Sangat Mudah Dibaca) */}
                <p className="text-[17px] sm:text-[19px] md:text-[20px] text-slate-100 leading-relaxed mb-3.5 font-sans font-semibold">
                  {currentLevelData.desc}
                </p>

                {/* Gejala Visual Spesifik */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 mb-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <PixelIcon name="bulb" size={15} className="text-amber-400" />
                    <span className="text-[15px] sm:text-[17px] font-bold text-amber-300 font-pixel-title">
                      KARAKTERISTIK VISUAL:
                    </span>
                  </div>
                  <p className="text-[16px] sm:text-[17.5px] text-slate-100 leading-relaxed font-sans font-medium">
                    {currentLevelData.visualFeature}
                  </p>
                </div>
              </div>

              {/* Radius Bahaya & Tindakan Warga */}
              <div
                className="w-full py-3 px-3.5 rounded-lg border flex items-center justify-between bg-slate-900/90 shrink-0"
                style={{ borderColor: currentLevelData.border }}
              >
                <div className="flex items-center gap-2">
                  <span style={{ color: currentLevelData.color }}>
                    <PixelIcon name="shield" size={17} />
                  </span>
                  <span className="text-[15px] sm:text-base font-bold text-slate-100 font-sans">
                    ZONA BAHAYA:
                  </span>
                </div>
                <span className="text-[15px] sm:text-base font-bold font-sans" style={{ color: currentLevelData.color }}>
                  {currentLevelData.radius}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4 Status Buttons Selector + Toggle Semua Level */}
      <div className="w-full grid grid-cols-5 gap-1.5 pt-1 shrink-0">
        {levels.map((l) => (
          <button
            key={l.lvl}
            onClick={() => {
              retroAudio.playSelect();
              setActiveLevel(l.lvl);
            }}
            className={`px-1.5 py-2.5 rounded-lg border-2 text-[13.5px] sm:text-[13px] font-pixel-title cursor-pointer transition-all active:translate-y-0.5 text-center ${activeLevel === l.lvl
              ? 'text-slate-950 font-bold scale-[1.02] shadow-sm'
              : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
              }`}
            style={{
              backgroundColor: activeLevel === l.lvl ? l.color : undefined,
              borderColor: activeLevel === l.lvl ? l.border : undefined,
            }}
          >
            LV.{l.lvl} {l.shortName}
          </button>
        ))}
        <button
          onClick={() => {
            retroAudio.playSelect();
            setActiveLevel('all');
          }}
          className={`px-1.5 py-2.5 rounded-lg border-2 text-[13.5px] sm:text-[13px] font-pixel-title cursor-pointer transition-all active:translate-y-0.5 text-center ${activeLevel === 'all'
            ? 'bg-sky-400 text-slate-950 border-sky-300 font-bold scale-[1.02]'
            : 'bg-slate-800 text-sky-300 border-slate-700 hover:border-sky-400'
            }`}
        >
          SEMUA LEVEL
        </button>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN: PETA ZONASI KRB MERAPI & PROTOKOL APD (AREA 4 TEMUAN 2)
// Sesuai Arahan Pengguna:
// - 4 Tab: APD, Awan Panas, Lahar Hujan, dan Zonasi KRB Merapi
// - Gambar kiri disesuaikan dengan materi:
//   * Tab APD: Ilustrasi Masker N95, Kacamata Goggle, dan Baju Panjang
//   * Tab Awan Panas: Ilustrasi Gunung Merapi & Wedhus Gembel bergulung
//   * Tab Lahar Hujan: Ilustrasi Alur Lembah Sungai Lahar & Sirine EWS
//   * Tab Zonasi KRB: Peta Resmi Merapi '1.webp' secara statis permanen
// - Gambar kiri dapat diklik untuk membuka modal tampilan penuh (lightbox fullscreen)
// - Panel materi di sebelah kanan dapat di-scroll (overflow-y-auto) dengan rapi
// ═════════════════════════════════════════════════════════════════════════════
function VolcanoResponseIllustration() {
  const [activeTab, setActiveTab] = useState<'apd' | 'awanpanas' | 'lahar' | 'krb'>('apd');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!isFullscreen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const tabData = {
    apd: {
      title: 'ALAT PELINDUNG DIRI (APD)',
      subtitle: 'Standar Perlindungan Diri Menghadapi Hujan Abu Merapi',
      badge: '1. APD MASKER & BAJU',
      color: '#0ea5e9',
      border: '#bae6fd',
      bgHeader: 'bg-sky-950/90',
      borderHeader: 'border-sky-500',
      titleColor: 'text-sky-300',
      points: [
        {
          title: '• MASKER N95 / PARTIKULAT:',
          desc: 'Abu vulkanik Merapi terdiri dari pecahan kristal silika mikroskopis yang tajam menyerupai serpihan kaca. Wajib gunakan Masker N95 untuk menyaring minimal 95% partikel berukuran < 2.5 µm agar tidak masuk ke alveolus paru-paru (mencegah ISPA akut & silikosis).',
        },
        {
          title: '• KACAMATA GOGGLE RAPAT:',
          desc: 'Gunakan kacamata pelindung tertutup (goggle) yang menutup rapat rongga mata dari debu abrasif. DILARANG KERAS memakai lensa kontak dan DILARANG mengucek mata karena gesekan abu silika dapat merobek kornea mata!',
        },
        {
          title: '• BAJU LENGAN PANJANG & SEPATU:',
          desc: 'Kenakan pakaian tertutup rapat (baju lengan panjang, celana panjang, topi, dan sepatu) untuk melindungi pori-pori kulit dari iritasi kimiawi sulfur serta luka bakar abu panas.',
        },
      ],
      actionLabel: 'TINDAKAN DARURAT HUJAN ABU:',
      actionText:
        'Bilas mata dengan air bersih mengalir jika terkena abu. Tutup rapat tempat penampungan air dan wadah makanan!',
    },
    awanpanas: {
      title: 'AWAN PANAS GUGURAN (WEDHUS GEMBEL)',
      subtitle: 'Pyroclastic Density Current (PDC) — Bahaya Primer Letusan',
      badge: '2. BAHAYA AWAN PANAS',
      color: '#f43f5e',
      border: '#fda4af',
      bgHeader: 'bg-rose-950/90',
      borderHeader: 'border-rose-500',
      titleColor: 'text-rose-300',
      points: [
        {
          title: '• PENYEBAB UTAMA:',
          desc: 'Runtuhnya kubah lava aktif di puncak atau letusan eksplosif yang ambruk meluncur kencang menuruni lereng Merapi mengikuti alur lembah sungai.',
        },
        {
          title: '• KARAKTERISTIK MEMATIKAN:',
          desc: 'Suhu ekstrem mencapai 300°C - 800°C dengan kecepatan luncur 100 - 300 km/jam. Membawa campuran gas beracun, abu pekat, dan bongkahan batu pijar yang mematikan segala makhluk hidup di jalurnya.',
        },
        {
          title: '• ATURAN KESELAMATAN MUTLAK:',
          desc: 'Tidak ada masker atau pakaian yang dapat menahan terpaan awan panas! Satu-satunya cara selamat adalah evakuasi sebelum awan panas meluncur saat status Siaga/Awas diumumkan oleh PVMBG.',
        },
      ],
      actionLabel: 'PRIORITAS EVAKUASI:',
      actionText:
        'Tinggalkan seluruh zona KRB III seketika dan ikuti arahan relawan menuju barak pengungsian resmi di dataran rendah!',
      sourceUrl: 'https://lifestyle.kompas.com/read/2010/10/29/22092982/kecil-peluang-erupsi-merapi-eksplosif',
      sourceText: 'Dokumentasi Erupsi Merapi (Kompas.com)',
      sourceShort: 'Kompas.com',
    },
    lahar: {
      title: 'BANJIR LAHAR HUJAN (LAHAR DINGIN)',
      subtitle: 'Sediment Gravity Flow — Bahaya Sekunder Pasca-Erupsi',
      badge: '3. ANCAMAN LAHAR HUJAN',
      color: '#38bdf8',
      border: '#7dd3fc',
      bgHeader: 'bg-blue-950/90',
      borderHeader: 'border-blue-500',
      titleColor: 'text-blue-300',
      points: [
        {
          title: '• MEKANISME LAHAR HUJAN:',
          desc: 'Jutaan meter kubik material endapan abu, pasir, dan batu besar di puncak Merapi tersapu oleh curah hujan lebat di hulu, bercampur menjadi bubur lumpur pekat dengan massa jenis tinggi.',
        },
        {
          title: '• ANCAMAN BANTARAN SUNGAI:',
          desc: 'Lahar menerjang alur sungai (Kali Gendol, Krasak, Boyong, Bebeng, Woro) dengan kecepatan 40 - 60 km/jam, mampu mengikis tebing, menjebol sabo dam, dan menghancurkan jembatan.',
        },
        {
          title: '• SIRINE SISTEM PERINGATAN DINI (EWS):',
          desc: 'Sensor getaran telemetri di hulu akan membunyikan sirine EWS otomatis di sepanjang bantaran sungai saat lahar melintas. Jika sirine berbunyi, segera lari ke tempat tinggi!',
        },
      ],
      actionLabel: 'PROTOKOL BANTARAN SUNGAI:',
      actionText:
        'DILARANG menonton lahar di atas jembatan! Jauhi sempadan dan tebing sungai minimal 300 - 500 meter saat mendung di hulu!',
      sourceUrl: 'https://news.detik.com/berita/d-7301571/4-fakta-banjir-lahar-dingin-semeru-yang-tewaskan-3-orang',
      sourceText: 'Dokumentasi Banjir Lahar Dingin (Detikcom)',
      sourceShort: 'Detikcom',
    },
    krb: {
      title: 'PETA KAWASAN RAWAN BENCANA (KRB)',
      subtitle: 'Standar Zonasi Kerentanan & Bahaya Resmi PVMBG & BNPB',
      badge: '4. ZONASI KRB MERAPI',
      color: '#facc15',
      border: '#fef08a',
      bgHeader: 'bg-amber-950/90',
      borderHeader: 'border-amber-500',
      titleColor: 'text-amber-300',
      points: [
        {
          title: '• KRB III (ZONA MERAH - LERENG ATAS 0-10 KM):',
          desc: 'Sangat sering terlanda awan panas wedhus gembel, aliran lava, dan lontaran batu pijar. Merupakan ZONA LARANGAN HUNIAN TETAP. Wajib evakuasi total seketika saat status Siaga/Awas.',
        },
        {
          title: '• KRB II (ZONA KUNING - LERENG TENGAH):',
          desc: 'Berpotensi terlanda awan panas guguran berskala besar, lontaran batu pijar, dan hujan abu lebat. Warga wajib siaga evakuasi mandiri dan menyiapkan Tas Siaga Bencana.',
        },
        {
          title: '• KRB I (ZONA HIJAU - LEMBAH & SUNGAI):',
          desc: 'Kawasan di sepanjang sempadan sungai yang rawan terjang banjir lahar hujan dan perluasan luapan air. Jaga jarak aman minimal 300 meter dari sungai saat hujan di puncak.',
        },
      ],
      actionLabel: 'PEDOMAN TANGGAP ZONA:',
      actionText:
        'Kenali status zona tempat tinggalmu pada peta resmi dan selalu patuhi rambu serta radius aman PVMBG!',
      sourceUrl: 'https://syawal88.wordpress.com/2010/11/17/dapatkah-gunung-mati-menjadi-gunung-aktif/',
      sourceText: 'Peta Kawasan Rawan Bencana Merapi (syawal88.wordpress.com)',
      sourceShort: 'syawal88.wordpress.com',
    },
  };

  const currentTab = tabData[activeTab];

  // Helper untuk merender visual (baik di dalam preview maupun di modal fullscreen)
  const renderVisualContent = (tabKey: 'apd' | 'awanpanas' | 'lahar' | 'krb', isExpanded: boolean = false) => {
    switch (tabKey) {
      case 'apd':
        return (
          <svg viewBox="0 0 520 340" className="w-full h-full object-cover" shapeRendering="geometricPrecision">
            <rect x="0" y="0" width="520" height="340" fill="#090d16" />
            <rect x="15" y="14" width="490" height="28" rx="6" fill="#0369a1" fillOpacity="0.4" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="260" y="32" textAnchor="middle" fill="#7dd3fc" fontSize="11" fontWeight="bold" fontFamily="monospace">
              STANDAR APD WAJIB: PARTIKEL ABU SILIKA MERAPI
            </text>

            {/* 1. MASKER N95 */}
            <g transform="translate(15, 52)">
              <rect x="0" y="0" width="154" height="274" rx="8" fill="#18181b" stroke="#0ea5e9" strokeWidth="2" />
              <rect x="0" y="0" width="154" height="28" rx="8" fill="#0284c7" />
              <text x="77" y="19" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="monospace">
                1. MASKER N95
              </text>
              <ellipse cx="77" cy="95" rx="46" ry="34" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2.5" />
              <path d="M 48,78 Q 77,72 106,78" stroke="#ca8a04" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              <line x1="33" y1="95" x2="6" y2="85" stroke="#facc15" strokeWidth="2.5" />
              <line x1="121" y1="95" x2="148" y2="85" stroke="#facc15" strokeWidth="2.5" />
              <line x1="33" y1="105" x2="6" y2="115" stroke="#facc15" strokeWidth="2.5" />
              <line x1="121" y1="105" x2="148" y2="115" stroke="#facc15" strokeWidth="2.5" />
              <text x="77" y="118" textAnchor="middle" fill="#0284c7" fontSize="10" fontWeight="bold">N95 FILTER</text>
              <foreignObject x="8" y="152" width="138" height="114">
                <p className="text-[14.5px] sm:text-[13px] text-slate-200 leading-snug font-sans text-center font-semibold">
                  Menyaring <strong className="text-sky-300 font-bold">&ge; 95%</strong> partikel kristal silika tajam &lt; 2.5 µm pencegah silikosis &amp; ISPA akut.
                </p>
              </foreignObject>
            </g>

            {/* 2. KACAMATA GOGGLE */}
            <g transform="translate(183, 52)">
              <rect x="0" y="0" width="154" height="274" rx="8" fill="#18181b" stroke="#f59e0b" strokeWidth="2" />
              <rect x="0" y="0" width="154" height="28" rx="8" fill="#d97706" />
              <text x="77" y="19" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="monospace">
                2. KACAMATA GOGGLE
              </text>
              <rect x="22" y="76" width="50" height="36" rx="8" fill="#38bdf8" stroke="#0284c7" strokeWidth="2.5" />
              <rect x="82" y="76" width="50" height="36" rx="8" fill="#38bdf8" stroke="#0284c7" strokeWidth="2.5" />
              <line x1="72" y1="94" x2="82" y2="94" stroke="#0284c7" strokeWidth="4" />
              <line x1="22" y1="94" x2="6" y2="94" stroke="#475569" strokeWidth="3.5" />
              <line x1="132" y1="94" x2="148" y2="94" stroke="#475569" strokeWidth="3.5" />
              <circle cx="47" cy="94" r="6" fill="#ffffff" opacity="0.6" />
              <circle cx="107" cy="94" r="6" fill="#ffffff" opacity="0.6" />
              <foreignObject x="8" y="152" width="138" height="114">
                <p className="text-[14.5px] sm:text-[13px] text-slate-200 leading-snug font-sans text-center font-semibold">
                  Menutup rapat rongga mata. <strong className="text-rose-400 font-bold">Dilarang lensa kontak &amp; kucek mata</strong> karena abu adalah serpihan kaca!
                </p>
              </foreignObject>
            </g>

            {/* 3. PAKAIAN TERTUTUP */}
            <g transform="translate(351, 52)">
              <rect x="0" y="0" width="154" height="274" rx="8" fill="#18181b" stroke="#10b981" strokeWidth="2" />
              <rect x="0" y="0" width="154" height="28" rx="8" fill="#059669" />
              <text x="77" y="19" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="monospace">
                3. PAKAIAN TERTUTUP
              </text>
              <path d="M 44,70 L 77,64 L 110,70 L 128,98 L 110,106 L 100,90 L 100,124 L 54,124 L 54,90 L 44,106 L 26,98 Z" fill="#047857" stroke="#34d399" strokeWidth="2" />
              <line x1="77" y1="64" x2="77" y2="124" stroke="#a7f3d0" strokeWidth="2.5" />
              <line x1="54" y1="104" x2="100" y2="104" stroke="#facc15" strokeWidth="2.5" />
              <foreignObject x="8" y="152" width="138" height="114">
                <p className="text-[14.5px] sm:text-[13px] text-slate-200 leading-snug font-sans text-center font-semibold">
                  Baju lengan panjang, celana panjang, topi &amp; sepatu tertutup pelindung iritasi sulfur &amp; luka panas.
                </p>
              </foreignObject>
            </g>
          </svg>
        );

      case 'awanpanas':
        return (
          <div className="w-full h-full flex items-center justify-center relative overflow-hidden bg-slate-950">
            <img
              src="/wedhus_gembel.jpg"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.dataset.tried) {
                  target.dataset.tried = '1';
                  target.src = '/images (1).jpeg';
                }
              }}
              alt="Awan Panas Guguran (Wedhus Gembel) Gunung Merapi Asli"
              className={`w-full h-full object-cover rounded-none ${isExpanded ? 'max-h-[75vh]' : ''}`}
            />
            {!isExpanded && (
              <div className="absolute top-2.5 left-2.5 px-3 py-1.5 rounded-md bg-slate-950/90 backdrop-blur-sm border border-rose-500 text-rose-300 text-[14.5px] sm:text-[13px] font-pixel-title font-bold flex items-center gap-1.5 shadow-md">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span>● AWAN PANAS GUGURAN (WEDHUS GEMBEL)</span>
              </div>
            )}
            <a
              href="https://lifestyle.kompas.com/read/2010/10/29/22092982/kecil-peluang-erupsi-merapi-eksplosif"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-md bg-slate-950/90 backdrop-blur-sm border border-rose-500/80 hover:border-rose-400 text-rose-300 hover:text-rose-200 text-[13.5px] font-sans font-bold flex items-center gap-1.5 shadow-lg transition-all z-10 cursor-pointer hover:bg-slate-900"
              title="Buka sumber dokumentasi: Kompas.com"
            >
              <span>Sumber: Kompas.com ↗</span>
            </a>
          </div>
        );

      case 'lahar':
        return (
          <div className="w-full h-full flex items-center justify-center relative">
            <img
              src="/lahar_dingin.jpg"
              alt="Banjir Lahar Hujan Dingin Kali Gendol & Woro Merapi"
              className={`w-full h-full object-cover rounded-none ${isExpanded ? 'max-h-[75vh]' : ''}`}
            />
            {!isExpanded && (
              <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-slate-950/90 backdrop-blur-sm border border-sky-400 text-sky-300 text-[13.5px] font-sans font-bold flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                <span>● ALIRAN LAHAR HUJAN DINGIN (ALUR SUNGAI)</span>
              </div>
            )}
            <a
              href="https://news.detik.com/berita/d-7301571/4-fakta-banjir-lahar-dingin-semeru-yang-tewaskan-3-orang"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-md bg-slate-950/90 backdrop-blur-sm border border-sky-400/80 hover:border-sky-300 text-sky-300 hover:text-sky-200 text-[13.5px] font-sans font-bold flex items-center gap-1.5 shadow-lg transition-all z-10 cursor-pointer hover:bg-slate-900"
              title="Buka sumber dokumentasi: Detikcom"
            >
              <span>Sumber: Detikcom ↗</span>
            </a>
          </div>
        );

      case 'krb':
        return (
          <div className="w-full h-full flex items-center justify-center relative">
            <img
              src="/1.webp"
              alt="Peta Kawasan Rawan Bencana (KRB) Merapi Resmi"
              className={`w-full h-full object-contain ${isExpanded ? 'max-h-[75vh]' : ''}`}
            />
            {!isExpanded && (
              <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-slate-950/90 backdrop-blur-sm border border-amber-400 text-amber-300 text-[13.5px] font-pixel-title font-bold flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>● PETA KRB MERAPI (III, II, I)</span>
              </div>
            )}
            <a
              href="https://syawal88.wordpress.com/2010/11/17/dapatkah-gunung-mati-menjadi-gunung-aktif/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-md bg-slate-950/90 backdrop-blur-sm border border-amber-400/80 hover:border-amber-300 text-amber-300 hover:text-amber-200 text-[13.5px] font-sans font-bold flex items-center gap-1.5 shadow-lg transition-all z-10 cursor-pointer hover:bg-slate-900"
              title="Buka sumber rujukan peta: syawal88.wordpress.com"
            >
              <span>Sumber: syawal88.wordpress.com ↗</span>
            </a>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-2 font-pixel relative">
      {/* Main Content Area: Left Image/SVG & Right Scrollable Info Panel */}
      <div className="w-full flex-1 flex flex-col md:flex-row items-center justify-between gap-3 p-1.5 overflow-hidden">
        {/* Kolom Kiri: Visual Gambar / Ilustrasi Sesuai Materi Tab Aktif - Memenuhi Kotak Maksimal & Fullscreen */}
        <div
          {...sifatTombol(
            () => {
              retroAudio.playSelect();
              setIsFullscreen(true);
            },
            'Perbesar gambar ke tampilan penuh',
          )}
          onClick={() => {
            retroAudio.playSelect();
            setIsFullscreen(true);
          }}
          className="w-full md:w-3/5 h-[230px] md:h-full bg-slate-950 rounded-xl border-2 border-slate-700/80 p-0 flex items-center justify-center relative overflow-hidden shadow-inner group cursor-pointer hover:border-amber-400 transition-all"
          title="Klik gambar untuk melihat dalam tampilan penuh (fullscreen)"
        >
          {renderVisualContent(activeTab, false)}

          {/* Badge Tombol Klik Perbesar di Sudut Kanan Bawah */}
          <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-md bg-slate-950/90 backdrop-blur-sm border border-slate-700 group-hover:border-amber-400 group-hover:text-amber-300 text-slate-300 text-[13px] font-pixel-title font-bold flex items-center gap-1.5 shadow-md transition-all">
            <PixelIcon name="search" size={11} />
            <span>KLIK UNTUK PERBESAR</span>
          </div>
        </div>

        {/* Kolom Kanan: Panel Sains Edukatif Sesuai Tab Terpilih - Font Lebih Besar & Mudah Dibaca */}
        <div className="w-full md:w-2/5 h-full flex flex-col overflow-hidden font-pixel">
          <div className="w-full h-full overflow-y-auto pr-1.5 custom-pixel-scroll space-y-2.5">
            {/* Header Kotak Judul */}
            <div className={`w-full py-2.5 px-3.5 ${currentTab.bgHeader} border-2 ${currentTab.borderHeader} rounded-xl shadow-sm`}>
              <span className={`text-base sm:text-lg md:text-xl ${currentTab.titleColor} font-bold font-pixel-title block leading-snug`}>
                {currentTab.title}
              </span>
              <span className="text-[13px] sm:text-[15px] text-slate-200 font-sans font-medium block mt-1">
                {currentTab.subtitle}
              </span>
            </div>

            {/* Daftar Poin Materi Edukasi */}
            <div className="space-y-2.5 text-slate-200">
              {currentTab.points.map((pt, idx) => (
                <div key={idx} className="bg-slate-900/95 border border-slate-800 rounded-lg p-3 shadow-sm">
                  <span className="font-bold font-pixel-title text-[17px] sm:text-[19px] block mb-1.5" style={{ color: currentTab.color }}>
                    {pt.title}
                  </span>
                  <p className="text-[17px] sm:text-[18px] leading-relaxed text-slate-100 font-medium font-sans">
                    {pt.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Kotak Tindakan / Arahan Keselamatan */}
            <div
              className="p-3 bg-slate-900/95 border-2 rounded-lg text-slate-100 mt-2.5 shadow-sm"
              style={{ borderColor: currentTab.color }}
            >
              <span className="font-bold text-[17px] sm:text-[19px] block mb-1 font-pixel-title" style={{ color: currentTab.color }}>
                {currentTab.actionLabel}
              </span>
              <p className="text-[16.5px] sm:text-[18px] leading-relaxed text-slate-100 font-medium font-sans">
                {currentTab.actionText}
              </p>
            </div>

            {/* Kotak Rujukan / Sumber Materi Edukasi */}
            {(currentTab as any).sourceUrl && (
              <div className="p-2.5 bg-slate-900/95 border border-slate-800 rounded-lg text-slate-200 mt-2 shadow-sm flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <span className="text-amber-400 font-pixel text-[13px] font-bold shrink-0">SUMBER:</span>
                  <span className="text-[13px] text-slate-300 font-sans truncate font-semibold">
                    {(currentTab as any).sourceText}
                  </span>
                </div>
                <a
                  href={(currentTab as any).sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/80 text-amber-300 text-[14.5px] font-sans font-bold rounded flex items-center gap-1 shrink-0 transition-all cursor-pointer"
                  title={`Kunjungi rujukan sumber: ${(currentTab as any).sourceUrl}`}
                >
                  <span>Buka Tautan</span>
                  <span className="text-[13.5px] font-semibold">↗</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Switcher: 4 Tombol Pilihan Materi */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 shrink-0">
        <button
          onClick={() => {
            retroAudio.playSelect();
            setActiveTab('apd');
          }}
          className={`px-2.5 py-2.5 rounded-lg border-2 text-[14.5px] sm:text-[13px] font-pixel-title cursor-pointer transition-all active:translate-y-0.5 text-center ${activeTab === 'apd'
            ? 'bg-sky-500 text-slate-950 border-sky-200 font-bold shadow-md scale-[1.02]'
            : 'bg-slate-900 text-sky-300 border-slate-700 hover:border-sky-500'
            }`}
        >
          1. APD MASKER & BAJU
        </button>
        <button
          onClick={() => {
            retroAudio.playSelect();
            setActiveTab('awanpanas');
          }}
          className={`px-2.5 py-2.5 rounded-lg border-2 text-[14.5px] sm:text-[13px] font-pixel-title cursor-pointer transition-all active:translate-y-0.5 text-center ${activeTab === 'awanpanas'
            ? 'bg-rose-600 text-white border-rose-300 font-bold shadow-md scale-[1.02]'
            : 'bg-slate-900 text-rose-300 border-slate-700 hover:border-rose-500'
            }`}
        >
          2. BAHAYA AWAN PANAS
        </button>
        <button
          onClick={() => {
            retroAudio.playSelect();
            setActiveTab('lahar');
          }}
          className={`px-2.5 py-2.5 rounded-lg border-2 text-[14.5px] sm:text-[13px] font-pixel-title cursor-pointer transition-all active:translate-y-0.5 text-center ${activeTab === 'lahar'
            ? 'bg-blue-600 text-white border-blue-300 font-bold shadow-md scale-[1.02]'
            : 'bg-slate-900 text-blue-300 border-slate-700 hover:border-blue-500'
            }`}
        >
          3. ANCAMAN LAHAR HUJAN
        </button>
        <button
          onClick={() => {
            retroAudio.playSelect();
            setActiveTab('krb');
          }}
          className={`px-2.5 py-2.5 rounded-lg border-2 text-[14.5px] sm:text-[13px] font-pixel-title cursor-pointer transition-all active:translate-y-0.5 text-center ${activeTab === 'krb'
            ? 'bg-amber-500 text-slate-950 border-amber-200 font-bold shadow-md scale-[1.02]'
            : 'bg-slate-900 text-amber-300 border-slate-700 hover:border-amber-500'
            }`}
        >
          4. PETA ZONASI KRB
        </button>
      </div>

      {/* Lightbox Modal Fullscreen untuk Gambar/Visual */}
      {isFullscreen && (
        <div onKeyDown={tutupModalDenganKeyboard(() => setIsFullscreen(false))}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 animate-fadeIn font-pixel"
          onClick={() => setIsFullscreen(false)}
        >
          <div onKeyDown={blokirRambatanTombol()}
            className="relative w-full max-w-5xl max-h-[92vh] bg-slate-950 border-3 border-amber-600/90 rounded-2xl p-3 sm:p-5 flex flex-col items-center shadow-[0_0_60px_rgba(0,0,0,0.95)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal Lightbox */}
            <div className="w-full flex items-center justify-between pb-3 mb-2 border-b-2 border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full animate-ping" style={{ backgroundColor: currentTab.color }} />
                <h3 className="font-pixel-title text-[13px] sm:text-base md:text-lg text-amber-300 font-bold">
                  {currentTab.badge} — {currentTab.title}
                </h3>
              </div>
              <button
                onClick={() => {
                  retroAudio.playSelect();
                  setIsFullscreen(false);
                }}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-pixel-title text-[13px] sm:text-[15px] rounded-lg border-2 border-rose-300 shadow cursor-pointer transition-colors active:translate-y-0.5 font-semibold"
              >
                ✕ TUTUP [ESC]
              </button>
            </div>

            {/* Area Gambar / Visual Ukuran Besar */}
            <div className="w-full flex-1 min-h-0 flex items-center justify-center overflow-auto rounded-xl bg-slate-900/60 p-2">
              <div className="w-full h-full max-h-[76vh] flex items-center justify-center">
                {renderVisualContent(activeTab, true)}
              </div>
            </div>

            {/* Footer Petunjuk & Sumber Rujukan */}
            <div className="w-full pt-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[14.5px] text-slate-300 font-sans shrink-0 border-t border-slate-800/80 mt-1 font-semibold">
              <span className="text-slate-400">Klik tombol Tutup, tekan tombol [ESC], atau klik di luar kotak untuk kembali</span>
              {(currentTab as any).sourceUrl ? (
                <a
                  href={(currentTab as any).sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-300 hover:text-amber-200 underline font-medium flex items-center gap-1 shrink-0"
                >
                  <span className="font-pixel text-amber-400">Sumber Dokumentasi:</span>
                  <span>{(currentTab as any).sourceText}</span>
                  <span className="text-[13.5px] font-semibold">↗</span>
                </a>
              ) : (
                <span className="text-amber-400 font-pixel font-bold">RESQ-BOX KESIAPSIAGAAN MERAPI</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN: PROSEDUR KESELAMATAN & MEDIS PASCABENCANA (AREA 3 MODUL 1)
// Diselaraskan 100% dengan Buku Saku BNPB: Waspada Susulan, Utilitas, P3K, & Tandu
// ═════════════════════════════════════════════════════════════════════════════
function EarthquakePostSafetyIllustration() {
  const [activeTab, setActiveTab] = useState<'susulan' | 'utilitas' | 'p3k' | 'tandu'>('susulan');

  const tabDetails = {
    susulan: {
      title: 'WASPADA GEMPA SUSULAN (AFTERSHOCK)',
      badge: 'BAHAYA LANJUTAN',
      color: '#f97316',
      desc: 'Gempa susulan sering terjadi beberapa menit hingga beberapa hari setelah gempa utama. Gedung yang sudah retak sangat rapuh dan dapat roboh tiba-tiba. Tetaplah berada di ruang terbuka dan jangan pernah kembali ke dalam gedung sebelum ada izin tim ahli!',
    },
    utilitas: {
      title: 'PEMUTUSAN SAKELAR LISTRIK & GAS',
      badge: 'PENCEGAHAN KEBAKARAN',
      color: '#eab308',
      desc: 'Guncangan gempa sering merusak kabel instalasi dan mematahkan sambungan pipa gas. Segera matikan MCB utama listrik dan tutup rapat katup tabung gas/kompor untuk mencegah terjadinya kebakaran sekunder pascabencana.',
    },
    p3k: {
      title: 'PERTOLONGAN PERTAMA P3K & LUKA RINGAN',
      badge: 'PENANGANAN MEDIS',
      color: '#ef4444',
      desc: 'Lakukan pembersihan luka lecet dan gores menggunakan cairan antiseptik steril, lalu balut dengan kasa bersih. Berikan air minum kepada korban yang syok ringan dan pastikan kotak P3K tersedia di posko darurat.',
    },
    tandu: {
      title: 'PROSEDUR TANDU & LARANGAN MEMINDAHKAN KORBAN',
      badge: 'STANDAR MEDIS KRUSIAL',
      color: '#3b82f6',
      desc: 'JANGAN PERNAH memindahkan atau menggeser korban yang dicurigai mengalami cedera tulang leher, tulang belakang, atau patah tulang berat sendirian tanpa tandu darurat dan pendampingan tim medis. Salah mengangkat dapat menyebabkan kelumpuhan permanen!',
    },
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-2 font-pixel">
      {/* Top Banner */}
      <div className="w-full flex items-center justify-between px-2 pb-1.5 border-b border-slate-800">
        <span className="text-[13px] sm:text-[15px] font-pixel-title text-amber-400 font-bold flex items-center gap-1.5">
          <PixelIcon name="shield" size={14} />
          SOP KESELAMATAN &amp; MEDIS PASCABENCANA
        </span>
        <span className="text-[13.5px] sm:text-[13px] text-slate-400 font-pixel font-semibold">
          STANDAR BNPB &amp; PMI
        </span>
      </div>

      {/* SVG Canvas Area */}
      <div className="w-full flex-1 flex items-center justify-center p-2">
        <svg viewBox="0 0 540 220" className="w-full h-full object-contain" shapeRendering="crispEdges">
          {/* Background Room/Area */}
          <rect x="0" y="0" width="540" height="220" fill="#0b0f19" />
          <rect x="0" y="0" width="540" height="170" fill="#0f172a" />
          <line x1="0" y1="170" x2="540" y2="170" stroke="#1e293b" strokeWidth="2" />
          <rect x="0" y="170" width="540" height="50" fill="#1e293b" />

          {/* 1. VISUAL GEMPA SUSULAN (AFTERSHOCK) */}
          {activeTab === 'susulan' && (
            <g transform="translate(30, 20)">
              {/* Gedung Retak Berbahaya */}
              <rect x="20" y="10" width="140" height="135" fill="#334155" stroke="#475569" strokeWidth="2" />
              <rect x="35" y="25" width="25" height="30" fill="#64748b" />
              <rect x="75" y="25" width="25" height="30" fill="#64748b" />
              <rect x="115" y="25" width="25" height="30" fill="#64748b" />
              <rect x="35" y="75" width="25" height="30" fill="#64748b" />
              <rect x="75" y="75" width="25" height="30" fill="#64748b" />
              <rect x="115" y="75" width="25" height="30" fill="#64748b" />

              {/* Garis Retakan Merah Bahaya */}
              <path d="M 65 10 L 78 45 L 60 85 L 85 125 L 80 145" stroke="#ef4444" strokeWidth="3" fill="none" />
              <path d="M 120 40 L 105 75 L 125 105" stroke="#ef4444" strokeWidth="2" fill="none" />

              {/* Reruntuhan jatuh di bawah */}
              <rect x="50" y="148" width="12" height="8" fill="#475569" />
              <rect x="90" y="152" width="10" height="6" fill="#64748b" />

              {/* Pita Kuning Peringatan DILARANG MENDEKAT */}
              <rect x="10" y="125" width="160" height="12" fill="#eab308" />
              <line x1="10" y1="131" x2="170" y2="131" stroke="#000000" strokeWidth="2" />

              {/* Panah Evakuasi Menjauh ke Lapangan */}
              <path d="M 185 85 L 215 85 L 215 75 L 235 95 L 215 115 L 215 105 L 185 105 Z" fill="#22c55e" />
              <circle cx="210" cy="50" r="16" fill="#ef4444" opacity="0.2" />
              <text x="210" y="55" fill="#ef4444" fontSize="14" fontWeight="bold" textAnchor="middle">!</text>
            </g>
          )}

          {/* 2. VISUAL PEMUTUSAN LISTRIK & GAS */}
          {activeTab === 'utilitas' && (
            <g transform="translate(30, 20)">
              {/* Panel Box Listrik MCB */}
              <rect x="20" y="15" width="70" height="110" rx="4" fill="#334155" stroke="#64748b" strokeWidth="2" />
              <rect x="28" y="25" width="54" height="45" fill="#1e293b" />
              {/* Sakelar MCB (Posisi OFF ke bawah) */}
              <rect x="42" y="32" width="10" height="30" fill="#475569" />
              <rect x="40" y="44" width="14" height="15" rx="2" fill="#ef4444" />
              <rect x="58" y="32" width="10" height="30" fill="#475569" />
              <rect x="56" y="44" width="14" height="15" rx="2" fill="#ef4444" />
              <text x="55" y="86" fill="#facc15" fontSize="7" fontWeight="bold" textAnchor="middle">MCB: OFF</text>

              {/* Tabung Gas LPG dengan Katup Tertutup */}
              <rect x="110" y="45" width="55" height="80" rx="8" fill="#15803d" stroke="#16a34a" strokeWidth="2" />
              <rect x="125" y="28" width="25" height="17" rx="3" fill="#334155" />
              <circle cx="137" cy="22" r="7" fill="#dc2626" />
              <text x="137" y="95" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">GAS</text>

              {/* Tabung APAR Pemadam Api */}
              <rect x="185" y="35" width="30" height="90" rx="5" fill="#dc2626" stroke="#b91c1c" strokeWidth="2" />
              <rect x="195" y="20" width="10" height="15" fill="#1e293b" />
              <rect x="188" y="16" width="24" height="6" fill="#475569" />
              <text x="200" y="85" fill="#ffffff" fontSize="6.5" fontWeight="bold" textAnchor="middle">APAR</text>
            </g>
          )}

          {/* 3. VISUAL PERTOLONGAN PERTAMA P3K */}
          {activeTab === 'p3k' && (
            <g transform="translate(30, 20)">
              {/* Kotak P3K Terbuka */}
              <rect x="20" y="30" width="100" height="95" rx="6" fill="#dc2626" stroke="#b91c1c" strokeWidth="2" />
              <rect x="25" y="35" width="90" height="85" rx="4" fill="#ef4444" />
              {/* Palang Putih P3K */}
              <rect x="62" y="55" width="16" height="45" fill="#ffffff" />
              <rect x="47" y="70" width="46" height="16" fill="#ffffff" />

              {/* Botol Antiseptik & Kasa */}
              <rect x="135" y="40" width="35" height="75" rx="4" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
              <rect x="145" y="25" width="15" height="15" fill="#e0f2fe" />
              <text x="152" y="80" fill="#ffffff" fontSize="6.5" fontWeight="bold" textAnchor="middle">ANTISEPTIK</text>

              {/* Roll Perban Kasa */}
              <circle cx="205" cy="85" r="26" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
              <circle cx="205" cy="85" r="10" fill="#94a3b8" />
              <rect x="195" y="105" width="30" height="12" fill="#f8fafc" stroke="#cbd5e1" />
            </g>
          )}

          {/* 4. VISUAL TANDU MEDIS KESELAMATAN */}
          {activeTab === 'tandu' && (
            <g transform="translate(30, 20)">
              {/* Tandu Medis Lipat (Rescue Stretcher) */}
              <rect x="20" y="75" width="195" height="24" rx="4" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
              <rect x="15" y="82" width="205" height="10" fill="#475569" />
              {/* Kaki Tandu */}
              <rect x="35" y="99" width="6" height="30" fill="#334155" />
              <rect x="190" y="99" width="6" height="30" fill="#334155" />

              {/* Bantal Leher Penopang (Cervical Collar / Head Immobilizer) */}
              <rect x="30" y="65" width="28" height="12" rx="3" fill="#ef4444" />
              {/* Sabuk Pengaman Tubuh (Safety Straps) */}
              <rect x="75" y="73" width="8" height="28" fill="#1e293b" />
              <rect x="135" y="73" width="8" height="28" fill="#1e293b" />

              {/* Tanda Peringatan: JANGAN ANGKAT TANPA TANDU */}
              <rect x="40" y="20" width="160" height="26" rx="4" fill="#ef4444" stroke="#dc2626" strokeWidth="1.5" />
              <text x="120" y="36" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">
                WAJIB TANDU &amp; TIM MEDIS!
              </text>
            </g>
          )}

          {/* Panel Deskripsi Kanan (HTML Responsif, Tidak Akan Terpotong / Over) */}
          <foreignObject x="260" y="10" width="270" height="200">
            <div className="w-full h-full bg-[#111827]/95 border-2 border-slate-700/80 rounded-xl p-3 flex flex-col justify-start overflow-y-auto shadow-md">
              <div className="flex items-center gap-1.5 mb-1.5 shrink-0">
                <span
                  className="px-2 py-0.5 rounded text-[13px] font-bold text-slate-950 uppercase tracking-wider shadow-sm"
                  style={{ backgroundColor: tabDetails[activeTab].color }}
                >
                  {tabDetails[activeTab].badge}
                </span>
              </div>
              <h3 className="text-[13px] sm:text-[15.5px] font-bold text-slate-100 leading-snug font-sans tracking-wide mb-2 shrink-0">
                {tabDetails[activeTab].title}
              </h3>
              <p className="text-[14.5px] sm:text-[15px] text-slate-200 leading-relaxed font-sans font-medium">
                {tabDetails[activeTab].desc}
              </p>
            </div>
          </foreignObject>
        </svg>
      </div>

      {/* Button Switcher Tabs */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
        <button
          onClick={() => setActiveTab('susulan')}
          className={`px-2 py-2 rounded-lg border-2 text-[13px] sm:text-[14.5px] font-pixel-title cursor-pointer transition-all ${activeTab === 'susulan'
            ? 'bg-orange-500 text-slate-950 border-orange-300 font-bold'
            : 'bg-slate-800 text-orange-300 border-slate-700 hover:border-orange-500'
            }`}
        >
          1. GEMPA SUSULAN
        </button>
        <button
          onClick={() => setActiveTab('utilitas')}
          className={`px-2 py-2 rounded-lg border-2 text-[13px] sm:text-[14.5px] font-pixel-title cursor-pointer transition-all ${activeTab === 'utilitas'
            ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold'
            : 'bg-slate-800 text-amber-300 border-slate-700 hover:border-amber-400'
            }`}
        >
          2. LISTRIK &amp; GAS
        </button>
        <button
          onClick={() => setActiveTab('p3k')}
          className={`px-2 py-2 rounded-lg border-2 text-[13px] sm:text-[14.5px] font-pixel-title cursor-pointer transition-all ${activeTab === 'p3k'
            ? 'bg-rose-500 text-slate-950 border-rose-300 font-bold'
            : 'bg-slate-800 text-rose-300 border-slate-700 hover:border-rose-500'
            }`}
        >
          3. PERTOLONGAN P3K
        </button>
        <button
          onClick={() => setActiveTab('tandu')}
          className={`px-2 py-2 rounded-lg border-2 text-[13px] sm:text-[14.5px] font-pixel-title cursor-pointer transition-all ${activeTab === 'tandu'
            ? 'bg-sky-500 text-slate-950 border-sky-300 font-bold'
            : 'bg-slate-800 text-sky-300 border-slate-700 hover:border-sky-500'
            }`}
        >
          4. PROSEDUR TANDU
        </button>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN: MANAJEMEN TITIK KUMPUL & KOMUNIKASI RESMI (AREA 3 MODUL 2)
// Diselaraskan 100% dengan Buku Saku BNPB: Lapangan, Presensi, BMKG & Jalur Evakuasi
// ═════════════════════════════════════════════════════════════════════════════
function EarthquakePostCoordinationIllustration() {
  const [activeTab, setActiveTab] = useState<'lapangan' | 'presensi' | 'bmkg' | 'evakuasi'>('lapangan');

  const tabDetails = {
    lapangan: {
      title: 'ZONA LAPANGAN TERBUKA (TITIK KUMPUL)',
      badge: 'AREA AMAN',
      color: '#22c55e',
      desc: 'Lapangan terbuka adalah lokasi paling ideal sebagai titik kumpul pasca-evakuasi gempa bumi. Area ini bebas dari ancaman tertimpa reruntuhan genteng, kaca jendela pecah, pohon tumbang, serta kabel dan tiang listrik yang putus.',
    },
    presensi: {
      title: 'PRESENSI & PENDATAAN WARGA SEKOLAH',
      badge: 'MANAJEMEN KELAS',
      color: '#3b82f6',
      desc: 'Setibanya di titik kumpul, ketua regu PMR/OSIS dan wali kelas segera melakukan absensi menyeluruh. Jika ada rekan yang belum tiba atau tertinggal di dalam gedung, segera laporkan ke tim SAR/BPBD tanpa mencoba masuk kembali sendiri!',
    },
    bmkg: {
      title: 'INFORMASI RESMI BMKG & KANAL BPBD',
      badge: 'SUMBER TERPERCAYA',
      color: '#f59e0b',
      desc: 'Hanya dengarkan siaran resmi dari BMKG (Badan Meteorologi, Klimatologi, dan Geofisika) serta BPBD setempat melalui radio siaran darurat atau aplikasi resmi. Jangan menyebarkan informasi kabar burung atau pesan berantai hoaks yang menimbulkan kepanikan!',
    },
    evakuasi: {
      title: 'JALUR EVAKUASI LANJUTAN & AMBULANS',
      badge: 'LOGISTIK TRANSIT',
      color: '#ec4899',
      desc: 'Tetap berada di lapangan hingga pihak berwenang membuka jalur evakuasi akhir. Pasien yang terluka parah akan dirujuk menggunakan ambulans posko, sedangkan siswa yang sehat menunggu konfirmasi penjemputan aman oleh orang tua.',
    },
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-2 font-pixel">
      {/* Top Banner */}
      <div className="w-full flex items-center justify-between px-2 pb-1.5 border-b border-slate-800">
        <span className="text-[13px] sm:text-[15px] font-pixel-title text-emerald-400 font-bold flex items-center gap-1.5">
          <PixelIcon name="shield" size={14} />
          MANAJEMEN TITIK KUMPUL &amp; INFORMASI RESMI
        </span>
        <span className="text-[13.5px] sm:text-[13px] text-slate-400 font-pixel font-semibold">
          STANDAR BNPB &amp; BMKG
        </span>
      </div>

      {/* SVG Canvas Area */}
      <div className="w-full flex-1 flex items-center justify-center p-2">
        <svg viewBox="0 0 540 220" className="w-full h-full object-contain" shapeRendering="crispEdges">
          {/* Background */}
          <rect x="0" y="0" width="540" height="220" fill="#0b0f19" />
          <rect x="0" y="0" width="540" height="170" fill="#0f172a" />
          <line x1="0" y1="170" x2="540" y2="170" stroke="#1e293b" strokeWidth="2" />
          <rect x="0" y="170" width="540" height="50" fill="#1e293b" />

          {/* 1. VISUAL LAPANGAN TERBUKA (ASSEMBLY POINT) */}
          {activeTab === 'lapangan' && (
            <g transform="translate(30, 20)">
              {/* Lapangan Hijau & Paving */}
              <rect x="15" y="70" width="220" height="85" rx="6" fill="#15803d" stroke="#16a34a" strokeWidth="2" />
              <rect x="25" y="80" width="200" height="65" fill="#166534" />

              {/* Rambu Hijau Titik Kumpul Resmi */}
              <rect x="110" y="15" width="40" height="40" rx="3" fill="#15803d" stroke="#ffffff" strokeWidth="2" />
              <rect x="127" y="55" width="6" height="35" fill="#64748b" />
              {/* Ikon 4 Panah ke Tengah */}
              <path d="M 116 21 L 123 27 M 144 21 L 137 27 M 116 49 L 123 43 M 144 49 L 137 43" stroke="#ffffff" strokeWidth="2" />
              <circle cx="130" cy="35" r="4" fill="#ffffff" />

              {/* Rerumputan & Siluet Murid Berkumpul Tertib di Lapangan */}
              <circle cx="65" cy="100" r="4" fill="#86efac" />
              <rect x="62" y="104" width="6" height="12" fill="#86efac" rx="1" />

              <circle cx="95" cy="98" r="4.5" fill="#86efac" />
              <rect x="91" y="103" width="8" height="14" fill="#86efac" rx="1" />

              <circle cx="125" cy="102" r="4" fill="#86efac" />
              <rect x="122" y="106" width="6" height="11" fill="#86efac" rx="1" />

              <circle cx="160" cy="99" r="4.5" fill="#86efac" />
              <rect x="156" y="104" width="8" height="13" fill="#86efac" rx="1" />
            </g>
          )}

          {/* 2. VISUAL PRESENSI & MEGAPHONE */}
          {activeTab === 'presensi' && (
            <g transform="translate(30, 20)">
              {/* Clipboard Papan Presensi */}
              <rect x="20" y="20" width="95" height="130" rx="6" fill="#78350f" stroke="#451a03" strokeWidth="2" />
              <rect x="52" y="12" width="30" height="15" rx="3" fill="#64748b" stroke="#94a3b8" strokeWidth="1" />
              <rect x="26" y="30" width="83" height="112" rx="2" fill="#f8fafc" />

              {/* Baris Nama Siswa & Centang Hijau */}
              <line x1="34" y1="45" x2="80" y2="45" stroke="#475569" strokeWidth="2" />
              <path d="M 90 44 L 94 48 L 102 38" stroke="#16a34a" strokeWidth="2" fill="none" />

              <line x1="34" y1="65" x2="80" y2="65" stroke="#475569" strokeWidth="2" />
              <path d="M 90 64 L 94 68 L 102 58" stroke="#16a34a" strokeWidth="2" fill="none" />

              <line x1="34" y1="85" x2="80" y2="85" stroke="#475569" strokeWidth="2" />
              <path d="M 90 84 L 94 88 L 102 78" stroke="#16a34a" strokeWidth="2" fill="none" />

              <line x1="34" y1="105" x2="80" y2="105" stroke="#475569" strokeWidth="2" />
              <path d="M 90 104 L 94 108 L 102 98" stroke="#16a34a" strokeWidth="2" fill="none" />

              {/* Megaphone TOA Komando */}
              <g transform="translate(130, 60)">
                <path d="M 20 20 L 70 5 L 70 55 L 20 40 Z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
                <rect x="5" y="24" width="16" height="12" rx="2" fill="#dc2626" />
                <path d="M 10 36 L 5 56 L 15 56 L 18 36 Z" fill="#334155" />
                <ellipse cx="70" cy="30" rx="6" ry="25" fill="#dc2626" />
                <text x="45" y="33" fill="#dc2626" fontSize="7" fontWeight="bold">TOA</text>
              </g>
            </g>
          )}

          {/* 3. VISUAL RADIO & MONITOR RESMI BMKG */}
          {activeTab === 'bmkg' && (
            <g transform="translate(30, 20)">
              {/* Monitor Seismik Digital BMKG */}
              <rect x="20" y="25" width="125" height="85" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
              <rect x="26" y="31" width="113" height="73" rx="3" fill="#0f172a" />
              {/* Gelombang Seismik Kuning */}
              <path d="M 32 68 L 55 68 L 60 45 L 66 90 L 72 50 L 78 78 L 84 65 L 130 68" stroke="#facc15" strokeWidth="2" fill="none" />
              <text x="32" y="42" fill="#38bdf8" fontSize="7" fontWeight="bold">BMKG: RESMI</text>
              <text x="32" y="98" fill="#4ade80" fontSize="6.5">STATUS: AMAN</text>

              {/* Radio Siaran Darurat Portabel */}
              <rect x="160" y="45" width="75" height="70" rx="5" fill="#334155" stroke="#475569" strokeWidth="2" />
              {/* Antena Radio */}
              <line x1="170" y1="45" x2="160" y2="15" stroke="#94a3b8" strokeWidth="2" />
              <circle cx="160" cy="15" r="3" fill="#ef4444" />
              {/* Speaker Grill */}
              <circle cx="185" cy="80" r="18" fill="#1e293b" />
              <line x1="172" y1="80" x2="198" y2="80" stroke="#475569" strokeWidth="1.5" />
              <line x1="175" y1="74" x2="195" y2="74" stroke="#475569" strokeWidth="1.5" />
              <line x1="175" y1="86" x2="195" y2="86" stroke="#475569" strokeWidth="1.5" />
              <rect x="210" y="65" width="18" height="10" fill="#facc15" />
            </g>
          )}

          {/* 4. VISUAL AMBULANS & JALUR EVAKUASI LANJUTAN */}
          {activeTab === 'evakuasi' && (
            <g transform="translate(30, 20)">
              {/* Mobil Ambulans Medis */}
              <rect x="20" y="55" width="116" height="65" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
              <rect x="136" y="75" width="28" height="45" rx="3" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />

              {/* Kaca Depan Kabin & Kaca Pasien Samping (Presisi Tanpa Menggantung di Udara) */}
              <rect x="100" y="60" width="30" height="18" rx="2" fill="#38bdf8" />
              <rect x="42" y="60" width="46" height="18" rx="2" fill="#38bdf8" />

              {/* Garis Oranye & Merah Tanggap Bencana */}
              <rect x="20" y="90" width="144" height="8" fill="#f97316" />
              <rect x="20" y="98" width="144" height="4" fill="#ef4444" />

              {/* Simbol Palang Biru Ambulans */}
              <rect x="62" y="68" width="6" height="18" fill="#0284c7" />
              <rect x="56" y="74" width="18" height="6" fill="#0284c7" />

              {/* Roda Ambulans */}
              <circle cx="50" cy="120" r="14" fill="#0f172a" />
              <circle cx="50" cy="120" r="5" fill="#94a3b8" />
              <circle cx="128" cy="120" r="14" fill="#0f172a" />
              <circle cx="128" cy="120" r="5" fill="#94a3b8" />

              {/* Lampu Sirine Strobo */}
              <rect x="88" y="47" width="14" height="8" rx="1" fill="#ef4444" />
              <rect x="102" y="47" width="14" height="8" rx="1" fill="#38bdf8" />

              {/* Panah Rambu Jalur Evakuasi Hijau */}
              <rect x="180" y="60" width="55" height="45" rx="4" fill="#15803d" stroke="#22c55e" strokeWidth="2" />
              <path d="M 190 82 L 210 82 L 210 75 L 225 82 L 210 90 L 210 82 Z" fill="#ffffff" />
              <text x="207" y="73" fill="#ffffff" fontSize="6" fontWeight="bold" textAnchor="middle">POSKO</text>
            </g>
          )}

          {/* Panel Deskripsi Kanan (HTML Responsif, Tidak Akan Terpotong / Over) */}
          <foreignObject x="260" y="10" width="270" height="200">
            <div className="w-full h-full bg-[#111827]/95 border-2 border-slate-700/80 rounded-xl p-3 flex flex-col justify-start overflow-y-auto shadow-md">
              <div className="flex items-center gap-1.5 mb-1.5 shrink-0">
                <span
                  className="px-2 py-0.5 rounded text-[13px] font-bold text-slate-950 uppercase tracking-wider shadow-sm"
                  style={{ backgroundColor: tabDetails[activeTab].color }}
                >
                  {tabDetails[activeTab].badge}
                </span>
              </div>
              <h3 className="text-[13px] sm:text-[15.5px] font-bold text-slate-100 leading-snug font-sans tracking-wide mb-2 shrink-0">
                {tabDetails[activeTab].title}
              </h3>
              <p className="text-[14.5px] sm:text-[15px] text-slate-200 leading-relaxed font-sans font-medium">
                {tabDetails[activeTab].desc}
              </p>
            </div>
          </foreignObject>
        </svg>
      </div>

      {/* Button Switcher Tabs */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
        <button
          onClick={() => setActiveTab('lapangan')}
          className={`px-2 py-2 rounded-lg border-2 text-[13px] sm:text-[14.5px] font-pixel-title cursor-pointer transition-all ${activeTab === 'lapangan'
            ? 'bg-emerald-500 text-slate-950 border-emerald-300 font-bold'
            : 'bg-slate-800 text-emerald-300 border-slate-700 hover:border-emerald-500'
            }`}
        >
          1. ZONA LAPANGAN
        </button>
        <button
          onClick={() => setActiveTab('presensi')}
          className={`px-2 py-2 rounded-lg border-2 text-[13px] sm:text-[14.5px] font-pixel-title cursor-pointer transition-all ${activeTab === 'presensi'
            ? 'bg-sky-500 text-slate-950 border-sky-300 font-bold'
            : 'bg-slate-800 text-sky-300 border-slate-700 hover:border-sky-500'
            }`}
        >
          2. PRESENSI KELAS
        </button>
        <button
          onClick={() => setActiveTab('bmkg')}
          className={`px-2 py-2 rounded-lg border-2 text-[13px] sm:text-[14.5px] font-pixel-title cursor-pointer transition-all ${activeTab === 'bmkg'
            ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold'
            : 'bg-slate-800 text-amber-300 border-slate-700 hover:border-amber-400'
            }`}
        >
          3. INFO BMKG RESMI
        </button>
        <button
          onClick={() => setActiveTab('evakuasi')}
          className={`px-2 py-2 rounded-lg border-2 text-[13px] sm:text-[14.5px] font-pixel-title cursor-pointer transition-all ${activeTab === 'evakuasi'
            ? 'bg-pink-500 text-slate-950 border-pink-300 font-bold'
            : 'bg-slate-800 text-pink-300 border-slate-700 hover:border-pink-500'
            }`}
        >
          4. AMBULANS TRANSIT
        </button>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN 15: PASCABENCANA ERUPSI — PENANGANAN ABU VULKANIK & ATAP (BNPB)
// ═════════════════════════════════════════════════════════════════════════════
function VolcanoPostAshIllustration() {
  const [activeTab, setActiveTab] = useState<'atap' | 'kendaraan' | 'apd'>('atap');

  const tabDetails = {
    atap: {
      title: 'PEMBERSIHAN TIMBUNAN ABU DI ATAP RUMAH',
      badge: 'STANDAR BNPB — CEGAH ATAP AMBRUK',
      color: '#ea580c',
      desc: 'Buku Saku BNPB menegaskan: Bersihkan atap rumah dari timbunan debu vulkanik tebal secara gotong royong! Endapan abu basah memiliki massa jenis sangat tinggi (>1.500 kg/m³), sehingga beratnya berisiko merobohkan kuda-kuda dan merusak atap bangunan.',
    },
    kendaraan: {
      title: 'LARANGAN BERKENDARA DI JALANAN BERABU',
      badge: 'KESELAMATAN JALAN & MESIN',
      color: '#eab308',
      desc: 'Hindari mengendarai motor atau mobil di kawasan hujan abu vulkanik. Abu bersifat abrasif tajam yang membuat ban kehilangan cengkeraman (sangat licin), serta butiran silika debu akan tersedot menyumbat saringan udara dan merusak piston mesin.',
    },
    apd: {
      title: 'PAKAIAN TERTUTUP & ALAT PELINDUNG DIRI (APD)',
      badge: 'PROTEKSI KULIT & TUBUH',
      color: '#10b981',
      desc: 'Saat membersihkan abu di sekitar pekarangan, selalu kenakan baju lengan panjang, celana panjang, topi pelindung, sarung tangan, dan masker. Hal ini penting guna mencegah iritasi kulit akibat zat asam belerang dan partikel mikro tajam.',
    },
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-2 font-pixel">
      {/* Top Banner */}
      <div className="w-full flex items-center justify-between px-2 pb-1.5 border-b border-slate-800">
        <span className="text-[13px] sm:text-[15px] font-pixel-title text-amber-400 font-bold flex items-center gap-1.5">
          <PixelIcon name="shield" size={14} />
          PENANGANAN ABU VULKANIK &amp; PERLINDUNGAN ATAP
        </span>
        <span className="text-[13.5px] sm:text-[13px] text-slate-400 font-pixel font-semibold">
          STANDAR RESMI BNPB
        </span>
      </div>

      {/* SVG Canvas Area */}
      <div className="w-full flex-1 flex items-center justify-center p-2">
        <svg viewBox="0 0 540 220" className="w-full h-full object-contain" shapeRendering="crispEdges">
          <rect x="0" y="0" width="540" height="220" fill="#0b0f19" />
          <rect x="0" y="0" width="540" height="170" fill="#0f172a" />
          <line x1="0" y1="170" x2="540" y2="170" stroke="#1e293b" strokeWidth="2" />
          <rect x="0" y="170" width="540" height="50" fill="#1e293b" />

          {/* TAB 1: PEMBERSIHAN ATAP RUMAH */}
          {activeTab === 'atap' && (
            <g transform="translate(20, 15)">
              {/* Dinding Rumah Warga */}
              <rect x="60" y="85" width="160" height="85" fill="#f8fafc" stroke="#334155" strokeWidth="2" />
              <rect x="120" y="115" width="35" height="55" fill="#78350f" />
              <rect x="80" y="105" width="25" height="25" fill="#38bdf8" stroke="#1e293b" strokeWidth="1.5" />
              <rect x="175" y="105" width="25" height="25" fill="#38bdf8" stroke="#1e293b" strokeWidth="1.5" />
              {/* Atap Genteng Segitiga */}
              <polygon points="40,85 140,25 240,85" fill="#b91c1c" stroke="#451a03" strokeWidth="2" />
              {/* Lapisan Endapan Abu Vulkanik Tebal di Atap */}
              <polygon points="42,83 140,27 238,83 234,74 140,19 46,74" fill="#64748b" />
              <rect x="65" y="48" width="150" height="8" fill="#475569" rx="2" />

              {/* Tangga Bambu & Warga Membersihkan Abu */}
              <line x1="225" y1="170" x2="195" y2="55" stroke="#d97706" strokeWidth="3" />
              <line x1="233" y1="170" x2="203" y2="55" stroke="#d97706" strokeWidth="3" />
              {[70, 90, 110, 130, 150].map((stepY) => (
                <line key={stepY} x1={225 - (170 - stepY) * 0.25} y1={stepY} x2={233 - (170 - stepY) * 0.25} y2={stepY} stroke="#b45309" strokeWidth="2" />
              ))}
              {/* Figur Relawan di Tangga */}
              <circle cx="198" cy="45" r="7" fill="#fed7aa" />
              <rect x="194" y="38" width="8" height="4" fill="#facc15" />
              <rect x="194" y="52" width="9" height="18" fill="#ea580c" />
              <line x1="185" y1="48" x2="160" y2="35" stroke="#94a3b8" strokeWidth="2" />
              <rect x="154" y="30" width="8" height="10" fill="#475569" transform="rotate(-20 158 35)" />

              {/* Panel Indikator Tekanan Beban Abu */}
              <g transform="translate(270, 20)">
                <rect x="0" y="0" width="220" height="140" rx="8" fill="#0f172a" stroke="#ea580c" strokeWidth="2" />
                <rect x="10" y="10" width="200" height="24" rx="4" fill="#c2410c" />
                <text x="110" y="26" fill="#fef08a" fontSize="10" fontWeight="bold" textAnchor="middle">
                  BEBAN ATAP BERAT
                </text>
                <text x="15" y="55" fill="#f8fafc" fontSize="9">
                  • Abu Kering : ~1.000 kg/m³
                </text>
                <text x="15" y="73" fill="#f87171" fontSize="9" fontWeight="bold">
                  • Abu Basah Hujan : &gt;1.500 kg/m³!
                </text>
                <rect x="15" y="85" width="190" height="18" fill="#450a0a" stroke="#dc2626" strokeWidth="1" rx="3" />
                <text x="110" y="97" fill="#fca5a5" fontSize="8" fontWeight="bold" textAnchor="middle">
                  RESIKO STRUKTUR ATAP ROBOH!
                </text>
                <text x="15" y="122" fill="#38bdf8" fontSize="8.5">
                  Gotong royong pakai tangga kokoh
                </text>
              </g>
            </g>
          )}

          {/* TAB 2: LARANGAN BERKENDARA DI JALANAN BERABU */}
          {activeTab === 'kendaraan' && (
            <g transform="translate(20, 15)">
              <rect x="20" y="80" width="240" height="90" fill="#334155" />
              <rect x="20" y="80" width="240" height="12" fill="#64748b" />
              <line x1="20" y1="125" x2="260" y2="125" stroke="#facc15" strokeWidth="2" />

              <circle cx="100" cy="50" r="22" fill="#ffffff" stroke="#dc2626" strokeWidth="5" />
              <line x1="84" y1="36" x2="116" y2="64" stroke="#dc2626" strokeWidth="4" />
              <text x="100" y="55" fill="#0f172a" fontSize="12" fontWeight="bold" textAnchor="middle">
                NGEBUT
              </text>

              <g transform="translate(140, 95)">
                <circle cx="20" cy="40" r="14" fill="#0f172a" stroke="#64748b" strokeWidth="3" />
                <circle cx="70" cy="40" r="14" fill="#0f172a" stroke="#64748b" strokeWidth="3" />
                <path d="M 18 35 L 35 15 L 55 18 L 70 38" stroke="#ef4444" strokeWidth="6" fill="none" />
                <rect x="35" y="8" width="12" height="10" fill="#0284c7" />
                <circle cx="10" cy="42" r="6" fill="#94a3b8" opacity="0.6" />
                <circle cx="0" cy="38" r="8" fill="#94a3b8" opacity="0.4" />
                <text x="45" y="-5" fill="#f87171" fontSize="9" fontWeight="bold">
                  LICIN &amp; MERUSAK MESIN!
                </text>
              </g>

              <g transform="translate(280, 20)">
                <rect x="0" y="0" width="220" height="140" rx="8" fill="#0f172a" stroke="#eab308" strokeWidth="2" />
                <rect x="10" y="10" width="200" height="24" rx="4" fill="#a16207" />
                <text x="110" y="26" fill="#fef08a" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                  KERUSAKAN KENDARAAN
                </text>
                <text x="15" y="55" fill="#f8fafc" fontSize="8.5">
                  1. <tspan fill="#facc15" fontWeight="bold">Traksi Ban Nol</tspan>: Sangat licin
                </text>
                <text x="15" y="73" fill="#f8fafc" fontSize="8.5">
                  2. <tspan fill="#facc15" fontWeight="bold">Penyumbatan Udara</tspan>: Filter mampet
                </text>
                <text x="15" y="91" fill="#f8fafc" fontSize="8.5">
                  3. <tspan fill="#f87171" fontWeight="bold">Baret Silinder</tspan>: Piston rusak berat
                </text>
                <rect x="15" y="104" width="190" height="24" fill="#1e293b" rx="4" />
                <text x="110" y="119" fill="#38bdf8" fontSize="8" textAnchor="middle">
                  BNPB: Hindari berkendara di zona abu!
                </text>
              </g>
            </g>
          )}

          {/* TAB 3: ALAT PELINDUNG DIRI (APD) */}
          {activeTab === 'apd' && (
            <g transform="translate(25, 20)">
              <g transform="translate(20, 10)">
                <rect x="0" y="0" width="200" height="130" rx="8" fill="#1e293b" stroke="#10b981" strokeWidth="2" />
                <text x="100" y="22" fill="#34d399" fontSize="10" fontWeight="bold" textAnchor="middle">
                  APD WAJIB BERSIH ABU
                </text>
                <rect x="15" y="35" width="24" height="16" rx="3" fill="#f8fafc" stroke="#94a3b8" />
                <text x="48" y="47" fill="#f8fafc" fontSize="8.5">
                  Masker N95 / Dobel Medis
                </text>
                <rect x="15" y="60" width="12" height="10" rx="2" fill="#38bdf8" />
                <rect x="29" y="60" width="12" height="10" rx="2" fill="#38bdf8" />
                <line x1="26" y1="65" x2="30" y2="65" stroke="#ffffff" strokeWidth="1" />
                <text x="48" y="68" fill="#f8fafc" fontSize="8.5">
                  Kacamata Goggle Tertutup
                </text>
                <rect x="18" y="82" width="18" height="18" fill="#0284c7" rx="2" />
                <text x="48" y="93" fill="#f8fafc" fontSize="8.5">
                  Baju Lengan Panjang &amp; Celana
                </text>
                <rect x="18" y="105" width="18" height="14" fill="#f59e0b" rx="2" />
                <text x="48" y="115" fill="#f8fafc" fontSize="8.5">
                  Sarung Tangan Karet / Kain
                </text>
              </g>

              <g transform="translate(250, 10)">
                <rect x="0" y="0" width="230" height="130" rx="8" fill="#0f172a" stroke="#059669" strokeWidth="2" />
                <rect x="10" y="10" width="210" height="24" rx="4" fill="#065f46" />
                <text x="115" y="26" fill="#a7f3d0" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                  TUJUAN PROTEKSI KESEHATAN
                </text>
                <text x="15" y="55" fill="#f8fafc" fontSize="8.5">
                  • Paru-Paru bebas silika (Cegah ISPA)
                </text>
                <text x="15" y="75" fill="#f8fafc" fontSize="8.5">
                  • Kornea mata terlindung goresan debu
                </text>
                <text x="15" y="95" fill="#f8fafc" fontSize="8.5">
                  • Kulit terhindar dari iritasi asam belerang
                </text>
                <text x="15" y="115" fill="#facc15" fontSize="8.5" fontWeight="bold">
                  Standar Kebersihan Pascabencana BNPB
                </text>
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* Description Box below Canvas */}
      <div className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl p-2.5 mb-2 shadow-inner">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="px-2 py-0.5 rounded text-[12.5px] font-pixel-title text-slate-950 font-bold"
            style={{ backgroundColor: tabDetails[activeTab].color }}
          >
            {tabDetails[activeTab].badge}
          </span>
          <h4 className="text-[13px] sm:text-[15px] font-pixel-title text-amber-300 font-bold">
            {tabDetails[activeTab].title}
          </h4>
        </div>
        <p className="font-sans text-[13px] sm:text-[15px] text-slate-200 leading-relaxed font-medium">
          {tabDetails[activeTab].desc}
        </p>
      </div>

      {/* Tab Switcher Buttons */}
      <div className="w-full grid grid-cols-3 gap-2">
        <button
          onClick={() => setActiveTab('atap')}
          className={`px-2 py-2 rounded-lg border-2 text-[13px] sm:text-[14.5px] font-pixel-title cursor-pointer transition-all ${activeTab === 'atap'
            ? 'bg-orange-500 text-slate-950 border-orange-300 font-bold'
            : 'bg-slate-800 text-orange-300 border-slate-700 hover:border-orange-500'
            }`}
        >
          1. BERSIH ATAP RUMAH
        </button>
        <button
          onClick={() => setActiveTab('kendaraan')}
          className={`px-2 py-2 rounded-lg border-2 text-[13px] sm:text-[14.5px] font-pixel-title cursor-pointer transition-all ${activeTab === 'kendaraan'
            ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold'
            : 'bg-slate-800 text-amber-300 border-slate-700 hover:border-amber-400'
            }`}
        >
          2. LARANGAN BERKENDARA
        </button>
        <button
          onClick={() => setActiveTab('apd')}
          className={`px-2 py-2 rounded-lg border-2 text-[13px] sm:text-[14.5px] font-pixel-title cursor-pointer transition-all ${activeTab === 'apd'
            ? 'bg-emerald-500 text-slate-950 border-emerald-300 font-bold'
            : 'bg-slate-800 text-emerald-300 border-slate-700 hover:border-emerald-500'
            }`}
        >
          3. APD BERSIH ABU
        </button>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN 16: PASCABENCANA ERUPSI — KESEHATAN, SANITASI & AIR BERSIH (PMI)
// ═════════════════════════════════════════════════════════════════════════════
function VolcanoPostSanitationIllustration() {
  const [activeTab, setActiveTab] = useState<'air' | 'silika' | 'mata'>('air');

  const tabDetails = {
    air: {
      title: 'TANDON AIR BERSIH TERTUTUP RAPAT',
      badge: 'SANITASI AIR MINUM',
      color: '#0284c7',
      desc: 'Hujan abu vulkanik mengandung asam kuat dan senyawa belerang. Jika tandon penampungan air minum terbuka, air akan terkontaminasi zat beracun dan memicu keracunan pencernaan akut. Pastikan toren dan sumur selalu ditutup rapat!',
    },
    silika: {
      title: 'BAHAYA KRISTAL SILIKA MIKROSKOPIS BAGI PARU-PARU',
      badge: 'BAHAYA PERNAPASAN & ISPA',
      color: '#ef4444',
      desc: 'Abu vulkanik bukanlah debu tanah halus biasa, melainkan serpihan kaca silika tajam (SiO2). Jika terhirup ke dalam paru-paru, kristal ini merobek dinding alveolus dan memicu batuk berdarah hingga ISPA akut. Selalu gunakan masker penyaring N95!',
    },
    mata: {
      title: 'CUCI MATA DENGAN AIR MENGALIR (JANGAN DIKUCEK)',
      badge: 'PERTOLONGAN PERTAMA MATA',
      color: '#f59e0b',
      desc: 'Saat mata kemasukan debu abu vulkanik, JANGAN PERNAH DIKUCEK! Mengucek mata akan membuat kristal kaca silika menggores dan merusak kornea secara permanen. Segera bilas menggunakan air bersih mengalir atau cairan steril pencuci mata.',
    },
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-2 font-pixel">
      <div className="w-full flex items-center justify-between px-2 pb-1.5 border-b border-slate-800">
        <span className="text-[13px] sm:text-[15px] font-pixel-title text-sky-400 font-bold flex items-center gap-1.5">
          <PixelIcon name="heart" size={14} />
          SANITASI AIR BERSIH &amp; KESEHATAN PASCABENCANA
        </span>
        <span className="text-[13.5px] sm:text-[13px] text-slate-400 font-pixel font-semibold">
          STANDAR MEDIS PMI &amp; BNPB
        </span>
      </div>

      <div className="w-full flex-1 flex items-center justify-center p-2">
        <svg viewBox="0 0 540 220" className="w-full h-full object-contain" shapeRendering="crispEdges">
          <rect x="0" y="0" width="540" height="220" fill="#0b0f19" />
          <rect x="0" y="0" width="540" height="170" fill="#0f172a" />
          <line x1="0" y1="170" x2="540" y2="170" stroke="#1e293b" strokeWidth="2" />
          <rect x="0" y="170" width="540" height="50" fill="#1e293b" />

          {/* TAB 1: TANDON AIR BERSIH TERTUTUP */}
          {activeTab === 'air' && (
            <g transform="translate(30, 20)">
              {/* Tandon Stainless Besar */}
              <rect x="40" y="30" width="120" height="110" rx="8" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="3" />
              <rect x="45" y="45" width="110" height="12" fill="#cbd5e1" />
              <rect x="45" y="85" width="110" height="12" fill="#cbd5e1" />
              {/* Tutup Tandon Rapat Bersegel Gembok */}
              <ellipse cx="100" cy="30" rx="55" ry="12" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
              <rect x="90" y="14" width="20" height="12" rx="3" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
              {/* Keran Air Bersih di Bawah */}
              <rect x="160" y="110" width="18" height="8" fill="#64748b" />
              <rect x="172" y="118" width="6" height="14" fill="#0284c7" />
              {/* Air Mengalir Bersih */}
              <path d="M 175 132 Q 175 155 175 165" stroke="#38bdf8" strokeWidth="3" fill="none" />

              {/* Label Status Tandon */}
              <rect x="25" y="145" width="150" height="20" rx="4" fill="#065f46" stroke="#10b981" strokeWidth="1.5" />
              <text x="100" y="159" fill="#a7f3d0" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                AIR BERSIH TERTUTUP AMAN
              </text>

              {/* Panel Bahaya Kontaminasi Asam & Belerang */}
              <g transform="translate(230, 10)">
                <rect x="0" y="0" width="240" height="135" rx="8" fill="#0f172a" stroke="#0284c7" strokeWidth="2" />
                <rect x="10" y="10" width="220" height="24" rx="4" fill="#075985" />
                <text x="120" y="26" fill="#e0f2fe" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                  KONTAMINASI AIR TERBUKA
                </text>
                <text x="15" y="55" fill="#f87171" fontSize="8.5" fontWeight="bold">
                  Sumur / Tandon Terbuka:
                </text>
                <text x="25" y="70" fill="#f8fafc" fontSize="8">
                  • Mengandung asam belerang (pH turun drastis)
                </text>
                <text x="25" y="85" fill="#f8fafc" fontSize="8">
                  • Keracunan logam berat vulkanik &amp; diare
                </text>
                <text x="15" y="105" fill="#34d399" fontSize="8.5" fontWeight="bold">
                  Tandon Tertutup di Barak BPBD:
                </text>
                <text x="25" y="120" fill="#a7f3d0" fontSize="8">
                  • 100% Higienis &amp; aman dikonsumsi pengungsi
                </text>
              </g>
            </g>
          )}

          {/* TAB 2: BAHAYA SILIKA MIKROSKOPIS */}
          {activeTab === 'silika' && (
            <g transform="translate(30, 15)">
              {/* Lensa Kaca Pembesar Memperbesar Kristal Silika */}
              <circle cx="100" cy="80" r="60" fill="#020617" stroke="#38bdf8" strokeWidth="4" />
              <line x1="145" y1="125" x2="185" y2="165" stroke="#64748b" strokeWidth="10" strokeLinecap="round" />

              {/* Kristal Silika Runcing Tajam (SiO2) di Dalam Lensa */}
              <polygon points="75,60 95,40 105,65 85,80" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1.5" />
              <polygon points="105,75 130,55 140,85 115,95" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.5" />
              <polygon points="65,95 85,85 95,110 70,120" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
              <polygon points="105,100 125,95 130,125 110,120" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
              <text x="100" y="152" fill="#ef4444" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                KRISTAL KACA TAJAM (SiO2)
              </text>

              {/* Panel Penjelasan Paru-Paru & ISPA */}
              <g transform="translate(240, 10)">
                <rect x="0" y="0" width="230" height="135" rx="8" fill="#0f172a" stroke="#ef4444" strokeWidth="2" />
                <rect x="10" y="10" width="210" height="24" rx="4" fill="#991b1b" />
                <text x="115" y="26" fill="#fecaca" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                  KERUSAKAN ALVEOLUS PARU
                </text>
                <text x="15" y="55" fill="#f8fafc" fontSize="8.5">
                  1. Ukuran partikel abu: &lt; 2 mikrometer
                </text>
                <text x="15" y="73" fill="#f8fafc" fontSize="8.5">
                  2. Menembus langsung ke kantung alveolus
                </text>
                <text x="15" y="91" fill="#fca5a5" fontSize="8.5" fontWeight="bold">
                  3. Mengakibatkan ISPA akut &amp; batuk darah
                </text>
                <rect x="15" y="104" width="200" height="22" fill="#1e293b" rx="4" />
                <text x="115" y="119" fill="#facc15" fontSize="8" fontWeight="bold" textAnchor="middle">
                  SOLUSI: MASKER N95 (95% FILTER ABU)
                </text>
              </g>
            </g>
          )}

          {/* TAB 3: CUCI MATA DENGAN AIR MENGALIR */}
          {activeTab === 'mata' && (
            <g transform="translate(30, 20)">
              {/* Wastafel Cuci Mata PMI & Aliran Air Bersih */}
              <rect x="40" y="80" width="120" height="60" rx="6" fill="#334155" stroke="#64748b" strokeWidth="2" />
              <rect x="80" y="40" width="40" height="40" fill="#f8fafc" rx="4" />
              {/* Dua Corong Eyewash Menyemprotkan Air ke Atas */}
              <rect x="90" y="60" width="8" height="20" fill="#0284c7" />
              <rect x="102" y="60" width="8" height="20" fill="#0284c7" />
              <path d="M 94 60 Q 94 35 94 25" stroke="#38bdf8" strokeWidth="3" fill="none" />
              <path d="M 106 60 Q 106 35 106 25" stroke="#38bdf8" strokeWidth="3" fill="none" />

              <rect x="30" y="150" width="140" height="20" rx="4" fill="#15803d" stroke="#22c55e" strokeWidth="1" />
              <text x="100" y="164" fill="#bbf7d0" fontSize="8" fontWeight="bold" textAnchor="middle">
                BILAS AIR MENGALIR
              </text>

              {/* Larangan Mengucek Mata */}
              <g transform="translate(230, 10)">
                <rect x="0" y="0" width="240" height="135" rx="8" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
                <rect x="10" y="10" width="220" height="24" rx="4" fill="#b45309" />
                <text x="120" y="26" fill="#fef3c7" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                  LARANGAN MENGUCEK MATA
                </text>
                <text x="15" y="55" fill="#f87171" fontSize="8.5" fontWeight="bold">
                  DILARANG MENGUCEK MATA!
                </text>
                <text x="25" y="70" fill="#f8fafc" fontSize="8">
                  • Mengucek = menggosok pecahan kaca ke kornea
                </text>
                <text x="25" y="85" fill="#f8fafc" fontSize="8">
                  • Mengakibatkan luka gores &amp; infeksi kebutaan
                </text>
                <text x="15" y="105" fill="#38bdf8" fontSize="8.5" fontWeight="bold">
                  Tindakan Benar Menurut Dokter:
                </text>
                <text x="25" y="120" fill="#e0f2fe" fontSize="8">
                  • Guyur perlahan dengan air bersih mengalir
                </text>
              </g>
            </g>
          )}
        </svg>
      </div>

      <div className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl p-2.5 mb-2 shadow-inner">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="px-2 py-0.5 rounded text-[12.5px] font-pixel-title text-slate-950 font-bold"
            style={{ backgroundColor: tabDetails[activeTab].color }}
          >
            {tabDetails[activeTab].badge}
          </span>
          <h4 className="text-[13px] sm:text-[15px] font-pixel-title text-amber-300 font-bold">
            {tabDetails[activeTab].title}
          </h4>
        </div>
        <p className="font-sans text-[13px] sm:text-[15px] text-slate-200 leading-relaxed font-medium">
          {tabDetails[activeTab].desc}
        </p>
      </div>

      <div className="w-full grid grid-cols-3 gap-2">
        <button
          onClick={() => setActiveTab('air')}
          className={`px-2 py-2 rounded-lg border-2 text-[13px] sm:text-[14.5px] font-pixel-title cursor-pointer transition-all ${activeTab === 'air'
            ? 'bg-sky-500 text-slate-950 border-sky-300 font-bold'
            : 'bg-slate-800 text-sky-300 border-slate-700 hover:border-sky-500'
            }`}
        >
          1. AIR TERTUTUP
        </button>
        <button
          onClick={() => setActiveTab('silika')}
          className={`px-2 py-2 rounded-lg border-2 text-[13px] sm:text-[14.5px] font-pixel-title cursor-pointer transition-all ${activeTab === 'silika'
            ? 'bg-rose-500 text-slate-950 border-rose-300 font-bold'
            : 'bg-slate-800 text-rose-300 border-slate-700 hover:border-rose-500'
            }`}
        >
          2. BAHAYA SILIKA
        </button>
        <button
          onClick={() => setActiveTab('mata')}
          className={`px-2 py-2 rounded-lg border-2 text-[13px] sm:text-[14.5px] font-pixel-title cursor-pointer transition-all ${activeTab === 'mata'
            ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold'
            : 'bg-slate-800 text-amber-300 border-slate-700 hover:border-amber-400'
            }`}
        >
          3. CUCI MATA AIR
        </button>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN 17: PASCABENCANA ERUPSI — BAHAYA SEKUNDER LAHAR DINGIN & EWS
// ═════════════════════════════════════════════════════════════════════════════
function VolcanoPostLaharIllustration() {
  const [activeTab, setActiveTab] = useState<'lahar' | 'sungai' | 'ews'>('lahar');

  const tabDetails = {
    lahar: {
      title: 'MEKANISME & UNSUR PEMBENTUK BANJIR LAHAR DINGIN',
      badge: 'BAHAYA SEKUNDER PASCA-ERUPSI',
      color: '#059669',
      desc: 'Banjir lahar dingin (lahar hujan) adalah aliran suspensi pekat antara air hujan berintensitas tinggi dengan jutaan meter kubik material vulkanik lepas (pasir, kerikil, dan bongkahan batu andesit) yang menumpuk di kawah puncak Merapi. Slurry pekat ini meluncur dengan kecepatan 40–60 km/jam menerjang lembah sungai dengan daya hancur hidrolik masif.',
      keyTakeaway: 'Kekuatan lahar dingin bukan sekadar air banjir, melainkan "bubur beton cair alami" bermassa jenis 1,8–2,2 ton/m³ yang mampu menggerus tanggul dan menghancurkan jembatan seketika.',
    },
    sungai: {
      title: 'ZONA BAHAYA BANTARAN SUNGAI & FUNGSI SABO DAM',
      badge: 'ZONASI KRB I — RADIUS AMAN SUNGAI',
      color: '#dc2626',
      desc: 'BNPB & PVMBG menetapkan sempadan sungai berhulu di Merapi (Kali Boyong, Kali Krasak, Kali Gendol, Kali Woro) sebagai Zona Merah lahar. Bangunan Sabo Dam Kementerian PUPR berfungsi menahan laju jutaan kubik batu dan pasir besar di hulu, sementara air lumpur disaring perlahan agar tidak meluap ke permukiman.',
      keyTakeaway: 'DILARANG KERAS menonton lahar di atas jembatan atau berada di bantaran sungai saat mendung di hulu! Segera evakuasi tegak lurus ke dataran tinggi minimal 500 meter dari bibir sungai.',
    },
    ews: {
      title: 'JARINGAN TELEMETRI SISTEM PERINGATAN DINI (EWS LAHAR)',
      badge: 'TEKNOLOGI MITIGASI TELEMETRI REAL-TIME',
      color: '#2563eb',
      desc: 'Mitigasi bahaya sekunder lahar didukung jejaring telemetri terpadu: Stasiun Penakar Hujan Otomatis (ARR) di puncak, Sensor Seismik Getaran Aliran di hulu jurang sungai, serta Menara Sirine EWS bertenaga surya di pemukiman warga yang berbunyi kencang (>110 dB) untuk evakuasi mandiri.',
      keyTakeaway: 'Ketika sirine EWS meraung atau terdeteksi hujan lebat di puncak, warga memiliki waktu tanggap darurat (Golden Time) sekitar 10–20 menit untuk menyelamatkan diri ke tempat tinggi.',
    },
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-2 sm:p-2.5 font-sans">
      {/* Top Header Bar */}
      <div className="w-full flex items-center justify-between px-2 pb-2 border-b border-slate-700/80">
        <span className="text-[13px] sm:text-[15px] font-black text-emerald-400 flex items-center gap-2 tracking-wide font-sans">
          <PixelIcon name="mountain" size={16} />
          BAHAYA SEKUNDER ERUPSI: BANJIR LAHAR DINGIN
        </span>
        <span className="text-[14px] sm:text-[13px] text-amber-300/90 font-bold bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/30">
          MONITORING BNPB, PVMBG &amp; BALAI SABO PUPR
        </span>
      </div>

      {/* Center Interactive SVG Canvas */}
      <div className="w-full flex-1 flex items-center justify-center p-1.5 my-1">
        <svg viewBox="0 0 540 225" className="w-full h-full object-contain rounded-xl overflow-hidden shadow-2xl border border-slate-700/60">
          {/* DEFINITIONS & GRADIENTS */}
          <defs>
            {/* Langit Badai Malam Gelap */}
            <linearGradient id="stormSkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#050811" />
              <stop offset="60%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            {/* Profil Lereng Gunung Merapi */}
            <linearGradient id="merapiSlopeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="35%" stopColor="#475569" />
              <stop offset="70%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            {/* Endapan Tefra & Abu Kawah di Puncak */}
            <linearGradient id="ashCraterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#78350f" />
              <stop offset="100%" stopColor="#92400e" />
            </linearGradient>

            {/* Aliran Bubur Lahar Dingin (Debris Slurry Flow) */}
            <linearGradient id="laharMudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#451a03" />
              <stop offset="40%" stopColor="#78350f" />
              <stop offset="75%" stopColor="#92400e" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>

            {/* Sabo Dam Beton Bertulang */}
            <linearGradient id="saboConcreteGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="40%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>

            {/* Batu Andesit 3D */}
            <radialGradient id="andesiteGrad1" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="60%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0f172a" />
            </radialGradient>

            <radialGradient id="andesiteGrad2" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#78716c" />
              <stop offset="60%" stopColor="#44403c" />
              <stop offset="100%" stopColor="#1c1917" />
            </radialGradient>

            {/* Awan Kumulonimbus Badai */}
            <linearGradient id="cumulonimbusGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="50%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            {/* Kilauan / Glow Filter */}
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* BACKGROUND DASAR */}
          <rect x="0" y="0" width="540" height="225" fill="url(#stormSkyGrad)" />

          {/* Bintang / Ambient Vulkanik Redup di Langit */}
          <circle cx="45" cy="22" r="1" fill="#94a3b8" opacity="0.6" />
          <circle cx="115" cy="18" r="1.5" fill="#fde047" opacity="0.4" />
          <circle cx="210" cy="12" r="1.2" fill="#cbd5e1" opacity="0.5" />
          <circle cx="270" cy="20" r="1" fill="#94a3b8" opacity="0.4" />

          {/* Dasar Dataran Rendah */}
          <rect x="0" y="172" width="540" height="53" fill="#14532d" />
          <rect x="0" y="172" width="540" height="3" fill="#22c55e" opacity="0.4" />
          <rect x="0" y="185" width="540" height="40" fill="#0f172a" opacity="0.4" />

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* TAB 1: MEKANISME BANJIR LAHAR DINGIN & SABO DAM                   */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'lahar' && (
            <g>
              {/* Sisi Kiri: Foto Nyata Banjir Lahar Dingin Merapi (Alur Sungai Kali Gendol/Woro) */}
              <g transform="translate(12, 10)">
                <clipPath id="laharPostPhotoClip">
                  <rect x="0" y="0" width="214" height="205" rx="10" />
                </clipPath>
                <rect x="0" y="0" width="214" height="205" rx="10" fill="#0f172a" stroke="#059669" strokeWidth="1.8" />
                <image
                  href="/lahar_dingin.jpg"
                  x="0"
                  y="0"
                  width="214"
                  height="205"
                  preserveAspectRatio="xMidYMid slice"
                  clipPath="url(#laharPostPhotoClip)"
                />
                <rect x="0" y="0" width="214" height="205" rx="10" fill="none" stroke="#059669" strokeWidth="1.8" />

                {/* Badge Keterangan Foto di Bawah */}
                <g transform="translate(8, 146)">
                  <rect x="0" y="0" width="198" height="52" rx="6" fill="#0f172a" fillOpacity="0.94" stroke="#34d399" strokeWidth="1.2" />
                  <text x="99" y="13" fill="#a7f3d0" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                    BANJIR LAHAR DINGIN MERAPI
                  </text>
                  <text x="99" y="24" fill="#f1f5f9" fontSize="6.8" textAnchor="middle" fontFamily="sans-serif">
                    Aliran Debris Lumpur &amp; Batu Andesit
                  </text>
                  <text x="99" y="33" fill="#38bdf8" fontSize="6.2" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                    Kecepatan Arus: 40 — 60 km/jam
                  </text>
                  <a href="https://news.detik.com/berita/d-7301571/4-fakta-banjir-lahar-dingin-semeru-yang-tewaskan-3-orang" target="_blank" rel="noopener noreferrer">
                    <text x="99" y="44" fill="#fbbf24" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif" textDecoration="underline" cursor="pointer">
                      Sumber: Detikcom ↗
                    </text>
                  </a>
                </g>
              </g>

              {/* SISI KANAN: PANEL EDUKASI MODERN UNSUR LAHAR */}
              <g transform="translate(236, 10)">
                {/* Background Card Kaca */}
                <rect x="0" y="0" width="294" height="205" rx="10" fill="#0f172a" fillOpacity="0.94" stroke="#059669" strokeWidth="1.8" />
                <rect x="1" y="1" width="292" height="32" rx="9" fill="#064e3b" />

                <text x="147" y="21" fill="#ecfdf5" fontSize="10.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
                  UNSUR &amp; PROSES TERJADINYA LAHAR
                </text>

                {/* Point 1: Hujan Deras */}
                <g transform="translate(10, 40)">
                  <rect x="0" y="0" width="274" height="36" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                  <rect x="6" y="6" width="24" height="24" rx="4" fill="#0284c7" />
                  {/* Ikon 2D Pixel: Hujan Ekstrem */}
                  <g transform="translate(11, 10)">
                    <rect x="3" y="1" width="8" height="2" fill="#cbd5e1" />
                    <rect x="1" y="3" width="12" height="4" fill="#94a3b8" />
                    <rect x="2" y="8" width="1.5" height="4" fill="#38bdf8" />
                    <rect x="6" y="9" width="1.5" height="4" fill="#38bdf8" />
                    <rect x="10" y="8" width="1.5" height="4" fill="#38bdf8" />
                  </g>
                  <text x="36" y="16" fill="#38bdf8" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                    1. Hujan Ekstrem di Hulu (&gt;50 mm/jam)
                  </text>
                  <text x="36" y="28" fill="#cbd5e1" fontSize="7.8" fontFamily="sans-serif">
                    Memicu likuifaksi &amp; menggerus timbunan material di lereng.
                  </text>
                </g>

                {/* Point 2: Jutaan m3 Endapan */}
                <g transform="translate(10, 81)">
                  <rect x="0" y="0" width="274" height="36" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                  <rect x="6" y="6" width="24" height="24" rx="4" fill="#d97706" />
                  {/* Ikon 2D Pixel: Gunung Vulkanik */}
                  <g transform="translate(11, 10)">
                    <polygon points="7,2 1,13 13,13" fill="#78350f" />
                    <rect x="5" y="2" width="4" height="2" fill="#ef4444" />
                    <rect x="6" y="0" width="2" height="2" fill="#f97316" />
                    <rect x="6" y="4" width="2" height="5" fill="#ea580c" />
                  </g>
                  <text x="36" y="16" fill="#fde047" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                    2. Endapan Pasir, Kerikil &amp; Tefra Kawah
                  </text>
                  <text x="36" y="28" fill="#cbd5e1" fontSize="7.8" fontFamily="sans-serif">
                    Jutaan m³ material sisa erupsi mencair jadi bubur kental.
                  </text>
                </g>

                {/* Point 3: Batu Andesit Masif */}
                <g transform="translate(10, 122)">
                  <rect x="0" y="0" width="274" height="36" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                  <rect x="6" y="6" width="24" height="24" rx="4" fill="#dc2626" />
                  {/* Ikon 2D Pixel: Batu Andesit Raksasa */}
                  <g transform="translate(11, 10)">
                    <rect x="3" y="2" width="8" height="3" fill="#94a3b8" />
                    <rect x="1" y="5" width="12" height="6" fill="#64748b" />
                    <rect x="2" y="11" width="10" height="2" fill="#334155" />
                    <rect x="4" y="3" width="3" height="2" fill="#cbd5e1" />
                    <rect x="8" y="7" width="3" height="3" fill="#1e293b" />
                  </g>
                  <text x="36" y="16" fill="#fca5a5" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                    3. Batu Andesit Raksasa Terbawa Arus
                  </text>
                  <text x="36" y="28" fill="#cbd5e1" fontSize="7.8" fontFamily="sans-serif">
                    Daya dorong hidrolik tinggi menyeret batu sebesar mobil!
                  </text>
                </g>

                {/* Stat Chip Bottom */}
                <g transform="translate(10, 164)">
                  <rect x="0" y="0" width="274" height="32" rx="6" fill="#042f2e" stroke="#10b981" strokeWidth="1.2" />
                  <text x="137" y="14" fill="#a7f3d0" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                    DENSITAS SLURRY: 1,8 — 2,2 TON/M³
                  </text>
                  <text x="137" y="25" fill="#ffffff" fontSize="7.5" textAnchor="middle" fontFamily="sans-serif">
                    Mampu meruntuhkan jembatan beton &amp; menyapu bibir sungai!
                  </text>
                </g>
              </g>
            </g>
          )}

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* TAB 2: ZONASI BANTARAN SUNGAI & RADIUS AMAN                       */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'sungai' && (
            <g>
              {/* Sisi Kiri: Penampang Lembah Sungai V-Shape & Dataran Tinggi */}
              {/* Tebing Kiri & Jurang Sungai */}
              <polygon points="10,85 70,85 100,165 10,165" fill="#334155" stroke="#1e293b" strokeWidth="1.5" />
              {/* Dasar Sungai & Alur Lahar Dingin */}
              <rect x="100" y="152" width="70" height="20" fill="#451a03" />
              <path d="M 100 156 Q 135 164 170 156 L 170 172 L 100 172 Z" fill="#78350f" />
              <line x1="100" y1="154" x2="170" y2="154" stroke="#facc15" strokeWidth="1.5" strokeDasharray="3 3" />

              {/* Batu Terbawa di Dasar Sungai */}
              <circle cx="120" cy="162" r="5" fill="url(#andesiteGrad1)" />
              <circle cx="145" cy="164" r="6" fill="url(#andesiteGrad2)" />

              {/* Tebing Kanan Menuju Dataran Tinggi / Tempat Evakuasi */}
              <polygon points="170,165 195,115 235,115 235,172 170,172" fill="#334155" stroke="#1e293b" strokeWidth="1.5" />
              {/* Dataran Tinggi Evakuasi Aman (Hijau Aman) */}
              <rect x="195" y="105" width="40" height="12" fill="#15803d" />
              <polygon points="210,95 210,105 220,100" fill="#22c55e" />
              <line x1="210" y1="90" x2="210" y2="105" stroke="#ffffff" strokeWidth="1.5" />
              <rect x="190" y="80" width="44" height="14" rx="3" fill="#0f172a" stroke="#22c55e" strokeWidth="1" />
              <text x="212" y="90" fill="#4ade80" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                BUKIT AMAN
              </text>

              {/* Tanda Panah Evakuasi Lari ke Atas */}
              <path d="M 178 142 L 196 122" stroke="#22c55e" strokeWidth="3" markerEnd="url(#arrow)" />
              <polygon points="198,120 190,123 194,130" fill="#22c55e" />

              {/* Jembatan Rusak / Terlarang di Atas Sungai */}
              <rect x="68" y="100" width="38" height="6" fill="#64748b" />
              <line x1="106" y1="100" x2="135" y2="125" stroke="#dc2626" strokeWidth="3" strokeDasharray="3 2" />
              <circle cx="120" cy="112" r="7" fill="#dc2626" />
              <text x="120" y="116" fill="#ffffff" fontSize="9" fontWeight="black" textAnchor="middle">✕</text>

              {/* Garis Batas Bahaya Merah (Zona Merah < 500m) */}
              <rect x="20" y="42" width="140" height="24" rx="4" fill="#0f172a" stroke="#dc2626" strokeWidth="1.5" />
              <text x="90" y="53" fill="#f87171" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                ZONA MERAH: SEMPADAN SUNGAI
              </text>
              <text x="90" y="62" fill="#fecaca" fontSize="7" textAnchor="middle" fontFamily="sans-serif">
                Radius Bahaya: &lt; 300 - 500 Meter
              </text>

              {/* Rambu Peringatan Lahar Segitiga Kuning */}
              <polygon points="45,115 30,140 60,140" fill="#facc15" stroke="#0f172a" strokeWidth="1.5" />
              <text x="45" y="136" fill="#0f172a" fontSize="14" fontWeight="black" textAnchor="middle">!</text>

              {/* SISI KANAN: PROTOKOL KESELAMATAN BANTARAN SUNGAI */}
              <g transform="translate(236, 10)">
                <rect x="0" y="0" width="294" height="205" rx="10" fill="#0f172a" fillOpacity="0.94" stroke="#dc2626" strokeWidth="1.8" />
                <rect x="1" y="1" width="292" height="32" rx="9" fill="#7f1d1d" />

                <text x="147" y="21" fill="#fee2e2" fontSize="10.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
                  ATURAN KESELAMATAN BANTARAN SUNGAI
                </text>

                {/* Larangan 1 */}
                <g transform="translate(10, 40)">
                  <rect x="0" y="0" width="274" height="42" rx="6" fill="#1e293b" stroke="#7f1d1d" strokeWidth="1" />
                  <rect x="6" y="6" width="30" height="30" rx="4" fill="#991b1b" />
                  {/* Ikon 2D Pixel: Larangan Jembatan */}
                  <g transform="translate(13, 13)">
                    <circle cx="8" cy="8" r="7" fill="none" stroke="#fee2e2" strokeWidth="2.2" />
                    <line x1="3" y1="3" x2="13" y2="13" stroke="#fee2e2" strokeWidth="2.2" />
                  </g>
                  <text x="42" y="17" fill="#f87171" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                    Dilarang Menonton di Jembatan!
                  </text>
                  <text x="42" y="30" fill="#cbd5e1" fontSize="7.8" fontFamily="sans-serif">
                    Batu raksasa dapat merubuhkan tiang jembatan seketika tanpa tanda awal.
                  </text>
                </g>

                {/* Larangan 2 */}
                <g transform="translate(10, 87)">
                  <rect x="0" y="0" width="274" height="42" rx="6" fill="#1e293b" stroke="#7f1d1d" strokeWidth="1" />
                  <rect x="6" y="6" width="30" height="30" rx="4" fill="#991b1b" />
                  {/* Ikon 2D Pixel: Rambu Peringatan Bahaya */}
                  <g transform="translate(13, 13)">
                    <polygon points="8,1 1,14 15,14" fill="#facc15" stroke="#78350f" strokeWidth="1" />
                    <rect x="7" y="5" width="2" height="4" fill="#0f172a" />
                    <rect x="7" y="10.5" width="2" height="2" fill="#0f172a" />
                  </g>
                  <text x="42" y="17" fill="#fca5a5" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                    Dilarang Beraktivitas di Dasar Sungai
                  </text>
                  <text x="42" y="30" fill="#cbd5e1" fontSize="7.8" fontFamily="sans-serif">
                    Tinggalkan tambang pasir seketika saat langit hulu puncak mendung pekat!
                  </text>
                </g>

                {/* Tanggap Aman (Hijau) */}
                <g transform="translate(10, 134)">
                  <rect x="0" y="0" width="274" height="62" rx="6" fill="#064e3b" stroke="#059669" strokeWidth="1.2" />
                  <rect x="6" y="8" width="30" height="30" rx="4" fill="#047857" />
                  {/* Ikon 2D Pixel: Pelari Evakuasi */}
                  <g transform="translate(14, 15)">
                    <rect x="8" y="1" width="3" height="3" fill="#d1fae5" />
                    <rect x="5" y="4" width="4" height="4" fill="#6ee7b7" />
                    <rect x="9" y="5" width="3" height="2" fill="#d1fae5" />
                    <rect x="2" y="4" width="3" height="2" fill="#34d399" />
                    <rect x="6" y="8" width="2" height="3" fill="#10b981" />
                    <rect x="8" y="10" width="3" height="2" fill="#6ee7b7" />
                    <rect x="3" y="8" width="3" height="2" fill="#10b981" />
                  </g>
                  <text x="42" y="21" fill="#34d399" fontSize="9.5" fontWeight="bold" fontFamily="sans-serif">
                    EVAKUASI TEGAK LURUS KE ATAS!
                  </text>
                  <text x="42" y="35" fill="#ecfdf5" fontSize="8" fontFamily="sans-serif">
                    Jangan lari searah aliran sungai! Naiklah ke dataran tinggi atau bukit terdekat minimal radius 500 meter dari sempadan.
                  </text>
                </g>
              </g>
            </g>
          )}

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* TAB 3: EARLY WARNING SYSTEM (EWS LAHAR TELEMETRI)                 */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'ews' && (
            <g>
              {/* Sisi Kiri: Diagram Jaringan Sensor Telemetri & Tower Sirine */}
              {/* Stasiun 1: Sensor Hujan Telemetri di Puncak (ARR) */}
              <rect x="20" y="25" width="60" height="42" rx="5" fill="#0f172a" stroke="#0284c7" strokeWidth="1.5" />
              <text x="50" y="37" fill="#38bdf8" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                STASIUN HUJAN
              </text>
              <rect x="42" y="42" width="16" height="12" fill="#0369a1" />
              <polygon points="40,42 60,42 50,47" fill="#38bdf8" />
              <text x="50" y="62" fill="#fde047" fontSize="6.5" textAnchor="middle" fontFamily="sans-serif">
                &gt;50 mm/jam
              </text>

              {/* Stasiun 2: Seismometer Getaran Lahar di Hulu Jurang */}
              <rect x="20" y="80" width="60" height="42" rx="5" fill="#0f172a" stroke="#d97706" strokeWidth="1.5" />
              <text x="50" y="92" fill="#facc15" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                SENSOR GETARAN
              </text>
              {/* Gelombang Seismik Lahar (10-30 Hz) */}
              <path d="M 28 106 L 34 100 L 40 112 L 46 98 L 52 110 L 58 102 L 64 106 L 72 106" stroke="#fbbf24" strokeWidth="1.5" fill="none" />
              <text x="50" y="117" fill="#fef08a" fontSize="6.5" textAnchor="middle" fontFamily="sans-serif">
                Tremor Aliran Batu
              </text>

              {/* Garis Transmisi Telemetri Radio VHF */}
              <path d="M 80 46 Q 115 65 140 85" stroke="#38bdf8" strokeWidth="1.8" strokeDasharray="3 3" fill="none">
                <animate attributeName="stroke-dashoffset" values="0;-16" dur="0.8s" repeatCount="indefinite" />
              </path>
              <path d="M 80 101 Q 115 105 140 115" stroke="#facc15" strokeWidth="1.8" strokeDasharray="3 3" fill="none">
                <animate attributeName="stroke-dashoffset" values="0;-16" dur="0.8s" repeatCount="indefinite" />
              </path>

              {/* TOWER SIRINE EWS TELEMETRI DI DESA */}
              {/* Tiang Kisi Baja EWS */}
              <polygon points="152,172 158,55 166,55 172,172" fill="#475569" stroke="#1e293b" strokeWidth="1" />
              <line x1="154" y1="90" x2="170" y2="130" stroke="#334155" strokeWidth="1.2" />
              <line x1="170" y1="90" x2="154" y2="130" stroke="#334155" strokeWidth="1.2" />

              {/* Antena Telemetri VHF di Pucuk */}
              <line x1="162" y1="55" x2="162" y2="30" stroke="#94a3b8" strokeWidth="2" />
              <line x1="156" y1="36" x2="168" y2="36" stroke="#94a3b8" strokeWidth="1.5" />

              {/* Panel Surya Tenaga Cadangan */}
              <polygon points="144,70 156,66 156,80 144,84" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1" />

              {/* Speaker Sirine Ganda EWS Horn Louder */}
              <polygon points="162,56 146,50 146,62" fill="#eab308" stroke="#78350f" strokeWidth="1" />
              <polygon points="162,56 178,50 178,62" fill="#eab308" stroke="#78350f" strokeWidth="1" />

              {/* Lampu Strobo Berputar EWS Merah-Kuning */}
              <circle cx="162" cy="46" r="6" fill="#ef4444" filter="url(#softGlow)">
                <animate attributeName="fill" values="#ef4444;#facc15;#ef4444" dur="0.6s" repeatCount="indefinite" />
              </circle>

              {/* Gelombang Suara Sirine Menyebar */}
              <path d="M 182 46 A 14 14 0 0 1 182 66" stroke="#facc15" strokeWidth="2" fill="none" opacity="0.9">
                <animate attributeName="stroke-width" values="1;3;1" dur="0.6s" repeatCount="indefinite" />
              </path>
              <path d="M 190 40 A 24 24 0 0 1 190 72" stroke="#ef4444" strokeWidth="2" fill="none" opacity="0.8">
                <animate attributeName="stroke-width" values="1.5;3.5;1.5" dur="0.6s" repeatCount="indefinite" />
              </path>

              {/* Kotak Kontrol Telemetri Bawah */}
              <rect x="154" y="142" width="16" height="24" fill="#0284c7" stroke="#0f172a" strokeWidth="1" />

              {/* Badge Status EWS */}
              <rect x="122" y="176" width="80" height="16" rx="4" fill="#0f172a" stroke="#22c55e" strokeWidth="1.2" />
              <text x="162" y="188" fill="#4ade80" fontSize="7.5" fontWeight="black" textAnchor="middle" fontFamily="sans-serif">
                SIRINE AKTIF: &gt;110 dB
              </text>

              {/* SISI KANAN: ALUR TEKNOLOGI TELEMETRI */}
              <g transform="translate(236, 10)">
                <rect x="0" y="0" width="294" height="205" rx="10" fill="#0f172a" fillOpacity="0.94" stroke="#2563eb" strokeWidth="1.8" />
                <rect x="1" y="1" width="292" height="32" rx="9" fill="#1e3a8a" />

                <text x="147" y="21" fill="#dbeafe" fontSize="10.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
                  JARINGAN TELEMETRI EWS PVMBG &amp; BNPB
                </text>

                {/* Langkah 1 */}
                <g transform="translate(10, 40)">
                  <rect x="0" y="0" width="274" height="36" rx="6" fill="#1e293b" stroke="#3b82f6" strokeWidth="1" />
                  <rect x="6" y="6" width="24" height="24" rx="4" fill="#0284c7" />
                  <text x="18" y="22" fill="#ffffff" fontSize="12" textAnchor="middle">1</text>
                  <text x="36" y="16" fill="#38bdf8" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                    Deteksi Intensitas Hujan Hulu (ARR)
                  </text>
                  <text x="36" y="28" fill="#cbd5e1" fontSize="7.8" fontFamily="sans-serif">
                    Mencatat ambang batas curah hujan kritis &gt;50 mm/jam di puncak.
                  </text>
                </g>

                {/* Langkah 2 */}
                <g transform="translate(10, 81)">
                  <rect x="0" y="0" width="274" height="36" rx="6" fill="#1e293b" stroke="#3b82f6" strokeWidth="1" />
                  <rect x="6" y="6" width="24" height="24" rx="4" fill="#0284c7" />
                  <text x="18" y="22" fill="#ffffff" fontSize="12" textAnchor="middle">2</text>
                  <text x="36" y="16" fill="#60a5fa" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                    Sensor Seismik Akustik Aliran Lahar
                  </text>
                  <text x="36" y="28" fill="#cbd5e1" fontSize="7.8" fontFamily="sans-serif">
                    Mendeteksi getaran frekuensi rendah tubrukan batu andesit di dasar sungai.
                  </text>
                </g>

                {/* Langkah 3 */}
                <g transform="translate(10, 122)">
                  <rect x="0" y="0" width="274" height="36" rx="6" fill="#1e293b" stroke="#3b82f6" strokeWidth="1" />
                  <rect x="6" y="6" width="24" height="24" rx="4" fill="#0284c7" />
                  <text x="18" y="22" fill="#ffffff" fontSize="12" textAnchor="middle">3</text>
                  <text x="36" y="16" fill="#93c5fd" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                    Peringatan Sirine Otomatis ke Desa
                  </text>
                  <text x="36" y="28" fill="#cbd5e1" fontSize="7.8" fontFamily="sans-serif">
                    Menara sirine bertenaga surya berbunyi lantang untuk evakuasi cepat.
                  </text>
                </g>

                {/* Golden Time Box */}
                <g transform="translate(10, 164)">
                  <rect x="0" y="0" width="274" height="32" rx="6" fill="#172554" stroke="#3b82f6" strokeWidth="1.2" />
                  <text x="137" y="14" fill="#93c5fd" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                    GOLDEN TIME EVAKUASI: 10 — 20 MENIT
                  </text>
                  <text x="137" y="25" fill="#ffffff" fontSize="7.5" textAnchor="middle" fontFamily="sans-serif">
                    Waktu krusial warga untuk lari menjauh sebelum lahar menerjang jembatan.
                  </text>
                </g>
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* Modern Explanatory Information Card */}
      <div className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 my-1.5 shadow-xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5 pb-1 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-0.5 rounded-full text-[13.5px] sm:text-[13px] font-black text-slate-950 tracking-wider uppercase"
              style={{ backgroundColor: tabDetails[activeTab].color }}
            >
              {tabDetails[activeTab].badge}
            </span>
            <h4 className="text-[13px] sm:text-[15px] font-black text-amber-300 tracking-wide font-sans">
              {tabDetails[activeTab].title}
            </h4>
          </div>
          {activeTab === 'lahar' && (
            <a
              href="https://news.detik.com/berita/d-7301571/4-fakta-banjir-lahar-dingin-semeru-yang-tewaskan-3-orang"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-amber-300 hover:text-amber-200 text-[13.5px] font-sans font-bold flex items-center gap-1 transition-all"
              title="Kunjungi sumber dokumentasi Detikcom"
            >
              <span>Sumber: Detikcom</span>
              <span>↗</span>
            </a>
          )}
        </div>
        <p className="font-sans text-[13px] sm:text-[16px] text-slate-200 leading-relaxed font-semibold mb-2">
          {tabDetails[activeTab].desc}
        </p>
        <div className="bg-slate-950/60 rounded-lg px-2.5 py-1.5 border-l-3 border-amber-400 flex items-start gap-2">
          <span className="text-amber-400 font-bold text-[13px] shrink-0 mt-0.5 flex items-center gap-1">
            <PixelIcon name="bulb" size={13} className="text-amber-400 shrink-0" />
            CATATAN AHLI:
          </span>
          <span className="text-[15px] sm:text-[13px] text-amber-200/90 font-medium italic leading-relaxed">
            {tabDetails[activeTab].keyTakeaway}
          </span>
        </div>
      </div>

      {/* 3 Interactive Tab Control Buttons */}
      <div className="w-full grid grid-cols-3 gap-2 sm:gap-2.5 pt-1">
        <button
          onClick={() => setActiveTab('lahar')}
          className={`px-3 py-2.5 rounded-xl border-2 text-[14.5px] sm:text-[13px] font-bold font-sans cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-md ${activeTab === 'lahar'
            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 border-emerald-300 font-black shadow-emerald-900/40 scale-[1.02]'
            : 'bg-slate-800/90 text-emerald-300 border-slate-700 hover:border-emerald-500/60 hover:bg-slate-800'
            }`}
        >
          <PixelIcon name="wave" size={14} className="shrink-0" />
          <span>1. MEKANISME LAHAR</span>
        </button>

        <button
          onClick={() => setActiveTab('sungai')}
          className={`px-3 py-2.5 rounded-xl border-2 text-[14.5px] sm:text-[13px] font-bold font-sans cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-md ${activeTab === 'sungai'
            ? 'bg-gradient-to-r from-red-500 to-rose-500 text-slate-950 border-red-300 font-black shadow-red-900/40 scale-[1.02]'
            : 'bg-slate-800/90 text-red-300 border-slate-700 hover:border-red-500/60 hover:bg-slate-800'
            }`}
        >
          <PixelIcon name="warning" size={14} className="shrink-0" />
          <span>2. ZONASI SUNGAI</span>
        </button>

        <button
          onClick={() => setActiveTab('ews')}
          className={`px-3 py-2.5 rounded-xl border-2 text-[14.5px] sm:text-[13px] font-bold font-sans cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-md ${activeTab === 'ews'
            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-slate-950 border-blue-300 font-black shadow-blue-900/40 scale-[1.02]'
            : 'bg-slate-800/90 text-blue-300 border-slate-700 hover:border-blue-500/60 hover:bg-slate-800'
            }`}
        >
          <PixelIcon name="siren" size={14} className="shrink-0" />
          <span>3. SIRINE EWS</span>
        </button>
      </div>
    </div>
  );
}
