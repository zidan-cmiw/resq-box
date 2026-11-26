#!/usr/bin/env python
"""
Buat akun GURU dan akun MURID sekaligus, lengkap dengan kata sandinya.

═══════════════════════════════════════════════════════════════════════════
MENGAPA SKRIP INI ADA
═══════════════════════════════════════════════════════════════════════════

  Pendaftaran mandiri sudah ditutup, sehingga akun hanya bisa dibuat dari
  sisi server. Skrip `buat_akun_uji.py` hanya membuat SATU akun siswa. Skrip
  ini membuat satu kelas utuh: seorang guru beserta sejumlah murid, sekaligus
  menuliskan daftar kata sandinya ke berkas agar tidak lupa.

═══════════════════════════════════════════════════════════════════════════
CARA MENJALANKAN
═══════════════════════════════════════════════════════════════════════════

  $env:SUPABASE_SERVICE_ROLE_KEY = "<kunci service_role>"

  # guru + 5 murid, kata sandi bawaan
  python scripts\\buat_akun_guru_murid.py --guru guru --murid 5

  # kata sandi ditentukan sendiri
  python scripts\\buat_akun_guru_murid.py --guru pakbudi --murid 30 ^
      --sandi-guru Guru#2026 --sandi-murid Murid#2026

  # hanya memeriksa apa yang sudah ada (dikelompokkan per kelas)
  python scripts\\buat_akun_guru_murid.py --periksa

  # menyetel ulang kata sandi akun yang SUDAH ada
  python scripts\\buat_akun_guru_murid.py --guru guru --murid 5 --paksa

═══════════════════════════════════════════════════════════════════════════
YANG DIBUAT
═══════════════════════════════════════════════════════════════════════════

  1. Baris `classrooms` (bila kelas belum ada), dengan teacher_username = guru.
  2. Akun auth guru + profilnya (role = 'teacher', classroom_code = kelas).
  3. Akun auth murid ke-1..ke-N + profilnya (role = 'student', nomor absen
     berurutan, unlocked_level sesuai --level).

  Keluaran tambahan: akun-kelas.csv dan akun-kelas.md di folder yang sama
  dengan skrip dijalankan, berisi username dan kata sandi.

  Akun yang SUDAH ADA dilewati, sehingga skrip aman dijalankan berulang kali
  dan tidak menimpa kata sandi yang sudah dibagikan. Pakai --paksa bila ingin
  menyetel ulang kata sandi akun lama.
"""
from __future__ import annotations

import csv
import json
import os
import secrets
import string
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

BASIS = os.environ.get("SUPABASE_URL", "https://miwfotsnkikozqhvewtw.supabase.co")
SEKOLAH = "SMP Negeri 4 Pakem"


def kunci() -> str:
    k = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "").strip()
    if not k:
        raise SystemExit(
            "  [X] SUPABASE_SERVICE_ROLE_KEY belum diset.\n"
            "      $env:SUPABASE_SERVICE_ROLE_KEY = \"<kunci service_role>\""
        )
    return k


def panggil(jalur: str, k: str, metode: str = "GET", isi=None, header=None):
    data = json.dumps(isi).encode() if isi is not None else None
    h = {
        "apikey": k,
        "Authorization": f"Bearer {k}",
        "Content-Type": "application/json",
    }
    if header:
        h.update(header)
    req = urllib.request.Request(BASIS + jalur, data=data, headers=h, method=metode)
    try:
        with urllib.request.urlopen(req) as r:
            teks = r.read().decode() or "{}"
            try:
                return r.status, json.loads(teks)
            except json.JSONDecodeError:
                return r.status, teks
    except urllib.error.HTTPError as e:
        teks = e.read().decode() or "{}"
        try:
            return e.code, json.loads(teks)
        except json.JSONDecodeError:
            return e.code, teks


def cari_uid(username: str, k: str) -> str | None:
    st, rows = panggil(
        f"/rest/v1/profiles?select=id&lower_username=eq.{username.lower()}", k
    )
    if st == 200 and rows:
        return rows[0].get("id")
    # cadangan: telusuri halaman pertama daftar pengguna
    st, hasil = panggil("/auth/v1/admin/users?per_page=200", k)
    if st == 200:
        for u in hasil.get("users", []):
            meta = u.get("app_metadata") or {}
            if str(meta.get("username", "")).lower() == username.lower():
                return u.get("id")
    return None


