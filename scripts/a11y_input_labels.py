#!/usr/bin/env python
"""
Hubungkan <label> ke <input> dengan id/htmlFor — versi aman.

MENGAPA VERSI PERTAMA GAGAL
  Versi pertama memakai satu regex panjang yang mencakup dari <label> sampai
  <input>. Pola `[^>]*` di dalamnya berhenti pada karakter `>` PERTAMA, dan
  pada JSX karakter itu ada di dalam panah fungsi: `onChange={(e) => ...}`.
  Akibatnya tag terpotong di tengah dan JSX rusak (13 error TypeScript).

  Pelajarannya: jangan memakai regex yang menyeberangi batas tag JSX, karena
  `>` bisa muncul di dalam nilai atribut.

CARA AMAN YANG DIPAKAI DI SINI
  1. Cari setiap tag <input> memakai pemindai sederhana yang mengerti tanda
     kutip dan kurung kurawal, sehingga `>` di dalam ekspresi tidak dianggap
     akhir tag.
  2. Untuk setiap input tanpa id/aria-label, cari <label> TERDEKAT DI ATASNYA.
  3. Sisipkan `id` pada input dan `htmlFor` pada label — dua sisipan kecil di
     posisi yang pasti, tidak ada tag yang ditulis ulang.

  Pemindai yang mengerti kurung kurawal inilah kuncinya: ia tahu bahwa `=>`
  di dalam `onChange={(e) => ...}` bukan akhir tag.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

# Input yang memang tidak punya label visual -> diberi aria-label
ARIA_LANGSUNG = [
    ("searchQuery", "Cari siswa berdasarkan nama, nomor absen, atau username"),
    ("wsIp", "Alamat IP Diorama"),
    ("newProjectName", "Nama proyek baru"),
]


def akhir_tag(teks: str, mulai: int) -> int:
    """Indeks `>` yang menutup tag, dengan menghormati kutip dan kurung kurawal."""
    i = mulai
    n = len(teks)
    while i < n:
        c = teks[i]
        if c in "\"'":
            kutip = c
            i += 1
            while i < n and teks[i] != kutip:
                if teks[i] == "\\":
                    i += 1
                i += 1
        elif c == "{":
            dalam = 1
            i += 1
            while i < n and dalam:
                if teks[i] == "{":
                    dalam += 1
                elif teks[i] == "}":
                    dalam -= 1
                elif teks[i] in "\"'":
                    k = teks[i]
                    i += 1
                    while i < n and teks[i] != k:
                        if teks[i] == "\\":
                            i += 1
                        i += 1
                i += 1
            continue
        elif c == ">":
            return i
        i += 1
    return -1


def teks_label(teks: str, pos_label: int) -> str:
    """Teks tampak dari <label> yang dimulai pada pos_label ("" bila kompleks)."""
    akhir_buka = akhir_tag(teks, pos_label)
    if akhir_buka < 0:
        return ""
    tutup = teks.find("</label>", akhir_buka)
    if tutup < 0:
        return ""
    isi = teks[akhir_buka + 1: tutup]
    if "<" in isi:
        return ""
    return " ".join(isi.split())


def jadikan_id(label: str) -> str:
    bersih = re.sub(r"[^a-zA-Z0-9\s]", " ", label)
    kata = bersih.split()
    if not kata:
        return ""
    return "f-" + "-".join(k.lower() for k in kata[:4])


def proses(berkas: Path) -> list[str]:
    teks = berkas.read_text(encoding="utf-8")
    asli = teks
    hasil: list[str] = []

    pos_label = []
    for m in re.finditer(r"<label\b", teks):
        akhir = akhir_tag(teks, m.start())
        if akhir < 0:
            continue
        if "htmlFor=" in teks[m.start():akhir]:
            continue
        pos_label.append(m.start())

    pos_input = [m.start() for m in re.finditer(r"<input\b", teks)]
    id_terpakai = set(re.findall(r'\bid="([^"]+)"', teks))

    # Dari belakang supaya posisi di depan tidak bergeser saat menyisipkan
    for p in sorted(pos_input, reverse=True):
        akhir = akhir_tag(teks, p)
        if akhir < 0:
            continue
        tag = teks[p:akhir + 1]
        if 'type="hidden"' in tag:
            continue
        if any(a in tag for a in ("aria-label", "aria-labelledby", "id=", "title=")):
            continue

        kandidat = [q for q in pos_label if q < p and p - q < 900]
        label = teks_label(teks, kandidat[-1]) if kandidat else ""

        if label:
            id_baru = jadikan_id(label)
            if not id_baru:
                continue
            dasar, i = id_baru, 2
            while id_baru in id_terpakai:
                id_baru = f"{dasar}-{i}"
                i += 1
            id_terpakai.add(id_baru)

            teks = teks[:p + 6] + f' id="{id_baru}"' + teks[p + 6:]
            q = kandidat[-1]
            sisip = f' htmlFor="{id_baru}"'
            teks = teks[:q + 6] + sisip + teks[q + 6:]
            pos_label = [x + len(sisip) if x > q else x for x in pos_label]
            hasil.append(f'{id_baru:<26} <- {label[:42]}')
        else:
            for var, aria in ARIA_LANGSUNG:
                if f"value={{{var}}}" in tag:
                    teks = teks[:p + 6] + f' aria-label="{aria}"' + teks[p + 6:]
                    hasil.append(f'aria-label="{aria[:44]}"')
                    break

    if teks != asli:
        berkas.write_text(teks, encoding="utf-8")
    return hasil


def main() -> int:
    total = 0
    for berkas in sorted(SRC.rglob("*.tsx")):
        hasil = proses(berkas)
        if hasil:
            print(f"\n  {berkas.relative_to(ROOT).as_posix()}  ({len(hasil)})")
            for h in hasil:
                print(f"      {h}")
            total += len(hasil)
    print(f"\n  TOTAL: {total} input diperbaiki")
    return 0


if __name__ == "__main__":
    sys.exit(main())
