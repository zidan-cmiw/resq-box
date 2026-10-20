#!/usr/bin/env python
"""
Lihat dan bersihkan akun siswa yang salah tempat.

═══════════════════════════════════════════════════════════════════════════
MENGAPA SKRIP INI ADA
═══════════════════════════════════════════════════════════════════════════

  Ketika pembuatan akun siswa diulang, skrip lama selalu MEMBUAT KELAS BARU.
  Akun siswa dari percobaan sebelumnya sudah ada, jadi pembuatannya dilewati
  ("sudah ada") — dan akun yang dilewati tetap berada di kelas LAMA.

  Akibatnya muncul dua kelas bernama sama, dan siswanya terpecah. Skrip ini
  dipakai untuk melihat pembagian sebenarnya, lalu menghapus yang salah tempat.

═══════════════════════════════════════════════════════════════════════════
CARA MENJALANKAN
═══════════════════════════════════════════════════════════════════════════

  Lihat SEMUA kelas beserta jumlah siswanya:

    $env:SUPABASE_SERVICE_ROLE_KEY = "<kunci>"
    python scripts/bersihkan_akun.py daftar

  Lihat kelas milik satu guru saja (beserta nama & username siswanya):

    python scripts/bersihkan_akun.py daftar guru

  HAPUS siswa milik seorang guru, kecuali akun tertentu (mis. akun demo).
  TANPA --konfirmasi, perintah ini hanya MENAMPILKAN apa yang akan dihapus:

    python scripts/bersihkan_akun.py hapus guru --kecuali demo
    python scripts/bersihkan_akun.py hapus guru --kecuali demo --konfirmasi

  PINDAHKAN kelas ke guru lain — siswa ikut, tidak ada yang dihapus:

    python scripts/bersihkan_akun.py pindah RESQ-8A peni --nama "Kelas 8A"
    python scripts/bersihkan_akun.py pindah RESQ-8A peni --nama "Kelas 8A" --konfirmasi

  PINDAHKAN SATU SISWA ke kelas lain (mis. akun demo supaya absennya bebas):

    python scripts/bersihkan_akun.py pindah-siswa demo RESQ-DEMO123456 --konfirmasi

  BUAT kelas kosong untuk seorang guru:

    python scripts/bersihkan_akun.py buat-kelas guru "Kelas Demo" --konfirmasi

  HAPUS satu kelas beserta akun siswanya (untuk kelas kembar yang salah):

    python scripts/bersihkan_akun.py hapus-kelas RESQ-KELA932462
    python scripts/bersihkan_akun.py hapus-kelas RESQ-KELA932462 --konfirmasi

═══════════════════════════════════════════════════════════════════════════
KEAMANAN
═══════════════════════════════════════════════════════════════════════════

  - Memerlukan kunci `service_role` (menembus seluruh RLS). Jangan disimpan.
  - Menghapus akun auth IKUT menghapus profil dan seluruh nilainya, karena
    `profiles.id REFERENCES auth.users(id) ON DELETE CASCADE` dan tabel nilai
    merujuk `profiles(id) ON DELETE CASCADE`.
  - Akun berperan teacher/admin TIDAK PERNAH dihapus skrip ini.
  - Tanpa --konfirmasi, tidak ada satu pun yang dihapus.
"""
from __future__ import annotations

import getpass
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from collections import defaultdict
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
        print("      Settings -> API -> service_role (secret)\n")
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


def panggil(jalur: str, k: str, metode: str = "GET", isi=None,
            header: dict | None = None):
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


# ── Pembacaan data ────────────────────────────────────────────────────────

def semua_kelas(k: str) -> list[dict]:
    status, hasil = panggil(
        "/rest/v1/classrooms?select=code,name,teacher_username&order=teacher_username,code", k
    )
    if status != 200:
        raise SystemExit(f"  [X] Gagal membaca kelas (HTTP {status}): {hasil}")
    return hasil or []


def siswa_per_kelas(k: str) -> dict[str, list[dict]]:
    status, hasil = panggil(
        "/rest/v1/profiles?select=id,username,name,absent_number,classroom_code,role"
        "&role=eq.student&order=classroom_code,absent_number",
        k,
    )
    if status != 200:
        raise SystemExit(f"  [X] Gagal membaca siswa (HTTP {status}): {hasil}")
    peta: dict[str, list[dict]] = defaultdict(list)
    for s in hasil or []:
        peta[str(s.get("classroom_code"))].append(s)
    return peta


# ── Perintah ──────────────────────────────────────────────────────────────

