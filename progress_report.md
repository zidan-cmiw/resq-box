# 📂 RESQ-BOX: Rekam Lengkap Percakapan, Perubahan & Progres Pengembangan

Dokumen ini merekam secara komprehensif seluruh percakapan, instruksi pengguna, keputusan arsitektur, dan perubahan kode yang telah diselesaikan pada proyek **RESQ-BOX (LIDM 2026 — Divisi IPDP)**.

---

## 1. Rekam Permintaan Pengguna & Rangkuman Keputusan (Chronological Summary)

| No | Instruksi / Permintaan Pengguna | Tindakan & Implementasi yang Dikerjakan | File Terdampak |
|:---|:---|:---|:---|
| 1 | **Klarifikasi Pedagogis & Reorientasi Materi IPA**: Penegasan bahwa aplikasi tidak bertujuan mengajarkan coding/hardware teknis, melainkan fokus pada materi IPA SMP Kelas 8 (Struktur Bumi, Lempeng Tektonik, Gempa, Erupsi Merapi). Blockly & Diorama murni alat bantu manipulatif. | Memperbarui seluruh `Readme.md`, `PRD.md`, `LAPORAN_PROYEK.md`, dan materi ajar untuk menghapus jargon pemrograman dan memposisikan hardware sebagai *tangible learning aid*. | `Readme.md`, `PRD.md`, `LAPORAN_PROYEK.md` |
| 2 | **Redesain Total ke Full 2D Retro Pixel Art Game**: Menghapus layout web modern/sidebar biasa. Mengubah nuansa keseluruhan menjadi *Pixel Quest* retro game 2D yang imersif. | Menghapus *sidebar* kiri, mengganti halaman utama menjadi Title Screen 2D SVG bertema gunung berapi beranimasi (magma, partikel asap, awan, matahari berdenyut). | `src/app/AppLayout.tsx`, `src/app/Dashboard/index.tsx`, `src/index.css` |
| 3 | **Papan Kayu 3D & Tombol Aksi Permainan**: Mengganti kartu menu modern menjadi papan kayu berukir 3D (*wooden planks*) untuk tombol level dan menu sekunder. | Merancang CSS class `.pixel-wood-board` dan `.pixel-btn-wood-plank` dengan highlight bevel atas, bayangan tekan, dan tipografi `'Press Start 2P'`. | `src/index.css`, `src/app/Dashboard/index.tsx` |
| 4 | **Penggantian Tombol Fungsi Menjadi Fullscreen**: Mengubah tombol utilitas menjadi tombol Layar Penuh (⛶) agar guru mudah menampilkan media ke proyektor kelas. | Membuat utilitas `src/utils/fullscreen.ts` yang mendukung cross-browser native fullscreen API (`requestFullscreen`, `webkitRequestFullscreen`, `msRequestFullscreen`). | `src/utils/fullscreen.ts`, `src/app/Dashboard/index.tsx` |
| 5 | **Fitur Profil Siswa & Pilihan Avatar**: Menghapus indikator hati/nyawa RPG dan membuat sistem Profil Siswa yang merekam nama, kelas, absen, sekolah, PIN 4-digit, pilihan karakter pixel, dan progress level. | Membuat halaman `src/app/Profile/index.tsx`, menambahkan state profile di `teacherStore.ts` dengan persistensi `localStorage`. | `src/app/Profile/index.tsx`, `src/store/teacherStore.ts`, `src/App.tsx` |
| 6 | **Variasi Background Tiap Halaman Berbeda & Beranimasi**: Meminta background tiap adegan berbeda (Beranda: Siang Gunung Berapi, Profil: Malam Berbintang, Credits: Senja Pegunungan Emas) lengkap dengan animasi pixel. | Merancang 3 adegan SVG pixel art dinamis (animasi bintang kelap-kelip, bulan berbayang, awan bergeser, partikel asap kawah, bara api kunang-kunang). | `src/app/Dashboard/index.tsx`, `src/app/Profile/index.tsx`, `src/app/Credits/index.tsx`, `src/index.css` |
| 7 | **Pembaruan Formasi Tim & Peran Resmi di Halaman Credits**: Mengganti Raffael Vincent dengan Ichsan Abror sebagai Hardware Engineer, dan menetapkan struktur tim resmi: Zidane (Ketua & Dev Utama), Ichsan (Hardware), Zahra (UI/UX & Asisten Dev), Lintang (Materi IPA & Laporan), Ibu Rizki Arumning Tyas, M.Pd. (Dosen Pembimbing). | Memperbarui daftar anggota tim di `src/app/Credits/index.tsx`, `Readme.md`, `PRD.md`, dan `LAPORAN_PROYEK.md`. | `src/app/Credits/index.tsx`, `Readme.md`, `PRD.md`, `LAPORAN_PROYEK.md` |
| 8 | **Penyesuaian Tombol Kembali di Profil Siswa**: Tombol kembali harus ditaruh di bawah tombol simpan (vertikal stack, bukan bersampingan). | Mengubah tata letak tombol aksi di `src/app/Profile/index.tsx` menjadi `flex flex-col gap-2.5` dengan tombol `SIMPAN PROFIL TARUNA ➔` di atas dan `◀ KEMBALI KE MENU UTAMA` di bawahnya selebar papan. | `src/app/Profile/index.tsx` |
| 9 | **Hapus Kotak Teknologi di Halaman Credits**: Menghapus teks badge teknologi (*TEKNOLOGI: React 19... PWA OFFLINE READY*) agar adegan bersih dan elegan. | Menghapus elemen badge teknologi dari `src/app/Credits/index.tsx`. | `src/app/Credits/index.tsx` |
| 10 | **Hapus Semua Header Bawaan di Seluruh Halaman (Zero-Header Standard)**: Menghapus bilah topbar/header di halaman Profil, Settings, dan seluruh halaman aplikasi. Menetapkan standar no-header dan style pixel untuk seluruh modul selanjutnya. | Mengubah `src/app/AppLayout.tsx` agar merender `<Outlet />` langsung tanpa elemen `<header>`. Menetapkan panduan desain di `design.md` dan `PRD.md`. | `src/app/AppLayout.tsx`, `design.md`, `PRD.md` |
| 11 | **Standarisasi Font Pixel 2D (Anti Modern Sans/Mono)**: Menghilangkan semua sisa `font-mono` bawaan pada badge, kode kelas, level, dan persentase yang merusak estetika retro 8-bit. | Menambahkan `@utility font-pixel-title` dan `@utility font-pixel` dengan `!important` di `src/index.css`. Mengganti seluruh badge `font-mono` dengan `'Press Start 2P'` dan `'Pixelify Sans'`. | `src/index.css`, `src/app/TeacherDashboard/index.tsx`, `src/app/Profile/index.tsx`, `src/app/Login/index.tsx`, `src/components/PixelLoadingScreen.tsx`, dll. |
| 12 | **Monitoring Multi-Level Evaluasi Guru (Level 1, 2, 3)**: Memperluas tabel pemantauan dari hanya Level 1 menjadi 3 level lengkap: Level 1 (Wordle), Level 2 (Puzzle Mitigasi), Level 3 (Simulasi Blockly/IoT). Filter `SEMUA`, `LV.1`, `LV.2`, `LV.3` kini berfungsi penuh memfilter siswa yang belum menuntaskan level terkait. | Menambahkan kolom evaluasi Level 1, 2, dan 3 di tabel siswa. Menyesuaikan logika filter dan badge status `SUDAH`/`BELUM`. | `src/app/TeacherDashboard/index.tsx` |
| 13 | **KPI Progres Ketuntasan Gabungan Kelas (Level 1-3)**: Mengubah kartu metrik persentase tunggal Level 1 menjadi persentase ketuntasan kurikulum kelas gabungan Level 1 s.d. 3 beserta detail rasio siswa lulus. | Menghitung total level selesai dibagi total potensi capaian kelas (total siswa × 3) dengan bilah progres pixel beranimasi. | `src/app/TeacherDashboard/index.tsx` |
| 14 | **Tombol Akses Posko Guru Khusus Akun Guru**: Menyediakan tombol kembali ke Dashboard Guru dari halaman beranda (`/`), dengan proteksi ketat (`currentUser?.role === 'teacher'`) sehingga tidak terlihat sama sekali oleh akun siswa atau tamu. | Menambahkan tombol `POSKO GURU` di top HUD, badge `AKUN GURU` di kartu profil beranda, dan papan menu emas `POSKO MONITORING GURU` yang hanya muncul saat guru login. | `src/app/Dashboard/index.tsx` |
| 15 | **Overhaul Tema Terang (Light Parchment & Retro Wood) Posko Guru**: Mengubah tema gelap slate menjadi perkamen hangat krem (`#fef3c7`) dengan bingkai kayu pixel (`#451a03`) serasi dengan halaman aplikasi lainnya. | Mengganti seluruh kelas `bg-slate-900`/`bg-slate-950` dengan `.pixel-wood-board` dan skema warna terang retro. | `src/app/TeacherDashboard/index.tsx` |
| 17 | **Fase 1 — Critical Logic & UI Fixes**: Mencegah HTML Injection di cetak rapor, memperbaiki skor palsu Level 2 di dashboard guru, mengintegrasikan submission cloud Level 2 & Level 3, serta membuat halaman 404 pixel art. | Mengimplementasikan `escapeHtml()`, cloud submission pada puzzle mitigasi dan mision store, serta membuat rute 404. | `src/app/TeacherDashboard/index.tsx`, `src/app/Level2/PuzzleBoard.tsx`, `src/store/missionStore.ts`, `src/app/NotFound/index.tsx`, `src/App.tsx` |
| 18 | **Fase 2 — Security Hardening & Safe Execution**: Password hashing di PostgreSQL via `pgcrypto` & RPC server-side, restriksi RLS dengan operasi lewat RPC functions, perkuatan blacklist `codeSanitizer.ts`, timeout 60 detik pada simulator Blockly, dan rate limiting di backend API. | Memperbarui skema database Supabase v2, `supabaseClient.ts`, `codeSanitizer.ts`, `Workspace/index.tsx`, dan `backend/routes/api.php`. | `supabase_schema.sql`, `src/utils/supabaseClient.ts`, `src/engine/codeSanitizer.ts`, `src/app/Workspace/index.tsx`, `backend/routes/api.php` |
| 19 | **Refinement Diagram Irisan Bumi (PixelEarthDiagram)**: Menjadikan permukaan bumi belahan bawah (benua hijau & samudra) interaktif/dapat diklik sebagai bagian dari Kerak Bumi, membenahi posisi 3D bola Inti Bumi agar pas bersarang ke dalam soket lubang inti, serta menghapus garis putus-putus/seam yang mengganggu di atas permukaan bumi. | Memperbarui tata letak geometri SVG, highlight keliling penuh, soket cavity inti dalam, dan merapikan garis batas ekuator. | `src/app/Level1/PixelEarthDiagram.tsx` |
| 20 | **Akun Demo Penguji Khusus (Semua Level Terbuka)**: Membuat akun siswa khusus `demo` / `demo123` yang memiliki status `unlocked_level = 3` secara otomatis untuk mempermudah evaluasi juri/penguji tanpa harus menyelesaikan Level 1 dan 2 terlebih dahulu. Akun siswa lainnya tetap normal (terkunci berurutan). Menambahkan tombol quick auto-fill pada form login. | Memperbarui `supabaseClient.ts`, `teacherStore.ts`, `supabase_schema.sql`, dan menambahkan kartu auto-fill di `Login/index.tsx`. | `src/utils/supabaseClient.ts`, `src/store/teacherStore.ts`, `supabase_schema.sql`, `src/app/Login/index.tsx` |
| 21 | **Animasi Buka Buku 3D Realistis, Perbaikan Hitbox Irisan Bumi, Efek Ngetik (Typewriter) & Preservasi Halaman 1**: Mengembalikan tampilan Halaman 1 ke layout kartu terpusat asli (pertanyaan pemantik, tombol pilihan tahu/ingin tahu, dan kuis uji urutan), membetulkan hitbox seluruh lapisan irisan bumi (kerak samudra, kerak benua, mantel, inti, dan kavitas soket), mengaktifkan kembali animasi mengetik retro (*PixelTypewriter*), serta memadukannya dengan efek pembalik halaman 3D. | Memperbarui `StrukturBumi.tsx`, `PixelEarthExploded.tsx`, `PixelEarthDiagram.tsx`, `PixelTypewriter.tsx`, dan `src/index.css`. | `src/app/Level1/StrukturBumi.tsx`, `src/app/Level1/PixelEarthExploded.tsx`, `src/app/Level1/PixelEarthDiagram.tsx`, `src/components/PixelTypewriter.tsx`, `src/index.css` |
| 22 | **Integrasi Library PageFlip & Penyesuaian Style 2D Pixel Art**: Mengintegrasikan library `page-flip` (StPageFlip) untuk mekanika lekukan fisik lembaran kertas bolak-balik dengan drag sudut lembaran, sekaligus mengadaptasi 100% komponen visualnya ke estetika Retro 2D Pixel Art (gauge tabung persegi bergaris takik 8-bit, bingkai kayu tebal, tekstur perkamen retro, custom pixel scrollbars, dan aksen sudut lipat `◢`). | Menyesuaikan `StrukturBumi.tsx`, `src/index.css`, dan types `page-flip.d.ts`. | `src/app/Level1/StrukturBumi.tsx`, `src/index.css`, `src/types/page-flip.d.ts` |
| 23 | **Transformasi Gamifikasi Level 1 — EARTH DIVE (Vertical Adventure Descent)**: Merombak Level 1 menjadi game petualangan vertikal penjelajahan bumi dari Permukaan (0 km) menembus Litosfer, Astenosfer, Mantel Bawah, Inti Luar hingga Inti Dalam (6.371 km). Dilengkapi HUD telemetri live (kedalaman, suhu, tekanan, stamina suit), titik temuan sains (Discovery Point) dengan ilustrasi SVG pixel, gerbang evaluasi mini-challenge per lapisan dengan panduan maskot Siaga, sistem reward 5 Geo-Crystals & 4 Earth Badges, serta Core Synthesis Challenge yang menghubungkan panas interior bumi dengan pelepasan gempa dan letusan Merapi untuk membuka Level 2. | Membuat modul modular `EarthDiveGame.tsx`, `TelemetryHUD.tsx`, `DiscoveryModal.tsx`, `MiniChallengeModal.tsx`, `CoreChallengeModal.tsx`, `earthDiveData.ts`, dan memperbarui `src/app/Level1/index.tsx`. | `src/app/Level1/EarthDive/*`, `src/app/Level1/index.tsx`, `src/utils/retroAudio.ts` |
| 24 | **Penyelarasan Sains & Kurikulum Level 1 (Perjalanan Menuju Geologis Bumi)**: Menyelaraskan 100% data struktur bumi di `earthDiveData.ts`, `engine/zones.ts`, dan `DiscoveryModal.tsx` agar presisi dengan dokumen materi resmi *Perjalanan Menuju Geologis Bumi.pdf*. Mencakup tantangan apersepsi (faktor suhu & tekanan ekstrem), metrik ganda (km & mil, °C & °F), komparasi kerak benua (100 km / 50 mil) vs samudra (5-15 km / 3 mil, padat & berat), mantel bumi tertebal (2.900 km / 1.800 mil, konveksi 1.000°F–7.000°F), inti luar cair meleleh (9.000°F), inti dalam bola besi padat (10.000°F tahan leleh akibat tekanan gravitasi luar biasa), serta 20 lempeng tektonik, subduksi, palung laut dalam, dan teori Pangea. | Memperbarui `earthDiveData.ts`, `engine/zones.ts`, `DiscoveryModal.tsx`, `retroAudio.ts`, dan `renderer.ts`. | `src/app/Level1/EarthDive/earthDiveData.ts`, `src/app/Level1/EarthDive/engine/zones.ts`, `src/app/Level1/EarthDive/DiscoveryModal.tsx`, `src/utils/retroAudio.ts` |
| 25 | **Integrasi Penuh Level 1 Game Viewport & Mode Switcher**: Menjadikan game petualangan 2D *Earth Dive* sebagai tampilan utama (*primary view*) saat memasuki rute `/level1`. Dilengkapi dengan top HUD mode switcher (`EARTH DIVE (GAME 2D)` dan `KUIS & PENAMPANG`) sehingga siswa dapat bermain game eksplorasi vertikal secara penuh sekaligus dapat beralih ke kuis latihan tebak kata secara fleksibel tanpa merusak state permainan. | Mengintegrasikan `EarthDiveGame` dan mode switcher ke `Level1/index.tsx`. | `src/app/Level1/index.tsx` |
| 27 | **Transformasi Medan Organik Kontinu ala Terraria / TheoTown (Continuous Smooth Ground & Ceiling Profile)**: Menggantikan tangga balok kotak 32px kaku yang tidak realistis dengan sistem interpolasi cosine organik kontinu di `engine/zones.ts` (`groundProfile`, `ceilingProfile`, `Platform[]`), didukung pergerakan lereng mulus (*smooth slope traversal*) di `player.ts`, deteksi langit-langit gua batuan, serta rendering tekstur medan bit kaya di `sprites.ts`. | `src/app/Level1/EarthDive/engine/zones.ts`, `src/app/Level1/EarthDive/engine/player.ts`, `src/app/Level1/EarthDive/engine/sprites.ts` |
| 28 | **Penghapusan Seluruh Emoji & Standarisasi 100% SVG Pixel Icon (`PixelIcon`)**: Menghilangkan seluruh emotikon OS modern (seperti 🔍, 📝, 🔒, ⛏️, 🔊) dan sisa font sans-serif modern yang merusak estetika retro 8-bit. Menggantinya dengan komponen SVG pixel art kustom `PixelIcon` (ikon `pickaxe`, `clipboard`, `search`, `lock`, `sound-on`, `sound-off`, `globe`, `broadcast`, dll.) serta memastikan font `'Press Start 2P'` dan `'Pixelify Sans'` aktif menyeluruh. | `src/app/Level1/EarthDive/EarthDiveGame.tsx`, `src/app/Level1/EarthDive/DiscoveryModal.tsx`, `src/components/PixelIcon.tsx` |
| 29 | **Penyederhanaan HUD Atas & Optimalisasi UX Edukatif (Streamlined Earth Dive HUD)**: Menyederhanakan tampilan HUD di `TelemetryHUD.tsx` dan `EarthDiveGame.tsx` dengan menghapus indikator Suhu dan Stamina Suit agar murid tidak bingung/kewalahan dengan kepadatan tulisan teknis, melainkan fokus penuh pada pemahaman materi strata geologis, kedalaman nyata (KM), dan pengumpulan Geo-Crystals. | `src/app/Level1/EarthDive/TelemetryHUD.tsx`, `src/app/Level1/EarthDive/EarthDiveGame.tsx` |
| 30 | **Integrasi Papan Evaluasi Wordle 3 Soal per Lapisan Geologis**: Mengganti format kuis pilihan ganda ABCD biasa menjadi kuis tebak kata Wordle interaktif (`Wordle.tsx`) sebagai syarat membuka gerbang sumur bor antar-lapisan (3 kata target per lapisan). Untuk Area 1 (Kerak Bumi), 3 kata sains target diselaraskan dengan materi: `KERAK`, `BENUA`, dan `TIPIS`. | `src/app/Level1/EarthDive/EarthDiveGame.tsx`, `src/app/Level1/Wordle.tsx` |
| 31 | **Lanskap Latar Belakang Gunung Merapi Aktif (Scenery Overhaul Area 1)**: Mengganti bukit salju/es dan bentukan setengah lingkaran melayang dengan panorama otentik Gunung Merapi aktif (lereng vulkanik bertekstur, kepulan asap kawah dinamis, vegetasi pinus lereng) serta menghilangkan garis potong vertikal (*vertical seam*) di belakang jembatan dengan formula gelombang medan sinusoidal kontinu. | `src/app/Level1/EarthDive/engine/sprites.ts` |
| 32 | **Redesain Komparasi Kerak Bumi (Discovery Modal: Kerak Benua vs Kerak Samudra)**: Merombak total ilustrasi temuan geologis kerak bumi menjadi 2 panel komparasi bersih bersisian: Kerak Benua (~100 km / 50 mil dengan Gunung Merapi & batuan granit) vs Kerak Samudra (5-15 km / 3 mil dengan kolom air samudra & batuan basal padat berat). Menghapus badge litosfer yang menabrak teks, merapikan tipografi tanpa overlap, dan menghapus tekstur batu oval abu-abu yang mengganggu. | `src/app/Level1/EarthDive/DiscoveryModal.tsx` |
| 33 | **Penataan Presisi Benda Menapak Tanah & Jembatan (Zero-Floating & Platform Snapping)**: Menata kotak catatan geologis dan tiang jembatan gantung agar menapak pas di atas permukaan tanah/dek jembatan tanpa melayang atau melesak ke dalam tanah. Menjalankan `snapPlatformsToGround` terlebih dahulu sebelum `snapObjectsToGround` pada fungsi `buildAndSnap()`, serta menambahkan pelat tumpuan logam (*steel footing plate*) pada tiang kanan jembatan. | `src/app/Level1/EarthDive/engine/zones.ts`, `src/app/Level1/EarthDive/engine/sprites.ts` |
| 34 | **Animasi Pose Udara & Squash Karakter**: Menambahkan pose melompat naik (Frame 6) dan jatuh melayang (Frame 7) pada sprite sheet karakter di `sprites.ts` & `player.ts`, serta efek kompresi pendaratan (*landing squash decay*) agar pergerakan avatar siswa terasa lentur dan hidup. | `src/app/Level1/EarthDive/engine/sprites.ts`, `src/app/Level1/EarthDive/engine/player.ts` |
| 35 | **Sistem Spawning Terarah Antar-Area (Directional Transition Spawning)**: Memperbaiki bug di mana pemain selalu spawn di ujung paling kanan peta (akibat multiplikasi salah `playerSpawnX * TILE`). Menerapkan aturan spawn berarah: maju/menyelam ke area selanjutnya (`down`) spawn di **titik awal/kiri** area baru (`upPortal.px + 50`), menghadap ke kanan; kembali/naik ke area sebelumnya (`up`) spawn di **titik akhir/kanan** area sebelumnya (`downPortal.px - 55`), menghadap ke kiri. Dilengkapi penyesuaian kamera instan dan deteksi klik kanvas dengan presisi `px`/`py`. | `src/app/Level1/EarthDive/engine/gameEngine.ts` |
| 36 | **Lingkungan Pertambangan Dalam (Deep Mining & Rock Strata) Area Kerak Bumi**: Merombak latar belakang zona kerak bumi menjadi lorong tambang geologi bawah tanah yang kaya dengan balok kayu penyangga (*timber bents*), tiang silang, lentera gantung berkedip hangat, rel lori, dan stratifikasi dinding batuan alami tanpa pengulangan pola kaku dan bersih dari label/badge teknis (`POS-01`, dll.). | `src/app/Level1/EarthDive/engine/sprites.ts` |
| 37 | **Penyelarasan Materi Catatan Geologi Kerak Bumi**: Menyesuaikan isi materi temuan geologis kerak bumi di `earthDiveData.ts` dan `DiscoveryModal.tsx` agar sesuai dokumen materi IPA resmi: campuran batuan padat dan mineral, lapisan tertipis bumi, ketebalan kerak benua ~100 km (50 mil) vs kerak samudra 5-15 km (3 mil, padat dan berat). | `src/app/Level1/EarthDive/earthDiveData.ts`, `src/app/Level1/EarthDive/DiscoveryModal.tsx` |
| 38 | **Animasi Geologis & Koreksi Panah Batas Lempeng Tektonik**: Memperbaiki diagram batas lempeng di `DiscoveryModal.tsx`: Batas Divergen (panah horizontal rata menjauh, animasi pemekaran lempeng dan magma naik), Batas Transform (elevasi tanah sebidang coplanar, panah maju/mundur searah patahan, dan penghapusan sisa artefak mantel statis). | `src/app/Level1/EarthDive/DiscoveryModal.tsx` |
| 39 | **Penataan Z-Index, Hapus Artefak Hitam & Animasi Mendatar Batas Konvergen**: Menempatkan lempeng kiri pada stacking order lebih tinggi (z-index atas), menghapus poligon hitam (`#1e293b`) yang menimpa permukaan hijau, menyelaraskan lempeng kanan rapat ke garis palung biru `(220,118) -> (258,72)`, serta mengubah arah pergeseran lempeng kiri dari diagonal (`translate(14px, 5px)`) menjadi murni mendatar ke kanan (`translateX(12px)`). | `src/app/Level1/EarthDive/DiscoveryModal.tsx` |
| 40 | **Dukungan Dinamis Panjang Huruf Wordle & Kartu Kemenangan Tantangan Mini**: Menyesuaikan `Wordle/index.tsx` agar panjang kata tebakannya dinamis mengikuti `targetWord.length`, ukuran ubin adaptif (`w-9`, `w-8`, `w-7`), header badge jumlah huruf, dan kartu kemenangan khusus saat diselesaikan dalam modal mini-challenge. | `src/app/Level1/Wordle/index.tsx` |
| 41 | **Sistem Persistensi Sesi Otomatis (Auto-Save & Refresh Protection)**: Menambahkan mekanisme penyimpanan progres otomatis ke `localStorage` (`resqbox_earthdive_progress`) di `EarthDiveGame.tsx` dan `gameEngine.ts` yang menyimpan zona aktif (e.g. Kerak Bumi), koordinat posisi karakter, perolehan kristal, temuan yang telah dibuka, dan gerbang yang telah terbuka sehingga siswa tidak terlempar kembali ke Permukaan Bumi saat browser ter-refresh. | `src/app/Level1/EarthDive/EarthDiveGame.tsx`, `src/app/Level1/EarthDive/engine/gameEngine.ts` |
| 42 | **Penjelasan Ilmiah & Animasi Geodynamo Inti Luar**: Klarifikasi ilmiah mengenai fenomena lucutan listrik/petir di inti luar bumi: konveksi fluida logam besi-nikel cair (9.000°F) berputar kencang menghasilkan arus listrik dahsyat (*geodynamo*) dan medan magnet pelindung bumi (magnetosfer). Memperbaiki animasi visual di `sprites.ts` agar pusaran fluida dan loop lucutan listrik tertata rapi di dalam batas area tanpa tumpahan magma. | `src/app/Level1/EarthDive/engine/sprites.ts` |
| 43 | **Penyempurnaan Animasi Pusaran Konveksi Mantel Bumi**: Mengganti animasi lingkaran statis dengan sel konveksi termal Rayleigh-Bénard ganda realistis (dua loop pusaran arus naik-turun material mantel panas vs lempeng dingin menunjam) serta merapikan batas render agar lava/magma tidak tumpah melewati batas kotak kanvas. | `src/app/Level1/EarthDive/engine/sprites.ts` |
| 44 | **Transformasi Map Inti Dalam (Istana Kristal Logam Heksagonal & Teras Rata)**: Merombak total zona Inti Dalam (5.150–6.371 km) menjadi 4 teras datar sempurna ($Y=350, 300, 240, 310$), dilengkapi kolom kristal heksagonal raksasa berparalaks, pendaran surya pusat bumi (*Sun-like Core Glow* 10.000°F), debu intan, dan kilau prisma. Menambahkan 2 titik temuan sains: (1) Bola besi padat tahan leleh akibat tekanan kompresi >3,6 juta atm, dan (2) Altar pusat bumi 6.371 km dengan gravitasi nol neto dan anisotropi kristal. | `src/app/Level1/EarthDive/engine/zones.ts`, `src/app/Level1/EarthDive/engine/sprites.ts`, `src/app/Level1/EarthDive/DiscoveryModal.tsx` |
| 45 | **Puncak Ekspedisi Wordle Sintesis 5 Kata Gabungan**: Mengubah tantangan akhir Inti Dalam di `CoreChallengeModal.tsx` menjadi format game tebak kata Wordle komprehensif yang merangkum seluruh strata bumi: `LEMPENG` (Kerak Bumi), `KONVEKSI` (Mantel Bumi), `DINAMO` (Inti Luar), `TEKANAN` (Inti Dalam), dan `SUBDUKSI` (Puncak Kausalitas Bencana). | `src/app/Level1/EarthDive/CoreChallengeModal.tsx`, `src/app/Level1/EarthDive/earthDiveData.ts` |
| 46 | **Pembukaan Gerbang Fisik Inti Dalam & Laluan Kapsul Akhir Evakuasi**: Menghubungkan penyelesaian tantangan Wordle dengan pembukaan gerbang fisik secara real-time di kanvas game (`ic_challenge`), memunculkan kapsul evakuasi akhir (`ic_portal_exit` — `★ KAPSUL AKHIR ★`), serta menyajikan modal pilihan navigasi jelas: "LANJUT KE LEVEL 2" (`/level2`) atau "MENU UTAMA" (`/`). | `src/app/Level1/EarthDive/engine/zones.ts`, `src/app/Level1/EarthDive/EarthDiveGame.tsx`, `src/app/Level1/EarthDive/CoreChallengeModal.tsx` |
| 47 | **Isolasi Progres Akun Siswa & Anti Kebocoran State Antar-Akun**: Memperbaiki bug kebocoran progres di mana akun lain ikut terselesaikan setelah akun `demo` dimainkan. Menerapkan penguncian state berbasis user ID: `resqbox_earthdive_progress_${userId}` dan `resqbox-unlocked-level_${userId}`, serta membersihkan cache lokal pada saat logout. | `src/app/Level1/EarthDive/engine/gameEngine.ts`, `src/store/teacherStore.ts` |
| 48 | **Sinkronisasi Skor Dinamis Real-Time Level 1 ke Dashboard Guru (20 Poin/Lapisan)**: Membuat modul `earthDiveSync.ts` yang menghitung skor dinamis (20 poin per lapisan yang diselesaikan: Kerak 20, Lempeng 40, Mantel 60, Inti Luar 80, Inti Dalam 100) dan melaporkannya secara otomatis ke Supabase dan Dashboard Guru setiap kali gerbang terbuka, zona berganti, atau kristal terkumpul. | `src/app/Level1/EarthDive/earthDiveSync.ts`, `src/app/Level1/EarthDive/EarthDiveGame.tsx`, `src/utils/supabaseClient.ts` |
| 49 | **Perbaikan Tata Letak Kotak Level Aktif (Anti-Wrap / Satu Baris Utuh)**: Mengatasi teks `LEVEL 1` / `LEVEL 2` yang patah ke bawah menjadi dua baris pada tabel monitoring guru. Mengganti `inline-flex` menjadi `inline-block whitespace-nowrap text-nowrap` dengan non-breaking space Unicode (`LEVEL\u00A0${level}`) dan batas lebar minimum `min-w-[130px]`. | `src/app/TeacherDashboard/index.tsx` |
| 50 | **Standarisasi Status Ketuntasan (Skor < 100 Poin Berstatus [ PROGRES ])**: Memperbaiki logika evaluasi di mana murid berskor 60 poin sebelumnya keliru berstatus `[ TUNTAS ]`. Status `[ TUNTAS ]` kini mutlak memerlukan skor 100 poin penuh (selesai Inti Dalam). Murid dengan skor 20 s.d. 80 poin konsisten menampilkan chip biru `[ PROGRES ]` dengan perolehan poin riil (misal `60 Poin`). | `src/app/TeacherDashboard/index.tsx` |
| 51 | **Logika Level Aktif Murid Stabil & Persisten (Mencegah Premature Level 2 Jump)**: Menghapus kenaikan level prematur saat menerima event `LEVEL_SUBMITTED` dari pos gerbang parsial (seperti Mantel 60 poin). Murid dipastikan tetap berstatus `LEVEL 1` hingga gerbang akhir Inti Dalam terbuka tuntas (100 poin). Status level aktif kini konsisten antara sesi langsung dan setelah halaman di-refresh. | `src/app/TeacherDashboard/index.tsx` |
| 52 | **Arsitektur Game 2D Level 2 — Tectonic Explorer & Konsep 3 Area Tektonik**: Merancang ulang Level 2 menjadi penjelajahan 2D open-world bertema dinamika batas lempeng tektonik yang dibagi menjadi 3 area sekuensial: Area 1 (Batas Divergen & Pangea), Area 2 (Batas Konvergen & Subduksi), dan Area 3 (Batas Transform & Sesar Geser). | `src/app/Level2/index.tsx`, `src/app/Level2/engine/zones.ts`, `src/app/Level2/level2Data.ts` |
| 53 | **Desain Lingkungan Area 1 (Batas Divergen & East African Rift Valley)**: Mengadaptasi lore kiamat geologis lembah retakan raksasa (*Great Rift Valley*) di sabana Afrika: lempeng daratan merekah saling menjauh, kepulan asap belerang, pendaran magma merah-jingga di dasar jurang vertikal dalam, platform tanah melayang yang bergerak perlahan mendatar (kiri-kanan), dan penyesuaian rintangan agar ramah anak tanpa parkur berlebihan yang menghukum. | `src/app/Level2/engine/zones.ts`, `src/app/Level2/engine/sprites.ts`, `src/app/Level2/engine/renderer.ts` |
| 54 | **Resolusi Circular Dependency & Layar Putih (White Screen Bug)**: Mengatasi masalah layar putih saat membuka Level 2 atau beralih dari Level 1 yang disebabkan siklus impor sirkular modul engine (`sprites.ts` Level 1 dan Level 2). Mengekstrak generator sprite avatar siswa ke utilitas mandiri `src/utils/studentAvatarSheet.ts` serta mendefinisikan konstanta `TILE = 32` secara lokal. | `src/utils/studentAvatarSheet.ts`, `src/app/Level1/EarthDive/engine/zones.ts`, `src/app/Level2/engine/sprites.ts`, `src/app/Level2/engine/zones.ts` |
| 55 | **Auto-Save Progres Level 2 & Proteksi Refresh**: Mengimplementasikan penyimpanan sesi otomatis ke `localStorage` dengan kunci unik `resqbox_level2_progress_${userId}` pada `TectonicGame.tsx` dan `gameEngine.ts`. Menjamin status geo-kristal terkumpul, gerbang teka-teki terbuka, dan posisi koordinat pemain tetap persisten saat halaman di-refresh. | `src/app/Level2/engine/gameEngine.ts`, `src/app/Level2/engine/TectonicGame.tsx`, `src/store/teacherStore.ts` |
| 56 | **Penyelarasan HUD Top Bar Level 2 Sesuai Standar Level 1**: Mengadopsi tata letak HUD atas yang konsisten dengan Level 1: tombol papan kayu `< MENU` langsung kembali ke `/` (beranda), tombol audio SFX, tombol Layar Penuh (⛶), badge pill nama area `● BATAS DIVERGEN`, serta pill status tengah (Geo-Crystals `{collectedCount}/{totalCrystals}` dan bar darah `{playerHp}%`). Menghilangkan radar map di pojok kanan atas agar adegan bersih. | `src/app/Level2/engine/TectonicGame.tsx` |
| 57 | **Eliminasi Dialog Konfirmasi Keluar & Fallback Navigasi Dashboard**: Menghapus dialog konfirmasi keluar yang mengganggu saat tombol `< MENU` ditekan sehingga siswa langsung diarahkan kembali ke menu utama (`/`). Menambahkan redirect fallback `<Route path="/dashboard" element={<Navigate to="/" replace />} />` pada `App.tsx` untuk mencegah error 404 pada rute legacy. | `src/app/Level2/engine/TectonicGame.tsx`, `src/App.tsx` |
| 58 | **Rekonstruksi Presisi Pangea 2D Pixel Art & Penghapusan Poligon Belah Ketupat**: Merombak total ilustrasi temuan geologis Pangea (Temuan 1 di `DiscoveryModal.tsx`) menjadi peta rekonstruksi superbenua 250 juta tahun lalu bergaya pixel art akurat: menghapus poligon belah ketupat (*rhombus/diamond sutures*) di lempeng Amerika Utara, menyatukan lekukan tanduk timur Eurasia menjadi kurva mulus tanpa garis sambungan putus, dan memastikan lekukan Brasil timur laut mengunci rapat ke Teluk Guinea Afrika. | `src/app/Level2/DiscoveryModal.tsx` |
| 59 | **Penyempurnaan Temuan Rantai Pegunungan Kembar & Batas Divergen Bersih**: Pada Temuan 2, menghapus elips hijau latar belakang di balik garis pegunungan kembar Appalachian–Caledonian agar tampak bersih di atas peta benua. Pada Temuan 3, menghilangkan animasi semburan/muncratan magma merah dari celah retakan lempeng divergen, menyajikan pemekaran kerak litosfer dan astenosfer secara elegan dan ilmiah. | `src/app/Level2/DiscoveryModal.tsx` |
| 60 | **Eliminasi Total Emoji Sistem Operasi & Standarisasi 100% SVG Pixel Icon**: Mengganti seluruh emotikon OS modern (seperti 💎, ❤️, 🌋, 🗺️, 📖, ❓, 🚪) di seluruh modul Level 2 (`TectonicGame.tsx`, `DiscoveryModal.tsx`, `CrosswordModal.tsx`, `MiniChallengeModal.tsx`, `level2Data.ts`, `zones.ts`) dengan ikon SVG pixel 2D kustom via `PixelIcon`, termasuk menambahkan ikon retro `heart`. | `src/components/PixelIcon.tsx`, `src/app/Level2/engine/TectonicGame.tsx`, `src/app/Level2/DiscoveryModal.tsx`, `src/app/Level2/CrosswordModal.tsx`, `src/app/Level2/MiniChallengeModal.tsx` |
| 61 | **Standarisasi Penamaan Resmi Area: Batas Divergen**: Menyeragamkan seluruh penamaan judul pada badge HUD atas, data misi, deskripsi zona, dan telemetri menjadi **Batas Divergen** menggantikan variasi istilah lama ("Zona Retakan Divergen" / "East African Rift"). | `src/app/Level2/engine/TectonicGame.tsx`, `src/app/Level2/level2Data.ts`, `src/app/Level2/engine/zones.ts` |
| 62 | **Proteksi Penguncian Level 3 & Syarat Ketuntasan 3 Area Penuh**: Memperbaiki celah pembukaan Level 3 prematur setelah menyelesaikan Area 1. Di `level2Sync.ts`, menetapkan bahwa `isDone` mutlak mensyaratkan penyelesaian ketiga area (`completedMissions.length >= 3`). Di `teacherStore.ts`, menambahkan penahan otomatis (*clamping*) untuk akun siswa (`unlockedLevel > 2` dibatasi maksimal ke 2) sehingga Level 3 tetap terkunci di dashboard. | `src/app/Level2/level2Sync.ts`, `src/store/teacherStore.ts`, `src/app/Level2/engine/TectonicGame.tsx` |
| 63 | **Penghapusan Modal Kemenangan Prematur & Plakat Transisi Antar-Area**: Menghapus modal dialog kemenangan prematur (`showVictoryModal`) saat menyelesaikan Area 1. Menggantinya dengan plakat naratif dalam game pada portal keluar yang mengumumkan tuntasnya eksplorasi Batas Divergen dan memberikan narasi pengantar menuju Area 2 (Batas Konvergen). | `src/app/Level2/engine/TectonicGame.tsx`, `src/app/Level2/engine/gameEngine.ts` |
| 64 | **Isolasi State Multi-User & Auto-Save Terisolasi Level 2 (`TectonicGame.tsx`, `teacherStore.ts`)**: Memperbaiki bug di mana progres Level 2 (status gerbang terbuka "TERBUKA" dan portal exit aktif) bocor ke akun siswa lain saat berganti akun. Mengambil `activeUserId` di `TectonicGame.tsx`, meneruskannya ke `createInitialGameStateL2(activeUserId)`, menyimpan progres per user ID saat TTS selesai (`handleCrosswordSuccess`), menyelaraskan dependency hook, serta membersihkan sisa key un-scoped `resqbox_level2_progress_guest` saat login/logout. | `src/app/Level2/engine/TectonicGame.tsx`, `src/app/Level2/index.tsx`, `src/store/teacherStore.ts` |
| 65 | **Perbaikan Fisika Jembatan & Kerusakan Bahaya Palung Area 2**: Memperbaiki bug pemain terkena damage saat melintasi Jembatan Karang Andesit di Area 2 (Batas Konvergen). Menambahkan proteksi `isSafeOnBridge` pada `player.ts` agar pemain kebal 100% dari hazard jurang selama berada di atas platform/jembatan, serta menaikkan ambang deteksi hazard palung ke `y >= 420` (hanya aktif jika jatuh ke jurang terdalam). | `src/app/Level2/engine/player.ts`, `src/app/Level2/engine/zones.ts`, `src/app/Level2/engine/sprites.ts` |
| 66 | **Eliminasi Objek Melayang di Area 2 (Zero-Floating Sprite Snapping)**: Menyelaraskan Stasiun Siaga (`lander_capsule`), tangga kembali (`portal_back`), gerbang evaluasi (`challenge_gate`), dan portal keluar (`portal_exit`) agar menapak 100% pas di permukaan tanah. Memperbarui kamus `OBJECT_GROUND_OFFSETS_L2` di `zones.ts` berdasarkan titik tumpu kaki/dasar sprite asli. | `src/app/Level2/engine/zones.ts` |
| 67 | **Penghapusan Tombol Bantuan Siaga / Bocoran Jawaban Evaluasi**: Menghapus tombol dan fungsi "BANTUAN SIAGA" serta petunjuk siaga pada modal teka-teki silang gerbang evaluasi (`CrosswordModal.tsx`) dan kuis tantangan (`MiniChallengeModal.tsx`) agar siswa menguji pemahaman sainsnya secara mandiri dan jujur. | `src/app/Level2/CrosswordModal.tsx`, `src/app/Level2/MiniChallengeModal.tsx` |
| 68 | **Penyelarasan Kurikulum & Keputusan Opsi A Area 2**: Menetapkan Area 2 berfokus pada 2 Temuan Geologis (Temuan 1: Dinamika Subduksi & Peleburan Lempeng, Temuan 2: 3 Bentang Alam Tumbukan). Menghapus temuan ke-3 (Megathrust/Sismograf) dari Area 2 untuk didistribusikan secara proporsional ke Area 3 (Batas Transform) agar materi terbagi rata dan tidak menumpuk. | `src/app/Level2/level2Data.ts`, `src/app/Level2/engine/zones.ts` |
| 69 | **Redesain Temuan 2 Menjadi 3 Gambar Terpisah Retro Pixel 2D**: Memisahkan 3 bentang alam konvergen dari diagram gabungan sempit menjadi 3 kanvas visual mandiri yang berganti penuh saat tab ditekan: (1) Palung Laut Dalam (kapal riset permukaan, jurang ngarai basalt curam, kapal selam riset kuning berlampu sorot, skala kedalaman 0–11.000m, komparasi Gunung Everest terendam >2.000m, dan biota laut dalam), (2) Rantai Pegunungan Lipatan (puncak salju, hutan pinus kaki bukit, penampang lipatan antiklin-sinklin, dan panah gaya tekan lempeng), (3) Busur Gunung Berapi Aktif Merapi (kawah kaldera magma, aliran lahar lereng, awan abu wedhus gembel, slab menunjam, dan dapur magma). | `src/app/Level2/DiscoveryModal.tsx` |
| 70 | **Perbaikan Tab Switcher Anti-Clipping**: Memperbaiki pemotongan garis tepi atas tombol tab `[1. PALUNG LAUT]`, `[2. PEGUNUNGAN]`, dan `[3. GUNUNG BERAPI]` dengan menambahkan padding atas yang lega (`pt-2.5 px-3 pb-2`), latar gelap kontras, dan mengeliminasi efek `-translate-y` yang menabrak batas kontainer modal. | `src/app/Level2/DiscoveryModal.tsx` |
| 71 | **Peringkasan Materi Sains & Desain Kartu Ramah Anak SMP Kelas 8**: Merampingkan seluruh teks temuan geologis dan catatan geologis (papan informasi) di Area 1 dan Area 2 menjadi 2-3 kalimat padat, serta mengubah kotak penjelasan bentang alam menjadi 3 kotak poin mini dengan ikon tematik (proses pembentukan, karakteristik/kedalaman, dan contoh nyata di Indonesia). Ilustrasi Area 1 tetap dipertahankan utuh. | `src/app/Level2/level2Data.ts`, `src/app/Level2/engine/zones.ts`, `src/app/Level2/DiscoveryModal.tsx` |
| 72 | **Perancangan Arsitektur Area 3: Batas Transform, Sesar San Andreas & Sismograf**: Menyusun rencana implementasi komprehensif (`implementation_plan.md`) untuk Area 3: lanskap ngarai sesar gurun keemasan (*canyon fault line*), 2 temuan sains (Sismograf & 20 Lempeng Tektonik Bumi, serta Sesar San Andreas & Patahan Semangko), 4 pos catatan geologis, evaluasi akhir TTS Area 3 (`TRANSFORM`, `SANANDREAS`, `SISMOGRAF`, `LEMPENG`), serta penyelesaian Level 2 dengan skor 100 dan sinkronisasi ke Dashboard Guru. | `implementation_plan.md`, `PRD.md`, `progress_report.md` |
| 73 | **Perekaman Riwayat Komprehensif Sesi & Pemutakhiran Dokumen Inti Proyek (`PRD.md`, `Readme.md`, `progress_report.md`)**: Menyusun rekam jejak percakapan lengkap dari awal sesi hingga akhir mengenai seluruh pekerjaan yang telah diselesaikan (Area 1, Area 2, refactor visual, bug fix, dan perancangan Area 3). Memperbarui `PRD.md` (bagian 5.3 dan 13), `Readme.md` (Level 2), dan `progress_report.md` agar seluruh dokumentasi tersinkronisasi 100% dengan kondisi kode terkini. | `PRD.md`, `Readme.md`, `progress_report.md` |
| 74 | **Implementasi Penuh Level 2 Area 3 (Batas Transform)**: Menyelesaikan pembangunan Area 3 (Batas Transform) secara menyeluruh: atmosfer senja ngarai gurun (*desert canyon twilight*), tebing sesar (*fault scarp*), badai debu keemasan berhembus, 2 modul temuan sains interaktif (Simulator Sismograf mekanik ke sinyal listrik & Peta pergeseran 20 lempeng bumi dari Pangea, serta Simulator geser mendatar Sesar San Andreas 5 cm/tahun dengan pembelokan sungai Wallace Creek & gempa dangkal), 4 pos catatan geologis, evaluasi Teka-Teki Silang (TTS) Area 3 (11x13) dengan 4 kata kunci sains (`TRANSFORM`, `SANANDREAS`, `SISMOGRAF`, `LEMPENG`), integrasi portal keluar Kapsul Evakuasi Akhir, penghargaan 3 lencana master, skor tuntas 100, dan pembukaan Level 3. | `src/app/Level2/level2Data.ts`, `src/app/Level2/engine/zones.ts`, `src/app/Level2/engine/gameEngine.ts`, `src/app/Level2/engine/renderer.ts`, `src/app/Level2/DiscoveryModal.tsx`, `src/app/Level2/CrosswordModal.tsx`, `src/app/Level2/engine/TectonicGame.tsx` |
| 75 | **Refaktor Balon Kata Catatan Geologis Proksimitas (Speech Bubble Tooltip)**: Mengubah popup catatan geologis (papan kayu informasi) dari modal layar penuh menjadi balon kata (*speech bubble*) melayang tepat di atas tiang saat karakter mendekat (`dist < 50px`), dan otomatis hilang saat menjauh tanpa perlu diklik manual. | `src/app/Level2/engine/TectonicGame.tsx`, `src/app/Level2/engine/zones.ts` |
| 76 | **Penyelarasan Terminologi Level 1 (Penghapusan "Sumur Bor" & "Elevator")**: Mengganti sebutan "Sumur Bor" menjadi "Turun Menuju Lapisan Selanjutnya" (Poros Turun Geotermal) dan "Elevator" menjadi "Naik Menuju Lapisan Sebelumnya" (Derek Naik Evakuasi) pada seluruh teks HUD, portal, dan modal peringatan akses gerbang di Level 1. | `src/app/Level1/EarthDive/engine/zones.ts`, `src/app/Level1/EarthDive/TelemetryHUD.tsx`, `src/app/Level1/EarthDive/EarthDiveGame.tsx` |
| 77 | **Fisika Platform Anti-Tunneling (Continuous Collision Detection - CCD)**: Memperbaiki bug karakter menembus platform gantung dan jembatan saat melompat atau double jump pada kecepatan jatuh tinggi (`vy >= 6`). Menerapkan deteksi swept vertical collision (`prevY <= plat.y + 8 && currentY >= plat.y - 4`), memperlebar toleransi tapak kaki (`footMargin = 10`), dan mengunci `player.y = plat.y` seketika saat pendaratan. | `src/app/Level1/EarthDive/engine/player.ts`, `src/app/Level2/engine/player.ts` |
| 78 | **Elevasi Jembatan Basal Level 1**: Menaikkan posisi jembatan basal di atas jurang magma agar menapak sejajar dan rapi di atas lava, tidak melesak atau berada di bawah permukaan lava. | `src/app/Level1/EarthDive/engine/zones.ts` |
| 79 | **Sinkronisasi Counter Temuan Geologis Header Level 2**: Memperbaiki pemetaan ID temuan geologis antara `gameEngine.ts` (`l2_disc_...`) dan katalog `level2Data.ts` (`disc-...`) sehingga counter temuan sains pada header HUD Level 2 bertambah secara real-time saat dibuka. | `src/app/Level2/engine/gameEngine.ts`, `src/app/Level2/engine/TectonicGame.tsx` |
| 80 | **Sistem Kristal Kumulatif Level 2 (Total 9 Kristal Kumulatif)**: Mengubah perhitungan kristal Level 2 menjadi kumulatif 9 kristal (3 kristal di masing-masing Area 1, Area 2, dan Area 3) serta menambahkan kristal ke-3 di Area 1 (`l2_crystal_3`). HUD menampilkan status kumulatif `X/9`. | `src/app/Level2/engine/zones.ts`, `src/app/Level2/engine/TectonicGame.tsx`, `src/app/Level2/level2Sync.ts` |
| 81 | **Integrasi Penuh Level 2 ke Teacher Dashboard & Cloud Sync**: Menghapus teks hardcoded `'Sedang disusun'` pada kolom evaluasi tektonik guru; menerapkan skoring dinamis bertahap (Area 1: 35 Poin, Area 2: 70 Poin, Area 3: 100 Poin tuntas & membuka Level 3), menghapus pembatas `Math.min(2, level)` di store, serta menyelaraskan modal detail siswa, cetak rapor, dan ekspor CSV. | `src/app/TeacherDashboard/index.tsx`, `src/store/teacherStore.ts`, `src/app/Level2/level2Sync.ts` |
| 82 | **Pemberantasan Crash Temuan ke-3 Zona 2 & Standarisasi 2 Temuan Sains**: Menghapus objek totem temuan ke-3 yang tersisa di Zona 2 pada `zones.ts` untuk mencegah modal error/crash, sehingga Area 2 memiliki tepat 2 temuan sains yang valid dan counter header tampil presisi `X/2`. | `src/app/Level2/engine/zones.ts`, `src/app/Level2/level2Data.ts` |
| 83 | **Stabilisasi Posisi Balon Informasi Catatan Geologis di Atas Tiang**: Mengembalikan posisi balon kata catatan geologis tepat di atas tiang kayu di dalam koordinat dunia game, mencegah balon berpindah ke header atau bergeser bersama pergerakan avatar. | `src/app/Level2/engine/TectonicGame.tsx` |
| 84 | **Modal Kemenangan Akhir Level 2 (`TectonicVictoryModal.tsx`)**: Mengimplementasikan modal selebrasi kemenangan ekspedisi tektonik yang megah menyerupai Level 1: piala pixel emas berkilau `<PixelTrophy>`, status pill hijau `EKSPEDISI TUNTAS!`, 3 lencana master lempeng tektonik, kristal terkumpul `X/9`, kartu narasi jembatan kausalitas menuju mitigasi bencana Level 3, serta navigasi ke Beranda atau langsung meluncur ke Level 3. | `src/app/Level2/TectonicVictoryModal.tsx`, `src/app/Level2/engine/TectonicGame.tsx` |
| 85 | **Animasi Jet Booster Biru Lompatan Ganda di Level 2**: Mengintegrasikan efek visual semburan api roket pendorong jet biru (`#00e5ff`) dengan inti putih terang (`#ffffff`), partikel percikan plasma biru berjatuhan (`#38bdf8`), serta pendaran cahaya halus di bawah kedua telapak kaki karakter saat melakukan double jump di Level 2, persis identik dengan animasi jet pendorong di Level 1. | `src/app/Level2/engine/renderer.ts`, `src/app/Level2/engine/player.ts` |
| 86 | **Transformasi Konsep RPG Visual Novel Level 1 (Catatan & Temuan Menjadi NPC)**: Mengubah mekanisme interaksi Level 1 (Earth Dive) dari papan catatan kayu statis menjadi petualangan RPG hidup dengan karakter NPC peneliti (Prof. Raditya, Kapten Maya, Dr. Gea, Prof. Andini, Inspektur Budi, Komandan Hendra). Mengimplementasikan sistem dialog Visual Novel (`VisualNovelDialogue.tsx`) dengan potret karakter 100% transparan tanpa kotak background, animasi ketik typewriter, micro-bounce saat berbicara, dan skema warna kotak chat yang tenang dan ramah mata. | `src/app/Level1/EarthDive/dialogueData.ts`, `src/app/Level1/EarthDive/VisualNovelDialogue.tsx`, `src/app/Level1/EarthDive/engine/npcSprites.ts`, `src/app/Level1/EarthDive/engine/npcManager.ts` |
| 87 | **Implementasi Robot Pemandu Maskot Resqy**: Menghadirkan Resqy sebagai maskot pemandu penjelajah 2D pixel art dengan widget HUD interaktif (`MascotGuide.tsx`), balon radar berdenyut, dan tips panduan kontekstual per area untuk membantu siswa SMP memahami kontrol dan alur penjelajahan. | `src/app/Level1/EarthDive/MascotGuide.tsx`, `src/app/Level1/EarthDive/dialogueData.ts`, `src/app/Level1/EarthDive/EarthDiveGame.tsx` |
| 88 | **Penyelarasan Bahasa Ramah Anak SMP Kelas 8 & Zero Istilah Asing**: Menyederhanakan seluruh bahasa dialog, alur cerita, dan materi temuan geologis agar ramah untuk anak SMP kelas 8: kalimat pendek (1-2 kalimat per balon dialog), tidak berbelit-belit, dan mengeliminasi seluruh istilah asing/teknis yang rumit (*exosuit, jet booster, singkapan litosfer, subduksi, basaltik, densitas, rig pemboran, astenosfer, SiAl*). Konsep ilmiah dijelaskan dengan bahasa sederhana (kerak benua = daratan, kerak samudra = dasar laut, lempeng tektonik = pecahan kulit bumi yang bergerak pelan). | `src/app/Level1/EarthDive/dialogueData.ts`, `src/app/Level1/EarthDive/earthDiveData.ts`, `src/app/Level1/EarthDive/EarthDiveGame.tsx` |
| 89 | **Penghapusan Objek Fisik Gerbang di Area 2 (Digantikan Komandan Hendra)**: Menghilangkan objek fisik `challenge_gate` di Area 2 (Kerak Bumi) dan mengalihkan evaluasi serta otoritas pembukaan pintu sepenuhnya kepada NPC Komandan Hendra. Soal evaluasi Wordle disederhanakan (`KERAK`, `BENUA`, `SAMUDRA`) dan 100% diambil dari materi yang diajarkan oleh Dr. Gea dan Prof. Andini. | `src/app/Level1/EarthDive/engine/zones.ts`, `src/app/Level1/EarthDive/engine/gameEngine.ts`, `src/app/Level1/EarthDive/EarthDiveGame.tsx` |
| 90 | **Resolusi Bug Kunci Gerbang & Alur Masuk Portal Murni**: Memperbaiki bug di mana penyelesaian tantangan via dialog NPC awalnya tidak mendaftarkan `crust_challenge` ke `unlockedGates` (karena `pendingChallenge` bernilai `null`). Memperbarui alur: jika soal sudah dikerjakan, pemain dapat langsung menekan tombol **ENTER** di portal untuk meluncur ke area berikutnya tanpa pop-up peringatan; pop-up *"Akses Turun Terkunci"* hanya muncul jika soal belum dikerjakan. Menghapus tombol manual *"Buka Akses Turun"* sesuai instruksi pengguna. | `src/app/Level1/EarthDive/EarthDiveGame.tsx`, `src/app/Level1/EarthDive/engine/gameEngine.ts` |
| 91 | **Standarisasi Desain Baku & Pedoman Pengembangan Area Selanjutnya (Area 3, 4, 5)**: Menetapkan pedoman baku untuk area selanjutnya di Level 1: hanya mengubah 3 komponen menjadi NPC (catatan geologis ➔ NPC, temuan geologis ➔ NPC materi, tantangan gerbang ➔ NPC penjaga pintu). Seluruh tampilan UI, kotak chat visual novel, skema warna, dan layout dilarang diubah agar konsisten, naskah dialog wajib ringkas (1-2 kalimat), ramah anak SMP kelas 8, dan bebas istilah asing. | `PRD.md`, `Readme.md`, `progress_report.md` |
| 92 | **Transformasi RPG Visual Novel & Standarisasi Area 3 (Mantel Bumi)**: Mengubah seluruh papan catatan kayu (`mantle_sign1`, `mantle_sign2`), temuan geologis (`mantle_disc1`, `mantle_disc2`), dan gerbang fisik (`mantle_challenge`) di Zona 2 (Mantel Bumi) menjadi 5 NPC hidup: Dr. Bayu, Prof. Sarah, Dr. Danang, Petugas Rudi, dan Komandan Surya. Menyederhanakan materi temuan 4 & 5 serta kuis tebak kata gerbang (`MANTEL`, `PANAS`, `KONVEKSI`) agar ramah anak SMP kelas 8 dan 100% diambil dari ajaran NPC. Mengintegrasikan briefing & tips Maskot Resqy (`mascot_mantle_intro` & `mascot_mantle_guide`) serta alur portal turun murni tanpa pop-up. | `src/app/Level1/EarthDive/engine/zones.ts`, `src/app/Level1/EarthDive/dialogueData.ts`, `src/app/Level1/EarthDive/engine/npcSprites.ts`, `src/app/Level1/EarthDive/engine/npcManager.ts`, `src/app/Level1/EarthDive/engine/gameEngine.ts`, `src/app/Level1/EarthDive/EarthDiveGame.tsx`, `src/app/Level1/EarthDive/earthDiveData.ts` |
| 93 | **Koreksi Posisi & Urutan Narasi NPC Mantel Bumi (Dr. Bayu & Prof. Sarah)**: Menyelaraskan tata letak karakter di teras awal Mantel Bumi: Dr. Bayu (ahli geologi & penyambut kedatangan) ditempatkan lebih awal di `px: 260` untuk menyapa penjelajah dan memberikan petunjuk arah ke bukit depan, sedangkan Prof. Sarah (ahli arus panas mantel) ditempatkan di teras depannya pada `px: 330` untuk membedah materi Temuan Geologis 4 (Arus Panas Konveksi). Menyelaraskan koordinat objek peta `zones.ts`, spawn & anchor `npcManager.ts`, serta anotasi pohon dialog `dialogueData.ts`. | `src/app/Level1/EarthDive/engine/zones.ts`, `src/app/Level1/EarthDive/engine/npcManager.ts`, `src/app/Level1/EarthDive/dialogueData.ts` |
| 94 | **Transformasi RPG Visual Novel & Standarisasi Area 4 (Inti Luar)**: Mengubah seluruh papan catatan kayu (`oc_sign1`, `oc_sign2`), temuan geologis (`oc_disc1`, `oc_disc2`), dan gerbang fisik (`oc_challenge`) di Zona 3 (Inti Luar) menjadi 5 NPC hidup: Dr. Fajar, Prof. Ratna, Dr. Aris, Petugas Joko, dan Komandan Teguh. Menyederhanakan materi temuan 6 & 7 serta kuis tebak kata gerbang (`LOGAM`, `CAIR`, `MAGNET`) agar 100% ramah anak SMP kelas 8 dan murni diambil dari materi yang diajarkan para NPC. Mengintegrasikan briefing & tips Maskot Resqy (`mascot_outer_core_intro` & `mascot_outer_core_guide`) serta alur portal turun murni tanpa pop-up. | `src/app/Level1/EarthDive/engine/zones.ts`, `src/app/Level1/EarthDive/dialogueData.ts`, `src/app/Level1/EarthDive/engine/npcSprites.ts`, `src/app/Level1/EarthDive/engine/npcManager.ts`, `src/app/Level1/EarthDive/engine/gameEngine.ts`, `src/app/Level1/EarthDive/EarthDiveGame.tsx`, `src/app/Level1/EarthDive/earthDiveData.ts` |
| 95 | **Penyempurnaan Dialog Komandan Teguh (Anti Bocor Jawaban & 2 Opsi Percabangan)**: Memperbarui percakapan Komandan Teguh agar tidak membocorkan kunci jawaban kata target. Menyajikan 2 pilihan percabangan: (1) Siap mengerjakan tantangan kuis tebak kata gerbang, atau (2) Ingin melihat-lihat dan membaca materi terlebih dahulu bagi siswa yang belum siap. Komandan Teguh menyambut ramah dan mengarahkan siswa menelaah kembali materi dari Prof. Ratna dan Dr. Aris. | `src/app/Level1/EarthDive/dialogueData.ts` |
| 96 | **Transformasi RPG Visual Novel & Standarisasi Area 5 (Inti Dalam)**: Mengubah seluruh papan catatan kayu (`ic_sign1`, `ic_sign2`), temuan geologis (`ic_disc1`, `ic_disc2`), dan gerbang fisik (`ic_challenge`) di Zona 4 (Inti Dalam) menjadi 5 NPC hidup: Dr. Bagus, Prof. Lestari, Dr. Farhan, Petugas Dian, dan Komandan Bintang. Menyederhanakan materi temuan 8 & 9 serta mengintegrasikan briefing otomatis & tips Maskot Resqy (`mascot_inner_core_intro` & `mascot_inner_core_guide`), dialog 2 opsi Komandan Bintang tanpa bocoran kunci jawaban, dan pembukaan kapsul akhir evakuasi menuju Level 2. | `src/app/Level1/EarthDive/engine/zones.ts`, `src/app/Level1/EarthDive/dialogueData.ts`, `src/app/Level1/EarthDive/engine/npcSprites.ts`, `src/app/Level1/EarthDive/engine/npcManager.ts`, `src/app/Level1/EarthDive/engine/gameEngine.ts`, `src/app/Level1/EarthDive/EarthDiveGame.tsx`, `src/app/Level1/EarthDive/earthDiveData.ts` |
| 97 | **Penyelarasan Soal Evaluasi Wordle Area 4 & 5 Sesuai Materi Pembelajaran**: Memperbarui kosakata dan petunjuk soal Wordle gerbang di `EarthDiveGame.tsx`: Area 4 (Inti Luar) diselaraskan menjadi `NIKEL`, `CAIRAN`, `MAGNET` dengan petunjuk bahasa Indonesia yang lugas; Area 5 (Inti Dalam) diselaraskan menjadi `BOLABESIPADAT` (13 huruf), `SEPULUHRIBU` (11 huruf), dan `PUSAT` (5 huruf) dengan dukungan grid dinamis responsif. Memperbaiki pengetikan kata agar baku dan mudah dimengerti siswa SMP kelas 8. | `src/app/Level1/EarthDive/EarthDiveGame.tsx`, `src/app/Level1/Wordle/index.tsx` |
| 98 | **Penyelarasan Total Batas Divergen (Area 6) dengan Level 2**: Mengadopsi map kontur 2.200 px (69 kolom) dari Level 2 ke Level 1, 3 platform jembatan magma beku (*cooled crust*), 3 jurang magma aktif, latar belakang tebing vulkanik berparalaks, 3 modul temuan geologis interaktif (Pangea 7 keping lempeng klik, Sabuk Pegunungan Kembar Appalachian-Caledonian, dan Simulator Gerak Pemekaran Samudra), 5 NPC RPG (Dr. Taufik, Prof. Maya, Dr. Citra, Prof. Ilham, Komandan Satria), serta mengoreksi teks banner portal turun Inti Dalam menjadi `"▼ BATAS DIVERGEN ▼"`. | `src/app/Level1/EarthDive/engine/zones.ts`, `src/app/Level1/EarthDive/engine/sprites.ts`, `src/app/Level1/EarthDive/DiscoveryModal.tsx`, `src/app/Level1/EarthDive/dialogueData.ts`, `src/app/Level1/EarthDive/EarthDiveGame.tsx`, `src/app/Level1/EarthDive/earthDiveData.ts` |
| 99 | **Penyempurnaan Modal Temuan Sains & Overhaul Magma Mengisi Penuh Celah Jurang**: Memperbesar tinggi kontainer gambar pada modal temuan di `DiscoveryModal.tsx` dari `h-52 sm:h-64` (208/256px) menjadi `h-72 sm:h-80` (288/320px) serta melepas pembatas `max-h-[300px]` pada SVG sehingga seluruh 3 modul materi Area 6 (Pangea, Pegunungan Kembar, Pemekaran) tampil penuh, jernih, dan tidak terpotong. Memperluas deteksi jurang di `sprites.ts` ke seluruh 6 celah jurang, menyelaraskan elevasi magma `magmaTopY = 375` agar mengisi penuh jurang hingga ke dasar terdalam (y=455) dengan gradien warna termal bertingkat (putih pijar, kuning panas, oranye cair, oranye tua, merah marun, dan dasar pekat), pulau kerak basal mengapung, pendaran glow permukaan, 6 titik kepulan uap fumarol, dan letupan gelembung magma aktif. | `src/app/Level1/EarthDive/DiscoveryModal.tsx`, `src/app/Level1/EarthDive/engine/sprites.ts` |
| 100 | **Resolusi Tuntas "Gerbang & Komandan Satria Hilang" (Dynamic Map Width 2.200 px & Camera Unlocking)**: Mengatasi masalah hilangnya Komandan Satria, Gerbang Tantangan Wordle, dan Portal Turun di Area 6. Mengganti batas peta statis `MAP_WIDTH_PX = 1280` menjadi dinamis `zone.cols * TILE` (2.208 px untuk Divergen) pada kamera `gameEngine.ts` (`initGame`, `handleTransitionStep`, `renderGame`), batas gerak karakter `initialX`, rendering medan penuh `renderOrganicZoneTerrain` di `sprites.ts`, dan elevasi tanah `getGroundY`/`getCeilingY` di `zones.ts`. Kini kamera bergulir mulus mengikuti pemain hingga ke Altar Akhir di mana Komandan Satria (`px: 2060`), Gerbang Wordle (`px: 2110`), dan Portal Turun (`px: 2160`) menyambut pemain secara utuh. | `src/app/Level1/EarthDive/engine/gameEngine.ts`, `src/app/Level1/EarthDive/engine/sprites.ts`, `src/app/Level1/EarthDive/engine/zones.ts` |
| 101 | **Pembesaran Ilustrasi Discovery Modal, Pembesaran Font Header Telemetri & Migrasi Soal ke NPC Komandan Satria**: Memperbesar wadah ilustrasi temuan sains pada `DiscoveryModal.tsx` menjadi penuh (`h-[380px] sm:h-[450px] md:h-[500px]`, modal `max-w-4xl`) dengan latar samudra menyatu dan viewBox SVG yang ketat tanpa border hitam sempit; memperbesar seluruh font telemetri header HUD di Level 1 (`TelemetryHUD.tsx`, `EarthDiveGame.tsx`) dan Level 2 (`TectonicGame.tsx`) menjadi `text-xs sm:text-sm md:text-base font-bold`; menghapus objek gerbang fisik dan memindahkan kuis evaluasi batas divergen (`PANGEA`, `MENJAUH`, `MAGMA`) ke NPC Komandan Satria dengan syarat telah membaca 3 materi peneliti. | `src/app/Level1/EarthDive/DiscoveryModal.tsx`, `src/app/Level1/EarthDive/TelemetryHUD.tsx`, `src/app/Level1/EarthDive/EarthDiveGame.tsx`, `src/app/Level2/engine/TectonicGame.tsx`, `src/app/Level1/EarthDive/dialogueData.ts` |
| 102 | **Overhaul Map Dinamis Area 6 (Batas Divergen): Animasi Terbelah Seismik Live, Gundukan Bukit Organik, Celah Magma Menganga Bersih, Tekstur Batuan Kaya, dan Hapus Tombol Tips Kiri Atas**: Merombak Area 6 menjadi compact (1350px) dengan celah rekahan di `x = 450` (395..505) tepat di tengah pandangan layar awal pemain sehingga animasi tanah membelah, bibir tebing melengkung menganga ke atas, dan magma mendesak naik terlihat 100% secara live; mengimplementasikan kontur gundukan bukit tektonik bergelombang alami (`getDivergentTerrainElevation`); menghapus platform parkur kotak di tengah magma sehingga celah murni menganga bersih dan dramatis; menambahkan tekstur strata sedimen horizontal, retakan mikro (*fissures*), dan bintik kerikil mineral basal/olivin; menghapus tombol manual tips maskot Resqy di pojok kiri atas dan menyatukan seluruh instruksi misi & peringatan keselamatan ke dalam briefing dialog awal otomatis Resqy saat memasuki area. | `src/app/Level1/EarthDive/engine/zones.ts`, `src/app/Level1/EarthDive/engine/sprites.ts`, `src/app/Level1/EarthDive/engine/npcManager.ts`, `src/app/Level1/EarthDive/EarthDiveGame.tsx`, `src/app/Level1/EarthDive/dialogueData.ts` |
| 103 | **Resolusi Bug Kematian Prematur di Lembah Kanan & Perbaikan Akses Portal Naik Kembali ke Inti Dalam**: Memperbaiki ambang batas `isDivergentMagmaFall` di `player.ts` yang sebelumnya masih menggunakan koordinat celah lama `775..945`, sehingga pemain salah dideteksi jatuh ke magma saat berjalan di lembah bukit timur (`x: 775..850`). Koordinat diselaraskan ke celah magma aktif yang baru (`x: 390..510`) sehingga pemain dapat menjelajah lembah timur dengan aman tanpa mati mendadak; memperbaiki posisi tangga `div_portal_up` dari `px: 40` menjadi `px: 60` di `zones.ts` serta melonggarkan batas heuristik koordinat `isNearObject` di `player.ts` agar prompt interaksi `[E]` naik kembali ke Inti Dalam terpicu secara andal saat pemain berdiri di dekat tangga. | `src/app/Level1/EarthDive/engine/player.ts`, `src/app/Level1/EarthDive/engine/zones.ts` |
| 104 | **Overhaul Efek Asap Magma Realistis (Sulur Uap Meliuk-liuk & Eliminasi Bentuk Bola Bulat)**: Menghapus total rendering lingkaran bola gelembung kaku (`ctx.arc`) pada efek asap celah magma di `sprites.ts`. Menggantinya dengan sulur uap vulkanik meliuk alami (*sinuous steam ribbons*) menggunakan kurva Bezier ganda dinamis yang merayap naik, melebar, dan memudar lembut ditiup angin sepoi-sepoi horizontal, dilengkapi pendaran warna hangat keemasan di pangkal celah lava, uap putih transparan di udara, serta partikel bara api mikro (*micro-embers*) yang mengapung ke atas. | `src/app/Level1/EarthDive/engine/sprites.ts` |
| 105 | **Penyederhanaan Judul Area 6 Menjadi "Batas Divergen" (Eliminasi Label Tambahan Lembah Retakan)**: Menyeragamkan penamaan resmi Area 6 pada header telemetri HUD, konfigurasi zona (`zones.ts`), dan metadata materi strata geologis (`earthDiveData.ts`) menjadi **Batas Divergen** murni (menghapus tanda kurung "Lembah Retakan") agar bersih, konsisten, dan serasi dengan penamaan resmi area lainnya. | `src/app/Level1/EarthDive/engine/zones.ts`, `src/app/Level1/EarthDive/earthDiveData.ts` |
| 106 | **Resolusi Tuntas Pop-up Prematur Level 1 di Batas Divergen & Karakter Freeze**: Mengatasi pop-up *"LEVEL 1 SELESAI"* yang muncul prematur di Area 6 saat menekan portal turun menuju Batas Konvergen (Area 7 & 8 ditahan pembuatannya menunggu arahan konsep dari siswa; portal diarahkan memunculkan toast persiapan area ramah tanpa memicu `pendingCoreChallenge`); serta mengatasi tuntas bug karakter macet/freeze total di lereng dan setelah modal ditutup dengan memperbaiki kalkulasi lereng `slopeDy = targetGroundY - currentGroundY` di `player.ts`, auto-snapping jika karakter melesak sesaat akibat tanah membelah, pembersihan state tombol `resetInputKeys()`, dan pengembalian fokus otomatis ke kanvas saat seluruh modal ditutup. | `src/app/Level1/EarthDive/engine/gameEngine.ts`, `src/app/Level1/EarthDive/engine/player.ts`, `src/app/Level1/EarthDive/EarthDiveGame.tsx`, `progress_report.md` |
| 107 | **Overhaul Total Batas Konvergen (Area 7: Subduksi Samudra, Palung di Tengah Laut & Gunung Berapi Daratan)**: Membangun ekosistem Batas Konvergen: perairan laut luas dengan navigasi Perahu Riset Oseanografi pixel 2D, palung samudra di tengah bentang laut (`x: 240..460`) yang menunjam miring ke bawah tanpa lava/jembatan, pengisian air laut penuh, perbaikan penapakan kaki NPC di tanah (`OBJECT_HEIGHTS.npc = 0`), penghalusan teras altar akhir dengan cosine S-curve kontinu (`x: 1220..1340`), dan pemulihan latar belakang langit tropis dan barisan pegunungan vulkanik andesit (`case 'convergent'`). | `src/app/Level1/EarthDive/engine/zones.ts`, `src/app/Level1/EarthDive/engine/sprites.ts`, `src/app/Level1/EarthDive/engine/npcManager.ts`, `src/app/Level1/EarthDive/EarthDiveGame.tsx` |
| 108 | **Penyempurnaan HUD Telemetri, Eliminasi Celah Palung, Upgrade Strata Kerak Samudra & Pembersihan Artefak Kotak Putih**: Menghapus tombol replay simulasi dari HUD; mengunci Telemetry HUD secara matematis di tengah layar (`fixed left-1/2 -translate-x-1/2`); mengeliminasi celah/gap tembus pandang pada lereng palung dengan formula profil dasar laut terpadu `getConvergentSeafloorProfile` dan fondasi mantel astenosfer solid dari `y = 356`; mengimplementasikan strata geologis otentik kerak samudra (*pelagic sediment, pillow basalt, sheeted dykes, layered gabbro* dengan kristal olivin & piroksen hijau zamrud); serta menghapus blok air mengalir dan partikel kotak putih pada air palung demi tampilan air laut murni alami. | `src/app/Level1/EarthDive/EarthDiveGame.tsx`, `src/app/Level1/EarthDive/engine/sprites.ts` |
| 109 | **Implementasi Penuh Area 8 (Batas Transform — Patahan San Andreas & POV Top-Down)**: Membangun zona ke-8 (terakhir) di Level 1 dengan sudut pandang unik dari atas (*2D Top-Down View*) di padang gurun California. Menggambarkan dinamika geseran mendatar (*strike-slip fault*) Lempeng Pasifik (bergerak ke barat laut) dan Lempeng Amerika Utara (bergerak ke tenggara), jalan raya terpotong geser, pembelokan saluran sungai Wallace Creek sejauh 130m, 5 NPC staf peneliti lapangan (Dr. Maya, Prof. Sarah, Dr. Taufik, Petugas Rudi, Komandan Guntur), serta Kapsul Evakuasi Kemenangan Akhir Level 1. | `src/app/Level1/EarthDive/engine/zones.ts`, `src/app/Level1/EarthDive/engine/sprites.ts`, `src/app/Level1/EarthDive/engine/npcSprites.ts`, `src/app/Level1/EarthDive/engine/renderer.ts`, `src/app/Level1/EarthDive/engine/player.ts`, `src/app/Level1/EarthDive/dialogueData.ts` |
| 110 | **Overhaul Visual Tekstur Solid Tanpa Celah, Rekahan Gempa Realistis, & Fisika Lompat Celah 3D**: Menghapus kerucut merah darurat di jalan; mengganti loop potong jalan dan sungai dengan poligon kurva kontinu padat (*zero scanline gaps*); mengganti garis miring monoton `/ / / /` dengan 25 benih rekahan sesar bercabang (*branching fissures*) bergradasi jurang hitam pekat dan sorotan bebatuan retak; mengimplementasikan batas tabrakan rintangan sesar ($Y = 228..252$) yang memblokir langkah kaki di tanah; serta menciptakan fisika lompatan top-down parabola 3D (`jumpZ`, gravitasi vertikal `jumpZVelocity`, bayangan dinamis mengecil) untuk melompati celah sesar. | `src/app/Level1/EarthDive/engine/sprites.ts`, `src/app/Level1/EarthDive/engine/player.ts`, `src/app/Level1/EarthDive/engine/renderer.ts` |
| 111 | **D-Pad 4 Arah Mobile/Tablet, Tombol Atas Murni Bergerak, Pemindahan Komandan Guntur & Akses Evaluasi Tuntas**: Menyediakan D-Pad sentuh berlian 4 arah (Atas, Bawah, Kiri, Kanan) di sisi kiri serta tombol aksi mandiri `LONCAT` dan `AKSI [E]` di kanan; memisahkan input keyboard dan sentuh agar tombol Atas murni bergerak vertikal ke atas (`dy = -SPEED`) tanpa memicu lompatan (lompat hanya via Spasi / tombol LONCAT); memindahkan Komandan Guntur dari dalam lubang sesar ($Y = 240$) ke daratan padat selatan ($X = 1360, Y = 315$) di samping Kapsul Akhir; menyelaraskan seluruh variasi kunci temuan geologis (`trans_seismo`, `trans_disc1`, `disc_15` & `trans_sanandreas`, `trans_disc2`, `disc_16`) untuk membuka evaluasi Wordle akhir bersama Komandan Guntur; merapikan layout HUD tablet kiri atas agar tidak bertumpukan; serta mengimplementasikan scaling kanvas `window.devicePixelRatio` dan font smoothing anti-burem pada zoom layar 250% dan layar Retina tablet. | `src/app/Level1/EarthDive/engine/player.ts`, `src/app/Level1/EarthDive/engine/zones.ts`, `src/app/Level1/EarthDive/engine/npcManager.ts`, `src/app/Level1/EarthDive/EarthDiveGame.tsx`, `src/app/Level1/EarthDive/TelemetryHUD.tsx`, `src/app/Level1/EarthDive/dialogueData.ts`, `src/index.css`, `src/app/Level2/engine/TectonicGame.tsx` |
| 112 | **Isolasi Penuh Progres Multi-Akun (Strict User Scoping)**: Mengatasi masalah akun lain/baru yang langsung melompat ke Area 8 (Batas Transform) akibat kebocoran kunci global cadangan (`resqbox_earthdive_progress`) dan persistensi referensi state game in-memory saat beralih akun. Menerapkan penguncian mutlak berbasis user ID (`resqbox_earthdive_progress_${userId}`), menghapus seluruh logika duplikasi (*mirroring*) dan *fallback* ke kunci bersama, melakukan *re-initialization* otomatis objek game di `EarthDiveGame.tsx` saat `activeUserId` berbeda sehingga akun baru selalu mulai dari 0 km, memasang penjaga (*guard*) pada *auto-save* saat browser ditutup/refresh, serta membersihkan sisa *cache legacy* saat login dan logout di `teacherStore.ts`. | `src/app/Level1/EarthDive/engine/gameEngine.ts`, `src/app/Level1/EarthDive/EarthDiveGame.tsx`, `src/store/teacherStore.ts` |
| 113 | **Penyelarasan Header Telemetri Diciutkan (Collapsible Pill) di Semua Layar**: Memperbarui bilah telemetri indikator di tengah atas layar menjadi tombol kapsul `[ 📢 TELEMETRI  ▼ ]` persis sesuai tangkapan layar pengguna di semua ukuran layar (mobile, tablet, laptop, desktop) serta lintas level (Level 1 & Level 2). Kondisi awal disetel terlipat/diciutkan (`isExpanded = false`) sehingga ruang bermain 100% lapang dan estetik. Mengklik bilah kapsul membuka seluruh indikator sains (Kedalaman, Tekanan, Suhu, Kristal, Temuan, dan HP) di bawah garis pembatas secara mulus, dan mengklik kembali melipatnya ke bentuk kapsul ringkas. | `src/app/Level1/EarthDive/TelemetryHUD.tsx`, `src/app/Level2/engine/TectonicGame.tsx`, `src/app/Level1/EarthDive/EarthDiveGame.tsx` |
| 115 | **Transformasi Area 1 Level 2 (Ruang Kelas SMP, Ekosistem 7 NPC, Background Statis & TTS Siaga Gempa)**: Menghapus paralaks meja-kursi agar kokoh di lantai, mengubah judul papan tulis menjadi `IPA: KELAS 8`, memisahkan mading gabus 3 pilar mitigasi, menambahkan 7 karakter NPC sekolah berseragam SMP, merombak ilustrasi mitigasi realistis, dan evaluasi Teka-Teki Silang (TTS). | `src/app/Level2/engine/renderer.ts`, `src/app/Level2/DiscoveryModal.tsx`, `src/app/Level2/dialogueDataL2.ts`, `src/app/Level2/engine/npcSpritesL2.ts`, `src/app/Level2/engine/npcManagerL2.ts`, `src/app/Level2/VisualNovelDialogueL2.tsx`, `src/app/Level2/engine/TectonicGame.tsx`, `src/app/Level2/engine/gameEngine.ts`, `src/app/Level2/engine/zones.ts`, `src/app/Level2/CrosswordModal.tsx` |
| 116 | **Transformasi Penuh Area 2 Level 2: Simulasi Tanggap Gempa Ruang Kelas (Drill Drop-Cover-Hold On, Cutscene Gempa 10 Detik, Animasi Batu Jatuh Menimpa Pemain, dan Evakuasi Tertib)**: Membangun simulasi gempa kelas interaktif: diawali penjelasan Bu Rahma di depan kelas (posisi siswa duduk di kursi), sirine gempa berbunyi, dialog peringatan darurat Bu Rahma sebelum QTE dimulai, QTE 10 detik untuk merunduk ke kolong meja, cutscene kegagalan realistis berupa batu beton runtuh menimpa kepala pemain disertai efek suara hurt & bintang pusing jika telat QTE, getaran gempa realistis halus (2.0–3.0px) selama 10 detik dengan alarm berulang, guru ikut berlindung di kolong meja guru, hingga aba-aba evakuasi tertib menuju pintu lapangan terbuka. | `src/app/Level2/engine/gameEngine.ts`, `src/app/Level2/engine/renderer.ts`, `src/app/Level2/dialogueDataL2.ts`, `src/app/Level2/engine/zones.ts`, `src/app/Level2/engine/TectonicGame.tsx` |
| 117 | **Ekosistem 16 Murid Kelas Konsisten, Pelindung Kepala Tas Ransel & Seruan Panik Realistis Multi-Meja**: Mengisi seluruh 16 meja belajar di kelas dengan murid (`CLASSROOM_STUDENTS_L2`: Rian, Dito, Siti, Budi, Fani, Edo, Maya, Reza, Dewi, Bayu, Tari, Doni, Lina, Agus, Putri, Gilang); murid konsisten 100% di semua fase (16 murid duduk saat mengajar, 16 murid merunduk dengan tas di kepala saat gempa, dan 16 murid berbaris serentak di koridor evakuasi menuju pintu keluar); balon seruan panik berukuran mini dengan variasi teks dari berbagai meja; serta merapatkan dan meninggikan meja belajar agar proporsional menampung siswa yang merunduk. | `src/app/Level2/engine/npcManagerL2.ts`, `src/app/Level2/engine/renderer.ts`, `src/app/Level2/engine/gameEngine.ts`, `src/app/Level2/engine/npcSpritesL2.ts` |
| 118 | **Perbesaran Kartu Overlay Popup (QTE 720x118, Timer Gempa 680x80, Evakuasi 680x78) & Zero-Emoji AI**: Memperbesar seluruh popup simulasi di layar (QTE overlay diperlebar ke 720x118 dengan bar timer 16px tebal, timer gempa diperbesar ke 680x80 dengan font 14px/9.5px tebal, indikator kedip beacon, dan progress bar elegan; serta kartu aba-aba evakuasi 680x78); membersihkan seluruh sisa emotikon Unicode/AI dan menggantinya dengan badge pixel `[!]`, `[AMAN]`, `[TIPS]`, `[ULANG]`. | `src/app/Level2/engine/renderer.ts`, `src/app/Level2/engine/TectonicGame.tsx` |
| 119 | **Pembenahan Poster Dinding Kelas (Poster SOP Gempa Frame 104px Anti-Tembus & Transformasi Rambu Resmi JALUR EVAKUASI Standar K3/BNPB Sesuai Gambar 3)**: Memperlebar frame kayu poster SOP Gempa dari 70px menjadi 104px (`p1W = 104px`) sehingga butir 1. MERUNDUK, 2. BERLINDUNG, 3. BERTAHAN, dan DI BAWAH MEJA tidak lagi tembus ke luar batas frame (margin kanan lega 24px); serta merombak poster Titik Kumpul (yang sebelumnya hanya kotak hijau polos) menjadi Rambu Resmi **JALUR EVAKUASI** standar K3/BNPB (latar hijau keselamatan `#007a3d`, garis tepi putih ganda, panel atas pintu darurat putih dengan siluet orang berlari hijau, divider garis putih, teks bold `JALUR EVAKUASI`, dan panah tebal putih menunjuk ke kanan menuju pintu evakuasi). | `src/app/Level2/engine/renderer.ts`, `src/app/Level2/engine/zones.ts` |
| 120 | **Resolusi Pintu Kembali Area 2 ke Area 1 & Perbesaran Popup Judul Area Level 2**: Memperbaiki akses interaksi tombol `E` pada pintu keluar koridor barat Area 2 (`portal_back` di `x: 60`) agar pemain dapat kembali ke Area 1 Ruang Kelas Teori dengan lancar; serta memperbesar ukuran kartu popup nama area saat transisi masuk di Level 2 (`text-sm sm:text-base md:text-lg`, padding luas, dan bingkai kayu pixel 3D) persis proporsional dengan Level 1. | `src/app/Level2/engine/gameEngine.ts`, `src/app/Level2/engine/TectonicGame.tsx` |
| 121 | **Transformasi Penuh Area 3 Level 2: Lapangan Evakuasi Pascabencana (Titik Kumpul Standar BNPB, Ambulans Menapak Tanah, Rumput Lapangan Statis Anti-Jitter, Briefing Otomatis Resqy, Ekosistem 5 NPC, dan Evaluasi TTS Komandan Satria)**: Merombak Area 3 (Lapangan Sekolah Pascabencana): mengganti catatan dan temuan geologis statis menjadi 5 karakter NPC hidup (Rian, Bu Rahma, Budi, Maya, Komandan Satria); mengimplementasikan briefing otomatis Maskot Resqy saat masuk area; mendesain ulang rambu Titik Kumpul sesuai standar BNPB (Gambar 3: hijau `#14532d`, 4 panah inward, 4 figur siluet, teks `TITIK` `KUMPUL`); mengoreksi ambulans agar menapak tanah di `y: 360` dengan bayangan dan kaca sejajar; mengganti lantai paving dengan rumput hijau statis berbasis grid dunia mutlak (`stepX = 28`) sehingga bebas jitter saat melangkah; mengeliminasi pintu ganda yang bertumpukan di awal area; menghapus garis polisi melayang; memperbaiki pelacakan counter temuan HUD telemetri; serta menyelaraskan evaluasi TTS ramah anak SMP kelas 8 (`TITIKKUMPUL`, `AMBULANS`, `P3K`, `AMAN`) tanpa bocoran jawaban. | `src/app/Level2/engine/renderer.ts`, `src/app/Level2/engine/TectonicGame.tsx`, `src/app/Level2/engine/gameEngine.ts`, `src/app/Level2/dialogueDataL2.ts`, `src/app/Level2/engine/npcManagerL2.ts`, `src/app/Level2/DiscoveryModal.tsx`, `src/app/Level2/VisualNovelDialogueL2.tsx`, `src/app/Level2/engine/zones.ts`, `src/app/Level2/level2Data.ts` |

