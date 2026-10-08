#!/usr/bin/env python3
"""Perbaiki & perbarui dokumen 'tech stack rill + deploy.docx'.

Menulis versi baru `tech stack rill + deploy (revisi 2026-10).docx` di folder
yang sama, mempertahankan desain aslinya (Table Grid, Times New Roman 12pt,
header bold). Isi tabel diperbarui berdasarkan audit terhadap kode nyata.
"""
from __future__ import annotations

import docx
from docx.shared import Pt, Inches, Emu
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

SRC = r"C:\github\lidm buatan vincent\tech stack rill + deploy.docx"
DST = r"C:\github\lidm buatan vincent\tech stack rill + deploy (revisi 2026-10).docx"

FONT = "Times New Roman"
SIZE = Pt(12)


def style_run(run, *, bold=None, size=SIZE):
    """Terapkan format teks yang konsisten dengan dokumen asli."""
    run.font.name = FONT
    run.font.size = size
    if bold is not None:
        run.bold = bold
    return run


def cell_text(cell, text, *, bold=False, align=None):
    """Ganti isi sel, pertahankan paragraf pertama & format dasar tabel."""
    # Kosongkan paragraf berlebih
    while len(cell.paragraphs) > 1:
        p = cell.paragraphs[-1]
        p._element.getparent().remove(p._element)

    par = cell.paragraphs[0]
    for r in list(par.runs):
        r._element.getparent().remove(r._element)
    if align is not None:
        par.alignment = align
    style_run(par.add_run(text), bold=bold)


def add_par(doc, text, *, bold=False, size=SIZE, space_after=6, align=None):
    par = doc.add_paragraph()
    if align is not None:
        par.alignment = align
    par.paragraph_format.space_after = Pt(space_after)
    style_run(par.add_run(text), bold=bold, size=size)
    return par


EMU_PER_TWIP = 635  # 1 twip = 1/20 pt = 635 EMU

# Urutan anak `tblPr` menurut schema OOXML (CT_TblPrBase). Elemen yang salah
# urutan akan DIABAIKAN oleh Word/LibreOffice — ini yang sebelumnya membuat
# lebar tabel tidak berlaku dan tabel memakai autofit.
TBLPR_ORDER = [
    "tblStyle", "tblpPr", "tblOverlap", "bidiVisual",
    "tblStyleRowBandSize", "tblStyleColBandSize",
    "tblW", "jc", "tblCellSpacing", "tblInd",
    "tblBorders", "shd", "tblLayout", "tblCellMar", "tblLook",
    "tblCaption", "tblDescription",
]


def _insert_in_order(parent, element, tag_order):
    """Sisipkan `element` ke `parent` pada posisi sesuai schema `tag_order`."""
    tag = element.tag.split("}")[-1]
    idx = tag_order.index(tag)
    for child in parent:
        child_tag = child.tag.split("}")[-1]
        if child_tag in tag_order and tag_order.index(child_tag) > idx:
            child.addprevious(element)
            return
    parent.append(element)


