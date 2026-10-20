#!/usr/bin/env python
"""
Diagnosa lengkap keadaan guru & kelas — menjawab "kenapa tidak bisa tambah murid".

═══════════════════════════════════════════════════════════════════════════
MENGAPA SKRIP INI ADA
═══════════════════════════════════════════════════════════════════════════

  Gejala: pada akun guru, jendela "+ TAMBAH SISWA" menolak dengan
  "Kelas belum dipilih.", dan "Kode Kelas:" kosong.

  Ada beberapa kemungkinan yang SALING BERBEDA, dan menebak akan membuang
  waktu:

    1. Guru itu memang belum punya kelas sama sekali
    2. Kelas sudah dibuat, tetapi `classrooms.teacher_username` tidak sama
       dengan `profiles.username` guru itu
    3. Kelas sudah dibuat, tetapi `list_my_classrooms` tidak mengembalikannya
    4. `profiles` guru itu tidak ada, sehingga peran guru tidak dikenali
    5. Migrasi 12 belum dijalankan, sehingga pembuatan kelas gagal

  Skrip ini membaca SELURUH data yang diperlukan SEKALIGUS, sehingga
  penyebabnya dapat ditentukan dari satu kali jalan — bukan dari beberapa
  kali tanya-jawab.

═══════════════════════════════════════════════════════════════════════════
PELAJARAN DARI KESALAHAN SKRIP INI SENDIRI
═══════════════════════════════════════════════════════════════════════════

  Versi pertama skrip ini MENGELABUI. Ketika kunci API salah, setiap
  permintaan gagal dengan HTTP 401, lalu hasilnya diperlakukan sebagai
  "daftar kosong" — sehingga skrip dengan yakin mencetak:

      [X] TIDAK ADA profil dengan role = 'teacher'
      [X] TIDAK ADA KELAS SAMA SEKALI di database

  Padahal kenyataannya request-nya GAGAL, bukan datanya kosong. Itu
  kesimpulan yang berbahaya, karena menuntun ke perbaikan yang salah
  (membuat ulang akun guru) padahal masalahnya cuma kunci.

  Sekarang kegagalan selalu dilaporkan SEBAGAI KEGAGALAN, dan bila ada
  satu saja permintaan yang gagal, keseluruhan diagnosa dinyatakan
  TIDAK SAH (exit code 2) alih-alih memberi kesimpulan.

═══════════════════════════════════════════════════════════════════════════
KUNCI YANG DIPERLUKAN
═══════════════════════════════════════════════════════════════════════════

  Memerlukan kunci `service_role`, karena harus membaca `auth.users` dan
  `profiles` TANPA dibatasi RLS — justru supaya dapat melihat apa yang
  SEBENARNYA ada di database.

  ⚠️  Kunci ini MENEMBUS SELURUH RLS. Jalankan hanya dari komputer
      tepercaya, jangan disimpan, jangan dikirim ke mana pun.

═══════════════════════════════════════════════════════════════════════════
CARA MENJALANKAN
═══════════════════════════════════════════════════════════════════════════

  Supabase Dashboard -> Settings -> API -> Project API keys, salin yang
  berlabel **service_role** (atau `sb_secret_...` pada tampilan baru).

  $env:SUPABASE_SERVICE_ROLE_KEY = "<tempel kunci di sini>"
  python scripts/diagnosa_guru_kelas.py

  Bila variabel itu belum diset, skrip akan memintanya (tanpa menampilkan).
"""
from __future__ import annotations

import getpass
import json
import os
import urllib.error
import urllib.request
from collections import defaultdict
from pathlib import Path

AKAR = Path(__file__).resolve().parent.parent

# Jumlah permintaan yang GAGAL. Selama angka ini > 0, kesimpulan apa pun
# tentang isi database TIDAK SAH.
KEGAGALAN = 0


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


SUPABASE = _dari_env("VITE_SUPABASE_URL").rstrip("/")
KUNCI_ANON = _dari_env("VITE_SUPABASE_ANON_KEY")


def _bentuk_kunci(k: str) -> str:
    """Keterangan bentuk kunci TANPA membocorkan isinya."""
    if not k:
        return "kosong"
    awalan = ""
    for calon in ("sb_secret_", "sb_publishable_", "eyJ"):
        if k.startswith(calon):
            awalan = f", berawalan `{calon}`"
            break
    return f"{len(k)} karakter{awalan}"


