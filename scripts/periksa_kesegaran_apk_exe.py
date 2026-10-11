#!/usr/bin/env python
"""
Buktikan isi APK dan .exe SAMA PERSIS dengan hasil bangun web terbaru.

═══════════════════════════════════════════════════════════════════════════
MENGAPA PEMERIKSAAN INI ADA
═══════════════════════════════════════════════════════════════════════════

  Setiap kali kode web berubah, APK dan .exe menjadi USANG — karena keduanya
  membungkus hasil bangun web ke dalam dirinya.

  Yang membuat ini sulit terlihat: Vite memberi HASH pada nama berkas JS
  (mis. `index-D_1l24cr.js`). Begitu isinya berubah, NAMANYA ikut berubah.
  APK lama tetap menunjuk berkas dengan nama lama, sehingga:

      - berkas baru TIDAK ADA di dalam APK
      - berkas lama masih ada di dalam APK, padahal sudah tidak dipakai

  Jadi "sudah dibangun ulang" TIDAK CUKUP dipercaya dari ingatan. Harus
  diperiksa dari isi berkasnya.

═══════════════════════════════════════════════════════════════════════════
YANG DIPERIKSA
═══════════════════════════════════════════════════════════════════════════

  Untuk SETIAP berkas di `dist/`, dicari padanannya:

    - di dalam APK    : `assets/public/<jalur relatif>`
    - di dalam .exe   : lewat metadata asar (hash SHA256 tersimpan di sana)

  Berkas yang dibandingkan byte demi byte. Yang DIMAAFKAN:

    - `terrain-688.stl.gz` di APK, karena sengaja dikecualikan oleh pagar
      Gradle `androidResources.ignoreAssetsPattern = '!*.gz'`

═══════════════════════════════════════════════════════════════════════════
CARA MENJALANKAN
═══════════════════════════════════════════════════════════════════════════
  python scripts/periksa_kesegaran_apk_exe.py
"""
from __future__ import annotations

import hashlib
import json
import struct
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"
APK = ROOT / "android" / "app" / "build" / "outputs" / "apk" / "debug" / "app-debug.apk"
ASAR = Path(r"C:\resqbox-desktop\release\win-unpacked\resources\app.asar")

# Berkas yang memang SENGAJA tidak ada di APK.
DIMAAFKAN_APK = {"terrain-688.stl.gz"}


def berkas_dist() -> list[tuple[str, bytes]]:
    hasil = []
    for f in sorted(DIST.rglob("*")):
        if f.is_file():
            hasil.append((f.relative_to(DIST).as_posix(), f.read_bytes()))
    return hasil


def hash_asar() -> dict[str, str]:
    """Baca metadata asar: {jalur relatif di dist: hash SHA256}."""
    data = ASAR.read_bytes()
    _, _, _, ukuran_json = struct.unpack("<IIII", data[:16])
    header = json.loads(data[16:16 + ukuran_json].decode("utf-8"))

    def turun(node, awalan=()):
        hasil = {}
        for nama, isi in node.get("files", {}).items():
            if "files" in isi:
                hasil.update(turun(isi, awalan + (nama,)))
            else:
                integ = (isi.get("integrity") or {}).get("hash")
                if integ:
                    hasil["/".join(awalan + (nama,))] = integ
        return hasil

    return turun(header["files"]["dist"])


def periksa_apk(daftar) -> tuple[int, list[str]]:
    if not APK.exists():
        return -1, ["APK tidak ditemukan"]
    masalah = []
    sama = 0
    with zipfile.ZipFile(APK) as z:
        nama = set(z.namelist())
        for rel, isi in daftar:
            if rel in DIMAAFKAN_APK:
                continue
            kunci = "assets/public/" + rel
            if kunci not in nama:
                masalah.append(f"TIDAK ADA: {rel}")
            elif z.read(kunci) != isi:
                masalah.append(f"BERBEDA : {rel}")
            else:
                sama += 1
    return sama, masalah


def periksa_exe(daftar) -> tuple[int, list[str]]:
    if not ASAR.exists():
        return -1, ["app.asar tidak ditemukan"]
    hash_asar_peta = hash_asar()
    masalah = []
    sama = 0
    for rel, isi in daftar:
        h = hashlib.sha256(isi).hexdigest()
        if rel not in hash_asar_peta:
            masalah.append(f"TIDAK ADA: {rel}")
        elif hash_asar_peta[rel] != h:
            masalah.append(f"BERBEDA : {rel}")
        else:
            sama += 1
    return sama, masalah


def main() -> int:
    if not DIST.exists():
        print("  [X] Folder dist tidak ada. Jalankan `npm run build` lebih dahulu.")
        return 1

    daftar = berkas_dist()
    print("=" * 78)
    print("  KESEGARAN APK & EXE TERHADAP HASIL BANGUN WEB")
    print("=" * 78)
    print(f"\n  berkas di dist : {len(daftar)}")

    gagal = 0
    for label, jalur, periksa in (
        ("APK", APK, periksa_apk),
        ("EXE", ASAR, periksa_exe),
    ):
        if not jalur.exists():
            print(f"\n  {label}: [X] berkas tidak ditemukan di {jalur}")
            gagal += 1
            continue

        ukuran = jalur.stat().st_size / 1024 / 1024
        sama, masalah = periksa(daftar)

        print(f"\n  ── {label} ({ukuran:.2f} MB) ──")
        print(f"      sama persis : {sama}")
        print(f"      bermasalah  : {len(masalah)}")
        for m in masalah[:12]:
            print(f"          {m}")
        if len(masalah) > 12:
            print(f"          … dan {len(masalah) - 12} lagi")

        if masalah:
            gagal += 1
            print(f"      [X] {label} USANG — perlu dibangun ulang")
        else:
            print(f"      [v] {label} memuat hasil bangun web TERBARU")

    print("\n" + "=" * 78)
    if gagal:
        print(f"  HASIL: {gagal} berkas perlu dibangun ulang")
        print("=" * 78)
        return 1
    print("  HASIL: APK dan EXE keduanya TERBARU")
    print("=" * 78)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
