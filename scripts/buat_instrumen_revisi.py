# -*- coding: utf-8 -*-
"""Membuat instrumen observasi Design Thinking versi revisi.

Revisi dilakukan agar butir yang TIDAK didukung aplikasi tidak lagi
menuntut observer mengamati hal yang tidak ada. Setiap perubahan butir
dicatat pada bagian "Catatan Revisi" beserta alasannya.
"""
import sys
from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.section import WD_ORIENT
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

WARNA_UTAMA = RGBColor(0x1F, 0x3A, 0x5F)
WARNA_ABU = RGBColor(0x55, 0x55, 0x55)

DIMENSI = [
    ("A. EMPATHY", "Empati terhadap keselamatan manusia dan lingkungan",
     "Kemampuan peserta didik mengidentifikasi warga yang paling berisiko berdasarkan peran warga pada "
     "simulasi, mengenali fasilitas publik pada peta lereng gunung api, serta menentukan aksi evakuasi dan "
     "durasi sirine yang sesuai dengan arah bahaya.",
     "1, 2, 3, 4, 5"),
    ("B. COLLABORATION", "Kolaborasi kerja dan pembagian peran kelompok",
     "Kemampuan peserta didik membagi peran kerja (operator blok, pengamat papan diorama, pencatat data), "
     "menyampaikan gagasan rancangan keselamatan secara santun, mendengarkan pendapat rekan, dan saling "
     "membantu mengatasi kendala teknis.",
     "6, 7, 8, 9, 10"),
    ("C. EXPERIMENTALISM", "Eksperimentasi dan pengujian solusi",
     "Kemampuan peserta didik menyusun rantai keputusan sebab-akibat ke dalam blok logika, menguji "
     "sinkronisasi respons fisik (motor getar, lampu indikator, buzzer), memvariasikan durasi sirine dan "
     "kombinasi aksi evakuasi, serta mengulang simulasi untuk memperbaiki hasil.",
     "11, 12, 13, 14, 15"),
    ("D. OPTIMISM", "Keyakinan solusi, sikap pantang menyerah, dan presentasi",
     "Sikap antusias memecahkan tantangan misi, tetap tenang ketika hasil simulasi masih menunjukkan korban, "
     "memandang kesalahan logika sebagai peluang perbaikan, serta mempresentasikan hasil rancangan dengan "
     "percaya diri.",
     "16, 17, 18, 19, 20"),
    ("E. FEEDBACK SEEKING", "Pencarian umpan balik, refleksi, dan keterbukaan diskusi",
     "Kemampuan peserta didik membaca indikator hasil simulasi pada panel Hasil Simulasi, meminta masukan "
     "guru atau rekan, menyimak kritik tanpa sikap defensif, serta menyempurnakan konfigurasi sistem "
     "berdasarkan masukan tersebut.",
     "21, 22, 23, 24, 25"),
]

