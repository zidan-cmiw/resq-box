#!/usr/bin/env python
"""
Buat SATU akun uji dengan level yang langsung terbuka.

═══════════════════════════════════════════════════════════════════════════
MENGAPA SKRIP INI ADA
═══════════════════════════════════════════════════════════════════════════

  Untuk memeriksa TTS Level 2, akun harus sudah melewati Level 1. Akun siswa
  yang ada sudah tamat semua (atau justru belum sampai), sehingga tidak ada
  akun yang pas untuk menguji bagian tengah permainan.

  Skrip ini membuat satu akun siswa yang `profiles.unlocked_level`-nya
  langsung disetel, sehingga Level 2 (atau 3) dapat dibuka tanpa bermain dulu.

  Akun ini dibuat lewat Admin API dengan peran `student`, lalu profilnya
  diperbaiki memakai kunci service_role. Jalur itu sah: penjaga
  `guard_profile_privileges` mengizinkan perubahan ketika `auth.uid()` NULL,
  yaitu keadaan permintaan yang memakai kunci service_role.

═══════════════════════════════════════════════════════════════════════════
CARA MENJALANKAN
═══════════════════════════════════════════════════════════════════════════

  $env:SUPABASE_SERVICE_ROLE_KEY = "<kunci service_role>"

  python scripts/buat_akun_uji.py ujitts
      -> akun `ujitts`, sandi dibuat otomatis, Level 2 terbuka

  python scripts/buat_akun_uji.py ujitts --level 3
      -> Level 3 juga terbuka (bisa memeriksa TTS Level 2 DAN Level 3)

  python scripts/buat_akun_uji.py ujitts --kelas RESQ-8A --nama "Akun Uji TTS"
  python scripts/buat_akun_uji.py ujitts --periksa
      -> hanya menampilkan keadaan akun itu sekarang

  Opsi lain:
    --sandi <sandi>    tentukan sendiri (bawaan: dibuat acak 12 karakter)
    --level 1|2|3      level tertinggi yang terbuka (bawaan: 2)

  Bila akun sudah ada, skrip TIDAK membuat ulang: kata sandinya disetel ulang
  dan levelnya diperbaiki. Jadi aman dijalankan berulang.

═══════════════════════════════════════════════════════════════════════════
CATATAN
═══════════════════════════════════════════════════════════════════════════

  Akun uji tetap terhubung ke sebuah kelas, karena setelah migrasi 14 siswa
  tanpa kelas DITOLAK saat mengirim nilai. Bila `--kelas` tidak disebut,
  skrip memilih kelas yang paling banyak siswanya.
"""
from __future__ import annotations

import getpass
import json
import os
import secrets
import string
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

AKAR = Path(__file__).resolve().parent.parent


def _dari_env(nama: str) -> str:
    nilai = os.environ.get(nama, "").strip()
    if nilai:
        return nilai
    env = AKAR / ".env"
    if env.exists():
        for baris in env.read_text(encoding="utf-8", errors="ignore").split("\n"):
            if baris.strip().startswith(nama + "="):
                return baris.split("=", 1)[1].strip().strip('"').strip("'")
    return ""


ALAMAT = _dari_env("VITE_SUPABASE_URL").rstrip("/")
KUNCI_ANON = _dari_env("VITE_SUPABASE_ANON_KEY")


def kunci() -> str:
    k = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "").strip()
    if not k:
        print("\n  ⚠️  Diperlukan kunci `service_role`.")
        print("      Supabase Dashboard -> Settings -> API -> service_role\n")
        k = getpass.getpass("  Tempel kunci service_role (tidak terlihat): ").strip()

    masalah = []
    if not k:
        masalah.append("Kunci masih kosong.")
    elif "<" in k or ">" in k:
        masalah.append("Kunci masih berisi teks contoh (ada tanda < atau >).")
    elif len(k) < 40:
        masalah.append(f"Kunci terlalu pendek ({len(k)} karakter).")
    if k and KUNCI_ANON and k == KUNCI_ANON:
        masalah.append("Itu kunci ANON, bukan service_role.")
    if k.startswith("sb_publishable_"):
        masalah.append("Itu kunci `sb_publishable_...` — tidak menembus RLS.")

    if masalah:
        print("\n  ⚠️  KUNCI API BERMASALAH — tidak ada yang dijalankan.")
        for m in masalah:
            print(f"      • {m}")
        raise SystemExit(2)
    return k