def perintah_daftar(kunci_guru: str | None, k: str) -> None:
    kelas = semua_kelas(k)
    peta = siswa_per_kelas(k)

    if kunci_guru:
        kelas = [c for c in kelas if (c.get("teacher_username") or "").lower() == kunci_guru.lower()]
        if not kelas:
            print(f"\n  (tidak ada kelas milik guru `{kunci_guru}`)")
            return

    print(f"\n  {'='*74}")
    print(f"  KELAS & JUMLAH SISWA{' milik guru ' + repr(kunci_guru) if kunci_guru else ''}")
    print(f"  {'='*74}")
    print(f"  {'KODE':<20} {'GURU':<12} {'SISWA':>5}  NAMA KELAS")
    print(f"  {'-'*20} {'-'*12} {'-'*5}  {'-'*24}")
    for c in kelas:
        kode = c["code"]
        print(
            f"  {kode:<20} {str(c.get('teacher_username')):<12} "
            f"{len(peta.get(kode, [])):>5}  {c.get('name')}"
        )

    # Rincian siswa untuk kelas yang diminta
    if kunci_guru:
        for c in kelas:
            kode = c["code"]
            daftar = peta.get(kode, [])
            print(f"\n  ── {c.get('name')} ({kode}) — {len(daftar)} siswa ──")
            if not daftar:
                print("     (kosong)")
            for s in daftar:
                print(
                    f"     absen {str(s.get('absent_number') or '-'):>3}  "
                    f"{str(s.get('username')):<18} {s.get('name')}"
                )


def perintah_hapus(kunci_guru: str, kecuali: set[str], kelas_diminta: str | None,
                   konfirmasi: bool, hapus_kelas_juga: bool, k: str) -> int:
    kelas = [c for c in semua_kelas(k)
             if (c.get("teacher_username") or "").lower() == kunci_guru.lower()]
    if not kelas:
        print(f"\n  (tidak ada kelas milik guru `{kunci_guru}`)")
        return 0
    if kelas_diminta:
        kelas = [c for c in kelas if c["code"] == kelas_diminta.upper()]
        if not kelas:
            print(f"\n  [X] Kelas {kelas_diminta} bukan milik `{kunci_guru}`.")
            return 1

    peta = siswa_per_kelas(k)
    kode_kelas = [c["code"] for c in kelas]

    akan_hapus: list[dict] = []
    dilewati: list[dict] = []
    for kode in kode_kelas:
        for s in peta.get(kode, []):
            if (s.get("role") or "") != "student":
                dilewati.append({**s, "alasan": "bukan siswa"})
            elif str(s.get("username") or "").lower() in kecuali:
                dilewati.append({**s, "alasan": "dikecualikan"})
            else:
                akan_hapus.append({**s, "kelas": kode})

    print(f"\n  {'='*74}")
    print(f"  AKAN MENGHAPUS {len(akan_hapus)} AKUN SISWA milik guru `{kunci_guru}`")
    print(f"  {'='*74}")
    for s in akan_hapus:
        print(
            f"  - {s['kelas']:<20} absen {str(s.get('absent_number') or '-'):>3}  "
            f"{str(s.get('username')):<18} {s.get('name')}"
        )
    if dilewati:
        print(f"\n  DIKECUALIKAN / DILEWATI ({len(dilewati)}):")
        for s in dilewati:
            print(
                f"  = {str(s.get('username')):<18} {s.get('name')}  ({s['alasan']})"
            )

    if not konfirmasi:
        print("\n  PRATINJAU SAJA — belum ada yang dihapus.")
        print("  Untuk benar-benar menghapus, ulangi dengan --konfirmasi\n")
        return 0

    print(f"\n  Menghapus {len(akan_hapus)} akun ...")
    berhasil, gagal = 0, []
    for s in akan_hapus:
        status, hasil = panggil(f"/auth/v1/admin/users/{s['id']}", k, "DELETE")
        if status in (200, 204):
            berhasil += 1
        else:
            gagal.append((s, status, hasil))
            print(f"  [X] {s.get('username')}: HTTP {status} {json.dumps(hasil)[:120]}")

    print(f"\n  {'='*74}")
    print(f"  Terhapus : {berhasil}")
    print(f"  Gagal    : {len(gagal)}")
    print(f"  {'='*74}")

    if hapus_kelas_juga:
        print("\n  Menghapus kelas ...")
        for kode in kode_kelas:
            status, hasil = panggil(
                f"/rest/v1/classrooms?code=eq.{urllib.parse.quote(kode)}", k, "DELETE"
            )
            tanda = "[v]" if status in (200, 204) else f"[X] HTTP {status}"
            print(f"  {tanda} {kode}")

    print("\n  Selesai. Kata sandi dan akun yang dikecualikan tidak disentuh.\n")
    return 0 if not gagal else 1


