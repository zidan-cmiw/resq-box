#!/usr/bin/env python
"""
Periksa mengapa progres siswa hilang saat login di perangkat lain.

═══════════════════════════════════════════════════════════════════════════
GEJALA YANG DIPERIKSA
═══════════════════════════════════════════════════════════════════════════

  Siswa bermain di perangkat A dan mencapai Level 2. Ketika akun yang sama
  dipakai di perangkat B, permainan dimulai dari awal.

  Ada DUA kemungkinan yang sangat berbeda, dan menebak akan membuang waktu:

    1. Nilai TIDAK PERNAH sampai ke server.
       Pengiriman gagal (mis. ditolak RPC), lalu hanya diantrekan di
       localStorage perangkat A oleh `simpanNilaiTertunda`. Di perangkat B
       antrean itu tidak ada, jadi tidak ada yang bisa dipulihkan.

    2. Nilai SAMPAI ke server, tetapi `profiles.unlocked_level` tidak naik.
       Klien membaca level dari kolom itu saat login
       (lihat getInitialUnlockedLevel di teacherStore.ts), jadi bila kolomnya
       tetap 1, permainan memang mulai dari awal.

  Skrip ini membaca keduanya sekaligus dan membandingkannya, sehingga
  penyebabnya dapat ditentukan dari satu kali jalan.

═══════════════════════════════════════════════════════════════════════════
CARA MENJALANKAN
═══════════════════════════════════════════════════════════════════════════

  $env:SUPABASE_SERVICE_ROLE_KEY = "<kunci service_role>"
  python scripts/diagnosa_progres.py                # semua siswa
  python scripts/diagnosa_progres.py abimanyu       # satu siswa saja

  Memerlukan kunci `service_role` karena harus membaca seluruh baris tanpa
  dibatasi RLS. Kunci tidak disimpan dan tidak ditampilkan.
"""
from __future__ import annotations

import getpass
import json
import os
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
        print("      Supabase Dashboard -> Settings -> API -> service_role\n")
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


def ambil(jalur: str, k: str):
    req = urllib.request.Request(f"{ALAMAT}{jalur}")
    req.add_header("apikey", k)
    req.add_header("Authorization", f"Bearer {k}")
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            teks = r.read().decode("utf-8", "ignore")
            return json.loads(teks) if teks.strip() else []
    except urllib.error.HTTPError as e:
        print(f"  [X] HTTP {e.code} pada {jalur}")
        print(f"      {e.read().decode('utf-8', 'ignore')[:200]}")
        return None


