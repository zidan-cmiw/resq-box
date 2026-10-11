#!/usr/bin/env python
"""
Ganti tinggi layar tetap (100vh) dengan tinggi yang menyesuaikan (100dvh).

═══════════════════════════════════════════════════════════════════════════
MENGAPA PENGGANTIAN INI PERLU
═══════════════════════════════════════════════════════════════════════════

  `h-screen` di Tailwind berarti `height: 100vh`. Satuan `vh` diukur terhadap
  tinggi layar SELURUHNYA — TERMASUK wilayah yang ditempati bilah peramban.

  Di iPad (dan iPhone), bilah alamat serta bilah tab TIDAK ikut menghilang.
  Pada iPad Air 5 dalam posisi lanskap, keduanya memakan tinggi sekitar 100px.
  Akibatnya:

    - `100vh` bernilai ~780px (tinggi layar penuh)
    - tinggi yang BENAR-BENAR terlihat hanya ~680px

  Halaman yang memakai `h-screen` menjadi LEBIH TINGGI daripada wilayah yang
  terlihat. Karena itu ada bagian yang berada di luar pandangan:

    - Pada Dashboard, halaman memakai `flex flex-col justify-between`,
      sehingga JUDUL di atas dan TOMBOL di bawah sama-sama berada di tepi.
      Keduanya masuk ke wilayah yang tertutup bilah peramban — dan judul
      besar "RESQ-BOX" terlihat TERPOTONG pada tangkapan layar dari iPad.

    - Pada halaman permainan, kanvas diskalakan memakai `window.innerHeight`
      yang juga menghitung wilayah tertutup itu, sehingga tombol kendali di
      bagian bawah ikut terdorong keluar pandangan.

═══════════════════════════════════════════════════════════════════════════
MENGAPA `dvh` MENYELESAIKANNYA
═══════════════════════════════════════════════════════════════════════════

  `dvh` (dynamic viewport height) adalah satuan yang MENYESUAIKAN DIRI dengan
  wilayah yang benar-benar terlihat. Nilainya berubah ketika bilah peramban
  muncul atau menghilang.

  Dengan `100dvh`:

    - saat bilah peramban terlihat, 100dvh = tinggi yang terlihat
    - saat bilah peramban disembunyikan, 100dvh bertambah sendiri

  Jadi isi halaman selalu berada di dalam wilayah pandangan, tanpa perlu
  kode tambahan untuk memantau perubahan tinggi.

  `dvh` didukung Safari 15.4+ (Maret 2022), Chrome 108+, dan Firefox 101+.
  Peramban yang belum mengenalnya akan mengabaikan deklarasinya — dan karena
  `h-screen` tetap ditulis SEBELUM `h-[100dvh]`, peramban lama tetap memakai
  `100vh` seperti sebelumnya. Tidak ada yang rusak.

═══════════════════════════════════════════════════════════════════════════
CARA PAKAI
═══════════════════════════════════════════════════════════════════════════

    python scripts/ganti_ke_dvh.py            # lihat rencana saja
    python scripts/ganti_ke_dvh.py --terapkan # kerjakan
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

TERAPKAN = "--terapkan" in sys.argv

# Hanya pola kelas Tailwind yang perlu diganti. `min-h-screen` dan `h-screen`
# dapat diganti menjadi bentuk `dvh` yang setara.
POLA = [
    # (pola lama, pengganti)
    ("min-h-screen", "min-h-screen min-h-[100dvh]"),
    ("h-screen", "h-screen h-[100dvh]"),
    ("w-screen", "w-screen w-[100dvw]"),
]

# Urutan penting: `min-h-screen` harus diproses SEBELUM `h-screen`, karena
# `h-screen` adalah bagian dari `min-h-screen`. Bila urutannya terbalik,
# hasilnya menjadi `min-h-screen min-h-[100dvh] min-h-[100dvh]`.
TERLARANG = (
    "new-h-screen",
)


def main() -> int:
    berkas = sorted(
        f for f in SRC.rglob("*.tsx")
        if "node_modules" not in str(f)
    )

    total_berkas = 0
    total_ganti = 0
    rincian: list[tuple[str, int]] = []

    for f in berkas:
        asli = f.read_text(encoding="utf-8")
        teks = asli
        jumlah = 0

        for lama, baru in POLA:
            # Jangan proses yang sudah punya bentuk dvh
            if f"{lama} {baru.split()[-1]}" in teks:
                continue
            if baru in teks and lama + " " + baru.split()[-1] in teks:
                continue

            # Batas kata: jangan menyentuh nama kelas lain yang memuat teks ini
            pola = re.compile(r"(?<![\w-])" + re.escape(lama) + r"(?![\w-])")
            teks, n = pola.subn(baru, teks)
            jumlah += n

        if jumlah:
            total_berkas += 1
            total_ganti += jumlah
            rincian.append((f.relative_to(ROOT).as_posix(), jumlah))
            if TERAPKAN:
                f.write_text(teks, encoding="utf-8")

    print("=" * 74)
    print("  GANTI 100vh -> 100dvh (menyesuaikan bilah peramban)")
    print("=" * 74)
    print(f"  mode: {'TERAPKAN' if TERAPKAN else 'RENCANA SAJA (tambahkan --terapkan)'}\n")

    for nama, jumlah in rincian:
        print(f"  {jumlah:>3}x  {nama}")

    print(f"\n  {total_ganti} penggantian di {total_berkas} berkas")
    if not TERAPKAN:
        print("\n  Jalankan dengan --terapkan untuk mengerjakannya.")
    print("=" * 74)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
