interface PixelEarthExplodedProps {
  isExploded: boolean;
  activeLayerId: string;
  onToggleExplode: () => void;
  onSelectLayer: (layerId: string) => void;
}

// ── Shared Pixel Globe Renderer (100% Rapi & Identik, Ter-Clip Sempurna) ──
function EarthGlobeSurface({ radius = 75, clipId = 'earthClip' }: { radius?: number; clipId?: string }) {
  return (
    <g pointerEvents="none">
      <defs>
        <clipPath id={clipId}>
          <circle cx="0" cy="0" r={radius} />
        </clipPath>
      </defs>

      {/* Ocean Base Disc */}
      <circle cx="0" cy="0" r={radius} fill="#0284c7" />

      {/* Clipped Globe Content: Polar Ice, Continents, Clouds, 3D Shade */}
      <g clipPath={`url(#${clipId})`}>
        {/* Ocean Background Tone */}
        <circle cx="0" cy="0" r={radius} fill="#0369a1" />
        <circle cx="-8" cy="-8" r={radius * 0.95} fill="#0284c7" />

        {/* Polar Ice Caps (Kutub Utara & Selatan Ter-Clip Rapi di Lingkaran) */}
        <rect x={-radius} y={-radius} width={radius * 2} height={radius * 0.28} fill="#f8fafc" />
        <rect x={-radius * 0.5} y={-radius} width={radius} height={radius * 0.18} fill="#ffffff" />
        <rect x={-radius} y={radius * 0.74} width={radius * 2} height={radius * 0.28} fill="#f8fafc" />
        <rect x={-radius * 0.6} y={radius * 0.8} width={radius * 1.2} height={radius * 0.2} fill="#ffffff" />

        {/* ── Continents (Pixel Art Landmasses Rapi & Proporsional) ── */}
        {/* Eurasia & Asia Utara */}
        <rect x="-24" y="-52" width="56" height="24" fill="#15803d" />
        <rect x="-10" y="-60" width="44" height="18" fill="#16a34a" />
        <rect x="10" y="-42" width="38" height="26" fill="#15803d" />
        <rect x="24" y="-30" width="28" height="22" fill="#16a34a" />
        <rect x="-32" y="-42" width="16" height="20" fill="#16a34a" />
        <rect x="0" y="-34" width="26" height="20" fill="#22c55e" />

        {/* Kepulauan Asia Tenggara & Indonesia */}
        <rect x="22" y="0" width="12" height="5" fill="#15803d" />
        <rect x="36" y="8" width="14" height="6" fill="#16a34a" />
        <rect x="26" y="16" width="16" height="5" fill="#22c55e" />

        {/* Benua Australia */}
        <rect x="44" y="24" width="24" height="18" fill="#15803d" />
        <rect x="48" y="28" width="16" height="12" fill="#16a34a" />

        {/* Benua Afrika & Eropa */}
        <rect x="-48" y="-18" width="34" height="38" fill="#15803d" />
        <rect x="-38" y="12" width="22" height="28" fill="#16a34a" />
        <rect x="-32" y="32" width="14" height="18" fill="#15803d" />
        <rect x="-42" y="-6" width="24" height="22" fill="#22c55e" />

        {/* Benua Amerika (Sisi Barat) */}
        <rect x="-72" y="-48" width="20" height="32" fill="#15803d" />
        <rect x="-68" y="-24" width="14" height="16" fill="#16a34a" />
        <rect x="-64" y="-4" width="12" height="36" fill="#15803d" />
        <rect x="-60" y="8" width="16" height="24" fill="#16a34a" />

        {/* Awan Putih Pixel (Cloud Swirls) */}
        <rect x="-65" y="-26" width="32" height="5" fill="#ffffff" opacity="0.65" />
        <rect x="12" y="-50" width="40" height="5" fill="#ffffff" opacity="0.75" />
        <rect x="-10" y="14" width="46" height="5" fill="#ffffff" opacity="0.6" />
        <rect x="-40" y="44" width="36" height="5" fill="#ffffff" opacity="0.55" />

        {/* 3D Sphere Shading Ring */}
        <path
          d={`M 0 ${-radius} A ${radius} ${radius} 0 0 1 ${radius} 0 A ${radius} ${radius} 0 0 1 0 ${radius} A ${radius * 0.88} ${radius * 0.88} 0 0 0 0 ${-radius} Z`}
          fill="#022c43"
          opacity="0.32"
        />
      </g>
    </g>
  );
}