def set_table_layout(tb, widths_emu):
    """Kunci lebar kolom supaya tabel tidak meluber ke luar margin halaman.

    Nilai `w:w` pada `w:tblGrid`, `w:tblW`, dan `w:tcW` memakai satuan TWIPS
    (1/20 pt), bukan EMU — itulah sumber bug sebelumnya.
    """
    tb.autofit = False

    tblPr = tb._tbl.tblPr

    # Bersihkan elemen yang akan ditulis ulang.
    for tag in ("w:tblLayout", "w:tblW", "w:tblInd"):
        el = tblPr.find(qn(tag))
        if el is not None:
            tblPr.remove(el)

    widths_twips = [max(1, round(int(w) / EMU_PER_TWIP)) for w in widths_emu]
    total_twips = sum(widths_twips)

    # 1. tblW — lebar total tabel (twips, satuan benar, urutan benar)
    tblW = OxmlElement("w:tblW")
    tblW.set(qn("w:w"), str(total_twips))
    tblW.set(qn("w:type"), "dxa")
    _insert_in_order(tblPr, tblW, TBLPR_ORDER)

    # 2. tblLayout — fixed, supaya lebar kolom dihormati
    layout = OxmlElement("w:tblLayout")
    layout.set(qn("w:type"), "fixed")
    _insert_in_order(tblPr, layout, TBLPR_ORDER)

    # 3. tblInd = 0 → tabel rata kiri, tidak menjorok
    ind = OxmlElement("w:tblInd")
    ind.set(qn("w:w"), "0")
    ind.set(qn("w:type"), "dxa")
    _insert_in_order(tblPr, ind, TBLPR_ORDER)

    # 4. tblGrid — lebar tiap kolom (twips), WAJIB cocok dengan jumlah tcW
    grid = tb._tbl.find(qn("w:tblGrid"))
    if grid is not None:
        tb._tbl.remove(grid)
    grid = OxmlElement("w:tblGrid")
    for w in widths_twips:
        gc = OxmlElement("w:gridCol")
        gc.set(qn("w:w"), str(w))
        grid.append(gc)
    # tblGrid harus tepat setelah tblPr
    tblPr.addnext(grid)

    # 5. tcW tiap sel (twips)
    for row in tb.rows:
        for ci, cell in enumerate(row.cells):
            cell.width = Emu(widths_emu[ci])


def make_table(doc, rows, widths=None):
    tb = doc.add_table(rows=len(rows), cols=len(rows[0]))
    tb.style = "Table Grid"
    tb.alignment = WD_TABLE_ALIGNMENT.LEFT
    for ri, row in enumerate(rows):
        for ci, val in enumerate(row):
            cell_text(tb.cell(ri, ci), val, bold=(ri == 0))
    if widths:
        set_table_layout(tb, [int(w) for w in widths])
    return tb


# ── Dokumen baru dengan desain sama seperti aslinya ────────────────────────
src = docx.Document(SRC)
doc = docx.Document()

sec = doc.sections[0]
sec.page_width = src.sections[0].page_width
sec.page_height = src.sections[0].page_height
sec.left_margin = src.sections[0].left_margin
sec.right_margin = src.sections[0].right_margin
sec.top_margin = src.sections[0].top_margin
sec.bottom_margin = src.sections[0].bottom_margin

normal = doc.styles["Normal"]
normal.font.name = FONT
normal.font.size = SIZE

# ── Judul ─────────────────────────────────────────────────────────────────
add_par(doc, "RESQ-BOX — Tech Stack Riil & Rencana Deploy", bold=True, size=Pt(16), space_after=2)
add_par(doc, "Revisi 2026-10 — diselaraskan dengan kode di repositori", size=Pt(10))
add_par(
    doc,
    "Semua baris di bawah sudah diverifikasi terhadap kode sumber, bukan dari catatan lama. "
    "Status setiap komponen ditandai: AKTIF (dipakai aplikasi), MATI (ada di repo tetapi tidak "
    "diimpor apa pun, dan sudah dipastikan ter-tree-shake dari hasil build), atau DIHAPUS.",
    size=Pt(10),
    space_after=10,
)

# ── Tabel 1: Tech Stack ───────────────────────────────────────────────────
add_par(doc, "1. Tech Stack per Layer", bold=True, size=Pt(13), space_after=4)

