"""
Uji apakah data terlindungi dari akses tanpa login.

MENGAPA UJI INI PENTING
  Kunci `anon` Supabase memang DIRANCANG untuk ikut terpasang di dalam
  aplikasi — ia akan terlihat oleh siapa pun yang memeriksa berkas APK atau
  .exe. Itu BUKAN kebocoran, SELAMA Row Level Security (RLS) menolak akses
  yang tidak berhak.

  Uji ini membuktikan RLS benar-benar bekerja: meminta data langsung ke
  Supabase memakai kunci anon, tanpa login sama sekali.
"""
from __future__ import annotations

import json
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

AKAR = Path(__file__).resolve().parent.parent
env = (AKAR / ".env").read_text(encoding="utf-8")
URL = re.search(r"VITE_SUPABASE_URL=(\S+)", env).group(1)
KEY = re.search(r"VITE_SUPABASE_ANON_KEY=(\S+)", env).group(1)

print("=" * 78)
print("  UJI: AKSES TANPA LOGIN (kunci anon) — harus DITOLAK RLS")
print("=" * 78)
print(f"  Database : {URL}")
print(f"  Kunci    : {KEY[:38]}…  ({len(KEY)} karakter)\n")

TABEL = [
    ("profiles", "profil & peran pengguna"),
    ("level_submissions", "nilai siswa"),
    ("classrooms", "daftar kelas"),
    ("mission_progress", "kemajuan misi"),
    ("students", "tabel siswa (lama)"),
    ("user_accounts", "akun (lama)"),
]

lulus = 0
gagal = 0

for tabel, keterangan in TABEL:
    url = f"{URL}/rest/v1/{tabel}?select=*&limit=3"
    req = urllib.request.Request(
        url, headers={"apikey": KEY, "Authorization": f"Bearer {KEY}"}
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            isi = r.read().decode("utf-8", "replace")
            status = r.status
    except urllib.error.HTTPError as e:
        isi = e.read().decode("utf-8", "replace")
        status = e.code
    except Exception as e:  # noqa: BLE001
        print(f"  GAGAL   {tabel:<20} {keterangan}")
        print(f"          {type(e).__name__}: {e}")
        gagal += 1
        continue

    ringkas = isi[:70]
    try:
        j = json.loads(isi)
        if isinstance(j, list):
            if len(j) == 0:
                ringkas = "KOSONG (0 baris) -> RLS menolak  [BENAR]"
                lulus += 1
            else:
                ringkas = f"{len(j)} BARIS TERBACA -> PERIKSA!  {isi[:60]}"
                gagal += 1
        elif isinstance(j, dict) and j.get("message"):
            ringkas = j["message"][:70]
            # Pesan galat dari PostgREST karena tabel tidak ada juga berarti
            # data TIDAK terbaca — itu aman.
            lulus += 1
    except json.JSONDecodeError:
        if status >= 400:
            lulus += 1
        else:
            gagal += 1

    tanda = "[v]" if "BENAR" in ringkas or status >= 400 else "[?]"
    print(f"  {tanda} HTTP {status:<4} {tabel:<20} {ringkas}")

print("\n" + "=" * 78)
print(f"  HASIL: {lulus} terlindungi, {gagal} terbuka")
if gagal:
    print("  PERHATIAN: ada tabel yang dapat dibaca tanpa login!")
else:
    print("  Seluruh tabel terlindungi dari akses tanpa login.")
print("=" * 78)
sys.exit(1 if gagal else 0)
