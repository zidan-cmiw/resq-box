// ── LempengTektonik.tsx ─────────────────────────────────────────────────────
// BAB 2 LEVEL 1: Dinamika Lempeng Tektonik — "Simulator Gerak Lempeng"
// 3 mode simulasi interaktif (Konvergen/Divergen/Transform), peta Indonesia pixel,
// dan Ring of Fire. Bersih, tanpa animasi lebay, dan 100% 2D Pixel Icon (tanpa emot).

import { useState, useRef, useEffect, useCallback } from 'react';
import { retroAudio } from '../../utils/retroAudio';
import PixelIcon from './PixelIcons';

// ── Data ──────────────────────────────────────────────────────────────────

interface PlateBoundary {
  id: string;
  name: string;
  shortName: string;
  type: string;
  iconName: 'convergent' | 'divergent' | 'transform';
  movement: string;
  example: string;
  impact: string;
  btnLabel: string;
  btnColor: string;
}

const BOUNDARIES: PlateBoundary[] = [
  {
    id: 'konvergen',
    name: 'Batas Konvergen',
    shortName: 'KONVERGEN',
    type: 'Saling Bertumbukan',
    iconName: 'convergent',
    movement: 'Lempeng samudra yang lebih padat menunjam ke bawah lempeng benua (subduksi).',
    example: 'Palung Jawa, deretan Gunung Berapi Sumatera-Jawa, Zona Megathrust.',
    impact: 'Gempa bumi megathrust bermagnitudo besar, tsunami, dan erupsi gunung api aktif.',
    btnLabel: 'SIMULASI TUMBUKAN',
    btnColor: 'bg-rose-600 hover:bg-rose-500 border-rose-900 shadow-[0_3px_0_#7f1d1d]',
  },
  {
    id: 'divergen',
    name: 'Batas Divergen',
    shortName: 'DIVERGEN',
    type: 'Saling Menjauh',
    iconName: 'divergent',
    movement: 'Dua lempeng bergerak saling menjauh sehingga celah terisi magma dari mantel yang membeku.',
    example: 'Pematang Tengah Samudra Atlantik (Mid-Atlantic Ridge), Lembah Retakan Afrika Timur.',
    impact: 'Membentuk kerak samudra baru, aktivitas vulkanik bawah laut, dan gempa skala sedang.',
    btnLabel: 'SIMULASI PEMEKARAN',
    btnColor: 'bg-orange-600 hover:bg-orange-500 border-orange-900 shadow-[0_3px_0_#7c2d12]',
  },
  {
    id: 'transform',
    name: 'Batas Transform',
    shortName: 'TRANSFORM',
    type: 'Saling Bergesekan',
    iconName: 'transform',
    movement: 'Dua lempeng bergeser secara horizontal (mendatar) saling berpapasan berlawanan arah.',
    example: 'Sesar Semangko (Sumatera), Sesar Palu-Koro (Sulawesi), Sesar San Andreas.',
    impact: 'Gempa bumi dangkal di daratan yang sangat merusak infrastruktur bangunan.',
    btnLabel: 'SIMULASI GESERAN',
    btnColor: 'bg-amber-600 hover:bg-amber-500 border-amber-900 shadow-[0_3px_0_#78350f]',
  },
];

interface IndonesiaPlate {
  id: string;
  name: string;
  color: string;
  colorLight: string;
  speed: string;
  direction: string;
  iconName: 'compass' | 'mountain' | 'ocean';
  impact: string;
}

