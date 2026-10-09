#!/usr/bin/env python
"""
Pindahkan data spasial Merapi3DScene ke modul tersendiri.

MENGAPA BERKAS INI HANYA DIPECAH SEBAGIAN, TIDAK SEPERTI DiscoveryModal
  DiscoveryModal berisi 20 komponen mandiri, sehingga mudah dipecah menjadi
  beberapa modul. Merapi3DScene berbeda: setelah 210 baris data di bagian atas,
  sisanya adalah SATU fungsi komponen sepanjang ~5.900 baris yang mengelola
  adegan Three.js.

  Fungsi itu memakai lebih dari 40 `useRef` yang saling terkait — kamera,
  renderer, mesh, material, lampu, dan jalur lava. Memecahnya menjadi fungsi
  terpisah mengharuskan puluhan nilai itu diteruskan sebagai parameter, dan
  setiap kekeliruan di situ menghasilkan adegan yang salah tanpa error
  kompilasi apa pun.

  Lebih penting lagi: hasil 3D TIDAK DAPAT DIVERIFIKASI TANPA PENGLIHATAN.
  Typecheck dan test tidak akan menangkap gunung yang menghilang atau jalur
  lava yang salah tempat. Karena itu pemecahan besar pada fungsi ini sengaja
  TIDAK dilakukan tanpa pemeriksaan visual.

YANG DIKERJAKAN DI SINI
  Memindahkan 210 baris DATA MURNI ke merapi3DData.ts:
    - koordinat puncak (PEAK_X, PEAK_Z)
    - enam jalur aliran lava (LAVA_STREAM_*)
    - enam jalur lava efusif (EFFUSIVE_LAVA_*)
    - jaringan jalan: interface RoadNode3D, ROAD_NODES_3D, dan turunannya
      (NODE_MAP, ROAD_EDGES)

  Ini aman karena isinya hanya angka dan struktur data — tidak ada logika,
  tidak ada state, tidak ada efek samping. Pemindahannya tidak dapat mengubah
  perilaku adegan.

MANFAAT
  Konstanta koordinat dipakai puluhan kali di dalam komponen (PEAK_X 32 kali,
  PEAK_Z 29 kali). Memisahkannya membuat koordinat peta mudah dicari dan
  diubah tanpa menggulir melewati ribuan baris kode Three.js.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ASAL = ROOT / "src/app/EvacuationGame/Merapi3DScene.tsx"
TUJUAN = ROOT / "src/app/EvacuationGame/merapi3DData.ts"

# Batas blok data: dari deklarasi pertama sampai tepat sebelum komponen
AWAL_POLA = r"(?m)^const PEAK_X = "
AKHIR_POLA = r"(?m)^export default function Merapi3DScene"

# Nama yang perlu diimpor kembali oleh komponen
PERLU_IMPOR = [
    "PEAK_X", "PEAK_Z",
    "LAVA_STREAM_GENDOL", "LAVA_STREAM_KUNING", "LAVA_STREAM_BOYONG",
    "LAVA_STREAM_KRASAK_WEST", "LAVA_STREAM_RIDGE_MID", "LAVA_STREAM_WORO_EAST",
    "EFFUSIVE_LAVA_EAST_GENDOL", "EFFUSIVE_LAVA_EAST_WORO",
    "EFFUSIVE_LAVA_SOUTH_KUNING_MAIN", "EFFUSIVE_LAVA_SOUTH_KUNING_BRANCH",
    "EFFUSIVE_LAVA_WEST_BOYONG_MAIN", "EFFUSIVE_LAVA_WEST_BOYONG_BRANCH",
    "ROAD_NODES_3D", "NODE_MAP", "ROAD_EDGES",
]
PERLU_TIPE = ["RoadNode3D"]

KEPALA = '''/**
 * Data spasial untuk adegan 3D Merapi.
 *
 * Berkas ini memuat koordinat peta: puncak gunung, jalur aliran lava, dan
 * jaringan jalan evakuasi. Dipisahkan dari Merapi3DScene.tsx karena isinya
 * murni data — tidak ada logika, state, maupun efek samping.
 *
 * Koordinat di bawah dipakai puluhan kali di dalam komponen (PEAK_X 32 kali,
 * PEAK_Z 29 kali). Dengan dipisahkan, koordinat peta dapat dicari dan diubah
 * tanpa menggulir melewati ribuan baris kode Three.js.
 *
 * Sistem koordinat: x positif ke timur, z positif ke selatan, satuan sama
 * dengan satuan adegan Three.js.
 */
'''


def main() -> int:
    teks = ASAL.read_text(encoding="utf-8")

    m_awal = re.search(AWAL_POLA, teks)
    m_akhir = re.search(AKHIR_POLA, teks)
    if not m_awal or not m_akhir:
        print("  GAGAL menemukan batas blok data")
        return 1

    blok = teks[m_awal.start():m_akhir.start()].rstrip() + "\n"

    # Ekspor setiap deklarasi agar dapat diimpor
    blok = re.sub(
        r"(?m)^(?=(?:const|interface|type|function)\s)",
        "export ",
        blok,
    )
    # Rapikan bila ada 'export export'
    blok = blok.replace("export export ", "export ")

    isi = KEPALA + "\n" + blok
    TUJUAN.write_text(isi, encoding="utf-8")
    n_baris = isi.count("\n")
    print(f"  dibuat: merapi3DData.ts ({n_baris} baris)")

    # Hapus blok dari berkas asal
    sisa = teks[:m_awal.start()] + teks[m_akhir.start():]

    # Tambahkan impor di berkas asal
    impor = (
        f"import type {{ {', '.join(PERLU_TIPE)} }} from './merapi3DData';\n"
        f"import {{\n  " + ",\n  ".join(PERLU_IMPOR) + ",\n} from './merapi3DData';\n"
    )
    m_impor = list(re.finditer(r"(?m)^import .*;$", sisa))
    if m_impor:
        pos = m_impor[-1].end()
        sisa = sisa[:pos] + "\n" + impor + sisa[pos:]

    ASAL.write_text(sisa, encoding="utf-8")
    print(f"  Merapi3DScene.tsx: {teks.count(chr(10)) + 1} -> {sisa.count(chr(10)) + 1} baris")
    return 0


if __name__ == "__main__":
    sys.exit(main())
