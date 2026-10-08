#!/usr/bin/env python3
"""
Samakan seluruh rujukan font langsung di dalam SVG ke Plus Jakarta Sans.

MASALAH
  Diagram ilmiah merujuk font secara langsung lewat atribut `fontFamily=`,
  memakai empat keluarga berbeda: "Press Start 2P", "Inter", "Pixelify Sans",
  dan "sans-serif". Akibatnya satu diagram bisa memakai 2–3 font sekaligus,
  dan sebagian tampil sangat kecil karena Press Start 2P berbentuk kotak.

TINDAKAN
  Semua `fontFamily="..."` disamakan menjadi Plus Jakarta Sans, KECUALI
  "JetBrains Mono" (dipakai untuk angka/monospace) yang sengaja dipertahankan.

Pakai:
    python scripts/unify_fonts.py --dry-run
    python scripts/unify_fonts.py
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

TARGET = "'Plus Jakarta Sans', system-ui, sans-serif"

# Font yang SENGAJA dipertahankan (monospace untuk angka & kode).
KEEP = ("JetBrains Mono", "monospace")

FONT_ATTR_RE = re.compile(r'fontFamily=("([^"]*)"|\{`([^`]*)`\}|\'([^\']*)\')')


def pick(value: str) -> str:
    """Tentukan font pengganti untuk satu nilai fontFamily."""
    low = value.lower()
    if any(k.lower() in low for k in KEEP):
        return value  # biarkan monospace
    return TARGET


def transform(content: str) -> tuple[str, int]:
    count = 0

    def repl(m: re.Match[str]) -> str:
        nonlocal count
        inner = m.group(2) or m.group(3) or m.group(4) or ""
        new = pick(inner)
        if new == inner:
            return m.group(0)
        count += 1
        return f'fontFamily="{new}"'

    return FONT_ATTR_RE.sub(repl, content), count


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    files = sorted(SRC.rglob("*.tsx")) + sorted(SRC.rglob("*.ts"))
    total = 0
    changed = 0
    preview: list[tuple[str, str, str]] = []

    for path in files:
        try:
            raw = path.read_text(encoding="utf-8")
        except (UnicodeDecodeError, OSError):
            continue
        new, n = transform(raw)
        if n == 0 or new == raw:
            continue
        total += n
        changed += 1
        if args.dry_run:
            for old_line, new_line in zip(raw.splitlines(), new.splitlines()):
                if old_line != new_line:
                    preview.append(
                        (path.relative_to(ROOT).as_posix(), old_line.strip()[:95], new_line.strip()[:95])
                    )
                    break
        else:
            path.write_text(new, encoding="utf-8")

    mode = "DRY RUN — tidak ada berkas diubah" if args.dry_run else "DITERAPKAN"
    print(mode)
    print(f"  berkas terpengaruh : {changed}")
    print(f"  rujukan font diubah: {total}")

    if args.dry_run and preview:
        print("\nContoh sebelum/sesudah:")
        for f, o, n in preview[:14]:
            print(f"\n  {f}")
            print(f"    - {o}")
            print(f"    + {n}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
