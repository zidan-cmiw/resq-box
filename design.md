# 🎨 Design System — RESQ-BOX v3.0 Pixel Quest Edition

Dokumen ini mendefinisikan seluruh panduan visual, tipografi, warna, komponen UI, dan prinsip desain untuk transformasi RESQ-BOX ke estetika **Pixel Art 2D Game**.

---

## 1. Filosofi Desain

### 1.1 Prinsip Utama

| Prinsip | Deskripsi |
|---|---|
| **Fun First** | Setiap elemen harus terasa seperti bermain game, bukan mengerjakan tugas sekolah |
| **Pixel Consistency** | Semua elemen visual mengikuti grid pixel yang konsisten — tidak ada elemen "setengah pixel" |
| **Readable Content** | Meski bergaya pixel, konten materi harus tetap mudah dibaca oleh anak usia 13-14 tahun |
| **Progressive Disclosure** | Informasi disajikan bertahap — tidak membanjiri siswa dengan terlalu banyak opsi sekaligus |
| **Feedback Instant** | Setiap interaksi harus memberikan feedback visual/audio yang jelas dan memuaskan |

### 1.2 Mood & Referensi

Nuansa keseluruhan terinspirasi dari:
- **Game pixel RPG 2D** — Stardew Valley, Undertale, Celeste
- **Retro UI** — Menu game NES/SNES era, dialog box RPG
- **Modern pixel art** — Kombinasi piksel dengan gradien dan efek modern
- **Edu-game** — Interaktif namun tetap informatif

---

## 2. Tipografi

### 2.1 Font System

```css
/* 1. Primary Pixel Font (Judul, Level Title, Tombol Aksi, Badge) */
font-family: 'Press Start 2P', cursive, monospace;

/* 2. Secondary Pixel Font (Teks Paragraf, Form Biodata, Dialog, Label) */
font-family: 'Pixelify Sans', system-ui, sans-serif;

/* 3. Status & Data Monospace (Level counter, PIN, Koordinat) */
font-family: 'JetBrains Mono', 'Fira Code', monospace;
```

**Karakteristik & Penggunaan**:
- `'Press Start 2P'`: Memberikan kesan arcade 8-bit klasik yang tegas untuk judul adegan, tombol kayu utama, dan indikator status penting.
- `'Pixelify Sans'`: Memberikan estetika pixel modern yang sangat mudah dibaca (*high readability*) untuk form biodata siswa, instruksi misi, dan teks materi sains SMP.
- `'JetBrains Mono'`: Untuk angka teknis, PIN 4-digit, dan status kesiapsiagaan.

**Penggunaan**:
- Paragraf materi (Struktur Bumi, Lempeng Tektonik, Gempa, dll.)
- Deskripsi misi & instruksi
- Teks penjelasan panjang
- Tooltip & help text

#### Mono: Code Font

```css
/* Code — untuk preview kode Arduino */
font-family: 'JetBrains Mono', 'Fira Code', monospace;
```

### 2.2 Type Scale

| Token | Font | Size | Weight | Penggunaan |
|---|---|---|---|---|
| `pixel-display` | PixelFont | 48px | 700 | Judul besar (Hero, Level Complete) |
| `pixel-headline` | PixelFont | 32px | 700 | Judul halaman |
| `pixel-title` | PixelFont | 24px | 700 | Sub-judul, nama level |
| `pixel-label-lg` | PixelFont | 18px | 700 | Label navigasi, nama fitur |
| `pixel-label` | PixelFont | 14px | 700 | Tombol, badge, status |
| `pixel-label-sm` | PixelFont | 11px | 700 | Caption, small badge |
| `body-lg` | Inter | 18px | 400 | Materi utama (paragraf) |
| `body-base` | Inter | 16px | 400 | Body text standar |
| `body-sm` | Inter | 14px | 400 | Deskripsi, secondary text |
| `code` | JetBrains Mono | 14px | 400 | Preview kode Arduino |

### 2.3 Aturan Penggunaan Font

> **PENTING**: Pixel font HANYA untuk elemen pendek (heading, label, tombol).
> Body text / materi panjang WAJIB menggunakan Inter agar tetap readable.

```
✅ Pixel Font: "Level 1: Earth Explorer"
✅ Pixel Font: "MULAI MISI"  
✅ Pixel Font: "🏆 SELESAI!"
✅ Pixel Font: "Skenario 3"

❌ Pixel Font untuk paragraf materi panjang
❌ Pixel Font untuk instruksi multi-baris
❌ Pixel Font dengan ukuran < 11px (akan blur)
```

---

## 3. Color Palette

### 3.1 Core Palette — Pixel Game Theme

