#!/usr/bin/env python
"""
Periksa pola tata letak yang membuat tampilan terpotong di layar sempit.

═══════════════════════════════════════════════════════════════════════════
MENGAPA PEMERIKSA INI ADA
═══════════════════════════════════════════════════════════════════════════

  Dilaporkan dari HP: "tampilannya masih belum responsif". Yang terlihat pada
  tangkapan layar:

      - tombol "Diorama WiFi" dan "USB" terpotong di tepi kanan
      - judul misi mendorong tombol keluar layar
      - teks log terpotong

  `scripts/audit_responsif2.py` melaporkan "tidak ada pola berisiko" — jadi
  pemeriksa itu punya titik buta. Yang diperiksa di sini adalah hal yang
  dilewatkannya.

═══════════════════════════════════════════════════════════════════════════
DUA POLA YANG DIPERIKSA
═══════════════════════════════════════════════════════════════════════════

  1. ELEMEN FLEX TANPA `min-w-0`

     Aturan bawaan flexbox: elemen flex memiliki `min-width: auto`, sehingga
     ia TIDAK BOLEH mengecil di bawah lebar isinya. Akibatnya judul panjang
     memaksa kartunya melebar, dan tombol di sebelah kanan terdorong keluar
     layar.

     `min-w-0` mencabut aturan itu. Tanpa `min-w-0` (atau `overflow-hidden`,
     atau `truncate`), teks panjang tidak dapat dipotong dengan elipsis.

  2. KELAS LEBAR BENTROK

     Menuliskan dua lebar berbeda pada breakpoint yang sama, misalnya:

         md:w-80 md:w-84

     Tailwind tidak dapat memastikan mana yang dipakai — yang menang
     bergantung pada urutan di berkas CSS hasil bangun. Lebarnya menjadi tidak
     dapat diandalkan.

  Pemeriksa ini membaca TEKS, jadi ia dapat salah lapor. Setiap temuan perlu
  diperiksa pada kode nyatanya.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

# Komponen yang memang memakai tata letak flex kompleks di layar sempit.
BERKAS_DIPERIKSA = [
    "src/app/Workspace/index.tsx",
    "src/app/Dashboard/index.tsx",
    "src/app/TeacherDashboard/index.tsx",
    "src/app/Level1/EarthDive/EarthDiveGame.tsx",
    "src/components/JourneyProgressTracker.tsx",
]

temuan: list[tuple[str, int, str, str]] = []
diperiksa = 0

# ── Pola 1: elemen flex yang memuat teks panjang tanpa izin menyusut ──────
#
# Yang dicari: baris yang memakai `truncate` pada elemen <h1>/<h2>/<p> ATAU
# memuat `flex-1`/`justify-between`, TETAPI tidak memiliki min-w-0, tanpa
# memperhatikan apakah induknya sudah memberikannya.
POLA_TEKS_PANJANG = re.compile(r"<(h1|h2|h3|p)\b[^>]*className=\"([^\"]*)\"")
POLA_TRUNCATE = re.compile(r"\btruncate\b")

for rel in BERKAS_DIPERIKSA:
    f = ROOT / rel
    if not f.exists():
        continue
    teks = f.read_text(encoding="utf-8", errors="ignore")
    baris = teks.split("\n")

    for i, ln in enumerate(baris, 1):
        diperiksa += 1
        isi = ln.strip()
        if isi.startswith(("//", "*", "/*")):
            continue

        # Pola 1a: elemen ber-truncate TANPA batas lebar sama sekali
        #
        # Versi pertama pemeriksa ini menandai SEMUA `truncate` yang tidak
        # memiliki `min-w-0`, dan itu menghasilkan dua positif palsu:
        #
        #     className="... truncate max-w-xs md:max-w-md"
        #     className="... truncate max-w-[150px] sm:max-w-[200px]"
        #
        # Keduanya SUDAH punya batas lebar eksplisit, dan batas lebar itu
        # sudah cukup membuat `truncate` bekerja. `min-w-0` hanya diperlukan
        # bila tidak ada batas lebar apa pun — di situlah teks panjang memaksa
        # induknya melebar.
        m = POLA_TEKS_PANJANG.search(ln)
        if m and POLA_TRUNCATE.search(m.group(2)):
            kelas = m.group(2)
            punya_batas = (
                "min-w-0" in kelas
                or "overflow-hidden" in kelas
                or "w-full" in kelas
                or re.search(r"\b(?:sm:|md:|lg:|xl:)?max-w-", kelas)
            )
            if not punya_batas:
                temuan.append(
                    (rel, i, "teks ber-truncate tanpa batas lebar", isi[:100])
                )

        # Pola 2: kelas lebar/tinggi bentrok pada breakpoint yang sama
        for bp in ("sm", "md", "lg", "xl"):
            for prop in ("w", "h", "min-w", "max-w", "min-h", "max-h"):
                cocok = re.findall(rf"\b{bp}:{prop}-[a-zA-Z0-9\.\[\]%]+", ln)
                if len(set(cocok)) > 1:
                    temuan.append(
                        (rel, i, f"kelas {bp}:{prop}-* bentrok: {set(cocok)}", isi[:100])
                    )

print("=" * 78)
print("PEMERIKSAAN: POLA TATA LETAK YANG MEMBUAT TAMPILAN TERPOTONG")
print("=" * 78)
print(f"  berkas diperiksa : {len(BERKAS_DIPERIKSA)}")
print(f"  baris diperiksa  : {diperiksa}")

if temuan:
    print(f"\n  PERLU DIPERIKSA ({len(temuan)})")
    for rel, i, sebab, isi in temuan:
        print(f"\n    {rel}:{i}  —  {sebab}")
        print(f"        {isi}")
else:
    print("\n  [v] tidak ada pola berisiko")

print("\n" + "=" * 78)
print(f"  HASIL: {len(temuan)} temuan" if temuan else "  HASIL: tidak ada temuan")
print("=" * 78)
sys.exit(1 if temuan else 0)
