# -*- coding: utf-8 -*-
"""Lanjutan Fase 1: kelompok kamus yang belum ada + teks yang belum terganti."""
import re
from pathlib import Path

# ── 1. Kelompok kamus yang belum ada ──────────────────────────────────────
GRUP_BARU = {
    'id': {
        'dashboard': [
            ('teacherPost', 'POSKO GURU'),
            ('switchAccount', 'GANTI AKUN'),
            ('tagline', 'Media Pembelajaran Lempeng Tektonik'),
            ('guide', 'PANDUAN & MISI'),
            ('learningGuide', 'PETUNJUK BELAJAR'),
            ('about', 'TENTANG PLATFORM'),
            ('credits', 'CREDITS'),
        ],
        'level3': [
            ('mainMenu', 'MENU UTAMA'),
            ('myProject', 'PROYEK SAYA'),
            ('competency', 'KOMPETENSI YANG DICAPAI'),
            ('situation', 'SITUASI KEBENCANAAN'),
            ('statusDone', 'STATUS: SUDAH SELESAI'),
            ('statusReady', 'STATUS: SIAP DIKERJAKAN'),
            ('back', 'KEMBALI'),
            ('active', 'AKTIF'),
        ],
    },
    'en': {
        'dashboard': [
            ('teacherPost', 'TEACHER POST'),
            ('switchAccount', 'SWITCH ACCOUNT'),
            ('tagline', 'Tectonic Plates Learning Media'),
            ('guide', 'GUIDE & MISSIONS'),
            ('learningGuide', 'LEARNING GUIDE'),
            ('about', 'ABOUT THE PLATFORM'),
            ('credits', 'CREDITS'),
        ],
        'level3': [
            ('mainMenu', 'MAIN MENU'),
            ('myProject', 'MY PROJECT'),
            ('competency', 'SKILLS YOU WILL GAIN'),
            ('situation', 'DISASTER SITUATION'),
            ('statusDone', 'STATUS: COMPLETED'),
            ('statusReady', 'STATUS: READY'),
            ('back', 'BACK'),
            ('active', 'ACTIVE'),
        ],
    },
}

for bahasa, grup in GRUP_BARU.items():
    p = Path(f'src/i18n/{bahasa}.ts')
    t = p.read_text(encoding='utf-8')
    if f"  dashboard: {{" in t:
        print(f"  [i] {bahasa}.ts sudah punya kelompok dashboard")
        continue
    potongan = []
    for nama_grup, isi in grup.items():
        baris = "\n".join(f"    {k}: '{v.replace(chr(39), chr(92) + chr(39))}'," for k, v in isi)
        potongan.append(f"\n  // ── {'Dasbor' if bahasa == 'id' else 'Dashboard'} & Level 3 ──\n  {nama_grup}: {{\n{baris}\n  }},\n")
    penutup = t.rfind('} as const;')
    if penutup < 0:
        print(f"  [X] penutup kamus {bahasa}.ts tidak ketemu")
        continue
    t = t[:penutup] + "".join(potongan) + t[penutup:]
    p.write_text(t, encoding='utf-8')
    print(f"  [v] {bahasa}.ts: kelompok dashboard & level3 ditambahkan")

# ── 2. Teks yang masih tersisa (berbentuk <span>TEKS</span>) ──────────────
SISA = {
    'src/app/Login/index.tsx': [
        ('<span>AKUN SISWA</span>', "<span>{t('login.studentTab')}</span>"),
        ('<span>AKUN GURU</span>', "<span>{t('login.teacherTab')}</span>"),
    ],
    'src/app/Dashboard/index.tsx': [
        ('<span className="hidden sm:inline">GANTI AKUN</span>',
         '<span className="hidden sm:inline">{t(\'dashboard.switchAccount\')}</span>'),
        ('<span>PANDUAN & MISI</span>', "<span>{t('dashboard.guide')}</span>"),
        ('<span>PETUNJUK BELAJAR</span>', "<span>{t('dashboard.learningGuide')}</span>"),
    ],
    'src/app/Level3/index.tsx': [
        ('<span>MENU UTAMA</span>', "<span>{t('level3.mainMenu')}</span>"),
        ('<span>PROYEK SAYA</span>', "<span>{t('level3.myProject')}</span>"),
    ],
}

for path, daftar in SISA.items():
    p = Path(path)
    t = p.read_text(encoding='utf-8')
    berhasil, gagal = 0, []
    for lama, baru in daftar:
        if lama in t:
            t = t.replace(lama, baru, 1)
            berhasil += 1
        else:
            gagal.append(lama[:40])
    p.write_text(t, encoding='utf-8')
    print(f"  {Path(path).name}: {berhasil} diganti" + (f", gagal: {gagal}" if gagal else ""))
