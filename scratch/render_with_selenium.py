import os
import time
from selenium import webdriver
from selenium.webdriver.edge.options import Options
from selenium.webdriver.common.by import By

# 1. BIKIN FILE HTML YANG ME-RENDER WIDGET PERSIS SCREENSHOT GAME
html_content_card = '''<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Pixelify+Sans:wght@700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 12px;
    font-family: 'Press Start 2P', monospace;
  }

  .radar-card {
    background: rgba(2, 6, 23, 0.96);
    border: 3.5px solid #78350f;
    border-radius: 18px;
    padding: 10px 10px 14px 10px;
    box-shadow: 0 6px 0 #231206, 0 10px 25px rgba(0,0,0,0.8);
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 320px;
  }

  .radar-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2px 6px 8px 6px;
    color: #fbbf24;
    font-size: 11px;
    border-bottom: 2px solid rgba(120, 53, 15, 0.6);
  }

  .radar-title {
    display: flex;
    align-items: center;
    gap: 7px;
    font-weight: bold;
    letter-spacing: 0.5px;
  }

  .arrow-indicator {
    color: #f59e0b;
    font-size: 12px;
  }

  .diagram-container {
    padding-top: 10px;
    width: 280px;
    height: 280px;
  }
</style>
</head>
<body>

<div class="radar-card" id="target-widget">
  <div class="radar-header">
    <div class="radar-title">
      <!-- 16x16 Pixel Globe Icon dari PixelIcon.tsx -->
      <svg viewBox="0 0 16 16" width="16" height="16" shape-rendering="crispEdges">
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
      </svg>
      <span>RADAR BUMI</span>
    </div>
    <span class="arrow-indicator">&#9650;</span>
  </div>

  <div class="diagram-container">
    <svg viewBox="0 0 300 300" width="100%" height="100%" shape-rendering="crispEdges">
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

        <clipPath id="topCrustClip">
          <path d="M 30,150 A 120,120 0 0,1 270,150 L 270,150 A 108,108 0 0,0 30,150 Z" />
        </clipPath>

        <clipPath id="lowerGlobeClip">
          <path d="M 30,150 A 120,120 0 0,0 270,150 A 120,38 0 0,1 30,150 Z" />
        </clipPath>
      </defs>

      <!-- Background Stars -->
      <g opacity="0.65">
        <rect x="25" y="40" width="2" height="2" fill="#ffffff" />
        <rect x="270" y="35" width="3" height="3" fill="#bae6fd" />
        <rect x="285" y="180" width="2" height="2" fill="#ffffff" />
        <rect x="15" y="220" width="2" height="2" fill="#ffffff" />
        <rect x="50" y="270" width="3" height="3" fill="#bae6fd" />
        <rect x="240" y="260" width="2" height="2" fill="#ffffff" />
      </g>

      <!-- Atmosphere Glow Halo -->
      <circle cx="150" cy="150" r="124" fill="url(#atmoGlow)" />
      <circle cx="150" cy="150" r="122" fill="none" stroke="#38bdf8" stroke-width="1.5" opacity="0.75" />

      <!-- 1. LAYER: KERAK BUMI (TOP SLICE ARC) -->
      <g id="layer-crust-top">
        <path d="M 30,150 A 120,120 0 0,1 270,150 A 120,38 0 0,1 30,150 Z" fill="#0284c7" stroke="#0369a1" stroke-width="2" />
        <g clip-path="url(#topCrustClip)">
          <path d="M 50,135 Q 70,70 115,40 L 125,50 Q 85,80 70,140 Z" fill="#22c55e" />
          <path d="M 85,55 Q 105,42 120,44 L 118,58 Q 98,58 85,68 Z" fill="#ffffff" opacity="0.9" />
          <path d="M 145,35 Q 195,40 245,95 L 235,108 Q 190,55 145,48 Z" fill="#22c55e" />
          <path d="M 160,38 Q 200,45 230,85 L 222,95 Q 192,58 158,50 Z" fill="#16a34a" />
          <path d="M 185,42 Q 215,55 240,85 L 235,92 Q 212,65 185,50 Z" fill="#15803d" />
        </g>
        <path d="M 30,150 A 120,38 0 0,0 270,150 A 108,34 0 0,1 30,150 Z" fill="#334155" />
        <path d="M 36,150 A 114,36 0 0,0 264,150 A 108,34 0 0,1 36,150 Z" fill="#451a03" />
      </g>

      <!-- 2. LAYER: MANTEL BUMI (MANTLE) -->
      <g id="layer-mantle">
        <path d="M 42,150 A 108,108 0 0,1 258,150 A 108,34 0 0,1 42,150 Z" fill="url(#mantleGrad)" stroke="#991b1b" stroke-width="1.5" />
        <!-- Pixel Magma Texture -->
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
        <!-- Mantle Cut Rim -->
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
        <path d="M 72,150 A 78,78 0 0,1 228,150 A 78,25 0 0,1 72,150 Z" fill="url(#outerCoreGrad)" stroke="#ea580c" stroke-width="1.5" />
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
        <!-- Outer Core Cut Rim -->
        <path d="M 72,150 A 78,25 0 0,0 228,150 A 46,15 0 0,1 72,150 Z" fill="url(#outerCoreRimGrad)" stroke="#c2410c" stroke-width="1" />
        <rect x="100" y="153" width="4" height="2" fill="#fef08a" />
        <rect x="195" y="153" width="4" height="2" fill="#fef08a" />
      </g>

      <!-- 4. LAYER: INTI DALAM (INNER CORE) -->
      <g id="layer-inner-core">
        <ellipse cx="150" cy="158" rx="36" ry="12" fill="#78350f" opacity="0.5" />
        <circle cx="150" cy="142" r="36" fill="url(#innerCoreGrad)" stroke="#d97706" stroke-width="2" />
        <path d="M 150,106 A 36,36 0 0,1 176,166 A 34,34 0 0,0 150,106 Z" fill="#eab308" opacity="0.6" />
        <path d="M 158,114 A 36,36 0 0,1 172,160 A 30,30 0 0,0 158,114 Z" fill="#ca8a04" opacity="0.75" />
        <rect x="136" y="122" width="12" height="12" fill="#ffffff" opacity="0.85" rx="3" />
        <rect x="132" y="126" width="6" height="6" fill="#ffffff" opacity="0.6" rx="2" />
        <rect x="144" y="118" width="6" height="6" fill="#ffffff" opacity="0.6" rx="2" />
        <rect x="140" y="126" width="5" height="5" fill="#ffffff" />
      </g>

      <!-- BOTTOM HALF: OUTER GLOBE (KERAK BUMI & BENUA) -->
      <g id="layer-crust-bottom" clip-path="url(#lowerGlobeClip)">
        <path d="M 30,150 A 120,120 0 0,0 270,150 A 120,38 0 0,1 30,150 Z" fill="#1d4ed8" />
        <g fill="#0284c7" opacity="0.9">
          <path d="M 124,152 Q 158,150 196,152 L 204,172 Q 212,188 214,198 L 198,212 L 188,232 L 176,258 L 144,258 L 132,236 L 122,216 L 110,195 L 114,170 Z" />
          <path d="M 44,162 Q 70,158 98,168 L 104,198 Q 110,212 105,228 L 92,252 L 78,266 L 60,256 L 60,230 L 48,198 L 42,175 Z" />
          <path d="M 190,152 L 244,154 L 246,178 L 236,204 L 210,198 L 190,178 Z" />
          <path d="M 224,180 L 268,180 L 268,228 L 242,255 L 218,236 L 222,204 Z" />
        </g>
        <path d="M 50,166 Q 72,162 92,172 L 96,196 Q 102,208 97,222 L 86,245 L 76,260 L 67,252 L 67,228 L 56,198 L 48,178 Z" fill="#16a34a" />
        <path d="M 58,172 Q 76,168 88,176 L 91,195 Q 94,206 88,215 L 78,228 L 68,220 L 62,196 Z" fill="#22c55e" />
        <path d="M 52,176 L 58,198 L 68,232 L 76,256 L 72,256 L 64,232 L 56,202 L 50,182 Z" fill="#15803d" />
        <rect x="70" y="182" width="10" height="15" fill="#4ade80" opacity="0.8" rx="2" />
        <path d="M 130,154 Q 160,152 190,154 L 196,172 Q 204,188 206,196 L 192,208 L 182,228 L 170,252 L 150,252 L 138,232 L 128,212 L 118,195 L 122,172 Z" fill="#16a34a" />
        <path d="M 132,156 Q 160,154 188,156 L 192,172 L 186,182 L 126,182 L 124,170 Z" fill="#65a30d" />
        <path d="M 122,184 L 184,184 L 188,204 L 178,220 L 148,220 L 136,204 L 120,195 Z" fill="#22c55e" />
        <path d="M 148,220 L 178,220 L 168,248 L 152,248 L 142,230 Z" fill="#15803d" />
        <polygon points="186,182 204,195 190,206" fill="#15803d" />
        <rect x="142" y="192" width="16" height="12" fill="#4ade80" opacity="0.85" rx="2" />
        <rect x="155" y="198" width="12" height="10" fill="#86efac" opacity="0.75" rx="1.5" />
        <path d="M 194,222 L 200,224 L 196,242 L 190,238 Z" fill="#22c55e" />
        <path d="M 194,158 L 210,162 L 212,180 L 202,184 L 194,175 Z" fill="#ca8a04" />
        <rect x="198" y="164" width="8" height="10" fill="#eab308" rx="1" />
        <path d="M 216,164 L 236,166 L 226,192 Z" fill="#22c55e" />
        <polygon points="218,166 232,168 226,186" fill="#16a34a" />
        <path d="M 226,184 L 234,196 L 230,198 L 224,186 Z" fill="#22c55e" />
        <rect x="232" y="198" width="14" height="4" fill="#22c55e" rx="1" />
        <rect x="236" y="182" width="10" height="10" fill="#16a34a" rx="2" />
        <rect x="248" y="186" width="5" height="8" fill="#22c55e" rx="1" />
        <rect x="254" y="192" width="12" height="6" fill="#16a34a" rx="1.5" />
        <path d="M 230,214 Q 255,208 266,218 L 264,242 Q 248,252 232,242 L 226,226 Z" fill="#16a34a" />
        <path d="M 234,218 Q 252,214 260,222 L 258,238 Q 246,244 235,236 Z" fill="#eab308" opacity="0.8" />
        <path d="M 115,264 Q 150,252 185,264 L 196,270 A 120,120 0 0,1 104,270 Z" fill="#e0f2fe" />
        <path d="M 125,260 Q 150,254 175,260 L 180,266 Q 150,260 120,266 Z" fill="#ffffff" />
        <ellipse cx="105" cy="205" rx="35" ry="18" fill="#60a5fa" opacity="0.18" />
      </g>

      <!-- Equatorial Cut Seam Line -->
      <path d="M 30,150 A 120,38 0 0,0 270,150" fill="none" stroke="#0f172a" stroke-width="1.5" opacity="0.75" />
    </svg>
  </div>
</div>

</body>
</html>
'''

