#!/usr/bin/env python
"""
Lengkapi aksesibilitas keyboard pada lapisan latar modal dan pembungkus.

DUA POLA YANG DITANGANI, DAN KENAPA BERBEDA

  1. LAPISAN LATAR MODAL — `<div onClick={() => setTutup()}>`
     Ini benar-benar dapat diklik: menutup modal saat latarnya ditekan.
     Masalahnya, pengguna keyboard tidak dapat melakukan hal yang sama.
     Latar itu TIDAK dapat dijangkau Tab, dan Escape tidak ditangani.

     Perbaikan: tambahkan `onKeyDown` yang menutup modal pada Escape, Enter,
     dan Spasi.

     Catatan penting: `tabIndex` TIDAK ditambahkan. Latar modal bukan tujuan
     navigasi — memberi tabIndex akan membuat pengguna keyboard berhenti di
     elemen selebar layar yang tidak terlihat. Escape sudah cukup dan sesuai
     kebiasaan.

  2. PEMBUNGKUS stopPropagation — `<div onClick={(e) => e.stopPropagation()}>`
     Ini BUKAN tombol. Ia hanya mencegah klik pada isinya memicu aksi elemen
     induk. Memberinya `role` dan `tabIndex` justru merugikan: pengguna
     keyboard akan berhenti di elemen yang tidak bereaksi apa pun.

     Perbaikan: hanya tambahkan penahan rambatan tombol. Tanpa itu, menekan
     Enter pada tombol di dalamnya akan menggelembung ke induk dan memicu dua
     aksi sekaligus — satu dari tombol, satu dari induk.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from jsx_scan import akhir_tag  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

# (berkas, baris, jenis) — jenis: 'latar' atau 'bungkus'
#
# Elemen dengan onClick={handleAdvance} (kotak dialog Visual Novel) SENGAJA
# TIDAK disertakan. Berkas itu sudah punya penanganan keyboard global pada
# window yang memanggil handleAdvance saat Spasi ditekan — bahkan antarmukanya
# menampilkan petunjuk "[Klik / SPASI untuk Lanjut]". Menambahkan pengendali
# kedua akan membuat satu penekanan Spasi memajukan DUA dialog.
SASARAN = [
    ("src/app/Dashboard/index.tsx", 730, "latar"),
    ("src/app/Dashboard/index.tsx", 734, "bungkus"),
    ("src/app/TeacherDashboard/index.tsx", 1511, "latar"),
    ("src/app/TeacherDashboard/index.tsx", 1515, "bungkus"),
    ("src/app/Workspace/index.tsx", 721, "latar"),
    ("src/app/Level2/DiscoveryModal.tsx", 5448, "latar"),
    ("src/app/Level2/DiscoveryModal.tsx", 5452, "bungkus"),
    ("src/app/Level1/EarthDive/VisualNovelDialogue.tsx", 382, "bungkus"),
    ("src/app/Level1/EarthDive/VisualNovelDialogue.tsx", 402, "bungkus"),
    ("src/app/Level2/VisualNovelDialogueL2.tsx", 396, "bungkus"),
    ("src/app/Level2/VisualNovelDialogueL2.tsx", 416, "bungkus"),
]

# Fungsi penutup per berkas, dipakai pada lapisan latar
TUTUP = {
    "src/app/Dashboard/index.tsx": "setShowGuideModal(false)",
    "src/app/TeacherDashboard/index.tsx": "setShowTeacherProfileModal(false)",
    "src/app/Workspace/index.tsx": "setShowMissionPanel(false)",
    "src/app/Level2/DiscoveryModal.tsx": "setIsFullscreen(false)",
}


def kedalaman(berkas: Path) -> int:
    """Berapa tingkat folder dari src, untuk menentukan jalur impor relatif."""
    rel = berkas.relative_to(SRC)
    return len(rel.parts) - 1


def tambah_impor(teks: str, baris_impor: str) -> str:
    if baris_impor in teks:
        return teks
    m = list(re.finditer(r"(?m)^import .*;$", teks))
    if not m:
        return baris_impor + "\n" + teks
    pos = m[-1].end()
    return teks[:pos] + "\n" + baris_impor + teks[pos:]


def main() -> int:
    per_berkas: dict[str, list[tuple[int, str]]] = {}
    for berkas_str, baris, jenis in SASARAN:
        per_berkas.setdefault(berkas_str, []).append((baris, jenis))

    total = 0
    for berkas_str, daftar in per_berkas.items():
        berkas = ROOT / berkas_str
        teks = berkas.read_text(encoding="utf-8")

        # Kumpulkan posisi tag yang dituju
        baris_semua = teks.split("\n")
        offset = [0]
        for b in baris_semua:
            offset.append(offset[-1] + len(b) + 1)

        sisip: list[tuple[int, str]] = []
        perlu_latar = perlu_bungkus = False

        for baris, jenis in sorted(daftar, reverse=True):
            # Cari '<div' mulai dari baris ini
            awal_cari = offset[baris - 1]
            i = teks.find("<div", awal_cari)
            if i < 0:
                print(f"  LEWAT (tak ada <div) {berkas_str}:{baris}")
                continue
            akhir = akhir_tag(teks, i)
            if akhir < 0:
                continue
            tag = teks[i:akhir + 1]
            if "onKeyDown=" in tag:
                print(f"  LEWAT (sudah ada onKeyDown) {berkas_str}:{baris}")
                continue

            if jenis == "latar":
                aksi = TUTUP[berkas_str]
                sisip.append((i + len("<div"),
                              f" onKeyDown={{tutupModalDenganKeyboard(() => {aksi})}}"))
                perlu_latar = True
            else:
                sisip.append((i + len("<div"), " onKeyDown={blokirRambatanTombol()}"))
                perlu_bungkus = True
            total += 1

        for p, s in sorted(sisip, reverse=True):
            teks = teks[:p] + s + teks[p:]

        # Impor sesuai kebutuhan
        if perlu_latar or perlu_bungkus:
            naik = "../" * kedalaman(berkas)
            impor = []
            if perlu_latar:
                impor.append(f"import {{ tutupModalDenganKeyboard }} from '{naik}utils/keyboard';")
            if perlu_bungkus:
                impor.append(f"import {{ blokirRambatanTombol }} from '{naik}utils/keyboard';")
            for baris_impor in impor:
                teks = tambah_impor(teks, baris_impor)

        berkas.write_text(teks, encoding="utf-8")
        print(f"  {len(sisip)} sisipan  {berkas_str}")

    print(f"\n  TOTAL: {total} elemen diperbaiki")
    return 0


if __name__ == "__main__":
    sys.exit(main())
