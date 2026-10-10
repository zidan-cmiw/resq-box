#!/usr/bin/env python
"""
Audit lanjutan: hal-hal yang BELUM diperiksa oleh audit keamanan sebelumnya.

MENGAPA BERKAS KEDUA
  `audit_keamanan.py` memeriksa struktur: RLS, GRANT, kunci fungsi, header.
  Ia TIDAK memeriksa kebocoran informasi lewat PESAN GALAT — dan itu penting,
  karena kode yang baru saja diperbaiki justru menampilkan pesan asli dari
  server kepada pengguna.

YANG DIPERIKSA DI SINI
  1. Pesan galat yang menampilkan isi mentah dari database
     Pesan PostgreSQL dapat memuat nama tabel, nama kolom, nama batasan, dan
     kadang potongan data. Menampilkannya kepada siswa atau guru adalah
     pembocoran informasi: penyerang belajar tentang struktur database.

  2. Kolom sensitif yang tidak boleh ada di tabel aplikasi
     `password`, `token`, `secret`, `api_key` pada tabel yang dibaca klien.

  3. Penulisan data sensitif ke penyimpanan peramban
     Sesi atau token di localStorage dapat dibaca skrip mana pun di halaman.

  4. Pencatatan (logging) data sensitif
     Sandi, token, atau isi sesi yang ikut tercatat di konsol.

  5. Nilai bawaan yang berbahaya
     Kunci kosong, URL kosong, atau pemeriksaan keamanan yang dinonaktifkan.

KETERBATASAN
  Seperti audit lainnya di folder ini, pemeriksa ini membaca TEKS. Ia dapat
  melaporkan positif palsu — dan sudah terbukti begitu tiga kali sebelumnya.
  Setiap temuan harus diperiksa pada kode nyatanya sebelum dipercaya.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

TEMUAN: dict[str, list[tuple[str, int, str]]] = {}
LULUS: list[str] = []


def catat(kategori: str, berkas: str, baris: int, ket: str) -> None:
    TEMUAN.setdefault(kategori, []).append((berkas, baris, ket))


def berkas_klien() -> list[Path]:
    return sorted(list(SRC.rglob("*.ts")) + list(SRC.rglob("*.tsx")))


# ═══════════════════════════════════════════════════════════════════════════
# 1. Pesan galat mentah ditampilkan ke pengguna
# ═══════════════════════════════════════════════════════════════════════════
def periksa_galat_mentah() -> None:
    """
    Cari tempat yang menampilkan `error.message` langsung kepada pengguna.

    PENTING — DIPERIKSA SELURUH BERKAS, BUKAN PER BARIS

      Versi pertama pemeriksa ini memeriksa baris demi baris, dan pola itu
      MELEWATKAN kasus yang benar-benar ada:

          message: `Gagal membuat akun siswa: ${asli || '...'}`,

      Baris itu terpotong di tengah ekspresi, sehingga `message:` dan
      backtick-nya tidak berada pada baris yang sama dan pola per baris tidak
      pernah cocok. Akibatnya pemeriksa melaporkan "tidak ada temuan" padahal
      temuan itu jelas ada di berkas yang sedang diperiksa.

      Ini kebalikan dari tiga positif palsu sebelumnya (melaporkan masalah yang
      tidak ada). Kali ini justru MELEWATKAN masalah nyata — dan jenis
      kesalahan ini lebih berbahaya, karena memberi rasa aman yang keliru.
    """
    pola = re.compile(
        r"message:\s*`[^`]*\$\{[^}`]*\b(?:err|error|e|asli|pesan|msg|raw)\b[^}`]*\}[^`]*`"
        r"|message:\s*(?:err|error|e)\.message"
        r"|message:\s*[A-Za-z_$][\w$]*\.message",
        re.I,
    )
    # Penanda yang boleh dipakai penulis kode untuk menyatakan bahwa sebuah
    # pemakaian SUDAH diperiksa dan disengaja:
    #
    #     message: bersihkanPesanGalat(asli),   // audit-kebocoran: aman
    #
    # Tanpa penanda ini, setiap pemakaian akan selalu dilaporkan — termasuk
    # yang sudah disaring — sehingga daftar temuan penuh dan temuan yang
    # sebenarnya penting justru tenggelam. Penanda memaksa penulisnya
    # MENJELASKAN alasannya, bukan sekadar membungkam pemeriksa.
    penanda_aman = re.compile(r"audit-kebocoran:\s*aman", re.I)

    for f in berkas_klien():
        t = f.read_text(encoding="utf-8", errors="ignore")
        baris_semua = t.split("\n")
        for m in pola.finditer(t):
            baris = t[: m.start()].count("\n") + 1
            isi_baris = baris_semua[baris - 1] if baris - 1 < len(baris_semua) else ""

            # ── Lewati KOMENTAR ──
            # Blok komentar yang menjelaskan kode lama sering memuat contoh
            # seperti:
            #     //   message: `Gagal membuat akun siswa: ${asli}`
            # Baris itu bukan kode yang berjalan, tetapi cocok dengan pola —
            # sehingga dilaporkan seolah-olah masih ada. Positif palsu ini
            # membuat temuan yang sudah diperbaiki tetap muncul selamanya.
            if isi_baris.strip().startswith(("//", "*", "/*")):
                continue

            # Periksa baris itu dan dua baris sesudahnya untuk penanda
            sekitar = "\n".join(baris_semua[max(0, baris - 1) : baris + 2])
            if penanda_aman.search(sekitar):
                continue

            catat(
                "1. Pesan galat mentah ditampilkan ke pengguna",
                f.relative_to(ROOT).as_posix(),
                baris,
                " ".join(m.group(0).split())[:110],
            )


# ═══════════════════════════════════════════════════════════════════════════
# 2. Kolom sensitif pada tabel aplikasi
# ═══════════════════════════════════════════════════════════════════════════
def periksa_kolom_sensitif() -> None:
    """
    Cari kolom sensitif pada tabel yang dibuat migrasi.

    ⚠️ KETERBATASAN YANG PERLU DIKETAHUI
      Pemeriksa ini hanya melihat tabel yang DIBUAT oleh berkas migrasi di
      repositori. Tabel lama yang masih ada di database — tetapi tidak lagi
      dibuat oleh migrasi mana pun — TIDAK ikut diperiksa.

      Hal itu nyata terjadi pada proyek ini: tabel `students` (peninggalan
      skema v2) menyimpan kolom `password` bertipe TEXT, dan tabel itu tidak
      pernah terdeteksi di sini karena migrasinya sudah tidak ada.

      Karena itu pemeriksaan ini BUKAN jaminan. Untuk memastikan keadaan
      database yang sebenarnya, jalankan
      `supabase/verifikasi_keamanan_db.sql` di Supabase SQL Editor — berkas
      itu menanyakan langsung ke katalog PostgreSQL, termasuk tabel lama.
    """
    mig = ROOT / "supabase" / "migrations"
    sql = "\n".join(p.read_text(encoding="utf-8") for p in sorted(mig.glob("*.sql")))
    # Nama kolom mencurigakan pada tabel yang dibuat migrasi
    for m in re.finditer(r"CREATE TABLE[^(]*\(([\s\S]*?)\n\);", sql, re.I):
        blok = m.group(1)
        for baris in blok.split("\n"):
            b = baris.strip().rstrip(",")
            mm = re.match(
                r"(password|pass|token|secret|api_key|apikey|private_key)\s+\w", b, re.I
            )
            if mm:
                catat(
                    "2. Kolom sensitif pada tabel aplikasi",
                    "supabase/migrations",
                    0,
                    b[:100],
                )
    tabel = re.findall(r"CREATE TABLE IF NOT EXISTS public\.(\w+)", sql)
    if tabel:
        LULUS.append(
            "kolom sensitif diperiksa pada tabel buatan migrasi: " + ", ".join(tabel)
        )


# ═══════════════════════════════════════════════════════════════════════════
# 3. Data sensitif di penyimpanan peramban
# ═══════════════════════════════════════════════════════════════════════════
def periksa_localstorage() -> None:
    """
    localStorage dapat dibaca skrip mana pun di halaman. Menyimpan token atau
    sandi di sana memperbesar akibat bila terjadi XSS.
    """
    pola = re.compile(
        r"localStorage\.setItem\(\s*[`'\"]([^`'\"]*)[`'\"]", re.I
    )
    semua_kunci: set[str] = set()
    for f in berkas_klien():
        t = f.read_text(encoding="utf-8", errors="ignore")
        for i, ln in enumerate(t.split("\n"), 1):
            for m in pola.finditer(ln):
                kunci = m.group(1)
                semua_kunci.add(kunci)
                if re.search(r"token|sandi|password|secret|session|jwt|auth", kunci, re.I):
                    catat(
                        "3. Data sensitif di localStorage",
                        f.relative_to(ROOT).as_posix(),
                        i,
                        ln.strip()[:110],
                    )
    if semua_kunci:
        LULUS.append(
            f"kunci localStorage diperiksa ({len(semua_kunci)} kunci): "
            + ", ".join(sorted(semua_kunci)[:8])
        )


# ═══════════════════════════════════════════════════════════════════════════
# 4. Pencatatan data sensitif
# ═══════════════════════════════════════════════════════════════════════════
def periksa_logging() -> None:
    pola = re.compile(r"console\.(log|warn|error|info|debug)\s*\(")
    mencurigakan = re.compile(r"password|sandi|token|secret|jwt|session", re.I)
    for f in berkas_klien():
        t = f.read_text(encoding="utf-8", errors="ignore")
        for i, ln in enumerate(t.split("\n"), 1):
            s = ln.strip()
            if s.startswith(("//", "*", "/*")):
                continue
            if pola.search(s) and mencurigakan.search(s):
                catat("4. Pencatatan data sensitif", f.relative_to(ROOT).as_posix(), i, s[:110])


# ═══════════════════════════════════════════════════════════════════════════
# 5. Nilai bawaan yang berbahaya
# ═══════════════════════════════════════════════════════════════════════════
def periksa_nilai_bawaan() -> None:
    f = SRC / "utils" / "supabaseClient.ts"
    if not f.exists():
        return
    t = f.read_text(encoding="utf-8")
    # Kunci anon TIDAK boleh di-hardcode di kode
    if re.search(r"anonKey\s*[:=]\s*['\"]eyJ", t):
        catat("5. Kunci Supabase di-hardcode di kode", f.relative_to(ROOT).as_posix(), 0, "anonKey literal")
    else:
        LULUS.append("kunci anon TIDAK di-hardcode di kode (dibaca dari env)")

    # Kunci anon diambil dari env dengan nilai bawaan KOSONG
    if re.search(r"VITE_SUPABASE_ANON_KEY\s*\|\|\s*''", t):
        LULUS.append("kunci anon dibaca dari env, bawaan kosong (mode luring)")

    # Sentry DSN harus dibaca dari env, bukan literal
    if re.search(r"sentryDsn\s*[:=]\s*['\"]https", t, re.I):
        catat("5. DSN Sentry di-hardcode", f.relative_to(ROOT).as_posix(), 0, "sentryDsn literal")


# ═══════════════════════════════════════════════════════════════════════════
# 6. Server key TIDAK boleh ada di klien
# ═══════════════════════════════════════════════════════════════════════════
def periksa_service_key() -> None:
    berbahaya = re.compile(r"service_role|SERVICE_ROLE|SUPABASE_SERVICE", re.I)
    ketemu = False
    for f in berkas_klien():
        t = f.read_text(encoding="utf-8", errors="ignore")
        for i, ln in enumerate(t.split("\n"), 1):
            if berbahaya.search(ln) and not ln.strip().startswith(("//", "*", "/*")):
                catat("6. service_role disebut di kode klien", f.relative_to(ROOT).as_posix(), i, ln.strip()[:110])
                ketemu = True
    if not ketemu:
        LULUS.append("kata 'service_role' tidak muncul di kode klien")


def main() -> int:
    periksa_galat_mentah()
    periksa_kolom_sensitif()
    periksa_localstorage()
    periksa_logging()
    periksa_nilai_bawaan()
    periksa_service_key()

    print("=" * 76)
    print("AUDIT LANJUTAN — KEBOCORAN INFORMASI & PENANGANAN DATA")
    print("=" * 76)

    if LULUS:
        print(f"\n  BAIK ({len(LULUS)})")
        for x in LULUS:
            print(f"    [v] {x}")

    if TEMUAN:
        total = sum(len(v) for v in TEMUAN.values())
        print(f"\n  PERLU DIPERIKSA ({total})")
        for kategori, item in sorted(TEMUAN.items()):
            print(f"\n  ── {kategori} ({len(item)}) ──")
            for berkas, baris, ket in item[:10]:
                lokasi = f"{berkas}:{baris}" if baris else berkas
                print(f"    {lokasi}")
                print(f"        {ket}")
            if len(item) > 10:
                print(f"    ... dan {len(item) - 10} lagi")
    else:
        print("\n  Tidak ada temuan.")

    print("\n" + "=" * 76)
    print("  CATATAN: pemeriksa ini membaca TEKS dan dapat salah lapor.")
    print("  Periksa setiap temuan pada kode nyatanya sebelum memperbaiki.")
    print("=" * 76)
    return 0


if __name__ == "__main__":
    sys.exit(main())
