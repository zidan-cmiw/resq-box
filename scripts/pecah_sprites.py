#!/usr/bin/env python
"""
Pecah src/app/Level1/EarthDive/engine/sprites.ts (5.625 baris) — versi lengkap.

MENGAPA DIPECAH
  Berkas ini memuat 28 deklarasi dengan tiga kelompok berbeda sifatnya: medan
  organik bergaya Terraria, geometri lempeng dan mode konvergen, serta gambar
  objek kecil. Mencari satu fungsi berarti menggulir melewati ribuan baris kode
  kelompok lain.

CARA PEMECAHAN
  Blok dipindahkan UTUH secara mekanis, bukan ditulis ulang. Berkas induk
  mengimpor ulang dan MENGEKSPOR ULANG seluruhnya, sehingga pemakai lama
  (renderer.ts, player.ts, gameEngine.ts) tidak perlu diubah.

TIGA HAL YANG SEMPAT SALAH, DAN KENAPA
  1. IMPOR DEPENDENSI TIDAK IKUT.
     Seluruh fungsi memakai `ZoneConfig`, `getConvergentTerrainElevation`,
     `MAP_WIDTH_PX`, dan lain-lain dari './zones'. Memindahkan blok tanpa
     menyertakan impor itu menghasilkan "Cannot find name 'ZoneConfig'".

  2. BERKAS ASAL MEMUAT RE-EXPORT, BUKAN HANYA DEKLARASI.
     Baris `export { getPlayerSheet } from '../../../../utils/studentAvatarSheet';`
     berbentuk re-export. Skrip yang menambahkan kata kunci `export` ke setiap
     blok mengubahnya menjadi `export export { ... }`, sehingga renderer.ts
     kehilangan `getPlayerSheet`.

  3. JALUR IMPOR RELATIF BERUBAH KEDALAMAN.
     Modul baru berada satu tingkat lebih dalam (sprites/…), sehingga jalur
     seperti '../../../../utils/studentAvatarSheet' harus menjadi
     '../../../../../utils/studentAvatarSheet'.

KEPUTUSAN TATA LETAK
  drawPineTree, drawOakTree, dan drawShrub dipindahkan ke modul TUMBUHAN
  tersendiri. Alasannya: fungsi mode konvergen memanggil drawPineTree,
  sedangkan drawPineTree satu kelompok dengan medan organik. Bila keduanya
  dipisah begitu saja, modul konvergen harus mengimpor dari modul organik dan
  timbul ketergantungan silang antar dua modul besar.

  TILE diletakkan di modul KONSTANTA karena dipakai hampir semua modul.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BERKAS = ROOT / "src/app/Level1/EarthDive/engine/sprites.ts"
DIR = ROOT / "src/app/Level1/EarthDive/engine"

TUJUAN: dict[str, str] = {
    "TILE": "konstanta",
    "PLAYER_FRAME_W": "konstanta",
    "PLAYER_FRAME_H": "konstanta",
    "drawGroundTile": "konstanta",
    "drawWallTile": "konstanta",
    "drawPineTree": "tumbuhan",
    "drawOakTree": "tumbuhan",
    "drawShrub": "tumbuhan",
    "drawPixelFossil": "medan-organik",
    "renderZoneStructures": "medan-organik",
    "renderOrganicZoneTerrain": "medan-organik",
    "renderOrganicDivergentTerrain": "medan-organik",
    "getOceanicSubductingSlabTopY": "lempeng-konvergen",
    "getOceanicSlabSlope": "lempeng-konvergen",
    "getConvergentSeafloorProfile": "lempeng-konvergen",
    "drawPlateVectorArrow": "lempeng-konvergen",
    "renderConvergentLandMode": "lempeng-konvergen",
    "renderConvergentOceanMode": "lempeng-konvergen",
    "renderOrganicConvergentTerrain": "lempeng-konvergen",
    "renderOrganicTransformTerrain": "lempeng-konvergen",
    "drawPortal": "objek",
    "drawCrystal": "objek",
    "drawDiscoveryPoint": "objek",
    "drawInfoSign": "objek",
    "drawChallengeGate": "objek",
    "drawResearchBoat": "objek",
    "drawZoneDecorations": "objek",
}

JUDUL = {
    "konstanta": "Konstanta Ukuran dan Ubin Dasar",
    "tumbuhan": "Tumbuhan",
    "medan-organik": "Medan Organik (gaya Terraria)",
    "lempeng-konvergen": "Geometri Lempeng dan Mode Konvergen",
    "objek": "Objek dan Dekorasi",
}

# Simbol dari './zones' yang mungkin diperlukan modul baru
DARI_ZONES_TIPE = ["ZoneConfig", "DivergentFish"]
DARI_ZONES_NILAI = [
    "MAP_WIDTH_PX", "getDivergentTerrainElevation", "getConvergentTerrainElevation",
    "getSubductingPlateTopY", "getDivergentMantleY", "getConvergentMantleY",
]

KEPALA = """/**
 * {judul} — bagian dari mesin gambar Earth Dive.
 *
 * Berkas ini dipecah dari sprites.ts (5.625 baris) agar tiap kelompok dapat
 * dicari tanpa menggulir melewati ribuan baris kode kelompok lain. Isi
 * fungsinya dipindahkan UTUH, tidak ditulis ulang.
 */