---

## 2. Rincian Teknis Implementasi Fitur

### A. Title Screen 2D Pixel Volcano (`Dashboard/index.tsx`)
- **Visual Scene**: Adegan SVG pemandangan alam retro pixel art 2D dengan gunung berapi aktif di tengah, lahar berdenyut (`#ef4444` & `#fde047`), kepulan asap kawah 3-layer beranimasi, awan siang bergeser lambat, dan matahari berdenyut lembut.
- **HUD Player**: Di pojok kiri atas terdapat kartu profil Taruna (Avatar, Nama, Sekolah, Indikator Kesiapsiagaan Level) yang terhubung ke store.
- **HUD Kontrol**: Tombol Audio SFX (mute/unmute) dan tombol Layar Penuh (⛶) untuk proyektor kelas.
- **Menu Utama Papan Kayu 3D**:
  1. `1. EARTH EXPLORER` (Struktur Bumi & Dinamika Lempeng Tektonik)
  2. `2. DISASTER ANALYST` (Karakteristik Gempa & Erupsi Vulkanik Merapi)
  3. `3. SIMULATION GAME` (Mission Center, Action Lab Blockly, Evacuation Digital Twin)
  4. Tombol utilitas: `PANDUAN & MISI` (Modal 3-Tab), `PROFIL SISWA` (Navigasi `/profile`), `CREDITS` (Navigasi `/credits`).

