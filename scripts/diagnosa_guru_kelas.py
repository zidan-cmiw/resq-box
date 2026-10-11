#!/usr/bin/env python
"""
Diagnosa lengkap keadaan guru & kelas — menjawab "kenapa tidak bisa tambah murid".

═══════════════════════════════════════════════════════════════════════════
MENGAPA SKRIP INI ADA
═══════════════════════════════════════════════════════════════════════════

  Gejala: pada akun guru, jendela "+ TAMBAH SISWA" menolak dengan
  "Kelas belum dipilih.", dan "Kode Kelas:" kosong.

  Ada beberapa kemungkinan yang SALING BERBEDA, dan menebak akan membuang
  waktu:

    1. Guru itu memang belum punya kelas sama sekali
    2. Kelas sudah dibuat, tetapi `classrooms.teacher_username` tidak sama
       dengan `profiles.username` guru itu
    3. Kelas sudah dibuat, tetapi `list_my_classrooms` tidak mengembalikannya
    4. `profiles` guru itu tidak ada, sehingga peran/peran guru tidak dikenali
    5. Migrasi 12 belum dijalankan, sehingga pembuatan kelas gagal

  Skrip ini membaca SELURUH data yang diperlukan SEKALIGUS, sehingga
  penyebabnya dapat ditentukan dari satu kali jalan — bukan dari beberapa
  kali tanya-jawab.

═══════════════════════════════════════════════════════════════════════════
KUNCI YANG DIPERLUKAN
═══════════════════════════════════════════════════════════════════════════

  Memerlukan kunci `service_role`, karena harus membaca `auth.users` dan
  `profiles` TANPA dibatasi RLS — justru supaya dapat melihat apa yang
  SEBENARNYA ada di database.

  ⚠️  Kunci ini MENEMBUS SELURUH RLS. Jalankan hanya dari komputer
      tepercaya, jangan disimpan, jangan dikirim ke mana pun.

═══════════════════════════════════════════════════════════════════════════
CARA MENJALANKAN
═══════════════════════════════════════════════════════════════════════════

  $env:SUPABASE_SERVICE_ROLE_KEY = "<kunci>"
  python scripts/diagnosa_guru_kelas.py
"""
from __future__ import annotations

import getpass
import json
import os
import urllib.error
import urllib.request
from pathlib import Path

AKAR = Path(__file__).resolve().parent.parent


def alamat() -> str:
    if os.environ.get("VITE_SUPABASE_URL"):
        return os.environ["VITE_SUPABASE_URL"].rstrip("/")
    env = AKAR / ".env"
    if env.exists():
        for l in env.read_text(encoding="utf-8", errors="ignore").split("\n"):
            if l.strip().startswith("VITE_SUPABASE_URL"):
                return l.split("=", 1)[1].strip().strip('"').strip("'").rstrip("/")
    raise SystemExit("  [X] VITE_SUPABASE_URL tidak ditemukan")


SUPABASE = alamat()


def kunci() -> str:
    k = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "").strip()
    if k:
        return k
    print("\n  ⚠️  Diperlukan kunci `service_role` (MENEMBUS seluruh RLS).")
    print("      Settings -> API -> service_role (secret)\n")
    return getpass.getpass("  Tempel kunci service_role: ").strip()


def ambil(jalur: str, k: str):
    req = urllib.request.Request(f"{SUPABASE}{jalur}")
    req.add_header("apikey", k)
    req.add_header("Authorization", f"Bearer {k}")
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read().decode("utf-8", "ignore") or "[]")
    except urllib.error.HTTPError as e:
        print(f"  [X] HTTP {e.code} pada {jalur}")
        print(f"      {e.read().decode('utf-8','ignore')[:200]}")
        return None
    except Exception as e:  # noqa: BLE001
        print(f"  [X] {e}")
        return None


