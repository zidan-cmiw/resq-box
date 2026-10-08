// ── src/app/Level1/EarthDive/DiscoveryModal.tsx ──────────────────────────────────
// Modal Pop-Up Interaktif Titik Temuan Sains (Discovery Point) pada Earth Dive
// Menampilkan ilustrasi geologis realistik bergaya 2D retro pixel art murni tanpa emoji OS

import { useState, useEffect } from 'react';
import type { DiscoveryPoint } from './earthDiveData';
import { retroAudio } from '../../../utils/retroAudio';
import PixelIcon from '../../../components/PixelIcon';
import { SeismographPlatesIllustration, TransformSanAndreasIllustration, ConvergentSubductionIllustration, TRANSFORM_POINTS_DATA } from '../../Level2/DiscoveryModal';

interface DiscoveryModalProps {
  discovery: DiscoveryPoint;
  strataName?: string;
  depthRange?: string;
  tempRange?: string;
  composition?: string;
  onClose: () => void;
}

export default function DiscoveryModal({
  discovery,
  onClose,
}: DiscoveryModalProps) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedLandform, setSelectedLandform] = useState<'trench' | 'mountains' | 'volcano'>('trench');

  const handleSimulate = () => {
    setIsSimulating(true);
    retroAudio.playSelect();
    setTimeout(() => setIsSimulating(false), 4500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm select-none animate-fadeIn">

      {/* ── MAIN PIXEL PARCHMENT BOARD ── */}
      <div className="relative w-full max-w-5xl xl:max-w-6xl bg-[#fef3c7] border-4 sm:border-[5px] border-[#451a03] rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-[0_12px_0_#1c0d02] text-[#451a03] font-pixel max-h-[96vh] overflow-y-auto">

        {/* Top Header */}
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
          <button
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

        {/* ── VISUAL ILLUSTRATION AREA (2D PIXEL ART SCIENTIFIC DIAGRAM) ── */}
        <div className="w-full h-[400px] sm:h-[460px] md:h-[520px] bg-[#0c0a09] border-3 sm:border-4 border-[#78350f] rounded-xl sm:rounded-2xl overflow-hidden relative mb-4 sm:mb-5 flex items-center justify-center shadow-inner">
          {renderIllustration(discovery.illustrationType, isSimulating, handleSimulate, selectedLandform, setSelectedLandform)}
        </div>

        {/* ── PENJELASAN MATERI (RINGKAS & MUDAH DIPAHAMI UNTUK SMP) ── */}
        <div className="bg-[#fef9c3] p-4 sm:p-6 md:p-7 rounded-2xl border-3 border-[#b45309]/60 shadow-md text-[#291305] space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-1 rounded-md bg-[#b45309] text-amber-50 font-pixel-title text-[13px] sm:text-[15px] font-bold tracking-wider shadow-sm">
              MATERI PEMBELAJARAN
            </span>
          </div>
          <p className="font-sans text-base sm:text-lg md:text-xl lg:text-[24px] leading-relaxed md:leading-loose text-[#291305] font-semibold tracking-wide">
            {discovery.shortDesc}
          </p>

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
              <p className="font-sans text-[15px] sm:text-base md:text-lg lg:text-xl leading-relaxed text-[#451a03] font-medium italic">
                {discovery.fact}
              </p>
            </div>
          )}
        </div>

        {/* ── ACTION BUTTONS ── */}
        <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t-2 border-[#b45309]/40 flex justify-end">
          <button
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

// ══════════════════════════════════════════════════════════════════════════
// 1. ILUSTRASI REALISTIK KOMPARASI KERAK BUMI: KERAK BENUA VS KERAK SAMUDRA
// ══════════════════════════════════════════════════════════════════════════
function CrustComparisonIllustration() {
  const [activeFeature, setActiveFeature] = useState<'continental' | 'oceanic' | 'moho' | 'mountain' | null>(null);

  const featureDetails = {
    continental: {
      title: 'KERAK BENUA (DARATAN)',
      desc: 'Tebal mencapai 30–100 km (tebal & berakar dalam). Terdiri dari batuan granit ringan (kaya Silika & Aluminium / SiAl). Membentuk seluruh daratan tempat manusia hidup.',
      color: '#f59e0b',
    },
    oceanic: {
      title: 'KERAK SAMUDRA (DASAR LAUT)',
      desc: 'Jauh lebih tipis (hanya 5–15 km), namun jauh lebih padat dan berat. Terdiri dari batuan basal gelap (kaya Silika & Magnesium / SiMa) di bawah samudra luas.',
      color: '#38bdf8',
    },
    moho: {
      title: 'BATAS MOHO (MOHOROVIČIĆ)',
      desc: 'Garis batas seismik pemisah antara kerak bumi padat dengan mantel bumi astenosfer di bawahnya. Gelombang gempa melesat jauh lebih cepat melewati lapisan ini.',
      color: '#f97316',
    },
    mountain: {
      title: 'GUNUNG & DARATAN TINGGI',
      desc: 'Hasil desakan lipatan tektonik. Memiliki "akar" kerak benua yang menghujam sangat dalam ke lapisan mantel bumi untuk menopang beban tingginya.',
      color: '#22c55e',
    },
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between select-none">
      {/* Quick Interactive Selection Tabs at Top */}
      <div className="w-full flex items-center justify-center gap-2 sm:gap-3 px-3 py-2 bg-[#1c1917]/90 border-b border-[#78350f]/60 z-10 overflow-x-auto text-[13px] sm:text-[15px] font-semibold">
        <button
          onClick={() => setActiveFeature(activeFeature === 'continental' ? null : 'continental')}
          className={`px-3 py-1.5 rounded-full font-bold cursor-pointer transition-colors ${
            activeFeature === 'continental'
              ? 'bg-amber-400 text-slate-950 shadow'
              : 'bg-amber-950/60 text-amber-200 border border-amber-700/50 hover:bg-amber-900/60'
          }`}
        >
          1. Kerak Benua (~100 km)
        </button>
        <button
          onClick={() => setActiveFeature(activeFeature === 'oceanic' ? null : 'oceanic')}
          className={`px-3 py-1.5 rounded-full font-bold cursor-pointer transition-colors ${
            activeFeature === 'oceanic'
              ? 'bg-sky-400 text-slate-950 shadow'
              : 'bg-sky-950/60 text-sky-200 border border-sky-700/50 hover:bg-sky-900/60'
          }`}
        >
          2. Kerak Samudra (5–15 km)
        </button>
        <button
          onClick={() => setActiveFeature(activeFeature === 'moho' ? null : 'moho')}
          className={`px-3 py-1.5 rounded-full font-bold cursor-pointer transition-colors ${
            activeFeature === 'moho'
              ? 'bg-orange-500 text-slate-950 shadow'
              : 'bg-orange-950/60 text-orange-200 border border-orange-700/50 hover:bg-orange-900/60'
          }`}
        >
          3. Batas Moho
        </button>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 540 240" className="w-full h-full object-contain" shapeRendering="geometricPrecision">
          <defs>
            {/* Gradien Kolom Air Samudra */}
            <linearGradient id="oceanColumnGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="35%" stopColor="#0284c7" />
              <stop offset="70%" stopColor="#0369a1" />
              <stop offset="100%" stopColor="#082f49" />
            </linearGradient>

            {/* Gradien Mantel Astenosfer */}
            <linearGradient id="asthenosphereGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3e1806" />
              <stop offset="50%" stopColor="#7c2d12" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>

            {/* Gradien Langit Daratan */}
            <linearGradient id="continentalSkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="60%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>

            {/* Gradien Langit Samudra */}
            <linearGradient id="oceanSkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#020617" />
              <stop offset="100%" stopColor="#0c2340" />
            </linearGradient>
          </defs>

          {/* Latar Belakang Dasar */}
          <rect x="0" y="0" width="540" height="240" fill="#020617" />

          {/* ══════════════════════════════════════════════════════════════════
              PANEL KIRI: KERAK BENUA (DARATAN, GUNUNG, STRATA SOLID TANPA CELAH)
              ══════════════════════════════════════════════════════════════════ */}
          <g
            id="panel-kerak-benua"
            className="cursor-pointer"
            onClick={() => setActiveFeature(activeFeature === 'continental' ? null : 'continental')}
          >
            {/* Langit Daratan (Meluas hingga ke belakang rumput untuk mencegah celah hitam) */}
            <rect x="4" y="4" width="262" height="95" fill="url(#continentalSkyGrad)" />

            {/* Matahari & Awan Halus */}
            <circle cx="28" cy="30" r="7" fill="#fbbf24" opacity="0.9" />
            <path d="M 180,24 Q 192,20 205,24 Q 215,22 225,26 Q 215,30 200,30 Q 188,30 180,24 Z" fill="#64748b" opacity="0.5" />

            {/* Asap Kawah Merapi Halus Organik */}
            <path d="M 134,36 Q 130,26 136,18 Q 142,24 138,36 Z" fill="#cbd5e1" opacity="0.8" />
            <circle cx="137" cy="16" r="4" fill="#f1f5f9" opacity="0.7" />

            {/* Kerucut Gunung Berapi / Lipatan Alami */}
            <polygon points="50,78 134,36 218,78" fill="#475569" />
            <polygon points="134,36 218,78 134,78" fill="#334155" />
            {/* Lereng Bayangan & Kawah */}
            <polygon points="120,44 134,36 148,44 134,48" fill="#1e293b" />
            <line x1="134" y1="36" x2="134" y2="44" stroke="#f97316" strokeWidth="1.5" />

            {/* ── ARSITEKTUR LAYER BERTUMPUK (BEBAS CELAH HITAM) ── */}
            {/* Strata 3 (Dasar): Batuan Kristalin Padat Arang Kokoh (y: 76 sampai 195) */}
            <rect x="4" y="76" width="262" height="119" fill="#475569" />

            {/* Strata 2: Batuan Granit / SiAl (Abu-abu Hangat Batu Alam) */}
            <path
              d="M 4,76 L 266,76 L 266,160 Q 200,163 135,158 T 4,160 Z"
              fill="#786c5f"
            />

            {/* Strata 1: Sedimen & Tanah Subur (Cokelat Organik Hangat) */}
            <path
              d="M 4,76 L 266,76 L 266,118 Q 200,121 135,116 T 4,118 Z"
              fill="#8d5b4c"
            />

            {/* Lereng Hijau Alami Bergelombang Halus (Natural Terrain) */}
            <path
              d="M 4,78 Q 40,74 75,77 T 145,76 T 215,79 T 266,77 L 266,92 L 4,92 Z"
              fill="#15803d"
            />
            {/* Garis Rumput Permukaan */}
            <path
              d="M 4,78 Q 40,74 75,77 T 145,76 T 215,79 T 266,77"
              fill="none"
              stroke="#22c55e"
              strokeWidth="2"
            />

            {/* Garis Batas Moho Solid Bersih (Bawah Kerak Benua) */}
            <line x1="4" y1="195" x2="266" y2="195" stroke="#f97316" strokeWidth="2.5" />

            {/* Astenosfer (Mantel Atas) */}
            <rect x="4" y="196" width="262" height="40" fill="url(#asthenosphereGrad)" />

            {/* Indikator Ketebalan Kerak Benua di Tepi Kiri (Ramping, Tidak Menutupi Gambar) */}
            <g id="thickness-continental">
              <line x1="18" y1="80" x2="18" y2="195" stroke="#facc15" strokeWidth="2" />
              <polygon points="18,80 14,88 22,88" fill="#facc15" />
              <polygon points="18,195 14,187 22,187" fill="#facc15" />
              {/* Badge Ramping Bersih */}
              <rect x="24" y="130" width="104" height="22" rx="4" fill="#0f172a" fillOpacity="0.9" stroke="#facc15" strokeWidth="1.2" />
              <text x="76" y="145" fill="#fef08a" fontSize="9" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">
                Tebal: ~100 km
              </text>
            </g>

            {/* Label Identitas Panel Kiri */}
            <rect x="12" y="8" width="168" height="22" rx="5" fill="#1e293b" fillOpacity="0.92" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="96" y="23" fill="#fef08a" fontSize="10" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">
              1. KERAK BENUA (DARATAN)
            </text>
          </g>

          {/* ══════════════════════════════════════════════════════════════════
              GARIS PEMISAH VERTIKAL DUA PANEL (DIVIDER EMAS ELEGAN)
              ══════════════════════════════════════════════════════════════════ */}
          <line x1="270" y1="4" x2="270" y2="236" stroke="#f59e0b" strokeWidth="2.5" />

          {/* ══════════════════════════════════════════════════════════════════
              PANEL KANAN: KERAK SAMUDRA (DASAR LAUT, GELOMBANG AIR SOLID, BASAL TIPIS)
              ══════════════════════════════════════════════════════════════════ */}
          <g
            id="panel-kerak-samudra"
            className="cursor-pointer"
            onClick={() => setActiveFeature(activeFeature === 'oceanic' ? null : 'oceanic')}
          >
            {/* Langit di Atas Samudra (Meluas hingga ke belakang gelombang untuk mencegah celah hitam) */}
            <rect x="274" y="4" width="262" height="60" fill="url(#oceanSkyGrad)" />

            {/* Permukaan Laut dengan Gelombang Air Lembut & Solid */}
            <path
              d="M 274,40 Q 290,37 308,41 T 344,38 T 380,41 T 416,38 T 452,41 T 488,38 T 524,41 L 536,40 L 536,180 L 274,180 Z"
              fill="url(#oceanColumnGrad)"
            />
            {/* Buih Ombak Putih di Puncak Gelombang */}
            <path
              d="M 274,40 Q 290,37 308,41 T 344,38 T 380,41 T 416,38 T 452,41 T 488,38 T 524,41 L 536,40"
              fill="none"
              stroke="#bae6fd"
              strokeWidth="2"
            />

            {/* Dasar Lautan (Sedimen Laut Halus) */}
            <rect x="274" y="176" width="262" height="4" fill="#52525b" />

            {/* ── LAPISAN KERAK SAMUDRA TIPIS (BASAL PADAT / SiMa: 5–15 KM) ── */}
            <rect x="274" y="180" width="262" height="15" fill="#1e293b" />

            {/* Batas Moho Solid Bersih di Bawah Kerak Samudra */}
            <line x1="274" y1="195" x2="536" y2="195" stroke="#f97316" strokeWidth="2.5" />

            {/* Astenosfer (Mantel Atas di Bawah Samudra) */}
            <rect x="274" y="196" width="262" height="40" fill="url(#asthenosphereGrad)" />

            {/* Indikator Ketebalan Kerak Samudra di Tepi Kanan (Ramping, Terbaca Jelas) */}
            <g id="thickness-oceanic">
              <line x1="520" y1="180" x2="520" y2="195" stroke="#38bdf8" strokeWidth="2" />
              <polygon points="520,180 516,185 524,185" fill="#38bdf8" />
              <polygon points="520,195 516,190 524,190" fill="#38bdf8" />
              {/* Badge Ramping Bersih */}
              <rect x="408" y="174" width="106" height="22" rx="4" fill="#082f49" fillOpacity="0.9" stroke="#38bdf8" strokeWidth="1.2" />
              <text x="461" y="189" fill="#7dd3fc" fontSize="9" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">
                Tebal: 5–15 km
              </text>
            </g>

            {/* Label Identitas Panel Kanan */}
            <rect x="284" y="8" width="176" height="22" rx="5" fill="#082f49" fillOpacity="0.92" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="372" y="23" fill="#7dd3fc" fontSize="10" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">
              2. KERAK SAMUDRA (DASAR LAUT)
            </text>
          </g>

          {/* Label Batas Moho & Mantel Bawah yang Melintang Halus */}
          <rect x="180" y="218" width="180" height="18" rx="4" fill="#0c0a09" fillOpacity="0.88" stroke="#f97316" strokeWidth="1" />
          <text x="270" y="231" fill="#fed7aa" fontSize="9" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">
            ASTENOSFER (MANTEL BUMI)
          </text>
        </svg>
      </div>

      {/* Interactive Tooltip & Status Bar (Rapi & Tidak Menutupi Gambar) */}
      <div className="w-full bg-[#1c1917]/95 border-t border-[#78350f] px-3.5 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 min-h-[50px]">
        {activeFeature ? (
          <div className="flex items-center gap-2.5 w-full animate-fadeIn">
            <span
              className="px-2.5 py-1 rounded text-[13px] sm:text-[15px] font-bold shrink-0 text-slate-900 shadow"
              style={{ backgroundColor: featureDetails[activeFeature].color }}
            >
              {featureDetails[activeFeature].title}
            </span>
            <p className="text-[15px] sm:text-base text-amber-100 font-medium leading-relaxed">
              {featureDetails[activeFeature].desc}
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 w-full text-center text-[13px] sm:text-[15px] text-amber-200/90 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping inline-block" />
            <span>Pilih tombol di atas atau ketuk panel untuk detail komparasi geologis!</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// 2. ILUSTRASI REALISTIK ARUS KONVEKSI MANTEL BUMI (SMP KELAS 8)
// ══════════════════════════════════════════════════════════════════════════
function MantleConvectionIllustration() {
  const [activeFeature, setActiveFeature] = useState<'rising' | 'sinking' | 'plates' | 'core' | null>(null);

  const featureDetails = {
    rising: {
      title: 'ARUS PANAS NAIK (MANTLE PLUME)',
      desc: 'Magma di dasar mantel dipanaskan inti bumi hingga 3.700°C. Karena panas, magma memuai, massa jenisnya berkurang (lebih ringan), lalu perlahan mengapung naik ke atas.',
      color: '#f97316',
    },
    plates: {
      title: 'MESIN PENGGERAK LEMPENG TEKTONIK',
      desc: 'Saat magma panas mencapai dasar kerak bumi, alirannya berbelok ke samping seperti ban berjalan (conveyor belt), menyeret lempeng benua dan samudra bergerak memisah atau bertubrukan.',
      color: '#fbbf24',
    },
    sinking: {
      title: 'ARUS DINGIN TENGGELAM (SUBDUKSI)',
      desc: 'Di dekat permukaan kerak, magma melepas kalornya dan mendingin. Batuan yang mendingin menjadi lebih padat dan berat, sehingga tenggelam kembali ke dasar mantel.',
      color: '#38bdf8',
    },
    core: {
      title: 'PEMANAS DARI INTI BUMI (3.700°C)',
      desc: 'Suhu dahsyat dari inti bumi (3.700°C – 5.000°C) memanaskan dasar mantel tanpa henti, menjaga putaran siklus konveksi ini terus bekerja selama miliaran tahun.',
      color: '#ef4444',
    },
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between select-none">
      {/* Interactive Quick Select Filter Pills at Top */}
      <div className="w-full flex items-center justify-center gap-2 sm:gap-3 px-3 py-2 bg-[#1c1917]/90 border-b border-[#78350f]/60 z-10 overflow-x-auto text-[13px] sm:text-[15px] font-semibold">
        <button
          onClick={() => setActiveFeature(activeFeature === 'rising' ? null : 'rising')}
          className={`px-3 py-1.5 rounded-full font-bold cursor-pointer transition-colors ${
            activeFeature === 'rising'
              ? 'bg-orange-500 text-slate-950 shadow'
              : 'bg-orange-950/60 text-orange-200 border border-orange-700/50 hover:bg-orange-900/60'
          }`}
        >
          1. Arus Panas Naik
        </button>
        <button
          onClick={() => setActiveFeature(activeFeature === 'plates' ? null : 'plates')}
          className={`px-3 py-1.5 rounded-full font-bold cursor-pointer transition-colors ${
            activeFeature === 'plates'
              ? 'bg-amber-400 text-slate-950 shadow'
              : 'bg-amber-950/60 text-amber-200 border border-amber-700/50 hover:bg-amber-900/60'
          }`}
        >
          2. Gerak Lempeng
        </button>
        <button
          onClick={() => setActiveFeature(activeFeature === 'sinking' ? null : 'sinking')}
          className={`px-3 py-1.5 rounded-full font-bold cursor-pointer transition-colors ${
            activeFeature === 'sinking'
              ? 'bg-sky-400 text-slate-950 shadow'
              : 'bg-sky-950/60 text-sky-200 border border-sky-700/50 hover:bg-sky-900/60'
          }`}
        >
          3. Arus Dingin Turun
        </button>
        <button
          onClick={() => setActiveFeature(activeFeature === 'core' ? null : 'core')}
          className={`px-3 py-1.5 rounded-full font-bold cursor-pointer transition-colors ${
            activeFeature === 'core'
              ? 'bg-red-500 text-slate-950 shadow'
              : 'bg-red-950/60 text-red-200 border border-red-700/50 hover:bg-red-900/60'
          }`}
        >
          4. Pemanas Inti
        </button>
      </div>

      {/* SVG Canvas Illustration */}
      <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 540 240" className="w-full h-full object-contain" shapeRendering="geometricPrecision">
          <style>{`
            @keyframes convectiveFlowCCW {
              0% { stroke-dashoffset: 160; }
              100% { stroke-dashoffset: 0; }
            }
            @keyframes convectiveFlowCW {
              0% { stroke-dashoffset: 0; }
              100% { stroke-dashoffset: 160; }
            }
            @keyframes upwellingStream {
              0% { stroke-dashoffset: 80; }
              100% { stroke-dashoffset: 0; }
            }
            @keyframes arrowPulse {
              0%, 100% { opacity: 0.88; transform: scale(1); }
              50% { opacity: 1; transform: scale(1.12); }
            }
            @keyframes pulseHeat {
              0%, 100% { opacity: 0.8; transform: scaleY(0.97); }
              50% { opacity: 1; transform: scaleY(1.03); }
            }
            .anim-flow-ccw { stroke-dasharray: 22 14; animation: convectiveFlowCCW 2.6s linear infinite; }
            .anim-flow-cw { stroke-dasharray: 22 14; animation: convectiveFlowCW 2.6s linear infinite; }
            .anim-upwelling-flow { stroke-dasharray: 18 12; animation: upwellingStream 1.6s linear infinite; }
            .anim-arrow-pulse { animation: arrowPulse 2s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
            .anim-core-heat { animation: pulseHeat 3s ease-in-out infinite; transform-origin: 270px 225px; }
          `}</style>

          <defs>
            <linearGradient id="mantleBgFluid" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1a0503" />
              <stop offset="35%" stopColor="#3d0905" />
              <stop offset="70%" stopColor="#7c1d06" />
              <stop offset="100%" stopColor="#c2410c" />
            </linearGradient>

            <linearGradient id="upwellingPlume" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#facc15" />
              <stop offset="40%" stopColor="#f97316" />
              <stop offset="85%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#fef08a" />
            </linearGradient>

            <linearGradient id="downwellingCool" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="45%" stopColor="#0284c7" />
              <stop offset="80%" stopColor="#1e3a8a" />
              <stop offset="100%" stopColor="#3b0704" />
            </linearGradient>

            <radialGradient id="centralPlumeBulge" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fde047" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#ea580c" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Latar Belakang Fluida Mantel Astinosfer */}
          <rect x="0" y="0" width="540" height="240" fill="url(#mantleBgFluid)" />

          {/* ══════════════════════════════════════════════════════════════════
              ATAS: LEMPENG TEKTONIK BERGERAK (CRUST / LITHOSPHERE SLABS)
              ══════════════════════════════════════════════════════════════════ */}
          {/* Panah Indikator Arah Gerak Lempeng */}
          {/* Lempeng Kiri Bergerak Menjauh ke Kiri */}
          <g>
            <line x1="120" y1="8" x2="60" y2="8" stroke="#fbbf24" strokeWidth="2.5" />
            <polygon points="50,8 62,3 62,13" fill="#fbbf24" />
            <text x="135" y="11" fill="#fef08a" fontSize="8.5" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">
              GERAK KE KIRI
            </text>
          </g>

          {/* Lempeng Kanan Bergerak Menjauh ke Kanan */}
          <g>
            <line x1="420" y1="8" x2="480" y2="8" stroke="#fbbf24" strokeWidth="2.5" />
            <polygon points="490,8 478,3 478,13" fill="#fbbf24" />
            <text x="405" y="11" fill="#fef08a" fontSize="8.5" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="end">
              GERAK KE KANAN
            </text>
          </g>

          {/* 1. Lempeng Benua Kiri (y: 16 - 38) */}
          <g
            className="cursor-pointer"
            onClick={() => setActiveFeature(activeFeature === 'plates' ? null : 'plates')}
          >
            <rect x="15" y="16" width="180" height="22" rx="3" fill="#78350f" stroke="#92400e" strokeWidth="1" />
            <rect x="15" y="16" width="180" height="4" rx="2" fill="#15803d" />
            <text x="105" y="31" fill="#fef08a" fontSize="9.5" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">
              LEMPENG BENUA A
            </text>
          </g>

          {/* 2. Celah Retakan Tengah (Mid-Ocean Ridge / Rift) tempat Magma Menerobos */}
          <g>
            <polygon points="255,16 270,36 285,16" fill="#ea580c" />
            <polygon points="262,16 270,30 278,16" fill="#fef08a" />
            {/* Kolom air samudra di atas retakan */}
            <rect x="202" y="16" width="136" height="7" fill="#0284c7" fillOpacity="0.85" />
            <line x1="202" y1="16" x2="338" y2="16" stroke="#38bdf8" strokeWidth="1.5" />
            {/* Lempeng samudra tipis membentang di celah */}
            <rect x="202" y="23" width="136" height="15" fill="#1e293b" />
            <text x="270" y="34" fill="#7dd3fc" fontSize="8" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">
              LEMPENG SAMUDRA
            </text>
          </g>

          {/* 3. Lempeng Benua Kanan (y: 16 - 38) */}
          <g
            className="cursor-pointer"
            onClick={() => setActiveFeature(activeFeature === 'plates' ? null : 'plates')}
          >
            <rect x="345" y="16" width="180" height="22" rx="3" fill="#78350f" stroke="#92400e" strokeWidth="1" />
            <rect x="345" y="16" width="180" height="4" rx="2" fill="#15803d" />
            <text x="435" y="31" fill="#fef08a" fontSize="9.5" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">
              LEMPENG BENUA B
            </text>
          </g>

          {/* ══════════════════════════════════════════════════════════════════
              TENGAH: SIKLUS SIRKULASI ARUS KONVEKSI (STREAMLINES & PLUMES)
              ══════════════════════════════════════════════════════════════════ */}

          {/* Pendaran Panas Kolom Tengah (Upwelling Hotspot Glow) */}
          <circle cx="270" cy="120" r="75" fill="url(#centralPlumeBulge)" />

          {/* ── ARUS PANAS NAIK (TENGAH) ── */}
          <g
            className="cursor-pointer"
            onClick={() => setActiveFeature(activeFeature === 'rising' ? null : 'rising')}
          >
            {/* Jalur Panas Memancar Naik */}
            <path
              d="M 270,215 Q 266,130 255,50"
              stroke="url(#upwellingPlume)"
              strokeWidth="9"
              strokeLinecap="round"
              fill="none"
              opacity="0.9"
            />
            <path
              d="M 270,215 Q 274,130 285,50"
              stroke="url(#upwellingPlume)"
              strokeWidth="9"
              strokeLinecap="round"
              fill="none"
              opacity="0.9"
            />
            {/* Inti Pijar Tengah Solid */}
            <path
              d="M 270,215 L 270,45"
              stroke="#fef08a"
              strokeWidth="4.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Animasi Arus Panas Mengalir Naik */}
            <path
              d="M 270,215 L 270,45"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              className="anim-upwelling-flow"
            />

            {/* Anak Panah Naik Jelas & Menonjol (3 Tingkat) */}
            <g className="anim-arrow-pulse">
              <polygon points="270,40 258,56 282,56" fill="#ffffff" stroke="#451a03" strokeWidth="1.2" />
              <polygon points="270,110 259,126 281,126" fill="#ffffff" stroke="#78350f" strokeWidth="1" />
              <polygon points="270,170 260,185 280,185" fill="#fef08a" stroke="#78350f" strokeWidth="1" />
            </g>
          </g>

          {/* ── SEL KONVEKSI KIRI (BERPUTAR BERLAWANAN ARAH JARUM JAM / CCW) ── */}
          <g
            className="cursor-pointer"
            onClick={() => setActiveFeature(activeFeature === 'rising' ? null : 'rising')}
          >
            {/* Loop Sirkulasi Streamline Kiri Solid */}
            <path
              d="M 260,60 C 190,56 120,60 80,85 C 45,115 45,165 75,190 C 110,210 185,212 255,205"
              fill="none"
              stroke="#f97316"
              strokeWidth="5"
              opacity="0.9"
            />
            {/* Overlay Animasi Aliran Sirkulasi CCW */}
            <path
              d="M 260,60 C 190,56 120,60 80,85 C 45,115 45,165 75,190 C 110,210 185,212 255,205"
              fill="none"
              stroke="#fef08a"
              strokeWidth="2.5"
              className="anim-flow-ccw"
            />

            {/* Aliran Horisontal Menyeret Lempeng Kiri */}
            <path
              d="M 255,52 Q 180,50 100,54"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="3.5"
            />

            {/* Anak Panah Sirkulasi Kiri Jelas & Menonjol */}
            {/* 1. Atas: Aliran ke kiri menyeret lempeng */}
            <polygon points="120,54 136,46 136,62" fill="#fbbf24" stroke="#451a03" strokeWidth="1" />
            <polygon points="195,52 211,44 211,60" fill="#fef08a" stroke="#451a03" strokeWidth="1" />

            {/* 2. Samping: Aliran turun */}
            <polygon points="52,148 44,132 60,132" fill="#38bdf8" stroke="#0c2340" strokeWidth="1" />

            {/* 3. Bawah: Aliran kembali ke tengah pemanas */}
            <polygon points="150,208 134,200 134,216" fill="#ea580c" stroke="#451a03" strokeWidth="1" />
            <polygon points="215,206 199,198 199,214" fill="#f97316" stroke="#451a03" strokeWidth="1" />
          </g>

          {/* ── ARUS DINGIN TURUN KIRI (SLAB SUBDUKSI) ── */}
          <g
            className="cursor-pointer"
            onClick={() => setActiveFeature(activeFeature === 'sinking' ? null : 'sinking')}
          >
            <path
              d="M 68,75 Q 50,130 70,185"
              stroke="url(#downwellingCool)"
              strokeWidth="9"
              strokeLinecap="round"
              fill="none"
              opacity="0.85"
            />
            {/* Anak Panah Turun Kiri Sangat Jelas */}
            <polygon points="70,186 60,170 78,170" fill="#38bdf8" stroke="#0c2340" strokeWidth="1" />
            <polygon points="60,122 52,106 68,106" fill="#7dd3fc" stroke="#0c2340" strokeWidth="1" />
          </g>

          {/* ── SEL KONVEKSI KANAN (BERPUTAR SEARAH JARUM JAM / CW) ── */}
          <g
            className="cursor-pointer"
            onClick={() => setActiveFeature(activeFeature === 'rising' ? null : 'rising')}
          >
            {/* Loop Sirkulasi Streamline Kanan Solid */}
            <path
              d="M 280,60 C 350,56 420,60 460,85 C 495,115 495,165 465,190 C 430,210 355,212 285,205"
              fill="none"
              stroke="#f97316"
              strokeWidth="5"
              opacity="0.9"
            />
            {/* Overlay Animasi Aliran Sirkulasi CW */}
            <path
              d="M 280,60 C 350,56 420,60 460,85 C 495,115 495,165 465,190 C 430,210 355,212 285,205"
              fill="none"
              stroke="#fef08a"
              strokeWidth="2.5"
              className="anim-flow-cw"
            />

            {/* Aliran Horisontal Menyeret Lempeng Kanan */}
            <path
              d="M 285,52 Q 360,50 440,54"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="3.5"
            />

            {/* Anak Panah Sirkulasi Kanan Jelas & Menonjol */}
            {/* 1. Atas: Aliran ke kanan menyeret lempeng */}
            <polygon points="345,52 329,44 329,60" fill="#fef08a" stroke="#451a03" strokeWidth="1" />
            <polygon points="420,54 404,46 404,62" fill="#fbbf24" stroke="#451a03" strokeWidth="1" />

            {/* 2. Samping: Aliran turun */}
            <polygon points="488,148 480,132 496,132" fill="#38bdf8" stroke="#0c2340" strokeWidth="1" />

            {/* 3. Bawah: Aliran kembali ke tengah pemanas */}
            <polygon points="390,208 406,200 406,216" fill="#ea580c" stroke="#451a03" strokeWidth="1" />
            <polygon points="325,206 341,198 341,214" fill="#f97316" stroke="#451a03" strokeWidth="1" />
          </g>

          {/* ── ARUS DINGIN TURUN KANAN (SLAB SUBDUKSI) ── */}
          <g
            className="cursor-pointer"
            onClick={() => setActiveFeature(activeFeature === 'sinking' ? null : 'sinking')}
          >
            <path
              d="M 472,75 Q 490,130 470,185"
              stroke="url(#downwellingCool)"
              strokeWidth="9"
              strokeLinecap="round"
              fill="none"
              opacity="0.85"
            />
            {/* Anak Panah Turun Kanan Sangat Jelas */}
            <polygon points="470,186 462,170 480,170" fill="#38bdf8" stroke="#0c2340" strokeWidth="1" />
            <polygon points="480,122 472,106 488,106" fill="#7dd3fc" stroke="#0c2340" strokeWidth="1" />
          </g>

          {/* ══════════════════════════════════════════════════════════════════
              BAWAH: BATAS INTI LUAR - MANTEL (CORE-MANTLE BOUNDARY / SUMBER PANAS 3.700°C)
              ══════════════════════════════════════════════════════════════════ */}
          <g
            className="cursor-pointer anim-core-heat"
            onClick={() => setActiveFeature(activeFeature === 'core' ? null : 'core')}
          >
            <rect x="0" y="215" width="540" height="25" fill="#ea580c" />
            <rect x="0" y="225" width="540" height="15" fill="#fef08a" />
            <line x1="0" y1="215" x2="540" y2="215" stroke="#ffffff" strokeWidth="2" />
            <text x="270" y="235" fill="#450a0a" fontSize="10" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">
              SUMBER PANAS: INTI BUMI (SUHU 3.700°C – 5.000°C)
            </text>
          </g>
        </svg>
      </div>

      {/* Interactive Tooltip & Status Bar (Rapi & Tidak Menutupi Gambar) */}
      <div className="w-full bg-[#1c1917]/95 border-t border-[#78350f] px-3.5 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 min-h-[50px]">
        {activeFeature ? (
          <div className="flex items-center gap-2.5 w-full animate-fadeIn">
            <span
              className="px-2.5 py-1 rounded text-[13px] sm:text-[15px] font-bold shrink-0 text-slate-900 shadow"
              style={{ backgroundColor: featureDetails[activeFeature].color }}
            >
              {featureDetails[activeFeature].title}
            </span>
            <p className="text-[15px] sm:text-base text-amber-100 font-medium leading-relaxed">
              {featureDetails[activeFeature].desc}
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 w-full text-center text-[13px] sm:text-[15px] text-amber-200/90 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping inline-block" />
            <span>Pilih tombol di atas atau ketuk bagian siklus konveksi untuk penjelasannya!</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── 2D RETRO PIXEL SVG ILLUSTRATIONS (REALISTIC SCIENTIFIC CROSS-SECTIONS) ───
function renderIllustration(
  type: DiscoveryPoint['illustrationType'],
  isSimulating: boolean = false,
  onSimulate?: () => void,
  selectedLandform?: 'trench' | 'mountains' | 'volcano',
  onSelectLandform?: (lf: 'trench' | 'mountains' | 'volcano') => void,
) {
  switch (type) {
    // ═════════════════════════════════════════════════════════════════════════
    // BATAS DIVERGEN (PERSIS LEVEL 2): PANGEA, PEGUNUNGAN KEMBAR, SIMULATOR
    // ═════════════════════════════════════════════════════════════════════════
    case 'wegener-pangea':
      return <PangeaIllustration />;

    case 'twin-mountains':
      return <TwinMountainsIllustration />;

    case 'divergent-anim':
      return <DivergentAnimIllustration isSimulating={isSimulating} onSimulate={onSimulate} />;

    // ═════════════════════════════════════════════════════════════════════════
    // BATAS KONVERGEN (PERSIS LEVEL 2): SUBDUKSI 3D & 3 BENTANG ALAM
    // ═════════════════════════════════════════════════════════════════════════
    case 'convergent-subduction':
      return <ConvergentSubductionIllustration />;

    case 'convergent-landforms':
      return (
        <ConvergentLandformsIllustration
          selectedLandform={selectedLandform}
          onSelectLandform={onSelectLandform}
        />
      );

    // ═════════════════════════════════════════════════════════════════════════
    // BATAS TRANSFORM (PERSIS LEVEL 2): SISMOGRAF & SESAR SAN ANDREAS
    // ═════════════════════════════════════════════════════════════════════════
    case 'seismograph-plates':
      return <SeismographPlatesIllustration />;

    case 'transform-sanandreas':
      return <TransformSanAndreasIllustration />;

    // ── 1. KERAK BUMI & LITOSFER (0 - 100 KM) ──────────────────────────────────
    // Komparasi Realistik: KERAK BENUA (Daratan, Tebal ~100 km) vs KERAK SAMUDRA (Dasar Laut, Tebal 5-15 km)
    case 'crust':
      return <CrustComparisonIllustration />;

    // ── 2. DINAMIKA LEMPENG & ASTENOSFER (100 - 660 KM) ────────────────────────
    // Rekonstruksi Realistis Zona Subduksi, Palung Laut Dalam, Gunung Berapi & Wadati-Benioff Zone!
    case 'convection':
      return (
        <svg viewBox="0 0 500 240" className="w-full h-full object-contain" shapeRendering="crispEdges">
          {/* Sky background */}
          <rect x="0" y="0" width="500" height="50" fill="#1e1b4b" />

          {/* Left: Ocean body above subducting oceanic plate */}
          <rect x="0" y="30" width="240" height="25" fill="#0284c7" opacity="0.7" />
          <rect x="0" y="55" width="220" height="35" fill="#0369a1" />
          {/* Deep Sea Trench (Palung Laut Dalam V-Shaped trench plunging deep) */}
          <polygon points="180,55 220,110 240,55" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="1" />

          {/* ── OVERRIDING CONTINENTAL CRUST (RIGHT) ── */}
          {/* Continental mountain arc with active volcano */}
          <polygon points="230,55 310,15 370,55" fill="#475569" />
          <polygon points="350,55 420,25 490,55" fill="#334155" />
          {/* Volcano cone */}
          <polygon points="270,55 310,18 350,55" fill="#78350f" />
          {/* Crater at summit */}
          <polygon points="305,18 315,18 318,23 302,23" fill="#ea580c" />
          {/* Billowing Ash Cloud from volcano */}
          <rect x="306" y="2" width="10" height="14" fill="#64748b" opacity="0.9" />
          <rect x="298" y="-4" width="24" height="10" fill="#94a3b8" opacity="0.8" />
          <rect x="308" y="10" width="4" height="6" fill="#f97316" /> {/* Lava spark */}
          {/* Continental crust slab */}
          <rect x="235" y="55" width="265" height="50" fill="#92400e" />
          <rect x="235" y="55" width="265" height="6" fill="#15803d" /> {/* Green grass */}

          {/* ── SUBDUCTING OCEANIC SLAB (MENIKUK MENUNJAM KE MANTEL) ── */}
          {/* Oceanic plate before trench */}
          <polygon points="0,90 190,90 200,105 0,105" fill="#1e293b" />
          {/* Descending oceanic slab into mantle at 45 degree angle */}
          <polygon points="190,90 220,110 360,225 330,240 180,105 0,105" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />

          {/* Accretionary wedge (Baji Akresi - sedimen terkeruk di palung) */}
          <polygon points="190,90 225,90 220,110" fill="#b45309" stroke="#fbbf24" strokeWidth="1" />

          {/* ── ASTHENOSPHERE & CONVECTION CURRENTS (MANTEL) ── */}
          {/* Background mantle glowing orange */}
          <rect x="0" y="105" width="180" height="135" fill="#450a0a" />
          <polygon points="220,110 500,110 500,240 360,225" fill="#500724" />

          {/* Convection Roll Left (Arus Konveksi Astenosfer) */}
          <g transform="translate(90, 165)">
            <circle cx="0" cy="0" r="32" fill="none" stroke="#ea580c" strokeWidth="8" opacity="0.8" />
            <polygon points="-32,-6 -40,10 -24,10" fill="#ef4444" />
            <polygon points="32,6 40,-10 24,-10" fill="#38bdf8" />
            <text x="-28" y="4" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">KONVEKSI</text>
          </g>

          {/* Convection Roll Right */}
          <g transform="translate(420, 175)">
            <circle cx="0" cy="0" r="30" fill="none" stroke="#ea580c" strokeWidth="8" opacity="0.8" />
            <polygon points="30,-6 38,10 22,10" fill="#ef4444" />
            <polygon points="-30,6 -38,-10 -22,-10" fill="#38bdf8" />
            <text x="-28" y="4" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">KONVEKSI</text>
          </g>

          {/* ── DEHYDRATION MELTING & RISING MAGMA DIAPIRS ── */}
          {/* Magma Plumes rising to feed the volcano */}
          <path d="M 280,160 Q 300,100 310,55" fill="none" stroke="#f97316" strokeWidth="5" />
          <circle cx="285" cy="150" r="8" fill="#ea580c" />
          <circle cx="298" cy="105" r="11" fill="#f97316" stroke="#fef08a" strokeWidth="1.5" /> {/* Magma chamber */}
          <circle cx="310" cy="55" r="7" fill="#ef4444" />

          {/* ── WADATI-BENIOFF ZONE (SEISMIC EARTHQUAKE FOCUS DOTS) ── */}
          <circle cx="215" cy="105" r="3" fill="#facc15" stroke="#ef4444" strokeWidth="1" />
          <circle cx="245" cy="125" r="4" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
          <circle cx="275" cy="150" r="3.5" fill="#facc15" stroke="#ef4444" strokeWidth="1" />
          <circle cx="305" cy="175" r="4.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
          <circle cx="335" cy="205" r="4" fill="#ef4444" stroke="#facc15" strokeWidth="1" />

          {/* ── LABELS WITH CRISP RETRO BADGES ── */}
          {/* Deep Sea Trench Label */}
          <g transform="translate(85, 34)">
            <rect x="0" y="0" width="165" height="20" fill="#082f49" rx="4" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="10" y="14" fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">PALUNG LAUT DALAM</text>
          </g>

          {/* Volcanic Arc Label */}
          <g transform="translate(315, 20)">
            <rect x="0" y="0" width="180" height="20" fill="#450a0a" rx="4" stroke="#f97316" strokeWidth="1.5" />
            <text x="10" y="14" fill="#fef08a" fontSize="10" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">BUSUR GUNUNG BERAPI</text>
          </g>

          {/* Subducting Plate Label */}
          <g transform="translate(15, 110)">
            <rect x="0" y="0" width="165" height="20" fill="#0f172a" rx="4" stroke="#64748b" strokeWidth="1.5" />
            <text x="10" y="14" fill="#cbd5e1" fontSize="10" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">LEMPENG MENUNJAM</text>
          </g>

          {/* Wadati-Benioff earthquakes label */}
          <g transform="translate(225, 82)">
            <rect x="0" y="0" width="180" height="18" fill="#7f1d1d" rx="3" stroke="#ef4444" strokeWidth="1.5" />
            <text x="8" y="13" fill="#fef08a" fontSize="9.5" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">FOKUS GEMPA SUBDUKSI</text>
          </g>

          {/* Bottom Asthenosphere Label */}
          <g transform="translate(120, 218)">
            <rect x="0" y="0" width="260" height="18" fill="#1c1917" rx="4" stroke="#fb923c" strokeWidth="1" opacity="0.95" />
            <text x="12" y="13" fill="#fb923c" fontSize="10" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">ARUS KONVEKSI (540°C–1.600°C)</text>
          </g>
        </svg>
      );

    // ══════════════════════════════════════════════════════════════════════════
    // ── 2A. BATAS DIVERGEN: Constructive margins ➔ Midocean ridges ───────────
    // ══════════════════════════════════════════════════════════════════════════
    // ══════════════════════════════════════════════════════════════════════════
    // ── 2A. BATAS DIVERGEN: Constructive margins ➔ Midocean ridges ───────────
    // ══════════════════════════════════════════════════════════════════════════
    case 'divergent':
      return (
        <svg viewBox="0 0 540 240" className="w-full h-full object-contain" shapeRendering="crispEdges">
          <style>{`
            @keyframes divLeftLoop {
              0%, 100% { transform: translateX(0px); }
              50% { transform: translateX(-16px); }
            }
            @keyframes divRightLoop {
              0%, 100% { transform: translateX(0px); }
              50% { transform: translateX(16px); }
            }
            @keyframes divMagmaLoop {
              0%, 100% { opacity: 0.65; transform: scaleY(0.92); }
              50% { opacity: 1; transform: scaleY(1.22); }
            }
            .anim-div-left { animation: divLeftLoop 3.6s ease-in-out infinite; }
            .anim-div-right { animation: divRightLoop 3.6s ease-in-out infinite; }
            .anim-div-magma { animation: divMagmaLoop 3.6s ease-in-out infinite; transform-origin: 255px 185px; }
          `}</style>

          {/* Latar Belakang Kanvas */}
          <rect x="0" y="0" width="540" height="240" fill="#030712" />

          <defs>
            <linearGradient id="divMagmaGlow" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="35%" stopColor="#f97316" />
              <stop offset="70%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
            <linearGradient id="divPlateGreen" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#15803d" />
              <stop offset="50%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#86efac" />
            </linearGradient>
          </defs>

          {/* ── CELAH REKAHAN & ARUS KONVEKSI MAGMA NAIK (MID-OCEAN RIDGE) ── */}
          <g className="anim-div-magma">
            <polygon points="245,118 283,72 303,72 265,118" fill="#180702" />
            <polygon points="245,118 255,128 265,118" fill="#ea580c" />
            {/* Pijar Magma Naik dari Asthenosphere */}
            <path d="M 235,185 C 245,160 250,135 255,116 C 260,135 265,160 275,185 Z" fill="url(#divMagmaGlow)" />
            <ellipse cx="255" cy="180" rx="15" ry="6" fill="#fef08a" />
            <circle cx="255" cy="126" r="4" fill="#ffffff" />
          </g>

          {/* Panah Konveksi Melengkung (Arus Mantel Naik & Memisah) */}
          <path d="M 255,175 Q 255,145 235,140" fill="none" stroke="#fed7aa" strokeWidth="2" />
          <polygon points="230,140 238,136 237,144" fill="#fed7aa" />
          <path d="M 255,175 Q 255,145 275,140" fill="none" stroke="#fed7aa" strokeWidth="2" />
          <polygon points="280,140 272,136 273,144" fill="#fed7aa" />

          {/* ── BALOK KIRI (LEMPENG 1 - BERGERAK KE KIRI MENJAUH DENGAN ANIMASI LOOP) ── */}
          <g className="anim-div-left">
            {/* Sisi Samping Kiri */}
            <polygon points="40,118 78,72 78,132 40,178" fill="#7c2d12" stroke="#431407" strokeWidth="1" />
            <polygon points="40,118 78,72 78,85 40,131" fill="#334155" stroke="#1e293b" strokeWidth="1" />

            {/* Sisi Depan: Asthenosphere */}
            <polygon points="40,131 245,131 245,185 40,185" fill="#c2410c" stroke="#7c2d12" strokeWidth="1" />
            {/* Sisi Depan: Plate Litosfer */}
            <polygon points="40,118 245,118 245,131 40,131" fill="#64748b" stroke="#334155" strokeWidth="1" />

            {/* Permukaan Atas Lempeng Kiri */}
            <polygon points="40,118 78,72 283,72 245,118" fill="url(#divPlateGreen)" stroke="#475569" strokeWidth="1" />
            <line x1="40" y1="118" x2="245" y2="118" stroke="#cbd5e1" strokeWidth="1.5" />
            <line x1="245" y1="118" x2="283" y2="72" stroke="#cbd5e1" strokeWidth="1.5" />

            {/* Panah Merah Rata & Horizontal Menunjuk Lurus ke Kiri (Menjauh) */}
            <g>
              <polygon points="190,88 145,88 145,82 100,95 145,108 145,102 190,102" fill="#7f1d1d" />
              <polygon points="188,89 146,89 146,84 103,95 146,106 146,101 188,101" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
              <polygon points="188,89 146,89 146,84 103,95 146,95" fill="#f87171" opacity="0.65" />
            </g>

            <text x="60" y="127" fill="#f1f5f9" fontSize="8" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontWeight="bold">Plate</text>
          </g>

          {/* ── BALOK KANAN (LEMPENG 2 - BERGERAK KE KANAN MENJAUH DENGAN ANIMASI LOOP) ── */}
          <g className="anim-div-right">
            {/* Sisi Depan: Asthenosphere */}
            <polygon points="265,131 470,131 470,185 265,185" fill="#c2410c" stroke="#7c2d12" strokeWidth="1" />
            {/* Sisi Depan: Plate Litosfer */}
            <polygon points="265,118 470,118 470,131 265,131" fill="#64748b" stroke="#334155" strokeWidth="1" />

            {/* Sisi Samping Kanan */}
            <polygon points="470,131 508,85 508,139 470,185" fill="#9a3412" stroke="#431407" strokeWidth="1" />
            <polygon points="470,118 508,72 508,85 470,131" fill="#475569" stroke="#1e293b" strokeWidth="1" />

            {/* Permukaan Atas Lempeng Kanan */}
            <polygon points="265,118 303,72 508,72 470,118" fill="url(#divPlateGreen)" stroke="#475569" strokeWidth="1" />
            <line x1="265" y1="118" x2="470" y2="118" stroke="#cbd5e1" strokeWidth="1.5" />
            <line x1="265" y1="118" x2="303" y2="72" stroke="#cbd5e1" strokeWidth="1.5" />

            {/* Panah Merah Rata & Horizontal Menunjuk Lurus ke Kanan (Menjauh) */}
            <g>
              <polygon points="320,88 365,88 365,82 410,95 365,108 365,102 320,102" fill="#7f1d1d" />
              <polygon points="322,89 364,89 364,84 407,95 364,106 364,101 322,101" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
              <polygon points="322,89 364,89 364,84 407,95 364,95" fill="#f87171" opacity="0.65" />
            </g>

            <text x="430" y="127" fill="#f1f5f9" fontSize="8" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontWeight="bold">Plate</text>
          </g>

          {/* ── LABEL TEKS RESMI SESUAI DIAGRAM ── */}
          <text x="210" y="165" fill="#fed7aa" fontSize="9" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontWeight="bold">Asthenosphere</text>

        </svg>
      );

    // ══════════════════════════════════════════════════════════════════════════
    // ── 2B. BATAS KONVERGEN: Destructive margins ➔ Subduction zones ──────────
    // ══════════════════════════════════════════════════════════════════════════
    // ══════════════════════════════════════════════════════════════════════════
    // ── 2B. BATAS KONVERGEN: Destructive margins ➔ Subduction zones ──────────
    // ══════════════════════════════════════════════════════════════════════════
    case 'convergent':
      return (
        <svg viewBox="0 0 540 240" className="w-full h-full object-contain" shapeRendering="crispEdges">
          <style>{`
            @keyframes convOceanicLoop {
              0%, 100% { transform: translateX(0px); }
              50% { transform: translateX(12px); }
            }
            @keyframes convContinentalTremor {
              0%, 100% { transform: translateX(0px); }
              50% { transform: translateX(-3px); }
            }
            @keyframes convMeltPulse {
              0%, 100% { opacity: 0.6; transform: scale(0.92); }
              50% { opacity: 1; transform: scale(1.22); }
            }
            .anim-conv-oceanic { animation: convOceanicLoop 3.6s ease-in-out infinite; }
            .anim-conv-continental { animation: convContinentalTremor 3.6s ease-in-out infinite; }
            .anim-conv-magma { animation: convMeltPulse 3.6s ease-in-out infinite; transform-origin: 295px 175px; }
          `}</style>

          {/* Latar Belakang Kanvas */}
          <rect x="0" y="0" width="540" height="240" fill="#030712" />


          <defs>
            <linearGradient id="convPlateGreen" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#15803d" />
              <stop offset="50%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#86efac" />
            </linearGradient>
            <linearGradient id="subductionMelt" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="70%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#fef08a" />
            </linearGradient>
          </defs>

          {/* ── DASAR ASTHENOSPHERE (MANTEL BAWAH STATIS DI SEKITAR ZONA PELEBURAN) ── */}
          <polygon points="220,131 470,131 470,185 220,185" fill="#c2410c" stroke="#7c2d12" strokeWidth="1" />

          {/* ── LEMPENG BENUA KANAN (OVERRIDING PLATE - DIRENDER PERTAMA) ── */}
          <g className="anim-conv-continental">
            <polygon points="220,118 470,118 470,131 220,131" fill="#64748b" stroke="#334155" strokeWidth="1" />
            <polygon points="220,131 470,131 470,185 220,185" fill="#c2410c" stroke="#7c2d12" strokeWidth="1" />
            <polygon points="470,118 508,72 508,85 470,131" fill="#475569" stroke="#1e293b" strokeWidth="1" />
            <polygon points="470,131 508,85 508,139 470,185" fill="#9a3412" stroke="#431407" strokeWidth="1" />
            <polygon points="220,118 258,72 508,72 470,118" fill="url(#convPlateGreen)" stroke="#475569" strokeWidth="1" />

            {/* Panah Merah Rata & Horizontal Menunjuk Lurus ke Kiri (Bertabrakan) */}
            <g>
              <polygon points="400,88 355,88 355,82 310,95 355,108 355,102 400,102" fill="#7f1d1d" />
              <polygon points="398,89 356,89 356,84 313,95 356,106 356,101 398,101" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
              <polygon points="398,89 356,89 356,84 313,95 356,95" fill="#f87171" opacity="0.65" />
            </g>

            <text x="430" y="127" fill="#f1f5f9" fontSize="8" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontWeight="bold">Plate</text>
          </g>

          {/* ── LEMPENG MENUNJAM KIRI (SUBDUCTING SLAB SAMUDRA - Z-INDEX LEBIH TINGGI DI ATAS KANAN) ── */}
          <g className="anim-conv-oceanic">
            {/* Dasar Astenosfer yang Mengikuti Lempeng Samudra */}
            <polygon points="-25,131 220,131 245,145 285,185 -25,185" fill="#c2410c" />

            {/* Lidah Lempeng Menunjam ke Bawah (Subducting Slab Diapir) */}
            <path
              d="M -25,118 L 220,118 Q 240,120 270,150 L 305,185 L 285,185 Q 245,145 220,131 L -25,131 Z"
              fill="url(#subductionMelt)"
              stroke="#334155"
              strokeWidth="1"
            />

            {/* Permukaan Atas Lempeng Samudra Hijau */}
            <polygon points="-25,118 13,72 258,72 220,118" fill="url(#convPlateGreen)" stroke="#475569" strokeWidth="1" />

            {/* Garis Palung Laut Dalam (Subduction Trench Seam) - Ikut Bergerak Menempel pada Slab */}
            <line x1="220" y1="118" x2="258" y2="72" stroke="#0284c7" strokeWidth="2.5" />

            {/* Panah Merah Rata & Horizontal Menunjuk Lurus ke Kanan (Bertabrakan) */}
            <g>
              <polygon points="110,88 155,88 155,82 200,95 155,108 155,102 110,102" fill="#7f1d1d" />
              <polygon points="112,89 154,89 154,84 197,95 154,106 154,101 112,101" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
              <polygon points="112,89 154,89 154,84 197,95 154,95" fill="#f87171" opacity="0.65" />
            </g>

            <text x="60" y="127" fill="#f1f5f9" fontSize="8" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontWeight="bold">Plate</text>
          </g>

          {/* Pijar Peleburan Magma di Mantel (Melting Zone) */}
          <g className="anim-conv-magma">
            <circle cx="295" cy="175" r="9" fill="#f97316" opacity="0.85" />
            <circle cx="295" cy="175" r="4.5" fill="#fef08a" />
          </g>

          {/* ── LABEL TEKS RESMI SESUAI DIAGRAM ── */}
          <text x="210" y="172" fill="#fed7aa" fontSize="9" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontWeight="bold">Asthenosphere</text>
        </svg>
      );

    // ══════════════════════════════════════════════════════════════════════════
    // ── 2C. BATAS TRANSFORM: Conservative margins ➔ Transform faults ─────────
    // ══════════════════════════════════════════════════════════════════════════
    case 'transform':
      return (
        <svg viewBox="0 0 540 240" className="w-full h-full object-contain" shapeRendering="crispEdges">
          <style>{`
            @keyframes transLeftSlide {
              0%, 100% { transform: translate(0px, 0px); }
              50% { transform: translate(-10px, 12px); }
            }
            @keyframes transRightSlide {
              0%, 100% { transform: translate(0px, 0px); }
              50% { transform: translate(10px, -12px); }
            }
            .anim-trans-left { animation: transLeftSlide 3.4s ease-in-out infinite; }
            .anim-trans-right { animation: transRightSlide 3.4s ease-in-out infinite; }
          `}</style>

          {/* Latar Belakang Kanvas */}
          <rect x="0" y="0" width="540" height="240" fill="#030712" />


          <defs>
            <linearGradient id="transPlateGreen" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#15803d" />
              <stop offset="50%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#86efac" />
            </linearGradient>
          </defs>

          {/* ── BALOK KIRI (BERGESER MAJU/KE BAWAH DI SEPANJANG BIDANG SESAR - TANPA ARTIFAK BELAKANG) ── */}
          <g className="anim-trans-left">
            {/* Sisi Samping Kiri (Lithosphere & Asthenosphere) */}
            <polygon points="40,118 78,72 78,85 40,131" fill="#475569" stroke="#1e293b" strokeWidth="1" />
            <polygon points="40,131 78,85 78,139 40,185" fill="#7c2d12" stroke="#431407" strokeWidth="1" />

            {/* Sisi Depan Balok Kiri (Lithosphere & Asthenosphere) */}
            <polygon points="40,118 245,118 245,131 40,131" fill="#64748b" stroke="#334155" strokeWidth="1" />
            <polygon points="40,131 245,131 245,185 40,185" fill="#c2410c" stroke="#7c2d12" strokeWidth="1" />

            {/* Permukaan Atas Lempeng Kiri */}
            <polygon points="40,118 78,72 283,72 245,118" fill="url(#transPlateGreen)" stroke="#475569" strokeWidth="1" />
            <line x1="40" y1="118" x2="245" y2="118" stroke="#cbd5e1" strokeWidth="1.5" />

            {/* Sisi Sesar Geser (Bidang Patahan yang Bergerak Bersama Balok Kiri) */}
            <polygon points="245,118 283,72 283,185 245,185" fill="#2d150b" stroke="#1c0a02" strokeWidth="1" />
            {/* Guratan Sesar Mendatar (Horizontal Striations) */}
            <line x1="247" y1="126" x2="280" y2="82" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="247" y1="148" x2="280" y2="104" stroke="#fed7aa" strokeWidth="1" />

            {/* Panah Merah Menunjuk MAJU / KE BAWAH searah pergeseran sesar transform */}
            <g>
              <polygon points="175,76 182,82 142,118 135,112" fill="#7f1d1d" />
              <polygon points="174,78 180,83 143,116 137,111" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
              <polygon points="152,126 122,126 130,98" fill="#7f1d1d" />
              <polygon points="150,124 125,124 132,101" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
              <polygon points="132,101 125,124 138,124" fill="#f87171" opacity="0.65" />
            </g>

            <text x="60" y="127" fill="#f1f5f9" fontSize="8" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontWeight="bold">Plate</text>
          </g>

          {/* ── BALOK KANAN (BERGESER MUNDUR/KE ATAS DI SEPANJANG BIDANG SESAR - TANPA ARTIFAK BELAKANG) ── */}
          <g className="anim-trans-right">
            {/* Sisi Sesar Kiri Balok Kanan (Terbuka saat Balok Mundur) */}
            <polygon points="245,118 283,72 283,185 245,185" fill="#1c0f08" stroke="#1c0a02" strokeWidth="1" />

            {/* Sisi Depan Balok Kanan (Lithosphere & Asthenosphere) */}
            <polygon points="245,118 470,118 470,131 245,131" fill="#64748b" stroke="#334155" strokeWidth="1" />
            <polygon points="245,131 470,131 470,185 245,185" fill="#c2410c" stroke="#7c2d12" strokeWidth="1" />

            {/* Sisi Samping Kanan (Lithosphere & Asthenosphere) */}
            <polygon points="470,118 508,72 508,85 470,131" fill="#475569" stroke="#1e293b" strokeWidth="1" />
            <polygon points="470,131 508,85 508,139 470,185" fill="#9a3412" stroke="#431407" strokeWidth="1" />

            {/* Permukaan Atas Lempeng Kanan */}
            <polygon points="245,118 283,72 508,72 470,118" fill="url(#transPlateGreen)" stroke="#475569" strokeWidth="1" />
            <line x1="245" y1="118" x2="470" y2="118" stroke="#cbd5e1" strokeWidth="1.5" />
            <line x1="245" y1="118" x2="283" y2="72" stroke="#cbd5e1" strokeWidth="1.5" />

            {/* Panah Merah Menunjuk MUNDUR / KE ATAS searah pergeseran sesar transform */}
            <g>
              <polygon points="345,114 338,108 378,72 385,78" fill="#7f1d1d" />
              <polygon points="346,112 340,107 377,74 383,79" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
              <polygon points="368,64 398,64 390,92" fill="#7f1d1d" />
              <polygon points="370,66 395,66 388,89" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
              <polygon points="388,89 395,66 382,66" fill="#f87171" opacity="0.65" />
            </g>

            <text x="430" y="127" fill="#f1f5f9" fontSize="8" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontWeight="bold">Plate</text>
          </g>

          {/* ── LABEL TEKS RESMI SESUAI DIAGRAM ── */}
          <text x="210" y="172" fill="#fed7aa" fontSize="9" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontWeight="bold">Asthenosphere</text>

        </svg>
      );

    // ══════════════════════════════════════════════════════════════════════════
    // ── 3A. ARUS KONVEKSI PANAS MANTEL BUMI (TERMAL 1.000°C - 3.700°C & 20 LEMPENG) ──
    // ══════════════════════════════════════════════════════════════════════════
    case 'mantle-convection':
      return <MantleConvectionIllustration />;

    // ══════════════════════════════════════════════════════════════════════════
    // ── 3B. BATUAN BRIDGMANITE & TEKANAN EKSTREM (860 KM DEPTH, SILIKAT PADAT SEPERTI BETON) ──
    // ══════════════════════════════════════════════════════════════════════════
    case 'bridgmanite':
      return (
        <svg viewBox="0 0 540 240" className="w-full h-full object-contain" shapeRendering="crispEdges">
          <style>{`
            @keyframes crystalPulse {
              0%, 100% { opacity: 0.85; filter: drop-shadow(0 0 4px #f97316); }
              50% { opacity: 1; filter: drop-shadow(0 0 12px #fef08a); }
            }
            @keyframes pressurePush {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(0.97); }
            }
            .anim-crystal-glow { animation: crystalPulse 3.2s ease-in-out infinite; }
            .anim-pressure-box { animation: pressurePush 2.8s ease-in-out infinite; transform-origin: 270px 120px; }
          `}</style>

          {/* Kanvas Latar Belakang Gelap Total Mantel Bawah */}
          <rect x="0" y="0" width="540" height="240" fill="#0c0403" />

          <defs>
            <linearGradient id="bridgmaniteFaceA" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7c2d12" />
              <stop offset="50%" stopColor="#991b1b" />
              <stop offset="100%" stopColor="#450a0a" />
            </linearGradient>
            <linearGradient id="bridgmaniteFaceTop" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="bridgmaniteFacetGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ea580c" />
              <stop offset="50%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>

          {/* Rekahan Fissure Dinding Mantel dengan Urat Lava Magma Membara */}
          <path d="M 0,35 Q 80,45 150,20 Q 220,5 280,30 Q 360,15 540,40" stroke="#7f1d1d" strokeWidth="8" fill="none" />
          <path d="M 0,35 Q 80,45 150,20 Q 220,5 280,30 Q 360,15 540,40" stroke="#ea580c" strokeWidth="2" fill="none" />
          <path d="M 0,205 Q 120,195 240,215 Q 360,200 540,210" stroke="#7f1d1d" strokeWidth="10" fill="none" />
          <path d="M 0,205 Q 120,195 240,215 Q 360,200 540,210" stroke="#f97316" strokeWidth="3" fill="none" />

          {/* ══════════════════════════════════════════════════════════════════════════
              PUSAT: MONOLIT KRISTAL BRIDGMANITE KUBIK (STRUKTUR PEROVSKITE PADAT SEPERTI BETON)
              ══════════════════════════════════════════════════════════════════════════ */}
          <g className="anim-pressure-box">
            {/* Monolit Kubus Bridgmanite Besar di Tengah */}
            <g className="anim-crystal-glow" transform="translate(200, 60)">
              {/* Sisi Atas Kubus (Isometric Top Face) */}
              <polygon points="70,0 140,28 70,56 0,28" fill="url(#bridgmaniteFaceTop)" stroke="#fef08a" strokeWidth="1.5" />

              {/* Sisi Depan Kiri Kubus */}
              <polygon points="0,28 70,56 70,126 0,98" fill="url(#bridgmaniteFaceA)" stroke="#f97316" strokeWidth="1" />

              {/* Sisi Depan Kanan Kubus */}
              <polygon points="70,56 140,28 140,98 70,126" fill="#450a0a" stroke="#ea580c" strokeWidth="1" />

              {/* Urat Fissure Silikat Bercahaya Emas di Muka Kubus */}
              <line x1="20" y1="42" x2="55" y2="92" stroke="#fef08a" strokeWidth="2" />
              <line x1="55" y1="92" x2="68" y2="120" stroke="#f97316" strokeWidth="1.5" />
              <line x1="85" y1="48" x2="120" y2="82" stroke="#fef08a" strokeWidth="2" />

              {/* Balok Kubik Pendamping Kiri (Ferropericlase) */}
              <polygon points="-30,60 10,45 10,75 -30,90" fill="#290b06" stroke="#c2410c" strokeWidth="1" />
              <polygon points="-30,60 10,45 25,32 -15,47" fill="#78350f" />

              {/* Balok Kubik Pendamping Kanan */}
              <polygon points="130,75 170,60 170,95 130,110" fill="#3f1207" stroke="#ea580c" strokeWidth="1" />
              <polygon points="130,75 170,60 155,48 115,63" fill="#92400e" />

              {/* Label Formula Kimia di Kubus */}
              <rect x="15" y="62" width="110" height="26" rx="4" fill="#1c0a02" stroke="#facc15" strokeWidth="2" />
              <text x="70" y="80" fill="#fef08a" fontSize="9.5" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">(Mg,Fe)SiO3</text>
            </g>
          </g>

          {/* ══════════════════════════════════════════════════════════════════════════
              VEKTOR TEKANAN EKSTREM: HIMPITAN JUTAAN ATMOSFER DARI SEGALA ARAH
              ══════════════════════════════════════════════════════════════════════════ */}
          {/* Tekanan dari Atas (Beban Seluruh Lapisan Bumi di Atasnya) */}
          <g>
            <line x1="270" y1="12" x2="270" y2="44" stroke="#ef4444" strokeWidth="4" />
            <polygon points="270,54 262,40 278,40" fill="#ef4444" />
            <line x1="220" y1="18" x2="220" y2="44" stroke="#f97316" strokeWidth="3" />
            <polygon points="220,52 214,40 226,40" fill="#f97316" />
            <line x1="320" y1="18" x2="320" y2="44" stroke="#f97316" strokeWidth="3" />
            <polygon points="320,52 314,40 326,40" fill="#f97316" />
          </g>

          {/* Tekanan dari Bawah */}
          <g>
            <line x1="270" y1="228" x2="270" y2="198" stroke="#ef4444" strokeWidth="4" />
            <polygon points="270,188 262,202 278,202" fill="#ef4444" />
          </g>

          {/* Tekanan dari Kiri */}
          <g>
            <line x1="80" y1="120" x2="135" y2="120" stroke="#ef4444" strokeWidth="4" />
            <polygon points="147,120 133,112 133,128" fill="#ef4444" />
          </g>

          {/* Tekanan dari Kanan */}
          <g>
            <line x1="460" y1="120" x2="405" y2="120" stroke="#ef4444" strokeWidth="4" />
            <polygon points="393,120 407,112 407,128" fill="#ef4444" />
          </g>

        </svg>
      );

    // ── 3. MANTEL BUMI (660 - 2.900 KM / 1.800 MIL) ────────────────────────────
    // Lapisan tertebal: Batuan padat kental, Mantle Plume termal raksasa, dan batas D''
    case 'deep-mantle':
      return (
        <svg viewBox="0 0 500 240" className="w-full h-full object-contain" shapeRendering="crispEdges">
          {/* Deep mantle background gradient */}
          <rect x="0" y="0" width="500" height="240" fill="#450a0a" />

          {/* Top Discontinuity Line (660 km Boundary) */}
          <rect x="0" y="0" width="500" height="24" fill="#78350f" />
          <line x1="0" y1="24" x2="500" y2="24" stroke="#f59e0b" strokeWidth="2" />
          <text x="15" y="16" fill="#fef08a" fontSize="8" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">BATAS MANTEL ATAS (660 KM DISKONTINUITAS)</text>

          {/* High-Pressure Mineral Matrix (Peridotit / Bridgmanit & Perovscite) */}
          {Array.from({ length: 5 }).map((_, r) => (
            <line
              key={r}
              x1="0"
              y1={45 + r * 30}
              x2="500"
              y2={45 + r * 30}
              stroke="#7f1d1d"
              strokeWidth="2"
              opacity="0.6"
            />
          ))}


          {/* ── GIANT THERMAL MANTLE PLUME (PIPA MAGMA TERMAL HOTSPOT) ── */}
          {/* Plume conduit from Core-Mantle Boundary (D'' Layer) */}
          <path
            d="M 280,210 Q 275,140 250,90 Q 220,50 250,30 Q 280,50 310,90 Q 295,140 300,210 Z"
            fill="#ea580c"
            opacity="0.9"
            stroke="#fbbf24"
            strokeWidth="1.5"
          />
          {/* Mushroom plume head */}
          <ellipse cx="270" cy="50" rx="38" ry="18" fill="#f97316" stroke="#fef08a" strokeWidth="2" />
          <ellipse cx="270" cy="50" rx="20" ry="10" fill="#ef4444" />
          <circle cx="270" cy="50" r="5" fill="#ffffff" />
          {/* Convective arrows inside plume */}
          <polygon points="270,140 264,152 276,152" fill="#fef08a" />
          <polygon points="270,95 264,107 276,107" fill="#ffffff" />

          {/* Core-Mantle Boundary (D'' Layer / Lapisan D'') at bottom */}
          <rect x="0" y="200" width="500" height="40" fill="#7c2d12" />
          <rect x="0" y="215" width="500" height="25" fill="#d97706" />
          <line x1="0" y1="200" x2="500" y2="200" stroke="#f59e0b" strokeWidth="2" />
          <line x1="0" y1="215" x2="500" y2="215" stroke="#ffffff" strokeWidth="1.5" />

          {/* ── LABELS WITH RETRO PIXEL BACKINGS ── */}
          <g transform="translate(15, 56)">
            <rect x="0" y="0" width="195" height="20" fill="#450a0a" rx="4" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="8" y="14" fill="#fef08a" fontSize="10.5" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">TEBAL: 2.900 KM (TERTEBAL!)</text>
          </g>

          <g transform="translate(15, 84)">
            <text x="0" y="0" fill="#fed7aa" fontSize="10.5" fontWeight="500" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">Batuan padat mengalir kental (arus konveksi lambat)</text>
          </g>

          <g transform="translate(305, 42)">
            <rect x="0" y="0" width="185" height="20" fill="#7c2d12" rx="4" stroke="#fbbf24" strokeWidth="1.5" />
            <text x="8" y="14" fill="#fef08a" fontSize="10" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">MANTLE PLUME (HOTSPOT)</text>
          </g>
          <g transform="translate(305, 70)">
            <text x="0" y="0" fill="#fed7aa" fontSize="10" fontWeight="500" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">Pipa panas dari batas inti bumi</text>
          </g>

          {/* CMB Bottom Label */}
          <g transform="translate(100, 226)">
            <rect x="-10" y="-13" width="320" height="18" fill="#fef08a" rx="3" />
            <text x="150" y="0" fill="#1c1917" fontSize="10" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">BATAS INTI-MANTEL (D&apos;&apos;) • ~3.700°C / 136 GPa</text>
          </g>
        </svg>
      );


    // ══════════════════════════════════════════════════════════════════════════
    // ── 4A. INTI LUAR — LAUTAN LOGAM CAIR MELELEH (SUHU 5.000°C JAUH DI ATAS TITIK LEBUR) ──
    // ══════════════════════════════════════════════════════════════════════════
    case 'molten-metal':
      return (
        <svg viewBox="0 0 540 240" className="w-full h-full object-contain" shapeRendering="crispEdges">
          <style>{`
            @keyframes moltenWave {
              0%, 100% { transform: translateX(0px); }
              50% { transform: translateX(-10px); }
            }
            @keyframes sparkRise {
              0% { transform: translateY(0px) scale(1); opacity: 0.9; }
              100% { transform: translateY(-26px) scale(0.3); opacity: 0; }
            }
            @keyframes heatPulse {
              0%, 100% { opacity: 0.8; }
              50% { opacity: 1; }
            }
            @keyframes spinVortexCW {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes spinVortexCCW {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(-360deg); }
            }
            @keyframes streamCycle {
              0% { stroke-dashoffset: 60; }
              100% { stroke-dashoffset: 0; }
            }
            @keyframes plumeGlow {
              0%, 100% { opacity: 0.7; }
              50% { opacity: 1; }
            }
            @keyframes eyePulse {
              0%, 100% { transform: scale(0.88); opacity: 0.75; }
              50% { transform: scale(1.18); opacity: 1; }
            }
            .anim-molten-wave { animation: moltenWave 4s ease-in-out infinite; }
            .anim-spark-1 { animation: sparkRise 1.8s linear infinite; }
            .anim-spark-2 { animation: sparkRise 2.3s linear infinite 0.7s; }
            .anim-heat-glow { animation: heatPulse 2.5s ease-in-out infinite; }
            .anim-spin-cw { animation: spinVortexCW 4s linear infinite; transform-origin: 0px 0px; }
            .anim-spin-ccw { animation: spinVortexCCW 4s linear infinite; transform-origin: 0px 0px; }
            .anim-stream-cycle { animation: streamCycle 2.4s linear infinite; }
            .anim-plume-glow { animation: plumeGlow 2s ease-in-out infinite; }
            .anim-eye-pulse { animation: eyePulse 1.6s ease-in-out infinite; transform-origin: 0px 0px; }
          `}</style>

          {/* Latar Belakang Suhu Ekstrem Ruang Inti */}
          <rect x="0" y="0" width="540" height="240" fill="#0c0201" />

          <defs>
            {/* ClipPath ketat agar lava dan seluruh aliran TIDAK AKAN PERNAH bocor keluar kotak kanan */}
            <clipPath id="samudraClip">
              <rect x="2" y="22" width="292" height="196" rx="2" />
            </clipPath>

            <linearGradient id="moltenCoreGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="10%" stopColor="#fef08a" />
              <stop offset="35%" stopColor="#f59e0b" />
              <stop offset="70%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#7c1d06" />
            </linearGradient>
            <linearGradient id="thermometerGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="30%" stopColor="#facc15" />
              <stop offset="60%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <linearGradient id="upwellingGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
          </defs>

          {/* ══════════════════════════════════════════════════════════════════════════
              PANEL KIRI: KOMPARASI SKALA TERMAL & TITIK LELEH LOGAM BESI (Fe) & NIKEL (Ni)
              ══════════════════════════════════════════════════════════════════════════ */}
          <g id="panel-termal-kiri" transform="translate(14, 10)">
            {/* Bingkai Panel Termal */}
            <rect x="0" y="0" width="205" height="220" rx="4" fill="#180603" stroke="#f97316" strokeWidth="1.5" />
            <rect x="0" y="0" width="205" height="24" rx="4" fill="#450a0a" />
            <text x="102" y="16" fill="#fef08a" fontSize="11" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">SKALA TITIK LELEH</text>

            {/* Kolom Termometer Digital Retro */}
            <rect x="18" y="32" width="14" height="170" rx="4" fill="#080201" stroke="#451a03" strokeWidth="1" />
            {/* Air Raksa / Indikator Panas Termometer */}
            <rect x="20" y="34" width="10" height="166" rx="2" fill="url(#thermometerGrad)" />

            {/* Garis Penanda 1: Titik Leleh Nikel (Ni) -> 1.455°C */}
            <line x1="12" y1="148" x2="38" y2="148" stroke="#38bdf8" strokeWidth="2" />
            <rect x="42" y="137" width="154" height="23" rx="3" fill="#0c1d33" stroke="#38bdf8" strokeWidth="1" />
            <text x="47" y="148" fill="#7dd3fc" fontSize="9" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">LELEH NIKEL (Ni)</text>
            <text x="47" y="157" fill="#bae6fd" fontSize="8.5" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">1.455°C (TITIK LELEH)</text>

            {/* Garis Penanda 2: Titik Leleh Besi (Fe) -> 1.538°C */}
            <line x1="12" y1="116" x2="38" y2="116" stroke="#fbbf24" strokeWidth="2" />
            <rect x="42" y="105" width="154" height="23" rx="3" fill="#2e1403" stroke="#fbbf24" strokeWidth="1" />
            <text x="47" y="116" fill="#fde047" fontSize="9" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">LELEH BESI (Fe)</text>
            <text x="47" y="125" fill="#fed7aa" fontSize="8.5" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">1.538°C (TITIK LELEH)</text>

            {/* Garis Penanda 3: SUHU INTI LUAR -> ~5.000°C */}
            <line x1="12" y1="42" x2="38" y2="42" stroke="#ef4444" strokeWidth="3" />
            <rect x="42" y="31" width="154" height="28" rx="4" fill="#450a0a" stroke="#ef4444" strokeWidth="1.5" className="anim-heat-glow" />
            <text x="47" y="44" fill="#fca5a5" fontSize="10" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">INTI LUAR: ~5.000°C</text>
            <text x="47" y="56" fill="#ffffff" fontSize="8.5" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">(MELELEH JADI CAIRAN!)</text>

            {/* Indikator Panah Lampaui Titik Leleh */}
            <path d="M 120,64 L 120,100" stroke="#f87171" strokeWidth="2" />
            <polygon points="120,62 116,68 124,68" fill="#ef4444" />
            <text x="120" y="84" fill="#fca5a5" fontSize="8.5" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">JAUH MELAMPAUI</text>
            <text x="120" y="94" fill="#fef08a" fontSize="8.5" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">TITIK LEBUR LOGAM</text>

            {/* Rangkuman Kesimpulan Bawah */}
            <rect x="8" y="172" width="189" height="40" rx="4" fill="#080201" stroke="#f97316" strokeWidth="1" />
            <text x="102" y="185" fill="#fef08a" fontSize="9.5" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">BUKAN BATUAN PADAT!</text>
            <text x="102" y="197" fill="#fed7aa" fontSize="8.5" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">LOGAM BESI &amp; NIKEL CAIR</text>
            <text x="102" y="207" fill="#fca5a5" fontSize="8.5" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">MELELEH SECARA TOTAL</text>
          </g>

          {/* ══════════════════════════════════════════════════════════════════════════
              PANEL KANAN: SAMUDRA LOGAM CAIR & PUSARAN KONVEKSI REALISTIK TERMAL
              ══════════════════════════════════════════════════════════════════════════ */}
          <g id="panel-samudra-kanan" transform="translate(230, 10)">
            {/* Bingkai Panel Samudra Luar */}
            <rect x="0" y="0" width="296" height="220" rx="4" fill="#150503" stroke="#f59e0b" strokeWidth="1.5" />

            {/* SEMUA KONTEN DI DALAMNYA DIBATASI OLEH CLIP-PATH AGAR TIDAK LEWAT DARI KOTAK */}
            <g clipPath="url(#samudraClip)">
              {/* 1. Langit Ruang Atap Inti (Atmosfer Gas & Kabut Termal) */}
              <rect x="0" y="22" width="296" height="66" fill="#180503" />

              {/* Partikel Percikan Logam Melayang ke Atas */}
              <g className="anim-spark-1">
                <rect x="55" y="65" width="2.5" height="2.5" fill="#ffffff" />
                <rect x="145" y="50" width="2" height="2" fill="#fef08a" />
                <rect x="235" y="62" width="2.5" height="2.5" fill="#67e8f9" />
              </g>
              <g className="anim-spark-2">
                <rect x="85" y="60" width="2" height="2" fill="#fef08a" />
                <rect x="155" y="44" width="2.5" height="2.5" fill="#ffffff" />
                <rect x="205" y="58" width="2" height="2" fill="#38bdf8" />
              </g>

              {/* 2. Samudra Besi-Nikel Cair Meleleh (Mulai dari y=84 ke dasar y=188) */}
              <g className="anim-molten-wave">
                <path
                  d="M -20,84 C 30,78 80,90 130,81 C 180,74 230,88 280,80 C 310,74 330,84 350,81 L 350,188 L -20,188 Z"
                  fill="url(#moltenCoreGrad)"
                  opacity="0.88"
                />
                <path
                  d="M -20,84 C 30,78 80,90 130,81 C 180,74 230,88 280,80 C 310,74 330,84 350,81"
                  stroke="#ffffff"
                  strokeWidth="2"
                  fill="none"
                />
              </g>


              {/* 4. JET ARUS TERMAL NAIK DI TENGAH (CENTRAL UPWELLING PLUME) */}
              {/* Kolom Panas Naik dari Dasar Inti Menuju Kerak */}
              <path d="M 148,186 L 148,82" stroke="url(#upwellingGrad)" strokeWidth="16" opacity="0.45" className="anim-plume-glow" />
              <path d="M 148,186 L 148,82" stroke="#ffffff" strokeWidth="6" opacity="0.65" className="anim-plume-glow" />
              {/* Garis Aliran Vektor Naik Berpendar Animasi */}
              <line x1="148" y1="184" x2="148" y2="84" stroke="#ffffff" strokeWidth="2.5" className="anim-stream-cycle" />
              <polygon points="148,78 142,88 154,88" fill="#ffffff" />
              <polygon points="148,126 143,134 153,134" fill="#fef08a" />
              <polygon points="148,162 144,170 152,170" fill="#fef08a" />

              {/* 5. ARUS STREAMLINE SIRKULASI LENGKUNG BERPUTAR (ANIMATED CONVECTION STREAMLINES) */}
              {/* Sirkulasi Sel Kiri (Berlawanan Jarum Jam / CCW) */}
              <path
                d="M 144,180 C 144,110 120,94 80,94 C 36,94 22,118 22,138 C 22,160 36,180 80,180 C 110,180 134,180 144,180 Z"
                fill="none"
                stroke="#fef08a"
                strokeWidth="2"
                className="anim-stream-cycle"
                opacity="0.9"
              />
              {/* Sirkulasi Sel Kanan (Searah Jarum Jam / CW) */}
              <path
                d="M 152,180 C 152,110 176,94 216,94 C 260,94 274,118 274,138 C 274,160 260,180 216,180 C 186,180 162,180 152,180 Z"
                fill="none"
                stroke="#fef08a"
                strokeWidth="2"
                className="anim-stream-cycle"
                opacity="0.9"
              />



              {/* 6. INTI PUSARAN SPIRAL MULTI-ARM BERPUTAR REALISTIK (CYCLONIC SPIRAL ARMS) */}
              {/* PUSARAN KIRI (Counter-Clockwise Vortex) */}
              <g transform="translate(78, 137)">
                {/* Lengan-lengan Spiral Fluida Logam Berputar CCW */}
                <g className="anim-spin-ccw">
                  {/* Lengan 1 - Putih Bersinar */}
                  <path d="M 0,0 Q 14,8 24,0 Q 32,-14 20,-26 Q 4,-34 -16,-28 Q -34,-18 -36,6 Q -34,30 -6,34" fill="none" stroke="#ffffff" strokeWidth="2.5" opacity="0.9" />
                  {/* Lengan 2 - Kuning Emas (Rotasi 120 deg) */}
                  <path d="M 0,0 Q -14,-8 -24,0 Q -32,14 -20,26 Q -4,34 16,28 Q 34,18 36,-6 Q 34,-30 6,-34" fill="none" stroke="#fef08a" strokeWidth="2.2" opacity="0.85" />
                  {/* Lengan 3 - Jingga Termal (Rotasi 240 deg) */}
                  <path d="M 0,0 Q -8,14 0,24 Q 14,32 26,20 Q 34,4 28,-16 Q 18,-34 -6,-36 Q -30,-34 -34,-6" fill="none" stroke="#f97316" strokeWidth="2" opacity="0.75" />
                  {/* Cincin Elektromagnetik */}
                  <circle cx="0" cy="0" r="30" fill="none" stroke="#fef08a" strokeWidth="1.2" opacity="0.7" />
                  {/* Partikel Listrik Statis Berputar */}
                  <circle cx="20" cy="-18" r="1.5" fill="#67e8f9" />
                  <circle cx="-22" cy="12" r="1.5" fill="#ffffff" />
                </g>

                {/* Mata Inti Pusaran Berdenyut Panas */}
                <circle cx="0" cy="0" r="6" fill="#ffffff" className="anim-eye-pulse" />
                <circle cx="0" cy="0" r="11" fill="none" stroke="#fef08a" strokeWidth="1.5" className="anim-eye-pulse" />

              </g>

              {/* PUSARAN KANAN (Clockwise Vortex) */}
              <g transform="translate(218, 137)">
                {/* Lengan-lengan Spiral Fluida Logam Berputar CW */}
                <g className="anim-spin-cw">
                  {/* Lengan 1 - Putih Bersinar */}
                  <path d="M 0,0 Q -14,8 -24,0 Q -32,-14 -20,-26 Q -4,-34 16,-28 Q 34,-18 36,6 Q 34,30 6,34" fill="none" stroke="#ffffff" strokeWidth="2.5" opacity="0.9" />
                  {/* Lengan 2 - Kuning Emas (Rotasi 120 deg) */}
                  <path d="M 0,0 Q 14,-8 24,0 Q 32,14 20,26 Q 4,34 -16,28 Q -34,18 -36,-6 Q -34,-30 -6,-34" fill="none" stroke="#fef08a" strokeWidth="2.2" opacity="0.85" />
                  {/* Lengan 3 - Jingga Termal (Rotasi 240 deg) */}
                  <path d="M 0,0 Q 8,14 0,24 Q -14,32 -26,20 Q -34,4 -28,-16 Q -18,-34 6,-36 Q 30,-34 34,-6" fill="none" stroke="#f97316" strokeWidth="2" opacity="0.75" />
                  {/* Cincin Elektromagnetik */}
                  <circle cx="0" cy="0" r="30" fill="none" stroke="#fef08a" strokeWidth="1.2" opacity="0.7" />
                  {/* Partikel Listrik Statis Berputar */}
                  <circle cx="-20" cy="-18" r="1.5" fill="#67e8f9" />
                  <circle cx="22" cy="12" r="1.5" fill="#ffffff" />
                </g>

                {/* Mata Inti Pusaran Berdenyut Panas */}
                <circle cx="0" cy="0" r="6" fill="#ffffff" className="anim-eye-pulse" />
                <circle cx="0" cy="0" r="11" fill="none" stroke="#fef08a" strokeWidth="1.5" className="anim-eye-pulse" />


              </g>

              {/* 7. Badge Keterangan Bawah Panel Kanan (Berada di Dasar, Terpisah Bersih) */}
              <rect x="18" y="190" width="260" height="24" rx="4" fill="#080201" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="148" y="206" fill="#fef08a" fontSize="10" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">GEODYNAMO: PUSARAN BESI-NIKEL 5.000°C</text>
            </g>

            {/* Header Kotak Kanan (Digambar di atas agar garis batasnya selalu tajam) */}
            <rect x="0" y="0" width="296" height="24" rx="4" fill="#78350f" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="148" y="16" fill="#fef08a" fontSize="11" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">LAUTAN LOGAM CAIR 5.000°C</text>
          </g>
        </svg>
      );

    // ══════════════════════════════════════════════════════════════════════════
    // ── 4B. INTI LUAR — GEODYNAMO: PEMBANGKIT MEDAN MAGNET BUMI ───────────────
    // ══════════════════════════════════════════════════════════════════════════
    case 'geodynamo':
      return (
        <svg viewBox="0 0 540 240" className="w-full h-full object-contain" shapeRendering="geometricPrecision">
          <style>{`
            @keyframes solarWindFlow {
              0% { stroke-dashoffset: 48; }
              100% { stroke-dashoffset: 0; }
            }
            @keyframes magneticPulse {
              0%, 100% { stroke-width: 2.2; opacity: 0.75; }
              50% { stroke-width: 3.6; opacity: 1; filter: drop-shadow(0 0 5px #38bdf8); }
            }
            @keyframes dynamoSpinCCW {
              0% { stroke-dashoffset: 0; }
              100% { stroke-dashoffset: 48; }
            }
            .anim-solar-wind { stroke-dasharray: 14 8; animation: solarWindFlow 1.6s linear infinite; }
            .anim-mag-field { animation: magneticPulse 2.8s ease-in-out infinite; }
            .anim-dynamo-spin { stroke-dasharray: 8 4; animation: dynamoSpinCCW 2s linear infinite; }
          `}</style>

          {/* Latar Belakang Luar Angkasa Gelap Total dengan Bintang */}
          <rect x="0" y="0" width="540" height="240" fill="#030712" />
          <circle cx="30" cy="25" r="1.5" fill="#ffffff" />
          <circle cx="95" cy="45" r="1" fill="#94a3b8" />
          <circle cx="510" cy="30" r="1.5" fill="#ffffff" />
          <circle cx="480" cy="210" r="1" fill="#ffffff" />
          <circle cx="525" cy="140" r="1" fill="#7dd3fc" />

          {/* ── ALIRAN ANGIN MATAHARI DARI KIRI (SOLAR WIND & COSMIC RADIATION) ── */}
          {Array.from({ length: 7 }).map((_, i) => (
            <g key={i}>
              <line
                x1="0"
                y1={35 + i * 28}
                x2="145"
                y2={35 + i * 28}
                stroke="#fbbf24"
                strokeWidth="2.5"
                className="anim-solar-wind"
              />
              <polygon
                points={`140,${35 + i * 28} 130,${31 + i * 28} 130,${39 + i * 28}`}
                fill="#fde047"
              />
            </g>
          ))}

          {/* ── DUA BADGE HEADER TERPISAH BERSIH (TIDAK BERTABRAKAN / MENYAMBUNG) ── */}
          {/* Label 1: Angin Matahari (Kiri) */}
          <rect x="12" y="10" width="165" height="24" rx="4" fill="#451a03" stroke="#fbbf24" strokeWidth="1.5" />
          <text x="94" y="26" fill="#fbbf24" fontSize="9.5" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">
            ANGIN SURYA MEMATIKAN
          </text>

          {/* Label 2: Perisai Magnetosfer (Kanan - Berjarak Nyata 33px) */}
          <g transform="translate(210, 10)">
            <rect x="0" y="0" width="175" height="24" rx="4" fill="#082f49" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="87" y="16" fill="#38bdf8" fontSize="9.5" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">
              PERISAI MAGNETOSFER
            </text>
          </g>

          {/* ── GELOMBANG KEJUT BUSUR MAGNETOSFER (BOW SHOCK WAVE) ── */}
          <path
            d="M 175,8 Q 120,120 175,232"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3.5"
            className="anim-mag-field"
          />
          {/* Efek pembelokan garis radiasi di sepanjang bow shock */}
          <path d="M 145,63 Q 165,40 210,12" fill="none" stroke="#fde047" strokeWidth="2.5" />
          <path d="M 145,175 Q 165,200 210,228" fill="none" stroke="#fde047" strokeWidth="2.5" />

          {/* ── POTONGAN BUMI & INTI BUMI DI TENGAH (EARTH CROSS SECTION) ── */}
          {/* Kerak & Mantel Luar */}
          <circle cx="330" cy="120" r="88" fill="#78350f" stroke="#92400e" strokeWidth="2" />
          {/* Lapisan Kerak Benua & Samudra di Permukaan Bumi */}
          <circle cx="330" cy="120" r="88" fill="none" stroke="#22c55e" strokeWidth="3" />
          <circle cx="330" cy="120" r="88" fill="none" stroke="#0284c7" strokeWidth="3" />

          {/* INTI LUAR CAIR MEMBARA (MOLTEN FE-NI AT 5.000°C - DINAMO GENERATOR) */}
          <circle cx="330" cy="120" r="62" fill="#ea580c" stroke="#f59e0b" strokeWidth="3" />

          {/* Pusaran Arus Putaran Dinamo di Inti Luar */}
          <ellipse cx="330" cy="94" rx="28" ry="11" fill="none" stroke="#fef08a" strokeWidth="3" className="anim-dynamo-spin" />
          <ellipse cx="330" cy="146" rx="28" ry="11" fill="none" stroke="#fef08a" strokeWidth="3" className="anim-dynamo-spin" />

          {/* INTI DALAM PADAT KRISTALIN DI PUSAT */}
          <circle cx="330" cy="120" r="26" fill="#fef08a" stroke="#ffffff" strokeWidth="2" />
          <text x="330" y="124" fill="#78350f" fontSize="10" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">
            INTI
          </text>

          {/* ── GARIS GAYA MEDAN MAGNETIK BUMI (DIPOLAR MAGNETIC FIELD LOOPS) ── */}
          {/* Loop Utama Luar */}
          <path d="M 330,28 C 170,-45 170,285 330,212" fill="none" stroke="#38bdf8" strokeWidth="2.5" className="anim-mag-field" />
          <path d="M 330,28 C 490,-45 490,285 330,212" fill="none" stroke="#38bdf8" strokeWidth="2.5" className="anim-mag-field" />

          {/* Loop Dalam Sekunder */}
          <path d="M 330,52 C 215,8 215,232 330,188" fill="none" stroke="#818cf8" strokeWidth="2" />
          <path d="M 330,52 C 445,8 445,232 330,188" fill="none" stroke="#818cf8" strokeWidth="2" />

          {/* Cahaya Aurora di Kutub Magnetik */}
          <ellipse cx="330" cy="34" rx="16" ry="4" fill="#34d399" opacity="0.85" />
          <ellipse cx="330" cy="206" rx="16" ry="4" fill="#34d399" opacity="0.85" />
        </svg>
      );

    // ── 5. INTI DALAM — TITIK 1: BOLA BESI PADAT (5.150 - 6.371 KM / 750 MIL) ──
    // Bola Besi Padat Sepanas Permukaan Matahari (6.000°C) & Tekanan Dahsyat >3,6 Juta Atm
    case 'inner-core':
      return (
        <svg viewBox="0 0 540 240" className="w-full h-full object-contain" shapeRendering="crispEdges">
          <defs>
            <clipPath id="innerCoreClip">
              <rect x="0" y="0" width="540" height="240" rx="6" />
            </clipPath>
          </defs>

          <g clipPath="url(#innerCoreClip)">
            {/* Latar Belakang Ruang Kedalaman Inti Bumi */}
            <rect x="0" y="0" width="540" height="240" fill="#1f0a02" />

            {/* Lapisan Batas Inti Luar Cair di Atas dan Bawah (Lehmann Discontinuity) */}
            <rect x="0" y="0" width="540" height="32" fill="#7c1d06" />
            <rect x="0" y="208" width="540" height="32" fill="#7c1d06" />
            <line x1="0" y1="32" x2="540" y2="32" stroke="#f59e0b" strokeWidth="2" />
            <line x1="0" y1="208" x2="540" y2="208" stroke="#f59e0b" strokeWidth="2" />

            {/* Riak Fluida Logam Meleleh di Inti Luar */}
            <line x1="10" y1="16" x2="160" y2="16" stroke="#fbbf24" strokeWidth="1.5" />
            <line x1="380" y1="16" x2="530" y2="16" stroke="#fbbf24" strokeWidth="1.5" />
            <line x1="20" y1="224" x2="180" y2="224" stroke="#fbbf24" strokeWidth="1.5" />
            <line x1="360" y1="224" x2="520" y2="224" stroke="#fbbf24" strokeWidth="1.5" />

            {/* Label Batas Diskontinuitas Lehmann */}
            <rect x="150" y="5" width="240" height="24" rx="4" fill="#450a0a" stroke="#f97316" strokeWidth="1.5" />
            <text x="270" y="21" fill="#fef08a" fontSize="11" fontWeight="800" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" letterSpacing="0.5" textAnchor="middle">DISKONTINUITAS LEHMANN</text>

            {/* ── BOLA BESI PADAT DI PUSAT (SOLID Fe-Ni INNER CORE) ── */}
            {/* Cincin Radiasi Cahaya Panas 6.000°C (Sepanas Matahari) */}
            <circle cx="270" cy="120" r="82" fill="#b45309" opacity="0.25" />
            <circle cx="270" cy="120" r="68" fill="#d97706" opacity="0.35" />
            <circle cx="270" cy="120" r="54" fill="#fde047" opacity="0.45" />

            {/* Bola Inti Padat Kristalin */}
            <circle cx="270" cy="120" r="44" fill="#fef08a" stroke="#ffffff" strokeWidth="3" />

            {/* Kisi Kristal Logam Heksagonal Rapat (Hexagonal Close-Packed Lattice) */}
            <g transform="translate(270, 120)">
              <polygon points="0,-32 28,-16 28,16 0,32 -28,16 -28,-16" fill="none" stroke="#d97706" strokeWidth="2" />
              <polygon points="0,-18 16,-9 16,9 0,18 -16,9 -16,-9" fill="none" stroke="#b45309" strokeWidth="1.5" />
              <line x1="0" y1="-32" x2="0" y2="32" stroke="#ffffff" strokeWidth="1.5" />
              <line x1="-28" y1="-16" x2="28" y2="16" stroke="#ffffff" strokeWidth="1.5" />
              <line x1="-28" y1="16" x2="28" y2="-16" stroke="#ffffff" strokeWidth="1.5" />
              {/* Atom Logam Fe di Sudut Kisi Heksagonal */}
              <circle cx="0" cy="0" r="6" fill="#ffffff" />
              <circle cx="0" cy="-32" r="3.5" fill="#fef08a" />
              <circle cx="28" cy="-16" r="3.5" fill="#fef08a" />
              <circle cx="28" cy="16" r="3.5" fill="#fef08a" />
              <circle cx="0" cy="32" r="3.5" fill="#fef08a" />
              <circle cx="-28" cy="16" r="3.5" fill="#fef08a" />
              <circle cx="-28" cy="-16" r="3.5" fill="#fef08a" />
            </g>

            {/* ── VEKTOR TEKANAN GRAVITASI MAHADAHYSAT (360 DERAJAT MENGEPUNG) ── */}
            {/* Panah Kiri */}
            <g transform="translate(145, 120)">
              <line x1="0" y1="0" x2="52" y2="0" stroke="#ef4444" strokeWidth="3.5" />
              <polygon points="62,0 48,-6 48,6" fill="#ef4444" />
            </g>
            {/* Panah Kanan */}
            <g transform="translate(395, 120)">
              <line x1="0" y1="0" x2="-52" y2="0" stroke="#ef4444" strokeWidth="3.5" />
              <polygon points="-62,0 -48,-6 -48,6" fill="#ef4444" />
            </g>
            {/* Panah Atas */}
            <g transform="translate(270, 40)">
              <line x1="0" y1="0" x2="0" y2="24" stroke="#ef4444" strokeWidth="3.5" />
              <polygon points="0,34 -6,20 6,20" fill="#ef4444" />
            </g>
            {/* Panah Bawah */}
            <g transform="translate(270, 200)">
              <line x1="0" y1="0" x2="0" y2="-24" stroke="#ef4444" strokeWidth="3.5" />
              <polygon points="0,-34 -6,-20 6,-20" fill="#ef4444" />
            </g>
            {/* Panah Diagonal */}
            <g transform="translate(182, 58)">
              <line x1="0" y1="0" x2="28" y2="24" stroke="#ef4444" strokeWidth="2.5" />
              <polygon points="34,30 20,26 28,18" fill="#ef4444" />
            </g>
            <g transform="translate(358, 58)">
              <line x1="0" y1="0" x2="-28" y2="24" stroke="#ef4444" strokeWidth="2.5" />
              <polygon points="-34,30 -28,18 -20,26" fill="#ef4444" />
            </g>
            <g transform="translate(182, 182)">
              <line x1="0" y1="0" x2="28" y2="-24" stroke="#ef4444" strokeWidth="2.5" />
              <polygon points="34,-30 28,-18 20,-26" fill="#ef4444" />
            </g>
            <g transform="translate(358, 182)">
              <line x1="0" y1="0" x2="-28" y2="-24" stroke="#ef4444" strokeWidth="2.5" />
              <polygon points="-34,-30 -20,-26 -28,-18" fill="#ef4444" />
            </g>

            {/* ── RETRO PIXEL BADGES DENGAN INFORMASI LENGKAP ── */}
            {/* Panel Kiri: Tekanan Ekstrem */}
            <g transform="translate(8, 74)">
              <rect x="0" y="0" width="142" height="88" rx="6" fill="#450a0a" stroke="#ef4444" strokeWidth="2" />
              <rect x="4" y="4" width="134" height="20" rx="3" fill="#7f1d1d" />
              <text x="71" y="18" fill="#fca5a5" fontSize="10" fontWeight="800" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" letterSpacing="0.5" textAnchor="middle">TEKANAN EKSTREM</text>
              <text x="71" y="42" fill="#ffffff" fontSize="14" fontWeight="800" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">&gt;3,6 JUTA ATM</text>
              <text x="71" y="60" fill="#fef08a" fontSize="10" fontWeight="700" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">(360 GIGAPASCAL)</text>
              <text x="71" y="78" fill="#fed7aa" fontSize="9.5" fontWeight="600" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">Kunci Atom Tetap Padat</text>
            </g>

            {/* Panel Kanan: Suhu Ekstrem */}
            <g transform="translate(390, 74)">
              <rect x="0" y="0" width="142" height="88" rx="6" fill="#78350f" stroke="#fbbf24" strokeWidth="2" />
              <rect x="4" y="4" width="134" height="20" rx="3" fill="#92400e" />
              <text x="71" y="18" fill="#fef08a" fontSize="10" fontWeight="800" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" letterSpacing="0.5" textAnchor="middle">SUHU EKSTREM</text>
              <text x="71" y="42" fill="#ffffff" fontSize="14" fontWeight="800" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">~6.000°C</text>
              <text x="71" y="60" fill="#fed7aa" fontSize="10" fontWeight="700" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">(5.500°C – 6.000°C)</text>
              <text x="71" y="78" fill="#fde047" fontSize="9.5" fontWeight="600" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">Sepanas Matahari!</text>
            </g>

            {/* Banner Bawah: Dimensi Inti Dalam */}
            <g transform="translate(70, 208)">
              <rect x="0" y="0" width="400" height="26" rx="4" fill="#0c0a09" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="200" y="18" fill="#fef08a" fontSize="11" fontWeight="800" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" letterSpacing="0.5" textAnchor="middle">
                BOLA BESI PADAT: DIAMETER 1.200 - 1.250 KM (750 MIL)
              </text>
            </g>
          </g>
        </svg>
      );

    // ── 6. INTI DALAM — TITIK 2: ALTAR PUSAT BUMI 6.371 KM & ANISOTROPI SEISMIK ──
    // Titik Nol Gravitasi Netto, Kristal Heksagonal Sejajar Poros Rotasi & Gelombang Gempa P-Wave
    case 'inner-core-center':
      return (
        <svg viewBox="0 0 540 240" className="w-full h-full object-contain" shapeRendering="crispEdges">
          <defs>
            <clipPath id="centerCoreClip">
              <rect x="0" y="0" width="540" height="240" rx="6" />
            </clipPath>
          </defs>

          <g clipPath="url(#centerCoreClip)">
            {/* Latar Belakang Ruang Suci Pusat Gravitasi */}
            <rect x="0" y="0" width="540" height="240" fill="#1a0802" />

            {/* ══════════════════════════════════════════════════════════════════════════
                PANEL KIRI: PENAMPANG KEDALAMAN DARI PERMUKAAN HINGGA PUSAT (0 - 6.371 KM)
                ══════════════════════════════════════════════════════════════════════════ */}
            <g id="panel-kedalaman-bumi">
              <rect x="10" y="8" width="180" height="224" rx="4" fill="#0f0502" stroke="#d97706" strokeWidth="1.5" />

              {/* Judul Panel Kiri */}
              <rect x="18" y="14" width="164" height="20" rx="3" fill="#451a03" stroke="#f59e0b" strokeWidth="1" />
              <text x="100" y="28" fill="#fef08a" fontSize="10" fontWeight="800" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" letterSpacing="0.5" textAnchor="middle">PENAMPANG KEDALAMAN</text>

              {/* Batang Strata Kedalaman */}
              {/* 1. Kerak Bumi (0 - 100 km) */}
              <rect x="22" y="38" width="50" height="14" fill="#15803d" />
              <rect x="74" y="38" width="110" height="14" fill="#1e293b" />
              <text x="78" y="49" fill="#86efac" fontSize="9" fontWeight="700" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">0-100 KM KERAK</text>

              {/* 2. Mantel Bumi (100 - 2.900 km) */}
              <rect x="22" y="54" width="50" height="38" fill="#b45309" />
              <rect x="74" y="54" width="110" height="38" fill="#261005" />
              <text x="78" y="68" fill="#fed7aa" fontSize="9" fontWeight="700" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">2.900 KM</text>
              <text x="78" y="82" fill="#f97316" fontSize="9" fontWeight="700" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">MANTEL PADAT</text>

              {/* 3. Inti Luar (2.900 - 5.150 km) */}
              <rect x="22" y="94" width="50" height="36" fill="#ea580c" />
              <rect x="74" y="94" width="110" height="36" fill="#3a0d04" />
              <text x="78" y="108" fill="#fed7aa" fontSize="9" fontWeight="700" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">5.150 KM</text>
              <text x="78" y="122" fill="#fde047" fontSize="9" fontWeight="700" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">INTI LUAR CAIR</text>

              {/* 4. Inti Dalam (5.150 - 6.371 km) */}
              <rect x="22" y="132" width="50" height="42" fill="#fef08a" />
              <rect x="74" y="132" width="110" height="42" fill="#451a03" />
              <text x="78" y="146" fill="#fef08a" fontSize="9" fontWeight="700" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">6.371 KM</text>
              <text x="78" y="159" fill="#ffffff" fontSize="9" fontWeight="700" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">INTI DALAM</text>
              <text x="78" y="170" fill="#fbbf24" fontSize="8" fontWeight="600" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">BOLA PADAT</text>

              {/* Garis Penanda Titik Pusat Mutlak */}
              <rect x="18" y="180" width="164" height="44" rx="3" fill="#2e1065" stroke="#a855f7" strokeWidth="1" />
              <text x="100" y="198" fill="#fef08a" fontSize="11" fontWeight="800" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" letterSpacing="0.5" textAnchor="middle">PUSAT BUMI</text>
              <text x="100" y="214" fill="#e9d5ff" fontSize="9.5" fontWeight="700" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">6.371 KILOMETER</text>
            </g>

            {/* ══════════════════════════════════════════════════════════════════════════
                PANEL KANAN: ALTAH KRISTAL HEKSAGONAL ANISOTROPI & SUMBU KUTUB BUMI
                ══════════════════════════════════════════════════════════════════════════ */}
            <g id="panel-kristal-anisotropi">
              <rect x="198" y="8" width="332" height="224" rx="4" fill="#0f0502" stroke="#d97706" strokeWidth="1.5" />

              {/* Garis Poros Rotasi Bumi (Sumbu Kutub Utara - Selatan) */}
              <line x1="364" y1="12" x2="364" y2="228" stroke="#38bdf8" strokeWidth="1.5" />

              {/* Label Poros Sumbu Rotasi */}
              <rect x="290" y="14" width="150" height="18" rx="3" fill="#082f49" stroke="#38bdf8" strokeWidth="1" />
              <text x="365" y="26" fill="#7dd3fc" fontSize="9.5" fontWeight="700" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">▲ KUTUB UTARA</text>

              <rect x="290" y="210" width="150" height="18" rx="3" fill="#082f49" stroke="#38bdf8" strokeWidth="1" />
              <text x="365" y="222" fill="#7dd3fc" fontSize="9.5" fontWeight="700" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">▼ KUTUB SELATAN</text>

              {/* Pendaran Cahaya Altar Kristal di Pusat */}
              <circle cx="364" cy="118" r="76" fill="#b45309" opacity="0.2" />
              <circle cx="364" cy="118" r="56" fill="#d97706" opacity="0.3" />

              {/* Prisma Monolit Kristal Heksagonal Raksasa (Sejajar Sumbu Rotasi) */}
              <g transform="translate(364, 118)">
                {/* Pilar Prisma Kolom Heksagonal Utama */}
                <polygon points="-24,-52 24,-52 38,-34 38,34 24,52 -24,52 -38,34 -38,-34" fill="#78350f" stroke="#fbbf24" strokeWidth="2" />
                <polygon points="-16,-44 16,-44 26,-28 26,28 16,44 -16,44 -26,28 -26,-28" fill="#b45309" stroke="#fef08a" strokeWidth="1.5" />
                <polygon points="-8,-34 8,-34 14,-20 14,20 8,34 -8,34 -14,20 -14,-20" fill="#fef08a" stroke="#ffffff" strokeWidth="2" />

                {/* Sinar P-Wave Seismik Merambat Cepat Searah Sumbu Kristal */}
                <line x1="0" y1="-62" x2="0" y2="62" stroke="#ffffff" strokeWidth="3" />

                {/* Titik Singularity Pusat Mutlak Bumi */}
                <circle cx="0" cy="0" r="7" fill="#ffffff" stroke="#fbbf24" strokeWidth="2" />
              </g>

              {/* Rambatan Gelombang Seismik P-Wave Melintasi Kutub */}
              <g transform="translate(230, 80)">
                <line x1="0" y1="0" x2="0" y2="76" stroke="#38bdf8" strokeWidth="2" />
                <polygon points="0,0 -4,10 4,10" fill="#38bdf8" />
                <polygon points="0,76 -4,66 4,66" fill="#38bdf8" />
                <rect x="8" y="24" width="85" height="32" rx="3" fill="#082f49" stroke="#38bdf8" strokeWidth="1" />
                <text x="50" y="37" fill="#38bdf8" fontSize="8.5" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">GELOMBANG</text>
                <text x="50" y="49" fill="#ffffff" fontSize="8.5" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">P-WAVE CEPAT</text>
              </g>

              {/* ── RETRO PIXEL BADGES PENJELASAN ── */}
              {/* Badge Gravitasi Netto Nol */}
              <g transform="translate(420, 58)">
                <rect x="0" y="0" width="105" height="56" rx="4" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5" />
                <text x="52" y="15" fill="#a5b4fc" fontSize="8.5" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">GRAVITASI NETTO</text>
                <text x="52" y="32" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">NETTO = 0</text>
                <text x="52" y="47" fill="#c7d2fe" fontSize="8" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">Tarikan Seimbang</text>
              </g>

              {/* Badge Anisotropi Kristal */}
              <g transform="translate(420, 124)">
                <rect x="0" y="0" width="105" height="56" rx="4" fill="#451a03" stroke="#f59e0b" strokeWidth="1.5" />
                <text x="52" y="15" fill="#fef08a" fontSize="8.5" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">ANISOTROPI</text>
                <text x="52" y="30" fill="#ffffff" fontSize="9.5" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">KRISTAL BESI</text>
                <text x="52" y="47" fill="#fed7aa" fontSize="8" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">Poros Rotasi Kutub</text>
              </g>
            </g>
          </g>
        </svg>
      );

    // ══════════════════════════════════════════════════════════════════════════
    // ── 7A. ZONA BATAS DIVERGEN: SUPERBENUA PANGEA & TEORI DRIFT BENUA ─────────
    // ══════════════════════════════════════════════════════════════════════════
    case 'pangea-drift':
      return (
        <svg viewBox="0 0 540 240" className="w-full h-full object-contain" shapeRendering="crispEdges">
          <style>{`
            @keyframes pangeaDriftLeft {
              0%, 100% { transform: translateX(0px); }
              50% { transform: translateX(-12px); }
            }
            @keyframes pangeaDriftRight {
              0%, 100% { transform: translateX(0px); }
              50% { transform: translateX(12px); }
            }
            .anim-drift-left { animation: pangeaDriftLeft 4s ease-in-out infinite; }
            .anim-drift-right { animation: pangeaDriftRight 4s ease-in-out infinite; }
          `}</style>
          {/* Latar Belakang Kanvas Samudra Purba */}
          <rect x="0" y="0" width="540" height="240" fill="#020617" />

          {/* ── PANEL KIRI: SUPERBENUA PANGEA (300 JUTA TAHUN LALU) ── */}
          <g id="panel-pangea-past">
            <rect x="10" y="8" width="255" height="224" rx="4" fill="#0b132b" stroke="#3b82f6" strokeWidth="1.5" />

            {/* Samudra Panthalassa di Sekeliling Pangea */}
            <rect x="14" y="34" width="247" height="156" fill="#0369a1" opacity="0.65" />
            <line x1="20" y1="50" x2="60" y2="50" stroke="#7dd3fc" strokeWidth="1" opacity="0.4" />
            <line x1="180" y1="170" x2="230" y2="170" stroke="#7dd3fc" strokeWidth="1" opacity="0.4" />

            {/* Superbenua Raksasa Pangea Tunggal di Tengah */}
            <polygon
              points="75,80 125,65 175,75 195,115 170,155 130,165 85,145 65,110"
              fill="#15803d"
              stroke="#22c55e"
              strokeWidth="2"
            />
            {/* Strata Pegunungan Purba di Pangea */}
            <polygon points="105,95 130,85 155,100 140,120 115,115" fill="#78350f" />
            <polygon points="120,90 135,82 145,95" fill="#ca8a04" />

            {/* Garis Rekahan Awal Pemisahan (Rift Zone) */}
            <line x1="130" y1="65" x2="132" y2="165" stroke="#ef4444" strokeWidth="2" />

            {/* Panah Pemisahan Divergen di Pangea */}
            <polygon points="110,115 95,115 102,108 102,122" fill="#fef08a" />
            <polygon points="152,115 167,115 160,108 160,122" fill="#fef08a" />

            {/* Judul Panel Kiri */}
            <rect x="18" y="12" width="239" height="22" rx="4" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1" />
            <text x="137" y="27" fill="#fef08a" fontSize="10.5" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">
              300 JUTA TAHUN LALU: PANGEA
            </text>

            {/* Keterangan Bawah Panel Kiri */}
            <rect x="18" y="190" width="239" height="38" rx="4" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.5" />
            <text x="137" y="205" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">
              SATU KESATUAN DARATAN
            </text>
            <text x="137" y="220" fill="#7dd3fc" fontSize="9" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">
              Dikelilingi Samudra Panthalassa
            </text>
          </g>

          {/* ── DIVIDER TENGAH ── */}
          <line x1="270" y1="8" x2="270" y2="232" stroke="#f59e0b" strokeWidth="2" />

          {/* ── PANEL KANAN: BUMI SAAT INI (TERPECAH AKIBAT BATAS DIVERGEN) ── */}
          <g id="panel-benua-modern">
            <rect x="275" y="8" width="255" height="224" rx="4" fill="#0b132b" stroke="#f97316" strokeWidth="1.5" />

            {/* Samudra Modern */}
            <rect x="279" y="34" width="247" height="156" fill="#0284c7" opacity="0.65" />

            {/* Benua Amerika (Bergerak ke Kiri) */}
            <g className="anim-drift-left">
              <polygon points="310,75 345,70 340,110 325,115 315,100" fill="#15803d" stroke="#22c55e" strokeWidth="1.5" />
              <polygon points="325,120 348,125 340,165 320,155" fill="#166534" stroke="#22c55e" strokeWidth="1.5" />
              <text x="330" y="96" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">AMERIKA</text>
              {/* Panah Gerak Menjauh ke Kiri */}
              <polygon points="305,118 290,118 298,111 298,125" fill="#ef4444" />
            </g>

            {/* Punggung Tengah Samudra Atlantik (Mid-Atlantic Ridge) di Tengah */}
            <path d="M 370,55 Q 365,110 375,175" fill="none" stroke="#ea580c" strokeWidth="3" />
            <path d="M 370,55 Q 365,110 375,175" fill="none" stroke="#fef08a" strokeWidth="1" />

            {/* Benua Afrika & Eurasia (Bergerak ke Kanan) */}
            <g className="anim-drift-right">
              <polygon points="395,65 470,60 480,95 440,105 390,95" fill="#15803d" stroke="#22c55e" strokeWidth="1.5" />
              <polygon points="395,108 435,105 445,150 415,165 390,135" fill="#166534" stroke="#22c55e" strokeWidth="1.5" />
              <text x="430" y="80" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">EURASIA</text>
              <text x="418" y="130" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">AFRIKA</text>
              {/* Panah Gerak Menjauh ke Kanan */}
              <polygon points="460,118 475,118 467,111 467,125" fill="#ef4444" />
            </g>

            {/* Judul Panel Kanan */}
            <rect x="283" y="12" width="239" height="22" rx="4" fill="#7c2d12" stroke="#f97316" strokeWidth="1" />
            <text x="402" y="27" fill="#fef08a" fontSize="10.5" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">
              SEKARANG: 7 BENUA TERPISAH
            </text>

            {/* Keterangan Bawah Panel Kanan */}
            <rect x="283" y="190" width="239" height="38" rx="4" fill="#0f172a" stroke="#f97316" strokeWidth="1.5" />
            <text x="402" y="205" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">
              LEMPENG BERGERAK MENJAUH
            </text>
            <text x="402" y="220" fill="#fed7aa" fontSize="9" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">
              Membentuk Samudra Baru (Atlantik)
            </text>
          </g>
        </svg>
      );

    // ══════════════════════════════════════════════════════════════════════════
    // ── 7B. ZONA BATAS DIVERGEN: LEMBAH RETAKAN & PEGUNUNGAN KEMBAR ───────────
    // ══════════════════════════════════════════════════════════════════════════
    case 'rift-valley':
      return (
        <svg viewBox="0 0 540 240" className="w-full h-full object-contain" shapeRendering="crispEdges">
          <style>{`
            @keyframes riftPullLeft {
              0%, 100% { transform: translateX(0px); }
              50% { transform: translateX(-8px); }
            }
            @keyframes riftPullRight {
              0%, 100% { transform: translateX(0px); }
              50% { transform: translateX(8px); }
            }
            @keyframes magmaRiseCycle {
              0%, 100% { transform: scaleY(0.95); opacity: 0.75; }
              50% { transform: scaleY(1.15); opacity: 1; }
            }
            .anim-rift-left { animation: riftPullLeft 3.5s ease-in-out infinite; }
            .anim-rift-right { animation: riftPullRight 3.5s ease-in-out infinite; }
            .anim-rift-magma { animation: magmaRiseCycle 3.5s ease-in-out infinite; transform-origin: 270px 220px; }
          `}</style>
          <rect x="0" y="0" width="540" height="240" fill="#0c0a09" />

          {/* Langit Lembah Retakan Afrika Timur */}
          <rect x="6" y="6" width="528" height="70" fill="#1c1917" />
          <line x1="10" y1="45" x2="530" y2="45" stroke="#7c2d12" strokeWidth="1" opacity="0.4" />

          {/* Semburat Cahaya Senja Horizon */}
          <rect x="6" y="55" width="528" height="22" fill="#451a03" opacity="0.6" />

          {/* ── MANTEL BUMI & MAGMA NAIK DI DASAR CELAH TENGAH ── */}
          <rect x="6" y="160" width="528" height="74" fill="#1a0402" />
          <g className="anim-rift-magma">
            <polygon points="245,234 295,234 285,150 255,150" fill="#dc2626" />
            <polygon points="252,234 288,234 278,160 262,160" fill="#f97316" />
            <polygon points="260,234 280,234 274,175 266,175" fill="#fef08a" />
          </g>

          {/* ── BLOK SESAR KIRI (GUNUNG KEMBAR SISI BARAT - MENJAUH KE KIRI) ── */}
          <g className="anim-rift-left">
            {/* Lereng Gunung Kembar Barat */}
            <polygon points="6,76 110,38 185,76 210,145 6,145" fill="#3f3f46" stroke="#18181b" strokeWidth="1.5" />
            <polygon points="75,48 110,38 145,55 125,76 85,76" fill="#71717a" />
            {/* Strata Kerak Benua Barat */}
            <rect x="6" y="145" width="210" height="40" fill="#27272a" />
            <line x1="6" y1="165" x2="216" y2="165" stroke="#52525b" strokeWidth="2" />
            {/* Bidang Sesar Normal Miring (Fault Plane) */}
            <line x1="185" y1="76" x2="230" y2="185" stroke="#ea580c" strokeWidth="2.5" />

            {/* Panah Merah Tarikan ke Kiri (Menjauh) */}
            <polygon points="120,105 70,105 70,98 45,112 70,126 70,119 120,119" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
            <text x="95" y="65" fill="#fef08a" fontSize="10" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">
              TEBING BARAT
            </text>
          </g>

          {/* ── DASAR LEMBAH RETAKAN YANG AMBLES DI TENGAH (GRABEN RIFT FLOOR) ── */}
          <polygon points="210,135 330,135 315,185 225,185" fill="#18181b" stroke="#ea580c" strokeWidth="1.5" />
          {/* Batuan Basalt Magma Beku di Lantai Retakan */}
          <rect x="220" y="136" width="100" height="14" fill="#09090b" />
          <line x1="220" y1="140" x2="320" y2="140" stroke="#f97316" strokeWidth="1.5" />

          {/* ── BLOK SESAR KANAN (GUNUNG KEMBAR SISI TIMUR - MENJAUH KE KANAN) ── */}
          <g className="anim-rift-right">
            {/* Lereng Gunung Kembar Timur */}
            <polygon points="355,76 430,38 534,76 534,145 330,145" fill="#3f3f46" stroke="#18181b" strokeWidth="1.5" />
            <polygon points="395,55 430,38 465,48 455,76 415,76" fill="#71717a" />
            {/* Strata Kerak Benua Timur */}
            <rect x="324" y="145" width="210" height="40" fill="#27272a" />
            <line x1="324" y1="165" x2="534" y2="165" stroke="#52525b" strokeWidth="2" />
            {/* Bidang Sesar Normal Miring (Fault Plane) */}
            <line x1="355" y1="76" x2="310" y2="185" stroke="#ea580c" strokeWidth="2.5" />

            {/* Panah Merah Tarikan ke Kanan (Menjauh) */}
            <polygon points="420,105 470,105 470,98 495,112 470,126 470,119 420,119" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
            <text x="445" y="65" fill="#fef08a" fontSize="10" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">
              TEBING TIMUR
            </text>
          </g>

          {/* ── RETRO PIXEL BADGES LENGKAP ── */}
          {/* Header Atas */}
          <rect x="70" y="8" width="400" height="24" rx="4" fill="#451a03" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="270" y="24" fill="#fef08a" fontSize="11" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">
            EAST AFRICAN RIFT: LEMBAH RETAKAN
          </text>

          {/* Badge Lembah Ambles */}
          <rect x="175" y="98" width="190" height="30" rx="4" fill="#09090b" stroke="#f97316" strokeWidth="1.5" />
          <text x="270" y="112" fill="#fef08a" fontSize="10" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">
            ▼ LEMBAH AMBLES (GRABEN)
          </text>
          <text x="270" y="124" fill="#fed7aa" fontSize="8.5" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">
            Calon Samudra Baru Masa Depan
          </text>

          {/* Banner Bawah */}
          <rect x="30" y="194" width="480" height="34" rx="4" fill="#0c0a09" stroke="#ea580c" strokeWidth="1.5" />
          <text x="270" y="209" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">
            KERAK DITARIK SALING MENJAUH ➔ TANAH AMBLES
          </text>
          <text x="270" y="222" fill="#fde047" fontSize="9" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">
            Diapit oleh pegunungan kembar di kedua sisinya
          </text>
        </svg>
      );

    // ══════════════════════════════════════════════════════════════════════════
    // ── 7C. ZONA BATAS DIVERGEN: PEMEKARAN DASAR LAUT (SEAFLOOR SPREADING) ───
    // ══════════════════════════════════════════════════════════════════════════
    case 'seafloor-spreading':
      return (
        <svg viewBox="0 0 540 240" className="w-full h-full object-contain" shapeRendering="crispEdges">
          <style>{`
            @keyframes spreadLeft {
              0%, 100% { transform: translateX(0px); }
              50% { transform: translateX(-14px); }
            }
            @keyframes spreadRight {
              0%, 100% { transform: translateX(0px); }
              50% { transform: translateX(14px); }
            }
            @keyframes smokerPlume {
              0%, 100% { opacity: 0.5; transform: translateY(0px) scale(0.9); }
              50% { opacity: 0.9; transform: translateY(-8px) scale(1.1); }
            }
            .anim-spread-left { animation: spreadLeft 3.8s ease-in-out infinite; }
            .anim-spread-right { animation: spreadRight 3.8s ease-in-out infinite; }
            .anim-smoker { animation: smokerPlume 2.5s ease-in-out infinite; }
          `}</style>
          <rect x="0" y="0" width="540" height="240" fill="#020617" />

          {/* Kolom Air Samudra Dalam (Lautan Biru Gelap) */}
          <rect x="6" y="6" width="528" height="110" fill="#0369a1" opacity="0.7" />
          <rect x="6" y="60" width="528" height="56" fill="#0c4a6e" opacity="0.8" />

          {/* Sinar Cahaya Tipis Menembus Laut Dalam */}
          <line x1="80" y1="6" x2="110" y2="90" stroke="#bae6fd" strokeWidth="1" opacity="0.25" />
          <line x1="420" y1="6" x2="450" y2="90" stroke="#bae6fd" strokeWidth="1" opacity="0.25" />

          {/* ── MANTEL BUMI & INTRUSI MAGMA DI SUMBU TENGAH (CENTRAL RIFT AXIS) ── */}
          <rect x="6" y="170" width="528" height="64" fill="#350702" />
          <polygon points="245,234 295,234 285,116 255,116" fill="#ea580c" />
          <polygon points="252,234 288,234 278,124 262,124" fill="#f97316" />
          <polygon points="260,234 280,234 274,135 266,135" fill="#fef08a" />

          {/* Hydrothermal Vent (Black Smoker) di Celah Tengah */}
          <g className="anim-smoker" transform="translate(270, 95)">
            <circle cx="-6" cy="-4" r="5" fill="#475569" opacity="0.75" />
            <circle cx="6" cy="-10" r="7" fill="#64748b" opacity="0.65" />
            <circle cx="0" cy="-18" r="9" fill="#94a3b8" opacity="0.5" />
          </g>

          {/* ── LEMPENG DASAR LAUT KIRI (KERAK SAMUDRA BARU - BERGERAK KE KIRI) ── */}
          <g className="anim-spread-left">
            {/* Strata Kerak Basal Kiri */}
            <polygon points="6,116 180,116 250,116 240,170 6,170" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
            {/* Strata Punggungan Bawah Laut (Mid-Ocean Ridge Slopes) */}
            <polygon points="6,130 160,130 250,116 250,126 160,140 6,140" fill="#334155" />
            {/* Lapisan Kerak Baru (Paling dekat dengan celah) */}
            <rect x="200" y="116" width="45" height="54" fill="#09090b" opacity="0.8" stroke="#f97316" strokeWidth="1" />

            {/* Panah Pemekaran ke Kiri */}
            <polygon points="170,142 120,142 120,136 95,148 120,160 120,154 170,154" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
            <text x="135" y="105" fill="#7dd3fc" fontSize="9.5" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">
              KERAK SAMUDRA KIRI
            </text>
          </g>

          {/* ── LEMPENG DASAR LAUT KANAN (KERAK SAMUDRA BARU - BERGERAK KE KANAN) ── */}
          <g className="anim-spread-right">
            {/* Strata Kerak Basal Kanan */}
            <polygon points="290,116 360,116 534,116 534,170 300,170" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
            {/* Strata Punggungan Bawah Laut (Mid-Ocean Ridge Slopes) */}
            <polygon points="290,116 380,130 534,130 534,140 380,140 290,126" fill="#334155" />
            {/* Lapisan Kerak Baru (Paling dekat dengan celah) */}
            <rect x="295" y="116" width="45" height="54" fill="#09090b" opacity="0.8" stroke="#f97316" strokeWidth="1" />

            {/* Panah Pemekaran ke Kanan */}
            <polygon points="370,142 420,142 420,136 445,148 420,160 420,154 370,154" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
            <text x="405" y="105" fill="#7dd3fc" fontSize="9.5" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">
              KERAK SAMUDRA KANAN
            </text>
          </g>

          {/* ── RETRO PIXEL BADGES PENJELASAN ── */}
          {/* Header Atas */}
          <rect x="60" y="8" width="420" height="24" rx="4" fill="#082f49" stroke="#38bdf8" strokeWidth="1.5" />
          <text x="270" y="24" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">
            SEAFLOOR SPREADING: PEMEKARAN DASAR LAUT
          </text>

          {/* Label Tengah Ridge Axis */}
          <rect x="185" y="62" width="170" height="28" rx="4" fill="#1c0402" stroke="#ea580c" strokeWidth="1.5" />
          <text x="270" y="75" fill="#fef08a" fontSize="9.5" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">
            MAGMA NAIK MEMBEKU
          </text>
          <text x="270" y="86" fill="#fed7aa" fontSize="8.5" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">
            Menjadi Batuan Basal Baru
          </text>

          {/* Banner Bawah */}
          <rect x="30" y="194" width="480" height="34" rx="4" fill="#0c0a09" stroke="#38bdf8" strokeWidth="1.5" />
          <text x="270" y="209" fill="#7dd3fc" fontSize="10" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">
            LANTAI LAUTAN TERUS MELEBAR SETIAP TAHUN
          </text>
          <text x="270" y="222" fill="#fef08a" fontSize="9" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">
            Membentuk Punggung Tengah Samudra (Mid-Ocean Ridge)
          </text>
        </svg>
      );
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN 1: PANGEA SUPERCONTINENT MAP (PERSIS DENGAN LEVEL 2)
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
// SUB-KOMPONEN 2: BUKTI RANTAI PEGUNUNGAN KEMBAR (PERSIS DENGAN LEVEL 2)
// ═════════════════════════════════════════════════════════════════════════════
function TwinMountainsIllustration() {
  return (
    <svg viewBox="0 0 600 320" className="w-full h-full object-contain" shapeRendering="crispEdges">
      {/* Lautan Samudra Luas */}
      <rect x="0" y="0" width="600" height="320" fill="#082f49" />

      {/* Garis Grid Kartografi */}
      <line x1="0" y1="160" x2="600" y2="160" stroke="#0284c7" strokeWidth="1" opacity="0.4" />
      <line x1="300" y1="0" x2="300" y2="320" stroke="#0284c7" strokeWidth="1" opacity="0.4" />

      {/* Banner Judul */}
      <rect x="40" y="6" width="520" height="26" rx="4" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="1.5" />
      <text x="300" y="24" textAnchor="middle" fill="#fef08a" fontSize="12" fontWeight="bold">
        REKONSTRUKSI PANGEA: PENYATUAN AMERIKA UTARA, EROPA, &amp; AFRIKA
      </text>

      {/* AMERIKA UTARA */}
      <path
        d="M 50 140 L 80 100 L 110 70 L 150 50 L 190 40 L 220 55 L 245 45 L 255 75 L 245 95 L 235 125 L 225 155 L 205 190 L 195 225 L 165 240 L 135 220 L 110 185 L 85 180 L 60 165 Z"
        fill="#15803d"
        stroke="#166534"
        strokeWidth="2"
      />
      <text x="130" y="136" fill="#ffffff" fontSize="13" fontWeight="bold">
        AMERIKA UTARA
      </text>
      <text x="130" y="152" fill="#bbf7d0" fontSize="10" fontWeight="bold">
        (Pesisir Timur / Pangea)
      </text>

      {/* EROPA */}
      <path
        d="M 260 45 L 310 35 L 355 45 L 395 70 L 420 50 L 450 75 L 430 110 L 390 125 L 360 135 L 330 120 L 305 130 L 275 110 L 260 75 Z"
        fill="#166534"
        stroke="#14532d"
        strokeWidth="2"
      />
      <text x="360" y="82" fill="#ffffff" fontSize="13" fontWeight="bold">
        EROPA
      </text>
      <text x="360" y="98" fill="#bbf7d0" fontSize="10" fontWeight="bold">
        (Inggris, Skotlandia, &amp; Skandinavia)
      </text>

      {/* AFRIKA */}
      <path
        d="M 235 160 L 275 135 L 335 140 L 385 170 L 420 215 L 390 270 L 330 285 L 285 270 L 255 235 L 235 190 Z"
        fill="#9a3412"
        stroke="#78350f"
        strokeWidth="2"
      />
      <text x="310" y="206" fill="#ffffff" fontSize="13" fontWeight="bold">
        AFRIKA
      </text>
      <text x="310" y="222" fill="#fed7aa" fontSize="10" fontWeight="bold">
        (Pesisir Barat Laut Afrika)
      </text>

      {/* SABUK RANTAI PEGUNUNGAN KEMBAR TERSAMBUNG KONTINU */}
      <path
        d="M 175 230 Q 205 180, 230 130 Q 250 95, 275 80 Q 310 65, 365 55 L 375 68 Q 320 80, 285 96 Q 260 115, 240 145 Q 215 195, 185 240 Z"
        fill="#ea580c"
        stroke="#facc15"
        strokeWidth="2"
      />

      {/* Simbol Puncak Pegunungan */}
      <polygon points="182,215 188,198 194,215" fill="#fef08a" />
      <polygon points="208,175 215,158 222,175" fill="#fef08a" />
      <polygon points="230,135 238,118 246,135" fill="#fef08a" />
      <polygon points="268,95 275,78 282,95" fill="#fef08a" />
      <polygon points="305,78 313,62 321,78" fill="#fef08a" />
      <polygon points="345,68 353,52 361,68" fill="#fef08a" />

      {/* Kotak Callout 1: Appalachian */}
      <rect x="15" y="235" width="220" height="42" rx="4" fill="#0f172a" stroke="#facc15" strokeWidth="1.5" />
      <text x="125" y="252" textAnchor="middle" fill="#facc15" fontSize="11" fontWeight="bold">
        PEG. APPALACHIAN (AMERIKA)
      </text>
      <text x="125" y="267" textAnchor="middle" fill="#cbd5e1" fontSize="9.5" fontWeight="bold">
        Batuan Paleozoikum &amp; Umur Sama
      </text>
      <line x1="160" y1="235" x2="185" y2="215" stroke="#facc15" strokeWidth="1.5" />

      {/* Kotak Callout 2: Caledonian */}
      <rect x="350" y="112" width="240" height="42" rx="4" fill="#0f172a" stroke="#facc15" strokeWidth="1.5" />
      <text x="470" y="129" textAnchor="middle" fill="#facc15" fontSize="11" fontWeight="bold">
        PEG. CALEDONIAN (EROPA/UK)
      </text>
      <text x="470" y="144" textAnchor="middle" fill="#cbd5e1" fontSize="9.5" fontWeight="bold">
        Struktur Lipatan Identik Sempurna
      </text>
      <line x1="390" y1="115" x2="330" y2="85" stroke="#facc15" strokeWidth="1.5" />

      {/* Footer Callout */}
      <rect x="30" y="284" width="540" height="28" rx="4" fill="#18181b" stroke="#38bdf8" strokeWidth="1.5" />
      <text x="300" y="302" textAnchor="middle" fill="#38bdf8" fontSize="10.5" fontWeight="bold">
        FAKTA: JIKA BENUA DISATUKAN, KEDUA RANTAI MEMBENTUK SATU SABUK UTUH!
      </text>
    </svg>
  );
}

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
            <linearGradient id="divOceanGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.85" />
              <stop offset="35%" stopColor="#0369a1" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#082f49" />
            </linearGradient>

            {/* Gradasi Mantel Astenosfer Panas */}
            <linearGradient id="divMantleGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9a3412" />
              <stop offset="40%" stopColor="#7c2d12" />
              <stop offset="100%" stopColor="#3d1306" />
            </linearGradient>

            {/* Gradasi Dapur Magma */}
            <radialGradient id="divMagmaChamberGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#fef08a" />
              <stop offset="60%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#dc2626" />
            </radialGradient>

            {/* Gradasi Asap Hidrotermal Black Smoker */}
            <linearGradient id="divSmokerGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#0f172a" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#334155" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#64748b" stopOpacity="0" />
            </linearGradient>

            {/* Gradasi Berkas Cahaya Laut Dalam */}
            <linearGradient id="divCausticRay" x1="0" y1="0" x2="0.3" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
            </linearGradient>
          </defs>

          <style>{`
            @keyframes divPlumeDrift {
              0% { transform: translateY(0px) scale(0.95); opacity: 0.85; }
              50% { transform: translateY(-8px) scale(1.1); opacity: 0.95; }
              100% { transform: translateY(-18px) scale(1.25); opacity: 0.1; }
            }
            @keyframes divMagmaPulse {
              0%, 100% { filter: drop-shadow(0 0 8px #f97316); opacity: 0.9; }
              50% { filter: drop-shadow(0 0 20px #fbbf24); opacity: 1; }
            }
            @keyframes divBubbleRise {
              0% { transform: translateY(0px); opacity: 0; }
              20% { opacity: 0.9; }
              100% { transform: translateY(-35px); opacity: 0; }
            }
            @keyframes divFlowPulse {
              0% { stroke-dashoffset: 0; }
              100% { stroke-dashoffset: -30; }
            }
          `}</style>

          {/* ── 1. KOLOM AIR SAMUDRA LUAS ── */}
          <rect x="0" y="0" width="680" height="340" fill="url(#divOceanGrad)" />

          {/* Permukaan Laut Riak Berombak Halus */}
          <path
            d="M 0 16 Q 40 10, 80 16 T 160 16 T 240 16 T 320 16 T 400 16 T 480 16 T 560 16 T 640 16 T 680 16 L 680 0 L 0 0 Z"
            fill="#38bdf8"
            opacity="0.3"
          />
          <line x1="0" y1="16" x2="680" y2="16" stroke="#7dd3fc" strokeWidth="1.5" opacity="0.6" />

          {/* Berkas Cahaya Bawah Laut */}
          <polygon points="60,16 110,16 170,120 110,120" fill="url(#divCausticRay)" />
          <polygon points="210,16 270,16 340,110 270,110" fill="url(#divCausticRay)" />
          <polygon points="410,16 470,16 530,110 460,110" fill="url(#divCausticRay)" />
          <polygon points="560,16 610,16 660,120 600,120" fill="url(#divCausticRay)" />

          {/* ── 2. MANTEL BUMI ASTENOSFER (DI BAWAH LITOSFER) ── */}
          <rect x="0" y="160" width="680" height="180" fill="url(#divMantleGrad)" />

          {/* ARUS KONVEKSI MANTEL: Upwelling dan Pembelahan Dua Arah */}
          <g style={{ animation: 'divFlowPulse 2s linear infinite' }}>
            {/* Plume Tengah Naik */}
            <path
              d="M 340 330 C 340 260, 340 215, 340 175"
              fill="none"
              stroke="#fb923c"
              strokeWidth="4"
              strokeDasharray="8 6"
            />
            {/* Aliran Membelok ke Kiri */}
            <path
              d="M 340 175 C 300 175, 200 175, 120 190 C 60 200, 35 240, 45 285 C 55 320, 160 330, 330 330"
              fill="none"
              stroke="#ea580c"
              strokeWidth="3.2"
              strokeDasharray="8 6"
            />
            {/* Aliran Membelok ke Kanan */}
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
          <g style={{ animation: 'divMagmaPulse 2.5s ease-in-out infinite' }}>
            <ellipse cx="340" cy="190" rx="55" ry="26" fill="url(#divMagmaChamberGrad)" />
            {/* Saluran Magma / Dike Vertikal ke Lembah Retakan */}
            <rect x="334" y="112" width="12" height="58" fill="#ff4500" rx="2" />
            <path d="M 326 145 L 336 125 L 344 125 L 354 145 Z" fill="#fb923c" opacity="0.8" />
          </g>

          {/* ── 4. MAGMA NAIK & PEMBENTUKAN KERAK DASAR LAUT DI CELAH LEMBAH ── */}
          {/* Tampil di tengah saat kedua lempeng saling memisah */}
          <g style={{ opacity: isDiverged ? 1 : 0, transition: 'opacity 2.5s ease-in-out' }}>
            <rect x="328" y="108" width="24" height="32" fill="#ff4500" rx="3" />
            <ellipse cx="340" cy="114" rx="18" ry="7" fill="#fbbf24" />

            {/* Kerak Basal Baru Membeku di Dasar Retakan */}
            <path
              d="M 320 118 C 326 114, 333 116, 340 114 C 347 116, 354 114, 360 118 L 360 128 C 347 130, 333 130, 320 128 Z"
              fill="#18181b"
              stroke="#ea580c"
              strokeWidth="1.5"
            />
            {/* Gelembung Hidrotermal */}
            <circle cx="336" cy="106" r="2.2" fill="#fed7aa" style={{ animation: 'divBubbleRise 1.6s infinite 0.2s' }} />
            <circle cx="344" cy="102" r="2.5" fill="#fef08a" style={{ animation: 'divBubbleRise 1.6s infinite 0.7s' }} />
            <circle cx="340" cy="108" r="1.8" fill="#ffffff" style={{ animation: 'divBubbleRise 1.6s infinite 1.1s' }} />
          </g>

          {/* ── 5. LEMPENG BARAT (KIRI) — BERAWAL MENYATU (NYAMBUNG DI TENGAH X=340) ── */}
          <g
            style={{
              transform: isDiverged ? 'translateX(-56px)' : 'translateX(0)',
              transition: 'transform 3.5s cubic-bezier(0.2, 0.8, 0.35, 1)',
            }}
          >
            {/* Lapisan Litosfer Mantel (Peridotite Bawah) */}
            <path
              d="M 0 135 C 70 130, 160 115, 230 92 C 265 82, 305 78, 340 78 L 341 96 L 338 116 L 342 138 L 339 158 L 340 170 L 0 170 Z"
              fill="#1e3a2b"
              stroke="#0f172a"
              strokeWidth="2"
            />

            {/* Lapisan Kerak Gabro & Dike (Tengah) */}
            <path
              d="M 0 135 C 70 130, 160 115, 230 92 C 265 82, 305 78, 340 78 L 341 96 L 338 116 L 342 138 L 315 138 C 230 138, 120 145, 0 152 Z"
              fill="#1e293b"
            />

            {/* Lapisan Kerak Basal Bantal (Pillow Basalt - Atas) */}
            <path
              d="M 0 135 C 70 130, 160 115, 230 92 C 265 82, 305 78, 340 78 L 341 96 L 338 116 L 315 116 C 230 116, 120 132, 0 140 Z"
              fill="#334155"
              stroke="#0f172a"
              strokeWidth="1.5"
            />

            {/* Lapisan Sedimen Laut Pelagik */}
            <path
              d="M 0 135 C 60 131, 130 118, 190 102 L 190 106 C 130 122, 60 135, 0 139 Z"
              fill="#fef08a"
              opacity="0.85"
            />

            {/* Patahan Normal & Blok Sesar Berundak */}
            <line x1="275" y1="83" x2="275" y2="135" stroke="#0f172a" strokeWidth="2" />
            <line x1="298" y1="81" x2="298" y2="140" stroke="#0f172a" strokeWidth="2" />
            <line x1="322" y1="79" x2="322" y2="155" stroke="#0f172a" strokeWidth="2" />

            {/* Cerobong Hidrotermal (Black Smoker Kiri) */}
            <path d="M 324 80 L 327 68 L 331 68 L 334 80 Z" fill="#18181b" stroke="#78350f" strokeWidth="1" />

            {/* Vektor Arah Pemekaran (Panah Bersih Tanpa Teks) */}
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
            {/* Lapisan Litosfer Mantel (Peridotite Bawah) */}
            <path
              d="M 680 135 C 610 130, 520 115, 450 92 C 415 82, 375 78, 340 78 L 341 96 L 338 116 L 342 138 L 339 158 L 340 170 L 680 170 Z"
              fill="#1e3a2b"
              stroke="#0f172a"
              strokeWidth="2"
            />

            {/* Lapisan Kerak Gabro & Dike (Tengah) */}
            <path
              d="M 680 135 C 610 130, 520 115, 450 92 C 415 82, 375 78, 340 78 L 341 96 L 338 116 L 342 138 L 365 138 C 450 138, 560 145, 680 152 Z"
              fill="#1e293b"
            />

            {/* Lapisan Kerak Basal Bantal (Pillow Basalt - Atas) */}
            <path
              d="M 680 135 C 610 130, 520 115, 450 92 C 415 82, 375 78, 340 78 L 341 96 L 338 116 L 365 116 C 450 116, 560 132, 680 140 Z"
              fill="#334155"
              stroke="#0f172a"
              strokeWidth="1.5"
            />

            {/* Lapisan Sedimen Laut Pelagik */}
            <path
              d="M 680 135 C 620 131, 550 118, 490 102 L 490 106 C 550 122, 620 135, 680 139 Z"
              fill="#fef08a"
              opacity="0.85"
            />

            {/* Patahan Normal & Blok Sesar Berundak */}
            <line x1="405" y1="83" x2="405" y2="135" stroke="#0f172a" strokeWidth="2" />
            <line x1="382" y1="81" x2="382" y2="140" stroke="#0f172a" strokeWidth="2" />
            <line x1="358" y1="79" x2="358" y2="155" stroke="#0f172a" strokeWidth="2" />

            {/* Cerobong Hidrotermal (Black Smoker Kanan) */}
            <path d="M 346 80 L 349 68 L 353 68 L 356 80 Z" fill="#18181b" stroke="#78350f" strokeWidth="1" />

            {/* Vektor Arah Pemekaran (Panah Bersih Tanpa Teks) */}
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

      <div className="w-full flex-1 min-h-0 relative flex items-center justify-center overflow-hidden p-2 sm:p-4">
        {activeLandform === 'trench' && <TrenchIllustration />}
        {activeLandform === 'mountains' && <FoldedMountainsIllustration />}
        {activeLandform === 'volcano' && <VolcanoIllustration />}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GAMBAR 1: PALUNG LAUT DALAM (DEEP SEA TRENCH)
// ─────────────────────────────────────────────────────────────────────────────
function TrenchIllustration() {
  return (
    <svg viewBox="0 0 560 250" className="w-full h-full object-contain" shapeRendering="geometricPrecision">
      <defs>
        <linearGradient id="tSkyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#bae6fd" />
        </linearGradient>
        <linearGradient id="tWaterGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="15%" stopColor="#0369a1" />
          <stop offset="40%" stopColor="#1e3a8a" />
          <stop offset="70%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
        <linearGradient id="subLightCone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
          <stop offset="40%" stopColor="#7dd3fc" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="rockWallGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#44403c" />
          <stop offset="50%" stopColor="#292524" />
          <stop offset="100%" stopColor="#1c1917" />
        </linearGradient>
        <linearGradient id="everestDepthTint" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.1" />
          <stop offset="35%" stopColor="#0284c7" stopOpacity="0.25" />
          <stop offset="70%" stopColor="#0f172a" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#020617" stopOpacity="0.92" />
        </linearGradient>
        <linearGradient id="yellowBandGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a8a29e" />
          <stop offset="40%" stopColor="#d6d3d1" />
          <stop offset="70%" stopColor="#78716c" />
          <stop offset="100%" stopColor="#57534e" />
        </linearGradient>
        <linearGradient id="sunlitSnowGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#f0f9ff" />
          <stop offset="100%" stopColor="#bae6fd" />
        </linearGradient>
        <linearGradient id="shadedIceGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
      </defs>

      {/* 1. Langit Permukaan Laut */}
      <rect x="0" y="0" width="560" height="38" fill="url(#tSkyGrad)" />
      <circle cx="280" cy="12" r="9" fill="#fef08a" />
      <circle cx="280" cy="12" r="16" fill="#fde047" opacity="0.3" />
      <path d="M 120,12 Q 124,8 128,12 Q 132,8 136,12" fill="none" stroke="#0369a1" strokeWidth="1" />
      <path d="M 390,14 Q 394,10 398,14 Q 402,10 406,14" fill="none" stroke="#0369a1" strokeWidth="1" />

      {/* 2. Kolom Air Samudra */}
      <rect x="0" y="38" width="560" height="212" fill="url(#tWaterGrad)" />
      <polygon points="260,38 275,38 295,95 240,95" fill="#bae6fd" opacity="0.18" />
      <polygon points="285,38 298,38 340,95 290,95" fill="#bae6fd" opacity="0.15" />
      <line x1="0" y1="38" x2="560" y2="38" stroke="#38bdf8" strokeWidth="1.5" />

      {/* 3. Kapal Riset Kelautan */}
      <g>
        <polygon points="190,26 248,26 242,38 196,38" fill="#f8fafc" stroke="#0f172a" strokeWidth="1" />
        <line x1="192" y1="31" x2="246" y2="31" stroke="#1d4ed8" strokeWidth="1.5" />
        <line x1="196" y1="38" x2="242" y2="38" stroke="#dc2626" strokeWidth="1.5" />
        <rect x="202" y="18" width="22" height="8" fill="#f8fafc" stroke="#0f172a" strokeWidth="1" />
        <rect x="204" y="20" width="4" height="3" fill="#38bdf8" />
        <rect x="210" y="20" width="4" height="3" fill="#38bdf8" />
        <rect x="216" y="20" width="4" height="3" fill="#38bdf8" />
        <line x1="213" y1="18" x2="213" y2="12" stroke="#475569" strokeWidth="1" />
        <circle cx="213" cy="11" r="2" fill="#e2e8f0" />
        <polygon points="234,26 238,18 240,18 238,26" fill="#334155" />
        <line x1="239" y1="18" x2="239" y2="135" stroke="#38bdf8" strokeWidth="1" opacity="0.6" />
        <rect x="200" y="14" width="4" height="2" fill="#ef4444" />
        <rect x="200" y="16" width="4" height="2" fill="#ffffff" />
      </g>

      {/* 4. Dinding Tebing Karang Ngarai Palung */}
      <polygon
        points="55,55 110,65 145,100 170,140 195,190 220,246 0,246 0,55"
        fill="url(#rockWallGrad)"
        stroke="#1c1917"
        strokeWidth="1.5"
      />
      <path d="M 60,65 L 105,72 L 135,115 L 165,155 L 190,210" fill="none" stroke="#57534e" strokeWidth="1" />
      <path d="M 95,95 L 125,105 L 140,145 L 175,195" fill="none" stroke="#1c1917" strokeWidth="1.5" />
      <text x="65" y="70" fill="#a8a29e" fontSize="9.5" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">LANDASAN BENUA</text>
      <text x="105" y="115" fill="#78716c" fontSize="9.5" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">LERENG BENUA</text>

      <polygon
        points="370,110 330,125 295,160 265,210 245,246 560,246 560,110"
        fill="url(#rockWallGrad)"
        stroke="#1c1917"
        strokeWidth="1.5"
      />
      <path d="M 355,120 L 320,135 L 290,175 L 260,225" fill="none" stroke="#57534e" strokeWidth="1" />
      <path d="M 330,150 L 305,185 L 280,230" fill="none" stroke="#1c1917" strokeWidth="1.5" />

      {/* Dasar Palung Terdalam */}
      <rect x="220" y="244" width="26" height="6" fill="#020617" />
      <line x1="220" y1="246" x2="246" y2="246" stroke="#0ea5e9" strokeWidth="1.5" />

      {/* 5. Lampu Sorot & Kapsul Selam Riset */}
      <polygon points="236,146 242,146 270,246 200,246" fill="url(#subLightCone)" />
      <g>
        <rect x="233" y="132" width="12" height="22" rx="5" fill="#facc15" stroke="#713f12" strokeWidth="1.2" />
        <circle cx="239" cy="138" r="3.5" fill="#38bdf8" stroke="#0284c7" strokeWidth="0.8" />
        <circle cx="238" cy="137" r="1" fill="#ffffff" />
        <rect x="230" y="140" width="3" height="6" rx="1" fill="#475569" />
        <rect x="245" y="140" width="3" height="6" rx="1" fill="#475569" />
        <circle cx="236" cy="146" r="1.5" fill="#fef08a" />
        <circle cx="242" cy="146" r="1.5" fill="#fef08a" />
      </g>

      {/* 6. Komparasi Mt. Everest */}
      <g id="realistic-mount-everest">
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
        <polygon
          points="250,246 530,246 500,205 440,195 380,210 320,195 270,215"
          fill="#0f172a"
        />
        <polygon points="280,246 320,205 340,246" fill="#334155" opacity="0.7" />
        <polygon points="360,246 390,212 420,246" fill="#334155" opacity="0.7" />
        <polygon points="440,246 470,208 500,246" fill="#334155" opacity="0.7" />

        <polygon
          points="
            370,95 390,78 410,95 
            425,125 450,165 470,210
            310,210 330,165 355,125
          "
          fill="url(#sunlitSnowGrad)"
        />

        <polygon
          points="390,78 410,95 425,125 450,165 470,210 505,215 485,185 460,150 435,120 410,95"
          fill="url(#shadedIceGrad)"
          opacity="0.85"
        />

        <polygon
          points="355,120 435,120 442,132 350,132"
          fill="url(#yellowBandGrad)"
          stroke="#44403c"
          strokeWidth="1"
        />
        <polygon
          points="348,135 444,135 447,144 345,144"
          fill="#334155"
          stroke="#1e293b"
          strokeWidth="0.8"
        />

        <polygon points="390,78 375,98 405,98" fill="#ffffff" />
        <polygon points="390,78 405,98 395,102 388,88" fill="#0f172a" opacity="0.65" />
        <polygon points="390,78 392,84 388,84" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.5" />

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

        <polygon
          points="
            390,78 
            410,95 435,120 460,150 485,185 515,220 530,246
            250,246 265,220 295,185 320,150 345,120 370,95
          "
          fill="url(#everestDepthTint)"
        />

        <line
          x1="55"
          y1="78"
          x2="390"
          y2="78"
          stroke="#38bdf8"
          strokeWidth="1.2"
          opacity="0.8"
        />
        <circle cx="390" cy="78" r="3" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.2" />

        <g id="everest-callout">
          <rect
            x="250"
            y="38"
            width="280"
            height="34"
            rx="4"
            fill="#082f49"
            stroke="#38bdf8"
            strokeWidth="1.5"
          />
          <text x="390" y="52" fill="#fef08a" fontSize="10.5" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">
            ▲ MT. EVEREST (8.848 m)
          </text>
          <text x="390" y="65" fill="#7dd3fc" fontSize="8.5" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">
            Puncak Tertinggi Bumi Tenggelam &gt;2.000 m di Palung!
          </text>
          <polygon points="386,72 394,72 390,78" fill="#38bdf8" />
        </g>
      </g>

      {/* Skala Kedalaman */}
      <g>
        <line x1="32" y1="38" x2="32" y2="246" stroke="#94a3b8" strokeWidth="1" />
        <line x1="28" y1="38" x2="36" y2="38" stroke="#94a3b8" strokeWidth="1" />
        <text x="26" y="41" fill="#bae6fd" fontSize="8" textAnchor="end" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">0 m</text>
        <line x1="28" y1="65" x2="36" y2="65" stroke="#94a3b8" strokeWidth="1" />
        <text x="26" y="68" fill="#7dd3fc" fontSize="8" textAnchor="end" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">200 m</text>
        <line x1="28" y1="105" x2="36" y2="105" stroke="#94a3b8" strokeWidth="1" />
        <text x="26" y="108" fill="#93c5fd" fontSize="8" textAnchor="end" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">1.000 m</text>
        <line x1="28" y1="165" x2="36" y2="165" stroke="#94a3b8" strokeWidth="1" />
        <text x="26" y="168" fill="#cbd5e1" fontSize="8" textAnchor="end" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">4.000 m</text>
        <line x1="28" y1="246" x2="36" y2="246" stroke="#facc15" strokeWidth="1.5" />
        <text x="26" y="248" fill="#facc15" fontSize="8.5" textAnchor="end" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">11.000 m</text>
      </g>

      <rect x="155" y="232" width="150" height="15" rx="3" fill="#020617" stroke="#38bdf8" strokeWidth="1.2" />
      <text x="230" y="243" fill="#38bdf8" fontSize="8.5" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">
        CHALLENGER DEEP: 11.034 m
      </text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GAMBAR 2: RANTAI PEGUNUNGAN LIPATAN (FOLDED MOUNTAINS)
// ─────────────────────────────────────────────────────────────────────────────
function FoldedMountainsIllustration() {
  return (
    <svg viewBox="0 0 560 250" className="w-full h-full object-contain" shapeRendering="geometricPrecision">
      <defs>
        <linearGradient id="alpSkyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="60%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#e0f2fe" />
        </linearGradient>
        <linearGradient id="layerSediment" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ca8a04" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#a16207" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="560" height="105" fill="url(#alpSkyGrad)" />
      <circle cx="90" cy="25" r="10" fill="#fef08a" />
      <circle cx="90" cy="25" r="18" fill="#fde047" opacity="0.3" />
      <path d="M 440,25 Q 445,18 450,25 Q 455,18 460,25" fill="none" stroke="#0f172a" strokeWidth="1.2" />

      {/* Barisan Puncak Lipatan Depan */}
      <polygon points="0,105 90,48 180,105" fill="#64748b" />
      <polygon points="90,48 180,105 150,105" fill="#475569" />
      <polygon points="75,58 90,48 105,58 95,65 85,65" fill="#f8fafc" />

      <polygon points="170,105 280,24 390,105" fill="#64748b" />
      <polygon points="280,24 390,105 340,105" fill="#334155" />
      <polygon points="260,38 280,24 300,38 290,48 275,50 268,44" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />

      <polygon points="380,105 460,42 540,105" fill="#64748b" />
      <polygon points="460,42 540,105 500,105" fill="#475569" />
      <polygon points="445,52 460,42 475,52 465,60 455,60" fill="#f8fafc" />

      <rect x="0" y="98" width="560" height="7" fill="#15803d" />
      {[40, 70, 110, 140, 200, 230, 330, 360, 410, 490, 520].map((tx, idx) => (
        <polygon key={idx} points={`${tx},98 ${tx + 3},91 ${tx + 6},98`} fill="#14532d" />
      ))}

      {/* Penampang Bawah Tanah: Lipatan Batuan */}
      <rect x="0" y="105" width="560" height="145" fill="#1e293b" />

      <path
        d="M 0,105 Q 60,78 120,108 Q 200,150 280,105 Q 360,150 440,108 Q 500,78 560,105 L 560,135 Q 500,108 440,138 Q 360,180 280,135 Q 200,180 120,138 Q 60,108 0,135 Z"
        fill="url(#layerSediment)"
        stroke="#78350f"
        strokeWidth="1.5"
      />
      <path
        d="M 0,135 Q 60,108 120,138 Q 200,180 280,135 Q 360,180 440,138 Q 500,108 560,135 L 560,165 Q 500,138 440,168 Q 360,210 280,165 Q 200,210 120,168 Q 60,138 0,165 Z"
        fill="#475569"
        stroke="#0f172a"
        strokeWidth="1.5"
      />
      <path
        d="M 0,165 Q 60,138 120,168 Q 200,210 280,165 Q 360,210 440,168 Q 500,138 560,165 L 560,195 Q 500,168 440,198 Q 360,240 280,195 Q 200,240 120,198 Q 60,168 0,195 Z"
        fill="#166534"
        stroke="#052e16"
        strokeWidth="1.5"
      />
      <path
        d="M 0,195 Q 60,168 120,198 Q 200,240 280,195 Q 360,240 440,198 Q 500,168 560,195 L 560,250 L 0,250 Z"
        fill="#7f1d1d"
        stroke="#450a0a"
        strokeWidth="1.5"
      />

      {/* Panah Kompresi */}
      <g>
        <rect x="15" y="165" width="72" height="20" rx="3" fill="#ea580c" stroke="#fef08a" strokeWidth="1.5" />
        <text x="24" y="179" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">TEKANAN</text>
        <polygon points="87,162 101,175 87,188" fill="#facc15" stroke="#78350f" strokeWidth="1" />
      </g>
      <g>
        <rect x="473" y="165" width="72" height="20" rx="3" fill="#ea580c" stroke="#fef08a" strokeWidth="1.5" />
        <text x="482" y="179" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">TEKANAN</text>
        <polygon points="473,162 459,175 473,188" fill="#facc15" stroke="#78350f" strokeWidth="1" />
      </g>

      {/* Label Antiklin & Sinklin */}
      <g>
        <rect x="200" y="68" width="160" height="22" rx="4" fill="#451a03" stroke="#f59e0b" strokeWidth="1.5" />
        <text x="280" y="83" fill="#fef08a" fontSize="9.5" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">
          PUNCAK LIPATAN (ANTIKLIN)
        </text>
        <line x1="280" y1="90" x2="280" y2="105" stroke="#f59e0b" strokeWidth="1.5" />
        <circle cx="280" cy="105" r="3" fill="#fef08a" />
      </g>
      <g>
        <rect x="130" y="195" width="160" height="22" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
        <text x="210" y="210" fill="#7dd3fc" fontSize="9.5" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">
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
// ─────────────────────────────────────────────────────────────────────────────
function VolcanoIllustration() {
  return (
    <svg viewBox="0 0 560 250" className="w-full h-full object-contain" shapeRendering="geometricPrecision">
      <defs>
        <linearGradient id="volSkyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#18181b" />
          <stop offset="60%" stopColor="#27272a" />
          <stop offset="100%" stopColor="#3f3f46" />
        </linearGradient>
        <radialGradient id="dapurMagmaGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="35%" stopColor="#f97316" />
          <stop offset="75%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </radialGradient>
        <linearGradient id="mantelGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#451a03" />
          <stop offset="100%" stopColor="#7c2d12" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="560" height="115" fill="url(#volSkyGrad)" />

      {/* Awan Abu Panas & Gas Vulkanik */}
      <g>
        <circle cx="330" cy="38" r="14" fill="#3f3f46" opacity="0.9" />
        <circle cx="318" cy="24" r="18" fill="#27272a" opacity="0.95" />
        <circle cx="342" cy="20" r="20" fill="#18181b" opacity="0.95" />
        <circle cx="368" cy="14" r="24" fill="#09090b" opacity="0.95" />
        <circle cx="395" cy="10" r="22" fill="#18181b" opacity="0.9" />
        <circle cx="325" cy="32" r="2.5" fill="#fef08a" />
        <circle cx="335" cy="22" r="2" fill="#f97316" />
        <circle cx="310" cy="18" r="1.5" fill="#ef4444" />
      </g>

      {/* Kerucut Stratovolcano */}
      <polygon points="170,115 320,48 340,48 490,115" fill="#1c1917" stroke="#09090b" strokeWidth="1.5" />
      <polygon points="330,48 490,115 420,115" fill="#0f172a" />
      <path d="M 324,50 Q 305,75 285,115" fill="none" stroke="#ef4444" strokeWidth="2.5" />
      <path d="M 324,50 Q 305,75 285,115" fill="none" stroke="#fef08a" strokeWidth="1" />
      <ellipse cx="330" cy="48" rx="10" ry="3" fill="#ef4444" />
      <ellipse cx="330" cy="48" rx="6" ry="1.5" fill="#fef08a" />

      <rect x="0" y="112" width="560" height="6" fill="#15803d" />
      <rect x="0" y="118" width="560" height="132" fill="#1e293b" />
      <rect x="0" y="175" width="560" height="75" fill="url(#mantelGrad)" />
      <text x="15" y="240" fill="#fed7aa" fontSize="9.5" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">
        ASTENOSFER MANTEL PANAS (SUHU &gt; 1.200°C)
      </text>

      {/* Lempeng Samudra Subduksi */}
      <polygon
        points="0,118 110,118 240,250 180,250 80,140 0,140"
        fill="#166534"
        stroke="#14532d"
        strokeWidth="1.5"
      />
      <text x="15" y="134" fill="#86efac" fontSize="9.5" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">
        LEMPENG SAMUDRA (MENUNJAM)
      </text>

      {/* Peleburan Batuan */}
      <g>
        <circle cx="190" cy="210" r="14" fill="#ea580c" opacity="0.6" />
        <circle cx="190" cy="210" r="7" fill="#fef08a" />
        <text x="210" y="215" fill="#fef08a" fontSize="9" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">PELEBURAN SLAB</text>
        <path d="M 205,200 Q 240,195 270,185" fill="none" stroke="#f97316" strokeWidth="2" />
      </g>

      {/* Dapur Magma Raksasa */}
      <g>
        <ellipse cx="330" cy="175" rx="55" ry="26" fill="url(#dapurMagmaGrad)" stroke="#ef4444" strokeWidth="2" />
        <ellipse cx="330" cy="175" rx="28" ry="12" fill="#fef08a" />
        <text x="330" y="178" fill="#450a0a" fontSize="10" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">
          DAPUR MAGMA (KANTUNG PIJAR)
        </text>
      </g>

      {/* Pipa Magma */}
      <polygon points="325,150 335,150 334,50 326,50" fill="#f97316" stroke="#ea580c" strokeWidth="1" />
      <polygon points="328,150 332,150 331,50 329,50" fill="#fef08a" />

      {/* Label */}
      <g>
        <rect x="230" y="82" width="200" height="20" rx="4" fill="#450a0a" stroke="#f87171" strokeWidth="1.5" />
        <text x="330" y="96" fill="#fef08a" fontSize="9.5" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" textAnchor="middle">
          BUSUR STRATOVOLCANO AKTIF
        </text>
      </g>
    </svg>
  );
}