const INDONESIA_PLATES: IndonesiaPlate[] = [
  {
    id: 'indo-australia',
    name: 'Indo-Australia',
    color: '#ea580c',
    colorLight: '#fb923c',
    speed: '6–7 cm/tahun',
    direction: 'Ke arah Utara',
    iconName: 'compass',
    impact: 'Bergerak ke utara menabrak lempeng Eurasia dari sisi selatan, membentuk Palung Jawa dan busur gunung api aktif.',
  },
  {
    id: 'eurasia',
    name: 'Eurasia',
    color: '#16a34a',
    colorLight: '#4ade80',
    speed: 'Tumpuan Relatif',
    direction: 'Tumpuan Benua',
    iconName: 'mountain',
    impact: 'Merupakan daratan utama kepulauan Indonesia (Sumatera, Jawa, Kalimantan, Sulawesi) yang menahan dorongan dari lempeng sekitar.',
  },
  {
    id: 'pasifik',
    name: 'Pasifik',
    color: '#0284c7',
    colorLight: '#38bdf8',
    speed: '8–10 cm/tahun',
    direction: 'Ke arah Barat',
    iconName: 'ocean',
    impact: 'Mendorong dari arah timur ke barat menuju Papua dan Maluku, menjadikan wilayah timur Indonesia sangat aktif secara seismik.',
  },
];

const VOLCANOES = [
  { name: 'Gunung Merapi', x: 148, y: 122 },
  { name: 'Krakatau', x: 142, y: 118 },
  { name: 'Gunung Sinabung', x: 136, y: 112 },
  { name: 'Gunung Semeru', x: 154, y: 122 },
  { name: 'Gunung Fuji', x: 186, y: 72 },
  { name: 'Gunung Pinatubo', x: 172, y: 98 },
  { name: 'St. Helens', x: 48, y: 60 },
  { name: 'Chimborazo', x: 68, y: 130 },
  { name: 'Cotopaxi', x: 72, y: 128 },
  { name: 'Popocatepetl', x: 56, y: 94 },
  { name: 'Ruapehu', x: 198, y: 160 },
  { name: 'Gunung Tambora', x: 158, y: 124 },
];

// ── Main Component ───────────────────────────────────────────────────────

