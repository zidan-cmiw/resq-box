# -*- coding: utf-8 -*-
"""Cari nama fungsi tingkat modul yang juga dipakai sebagai variabel lokal."""
import ast
from pathlib import Path

masalah = 0
gagal_urai = 0
for f in sorted(Path("scripts").glob("*.py")):
    try:
        pohon = ast.parse(f.read_text(encoding="utf-8-sig"))
    except SyntaxError as e:
        # Berkas yang tidak dapat diurai TIDAK boleh dilewati diam-diam:
        # kalau dilewati, ringkasan akan salah menyatakan "bersih".
        gagal_urai += 1
        print(f"  [!] {f.name}: TIDAK DAPAT DIURAI - {e.msg} (baris {e.lineno})")
        continue

    fungsi_modul = {n.name for n in pohon.body if isinstance(n, (ast.FunctionDef, ast.AsyncFunctionDef))}
    if not fungsi_modul:
        continue

    for simpul in ast.walk(pohon):
        if not isinstance(simpul, (ast.FunctionDef, ast.AsyncFunctionDef)):
            continue
        lokal = set()
        for anak in ast.walk(simpul):
            if isinstance(anak, ast.Assign):
                for t in anak.targets:
                    if isinstance(t, ast.Name):
                        lokal.add(t.id)
            elif isinstance(anak, ast.AnnAssign) and isinstance(anak.target, ast.Name):
                        lokal.add(anak.target.id)
        bentrok = lokal & fungsi_modul
        if bentrok:
            masalah += 1
            print(f"  [X] {f.name}:{simpul.lineno} {simpul.name}() menimpa: {sorted(bentrok)}")

if masalah == 0 and gagal_urai == 0:
    print("\n  [v] BERSIH - tidak ada nama fungsi yang tertimpa")
else:
    print(f"\n  [!] {masalah} bentrok, {gagal_urai} berkas tidak dapat diurai")
    raise SystemExit(1)
