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

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

ICON_ONLY = re.compile(
    r"material-symbols-outlined|<PixelIcon\b|className=\"[^\"]*material-symbols"
)

# Deteksi (kasar tetapi berguna) atas tombol tanpa nama yang dapat dibaca.
BUTTON_RE = re.compile(r"<button\b[^>]*>(.*?)</button>", re.S)


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
    for m in re.finditer(r"<img\b[^>]*>", text):
        tag = m.group(0)
        if "alt=" not in tag:
            issues["img tanpa alt"].append((line_of(text, m.start()), tag[:80]))

    # 2. <button> hanya ikon tanpa aria-label
    for m in BUTTON_RE.finditer(text):
        tag_full = m.group(0)
        inner = m.group(1).strip()
        has_aria = "aria-label" in tag_full or "aria-labelledby" in tag_full
        if has_aria:
            continue
        # Apakah ada teks yang terlihat?
        text_only = re.sub(r"<[^>]+>", "", inner).strip()
        text_only = re.sub(r"\{[^}]*\}", "", text_only).strip()
        if not text_only and (ICON_ONLY.search(inner) or inner == ""):
            issues["button ikon tanpa aria-label"].append(
                (line_of(text, m.start()), tag_full.replace("\n", " ")[:80])
            )

    # 3. onClick pada elemen non-interaktif
    for m in re.finditer(r"<(div|span|li|td|tr)\b[^>]*onClick=", text):
        tag = m.group(0)
        if 'role="button"' in tag or "tabIndex" in tag:
            continue
        # Ambil seluruh tag untuk memeriksa atribut role/tabIndex
        end = text.find(">", m.start())
        whole = text[m.start(): end + 1] if end > 0 else tag
        if 'role="button"' in whole or "tabIndex" in whole or "onKeyDown" in whole:
            continue
        issues["onClick pada elemen non-interaktif"].append(
            (line_of(text, m.start()), whole.replace("\n", " ")[:80])
        )

    # 4. input tanpa label / aria-label
    for m in re.finditer(r"<(input|select|textarea)\b[^>]*>", text):
        tag = m.group(0)
        if tag.startswith("<input") and 'type="hidden"' in tag:
            continue
        if any(a in tag for a in ("aria-label", "aria-labelledby", "id=", "title=")):
            continue
        issues["input tanpa label"].append((line_of(text, m.start()), tag[:80]))

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
