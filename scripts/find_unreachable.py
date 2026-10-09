#!/usr/bin/env python3
"""
Analisis keterjangkauan berkas dari titik masuk aplikasi.

MENGAPA INI DIPERLUKAN
  Memeriksa "tidak diimpor siapa pun" saja TIDAK cukup: sebuah berkas bisa
  diimpor oleh berkas lain yang — pada gilirannya — juga tidak pernah
  dijalankan. Contoh nyata di proyek ini:

      StrukturBumi.tsx     (tidak diimpor siapa pun)
        └── DepthGauge.tsx (diimpor, tetapi HANYA oleh StrukturBumi)

  DepthGauge tampak "dipakai", padahal tidak pernah dimuat. Karena itu yang
  benar adalah penelusuran dari TITIK MASUK, bukan sekadar pencarian impor.

TITIK MASUK
  src/main.tsx, lalu semua yang diimpor secara transitif (termasuk
  `React.lazy(() => import(...))` untuk rute).

Pakai:
    python scripts/find_unreachable.py
    python scripts/find_unreachable.py --keep <nama>   # kecualikan berkas
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

ENTRY = SRC / "main.tsx"

# Rujukan yang dihitung sebagai "dipakai":
#   from '...'  |  import('...')  |  require('...')  |  import '...'
REF_RE = re.compile(
    r"""(?:import|export)\s[^;]*?from\s+['"]([^'"]+)['"]"""
    r"""|import\s*\(\s*['"]([^'"]+)['"]\s*\)"""
    r"""|require\s*\(\s*['"]([^'"]+)['"]\s*\)"""
    r"""|(?:^|\n)\s*import\s+['"]([^'"]+)['"]""",
    re.M,
)
# Jejaring pengaman untuk impor yang ditulis multi-baris.
NAME_RE = re.compile(r"""['"]([^'"]*[/\\])?([A-Za-z0-9_.-]+)['"]""")

SKIP_PARTS = ("__tests__", "fixtures", "test-utils")
SKIP_SUFFIX = (".test.ts", ".test.tsx", ".spec.ts", ".spec.tsx", ".d.ts")


def resolve(spec: str, from_file: Path, all_stems: dict[str, Path]) -> Path | None:
    if spec.startswith("."):
        base = (from_file.parent / spec).resolve()
        for suffix in (".ts", ".tsx", ".d.ts"):
            cand = Path(str(base) + suffix)
            if cand.exists():
                return cand
        for name in ("index.ts", "index.tsx"):
            cand = base / name
            if cand.exists():
                return cand
        if base.exists() and base.is_file():
            return base
    else:
        # Nama berkas disebut tanpa path (mis. impor dinamis) — cari per stem.
        stem = Path(spec).name
        if stem in all_stems:
            return all_stems[stem]
    return None


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--keep", action="append", default=[], help="nama berkas yang dikecualikan")
    args = parser.parse_args()

    all_files = [
        p for p in list(SRC.rglob("*.ts")) + list(SRC.rglob("*.tsx"))
        if not any(part in p.parts for part in SKIP_PARTS)
        and not p.name.endswith(SKIP_SUFFIX)
    ]
    all_stems: dict[str, Path] = {}
    for p in all_files:
        all_stems.setdefault(p.stem, p)

    def refs_of(path: Path) -> set[Path]:
        try:
            text = path.read_text(encoding="utf-8")
        except (UnicodeDecodeError, OSError):
            return set()
        found: set[Path] = set()
        for m in REF_RE.finditer(text):
            spec = next((g for g in m.groups() if g), None)
            if not spec:
                continue
            r = resolve(spec, path, all_stems)
            if r:
                found.add(r)
        for m in NAME_RE.finditer(text):
            stem = m.group(2)
            if stem and stem in all_stems and all_stems[stem] is not path:
                found.add(all_stems[stem])
        return found

    # Penelusuran dari titik masuk
    reachable: set[Path] = set()
    stack = [ENTRY]
    while stack:
        cur = stack.pop()
        if cur in reachable or not cur.exists():
            continue
        reachable.add(cur)
        for r in refs_of(cur):
            if r not in reachable:
                stack.append(r)

    unreachable = sorted(set(all_files) - reachable)
    keep = set(args.keep)
    report = [p for p in unreachable if p.name not in keep]

    total = sum(p.stat().st_size for p in report)
    print(f"TITIK MASUK: {ENTRY.relative_to(ROOT).as_posix()}")
    print(f"Terjangkau  : {len(reachable)} berkas")
    print(f"TIDAK terjangkau: {len(unreachable)} berkas")
    if keep:
        print(f"Dikecualikan    : {len(unreachable) - len(report)}")
    print(f"\nDAFTAR BERKAS MATI ({len(report)} berkas, {total/1024:.1f} KB):\n")

    by_dir: dict[str, list[Path]] = {}
    for p in report:
        key = p.parent.relative_to(SRC).as_posix() or "."
        by_dir.setdefault(key, []).append(p)
    for d in sorted(by_dir, key=lambda k: -sum(p.stat().st_size for p in by_dir[k])):
        files = sorted(by_dir[d], key=lambda p: -p.stat().st_size)
        size = sum(p.stat().st_size for p in files)
        print(f"  {d}/  — {len(files)} berkas, {size/1024:.1f} KB")
        for p in files:
            print(f"      {p.stat().st_size:>8,} B  {p.name}")
    print(f"\n  TOTAL: {len(report)} berkas, {total/1024:.1f} KB")
    return 0


if __name__ == "__main__":
    sys.exit(main())
