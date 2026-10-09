#!/usr/bin/env python
"""
Perbaiki tiga hal setelah pemecahan sprites.ts.

MASALAH
  1. RE-EXPORT ASLI IKUT TERBAWA KE DALAM BLOK
     Baris
         export { getPlayerSheet } from '../../../../utils/studentAvatarSheet';
         export { clearSpriteCache } from '../../../../utils/studentAvatarSheet';
     berada di antara deklarasi TILE/PLAYER_FRAME dan drawPixelFossil, sehingga
     ikut terambil sebagai bagian blok `konstanta`.

     Akibatnya modul baru itu memakai jalur impor berkas induk
     ('../../../../utils/...'), padahal modul baru berada satu tingkat LEBIH
     DALAM, sehingga jalurnya seharusnya lima tingkat. Selain itu re-export
     itu juga diduplikasi di berkas induk.

  2. IMPOR ZONES TIDAK TERPAKAI DI BERKAS INDUK
     Setelah fungsi yang memakai `ZoneConfig` dan fungsi elevasi dipindahkan,
     baris impor di berkas induk menjadi tidak terpakai (TS6192).

  3. BARIS KOMENTAR MILIK FUNGSI BERIKUTNYA TERBAWA
     Komentar "Menggambar fosil purba…" ikut ke blok konstanta, padahal
     komentar itu menjelaskan drawPixelFossil yang ada di modul medan-organik.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ENGINE = ROOT / "src/app/Level1/EarthDive/engine"
SPRITES = ENGINE / "sprites.ts"
KONST = ENGINE / "sprites/konstanta.ts"

# Jalur lama (kedalaman berkas induk) -> jalur baru (satu tingkat lebih dalam)
JALUR_LAMA = "../../../../utils/studentAvatarSheet"

RE_EXPORT = [
    "export { getPlayerSheet } from '../../../../utils/studentAvatarSheet';",
    "export { clearSpriteCache } from '../../../../utils/studentAvatarSheet';",
]


def main() -> int:
    k = KONST.read_text(encoding="utf-8")
    asli_k = k

    # 1. Buang re-export dari modul baru (dikembalikan ke berkas induk)
    for baris in RE_EXPORT:
        k = k.replace(baris + "\n", "")
        k = k.replace(baris, "")
    # Perbaiki jalur bila masih ada sisa re-export
    k = k.replace(JALUR_LAMA, "../../../../../utils/studentAvatarSheet")

    # 3. Buang komentar milik fungsi yang tidak ada di modul ini
    k = re.sub(
        r"\n/\*\*\n \* Menggambar fosil purba.*?\*/\n",
        "\n",
        k,
        flags=re.S,
    )
    # Rapikan baris kosong beruntun
    k = re.sub(r"\n{3,}", "\n\n", k)
    if k != asli_k:
        KONST.write_text(k, encoding="utf-8")
        print("  konstanta.ts: re-export dipindahkan, komentar asing dibuang, jalur diperbaiki")

    # 2. Berkas induk: pastikan re-export ada, dan buang impor zones yang tak terpakai
    s = SPRITES.read_text(encoding="utf-8")
    asli_s = s

    if "getPlayerSheet" not in s:
        anchor = "// ── Ekspor ulang ──"
        if anchor in s:
            i = s.index(anchor)
            akhir_baris = s.index("\n", i) + 1
            # Sisipkan setelah baris judul blok ekspor ulang
            blok = "\n".join(RE_EXPORT) + "\n"
            s = s[:akhir_baris] + blok + s[akhir_baris:]
            print("  sprites.ts: re-export getPlayerSheet dan clearSpriteCache dikembalikan")

    # Buang impor yang isinya tidak dipakai lagi
    def buang_impor(teks: str, modul: str) -> str:
        pola = re.compile(
            rf"^import\s+(?:type\s+)?\{{([^}}]*)\}}\s+from\s+'{re.escape(modul)}';\n",
            re.M,
        )
        for m in list(pola.finditer(teks)):
            nama = [x.strip() for x in m.group(1).split(",") if x.strip()]
            sisa = [x for x in nama if re.search(rf"(?<![A-Za-z0-9_$]){re.escape(x)}(?![A-Za-z0-9_$])",
                                                 teks.replace(m.group(0), ""))]
            if not sisa:
                teks = teks.replace(m.group(0), "")
            elif len(sisa) != len(nama):
                baru = f"import {{ {', '.join(sisa)} }} from '{modul}';\n"
                teks = teks.replace(m.group(0), baru)
        return teks

    s = buang_impor(s, "./zones")
    # Buang impor modul baru yang isinya tidak dipakai (mis. medan-organik)
    for tujuan in ["konstanta", "tumbuhan", "medan-organik", "lempeng-konvergen", "objek"]:
        s = buang_impor(s, f"./sprites/{tujuan}")

    s = re.sub(r"\n{3,}", "\n\n", s)

    # 4. Kembalikan kurung penutup drawZoneBackground yang hilang.
    #
    # BUG YANG DIPERBAIKI DI SINI
    #   Fungsi drawZoneBackground adalah fungsi tingkat atas TERAKHIR yang
    #   tetap di berkas induk. Pada berkas asli ia ditutup oleh satu baris `}`
    #   tepat sebelum komentar pembatas fungsi berikutnya. Skrip pemecahan
    #   membuang baris itu, sehingga fungsi tidak pernah tertutup.
    #
    #   Akibatnya sangat menyesatkan: berkas tetap LOLOS typecheck dan build,
    #   karena TypeScript membaca sisa berkas (termasuk baris re-export) sebagai
    #   BAGIAN DARI fungsi tersebut. Tanpa pemeriksaan kurung berimbang,
    #   kesalahan ini tidak akan ketahuan.
    penanda = "// ── Ekspor ulang ──"
    if penanda in s:
        i = s.index(penanda)
        sebelum = s[:i].rstrip("\n")
        # Hitung keseimbangan kurung dari awal fungsi terakhir
        m = None
        for m2 in re.finditer(r"(?m)^(?:export\s+)?function\s+\w+", s[:i]):
            m = m2
        if m is not None:
            dalam = 0
            for j in range(s.find("{", m.start()), i):
                if s[j] == "{":
                    dalam += 1
                elif s[j] == "}":
                    dalam -= 1
            if dalam > 0:
                s = sebelum + ("\n}" * dalam) + "\n\n" + s[i:]
                print(f"  sprites.ts: {dalam} kurung penutup dikembalikan")

    if s != asli_s:
        SPRITES.write_text(s, encoding="utf-8")
        print("  sprites.ts: impor tak terpakai dibuang")
    return 0


if __name__ == "__main__":
    sys.exit(main())