def perintah_pindah(kode: str, guru_baru: str, nama_baru: str | None,
                    konfirmasi: bool, k: str) -> int:
    """
    Memindahkan kepemilikan kelas ke guru lain.

    Kolom `classrooms.teacher_username` adalah TEXT biasa tanpa foreign key dan
    tanpa trigger (diperiksa di migrasi 01), sehingga pemindahan tidak menyentuh
    akun siswa sama sekali: `profiles.classroom_code` tetap, jadi seluruh siswa
    ikut pindah bersama kelasnya.
    """
    kode = kode.upper().strip()
    status, hasil = panggil(
        f"/rest/v1/classrooms?select=code,name,teacher_username&code=eq.{urllib.parse.quote(kode)}", k
    )
    if status != 200:
        raise SystemExit(f"  [X] Gagal membaca kelas (HTTP {status}): {hasil}")
    if not hasil:
        raise SystemExit(f"  [X] Kelas {kode} tidak ditemukan.")

    kelas = hasil[0]
    peta = siswa_per_kelas(k)
    jumlah = len(peta.get(kode, []))

    print(f"\n  Kelas  : {kelas.get('name')} ({kode})")
    print(f"  Pemilik sekarang : {kelas.get('teacher_username')}")
    print(f"  Pemilik baru     : {guru_baru}")
    if nama_baru:
        print(f"  Nama baru        : {nama_baru}")
    print(f"  Siswa            : {jumlah} (ikut pindah, tidak dihapus)")

    if (kelas.get("teacher_username") or "").lower() == guru_baru.lower() and not nama_baru:
        print("\n  [i] Kelas ini sudah milik guru itu. Tidak ada yang diubah.\n")
        return 0

    if not konfirmasi:
        print("\n  PRATINJAU SAJA — belum ada yang diubah.")
        print("  Untuk benar-benar memindahkan, ulangi dengan --konfirmasi\n")
        return 0

    isi: dict[str, str] = {"teacher_username": guru_baru}
    if nama_baru:
        isi["name"] = nama_baru
    status, hasil = panggil(
        f"/rest/v1/classrooms?code=eq.{urllib.parse.quote(kode)}", k, "PATCH", isi,
        header={"Prefer": "return=representation"},
    )
    if status not in (200, 204):
        raise SystemExit(f"  [X] Gagal memindahkan (HTTP {status}): {json.dumps(hasil)[:240]}")

    print(f"\n  [v] Kelas {kode} kini milik `{guru_baru}`, {jumlah} siswa ikut.\n")
    return 0


def perintah_hapus_kelas(kode: str, konfirmasi: bool, k: str) -> int:
    """Menghapus kelas BESERTA akun siswanya (meniru delete_my_classroom)."""
    kode = kode.upper().strip()
    status, hasil = panggil(
        f"/rest/v1/classrooms?select=code,name,teacher_username&code=eq.{urllib.parse.quote(kode)}", k
    )
    if status != 200:
        raise SystemExit(f"  [X] Gagal membaca kelas (HTTP {status}): {hasil}")
    if not hasil:
        raise SystemExit(f"  [X] Kelas {kode} tidak ditemukan.")

    kelas = hasil[0]
    siswa = siswa_per_kelas(k).get(kode, [])

    print(f"\n  Kelas  : {kelas.get('name')} ({kode})")
    print(f"  Pemilik: {kelas.get('teacher_username')}")
    print(f"  Siswa yang IKUT TERHAPUS: {len(siswa)}")
    for s in siswa:
        print(f"    - absen {str(s.get('absent_number') or '-'):>3}  {s.get('username'):<18} {s.get('name')}")

    if not konfirmasi:
        print("\n  PRATINJAU SAJA — belum ada yang dihapus.")
        print("  Untuk benar-benar menghapus, ulangi dengan --konfirmasi\n")
        return 0

    gagal = 0
    for s in siswa:
        st, hs = panggil(f"/auth/v1/admin/users/{s['id']}", k, "DELETE")
        if st not in (200, 204):
            gagal += 1
            print(f"  [X] {s.get('username')}: HTTP {st}")

    st, hs = panggil(
        f"/rest/v1/classrooms?code=eq.{urllib.parse.quote(kode)}", k, "DELETE"
    )
    if st not in (200, 204):
        print(f"  [X] Gagal menghapus kelas: HTTP {st} {json.dumps(hs)[:160]}")
        return 1

    print(f"\n  [v] Kelas {kode} dihapus, {len(siswa) - gagal} akun siswa ikut terhapus.\n")
    return 0 if not gagal else 1


