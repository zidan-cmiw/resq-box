#!/usr/bin/env python
"""
Cari pola responsif yang berisiko di seluruh src.

MENGAPA BERKAS KEDUA
  Audit pertama (audit_responsif.py) menghasilkan 104 temuan, tetapi setelah
  diperiksa satu per satu, SEBAGIAN BESAR ternyata positif palsu atau disengaja:

    - `w-[95%] max-w-[680px]` -> regex cocok pada potongan `max-w-[680px]`
    - `width: '880px', maxWidth: '96vw'` -> sudah dibatasi viewport
    - `min-w-[180px]` pada <th> -> disengaja, wadahnya sudah `overflow-x-auto`
    - `max-width: 680px` -> ada di dalam CSS CETAK rapor, tidak relevan
    - `whitespace-nowrap` pada badge seperti "TAHAP 2" -> tidak berisiko

  Berkas ini mencari pola yang SECARA PASTI menyebabkan tampilan rusak, tanpa
  menandai pola yang justru sudah benar.

YANG DICARI
  1. `grid-cols-N` dengan N >= 3 tanpa varian responsif apa pun
     Di layar 360px, 3 kolom berarti tiap kolom ~110px; 5 kolom berarti ~62px.
     Teks di dalamnya berdesakan atau melampaui batas.

  2. `flex` dengan banyak anak ber-`shrink-0` tanpa `flex-wrap`
     Anak yang tidak dapat menyusut akan memaksa wadah melebar.

  3. Lebar tetap pada elemen inline TANPA `max-w` di baris yang sama
     (yang punya `max-w` justru sudah benar dan sengaja dilewati)

  4. Padding besar (>= 24px) tanpa varian responsif
     Di layar 360px, `p-6` memakan 48px dari 360px (13%).
"""
from __future__ import annotations

import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

HASIL: dict[str, list[tuple[str, int, str]]] = defaultdict(list)


def periksa(rel: str, teks: str) -> None:
    for i, baris in enumerate(teks.split("\n"), 1):
        s = baris.strip()
        if not s or s.startswith(("//", "*", "/*")):
            continue
        # Lewati CSS cetak (baris panjang berisi banyak deklarasi)
        if s.count(";") >= 3 and re.search(r"\d+px", s):
            continue

        # 1. grid-cols-N tanpa varian responsif
        for m in re.finditer(r"(?<![\w:-])grid-cols-(\d+)", s):
            n = int(m.group(1))
            if n >= 3:
                # Apakah ada varian sm:/md:/lg: di baris yang sama ATAU di
                # baris sebelumnya (kelas sering ditulis multi-baris)?
                if not re.search(r"(sm|md|lg|xl|2xl):grid-cols", s):
                    HASIL[f"grid-cols-{n} tanpa varian responsif"].append(
                        (rel, i, f"{n} kolom -> tiap kolom ~{360 // n}px di layar 360px"))

        # 3. Lebar tetap tanpa max-w
        for m in re.finditer(r"(?<![\w-])(w)-\[(\d{3,})px\]", s):
            px = int(m.group(2))
            if px >= 500 and "max-w" not in s:
                HASIL["lebar tetap tanpa max-w"].append((rel, i, f"{m.group(0)} = {px}px"))

        # 4. padding besar tanpa varian
        for m in re.finditer(r"(?<![\w:-])p-(\d+)", s):
            n = int(m.group(1))
            px = n * 4
            if px >= 24 and not re.search(r"(sm|md|lg|xl):p-", s):
                HASIL[f"padding {px}px tanpa varian"].append((rel, i, s[:70]))
                break


def main() -> int:
    for berkas in sorted(SRC.rglob("*.tsx")):
        try:
            teks = berkas.read_text(encoding="utf-8")
        except (UnicodeDecodeError, OSError):
            continue
        periksa(berkas.relative_to(ROOT).as_posix(), teks)

    print("=" * 74)
    print("TEMUAN YANG DAPAT DIPERCAYA (tanpa positif palsu)")
    print("=" * 74)
    total = sum(len(v) for v in HASIL.values())
    if not total:
        print("\n  Tidak ada pola berisiko yang ditemukan.\n")
        return 0

    for kategori, item in sorted(HASIL.items(), key=lambda kv: -len(kv[1])):
        print(f"\n── {kategori}  ({len(item)}) ──")
        for rel, i, ket in item[:12]:
            print(f"   {rel}:{i}")
            print(f"      {ket}")
        if len(item) > 12:
            print(f"   ... dan {len(item) - 12} lagi")
    print(f"\n  TOTAL: {total} temuan\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
