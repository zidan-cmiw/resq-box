#!/usr/bin/env python
"""
Buat dan periksa akun GURU lewat Supabase Admin API.

═══════════════════════════════════════════════════════════════════════════
MENGAPA AKUN GURU TIDAK DIBUAT LEWAT APLIKASI
═══════════════════════════════════════════════════════════════════════════

  Peran `teacher` hanya sah bila berada di `app_metadata`. Dan `app_metadata`
  HANYA dapat ditulis oleh server — klien tidak dapat mengisinya.

  Ini sudah diuji: mendaftar sendiri dengan `data: {role: 'teacher'}` ditolak
  server (HTTP 422, "Signups not allowed for this instance").

  Itu memang pembatasan yang benar. Bila guru dapat membuat akun guru, satu
  guru dapat membuat akun palsu untuk mengintip kelas guru lain.

  Jadi akun guru dibuat oleh pihak berwenang, lewat:
    - Dashboard Supabase (Authentication -> Users -> Add user), atau
    - Admin API, yang dilakukan skrip ini

═══════════════════════════════════════════════════════════════════════════
KUNCI YANG DIPERLUKAN — DAN MENGAPA IA BERBAHAYA
═══════════════════════════════════════════════════════════════════════════

  Skrip ini memerlukan `service_role` key, BUKAN kunci anon.

  ⚠️  KUNCI `service_role` MENEMBUS SELURUH RLS. Siapa pun yang memilikinya
      dapat MEMBACA DAN MENGUBAH SELURUH DATA semua guru dan semua murid,
      tanpa terkecuali.

  Karena itu:

    - JANGAN pernah menaruhnya di kode, di `.env` yang ikut git, di APK, di
      `.exe`, atau di website. Kunci itu hanya untuk dipakai dari komputer
      yang tepercaya, sekali pakai.
    - JANGAN tempelkan ke dalam percakapan dengan siapa pun — termasuk asisten
      AI. Bila sudah pernah, SEGERA putar ulang (rotate) kuncinya di
      Dashboard Supabase -> Settings -> API -> Roll service_role key.
    - Aplikasi RESQ-BOX TIDAK memerlukannya. Aplikasi hanya memakai kunci
      anon, dan itu sudah benar.

  Bila kamu hanya ingin MEMERIKSA akun yang sudah dibuat lewat Dashboard,
  skrip ini juga bisa: jalankan dengan `--periksa` dan kunci service_role.

═══════════════════════════════════════════════════════════════════════════
CARA MENJALANKAN
═══════════════════════════════════════════════════════════════════════════

  Buat akun guru:

    python scripts/kelola_akun_guru.py buat buatyas "Bu Tyas" "SMP Negeri 1"

  Periksa akun guru (sudah ada atau belum, dan perannya benar atau tidak):

    python scripts/kelola_akun_guru.py periksa buatyas

  Daftar semua akun guru:

    python scripts/kelola_akun_guru.py daftar

  Kunci dibaca dari variabel lingkungan SUPABASE_SERVICE_ROLE_KEY.
  Bila belum diset, skrip akan memintanya (tanpa menampilkannya di layar).
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

# ── Alamat proyek Supabase ────────────────────────────────────────────────
def alamat_proyek() -> str:
    for nama in ("VITE_SUPABASE_URL", "SUPABASE_URL"):
        nilai = os.environ.get(nama)
        if nilai:
            return nilai.rstrip("/")
    env = AKAR / ".env"
    if env.exists():
        for baris in env.read_text(encoding="utf-8", errors="ignore").split("\n"):
            if baris.strip().startswith("VITE_SUPABASE_URL"):
                return baris.split("=", 1)[1].strip().strip('"').strip("'").rstrip("/")
    raise SystemExit("  [X] VITE_SUPABASE_URL tidak ditemukan di .env")


SUPABASE = alamat_proyek()


def kunci_layanan() -> str:
    """Ambil kunci service_role dari lingkungan, atau minta ke pengguna."""
    nilai = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "").strip()
    if nilai:
        return nilai

    print("")
    print("  ⚠️  Diperlukan kunci `service_role` (KUNCI SERVER).")
    print("      Kunci ini MENEMBUS seluruh RLS — ia dapat membaca dan")
    print("      mengubah data SEMUA guru dan SEMUA murid.")
    print("")
    print("      Ambil dari: Supabase Dashboard -> Settings -> API")
    print("                  -> Project API keys -> service_role (secret)")
    print("")
    print("      Kunci ini TIDAK akan disimpan dan TIDAK ditampilkan.")
    print("")
    return getpass.getpass("  Tempel kunci service_role (tidak terlihat): ").strip()


def panggil(jalur: str, kunci: str, metode: str = "GET", isi: dict | None = None):
    """Panggil Admin API Supabase. Mengembalikan (status, hasil)."""
    data = json.dumps(isi).encode() if isi is not None else None
    req = urllib.request.Request(f"{SUPABASE}{jalur}", method=metode, data=data)
    req.add_header("apikey", kunci)
    req.add_header("Authorization", f"Bearer {kunci}")
    req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            teks = r.read().decode("utf-8", "ignore")
            return r.status, (json.loads(teks) if teks else {})
    except urllib.error.HTTPError as e:
        teks = e.read().decode("utf-8", "ignore")
        try:
            return e.code, json.loads(teks)
        except Exception:  # noqa: BLE001
            return e.code, {"raw": teks}
    except Exception as e:  # noqa: BLE001
        return 0, {"raw": str(e)}


def domain_email() -> str:
    for nama in ("VITE_AUTH_EMAIL_DOMAIN",):
        nilai = os.environ.get(nama)
        if nilai:
            return nilai
    env = AKAR / ".env"
    if env.exists():
        for baris in env.read_text(encoding="utf-8", errors="ignore").split("\n"):
            if baris.strip().startswith("VITE_AUTH_EMAIL_DOMAIN"):
                return baris.split("=", 1)[1].strip().strip('"').strip("'")
    return "resqbox.local"


def kata_sandi_acak(panjang: int = 14) -> str:
    """Buat kata sandi awal yang kuat. Wajib diganti guru saat pertama masuk."""
    huruf = string.ascii_letters + string.digits
    return "".join(secrets.choice(huruf) for _ in range(panjang))


# ── Perintah ──────────────────────────────────────────────────────────────

def perintah_buat(username: str, nama: str, sekolah: str, kunci: str) -> int:
    email = f"{username.lower()}@{domain_email()}"
    sandi = kata_sandi_acak()

    print("")
    print(f"  Membuat akun guru: {username}")
    print(f"      email  : {email}")
    print(f"      nama   : {nama}")
    print(f"      sekolah: {sekolah}")

    status, hasil = panggil("/auth/v1/admin/users", kunci, "POST", {
        "email": email,
        "password": sandi,
        "email_confirm": True,          # langsung aktif, tanpa verifikasi email
        # WAJIB di app_metadata: trigger handle_new_auth_user membaca
        # `raw_app_meta_data ->> 'role'` untuk menentukan peran.
        "app_metadata": {
            "role": "teacher",
            "username": username.lower(),
        },
        # user_metadata untuk data yang boleh diketahui pengguna sendiri.
        "user_metadata": {
            "name": nama,
            "username": username.lower(),
            "school_name": sekolah,
        },
    })

    if status not in (200, 201):
        print(f"\n  [X] GAGAL (HTTP {status})")
        print(f"      {json.dumps(hasil)[:300]}")
        if "already" in json.dumps(hasil).lower() or status == 422:
            print("      Kemungkinan akun dengan email itu sudah ada.")
            print(f"      Periksa dengan: python scripts/kelola_akun_guru.py periksa {username}")
        return 1

    uid = hasil.get("id", "?")
    print(f"\n  [v] Akun dibuat. id = {uid}")
    print("")
    print("  ┌─────────────────────────────────────────────────────────────┐")
    print("  │  KATA SANDI AWAL — CATAT SEKARANG, TIDAK AKAN DITAMPILKAN   │")
    print("  └─────────────────────────────────────────────────────────────┘")
    print("")
    print(f"      username : {username.lower()}")
    print(f"      password : {sandi}")
    print("")
    print("      Sampaikan ke guru, dan minta ia MENGGANTI kata sandi")
    print("      setelah masuk pertama kali.")
    print("")

    # Periksa hasilnya: apakah profilnya benar-benar berperan teacher?
    return perintah_periksa(username, kunci)


def perintah_periksa(username: str, kunci: str) -> int:
    email = f"{username.lower()}@{domain_email()}"
    print(f"  ── Memeriksa akun {username} ──")

    # 1. Lewat Admin API: baca app_metadata
    status, hasil = panggil(
        f"/auth/v1/admin/users?filter={urllib.parse.quote(email)}", kunci
    )
    if status != 200:
        status, hasil = panggil("/auth/v1/admin/users?per_page=200", kunci)

    # ── MENGAPA KEGAGALAN PENCARIAN HARUS DIBEDAKAN DARI "TIDAK DITEMUKAN" ──
    #
    # Versi sebelumnya langsung menyimpulkan "akun tidak ditemukan" begitu
    # daftarnya kosong — TANPA memeriksa apakah pencariannya sendiri berhasil.
    #
    # Akibatnya berbahaya: bila kuncinya salah (mis. kunci `anon` tertempel,
    # bukan `service_role`), pencarian gagal, daftarnya kosong, dan skrip
    # melaporkan:
    #
    #     [X] Akun budi@resqbox.local TIDAK DITEMUKAN
    #
    # Padahal akunnya ADA. Guru lalu membuat akun dengan username yang sama,
    # ditolak server karena sudah ada, dan menjadi bingung.
    #
    # Diuji langsung: dengan kunci anon, skrip memang melaporkan
    # "TIDAK DITEMUKAN" untuk akun yang belum tentu tidak ada.
    #
    # Sekarang bila pencariannya GAGAL (status bukan 200), skrip mengatakan
    # sebenarnya — bahwa ia tidak dapat memeriksa — alih-alih berpura-pura
    # akunnya tidak ada.
    if status != 200:
        print(f"      [X] GAGAL MEMERIKSA (HTTP {status})")
        print(f"          {json.dumps(hasil)[:200]}")
        print("")
        print("          Akun ini BELUM TENTU tidak ada — pemeriksaannya yang gagal.")
        if status in (401, 403):
            print("          Penyebab tersering: kunci yang dipakai BUKAN `service_role`.")
            print("          Ambil dari: Settings -> API -> service_role (secret)")
        return 1

    daftar = hasil.get("users", hasil if isinstance(hasil, list) else [])
    cocok = [u for u in daftar if (u.get("email") or "").lower() == email.lower()]

    if not cocok:
        print(f"      [v] pemeriksaan berhasil ({len(daftar)} akun diperiksa)")
        print(f"      [X] Akun {email} TIDAK DITEMUKAN — memang belum ada")
        print("          Buat dengan: python scripts/kelola_akun_guru.py buat " + username)
        return 1

    u = cocok[0]
    peran = (u.get("app_metadata") or {}).get("role")
    uname = (u.get("app_metadata") or {}).get("username")
    terkonfirmasi = bool(u.get("email_confirmed_at") or u.get("confirmed_at"))

    print(f"      id            : {u.get('id')}")
    print(f"      email         : {u.get('email')}")
    print(f"      terkonfirmasi : {'ya' if terkonfirmasi else 'TIDAK — guru tidak akan bisa masuk'}")
    print(f"      app_metadata.role     : {peran}")
    print(f"      app_metadata.username : {uname}")

    masalah = 0
    if peran != "teacher":
        masalah += 1
        print("")
        print(f"      [X] PERAN SALAH: '{peran}' seharusnya 'teacher'.")
        print("          Perbaiki di Dashboard -> Authentication -> Users ->")
        print("          pilih pengguna -> App Metadata -> set {\"role\": \"teacher\"}.")
    if not terkonfirmasi:
        masalah += 1
        print("")
        print("      [X] BELUM TERKONFIRMASI. Guru tidak akan dapat masuk.")
        print("          Di Dashboard, buka pengguna itu dan pilih 'Confirm email'.")
    if not uname:
        masalah += 1
        print("")
        print("      [!] app_metadata.username kosong.")

    # 2. Periksa apakah profilnya di public.profiles ikut berperan teacher
    status2, hasil2 = panggil(
        f"/rest/v1/profiles?username=eq.{username.lower()}&select=id,username,role,is_admin,name,school_name",
        kunci,
    )
    if status2 == 200 and hasil2:
        p = hasil2[0]
        print(f"      profiles.role : {p.get('role')}")
        if p.get("role") != "teacher":
            masalah += 1
            print("")
            print(f"      [X] profiles.role = '{p.get('role')}', seharusnya 'teacher'.")
            print("          Ini terjadi bila akun dibuat TANPA app_metadata.role.")
            print("          Perbaiki dengan SQL:")
            print(f"            UPDATE public.profiles SET role='teacher' WHERE username='{username.lower()}';")
    else:
        print(f"      profiles      : belum ada baris (HTTP {status2})")

    print("")
    if masalah:
        print(f"  HASIL: {masalah} masalah pada akun {username}")
        return 1
    print(f"  HASIL: akun {username} SIAP dipakai sebagai guru")
    return 0


def perintah_daftar(kunci: str) -> int:
    status, hasil = panggil("/auth/v1/admin/users?per_page=500", kunci)
    if status != 200:
        print(f"  [X] GAGAL (HTTP {status}): {json.dumps(hasil)[:200]}")
        return 1

    daftar = hasil.get("users", [])
    guru = [u for u in daftar if (u.get("app_metadata") or {}).get("role") == "teacher"]
    siswa = [u for u in daftar if (u.get("app_metadata") or {}).get("role") == "student"]

    print("")
    print(f"  total akun : {len(daftar)}")
    print(f"  guru       : {len(guru)}")
    print(f"  siswa      : {len(siswa)}")
    print("")
    if guru:
        print("  ── Akun guru ──")
        for u in sorted(guru, key=lambda x: x.get("email") or ""):
            am = u.get("app_metadata") or {}
            print(f"      {(u.get('email') or '?'):<34} "
                  f"username={am.get('username') or '(kosong)'}")
    return 0


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__)
        return 2

    perintah = sys.argv[1].lower()
    kunci = kunci_layanan()

    if perintah == "buat":
        if len(sys.argv) < 4:
            print("  Pemakaian: buat <username> <nama> [sekolah]")
            return 2
        return perintah_buat(sys.argv[2], sys.argv[3],
                             sys.argv[4] if len(sys.argv) > 4 else "SMP Negeri 1", kunci)

    if perintah == "periksa":
        if len(sys.argv) < 3:
            print("  Pemakaian: periksa <username>")
            return 2
        return perintah_periksa(sys.argv[2], kunci)

    if perintah == "daftar":
        return perintah_daftar(kunci)

    print(__doc__)
    return 2


if __name__ == "__main__":
    import urllib.parse  # dipakai di perintah_periksa
    raise SystemExit(main())
