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

Platform ini menghadirkan pengalaman belajar bermakna melalui estetika **pixel art game 2D** yang *fun*. Siswa diajak memahami fenomena alam dan kesiapsiagaan bencana secara konkret melalui simulasi interaktif, kuis petualangan, serta penyusunan logika mitigasi aksi-reaksi sederhana (menggunakan blok *drag-and-drop* berbahasa ramah anak) dan alat peraga diorama fisik.

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
Game penjelajahan geologis 2D interaktif menembus interior bumi dari **Permukaan (0 km)** hingga **Pusat Inti Dalam (6.371 km)**:
- **Transformasi RPG Visual Novel & Formasi 5 Karakter Ekspedisi Resmi** — Seluruh area Level 1 dan Level 2 distandarisasi bersama 5 karakter tetap: **Zidane** (analitis & cool), **Zahra** (ceria & gemesin), **Ican** (playful/usil edukatif), **Lintang** (pintar & analitis), dan **Bu Tyas, M.Pd.** (dosen pembimbing & evaluator). Karakter pemegang materi sains dilengkapi *floating badge* 2D pixel **kaca pembesar [🔍]** (kuning emas berdenyut jika belum dibaca, hijau centang jika sudah dibaca). Dilengkapi dialog visual novel dengan potret dada transparan kustom, animasi ketik typewriter, micro-bounce, dan respons percakapan ramah siswa SMP Kelas 8.
- **Burung Hantu Bijak Pemandu "Resqy"** — Maskot pendamping penjelajah 2D pixel art berbentuk burung hantu bijak (*"Kuk-kuuk!"*) yang memberikan pengenalan tim di awal area, memandu siswa mencari rekan bertanda kaca pembesar [🔍], dan mengingatkan evaluasi Bu Tyas di gerbang.
- **Kurikulum & Bahasa Ramah Anak SMP Kelas 8 (Zero Foreign Jargon)** — Seluruh naskah dialog dan materi temuan geologis diringkas padat (1-2 kalimat pendek per balon kata), mudah dipahami, serta 100% bebas dari istilah asing/teknis yang rumit. Soal tebak kata Wordle di akhir tiap area dibuat mudah dan mutlak 100% diambil dari materi yang diajarkan oleh para rekan ekspedisi.
- **Evaluator Tunggal Gerbang: Bu Tyas, M.Pd. & Alur Masuk Portal Murni** — Pembukaan akses gerbang evaluasi di seluruh zona Level 1 (Wordle) dan Level 2 (TTS Crossword) dibina dan diuji langsung oleh **Bu Tyas, M.Pd.**. Jika tantangan evaluasi telah diselesaikan, pemain dapat langsung menekan tombol **ENTER** di portal untuk meluncur ke area selanjutnya tanpa pop-up peringatan; pop-up peringatan hanya muncul jika pemain belum menyelesaikan evaluasi Bu Tyas.
- **Arsitektur Lebar Peta Dinamis (Dynamic Zone Width Engine 2.200 px)** — Engine geologis adaptif yang melepaskan limitasi statis 1.280 px: Area 6 (Batas Divergen) menyajikan rute penjelajahan luas 2.208 px (69 kolom) dengan pergerakan kamera halus (*smooth parallax scrolling*) yang bebas hambatan hingga ke Altar Akhir tempat Komandan Satria (`px: 2060`), Gerbang Wordle (`px: 2110`), dan Portal Turun (`px: 2160`) bersiap.
- **Overhaul Visual Magma Realistis Mengisi Penuh Celah Jurang** — Magma danau vulkanik mengisi penuh rongga jurang dari bibir tebing (`magmaTopY = 375`) hingga dasar terdalam (y = 455) pada seluruh 6 celah retakan. Dilengkapi gradien 6 tahap termal pijar (`#ffffff` hingga `#450a0a`), pulau-pulau kerak basal mengapung, pendaran glow tebing batuan, 6 titik kepulan uap fumarol/abu vulkanik aktif, dan gelembung magma meletup hidup.
- **Modal Temuan Sains Beresolusi Penuh (Full-Sized Illustration Modal)** — Kontainer visualisasi materi temuan geologis berukuran lega (`h-72 sm:h-80` / 288–320 px) tanpa batasan terpotong, menghadirkan modul interaktif Superbenua Pangea 7 lempeng yang dapat disentuh/diklik, peta sabuk pegunungan kembar Appalachian-Caledonian, dan simulator animasi pemekaran lempeng lempeng divergen.
- **Pedoman Baku Pengembangan Area Lanjutan** — Pengembangan area hanya mengubah 3 komponen menjadi NPC (Catatan Geologis ➔ NPC pemandu, Temuan Geologis ➔ NPC materi sains, Tantangan Gerbang ➔ NPC penjaga pintu). Tampilan UI (kotak chat Visual Novel, warna retro, font pixel, widget Resqy) bersifat permanen dan tidak boleh dirombak. Bahasa wajib ringkas (1-2 kalimat per balon percakapan), mudah dipahami anak SMP kelas 8, 100% bebas dari istilah asing rumit, serta soal evaluasi akhir wajib mudah dan diambil murni dari penjelasan NPC di area tersebut tanpa kecuali.
- **Arsitektur Ekosistem Batas Konvergen (Area 7: Palung Subduksi & Kerak Samudra Otentik)** — Penjelajahan batas konvergen subduksi lempeng samudra menunjam miring (*subducting slab*) ke bawah kerak benua menembus mantel bumi. Dilengkapi bentang perairan samudra luas dengan navigasi Perahu Riset Oseanografi 2D pixel, palung laut dalam di tengah laut, dermaga pantai pesisir, serta busur pegunungan vulkanik di daratan dengan magma terlindung di dalam kantung dapur magma.
- **Formula Profil Dasar Laut Terpadu & Eliminasi Celah (`getConvergentSeafloorProfile`)** — Standarisasi elevasi matematis kontinu yang menghubungkan dasar laut abisal, lereng palung, dan prisma akresi daratan benua secara mulus dengan fondasi mantel astenosfer solid dari `y = 356`, menjamin 100% tidak ada celah latar belakang yang bocor di antara air dan batuan daratan.
- **Visualisasi Geologis Berlapis Kerak Samudra (*Ophiolite Sequence*)** — Penampang litosfer samudra berstrata otentik: sedimen laut pelagis (*pelagic silt*), basal bantal vulkanik (*pillow basalt*) dengan kubah melengkung dan kaca pendingin vulkanik, kompleks dyke bersusun (*sheeted dykes*), serta gabro berlapis ultra-mafik dengan butiran kristal mineral olivin dan piroksen hijau zamrud (`#0d9488`, `#10b981`) yang realistis dan edukatif.
- **Streamlined Telemetry HUD Terpusat & Zero Tombol Replay** — Bilah telemetri atas dikunci secara matematis di tengah layar (`fixed left-1/2 -translate-x-1/2`) tanpa tergeser resolusi layar, bersih dari tombol replay yang tidak diperlukan, serta air palung jernih bebas dari artefak kotak putih.
- **Arsitektur Batas Transform (Area 8: Patahan San Andreas & POV Top-Down 2D)** — Puncak petualangan Level 1 dengan sudut pandang unik dari atas (*2D Top-Down View*) di padang gurun California yang memperlihatkan dinamika geseran mendatar (*strike-slip*) Lempeng Pasifik (bergerak barat laut) vs Lempeng Amerika Utara (bergerak tenggara). Menampilkan jalan aspal terpotong dan pembelokan sungai Wallace Creek sejauh 130m dengan tekstur poligon kontinu padat (*zero scanline gaps*).
- **Rekahan Gempa Realistis & Fisika Melompati Celah Patahan 3D** — Garis sesar digambar dengan 25 benih rekahan geologis bercabang (*branching fissures*) dengan gradasi jurang hitam pekat dan sorotan batu retak. Bibir celah patahan ($Y = 228..252$) memblokir pergerakan jalan kaki di tanah, mewajibkan pemain melompat menggunakan fisika parabola top-down 3D (`jumpZ`, gravitasi vertikal `jumpZVelocity`, bayangan dinamis mengecil) dengan tombol Spasi atau tombol sentuh `LONCAT`.
- **D-Pad Sentuh 4 Arah & Tombol Aksi Mandiri pada Tablet/Ponsel** — D-Pad berlian 4 arah (Atas, Bawah, Kiri, Kanan) di kiri dan tombol aksi mandiri `LONCAT` & `AKSI [E]` di kanan. Tombol Atas murni menggerakkan karakter ke Utara tanpa melompat, sementara tombol `LONCAT` mengeksekusi lompatan melewati celah.
- **Staf Peneliti Lengkap & Kapsul Evakuasi Kemenangan Akhir Level 1** — Didampingi 5 NPC (Dr. Maya, Prof. Sarah, Dr. Taufik, Petugas Rudi, dan Komandan Guntur) yang berdiri aman di tanah padat selatan ($Y = 315$) berdampingan dengan Kapsul Evakuasi Akhir. Evaluasi Wordle akhir (`TRANSFORM`, `SANANDREAS`, `SISMOGRAF`) membuka kapsul untuk menuntaskan ekspedisi Level 1 (skor 100 poin penuh).
- **Anti-Burem Resolusi Tinggi (High-DPI / DevicePixelRatio Scaling)** — Penyesuaian `window.devicePixelRatio` otomatis pada kanvas dan tipografi anti-aliasing tajam menjamin tampilan dan teks tetap razor-sharp saat di-zoom hingga 250% maupun pada layar Retina tablet murid.
- **Continuous Cosine Terrain Engine** — Medan pegunungan, lembah ngarai patahan, jembatan gantung kayu, lorong tambang batuan dalam (*Deep Mining Tunnel*), sel konveksi mantel bumi, lautan logam cair inti luar, istana kristal heksagonal inti dalam, lembah retakan vulkanik divergen Afrika Timur, hingga palung subduksi konvergen samudra dengan fisika lereng mulus (*smooth slope traversal*).
- **Directional Zone Spawning & Penyelarasan Navigasi** — Transisi zona terarah: navigasi **"Turun Menuju Lapisan Selanjutnya"** (Poros Turun Geotermal) memunculkan karakter di sisi kiri area baru menghadap kanan; navigasi **"Naik Menuju Lapisan Sebelumnya"** (Derek Naik Evakuasi) memunculkan karakter di sisi kanan area sebelumnya.
- **Fisika Platform Anti-Tunneling (CCD) & Jembatan Basal** — Menghilangkan bug karakter tembus platform gantung saat jatuh berkecepatan tinggi (`vy >= 6`) melalui *Continuous Collision Detection* lintasan vertikal (`prevY`) dan toleransi tapak kaki lebar (`footMargin = 10`). Elevasi jembatan basal ditinggikan agar menapak kokoh di atas lava.
- **Sistem HP & Ketahanan Karakter** — Indikator darah 100 HP di HUD dengan ikon Pixel Heart. Penalti jatuh ke jurang magma dalam mengurangi 25 HP, memicu ledakan audio, respawn ke titik aman, dan masa kebal 50 frame berkedip.
- **Discovery Points & Animasi Batas Lempeng 2D** — Titik eksplorasi sains komparasi Kerak Benua vs Kerak Samudra, diagram animasi ketiga dinamika lempeng (Divergen, Konvergen subduksi lempeng menunjam, dan Transform sesar geser mendatar), temuan inti dalam (tekanan >3,6 juta atm & altar pusat bumi 6.371 km), serta animasi superbenua Pangea, penampang East African Rift, dan seafloor spreading.
- **Sistem Visual Novel RPG Interaktif (5 Anggota Tim Ekspedisi Resmi)** — Seluruh strata penjelajahan Level 1 dihidupkan oleh formasi 5 karakter resmi (**Zidane, Zahra, Ican, Lintang, dan Bu Tyas**) dengan potret dada 100% transparan kustom, naskah dialog ramah siswa SMP kelas 8 tanpa istilah asing rumit, tutorial burung hantu bijak Resqy (*"Kuk-kuuk!"*), floating badge kaca pembesar [🔍] pada NPC materi edukasi, dan soal evaluasi tebak kata Wordle yang murni diambil dari materi yang diajarkan rekan tim tanpa membocorkan kunci jawaban.
- **Gerbang Evaluasi Wordle Dinamis Bersama Bu Tyas, M.Pd.** — Pembukaan akses turun antar-strata geologis menggunakan tebak kata Wordle interaktif dengan dukungan panjang kata adaptif (`targetWord.length`, ukuran kotak fleksibel `w-9`/`w-8`/`w-7`/`w-6`). Soal gerbang dikawal langsung oleh Bu Tyas, M.Pd. dengan dialog 2 pilihan (siap tantangan vs melihat-lihat materi terlebih dahulu).
- **Multi-User Scoped State & Isolasi Penuh Akun Siswa** — Penyimpanan sesi otomatis terisolasi mutlak per akun siswa (`resqbox_earthdive_progress_${userId}`), menjamin seluruh data kristal, temuan sains, gerbang terbuka, dan koordinat persis karakter per-zona (`zonePositions`) tersimpan aman saat refresh dan mencegah kebocoran status antar-akun.
- **Real-Time Journey Progress Tracker 2D Pixel Art & Preview Avatar** — Bilah pelacak perjalanan retro di bagian bawah layar (*bottom-center*) yang memetakan **8 area geologis** (Permukaan Bumi, Kerak, Mantel, Inti Luar, Inti Dalam, Batas Divergen, Konvergen, dan Transform). Menampilkan fill bar bergradasi warna dinamis, checkpoint berikon pixel art (`mountain`, `pickaxe`, `flame`, `zap`, `crystal`, `divergent`, `convergent`, `transform`), serta miniatur avatar siswa yang meluncur mulus secara real-time (60 FPS) mengikuti koordinat langkah karakter dan membalik hadap kiri/kanan.
- **Header Telemetri Diciutkan (*Collapsible Pill*) di Semua Layar** — Tampilan bilah indikator telemetri di tengah atas layar berbentuk kapsul retro ringkas `[ 📢 TELEMETRI  ▼ ]` di semua ukuran layar (ponsel, tablet, laptop, dan desktop) serta pada Level 1 & Level 2. Keadaan awal disetel terlipat/diciutkan secara default (100% lapang dan estetik). Satu klik membuka panel indikator lengkap (Kedalaman, Tekanan, Suhu, Kristal, Temuan Sains, HP) di bawah garis pembatas secara mulus.
- **Pemutaran Ulang Animasi Dinamis Tektonik Tanpa Mereset Posisi Karakter** — Pada area yang memiliki animasi dinamis lempeng (Batas Divergen / Area 6 & Batas Konvergen / Area 7), animasi selalu diputar ulang dari awal (`progress = 0`) saat halaman di-refresh agar siswa dapat menikmati keagungan fenomena tektonik, sementara posisi horizontal karakter (`initialX`) dan arah hadap tetap melanjutkan titik terakhir tanpa dipaksa kembali ke titik awal area. Karakter dan seluruh objek (NPC, kristal, papan catatan, gerbang) secara real-time terangkat naik (`player.y = getEffectiveGround` & `snapObjectsToGround`) mengikuti pertumbuhan pegunungan vulkanik yang sedang terbentuk di bawah kakinya.
- **Desain Responsif Multi-Device & Adaptasi Viewport Tablet** — Skala game dinamis (`getGameScale`), penguncian pergeseran kamera saat layar diperkecil, dan perluasan rendering medan hingga kedalaman $Y=1600$ menjamin daratan selalu mengisi penuh kanvas tanpa celah atau latar terpotong saat di-*zoom-out*. Penataan layout atas adaptif dengan Telemetry HUD 2 baris dan chip berformat `shrink-0 whitespace-nowrap` mencegah elemen bertumpukan saat di-*zoom-in* atau dimainkan di perangkat tablet siswa.
- **Sistem Kostum Adaptif Karakter Pemain & NPC Berdasarkan Zona** — Pakaian karakter pemain dan seluruh NPC secara otomatis berganti sesuai karakteristik ekstrem lingkungan lapisan bumi: di Kerak Bumi mengenakan rompi keselamatan tambang oranye bergaris reflektor scotlight neon kuning-putih serta helm proyek kuning berlampu senter kepala (*mining headlamp*) menyala terang; di Mantel Bumi, Inti Luar, dan Inti Dalam mengenakan baju pelindung masa depan canggih tahan panas (*futuristic cryo-exosuit*) dengan helm titanium tertutup dan kaca visor HUD neon cyan, baju pelindung bertekanan dengan inti pendingin krio (*cryo-cooling chest core*) berdenyut cyan, dan saluran pendingin cair; sedangkan di Permukaan Bumi dan area batas lempeng tetap memakai pakaian normal karena berada di atas permukaan bumi. Terintegrasi penuh ke sprite dunia maupun potret dialog Visual Novel.
- **Rekonstruksi Geologi Murni Interior Bumi & Eliminasi Obstruksi Visual** — Visualisasi geologi interior bumi otentik: Kerak Bumi diperkaya fosil ammonite/trilobita di dinding batuan dan animasi pekerja tambang mengayun beliung (*pickaxe*) dengan percikan api (*impact sparks*); Mantel Bumi menampilkan samudra magma silikat cair penuh berarus konveksi tanpa batuan basal mengambang yang menghalangi; Inti Luar menampilkan fluida logam cair nikel-besi mendidih 9.000°F bercahaya emas terang dengan efek kurva medan magnet bumi dipole (*geomagnetic dipole flux loops*) pelindung bumi; serta Inti Dalam menyajikan lantai 100% datar sempurna ($y = 350$) berwarna kuning keemasan bola besi padat, bersih dari altar mahkota, pilar kristal tengah, dan duri obelisk.

