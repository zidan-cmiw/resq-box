import pymupdf as fitz
import os

# ── 1. DEFINISI SVG ASLI DARI PROYEK RESQ-BOX (PixelEarthDiagram.tsx) ───────────
# Seluruh lapisan ditampilkan utuh 100% tanpa peredupan hitam (Kerak, Mantel, Inti Luar, Inti Dalam)

SVG_DEFS = '''
  <defs>
    <!-- Atmosphere Glow -->
    <radialGradient id="atmoGlow" cx="50%" cy="50%" r="50%">
      <stop offset="85%" stop-color="#38bdf8" stop-opacity="0" />
      <stop offset="96%" stop-color="#38bdf8" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#7dd3fc" stop-opacity="0.8" />
    </radialGradient>

    <!-- Mantle Depth Gradient -->
    <linearGradient id="mantleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#991b1b" />
      <stop offset="35%" stop-color="#dc2626" />
      <stop offset="75%" stop-color="#ea580c" />
      <stop offset="100%" stop-color="#f97316" />
    </linearGradient>

    <!-- Mantle Rim Cut Gradient -->
    <linearGradient id="mantleRimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#7f1d1d" />
      <stop offset="50%" stop-color="#991b1b" />
      <stop offset="100%" stop-color="#7f1d1d" />
    </linearGradient>

    <!-- Outer Core Depth Gradient -->
    <linearGradient id="outerCoreGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ea580c" />
      <stop offset="45%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#fbbf24" />
    </linearGradient>

    <!-- Outer Core Rim Cut Gradient -->
    <linearGradient id="outerCoreRimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#c2410c" />
      <stop offset="50%" stop-color="#d97706" />
      <stop offset="100%" stop-color="#c2410c" />
    </linearGradient>

    <!-- Inner Core 3D Sphere Radial Gradient -->
    <radialGradient id="innerCoreGrad" cx="38%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="25%" stop-color="#fef08a" />
      <stop offset="65%" stop-color="#facc15" />
      <stop offset="90%" stop-color="#eab308" />
      <stop offset="100%" stop-color="#ca8a04" />
    </radialGradient>

    <!-- Clip path for full globe circle -->
    <clipPath id="fullGlobeClip">
      <circle cx="150" cy="150" r="120" />
    </clipPath>

    <!-- Clip path for top crust arc -->
    <clipPath id="topCrustClip">
      <path d="M 30,150 A 120,120 0 0,1 270,150 L 270,150 A 108,108 0 0,0 30,150 Z" />
    </clipPath>

    <!-- Clip path for lower globe hemisphere -->
    <clipPath id="lowerGlobeClip">
      <path d="M 30,150 A 120,120 0 0,0 270,150 A 120,38 0 0,1 30,150 Z" />
    </clipPath>
  </defs>
'''

