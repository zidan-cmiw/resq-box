#!/usr/bin/env python
"""
Pemindai tag JSX sederhana yang memahami konteks.

MENGAPA DIPERLUKAN
  Pola yang lazim dipakai untuk mencari tag, misalnya `<img\b[^>]*>`, SALAH
  pada JSX. Karakter `>` juga muncul di dalam nilai atribut, terutama pada
  panah fungsi:

      onError={(e) => { ... }}
                  ^^^ di sini ada `>` di dalam ekspresi

  Akibatnya pola itu berhenti di tengah tag. Dua kerugian nyata:

    • Audit memberi POSITIF PALSU. Tiga <img> di DiscoveryModal dilaporkan
      "tanpa alt" padahal ketiganya punya alt — alt-nya berada setelah
      onError yang memuat `=>`.
    • Skrip perbaikan yang memakai pola sama akan MEMOTONG tag dan merusak
      JSX. Ini sudah pernah terjadi dan menghasilkan 13 error TypeScript.

  Pemindai di bawah menghormati tiga konteks: tanda kutip ganda, tanda kutip
  tunggal, dan kurung kurawal berimbang. Dengan itu `>` hanya dianggap
  penutup tag bila benar-benar berada di luar ketiganya.
"""
from __future__ import annotations

import re


def akhir_tag(teks: str, mulai: int, batas: int | None = None) -> int:
    """Indeks `>` yang menutup tag mulai dari posisi `mulai`, atau -1.

    Posisi `mulai` harus menunjuk pada karakter `<` pembuka tag.
    """
    i = mulai
    n = len(teks) if batas is None else min(batas, len(teks))
    while i < n:
        c = teks[i]

        if c in "\"'":
            # Lompati isi string; `>` di dalam string bukan penutup tag
            kutip = c
            i += 1
            while i < n and teks[i] != kutip:
                if teks[i] == "\\":
                    i += 1
                i += 1

        elif c == "{":
            # Lompati ekspresi JSX secara berimbang; `=>` ada di dalam sini
            dalam = 1
            i += 1
            while i < n and dalam:
                ch = teks[i]
                if ch in "\"'":
                    k = ch
                    i += 1
                    while i < n and teks[i] != k:
                        if teks[i] == "\\":
                            i += 1
                        i += 1
                elif ch == "{":
                    dalam += 1
                elif ch == "}":
                    dalam -= 1
                i += 1
            continue

        elif c == ">":
            return i
        i += 1
    return -1


def tag_lengkap(teks: str, pos: int) -> str:
    """Teks lengkap satu tag mulai dari `pos` (termasuk `<` dan `>`)."""
    akhir = akhir_tag(teks, pos)
    if akhir < 0:
        return teks[pos:pos + 400]
    return teks[pos:akhir + 1]


def attribut(tag: str, nama: str) -> str | None:
    """Nilai atribut dari teks tag, atau None bila tidak ada.

    Mengembalikan string kosong untuk atribut tanpa nilai (mis. `disabled`).
    """
    import re
    m = re.search(rf"\b{re.escape(nama)}\b\s*=\s*(?:\"([^\"]*)\"|'([^']*)'|\{{([^}}]*)\}})", tag)
    if m:
        return m.group(1) or m.group(2) or m.group(3) or ""
    if re.search(rf"\b{re.escape(nama)}\b", tag):
        return ""
    return None


def punya(tag: str, nama: str) -> bool:
    return attribut(tag, nama) is not None


# ══════════════════════════════════════════════════════════════════════════
# Penentuan teks yang terlihat pada isi sebuah tombol
# ══════════════════════════════════════════════════════════════════════════
SIMBOL_DEKORATIF = "▶▷⏸⏹✕×➔→←↑↓•·"

# Pola yang jelas bukan teks tampilan, melainkan nama kelas atau nilai CSS
BUKAN_TEKS = re.compile(
    r"^(https?:|w-|h-|min-|max-|flex|grid|absolute|relative|fixed|text-|bg-|border|"
    r"rounded|shadow|px-|py-|p-|m-|gap-|font-|hidden|block|inline|items-|justify-|"
    r"overflow|z-|opacity|transition|animate-|cursor|select-|pointer|space-|"
    r"[a-z0-9\-_:/\[\]#%.]+)$"
)


def ekspresi_menghasilkan_teks(isi: str) -> bool:
    """Apakah isi sebuah `{...}` menampilkan teks kepada pengguna?

    Hanya pola yang sudah terbukti menampilkan teks yang dianggap teks.
    Aturan ini sengaja memilih arah yang aman: tombol yang meragukan tetap
    diperiksa manusia, karena lebih baik memeriksa beberapa tombol berlebih
    daripada melewatkan tombol yang benar-benar tanpa nama.
    """
    s = isi.strip()
    if not s:
        return False

    # Literal string yang wajar sebagai teks tampilan
    for m in re.finditer(r"'([^'\\]{2,})'|\"([^\"\\]{2,})\"", s):
        lit = (m.group(1) or m.group(2)).strip()
        if lit and not BUKAN_TEKS.match(lit):
            return True

    # Properti yang jelas berupa teks: {x.name}, {tab.label}, {p.title}
    if re.search(r"\.(name|label|title|desc|description|text|caption|badge)\b", s):
        return True

    # Pemanggilan penerjemah: {t('common.home')}
    if re.search(r"\bt\s*\(", s):
        return True

    return False


def teks_terlihat(inner: str) -> str:
    """Teks yang benar-benar didengar pembaca layar dari isi sebuah tombol."""
    import re as _re
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
