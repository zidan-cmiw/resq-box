#!/usr/bin/env python3
"""
Validator sintaks SQL RESQ-BOX.

Memakai `pglast` (binding libpg_query — parser PostgreSQL asli), sehingga
kesalahan sintaks tertangkap sebelum berkas dijalankan di Supabase.

Yang TIDAK divalidasi di sini (butuh server sungguhan):
  • keberadaan peran `anon` / `authenticated` / `supabase_auth_admin`
  • keberadaan skema `auth` dan tabel `auth.users` / `auth.identities`
  • ekstensi `pgcrypto` di skema `extensions`

Pakai:
    python supabase/validate_sql.py
Keluar dengan kode 1 bila ada berkas yang gagal diparse.
"""
from __future__ import annotations

import sys
from pathlib import Path

try:
    from pglast import parse_sql
except ImportError:  # pragma: no cover
    print("pglast belum terpasang. Jalankan: pip install pglast", file=sys.stderr)
    raise SystemExit(2)

SUPABASE_DIR = Path(__file__).resolve().parent

# Daftar berkas DIPINDAI OTOMATIS, bukan ditulis satu per satu.
#
# Sejarah kesalahan berkas ini, supaya tidak terulang:
#   - Versi 1: daftarnya hardcoded dan hanya memuat migrasi 01-03, sehingga
#     migrasi 04-08 tidak pernah diperiksa. Galat sintaks di berkas itu baru
#     ketahuan saat dijalankan di Supabase — di database produksi.
#   - Versi 2: memindai folder migrations/, tetapi MASIH melewatkan berkas .sql
#     yang berada di akar folder supabase/ (mis. perbaiki_hak_fungsi.sql).
#   - Versi 3 (ini): memindai SELURUH berkas .sql di bawah supabase/.
#
# Berkas baru kini otomatis ikut diperiksa, di mana pun ia diletakkan.
TARGETS = sorted(SUPABASE_DIR.rglob("*.sql"))


def validate(path: Path) -> tuple[bool, str]:
    if not path.exists():
        return False, "berkas tidak ditemukan"

    sql = path.read_text(encoding="utf-8")
    try:
        statements = parse_sql(sql)
    except Exception as exc:  # pglast melempar Error dengan posisi
        msg = str(exc)
        # Tampilkan konteks baris bila posisi tersedia
        return False, msg

    return True, f"{len(statements)} pernyataan OK"


def main() -> int:
    failures = 0
    print("Validasi sintaks SQL RESQ-BOX (libpg_query)")
    print("-" * 68)

    for target in TARGETS:
        ok, info = validate(target)
        label = target.name
        if ok:
            print(f"  [ OK ]  {label:<36} {info}")
        else:
            failures += 1
            print(f"  [FAIL]  {label}")
            for line in info.splitlines():
                print(f"          {line}")

    print("-" * 68)
    if failures:
        print(f"HASIL: {failures} berkas GAGAL diparse.")
    else:
        print("HASIL: semua berkas lolos validasi sintaks.")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
