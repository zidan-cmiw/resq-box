// ── src/app/Level1/EarthDive/DiscoveryModal.tsx ──────────────────────────────────
// Modal Pop-Up Interaktif Titik Temuan Sains (Discovery Point) pada Earth Dive
// Menampilkan ilustrasi geologis realistik bergaya 2D retro pixel art murni tanpa emoji OS

import { useState } from 'react';
import type { DiscoveryPoint } from './earthDiveData';
import { retroAudio } from '../../../utils/retroAudio';
import PixelIcon from '../../../components/PixelIcon';
import { SeismographPlatesIllustration, TransformSanAndreasIllustration } from '../../Level2/DiscoveryModal';

interface DiscoveryModalProps {
  discovery: DiscoveryPoint;
  strataName: string;
  depthRange: string;
  tempRange: string;
  composition: string;
  onClose: () => void;
}

export default function DiscoveryModal({
  discovery,
  strataName,
  depthRange,
  tempRange,
  composition,
  onClose,
}: DiscoveryModalProps) {
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = () => {
    setIsSimulating(true);
    retroAudio.playSelect();
    setTimeout(() => setIsSimulating(false), 4500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm select-none animate-fadeIn">

      {/* ── MAIN PIXEL PARCHMENT BOARD ── */}
      <div className="relative w-full max-w-4xl bg-[#fef3c7] border-4 border-[#451a03] rounded-2xl p-4 sm:p-6 shadow-[0_12px_0_#1c0d02] text-[#451a03] font-pixel max-h-[96vh] overflow-y-auto">

        {/* Top Header */}
        <div className="flex items-center justify-between border-b-3 border-[#78350f] pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#b45309]/20 border border-[#b45309] flex items-center justify-center shrink-0">
              <PixelIcon name="search" size={16} className="text-[#92400e]" />
            </div>
            <div>
              <span className="text-[10px] text-[#b45309] font-pixel uppercase tracking-widest block">
                {[strataName, depthRange, tempRange].filter(Boolean).join(' • ')}
              </span>
              <h2 className="text-xs sm:text-sm md:text-base text-[#451a03] font-pixel-title font-bold">
                {discovery.title}
              </h2>
            </div>
          </div>
          <button
            onClick={() => {
              retroAudio.playSelect();
              onClose();
            }}
            className="w-8 h-8 rounded-lg bg-[#b45309] hover:bg-[#92400e] text-amber-100 border-2 border-[#451a03] font-pixel-title text-xs flex items-center justify-center cursor-pointer active:translate-y-0.5 shadow-[0_2px_0_#451a03] shrink-0"
            title="Tutup"
          >
            ✕
          </button>
        </div>

        {/* ── VISUAL ILLUSTRATION AREA (2D PIXEL ART SCIENTIFIC DIAGRAM) ── */}
        <div className="w-full h-[380px] sm:h-[450px] md:h-[500px] bg-[#0c0a09] border-3 border-[#78350f] rounded-xl overflow-hidden relative mb-3.5 flex items-center justify-center shadow-inner">
          {renderIllustration(discovery.illustrationType, isSimulating, handleSimulate)}
        </div>

        {/* ── SCIENCE FACT CONTENT (100% 2D PIXEL FONT) ── */}
        <div className="space-y-2.5 text-xs sm:text-sm text-[#291305]">
          <div className="bg-[#fde68a]/80 p-3 rounded-xl border-2 border-[#b45309]/50 shadow-xs">
            <p className="font-pixel text-xs sm:text-sm leading-relaxed text-[#291305] font-medium">
              {discovery.shortDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="bg-[#fffbeb] p-2.5 rounded-lg border-2 border-[#d97706]/40">
              <div className="flex items-center gap-1.5 mb-1">
                <PixelIcon name="mountain" size={12} className="text-[#b45309]" />
                <span className="font-pixel-title text-[9px] text-[#b45309]">
                  KOMPOSISI BATUAN
                </span>
              </div>
              <p className="font-pixel text-xs text-[#451a03] leading-normal font-semibold">
                {composition}
              </p>
            </div>

            <div className="bg-[#fffbeb] p-2.5 rounded-lg border-2 border-[#d97706]/40">
              <div className="flex items-center gap-1.5 mb-1">
                <PixelIcon name="bulb" size={12} className="text-[#b45309]" />
                <span className="font-pixel-title text-[9px] text-[#b45309]">
                  FAKTA GEOLOGI RESMI
                </span>
              </div>
              <p className="font-pixel text-xs text-[#451a03] leading-normal italic">
                {discovery.fact}
              </p>
            </div>
          </div>
        </div>

        {/* ── ACTION BUTTONS ── */}
        <div className="mt-4 pt-3 border-t-2 border-[#b45309]/40 flex justify-end">
          <button
            onClick={() => {
              retroAudio.playSelect();
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-50 border-3 border-[#451a03] shadow-[0_4px_0_#231206] text-xs font-pixel-title cursor-pointer active:translate-y-0.5 flex items-center gap-2"
          >
            <PixelIcon name="check" size={13} className="text-amber-200" />
            <span>SAYA MENGERTI!</span>
          </button>
        </div>

      </div>

    </div>
  );
}

// ── 2D RETRO PIXEL SVG ILLUSTRATIONS (REALISTIC SCIENTIFIC CROSS-SECTIONS) ───
function renderIllustration(
  type: DiscoveryPoint['illustrationType'],
  isSimulating: boolean = false,
  onSimulate?: () => void,
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
      return <ConvergentLandformsIllustration />;

    // ═════════════════════════════════════════════════════════════════════════
    // BATAS TRANSFORM (PERSIS LEVEL 2): SISMOGRAF & SESAR SAN ANDREAS
    // ═════════════════════════════════════════════════════════════════════════
    case 'seismograph-plates':
      return <SeismographPlatesIllustration />;

    case 'transform-sanandreas':
      return <TransformSanAndreasIllustration />;

    // ── 1. KERAK BUMI & LITOSFER (0 - 100 KM) ──────────────────────────────────
    // Komparasi Bersih: KERAK BENUA (Gunung Merapi, Tebal ~100 km) vs KERAK SAMUDRA (Lautan Samudra, Tebal 5-15 km)
    case 'crust':
      return (
        <svg viewBox="0 0 540 240" className="w-full h-full object-contain" shapeRendering="crispEdges">
          {/* Latar Belakang Kanvas */}
          <rect x="0" y="0" width="540" height="240" fill="#020617" />

          {/* ══════════════════════════════════════════════════════════════════════════
              PANEL KIRI: KERAK BENUA (DI BAWAH DARATAN - GUNUNG MERAPI & STRATA 100 KM)
              ══════════════════════════════════════════════════════════════════════════ */}
          <g id="panel-kerak-benua">
            {/* Langit Daratan */}
            <rect x="4" y="4" width="262" height="84" fill="#1e293b" />
            <rect x="4" y="55" width="262" height="33" fill="#334155" opacity="0.4" />

            {/* Matahari & Awan Merapi */}
            <rect x="18" y="34" width="10" height="10" fill="#fbbf24" />
            <rect x="190" y="32" width="34" height="6" fill="#64748b" opacity="0.6" />

            {/* Kepulan Asap Kawah Merapi */}
            <rect x="128" y="24" width="12" height="10" fill="#cbd5e1" opacity="0.85" />
            <rect x="132" y="16" width="14" height="8" fill="#f1f5f9" />

            {/* Kerucut Gunung Merapi */}
            <polygon points="52,88 134,36 216,88" fill="#475569" />
            <polygon points="134,36 216,88 134,88" fill="#334155" />
            {/* Rekahan Kawah Magma */}
            <rect x="130" y="35" width="8" height="3" fill="#ea580c" />
            <line x1="134" y1="38" x2="134" y2="48" stroke="#f97316" strokeWidth="1.5" />

            {/* Lereng Hijau & Vegetasi Permukaan */}
            <polygon points="40,88 72,78 104,88" fill="#15803d" />
            <polygon points="164,88 196,78 228,88" fill="#166534" />
            <line x1="4" y1="88" x2="266" y2="88" stroke="#22c55e" strokeWidth="2.5" />

            {/* ── Lapisan Strata Batuan Kerak Benua ── */}
            {/* Strata 1: Lapisan Sedimen & Tanah Permukaan */}
            <rect x="4" y="90" width="262" height="32" fill="#b45309" />
            <line x1="4" y1="106" x2="266" y2="106" stroke="#92400e" strokeWidth="1.5" strokeDasharray="8 4" />

            {/* Strata 2: Kerak Benua Atas (Granit / SiAl) */}
            <rect x="4" y="122" width="262" height="40" fill="#78350f" />
            <line x1="4" y1="142" x2="266" y2="142" stroke="#5c2508" strokeWidth="1.5" strokeDasharray="12 6" />

            {/* Strata 3: Kerak Benua Bawah (Kristalin Padat Menuju Moho) */}
            <rect x="4" y="162" width="262" height="33" fill="#4a044e" opacity="0.85" />

            {/* Batas Moho (Batas Bawah Kerak Benua) */}
            <line x1="4" y1="195" x2="266" y2="195" stroke="#f97316" strokeWidth="2.5" strokeDasharray="6 3" />

            {/* Mantel Bumi / Astenosfer di Bawah Kerak Benua */}
            <rect x="4" y="196" width="262" height="40" fill="#3e1806" />
            <line x1="4" y1="216" x2="266" y2="216" stroke="#ea580c" strokeWidth="1" strokeDasharray="8 6" />

            {/* ── Indikator Ketebalan Kerak Benua (~100 KM) ── */}
            <line x1="20" y1="90" x2="20" y2="195" stroke="#facc15" strokeWidth="2.5" />
            <polygon points="20,90 15,96 25,96" fill="#facc15" />
            <polygon points="20,195 15,189 25,189" fill="#facc15" />

            {/* Badge Keterangan Ketebalan Kerak Benua (Bersih, Rapi, Terpisah Sempurna) */}
            <rect x="32" y="124" width="224" height="38" rx="4" fill="#0f172a" stroke="#facc15" strokeWidth="1.5" />
            <text x="144" y="140" fill="#fef08a" fontSize="8" fontFamily="'Press Start 2P', monospace" textAnchor="middle">TEBAL: ~100 KM</text>
            <text x="144" y="153" fill="#fed7aa" fontSize="6.5" fontFamily="'Press Start 2P', monospace" textAnchor="middle">(50 MIL - DI BAWAH DARATAN)</text>

            {/* Judul Panel Kiri */}
            <rect x="14" y="8" width="242" height="22" rx="4" fill="#2e1065" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="135" y="23" fill="#fef08a" fontSize="9" fontFamily="'Press Start 2P', monospace" textAnchor="middle">1. KERAK BENUA</text>
          </g>

          {/* ══════════════════════════════════════════════════════════════════════════
              GARIS PEMISAH VERTIKAL DUA PANEL (DIVIDER EMAS TEGAS)
              ══════════════════════════════════════════════════════════════════════════ */}
          <rect x="268" y="4" width="4" height="232" fill="#f59e0b" />
          <rect x="269" y="6" width="2" height="228" fill="#fef08a" />

          {/* ══════════════════════════════════════════════════════════════════════════
              PANEL KANAN: KERAK SAMUDRA (DI BAWAH LAUTAN - AIR SAMUDRA & BASAL 5-15 KM)
              ══════════════════════════════════════════════════════════════════════════ */}
          <g id="panel-kerak-samudra">
            {/* Udara di Atas Lautan */}
            <rect x="274" y="4" width="262" height="34" fill="#0f172a" />

            {/* Permukaan Lautan Samudra */}
            <rect x="274" y="38" width="262" height="4" fill="#e0f2fe" />
            <line x1="274" y1="38" x2="536" y2="38" stroke="#ffffff" strokeWidth="2" strokeDasharray="8 4" />

            {/* Kolom Air Samudra Biru Dalam Menghujam ke Bawah */}
            <rect x="274" y="42" width="262" height="44" fill="#0ea5e9" />
            <rect x="274" y="86" width="262" height="44" fill="#0284c7" />
            <rect x="274" y="130" width="262" height="45" fill="#0369a1" />

            {/* Sinar Cahaya Menembus Air Laut */}
            <line x1="290" y1="42" x2="330" y2="120" stroke="#bae6fd" strokeWidth="1" opacity="0.3" strokeDasharray="6 4" />
            <line x1="470" y1="42" x2="510" y2="120" stroke="#bae6fd" strokeWidth="1" opacity="0.3" strokeDasharray="6 4" />

            {/* Label Kolom Lautan Samudra (Bersih, Rapi, Terpisah Sempurna) */}
            <rect x="316" y="80" width="180" height="38" rx="4" fill="#082f49" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="406" y="96" fill="#ffffff" fontSize="8" fontFamily="'Press Start 2P', monospace" textAnchor="middle">LAUTAN SAMUDRA</text>
            <text x="406" y="109" fill="#7dd3fc" fontSize="6.5" fontFamily="'Press Start 2P', monospace" textAnchor="middle">(KOLOM AIR DALAM)</text>

            {/* Dasar Lautan (Seafloor Sediments) */}
            <rect x="274" y="175" width="262" height="4" fill="#475569" />

            {/* ── Lapisan Kerak Samudra Tipis (Basal / SiMa - Bersih Tanpa Ovals/Bulat-Bulat) ── */}
            <rect x="274" y="179" width="262" height="16" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
            <line x1="274" y1="187" x2="536" y2="187" stroke="#334155" strokeWidth="1" strokeDasharray="10 5" />

            {/* Batas Moho di Bawah Kerak Samudra */}
            <line x1="274" y1="195" x2="536" y2="195" stroke="#f97316" strokeWidth="2.5" strokeDasharray="6 3" />

            {/* Mantel Bumi / Astenosfer di Bawah Kerak Samudra */}
            <rect x="274" y="196" width="262" height="40" fill="#3e1806" />
            <line x1="274" y1="216" x2="536" y2="216" stroke="#ea580c" strokeWidth="1" strokeDasharray="8 6" />

            {/* ── Indikator Ketebalan Kerak Samudra (5 - 15 KM) ── */}
            <line x1="290" y1="179" x2="290" y2="195" stroke="#38bdf8" strokeWidth="2.5" />
            <polygon points="290,179 285,184 295,184" fill="#38bdf8" />
            <polygon points="290,195 285,190 295,190" fill="#38bdf8" />

            {/* Badge Keterangan Ketebalan Kerak Samudra (Bersih, Rapi, Terpisah Sempurna) */}
            <rect x="304" y="168" width="224" height="38" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="416" y="184" fill="#38bdf8" fontSize="8" fontFamily="'Press Start 2P', monospace" textAnchor="middle">TEBAL: 5 - 15 KM</text>
            <text x="416" y="197" fill="#bae6fd" fontSize="6.5" fontFamily="'Press Start 2P', monospace" textAnchor="middle">(3 MIL - PADAT &amp; BERAT)</text>

            {/* Judul Panel Kanan */}
            <rect x="284" y="8" width="242" height="22" rx="4" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="405" y="23" fill="#7dd3fc" fontSize="9" fontFamily="'Press Start 2P', monospace" textAnchor="middle">2. KERAK SAMUDRA</text>
          </g>

          {/* Label Batas Moho & Mantel Bawah yang Membentang */}
          <text x="270" y="228" z="100000" fill="#ffffffff" fontSize="7" fontFamily="'Press Start 2P', monospace" textAnchor="middle">ASTENOSFER (MANTEL BUMI)</text>
        </svg>
      );

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
            <circle cx="0" cy="0" r="32" fill="none" stroke="#ea580c" strokeWidth="8" strokeDasharray="14 6" opacity="0.8" />
            <polygon points="-32,-6 -40,10 -24,10" fill="#ef4444" />
            <polygon points="32,6 40,-10 24,-10" fill="#38bdf8" />
            <text x="-25" y="4" fill="#ffffff" fontSize="7" fontFamily="'Press Start 2P'">KONVEKSI</text>
          </g>

          {/* Convection Roll Right */}
          <g transform="translate(420, 175)">
            <circle cx="0" cy="0" r="30" fill="none" stroke="#ea580c" strokeWidth="8" strokeDasharray="14 6" opacity="0.8" />
            <polygon points="30,-6 38,10 22,10" fill="#ef4444" />
            <polygon points="-30,6 -38,-10 -22,-10" fill="#38bdf8" />
            <text x="-25" y="4" fill="#ffffff" fontSize="7" fontFamily="'Press Start 2P'">KONVEKSI</text>
          </g>

          {/* ── DEHYDRATION MELTING & RISING MAGMA DIAPIRS ── */}
          {/* Magma Plumes rising to feed the volcano */}
          <path d="M 280,160 Q 300,100 310,55" fill="none" stroke="#f97316" strokeWidth="5" strokeDasharray="6 3" />
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
          <g transform="translate(100, 38)">
            <rect x="0" y="0" width="135" height="15" fill="#082f49" rx="3" stroke="#38bdf8" strokeWidth="1" />
            <text x="6" y="11" fill="#38bdf8" fontSize="7" fontFamily="'Press Start 2P'">PALUNG LAUT DALAM</text>
          </g>

          {/* Volcanic Arc Label */}
          <g transform="translate(325, 24)">
            <rect x="0" y="0" width="165" height="15" fill="#450a0a" rx="3" stroke="#f97316" strokeWidth="1" />
            <text x="6" y="11" fill="#fef08a" fontSize="7" fontFamily="'Press Start 2P'">BUSUR GUNUNG BERAPI</text>
          </g>

          {/* Subducting Plate Label */}
          <g transform="translate(15, 115)">
            <rect x="0" y="0" width="155" height="15" fill="#0f172a" rx="3" stroke="#64748b" strokeWidth="1" />
            <text x="6" y="11" fill="#cbd5e1" fontSize="7" fontFamily="'Press Start 2P'">LEMPENG MENUNJAM</text>
          </g>

          {/* Wadati-Benioff earthquakes label */}
          <g transform="translate(230, 85)">
            <rect x="0" y="0" width="165" height="14" fill="#7f1d1d" rx="2" stroke="#ef4444" strokeWidth="1" />
            <text x="5" y="10" fill="#fef08a" fontSize="6.5" fontFamily="'Press Start 2P'">FOKUS GEMPA SUBDUKSI</text>
          </g>

          {/* Bottom Asthenosphere Label */}
          <g transform="translate(150, 222)">
            <rect x="0" y="0" width="200" height="14" fill="#1c1917" rx="3" opacity="0.9" />
            <text x="6" y="10" fill="#fb923c" fontSize="7" fontFamily="'Press Start 2P'">ARUS KONVEKSI (540°C–1.600°C)</text>
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
          <path d="M 255,175 Q 255,145 235,140" fill="none" stroke="#fed7aa" strokeWidth="2" strokeDasharray="3 2" />
          <polygon points="230,140 238,136 237,144" fill="#fed7aa" />
          <path d="M 255,175 Q 255,145 275,140" fill="none" stroke="#fed7aa" strokeWidth="2" strokeDasharray="3 2" />
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

            <text x="60" y="127" fill="#f1f5f9" fontSize="8" fontFamily="'Pixelify Sans', sans-serif" fontWeight="bold">Plate</text>
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

            <text x="430" y="127" fill="#f1f5f9" fontSize="8" fontFamily="'Pixelify Sans', sans-serif" fontWeight="bold">Plate</text>
          </g>

          {/* ── LABEL TEKS RESMI SESUAI DIAGRAM ── */}
          <text x="210" y="165" fill="#fed7aa" fontSize="9" fontFamily="'Pixelify Sans', sans-serif" fontWeight="bold">Asthenosphere</text>

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

            <text x="430" y="127" fill="#f1f5f9" fontSize="8" fontFamily="'Pixelify Sans', sans-serif" fontWeight="bold">Plate</text>
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

            <text x="60" y="127" fill="#f1f5f9" fontSize="8" fontFamily="'Pixelify Sans', sans-serif" fontWeight="bold">Plate</text>
          </g>

          {/* Pijar Peleburan Magma di Mantel (Melting Zone) */}
          <g className="anim-conv-magma">
            <circle cx="295" cy="175" r="9" fill="#f97316" opacity="0.85" />
            <circle cx="295" cy="175" r="4.5" fill="#fef08a" />
          </g>

          {/* ── LABEL TEKS RESMI SESUAI DIAGRAM ── */}
          <text x="210" y="172" fill="#fed7aa" fontSize="9" fontFamily="'Pixelify Sans', sans-serif" fontWeight="bold">Asthenosphere</text>
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
            <line x1="247" y1="126" x2="280" y2="82" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="5 3" />
            <line x1="247" y1="148" x2="280" y2="104" stroke="#fed7aa" strokeWidth="1" strokeDasharray="5 3" />

            {/* Panah Merah Menunjuk MAJU / KE BAWAH searah pergeseran sesar transform */}
            <g>
              <polygon points="175,76 182,82 142,118 135,112" fill="#7f1d1d" />
              <polygon points="174,78 180,83 143,116 137,111" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
              <polygon points="152,126 122,126 130,98" fill="#7f1d1d" />
              <polygon points="150,124 125,124 132,101" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
              <polygon points="132,101 125,124 138,124" fill="#f87171" opacity="0.65" />
            </g>

            <text x="60" y="127" fill="#f1f5f9" fontSize="8" fontFamily="'Pixelify Sans', sans-serif" fontWeight="bold">Plate</text>
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

            <text x="430" y="127" fill="#f1f5f9" fontSize="8" fontFamily="'Pixelify Sans', sans-serif" fontWeight="bold">Plate</text>
          </g>

          {/* ── LABEL TEKS RESMI SESUAI DIAGRAM ── */}
          <text x="210" y="172" fill="#fed7aa" fontSize="9" fontFamily="'Pixelify Sans', sans-serif" fontWeight="bold">Asthenosphere</text>

        </svg>
      );

    // ══════════════════════════════════════════════════════════════════════════
    // ── 3A. ARUS KONVEKSI PANAS MANTEL BUMI (TERMAL 1.000°C - 3.700°C & 20 LEMPENG) ──
    // ══════════════════════════════════════════════════════════════════════════
    case 'mantle-convection':
      return (
        <svg viewBox="0 0 540 240" className="w-full h-full object-contain" shapeRendering="crispEdges">
          <style>{`
            @keyframes mantleCycle {
              0% { stroke-dashoffset: 48; }
              100% { stroke-dashoffset: 0; }
            }
            @keyframes thermalPulse {
              0%, 100% { opacity: 0.75; transform: scaleY(0.96); }
              50% { opacity: 1; transform: scaleY(1.04); }
            }
            .anim-mantle-flow { animation: mantleCycle 4s linear infinite; }
            .anim-thermal-pulse { animation: thermalPulse 3.5s ease-in-out infinite; transform-origin: 270px 220px; }
          `}</style>

          {/* Kanvas Latar Belakang - Gradien Mantel Bumi */}
          <rect x="0" y="0" width="540" height="240" fill="#090201" />

          <defs>
            <linearGradient id="mantleBgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1a0604" />
              <stop offset="40%" stopColor="#450a0a" />
              <stop offset="85%" stopColor="#7c2d12" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
            <linearGradient id="risingThermalGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#fef08a" />
            </linearGradient>
            <linearGradient id="sinkingColdGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#1e3a8a" />
              <stop offset="100%" stopColor="#450a0a" />
            </linearGradient>
          </defs>

          {/* Latar Belakang Gradien Termal Mantel */}
          <rect x="0" y="0" width="540" height="240" fill="url(#mantleBgGrad)" opacity="0.9" />

          {/* ══════════════════════════════════════════════════════════════════════════
              ATAS: LITOSFER & 20 LEMPENG TEKTONIK (SUHU ~540°C)
              ══════════════════════════════════════════════════════════════════════════ */}
          {/* Panah Gerak Lempeng di Atas (Hanya di Lempeng A dan Lempeng C, Sejajar di y=7) */}
          {/* Gerak Lempeng A (Menjauh ke Kiri) */}
          <line x1="82" y1="7" x2="118" y2="7" stroke="#fbbf24" strokeWidth="2" />
          <polygon points="74,7 82,3 82,11" fill="#fbbf24" />

          {/* Gerak Lempeng C (Menjauh ke Kanan) */}
          <line x1="422" y1="7" x2="458" y2="7" stroke="#fbbf24" strokeWidth="2" />
          <polygon points="466,7 458,3 458,11" fill="#fbbf24" />

          {/* ── 1. LEMPENG A: KERAK BENUA KIRI (y: 14 - 36, Bersih & Rapi) ── */}
          <g id="plate-a-continental">
            {/* Badan Batuan Granit Kerak Benua */}
            <rect x="20" y="14" width="155" height="22" fill="#78350f" stroke="#451a03" strokeWidth="1" />
            {/* Lapisan Tanah & Vegetasi Hijau Permukaan */}
            <rect x="20" y="14" width="155" height="3.5" fill="#15803d" />
            <line x1="20" y1="14" x2="175" y2="14" stroke="#22c55e" strokeWidth="1" />
            {/* Label Lempeng A */}
            <text x="97" y="29" fill="#fef08a" fontSize="7" fontFamily="'Press Start 2P'" textAnchor="middle">LEMPENG A</text>
          </g>

          {/* ── 2. LEMPENG B: KERAK SAMUDRA TENGAH (y: 14 - 36, Bersih Tanpa Celah Aneh) ── */}
          <g id="plate-b-oceanic">
            {/* Kolom Air Samudra Biru di Atas Kerak */}
            <rect x="181" y="14" width="178" height="7" fill="#0284c7" />
            <line x1="181" y1="14" x2="359" y2="14" stroke="#38bdf8" strokeWidth="1.5" />
            {/* Batuan Basal Kerak Samudra Padat */}
            <rect x="181" y="21" width="178" height="15" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
            <line x1="181" y1="21" x2="359" y2="21" stroke="#334155" strokeWidth="1" strokeDasharray="8 4" />
            {/* Label Lempeng B (Samudra) */}
            <text x="270" y="30" fill="#7dd3fc" fontSize="6.5" fontFamily="'Press Start 2P'" textAnchor="middle">LEMPENG B (SAMUDRA)</text>
          </g>

          {/* ── 3. LEMPENG C: KERAK BENUA KANAN (y: 14 - 36, Bersih & Rapi) ── */}
          <g id="plate-c-continental">
            {/* Badan Batuan Granit Kerak Benua */}
            <rect x="365" y="14" width="155" height="22" fill="#78350f" stroke="#451a03" strokeWidth="1" />
            {/* Lapisan Tanah & Vegetasi Hijau Permukaan */}
            <rect x="365" y="14" width="155" height="3.5" fill="#15803d" />
            <line x1="365" y1="14" x2="520" y2="14" stroke="#22c55e" strokeWidth="1" />
            {/* Label Lempeng C */}
            <text x="442" y="29" fill="#fef08a" fontSize="7" fontFamily="'Press Start 2P'" textAnchor="middle">LEMPENG C</text>
          </g>

          {/* ══════════════════════════════════════════════════════════════════════════
              TENGAH: DUA SEL ARUS KONVEKSI TERMAL RAKSASA (SEL KIRI & SEL KANAN)
              ══════════════════════════════════════════════════════════════════════════ */}
          {/* SEL 1: Konveksi Kiri (Counter-Clockwise) */}
          <g id="convection-cell-left">
            {/* Jalur Lingkaran Aliran Konveksi */}
            <path
              d="M 180,205 C 180,120 180,80 120,60 C 60,80 60,140 60,185 C 60,215 120,225 180,205 Z"
              fill="none"
              stroke="#fb923c"
              strokeWidth="6"
              strokeDasharray="14 6"
              className="anim-mantle-flow"
              opacity="0.85"
            />
            {/* Kolom Termal Panas Naik di Kanan Sel 1 */}
            <path d="M 170,210 Q 185,130 180,50" stroke="url(#risingThermalGrad)" strokeWidth="8" fill="none" opacity="0.7" />
            {/* Kolom Batuan Dingin Tenggelam di Kiri Sel 1 */}
            <path d="M 60,60 Q 55,130 65,190" stroke="url(#sinkingColdGrad)" strokeWidth="6" fill="none" opacity="0.6" />

            {/* Panah Indikator Arah Aliran Panas Naik */}
            <polygon points="180,110 174,122 186,122" fill="#fef08a" />
            <polygon points="180,75 174,87 186,87" fill="#ffffff" />
            {/* Panah Indikator Arah Dingin Turun */}
            <polygon points="60,130 54,118 66,118" fill="#38bdf8" />

            {/* Label Pusat Sel */}
            <rect x="82" y="125" width="76" height="20" rx="3" fill="#1c0f08" stroke="#f97316" strokeWidth="1" />
            <text x="120" y="139" fill="#fed7aa" fontSize="7" fontFamily="'Press Start 2P'" textAnchor="middle">SEL 1</text>
          </g>

          {/* SEL 2: Konveksi Kanan (Clockwise) */}
          <g id="convection-cell-right">
            {/* Jalur Lingkaran Aliran Konveksi */}
            <path
              d="M 360,205 C 360,120 360,80 420,60 C 480,80 480,140 480,185 C 480,215 420,225 360,205 Z"
              fill="none"
              stroke="#fb923c"
              strokeWidth="6"
              strokeDasharray="14 6"
              className="anim-mantle-flow"
              opacity="0.85"
            />
            {/* Kolom Termal Panas Naik di Kiri Sel 2 (Pusat Mantle Plume Upwelling) */}
            <path d="M 370,210 Q 355,130 360,50" stroke="url(#risingThermalGrad)" strokeWidth="8" fill="none" opacity="0.7" />
            {/* Kolom Batuan Dingin Tenggelam di Kanan Sel 2 */}
            <path d="M 480,60 Q 485,130 475,190" stroke="url(#sinkingColdGrad)" strokeWidth="6" fill="none" opacity="0.6" />

            {/* Panah Indikator Arah Aliran Panas Naik */}
            <polygon points="360,110 354,122 366,122" fill="#fef08a" />
            <polygon points="360,75 354,87 366,87" fill="#ffffff" />
            {/* Panah Indikator Arah Dingin Turun */}
            <polygon points="480,130 474,118 486,118" fill="#38bdf8" />

            {/* Label Pusat Sel */}
            <rect x="382" y="125" width="76" height="20" rx="3" fill="#1c0f08" stroke="#f97316" strokeWidth="1" />
            <text x="420" y="139" fill="#fed7aa" fontSize="7" fontFamily="'Press Start 2P'" textAnchor="middle">SEL 2</text>
          </g>

          {/* ══════════════════════════════════════════════════════════════════════════
              BAWAH: BATAS INTI LUAR - MANTEL (CORE-MANTLE BOUNDARY / D'') - 3.700°C
              ══════════════════════════════════════════════════════════════════════════ */}
          <g className="anim-thermal-pulse">
            <rect x="0" y="210" width="540" height="30" fill="#ea580c" />
            <rect x="0" y="222" width="540" height="18" fill="#fef08a" />
            <line x1="0" y1="210" x2="540" y2="210" stroke="#ffffff" strokeWidth="2" strokeDasharray="8 4" />
          </g>

          {/* ══════════════════════════════════════════════════════════════════════════
              RETRO PIXEL LABELS & SCIENTIFIC DATA
              ══════════════════════════════════════════════════════════════════════════ */}
          {/* Upwelling Panas Tengah */}
          <rect x="215" y="80" width="110" height="24" rx="3" fill="#450a0a" stroke="#f97316" strokeWidth="1.5" />
          <text x="270" y="93" fill="#fef08a" fontSize="6.5" fontFamily="'Press Start 2P'" textAnchor="middle">ARUS PANAS NAIK</text>
          <text x="270" y="101" fill="#fed7aa" fontSize="5.5" fontFamily="'Press Start 2P'" textAnchor="middle">(MEMUAI &amp; RINGAN)</text>

          {/* Sinking Kiri & Kanan */}
          <rect x="8" y="160" width="105" height="22" rx="3" fill="#082f49" stroke="#38bdf8" strokeWidth="1" />
          <text x="60" y="171" fill="#7dd3fc" fontSize="5.5" fontFamily="'Press Start 2P'" textAnchor="middle">BATUAN MENIKUK</text>
          <text x="60" y="179" fill="#bae6fd" fontSize="5" fontFamily="'Press Start 2P'" textAnchor="middle">DINGIN TENGGELAM</text>

        </svg>
      );

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
          <path d="M 0,35 Q 80,45 150,20 Q 220,5 280,30 Q 360,15 540,40" stroke="#ea580c" strokeWidth="2" fill="none" strokeDasharray="12 8" />
          <path d="M 0,205 Q 120,195 240,215 Q 360,200 540,210" stroke="#7f1d1d" strokeWidth="10" fill="none" />
          <path d="M 0,205 Q 120,195 240,215 Q 360,200 540,210" stroke="#f97316" strokeWidth="3" fill="none" strokeDasharray="16 6" />

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
              <rect x="25" y="65" width="90" height="22" rx="3" fill="#1c0a02" stroke="#facc15" strokeWidth="1.5" />
              <text x="70" y="80" fill="#fef08a" fontSize="7.5" fontFamily="'Press Start 2P'" textAnchor="middle">(Mg,Fe)SiO3</text>
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
          <line x1="0" y1="24" x2="500" y2="24" stroke="#f59e0b" strokeWidth="2" strokeDasharray="8 4" />
          <text x="15" y="16" fill="#fef08a" fontSize="8" fontFamily="'Press Start 2P'">BATAS MANTEL ATAS (660 KM DISKONTINUITAS)</text>

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
              strokeDasharray="18 10"
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
          <line x1="0" y1="215" x2="500" y2="215" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="6 3" />

          {/* ── LABELS WITH RETRO PIXEL BACKINGS ── */}
          <g transform="translate(15, 60)">
            <text x="6" y="11" fill="#fef08a" fontSize="7.5" fontFamily="'Press Start 2P'">TEBAL: 2.900 KM (TERTEBAL!)</text>
          </g>

          <g transform="translate(15, 82)">
            <text x="0" y="0" fill="#fed7aa" fontSize="9" fontFamily="'Pixelify Sans'">Batuan padat mengalir kental (arus konveksi lambat)</text>
          </g>

          <g transform="translate(325, 45)">
            <rect x="0" y="0" width="165" height="15" fill="#7c2d12" rx="3" stroke="#fbbf24" strokeWidth="1" />
            <text x="6" y="11" fill="#fef08a" fontSize="7" fontFamily="'Press Start 2P'">MANTLE PLUME (HOTSPOT)</text>
          </g>
          <g transform="translate(325, 68)">
            <text x="0" y="0" fill="#fed7aa" fontSize="8.5" fontFamily="'Pixelify Sans'">Pipa panas dari batas inti bumi</text>
          </g>

          {/* CMB Bottom Label */}
          <g transform="translate(120, 226)">
            <text x="0" y="0" fill="#1c1917" fontSize="8" fontFamily="'Press Start 2P'">BATAS INTI-MANTEL (D&apos;&apos;) • ~3.700°C / 136 GPa</text>
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
            <rect x="0" y="0" width="205" height="22" rx="4" fill="#450a0a" />
            <text x="102" y="15" fill="#fef08a" fontSize="7" fontFamily="'Press Start 2P'" textAnchor="middle">SKALA TITIK LELEH</text>

            {/* Kolom Termometer Digital Retro */}
            <rect x="18" y="32" width="14" height="170" rx="4" fill="#080201" stroke="#451a03" strokeWidth="1" />
            {/* Air Raksa / Indikator Panas Termometer */}
            <rect x="20" y="34" width="10" height="166" rx="2" fill="url(#thermometerGrad)" />

            {/* Garis Penanda 1: Titik Leleh Nikel (Ni) -> 1.455°C */}
            <line x1="12" y1="148" x2="38" y2="148" stroke="#38bdf8" strokeWidth="2" />
            <rect x="42" y="139" width="154" height="20" rx="3" fill="#0c1d33" stroke="#38bdf8" strokeWidth="1" />
            <text x="47" y="149" fill="#7dd3fc" fontSize="5.5" fontFamily="'Press Start 2P'">LELEH NIKEL (Ni)</text>
            <text x="47" y="156" fill="#bae6fd" fontSize="5.5" fontFamily="'Press Start 2P'">1.455°C (TITIK LELEH)</text>

            {/* Garis Penanda 2: Titik Leleh Besi (Fe) -> 1.538°C */}
            <line x1="12" y1="116" x2="38" y2="116" stroke="#fbbf24" strokeWidth="2" />
            <rect x="42" y="107" width="154" height="20" rx="3" fill="#2e1403" stroke="#fbbf24" strokeWidth="1" />
            <text x="47" y="117" fill="#fde047" fontSize="5.5" fontFamily="'Press Start 2P'">LELEH BESI (Fe)</text>
            <text x="47" y="124" fill="#fed7aa" fontSize="5.5" fontFamily="'Press Start 2P'">1.538°C (TITIK LELEH)</text>

            {/* Garis Penanda 3: SUHU INTI LUAR -> ~5.000°C */}
            <line x1="12" y1="42" x2="38" y2="42" stroke="#ef4444" strokeWidth="3" />
            <rect x="42" y="33" width="154" height="26" rx="3" fill="#450a0a" stroke="#ef4444" strokeWidth="1.5" className="anim-heat-glow" />
            <text x="47" y="44" fill="#fca5a5" fontSize="6" fontFamily="'Press Start 2P'">INTI LUAR: ~5.000°C</text>
            <text x="47" y="54" fill="#ffffff" fontSize="5" fontFamily="'Press Start 2P'">(MELELEH JADI CAIRAN!)</text>

            {/* Indikator Panah Lampaui Titik Leleh */}
            <path d="M 120,64 L 120,100" stroke="#f87171" strokeWidth="2" strokeDasharray="3 2" />
            <polygon points="120,62 116,68 124,68" fill="#ef4444" />
            <text x="120" y="85" fill="#fca5a5" fontSize="5" fontFamily="'Press Start 2P'" textAnchor="middle">JAUH MELAMPAUI</text>
            <text x="120" y="93" fill="#fef08a" fontSize="5" fontFamily="'Press Start 2P'" textAnchor="middle">TITIK LEBUR LOGAM</text>

            {/* Rangkuman Kesimpulan Bawah */}
            <rect x="8" y="174" width="189" height="36" rx="3" fill="#080201" stroke="#f97316" strokeWidth="1" />
            <text x="102" y="186" fill="#fef08a" fontSize="5.5" fontFamily="'Press Start 2P'" textAnchor="middle">BUKAN BATUAN PADAT!</text>
            <text x="102" y="196" fill="#fed7aa" fontSize="5" fontFamily="'Press Start 2P'" textAnchor="middle">LOGAM BESI &amp; NIKEL CAIR</text>
            <text x="102" y="205" fill="#fca5a5" fontSize="5" fontFamily="'Press Start 2P'" textAnchor="middle">MELELEH SECARA TOTAL</text>
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
              <line x1="148" y1="184" x2="148" y2="84" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="10 5" className="anim-stream-cycle" />
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
                strokeDasharray="8 5"
                className="anim-stream-cycle"
                opacity="0.9"
              />
              {/* Sirkulasi Sel Kanan (Searah Jarum Jam / CW) */}
              <path
                d="M 152,180 C 152,110 176,94 216,94 C 260,94 274,118 274,138 C 274,160 260,180 216,180 C 186,180 162,180 152,180 Z"
                fill="none"
                stroke="#fef08a"
                strokeWidth="2"
                strokeDasharray="8 5"
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
                  <circle cx="0" cy="0" r="30" fill="none" stroke="#fef08a" strokeWidth="1.2" strokeDasharray="8 6" opacity="0.7" />
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
                  <circle cx="0" cy="0" r="30" fill="none" stroke="#fef08a" strokeWidth="1.2" strokeDasharray="8 6" opacity="0.7" />
                  {/* Partikel Listrik Statis Berputar */}
                  <circle cx="-20" cy="-18" r="1.5" fill="#67e8f9" />
                  <circle cx="22" cy="12" r="1.5" fill="#ffffff" />
                </g>

                {/* Mata Inti Pusaran Berdenyut Panas */}
                <circle cx="0" cy="0" r="6" fill="#ffffff" className="anim-eye-pulse" />
                <circle cx="0" cy="0" r="11" fill="none" stroke="#fef08a" strokeWidth="1.5" className="anim-eye-pulse" />


              </g>

              {/* 7. Badge Keterangan Bawah Panel Kanan (Berada di Dasar, Terpisah Bersih) */}
              <rect x="18" y="192" width="260" height="20" rx="3" fill="#080201" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="148" y="205" fill="#fef08a" fontSize="5.5" fontFamily="'Press Start 2P'" textAnchor="middle">GEODYNAMO: PUSARAN BESI-NIKEL 5.000°C</text>
            </g>

            {/* Header Kotak Kanan (Digambar di atas agar garis batasnya selalu tajam) */}
            <rect x="0" y="0" width="296" height="22" rx="4" fill="#78350f" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="148" y="15" fill="#fef08a" fontSize="7" fontFamily="'Press Start 2P'" textAnchor="middle">LAUTAN LOGAM CAIR 5.000°C</text>
          </g>
        </svg>
      );

    // ══════════════════════════════════════════════════════════════════════════
    // ── 4B. INTI LUAR — GEODYNAMO: PEMBANGKIT MEDAN MAGNET BUMI ───────────────
    // ══════════════════════════════════════════════════════════════════════════
    case 'geodynamo':
      return (
        <svg viewBox="0 0 540 240" className="w-full h-full object-contain" shapeRendering="crispEdges">
          <style>{`
            @keyframes solarWindFlow {
              0% { stroke-dashoffset: 48; }
              100% { stroke-dashoffset: 0; }
            }
            @keyframes magneticPulse {
              0%, 100% { stroke-width: 2; opacity: 0.7; }
              50% { stroke-width: 3.2; opacity: 1; }
            }
            @keyframes dynamoSpin {
              0% { stroke-dashoffset: 0; }
              100% { stroke-dashoffset: 32; }
            }
            .anim-solar-wind { animation: solarWindFlow 1.8s linear infinite; }
            .anim-mag-field { animation: magneticPulse 3.2s ease-in-out infinite; }
            .anim-dynamo-spin { animation: dynamoSpin 2.4s linear infinite; }
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
            <line
              key={i}
              x1="0"
              y1={35 + i * 28}
              x2="145"
              y2={35 + i * 28}
              stroke="#fbbf24"
              strokeWidth="2.5"
              strokeDasharray="12 6"
              className="anim-solar-wind"
            />
          ))}

          {/* Label Angin Matahari */}
          <rect x="8" y="10" width="165" height="18" rx="3" fill="#451a03" stroke="#fbbf24" strokeWidth="1" />
          <text x="90" y="22" fill="#fbbf24" fontSize="5.5" fontFamily="'Press Start 2P'" textAnchor="middle">ANGIN SURYA MEMATIKAN</text>

          {/* ── GELOMBANG KEJUT BUSUR MAGNETOSFER (BOW SHOCK WAVE) ── */}
          <path
            d="M 175,8 Q 120,120 175,232"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3.5"
            strokeDasharray="10 4"
            className="anim-mag-field"
          />
          {/* Efek pembelokan garis radiasi di sepanjang bow shock */}
          <path d="M 145,63 Q 165,40 210,12" fill="none" stroke="#fde047" strokeWidth="2" strokeDasharray="6 3" />
          <path d="M 145,175 Q 165,200 210,228" fill="none" stroke="#fde047" strokeWidth="2" strokeDasharray="6 3" />

          {/* ── POTONGAN BUMI & INTI BUMI DI TENGAH (EARTH CROSS SECTION) ── */}
          {/* Kerak & Mantel Luar */}
          <circle cx="330" cy="120" r="88" fill="#78350f" stroke="#92400e" strokeWidth="2" />
          {/* Lapisan Kerak Benua & Samudra di Permukaan Bumi */}
          <circle cx="330" cy="120" r="88" fill="none" stroke="#22c55e" strokeWidth="3" strokeDasharray="24 16" />
          <circle cx="330" cy="120" r="88" fill="none" stroke="#0284c7" strokeWidth="3" strokeDasharray="16 24" />

          {/* INTI LUAR CAIR MEMBARA (MOLTEN FE-NI AT 5.000°C - DINAMO GENERATOR) */}
          <circle cx="330" cy="120" r="62" fill="#ea580c" stroke="#f59e0b" strokeWidth="3" />

          {/* Pusaran Arus Putaran Dinamo di Inti Luar */}
          <ellipse cx="330" cy="94" rx="28" ry="11" fill="none" stroke="#fef08a" strokeWidth="3" strokeDasharray="8 4" className="anim-dynamo-spin" />
          <ellipse cx="330" cy="146" rx="28" ry="11" fill="none" stroke="#fef08a" strokeWidth="3" strokeDasharray="8 4" className="anim-dynamo-spin" />

          {/* INTI DALAM PADAT KRISTALIN DI PUSAT */}
          <circle cx="330" cy="120" r="26" fill="#fef08a" stroke="#ffffff" strokeWidth="2" />
          <text x="330" y="123" fill="#78350f" fontSize="6.5" fontFamily="'Press Start 2P'" textAnchor="middle">INTI</text>

          {/* ── GARIS GAYA MEDAN MAGNETIK BUMI (DIPOLAR MAGNETIC FIELD LOOPS) ── */}
          {/* Loop Utama Luar */}
          <path d="M 330,28 C 170,-45 170,285 330,212" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="14 5" className="anim-mag-field" />
          <path d="M 330,28 C 490,-45 490,285 330,212" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="14 5" className="anim-mag-field" />

          {/* Loop Dalam Sekunder */}
          <path d="M 330,52 C 215,8 215,232 330,188" fill="none" stroke="#818cf8" strokeWidth="2" strokeDasharray="10 4" />
          <path d="M 330,52 C 445,8 445,232 330,188" fill="none" stroke="#818cf8" strokeWidth="2" strokeDasharray="10 4" />

          {/* Cahaya Aurora di Kutub Magnetik */}
          <ellipse cx="330" cy="34" rx="16" ry="4" fill="#34d399" opacity="0.85" />
          <ellipse cx="330" cy="206" rx="16" ry="4" fill="#34d399" opacity="0.85" />

          {/* ── RETRO PIXEL BADGES DENGAN INFORMASI LENGKAP ── */}
          {/* Badge Perisai Magnetosfer */}
          <g transform="translate(185, 12)">
            <rect x="0" y="0" width="168" height="18" rx="3" fill="#082f49" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="84" y="12" fill="#38bdf8" fontSize="6" fontFamily="'Press Start 2P'" textAnchor="middle">PERISAI MAGNETOSFER</text>
          </g>

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
            <line x1="0" y1="32" x2="540" y2="32" stroke="#f59e0b" strokeWidth="2" strokeDasharray="10 4" />
            <line x1="0" y1="208" x2="540" y2="208" stroke="#f59e0b" strokeWidth="2" strokeDasharray="10 4" />

            {/* Riak Fluida Logam Meleleh di Inti Luar */}
            <line x1="10" y1="16" x2="160" y2="16" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="16 8" />
            <line x1="380" y1="16" x2="530" y2="16" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="16 8" />
            <line x1="20" y1="224" x2="180" y2="224" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="16 8" />
            <line x1="360" y1="224" x2="520" y2="224" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="16 8" />

            {/* Label Batas Diskontinuitas Lehmann */}
            <rect x="180" y="6" width="180" height="18" rx="3" fill="#450a0a" stroke="#f97316" strokeWidth="1" />
            <text x="270" y="18" fill="#fef08a" fontSize="5.5" fontFamily="'Press Start 2P'" textAnchor="middle">DISKONTINUITAS LEHMANN</text>

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
            <g transform="translate(10, 88)">
              <rect x="0" y="0" width="128" height="64" rx="4" fill="#450a0a" stroke="#ef4444" strokeWidth="1.5" />
              <rect x="4" y="4" width="120" height="15" rx="2" fill="#7f1d1d" />
              <text x="64" y="15" fill="#fca5a5" fontSize="5.5" fontFamily="'Press Start 2P'" textAnchor="middle">TEKANAN EKSTREM</text>
              <text x="64" y="32" fill="#ffffff" fontSize="7.5" fontFamily="'Press Start 2P'" textAnchor="middle">&gt;3,6 JUTA ATM</text>
              <text x="64" y="44" fill="#fef08a" fontSize="5.5" fontFamily="'Press Start 2P'" textAnchor="middle">(360 GIGAPASCAL)</text>
              <text x="64" y="56" fill="#fed7aa" fontSize="5" fontFamily="'Press Start 2P'" textAnchor="middle">KUNCI ATOM TETAP PADAT</text>
            </g>

            {/* Panel Kanan: Suhu Ekstrem */}
            <g transform="translate(402, 88)">
              <rect x="0" y="0" width="128" height="64" rx="4" fill="#78350f" stroke="#fbbf24" strokeWidth="1.5" />
              <rect x="4" y="4" width="120" height="15" rx="2" fill="#92400e" />
              <text x="64" y="15" fill="#fef08a" fontSize="5.5" fontFamily="'Press Start 2P'" textAnchor="middle">SUHU EKSTREM</text>
              <text x="64" y="32" fill="#ffffff" fontSize="7.5" fontFamily="'Press Start 2P'" textAnchor="middle">~6.000°C</text>
              <text x="64" y="44" fill="#fed7aa" fontSize="5.5" fontFamily="'Press Start 2P'" textAnchor="middle">(5.500°C – 6.000°C)</text>
              <text x="64" y="56" fill="#fde047" fontSize="5" fontFamily="'Press Start 2P'" textAnchor="middle">SEPANAS MATAHARI!</text>
            </g>

            {/* Banner Bawah: Dimensi Inti Dalam */}
            <g transform="translate(110, 212)">
              <rect x="-31" y="0" width="380" height="22" rx="3" fill="#0c0a09" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="160" y="15" fill="#fef08a" fontSize="6.5" fontFamily="'Press Start 2P'" textAnchor="middle">
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
              <rect x="18" y="14" width="164" height="18" rx="2" fill="#451a03" stroke="#f59e0b" strokeWidth="1" />
              <text x="100" y="26" fill="#fef08a" fontSize="5.5" fontFamily="'Press Start 2P'" textAnchor="middle">PENAMPANG KEDALAMAN</text>

              {/* Batang Strata Kedalaman */}
              {/* 1. Kerak Bumi (0 - 100 km) */}
              <rect x="22" y="38" width="50" height="14" fill="#15803d" />
              <rect x="74" y="38" width="110" height="14" fill="#1e293b" />
              <text x="78" y="48" fill="#86efac" fontSize="5" fontFamily="'Press Start 2P'">0-100 KM KERAK</text>

              {/* 2. Mantel Bumi (100 - 2.900 km) */}
              <rect x="22" y="54" width="50" height="38" fill="#b45309" />
              <rect x="74" y="54" width="110" height="38" fill="#261005" />
              <text x="78" y="70" fill="#fed7aa" fontSize="5" fontFamily="'Press Start 2P'">2.900 KM</text>
              <text x="78" y="82" fill="#f97316" fontSize="5" fontFamily="'Press Start 2P'">MANTEL PADAT</text>

              {/* 3. Inti Luar (2.900 - 5.150 km) */}
              <rect x="22" y="94" width="50" height="36" fill="#ea580c" />
              <rect x="74" y="94" width="110" height="36" fill="#3a0d04" />
              <text x="78" y="109" fill="#fed7aa" fontSize="5" fontFamily="'Press Start 2P'">5.150 KM</text>
              <text x="78" y="121" fill="#fde047" fontSize="5" fontFamily="'Press Start 2P'">INTI LUAR CAIR</text>

              {/* 4. Inti Dalam (5.150 - 6.371 km) */}
              <rect x="22" y="132" width="50" height="42" fill="#fef08a" />
              <rect x="74" y="132" width="110" height="42" fill="#451a03" />
              <text x="78" y="148" fill="#fef08a" fontSize="5" fontFamily="'Press Start 2P'">6.371 KM</text>
              <text x="78" y="160" fill="#ffffff" fontSize="5.5" fontFamily="'Press Start 2P'">INTI DALAM</text>
              <text x="78" y="170" fill="#fbbf24" fontSize="5" fontFamily="'Press Start 2P'">BOLA PADAT</text>

              {/* Garis Penanda Titik Pusat Mutlak */}
              <rect x="18" y="180" width="164" height="44" rx="3" fill="#2e1065" stroke="#a855f7" strokeWidth="1" />
              <text x="100" y="196" fill="#fef08a" fontSize="6.5" fontFamily="'Press Start 2P'" textAnchor="middle">PUSAT BUMI</text>
              <text x="100" y="210" fill="#e9d5ff" fontSize="5.5" fontFamily="'Press Start 2P'" textAnchor="middle">6.371 KILOMETER</text>
            </g>

            {/* ══════════════════════════════════════════════════════════════════════════
                PANEL KANAN: ALTAH KRISTAL HEKSAGONAL ANISOTROPI & SUMBU KUTUB BUMI
                ══════════════════════════════════════════════════════════════════════════ */}
            <g id="panel-kristal-anisotropi">
              <rect x="198" y="8" width="332" height="224" rx="4" fill="#0f0502" stroke="#d97706" strokeWidth="1.5" />

              {/* Garis Poros Rotasi Bumi (Sumbu Kutub Utara - Selatan) */}
              <line x1="364" y1="12" x2="364" y2="228" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="6 3" />

              {/* Label Poros Sumbu Rotasi */}
              <rect x="290" y="14" width="150" height="16" rx="2" fill="#082f49" stroke="#38bdf8" strokeWidth="1" />
              <text x="365" y="25" fill="#7dd3fc" fontSize="5.5" fontFamily="'Press Start 2P'" textAnchor="middle">▲ KUTUB UTARA</text>

              <rect x="290" y="210" width="150" height="16" rx="2" fill="#082f49" stroke="#38bdf8" strokeWidth="1" />
              <text x="365" y="221" fill="#7dd3fc" fontSize="5.5" fontFamily="'Press Start 2P'" textAnchor="middle">▼ KUTUB SELATAN</text>

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
                <line x1="0" y1="-62" x2="0" y2="62" stroke="#ffffff" strokeWidth="3" strokeDasharray="8 4" />

                {/* Titik Singularity Pusat Mutlak Bumi */}
                <circle cx="0" cy="0" r="7" fill="#ffffff" stroke="#fbbf24" strokeWidth="2" />
              </g>

              {/* Rambatan Gelombang Seismik P-Wave Melintasi Kutub */}
              <g transform="translate(230, 80)">
                <line x1="0" y1="0" x2="0" y2="76" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 3" />
                <polygon points="0,0 -4,10 4,10" fill="#38bdf8" />
                <polygon points="0,76 -4,66 4,66" fill="#38bdf8" />
                <rect x="8" y="24" width="76" height="28" rx="2" fill="#082f49" stroke="#38bdf8" strokeWidth="1" />
                <text x="46" y="36" fill="#38bdf8" fontSize="5" fontFamily="'Press Start 2P'" textAnchor="middle">GELOMBANG</text>
                <text x="46" y="46" fill="#ffffff" fontSize="5" fontFamily="'Press Start 2P'" textAnchor="middle">P-WAVE CEPAT</text>
              </g>

              {/* ── RETRO PIXEL BADGES PENJELASAN ── */}
              {/* Badge Gravitasi Netto Nol */}
              <g transform="translate(422, 60)">
                <rect x="0" y="0" width="100" height="52" rx="3" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5" />
                <text x="50" y="14" fill="#a5b4fc" fontSize="5" fontFamily="'Press Start 2P'" textAnchor="middle">GAYA GRAVITASI</text>
                <text x="50" y="28" fill="#ffffff" fontSize="7" fontFamily="'Press Start 2P'" textAnchor="middle">NETTO = 0</text>
                <text x="50" y="40" fill="#c7d2fe" fontSize="4.5" fontFamily="'Press Start 2P'" textAnchor="middle">TARIKAN SEIMBANG</text>
                <text x="50" y="48" fill="#c7d2fe" fontSize="4.5" fontFamily="'Press Start 2P'" textAnchor="middle">DARI SEGALA ARAH</text>
              </g>

              {/* Badge Anisotropi Kristal */}
              <g transform="translate(422, 126)">
                <rect x="0" y="0" width="100" height="52" rx="3" fill="#451a03" stroke="#f59e0b" strokeWidth="1.5" />
                <text x="50" y="14" fill="#fef08a" fontSize="5" fontFamily="'Press Start 2P'" textAnchor="middle">ANISOTROPI</text>
                <text x="50" y="26" fill="#ffffff" fontSize="5.5" fontFamily="'Press Start 2P'" textAnchor="middle">KRISTAL BESI</text>
                <text x="50" y="38" fill="#fed7aa" fontSize="4.5" fontFamily="'Press Start 2P'" textAnchor="middle">TERORIENTASI KE</text>
                <text x="50" y="47" fill="#fde047" fontSize="4.5" fontFamily="'Press Start 2P'" textAnchor="middle">POROS ROTASI</text>
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
            <line x1="20" y1="50" x2="60" y2="50" stroke="#7dd3fc" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
            <line x1="180" y1="170" x2="230" y2="170" stroke="#7dd3fc" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />

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
            <line x1="130" y1="65" x2="132" y2="165" stroke="#ef4444" strokeWidth="2" strokeDasharray="5 3" />

            {/* Panah Pemisahan Divergen di Pangea */}
            <polygon points="110,115 95,115 102,108 102,122" fill="#fef08a" />
            <polygon points="152,115 167,115 160,108 160,122" fill="#fef08a" />

            {/* Judul Panel Kiri */}
            <rect x="18" y="14" width="239" height="18" rx="3" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1" />
            <text x="137" y="26" fill="#fef08a" fontSize="6" fontFamily="'Press Start 2P'" textAnchor="middle">
              300 JUTA TAHUN LALU: PANGEA
            </text>

            {/* Keterangan Bawah Panel Kiri */}
            <rect x="18" y="194" width="239" height="32" rx="3" fill="#0f172a" stroke="#3b82f6" strokeWidth="1" />
            <text x="137" y="206" fill="#ffffff" fontSize="5.5" fontFamily="'Press Start 2P'" textAnchor="middle">
              SATU KESATUAN DARATAN
            </text>
            <text x="137" y="218" fill="#7dd3fc" fontSize="5" fontFamily="'Press Start 2P'" textAnchor="middle">
              DIKELILINGI SAMUDRA PANTHALASSA
            </text>
          </g>

          {/* ── DIVIDER TENGAH ── */}
          <line x1="270" y1="8" x2="270" y2="232" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 4" />

          {/* ── PANEL KANAN: BUMI SAAT INI (TERPECAH AKIBAT BATAS DIVERGEN) ── */}
          <g id="panel-benua-modern">
            <rect x="275" y="8" width="255" height="224" rx="4" fill="#0b132b" stroke="#f97316" strokeWidth="1.5" />

            {/* Samudra Modern */}
            <rect x="279" y="34" width="247" height="156" fill="#0284c7" opacity="0.65" />

            {/* Benua Amerika (Bergerak ke Kiri) */}
            <g className="anim-drift-left">
              <polygon points="310,75 345,70 340,110 325,115 315,100" fill="#15803d" stroke="#22c55e" strokeWidth="1.5" />
              <polygon points="325,120 348,125 340,165 320,155" fill="#166534" stroke="#22c55e" strokeWidth="1.5" />
              <text x="330" y="95" fill="#ffffff" fontSize="5" fontFamily="'Press Start 2P'" textAnchor="middle">AMERIKA</text>
              {/* Panah Gerak Menjauh ke Kiri */}
              <polygon points="305,118 290,118 298,111 298,125" fill="#ef4444" />
            </g>

            {/* Punggung Tengah Samudra Atlantik (Mid-Atlantic Ridge) di Tengah */}
            <path d="M 370,55 Q 365,110 375,175" fill="none" stroke="#ea580c" strokeWidth="3" strokeDasharray="6 3" />
            <path d="M 370,55 Q 365,110 375,175" fill="none" stroke="#fef08a" strokeWidth="1" />

            {/* Benua Afrika & Eurasia (Bergerak ke Kanan) */}
            <g className="anim-drift-right">
              <polygon points="395,65 470,60 480,95 440,105 390,95" fill="#15803d" stroke="#22c55e" strokeWidth="1.5" />
              <polygon points="395,108 435,105 445,150 415,165 390,135" fill="#166534" stroke="#22c55e" strokeWidth="1.5" />
              <text x="430" y="80" fill="#ffffff" fontSize="5" fontFamily="'Press Start 2P'" textAnchor="middle">EURASIA</text>
              <text x="418" y="130" fill="#ffffff" fontSize="5" fontFamily="'Press Start 2P'" textAnchor="middle">AFRIKA</text>
              {/* Panah Gerak Menjauh ke Kanan */}
              <polygon points="460,118 475,118 467,111 467,125" fill="#ef4444" />
            </g>

            {/* Judul Panel Kanan */}
            <rect x="283" y="14" width="239" height="18" rx="3" fill="#7c2d12" stroke="#f97316" strokeWidth="1" />
            <text x="402" y="26" fill="#fef08a" fontSize="6" fontFamily="'Press Start 2P'" textAnchor="middle">
              SEKARANG: 7 BENUA TERPISAH
            </text>

            {/* Keterangan Bawah Panel Kanan */}
            <rect x="283" y="194" width="239" height="32" rx="3" fill="#0f172a" stroke="#f97316" strokeWidth="1" />
            <text x="402" y="206" fill="#ffffff" fontSize="5.5" fontFamily="'Press Start 2P'" textAnchor="middle">
              LEMPENG BERGERAK MENJAUH
            </text>
            <text x="402" y="218" fill="#fed7aa" fontSize="5" fontFamily="'Press Start 2P'" textAnchor="middle">
              MEMBENTUK SAMUDRA BARU (ATLANTIK)
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
          <line x1="10" y1="45" x2="530" y2="45" stroke="#7c2d12" strokeWidth="1" strokeDasharray="8 4" opacity="0.4" />

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
            <line x1="6" y1="165" x2="216" y2="165" stroke="#52525b" strokeWidth="2" strokeDasharray="8 6" />
            {/* Bidang Sesar Normal Miring (Fault Plane) */}
            <line x1="185" y1="76" x2="230" y2="185" stroke="#ea580c" strokeWidth="2.5" />

            {/* Panah Merah Tarikan ke Kiri (Menjauh) */}
            <polygon points="120,105 70,105 70,98 45,112 70,126 70,119 120,119" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
            <text x="95" y="65" fill="#fef08a" fontSize="6" fontFamily="'Press Start 2P'" textAnchor="middle">
              TEBING BARAT
            </text>
          </g>

          {/* ── DASAR LEMBAH RETAKAN YANG AMBLES DI TENGAH (GRABEN RIFT FLOOR) ── */}
          <polygon points="210,135 330,135 315,185 225,185" fill="#18181b" stroke="#ea580c" strokeWidth="1.5" />
          {/* Batuan Basalt Magma Beku di Lantai Retakan */}
          <rect x="220" y="136" width="100" height="14" fill="#09090b" />
          <line x1="220" y1="140" x2="320" y2="140" stroke="#f97316" strokeWidth="1.5" strokeDasharray="4 2" />

          {/* ── BLOK SESAR KANAN (GUNUNG KEMBAR SISI TIMUR - MENJAUH KE KANAN) ── */}
          <g className="anim-rift-right">
            {/* Lereng Gunung Kembar Timur */}
            <polygon points="355,76 430,38 534,76 534,145 330,145" fill="#3f3f46" stroke="#18181b" strokeWidth="1.5" />
            <polygon points="395,55 430,38 465,48 455,76 415,76" fill="#71717a" />
            {/* Strata Kerak Benua Timur */}
            <rect x="324" y="145" width="210" height="40" fill="#27272a" />
            <line x1="324" y1="165" x2="534" y2="165" stroke="#52525b" strokeWidth="2" strokeDasharray="8 6" />
            {/* Bidang Sesar Normal Miring (Fault Plane) */}
            <line x1="355" y1="76" x2="310" y2="185" stroke="#ea580c" strokeWidth="2.5" />

            {/* Panah Merah Tarikan ke Kanan (Menjauh) */}
            <polygon points="420,105 470,105 470,98 495,112 470,126 470,119 420,119" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
            <text x="445" y="65" fill="#fef08a" fontSize="6" fontFamily="'Press Start 2P'" textAnchor="middle">
              TEBING TIMUR
            </text>
          </g>

          {/* ── RETRO PIXEL BADGES LENGKAP ── */}
          {/* Header Atas */}
          <rect x="80" y="10" width="380" height="20" rx="3" fill="#451a03" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="270" y="23" fill="#fef08a" fontSize="7" fontFamily="'Press Start 2P'" textAnchor="middle">
            EAST AFRICAN RIFT: LEMBAH RETAKAN
          </text>

          {/* Badge Lembah Ambles */}
          <rect x="180" y="102" width="180" height="24" rx="3" fill="#09090b" stroke="#f97316" strokeWidth="1.5" />
          <text x="270" y="113" fill="#fef08a" fontSize="5.5" fontFamily="'Press Start 2P'" textAnchor="middle">
            ▼ LEMBAH AMBLES (GRABEN)
          </text>
          <text x="270" y="122" fill="#fed7aa" fontSize="4.5" fontFamily="'Press Start 2P'" textAnchor="middle">
            CALON SAMUDRA BARU MASA DEPAN
          </text>

          {/* Banner Bawah */}
          <rect x="30" y="196" width="480" height="26" rx="3" fill="#0c0a09" stroke="#ea580c" strokeWidth="1.5" />
          <text x="270" y="208" fill="#ffffff" fontSize="6" fontFamily="'Press Start 2P'" textAnchor="middle">
            KERAK DITARIK SALING MENJAUH ➔ TANAH AMBLES
          </text>
          <text x="270" y="218" fill="#fde047" fontSize="5" fontFamily="'Press Start 2P'" textAnchor="middle">
            DIAPIT OLEH PEGUNUNGAN KEMBAR DI KEDUA SISINYA
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
          <line x1="80" y1="6" x2="110" y2="90" stroke="#bae6fd" strokeWidth="1" strokeDasharray="8 6" opacity="0.25" />
          <line x1="420" y1="6" x2="450" y2="90" stroke="#bae6fd" strokeWidth="1" strokeDasharray="8 6" opacity="0.25" />

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
            <text x="135" y="105" fill="#7dd3fc" fontSize="5.5" fontFamily="'Press Start 2P'" textAnchor="middle">
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
            <text x="405" y="105" fill="#7dd3fc" fontSize="5.5" fontFamily="'Press Start 2P'" textAnchor="middle">
              KERAK SAMUDRA KANAN
            </text>
          </g>

          {/* ── RETRO PIXEL BADGES PENJELASAN ── */}
          {/* Header Atas */}
          <rect x="70" y="10" width="400" height="20" rx="3" fill="#082f49" stroke="#38bdf8" strokeWidth="1.5" />
          <text x="270" y="23" fill="#ffffff" fontSize="6.5" fontFamily="'Press Start 2P'" textAnchor="middle">
            SEAFLOOR SPREADING: PEMEKARAN DASAR LAUT
          </text>

          {/* Label Tengah Ridge Axis */}
          <rect x="200" y="65" width="140" height="22" rx="3" fill="#1c0402" stroke="#ea580c" strokeWidth="1.5" />
          <text x="270" y="76" fill="#fef08a" fontSize="5" fontFamily="'Press Start 2P'" textAnchor="middle">
            MAGMA NAIK MEMBEKU
          </text>
          <text x="270" y="84" fill="#fed7aa" fontSize="4.5" fontFamily="'Press Start 2P'" textAnchor="middle">
            MENJADI BATUAN BASAL
          </text>

          {/* Banner Bawah */}
          <rect x="30" y="196" width="480" height="26" rx="3" fill="#0c0a09" stroke="#38bdf8" strokeWidth="1.5" />
          <text x="270" y="208" fill="#7dd3fc" fontSize="6" fontFamily="'Press Start 2P'" textAnchor="middle">
            LANTAI LAUTAN TERUS MELEBAR SETIAP TAHUN
          </text>
          <text x="270" y="218" fill="#fef08a" fontSize="5" fontFamily="'Press Start 2P'" textAnchor="middle">
            MEMBENTUK PUNGGUNG TENGAH SAMUDRA (MID-OCEAN RIDGE)
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
    ocean: '#93c5fd', // Light Azure Ocean
    shelf: '#475569', // Dark Gray Continental Shelf
    eurasia: '#c084fc', // Purple
    northAmerica: '#fb923c', // Coral Orange
    southAmerica: '#facc15', // Gold Yellow
    africa: '#84cc16', // Lime Green
    india: '#2dd4bf', // Turquoise
    antarctica: '#ea580c', // Deep Orange
    australia: '#3b82f6', // Royal Blue
    stroke: '#0f172a',
  };

  const plateDetails: Record<string, { title: string; desc: string }> = {
    eurasia: {
      title: 'EURASIA (Eropa & Asia)',
      desc: 'Massa daratan raksasa utara Pangea. Teluk Samudra Tethys menjorok ke sisi selatannya, dengan semenanjung panjang melengkung ke timur.',
    },
    northAmerica: {
      title: 'AMERIKA UTARA',
      desc: 'Menyatu erat dengan Eurasia di timur laut dan berhadapan langsung dengan pesisir barat laut Afrika.',
    },
    southAmerica: {
      title: 'AMERIKA SELATAN',
      desc: 'Bukti paling ikonik: Tonjolan timur Brasil mengunci secara presisi ke dalam Teluk Guinea di pesisir barat Afrika seperti teka-teki (puzzle)!',
    },
    africa: {
      title: 'AFRIKA',
      desc: 'Pusat poros Pangea! Bersentuhan langsung dengan Amerika Utara, Amerika Selatan, Eurasia, India, dan Antartika.',
    },
    india: {
      title: 'INDIA',
      desc: 'Kepingan benua yang terjepit di antara Afrika dan Antartika sebelum bergerak cepat melintasi Samudra Hindia menabrak Eurasia.',
    },
    antarctica: {
      title: 'ANTARTIKA',
      desc: 'Massa daratan di kutub selatan Pangea, dahulu beriklim tropis-hangat dan bersatu rapat dengan Australia.',
    },
    australia: {
      title: 'AUSTRALIA',
      desc: 'Melekat di pesisir timur benua Antartika sebelum retakan divergen memisahkannya ratusan juta tahun kemudian.',
    },
  };

  const activePlateInfo = selectedPlate ? plateDetails[selectedPlate] : null;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between bg-[#93c5fd] select-none p-1 sm:p-2 font-pixel overflow-hidden rounded-lg">
      {/* Top Header Mode Toggle */}
      <div className="w-full flex items-center justify-between px-3 py-1.5 bg-slate-900/95 border border-amber-500/70 rounded-xl text-xs z-10 shadow-md">
        <span className="text-amber-300 font-pixel-title font-bold flex items-center gap-2">
          <PixelIcon name="globe" size={15} className="text-amber-400" />
          <span>SUPERKONTINEN PANGEA (250 JUTA TAHUN LALU)</span>
        </span>
      </div>

      {/* Main SVG Pangea Map */}
      <div className="w-full flex-1 relative flex items-center justify-center overflow-hidden my-1">
        <svg
          viewBox="45 15 450 475"
          className="w-full h-full object-contain drop-shadow-xl"
        >
          {/* Lautan Samudra Panthalassa */}
          <rect x="-100" y="-100" width="800" height="800" fill={colors.ocean} />

          {/* Garis Grid Samudra Halus */}
          <line x1="0" y1="250" x2="540" y2="250" stroke="#60a5fa" strokeWidth="1" strokeDasharray="6 4" opacity="0.4" />
          <line x1="270" y1="0" x2="270" y2="500" stroke="#60a5fa" strokeWidth="1" strokeDasharray="6 4" opacity="0.4" />
          <text x="525" y="246" fill="#1e3a8a" fontSize="8" fontStyle="italic" textAnchor="end" opacity="0.6">Khatulistiwa Purba</text>
          <text x="25" y="35" fill="#1e3a8a" fontSize="10" fontWeight="bold" opacity="0.7">SAMUDRA PANTHALASSA</text>

          {/* Teluk Tethys Label */}
          <g transform="translate(345, 235)">
            <text x="0" y="0" fill="#1e3a8a" fontSize="9" fontWeight="bold" opacity="0.75" fontStyle="italic">
              Teluk Tethys
            </text>
            <path d="M -10 6 Q 15 2, 40 6" fill="none" stroke="#2563eb" strokeWidth="1.5" opacity="0.6" />
          </g>

          {/* Continental Shelf Margin */}
          <path
            d="M 170 30 C 220 20, 280 20, 340 38 C 390 55, 420 90, 440 120 C 465 145, 455 175, 430 185 C 405 190, 375 190, 340 205 C 310 220, 290 240, 280 265 C 310 285, 345 310, 360 335 C 385 370, 385 405, 360 440 C 335 465, 290 480, 240 475 C 195 470, 160 450, 140 430 C 110 400, 80 355, 65 310 C 55 265, 60 220, 60 175 C 60 135, 80 100, 110 75 C 135 55, 150 40, 170 30 Z"
            fill={colors.shelf}
            stroke={colors.stroke}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* EURASIA */}
          <g
            onMouseEnter={() => setSelectedPlate('eurasia')}
            onMouseLeave={() => setSelectedPlate(null)}
            onClick={() => setSelectedPlate('eurasia')}
            className="cursor-pointer transition-all hover:brightness-110"
          >
            <path
              d="M 145 68 C 165 48, 195 35, 230 30 C 275 25, 325 35, 365 60 C 395 80, 420 110, 435 135 C 450 160, 445 185, 425 190 C 410 190, 400 175, 380 170 C 350 175, 320 185, 290 195 C 260 205, 240 210, 230 205 C 215 200, 205 185, 190 165 C 175 145, 160 120, 145 95 C 140 85, 138 75, 145 68 Z"
              fill={colors.eurasia}
              stroke={selectedPlate === 'eurasia' ? '#fbbf24' : colors.stroke}
              strokeWidth={selectedPlate === 'eurasia' ? '3.5' : '2'}
              strokeLinejoin="round"
            />
            <text x="290" y="95" fill="#0f172a" fontSize="13" fontWeight="bold" textAnchor="middle">
              Eurasia
            </text>
          </g>

          {/* NORTH AMERICA */}
          <g
            onMouseEnter={() => setSelectedPlate('northAmerica')}
            onMouseLeave={() => setSelectedPlate(null)}
            onClick={() => setSelectedPlate('northAmerica')}
            className="cursor-pointer transition-all hover:brightness-110"
          >
            <path
              d="M 145 68 C 130 78, 110 78, 95 88 C 75 103, 65 128, 70 158 C 60 188, 65 218, 75 248 C 80 263, 90 278, 105 283 C 125 283, 140 278, 150 263 C 160 243, 155 218, 170 183 C 175 163, 165 138, 155 115 C 150 95, 140 80, 145 68 Z"
              fill={colors.northAmerica}
              stroke={selectedPlate === 'northAmerica' ? '#fbbf24' : colors.stroke}
              strokeWidth={selectedPlate === 'northAmerica' ? '3.5' : '2'}
              strokeLinejoin="round"
            />
            <text x="105" y="195" fill="#0f172a" fontSize="11" fontWeight="bold" textAnchor="middle">
              North
            </text>
            <text x="105" y="210" fill="#0f172a" fontSize="11" fontWeight="bold" textAnchor="middle">
              America
            </text>
          </g>

          {/* SOUTH AMERICA */}
          <g
            onMouseEnter={() => setSelectedPlate('southAmerica')}
            onMouseLeave={() => setSelectedPlate(null)}
            onClick={() => setSelectedPlate('southAmerica')}
            className="cursor-pointer transition-all hover:brightness-110"
          >
            <path
              d="M 105 283 C 85 288, 70 303, 75 328 C 80 353, 90 383, 110 413 C 125 433, 145 438, 155 428 C 165 408, 160 378, 170 348 C 180 328, 185 308, 175 293 C 165 278, 145 273, 125 283 Z"
              fill={colors.southAmerica}
              stroke={selectedPlate === 'southAmerica' ? '#fbbf24' : colors.stroke}
              strokeWidth={selectedPlate === 'southAmerica' ? '3.5' : '2'}
              strokeLinejoin="round"
            />
            <text x="110" y="340" fill="#0f172a" fontSize="11" fontWeight="bold" textAnchor="middle">
              South
            </text>
            <text x="110" y="355" fill="#0f172a" fontSize="11" fontWeight="bold" textAnchor="middle">
              America
            </text>
          </g>

          {/* AFRICA */}
          <g
            onMouseEnter={() => setSelectedPlate('africa')}
            onMouseLeave={() => setSelectedPlate(null)}
            onClick={() => setSelectedPlate('africa')}
            className="cursor-pointer transition-all hover:brightness-110"
          >
            <path
              d="M 150 263 C 165 278, 175 293, 170 328 C 160 358, 165 388, 180 413 C 200 423, 225 408, 245 383 C 265 358, 285 328, 280 298 C 275 268, 255 243, 245 223 C 240 208, 220 208, 195 203 C 170 218, 160 243, 150 263 Z"
              fill={colors.africa}
              stroke={selectedPlate === 'africa' ? '#fbbf24' : colors.stroke}
              strokeWidth={selectedPlate === 'africa' ? '3.5' : '2'}
              strokeLinejoin="round"
            />
            <text x="210" y="315" fill="#0f172a" fontSize="12" fontWeight="bold" textAnchor="middle">
              Africa
            </text>
          </g>

          {/* INDIA */}
          <g
            onMouseEnter={() => setSelectedPlate('india')}
            onMouseLeave={() => setSelectedPlate(null)}
            onClick={() => setSelectedPlate('india')}
            className="cursor-pointer transition-all hover:brightness-110"
          >
            <path
              d="M 280 298 C 295 303, 315 318, 320 338 C 315 358, 295 363, 280 358 C 265 353, 265 328, 280 298 Z"
              fill={colors.india}
              stroke={selectedPlate === 'india' ? '#fbbf24' : colors.stroke}
              strokeWidth={selectedPlate === 'india' ? '3.5' : '2'}
              strokeLinejoin="round"
            />
            <text x="295" y="338" fill="#0f172a" fontSize="9" fontWeight="bold" textAnchor="middle">
              India
            </text>
          </g>

          {/* ANTARCTICA */}
          <g
            onMouseEnter={() => setSelectedPlate('antarctica')}
            onMouseLeave={() => setSelectedPlate(null)}
            onClick={() => setSelectedPlate('antarctica')}
            className="cursor-pointer transition-all hover:brightness-110"
          >
            <path
              d="M 180 413 C 205 428, 235 438, 270 448 C 310 453, 340 438, 345 408 C 345 378, 330 358, 310 358 C 295 363, 280 358, 265 358 C 245 383, 225 408, 180 413 Z"
              fill={colors.antarctica}
              stroke={selectedPlate === 'antarctica' ? '#fbbf24' : colors.stroke}
              strokeWidth={selectedPlate === 'antarctica' ? '3.5' : '2'}
              strokeLinejoin="round"
            />
            <text x="260" y="420" fill="#0f172a" fontSize="11" fontWeight="bold" textAnchor="middle">
              Antarctica
            </text>
          </g>

          {/* AUSTRALIA */}
          <g
            onMouseEnter={() => setSelectedPlate('australia')}
            onMouseLeave={() => setSelectedPlate(null)}
            onClick={() => setSelectedPlate('australia')}
            className="cursor-pointer transition-all hover:brightness-110"
          >
            <path
              d="M 320 338 C 345 348, 375 373, 375 403 C 370 428, 345 438, 340 408 C 335 388, 330 358, 320 338 Z"
              fill={colors.australia}
              stroke={selectedPlate === 'australia' ? '#fbbf24' : colors.stroke}
              strokeWidth={selectedPlate === 'australia' ? '3.5' : '2'}
              strokeLinejoin="round"
            />
            <g transform="translate(345, 395) rotate(-35)">
              <text x="0" y="0" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                Australia
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* Bottom Interactive Educational Banner */}
      <div className="w-full bg-[#0f172a] border-2 border-amber-500/70 rounded-xl p-2 sm:p-2.5 text-slate-200 text-[10px] sm:text-xs z-10 flex items-center justify-between gap-2 shadow-md">
        {activePlateInfo ? (
          <div className="flex items-center gap-2 animate-fadeIn">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-pixel-title font-bold text-[10px] border border-amber-500/50 whitespace-nowrap">
              {activePlateInfo.title}
            </span>
            <span className="text-slate-300 font-medium leading-tight">
              {activePlateInfo.desc}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-400 italic">
            <PixelIcon name="bulb" size={12} className="text-amber-400" />
            <span className="text-amber-400 font-bold">PETUNJUK:</span>
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
      <line x1="0" y1="160" x2="600" y2="160" stroke="#0284c7" strokeWidth="1" strokeDasharray="6 4" opacity="0.4" />
      <line x1="300" y1="0" x2="300" y2="320" stroke="#0284c7" strokeWidth="1" strokeDasharray="6 4" opacity="0.4" />

      {/* Banner Judul */}
      <rect x="50" y="8" width="500" height="24" rx="4" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="1.5" />
      <text x="300" y="24" textAnchor="middle" fill="#fef08a" fontSize="8" fontWeight="bold">
        REKONSTRUKSI PANGEA: PENYATUAN AMERIKA UTARA, EROPA, &amp; AFRIKA
      </text>

      {/* AMERIKA UTARA */}
      <path
        d="M 50 140 L 80 100 L 110 70 L 150 50 L 190 40 L 220 55 L 245 45 L 255 75 L 245 95 L 235 125 L 225 155 L 205 190 L 195 225 L 165 240 L 135 220 L 110 185 L 85 180 L 60 165 Z"
        fill="#15803d"
        stroke="#166534"
        strokeWidth="2"
      />
      <text x="130" y="140" fill="#ffffff" fontSize="9" fontWeight="bold">
        AMERIKA UTARA
      </text>
      <text x="130" y="152" fill="#bbf7d0" fontSize="6.5">
        (Pesisir Timur / Pangea)
      </text>

      {/* EROPA */}
      <path
        d="M 260 45 L 310 35 L 355 45 L 395 70 L 420 50 L 450 75 L 430 110 L 390 125 L 360 135 L 330 120 L 305 130 L 275 110 L 260 75 Z"
        fill="#166534"
        stroke="#14532d"
        strokeWidth="2"
      />
      <text x="360" y="85" fill="#ffffff" fontSize="9" fontWeight="bold">
        EROPA
      </text>
      <text x="360" y="97" fill="#bbf7d0" fontSize="6.5">
        (Inggris, Skotlandia, &amp; Skandinavia)
      </text>

      {/* AFRIKA */}
      <path
        d="M 235 160 L 275 135 L 335 140 L 385 170 L 420 215 L 390 270 L 330 285 L 285 270 L 255 235 L 235 190 Z"
        fill="#9a3412"
        stroke="#78350f"
        strokeWidth="2"
      />
      <text x="310" y="210" fill="#ffffff" fontSize="9" fontWeight="bold">
        AFRIKA
      </text>
      <text x="310" y="222" fill="#fed7aa" fontSize="6.5">
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
      <rect x="15" y="235" width="205" height="38" rx="4" fill="#0f172a" stroke="#facc15" strokeWidth="1.5" />
      <text x="117" y="250" textAnchor="middle" fill="#facc15" fontSize="7.5" fontWeight="bold">
        PEG. APPALACHIAN (AMERIKA)
      </text>
      <text x="117" y="264" textAnchor="middle" fill="#cbd5e1" fontSize="6.5">
        Batuan Paleozoikum &amp; Umur Sama
      </text>
      <line x1="160" y1="235" x2="185" y2="215" stroke="#facc15" strokeWidth="1.5" strokeDasharray="3 2" />

      {/* Kotak Callout 2: Caledonian */}
      <rect x="360" y="115" width="225" height="38" rx="4" fill="#0f172a" stroke="#facc15" strokeWidth="1.5" />
      <text x="472" y="130" textAnchor="middle" fill="#facc15" fontSize="7.5" fontWeight="bold">
        PEG. CALEDONIAN (EROPA/UK)
      </text>
      <text x="472" y="144" textAnchor="middle" fill="#cbd5e1" fontSize="6.5">
        Struktur Lipatan Identik Sempurna
      </text>
      <line x1="390" y1="115" x2="330" y2="85" stroke="#facc15" strokeWidth="1.5" strokeDasharray="3 2" />

      {/* Footer Callout */}
      <rect x="40" y="285" width="520" height="24" rx="4" fill="#18181b" stroke="#38bdf8" strokeWidth="1.5" />
      <text x="300" y="301" textAnchor="middle" fill="#38bdf8" fontSize="7.5" fontWeight="bold">
        FAKTA: JIKA BENUA DISATUKAN, KEDUA RANTAI MEMBENTUK SATU SABUK UTUH!
      </text>
    </svg>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN 3: SIMULATOR PEMEKARAN DIVERGEN (PERSIS DENGAN LEVEL 2)
// ═════════════════════════════════════════════════════════════════════════════
function DivergentAnimIllustration({
  isSimulating,
  onSimulate,
}: {
  isSimulating: boolean;
  onSimulate?: () => void;
}) {
  return (
    <div className="w-full h-full relative flex flex-col items-center justify-between p-2">
      {/* Top Bar Button */}
      <div className="w-full flex items-center justify-between px-2 pb-1 border-b border-slate-800 z-10">
        <span className="text-[9px] font-pixel-title text-orange-400 font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
          SIMULATOR PEMEKARAN DIVERGEN (LEMPENG SALING MEMISAH)
        </span>
        <button
          onClick={onSimulate}
          disabled={isSimulating}
          className={`px-4 py-1.5 rounded text-white text-[9px] font-bold border-2 cursor-pointer font-pixel-title active:translate-y-0.5 transition-all flex items-center gap-1.5 ${isSimulating
              ? 'bg-orange-900 border-orange-950 opacity-80'
              : 'bg-orange-600 hover:bg-orange-500 border-orange-950 shadow-[0_3px_0_#7c2d12]'
            }`}
        >
          <PixelIcon name="zap" size={13} />
          <span>{isSimulating ? 'LEMPENG SEDANG MEMISAH...' : 'SIMULASI PEMISAHAN'}</span>
        </button>
      </div>

      {/* SVG Canvas Simulator */}
      <svg viewBox="0 0 540 240" className="w-full h-full object-contain" shapeRendering="crispEdges">
        {/* Mantle Asthenosphere Base */}
        <rect x="0" y="110" width="540" height="130" fill="#451a03" />
        <rect x="0" y="150" width="540" height="90" fill="#7c2d12" />

        {/* Kolom Air Samudra di Atas Kerak */}
        <rect x="0" y="30" width="540" height="50" fill="#0369a1" opacity="0.35" />
        <line x1="0" y1="30" x2="540" y2="30" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="8 4" />
        <text x="20" y="45" fill="#7dd3fc" fontSize="7" fontWeight="bold">SAMUDRA LAUTAN DALAM</text>

        {/* ARUS KONVEKSI MANTEL PEMISAH */}
        <path d="M 150 185 A 35 35 0 0 1 95 150" fill="none" stroke="#ea580c" strokeWidth="3" strokeDasharray="6 3" />
        <polygon points="90,152 96,140 104,150" fill="#ea580c" />
        <text x="135" y="210" fill="#fed7aa" fontSize="7.5" fontWeight="bold" textAnchor="middle">
          ARUS KONVEKSI &lt;&lt;
        </text>

        <path d="M 390 185 A 35 35 0 0 0 445 150" fill="none" stroke="#ea580c" strokeWidth="3" strokeDasharray="6 3" />
        <polygon points="450,152 444,140 436,150" fill="#ea580c" />
        <text x="405" y="210" fill="#fed7aa" fontSize="7.5" fontWeight="bold" textAnchor="middle">
          &gt;&gt; ARUS KONVEKSI
        </text>

        {/* ZONA LEMBAH RETAKAN TENGAH */}
        <rect x="235" y="80" width="70" height="40" fill="#1c1917" stroke="#0f172a" strokeWidth="1.5" />
        <line x1="270" y1="75" x2="270" y2="120" stroke="#78350f" strokeWidth="1.5" strokeDasharray="4 3" />

        {/* LEMPENG A (KIRI) — BERGERAK KE KIRI */}
        <g
          style={{
            transform: isSimulating ? 'translateX(-34px)' : 'translateX(0)',
            transition: 'transform 3.5s cubic-bezier(0.25, 1, 0.5, 1)',
          }}
        >
          <rect x="20" y="75" width="220" height="45" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
          <rect x="20" y="75" width="220" height="8" fill="#475569" />
          <polygon points="50,60 25,68 50,76" fill="#facc15" />
          <rect x="50" y="64" width="45" height="8" fill="#facc15" />
          <text x="65" y="105" fill="#ffffff" fontSize="8.5" fontWeight="bold">
            LEMPENG A (MEMISAH KE KIRI)
          </text>
        </g>

        {/* LEMPENG B (KANAN) — BERGERAK KE KANAN */}
        <g
          style={{
            transform: isSimulating ? 'translateX(34px)' : 'translateX(0)',
            transition: 'transform 3.5s cubic-bezier(0.25, 1, 0.5, 1)',
          }}
        >
          <rect x="300" y="75" width="220" height="45" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
          <rect x="300" y="75" width="220" height="8" fill="#475569" />
          <polygon points="490,68 465,60 465,76" fill="#facc15" />
          <rect x="445" y="64" width="25" height="8" fill="#facc15" />
          <text x="315" y="105" fill="#ffffff" fontSize="8.5" fontWeight="bold">
            LEMPENG B (MEMISAH KE KANAN)
          </text>
        </g>

        {/* Banner Keterangan Dinamika */}
        <rect x="110" y="125" width="320" height="24" rx="4" fill="#0f172a" stroke="#ea580c" strokeWidth="1.5" />
        <text x="270" y="141" fill="#fef08a" fontSize="7.5" fontWeight="bold" textAnchor="middle">
          LEMPENG SALING MEMISAH MEMBENTUK LEMBAH RETAKAN (RIFT VALLEY)
        </text>
      </svg>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 4. SUB-KOMPONEN: ANIMASI 2D PIXEL SUBDUKSI KONVERGEN (PERSIS SEPERTI LEVEL 2)
// ═════════════════════════════════════════════════════════════════════════════
function ConvergentSubductionIllustration() {
  return (
    <div className="w-full h-full relative flex flex-col items-center justify-between p-1.5 sm:p-2 select-none">
      <div className="w-full flex items-center justify-between px-2 pb-1 border-b border-slate-800 z-10">
        <span className="text-[9px] font-pixel-title text-amber-400 font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          PENAMPANG 3D SUBDUKSI &amp; PELEBURAN LEMPENG
        </span>
        <span className="text-[8px] text-slate-400 font-pixel">
          BATAS KONVERGEN: SAMUDRA vs BENUA
        </span>
      </div>

      <div className="w-full flex-1 min-h-0 relative flex items-center justify-center overflow-hidden my-1">
        <svg
          viewBox="0 0 560 250"
          className="w-full h-full object-contain drop-shadow-xl"
          shapeRendering="geometricPrecision"
        >
          <style>{`
            @keyframes subductSmoke {
              0% { transform: translateY(0px) scale(0.9); opacity: 0.8; }
              50% { transform: translateY(-7px) scale(1.15); opacity: 0.95; }
              100% { transform: translateY(-15px) scale(1.3); opacity: 0; }
            }
            @keyframes magmaMeltRise {
              0% { transform: translateY(0px); opacity: 0.3; }
              50% { opacity: 1; }
              100% { transform: translateY(-22px); opacity: 0.2; }
            }
            @keyframes arrowMoveRight {
              0%, 100% { transform: translateX(0px); filter: drop-shadow(0 0 2px rgba(255,255,255,0.4)); }
              50% { transform: translateX(12px); filter: drop-shadow(0 0 6px rgba(255,255,255,0.9)); }
            }
            @keyframes arrowMoveLeft {
              0%, 100% { transform: translateX(0px); filter: drop-shadow(0 0 2px rgba(255,255,255,0.4)); }
              50% { transform: translateX(-12px); filter: drop-shadow(0 0 6px rgba(255,255,255,0.9)); }
            }
            @keyframes waterGleam {
              0%, 100% { opacity: 0.45; }
              50% { opacity: 0.85; }
            }
            .anim-smoke-1 { animation: subductSmoke 2.6s ease-out infinite; transform-origin: 330px 55px; }
            .anim-smoke-2 { animation: subductSmoke 2.6s ease-out infinite 0.9s; transform-origin: 330px 55px; }
            .anim-smoke-3 { animation: subductSmoke 2.6s ease-out infinite 1.7s; transform-origin: 330px 55px; }
            .anim-magma-drip { animation: magmaMeltRise 2.2s linear infinite; }
            .anim-magma-drip-2 { animation: magmaMeltRise 2.2s linear infinite 0.7s; }
            .anim-magma-drip-3 { animation: magmaMeltRise 2.2s linear infinite 1.4s; }
            .anim-arrow-right { animation: arrowMoveRight 1.5s ease-in-out infinite; }
            .anim-arrow-left { animation: arrowMoveLeft 1.5s ease-in-out infinite; }
            .anim-water-ripple { animation: waterGleam 3s ease-in-out infinite; }
          `}</style>

          <defs>
            <linearGradient id="oceanTopWater" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="60%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>

            <linearGradient id="oceanFrontWater" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.95" />
            </linearGradient>

            <linearGradient id="oceanSideWater" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0369a1" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.8" />
            </linearGradient>

            <linearGradient id="asthenoFront" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="40%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#c2410c" />
            </linearGradient>

            <linearGradient id="asthenoSide" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c2410c" />
              <stop offset="100%" stopColor="#7c2d12" />
            </linearGradient>

            <linearGradient id="contLandTop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e2d4be" />
              <stop offset="50%" stopColor="#d4b896" />
              <stop offset="100%" stopColor="#bfa07a" />
            </linearGradient>

            <linearGradient id="contCrustFront" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#78716c" />
              <stop offset="100%" stopColor="#57534e" />
            </linearGradient>

            <linearGradient id="contLithoFront" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>

            <linearGradient id="oceanLithoFront" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>

            <linearGradient id="volcanoConeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#78716c" />
              <stop offset="40%" stopColor="#57534e" />
              <stop offset="100%" stopColor="#292524" />
            </linearGradient>

            <radialGradient id="magmaGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="35%" stopColor="#f97316" />
              <stop offset="80%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#991b1b" />
            </radialGradient>
          </defs>

          <rect x="0" y="0" width="560" height="250" fill="#09090b" rx="8" />

          {/* RIGHT 3D SIDE CUTAWAY FACE */}
          <g id="right-3d-side-face">
            <polygon points="440,175 550,115 550,175 440,245" fill="url(#asthenoSide)" stroke="#431407" strokeWidth="1.5" />
            <polygon points="440,140 550,85 550,115 440,175" fill="#475569" stroke="#1e293b" strokeWidth="1.5" />
            <polygon points="440,105 550,55 550,85 440,140" fill="#3f3f46" stroke="#18181b" strokeWidth="1.5" />
          </g>

          {/* FRONT FACE: ASTHENOSPHERE */}
          <polygon points="15,130 440,130 440,245 15,245" fill="url(#asthenoFront)" stroke="#9a3412" strokeWidth="1.5" />

          {/* FRONT FACE: CONTINENTAL LITHOSPHERE & CRUST */}
          <polygon points="215,140 440,140 440,175 275,175" fill="url(#contLithoFront)" stroke="#64748b" strokeWidth="1.5" />
          <polygon points="215,105 440,105 440,140 215,140" fill="url(#contCrustFront)" stroke="#292524" strokeWidth="1.5" />

          {/* SUBDUCTING OCEANIC SLAB */}
          <path
            d="M 15,130 L 175,130 Q 200,132 230,160 L 330,245 L 270,245 L 180,165 Q 160,150 145,150 L 15,150 Z"
            fill="url(#oceanLithoFront)"
            stroke="#64748b"
            strokeWidth="1.5"
          />
          <path
            d="M 15,123 L 178,123 Q 205,125 235,155 L 336,245 L 330,245 L 230,160 Q 200,132 175,130 L 15,130 Z"
            fill="#1e293b"
            stroke="#0f172a"
            strokeWidth="1.5"
          />

          {/* TOP ISOMETRIC SURFACE: CONTINENTAL LANDMASS & VOLCANIC ARC */}
          <polygon points="215,105 440,105 550,55 320,55" fill="url(#contLandTop)" stroke="#78350f" strokeWidth="1.5" />

          {/* Mountain Ridges in Background */}
          <polygon points="360,55 385,38 410,55" fill="#a88a68" stroke="#78350f" strokeWidth="1.2" />
          <polygon points="385,38 410,55 398,55" fill="#785938" />
          <polygon points="420,55 450,32 480,55" fill="#bfa07a" stroke="#78350f" strokeWidth="1.2" />
          <polygon points="450,32 480,55 465,55" fill="#8c6b45" />
          <polygon points="485,55 515,36 545,55" fill="#a88a68" stroke="#78350f" strokeWidth="1.2" />
          <polygon points="515,36 545,55 530,55" fill="#785938" />

          {/* Midground Hills */}
          <polygon points="280,75 305,58 330,75" fill="#bfa07a" stroke="#78350f" strokeWidth="1.2" />
          <polygon points="305,58 330,75 320,75" fill="#8c6b45" />

          {/* Active Stratovolcano Cone */}
          <polygon points="280,105 320,68 340,68 380,105" fill="url(#volcanoConeGrad)" stroke="#1c1917" strokeWidth="1.5" />
          <polygon points="330,68 380,105 355,105" fill="#1c1917" opacity="0.6" />
          <path d="M 326,70 Q 320,85 310,105" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 326,70 Q 320,85 310,105" fill="none" stroke="#fef08a" strokeWidth="1" strokeLinecap="round" />

          {/* Volcano Crater Rim & Magma Pool */}
          <ellipse cx="330" cy="68" rx="12" ry="4" fill="#0f172a" stroke="#78350f" strokeWidth="1.2" />
          <ellipse cx="330" cy="68.5" rx="8" ry="2.5" fill="#dc2626" />
          <ellipse cx="330" cy="68.5" rx="4" ry="1.2" fill="#fef08a" />

          {/* Smoke Plumes */}
          <g id="volcanic-smoke">
            <circle cx="330" cy="54" r="9" fill="#475569" opacity="0.9" className="anim-smoke-1" />
            <circle cx="322" cy="45" r="12" fill="#334155" opacity="0.92" className="anim-smoke-2" />
            <circle cx="338" cy="40" r="13" fill="#1e293b" opacity="0.95" className="anim-smoke-3" />
            <circle cx="325" cy="30" r="15" fill="#334155" opacity="0.9" className="anim-smoke-1" />
            <circle cx="342" cy="24" r="16" fill="#1e293b" opacity="0.85" className="anim-smoke-2" />
            <circle cx="328" cy="58" r="1.5" fill="#fef08a" />
            <circle cx="334" cy="52" r="1.2" fill="#f97316" />
            <circle cx="324" cy="46" r="1.5" fill="#ef4444" />
          </g>

          {/* Magma Conduit & Melting Droplets */}
          <path d="M 330,70 L 330,120" stroke="#dc2626" strokeWidth="6" strokeLinecap="round" />
          <path d="M 330,70 L 330,120" stroke="#fef08a" strokeWidth="2.5" strokeLinecap="round" />

          {/* Magma Chamber */}
          <ellipse cx="330" cy="122" rx="16" ry="11" fill="url(#magmaGlow)" stroke="#7f1d1d" strokeWidth="1.5" />
          <ellipse cx="330" cy="122" rx="10" ry="6" fill="#fef08a" opacity="0.85" />

          {/* Rising Magma Droplets */}
          <g id="magma-melting-droplets">
            <circle cx="318" cy="142" r="3" fill="#ef4444" className="anim-magma-drip" />
            <circle cx="318" cy="142" r="1.5" fill="#fef08a" className="anim-magma-drip" />

            <circle cx="332" cy="148" r="3.5" fill="#dc2626" className="anim-magma-drip-2" />
            <circle cx="332" cy="148" r="1.8" fill="#fef08a" className="anim-magma-drip-2" />

            <circle cx="324" cy="160" r="2.8" fill="#ef4444" className="anim-magma-drip-3" />
            <circle cx="338" cy="168" r="3.2" fill="#ea580c" className="anim-magma-drip" />
            <circle cx="316" cy="175" r="2.5" fill="#f97316" className="anim-magma-drip-2" />
            <circle cx="330" cy="184" r="3" fill="#ef4444" className="anim-magma-drip-3" />
            <circle cx="322" cy="195" r="2.5" fill="#facc15" className="anim-magma-drip" />

            <line x1="316" y1="185" x2="318" y2="145" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />
            <line x1="330" y1="195" x2="332" y2="140" stroke="#f97316" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.75" />
            <line x1="338" y1="180" x2="336" y2="145" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.6" />
          </g>

          {/* TOP ISOMETRIC SURFACE: OCEAN WATER BLOCK & TRENCH */}
          <polygon points="15,105 215,105 320,55 120,55" fill="url(#oceanTopWater)" stroke="#38bdf8" strokeWidth="1.5" />

          {/* Ocean Waves */}
          <g opacity="0.65" className="anim-water-ripple">
            <path d="M 40,95 Q 60,93 80,95 Q 100,97 120,95" fill="none" stroke="#e0f2fe" strokeWidth="1.2" />
            <path d="M 135,90 Q 155,88 175,90 Q 195,92 215,90" fill="none" stroke="#e0f2fe" strokeWidth="1.2" />
            <path d="M 70,80 Q 90,78 110,80 Q 130,82 150,80" fill="none" stroke="#bae6fd" strokeWidth="1.2" />
            <path d="M 160,75 Q 180,73 200,75 Q 220,77 240,75" fill="none" stroke="#bae6fd" strokeWidth="1.2" />
            <path d="M 110,65 Q 130,63 150,65 Q 170,67 190,65" fill="none" stroke="#ffffff" strokeWidth="1" />
          </g>

          {/* Coastline / Beach & Trench Boundary */}
          <path
            d="M 215,105 Q 235,95 250,85 Q 275,75 320,55"
            fill="none"
            stroke="#fde68a"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M 215,105 Q 235,95 250,85 Q 275,75 320,55"
            fill="none"
            stroke="#0284c7"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Front Cutaway Water Slice */}
          <polygon points="15,105 215,105 215,123 15,123" fill="url(#oceanFrontWater)" stroke="#0284c7" strokeWidth="1.5" />

          {/* Left Side Cutaway Water Slice */}
          <polygon points="15,105 120,55 120,68 15,123" fill="url(#oceanSideWater)" stroke="#0369a1" strokeWidth="1.5" />

          {/* Movement Arrows */}
          <g id="arrow-oceanic" className="anim-arrow-right" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.6))">
            <polygon points="85,137 125,137 125,131 145,142 125,153 125,147 85,147" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
          </g>

          <g id="arrow-continental" className="anim-arrow-left" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.6))">
            <polygon points="385,155 345,155 345,149 325,160 345,171 345,165 385,165" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
          </g>
        </svg>
      </div>

      <div className="w-full bg-[#0f172a] border border-amber-500/50 rounded-xl p-2 text-slate-300 text-[10px] flex items-center justify-between gap-2 shadow">
        <span className="font-bold text-amber-400 shrink-0">INTI SAINS:</span>
        <span className="leading-tight">
          Lempeng samudra yang padat menunjam (subduksi) ke astenosfer mantel di bawah lempeng benua. Panas mantel bumi meleburkan batuan menjadi magma pijar yang naik ke atas melahirkan barisan gunung berapi aktif!
        </span>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 5. SUB-KOMPONEN: TIGA BENTANG ALAM GEOLOGIS HASIL TUMBUKAN KONVERGEN
// ═════════════════════════════════════════════════════════════════════════════
function ConvergentLandformsIllustration() {
  const [selectedLandform, setSelectedLandform] = useState<'trench' | 'mountains' | 'volcano'>('trench');

  const landformDetails = {
    trench: {
      title: '1. PALUNG LAUT DALAM (DEEP SEA TRENCH)',
      subtitle: 'Ngarai Dasar Laut Terdalam di Bumi',
      points: [
        { icon: 'arrow-down', text: 'Terbentuk saat lempeng samudra yang berat menunjam curam ke bawah lempeng benua.' },
        { icon: 'search', text: 'Kedalaman 7.000 - 11.000 m! Palung Mariana adalah titik terdalam di dunia (11.034 m).' },
        { icon: 'bulb', text: 'Fakta: Gunung Everest (8.848 m) masih tenggelam >2.000 m jika dimasukkan ke palung ini!' },
      ],
      badgeColor: 'border-cyan-500 bg-cyan-950/90 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.25)]',
      textColor: 'text-cyan-400',
    },
    mountains: {
      title: '2. RANTAI PEGUNUNGAN LIPATAN (FOLDED MOUNTAINS)',
      subtitle: 'Daratan Terangkat Akibat Tumbukan Lempeng',
      points: [
        { icon: 'layers', text: 'Dua lempeng saling menekan kuat, meremas dan melipat lapisan batuan kerak benua ke atas.' },
        { icon: 'flag', text: 'Puncak lipatan disebut Antiklin, sedangkan lembah cekungannya disebut Sinklin.' },
        { icon: 'check', text: 'Contoh nyata: Pegunungan Bukit Barisan di Sumatra dan Pegunungan Himalaya di Asia.' },
      ],
      badgeColor: 'border-amber-500 bg-amber-950/90 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.25)]',
      textColor: 'text-amber-400',
    },
    volcano: {
      title: '3. BUSUR GUNUNG BERAPI AKTIF (VOLCANIC ARC)',
      subtitle: 'Jalur Erupsi Magma Peleburan Lempeng',
      points: [
        { icon: 'zap', text: 'Lempeng yang menunjam meleleh di mantel bumi bersuhu >1.200°C menjadi batuan cair (magma).' },
        { icon: 'arrow-up', text: 'Magma panas yang lebih ringan mendesak naik ke permukaan membentuk kantung magma.' },
        { icon: 'shield', text: 'Melahirkan jalur gunung berapi aktif Nusantara seperti Gunung Merapi, Semeru, & Krakatau.' },
      ],
      badgeColor: 'border-rose-500 bg-rose-950/90 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.25)]',
      textColor: 'text-rose-400',
    },
  };

  const current = landformDetails[selectedLandform];

  return (
    <div className="w-full h-full relative flex flex-col justify-between select-none">
      <div className="w-full pt-2.5 px-2 sm:px-3 pb-2 flex items-center justify-between border-b border-slate-800 bg-slate-950/95 z-20 shrink-0 gap-1 overflow-x-auto">
        <span className="text-[8.5px] sm:text-[9.5px] font-pixel-title text-amber-400 font-bold shrink-0 flex items-center gap-1.5">
          <PixelIcon name="layers" size={13} className="text-amber-400" />
          <span className="hidden sm:inline">PILIH BENTANG ALAM:</span>
          <span className="sm:hidden">BENTANG ALAM:</span>
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => {
              retroAudio.playSelect();
              setSelectedLandform('trench');
            }}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[8px] sm:text-[9px] font-pixel-title cursor-pointer transition-colors border-2 ${selectedLandform === 'trench'
              ? 'bg-cyan-600 text-white border-cyan-300 shadow-[0_2px_0_#083344]'
              : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200 hover:bg-slate-800'
              }`}
          >
            [1. PALUNG LAUT]
          </button>
          <button
            onClick={() => {
              retroAudio.playSelect();
              setSelectedLandform('mountains');
            }}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[8px] sm:text-[9px] font-pixel-title cursor-pointer transition-colors border-2 ${selectedLandform === 'mountains'
              ? 'bg-amber-600 text-white border-amber-300 shadow-[0_2px_0_#451a03]'
              : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200 hover:bg-slate-800'
              }`}
          >
            [2. PEGUNUNGAN]
          </button>
          <button
            onClick={() => {
              retroAudio.playSelect();
              setSelectedLandform('volcano');
            }}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[8px] sm:text-[9px] font-pixel-title cursor-pointer transition-colors border-2 ${selectedLandform === 'volcano'
              ? 'bg-rose-600 text-white border-rose-300 shadow-[0_2px_0_#4c0519]'
              : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200 hover:bg-slate-800'
              }`}
          >
            [3. GUNUNG BERAPI]
          </button>
        </div>
      </div>

      <div className="w-full flex-1 min-h-0 relative flex items-center justify-center overflow-hidden">
        {selectedLandform === 'trench' && <TrenchIllustration />}
        {selectedLandform === 'mountains' && <FoldedMountainsIllustration />}
        {selectedLandform === 'volcano' && <VolcanoIllustration />}
      </div>

      <div className={`w-full border-t-2 sm:border-2 sm:rounded-xl p-2 sm:p-2.5 text-xs z-10 flex flex-col gap-1 shadow-lg shrink-0 ${current.badgeColor}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <PixelIcon name="bulb" size={14} className={current.textColor} />
            <span className="font-pixel-title text-[9px] sm:text-[10px] font-bold">
              {current.title}
            </span>
          </div>
          <span className="text-[8px] opacity-80 font-mono uppercase hidden sm:inline">
            {current.subtitle}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2 pt-0.5">
          {current.points.map((pt, idx) => (
            <div key={idx} className="bg-black/35 rounded-lg p-1.5 border border-white/10 flex items-start gap-1.5">
              <PixelIcon name={pt.icon as any} size={11} className={`shrink-0 mt-0.5 ${current.textColor}`} />
              <span className="text-[8.5px] sm:text-[9px] leading-snug text-slate-100 font-medium">
                {pt.text}
              </span>
            </div>
          ))}
        </div>
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
      <line x1="0" y1="38" x2="560" y2="38" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="6 3" />

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
        <line x1="239" y1="18" x2="239" y2="135" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
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
      <text x="65" y="70" fill="#a8a29e" fontSize="6.5" fontWeight="bold">LANDASAN BENUA</text>
      <text x="105" y="115" fill="#78716c" fontSize="6" fontWeight="bold">LERENG BENUA</text>

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
          strokeDasharray="4 3"
          opacity="0.8"
        />
        <circle cx="390" cy="78" r="3" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.2" />

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

      {/* Skala Kedalaman */}
      <g>
        <line x1="30" y1="38" x2="30" y2="246" stroke="#94a3b8" strokeWidth="1" />
        <line x1="26" y1="38" x2="34" y2="38" stroke="#94a3b8" strokeWidth="1" />
        <text x="24" y="41" fill="#bae6fd" fontSize="5.5" textAnchor="end" fontWeight="bold">0 m</text>
        <line x1="26" y1="65" x2="34" y2="65" stroke="#94a3b8" strokeWidth="1" />
        <text x="24" y="68" fill="#7dd3fc" fontSize="5.5" textAnchor="end">200 m</text>
        <line x1="26" y1="105" x2="34" y2="105" stroke="#94a3b8" strokeWidth="1" />
        <text x="24" y="108" fill="#93c5fd" fontSize="5.5" textAnchor="end">1.000 m</text>
        <line x1="26" y1="165" x2="34" y2="165" stroke="#94a3b8" strokeWidth="1" />
        <text x="24" y="168" fill="#cbd5e1" fontSize="5.5" textAnchor="end">4.000 m</text>
        <line x1="26" y1="246" x2="34" y2="246" stroke="#facc15" strokeWidth="1.5" />
        <text x="24" y="248" fill="#facc15" fontSize="6" textAnchor="end" fontWeight="bold">11.000 m</text>
      </g>

      <rect x="180" y="234" width="105" height="12" rx="2" fill="#020617" stroke="#38bdf8" strokeWidth="1" />
      <text x="232" y="242" fill="#38bdf8" fontSize="6" fontWeight="bold" textAnchor="middle">
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
        <rect x="20" y="165" width="60" height="18" rx="3" fill="#ea580c" stroke="#fef08a" strokeWidth="1.5" />
        <text x="32" y="177" fill="#ffffff" fontSize="6.5" fontWeight="bold">TEKANAN</text>
        <polygon points="80,162 94,174 80,186" fill="#facc15" stroke="#78350f" strokeWidth="1" />
      </g>
      <g>
        <rect x="480" y="165" width="60" height="18" rx="3" fill="#ea580c" stroke="#fef08a" strokeWidth="1.5" />
        <text x="490" y="177" fill="#ffffff" fontSize="6.5" fontWeight="bold">TEKANAN</text>
        <polygon points="480,162 466,174 480,186" fill="#facc15" stroke="#78350f" strokeWidth="1" />
      </g>

      {/* Label Antiklin & Sinklin */}
      <g>
        <rect x="215" y="70" width="130" height="18" rx="3" fill="#451a03" stroke="#f59e0b" strokeWidth="1.5" />
        <text x="280" y="82" fill="#fef08a" fontSize="6.5" fontWeight="bold" textAnchor="middle">
          PUNCAK LIPATAN (ANTIKLIN)
        </text>
        <line x1="280" y1="88" x2="280" y2="105" stroke="#f59e0b" strokeWidth="1.5" />
        <circle cx="280" cy="105" r="3" fill="#fef08a" />
      </g>
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
      <text x="15" y="240" fill="#fed7aa" fontSize="6.5" fontWeight="bold">
        ASTENOSFER MANTEL PANAS (SUHU &gt; 1.200°C)
      </text>

      {/* Lempeng Samudra Subduksi */}
      <polygon
        points="0,118 110,118 240,250 180,250 80,140 0,140"
        fill="#166534"
        stroke="#14532d"
        strokeWidth="1.5"
      />
      <text x="15" y="132" fill="#86efac" fontSize="6.5" fontWeight="bold">
        LEMPENG SAMUDRA (MENUNJAM)
      </text>

      {/* Peleburan Batuan */}
      <g>
        <circle cx="190" cy="210" r="14" fill="#ea580c" opacity="0.6" />
        <circle cx="190" cy="210" r="7" fill="#fef08a" />
        <text x="210" y="214" fill="#fef08a" fontSize="6" fontWeight="bold">PELEBURAN SLAB</text>
        <path d="M 205,200 Q 240,195 270,185" fill="none" stroke="#f97316" strokeWidth="2" strokeDasharray="3 2" />
      </g>

      {/* Dapur Magma Raksasa */}
      <g>
        <ellipse cx="330" cy="175" rx="55" ry="26" fill="url(#dapurMagmaGrad)" stroke="#ef4444" strokeWidth="2" />
        <ellipse cx="330" cy="175" rx="28" ry="12" fill="#fef08a" />
        <text x="330" y="178" fill="#450a0a" fontSize="7" fontWeight="bold" textAnchor="middle">
          DAPUR MAGMA (KANTUNG PIJAR)
        </text>
      </g>

      {/* Pipa Magma */}
      <polygon points="325,150 335,150 334,50 326,50" fill="#f97316" stroke="#ea580c" strokeWidth="1" />
      <polygon points="328,150 332,150 331,50 329,50" fill="#fef08a" />

      {/* Label */}
      <g>
        <rect x="250" y="85" width="160" height="16" rx="3" fill="#450a0a" stroke="#f87171" strokeWidth="1.2" />
        <text x="330" y="96" fill="#fef08a" fontSize="6.5" fontWeight="bold" textAnchor="middle">
          BUSUR STRATOVOLCANO AKTIF MERAPI
        </text>
      </g>
    </svg>
  );
}