### B. Halaman Profil Siswa (`Profile/index.tsx`)
- **Visual Scene**: *Nighttime Starry Rescue Camp* (Langit malam gradien `#050814` ke `#3d2c52`, bintang kelap-kelip pixel, bulan kawah bercahaya, dan siluet pohon pinus).
- **Papan Pengumuman Perkamen Kayu (`.pixel-wood-board`)**:
  - Pemilihan 4 karakter avatar pixel: Rescuer Boy, Rescuer Girl, Ahli Geologi, Rescue Bot.
  - Input biodata: Nama Lengkap, Kelas, Nomor Absen, Asal Sekolah.
  - Pengaturan PIN Akses Murid 4 Digit.
  - Rekam jejak status kesiapsiagaan (Level 1, 2, 3 Unlock Status).
  - Tombol bertumpuk vertikal: `SIMPAN PROFIL TARUNA ➔` di atas dan `◀ KEMBALI KE MENU UTAMA` di bawahnya.

### C. Halaman Credits Tim Pengembang (`Credits/index.tsx`)
- **Visual Scene**: *Sunset Golden Mountain* (Langit senja jingga-keemasan, siluet gunung gelap, awan senja, dan kunang-kunang bara api berterbangan).
- **Formasi Tim Resmi**:
  1. **Muhammad Zidane Romadhona Haryanto** — Ketua Tim & Developer Utama
  2. **Ichsan Abror** — Hardware Engineer
  3. **Zahra Rokhadatul Aisy Ramadhani** — UI/UX Designer & Asisten Developer
  4. **Lintang Pansavia Lysandra** — Penyusun Materi IPA & Manajemen Laporan
  5. **Rizki Arumning Tyas, M.Pd.** — Dosen Pendamping Inovasi Pembelajaran Digital Mitigasi Bencana • Universitas Negeri Yogyakarta
- **Navigasi Bersih**: Tombol papan kayu `⯇ KEMBALI KE MENU UTAMA` tanpa kotak teks teknologi.

### D. Audio Synthesizer 8-Bit Native (`retroAudio.ts`)
- Menggunakan browser Web Audio API `AudioContext` sintetis:
  - `playSelect()` (nada square C5 -> G5)
  - `playHover()` (nada sine halus A5)
  - `playUnlock()` (melodi arpeggio C5-E5-G5-C6)
  - `playSuccess()` (akor mayor ceria)
  - `playError()` (nada sawtooth rendah)
- Memiliki kontrol on/off global yang disimpan di `localStorage`.

### E. Standar Desain Layar Penuh (Zero-Header Viewport)
- Seluruh elemen navbar/header atas konvensional telah dihapus total dari `AppLayout.tsx`.
- Seluruh halaman modul berikutnya mengadopsi standar:
  - Layar penuh adegan game 2D (*pure viewport*).
  - Navigasi dalam adegan berbasis tombol kayu retro atau pintu gerbang pixel.
  - Tipografi pixel konsisten: `'Press Start 2P'` untuk judul/tombol dan `'Pixelify Sans'` untuk teks bacaan.

### F. Keamanan & Proteksi Runtime (Fase 1 & Fase 2 Security Hardening)
- **Password Hashing**: Menggunakan `pgcrypto` dan RPC Supabase (`verify_login`, `register_student_account`, dll) dengan enkripsi Bcrypt.
- **RLS & Hak Akses Anon**: Policy akses tabel diperketat dengan write ops dibatasi via RPC berotoritas `SECURITY DEFINER`.
- **Anti HTML Injection**: Sanitasi `escapeHtml()` pada dialog cetak rapor dan kartu evaluasi guru.
- **Sandbox Blockly & Loop Protection**: Blacklist regex sanitasi script JavaScript dan pembatasan durasi eksekusi simulasi maksimal 60 detik.

### G. Arsitektur Engine Game Earth Dive (Level 1 Exploration Engine)
- **Continuous Ground & Ceiling Geometry**: Menggunakan kalkulasi interpolasi cosine matematis (`groundPoints` dan `ceilingPoints`) beresolusi per piksel (1280 px lebar peta), membebaskan game dari keterbatasan grid kotak 32px kaku.
- **Smooth Slope Physics Traversal**: Karakter menaiki dan menuruni tanjakan pegunungan lipatan serta jembatan gantung dengan elevasi dinamis (`getEffectiveGround`), tanpa efek tersangkut (*snagging*) atau jatuh patah-patah.
- **Two-Pass Ground Snapping**: Penataan elevasi berbasis urutan eksekusi ketat: `snapPlatformsToGround` terlebih dahulu mengunci posisi jembatan/perancah kayu, dilanjutkan dengan `snapObjectsToGround` yang meletakkan objek tepat di atas permukaan teratas (tanah atau dek jembatan).
- **Directional Spawning Logic**:
  - `down` (menyelam ke lapisan lebih dalam): Mengarahkan pemain ke spawn point awal di sebelah kiri peta dekat portal naik (`upPortal.px + 50`), dengan arah hadap ke kanan (`dir = 'right'`).
  - `up` (naik kembali ke lapisan atas): Mengarahkan pemain ke spawn point akhir di sebelah kanan peta dekat portal turun/sumur bor (`downPortal.px - 55`), dengan arah hadap ke kiri (`dir = 'left'`).
  - Posisi kamera disinkronkan secara instan (*hard clamp viewport*) saat transisi tengah terjadi agar pemain langsung terlihat jelas di layar tanpa jeda visual.

### I. Lingkungan Pertambangan Dalam (Deep Mining Zone Scenery)
- **Atmosfer Tambang Eksplorasi Geologi**: Latar belakang zona Kerak Bumi (`engine/sprites.ts`) dirancang menjadi lingkungan terowongan tambang batuan dalam (*Deep Mining Tunnel*) dengan balok-balok penyangga kayu kokoh (*timber bents*), tiang silang, kabel lampu gantung, lentera dengan kilau hangat beranimasi, dan rel lori tambang.
- **Natural Rock Strata & Seamless Tiles**: Dinding batuan menampilkan lapisan stratifikasi geologis yang menyatu tanpa pengulangan pola (*pattern tiling*) yang kaku dan bebas dari elemen penanda buatan yang tidak diinginkan (`POS-01`, dll.).

### J. Diagram & Animasi Geologis Batas Lempeng Tektonik (`DiscoveryModal.tsx`)
- **Batas Divergen (Pemekaran Dasar Samudra & Magma Naik)**: Panah merah lurus horizontal mengarah saling menjauh, dilengkapi animasi CSS pergeseran lempeng kiri & kanan serta pancaran magma meleleh yang berdenyut naik di celah retakan pemekaran (*mid-ocean ridge*).
- **Batas Konvergen (Subduksi & Peleburan Lempeng)**:
  - Penataan urutan render (*stacking order*) SVG agar lempeng samudra kiri (`anim-conv-oceanic`) memiliki z-index lebih tinggi di atas lempeng benua kanan (`anim-conv-continental`).
  - Penghapusan poligon artefak hitam (`#1e293b`) pada permukaan hijau.
  - Penyatuan presisi permukaan hijau lempeng kanan langsung menyentuh garis palung laut biru di `(220,118)` hingga `(258,72)`.
  - Animasi pergeseran lempeng kiri disempurnakan menjadi murni mendatar ke kanan (`translateX(12px)`) searah tumbukan horizontal.