BUTIR = [
    ("A", "EMPATHY", "Empati terhadap keselamatan manusia dan lingkungan", [
        "Mengidentifikasi warga yang paling berisiko berdasarkan peran warga pada simulasi, yaitu lansia dan pelajar, serta menandai fasilitas publik di lereng gunung api seperti sekolah, tenda pengungsian, rumah sakit, dan permukiman warga.",
        "Menentukan aksi evakuasi yang sesuai dengan arah bahaya, yaitu keluar bangunan, menuju tanah lapang, menjauhi wilayah sungai, menuju zona KRB, atau keluar area peta.",
        "Memperhitungkan durasi sirine peringatan dini yang dipasang pada blok agar warga memiliki waktu mencapai tujuan evakuasi sebelum bahaya tiba.",
        "Menunjukkan kepedulian terhadap warga yang menjadi korban dengan menelaah jumlah korban dan rasio selamat pada panel Hasil Simulasi.",
        "Merumuskan urutan langkah tindakan penyelamatan diri manual secara runtut sebelum sistem otomatisasi sempat merespons.",
    ]),
    ("B", "COLLABORATION", "Kolaborasi kerja dan pembagian peran kelompok", [
        "Membagi peran kerja dalam kelompok secara jelas, yaitu operator blok pada web, pengamat indikator pada papan diorama, dan pencatat data.",
        "Mengemukakan gagasan konfigurasi logika mitigasi secara aktif dan santun saat berdiskusi merancang sistem keselamatan bersama.",
        "Mendengarkan dan mengakomodasi pertimbangan rekan sekelompok dalam menetapkan ambang kondisi bahaya pada blok logika.",
        "Saling membantu secara aktif saat kelompok menemui hambatan teknis, misalnya sinkronisasi kabel data serial atau kesalahan urutan blok.",
        "Berbagi giliran secara tertib dalam memegang kendali komputer maupun mengoperasikan tombol pada papan diorama.",
    ]),
    ("C", "EXPERIMENTALISM", "Eksperimentasi dan pengujian solusi", [
        "Menerjemahkan hipotesis rantai mitigasi ke dalam susunan blok logika interaktif secara runtut.",
        "Menghubungkan instruksi digital pada web ke papan simulator fisik untuk menguji respons motor getar, lampu indikator, dan buzzer.",
        "Mencoba variasi pengaturan, yaitu durasi sirine, kombinasi aksi evakuasi, serta penggunaan blok perbandingan dan perulangan.",
        "Menjalankan simulasi penyelamatan lebih dari satu kali untuk mengamati perubahan jumlah warga selamat pada panel Hasil Simulasi.",
        "Memvalidasi kesesuaian antara parameter krisis pada layar komputer dengan tanda fisik yang muncul pada diorama.",
    ]),
    ("D", "OPTIMISM", "Keyakinan solusi, sikap pantang menyerah, dan presentasi", [
        "Menunjukkan antusiasme dan rasa ingin tahu yang tinggi saat memecahkan tantangan misi kebencanaan pada web.",
        "Tetap tenang dan tidak patah semangat ketika panel Hasil Simulasi masih menunjukkan adanya warga yang menjadi korban.",
        "Menunjukkan keyakinan bahwa kesalahan logika dapat diperbaiki dengan menyusun ulang skenario perlindungan yang lebih efektif.",
        "[Presentasi] Mempresentasikan hasil rancangan logika mitigasi dan unjuk kerja papan simulator di depan kelas secara percaya diri.",
        "[Presentasi] Menjelaskan kendala teknis atau kegagalan simulasi yang dialami kelompok secara objektif sebagai bagian dari proses belajar.",
    ]),
    ("E", "FEEDBACK SEEKING", "Pencarian umpan balik, refleksi, dan keterbukaan diskusi", [
        "Mencermati indikator hasil simulasi pada panel Hasil Simulasi, yaitu jumlah warga selamat, jumlah korban, rasio selamat, dan waktu tanggap.",
        "Berkonsultasi aktif kepada guru fasilitator ketika membutuhkan klarifikasi teknis mengenai pengaturan rantai keputusan blok.",
        "[Presentasi] Mengundang tanggapan, pertanyaan, atau masukan kritis dari kelompok lain dan guru terhadap sistem mitigasi yang dipaparkan.",
        "[Presentasi] Menyimak pertanyaan maupun kritik dari audiens dengan seksama tanpa memotong pembicaraan atau bersikap defensif.",
        "[Presentasi] Menyatakan secara terbuka rencana tindak lanjut perbaikan logika keselamatan kelompok berdasarkan saran yang diperoleh.",
    ]),
]

