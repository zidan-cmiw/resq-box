#!/usr/bin/env python
"""
Unggah berkas APK dan .exe ke GitHub Release.

═══════════════════════════════════════════════════════════════════════════
MENGAPA SKRIP INI ADA
═══════════════════════════════════════════════════════════════════════════

  Tombol unduh di halaman masuk website menunjuk ke:

      https://github.com/zidan-cmiw/resq-box/releases/latest/download/<nama>

  Berkasnya berada di GitHub Release, bukan di dalam repo. Setiap kali
  aplikasi dibangun ulang, berkas lama di rilis HARUS DIGANTI — kalau tidak,
  tombol unduh akan terus memberikan versi lama tanpa ada yang menyadarinya.

  GitHub TIDAK mengizinkan menimpa berkas yang sudah ada. Berkas lama harus
  dihapus lebih dahulu, baru diunggah yang baru. Skrip ini melakukan urutan
  itu, dan MEMERIKSA hasilnya — karena unggahan 115 MB dapat gagal di tengah
  tanpa terlihat.

═══════════════════════════════════════════════════════════════════════════
CARA MENJALANKAN
═══════════════════════════════════════════════════════════════════════════

  python scripts/unggah_rilis.py <tag> <token>

  Contoh:
    python scripts/unggah_rilis.py v1.0.0 gho_xxxxx

  BERKAS YANG DIUNGGAH (jalur tetap, sesuai nama yang diharapkan website):
    RESQ-BOX-Android.apk  <- android/app/build/outputs/apk/debug/app-debug.apk
    RESQ-BOX-Laptop.exe   <- C:\\resqbox-desktop\\release\\RESQ-BOX-0.0.0-portable.exe
"""
from __future__ import annotations

import json
import mimetypes
import sys
import urllib.error
import urllib.request
from pathlib import Path

REPO = "zidan-cmiw/resq-box"
API = f"https://api.github.com/repos/{REPO}"

# Nama berkas di rilis HARUS sama dengan yang diharapkan oleh website,
# karena tautan unduhnya memakai `releases/latest/download/<nama>`.
BERKAS = [
    ("RESQ-BOX-Android.apk",
     Path("android/app/build/outputs/apk/debug/app-debug.apk")),
    ("RESQ-BOX-Laptop.exe",
     Path(r"C:\resqbox-desktop\release\RESQ-BOX-0.0.0-portable.exe")),
]


def minta(url: str, token: str, metode: str = "GET",
          data: bytes | None = None, tipe: str | None = None):
    """Kirim permintaan ke GitHub API dan kembalikan hasil JSON."""
    req = urllib.request.Request(url, method=metode, data=data)
    req.add_header("Authorization", f"Bearer {token}")
    req.add_header("Accept", "application/vnd.github+json")
    req.add_header("X-GitHub-Api-Version", "2022-11-28")
    req.add_header("User-Agent", "resq-box-uploader")
    if tipe:
        req.add_header("Content-Type", tipe)
    if data is not None:
        req.add_header("Content-Length", str(len(data)))
    with urllib.request.urlopen(req, timeout=600) as r:
        isi = r.read()
        return json.loads(isi) if isi else {}


def main() -> int:
    if len(sys.argv) < 3:
        print(__doc__)
        return 2

    tag, token = sys.argv[1], sys.argv[2]

    # ── 1. Cari rilis berdasarkan tag ─────────────────────────────────────
    print("=" * 78)
    print(f"  MENGUNGGAH KE RILIS {tag}")
    print("=" * 78)
    rilis = minta(f"{API}/releases/tags/{tag}", token)
    rilis_id = rilis["id"]
    print(f"\n  rilis   : {rilis['tag_name']}  (draft={rilis['draft']}, "
          f"prerelease={rilis['prerelease']})")

    if rilis["prerelease"]:
        print("\n  [X] RILIS INI DITANDAI PRE-RELEASE.")
        print("      GitHub MELEWATI rilis pra-rilis saat mencari yang terbaru,")
        print("      sehingga tombol unduh akan menunjuk ke rilis yang SALAH.")
        print("      Hapus tanda pre-release lebih dahulu.")
        return 1

    aset_lama = {a["name"]: a["id"] for a in rilis.get("assets", [])}
    print(f"  aset lama: {len(aset_lama)}")
    for n, i in aset_lama.items():
        print(f"      {n}")

    # ── 2. Periksa berkas lokal SEBELUM menghapus apa pun ─────────────────
    #
    #  Urutan ini penting: berkas lama TIDAK boleh dihapus bila berkas baru
    #  belum terbukti ada. Kalau tidak, kegagalan di tengah akan membuat
    #  rilis kehilangan berkasnya, dan tombol unduh mati total.
    print("\n  ── Memeriksa berkas lokal ──")
    siap: list[tuple[str, Path]] = []
    for nama, jalur in BERKAS:
        if not jalur.exists():
            print(f"      [X] TIDAK ADA: {jalur}")
            print("          Bangun ulang aplikasinya lebih dahulu.")
            return 1
        mb = jalur.stat().st_size / 1024 / 1024
        print(f"      [v] {nama}  <-  {jalur.name}  ({mb:.2f} MB)")
        siap.append((nama, jalur))

    # ── 3. Hapus aset lama, lalu unggah yang baru ─────────────────────────
    for nama, jalur in siap:
        print(f"\n  ── {nama} ──")

        if nama in aset_lama:
            minta(f"{API}/releases/assets/{aset_lama[nama]}", token, "DELETE")
            print("      [v] aset lama dihapus")
        else:
            print("      (belum ada aset lama)")

        isi = jalur.read_bytes()
        tipe = mimetypes.guess_type(nama)[0] or "application/octet-stream"

        # GitHub meminta unggahan aset lewat host uploads.github.com
        url_unggah = (f"https://uploads.github.com/repos/{REPO}"
                      f"/releases/{rilis_id}/assets?name={nama}")
        print(f"      mengunggah {len(isi)/1024/1024:.2f} MB ...")
        hasil = minta(url_unggah, token, "POST", isi, tipe)
        ukuran = hasil.get("size", 0) / 1024 / 1024
        print(f"      [v] terunggah: {hasil.get('name')}  ({ukuran:.2f} MB)")
        print(f"          unduh: {hasil.get('browser_download_url')}")

    # ── 4. Periksa ULANG dari server ──────────────────────────────────────
    #
    #  Unggahan 115 MB dapat tampak berhasil padahal tidak. Karena itu hasil
    #  akhirnya dibaca kembali dari GitHub, bukan dipercaya dari jawaban
    #  unggahannya.
    print("\n  ── Memeriksa ulang dari server ──")
    akhir = minta(f"{API}/releases/{rilis_id}", token)
    ada = {a["name"]: a["size"] for a in akhir.get("assets", [])}
    gagal = 0
    for nama, jalur in siap:
        ukuran_server = ada.get(nama)
        ukuran_lokal = jalur.stat().st_size
        cocok = ukuran_server == ukuran_lokal
        if not cocok:
            gagal += 1
        print(f"      {'[v]' if cocok else '[X]'} {nama}")
        print(f"          lokal  : {ukuran_lokal} B")
        print(f"          di server: {ukuran_server} B")

    print("\n" + "=" * 78)
    if gagal:
        print(f"  HASIL: {gagal} berkas TIDAK cocok ukurannya")
        return 1
    print("  HASIL: seluruh berkas terunggah dan ukurannya COCOK")
    print("=" * 78)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