def pastikan_kelas(kode: str, nama: str, guru: str, k: str) -> None:
    st, ada = panggil(
        f"/rest/v1/classrooms?select=code&code=eq.{urllib.parse.quote(kode)}", k
    )
    if st == 200 and ada:
        panggil(
            f"/rest/v1/classrooms?code=eq.{urllib.parse.quote(kode)}", k, "PATCH",
            {"teacher_username": guru, "name": nama, "school_name": SEKOLAH},
            header={"Prefer": "return=minimal"},
        )
        print(f"  [i] Kelas {kode} sudah ada — guru dan nama diperbarui")
        return
    st, hasil = panggil(
        "/rest/v1/classrooms", k, "POST",
        {"code": kode, "name": nama, "teacher_username": guru, "school_name": SEKOLAH},
        header={"Prefer": "return=minimal"},
    )
    if st not in (200, 201, 204):
        raise SystemExit(f"  [X] Gagal membuat kelas (HTTP {st}): {json.dumps(hasil)[:200]}")
    print(f"  [v] Kelas {kode} dibuat ({nama})")


def buat_akun(username: str, sandi: str, nama: str, peran: str, kode_kelas: str | None,
              absen: str | None, level: int, k: str, paksa: bool = False) -> tuple[bool, str, bool]:
    """Membuat akun auth + profil.

    Mengembalikan (berhasil, pesan, dilewati). Akun yang sudah ada TIDAK
    diubah kata sandinya kecuali `paksa` dinyatakan, supaya menjalankan skrip
    berulang kali tidak menimpa kata sandi yang mungkin sudah dibagikan.
    """
    email = f"{username}@resqbox.local"
    uid = cari_uid(username, k)

    if uid and not paksa:
        return True, "sudah ada — dilewati", True

    if uid:
        st, hasil = panggil(f"/auth/v1/admin/users/{uid}", k, "PUT", {
            "password": sandi,
            "email_confirm": True,
            "app_metadata": {"role": peran, "username": username},
            "user_metadata": {"name": nama, "username": username},
        })
        if st not in (200, 201):
            return False, f"gagal menyetel ulang sandi (HTTP {st}): {json.dumps(hasil)[:120]}", False
    else:
        st, hasil = panggil("/auth/v1/admin/users", k, "POST", {
            "email": email,
            "password": sandi,
            "email_confirm": True,
            "app_metadata": {"role": peran, "username": username},
            "user_metadata": {"name": nama, "username": username},
        })
        if st not in (200, 201):
            return False, f"gagal membuat akun (HTTP {st}): {json.dumps(hasil)[:120]}", False
        uid = hasil.get("id")

    isi = {
        "role": peran,
        "name": nama,
        "classroom_code": kode_kelas,
        "unlocked_level": level,
    }
    if absen is not None:
        isi["absent_number"] = absen

    st, hasil = panggil(
        f"/rest/v1/profiles?username=eq.{urllib.parse.quote(username)}", k, "PATCH", isi,
        header={"Prefer": "return=representation"},
    )

    percobaan = 0
    while st == 409 and "23505" in json.dumps(hasil) and absen is not None and percobaan < 5:
        percobaan += 1
        absen = str(int(absen) + 1)
        isi["absent_number"] = absen
        st, hasil = panggil(
            f"/rest/v1/profiles?username=eq.{urllib.parse.quote(username)}", k, "PATCH", isi,
            header={"Prefer": "return=representation"},
        )

    if st not in (200, 204):
        return False, f"gagal memperbarui profil (HTTP {st}): {json.dumps(hasil)[:120]}", False

    return True, "ok", False


def sandi_acak(n: int = 8) -> str:
    abjad = string.ascii_lowercase + string.digits
    return "".join(secrets.choice(abjad) for _ in range(n))


