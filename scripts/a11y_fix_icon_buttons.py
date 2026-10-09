#!/usr/bin/env python
"""
Tambahkan aria-label pada tombol yang isinya hanya ikon.

MASALAH
  Tombol tutup, tombol putar, dan tombol navigasi di RESQ-BOX umumnya hanya
  berisi ikon tanpa teks. Pembaca layar akan mengumumkan tombol-tombol itu
  sebagai "tombol" saja, sehingga pengguna tunanetra tidak tahu apa fungsinya
  dan tidak berani menekannya.

YANG DIPERBAIKI
  Setiap tombol yang isinya hanya ikon diberi `aria-label` sesuai fungsinya.
  Label ditentukan dari ikonnya:

    ✕  /  PixelIcon "cross"      -> "Tutup"
    ▶  /  PixelIcon "play"       -> "Mulai simulasi"
    PixelIcon "check"            -> "Lanjutkan"
    chevron kiri                 -> "Sebelumnya"
    chevron kanan                -> "Berikutnya"
    PixelIcon "trash"            -> "Hapus"

MENGAPA LABEL BERBAHASA INDONESIA
  Aplikasi ini dipakai siswa SMP di Indonesia dan seluruh antarmukanya sudah
  berbahasa Indonesia. Label berbahasa Inggris akan terbaca janggal oleh
  pembaca layar berbahasa Indonesia.

CATATAN
  Sebagian tombol yang tadinya dicurigai tanpa nama ternyata MEMANG punya teks
  — misalnya `{cls.name}` yang menampilkan nama kelas, atau huruf papan tombol
  Wordle. Tombol seperti itu sengaja TIDAK disentuh. Menambahkan aria-label di
  sana justru akan MENIMPA teks aslinya dan membuat pembaca layar
  mengumumkan hal yang keliru.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from jsx_scan import akhir_tag  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

# Ciri isi tombol -> label yang tepat
LIHAT_IKON = [
    (r'<PixelIcon[^>]*\bname="cross"', "Tutup"),
    (r'<PixelIcon[^>]*\bname="play"', "Mulai simulasi"),
    (r'<PixelIcon[^>]*\bname="check"', "Lanjutkan"),
    (r'<PixelIcon[^>]*\bname="trash"', "Hapus"),
    (r'<PixelIcon[^>]*\bname="close"', "Tutup"),
]

# Jalur SVG chevron/tempat sampah pada Level 3
LIHAT_SVG = [
    (r'd="M15 19l-7-7 7-7"', "Sebelumnya"),
    (r'd="M9 5l7 7-7 7"', "Berikutnya"),
    (r'd="M19 7l-', "Hapus"),
]


def label_untuk(inner: str) -> str | None:
    """Label yang tepat untuk isi tombol, atau None bila tidak dikenali."""
    teks = re.sub(r"<[^>]*>", "", inner).strip()
    # Hanya simbol dekoratif -> tombol ikon
    if teks in ("✕", "×", "✕︎"):
        return "Tutup"
    if teks in ("▶", "▶︎"):
        return "Mulai simulasi"

    for pola, label in LIHAT_IKON:
        if re.search(pola, inner):
            return label
    for pola, label in LIHAT_SVG:
        if pola in inner:
            return label
    return None


def main() -> int:
    total = 0
    for berkas in sorted(SRC.rglob("*.tsx")):
        teks = berkas.read_text(encoding="utf-8")
        asli = teks
        disisip: list[tuple[int, str]] = []

        pos = 0
        while True:
            i = teks.find("<button", pos)
            if i < 0:
                break
            akhir = akhir_tag(teks, i)
            if akhir < 0:
                break
            tag = teks[i:akhir + 1]
            pos = akhir + 1

            if "aria-label" in tag or "aria-labelledby" in tag:
                continue
            tutup = teks.find("</button>", akhir)
            if tutup < 0:
                continue

            inner = teks[akhir + 1:tutup]
            label = label_untuk(inner)
            if label:
                disisip.append((i + len("<button"), f' aria-label="{label}"'))
                total += 1

        # Sisipkan dari belakang agar posisi tidak bergeser
        for p, s in reversed(disisip):
            teks = teks[:p] + s + teks[p:]

        if teks != asli:
            berkas.write_text(teks, encoding="utf-8")
            print(f"  {len(disisip):>2} label  {berkas.relative_to(ROOT).as_posix()}")

    print(f"\n  TOTAL: {total} tombol diberi aria-label")
    return 0


if __name__ == "__main__":
    sys.exit(main())
