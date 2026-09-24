import { useState } from 'react';

interface GeologicalZone {
  id: string;
  name: string;
  category: string;
  description: string;
  cx: number;
  cy: number;
}

const GEOLOGICAL_ZONES: GeologicalZone[] = [
  {
    id: 'kawah',
    name: 'Kawah Vulkanik Aktif',
    category: 'Vulkanologi',
    description: 'Pusat erupsi tempat keluarnya material piroklastik, gas vulkanik, dan lava pijar.',
    cx: 480,
    cy: 165,
  },
  {
    id: 'dapur-magma',
    name: 'Dapur Magma (Magma Chamber)',
    category: 'Struktur Bawah Permukaan',
    description: 'Reservoir batuan cair bertekanan tinggi di bawah kerak bumi yang menyuplai erupsi.',
    cx: 480,
    cy: 420,
  },
  {
    id: 'lempeng-samudra',
    name: 'Lempeng Samudra (Oceanic Plate)',
    category: 'Tektonik Lempeng',
    description: 'Lempeng kerak yang lebih padat dan menyusup ke bawah lempeng benua (zona subduksi).',
    cx: 190,
    cy: 460,
  },
  {
    id: 'sesar-aktif',
    name: 'Sesar / Patahan Aktif (Fault Line)',
    category: 'Seismologi',
    description: 'Rekahan pada litosfer tempat pelepasan energi gelombang seismik pemicu gempa bumi.',
    cx: 780,
    cy: 450,
  },
];