def main() -> int:
    k = kunci()

    print("=" * 80)
    print("  DIAGNOSA: GURU & KELAS")
    print("=" * 80)

    # ── 1. Profil guru ────────────────────────────────────────────────────
    profil = ambil("/rest/v1/profiles?role=eq.teacher&select=id,username,role,is_admin,name,school_name", k) or []
    print(f"\n  ── 1. PROFIL GURU ({len(profil)}) ──")
    if not profil:
        print("      [X] TIDAK ADA profil dengan role = 'teacher'.")
        print("          Akun guru mungkin dibuat tanpa app_metadata.role = 'teacher'.")
    for p in profil:
        print(f"      username = {str(p.get('username'))!r:<20} "
              f"nama = {p.get('name')!r:<20} admin = {p.get('is_admin')}")
        print(f"          id = {p.get('id')}")

    # ── 2. Semua kelas ────────────────────────────────────────────────────
    kelas = ambil("/rest/v1/classrooms?select=code,name,teacher_username,school_name&order=code", k) or []
    print(f"\n  ── 2. SEMUA KELAS ({len(kelas)}) ──")
    if not kelas:
        print("      [X] TIDAK ADA KELAS SAMA SEKALI di database.")
        print("          Berarti tombol 'BUAT KELAS BARU' belum pernah berhasil.")
    for c in kelas:
        print(f"      {str(c.get('code')):<20} pemilik = {str(c.get('teacher_username'))!r:<18} "
              f"nama = {c.get('name')!r}")

    # ── 3. Kelas vs guru: apakah pemiliknya cocok? ────────────────────────
    print("\n  ── 3. KECOCOKAN PEMILIK KELAS DENGAN USERNAME GURU ──")
    nama_guru = {(p.get("username") or "") for p in profil}
    if not kelas:
        print("      (tidak ada kelas untuk diperiksa)")
    for c in kelas:
        pemilik = c.get("teacher_username") or ""
        cocok = pemilik in nama_guru
        print(f"      {'[v]' if cocok else '[X]'} {c.get('code'):<20} pemilik {pemilik!r} "
              f"{'ADA di profil guru' if cocok else 'TIDAK ADA di profil guru!'}")

    # ── 4. Murid per kelas ────────────────────────────────────────────────
    murid = ambil("/rest/v1/profiles?role=eq.student&select=id,username,name,classroom_code", k) or []
    print(f"\n  ── 4. MURID ({len(murid)}) ──")
    from collections import defaultdict
    per_kelas = defaultdict(int)
    for m in murid:
        per_kelas[str(m.get("classroom_code"))] += 1
    if not per_kelas:
        print("      (belum ada murid)")
    for kode, n in sorted(per_kelas.items()):
        print(f"      kelas {kode:<20} {n} murid")

    # ── 5. KESIMPULAN ─────────────────────────────────────────────────────
    print("\n" + "=" * 80)
    print("  KESIMPULAN")
    print("=" * 80)

    if not profil:
        print("  [X] Tidak ada profil guru. Akun dibuat tanpa app_metadata.role.")
        print("      Perbaiki dengan scripts/kelola_akun_guru.py atau SQL di")
        print("      docs/KEAMANAN-AKUN-GURU.md.")
    elif not kelas:
        print("  [X] BELUM ADA KELAS SAMA SEKALI.")
        print("      Guru harus menekan 'BUAT KELAS BARU' lebih dahulu.")
        print("      Bila tombol itu GAGAL, periksa galat di konsol peramban.")
    else:
        guru_tanpa_kelas = [
            p for p in profil
            if not any((c.get("teacher_username") or "") == (p.get("username") or "") for c in kelas)
        ]
        if guru_tanpa_kelas:
            print(f"  [!] {len(guru_tanpa_kelas)} guru BELUM punya kelas:")
            for p in guru_tanpa_kelas:
                print(f"          {p.get('username')!r} ({p.get('name')!r})")
            print("      Mereka TIDAK DAPAT menambah murid sampai membuat kelas.")
        else:
            print("  [v] Setiap guru sudah punya setidaknya satu kelas.")

    print("=" * 80)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