REVISI = [
    ("Butir 1",
     "Semula menuntut menemukan titik kerentanan warga dan menyebut mushola sebagai fasilitas publik.",
     "Aplikasi tidak menyediakan lapisan data titik kerentanan, dan mushola tidak dirender pada peta 3D. "
     "Butir diubah agar mengacu pada peran warga yang benar-benar ada, yaitu lansia dan pelajar, serta pada "
     "fasilitas yang benar-benar tampak, yaitu sekolah, tenda pengungsian, rumah sakit, dan permukiman."),
    ("Butir 2",
     "Semula \u201cmenentukan lokasi titik kumpul dan jalur evakuasi\u201d.",
     "Aplikasi mengarahkan warga melalui aksi evakuasi, bukan melalui penetapan titik kumpul pada peta. "
     "Butir disesuaikan dengan lima aksi evakuasi yang tersedia pada blok."),
    ("Butir 3",
     "Semula mencakup \u201cpembukaan gerbang evakuasi\u201d.",
     "Gerbang tidak digunakan pada adegan yang berjalan dan belum ada blok yang membukanya. "
     "Butir dibatasi pada durasi sirine, yang memang dapat diatur siswa."),
    ("Butir 4",
     "Semula menuntut mengamati warga yang tertinggal atau terlambat bergerak.",
     "Panel Hasil Simulasi hanya menampilkan jumlah selamat, jumlah korban, rasio selamat, dan waktu tanggap. "
     "Tidak ada indikator warga tertinggal. Butir disandarkan pada jumlah korban dan rasio selamat yang "
     "memang terlihat siswa."),
    ("Butir 8",
     "Semula \u201cambang batas sensor\u201d.",
     "Aplikasi belum memiliki blok sensor bernilai angka. Butir diarahkan pada ambang kondisi bahaya, "
     "sesuai blok kondisi yang tersedia."),
    ("Butir 13",
     "Semula mencakup \u201critme kedip lampu\u201d dan \u201curutan pintu keluar\u201d.",
     "Keduanya tidak tersedia. Diganti dengan variasi yang benar-benar dapat dikerjakan, yaitu durasi sirine, "
     "kombinasi aksi evakuasi, serta blok perbandingan dan perulangan."),
    ("Butir 17",
     "Semula \u201cuji coba awal menunjukkan korban jiwa atau jalur evakuasi gagal terbuka\u201d.",
     "Jumlah korban kini tampil pada panel Hasil Simulasi, tetapi status jalur tidak ditampilkan. "
     "Butir disandarkan pada angka korban yang benar-benar terlihat."),
    ("Butir 21",
     "Semula \u201crasio warga selamat, status bahaya, dan waktu tanggap\u201d.",
     "Ketiganya kini tersedia pada panel Hasil Simulasi, sehingga butir dipertahankan dan diperjelas "
     "dengan menyebut nama panelnya."),
]


def atur_halaman(section, landscape=False, margin_cm=1.8):
    if landscape:
        section.orientation = WD_ORIENT.LANDSCAPE
        section.page_width, section.page_height = section.page_height, section.page_width
    section.top_margin = Cm(margin_cm)
    section.bottom_margin = Cm(margin_cm)
    section.left_margin = Cm(margin_cm)
    section.right_margin = Cm(margin_cm)


def beri_border(sel, tebal=4):
    tcPr = sel._tc.get_or_add_tcPr()
    borders = OxmlElement("w:tcBorders")
    for sisi in ("top", "left", "bottom", "right"):
        el = OxmlElement(f"w:{sisi}")
        el.set(qn("w:val"), "single")
        el.set(qn("w:sz"), str(tebal))
        el.set(qn("w:color"), "808080")
        borders.append(el)
    tcPr.append(borders)


def tulis(sel, teks, tebal=False, ukuran=9, rata=WD_ALIGN_PARAGRAPH.LEFT, warna=None):
    sel.text = ""
    p = sel.paragraphs[0]
    p.alignment = rata
    p.paragraph_format.space_before = Pt(1)
    p.paragraph_format.space_after = Pt(1)
    run = p.add_run(teks)
    run.bold = tebal
    run.font.size = Pt(ukuran)
    run.font.name = "Times New Roman"
    if warna:
        run.font.color.rgb = warna



def lebar_tetap(tabel, daftar_lebar):
    """Paksa lebar kolom dihormati LibreOffice maupun Word.

    Tanpa `tblLayout fixed` dan lebar pada setiap sel, kedua aplikasi
    mengabaikan lebar kolom dan membagi rata — akibatnya kolom uraian
    menjadi sempit, baris menjadi sangat tinggi, dan dokumen membengkak
    menjadi belasan halaman.
    """
    tabel.autofit = False
    tblPr = tabel._tbl.tblPr
    layout = OxmlElement("w:tblLayout")
    layout.set(qn("w:type"), "fixed")
    tblPr.append(layout)
    for i, w in enumerate(daftar_lebar):
        if i < len(tabel.columns):
            tabel.columns[i].width = w
    for row in tabel.rows:
        for i, w in enumerate(daftar_lebar):
            if i < len(row.cells):
                row.cells[i].width = w

