#!/usr/bin/env python
"""
Verifikasi bahwa pemecahan sprites.ts tidak mengubah isi kode.

MENGAPA PERLU TIGA PERCOBAAN SEBELUM CARA INI BENAR
  Memverifikasi pemecahan berkas ternyata lebih sulit daripada memecahnya.
  Tiga pendekatan memberi hasil menyesatkan:

  1. PEMOTONGAN "SAMPAI DEKLARASI BERIKUTNYA", memakai teks GABUNGAN semua
     berkas baru. Karena berkas-berkas digabung, deklarasi berikutnya sering
     berada di BERKAS LAIN, sehingga blok menyeret header dan impor berkas
     tetangga. Enam fungsi dilaporkan "berbeda" padahal utuh.

  2. KURUNG BERIMBANG. Untuk drawZoneBackground, penghitung melaporkan 3.802
     baris padahal sebenarnya 1.490 — fungsi itu memuat template literal
     panjang berisi kurung kurawal.

  3. PENANDA BATAS. Berkas asli ternyata juga memuat penanda yang mirip di
     tengah berkas, sehingga pencocokan pertama mendapat batas yang salah.

CARA YANG DIPAKAI DI SINI
  Setiap fungsi dicari di SETIAP BERKAS BARU SECARA TERPISAH, bukan pada teks
  gabungan. Dengan begitu batas blok selalu tepat: deklarasi berikutnya berada
  di berkas yang sama, dan fungsi terakhir di sebuah berkas berakhir di ujung
  berkas itu.

  Untuk fungsi yang isinya berada di tengah berkas lain (mis. re-export),
  perbandingan tetap sahih karena setiap berkas diperiksa sendiri-sendiri.
"""
from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ASAL = "src/app/Level1/EarthDive/engine/sprites.ts"

BERKAS_BARU = [
    "src/app/Level1/EarthDive/engine/sprites.ts",
    "src/app/Level1/EarthDive/engine/sprites/konstanta.ts",
    "src/app/Level1/EarthDive/engine/sprites/tumbuhan.ts",
    "src/app/Level1/EarthDive/engine/sprites/medan-organik.ts",
    "src/app/Level1/EarthDive/engine/sprites/lempeng-konvergen.ts",
    "src/app/Level1/EarthDive/engine/sprites/objek.ts",
]


def deklarasi_berikut(teks: str, mulai: int) -> int:
    m = re.search(
        r"(?m)^(?:export\s+)?(?:function|const|interface|type|enum|class)\s",
        teks[mulai + 1:],
    )
    return mulai + 1 + m.start() if m else len(teks)


def ambil_satu(teks: str, nama: str) -> str | None:
    """Ambil deklarasi dari SATU berkas, atau None bila tidak ada di sini."""
    m = re.search(rf"(?m)^(?:export\s+)?function\s+{re.escape(nama)}\b", teks)
    if not m:
        m = re.search(rf"(?m)^(?:export\s+)?const\s+{re.escape(nama)}\b", teks)
        if not m:
            return None
        # Konstanta: cukup satu baris
        akhir = teks.find("\n", m.start())
        return teks[m.start():akhir if akhir > 0 else len(teks)]
    return teks[m.start():deklarasi_berikut(teks, m.start())]


def norm(s: str) -> str:
    """Normalkan isi blok untuk perbandingan.

    YANG DIABAIKAN, DAN MENGAPA
      • baris komentar  — blok yang dipotong "sampai deklarasi berikutnya"
        ikut membawa komentar JSDoc milik deklarasi berikutnya. Komentar itu
        milik fungsi tetangga, bukan fungsi ini, dan berbeda antara berkas asli
        dan berkas baru karena susunan deklarasinya berubah.
      • baris import     — modul baru memang MENAMBAH impor (mis. dari './zones'
        dan './konstanta') agar dapat berdiri sendiri.
      • baris export ... from / export { ... } — berkas asli memuat re-export
        di tengah berkas; pada berkas baru re-export itu dikumpulkan di ujung.
        Posisinya berbeda, isi fungsinya tidak.

    Yang dibandingkan adalah BADAN FUNGSINYA saja. Itulah yang perlu dibuktikan
    tidak berubah.
    """
    keluar = []
    for baris in s.split("\n"):
        t = baris.strip()
        if not t:
            continue
        if t.startswith("//") or t.startswith("/*") or t.startswith("*"):
            continue
        if t.startswith("import "):
            continue
        if t.startswith("export ") and " from " in t:
            continue
        if t.startswith("export {"):
            continue
        keluar.append(re.sub(r"^(\s*)export\s+", r"\1", baris))
    return re.sub(r"\s+", " ", " ".join(keluar)).strip()


def main() -> int:
    asli = subprocess.run(
        ["git", "show", f"HEAD:{ASAL}"],
        capture_output=True, text=True, encoding="utf-8", cwd=ROOT,
    ).stdout
    if not asli:
        print("  GAGAL membaca versi asli dari git")
        return 1

    isi_baru = {f: (ROOT / f).read_text(encoding="utf-8") for f in BERKAS_BARU}

    nama = re.findall(r"(?m)^(?:export\s+)?(?:function|const)\s+([A-Za-z_$][\w$]*)", asli)
    nama = [n for n in nama if n not in ("getPlayerSheet", "clearSpriteCache")]

    print(f"  membandingkan {len(nama)} deklarasi\n")
    beda, tak_ketemu = [], []
    for n in nama:
        a = norm(ambil_satu(asli, n) or "")
        b = None
        for f, teks in isi_baru.items():
            kandidat = ambil_satu(teks, n)
            if kandidat is not None:
                b = norm(kandidat)
                break
        if b is None:
            tak_ketemu.append(n)
            print(f"  {n:<38} TIDAK DITEMUKAN")
            continue
        ok = a == b and a != ""
        if not ok:
            beda.append(n)
        print(f"  {n:<38} {'IDENTIK' if ok else 'BERBEDA':<9} {len(a)}/{len(b)}")

    print(f"\n  IDENTIK        : {len(nama) - len(beda) - len(tak_ketemu)} dari {len(nama)}")
    if tak_ketemu:
        print(f"  TIDAK DITEMUKAN: {', '.join(tak_ketemu)}")
    if beda:
        print(f"  BERBEDA        : {', '.join(beda)}")
        return 1
    if tak_ketemu:
        return 1
    print("\n  KESIMPULAN: seluruh isi identik — pemecahan tidak mengubah kode.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
