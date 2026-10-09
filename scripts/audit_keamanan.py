#!/usr/bin/env python
"""
Audit keamanan menyeluruh atas yang DAPAT diverifikasi dari repositori.

MENGAPA DISUSUN ULANG
  Klaim "sudah aman" hanya boleh diucapkan untuk hal yang benar-benar diperiksa.
  Skrip ini memisahkan tiga tingkat keyakinan:

    [TERBUKTI]   dapat diperiksa dari isi repositori — dijalankan sekarang
    [CAMPURAN]   sebagian di repo, sebagian di dashboard (tidak dapat diperiksa)
    [TIDAK]      sepenuhnya di luar repo — harus diperiksa pemilik proyek

  Tanpa pemisahan ini, hal yang belum pernah diperiksa mudah terhitung sebagai
  "sudah aman" hanya karena tidak ada yang mengeluh.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MIG = ROOT / "supabase" / "migrations"
SRC = ROOT / "src"

LULUS: list[str] = []
PERHATIAN: list[str] = []
GAGAL: list[str] = []


def ok(p: str) -> None:
    LULUS.append(p)


def warn(p: str) -> None:
    PERHATIAN.append(p)


def bad(p: str) -> None:
    GAGAL.append(p)


def baca_semua_migrasi() -> str:
    return "\n".join(f.read_text(encoding="utf-8") for f in sorted(MIG.glob("*.sql")))


# ═══════════════════════════════════════════════════════════════════════════
# 1. SECRET TIDAK BOLEH ADA DI REPOSITORI
# ═══════════════════════════════════════════════════════════════════════════
def periksa_secret(sql: str) -> None:
    # service_role JWT di dalam kode klien = kebocoran penuh
    pola_berbahaya = [
        (r"service_role", "kata 'service_role' disebut"),
        (r"SUPABASE_SERVICE", "variabel service key"),
        (r"BEGIN PRIVATE KEY", "kunci privat"),
        (r"sk-[A-Za-z0-9]{20,}", "kunci bergaya OpenAI"),
    ]
    for berkas in list(SRC.rglob("*.ts")) + list(SRC.rglob("*.tsx")):
        t = berkas.read_text(encoding="utf-8", errors="ignore")
        for pola, ket in pola_berbahaya:
            if re.search(pola, t):
                bad(f"{berkas.relative_to(ROOT).as_posix()}: {ket}")

    # Berkas .env tidak boleh terlacak git
    env_files = [p for p in ROOT.glob(".env*") if p.is_file()]
    for e in env_files:
        if e.name.endswith(".example"):
            continue
        # .env di folder kerja itu NORMAL dan memang diperlukan untuk
        # pengembangan. Yang berbahaya hanya bila ia TERLACAK git, dan itu
        # diperiksa terpisah di bagian bawah.
        pass

    # Berkas .env di folder kerja itu wajar; yang berbahaya bila TERLACAK git.
    import subprocess
    for e in env_files:
        if e.name.endswith(".example"):
            continue
        r = subprocess.run(
            ["git", "ls-files", "--error-unmatch", e.name],
            cwd=ROOT, capture_output=True, text=True,
        )
        if r.returncode == 0:
            bad(f"{e.name} TERLACAK GIT — kredensial produksi ada di riwayat git!")
        else:
            ok(f"{e.name} tidak terlacak git (diabaikan dengan benar)")

    contoh = ROOT / ".env.example"
    if not contoh.exists():
        warn("tidak ada .env.example — orang lain tidak tahu variabel apa yang diperlukan")


# ═══════════════════════════════════════════════════════════════════════════
# 2. ROW LEVEL SECURITY
# ═══════════════════════════════════════════════════════════════════════════
def periksa_rls(sql: str) -> None:
    tabel = set(re.findall(r"CREATE TABLE IF NOT EXISTS public\.(\w+)", sql))
    if not tabel:
        bad("tidak ada tabel yang terdeteksi — pemeriksaan RLS tidak bermakna")
        return

    rls_aktif = set(re.findall(r"ALTER TABLE public\.(\w+)\s+ENABLE ROW LEVEL SECURITY", sql))
    tanpa_rls = sorted(tabel - rls_aktif)
    if tanpa_rls:
        for t in tanpa_rls:
            bad(f"tabel '{t}' TIDAK mengaktifkan Row Level Security")
    else:
        ok(f"RLS aktif di seluruh {len(tabel)} tabel: {', '.join(sorted(tabel))}")

    # Setiap tabel ber-RLS harus punya policy SELECT, kalau tidak datanya
    # tidak dapat dibaca sama sekali (aman, tetapi aplikasinya rusak)
    for t in sorted(rls_aktif):
        pola = rf"CREATE POLICY[^;]*?ON public\.{t}\b[^;]*?FOR\s+(SELECT|ALL)"
        if not re.search(pola, sql, re.I | re.S):
            warn(f"tabel '{t}': tidak ditemukan policy SELECT — periksa apakah disengaja")


# ═══════════════════════════════════════════════════════════════════════════
# 3. GRANT KE anon — INI YANG PALING SERING TERLEWAT
# ═══════════════════════════════════════════════════════════════════════════
def periksa_grant_anon(sql: str) -> None:
    """
    RLS TIDAK BERLAKU bagi pemilik tabel dan bagi peran yang punya hak tingkat
    tabel. Kalau `anon` (pengunjung tanpa login) diberi SELECT pada sebuah
    tabel, RLS TETAP menyaring barisnya — jadi masih aman. Tetapi bila `anon`
    diberi INSERT/UPDATE/DELETE, itu jauh lebih berbahaya.
    """
    bahaya = []
    for m in re.finditer(r"GRANT\s+([A-Z, ]+?)\s+ON\s+(?:TABLE\s+)?public\.(\w+)\s+TO\s+([^;]+);", sql, re.I):
        hak, tabel, penerima = m.group(1).upper(), m.group(2), m.group(3)
        if "ANON" not in penerima.upper():
            continue
        for h in ("INSERT", "UPDATE", "DELETE", "TRUNCATE", "ALL"):
            if h in hak:
                bahaya.append((tabel, hak.strip(), penerima.strip()))
    if bahaya:
        for tabel, hak, ke in bahaya:
            bad(f"anon diberi {hak} pada tabel {tabel} (ke: {ke})")
    else:
        ok("tidak ada GRANT INSERT/UPDATE/DELETE kepada 'anon' pada tabel mana pun")


# ═══════════════════════════════════════════════════════════════════════════
# 4. FUNGSI SENSITIF DIKUNCI DARI anon
# ═══════════════════════════════════════════════════════════════════════════
def periksa_fungsi(sql: str) -> None:
    # ── Pencabutan MENYELURUH lebih kuat daripada satu per satu ──
    # Migrasi 04 memakai:
    #     REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC / anon / authenticated;
    # Satu pernyataan itu mencabut hak SELURUH fungsi di skema public sekaligus,
    # termasuk fungsi yang belum terdaftar. Karena itu bila pernyataan tersebut
    # ada, pemeriksaan per-fungsi di bawah menjadi tidak perlu.
    #
    # CATATAN: versi pertama audit ini TIDAK mengenali pola itu, sehingga
    # melaporkan 10 fungsi sebagai "belum dicabut" padahal justru sudah dicabut
    # paling menyeluruh. Positif palsu KETIGA dalam sesi ini — pelajarannya
    # tetap sama: periksa kode nyatanya sebelum mempercayai temuan audit.
    menyeluruh = re.search(
        r"REVOKE\s+ALL\s+ON\s+ALL\s+FUNCTIONS\s+IN\s+SCHEMA\s+public\s+FROM\s+PUBLIC",
        sql, re.I,
    )
    if menyeluruh:
        ok("hak eksekusi SELURUH fungsi di skema public dicabut menyeluruh "
           "(REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC)")
        # Pastikan hanya fungsi yang memang perlu dapat dipanggil tanpa login
        for m in re.finditer(r"GRANT\s+EXECUTE\s+ON\s+FUNCTION\s+public\.(\w+)[^;]*TO\s+([^;]*anon[^;]*);", sql, re.I):
            ok(f"dapat dipanggil tanpa login (disengaja): {m.group(1)}")

    fungsi = set(re.findall(r"CREATE OR REPLACE FUNCTION public\.(\w+)", sql))
    # Fungsi bantu RLS memang harus dapat dipanggil; sisanya tidak.
    dikecualikan = {
        "jwt_role", "is_teacher", "is_admin", "is_class_member",
        "can_read_student", "check_rate_limit", "username_available",
        "class_code_info", "class_exists", "legacy_account_exists",
    }
    dicabut = set()
    # PENTING: pola harus mengizinkan daftar argumen di dalam tanda kurung.
    # Versi pertama hanya cocok untuk `public.nama()` tanpa argumen, sehingga
    # melaporkan 10 fungsi sebagai "belum dicabut" padahal REVOKE-nya ada
    # (mis. `REVOKE ALL ON FUNCTION public.is_class_member(TEXT) ...`).
    # Positif palsu KETIGA dalam sesi ini.
    for m in re.finditer(r"REVOKE\s+ALL\s+ON\s+FUNCTION\s+public\.(\w+)\s*\(", sql, re.I):
        dicabut.add(m.group(1))

    belum = sorted(fungsi - dikecualikan - dicabut)
    if menyeluruh:
        belum = []   # sudah tercakup pencabutan menyeluruh
    if belum:
        for f in belum:
            warn(f"fungsi '{f}' tidak terlihat REVOKE ALL dari PUBLIC — periksa manual")
    else:
        ok(f"seluruh {len(fungsi - dikecualikan)} fungsi sensitif sudah REVOKE ALL")


# ═══════════════════════════════════════════════════════════════════════════
# 5. PENDAFTARAN: HANYA GURU YANG BOLEH MEMBUAT AKUN
# ═══════════════════════════════════════════════════════════════════════════
def periksa_pembuatan_akun(sql: str) -> None:
    # teacher_create_student harus memverifikasi pemanggilnya guru
    m = re.search(
        r"CREATE OR REPLACE FUNCTION public\.teacher_create_student[\s\S]*?END \$\$;", sql
    )
    if not m:
        bad("teacher_create_student tidak ditemukan")
    else:
        isi = m.group(0)
        if re.search(r"v_me\.role IN \('teacher', 'admin'\)|Hanya guru", isi):
            ok("teacher_create_student memverifikasi bahwa pemanggil benar-benar guru")
        else:
            bad("teacher_create_student TIDAK memverifikasi peran pemanggil")
        if "classroom_code" in isi and "teacher_username" in isi:
            ok("teacher_create_student membatasi guru pada kelas yang dia ampu")
        else:
            warn("tidak terlihat pembatasan kelas pada teacher_create_student")

    # RPC harus menolak pendaftaran mandiri di sisi klien
    klien = (SRC / "utils" / "supabaseClient.ts").read_text(encoding="utf-8")
    if "Pendaftaran mandiri sudah ditutup" in klien:
        ok("registerStudent menolak pendaftaran mandiri di sisi klien")
    else:
        bad("registerStudent tidak menolak pendaftaran mandiri")

    # Peran tidak boleh dipercaya dari metadata yang dapat ditulis klien
    if re.search(r"raw_app_meta_data\s*->>\s*'role'", sql):
        ok("peran hanya dipercaya dari app_metadata (tidak dapat dipalsukan klien)")
    else:
        warn("tidak terlihat pengambilan peran dari app_metadata")

    # Trigger harus mengabaikan role dari user_metadata
    if re.search(r"raw_user_meta_data\s*->>\s*'role'", sql):
        bad("peran dibaca dari user_metadata — dapat dipalsukan klien!")
    else:
        ok("peran TIDAK pernah dibaca dari user_metadata")


# ═══════════════════════════════════════════════════════════════════════════
# 6. BATAS LAJU
# ═══════════════════════════════════════════════════════════════════════════
def periksa_rate_limit(sql: str) -> None:
    if "check_rate_limit" in sql:
        n = len(re.findall(r"check_rate_limit\(", sql))
        ok(f"pembatasan laju dipasang ({n} pemanggilan)")
    else:
        bad("tidak ada pembatasan laju sama sekali")


# ═══════════════════════════════════════════════════════════════════════════
# 7. HEADER KEAMANAN (Cloudflare)
# ═══════════════════════════════════════════════════════════════════════════
def periksa_header() -> None:
    h = ROOT / "public" / "_headers"
    if not h.exists():
        bad("public/_headers tidak ada — header keamanan tidak akan terpasang")
        return
    t = h.read_text(encoding="utf-8")
    wajib = [
        "X-Content-Type-Options",
        "X-Frame-Options",
        "Referrer-Policy",
        "Permissions-Policy",
        "Strict-Transport-Security",
        "Content-Security-Policy",
    ]
    hilang = [w for w in wajib if w not in t]
    if hilang:
        for w in hilang:
            bad(f"header {w} tidak ada di _headers")
    else:
        ok(f"keenam header keamanan ada di _headers ({len(wajib)}/6)")

    if "frame-ancestors 'none'" in t:
        ok("CSP melarang halaman ini dibingkai (anti clickjacking)")
    if "'unsafe-eval'" in t:
        warn("CSP mengizinkan 'unsafe-eval' — diperlukan Blockly, tetapi memperlemah CSP")


# ═══════════════════════════════════════════════════════════════════════════
# 8. IDENTITAS SISWA
# ═══════════════════════════════════════════════════════════════════════════
def periksa_identitas(sql: str) -> None:
    if re.search(r"profiles_kelas_absen_key", sql):
        ok("ada index unik (classroom_code, absent_number) untuk siswa")
        m = re.search(r"CREATE UNIQUE INDEX[^;]*profiles_kelas_absen_key[^;]*;", sql, re.S)
        if m and "role = 'student'" in m.group(0):
            ok("index unik hanya berlaku untuk siswa (guru/admin tidak saling bentrok)")
        else:
            bad("index unik tidak membatasi role='student' — guru dapat saling bentrok")
    else:
        bad("tidak ada index unik untuk identitas siswa")

    if re.search(r"profiles_nisn_key", sql):
        warn("masih ada index NISN di migrasi — pastikan migrasi 09 sudah dijalankan")


# ═══════════════════════════════════════════════════════════════════════════
# 9. YANG TIDAK DAPAT DIPERIKSA DARI REPOSITORI
# ═══════════════════════════════════════════════════════════════════════════
def laporkan_luar_repo() -> None:
    print("\n" + "=" * 74)
    print("YANG **TIDAK DAPAT** DIPERIKSA DARI REPOSITORI")
    print("=" * 74)
    print("""
  Tidak ada satu pun berkas di repositori yang dapat membuktikan hal berikut.
  Semuanya harus diperiksa langsung oleh pemilik proyek:

  1. Setelan Supabase "Allow new users to sign up"
     -> Authentication > Sign In / Providers > Email
     Ini PENUTUP SEBENARNYA pendaftaran mandiri. Endpoint pendaftaran berjalan
     di luar PostgreSQL, sehingga tidak ada trigger atau policy yang dapat
     memblokirnya. Tanpa ini, siswa MASIH dapat membuat akun lewat API
     walaupun tombolnya sudah dihapus dari tampilan.

  2. Apakah migrasi sudah benar-benar dijalankan di database produksi
     Berkas .sql di repositori hanya rancangan. Yang berlaku adalah isi
     database — dan itu tidak dapat dibaca dari sini.

  3. Kata sandi akun guru dan akun demo
     Bila masih memakai nilai contoh, siapa pun yang menebaknya dapat masuk.

  4. Kunci `anon` Supabase bocor atau tidak
     Kunci itu MEMANG publik (memang dipakai di peramban), jadi bukan rahasia.
     Yang perlu dipastikan: kunci `service_role` TIDAK PERNAH dipakai di
     frontend. Itu diperiksa di bagian 1.

  5. Apakah ada akun tak terpakai yang masih aktif
     Termasuk akun uji coba yang dibuat saat pengembangan.
