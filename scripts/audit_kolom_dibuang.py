#!/usr/bin/env python
"""
Cari fungsi yang membaca kolom yang sudah DIBUANG oleh migrasi lain.

═══════════════════════════════════════════════════════════════════════════
MENGAPA PEMERIKSA INI ADA
═══════════════════════════════════════════════════════════════════════════

  Kesalahan nyata yang terjadi di database produksi:

    1. Migrasi 08 membuat kolom `nisn` DAN tiga fungsi yang membacanya
       (get_my_profile, list_class_students, handle_new_auth_user).
    2. Migrasi 09 membuang kolom `nisn`, TETAPI TIDAK memperbarui ketiga
       fungsi itu.
    3. Fungsi yang tersimpan di database masih mencoba membaca `v.nisn`.
    4. Setiap pengguna gagal login:
           ERROR 42703: record "v" has no field "nisn"
       dan aplikasi menampilkan "Profil tidak ditemukan" — pesan yang
       menyesatkan, karena akun dan profilnya sebenarnya ada.

  Kesulitan menemukannya: tidak ada satu pun berkas yang salah bila dibaca
  sendiri-sendiri. Migrasi 08 benar (kolomnya ada saat itu). Migrasi 09 juga
  benar (ia memang bertugas membuang kolomnya). Kesalahannya baru muncul saat
  KEDUANYA dijalankan berurutan.

  Pemeriksa ini melakukan hal yang tidak dilakukan manusia dengan mudah:
  membandingkan seluruh migrasi sebagai satu rangkaian, lalu mencari fungsi
  yang membaca kolom yang sudah tidak ada.

CARA KERJA
  1. Kumpulkan semua kolom yang DIBUANG  (ALTER TABLE ... DROP COLUMN)
     dan semua kolom yang DIBUAT          (CREATE TABLE / ADD COLUMN)
  2. Hitung kolom apa saja yang akhirnya TIDAK ADA
  3. Pindai isi setiap CREATE FUNCTION, cari penyebutan `nama_kolom`
  4. Laporkan temuan, dengan urutan migrasi ditampilkan agar sebabnya jelas

KETERBATASAN YANG PERLU DIKETAHUI
  Pemeriksa ini membaca TEKS, bukan menjalankan SQL. Karena itu:
    - ia dapat melaporkan positif palsu bila nama kolom muncul sebagai nama
      variabel lokal atau bagian dari kata lain
    - ia TIDAK dapat menangkap kolom yang dibuang di luar berkas migrasi
      (mis. dijalankan manual di SQL Editor)
  Karena itu setiap temuan tetap harus diperiksa pada kode nyatanya — sama
  seperti ketiga audit lain di folder ini, yang semuanya pernah menghasilkan
  positif palsu pada percobaan pertama.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MIG = ROOT / "supabase" / "migrations"

TEMUAN: list[tuple[str, str, str, str]] = []


def baca_migrasi() -> list[tuple[str, str]]:
    """Kembalikan (nama berkas, isi) untuk setiap migrasi, URUT menurut nama."""
    return [(f.name, f.read_text(encoding="utf-8")) for f in sorted(MIG.glob("*.sql"))]


def kumpulkan_kolom(migrasi: list[tuple[str, str]]) -> tuple[set[str], set[str], dict[str, str]]:
    """
    Kembalikan:
      kolom_ada     : kolom yang dibuat dan tidak dibuang
      kolom_buang   : kolom yang dibuang
      sebab_buang   : nama kolom -> berkas yang membuangnya
    """
    ada: set[str] = set()
    buang: set[str] = set()
    sebab: dict[str, str] = {}

    for nama, isi in migrasi:
        # Kolom dibuang: ALTER TABLE ... DROP COLUMN [IF EXISTS] nama
        for m in re.finditer(
            r"ALTER\s+TABLE\s+[\w.]+\s+DROP\s+COLUMN\s+(?:IF\s+EXISTS\s+)?(\w+)", isi, re.I
        ):
            k = m.group(1)
            buang.add(k)
            sebab[k] = nama

        # Kolom dibuat lewat CREATE TABLE (hanya yang cocok `nama TIPE`)
        for tabel in re.finditer(r"CREATE TABLE[^(]*\(([\s\S]*?)\n\);", isi, re.I):
            for baris in tabel.group(1).split("\n"):
                b = baris.strip().rstrip(",")
                if not b or b.startswith("--") or b.upper().startswith(("PRIMARY", "UNIQUE", "CHECK", "FOREIGN", "CONSTRAINT")):
                    continue
                m = re.match(r"(\w+)\s+(TEXT|UUID|INT|INTEGER|BOOLEAN|TIMESTAMPTZ|JSONB|BIGINT|SERIAL|DATE|NUMERIC)", b, re.I)
                if m:
                    ada.add(m.group(1))

        # Kolom ditambah: ALTER TABLE ... ADD COLUMN [IF NOT EXISTS] nama
        for m in re.finditer(
            r"ALTER\s+TABLE\s+[\w.]+\s+ADD\s+COLUMN\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)", isi, re.I
        ):
            ada.add(m.group(1))

    # Kolom yang dibuat LALU dibuang, berarti akhirnya tidak ada
    ada -= buang
    return ada, buang, sebab


def definisi_terakhir(migrasi: list[tuple[str, str]], kolom: str) -> dict[str, tuple[int, str, bool]]:
    """
    Untuk setiap fungsi, cari DEFINISI TERAKHIRNYA di seluruh migrasi.

    MENGAPA HARUS DEFINISI TERAKHIR
      Satu fungsi sering ditulis ulang di beberapa migrasi. Yang berlaku di
      database adalah definisi yang ditulis PALING AKHIR. Versi pertama
      pemeriksa ini memeriksa SEMUA definisi, sehingga melaporkan 4 masalah
      padahal 3 di antaranya sudah diperbaiki dengan mendefinisikan ulang
      fungsinya setelah kolomnya dibuang.

      Positif palsu itu muncul justru karena pemeriksa tidak memperhitungkan
      urutan — dan pemeriksa yang melaporkan masalah yang sudah selesai sama
      tidak bergunanya dengan pemeriksa yang melewatkan masalah nyata.

    Kembalikan: nama_fungsi -> (indeks_migrasi, nama_berkas, menyebut_kolom?)
    """
    pola_kolom = re.compile(rf"(?<![A-Za-z0-9_]){re.escape(kolom)}(?![A-Za-z0-9_])")
    terakhir: dict[str, tuple[int, str, bool]] = {}

    for idx, (nama_berkas, isi) in enumerate(migrasi):
        for m in re.finditer(
            r"CREATE\s+OR\s+REPLACE\s+FUNCTION\s+public\.(\w+)[\s\S]*?\$\$;", isi, re.I
        ):
            isi_fungsi = m.group(0)
            nama = m.group(1)
            # Definisi berikutnya menimpa yang sebelumnya.
            terakhir[nama] = (idx, nama_berkas, pola_kolom.search(isi_fungsi) is not None)

    return terakhir


def fungsi_yang_menyebut(migrasi: list[tuple[str, str]], kolom: str) -> list[tuple[str, str]]:
    """Fungsi yang definisi TERAKHIRNYA masih menyebut kolom yang dibuang."""
    return [
        (berkas, nama)
        for nama, (_, berkas, menyebut) in definisi_terakhir(migrasi, kolom).items()
        if menyebut
    ]


def main() -> int:
    migrasi = baca_migrasi()
    if not migrasi:
        print("  Tidak ada berkas migrasi.")
        return 0

    ada, buang, sebab = kumpulkan_kolom(migrasi)

    print("=" * 74)
    print("PEMERIKSA: FUNGSI YANG MEMBACA KOLOM YANG SUDAH DIBUANG")
    print("=" * 74)
    print(f"\n  {len(migrasi)} berkas migrasi diperiksa")

    if not buang:
        print("\n  Tidak ada kolom yang dibuang. Tidak ada yang perlu diperiksa.\n")
        return 0

    print(f"\n  Kolom yang pernah dibuang ({len(buang)}):")
    for k in sorted(buang):
        print(f"    {k:<18} dibuang oleh {sebab[k]}")

    print("\n" + "-" * 74)

    for k in sorted(buang):
        pemakai = fungsi_yang_menyebut(migrasi, k)
        if not pemakai:
            print(f"\n  [v] '{k}' — definisi TERAKHIR setiap fungsi sudah bersih.")
            print(f"      Tidak ada fungsi yang membaca kolom ini. AMAN.")
            continue

        print(f"\n  [X] '{k}' — MASIH DIBACA oleh fungsi berikut:")
        for nama_berkas, nama_fungsi in sorted(pemakai):
            print(f"        {nama_fungsi}  (definisi terakhir di {nama_berkas})")
            TEMUAN.append((k, nama_berkas, nama_fungsi, sebab[k]))
        print(f"      Kolom ini dibuang oleh {sebab[k]}.")
        print(f"      Definisi TERAKHIR fungsi di atas masih menyebut kolom itu,")
        print(f"      sehingga saat dijalankan di database akan GAGAL dengan")
        print(f"      galat 42703: record \"v\" has no field \"{k}\".")
        print(f"\n      Perbaikan: definisikan ulang fungsi itu SETELAH pembuangan,")
        print(f"      tanpa menyebut kolom '{k}'.")

    print("\n" + "=" * 74)
    if TEMUAN:
        print(f"  KESIMPULAN: {len(TEMUAN)} masalah ditemukan")
        print("  Jalankan migrasi secara berurutan di atas kertas sebelum")
        print("  menjalankannya di database.")
    else:
        print("  KESIMPULAN: tidak ada fungsi yang membaca kolom yang sudah dibuang")
    print("=" * 74)
    return 1 if TEMUAN else 0


if __name__ == "__main__":
    sys.exit(main())