SVG_EARTH_GRAPHIC = '''
  <!-- Background Stars -->
  <g opacity="0.7">
    <rect x="25" y="40" width="2" height="2" fill="#ffffff" />
    <rect x="270" y="35" width="3" height="3" fill="#bae6fd" />
    <rect x="285" y="180" width="2" height="2" fill="#ffffff" />
    <rect x="15" y="220" width="2" height="2" fill="#ffffff" />
    <rect x="50" y="270" width="3" height="3" fill="#bae6fd" />
    <rect x="240" y="260" width="2" height="2" fill="#ffffff" />
  </g>

  <!-- Atmosphere Glow -->
  <circle cx="150" cy="150" r="124" fill="url(#atmoGlow)" />
  <circle cx="150" cy="150" r="122" fill="none" stroke="#38bdf8" stroke-width="1.5" opacity="0.8" />

  <!-- 1. LAYER: KERAK BUMI (TOP SLICE ARC) -->
  <g id="layer-crust-top">
    <!-- Top Outer Crust Base (Ocean Blue) -->
    <path d="M 30,150 A 120,120 0 0,1 270,150 A 120,38 0 0,1 30,150 Z" fill="#0284c7" stroke="#0369a1" stroke-width="2" />

    <!-- Top Arc Landmasses -->
    <g clip-path="url(#topCrustClip)">
      <path d="M 50,135 Q 70,70 115,40 L 125,50 Q 85,80 70,140 Z" fill="#22c55e" />
      <path d="M 85,55 Q 105,42 120,44 L 118,58 Q 98,58 85,68 Z" fill="#ffffff" opacity="0.9" />
      <path d="M 145,35 Q 195,40 245,95 L 235,108 Q 190,55 145,48 Z" fill="#22c55e" />
      <path d="M 160,38 Q 200,45 230,85 L 222,95 Q 192,58 158,50 Z" fill="#16a34a" />
      <path d="M 185,42 Q 215,55 240,85 L 235,92 Q 212,65 185,50 Z" fill="#15803d" />
    </g>

    <!-- Crust Cross-section Cut Rim -->
    <path d="M 30,150 A 120,38 0 0,0 270,150 A 108,34 0 0,1 30,150 Z" fill="#334155" />
    <path d="M 36,150 A 114,36 0 0,0 264,150 A 108,34 0 0,1 36,150 Z" fill="#451a03" />
  </g>

  <!-- 2. LAYER: MANTEL BUMI (MANTLE) -->
  <g id="layer-mantle">
    <!-- Mantle Upper Dome Back Wall -->
    <path d="M 42,150 A 108,108 0 0,1 258,150 A 108,34 0 0,1 42,150 Z" fill="url(#mantleGrad)" stroke="#991b1b" stroke-width="1.5" />

    <!-- Magma Speckles -->
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

    <!-- Mantle Horizontal Cut Rim -->
    <path d="M 42,150 A 108,34 0 0,0 258,150 A 78,25 0 0,1 42,150 Z" fill="url(#mantleRimGrad)" stroke="#7f1d1d" stroke-width="1" />
    <rect x="65" y="152" width="4" height="2" fill="#ea580c" />
    <rect x="95" y="158" width="5" height="3" fill="#f97316" />
    <rect x="135" y="162" width="6" height="3" fill="#facc15" />
    <rect x="165" y="162" width="5" height="3" fill="#f97316" />
    <rect x="205" y="157" width="5" height="3" fill="#ea580c" />
    <rect x="235" y="152" width="4" height="2" fill="#facc15" />
  </g>

  <!-- 3. LAYER: INTI LUAR (OUTER CORE) -->
  <g id="layer-outer-core">
    <!-- Outer Core Upper Dome Back Wall -->
    <path d="M 72,150 A 78,78 0 0,1 228,150 A 78,25 0 0,1 72,150 Z" fill="url(#outerCoreGrad)" stroke="#ea580c" stroke-width="1.5" />

    <!-- Molten Core Droplets -->
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

    <!-- Outer Core Horizontal Cut Rim -->
    <path d="M 72,150 A 78,25 0 0,0 228,150 A 46,15 0 0,1 72,150 Z" fill="url(#outerCoreRimGrad)" stroke="#c2410c" stroke-width="1" />
    <rect x="100" y="153" width="4" height="2" fill="#fef08a" />
    <rect x="195" y="153" width="4" height="2" fill="#fef08a" />
  </g>

  <!-- 4. LAYER: INTI DALAM (INNER CORE) -->
  <g id="layer-inner-core">
    <!-- Drop shadow -->
    <ellipse cx="150" cy="158" rx="36" ry="12" fill="#78350f" opacity="0.5" />

    <!-- Glowing Central 3D Sphere -->
    <circle cx="150" cy="142" r="36" fill="url(#innerCoreGrad)" stroke="#d97706" stroke-width="2" />

    <!-- Shading Crescent -->
    <path d="M 150,106 A 36,36 0 0,1 176,166 A 34,34 0 0,0 150,106 Z" fill="#eab308" opacity="0.6" />
    <path d="M 158,114 A 36,36 0 0,1 172,160 A 30,30 0 0,0 158,114 Z" fill="#ca8a04" opacity="0.75" />

    <!-- Specular Highlight -->
    <rect x="136" y="122" width="12" height="12" fill="#ffffff" opacity="0.85" rx="3" />
    <rect x="132" y="126" width="6" height="6" fill="#ffffff" opacity="0.6" rx="2" />
    <rect x="144" y="118" width="6" height="6" fill="#ffffff" opacity="0.6" rx="2" />
    <rect x="140" y="126" width="5" height="5" fill="#ffffff" />
  </g>

  <!-- BOTTOM HALF: OUTER GLOBE (KERAK BUMI & PERMUKAAN LAUT/BENUA) -->
  <g id="layer-crust-bottom">
    <!-- Deep Blue Ocean Base (Hanya setengah bawah bola bumi) -->
    <path d="M 30,150 A 120,120 0 0,0 270,150 A 120,38 0 0,1 30,150 Z" fill="#1e40af" />

    <!-- Coastal Shelf Shallows -->
    <g fill="#0284c7" opacity="0.9">
      <path d="M 124,152 Q 158,150 196,152 L 204,172 Q 212,188 214,198 L 198,212 L 188,232 L 176,258 L 144,258 L 132,236 L 122,216 L 110,195 L 114,170 Z" />
      <path d="M 44,162 Q 70,158 98,168 L 104,198 Q 110,212 105,228 L 92,252 L 78,266 L 60,256 L 60,230 L 48,198 L 42,175 Z" />
      <path d="M 190,152 L 244,154 L 246,178 L 236,204 L 210,198 L 190,178 Z" />
      <path d="M 224,180 L 268,180 L 268,228 L 242,255 L 218,236 L 222,204 Z" />
    </g>

    <!-- South America -->
    <path d="M 50,166 Q 72,162 92,172 L 96,196 Q 102,208 97,222 L 86,245 L 76,260 L 67,252 L 67,228 L 56,198 L 48,178 Z" fill="#16a34a" />
    <path d="M 58,172 Q 76,168 88,176 L 91,195 Q 94,206 88,215 L 78,228 L 68,220 L 62,196 Z" fill="#22c55e" />
    <path d="M 52,176 L 58,198 L 68,232 L 76,256 L 72,256 L 64,232 L 56,202 L 50,182 Z" fill="#15803d" />
    <rect x="70" y="182" width="10" height="15" fill="#4ade80" opacity="0.8" rx="2" />

    <!-- Africa & Europe -->
    <path d="M 130,154 Q 160,152 190,154 L 196,172 Q 204,188 206,196 L 192,208 L 182,228 L 170,252 L 150,252 L 138,232 L 128,212 L 118,195 L 122,172 Z" fill="#16a34a" />
    <path d="M 132,156 Q 160,154 188,156 L 192,172 L 186,182 L 126,182 L 124,170 Z" fill="#65a30d" />
    <path d="M 122,184 L 184,184 L 188,204 L 178,220 L 148,220 L 136,204 L 120,195 Z" fill="#22c55e" />
    <path d="M 148,220 L 178,220 L 168,248 L 152,248 L 142,230 Z" fill="#15803d" />
    <polygon points="186,182 204,195 190,206" fill="#15803d" />
    <rect x="142" y="192" width="16" height="12" fill="#4ade80" opacity="0.85" rx="2" />
    <rect x="155" y="198" width="12" height="10" fill="#86efac" opacity="0.75" rx="1.5" />
    <path d="M 194,222 L 200,224 L 196,242 L 190,238 Z" fill="#22c55e" />

    <!-- Middle East & India -->
    <path d="M 194,158 L 210,162 L 212,180 L 202,184 L 194,175 Z" fill="#ca8a04" />
    <rect x="198" y="164" width="8" height="10" fill="#eab308" rx="1" />
    <path d="M 216,164 L 236,166 L 226,192 Z" fill="#22c55e" />
    <polygon points="218,166 232,168 226,186" fill="#16a34a" />

    <!-- Indonesia & Australia -->
    <path d="M 226,184 L 234,196 L 230,198 L 224,186 Z" fill="#22c55e" />
    <rect x="232" y="198" width="14" height="4" fill="#22c55e" rx="1" />
    <rect x="236" y="182" width="10" height="10" fill="#16a34a" rx="2" />
    <rect x="248" y="186" width="5" height="8" fill="#22c55e" rx="1" />
    <rect x="254" y="192" width="12" height="6" fill="#16a34a" rx="1.5" />
    <path d="M 230,214 Q 255,208 266,218 L 264,242 Q 248,252 232,242 L 226,226 Z" fill="#16a34a" />
    <path d="M 234,218 Q 252,214 260,222 L 258,238 Q 246,244 235,236 Z" fill="#eab308" opacity="0.8" />

    <!-- Antarctica -->
    <path d="M 115,264 Q 150,252 185,264 L 196,270 A 120,120 0 0,1 104,270 Z" fill="#e0f2fe" />
    <path d="M 125,260 Q 150,254 175,260 L 180,266 Q 150,260 120,266 Z" fill="#ffffff" />
    <ellipse cx="105" cy="205" rx="35" ry="18" fill="#60a5fa" opacity="0.18" />
  </g>

  <!-- Equatorial Cut Seam Line -->
  <path d="M 30,150 A 120,38 0 0,0 270,150" fill="none" stroke="#0f172a" stroke-width="1.5" opacity="0.75" />
'''

