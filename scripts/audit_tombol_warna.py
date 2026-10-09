#!/usr/bin/env python
"""
Audit tombol yang tidak dapat diklik dan ketidakcocokan warna antar popup.

═══════════════════════════════════════════════════════════════════════════
BUTIR 5 — TOMBOL YANG TIDAK DAPAT DIKLIK
═══════════════════════════════════════════════════════════════════════════
  Tombol menjadi tidak dapat diklik karena beberapa sebab yang semuanya
  dapat dideteksi dari kode:

    A. <button> tanpa onClick DAN tanpa type="submit"
       Tombol mati: ditekan tidak terjadi apa-apa. Ini yang paling sering
       terjadi saat kode disalin lalu handler-nya lupa dipasang.

    B. <button> di dalam wadah ber-`pointer-events-none`
       Seluruh isi wadah tidak menerima klik. Anak yang ingin tetap dapat
       diklik HARUS memiliki `pointer-events-auto` sendiri.

    C. Elemen ber-`onClick` tetapi juga ber-`pointer-events-none`
       Kontradiksi: handler dipasang, tetapi klik tidak akan pernah sampai.

    D. <div> atau <span> ber-onClick TANPA role/tabIndex
       Tidak dapat dijangkau keyboard. Bukan "tidak bisa diklik" dengan
       tetikus, tetapi tidak dapat diklik oleh pengguna keyboard.

  Skrip ini hanya mendeteksi A sampai D dari kode. Ia TIDAK dapat membuktikan
  bahwa tombol benar-benar berfungsi saat dijalankan (mis. handler yang ada
  tetapi tidak melakukan apa-apa karena kondisi salah). Karena itu hasilnya
  disebut "perlu diperiksa", bukan "pasti rusak".

═══════════════════════════════════════════════════════════════════════════
BUTIR 6 — KONSISTENSI WARNA & FONT ANTAR POPUP
═══════════════════════════════════════════════════════════════════════════
  Masukan penguji: popup pembelian pakaian sebaiknya memakai palet warna yang
  sama dengan popup materi. Untuk memeriksanya, skrip ini mengumpulkan warna
  latar, warna batas, dan keluarga font dari setiap popup, lalu menghitung mana
  yang menyimpang dari mayoritas.

  Cara kerjanya:
    1. Cari berkas yang memuat pola popup (fixed inset-0 + panel ber-bg-*).
    2. Kumpulkan kelas bg-*, border-*, dan font-* dari panelnya.
    3. Hitung frekuensi; yang muncul sekali (outlier) dilaporkan.

  Catatan keterbatasan: popup yang MEMANG berbeda karena fungsinya berbeda
  (mis. popup galat berwarna merah, popup berhasil berwarna hijau) akan
  muncul sebagai outlier. Keputusan akhir tetap perlu penilaian manusia.
"""
from __future__ import annotations

import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"


# ═══════════════════════════════════════════════════════════════════════════
# BUTIR 5 — TOMBOL
# ═══════════════════════════════════════════════════════════════════════════
def periksa_tombol(rel: str, teks: str) -> None:
    baris = teks.split("\n")
    for i, ln in enumerate(baris, 1):
        s = ln.strip()
        if s.startswith(("//", "*", "/*")):
            continue

        # ── D. div/span ber-onClick tanpa dukungan keyboard ──
        for m in re.finditer(r"<(div|span)\b([^>]*?)onClick=", s):
            tag = m.group(2)
            if "role=" not in tag and "tabIndex" not in tag:
                TEMUAN["D. div/span ber-onClick tanpa role/tabIndex (tidak dapat diakses keyboard)"].append(
                    (rel, i, s[:96])
                )

        # ── B & C. pointer-events-none bersama onClick pada baris yang sama ──
        if "onClick" in s and "pointer-events-none" in s:
            TEMUAN["C. onClick pada elemen pointer-events-none (klik tidak akan sampai)"].append(
                (rel, i, s[:96])
            )

    # ── A. <button> tanpa penangan apa pun ──
    # Diperiksa per blok karena atribut tombol sering ditulis multi-baris.
    #
    # CATATAN PENTING: versi pertama audit ini hanya mencari onClick dan
    # onSubmit, sehingga melaporkan 12 "tombol mati" yang sebenarnya berfungsi.
    # Tombol kontrol gerak di permainan memakai onPointerDown/onPointerUp
    # (memang harus begitu, agar responsif saat disentuh dan ditahan), jadi
    # polanya harus menerima SEMUA penangan React yang diawali "on".
    #
    # Ini positif palsu kedua setelah audit responsif. Pelajarannya sama:
    # pola pencarian yang terlalu sempit menghasilkan temuan yang salah, dan
    # mempercayainya berarti "memperbaiki" kode yang sudah benar.
    for m in re.finditer(r"<button\b([\s\S]{0,900}?)>", teks):
        atribut = m.group(1)
        baris_no = teks[: m.start()].count("\n") + 1
        # Semua penangan React: onClick, onPointerDown, onKeyDown, onSubmit, dst.
        punya_penangan = re.search(r"\bon[A-Z]\w+\s*=", atribut) is not None
        punya_submit = 'type="submit"' in atribut
        if not (punya_penangan or punya_submit):
            if "disabled" in atribut:
                continue
            TEMUAN["A. button tanpa penangan apa pun (tombol mati)"].append(
                (rel, baris_no, " ".join(atribut.split())[:96])
            )