export default function LempengTektonik() {
  const [activeTab, setActiveTab] = useState<'boundaries' | 'indonesia' | 'ring-of-fire'>('boundaries');
  const [activeBoundaryId, setActiveBoundaryId] = useState<string>('konvergen');
  const [activePlateId, setActivePlateId] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [hoveredVolcano, setHoveredVolcano] = useState<string | null>(null);

  const simTimerRef = useRef<number | null>(null);

  const activeBoundary = BOUNDARIES.find((b) => b.id === activeBoundaryId) || BOUNDARIES[0];
  const activePlate = INDONESIA_PLATES.find((p) => p.id === activePlateId);

  useEffect(() => {
    return () => {
      if (simTimerRef.current) clearTimeout(simTimerRef.current);
    };
  }, []);

  const handleSimulate = useCallback(() => {
    retroAudio.playExplosion();
    setIsSimulating(true);

    if (simTimerRef.current) clearTimeout(simTimerRef.current);
    simTimerRef.current = window.setTimeout(() => {
      setIsSimulating(false);
    }, 1800);
  }, []);

  const handleTabChange = (tab: typeof activeTab) => {
    retroAudio.playSelect();
    setActiveTab(tab);
    setIsSimulating(false);
  };

  const handleBoundaryChange = (id: string) => {
    retroAudio.playSelect();
    setActiveBoundaryId(id);
    setIsSimulating(false);
  };

  const handlePlateClick = (id: string) => {
    retroAudio.playSelect();
    setActivePlateId(activePlateId === id ? null : id);
  };

  return (
    <div className="flex flex-col gap-4 w-full select-none font-pixel text-amber-950">

      {/* ── TAB NAVIGATION (With 2D Pixel Icons) ── */}
      <div className="grid grid-cols-3 gap-2">
        {([
          { id: 'boundaries' as const, label: 'BATAS LEMPENG', icon: 'convergent' as const },
          { id: 'indonesia' as const, label: 'LEMPENG INDONESIA', icon: 'map' as const },
          { id: 'ring-of-fire' as const, label: 'RING OF FIRE', icon: 'volcano' as const },
        ]).map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`py-2 px-2 rounded-xl border-2 border-amber-950 text-[10px] sm:text-xs font-bold text-center cursor-pointer transition-all shadow-[0_2px_0_#78350f] flex flex-col items-center gap-1 ${
                isActive
                  ? 'bg-amber-950 text-amber-300 shadow-[0_3px_0_#451a03]'
                  : 'bg-amber-200/90 text-amber-950 hover:bg-amber-300'
              }`}
            >
              <PixelIcon name={tab.icon} size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ═══════════════ TAB 1: BATAS LEMPENG SIMULATOR ═══════════════ */}
      {activeTab === 'boundaries' && (
        <div className="space-y-4">

          {/* Boundary Selector */}
          <div className="grid grid-cols-3 gap-2">
            {BOUNDARIES.map((b) => {
              const isSel = activeBoundaryId === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => handleBoundaryChange(b.id)}
                  className={`p-2.5 rounded-xl border-2 border-amber-950 text-xs font-bold text-center cursor-pointer transition-all flex flex-col items-center gap-1 ${
                    isSel
                      ? 'bg-amber-400 text-amber-950 shadow-[0_3px_0_#78350f] ring-2 ring-amber-950'
                      : 'bg-white hover:bg-amber-100 text-amber-950 shadow-[0_2px_0_#78350f]'
                  }`}
                >
                  <PixelIcon name={b.iconName} size={22} />
                  <span className="block text-[10px] text-amber-800 uppercase mt-0.5">{b.type}</span>
                  <span className="block text-xs font-bold truncate">{b.shortName}</span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">

            {/* LEFT: SVG Interactive Visualizer */}
            <div className="lg:col-span-7 bg-slate-950 p-4 rounded-2xl border-3 border-amber-950 shadow-[0_6px_0_#231206] relative overflow-hidden">
              
              {/* HUD Header */}
              <div className="flex items-center justify-between w-full pb-2 border-b border-slate-800 mb-3">
                <span className="text-[10px] font-pixel-title text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  SIMULATOR DINAMIKA TEKTONIK 2D
                </span>
                <button
                  onClick={handleSimulate}
                  className={`px-3 py-1.5 rounded text-white text-[10px] font-bold border-2 cursor-pointer font-pixel-title active:translate-y-0.5 transition-all flex items-center gap-1.5 ${activeBoundary.btnColor}`}
                >
                  <PixelIcon name={activeBoundary.iconName} size={14} />
                  <span>{activeBoundary.btnLabel}</span>
                </button>
              </div>

              {/* ── 1. KONVERGEN SIMULATOR ── */}
              {activeBoundaryId === 'konvergen' && (
                <div className="w-full h-48 sm:h-56 relative">
                  <svg viewBox="0 0 400 180" className="w-full h-full" style={{ shapeRendering: 'crispEdges' }}>
                    {/* Mantle Background */}
                    <rect x="0" y="80" width="400" height="100" fill="#7c2d12" />
                    <rect x="0" y="100" width="400" height="80" fill="#c2410c" />

                    {/* Oceanic Plate (Subducting) */}
                    <g
                      style={{
                        transform: isSimulating ? 'translateX(18px) translateY(8px)' : 'none',
                        transition: 'transform 0.8s ease-in-out',
                      }}
                    >
                      <polygon points="15,55 180,55 210,130 190,145 15,80" fill="#0284c7" />
                      <rect x="15" y="55" width="165" height="7" fill="#38bdf8" />
                      {/* Ocean water */}
                      <rect x="15" y="35" width="170" height="20" fill="#0369a1" opacity="0.4" />
                      <text x="45" y="30" fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="'Press Start 2P'">SAMUDRA &gt;</text>
                    </g>

                    {/* Continental Plate (Overriding) */}
                    <g
                      style={{
                        transform: isSimulating ? 'translateX(-12px)' : 'none',
                        transition: 'transform 0.8s ease-in-out',
                      }}
                    >
                      <polygon points="200,48 385,48 385,115 240,115 215,80" fill="#15803d" />
                      <rect x="200" y="48" width="185" height="7" fill="#4ade80" />
                      <text x="250" y="80" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="'Press Start 2P'">&lt; BENUA</text>
                    </g>

                    {/* Volcano on continent */}
                    <polygon points="280,48 300,15 320,48" fill="#57534e" />
                    <polygon points="295,15 300,8 305,15" fill="#ef4444" />
                    {isSimulating && (
                      <g>
                        <circle cx="300" cy="5" r="4" fill="#fbbf24" />
                        <circle cx="296" cy="-2" r="3" fill="#ef4444" />
                        <circle cx="304" cy="-2" r="3" fill="#f97316" />
                      </g>
                    )}

                    {/* Subduction Zone marker */}
                    <text x="120" y="170" fill="#facc15" fontSize="9" fontWeight="bold" fontFamily="'Press Start 2P'" textAnchor="middle">
                      ZONA PENUNJAMAN (SUBDUKSI)
                    </text>
                  </svg>
                </div>
              )}

              {/* ── 2. DIVERGEN SIMULATOR ── */}
              {activeBoundaryId === 'divergen' && (
                <div className="w-full h-48 sm:h-56 relative">
                  <svg viewBox="0 0 400 180" className="w-full h-full" style={{ shapeRendering: 'crispEdges' }}>
                    {/* Mantle */}
                    <rect x="0" y="80" width="400" height="100" fill="#7c2d12" />
                    <rect x="0" y="105" width="400" height="75" fill="#c2410c" />

                    {/* Left Plate */}
                    <g
                      style={{
                        transform: isSimulating ? 'translateX(-20px)' : 'none',
                        transition: 'transform 0.8s ease-in-out',
                      }}
                    >
                      <rect x="15" y="55" width="160" height="35" fill="#0284c7" />
                      <rect x="15" y="55" width="160" height="7" fill="#38bdf8" />
                      <text x="35" y="48" fill="#38bdf8" fontSize="9" fontWeight="bold" fontFamily="'Press Start 2P'">&lt; LEMPENG A</text>
                    </g>

                    {/* Right Plate */}
                    <g
                      style={{
                        transform: isSimulating ? 'translateX(20px)' : 'none',
                        transition: 'transform 0.8s ease-in-out',
                      }}
                    >
                      <rect x="225" y="55" width="160" height="35" fill="#0284c7" />
                      <rect x="225" y="55" width="160" height="7" fill="#38bdf8" />
                      <text x="245" y="48" fill="#38bdf8" fontSize="9" fontWeight="bold" fontFamily="'Press Start 2P'">LEMPENG B &gt;</text>
                    </g>

                    {/* Central Rift — Magma Upwelling */}
                    <rect x="180" y="55" width="40" height="35" fill="#ef4444" opacity="0.8" />
                    <polygon points="185,55 200,32 215,55" fill="#facc15" />
                    
                    {/* Ocean water */}
                    <rect x="0" y="28" width="400" height="27" fill="#0369a1" opacity="0.35" />

                    <text x="200" y="170" fill="#facc15" fontSize="9" fontWeight="bold" fontFamily="'Press Start 2P'" textAnchor="middle">
                      PEMATANG TENGAH SAMUDRA
                    </text>
                  </svg>
                </div>
              )}

              {/* ── 3. TRANSFORM SIMULATOR ── */}
              {activeBoundaryId === 'transform' && (
                <div className="w-full h-48 sm:h-56 relative">
                  <svg viewBox="0 0 400 180" className="w-full h-full" style={{ shapeRendering: 'crispEdges' }}>
                    {/* Base ground */}
                    <rect x="0" y="25" width="400" height="130" fill="#451a03" />

                    {/* Top Plate */}
                    <g
                      style={{
                        transform: isSimulating ? 'translateX(25px)' : 'none',
                        transition: 'transform 0.8s ease-in-out',
                      }}
                    >
                      <rect x="25" y="35" width="350" height="42" fill="#15803d" />
                      <rect x="25" y="35" width="350" height="7" fill="#86efac" />
                      <text x="45" y="60" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="'Press Start 2P'">
                        LEMPENG UTARA &gt;&gt; GESER KANAN
                      </text>
                    </g>

                    {/* Fault Line */}
                    <line x1="25" y1="82" x2="375" y2="82" stroke="#ef4444" strokeWidth="3" />

                    {/* Bottom Plate */}
                    <g
                      style={{
                        transform: isSimulating ? 'translateX(-25px)' : 'none',
                        transition: 'transform 0.8s ease-in-out',
                      }}
                    >
                      <rect x="25" y="87" width="350" height="42" fill="#a16207" />
                      <rect x="25" y="87" width="350" height="7" fill="#fde047" />
                      <text x="45" y="112" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="'Press Start 2P'">
                        LEMPENG SELATAN &lt;&lt; GESER KIRI
                      </text>
                    </g>

                    <text x="200" y="165" fill="#facc15" fontSize="9" fontWeight="bold" fontFamily="'Press Start 2P'" textAnchor="middle">
                      ZONA SESAR GESER MENDATAR
                    </text>
                  </svg>
                </div>
              )}
            </div>

            {/* RIGHT: Info Panel */}
            <div className="lg:col-span-5 flex flex-col gap-3">

              {/* Boundary Header Box */}
              <div className="rpg-dialog-box">
                <div className="flex items-center gap-2.5 mb-2 pb-2 border-b border-amber-900/30">
                  <PixelIcon name={activeBoundary.iconName} size={24} />
                  <div>
                    <div className="font-pixel-title text-xs text-amber-300">{activeBoundary.name}</div>
                    <div className="text-[10px] text-amber-500 uppercase">{activeBoundary.type}</div>
                  </div>
                </div>
                <p className="text-sm text-amber-200 leading-relaxed">{activeBoundary.movement}</p>
              </div>

              {/* Quick Info Cards */}
              <div className="grid grid-cols-1 gap-2">
                <div className="p-2.5 bg-amber-50 rounded-xl border-2 border-amber-950/30 flex items-start gap-2.5">
                  <PixelIcon name="map" size={18} className="text-amber-800 mt-0.5" />
                  <div>
                    <span className="text-[9px] text-amber-800 font-bold block uppercase">CONTOH DI ALAM:</span>
                    <span className="text-xs text-amber-950 font-bold">{activeBoundary.example}</span>
                  </div>
                </div>

                <div className="p-2.5 bg-rose-50 rounded-xl border-2 border-rose-900/30 flex items-start gap-2.5">
                  <PixelIcon name="alert" size={18} className="text-rose-700 mt-0.5" />
                  <div>
                    <span className="text-[9px] text-rose-800 font-bold block uppercase">DAMPAK GEOLOGIS:</span>
                    <span className="text-xs text-rose-950 font-bold">{activeBoundary.impact}</span>
                  </div>
                </div>
              </div>

              {/* Action Trigger Hint */}
              <div className="flex items-center gap-2 justify-center bg-amber-100/60 p-2 rounded-xl border border-amber-950/20">
                <PixelIcon name="cursor" size={14} />
                <span className="text-[10px] text-amber-800 font-bold">
                  Klik tombol "{activeBoundary.btnLabel}" di atas simulator untuk melihat pergerakan lempeng.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ TAB 2: LEMPENG INDONESIA ═══════════════ */}
      {activeTab === 'indonesia' && (
        <div className="space-y-4">

          {/* Interactive Indonesia Pixel Map */}
          <div className="bg-slate-950 p-4 rounded-2xl border-3 border-amber-950 shadow-[0_6px_0_#231206] relative">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
              <span className="text-[10px] font-pixel-title text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                PETA INTERAKSI 3 LEMPENG INDONESIA
              </span>
              <span className="text-[9px] text-slate-400 font-pixel-title font-bold">KLIK ZONA LEMPENG UNTUK DETAIL</span>
            </div>

            <div className="w-full h-44 sm:h-56 relative">
              <svg viewBox="0 0 400 200" className="w-full h-full" style={{ shapeRendering: 'crispEdges' }}>
                {/* Ocean background */}
                <rect width="400" height="200" fill="#0c4a6e" />

                {/* ── Eurasia Plate Zone ── */}
                <rect
                  x="80" y="40" width="200" height="100"
                  fill={activePlateId === 'eurasia' ? '#16a34a' : '#166534'}
                  opacity={activePlateId === 'eurasia' ? '0.45' : '0.2'}
                  stroke={activePlateId === 'eurasia' ? '#4ade80' : '#15803d'}
                  strokeWidth="2"
                  className="layer-interactive"
                  onClick={() => handlePlateClick('eurasia')}
                  rx="4"
                />
                <text x="150" y="55" fill="#4ade80" fontSize="9" fontWeight="bold" fontFamily="'Press Start 2P'" textAnchor="middle">EURASIA</text>

                {/* ── Indo-Australia Plate Zone ── */}
                <rect
                  x="60" y="130" width="220" height="55"
                  fill={activePlateId === 'indo-australia' ? '#ea580c' : '#9a3412'}
                  opacity={activePlateId === 'indo-australia' ? '0.45' : '0.2'}
                  stroke={activePlateId === 'indo-australia' ? '#fb923c' : '#c2410c'}
                  strokeWidth="2"
                  className="layer-interactive"
                  onClick={() => handlePlateClick('indo-australia')}
                  rx="4"
                />
                <text x="170" y="160" fill="#fb923c" fontSize="9" fontWeight="bold" fontFamily="'Press Start 2P'" textAnchor="middle">INDO-AUSTRALIA</text>
                <polygon points="170,148 175,140 180,148" fill="#fb923c" />
                <polygon points="140,148 145,140 150,148" fill="#fb923c" />

                {/* ── Pasifik Plate Zone ── */}
                <rect
                  x="290" y="50" width="95" height="90"
                  fill={activePlateId === 'pasifik' ? '#0284c7' : '#075985'}
                  opacity={activePlateId === 'pasifik' ? '0.45' : '0.2'}
                  stroke={activePlateId === 'pasifik' ? '#38bdf8' : '#0284c7'}
                  strokeWidth="2"
                  className="layer-interactive"
                  onClick={() => handlePlateClick('pasifik')}
                  rx="4"
                />
                <text x="335" y="70" fill="#38bdf8" fontSize="8" fontWeight="bold" fontFamily="'Press Start 2P'" textAnchor="middle">PASIFIK</text>
                <polygon points="305,95 298,90 305,85" fill="#38bdf8" />

                {/* ── Indonesia Islands (Pixel Blocks) ── */}
                {/* Sumatera */}
                <rect x="100" y="80" width="10" height="40" fill="#15803d" rx="1" />
                <rect x="97" y="90" width="8" height="25" fill="#15803d" rx="1" />
                {/* Jawa */}
                <rect x="120" y="118" width="35" height="6" fill="#15803d" rx="1" />
                {/* Kalimantan */}
                <rect x="145" y="82" width="25" height="25" fill="#166534" rx="2" />
                {/* Sulawesi */}
                <rect x="180" y="78" width="10" height="20" fill="#15803d" rx="1" />
                <rect x="185" y="90" width="12" height="8" fill="#15803d" rx="1" />
                {/* Papua */}
                <rect x="270" y="88" width="30" height="20" fill="#166534" rx="2" />
                {/* NTT */}
                <rect x="160" y="118" width="25" height="4" fill="#15803d" rx="1" />
                {/* Maluku */}
                <rect x="220" y="85" width="6" height="10" fill="#15803d" rx="1" />
                <rect x="230" y="90" width="5" height="8" fill="#15803d" rx="1" />

                {/* Collision zone dots */}
                <circle cx="110" cy="125" r="3" fill="#ef4444" />
                <circle cx="130" cy="126" r="3" fill="#ef4444" />
                <circle cx="150" cy="125" r="3" fill="#ef4444" />
                <circle cx="170" cy="123" r="3" fill="#ef4444" />
                <circle cx="280" cy="95" r="3" fill="#ef4444" />

                {/* Subduction line */}
                <line x1="90" y1="125" x2="200" y2="120" stroke="#ef4444" strokeWidth="2" opacity="0.6" />

                {/* Island codes */}
                <text x="105" y="105" fill="#86efac" fontSize="7" fontFamily="'Press Start 2P'" textAnchor="middle">SUM</text>
                <text x="137" y="115" fill="#86efac" fontSize="7" fontFamily="'Press Start 2P'" textAnchor="middle">JAW</text>
                <text x="157" y="95" fill="#86efac" fontSize="7" fontFamily="'Press Start 2P'" textAnchor="middle">KAL</text>
                <text x="285" y="100" fill="#86efac" fontSize="7" fontFamily="'Press Start 2P'" textAnchor="middle">PAP</text>
              </svg>
            </div>
          </div>

          {/* Plate Selector Cards */}
          <div className="grid grid-cols-3 gap-2">
            {INDONESIA_PLATES.map((p) => {
              const isSel = activePlateId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handlePlateClick(p.id)}
                  className={`p-2.5 rounded-xl border-2 border-amber-950 text-center cursor-pointer transition-all flex flex-col items-center gap-1 ${
                    isSel
                      ? 'bg-amber-400 text-amber-950 shadow-[0_3px_0_#78350f] ring-2 ring-amber-950'
                      : 'bg-white hover:bg-amber-100 text-amber-950 shadow-[0_2px_0_#78350f]'
                  }`}
                >
                  <PixelIcon name={p.iconName} size={20} />
                  <span className="block text-[10px] font-pixel-title mt-0.5">{p.name}</span>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <span className="w-2.5 h-2.5 rounded-full border border-amber-950" style={{ backgroundColor: p.color }} />
                    <span className="text-[9px] font-bold text-amber-700">{p.speed}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Plate Detail */}
          {activePlate && (
            <div className="rpg-dialog-box">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-amber-900/30">
                <span className="w-4 h-4 rounded-full border-2 border-amber-400" style={{ backgroundColor: activePlate.color }} />
                <div>
                  <div className="font-pixel-title text-xs text-amber-300">LEMPENG {activePlate.name.toUpperCase()}</div>
                  <div className="text-[9px] text-amber-500 uppercase">Arah: {activePlate.direction} • Kecepatan: {activePlate.speed}</div>
                </div>
              </div>
              <p className="text-xs text-amber-200 leading-relaxed">{activePlate.impact}</p>
            </div>
          )}

          {!activePlate && (
            <div className="flex items-center gap-2 justify-center py-2 bg-amber-200/50 rounded-xl border border-amber-950/20">
              <PixelIcon name="cursor" size={14} />
              <span className="text-[10px] text-amber-800 font-bold">
                Pilih salah satu lempeng di peta atau kartu di atas untuk membaca analisis geologinya.
              </span>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════ TAB 3: RING OF FIRE ═══════════════ */}
      {activeTab === 'ring-of-fire' && (
        <div className="space-y-4">

          {/* Globe SVG with Ring of Fire */}
          <div className="bg-slate-950 p-4 rounded-2xl border-3 border-amber-950 shadow-[0_6px_0_#231206]">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
              <span className="text-[10px] font-pixel-title text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                RING OF FIRE — CINCIN API PASIFIK
              </span>
              <span className="text-[9px] text-slate-400 font-pixel-title font-bold">KLIK / ARAHKAN KE TITIK MERAH</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Globe */}
              <div className="w-52 h-52 sm:w-64 sm:h-64 relative">
                <svg viewBox="0 0 240 240" className="w-full h-full" style={{ shapeRendering: 'crispEdges' }}>
                  {/* Earth globe */}
                  <circle cx="120" cy="120" r="100" fill="#0c4a6e" stroke="#1e3a8a" strokeWidth="3" />
                  
                  {/* Continents (pixel style blocks) */}
                  <rect x="40" y="55" width="18" height="35" fill="#15803d" opacity="0.85" rx="2" />
                  <rect x="45" y="85" width="15" height="55" fill="#166534" opacity="0.85" rx="2" />
                  <rect x="55" y="130" width="12" height="25" fill="#15803d" opacity="0.75" rx="2" />
                  <rect x="125" y="45" width="50" height="35" fill="#15803d" opacity="0.85" rx="2" />
                  <rect x="140" y="75" width="30" height="20" fill="#166534" opacity="0.75" rx="2" />
                  <rect x="140" y="100" width="25" height="8" fill="#15803d" opacity="0.85" rx="1" />
                  <rect x="150" y="108" width="18" height="15" fill="#166534" opacity="0.75" rx="1" />
                  <rect x="165" y="140" width="25" height="20" fill="#15803d" opacity="0.75" rx="2" />
                  <rect x="180" y="65" width="5" height="15" fill="#15803d" opacity="0.85" rx="1" />
                  
                  {/* Ring of Fire Arc */}
                  <path
                    d="M 55,145 Q 40,100 50,60 Q 65,35 100,30 Q 150,25 185,50 Q 200,75 195,100 Q 190,130 170,150 Q 155,165 145,140"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="3"
                    opacity="0.6"
                  />

                  {/* Volcano Dots */}
                  {VOLCANOES.map((v) => (
                    <g key={v.name}>
                      <circle
                        cx={v.x}
                        cy={v.y}
                        r={hoveredVolcano === v.name ? 6 : 3.5}
                        fill={hoveredVolcano === v.name ? '#facc15' : '#ef4444'}
                        className="layer-interactive"
                        onMouseEnter={() => setHoveredVolcano(v.name)}
                        onMouseLeave={() => setHoveredVolcano(null)}
                        onClick={() => {
                          retroAudio.playHover();
                          setHoveredVolcano(v.name);
                        }}
                      />
                    </g>
                  ))}
                </svg>

                {/* Hovered Volcano Tooltip */}
                {hoveredVolcano && (
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-amber-950 text-amber-200 rounded border-2 border-amber-500 text-[10px] font-pixel-title shadow-lg whitespace-nowrap z-10 flex items-center gap-1.5">
                    <PixelIcon name="volcano" size={14} />
                    <span>{hoveredVolcano}</span>
                  </div>
                )}
              </div>

              {/* Stats Panel with Pixel Icons */}
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-slate-800 rounded-xl border-2 border-slate-700 text-center flex flex-col items-center">
                    <PixelIcon name="volcano" size={24} className="mb-1" />
                    <span className="text-amber-400 font-pixel-title text-base block">127+</span>
                    <span className="text-[8px] text-slate-400 font-bold uppercase">Gunung Api Aktif RI</span>
                  </div>
                  <div className="p-2.5 bg-slate-800 rounded-xl border-2 border-slate-700 text-center flex flex-col items-center">
                    <PixelIcon name="convergent" size={24} className="mb-1 text-rose-400" />
                    <span className="text-rose-400 font-pixel-title text-base block">452+</span>
                    <span className="text-[8px] text-slate-400 font-bold uppercase">Gunung Api Cincin Api</span>
                  </div>
                  <div className="p-2.5 bg-slate-800 rounded-xl border-2 border-slate-700 text-center flex flex-col items-center">
                    <PixelIcon name="ruler" size={24} className="mb-1" />
                    <span className="text-cyan-400 font-pixel-title text-base block">40.000</span>
                    <span className="text-[8px] text-slate-400 font-bold uppercase">Km Panjang Sabuk</span>
                  </div>
                  <div className="p-2.5 bg-slate-800 rounded-xl border-2 border-slate-700 text-center flex flex-col items-center">
                    <PixelIcon name="ocean" size={24} className="mb-1" />
                    <span className="text-emerald-400 font-pixel-title text-base block">90%</span>
                    <span className="text-[8px] text-slate-400 font-bold uppercase">Gempa Bumi Global</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 text-center font-bold">
                  Arahkan kursor ke titik merah pada globe untuk melihat lokasi gunung api.
                </div>
              </div>
            </div>
          </div>

          {/* Conclusion Box */}
          <div className="p-3.5 bg-amber-950 text-amber-100 rounded-xl border-2 border-amber-500 shadow-[0_3px_0_#231206]">
            <div className="flex items-start gap-2.5">
              <PixelIcon name="shield" size={22} className="mt-0.5" />
              <div>
                <span className="font-pixel-title text-xs text-amber-400 block mb-1">
                  KESIMPULAN EDUKASI KESIAPSIAGAAN:
                </span>
                <p className="text-xs text-amber-200 leading-relaxed">
                  Indonesia berada di jalur Cincin Api Pasifik dan pertemuan 3 lempeng besar dunia. Gempa bumi adalah fenomena alam yang tidak dapat dicegah, namun dampaknya dapat diminimalisir melalui pemahaman jalur evakuasi, konstruksi tahan gempa, dan kesiapsiagaan warga sejak dini.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