- **Batas Transform (Sesar Geser Mendatar)**:
  - Balok litosfer dan astenosfer diselaraskan sebidang (*coplanar*) pada ketinggian yang sama.
  - Arah panah merah diarahkan memanjang sejajar garis patahan (maju/ke bawah dan mundur/ke atas).
  - Penghapusan poligon astenosfer statis di belakang balok kanan yang sebelumnya meninggalkan garis artefak saat animasi geser berlangsung.

### K. Dynamic Wordle Evaluation Engine & Victory Modal (`Wordle/index.tsx`)
- **Panjang Kata Fleksibel**: Mendukung variasi jumlah huruf target secara dinamis (`wordLength = targetWord.length || 5`) dengan penyesuaian ukuran ubin kotak huruf responsif (`w-9`, `w-8`, `w-7`).
- **Header Pill Indikator**: Menampilkan badge `[N] HURUF` di bagian atas agar siswa langsung memahami panjang kata target.
- **Victory Completion Card**: Saat Wordle diselesaikan di dalam modal tantangan mini, sistem memunculkan kartu kemenangan khusus bertema retro dengan tombol kembali yang rapi.

### L. Refresh Protection & Auto-Save Session Persistence
- **State Serialization (`localStorage`)**: `EarthDiveGame.tsx` dan `gameEngine.ts` secara otomatis menyimpan progres penjelajahan siswa (kunci `resqbox_earthdive_progress_${userId}`) mencakup: zona aktif (`currentZoneIndex`), koordinat posisi pemain (`playerX`, `playerY`), jumlah kristal, daftar temuan sains yang dibuka (`discoveredIds`), dan status gerbang terbuka (`unlockedGates`).
- **Seamless Recovery**: Jika browser ter-refresh secara tidak sengaja, game secara otomatis memulihkan state terakhir tanpa membuat siswa mengulang dari Permukaan Bumi.

### M. Simulasi Geodynamo & Medan Magnet Inti Luar (`engine/sprites.ts`)
- **Penjelasan Ilmiah Fluida Logam**: Lapisan Inti Luar (2.900–5.150 km) terdiri dari besi-nikel cair bersuhu 9.000°F yang berkonveksi kencang akibat rotasi bumi (efek Coriolis). Putaran fluida konduktif ini bertindak sebagai dinamo alami raksasa (*geodynamo*), membangkitkan arus listrik ribuan ampere dan medan magnet bumi yang memantulkan radiasi kosmik berbahaya.
- **Rendering Visual Rapi**: Menggantikan overflow magma yang keluar kotak dengan sistem partikel plasma terkontrol, loop lucutan listrik biru-cyan (`#38bdf8`, `#22d3ee`), dan pusaran konveksi fluida magnetik yang terkurung rapi di dalam batas kanvas zona.

### N. Sel Konveksi Termal Mantel Bumi (`engine/sprites.ts`)
- **Dua Sel Rayleigh-Bénard Berlawanan Arah**: Konveksi mantel kini digambarkan dengan dua sel sirkulasi batuan kental panas (*hot rising plumes* dari batas inti-mantel D'') dan lempeng dingin yang menunjam (*cold descending slabs*).
- **Penahanan Batas Kanvas**: Memperbaiki masalah poligon magma yang sebelumnya menonjol keluar dari batas frame, menyelaraskan aliran magma di bawah litosfer dengan batas batuan peridotit & bridgmanit.

### O. Istana Kristal Heksagonal Inti Dalam & Puncak Ekspedisi Wordle 5-Kata
- **Arsitektur Teras Datar ($Y=350, 300, 240, 310$)**: Zona Inti Dalam dibangun dengan 4 teras datar presisi sehingga karakter dan objek sains (altar gravitasi nol, kristal inti, papan catatan geologi) berdiri kokoh tanpa kemiringan melayang atau tenggelam.
- **Puncak Ekspedisi Wordle Sintesis**: Tantangan gerbang akhir Inti Dalam di `CoreChallengeModal.tsx` menyatukan pemahaman geologi menyeluruh lewat 5 kata target berturutan:
  1. `LEMPENG` (Kerak Bumi — litosfer kaku pengapung benua)
  2. `KONVEKSI` (Mantel Bumi — arus sirkulasi termal pendorong lempeng)
  3. `DINAMO` (Inti Luar — pembangkit perisai magnetosfer bumi)
  4. `TEKANAN` (Inti Dalam — tekanan >3,6 juta atm penahan bola besi tetap padat di suhu 10.000°F)
  5. `SUBDUKSI` (Kausalitas Bencana — penunjaman lempeng pemicu gempa bumi dan kantung magma Merapi)
- **Gerbang Fisik Terbuka & Kapsul Akhir Evakuasi**: Penyelesaian kata ke-5 langsung melenyapkan gerbang pembatas di kanvas game (`ic_challenge`), mengaktifkan kapsul akhir (`ic_portal_exit` — `★ KAPSUL AKHIR ★`), serta menyajikan opsi navigasi transisi ke Level 2 atau kembali ke Menu Utama.

### P. Sinkronisasi Real-Time & Skoring Dinamis 20 Poin per Lapisan (`earthDiveSync.ts`)
- **Skala Penilaian Geologis Dinamis**:
  - Kerak Bumi (Zone 0/1): **20 Poin** (Lencana *Surface Scout*, Kata: *KERAK, LITOSFER, TEKTONIK*)
  - Lempeng Tektonik (Zone 1): **40 Poin** (Lencana *Tectonic Tracker*, Kata: *ASTENOSFER*)
  - Mantel Bumi (Zone 2): **60 Poin** (Lencana *Mantle Explorer*, Kata: *KONVEKSI, BRIDGMANIT*)
  - Inti Luar (Zone 3): **80 Poin** (Lencana *Magnetic Shield*, Kata: *GEODYNAMO, FLUIDA*)
  - Inti Dalam (Zone 4): **100 Poin** (Lencana *Core Specialist*, Kata: *LEMPENG, KONVEKSI, DINAMO, TEKANAN, SUBDUKSI*)
- **Telemetri Tanpa Jeda**: Setiap kali gerbang evaluasi dibuka atau zona beralih, `syncEarthDiveProgress` menyalurkan pembaruan detail lapisan, jumlah kristal, dan kata kunci sains secara instan ke cloud Supabase dan dasbor guru.

### Q. Isolasi Multi-User State & Proteksi Akun Siswa (`gameEngine.ts`, `teacherStore.ts`)
- **User-Scoped Progress Key**: Progres Earth Dive disimpan dengan kunci beridentitas unik `resqbox_earthdive_progress_${userId}` dan level terbuka `resqbox-unlocked-level_${userId}`.
- **Pembersihan Bersih Saat Logout**: Memastikan state akun `demo` (yang membuka semua level) tidak bocor atau menimpa progres akun siswa lain yang login pada peramban yang sama.

### R. Posko Guru: Penataan Kotak Level, Status Progres & Level Aktif Stabil (`TeacherDashboard/index.tsx`)
- **Anti-Wrap Level Badge**: Mengubah badge `LEVEL 1` / `LEVEL 2` menjadi `inline-block whitespace-nowrap text-nowrap` dengan non-breaking space Unicode (`\u00A0`), mencegah teks patah ke bawah menjadi dua baris.
- **Kondisi Ketuntasan Ketat**: Status `[ TUNTAS ]` mutlak mensyaratkan skor 100 poin penuh. Murid dengan capaian parsial (20–80 poin) menampilkan chip biru `[ PROGRES ]` dengan perolehan skor riil.
- **Level Aktif Stabil**: Event `LEVEL_SUBMITTED` kini hanya menaikkan level aktif murid jika level telah selesai 100% (skor 100 atau `is_completed`). Murid tetap berstatus `LEVEL 1` selama masih menyelesaikan Level 1, sehingga status konsisten baik sebelum maupun sesudah refresh halaman.

### S. Arsitektur 2D Tectonic Explorer Level 2 (`Level2/engine/*`)
- **Struktur 3 Area Sekuensial**: Membagi Level 2 menjadi tiga zona tektonik bertahap:
  1. **Area 1: Batas Divergen** (Lembah Retakan Afrika / *East African Rift*, rekonstruksi superbenua Pangea, bukti rantai pegunungan kembar, dan pemekaran litosfer).
  2. **Area 2: Batas Konvergen** (Zona subduksi lempeng samudra menunjam ke bawah lempeng benua, palung laut, pembentukan busur vulkanik gunung api aktif, dan kantung magma).
  3. **Area 3: Batas Transform** (Patahan geser mendatar seperti Sesar San Andreas / Patahan Semangko Sumatera, akumulasi tegangan geser elastis, dan pelepasan gempa dangkal dahsyat).
- **Atmosfer & Terrain Area 1**:
  - *Lore Geologis*: Wilayah sabana Afrika timur yang sedang mengalami kiamat geologis pemisahan kerak benua (*rifting*).
  - *Pixel Terrain & Moving Platforms*: Platform tanah batuan kaku terpisah oleh celah jurang vertikal dalam (*rift valley*), pendaran magma merah-jingga di dasar celah, kepulan partikel asap belerang vulkanik, serta platform bergerak horizontal perlahan (kiri-kanan) yang mencontohkan konsep lempeng bergerak saling menjauh secara alami tanpa parkur ekstrem.
- **Integrasi Avatar Siswa Mandiri (`studentAvatarSheet.ts`)**:
  - Menghilangkan *circular dependency* antara Level 1 dan Level 2 dengan memindahkan pembuatan lembar sprite prosedural ke utilitas terisolasi.
  - Mendukung 4 pilihan karakter siswa: Rescuer Boy, Rescuer Girl, Geologist, dan Rescue Bot lengkap dengan frame animasi lari (*walk cycle*), lompat naik, melayang jatuh, dan pendaratan (*squash*).

### T. Rekonstruksi Superbenua Pangea & Diagram Geologis Pixel Art Presisi (`DiscoveryModal.tsx`)
- **Temuan 1 — Superbenua Pangea (250 Juta Tahun Lalu)**:
  - Rekonstruksi visual 2D pixel art akurat superbenua Pangea yang menyatukan seluruh massa daratan bumi purba di tengah samudra raksasa Pantalasa.
  - Menghilangkan bentuk anomali belah ketupat (*rhombus/diamond polygons*) pada bagian pedalaman Amerika Utara.
  - Menyatukan tanduk timur Eurasia menjadi kurva melengkung mulus alami tanpa garis sambungan terputus.
  - Memastikan lekukan pantai timur laut Amerika Selatan (Brasil) mengunci rapat ke dalam Teluk Guinea di Afrika Barat (*jigsaw puzzle fit*).
  - Bersih dari logo eksternal maupun teks tipografi yang menutupi esensi benua.
- **Temuan 2 — Bukti Rantai Pegunungan Kembar (Appalachian & Caledonian)**:
  - Peta benua dunia nyata (Amerika Utara, Eropa, Afrika Barat Laut) yang mendemonstrasikan kelanjutan strata batuan dan fosil yang identik terputus oleh Samudra Atlantik.
  - Menghilangkan bentuk elips hijau latar belakang di balik garis sabuk pegunungan agar visual tampak elegan dan tajam di atas peta dasar samudra.
- **Temuan 3 — Mekanisme Batas Divergen Bersih**:
  - Menggambarkan pemekaran lempeng litosfer kaku yang bergerak mendatar perlahan ke kiri dan ke kanan, dengan litosfer yang menipis membentuk lembah retakan (*rift valley*).
  - Mengeliminasi animasi semburan/muncratan magma merah dari retakan untuk menjaga ketepatan pedagogis fenomena divergen kontinental tahap awal, menyajikan aliran astenosfer dasar yang bersih.

### U. Sistem Teka-Teki Silang (Crossword Puzzle) Kunci Gerbang Tektonik (`CrosswordModal.tsx`)
- **Mekanika Evaluasi Evaluatif**: Sebagai syarat membuka gerbang portal batas divergen, siswa harus memecahkan teka-teki silang geologis interaktif:
  - *1 Mendatar*: `PANGEA` (Superbenua raksasa 250 juta tahun lalu sebelum terpecah).
  - *2 Menurun*: `AFRIKA` (Benua tempat terjadinya fenomena Great Rift Valley).
  - *3 Mendatar*: `DIVERGEN` (Batas lempeng yang bergerak saling menjauh).
  - *4 Menurun*: `RIFT` (Lembah retakan curam hasil pemisahan dua lempeng).
- **Interaktivitas Taktil 2D Pixel**: Grid ubin huruf retro dengan penyorotan aktif (*active cell highlight*), navigasi keyboard otomatis maju ke petak berikutnya, validasi instan, dan feedback audio chiptune 8-bit (*Web Audio API*).

### V. Sistem Proteksi Penguncian Level 3, Anti-Prematur & Auto-Save Terisolasi
- **Prasyarat Ketuntasan 3 Area Penuh (`level2Sync.ts`)**:
  - `isDone` untuk Level 2 diatur secara ketat hanya bernilai `true` apabila siswa telah menuntaskan seluruh 3 area tektonik (`completedMissions.length >= 3`).
  - Menyelesaikan Area 1 (Batas Divergen) murni mencatat progres parsial dan tidak membuka Level 3 di beranda.
- **Clamping Level Terbuka Akun Siswa (`teacherStore.ts`)**:
  - Menambahkan pengaman otomatis saat pemuatan state: jika level siswa tercatat lebih dari 2 padahal Level 2 belum tuntas 3 area, level terbuka otomatis distabilkan (*clamped*) ke Level 2.
  - Menghapus pemanggilan `unlockLevel(3)` prematur dari `TectonicGame.tsx`.
- **Penghapusan Modal Kemenangan Prematur & Plakat Transisi**:
  - Menghapus modal kemenangan `showVictoryModal` pada akhir Area 1.
  - Portal akhir Area 1 kini menampilkan plakat pengumuman di kanvas bahwa eksplorasi Batas Divergen telah tuntas dan memberi arahan untuk bersiap memasuki Batas Konvergen berikutnya.
- **Penyelarasan HUD Top Bar & Zero-Emoji Standard**:
  - HUD atas diselaraskan persis dengan estetika Level 1: tombol kayu `< MENU` langsung kembali ke `/`, tombol audio, tombol layar penuh (⛶), badge pill `● BATAS DIVERGEN`, dan pill kristal serta HP.
  - Seluruh emoji bawaan OS digantikan oleh ikon SVG pixel kustom `PixelIcon` (seperti `heart`, `crossword`, `pickaxe`, `lock`, dll.) untuk menjamin keseragaman visual 100% pada semua sistem operasi.

### W. Isolasi State Multi-User & Auto-Save Terisolasi Level 2 (`TectonicGame.tsx`, `teacherStore.ts`)
- **Penetapan `activeUserId`**: Mengambil ID unik siswa aktif (`student?.id || currentUser?.id || currentUser?.username || 'guest'`) dan meneruskannya ke `createInitialGameStateL2(activeUserId)`.
- **Eliminasi Kebocoran Kunci Guest**: Menghentikan pembacaan default ke `resqbox_level2_progress_guest` saat pengguna berpindah akun; masing-masing akun kini membaca dan menyimpan file progres sendiri (`resqbox_level2_progress_${userId}`).
- **Penyimpanan Instan Penyelesaian TTS**: Memanggil `saveLevel2Progress(state, activeUserId)` langsung di dalam `handleCrosswordSuccess` sehingga pembukaan gerbang langsung tercatat pada akun yang tepat.
- **Pembersihan State Residu Guest**: Menghapus sisa cache `resqbox_level2_progress_guest` pada event `login` dan `logout` di `teacherStore.ts` guna mencegah state lama dari akun sebelumnya menempel pada sesi baru.

### X. Transformasi Medan Organik Kontinu Level 2 & Redesain Gerbang/Portal ala Level 1 (`zones.ts`, `sprites.ts`, `player.ts`, `renderer.ts`)
- **Penghapusan Medan Balok Kotak Kaku (Non-Boxy Organic Strata)**:
  - Menggantikan balok daratan rectangular 32px kaku dengan sistem kontur medan kontinu kurva sinusoidal dan interpolasi titik ketinggian (`interpolateProfile`) di `zones.ts` untuk Area 1 (Batas Divergen) dan Area 2 (Batas Konvergen).
  - Melipatgandakan resolusi piksel dan bit geologis di `sprites.ts` (`renderOrganicZoneTerrainL2`): menampilkan multi-layer penampang geologi batuan dasar obsidian hitam pekat, lapisan basalt padat, gelombang aliran lava mendingin, urat magma membara di kedalaman, kompresi foliasi andesit-granit, serta pasir hitam vulkanik.
  - Memanfaatkan off-screen canvas caching (`getOrganicTerrainCacheL2`) agar rendering medan organik beresolusi tinggi tetap berjalan pada performa 60 FPS mulus.
- **Fisika Pergerakan Lereng Mulus (*Smooth Slope Traversal*)**:
  - Mengimplementasikan `getEffectiveGroundL2(zone, x, currentY)` di `player.ts` yang membaca profil ketinggian tanah kontinu dan jembatan secara real-time.
  - Karakter dapat berjalan menaiki dan menuruni lereng bergelombang tanpa hambatan tangga patah (*stair-stepping*), dengan deteksi jatuh bebas pada jurang terjal.
- **Redesain Gerbang & Portal Menjadi Struktur Industri Megah ala Level 1**:
  - **Portal Keluar (Forward Portal)**: Digambar ulang sebagai *Kepala Sumur Bor Geotermal Ekstraksi Dalam* (`drawGeothermalShaftPortal`) dengan kaki bantalan baja, flens baut industri, garis peringatan keselamatan kuning-hitam (*hazard stripes*), gradien kedalaman sumur, partikel kepulan uap panas dinamis, serta banner hologram penanda tujuan.
  - **Portal Kembali (Return Hoist Portal)**: Digambar ulang sebagai *Elevator Pneumatik Vertikal* (`drawAscentHoistPortal`) dengan rel panduan ganda titanium, sangkar keselamatan kuning, kisi kabel traksi, dan berkas sinar energi traksi biru cyan berkedip.
  - **Gerbang Tantangan Evaluasi (Challenge Gate)**: Digambar ulang sebagai *Lengkungan Kubah Seismik Hidrolik* (`drawSeismicVaultGate`) dengan peredam gempa hidrolik, lampu strobo merah berkedip, tirai medan laser pengaman saat terkunci, dan pendaran radiasi hijau saat terbuka.

### Z. Pembenahan Fisika Jembatan & Penempelan Objek Area 2 (`player.ts`, `zones.ts`, `sprites.ts`)
- **Proteksi Pemain di Atas Jembatan Karang Andesit (`player.ts`)**:
  - Menambahkan pengecekan `isSafeOnBridge`: saat pemain sedang berdiri/berjalan di atas platform/jembatan (`zone.platforms`), pemain 100% kebal dari hazard jurang.
  - Mengubah batas ketinggian pemicu kerusakan jurang palung menjadi `player.y >= 420` (hanya aktif jika pemain jatuh bebas ke dasar jurang palung), sehingga pemain dapat melintasi jembatan dari tebing kiri ($X = 255$) ke tebing kanan ($X = 440$) dengan mulus dan tanpa kehilangan HP.
- **Eliminasi Objek Melayang (Sprite Ground Snapping) (`zones.ts`)**:
  - Memperbarui konstanta `OBJECT_GROUND_OFFSETS_L2` berdasarkan titik tumpu dasar sprite aktual: `lander_capsule: 10`, `portal_back: 2`, `portal_exit: 0`, `challenge_gate: 2`, `info_sign: 32`, `discovery: 34`, `crystal: 24`.
  - Stasiun Siaga, tangga kembali, gerbang evaluasi, dan portal keluar menempel kokoh dan rata pada permukaan tanah lereng vulkanik.
- **Penyambungan Visual Jembatan & Pengisian Air Palung (`sprites.ts`)**:
  - `drawPlatformL2` jenis `basalt_arch`: menambahkan abutmen batuan basal dan lengkungan penyangga solid sehingga tidak ada rongga hitam kosong di bawah dek jembatan.
  - `drawDeepTrenchWater`: air palung mengisi penuh dari $X = 253$ hingga $X = 444$ dengan riak permukaan air langsung di bawah dek jembatan.

### AA. Redesain Temuan 2: 3 Ilustrasi Mandiri Retro Pixel 2D Beresolusi Penuh (`DiscoveryModal.tsx`)
- **Pemisahan 3 Bentang Alam Konvergen**: Mengganti diagram tunggal gabungan yang sempit menjadi 3 kanvas visual penuh berukuran $560 \times 250$ piksel yang berganti secara dinamis saat tombol tab ditekan:
  1. **Palung Laut Dalam (*Deep Sea Trench*)**:
     - *Permukaan*: Kapal riset kelautan putih dengan garis biru, anjungan radar, dan *crane winch* di buritan.
     - *Jurang Ngarai*: Dinding batu basalt terjal dan curam yang menyempit membentuk *V-shaped abyss* (*Challenger Deep* 11.034 m).
     - *Kapsul Selam Kuning*: Berada di kedalaman dengan sorotan lampu ganda cyan yang menembus kegelapan jurang palung.
     - *Skala Mistar Kedalaman*: 0 m (Permukaan), 200 m (Zona Terang), 1.000 m (Zona Senja), 4.000 m (Zona Gelap Abisal), hingga 11.000 m (Palung Mariana).
     - *Komparasi Gunung Everest*: Siluet Everest (8.848 m) di dalam palung membuktikan bahwa jika Everest dimasukkan, puncaknya masih tenggelam >2.000 m di bawah air.
     - *Fauna Laut Dalam*: Siluet paus sperma di zona atas dan *anglerfish* bercahaya di zona gelap abisal.
  2. **Rantai Pegunungan Lipatan (*Folded Mountains*)**:
     - Panorama puncak lipatan salju megah dan hutan pinus di kaki bukit.
     - Penampang bawah tanah menampilkan lapisan batuan sedimen, batu pasir, serpih, dan granit yang meliuk-liuk terlipat.
     - Tanda panah kompresi horizontal (`➡ TEKANAN ⬅`) dan label penunjuk untuk **Puncak Lipatan (Antiklin)** dan **Lembah Lipatan (Sinklin)**.
  3. **Busur Gunung Berapi Aktif (*Volcanic Arc Merapi*)**:
     - Kerucut stratovolcano Gunung Merapi dengan kawah kaldera aktif, aliran lahar pijar di lereng, dan kolom awan abu (*wedhus gembel*).
     - Penampang lempeng samudra menunjam meleleh di mantel bumi (>1.200°C), dapur magma (*magma chamber*) kantung pijar raksasa, dan pipa magma utama menuju kawah.
- **Perbaikan Tab Switcher Anti-Clipping**:
  - Memberikan padding atas `pt-2.5 px-3 pb-2` dengan latar `bg-slate-950/95` dan menghapus efek `-translate-y` yang sebelumnya menabrak batas atas kontainer modal. Tombol `[1. PALUNG LAUT]`, `[2. PEGUNUNGAN]`, dan `[3. GUNUNG BERAPI]` tampil utuh dan rapi.

### AB. Peringkasan Materi & Desain Teks Ramah Siswa SMP Kelas 8 (`level2Data.ts`, `zones.ts`, `DiscoveryModal.tsx`)
- **Format Poin Visual Berikon pada Kartu Detail Bentang Alam**:
  - Penjelasan bentang alam dipecah menjadi 3 kotak poin mini (`grid-cols-1 sm:grid-cols-3`) berikon: (1) Cara terbentuknya, (2) Karakteristik/Kedalaman, dan (3) Fakta geologi/contoh nyata di Indonesia.
- **Pemadatan Teks Temuan Geologis (Area 1 & Area 2)**:
  - Teks temuan geologis di `level2Data.ts` (Wegener, Pegunungan Kembar, Pemekaran Divergen, Subduksi Konvergen, dan 3 Bentang Alam) diringkas menjadi 2-3 kalimat tajam tanpa dinding teks membosankan.
  - Ilustrasi Area 1 tetap dipertahankan utuh sesuai instruksi.
- **Pemadatan Teks Papan Catatan Geologis (`zones.ts`)**:
  - Seluruh teks papan catatan di Area 1 dan Area 2 dirampingkan menjadi maksimal 2 kalimat padat dan menarik.
- **Penghapusan Tombol Bantuan Siaga (`CrosswordModal.tsx`)**:
  - Menghapus tombol dan hint "BANTUAN SIAGA" agar evaluasi menguji pemahaman siswa secara mandiri dan obyektif.

### AD. Implementasi Penuh Level 2 Area 3: Batas Transform, Sismograf & Sesar San Andreas
- **Lanskap Ngarai Sesar & Atmosfer Senja Gurun (`zones.ts`, `renderer.ts`)**:
  - *Atmosfer Kanvas*: Langit gradien senja gurun hangat (`#1e0a02` via `#7c2d12` ke `#d97706`), matahari bulat besar yang terbenam dengan pendaran korona radial dan sorot sinar (*sunbeams*), siluet mesa dan ngarai bertingkat kejauhan, siluet gawir sesar (*fault scarp*) dengan semak kering *chaparral*, serta partikel debu pasir keemasan yang berhembus melayang secara dinamis.
  - *Profil Medan*: Kontur tanah batuan pasir kontinu (*sandstone cosine interpolation*) dengan rekahan gawir sesar di $X = 260$, jembatan tumpuan seismik di atas jurang ngarai, dan penataan objek menapak tanah 100% tanpa melayang (`lander_capsule` di $X = 40$, `portal_back` di $X = 120$, 4 `info_sign`, 2 `discovery`, `challenge_gate` di $X = 780$, dan `portal_exit` di $X = 875$).
- **Temuan 1: Sismograf Mekanik ke Listrik & Pembuktian 20 Lempeng Tektonik Bumi (`DiscoveryModal.tsx`)**:
  - *Tab 1: Simulator Sismograf Mekanik ke Listrik*: Drum silinder berputar pembawa kertas seismogram, jarum pena pencatat getaran yang terhubung dengan koil induksi elektromagnetik, visualisasi gelombang P dan S, serta tombol interaktif untuk mengguncang tanah dan mengamati terbentuknya goresan seismogram secara nyata.
  - *Tab 2: Peta 20 Lempeng Bumi & Pergeseran Pangea*: Slider waktu interaktif dari era Pangea (250 Juta Tahun Lalu) hingga posisi 20 lempeng tektonik modern, lengkap dengan panah sirkulasi arus konveksi mantel bumi dan visualisasi bukti fosil/batuan identik di Amerika Utara dan Eropa.
  - *Format Poin SMP Kelas 8*: Disajikan dalam 3 kartu mini berikon: (1) Prinsip Kerja Sismograf, (2) 20 Lempeng Tektonik Bumi, dan (3) Arus Konveksi Panas Mantel.
- **Temuan 2: Batas Transform & Patahan San Andreas (`DiscoveryModal.tsx`)**:
  - *Simulator Geser Mendatar*: Slider interaktif pergeseran horizontal lempeng Pasifik (ke barat laut) dan lempeng Amerika Utara (ke tenggara) dengan kecepatan ~2 inci (5 cm)/tahun.
  - *Pembelokan Sungai Wallace Creek (*Offset Stream*)*: Aliran sungai yang terpotong dan berbelok tajam 90° di sepanjang garis patahan sesar, pagar pembatas yang terputus, dan percikan kilatan energi gesekan elastis saat gempa dangkal terlepas (*⚡ GEMPA DANGKAL TERLEPAS!*).
  - *Format Poin SMP Kelas 8*: Disajikan dalam 3 kartu mini berikon: (1) Gerak Mendatar Sejajar, (2) Patahan Sesar San Andreas 1.200 km di Kalifornia, dan (3) Mekanisme Gempa Bumi Dangkal.
- **Evaluasi Mandiri Teka-Teki Silang (TTS) Area 3 (`CrosswordModal.tsx`)**:
  - Grid TTS adaptif 11 baris $\times$ 13 kolom (lebar 390px) dengan 4 kata kunci sains terintegrasi:
    1. `TRANSFORM` (Menurun, baris 0, kolom 4): Batas di mana dua lempeng bergesekan horizontal saling berlawanan arah tanpa pembentukan magma baru.
    2. `SANANDREAS` (Mendatar, baris 2, kolom 3): Patahan sesar transform terkenal di Kalifornia sepanjang ~1.200 km yang bergeser ~5 cm/tahun.
    3. `SISMOGRAF` (Menurun, baris 2, kolom 12): Alat pencatat gempa bumi yang mengubah getaran fisik tanah menjadi sinyal listrik.
    4. `LEMPENG` (Mendatar, baris 8, kolom 2): Kepingan litosfer bumi (berjumlah ~20) yang terus bergerak di atas arus konveksi mantel.
  - Geometri grid teruji presisi 100% dengan perpotongan huruf yang valid (`A` pada `TRANSFORM` $\times$ `SANANDREAS`, `S` pada `SANANDREAS` $\times$ `SISMOGRAF`, `M` pada `TRANSFORM` $\times$ `LEMPENG`).
- **Alur Transisi & Penyelesaian Level 2 (`gameEngine.ts`, `TectonicGame.tsx`)**:
  - Transisi sekuensial penuh: Area 1 $\rightarrow$ Area 2 $\rightarrow$ Area 3 melalui portal keluar dan portal kembali yang terhubung presisi dengan posisi spawn berarah.
  - Penyelesaian TTS Area 3 secara otomatis membuka gerbang tantangan fisik, mengaktifkan Kapsul Evakuasi Akhir (`★ KAPSUL AKHIR EVAKUASI ★`), memberikan skor penuh 100 poin, menganugerahkan 3 lencana master (`divergent-master`, `convergent-master`, `transform-master`), menampilkan modal kemenangan komprehensif, dan membuka Level 3 di Dashboard.

### AE. Penyempurnaan Area 3 (Batas Transform): Background Canyon Sunset, Fisika Jembatan Anti-Tunneling, Sismograf 3D Mekanik & Blok 3D Gerak Transform
- **Pembersihan & Redesain Latar Belakang Ngarai Gurun (`renderer.ts`)**:
  - Menghapus perulangan ranting lava oranye diagonal (`fx += 150`) yang melayang berulang-ulang di atas perbukitan.
  - Menghapus 4 garis horizontal panjang di latar belakang yang memotong layar secara kaku.
  - Merancang ulang atmosfer ngarai senja gurun (*desert sunset canyon*): gradasi langit senja gurun hangat (`#100502` ke `#ea580c`), matahari senja besar dengan halo radial lembut, siluet mesa dan gawir sesar bertingkat (*mesa plateau & fault scarp*) dengan kedalaman paralaks alami, serta kabut dasar ngarai dan partikel debu seismik emas melayang.
- **Fisika Jembatan Anti-Tembus / Anti-Tunneling (`player.ts`)**:
  - Mengimplementasikan deteksi lintasan jatuh (*trajectory vertical check*): menyimpan `prevY` pemain dan mendeteksi apakah lintasan jatuh memotong permukaan platform (`prevY <= plat.y + 4 && currentY >= plat.y - 4`).
  - Pemain yang melompat jauh/tinggi dari puncak bukit terjal (`BUKIT SESAR TEKAN`, $Y=255$) ke jembatan ($Y=360$) kini mendarat dengan kokoh di atas jembatan tanpa tembus ke jurang magma.
  - Memperluas area perlindungan bahaya jembatan (`x >= plat.x1 - 6 && x <= plat.x2 + 6 && player.y <= plat.y + 16`) sehingga pemain di atas bentang jembatan 100% kebal bahaya magma di bawahnya.