doc = Document()
gaya = doc.styles["Normal"]
gaya.font.name = "Times New Roman"
gaya.font.size = Pt(11)

# ══════════════════ HALAMAN 1: JUDUL & MATRIKS ══════════════════
sec = doc.sections[0]
atur_halaman(sec)

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p.add_run("MATRIKS KISI-KISI PENGEMBANGAN INSTRUMEN OBSERVASI")
r.bold = True; r.font.size = Pt(14); r.font.color.rgb = WARNA_UTAMA

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p.add_run("Keterampilan Design Thinking Siswa SMP Berbantuan Media RESQ-BOX Kit")
r.bold = True; r.font.size = Pt(12)

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p.add_run("Versi Revisi — disesuaikan dengan fitur yang tersedia pada aplikasi")
r.italic = True; r.font.size = Pt(10); r.font.color.rgb = WARNA_ABU

doc.add_paragraph()

for label, isi in [
    ("Konteks pengembangan", "Mengukur keterampilan Design Thinking peserta didik Fase D pada pembelajaran "
                             "mitigasi bencana geologis Merapi dengan media RESQ-BOX Web dan RESQ-BOX Board."),
    ("Dasar penyusunan", "Kerangka kompetensi Design Thinking dan struktur instrumen observasi proses sains, "
                         "disesuaikan dengan hasil penelusuran fitur aplikasi."),
    ("Catatan revisi", "Beberapa butir pada versi awal menuntut perilaku yang belum tersedia pada aplikasi. "
                       "Butir tersebut diperbaiki agar observer tidak menilai hal yang tidak dapat diamati. "
                       "Rincian perubahan tercantum pada halaman terakhir."),
]:
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run(f"{label}: ")
    r.bold = True; r.font.size = Pt(10)
    r2 = p.add_run(isi)
    r2.font.size = Pt(10)

doc.add_paragraph()
p = doc.add_paragraph()
r = p.add_run("I. MATRIKS KISI-KISI INSTRUMEN OBSERVASI")
r.bold = True; r.font.size = Pt(11); r.font.color.rgb = WARNA_UTAMA

tabel = doc.add_table(rows=1, cols=5)
tabel.style = "Table Grid"
tabel.alignment = WD_TABLE_ALIGNMENT.CENTER
lebar = [Cm(0.9), Cm(4.0), Cm(6.4), Cm(4.8), Cm(1.3)]
for i, judul in enumerate(["No", "Dimensi", "Definisi Operasional dalam Pembelajaran RESQ-BOX", "Indikator Kompetensi", "Butir"]):
    sel = tabel.rows[0].cells[i]
    tulis(sel, judul, tebal=True, ukuran=9, rata=WD_ALIGN_PARAGRAPH.CENTER)
    sel.width = lebar[i]

INDIKATOR = {
    "A. EMPATHY": "Menempatkan diri pada posisi warga\nMenemukan kebutuhan warga\nBerorientasi keselamatan jiwa",
    "B. COLLABORATION": "Pembagian peran kerja\nBerbagi gagasan lintas tugas\nKomunikasi aktif",
    "C. EXPERIMENTALISM": "Mencoba pendekatan baru\nPurwarupa cepat dan iterasi\nMenyusun serta menguji logika",
    "D. OPTIMISM": "Percaya diri menghadapi tantangan\nBelajar dari hambatan\nKeyakinan kreatif dalam tindakan",
    "E. FEEDBACK SEEKING": "Aktif mencari masukan\nMenerima saran\nMemperbaiki tindakan berdasar umpan balik",
}

lebar_tetap(tabel, lebar)
for i, (dim, judul, definisi, butir) in enumerate(DIMENSI, 1):
    row = tabel.add_row()
    tulis(row.cells[0], str(i), ukuran=9, rata=WD_ALIGN_PARAGRAPH.CENTER)
    tulis(row.cells[1], f"{dim}\n({judul})", tebal=True, ukuran=9)
    tulis(row.cells[2], definisi, ukuran=9)
    tulis(row.cells[3], INDIKATOR[dim], ukuran=9)
    tulis(row.cells[4], butir, ukuran=9, rata=WD_ALIGN_PARAGRAPH.CENTER)
    for j, w in enumerate(lebar):
        row.cells[j].width = w

