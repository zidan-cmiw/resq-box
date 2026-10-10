#!/usr/bin/env python
"""
Periksa bahwa tidak ada gerbang level yang memakai `unlockedLevel` langsung.

═══════════════════════════════════════════════════════════════════════════
MENGAPA PEMERIKSA INI ADA
═══════════════════════════════════════════════════════════════════════════

  Masalah: akun guru tidak dapat membuka Level 2 dan Level 3, walaupun
  tampilannya seolah terbuka. Permintaan perbaikannya jelas, dan sudah
  dikerjakan — tetapi MASIH BELUM BERFUNGSI.

  Penyebabnya: aturan yang sama ditulis ulang di BANYAK tempat, dan
  perbaikan pertama hanya menyentuh dua di antaranya:

      App.tsx          LevelGuard           -> DIPERBAIKI
      Dashboard        handleLevelClick     -> DIPERBAIKI
      Dashboard        tombol kartu level   -> TERLEWAT  (render tombol gembok)
      Dashboard        label status "TUNTAS/AKTIF/TERKUNCI" -> TERLEWAT
      Dashboard        badge "LV.n"          -> TERLEWAT
      Profile          kartu capaian 3 stage -> TERLEWAT
      missionStore     kategori misi         -> TERLEWAT

  Menemukan semuanya dengan membaca kode satu per satu TIDAK dapat diandalkan
  — sudah terbukti gagal sekali. Pemeriksa ini mencarinya secara menyeluruh,
  sehingga pemeriksaan yang terlewat akan langsung terlihat.

═══════════════════════════════════════════════════════════════════════════
ATURANNYA
═══════════════════════════════════════════════════════════════════════════

  Setiap perbandingan `unlockedLevel` HARUS melewati
  `levelTertinggiYangBoleh(role, unlockedLevel)` — baik dipanggil langsung,
  maupun lewat nilai turunan seperti `levelBerlaku` yang dihitung dari fungsi
  itu.

  Perbandingan yang memakai `unlockedLevel` mentah akan dilaporkan, karena
  di situlah siswa dan guru diperlakukan sama — dan itu yang membuat guru
  tidak dapat membuka level yang seharusnya boleh.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

POLA_PERBANDINGAN = re.compile(r"unlockedLevel\s*(>=|<=|>|<|===|!==)")

# Nama variabel turunan yang sudah dihitung dari levelTertinggiYangBoleh.
# Bila sebuah nilai turunan ditambahkan, daftarkan di sini supaya pemeriksa
# tidak melaporkan pemakaian yang sebenarnya sudah benar.
TURUNAN_SAH = ("levelBerlaku", "levelTertinggiYangBoleh")

temuan: list[tuple[str, int, str]] = []
diperiksa = 0
izin_sah = 0

for f in sorted(list(SRC.rglob("*.ts")) + list(SRC.rglob("*.tsx"))):
    teks = f.read_text(encoding="utf-8", errors="ignore")
    for i, baris in enumerate(teks.split("\n"), 1):
        isi = baris.strip()
        if isi.startswith(("//", "*", "/*")):
            continue  # komentar tidak menjalankan apa pun
        if not POLA_PERBANDINGAN.search(isi):
            continue
        diperiksa += 1
        if any(t in isi for t in TURUNAN_SAH):
            izin_sah += 1
            continue
        temuan.append((f.relative_to(ROOT).as_posix(), i, isi[:100]))

# ── Pastikan fungsi aturannya benar-benar ada dan tidak diubah sembarangan ──
sumber_aturan = SRC / "store" / "teacherStore.ts"
teks_aturan = sumber_aturan.read_text(encoding="utf-8")
aturan_ada = "export function levelTertinggiYangBoleh" in teks_aturan
guru_dapat_3 = bool(
    re.search(r"role === 'teacher' \|\| role === 'admin'\)\s*return 3", teks_aturan)
)
dipakai = sum(
    1
    for f in list(SRC.rglob("*.ts")) + list(SRC.rglob("*.tsx"))
    if "levelTertinggiYangBoleh" in f.read_text(encoding="utf-8", errors="ignore")
    and f != sumber_aturan
)

print("=" * 78)
print("PEMERIKSAAN: GERBANG LEVEL TIDAK BOLEH MEMAKAI unlockedLevel MENTAH")
print("=" * 78)
print(f"  perbandingan unlockedLevel ditemukan : {diperiksa}")
print(f"  melewati aturan peran (sah)          : {izin_sah}")

print("\n── ATURAN PERAN ──")
print(f"  {'[v]' if aturan_ada else '[X]'} fungsi levelTertinggiYangBoleh ada di teacherStore.ts")
print(f"  {'[v]' if guru_dapat_3 else '[X]'} guru dan admin selalu mendapat level 3")
print(f"  {'[v]' if dipakai >= 3 else '[X]'} dipakai di {dipakai} berkas (harus >= 3)")

print("\n── PERBANDINGAN YANG MEMAKAI unlockedLevel MENTAH ──")
if temuan:
    for berkas, baris, isi in temuan:
        print(f"  [X] {berkas}:{baris}")
        print(f"        {isi}")
else:
    print("  [v] tidak ada")

masalah = len(temuan)
if not aturan_ada:
    masalah += 1
if not guru_dapat_3:
    masalah += 1
if dipakai < 3:
    masalah += 1

print("\n" + "=" * 78)
print(f"  HASIL: {masalah} masalah" if masalah else "  HASIL: seluruh gerbang level memakai aturan peran")
print("=" * 78)
sys.exit(1 if masalah else 0)