```css
:root {
  /* ── Primary: Pixel Indigo ── */
  --pixel-primary: #6366F1;          /* Tombol utama, aksen */
  --pixel-primary-light: #818CF8;    /* Hover state */
  --pixel-primary-dark: #4338CA;     /* Active / pressed */
  --pixel-primary-glow: rgba(99, 102, 241, 0.4);

  /* ── Secondary: Rescue Orange ── */
  --pixel-secondary: #F97316;        /* Aksi sekunder, warning */
  --pixel-secondary-light: #FB923C;
  --pixel-secondary-dark: #EA580C;

  /* ── Game Accent Colors ── */
  --pixel-emerald: #34D399;          /* Success, selamat, completed */
  --pixel-red: #F87171;              /* Danger, bahaya, error */
  --pixel-amber: #FBBF24;           /* Warning, quest, XP */
  --pixel-cyan: #22D3EE;            /* Info, Level 1 accent */
  --pixel-purple: #A78BFA;          /* Special, rare, achievement */

  /* ── Surface (Dark Mode Default) ── */
  --pixel-bg-darkest: #0A0E1A;      /* Background terdalam */
  --pixel-bg-dark: #111827;          /* Background utama */
  --pixel-bg-mid: #1E293B;          /* Panel / card background */
  --pixel-bg-light: #273549;         /* Elevated surfaces */
  --pixel-bg-lighter: #334155;       /* Input fields, hover */

  /* ── Text ── */
  --pixel-text-primary: #F1F5F9;    /* Teks utama */
  --pixel-text-secondary: #94A3B8;  /* Teks sekunder */
  --pixel-text-muted: #475569;      /* Teks disabled / muted */

  /* ── Border & Outline ── */
  --pixel-border: #334155;          /* Border default */
  --pixel-border-glow: rgba(99, 102, 241, 0.3); /* Glow border */
}
```

### 3.2 Level-Specific Colors

```css
/* Level 1: Earth Explorer — Cool Blue/Cyan */
--level1-primary: #22D3EE;
--level1-gradient: linear-gradient(135deg, #0E7490, #22D3EE);
--level1-bg: rgba(14, 116, 144, 0.15);

/* Level 2: Disaster Analyst — Warm Emerald/Green */
--level2-primary: #34D399;
--level2-gradient: linear-gradient(135deg, #059669, #34D399);
--level2-bg: rgba(5, 150, 105, 0.15);

/* Level 3: Simulation Game — Hot Orange/Amber */
--level3-primary: #F97316;
--level3-gradient: linear-gradient(135deg, #EA580C, #FBBF24);
--level3-bg: rgba(234, 88, 12, 0.15);
```

### 3.3 Semantic Colors

| Semantic | Color | Hex | Penggunaan |
|---|---|---|---|
| 🟢 Success | Emerald | `#34D399` | NPC selamat, level complete, jawaban benar |
| 🔴 Danger | Red | `#F87171` | LED bahaya, gempa aktif, jawaban salah |
| 🟡 Warning | Amber | `#FBBF24` | Status waspada, hint, XP/skor |
| 🔵 Info | Cyan | `#22D3EE` | Informasi, tip, tutorial |
| 🟣 Special | Purple | `#A78BFA` | Achievement, rare badge, bonus |

---

## 4. Pixel Art UI Components

### 4.1 Pixel Border System

Semua container menggunakan **pixel border** — border tebal bergaya 8-bit:

```css
/* ── Pixel Card — Container utama ── */
.pixel-card {
  background: var(--pixel-bg-mid);
  border: 3px solid var(--pixel-border);
  border-radius: 0;                    /* Sudut tajam = pixel feel */
  box-shadow: 
    4px 4px 0px var(--pixel-bg-darkest),   /* Drop shadow pixel style */
    inset 1px 1px 0px rgba(255,255,255,0.05);
  image-rendering: pixelated;
}

/* ── Pixel Card Active/Hover ── */
.pixel-card:hover {
  border-color: var(--pixel-primary);
  box-shadow: 
    4px 4px 0px var(--pixel-primary-dark),
    0 0 20px var(--pixel-primary-glow);
  transform: translate(-2px, -2px);
}

/* ── Pixel Card Pressed ── */
.pixel-card:active {
  transform: translate(2px, 2px);
  box-shadow: 
    1px 1px 0px var(--pixel-bg-darkest);
}
```

### 4.2 Pixel Button

```css
/* ── Pixel Button — Tombol utama bergaya game ── */
.pixel-btn {
  font-family: 'PixelFont', 'Press Start 2P', monospace;
  font-size: 14px;
  padding: 12px 24px;
  border: 3px solid;
  border-radius: 0;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  transition: transform 0.1s, box-shadow 0.1s;
  
  /* 3D Push effect */
  border-bottom-width: 6px;
}

.pixel-btn:active {
  border-bottom-width: 3px;
  transform: translateY(3px);
}

/* Variants */
.pixel-btn-primary {
  background: var(--pixel-primary);
  border-color: var(--pixel-primary-dark);
  color: white;
}

.pixel-btn-danger {
  background: var(--pixel-red);
  border-color: #DC2626;
  color: white;
}

.pixel-btn-success {
  background: var(--pixel-emerald);
  border-color: #059669;
  color: #0A0E1A;
}
```

