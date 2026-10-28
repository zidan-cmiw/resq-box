# -*- coding: utf-8 -*-
"""Fase 1 penerjemahan: halaman masuk, dashboard, dan Level 3.

Cara kerja:
  1. Menambah kunci baru ke `id.ts` dan `en.ts` pada kelompok yang sesuai.
  2. Menyambungkan `useI18n()` di ketiga komponen.
  3. Mengganti baris teks Indonesia yang berdiri sendiri menjadi `{t('kunci')}`.

Penggantian dilakukan PER BARIS dan hanya bila isi baris (setelah dipangkas)
sama persis dengan teks yang dicari. Ini menghindari penggantian liar pada
teks yang mirip, dan setiap kegagalan dilaporkan, bukan didiamkan.
"""
import re
from pathlib import Path

KUNCI_BARU = {
    'login': {
        'studentTab': ('AKUN SISWA', 'STUDENT ACCOUNT'),
        'teacherTab': ('AKUN GURU', 'TEACHER ACCOUNT'),
        'noAccount': ('Belum punya akun?', 'No account yet?'),
        'guestPlay': ('COBA TANPA LOGIN', 'TRY WITHOUT SIGNING IN'),
        'guestNote': (
            'Mainkan semua level tanpa akun. Kemajuan tidak tersimpan.',
            'Play every level without an account. Your progress is not saved.',
        ),
        'downloadHint': (
            'Unduh aplikasi untuk diorama fisik',
            'Download the app for the physical diorama',
        ),
    },
    'dashboard': {
        'teacherPost': ('POSKO GURU', 'TEACHER POST'),
        'switchAccount': ('GANTI AKUN', 'SWITCH ACCOUNT'),
        'tagline': ('Media Pembelajaran Lempeng Tektonik', 'Tectonic Plates Learning Media'),
        'level1': ('LEVEL 1', 'LEVEL 1'),
        'level2': ('LEVEL 2', 'LEVEL 2'),
        'level3': ('LEVEL 3', 'LEVEL 3'),
        'guide': ('PANDUAN & MISI', 'GUIDE & MISSIONS'),
        'credits': ('CREDITS', 'CREDITS'),
        'learningGuide': ('PETUNJUK BELAJAR', 'LEARNING GUIDE'),
        'about': ('TENTANG PLATFORM', 'ABOUT THE PLATFORM'),
    },
    'level3': {
        'mainMenu': ('MENU UTAMA', 'MAIN MENU'),
        'myProject': ('PROYEK SAYA', 'MY PROJECT'),
        'competency': ('KOMPETENSI YANG DICAPAI', 'SKILLS YOU WILL GAIN'),
        'situation': ('SITUASI KEBENCANAAN', 'DISASTER SITUATION'),
        'statusDone': ('STATUS: SUDAH SELESAI', 'STATUS: COMPLETED'),
        'statusReady': ('STATUS: SIAP DIKERJAKAN', 'STATUS: READY'),
        'back': ('KEMBALI', 'BACK'),
        'active': ('AKTIF', 'ACTIVE'),
    },
}

# Teks pada halaman yang diganti menjadi pemanggilan kamus.
GANTI = {
    'src/app/Login/index.tsx': [
        ('AKUN SISWA', "login.studentTab"),
        ('AKUN GURU', "login.teacherTab"),
        ('Belum punya akun?', "login.noAccount"),
        ('COBA TANPA LOGIN', "login.guestPlay"),
        ('Unduh aplikasi untuk diorama fisik', "login.downloadHint"),
    ],
    'src/app/Dashboard/index.tsx': [
        ('GANTI AKUN', "dashboard.switchAccount"),
        ('Media Pembelajaran Lempeng Tektonik', "dashboard.tagline"),
        ('PANDUAN & MISI', "dashboard.guide"),
        ('PETUNJUK BELAJAR', "dashboard.learningGuide"),
        ('TENTANG PLATFORM', "dashboard.about"),
    ],
    'src/app/Level3/index.tsx': [
        ('MENU UTAMA', "level3.mainMenu"),
        ('PROYEK SAYA', "level3.myProject"),
        ('KOMPETENSI YANG DICAPAI', "level3.competency"),
        ('SITUASI KEBENCANAAN', "level3.situation"),
        ('STATUS: SUDAH SELESAI', "level3.statusDone"),
        ('STATUS: SIAP DIKERJAKAN', "level3.statusReady"),
    ],
}

KOMPONEN = {
    'src/app/Login/index.tsx': 'export default function Login() {\n  const navigate = useNavigate();',
    'src/app/Dashboard/index.tsx': 'export default function Dashboard() {\n  const navigate = useNavigate();',
    'src/app/Level3/index.tsx': 'export default function Level3() {\n',
}


def sisip_kunci(path: str, kelompok: str, kunci: dict, indeks_teks: int, komentar: str):
    """Tambahkan kunci ke kelompok tertentu pada kamus."""
    p = Path(path)
    t = p.read_text(encoding='utf-8')
    if f"{kelompok}: {{" not in t:
        print(f"    [X] kelompok '{kelompok}' tidak ada di {Path(path).name}")
        return 0
    baris = []
    for nama, nilai in kunci.items():
        teks = nilai[indeks_teks].replace("'", "\\'")
        baris.append(f"    {nama}: '{teks}',")
    sisip = "\n".join(baris)
    pola = re.compile(rf"(  {kelompok}: \{{\n)")
    m = pola.search(t)
    if not m:
        print(f"    [X] pola kelompok '{kelompok}' tidak cocok di {Path(path).name}")
        return 0
    t = t[:m.end()] + sisip + "\n" + t[m.end():]
    p.write_text(t, encoding='utf-8')
    print(f"    [v] {Path(path).name}: {len(kunci)} kunci ditambahkan ke '{kelompok}'")
    return len(kunci)


print("1) Menambah kunci kamus")
for kel, isi in KUNCI_BARU.items():
    sisip_kunci('src/i18n/id.ts', kel, isi, 0, kel)
    sisip_kunci('src/i18n/en.ts', kel, isi, 1, kel)


print("2) Menyambungkan useI18n")
for path, anchor in KOMPONEN.items():
    p = Path(path)
    t = p.read_text(encoding='utf-8')
    if "useI18n" in t:
        print(f"    [i] {Path(path).name} sudah tersambung")
        continue
    if anchor not in t:
        print(f"    [X] anchor komponen tidak ketemu di {Path(path).name}")
        continue
    t = t.replace(anchor, anchor + "\n  const { t } = useI18n();", 1)
    # impor
    m = re.search(r"^import .*from 'react';$", t, re.M)
    if m:
        t = t[:m.end()] + "\nimport { useI18n } from '../../i18n';" + t[m.end():]
    else:
        t = "import { useI18n } from '../../i18n';\n" + t
    p.write_text(t, encoding='utf-8')
    print(f"    [v] {Path(path).name}: useI18n tersambung")


print("3) Mengganti teks menjadi kunci kamus")
for path, daftar in GANTI.items():
    p = Path(path)
    t = p.read_text(encoding='utf-8')
    berhasil, gagal = 0, []
    for teks, kunci in daftar:
        pola = re.compile(r"^(\s*)" + re.escape(teks) + r"(\s*)$", re.M)
        baru, n = pola.subn(lambda m: f"{m.group(1)}{{t('{kunci}')}}{m.group(2)}", t, count=1)
        if n:
            t = baru
            berhasil += 1
        else:
            gagal.append(teks)
    p.write_text(t, encoding='utf-8')
    print(f"    {Path(path).name}: {berhasil} diganti" + (f", GAGAL: {gagal}" if gagal else ""))