### 🌋 Level 2: Disaster Analyst — *Tectonic Explorer 2D & Mitigasi Kebencanaan*
Game penjelajahan lempeng tektonik 2D dan mitigasi kebencanaan geologis yang menghubungkan dinamika batas lempeng bumi dengan pelepasan gempa bumi dan erupsi vulkanik:
- **Arsitektur 3 Zona Tektonik Sekuensial**:
  1. **Area 1: Batas Divergen (East African Rift)** — Penjelajahan zona retakan benua (*Great Rift Valley*): daratan merekah saling menjauh, kepulan partikel asap belerang, pendaran magma merah-jingga di dasar jurang vertikal dalam, dan platform tanah melayang yang bergerak perlahan mendatar (kiri-kanan) untuk mendemonstrasikan lempeng bergerak saling menjauh secara alami tanpa parkur ekstrem.
  2. **Area 2: Batas Konvergen** — Penjelajahan zona subduksi tumbukan lempeng samudra menunjam ke bawah lempeng benua, peleburan batuan kerak di mantel bumi (>1.200°C), penyeberangan Jembatan Karang Andesit di atas Palung Laut Dalam dengan proteksi kebal bahaya jembatan (`isSafeOnBridge`), latar kaldera lava berdenyut organik dan awan panas Merapi (*wedhus gembel*), serta standarisasi 2 temuan sains teruji (`X/2`).
  3. **Area 3: Batas Transform** — Penjelajahan batas sesar geser mendatar (*strike-slip fault*) di ngarai gurun senja (*desert canyon twilight*) yang bersih dan natural: stasiun seismik pemantau getaran, jembatan seismik dengan fisika anti-tunneling, **Sismograf 3D Mekanik** realistis (pelat baja ber-bevel dengan 4 baut, lengan kantilever C-frame, bandul silinder inersia, dan drum seismogram pemutar gelombang P & S tanpa label teks internal), **Blok 3D Isometrik Batas Transform** (dua lempeng dengan 3 lapisan geologis yang meluncur berlawanan arah dengan panah merah bergerak sinkron dengan tanahnya), peta pergeseran 20 lempeng tektonik bumi yang digerakkan konveksi mantel, serta Kapsul Evakuasi Akhir penuntas Level 2.