# ── 2. TEMPLATE 1: KARTU WIDGET RADAR BUMI ASLI (PERSIS SCREENSHOT PENGGUNA) ────
# Dimensi 340 x 390 px dengan frame kayu retro, header icon globe + teks RADAR BUMI ▲
SVG_WIDGET = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 390" width="340" height="390" shape-rendering="crispEdges">
  {SVG_DEFS}

  <!-- Card Background & Wooden Frame Border -->
  <rect x="5" y="5" width="330" height="380" rx="22" ry="22" fill="#020617" stroke="#78350f" stroke-width="5" />
  <rect x="8" y="8" width="324" height="374" rx="18" ry="18" fill="none" stroke="#231206" stroke-width="3" opacity="0.8" />

  <!-- Header Container -->
  <g id="header">
    <!-- Globe Icon (16x16 Pixel Art) -->
    <g transform="translate(24, 20)">
      <rect x="4" y="1" width="8" height="14" fill="#0284c7" />
      <rect x="2" y="3" width="12" height="10" fill="#0284c7" />
      <rect x="1" y="4" width="14" height="8" fill="#0284c7" />
      <rect x="4" y="3" width="3" height="4" fill="#15803d" />
      <rect x="8" y="2" width="4" height="3" fill="#16a34a" />
      <rect x="9" y="5" width="3" height="3" fill="#22c55e" />
      <rect x="3" y="8" width="4" height="4" fill="#16a34a" />
      <rect x="10" y="9" width="3" height="3" fill="#15803d" />
      <rect x="5" y="12" width="5" height="2" fill="#f8fafc" />
      <rect x="5" y="1" width="5" height="1" fill="#f8fafc" />
    </g>

    <!-- Header Text: RADAR BUMI -->
    <text x="50" y="33" fill="#fbbf24" font-family="'Press Start 2P', monospace, sans-serif" font-size="14" font-weight="bold" letter-spacing="1">RADAR BUMI</text>

    <!-- Orange Arrow Up: ▲ -->
    <polygon points="304,31 312,21 320,31" fill="#f59e0b" />

    <!-- Separator Line -->
    <line x1="18" y1="46" x2="322" y2="46" stroke="#78350f" stroke-width="2" opacity="0.6" />
  </g>

  <!-- Earth Graphic (Centered) -->
  <g transform="translate(20, 60)">
    {SVG_EARTH_GRAPHIC}
  </g>