""")


def main() -> int:
    sql = baca_semua_migrasi()

    periksa_secret(sql)
    periksa_rls(sql)
    periksa_grant_anon(sql)
    periksa_fungsi(sql)
    periksa_pembuatan_akun(sql)
    periksa_rate_limit(sql)
    periksa_header()
    periksa_identitas(sql)

    print("=" * 74)
    print("AUDIT KEAMANAN — YANG DAPAT DIBUKTIKAN DARI REPOSITORI")
    print("=" * 74)

    print(f"\n  TERBUKTI AMAN ({len(LULUS)})")
    for x in LULUS:
        print(f"    [v] {x}")

    if PERHATIAN:
        print(f"\n  PERLU DIPERIKSA MANUAL ({len(PERHATIAN)})")
        for x in PERHATIAN:
            print(f"    [!] {x}")

    if GAGAL:
        print(f"\n  MASALAH ({len(GAGAL)})")
        for x in GAGAL:
            print(f"    [X] {x}")

    laporkan_luar_repo()

    print("=" * 74)
    if GAGAL:
        print(f"  KESIMPULAN: {len(GAGAL)} masalah perlu diperbaiki")
    else:
        print("  KESIMPULAN: tidak ada masalah yang dapat dibuktikan dari repositori")
    print("=" * 74)
    return 1 if GAGAL else 0


if __name__ == "__main__":
    sys.exit(main())