### 4.3 Pixel Dialog / Modal

```css
/* ── Pixel Dialog — Pop-up bergaya RPG ── */
.pixel-dialog {
  background: var(--pixel-bg-dark);
  border: 4px solid var(--pixel-text-primary);
  box-shadow: 
    8px 8px 0px rgba(0,0,0,0.5),
    inset 2px 2px 0px rgba(255,255,255,0.1);
  padding: 24px;
  position: relative;
}

/* Pixel Dialog Header — bergaya title bar NES */
.pixel-dialog-header {
  font-family: 'PixelFont';
  font-size: 18px;
  padding: 8px 16px;
  margin: -24px -24px 16px -24px;
  background: var(--pixel-primary);
  border-bottom: 4px solid var(--pixel-primary-dark);
  color: white;
}
```

### 4.4 Pixel Progress Bar

```css
/* ── Pixel Progress Bar — bergaya HP/XP bar ── */
.pixel-progress {
  height: 20px;
  background: var(--pixel-bg-darkest);
  border: 3px solid var(--pixel-border);
  position: relative;
  overflow: hidden;
}

.pixel-progress-fill {
  height: 100%;
  background: linear-gradient(
    180deg, 
    var(--pixel-emerald) 0%, 
    #059669 50%, 
    var(--pixel-emerald) 100%
  );
  transition: width 0.5s ease;
  /* Scanline effect */
  background-size: 100% 4px;
}

/* Pixel text overlay */
.pixel-progress-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'PixelFont';
  font-size: 11px;
  color: white;
  text-shadow: 1px 1px 0 rgba(0,0,0,0.8);
}
```

### 4.5 Pixel Badge / Chip

```css
.pixel-badge {
  font-family: 'PixelFont';
  font-size: 10px;
  padding: 4px 8px;
  border: 2px solid;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.pixel-badge-locked {
  background: var(--pixel-bg-darker);
  border-color: var(--pixel-text-muted);
  color: var(--pixel-text-muted);
}

.pixel-badge-active {
  background: var(--pixel-primary);
  border-color: var(--pixel-primary-dark);
  color: white;
  animation: pixel-blink 1s step-start infinite;
}

.pixel-badge-complete {
  background: var(--pixel-emerald);
  border-color: #059669;
  color: #0A0E1A;
}
```

---

## 5. Layout System

### 5.1 Sidebar (Pixel Game Menu)

```
┌──────────────────────┐
│  🎮  RESQ-BOX        │  ← Logo pixel font
│  ═══════════════════  │
│                       │
│  ▶ Dashboard          │  ← Pixel arrow indicator
│                       │
│  ── MODUL ──────────  │
│  🌍 1. Earth Explorer │
│  🌋 2. Disaster Analyst│
│  🎮 3. Simulation Game│  ← Lock icon jika terkunci
│                       │
│  ═══════════════════  │
│  ⭐ Credits           │
│  🌙 Dark / Light      │
│  « Collapse           │
│                       │
│  ┌─────────────────┐  │
│  │ ⚡ OFFLINE READY │  │  ← Status badge pixel style
│  └─────────────────┘  │
└──────────────────────┘
```

### 5.2 Dashboard Layout

```
┌────────────────────────────────────────────────┐
│                                                │
│  ╔════════════════════════════════════════════╗ │
│  ║  👋 Halo, [Nama]!                         ║ │  ← Hero Banner pixel
│  ║  Selamat datang di RESQ-BOX               ║ │     gradient bg
│  ║                                            ║ │
│  ║  ┌── Progress ──────────────────────────┐  ║ │
│  ║  │ ████████████░░░░░░░░░░░░  45%        │  ║ │  ← XP-style bar
│  ║  └─────────────────────────────────────┘  ║ │
│  ╚════════════════════════════════════════════╝ │
│                                                │
│  🎓 MULAI BELAJAR                              │
│                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ 🌍       │  │ 🌋       │  │ 🎮       │     │  ← 3 Kartu Level
│  │ Level 1  │  │ Level 2  │  │ Level 3  │     │     Pixel card style
│  │ Earth    │  │ Disaster │  │ Simulasi │     │
│  │ Explorer │  │ Analyst  │  │ Game     │     │
│  │          │  │  🔒      │  │  🔒      │     │
│  └──────────┘  └──────────┘  └──────────┘     │
│                                                │
└────────────────────────────────────────────────┘
```

### 5.3 Materi Page Layout (Level 1 & 2)

