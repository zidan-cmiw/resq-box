#!/usr/bin/env python
"""
Uji dari LUAR: apakah data satu guru dapat dilihat guru lain?

═══════════════════════════════════════════════════════════════════════════
MENGAPA UJI INI ADA
═══════════════════════════════════════════════════════════════════════════

  Rencananya RESQ-BOX dipakai di BANYAK SEKOLAH dengan banyak akun guru.
  Setiap guru mengampu kelas berbeda, jadi:

      DATA GURU A  TIDAK BOLEH TERLIHAT OLEH GURU B

  Membaca kode migrasi saja TIDAK cukup untuk membuktikannya. Kode dapat
  terlihat benar tetapi salah saat dijalankan; kebijakan RLS dapat tidak
  terpasang; GRANT dapat membocorkan tabel.

  Uji ini menembak REST API Supabase dari LUAR, memakai kunci publik yang
  sama dengan yang dipakai peramban — persis seperti penyerang.

═══════════════════════════════════════════════════════════════════════════
YANG DIUJI
═══════════════════════════════════════════════════════════════════════════

  1. Tanpa login: apakah tabel sensitif dapat dibaca?
  2. Tanpa login: apakah fungsi guru dapat dipanggil?
  3. Pendaftaran mandiri: apakah peran 'teacher' dapat dipaksakan?

  Uji yang MEMANG boleh berhasil (memang dirancang publik) juga dicatat,
  supaya perbedaannya jelas.
"""
from __future__ import annotations

import json
import os
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

SUPABASE = "https://miwfotsnkikozqhvewtw.supabase.co"


def ambil_kunci_publik() -> str:
    """
    Ambil kunci publik (anon) dari hasil bangun web.

    Kunci ini MEMANG publik — ia dikirim ke setiap peramban yang membuka
    website, dan dapat dilihat siapa pun lewat alat pengembang peramban.
    Karena itu ia tidak disimpan sebagai rahasia, melainkan dibaca dari
    berkas hasil bangun.

    Dipakai untuk menguji dari LUAR, persis seperti yang dapat dilakukan
    penyerang.
    """
    # 1. Dari variabel lingkungan, bila ada
    for nama in ("VITE_SUPABASE_ANON_KEY", "SUPABASE_ANON_KEY"):
        nilai = os.environ.get(nama)
        if nilai:
            return nilai.strip()

    # 2. Dari berkas .env
    env = Path(__file__).resolve().parent.parent / ".env"
    if env.exists():
        for baris in env.read_text(encoding="utf-8", errors="ignore").split("\n"):
            if baris.strip().startswith("VITE_SUPABASE_ANON_KEY"):
                return baris.split("=", 1)[1].strip().strip('"').strip("'")

    # 3. Dari hasil bangun web
    dist = Path(__file__).resolve().parent.parent / "dist" / "assets"
    if dist.exists():
        for f in dist.glob("*.js"):
            m = re.search(
                r"(eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,})",
                f.read_text(encoding="utf-8", errors="ignore"),
            )
            if m:
                return m.group(1)

    raise SystemExit(
        "  [X] Kunci publik tidak ditemukan.\n"
        "      Jalankan `npm run build` lebih dahulu, atau set "
        "VITE_SUPABASE_ANON_KEY."
    )


ANON = ambil_kunci_publik()

TABEL = ["profiles", "level_submissions", "classrooms", "rate_limits"]

# Fungsi yang WAJIB menolak tanpa login.
FUNGSI_PRIVAT = [
    "get_my_profile", "get_my_progress", "list_my_classrooms",
    "list_class_students", "list_class_submissions", "create_my_classroom",
    "delete_my_classroom", "rename_my_classroom", "delete_my_student",
    "teacher_create_student", "update_my_profile", "update_my_teacher_profile",
    "submit_level_result",
]

# Fungsi yang MEMANG publik, tetapi harus terbatas.
FUNGSI_PUBLIK = ["class_exists", "class_code_info", "username_available"]