export default function PixelSceneBg() {
  const [activeZone, setActiveZone] = useState<GeologicalZone | null>(null);

  return (
    <div className="relative w-full h-[380px] lg:h-[440px] rounded-2xl overflow-hidden border-2 border-slate-950 shadow-[0_8px_0_#0f172a] bg-[#090d16] select-none">
      {/* ── Scalable Pixel Art SVG Canvas ── */}
      <svg
        viewBox="0 0 1000 520"
        className="w-full h-full object-cover object-center"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
      >
        <defs>
          {/* Sky Gradient */}
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#08071a" />
            <stop offset="40%" stopColor="#1a1236" />
            <stop offset="75%" stopColor="#3d1d4d" />
            <stop offset="100%" stopColor="#69223e" />
          </linearGradient>

          {/* Magma Glow */}
          <radialGradient id="magmaGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff4500" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#ff0044" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#1a0914" stopOpacity="0" />
          </radialGradient>

          {/* Subduction Glow */}
          <linearGradient id="crustGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2b3342" />
            <stop offset="40%" stopColor="#1e232e" />
            <stop offset="100%" stopColor="#13161c" />
          </linearGradient>

          <linearGradient id="mantleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#541b12" />
            <stop offset="50%" stopColor="#3b0f0b" />
            <stop offset="100%" stopColor="#240707" />
          </linearGradient>

          <pattern id="pixelGrid" width="8" height="8" patternUnits="userSpaceOnUse">
            <rect width="8" height="8" fill="none" stroke="rgba(255,255,255,0.015)" strokeWidth="1" />
          </pattern>
        </defs>

        {/* ── 1. SKY & RETRO STARS ── */}
        <rect width="1000" height="320" fill="url(#skyGrad)" />

        {/* Pixel Stars */}
        <g fill="#fde047" opacity="0.85">
          <rect x="50" y="30" width="4" height="4" />
          <rect x="120" y="65" width="4" height="4" />
          <rect x="230" y="25" width="6" height="6" fill="#ffffff" />
          <rect x="340" y="80" width="4" height="4" />
          <rect x="420" y="35" width="4" height="4" />
          <rect x="590" y="25" width="6" height="6" fill="#ffffff" />
          <rect x="680" y="55" width="4" height="4" />
          <rect x="790" y="30" width="4" height="4" />
          <rect x="880" y="70" width="6" height="6" fill="#fed7aa" />
          <rect x="940" y="40" width="4" height="4" />
          <rect x="160" y="110" width="3" height="3" opacity="0.5" />
          <rect x="290" y="125" width="3" height="3" opacity="0.6" />
          <rect x="740" y="105" width="3" height="3" opacity="0.5" />
          <rect x="850" y="120" width="3" height="3" opacity="0.6" />
        </g>

        {/* Retro Pixel Moon */}
        <g transform="translate(860, 30)">
          <rect x="12" y="0" width="24" height="48" fill="#fef08a" />
          <rect x="6" y="6" width="36" height="36" fill="#fef08a" />
          <rect x="0" y="12" width="48" height="24" fill="#fef08a" />
          {/* Moon craters in pixel */}
          <rect x="16" y="12" width="8" height="8" fill="#fde047" />
          <rect x="28" y="24" width="10" height="10" fill="#fde047" />
          <rect x="12" y="28" width="6" height="6" fill="#fde047" />
        </g>

        {/* Drifting Pixel Clouds */}
        <g fill="#4a2e58" opacity="0.75">
          {/* Cloud 1 */}
          <rect x="80" y="80" width="96" height="16" />
          <rect x="104" y="68" width="64" height="12" />
          <rect x="120" y="56" width="32" height="12" />

          {/* Cloud 2 */}
          <rect x="640" y="95" width="128" height="18" />
          <rect x="672" y="80" width="80" height="15" />
          <rect x="696" y="68" width="48" height="12" />
        </g>

        {/* ── 2. DISTANT PIXEL MOUNTAIN RIDGES ── */}
        <g fill="#21153b">
          <polygon points="0,320 0,220 80,170 180,240 310,150 420,230 480,210 570,250 720,140 850,230 940,160 1000,210 1000,320" />
        </g>
        <g fill="#161d38">
          <polygon points="0,320 0,250 60,205 150,270 240,190 350,270 480,230 610,280 750,180 870,260 960,200 1000,240 1000,320" />
        </g>

        {/* ── 3. MAIN ERUPTING PIXEL VOLCANO (STRATOVOLCANO) ── */}
        {/* Volcanic Smoke plume */}
        <g fill="#332438">
          <rect x="460" y="50" width="40" height="30" opacity="0.6" />
          <rect x="440" y="30" width="80" height="25" opacity="0.5" />
          <rect x="430" y="10" width="100" height="25" opacity="0.4" />
          <rect x="470" y="75" width="20" height="40" opacity="0.8" />
        </g>
        <g fill="#ff7849">
          <rect x="474" y="105" width="12" height="25" />
          <rect x="470" y="90" width="20" height="15" />
          <rect x="476" y="70" width="8" height="20" fill="#fde047" />
        </g>

        {/* Mountain Body */}
        <polygon points="340,320 455,135 505,135 620,320" fill="#2d1c2b" />
        <polygon points="360,320 460,135 480,135 440,320" fill="#3f273d" />

        {/* Lava Fissure on mountain slope */}
        <polyline
          points="475,135 470,160 460,185 468,220 455,260 460,310"
          stroke="#ff3b19"
          strokeWidth="6"
          strokeLinecap="square"
          fill="none"
        />
        <polyline
          points="475,135 470,160 460,185 468,220 455,260 460,310"
          stroke="#fef08a"
          strokeWidth="2"
          strokeLinecap="square"
          fill="none"
        />

        {/* ── 4. SURFACE TERRAIN & VEGETATION / CRUST LINE ── */}
        {/* Grass / Ground Surface (Pixelated step effect) */}
        <rect x="0" y="316" width="1000" height="12" fill="#15803d" />
        <rect x="0" y="324" width="1000" height="10" fill="#166534" />
        <rect x="0" y="332" width="1000" height="12" fill="#78350f" />

        {/* Pixel trees / diorama indicators on surface */}
        <g fill="#14532d">
          {/* Tree group left */}
          <rect x="50" y="296" width="16" height="20" />
          <rect x="54" y="284" width="8" height="12" fill="#16a34a" />
          <rect x="56" y="316" width="4" height="4" fill="#78350f" />

          <rect x="110" y="292" width="20" height="24" />
          <rect x="114" y="278" width="12" height="14" fill="#22c55e" />
          <rect x="118" y="316" width="4" height="4" fill="#78350f" />

          {/* Tree group right */}
          <rect x="850" y="292" width="20" height="24" />
          <rect x="854" y="278" width="12" height="14" fill="#22c55e" />
          <rect x="910" y="296" width="16" height="20" />
          <rect x="914" y="284" width="8" height="12" fill="#16a34a" />
        </g>

        {/* ── 5. SUBTERRANEAN EARTH CROSS-SECTION (IPA TECTONIC LAYERS) ── */}
        {/* Layer 1: Litosfer & Kerak Bumi (Earth Crust) */}
        <rect x="0" y="340" width="1000" height="70" fill="url(#crustGrad)" />

        {/* Layer 2: Astenosfer & Mantel Bumi (Mantle) */}
        <rect x="0" y="410" width="1000" height="110" fill="url(#mantleGrad)" />

        {/* Magma Chamber (Dapur Magma) Glow */}
        <circle cx="480" cy="420" r="70" fill="url(#magmaGlow)" />
        <ellipse cx="480" cy="420" rx="45" ry="30" fill="#dc2626" />
        <ellipse cx="480" cy="420" rx="25" ry="16" fill="#facc15" />

        {/* Magma Conduit (Pipa Magma) ascending to Volcano */}
        <rect x="472" y="135" width="16" height="280" fill="#ea580c" />
        <rect x="476" y="135" width="8" height="280" fill="#fde047" />

        {/* Tectonic Plate Boundary / Subduction Fault Line (Sesar & Zona Subduksi) */}
        <g stroke="#f97316" strokeWidth="4" strokeDasharray="8 6" fill="none">
          {/* Subducting plate slant */}
          <path d="M 0,380 L 320,410 L 420,510" />
          {/* Right fault fracture */}
          <path d="M 680,340 L 760,430 L 840,510" stroke="#38bdf8" />
        </g>

        {/* Tectonic Movement Arrows (Pixelated vectors) */}
        {/* Left Subduction Arrow (Convergent towards center) */}
        <g fill="#f97316" transform="translate(180, 440)">
          <rect x="0" y="8" width="30" height="8" />
          <polygon points="30,0 46,12 30,24" />
          <text x="-5" y="-6" fill="#fdba74" fontSize="11" fontFamily="'JetBrains Mono', monospace" fontWeight="bold">
            LEMPENG INDO-AUSTRALIA ➔
          </text>
        </g>

        {/* Right Plate Arrow (Eurasian Continental plate) */}
        <g fill="#38bdf8" transform="translate(680, 470)">
          <rect x="16" y="8" width="30" height="8" />
          <polygon points="16,0 0,12 16,24" />
          <text x="-15" y="-6" fill="#93c5fd" fontSize="11" fontFamily="'JetBrains Mono', monospace" fontWeight="bold">
            ⯇ LEMPENG EURASIA
          </text>
        </g>

        {/* Geological Layer Section Banners */}
        <g transform="translate(14, 358)">
          <rect width="170" height="22" fill="#0f172a" rx="4" stroke="#475569" strokeWidth="1" />
          <text x="8" y="15" fill="#cbd5e1" fontSize="10" fontFamily="'JetBrains Mono', monospace" fontWeight="bold">
            KERAK BUMI (LITOSFER)
          </text>
        </g>

        <g transform="translate(14, 430)">
          <rect width="185" height="22" fill="#450a0a" rx="4" stroke="#dc2626" strokeWidth="1" />
          <text x="8" y="15" fill="#fca5a5" fontSize="10" fontFamily="'JetBrains Mono', monospace" fontWeight="bold">
            MANTEL BUMI & ASTENOSFER
          </text>
        </g>

        {/* ── 6. INTERACTIVE GEOLOGICAL INSPECTION NODES ── */}
        {GEOLOGICAL_ZONES.map((zone) => {
          const isSelected = activeZone?.id === zone.id;
          return (
            <g
              key={zone.id}
              className="cursor-pointer group"
              onClick={() => setActiveZone(zone)}
            >
              {/* Pulse Ring */}
              <circle
                cx={zone.cx}
                cy={zone.cy}
                r={isSelected ? 18 : 12}
                fill="none"
                stroke={isSelected ? '#facc15' : '#ffffff'}
                strokeWidth="2"
                strokeDasharray="4 2"
                opacity={isSelected ? 1 : 0.6}
              />
              {/* Node Core */}
              <circle
                cx={zone.cx}
                cy={zone.cy}
                r="6"
                fill={isSelected ? '#facc15' : '#ef4444'}
                stroke="#0f172a"
                strokeWidth="2"
              />
              {/* Pulse dot */}
              <circle cx={zone.cx} cy={zone.cy} r="2" fill="#ffffff" />
            </g>
          );
        })}

        {/* Pixel Grid scan overlay */}
        <rect width="1000" height="520" fill="url(#pixelGrid)" pointerEvents="none" />
      </svg>

      {/* ── Top HUD / Game Title Overlay ── */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-amber-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg border-2 border-amber-500/60 text-amber-300 font-pixel-title text-[10px] font-bold shadow-md pointer-events-auto">
          <span className="inline-block w-2.5 h-2.5 bg-amber-400 rounded-xs animate-pulse" />
          <span>DIORAMA TEKTONIK & VULKANO</span>
        </div>

        <div className="bg-amber-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg border-2 border-amber-800/60 text-amber-200 font-pixel text-xs hidden sm:flex items-center gap-2">
          <span>Klik titik</span>
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block animate-ping" />
          <span>untuk inspeksi struktur bumi</span>
        </div>
      </div>

      {/* ── Interactive Geological Zone Modal / Toast ── */}
      {activeZone && (
        <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-3 sm:w-96 bg-amber-950/95 backdrop-blur-md p-4 rounded-xl border-3 border-amber-500 shadow-[0_6px_0_#451a03] text-amber-100 z-30 animate-fade-in-up">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div>
              <span className="inline-block px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-pixel-title text-[9px] font-bold tracking-wider uppercase border border-amber-500/40 mb-1">
                {activeZone.category}
              </span>
              <h4 className="font-bold text-sm text-amber-100 flex items-center gap-2 font-pixel-title">
                {activeZone.name}
              </h4>
            </div>
            <button
              onClick={() => setActiveZone(null)}
              className="p-1 text-slate-400 hover:text-white rounded bg-slate-800 hover:bg-slate-700 transition-colors"
              title="Tutup"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {activeZone.description}
          </p>
        </div>
      )}
    </div>
  );
}