def periksa_kunci(k: str) -> bool:
    """
    Periksa kunci SEBELUM dipakai. Mengembalikan True bila tampaknya sah.

    Tujuannya menangkap kekeliruan yang paling sering: menempelkan teks
    contoh, memakai kunci anon, atau menyalin kunci terpotong.
    """
    masalah: list[str] = []

    if not k:
        masalah.append("Kunci masih KOSONG.")
    elif "<" in k or ">" in k:
        masalah.append(
            "Kunci masih berisi teks contoh (ada tanda < atau >). "
            "Ganti dengan kunci yang sebenarnya."
        )
    elif len(k) < 40:
        masalah.append(
            f"Kunci terlalu pendek ({len(k)} karakter). Kunci Supabase biasanya "
            "jauh lebih panjang — kemungkinan tersalin sebagian."
        )

    if k and KUNCI_ANON and k == KUNCI_ANON:
        masalah.append(
            "Yang dipasang adalah kunci ANON (kunci publik aplikasi), bukan "
            "service_role. Kunci anon dibatasi RLS, sehingga hasilnya akan "
            "tampak kosong."
        )

    if k.startswith("sb_publishable_"):
        masalah.append(
            "Yang dipasang kunci `sb_publishable_...` — itu pengganti kunci anon "
            "dan TIDAK dapat menembus RLS. Yang diperlukan `sb_secret_...`."
        )

    if masalah:
        print("\n  ⚠️  KUNCI API BERMASALAH — diagnosa tidak dijalankan.")
        print(f"      Bentuk kunci yang terbaca: {_bentuk_kunci(k)}")
        for m in masalah:
            print(f"      • {m}")
        print("\n      Ambil kunci yang benar:")
        print("        Supabase Dashboard -> Settings -> API -> Project API keys")
        print("        -> salin yang berlabel `service_role` (atau `sb_secret_...`)")
        print("\n      Lalu jalankan ulang:")
        print('        $env:SUPABASE_SERVICE_ROLE_KEY = "<kunci service_role>"')
        print("        python scripts/diagnosa_guru_kelas.py")
        return False

    print(f"  Kunci terbaca: {_bentuk_kunci(k)}")
    return True


def kunci() -> str:
    k = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "").strip()
    if k:
        return k
    print("\n  ⚠️  Diperlukan kunci `service_role` (MENEMBUS seluruh RLS).")
    print("      Settings -> API -> service_role (secret)\n")
    return getpass.getpass("  Tempel kunci service_role (tidak terlihat): ").strip()


def ambil(jalur: str, k: str):
    """
    Ambil data. Mengembalikan LIST bila berhasil, atau None bila GAGAL.

    Perbedaan itu penting: None berarti "tidak tahu", bukan "kosong".
    """
    global KEGAGALAN
    req = urllib.request.Request(f"{SUPABASE}{jalur}")
    req.add_header("apikey", k)
    req.add_header("Authorization", f"Bearer {k}")
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            teks = r.read().decode("utf-8", "ignore")
            return json.loads(teks) if teks.strip() else []
    except urllib.error.HTTPError as e:
        KEGAGALAN += 1
        isi = e.read().decode("utf-8", "ignore")
        print(f"  [X] HTTP {e.code} pada {jalur}")
        print(f"      {isi[:220]}")
        if e.code == 401:
            print("      -> Kunci DITOLAK server. Ini masalah KUNCI, bukan data kosong.")
        return None
    except Exception as e:  # noqa: BLE001
        KEGAGALAN += 1
        print(f"  [X] Gagal menghubungi server: {e}")
        return None


