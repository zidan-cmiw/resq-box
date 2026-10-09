#!/usr/bin/env python
"""
Verifikasi bahwa pemecahan DiscoveryModal tidak mengubah isi kode.

MENGAPA VERIFIKASI INI PERLU
  Pemecahan berkas 7.000 baris tidak dapat dipercaya hanya karena typecheck
  dan build lolos — kompilasi yang berhasil tidak membuktikan bahwa gambar
  yang dihasilkan masih sama. Karena itu isi setiap fungsi dibandingkan
  dengan versi asli di git.

DUA KESALAHAN ALAT INI SEBELUM SAMPAI BENAR
  1. Batas blok diambil dari deklarasi tingkat atas berikutnya. Pada berkas
     asli, blok berhenti TEPAT sebelum komentar fungsi berikutnya; pada berkas
     baru komentar itu ikut terbawa. Hasilnya 17 dari 18 fungsi dilaporkan
     "berbeda" — padahal selisihnya hanya komentar.

  2. Pemotongan badan fungsi memakai pola sampai `^}` pertama. Untuk komponen
     berbentuk `const Nama = ({ ... }) => { ... }`, `^}` pertama adalah akhir
     daftar parameter, bukan akhir fungsi. Akibatnya hanya sepotong kecil
     fungsi yang dibandingkan (3 baris, bukan 486).

CARA YANG BENAR (DIPAKAI DI SINI)
  Badan fungsi dipotong dengan MENGHITUNG KURUNG BERIMBANG, sehingga batasnya
  tepat. Perbandingan dilakukan setelah:
    • spasi berlebih dinormalkan
    • kata kunci `export` diabaikan (memang sengaja ditambahkan)
    • komentar di ujung blok dibuang (milik fungsi berikutnya)
"""
from __future__ import annotations

import difflib
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ASAL = "src/app/Level2/DiscoveryModal.tsx"

BERKAS_BARU = [
    "src/app/Level2/DiscoveryModal.tsx",
    "src/app/Level2/ilustrasi/lempeng.tsx",
    "src/app/Level2/ilustrasi/gempa.tsx",
    "src/app/Level2/ilustrasi/gunung-api.tsx",
]


def potong_berimbang(teks: str, awal: int) -> int:
    """Indeks akhir badan fungsi, dihitung dengan kurung berimbang."""
    i = teks.find("{", awal)
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
    """Ambil satu deklarasi lengkap (function atau const arrow) berdasarkan nama."""
    for m in re.finditer(
        rf"(?m)^(?:export\s+)?(?:function\s+{re.escape(nama)}\b|const\s+{re.escape(nama)}\b)",
        teks,
    ):
        akhir = potong_berimbang(teks, m.start())
        if akhir > 0:
            return teks[m.start():akhir]
    return ""


def norm(s: str) -> str:
    """Normalkan untuk perbandingan: buang export, rapikan spasi."""
    s = re.sub(r"(?m)^(\s*)export\s+", r"\1", s)
    s = re.sub(r"(?m)^\s*//.*$", "", s)
    return re.sub(r"\s+", " ", s).strip()


def main() -> int:
    asli = subprocess.run(
        ["git", "show", f"HEAD:{ASAL}"],
        capture_output=True, text=True, encoding="utf-8", cwd=ROOT,
    ).stdout
    if not asli:
        print("  GAGAL membaca versi asli dari git")
        return 1

    baru = "\n".join((ROOT / f).read_text(encoding="utf-8") for f in BERKAS_BARU)

    nama = [n for n in re.findall(
        r"(?m)^(?:export\s+)?(?:function|const)\s+([A-Za-z_$][\w$]*)", asli)
        if n not in ("DiscoveryModal", "renderIllustration")]

    print(f"  membandingkan {len(nama)} fungsi/konstanta\n")
    print(f"  {'nama':<46} {'hasil':<10} {'panjang':<14}")
    beda = []
    for n in nama:
        a, b = ambil(asli, n), ambil(baru, n)
        na, nb = norm(a), norm(b)
        sama = na == nb and na != ""
        if not sama:
            beda.append((n, a, b))
        print(f"  {n:<44} {'IDENTIK' if sama else 'BERBEDA':<10} {len(na)}/{len(nb)}")

    print(f"\n  IDENTIK : {len(nama) - len(beda)} dari {len(nama)}")
    if beda:
        n, a, b = beda[0]
        print(f"\n  contoh diff pada {n}:")
        for x in list(difflib.unified_diff(
                norm(a).split(" "), norm(b).split(" "), "asli", "baru", n=3, lineterm=""))[:24]:
            print(f"    {x[:110]}")
        return 1
    print("\n  KESIMPULAN: seluruh isi fungsi identik — pemecahan tidak mengubah kode.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