# 2. BIKIN FILE HTML YANG MENYERTAKAN LABEL ANOTASI KEDALAMAN (INFOGRAFIK EDUKASI LENGKAP)
html_content_labeled = '''<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Plus+Jakarta+Sans:wght@600;800&family=JetBrains+Mono:wght@600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #030712;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .main-card {
    background: rgba(2, 6, 23, 0.98);
    border: 4px solid #78350f;
    border-radius: 24px;
    padding: 24px 28px;
    box-shadow: 0 8px 0 #231206, 0 20px 40px rgba(0,0,0,0.9);
    width: 760px;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-bottom: 16px;
    border-bottom: 2px solid rgba(120, 53, 15, 0.6);
    margin-bottom: 24px;
  }

  .header h1 {
    font-family: 'Press Start 2P', monospace;
    font-size: 15px;
    color: #fbbf24;
    letter-spacing: 0.5px;
  }

  .content-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }

  .globe-side {
    width: 320px;
    height: 320px;
    flex-shrink: 0;
  }

  .labels-side {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .layer-item {
    background: rgba(15, 23, 42, 0.85);
    border: 2px solid;
    border-radius: 14px;
    padding: 10px 14px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    position: relative;
    box-shadow: 0 4px 6px rgba(0,0,0,0.4);
  }

  .layer-item.crust {
    border-color: #38bdf8;
    background: linear-gradient(135deg, rgba(2, 132, 199, 0.15), rgba(15, 23, 42, 0.9));
  }
  .layer-item.mantle {
    border-color: #ea580c;
    background: linear-gradient(135deg, rgba(234, 88, 12, 0.15), rgba(15, 23, 42, 0.9));
  }
  .layer-item.outer-core {
    border-color: #f59e0b;
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(15, 23, 42, 0.9));
  }
  .layer-item.inner-core {
    border-color: #facc15;
    background: linear-gradient(135deg, rgba(250, 204, 21, 0.18), rgba(15, 23, 42, 0.9));
  }

  .layer-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .layer-name {
    font-family: 'Press Start 2P', monospace;
    font-size: 11px;
    font-weight: bold;
  }
  .layer-item.crust .layer-name { color: #38bdf8; }
  .layer-item.mantle .layer-name { color: #fb923c; }
  .layer-item.outer-core .layer-name { color: #fbbf24; }
  .layer-item.inner-core .layer-name { color: #fef08a; }

  .layer-depth {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 600;
    color: #f1f5f9;
    background: rgba(0,0,0,0.5);
    padding: 2px 8px;
    border-radius: 6px;
  }

  .layer-desc {
    font-size: 11px;
    color: #94a3b8;
    line-height: 1.4;
  }
</style>
</head>
<body>

<div class="main-card" id="target-labeled">
  <div class="header">
    <svg viewBox="0 0 16 16" width="20" height="20" shape-rendering="crispEdges">
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
    </svg>
    <h1>RADAR BUMI — PETA STRATA INTERNAL BUMI</h1>
  </div>

  <div class="content-row">
    <div class="globe-side">
      ''' + html_content_card.split('<div class="diagram-container">')[1].split('</div>')[0] + '''
    </div>

    <div class="labels-side">
      <div class="layer-item crust">
        <div class="layer-top">
          <span class="layer-name">1. KERAK BUMI</span>
          <span class="layer-depth">0 – 70 km</span>
        </div>
        <div class="layer-desc">Lapisan batuan padat kaku terluar (Kerak Benua SiAl &amp; Kerak Samudra SiMa). Suhu hingga 400°C.</div>
      </div>

      <div class="layer-item mantle">
        <div class="layer-top">
          <span class="layer-name">2. MANTEL BUMI</span>
          <span class="layer-depth">70 – 2.900 km</span>
        </div>
        <div class="layer-desc">Astenosfer magma semi-cair plastis (arus konveksi tektonik) &amp; mesosfer mineral padat. Suhu 1.000–3.700°C.</div>
      </div>

      <div class="layer-item outer-core">
        <div class="layer-top">
          <span class="layer-name">3. INTI LUAR</span>
          <span class="layer-depth">2.900 – 5.150 km</span>
        </div>
        <div class="layer-desc">Cairan logam besi &amp; nikel panas yang berputar membangkitkan medan magnet pelindung bumi. Suhu 4.000–5.000°C.</div>
      </div>

      <div class="layer-item inner-core">
        <div class="layer-top">
          <span class="layer-name">4. INTI DALAM</span>
          <span class="layer-depth">5.150 – 6.371 km</span>
        </div>
        <div class="layer-desc">Bola kristal besi-nikel padat pusat bumi di bawah tekanan luar biasa (&gt;3,6 juta atm). Suhu 5.400–6.000°C.</div>
      </div>
    </div>
  </div>
</div>

</body>
</html>
'''

