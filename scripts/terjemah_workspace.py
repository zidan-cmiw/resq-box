# -*- coding: utf-8 -*-
"""Fase 2: ruang kerja Level 3 (Workspace)."""
import re
from pathlib import Path

KUNCI = {
    'id': [
        ('levelMap', 'PETA LEVEL 3'),
        ('mission', 'MISI'),
        ('start', 'MULAI'),
        ('stop', 'BERHENTI'),
        ('mapLoading', 'MEMUAT PETA DIORAMA 3D MITIGASI BENCANA...'),
        ('mapError', 'TERJADI KENDALA PADA TAMPILAN PETA DIORAMA.'),
    ],
    'en': [
        ('levelMap', 'LEVEL 3 MAP'),
        ('mission', 'MISSION'),
        ('start', 'START'),
        ('stop', 'STOP'),
        ('mapLoading', 'LOADING THE 3D DISASTER MAP...'),
        ('mapError', 'SOMETHING WENT WRONG WITH THE DIORAMA MAP.'),
    ],
}

for bahasa, daftar in KUNCI.items():
    p = Path(f'src/i18n/{bahasa}.ts')
    t = p.read_text(encoding='utf-8')
    baris = "\n".join(f"    {k}: '{v.replace(chr(39), chr(92) + chr(39))}'," for k, v in daftar)
    pola = re.compile(r"(  workspace: \{\n)")
    m = pola.search(t)
    if not m:
        print(f"  [X] kelompok workspace tidak ada di {bahasa}.ts")
        continue
    tambahan = ""
    for k, _ in daftar:
        if f"    {k}:" not in t:
            tambahan += f"    {k}: '{dict(daftar)[k].replace(chr(39), chr(92) + chr(39))}',\n"
    if tambahan:
        t = t[:m.end()] + tambahan + t[m.end():]
        p.write_text(t, encoding='utf-8')
        print(f"  [v] {bahasa}.ts: {len(tambahan.splitlines())} kunci workspace ditambahkan")
    else:
        print(f"  [i] {bahasa}.ts sudah lengkap")

# ── Sambungkan hook ───────────────────────────────────────────────────────
p = Path('src/app/Workspace/index.tsx')
t = p.read_text(encoding='utf-8')
if 'useI18n' not in t:
    m = re.search(r"(export default function \w+\([^)]*\)\s*\{)", t)
    if not m:
        raise SystemExit('  [X] deklarasi komponen tidak ketemu')
    t = t[:m.end()] + "\n  const { t } = useI18n();" + t[m.end():]
    imp = re.search(r"^import .*from 'react';$", t, re.M)
    t = t[:imp.end()] + "\nimport { useI18n } from '../../i18n';" + t[imp.end():]
    print("  [v] useI18n tersambung")

GANTI = [
    ('<span className="hidden sm:inline">PETA LEVEL 3</span>',
     '<span className="hidden sm:inline">{t(\'workspace.levelMap\')}</span>'),
    ('<span className="hidden sm:inline">MISI</span>',
     '<span className="hidden sm:inline">{t(\'workspace.mission\')}</span>'),
    ("<span>{isRunning ? 'BERHENTI' : 'MULAI'}</span>",
     "<span>{isRunning ? t('workspace.stop') : t('workspace.start')}</span>"),
    ('<span>MEMUAT PETA DIORAMA 3D MITIGASI BENCANA...</span>',
     "<span>{t('workspace.mapLoading')}</span>"),
    ('<span>TERJADI KENDALA PADA TAMPILAN PETA DIORAMA.</span>',
     "<span>{t('workspace.mapError')}</span>"),
]

berhasil, gagal = 0, []
for lama, baru in GANTI:
    if lama in t:
        t = t.replace(lama, baru, 1)
        berhasil += 1
    else:
        gagal.append(lama[:50])

p.write_text(t, encoding='utf-8')
print(f"  [v] Workspace: {berhasil} teks diganti" + (f", gagal: {gagal}" if gagal else ""))
