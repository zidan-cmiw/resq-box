#!/usr/bin/env python
"""
Diagnosa: mengapa dua akun guru melihat murid yang sama?

═══════════════════════════════════════════════════════════════════════════
MENGAPA SKRIP INI ADA
═══════════════════════════════════════════════════════════════════════════

  Dilaporkan: masuk ke akun guru "guru" dan akun "tyas" menampilkan DAFTAR
  MURID YANG SAMA.

  Padahal pengujian terhadap kebijakan RLS dan fungsi RPC menunjukkan
  isolasi antar-guru sudah bekerja. Berarti penyebabnya ada di tempat lain.

  Kecurigaan utama, dari membaca kode:

      src/app/TeacherDashboard/index.tsx:51
      const [selectedClassCode, setSelectedClassCode] = useState('RESQ-8A');

  Setiap guru yang membuka Dashboard Guru LANGSUNG diarahkan ke kode kelas
  'RESQ-8A' — kode yang ditulis MATI di dalam kode, bukan diambil dari kelas
  milik guru itu.

  Bila beberapa guru benar-benar memiliki kelas berkode 'RESQ-8A', mereka
  semua akan melihat murid kelas yang sama.

  Skrip ini MEMBACA DATABASE untuk membuktikan atau membantahnya, alih-alih
  menebak.

═══════════════════════════════════════════════════════════════════════════
KUNCI YANG DIPERLUKAN
═══════════════════════════════════════════════════════════════════════════

  Memerlukan kunci `service_role`, karena ia harus membaca `auth.users`
  (yang tidak dapat dibaca klien) dan `profiles` TANPA dibatasi RLS — justru
  supaya dapat terlihat apa yang SEBENARNYA ada di database.

  ⚠️  Kunci ini MENEMBUS SELURUH RLS. Jalankan hanya dari komputer
      tepercaya, jangan disimpan, jangan dikirim ke mana pun.

═══════════════════════════════════════════════════════════════════════════
CARA MENJALANKAN
═══════════════════════════════════════════════════════════════════════════

  $env:SUPABASE_SERVICE_ROLE_KEY = "<kunci>"
  python scripts/diagnosa_murid_kembar.py
"""
from __future__ import annotations

import getpass
import json
import os
import sys
import urllib.error
import urllib.request
from collections import Counter, defaultdict
from pathlib import Path

AKAR = Path(__file__).resolve().parent.parent


def alamat_proyek() -> str:
    for nama in ("VITE_SUPABASE_URL", "SUPABASE_URL"):
        if os.environ.get(nama):
            return os.environ[nama].rstrip("/")
    env = AKAR / ".env"
    if env.exists():
        for baris in env.read_text(encoding="utf-8", errors="ignore").split("\n"):
            if baris.strip().startswith("VITE_SUPABASE_URL"):
                return baris.split("=", 1)[1].strip().strip('"').strip("'").rstrip("/")
    raise SystemExit("  [X] VITE_SUPABASE_URL tidak ditemukan")


SUPABASE = alamat_proyek()


def kunci() -> str:
    nilai = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "").strip()
    if nilai:
        return nilai
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
        print(f"  [X] HTTP {e.code} pada {jalur}: {e.read().decode('utf-8','ignore')[:200]}")
        return []
    except Exception as e:  # noqa: BLE001
        print(f"  [X] {e}")
        return []


