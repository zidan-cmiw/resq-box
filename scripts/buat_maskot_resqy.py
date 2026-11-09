# -*- coding: utf-8 -*-
"""Membangun kisi pixel art Resqy dengan bentuk geometris (bukan teks manual).

Bentuk dasar diisi ke dalam kisi 26 x 30 memakai elips, trapesium, dan persegi,
sehingga proporsi konsisten dan mudah diubah. Hasilnya dipakai dua kali:
pratinjau PNG dan komponen React.
"""
from pathlib import Path

from PIL import Image, ImageDraw

LEBAR, TINGGI = 26, 30
P = {
    "o": (61, 31, 12),
    "b": (176, 107, 44),
    "w": (240, 226, 205),
    "d": (122, 69, 24),
    "h": (242, 101, 34),
    "H": (255, 138, 61),
    "y": (255, 210, 63),
    "k": (26, 26, 26),
    "g": (43, 43, 43),
    "e": (255, 255, 255),
    "p": (58, 42, 18),
    "n": (255, 176, 46),
    "v": (255, 140, 26),
    "V": (255, 255, 255),
    "f": (247, 165, 59),
}

kisi = [["." for _ in range(LEBAR)] for _ in range(TINGGI)]


def isi(x, y, c):
    if 0 <= x < LEBAR and 0 <= y < TINGGI:
        kisi[y][x] = c


def elips(cx, cy, rx, ry, c):
    for y in range(TINGGI):
        for x in range(LEBAR):
            if ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1:
                isi(x, y, c)


# ── tubuh dan kepala ──
elips(13, 20.0, 7.2, 7.6, "o")
elips(13, 20.0, 6.4, 6.8, "b")
elips(13, 22.0, 3.6, 3.6, "w")

elips(13, 8.6, 7.4, 6.8, "o")
elips(13, 8.6, 6.6, 6.0, "b")

# ── sayap ──
elips(5.6, 20.0, 2.2, 5.0, "o")
elips(5.6, 20.0, 1.6, 4.4, "d")
elips(20.4, 20.0, 2.2, 5.0, "o")
elips(20.4, 20.0, 1.6, 4.4, "d")

# ── topi proyek ──
for y in range(0, 8):
    for x in range(LEBAR):
        if ((x - 13) / 8.6) ** 2 + ((y - 8.6) / 8.0) ** 2 <= 1 and y <= 7:
            isi(x, y, "h")
for x in range(4, 23):
    isi(x, 7, "h")
for x in range(6, 21):
    isi(x, 6, "H")

# lampu di depan topi
for y in range(3, 6):
    for x in range(11, 16):
        isi(x, y, "k")
for y in range(3, 5):
    for x in range(12, 15):
        isi(x, y, "y")

# ── kacamata ──
for y in range(9, 13):
    for x in range(5, 22):
        isi(x, y, "g")
for bulat in (8.5, 17.5):
    for y in range(9, 12):
        for x in range(int(bulat) - 3, int(bulat) + 3):
            isi(x, y, "e")
    isi(int(bulat) - 1, 10, "p")
    isi(int(bulat), 10, "p")
    isi(int(bulat) - 1, 11, "p")

# ── paruh ──
for x, y in ((12, 13), (13, 13), (12, 14), (13, 14)):
    isi(x, y, "n")

# ── rompi ──
for y in range(15, 23):
    jangkau = 5 if y < 17 else 6
    for x in range(13 - jangkau, 13 + jangkau):
        if kisi[y][x] in ("b", "w"):
            isi(x, y, "v")
for y in (16, 19):
    for x in range(6, 21):
        if kisi[y][x] == "v":
            isi(x, y, "V")

# ── kaki ──
for kaki_x in (8, 15):
    for x in range(kaki_x, kaki_x + 3):
        isi(x, 25, "f")
        isi(x, 26, "f")
    for x in range(kaki_x - 1, kaki_x + 4):
        isi(x, 27, "f")

# ── garis luar bawah tubuh ──
for x in range(5, 22):
    if kisi[24][x] == "b":
        isi(x, 24, "o")

baris = ["".join(b) for b in kisi]