- **Temuan Geologis 1: Sismograf 3D Mekanik Realistis (`DiscoveryModal.tsx`)**:
  - Menghapus tombol getaran dan animasi getar layar sesuai permintaan pengguna.
  - Menghapus seluruh label/tulisan di dalam kanvas ilustrasi (*zero in-diagram text*).
  - Merender instrumen Sismograf 3D mekanik realistis sesuai Gambar Referensi 3: pelat dasar logam baja tebal ber-bevel dengan 4 baut sudut berkilap, rangka tiang baja vertikal dan lengan atas kantilever bentuk C (*C-frame bracket*), kawat suspensi tipis yang menggantungkan silinder bandul inersia padat (*heavy cylindrical bob*), jarum pena pencatat (*stylus needle*), serta silinder drum horizontal pembawa kertas seismogram dengan grafik gelombang P & S yang presisi.
- **Temuan Geologis 2: Blok 3D Gerak Transform Bergeser Langsung (`DiscoveryModal.tsx`)**:
  - Menghapus diagram lama yang menampilkan sungai (*Wallace Creek*) dan pagar terpotong.
  - Merender diagram blok 3D isometrik murni dua lempeng berdampingan sesuai Gambar Referensi 5:
    - Blok kiri: balok 3D pejal berpermukaan gurun tan kekuningan, 3 lapisan kerak bertingkat (tan, cokelat tua, dan mantel terracotta), dengan panah merah tebal di permukaan menunjuk ke depan/bawah-kiri.
    - Blok kanan: balok 3D pejal berpermukaan gurun tan kekuningan, 3 lapisan kerak bertingkat identik, dengan panah merah tebal di permukaan menunjuk ke belakang/atas-kanan.
    - Bidang sesar vertikal (*vertical slip plane*) yang tampak jelas saat lempeng bergeser.
    - Pin penanda gantung "Gerak Transform" berkepala hijau di batas sesar.
    - **Animasi Gerak Langsung & Kontinu (Tanpa Slider)**: Menghilangkan bilah slider manual dan tombol kontrol; animasi berjalan otomatis non-stop dalam siklus 60fps yang halus: diawali dengan kedua balok menyatu utuh sebagai satu daratan (`slip = 0`), lalu meluncur perlahan saling berlawanan arah (kiri ke bawah-depan, kanan ke atas-belakang) dengan panah merah yang ikut bergerak bersama tanahnya, menahan sejenak di puncak pergeseran, dan kembali menyatu utuh secara berulang.

---

## 4. Pembaruan Fitur Eksplorasi Level 1 (Earth Dive)

Pembaruan terbaru Level 1 (Earth Dive) difokuskan pada penyederhanaan alur temuan sains, penegakan gerbang evaluasi, dan penyetaraan sistem gameplay dengan Level 2:

1. **Penghapusan Mini Challenge pada Temuan Geologis (`DiscoveryModal.tsx`)**:
   - Menghapus tombol tantangan "HADAPI MINI CHALLENGE" dan opsi "NANTI DULU" pada semua pop-up temuan geologis.
   - Menggantinya dengan satu tombol konfirmasi edukasi: `MENGERTI CATATAN SAINS ➔`.
   - Menjadikan evaluasi sains terpusat hanya pada **Tantangan Gerbang** di akhir setiap lapisan bumi.

2. **Penyelarasan Terminologi & Modal Peringatan Akses Gerbang (`isGateLockedModalOpen`)**:
   - Menghapus penggunaan istilah *"Sumur Bor"* dan menggantinya menjadi *"Turun Menuju Lapisan Selanjutnya"* (atau *"Poros Turun Geotermal"*).
   - Menghapus penggunaan istilah *"Elevator"* dan menggantinya menjadi *"Naik Menuju Lapisan Sebelumnya"* (atau *"Derek Naik Evakuasi"*).
   - Memasang proteksi akses portal turun baik melalui tombol `[E]`, tombol panah bawah `[Down]`, klik floating button, maupun klik kanvas langsung.
   - Jika pemain belum menuntaskan Tantangan Gerbang di area tersebut, sistem membunyikan `retroAudio.playError()` dan memunculkan modal peringatan bertuliskan *"AKSES TURUN DITOLAK!"* dengan instruksi *"Tantangan Gerbang Belum Selesai — Selesaikan tantangan gerbang terlebih dahulu untuk membuka akses turun ke lapisan berikutnya"*.

3. **Sistem HP & Ketahanan Karakter (Mirip Level 2)**:
   - Menambahkan properti `health: 100` dan `invulnerableTimer` pada karakter Level 1.
   - Penalti jatuh ke jurang dalam (`player.y > 440`): pemain kehilangan 25 HP, memicu efek ledakan `retroAudio.playExplosion()`, respawn di spawn point, dan mendapatkan 50 frame kebal dengan animasi sprite berkedip.
   - Menambahkan indikator **Ketahanan Eksplorasi (HP)** di `TelemetryHUD.tsx` lengkap dengan ikon Pixel Heart, bar gradien dinamis (hijau >50%, kuning >25%, merah berdenyut <=25%), dan persentase numerik. Nilai HP juga tersimpan secara persisten (`playerHealth`) di penyimpanan lokal.

4. **Efek Suara Pengambilan Koin Kristal Biru (Geo-Crystal)**:
   - Mengintegrasikan pemanggilan `retroAudio.playPowerup()` pada game engine saat koin kristal geologis biru terambil (baik auto-pickup saat pemain melintas maupun melalui tombol interaksi `[E]`).

5. **Fisika Platform Anti-Tunneling (Continuous Collision Detection - CCD)**:
   - Mengatasi masalah tunneling di mana karakter melompat tinggi atau double jump dan jatuh menembus permukaan platform/jembatan akibat kecepatan jatuh vertikal tinggi (`vy >= 6`).
   - Menerapkan swept vertical collision detection dengan melacak posisi `prevY` pemain (`prevY <= plat.y + 8 && currentY >= plat.y - 4`).
   - Memperlebar batas toleransi tumpuan horizontal tapak kaki (`footMargin = 10`), mengunci koordinat pendaratan secara instan (`player.y = plat.y`), dan menetralkan kecepatan jatuh (`player.vy = 0`).

6. **Elevasi Jembatan Basal di Atas Jurang Magma**:
   - Menaikkan elevasi koordinat jembatan batuan basal di Level 1 agar menapak sejajar dan kokoh di atas permukaan lahar/magma tanpa melesak ke bawah permukaan lava.

---

## 5. Sistem Catatan Geologis Proksimitas & Standarisasi Area 2 Level 2

1. **Balon Kata (Speech Bubble Tooltip) Mengambang Otomatis**:
   - Merombak total interaksi papan catatan geologis (`info_sign`): tidak lagi membuka dialog modal fullscreen yang memblokir layar dan mengganggu ritme penjelajahan.
   - Menjadikan papan catatan geologis memunculkan balon kata (*speech bubble*) retro bernuansa kayu gelap berbingkai merah/kuning tepat di atas tiang tanda saat karakter mendekat (`dist < 50px`).
   - Balon kata langsung hilang secara otomatis dan mulus saat karakter berjalan menjauh tanpa memerlukan klik tombol apapun.
   - Posisi balon kata distabilkan pada koordinat dunia permainan kanvas (bukan di header layar atau mengikuti tubuh karakter).

2. **Standarisasi Area 2 Menjadi Tepat 2 Temuan Sains**:
   - Menghapus objek totem temuan geologis ke-3 yang tersisa di Zona 2 pada `zones.ts` untuk mencegah error crash modal akibat data katalog yang tidak ditemukan.
   - Area 2 resmi memiliki 2 temuan sains yang komprehensif: (1) Dinamika Subduksi & Peleburan Batuan di Mantel, dan (2) Tiga Bentang Alam Tumbukan Lempeng (Palung Laut Dalam, Rantai Pegunungan Lipatan, dan Busur Vulkanik Merapi).
   - Counter temuan geologis pada header HUD Area 2 kini tampil presisi `X / 2`.

---

## 6. Sistem Kristal Kumulatif Level 2 (Total 9 Kristal) & Counter Temuan Header

1. **Kristal Kumulatif Level 2 (Total 9 Kristal)**:
   - Merombak perhitungan kristal Level 2 dari yang sebelumnya hanya mengukur koin per area menjadi total akumulatif seluruh Level 2:
     - Area 1 (Batas Divergen): 3 Kristal (menambahkan `l2_crystal_3` pada koordinat $X=620, Y=330$).
     - Area 2 (Batas Konvergen): 3 Kristal (`l2_zone2_crystal_1`, `2`, `3`).
     - Area 3 (Batas Transform): 3 Kristal (`l2_zone3_crystal_1`, `2`, `3`).
   - HUD atas menampilkan jumlah kristal riil kumulatif yang telah diperoleh siswa dengan format `{collectedCount} / 9 KRISTAL`.

2. **Sinkronisasi Counter Temuan Geologis Header**:
   - Memperbaiki ketidaksesuaian ID antara `gameEngine.ts` (menggunakan prefix `l2_disc_...`) dengan state katalog data (`disc-...`).
   - Menyimpan kedua format ID ke dalam `state.discoveredPoints`, sehingga counter temuan geologis di header HUD Level 2 aktif dan bertambah secara real-time saat pemain memeriksa objek temuan sains.

---

## 7. Integrasi Penuh Level 2 ke Teacher Dashboard & Supabase Cloud Sync

1. **Skoring Dinamis Bertahap Level 2**:
   - Menyinkronkan progres Level 2 ke Supabase dan `teacherStore.ts` secara bertahap berbasis penyelesaian gerbang teka-teki silang:
     - Area 1 Selesai: **35 Poin** (`isCompleted: false`, status `[ PROGRES ]`).
     - Area 2 Selesai: **70 Poin** (`isCompleted: false`, status `[ PROGRES ]`).
     - Area 3 Selesai: **100 Poin** (`isCompleted: true`, status `[ TUNTAS ]`, membuka Level 3).

2. **Eliminasi Teks Hardcoded 'Sedang disusun'**:
   - Menghapus string hardcoded `'Sedang disusun'` pada sel evaluasi tabel guru di `TeacherDashboard/index.tsx`.
   - Mengubah nama kolom evaluasi menjadi `LV. 2 (TEKTONIK)`.
   - Menampilkan status evaluasi yang hidup: `[ TUNTAS ] 100 Poin` berwarna hijau terang jika seluruh 3 area tuntas, atau `[ PROGRES ] X Poin` berwarna biru jika siswa masih berada di Area 1 atau Area 2.
   - Menghapus pembatas `Math.min(2, level)` pada `teacherStore.ts` dan fungsi reset paksa saat reload, sehingga progres Level 3 terbuka secara sah dan persisten.
   - Menyelaraskan Modal Detail Siswa, Cetak Rapor Evaluasi HTML, dan Ekspor CSV agar mencerminkan capaian tektonik Level 2 secara akurat.

---

## 8. Modal Kemenangan Akhir Level 2 (`TectonicVictoryModal.tsx`)

1. **Estetika Selebrasi Megah 2D Retro Pixel Art**:
   - Mengimplementasikan modal kemenangan komprehensif saat Kapsul Evakuasi Akhir Area 3 dimasuki siswa, dengan visual selebrasi yang serasi dengan Level 1:
     - Komponen piala pixel art emas berkilau `<PixelTrophy size={110} />` dengan animasi partikel kilau.
     - Status pill hijau terang berkedip `EKSPEDISI TUNTAS!`.
     - Judul utama: `DINAMIKA LEMPENG SELESAI!`.
     - Subjudul: `Kamu telah menguasai batas divergen, konvergen, dan transform!`.
     - Tiga lencana ekspedisi tektonik: Lencana Batas Divergen, Lencana Batas Konvergen, dan Lencana Batas Transform.
     - Ringkasan kristal tektonik terkumpul (`X / 9 KRISTAL DIKUMPULKAN`).

2. **Jembatan Kausalitas Menuju Level 3 (Simulation Game)**:
   - Menyajikan narasi edukatif jembatan sains: menjelaskan bahwa pergerakan dan pelepasan energi lempeng tektonik yang telah dipelajari di Level 1 dan Level 2 adalah pemicu utama terjadinya gempa bumi dan erupsi vulkanik (seperti di lereng Gunung Merapi).
   - Mengajak siswa melangkah ke Level 3 untuk merancang sistem peringatan dini, sensor kebencanaan, dan simulasi jalur evakuasi warga (*Evacuation Digital Twin*).
   - Menyediakan dua tombol aksi papan kayu taktil: `◀ MENU UTAMA` (kembali ke `/`) dan `LANJUT KE LEVEL 3 ➔` (langsung bernavigasi ke `/level3`).

---

## 9. Animasi Jet Booster Biru Lompatan Ganda di Level 2

1. **Efek Visual Semburan Jet Cyan & Putih Terang**:
   - Menyelaraskan efek visual saat pemain melakukan lompatan ganda (*double jump*) di Level 2 persis menyerupai Level 1.
   - Menggambar semburan api roket pendorong di bawah kedua telapak kaki karakter pada `src/app/Level2/engine/renderer.ts`:
     - Semburan luar berwarna biru cyan terang (`#00e5ff`) dengan lebar 4px di kedua sepatu (`drawX + 6` dan `drawX + 14`) dengan tinggi dinamis yang berkedip (`flameH = 6 + (thrusterTimer % 4) * 2`).
     - Inti api putih terang berenergi tinggi (`#ffffff`) selebar 2px di tengah semburan (`drawX + 7` dan `drawX + 15`).
     - Efek memudar (*fade-out*) seiring menurunnya timer pendorong (`tAlpha = thrusterTimer / 16`).

2. **Partikel Percikan Plasma & Pendaran Cahaya**:
   - Menambahkan partikel percikan plasma biru berjatuhan (`#38bdf8`) dengan pergerakan acak (*wobble*) yang mensimulasikan hembusan dorongan gas ke bawah.
   - Menambahkan lingkaran pendaran cahaya biru lembut (`rgba(0, 229, 255, 0.2)`) di area pijakan karakter.
   - Dipadukan secara harmonis dengan audio retro powerup chiptune `retroAudio.playPowerup()`.

---

## 10. Transformasi Konsep RPG Visual Novel Level 1 (Sistem Dialog NPC & Maskot Resqy)

1. **Rombak Papan Catatan Menjadi Dialog Interaktif dengan Peneliti**:
   - Level 1 (*Earth Dive*) ditransformasi dari eksplorasi dengan papan catatan statis menjadi petualangan RPG bernarasi yang hidup.
   - Papan catatan kayu dan totem temuan kini digantikan oleh karakter-karakter NPC peneliti yang tersebar di sepanjang lintasan:
     - **Area 1 (Permukaan Bumi)**:
       - **Prof. Raditya** (*Peneliti Batuan Bumi*): Membahas tantangan pengeboran terdalam Kola Borehole 12 km dan alasan para ahli menggunakan gelombang getaran gempa bumi.
       - **Kapten Maya** (*Pemandu Penyelaman Bumi*): Mengarahkan persiapan kapsul bor litosfer dan pengenalan dua bagian utama kerak bumi (daratan dan dasar laut).
     - **Area 2 (Kerak Bumi / Litosfer)**:
       - **Dr. Gea** (*Peneliti Kerak Bumi*): Memperkenalkan karakteristik kerak bumi sebagai lapisan paling luar dan paling tipis planet bumi yang terpecah menjadi sekitar 20 lempeng.
       - **Prof. Andini** (*Guru Geologi*): Membimbing pemahaman komparasi mendalam antara Kerak Benua (daratan, tebal ~100 km, batu granit) vs Kerak Samudra (dasar laut, tipis 5–15 km, batu basal padat dan berat) serta membuka arsip visual temuan sains.
       - **Inspektur Budi** (*Pengawas Batas Kerak*): Menjelaskan fenomena lonjakan kecepatan gelombang gempa di Batas Moho (pemisah kerak bumi dan mantel).
       - **Komandan Hendra** (*Penjaga Pintu Mantel Bumi*): Mengawal pintu masuk penurunan ke mantel bumi dan menguji kesiapan pemahaman siswa sebelum memberikan izin penurunan.

2. **Komponen Visual Novel Dialog (`VisualNovelDialogue.tsx`)**:
   - Menampilkan potret NPC di sebelah kiri dan potret karakter siswa di sebelah kanan.
   - **Potret 100% Transparan**: Menghilangkan kotak bingkai latar belakang persegi pada avatar pemain dan NPC, sehingga siluet karakter menyatu alami dengan layar game.
   - **Efek Ketik Typewriter & Micro-Bounce**: Teks dialog muncul huruf demi huruf dengan kecepatan optimal serta micro-bounce lembut pada karakter saat berbicara untuk sensasi visual novel RPG yang dinamis.
   - **Skema Warna Tenang & Ramah Mata**: Kotak dialog menggunakan warna perkamen retro hangat (`#fef3c7`) dengan garis tepi kayu gelap (`#451a03`), teks cokelat tua terbaca jelas, dan tombol pilihan yang tenang (bebas warna gonjreng atau silau).

3. **Maskot Panduan Penyelamat "Resqy" (`MascotGuide.tsx`)**:
   - Robot pemandu penjelajah 2D pixel art yang menemani siswa di HUD kiri atas.
   - Memberikan briefing kontekstual di awal zona (pengenalan kontrol gerak [A]/[D] & [SPASI], pengumpulan kristal energi, dan orientasi tujuan misi).
   - Memiliki widget pemanggil mini dengan indikator radar hijau berkedip dan notifikasi mengambang *"Ada Tips Baru!"* tanpa emoji sistem operasi.

---

## 11. Penyelarasan Bahasa & Peringkasan Materi untuk Siswa SMP Kelas 8

1. **Prinsip Bahasa Ramah Anak SMP Kelas 8 (Anti Berbelit-belit)**:
   - Siswa SMP kelas 8 cenderung cepat bosan dan kesulitan jika membaca teks panjang atau paragraf akademis berbelit-belit.
   - Seluruh naskah dialog dan teks temuan geologis diringkas menjadi **1-2 kalimat pendek dan lugas per balon kata**.
   - Gaya bahasa diubah menjadi santai, akrab, edukatif, dan penuh dorongan semangat.

2. **Eliminasi Total Istilah Asing (Zero Foreign Jargon)**:
   - Menghilangkan seluruh istilah asing yang membingungkan siswa SMP: *exosuit, jet booster, singkapan litosfer, subduksi, basaltik, densitas, rig pemboran, astenosfer, SiAl, anisotropy, dll.*
   - Konsep-konsep geologis penting diterjemahkan dan dijelaskan menggunakan analogi sederhana yang dekat dengan kehidupan sehari-hari:
     - **Kerak Bumi**: Kulit paling luar bumi tempat kita hidup, dan merupakan lapisan yang paling tipis (seperti kulit telur).
     - **Kerak Benua**: Kerak bumi di bawah daratan tempat kita berpijak, tebalnya mencapai 100 kilometer.
     - **Kerak Samudra**: Kerak bumi di bawah lautan, tipis (hanya 5 sampai 15 kilometer), tetapi batuannya lebih padat dan lebih berat.
     - **Batas Moho**: Garis batas pemisah antara kerak bumi dan lapisan mantel di bawahnya.
     - **Lempeng Bumi**: Pecahan kulit bumi yang mengapung dan bergerak sangat pelan.

3. **Soal Evaluasi Wordle 100% dari Materi yang Dijelaskan (Gampang & Ramah Anak SMP Kelas 8)**:
   - Soal kuis tebak kata di gerbang akhir tiap area wajib dibuat **mudah dipahami dan sesuai kemampuan kognitif anak SMP kelas 8**:
   - **Prinsip Keaslian Materi 100%**: Seluruh kosakata dan petunjuk soal mutlak diambil dari penjelasan yang telah disampaikan oleh para NPC di area tersebut. Dilarang keras membuat soal di luar materi yang telah diajarkan.
   - Penyelarasan kosakata evaluasi gerbang:
     - **Area 1 & 2 (Kerak Bumi)**:
       - **`KERAK`**: *"Lapisan paling luar bumi tempat kita tinggal, dan merupakan lapisan yang paling tipis."*
       - **`BENUA`**: *"Jenis kerak bumi di bawah daratan yang memiliki ketebalan mencapai 100 kilometer."*
       - **`SAMUDRA`**: *"Jenis kerak bumi di bawah lautan yang tipis (5-15 km), tetapi lebih padat dan berat."*
     - **Area 3 (Mantel Bumi)**:
       - **`MANTEL`**: *"Lapisan di bawah kerak bumi yang merupakan lapisan paling tebal (2.900 km)."*
       - **`PANAS`**: *"Suhu tinggi di mantel bumi yang membuat batuan mengalir sangat kental."*
       - **`KONVEKSI`**: *"Arus perputaran panas di dalam mantel yang menggerakkan lempeng bumi."*
     - **Area 4 (Inti Luar)**:
       - **`NIKEL`**: *"Bahan yang menjadi penyusun utama lapisan inti bumi adalah besi dan..."*
       - **`CAIRAN`**: *"Inti luar bumi wujudnya berupa..."*
       - **`MAGNET`**: *"Lapisan inti bumi luar menghasilkan medan... yang melindungi bumi dari radiasi matahari."*
     - **Area 5 (Inti Dalam)**:
       - **`BOLABESIPADAT`**: *"Inti dalam bumi berbentuk..."*
       - **`SEPULUHRIBU`**: *"Suhu di inti dalam bumi bisa mencapai ... derajat fahrenheit."*
       - **`PUSAT`**: *"Titik terdalam planet bumi pada kedalaman 6.371 kilometer."*
     - **Puncak Sintesis Bumi (Core Synthesis Challenge)**:
       - **`LEMPENG`**, **`KONVEKSI`**, **`MAGNET`**, **`TEKANAN`**, dan **`GEMPA`**.

---

## 12. Penghapusan Objek Fisik Gerbang & Alur Masuk Portal Murni

1. **Penghapusan Objek Fisik Gerbang di Area 2**:
   - Balok gerbang fisik `challenge_gate` di Area 2 (`zones.ts`) dihapus total karena perannya sudah digantikan sepenuhnya oleh NPC Komandan Hendra.
   - Jalur menuju portal bawah dijaga langsung oleh Komandan Hendra yang berdiri tepat sebelum portal penurunan.

2. **Resolusi Bug Kunci Gerbang via Dialog NPC**:
   - Mengatasi masalah di mana siswa yang sudah menjawab kuis dengan benar dari Komandan Hendra masih mendapati portal terkunci.
   - Akar masalah: Pemanggilan kuis dari dialog NPC membuat `game.pendingChallenge` bernilai `null`, sehingga fungsi `handleChallengeSuccess` sebelumnya melewatkan pemanggilan `onChallengeComplete()`.
   - Solusi: `handleTriggerGateChallenge` kini membawa ID target `crust_challenge`, dan `handleChallengeSuccess` secara mutlak mendaftarkan `crust_challenge` ke dalam `game.unlockedGates` dan `game.completedChallenges`.

3. **Alur Masuk Portal Murni & Penghapusan Tombol Manual**:
   - **Jika Soal SUDAH Dikerjakan**: Pemain cukup berdiri di portal dan menekan tombol **ENTER** (atau `[E]` / Panah Bawah). Karakter langsung meluncur menyelam ke lapisan berikutnya secara mulus tanpa muncul pop-up apa pun.
   - **Jika Soal BELUM Dikerjakan**: Barulah muncul pop-up peringatan *"AKSES TURUN TERKUNCI! Kamu harus menyelesaikan tantangan dari peneliti di area ini terlebih dahulu"*.
   - Tombol manual *"Buka Akses Turun"* dihapus dari pop-up modal sesuai instruksi pengguna; modal hanya memiliki tombol tunggal *"SIAP, SELESAIKAN TANTANGAN PENELITI DULU"*.

---

## 13. Pedoman Baku & Standar Pengembangan Area Mendatang (Area 3, 4, 5)

Sebagai acuan baku tim pengembang untuk penyelesaian Area 3 (Mantel Bumi), Area 4 (Inti Luar), dan Area 5 (Inti Dalam):

1. **Tiga Komponen yang Diubah Menjadi NPC**:
   - **Papan Catatan Geologis** ➔ Diubah menjadi NPC pemandu lapangan yang menyapa dan memberikan informasi ringkas.
   - **Temuan Geologis** ➔ Diubah menjadi NPC peneliti sains yang mengajak pemain berdialog interaktif (*"Apakah kamu mau melihat materi dan fakta menarik tentang...?"*) sebelum membuka arsip visual materi.
   - **Tantangan Gerbang** ➔ Objek gerbang fisik dihilangkan, digantikan oleh NPC penjaga pintu (*"Apakah kamu sudah paham mengenai...?"*) yang memberikan tantangan tebak kata untuk membuka akses portal.

2. **Desain Tampilan Baku (Dilarang Mengubah UI/Styling)**:
   - Tampilan visual yang sudah disetujui di Area 1 & 2 bersifat **permanen dan baku**:
     - Kotak chat Visual Novel (`VisualNovelDialogue.tsx`) dengan tema perkamen retro kayu cokelat.
     - Potret karakter 100% transparan tanpa kotak background.
     - Layout, jenis font pixel (`Press Start 2P`, `Pixelify Sans`), warna tombol, dan efek ketik typewriter.
     - Widget Maskot Resqy di HUD kiri atas.
   - Pengembang selanjutnya **dilarang mengubah tema, warna, styling, atau tata letak** komponen yang sudah baku ini.

3. **Standar Konten & Bahasa Edukasi**:
   - **Ramah Siswa SMP Kelas 8**: Kalimat pendek, padat, lugas (maksimal 1-2 kalimat per balon percakapan).
   - **Zero Istilah Asing**: Jangan menggunakan istilah teknis asing. Jika ada konsep geologi penting, wajib dijelaskan dengan bahasa Indonesia yang sederhana dan analogi konkret terlebih dahulu.
   - **Materi Ringkas**: Teks materi temuan sains diringkas padat agar siswa tidak terbebani oleh dinding tulisan panjang (*no wall of text*).
   - **Soal Evaluasi Gampang & Autentik 100% dari Materi NPC**: Soal evaluasi tebak kata di akhir tiap area wajib dibuat mudah dipahami oleh siswa SMP kelas 8 dan harus diambil 100% dari materi yang telah dijelaskan oleh NPC di area tersebut. Dilarang memunculkan pertanyaan tentang materi yang belum pernah diajarkan.

---

## 14. Transformasi RPG Visual Novel & Standarisasi Area 3 (Mantel Bumi)

Penerapan menyeluruh pedoman baku pengembangan pada Zona 2 (Mantel Bumi) Level 1:

1. **Transformasi Menjadi 5 Karakter Peneliti**:
   - Seluruh papan catatan geologis (`mantle_sign1`, `mantle_sign2`), temuan geologis (`mantle_disc1`, `mantle_disc2`), dan objek gerbang fisik (`mantle_challenge`) digantikan oleh 5 NPC interaktif:
     - **Dr. Bayu** (*Ahli Geologi Mantel*): Berada di teras silikat awal (px: 260), menyambut pemain dan menjelaskan bahwa mantel bumi adalah lapisan tertebal (2.900 km) dan batuan padatnya mengalir sangat pelan karena panas ekstrem.
     - **Prof. Sarah** (*Peneliti Arus Panas Mantel*): Berada di teras silikat depan (px: 330), mengajak pemain berdialog dan membuka modul Temuan Geologis 4 mengenai arus panas konveksi yang bekerja seperti air mendidih dan menggerakkan lempeng bumi.
     - **Dr. Danang** (*Ahli Batuan Mantel*): Berada di pematang batuan tengah (px: 730), mengajak pemain berdialog dan membuka modul Temuan Geologis 5 mengenai batuan mantel yang tetap padat dan kokoh berkat tekanan dahsyat dari seluruh lapisan bumi di atasnya.
     - **Petugas Rudi** (*Pengawas Suhu Mantel Bawah*): Berada di pos pengawas (px: 990), memperingatkan bahwa suhu semakin panas mendekati dasar mantel dan mengarahkan pemain ke pos penjagaan Komandan Surya.
     - **Komandan Surya** (*Penjaga Pintu Inti Luar*): Menggantikan gerbang fisik di px: 1100, mengawal portal penurunan dan memberikan tantangan kuis tebak kata Wordle untuk membuka izin penurunan ke Inti Luar.

2. **Briefing & Panduan Maskot Resqy**:
   - Menyajikan briefing otomatis saat pertama kali memasuki Mantel Bumi (`mascot_mantle_intro`): menyapa siswa mengenai ketebalan mantel (2.900 km) dan sifat aliran batuannya.
   - Tips interaktif pada widget Resqy (`mascot_mantle_guide`) yang mengingatkan tiga kata kunci evaluasi: `MANTEL`, `PANAS`, dan `KONVEKSI`.

3. **Bahasa Ramah Anak SMP Kelas 8 & Zero Istilah Asing**:
   - Seluruh balon dialog dibuat 1-2 kalimat pendek, santai, dan edukatif.
   - Menghilangkan istilah rumit (*Bridgmanite, Ferropericlase, Rayleigh-Bénard, barosfer*) dan menggantinya dengan analogi nyata (mengalir kental seperti dodol/aspal panas, arus konveksi seperti air mendidih di panci).
   - Soal tebak kata Wordle gerbang Mantel Bumi diselaraskan 100% dari materi NPC: `MANTEL`, `PANAS`, dan `KONVEKSI`.

4. **Alur Portal Turun Murni & Konsistensi UI**:
   - Pemain yang telah menyelesaikan soal dari Komandan Surya dapat langsung berdiri di portal penurunan (px: 1220) dan menekan tombol **ENTER** untuk meluncur ke Inti Luar tanpa pop-up.
   - Seluruh tema kotak dialog Visual Novel, potret transparan, tombol kayu retro, dan font pixel dipertahankan 100% konsisten.

---

## 15. Transformasi RPG Visual Novel & Standarisasi Area 4 (Inti Luar)

Penerapan menyeluruh pedoman baku pengembangan pada Zona 3 (Inti Luar) Level 1:

1. **Transformasi Menjadi 5 Karakter Peneliti**:
   - Seluruh papan catatan kayu (`oc_sign1`, `oc_sign2`), temuan geologis (`oc_disc1`, `oc_disc2`), dan objek gerbang fisik (`oc_challenge`) digantikan oleh 5 NPC interaktif:
     - **Dr. Fajar** (*Pemandu Lapangan Inti Luar*): Berada di teras pelat logam awal (px: 270), menyambut kedatangan pemain setelah menembus mantel bumi dan menjelaskan suhu ekstrem 9.000°F yang melelehkan logam besi dan nikel menjadi lautan cairan logam.
     - **Prof. Ratna** (*Peneliti Logam Cair Inti Luar*): Berada di teras pelat logam depan (px: 330), mengajak pemain berdialog dan membuka modul Temuan Geologis 6 mengenai sifat lautan logam besi dan nikel yang meleleh dan berputar dinamis.
     - **Dr. Aris** (*Ahli Medan Magnet Bumi*): Berada di pematang pelat logam tengah (px: 730), mengajak pemain berdialog dan membuka modul Temuan Geologis 7 mengenai perputaran dinamo lautan logam cair yang menciptakan perisai medan magnet pelindung bumi dari badai matahari.
     - **Petugas Joko** (*Pengawas Radiasi Magnetik*): Berada di pos pemantau medan magnet (px: 1020), memperingatkan kuatnya fluks radiasi magnetik dan mengarahkan pemain ke pos Komandan Teguh.
     - **Komandan Teguh** (*Penjaga Pintu Inti Dalam*): Menggantikan gerbang fisik di px: 1120, mengawal portal penurunan ke Inti Dalam dan menguji pemahaman materi siswa dengan kuis tebak kata Wordle (`LOGAM`, `CAIR`, `MAGNET`). Dialog disusun murni menguji kesiapan tanpa membocorkan kunci jawaban, serta menyajikan 2 pilihan: (1) Siap mengerjakan tantangan, atau (2) Ingin melihat-lihat dan mempelajari materi terlebih dahulu jika belum siap.

2. **Briefing & Panduan Maskot Resqy**:
   - Menyajikan briefing otomatis saat pertama kali memasuki Inti Luar (`mascot_outer_core_intro`): menyapa siswa pada kedalaman 2.900 km dan menjelaskan panas 9.000°F yang mencairkan logam.
   - Tips interaktif pada widget Resqy (`mascot_outer_core_guide`) yang merangkum konsep penting: bahan penyusun logam besi-nikel, wujud cair, dan medan magnet sebagai perisai bumi secara edukatif tanpa membocorkan format jawaban.

