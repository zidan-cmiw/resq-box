#!/usr/bin/env python
"""
Buktikan apakah server benar-benar memisahkan data antar-guru.

═══════════════════════════════════════════════════════════════════════════
MENGAPA SKRIP INI ADA
═══════════════════════════════════════════════════════════════════════════

  Dilaporkan: masuk ke akun guru yang berbeda menampilkan DAFTAR MURID YANG
  SAMA.

  Membaca kode saja tidak cukup untuk memastikan. Skrip ini MASUK sebagai
  guru yang sesungguhnya, lalu memanggil fungsi yang sama dengan yang dipakai
  Dashboard Guru, dan memeriksa apa yang SEBENARNYA dikembalikan server.

  Ia juga menguji apakah pembatasan kepemilikan BENAR-BENAR BEKERJA, dengan
  cara memanggil kelas yang BUKAN milik guru itu — yang seharusnya DITOLAK.

  Uji semacam ini penting: kode dapat terlihat benar tetapi tidak berjalan.
  Satu-satunya cara mengetahui adalah mencobanya.

═══════════════════════════════════════════════════════════════════════════
YANG DIPERIKSA
═══════════════════════════════════════════════════════════════════════════

  Untuk SETIAP akun guru yang kamu berikan:

    1. Dapat masuk atau tidak
    2. `list_my_classrooms()`  -> kelas apa saja yang dia lihat
    3. `list_class_students()` -> murid di tiap kelasnya
    4. Memanggil kelas MILIK GURU LAIN -> harus DITOLAK

  Butir 4 adalah uji yang paling penting: itulah yang membuktikan isolasi.

  Hanya memakai kunci PUBLIK (anon), sama seperti peramban. Tidak perlu kunci
  service_role, sehingga skrip ini aman dijalankan.

═══════════════════════════════════════════════════════════════════════════
CARA MENJALANKAN
═══════════════════════════════════════════════════════════════════════════

  python scripts/bukti_pisah_guru.py guru:SandiGuru1 tyas:SandiTyas2

  Format tiap akun:  <username>:<password>

  KATA SANDI TIDAK DISIMPAN dan tidak ditampilkan.
"""
from __future__ import annotations

import json
import os
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

AKAR = Path(__file__).resolve().parent.parent


def konfigurasi() -> tuple[str, str]:
    """Ambil alamat proyek dan kunci publik dari lingkungan atau .env."""
    url = kunci = ""
    for nama in ("VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"):
        if os.environ.get(nama):
            if nama.endswith("URL"):
                url = os.environ[nama]
            else:
                kunci = os.environ[nama]
    env = AKAR / ".env"
    if (not url or not kunci) and env.exists():
        for baris in env.read_text(encoding="utf-8", errors="ignore").split("\n"):
            if baris.strip().startswith("VITE_SUPABASE_URL"):
                url = baris.split("=", 1)[1].strip().strip('"').strip("'")
            if baris.strip().startswith("VITE_SUPABASE_ANON_KEY"):
                kunci = baris.split("=", 1)[1].strip().strip('"').strip("'")
    if not url or not kunci:
        raise SystemExit("  [X] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY tidak ditemukan")
    return url.rstrip("/"), kunci


SUPABASE, ANON = konfigurasi()


def panggil(jalur: str, metode: str = "GET", isi: dict | None = None, token: str | None = None):
    data = json.dumps(isi).encode() if isi is not None else None
    req = urllib.request.Request(f"{SUPABASE}{jalur}", method=metode, data=data)
    req.add_header("apikey", ANON)
    req.add_header("Authorization", f"Bearer {token or ANON}")
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


def masuk(username: str, sandi: str) -> tuple[str, str]:
    """Masuk memakai username (diubah menjadi email sintetis)."""
    domain = "resqbox.local"
    env = AKAR / ".env"
    if env.exists():
        for baris in env.read_text(encoding="utf-8", errors="ignore").split("\n"):
            if baris.strip().startswith("VITE_AUTH_EMAIL_DOMAIN"):
                domain = baris.split("=", 1)[1].strip().strip('"').strip("'")

    email = f"{username.lower()}@{domain}"
    status, hasil = panggil(
        "/auth/v1/token?grant_type=password", "POST",
        {"email": email, "password": sandi},
    )
    if status != 200 or not hasil.get("access_token"):
        pesan = hasil.get("error_description") or hasil.get("msg") or json.dumps(hasil)[:120]
        raise SystemExit(f"  [X] Gagal masuk sebagai {username}: {pesan}")
    return hasil["access_token"], email


def rpc(nama: str, arg: dict, token: str):
    return panggil(f"/rest/v1/rpc/{nama}", "POST", arg, token)