</svg>'''

# ── 3. TEMPLATE 2: RADAR BUMI DENGAN LABEL LENGKAP KEDALAMAN (INFOGRAFIK EDUKASI) ──
# Menghadirkan garis penunjuk & anotasi kedalaman ke setiap lapisan
SVG_LABELED = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 440" width="680" height="440" shape-rendering="crispEdges">
  {SVG_DEFS}

  <!-- Card Background -->
  <rect x="6" y="6" width="668" height="428" rx="24" ry="24" fill="#020617" stroke="#78350f" stroke-width="6" />

  <!-- Header -->
  <g transform="translate(30, 24)">
    <g transform="translate(0, 0)">
      <rect x="4" y="1" width="8" height="14" fill="#0284c7" />
      <rect x="2" y="3" width="12" height="10" fill="#0284c7" />
      <rect x="1" y="4" width="14" height="8" fill="#0284c7" />
      <rect x="4" y="3" width="3" height="4" fill="#15803d" />
      <rect x="8" y="2" width="4" height="3" fill="#16a34a" />
      <rect x="9" y="5" width="3" height="3" fill="#22c55e" />
      <rect x="3" y="8" width="4" height="4" fill="#16a34a" />
      <rect x="10" y="9" width="3" height="3" fill="#15803d" />
      <rect x="5" y="12" width="5" height="2" fill="#f8fafc" />
    </g>
    <text x="24" y="13" fill="#fbbf24" font-family="'Press Start 2P', monospace, sans-serif" font-size="15" font-weight="bold">RADAR BUMI — PETA STRATA INTERNAL</text>
    <line x1="0" y1="26" x2="620" y2="26" stroke="#78350f" stroke-width="2.5" opacity="0.7" />
  </g>

  <!-- Earth Graphic (Left/Center) -->
  <g transform="translate(80, 80)">
    {SVG_EARTH_GRAPHIC}
  </g>

  <!-- Labels & Callout Lines on the Right -->
  <!-- 1. KERAK BUMI -->
  <g transform="translate(385, 120)">
    <polyline points="0,15 45,15 65,-5 250,-5" fill="none" stroke="#38bdf8" stroke-width="2.5" />
    <circle cx="0" cy="15" r="4" fill="#38bdf8" />
    <rect x="65" y="-26" width="190" height="28" rx="6" fill="#0369a1" stroke="#38bdf8" stroke-width="2" />
    <text x="75" y="-8" fill="#ffffff" font-family="'Press Start 2P', monospace, sans-serif" font-size="11" font-weight="bold">KERAK BUMI</text>
    <text x="65" y="16" fill="#7dd3fc" font-family="monospace, sans-serif" font-size="11">Kedalaman: 0 – 70 km</text>
    <text x="65" y="30" fill="#94a3b8" font-family="sans-serif" font-size="10">Kerak Benua &amp; Samudra (Padat Kaku)</text>
  </g>

  <!-- 2. MANTEL BUMI -->
  <g transform="translate(385, 195)">
    <polyline points="0,10 40,10 65,0 250,0" fill="none" stroke="#ea580c" stroke-width="2.5" />
    <circle cx="0" cy="10" r="4" fill="#ea580c" />
    <rect x="65" y="-22" width="190" height="28" rx="6" fill="#991b1b" stroke="#ea580c" stroke-width="2" />
    <text x="75" y="-4" fill="#ffffff" font-family="'Press Start 2P', monospace, sans-serif" font-size="11" font-weight="bold">MANTEL BUMI</text>
    <text x="65" y="20" fill="#fdba74" font-family="monospace, sans-serif" font-size="11">Kedalaman: 70 – 2.900 km</text>
    <text x="65" y="34" fill="#94a3b8" font-family="sans-serif" font-size="10">Astenosfer Magma Plastis &amp; Mesosfer</text>
  </g>

  <!-- 3. INTI LUAR -->
  <g transform="translate(385, 275)">
    <polyline points="0,5 35,5 65,-2 250,-2" fill="none" stroke="#f59e0b" stroke-width="2.5" />
    <circle cx="0" cy="5" r="4" fill="#f59e0b" />
    <rect x="65" y="-24" width="190" height="28" rx="6" fill="#b45309" stroke="#f59e0b" stroke-width="2" />
    <text x="75" y="-6" fill="#ffffff" font-family="'Press Start 2P', monospace, sans-serif" font-size="11" font-weight="bold">INTI LUAR</text>
    <text x="65" y="18" fill="#fde047" font-family="monospace, sans-serif" font-size="11">Kedalaman: 2.900 – 5.150 km</text>
    <text x="65" y="32" fill="#94a3b8" font-family="sans-serif" font-size="10">Cairan Logam Besi &amp; Nikel Panas</text>
  </g>

  <!-- 4. INTI DALAM -->
  <g transform="translate(385, 350)">
    <polyline points="0,-8 30,-8 65,0 250,0" fill="none" stroke="#facc15" stroke-width="2.5" />
    <circle cx="0" cy="-8" r="4" fill="#facc15" />
    <rect x="65" y="-22" width="190" height="28" rx="6" fill="#78350f" stroke="#facc15" stroke-width="2" />
    <text x="75" y="-4" fill="#ffffff" font-family="'Press Start 2P', monospace, sans-serif" font-size="11" font-weight="bold">INTI DALAM</text>
    <text x="65" y="20" fill="#fef08a" font-family="monospace, sans-serif" font-size="11">Kedalaman: 5.150 – 6.371 km</text>
    <text x="65" y="34" fill="#94a3b8" font-family="sans-serif" font-size="10">Bola Besi Padat Bertekanan Ekstrem</text>
  </g>
</svg>'''

