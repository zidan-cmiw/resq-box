#!/usr/bin/env python3
"""
Verifikasi kontras warna terhadap standar WCAG 2.1.

MENGAPA PENTING
  Aplikasi ini dipakai di kelas dengan beragam kondisi: proyektor sekolah yang
  pudar, layar HP murah, ruangan yang terang, dan siswa dengan gangguan
  penglihatan. Warna pixel art yang "keren" sering gagal standar keterbacaan.
  Alat ini menghitung rasio kontras setiap pasangan warna yang benar-benar
  dipakai, dan menandai yang di bawah ambang.

AMBANG WCAG 2.1
  Teks normal (< 18pt / < 14pt tebal) : minimal 4.5:1
  Teks besar (>= 18pt / >= 14pt tebal): minimal 3.0:1
  Komponen UI & grafik               : minimal 3.0:1

Pakai:
    python scripts/check_contrast.py
    python scripts/check_contrast.py --all
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

# Ambang WCAG
AA_NORMAL = 4.5
AA_LARGE = 3.0
AA_UI = 3.0

HEX = re.compile(r"#([0-9a-fA-F]{6})\b")
RGB = re.compile(r"rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)")


def srgb_to_linear(c: float) -> float:
    c = c / 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def luminance(rgb: tuple[int, int, int]) -> float:
    r, g, b = (srgb_to_linear(v) for v in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(a: tuple[int, int, int], b: tuple[int, int, int]) -> float:
    la, lb = luminance(a), luminance(b)
    hi, lo = (la, lb) if la >= lb else (lb, la)
    return (hi + 0.05) / (lo + 0.05)


def hex_to_rgb(h: str) -> tuple[int, int, int]:
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))


def parse_colors(css_text: str) -> dict[str, tuple[int, int, int]]:
    """Ambil seluruh definisi --nama: #hex dari blok :root."""
    out: dict[str, tuple[int, int, int]] = {}
    for m in re.finditer(r"--([a-z0-9-]+)\s*:\s*#([0-9a-fA-F]{6})\s*;", css_text):
        out[m.group(1)] = hex_to_rgb(m.group(2))
    return out


# ── Pasangan warna yang benar-benar dipakai di aplikasi ──────────────────
# (nama, warna teks, warna latar, ukuran teks dalam px, apakah tebal)
PAIRS: list[tuple[str, str, str, float, bool]] = [
    # Halaman Login / Dashboard / Posko Guru — plakat kayu
    ("teks utama di plakat kayu (#3e1f07 / #d8a26e)", "#3e1f07", "#d8a26e", 13.0, False),
    ("judul di plakat kayu (#231206 / #d8a26e)", "#231206", "#d8a26e", 13.0, True),
    ("teks di tombol kayu terang (#231206 / #f0c395)", "#231206", "#f0c395", 13.0, True),
    ("teks tombol terkunci (#f8fafc / #64748b)", "#f8fafc", "#64748b", 13.0, False),
    ("badge status hijau (#052e16 / #86efac)", "#052e16", "#86efac", 12.5, True),
    ("badge status merah (#450a0a / #fca5a5)", "#450a0a", "#fca5a5", 12.5, True),
    ("badge status kuning (#422006 / #fde047)", "#422006", "#fde047", 12.5, True),

    # Mode gelap — dialog & HUD game
    ("teks dialog di panel gelap (#e2e8f0 / #0f172a)", "#e2e8f0", "#0f172a", 14.0, False),
    ("teks sekunder di panel gelap (#94a3b8 / #0f172a)", "#94a3b8", "#0f172a", 13.0, False),
    ("teks redup di panel gelap (#94a3b8 / #1e293b)", "#94a3b8", "#1e293b", 13.0, False),
    ("teks amber di latar gelap (#fbbf24 / #0f172a)", "#fbbf24", "#0f172a", 13.0, True),
    ("teks emerald di latar gelap (#34d399 / #0f172a)", "#34d399", "#0f172a", 13.0, True),
    ("teks rose di latar gelap (#fb7185 / #0f172a)", "#fb7185", "#0f172a", 13.0, True),
    ("teks slate terang di latar sangat gelap (#cbd5e1 / #020617)", "#cbd5e1", "#020617", 13.0, False),

    # Halaman terang
    ("teks utama di latar terang (#1e293b / #f8fafc)", "#1e293b", "#f8fafc", 14.0, False),
    ("teks sekunder di latar terang (#475569 / #f8fafc)", "#475569", "#f8fafc", 13.0, False),
    ("teks amber tua di krem (#78350f / #fef3c7)", "#78350f", "#fef3c7", 13.0, False),

    # Kebijakan Privasi
    ("teks privasi (#3e1f07 / #d8a26e)", "#3e1f07", "#d8a26e", 13.0, False),

    # Mode hemat data / error boundary
    ("teks error di latar gelap (#fecaca / #1c1917)", "#fecaca", "#1c1917", 13.0, False),
]


def classify(ratio: float, size: float, bold: bool) -> tuple[bool, bool]:
    """Kembalikan (lulus_AA, lulus_AAA)."""
    large = size >= 18 or (bold and size >= 14)
    aa = AA_LARGE if large else AA_NORMAL
    aaa = 4.5 if large else 7.0
    return ratio >= aa, ratio >= aaa


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--all", action="store_true", help="tampilkan juga yang lulus")
    args = parser.parse_args()

    fails: list[tuple[str, float, float]] = []
    warns: list[tuple[str, float, float]] = []

    print(f"{'PASANGAN WARNA':<56} {'RASIO':>7}  {'AA':>4} {'AAA':>4}")
    print("-" * 78)
    for name, fg, bg, size, bold in PAIRS:
        try:
            ratio = contrast(hex_to_rgb(fg.lstrip("#")), hex_to_rgb(bg.lstrip("#")))
        except ValueError:
            continue
        aa, aaa = classify(ratio, size, bold)
        large = size >= 18 or (bold and size >= 14)
        need = AA_LARGE if large else AA_NORMAL
        mark_aa = "OK" if aa else "GAGAL"
        mark_aaa = "OK" if aaa else "-"
        if not aa:
            fails.append((name, ratio, need))
        elif ratio < 7.0 and not large:
            warns.append((name, ratio, 7.0))
        if args.all or not aa or ratio < 5.0:
            print(f"{name:<56} {ratio:>6.2f}:1  {mark_aa:>4} {mark_aaa:>4}")

    print("-" * 78)
    print(f"\nGAGAL WCAG AA ({len(fails)}):")
    if not fails:
        print("  tidak ada — seluruh pasangan warna memenuhi minimal 4.5:1")
    for name, ratio, need in fails:
        print(f"  {ratio:>5.2f}:1 (butuh {need}:1)  {name}")

    print(f"\nCATATAN (lulus AA tetapi belum AAA, {len(warns)}):")
    for name, ratio, need in warns[:10]:
        print(f"  {ratio:>5.2f}:1 (AAA butuh {need}:1)  {name}")
    if len(warns) > 10:
        print(f"  ... dan {len(warns)-10} lainnya")

    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