3. **Bahasa Ramah Anak SMP Kelas 8 & Zero Istilah Asing**:
   - Seluruh dialog disusun singkat (1-2 kalimat per balon percakapan), santai, dan mudah dimengerti.
   - Mengeliminasi istilah asing berat (*fluida konduktif, magnetosfer, geodynamo*) dan menggantinya dengan padanan bahasa sederhana (lautan logam cair, dinamo listrik raksasa, perisai medan magnet pelindung bumi).
   - Soal kuis Wordle gerbang Inti Luar diselaraskan 100% dari materi NPC: `LOGAM`, `CAIR`, dan `MAGNET`.

4. **Alur Portal Turun Murni & Konsistensi UI**:
   - Pemain yang telah menyelesaikan soal dari Komandan Teguh dapat langsung berdiri di atas portal poros penurunan (px: 1220) dan menekan tombol **ENTER** untuk meluncur ke Inti Dalam tanpa pop-up.
   - Tampilan visual novel, potret transparan, dan tema tombol kayu retro dipertahankan 100% baku.

---

## 16. Transformasi RPG Visual Novel & Standarisasi Area 5 (Inti Dalam)

Penerapan menyeluruh pedoman baku pengembangan pada Zona 4 (Inti Dalam) Level 1:

1. **Transformasi Menjadi 5 Karakter Peneliti**:
   - Seluruh papan catatan kayu (`ic_sign1`, `ic_sign2`), temuan geologis (`ic_disc1`, `ic_disc2`), dan objek gerbang fisik (`ic_challenge`) digantikan oleh 5 NPC interaktif:
     - **Dr. Bagus** (*Pemandu Geofisika Inti Dalam*): Berada di teras awal (px: 270), menyambut kedatangan pemain setelah menembus ribuan kilometer hingga ke monolit Inti Dalam bumi dan mengarahkan pemain ke Prof. Lestari.
     - **Prof. Lestari** (*Peneliti Kristal Besi Inti Dalam*): Berada di teras monolit depan (px: 340), mengajak pemain berdialog dan membuka modul Temuan Geologis 8 mengenai bola besi padat bersuhu 10.000°F yang tahan leleh berkat tekanan dahsyat.
     - **Dr. Farhan** (*Ahli Gravitasi Pusat Bumi*): Berada di puncak altar pusat bumi 6.371 km (px: 680), mengajak pemain berdialog dan membuka modul Temuan Geologis 9 mengenai titik pusat bumi dengan gravitasi bernilai nol.
     - **Petugas Dian** (*Pengawas Kapsul Evakuasi Inti*): Berada di pos pengawas kapsul (px: 900), memperingatkan bahwa kapsul evakuasi akhir telah disiapkan dan mengarahkan pemain ke Komandan Bintang.
     - **Komandan Bintang** (*Kepala Ekspedisi Pusat Bumi*): Menggantikan gerbang fisik di px: 1040, mengawal pembukaan kapsul akhir evakuasi dan menguji pemahaman materi siswa dengan kuis tebak kata Wordle (`BOLABESIPADAT`, `SEPULUHRIBU`, `PUSAT`). Percakapan disusun murni tanpa membocorkan kunci jawaban dan menyediakan 2 pilihan keputusan (siap tantangan vs melihat-lihat materi terlebih dahulu).

2. **Briefing & Panduan Maskot Resqy**:
   - Menyajikan briefing otomatis saat pertama kali memasuki Inti Dalam (`mascot_inner_core_intro`): menyapa siswa pada kedalaman 5.150 km dan menjelaskan panas 10.000°F sepanas permukaan matahari.
   - Tips interaktif pada widget Resqy (`mascot_inner_core_guide`) yang merangkum konsep bola besi padat akibat tekanan dahsyat dan titik pusat gravitasi bumi tanpa membocorkan format jawaban.

3. **Bahasa Ramah Anak SMP Kelas 8 & Zero Istilah Asing**:
   - Seluruh dialog disusun singkat (1-2 kalimat per balon percakapan), santai, dan mudah dimengerti.
   - Mengeliminasi istilah asing berat (*kisi kristal padat, anisotropi seismik, P-wave*) dan menggantinya dengan padanan bahasa sederhana (bola besi padat, suhu 10.000°F, titik pusat bumi 6.371 km dengan gravitasi nol).
   - Soal kuis Wordle gerbang Inti Dalam diselaraskan 100% dari materi NPC: `BOLABESIPADAT`, `SEPULUHRIBU`, dan `PUSAT`.

4. **Alur Kapsul Akhir Evakuasi & Penyelesaian Level 1**:
   - Saat soal tebak kata dari Komandan Bintang selesai, status `ic_challenge` terbuka, piala kemenangan aktif, dan pemain dapat menekan tombol **ENTER** di dekat kapsul akhir (`ic_portal_exit`, px: 1180) untuk menyelesaikan Level 1 dan meluncur ke Level 2.
   - Tampilan visual novel, potret transparan, dan tema tombol kayu retro dipertahankan 100% baku.

---

## 17. Ekspansi Level 1 Menjadi 8 Area & Implementasi Penuh Area 6: Batas Divergen (East African Rift & Pangea)

Berdasarkan penyesuaian kurikulum IPA SMP Kelas 8, materi batas-batas lempeng tektonik (Divergen, Konvergen, dan Transform) yang sebelumnya di Level 2 secara resmi diintegrasikan ke dalam **Level 1 (Earth Dive)**, sehingga Level 1 kini berkembang dari 5 area menjadi **8 area**:
1. Area 1: Permukaan Bumi
2. Area 2: Kerak Bumi (Litosfer)
3. Area 3: Mantel Bumi (Astenosfer)
4. Area 4: Inti Luar (Lautan Logam Cair)
5. Area 5: Inti Dalam (Bola Besi Padat)
6. **Area 6: Batas Divergen (East African Rift & Pangea)**
7. Area 7: Batas Konvergen & Subduksi
8. Area 8: Batas Transform & Sesar Geser

Penerapan menyeluruh pada Area 6 mencakup:

1. **Perbaikan Alur Selesai Level 1 & Transisi Menuju Area 6**:
   - Menghapus pemunculan prematur popup modal kemenangan ("LEVEL 1: EARTH DIVE SELESAI!") pada saat menyelesaikan evaluasi Inti Dalam (Area 5).
   - Membuka portal turun di Area 5 (`ic_portal_exit`) untuk langsung mengantarkan pemain turun meluncur ke Area 6 (Batas Divergen).
   - Pop-up kemenangan akhir Level 1 kini dicadangkan secara eksklusif untuk Area 8 (Batas Transform) sebagai puncak Level 1.

2. **Transformasi RPG Visual Novel & 5 NPC Peneliti di Area 6**:
   - Seluruh interaksi di Area 6 diwujudkan melalui 5 NPC hidup dengan sprite dunia dan potret bust 120x120 piksel berlatar transparan:
     - **Dr. Taufik** (*Pemandu Ekspedisi Tektonik Retakan*, px: 150): Menyambut pemain di zona retakan benua, menjelaskan fenomena pemisahan lempeng yang meregangkan kerak bumi.
     - **Prof. Maya** (*Ahli Teori Drift Benua & Pangea*, px: 380): Menjelaskan Superbenua Pangea yang terpecah 300 juta tahun lalu dan membuka modul **Temuan Geologis 10**.
     - **Dr. Citra** (*Peneliti Morfologi Lembah Retakan*, px: 720): Menjelaskan terbentuknya Lembah Retakan Afrika Timur (East African Rift) dan pegunungan kembar hasil patahan sesar normal, membuka modul **Temuan Geologis 11**.
     - **Prof. Ilham** (*Ahli Seafloor Spreading & Kerak Samudra Baru*, px: 1010): Menjelaskan magma mantel yang naik membeku menjadi batuan basal dan membentuk lantai samudra baru, membuka modul **Temuan Geologis 12**.
     - **Komandan Satria** (*Kepala Pengawas Gerbang Patahan Divergen*, px: 1140): Mengawal akses portal ke zona berikutnya dengan dialog interaktif 2 pilihan keputusan (siap uji tantangan vs melihat materi), tanpa membocorkan kunci jawaban Wordle.

3. **Tantangan Gerbang Kata (Wordle) Sesuai Materi SMP Kelas 8**:
   - Soal kuis Wordle gerbang batas divergen diambil 100% dari materi yang diajarkan oleh para peneliti:
     - `PANGEA` (Superbenua raksasa masa lampau yang terpecah akibat pergerakan lempeng tektonik).
     - `MENJAUH` (Arah pergerakan dua lempeng tektonik pada batas divergen).
     - `MAGMA` (Batuan cair panas dari mantel yang naik ke permukaan mengisi celah retakan lempeng).

4. **Ilustrasi Saintifik Interaktif SVG Baru di DiscoveryModal**:
   - **Pangea & Continental Drift** (`pangea-drift`): Komparasi visual benua 300 juta tahun lalu vs 7 benua modern dengan vektor panah pemisahan divergen.
   - **Rift Valley & Pegunungan Kembar** (`rift-valley`): Penampang blok sesar normal kiri dan kanan yang meregang menjauh dengan dasar lembah ambles (graben) dan magma naik.
   - **Pemekaran Dasar Laut** (`seafloor-spreading`): Penampang punggung tengah samudra (Mid-Ocean Ridge) di dasar laut dengan semburan hidrotermal (black smoker) dan kerak basal baru.

5. **Sistem Penilaian Baru 8 Area Berbobot 100 Poin**:
   - Area 1 (Permukaan): 12 poin
   - Area 2 (Kerak Bumi): 25 poin
   - Area 3 (Mantel Bumi): 38 poin
   - Area 4 (Inti Luar): 50 poin
   - Area 5 (Inti Dalam): 63 poin
   - Area 6 (Batas Divergen): 75 poin
   - Area 7 (Batas Konvergen): 88 poin
   - Area 8 (Batas Transform): 100 poin (Tuntas)

7. **Penyelarasan Total Peta & Materi Temuan Geologis dengan Level 2**:
   - **Penyelarasan Peta Batas Divergen**: Mengadopsi kontur medan 2.200 px (69 kolom) dari Level 2 secara utuh:
     - 3 jembatan magma beku (*cooled crust bridge*) di x: 605..675, x: 1315..1385, dan x: 1975..2035 dengan tekstur batu basal, klem baja di tepi tebing, dan urat magma membeku.
     - 3 jurang magma aktif bergejolak di x: 280, x: 960, dan x: 1680 dengan letupan gelembung dan kepulan asap belerang.
     - Latar belakang vulkanik dengan siluet gunung celah vulkanik berparalaks, kawah membara merah di puncak, kolom asap membubung, dan dinding tebing ngarai dengan retakan magma vertikal menyala.
   - **Penyelarasan Materi Temuan Sains 100% Persis Level 2**:
     - **Temuan 1: Alfred Wegener & Teori Pangea** (`wegener-pangea`): Menghadirkan peta interaktif Pangea dengan 7 kepingan benua yang dapat disentuh/diklik (Eurasia, Amerika Utara, Amerika Selatan, Afrika, India, Antartika, Australia).
     - **Temuan 2: Bukti Rantai Pegunungan Kembar** (`twin-mountains`): Menghadirkan peta rekonstruksi Pangea yang membuktikan Rantai Pegunungan Appalachian di Amerika dan Caledonian di Eropa bersambung rapi menjadi satu sabuk utuh.
     - **Temuan 3: Dinamika Pemekaran Batas Divergen** (`divergent-anim`): Menghadirkan simulator interaktif dengan tombol "SIMULASI PEMISAHAN", di mana lempeng memisah secara dinamis dan magma mantel naik mengisi celah.
   - **Koreksi Teks Portal Inti Dalam (Area 5)**:
     - Mengubah teks portal di Inti Dalam yang sebelumnya berlabel *"★ KAPSUL AKHIR ★"* menjadi *"▼ BATAS DIVERGEN ▼"*.
     - Menyesuaikan prompt aksi melayang menjadi *"TEKAN [E] / KLIK UNTUK MENUJU KE BATAS DIVERGEN"*.
   - **Koreksi Telemetri HUD & Radar di Area 6**:
     - Memperbaiki penentuan `strataData` pada HUD berdasarkan `zone.id === 'divergent'` sehingga telemetri menampilkan kedalaman 0–35 km, tekanan 1–5 GPa, dan suhu 800°C–1.200°C (bukan data Inti Dalam).

8. **Penyempurnaan Modal Temuan Sains (Full-Sized Illustration Container)**:
   - Mengatasi keluhan pengguna di mana gambar materi temuan sains di Area 6 terlihat terlalu kecil (`h-52 sm:h-64` / 208–256 px).
   - Memperbesar dimensi kontainer kanvas modal pada `DiscoveryModal.tsx` menjadi `h-72 sm:h-80` (288–320 px) serta menghapus pembatas `max-h-[300px]` pada elemen SVG.
   - Ketiga ilustrasi temuan geologis Area 6 kini tampil penuh, leluasa, dan tajam:
     - **Temuan 10 (Pangea)**: Peta rekonstruksi superbenua 250 juta tahun lalu dengan 7 lempeng benua yang dapat diklik secara interaktif.
     - **Temuan 11 (Sabuk Pegunungan Kembar)**: Peta pembuktian sabuk orogeni Appalachian di Amerika Utara dan Caledonian di Kepulauan Britania/Skandinavia yang menyatu.
     - **Temuan 12 (Simulator Pemekaran Samudra)**: Animasi interaktif penampang pemekaran lempeng divergen dengan tombol *"SIMULASI PEMISAHAN"*, lava pijar mantel yang naik, dan lempeng kerak litosfer yang bergeser ke kiri dan kanan.

9. **Overhaul Visual & Fisika Magma Mengisi Penuh Celah Jurang (Full-Depth Magma Chasm)**:
   - Mengatasi keluhan pengguna di mana danau lava tidak mengisi penuh lubang jurang dan terlihat kurang realistis.
   - Memperluas deteksi zona jurang di `sprites.ts` dari hanya 2 jurang menjadi seluruh 6 celah jurang retakan:
     - Jurang aktif: `[268, 342]`, `[950, 1030]`, `[1675, 1745]`.
     - Celah beku: `[605, 675]`, `[1315, 1385]`, `[1975, 2035]`.
   - Menyelaraskan elevasi permukaan magma `magmaTopY = 375` tepat di bawah bibir tebing, mengisi penuh rongga jurang hingga ke dasar terdalam (y = 455).
   - Menerapkan gradien warna termal bertingkat 6 lapis:
     - Permukaan pijar menyilaukan (`#ffffff`)
     - Kuning panas menyala (`#fef08a`)
     - Oranye cerah lava cair (`#fb923c`)
     - Oranye tua membara (`#f97316`)
     - Merah marun pekat (`#dc2626`)
     - Dasar magma gelap pekat (`#450a0a`)
   - Menambahkan pulau-pulau kerak basal beku yang mengapung di permukaan lava, garis permukaan lava berdenyut glow, 6 titik kepulan uap fumarol/abu vulkanik (`riftVents = [305, 640, 990, 1350, 1710, 2005]`), serta letupan gelembung magma mendidih.

10. **Resolusi Tuntas "Gerbang & Komandan Satria Hilang" (Dynamic Map Width 2.200 px & Camera Unlocking)**:
    - **Akar Masalah**: Peta Area 6 dirancang sepanjang 2.200 px (69 kolom) untuk menampung seluruh rute ekspedisi geologis yang kaya (5 NPC, 3 Temuan Sains, 3 Kristal, dan 6 Jurang). Komandan Satria ditempatkan di `px: 2060`, Gerbang Wordle di `px: 2110`, dan Portal Turun di `px: 2160`. Namun game engine Level 1 sebelumnya mengasumsikan lebar peta tetap `MAP_WIDTH_PX = 1280`:
      - `gameEngine.ts` meng-clamp posisi kamera x ke `MAP_WIDTH_PX - viewW` (maksimal ~480 px, hanya menampilkan dunia hingga x = 1280).
      - `sprites.ts` pada `renderOrganicZoneTerrain` membatasi penggambaran medan ke `w = MAP_WIDTH_PX` (1.280 px), sehingga medan setelah x = 1280 kosong melompong.
      - `zones.ts` pada `getGroundY` dan `getCeilingY` meng-clamp koordinat x ke `MAP_WIDTH_PX - 1` (1.279 px).
      - Akibatnya pemain yang berjalan ke timur terbentur dinding kamera di x = 1280 dan tidak dapat melihat Komandan Satria ataupun Gerbang di x = 2060–2160, sehingga dilaporkan "hilang".
    - **Tindakan Perbaikan**:
      - `gameEngine.ts`: Memperbarui kamera (`initGame`, `handleTransitionStep`, `renderGame`), clamping pemain (`initialX`), dan `updateCamera` agar menggunakan dimensi riil zona `currentZone.cols * TILE` (2.208 px untuk Area 6).
      - `sprites.ts`: Memperbarui `renderOrganicZoneTerrain` agar menggambar medan selebar `zone.cols * TILE` (2.208 px) penuh hingga ke altar akhir, serta memperbarui clamping tiang perancah dan akar pohon.
      - `zones.ts`: Menjadikan `getGroundY` dan `getCeilingY` dinamis mengikuti panjang profil (`maxW = zone.groundProfile.length`).
