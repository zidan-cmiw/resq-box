#!/usr/bin/env python
"""
Periksa apakah SETIAP fungsi guru membatasi akses ke kelas MILIKNYA SENDIRI.

═══════════════════════════════════════════════════════════════════════════
MENGAPA PEMERIKSAAN INI ADA
═══════════════════════════════════════════════════════════════════════════

  Rencana jangka panjangnya: RESQ-BOX dipakai di BANYAK SEKOLAH, dengan
  banyak akun guru. Setiap guru mengampu kelas yang berbeda, jadi:

      DATA GURU A  TIDAK BOLEH TERLIHAT OLEH GURU B

  Sebagian besar perlindungan itu sudah ada di KEBIJAKAN RLS:
  `can_read_student()` dan `is_class_member()` memeriksa
  `classrooms.teacher_username`, sehingga guru hanya menyentuh kelasnya.

  TETAPI fungsi SECURITY DEFINER melewati RLS. Fungsi-fungsi itu harus
  memeriksa izin SENDIRI. Bila satu saja lupa, seluruh perlindungan RLS
  menjadi sia-sia lewat jalur itu.

  Karena itu setiap fungsi guru diperiksa satu per satu di sini.

═══════════════════════════════════════════════════════════════════════════
YANG DIANGGAP PEMERIKSAAN IZIN
═══════════════════════════════════════════════════════════════════════════

  Fungsi dianggap AMAN bila memenuhi SEKURANGNYA SATU dari:

    1. Memuat `teacher_username = ...`  -> pembatasan kepemilikan kelas
    2. Memuat `is_teacher()`            -> hanya guru
    3. Memuat `is_admin`                -> jalur admin
    4. Memuat `is_class_member(...)`    -> keanggotaan kelas
    5. Memuat `can_read_student(...)`   -> hak baca murid

  Selain itu, ada DUA keadaan yang juga AMAN tetapi tidak dikenali oleh
  daftar di atas. Keduanya ditemukan dari positif palsu pada versi pertama:

    6. FUNGSI MURNI — tidak menyentuh tabel sama sekali.
       Contoh: `official_level_score` hanya menghitung angka dari argumennya:

           SELECT CASE WHEN p_level = 1 THEN ... END;

       Tidak ada `FROM public.<tabel>`, jadi tidak ada data yang dibaca.
       Tidak ada yang perlu dilindungi.

    7. TERBATAS PADA DIRI SENDIRI — memuat `id = auth.uid()` atau
       `student_id = auth.uid()`, sehingga hanya menyentuh baris milik
       pemanggil.
       Contoh: `get_my_progress` memakai `WHERE student_id = auth.uid()`,
       dan `update_my_teacher_profile` memakai `WHERE id = auth.uid()`.
       Guru A tidak dapat menyentuh data guru B lewat fungsi seperti ini,
       walaupun tidak ada pemeriksaan peran sama sekali.

  Positif palsu BERBAHAYA: pemeriksa yang sering salah akan diabaikan orang,
  dan justru temuan yang benar ikut terlewat. Karena itu kedua keadaan di
  atas dikenali di sini, bukan sekadar dilaporkan sebagai "perlu diperiksa".

═══════════════════════════════════════════════════════════════════════════
FUNGSI YANG MEMANG PUBLIK
═══════════════════════════════════════════════════════════════════════════

  `username_available` memang harus dapat dipanggil tanpa login, karena guru
  memeriksanya saat membuat akun siswa. Ia hanya menjawab benar/salah untuk
  SATU nama, jadi tidak dapat dipakai mencacah daftar.

  Fungsi seperti ini didaftarkan di DIPERBOLEHKAN_PUBLIK supaya tidak
  dilaporkan sebagai masalah.

═══════════════════════════════════════════════════════════════════════════
CARA MENJALANKAN
═══════════════════════════════════════════════════════════════════════════
  python scripts/periksa_izin_guru.py
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MIGRASI = ROOT / "supabase" / "migrations"

# Fungsi yang MENYENTUH data kelas / murid, jadi WAJIB punya pemeriksaan izin.
WAJIB_PERIKSA = [
    "teacher_create_student", "list_class_students", "list_class_submissions",
    "list_my_classrooms", "delete_my_student", "rename_my_classroom",
    "delete_my_classroom", "create_my_classroom", "class_code_info",
    "class_exists", "official_level_score", "get_my_profile",
    "get_my_progress", "update_my_teacher_profile",
]

# Fungsi bantu yang memang TIDAK perlu memeriksa izin sendiri, karena
# dipanggil dari fungsi lain atau hanya membaca data publik.
DIKECUALIKAN = {
    "can_read_student", "is_class_member", "is_teacher", "is_admin",
    "jwt_role", "check_rate_limit", "prune_rate_limits",
    "touch_updated_at", "guard_profile_privileges", "handle_new_auth_user",
    "custom_access_token_hook", "admin_promote_to_admin",
    "admin_set_unlocked_level", "admin_purge_legacy_password_hashes",
    "username_available", "legacy_account_exists",
}

TANDA_IZIN = [
    ("kepemilikan kelas", re.compile(r"teacher_username\s*=", re.I)),
    ("is_teacher()", re.compile(r"is_teacher\s*\(\s*\)", re.I)),
    ("is_admin", re.compile(r"is_admin", re.I)),
    ("is_class_member", re.compile(r"is_class_member\s*\(", re.I)),
    ("can_read_student", re.compile(r"can_read_student\s*\(", re.I)),
    # Terbatas pada diri sendiri: hanya menyentuh baris milik pemanggil.
    ("terbatas diri sendiri", re.compile(
        r"(?:\bid\b|student_id|user_id)\s*=\s*auth\.uid\s*\(\s*\)", re.I)),
]

# Fungsi yang memang harus dapat dipanggil tanpa login.
DIPERBOLEHKAN_PUBLIK = {
    "username_available",
}

# Fungsi yang SEDANG DIHAPUS karena membocorkan pencacahan kode kelas.
#
# `class_code_info` dan `class_exists` dapat dipanggil tanpa login dan
# mengembalikan nama kelas + nama sekolah untuk kode yang ditebak. Migrasi
# `11_tutup_pencacahan_kode_kelas.sql` menghapus keduanya.
#
# Selama migrasi itu BELUM dijalankan di server, kedua fungsi masih ada dan
# pemeriksa ini akan terus melaporkannya. Dicatat di sini supaya laporannya
# jelas: ini bukan masalah baru, melainkan sisa yang menunggu dihapus.
SEDANG_DIHAPUS = {
    "class_code_info": "11_tutup_pencacahan_kode_kelas.sql",
    "class_exists": "11_tutup_pencacahan_kode_kelas.sql",
}

# Pola yang menandakan fungsi MENYENTUH tabel.
POLA_TABEL = re.compile(r"\bFROM\s+(?:public\.)?\w+|\bJOIN\s+(?:public\.)?\w+", re.I)


def baca_semua() -> list[tuple[str, str]]:
    return [
        (f.name, f.read_text(encoding="utf-8", errors="ignore"))
        for f in sorted(MIGRASI.glob("*.sql"))
    ]


def definisi_terakhir(semua, nama: str):
    """Ambil definisi TERAKHIR sebuah fungsi (migrasi terbaru menang)."""
    pola_awal = re.compile(
        rf"CREATE\s+OR\s+REPLACE\s+FUNCTION\s+public\.{nama}\s*\(", re.I
    )
    hasil = None
    for berkas, teks in semua:
        posisi = 0
        while True:
            m = pola_awal.search(teks, posisi)
            if not m:
                break
            # Akhir fungsi = '$$;' pertama sesudah awal ini
            akhir = teks.find("$$;", m.end())
            if akhir == -1:
                break
            hasil = (berkas, teks[m.start():akhir + 3])
            posisi = akhir + 3
    return hasil


def main() -> int:
    semua = baca_semua()
    if not semua:
        print(f"  [X] Tidak ada migrasi di {MIGRASI}")
        return 1

    print("=" * 80)
    print("  PEMERIKSAAN IZIN: apakah fungsi guru membatasi ke kelas MILIKNYA?")
    print("=" * 80)
    print("")

    aman, murni, publik, dihapus, curiga, hilang = [], [], [], [], [], []

    for nama in sorted(set(WAJIB_PERIKSA) - DIKECUALIKAN):
        d = definisi_terakhir(semua, nama)
        if not d:
            hilang.append(nama)
            continue
        berkas, isi = d

        if nama in DIPERBOLEHKAN_PUBLIK:
            publik.append((nama, berkas))
            continue

        if nama in SEDANG_DIHAPUS:
            dihapus.append((nama, berkas, SEDANG_DIHAPUS[nama]))
            continue

        ada = [label for label, pola in TANDA_IZIN if pola.search(isi)]
        if ada:
            aman.append((nama, berkas, ada))
            continue

        # Keadaan 6: fungsi MURNI — tidak menyentuh tabel sama sekali,
        # sehingga tidak ada data yang perlu dilindungi.
        if not POLA_TABEL.search(isi):
            murni.append((nama, berkas))
            continue

        curiga.append((nama, berkas))

    print(f"  ── AMAN, memeriksa izin ({len(aman)}) ──")
    for nama, berkas, ada in aman:
        print(f"    [v] {nama:<26} {', '.join(ada)}")
        print(f"        sumber: {berkas}")

    if murni:
        print("")
        print(f"  ── AMAN, fungsi murni tanpa akses tabel ({len(murni)}) ──")
        for nama, berkas in murni:
            print(f"    [v] {nama:<26} tidak membaca tabel apa pun")
            print(f"        sumber: {berkas}")

    if publik:
        print("")
        print(f"  ── MEMANG PUBLIK, terbatas pada satu kueri ({len(publik)}) ──")
        for nama, berkas in publik:
            print(f"    [i] {nama:<26} dirancang dapat dipanggil tanpa login")
            print(f"        sumber: {berkas}")

    if dihapus:
        print("")
        print(f"  ── MENUNGGU DIHAPUS ({len(dihapus)}) ──")
        for nama, berkas, migrasi in dihapus:
            print(f"    [~] {nama:<26} membocorkan pencacahan kode kelas")
            print(f"        dihapus oleh: {migrasi}")
            print(f"        masih ada di server sampai migrasi itu dijalankan")

    if curiga:
        print("")
        print(f"  ── PERLU DIPERIKSA DENGAN MATA ({len(curiga)}) ──")
        for nama, berkas in curiga:
            print(f"    [!] {nama:<26} menyentuh tabel TANPA pemeriksaan izin yang dikenali")
            print(f"        sumber: {berkas}")

    if hilang:
        print("")
        print(f"  ── TIDAK DITEMUKAN ({len(hilang)}) ──")
        for nama in hilang:
            print(f"    [?] {nama}")

    print("")
    print("=" * 80)
    if curiga:
        print(f"  HASIL: {len(curiga)} fungsi perlu diperiksa dengan mata")
        print("=" * 80)
        return 1
    jumlah = len(aman) + len(murni)
    print(f"  HASIL: {jumlah} fungsi aman ({len(publik)} memang publik), 0 perlu diperiksa")
    if dihapus:
        print(f"         {len(dihapus)} menunggu dihapus oleh migrasi 11")
    print("=" * 80)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
