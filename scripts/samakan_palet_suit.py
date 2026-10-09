#!/usr/bin/env python
"""
Samakan palet warna SuitMerchantModal dengan popup materi (butir 6).

MASALAH
  Masukan penguji: "popup yang butuh beli outfit untuk ke area selanjutnya dan
  popup untuk belinya itu color paletenya disamain kayak popup materi itu".

  Setelah dibandingkan, memang jauh berbeda:

    Popup materi (DiscoveryModal) : latar KREM  bg-[#fef3c7]
                                    batas COKLAT border-[#78350f] / #b45309
                                    teks  COKLAT text-[#291305] / #78350f

    Popup beli pakaian (SuitMerchantModal) :
                                    latar SLATE GELAP bg-slate-900 + gradien
                                    batas PUTIH transparan border-white/20
                                    teks  PUTIH text-white / text-slate-300

  Akibatnya popup pembelian terlihat seperti berasal dari aplikasi yang
  berbeda, padahal keduanya bagian dari alur yang sama.

YANG DIPERTAHANKAN
  Warna AKSEN tiap pakaian tidak diubah: oranye (Termal), cyan
  (Elektromagnetik), kuning (Exo-Suit), biru (Penyelam). Warna itu yang
  membedakan satu pakaian dari yang lain, dan ada di `accentColor`, `badgeBg`,
  serta `borderGlow` pada SUIT_CATALOG. Yang diseragamkan hanya LATAR, BATAS
  LUAR, dan WARNA TEKS DASAR.

  Gradien latar tiap pakaian (`bgGradient`) juga tidak diubah isinya, tetapi
  kini dipakai sebagai lapisan tipis di atas dasar krem, sehingga nuansa warna
  pakaian tetap terasa tanpa menutupi palet aplikasi.
"""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BERKAS = ROOT / "src/app/Level1/EarthDive/SuitMerchantModal.tsx"

# Pasangan (teks lama, teks baru). Diterapkan berurutan.
GANTI: list[tuple[str, str]] = [
    # ── Panel utama: latar gelap -> krem, batas putih -> coklat ──
    (
        "`relative w-full max-w-2xl bg-gradient-to-b ${suit.bgGradient} border-2 rounded-2xl p-6 sm:p-8 text-white ${suit.borderGlow} transition-all duration-300 overflow-hidden shadow-2xl`",
        "`relative w-full max-w-2xl bg-[#fef3c7] border-4 border-[#78350f] rounded-2xl p-5 sm:p-6 md:p-7 text-[#291305] ${suit.borderGlow} transition-all duration-300 overflow-hidden shadow-[0_6px_0_#451a03,0_16px_36px_rgba(0,0,0,0.65)]`",
    ),
    # Pola grid putih -> coklat tipis, agar tetap terlihat di atas krem
    (
        "'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)'",
        "'linear-gradient(rgba(120,53,15,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(120,53,15,0.12) 1px, transparent 1px)'",
    ),
    # ── Garis pemisah header ──
    (
        'className="relative flex items-start justify-between pb-4 border-b border-white/20 gap-3"',
        'className="relative flex items-start justify-between pb-3 border-b-2 border-[#b45309]/30 gap-3"',
    ),
    # Kotak ikon
    (
        'className="p-3 rounded-xl bg-slate-800/90 border border-white/25 shadow-inner"',
        'className="p-2.5 rounded-xl bg-[#fffbeb] border-2 border-[#b45309]/50 shadow-inner shrink-0"',
    ),
    # Nama kode pakaian
    (
        'className="text-[13px] sm:text-[15px] text-slate-300 font-mono tracking-tight font-semibold"',
        'className="text-[12.5px] sm:text-[13.5px] text-[#78350f] font-mono tracking-tight font-semibold"',
    ),
    # Judul pakaian
    (
        'className="text-2xl sm:text-3xl font-black tracking-wide text-white drop-shadow-md mt-1"',
        'className="font-pixel-title text-[15px] sm:text-[19px] font-black tracking-wide text-[#2e0e02] mt-1 leading-snug break-words"',
    ),
    # Tombol tutup
    (
        'className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-white/15 transition-colors text-2xl leading-none font-bold"',
        'className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-lg bg-[#b45309] hover:bg-[#92400e] text-amber-100 border-2 border-[#451a03] flex items-center justify-center transition-colors text-[15px] font-bold cursor-pointer"',
    ),
]

# Penggantian menyeluruh untuk sisa warna teks slate pada badan modal.
# Dilakukan setelah penggantian di atas, dan hanya untuk kelas teks.
GANTI_GLOBAL: list[tuple[str, str]] = [
    ("text-slate-100", "text-[#291305]"),
    ("text-slate-200", "text-[#3f1d06]"),
    ("text-slate-300", "text-[#78350f]"),
    ("text-slate-400", "text-[#92400e]"),
    ("text-white", "text-[#291305]"),
    ("hover:text-[#291305]", "hover:text-[#451a03]"),
    # Latar dalam panel
    ("bg-slate-900/80", "bg-[#fffbeb]/90"),
    ("bg-slate-900", "bg-[#fffbeb]"),
    ("bg-slate-800/90", "bg-[#fffbeb]"),
    ("bg-slate-800", "bg-[#fde68a]"),
    # Garis pemisah lain
    ("border-white/20", "border-[#b45309]/30"),
    ("border-white/25", "border-[#b45309]/40"),
    ("border-white/15", "border-[#b45309]/25"),
    ("border-white/10", "border-[#b45309]/20"),
    ("hover:bg-white/15", "hover:bg-[#b45309]/15"),
    ("hover:bg-white/10", "hover:bg-[#b45309]/10"),
    ("bg-white/10", "bg-[#b45309]/10"),
    ("bg-white/5", "bg-[#b45309]/5"),
]


def main() -> int:
    if not BERKAS.exists():
        print(f"  berkas tidak ditemukan: {BERKAS}")
        return 1

    s = BERKAS.read_text(encoding="utf-8")
    asli = s
    n = 0

    print("  Penggantian bertarget:")
    for lama, baru in GANTI:
        if lama in s:
            s = s.replace(lama, baru, 1)
            n += 1
            print(f"    OK  {lama[:62]}...")
        else:
            print(f"    --  tidak ditemukan: {lama[:62]}...")

    print("\n  Penggantian menyeluruh (sisa warna slate/putih):")
    for lama, baru in GANTI_GLOBAL:
        jml = s.count(lama)
        if jml:
            s = s.replace(lama, baru)
            n += jml
            print(f"    {lama:<26} -> {baru:<26} ({jml}x)")

    if s == asli:
        print("\n  TIDAK ADA perubahan.")
        return 1

    BERKAS.write_text(s, encoding="utf-8")
    print(f"\n  {n} penggantian diterapkan. Berkas ditulis.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