def main() -> int:
    import sys

    filter_user = sys.argv[1].lower().strip() if len(sys.argv) > 1 else None

    k = kunci()
    print(f"\n  Proyek: {ALAMAT}")

    # ── 1. Profil siswa ──
    q = "select=id,username,name,classroom_code,unlocked_level,role&role=eq.student&order=username"
    if filter_user:
        q += f"&username=eq.{urllib.parse.quote(filter_user)}"
    siswa = ambil(f"/rest/v1/profiles?{q}", k)
    if siswa is None:
        return 2
    if not siswa:
        print("  [!] Tidak ada profil siswa yang cocok.")
        return 1

    # ── 2. Seluruh pengiriman nilai ──
    # Kolom waktunya bernama `completed_at`, BUKAN `created_at`
    # (lihat CREATE TABLE public.level_submissions di migrasi 01).
    kiriman = ambil(
        "/rest/v1/level_submissions?select=student_id,student_name,classroom_code,"
        "level_number,score,completed_at,details&order=completed_at.desc",
        k,
    )
    if kiriman is None:
        return 2

    per_siswa: dict[str, list[dict]] = defaultdict(list)
    for r in kiriman:
        per_siswa[str(r.get("student_id"))].append(r)

    # ── 3. Laporan ──
    print(f"\n  {'='*92}")
    print(f"  PROFIL SISWA ({len(siswa)}) dan NILAI DI SERVER ({len(kiriman)} kiriman)")
    print(f"  {'='*92}")
    print(f"  {'USERNAME':<16} {'KELAS':<18} {'LEVEL':>5}  {'L1':>4} {'L2':>4} {'L3':>4}  STATUS")

    tanpa_kelas = 0
    level_tanpa_nilai = 0
    nilai_tanpa_level = 0
    belum_ada_nilai = 0

    for s in siswa:
        uid = str(s.get("id") or "")
        rows = per_siswa.get(uid, [])

        skor: dict[int, int] = {}
        for r in rows:
            lv = int(r.get("level_number") or 0)
            skor[lv] = max(skor.get(lv, 0), int(r.get("score") or 0))

        uname = str(s.get("username"))
        kls = str(s.get("classroom_code") or "(TANPA KELAS)")
        lvl = int(s.get("unlocked_level") or 1)

        if not s.get("classroom_code"):
            tanpa_kelas += 1
        if not rows:
            belum_ada_nilai += 1
        if lvl >= 2 and not rows:
            level_tanpa_nilai += 1
        if rows and lvl < 2 and any(v >= 100 for v in skor.values()):
            nilai_tanpa_level += 1

        status = []
        if not s.get("classroom_code"):
            status.append("kelas NULL")
        if not rows:
            status.append("belum ada nilai")
        if lvl >= 2 and not rows:
            status.append("LEVEL NAIK tanpa nilai")
        if rows and lvl < 2 and any(v >= 100 for v in skor.values()):
            status.append("nilai 100 tapi LEVEL tetap 1")
        if any(v < 100 for v in skor.values()) and not rows:
            status.append("nilai di bawah 100")

        print(
            f"  {uname:<16} {kls:<18} {lvl:>5}  "
            f"{skor.get(1, '-'):>4} {skor.get(2, '-'):>4} {skor.get(3, '-'):>4}  "
            + (", ".join(status) if status else "[v] sinkron")
        )

    # ── 4. Bentuk `details` yang benar-benar tersimpan ──
    #
    #    Inilah yang menentukan apakah progres dapat dipulihkan di perangkat
    #    lain. Kalau `details` kosong, membuat jalur baca tidak akan menolong.
    print(f"\n  {'='*92}")
    print("  BENTUK `details` TERBARU (dasar untuk memulihkan progres)")
    print(f"  {'='*92}")

    contoh_siswa = siswa if filter_user else siswa[:3]
    ada_details = 0
    kosong_details = 0

    for s in contoh_siswa:
        uid = str(s.get("id") or "")
        rows = per_siswa.get(uid, [])
        if not rows:
            print(f"  {s.get('username'):<16} (belum ada kiriman)")
            continue
        terbaru: dict[int, dict] = {}
        for r in rows:  # sudah urut terbaru -> terlama
            lv = int(r.get("level_number") or 0)
            terbaru.setdefault(lv, r)
        for lv in sorted(terbaru):
            r = terbaru[lv]
            d = r.get("details") or {}
            if isinstance(d, dict) and d:
                ada_details += 1
                daftar_kunci = ", ".join(sorted(d.keys())[:10])
                print(f"  {s.get('username'):<16} L{lv} skor={r.get('score'):>3} "
                      f"({str(r.get('completed_at'))[:16]})")
                print(f"      kunci : {daftar_kunci}")
                ringkas = json.dumps(d, ensure_ascii=False)
                print(f"      isi   : {ringkas[:220]}")
            else:
                kosong_details += 1
                print(f"  {s.get('username'):<16} L{lv} skor={r.get('score'):>3} "
                      f"-> details KOSONG")

    # ── 5. Kesimpulan ──
    print(f"\n  {'='*92}")
    print("  KESIMPULAN")
    print(f"  {'='*92}")

    if ada_details == 0 and kosong_details > 0:
        print("  [X] Semua `details` KOSONG. Progres tidak dapat dipulihkan dari")
        print("      server walau jalur baca dibuat. Periksa dulu mengapa kiriman")
        print("      tidak membawa details.")
        print("")
        return 0

    if belum_ada_nilai == len(siswa):
        print("  [X] TIDAK ADA satu pun nilai di server.")
        print("      Artinya pengiriman nilai GAGAL di semua perangkat, dan hanya")
        print("      tersimpan di localStorage masing-masing. Saat login di perangkat")
        print("      lain, tidak ada yang bisa dipulihkan — karena itu mulai dari awal.")
        print("\n      Langkah berikutnya: jalankan permainan sekali dengan konsol")
        print("      peramban terbuka (F12 -> Console) untuk melihat galat dari")
        print("      `submit_level_result`. Galat itu yang perlu diperbaiki.")
    elif level_tanpa_nilai:
        print(f"  [!] {level_tanpa_nilai} siswa punya unlocked_level >= 2 TETAPI tidak")
        print("      punya baris nilai sama sekali. Kemungkinan level dinaikkan")
        print("      langsung di database, bukan lewat permainan.")
    elif nilai_tanpa_level:
        print(f"  [!] {nilai_tanpa_level} siswa punya nilai 100 TETAPI unlocked_level")
        print("      masih 1. Ini penyebab paling mungkin: nilai masuk, tetapi")
        print("      submit_level_result tidak menaikkan level.")
        print("      Periksa: apakah migrasi 14 sudah dijalankan, dan apakah")
        print("      skor yang dihitung server benar-benar mencapai 100.")
    elif tanpa_kelas:
        print(f"  [!] {tanpa_kelas} siswa TANPA kelas. Setelah migrasi 14, pengiriman")
        print("      nilai mereka akan DITOLAK. Tambahkan mereka ke kelas.")
    else:
        print("  [v] Data server tampak konsisten: nilai ada dan level ikut naik.")
        print("      Bila perangkat lain masih mulai dari awal, kemungkinan yang")
        print("      diperiksa adalah AKUN BERBEDA, atau klien belum memuat profil")
        print("      terbaru (coba keluar lalu masuk lagi).")

    print("")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
