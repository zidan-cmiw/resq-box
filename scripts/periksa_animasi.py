#!/usr/bin/env python
"""
Periksa apakah setiap kelas animasi yang DIPAKAI benar-benar terdefinisi.

═══════════════════════════════════════════════════════════════════════════
MENGAPA PEMERIKSAAN INI ADA
═══════════════════════════════════════════════════════════════════════════

  Ditemukan: proyek ini memakai `animate-fadeIn` di 37 tempat — seluruh modal
  di Level 1, Level 2, dan Level 3 — tetapi kelas itu TIDAK PERNAH
  didefinisikan dan tidak dihasilkan Tailwind.

  Akibatnya seluruh modal muncul MENDADAK tanpa animasi. Tidak ada yang
  menyadarinya selama ini karena modalnya tetap muncul; yang hilang hanya
  efeknya, dan itu tidak terlihat sebagai kerusakan.

  Inilah jenis kesalahan yang paling mudah terlewat: KODE TETAP BERJALAN,
  hanya tidak sesuai maksud penulisnya. Karena itu diperlukan pemeriksa
  tersendiri.

═══════════════════════════════════════════════════════════════════════════
YANG DIPERIKSA
═══════════════════════════════════════════════════════════════════════════

  Untuk setiap `animate-<nama>` yang dipakai di berkas .tsx:

    - bila namanya adalah animasi BAWAAN Tailwind (bounce, ping, pulse,
      spin), dianggap ada karena Tailwind menghasilkannya
    - selain itu, harus ada aturan `.animate-<nama>` di salah satu berkas CSS
      ATAU di CSS hasil bangun (dist/assets/*.css)

  CSS hasil bangun ikut diperiksa karena Tailwind dapat menghasilkan kelas
  dari utilitasnya sendiri, dan itu juga sah.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

# Animasi bawaan Tailwind — tidak perlu didefinisikan sendiri.
BAWAAN = {
    "animate-none", "animate-spin", "animate-ping", "animate-pulse",
    "animate-bounce",
}

def kumpulkan_aturan(t: str) -> set[str]:
    """Nama kelas animasi yang memiliki aturan di CSS."""
    hasil = set()
    for m in re.finditer(r"\.(animate-[\w-]+)\s*[,{]", t):
        hasil.add(m.group(1))
    return hasil


def main() -> int:
    # Kelas yang didefinisikan di CSS sumber
    ada: set[str] = set()
    for f in SRC.rglob("*.css"):
        ada |= kumpulkan_aturan(f.read_text(encoding="utf-8", errors="ignore"))

    # Kelas yang dihasilkan Tailwind pada CSS hasil bangun
    dist = ROOT / "dist" / "assets"
    if dist.exists():
        for f in dist.glob("*.css"):
            ada |= kumpulkan_aturan(f.read_text(encoding="utf-8", errors="ignore"))

    # Kelas yang dipakai di kode
    dipakai: dict[str, list[tuple[str, int]]] = {}
    for f in SRC.rglob("*.tsx"):
        for i, baris in enumerate(
            f.read_text(encoding="utf-8", errors="ignore").split("\n"), 1
        ):
            if baris.strip().startswith(("//", "*", "/*")):
                continue
            for m in re.finditer(r"\b(animate-[\w-]+)\b", baris):
                dipakai.setdefault(m.group(1), []).append(
                    (f.relative_to(ROOT).as_posix(), i)
                )

    hilang = {
        k: v for k, v in dipakai.items() if k not in BAWAAN and k not in ada
    }

    print("=" * 78)
    print("  PEMERIKSAAN: KELAS ANIMASI YANG DIPAKAI TETAPI TIDAK ADA")
    print("=" * 78)
    print(f"\n  kelas animasi dipakai : {len(dipakai)}")
    print(f"  terdefinisi (CSS)     : {len([k for k in dipakai if k in ada])}")
    print(f"  bawaan Tailwind       : {len([k for k in dipakai if k in BAWAAN])}")

    if not hilang:
        print("\n  [v] Seluruh kelas animasi yang dipakai sudah terdefinisi.\n")
        print("=" * 78)
        return 0

    print(f"\n  [X] TIDAK TERDEFINISI: {len(hilang)} kelas\n")
    for nama, tempat in sorted(hilang.items(), key=lambda x: -len(x[1])):
        print(f"    {nama}  ({len(tempat)} tempat)")
        for berkas, baris in tempat[:4]:
            print(f"        {berkas}:{baris}")
        if len(tempat) > 4:
            print(f"        … dan {len(tempat) - 4} lagi")

    print("\n" + "=" * 78)
    print(f"  HASIL: {len(hilang)} kelas animasi tidak terdefinisi")
    print("=" * 78)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