def _kode_kelas_baru(nama: str, k: str) -> str:
    """Kode kelas bergaya server: RESQ-<4 huruf><6 angka>, dijamin belum dipakai."""
    import random
    awalan = "".join(ch for ch in nama.upper() if ch.isalnum())[:4] or "CLS"
    for _ in range(25):
        kode = f"RESQ-{awalan}{random.randint(100000, 999999)}"
        st, ada = panggil(
            f"/rest/v1/classrooms?select=code&code=eq.{urllib.parse.quote(kode)}", k
        )
        if st == 200 and not ada:
            return kode
    raise SystemExit("  [X] Gagal membuat kode kelas yang unik. Coba lagi.")


def perintah_buat_kelas(guru: str, nama: str, kode: str | None,
                        konfirmasi: bool, k: str) -> int:
    """
    Membuat kelas untuk seorang guru lewat service_role.

    Dipakai ketika sebuah kelas perlu "rumah" tersendiri — misalnya kelas
    untuk akun demo — supaya tidak berebut nomor absen dengan kelas asli.
    """
    st, prof = panggil(
        f"/rest/v1/profiles?select=username,name,school_name,role,is_admin"
        f"&username=eq.{urllib.parse.quote(guru)}", k
    )
    if st != 200:
        raise SystemExit(f"  [X] Gagal membaca profil guru (HTTP {st}): {prof}")
    if not prof:
        raise SystemExit(f"  [X] Guru `{guru}` tidak ditemukan.")
    sekolah = prof[0].get("school_name") or "SMP Negeri 1"

    kode_final = kode.upper().strip() if kode else _kode_kelas_baru(nama, k)

    print(f"\n  Kelas baru untuk `{guru}`")
    print(f"    kode   : {kode_final}")
    print(f"    nama   : {nama}")
    print(f"    sekolah: {sekolah}")

    if not konfirmasi:
        print("\n  PRATINJAU SAJA — belum ada yang dibuat.")
        print("  Untuk benar-benar membuat, ulangi dengan --konfirmasi\n")
        return 0

    st, hasil = panggil("/rest/v1/classrooms", k, "POST", {
        "code": kode_final, "name": nama,
        "teacher_username": guru, "school_name": sekolah,
    }, header={"Prefer": "return=representation"})
    if st not in (200, 201):
        raise SystemExit(f"  [X] Gagal membuat kelas (HTTP {st}): {json.dumps(hasil)[:240]}")

    print(f"\n  [v] Kelas {kode_final} dibuat untuk `{guru}`.\n")
    return 0


