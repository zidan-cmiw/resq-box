#!/usr/bin/env python3
"""
Tambahkan `aria-label` pada tombol yang isinya HANYA ikon.

MASALAH
  14 tombol di aplikasi hanya berisi ikon (Material Symbols atau PixelIcon)
  tanpa keterangan. Pembaca layar akan mengumumkan "tombol" saja — siswa
  pengguna pembaca layar tidak tahu tombol itu untuk apa.

PENDEKATAN
  Skrip ini TIDAK menulis ulang elemen. Ia hanya MENYISIPKAN atribut
  `aria-label="..."` tepat setelah `<button`, dengan memilih label berdasarkan
  nama handler onClick dan nama ikon. Karena hanya menyisipkan, struktur JSX
  tidak mungkin rusak — berbeda dengan transformasi berbasis template literal
  yang pernah merusak berkas.

Pakai:
    python scripts/add_aria_labels.py --dry-run
    python scripts/add_aria_labels.py
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

# Handler → label Bahasa Indonesia yang jelas bagi pengguna pembaca layar.
HANDLER_LABELS: list[tuple[str, str]] = [
    ("handleSoundToggle", "Nyalakan atau matikan suara"),
    ("handleToggleSound", "Nyalakan atau matikan suara"),
    ("handleFullscreenToggle", "Masuk atau keluar dari layar penuh"),
    ("handleToggleFullscreen", "Masuk atau keluar dari layar penuh"),
    ("handleDiveClick", "Menyelam lebih dalam"),
    ("handleAscendClick", "Naik ke permukaan"),
    ("handleToggle", "Tampilkan atau sembunyikan penjelasan"),
    ("handleSimulate", "Jalankan simulasi lempeng tektonik"),
    ("handleTestPlan", "Uji rencana mitigasi"),
    ("handleNext", "Lanjut ke langkah berikutnya"),
    ("clearLogs", "Bersihkan catatan konsol"),
]

BUTTON_OPEN_RE = re.compile(r"<button\b")


def label_for(tag: str, inner: str) -> str | None:
    for handler, label in HANDLER_LABELS:
        if handler in tag:
            return label
    return None


def find_buttons(src: str):
    """Hasilkan (start, end_tag, inner_start, inner_end) untuk setiap <button>."""
    for m in BUTTON_OPEN_RE.finditer(src):
        start = m.start()
        # akhir tag pembuka
        k = m.end()
        depth = 0
        while k < len(src):
            ch = src[k]
            if ch == "{":
                depth += 1
            elif ch == "}":
                depth -= 1
            elif ch == ">" and depth == 0:
                break
            k += 1
        tag_end = k
        # akhir elemen </button>
        close = src.find("</button>", tag_end)
        if close < 0:
            continue
        yield start, tag_end, tag_end + 1, close


def transform(src: str) -> tuple[str, int]:
    inserts: list[tuple[int, str]] = []
    count = 0

    for start, tag_end, inner_start, inner_end in find_buttons(src):
        tag = src[start: tag_end + 1]
        inner = src[inner_start:inner_end]

        if "aria-label" in tag or "aria-labelledby" in tag:
            continue

        # Hanya tombol yang isinya ikon saja.
        text_only = re.sub(r"<[^>]+>", "", inner)
        text_only = re.sub(r"\{[^{}]*\}", "", text_only).strip()
        if text_only:
            continue
        if not (re.search(r"material-symbols|<PixelIcon", inner) or inner.strip() == ""):
            continue

        label = label_for(tag, inner)
        if label is None:
            continue

        # Sisipkan tepat setelah `<button`, pertahankan format asli.
        insert_at = start + len("<button")
        inserts.append((insert_at, f' aria-label="{label}"'))
        count += 1

    # Sisipkan dari belakang agar indeks tetap valid.
    for at, text in sorted(inserts, reverse=True):
        src = src[:at] + text + src[at:]
    return src, count


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    files = sorted(SRC.rglob("*.tsx"))
    total = 0
    changed = 0
    preview: list[tuple[str, int, str]] = []

    for path in files:
        try:
            raw = path.read_text(encoding="utf-8")
        except (UnicodeDecodeError, OSError):
            continue
        new, n = transform(raw)
        if n == 0 or new == raw:
            continue
        total += n
        changed += 1
        if args.dry_run:
            for m in re.finditer(r'aria-label="([^"]+)"', new):
                # hanya tampilkan yang baru
                if m.group(1) in {lab for _, lab in HANDLER_LABELS}:
                    preview.append((path.relative_to(ROOT).as_posix(),
                                    new.count("\n", 0, m.start()) + 1, m.group(1)))
        else:
            path.write_text(new, encoding="utf-8")

    mode = "DRY RUN — tidak ada berkas diubah" if args.dry_run else "DITERAPKAN"
    print(mode)
    print(f"  berkas terpengaruh : {changed}")
    print(f"  aria-label ditambah: {total}")
    if args.dry_run:
        print("\nLabel yang akan ditambahkan:")
        seen = set()
        for f, ln, lab in preview:
            if (f, lab) in seen:
                continue
            seen.add((f, lab))
            print(f"  {f}:{ln}  ->  {lab}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