# ══════════════ pratinjau ══════════════
SK = 14
img = Image.new("RGB", (LEBAR * SK + 40, TINGGI * SK + 40), (255, 251, 235))
d = ImageDraw.Draw(img)
for y, b in enumerate(baris):
    for x, k in enumerate(b):
        if k in P:
            d.rectangle([20 + x * SK, 20 + y * SK, 20 + (x + 1) * SK - 1, 20 + (y + 1) * SK - 1],
                        fill=P[k])
PNG = Path(r"C:\Users\b3nny\Downloads\pratinjau-resqy-baru.png")
img.save(PNG)
print(f"  [v] pratinjau {LEBAR}x{TINGGI}: {PNG.name}")

# ══════════════ komponen React ══════════════
peta = ",\n  ".join(f"{k}: '#{r:02x}{g:02x}{b:02x}'" for k, (r, g, b) in sorted(P.items()))
kisi_js = ",\n  ".join("'" + b + "'" for b in baris)

TSX = Path(r"C:\github\lidm buatan vincent\RESQ-BOX\src\components\ResqyMascot.tsx")
TSX.write_text(f'''// ── src/components/ResqyMascot.tsx ─────────────────────────────────────
// Maskot Resmi RESQ-BOX: Resqy, burung hantu pemandu ekspedisi geologi.
// Topi proyek dengan lampu, kacamata, rompi keselamatan, dan ransel antena.
//
// Bentuk disimpan sebagai kisi karakter (pixel art). Satu karakter = satu
// kotak SVG, sehingga maskot tetap tajam pada ukuran 22 px maupun 120 px.
// Untuk mengubah bentuk, sunting KISI di bawah — tidak perlu menyentuh SVG.

import React from 'react';

interface ResqyMascotProps {{
  size?: number;
  className?: string;
  talking?: boolean;
  mood?: 'happy' | 'thinking' | 'excited' | 'wise';
}}

const PALET: Record<string, string> = {{
  {peta}
}};

const KISI: string[] = [
  {kisi_js}
];

const LEBAR = {LEBAR};
const TINGGI = {TINGGI};

/** Ubah kisi sesuai pose. Hanya mata yang berbeda. */
function kisiPose(mood: NonNullable<ResqyMascotProps['mood']>): string[] {{
  const salin = [...KISI];
  const ganti = (baris: number, dari: string, ke: string) => {{
    const i = salin[baris].indexOf(dari);
    if (i >= 0) {{
      salin[baris] = salin[baris].slice(0, i) + ke + salin[baris].slice(i + dari.length);
    }}
  }};

  if (mood === 'happy') {{
    ganti(11, 'p', 'e');
  }} else if (mood === 'thinking') {{
    ganti(10, 'e', 'w');
  }} else if (mood === 'excited') {{
    ganti(10, 'p', 'e');
    ganti(11, 'p', 'e');
  }}
  return salin;
}}

export const ResqyMascot: React.FC<ResqyMascotProps> = ({{
  size = 56,
  className = '',
  talking = false,
  mood = 'wise',
}}) => {{
  const kisi = kisiPose(mood);

  return (
    <div
      className={{`inline-flex items-center justify-center select-none relative ${{className}}`}}
      style={{{{ width: size, height: size }}}}
      title="Resqy — burung hantu pemandu RESQ-BOX"
    >
      <svg
        viewBox={{`0 0 ${{LEBAR}} ${{TINGGI}}`}}
        width={{size}}
        height={{size}}
        className={{`w-full h-full drop-shadow-[0_3px_0_rgba(35,18,6,0.55)] ${{
          talking ? 'animate-bounce-subtle' : ''
        }}`}}
        shapeRendering="crispEdges"
        xmlns="http://www.w3.org/2000/svg"
      >
        {{kisi.map((baris, y) =>
          baris.split('').map((k, x) => {{
            const warna = PALET[k];
            if (!warna) return null;
            return <rect key={{`${{x}}-${{y}}`}} x={{x}} y={{y}} width={{1}} height={{1}} fill={{warna}} />;
          }}),
        )}}
      </svg>
    </div>
  );
}};

export default ResqyMascot;
''', encoding="utf-8")
print(f"  [v] komponen: {TSX.name}")
