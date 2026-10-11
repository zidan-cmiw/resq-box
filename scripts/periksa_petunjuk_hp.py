#!/usr/bin/env python
"""
Cari teks PETUNJUK yang HILANG di layar sempit.

═══════════════════════════════════════════════════════════════════════════
MENGAPA PEMERIKSAAN INI ADA
═══════════════════════════════════════════════════════════════════════════

  Dua bug nyata di proyek ini berbentuk sama:

    - "[Klik / SPASI untuk Lanjut ▶]" memakai `hidden sm:inline`
    - akibatnya petunjuknya TIDAK MUNCUL di layar HP

  Bug itu muncul DUA KALI (Level 1 dan Level 2) karena kodenya disalin.
  Keduanya baru ketahuan setelah tangkapan layar HP diperiksa dengan mata.

  Pemeriksaan ini mencari POLA yang sama di seluruh proyek, supaya tidak
  perlu menunggu ada yang memeriksanya dengan mata.

═══════════════════════════════════════════════════════════════════════════
YANG MEMBEDAKAN TEMUAN NYATA DARI POSITIF PALSU
═══════════════════════════════════════════════════════════════════════════

  Pemeriksaan pertama melaporkan "PILIH BENTANG ALAM:" sebagai masalah, dan
  itu SALAH. Kodenya berbunyi:

      <span className="hidden sm:inline">PILIH BENTANG ALAM:</span>
      <span className="sm:hidden">BENTANG ALAM:</span>

  Jadi teksnya memang disembunyikan di HP, TETAPI DIGANTI dengan versi yang
  lebih pendek. Tidak ada informasi yang hilang — ini justru penataan yang
  benar, dan persis pola yang dipakai di perbaikan plakat Level 3.

  Karena itu pemeriksaan ini membedakan dua hal:

    1. Teks petunjuk disembunyikan DAN ada teks lain yang muncul sebagai
       gantinya di dekat situ  ->  BUKAN masalah
    2. Teks petunjuk disembunyikan TANPA pengganti  ->  MASALAH

  Pemeriksaan yang tidak membedakan keduanya akan menghasilkan positif palsu,
  dan positif palsu membuat pemeriksaan diabaikan orang.

═══════════════════════════════════════════════════════════════════════════
CARA MENJALANKAN
═══════════════════════════════════════════════════════════════════════════
  python scripts/periksa_petunjuk_hp.py
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

# Kata yang menandakan teks itu MEMERINTAHKAN pengguna melakukan sesuatu.
KATA_PERINTAH = re.compile(
    r"\b(klik|tekan|tap|sentuh|spasi|geser|seret|swipe|gulir|scroll|"
    r"pilih|gunakan|pakai|tekan|lanjut|maju|buka|tutup)\b",
    re.IGNORECASE,
)

# Kelas yang menyembunyikan elemen pada layar sempit.
SEMBUNYI_SEMPIT = re.compile(r"hidden\s+(sm|md|lg|xl):")


def teks_dari(baris: str) -> str:
    """Ambil teks yang terlihat dari satu baris JSX."""
    t = re.sub(r"<[^>]+>", " ", baris)
    t = re.sub(r"\{[^}]*\}", " ", t)
    t = re.sub(r"//.*$", " ", t)
    return re.sub(r"\s+", " ", t).strip()


def main() -> int:
    masalah: list[tuple[str, int, str]] = []
    diganti: list[tuple[str, int, str]] = []

    for f in sorted(SRC.rglob("*.tsx")):
        baris = f.read_text(encoding="utf-8", errors="ignore").split("\n")
        for i, l in enumerate(baris):
            if not SEMBUNYI_SEMPIT.search(l):
                continue
            teks = teks_dari(l)
            if len(teks) < 12 or not KATA_PERINTAH.search(teks):
                continue

            # Periksa 4 baris sesudahnya: apakah ada teks PENGGANTI?
            # Pengganti ditandai kelas `sm:hidden` atau `xs:hidden`, yaitu
            # elemen yang justru HANYA muncul di layar sempit.
            pengganti = False
            for j in range(i + 1, min(len(baris), i + 5)):
                if re.search(r"\b(sm|xs|md):hidden\b", baris[j]):
                    t2 = teks_dari(baris[j])
                    if len(t2) >= 4:
                        pengganti = True
                        break

            rel = f.relative_to(SRC).as_posix()
            if pengganti:
                diganti.append((rel, i + 1, teks))
            else:
                masalah.append((rel, i + 1, teks))

    print("=" * 80)
    print("  PEMERIKSAAN: TEKS PETUNJUK YANG HILANG DI LAYAR SEMPIT")
    print("=" * 80)
    print("")
    print(f"  petunjuk disembunyikan TANPA pengganti : {len(masalah)}")
    print(f"  petunjuk disembunyikan DENGAN pengganti: {len(diganti)}")
    print("")

    if diganti:
        print("  ── Dengan pengganti (BUKAN masalah) ──")
        for rel, b, t in diganti:
            print(f"    {rel}:{b}")
            print(f"        {t[:70]}")
        print("")

    if not masalah:
        print("  [v] Tidak ada petunjuk yang hilang di layar sempit.")
        print("")
        print("=" * 80)
        return 0

    print("  ── TANPA pengganti (MASALAH) ──")
    for rel, b, t in masalah:
        print(f"    {rel}:{b}")
        print(f"        {t[:70]}")

    print("")
    print("=" * 80)
    print(f"  HASIL: {len(masalah)} petunjuk hilang di layar sempit")
    print("=" * 80)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