def panggil(jalur: str, k: str, metode: str = "GET", isi=None, header=None):
    data = json.dumps(isi).encode() if isi is not None else None
    req = urllib.request.Request(f"{ALAMAT}{jalur}", method=metode, data=data)
    req.add_header("apikey", k)
    req.add_header("Authorization", f"Bearer {k}")
    req.add_header("Content-Type", "application/json")
    for nama, nilai in (header or {}).items():
        req.add_header(nama, nilai)
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            teks = r.read().decode("utf-8", "ignore")
            return r.status, (json.loads(teks) if teks.strip() else None)
    except urllib.error.HTTPError as e:
        teks = e.read().decode("utf-8", "ignore")
        try:
            return e.code, json.loads(teks) if teks.strip() else None
        except json.JSONDecodeError:
            return e.code, {"message": teks[:300]}


def kata_sandi_acak(panjang: int = 12) -> str:
    alfabet = string.ascii_letters + string.digits
    return "".join(secrets.choice(alfabet) for _ in range(panjang))


def cari_uid(username: str, k: str) -> str | None:
    email = f"{username}@resqbox.local"
    st, hasil = panggil(
        f"/auth/v1/admin/users?filter={urllib.parse.quote(email)}", k
    )
    if st != 200:
        return None
    daftar = hasil.get("users") if isinstance(hasil, dict) else hasil
    for u in (daftar or []):
        if str(u.get("email", "")).lower() == email:
            return u.get("id")
    return None


def pilih_kelas(k: str, diminta: str | None) -> dict:
    st, kelas = panggil("/rest/v1/classrooms?select=code,name&order=code", k)
    if st != 200:
        raise SystemExit(f"  [X] Gagal membaca kelas (HTTP {st}): {kelas}")
    if not kelas:
        raise SystemExit(
            "  [X] Belum ada kelas sama sekali. Buat dulu di aplikasi:\n"
            "      Posko Guru -> BUAT KELAS BARU"
        )
    if diminta:
        cocok = [c for c in kelas if c["code"].upper() == diminta.upper()]
        if not cocok:
            daftar = ", ".join(c["code"] for c in kelas)
            raise SystemExit(f"  [X] Kelas {diminta} tidak ada. Yang tersedia: {daftar}")
        return cocok[0]

    # Kelas dengan siswa terbanyak.
    st, siswa = panggil("/rest/v1/profiles?select=classroom_code&role=eq.student", k)
    hitung: dict[str, int] = {}
    for s in (siswa or []):
        kode = s.get("classroom_code")
        if kode:
            hitung[kode] = hitung.get(kode, 0) + 1
    if hitung:
        kode_terbaik = max(hitung, key=hitung.get)
        return next(c for c in kelas if c["code"] == kode_terbaik)
    return kelas[0]


def nomor_absen_baru(kode_kelas: str, k: str) -> str:
    st, rows = panggil(
        "/rest/v1/profiles?select=absent_number&classroom_code=eq."
        f"{urllib.parse.quote(kode_kelas)}&role=eq.student",
        k,
    )
    maks = 0
    for r in (rows or []):
        try:
            maks = max(maks, int(str(r.get("absent_number") or "0")))
        except ValueError:
            pass
    return str(min(999, maks + 1))


