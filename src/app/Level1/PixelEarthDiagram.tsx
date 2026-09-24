interface PixelEarthDiagramProps {
  activeLayerId: string | null;
  onSelectLayer?: (id: string) => void;
  className?: string;
  depthPercent?: number; // 0 to 1
}

export default function PixelEarthDiagram({
  activeLayerId,
  onSelectLayer,
  className = 'w-64 h-64 sm:w-80 sm:h-80',
  depthPercent,
}: PixelEarthDiagramProps) {
  const isCrust = activeLayerId === 'crust';
  const isMantle = activeLayerId === 'mantle';
  const isOuterCore = activeLayerId === 'outer-core';
  const isInnerCore = activeLayerId === 'inner-core';
  const hasActive = !!activeLayerId;

  return (
    <div className={`relative select-none flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 300 300"
        className="w-full h-full drop-shadow-2xl"
        style={{ shapeRendering: 'crispEdges' }}
      >
        <defs>
          {/* Keyframes for Active Layer Glow & Expansion */}
          <style>{`
            @keyframes activeGoldenAura {
              0%, 100% {
                opacity: 0.95;
                filter: drop-shadow(0 0 10px rgba(254, 240, 138, 0.9)) drop-shadow(0 0 4px rgba(245, 158, 11, 0.8));
              }
              50% {
                opacity: 0.5;
                filter: drop-shadow(0 0 4px rgba(251, 191, 36, 0.5));
              }
            }
            @keyframes activeDashFlow {
              0% { stroke-dashoffset: 0; }
              100% { stroke-dashoffset: 28; }
            }
            @keyframes activePulseScale {
              0%, 100% {
                transform: scale(1);
              }
              50% {
                transform: scale(1.035);
              }
            }
            .active-anim-glow {
              animation: activeGoldenAura 1.4s ease-in-out infinite, activeDashFlow 2.8s linear infinite;
              transform-origin: 150px 150px;
            }
            .active-anim-scale {
              animation: activePulseScale 1.4s ease-in-out infinite;
              transform-origin: 150px 150px;
            }
          `}</style>

          {/* Atmosphere Glow */}
          <radialGradient id="atmoGlow" cx="50%" cy="50%" r="50%">
            <stop offset="85%" stopColor="#38bdf8" stopOpacity="0" />
            <stop offset="96%" stopColor="#38bdf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.8" />
          </radialGradient>

          {/* Mantle Depth Gradient */}
          <linearGradient id="mantleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#991b1b" />
            <stop offset="35%" stopColor="#dc2626" />
            <stop offset="75%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>

          {/* Mantle Rim Cut Gradient */}
          <linearGradient id="mantleRimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7f1d1d" />
            <stop offset="50%" stopColor="#991b1b" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </linearGradient>

          {/* Outer Core Depth Gradient */}
          <linearGradient id="outerCoreGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ea580c" />
            <stop offset="45%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>

          {/* Outer Core Rim Cut Gradient */}
          <linearGradient id="outerCoreRimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c2410c" />
            <stop offset="50%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#c2410c" />
          </linearGradient>

          {/* Inner Core 3D Sphere Radial Gradient */}
          <radialGradient id="innerCoreGrad" cx="38%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#fef08a" />
            <stop offset="65%" stopColor="#facc15" />
            <stop offset="90%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ca8a04" />
          </radialGradient>

          {/* Clip path for full globe circle */}
          <clipPath id="fullGlobeClip">
            <circle cx="150" cy="150" r="120" />
          </clipPath>

          {/* Clip path for top crust arc */}
          <clipPath id="topCrustClip">
            <path d="M 30,150 A 120,120 0 0,1 270,150 L 270,150 A 108,108 0 0,0 30,150 Z" />
          </clipPath>

          {/* Clip path for lower globe hemisphere */}
          <clipPath id="lowerGlobeClip">
            <path d="M 30,150 A 120,120 0 0,0 270,150 A 120,38 0 0,1 30,150 Z" />
          </clipPath>
        </defs>

        {/* ── 0. BACKGROUND STARS ── */}
        <g opacity="0.6">
          <rect x="25" y="40" width="2" height="2" fill="#ffffff" />
          <rect x="270" y="35" width="3" height="3" fill="#bae6fd" />
          <rect x="285" y="180" width="2" height="2" fill="#ffffff" />
          <rect x="15" y="220" width="2" height="2" fill="#ffffff" />
          <rect x="50" y="270" width="3" height="3" fill="#bae6fd" />
          <rect x="240" y="260" width="2" height="2" fill="#ffffff" />
        </g>

        {/* Outer Atmosphere Glow Halo */}
        <circle cx="150" cy="150" r="124" fill="url(#atmoGlow)" />
        <circle
          cx="150"
          cy="150"
          r="122"
          fill="none"
          stroke={activeLayerId === 'crust' ? '#fbbf24' : '#38bdf8'}
          strokeWidth={activeLayerId === 'crust' ? 2.5 : 1.5}
          opacity={activeLayerId === 'crust' ? 1 : 0.6}
        />

        {/* ═══════════════════════════════════════════════════════════════
            TOP HALF CROSS-SECTION LAYERS (Sliced Nested Domes)
        ═══════════════════════════════════════════════════════════════ */}

        {/* ── 1. LAYER: KERAK BUMI (TOP SLICE ARC) ── */}
        <g
          className="layer-interactive transition-all duration-300"
          onClick={() => onSelectLayer?.('crust')}
          style={{
            cursor: 'pointer',
            opacity: hasActive ? (isCrust ? 1 : 0.32) : 1,
            filter: hasActive ? (isCrust ? 'brightness(1.25) saturate(1.2) drop-shadow(0 0 6px rgba(56, 189, 248, 0.7))' : 'brightness(0.4) saturate(0.3)') : 'none',
            transform: isCrust ? 'scale(1.03)' : 'scale(1)',
            transformOrigin: '150px 150px',
          }}
        >
          {/* Top Outer Crust Base (Ocean Blue) */}
          <path
            d="M 30,150 A 120,120 0 0,1 270,150 A 120,38 0 0,1 30,150 Z"
            fill="#0284c7"
            stroke={activeLayerId === 'crust' ? '#fbbf24' : '#0369a1'}
            strokeWidth={activeLayerId === 'crust' ? 3.5 : 2}
          />

          {/* Top Arc Landmasses (Neatly clipped inside the top crust ring) */}
          <g clipPath="url(#topCrustClip)" pointerEvents="none">
            {/* North America & Greenland Arc */}
            <path
              d="M 50,135 Q 70,70 115,40 L 125,50 Q 85,80 70,140 Z"
              fill="#22c55e"
            />
            <path
              d="M 85,55 Q 105,42 120,44 L 118,58 Q 98,58 85,68 Z"
              fill="#ffffff"
              opacity="0.9"
            />
            {/* Scandinavia & Siberia Arc */}
            <path
              d="M 145,35 Q 195,40 245,95 L 235,108 Q 190,55 145,48 Z"
              fill="#22c55e"
            />
            <path
              d="M 160,38 Q 200,45 230,85 L 222,95 Q 192,58 158,50 Z"
              fill="#16a34a"
            />
            <path
              d="M 185,42 Q 215,55 240,85 L 235,92 Q 212,65 185,50 Z"
              fill="#15803d"
            />
          </g>

          {/* Crust Cross-section Cut Rim (Dark slate/brown rocky crust) */}
          <path
            d="M 30,150 A 120,38 0 0,0 270,150 A 108,34 0 0,1 30,150 Z"
            fill="#334155"
          />
          <path
            d="M 36,150 A 114,36 0 0,0 264,150 A 108,34 0 0,1 36,150 Z"
            fill="#451a03"
          />
        </g>

        {/* ── 2. LAYER: MANTEL BUMI (MANTLE) ── */}
        <g
          className="layer-interactive transition-all duration-300"
          onClick={() => onSelectLayer?.('mantle')}
          style={{
            cursor: 'pointer',
            opacity: hasActive ? (isMantle ? 1 : 0.32) : 1,
            filter: hasActive ? (isMantle ? 'brightness(1.3) saturate(1.3) drop-shadow(0 0 10px rgba(234, 88, 12, 0.8))' : 'brightness(0.4) saturate(0.3)') : 'none',
            transform: isMantle ? 'scale(1.045)' : 'scale(1)',
            transformOrigin: '150px 150px',
          }}
        >
          {/* Mantle Upper Dome Back Wall */}
          <path
            d="M 42,150 A 108,108 0 0,1 258,150 A 108,34 0 0,1 42,150 Z"
            fill="url(#mantleGrad)"
            stroke={activeLayerId === 'mantle' ? '#fbbf24' : '#991b1b'}
            strokeWidth={activeLayerId === 'mantle' ? 4 : 1.5}
          />

          {/* Pixel Magma Texture / Speckles on Mantle Dome */}
          <g fill="#7f1d1d" opacity="0.6">
            <rect x="60" y="95" width="5" height="4" rx="1" />
            <rect x="85" y="75" width="6" height="5" rx="1" />
            <rect x="120" y="60" width="7" height="5" rx="1" />
            <rect x="165" y="62" width="6" height="5" rx="1" />
            <rect x="205" y="78" width="6" height="4" rx="1" />
            <rect x="228" y="105" width="5" height="4" rx="1" />
            <rect x="75" y="125" width="6" height="4" rx="1" />
            <rect x="215" y="125" width="6" height="4" rx="1" />
          </g>

          <g fill="#fde047" opacity="0.85">
            <rect x="70" y="85" width="3" height="3" />
            <rect x="105" y="68" width="4" height="4" />
            <rect x="145" y="55" width="4" height="4" />
            <rect x="185" y="68" width="3" height="3" />
            <rect x="220" y="90" width="4" height="3" />
            <rect x="95" y="110" width="3" height="3" />
            <rect x="195" y="112" width="4" height="3" />
          </g>

          <g fill="#ea580c" opacity="0.7">
            <rect x="52" y="110" width="4" height="4" />
            <rect x="135" y="80" width="5" height="4" />
            <rect x="160" y="78" width="5" height="4" />
            <rect x="238" y="115" width="4" height="4" />
          </g>

          {/* Mantle Cross-section Horizontal Cut Lip (Bottom Rim) */}
          <path
            d="M 42,150 A 108,34 0 0,0 258,150 A 78,25 0 0,1 42,150 Z"
            fill="url(#mantleRimGrad)"
            stroke={activeLayerId === 'mantle' ? '#fbbf24' : '#7f1d1d'}
            strokeWidth={activeLayerId === 'mantle' ? 2 : 1}
          />
          {/* Rim Speckles */}
          <rect x="65" y="152" width="4" height="2" fill="#ea580c" />
          <rect x="95" y="158" width="5" height="3" fill="#f97316" />
          <rect x="135" y="162" width="6" height="3" fill="#facc15" />
          <rect x="165" y="162" width="5" height="3" fill="#f97316" />
          <rect x="205" y="157" width="5" height="3" fill="#ea580c" />
          <rect x="235" y="152" width="4" height="2" fill="#facc15" />
        </g>

        {/* ── 3. LAYER: INTI LUAR (OUTER CORE) ── */}
        <g
          className="layer-interactive transition-all duration-300"
          onClick={() => onSelectLayer?.('outer-core')}
          style={{
            cursor: 'pointer',
            opacity: hasActive ? (isOuterCore ? 1 : 0.32) : 1,
            filter: hasActive ? (isOuterCore ? 'brightness(1.35) saturate(1.3) drop-shadow(0 0 10px rgba(245, 158, 11, 0.8))' : 'brightness(0.4) saturate(0.3)') : 'none',
            transform: isOuterCore ? 'scale(1.055)' : 'scale(1)',
            transformOrigin: '150px 150px',
          }}
        >
          {/* Outer Core Upper Dome Back Wall */}
          <path
            d="M 72,150 A 78,78 0 0,1 228,150 A 78,25 0 0,1 72,150 Z"
            fill="url(#outerCoreGrad)"
            stroke={activeLayerId === 'outer-core' ? '#fbbf24' : '#ea580c'}
            strokeWidth={activeLayerId === 'outer-core' ? 4 : 1.5}
          />

          {/* Molten Core Bubble / Droplet Pixel Texture */}
          <g fill="#ea580c" opacity="0.65">
            <rect x="90" y="118" width="5" height="4" rx="1" />
            <rect x="115" y="95" width="6" height="5" rx="1" />
            <rect x="145" y="85" width="7" height="5" rx="1" />
            <rect x="175" y="95" width="6" height="5" rx="1" />
            <rect x="200" y="118" width="5" height="4" rx="1" />
          </g>

          <g fill="#fef08a" opacity="0.9">
            <rect x="102" y="105" width="3" height="3" />
            <rect x="130" y="90" width="4" height="4" />
            <rect x="160" y="90" width="4" height="4" />
            <rect x="188" y="105" width="3" height="3" />
            <rect x="145" y="112" width="4" height="3" />
          </g>

          {/* Outer Core Horizontal Cut Rim */}
          <path
            d="M 72,150 A 78,25 0 0,0 228,150 A 46,15 0 0,1 72,150 Z"
            fill="url(#outerCoreRimGrad)"
            stroke={activeLayerId === 'outer-core' ? '#fbbf24' : '#c2410c'}
            strokeWidth={activeLayerId === 'outer-core' ? 2 : 1}
          />
          {/* Rim golden specks */}
          <rect x="100" y="153" width="4" height="2" fill="#fef08a" />
          <rect x="195" y="153" width="4" height="2" fill="#fef08a" />
        </g>

        {/* ── 4. LAYER: INTI DALAM (INNER CORE — 3D CENTRAL SPHERE) ── */}
        <g
          className="layer-interactive transition-all duration-300"
          onClick={() => onSelectLayer?.('inner-core')}
          style={{
            cursor: 'pointer',
            opacity: hasActive ? (isInnerCore ? 1 : 0.32) : 1,
            filter: hasActive ? (isInnerCore ? 'brightness(1.4) saturate(1.3) drop-shadow(0 0 12px rgba(254, 240, 138, 0.95))' : 'brightness(0.4) saturate(0.3)') : 'none',
            transform: isInnerCore ? 'scale(1.08)' : 'scale(1)',
            transformOrigin: '150px 142px',
          }}
        >
          {/* Drop shadow underneath the inner core sphere */}
          <ellipse cx="150" cy="158" rx="36" ry="12" fill="#78350f" opacity="0.5" />

          {/* Glowing Central 3D Sphere */}
          <circle
            cx="150"
            cy="142"
            r="36"
            fill="url(#innerCoreGrad)"
            stroke={activeLayerId === 'inner-core' ? '#fbbf24' : '#d97706'}
            strokeWidth={activeLayerId === 'inner-core' ? 4 : 2}
          />

          {/* 3D Pixel Shading Crescent on Right/Bottom */}
          <path
            d="M 150,106 A 36,36 0 0,1 176,166 A 34,34 0 0,0 150,106 Z"
            fill="#eab308"
            opacity="0.6"
          />
          <path
            d="M 158,114 A 36,36 0 0,1 172,160 A 30,30 0 0,0 158,114 Z"
            fill="#ca8a04"
            opacity="0.75"
          />

          {/* 3D Pixel Specular Highlight (Top Left Glow) */}
          <rect x="136" y="122" width="12" height="12" fill="#ffffff" opacity="0.85" rx="3" />
          <rect x="132" y="126" width="6" height="6" fill="#ffffff" opacity="0.6" rx="2" />
          <rect x="144" y="118" width="6" height="6" fill="#ffffff" opacity="0.6" rx="2" />
          <rect x="140" y="126" width="5" height="5" fill="#ffffff" />
        </g>

        {/* ═══════════════════════════════════════════════════════════════
            BOTTOM HALF: OUTER GLOBE (Permukaan Bumi / Kerak Bumi Luar)
            Klik di sini juga memilih KERAK BUMI
        ═══════════════════════════════════════════════════════════════ */}
        <g
          className="layer-interactive transition-all duration-300"
          onClick={() => onSelectLayer?.('crust')}
          style={{
            cursor: 'pointer',
            opacity: hasActive ? (isCrust ? 1 : 0.32) : 1,
            filter: hasActive ? (isCrust ? 'brightness(1.25) saturate(1.2) drop-shadow(0 0 8px rgba(56, 189, 248, 0.7))' : 'brightness(0.4) saturate(0.3)') : 'none',
            transform: isCrust ? 'scale(1.03)' : 'scale(1)',
            transformOrigin: '150px 150px',
          }}
          clipPath="url(#lowerGlobeClip)"
        >
          {/* Deep Blue Ocean Base */}
          <circle cx="150" cy="150" r="120" fill="#1e40af" />
          <path d="M 30,150 A 120,120 0 0,0 270,150 Z" fill="#1d4ed8" />
          {/* Transparent hit area */}
          <path d="M 30,150 A 120,120 0 0,0 270,150 Z" fill="transparent" pointerEvents="all" />

          {/* ── 1. CONTINENT SHALLOWS (Cyan / Teal Coastal Shelf) ── */}
          <g fill="#0284c7" opacity="0.9">
            {/* Africa Shallows */}
            <path d="M 124,152 Q 158,150 196,152 L 204,172 Q 212,188 214,198 L 198,212 L 188,232 L 176,258 L 144,258 L 132,236 L 122,216 L 110,195 L 114,170 Z" />
            {/* South America Shallows */}
            <path d="M 44,162 Q 70,158 98,168 L 104,198 Q 110,212 105,228 L 92,252 L 78,266 L 60,256 L 60,230 L 48,198 L 42,175 Z" />
            {/* Eurasia / Arabia / India Shallows */}
            <path d="M 190,152 L 244,154 L 246,178 L 236,204 L 210,198 L 190,178 Z" />
            {/* Australia / Indonesia Shallows */}
            <path d="M 224,180 L 268,180 L 268,228 L 242,255 L 218,236 L 222,204 Z" />
          </g>

          {/* ── 2. CONTINENT LANDMASSES (Vibrant Green Pixel Art) ── */}

          {/* SOUTH AMERICA (Left) */}
          <g>
            {/* Main Landmass */}
            <path
              d="M 50,166 Q 72,162 92,172 L 96,196 Q 102,208 97,222 L 86,245 L 76,260 L 67,252 L 67,228 L 56,198 L 48,178 Z"
              fill="#16a34a"
            />
            {/* Amazon Basin Lowlands (Bright Green) */}
            <path
              d="M 58,172 Q 76,168 88,176 L 91,195 Q 94,206 88,215 L 78,228 L 68,220 L 62,196 Z"
              fill="#22c55e"
            />
            {/* Andes Mountains Spine (Deep Green) */}
            <path
              d="M 52,176 L 58,198 L 68,232 L 76,256 L 72,256 L 64,232 L 56,202 L 50,182 Z"
              fill="#15803d"
            />
            {/* Highlight */}
            <rect x="70" y="182" width="10" height="15" fill="#4ade80" opacity="0.8" rx="2" />
          </g>

          {/* AFRICA & EUROPE (Center) */}
          <g>
            {/* Main Landmass Silhouette */}
            <path
              d="M 130,154 Q 160,152 190,154 L 196,172 Q 204,188 206,196 L 192,208 L 182,228 L 170,252 L 150,252 L 138,232 L 128,212 L 118,195 L 122,172 Z"
              fill="#16a34a"
            />
            {/* North Africa / Sahara Savanna (Warm Yellow-Green Tone) */}
            <path
              d="M 132,156 Q 160,154 188,156 L 192,172 L 186,182 L 126,182 L 124,170 Z"
              fill="#65a30d"
            />
            {/* Central & West Africa Jungle (Lush Emerald Green) */}
            <path
              d="M 122,184 L 184,184 L 188,204 L 178,220 L 148,220 L 136,204 L 120,195 Z"
              fill="#22c55e"
            />
            {/* Southern Africa (Deep Forest Green) */}
            <path
              d="M 148,220 L 178,220 L 168,248 L 152,248 L 142,230 Z"
              fill="#15803d"
            />
            {/* East Africa Horn */}
            <polygon points="186,182 204,195 190,206" fill="#15803d" />
            {/* Rainforest Highlights */}
            <rect x="142" y="192" width="16" height="12" fill="#4ade80" opacity="0.85" rx="2" />
            <rect x="155" y="198" width="12" height="10" fill="#86efac" opacity="0.75" rx="1.5" />
            {/* Madagascar Island */}
            <path
              d="M 194,222 L 200,224 L 196,242 L 190,238 Z"
              fill="#22c55e"
            />
          </g>

          {/* MIDDLE EAST & INDIA (Top-Right) */}
          <g>
            {/* Arabian Peninsula */}
            <path
              d="M 194,158 L 210,162 L 212,180 L 202,184 L 194,175 Z"
              fill="#ca8a04"
            />
            <rect x="198" y="164" width="8" height="10" fill="#eab308" rx="1" />
            {/* Indian Subcontinent (Triangle into ocean) */}
            <path
              d="M 216,164 L 236,166 L 226,192 Z"
              fill="#22c55e"
            />
            <polygon points="218,166 232,168 226,186" fill="#16a34a" />
          </g>

          {/* INDONESIAN ARCHIPELAGO & AUSTRALIA (Right Horizon) */}
          <g>
            {/* Maritime Southeast Asia / Indonesia Islands */}
            {/* Sumatra */}
            <path d="M 226,184 L 234,196 L 230,198 L 224,186 Z" fill="#22c55e" />
            {/* Java */}
            <rect x="232" y="198" width="14" height="4" fill="#22c55e" rx="1" />
            {/* Borneo */}
            <rect x="236" y="182" width="10" height="10" fill="#16a34a" rx="2" />
            {/* Sulawesi */}
            <rect x="248" y="186" width="5" height="8" fill="#22c55e" rx="1" />
            {/* Papua */}
            <rect x="254" y="192" width="12" height="6" fill="#16a34a" rx="1.5" />

            {/* Australia */}
            <path
              d="M 230,214 Q 255,208 266,218 L 264,242 Q 248,252 232,242 L 226,226 Z"
              fill="#16a34a"
            />
            <path
              d="M 234,218 Q 252,214 260,222 L 258,238 Q 246,244 235,236 Z"
              fill="#eab308"
              opacity="0.8"
            />
          </g>

          {/* ANTARCTICA POLAR ICE (South Pole) */}
          <g>
            <path
              d="M 115,264 Q 150,252 185,264 L 196,270 A 120,120 0 0,1 104,270 Z"
              fill="#e0f2fe"
            />
            <path
              d="M 125,260 Q 150,254 175,260 L 180,266 Q 150,260 120,266 Z"
              fill="#ffffff"
            />
          </g>

          {/* Atmospheric Specular Glint */}
          <ellipse cx="105" cy="205" rx="35" ry="18" fill="#60a5fa" opacity="0.18" />
        </g>

        {/* ── EQUATORIAL CUT SEAM LINE (Clean, Subtle Rim Boundary) ── */}
        <path
          d="M 30,150 A 120,38 0 0,0 270,150"
          fill="none"
          stroke="#0f172a"
          strokeWidth="1.5"
          opacity="0.75"
        />

        {/* ── ACTIVE LAYER GOLDEN ROTATING GLOW ACCENT ── */}
        {activeLayerId && (
          <g className="pointer-events-none">
            {isInnerCore && (
              <g className="active-anim-scale">
                {/* Aura Pendar Keemasan Lembut */}
                <circle
                  cx="150"
                  cy="142"
                  r="42"
                  fill="none"
                  stroke="#fef08a"
                  strokeWidth="2"
                  opacity="0.6"
                />
                {/* Garis Berpendar Emas Berputar */}
                <circle
                  cx="150"
                  cy="142"
                  r="39"
                  fill="none"
                  stroke="#fde047"
                  strokeWidth="3.5"
                  strokeDasharray="8 4"
                  className="active-anim-glow"
                />
              </g>
            )}

            {isOuterCore && (
              <g className="active-anim-scale">
                {/* Garis Berpendar Oranye-Emas Berputar */}
                <path
                  d="M 69,150 A 81,81 0 0,1 231,150 A 81,27 0 0,1 69,150 Z"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="4"
                  strokeDasharray="9 4"
                  className="active-anim-glow"
                />
              </g>
            )}

            {isMantle && (
              <g className="active-anim-scale">
                {/* Garis Berpendar Emas Cerah Berputar pada Mantel Bumi */}
                <path
                  d="M 39,150 A 111,111 0 0,1 261,150 A 111,36 0 0,1 39,150 Z"
                  fill="none"
                  stroke="#fde047"
                  strokeWidth="4.5"
                  strokeDasharray="10 5"
                  className="active-anim-glow"
                />
              </g>
            )}

            {isCrust && (
              <g className="active-anim-scale">
                {/* Garis Berpendar Biru-Emas Cerah pada Kerak Bumi */}
                <circle
                  cx="150"
                  cy="150"
                  r="124"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="4"
                  strokeDasharray="10 5"
                  className="active-anim-glow"
                />
              </g>
            )}
          </g>
        )}

        {/* ── DEPTH BEACON INDICATOR (EXPLORER POSITION) ── */}
        {depthPercent !== undefined && (
          <g className="pointer-events-none">
            {(() => {
              const clamped = Math.max(0, Math.min(1, depthPercent));
              // Moves from outer crust top (150, 32) downward to center inner core (150, 142)
              const by = 32 + clamped * 110;
              return (
                <g transform={`translate(150, ${by})`}>
                  <circle cx="0" cy="0" r="8" fill="#ef4444" opacity="0.4" />
                  <circle cx="0" cy="0" r="4.5" fill="#facc15" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="0" cy="0" r="1.5" fill="#ef4444" />
                </g>
              );
            })()}
          </g>
        )}
      </svg>
    </div>
  );
}
