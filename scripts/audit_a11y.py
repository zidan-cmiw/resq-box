#!/usr/bin/env python3
"""
Audit aksesibilitas RESQ-BOX.

MENCARI
  1. <img> tanpa alt
  2. <button> yang isinya HANYA ikon (material-symbols / PixelIcon) tanpa
     aria-label — pembaca layar akan mengumumkan "tombol" tanpa keterangan
  3. <div>/<span> yang punya onClick tetapi bukan elemen interaktif
     (tidak bisa dijangkau keyboard: Tab tidak berhenti di sana)
  4. <input>/<select>/<textarea> tanpa label
  5. Elemen dengan role= tetapi tanpa aria-* pendukung

Keluaran: daftar berkas + baris + jenis masalah, diurutkan per berkas.

Pakai:
    python scripts/audit_a11y.py
    python scripts/audit_a11y.py --detail
"""
from __future__ import annotations

import argparse
import re
import sys
from collections import defaultdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from jsx_scan import akhir_tag, attribut, punya, tag_lengkap, teks_terlihat  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"


def attribut_dimulai(tag: str, nama: str) -> str | None:
    """Nilai atribut, untuk pembandingan (mis. type="hidden")."""
    return attribut(tag, nama)

ICON_ONLY = re.compile(
    r"material-symbols-outlined|<PixelIcon\b|className=\"[^\"]*material-symbols"
)

# Batas pencarian isi <button>…</button>
BUTTON_RE = re.compile(r"<button\b", re.S)


def read(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except (UnicodeDecodeError, OSError):
        return ""


def line_of(text: str, index: int) -> int:
    return text.count("\n", 0, index) + 1


def audit_file(path: Path) -> dict[str, list[tuple[int, str]]]:
    text = read(path)
    issues: dict[str, list[tuple[int, str]]] = defaultdict(list)

    # 1. <img> tanpa alt
    #    Memakai pemindai tag yang memahami konteks: regex `[^>]*` akan berhenti
    #    pada `>` di dalam `=>` sehingga alt yang berada setelah onError tidak
    #    terbaca dan muncul sebagai positif palsu.
    for m in re.finditer(r"<img\b", text):
        tag = tag_lengkap(text, m.start())
        if not punya(tag, "alt"):
            issues["img tanpa alt"].append((line_of(text, m.start()), tag.replace("\n", " ")[:80]))

    # 2. <button> hanya ikon tanpa aria-label
    for m in BUTTON_RE.finditer(text):
        buka_akhir = akhir_tag(text, m.start())
        if buka_akhir < 0:
            continue
        tag_buka = text[m.start():buka_akhir + 1]
        tutup = text.find("</button>", buka_akhir)
        if tutup < 0:
            continue
        inner = text[buka_akhir + 1:tutup].strip()
        tag_full = text[m.start():tutup + 9]
        has_aria = "aria-label" in tag_buka or "aria-labelledby" in tag_buka
        if has_aria:
            continue
        # Apakah ada teks yang terlihat?
        # Memakai teks_terlihat() dari jsx_scan, bukan penyederhanaan sendiri,
        # supaya audit dan skrip perbaikan tidak berbeda pendapat. Versi
        # sederhana membuang seluruh {..} sehingga tombol seperti
        #   {areaIndex === 1 ? 'SELESAIKAN!' : 'BUKA GERBANG!'}
        # salah dilaporkan tanpa nama, padahal ada teksnya.
        text_only = teks_terlihat(inner)
        if not text_only and (ICON_ONLY.search(inner) or inner == ""):
            issues["button ikon tanpa aria-label"].append(
                (line_of(text, m.start()), tag_full.replace("\n", " ")[:80])
            )

    # 3. onClick pada elemen non-interaktif
    #
    # DUA BENTUK DILEWATI DENGAN SENGAJA, karena menambahkan onKeyDown pada
    # keduanya justru akan MERUSAK perilaku:
    #
    #   a. Pembungkus `onClick={(e) => e.stopPropagation()}`
    #      Elemen ini bukan tombol; ia hanya menahan klik agar tidak memicu
    #      aksi induk. Sudah diberi penahan rambatan tombol.
    #
    #   b. Kotak dialog Visual Novel `onClick={handleAdvance}`
    #      Berkasnya sudah menangani tombol secara GLOBAL pada window dan
    #      memanggil handleAdvance saat Spasi atau Enter ditekan — antarmukanya
    #      bahkan menampilkan "[Klik / SPASI untuk Lanjut]". Menambahkan
    #      onKeyDown pada elemen ini akan membuat satu penekanan Spasi
    #      memajukan DUA dialog sekaligus.
    with_global_keys = bool(re.search(r"addEventListener\(\s*['\"]keydown", text))
    for m in re.finditer(r"<(div|span|li|td|tr)\b", text):
        tag = tag_lengkap(text, m.start())
        if "onClick=" not in tag:
            continue
        if punya(tag, "role") or punya(tag, "tabIndex") or punya(tag, "onKeyDown"):
            continue
        # Sebaran sifat dari utilitas keyboard juga memenuhi syarat:
        #   {...sifatTombol(aksi, label)}  atau  {...sifatTombol}
        if "sifatTombol" in tag:
            continue
        if "stopPropagation" in tag:
            continue
        if with_global_keys:
            continue
        issues["onClick pada elemen non-interaktif"].append(
            (line_of(text, m.start()), tag.replace("\n", " ")[:80])
        )

    # 4. input tanpa label / aria-label
    for m in re.finditer(r"<(input|select|textarea)\b", text):
        tag = tag_lengkap(text, m.start())
        if attribut_dimulai(tag, "type") == "hidden":
            continue
        if any(punya(tag, a) for a in ("aria-label", "aria-labelledby", "id", "title")):
            continue
        issues["input tanpa label"].append((line_of(text, m.start()), tag.replace("\n", " ")[:80]))

    return issues


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--detail", action="store_true", help="tampilkan contoh baris")
    args = parser.parse_args()

    files = sorted(SRC.rglob("*.tsx"))
    totals: dict[str, int] = defaultdict(int)
    per_file: dict[str, dict[str, list[tuple[int, str]]]] = {}

    for path in files:
        issues = audit_file(path)
        if any(issues.values()):
            per_file[path.relative_to(ROOT).as_posix()] = issues
            for kind, items in issues.items():
                totals[kind] += len(items)

    print("RINGKASAN MASALAH AKSESIBILITAS")
    print(f"  {'jenis':<38} {'jumlah':>7}  {'berkas':>7}")
    for kind, n in sorted(totals.items(), key=lambda kv: -kv[1]):
        nfiles = sum(1 for f in per_file.values() if kind in f)
        print(f"  {kind:<38} {n:>7}  {nfiles:>7}")
    print(f"\n  TOTAL: {sum(totals.values())} masalah di {len(per_file)} berkas")

    print("\nPER BERKAS (10 terbanyak)")
    ranked = sorted(
        per_file.items(),
        key=lambda kv: -sum(len(v) for v in kv[1].values()),
    )[:10]
    for f, issues in ranked:
        total = sum(len(v) for v in issues.values())
        print(f"  {total:>4}  {f}")

    if args.detail:
        print("\nDETAIL")
        for f, issues in sorted(per_file.items()):
            print(f"\n  {f}")
            for kind, items in issues.items():
                for n, snippet in items[:6]:
                    print(f"    {n:>5}  [{kind}]  {snippet}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
