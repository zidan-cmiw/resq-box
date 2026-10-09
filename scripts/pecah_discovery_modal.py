#!/usr/bin/env python
"""
Pecah src/app/Level2/DiscoveryModal.tsx (7.046 baris) menjadi modul terpisah.

MENGAPA BERKAS INI PERLU DIPECAH
  Isinya dua hal yang sangat berbeda sifatnya:

    1. Komponen DiscoveryModal (~460 baris) yang mengelola state, tab, dan
       interaksi.
    2. Dua puluh komponen ILUSTRASI SVG/animasi (lebih dari 6.000 baris) yang
       mandiri — tidak satu pun menyentuh state DiscoveryModal.

  Mencampur keduanya membuat berkas sulit dinavigasi: mencari logika tab
  berarti menggulir melewati ribuan baris gambar.

CARA PEMECAHAN
  Memindahkan BLOK UTUH secara mekanis, bukan menulis ulang. Setiap fungsi
  disalin apa adanya dari baris awalnya sampai baris sebelum deklarasi
  berikutnya, sehingga isi kodenya identik dan tidak ada risiko salah ketik.

  Pengelompokan mengikuti tema materi:
    ilustrasi/lempeng.tsx    — Pangea, batas lempeng, sesar, bentuk lahan
    ilustrasi/gempa.tsx      — tindakan sebelum/saat/sesudah gempa
    ilustrasi/gunung-api.tsx — status gunung api dan penanganan erupsi

DUA HAL YANG SEMPAT SALAH, DAN KENAPA
  1. Berkas berisi JSX harus berekstensi .tsx, bukan .ts. Dengan .ts,
     TypeScript membaca `<div>` sebagai operator perbandingan dan menghasilkan
     ribuan error.

  2. Impor harus ditulis per berkas sesuai kebutuhannya. Fungsi ilustrasi
     ternyata memakai `useState` (21 kali), `useEffect`, `retroAudio`, dan
     `PixelIcon`. Menyalin blok tanpa menyertakan impornya menghasilkan
     "Cannot find name 'useState'".

KOMPATIBILITAS
  Komponen dari berkas ini juga dipakai modul lain, misalnya
  Level1/EarthDive/DiscoveryModal.tsx yang mengimpor
  SeismographPlatesIllustration, TransformSanAndreasIllustration,
  ConvergentSubductionIllustration, dan TRANSFORM_POINTS_DATA. Berkas induk
  karena itu MENGIMPOR ULANG dan MENGEKSPOR ULANG komponen tersebut, sehingga
  pemakai lama tidak perlu diubah sama sekali.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BERKAS = ROOT / "src/app/Level2/DiscoveryModal.tsx"

TUJUAN = {
    "PangeaIllustration": "ilustrasi/lempeng",
    "ConvergentSubductionIllustration": "ilustrasi/lempeng",
    "CONVERGENT_LANDFORMS_DATA": "ilustrasi/lempeng",
    "ConvergentLandformsIllustration": "ilustrasi/lempeng",
    "TrenchIllustration": "ilustrasi/lempeng",
    "FoldedMountainsIllustration": "ilustrasi/lempeng",
    "VolcanoIllustration": "ilustrasi/lempeng",
    "MegathrustIllustration": "ilustrasi/lempeng",
    "SeismographPlatesIllustration": "ilustrasi/lempeng",
    "TRANSFORM_POINTS_DATA": "ilustrasi/lempeng",
    "TransformSanAndreasIllustration": "ilustrasi/lempeng",
    "EarthquakePrepIllustration": "ilustrasi/gempa",
    "EarthquakeActionIllustration": "ilustrasi/gempa",
    "EarthquakePostSafetyIllustration": "ilustrasi/gempa",
    "EarthquakePostCoordinationIllustration": "ilustrasi/gempa",
    "VolcanoStatusIllustration": "ilustrasi/gunung-api",
    "VolcanoResponseIllustration": "ilustrasi/gunung-api",
    "VolcanoPostAshIllustration": "ilustrasi/gunung-api",
    "VolcanoPostSanitationIllustration": "ilustrasi/gunung-api",
    "VolcanoPostLaharIllustration": "ilustrasi/gunung-api",
}

JUDUL = {
    "ilustrasi/lempeng": "Lempeng, Batas, dan Bentuk Lahan",
    "ilustrasi/gempa": "Rangkaian Tindakan Gempa",
    "ilustrasi/gunung-api": "Status dan Penanganan Gunung Api",
}

KEPALA = """/**
 * {judul} — ilustrasi untuk materi Discovery Level 2.
 *
 * Berkas ini dipecah dari DiscoveryModal.tsx. Semua komponen di sini mandiri:
 * tidak menyentuh state DiscoveryModal, hanya menerima props sederhana atau
 * tidak menerima props sama sekali.
 */
