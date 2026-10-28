# -*- coding: utf-8 -*-
"""Fase 2: label kendali di Level 1 dan Level 2."""
import re
from pathlib import Path

KUNCI = {
    'id': {
        'common': [('readyHint', 'SIAP, SELESAIKAN TANTANGAN PENELITI DULU')],
        'level1': [
            ('radar', 'RADAR BUMI'),
            ('land', 'DARATAN (TUMBUKAN BENUA)'),
            ('ocean', 'LAUTAN & PANTAI (PALUNG)'),
            ('reset', 'ULANG'),
            ('replay', 'ULANG ANIMASI'),
            ('paused', 'SIMULASI DIJEDA'),
        ],
        'level2': [
            ('replaySim', 'ULANG SIMULASI'),
            ('jump', 'LONCAT'),
        ],
    },
    'en': {
        'common': [('readyHint', 'NOT YET — FINISH THE RESEARCHER CHALLENGE FIRST')],
        'level1': [
            ('radar', 'EARTH RADAR'),
            ('land', 'LAND (CONTINENT COLLISION)'),
            ('ocean', 'OCEAN & COAST (TRENCH)'),
            ('reset', 'RESET'),
            ('replay', 'REPLAY ANIMATION'),
            ('paused', 'SIMULATION PAUSED'),
        ],
        'level2': [
            ('replaySim', 'REPLAY SIMULATION'),
            ('jump', 'JUMP'),
        ],
    },
}

for bahasa, grup in KUNCI.items():
    p = Path(f'src/i18n/{bahasa}.ts')
    t = p.read_text(encoding='utf-8')
    for nama_grup, daftar in grup.items():
        pola = re.compile(rf"(  {nama_grup}: \{{\n)")
        m = pola.search(t)
        if not m:
            print(f"  [X] kelompok {nama_grup} tidak ada di {bahasa}.ts")
            continue
        tambahan = "".join(
            f"    {k}: '{v.replace(chr(39), chr(92) + chr(39))}',\n"
            for k, v in daftar if f"    {k}:" not in t
        )
        if not tambahan:
            continue
        t = t[:m.end()] + tambahan + t[m.end():]
        print(f"  [v] {bahasa}.ts: {len(tambahan.splitlines())} kunci {nama_grup}")
    p.write_text(t, encoding='utf-8')

# ── TectonicGame belum punya hook ────────────────────────────────────────
p = Path('src/app/Level2/engine/TectonicGame.tsx')
t = p.read_text(encoding='utf-8')
if 'useI18n' not in t:
    m = re.search(r"(export default function \w+\([^)]*\)\s*\{)", t)
    if m:
        t = t[:m.end()] + "\n  const { t } = useI18n();" + t[m.end():]
        imp = re.search(r"^import .*from 'react';$", t, re.M)
        t = t[:imp.end()] + "\nimport { useI18n } from '../../../i18n';" + t[imp.end():]
        print("  [v] TectonicGame: useI18n tersambung")
    else:
        print("  [X] komponen TectonicGame tidak ketemu")
else:
    print("  [i] TectonicGame sudah tersambung")
p.write_text(t, encoding='utf-8')

# ── Ganti teks ───────────────────────────────────────────────────────────
PEKERJAAN = {
    'src/app/Level1/EarthDive/EarthDiveGame.tsx': [
        ('<span className="tracking-wide">RADAR BUMI</span>',
         '<span className="tracking-wide">{t(\'level1.radar\')}</span>'),
        ('<span>DARATAN (TUMBUKAN BENUA)</span>', "<span>{t('level1.land')}</span>"),
        ('<span>LAUTAN & PANTAI (PALUNG)</span>', "<span>{t('level1.ocean')}</span>"),
        ('<span>ULANG</span>', "<span>{t('level1.reset')}</span>"),
        ('<span>ULANG ANIMASI</span>', "<span>{t('level1.replay')}</span>"),
        ('<span>SIMULASI DIJEDA</span>', "<span>{t('level1.paused')}</span>"),
        ('<span>SIAP, SELESAIKAN TANTANGAN PENELITI DULU</span>',
         "<span>{t('common.readyHint')}</span>"),
    ],
    'src/app/Level2/engine/TectonicGame.tsx': [
        ('<span className="hidden 2xl:inline">ULANG SIMULASI</span>',
         '<span className="hidden 2xl:inline">{t(\'level2.replaySim\')}</span>'),
        ('<span className="text-[12.5px] font-pixel-title mt-0.5 tracking-wider font-semibold">LONCAT</span>',
         '<span className="text-[12.5px] font-pixel-title mt-0.5 tracking-wider font-semibold">{t(\'level2.jump\')}</span>'),
        ('<span>SIAP, SELESAIKAN TANTANGAN PENELITI DULU</span>',
         "<span>{t('common.readyHint')}</span>"),
    ],
}

for path, daftar in PEKERJAAN.items():
    p = Path(path)
    t = p.read_text(encoding='utf-8')
    berhasil, gagal = 0, []
    for lama, baru in daftar:
        if lama in t:
            t = t.replace(lama, baru, 1)
            berhasil += 1
        else:
            gagal.append(lama[:50])
    p.write_text(t, encoding='utf-8')
    print(f"  {Path(path).name}: {berhasil} diganti" + (f", gagal: {gagal}" if gagal else ""))