- **Sistem Kristal Kumulatif (Total 9 Kristal Kumulatif)** — Masing-masing dari 3 area tektonik memiliki 3 kristal geologis (total 9 kristal se-Level 2). HUD atas menampilkan perolehan kumulatif `{collectedCount} / 9 KRISTAL` yang persisten.
- **Balon Kata (Speech Bubble) Catatan Geologis Proksimitas** — Papan informasi catatan geologis (`info_sign`) memunculkan balon kata melayang tepat di atas tiang tanda saat karakter mendekat (`dist < 50px`), dan menghilang otomatis saat karakter menjauh tanpa memblokir layar.
- **Counter Temuan Geologis Header Real-Time** — Sinkronisasi pemetaan ID temuan geologis antara engine dan data katalog menyajikan penghitungan titik temuan sains aktif (`X / total`) pada header HUD secara real-time.
- **Rekonstruksi Superbenua Pangea Presisi** — Temuan sains interaktif 2D pixel art superbenua Pangea 250 juta tahun lalu: bebas dari distorsi poligon belah ketupat, kurva tanduk Eurasia melengkung mulus alami, serta lekukan garis pantai timur laut Brasil yang mengunci presisi ke Teluk Guinea Afrika (*jigsaw puzzle fit*).
- **Titik Temuan Bukti Geologis Otentik** — Menampilkan visualisasi rantai pegunungan kembar (Appalachian Mountains di Amerika Utara dan Caledonian Mountains di Britania/Skandinavia) serta pemekaran kerak litosfer di atas astenosfer tanpa semburan magma yang mengaburkan materi sains.
- **Temuan 2 Area 2: 3 Kanvas Bentang Alam Mandiri 2D Retro Pixel** — Tiga ilustrasi mandiri beresolusi penuh yang berganti dinamis melalui tab switcher anti-clipping:
  - *Palung Laut Dalam*: Kapal riset permukaan dengan derek (*crane*), dinding jurang ngarai basalt curam, kapal selam riset kuning berlampu sorot ganda yang menerangi jurang abisal, mistar kedalaman 0–11.000 m (*Challenger Deep*), komparasi siluet Gunung Everest terendam >2.000 m di bawah laut, serta siluet paus sperma dan anglerfish.
  - *Pegunungan Lipatan*: Puncak salju megah, hutan pinus kaki bukit, penampang lipatan batuan sedimen/granit, panah kompresi horizontal (`➡ TEKANAN ⬅`), serta struktur Antiklin & Sinklin.
  - *Busur Gunung Berapi*: Kerucut stratovolcano Merapi aktif, kaldera magma, aliran lahar lereng, kolom abu wedhus gembel, slab menunjam meleleh di mantel, dan dapur magma (*magma chamber*) raksasa.