```
┌────────────────────────────────────────────────┐
│  Level 1: Earth Explorer        ● ● ○          │  ← Dot indicator
│  Pelajari dasar materi...                      │
│                                                │
│  ╔════════════════════════════════════════════╗ │
│  ║  Bab 1 dari 3                              ║ │  ← Chapter header
│  ║  📖 Struktur Bumi                          ║ │
│  ╠════════════════════════════════════════════╣ │
│  ║                                            ║ │
│  ║  [Konten Materi Interaktif]                ║ │  ← Pixel art
│  ║                                            ║ │     illustrations
│  ║  Bumi terdiri dari beberapa lapisan...     ║ │  ← Body text (Inter)
│  ║                                            ║ │
│  ║  ┌─────────────────────────┐               ║ │
│  ║  │  [Pixel Art Diagram]    │               ║ │  ← Interactive
│  ║  │   Kerak ██████          │               ║ │     pixel diagram
│  ║  │   Mantel ████████████   │               ║ │
│  ║  │   Inti Luar ████████    │               ║ │
│  ║  │   Inti Dalam ████       │               ║ │
│  ║  └─────────────────────────┘               ║ │
│  ║                                            ║ │
│  ╠════════════════════════════════════════════╣ │
│  ║  ◄ Sebelumnya    1/3    Selanjutnya ►      ║ │  ← Pixel nav buttons
│  ╚════════════════════════════════════════════╝ │
└────────────────────────────────────────────────┘
```

---

## 6. Animasi & Transisi

### 6.1 Pixel-Specific Animations

```css
/* ── Pixel Blink — kedip ala game retro ── */
@keyframes pixel-blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}

/* ── Pixel Bounce — lompat kecil ── */
@keyframes pixel-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

/* ── Pixel Shake — getaran gempa ── */
@keyframes pixel-shake {
  0%   { transform: translate(0, 0); }
  25%  { transform: translate(-3px, 0); }
  50%  { transform: translate(3px, -2px); }
  75%  { transform: translate(-2px, 2px); }
  100% { transform: translate(0, 0); }
}

/* ── Pixel Slide In — masuk dari samping ── */
@keyframes pixel-slide-in {
  from { 
    transform: translateX(-16px); 
    opacity: 0;
  }
  to { 
    transform: translateX(0); 
    opacity: 1;
  }
}

/* ── Pixel Typewriter — teks muncul per karakter ── */
@keyframes pixel-typewriter {
  from { width: 0; }
  to { width: 100%; }
}

/* ── Pixel Dissolve — transisi halaman ── */
@keyframes pixel-dissolve {
  0%   { clip-path: inset(0 100% 0 0); }
  100% { clip-path: inset(0 0 0 0); }
}
```

### 6.2 Timing & Easing

| Interaksi | Durasi | Easing |
|---|---|---|
| Button press | 100ms | `steps(1)` |
| Page transition | 400ms | `steps(8)` atau `ease-out` |
| Card hover | 200ms | `steps(3)` |
| Progress bar fill | 600ms | `ease-out` |
| Dialog open | 300ms | `steps(5)` |
| NPC movement | 16ms/frame | Linear (game loop) |

> **Catatan**: Gunakan `steps(N)` easing untuk animasi yang terasa "pixel" — gerakan patah-patah khas game retro. Untuk animasi yang membutuhkan smoothness (progress bar, scroll), gunakan standard easing.

### 6.3 Transisi Halaman

| Transisi | Efek |
|---|---|
| Dashboard → Level | Pixel slide dari kanan |
| Antar halaman materi | Pixel dissolve (wipe horizontal) |
| Buka dialog / modal | Scale up dengan `steps(4)` |
| Level unlock | Flash putih + particle burst |
| Quest complete | Confetti pixel + XP counter animation |

---

## 7. Gamifikasi Visual — Evacuation Game

### 7.1 Rendering Style

| Aspek | Saat Ini | Target v3.0 |
|---|---|---|
| **Perspektif** | Isometrik pseudo-3D | **Top-down 2D** (pixel RPG style) |
| **Map Rendering** | Canvas draw primitives | **Tilemap system** (16x16 atau 32x32 tiles) |
| **NPC** | Colored circles | **Pixel sprite characters** (8-frame walk cycle) |
| **Buildings** | Canvas rectangles | **Pixel art building sprites** |
| **Effects** | Shake + color overlay | **Pixel particle effects** |

### 7.2 Tilemap Specification

```
Tile Size: 32x32 pixels
Map Grid: 20x15 tiles (640x480 logical resolution)
Scale: 2x render (1280x960 actual)

Tile Types:
  ██ = Bangunan (rumah, sekolah, masjid)
  ░░ = Jalan / jalur evakuasi  
  ▓▓ = Rumput / tanah
  ~~ = Sungai / air
  ▲▲ = Gunung / lereng
  🚪 = Gerbang evakuasi (interaktif)
  ⭐ = Titik kumpul / safe zone
  🔴 = LED bahaya indicator
  🟢 = LED aman indicator
```

