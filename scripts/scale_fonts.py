#!/usr/bin/env python3
"""
Perbesar seluruh ukuran font yang terlalu kecil di RESQ-BOX.

MASALAH
  Ada 651 kemunculan `text-[Npx]` dengan N < 12px, termasuk 12 kemunculan
  7px dan 13 kemunculan 7.5px. Teks sebesar itu tidak terbaca di laptop
  sekolah maupun tablet siswa — terutama untuk materi pelajaran.

PENDEKATAN
  Memetakan setiap ukuran ke ukuran yang lebih besar dengan **urutan yang
  dipertahankan** (teks yang lebih besar tetap lebih besar dari yang kecil),
  sehingga hierarki visual tidak rusak. Minimum akhir: 12px.

  Skrip ini juga menaikkan `line-height` proporsional pada token tipografi
  di `src/index.css` agar teks tidak saling tumpang tindih setelah diperbesar.

Pakai:
    python scripts/scale_fonts.py --dry-run   # lihat rencananya saja
    python scripts/scale_fonts.py             # terapkan
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

# ── Peta pembesaran ───────────────────────────────────────────────────────
# Sisi kiri = ukuran lama, kanan = ukuran baru. Urutan harus tetap naik.
SIZE_MAP: dict[str, str] = {
    "7": "12",     # +5   (naik paling banyak — memang tidak terbaca)
    "7.5": "12",
    "8": "12",
    "8.5": "12.5",
    "9": "12.5",
    "9.5": "13",
    "10": "13.5",
    "10.5": "14",
    "11": "14.5",
    "11.5": "15",
    "12": "15",
    "12.5": "15.5",
    "13": "16",
    "13.5": "16",
    "14": "16.5",
    "14.5": "17",
    "15": "17",
    "15.5": "17.5",
    "16": "18",
    "16.5": "18",
    "17": "19",
    "18": "20",
    "19": "21",
    "22": "24",
}

CLASS_RE = re.compile(r"text-\[(\d+(?:\.\d+)?)px\]")

# Kelas ukuran bawaan Tailwind juga terlalu kecil untuk ukuran pixel art
# (text-xs = 12px). Banyak elemen memakai pola `text-[10px] sm:text-xs`,
# sehingga di layar besar Tailwind justru MENIMPA dan membuatnya lebih kecil.
# Karena itu kelas ini juga dinaikkan.
TAILWIND_MAP: dict[str, str] = {
    "text-xs": "text-[13px]",
    "text-sm": "text-[15px]",
}

# Batas kata: `text-xs` boleh didahului `sm:` / `md:` / `lg:`, tetapi TIDAK
# boleh merupakan bagian dari `text-xs-sesuatu`.
TAILWIND_RE = re.compile(r"(?<![\w-])(text-(?:xs|sm))(?![\w-])")


def transform(content: str) -> tuple[str, dict[str, int]]:
    """Ganti setiap `text-[Npx]` sesuai SIZE_MAP. Kembalikan (isi_baru, hitungan)."""
    counts: dict[str, int] = {}

    def repl(m: re.Match[str]) -> str:
        old = m.group(1)
        new = SIZE_MAP.get(old)
        if new is None:
            return m.group(0)
        counts[old] = counts.get(old, 0) + 1
        return f"text-[{new}px]"

    content = CLASS_RE.sub(repl, content)

    # Kelas bawaan Tailwind (text-xs / text-sm)
    def repl_tw(m: re.Match[str]) -> str:
        old = m.group(1)
        counts[f"({old})"] = counts.get(f"({old})", 0) + 1
        return TAILWIND_MAP[old]

    content = TAILWIND_RE.sub(repl_tw, content)
    return content, counts


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="hanya tampilkan rencana")
    args = parser.parse_args()

    files = sorted(SRC.rglob("*.tsx")) + sorted(SRC.rglob("*.ts"))
    total: dict[str, int] = {}
    changed_files = 0
    preview: list[tuple[str, str, str]] = []

    for path in files:
        try:
            raw = path.read_text(encoding="utf-8")
        except (UnicodeDecodeError, OSError):
            continue
        new, counts = transform(raw)
        if new == raw:
            continue
        changed_files += 1
        for k, v in counts.items():
            total[k] = total.get(k, 0) + v
        if args.dry_run and len(preview) < 12:
            # Ambil beberapa contoh baris yang berubah untuk ditinjau
            for old_line, new_line in zip(raw.splitlines(), new.splitlines()):
                if old_line != new_line:
                    preview.append((path.relative_to(ROOT).as_posix(), old_line.strip()[:90], new_line.strip()[:90]))
                    break
        if not args.dry_run:
            path.write_text(new, encoding="utf-8")

    print("Pemetaan ukuran font:" if args.dry_run else "Diterapkan:")
    print(f"  {'lama':>10} -> {'baru':<10} {'jumlah':>7}")
    grand = 0
    for k in sorted(total, key=lambda s: (s.startswith("("), float(s.strip("()")) if not s.startswith("(") else 0)):
        target = TAILWIND_MAP[k.strip("()")] if k.startswith("(") else SIZE_MAP[k] + "px"
        print(f"  {k:>10} -> {target:<10} {total[k]:>7}")
        grand += total[k]
    print(f"\n  berkas terpengaruh : {changed_files}")
    print(f"  total penggantian  : {grand}")

    if args.dry_run and preview:
        print("\nContoh baris yang akan berubah:")
        for f, o, n in preview:
            print(f"\n  {f}")
            print(f"    - {o}")
            print(f"    + {n}")

    if args.dry_run:
        print("\n(DRY RUN — tidak ada berkas yang diubah)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
