#!/usr/bin/env python
"""
Perbaiki grid dan padding yang tidak responsif.

DASAR PERBAIKAN
  Semua berasal dari scripts/audit_responsif2.py — audit yang sudah dibersihkan
  dari positif palsu. Audit pertama melaporkan 104 temuan, tetapi setelah
  diperiksa satu per satu sebagian besar SALAH LAPOR:

    - `w-[95%] max-w-[680px]` -> regex cocok pada potongan `max-w-[680px]`,
      padahal pola itu justru SUDAH benar
    - `width: '880px', maxWidth: '96vw'` -> sudah dibatasi viewport
    - `min-w-[180px]` pada <th> -> disengaja; wadahnya sudah `overflow-x-auto`
    - `max-width: 680px` -> berada di CSS CETAK rapor, tidak relevan di layar
    - `whitespace-nowrap` pada badge "TAHAP 2" -> tidak berisiko

  Yang benar-benar bermasalah hanya sepuluh, dan semuanya sejenis: jumlah kolom
  grid tetap tanpa varian untuk layar sempit.

HITUNGAN DI LAYAR 360px (HP kelas bawah)
    grid-cols-3 -> tiap kolom ~120px  -> teks berdesakan
    grid-cols-5 -> tiap kolom  ~72px  -> teks terpotong

  Karena itu dipakai `xs:` (480px) yang baru ditambahkan ke `@theme` di
  src/index.css. Tanpa breakpoint itu, tata letak melompat dari 1 kolom
  langsung ke 3-5 kolom pada 640px.
"""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# (berkas, baris, teks lama, teks baru, keterangan)
PERBAIKAN = [
    # ── 5 kolom: pemilih status gunung api ──────────────────────────────
    # Lima tombol "LV.1 NORMAL" ... "LV.4 AWAS" plus "SEMUA LEVEL".
    # Di 360px tiap tombol tinggal 72px sementara teksnya 13,5px -> terpotong.
    (
        "src/app/Level2/ilustrasi/gunung-api.tsx",
        456,
        "grid grid-cols-5 gap-1.5 pt-1 shrink-0",
        "grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-1.5 pt-1 shrink-0",
        "5 kolom -> 2/3/5 kolom",
    ),
    # ── 3 kolom: tab ilustrasi gunung api ───────────────────────────────
    (
        "src/app/Level2/ilustrasi/gunung-api.tsx",
        1251,
        "w-full grid grid-cols-3 gap-2",
        "w-full grid grid-cols-1 xs:grid-cols-3 gap-2",
        "3 kolom -> 1/3 kolom",
    ),
    (
        "src/app/Level2/ilustrasi/gunung-api.tsx",
        1484,
        "w-full grid grid-cols-3 gap-2",
        "w-full grid grid-cols-1 xs:grid-cols-3 gap-2",
        "3 kolom -> 1/3 kolom",
    ),
    (
        "src/app/Level2/ilustrasi/gunung-api.tsx",
        2072,
        "w-full grid grid-cols-3 gap-2 sm:gap-2.5 pt-1",
        "w-full grid grid-cols-1 xs:grid-cols-3 gap-2 sm:gap-2.5 pt-1",
        "3 kolom -> 1/3 kolom",
    ),
    # ── 3 kolom: ringkasan Wordle ───────────────────────────────────────
    (
        "src/app/Level1/Wordle/index.tsx",
        324,
        "grid grid-cols-3 gap-2.5 pt-2 border-t-2 border-amber-950/20",
        "grid grid-cols-1 xs:grid-cols-3 gap-2.5 pt-2 border-t-2 border-amber-950/20",
        "3 kolom -> 1/3 kolom",
    ),
    # ── 3 kolom: status tahap di Profil ─────────────────────────────────
    (
        "src/app/Profile/index.tsx",
        497,
        "grid grid-cols-3 gap-2 text-center text-[13.5px] font-semibold",
        "grid grid-cols-1 xs:grid-cols-3 gap-2 text-center text-[13.5px] font-semibold",
        "3 kolom -> 1/3 kolom",
    ),
    # ── padding 24px -> responsif ───────────────────────────────────────
    (
        "src/app/Level2/index.tsx",
        46,
        "rounded-2xl p-6 shadow-2xl text-center space-y-4",
        "rounded-2xl p-4 sm:p-6 shadow-2xl text-center space-y-4",
        "padding 24px -> 16/24px",
    ),
    (
        "src/app/Level3/index.tsx",
        1173,
        "rounded-2xl sm:rounded-3xl p-6 shadow-[0_16px_0_#1c0d02]",
        "rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[0_16px_0_#1c0d02]",
        "padding 24px -> 16/24px",
    ),
    # ── padding 32px pada sel tabel kosong ──────────────────────────────
    (
        "src/app/TeacherDashboard/index.tsx",
        850,
        'className="p-8 text-center text-amber-900/70',
        'className="p-5 sm:p-8 text-center text-amber-900/70',
        "padding 32px -> 20/32px",
    ),
]


def main() -> int:
    berhasil, gagal = 0, []
    for berkas_rel, baris_no, lama, baru, ket in PERBAIKAN:
        berkas = ROOT / berkas_rel
        if not berkas.exists():
            gagal.append(f"{berkas_rel} — berkas tidak ada")
            continue
        teks = berkas.read_text(encoding="utf-8")
        baris = teks.split("\n")
        idx = baris_no - 1
        if idx >= len(baris):
            gagal.append(f"{berkas_rel}:{baris_no} — baris tidak ada")
            continue
        if lama not in baris[idx]:
            gagal.append(f"{berkas_rel}:{baris_no} — pola tidak cocok")
            continue
        baris[idx] = baris[idx].replace(lama, baru, 1)
        berkas.write_text("\n".join(baris), encoding="utf-8")
        berhasil += 1
        print(f"  OK  {berkas_rel}:{baris_no}  ({ket})")

    print(f"\n  {berhasil} dari {len(PERBAIKAN)} perbaikan diterapkan")
    if gagal:
        print("\n  GAGAL:")
        for g in gagal:
            print(f"    {g}")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
