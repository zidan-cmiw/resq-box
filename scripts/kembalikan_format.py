#!/usr/bin/env python
"""
Kembalikan format yang tidak sengaja berubah saat pemecahan DiscoveryModal.

MASALAH
  Skrip pemecahan memakai dua penggantian untuk merapikan daftar impor:

      re.sub(r",\\s*\\}", " }", gabung)
      re.sub(r"\\{\\s*,", "{ ", gabung)

  Keduanya bekerja pada SELURUH berkas, bukan hanya baris impor. Akibatnya
  koma di akhir beberapa konstruksi lain ikut terhapus:

      onClose,          ->  onClose }
      onSimulate,       ->  onSimulate }
      transition: '…',  ->  transition: '…' }}
      }}

  Secara sintaks kode itu tetap sah, tetapi perubahannya tidak perlu dan
  membuat diff sulit ditinjau — seolah ada logika yang berubah padahal tidak.

  Prinsipnya: pemecahan berkas seharusnya HANYA memindahkan kode. Setiap
  perubahan format di luar pemindahan adalah gangguan yang menyulitkan
  peninjauan, jadi harus dikembalikan.

PERBAIKAN
  Mengembalikan koma yang hilang pada tiga konstruksi:
    1. Destrukturisasi props:  ``onClose }: {`` -> ``onClose,\n}: {``
    2. Objek gaya JSX:         ``,' }}`` -> ``,`` + newline + ``}}``
    3. Destrukturisasi dalam argumen fungsi
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BERKAS = ROOT / "src/app/Level2/DiscoveryModal.tsx"


def main() -> int:
    teks = BERKAS.read_text(encoding="utf-8")
    asli = teks
    n = 0

    # 1. Destrukturisasi props:  `onClose }: DiscoveryModalProps) {`
    #    ->                      `onClose,\n}: DiscoveryModalProps) {`
    teks, k = re.subn(
        r"(\n\s*)([A-Za-z_$][\w$]*) \}: (DiscoveryModalProps\) \{|\{)",
        r"\1\2,\n\1}: \3",
        teks,
    )
    n += k

    # 2. Objek gaya JSX satu baris:  `transition: '…' }}` -> dua baris
    teks, k = re.subn(
        r"(\n\s*)([a-zA-Z-]+: [^\n]*?[^,\s]) \}\}",
        r"\1\2,\n\1}}",
        teks,
    )
    n += k

    # 3. Objek gaya JSX dengan indentasi dalam:  `'…' }}` pada baris sendiri
    teks, k = re.subn(
        r"(\n\s+)([a-zA-Z-]+: [^\n]*?[^,\s]) \}\}\n",
        r"\1\2,\n\1}}\n",
        teks,
    )
    n += k

    # 4. Rapikan baris kosong yang tersisa dari penggantian di atas.
    #    Tanpa ini, hasilnya berisi baris kosong di tengah destrukturisasi
    #    dan di dalam objek gaya — tidak salah, tetapi berantakan.
    teks = re.sub(r"\n\n(\s*\}: )", r"\n\1", teks)
    teks = re.sub(r"\n\n(\s*\}\})", r"\n\1", teks)

    if teks != asli:
        BERKAS.write_text(teks, encoding="utf-8")
    print(f"  {n} format dikembalikan")
    return 0


if __name__ == "__main__":
    sys.exit(main())
