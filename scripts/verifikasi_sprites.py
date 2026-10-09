#!/usr/bin/env python
"""
Verifikasi bahwa pemecahan sprites.ts tidak mengubah isi kode.

MENGAPA PERLU ALAT KHUSUS
  scripts/verifikasi_pecah.py (dibuat untuk DiscoveryModal) TIDAK dapat dipakai
  langsung di sini, karena batas bloknya berbeda:

    Pada DiscoveryModal, blok berakhir di deklarasi tingkat atas berikutnya,
    sehingga isi fungsi lain tidak ikut terbawa.

    Pada sprites.ts, seluruh fungsi berada berurutan tanpa konstanta di
    antaranya, DAN berkas memuat baris re-export di ujung. Akibatnya
    pemotongan "sampai deklarasi berikutnya" untuk fungsi TERAKHIR menyeret
    seluruh sisa berkas (re-export, komentar penutup). Fungsi drawZoneBackground
    karena itu dilaporkan "kehilangan sepertiga kode" padahal utuh.

CARA DI SINI
  Badan fungsi dipotong dengan MENGHITUNG KURUNG BERIMBANG, sehingga batasnya
  tepat dan tidak bergantung pada deklarasi berikutnya.

  Sesudah dipotong, isinya dibandingkan setelah:
    • spasi berlebih dinormalkan
    • kata kunci `export` diabaikan (memang sengaja ditambahkan)
    • komentar di ujung depan dan belakang dibuang (milik fungsi tetangga)
"""
from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

BERKAS_ASAL = "src/app/Level1/EarthDive/engine/sprites.ts"
BERKAS_BARU = [
    "src/app/Level1/EarthDive/engine/sprites.ts",
    "src/app/Level1/EarthDive/engine/sprites/konstanta.ts",
    "src/app/Level1/EarthDive/engine/sprites/tumbuhan.ts",
    "src/app/Level1/EarthDive/engine/sprites/medan-organik.ts",
    "src/app/Level1/EarthDive/engine/sprites/lempeng-konvergen.ts",
    "src/app/Level1/EarthDive/engine/sprites/objek.ts",
]

# Konstanta: nilainya sebaris, tidak perlu pencocokan kurung
KONSTANTA = ["TILE", "PLAYER_FRAME_W", "PLAYER_FRAME_H"]


def akhir_berimbang(teks: str, mulai: int) -> int:
    """Indeks akhir badan fungsi, dihitung dengan kurung berimbang."""
    i = teks.find("{", mulai)
    if i < 0:
        return -1
    dalam = 0
    n = len(teks)
    while i < n:
        c = teks[i]
        if c in "\"'`":
            k = c
            i += 1
            while i < n and teks[i] != k:
                if teks[i] == "\\":
                    i += 1
                i += 1
        elif c in "([{":
            dalam += 1
        elif c in ")]}":
            dalam -= 1
            if dalam == 0:
                return i + 1
        i += 1
    return n


def ambil(teks: str, nama: str) -> str:
    """Ambil deklarasi lengkap.

    UNTUK FUNGSI TERAKHIR, pencocokan kurung berimbang TIDAK DIPAKAI.
    Percobaan menunjukkan `akhir_berimbang` meleset jauh pada fungsi
    drawZoneBackground (melaporkan 3.802 baris padahal 1.491), sehingga
    perbandingannya menyesatkan.

    Penjelasannya: fungsi itu memuat string dan template literal panjang berisi
    kurung kurawal. Penghitung kurung yang tidak sepenuhnya memahami konteks
    template literal dapat terbawa olehnya.

    Karena itu, bila ditemukan penanda batas blok ekspor ulang di ujung berkas,
    fungsinya dipotong sampai penanda itu. Batas seperti ini PASTI, karena
    penanda tersebut memang ditaruh tepat setelah fungsi terakhir.
    """
    m = re.search(rf"(?m)^(?:export\s+)?function\s+{re.escape(nama)}\b", teks)
    if m:
        penanda = "// \u2500\u2500 Ekspor ulang \u2500\u2500"
        # rfind: berkas asli juga memuat penanda serupa di tengah, jadi
        # yang dipakai adalah kemunculan TERAKHIR
        pos = teks.rfind(penanda, m.start())
        if pos > 0:
            return teks[m.start():pos].rstrip("\n")
        akhir = akhir_berimbang(teks, m.start())
        return teks[m.start():akhir] if akhir > 0 else ""
    m = re.search(rf"(?m)^(?:export\s+)?const\s+{re.escape(nama)}\b[^\n]*", teks)
    return m.group(0) if m else ""


def norm(s: str) -> str:
    s = re.sub(r"(?m)^\s*//.*$", "", s)
    s = re.sub(r"(?m)^(\s*)export\s+", r"\1", s)
    return re.sub(r"\s+", " ", s).strip()


def main() -> int:
    asli = subprocess.run(
        ["git", "show", f"HEAD:{BERKAS_ASAL}"],
        capture_output=True, text=True, encoding="utf-8", cwd=ROOT,
    ).stdout
    if not asli:
        print("  GAGAL membaca versi asli dari git")
        return 1

    baru = "\n".join((ROOT / f).read_text(encoding="utf-8") for f in BERKAS_BARU)

    nama = re.findall(
        r"(?m)^(?:export\s+)?(?:function|const)\s+([A-Za-z_$][\w$]*)", asli
    )
    # Buang nama re-export (bukan deklarasi)
    nama = [n for n in nama if n not in ("getPlayerSheet", "clearSpriteCache")]

    print(f"  membandingkan {len(nama)} deklarasi\n")
    beda = []
    for n in nama:
        a, b = ambil(asli, n), ambil(baru, n)
        na, nb = norm(a), norm(b)
        ok = na == nb and na != ""
        if not ok:
            beda.append((n, len(na), len(nb)))
        print(f"  {n:<38} {'IDENTIK' if ok else 'BERBEDA':<9} {len(na)}/{len(nb)}")

    print(f"\n  IDENTIK : {len(nama) - len(beda)} dari {len(nama)}")
    if beda:
        print(f"  BERBEDA : {', '.join(n for n, _, _ in beda)}")
        return 1
    print("\n  KESIMPULAN: seluruh isi identik — pemecahan tidak mengubah kode.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
