# 🎮 RESQ-BOX — Pixel Quest Edition

<div align="center">

**Platform Media Pembelajaran IPA Interaktif & Simulasi Mitigasi Bencana Berbasis Pixel Quest**
*(Dirancang Khusus untuk Pembelajaran IPA SMP Kelas 8 — Materi Dinamika Lempeng Bumi & Mitigasi Bencana)*

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Blockly](https://img.shields.io/badge/Blockly-12-4285F4?logo=google&logoColor=white)](https://developers.google.com/blockly)
[![PWA](https://img.shields.io/badge/PWA-Offline%20Ready-5A0FC8?logo=pwa&logoColor=white)]()
[![LIDM 2026](https://img.shields.io/badge/LIDM%202026-Finalis-FFD700)]()

*Divisi Inovasi Pembelajaran Digital Pendidikan — LIDM 2026*

</div>

---

## 📖 Tentang RESQ-BOX

**RESQ-BOX** (Rescue Block) adalah media pembelajaran digital interaktif berbasis web yang berfokus pada **materi IPA SMP kelas 8 tentang Struktur Bumi, Dinamika Lempeng Tektonik, dan Mitigasi Bencana Geologis** (khususnya wilayah rawan gempa & lereng gunung berapi).

Platform ini menghadirkan pengalaman belajar bermakna melalui estetika **pixel art game 2D** yang *fun*. Siswa diajak memahami fenomena alam dan kesiapsiagaan bencana secara konkret melalui simulasi interaktif, kuis petualangan, serta penyusunan logika mitigasi aksi-reaksi sederhana (menggunakan blok visual *drag-and-drop* berbahasa ramah anak) dan alat peraga diorama fisik.

> 💡 **Prinsip Edukasi**: Fokus utama RESQ-BOX adalah **penguasaan materi IPA dan pembentukan kesiapsiagaan bencana**. Blok logika *drag-and-drop* serta modul hardware diorama berfungsi murni sebagai **alat bantu manipulatif (learning aids)** agar pembelajaran terasa seru dan mudah dipahami, tanpa membebani siswa dengan istilah teknis pemrograman atau kerumitan elektronika.

### 🎯 Masalah yang Dipecahkan

| Masalah | Solusi RESQ-BOX |
|---|---|
| Materi IPA bumi & bencana sering abstrak dan teoritis | Simulasi visual interaktif bergaya pixel game 2D yang konkret |
| Edukasi mitigasi di sekolah kerap pasif dan membosankan | Skenario tanggap darurat interaktif & misi penyelamatan warga (*Digital Twin*) |
| Logika mitigasi sulit dipraktikkan langsung di kelas | Blok logika *drag-and-drop* berbahasa santun & ramah anak (aksi-reaksi mitigasi) |
| Keterbatasan fasilitas & koneksi internet di daerah rawan | Bekerja 100% luring (*PWA Offline-Ready*) dan didukung diorama fisik interaktif |

---

## ✨ Fitur Utama

### 🌍 Level 1: Earth Explorer — *Earth Dive Vertical Adventure*
Game penjelajahan geologis 2D interaktif menembus interior bumi dari **Permukaan (0 km)** hingga **Pusat Inti Dalam (6.371 km)**, terbagi menjadi **8 zona geologis**: Permukaan Bumi, Kerak Bumi, Mantel Bumi, Inti Luar, Inti Dalam, Batas Divergen, Batas Konvergen, dan Batas Transform.

- **Transformasi RPG Visual Novel & Formasi 5 Karakter Ekspedisi Resmi** — Seluruh area Level 1 dan Level 2 distandarisasi bersama 5 karakter tetap: **Zidane** (analitis & cool), **Zahra** (ceria & gemesin), **Ican** (playful/usil edukatif), **Lintang** (pintar & analitis), dan **Bu Tyas, M.Pd.** (dosen pembimbing & evaluator). Karakter pemegang materi sains dilengkapi *floating badge* 2D pixel **kaca pembesar [🔍]** (kuning emas berdenyut jika belum dibaca, hijau centang jika sudah dibaca). Dilengkapi dialog visual novel dengan potret dada transparan kustom, animasi ketik typewriter, micro-bounce, dan respons percakapan ramah siswa SMP Kelas 8.
- **Burung Hantu Bijak Pemandu "Resqy"** — Maskot pendamping penjelajah 2D pixel art berbentuk burung hantu bijak (*"Kuk-kuuk!"*) yang memberikan pengenalan tim di awal area, memandu siswa mencari rekan bertanda kaca pembesar [🔍], dan mengingatkan evaluasi Bu Tyas di gerbang.
- **Kurikulum & Bahasa Ramah Anak SMP Kelas 8 (Zero Foreign Jargon)** — Seluruh naskah dialog dan materi temuan geologis diringkas padat (1-2 kalimat pendek per balon kata), mudah dipahami, serta 100% bebas dari istilah asing/teknis yang rumit. Soal tebak kata Wordle di akhir tiap area dibuat mudah dan mutlak 100% diambil dari materi yang diajarkan oleh para rekan ekspedisi.
- **Evaluator Tunggal Gerbang: Bu Tyas, M.Pd. & Alur Masuk Portal Murni** — Pembukaan akses gerbang evaluasi di seluruh zona Level 1 (Wordle) dan Level 2 (TTS Crossword) dibina dan diuji langsung oleh **Bu Tyas, M.Pd.**. Jika tantangan evaluasi telah diselesaikan, pemain dapat langsung menekan tombol **ENTER** di portal untuk meluncur ke area selanjutnya tanpa pop-up peringatan; pop-up peringatan hanya muncul jika pemain belum menyelesaikan evaluasi Bu Tyas.
- **Arsitektur Lebar Peta Dinamis (Dynamic Zone Width Engine 2.200 px)** — Engine geologis adaptif yang melepaskan limitasi statis 1.280 px: Area 6 (Batas Divergen) menyajikan rute penjelajahan luas 2.208 px (69 kolom) dengan pergerakan kamera halus (*smooth parallax scrolling*) yang bebas hambatan hingga ke Altar Akhir tempat Komandan Satria (`px: 2060`), Gerbang Wordle (`px: 2110`), dan Portal Turun (`px: 2160`) bersiap.
- **Overhaul Visual Magma Realistis Mengisi Penuh Celah Jurang** — Magma danau vulkanik mengisi penuh rongga jurang dari bibir tebing (`magmaTopY = 375`) hingga dasar terdalam (y = 455) pada seluruh 6 celah retakan. Dilengkapi gradien 6 tahap termal pijar (`#ffffff` hingga `#450a0a`), pulau-pulau kerak basal mengapung, pendaran glow tebing batuan, 6 titik kepulan uap fumarol/abu vulkanik aktif, dan gelembung magma meletup hidup.
- **Modal Temuan Sains Beresolusi Penuh (Full-Sized Illustration Modal)** — Kontainer visualisasi materi temuan geologis berukuran lega (`h-72 sm:h-80` / 288–320 px) tanpa batasan terpotong, menghadirkan modul interaktif Superbenua Pangea 7 lempeng yang dapat disentuh/diklik, peta sabuk pegunungan kembar Appalachian-Caledonian, dan simulator animasi pemekaran lempeng divergen.
- **Arsitektur Ekosistem Batas Konvergen (Area 7: Palung Subduksi & Kerak Samudra Otentik)** — Penjelajahan batas konvergen subduksi lempeng samudra menunjam miring (*subducting slab*) ke bawah kerak benua menembus mantel bumi. Dilengkapi bentang perairan samudra luas dengan navigasi Perahu Riset Oseanografi 2D pixel, palung laut dalam di tengah laut, dermaga pantai pesisir, serta busur pegunungan vulkanik di daratan dengan magma terlindung di dalam kantung dapur magma.
- **Formula Profil Dasar Laut Terpadu & Eliminasi Celah (`getConvergentSeafloorProfile`)** — Standarisasi elevasi matematis kontinu yang menghubungkan dasar laut abisal, lereng palung, dan prisma akresi daratan benua secara mulus dengan fondasi mantel astenosfer solid dari `y = 356`, menjamin 100% tidak ada celah latar belakang yang bocor di antara air dan batuan daratan.
- **Visualisasi Geologis Berlapis Kerak Samudra (*Ophiolite Sequence*)** — Penampang litosfer samudra berstrata otentik: sedimen laut pelagis (*pelagic silt*), basal bantal vulkanik (*pillow basalt*) dengan kubah melengkung dan kaca pendingin vulkanik, kompleks dyke bersusun (*sheeted dykes*), serta gabro berlapis ultra-mafik dengan butiran kristal mineral olivin dan piroksen hijau zamrud (`#0d9488`, `#10b981`) yang realistis dan edukatif.
- **Streamlined Telemetry HUD Terpusat & Zero Tombol Replay** — Bilah telemetri atas dikunci secara matematis di tengah layar (`fixed left-1/2 -translate-x-1/2`) tanpa tergeser resolusi layar, bersih dari tombol replay yang tidak diperlukan, serta air palung jernih bebas dari artefak kotak putih.
- **Arsitektur Batas Transform (Area 8: Patahan San Andreas & POV Top-Down 2D)** — Puncak petualangan Level 1 dengan sudut pandang unik dari atas (*2D Top-Down View*) di padang gurun California yang memperlihatkan dinamika geseran mendatar (*strike-slip*) Lempeng Pasifik (bergerak barat laut) vs Lempeng Amerika Utara (bergerak tenggara). Menampilkan jalan aspal terpotong dan pembelokan sungai Wallace Creek sejauh 130m dengan tekstur poligon kontinu padat (*zero scanline gaps*).
- **Rekahan Gempa Realistis & Fisika Melompati Celah Patahan 3D** — Garis sesar digambar dengan 25 benih rekahan geologis bercabang (*branching fissures*) dengan gradasi jurang hitam pekat dan sorotan batu retak. Bibir celah patahan ($Y = 228..252$) memblokir pergerakan jalan kaki di tanah, mewajibkan pemain melompat menggunakan fisika parabola top-down 3D (`jumpZ`, gravitasi vertikal `jumpZVelocity`, bayangan dinamis mengecil) dengan tombol Spasi atau tombol sentuh `LONCAT`.
- **D-Pad Sentuh 4 Arah & Tombol Aksi Mandiri pada Tablet/Ponsel** — D-Pad berlian 4 arah (Atas, Bawah, Kiri, Kanan) di kiri dan tombol aksi mandiri `LONCAT` & `AKSI [E]` di kanan. Tombol Atas murni menggerakkan karakter ke Utara tanpa melompat, sementara tombol `LONCAT` mengeksekusi lompatan melewati celah.
- **Staf Peneliti Lengkap & Kapsul Evakuasi Kemenangan Akhir Level 1** — Didampingi NPC peneliti yang berdiri aman di tanah padat selatan ($Y = 315$) berdampingan dengan Kapsul Evakuasi Akhir. Evaluasi Wordle akhir (`TRANSFORM`, `SANANDREAS`, `SISMOGRAF`) membuka kapsul untuk menuntaskan ekspedisi Level 1 (skor 100 poin penuh).
- **Anti-Burem Resolusi Tinggi (High-DPI / DevicePixelRatio Scaling)** — Penyesuaian `window.devicePixelRatio` otomatis pada kanvas dan tipografi anti-aliasing tajam menjamin tampilan dan teks tetap razor-sharp saat di-zoom hingga 250% maupun pada layar Retina tablet murid.
- **Continuous Cosine Terrain Engine** — Medan pegunungan, lembah ngarai patahan, jembatan gantung kayu, lorong tambang batuan dalam (*Deep Mining Tunnel*), sel konveksi mantel bumi, lautan logam cair inti luar, istana kristal heksagonal inti dalam, lembah retakan vulkanik divergen Afrika Timur, hingga palung subduksi konvergen samudra dengan fisika lereng mulus (*smooth slope traversal*).
- **Directional Zone Spawning & Penyelarasan Navigasi** — Transisi zona terarah: navigasi **"Turun Menuju Lapisan Selanjutnya"** (Poros Turun Geotermal) memunculkan karakter di sisi kiri area baru menghadap kanan; navigasi **"Naik Menuju Lapisan Sebelumnya"** (Derek Naik Evakuasi) memunculkan karakter di sisi kanan area sebelumnya.
- **Fisika Platform Anti-Tunneling (CCD) & Jembatan Basal** — Menghilangkan bug karakter tembus platform gantung saat jatuh berkecepatan tinggi (`vy >= 6`) melalui *Continuous Collision Detection* lintasan vertikal (`prevY`) dan toleransi tapak kaki lebar (`footMargin = 10`). Elevasi jembatan basal ditinggikan agar menapak kokoh di atas lava.
- **Sistem HP & Ketahanan Karakter** — Indikator darah 100 HP di HUD dengan ikon Pixel Heart. Penalti jatuh ke jurang magma dalam mengurangi 25 HP, memicu ledakan audio, respawn ke titik aman, dan masa kebal 50 frame berkedip.
- **Discovery Points & Animasi Batas Lempeng 2D** — 19 titik eksplorasi sains: komparasi Kerak Benua vs Kerak Samudra, diagram animasi ketiga dinamika lempeng (Divergen, Konvergen subduksi lempeng menunjam, dan Transform sesar geser mendatar), temuan inti dalam (tekanan >3,6 juta atm & altar pusat bumi 6.371 km), serta animasi superbenua Pangea, penampang East African Rift, dan seafloor spreading.
- **Sistem Kristal Energi & Toko Baju Pelindung** — Kristal geologis yang terkumpul dapat ditukarkan di **Toko Baju Pelindung (Suit Merchant)** untuk membuka setelan penjelajah bertingkat (baju termal, elektromagnetik, ekso-suit, dan baju penyelam samudra) yang menjadi syarat melintasi lingkungan ekstrem tiap lapisan.
- **Mode Berenang 4 Arah (Batas Divergen)** — Mode renang penuh dengan daya apung, karakter dan NPC penyelam mengambang di kolom air, serta pembekuan magma di tempat menjadi kerak basal bertingkat termal.
- **Sistem Visual Novel RPG Interaktif (5 Anggota Tim Ekspedisi Resmi)** — Seluruh strata penjelajahan Level 1 dihidupkan oleh formasi 5 karakter resmi (**Zidane, Zahra, Ican, Lintang, dan Bu Tyas**) dengan potret dada 100% transparan kustom, naskah dialog ramah siswa SMP kelas 8 tanpa istilah asing rumit, tutorial burung hantu bijak Resqy (*"Kuk-kuuk!"*), floating badge kaca pembesar [🔍] pada NPC materi edukasi, dan soal evaluasi tebak kata Wordle yang murni diambil dari materi yang diajarkan rekan tim tanpa membocorkan kunci jawaban.
- **Gerbang Evaluasi Wordle Dinamis Bersama Bu Tyas, M.Pd.** — Pembukaan akses turun antar-strata geologis menggunakan tebak kata Wordle interaktif dengan dukungan panjang kata adaptif (`targetWord.length`, ukuran kotak fleksibel `w-9`/`w-8`/`w-7`/`w-6`). Soal gerbang dikawal langsung oleh Bu Tyas, M.Pd. dengan dialog 2 pilihan (siap tantangan vs melihat-lihat materi terlebih dahulu).
- **Multi-User Scoped State & Isolasi Penuh Akun Siswa** — Penyimpanan sesi otomatis terisolasi mutlak per akun siswa (`resqbox_earthdive_progress_${userId}`), menjamin seluruh data kristal, temuan sains, gerbang terbuka, dan koordinat persis karakter per-zona (`zonePositions`) tersimpan aman saat refresh dan mencegah kebocoran status antar-akun.
- **Real-Time Journey Progress Tracker 2D Pixel Art & Preview Avatar** — Bilah pelacak perjalanan retro di bagian bawah layar (*bottom-center*) yang memetakan **8 area geologis** (Permukaan Bumi, Kerak, Mantel, Inti Luar, Inti Dalam, Batas Divergen, Konvergen, dan Transform). Menampilkan fill bar bergradasi warna dinamis, checkpoint berikon pixel art (`mountain`, `pickaxe`, `flame`, `zap`, `crystal`, `divergent`, `convergent`, `transform`), serta miniatur avatar siswa yang meluncur mulus secara real-time (60 FPS) mengikuti koordinat langkah karakter dan membalik hadap kiri/kanan.
- **Header Telemetri Diciutkan (*Collapsible Pill*) di Semua Layar** — Tampilan bilah indikator telemetri di tengah atas layar berbentuk kapsul retro ringkas `[ 📢 TELEMETRI  ▼ ]` di semua ukuran layar (ponsel, tablet, laptop, dan desktop) serta pada Level 1 & Level 2. Keadaan awal disetel terlipat/diciutkan secara default (100% lapang dan estetik). Satu klik membuka panel indikator lengkap (Kedalaman, Tekanan, Suhu, Kristal, Temuan Sains, HP) di bawah garis pembatas secara mulus.
- **Pemutaran Ulang Animasi Dinamis Tektonik Tanpa Mereset Posisi Karakter** — Pada area yang memiliki animasi dinamis lempeng (Batas Divergen / Area 6 & Batas Konvergen / Area 7), animasi selalu diputar ulang dari awal (`progress = 0`) saat halaman di-refresh agar siswa dapat menikmati keagungan fenomena tektonik, sementara posisi horizontal karakter (`initialX`) dan arah hadap tetap melanjutkan titik terakhir tanpa dipaksa kembali ke titik awal area.
- **Desain Responsif Multi-Device & Adaptasi Viewport Tablet** — Skala game dinamis (`getGameScale`), penguncian pergeseran kamera saat layar diperkecil, dan perluasan rendering medan hingga kedalaman $Y=1600$ menjamin daratan selalu mengisi penuh kanvas tanpa celah atau latar terpotong saat di-*zoom-out*.
- **Sistem Kostum Adaptif Karakter Pemain & NPC Berdasarkan Zona** — Pakaian karakter pemain dan seluruh NPC secara otomatis berganti sesuai karakteristik ekstrem lingkungan lapisan bumi: di Kerak Bumi mengenakan rompi keselamatan tambang oranye beserta helm proyek berlampu senter kepala; di Mantel Bumi, Inti Luar, dan Inti Dalam mengenakan baju pelindung masa depan tahan panas (*futuristic cryo-exosuit*) dengan helm titanium tertutup dan kaca visor HUD neon cyan; sedangkan di Permukaan Bumi dan area batas lempeng tetap memakai pakaian normal.
- **Rekonstruksi Geologi Murni Interior Bumi & Eliminasi Obstruksi Visual** — Kerak Bumi diperkaya fosil ammonite/trilobita di dinding batuan dan animasi pekerja tambang mengayun beliung (*pickaxe*) dengan percikan api; Mantel Bumi menampilkan samudra magma silikat cair penuh berarus konveksi; Inti Luar menampilkan fluida logam cair nikel-besi mendidih bercahaya emas terang dengan efek kurva medan magnet bumi dipole (*geomagnetic dipole flux loops*); serta Inti Dalam menyajikan lantai 100% datar sempurna ($y = 350$) berwarna kuning keemasan bola besi padat.

### 🌋 Level 2: Disaster Analyst — *Mitigasi Gempa Bumi & Erupsi Merapi*
Game penjelajahan 2D mitigasi kebencanaan geologis yang menghubungkan dinamika batas lempeng bumi dengan kesiapsiagaan gempa bumi dan erupsi vulkanik. Terdiri dari **6 area mitigasi sekuensial**:

1. **Area 1: Ruang Kelas SMP (Mitigasi Prabencana Gempa)** — Ekosistem NPC siswa & guru, papan tulis `IPA: STRUKTUR BUMI`, tiga pilar mitigasi (Prabencana / Saat Gempa / Pascabencana), poster SOP Tas Siaga Bencana 72 Jam, dan evaluasi TTS pertama.
2. **Area 2: Simulasi Tanggap Gempa (Drill Drop-Cover-Hold On)** — Kurikulum IPA struktur lapisan bumi, pacing tremor pra-alert, cutscene gempa 10 detik dengan QTE merunduk di kolong meja, animasi batu runtuh, preserves 16 murid kelas yang konsisten, dan rambu resmi jalur evakuasi standar K3/BNPB.
3. **Area 3: Lapangan Evakuasi Sekolah (Pascabencana Gempa)** — Titik kumpul berambu resmi standar BNPB, ambulans medis menapak tanah, posko pertolongan medis, rumput lapangan statis anti-jitter, briefing otomatis maskot Resqy, dan evaluasi TTS bersama Komandan Satria.
4. **Area 4: Pos Pengamatan Merapi (Prabencana Erupsi)** — Bangunan Pos PGA, seismograf vektor edukatif dengan gelombang seismogram 4 status, papan status PVMBG (Normal / Waspada / Siaga / Awas), peta zonasi KRB Merapi, dan gapura Destana.
5. **Area 5: Simulasi Erupsi Merapi** — Skenario ganda (letusan **Eksplosif** vs **Efusif**), tiang sirine EWS, migrasi satwa liar, letusan balistik & awan panas *wedhus gembel*, mekanik evakuasi warga mengikuti pemain menuju truk evakuasi resmi BPBD/BNPB, serta timer 15 detik dengan modal kegagalan & retry.
6. **Area 6: Barak Pengungsian & Pemulihan (Pascabencana Erupsi)** — Barak pengungsian terpadu, penanganan timbunan abu vulkanik, sanitasi air bersih & posko medis, logistik pengungsian, dan evaluasi TTS akhir penuntas Level 2.

- **Sistem Kristal Kumulatif (Total 21 Kristal)** — Setiap area mitigasi memiliki kristal geologisnya sendiri (total 21 kristal se-Level 2). HUD atas menampilkan perolehan kumulatif yang persisten.
- **Balon Kata (Speech Bubble) Catatan Geologis Proksimitas** — Papan informasi catatan geologis (`info_sign`) memunculkan balon kata melayang tepat di atas tiang tanda saat karakter mendekat (`dist < 50px`), dan menghilang otomatis saat karakter menjauh tanpa memblokir layar.
- **Counter Temuan Geologis Header Real-Time** — Sinkronisasi pemetaan ID temuan geologis antara engine dan data katalog menyajikan penghitungan titik temuan sains aktif (`X / total`) pada header HUD secara real-time.
- **Rekonstruksi Superbenua Pangea Presisi** — Temuan sains interaktif 2D pixel art superbenua Pangea 250 juta tahun lalu: bebas dari distorsi poligon belah ketupat, kurva tanduk Eurasia melengkung mulus alami, serta lekukan garis pantai timur laut Brasil yang mengunci presisi ke Teluk Guinea Afrika (*jigsaw puzzle fit*).
- **Titik Temuan Bukti Geologis Otentik** — Menampilkan visualisasi rantai pegunungan kembar (Appalachian Mountains di Amerika Utara dan Caledonian Mountains di Britania/Skandinavia) serta pemekaran kerak litosfer di atas astenosfer tanpa semburan magma yang mengaburkan materi sains.
- **3 Kanvas Bentang Alam Mandiri 2D Retro Pixel** — Tiga ilustrasi mandiri beresolusi penuh yang berganti dinamis melalui tab switcher anti-clipping:
  - *Palung Laut Dalam*: Kapal riset permukaan dengan derek (*crane*), dinding jurang ngarai basalt curam, kapal selam riset kuning berlampu sorot ganda yang menerangi jurang abisal, mistar kedalaman 0–11.000 m (*Challenger Deep*), komparasi siluet Gunung Everest terendam >2.000 m di bawah laut, serta siluet paus sperma dan anglerfish.
  - *Pegunungan Lipatan*: Puncak salju megah, hutan pinus kaki bukit, penampang lipatan batuan sedimen/granit, panah kompresi horizontal (`➡ TEKANAN ⬅`), serta struktur Antiklin & Sinklin.
  - *Busur Gunung Berapi*: Kerucut stratovolcano Merapi aktif, kaldera magma, aliran lereng, kolom abu *wedhus gembel*, slab menunjam meleleh di mantel, dan dapur magma (*magma chamber*) raksasa.
- **Ilustrasi Edukasi Erupsi Merapi Berbasis Foto Nyata** — Modul ilustrasi 4 tab (APD, Awan Panas, Zonasi KRB Merapi) yang dilengkapi foto nyata *wedhus gembel* beserta badge atribusi sumber yang dapat diklik, panel teks materi, dan modal Lightbox fullscreen.
- **Peringkasan Materi Ramah Siswa SMP Kelas 8** — Uraian temuan geologis disajikan dalam format 3 kotak poin mini berikon (proses pembentukan, karakteristik/kedalaman, dan fakta geologi di Indonesia) serta papan catatan geologis 2 kalimat padat tanpa dinding teks membosankan.
- **Gerbang Teka-Teki Silang (Crossword Puzzle) Mandiri Tanpa Cheat** — Syarat membuka portal antar-area mitigasi menggunakan grid teka-teki silang interaktif bergaya retro dengan penyorotan ubin aktif dan audio chiptune 8-bit. Tombol bantuan siaga / cheat dieliminasi demi integritas asesmen formatif.
- **Animasi Jet Booster Biru Lompatan Ganda** — Menampilkan semburan api roket pendorong jet biru (`#00e5ff`), inti putih (`#ffffff`), partikel percikan plasma (`#38bdf8`), dan pendaran cahaya pijakan saat karakter melakukan double jump di Level 2, persis identik dengan Level 1.
- **Modal Kemenangan Akhir Tektonik (`TectonicVictoryModal.tsx`)** — Modal selebrasi megah serasi dengan Level 1: piala pixel emas berkilau `<PixelTrophy>`, status pill hijau `EKSPEDISI TUNTAS!`, lencana master mitigasi, kristal terkumpul, kartu narasi jembatan kausalitas menuju Level 3, serta tombol navigasi langsung ke Level 3 atau Menu Utama.
- **Sinkronisasi Skoring Bertingkat Posko Guru** — Nilai Level 2 terintegrasi ke Supabase dan Dashboard Guru secara bertahap per area mitigasi hingga **100 Poin tuntas**, yang sekaligus membuka Level 3.
- **Top HUD Serasi & Zero-Emoji Standard** — Tata letak bilah status atas diselaraskan 100% dengan Level 1: tombol papan kayu `< MENU` langsung kembali ke `/` (beranda), tombol audio SFX, tombol Layar Penuh (⛶), badge pill nama area, serta pill status kristal & HP bar. Bersih dari emoji OS native melalui komponen kustom `PixelIcon`.
- **Real-Time Journey Progress Tracker 2D Pixel Art (6 Area Mitigasi)** — Bilah pelacak perjalanan retro di bagian bawah layar (*bottom-center*) yang memetakan **6 area mitigasi bencana** (Ruang Kelas Teori, Drill Gempa, Lapangan Evakuasi, Pos PGA Merapi, Simulasi Erupsi Merapi, dan Barak Pengungsian BNPB). Dilengkapi ikon pixel tematik (`book`, `earthquake`, `runner`, `seismogram`, `volcano`, `tent`), status checkpoint dinamis, serta preview avatar siswa yang meluncur real-time mengikuti langkah karakter di peta.
- **Proteksi Penguncian Level 3 & Auto-Save Terisolasi** — Level 3 dijamin tetap terkunci di beranda hingga seluruh **6 area Level 2** tuntas diselesaikan. Progres tersimpan otomatis per akun siswa (`resqbox_level2_progress_${userId}`) sehingga posisi karakter, kristal terkumpul, dan gerbang teka-teki tetap aman saat browser di-refresh.

### 🎮 Level 3: Simulation Game (Simulasi Aksi & Digital Twin)
- **Mission Center** — **20 level misi mitigasi terpandu** dalam 4 sektor tematik (Fondasi EWS & Seismik, Mitigasi Gempa Sekolah & Rumah, Vulkanologi & Erupsi Merapi, Jalur Evakuasi & Grand Challenge). Contoh misi: *"Jika sensor getaran mendeteksi gempa ➔ Nyalakan sirine & buka gerbang evakuasi"*.
- **Action Lab (Blockly)** — Workspace blok visual yang menggunakan bahasa sehari-hari ramah anak SMP (tanpa syntax error dan tanpa kode rumit), dilengkapi panduan lokasi kategori toolbox pada setiap misi.
- **Evacuation Game (Digital Twin)** — Peta simulasi interaktif di mana warga digital (NPC) merespons langsung aksi mitigasi yang dirancang siswa. Simulasi bencana dibatasi 20 detik dengan hitung mundur, dan dampak kerusakan lingkungan tetap terlihat setelahnya (tombol `Reset Kondisi` untuk mengembalikan peta).
- **My Projects** — Ruang eksplorasi bebas bagi siswa untuk merancang sistem keselamatan impian mereka.

### 🏫 Posko Guru & Manajemen Kelas (Teacher Dashboard)
- **Portal Akses Guru (`/teacher`)** — Dasbor komando khusus guru untuk memantau kemajuan belajar siswa secara *real-time* (realtime aktif untuk siswa baru).
- **Monitoring Multi-Level & Skoring Dinamis** — Memantau capaian belajar Level 1 (skor bertahap hingga 100 poin, kristal, kata kunci), Level 2 Disaster Analyst (progres per area mitigasi hingga 100 Poin), dan Level 3 (badge `[ PROGRES ]` / `[ TUNTAS ]` beserta rasio misi selesai `X / 20`).
- **Standarisasi Status Ketuntasan Ketat** — Status `[ TUNTAS ]` mutlak memerlukan skor 100 poin penuh. Skor parsial konsisten berstatus `[ PROGRES ]` dengan perolehan skor riil. Menghilangkan label hardcoded 'Sedang disusun'.
- **Tata Letak Chip Level Anti-Wrap** — Badge level aktif (`LEVEL 1`, `LEVEL 2`, `LEVEL 3`) tampil rapi satu baris tanpa patah ke bawah melalui format inline-block dengan non-breaking space Unicode.
- **Filter Kelas & Level Dinamis** — Mendukung pengelompokan kelas otomatis serta filter level aktif (`SEMUA`, `LV.1`, `LV.2`, `LV.3`) secara *real-time*.
- **Ekspor Nilai CSV & Cetak Lembar Rapor Siswa** — Fitur unduh rekap nilai format CSV dan cetak lembar rapor individual siswa lengkap dengan capaian strata bumi, batas lempeng tektonik, skor simulasi Level 3, beserta catatan evaluasi guru.
- **Isolasi Data Antar-Guru** — Setiap guru hanya dapat melihat dan mengelola kelas yang diampu. Kepemilikan kelas ditegakkan di tiga lapis: baris `classrooms` (kode kelas sebagai PRIMARY KEY), kebijakan Row Level Security, dan pemeriksaan kepemilikan di dalam setiap fungsi database. Kode kelas dibuat oleh server sehingga dijamin unik.

### 🔐 Sistem Akun & Keamanan Siswa
- **Akun Dibuat oleh Guru** — Demi tertib administrasi dan pencegahan akun ganda, **pendaftaran mandiri sudah ditutup**. Guru membuatkan akun siswa (nama, nomor absen, username, kata sandi) melalui Posko Guru, lalu siswa masuk memakai kredensial tersebut.
- **Identitas Unik Kode Kelas + Nomor Absen** — Satu siswa = satu kombinasi kode kelas dan nomor absen, sehingga tidak ada nomor absen kembar di dalam satu kelas.
- **Mode Tamu (Coba Tanpa Login)** — Guru penilai, orang tua, atau siswa yang belum punya akun dapat mencoba seluruh Level 1–3 tanpa membuat akun. Kemajuan tamu tersimpan di perangkat sendiri dan **tidak pernah masuk ke rapor guru**; penjaganya dipasang di lapisan klien database sehingga berlaku untuk seluruh aplikasi.
- **Ganti Password Mandiri** — Siswa dapat memperbarui kata sandi secara aman melalui modal Pengaturan Profil Siswa (`/profile`), memakai `supabase.auth.updateUser()` (hash bcrypt di server). Kata sandi tidak lagi disimpan sebagai teks terbuka.
- **Proteksi Rute Cepat** — Pengguna yang belum login otomatis diarahkan langsung ke portal login (`/login`).
- **Kebijakan Privasi Publik** — Halaman `/privacy` dapat dibuka tanpa login agar sekolah dan orang tua dapat memeriksa penanganan data siswa.

### 🧩 Smart Education Board (Alat Peraga Fisik)
Diorama fisik interaktif (miniatur lereng gunung, sirine, lampu jalur aman, dan simulasi getaran) yang terhubung langsung dengan aplikasi web. Berfungsi sebagai **alat peraga nyata (tangible learning tool)** agar siswa dapat melihat dan merasakan langsung hasil simulasi aksi penyelamatan yang mereka atur di layar. Koneksi ke papan diorama memakai Web Serial API (USB) atau WebSocket (WiFi ke ESP32).

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| **Frontend** | React 19 + TypeScript 6 |
| **Build Tool** | Vite 8 |
| **Styling** | Tailwind CSS 4 + Vanilla CSS Design System |
| **State** | Zustand 5 (Multi-Store Architecture) |
| **Database, Auth & Otorisasi** | Supabase (PostgreSQL + Supabase Auth + Row Level Security) |
| **Fallback Luring** | LocalStorage + BroadcastChannel (Offline-Ready) |
| **Block Editor** | Google Blockly 12 (generator Arduino C + runtime JavaScript) |
| **Routing** | React Router DOM 7 |
| **3D / Digital Twin** | Three.js 0.186 (model STL terrain Merapi) |
| **Icons** | Custom 2D Pixel Icons (100% SVG, Zero-Emoji) |
| **Audio** | Web Audio API — sintesis chiptune 8-bit mandiri (`retroAudio.ts`) |
| **PWA** | Vite Plugin PWA (service worker `autoUpdate`, precache selektif) |
| **Observabilitas** | Sentry (Store Endpoint) + Web Vitals, dengan penyuntingan data pribadi |
| **Aplikasi Native** | Capacitor 8 (Android `.apk`) & Electron (desktop `.exe`) |
| **Hosting** | Cloudflare Pages (`dist/` statis + `public/_headers`) |

> **Catatan arsitektur:** tidak ada server aplikasi sendiri. Seluruh otorisasi
> ditegakkan **Row Level Security di database**, bukan di peramban. Backend
> Laravel lama sudah dihapus dan tidak pernah dirujuk dari kode.

---

## 📁 Struktur Proyek

```
RESQ-BOX/
├── src/
│   ├── app/                        # Halaman & komponen utama
│   │   ├── AppLayout.tsx           # Layout utama (Zero-Header Viewport)
│   │   ├── Dashboard/              # Beranda (Hero Volcano Pixel Art) + papan PANDUAN & MISI
│   │   ├── Level1/                 # Earth Explorer
│   │   │   ├── EarthDive/          # Engine petualangan vertikal 2D (8 zona)
│   │   │   │   ├── EarthDiveGame.tsx       # Loop utama & manajemen modal
│   │   │   │   ├── TelemetryHUD.tsx        # HUD kedalaman, strata, kristal & HP
│   │   │   │   ├── DiscoveryModal.tsx      # Modal temuan sains (19 titik)
│   │   │   │   ├── CoreChallengeModal.tsx  # Tantangan inti / Wordle 5 kata
│   │   │   │   ├── VisualNovelDialogue.tsx # Dialog RPG visual novel retro
│   │   │   │   ├── SuitMerchantModal.tsx   # Toko baju pelindung berbasis kristal
│   │   │   │   ├── PlateBoundaryStatus.tsx # Status batas lempeng
│   │   │   │   ├── dialogueData.ts         # Naskah dialog ramah siswa SMP
│   │   │   │   ├── earthDiveData.ts        # Database kurikulum geologi
│   │   │   │   └── engine/                 # Physics & canvas renderer
│   │   │   │       ├── zones.ts            # Profil medan kontinu 8 zona
│   │   │   │       ├── gameEngine.ts       # Core loop & directional spawn
│   │   │   │       ├── player.ts           # Fisika lereng, lompat 3D & kontrol
│   │   │   │       ├── renderer.ts         # Kamera presisi, High-DPI, render pipeline
│   │   │   │       ├── sprites.ts          # Pixel art sprites, rekahan sesar & bg
│   │   │   │       │   └── sprites/        # Modul sprite terpecah (objek, tumbuhan, dll.)
│   │   │   │       ├── npcSprites.ts       # Sprite pixel peneliti & komandan
│   │   │   │       ├── npcPortraits.ts     # Potret dada transparan untuk dialog
│   │   │   │       └── npcManager.ts       # Lifecycle NPC & anchoring tanah
│   │   │   ├── Wordle/                     # Evaluasi tebak kata sains adaptif
│   │   │   └── PixelEarthDiagram.tsx       # Radar irisan 3D bumi
│   │   ├── Level2/                 # Disaster Analyst (6 area mitigasi)
│   │   │   ├── level2Data.ts       # Kurikulum & temuan mitigasi
│   │   │   ├── level2Sync.ts       # Sinkronisasi skor Level 2 ke Posko Guru
│   │   │   ├── dialogueDataL2.ts   # Naskah dialog Level 2
│   │   │   ├── CrosswordModal.tsx  # Evaluasi TTS per area
│   │   │   ├── DiscoveryModal.tsx  # Modal temuan sains Level 2
│   │   │   ├── SeismographModal.tsx        # Modal seismograf PGA
│   │   │   ├── VolcanoPhaseModal.tsx       # Modal status/fase Merapi
│   │   │   ├── VolcanoRescueFailedModal.tsx# Modal gagal evakuasi + retry
│   │   │   ├── TectonicVictoryModal.tsx    # Modal kemenangan Level 2
│   │   │   ├── MiniChallengeModal.tsx      # Kuis mini
│   │   │   ├── VisualNovelDialogueL2.tsx   # Dialog RPG Level 2
│   │   │   ├── ilustrasi/          # Ilustrasi pixel (lempeng, gempa, gunung-api)
│   │   │   └── engine/             # Engine 2D Level 2
│   │   │       ├── TectonicGame.tsx # Komponen game & state
│   │   │       ├── gameEngine.ts    # Core loop, gerbang & dialog
│   │   │       ├── zones.ts         # Profil medan 6 area
│   │   │       ├── renderer.ts      # Render pipeline
│   │   │       ├── sprites.ts       # Sprite & NPC
│   │   │       ├── npcManagerL2.ts  # Lifecycle NPC Level 2
│   │   │       ├── npcSpritesL2.ts  # Sprite NPC Level 2
│   │   │       ├── player.ts        # Fisika & kontrol
│   │   │       └── draw/            # Modul gambar per lokasi (base, volcano, assembly,
│   │   │                            #   classroom, overlay, merapi, locations)
│   │   ├── Level3/                 # Simulation Game (20 misi, 4 sektor)
│   │   │   ├── index.tsx           # Peta misi ekspedisi
│   │   │   └── level3Sync.ts       # Sinkronisasi progres misi ke Posko Guru
│   │   ├── Workspace/              # Action Lab (Blockly)
│   │   │   ├── BlockEditor/        # Editor blok Blockly + toolbox
│   │   │   ├── MissionPanel.tsx    # Panel panduan misi
│   │   │   ├── TelemetrySidePanel.tsx # Panel telemetri sensor & aktuator
│   │   │   └── ConsoleOutput.tsx   # Console log output
│   │   ├── EvacuationGame/         # Digital Twin
│   │   │   ├── EvacuationCanvas.tsx # Canvas 2D NPC
│   │   │   ├── Merapi3DScene.tsx    # Scene 3D terrain STL Merapi
│   │   │   ├── merapi3DData.ts      # Data koordinat & aset 3D
│   │   │   ├── merapiCurvedMapData.ts # Data peta lengkung
│   │   │   ├── mapData.ts           # Data tile peta
│   │   │   └── engine/              # NPC & navigasi (npc.ts, pathfinder.ts)
│   │   ├── TeacherDashboard/       # Posko Guru (/teacher & /guru)
│   │   ├── Login/                  # Halaman masuk + mode tamu
│   │   ├── Profile/                # Bengkel avatar & keamanan akun
│   │   ├── Privacy/                # Kebijakan privasi publik (/privacy)
│   │   ├── Credits/                # Halaman kredit tim
│   │   ├── NotFound/               # Halaman 404
│   │   └── components/             # Komponen UI bersama (mis. TombolLanjutHp, PWABadge)
│   │
│   ├── components/                 # Komponen lintas halaman
│   │   ├── PixelIcon.tsx           # 93 ikon 2D pixel art SVG kustom
│   │   ├── PixelTrophy.tsx         # Piala pixel
│   │   ├── PixelAvatar/            # Generator & kustomisasi avatar siswa
│   │   ├── ResqyMascot.tsx         # Maskot burung hantu Resqy
│   │   ├── JourneyProgressTracker.tsx # Pelacak perjalanan (Level 1 & 2)
│   │   ├── AppErrorBoundary.tsx    # Pemulihan kegagalan seluruh aplikasi
│   │   └── Tutorial/               # Panduan onboarding Resqy (9 rute)
│   │
│   ├── engine/
│   │   ├── blockly/                # Blok kustom, tema, generator Arduino C & JS
│   │   │   ├── blocks/core.ts      # Definisi & generator blok RESQ
│   │   │   ├── arduinoGenerator.ts # Generator kode Arduino C
│   │   │   ├── jsGenerator.ts      # Generator kode JS (simulator)
│   │   │   └── theme.ts            # Tema visual Blockly
│   │   └── codeSanitizer.ts        # Sanitasi kode sebelum dijalankan
│   │
│   ├── missions/
│   │   ├── data/missions.ts        # 20 misi mitigasi (4 sektor × 5 level)
│   │   └── engine/validationEngine.ts # Validasi susunan blok misi
│   │
│   ├── store/                      # Zustand state management
│   │   ├── teacherStore.ts         # Auth + level unlock + classroom + siswa
│   │   ├── missionStore.ts         # Progress misi Level 3
│   │   ├── workspaceStore.ts       # Draft workspace & proyek
│   │   └── runtimeStore.ts         # Status pin & nilai sensor (digital twin)
│   │
│   ├── utils/
│   │   ├── supabaseClient.ts       # Klien Supabase, auth, RPC & cache lokal
│   │   ├── guestMode.ts            # Penjaga "tamu tidak menyentuh database"
│   │   ├── retroAudio.ts           # Sintesis audio 8-bit
│   │   ├── monitoring.ts           # Pelaporan error + Web Vitals (dengan redaksi)
│   │   ├── redact.ts               # Penyuntingan data pribadi sebelum dikirim
│   │   ├── dataSaver.ts            # Mode hemat data
│   │   ├── webSerial.ts            # Jembatan Web Serial / WebSocket ke ESP32
│   │   ├── studentAvatarSheet.ts   # Lembar sprite avatar siswa
│   │   ├── lingkungan.ts           # Deteksi kondisi jaringan/perangkat
│   │   ├── keyboard.ts             # Pemetaan tombol
│   │   └── fullscreen.ts           # API layar penuh
│   │
│   ├── i18n/                       # Kamus bahasa (dipakai halaman privasi)
│   ├── hooks/                      # Hook bersama (mis. useUkuranKanvas)
│   └── assets/                     # Aset gambar statis
│
├── public/                         # Aset publik, manifest PWA, _headers, terrain STL
├── supabase/                       # Migrasi SQL, uji isolasi, skrip diagnosa
├── capacity/                       # Model kapasitas & load test
├── scripts/                        # Pemeriksa otomatis & alat ukur
├── android/                        # Proyek Capacitor (APK)
├── electron/                       # Pembungkus desktop (.exe)
├── program_esp/                    # Firmware ESP32 untuk papan diorama
├── vite.config.ts                  # Konfigurasi Vite + PWA
├── capacitor.config.ts             # Konfigurasi Capacitor
└── package.json
```

---

## 🚀 Cara Menjalankan

### Prasyarat
- **Node.js** ≥ 20
- **Git**

### 1. Clone Repository

```bash
git clone https://github.com/zidan-cmiw/resq-box.git
cd RESQ-BOX
```

### 2. Siapkan Environment

```bash
cp .env.example .env
```

Isi `.env` dengan kredensial proyek Supabase Anda (hanya dua nilai, keduanya aman dipublikasikan karena memang dipakai peramban):

```
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

> 🔒 **JANGAN pernah menaruh `service_role` key di `.env` atau di kode frontend.**
> Kunci itu melewati seluruh Row Level Security. `.env` sudah masuk `.gitignore`.

### 3. Jalankan

```bash
npm install
npm run dev
```

Akses di `http://localhost:5173/`

### 4. Perintah Penting Lainnya

| Perintah | Kegunaan |
|---|---|
| `npm run build` | Type-check + build produksi ke `dist/` |
| `npm run typecheck` | `tsc -b` saja |
| `npm run lint` | ESLint |
| `npm test` | Uji unit (privasi & mode hemat data) |
| `npm run test:sql` | Validasi sintaks & variabel migrasi SQL |
| `npm run cek:semua` | Rangkaian pemeriksa otomatis penuh (keamanan, akses, tata letak, dll.) |
| `npm run android:sync` | Build web + salin ke proyek Android |
| `npm run desktop:build` | Bangun aplikasi desktop `.exe` |

---

## 🎨 Desain & Estetika (2D Retro Pixel Game Viewport)

RESQ-BOX mengadopsi estetika **2D Retro Pixel Art Game** yang imersif dan ramah anak:

- **Tanpa Header Bawaan (Pure Full-Screen Viewport)**: Menghilangkan bilah navigasi atas konvensional. Seluruh interaksi menggunakan tombol papan kayu retro terintegrasi di dalam dunia visual.
- **Tipografi**: `'Press Start 2P'` untuk judul, tombol aksi, dan badge; `'Pixelify Sans'` untuk teks formulir dan bacaan; `'JetBrains Mono'` untuk kode.
- **Adegan Pixel SVG Dinamis**:
  - *Daytime Volcano Scene (Beranda)*: Gunung api pixel animasi, semburan lava pijar berdenyut, partikel asap, awan bergerak, dan lentera kayu.
  - *Nighttime Starry Rescue Camp (Profil)*: Langit malam berbintang kelap-kelip, bulan kawah pixel, dan siluet pohon pinus.
  - *Sunset Golden Mountain (Credits)*: Gradien senja keemasan, siluet perbukitan gelap, dan kunang-kunang bara api.
- **Papan Kayu & Tombol 3D (`.pixel-wood-board` & `.pixel-btn-wood-plank`)**: Tekstur serat kayu berukir retro dengan sudut paku besi dan animasi penekanan tombol 3D.
- **Web Audio 8-Bit Chiptune SFX**: Efek suara sintetis retro murni (Select, Hover, Unlock, Error, Explosion, Win) tanpa file audio eksternal.
- **Layar Penuh Proyektor (Fullscreen ⛶)**: Fitur layar penuh satu klik yang memudahkan guru menampilkan media ke proyektor kelas.

Lihat [design.md](./design.md) untuk pedoman desain lengkap.

---

## 📊 Sistem Progression

```
Level 1: Earth Explorer (Earth Dive) — 8 zona geologis, total 100 Poin
    │
    ├── Area 1: Permukaan Bumi (0 km) ─────── Poros Turun Geotermal
    ├── Area 2: Kerak Bumi ────────────────── Kerak Benua vs Samudra & Wordle
    ├── Area 3: Mantel Bumi ───────────────── Arus Konveksi & Wordle
    ├── Area 4: Inti Luar ─────────────────── Logam Cair & Medan Magnet
    ├── Area 5: Inti Dalam ────────────────── Bola Besi Padat & Wordle
    ├── Area 6: Batas Divergen ────────────── Peta 2.200 px, Pangea & Rift Afrika
    ├── Area 7: Batas Konvergen ───────────── Subduksi, Palung & Busur Api
    └── Area 8: Batas Transform ───────────── Sesar San Andreas (Top-Down) & Kapsul
                                              │
                                         🔓 UNLOCK
                                              │
Level 2: Disaster Analyst — 6 area mitigasi, total 100 Poin ▼
    │
    ├── Area 1: Ruang Kelas SMP ───────────── SOP 72 Jam TSB & TTS
    ├── Area 2: Simulasi Tanggap Gempa ────── Drill Drop-Cover-Hold On (QTE)
    ├── Area 3: Lapangan Evakuasi ─────────── Titik Kumpul, Medis & TTS
    ├── Area 4: Pos Pengamatan Merapi ─────── Seismograf, Status PVMBG & KRB
    ├── Area 5: Simulasi Erupsi Merapi ────── Eksplosif/Efusif & Evakuasi Truk BPBD
    └── Area 6: Barak Pengungsian ─────────── Abu Vulkanik, Sanitasi & TTS Akhir
                                         ★ Kapsul Evakuasi + Piala Kemenangan ★
                                              │
                                         🔓 UNLOCK (100 Poin)
                                              │
Level 3: Simulation Game (Mitigasi Bencana)  ▼
    │
    ├── Mission Center (20 misi dalam 4 sektor tematik)
    ├── Action Lab Blockly (Logika aksi-reaksi keselamatan)
    ├── Evacuation Digital Twin (Respon pergerakan warga NPC, 20 detik)
    └── My Projects (Ruang kreasi bebas sistem mitigasi)
```

---

## 🌐 Deployment & Offline

- **Platform**: Cloudflare Pages (frontend statis). Header keamanan diatur lewat
  `public/_headers` (CSP, HSTS, `X-Frame-Options: DENY`, `Referrer-Policy`, cache
  immutable untuk berkas ber-hash).
- **Database & Auth**: Supabase (Postgres + Auth + Row Level Security). Tidak ada
  server aplikasi sendiri — seluruh otorisasi ditegakkan RLS di database.
- **PWA**: Service worker aktif dengan `autoUpdate` — aplikasi bekerja offline
  setelah pemuatan pertama, dan versi baru langsung menggantikan versi lama.
- **Cache**: Aset ber-hash di-cache selamanya (`immutable`); `index.html` dan
  `sw.js` selalu diperiksa ulang.
- **State**: Progress disimpan di localStorage, tersinkronisasi ke Supabase saat online.
- **Mode Hemat Data**: Tersedia untuk sekolah berkuota terbatas — scene 3D tidak dimuat sama sekali.

> **Catatan hosting:** Vercel tidak dipakai karena seluruh domain `vercel.app`
> diblokir di jaringan kampus (DNS dijail ke `127.0.0.1`), sehingga aplikasi
> tidak dapat dibuka dari sana. Bila memindahkan hosting lagi, **uji dulu dari
> jaringan tempat aplikasi akan dipakai**.

---

## 📱 Aplikasi Android & Desktop

Selain diakses lewat peramban, RESQ-BOX juga dapat dipasang sebagai aplikasi:

- **Android (`.apk`)** — dibungkus dengan Capacitor. Lihat [ANDROID.md](./ANDROID.md).
- **Desktop Windows (`.exe`)** — dibungkus dengan Electron, server internal
  di-bind ke `127.0.0.1`. Lihat [DESKTOP.md](./DESKTOP.md).

> Aplikasi native tersedia karena di beberapa sekolah jaringan WiFi tidak stabil
> saat seluruh kelas membuka web secara bersamaan. Panduan lengkap pembangunan
> dan pemasangannya ada di dua berkas di atas.

---

## 👥 Tim RESQ-TEAM (LIDM 2026)

| Nama | Peran & Tanggung Jawab |
|---|---|
| **Muhammad Zidane Romadhona Haryanto** | Ketua Tim & Developer Utama (Arsitektur Aplikasi, Simulasi & Fullstack) |
| **Ichsan Abror** | Hardware Engineer (Rancang Bangun Perangkat & Sensor Kebencanaan) |
| **Zahra Rokhadatul Aisy Ramadhani** | UI/UX Designer & Asisten Developer (Desain Antarmuka Pixel Art & Asisten Teknis) |
| **Lintang Pansavia Lysandra** | Penyusun Materi IPA & Manajemen Laporan (Kurikulum Kebencanaan & Dokumentasi Proyek) |
| **Rizki Arumning Tyas, M.Pd.** | Dosen Pendamping Inovasi Pembelajaran Digital Mitigasi Bencana • Universitas Negeri Yogyakarta |

---

## 📄 Dokumen Terkait

- [`Dashboard.md`](./Dashboard.md) — Central Knowledge Base & Project Dashboard (Obsidian MOC)
- [`PRD.md`](./PRD.md) — Product Requirement Document
- [`design.md`](./design.md) — Design System & Visual Guidelines
- [`progress_report.md`](./progress_report.md) — Laporan Progres Pengembangan
- [`walkthrough.md`](./walkthrough.md) — Walkthrough & Panduan Pengujian Sistem
- [`LKPD_PJBL_RESQ_BOX_5_KELOMPOK.md`](./LKPD_PJBL_RESQ_BOX_5_KELOMPOK.md) — Panduan Implementasi 2 Pertemuan & LKPD PjBL
- [`ANDROID.md`](./ANDROID.md) / [`DESKTOP.md`](./DESKTOP.md) — Panduan aplikasi native
- [`agent.md`](./agent.md) — Pedoman kerja asisten pengembang AI

> **Catatan:** `docs/` (runbook, panduan deploy, panduan akun guru) dan
> `lampiran-buku/` (naskah buku panduan cetak) sengaja **tidak diunggah** ke
> GitHub karena bersifat internal. Berkasnya tetap tersimpan di komputer
> pengembang.

---

## 📝 Lisensi

Proyek ini dikembangkan untuk keperluan kompetisi **LIDM 2026** — Divisi Inovasi Pembelajaran Digital Pendidikan.

---

<div align="center">

**RESQ-BOX** — *Belajar Mitigasi Bencana, Seru Seperti Bermain Game* 🎮🌋

</div>