doc.add_paragraph()
p = doc.add_paragraph()
r = p.add_run("II. PEDOMAN PENSKORAN DAN INTERPRETASI")
r.bold = True; r.font.size = Pt(11); r.font.color.rgb = WARNA_UTAMA

p = doc.add_paragraph()
p.paragraph_format.space_after = Pt(2)
r = p.add_run("1. Formula penghitungan skor ketercapaian")
r.bold = True; r.font.size = Pt(10)
doc.add_paragraph("Penilaian dilakukan secara dikotomis, yaitu skor 1 untuk perilaku yang teramati dan skor 0 "
                  "untuk perilaku yang tidak teramati.", style="List Bullet")
p = doc.add_paragraph()
r = p.add_run("Nilai Ketercapaian (%) = (jumlah skor 1 yang diperoleh ÷ jumlah skor maksimal) × 100%")
r.bold = True; r.font.size = Pt(10)
p.alignment = WD_ALIGN_PARAGRAPH.CENTER

p = doc.add_paragraph()
r = p.add_run("2. Kategori tingkat ketercapaian")
r.bold = True; r.font.size = Pt(10)

kategori = [("80% – 100%", "Sangat Baik"), ("60% – 79%", "Baik"), ("40% – 59%", "Cukup"),
            ("20% – 39%", "Kurang"), ("0% – 19%", "Sangat Kurang")]
t2 = doc.add_table(rows=1, cols=2)
t2.style = "Table Grid"
t2.alignment = WD_TABLE_ALIGNMENT.CENTER
tulis(t2.rows[0].cells[0], "Rentang Persentase", tebal=True, ukuran=9, rata=WD_ALIGN_PARAGRAPH.CENTER)
tulis(t2.rows[0].cells[1], "Kategori Kualitatif", tebal=True, ukuran=9, rata=WD_ALIGN_PARAGRAPH.CENTER)
lebar_tetap(t2, [Cm(5.0), Cm(5.0)])
for a, b in kategori:
    row = t2.add_row()
    tulis(row.cells[0], a, ukuran=9, rata=WD_ALIGN_PARAGRAPH.CENTER)
    tulis(row.cells[1], b, ukuran=9, rata=WD_ALIGN_PARAGRAPH.CENTER)

# ══════════════════ HALAMAN 2: LEMBAR OBSERVASI (LANDSCAPE) ══════════════════
sec2 = doc.add_section()
atur_halaman(sec2, landscape=True, margin_cm=1.4)

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p.add_run("LEMBAR OBSERVASI KETERAMPILAN DESIGN THINKING")
r.bold = True; r.font.size = Pt(13); r.font.color.rgb = WARNA_UTAMA

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p.add_run("RESQ-BOX Kit — SMP Kelas VIII, Materi Struktur Bumi dan Mitigasi Bencana Geologis")
r.font.size = Pt(10); r.italic = True

identitas = [
    ("Satuan pendidikan", "....................................................................", "Hari, tanggal", "........................................."),
    ("Kelas / semester", "....................................................................", "Nama observer", "........................................."),
    ("Pertemuan / jam", "....................................................................", "NIP / NIM", "........................................."),
]
for kiri, isi_kiri, kanan, isi_kanan in identitas:
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(1)
    r = p.add_run(f"{kiri}: {isi_kiri}")
    r.font.size = Pt(9.5)
    r2 = p.add_run(f"    {kanan}: {isi_kanan}")
    r2.font.size = Pt(9.5)

p = doc.add_paragraph()
r = p.add_run("Petunjuk: berikan tanda centang (√) pada kolom Y bila kelompok menunjukkan perilaku tersebut secara "
              "konsisten selama kegiatan, atau kolom T bila perilaku tidak teramati.")
r.italic = True; r.font.size = Pt(9)