- **Peringkasan Materi Ramah Siswa SMP Kelas 8** — Uraian temuan geologis disajikan dalam format 3 kotak poin mini berikon (proses pembentukan, karakteristik/kedalaman, dan fakta geologi di Indonesia) serta papan catatan geologis 2 kalimat padat tanpa dinding teks membosankan.
- **Gerbang Teka-Teki Silang (Crossword Puzzle) Mandiri Tanpa Cheat** — Syarat membuka portal antar-zona tektonik menggunakan grid teka-teki silang interaktif bergaya retro (`PANGEA`, `AFRIKA`, `SUBDUKSI`, `PALUNG`, `TRANSFORM`, `SANANDREAS`, `SISMOGRAF`, `LEMPENG`) dengan penyorotan ubin aktif dan audio chiptune 8-bit. Tombol bantuan siaga / cheat dieliminasi demi integritas asesmen formatif.
- **Animasi Jet Booster Biru Lompatan Ganda** — Menampilkan semburan api roket pendorong jet biru (`#00e5ff`), inti putih (`#ffffff`), partikel percikan plasma (`#38bdf8`), dan pendaran cahaya pijakan saat karakter melakukan double jump di Level 2, persis identik dengan Level 1.
- **Modal Kemenangan Akhir Tektonik (`TectonicVictoryModal.tsx`)** — Modal selebrasi megah serasi dengan Level 1: piala pixel emas berkilau `<PixelTrophy>`, status pill hijau `EKSPEDISI TUNTAS!`, 3 lencana master tektonik, kristal terkumpul `X/9`, kartu narasi jembatan kausalitas menuju mitigasi bencana Level 3, serta tombol navigasi langsung ke Level 3 atau Menu Utama.
- **Sinkronisasi Skoring Bertingkat Posko Guru** — Nilai Level 2 terintegrasi ke Supabase dan Dashboard Guru secara bertahap: Area 1 (35 Poin), Area 2 (70 Poin), Area 3 (100 Poin tuntas & membuka Level 3).
- **Top HUD Serasi & Zero-Emoji Standard** — Tata letak bilah status atas diselaraskan 100% dengan Level 1: tombol papan kayu `< MENU` langsung kembali ke `/` (beranda), tombol audio SFX, tombol Layar Penuh (⛶), badge pill nama area `● BATAS DIVERGEN` / `● BATAS KONVERGEN` / `● BATAS TRANSFORM`, serta pill status kristal & HP bar. Bersih 100% dari emoji OS native melalui komponen kustom `PixelIcon`.
- **Real-Time Journey Progress Tracker 2D Pixel Art (6 Area Mitigasi)** — Bilah pelacak perjalanan retro di bagian bawah layar (*bottom-center*) yang memetakan **6 area mitigasi bencana** (Ruang Kelas Teori, Drill Gempa, Lapangan Evakuasi, Pos PGA Merapi, Simulasi Erupsi Merapi, dan Barak Pengungsian BNPB). Dilengkapi ikon pixel tematik (`book`, `earthquake`, `runner`, `seismogram`, `volcano`, `tent`), status checkpoint dinamis, serta preview avatar siswa yang meluncur real-time mengikuti langkah karakter di peta.
- **Proteksi Penguncian Level 3 & Auto-Save Terisolasi** — Level 3 dijamin tetap terkunci di beranda hingga seluruh 3 area Level 2 tuntas diselesaikan (`completedMissions.length >= 3`). Progres tersimpan otomatis per akun siswa (`resqbox_level2_progress_${userId}`) sehingga posisi karakter, kristal terkumpul, dan gerbang teka-teki tetap aman saat browser di-refresh.