### 7.3 NPC Sprite Sheet

```
Sprite Size: 16x24 pixels (lebar x tinggi)
Animation Frames: 4 per direction (down, up, left, right)
States:
  - Idle: 2 frame berdiri diam
  - Walk: 4 frame berjalan per arah
  - Panic: 4 frame berlari (speed 2x)
  - Safe: 1 frame + sparkle overlay
  - Blocked: 1 frame + ! bubble
  
Colors per State:
  - Normal: skin tone variants
  - Panic: red tint overlay
  - Evacuating: blue tint
  - Safe: green glow
  - Blocked: red outline blink
```

### 7.4 Performa Optimization Plan

| Masalah | Solusi |
|---|---|
| Lag pada rendering | Offscreen canvas untuk static tiles (cache) |
| NPC update terlalu sering | Update setiap 3-4 frame, interpolasi visual |
| Zustand re-render | `useRef` untuk game state, subscribe manual |
| Draw call berlebihan | Batch rendering per layer (ground → buildings → NPCs → UI) |
| Memory leak | Object pooling untuk NPC dan particle |

---

## 8. Iconography & Kebijakan Nol Emoji OS (Zero OS Emoji Standard)

### 8.1 Kebijakan Ketat: Eliminasi Total Emoji OS & Wajib 2D Pixel Art
> **ATURAN WAJIB**: Dilarang keras menggunakan emoji bawaan sistem operasi (Unicode Emojis seperti 🗑️, 🖨️, ⚠️, 🚨, 💥, 👤, 🛰️, 🎒, dll.) pada seluruh antarmuka web RESQ-BOX.

**Alasan & Rasional Desain**:
1. **Inkonsistensi Visual**: Emoji bawaan sistem operasi (Apple AppleColorEmoji, Microsoft Segoe UI Emoji, Google Noto Color Emoji) memiliki gaya 3D glossy, gradien halus, dan outline melengkung yang sangat kontras dan merusak tema visual **Retro 16-Bit Pixel Art 2D RPG**.
2. **Fragmentasi Antar Perangkat**: Emoji OS tampil berbeda di layar Windows (lab komputer sekolah), macOS, iOS, dan Chromebook.
3. **Standar Estetika Pixel Murni**: Semua emotikon, simbol status, aksi tombol, dan indikator navigasi **WAJIB** menggunakan grafis pixel art 2D presisi berbasis SVG dengan atribut `shapeRendering="crispEdges"`.

### 8.2 Komponen Terpusat: `PixelIcon.tsx`
Seluruh ikon dan emotikon pada web diimplementasikan melalui komponen `<PixelIcon name="..." size={...} />`.

| Kategori Ikon | Daftar Ikon 2D Pixel Art | Konteks Penggunaan |
|---|---|---|
| **Eksplorasi & Inventori** | `backpack`, `clipboard`, `key`, `id-card`, `user`/`person`, `trash`, `printer`, `search`, `cursor` | Navigasi login, profil siswa, posko guru, cetak rapor, hapus kelas/data |
| **Geologi & Bencana** | `volcano`, `earthquake`, `ocean`/`water`/`wave`, `mountain`, `convergent`, `divergent`, `transform`, `smoke`/`ash` | Diagram lapisan bumi, lempeng tektonik, mitigasi erupsi, simulasi tsunami |
| **Peringatan & Status** | `warning`, `alert`, `explosion`, `lightning`, `thermometer`, `shield`, `bell`, `speaker`/`sound-on`/`sound-off` | Indikator bahaya, gempa terdeteksi, buzzer sirine, modal konfirmasi |
| **Gamifikasi & Interaksi** | `trophy`, `dice`, `star`/`sparkle`, `celebration`, `chest-closed`, `chest-open`, `check`, `cross`, `lock`, `unlock`, `play`, `pause`, `refresh` | Rapor nilai, achievement XP, peti reward materi, tombol dialog RPG |

---

## 9. Sound Design (Optional — Enhancement)

### 9.1 8-bit SFX Library

| Event | Sound Type | Durasi |
|---|---|---|
| Button click | Short blip | 50ms |
| Level unlock | Fanfare melody | 1.5s |
| Quest complete | Victory jingle | 2s |
| Wrong answer | Error buzz | 200ms |
| Correct answer | Coin collect | 150ms |
| Page turn | Soft whoosh | 200ms |
| Emergency alert | Alarm loop | Looping |
| NPC safe | Sparkle ding | 300ms |
| Earthquake | Rumble + shake | Looping |

### 9.2 Implementation