stack_rows = [
    ("Layer", "Teknologi", "Status"),
    ("Frontend", "React 19 + TypeScript 6", "AKTIF"),
    ("Build", "Vite 8 (@vitejs/plugin-react); tsc -b + vite build — build hijau ~2,2 detik", "AKTIF"),
    ("Styling", "Tailwind CSS 4 (@tailwindcss/vite) + design token CSS vanilla", "AKTIF"),
    (
        "State",
        "Zustand 5 — 4 store yang benar-benar dipakai: teacherStore, runtimeStore, "
        "missionStore, workspaceStore. Dua store lain (authStore, simulatorStore) MATI "
        "dan tidak diimpor berkas mana pun.",
        "AKTIF (4 dari 6)",
    ),
    ("Routing", "React Router 7 — lazy loading per rute (Level1/2/3, Workspace, Profile, dll.)", "AKTIF"),
    (
        "Block Editor",
        "Google Blockly 12 — 39 blok kustom berbahasa Indonesia. Eksekusi memakai "
        "generator JavaScript di dalam aplikasi. Generator Arduino C tetap ada tetapi "
        "output-nya belum pernah ditampilkan/diunduh/di-flash.",
        "AKTIF (JS)",
    ),
    ("Diagram Editor", "@xyflow/react 12 — DIHAPUS dari dokumen ini: hanya diimpor oleh simulatorStore yang mati", "MATI"),
    ("3D", "Three.js — Merapi3DScene (terrain STL, KRB, awan panas, 75 NPC)", "AKTIF"),
    (
        "Game Engine",
        "Canvas 2D buatan sendiri: fisika lereng, HP & damage, platform CCD, "
        "sprite sheet, dialog visual novel, gerbang Wordle/TTS.",
        "AKTIF",
    ),
    ("Buku Digital", "page-flip / react-pageflip — DIHAPUS: hanya diimpor berkas yang mati", "MATI"),
    ("Audio", "Web Audio API — 21 metode sintesis chiptune mandiri, tanpa file audio", "AKTIF"),
    (
        "Ikon",
        "SVG pixel art custom (PixelIcon, 92 ikon). CATATAN: standar zero-emoji BELUM "
        "terpenuhi — masih ada 87 emoji (🔍 73×, ⚠️ 5×, 🔒 3×, dll.) yang perlu diganti.",
        "AKTIF (belum bersih)",
    ),
    (
        "Data & Auth",
        "Supabase — Postgres + Supabase Auth + Row Level Security ketat. "
        "11 RPC lama ber-pgcrypto sudah DIHAPUS; kini 8 policy per-pemilik, "
        "isolasi data ditegakkan di database.",
        "AKTIF",
    ),
    ("Penyimpanan lokal", "localStorage + BroadcastChannel — cache tampilan, bukan sumber kebenaran", "AKTIF"),
    ("PWA", "vite-plugin-pwa + Workbox; precache selektif 2.295 KiB (dari 4.760 KiB); manifest landscape", "AKTIF"),
    (
        "Integrasi Hardware",
        "Web Serial API (USB, 115200 baud) + WebSocket ke ESP32 AP DIORAMA_ESP32 "
        "(192.168.4.1:81). Catatan: firmware belum mengirim SENSOR:, jadi jalur sensor "
        "digital twin belum berfungsi.",
        "AKTIF (sensor belum)",
    ),
    (
        "Aset 3D/Media",
        "15 berkas / 4,69 MB di public/. terrain-688.stl disajikan sebagai .stl.gz "
        "(966 KB, −69%) dan didekompresi di browser lewat DecompressionStream. "
        "Semua aset ber-Cache-Control.",
        "AKTIF",
    ),
    ("QA/Build tooling", "ESLint 10; validate_sql.py (parser PostgreSQL asli) & validate_plpgsql_vars.py", "AKTIF"),
]

make_table(doc, stack_rows, widths=[Inches(1.1), Inches(3.2), Inches(1.5)])

# ── Tabel 2: Rencana Deploy ───────────────────────────────────────────────
doc.add_paragraph()
add_par(doc, "2. Rencana Deploy per Bagian", bold=True, size=Pt(13), space_after=4)