### 🎮 Level 3: Simulation Game (Simulasi Aksi & Digital Twin)
- **Mission Center** — 22 level misi mitigasi terpandu (misal: "Jika sensor getaran mendeteksi gempa ➔ Nyalakan sirine & buka gerbang evakuasi").
- **Action Lab (Blockly)** — Workspace blok visual yang menggunakan bahasa sehari-hari ramah anak SMP (tanpa syntax error dan tanpa kode rumit).
- **Evacuation Game (Digital Twin)** — Peta simulasi interaktif di mana warga digital (NPC) merespons langsung aksi mitigasi yang dirancang siswa.
- **My Projects** — Ruang eksplorasi bebas bagi siswa untuk merancang sistem keselamatan impian mereka.

### 🏫 Posko Guru & Manajemen Kelas (Teacher Dashboard)
- **Portal Akses Guru (`/teacher`)** — Dasbor komando khusus guru untuk memantau kemajuan belajar siswa secara *real-time*.
- **Monitoring Multi-Level & Skoring Dinamis** — Memantau capaian belajar Level 1 (20 poin/lapisan tuntas, kristal, kata kunci), Level 2 Tectonic Explorer (35/70/100 Poin bertahap pada kolom `LV. 2 (TEKTONIK)`), dan Level 3 (Lab Simulasi).
- **Standarisasi Status Ketuntasan Ketat** — Status `[ TUNTAS ]` mutlak memerlukan skor 100 poin penuh. Skor parsial (20–80 poin di Lv. 1 atau 35–70 poin di Lv. 2) konsisten berstatus `[ PROGRES ]` dengan perolehan skor riil. Menghilangkan label hardcoded 'Sedang disusun'.
- **Tata Letak Chip Level Anti-Wrap** — Badge level aktif (`LEVEL 1`, `LEVEL 2`, `LEVEL 3`) tampil rapi satu baris tanpa patah ke bawah melalui format inline-block dengan non-breaking space Unicode.
- **Logika Level Aktif Murid Stabil** — Murid tetap berstatus `LEVEL 1` selama masih menyelesaikan tantangan Level 1, dan baru beralih ke `LEVEL 2` setelah gerbang akhir Inti Dalam terbuka (100 poin penuh), konsisten baik sesi live maupun pasca-refresh.
- **Filter Kelas & Level Dinamis** — Mendukung pengelompokan kelas otomatis (Kelas 8A, 8B, dst.) serta filter level aktif (`SEMUA`, `LV.1`, `LV.2`, `LV.3`) secara *real-time*.
- **Ekspor Nilai CSV & Cetak Lembar Rapor Siswa** — Fitur unduh rekap nilai format CSV dan cetak lembar rapor individual siswa lengkap dengan capaian strata bumi dan batas lempeng tektonik beserta catatan evaluasi guru.
- **Kredensial Akses Resmi** — Akses cepat posko guru menggunakan akun resmi (`guru` / `guru123`).