def main() -> int:
    k = kunci()

    print("=" * 78)
    print("  DIAGNOSA: MENGAPA DUA AKUN GURU MELIHAT MURID YANG SAMA")
    print("=" * 78)

    # ── 1. Akun guru di auth.users ────────────────────────────────────────
    print("\n  ── 1. AKUN GURU (dari auth.users) ──")
    pengguna = ambil("/auth/v1/admin/users?per_page=500", k)
    daftar = pengguna.get("users", pengguna if isinstance(pengguna, list) else [])
    guru = [u for u in daftar
            if (u.get("app_metadata") or {}).get("role") == "teacher"]

    if not guru:
        print("      (tidak ada akun dengan app_metadata.role = teacher)")
    for u in guru:
        am = u.get("app_metadata") or {}
        print(f"      email            : {u.get('email')}")
        print(f"          app_meta.role     : {am.get('role')}")
        print(f"          app_meta.username : {am.get('username')}")
        print(f"          terkonfirmasi     : {'ya' if u.get('email_confirmed_at') else 'TIDAK'}")
        print("")

    # ── 2. Profil guru ────────────────────────────────────────────────────
    print("  ── 2. PROFIL (public.profiles, peran teacher) ──")
    profil_guru = ambil(
        "/rest/v1/profiles?role=eq.teacher&select=id,username,role,is_admin,name,school_name,classroom_code",
        k,
    )
    for p in profil_guru:
        print(f"      username={p.get('username'):<16} "
              f"is_admin={str(p.get('is_admin')):<6} "
              f"kelas={p.get('classroom_code')}  nama={p.get('name')}")
    if not profil_guru:
        print("      (tidak ada profil dengan role = teacher)")

    # Adakah username ganda di antara guru?
    hitung = Counter((p.get("username") or "").lower() for p in profil_guru)
    ganda = {u: n for u, n in hitung.items() if n > 1 and u}
    if ganda:
        print("")
        print(f"      [X] USERNAME GANDA DI ANTARA GURU: {ganda}")
        print("          Inilah penyebabnya: pemeriksaan kepemilikan kelas")
        print("          memakai username, sehingga akun dengan username sama")
        print("          dianggap guru yang SAMA.")

    # ── 3. Kelas ──────────────────────────────────────────────────────────
    print("\n  ── 3. KELAS (public.classrooms) ──")
    kelas = ambil("/rest/v1/classrooms?select=code,name,teacher_username,school_name&order=code", k)
    for c in kelas:
        print(f"      {c.get('code'):<14} pemilik={str(c.get('teacher_username')):<16} "
              f"nama={c.get('name')}  sekolah={c.get('school_name')}")
    if not kelas:
        print("      (tidak ada kelas)")

    # ── 4. Kelas RESQ-8A — inti kecurigaan ────────────────────────────────
    print("\n  ── 4. KELAS 'RESQ-8A' (kode yang ditulis mati di kode aplikasi) ──")
    kelas_8a = [c for c in kelas if (c.get("code") or "").upper() == "RESQ-8A"]
    if not kelas_8a:
        print("      [v] Kelas 'RESQ-8A' TIDAK ADA di database.")
        print("          Jadi guru yang membuka Dashboard akan langsung")
        print("          dikoreksi ke kelas miliknya sendiri oleh pemeriksaan")
        print("          di baris 109. Isolasi seharusnya sudah bekerja.")
    else:
        for c in kelas_8a:
            print(f"      [X] ADA: pemilik={c.get('teacher_username')}  nama={c.get('name')}")
        if len(kelas_8a) == 1:
            print("")
            print("          Hanya SATU kelas berkode itu, jadi hanya pemiliknya")
            print("          yang dapat melihat muridnya. Bila dua guru melihat")
            print("          daftar yang sama, periksa bagian 5 di bawah.")

    # ── 5. Murid per kelas ────────────────────────────────────────────────
    print("\n  ── 5. MURID PER KELAS ──")
    murid = ambil(
        "/rest/v1/profiles?role=eq.student&select=id,username,name,classroom_code,absent_number&order=classroom_code,absent_number",
        k,
    )
    per_kelas: dict[str, list] = defaultdict(list)
    for m in murid:
        per_kelas[str(m.get("classroom_code"))].append(m)

    for kode in sorted(per_kelas):
        daftar_m = per_kelas[kode]
        print(f"      kelas {kode:<14} {len(daftar_m)} murid")
        contoh = ", ".join((m.get("name") or "?") for m in daftar_m[:5])
        print(f"          contoh: {contoh}")

    # ── 6. KESIMPULAN ─────────────────────────────────────────────────────
    print("\n" + "=" * 78)
    print("  KESIMPULAN")
    print("=" * 78)

    masalah = []
    if ganda:
        masalah.append("Ada guru dengan USERNAME SAMA — isolasi kelas jadi kacau.")
    if len(kelas_8a) == 1 and len(profil_guru) > 1:
        pemilik = kelas_8a[0].get("teacher_username")
        lain = [p for p in profil_guru if (p.get("username") or "") != pemilik]
        masalah.append(
            f"Kelas 'RESQ-8A' dimiliki '{pemilik}'. Guru lain ({len(lain)} akun) "
            "TIDAK seharusnya melihat muridnya."
        )
    if len(kelas) == 0:
        masalah.append("BELUM ADA KELAS sama sekali — guru perlu membuat kelas lebih dahulu.")

    if masalah:
        for i, m in enumerate(masalah, 1):
            print(f"  {i}. {m}")
    else:
        print("  Tidak ditemukan penyebab yang jelas di database.")
        print("  Kirimkan keluaran skrip ini agar dapat ditelusuri lebih lanjut.")

    print("")
    print("  CATATAN PENTING: bila setiap guru MEMANG memiliki kelasnya sendiri,")
    print("  tetapi keduanya melihat daftar murid yang sama, penyebabnya ada di")
    print("  APLIKASI, bukan di database. Penyebab yang paling mungkin:")
    print("")
    print("      src/app/TeacherDashboard/index.tsx:51")
    print("      const [selectedClassCode, setSelectedClassCode] = useState('RESQ-8A');")
    print("")
    print("  Kode itu menulis mati 'RESQ-8A'. Setiap guru yang membuka Dashboard")
    print("  Guru LANGSUNG diarahkan ke kode kelas itu, bukan ke kelas miliknya.")
    print("=" * 78)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