t3 = doc.add_table(rows=1, cols=12)
t3.style = "Table Grid"
t3.alignment = WD_TABLE_ALIGNMENT.CENTER
lebar3 = [Cm(0.8), Cm(13.2)] + [Cm(1.15)] * 10
kepala = ["No", "Butir Perilaku Teramati"] + ["Y"] + ["T"]
judul_kolom = ["No", "Butir Perilaku Teramati"]
sel0 = t3.rows[0].cells[0]; tulis(sel0, "No", tebal=True, ukuran=9, rata=WD_ALIGN_PARAGRAPH.CENTER)
sel1 = t3.rows[0].cells[1]; tulis(sel1, "Butir Perilaku Teramati", tebal=True, ukuran=9, rata=WD_ALIGN_PARAGRAPH.CENTER)
for k in range(5):
    a = t3.rows[0].cells[2 + k * 2]
    b = t3.rows[0].cells[3 + k * 2]
    tulis(a, f"K{k+1} Y", tebal=True, ukuran=8, rata=WD_ALIGN_PARAGRAPH.CENTER)
    tulis(b, f"K{k+1} T", tebal=True, ukuran=8, rata=WD_ALIGN_PARAGRAPH.CENTER)
for j, w in enumerate(lebar3):
    t3.rows[0].cells[j].width = w

lebar_tetap(t3, lebar3)
nomor = 0
for kode, nama, judul, daftar in BUTIR:
    row = t3.add_row()
    gabung = row.cells[0].merge(row.cells[11])
    tulis(gabung, f"{kode}. {nama} — {judul}", tebal=True, ukuran=9)
    # Judul dimensi tidak boleh terpisah dari butir pertamanya.
    for par in gabung.paragraphs:
        par.paragraph_format.keep_with_next = True
    for isi in daftar:
        nomor += 1
        row = t3.add_row()
        tulis(row.cells[0], str(nomor), ukuran=9, rata=WD_ALIGN_PARAGRAPH.CENTER)
        tulis(row.cells[1], isi, ukuran=9)
        for k in range(10):
            tulis(row.cells[2 + k], "", ukuran=9)
        for j, w in enumerate(lebar3):
            row.cells[j].width = w

row = t3.add_row()
gabung = row.cells[0].merge(row.cells[1])
tulis(gabung, "TOTAL SKOR KEMUNCULAN (jumlah centang Y)", tebal=True, ukuran=9)
for k in range(12)[2:]:
    tulis(row.cells[k], "", ukuran=9)

row = t3.add_row()
gabung = row.cells[0].merge(row.cells[1])
tulis(gabung, "NILAI KETERCAPAIAN AKHIR (%)", tebal=True, ukuran=9)
for k in range(12)[2:]:
    tulis(row.cells[k], "", ukuran=9)

doc.add_paragraph()
p = doc.add_paragraph()
r = p.add_run("Catatan kualitatif observer:")
r.bold = True; r.font.size = Pt(10)
doc.add_paragraph("_" * 150)
doc.add_paragraph("_" * 150)

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
r = p.add_run("Sleman, .................................. 2026")
r.font.size = Pt(10)

tanda = doc.add_table(rows=2, cols=2)
tanda.alignment = WD_TABLE_ALIGNMENT.CENTER
tulis(tanda.rows[0].cells[0], "Mengetahui,\nGuru Mata Pelajaran IPA", ukuran=10, rata=WD_ALIGN_PARAGRAPH.CENTER)
tulis(tanda.rows[0].cells[1], "Observer / Penilai", ukuran=10, rata=WD_ALIGN_PARAGRAPH.CENTER)
tulis(tanda.rows[1].cells[0], "\n\n(..........................................)", ukuran=10, rata=WD_ALIGN_PARAGRAPH.CENTER)
tulis(tanda.rows[1].cells[1], "\n\n(..........................................)", ukuran=10, rata=WD_ALIGN_PARAGRAPH.CENTER)

# ══════════════════ HALAMAN 3: CATATAN REVISI ══════════════════
sec3 = doc.add_section()
atur_halaman(sec3, landscape=False, margin_cm=1.8)