```typescript
// Web Audio API — lightweight 8-bit SFX generator
class PixelSFX {
  private ctx: AudioContext;
  
  playBlip() { /* Short square wave beep */ }
  playFanfare() { /* Ascending arpeggio */ }
  playError() { /* Descending buzz */ }
  playCoin() { /* Classic coin collect */ }
}
```

> **Catatan**: Sound adalah fitur enhancement (P2). Implementasi setelah visual redesign selesai. Semua sound harus bisa di-mute oleh user.

---

## 10. Responsive Breakpoints

| Breakpoint | Target | Layout |
|---|---|---|
| `≥ 1280px` | Desktop (primary) | Sidebar + full content area |
| `≥ 1024px` | Laptop | Sidebar collapsible + content |
| `≥ 768px` | Tablet | Sidebar collapsed default + content |
| `< 768px` | Mobile | Bottom nav + stacked content |

> **Catatan**: Target utama adalah **desktop** (lab komputer sekolah). Tablet sebagai secondary. Mobile sebagai bonus.

---

## 11. Dark Mode & Light Mode

### Default: Dark Mode
Dark mode adalah default karena:
1. Lebih nyaman untuk pixel art (warna lebih vibrant di background gelap)
2. Mengurangi eye strain saat sesi panjang di lab
3. Estetika game pixel umumnya dark-themed

### Light Mode (Alternatif)
Tetap disediakan untuk preferensi guru atau kondisi ruang terang:

```css
/* Light mode overrides */
.light {
  --pixel-bg-darkest: #E2E8F0;
  --pixel-bg-dark: #F1F5F9;
  --pixel-bg-mid: #FFFFFF;
  --pixel-bg-light: #F8FAFC;
  --pixel-text-primary: #0F172A;
  --pixel-text-secondary: #475569;
  --pixel-border: #CBD5E1;
}
```

---

## 12. Asset Production Pipeline

### 12.1 Alur Pembuatan Aset Pixel Art

```
1. Concept Sketch (Figma / kertas)
     ↓
2. AI Generation (referensi / base)
     ↓
3. Pixel Art Refinement (Aseprite / Piskel / Photoshop)
     ↓
4. Sprite Sheet Assembly (grid layout konsisten)
     ↓
5. Export → PNG (untuk sprite) / SVG (untuk icon scalable)
     ↓
6. Integration → React component / CSS background
```

### 12.2 Tools yang Direkomendasikan

| Tool | Fungsi |
|---|---|
| **Aseprite** | Pixel art editor utama (animasi, sprite sheet) |
| **Piskel** | Pixel art editor gratis (web-based) |
| **Tiled** | Tilemap editor untuk Evacuation Game map |
| **Figma** | Layout & wireframe (non-pixel elements) |
| **AI Image Gen** | Base reference → kemudian di-pixel-kan manual |

---

## 13. Implementasi Bertahap

### Phase 1: Foundation (Minggu 1-2)
- [ ] Install & setup pixel fonts (BoldPixels + Press Start 2P fallback)
- [ ] Update CSS design tokens (color palette, typography scale)
- [ ] Buat pixel-card, pixel-btn, pixel-badge base components
- [ ] Update Sidebar ke pixel game menu style
- [ ] Update Dashboard hero banner & level cards

### Phase 2: Content Pages (Minggu 3-4)
- [ ] Redesain Level 1 materi pages (pixel art illustrations)
- [ ] Redesain Level 2 materi pages
- [ ] Update Wordle game ke pixel aesthetic
- [ ] Update PuzzleBoard (drag-drop) ke pixel style
- [ ] Update dialog/modal components

### Phase 3: Game & Gamification (Minggu 5-6)
- [ ] Redesain Evacuation Game ke top-down pixel RPG
- [ ] Buat tilemap system + tile sprites
- [ ] Buat NPC pixel sprites + walk cycle animation
- [ ] Optimasi rendering performance
- [ ] Update HUD overlay ke pixel art style

### Phase 4: Polish & Game Shell Finalization
- [x] Implementasi 2D Pixel Volcano Scene Title Screen dengan animasi SVG
- [x] Implementasi 3D Wooden Plank Buttons & Parchment Notice Board
- [x] Implementasi Nighttime Starry Camp Profile Page (`/profile`)
- [x] Implementasi Sunset Golden Mountain Credits Page (`/credits`)
- [x] Implementasi Web Audio 8-Bit Chiptune SFX synthesizer (`retroAudio.ts`)
- [x] Implementasi Fullscreen Toggle native (`fullscreen.ts`)
- [x] Penghapusan bilah header atas (Zero-Header Viewport standard)

---

## 14. Standar Desain Layar Penuh & Komponen Khusus (v3.0)

### 14.1 Zero-Header Viewport Standard
- **Prinsip**: Tidak ada elemen `<header>` atau navbar atas bawaan pada seluruh aplikasi.
- **Rasional**: Memaksimalkan area tampilan proyektor/layar laptop agar siswa dan juri merasakan pengalaman imersif game 2D seutuhnya.
- **Navigasi**: Seluruh perpindahan halaman menggunakan tombol kayu retro dalam adegan (*in-scene retro buttons*).