# ── 4. RENDER KE FILE SVG & PNG (HD CRISP 300 DPI) ──────────────────────────────
output_dirs = [
    r'c:\github\lidm buatan vincent',
    r'c:\github\lidm buatan vincent\RESQ-BOX\public'
]

files_to_save = [
    # 1. Widget asli game (persis screenshot)
    ('radar_bumi.svg', SVG_WIDGET),
    # 2. Versi diagram lengkap dengan label
    ('radar_bumi_lengkap_label.svg', SVG_LABELED),
]

for out_dir in output_dirs:
    os.makedirs(out_dir, exist_ok=True)
    for filename, svg_content in files_to_save:
        svg_path = os.path.join(out_dir, filename)
        with open(svg_path, 'w', encoding='utf-8') as f:
            f.write(svg_content)
        
        # Render PNG resolusi tinggi via PyMuPDF (300 DPI / 4x zoom)
        png_filename = filename.replace('.svg', '.png')
        png_path = os.path.join(out_dir, png_filename)
        doc = fitz.open(stream=svg_content.encode('utf-8'), filetype='svg')
        page = doc[0]
        pix = page.get_pixmap(dpi=300)
        pix.save(png_path)
        print(f"Generated: {png_path} ({pix.width}x{pix.height} px)")

print("All real game assets generated successfully!")
