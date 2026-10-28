# -*- coding: utf-8 -*-
"""Membuat tiga varian logo RESQ-BOX.

Palet diambil dari aplikasi supaya logo dan antarmuka terasa satu keluarga:
  amber  #b45309   cokelat #451a03   krem  #fef3c7
  hijau  #059669   merah  #dc2626    oranye #f97316

Semua digambar pada 4x ukuran lalu diperkecil, supaya tepinya halus tanpa
pustaka tambahan.
"""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

SKALA = 4
FONT_TEBAL = r"C:\Windows\Fonts\segoeuib.ttf"
FONT_BLACK = r"C:\Windows\Fonts\seguibl.ttf"

AMBER = (180, 83, 9)
COKELAT = (69, 26, 3)
KREM = (254, 243, 199)
HIJAU = (5, 150, 105)
MERAH = (220, 38, 38)
ORANYE = (249, 115, 22)
PUTIH = (255, 255, 255)

KELUARAN = Path(r"C:\github\lidm buatan vincent\RESQ-BOX\lampiran-buku\logo")
KELUARAN.mkdir(parents=True, exist_ok=True)


def kanvas(p, l, latar=None):
    img = Image.new("RGBA", (p * SKALA, l * SKALA), latar or (0, 0, 0, 0))
    return img, ImageDraw.Draw(img)


