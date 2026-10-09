#!/usr/bin/env python
"""
Pisahkan potret NPC dari npcSprites.ts.

KEADAAN SEBELUM
  src/app/Level1/EarthDive/engine/npcSprites.ts   4.385 baris

  Isinya dua hal berbeda:
    - drawNpcOnWorld (2.264 baris) dan drawMascotWorld (122 baris): menggambar
      NPC di dunia permainan
    - 37 fungsi potret (1.896 baris): potret wajah untuk kotak dialog

DASAR KEPUTUSAN PEMISAHAN
  Seluruh 37 fungsi potret diperiksa dependensinya. Hasilnya bersih: satu-
  satunya dependensi bersama adalah `getOrCreateCanvas`, yang dipakai oleh 36
  dari 37 fungsi. Tidak ada fungsi potret yang menyentuh gambar dunia.

  Karena itu `portraitCache` dan `getOrCreateCanvas` ikut dipindahkan, karena
  keduanya memang hanya melayani potret.

  Berkas induk MENGEKSPOR ULANG seluruh potret, sehingga pemakai lama tidak
  perlu diubah.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BERKAS = ROOT / "src/app/Level1/EarthDive/engine/npcSprites.ts"
TUJUAN = ROOT / "src/app/Level1/EarthDive/engine/npcPortraits.ts"

# Ikut pindah karena hanya melayani potret
IKUT = {"portraitCache", "getOrCreateCanvas"}

KEPALA = """/**
 * Potret NPC untuk kotak dialog Earth Dive.
 *
 * Berkas ini dipecah dari npcSprites.ts. Isinya 37 fungsi potret beserta
 * cache kanvasnya. Dipisahkan karena menggambar NPC di dunia permainan
 * (drawNpcOnWorld, 2.264 baris) sama sekali tidak berhubungan dengan
 * menggambar wajah untuk dialog.
 *
 * Seluruh fungsi potret hanya bergantung pada getOrCreateCanvas dan
 * portraitCache, sehingga dapat berdiri sendiri tanpa menyentuh kode dunia.
 */
"""


def blok_deklarasi(baris: list[str]) -> list[tuple[int, int, str]]:
    titik: list[tuple[int, str]] = []
    for i, b in enumerate(baris):
        m = re.match(r"^(?:export\s+)?(?:function|const)\s+([A-Za-z_$][\w$]*)", b)
        if m:
            titik.append((i, m.group(1)))
    titik.append((len(baris), "<EOF>"))
    rentang = []
    for k in range(len(titik) - 1):
        i, nama = titik[k]
        j = titik[k + 1][0]
        while i > 0 and baris[i - 1].strip().startswith(("/*", "*", "//")):
            i -= 1
        rentang.append((i, j, nama))
    return rentang


def pastikan_ekspor(isi: list[str]) -> None:
    for i, b in enumerate(isi):
        t = b.strip()
        if not t or t.startswith(("//", "/*", "*", "*/")):
            continue
        if t.startswith("export"):
            return
        if re.match(r"(function|const|let|var|type|interface|enum|class)\b", t):
            isi[i] = "export " + b.lstrip()
        return


def main() -> int:
    teks = BERKAS.read_text(encoding="utf-8")
    baris = teks.split("\n")
    rentang = blok_deklarasi(baris)

    def potret(nama: str) -> bool:
        return (nama.startswith("get") and "Portrait" in nama) or nama in IKUT

    pindah = [(i, j, nm) for i, j, nm in rentang if potret(nm)]
    dipindah: set[int] = set()
    potongan: list[str] = []
    for i, j, nm in pindah:
        isi = baris[i:j]
        while isi and not isi[-1].strip():
            isi.pop()
        while isi and not isi[0].strip():
            isi.pop(0)
        pastikan_ekspor(isi)
        potongan.append("\n".join(isi))
        dipindah.update(range(i, j))

    isi_baru = KEPALA + "\n" + "\n\n".join(potongan) + "\n"
    TUJUAN.write_text(isi_baru, encoding="utf-8")
    nama_pindah = [nm for _, _, nm in pindah]
    print(f"  npcPortraits.ts dibuat: {len(nama_pindah)} ekspor, "
          f"{isi_baru.count(chr(10))} baris")

    # ── Berkas induk ─────────────────────────────────────────────────────
    sisa = [b for i, b in enumerate(baris) if i not in dipindah]
    bersih = []
    for b in sisa:
        if not b.strip() and bersih and not bersih[-1].strip():
            continue
        bersih.append(b)
    gabung = "\n".join(bersih)

    # Impor + ekspor ulang agar pemakai lama tetap bekerja
    gabung = (f"import {{ {', '.join(nama_pindah)} }} from './npcPortraits';\n"
              + gabung)
    gabung = gabung.rstrip() + (
        "\n\n// ── Ekspor ulang ──────────────────────────────────────────────────────\n"
        "// Pemakai lama mengimpor potret dari berkas ini, sehingga seluruhnya\n"
        "// diekspor ulang di sini dan tidak ada pemakai yang perlu diubah.\n"
        f"export {{ {', '.join(nama_pindah)} }} from './npcPortraits';\n"
    )

    BERKAS.write_text(gabung, encoding="utf-8")
    print(f"  npcSprites.ts: {len(baris)} -> {gabung.count(chr(10)) + 1} baris")
    return 0


if __name__ == "__main__":
    sys.exit(main())