### 14.2 Spesifikasi 3 Adegan Lingkungan Pixel Art SVG
1. **Daytime Volcano Scene (Beranda)**:
   - Gradien langit siang (`#1e3a8a` ke `#fde047`)
   - Matahari pixel berdenyut (`animate-pulse`)
   - Gunung api utama dengan lahar merah-kuning berdenyut (`#ef4444` & `#fde047`)
   - Partikel asap kawah mengepul bertahap (`anim-pixel-smoke-1`, `2`, `3`)
   - Awan pixel melayang perlahan (`anim-pixel-cloud`)
2. **Nighttime Starry Rescue Camp (Profil Siswa)**:
   - Gradien langit malam gelap (`#050814` ke `#3d2c52`)
   - Bintang kelap-kelip animasi pixel (`anim-pixel-star-1`, `2`, `3`)
   - Bulan pixel dengan kawah berbayang
   - Siluet perbukitan malam dan pohon pinus gelap
3. **Sunset Golden Mountain Scene (Credits & Tim)**:
   - Gradien langit senja keemasan (`#310f1b` ke `#fef08a`)
   - Siluet pegunungan senja (`#2e1005`)
   - Partikel kunang-kunang bara api berpendar (`#fde047`)

### 14.3 Komponen Papan Kayu Retro & Tombol 3D
- **`.pixel-wood-board`**:
  - Latar belakang perkamen krem keemasan (`#fef3c7`)
  - Border kayu tebal 4px (`#451a03`) dengan bayangan luar 6px (`#231206`)
  - Titik paku sudut besi (`::before` / `::after`)
- **`.pixel-btn-wood-plank`**:
  - Gradien kayu oak alami (`#b45309` ke `#78350f`)
  - Bevel highlight atas 3px (`#d97706`) dan bayangan tekan 5px (`#451a03`)
  - Animasi tactile saat ditekan (`active:translate-y-1`)
  - Tipografi `'Press Start 2P'` warna teks kayu pekat (`#3e1f07`)

### 14.4 Web Audio API Synthesizer (`retroAudio.ts`)
- Murni menggunakan `AudioContext` browser tanpa membebani ukuran berkas dengan MP3/WAV eksternal.
- Menyediakan suara:
  - `playSelect()`: Gelombang *square* nada C5 ke G5 (80ms)
  - `playHover()`: Gelombang *sine* nada halus A5 (30ms)
  - `playUnlock()`: Nada melodi arpeggio C5-E5-G5-C6 (200ms)
  - `playSuccess()`: Akor mayor ceria
  - `playError()`: Gelombang *sawtooth* nada rendah (150ms)

### 14.5 Tropical Misty Cloud Forest Backdrop (`/login`)
- **Pemandangan Hutan Tropis Berkabut 2D Pixel**:
  - Kanopi hijau zamrud lebat dengan pohon pakis raksasa (*Cyathea*) dan pohon palem tropis di sisi kiri-kanan.
  - Lapisan kabut lembah tengah (*drifting valley fog*) dengan animasi mengalir perlahan (`anim-mist-drift-1`, `2`).
  - Berkas sinar matahari pagi (*god-rays shimmer*) menembus celah pepohonan.
  - Spora embun mikroskopis melayang ke atas di udara berkabut.

### 14.6 Sistem Ikon 2D Pixel Art Murni (`PixelIcon.tsx`)
- **Prinsip**: Eliminasi total emoji bawaan OS untuk menjaga keseragaman grafis pixel 2D di segala platform.
- **Karakteristik Teknis**: SVG berbasis grid 16x16 dengan atribut `shapeRendering="crispEdges"` untuk memastikan sudut piksel selalu tajam (*crisp*), tanpa blur anti-aliasing.
- **Daftar Ikon SVG Crisp Pixel yang Tersedia**:
  - `backpack`: Tas petualang siswa bergaris tebal.
  - `clipboard`: Papan berkas administrasi dan data guru.
  - `compass`: Kompas navigasi petualangan berputar.
  - `lock` & `unlock`: Kunci gembok keamanan akun.
  - `user` / `person`: Identitas siswa dan lencana posko.
  - `trash`: Tempat sampah 2D pixel merah untuk aksi hapus kelas / murid.
  - `printer`: Mesin pencetak rapor / berkas penilaian individual.
  - `explosion`: Ledakan pixel arcade untuk konfirmasi aksi bahaya.
  - `satellite`: Satelit transmisi radar pemindai mitigasi.
  - `search` & `cursor`: Kaca pembesar inspeksi materi dan kursor RPG.
  - `chest-closed` & `chest-open`: Peti harta karun materi sains.
  - `convergent`, `divergent`, `transform`: Diagram arah tumbukan lempeng tektonik.
  - `ocean`, `mountain`, `volcano`, `earthquake`: Bentang alam geologi.
  - `ruler`: Penggaris ukur skala geologi.
  - `warning` & `alert`: Segitiga peringatan bahaya retro.