### 🔐 Sistem Akun & Keamanan Siswa
- **Registrasi Mandiri Siswa** — Siswa mendaftarkan akun secara mandiri dengan memasukkan nama, nomor absen, username, password, dan kode kelas.
- **Ganti Password Mandiri** — Siswa dapat memperbarui kata sandi secara aman melalui modal Pengaturan Profil Siswa (`/profile`).
- **Proteksi Rute Cepat** — Pengguna yang belum login otomatis diarahkan langsung ke portal login (`/login`).

### 🧩 Smart Education Board (Alat Peraga Fisik)
Diorama fisik interaktif (miniatur lereng gunung, sirine, lampu jalur aman, dan simulasi getaran) yang terhubung langsung dengan aplikasi web. Berfungsi sebagai **alat peraga nyata (tangible learning tool)** agar siswa dapat melihat dan merasakan langsung hasil simulasi aksi penyelamatan yang mereka atur di layar.

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| **Frontend** | React 19 + TypeScript 6 |
| **Build Tool** | Vite 8 |
| **Styling** | Tailwind CSS 4 + Vanilla CSS Design System |
| **State** | Zustand 5 (Multi-Store Architecture) |
| **Database & Cloud Auth** | Supabase (PostgreSQL) + LocalStorage Cache |
| **Block Editor** | Google Blockly 12 |
| **Drag & Drop** | @dnd-kit (Core + Sortable) |
| **Routing** | React Router Dom 7 |
| **Icons** | Custom 2D Pixel Icons (100% SVG, Zero-Emoji) |
| **PWA** | Vite Plugin PWA (Offline-Ready) |
| **Backend** | Laravel (PHP 8.1+) / Supabase API |

---

## 📁 Struktur Proyek