"""


def bk(nama: str) -> str:
    """Pola batas kata yang benar untuk identifier JavaScript."""
    return rf"(?<![A-Za-z0-9_$]){re.escape(nama)}(?![A-Za-z0-9_$])"


def deklarasi(baris: list[str]) -> tuple[list[tuple[int, int, str]], list[str]]:
    """Rentang deklarasi tingkat atas, dan daftar baris re-export."""
    titik: list[tuple[int, str]] = []
    reekspor: list[str] = []
    for i, b in enumerate(baris):
        if re.match(r"^export\s+\{", b) and " from " in b:
            reekspor.append(b)
            continue
        m = re.match(
            r"^(?:export\s+)?(?:default\s+)?(?:function|const|interface|type|enum|class)\s+"
            r"([A-Za-z_$][\w$]*)",
            b,
        )
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
    return rentang, reekspor


def impor_untuk(tubuh: str, tujuan: str, lagi: bool) -> list[str]:
    """Impor yang diperlukan modul: konstanta, zones, dan sesama modul baru."""
    baris: list[str] = []
    if tujuan != "konstanta" and re.search(bk("TILE"), tubuh):
        baris.append("import { TILE } from './konstanta';")

    tipe = [t for t in DARI_ZONES_TIPE if re.search(bk(t), tubuh)]
    nilai = [v for v in DARI_ZONES_NILAI if re.search(bk(v), tubuh)]
    if tipe:
        baris.append(f"import type {{ {', '.join(tipe)} }} from '../zones';")
    if nilai:
        baris.append(f"import {{ {', '.join(nilai)} }} from '../zones';")

    # Impor dari modul baru lain (mis. mode konvergen memakai drawPineTree)
    for nama, asal in TUJUAN.items():
        if asal == tujuan or asal == "konstanta":
            continue
        polaI = rf"import \{{[^}}]*{bk(nama)}[^}}]*\}} from '\./{re.escape(asal)}';"
        if re.search(polaI, tubuh):
            continue
        # hanya tambahkan bila dipanggil dan belum ada impornya
        if re.search(bk(nama), tubuh) and f"from './{asal}'" not in tubuh:
            baris.append(f"import {{ {nama} }} from './{asal}';")
    # Buang duplikat
    unik: list[str] = []
    for b in baris:
        if b not in unik:
            unik.append(b)
    return unik


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
    rentang, reekspor = deklarasi(baris)

    kelompok: dict[str, list[tuple[int, int, str]]] = {}
    for mulai, akhir, nama in rentang:
        if nama in TUJUAN:
            kelompok.setdefault(TUJUAN[nama], []).append((mulai, akhir, nama))

    dipindah: set[int] = set()
    info: dict[str, list[str]] = {}

    # Nama semua modul baru, untuk resolusi impor antar modul
    sudah_ada: set[str] = set()

    for tujuan in ["konstanta", "tumbuhan", "medan-organik", "lempeng-konvergen", "objek"]:
        blok = kelompok.get(tujuan, [])
        if not blok:
            continue
        path = DIR / f"sprites/{tujuan}.ts"
        path.parent.mkdir(parents=True, exist_ok=True)

        potongan = []
        for mulai, akhir, nama in sorted(blok):
            isi = baris[mulai:akhir]
            while isi and not isi[-1].strip():
                isi.pop()
            while isi and not isi[0].strip():
                isi.pop(0)
            pastikan_ekspor(isi)
            potongan.append("\n".join(isi))
            dipindah.update(range(mulai, akhir))
            sudah_ada.add(nama)

        tubuh = "\n\n".join(potongan)
        info[tujuan] = [n for _, _, n in sorted(blok)]
        impor = impor_untuk(tubuh, tujuan, bool(sudah_ada))
        kepala = KEPALA.format(judul=JUDUL.get(tujuan, tujuan))
        isi_berkas = kepala + "\n" + "\n".join(impor) + "\n\n" + tubuh + "\n"
        path.write_text(isi_berkas, encoding="utf-8")
        print(f"  sprites/{tujuan}.ts  ({len(blok)} ekspor, "
              f"{isi_berkas.count(chr(10))} baris, {len(impor)} impor)")

    # ── Berkas induk ─────────────────────────────────────────────────────
    sisa = [b for i, b in enumerate(baris) if i not in dipindah]
    bersih = []
    for b in sisa:
        if not b.strip() and bersih and not bersih[-1].strip():
            continue
        bersih.append(b)
    gabung = "\n".join(bersih)

    # Perbaiki jalur impor yang berubah kedalaman (satu tingkat lebih dalam)
    # hanya untuk modul baru; berkas induk tetap di kedalaman semula.
    impor_baris, ekspor_baris = [], []
    for tujuan in ["konstanta", "tumbuhan", "medan-organik", "lempeng-konvergen", "objek"]:
        if tujuan not in kelompok:
            continue
        semua = info[tujuan]
        modul = f"./sprites/{tujuan}"
        dipakai = [n for n in semua if re.search(bk(n), gabung)]
        if dipakai:
            impor_baris.append(f"import {{ {', '.join(dipakai)} }} from '{modul}';")
        ekspor_baris.append(f"export {{ {', '.join(semua)} }} from '{modul}';")

    if impor_baris:
        gabung = "\n".join(impor_baris) + "\n" + gabung

    gabung = gabung.rstrip() + (
        "\n\n// ── Ekspor ulang ──────────────────────────────────────────────────────\n"
        "// Pemakai lama (renderer.ts, player.ts, gameEngine.ts) mengimpor dari\n"
        "// berkas ini, sehingga seluruh bagian yang dipindahkan diekspor ulang di\n"
        "// sini. Dengan begitu tidak ada pemakai yang perlu diubah.\n"
        + "\n".join(ekspor_baris)
        + ("\n" + "\n".join(reekspor) if reekspor else "")
        + "\n"
    )

    BERKAS.write_text(gabung, encoding="utf-8")
    print(f"\n  sprites.ts: {len(baris)} -> {gabung.count(chr(10)) + 1} baris")
    print(f"  {len(reekspor)} baris re-export asli dipertahankan")
    return 0


if __name__ == "__main__":
    sys.exit(main())