### 14.7 Stratovolcano & Sea of Clouds Backdrop (Posko Guru `/teacher`)
- **Pemandangan Puncak Gunung Api di Atas Samudra Awan 2D Pixel**:
  - Puncak stratovolcano megah (karakteristik Gunung Merapi) dengan dinding kawah abu-abu berbatu gelap, retakan punggung bukit terjal, dan kepulan asap vulkanik putih beranimasi perlahan ke arah kanan (`anim-merapi-smoke-1`, `2`, `3`).
  - Lereng bawah dihiasi punggungan hijau zamrud dan lumut hutan pegunungan yang menukik ke dalam lapisan awan.
  - Hamparan luas **Samudra Awan (Sea of Clouds / Cloud Inversion)** bertekstur empuk (*billowing*) dengan tepian berpendar keemasan diterpa sinar fajar/pagi (`anim-cloud-sea-billow-1`, `2`).
  - Langit biru kristal di bagian atas dengan sapuan awan sirus (*cirrus streaks*) horizontal bergeser halus (`anim-cirrus-drift-slow`, `mid`).

---

## 15. Rekam Jejak Keputusan Desain Sesi (Design Session Log)

| Permintaan / Masukan Pengguna | Keputusan & Solusi Desain | Status |
|---|---|---|
| Menghapus klaim pemrograman teknis & hardware | Logika drag-and-drop & hardware diposisikan murni sebagai alat bantu manipulatif IPA | ✅ Diterapkan |
| Ingin tampilan web full game pixel 2D tanpa sidebar | Menghapus sidebar, membuat Title Screen pemandangan gunung api 2D SVG retro | ✅ Diterapkan |
| Ganti tombol fungsi dengan Fullscreen | Mengintegrasikan tombol Layar Penuh (⛶) native untuk proyektor kelas | ✅ Diterapkan |
| Halaman Profil Siswa dengan style pixel | Dibuat dengan tema Nighttime Starry Rescue Camp & form papan kayu | ✅ Diterapkan |
| Update Tim di Credits (Ichsan Abror, Zidane, Zahra, Lintang, Ibu Rizki) | Formasi resmi diterapkan di halaman Credits dengan tema Sunset Mountain | ✅ Diterapkan |
| Hapus seluruh header atas di Profile, Settings, dan semua halaman | Menghapus topbar di `AppLayout.tsx`, seluruh halaman menjadi full-screen game viewport | ✅ Diterapkan |
| Hapus akun-akun demo, buat kredensial resmi Guru | Akun demo dihapus otomatis, kredensial guru resmi distandarisasi ke `guru` / `guru123` | ✅ Diterapkan |
| Tambah fitur Ganti Password Siswa | Formulir ganti password mandiri ditambahkan di modal Profil Siswa | ✅ Diterapkan |
| Buat background Login pixel 2D bergerak sesuai foto referensi | Dibuat latar belakang Hutan Hujan Tropis Berkabut (*Tropical Misty Cloud Forest*) lengkap dengan kabut lembah, sinar matahari (*god-rays*), dan partikel embun | ✅ Diterapkan |
| Ganti semua emotikon di Login dengan style pixel 2D | Mengembangkan komponen `PixelIcon` SVG 2D pixel murni, menggantikan semua emoji OS | ✅ Diterapkan |
| Hapus efek overlay daun melayang di Login | Efek daun dihapus dari background login agar pemandangan hutan bersih dan fokus | ✅ Diterapkan |
| Hapus animasi loading agar navigasi cepat | Animasi loading dilepas; transisi rute dan login langsung berpindah secara responsif (*zero-delay*) | ✅ Diterapkan |
| Ganti background Posko Guru sesuai gambar referensi (Gunung di atas lautan awan) | Dibuat latar belakang 2D Pixel Art Gunung Merapi di atas Samudra Awan (*Stratovolcano above Sea of Clouds*) lengkap dengan animasi asap kawah, sapuan awan sirus, dan gelombang awan | ✅ Diterapkan |
| Dilarang menggunakan emoji OS, wajib gunakan emotikon / ikon style 2D Pixel Art | Mengeliminasi seluruh karakter emoji Unicode di seluruh modul web dan mendokumentasikan Zero OS Emoji Standard dengan kumpulan ikon SVG 2D Pixel Art (`PixelIcon.tsx`) | ✅ Diterapkan |

---

> **Dokumen ini adalah living document** — merekam seluruh standar visual dan implementasi desain RESQ-BOX v3.0 Pixel Quest Edition.