```
RESQ-BOX/
├── src/
│   ├── app/                        # Halaman & komponen utama
│   │   ├── AppLayout.tsx           # Layout utama (Zero-Header Viewport)
│   │   ├── Dashboard/              # Halaman utama (Hero Volcano Pixel Art)
│   │   ├── Level1/                 # Earth Explorer
│   │   │   ├── EarthDive/          # Engine Game Petualangan Vertikal 2D
│   │   │   │   ├── EarthDiveGame.tsx   # Loop utama & manajemen modal
│   │   │   │   ├── TelemetryHUD.tsx    # HUD status kedalaman, strata & HP
│   │   │   │   ├── DiscoveryModal.tsx  # Modal 2-panel komparasi geologi
│   │   │   │   ├── VisualNovelDialogue.tsx # Dialog RPG Visual Novel retro
│   │   │   │   ├── MascotGuide.tsx     # Robot pemandu penjelajah Resqy
│   │   │   │   ├── dialogueData.ts     # Naskah dialog ramah siswa SMP
│   │   │   │   ├── earthDiveData.ts    # Database kurikulum geologi
│   │   │   │   └── engine/             # Engine physics & canvas renderer
│   │   │   │       ├── zones.ts        # Profil medan kontinu 8 zona
│   │   │   │       ├── gameEngine.ts   # Core loop & directional spawn
│   │   │   │       ├── player.ts       # Fisika lereng, lompat 3D & kontrol
│   │   │   │       ├── renderer.ts     # Kamera presisi, High-DPI & render pipeline
│   │   │   │       ├── sprites.ts      # Pixel art sprites, rekahan sesar & bg
│   │   │   │       ├── npcSprites.ts   # Sprite pixel peneliti & komandan
│   │   │   │       └── npcManager.ts   # Lifecycle NPC & anchoring tanah
│   │   │   ├── Wordle/                 # Evaluasi tebak kata sains adaptif
│   │   │   └── PixelEarthDiagram.tsx   # Radar irisan 3D bumi
│   │   ├── Level2/                 # Disaster Analyst
│   │   │   ├── GempaBumi.tsx       # Bab 1: Materi Gempa
│   │   │   ├── GunungMerapi.tsx    # Bab 2: Materi Gunung Merapi
│   │   │   ├── PuzzleBoard.tsx     # Bab 3: Puzzle Drag-Drop
│   │   │   └── ActionBlock.tsx     # Kartu aksi draggable
│   │   ├── Level3/                 # Simulation Game (Misi + Proyek)
│   │   ├── Workspace/              # Coding Lab
│   │   │   ├── BlockEditor/        # Editor blok Blockly
│   │   │   ├── SensorPanel.tsx     # Panel slider sensor
│   │   │   ├── MissionPanel.tsx    # Panel panduan misi
│   │   │   └── ConsoleOutput.tsx   # Console log output
│   │   ├── EvacuationGame/         # Digital Twin
│   │   │   ├── EvacuationCanvas.tsx # Canvas 2D game
│   │   │   ├── mapData.ts          # Data peta tile
│   │   │   └── engine/             # Game engine
│   │   │       ├── renderer.ts     # Map & entity renderer
│   │   │       ├── npc.ts          # NPC AI & pathfinding
│   │   │       └── pathfinder.ts   # A* pathfinding algorithm
│   │   ├── Login/                  # Halaman login siswa
│   │   ├── Credits/                # Halaman kredit tim
│   │   └── components/             # Komponen UI bersama
│   │
│   ├── engine/
│   │   └── blockly/                # Custom Blockly blocks & Arduino C generator
│   │
│   ├── missions/
│   │   └── data/missions.ts        # 22 level misi (5 kategori)
│   │
│   ├── mitigation/
│   │   └── data/scenarios.ts       # 10 skenario mitigasi bencana
│   │
│   ├── store/                      # Zustand state management
│   │   ├── teacherStore.ts         # Auth + level unlock + classroom
│   │   ├── missionStore.ts         # Progress misi
│   │   ├── workspaceStore.ts       # Draft workspace & proyek
│   │   ├── runtimeStore.ts         # Pin states & sensor values (digital twin)
│   │   └── simulatorStore.ts       # Simulator state
│   │
│   └── assets/                     # Gambar & aset statis
│
├── public/                         # Aset publik & PWA manifest
├── vite.config.ts                  # Konfigurasi Vite + PWA
├── vercel.json                     # Deployment config
└── package.json
```

> Catatan: dahulu ada direktori `backend/` (Laravel + Filament) untuk manajemen
> kelas. Direktori itu sudah dihapus — aplikasi web ini sepenuhnya memakai
> Supabase, dan `backend/` tidak pernah dirujuk dari kode mana pun. Dihapus juga
> karena migrasinya dapat menghapus tabel `classrooms` produksi, dan berkas
> `.env`-nya memuat kredensial database produksi.

---

## 🚀 Cara Menjalankan

### Prasyarat
- **Node.js** ≥ 18
- **PHP** ≥ 8.1 & **Composer** (untuk backend)
- **Git**

### 1. Clone Repository

```bash
git clone https://github.com/RaffaelVeneh/RESQ-BOX.git
cd RESQ-BOX
```

### 2. Jalankan Frontend

```bash
npm install
npm run dev
```

Akses di `http://localhost:5173/`

### 3. Jalankan Backend (Opsional — untuk fitur classroom)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

API berjalan di `http://127.0.0.1:8000/api`