# SIMPAN FILE HTML KE SCRATCH
html_path_card = r"c:\github\lidm buatan vincent\RESQ-BOX\scratch\radar_bumi_card.html"
html_path_labeled = r"c:\github\lidm buatan vincent\RESQ-BOX\scratch\radar_bumi_labeled.html"

with open(html_path_card, 'w', encoding='utf-8') as f:
    f.write(html_content_card)

with open(html_path_labeled, 'w', encoding='utf-8') as f:
    f.write(html_content_labeled)

print("HTML files written successfully.")

# JALANKAN SELENIUM EDGE HEADLESS
options = Options()
options.add_argument('--headless=new')
options.add_argument('--disable-gpu')
options.add_argument('--force-device-scale-factor=2') # Retina 2x high-DPI crisp pixel

driver = webdriver.Edge(options=options)
driver.set_window_size(1200, 1000)

try:
    # 1. SCREENSHOT KARTU WIDGET RADAR BUMI
    driver.get(f"file:///{html_path_card.replace(os.sep, '/')}")
    time.sleep(1.0)
    card_elem = driver.find_element(By.ID, "target-widget")
    
    out_card_1 = r"c:\github\lidm buatan vincent\radar_bumi.png"
    out_card_2 = r"c:\github\lidm buatan vincent\RESQ-BOX\public\radar_bumi.png"
    card_elem.screenshot(out_card_1)
    card_elem.screenshot(out_card_2)
    print(f"Captured: {out_card_1}")

    # 2. SCREENSHOT INFOGRAFIK RADAR BUMI DENGAN LABEL LENGKAP
    driver.get(f"file:///{html_path_labeled.replace(os.sep, '/')}")
    time.sleep(1.0)
    labeled_elem = driver.find_element(By.ID, "target-labeled")

    out_lab_1 = r"c:\github\lidm buatan vincent\radar_bumi_lengkap_label.png"
    out_lab_2 = r"c:\github\lidm buatan vincent\RESQ-BOX\public\radar_bumi_lengkap_label.png"
    labeled_elem.screenshot(out_lab_1)
    labeled_elem.screenshot(out_lab_2)
    print(f"Captured: {out_lab_1}")

finally:
    driver.quit()

print("Selenium screenshot pipeline complete!")