def main() -> int:
    if not SUPABASE:
        print("  [X] VITE_SUPABASE_URL tidak ditemukan di .env")
        return 2

    k = kunci()
    if not periksa_kunci(k):
        return 2

    print("=" * 80)
    print("  DIAGNOSA: GURU & KELAS")
    print("=" * 80)

    # ── 1. Profil guru ────────────────────────────────────────────────────
    profil = ambil(
        "/rest/v1/profiles?role=eq.teacher&select=id,username,role,is_admin,name,school_name", k
    )
    print(f"\n  ── 1. PROFIL GURU ({'GAGAL DIPERIKSA' if profil is None else len(profil)}) ──")
    if profil is None:
        print("      [?] Tidak dapat diperiksa — BUKAN berarti tidak ada.")
    elif not profil:
        print("      [X] Tidak ada profil dengan role = 'teacher'.")
        print("          Akun guru mungkin dibuat tanpa app_metadata.role = 'teacher'.")
    else:
        for p in profil:
            print(
                f"      username = {str(p.get('username'))!r:<20} "
                f"nama = {p.get('name')!r:<20} admin = {p.get('is_admin')}"
            )
            print(f"          id = {p.get('id')}")

    # ── 2. Semua kelas ────────────────────────────────────────────────────
    kelas = ambil("/rest/v1/classrooms?select=code,name,teacher_username,school_name&order=code", k)
    print(f"\n  ── 2. SEMUA KELAS ({'GAGAL DIPERIKSA' if kelas is None else len(kelas)}) ──")
    if kelas is None:
        print("      [?] Tidak dapat diperiksa — BUKAN berarti tidak ada kelas.")
    elif not kelas:
        print("      [X] Tidak ada kelas sama sekali di database.")
        print("          Berarti tombol 'BUAT KELAS BARU' belum pernah berhasil.")
    else:
        for c in kelas:
            print(
                f"      {str(c.get('code')):<20} pemilik = "
                f"{str(c.get('teacher_username'))!r:<18} nama = {c.get('name')!r}"
            )

    # ── 3. Kecocokan pemilik kelas dengan username guru ───────────────────
    print("\n  ── 3. KECOCOKAN PEMILIK KELAS DENGAN USERNAME GURU ──")
    if profil is None or kelas is None:
        print("      [?] Dilewati — data di atas belum lengkap.")
    elif not kelas:
        print("      (tidak ada kelas untuk diperiksa)")
    else:
        nama_guru = {(p.get("username") or "") for p in profil}
        for c in kelas:
            pemilik = c.get("teacher_username") or ""
            cocok = pemilik in nama_guru
            print(
                f"      {'[v]' if cocok else '[X]'} {c.get('code'):<20} pemilik {pemilik!r} "
                f"{'ADA di profil guru' if cocok else 'TIDAK ADA di profil guru!'}"
            )

    # ── 4. Murid per kelas ────────────────────────────────────────────────
    murid = ambil("/rest/v1/profiles?role=eq.student&select=id,username,name,classroom_code", k)
    print(f"\n  ── 4. MURID ({'GAGAL DIPERIKSA' if murid is None else len(murid)}) ──")
    if murid is None:
        print("      [?] Tidak dapat diperiksa — BUKAN berarti belum ada murid.")
    else:
        per_kelas: dict[str, int] = defaultdict(int)
        for m in murid:
            per_kelas[str(m.get("classroom_code"))] += 1
        if not per_kelas:
            print("      (belum ada murid)")
        for kode, n in sorted(per_kelas.items()):
            print(f"      kelas {kode:<20} {n} murid")

    # ── 5. KESIMPULAN ─────────────────────────────────────────────────────
    print("\n" + "=" * 80)
    print("  KESIMPULAN")
    print("=" * 80)

    if KEGAGALAN:
        print(f"  [X] DIAGNOSA TIDAK SAH — {KEGAGALAN} permintaan GAGAL.")
        print("      Data di atas TIDAK dapat dipakai untuk menyimpulkan apa pun.")
        print("      Perbaiki kunci API lebih dahulu, lalu jalankan ulang.")
        print("=" * 80)
        return 2

    if not profil:
        print("  [X] Tidak ada profil guru. Akun dibuat tanpa app_metadata.role.")
        print("      Perbaiki dengan scripts/kelola_akun_guru.py atau SQL di")
        print("      docs/KEAMANAN-AKUN-GURU.md.")
    elif not kelas:
        print("  [X] BELUM ADA KELAS SAMA SEKALI.")
        print("      Guru harus menekan 'BUAT KELAS BARU' lebih dahulu.")
        print("      Bila tombol itu GAGAL, periksa galat di konsol peramban.")
    else:
        guru_tanpa_kelas = [
            p for p in profil
            if not any((c.get("teacher_username") or "") == (p.get("username") or "") for c in kelas)
        ]
        if guru_tanpa_kelas:
            print(f"  [!] {len(guru_tanpa_kelas)} guru BELUM punya kelas:")
            for p in guru_tanpa_kelas:
                print(f"          {p.get('username')!r} ({p.get('name')!r})")
            print("      Mereka TIDAK DAPAT menambah murid sampai membuat kelas.")
        else:
            print("  [v] Setiap guru sudah punya setidaknya satu kelas.")

    print("=" * 80)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