> **Catatan**: Frontend dapat berjalan mandiri tanpa backend. Fitur yang membutuhkan backend (join classroom, sync progress) akan di-bypass dengan localStorage.

---

## 🎨 Desain & Estetika (2D Retro Pixel Game Viewport)

RESQ-BOX mengadopsi estetika **2D Retro Pixel Art Game** yang imersif dan ramah anak:

- **Tanpa Header Bawaan (Pure Full-Screen Viewport)**: Menghilangkan bilah navigasi atas konvensional. Seluruh interaksi menggunakan tombol papan kayu retro terintegrasi di dalam dunia visual.
- **Tipografi Pixel**: Menggunakan `'Press Start 2P'` untuk judul, tombol aksi, dan badge, serta `'Pixelify Sans'` untuk teks formulir dan bacaan agar tetap nyaman dibaca.
- **Adegan Pixel SVG Dinamis**:
  - *Daytime Volcano Scene (Beranda)*: Gunung api pixel animasi, semburan lahar berdenyut, partikel asap, awan bergerak, dan lentera kayu.
  - *Nighttime Starry Rescue Camp (Profil)*: Langit malam berbintang kelap-kelip, bulan kawah pixel, dan siluet pohon pinus.
  - *Sunset Golden Mountain (Credits)*: Gradien senja keemasan, siluet perbukitan gelap, dan kunang-kunang bara api.
- **Papan Kayu & Tombol 3D (`.pixel-wood-board` & `.pixel-btn-wood-plank`)**: Tekstur serat kayu berukir retro dengan sudut paku besi dan animasi penekanan tombol 3D.
- **Web Audio 8-Bit Chiptune SFX**: Efek suara sintetis retro murni (Select, Hover, Unlock, Error) tanpa file audio eksternal.
- **Layar Penuh Proyektor (Fullscreen ⛶)**: Fitur layar penuh satu klik yang memudahkan guru menampilkan media ke proyektor kelas.

Lihat [design.md](./design.md) untuk pedoman desain lengkap.

---

## 📊 Sistem Progression

```
Level 1: Earth Explorer (Earth Dive)
    │
    ├── Area 1: Permukaan Bumi (0 km) ────── Persiapan Poros Turun Geotermal (12 Poin) ✓
    ├── Area 2: Kerak Bumi (100 km) ──────── Dr. Gea & Wordle Komandan Hendra (25 Poin) ✓
    ├── Area 3: Mantel Bumi (2.900 km) ───── Dr. Bayu & Wordle Komandan Surya (38 Poin) ✓
    ├── Area 4: Inti Luar (5.150 km) ─────── Dr. Fajar & Wordle Komandan Teguh (50 Poin) ✓
    ├── Area 5: Inti Dalam (6.371 km) ────── Dr. Bagus & Wordle Komandan Bintang (63 Poin) ✓
    ├── Area 6: Batas Divergen (Rift Valley) Map 2.200 px & Wordle Komandan Satria (75 Poin) ✓
    ├── Area 7: Batas Konvergen (Subduksi) ─ Penunjaman Lempeng & Busur Api (88 Poin) ✓
    └── Area 8: Batas Transform (Sesar) ──── Sesar Geser & Kapsul Kemenangan (100 Poin Tuntas) ✓
                                              │
                                         🔓 UNLOCK
                                              │
Level 2: Tectonic Explorer (Dinamika Lempeng) ▼
    │
    ├── Area 1: Batas Divergen ───────── 3 Kristal + Crossword (35 Poin) ✓
    ├── Area 2: Batas Konvergen ──────── 3 Kristal + Crossword (70 Poin) ✓
    └── Area 3: Batas Transform ──────── 3 Kristal + Crossword (100 Poin Tuntas) ✓
                                         ★ Kapsul Evakuasi + Piala Kemenangan ★
                                             │
                                        🔓 UNLOCK (100 Poin)
                                             │
Level 3: Simulation Game (Mitigasi Bencana)  ▼
    │
    ├── Mission Center (22 level skenario kesiapsiagaan darurat)
    ├── Action Lab Blockly (Logika aksi-reaksi keselamatan)
    ├── Evacuation Digital Twin (Respon pergerakan warga NPC)
    └── My Projects (Ruang kreasi bebas sistem mitigasi)
```

---

## 🌐 Deployment & Offline

- **Platform**: Vercel (frontend) + shared hosting (Laravel backend)
- **PWA**: Service worker aktif — aplikasi bekerja offline setelah pemuatan pertama
- **Cache**: Semua aset dan logika engine di-cache lokal
- **State**: Progress disimpan di localStorage, tersinkronisasi ke backend saat online

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
- [`LAPORAN_PROYEK.md`](./LAPORAN_PROYEK.md) — Laporan Proyek Lengkap
- [`progress_report.md`](./progress_report.md) — Laporan Progres Pengembangan
- [`walkthrough.md`](./walkthrough.md) — Walkthrough & Panduan Pengujian Sistem

---

## 📝 Lisensi

Proyek ini dikembangkan untuk keperluan kompetisi **LIDM 2026** — Divisi Inovasi Pembelajaran Digital Pendidikan.

---

<div align="center">

**RESQ-BOX** — *Belajar Mitigasi Bencana, Seru Seperti Bermain Game* 🎮🌋

</div>