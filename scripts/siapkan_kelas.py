#!/usr/bin/env python
"""
Siapkan satu kelas LENGKAP dalam satu perintah:
akun guru baru -> kelas baru -> seluruh akun siswa dari daftar presensi.

═══════════════════════════════════════════════════════════════════════════
MENGAPA SKRIP INI ADA
═══════════════════════════════════════════════════════════════════════════

  Menyiapkan satu kelas baru menuntut tiga langkah yang saling bergantung:

    1. Akun guru   -> WAJIB lewat Admin API (kunci service_role), karena
                      peran `teacher` hanya sah bila ditulis di `app_metadata`,
                      dan `app_metadata` hanya dapat ditulis server.
    2. Kelas       -> WAJIB dibuat oleh guru itu sendiri lewat RPC
                      `create_my_classroom`, supaya `teacher_username` benar.
    3. Akun siswa  -> WAJIB lewat RPC `teacher_create_student`, karena kolom
                      `classroom_code` dikunci trigger.

  Dikerjakan terpisah, ketiganya menuntut tiga kali menjalankan skrip dengan
  tiga kredensial berbeda. Skrip ini merangkainya, sehingga kunci service_role
  hanya diminta SEKALI dan kata sandi guru tidak perlu diketik sama sekali.

═══════════════════════════════════════════════════════════════════════════
CARA MENJALANKAN
═══════════════════════════════════════════════════════════════════════════

  python scripts/siapkan_kelas.py "..\\PRESENSI 8A (1).xlsx" bu8a
                                 "Peni Dyah Arumsasi" "SMP Negeri 1 Pakem"
                                 --kelas-nama "Kelas 8A"

  Opsi:
    --kelas-nama "Kelas 8A"     nama kelas (bawaan: Kelas VIII-A)
    --sandi-guru <sandi>        pakai bila akun guru SUDAH ada
    --reset-sandi               akun guru sudah ada tetapi kata sandinya tidak
                                diketahui: buat sandi baru, cetak, setel peran
                                teacher, lalu lanjut. Satu opsi menuntaskan
                                "Invalid login credentials" sekaligus
                                "Hanya guru yang boleh membuat kelas".
    --sandi-siswa 123456        kata sandi siswa (bawaan 123456)

  Kunci service_role dibaca dari SUPABASE_SERVICE_ROLE_KEY, atau diminta
  (tidak ditampilkan, tidak disimpan).

═══════════════════════════════════════════════════════════════════════════
HASIL
═══════════════════════════════════════════════════════════════════════════

  - akun guru baru (peran teacher, langsung aktif)
  - satu kelas baru dengan kode yang dijamin belum terpakai
  - akun seluruh siswa di kelas itu
  - berkas <nama-presensi>-akun.csv berisi seluruh kredensial

  Kata sandi guru DICETAK SEKALI di akhir. Catat saat itu.
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

sys.path.insert(0, str(Path(__file__).resolve().parent))
import kelola_akun_siswa as ka  # noqa: E402  (butuh sys.path di atas)

AKAR = Path(__file__).resolve().parent.parent
SANDI_SISWA_BAWAAN = "123456"
NAMA_KELAS_BAWAAN = "Kelas VIII-A"


def csv(teks: object) -> str:
    """
    Sel CSV yang aman.

    Nama orang sering mengandung koma (mis. "Peni Dyah Arumsasi, S. Pd").
    Tanpa pengapitan, koma itu memecah baris menjadi kolom tambahan sehingga
    seluruh isi berkas bergeser dan sulit dibaca di Excel.
    """
    s = str(teks if teks is not None else "")
    return '"' + s.replace('"', '""') + '"' 


# ── Kunci layanan ─────────────────────────────────────────────────────────

def kunci_layanan() -> str:
    k = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "").strip()
    if not k:
        print("")
        print("  ⚠️  Diperlukan kunci `service_role` — hanya untuk MEMBUAT AKUN GURU.")
        print("      Kunci ini MENEMBUS seluruh RLS. Jangan disimpan, jangan dibagikan.")
        print("      Supabase Dashboard -> Settings -> API -> service_role (secret)")
        print("")
        k = getpass.getpass("  Tempel kunci service_role (tidak terlihat): ").strip()

    # Penjagaan yang sama seperti skrip diagnosa: jangan sampai teks contoh,
    # kunci anon, atau kunci terpotong dipakai lalu gagal dengan pesan samar.
    if not ka_kunci_sah(k):
        raise SystemExit(2)
    return k


def ka_kunci_sah(k: str) -> bool:
    masalah = []
    if not k:
        masalah.append("Kunci masih kosong.")
    elif "<" in k or ">" in k:
        masalah.append("Kunci masih berisi teks contoh (ada tanda < atau >).")
    elif len(k) < 40:
        masalah.append(f"Kunci terlalu pendek ({len(k)} karakter) — mungkin tersalin sebagian.")
    if k and ka.KUNCI_ANON and k == ka.KUNCI_ANON:
        masalah.append("Itu kunci ANON, bukan service_role.")
    if k.startswith("sb_publishable_"):
        masalah.append("Itu kunci `sb_publishable_...` — tidak dapat menembus RLS.")

    if masalah:
        print("\n  ⚠️  KUNCI API BERMASALAH — tidak ada yang dijalankan.")
        for m in masalah:
            print(f"      • {m}")
        print("\n      Ambil: Supabase Dashboard -> Settings -> API -> service_role")
        return False
    return True


# ── HTTP ke Admin API ─────────────────────────────────────────────────────

def admin(jalur: str, kunci: str, metode: str = "GET", isi: dict | None = None):
    data = json.dumps(isi).encode() if isi is not None else None
    req = urllib.request.Request(f"{ka.ALAMAT}{jalur}", method=metode, data=data)
    req.add_header("apikey", kunci)
    req.add_header("Authorization", f"Bearer {kunci}")
    req.add_header("Content-Type", "application/json")
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


# ── Langkah 1: akun guru ──────────────────────────────────────────────────

def kata_sandi_acak(panjang: int = 12) -> str:
    alfabet = string.ascii_letters + string.digits
    return "".join(secrets.choice(alfabet) for _ in range(panjang))


def buat_guru(username: str, nama: str, sekolah: str, sandi: str,
              kunci: str) -> tuple[bool, str]:
    """Membuat akun guru. Mengembalikan (berhasil, pesan)."""
    email = f"{username.lower()}@resqbox.local"
    status, hasil = admin("/auth/v1/admin/users", kunci, "POST", {
        "email": email,
        "password": sandi,
        "email_confirm": True,
        # WAJIB: trigger handle_new_auth_user membaca raw_app_meta_data->>'role'.
        "app_metadata": {"role": "teacher", "username": username.lower()},
        "user_metadata": {
            "name": nama,
            "username": username.lower(),
            "school_name": sekolah,
        },
    })

    if status in (200, 201):
        return True, hasil.get("id", "?")

    pesan = json.dumps(hasil)[:240]
    if "already" in pesan.lower() or status == 422 or status == 409:
        return False, f"SUDAH_ADA: {pesan}"
    return False, f"GAGAL (HTTP {status}): {pesan}"


def cari_uid(username: str, kunci: str) -> str | None:
    """Cari id pengguna auth dari username-nya."""
    email = f"{username.lower()}@resqbox.local"
    status, hasil = admin(
        f"/auth/v1/admin/users?filter={urllib.parse.quote(email)}", kunci
    )
    if status != 200:
        return None
    daftar = hasil.get("users") if isinstance(hasil, dict) else hasil
    for u in (daftar or []):
        if str(u.get("email", "")).lower() == email:
            return u.get("id")
    return None


def tulis_metadata_guru(username: str, uid: str, kunci: str) -> bool:
    """
    Menulis ulang app_metadata akun guru.

    Ini BUKAN sekadar menyalin data: trigger `handle_new_auth_user` berjalan
    pada UPDATE auth.users, dan di situ ia MENAIKKAN `profiles.role` menjadi
    teacher bila app_metadata menyebutkannya (lihat ON CONFLICT ... role =
    CASE WHEN EXCLUDED.role IN ('teacher','admin') THEN EXCLUDED.role).

    Jadi menulis metadata adalah cara resmi memperbaiki profil yang terlanjur
    berperan 'student' — tanpa perlu menyentuh tabel profiles langsung.
    """
    status, _ = admin(f"/auth/v1/admin/users/{uid}", kunci, "PUT", {
        "app_metadata": {"role": "teacher", "username": username.lower()},
    })
    return status in (200, 201)


def reset_sandi_dan_peran(username: str, uid: str, sandi: str, kunci: str) -> bool:
    """
    Menyetel ulang kata sandi DAN memastikan app_metadata berperan teacher.

    Satu permintaan menuntaskan dua hal, karena keduanya memang dua sisi dari
    masalah yang sama: akun lama yang kata sandinya tidak diketahui, dan
    profilnya yang terlanjur berperan 'student'.
    """
    status, _ = admin(f"/auth/v1/admin/users/{uid}", kunci, "PUT", {
        "password": sandi,
        "app_metadata": {"role": "teacher", "username": username.lower()},
    })
    return status in (200, 201)


def peran_profil(token: str) -> tuple[str, bool]:
    """Baca peran & status admin dari profil pemanggil."""
    status, hasil = ka._minta("/rest/v1/rpc/get_my_profile", "POST", {}, token=token)
    if status != 200 or not isinstance(hasil, dict):
        return "", False
    return str(hasil.get("role") or ""), bool(hasil.get("is_admin"))


# ── Langkah 2: login guru ─────────────────────────────────────────────────

def login(username: str, sandi: str):
    status, hasil = ka._minta(
        "/auth/v1/token?grant_type=password", "POST",
        {"email": f"{username.lower()}@resqbox.local", "password": sandi},
    )
    if status != 200 or not isinstance(hasil, dict) or "access_token" not in hasil:
        pesan = ""
        if isinstance(hasil, dict):
            pesan = hasil.get("error_description") or hasil.get("msg") or hasil.get("message") or ""
        raise SystemExit(
            f"  [X] Gagal masuk sebagai `{username}` (HTTP {status}): {pesan}\n\n"
            "      Artinya kata sandi akun itu TIDAK diketahui (atau akunnya belum ada).\n"
            "      Bila kata sandinya sudah tidak diingat, reset sekaligus perbaiki\n"
            "      perannya dengan menambahkan opsi berikut pada perintah ini:\n\n"
            "        --reset-sandi\n\n"
            "      Skrip akan membuat kata sandi baru, mencetaknya, dan menyetel\n"
            "      peran teacher - lalu melanjutkan membuat kelas dan akun siswa."
        )
    return hasil["access_token"]


# ── Langkah 3: kelas ──────────────────────────────────────────────────────

def buat_kelas(token: str, nama: str, sekolah: str) -> str:
    """Membuat kelas; kode dibuat server agar dijamin unik."""
    status, hasil = ka._minta(
        "/rest/v1/rpc/create_my_classroom", "POST",
        {"p_code": None, "p_name": nama, "p_school": sekolah},
        token=token,
    )
    if status == 200 and isinstance(hasil, dict) and hasil.get("code"):
        return hasil["code"]

    pesan = json.dumps(hasil, ensure_ascii=False) if hasil is not None else f"HTTP {status}"

    if status == 403 and "Hanya guru" in pesan:
        raise SystemExit(
            f"  [X] Gagal membuat kelas (HTTP {status}): {pesan}\n\n"
            "      Artinya `profiles.role` akun ini BUKAN 'teacher'.\n"
            "      Perbaiki dengan SQL berikut di Supabase SQL Editor:\n\n"
            f"        UPDATE public.profiles SET role = 'teacher'\n"
            f"        WHERE username = '{username}';\n\n"
            "      Lalu jalankan ulang perintah ini dengan --sandi-guru."
        )

    raise SystemExit(
        f"  [X] Gagal membuat kelas (HTTP {status}): {pesan}\n"
        "      Bila pesannya soal fungsi/kolom yang tidak ada, jalankan migrasi 12."
    )


# ── Titik masuk ───────────────────────────────────────────────────────────

def main() -> int:
    arg = sys.argv[1:]
    if not arg or arg[0] in ("-h", "--help", "help"):
        print(__doc__)
        return 0

    # Opsi yang TIDAK mengambil nilai. Tanpa daftar ini, parser akan memakan
    # argumen berikutnya sebagai nilai, sehingga "--reset-sandi --kelas-nama X"
    # membuat --kelas-nama hilang dan X dianggap argumen posisi.
    TANPA_NILAI = {"reset-sandi"}

    opsi: dict[str, str] = {}
    posisi: list[str] = []
    i = 0
    while i < len(arg):
        if arg[i].startswith("--"):
            nama = arg[i][2:]
            if nama in TANPA_NILAI:
                opsi[nama] = "ya"
                i += 1
            else:
                opsi[nama] = arg[i + 1] if i + 1 < len(arg) else ""
                i += 2
        else:
            posisi.append(arg[i])
            i += 1

    if len(posisi) < 4:
        raise SystemExit(
            "  [X] Pemakaian:\n"
            '      python scripts/siapkan_kelas.py "<presensi.xlsx>" <username_guru> '
            '"<Nama Guru>" "<Sekolah>" [--kelas-nama "Kelas 8A"]'
        )

    berkas = Path(posisi[0])
    username = posisi[1].lower().strip()
    nama_guru = posisi[2]
    sekolah = posisi[3]
    nama_kelas = opsi.get("kelas-nama", NAMA_KELAS_BAWAAN)
    sandi_siswa = opsi.get("sandi-siswa", SANDI_SISWA_BAWAAN)
    sandi_guru = opsi.get("sandi-guru")
    # Diperiksa lewat kehadiran, bukan nilai: "--reset-sandi" di akhir perintah
    # tidak punya nilai, sehingga opsi.get() akan mengembalikan "" (falsy).
    reset = "reset-sandi" in opsi

    ka.pastikan_konfigurasi()

    # Baca presensi LEBIH DULU, supaya berkas yang salah ketahuan sebelum
    # satu pun akun dibuat.
    siswa = ka.baca_presensi(berkas)
    print(f"\n  Presensi terbaca: {len(siswa)} siswa dari {berkas.name}")

    kunci = kunci_layanan()

    # ── 1. Akun guru ──
    print(f"\n  {'='*70}\n  1. AKUN GURU\n  {'='*70}")
    baru = sandi_guru is None
    sandi = sandi_guru or kata_sandi_acak()

    uid_guru: str | None = None

    if reset:
        uid_guru = cari_uid(username, kunci)
        if not uid_guru:
            print(f"  [X] Akun `{username}` tidak ditemukan, jadi tidak bisa direset.")
            print("      Hapus --reset-sandi bila maksudnya membuat akun baru.")
            return 1
        sandi = kata_sandi_acak()
        if not reset_sandi_dan_peran(username, uid_guru, sandi, kunci):
            print("  [X] Gagal mereset kata sandi (Admin API menolak).")
            return 1
        baru = False
        print(f"  [v] Kata sandi `{username}` direset, peran disetel teacher.")
        print("")
        print("  ┌──────────────────────────────────────────────────────────────┐")
        print("  │  KATA SANDI GURU BARU — CATAT SEKARANG                       │")
        print("  └──────────────────────────────────────────────────────────────┘")
        print(f"      username : {username}")
        print(f"      password : {sandi}")
        print("")
    elif baru:
        ok, info = buat_guru(username, nama_guru, sekolah, sandi, kunci)
        if ok:
            uid_guru = info
            print(f"  [v] Akun guru `{username}` dibuat (id {info})")
            # Kata sandi dicetak SEKARANG, bukan hanya di ringkasan akhir.
            # Bila langkah berikutnya gagal (mis. peran belum teacher), skrip
            # berhenti sebelum ringkasan - dan kata sandi ini akan hilang
            # selamanya bila baru dicetak di akhir.
            print("")
            print("  ┌──────────────────────────────────────────────────────────────┐")
            print("  │  KATA SANDI GURU — CATAT SEKARANG, TIDAK DITAMPILKAN LAGI    │")
            print("  └──────────────────────────────────────────────────────────────┘")
            print(f"      username : {username}")
            print(f"      password : {sandi}")
            print("")
        elif info.startswith("SUDAH_ADA"):
            print(f"  [!] Akun `{username}` SUDAH ADA.")
            print("      Skrip tidak mengubah kata sandinya.")
            print("      Jalankan ulang dengan --sandi-guru <kata sandi akun itu>.")
            return 1
        else:
            print(f"  [X] {info}")
            return 1
    else:
        print(f"  [i] Memakai akun guru yang sudah ada: `{username}`")

    # ── 2. Login ──
    print(f"\n  {'='*70}\n  2. LOGIN GURU\n  {'='*70}")
    token = login(username, sandi)
    print(f"  [v] Berhasil masuk sebagai `{username}`")

    # ── 2b. Pastikan profilnya benar-benar berperan teacher ──
    #
    # Membuat akun lewat Admin API tidak selalu langsung menghasilkan profil
    # berperan teacher: bila akun itu SUDAH ADA lebih dulu (mis. pernah
    # terdaftar sebagai siswa), baris profilnya sudah berperan 'student' dan
    # tidak ikut berubah. Peran di `profiles` hanya dinaikkan oleh trigger
    # saat metadata auth DITULIS, jadi metadata ditulis ulang agar trigger
    # berjalan. Tanpa langkah ini, pembuatan kelas gagal dengan
    # "Hanya guru yang boleh membuat kelas."
    peran, admin_flag = peran_profil(token)
    if peran and peran != "teacher" and not admin_flag:
        print(f"  [!] Peran profil masih '{peran}'. Memperbaiki lewat app_metadata ...")
        uid_guru = uid_guru or cari_uid(username, kunci)
        if uid_guru and tulis_metadata_guru(username, uid_guru, kunci):
            token = login(username, sandi)          # ambil token baru
            peran, admin_flag = peran_profil(token)
        if peran != "teacher" and not admin_flag:
            print("\n  [X] Peran masih belum teacher setelah perbaikan.")
            print("      Jalankan SQL ini di Supabase SQL Editor, lalu ulangi:")
            print("        UPDATE public.profiles SET role = 'teacher'")
            print(f"        WHERE username = '{username}';")
            return 1
        print("  [v] Peran guru diperbaiki menjadi teacher")

    # ── 3. Kelas ──
    print(f"\n  {'='*70}\n  3. KELAS\n  {'='*70}")
    kode = buat_kelas(token, nama_kelas, sekolah)
    print(f"  [v] Kelas `{nama_kelas}` dibuat dengan kode: {kode}")

    # ── 4. Akun siswa ──
    print(f"\n  {'='*70}\n  4. AKUN SISWA ({len(siswa)})\n  {'='*70}")
    data = ka.siapkan_data(siswa, sandi_siswa)
    berhasil, sudah, gagal = [], [], []

    for d in data:
        status, hasil = ka.panggil_buat_siswa(
            token, kode, d["nama"], d["absen"], d["username"], d["sandi"]
        )
        pesan = ""
        if isinstance(hasil, dict):
            pesan = str(hasil.get("message") or hasil.get("hint") or "")
        if status in (200, 201):
            berhasil.append(d)
            print(f"  [v] {d['absen']:>2}. {d['username']:<18} {d['nama']}")
        elif "sudah ada" in pesan.lower() or "sudah terdaftar" in pesan.lower():
            sudah.append(d)
            print(f"  [=] {d['absen']:>2}. {d['username']:<18} {d['nama']}  (sudah ada)")
        else:
            gagal.append({**d, "pesan": pesan or f"HTTP {status}"})
            print(f"  [X] {d['absen']:>2}. {d['username']:<18} {d['nama']}  -> {pesan or status}")

    # ── 5. Berkas kredensial ──
    csv = berkas.with_name(berkas.stem + "-akun.csv")
    with csv.open("w", encoding="utf-8-sig", newline="") as f:
        f.write("PERAN,NO,ABSEN,NAMA,USERNAME,KATA SANDI,STATUS,KODE KELAS\n")
        f.write(
            f"GURU,,,{csv(nama_guru)},{csv(username)},{csv(sandi)},dibuat,{csv(kode)}\n"
        )
        for n, d in enumerate(data, 1):
            if d in berhasil:
                st = "dibuat"
            elif any(x["username"] == d["username"] for x in sudah):
                st = "sudah ada"
            else:
                st = "GAGAL"
            f.write(
                f"SISWA,{n},{d['absen']},{csv(d['nama'])},{csv(d['username'])},"
                f"{csv(d['sandi'])},{st},{csv(kode)}\n"
            )

    # ── 6. Ringkasan ──
    print(f"\n  {'='*70}\n  SELESAI\n  {'='*70}")
    print(f"  Guru  : {username} / {sandi}")
    print(f"  Kelas : {nama_kelas}  kode = {kode}")
    print(f"  Siswa : {len(berhasil)} dibuat, {len(sudah)} sudah ada, {len(gagal)} gagal")
    print(f"  Kredensial: {csv}")

    if gagal:
        print("\n  Yang GAGAL:")
        for g in gagal:
            print(f"    - absen {g['absen']} {g['nama']}: {g['pesan']}")

    print("\n  ⚠️  CATAT kata sandi guru di atas — TIDAK akan ditampilkan lagi.")
    print(f"  Siswa masuk dengan username masing-masing, kata sandi {sandi_siswa}.")
    print("")
    return 0 if not gagal else 1


if __name__ == "__main__":
    raise SystemExit(main())