deploy_rows = [
    ("Bagian", "Deploy di", "Kenapa di situ"),
    (
        "Frontend SPA (React/Vite, dist/)",
        "Workers Static Assets, 1 Worker sama dengan API",
        "Request ke aset statis gratis & tak terbatas — beda dengan Pages Function. "
        "Satu Worker = tanpa CORS, tanpa 2 domain, tanpa 2 pipeline",
    ),
    (
        "API backend (kelas, progres, otorisasi)",
        "Worker script, route /api/* di Worker yang sama",
        "Gantinya Supabase RPC + Laravel. Tipis, CPU ringan, 1 bahasa (TS). "
        "PERHATIAN: di sini otorisasi harus ditulis manual — lihat peringatan di bawah",
    ),
    (
        "Database (5 tabel)",
        "D1 (SQLite, serverless, replication)",
        "Relasional, kecil, read-heavy. 0 egress, 1 binding, tanpa server DB. "
        "Tabel: profiles, classrooms, level_submissions, rate_limits (+ tabel lama)",
    ),
    (
        "Storage media",
        "R2 + custom domain (public-read)",
        ".stl + gambar + LKPD/kurikulum. Egress gratis — menghapus titik jebol "
        "bandwidth yang saat ini jadi batas utama",
    ),
    (
        "Realtime dashboard guru",
        "Durable Object + WebSocket Hibernation",
        "Pengganti postgres_changes. 1 DO per classroom_code, idle → tidak ditagih",
    ),
    (
        "Auth sesi & rate limit",
        "Worker (crypto.subtle) + KV untuk sesi/rate counter",
        "CPU Free tier 10 ms → hashing harus PBKDF2 WebCrypto, bukan bcrypt JS. "
        "PERHATIAN: ini berarti mengganti Supabase Auth dengan sistem sendiri",
    ),
    ("Job terjadwal (rekap, backup D1)", "Cron Triggers", "Pengganti php artisan schedule:run"),
    ("Job async (ekspor, email massal)", "Queues + consumer", "Pengganti queue:listen Laravel"),
    (
        "Ekspor PDF rapor",
        "Worker terpisah + Browser Rendering — atau tetap client-side",
        "Sekarang CSV dibuat di browser; jangan pindahkan kalau tidak perlu",
    ),
    ("Email (undang siswa, rekap ortu)", "Resend / API sejenis", "Email Routing Cloudflare cuma untuk masuk, tidak untuk kirim"),
    ("Anti-bot login", "Turnstile", "Cegah spam registrasi siswa"),
    (
        "Error tracking",
        "Sentry Workers SDK atau Workers Logs + Tail Worker",
        "Kode lama menelan error dengan catch {} kosong; sekarang 24 titik error "
        "sudah dilaporkan lewat noteError()",
    ),
    ("CI/CD", "Workers Builds (connect repo)", "Build + deploy otomatis, ganti Vercel"),
    (
        "Dokumen/arsip (LKPD_*.md, walkthrough)",
        "R2 (prefix docs/) atau statis",
        "Bukan bagian bundle SPA",
    ),
]

make_table(doc, deploy_rows, widths=[Inches(1.4), Inches(1.7), Inches(2.7)])

# ── Peringatan D1 ─────────────────────────────────────────────────────────
doc.add_paragraph()
add_par(doc, "3. PERINGATAN PENTING — D1 tidak punya Row Level Security", bold=True, size=Pt(13), space_after=4)
add_par(
    doc,
    "Rencana di atas kuat secara teknis, terutama argumen R2 (egress gratis) dan Durable Object "
    "(pengganti Realtime). Namun ada satu konsekuensi yang belum disebut dan perlu direncanakan "
    "lebih dulu:",
    size=Pt(11),
)
add_par(
    doc,
    "Seluruh keamanan data RESQ-BOX saat ini bergantung pada RLS di Postgres. Delapan policy "
    "per-pemilik itulah yang membuat aturan “user #1 hanya bisa melihat dan mengubah miliknya "
    "sendiri” ditegakkan oleh DATABASE, bukan oleh kode aplikasi.",
    size=Pt(11),
)
add_par(doc, "Policy yang menegakkan aturan itu:", size=Pt(11), space_after=2)
for line in [
    "profiles_select_owner        → USING (can_read_student(id))",
    "profiles_update_owner        → USING (id = auth.uid())",
    "classrooms_select_member     → USING (is_class_member(code) OR is_admin())",
    "submissions_select_authorized → USING (can_read_student(student_id))",
    "submissions_insert_own       → WITH CHECK (student_id = auth.uid())",
]:
    add_par(doc, line, size=Pt(10), space_after=0)
add_par(
    doc,
    "D1 (SQLite) tidak memiliki RLS. Kalau pindah ke D1, otorisasi harus ditulis ulang di dalam "
    "setiap endpoint Worker. Satu endpoint yang lupa memeriksa kepemilikan akan mengekspos "
    "seluruh data kelas — kegagalan yang saat ini tidak mungkin terjadi.",
    size=Pt(11),
)
add_par(
    doc,
    "Yang juga hilang bila pindah: pgcrypto / crypt(), foreign key & CHECK constraint kompleks, "
    "transaksi, dan auth.uid(). D1 tetap layak dipakai — tetapi ini adalah proyek porting "
    "otorisasi, bukan sekadar penggantian database.",
    size=Pt(11),
)

