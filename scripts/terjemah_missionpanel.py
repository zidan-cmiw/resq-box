# -*- coding: utf-8 -*-
"""Fase 2: panel misi (MissionPanel) — berkas paling kecil, paling sering dilihat."""
import re
from pathlib import Path

KUNCI = {
    'id': [
        ('case', 'KASUS'),
        ('previous', 'SEBELUM'),
        ('checking', 'MENGECEK...'),
        ('validate', 'VALIDASI MISI!'),
        ('passed', 'MISI BERHASIL TUNTAS!'),
        ('failed', 'PERLU PENYESUAIAN BLOK'),
        ('guideLabel', 'PANDUAN LOKASI BLOK:'),
        ('feedbackTitle', 'Umpan balik Resqy'),
    ],
    'en': [
        ('case', 'CASE'),
        ('previous', 'PREVIOUS'),
        ('checking', 'CHECKING...'),
        ('validate', 'CHECK MISSION!'),
        ('passed', 'MISSION COMPLETE!'),
        ('failed', 'BLOCKS NEED FIXING'),
        ('guideLabel', 'BLOCK LOCATION GUIDE:'),
        ('feedbackTitle', 'Resqy feedback'),
    ],
}

for bahasa, daftar in KUNCI.items():
    p = Path(f'src/i18n/{bahasa}.ts')
    t = p.read_text(encoding='utf-8')
    if '  mission: {' in t:
        print(f"  [i] {bahasa}.ts sudah punya kelompok mission")
    else:
        baris = "\n".join(f"    {k}: '{v.replace(chr(39), chr(92) + chr(39))}'," for k, v in daftar)
        potongan = f"\n  // ── Panel misi ──\n  mission: {{\n{baris}\n  }},\n"
        i = t.rfind('} as const;')
        t = t[:i] + potongan + t[i:]
        p.write_text(t, encoding='utf-8')
        print(f"  [v] {bahasa}.ts: kelompok mission ditambahkan ({len(daftar)} kunci)")

# ── Sambungkan hook di MissionPanel ───────────────────────────────────────
p = Path('src/app/Workspace/MissionPanel.tsx')
t = p.read_text(encoding='utf-8')
if 'useI18n' not in t:
    anchor = "  const categoryObj = CATEGORIES.find((c) => c.id === mission.category);"
    if anchor in t:
        t = t.replace(anchor, "  const { t } = useI18n();\n\n" + anchor, 1)
    else:
        print("  [X] anchor hook tidak ketemu")
    m = re.search(r"^import .*from 'react';$", t, re.M)
    t = t[:m.end()] + "\nimport { useI18n } from '../../i18n';" + t[m.end():]
    print("  [v] useI18n tersambung")

# ── Ganti teks ────────────────────────────────────────────────────────────
GANTI = [
    ("{mission.category === 'proyek' ? 'KASUS' : 'LEVEL'} {mission.level}",
     "{mission.category === 'proyek' ? t('mission.case') : 'LEVEL'} {mission.level}"),
    ("{isPassed ? 'MISI BERHASIL TUNTAS!' : 'PERLU PENYESUAIAN BLOK'}",
     "{isPassed ? t('mission.passed') : t('mission.failed')}"),
    ("<span>SEBELUM</span>", "<span>{t('mission.previous')}</span>"),
    ("<span>LANJUT</span>", "<span>{t('common.next')}</span>"),
    ("{isChecking ? 'MENGECEK...' : 'VALIDASI MISI!'}",
     "{isChecking ? t('mission.checking') : t('mission.validate')}"),
    ("PANDUAN LOKASI BLOK:", "{t('mission.guideLabel')}"),
    ('judul="Umpan balik Resqy"', 'judul={t(\'mission.feedbackTitle\')}'),
]

berhasil, gagal = 0, []
for lama, baru in GANTI:
    if lama in t:
        t = t.replace(lama, baru, 1)
        berhasil += 1
    else:
        gagal.append(lama[:45])

p.write_text(t, encoding='utf-8')
print(f"  [v] MissionPanel: {berhasil} teks diganti" + (f", gagal: {gagal}" if gagal else ""))
