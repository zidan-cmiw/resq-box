#!/usr/bin/env python3
"""
Hapus emoji bawaan sistem operasi dari sumber RESQ-BOX.

KEBIJAKAN (sesuai standar proyek: "Zero OS Emoji")
  1. Emoji BERWARNA (tampil berbeda di Windows/Android/iOS) → dihapus.
     Contoh: 🔍 🔒 🌋 📟 💥 ⚡ 🏔 🌊 🟡 🔴 🎥 🚨 🚀 🗑 🏆
  2. Karakter pemaksa tampilan emoji → dihapus, sehingga simbol setelahnya
     kembali tampil monokrom mengikuti warna teks (mis. "⚠️" → "⚠").
     Yaitu U+FE0F (variation selector-16) dan U+20E3 (combining keycap).
  3. Simbol TEKS monokrom → DIPERTAHANKAN, karena seragam di semua platform,
     mengikuti warna font (sesuai gaya pixel), dan berfungsi sebagai penanda
     navigasi: ➔ ★ ✓ ✕ ▶ ◀ ⚠ ⯇ ➜ ✦ ✗ ⏸ ⏹ ⏳

Setelah emoji dihapus, spasi ganda dibersihkan agar kalimat tetap rapi.

Pakai:
    python scripts/remove_emoji.py --dry-run
    python scripts/remove_emoji.py
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

# Emoji berwarna + karakter buildernya. Sengaja TIDAK memuat simbol teks
# monokrom (U+2190–U+25FF kecuali yang di bawah, U+2605, U+2713, dst).
EMOJI_CHARS = (
    # Wajah & orang
    "\U0001F600-\U0001F64F\U0001F466-\U0001F469\U0001F9D1-\U0001F9D9"
    # Simbol teknis & UI berwarna
    "\U0001F4A1\U0001F4A5\U0001F4DF\U0001F4F1\U0001F4F7\U0001F4F9\U0001F3A5"
    # Alam
    "\U0001F30A\U0001F30B\U0001F3D4\U0001F3D5\U0001F332\U0001F525\U0001F30D"
    # Objek & alat
    "\U0001F3C6\U0001F3AF\U0001F3B2\U0001F511\U0001F512\U0001F513\U0001F5D1"
    "\U0001F4DA\U0001F4CB\U0001F4CD\U0001F4E6\U0001F4E3\U0001F50D\U0001F50E"
    "\U0001F4E1\U0001F4E1\U0001F6E0\U0001F9F0\U0001F680\U0001F6A8\U0001F6A9"
    # Simbol status berwarna
    "\U0001F534\U0001F7E0\U0001F7E1\U0001F7E2\U0001F535\U0001F7E3\U0001F7E4"
    "\U0001F7E5\U0001F7E6\U0001F7E7\U0001F7E8\U0001F7E9\U0001F7EA\U0001F7EB"
    # Cuaca berwarna
    "\U0001F324-\U0001F32C\U0001F326\U0001F327\U0001F328\U0001F329\U0001F32A"
    # Berbagai simbol lain
    "\U0001F195\U0001F199\U0001F19A\U0001F4A2\U0001F4A4\U0001F4A8"
    # Pemaksa tampilan emoji
    "\uFE0F\u20E3"
)

EMOJI_RE = re.compile(f"[{EMOJI_CHARS}]+")

# Setelah emoji dibuang, rapikan sisa spasi/tanda baca.
#
# PENTING: perapian HANYA dilakukan pada teks yang benar-benar dilihat pengguna
# (isi string dan teks JSX). Merapikan seluruh baris akan merusak kode —
# misalnya `? 'A' : 'B'` menjadi `?'A': 'B'`, dan spasi di dalam objek JS.
INLINE_CLEANUPS: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r" {2,}"), " "),          # spasi ganda
    (re.compile(r" +([,.;:!?])"), r"\1"), # spasi sebelum tanda baca
    (re.compile(r"\(\s*\)"), "()"),       # tanda kurung kosong
    (re.compile(r"\[\s*\]"), "[]"),       # kurung siku kosong
]

# Bagian baris yang boleh dirapikan: isi 'string', "string", `template`,
# dan teks di antara > dan < pada JSX.
SEGMENT_RE = re.compile(
    r"('(?:[^'\\]|\\.)*')"          # string kutip tunggal
    r"|(\"(?:[^\"\\]|\\.)*\")"      # string kutip ganda
    r"|(`(?:[^`\\]|\\.)*`)"         # template literal
    r"|(>[^<>{}\n]+<)"              # teks JSX di antara tag
)


def _clean_segment(seg: str) -> str:
    for pat, rep in INLINE_CLEANUPS:
        seg = pat.sub(rep, seg)
    return seg


def transform(content: str) -> tuple[str, int]:
    """Buang emoji, lalu rapikan spasi HANYA di dalam teks yang terlihat.

    Setiap baris diperiksa satu per satu; kode di luar string/teks JSX tidak
    tersentuh sama sekali.
    """
    if not EMOJI_RE.search(content):
        return content, 0

    total = 0
    out_lines: list[str] = []

    for line in content.split("\n"):
        if not EMOJI_RE.search(line):
            out_lines.append(line)
            continue

        new_line, n = EMOJI_RE.subn("", line)
        total += n

        # Baris ini sudah pasti kehilangan karakter, jadi spasi ganda yang
        # muncul barulah artefak dari penghapusan — aman dirapikan. Spasi ganda
        # di baris lain TIDAK disentuh (bisa jadi perataan kode).
        new_line = re.sub(r" {2,}", " ", new_line)

        # Bersihkan sisa tanda kurung yang jadi kosong karena emoji dibuang.
        new_line = re.sub(r"\[\s*\]", "", new_line)
        new_line = re.sub(r"\(\s*\)", "", new_line)
        new_line = re.sub(r"<\s*span\s*>\s*</span\s*>", "", new_line)

        # Rapikan hanya di dalam potongan yang terdeteksi sebagai teks tampil.
        def repl(m: re.Match[str]) -> str:
            seg = m.group(0)
            cleaned = _clean_segment(seg)
            if seg.startswith(">") and seg.endswith("<"):
                inner = cleaned[1:-1].strip()
                return f">{inner}<" if inner else seg
            return cleaned

        new_line = SEGMENT_RE.sub(repl, new_line)
        new_line = new_line.rstrip()

        # Baris yang isinya HANYA emoji (mis. badge berdiri sendiri) → buang.
        if new_line.strip() == "" and line.strip() != "":
            continue
        out_lines.append(new_line)

    return "\n".join(out_lines), total


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    files = sorted(SRC.rglob("*.tsx")) + sorted(SRC.rglob("*.ts"))
    total = 0
    changed = 0
    preview: list[tuple[str, str, str]] = []

    for path in files:
        try:
            raw = path.read_text(encoding="utf-8")
        except (UnicodeDecodeError, OSError):
            continue
        new, n = transform(raw)
        if n == 0 or new == raw:
            continue
        total += n
        changed += 1
        if args.dry_run and len(preview) < 15:
            old_lines, new_lines = raw.splitlines(), new.splitlines()
            for i, (o, nw) in enumerate(zip(old_lines, new_lines)):
                if o != nw:
                    preview.append((path.relative_to(ROOT).as_posix(), o.strip()[:100], nw.strip()[:100]))
                    break
        if not args.dry_run:
            path.write_text(new, encoding="utf-8")

    mode = "DRY RUN — tidak ada berkas diubah" if args.dry_run else "DITERAPKAN"
    print(f"{mode}")
    print(f"  berkas terpengaruh : {changed}")
    print(f"  emoji dihapus      : {total}")

    if preview:
        print("\nContoh sebelum/sesudah:")
        for f, o, n in preview:
            print(f"\n  {f}")
            print(f"    - {o}")
            print(f"    + {n}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