# ── Tabel 3: Urutan migrasi bertahap ──────────────────────────────────────
doc.add_paragraph()
add_par(doc, "4. Urutan Migrasi yang Disarankan (bertahap, risiko menaik)", bold=True, size=Pt(13), space_after=4)

phase_rows = [
    ("Fase", "Pekerjaan", "Risiko", "Catatan"),
    ("1", "R2 untuk seluruh aset (gambar, .stl, dokumen)", "Rendah", "Keuntungan terbesar, tidak menyentuh auth sama sekali"),
    ("2", "Worker + Static Assets untuk SPA", "Rendah", "Ganti Vercel; masih belum menyentuh auth"),
    ("3", "Realtime ke Durable Object", "Sedang", "Mengganti postgres_changes; terisolasi"),
    ("4", "Porting otorisasi ke API Worker", "TINGGI", "Di sini RLS diganti pengecekan manual per endpoint"),
    ("5", "D1 + sistem auth sendiri", "TINGGI", "Butuh perencanaan paling matang; kerjakan paling akhir"),
]
make_table(doc, phase_rows, widths=[Inches(0.5), Inches(2.2), Inches(0.8), Inches(2.3)])

add_par(
    doc,
    "Fase 1–3 memberi sebagian besar manfaat dengan risiko kecil. Fase 4–5 sebaiknya dikerjakan "
    "setelah lomba, karena keamanan saat ini sudah terbukti lewat 11 pemeriksaan otomatis "
    "dan uji isolasi antar-akun.",
    size=Pt(11),
)

# ── Tabel 4: Perbaikan dokumen ────────────────────────────────────────────
doc.add_paragraph()
add_par(doc, "5. Perbaikan pada Dokumen Ini", bold=True, size=Pt(13), space_after=4)

fix_rows = [
    ("Klaim lama", "Masalah", "Yang benar (terverifikasi)"),
    ("6 store: auth, teacher, mission, workspace, runtime, simulator", "Menyesatkan", "Hanya 4 dipakai; authStore & simulatorStore tidak diimpor"),
    ("Diagram Editor @xyflow/react 12", "Tidak dipakai", "Hanya diimpor simulatorStore.ts yang mati (paket ~234 KB nganggur)"),
    ("Buku Digital: page-flip / react-pageflip", "Keduanya mati", "Hanya diimpor StrukturBumi.tsx & PixelPageFlipBook.tsx yang keduanya mati"),
    ("Ikon: SVG pixel art custom (zero emoji)", "Tidak benar", "Masih ada 87 emoji; 🔍 73×, ⚠️ 5×, 🔒 3×"),
    ("Data & Auth: Supabase (pgcrypto RPC + Realtime)", "Usang", "Kini Supabase Auth + RLS ketat; 11 RPC pgcrypto lama dihapus"),
    ("Game Engine: renderer, npc, pathfinder A*", "Benar tapi mati", "A* ada, tetapi seluruh engine 2D EvacuationGame tidak dipakai"),
    ("Aset: .stl 3,1 MB + 12 JPG/PNG besar", "Usang", "15 berkas / 4,69 MB; STL yang diunduh 966 KB (gzip)"),
    ("Generator Arduino C custom", "Output tak terpakai", "Digenerate, tetapi belum ada jalan keluar untuk melihat/mengunduh/mem-flash"),
    ("Integrasi Hardware: hardware terkoneksi penuh", "Belum lengkap", "SSID di UI sudah diperbaiki; firmware belum mengirim SENSOR:"),
]
make_table(doc, fix_rows, widths=[Inches(2.2), Inches(1.1), Inches(2.5)])

doc.save(DST)
print(f"Tersimpan: {DST}")
print(f"Tabel: {len(doc.tables)}")
for i, t in enumerate(doc.tables, 1):
    print(f"  Tabel {i}: {len(t.rows)} baris x {len(t.columns)} kolom")
