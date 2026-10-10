#!/usr/bin/env python
"""
Periksa apakah setiap `targetSelector` pada panduan Resqy benar-benar ada di DOM.

MENGAPA PERLU
  Panduan Resqy menyorot elemen berdasarkan `targetSelector` (mis. #tour-login-inputs).
  Bila elemen itu sudah dihapus atau namanya berubah, langkah panduan akan
  menyorot tempat yang salah atau tidak menyorot apa pun.

  Hal itu NYATA terjadi sebelumnya: langkah "Uji Coba Cepat (Akun Demo)"
  menyorot kotak akun demo yang kemudian dihapus. Langkah itu sudah dibuang,
  tetapi tidak ada pemeriksa yang menjamin langkah LAIN tidak mengalami hal
  yang sama.

  Pemeriksa ini membandingkan daftar selector di tutorialConfig.ts dengan
  selector yang benar-benar dipasang pada kode komponen (`id="tour-..."`).
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

konfig = (SRC / "components" / "Tutorial" / "tutorialConfig.ts").read_text(encoding="utf-8")

# ── Buang komentar sebelum memeriksa ISI ──────────────────────────────────
#
# Berkas ini memuat komentar yang MENJELASKAN hal-hal yang sudah dihapus,
# misalnya: "Langkah tour 'Uji Coba Cepat (Akun Demo)' DIHAPUS bersama kotak
# akun demo". Pemeriksa versi pertama membaca komentar itu sebagai kode aktif
# dan melaporkan "masih menyebut akun demo" — padahal langkahnya sudah hilang.
#
# Untuk pemeriksaan selector, komentar tidak mengganggu (selector hanya
# muncul di kode). Untuk pemeriksaan ISI, komentar harus dibuang lebih dulu,
# karena komentar justru tempat menjelaskan hal-hal lama.
def tanpa_komentar(teks: str) -> str:
    """Buang komentar baris (`//`) dan blok (`/* */`), serta isi string tetap."""
    teks = re.sub(r"/\*[\s\S]*?\*/", "", teks)
    return "\n".join(
        re.sub(r"//.*$", "", baris) if "//" in baris else baris
        for baris in teks.split("\n")
    )


konfig_kode = tanpa_komentar(konfig)

# Selector yang diminta panduan (urut sesuai kemunculan)
diminta = re.findall(r"targetSelector:\s*'#([^']+)'", konfig)

# Selector yang benar-benar ada di kode, baik sebagai id="..." maupun id={`...`}
semua_kode = []
for f in list(SRC.rglob("*.tsx")) + list(SRC.rglob("*.ts")):
    semua_kode.append(f.read_text(encoding="utf-8", errors="ignore"))
gabung = "\n".join(semua_kode)

ada = set(re.findall(r'id="([^"]+)"', gabung))
ada |= set(re.findall(r"id='([^']+)'", gabung))
# id yang dibentuk dari template literal, mis. id={`tour-${x}`}
pola_template = re.findall(r'id=\{`([^`]+)`\}', gabung)

print("=" * 76)
print("PEMERIKSAAN: SELECTOR PANDUAN RESQY vs ELEMEN DI DOM")
print("=" * 76)
print(f"  selector diminta panduan : {len(diminta)}")
print(f"  id statis ditemukan      : {len(ada)}")
print(f"  id dari template literal : {len(pola_template)}")

hilang = []
for s in diminta:
    if s in ada:
        continue
    # Cek apakah cocok dengan salah satu template literal
    cocok = False
    for tpl in pola_template:
        awalan = tpl.split("${")[0]
        akhiran = tpl.split("}")[-1] if "}" in tpl else ""
        if awalan and s.startswith(awalan) and s.endswith(akhiran):
            cocok = True
            break
    if not cocok:
        hilang.append(s)

print()
if hilang:
    print(f"  [X] SELECTOR TIDAK DITEMUKAN: {len(hilang)}")
    for s in hilang:
        print(f"        #{s}")
else:
    print("  [v] seluruh selector ditemukan di DOM")

# Laporkan juga selector yang dipakai lebih dari satu kali, karena itu
# menandakan panduan menyorot elemen yang sama untuk dua langkah berbeda.
from collections import Counter

ulang = {s: n for s, n in Counter(diminta).items() if n > 1}
if ulang:
    print(f"\n  [catatan] selector yang dipakai lebih dari sekali: {len(ulang)}")
    for s, n in ulang.items():
        print(f"        #{s}  dipakai {n}x")

# ══════════════════════════════════════════════════════════════════════════
# ISI PANDUAN vs KEADAAN APLIKASI SEKARANG
#
# Pemeriksaan selector saja tidak cukup: selector bisa tetap ada sementara
# ISI panduannya sudah tidak sesuai. Itu nyata terjadi — langkah "Radar Bumi &
# Journey Progress Tracker" menyebut peta perjalanan ada "di bawah layar",
# padahal peta itu sudah dipindahkan ke ATAS, dan sama sekali tidak menyebut
# bahwa titik area dapat ditekan untuk berpindah.
# ══════════════════════════════════════════════════════════════════════════

# Jumlah langkah yang diharapkan per tur. Perubahan angka di sini harus
# disengaja — bukan akibat langkah yang tidak sengaja terhapus.
JUMLAH_LANGKAH = {
    "login": 3,
    "dashboard_student": 8,
    "dashboard_teacher": 3,
    "profile": 6,
    "level1": 6,
    "level2": 3,
    "level3": 6,
    "teacher_dashboard": 5,
    "workspace": 5,
}

print("\n" + "-" * 76)
print("  JUMLAH LANGKAH PER TUR")
jumlah_bermasalah = 0
for kunci, harap in JUMLAH_LANGKAH.items():
    m = re.search(
        rf"^  {kunci}: \{{([\s\S]*?)^  \}},", konfig_kode, re.M
    )
    if not m:
        print(f"  [X] tur '{kunci}' tidak ditemukan")
        jumlah_bermasalah += 1
        continue
    n = len(re.findall(r"^\s{8}id: '", m.group(1), re.M))
    tanda = "[v]" if n == harap else "[X]"
    if n != harap:
        jumlah_bermasalah += 1
    print(f"  {tanda} {kunci:<20} {n} langkah (diharapkan {harap})")
    hilang_step = set(re.findall(r"^\s{8}id: '([^']+)'", m.group(1), re.M))

# ── Isi yang WAJIB ada di panduan, dan yang TIDAK boleh ada lagi ──────────
WAJIB_ISI = {
    "Level 1 menyebut titik area dapat ditekan":
        r"titik area[^']{0,80}DITEKAN|DITEKAN untuk berpindah",
    "Level 1 menyebut baju pelindung tidak perlu dibeli dua kali":
        r"dibeli SEKALI|tidak akan diminta membeli|tanpa biaya tambahan",
    "Level 1 menyebut penanda batas lempeng":
        r"penanda status batas lempeng|batas lempeng tektonik",
    "Guru menyebut nomor absen WAJIB":
        r"Nomor absen WAJIB diisi",
    "Guru menyebut pendaftaran mandiri ditutup":
        r"pendaftaran mandiri sudah ditutup",
}
TERLARANG_ISI = {
    "Peta perjalanan disebut ada di BAWAH layar":
        r"Di bawah layar terdapat bar pelacak",
    "Menyebut kotak akun demo":
        r"akun demo|Uji Coba Cepat",
    "Menyebut menu daftar akun":
        r"tombol daftar|menu daftar akun",
}

print("\n" + "-" * 76)
print("  ISI PANDUAN")
isi_bermasalah = 0
for nama, pola in WAJIB_ISI.items():
    if re.search(pola, konfig_kode):
        print(f"  [v] {nama}")
    else:
        print(f"  [X] {nama} — TIDAK DITEMUKAN")
        isi_bermasalah += 1
for nama, pola in TERLARANG_ISI.items():
    if re.search(pola, konfig_kode, re.I):
        print(f"  [X] {nama} — MASIH ADA")
        isi_bermasalah += 1
    else:
        print(f"  [v] tidak ada: {nama}")

total = len(hilang) + jumlah_bermasalah + isi_bermasalah
print("\n" + "=" * 76)
print(f"  HASIL: {total} masalah" if total else "  HASIL: panduan Resqy selaras dengan aplikasi")
print("=" * 76)
sys.exit(1 if total else 0)