11. **Harmonisasi Desain Area 6: Eliminasi Gerbang Fisik, Pemindahan Soal ke Komandan Satria, Soal Batas Divergen SMP Kelas 8 & Pencegahan Kebocoran Jawaban**:
    - **Penghapusan Balok Gerbang Fisik (`challenge_gate`) di Area 6**:
      - Menghapus objek mesin/balok fisik `{ type: 'challenge_gate', px: 2110, py: 360, id: 'divergent_challenge' }` dari `buildDivergentZone` di [`zones.ts`](file:///c:/github/lidm%20buatan%20vincent/RESQ-BOX/src/app/Level1/EarthDive/engine/zones.ts).
      - Menyelaraskan desain Area 6 agar 100% seragam dengan Area 2 (Kerak Bumi), Area 3 (Mantel), Area 4 (Inti Luar), dan Area 5 (Inti Dalam), di mana tantangan evaluasi sains akhir zona dipicu langsung melalui percakapan dengan NPC Komandan akhir zona (**Komandan Satria** di `px: 2080`).
    - **Penyelarasan Soal Evaluasi Batas Divergen (Tingkat SMP Kelas 8)**:
      - Menyesuaikan 3 kata target kuis tebak kata di `ZONE_GATE_QUESTIONS[5]` pada [`EarthDiveGame.tsx`](file:///c:/github/lidm%20buatan%20vincent/RESQ-BOX/src/app/Level1/EarthDive/EarthDiveGame.tsx):
        1. `PANGEA` (Hint: *"Nama superbenua raksasa purba yang dulunya menyatukan seluruh daratan bumi."*) — 100% diambil dari Temuan Sains 1 (Prof. Maya).
        2. `MENJAUH` (Hint: *"Arah pergerakan dua lempeng tektonik pada batas divergen saling..."*) — 100% diambil dari Temuan Sains 3 (Prof. Ilham).
        3. `MAGMA` (Hint: *"Batuan cair panas dari mantel bumi yang menerobos naik mengisi celah rekahan lempeng."*) — 100% diambil dari Temuan Sains 3 (Prof. Ilham).
      - Seluruh soal mudah dipahami untuk anak SMP kelas 8 dan murni bersumber dari modul materi yang diajarkan oleh para peneliti.
    - **Pencegahan Kebocoran Jawaban pada Percakapan Dialog NPC**:
      - Menghilangkan penyebutan langsung kata kunci jawaban (`PANGEA`, `MENJAUH`, `MAGMA`) dari seluruh balon dialog percakapan NPC di [`dialogueData.ts`](file:///c:/github/lidm%20buatan%20vincent/RESQ-BOX/src/app/Level1/EarthDive/dialogueData.ts) (Prof. Maya, Dr. Taufik, Dr. Citra, Prof. Ilham, Resqy, dan Komandan Satria).
      - Siswa diarahkan untuk meneliti dan mengamati modul temuan sains secara langsung guna menemukan jawaban, melatih literasi sains mandiri.
    - **Mekanisme Gating Materi Sains yang Ketat (Discovery Check)**:
      - Interaksi dengan Komandan Satria secara otomatis memeriksa pembacaan ketiga materi temuan sains Area 6 (`div_disc1`, `div_disc2`, dan `div_disc3`).
      - Jika pemain belum membuka/mempelajari ketiga materi dari Prof. Maya, Dr. Citra, dan Prof. Ilham, Komandan Satria akan menolak membuka kuis dan mengarahkan pemain kembali untuk mempelajari materi terlebih dahulu (`komandan_satria_locked_dialogue`).
      - Jika ketiga materi telah selesai dipelajari, opsi tantangan kuis tebak kata akan terbuka (`komandan_satria_ready_dialogue`).
      - Portal turun ke area selanjutnya (`portal_down`) terkunci rapat hingga tantangan kuis Komandan Satria diselesaikan. Setelah selesai, portal dapat langsung digunakan untuk meluncur ke area berikutnya.

12. **Penyederhanaan Standar Nama Resmi "Batas Divergen" (Zero Label Tambahan)**:
    - Menyeragamkan seluruh sebutan nama Area 6 di konfigurasi zona ([`zones.ts`](file:///c:/github/lidm%20buatan%20vincent/RESQ-BOX/src/app/Level1/EarthDive/engine/zones.ts)) dan metadata strata kurikulum geologis ([`earthDiveData.ts`](file:///c:/github/lidm%20buatan%20vincent/RESQ-BOX/src/app/Level1/EarthDive/earthDiveData.ts)) dari semula *"Batas Divergen (Lembah Retakan)"* menjadi **"Batas Divergen"**.
    - Penyeragaman ini memastikan teks badge pill di kiri atas HUD telemetri `TelemetryHUD.tsx`, radar mini bumi, dan modal materi konsisten, rapi, dan serasi dengan nama area lainnya (*Permukaan Bumi*, *Kerak Bumi*, *Mantel Bumi*, *Inti Luar*, *Inti Dalam*, *Batas Konvergen*, dan *Batas Transform*).

13. **Investigasi Mendalam & Solusi Tuntas Bug Transisi Area 6 & Karakter Freeze**:
    - **Akar Masalah Pop-up Kemenangan Level 1 Prematur di Batas Divergen**:
      - Pada [`gameEngine.ts`](file:///c:/github/lidm%20buatan%20vincent/RESQ-BOX/src/app/Level1/EarthDive/engine/gameEngine.ts) dan fungsi `triggerDiveDown`, portal turun memeriksa kondisi akhir level:
        ```typescript
        if (state.currentZone >= ZONES.length - 1) {
          state.pendingCoreChallenge = true;
          return;
        }
        ```
      - Karena array `ZONES` Level 1 di [`zones.ts`](file:///c:/github/lidm%20buatan%20vincent/RESQ-BOX/src/app/Level1/EarthDive/engine/zones.ts) saat ini baru berisi 6 zona (Index 0 s.d. 5: Surface, Crust, Mantle, Outer Core, Inner Core, Divergent), saat pemain berinteraksi dengan portal turun di Batas Divergen (`div_portal_down` bertuliskan *▼ BATAS KONVERGEN ▼*), kondisi `5 >= 5` langsung terpenuhi sehingga sistem secara keliru menganggap ekspedisi Level 1 tuntas dan memunculkan pop-up kemenangan `CoreChallengeModal` (*"LEVEL 1: EARTH DIVE SELESAI!"*).
      - Padahal sesuai desain arsitektur kurikulum geologis dan indikator lapisan [`earthDiveSync.ts`](file:///c:/github/lidm%20buatan%20vincent/RESQ-BOX/src/app/Level1/EarthDive/earthDiveSync.ts), Level 1 memiliki 8 zona sekuensial lengkap: Area 1 Permukaan Bumi (0 km), Area 2 Kerak Bumi (100 km), Area 3 Mantel Bumi (2.900 km), Area 4 Inti Luar (5.150 km), Area 5 Inti Dalam (6.371 km), Area 6 Batas Divergen, Area 7 Batas Konvergen & Subduksi, dan Area 8 Batas Transform & Sesar Geser.
    - **Akar Masalah Karakter Freeze / Macet Setelah Pop-up Ditutup**:
      - Pada [`player.ts`](file:///c:/github/lidm%20buatan%20vincent/RESQ-BOX/src/app/Level1/EarthDive/engine/player.ts), logika deteksi lereng menghitung perbedaan elevasi menggunakan:
        ```typescript
        const targetGroundY = getEffectiveGround(zone, clampedX, player.y, player.y);
        const slopeDy = targetGroundY - player.y;
        if (slopeDy < -6) {
          // Terhalang tebing terjal menanjak, pemain tidak bisa menembus
        }
        ```
      - Ketika animasi pemekaran dinamis lempeng divergen berjalan (`updateDivergentGroundProfile`), profil elevasi tanah terangkat naik (hingga 14 px) untuk membentuk bibir jurang merekah. Ketika tanah naik, posisi `player.y` sesaat berada di bawah profil tanah baru, sehingga `targetGroundY - player.y < -6`. Akibatnya pergerakan horizontal ke kiri maupun ke kanan terkunci mati (*clamped / freeze*) karena sistem salah mendeteksi pemain sedang membentur dinding tebing tegak lurus dari kedua arah.
    - **Solusi Tuntas yang Telah Diimplementasikan**:
      1. *Pencegahan Pop-up Prematur*: Sesuai arahan pengguna di mana Area 7 (Batas Konvergen) dan Area 8 (Batas Transform) ditahan pembuatannya untuk mendiskusikan konsep terlebih dahulu, interaksi dengan portal turun `div_portal_down` dan shortcut tombol panah bawah di Batas Divergen (Zone 5) dialihkan memunculkan notifikasi/toast ramah (`pendingAreaUnderConstruction = 'Batas Konvergen'`: *"Jalur menuju Batas Konvergen sedang disiapkan! Silakan jelajahi area Batas Divergen terlebih dahulu."*) tanpa memicu `pendingCoreChallenge`. Pop-up kemenangan Level 1 tidak akan pernah muncul prematur di Area 6.
      2. *Resolusi Karakter Freeze pada Lereng Divergen*: Memperbarui kalkulasi lereng di `player.ts` menggunakan perbandingan elevasi tanah aktual `slopeDy = targetGroundY - currentGroundY` dengan toleransi wajar (`> 10` untuk jurang, `< -10` untuk dinding terjal), serta auto-snapping mengangkat karakter ke permukaan jika `player.y > currentGroundY + 1`. Pemain kini bebas bergerak ke kiri dan kanan dengan mulus di seluruh lereng gundukan divergen tanpa tersangkut.
      3. *Reset Tombol & Auto-Focus Kanvas*: Menambahkan utilitas `resetInputKeys()` dan listener `blur` pada `player.ts`, serta hook `useEffect` di `EarthDiveGame.tsx` yang secara otomatis membersihkan tombol tertahan dan memfokuskan kembali elemen kanvas (`canvasRef.current?.focus()`) setiap kali modal apapun tertutup, menjamin kontrol keyboard selalu responsif.

14. **Overhaul Total Batas Konvergen (Area 7: Subduksi Samudra & Vulkanisme)**:
    - **Penapakan Kaki NPC di Permukaan Tanah (Zero Floating)**:
      - Menemukan akar penyebab NPC melayang pada `OBJECT_HEIGHTS.npc = 32` di [`zones.ts`](./src/app/Level1/EarthDive/engine/zones.ts) yang menggeser posisi Y ke atas sebesar 32 px. Mengubahnya menjadi `0` karena titik tumpu sprite 2D kaki NPC di [`npcSprites.ts`](./src/app/Level1/EarthDive/engine/npcSprites.ts) sudah berada tepat di titik nol (`y + 0`).
      - Mendaftarkan seluruh 4 NPC Area 7 (**Dr. Farhan** di `px: 620`, **Prof. Ratna** di `px: 840`, **Dr. Bayu** di `px: 1100`, dan **Komandan Arya** di `px: 1380`) ke blok `zoneIndex === 6` pada fungsi `createInitialNpcs` di [`npcManager.ts`](./src/app/Level1/EarthDive/engine/npcManager.ts), sehingga posisi Y tiap NPC secara otomatis menempel presisi di kontur tanah elevasi dinamis (`getGroundY`) setiap frame.
    - **Posisi Palung di Tengah Laut & Penunjaman Miring Subduksi Realistis**:
      - Memposisikan palung samudra di tengah bentang perairan laut (`x: 240..460`), jauh dari bibir daratan benua (`x = 530`), persis seperti diagram referensi penunjaman lempeng *Oceanic-Continental Subduction Zone*.
      - Menghilangkan bentuk jurang kotak tegak lurus kaku. Mendesain kelengkungan dinamis lempeng samudra yang menunjam miring (*subducting slab*) ke bawah menembus mantel bumi (`y: 405 -> 495+`).
      - Menghapus jembatan batu di atas palung dan menghilangkan seluruh magma/lava pijar di bawah laut, menggantikannya dengan batuan padat mantel bumi bersahaja (`#362208`). Pemain mengarungi samudra dengan mulus mengendarai Perahu Riset Oseanografi pixel 2D.
    - **Pengisian Air Laut Penuh & Animasi Aliran Air Terjun Masuk ke Palung**:
    - **Pengisian Air Laut Penuh & Perahu Riset Oseanografi**:
      - Air laut biru membentang luas dari `x = 0` hingga bibir dermaga benua `x = 518`, langsung mengisi penuh rongga palung yang terbuka (`y: 360 -> 460`).
      - Menjamin pemain yang membuka Area 7 memulai dari atas perahu riset (`x = 110`) menghadap ke timur, mengarungi permukaan samudra menuju dermaga pantai benua.

15. **Penyempurnaan HUD Telemetri, Eliminasi Celah Palung & Pembaruan Strata Kerak Samudra (Area 7)**:
    - **Penghapusan Tombol Simulasi dari HUD**:
      - Menghapus tombol `↻ SIMULASI PALUNG & GUNUNG` dan `↻ SIMULASI PEMEKARAN` dari bilah status HUD di [`EarthDiveGame.tsx`](./src/app/Level1/EarthDive/EarthDiveGame.tsx) sesuai instruksi pengguna agar layar permainan bersih, terfokus, dan bebas dari tombol berulang.
    - **Header Telemetry HUD Terkunci Presisi di Tengah Layar**:
      - Menempatkan kontainer `TelemetryHUD` ke dalam wrapper mandiri `fixed top-2.5 sm:top-3 left-1/2 -translate-x-1/2 z-20` di [`EarthDiveGame.tsx`](./src/app/Level1/EarthDive/EarthDiveGame.tsx).
      - Menjamin seluruh indikator telemetri (kedalaman riil, suhu, tekanan, kristal, dan darah) terkunci secara matematis tepat di tengah layar pada semua ukuran viewport peramban, tanpa tergeser oleh widget navigasi kiri atau radar bumi kanan.
    - **Formula Dasar Laut Terpadu (`getConvergentSeafloorProfile`) & Eliminasi Celah**:
      - Mengidentifikasi akar masalah celah/gap tembus pandang pada lereng palung yang terjadi akibat ketidakcocokan kurva antara lempeng samudra, prisma akresi lereng benua, dan interpolasi kedalaman air laut.
      - Mengimplementasikan satu formula profil matematis tunggal `getConvergentSeafloorProfile(x, p)` di [`sprites.ts`](./src/app/Level1/EarthDive/engine/sprites.ts) yang dipakai secara identik oleh batuan kerak samudra, prisma akresi lereng benua, dan cekungan air laut.
      - Memperluas fondasi mantel astenosfer peridotit solid (`#261405`) dari `y = 356` ke bawah kanvas (`h`) di seluruh bentang lebar peta, menjamin 100% tidak ada celah latar belakang langit/kabut yang dapat tembus di bawah air atau lereng.
    - **Peningkatan Visual & Strata Geologis Otentik Kerak Samudra (*Ophiolite Sequence*)**:
      - Mengembangkan visualisasi kerak samudra berstrata geologis nyata:
        1. *Lapisan 1 (Sedimen Laut Pelagis / Pelagic Silt)*: Silt laut dalam kelabu (`#475569` & `#64748b`) dengan laminasi garis endapan horizontal halus.
        2. *Lapisan 2 (Basal Bantal / Pillow Basalt)*: Bentukan kubah membulat basal bantal vulkanik berulang (`#1e293b`, `#334155`) dengan bayangan pendinginan kaca vulkanik (`#0f172a`), kristal plagioklas feldspar (`#cbd5e1`), dan urat zeolit hidrotermal biru muda (`#38bdf8`).
        3. *Lapisan 3 (Sheeted Dykes)*: Intrusi lembar vertikal diabase basaltik (`#141d2c`).
        4. *Lapisan 4 (Gabro Plutonik Berlapis & Mantel Peridotit)*: Batuan ultra-mafik pekat (`#090d16`) yang diperkaya butiran kristal mineral olivin & piroksen hijau zamrud terang (`#0d9488`, `#10b981`).
        5. *Tectonic Bend Flexure*: Retakan regangan normal di punggung palung luar saat lempeng menekuk menunjam ke mantel bumi.
    - **Pembersihan Artefak Kotak Putih pada Air Palung**:
16. **Persistensi Posisi Karakter di Semua Area Saat Refresh & Pemutaran Ulang Animasi Dinamis Tektonik**:
    - **Persistensi Posisi Karakter (Zero Reset on Reload)**:
      - Memperbarui sistem penyimpanan state `SavedEarthDiveProgress` di [`gameEngine.ts`](./src/app/Level1/EarthDive/engine/gameEngine.ts) dengan menambahkan kamus histori posisi per-zona (`zonePositions: Record<number, { x: number; y: number; dir: 'left' | 'right' }>`).
      - Menyimpan posisi persis koordinat `x`, `y`, dan arah hadap `dir` karakter ke dalam `localStorage` secara dual-key (`earthdive_save_${userId}` dan mirrored ke `resqbox_earthdive_progress`).
      - Menghapus aturan reset posisi hardcoded pada Batas Konvergen (`zoneIndex === 6`) yang sebelumnya memulangkan karakter ke perahu (`x = 110`) setiap kali reload bila tantangan belum tuntas.
      - Meningkatkan frekuensi auto-save pada game tick dari semula tiap 120 frame menjadi setiap 45 frame (~750 ms) serta auto-save instan saat karakter berhenti bergerak.
      - Menambahkan listener `pagehide` dan `visibilitychange` di [`EarthDiveGame.tsx`](./src/app/Level1/EarthDive/EarthDiveGame.tsx) untuk menjamin posisi pemain tersimpan aman bahkan saat refresh cepat atau perpindahan tab browser.
    - **Pemutaran Ulang Animasi Tektonik Tanpa Mengulang Posisi Karakter**:
      - Sesuai permintaan pengguna, saat halaman di-refresh, animasi dinamis tektonik pada area yang memiliki animasi (Batas Divergen / Area 6 dan Batas Konvergen / Area 7) **selalu diputar ulang dari awal (`progress = 0`)** agar murid tetap dapat menikmati fenomena tektonik (pemekaran celah magma dan pembentukan lipatan pegunungan).
      - Posisi horizontal karakter (`initialX`) dan arah hadap (`dir`) tetap dipertahankan persis di tempat terakhir pemain berada (misalnya di puncak gunung $X = 980$ seperti pada tangkapan layar pengguna).
      - Pada inisialisasi, elevasi awal `initialY` diselaraskan ke permukaan dasar tanah pada `progress = 0` via `getEffectiveGround`.
      - Pada `tickGame`, saat animasi tektonik berlangsung dan tanah terangkat naik membentuk pegunungan, sistem secara real-time menyesuaikan `state.player.y = getEffectiveGround(zone, state.player.x, state.player.y)` sehingga karakter terangkat naik secara dinamis dan mulus bersama naiknya gunung hingga ke puncaknya.
      - Menambahkan panggilan `snapObjectsToGround(zone)` pada `updateConvergentGroundProfile` dan `updateDivergentGroundProfile` di [`zones.ts`](./src/app/Level1/EarthDive/engine/zones.ts) sehingga kristal, papan catatan, NPC, dan gerbang juga menempel dan naik secara alami bersama elevasi tanah.

17. **Penyempurnaan Menyeluruh Area 8 (Batas Transform — Patahan San Andreas), Mekanika Lompat Celah Sesar, Kontrol Analog 4 Arah, HUD Tablet & Anti-Burem Resolusi Tinggi**:
    - **Penghapusan Kerucut Merah/Oranye di Jalan**:
      - Menghapus kerucut/penghalang darurat oranye-merah (`#ea580c`) di ujung patahan jalan aspal pada [`sprites.ts`](./src/app/Level1/EarthDive/engine/sprites.ts) sehingga tampilan patahan jalan bersih, natural, dan terfokus pada pergeseran blok tektonik (*horizontal strike-slip shear*).
    - **Tekstur Jalan Aspal & Sungai Kontinu Solid (Zero Scanline Gaps)**:
      - Menghilangkan teknik perulangan loop 4px bergaris-garis yang sebelumnya menimbulkan ilusi celah horizontal pada jalan raya dan dasar sungai.
      - Menggambar jalan aspal sebagai poligon mulus kontinu lengkap dengan tekstur pori aspal mikro, garis pembatas bahu jalan putih tebal, marka putus-putus kuning marka tengah, serta penyesuaian sudut geser dinamis.
      - Menggambar aliran sungai Wallace Creek sebagai pita kurva sungai kontinu utuh dengan bantaran kerikil aluvium kering, tepi lumpur lembap, dan air jernih mengalir tanpa ada celah atau potongan garis lagi.
    - **Efek Retakan Gempa Bumi Percabangan Geologis Realistis (Branching Rupture Fissures)**:
      - Menghilangkan garis miring tunggal sejajar (`/ / / /`) yang monoton di sepanjang garis sesar.
      - Mengimplementasikan 25 benih retakan geologis acak terkoordinasi (*fault rupture traces*) dengan cabang fraktur zig-zag (*bifurcated branching fissures*), sudut variatif tajam, kedalaman rekahan tanah hitam pekat, serta sorotan tepi bebatuan retak (*chalky lithic highlights*) menyerupai zona rekahan gempa bumi nyata (*San Andreas fault rupture zone*).
    - **Mekanika Halangan Celah Patahan & Fisika Lompat Top-Down**:
      - Menambahkan batas tabrakan rintangan sesar pada koordinat $Y = 228$ (bibir utara) dan $Y = 252$ (bibir selatan) di [`player.ts`](./src/app/Level1/EarthDive/engine/player.ts). Karakter yang berjalan di tanah tidak bisa menembus celah patahan ini secara langsung.
      - Mengimplementasikan fisika lompatan top-down parabola 3D (`jumpZ` dan gravitasi vertikal `jumpZVelocity`) pada karakter di [`player.ts`](./src/app/Level1/EarthDive/engine/player.ts) serta bayangan tanah (*ground shadow*) yang dinamis mengecil saat pemain melayang di [`renderer.ts`](./src/app/Level1/EarthDive/engine/renderer.ts).
      - Pemain dapat melompati lubang sesar menggunakan tombol Spasi / tombol LOMPAT khusus pada ponsel atau tablet.
    - **Pemisahan Tombol Atas dan Tombol Melompat (Dedicated Up vs Jump Input)**:
      - Memisahkan pendeteksian input keyboard `readInput()`: tombol `ArrowUp` / `KeyW` dan D-pad Up sentuh secara murni menggerakkan karakter ke atas / Utara (`dy = -SPEED`) tanpa memicu lompatan.
      - Mekanika lompatan di area top-down (Area 8) dieksekusi secara eksklusif oleh tombol `Space` (keyboard) atau tombol sentuh `LONCAT` di sebelah kanan.
      - Di area pandangan samping (Area 0-6), tombol Atas tetap mendukung lompatan naik tangga/lereng secara intuitif.
    - **Pemindahan Posisi Komandan Guntur & Kapsul Evakuasi ke Daratan Padat Selatan**:
      - Mengatasi bug posisi Komandan Guntur (`npc_guntur_trans`) yang awalnya berada di koordinat $Y = 240$ (tepat di dalam rongga retakan sesar).
      - Menyelaraskan koordinat Komandan Guntur ke daratan padat Lempeng Amerika Utara di bagian selatan pada **$X = 1360, Y = 315$** di kedua berkas [`zones.ts`](./src/app/Level1/EarthDive/engine/zones.ts) dan [`npcManager.ts`](./src/app/Level1/EarthDive/engine/npcManager.ts).
      - Menempatkan Kapsul Evakuasi Akhir (`trans_portal_exit`) di **$X = 1470, Y = 315$** berdampingan rapi dengan Komandan Guntur, serta Kristal Geologis 2 di **$X = 720, Y = 310$** di daratan padat.
    - **Penyelarasan Kunci Temuan Sains & Pembukaan Tantangan Evaluasi Akhir Level 1**:
      - Memperbaiki ketidakcocokan identifikasi temuan geologis antara objek dunia game (`'trans_disc1'`, `'trans_disc2'`) dan pengecekan dialog (`'trans_seismo'`, `'trans_sanandreas'`).
      - Mendaftarkan seluruh variasi alias kunci temuan sains di [`EarthDiveGame.tsx`](./src/app/Level1/EarthDive/EarthDiveGame.tsx) sehingga begitu siswa membaca salah satu atau kedua materi dari para peneliti, Komandan Guntur langsung menyambut dengan percakapan siap evaluasi (`ready`).
      - Kuis tebak kata Wordle akhir Area 8 mencakup 3 kata kunci geologi transform: `TRANSFORM` (9 huruf), `SANANDREAS` (10 huruf), dan `SISMOGRAF` (9 huruf).
      - Menyelesaikan tantangan ini secara otomatis membuka Kapsul Evakuasi Akhir, memberikan skor 100 poin penuh, dan menyelesaikan seluruh ekspedisi Level 1.
    - **Analog D-Pad Sentuh 4 Arah & Tombol Aksi Mandiri pada Ponsel/Tablet**:
      - Mengubah kontrol analog sentuh sebelah kiri dari 2 arah (kiri-kanan) menjadi **D-Pad berlian 4 arah (Atas, Bawah, Kiri, Kanan)** di [`EarthDiveGame.tsx`](./src/app/Level1/EarthDive/EarthDiveGame.tsx).
      - Tombol kanan dilengkapi tombol **LONCAT (Lompat)** dan tombol **AKSI [E] (Interaksi)** dengan kontras retro yang jelas.
    - **Pemberesan Tata Letak HUD Kiri Atas & Optimasi Layar Tablet**:
      - Memperbaiki penataan kontainer navigasi kiri atas agar badge nama strata (`BATAS TRANSFORM`) dan tombol `PUTAR ULANG PERGESERAN` tersusun rapi vertikal pada layar tablet / medium (`flex-col xl:flex-row`), sehingga tidak pernah menabrak tombol menu di atasnya atau telemetri di kanannya.
      - Mengoptimalkan teks suhu pada [`TelemetryHUD.tsx`](./src/app/Level1/EarthDive/TelemetryHUD.tsx) agar pada layar sempit/tablet menampilkan angka ringkas (misal: `350°C`) untuk mencegah bilah telemetri melebar melebihi batas layar.
    - **Perbaikan Tulisan Burem saat Layar di-Zoom In (High-DPI / DevicePixelRatio Rendering)**:
      - Memperbaiki akar penyebab kanvas dan teks buram saat browser di-zoom in (150%, 200%, 250%) dengan memperhitungkan `window.devicePixelRatio` di `resizeCanvas` pada [`EarthDiveGame.tsx`](./src/app/Level1/EarthDive/EarthDiveGame.tsx) dan [`TectonicGame.tsx`](./src/app/Level2/engine/TectonicGame.tsx).
      - Mengalikan resolusi internal kanvas dengan rasio piksel fisik layar (`pixelW = Math.round(cssW * dpr)`) dan menyematkan gaya CSS `width`/`height` eksplisit, menjamin ketajaman 100% pada semua level zoom maupun layar Retina tablet iPad siswa.
      - Menambahkan rendering tipografi anti-aliasing tajam (`-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; text-rendering: optimizeLegibility;`) di [`index.css`](./src/index.css) untuk semua teks web dan font pixel retro.

### 18. Isolasi Penuh Progres Multi-Akun (Strict User Scoping)
- **Modul**: [`gameEngine.ts`](./src/app/Level1/EarthDive/engine/gameEngine.ts), [`EarthDiveGame.tsx`](./src/app/Level1/EarthDive/EarthDiveGame.tsx), [`teacherStore.ts`](./src/store/teacherStore.ts)
- **Akar Masalah Kebocoran Area 8 ke Akun Lain**:
  - Pada implementasi sebelumnya, `saveEarthDiveProgress` menduplikasi (*mirroring*) data sesi ke kunci umum tanpa nama `resqbox_earthdive_progress`, dan fungsi `loadEarthDiveProgress` memiliki *fallback* otomatis yang membaca kunci umum tersebut bila akun baru belum memiliki catatan progres tersimpan. Akibatnya, saat akun pertama bermain hingga Area 8, akun kedua yang baru login langsung mewarisi data Area 8 tersebut.
  - Selain itu, siklus hidup React pada `EarthDiveGame.tsx` mempertahankan referensi objek `gameRef.current` di memori peramban. Jika pengguna berganti akun secara instan melalui navigasi *client-side* tanpa *hard refresh*, objek game lama di Area 8 tetap aktif dan langsung menimpa data akun baru saat auto-save terpicu.
- **Rincian Solusi Rekayasa & Keamanan State**:
  - **Penghapusan Mirroring & Fallback Kunci Global**:
    - `getEarthDiveStorageKey(userId)` selalu menghasilkan format terisolasi: `resqbox_earthdive_progress_${userId || 'guest'}`.
    - Menghapus sepenuhnya kode duplikasi penyimpanan ke `BASE_STORAGE_KEY` pada `saveEarthDiveProgress`.
    - Menghapus logika fallback ke `BASE_STORAGE_KEY` pada `loadEarthDiveProgress`. Akun baru tanpa save dijamin mengembalikan `null` dan memulai penjelajahan dari Zona 0 (Permukaan Bumi / 0 km).
  - **Deteksi Pergantian Akun & Rekonstruksi Objek Game**:
    - Pada hook `useEffect([activeUserId])` di `EarthDiveGame.tsx`, sistem memeriksa kecocokan `gameRef.current.userId !== activeUserId`.
    - Jika terdeteksi pergantian akun, objek game lama di memori langsung dibuang dan dibuat ulang dari awal dengan `createGameState(activeUserId)` serta telemetri HUD diselaraskan kembali ke kondisi awal 0 km.
  - **Penjaga Lifecycle Auto-Save (`handleSave`)**:
    - Penyimpanan sesi saat `beforeunload`, `pagehide`, atau `visibilitychange` hanya dijalankan jika `gameRef.current.userId === activeUserId` sehingga tidak pernah ada kontaminasi antar pengguna.
  - **Sanitasi Kunci Legacy pada Login & Logout**:
    - Menambahkan pembersihan otomatis terhadap kunci residu `resqbox_earthdive_progress` di dalam store autentikasi [`teacherStore.ts`](./src/store/teacherStore.ts) pada saat proses `login`, `setCurrentUser`, dan `logout`.

### 19. Penyelarasan Header Telemetri Diciutkan (*Collapsible Pill*) di Semua Layar
- **Modul**: [`TelemetryHUD.tsx`](./src/app/Level1/EarthDive/TelemetryHUD.tsx), [`EarthDiveGame.tsx`](./src/app/Level1/EarthDive/EarthDiveGame.tsx), [`TectonicGame.tsx`](./src/app/Level2/engine/TectonicGame.tsx)
- **Kebutuhan Pengguna**:
  - Menyederhanakan tampilan bilah header indikator telemetri yang sebelumnya selalu terbuka lebar di desktop/tablet sehingga memenuhi area atas layar. Pengguna menginginkan tampilan ringkas berbentuk kapsul `[ 📢 TELEMETRI  ▼ ]` persis seperti tangkapan layar di **semua ukuran layar (mobile, tablet, laptop, dan desktop)** dan lintas permainan (Level 1 dan Level 2).
- **Rincian Rekayasa & Estetika**:
  - **Kapsul Retro Seragam (*Consistent Retro Capsule*)**:
    - Menghilangkan pembatas media query `sm:hidden` dan `window.innerWidth >= 640` yang sebelumnya memaksakan mode terbuka pada desktop/tablet.
    - Menjadikan kapsul `[ 📢 TELEMETRI  ▼ ]` sebagai tombol utama yang elegan dengan sudut membulat retro (`rounded-2xl sm:rounded-3xl`), border amber ganda (`border-2 sm:border-3 border-amber-600/90`), background obsidian blur (`bg-slate-950/95 backdrop-blur-md`), teks pixel kuning emas (`font-pixel-title text-amber-400`), dan bayangan 3D retro (`shadow-[0_5px_0_#231206]`).
  - **Kondisi Awal Diciutkan (*Default Collapsed*)**:
    - Nilai awal state `isExpanded` disetel ke `false` secara default sehingga layar langsung tampil bersih dan lega saat pemain memasuki permainan.
  - **Interaksi Dropdown Responsif (*Smooth Accordion Expand*)**:
    - Mengklik bilah kapsul memicu SFX `retroAudio.playSelect()` dan membuka daftar chip indikator di bawah garis pembatas horizontal (`border-b border-amber-800/40`) dengan animasi fade-in.
    - Pada Level 1 memuat: Kedalaman (KM), Tekanan (GPa), Suhu (°C), Kristal (X/Y), Temuan Sains (X/Y), dan Bar Ketahanan HP.
    - Mengintegrasikan modul `TelemetryHUD` yang sama ke dalam Level 2 ([`TectonicGame.tsx`](./src/app/Level2/engine/TectonicGame.tsx)) untuk memuat: Kristal Tektonik, Temuan Geologis, dan Bar HP, sehingga pengalaman antarmuka kedua level identik 100%.

### 20. Pembersihan Total Latar Belakang & Rekonstruksi Geologi Murni Interior Bumi
- **Modul**: [`sprites.ts`](./src/app/Level1/EarthDive/engine/sprites.ts), [`zones.ts`](./src/app/Level1/EarthDive/engine/zones.ts)
- **Kebutuhan Pengguna**:
  - Kerak Bumi: Mengubah latar belakang agar memiliki fosil-fosil purba di dinding gua dan strata batuan, serta menghadirkan animasi aktivitas nyata para penambang geologis.
  - Mantel Bumi: Mengubah latar belakang menjadi lautan magma penuh yang murni cair tanpa struktur kaku, serta **menghapus batuan basal/kerak mengambang** di latar belakang.
  - Inti Luar: Mengubah latar belakang menjadi samudra magma/logam cair nikel-besi yang jauh lebih cerah 9.000°F dan menambahkan **efek garis medan magnet bumi (*geomagnetic dipole flux loops*)** sebagai generator dinamo pelindung bumi dari radiasi matahari.
  - Inti Dalam: Mengubah kontur tanah menjadi **100% datar sempurna** (`y = 350`) menyerupai bola besi padat, warna tanah kuning keemasan, serta **menghapus total pilar kristal tengah (`ic_crystal`), altar mahkota, dan kerucut/spikes obelisk** di lantai.
- **Rincian Rekayasa Visual**:
  1. **Kerak Bumi (`crust`)**:
     - Menghadirkan fosil purba ammonite melingkar, jejak karapas trilobita, dan fosil tulang daun pakis purba (*Glossopteris*) di dinding batuan dan strata tanah menggunakan fungsi prosedural `drawPixelFossil`.
     - Mengimplementasikan staf penambang pixel art dinamis di latar belakang yang memegang palu geologi serta mengayunkan beliung tambang (*pickaxe*) lengkap dengan siklus animasi ancang-ancang, hantaman ke dinding batu, dan percikan api (*sparks on impact*).
  2. **Mantel Bumi (`mantle`)**:
     - Mengubah latar belakang menjadi samudra magma silikat cair raksasa bersuhu ribuan derajat dengan 3 tingkat gelombang arus konveksi mantel astinosfer yang berombak dinamis, letupan gelembung lahar, dan partikel bara api geotermal.
     - Menghapus bongkahan batuan basal mengambang (`floating basalt crust flakes`) sehingga samudra magma bersih dan bebas dari obstruksi kotak/batuan mengambang.
  3. **Inti Luar (`outerCore`)**:
     - Mengubah gradien fluida logam cair nikel-besi menjadi kuning-oranye berpijar emas terang sepanas 4.000°C–6.000°C.
     - Mengimplementasikan 5 lapisan kurva busur torus medan magnet dipole bumi (*geomagnetic dipole flux loops*) berona cyan elektrik dan emas bercahaya yang melengkung melintasi langit atmosferik inti.
  4. **Inti Dalam (`innerCore`)**:
     - Mengubah profil tanah menjadi datar absolut (`[0, 350], [1280, 350]`) dan warna tanah kuning keemasan besi padat (`#b45309`).
     - Menghapus objek `ic_crystal` dari konfigurasi zona di `zones.ts` dan menghapus render Altar Mahkota serta kerucut obelisk tanah dari `sprites.ts`. Seluruh NPC (Dr. Bagus, Prof. Lestari, Dr. Farhan, Petugas Dian, Komandan Bintang) menapak sejajar dan rapi di atas lantai datar yang bersih.

### 21. Sistem Kostum Adaptif Berdasarkan Lingkungan Zona (*Adaptive Zone-Based Attire & Futuristic Exosuits*)
- **Modul**: [`studentAvatarSheet.ts`](./src/utils/studentAvatarSheet.ts), [`npcSprites.ts`](./src/app/Level1/EarthDive/engine/npcSprites.ts), [`renderer.ts`](./src/app/Level1/EarthDive/engine/renderer.ts), [`VisualNovelDialogue.tsx`](./src/app/Level1/EarthDive/VisualNovelDialogue.tsx), [`EarthDiveGame.tsx`](./src/app/Level1/EarthDive/EarthDiveGame.tsx)
- **Kebutuhan Pengguna**:
  - Pakaian karakter pemain dan seluruh NPC otomatis berubah sesuai kondisi ekstrem lingkungan:
    - **Kerak Bumi (`crust`)**: Pakaian pekerja tambang geologis lengkap dengan topi helm keselamatan kerja berlampu senter (*mining headlamp*).
    - **Mantel Bumi, Inti Luar, dan Inti Dalam (`mantle`, `outerCore`, `innerCore`)**: Pakaian pelindung masa depan canggih tahan suhu panas ekstrem ribuan derajat (*futuristic aero-thermal hazard suit / cryo-exosuit*).
    - **Permukaan Bumi & Batas Lempeng Tektonik (`surface`, `divergent`, `convergent`, `transform`)**: Pakaian default/normal dipertahankan tanpa perubahan karena berada di atas permukaan bumi.
- **Rincian Arsitektur & Rendering**:
  1. **Kostum Penambang Kerak Bumi (*Mining Attire*)**:
     - Rompi keselamatan tambang *high-vis* oranye (`#ea580c`) dengan strip reflektif scotlight neon kuning-putih (`#facc15`, `#ffffff`) dan ritsleting tengah (`#0f172a`).
     - Helm keselamatan kerja proyek kuning cerah (`#eab308` & `#ca8a04`) lengkap dengan lampu senter kepala (*mining headlamp*) LED menyala terang dan sorotan berkas cahaya lembut ke depan.
  2. **Baju Pelindung Masa Depan Tahan Panas (*Futuristic Cryo-Exosuit*)**:
     - Helm termal titanium tertutup (`#f1f5f9`) dengan kaca visor HUD neon cyan (`#0284c7`, `#22d3ee`) dan antena komunikasi sensor suhu.
     - Baju pelindung bertekanan titanium nano-karbon tebal dengan bantalan bahu bertingkat (`#cbd5e1`).
     - Inti pendingin krio (*cryo-cooling power core*) di dada tengah yang berdenyut cahaya biru cyan dinamis (`Math.sin(frame * 0.1)`), jalur sirkulasi pendingin cair (*coolant conduits*), serta sol sepatu penolak panas.
  3. **Integrasi Pipeline Render Dunia & Potret Dialog Visual Novel**:
     - `renderer.ts`: Mengalirkan parameter `zone.id` ke `getPlayerSheet(avatarConfig, zone.id)` dan `drawNpcOnWorld(ctx, nx, ny, ntype, ndir, nwalk, frame, zone.id)`.
     - `npcSprites.ts`: Menambahkan overlay kostum adaptif pada sprite dunia seluruh NPC serta memperbarui generator potret dialog `getNpcPortrait(type, zoneId)` dan potret kustom siswa `getPlayerPortrait(avatarConfig, zoneId)`.
     - `VisualNovelDialogue.tsx`: Menerima properti `zoneId` dan menyalurkannya ke kanvas potret kiri (NPC) dan kanan (Pemain), sehingga saat berbicara di Kerak Bumi atau Mantel/Inti, potret karakter langsung menampilkan helm dan baju pelindung yang serasi.
     - Menambahkan tombol silang `✕ KEMBALI` di header riwayat dialog, tombol `Tutup Riwayat` di footer, serta listener tombol `Escape` untuk menutup riwayat chat dengan instan.

### 22. Standarisasi Suhu Celcius Murni (°C) & Peniadaan Telemetri pada Batas Tektonik (Level 1 Earth Dive)
- **Modul**: [`earthDiveData.ts`](./src/app/Level1/EarthDive/earthDiveData.ts), [`EarthDiveGame.tsx`](./src/app/Level1/EarthDive/EarthDiveGame.tsx), [`TelemetryHUD.tsx`](./src/app/Level1/EarthDive/TelemetryHUD.tsx), [`DiscoveryModal.tsx`](./src/app/Level1/EarthDive/DiscoveryModal.tsx), [`zones.ts`](./src/app/Level1/EarthDive/engine/zones.ts), [`renderer.ts`](./src/app/Level1/EarthDive/engine/renderer.ts), [`dialogueData.ts`](./src/app/Level1/EarthDive/dialogueData.ts), [`sprites.ts`](./src/app/Level1/EarthDive/engine/sprites.ts)
- **Kebutuhan Pengguna**:
  1. Mengubah seluruh representasi suhu di Level 1 ke dalam derajat Celcius (°C) murni di semua area, materi, kuis, dialog, dan HUD; menghapus total seluruh penyebutan Fahrenheit (°F).
  2. Pada area batas-batas lempeng tektonik (Batas Divergen, Batas Konvergen, dan Batas Transform), tidak menampilkan suhu, tekanan, dan kedalaman karena tidak esensial untuk studi tektonika lempeng di permukaan.
- **Rincian Implementasi**:
  1. **Standarisasi Celcius 100% (Zero Fahrenheit)**:
     - Data Strata: Mengubah nilai suhu lapisan di `earthDiveData.ts`:
       - Kerak Bumi: `25°C – 500°C`
       - Astenosfer: `540°C – 1.600°C`
       - Mantel Bumi: `1.000°C – 3.700°C` (sebelumnya `1.000°F – 7.000°F`)
       - Inti Luar: `4.000°C – 5.000°C` (sebelumnya `9.000°F`)
       - Inti Dalam: `5.500°C – 6.000°C (Sepanas Matahari)` (sebelumnya `10.000°F`)
     - Soal Evaluasi & Pilihan Ganda: Menyesuaikan seluruh teks pertanyaan, pilihan jawaban benar/salah, penjelasan saintifik, dan petunjuk (*clue*) ke Celcius.
     - Mini-Game Gerbang Inti Dalam: Kata rahasia Wordle diubah dari `SEPULUHRIBU` (Fahrenheit) menjadi `ENAMRIBU` dengan petunjuk *"Suhu di inti dalam bumi bisa mencapai sekitar ... derajat Celsius (sepanas matahari)"*.
     - Dialog Seluruh NPC: Pemandu Resqy, Dr. Fajar, Dr. Bagus, dan Prof. Lestari kini berbicara dengan satuan derajat Celsius (`5.000°C` di Inti Luar dan `6.000°C` di Inti Dalam).
     - Diagram Ilmiah SVG `DiscoveryModal`: Termometer titik leleh logam nikel (1.455°C) & besi (1.538°C), arus konveksi mantel (540°C–1.600°C), batas D'' (~3.700°C), pusaran geodynamo (5.000°C), lautan logam cair (5.000°C), dan badge suhu ekstrem inti dalam (~6.000°C) seluruhnya bersih dari simbol `°F`.
  2. **Pembersihan Telemetri Batas Tektonik**:
     - `EarthDiveGame.tsx`: Mendeteksi `isBoundaryZone = zone.id === 'divergent' || zone.id === 'convergent' || zone.id === 'transform'`. Saat aktif, menyetel `depth: undefined`, `temp: undefined`, `tempString: undefined`, dan `pressure: undefined`.
     - `TelemetryHUD.tsx`: Secara otomatis hanya merender chip **Kristal**, **Temuan Geologis**, dan **Bar HP**, serta menyembunyikan chip Kedalaman, Tekanan, dan Suhu di ketiga zona batas tektonik.
     - `DiscoveryModal.tsx`: Header modal menyaring properti kosong sehingga hanya menampilkan `{strataName}` untuk batas tektonik tanpa label kedalaman/suhu yang membingungkan.
     - `zones.ts` & `renderer.ts`: Mengosongkan `depthLabel`, `temperature`, dan `pressure` pada zona tektonik serta menyembunyikan tulisan `KEDALAMAN:` pada kartu transisi pergantian lapisan.

### 23. Restrukturisasi Level 2: Penghapusan Batas Tektonik & Reorientasi Menjadi 2 Area Mitigasi Kebencanaan Geologis Murni
- **Modul**: [`level2Data.ts`](./src/app/Level2/level2Data.ts), [`zones.ts`](./src/app/Level2/engine/zones.ts), [`gameEngine.ts`](./src/app/Level2/engine/gameEngine.ts), [`TectonicGame.tsx`](./src/app/Level2/engine/TectonicGame.tsx), [`CrosswordModal.tsx`](./src/app/Level2/CrosswordModal.tsx), [`TectonicVictoryModal.tsx`](./src/app/Level2/TectonicVictoryModal.tsx), [`renderer.ts`](./src/app/Level2/engine/renderer.ts), [`sprites.ts`](./src/app/Level2/engine/sprites.ts), [`level2Sync.ts`](./src/app/Level2/level2Sync.ts), [`index.tsx`](./src/app/Level2/index.tsx)
- **Kebutuhan Pengguna**:
  - Menghapus area batas-batas tektonik (Batas Divergen, Batas Konvergen, dan Batas Transform) **hanya di Level 2**.
  - **Level 1 jangan dihapus/dipertahankan 100% utuh** dengan 8 area geologis lengkapnya.
  - Menjadikan Level 2 berfokus penuh pada **2 Area Mitigasi Kebencanaan Geologis**:
    1. **Area 1 (Index 0)**: `area-mitigasi-gempa` (Mitigasi Gempa Bumi: Ruang Kelas, Kesiapsiagaan 72 Jam, Drop-Cover-Hold On, Jalur Evakuasi, TTS Siaga Gempa, 50 Poin).
    2. **Area 2 (Index 1)**: `area-mitigasi-erupsi` (Mitigasi Erupsi Vulkanik: Lereng Merapi, Status PVMBG, KRB Merapi, Masker Silika & Lahar Hujan, TTS Erupsi Merapi, 100 Poin Tuntas & unlock Level 3).
- **Rincian Implementasi**:
  1. **Data Katalog Level 2 (`level2Data.ts`)**:
     - `LEVEL2_AREAS` dipangkas menjadi 2 entri: `area-mitigasi-gempa` (index 0) dan `area-mitigasi-erupsi` (index 1).
     - Menghapus definisi area divergen, konvergen, dan transform.
  2. **World Zones Builder (`zones.ts`)**:
     - Disederhanakan menjadi 2 builder murni: `buildArea1EarthquakeMitigation` (lantai parket kayu kelas, 3 kristal mitigasi, papan info tas 72 jam, gerbang `l2_gate_gempa`, portal keluar `portal_exit` ke Area 2) dan `buildArea2VolcanoMitigation` (lereng Merapi, 3 kristal mitigasi, tangga kembali `portal_back` ke Area 1, gerbang `l2_gate_erupsi`, kapsul kelulusan Level 2).
     - Total kristal di Level 2 = 6 kristal (3 per area).
  3. **Transisi & Game Engine (`gameEngine.ts`)**:
     - Banner transisi diselaraskan untuk 2 area: Arah Maju `down` ke Area 2 (*"Lereng Gunung Merapi & Pos Pengamatan PVMBG"*), dan Arah Mundur `up` ke Area 1 (*"Ruang Kelas Sekolah & Jalur Evakuasi"*).
     - Menghilangkan cabang transisi Area divergen, konvergen, dan transform.
  4. **Canvas Component & Game State (`TectonicGame.tsx`)**:
     - `totalCrystals` diperbarui dari 15 menjadi 6.
     - Penanganan evaluasi TTS & Tantangan Mini diselaraskan ke 2 tahap misi:
       - Area 0: Skor 50, Mission 1, Lencana `earthquake-responder`.
       - Area 1: Skor 100, Mission 2, Lencana `earthquake-responder` dan `volcano-responder`, memicu pembukaan Level 3 dan menampilkan `TectonicVictoryModal`.
     - Pill indikator badge di HUD atas menampilkan animasi warna tema: Area 0 (sky blue) dan Area 1 (rose red).
  5. **Teka-Teki Silang Mitigasi (`CrosswordModal.tsx`)**:
     - Menghapus bank kata lempeng tektonik (Divergen, Pangea, Subduksi, San Andreas, Sismograf).
     - Area 0: TTS Siaga Gempa (`BERLINDUNG`, `EVAKUASI`, `GEMPA`, `SIAGA`).
     - Area 1: TTS Erupsi Merapi (`PVMBG`, `MERAPI`, `LAHAR`, `AWAS`).
  6. **Modal Kemenangan Akhir (`TectonicVictoryModal.tsx`)**:
     - Menampilkan 2 Master Badges: *Earthquake Responder* dan *Volcano Responder*.
     - Menampilkan indikator `2 ZONA MITIGASI KEBENCANAAN TUNTAS!` dan counter kristal `{collectedCrystals}/6`.
     - Narasi jembatan misi diselaraskan dengan mitigasi gempa dan erupsi vulkanik.
  7. **Multi-Layer Renderer & Organic Terrain (`renderer.ts` & `sprites.ts`)**:
     - Menghapus kode atmosphere lama untuk divergent, convergent, dan transform canyon.
     - Renderer murni fokus pada `drawClassroomAtmosphere` (ruang kelas, papan tulis, lampu neon gantung, meja-kursi siswa) dan `drawVolcanoMitigationAtmosphere` (kubah lava Merapi, awan wedhus gembel, sirine EWS PVMBG, dan hujan abu).
     - `renderOrganicZoneTerrainL2` fokus pada lantai parket kayu ruang kelas dan batuan andesit berlapisan abu Merapi.
  8. **Sinkronisasi Supabase & Dashboard Guru (`level2Sync.ts`)**:
     - Pengecekan ketuntasan `isDone` diperbarui ke `completedMissions.includes(2)` (2 misi).
     - Stage label diperbarui menjadi *"Tuntas (Mitigasi Gempa & Erupsi Merapi - 100 Poin)"* dan *"Zona Mitigasi {mission} ({score} Poin)"*.

### 24. Transformasi Area 1 Level 2: Ruang Kelas SMP (Mitigasi Prabencana Gempa Bumi, Ekosistem NPC Siswa & Guru, Background Statis, Ilustrasi Realistis, dan Evaluasi Teka-Teki Silang)
- **Modul**: [`renderer.ts`](./src/app/Level2/engine/renderer.ts), [`DiscoveryModal.tsx`](./src/app/Level2/DiscoveryModal.tsx), [`dialogueDataL2.ts`](./src/app/Level2/dialogueDataL2.ts), [`npcSpritesL2.ts`](./src/app/Level2/engine/npcSpritesL2.ts), [`npcManagerL2.ts`](./src/app/Level2/engine/npcManagerL2.ts), [`VisualNovelDialogueL2.tsx`](./src/app/Level2/VisualNovelDialogueL2.tsx), [`TectonicGame.tsx`](./src/app/Level2/engine/TectonicGame.tsx), [`gameEngine.ts`](./src/app/Level2/engine/gameEngine.ts), [`zones.ts`](./src/app/Level2/engine/zones.ts), [`studentAvatarSheet.ts`](./src/utils/studentAvatarSheet.ts), [`sprites.ts`](./src/app/Level2/engine/sprites.ts), [`CrosswordModal.tsx`](./src/app/Level2/CrosswordModal.tsx), [`level2Data.ts`](./src/app/Level2/level2Data.ts)
- **Kebutuhan Pengguna**:
  1. **Background Meja Kursi Statis**: Menghilangkan efek paralaks kamera pada meja dan kursi siswa di background agar tetap kokoh di tempatnya saat karakter berjalan.
  2. **Papan Tulis & Mading**:
     - Mengubah judul papan tulis 1 menjadi `IPA: KELAS 8`.
     - Memisahkan letak papan tulis dan mading gabus (*corkboard*) agar tidak saling tumpang tindih.
     - Konten mading diselaraskan ke Bahasa Indonesia resmi dengan 3 pilar utama: `PRABENCANA`, `SAAT GEMPA / BENCANA`, dan `PASCABENCANA`.
     - Papan petunjuk simulasi diposisikan rapi di tengah koridor dengan teks `SIMULASI GEMPA KE KANAN ➔`.
  3. **Ekosistem NPC RPG Visual Novel Bertema Sekolah SMP**:
     - Menggantikan papan catatan, totem temuan, dan gerbang fisik lama dengan sistem NPC hidup bertema sekolah yang menyambung alur cerita dari kepulangan penjelajah dari interior bumi (Level 1).
     - Menghadirkan 7 karakter:
       - `x: 120`: **Robot Resqy** (pemandu penyelamat, briefing kesiapsiagaan sekolah)
       - `x: 280`: **Rian** (siswa kelas 8A, tata ruang kelas, denah, penguncian lemari)
       - `x: 520`: **Bu Rahma, M.Pd.** (guru IPA, modul Temuan 1: Tas Siaga Bencana 72 Jam)
       - `x: 950`: **Dito PMR** (ketua regu PMR, simulasi drill & kesiapan mental)
       - `x: 1450`: **Pak Surya** (instruktur BNPB, modul Temuan 2: Aksi Drop-Cover-Hold On)
       - `x: 1820`: **Siti** (ketua OSIS, jalur evakuasi hijau & Titik Kumpul)
       - `x: 1980`: **Kak Fajar** (koordinator relawan, penguji gerbang evaluasi Teka-Teki Silang)
  4. **Kostum & Visual Bertema Sekolah SMP**:
     - Seluruh siswa (NPC Rian, Dito, Siti, Kak Fajar, dan karakter pemain) mengenakan seragam resmi SMP (kemeja putih berkerah, dasi biru tua, celana/rok biru tua SMP, sepatu hitam).
     - Guru berseragam dinas pendidik, dan instruktur lapangan mengenakan rompi oranye BNPB.
  5. **Ilustrasi Realistis Temuan 2 (Aksi Keselamatan Gempa Bumi)**:
     - Merombak total `EarthquakeActionIllustration` pada `DiscoveryModal.tsx` menjadi anatomi figur manusia proporsional dan realistis (siswa SMP berseragam putih-biru pada 4 tahapan: Merunduk/Drop, Berlindung/Cover di bawah meja kokoh, Bertahan/Hold On memegang kaki meja, dan Evakuasi Tertib memakai ransel di kepala).
     - 100% menggunakan Bahasa Indonesia resmi (tanpa istilah bahasa Inggris).
  6. **Evaluasi Akhir Area Tetap Teka-Teki Silang (TTS)**:
     - Mengukuhkan bahwa evaluasi akhir Level 2 tetap menggunakan **Teka-Teki Silang (TTS)** (Level 1 = Wordle, Level 2 = TTS).
     - Soal TTS Area 1 ramah anak SMP kelas 8 (`BERLINDUNG`, `EVAKUASI`, `GEMPA`, `SIAGA`) dari materi yang diajarkan, tanpa bocoran jawaban di percakapan NPC.
- **Rincian Implementasi**:
  1. **Background Statis & Papan Tulis (`renderer.ts`)**:
     - Mengubah meja kursi dari `const paraDesk = camX * 0.55;` menjadi koordinat dunia statis mutlak `deskWorldPositions = [80, 360, 660, 960, 1260, 1560, 1860]`.
     - Papan tulis 1 diubah menjadi `IPA: KELAS 8` di `x: 100` (lebar 250px).
     - Corkboard dipisahkan ke `x: 920` (sampai 1070) dengan 3 poster: `PRABENCANA`, `SAAT GEMPA`, `PASCABENCANA`.
     - Papan petunjuk di `x: 1100` (sampai 1320) memuat teks `SIMULASI GEMPA KE KANAN ➔`.
  2. **Generator Sprite NPC & Avatar Siswa (`npcSpritesL2.ts` & `studentAvatarSheet.ts`)**:
     - Mode seragam SMP aktif pada `isClassroom` / `area-mitigasi-gempa`: kemeja putih, dasi biru tua, celana/rok biru tua SMP, sepatu hitam.
     - Generator potret 120x120 transparan murni untuk Resqy, Rian, Bu Rahma, Dito, Pak Surya, Siti, Kak Fajar, dan Siswa Penjelajah.
  3. **Manajer NPC & AI Patroli (`npcManagerL2.ts`)**:
     - Membangun patroli santai AI di sekitar `anchorX` masing-masing NPC dengan perputaran arah hadap otomatis saat pemain mendekat dalam radius 50px.
  4. **Sistem Dialog Visual Novel RPG (`VisualNovelDialogueL2.tsx` & `dialogueDataL2.ts`)**:
     - Membawa nuansa RPG bertema sekolah dengan potret NPC di kiri dan potret siswa di kanan (transparan 100%), micro-bounce saat berbicara, animasi typewriter, dan log riwayat dialog.
     - Terhubung dengan aksi: membuka Discovery Modal modul Temuan 1 & 2, menandai pemahaman materi, serta meluncurkan Teka-Teki Silang evaluasi bersama Kak Fajar.
  5. **Integrasi UI & HUD (`TectonicGame.tsx`)**:
     - Menghubungkan widget bantuan Robot Resqy di HUD atas, sinkronisasi pohon dialog dari engine, dan validasi penyelesaian baca materi sebelum izin evaluasi TTS diberikan.
  6. **Penyelarasan Soal & Evaluasi (`CrosswordModal.tsx` & `level2Data.ts`)**:
     - Petunjuk clue diselaraskan ke Bahasa Indonesia resmi tanpa campuran istilah asing.

### 25. Transformasi Area 2 Level 2: Simulasi Tanggap Gempa Ruang Kelas (Drill Drop-Cover-Hold On, Cutscene Gempa 10s, Animasi Batu Runtuh, 16 Murid Kelas Konsisten, dan Standarisasi Rambu Resmi Jalur Evakuasi K3/BNPB)
- **Modul**: [`renderer.ts`](./src/app/Level2/engine/renderer.ts), [`gameEngine.ts`](./src/app/Level2/engine/gameEngine.ts), [`npcManagerL2.ts`](./src/app/Level2/engine/npcManagerL2.ts), [`zones.ts`](./src/app/Level2/engine/zones.ts), [`dialogueDataL2.ts`](./src/app/Level2/dialogueDataL2.ts), [`TectonicGame.tsx`](./src/app/Level2/engine/TectonicGame.tsx), [`level2Data.ts`](./src/app/Level2/level2Data.ts)
- **Kebutuhan Pengguna & Arahan Revisi**:
  1. **Proporsi Meja & Kolong Meja**: Meja belajar ditinggikan dan dirapatkan sehingga karakter siswa muat merunduk di kolong meja dengan natural.
  2. **Partisipasi Guru (Bu Rahma)**: Guru Bu Rahma harus ikut berlindung di kolong meja guru saat gempa berlangsung, tidak berdiri mematung.
  3. **Penyempurnaan Alur Gempa & QTE**:
     - Dimulai saat penjelasan Bu Rahma di depan kelas selesai dibaca.
     - Sirine alarm gempa berbunyi, layar bergetar awal, dan Bu Rahma memberikan dialog instruksi peringatan darurat sebelum QTE dimulai (tidak langsung mendadak QTE).
     - QTE 10 detik untuk merunduk ke kolong meja (tekan `E`/`Enter` atau tap tombol).
     - Jika telat melakukan QTE, tidak boleh otomatis masuk ke bawah meja; karakter tetap di kursi, terjadi animasi dramatis batu beton besar runtuh dari plafon menimpa kepala pemain disertai efek suara sakit (*hurt*), pecahan batu hancur berkeping-keping, dan bintang pusing berputar `★ ★ ★`. Lalu muncul kartu evaluasi kegagalan untuk mengulang dari awal.
  4. **Durasi & Intensitas Gempa Realistis**: Gempa berlangsung selama 10 detik (600 frame) dengan getaran tremor realistis halus (2.0–3.0px) tanpa guncangan ekstrem yang memusingkan, disertai suara alarm berulang dan puing-puing plafon berjatuhan.
  5. **Tas Ransel di Kepala**: Karakter siswa pemain dan seluruh murid di kelas berlindung di bawah meja sambil memegang ransel/tas sekolah di atas kepala mereka untuk melindungi tengkuk dan kepala dari serpihan atap.
  6. **Seruan Panik Murid Ringkas & Bebas Emoji**: Balon kata teriakan murid dibuat berukuran kecil, tidak berjejal, bervariasi dari meja ke meja, dan bersih 100% dari emotikon OS/AI.
  7. **Penghapusan Telemetri & Temuan Geologis**: Area 2 dikhususkan murni untuk drill simulasi ruang kelas; telemetri teknis dan temuan geologis dihapus total dari Area 2.
  8. **Ekosistem 16 Murid Kelas Konsisten 100%**:
     - Mengisi seluruh 16 meja belajar kelas dengan murid: Rian, Dito, Siti, Budi, Fani, Edo, Maya, Reza, Dewi, Bayu, Tari, Doni, Lina, Agus, Putri, dan Gilang.
     - Menjamin jumlah murid identik dan konsisten 100% antara saat mengajar di meja, berlindung di kolong meja, hingga berbaris tertib di koridor evakuasi menuju pintu keluar lapangan.
  9. **Perbesaran Kartu Overlay Popup**:
     - Memperbesar dimensi kartu overlay: QTE diperlebar ke `720x118` dengan font 12.5px & bar waktu 16px; Timer gempa diperbesar ke `680x80` dengan font 14px/9.5px, pulsing beacon kedip, dan progress bar timer elegan; Aba-aba evakuasi diperbesar ke `680x78` dengan badge `[AMAN]`.
  10. **Pembenahan Poster Dinding Kelas**:
      - **Poster SOP Gempa (`x: 260`)**: Frame kayu diperlebar dari 70px menjadi 104px (`p1W = 104px`) sehingga butir *1. MERUNDUK*, *2. BERLINDUNG*, *3. BERTAHAN*, dan *DI BAWAH MEJA* tertata rapi di dalam poster dengan margin kanan 24px tanpa menembus frame.
      - **Rambu Resmi JALUR EVAKUASI (`x: 1620`)**: Mengganti poster Titik Kumpul (yang sebelumnya hanya kotak hijau polos) menjadi Rambu Resmi **JALUR EVAKUASI** standar keselamatan K3/BNPB sesuai gambar ketiga: latar hijau keselamatan (`#007a3d`), garis tepi putih ganda, panel atas pintu darurat putih dengan siluet orang berlari hijau keluar pintu, garis pembatas putih horizontal, teks bold `JALUR EVAKUASI`, dan panah tebal putih menunjuk ke kanan menuju pintu evakuasi lapangan.

- **Rincian Implementasi Teknis**:
  1. **Konstanta & NPC Model 16 Murid Kelas (`npcManagerL2.ts`)**:
     - Menghadirkan array konstan `CLASSROOM_STUDENTS_L2` berisi konfigurasi lengkap 16 murid kelas:
       ```typescript
       export interface SimStudentConfigL2 {
         id: string;
         name: string;
         type: NpcWorldTypeL2;
         deskX: number;
         sitX: number;
         coverX: number;
       }
       ```
     - Mendaftarkan seluruh 16 murid ke dalam map NPC Area 2 (`createInitialNpcsL2(1)`).
  2. **Engine Simulasi Gempa (`gameEngine.ts`)**:
     - `startSimulationArea2`: Memposisikan Bu Rahma di depan kelas (`x: 200`), pemain di meja 460 (`x: 498`), dan seluruh 16 murid duduk tertib di kursinya masing-masing (`sitX`).
     - Transisi Fase `teaching` ➔ `quake_alert`: Memutar audio alarm & gempa, serta memicu dialog peringatan darurat Bu Rahma (`bu_rahma_quake_alert`).
     - Transisi Fase `quake_alert` ➔ `qte_cover`: Memulai QTE 10 detik (`qteTimer = 600`) dan memunculkan seruan panik murid dari deretan meja depan, tengah, dan belakang.
     - Cutscene Kegagalan `failed_impact`: Jika QTE habis, `fallingRock` diluncurkan dari plafon (`x: 498, y: 0`) dengan kecepatan jatuh realistis menimpa kepala pemain. Saat tabrakan terjadi, memutar `retroAudio.playHurt()`, memecahkan batu menjadi 8 serpihan terbang, memunculkan bintang pusing berputar `★ ★ ★`, dan menampilkan kartu dialog evaluasi kegagalan untuk mengulang simulasi.
     - Transisi Fase `quake_holding` ➔ `quake_stopped`: Durasi gempa 10 detik (`quakeTimer = 600`), getaran tremor halus (2.0–3.0px), Bu Rahma ikut berlindung di bawah meja guru (`x: 180`), dan seluruh 16 murid memegang ransel di atas kepala. Begitu gempa reda, Bu Rahma memberikan aba-aba evakuasi via dialog percakapan (`bu_rahma_evac_order`).
     - Transisi Fase `evacuating`: Seluruh 16 murid dan Bu Rahma berbaris tertib di koridor kelas (`x: 550` Bu Rahma, `x: 524` Rian, `x: 502` Dito, `x: 482` Pemain di tengah rombongan, dan murid lainnya berbaris rapat di belakang pemain) dan bersama-sama berjalan menuju pintu evakuasi lapangan (`x: 2130`).
  3. **Multi-Layer Canvas Rendering (`renderer.ts`)**:
     - Loop render `CLASSROOM_STUDENTS_L2` diimplementasikan secara terpadu di semua fase: duduk saat mengajar (`drawStudentSittingInDesk`), merunduk dengan tas di kepala saat gempa (`drawStudentCoverUnderDesk`), dan berbaris memegang tas saat evakuasi (`drawStudentEvacuatingPose`).
     - Overhaul `drawSimulationQuakeTimerOverlay` (lebar 680px, tinggi 80px, font 14px & 9.5px, pulsing beacon, progress bar 7px).
     - Overhaul `drawSimulationQteOverlay` (lebar 720px, tinggi 118px, font 12.5px, bar 16px, tombol panduan 10px).
     - Overhaul `drawSimulationEvacuationPrompt` (lebar 680px, tinggi 78px, badge `[AMAN]`).
     - Poster 1 (SOP Gempa di `x: 260`): Lebar diperpanjang ke `104px`, teks *1. MERUNDUK, 2. BERLINDUNG, 3. BERTAHAN, DI BAWAH MEJA* tertata rapi dengan margin kanan lega.
     - Poster 3 (Rambu Jalur Evakuasi di `x: 1620`): Dirender dengan latar hijau keselamatan (`#007a3d`), garis tepi putih ganda, pintu putih terbuka dengan sosok berlari hijau, garis pemisah putih, teks `JALUR EVAKUASI`, dan panah kanan putih tebal.
     - Pembaruan status pintu keluar evakuasi lapangan di `x: 2130` agar mengenali status kelulusan `l2_gate_gempa_sim`.
  4. **Pembersihan Temuan Geologis (`zones.ts` & `level2Data.ts`)**:
     - Menghapus objek temuan geologis (`l2_s_disc_1` dan `l2_s_disc_2`) dari daftar objek Area 2.
     - Mengosongkan katalog `discoveries: []` untuk `area-simulasi-gempa`.

### 26. Transformasi Area 3 Level 2: Lapangan Terbuka Evakuasi Pascabencana (Ekosistem 5 NPC, Rambu Resmi Titik Kumpul Standar BNPB, Ambulans Medis Menapak Tanah, Rumput Lapangan Statis Anti-Jitter, Briefing Otomatis Maskot Resqy, dan Evaluasi TTS Komandan Satria)
- **Modul**: [`renderer.ts`](./src/app/Level2/engine/renderer.ts), [`gameEngine.ts`](./src/app/Level2/engine/gameEngine.ts), [`TectonicGame.tsx`](./src/app/Level2/engine/TectonicGame.tsx), [`dialogueDataL2.ts`](./src/app/Level2/dialogueDataL2.ts), [`npcManagerL2.ts`](./src/app/Level2/engine/npcManagerL2.ts), [`DiscoveryModal.tsx`](./src/app/Level2/DiscoveryModal.tsx), [`VisualNovelDialogueL2.tsx`](./src/app/Level2/VisualNovelDialogueL2.tsx), [`zones.ts`](./src/app/Level2/engine/zones.ts), [`level2Data.ts`](./src/app/Level2/level2Data.ts)
- **Kebutuhan Pengguna & Arahan Revisi**:
  1. **Akses Pintu Balik Area 2 ke Area 1**: Pemain tidak bisa kembali ke Area 1 saat menekan tombol `E` di pintu paling kiri koridor evakuasi Area 2 (`portal_back`).
  2. **Perbesaran Popup Nama Area Level 2**: Banner popup nama area yang muncul saat memasuki area baru di Level 2 ukurannya kekecilan dibandingkan Level 1.
  3. **Konsep & Transformasi Area 3 (Lapangan Sekolah Pascabencana)**:
     - Catatan geologis digantikan oleh NPC siswa/warga sekolah.
     - Temuan geologis digantikan oleh NPC ahli/guru yang memaparkan materi pascabencana lewat visual novel konfirmatori.
     - Tantangan gerbang keluar digantikan oleh NPC Komandan Satria yang menanyakan kesiapan murid dan menguji pemahaman materi lewat Teka-Teki Silang (TTS).
     - Seluruh alur cerita, tutorial Resqy, percakapan NPC, dan tantangan TTS saling tersambung secara utuh.
     - Soal TTS disederhanakan agar ramah anak SMP kelas 8 dan murni diambil dari materi yang diajarkan, tanpa bocoran jawaban di dialog NPC.
  4. **Pembersihan & Penyempurnaan Visual / Mekanika Area 3**:
     - **Pintu Ganda Bertumpukan**: Di awal area (`x: 40`), pintu kelas 8A dan pintu keluar evakuasi saling bertumpukan. Dihapus duplikasinya menjadi satu pintu tunggal bersih `drawAssemblyFieldBackDoor`.
     - **Briefing Otomatis Resqy**: Maskot Resqy langsung menyapa pemain secara otomatis via dialog percakapan visual novel begitu pemain memasuki area 3 (`resqy_briefing_area3`), tanpa harus dipencet manual.
     - **Standarisasi Zero-Emoji UI**: Menghapus seluruh emotikon OS modern dan karakter AI pada dialog dan UI (`[RIWAYAT PERCAKAPAN]`, `[X] KEMBALI`, `->`, `[ON] Auto`, `[OFF] Auto`).
     - **Garis Polisi Melayang**: Menghapus garis pita barikade kuning-hitam yang melayang janggal di atas kepala murid di latar belakang.
     - **Rambu Resmi TITIK KUMPUL (Standar BNPB)**: Merombak total gambar papan titik kumpul di `x: 620` sesuai Gambar 3: latar hijau tua keselamatan (`#14532d`), garis bingkai ganda putih inset, 4 panah diagonal putih mengarah ke pusat kotak, 4 figur siluet orang putih di tengah, dan teks tebal putih `TITIK` dan `KUMPUL`.
     - **Ambulans Medis Menapak Tanah & Kaca Rapi**: Menggeser ambulans ke kiri agar tidak terpotong pintu, menurunkan posisi ambulans hingga menapak pas di permukaan tanah pada `y: 360` (`ambY = 281`), menambahkan bayangan kontak roda, menyelaraskan kaca jendela kabin agar tidak melayang di atas kap mesin, serta merapikan kemiringan kaca depan dan sirene merah-biru di tengah atap.
     - **Rumput Lapangan Statis Anti-Jitter**: Mengganti lantai paving dengan rumput hijau segar menggunakan penempatan grid koordinat dunia statis mutlak (`stepX = 28`). Rumput lapangan tidak lagi bergeser atau berubah-ubah (zero jitter) saat pemain melangkah. Menghapus teks di lantai (`TITIK KUMPUL KELAS 8` dan `ZONA MEDIS P3K`) agar lapangan terlihat luas dan asri.
     - **Perbaikan Discovery Counter Telemetri HUD**: Memperbaiki pencatatan status temuan `disc-post-safety` dan `disc-post-coordination` di `TectonicGame.tsx` dan `gameEngine.ts` sehingga counter temuan sains di header HUD bertambah secara real-time saat modul materi dibaca.
     - **Perapian Ilustrasi Discovery Modal**: Pada Tab 1 (Titik Kumpul), menghapus teks `ZONA KELAS 8` dan kotak putus-putus, menambahkan siluet murid berbaris rapi. Pada Tab 4 (Zona Medis), kaca kabin ambulans diselaraskan agar tidak menembus/melayang di atas kap mesin.
     - **Gating Komandan Satria**: Komandan Satria secara ketat memblokir akses evaluasi TTS hingga kedua materi pascabencana selesai dibaca murid.

- **Rincian Implementasi Teknis**:
  1. **Resolusi Pintu Kembali & Perbesaran Popup Area (`gameEngine.ts` & `TectonicGame.tsx`)**:
     - Memperbaiki transisi mundur pada Area 2: saat pemain menekan `E` di `portal_back` (`x: 60`), sistem mengeksekusi `changeZoneL2(0, 'left')` sehingga pemain kembali ke Area 1 dengan orientasi hadap yang benar.
     - Memperbesar dimensi kartu popup nama area di `TectonicGame.tsx` menggunakan gaya yang konsisten dengan Level 1: font `text-sm sm:text-base md:text-lg`, padding `py-3 px-6 sm:px-8`, bingkai kayu pixel 3D, bayangan drop shadow tebal, dan animasi fade-in/fade-out yang elegan.
  2. **Engine Dialog Otomatis Resqy (`TectonicGame.tsx` & `gameEngine.ts`)**:
     - Pada `TectonicGame.tsx`, menambahkan efek pemantauan zona: saat pemain memasuki Area 3 (`zoneIndex === 2`), jika pohon dialog briefing awal `resqy_briefing_area3` belum pernah diputar pada sesi tersebut, sistem langsung mengaktifkan dialog:
       ```typescript
       if (currentZoneIndex === 2 && !state.activeDialogueTree) {
         engine.startDialogueById('resqy_briefing_area3');
       }
       ```
     - Memastikan pemain langsung disambut briefing taktis pascabencana dari Maskot Resqy tanpa memerlukan interaksi klik manual.
  3. **Multi-Layer Rendering Lapangan Terbuka (`renderer.ts`)**:
     - **Pintu Belakang Tunggal**: Mengganti fungsi `drawAssemblyFieldAtmosphere` yang sebelumnya menggambar dua pintu tumpang tindih dengan fungsi tunggal `drawAssemblyFieldBackDoor(ctx, camX)` yang bersih di `x = 40`.
     - **Rumput Statis Anti-Jitter**: Mengganti `drawAssemblyFieldPavingFloor` dengan `drawAssemblyFieldGrassFloor`. Algoritma menggunakan koordinat dunia absolut `worldX = Math.floor((camX - 30) / stepX) * stepX + i * stepX` dengan modulus hashing matematis `((worldX * 13) % 7)` sehingga bilah rumput dan bunga liar tetap di posisi tetapnya di dunia tanpa terpengaruh pergerakan kamera atau langkah kaki pemain. Menghapus teks lantai yang mengotori estetika lapangan.
     - **Ambulans Menapak Tanah**: Menetapkan `ambY = 281` dan roda menapak tepat di `y = 360` (`ambY + 79 = 360`). Menambahkan bayangan kontak hitam di bawah roda (`#1e293b`), membenahi kaca jendela kabin agar berawal di `ambX + 32` (belakang pilar A), kaca samping penumpang proporsional, dan sirene merah-biru di atap tengah.
     - **Rambu Resmi TITIK KUMPUL**: Dirender di `x: 620` dengan plat hijau tua `#14532d`, double inset white border, 4 panah diagonal putih mengarah ke titik pusat, 4 siluet figur manusia putih di tengah, dan teks `TITIK` dan `KUMPUL` tebal di bagian bawah.
     - **Eliminasi Police Tape Melayang**: Menghapus loop pita barikade kuning-hitam yang melayang di langit-langit lapangan.
  4. **Ekosistem 5 NPC Lapangan & Pohon Percakapan (`dialogueDataL2.ts` & `npcManagerL2.ts`)**:
     - Mendaftarkan 5 NPC lapangan di Area 3:
       1. **Rian** (`px: 160`): Siswa SMP yang mengarahkan pemain ke pos titik kumpul dan mengingatkan pentingnya absensi kelas pascabencana.
       2. **Bu Rahma** (`px: 360`): Guru penanggung jawab evakuasi yang memaparkan materi Temuan 1 (Protokol Keselamatan di Titik Kumpul & Pendataan Siswa).
       3. **Budi** (`px: 560`): Siswa SMP di samping ambulans yang membagikan informasi pos pertolongan pertama (P3K).
       4. **Maya** (`px: 760`): Petugas medis PMR yang memaparkan materi Temuan 2 (Koordinasi Medis, Triase, & Penanganan Pasien Darurat).
       5. **Komandan Satria** (`px: 1040`): Koordinator BNPB penanggung jawab gerbang keluar dan evaluasi Teka-Teki Silang (TTS).
     - Menghubungkan dialog Bu Rahma dan Maya ke pembukaan Discovery Modal dan pencatatan state `hasReadPostSafety` dan `hasReadPostCoordination`.
  5. **Discovery Modal & Ilustrasi Pascabencana (`DiscoveryModal.tsx`)**:
     - Memperbaiki Tab 1 (Titik Kumpul): menghapus teks `ZONA KELAS 8` dan outline putus-putus, menambahkan barisan siluet siswa berseragam rapi di lapangan terbuka jauh dari gedung tinggi.
     - Memperbaiki Tab 4 (Zona Medis): kaca jendela kabin ambulans diselaraskan rapi di atas kap mesin tanpa sisa artefak melayang.
  6. **Telemetry Discovery Counter & Gating TTS Komandan Satria (`TectonicGame.tsx` & `gameEngine.ts`)**:
     - Menyelaraskan ID penandaan temuan ke array `['disc-post-safety', 'disc-post-coordination']` di Area 3.
     - Menghitung counter temuan secara presisi: `readInArea = [safetyRead, coordRead].filter(Boolean).length`, sehingga HUD menampilkan `1/2` saat 1 materi dibaca dan `2/2` saat keduanya selesai.
     - Menambahkan proteksi pada interaksi Komandan Satria: jika temuan belum lengkap (`readInArea < 2`), dialog mengingatkan murid untuk menemui Bu Rahma dan Maya terlebih dahulu. Begitu kedua materi tuntas, dialog mengizinkan murid membuka Teka-Teki Silang (TTS).
  7. **Teka-Teki Silang (TTS) Ramah Anak SMP Kelas 8 (`CrosswordModal.tsx` & `level2Data.ts`)**:
     - Kata kunci diselaraskan 100% dari materi pembelajaran di lapangan:
       1. `TITIKKUMPUL` (11 Huruf): Area terbuka yang aman dari reruntuhan gedung pascagempa.
       2. `AMBULANS` (8 Huruf): Kendaraan medis darurat untuk membawa korban luka ke rumah sakit.
       3. `P3K` (3 Huruf): Pertolongan pertama pada kecelakaan untuk mengobati luka ringan.
       4. `AMAN` (4 Huruf): Kondisi bebas dari bahaya gempa susulan di lapangan terbuka.
     - Menyelesaikan TTS memberikan skor 100 poin penuh, membuka Kapsul Evakuasi Akhir, dan memicu modal selebrasi kemenangan Level 2.

---

> **Catatan Tim**: Seluruh riwayat dan perubahan ini telah disinkronkan ke dalam berkas dokumentasi utama ([`README.md`](./README.md), [`PRD.md`](./PRD.md), [`design.md`](./design.md), [`walkthrough.md`](./walkthrough.md), dan [`progress_report.md`](./progress_report.md)).