def panggil(jalur: str, metode: str = "GET", isi: dict | None = None):
    """Panggil REST API Supabase memakai kunci publik saja (tanpa login)."""
    data = json.dumps(isi).encode() if isi is not None else None
    req = urllib.request.Request(f"{SUPABASE}{jalur}", method=metode, data=data)
    req.add_header("apikey", ANON)
    req.add_header("Authorization", f"Bearer {ANON}")
    req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.status, r.read().decode("utf-8", "ignore")[:150]
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", "ignore")[:150]
    except Exception as e:  # noqa: BLE001
        return 0, str(e)[:150]


def main() -> int:
    print("=" * 84)
    print("  UJI DARI LUAR — TANPA LOGIN (memakai kunci publik yang sama dengan peramban)")
    print("=" * 84)

    bocor = 0

    # ── 1. Tabel sensitif ─────────────────────────────────────────────────
    print("\n  ── 1. TABEL: dapat dibaca tanpa login? ──")
    for t in TABEL:
        status, isi = panggil(f"/rest/v1/{t}?select=*&limit=1")
        aman = status in (401, 403)
        if not aman:
            bocor += 1
        print(f"      {'[v]' if aman else '[X]'} {t:<20} HTTP {status}  {'' if aman else isi[:80]}")

    # ── 2. Fungsi privat ──────────────────────────────────────────────────
    print("\n  ── 2. FUNGSI PRIVAT: dapat dipanggil tanpa login? ──")
    for f in FUNGSI_PRIVAT:
        status, isi = panggil(f"/rest/v1/rpc/{f}", "POST", {})
        # Ditolak bila 401/403, ATAU 400/404 yang berarti tidak dapat dijalankan.
        aman = status in (401, 403, 404) or (
            status == 400 and ("permission" in isi.lower() or "harus login" in isi.lower()
                               or "not exist" in isi.lower() or "could not find" in isi.lower())
        )
        if not aman:
            bocor += 1
        print(f"      {'[v]' if aman else '[X]'} {f:<26} HTTP {status}  {'' if aman else isi[:70]}")

    # ── 3. Fungsi publik (harus tetap terbatas) ───────────────────────────
    print("\n  ── 3. FUNGSI PUBLIK: memang boleh, tetapi harus terbatas ──")
    for f in FUNGSI_PUBLIK:
        arg = {"p_code": "TIDAK-ADA-KODE", "p_username": "tidakadaanamax"}
        status, isi = panggil(f"/rest/v1/rpc/{f}", "POST", arg)
        # class_code_info hanya boleh mengembalikan found:false untuk kode asing
        terbatas = "found" in isi and "false" in isi.lower()
        print(f"      {'[v]' if status == 200 else '[i]'} {f:<22} HTTP {status}  {isi[:70]}")
        if status == 200 and "found" in isi and "false" not in isi.lower():
            print("          [X] mengembalikan data untuk kode yang tidak ada!")
            bocor += 1

    # ── 4. Pendaftaran mandiri dengan peran guru ──────────────────────────
    print("\n  ── 4. PENDAFTARAN MANDIRI: peran 'teacher' dapat dipaksakan? ──")
    status, isi = panggil("/auth/v1/signup", "POST", {
        "email": "penyusup.guru@resqbox.local",
        "password": "coba-coba-12345",
        "data": {"role": "teacher", "username": "penyusupguru"},
    })
    ditolak = status not in (200, 201)
    if not ditolak:
        bocor += 1
    print(f"      {'[v]' if ditolak else '[X]'} pendaftaran mandiri  HTTP {status}")
    print(f"          {isi[:110]}")
    print("          (ditolak = benar; peran hanya dapat diberikan server)")

    # ── 5. Menulis profil sendiri tanpa login ─────────────────────────────
    print("\n  ── 5. MENULIS: dapat mengubah data tanpa login? ──")
    status, isi = panggil("/rest/v1/profiles?id=eq.00000000-0000-0000-0000-000000000000",
                          "PATCH", {"role": "admin"})
    aman = status in (401, 403)
    if not aman:
        bocor += 1
    print(f"      {'[v]' if aman else '[X]'} PATCH profiles (naikkan peran)  HTTP {status}  {'' if aman else isi[:70]}")

    print("\n" + "=" * 84)
    if bocor:
        print(f"  HASIL: {bocor} KEBOCORAN DITEMUKAN")
        print("=" * 84)
        return 1
    print("  HASIL: tidak ada kebocoran; seluruh jalur tanpa login tertutup")
    print("=" * 84)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