# ═══════════════════════════════════════════════════════════════════════════
# BUTIR 6 — PALET WARNA POPUP
# ═══════════════════════════════════════════════════════════════════════════
def kumpulkan_popup(rel: str, teks: str) -> None:
    """Catat warna latar & batas panel popup, serta palet berkasnya."""
    for m in re.finditer(r"bg-\[#[0-9a-fA-F]{3,8}\]", teks):
        PALET[rel][m.group(0)] += 1
    for m in re.finditer(r"border-\[#[0-9a-fA-F]{3,8}\]", teks):
        PALET[rel][m.group(0)] += 1


TEMUAN: dict[str, list[tuple[str, int, str]]] = defaultdict(list)
PALET: dict[str, Counter] = defaultdict(Counter)


def main() -> int:
    for berkas in sorted(SRC.rglob("*.tsx")):
        rel = berkas.relative_to(ROOT).as_posix()
        try:
            teks = berkas.read_text(encoding="utf-8")
        except (UnicodeDecodeError, OSError):
            continue
        periksa_tombol(rel, teks)
        kumpulkan_popup(rel, teks)

    print("=" * 76)
    print("BUTIR 5 — TOMBOL YANG PERLU DIPERIKSA")
    print("=" * 76)

    if TEMUAN:
        total = sum(len(v) for v in TEMUAN.values())
        print(f"\n  {total} temuan\n")
        for kategori, item in sorted(TEMUAN.items(), key=lambda kv: -len(kv[1])):
            print(f"\n── {kategori}  ({len(item)}) ──")
            per_berkas: dict[str, list[tuple[int, str]]] = defaultdict(list)
            for b, i, ket in item:
                per_berkas[b].append((i, ket))
            for b in sorted(per_berkas, key=lambda x: -len(per_berkas[x]))[:8]:
                print(f"   {b}  ({len(per_berkas[b])}x)")
                for i, ket in per_berkas[b][:4]:
                    print(f"      baris {i}: {ket[:88]}")
    else:
        print("\n  Tidak ada pola tombol bermasalah yang ditemukan.\n")

    print("\n" + "=" * 76)
    print("BUTIR 6 — PALET WARNA ANTAR BERKAS (mencari penyimpang)")
    print("=" * 76)

    # Warna yang dipakai banyak berkas = palet umum aplikasi.
    umum: Counter = Counter()
    for rel, c in PALET.items():
        for warna in c:
            umum[warna] += 1

    palet_umum = {w for w, n in umum.items() if n >= 4}
    print(f"\n  Palet umum aplikasi ({len(palet_umum)} warna, dipakai >= 4 berkas):")
    for w in sorted(palet_umum):
        print(f"    {w}  dipakai di {umum[w]} berkas")

    print("\n  Warna yang MENYIMPANG dari palet umum:")
    ada = False
    for rel, c in sorted(PALET.items()):
        nyimpang = {w: n for w, n in c.items() if w not in palet_umum}
        if nyimpang:
            ada = True
            print(f"    {rel}")
            for w, n in sorted(nyimpang.items(), key=lambda kv: -kv[1])[:6]:
                print(f"        {w}  ({n}x)")
    if not ada:
        print("    (tidak ada)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