p = doc.add_paragraph()
r = p.add_run("III. CATATAN REVISI INSTRUMEN")
r.bold = True; r.font.size = Pt(12); r.font.color.rgb = WARNA_UTAMA

p = doc.add_paragraph()
r = p.add_run("Revisi dilakukan setelah menelusuri kode aplikasi. Butir yang menuntut perilaku yang belum "
              "tersedia diubah agar observer tidak menilai hal yang tidak dapat diamati. Isi dan jumlah butir "
              "tetap dua puluh lima agar penskoran dan analisis statistik tidak berubah.")
r.font.size = Pt(10)

t4 = doc.add_table(rows=1, cols=3)
t4.style = "Table Grid"
lebar4 = [Cm(2.0), Cm(5.8), Cm(9.4)]
for i, judul in enumerate(["Butir", "Versi awal", "Dasar perubahan"]):
    tulis(t4.rows[0].cells[i], judul, tebal=True, ukuran=9, rata=WD_ALIGN_PARAGRAPH.CENTER)
    t4.rows[0].cells[i].width = lebar4[i]
lebar_tetap(t4, lebar4)
for butir, awal, alasan in REVISI:
    row = t4.add_row()
    tulis(row.cells[0], butir, tebal=True, ukuran=9)
    tulis(row.cells[1], awal, ukuran=9)
    tulis(row.cells[2], alasan, ukuran=9)
    for j, w in enumerate(lebar4):
        row.cells[j].width = w

doc.add_paragraph()
p = doc.add_paragraph()
r = p.add_run("Butir yang tidak diubah")
r.bold = True; r.font.size = Pt(10)
doc.add_paragraph("Butir 4 sampai 7, 9 sampai 12, 14 sampai 16, 18 sampai 20, dan 22 sampai 25 dinyatakan sudah "
                  "sesuai dengan fitur aplikasi maupun kegiatan kelas, sehingga tidak diubah.", style="List Bullet")

p = doc.add_paragraph()
r = p.add_run("Batas yang perlu dicatat")
r.bold = True; r.font.size = Pt(10)
doc.add_paragraph("Instrumen ini menilai perilaku yang dapat diamati, bukan prestasi belajar. Nilai pengetahuan "
                  "tetap berasal dari penilaian pada aplikasi. Beberapa butir, terutama pada dimensi Optimism dan "
                  "Feedback Seeking, hanya dapat diamati saat presentasi kelas berlangsung.", style="List Bullet")
doc.add_paragraph("Aplikasi belum memiliki blok sensor bernilai angka, gerbang evakuasi, maupun lapisan data "
                  "kerentanan warga. Butir yang semula mengacu pada ketiganya telah disesuaikan, dan ketiganya "
                  "dapat ditambahkan pada pengembangan berikutnya.", style="List Bullet")

doc.add_paragraph()
p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p.add_run("Instrumen Observasi Design Thinking • RESQ-BOX Kit")
r.italic = True; r.font.size = Pt(9); r.font.color.rgb = WARNA_ABU

keluaran = (
    sys.argv[1] if len(sys.argv) > 1
    else r"C:\github\lidm buatan vincent\RESQ-BOX\lampiran-buku\INSTRUMEN-OBSERVASI-DT-REVISI.docx"
)
doc.save(keluaran)
print(f"  [v] tersimpan: {keluaran}")

# ── verifikasi ──
from docx import Document as D2
baca = D2(keluaran)
jumlah_tabel = len(baca.tables)
jumlah_paragraf = len(baca.paragraphs)
semua = "\n".join(p.text for p in baca.paragraphs)
for t in baca.tables:
    for row in t.rows:
        for sel in row.cells:
            semua += "\n" + sel.text
print(f"  tabel: {jumlah_tabel}, paragraf: {jumlah_paragraf}, seksi: {len(baca.sections)}")
for cek in ["Butir 1", "Butir 21", "NILAI KETERCAPAIAN AKHIR", "CATATAN REVISI", "motor getar", "Hasil Simulasi"]:
    print(f"  {'[v]' if cek in semua else '[X]'} memuat '{cek}'")
print(f"  jumlah butir bernomor 25: {'[v]' if semua.count('\n25') >= 1 else '[?]'}")