export default function PixelEarthExploded({
  isExploded,
  activeLayerId,
  onToggleExplode,
  onSelectLayer,
}: PixelEarthExplodedProps) {
  // Helper check status aktif
  const isBenuaActive = activeLayerId === 'kerak-benua';
  const isSamudraActive = activeLayerId === 'kerak-samudra';
  const isLitosferActive = activeLayerId === 'litosfer' || isBenuaActive || isSamudraActive;

  const isMantelAtasActive = activeLayerId === 'mantel-atas';
  const isMantelBawahActive = activeLayerId === 'mantel-bawah';
  const isAstenosferActive = activeLayerId === 'astenosfer' || isMantelAtasActive || isMantelBawahActive;

  const isIntiLuarActive = activeLayerId === 'inti-luar';
  const isIntiDalamActive = activeLayerId === 'inti-dalam';
  const isBarisferActive = activeLayerId === 'barisfer' || isIntiLuarActive || isIntiDalamActive;

  return (
    <div className="flex flex-col items-center w-full select-none">
      {/* ── SVG CANVAS (460 x 300) ── */}
      <svg
        viewBox="0 0 460 300"
        className="w-full max-w-[460px] h-[255px] sm:h-[285px] overflow-visible drop-shadow-md"
        shapeRendering="crispEdges"
      >
        <defs>
          {/* Atmosphere Glow */}
          <radialGradient id="atmoGlow" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="#38bdf8" stopOpacity="0" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.45" />
          </radialGradient>

          {/* Asthenosphere Red-Orange */}
          <linearGradient id="wedgeAstheno" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="60%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#c2410c" />
          </linearGradient>

          {/* Outer Core Orange-Amber */}
          <linearGradient id="wedgeOuterCore" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          {/* Inner Core Solid Yellow */}
          <linearGradient id="wedgeInnerCore" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#facc15" />
          </linearGradient>
        </defs>

        {/* ════════════════════════════════════════════════════════════════
            MODE 1: BOLA BUMI UTUH (WHOLE GLOBE DENGAN BANNER & PANAH RAPI)
           ════════════════════════════════════════════════════════════════ */}
        {!isExploded && (
          <g onClick={onToggleExplode} className="group cursor-pointer">
            {/* Banner Klik di Atas */}
            <g transform="translate(230, 16)">
              <rect
                x="-125"
                y="-11"
                width="250"
                height="22"
                fill="#f59e0b"
                stroke="#451a03"
                strokeWidth="2.5"
                rx="6"
                className="anim-earth-pulse-glow"
              />
              <text
                x="0"
                y="4"
                textAnchor="middle"
                fill="#451a03"
                fontFamily="'Plus Jakarta Sans', sans-serif"
                fontSize="11"
                fontWeight="900"
                pointerEvents="none"
              >
                KLIK BUMI ➔ LIHAT IRISAN
              </text>
            </g>

            {/* Panah Penunjuk */}
            <g transform="translate(230, 42)" pointerEvents="none">
              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="0,0; 0,6; 0,0"
                  dur="1.2s"
                  repeatCount="indefinite"
                />
                <polygon points="-7,-4 7,-4 0,7" fill="#facc15" stroke="#451a03" strokeWidth="2" />
              </g>
            </g>

            {/* Globe Body */}
            <g transform="translate(230, 175)" className="transition-transform group-hover:scale-105">
              {/* Atmosphere Glow */}
              <circle cx="0" cy="0" r="92" fill="url(#atmoGlow)" />
              {/* Shared Earth Globe */}
              <EarthGlobeSurface radius={84} clipId="wholeEarthClip" />
              {/* Invisible full hitbox circle for robust clicking */}
              <circle cx="0" cy="0" r="86" fill="transparent" pointerEvents="all" />
              {/* Globe Outer Border */}
              <circle cx="0" cy="0" r="84" fill="none" stroke="#231206" strokeWidth="4" pointerEvents="none" />
            </g>
          </g>
        )}

        {/* ════════════════════════════════════════════════════════════════
            MODE 2: IRISAN BUMI 3D (CUTAWAY GLOBE + PIE WEDGE ANIMASI)
           ════════════════════════════════════════════════════════════════ */}
        {isExploded && (
          <g>
            {/* ── BAGIAN KIRI: BOLA BUMI DENGAN KAVITAS POTONGAN ── */}
            <g transform="translate(110, 150)">
              {/* Base Globe Surface (Klik pada permukaan bumi memilih kerak benua/samudra) */}
              <g
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectLayer('kerak-benua');
                }}
                className="cursor-pointer group"
              >
                <EarthGlobeSurface radius={75} clipId="cutawayEarthClip" />
                <circle cx="0" cy="0" r="75" fill="transparent" pointerEvents="all" />
              </g>

              {/* Wedge Socket Cutout (Kavitas Berlapis Interior) */}
              {/* Lapisan Mantel Dalam Rongga */}
              <path
                d="M 0 0 L 66 -35 A 75 75 0 0 1 66 35 Z"
                fill={isMantelAtasActive || isMantelBawahActive ? '#f97316' : '#c2410c'}
                stroke="#451a03"
                strokeWidth="2"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectLayer('mantel-atas');
                }}
                className="cursor-pointer hover:brightness-125 transition-all"
              />
              {/* Lapisan Inti Luar Dalam Rongga */}
              <path
                d="M 0 0 L 44 -23 A 50 50 0 0 1 44 23 Z"
                fill={isIntiLuarActive ? '#fbbf24' : '#ea580c'}
                stroke="#451a03"
                strokeWidth="2"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectLayer('inti-luar');
                }}
                className="cursor-pointer hover:brightness-125 transition-all"
              />
              {/* Lapisan Inti Dalam Pusat Rongga */}
              <path
                d="M 0 0 L 23 -12 A 26 26 0 0 1 23 12 Z"
                fill={isIntiDalamActive ? '#ffffff' : '#facc15'}
                stroke="#451a03"
                strokeWidth="2"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectLayer('inti-dalam');
                }}
                className="cursor-pointer hover:brightness-125 transition-all"
              />

              {/* Socket Cut Edge Outlines */}
              <line x1="0" y1="0" x2="66" y2="-35" stroke="#231206" strokeWidth="2.5" pointerEvents="none" />
              <line x1="0" y1="0" x2="66" y2="35" stroke="#231206" strokeWidth="2.5" pointerEvents="none" />

              {/* Outer Border Bulat */}
              <circle cx="0" cy="0" r="75" fill="none" stroke="#231206" strokeWidth="3" pointerEvents="none" />
            </g>

            {/* ── GARIS PROYEKSI PUTUS-PUTUS ── */}
            <g
              stroke="#94a3b8"
              strokeWidth="1.8"
              className="anim-projection-lines"
              pointerEvents="none"
            >
              <line x1="176" y1="115" x2="255" y2="38" />
              <line x1="176" y1="150" x2="275" y2="62" />
              <line x1="110" y1="150" x2="315" y2="255" />
            </g>

            {/* ════════════════════════════════════════════════════════════
                BAGIAN KANAN: IRISAN 3D WEDGE (GEOLOGICAL PIE WEDGE)
               ════════════════════════════════════════════════════════════ */}
            <g className="anim-wedge-extract">
              {/* ── 1. LAYER: MANTEL ATAS / ASTENOSFER ── */}
              <g
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectLayer('mantel-atas');
                }}
                className="cursor-pointer group"
              >
                {/* Sisi Kiri */}
                <polygon
                  points="255,38 275,62 288,118 272,101"
                  fill={isMantelAtasActive ? '#f97316' : '#c2410c'}
                  stroke={isMantelAtasActive ? '#facc15' : '#7c2d12'}
                  strokeWidth={isMantelAtasActive ? '3' : '1.5'}
                  className="transition-all group-hover:brightness-115"
                />
                {/* Sisi Depan */}
                <polygon
                  points="275,62 375,48 360,105 288,118"
                  fill={isMantelAtasActive ? '#f97316' : 'url(#wedgeAstheno)'}
                  stroke={isMantelAtasActive ? '#facc15' : '#7c2d12'}
                  strokeWidth={isMantelAtasActive ? '3.5' : '2'}
                  className="transition-all group-hover:brightness-115"
                />
              </g>

              {/* ── 2. LAYER: MANTEL BAWAH / MESOSFER ── */}
              <g
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectLayer('mantel-bawah');
                }}
                className="cursor-pointer group"
              >
                {/* Sisi Kiri */}
                <polygon
                  points="272,101 288,118 298,172 289,162"
                  fill={isMantelBawahActive ? '#ea580c' : '#9a3412'}
                  stroke={isMantelBawahActive ? '#facc15' : '#7c2d12'}
                  strokeWidth={isMantelBawahActive ? '3' : '1.5'}
                  className="transition-all group-hover:brightness-115"
                />
                {/* Sisi Depan */}
                <polygon
                  points="288,118 360,105 345,160 298,172"
                  fill={isMantelBawahActive ? '#c2410c' : '#ea580c'}
                  stroke={isMantelBawahActive ? '#facc15' : '#7c2d12'}
                  strokeWidth={isMantelBawahActive ? '3.5' : '2'}
                  className="transition-all group-hover:brightness-115"
                />
              </g>

              {/* ── 3. LAYER: INTI LUAR (OUTER CORE) ── */}
              <g
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectLayer('inti-luar');
                }}
                className="cursor-pointer group"
              >
                {/* Sisi Kiri */}
                <polygon
                  points="289,162 298,172 306,220 304,216"
                  fill={isIntiLuarActive ? '#f59e0b' : '#b45309'}
                  stroke={isIntiLuarActive ? '#facc15' : '#78350f'}
                  strokeWidth={isIntiLuarActive ? '3' : '1.5'}
                  className="transition-all group-hover:brightness-115"
                />
                {/* Sisi Depan */}
                <polygon
                  points="298,172 345,160 330,212 306,220"
                  fill={isIntiLuarActive ? '#fbbf24' : 'url(#wedgeOuterCore)'}
                  stroke={isIntiLuarActive ? '#facc15' : '#78350f'}
                  strokeWidth={isIntiLuarActive ? '3.5' : '2'}
                  className="transition-all group-hover:brightness-115"
                />
              </g>

              {/* ── 4. LAYER: INTI DALAM (INNER CORE) ── */}
              <g
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectLayer('inti-dalam');
                }}
                className="cursor-pointer group"
              >
                {/* Sisi Kiri */}
                <polygon
                  points="304,216 306,220 315,255"
                  fill={isIntiDalamActive ? '#fef08a' : '#ca8a04'}
                  stroke={isIntiDalamActive ? '#facc15' : '#78350f'}
                  strokeWidth={isIntiDalamActive ? '3' : '1.5'}
                  className="transition-all group-hover:brightness-115"
                />
                {/* Sisi Depan */}
                <polygon
                  points="306,220 330,212 315,255"
                  fill={isIntiDalamActive ? '#ffffff' : 'url(#wedgeInnerCore)'}
                  stroke={isIntiDalamActive ? '#b45309' : '#78350f'}
                  strokeWidth={isIntiDalamActive ? '3.5' : '2'}
                  className="transition-all group-hover:brightness-115"
                />
              </g>

              {/* ── 5. LAYER: LITOSFER - KERAK SAMUDRA (OCEAN SURFACE) ── */}
              <g
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectLayer('kerak-samudra');
                }}
                className="cursor-pointer group"
              >
                {/* Base Surface Polygon */}
                <polygon
                  points="255,38 305,32 320,55 275,62"
                  fill={isSamudraActive ? '#0284c7' : '#0ea5e9'}
                  stroke={isSamudraActive ? '#facc15' : '#1e3a8a'}
                  strokeWidth={isSamudraActive ? '3.5' : '2'}
                  className="transition-all group-hover:brightness-115"
                />
                {/* Extra transparent hit polygon to guarantee 100% effortless click */}
                <polygon
                  points="250,35 308,28 322,58 270,66"
                  fill="transparent"
                  pointerEvents="all"
                />
                {/* Gelombang Air Laut Samudra (pointer-events none so they never intercept clicks) */}
                <line x1="268" y1="46" x2="295" y2="42" stroke="#bae6fd" strokeWidth="2" pointerEvents="none" />
                <line x1="278" y1="52" x2="305" y2="48" stroke="#bae6fd" strokeWidth="2" pointerEvents="none" />
              </g>

              {/* ── 6. LAYER: LITOSFER - KERAK BENUA (CONTINENTAL SURFACE) ── */}
              <g
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectLayer('kerak-benua');
                }}
                className="cursor-pointer group"
              >
                {/* Base Surface Polygon */}
                <polygon
                  points="305,32 355,26 375,48 320,55"
                  fill={isBenuaActive ? '#15803d' : '#16a34a'}
                  stroke={isBenuaActive ? '#facc15' : '#14532d'}
                  strokeWidth={isBenuaActive ? '3.5' : '2'}
                  className="transition-all group-hover:brightness-115"
                />
                {/* Extra transparent hit polygon */}
                <polygon
                  points="302,28 358,22 378,50 318,58"
                  fill="transparent"
                  pointerEvents="all"
                />
                {/* Pegunungan Pixel di Area Benua (pointerEvents none) */}
                <polygon points="328,44 340,24 352,44" fill="#78716c" stroke="#292524" strokeWidth="1.5" pointerEvents="none" />
                <polygon points="345,42 356,28 366,42" fill="#a8a29e" stroke="#292524" strokeWidth="1.5" pointerEvents="none" />
                <polygon points="337,30 340,24 344,30" fill="#f8fafc" pointerEvents="none" />
                {/* Pohon Hijau Pixel (pointerEvents none) */}
                <rect x="315" y="42" width="4" height="6" fill="#15803d" pointerEvents="none" />
                <rect x="366" y="38" width="4" height="6" fill="#166534" pointerEvents="none" />
              </g>

              {/* ── D. GARIS TEPI RIDGE & BINGKAI IRISAN LUAR (OUTLINES) ── */}
              {/* Rusuk Tengah Pembagi Sisi Kiri & Muka Depan */}
              <line x1="275" y1="62" x2="315" y2="255" stroke="#231206" strokeWidth="2.5" pointerEvents="none" />
              {/* Bingkai Luar Litosfer Teratas */}
              <polygon
                points="255,38 355,26 375,48 275,62"
                fill="none"
                stroke={isLitosferActive ? '#f59e0b' : '#451a03'}
                strokeWidth={isLitosferActive ? '3' : '2'}
                pointerEvents="none"
              />
              {/* Garis Tepi Irisan Luar Tebal */}
              <polygon
                points="255,38 355,26 375,48 315,255 255,38"
                fill="none"
                stroke="#231206"
                strokeWidth="3"
                pointerEvents="none"
              />

              {/* ── E. INDIKATOR BRACKET LAPISAN UTAMA (INTERACTIVE) ── */}
              {/* Bracket 1: Litosfer (Atas) */}
              <g
                transform="translate(388, 38)"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectLayer('kerak-benua');
                }}
                className="cursor-pointer hover:brightness-125"
              >
                <path d="M 0 -8 L 6 -8 L 6 10 L 0 10" fill="none" stroke={isLitosferActive ? '#f59e0b' : '#94a3b8'} strokeWidth="1.5" />
                <text x="10" y="3" fill={isLitosferActive ? '#facc15' : '#cbd5e1'} fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="8" fontWeight="bold">
                  LITOSFER
                </text>
              </g>

              {/* Bracket 2: Astenosfer (Tengah) */}
              <g
                transform="translate(378, 112)"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectLayer('mantel-atas');
                }}
                className="cursor-pointer hover:brightness-125"
              >
                <path d="M 0 -36 L 6 -36 L 6 36 L 0 36" fill="none" stroke={isAstenosferActive ? '#f97316' : '#94a3b8'} strokeWidth="1.5" />
                <text x="10" y="4" fill={isAstenosferActive ? '#f97316' : '#cbd5e1'} fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="8" fontWeight="bold">
                  ASTENOSFER
                </text>
              </g>

              {/* Bracket 3: Barisfer (Bawah) */}
              <g
                transform="translate(355, 212)"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectLayer('inti-luar');
                }}
                className="cursor-pointer hover:brightness-125"
              >
                <path d="M 0 -32 L 6 -32 L 6 32 L 0 32" fill="none" stroke={isBarisferActive ? '#eab308' : '#94a3b8'} strokeWidth="1.5" />
                <text x="10" y="4" fill={isBarisferActive ? '#fde047' : '#cbd5e1'} fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="8" fontWeight="bold">
                  BARISFER
                </text>
              </g>

              {/* ── F. TEKS LABEL LAPISAN PADA IRISAN 3D ── */}
              <g id="wedge-labels" pointerEvents="none">
                {/* Astenosfer Teks */}
                <text
                  x="324"
                  y="81"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontFamily="'Plus Jakarta Sans', sans-serif"
                  fontSize="7.5"
                  fontWeight="bold"
                  style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.95))' }}
                >
                  ASTENOSFER
                </text>
                <text
                  x="324"
                  y="91"
                  textAnchor="middle"
                  fill="#fef08a"
                  fontFamily="'Plus Jakarta Sans', sans-serif"
                  fontSize="6.5"
                  fontWeight="bold"
                  style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.95))' }}
                >
                  (MANTEL ATAS)
                </text>

                {/* Mesosfer Teks */}
                <text
                  x="322"
                  y="141"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontFamily="'Plus Jakarta Sans', sans-serif"
                  fontSize="7.5"
                  fontWeight="bold"
                  style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.95))' }}
                >
                  MESOSFER
                </text>

                {/* Inti Luar Teks */}
                <text
                  x="319"
                  y="190"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontFamily="'Plus Jakarta Sans', sans-serif"
                  fontSize="7"
                  fontWeight="bold"
                  style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.95))' }}
                >
                  INTI LUAR
                </text>
              </g>
            </g>
          </g>
        )}
      </svg>

      {/* ── TOMBOL PILIH AREA INTERAKTIF & INDIKATOR LAPISAN UTAMA ── */}
      {isExploded && (
        <div className="w-full flex flex-col gap-2 mt-1 px-1">
          {/* Level 1: 3 Tab Lapisan Utama Geologis */}
          <div className="grid grid-cols-3 gap-1.5 w-full">
            <button
              onClick={() => onSelectLayer('kerak-benua')}
              className={`py-1.5 px-2 rounded-lg border-2 text-[10px] sm:text-xs font-sans font-bold cursor-pointer transition-all text-center ${isLitosferActive
                ? 'bg-amber-400 text-amber-950 border-amber-950 shadow-[0_2px_0_#78350f]'
                : 'bg-amber-100 text-amber-900 border-amber-950/40 hover:bg-amber-200'
                }`}
            >
              1. LITOSFER
            </button>
            <button
              onClick={() => onSelectLayer('mantel-atas')}
              className={`py-1.5 px-2 rounded-lg border-2 text-[10px] sm:text-xs font-sans font-bold cursor-pointer transition-all text-center ${isAstenosferActive
                ? 'bg-orange-500 text-white border-amber-950 shadow-[0_2px_0_#451a03]'
                : 'bg-amber-100 text-amber-900 border-amber-950/40 hover:bg-amber-200'
                }`}
            >
              2. ASTENOSFER
            </button>
            <button
              onClick={() => onSelectLayer('inti-luar')}
              className={`py-1.5 px-2 rounded-lg border-2 text-[10px] sm:text-xs font-sans font-bold cursor-pointer transition-all text-center ${isBarisferActive
                ? 'bg-yellow-400 text-amber-950 border-amber-950 shadow-[0_2px_0_#78350f]'
                : 'bg-amber-100 text-amber-900 border-amber-950/40 hover:bg-amber-200'
                }`}
            >
              3. BARISFER
            </button>
          </div>

          {/* Level 2: Sub-Area dengan Badge Lapisan Induk yang Jelas */}
          <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-950/30 flex flex-col gap-1.5">
            {/* Indikator Status Lapisan Induk */}
            <div className="flex items-center justify-between border-b border-amber-950/20 pb-1.5 flex-wrap gap-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
                <span className="text-[8px] font-pixel-title text-amber-900 uppercase">
                  LAPISAN INDUK:{' '}
                  <strong className="text-amber-950">
                    {isLitosferActive ? '1. LITOSFER' : isAstenosferActive ? '2. ASTENOSFER' : '3. BARISFER'}
                  </strong>
                </span>
              </div>
              <span className="text-[7.5px] text-amber-700 font-pixel">
                {isLitosferActive
                  ? '(Kerak Kaku Luar)'
                  : isAstenosferActive
                    ? '(Mantel Plastis & Mesosfer)'
                    : '(Inti Logam Terdalam)'}
              </span>
            </div>

            {/* Tombol Sub-Area */}
            <div className="flex items-center justify-between gap-2 flex-wrap pt-0.5">
              <span className="text-[7.5px] font-pixel-title text-amber-800 uppercase shrink-0">
                PILIH SUB-BAGIAN:
              </span>

              {/* Sub-bagian Litosfer */}
              {isLitosferActive && (
                <div className="flex gap-1.5">
                  <button
                    onClick={() => onSelectLayer('kerak-benua')}
                    className={`px-2.5 py-1 rounded border text-[8.5px] font-pixel-title cursor-pointer transition-all ${isBenuaActive
                      ? 'bg-emerald-600 text-white border-emerald-950 shadow-[0_2px_0_#064e3b]'
                      : 'bg-amber-100 text-amber-900 border-amber-950/30 hover:bg-amber-200'
                      }`}
                  >
                    Area Benua
                  </button>
                  <button
                    onClick={() => onSelectLayer('kerak-samudra')}
                    className={`px-2.5 py-1 rounded border text-[8.5px] font-pixel-title cursor-pointer transition-all ${isSamudraActive
                      ? 'bg-sky-600 text-white border-sky-950 shadow-[0_2px_0_#082f49]'
                      : 'bg-amber-100 text-amber-900 border-amber-950/30 hover:bg-amber-200'
                      }`}
                  >
                    Area Samudra
                  </button>
                </div>
              )}

              {/* Sub-bagian Astenosfer */}
              {isAstenosferActive && (
                <div className="flex gap-1.5">
                  <button
                    onClick={() => onSelectLayer('mantel-atas')}
                    className={`px-2.5 py-1 rounded border text-[8.5px] font-pixel-title cursor-pointer transition-all ${isMantelAtasActive
                      ? 'bg-orange-600 text-white border-orange-950 shadow-[0_2px_0_#451a03]'
                      : 'bg-amber-100 text-amber-900 border-amber-950/30 hover:bg-amber-200'
                      }`}
                  >
                    Mantel Atas
                  </button>
                  <button
                    onClick={() => onSelectLayer('mantel-bawah')}
                    className={`px-2.5 py-1 rounded border text-[8.5px] font-pixel-title cursor-pointer transition-all ${isMantelBawahActive
                      ? 'bg-red-700 text-white border-red-950 shadow-[0_2px_0_#451a03]'
                      : 'bg-amber-100 text-amber-900 border-amber-950/30 hover:bg-amber-200'
                      }`}
                  >
                    Mesosfer
                  </button>
                </div>
              )}

              {/* Sub-bagian Barisfer */}
              {isBarisferActive && (
                <div className="flex gap-1.5">
                  <button
                    onClick={() => onSelectLayer('inti-luar')}
                    className={`px-2.5 py-1 rounded border text-[8.5px] font-pixel-title cursor-pointer transition-all ${isIntiLuarActive
                      ? 'bg-amber-500 text-amber-950 border-amber-950 shadow-[0_2px_0_#451a03]'
                      : 'bg-amber-100 text-amber-900 border-amber-950/30 hover:bg-amber-200'
                      }`}
                  >
                    Inti Luar
                  </button>
                  <button
                    onClick={() => onSelectLayer('inti-dalam')}
                    className={`px-2.5 py-1 rounded border text-[8.5px] font-pixel-title cursor-pointer transition-all ${isIntiDalamActive
                      ? 'bg-yellow-400 text-amber-950 border-amber-950 shadow-[0_2px_0_#451a03]'
                      : 'bg-amber-100 text-amber-900 border-amber-950/30 hover:bg-amber-200'
                      }`}
                  >
                    Inti Dalam
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mode Switch Toggle Button */}
      <button
        onClick={onToggleExplode}
        className={`mt-2 px-3.5 py-1.5 rounded-lg border-2 text-[8.5px] font-pixel-title cursor-pointer transition-all shadow-[0_2px_0_#231206] active:translate-y-0.5 ${isExploded
          ? 'bg-amber-200 hover:bg-amber-300 text-amber-950 border-amber-950'
          : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-emerald-950'
          }`}
      >
        {isExploded ? '◀ KEMBALIKAN KE BOLA BUMI UTUH' : 'BEDAH IRISAN BUMI 3D ▶'}
      </button>
    </div>
  );
}