def main() -> int:
    arg = sys.argv[1:]
    if not arg or arg[0] in ("-h", "--help", "help"):
        print(__doc__)
        return 0

    opsi: dict[str, str] = {}
    i = 0
    while i < len(arg):
        if arg[i].startswith("--"):
            nama = arg[i][2:]
            if nama == "periksa":
                opsi[nama] = "ya"
                i += 1
            else:
                opsi[nama] = arg[i + 1] if i + 1 < len(arg) else ""
                i += 2
        else:
            i += 1

    k = kunci()

    if "periksa" in opsi:
        st, semua = panggil(
            "/rest/v1/profiles?select=username,name,role,classroom_code,absent_number,"
            "unlocked_level&order=classroom_code,absent_number", k)
        if st != 200:
            raise SystemExit(f"  [X] Gagal membaca daftar akun (HTTP {st}): {json.dumps(semua)[:200]}")

        semua = semua or []
        kelas: dict[str, list] = {}
        for akun in semua:
            kelas.setdefault(akun.get("classroom_code") or "(tanpa kelas)", []).append(akun)

        print(f"\n  TOTAL AKUN: {len(semua)} "
              f"({sum(1 for a in semua if a['role'] == 'teacher')} guru, "
              f"{sum(1 for a in semua if a['role'] == 'student')} murid)")

        for kode in sorted(kelas):
            isi = kelas[kode]
            print(f"\n  KELAS {kode}")
            for a in isi:
                if a["role"] == "teacher":
                    print(f"    [GURU ] {a['username']:<16} {a.get('name') or '-'}")
            murid_kelas = [a for a in isi if a["role"] == "student"]
            print(f"    murid : {len(murid_kelas)} akun")
            for a in murid_kelas:
                absen = a.get("absent_number") or "-"
                print(f"      {a['username']:<16} absen {absen:<4} level {a.get('unlocked_level')}")
        return 0

    guru = (opsi.get("guru") or "guru").lower().strip()
    jumlah = int(opsi.get("murid", "5"))
    kode_kelas = (opsi.get("kelas") or "RESQ-8A").upper()
    nama_kelas = opsi.get("nama-kelas") or "Kelas VIII-A"
    sandi_guru = opsi.get("sandi-guru") or "guru2026"
    sandi_murid = opsi.get("sandi-murid") or "murid2026"
    level = int(opsi.get("level", "1"))
    awalan = (opsi.get("awalan") or "murid").lower().strip()

    if level not in (1, 2, 3):
        raise SystemExit("  [X] --level harus 1, 2, atau 3.")
    if jumlah < 1 or jumlah > 60:
        raise SystemExit("  [X] --murid harus antara 1 dan 60.")

    print(f"\n  Menyiapkan kelas {kode_kelas} — 1 guru dan {jumlah} murid")
    pastikan_kelas(kode_kelas, nama_kelas, guru, k)

    catatan: list[dict] = []

    paksa = "paksa" in opsi

    # Tampilkan dulu apa yang sudah ada, supaya jelas mana yang baru.
    st, sudah = panggil(
        "/rest/v1/profiles?select=username,role,absent_number&"
        f"classroom_code=eq.{urllib.parse.quote(kode_kelas)}&order=role,absent_number", k)
    sudah = sudah if st == 200 and isinstance(sudah, list) else []
    if sudah:
        guru_ada = [a["username"] for a in sudah if a.get("role") == "teacher"]
        murid_ada = [a["username"] for a in sudah if a.get("role") == "student"]
        print(f"  [i] Sudah ada di {kode_kelas}: {len(sudah)} akun")
        if guru_ada:
            print(f"      guru  : {', '.join(guru_ada)}")
        if murid_ada:
            print(f"      murid : {', '.join(murid_ada[:12])}"
                  + (" …" if len(murid_ada) > 12 else ""))
        if not paksa:
            print("      akun lama dilewati; pakai --paksa untuk menyetel ulang kata sandinya")
    else:
        print(f"  [i] Belum ada akun di {kode_kelas}")

    baru = dilewati = gagal = 0

    ok, pesan, skip = buat_akun(guru, sandi_guru, f"Guru {nama_kelas}", "teacher",
                                kode_kelas, None, 3, k, paksa=paksa)
    print(f"  {'[v]' if ok else '[X]'} guru {guru:<12} {pesan}")
    if ok:
        baru += 0 if skip else 1
        dilewati += 1 if skip else 0
        catatan.append({"peran": "guru", "username": guru, "sandi": sandi_guru,
                        "nama": f"Guru {nama_kelas}", "absen": "", "kelas": kode_kelas})
    else:
        gagal += 1

    for n in range(1, jumlah + 1):
        username = f"{awalan}{n}"
        nama = f"Murid {n}"
        ok, pesan, skip = buat_akun(username, sandi_murid, nama, "student",
                                    kode_kelas, str(n), level, k, paksa=paksa)
        print(f"  {'[v]' if ok else '[X]'} {username:<12} {pesan}")
        if ok:
            baru += 0 if skip else 1
            dilewati += 1 if skip else 0
            catatan.append({"peran": "murid", "username": username, "sandi": sandi_murid,
                            "nama": nama, "absen": str(n), "kelas": kode_kelas})
        else:
            gagal += 1

    csv_path = Path("akun-kelas.csv")
    with csv_path.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["peran", "username", "sandi", "nama", "absen", "kelas"])
        w.writeheader()
        w.writerows(catatan)

    md_path = Path("akun-kelas.md")
    baris = ["# Akun RESQ-BOX", "",
             f"Kelas: **{kode_kelas}** — {nama_kelas}", "",
             "| Peran | Username | Kata sandi | Absen |", "|---|---|---|---|"]
    for c in catatan:
        baris.append(f"| {c['peran']} | `{c['username']}` | `{c['sandi']}` | {c['absen']} |")
    md_path.write_text("\n".join(baris) + "\n", encoding="utf-8")

    print(f"\n  RINGKASAN: {baru} baru · {dilewati} dilewati · {gagal} gagal")
    print(f"  [v] {len(catatan)} akun tercatat — lihat {csv_path.name} dan {md_path.name}")
    print(f"      Guru masuk dengan `{guru}` / `{sandi_guru}`")
    print(f"      Murid masuk dengan `{awalan}1` … `{awalan}{jumlah}` / `{sandi_murid}`")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
