#!/usr/bin/env python
"""
Periksa pola tata letak yang terbukti MERUSAK tampilan pada layar sempit.

═══════════════════════════════════════════════════════════════════════════
MENGAPA PEMERIKSAAN INI ADA
═══════════════════════════════════════════════════════════════════════════

  Seluruh pola di bawah ini ditemukan dari REKAMAN LAYAR seorang penguji yang
  memakai iPad Air 5. Artinya masalahnya sudah sampai ke pengguna sebelum
  ketahuan. Pemeriksa tata letak yang sudah ada (`periksa_tata_letak.py`)
  TIDAK menangkap satu pun dari mereka.

═══════════════════════════════════════════════════════════════════════════
MENGAPA HANYA SEDIKIT YANG DIPERIKSA
═══════════════════════════════════════════════════════════════════════════

  Versi pertama pemeriksa ini melaporkan 131 temuan — dan HAMPIR SEMUANYA
  POSITIF PALSU. Contohnya label "70 BPM" ditandai karena memakai
  `whitespace-nowrap` tanpa batas lebar, padahal teks sependek itu memang
  tidak perlu membungkus.

  Pemeriksa yang berisik lebih buruk daripada tidak ada pemeriksa: hasilnya
  diabaikan, lalu masalah yang sungguhan ikut terabaikan.

  Karena itu pemeriksa ini SENGAJA SEMPIT. Ia hanya memeriksa pola yang
  dapat dipastikan salah tanpa melihat gambarnya. Pola lain yang hanya
  "mencurigakan" sengaja TIDAK diperiksa di sini.

═══════════════════════════════════════════════════════════════════════════
YANG DIPERIKSA
═══════════════════════════════════════════════════════════════════════════

  1. TINGGI LAYAR TANPA PENDAMPING dvh
     `h-screen`/`min-h-screen` berarti 100vh, yang MENGHITUNG wilayah
     tertutup bilah peramban. Di iPad lanskap, bilah alamat dan tab memakan
     ~100px, sehingga isi di tepi atas atau bawah halaman TERPOTONG.
     DIPASTIKAN salah: ini murni soal satuan, bukan soal selera.

  2. GAYA SEBARIS `width: <angka>px`
     Gaya sebaris MENGALAHKAN setiap kelas responsif. Papan Profil terkunci
     680px karena ini, sehingga hanya memakai 66% lebar iPad, dan tidak ada
     kelas responsif yang dapat menolongnya.
     DIPASTIKAN salah: gaya sebaris selalu menang.

  3. ELEMEN `fixed bottom-*` TANPA JARAK KIRI MAUPUN KANAN
     Elemen seperti ini KEHILANGAN acuannya lalu terpusat secara bawaan
     (karena induknya sering `items-center`), sehingga menimpa elemen lain
     di dekatnya tanpa disengaja. Notifikasi Profil bertabrakan dengan kartu
     PWA karena ini.
     DIPASTIKAN salah: posisi mendatarnya menjadi tidak ditentukan penulisnya.

  4. LABEL PELACAK MISI TANPA BATAS LEBAR
     Khusus `JourneyProgressTracker`: kedelapan labelnya berjarak hanya
     ~97px, sedangkan "Divergen", "Konvergen", dan "Transform" lebih lebar
     dari itu. Tanpa batas lebar, label terakhir memanjang keluar bar lalu
     terpotong menjadi "Trans...".
     DIPASTIKAN salah: jaraknya terlalu rapat untuk teks sepanjang itu.

  Pola yang TIDAK diperiksa karena terlalu banyak positif palsu:
    - `whitespace-nowrap` pada umumnya (banyak teks memang pendek)
    - baris `flex` tanpa `wrap` (sebagian memang tidak perlu membungkus)
    - `overflow-hidden` yang memuat area gulir (sebagian disengaja)

═══════════════════════════════════════════════════════════════════════════
CARA PAKAI
═══════════════════════════════════════════════════════════════════════════
    python scripts/periksa_responsif.py
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

# Elemen yang MEMANG dipusatkan atau ditempel ke tepi — bukan kesalahan.
PUNYA_ACUAN_MENDATAR = (
    "left-", "right-", "inset-x-", "left-[", "right-[",
)


def main() -> int:
    temuan: dict[str, list[tuple[str, int, str]]] = {}

    def catat(pola: str, f: Path, baris: int, isi: str):
        temuan.setdefault(pola, []).append(
            (f.relative_to(ROOT).as_posix(), baris, isi[:110])
        )

    for f in sorted(SRC.rglob("*.tsx")):
        for n, baris in enumerate(
            f.read_text(encoding="utf-8", errors="ignore").split("\n"), 1
        ):
            isi = baris.strip()
            if isi.startswith(("//", "*", "/*")):
                continue

            # ── 1. Tinggi layar tanpa pendamping dvh ──────────────────────
            for dasar, pendamping in (
                ("min-h-screen", "min-h-[100dvh]"),
                ("h-screen", "h-[100dvh]"),
                ("w-screen", "w-[100dvw]"),
            ):
                if not re.search(rf"(?<![\w-]){re.escape(dasar)}(?![\w-])", baris):
                    continue
                if pendamping in baris:
                    continue
                # `min-h-screen` memuat `h-screen`; satu pendamping sudah cukup.
                if dasar == "h-screen" and "min-h-[100dvh]" in baris:
                    continue
                catat("tinggi layar tanpa pendamping dvh", f, n, isi)

            # ── 2. Gaya sebaris lebar angka tetap ────────────────────────
            # `(?<![-a-z])` mencegah `max-width: 680px` dan `min-width: ...`
            # ikut tertangkap. Keduanya BATAS ATAS/BAWAH, bukan lebar yang
            # memaksa; banyak dipakai sah, termasuk pada CSS jendela cetak.
            if re.search(r"(?<![-a-z])width:\s*['\"]?\d{3,}px", baris):
                catat("gaya sebaris lebar tetap", f, n, isi)

            # ── 3. fixed bottom tanpa jarak kiri/kanan ───────────────────
            if "fixed" in baris and "bottom-" in baris:
                if not any(x in baris for x in PUNYA_ACUAN_MENDATAR):
                    catat("fixed bottom tanpa jarak sisi", f, n, isi)

            # ── 5. Ukuran kanvas dari jendela, bukan dari wadah ──────────
            #
            # Mengukur kanvas dengan `window.innerWidth`/`innerHeight` lalu
            # hanya mendengarkan `resize` membuat kanvas TIDAK menyesuaikan
            # saat panel samping peramban dibuka atau ditutup — di Safari iOS
            # peristiwa `resize` tidak selalu terkirim untuk perubahan itu.
            # Akibatnya sebagian layar menjadi HITAM.
            #
            # Seluruh logika ukuran kanvas harus memakai `useUkuranKanvas`
            # (src/hooks/useUkuranKanvas.ts), yang mengukur wadahnya dan
            # memantau lewat ResizeObserver + orientationchange +
            # visualViewport.
            #
            # CATATAN: versi pertama butir ini juga menandai setiap
            # `canvas.width = ...`, dan itu menghasilkan EMPAT positif palsu
            # pada `Merapi3DScene` yang memakai kanvas ukuran TETAP (512x160
            # dan 1024x1024) untuk tekstur. Kanvas tetap memang tidak perlu
            # menyesuaikan layar. Karena itu yang diperiksa HANYA ukuran yang
            # berasal dari jendela.
            if "window.innerWidth" in baris or "window.innerHeight" in baris:
                if re.search(r"canvas\.(style\.)?(width|height)", baris):
                    catat("ukuran kanvas dari jendela", f, n, isi)

        # ── 4. Label pelacak misi tanpa batas lebar ──────────────────────
        #
        # Dua cara sebelumnya gagal, dan keduanya karena mencari `className`
        # di tempat yang salah:
        #
        #   - versi pertama memakai jendela 900 aksara sebelum penanda, dan
        #     menemukan `className` milik elemen SEBELUMNYA
        #   - versi kedua menghitung `{area.metricLabel}` di seluruh berkas,
        #     padahal salah satunya berada di dalam keterangan melayang
        #     (`<span className="...">({areas[hoveredIndex].metricLabel})</span>`)
        #     yang memang tidak perlu dibatasi lebarnya
        #
        # Cara yang tepat: periksa HANYA elemen label pada titik pelacak,
        # yaitu elemen yang memuat `{area.metricLabel}` dan berada di dalam
        # tombol titik. Elemen itu ditandai oleh `-bottom-5`.
        if f.name == "JourneyProgressTracker.tsx":
            teks = f.read_text(encoding="utf-8", errors="ignore")
            # Label titik dapat ditulis sebagai string biasa (`className="..."`)
            # MAUPUN sebagai template literal (`className={`...`}`). Versi
            # pertama pemeriksa ini hanya mengenali bentuk pertama, sehingga
            # setelah label dipindah ke lapisan terpisah ia MELAPORKAN TEMUAN
            # PALSU: "tidak ditemukan kelas label titik".
            label_titik = re.findall(r'className="([^"]*-bottom-5[^"]*)"', teks)
            label_titik += re.findall(r'className=\{`([^`]*-bottom-5[^`]*)`\}', teks)
            if not label_titik:
                catat(
                    "label pelacak tanpa batas lebar",
                    f,
                    0,
                    "tidak ditemukan kelas label titik (-bottom-5)",
                )
            else:
                for kelas in label_titik:
                    # Kriteria lulus (salah satu):
                    #   a. ada batas lebar eksplisit (`w-[N%]`), ATAU
                    #   b. memakai `truncate` — teks dipotong dengan "…"
                    #      sehingga tidak dapat memanjang keluar bar.
                    # Ditambah: label harus disembunyikan di layar sempit
                    # (`hidden` + `md:block`), karena di sana tidak ada cara
                    # delapan label muat.
                    punya_batas = bool(re.search(r"w-\[\d+%\]", kelas)) or "truncate" in kelas
                    disembunyikan = "hidden" in kelas and "md:block" in kelas
                    if not (punya_batas and disembunyikan):
                        baris = teks.split("\n")
                        nomor = next(
                            (
                                i
                                for i, l in enumerate(baris, 1)
                                if kelas[:50] in l
                            ),
                            0,
                        )
                        catat(
                            "label pelacak tanpa batas lebar",
                            f,
                            nomor,
                            kelas[:110],
                        )

    # ── Laporan ──────────────────────────────────────────────────────────
    total = sum(len(v) for v in temuan.values())
    print("=" * 78)
    print("  PEMERIKSAAN RESPONSIF — pola yang DIPASTIKAN merusak layar sempit")
    print("=" * 78)

    if not temuan:
        print("\n  Tidak ada temuan.\n")
        print("=" * 78)
        return 0

    for pola, daftar in temuan.items():
        print(f"\n  ── {pola} ({len(daftar)}) ──")
        for berkas, baris, isi in daftar[:15]:
            print(f"    {berkas}:{baris}")
            print(f"      {isi}")
        if len(daftar) > 15:
            print(f"    … dan {len(daftar) - 15} lagi")

    print("\n" + "=" * 78)
    print(f"  HASIL: {total} temuan")
    print("=" * 78)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
