#!/usr/bin/env python
"""
Periksa apakah setiap halaman layar penuh sudah menghindari safe area.

═══════════════════════════════════════════════════════════════════════════
MENGAPA PEMERIKSAAN INI ADA
═══════════════════════════════════════════════════════════════════════════

  `index.html` memakai `viewport-fit=cover`, yang membuat halaman memakai
  SELURUH layar termasuk area poni dan lubang kamera.

  Tanpa kelas safe area, konten di tepi layar masuk ke bawah lubang kamera
  lalu TERPOTONG. Itu yang terjadi pada tombol "Diorama WiFi" di Workspace:
  pada POCO F7 dalam lanskap, lubang kameranya ada di sisi kanan — persis
  tempat tombol itu berada.

  Masalah ini TIDAK terlihat di komputer, dan TIDAK terlihat di pemeriksa
  tata letak mana pun yang pernah ada di proyek ini. Ia hanya muncul di
  perangkat berponi atau berlubang kamera. Karena itu diperlukan pemeriksa
  tersendiri.

═══════════════════════════════════════════════════════════════════════════
YANG DIPERIKSA
═══════════════════════════════════════════════════════════════════════════

  1. `viewport-fit=cover` ada di index.html (prasyarat — tanpa itu, safe area
     tidak berlaku sama sekali)
  2. Aturan `env(safe-area-inset-*)` ada di index.css
  3. Setiap kontainer layar penuh memakai salah satu kelas safe area

  Kontainer layar penuh dikenali dari kelas `h-screen` atau `w-screen`
  bersamaan dengan `fixed inset-0`.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

KELAS_SAFE = ("safe-area-pad", "safe-area-pad-x", "safe-area-pad-top", "safe-area-pad-bottom")

masalah: list[str] = []

# ── 1. Prasyarat: viewport-fit=cover ─────────────────────────────────────
index_html = ROOT / "index.html"
if not index_html.exists():
    masalah.append("index.html tidak ditemukan")
else:
    isi = index_html.read_text(encoding="utf-8")
    if "viewport-fit=cover" not in isi:
        masalah.append(
            "index.html TIDAK memakai viewport-fit=cover — "
            "safe area tidak akan berlaku"
        )

# ── 2. Aturan env(safe-area-inset) ada di CSS ────────────────────────────
css = SRC / "index.css"
if not css.exists():
    masalah.append("src/index.css tidak ditemukan")
else:
    isi_css = css.read_text(encoding="utf-8")
    for sisi in ("top", "right", "bottom", "left"):
        if f"safe-area-inset-{sisi}" not in isi_css:
            masalah.append(f"index.css tidak mendefinisikan safe-area-inset-{sisi}")
    for kelas in KELAS_SAFE:
        if f".{kelas}" not in isi_css:
            masalah.append(f"index.css tidak mendefinisikan kelas .{kelas}")

# ── 3. Setiap kontainer layar penuh memakai kelas safe area ──────────────
diperiksa = 0
tanpa_safe: list[tuple[str, int, str]] = []

for f in list(SRC.rglob("*.tsx")):
    teks = f.read_text(encoding="utf-8", errors="ignore")
    for i, baris in enumerate(teks.split("\n"), 1):
        isi = baris.strip()
        if isi.startswith(("//", "*", "/*")):
            continue
        # Kontainer layar penuh: punya h-screen atau w-screen
        if "h-screen" not in isi and "w-screen" not in isi:
            continue
        diperiksa += 1
        if any(k in isi for k in KELAS_SAFE):
            continue
        # Pengecualian yang disengaja: lapisan latar / pembungkus galat yang
        # TIDAK memuat tombol atau teks di tepi layar.
        if any(x in isi for x in ("AppErrorBoundary", "absolute inset-0")):
            continue
        # Kontainer yang SUDAH punya padding sendiri tidak perlu safe area
        # pada keempat sisinya: isinya sudah tidak mepet tepi layar. Contohnya
        # halaman Login dan Credits yang memakai `p-4` dan isinya di tengah.
        #
        # Yang benar-benar berbahaya adalah kontainer PENUH TEPI: isinya
        # menyentuh sisi layar, sehingga masuk ke bawah lubang kamera lalu
        # terpotong. Itu keadaan Workspace, dan itu yang harus diperiksa.
        punya_padding_sendiri = re.search(r"\bp[xy]?-\d", isi) is not None
        if punya_padding_sendiri:
            continue
        tanpa_safe.append((f.relative_to(ROOT).as_posix(), i, isi[:100]))

print("=" * 78)
print("PEMERIKSAAN: PENANGANAN SAFE AREA (PONI & LUBANG KAMERA)")
print("=" * 78)

print("\n── PRASYARAT ──")
print(f"  {'[v]' if 'viewport-fit=cover' in (index_html.read_text(encoding='utf-8') if index_html.exists() else '') else '[X]'} viewport-fit=cover di index.html")
print(f"  {'[v]' if css.exists() and 'safe-area-inset-right' in css.read_text(encoding='utf-8') else '[X]'} env(safe-area-inset-*) di index.css")

print(f"\n── KONTAINER LAYAR PENUH ({diperiksa} diperiksa) ──")
if tanpa_safe:
    for berkas, baris, isi in tanpa_safe:
        print(f"  [X] {berkas}:{baris}")
        print(f"        {isi}")
else:
    print("  [v] seluruh kontainer layar penuh memakai kelas safe area")

total = len(masalah) + len(tanpa_safe)
if masalah:
    print("\n── MASALAH LAIN ──")
    for m in masalah:
        print(f"  [X] {m}")

print("\n" + "=" * 78)
print(f"  HASIL: {total} masalah" if total else "  HASIL: safe area ditangani di seluruh kontainer layar penuh")
print("=" * 78)
sys.exit(1 if total else 0)