def selesai(img, nama, ukuran=None):
    if ukuran:
        img = img.resize(ukuran, Image.LANCZOS)
    else:
        img = img.resize((img.width // SKALA, img.height // SKALA), Image.LANCZOS)
    tujuan = KELUARAN / nama
    img.save(tujuan)
    print(f"  [v] {nama}  {img.width}x{img.height}")
    return img


def emblem(d, x, y, s):
    """Kotak membulat berisi gunung api, asap, dan garis getaran.

    Versi ketiga: gunung diperbesar dan dinaikkan agar tidak menyisakan ruang
    kosong di atas, kawah dibuat cekung dengan pijaran oranye, lava berhenti
    tepat di kaki gunung, dan asap dibuat lebih terang.
    """
    r = int(s * 0.22)
    d.rounded_rectangle([x, y, x + s, y + s], radius=r, fill=KREM)
    d.rounded_rectangle([x, y, x + s, y + s], radius=r, outline=AMBER,
                        width=int(s * 0.045))

    # matahari
    d.ellipse([x + s * 0.700, y + s * 0.150, x + s * 0.820, y + s * 0.270],
              fill=(251, 191, 36))

    dasar = y + s * 0.790
    puncak = y + s * 0.300
    lebar = s * 0.380
    px = x + s * 0.500
    d.polygon([(px - lebar, dasar), (px + lebar, dasar), (px, puncak)], fill=COKELAT)

    # kawah cekung: trapesium lebih gelap lalu pijaran oranye
    kw = s * 0.090
    d.polygon([(px - kw, puncak + s * 0.075), (px + kw, puncak + s * 0.075),
               (px + kw * 0.45, puncak - s * 0.010),
               (px - kw * 0.45, puncak - s * 0.010)], fill=(38, 14, 2))
    d.ellipse([px - kw * 0.62, puncak + s * 0.020,
               px + kw * 0.62, puncak + s * 0.078], fill=ORANYE)

    # lava: dari kawah menuruni lereng kanan sampai kaki gunung
    lava = [
        (px + s * 0.020, puncak + s * 0.080),
        (px + s * 0.120, puncak + s * 0.190),
        (px + s * 0.060, puncak + s * 0.300),
        (px + s * 0.170, dasar - s * 0.006),
    ]
    d.line(lava, fill=ORANYE, width=int(s * 0.028), joint="curve")

    # asap tipis di atas kawah
    for dx, dy, rr in [(-0.010, -0.070, 0.040), (0.015, -0.130, 0.050)]:
        d.ellipse([px + s * dx - s * rr, puncak + s * dy - s * rr,
                   px + s * dx + s * rr, puncak + s * dy + s * rr],
                  fill=(231, 229, 228))

    # garis getaran seismik
    gy = y + s * 0.900
    amp = s * 0.022
    titik = []
    naik = True
    cx = x + s * 0.200
    while cx <= x + s * 0.800:
        titik.append((cx, gy + (-amp if naik else amp)))
        naik = not naik
        cx += s * 0.060
    d.line(titik, fill=AMBER, width=int(s * 0.020), joint="curve")


# ══════════════ VARIAN 1: emblem tunggal ══════════════
img, d = kanvas(512, 512)
emblem(d, 0, 0, 512 * SKALA)
selesai(img, "1-emblem.png", (512, 512))

# ══════════════ VARIAN 2: mendatar (emblem + tulisan) ══════════════
img, d = kanvas(1200, 360)
s = 360 * SKALA
emblem(d, 0, 0, s)
f_judul = ImageFont.truetype(FONT_BLACK, int(150 * SKALA))
f_sub = ImageFont.truetype(FONT_TEBAL, int(42 * SKALA))
tx = int(s + 46 * SKALA)
d.text((tx, int(52 * SKALA)), "RESQ-BOX", font=f_judul, fill=COKELAT)
d.text((tx, int(248 * SKALA)), "MITIGASI BENCANA GEOLOGIS", font=f_sub, fill=AMBER)
selesai(img, "2-mendatar.png", (1200, 360))

# ══════════════ VARIAN 3: lambang bulat ══════════════
img, d = kanvas(512, 512)
S = 512 * SKALA
d.ellipse([0, 0, S, S], fill=KREM, outline=COKELAT, width=int(S * 0.045))
emblem(d, int(S * 0.145), int(S * 0.145), int(S * 0.71))
selesai(img, "3-bulat.png", (512, 512))

# ══════════════ VARIAN 4: monogram R ══════════════
img, d = kanvas(512, 512)
S = 512 * SKALA
d.rounded_rectangle([0, 0, S, S], radius=int(S * 0.22), fill=COKELAT)
f_r = ImageFont.truetype(FONT_BLACK, int(S * 0.62))
teks = "R"
kotak = d.textbbox((0, 0), teks, font=f_r)
d.text(((S - (kotak[2] - kotak[0])) / 2 - kotak[0],
        (S - (kotak[3] - kotak[1])) / 2 - kotak[1] - int(S * 0.03)),
       teks, font=f_r, fill=KREM)
# garis getaran kecil di bawah huruf
gy = int(S * 0.80)
amp = int(S * 0.035)
titik = []
naik = True
cx = int(S * 0.26)
while cx <= int(S * 0.74):
    titik.append((cx, gy + (-amp if naik else amp)))
    naik = not naik
    cx += int(S * 0.06)
d.line(titik, fill=AMBER, width=int(S * 0.028), joint="curve")
selesai(img, "4-monogram.png", (512, 512))

# ══════════════ VARIAN 5: lencana untuk seragam ══════════════
img, d = kanvas(600, 600)
S = 600 * SKALA
d.ellipse([0, 0, S, S], fill=AMBER)
d.ellipse([int(S * 0.055)] * 2 + [int(S * 0.945)] * 2, outline=KREM, width=int(S * 0.022))
# Lencana: emblem diperkecil dan dinaikkan agar tidak terpotong tepi lingkaran,
# lalu tulisan diberi ruang sendiri di bawahnya.
emblem(d, int(S * 0.275), int(S * 0.145), int(S * 0.450))
f_k = ImageFont.truetype(FONT_BLACK, int(58 * SKALA))
label = "RESQ-BOX"
kb = d.textbbox((0, 0), label, font=f_k)
d.text(((S - (kb[2] - kb[0])) / 2 - kb[0], int(S * 0.660)), label, font=f_k, fill=KREM)
selesai(img, "5-lencana.png", (600, 600))

print(f"\n  semua tersimpan di {KELUARAN}")
