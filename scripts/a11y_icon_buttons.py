#!/usr/bin/env python
"""
Cari <button> yang benar-benar tanpa nama untuk pembaca layar.

RIWAYAT KESALAHAN — KENAPA VERSI INI BERBEDA
  Menentukan "tombol ini punya nama atau tidak" ternyata memerlukan empat
  perbaikan berturut-turut. Setiap versi memberi hasil yang berbeda:

  v1  Pola `[^>]*` untuk membaca tag.
      Berhenti pada `>` di dalam `=>`. -> 40 tombol, banyak positif palsu.

  v2  Membuang seluruh isi `{...}`.
      Tombol seperti `{role === 'teacher' ? 'POSKO GURU' : 'PROFIL'}` memang
      menampilkan teks, tetapi teksnya dibuang. -> tetap salah.

  v3  Mengambil literal string dari dalam `{...}`.
      Memperbaiki kasus di atas, tetapi ekspresi seperti `{cls.name}` dan
      `{t('common.home')}` tetap dianggap kosong. Padahal keduanya
      MENAMPILKAN TEKS — hanya saja yang ditampilkan adalah nilai sebuah
      variabel atau hasil pemanggilan fungsi. -> 45 tombol, masih salah.

  v4  (VERSI INI) Mengenali empat bentuk isi yang menghasilkan teks:
        • teks langsung
        • literal string di dalam ekspresi   {'MULAI'}
        • variabel / akses properti          {cls.name}, {tab.label}
        • pemanggilan fungsi                 {t('common.home')}
      Hanya ekspresi yang benar-benar tidak menghasilkan teks — seperti
      `{loading && <Spinner/>}` atau `{onClick}` — yang dianggap kosong.

  Kesimpulannya: memakai pola teks untuk menganalisis JSX mudah menyesatkan,
  dan setiap perbaikan harus diverifikasi pada contoh nyata, bukan sekadar
  dipercaya dari jumlahnya.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from jsx_scan import akhir_tag  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

SIMBOL_DEKORATIF = "▶▷⏸⏹✕×➔→←↑↓•·"

# Nama kelas/atribut CSS yang sering muncul sebagai literal dan bukan teks
BUKAN_TEKS = re.compile(
    r"^(https?:|w-|h-|min-|max-|flex|grid|absolute|relative|fixed|text-|bg-|border|"
    r"rounded|shadow|px-|py-|p-|m-|gap-|font-|hidden|block|inline|items-|justify-|"
    r"overflow|z-|opacity|transition|animate-|cursor|select-|pointer|space-|"
    r"[a-z0-9\-_:/\[\]#%.]+)$"
)


def ekspresi_menghasilkan_teks(isi: str) -> bool:
    """Apakah isi sebuah `{...}` akan menampilkan teks kepada pengguna?

    PENTING: menganggap SEMUA variabel sebagai teks ternyata juga salah.
    `{cls.name}` dan `{tab.label}` memang menampilkan teks, tetapi
    `{currentUser?.role === 'teacher'}` hanya perbandingan, dan `{16}`
    hanyalah ukuran ikon. Keduanya tidak menghasilkan teks.

    Karena sulit membedakan keduanya tanpa menjalankan kode, aturan di sini
    sengaja MEMILIH SALAH SATU ARAH YANG AMAN: hanya pola yang sudah terbukti
    menampilkan teks yang dianggap teks. Sisanya dianggap tidak, sehingga
    tombol yang meragukan tetap DIPERIKSA MANUSIA — lebih baik memeriksa
    beberapa tombol berlebih daripada melewatkan tombol tanpa nama.
    """
    s = isi.strip()
    if not s:
        return False

    # 1. Literal string yang wajar sebagai teks tampilan
    for m in re.finditer(r"'([^'\\]{2,})'|\"([^\"\\]{2,})\"", s):
        lit = (m.group(1) or m.group(2)).strip()
        if lit and not BUKAN_TEKS.match(lit):
            return True

    # 2. Properti yang jelas berupa teks tampilan: {x.name}, {tab.label}, {p.title}
    if re.search(r"\.(name|label|title|desc|description|text|caption|badge)\b", s):
        return True

    # 3. Pemanggilan penerjemah: {t('common.home')}
    if re.search(r"\bt\s*\(", s):
        return True

    return False


def teks_terlihat(inner: str) -> str:
    """Teks yang didengar pembaca layar dari isi sebuah tombol."""
    bagian: list[str] = []
    i, n = 0, len(inner)
    while i < n:
        c = inner[i]

        if c == "<":
            akhir = inner.find(">", i)
            i = n if akhir < 0 else akhir + 1

        elif c == "{":
            dalam = 1
            j = i + 1
            while j < n and dalam:
                ch = inner[j]
                if ch in "\"'":
                    k = ch
                    j += 1
                    while j < n and inner[j] != k:
                        if inner[j] == "\\":
                            j += 1
                        j += 1
                elif ch == "{":
                    dalam += 1
                elif ch == "}":
                    dalam -= 1
                j += 1
            if ekspresi_menghasilkan_teks(inner[i + 1:j - 1]):
                bagian.append(" TEKS ")
            i = j

        else:
            bagian.append(c)
            i += 1

    teks = " ".join("".join(bagian).split())
    teks = "".join(ch for ch in teks if ch not in SIMBOL_DEKORATIF).strip()
    return teks


def nama_ikon(inner: str) -> str:
    m = re.search(r'<PixelIcon[^>]*\bname="([^"]+)"', inner)
    if m:
        return m.group(1)
    m = re.search(r"material-symbols[^>]*>\s*([A-Za-z_]+)\s*<", inner)
    if m:
        return m.group(1)
    return ""


def main() -> int:
    total = 0
    for berkas in sorted(SRC.rglob("*.tsx")):
        teks = berkas.read_text(encoding="utf-8")
        for m in re.finditer(r"<button\b", teks):
            akhir = akhir_tag(teks, m.start())
            if akhir < 0:
                continue
            tag = teks[m.start():akhir + 1]
            if "aria-label" in tag or "aria-labelledby" in tag:
                continue
            tutup = teks.find("</button>", akhir)
            if tutup < 0:
                continue
            inner = teks[akhir + 1:tutup]
            if teks_terlihat(inner):
                continue
            baris = teks.count("\n", 0, m.start()) + 1
            rel = berkas.relative_to(ROOT).as_posix()
            print(f"  {rel}:{baris}  ikon={nama_ikon(inner) or '(tak ada)'}")
            total += 1
    print(f"\n  TOTAL: {total} tombol tanpa nama")
    return 0


if __name__ == "__main__":
    sys.exit(main())
