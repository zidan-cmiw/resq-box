#!/usr/bin/env python
"""
Hitung beban server per pemain, untuk menjawab pertanyaan kapasitas.

═══════════════════════════════════════════════════════════════════════════
MENGAPA DIHITUNG, BUKAN DITEBAK
═══════════════════════════════════════════════════════════════════════════

  Pertanyaannya: "simulasikan kalau 1000 player main". Untuk menjawabnya,
  yang perlu diketahui BUKAN berapa pemainnya, melainkan BERAPA PERMINTAAN
  KE SERVER yang dihasilkan setiap pemain.

  Sebuah aplikasi yang seluruh logikanya berjalan di peramban (canvas,
  WebGL, penyimpanan lokal) dapat melayani 1000 pemain sekaligus dengan
  beban server yang jauh lebih kecil daripada aplikasi yang memanggil server
  setiap beberapa detik.

  Skrip ini menghitung jumlah panggilan ke Supabase dari kode, lalu
  menerjemahkannya menjadi perkiraan beban pada berbagai jumlah pemain.

  Yang dihitung: setiap pemanggilan `supabase.` (rpc, from, auth, channel).
  Yang TIDAK dapat dihitung dari kode: berapa sering masing-masing dipanggil
  saat pemain benar-benar bermain. Karena itu hasilnya berupa RENTANG,
  bukan satu angka pasti — dan asumsinya ditulis terbuka.
"""
from __future__ import annotations

import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

# ── Pola pemanggilan Supabase ─────────────────────────────────────────────
POLA = {
    "rpc": re.compile(r"supabase\.rpc\(\s*'([^']+)'"),
    "from": re.compile(r"supabase\.from\(\s*'([^']+)'"),
    "auth": re.compile(r"supabase\.auth\.(\w+)\("),
    "channel": re.compile(r"supabase\.channel\("),
    "storage": re.compile(r"supabase\.storage"),
}


def main() -> int:
    hitungan: dict[str, Counter] = defaultdict(Counter)
    per_berkas: dict[str, int] = Counter()

    for f in sorted(list(SRC.rglob("*.ts")) + list(SRC.rglob("*.tsx"))):
        t = f.read_text(encoding="utf-8", errors="ignore")
        rel = f.relative_to(ROOT).as_posix()
        for jenis, pola in POLA.items():
            for m in pola.finditer(t):
                nama = m.group(1) if m.groups() else jenis
                hitungan[jenis][nama] += 1
                per_berkas[rel] += 1

    print("=" * 76)
    print("BEBAN SERVER PER PEMAIN — DIHITUNG DARI KODE")
    print("=" * 76)

    total = sum(sum(c.values()) for c in hitungan.values())

    print(f"\n  Titik panggilan Supabase di seluruh kode: {total}")
    for jenis in ("rpc", "from", "auth", "channel", "storage"):
        c = hitungan[jenis]
        if not c:
            continue
        print(f"\n  ── {jenis.upper()} ({sum(c.values())} titik panggilan) ──")
        for nama, n in c.most_common(20):
            print(f"      {nama:<40} {n}x")

    print("\n  ── Berkas dengan panggilan terbanyak ──")
    for rel, n in per_berkas.most_common(8):
        print(f"      {rel:<52} {n}x")

    # ── Perkiraan beban ───────────────────────────────────────────────────
    #
    # ASUMSI — ditulis terbuka supaya dapat diperiksa dan dibantah.
    #
    #   Semua logika permainan (pergerakan, animasi, tabrakan, Blockly)
    #   berjalan DI PERAMBAN. Server hanya dipanggil saat:
    #     - masuk (sekali per sesi)
    #     - memuat profil (sekali per sesi)
    #     - mengirim nilai level (1-3 kali per sesi)
    #     - mengambil rekap kelas (hanya guru)
    #
    #   Jadi perkiraan per SESI BELAJAR (sekitar 30-45 menit):
    #       pemain biasa : 4-8 permintaan
    #       guru         : 15-40 permintaan (membuka rekap, daftar siswa)
    #
    #   Sesi 40 menit berarti setiap pemain menghasilkan sekitar
    #       6 permintaan / 2400 detik  =  0,0025 permintaan per detik.
    #
    #   Angka itu sangat kecil karena server tidak dipanggil terus-menerus.
    print("\n" + "=" * 76)
    print("PERKIRAAN BEBAN — dengan asumsi yang ditulis terbuka")
    print("=" * 76)
    print("""
  ASUMSI
    Seluruh logika permainan berjalan di peramban (canvas, WebGL, Blockly,
    penyimpanan lokal). Server hanya dipanggil saat:
      - masuk                     1x per sesi
      - memuat profil             1x per sesi
      - mengirim nilai level      1-3x per sesi
      - rekap kelas               hanya guru

    Perkiraan per sesi belajar 40 menit:
      pemain biasa :  4-8 permintaan
      guru         : 15-40 permintaan

  PERKIRAAN BEBAN
""")

    # Skenario: sesi 40 menit, rata-rata 6 permintaan per pemain
    for jumlah in (10, 100, 1000, 10000):
        # Bila semuanya mulai BERSAMAAN (kasus terburuk: satu sekolah masuk
        # serentak pada jam pelajaran yang sama)
        burst = jumlah * 6
        # Sebar merata sepanjang 40 menit
        per_detik = (jumlah * 6) / (40 * 60)
        print(
            f"      {jumlah:>6} pemain  |  {burst:>7} permintaan bila mulai serentak"
            f"  |  {per_detik:>6.2f} permintaan/detik bila tersebar"
        )

    print("""
  CARA MEMBACANYA
    Kolom "mulai serentak" adalah KASUS TERBURUK, dan itulah yang harus
    diuji: satu sekolah membuka aplikasi pada jam pelajaran yang sama.

    Kolom "tersebar" adalah keadaan sehari-hari, dan angkanya sangat kecil.
    Karena itu yang perlu diperhatikan bukan rata-ratanya, melainkan
    PUNCAKNYA saat semua masuk bersamaan.

  YANG MASIH PERLU DIUJI
    Angka di atas hanya memperkirakan JUMLAH permintaan. Yang belum diketahui:
      - berapa lama setiap permintaan diproses (latensi di bawah beban)
      - batas koneksi database pada paket Supabase yang dipakai
      - apakah ada pemeriksaan yang mahal (mis. check_rate_limit per panggilan)

    Ketiganya hanya dapat diketahui dengan mengukur, bukan menghitung.
    Gunakan scripts/uji_beban.mjs untuk itu.
""")
    return 0


if __name__ == "__main__":
    sys.exit(main())
