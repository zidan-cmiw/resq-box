#!/usr/bin/env python3
"""
Deteksi berkas mati (tidak diimpor siapa pun) di RESQ-BOX.

MENGAPA PENTING
  Berkas yang tidak diimpor siapa pun tetap membebani repositori dan
  menyulitkan pemeliharaan. Beberapa di antaranya cukup besar — misalnya
  engine 2D isometrik Level 2 (245 KB) yang sudah digantikan scene 3D, dan
  beberapa diagram yang sudah tidak dirujuk.

CARA KERJA
  1. Kumpulkan semua berkas sumber (.ts/.tsx) di src/.
  2. Kumpulkan semua target impor (relatif & alias) dari seluruh berkas.
  3. Tandai berkas yang tidak pernah menjadi target impor.
  4. Perkecualian yang TIDAK dianggap mati:
     - titik masuk (main.tsx, App.tsx, *.d.ts, vite-env.d.ts)
     - berkas uji (*.test.ts, __tests__/)
     - berkas di folder __tests__ atau fixtures

Pakai:
    python scripts/find_dead_files.py
    python scripts/find_dead_files.py --json
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

IMPORT_RE = re.compile(
    r"""(?:^|\n)\s*(?:import|export)\s[^;]*?from\s+['"]([^'"]+)['"]"""  # import ... from '...'
    r"""|import\s*\(\s*['"]([^'"]+)['"]\s*\)"""                          # import('...') — lazy()
    r"""|require\s*\(\s*['"]([^'"]+)['"]\s*\)"""                          # require('...')
    r"""|(?:^|\n)\s*import\s+['"]([^'"]+)['"]""",                        # import '...'
)

# Jejaring pengaman: rujukan berupa NAMA BERKAS di dalam string juga dihitung.
# Ini penting untuk pola `React.lazy(() => import('./Privacy'))` yang ditulis
# multi-baris, dan untuk impor yang dihasilkan secara dinamis. Tanpa ini,
# halaman yang benar-benar dipakai (mis. Privacy, NotFound) salah ditandai mati.
FILENAME_MENTION_RE = re.compile(r"""['"]([^'"]*[/\\])?([A-Za-z0-9_.-]+)['"]""")

ENTRY_FILES = {"main.tsx", "App.tsx", "vite-env.d.ts"}
SKIP_PARTS = ("__tests__", "fixtures", "test-utils")
SKIP_SUFFIX = (".test.ts", ".test.tsx", ".spec.ts", ".spec.tsx", ".d.ts")


def resolve(spec: str, from_file: Path) -> list[Path]:
    """Ubah spesifikasi impor menjadi daftar kandidat berkas."""
    if not spec.startswith("."):
        return []                              # paket node_modules — bukan berkas kita
    base = (from_file.parent / spec).resolve()
    cands: list[Path] = []
    for suffix in (".ts", ".tsx", ".d.ts"):
        cands.append(Path(str(base) + suffix))
    for name in ("index.ts", "index.tsx"):
        cands.append(base / name)
    cands.append(base)
    return cands


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--json", action="store_true", help="keluarkan JSON")
    args = parser.parse_args()

    all_files = sorted(
        p for p in list(SRC.rglob("*.ts")) + list(SRC.rglob("*.tsx"))
        if not any(part in p.parts for part in SKIP_PARTS)
        and not p.name.endswith(SKIP_SUFFIX)
    )

    imported: set[Path] = set()
    for path in list(SRC.rglob("*.ts")) + list(SRC.rglob("*.tsx")):
        try:
            text = path.read_text(encoding="utf-8")
        except (UnicodeDecodeError, OSError):
            continue

        # 1. Impor eksplisit
        specs: list[str] = []
        for m in IMPORT_RE.finditer(text):
            spec = m.group(1) or m.group(2) or m.group(3) or m.group(4)
            if spec:
                specs.append(spec)

        for spec in specs:
            if not spec.startswith("."):
                continue
            for cand in resolve(spec, path):
                if cand in all_files:
                    imported.add(cand)
                    break

        # 2. Jejaring pengaman: nama berkas disebut di dalam string apa pun.
        #    Menangkap `lazy(() => import('./Privacy'))` dan sejenisnya.
        for m in FILENAME_MENTION_RE.finditer(text):
            stem = m.group(2)
            if not stem or stem.startswith("."):
                continue
            for cand in all_files:
                if cand.stem == stem:
                    imported.add(cand)

    dead = [p for p in all_files if p not in imported and p.name not in ENTRY_FILES]

    # Kelompokkan per folder
    by_dir: dict[str, list[Path]] = {}
    for p in dead:
        key = p.parent.relative_to(SRC).as_posix() or "."
        by_dir.setdefault(key, []).append(p)

    total_bytes = sum(p.stat().st_size for p in dead)

    if args.json:
        print(json.dumps({
            "count": len(dead),
            "bytes": total_bytes,
            "files": [p.relative_to(ROOT).as_posix() for p in dead],
        }, indent=2))
        return 0

    print(f"BERKAS MATI (tidak diimpor siapa pun): {len(dead)} berkas, {total_bytes:,} B ({total_bytes/1024:.1f} KB)\n")
    for d in sorted(by_dir, key=lambda k: -sum(p.stat().st_size for p in by_dir[k])):
        files = sorted(by_dir[d], key=lambda p: -p.stat().st_size)
        size = sum(p.stat().st_size for p in files)
        print(f"  {d}/  — {len(files)} berkas, {size/1024:.1f} KB")
        for p in files:
            print(f"      {p.stat().st_size:>8,} B  {p.name}")
    print(f"\n  TOTAL: {len(dead)} berkas, {total_bytes/1024:.1f} KB")
    return 0


if __name__ == "__main__":
    sys.exit(main())