def main() -> int:
    arg = sys.argv[1:]
    if not arg or arg[0] in ("-h", "--help", "help"):
        print(__doc__)
        return 0

    username = arg[0].lower().strip()
    if not username or not all(c.isalnum() or c in "._-" for c in username) or not (3 <= len(username) <= 30):
        raise SystemExit(
            "  [X] Username tidak sah. Hanya huruf kecil, angka, titik, garis bawah, "
            "dan strip; 3-30 karakter."
        )

    opsi: dict[str, str] = {}
    posisi: list[str] = []
    TANPA_NILAI = {"periksa"}
    i = 1
    while i < len(arg):
        if arg[i].startswith("--"):
            nama = arg[i][2:]
            if nama in TANPA_NILAI:
                opsi[nama] = "ya"; i += 1
            else:
                opsi[nama] = arg[i + 1] if i + 1 < len(arg) else ""; i += 2
        else:
            posisi.append(arg[i]); i += 1

    k = kunci()
    email = f"{username}@resqbox.local"

    profil_lama = None
    st, rows = panggil(
        f"/rest/v1/profiles?select=username,name,classroom_code,unlocked_level,role,absent_number"
        f"&username=eq.{urllib.parse.quote(username)}",
        k,
    )
    if st == 200 and rows:
        profil_lama = rows[0]

    # ── Mode periksa ──
    if "periksa" in opsi:
        if not profil_lama:
            print(f"\n  Akun `{username}` BELUM ADA.")
            return 1
        print(f"\n  Akun `{username}`:")
        print(f"    nama     : {profil_lama.get('name')}")
        print(f"    kelas    : {profil_lama.get('classroom_code') or '(tanpa kelas)'}")
        print(f"    level    : {profil_lama.get('unlocked_level')}")
        print(f"    peran    : {profil_lama.get('role')}")
        return 0

    level = int(opsi.get("level", "2"))
    if level not in (1, 2, 3):
        raise SystemExit("  [X] --level harus 1, 2, atau 3.")

    sandi = opsi.get("sandi") or kata_sandi_acak()
    kelas = pilih_kelas(k, opsi.get("kelas"))
    nama = opsi.get("nama") or f"Akun Uji {username}"

    print(f"\n  Menyiapkan akun uji `{username}`")
    print(f"    email : {email}")
    print(f"    kelas : {kelas['name']} ({kelas['code']})")
    print(f"    level : {level}")

    # ── 1. Akun auth ──
    uid = cari_uid(username, k)
    if uid:
        print(f"  [i] Akun auth sudah ada (id {uid}) — kata sandi disetel ulang.")
        st, hasil = panggil(f"/auth/v1/admin/users/{uid}", k, "PUT", {
            "password": sandi,
            "email_confirm": True,
            "app_metadata": {"role": "student", "username": username},
        })
        if st not in (200, 201):
            raise SystemExit(f"  [X] Gagal menyetel ulang akun (HTTP {st}): {json.dumps(hasil)[:200]}")
    else:
        st, hasil = panggil("/auth/v1/admin/users", k, "POST", {
            "email": email,
            "password": sandi,
            "email_confirm": True,
            "app_metadata": {"role": "student", "username": username},
            "user_metadata": {"name": nama, "username": username},
        })
        if st not in (200, 201):
            raise SystemExit(f"  [X] Gagal membuat akun (HTTP {st}): {json.dumps(hasil)[:200]}")
        uid = hasil.get("id")
        print(f"  [v] Akun dibuat (id {uid})")

    absen = (profil_lama or {}).get("absent_number") or nomor_absen_baru(kelas["code"], k)

    # ── 2. Profil: level, kelas, nama ──
    #
    # Permintaan memakai kunci service_role, sehingga auth.uid() bernilai NULL
    # dan guard_profile_privileges mengizinkan perubahan ini.
    st, hasil = panggil(
        f"/rest/v1/profiles?username=eq.{urllib.parse.quote(username)}", k, "PATCH",
        {
            "unlocked_level": level,
            "classroom_code": kelas["code"],
            "name": nama,
            "absent_number": absen,
        },
        header={"Prefer": "return=representation"},
    )
    if st not in (200, 204):
        raise SystemExit(f"  [X] Gagal memperbarui profil (HTTP {st}): {json.dumps(hasil)[:200]}")

    # ── 3. Pastikan hasilnya ──
    st, cek = panggil(
        f"/rest/v1/profiles?select=username,classroom_code,unlocked_level,role"
        f"&username=eq.{urllib.parse.quote(username)}",
        k,
    )
    akhir = (cek or [{}])[0] if st == 200 else {}
    if akhir.get("unlocked_level") != level:
        print(f"  [!] Peringatan: level terbaca {akhir.get('unlocked_level')}, bukan {level}.")

    print("")
    print("  ┌──────────────────────────────────────────────────────────────┐")
    print("  │  AKUN UJI SIAP — CATAT SEKARANG                              │")
    print("  └──────────────────────────────────────────────────────────────┘")
    print(f"      username : {username}")
    print(f"      password : {sandi}")
    print(f"      level    : {akhir.get('unlocked_level')} (terbuka)")
    print(f"      kelas    : {akhir.get('classroom_code')}")
    print("")
    print("  Masuk di aplikasi memakai USERNAME (bukan email).")
    print("")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