def perintah_pindah_siswa(username_siswa: str, kode_tujuan: str,
                          absen: str | None, konfirmasi: bool, k: str) -> int:
    """
    Memindahkan SATU siswa ke kelas lain.

    Aplikasi tidak menyediakan pemindahan siswa antar kelas: `classroom_code`
    dikunci trigger agar klien tidak dapat memindah-mindah siswa. Pemindahan
    di sini dilakukan lewat service_role, yang berjalan tanpa JWT klien
    sehingga penjaga itu tidak aktif — inilah jalur resmi untuk kasus
    "siswa sudah ada di kelas yang salah".

    Nomor absen wajib unik per kelas, jadi konflik absen diperiksa lebih dulu.
    """
    username_siswa = username_siswa.lower().strip()
    kode_tujuan = kode_tujuan.upper().strip()

    st, prof = panggil(
        f"/rest/v1/profiles?select=id,username,name,absent_number,classroom_code,role"
        f"&username=eq.{urllib.parse.quote(username_siswa)}", k
    )
    if st != 200:
        raise SystemExit(f"  [X] Gagal membaca siswa (HTTP {st}): {prof}")
    if not prof:
        raise SystemExit(f"  [X] Siswa `{username_siswa}` tidak ditemukan.")
    siswa = prof[0]
    if (siswa.get("role") or "") != "student":
        raise SystemExit(f"  [X] `{username_siswa}` bukan akun siswa (peran: {siswa.get('role')}).")

    st, kelas = panggil(
        f"/rest/v1/classrooms?select=code,name,teacher_username"
        f"&code=eq.{urllib.parse.quote(kode_tujuan)}", k
    )
    if st != 200:
        raise SystemExit(f"  [X] Gagal membaca kelas tujuan (HTTP {st}): {kelas}")
    if not kelas:
        raise SystemExit(f"  [X] Kelas tujuan {kode_tujuan} tidak ditemukan.")

    absen_final = str(absen if absen is not None else siswa.get("absent_number") or "1")

    # Konflik absen di kelas tujuan?
    st, bentrok = panggil(
        f"/rest/v1/profiles?select=username,name&classroom_code=eq.{urllib.parse.quote(kode_tujuan)}"
        f"&absent_number=eq.{urllib.parse.quote(absen_final)}", k
    )
    if st == 200 and bentrok:
        lain = [b for b in bentrok if b.get("username") != username_siswa]
        if lain:
            raise SystemExit(
                f"  [X] Absen {absen_final} di {kode_tujuan} sudah dipakai: "
                f"{lain[0].get('username')} ({lain[0].get('name')}).\n"
                "      Pindahkan dulu akun itu, atau pilih absen lain dengan --absen N."
            )

    print(f"\n  Siswa : {siswa.get('name')} ({username_siswa})")
    print(f"  Absen : {siswa.get('absent_number')} -> {absen_final}")
    print(f"  Kelas : {siswa.get('classroom_code') or '(tanpa kelas)'} -> {kode_tujuan} ({kelas[0].get('name')})")

    if not konfirmasi:
        print("\n  PRATINJAU SAJA — belum ada yang dipindahkan.")
        print("  Untuk benar-benar memindahkan, ulangi dengan --konfirmasi\n")
        return 0

    st, hasil = panggil(
        f"/rest/v1/profiles?id=eq.{siswa['id']}", k, "PATCH",
        {"classroom_code": kode_tujuan, "absent_number": absen_final},
        header={"Prefer": "return=representation"},
    )
    if st not in (200, 204):
        raise SystemExit(f"  [X] Gagal memindahkan (HTTP {st}): {json.dumps(hasil)[:240]}")

    print(f"\n  [v] {username_siswa} kini di kelas {kode_tujuan}, absen {absen_final}.\n")
    return 0


def main() -> int:
    arg = sys.argv[1:]
    if not arg or arg[0] in ("-h", "--help", "help"):
        print(__doc__)
        return 0

    TANPA_NILAI = {"konfirmasi", "hapus-kelas"}
    perintah = arg[0]
    opsi: dict[str, str] = {}
    posisi: list[str] = []
    i = 1
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

    k = kunci()

    if perintah == "daftar":
        perintah_daftar(posisi[0] if posisi else None, k)
        return 0

    if perintah == "hapus":
        if not posisi:
            raise SystemExit("  [X] Pemakaian: hapus <username_guru> [--kecuali a,b] [--konfirmasi]")
        kecuali = {
            x.strip().lower()
            for x in (opsi.get("kecuali") or "").split(",")
            if x.strip()
        }
        return perintah_hapus(
            posisi[0],
            kecuali,
            opsi.get("kelas"),
            "konfirmasi" in opsi,
            "hapus-kelas" in opsi,
            k,
        )

    if perintah == "buat-kelas":
        if len(posisi) < 2:
            raise SystemExit("  [X] Pemakaian: buat-kelas <username_guru> \"<Nama Kelas>\" [--kode KODE] [--konfirmasi]")
        return perintah_buat_kelas(
            posisi[0], posisi[1], opsi.get("kode"), "konfirmasi" in opsi, k
        )

    if perintah == "pindah-siswa":
        if len(posisi) < 2:
            raise SystemExit("  [X] Pemakaian: pindah-siswa <username_siswa> <KODE_KELAS> [--absen N] [--konfirmasi]")
        return perintah_pindah_siswa(
            posisi[0], posisi[1], opsi.get("absen"), "konfirmasi" in opsi, k
        )

    if perintah == "pindah":
        if len(posisi) < 2:
            raise SystemExit("  [X] Pemakaian: pindah <KODE_KELAS> <username_guru> [--nama \"Kelas 8A\"] [--konfirmasi]")
        return perintah_pindah(
            posisi[0], posisi[1], opsi.get("nama"), "konfirmasi" in opsi, k
        )

    if perintah == "hapus-kelas":
        if not posisi:
            raise SystemExit("  [X] Pemakaian: hapus-kelas <KODE_KELAS> [--konfirmasi]")
        return perintah_hapus_kelas(posisi[0], "konfirmasi" in opsi, k)

    raise SystemExit(
        f"  [X] Perintah tidak dikenal: {perintah}\n"
        "      Coba: daftar | buat-kelas | pindah-siswa | pindah | hapus-kelas | hapus"
    )


if __name__ == "__main__":
    raise SystemExit(main())