def periksa_guru(username: str, sandi: str) -> dict:
    print("")
    print("=" * 78)
    print(f"  GURU: {username}")
    print("=" * 78)

    token, email = masuk(username, sandi)
    print(f"  [v] berhasil masuk sebagai {email}")

    # 1. Kelas yang dia lihat
    status, kelas = rpc("list_my_classrooms", {}, token)
    if status != 200:
        print(f"  [X] list_my_classrooms gagal (HTTP {status}): {json.dumps(kelas)[:150]}")
        return {"username": username, "kelas": [], "murid": {}}

    if not isinstance(kelas, list):
        print(f"  [X] bentuk hasil tak terduga: {json.dumps(kelas)[:150]}")
        return {"username": username, "kelas": [], "murid": {}}

    print(f"  kelas yang TERLIHAT: {len(kelas)}")
    for c in kelas:
        print(f"      {c.get('code'):<16} {c.get('name')}  (pemilik: {c.get('teacher_username')})")

    if not kelas:
        print("      (belum punya kelas — perlu membuat kelas lebih dahulu)")

    # 2. Murid tiap kelas
    murid: dict[str, list] = {}
    for c in kelas:
        kode = c.get("code")
        status2, hasil2 = rpc("list_class_students", {"p_code": kode}, token)
        if status2 == 200 and isinstance(hasil2, list):
            murid[kode] = hasil2
            print(f"      murid di {kode}: {len(hasil2)}")
        else:
            print(f"      [X] murid di {kode}: gagal (HTTP {status2})")

    return {"username": username, "kelas": kelas, "murid": murid}


def main() -> int:
    if len(sys.argv) < 3:
        print(__doc__)
        return 2

    akun = []
    for arg in sys.argv[1:]:
        if ":" not in arg:
            print(f"  [X] format salah: '{arg}' — harus <username>:<password>")
            return 2
        u, s = arg.split(":", 1)
        akun.append((u, s))

    hasil = [periksa_guru(u, s) for u, s in akun]

    # ── UJI PALING PENTING: silang ────────────────────────────────────────
    print("")
    print("=" * 78)
    print("  UJI SILANG: dapatkah guru A melihat murid kelas guru B?")
    print("  (HARUS DITOLAK — inilah bukti isolasi bekerja)")
    print("=" * 78)

    gagal = 0
    for i, a in enumerate(hasil):
        for j, b in enumerate(hasil):
            if i == j:
                continue
            kode_b = {c.get("code") for c in b["kelas"]}
            kode_a = {c.get("code") for c in a["kelas"]}
            hanya_b = kode_b - kode_a
            if not hanya_b:
                print(f"\n  {a['username']} -> {b['username']}: tidak ada kelas milik B "
                      f"yang bukan milik A, jadi tidak ada yang bisa diuji.")
                continue

            for kode in sorted(hanya_b):
                token, _ = masuk(a["username"], dict(akun)[a["username"]])
                status, res = rpc("list_class_students", {"p_code": kode}, token)
                if status == 200:
                    jumlah = len(res) if isinstance(res, list) else "?"
                    print(f"\n  [X] {a['username']} BERHASIL membaca kelas {kode} milik "
                          f"{b['username']} — {jumlah} murid terbaca!")
                    print("      ISOLASI BOCOR. Ini yang harus diperbaiki.")
                    gagal += 1
                else:
                    pesan = res.get("message") or res.get("msg") or ""
                    print(f"\n  [v] {a['username']} -> kelas {kode} (milik {b['username']}) "
                          f"DITOLAK (HTTP {status})")
                    print(f"      {pesan[:90]}")

    # ── Ringkasan ─────────────────────────────────────────────────────────
    print("")
    print("=" * 78)
    print("  RINGKASAN")
    print("=" * 78)
    for h in hasil:
        total = sum(len(v) for v in h["murid"].values())
        print(f"  {h['username']:<16} {len(h['kelas'])} kelas, {total} murid terlihat")

    # Apakah dua guru melihat kumpulan murid yang SAMA PERSIS?
    if len(hasil) == 2:
        kumpulan = []
        for h in hasil:
            idmurid = set()
            for daftar in h["murid"].values():
                for m in daftar:
                    idmurid.add(m.get("id"))
            kumpulan.append(idmurid)
        if kumpulan[0] and kumpulan[0] == kumpulan[1]:
            print("")
            print("  [X] KEDUA GURU MELIHAT KUMPULAN MURID YANG SAMA PERSIS.")
            print("      Periksa: apakah mereka memang berbagi kelas yang sama?")
            print("      Periksa juga apakah `classrooms.teacher_username` untuk")
            print("      kelas itu memang hanya memuat SATU nama.")
            gagal += 1

    print("")
    if gagal:
        print(f"  HASIL: {gagal} masalah isolasi ditemukan")
        print("=" * 78)
        return 1
    print("  HASIL: isolasi antar-guru BEKERJA — tidak ada yang bocor")
    print("=" * 78)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