"""


def deklarasi(baris: list[str]) -> list[tuple[int, int, str]]:
    """Rentang tiap deklarasi tingkat atas: (baris_awal, baris_akhir, nama)."""
    titik: list[tuple[int, str]] = []
    for i, b in enumerate(baris):
        m = re.match(
            r"^(?:export\s+)?(?:default\s+)?(?:function|const|interface|type|enum)\s+([A-Za-z_$][\w$]*)",
            b,
        )
        if m:
            titik.append((i, m.group(1)))
    titik.append((len(baris), "<EOF>"))

    rentang = []
    for idx in range(len(titik) - 1):
        i, nama = titik[idx]
        j = titik[idx + 1][0]
        # Sertakan komentar tepat di atas deklarasi
        while i > 0 and baris[i - 1].strip().startswith(("/*", "*", "//")):
            i -= 1
        rentang.append((i, j, nama))
    return rentang


def impor_untuk(tubuh: str) -> list[str]:
    """Baris impor yang diperlukan oleh sekumpulan fungsi."""
    baris: list[str] = []
    hooks = [h for h in ("useState", "useEffect", "useRef", "useMemo", "useCallback")
             if re.search(rf"(?<![A-Za-z0-9_$]){h}(?![A-Za-z0-9_$])", tubuh)]
    if hooks:
        baris.append(f"import {{ {', '.join(hooks)} }} from 'react';")
    if re.search(r"\bretroAudio\b", tubuh):
        baris.append("import { retroAudio } from '../../../utils/retroAudio';")
    if re.search(r"<PixelIcon\b", tubuh):
        baris.append("import PixelIcon from '../../../components/PixelIcon';")
    # Utilitas keyboard ikut dipakai sebagian ilustrasi (mis. tombol pada
    # VolcanoStatusIllustration), jadi harus disertakan bila memang terpakai.
    kb = [k for k in ("sifatTombol", "tutupModalDenganKeyboard", "blokirRambatanTombol")
          if re.search(rf"(?<![A-Za-z0-9_$]){k}(?![A-Za-z0-9_$])", tubuh)]
    if kb:
        baris.append(f"import {{ {', '.join(kb)} }} from '../../../utils/keyboard';")
    return baris


def pastikan_ekspor(isi: list[str]) -> None:
    """Pastikan blok diekspor, tanpa menambah 'export' dua kali.

    KESALAHAN YANG PERNAH TERJADI
      Versi pertama hanya memeriksa `isi[0]`. Padahal blok sering dimulai
      dengan komentar:

          // --- SUB-KOMPONEN: TAS SIAGA 72 JAM ---
          function EarthquakePrepIllustration() {

      Karena `isi[0]` adalah komentar, pemeriksaan tidak menemukan apa pun,
      lalu `export` ditambahkan di depan KOMENTAR itu - dan fungsi di bawahnya
      tetap tidak diekspor. Akibatnya muncul 34 error "declares X locally,
      but it is not exported".

      Karena itu fungsi ini mencari baris deklarasi yang SEBENARNYA, melewati
      komentar dan baris kosong lebih dahulu.
    """
    for i, b in enumerate(isi):
        t = b.strip()
        if not t or t.startswith(("//", "/*", "*", "*/")):
            continue
        if t.startswith("export"):
            return
        if re.match(r"(function|const|let|var|type|interface|enum|class)\b", t):
            isi[i] = "export " + b.lstrip()
        return


def main() -> int:
    teks = BERKAS.read_text(encoding="utf-8")
    baris = teks.split("\n")
    rentang = deklarasi(baris)

    kelompok: dict[str, list[tuple[int, int, str]]] = {}
    for mulai, akhir, nama in rentang:
        if nama in TUJUAN:
            kelompok.setdefault(TUJUAN[nama], []).append((mulai, akhir, nama))

    dipindah: set[int] = set()
    pindah_info: dict[str, list[str]] = {}

    for tujuan, blok in kelompok.items():
        tujuan_path = ROOT / "src/app/Level2" / f"{tujuan}.tsx"
        tujuan_path.parent.mkdir(parents=True, exist_ok=True)

        potongan: list[str] = []
        for mulai, akhir, nama in sorted(blok):
            isi = baris[mulai:akhir]
            while isi and not isi[-1].strip():
                isi.pop()
            while isi and not isi[0].strip():
                isi.pop(0)
            pastikan_ekspor(isi)
            potongan.append("\n".join(isi))
            dipindah.update(range(mulai, akhir))

        tubuh = "\n\n".join(potongan)
        kepala = KEPALA.format(judul=JUDUL.get(tujuan, tujuan))
        impor = impor_untuk(tubuh)
        isi_berkas = kepala + "\n" + "\n".join(impor) + "\n\n" + tubuh + "\n"
        tujuan_path.write_text(isi_berkas, encoding="utf-8")
        pindah_info[tujuan] = [n for _, _, n in sorted(blok)]
        print(f"  {tujuan}.tsx  ({len(blok)} ekspor, {isi_berkas.count(chr(10))} baris, "
              f"{len(impor)} impor)")

    # ── Susun ulang berkas induk ─────────────────────────────────────────
    sisa = [b for i, b in enumerate(baris) if i not in dipindah]
    bersih: list[str] = []
    for b in sisa:
        if not b.strip() and bersih and not bersih[-1].strip():
            continue
        bersih.append(b)
    gabung = "\n".join(bersih)

    # Rapikan tiga impor utils/keyboard yang terpisah menjadi satu
    gabung = re.sub(
        r"import \{ sifatTombol \} from '\.\./\.\./utils/keyboard';\n"
        r"import \{ tutupModalDenganKeyboard \} from '\.\./\.\./utils/keyboard';\n"
        r"import \{ blokirRambatanTombol \} from '\.\./\.\./utils/keyboard';",
        "import { tutupModalDenganKeyboard, blokirRambatanTombol } "
        "from '../../utils/keyboard';",
        gabung,
    )

    # Impor ulang + ekspor ulang, agar pemakai lama tidak perlu diubah.
    #
    # Impor HANYA memuat nama yang benar-benar dipakai berkas induk, sedangkan
    # ekspor ulang memuat SEMUA nama. Bedanya penting: mengimpor nama yang tidak
    # dipakai menghasilkan error TS6133, sedangkan mengekspor ulang nama yang
    # tidak dipakai tidak apa-apa dan justru diperlukan pemakai lama.
    impor_baris, ekspor_baris = [], []
    for tujuan in sorted(kelompok):
        semua = pindah_info[tujuan]
        modul = "./" + tujuan.replace("\\", "/")
        dipakai = [n for n in semua if re.search(rf"(?<![A-Za-z0-9_$]){n}(?![A-Za-z0-9_$])", gabung)]
        if dipakai:
            impor_baris.append(f"import {{ {', '.join(dipakai)} }} from '{modul}';")
        ekspor_baris.append(f"export {{ {', '.join(semua)} }} from '{modul}';")

    anchor = "import PixelIcon from '../../components/PixelIcon';"
    blok_impor = "\n".join(impor_baris)
    if anchor in gabung:
        gabung = gabung.replace(anchor, anchor + "\n" + blok_impor, 1)
    else:
        gabung = blok_impor + "\n" + gabung

    m = list(re.finditer(r"(?m)^import .*;$", gabung))
    if m:
        pos = m[-1].end()
        gabung = (gabung[:pos]
                  + "\n\n// Ekspor ulang agar pemakai lama tetap bekerja tanpa perubahan\n"
                  + "\n".join(ekspor_baris) + gabung[pos:])

    # Buang impor yang menjadi tidak terpakai di berkas induk.
    # `sifatTombol` ikut diperiksa karena sesudah pemecahan ia mungkin tidak
    # lagi dipakai di sini.
    for nama_impor in ("PixelIcon", "retroAudio", "sifatTombol", "tutupModalDenganKeyboard"):
        pola = (rf"import (?:type )?(?:\{{[^}}]*\b{nama_impor}\b[^}}]*\}}|{nama_impor}) "
                rf"from '[^']*';\n")
        if not re.search(pola, gabung):
            continue
        tanpa_impor = re.sub(pola, "", gabung)
        if not re.search(rf"(?<![A-Za-z0-9_$]){nama_impor}(?![A-Za-z0-9_$])", tanpa_impor):
            gabung = re.sub(pola, "", gabung)

    # Rapikan daftar impor yang mungkin menyisakan koma atau kurung kosong
    gabung = re.sub(r"import \{\s*\} from '[^']*';\n", "", gabung)
    gabung = re.sub(r",\s*\}", " }", gabung)
    gabung = re.sub(r"\{\s*,", "{ ", gabung)

    BERKAS.write_text(gabung, encoding="utf-8")
    print(f"\n  DiscoveryModal.tsx: {len(baris)} -> {gabung.count(chr(10)) + 1} baris")
    print(f"  {sum(len(v) for v in pindah_info.values())} ekspor dipindahkan")
    print(f"  ekspor ulang ditambahkan: {len(ekspor_baris)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
