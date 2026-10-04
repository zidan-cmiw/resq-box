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
| 122 | **Standarisasi Menyeluruh UI, Kontrol Sentuh D-Pad Analog, Kotak Percakapan Visual Novel, dan Kotak Materi Level 2 Selaras Level 1**: Menghapus pembatas `sm:hidden` yang mengharuskan zoom-in 250% dan menggantinya dengan logika responsif Level 1 (`isTouchDevice || innerWidth <= 1024`); menyelaraskan D-Pad 4-arah kiri (▲, ◀, dot, ▶, ▼) dan tombol aksi kanan (`LONCAT` & `[E] AKSI`) dengan input `jump` & `up` di `player.ts`; panduan keyboard desktop bawah dan prompt proksimitas `nearInteractablePrompt`; kotak menu HUD atas `< MENU`, sound, fullscreen, dan badge zona aktif; kotak dialog Visual Novel (`VisualNovelDialogueL2.tsx`) dengan potret transparan, tombol riwayat `📜` & `✕ KEMBALI`, dan indikator `[Klik / SPASI untuk Lanjut ▶]`; kotak materi `DiscoveryModal.tsx` berdimensi `max-w-4xl` dengan ilustrasi `h-[380px]..h-[500px]` dan grid 2 kolom; serta eliminasi duplikasi Resqy di tanah dan perbaikan overlapping `[E] [E] BICARA` di `npcManagerL2.ts`. | `src/app/Level2/engine/TectonicGame.tsx`, `src/app/Level2/engine/player.ts`, `src/app/Level2/engine/renderer.ts`, `src/app/Level2/engine/npcManagerL2.ts`, `src/app/Level2/dialogueDataL2.ts`, `src/app/Level2/VisualNovelDialogueL2.tsx`, `src/app/Level2/DiscoveryModal.tsx` |
| 123 | **Penyeragaman Tombol Replay Simulasi di Top Navbar & Realisme Suasana Pasca-Bencana Ruang Kelas Area 2**: Menyatukan tata letak dan desain tombol `[↺ ULANG SIMULASI]` di bilah atas kiri (navbar) secara konsisten di Area 2 dan Area 5 (`bg-rose-950`, border rose, teks pixel `↺ ULANG SIMULASI`) dan menghapus tombol cokelat tengah HUD; membangun suasana porak-poranda ruang kelas pasca-gempa di Area 2 (14 cabang retakan seismik dinding besar, plafon gipsum ambrol dan kawat melintir, lampu padam miring kabel putus, jendela kaca retak laba-laba, papan tulis miring dengan kapur & penghapus berserakan di lantai, meja guru miring dan laci terbuka, meja murid bergeser miring, kursi murid rebah terbalik di lantai, buku paket & lembar ujian tercecer, serta lantai keramik retak kusam berdebu); serta mengosongkan total NPC murid dan Bu Rahma yang telah dievakuasi ke Area 3, yang akan dipulihkan utuh kembali saat simulasi diulang. | `src/app/Level2/engine/TectonicGame.tsx`, `src/app/Level2/engine/renderer.ts`, `src/app/Level2/engine/gameEngine.ts` |
| 124 | **Tuning Parameter Getaran Gempa Sedang & Besar, serta Reduksi Puing Reruntuhan**: Menyediakan konfigurasi terpusat `EARTHQUAKE_TUNING` di `gameEngine.ts` agar intensitas getaran gempa sedang dan gempa besar dapat diatur mandiri; memperkecil guncangan gempa besar agar nyaman dipandang; mengurangi jumlah puing/material plafon jatuh menjadi ~8-10 objek dengan jeda jatuhnya material `debrisInterval: 60`. | `src/app/Level2/engine/gameEngine.ts` |
| 125 | **Refinement Area 3 & Area 4 Level 2: Proporsi Pintu, Redesain Gerbang Lapangan, Rambu Merapi Bebas Overflow & Font Modern**: Memperkecil pintu awal Area 3 agar tidak menutupi jendela belakang; mengganti pintu keluar Area 3 menjadi gerbang lapangan sederhana (tiang besi & papan kayu) dengan papan nama 76px dan font `"Plus Jakarta Sans", sans-serif` agar teks `POS MERAPI` muat tanpa overflow; memperlebar gerbang masuk Area 4 menjadi 132px; memperlebar Papan 4 Status Merapi (PVMBG) menjadi 182x94px dengan padding nyaman; memperbesar banner Pos PGA & Posko Destana; serta meringkas materi dan memperbesar ukuran font modal temuan sains Area 3 & 4. | `src/app/Level2/engine/renderer.ts`, `src/app/Level2/DiscoveryModal.tsx`, `src/app/Level2/level2Data.ts` |
| 126 | **Overhaul Simulasi Gempa Area 2, Pacing Tremor 1 Detik, Materi IPA Struktur Bumi, & Retakan Dinding Atas Halus Area 2 & Area 3**: Mengubah topik materi Bu Rahma dari matematika (Pythagoras) ke kurikulum resmi **IPA SMP Kelas 8: Struktur Lapisan Bumi** (kerak, mantel, inti bumi, lempeng tektonik) pada dialog dan papan tulis kelas; mengubah urutan simulasi agar diawali getaran gempa terlebih dahulu selama 1 detik (`quake_start`, 60 frame) sebelum Bu Rahma berteriak *"Ada gempa!"*; memperkecil retakan dinding gempa besar di Area 2 menjadi retakan rambut halus (`1.2px`) yang hanya berada di bagian atas dinding/balok plafon ($y \le 50\text{px}$); memperkecil retakan fasad gedung sekolah di Area 3 hanya pada dinding bagian atas dekat atap ($y = 114..150\text{px}$); serta menyelaraskan nama resmi Area 3 menjadi `Lapangan Evakuasi Sekolah (Pasca Gempa Besar)`. | `src/app/Level2/dialogueDataL2.ts`, `src/app/Level2/engine/gameEngine.ts`, `src/app/Level2/engine/renderer.ts`, `src/app/Level2/level2Data.ts` |
| 127 | **Overhaul Lingkungan Lautan Penuh, Elevasi Lempeng, Lapisan Mantel Magma, & Sekuens Dinamis (Ikan Panik & Tumbuhan Layu) di Batas Divergen (Level 1 Area 6)**: Merombak total latar belakang Batas Divergen dari daratan/senja menjadi lingkungan lautan penuh (*full ocean*) dengan gradasi biru muda ke abisal gelap, gelombang permukaan berbusa, dan kolom gelembung; menaikkan elevasi lempeng dasar laut ke $Y = 248$ sesuai garis merah atas referensi; menambahkan lapisan astenosfer mantel dengan magma berpendar di bawah $Y = 408$; memperdalam dasar celah patahan ke $Y = 470$ dan mengatur magma naik mengisi ~1/3 celah ($Y = 396$) sebelum membeku menjadi kerak pillow basalt baru; menyusun sekuens dinamis terpadu (Fase Tenang dengan ikan berenang damai & tumbuhan hijau segar ➔ Guncangan Gempa seismik kuat disertai audio rumble ➔ Peningkatan Suhu drastis yang memicu ikan kabur panik menjauh ke kiri/kanan dan tanaman laut layu mengkerut dengan uap panas ➔ Pemekaran lempeng divergen membelah ➔ Magma membeku); serta mengintegrasikan pemutaran ulang simulasi via tombol "ULANG ANIMASI". | `src/app/Level1/EarthDive/engine/zones.ts`, `src/app/Level1/EarthDive/engine/sprites.ts`, `src/app/Level1/EarthDive/engine/renderer.ts`, `src/app/Level1/EarthDive/engine/gameEngine.ts`, `src/utils/retroAudio.ts` |
| 129 | **Mode Renang 4 Arah Bawah Laut, NPC Mengambang di Air Laut, Percepatan Pembekuan Magma ~5 Detik, Penebalan Lempeng & Penipisan Mantel Magma (Batas Divergen)**: Mengubah fisika pergerakan menjadi renang 4 arah bebas fluida (W/S/A/D, Spasi, D-Pad) dengan idle bobbing dan animasi flutter kicks; mengatur 4 NPC melayang mengambang di air $\approx 42\text{px}$ di atas lempeng dasar laut; mempercepat siklus pembekuan magma dari 14 detik menjadi 5 detik (300 frame); menebalkan lempeng samudra ke bawah dari $Y = 248$ ke $Y = 428$ ($\approx 180\text{px}$ tebal) dan menipiskan mantel magma ke dasar kanvas ($Y = 428..480$, tebal $\approx 52\text{px}$); serta menyelaraskan bilah kontrol sentuh & keyboard. | `src/app/Level1/EarthDive/engine/player.ts`, `src/app/Level1/EarthDive/engine/npcManager.ts`, `src/app/Level1/EarthDive/engine/zones.ts`, `src/app/Level1/EarthDive/engine/sprites.ts`, `src/app/Level1/EarthDive/engine/gameEngine.ts`, `src/app/Level1/EarthDive/EarthDiveGame.tsx` |
| 130 | **Elevasi Pengisian Magma Sebatas Garis Merah ($Y = 372$) & Kontur Tekstur Lereng Miring Rekahan Sampai ke Bawah Tanpa Garis Vertikal (Batas Divergen)**: Membatasi kenaikan magma dan pembekuan kerak basal baru tepat di elevasi garis merah referensi pengguna ($floorY = 372$, bukan memenuhi ke $Y = 326$); memperlebar lereng patahan barat dan timur (`slopeW = 38`); meneruskan kontur lereng miring alami dengan undakan batuan tektonik (`stepLedge`) secara penuh dari bibir lempeng ($Y \approx 254$) tembus sampai ke permukaan magma di $Y = 372$; memberikan sudut kemiringan tektonik alami pada dinding lempeng di bawah permukaan magma menuju dasar mantel ($Y \approx 428$, `subSlope = 8px`); serta merender tekstur strata batuan miring penuh sepanjang dinding tebing patahan sehingga mengeliminasi seluruh dinding vertikal 90° ("garis kebawah doang"). | `src/app/Level1/EarthDive/engine/zones.ts`, `src/app/Level1/EarthDive/engine/sprites.ts` |
| 131 | **Overhaul Batas Konvergen Level 1 Area 7 Menjadi 2 Kondisi (Daratan: Anak Krakatau & Bukit Lipatan vs Lautan: Palung Samudra & Pantai)**: Mengintegrasikan switcher mode di HUD atas (`⛰️ DARATAN` & `🌊 LAUTAN & PANTAI` serta `↺ ULANG ANIMASI`). Pada Mode Daratan (SS 1), lempeng kiri membawa Gunung Anak Krakatau aktif menunjam ke kanan bawah (`↘`), lempeng benua kanan menekan ke kiri (`←`), dan tabrakan dinamis melipat tanah membentuk bukit lipatan tinggi berhutan pinus. Pada Mode Lautan (SS 2), lempeng samudra berkolom air laut menunjam (`↘`) ke bawah pantai lempeng benua kanan (`←`), membentuk palung laut dalam yang curam. Dilengkapi panah vektor gerak beranimasi pendar, ground profile dinamis real-time, dan snapping presisi. | `src/app/Level1/EarthDive/engine/zones.ts`, `src/app/Level1/EarthDive/engine/sprites.ts`, `src/app/Level1/EarthDive/engine/renderer.ts`, `src/app/Level1/EarthDive/engine/gameEngine.ts`, `src/app/Level1/EarthDive/EarthDiveGame.tsx` |
| 132 | **Penyatuan Garis Lempeng Mulus Melengkung (*Seamless Curved Plate Boundary*) & Overhaul Realisme 3D Gunung Anak Krakatau**: Mengeliminasi patahan garis lempeng dan lantai datar horizontal di dasar lereng gunung via Hermite Spline $C^1$-continuous pada `getSubductingPlateTopY(x, p)`; menggabungkan garis lempeng menjadi SATU garis melengkung kontinu tak terputus dari lereng kawah hingga slab penunjaman di bawah lempeng benua; serta merombak realisme Gunung Anak Krakatau dengan pencahayaan volumetrik matahari kiri atas, arête tulang kawah, faset punggungan lahar 3D, lidah lava beku andesit (*ʻaʻā*), perlapisan piroklastik miring, puing talus/lapilli organik, dan kawah kaldera belerang kuning lemon alami. | `src/app/Level1/EarthDive/engine/zones.ts`, `src/app/Level1/EarthDive/engine/sprites.ts`, `progress_report.md` |
| 134 | **Standardisasi Karakter NPC Lintas Level 1 & Level 2 (5 Anggota Tim Resmi), Preservasi 16 Murid Kelas SMP (Level 2 Area 2), Evaluator Gerbang Bu Tyas, Sistem Badge Kaca Pembesar [🔍], dan Redesain Maskot Resqy Burung Hantu 2D Pixel**: Menstandarkan seluruh NPC di seluruh area Level 1 dan Level 2 menjadi 5 karakter tetap: **Zidane** (pintar & cool, kacamata cool, baju hitam), **Zahra** (ceria & gemesin, kacamata bulat emas, kerudung biru, baju pink), **Ican** (rambut ikal mengembang, jahil/playful edukatif), **Lintang** (kerudung hijau/ijo, pintar & analitis), dan **Bu Tyas, M.Pd.** (dosen pembimbing bijaksana, kerudung hitam anggun). Khusus Level 2 Area 2 (Ruang Kelas SMP), 16 murid tetap dipertahankan penuh dan guru diganti Bu Tyas, M.Pd. Bu Tyas bertindak sebagai evaluator gerbang tunggal di Wordle Level 1 dan TTS Crossword Level 2 (Area 1, 3, 4, 6). NPC pemegang materi edukasi dilengkapi floating badge pixel 2D Kaca Pembesar [🔍] (kuning emas berdenyut jika belum dibaca, hijau zamrud centang jika sudah dibaca). Maskot Resqy diredesain dari robot menjadi burung hantu bijak 2D pixel ("Kuk-kuuk!"). Dilengkapi potret bust besar pixel art kustom untuk kelima karakter dan outfit adaptif Level 1 (baju tambang, cryo hazard suit, scuba gear, kasual/formal). | `src/app/Level1/EarthDive/engine/npcSprites.ts`, `src/app/Level1/EarthDive/engine/npcManager.ts`, `src/app/Level1/EarthDive/engine/renderer.ts`, `src/app/Level1/EarthDive/dialogueData.ts`, `src/app/Level2/engine/npcSpritesL2.ts`, `src/app/Level2/engine/npcManagerL2.ts`, `src/app/Level2/engine/renderer.ts`, `src/app/Level2/dialogueDataL2.ts` |
| 135 | **Penyelarasan Materi Kerak Bumi (Hanya pada Lintang)**: Menghapus duplikasi materi pada NPC Zahra di Kerak Bumi (Zona 1) sehingga modul materi sains komparasi kerak benua vs samudra hanya dipegang secara eksklusif oleh Lintang (`hasMaterial: true`, Discovery 0). | `src/app/Level1/EarthDive/engine/zones.ts`, `src/app/Level1/EarthDive/engine/npcManager.ts`, `src/app/Level1/EarthDive/dialogueData.ts` |
| 136 | **Standarisasi Penamaan Asli NPC (Eliminasi Label "Peneliti")**: Mengubah seluruh sebutan generik "Peneliti" di prompt floating, judul dialog, dan teks percakapan menjadi nama asli masing-masing karakter (Zidane, Zahra, Ican, Lintang, Bu Tyas). | `src/app/Level1/EarthDive/engine/renderer.ts`, `src/app/Level1/EarthDive/dialogueData.ts` |
| 137 | **Pemangkasan Proporsional NPC Lapisan Dalam (Mantel hingga Inti Dalam)**: Menerapkan aturan *"makin dalam lapisannya, makin sedikit NPC-nya"* dari Mantel hingga Inti Dalam: Mantel Bumi (Zona 2) hanya berisi Zahra [🔍], Lintang [🔍], dan Bu Tyas; Inti Luar (Zona 3) hanya berisi Zahra [🔍], Lintang [🔍], dan Bu Tyas; Inti Dalam (Zona 4) hanya berisi Zidane [🔍], Zahra [🔍], dan Bu Tyas. Menjaga suasana kedalaman bumi yang sunyi dan dramatis tanpa mengurangi materi. | `src/app/Level1/EarthDive/engine/zones.ts`, `src/app/Level1/EarthDive/engine/npcManager.ts` |
| 138 | **Pembersihan Duplikasi Materi Batas Divergen (Zona 5)**: Menghapus duplikasi materi pada NPC Ican di Batas Divergen sehingga materi pemekaran divergen hanya dipegang secara terpusat oleh Lintang. | `src/app/Level1/EarthDive/engine/zones.ts`, `src/app/Level1/EarthDive/engine/npcManager.ts`, `src/app/Level1/EarthDive/dialogueData.ts` |
| 139 | **Koreksi Presisi Proksimitas Interaksi di Batas Konvergen (Zona 6)**: Memperbaiki koordinat dan ambang batas deteksi interaksi NPC Zidane dan Zahra di Batas Konvergen agar prompt `[E] / Enter` hanya aktif saat karakter pemain berada tepat di dekat fisik NPC tersebut, menghilangkan bug pemain dapat berinteraksi dari jarak jauh yang keliru. | `src/app/Level1/EarthDive/engine/zones.ts`, `src/app/Level1/EarthDive/engine/npcManager.ts` |
| 140 | **Isolasi State Penemuan Terpisah di Inti Dalam (Zona 4)**: Memperbaiki bug kebocoran state di mana membaca salah satu materi di Inti Dalam menyebabkan kedua materi langsung ditandai selesai. Memisahkan `ic_disc1` dan `ic_disc2` secara terisolasi baik di memory maupun di `localStorage`. | `src/app/Level1/EarthDive/EarthDiveGame.tsx`, `src/app/Level1/EarthDive/engine/gameEngine.ts` |
| 141 | **Penyempurnaan Dialog Resqy, Relokasi Kontrol Kondisi Konvergen & Eliminasi Radar Batas Tektonik**: Menyempurnakan penjelasan dialog Resqy untuk 2 kondisi tumbukan lempeng di Batas Konvergen; menghapus tombol ekstra `[🦉 INFO 2 KONDISI]`; menyembunyikan minimap Radar Bumi di area batas tektonik (`zoneIndex >= 5`); serta merelokasi tombol switcher kondisi (`DARATAN`, `LAUTAN`, `ULANG`) ke pojok kanan atas dengan layout vertikal yang serasi dengan Level 2. | `src/app/Level1/EarthDive/EarthDiveGame.tsx`, `src/app/Level1/EarthDive/dialogueData.ts` |
| 142 | **Eliminasi Penuh NPC Zidane & Temuan Sismograf di Batas Transform (Zona 7)**: Menghapus NPC Zidane (`z7_npc_zidane`) dan modul temuan sismograf (Temuan 15) dari Batas Transform; memperbarui syarat gerbang Bu Tyas agar hanya membutuhkan Temuan 16 (Zahra: Sesar San Andreas); memperbarui metadata strata; dan menyelaraskan seluruh dialog Resqy, Ican, Lintang, dan Bu Tyas agar tidak lagi menyebut Zidane atau sismograf. | `src/app/Level1/EarthDive/engine/zones.ts`, `src/app/Level1/EarthDive/engine/npcManager.ts`, `src/app/Level1/EarthDive/EarthDiveGame.tsx`, `src/app/Level1/EarthDive/dialogueData.ts`, `src/app/Level1/EarthDive/earthDiveData.ts` |
| 143 | **Penyeragaman Desain Floating Badge Materi Edukasi [🔍] Level 2 Menjadi Identik Level 1**: Mengganti desain pin lingkaran bulat lama di Level 2 (`drawNpcMaterialBadgeL2`) menjadi kartu pill badge melayang (`pillW: 68, pillH: 17`) berbingkai emas/zamrud dengan pointer segitiga ke kepala NPC, ikon pixel art kaca pembesar, dan teks status `MATERI` / `BACA ✓` persis seperti di Level 1. | `src/app/Level2/engine/npcSpritesL2.ts`, `src/app/Level2/engine/renderer.ts`, `src/app/Level1/EarthDive/engine/npcSprites.ts` |
| 144 | **Penyelarasan Warna Alur Lembah Merapi Area 5 ke Slate Alami (`#334155`)**: Menyelaraskan warna guratan alur sungai lahar dingin di siluet Gunung Merapi pada Area 5 dari cokelat tua (`#451a03`) menjadi warna slate alami (`#334155`) agar identik dengan visual Area 6. | `src/app/Level2/engine/renderer.ts` |
| 145 | **Overhaul Lelehan Magma Merapi Erupsi Eksplosif: Flank Kiri & Kanan Sesuai Garis Referensi, Deselerasi Aliran (~14s), dan Eliminasi Border Menjadi Tekstur Fluida Menyatu (*Seamless Multi-Pass*)**: Menambahkan dua jalur aliran lava utama pada lereng kiri (dari bibir kawah kiri menyusuri punggungan hingga kaki gunung kiri) dan lereng kanan (menyusuri punggungan kanan di luar rumpun pohon) sesuai goresan garis merah pengguna; memperlambat laju turunnya magma secara dramatis dari ~3 detik menjadi ~14 detik (`0.0012` per frame) agar tercipta kesan lava kental andesitik Merapi yang merayap perlahan; serta mengeliminasi total garis pinggir luar gelap (`#991b1b` / `#7f1d1d`) dengan arsitektur rendering multi-pass global sehingga seluruh cabang aliran menyatu secara mulus tanpa batas sambungan. | `src/app/Level2/engine/renderer.ts`, `src/app/Level2/engine/gameEngine.ts` |
| 146 | **Implementasi Skenario Erupsi Efusif & Latar Hilir Sungai Dinamis Antar-Fase**: Mengimplementasikan tipe erupsi efusif pada simulasi Area 5 dengan karakteristik vulkanologis akurat: magma cair encer dengan lelehan lava mengalir luas di lereng gunung, eliminasi ledakan vertikal dan lontaran bom vulkanik, uap/asap tipis yang menyebar mendatar (*diffuse steam*), dan guncangan gempa vulkanik kecil (*mild tremor*). Menambahkan lanskap hilir sungai dekat gunung (*downstream riverbank*) dengan perubahan perspektif jarak antar-submap (Map 1: dekat sungai dengan plang & pagar kayu, Map 2: mulai menjauh, Map 3: sangat jauh) serta evolusi kekeruhan air dinamis per fase: jernih biru (Fase 1-2 Normal & Waspada), mulai keruh bersedimen (Fase 3 Siaga), hingga keruh pekat kemagmaan dengan urat lava pijar dan uap panas (Fase 4 Awas). | `src/app/Level2/engine/renderer.ts`, `src/app/Level2/engine/gameEngine.ts`, `src/app/Level2/engine/TectonicGame.tsx`, `src/app/Level2/VolcanoPhaseModal.tsx` |
| 147 | **Penyempurnaan Perspektif Hilir Sungai Alami & Eliminasi Total Efek Ledakan Busur Puncak Kawah**: Memperbaiki tampilan sungai agar tidak melayang di udara dengan mengintegrasikan lereng bantaran dekat (*near riverbank slope*) yang menyambung secara kontinu dari dasar sungai ke lantai dusun ($Y=360$), merelokasi sungai di Map 3 ke balik perbukitan kaki gunung, serta mengganti garis putus-putus marka jalan dengan riak arus sinusoidal mulus; menyelaraskan warna sungai Fase 4 menjadi keruh pekat sedimen vulkanik alami (`#292524`, `#44403c`, `#334155`) tanpa vena/warna merah menyala; serta menghapus total efek ledakan busur percikan pijar (`drawCraterLavaSprayArcs`) pada kawah puncak sehingga murni menyisakan animasi lelehan magma encer menuruni lereng secara bersih. | `src/app/Level2/engine/renderer.ts` |
| 148 | **Overhaul Asap Erupsi Efusif Realistis (*Harmonic Perturbed Amorphous Billows*) & Eliminasi Total Sungai Melayang di Map 3**: Merombak total asap erupsi efusif dari bulatan kaku lingkaran (*circle-based*) menjadi sistem kepulan amorf organik bergelombang melimpah (28 kluster awan cumulus dengan poligon harmonik 10-titik ber-radial gradient lembut) yang menyebar mendatar di atas puncak dan menyusuri lereng barat & timur; serta menyelesaikan tuntas masalah sungai melayang di Map 3 dengan mengunci lereng perbukitan depan (*near bank slope*) menyambung penuh dari bibir bawah sungai ($Y=254$) langsung ke lantai pemukiman ($Y=360$) di seluruh SubMap, menutup celah abu-abu di bawah sungai, dan meletakkan pohon pinus alami di perbukitan depan. | `src/app/Level2/engine/renderer.ts` |
| 149 | **Konsistensi Tremor Gempa Halus Menuju Mobil Evakuasi & Pewarnaan Asap Abu-Abu Kehitaman**: Mengatasi lonjakan gempa mendadak saat evakuasi warga selesai (`fase4_awas_truck`) dengan mempertahankan intensitas tremor vulkanik ringan konstan (`0.8`) dan menonaktifkan lontaran bom piroklastik khusus skenario efusif; serta menyelaraskan pewarnaan kepulan asap amorf pada kawah puncak menjadi warna abu-abu kehitaman (`rgba(87, 83, 78)` ke `rgba(41, 37, 36)`) dengan pendaran bara di dekat mulut kawah sesuai permintaan pengguna. | `src/app/Level2/engine/gameEngine.ts`, `src/app/Level2/engine/renderer.ts` |
| 150 | **Puncak Merapi Rusak/Kroak Eksplosif, Aliran Lava Efusif 10 Cabang Tanpa Offset & Animasi Merayap Halus, Redesain Modal Status Merapi Krem Hangat, Lelehan Magma Area 6, Timer 15 Detik Evakuasi Warga, dan Modal Gagal Evakuasi**: Menghadirkan puncak kawah Merapi runtuh/rusak (*caldera collapse notch*) pasca-letusan eksplosif lengkap dengan tebing andesit gelap patah dan retakan batuan; mengimplementasikan 10 cabang aliran lava efusif melimpah menyelimuti lereng dan 7 kolam delta sesuai sketsa garis merah pengguna dengan eliminasi celah/offset kawah dan animasi merayap sangat lambat (~55 detik); mempertahankan 3 aliran lava klasik pada skenario eksplosif; meredesain Modal Status Merapi (Fase 1-4) menjadi perkamen krem hangat dan kayu retro; menambahkan guratan urat magma tipis berpendar di Area 6 (Barak Pengungsian); menghidupkan timer hitung mundur 15 detik saat evakuasi warga di Fase 4 AWAS; serta menciptakan Modal Gagal Evakuasi (`VolcanoRescueFailedModal.tsx`) bernuansa kayu-krem dengan tombol coba lagi (*retry*) cepat tanpa mereset seluruh simulasi. | `src/app/Level2/engine/renderer.ts`, `src/app/Level2/engine/gameEngine.ts`, `src/app/Level2/VolcanoPhaseModal.tsx`, `src/app/Level2/VolcanoRescueFailedModal.tsx`, `src/app/Level2/engine/TectonicGame.tsx` |
| 151 | **Platforming Parkour Pilar Basal & Danau Magma di Mantel Bumi (Level 1 Zona 2)**: Merombak kontur Zona 2 (Mantel Bumi) menjadi lintasan platforming pilar basal terapung (`basalt_pillar`) yang melintasi danau magma pijar konveksi; menata ulang koordinat NPC (Zahra di $px=380$, Lintang di $px=700$, Bu Tyas di $px=1070$) dan Kristal Geologis agar menapak kokoh di atas platform pilar aman tanpa jatuh ke dalam magma. | `src/app/Level1/EarthDive/engine/zones.ts`, `src/app/Level1/EarthDive/engine/npcManager.ts` |
| 152 | **Penukaran Map & Penyelarasan Atmosfer/Warna Inti Luar vs Inti Dalam**: Menukar arsitektur map antara Zona 3 (Inti Luar) dan Zona 4 (Inti Dalam) sesuai instruksi pengguna: Inti Luar menggunakan map lantai kubah batuan datar luas berparalaks kilatan petir geodynamo dan loop medan magnetik beranimasi dengan pendaran atmosfer kuning keemasan; Inti Dalam menggunakan map teras kristal logam heksagonal purba melintasi jurang fluida dengan nuansa atmosfer gelap pekat, tanah basal gelap, dan pendaran magma redup misterius; serta menambahkan 1 kristal energi baru di pematang tengah Inti Dalam ($px=590, py=280$). | `src/app/Level1/EarthDive/engine/zones.ts`, `src/app/Level1/EarthDive/engine/sprites.ts`, `src/app/Level1/EarthDive/engine/renderer.ts` |
| 153 | **Sistem Transaksi Kristal Energi & Merchant Baju Pelindung Geologis (Hazard Suits MK-1 s.d. MK-4)**: Mengalihfungsikan Kristal Energi dari sekadar item koleksi menjadi mata uang fungsional penukaran perlengkapan geologis; menghadirkan 4 NPC Teknisi Baju Pelindung (Teknisi Joko di Kerak Bumi, Teknisi Rudi di Mantel Bumi, Teknisi Dian di Inti Luar, dan Teknisi Arya di Inti Dalam) di samping kanan Bu Tyas sebelum Portal Turun; mengintegrasikan modal transaksi `SuitMerchantModal.tsx` dengan harga 1 kristal per baju; gatekeeping portal turun jika baju spesifik belum dibeli/dipakai; serta sistem auto-equip dan persistensi `purchasedSuits` & `equippedSuit` di store & localStorage. | `src/app/Level1/EarthDive/SuitMerchantModal.tsx`, `src/app/Level1/EarthDive/engine/gameEngine.ts`, `src/app/Level1/EarthDive/engine/player.ts`, `src/app/Level1/EarthDive/EarthDiveGame.tsx`, `src/app/Level1/EarthDive/engine/zones.ts`, `src/app/Level1/EarthDive/engine/npcManager.ts` |
| 154 | **Alur Dialog Berkesinambungan Bu Tyas Pasca-Wordle & Pengarahan Teknisi**: Merancang alur transisi mulus di mana setelah siswa berhasil menyelesaikan evaluasi Wordle bersama Bu Tyas, sistem secara otomatis memicu dialog kelanjutan dari Bu Tyas yang menginstruksikan siswa untuk menemui Teknisi Baju Pelindung di sebelah kanan guna menukarkan kristal energi sebelum melompat ke portal bawah tanah. | `src/app/Level1/EarthDive/EarthDiveGame.tsx`, `src/app/Level1/EarthDive/dialogueData.ts` |
| 155 | **Visual Sheet Avatar Baju Pelindung Unik & Refinement Skalabilitas UI Modal**: Mendesain 4 varian visual avatar siswa dinamis di `studentAvatarSheet.ts` (`hazard_mantle`, `hazard_outer`, `hazard_inner`, `diver`); menghapus kotak narasi teknisi pada `SuitMerchantModal.tsx` dan memperbesar ukuran font serta padding modal agar nyaman dibaca; serta memperbesar ukuran kartu popup peringatan bahaya lingkungan ekstrem (`suitWarningModal` di `EarthDiveGame.tsx`) dari `max-w-xl` menjadi `max-w-2xl sm:max-w-3xl` dengan ikon peringatan 80x80px dan font penjelasan sains yang lebih besar. | `src/utils/studentAvatarSheet.ts`, `src/app/Level1/EarthDive/SuitMerchantModal.tsx`, `src/app/Level1/EarthDive/EarthDiveGame.tsx`, `src/app/Level1/EarthDive/engine/renderer.ts` |
| 156 | **Resolusi Bug Pilihan Dialog Kedua Membeku (Freezing Dialogue Branching Fix)**: Mengatasi bug di mana saat pemain memilih opsi kedua pada percabangan dialog interaktif (misalnya opsi "Nanti saja..." atau "Saya pelajari dulu..."), game langsung membeku (freeze) dan hanya bisa dilepas dengan menekan tombol spasi. Ditemukan bahwa target `nextNodeId` tidak terdefinisi di pohon dialog (seperti node `done` yang hilang pada `PROF_ANDINI_DIALOGUE`, inkonsistensi huruf besar-kecil `start_tour_One` vs `start_tour_one` di `INSPEKTUR_BUDI_DIALOGUE`, serta dangling branches di `PROF_RADITYA_DIALOGUE`). Ditambahkan node penutup yang valid, menghubungkan target percabangan dengan benar, dan memastikan seluruh alur dialog berakhir secara mulus. | `src/app/Level1/EarthDive/dialogueData.ts` |
| 157 | **Audit Menyeluruh & Integritas Pohon Dialog Lintas Level 1 & Level 2**: Melakukan audit otomatis berbasis script terhadap seluruh pohon dialog di Level 1 (`dialogueData.ts`) dan Level 2 (`dialogueDataL2.ts`) untuk memastikan tidak ada lagi broken `nextNodeId`, circular non-terminating branches, atau target node yang tidak terdaftar di registry, sehingga seluruh dialog interaktif berjalan 100% bebas freeze. | `src/app/Level1/EarthDive/dialogueData.ts`, `src/app/Level2/dialogueDataL2.ts` |
| 158 | **Pemberantasan Ketidaksesuaian Identitas & Potret Karakter NPC Level 1**: Mengatasi ketidaksesuaian di mana NPC pada peta memiliki nama tertentu (misal Zahra / Lintang) namun saat diajak bicara kotak dialog menampilkan nama atau potret karakter lain (misal Zidane / Lintang): (1) Memperbaiki profil `prof_sarah` (Zona 2 Mantel Bumi) dari Zidane menjadi Zahra (`#f472b6`, potret `zahra`). (2) Memperbaiki profil `prof_lestari` (Zona 4 Inti Dalam) dari Lintang menjadi Zahra. (3) Memperbaiki profil `dr_farhan` (Zona 4 Inti Dalam) dari Zidane menjadi Lintang (`#4ade80`, potret `lintang`). (4) Memperbaiki `PETUGAS_RUDI_TRANS_DIALOGUE` (Zona 7 Batas Transform) yang sebelumnya memanggil profil `petugas_rudi` (Ican) menjadi `lintang` (Lintang). | `src/app/Level1/EarthDive/dialogueData.ts` |
| 159 | **Pemberantasan Ketidaksesuaian Identitas & Potret Karakter NPC Level 2**: Menyelaraskan seluruh NPC dan profil pembicara di Level 2: (1) Memperbaiki profil `pak_joko` di Area 5 (Simulasi Merapi) yang sebelumnya menampilkan nama/potret Lintang menjadi identitas asli Pak Joko (`#22c55e`, potret `pak_joko`, Kepala Dusun Destana). (2) Memperbaiki profil `mbak_rina` di Area 5 yang sebelumnya menampilkan Zahra menjadi Mbak Rina (`#f87171`, potret `mbak_rina`, Warga Siaga Merapi). (3) Memperbaiki `l2_sim5_npc_satria` di Area 5 yang sebelumnya memicu dialog Pak Joko (`pak_joko_awas_evac`) dan profil Bu Tyas, menjadi Komandan Satria (`#f97316`, potret `komandan_satria`, Tim SAR/BPBD) yang memicu dialog apresiasi evakuasi `satria_sim_victory`. (4) Memperbaiki `l2_shelter_npc_ican` di Area 6 (Barak Pengungsian) yang sebelumnya memanggil dialog Zidane (`mbah_joyo_shelter_dialogue`) menjadi `dani_shelter_dialogue` (Ican tentang logistik dapur umum & saling menyemangati pengungsi). (5) Memperbaiki potret profil `bu_rahma` dan tipe map di Area 3 Lapangan (`l2_field_npc_bu_tyas`) menjadi `bu_tyas` agar seragam dengan penampilannya di seluruh area lain. (6) Memperbaiki profil warisan `pak_slamet` menjadi Lintang dan `pak_hendra` menjadi Pak Hendra. | `src/app/Level2/dialogueDataL2.ts`, `src/app/Level2/engine/npcManagerL2.ts` |
| 160 | **Refinement UI SuitMerchantModal, Penajaman Teks Dialog & Istilah Punggungan Tengah Samudra**: Memperbaiki padding, efek backdrop, bayangan 3D, dan tipografi tombol pada `SuitMerchantModal.tsx` agar semakin nyaman digunakan; menyederhanakan teks dialog pengarahan Resqy di berbagai zona Level 1 (menghilangkan sebutan teknis "NPC" dan menyebutkan rekan penjelajah secara alami); serta menyempurnakan istilah geologi pada Batas Divergen dari *"pematang tengah samudra"* menjadi istilah baku kurikulum nasional: *"punggungan tengah samudra (mid-ocean ridge)"*. | `src/app/Level1/EarthDive/SuitMerchantModal.tsx`, `src/app/Level1/EarthDive/dialogueData.ts` |

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

### 27. Standarisasi Menyeluruh UI, Kontrol Sentuh D-Pad Analog, Kotak Percakapan Visual Novel, dan Kotak Materi Level 2 Selaras Level 1 (Serta Migrasi Repositori Resmi)
- **Modul**: [`TectonicGame.tsx`](./src/app/Level2/engine/TectonicGame.tsx), [`player.ts`](./src/app/Level2/engine/player.ts), [`renderer.ts`](./src/app/Level2/engine/renderer.ts), [`npcManagerL2.ts`](./src/app/Level2/engine/npcManagerL2.ts), [`dialogueDataL2.ts`](./src/app/Level2/dialogueDataL2.ts), [`VisualNovelDialogueL2.tsx`](./src/app/Level2/VisualNovelDialogueL2.tsx), [`DiscoveryModal.tsx`](./src/app/Level2/DiscoveryModal.tsx)
- **Kebutuhan Pengguna & Arahan Revisi**:
  1. **Tombol Analog / Kontrol Sentuh Tidak Sama & Harus Di-Zoom In**: Di Level 2, tombol sentuh berbeda dari Level 1 dan memerlukan zoom in ekstrem (250%) baru muncul. Dirombak total agar sistem tombol analog, D-Pad, dan aturan visibilitasnya 100% persis Level 1.
  2. **Standarisasi Gaya Visual (Style) Level 2 ke Level 1**: Seluruh elemen antarmuka (kotak menu, tombol-tombol navigasi, kotak percakapan visual novel, kotak materi/Discovery Modal, dan balon interaksi) diselaraskan gayanya agar identik dengan Level 1.
  3. **Penyelarasan Robot Resqy**: Sistem percakapan Resqy di Level 2 disamakan dengan Level 1 (percakapan interaktif RPG dengan pilihan jawaban bernomor, dan Resqy murni sebagai maskot terbang melayang di belakang pundak tanpa duplikat NPC di tanah).
  4. **Migrasi Repositori Resmi**: Memindahkan remote Git ke `https://github.com/zidan-cmiw/resq-box.git` dan mengklarifikasi tampilan atribusi Git Blame.

- **Rincian Implementasi Teknis**:
  1. **Logika Responsif Kontrol Sentuh & D-Pad (`TectonicGame.tsx` & `player.ts`)**:
     - Menghapus aturan `sm:hidden` yang sebelumnya menyembunyikan tombol pada lebar layar $\ge$ 640px.
     - Menerapkan logika Level 1: `(isTouchDevice || (typeof window !== 'undefined' && window.innerWidth <= 1024))`. Kontrol sentuh kini otomatis aktif dan tampil pada perangkat layar sentuh dan resolusi layar $\le$ 1024px tanpa memerlukan zoom in.
     - Mengimplementasikan **4-Way D-Pad** di kiri bawah (▲, ◀, dot tengah, ▶, ▼) dengan container rounded gelap (`bg-slate-950/75 border-2 border-slate-700/90 shadow-[0_4px_0_#0f172a]`).
     - Mengimplementasikan cluster tombol aksi di kanan bawah: **LONCAT** (gradasi biru + ikon ▲ + teks `LONCAT`, `shadow-[0_3px_0_#1e3a8a]`) dan **[E] AKSI** (gradasi amber + teks `[E]` & `AKSI`, `shadow-[0_3px_0_#78350f]`).
     - Di `player.ts`, memperluas `setMobileControlL2` untuk mendukung `'left' | 'right' | 'up' | 'down' | 'jump' | 'interact'`, di mana `jump` dan `up` keduanya memicu lompatan dan double jump jet booster secara mulus.
     - Menambahkan panduan keyboard desktop di bagian bawah tengah: `← → Gerak`, `↑ / [Spasi] Lompat`, `[E] Interaksi`, serta prompt balon mengambang `nearInteractablePrompt` di atas pemain.
  2. **Standarisasi Kotak Menu Top Bar (`TectonicGame.tsx`)**:
     - Kotak Menu pojok kiri atas diselaraskan dengan Level 1: tombol `< MENU` berwarna amber tua (`bg-amber-950 hover:bg-amber-900 border-2 border-amber-600/80 font-pixel-title text-[11px] sm:text-xs text-amber-200 shadow-[0_2px_0_#231206] active:translate-y-0.5`), tombol audio SFX, dan tombol Layar Penuh berikon PixelIcon SVG.
     - Badge Nama Area diselaraskan menjadi pill gelap elegan `bg-slate-950/95 border-2 border-amber-700/90 shadow-[0_4px_0_#231206]` dengan titik indikator berdenyut (`animate-pulse` hijau atau `animate-ping` merah).
  3. **Penyelarasan Kotak Percakapan Visual Novel (`VisualNovelDialogueL2.tsx`)**:
     - Menyelaraskan teks dan ikon header riwayat: `<span>📜</span> RIWAYAT PERCAKAPAN` dan tombol kembali `<span>✕</span> KEMBALI`.
     - Menyelaraskan indikator lanjut dialog: `[Klik / SPASI untuk Lanjut ▶]`.
     - Menyelaraskan tombol toggle auto-play toolbar: `▶ Auto (ON)` / `▷ Auto`.
     - Pilihan respons percabangan RPG dilengkapi nomor indeks amber `[1]`, `[2]` dengan animasi mikro saat hover.
     - Potret NPC di kiri dan potret murid berseragam di kanan dirender 100% transparan mengambang di atas kotak obrolan tanpa kotak latar belakang kaku.
  4. **Penyelarasan Kotak Materi Discovery Modal (`DiscoveryModal.tsx`)**:
     - Papan perkamen utama diperbesar dari `max-w-3xl` menjadi `max-w-4xl` dengan warna `#fef3c7`, border kayu tebal `#451a03`, dan bayangan `shadow-[0_12px_0_#1c0d02]`.
     - Area kanvas ilustrasi sains diperbesar menjadi `w-full h-[380px] sm:h-[450px] md:h-[500px]` dengan latar `#0c0a09` dan bingkai border-3 `#78350f`.
     - Tombol tutup diselaraskan dengan tombol `✕` khas Level 1 (`bg-[#b45309] shadow-[0_2px_0_#451a03]`).
     - Tata letak informasi edukasi sains ditata ulang menjadi grid 2 kolom (`LOKASI PENELITIAN` & `FAKTA SAINS RESMI`) menggunakan `font-pixel text-xs sm:text-sm`.
  5. **Pemberantasan Bug Interaksi & Duplikasi Maskot Resqy (`npcManagerL2.ts`, `renderer.ts`, `dialogueDataL2.ts`)**:
     - Menghapus duplikasi NPC Resqy statis yang menempel di tanah pada Area 2 dan Area 3, sehingga Resqy murni berposisi sebagai maskot pendamping yang melayang di belakang pundak pemain.
     - Mengatasi bug teks bertumpuk `[E] [E] BICARA`: di `npcManagerL2.ts`, logika pembaruan proksimitas NPC diperbaiki agar me-reset `isNearPlayer = false` pada seluruh NPC terlebih dahulu, kemudian hanya menetapkan `isNearPlayer = true` pada satu NPC terdekat dalam radius interaksi.
     - Mengubah balon ucapan interaksi NPC yang besar menjadi pill kuning ramping minimalis 56x14px (`[E] / Enter`) berbingkai `#facc15` persis Level 1 di `renderer.ts`.
     - Menghapus duplikasi properti `resqy_briefing_area3` di `dialogueDataL2.ts` dan memperkaya pilihan respons percakapan interaktif mengenai pentingnya titik kumpul terbuka dan koordinasi pascabencana.
     - Mengaktifkan interaksi klik langsung canvas (`handleCanvasClickEvent`) saat mengklik NPC maupun maskot Resqy.
  6. **Migrasi Repositori Resmi GitHub**:
     - Memperbarui remote URL git: `git remote set-url origin https://github.com/zidan-cmiw/resq-box.git`.
     - Menjelaskan mekanisme Git Blame / GitLens di mana baris kode lama yang belum dimodifikasi tetap mencatat nama penulis aslinya, serta memverifikasi bahwa seluruh commit baru dan push resmi telah tercatat murni atas nama `zidan-cmiw`.

---

## 54. Penyempurnaan QTE Simulasi Gempa Area 2 & Barisan Evakuasi Kontinu (`renderer.ts`, `gameEngine.ts`, `TectonicGame.tsx`)

Berdasarkan evaluasi pengujian pengguna pada Simulasi Tanggap Gempa Ruang Kelas 8A (Level 2 Area 2), dilakukan penyempurnaan menyeluruh terhadap mekanisme QTE (*Quick Time Event*) penyelamatan diri dan kontinuitas barisan evakuasi:

1. **Relokasi Popup QTE ke Tengah Layar (*Center Viewport*)**:
   - Memindahkan posisi popup QTE dari atas layar (`cardY = 44`) ke titik tengah vertikal & horizontal layar (`cy = viewH / 2; cardY = cy - cardH / 2`). Pemain kini dapat langsung melihat peringatan darurat seketika saat gempa mengguncang tanpa harus mencari-cari di bagian atas layar.
2. **Efek Kelap-Kelip Alarm Berjeda 1 Detik (*1-Second Blink Cycle*)**:
   - Mengimplementasikan siklus kelap-kelip retro arcade 1 detik (60 ticks): `const isBlinkVisible = (animTick % 60) < 40;`. Popup muncul secara mencolok selama ~0.65 detik dan berkedip jeda ~0.35 detik secara berulang, memberikan urgensi refleks tanpa membingungkan mata.
3. **Penyederhanaan Teks & Eliminasi Kepadatan Visual (*Clean & Punchy Layout*)**:
   - Menghapus paragraf teks panjang yang membingungkan. Tampilan QTE dipangkas menjadi 2 baris instruksi kontras tinggi yang instan dibaca:
     - Baris 1: `⚠️ AWAS GEMPA! MERUNDUK!` (Font tebal merah/salmon).
     - Baris 2: Tombol aksi amber terang `TEKAN [E] / TAP SEKARANG!`.
     - Baris 3: Bilah progres waktu ramping minimalis dengan indikator detik `SISA WAKTU: 6.4s`.
   - Mengaktifkan klik/tap kanvas langsung saat fase QTE di `TectonicGame.tsx` sehingga pengguna layar sentuh atau mouse dapat langsung mengetuk layar untuk berlindung di bawah meja.
4. **Perpindahan Posisi Otomatis ke Atas Saat Berlindung (*Transition to Top Overlay*)**:
   - Saat pemain berhasil menekan tombol `[E]` atau mengetuk layar untuk berlindung di bawah meja (`phase === 'quake_holding'`), popup QTE tengah otomatis hilang dan indikator beralih ke bagian atas layar (`drawSimulationQuakeTimerOverlay`, `cardY = 48`).
   - Bagian atas menampilkan durasi guncangan gempa yang tersisa (`GUNCANGAN GEMPA: 00:08`) dan instruksi bertahan (`TETAP MERUNDUK & BERTAHAN DI KAKI MEJA (HOLD ON)`), menjaga pandangan ke ruang kelas tetap leluasa saat puing-puing berjatuhan.
5. **Perbaikan Barisan Evakuasi Guru & Murid Kontinu (*Non-Stopping Evacuation*)**:
   - Mengatasi masalah di mana barisan guru Bu Rahma dan murid-murid sekelas mendadak berhenti/membeku saat karakter pemain mendahului mereka dan mendekati pintu evakuasi.
   - Di `gameEngine.ts`, siklus pembaruan posisi evakuasi diubah menjadi `else if (sim.phase === 'evacuating' || sim.phase === 'completed')`, dengan kecepatan jalan dinamis `2.4` px/frame.
   - Guru dan seluruh murid kini terus berbaris tertib dan berjalan ke kanan hingga tiba di titik kumpul pintu (`stopTarget`), tanpa pernah berhenti di tengah jalan meskipun pemain berlari lebih cepat mendahului barisan.

---

## 55. Transformasi Area 5 Level 2: Simulasi Tanggap Erupsi Merapi (Mekanika Warga Berjalan Mengikuti Pemain, Jalur Hamburan Burung Dari Gunung, Penyesuaian Urutan Masuk Area, dan Skalabilitas UI Keterbacaan)

Berdasarkan pengujian langsung skenario erupsi gunung api pada Area 5 (Dusun Destana KRB III Lereng Merapi), dilakukan pembenahan komprehensif pada dinamika simulasi dan elemen antarmuka:

1. **Mekanika Pengawalan Warga Berjalan (*Villager Escort & Follow Mechanics*)**:
   - Warga yang berhasil dievakuasi (Dani, Mbah Joyo, Bu Tejo) tidak lagi diam mematung di pekarangan setelah diajak evakuasi.
   - Diimplementasikan logika pengikut (*follower state machine*) di [`gameEngine.ts`](./src/app/Level2/engine/gameEngine.ts): warga yang telah ditolong beralih ke state `following`, berbaris rapi di belakang langkah pemain dengan offset jarak berjenjang (`followIndex * 28px`), dan terus berjalan berdampingan mengikuti pemain hingga mencapai bak truk evakuasi BPBD di `x: 1840`.
2. **Sekuensial Masuk Area Simulasi Merapi Bersih (*Entry Sequence Orchestration*)**:
   - Memperbaiki tumpang tindih visual saat pemain baru saja bertransisi masuk ke Area 5.
   - Popup peringatan transisi *"MEMASUKI AREA SIMULASI ERUPSI MERAPI"* kini diberi prioritas tampil terlebih dahulu hingga selesai, setelah itu barulah robot pemandu Resqy memicu dialog pengarahan taktis awal (*briefing*), menciptakan alur pengalaman visual yang tenang dan runtut.
3. **Pola Hamburan Burung Panik dari Puncak Gunung Merapi (*Volcano Bird Dispersal Pattern*)**:
   - Mengoreksi arah terbang partikel burung yang sebelumnya hanya bergerak searah dari kiri ke kanan.
   - Partikel burung kini diinisialisasi bersumber dari arah puncak Merapi (tengah atas/kiri atas) dan terbang menyebar panik secara anggun ke dua arah berlawanan (sayap kanan dan sayap kiri lereng).
   - Ukuran partikel burung disesuaikan (`scale 0.7x`) agar lebih proporsional terhadap lanskap pedesaan lereng Merapi.
4. **Skalabilitas dan Peningkatan Keterbacaan Antarmuka (*UI Readability & Visual Hierarchy*)**:
   - **Kotak Status Aktivitas Gunung Merapi**: Panel status di pojok kanan atas diperbesar dengan bantalan padding kontras, indikator status PVMBG (Waspada Level II, Siaga Level III, Awas Level IV) dibuat lebih tebal dan mencolok.
   - **Mini-Misi Penyelamatan**: Kotak daftar misi di sisi kanan layar (seperti *"Tolong Dani di Pekarangan"*, *"Gunakan Masker N95"*, *"Naik ke Bak Truk BPBD"*) ditingkatkan ukuran teks dan kontras bordernya agar langsung terbaca sekilas saat aksi darurat berlangsung.
   - **Popup Peringatan QTE**: Kartu instruksi QTE diperbesar proporsinya dengan kontras visual retro arcade yang jelas di berbagai resolusi layar.

---

## 56. Penguncian Permanen Evaluasi Teka-Teki Silang (TTS) Pasca-Tuntas & Penyelarasan Respon Dialog NPC Unlocked Level 2 Selaras Level 1 (Area 1, Area 3, & Area 4)

Mengatasi isu di mana pemain yang telah menyelesaikan Teka-Teki Silang (TTS) evaluasi gerbang di Level 2 masih dapat mengulang kembali pengerjaan kuis, serta menyelaraskan pengalaman bermain dengan standar baku di Level 1:

1. **Kebijakan Anti-Pengulangan Evaluasi TTS (*Evaluation Lockout*)**:
   - Mengadopsi prinsip yang diterapkan pada evaluasi Komandan Hendra di Level 1: jika gerbang area berikutnya telah terbuka (*unlocked*), pemain dilarang membuka atau mengulang pengerjaan evaluasi TTS yang sama.
   - Berlaku menyeluruh di seluruh area evaluasi kognitif Level 2:
     - **Area 1 (Mitigasi Gempa Ruang Kelas)**: Gerbang `l2_gate_gempa` bersama Kak Fajar.
     - **Area 3 (Lapangan Evakuasi Pascabencana)**: Gerbang `l2_gate_pascabencana` bersama Komandan Satria.
     - **Area 4 (Pos Pengamatan Merapi)**: Gerbang `l2_gate_volcano_prep` bersama Komandan Satria.
2. **Pohon Percakapan Ramah Khusus NPC Unlocked (*Unlocked Congratulatory Dialogue Trees*)**:
   - Di [`dialogueDataL2.ts`](./src/app/Level2/dialogueDataL2.ts), ditambahkan/diaktifkan percakapan khusus saat gerbang telah terbuka tanpa ada pilihan pemicu TTS:
     - **Kak Fajar** (`kak_fajar_unlocked_dialogue`): *"Luar biasa, Penjelajah! Kamu sudah berhasil menyelesaikan evaluasi Teka-Teki Silang Kesiapsiagaan Gempa ini. Pintu menuju Ruang Simulasi Gempa (Area 2) di sebelah kanan sudah terbuka. Silakan lanjut ke area selanjutnya!"*
     - **Komandan Satria Area 3** (`satria_field_unlocked_dialogue`): *"Kerja kepemimpinan yang hebat, Rekan Siswa! Kamu sudah berhasil menyelesaikan evaluasi Teka-Teki Silang Mitigasi Pascabencana ini. Gerbang evakuasi menuju Pos Pengamatan Merapi (Area 4) di sebelah kanan sudah dibuka. Silakan lanjut ke area selanjutnya!"*
     - **Komandan Satria Area 4** (`satria_volcano_unlocked_dialogue`): *"Analisis yang sangat tajam, Taruna! Kamu sudah berhasil menyelesaikan evaluasi Teka-Teki Silang Kesiapsiagaan Erupsi Merapi ini. Gerbang jalur menuju Simulasi Tanggap Erupsi Merapi (Area 5) di sebelah kanan sudah dibuka. Silakan lanjut ke area selanjutnya!"*
3. **Routing Dialog NPC Terpusat (`getNpcDialogueTreeL2`)**:
   - Dibuat fungsi terpusat [`getNpcDialogueTreeL2`](./src/app/Level2/engine/gameEngine.ts) yang mengevaluasi status pembukaan gerbang dan kelengkapan materi sebelum menyajikan pohon dialog ke pemain.
   - Digunakan secara konsisten baik saat pemain menekan tombol keyboard `[E]`, menekan tombol sentuh mobile `AKSI [E]`, maupun saat mengetuk/mengeklik sprite NPC di kanvas layar game.
4. **Proteksi Multi-Layer pada Komponen dan Engine**:
   - Menambahkan pengaman `isCurrentGateUnlocked()` di [`TectonicGame.tsx`](./src/app/Level2/engine/TectonicGame.tsx).
   - Memblokir `pendingCrossword` dari engine, memblokir pemicu dialog `onTriggerCrossword`, serta memagari rendering `<CrosswordModal />` dengan `{showCrossword && !isCurrentGateUnlocked() && (...)}`.
   - Objek `challenge_gate` di engine secara otomatis mengonfirmasi kelulusan: *"Kamu sudah menyelesaikan evaluasi ini! Silakan lanjut ke area selanjutnya"*.

---

## 57. Implementasi Area 6 Level 2: Pascabencana Erupsi Merapi (Barak Pengungsian Terpadu, Penanganan Abu Vulkanik, Sanitasi Posko Medis, Bahaya Sekunder Lahar Dingin, Evaluasi TTS Akhir & Kapsul Evakuasi Penuntas Level 2)

Sesuai permintaan pengguna dan silabus resmi Buku Saku Bencana BNPB, telah diimplementasikan zona pemungkas Level 2 yakni **Area 6: Pascabencana Erupsi (Barak Pengungsian & Pemulihan Bahaya Sekunder)** di lokasi *Barak Pengungsian Terpadu / Shelter Siaga Bencana (Zona Aman KRB I / Dataran Rendah)*:

1. **Konsep Wilayah, Lanskap & Atmosfer Visual Dataran Rendah (*Shelter & Safe Zone Atmosphere*)**:
   - **Lokasi & Nuansa**: Menggambarkan kompleks pengungsian resmi terpadu di dataran rendah KRB I (seperti Barak Gayam / Purwobinangun) yang aman (>20 km dari puncak Merapi).
   - **Gradien Langit Harapan & Puncak Merapi Jauh**: Langit cerah fajar fajar keemasan membawa harapan (`#1e3a8a` menuju `#38bdf8` dan `#fef08a`), siluet puncak Gunung Merapi terlihat kecil dan tenang di kejauhan dengan kepulan uap putih tipis yang telah mereda, serta perbukitan hijau dataran rendah dengan pohon kelapa dan pisang tropis.
   - **Struktur Realistis di Dunia Game**:
     - *Gapura Masuk & Spanduk Resmi*: Spanduk besar `"BARAK PENGUNGSIAN TERPADU - ZONA AMAN KRB I (DATARAN RENDAH)"`.
     - *Tenda Pleton Oranye BPBD (`x: 360-520`)*: Tenda bivak komando besar berwarna oranye khas BPBD lengkap dengan tali pancang pasak tanah, karung pasir pelindung, palet kayu, dan tumpukan matras tidur.
     - *Tandon Air Bersih Stainless & Pos Cuci Mata (`x: 620-700`)*: Silinder tangki stainless steel tertutup rapat berpengunci (mencegah kontaminasi gas belerang/asam dari udara), keran air mengalir steril, dan bak bilas mata darurat (*eye-wash station*) berlabel `"AIR STERIL TERTUTUP"`.
     - *Posko Medis PMI (`x: 880-1040`)*: Tenda rumah sakit lapangan putih bersih dengan lambang Palang Merah Indonesia besar di atap dan dinding, tabung oksigen medis hijau dengan manometer, kotak pasokan masker N95, serta tandu darurat.
     - *Dapur Umum Tagana (`x: 1300-1460`)*: Tenda biru Kementerian Sosial / Tagana, kuali besar memasak sup hangat di atas kompor gas berapi biru-kuning, asap masakan mengepul, dan karung logistik sembako Beras BULOG.
     - *Rumah Warga Beratap Abu Tebal (`x: 1650-1840`)*: Rumah warga dataran rendah dengan atap genteng tertutup endapan abu vulkanik tebal abu-abu (`#64748b`), tangga bambu bersandar di atap untuk gotong royong pembersihan atap (mencegah atap runtuh akibat beban berat abu >1.500 kg/m³), sapu lidi, sekop, serta rambu peringatan kuning `"JALAN LICIN BERABU - KURANGI KECEPATAN!"`.
     - *Sempadan Sungai & Rambu Bahaya Lahar Dingin (`x: 1880-1940`)*: Tiang belang loreng kuning-hitam dengan papan peringatan resmi segitiga bahaya lahar BNPB `"AWAS LAHAR HUJAN DARI HULU MERAPI - JAUHI BANTARAN SUNGAI SAAT HUJAN LEBAT"` dan sensor EWS (*Early Warning System*) lahar dengan sirine strobo.
     - *Kapsul Evakuasi Kemenangan Akhir RESQ-BOX (`x: 2130`)*: Wahana kapsul futuristik berbalut paduan titanium emas dan putih, kanopi kokpit kaca cyan beranimasi, tangga landas (*boarding ramp*) dengan running LED lights, tiang antena beacon berputar, cincin partikel energi emas, dan floating badge interaktif.

2. **NPC Berkarakter & Integrasi Storyline Dialog**:
   - **Resqy (`px: 140`)**: Menyapa taruna setibanya di barak pengungsian dan memberikan briefing bahwa proses penanganan bencana berlanjut ke pemulihan pascabencana dan mitigasi bahaya sekunder.
   - **Koordinator Shelter BPBD (Bu Dini) (`px: 460`)**: Menjelaskan tata tertib barak pengungsian, pendataan logistik, serta aksi gotong royong membersihkan atap rumah dari timbunan abu vulkanik tebal untuk mencegah atap runtuh, sekaligus larangan berkendara kencang di jalan berabu (licin dan merusak silinder mesin). Memicu Temuan 1 (`disc-post-ash`).
   - **Dani (`px: 740`)**: Murid SMP yang berhasil dievakuasi dari Dusun Destana di Area 5, berterima kasih kepada pemain dan menceritakan pengalamannya mengenakan masker N95 dengan benar.
   - **Petugas Medis PMI (dr. Alisa) (`px: 980`)**: Mengedukasi struktur kristal silika mikroskopis abu vulkanik yang tajam seperti pecahan kaca bagi alveolus paru-paru (memicu ISPA / silikosis), panduan membilas mata dengan air mengalir (dilarang mengucek), dan sanitasi tandon air minum tertutup. Memicu Temuan 2 (`disc-post-sanitation`).
   - **Mbah Joyo (`px: 1240`)**: Sesepuh dusun yang duduk tenang di teras barak pengungsian, bersyukur seluruh sanak keluarga selamat berkat kedisiplinan evakuasi dini saat status Awas diumumkan.
   - **Relawan Tagana (Pak Slamet) (`px: 1440`)**: Menjelaskan operasional dapur umum dan mengedukasi ancaman bahaya sekunder banjir lahar hujan/lahar dingin di alur sungai-sungai berhulu Merapi saat hujan lebat turun di puncak gunung, serta pentingnya sirine EWS lahar. Memicu Temuan 3 (`disc-post-lahar`).
   - **Komandan Satria (`px: 1980`)**: Bertindak sebagai penjaga evaluasi gerbang akhir TTS. Memeriksa apakah pemain sudah membaca dan memahami ketiga modul materi pascabencana (Bu Dini, dr. Alisa, Pak Slamet). Setelah materi tuntas, memberikan tantangan Teka-Teki Silang evaluasi akhir.

3. **Teka-Teki Silang (TTS) Pascabencana Erupsi Merapi (`CLUES_AREA_6`)**:
   - Didesain dengan persilangan matriks huruf 100% konsisten matematis (Grid 6 Baris × 7 Kolom) dengan kosakata ramah anak SMP kelas 8 yang murni berakar pada materi edukasi BNPB tanpa membocorkan jawaban langsung di percakapan NPC:
     - **1 Mendatar**: `BARAK` (Baris 1, Kolom 1..5) — Tempat penampungan pengungsian terpadu yang aman bagi warga terdampak erupsi, dilengkapi posko medis dan logistik.
     - **2 Menurun**: `ATAP` (Baris 1..4, Kolom 2) — Bagian bangunan rumah yang wajib dibersihkan dari timbunan abu vulkanik tebal secara gotong royong agar tidak ambruk akibat beban berat.
     - **3 Mendatar**: `LAHAR` (Baris 3, Kolom 1..5) — Aliran banjir material vulkanik bercampur air hujan di sungai-sungai yang berhulu di puncak Merapi.
     - **4 Menurun**: `AMAN` (Baris 1..4, Kolom 4) — Kondisi kawasan KRB I atau shelter pengungsian resmi yang berada di luar jangkauan bahaya primer erupsi.
   - Perpotongan huruf teruji presisi: `(1,2) = 'A'`, `(3,2) = 'A'`, `(1,4) = 'A'`, `(3,4) = 'A'`.

4. **Kapsul Evakuasi Kemenangan Akhir & Penuntasan Level 2 (100%)**:
   - Setelah pemain berhasil menyelesaikan TTS evaluasi pascabencana, gerbang `l2_gate_shelter_recovery` terbuka secara permanen.
   - Komandan Satria memberikan selamat dan mengaktifkan Kapsul Evakuasi Akhir RESQ-BOX (`l2_portal_finish_level2`) di `x: 2130`.
   - Pemain mendekati kapsul dan menekan tombol `[E]` / `AKSI` untuk menaiki kapsul:
     - Memicu status `isAreaCompleted = true`.
     - Menyinkronkan progres ke Supabase / Teacher Dashboard dengan capaian **100 Poin XP**, 6 misi tuntas (`completedMissions: [1, 2, 3, 4, 5, 6]`), dan 6 lencana keahlian (*Disaster Analyst Master*).
     - Membuka akses rute ke **Level 3** (`useAuthStore.getState().unlockLevel(3)`).
     - Menampilkan modal kemenangan paripurna **TectonicVictoryModal** yang merayakan tuntasnya 6 area dari 2 klaster kebencanaan geologis (Mitigasi Gempa Bumi & Mitigasi Erupsi Merapi).

---

### 58. Pembaruan Realisme Asap Vulkanik, Efek Lingkungan Pasca-Erupsi Dusun Destana, & Transisi Otomatis Evakuasi ke Area 6

- **Tanggal Pelaksanaan**: 25 September 2026
- **Status Modul**: Selesai Penuh (`Production Ready`) & Teruji Bersih (`npm run build` 0 Error, 2.96s)
- **Komponen Kunci yang Terlibat**:
  - [`src/app/Level2/engine/renderer.ts`](./src/app/Level2/engine/renderer.ts)
  - [`src/app/Level2/engine/gameEngine.ts`](./src/app/Level2/engine/gameEngine.ts)
  - [`src/app/Level2/engine/TectonicGame.tsx`](./src/app/Level2/engine/TectonicGame.tsx)
  - [`src/app/Level2/dialogueDataL2.ts`](./src/app/Level2/dialogueDataL2.ts)
  - [`src/app/Level2/DiscoveryModal.tsx`](./src/app/Level2/DiscoveryModal.tsx)
  - [`src/app/Level1/EarthDive/DiscoveryModal.tsx`](./src/app/Level1/EarthDive/DiscoveryModal.tsx)
  - [`src/app/Level2/GunungMerapi.tsx`](./src/app/Level2/GunungMerapi.tsx)
  - [`src/app/Level2/GempaBumi.tsx`](./src/app/Level2/GempaBumi.tsx)
  - [`src/app/Level2/DisasterCityMap.tsx`](./src/app/Level2/DisasterCityMap.tsx)

#### Rincian Penyempurnaan & Fitur Baru:

1. **Mesin Simulasi Asap Vulkanik Ultra-Realistis (`drawRealisticVolcanicSmoke`)**:
   - **Eliminasi Bentuk Bulat Geometris**: Mengganti penggambaran lingkaran kaku (`ctx.arc`) dengan algoritma kontur poligon harmonik 10-titik bergelombang (*harmonic perturbed polygon*) dengan turbulensi fluida non-linear, rotasi dinamis (*rotSpeed*), ekspansi termal saat naik, dan liukan angin lereng.
   - **Gradasi Radial Lembut 5-Tahap**: Menggunakan *multi-stop radial gradient* dengan titik terluar ber-alpha `0` murni, sehingga tidak ada garis tepi lingkaran tajam. Partikel asap saling berbaur secara Gaussian membentuk kepulan kumuliform tebal (*cauliflower billows*).
   - **Dukungan Skala & Mode Warna Lintas Skenario**:
     - `'dark_ash'`: Kolom abu vulkanik pekat andesit-silika gelap dengan pendaran bara oranye/kuning kawah di dekat lubang erupsi.
     - `'post_eruption_distant'`: Kolom abu pasca-letusan lembut abu-abu slate di kejauhan dengan skala reduksi `0.58x` khusus Area 6.
     - `'white_steam'`: Uap solfatara/fumarol putih mutiara alami untuk status Waspada dan pos pengamatan.
   - **Penerapan Realistis pada Seluruh Modul SVG**:
     - Menambahkan filter turbulensi fraktal SVG (`<feTurbulence baseFrequency="0.05" numOctaves="4" />` + `<feDisplacementMap scale="7" />` + `<feGaussianBlur stdDeviation="2.2" />`) pada diagram penunjaman lempeng di Level 1 & Level 2 [`DiscoveryModal.tsx`](./src/app/Level2/DiscoveryModal.tsx), [`GunungMerapi.tsx`](./src/app/Level2/GunungMerapi.tsx), [`GempaBumi.tsx`](./src/app/Level2/GempaBumi.tsx), dan [`DisasterCityMap.tsx`](./src/app/Level2/DisasterCityMap.tsx).

2. **Transisi Otomatis Cepat Pasca Simulasi Mobil Evakuasi (Area 5 ➔ Area 6)**:
   - Sesuai masukan alur cerita, setelah cutscene mobil evakuasi melaju dan dialog apresiasi kemenangan Komandan Satria (`satria_sim_victory`) ditutup, sistem **secara otomatis langsung menteleportasikan pemain ke Area 6 (Barak Pengungsian Terpadu)** tanpa mengharuskan pemain berjalan manual menuju portal keluar.
   - Narasi pada node dialog `satria_vc_4` disesuaikan untuk menjelaskan bahwa rombongan evakuasi telah tiba dengan selamat di barak pengungsian resmi Zona Aman KRB I dataran rendah.

3. **Suasana Lingkungan Pasca-Letusan di Dusun Destana (Area 5 Post-Eruption State)**:
   - Ketika pemain kembali dari Area 6 menuju Area 5 melalui gerbang portal mundur (`x: 60`), sistem mendeteksi bahwa simulasi telah selesai (`state.unlockedGates.has('l2_gate_volcano_sim')`) dan langsung mengaktifkan status visual **Pasca-Erupsi**:
     - *Langit Kelabu Pekat Berasap*: Gradien twilight jelaga abu-abu gelap dengan pendaran debu vulkanik panas di kaki horizon.
     - *Kawah Merapi Terbelah*: Siluet puncak kawah membentuk kaldera patah dengan rekahan bara menyala dan kepulan kolom asap hitam tebal yang terus membubung tinggi ke angkasa.
     - *Hujan Abu Menerus*: Partikel serpihan abu vulkanik melayang turun terus-menerus membasahi pemukiman.
     - *Bangunan Roboh / Rusak Parah*:
       - **Balai Desa Destana (`x: 420`)**: Atap joglo amblas dan patah di bagian tengah karena beban abu tebal, balok kayu kasau mencuat patah, retakan hitam zig-zag di dinding semen, dan papan nama posko miring.
       - **Pos Ronda Kentongan (`x: 376`)**: Rangka tiang bambu miring 8 derajat, kentongan terbelah retak, dan tertimbun abu kelabu.
       - **Rumah Warga Lereng (`x: 860`)**: **Atap rumah roboh total** amblas ke bawah membentuk cekungan *inverted V*, mencerminkan secara langsung materi edukasi BNPB tentang bahaya atap rumah runtuh jika tertimbun abu vulkanik berat (>1.500 kg/m³). Pecahan genteng terracotta berserakan di tanah disertai label edukasi `"ATAP ROBOH - BEBAN ABU TEBAL"`.
     - *Vegetasi Terbakar & Mengering*: Rumpun pohon pinus lereng layu total (`wither = 1.0`), ranting meranggas, dan batang kayu menghitam tertutup abu.
     - *Tanah Tertimbun Abu*: Aspal dan rumput tertutup lapisan tebal endapan abu vulkanik (`#52525b`, `#3f3f46`) dengan gundukan abu di tepi jalan.

4. **Pengosongan Total NPC Dusun Pasca-Erupsi (Seluruh Warga Mengungsi ke Area 6)**:
   - Sesuai prinsip realisme naratif kebencanaan, ketika simulasi evakuasi selesai atau pemain kembali dari Area 6, Dusun Destana yang tertimpa hujan abu dan letusan Merapi **dikosongkan total dari seluruh karakter NPC** (`state.npcs.clear()` dan proteksi render ganda `!isArea5PostEruption`).
   - Warga (Pak Joko, Mbak Rina, Mbah Tejo, Bu Siti, Dani) dan Komandan Satria tidak lagi berdiri di dusun yang hancur karena semuanya telah dievakuasi ke Barak Pengungsian (Area 6).
   - Seluruh NPC warga dan tim BPBD akan otomatis dipulihkan kembali ke posisi awal (`createInitialNpcsL2(4)`) hanya jika pemain menekan tombol **`[🔄 ULANG SIMULASI]`** untuk mengulang latihan drill.
   - Pintu keluar timur Area 5 (`x: 2130`) kini dirender menggunakan gerbang resmi **Jalur Evakuasi BNPB (`drawVolcanoEvacuationExitGate`)** dengan rambu hijau reflektif penunjuk arah ke Barak KRB I dan lampu sirine siaga, menggantikan visual pintu ruang kelas.

5. **Tombol Replay Simulasi Evakuasi & Eliminasi Duplikasi HUD**:
   - Menata ulang HUD atas agar hanya menampilkan satu tombol replay yang elegan dan tematik: **`[🔄 ULANG SIMULASI]`** berlatar amber gelap di posisi tengah atas HUD Area 5, membersihkan tombol duplikat berwarna merah di pojok kiri atas.

6. **Penyelarasan Visual Area 6 dengan Gaya Area 5**:
   - *Gunung Merapi Proporsional Lebih Jauh*: Siluet Gunung Merapi di latar belakang Area 6 diganti dari kerucut segitiga polos menjadi **profil stratovolcano asimetris yang identik dengan Merapi di Area 5**, diskala `0.58x` dengan posisi puncak lebih rendah (`merapiPeakY = 138`) untuk mencerminkan jarak pandang >20 km di dataran rendah KRB I, lengkap dengan lembah alur lahar dan kepulan asap abu pasca-letusan.
   - *Pohon Pinus Bertingkat*: Mengganti pohon bulat lollipop di perbukitan Area 6 dengan **rumpun pohon pinus bertingkat 3-tier yang identik dengan pohon Area 5**, dalam balutan warna hijau segar alami dataran rendah.
   - *Medan Lantai Harmonis*: Mengganti dinding penahan beton trotoar polos dengan perpaduan rumput hijau lereng, jalur setapak aspal bersih shelter, bebatuan andesit, bunga tropis, karung pasir pengaman tenda, dan tumpukan abu hasil sapuan gotong royong warga.

---

### 59. Penyeragaman Tombol Replay Simulasi & Realisme Visual Pasca-Bencana Ruang Kelas Area 2

- **Tanggal Pelaksanaan**: 25 September 2026
- **Status Modul**: Selesai Penuh (`Production Ready`) & Teruji Bersih (`npm run build` 0 Error, 2.05s)
- **Komponen Kunci yang Terlibat**:
  - [`src/app/Level2/engine/TectonicGame.tsx`](./src/app/Level2/engine/TectonicGame.tsx)
  - [`src/app/Level2/engine/renderer.ts`](./src/app/Level2/engine/renderer.ts)
  - [`src/app/Level2/engine/gameEngine.ts`](./src/app/Level2/engine/gameEngine.ts)

#### Rincian Penyempurnaan & Fitur Baru:

1. **Penyeragaman Posisi & Gaya Tombol Replay Simulasi (`[↺ ULANG SIMULASI]`)**:
   - **Eliminasi Tombol Tengah HUD**: Menghapus tombol oval cokelat yang sebelumnya muncul di tengah atas layar pada Area 5.
   - **Konsistensi Navigasi Kiri Atas**: Tombol `[↺ ULANG SIMULASI]` kini diletakkan secara seragam di baris navigasi kiri atas berdampingan dengan `< MENU`, tombol audio, dan fullscreen pada kedua area simulasi (**Area 2: Simulasi Gempa Kelas** dan **Area 5: Simulasi Erupsi Merapi**).
   - **Gaya Visual Pixel Rose Elegan**: Menggunakan styling konsisten: latar `bg-rose-950 hover:bg-rose-900`, teks `text-rose-200`, bingkai border ganda `border-rose-600/80`, font `'Press Start 2P'`, ikon panah putar merah jambu menyala `<span className="text-rose-400 font-bold">↺</span>`, dan efek tekan 3D.

2. **Suasana Porak-Poranda Ruang Kelas Pasca-Gempa (Area 2 Post-Earthquake Devastation)**:
   - Ketika simulasi tanggap gempa telah selesai (`l2_gate_gempa_sim` terbuka atau fase simulasi telah tuntas) dan siswa kembali ke dalam ruang kelas (Area 2) setelah proses evakuasi ke lapangan (Area 3), ruang kelas tidak lagi rapi melainkan menampilkan dampak destruksi fisik gempa bumi yang nyata dan mendalam:
     - **Retakan Dinding Seismik Besar (`drawClassroomEarthquakeWallCracks`)**: Terdapat 14 jalur retakan struktural mayor menjalar dari plafon, sudut kusen jendela, hingga lis panel kayu bawah dengan inti retak gelap pekat (`#0f172a`), garis sorotan plester putih terkelupas, spalling plester kelabu rontok, dan cabang retakan sekunder.
     - **Plafon Akustik Ambrol & Menggantung**: 7 lubang void gelap plenum plafon akibat ubin yang terlepas, rangka hollow T-bar melintir, kabel listrik menjuntai turun, dan ubin gipsum menggantung miring tajam 35 derajat.
     - **Lampu Neon Gantung Rusak & Padam**: Seluruh lampu padam kelabu pekat, kabel sebelah putus menggantung miring dengan kaca lampu retak.
     - **Kaca Jendela Retak Laba-Laba**: Garis fraktur keselamatan diagonal retak laba-laba pada setiap jendela kaca ruang kelas.
     - **Papan Tulis & Baki Kapur Miring**: Baut braket atas papan tulis jebol sehingga papan miring, baki kapur retak, serta kapur tulis putih/kuning patah dan penghapus kayu jatuh berantakan di atas lantai keramik.
     - **Meja Guru Berantakan**: Meja guru bergeser dan miring, laci meja meluncur keluar terbuka, tempat pensil terguling, serta buku agenda nilai, buku paket, dan lembar kertas ujian berhamburan di lantai.
     - **Poster SOP & Jam Dinding Miring**: Paku poster SOP 3B dan denah jalur kelas copot sehingga posisi poster miring, serta jam dinding berputar miring dengan kaca retak dan jarum berhenti.
     - **Meja Murid Tergeser & Terdorong**: Seluruh meja belajar murid tergeser tidak beraturan dan sedikit terpuntir akibat gaya inersia guncangan seismik gempa.
     - **Kursi Murid Rebah Terbalik di Lantai**: Kursi belajar murid terdorong jauh ke koridor jalan dan sebagian besar terguling rebah miring 90 derajat mendatar di lantai dengan kaki-kaki mencuat ke samping.
     - **Buku & Lembar Ujian Berserakan**: Buku paket pelajaran aneka warna, buku catatan siswa, kertas ulangan putih, kotak pensil, dan bolpoin berceceran di lantai keramik di sela-sela meja.
     - **Lantai Keramik Retak & Penuh Puing**: Lantai keramik putih berubah kusam dengan noda debu semen/gipsum, nat ubin retak pecah rompal, dan bongkahan puing reruntuhan beton/gipsum berserakan di lantai.

3. **Pengosongan Total Karakter Murid & Guru Bu Rahma Pasca-Evakuasi**:
   - Sesuai prinsip kontinuitas narasi evakuasi, setelah aba-aba evakuasi selesai dan seluruh rombongan keluar ke lapangan terbuka, ruang kelas yang hancur **dikosongkan total dari seluruh NPC** (`state.npcs.clear()` dan proteksi `!isArea2PostQuake`).
   - Seluruh 16 murid dan Bu Rahma tidak lagi berada di dalam ruang kelas karena telah berkumpul dengan selamat di Lapangan Evakuasi (Area 3).
   - Menekan tombol **`[↺ ULANG SIMULASI]`** di pojok kiri atas seketika memulihkan kembali seluruh 16 murid, Bu Rahma, dan Resqy secara tertib di meja masing-masing dalam kondisi kelas yang bersih dan rapi untuk mengulang latihan kesiapsiagaan dari awal.

---

## 60. Harmonisasi Jumlah Total Kristal Level 2 Menjadi 21/21 & Eliminasi Overflow Indikator HUD

### Tanggal: 25 September 2026
- **Status Modul**: Selesai Penuh (`Production Ready`) & Teruji Bersih (`npm run build` 0 Error, 1.98s)
- **Komponen Kunci yang Terlibat**:
  - [`src/app/Level2/engine/zones.ts`](./src/app/Level2/engine/zones.ts)
  - [`src/app/Level2/engine/TectonicGame.tsx`](./src/app/Level2/engine/TectonicGame.tsx)
  - [`src/app/Level2/engine/gameEngine.ts`](./src/app/Level2/engine/gameEngine.ts)
  - [`src/app/Level2/level2Sync.ts`](./src/app/Level2/level2Sync.ts)
  - [`src/app/Level2/TectonicVictoryModal.tsx`](./src/app/Level2/TectonicVictoryModal.tsx)
  - [`src/app/TeacherDashboard/index.tsx`](./src/app/TeacherDashboard/index.tsx)

#### Rincian Penyempurnaan:

1. **Penyebab Isu Indikator Overflow (`21/18`)**:
   - Pemain sebelumnya mengamati indikator kristal di HUD Telemetry Level 2 menampilkan teks `💎 KRISTAL 21/18` di mana jumlah kristal yang terkumpul (21) melampaui penyebut total kristal (18).
   - Hal ini disebabkan oleh total kristal Level 2 sebelumnya belum didefinisikan secara resmi sebesar 21 (masih berpatokan pada 18 kristal bawaan, yakni 3 kristal di setiap 6 area), sementara set `collectedCrystals` akun pemain di `localStorage` telah mengumpulkan 21 entri ID kristal.

2. **Harmonisasi Total Kristal Resmi Menjadi 21 (`TOTAL_CRYSTALS_L2 = 21`)**:
   - Sesuai arahan pengguna (*"dibikin 21/21 gitu"*), total kristal resmi di Level 2 kini ditetapkan menjadi **21 kristal**.
   - Menambahkan 3 kristal baru yang ditempatkan secara ergonomis dan alami di 3 zona penjelajahan Level 2:
     - **Area 1 (Ruang Kelas Mitigasi)**: Kristal ke-4 (`l2_q_crystal_4`) di `px: 420, py: 310` (di dekat meja guru & tas siaga bencana).
     - **Area 3 (Lapangan Evakuasi)**: Kristal ke-4 (`l2_f_crystal_4`) di `px: 840, py: 310` (di tengah lapangan evakuasi terbuka antara tenda P3K dan rambu titik kumpul).
     - **Area 6 (Barak Pengungsian & Pemulihan)**: Kristal ke-4 (`l2_s6_crystal_4`) di `px: 1850, py: 310` (di kawasan pemukiman warga beratap abu & jalur evakuasi aman lahar dingin).
   - Distribusi total kristal per area kini lengkap: 4 (Area 1) + 3 (Area 2) + 4 (Area 3) + 3 (Area 4) + 3 (Area 5) + 4 (Area 6) = **21 Kristal**.

3. **Perlindungan Klem Anti-Overflow (*Defensive Clamping*)**:
   - Pada [`TectonicGame.tsx`](./src/app/Level2/engine/TectonicGame.tsx), nilai `collectedCount` dan prop `crystalsCount` yang dikirim ke [`TelemetryHUD.tsx`](./src/app/Level1/EarthDive/TelemetryHUD.tsx) dipagari dengan proteksi `Math.min(totalCrystals, ...)` sehingga nilai yang ditampilkan **tidak akan pernah melebihi 21** (`21/21`).
   - Pada [`gameEngine.ts`](./src/app/Level2/engine/gameEngine.ts), proses penyimpanan (`saveLevel2Progress`) dan pemuatan awal (`createInitialGameStateL2`) memotong (*slice*) array `collectedCrystals` maksimal 21 elemen.
   - Pada [`TectonicVictoryModal.tsx`](./src/app/Level2/TectonicVictoryModal.tsx), teks pencapaian diproteksi dengan `Math.min(totalCrystals, collectedCrystals)}/{totalCrystals} Kristal Mitigasi`.

4. **Pembaruan Supabase Sync & Dashboard Guru**:
   - Di [`level2Sync.ts`](./src/app/Level2/level2Sync.ts), payload detail menyertakan jumlah kristal terkurasi `crystals: Math.min(21, collectedCount)`.
   - Di [`TeacherDashboard/index.tsx`](./src/app/TeacherDashboard/index.tsx), indikator detail submission siswa diselaraskan dari `/ 9 Kristal` menjadi `sub2.details.crystals / 21 Kristal`.

---

## 61. Penskalaan Parameter Getaran Seismik, Pengurangan Material Runtuh & Konfigurasi Tuning Gempa Mandiri

### Tanggal: 27 September 2026
- **Status Modul**: Selesai Penuh (`Production Ready`) & Teruji Bersih (`npm run build` 0 Error, 2.69s)
- **Komponen Kunci yang Terlibat**:
  - [`src/app/Level2/engine/gameEngine.ts`](./src/app/Level2/engine/gameEngine.ts)
  - [`src/app/Level2/engine/renderer.ts`](./src/app/Level2/engine/renderer.ts)

#### Rincian Penyempurnaan:

1. **Konfigurasi Terpusat Tuning Gempa Bumi (`EARTHQUAKE_TUNING`)**:
   - Menghadirkan objek konfigurasi terpusat pada [`gameEngine.ts`](./src/app/Level2/engine/gameEngine.ts) agar guru, pengembang, maupun penguji dapat mengatur intensitas getaran gempa sedang dan gempa besar secara mandiri tanpa harus menelusuri ratusan baris kode:
   ```typescript
   export const EARTHQUAKE_TUNING = {
     // Pengaturan Gempa Sedang (Tahap Awal / Peringatan)
     moderate: {
       shakeIntensityX: 1.8,
       shakeIntensityY: 1.4,
       shakeFrequency: 0.12,
     },
     // Pengaturan Gempa Besar (Tahap QTE & Tanggap Darurat)
     severe: {
       shakeIntensityX: 3.2, // Dikecilkan dari nilai ekstrem sebelumnya (6.0+) agar nyaman dipandang
       shakeIntensityY: 2.4,
       shakeFrequency: 0.22,
       // Jumlah maksimal material/puing yang jatuh di layar sekaligus
       maxDebris: 8,
       // Jeda antar material yang jatuh (dalam frame)
       debrisInterval: 60,
     },
   };
   ```
2. **Pengecilan Guncangan Gempa Besar (Comfort & Readability)**:
   - Nilai amplitudo getaran gempa besar sebelumnya terlalu ekstrem dan mengaburkan pandangan pemain saat mencoba berinteraksi dengan tombol QTE.
   - Amplitudo diturunkan menjadi `3.2px` horizontal dan `2.4px` vertikal dengan osilasi harmonik terkendali sehingga efek gempa tetap terasa darurat namun tetap nyaman di mata siswa.
3. **Pengurangan Material & Puing Plafon Reruntuhan**:
   - Jumlah maksimal puing/material plafon yang jatuh serentak dibatasi menjadi `maxDebris: 8` (dari sebelumnya puluhan partikel yang memenuhi layar).
   - Jeda waktu antar jatuhnya material (`debrisInterval`) disesuaikan menjadi `60 frame` (~1 detik per material), memberikan ritme runtuhan yang dramatis dan realistis tanpa mengorbankan performa render kanvas.

---

## 62. Penyempurnaan Area 3 & Area 4: Proporsi Pintu, Redesain Gerbang Lapangan Sederhana, Papan 4 Status Merapi Bebas Overflow, dan Modernisasi Font "Plus Jakarta Sans"

### Tanggal: 27 September 2026
- **Status Modul**: Selesai Penuh (`Production Ready`) & Teruji Bersih (`npm run build` 0 Error, 2.69s)
- **Komponen Kunci yang Terlibat**:
  - [`src/app/Level2/engine/renderer.ts`](./src/app/Level2/engine/renderer.ts)
  - [`src/app/Level2/DiscoveryModal.tsx`](./src/app/Level2/DiscoveryModal.tsx)
  - [`src/app/Level2/level2Data.ts`](./src/app/Level2/level2Data.ts)

#### Rincian Penyempurnaan:

1. **Koreksi Proporsi Pintu Masuk Area 3 (`drawAssemblyFieldBackDoor`)**:
   - Pintu awal Area 3 (pintu koridor kelas keluar ke lapangan evakuasi) sebelumnya berukuran terlalu jangkung sehingga bagian atas kosen pintunya menabrak dan menutupi jendela kaca gedung sekolah di latar belakang.
   - Ketinggian pintu diturunkan dan diproporsionalkan menjadi `46px` tinggi dengan kanopi atas yang sejajar di bawah lis jendela kaca, sehingga jendela gedung sekolah tampak utuh dan rapi.
2. **Redesain Gerbang Keluar Lapangan Area 3 Menuju Lereng Merapi (`drawAssemblyFieldExitGate`)**:
   - Menggantikan visual pintu konvensional menjadi **Gerbang Lapangan Terbuka Sederhana** (*simple field boundary gate*): sepasang tiang pipa besi abu-abu kokoh, palang kayu pagar ganda, dan engsel baja minimalis tanpa ornamen fantasi berlebihan.
   - Papan nama petunjuk gerbang (`POS MERAPI` / `GERBANG TERKUNCI`) diperlebar menjadi `76px` dan tipografi distandarisasi menggunakan `bold 9.5px "Plus Jakarta Sans", sans-serif`, menjamin seluruh teks muat secara elegan di dalam kotak papan nama dengan margin samping yang lega (anti-overflow).
3. **Penyempurnaan Area 4 (Lereng Merapi & Prabencana)**:
   - **Gerbang Masuk Area 4 (`drawMerapiBackGate`)**: Papan nama petunjuk arah diperlebar menjadi `132px` dengan font `bold 9.5px "Plus Jakarta Sans", sans-serif` sehingga tulisan `KE AREA SEBELUMNYA` muat rapi dengan jarak tepi yang proporsional.
   - **Papan Peringatan 4 Status Merapi PVMBG (`drawMerapiStatusBoard`)**: Dimensi papan diperbesar menjadi `182x94px`, ukuran kartu level I–IV diperlebar ke `40x55px`, ukuran angka Romawi dinaikkan ke `15px`, dan label status `NORMAL`, `WASPADA`, `SIAGA`, `AWAS` menggunakan font tebal `8px` dengan jarak margin bawah `12px`. Menghilangkan tampilan teks yang sebelumnya sangat mepet ke batas garis kotak.
   - **Plang Pos Pengamatan PGA & Posko Destana**: Banner papan nama gedung pos pengamatan gunung api diperbesar dan dibalut font modern sans-serif yang tajam dan mudah dibaca dari kejauhan.
4. **Peringkasan & Pembesaran Font Modal Temuan Sains Area 3 & Area 4 (`DiscoveryModal.tsx` & `level2Data.ts`)**:
   - Materi edukasi (Temuan 1: Protokol Lapangan Evakuasi, Temuan 2: Triase Medis, Temuan 3: 4 Status PVMBG, Temuan 4: Zonasi KRB & APD) diringkas menjadi poin-poin intisari ramah anak SMP.
   - Ukuran font isi deskripsi, kartu APD, dan label ditingkatkan agar terbaca jelas tanpa terpotong di bagian bawah (*no bottom clipping*).

---

## 63. Overhaul Alur Simulasi Gempa Area 2: Pacing Tremor 1 Detik Pra-Alert, Kurikulum IPA Struktur Lapisan Bumi, dan Retakan Dinding Atas Halus Area 2 & Area 3

### Tanggal: 27 September 2026
- **Status Modul**: Selesai Penuh (`Production Ready`) & Teruji Bersih (`npm run build` 0 Error, 2.69s)
- **Komponen Kunci yang Terlibat**:
  - [`src/app/Level2/dialogueDataL2.ts`](./src/app/Level2/dialogueDataL2.ts)
  - [`src/app/Level2/engine/gameEngine.ts`](./src/app/Level2/engine/gameEngine.ts)
  - [`src/app/Level2/engine/renderer.ts`](./src/app/Level2/engine/renderer.ts)
  - [`src/app/Level2/level2Data.ts`](./src/app/Level2/level2Data.ts)

#### Rincian Penyempurnaan:

1. **Reorientasi Materi Kelas Bu Rahma Menjadi IPA: Struktur Lapisan Bumi**:
   - Mengubah materi ajar yang disampaikan oleh Bu Rahma di depan kelas pada fase awal simulasi dari materi Matematika (teorema Pythagoras) menjadi **Materi IPA SMP Kelas 8: Struktur Lapisan Bumi**:
     - *Papan Tulis Ruang Kelas*: Judul diperbarui menjadi `IPA: STRUKTUR BUMI` lengkap dengan ilustrasi skematis lingkaran konsentris penampang bumi (Kerak Bumi, Mantel Panas, Inti Luar Cair, dan Inti Dalam Padat) serta keterangan lempeng tektonik.
     - *Naskah Percakapan Guru (`dialogueDataL2.ts`)*: Node `intro_start` dan `bu_rahma_teaching_cutscene` diperbarui untuk menjelaskan bahwa lapisan kerak bumi tempat kita berpijak tersusun atas lempeng-lempeng tektonik yang terus bergerak di atas mantel bumi yang panas.
2. **Pacing Realistis Tanggap Bencana (Tremor 1 Detik Pra-Alert Guru)**:
   - Sesuai prinsip realisme kebencanaan, gempa bumi tidak diawali dengan teriakan manusia melainkan gelombang primer (P-wave) yang menggetarkan bumi secara tiba-tiba:
     - Ketika sesi penjelasan materi selesai, sistem memasuki fase **`quake_start`** selama **60 tick (~1 detik)**.
     - Layar mulai bergetar halus (`shake`), audio gemuruh seismik berbunyi, dan sedikit debu plafon mulai rontok sementara Bu Rahma dan murid terkejut.
     - Setelah jeda 1 detik tersebut, Bu Rahma baru bereaksi secara panik dan berteriak *"Anak-anak, ada gempa bumi berguncang! Semua bersiap...!"* (`bu_rahma_quake_alert`).
     - Dialog peringatan otomatis menyambung ke fase **`qte_cover`** (Drop, Cover, Hold On) di mana getaran gempa berlanjut ke intensitas besar.
3. **Retakan Dinding Gempa Halus & Terlokalisasi di Bagian Atas (Area 2 & Area 3)**:
   - **Area 2 (Ruang Kelas Gempa Besar)**:
     - Retakan dinding seismik besar sebelumnya merata hingga ke lantai keramik dan tampak merusak seluruh bangunan sekolah.
     - Fungsi `drawClassroomEarthquakeWallCracks` ditulis ulang secara presisi: retakan dibuat berukuran kecil dan halus (*hairline cracks*, `lineWidth: 1.2px`), terlokalisasi secara ketat pada bagian atas dinding dekat plafon/balok struktur ($y \le 50\text{px}$).
     - Menghilangkan retakan vertikal panjang ke bawah, lubang dinding jebol, dan spalling plester lantai yang berlebihan sehingga estetika ruang kelas tetap terjaga rapi.
   - **Area 3 (Fasad Dinding Gedung Sekolah di Lapangan)**:
     - Retakan pada dinding luar sekolah di Lapangan Evakuasi diperkecil halus menjadi retakan rambut tipis yang dibatasi hanya pada bagian atas dinding dekat genteng/atap ($y = 114..150\text{px}$).
     - Dinding bagian bawah tetap bersih, mencerminkan dampak gempa dengan tingkat kerusakan struktural atas yang realistis tanpa kesan gedung roboh total.
4. **Penamaan Resmi Area 3**:
   - Di [`level2Data.ts`](./src/app/Level2/level2Data.ts), penamaan resmi Area 3 diselaraskan menjadi **`Lapangan Evakuasi Sekolah (Pasca Gempa Besar)`**.

---

## 64. Overhaul Lingkungan Lautan Penuh, Elevasi Lempeng Dasar Laut, Lapisan Mantel Magma, & Sekuens Dinamis (Gempa, Kenaikan Suhu, Ikan Panik & Tumbuhan Layu) di Batas Divergen (Level 1 Area 6)

### Tanggal: 27 September 2026
- **Status Modul**: Selesai Penuh (`Production Ready`) & Teruji Bersih (`npx tsc --noEmit` 0 Error)
- **Komponen Kunci yang Terlibat**:
  - [`src/app/Level1/EarthDive/engine/zones.ts`](./src/app/Level1/EarthDive/engine/zones.ts)
  - [`src/app/Level1/EarthDive/engine/sprites.ts`](./src/app/Level1/EarthDive/engine/sprites.ts)
  - [`src/app/Level1/EarthDive/engine/renderer.ts`](./src/app/Level1/EarthDive/engine/renderer.ts)
  - [`src/app/Level1/EarthDive/engine/gameEngine.ts`](./src/app/Level1/EarthDive/engine/gameEngine.ts)
  - [`src/utils/retroAudio.ts`](./src/utils/retroAudio.ts)

#### Rincian Penyempurnaan:

1. **Transformasi Lingkungan Menjadi Full Lautan (*Ocean Environment*)**:
   - Menghapus latar belakang langit senja daratan dan matahari bulat daratan pada Area 6 (Batas Divergen).
   - Menggantinya dengan gradasi air laut vertikal 6 lapis dari biru muda bercahaya di permukaan atas (`#0ea5e9` / `#38bdf8`) turun bertahap hingga biru gelap abisal samudra dalam (`#082f49` / `#020617`).
   - Dilengkapi gelombang permukaan berombak dinamis dengan buih putih (*surface foam crests*), bias sinar matahari bawah air (*sunbeam caustics*), dan aliran partikel gelembung laut yang mengapung ke atas.
2. **Elevasi Lempeng Dasar Laut & Posisi Lapisan Mantel Magma**:
   - Sesuai dengan sketsa referensi garis merah pertama pengguna, lempeng kerak samudra dinaikkan dari $Y \approx 360$ menjadi **$Y = 248$**.
   - Di bawah lempeng, ditambahkan **lapisan mantel astenosfer berisi magma membara** di bawah $Y = 408$ (sesuai garis merah bawah referensi).
   - Seluruh objek dunia (tangga naik `portal_up`, NPC peneliti, kristal geologi, dan tangga turun `portal_down`) diselaraskan ke elevasi baru lempeng tanpa melayang.
3. **Patahan Dalam & Magma Mengisi ~1/3 Rekahan**:
   - Celah rekahan patahan divergen diperdalam hingga menembus mantel bumi pada kedalaman $Y = 470$.
   - Magma cair berpendar dari mantel naik mengisi sekitar sepertiga kedalaman celah (tinggi permukaan magma $Y = 396$), menyisakan dua pertiga bagian atas sebagai jurang samudra menganga yang dramatis.
   - Magma dilengkapi pendaran panas bertingkat, letupan gelembung lava, cerobong hidrotermal (*black/white smokers*) dengan partikel mineral belerang, serta proses pendinginan bertahap menjadi kerak baru (*pillow basalt*).
4. **Sekuens Dinamis Multi-Fase (Gempa, Peningkatan Suhu, Ikan Panik & Tumbuhan Layu)**:
   - Dibuat state machine sekuensial yang terpicu saat memasuki area atau menekan tombol `ULANG ANIMASI`:
     - **Fase 1: Tenang (`calm`, ~1.2 detik)**: Ikan-ikan pixel art berenang damai melintasi air laut, dan vegetasi laut (rumput laut/alga) bergoyang hijau segar di atas lempeng.
     - **Fase 2: Gempa Seismik Awal (`quake`, ~1.5 detik)**: Terjadi guncangan seismik kuat (`divergentShake`) disertai efek suara gemuruh dalam bumi (`playEarthquakeRumble()`).
     - **Fase 3: Kenaikan Suhu Drastis (`temp_rise`, ~1.8 detik)**: Suhu air meningkat drastis sebagai tanda magma segera menerobos. Efek visual pembiasan panas termal muncul, kawanan ikan panik dan melesat cepat ke kiri/kanan menjauh dari pusat rekahan, dan tumbuhan laut layu mengkerut dari hijau subur (`#10b981`) menjadi cokelat layu gosong (`#451a03`) disertai uap gelembung panas mendidih.
     - **Fase 4: Pemekaran Divergen (`diverging`, ~4.5 detik)**: Lempeng tektonik dasar laut membelah ke kiri dan kanan, jurang terbuka, dan magma dari mantel menerobos naik mengisi sepertiga celah.
     - **Fase 5: Pembekuan Kerak Baru (`cooling`)**: Magma cair perlahan mendingin dan membeku membentuk batuan basal padat yang aman dipijak pemain.
5. **Replayability Penuh via Tombol "ULANG ANIMASI"**:
   - Menghubungkan fungsi `triggerDivergentSimulation` agar mereset seluruh fase kembali ke `calm`, menghidupkan kembali kawanan ikan yang berenang damai, memulihkan tumbuhan hijau segar, dan memutar ulang keseluruhan sekuens visual edukatif yang spektakuler.

---

## 65. Kostum Penyelam Scuba (Pemain & 4 NPC), Pembekuan Magma di Tempat Tanpa Turun ke Bawah, Kerak Basal dengan Gradasi Termal Magma, dan Simetrisasi Penuh Lempeng Divergen (Level 1 Area 6)

### Tanggal: 27 September 2026
- **Status Modul**: Selesai Penuh (`Production Ready`) & Teruji Bersih (`npm run build` 0 Error, 1.80s)
- **Komponen Kunci yang Terlibat**:
  - [`src/utils/studentAvatarSheet.ts`](./src/utils/studentAvatarSheet.ts)
  - [`src/app/Level1/EarthDive/engine/npcSprites.ts`](./src/app/Level1/EarthDive/engine/npcSprites.ts)
  - [`src/app/Level1/EarthDive/engine/zones.ts`](./src/app/Level1/EarthDive/engine/zones.ts)
  - [`src/app/Level1/EarthDive/engine/sprites.ts`](./src/app/Level1/EarthDive/engine/sprites.ts)
  - [`src/app/Level1/EarthDive/engine/renderer.ts`](./src/app/Level1/EarthDive/engine/renderer.ts)
  - [`src/app/Level1/EarthDive/engine/gameEngine.ts`](./src/app/Level1/EarthDive/engine/gameEngine.ts)

#### Rincian Penyempurnaan:

1. **Perlengkapan Penyelam Scuba Profesional (Pemain & Seluruh 4 NPC di Area Lautan Divergen)**:
   - Sesuai dengan lingkungan bawah laut dalam di Batas Divergen (Level 1 Area 6), seluruh karakter diperbarui mengenakan setelan selam scuba lengkap:
     - **Karakter Pemain (`studentAvatarSheet.ts`)**:
       - Mengaktifkan mode lingkungan `envMode = 'diver'`.
       - *Wetsuit Neoprene*: Baju selam kedap air biru gelap-abu dengan tekstur panel insulasi dingin laut dalam.
       - *Masker Selam & Regulator*: Kacamata masker panorama dengan kaca visor cyan transparan berpendar (`rgba(6, 182, 212, 0.75)`), nose pocket silikon, dan corong regulator pernapasan (*mouthpiece*) yang terhubung rapi ke selang suplai udara.
       - *Tangki Oksigen Ganda*: Sepasang silinder tabung oksigen kuning cerah di punggung dengan keran katup manifold perak metalik dan sabuk harness pengikat dada.
       - *Sepatu Katak (Diving Fins)*: Kaki dilengkapi sirip selam fleksibel yang meliuk dinamis saat berjalan dan berenang.
     - **4 NPC Peneliti Selam (`npcSprites.ts`)**:
       - **Dr. Taufik**: Wetsuit biru laut gelap dengan aksen panel oranye ekspedisi, masker kaca selam kotak, regulator, dan tabung oksigen tunggal oranye.
       - **Prof. Maya**: Wetsuit ungu-violet dengan vest neoprene tahan tekanan tinggi, masker selam panorama, regulator ungu, dan tabung oksigen cyan.
       - **Prof. Ilham**: Wetsuit kuning-oranye khas peneliti vulkanologi bawah air, masker selam ganda, regulator kuning, dan tabung oksigen ganda baja.
       - **Komandan Satria**: Wetsuit taktis biru tua komando dengan sabuk beban selam pemberat, masker selam komando militer visor biru muda, regulator, dan tabung oksigen ganda baja abu-abu.
     - **Efek Gelembung Bernapas Bawah Laut (`renderer.ts`)**:
       - Pemain dan seluruh NPC secara periodik menghembuskan gelembung udara (*exhalation air bubbles*) dari mulut regulator yang meluncur perlahan ke atas permukaan air laut.

2. **Pembekuan Magma di Tempat Tanpa Turun Kembali ke Bawah (Revisi Geofisika Magma Divergen)**:
   - Pengguna mengoreksi alur animasi pendinginan sebelumnya yang keliru menarik fluida magma turun kembali ke kedalaman mantel ($Y = 365$) lalu menimpa daratan baru di atasnya.
   - Sesuai instruksi (*"magmanya jangan dibikin turun ke bawah terus nanti digantikan daratan baru gitu jangan, dibikin magmanya yang bener-bener membeku"*):
     - Di [`zones.ts`](./src/app/Level1/EarthDive/engine/zones.ts) pada fungsi `getDivergentMantleY`, logika yang menarik `centerMagmaY` turun kembali ke `baseM` saat `coolProgress > 0` dihapus total.
     - Magma yang telah membumbung mengisi celah rekahan lempeng di $Y = 326$ **tetap berada stabil di posisinya** sepanjang waktu, dan pembekuan terjadi secara fisik langsung pada badan magma tersebut.

3. **Pembentukan Kerak Basal Baru (*Pillow Basalt Crust*) dengan Gradasi Termal Magma di Bagian Bawah**:
   - Di [`sprites.ts`](./src/app/Level1/EarthDive/engine/sprites.ts), bagian atas magma di celah rekahan bertransformasi menjadi lempeng daratan basal samudra baru (*pillow basalt crust*) setebal $\approx 24\text{ px}$ (dari $Y = 326$ hingga $\approx 350$, tepat sesuai area garis merah referensi pengguna):
     - **Permukaan Atas ($Y = 326 - 336$)**: Batuan basal padat utuh pekat (`#0f172a` & `#1e293b`) dengan tekstur kubah bantal (*pillow basalt domes*), rekahan kontraksi pendinginan (*contraction cooling joints*), bintik mineral plagioklas/olivin, dan lis lantai pijakan yang aman dilalui pemain tanpa terkena damage lava.
     - **Bagian Bawah ($Y = 338 - 352$)**: Gradasi termal linier alami:
       - Stop 0.42: `#334155` (basal transisi abu-abu gelap).
       - Stop 0.60: `#450a0a` (kerak hangus merah membara).
       - Stop 0.74: `#7f1d1d` (merah crimson pijar panas).
       - Stop 0.85: `#ea580c` (jingga magma membara).
       - Stop 0.94: `#f97316` (pendar kuning-oranye).
       - Stop 1.00: `rgba(253, 224, 71, 0)` (100% transparan, menyatu sempurna ke magma mantel di bawahnya).
     - **Kontinuitas Fluida Mantel Bawah**: Di bawah $Y = 352$, magma mantel tetap aktif membara dengan arus konveksi kuning-oranye dan gelembung pijar, mewujudkan ilusi visual realistis di mana daratan atas telah membeku padat sementara bagian bawahnya masih menyatu dengan magma mantel yang mendidih.

4. **Penutupan Penuh Celah Magma Terbuka di Kaki Lereng Tebing Kiri & Kanan**:
   - Menghapus interpolasi transisi kurva di bawah lereng tebing barat dan timur yang sebelumnya memotong batuan lempeng sehingga sempat memperlihatkan celah magma kuning menyembul di kaki tebing.
   - Dasar lempeng barat dan timur kini terisi batuan padat utuh hingga ke kedalaman batas mantel ($\approx 365\text{ px}$) rapat menutupi lereng tanpa ada lubang magma terbuka.

5. **Simetrisasi Presisi Lempeng Barat & Timur Serta Penghapusan Tonjolan Batuan Bawah yang Menggantung**:
   - Pengguna mengamati adanya tonjolan batuan hitam gelap ekstra setebal $\approx 20\text{ px}$ di kaki lempeng kiri yang membuat celah tampak asimetris (karena formula gelombang acak `getMantleBoundaryY` di sisi barat kebetulan bergelombang lebih dalam ke $Y \approx 365\text{ px}$, sedangkan lempeng kanan berada di $Y \approx 346\text{ px}$).
   - Sesuai arahan pengguna (*"bisa ga itu bagian yang ku lingkarin itu dihapus aja biar simetris gitu antara lempeng kanan dan kiri"*):
     - Di [`zones.ts`](./src/app/Level1/EarthDive/engine/zones.ts) pada `getDivergentMantleY`, dasar lempeng barat di area rekahan kini **mencerminkan (*mirror*) bentuk dasar lempeng timur secara matematis presisi**:
       ```typescript
       const refEastX = Math.round(lavaRight - gap * 0.5);
       if (x <= lavaLeft) {
         const distFromRift = lavaLeft - x;
         const symBaseY = getMantleBoundaryY(refEastX + distFromRift);
         if (x >= 250) return symBaseY;
         // Bertransisi mulus ke profil alami lempeng barat di x < 250
         const blendT = Math.min(1, Math.max(0, (250 - x) / 100));
         const smoothT = (1 - Math.cos(blendT * Math.PI)) / 2;
         return Math.round(symBaseY * (1 - smoothT) + getMantleBoundaryY(x + gap * 0.5) * smoothT);
       }
       ```
     - Kedua lempeng kini bertemu dengan celah rekahan magma di elevasi dasar yang **sama persis ($Y = 346\text{ px}$)**.
     - Dinding tebing vertikal yang menyentuh magma di kedua sisi memiliki ketinggian yang identik ($20\text{ px}$, dari $Y = 326$ ke $346$).
     - Tonjolan bawah yang menggantung di lempeng kiri terhapus bersih, menjadikan lanskap pemekaran samudra simetris, megah, dan estetis.

---

## 66. Mode Renang 4 Arah (Batas Divergen), Karakter & NPC Penyelam Mengambang di Air, Penebalan Lempeng Samudra, Penipisan Lapisan Mantel, & Percepatan Pembekuan Magma (5 Detik)

### Tanggal: 28 September 2026
- **Status Modul**: Selesai Penuh (`Production Ready`) & Teruji Bersih (`npm run build` 0 Error, 2.08s)
- **Komponen Kunci yang Terlibat**:
  - [`src/app/Level1/EarthDive/engine/player.ts`](./src/app/Level1/EarthDive/engine/player.ts)
  - [`src/app/Level1/EarthDive/engine/npcManager.ts`](./src/app/Level1/EarthDive/engine/npcManager.ts)
  - [`src/app/Level1/EarthDive/engine/zones.ts`](./src/app/Level1/EarthDive/engine/zones.ts)
  - [`src/app/Level1/EarthDive/engine/sprites.ts`](./src/app/Level1/EarthDive/engine/sprites.ts)
  - [`src/app/Level1/EarthDive/engine/renderer.ts`](./src/app/Level1/EarthDive/engine/renderer.ts)
  - [`src/app/Level1/EarthDive/engine/gameEngine.ts`](./src/app/Level1/EarthDive/engine/gameEngine.ts)
  - [`src/app/Level1/EarthDive/EarthDiveGame.tsx`](./src/app/Level1/EarthDive/EarthDiveGame.tsx)

#### Rincian Penyempurnaan:

1. **🏊 Mode Renang & Menyelam 4 Arah Bebas di Bawah Laut (*4-Way Underwater Free Diving*)**:
   - Di [`player.ts`](./src/app/Level1/EarthDive/engine/player.ts), pada `zone.id === 'divergent'`, gravitasi platformer konvensional dinonaktifkan (`player.onGround = false`).
   - Sistem kontrol diubah menjadi kontrol pergerakan renang 4 arah fluida:
     - **Atas (`ArrowUp` / `KeyW` / Spasi / D-Pad Atas)**: Karakter berenang naik ke permukaan air laut (`vy = -2.8`).
     - **Bawah (`ArrowDown` / `KeyS` / D-Pad Bawah)**: Karakter menyelam turun ke kedalaman air laut (`vy = 2.8`).
     - **Kiri (`ArrowLeft` / `KeyA` / D-Pad Kiri)** & **Kanan (`ArrowRight` / `KeyD` / D-Pad Kanan)**: Karakter berenang meluncur horizontal di dalam air (`vx = ±3.2`).
     - **Water Buoyancy & Idle Bobbing**: Saat tidak ada tombol ditekan, karakter mengambang santai di kolom air dengan osilasi apung lembut (`Math.sin(Date.now() * 0.003) * 0.35`).
     - **Batas Air & Tabrakan Batuan**: Kepala dibatasi di dekat buih permukaan laut ($Y \ge 54$), dan kaki dibatasi di atas permukaan dasar laut ($Y \le \text{effectiveGround} - 4$), sehingga penyelam tidak dapat menembus atau tenggelam ke dalam batuan lempeng/magma.
     - **Animasi Renang Sirip Selam**: Saat bergerak 4 arah, `player.walkFrame` menggerakkan sirip katak fleksibel secara dinamis (*flutter kicks*); saat diam, menampilkan pose mengambang santai (frame 4) dengan efek miring aerodinamis (`swimTilt = ±0.16 rad`) di [`renderer.ts`](./src/app/Level1/EarthDive/engine/renderer.ts).

2. **🤿 Karakter & Seluruh NPC Peneliti Mengambang di Air (Zero Ground Contact)**:
   - Sesuai instruksi pengguna agar karakter dan seluruh NPC tidak menapak kaku di tanah melainkan mengambang di air laut:
     - Di [`npcManager.ts`](./src/app/Level1/EarthDive/engine/npcManager.ts), posisi Y seluruh 4 NPC (Dr. Taufik, Prof. Maya, Prof. Ilham, Komandan Satria) diatur melayang $\approx 42\text{ px}$ di atas dasar lempeng samudra dengan gerakan apung/bobbing lembut mandiri (`npc.y = baseGroundY - 42 + floatBob`).
     - Saat berpatroli, NPC meluncur horizontal dengan gaya renang di air dan berbalik menghadap pemain secara halus saat berada dalam jarak proksimitas interaksi.
     - Di [`zones.ts`](./src/app/Level1/EarthDive/engine/zones.ts) pada `snapObjectsToGround`, ketinggian NPC diselaraskan ke `surfaceY - 42`, dan posisi spawn pemain `playerSpawnY` disetel ke `195` (mengambang di kolom air).

3. **⏱️ Percepatan Pembekuan Magma Menjadi ~5 Detik (*5-Second Quick Freeze*)**:
   - Di [`gameEngine.ts`](./src/app/Level1/EarthDive/engine/gameEngine.ts), durasi fase `cooling` (setelah lempeng selesai membelah dan magma membual keluar dari mantel) dipangkas dari sebelumnya 14 detik menjadi tepat **~5 detik total (300 frame pada 60 FPS)**:
     - **~1.7 Detik Awal (100 frame)**: Magma membual aktif, mendidih dan mengepulkan uap hidrotermal ke air laut dingin.
     - **~3.3 Detik Berikutnya (180 frame)**: Magma mengalami pendinginan termal cepat (*thermal quenching*), bertransformasi menjadi kerak samudra baru (*pillow basalt*) yang membeku utuh di tempat pada $Y = 326$.

4. **🧱 Penebalan Lempeng Samudra & Penipisan Lapisan Mantel Magma**:
   - Pengguna mengamati lapisan mantel magma sebelumnya terlalu tebal dan memenuhi bagian bawah layar.
   - Sesuai arahan (*"lapisan lempengnya itu kamu tebelin lagi ke bawah dan lapisan mantelnya itu ditipisin lagi"*):
     - Di [`zones.ts`](./src/app/Level1/EarthDive/engine/zones.ts), batas mantel `getMantleBoundaryY` diturunkan dari baseline $Y = 365$ menjadi baseline **$Y = 428$** (amplitudo gelombang halus $\pm 14\text{ px}$, berkisar $Y = 416..440$).
     - **Ketebalan Lempeng Samudra Bertambah Signifikan**: Batuan lempeng dasar laut (sedimen, pillow basalt, sheeted dyke, gabbro) kini membentang tebal dari $Y = 248$ hingga $Y \approx 428$ ($\approx 180\text{ px}$ ketebalan batuan solid ke bawah).
     - **Penipisan Mantel Magma**: Lapisan mantel magma membara di dasar samudra kini hanya mengisi porsi tipis estetik setebal $\approx 52\text{ px}$ di bagian paling bawah kanvas ($Y = 428..480$).
     - Di [`sprites.ts`](./src/app/Level1/EarthDive/engine/sprites.ts), gradien linier mantel `moltenGrad` disesuaikan ($Y = 310..485$) agar pendaran panas kuning-oranye dan arus konveksi tetap berpendar estetik di lapisan mantel yang lebih tipis tersebut.

5. **🎮 Penyelarasan HUD Kontrol & Tombol Layar Sentuh**:
   - Di [`EarthDiveGame.tsx`](./src/app/Level1/EarthDive/EarthDiveGame.tsx), bilah petunjuk keyboard desktop di bawah layar pada Area 6 diselaraskan menjadi: `W A S D / Panah (Renang 4 Arah) • [Spasi] Renang Naik • [E] Interaksi`.
   - Tombol virtual sentuh (D-Pad & tombol aksi) diperbarui dengan label dan aksi: D-pad Atas/Bawah berenang naik/turun, dan tombol aksi biru berubah menjadi **`RENANG`** (berenang naik).

---

### Bab 67: Elevasi Pengisian Magma Sebatas Garis Merah ($Y = 372$) & Kontur Tekstur Lereng Miring Rekahan Sampai ke Bawah Tanpa Garis Vertikal (Batas Divergen)

**Tanggal:** 28 September 2026  
**Status:** Selesai & Terverifikasi Penuh (`npm run build` Lolos Bersih 0 Error)

#### Berkas yang Dimodifikasi:
- [`src/app/Level1/EarthDive/engine/zones.ts`](./src/app/Level1/EarthDive/engine/zones.ts)
- [`src/app/Level1/EarthDive/engine/sprites.ts`](./src/app/Level1/EarthDive/engine/sprites.ts)

#### Rincian Penyempurnaan:

1. **🔴 Elevasi Pengisian Magma Dibatasi Sebatas Garis Merah Referensi Pengguna ($Y = 372$)**:
   - Berdasarkan gambar referensi pengguna di mana garis merah horizontal ditarik di bagian tengah celah rekahan:
     - Di [`zones.ts`](./src/app/Level1/EarthDive/engine/zones.ts), ketinggian pengisian magma `floorY` diubah dari $Y = 326$ menjadi **$Y = 372$**.
     - Pada `getDivergentMantleY`, saat pemekaran terjadi ($p \ge 0.45$), magma membumbung naik dari mantel ($Y \approx 428$) tepat hingga menyentuh garis merah di **$Y = 372$**, tidak lagi membumbung berlebihan ke atas.
     - Di [`sprites.ts`](./src/app/Level1/EarthDive/engine/sprites.ts), pembentukan kerak basal baru (*pillow basalt*) di Layer 2C diselaraskan berada di **$Y = 372$** (dengan ketebalan $\approx 22\text{ px}$, menempati $Y = 372..394$, bergradasi termal halus menyatu ke magma mantel di bawahnya).
     - Hazard lava `zone.hazards` di [`zones.ts`](./src/app/Level1/EarthDive/engine/zones.ts) disesuaikan koordinat Y-nya menjadi `y: 370`.

2. **⛰️ Tekstur Tanah & Batuan Miring Diteruskan Penuh Sampai ke Bawah (Zero Vertical Cut / Tanpa Garis Lurus Vertikal)**:
   - Sesuai permintaan pengguna (*"tekstur tanah miring yang di retakannya itu dibikin sampe kebawah biar yang di bawah itu ga cuma garis kebawah doang"*):
     - Di [`zones.ts`](./src/app/Level1/EarthDive/engine/zones.ts), lereng ngarai patahan barat dan timur diperlebar proporsional (`slopeW = Math.min(38, Math.max(14, Math.round(gap * 0.35)))`).
     - Di `getDivergentTerrainElevation`, fungsi interpolasi lereng patahan mengalirkan undakan batuan bertingkat (`stepLedge`) secara kontinu dari bibir atas lempeng ($Y \approx 254$) melandai miring penuh tembus sampai ke dasar patahan di permukaan magma (**$Y = 372$**).
     - Fungsi `drawPlateSlice(x, true)` merender tekstur batuan miring (strata basal, gabbro, undakan batuan, bintik mineral) sepanjang seluruh kontur lereng dari bibir atas lempeng hingga menyentuh permukaan magma di $Y = 372$.
     - **Hasil Visual**: Mengeliminasi seluruh dinding vertikal 90° ("garis kebawah doang") dan menggantikannya dengan jurang ngarai patahan V-shape bertingkat alami yang megah dan bertekstur batuan kaya.

3. **✨ Eliminasi Total Artefak Taji/Segitiga Hitam di Dalam Celah Magma**:
   - Menghapus variabel `subSlope`, `baseLeft`, `baseRight`, serta loop irisan lempeng bawah yang sebelumnya keliru merender poligon batuan gelap menjorok ke dalam fluida magma.
   - Kolom magma di antara `lavaLeft` dan `lavaRight` kini 100% bersih, murni, dan membara terang (gradien putih, kuning cerah, oranye, dan merah mantel) tanpa ada artefak atau serpihan hitam yang mengotori aliran konveksi magma.

---

### Bab 68: Rombak Konsep Peta Batas Konvergen Level 1 (Area 7) Menjadi 2 Kondisi Terpisah: Daratan (Anak Krakatau & Bukit Lipatan) dan Lautan & Pantai (Palung Samudra)

**Tanggal:** 28 September 2026  
**Status:** Selesai & Terverifikasi Penuh (`npm run build` Lolos Bersih 0 Error)

#### Berkas yang Dimodifikasi:
- [`src/app/Level1/EarthDive/engine/zones.ts`](./src/app/Level1/EarthDive/engine/zones.ts)
- [`src/app/Level1/EarthDive/engine/sprites.ts`](./src/app/Level1/EarthDive/engine/sprites.ts)
- [`src/app/Level1/EarthDive/engine/renderer.ts`](./src/app/Level1/EarthDive/engine/renderer.ts)
- [`src/app/Level1/EarthDive/engine/gameEngine.ts`](./src/app/Level1/EarthDive/engine/gameEngine.ts)
- [`src/app/Level1/EarthDive/EarthDiveGame.tsx`](./src/app/Level1/EarthDive/EarthDiveGame.tsx)

#### Rincian Penyempurnaan:

1. **🔘 Tombol Switcher Mode di Top HUD (Standar Area Simulasi Gempa Level 2)**:
   - Sesuai permintaan pengguna (*"dibikin tombol aja gitu untuk memilih kondisinya, tombolnya diatas kayak tombol di area simulasi gempa di level 2 gitu"*):
     - Di [`EarthDiveGame.tsx`](./src/app/Level1/EarthDive/EarthDiveGame.tsx), saat pemain berada di Area 7 (Batas Konvergen / Zone index 6), bar kontrol khusus ditampilkan di HUD atas:
       - **Badge Label**: `KONDISI KONVERGEN:`
       - **Tombol Mode 1**: `⛰️ DARATAN (ANAK KRAKATAU)` (aktif: warna amber menyala, border amber, font bold pixel).
       - **Tombol Mode 2**: `🌊 LAUTAN & PANTAI (PALUNG)` (aktif: warna cyan menyala, border cyan, font bold pixel).
       - **Tombol Aksi**: `↺ ULANG` untuk memutar ulang sekuens tabrakan/penunjaman lempeng dari awal secara dinamis.
     - Saat tombol mode ditekan, fungsi `setConvergentMode(state, mode)` di [`gameEngine.ts`](./src/app/Level1/EarthDive/engine/gameEngine.ts) dipanggil: mereset progres simulasi ke 0, menghitung ulang profil ketinggian tanah (`updateConvergentGroundProfile`), me-reposisi pemain ke dermaga/lereng dengan aman (`snapObjectsToGround`), memainkan efek audio retro SFX, dan menyimpan preferensi mode ke `localStorage`.

2. **⛰️ Kondisi 1: Batas Konvergen Daratan (Sesuai Sketsa Gambar 1 & Garis Merah Pengguna)**:
   - **Kondisi Awal Lempeng Subduksi (Tanpa Sambungan Datar Horizontal)**:
     - Lempeng kiri membawa **Gunung Anak Krakatau** dan dari kondisi awal ($p = 0$) sudah menabrak dan langsung **menujam miring ke kanan bawah (~$46^\circ$, sudut $\Delta y / \Delta x = 1.05$)** ke dalam mantel astenosfer di bawah lempeng benua sebelah kanan, persis sesuai sketsa garis merah pengguna.
     - Lempeng benua sebelah kanan menumpang kokoh di atas lempeng menunjam (*overriding accretionary wedge*) dan membentuk garis kontak tektonik / suture yang jelas.
   - **Gunung Anak Krakatau Padat Utuh (100% Solid — Zero Background Transparency)**:
     - Seluruh kolom vertikal di bawah lereng dan puncak kawah Anak Krakatau ($Y = 215$) diisi padat 100% dengan lapisan batuan andesit keras, basal, gabro, dan litosfer lempeng pekat hingga menyatu dengan dasar lempeng/mantel, mengeliminasi celah kosong yang sebelumnya membuat langit dan pegunungan latar belakang tembus pandang di bawah gunung.
   - **Kawah Batuan Alami Bebas Magma**:
     - Menghapus danau magma pijar merah-oranye dan glow kawah; menggantinya dengan tebing kawah batuan andesit kasar, abu vulkanik gelap, dan kepulan uap solfatara/abu vulkanik alami yang meliuk naik ke angkasa.
   - **Animasi Gerakan Lempeng & Pembentukan Bukit Lipatan (*Fold Mountain*)**:
     - Lempeng kiri bergerak semakin menabrak dan menujam lebih dalam ke arah kanan bawah miring (`↘`).
     - Lempeng benua kanan bergerak menekan ke kiri (`←`), melipat batuan permukaan secara dinamis membentuk bukit lipatan berhutan pinus setinggi $115\text{ px}$ dengan kurva lipatan antiklin di dalam batuan.
   - **Anak Panah Vektor Arah Gerak**:
     - Lempeng kiri: Anak panah pixel tebal berpendar biru muda tepat di atas slab menunjam mengarah miring ke kanan bawah (`↘` sudut $46^\circ$) berlabel `↘ GERAK MENUNJAM`.
     - Lempeng kanan: Anak panah pixel tebal kuning mengarah mendatar ke kiri (`←` sudut $180^\circ$) berlabel `← GAYA KOMPRESI MENABRAK`.

3. **🌊 Kondisi 2: Batas Konvergen Lautan & Pantai (Sesuai Sketsa Gambar 2)**:
   - **Kondisi Awal**: Lempeng samudra di sebelah kiri membawa kolom perairan laut luas, menunjam ke bawah lempeng benua di sebelah kanan yang memiliki daratan pantai.
   - **Animasi Gerakan Lempeng & Pembentukan Palung Samudra (*Oceanic Trench*)**:
     - Lempeng samudra bergerak maju menunjam ke kanan bawah (`↘`).
     - Pada zona kontak tumbukan antara samudra dan pantai benua ($X = 360..530$), penunjaman semakin dalam menekuk kerak samudra membentuk celah ngarai laut dalam curam (*oceanic trench / palung*) yang bertambah dalam hingga $\approx 85\text{ px}$ di bawah dasar laut.
     - Lempeng benua di sebelah kanan memiliki garis pantai berpasir emas ($X = 510..570$) dengan dermaga kayu dan vegetasi pesisir pantai.
   - **Anak Panah Vektor Arah Gerak Beranimasi**:
     - Lempeng samudra: Anak panah cyan-biru berpendar tebal mengarah miring ke kanan bawah (`↘`) disertai label `↘ GERAK MENUNJAM`.
     - Lempeng benua pantai: Anak panah amber tebal mengarah ke kiri (`←`) disertai label `← LEMPENG BENUA`.

4. **⚙️ Penyelarasan Fisika, Renderer, & Kompatibilitas Sistem**:
   - `getConvergentTerrainElevation`: Menghitung elevasi tanah matematis terpisah untuk mode `'land'` dan `'ocean'`, menjamin pemain dan NPC dapat berjalan atau menapak dengan mulus tanpa terperosok ke rongga kosong.
   - `renderConvergentLandMode` & `renderConvergentOceanMode`: Modul terpisah di [`sprites.ts`](./src/app/Level1/EarthDive/engine/sprites.ts) untuk rendering visual kaya detail, partikel gesekan sesar (*suture collision sparks*), uap kawah Anak Krakatau, dan riak ombak pantai.
   - Perahu Riset Oseanografi (`drawResearchBoat`) di [`renderer.ts`](./src/app/Level1/EarthDive/engine/renderer.ts) hanya aktif pada Mode Lautan saat pemain berada di perairan ($X < 530$), sementara pada Mode Daratan pemain berjalan langsung di atas batuan kerak.
   - Lolos uji verifikasi kompilasi `npm run build` dengan status bersih 0 error.

5. **✨ Perapian Menyeluruh Estetika Visual 2D (Eliminasi Barcode Scanlines & Tebing Patahan Glitch)**:
   - **Eliminasi Barcode Scanlines**: Menghapus total perulangan `fillRect` 2px vertikal yang sebelumnya menyebabkan garis-garis tirai/barcode yang kasar pada lereng Anak Krakatau. Menggantinya dengan rendering berbasis path poligon kontinu solid yang mulus dan bersih.
   - **Eliminasi Tebing Curam 90° & Artefak Hitam**: Memperbaiki titik temu kedua lempeng di $X = 430$ sehingga lereng timur Anak Krakatau mendarat mulus sejajar di $Y = 345$ tepat menyatu dengan dataran lempeng benua, mengeliminasi tebing jurang vertikal dan artefak poligon hitam yang sebelumnya mencuat ke langit.
   - **Siluet Stratovolcano Alami**: Memperbarui kurva elevasi Anak Krakatau dengan kurva sinusoidal yang anggun, lereng landai di kaki gunung dan menanjak proporsional ke puncak kawah ($Y = 205$), dengan kawah andesit alami tanpa kotak hitam mengambang.
   - **Penampang Lempeng Subduksi Bersih & Rapi**: Slab penunjaman lempeng samudra tebal $75\text{ px}$ kini terlukis sebagai balok tektonik diagonal paralel mulus ($\theta = 38^\circ$) yang memotong rapi mantel astenosfer, dilengkapi garis strata internal dan panah vektor yang proporsional.

6. **🌋 Overhaul Lapisan Lempeng Geologis & Tekstur Terpadu Nyambung (Sesuai Sketsa Garis Merah Pengguna)**:
   - **Lempeng Kiri (Slab Menunjam Kontinu & 3 Lapisan Otentik)**:
     - Merombak geometri slab penunjaman menjadi poligon kontinu seragam (tebal $76\text{ px}$) dari daratan barat ($-800$) hingga menunjam miring ($36^\circ$) ke kedalaman mantel ($X = \text{contactX} + 340$).
     - Membagi slab menjadi 3 lapisan strata geologis bertekstur terpadu yang mengalir mulus melewati lekukan subduksi (*subduction hinge*):
       1. *Kerak Basalt / Sedimen Vulkanik Atas* (tebal $24\text{ px}$, `#2d3b49` $\to$ `#202b35`).
       2. *Kerak Gabro Menengah* (tebal $26\text{ px}$, `#1e2934` $\to$ `#141d25`).
       3. *Mantel Litosfer Peridotit Padat* (tebal $26\text{ px}$, `#10161c` $\to$ `#090d11`).
     - Garis strata batas lapisan dan batas Moho bawah dibuat tegas dan rapi, mengeliminasi potongan vertikal kaku dengan zona peleburan parsial organik (*Benioff melt zone*) di ujung slab dalam.
   - **Lempeng Benua Kanan (Bukit Lipatan Berstrata Nyambung)**:
     - Merealisasikan sketsa 2 garis merah pengguna di Bukit Lipatan:
       1. *Lapisan 1 (Sedimen & Batuan Metamorf Lipatan Atas)*: Terletak di kedalaman $0 \dots 36\text{ px}$ di bawah permukaan bukit, melengkung dinamis mengikuti kontur lipatan antiklin dengan mikro-strata lipatan bertingkat dan garis batas strata tegas (`#26201b` + highlight).
       2. *Lapisan 2 (Kerak Granit Benua Padat Bawah)*: Granit kristalin padat (`#3a322c` $\to$ `#1e1916`) dengan bintik mineral kuarsa/feldspar.
       3. *Batas Bawah Moho Benua*: Garis batas bawah tegas yang mengapung di atas mantel astenosfer, di mana bagian barat menumpang kokoh di atas slab menunjam sebagai prisma akresi, dan bagian timur memperlihatkan mantel bumi hangat di bawahnya.
   - **Tekstur Bersatu & Eliminasi Glitch Visual**:
     - *Mantel Astenosfer Global*: Satu fondasi mantel astenosfer mengalir dari barat hingga timur di bawah kedua lempeng dengan arus konveksi halus, menyatukan seluruh lanskap geologis.
     - *Eliminasi Garis Potong Kabut*: Menghapus artifak kotak kabut horizon biru muda di mode daratan (`convergentMode === 'ocean'`) yang sebelumnya memotong pemandangan pegunungan latar.
     - *Kontinuitas $C^1$ Lembah Suture*: Menyelaraskan elevasi titik kontak di $X = 390 + \text{leftShiftX}$ ($Y = 340$) antara lereng Anak Krakatau dan Bukit Lipatan sehingga tidak ada celah patahan ketinggian.
   - **Verifikasi Build**: Lolos kompilasi penuh `npm run build` (`tsc -b && vite build`) dengan status bersih 0 error.

7. **🧹 Pembersihan Teks Map, Eliminasi Mantel Cokelat, Lempeng Penuh ke Bawah & Peninggian Lanskap**:
   - **Pembersihan Teks di Map & Standarisasi Panah Tunggal**:
     - Menghapus plakat nama retro di peta (`🌋 GUNUNG ANAK KRAKATAU` dan `⛰️ BUKIT LIPATAN TERANGKAT`).
     - Menghilangkan anak panah kompresi kanan (`GAYA KOMPRESI MENABRAK`).
     - Menyisakan tepat satu anak panah vektor penunjaman miring ke kanan bawah (`↘`) murni grafik animasi tanpa kotak teks badge tulisan (`label = ''`).
   - **Penghapusan Tanah Cokelat & Perluasan Lempeng Penuh ke Bawah (*Full to Bottom*)**:
     - Menghapus seluruh render mantel astenosfer cokelat di belakang lempeng.
     - Lempeng vulkanik kiri (pembawa Anak Krakatau) mengisi padat penuh dari permukaan hingga dasar kanvas ($Y = h$). Di zona subduksi, slab litosfer tebal menunjam ke kanan-bawah memotong penuh batuan bawah.
     - Lempeng benua kanan (pembawa Bukit Lipatan) mengisi padat penuh dari bukit hingga dasar kanvas ($Y = h$) di sisi timur dan menumpang kokoh di atas bidang sesar kontak subduksi di sisi barat.
     - Kedua lempeng bertemu di sepanjang bidang sesar kontak (*megathrust suture line*) tanpa menyisakan celah kosong atau warna latar belakang cokelat.
   - **Peninggian Siluet Gunung & Bukit Lipatan (*Elevated Peaks*)**:
     - *Puncak Gunung Anak Krakatau*: Ditinggikan dari $Y = 220$ menjadi $Y = 180$ (ketinggian bertambah $40\text{ px}$ lebih megah & terjal).
     - *Puncak Bukit Lipatan*: Ditinggikan dari $Y = 220$ menjadi $Y = 185$ (ketinggian bertambah $35\text{ px}$ dengan pelipatan tektonik lebih dramatis).
     - Seluruh pohon pinus, kawah andesit, dan kepulan abu vulkanik menyesuaikan secara dinamis mengikuti elevasi baru.
   - **Verifikasi Build**: Lolos kompilasi penuh `npm run build` (`tsc -b && vite build`) dengan status bersih 0 error.

8. **🌊 Penyatuan Garis Lempeng Mulus Melengkung (*Seamless Curved Plate Boundary*) & Overhaul Realisme Gunung Anak Krakatau**:
   - **Satu Garis Lempeng Mulus Melengkung (Eliminasi Patahan / Sudut Siku)**:
     - Sesuai instruksi pengguna (*"itu yang garis lempeng yang atasnya gunung itu kayak ga nyambung gitu garis lempengnya, dibikin nyambung aja jadi satu garis dan dia tuh garisnya kayak patah gitu loh, dibikin melengkung aja"*):
       - Mengganti pemodelan lereng timur terputus dengan fungsi geometris analitis terpadu `getSubductingPlateTopY(x, p)` berbasis kurva Hermite Spline $C^1$-continuous di [`zones.ts`](./src/app/Level1/EarthDive/engine/zones.ts) dan [`sprites.ts`](./src/app/Level1/EarthDive/engine/sprites.ts).
       - Menghilangkan patahan sudut siku maupun lantai datar horizontal: lereng timur Gunung Anak Krakatau melengkung anggun (*lithospheric flexural curve*) dan kemiringannya menyatu $100\%$ secara tangensial ($dy/dx = 0.70$) ke bidang slab penunjaman tektonik.
       - Seluruh batas atas lempeng dilukis sebagai **SATU garis tunggal tak terputus (*single continuous unbroken path*)** dari lereng kawah hingga menunjam miring di bawah lempeng benua ($X = \text{contactX} + 330$) dengan garis bayangan sesar (`#0f172a`, tebal $2.8\text{ px}$) dan highlight tepi batuan litosfer (`#94a3b8`, tebal $1.4\text{ px}$).
       - Seluruh lapisan internal kerak basalt atas (`+36px`) dan gabro menengah (`+78px`) melengkung mulus mengikuti kontur geometri yang persis sama.
   - **Overhaul Realisme Tekstur 3D Gunung Stratovolcano Anak Krakatau**:
     - Sesuai instruksi pengguna (*"tekstur gunungnya coba kamu bikin lebih bagus deh biar keliatan realistis"*):
       - **Pencahayaan Volumetrik Terarah (*Directional 3D Lighting*)**: Lereng barat disinari matahari hangat kiri atas (`#5a6e85` $\to$ `#44566b`) dan lereng timur dinaungi bayangan sejuk vulkanik (`#1e2834` $\to$ `#131b23`).
       - **Punggungan Arête Tulang Kawah**: Garis arête tegas dari puncak kawah membelah sisi terang dan sisi bayangan secara realistis.
       - **Faset Punggungan Lahar 3D (*Lava Ribs & Buttresses*)**: Punggungan batuan andesit berfaset di lereng barat menangkap pantulan cahaya matahari dengan highlight kristal kuarsa.
       - **Jurang Erosi (*Couloirs*)**: Celah erosi alami di lereng timur terisi bayangan pekat (`rgba(10, 15, 22, 0.65)`).
       - **Lidah Aliran Lahar Andesit Beku (*ʻAʻā Block-Lava Tongue*)**: Aliran lava beku mengeras menjulur dari lereng kawah timur menuju lembah kontak suture dengan tepian kasar dan retakan celah pendinginan (*cooling fissures*).
       - **Perlapisan Strata Piroklastik Bersudut Alami (*Stratocone Bedding*)**: Garis-garis perlapisan bersudut alami mengikuti sudut lereng ($35^\circ$) terdiri dari abu batu apung terang, terak besi vulkanik kemerahan, dan scoria basalt gelap.
       - **Kipas Puing Talus & Lapilli**: Taburan kerikil vulkanik dan puing batuan organik yang terkonsentrasi alami di kaki lereng dan dasar jurang erosi.
       - **Kawah Kaldera Bertingkat & Fumarol Belerang**: Tenggorokan kawah andesit dalam bertingkat dengan endapan kerak kristal belerang/sulfur kuning lemon (`#fde047`) dan oranye keemasan (`#d97706`) di bibir ventilasi fumarol, memancarkan kepulan uap solfatara putih-keabuan alami.
       - **Vegetasi Perintis Vulkanik**: Tumbuhnya lumut dan semak pakis vulkanik perintis di dataran dan kaki lereng barat yang subur.
   - **Verifikasi Build**: Lolos kompilasi penuh `npm run build` (`tsc -b && vite build`) dengan status bersih 0 error (waktu kompilasi $2.30\text{ detik}$).

---

### Bab 69: Rombak Konsep Batas Konvergen Daratan (Tabrakan Dua Lempeng Benua, Litosfer Bawah, Arus Konveksi Mantel Magma & Dapur Magma Internal Gunung)

**Tanggal:** 28 September 2026  
**Status:** Selesai & Terverifikasi Penuh (`npm run build` Lolos Bersih 0 Error, 2.68s)

#### Berkas yang Dimodifikasi:
- [`src/app/Level1/EarthDive/engine/zones.ts`](./src/app/Level1/EarthDive/engine/zones.ts)
- [`src/app/Level1/EarthDive/engine/sprites.ts`](./src/app/Level1/EarthDive/engine/sprites.ts)
- [`src/app/Level1/EarthDive/EarthDiveGame.tsx`](./src/app/Level1/EarthDive/EarthDiveGame.tsx)

#### Rincian Penyempurnaan:

1. **🚫 Eliminasi Total Gunung Anak Krakatau pada Lempeng Kiri**:
   - Sesuai arahan pengguna (*"gunung anak krakataunya nah itu dihilangin aja"*):
     - Di [`zones.ts`](./src/app/Level1/EarthDive/engine/zones.ts) dan [`sprites.ts`](./src/app/Level1/EarthDive/engine/sprites.ts), seluruh siluet, lereng, kawah andesit, dan kubah Anak Krakatau dihapus total.
     - Lempeng barat berawal sebagai dataran benua murni ($Y = 335$) berlapis rumput hijau subur dan batuan sedimen-granit padat.

2. **⛰️ Dua Lempeng Benua Konvergen (Sesuai Sketsa Video Referensi)**:
   - **Lempeng Benua Kiri (Kepadatan Lebih Rendah)**:
     - Bentuk awal sudah dalam kondisi menunjam miring ke kanan bawah (`↘` sudut kemiringan $\approx 31^\circ$, slope $0.60$) dari $X \approx 220 + \text{leftShiftX}$ menuju kedalaman litosfer bawah dan mantel di bawah lempeng benua kanan.
     - Saat animasi ($p: 0 \to 1$), lempeng kiri bergerak maju menunjam ke kanan bawah (`leftShiftX = 40px`, `leftShiftY = 24px`).
   - **Lempeng Benua Kanan (Kepadatan Lebih Tinggi)**:
     - Bergeser ke arah kiri (`rightShiftX = -28px`) akibat dorongan gaya tektonik kompresi.

3. **🧱 Struktur Bertingkat Subterranean: Tanah/Batuan Padat Dulu Baru Lapisan Mantel Magma**:
   - Sesuai instruksi pengguna (*"mantelnya jangan langsung setelah lempeng langsung mantel gitu, dibikin ada tanahnya dulu gitu baru lapisan mantel yang isinya magma"*):
     - **Lapisan 1 (Lempeng Benua)**: Kerak benua atas setebal $70\text{ px}$ ($Y = 335..405$).
     - **Lapisan 2 (Tanah & Batuan Padat Bawah / Litosfer Bawah)**: Batuan padat peridotit dan kerak benua dalam setebal $\approx 85\text{ px}$ ($Y \approx 405..490$) dengan tekstur strata horizontal, bintik kristal mineral kuarsa/feldspar, dan zona peleburan Benioff.
     - **Lapisan 3 (Mantel Astenosfer Magma di Bawah $Y = 490$)**: Lapisan mantel berisi magma cair berpendar terang dengan dua sel sirkulasi arus konveksi melingkar beranimasi, gelembung magma mendidih, dan panah konveksi termal persis sesuai sketsa video pengguna.

4. **🌋 Pembentukan Gunung Megah Hasil Tabrakan Lempeng (Orogeny)**:
   - Tabrakan dan kompresi horizontal dahsyat antara kedua lempeng melipat kerak benua kanan menjadi gunung megah yang tumbuh dinamis dari tanah datar ($Y = 335$ saat $p = 0$) menjadi gunung menjulang setinggi $165\text{ px}$ ($Y = 170$ saat $p = 1$).
   - Dilengkapi faset punggungan batuan 3D terarah, ridge arête pemisah bayangan matahari, dan strata lipatan antiklinal.
   - Pohon-pohon pinus di lereng terangkat naik secara dinamis mengikuti pertumbuhan elevasi gunung.

5. **🔥 Saluran Pipa Magma & Dapur Magma (Magma Chamber) Internal Tertutup**:
   - Sesuai arahan pengguna (*"saat animasi kebentuknya itu sambil dia terisi magma gitu juga jadi nanti pas gunungnya jadi tuh ada kayak dapur magmanya di dalam gunungnya, tapi nanti magmanya jangan dibikin keluar dari gunungnya ya"*):
     - **Pipa Saluran Magma (Feeder Conduit)**: Saluran magma meliuk dari zona peleburan mantel/slab naik menembus batuan litosfer bawah langsung menuju dapur magma di dalam gunung.
     - **Dapur Magma ("DM")**: Ruang magma berbentuk elips bergradasi termal berpendar terang (inti putih, kuning keemasan, jingga, dan merah crimson) dengan pusaran arus konveksi dan gelembung magma aktif di dalam perut gunung ($Y \approx 250$).
     - **Atap Batuan Kokoh (Zero Eruption)**: Puncak gunung di atas dapur magma ($Y = 170..220$) dilindungi lapisan batuan padat tebal ($>50\text{ px}$), menjamin magma 100% terkunci aman di dalam gunung tanpa ada tumpahan/letusan ke permukaan.
     - Dilengkapi label penunjuk retro pixel `"♨ DAPUR MAGMA"`.

6. **🔘 Pembaruan HUD Button & Toasts**:
   - Tombol Top HUD di Area 7 diperbarui menjadi **`⛰️ DARATAN (TUMBUKAN BENUA)`** dengan tooltip dan pesan toast yang mencerminkan tabrakan lempeng benua dan pembentukan dapur magma internal.

---

### Bab 70: Penyempurnaan Tampilan Visual Batas Konvergen Daratan (Garis Lempeng Alami, Mantel Pijar Gaya Divergen, Pembersihan Teks, & Animasi Perlahan)

**Tanggal:** 28 September 2026  
**Status:** Selesai & Terverifikasi Penuh (`npm run build` Lolos Bersih 0 Error, 2.54s)

#### Berkas yang Dimodifikasi:
- [`src/app/Level1/EarthDive/engine/zones.ts`](./src/app/Level1/EarthDive/engine/zones.ts)
- [`src/app/Level1/EarthDive/engine/sprites.ts`](./src/app/Level1/EarthDive/engine/sprites.ts)
- [`src/app/Level1/EarthDive/engine/gameEngine.ts`](./src/app/Level1/EarthDive/engine/gameEngine.ts)

#### Rincian Penyempurnaan:

1. **🌿 Eliminasi Garis Hitam Kaku & Transisi Lempeng Subduksi yang Natural**:
   - Menghapus garis stroke hitam pekat buatan (`#090d12`) yang memotong lempeng kiri.
   - Menggantinya dengan bidang kontak geologis alami: bayangan oklusi batuan lembut (`rgba(30, 22, 16, 0.40)`), strata batuan granit dan sedimen yang berorientasi miring mengikuti penunjaman slab, serta zona peleburan parsial Benioff yang berpendar hangat menyatu ke dalam mantel bumi.

2. **🔥 Lapisan Mantel Pijar Estetik Sesuai Standar Area Divergen**:
   - Menyelaraskan elevasi mantel ke $Y = 370\text{ px}$ sehingga mantel magma tampak jelas dan menonjol di paruh bawah kanvas viewport.
   - Mengadopsi sistem rendering fluida mantel terpadu dari Area Divergen:
     - Gradien magma pijar 7-tahap (`#ffffff` putih menyala $\to$ `#fef08a` kuning menyala $\to$ `#fde047` emas $\to$ `#f97316` jingga $\to$ `#ea580c` vermilion $\to$ `#dc2626` merah api $\to$ `#991b1b` mantel pekat).
     - Dua arus konveksi sinusoidal aktif yang mengalir di dalam mantel (`rgba(254, 240, 138, 0.42)` dan `rgba(249, 115, 22, 0.48)`).
     - Gelembung magma mendidih dengan inti putih menyala.
     - Garis diskontinuitas Moho bergelombang dengan kilau cahaya termal keemasan (`rgba(254, 240, 138, 0.65)`).
   - Di atas mantel tetap dipertahankan lapisan tanah dan batuan litosfer padat ("tanahnya dulu", $Y = 310..370\text{ px}$) sebelum menyentuh mantel magma.

3. **🧹 Pembersihan Tampilan & Penghapusan Teks yang Menumpuk**:
   - Menghapus teks overlay yang menutupi lempeng (`LEMPENG BENUA (KEPADATAN RENDAH)`, `LEMPENG BENUA (KEPADATAN TINGGI)`, dan `♨ DAPUR MAGMA`).
   - Menyederhanakan indikator vektor lempeng menjadi panah piksel minimalis dan elegan tanpa kotak teks hitam besar yang mengaburkan pemandangan.
   - Menata ulang posisi pohon-pohon pinus dan objek/NPC (Dr. Farhan di kaki barat, Kristal 2 di puncak gunung, Prof. Ratna di lereng timur) agar tidak bertumpukan dan memberikan komposisi pemandangan yang rapi dan megah.

4. **🌋 Saluran Magma & Dapur Magma Terpadu Terkunci Aman**:
   - Pipa magma (volcanic dyke) bermula langsung dari lapisan mantel magma bawah, naik meliuk secara organik menembus litosfer menuju dapur magma di dalam perut gunung.
   - Dapur magma di dalam gunung terisi cairan magma membara berolak dengan pendaran aureol termal.
   - Dilindungi atap batuan granit tebal ($>45\text{ px}$) dari dapur magma hingga ke puncak gunung, menjamin magma terkunci rapat di dalam dan tidak ada erupsi ke luar.

5. **⏱️ Animasi Pergerakan Lambat, Megah, & Sinematik**:
   - Menyesuaikan laju penambahan `convergentProgress` dari `+0.0035` menjadi `+0.0008` per frame di [`gameEngine.ts`](./src/app/Level1/EarthDive/engine/gameEngine.ts).
   - Durasi animasi bertransformasi dari $\approx 4,7\text{ detik}$ menjadi $\approx 20,8\text{ detik}$, memberikan tempo tektonik yang perlahan dan megah sehingga siswa dapat mengamati proses penunjaman lempeng, pelipatan kerak menjadi gunung, dan pengisian dapur magma dengan sangat jelas dan nyaman.

---

### Bab 71: Penyempurnaan Geometri Slab Subduksi Penuh, Mantel Bergelombang Organik Rendah, Tekstur Litosfer Terpadu Batas Divergen, Karpet Rumput Penuh, & Animasi Pengisian Magma Bertahap dari Mantel

**Tanggal:** 28 September 2026  
**Status:** Selesai & Terverifikasi Penuh (`npm run build` Lolos Bersih 0 Error, 2.05s)

#### Berkas yang Dimodifikasi:
- [`src/app/Level1/EarthDive/engine/zones.ts`](./src/app/Level1/EarthDive/engine/zones.ts)
- [`src/app/Level1/EarthDive/engine/sprites.ts`](./src/app/Level1/EarthDive/engine/sprites.ts)
- [`src/app/Level1/EarthDive/engine/gameEngine.ts`](./src/app/Level1/EarthDive/engine/gameEngine.ts)

#### Rincian Penyempurnaan:

1. **🌊 Geometri Penunjaman Slab Lempeng Kiri Curam dan Tembus Penuh ke Dasar Layar**:
   - Menghapus potongan kotak slab yang sebelumnya terputus di tengah lapisan mantel.
   - Memperbarui fungsi [`getSubductingPlateTopY`](./src/app/Level1/EarthDive/engine/zones.ts) sehingga slab lempeng benua kiri melengkung mulus dari dataran barat lalu menunjam semakin curam ke bawah tembus ke dasar layar (`Y > 540px`, `slabReachX = contactX + 240px`).
   - Tubuh slab dan dasar lempeng bergerak serentak menunjam langsung ke dasar kanvas tanpa terpotong kotak mengambang.

2. **🔥 Batas Atas Lapisan Mantel Bergelombang Organik & Posisi Lebih Rendah**:
   - Menghapus garis horizontal datar $Y = 370\text{px}$.
   - Membuat fungsi [`getConvergentMantleY(x)`](./src/app/Level1/EarthDive/engine/zones.ts) dengan undulasi gelombang sinusoidal harmonik alami (persis Area Divergen).
   - Menurunkan batas atas mantel dari $370\text{px}$ ke baseline $Y \approx 424\text{px}$ sehingga mantel menjadi pita magma elegan bergelombang di dasar layar tanpa memakan terlalu banyak ruang pandang.
   - Dilengkapi arus konveksi sinusoidal aktif, gelembung pijar mengapung, dan garis diskontinuitas Moho bergelombang keemasan.

3. **🧱 Tekstur Tanah/Litosfer & Batuan Gunung Terpadu Sesuai Batas Divergen**:
   - Menyelaraskan seluruh material batuan litosfer bawah, lempeng kiri, lempeng kanan, dan gunung menggunakan sistem perlapisan batuan litosfer Area Divergen:
     - Gradien batuan kerak benua padat (`#4a3f35` $\to$ `#3a3028` $\to$ `#29211a` $\to$ `#1c1510`).
     - Garis strata perlapisan horizontal alami bergelombang (`rgba(78, 62, 50, 0.40)` dan `rgba(38, 28, 21, 0.45)`).
     - Bintik kristal mineral stippling kuarsa dan feldspar (`#5c4c3e`, `#221a14`, `#4a382c`).
     - Kilau termal aureol kontak Moho keemasan di batas bawah.
   - Menghilangkan bidang segitiga terpisah pada gunung sehingga tubuh gunung menyatu 100% secara alami dengan batuan lempeng di sekitarnya.

4. **🌿 Karpet Rumput Hijau Menutup Penuh Lempeng Kiri hingga Titik Kontak**:
   - Memperpanjang rendering karpet rumput hijau subur (`#15803d` dengan garis tepi `#22c55e`) dari $-800\text{px}$ secara kontinu penuh hingga ke titik kontak `contactX`.
   - Menutup area permukaan yang sebelumnya terbuka/telanjang, sehingga seluruh permukaan tanah tertutup rumput hijau dengan rapi dan bersambung rapat tanpa celah dengan lereng gunung lempeng kanan.

5. **🌋 Animasi Magma Dua Tahap: Pengisian Bertahap dari Mantel Menuju Gunung**:
   - Menghilangkan kemunculan mendadak dapur magma di dalam gunung.
   - **Tahap 1 ($p \in [0.12, 0.52]$)**: Magma membara perlahan merayap naik dari lapisan mantel bergelombang bawah melalui pipa saluran vulkanik (feeder dyke) dengan kepala magma pijar yang aktif menembus batuan litosfer.
   - **Tahap 2 ($p \in [0.48, 1.0]$)**: Begitu magma tiba di dalam perut gunung, dapur magma mulai terbentuk dan kolam magma terisi secara bertahap dari bawah ke atas (*bottom-to-top filling*) dengan permukaan cairan berombak mendidih, gelembung pijar, dan tekstur warna gradien yang sama persis dengan mantel.
   - Atap batuan granit tebal ($>45\text{px}$) tetap melindungi bagian atas dapur magma hingga puncak gunung, menjamin magma terkunci aman di dalam perut gunung tanpa letusan.

6. **⚡ Kecepatan Animasi Disesuaikan Lebih Gesit & Dinamis**:
   - Menyesuaikan penambahan `convergentProgress` di [`gameEngine.ts`](./src/app/Level1/EarthDive/engine/gameEngine.ts) dari `+0.0008` ($\approx 20,8\text{ detik}$) menjadi `+0.0022` ($\approx 7,5\text{ detik}$).
   - Transisi pergerakan lempeng kini terasa hidup, dinamis, dan tidak membosankan untuk disaksikan oleh pengguna.

---

### Bab 72: Pembersihan Visual Gunung (Eliminasi Poligon Hitam-Putih), Redesain Dapur Magma Kubah Megah Tanpa Garis Hitam, Eliminasi Garis Stray Mantel, & Penyesuaian Z-Index Lempeng Kiri

**Tanggal:** 28 September 2026  
**Status:** Selesai & Terverifikasi Penuh (`npm run build` Lolos Bersih 0 Error, 2.22s)

#### Berkas yang Dimodifikasi:
- [`src/app/Level1/EarthDive/engine/sprites.ts`](./src/app/Level1/EarthDive/engine/sprites.ts)

#### Rincian Penyempurnaan:

1. **🧹 Pembersihan Gunung & Eliminasi Bentuk Segitiga Hitam-Putih**:
   - Menghapus poligon highlight lereng barat putih transparan (`rgba(255, 255, 255, 0.08)`) dan bayangan lereng timur hitam (`rgba(0, 0, 0, 0.16)`) yang sebelumnya tampak kaku seperti tempelan bentuk aneh di badan gunung.
   - Menghapus kepulan asap solfatara dan bintik-bintik mineral yang tidak serasi. Gunung kini bersih, solid, dan menampilkan batuan litosfer alami dengan perlapisan lipatan antiklinal yang elegan.

2. **🌋 Redesain Dapur Magma Kubah Megah Sesuai Garis Merah Pengguna**:
   - Menghilangkan garis tepi/border hitam dan cokelat tua (`#200505` dan `#7f1d1d`).
   - Merombak geometri dapur magma dari lingkaran elips terisolasi menjadi kubah rongga magma megah (*subterranean magma cavern*) yang membentang dari kaki barat ($X \approx 365\text{px}$) melengkung tinggi di bawah puncak gunung ($Y \approx 217\text{px}$) hingga ke kaki lereng timur ($X \approx 790\text{px}$) dan terbuka langsung ke mantel bumi di dasarnya.
   - Magma mengisi rongga kubah ini perlahan dari bawah ke atas dari mantel bumi seiring berjalannya animasi ($p: 0.12 \to 1.0$), dengan gelombang mendidih aktif, gradien warna magma mantel menyala, dan pendaran termal halus tanpa garis pembatas kaku.

3. **🌊 Eliminasi Garis Stray / Kelewatan di Batas Atas Lapisan Mantel**:
   - Memasang `ctx.clip()` pada poligon mantel dan litosfer bawah, sehingga tidak ada lagi garis konveksi atau garis batas Moho yang menusuk/kelewatan ke atas batas mantel.
   - Menghapus garis stroke horizontal yang sebelumnya melintang sembarangan di atas mantel. Batas antara batuan padat litosfer dan fluida magma mantel kini 100% mulus dan bersih.

4. **📐 Penyesuaian Z-Index Pertemuan Lempeng (Lempeng Kiri di Atas Lempeng Kanan)**:
   - Membalik urutan proses rendering (*canvas drawing order*):
     - **Layer 3**: Lempeng Benua Kanan & Gunung (z-index lebih rendah, digambar duluan).
     - **Layer 4**: Dapur Magma Subterranean di dalam Gunung.
     - **Layer 5**: Lempeng Benua Kiri & Slab Subduksi (z-index lebih tinggi, digambar sesudahnya).
   - Dengan urutan ini, lempeng benua kiri beserta karpet rumput dan slab penunjamannya berada di atas lempeng kanan pada area pertemuan (`contactX`), menghasilkan garis batas patahan tektonik yang bersih, tegas, dan natural tanpa terpotong oleh lempeng kanan.

---

### Bab 73: Eliminasi Preview Siluet Kubah Magma & Penyelarasan Penuh Warna serta Tekstur Magma Dapur Gunung dengan Lapisan Mantel

**Tanggal:** 28 September 2026  
**Status:** Selesai & Terverifikasi Penuh (`npm run build` Lolos Bersih 0 Error, 2.28s)

#### Berkas yang Dimodifikasi:
- [`src/app/Level1/EarthDive/engine/sprites.ts`](./src/app/Level1/EarthDive/engine/sprites.ts)

#### Rincian Penyempurnaan:

1. **🚫 Eliminasi Total "Preview" Siluet Kubah Magma di Dalam Gunung**:
   - Menghapus poligon bayangan pendaran termal (`auraGrad`) yang sebelumnya merender siluet kubah gelap transparan di dalam gunung mendahului cairan magma sebelum magma naik.
   - Area interior batuan gunung di atas level magma kini 100% batuan litosfer solid alami dengan lipatan antiklinal utuh tanpa siluet kubah kosong, tanpa garis tepi gelap, dan tanpa bayangan ruang kosong.
   - Ketika proses penunjaman dan pengisian magma belum mencapai ketinggian tertentu (`magmaRiseProg`), gunung tampak kokoh dan padat secara natural.

2. **🔥 Penyelarasan Penuh Warna & Tekstur Magma dengan Lapisan Mantel**:
   - Menghapus potongan poligon kotak dan garis putih zigzag tajam yang sebelumnya memotong mantel ke dasar kanvas.
   - Dasar poligon cairan dapur magma kini dikunci rapat menempel pada garis permukaan atas mantel (`getConvergentMantleY(x) + 4px`), sehingga tidak ada lagi kotak vertikal yang menimpa atau merusak lapisan mantel di bawahnya.
   - Gradien warna magma yang naik ke dalam gunung diselaraskan 100% dengan gradien magma mantel:
     - Pucuk mendidih putih membara (`#ffffff`), kuning menyala terang (`#fef08a`), inti konveksi kuning keemasan (`#fde047`), magma oranye membara (`#f97316`), vermilion sirkulasi mantel (`#ea580c`), dan merah magma mantel dalam (`#dc2626`).
   - Dilengkapi arus konveksi sinusoidal (`rgba(254, 240, 138, 0.42)` & `rgba(249, 115, 22, 0.48)`), gelembung pijar mengapung naik dengan inti putih cerah (`rgba(255, 255, 255, 0.95)`), serta meniskus permukaan mendidih bergelombang lembut (garis tipis 1.5px yang halus).
   - Menghasilkan transisi magma yang menyatu mulus, organik, dan harmonis antara lapisan mantel dan dapur magma gunung.

---

### Bab 74: Penyatuan Penuh Tekstur & Fluida Magma Dapur Gunung dengan Lapisan Mantel (Eliminasi Strip Zebra & Garis Pemisah Mantel)

**Tanggal:** 29 September 2026  
**Status:** Selesai & Terverifikasi Penuh (`npm run build` Lolos Bersih 0 Error, 1.91s)

#### Berkas yang Dimodifikasi:
- [`src/app/Level1/EarthDive/engine/sprites.ts`](./src/app/Level1/EarthDive/engine/sprites.ts)

#### Rincian Penyempurnaan:

1. **🌊 Peleburan Tanpa Batas (Zero Boundary) dari Puncak Kubah ke Dasar Mantel**:
   - Menghapus batas horizontal artifisial di $Y \approx 424\text{px}$ yang sebelumnya memisahkan dapur magma dari lapisan mantel di bawahnya.
   - Poligon magma kini membentang secara terpadu (*unified fluid polygon*) dari puncak cairan magma di dalam perut gunung langsung tembus menyatu ke dasar kanvas (`h`), sehingga magma dapur gunung dan magma mantel kini menjadi **satu kesatuan fluida utuh**.
   - Menghilangkan garis putih/kuning pemisah mantel dan pita merah tua yang sebelumnya memotong sambungan di antara keduanya.

2. **🚫 Eliminasi Total Garis Garis Strip Zebra Horizontal**:
   - Menghapus balok-balok persegi panjang horizontal (`ctx.fillRect` selebar 400px) yang sebelumnya tampak kaku seperti garis-garis zebra / tirai horizontal di dalam kubah gunung.
   - Menggantinya dengan **tekstur arus konveksi yang sama persis dengan lapisan mantel**: segmen-segmen pendek sinusoidal berombak (panjang 14px dan 18px, tinggi 4px, renggang 36px) dalam palet `rgba(254, 240, 138, 0.38)` dan `rgba(249, 115, 22, 0.42)`.

3. **✨ Gradasi Warna Magma Terpadu & Aliran Gelembung Bebas Lintas Lapisan**:
   - Menyelaraskan gradien warna dari puncak dapur magma hingga ke dasar mantel: pucuk mendidih putih (`#ffffff`) $\to$ kuning menyala terang (`#fef08a`) $\to$ emas kuning keemasan terang (`#fde047`) $\to$ oranye membara cerah (`#f97316`) $\to$ vermilion mantel (`#ea580c`) $\to$ merah dalam (`#dc2626`) $\to$ dasar pekat abisal (`#991b1b`).
   - Gelembung pijar magma (`radius 2.5px`, inti putih `rgba(255, 255, 255, 0.90)`) kini mengalir bebas melayang naik dari kedalaman mantel tembus langsung ke puncak dapur magma di dalam gunung.

---

### Bab 75: Kalibrasi Presisi Palet Oranye Membara Dapur Magma & Eliminasi Garis Berulang (100% Identik Lapisan Mantel)

**Tanggal:** 29 September 2026  
**Status:** Selesai & Terverifikasi Penuh (`npm run build` Lolos Bersih 0 Error, 2.02s)

#### Berkas yang Dimodifikasi:
- [`src/app/Level1/EarthDive/engine/sprites.ts`](./src/app/Level1/EarthDive/engine/sprites.ts)

#### Rincian Penyempurnaan:

1. **🔥 Eliminasi Warna Kuning Pucat & Restorasi Penuh Palet Oranye Membara Mantel**:
   - Menghapus gradasi vertikal yang sebelumnya melar hingga $H = 1600\text{px}$ (yang menyebabkan magma tampak kuning pucat seperti pisang).
   - Membatasi rentang gradien linier secara presisi pada tinggi dapur magma aktif dari permukaan cairan `currentLiquidSurfaceY` ($\approx 220\text{px}$) hingga batas atas mantel ($\approx 434\text{px}$):
     - Pucuk cairan mendidih putih tipis (`#ffffff`, 0..2px).
     - Pucuk kuning menyala terang (`#fef08a`, 8%).
     - Inti magma emas kuning keemasan (`#fde047`, 22%).
     - Badan utama magma **oranye membara kaya** (`#f97316`, 48% - **persis sama dengan mantel**).
     - Sirkulasi vermilion termal (`#ea580c`, 78%).
     - Dasar kubah menyatu mulus ke warna oranye membara mantel (`#f97316`, 100%).
   - Hasilnya: kubah dapur magma kini berpendar dalam warna **oranye membara kaya dan emas alami** yang serasi dan identik dengan magma mantel di bawahnya.

2. **🚫 Eliminasi Total Seluruh Garis Bersambung & Balok Memanjang**:
   - Menghapus perulangan yang sebelumnya menggambar balok panjang bersambung di dalam kubah.
   - Menggantinya dengan **segmen konveksi pendek berjarak renggang** (panjang 16px dengan jeda kosong 20px, `step = 36..44px`) pada 3 elevasi terisolasi, sehingga tidak ada lagi garis strip zebra yang melintang.
   - Permukaan magma kini bersih, mulus, bercahaya, dan dihiasi gelembung pijar (`rgba(254, 240, 138, 0.75)`) yang melayang secara alami.

3. **🧱 Sambungan Bersih Bebas Kotak Vertikal**:
   - Poligon dasar kubah dikunci menempel rapat $+8\text{px}$ di atas permukaan mantel (`getConvergentMantleY(x) + 8px`) tanpa lagi memotong vertikal ke dasar kanvas.
   - Lapisan mantel di sebelah kanan dan kiri tetap utuh, mulus, dan terhubung secara harmonis tanpa ada potongan dinding kotak vertikal.

---

### Bab 76: Penyeragaman 100% Tekstur & Warna Magma Dapur Gunung dengan Lapisan Mantel (Eliminasi Total Garis Strip & Kalibrasi Dominan Oranye)

**Tanggal:** 29 September 2026  
**Status:** Selesai & Terverifikasi Penuh (`npm run build` Lolos Bersih 0 Error, 1.93s)

#### Berkas yang Dimodifikasi:
- [`src/app/Level1/EarthDive/engine/sprites.ts`](./src/app/Level1/EarthDive/engine/sprites.ts)

#### Rincian Penyempurnaan:

1. **🔥 Dominansi Warna Oranye Membara Mantel (#f97316) pada Tubuh Kubah**:
   - Menghapus dominansi warna kuning pisang pucat yang sebelumnya mendominasi tubuh kubah akibat rentang skala gradien yang terlalu lebar.
   - Mengalibrasikan gradien magma kubah dapur gunung secara ketat:
     - $0.00$: `#ffffff` (pucuk putih tipis 1–2px di puncak).
     - $0.03$: `#fef08a` (pendaran kuning tipis di bibir atas kubah).
     - $0.07$: `#fde047` (transisi emas singkat).
     - $0.14 - 0.65$: **`#f97316` (Oranye membara khas lapisan mantel mendominasi >80% isi kubah)**.
     - $0.85$: `#ea580c` (sirkulasi vermilion termal).
     - $1.00$: `#f97316` (menyatu 100% sempurna dengan warna mantel di dasar).

2. **🚫 Eliminasi Total Seluruh Garis Kotak & Garis Strip Horizontal**:
   - Menghapus seluruh blok `ctx.fillRect` sinusoidal/garis putus-putus (`wave1` & `wave2`) di dalam tubuh kubah yang sebelumnya tampak seperti garis-garis zebra / tangga horizontal.
   - Menghapus garis kontur putih kartun di sekeliling kubah, sehingga permukaan magma bertemu batuan litosfer secara alami dan organik.

3. **✨ Tekstur Gelembung Pijar Identik Mantel & Sambungan Tanpa Celah**:
   - Mengisi seluruh volume cairan magma kubah dengan partikel gelembung pijar mengapung (*floating incandescent embers*): lingkaran pendar `rgba(254, 240, 138, 0.75)` dengan inti 2x2px `rgba(255, 255, 255, 0.95)`, persis sama dengan partikel di lapisan mantel bawah.
   - Memperbesar kedalaman overlap dasar kubah hingga `+18px` ke dalam mantel (`getConvergentMantleY(x) + 18px`), sehingga perbatasan antara dapur magma gunung dan lapisan mantel menyatu tanpa ada celah, garis horizontal, ataupun sekat pemisah.

---

### Bab 77: Implementasi Konsep Magma Naik Terpadu dari Lapisan Mantel (Adopsi Penuh Konsep Batas Divergen)

**Tanggal:** 29 September 2026  
**Status:** Selesai & Terverifikasi Penuh (`npm run build` Lolos Bersih 0 Error, 1.91s)

#### Berkas yang Dimodifikasi:
- [`src/app/Level1/EarthDive/engine/zones.ts`](./src/app/Level1/EarthDive/engine/zones.ts)
- [`src/app/Level1/EarthDive/engine/sprites.ts`](./src/app/Level1/EarthDive/engine/sprites.ts)

#### Rincian Penyempurnaan:

1. **🌋 Unifikasi Lapisan Mantel & Magma Gunung (Satu Lapisan Tunggal)**:
   - Mengadopsi arsitektur fluida terpadu yang telah sukses di **Batas Divergen (Area 6)** ke dalam **Batas Konvergen Mode Daratan (Area 7)**.
   - Magma di dalam perut gunung tidak lagi digambar sebagai layer terpisah (*Layer 4 dihapus total*), melainkan **lapisan mantel itu sendiri (Layer 1)** yang membumbung naik secara dinamis mengisi perut gunung seiring tabrakan tektonik lempeng benua (`p` naik dari 0.10 hingga 1.00).
   - Fungsi kontur mantel `getConvergentMantleY(x, p, 'land')` kini menghitung permukaan fluida secara dinamis dari baseline $\approx 424\text{px}$ hingga membumbung ke puncak kubah $\approx 217\text{px}$.

2. **✨ 100% Identik dalam Warna, Gradasi & Tekstur Fluida**:
   - Karena magma di dalam gunung digambar dalam satu jalur poligon (*unified canvas path*) langsung bersama lapisan mantel bumi, warna dan teksturnya otomatis **100% identik tanpa perbedaan sedikit pun**:
     - Menggunakan satu gradien linier terpadu `moltenGrad`: pucuk putih incandescence (`#ffffff`) $\to$ pendaran kuning bibir atas (`#fef08a`) $\to$ emas transisi (`#fde047`) $\to$ oranye membara mantel mendominasi (`#f97316`) $\to$ vermilion (`#ea580c`) $\to$ merah dalam (`#dc2626`) $\to$ dasar pekat abisal (`#991b1b`).
     - Aliran arus konveksi sinusoidal lembut mengalir mulus melintasi mantel dan membumbung ke perut gunung.
     - Gelembung pijar mengapung (*floating embers* `rgba(254, 240, 138, 0.75)` dengan inti putih) bersirkulasi bebas dari kedalaman mantel langsung ke dalam kubah gunung.
     - Garis kontak termal Moho berpendar hangat (`rgba(254, 240, 138, 0.55)`) mengikuti kontur atap magma.

3. **🧱 Pembentukan Atap Gunung & Eliminasi Total Segala Sekat / Jahitan**:
   - Batuan litosfer bawah (Layer 2) hanya menghubungkan dasar lempeng ke mantel di luar rongga kubah (sisi barat dan sisi timur), menjaga rongga dapur magma bersih dari potongan batuan.
   - Batuan lempeng benua kanan (Layer 3) membentuk kubah atap gunung yang berhenti tepat di permukaan magma mantel yang membumbung (`getConvergentMantleY(x, p, 'land') + 2px`), sehingga seluruh rongga di bawahnya langsung memancarkan fluida mantel magma murni.
   - Menghilangkan total celah, sekat, atau garis horizontal di perbatasan gunung dan mantel.

---

### Bab 78: Penutupan Penuh Celah Transparan di Bawah Kaki Gunung & Dasar Lempeng (Litosfer Solid Kontinu)

**Tanggal:** 29 September 2026  
**Status:** Selesai & Terverifikasi Penuh (`npm run build` Lolos Bersih 0 Error, 3.23s)

#### Berkas yang Dimodifikasi:
- [`src/app/Level1/EarthDive/engine/sprites.ts`](./src/app/Level1/EarthDive/engine/sprites.ts)

#### Rincian Penyempurnaan:

1. **🧱 Eliminasi Total Celah Langit Kosong di Kaki Gunung & Kondisi Awal**:
   - Memperbaiki bug di mana pemisahan poligon litosfer menjadi blok barat (`x <= chamberLeftX`) dan blok timur (`x >= chamberRightX`) menyebabkan area antara dasar lempeng ($Y = 380\text{px}$) dan mantel ($Y = 424\text{px}$) bocor dan menampilkan latar belakang langit biru muda (terlihat sebagai lubang segitiga di bawah kaki kiri gunung, lubang kotak di bawah kaki kanan gunung, dan celah persegi panjang raksasa pada awal animasi $p = 0$).
   - Poligon Litosfer Bawah (Layer 2) kini dibuat **kontinu penuh melintasi seluruh lebar dunia** ($-800$ hingga $w + 400$) tanpa dipotong sekat vertikal kaku:
     - Jalur atas mengikuti dasar lempeng tektonik `getPlateBottomY(x)`.
     - Jalur bawah mengikuti `Math.max(getPlateBottomY(x), getConvergentMantleY(x, p, 'land'))`.

2. **📐 Ketebalan Adaptif Otomatis (Zero-Thickness di Area Magma, Solid di Kaki Gunung)**:
   - Di area luar gunung dan di bawah kaki gunung tempat mantel berada di bawah lempeng (`mTop > pBottom`), Layer 2 mengisi batuan padat litosfer secara rapat dan kokoh hingga ke permukaan mantel.
   - Di area kubah dapur magma tempat magma telah membumbung tinggi ke dalam gunung (`mTop <= pBottom`), ketebalan Layer 2 otomatis bernilai $0\text{px}$ secara kontinu matematis, sehingga fluida magma mantel Layer 1 memancar utuh tanpa tertutup batuan.
   - Pada kondisi awal ($p = 0$), seluruh area terisi penuh batuan litosfer padat setebal $\approx 44\text{px}$ dari dasar lempeng ke mantel bumi, 100% bebas dari celah langit bocor.

---

### Bab 79: Penebalan Lempeng Tektonik (95px), Visualisasi Pergerakan Lempeng Dinamis & Evakuasi Panik NPC Saat Gempa Bumi (Batas Konvergen Area 7)

**Tanggal:** 29 September 2026  
**Status:** Selesai & Terverifikasi Penuh (`npm run build` Lolos Bersih 0 Error, 5.15s)

#### Berkas yang Dimodifikasi:
- [`src/app/Level1/EarthDive/engine/zones.ts`](./src/app/Level1/EarthDive/engine/zones.ts)
- [`src/app/Level1/EarthDive/engine/sprites.ts`](./src/app/Level1/EarthDive/engine/sprites.ts)
- [`src/app/Level1/EarthDive/engine/npcManager.ts`](./src/app/Level1/EarthDive/engine/npcManager.ts)
- [`src/app/Level1/EarthDive/engine/gameEngine.ts`](./src/app/Level1/EarthDive/engine/gameEngine.ts)
- [`src/app/Level1/EarthDive/engine/renderer.ts`](./src/app/Level1/EarthDive/engine/renderer.ts)

#### Rincian Penyempurnaan:

1. **🌊 Visualisasi Pergerakan Lempeng yang Nyata & Dinamis (Zero-Static Illusion)**:
   - Memperbesar jarak pergeseran tektonik horizontal lempeng benua kiri dari `35px` menjadi **`80px`** (`leftShiftX = Math.round(p * 80)`), setara dengan $\approx 2.5$ petak ubin peta (`TILE = 32`).
   - Mengimplementasikan tekstur strata geologis bergeser (`strataOffset = leftShiftX`):
     - Retakan kolom kekar batuan vertikal bergeser nyata meluncur ke kanan menabrak bidang kontak tektonik.
     - Butiran mineral litosfer (kuarsa, feldspar, mika) hanyut bergerak bersama badan lempeng.
     - Rumpun rumput dan bebatuan di atas permukaan lempeng barat bergerak aktif ke kanan.
     - Percikan gesekan tektonik (*tectonic friction sparks*) dan partikel serpihan batuan berhamburan di garis pertemuan (`contactX`) saat kedua lempeng bertabrakan.
   - Penambahan label dan vektor kinetik beranimasi pada kedua lempeng:
     - Lempeng barat: `LEMPENG MENUNJAM (↘)` dengan panah berkedip dan gelombang pulsa energi kinetik.
     - Lempeng timur: `GAYA KOMPRESI (←)` dengan panah berlawanan arah yang mempertegas gaya kompresi tektonik.

2. **🧱 Penebalan Lapisan Lempeng Tektonik (55px ➔ 95px)**:
   - Meningkatkan ketebalan lempeng benua (`plateThick`) dari `55px` menjadi **`95px`** sehingga lempeng tampak masif, kokoh, dan berbobot geologis otentik (mencerminkan kerak benua tebal ~100 km).
   - Lempeng benua kiri menunjam miring ke bawah sebagai satu lempeng padat setebal 95px yang menembus ke dalam astenosfer mantel, dilengkapi 4 strata internal bertingkat.
   - Lempeng benua kanan dan gunung berapi berdiri kokoh di atas fondasi batuan sedimen, granit, dan mafik setebal 95px dengan 5 lipatan antiklinal yang megah.

3. **🏃 Kepanikan & Evakuasi Darurat NPC Menjauh dari Area Terbentuk Gunung**:
   - Menghubungkan getaran gempa bumi tektonik (`convergentProgress` & `convergentShake`) dengan kecerdasan buatan (AI) pergerakan NPC:
     - **Dr. Farhan**: Awalnya berada di area barat ($X = 460$). Saat gempa terjadi ($p > 0.04$), ia panik dan berlari kencang (`state: 'walk_left'`, `dir: 'left'`) ke arah barat menjauh dari zona tumbukan hingga mencapai dataran aman di $X = 220$.
     - **Prof. Ratna**: Awalnya berada di lereng timur ($X = 740$). Saat gempa terjadi, ia panik dan berlari kencang (`state: 'walk_right'`, `dir: 'right'`) ke arah timur menjauh dari lereng gunung yang sedang meninggi hingga mencapai dataran aman di $X = 1000$.
   - **Efek Visual Kepanikan**: Dilengkapi badge tanda seru darurat berkedip `[ ! ]` warna merah menyala dengan butiran keringat melayang di atas kepala NPC saat mereka melarikan diri.
   - **Audio Gemuruh Gempa**: Menghidupkan sintesis audio gemuruh tremor gempa bumi (*earthquake rumble*) secara berkala selama durasi tumbukan.
   - **Replayability & Sinkronisasi Presisi**: Saat pemain menekan tombol **`[↺ ULANG]`** atau berganti mode, posisi NPC otomatis di-reset ke titik awal agar animasi kepanikan dan pembentukan gunung dapat diputar ulang secara interaktif kapan pun. Koordinat interaksi (`zone.objects`) selalu tersinkronisasi 100% dengan posisi terkini NPC.

---

### Bab 80: Overhaul Total Pos Pengamatan Merapi (Area 4 Level 2), Redesain Seismograf Vektor Edukatif & Penskalaan Proporsional Furnitur, Eliminasi Emoji ke Ikon Pixel Art 2D SVG, Gelombang Seismogram Sketsa Pensil 4 Status, Prompt Interaksi Pintu Luar [E] / Enter, dan Kontrol Sentuh Mobile Borderless Transparan (Level 1 & Level 2)

**Tanggal:** 30 September 2026  
**Status:** Selesai & Terverifikasi Penuh (`npm run build` Lolos Bersih 0 Error, 2.24s)

#### Berkas yang Dimodifikasi:
- [`src/app/Level2/SeismographModal.tsx`](./src/app/Level2/SeismographModal.tsx)
- [`src/app/Level2/engine/renderer.ts`](./src/app/Level2/engine/renderer.ts)
- [`src/app/Level2/engine/gameEngine.ts`](./src/app/Level2/engine/gameEngine.ts)
- [`src/app/Level2/engine/TectonicGame.tsx`](./src/app/Level2/engine/TectonicGame.tsx)
- [`src/app/Level1/EarthDive/EarthDiveGame.tsx`](./src/app/Level1/EarthDive/EarthDiveGame.tsx)
- [`src/components/PixelIcon.tsx`](./src/components/PixelIcon.tsx)
- [`src/app/Level2/dialogueDataL2.ts`](./src/app/Level2/dialogueDataL2.ts)
- [`src/app/Level2/level2Data.ts`](./src/app/Level2/level2Data.ts)
- [`src/app/Level2/engine/zones.ts`](./src/app/Level2/engine/zones.ts)

#### Rincian Penyempurnaan & Solusi Teknis:

1. **🏥 Pasien Rawat pada Kasur Medis Tenda Evakuasi (Area 3 Level 2)**:
   - Di Area 3 (Lapangan Evakuasi Sekolah), tenda posko medis BNPB kini dilengkapi figur pasien pixel art yang sedang berbaring istirahat di atas ranjang kasur lipat medis (*field hospital cot*).
   - Menambahkan selimut putih bergaris abu-abu, bantal medis, serta tiang infus cairan elektrolit (*IV drip stand*) dengan botol cairan bening dan selang infus yang terhubung lembut ke sisi kasur, memperkuat nuansa penanganan medis darurat pascabencana yang hidup dan nyata.

2. **🔄 Penukaran Posisi Bangunan & NPC Area 4 serta Migrasi Materi 1 Status Merapi**:
   - **Pertukaran Bangunan**: Posisi bangunan di Area 4 ditukar posisinya:
     - **Plaza Status Gunung Merapi (PVMBG)** beserta **Relawan Mbak Rina** dipindahkan ke **bagian depan/luar** ($X \approx 500..650$).
     - **Gedung Pos Pengamatan Merapi (PGA)** beserta **Pak Surya** dipindahkan ke **bagian belakang/dalam** ($X \approx 900..1050$).
   - **Migrasi Materi 1 (Pengenalan Status Gunung Merapi)**: Materi edukasi 4 Tingkat Aktivitas Gunung Api (Normal, Waspada, Siaga, Awas) dipindahkan dari dialog Pak Surya ke **Relawan Mbak Rina** di Plaza Status Gunung Merapi, karena relawan lapangan inilah yang bertugas mengedukasi warga mengenai papan status.
   - **Fokus Pak Surya**: Pak Surya kini berfokus penuh sebagai Kepala Pos PGA yang mengajak siswa masuk ke dalam ruang observasi untuk mempelajari cara kerja alat seismograf dan memantau rekaman aktivitas Merapi secara langsung.

3. **📊 Redesain Total Diagram Seismograf Vektor Mekanik & Telemetri Edukatif (`SeismographModal.tsx`)**:
   - Merombak total modal seismograf menjadi beresolusi tinggi, berdaya baca prima (*high legibility*), dan bebas dari penumpukan teks (*zero text overlapping*).
   - **Diagram Vektor Mekanik Proporsional (`viewBox="0 0 740 330"`)**:
     - **Fondasi Batuan Padat (*Bedrock Mount*)**: Blok batuan kokoh tertanam di kerak bumi (`#1e293b`).
     - **Rangka Penyangga Kaku (*Rigid Frame*)**: Tiang baja abu-abu tebal yang ikut bergetar bersama tanah saat gelombang seismik tiba.
     - **Pegas Fleksibel (*Coil Spring*)**: Pegas spiral baja lentur (`#94a3b8`) yang menggantungkan massa inersia.
     - **Massa Inersia Emas Menyala (*Inertial Heavy Mass*)**: Bola pemberat silinder emas bergradasi (`#facc15` ke `#ca8a04`) dengan bobot berat yang **cenderung tetap diam akibat kelembaman (Hukum Inersia)**.
     - **Lengan Stylus Kaku (*Rigid Stylus Arm*)**: Batang pena tuas mekanis presisi.
     - **Jarum Tinta Merah (*Red Ink Stylus*)**: Ujung jarum runcing merah menyala (`#ef4444`) yang menempel di kertas drum.
     - **Drum Silinder Berputar (*Revolving Paper Drum*)**: Tabung silinder berputar konstan dengan kertas grafik bergaris kisi seismogram, merekam goresan getaran secara kontinu.
   - **3 Kartu Sains Interaktif & Edukatif**:
     - *1. Prinsip Hukum Kelembaman (Inersia)*: Menjelaskan mengapa beban pemberat tetap diam sementara tanah dan drum bergetar.
     - *2. Pencatatan Kontinu pada Drum*: Menjelaskan bagaimana perputaran drum merekam amplitudo dan frekuensi gelombang secara real-time.
     - *3. Sensor Geofon & Telemetri Digital*: Menjelaskan transisi dari alat mekanik ke sensor geofon elektronik yang mentransmisikan sinyal radio FM 151.7 MHz langsung dari lereng kawah Merapi ke Pos PGA.

4. **🪑 Penskalaan Ulang Proporsi Furnitur Pos Pengamatan Merapi Sesuai Karakter 24px (`renderer.ts`)**:
   - Mengatasi masalah furnitur raksasa (*oversized props*) di dalam ruangan indoor Pos Pengamatan Merapi. Seluruh perabot diskalakan ulang agar sebanding secara ergonomis dengan karakter siswa dan NPC (tinggi $24\text{px}$):
     - **Meja Observasi Utama**: Diturunkan ke elevasi setinggi pinggang karakter ($y = 342$, tinggi meja $18\text{px}$, panjang $110\text{px}$).
     - **Monitor Komputer Ganda**: Dikecilkan menjadi ukuran kompak ($18\times 12\text{px}$) pada elevasi mata ($y = 328$).
     - **Teropong Bintang / Teleskop Optik**: Dikecilkan proporsional pada tripod ramping dengan lensa sejajar pandangan mata ($y = 326$).
     - **Pintu Keluar Ruangan**: Diperkecil menjadi $32\times 48\text{px}$ (proporsional 2x tinggi karakter).
     - **Drum Seismograf Meja**: Dikecilkan menjadi tabung proporsional ($16\times 12\text{px}$) di atas dudukan meja stabil.

5. **🌋 Pemandangan Jendela Observasi Menghadap Gunung Merapi Otentik**:
   - Merombak pemandangan di balik jendela observasi kaca gedung PGA agar **100% identik dan konsisten dengan lanskap Gunung Merapi di map luar**:
     - Langit alpine biru cerah dengan sapuan awan stratus tipis melayang lambat.
     - Siluet kerucut Stratovolcano Merapi yang masif dengan takik kawah kawah aktif di sisi barat (*west crater notch*).
     - Kubah lava aktif membara di puncak kawah.
     - Alur lahar piroklastik alami (Kali Gendol dan Kali Krasak) yang mengalir menuruni lereng.
     - Hutan pinus hijau di kaki bukit lereng selatan.
     - Kepulan uap solfatara vulkanik putih alami menggunakan kurva sulur organik `drawRealisticVolcanicSmoke` tanpa lingkaran kaku.

6. **🎨 Standarisasi Ikon Pixel Art 2D Kustom (`PixelIcon.tsx`) & Eliminasi Fallback Dot**:
   - Menghapus seluruh emotikon OS modern bawaan sistem operasi (`📊`, `🔍`, `⚙️`, `⚡`, `↻`, dll.) dari antarmuka dialog dan modal materi.
   - Mengatasi masalah kemunculan titik hitam fallback dot (`●`) pada nama ikon tak dikenal dengan meregistrasikan ikon-ikon pixel art resmi di `PixelIcon.tsx`:
     - `chart` / `activity`: Bar chart pixel 4 tingkat dengan warna status resmi (Hijau, Kuning, Oranye, Merah).
     - `search`: Kaca pembesar pixel dengan lensa biru berkilau dan gagang kayu 8-bit.
     - `gear`: Roda gigi mekanik pixel art abu-abu metalik 8 gerigi.
     - `cross` / `x`: Tanda silang merah pixel berbingkai gelap untuk tombol tutup modal.
     - `volcano`: Gunung berapi aktif pixel dengan kawah magma menyala untuk header modal.

7. **📈 Rekonstruksi Bentuk Gelombang Seismogram 4 Baris Sesuai Sketsa Pensil Pengguna**:
   - Menggantikan formula sinusoidal acak dengan kurva matematika yang mereplikasi **sketsa pensil tangan 4 baris referensi pengguna secara presisi**:
     - **Status Normal (Level I - Hijau)**: Gelombang landai, santai, dan halus dengan jarak puncak renggang (3–4 ayunan bukit-lembah lembut tanpa sentakan tajam).
     - **Status Waspada (Level II - Kuning)**: Pulsa undulasi bertahap sedang (7–9 gelombang bergelombang halus dengan amplitudo sedang).
     - **Status Siaga (Level III - Jingga)**: Riak getaran rapat berfrekuensi tinggi (24 puncak gelombang rapat dengan amplitudo tegas mencerminkan gempa vulkanik dangkal).
     - **Status Awas (Level IV - Merah)**: Getaran tremor kontinu yang amat rapat, tajam, dan agresif tanpa jeda datar, merekam letusan erupsi dan aliran awan panas yang dahsyat.
   - Menghapus gelombang V-spike menyerupai denyut jantung (ECG) pada monitor dinding di `renderer.ts` agar seismograf murni merekam gelombang seismik bumi.

8. **⏱️ Sinkronisasi Animasi Jarum Stylus Drum Seismograf Status Normal**:
   - Di dalam ruangan indoor Pos Pengamatan Merapi, drum seismograf meja dan kertas seismogram dinding kini merekam animasi gelombang Status Normal yang halus dan tenang.
   - Jarum stylus merah (`needleX, needleY`) dianimasikan bergerak naik-turun secara real-time mengikuti persis kontur ketinggian gelombang kertas putar aktif, menciptakan ilusi alat mekanik yang bekerja hidup di depan mata pemain.

9. **🚪 Prompt Interaksi Mengambang Pintu Luar Pos Pengamatan Merapi `[E] / Enter`**:
   - Menambahkan kotak prompt interaksi mengambang `drawInteractionPromptL2(ctx, 946, 268, animTick)` di atas pintu luar gedung Pos Pengamatan Merapi saat karakter berada dalam radius dekat ($dist < 52\text{px}$).
   - Prompt didesain dengan gaya pixel retro: bingkai kuning menyala, latar hitam transparan, dan teks tebal `[E] / Enter` yang berdenyut lembut, memberikan panduan visual jelas kepada siswa untuk masuk ke dalam pos.

10. **📱 Kontrol Sentuh Mobile Borderless Transparan (Level 1 & Level 2)**:
    - Menghilangkan kotak hitam background pembungkus (*bounding box container*) berkelas `bg-slate-950/75 border-2 rounded-2xl` pada modul kontrol sentuh:
      - **D-Pad Analog 4 Arah**: Tombol navigasi (▲, ◀, ▼, ▶) kini melayang transparan langsung di atas kanvas permainan.
      - **Tombol Aksi**: Tombol `LONCAT` dan `[E] AKSI` kini melayang bebas transparan tanpa bingkai kotak hitam pembungkus.
    - Diterapkan secara seragam dan konsisten pada **Level 1** ([`EarthDiveGame.tsx`](./src/app/Level1/EarthDive/EarthDiveGame.tsx)) dan **Level 2** ([`TectonicGame.tsx`](./src/app/Level2/engine/TectonicGame.tsx)), sehingga bidang pandang permainan di smartphone dan tablet terasa 100% lapang, modern, dan imersif.

11. **🗺️ Penyelarasan Ilustrasi Temuan 2 Area 4: Visual Serasi per Tab (APD, Awan Panas, Lahar, Peta KRB 1.webp), Fitur Klik Perbesar (Lightbox Fullscreen), dan Panel Materi Kanan Scrollable**:
    - Di modal **Temuan 2 Area 4** ([`DiscoveryModal.tsx`](./src/app/Level2/DiscoveryModal.tsx)):
      - **Penyelarasan Visual per Materi**: Setiap materi kini memiliki visual yang serasi dan tepat sasaran:
        - *1. APD Masker & Baju*: Menampilkan diagram alat pelindung diri lengkap (Masker N95 penyaring $\ge 95\%$ partikel silika $< 2.5\ \mu\text{m}$, Kacamata Goggle rapat pelindung kornea mata, dan Pakaian Panjang Tertutup anti luka bakar sulfur).
        - *2. Bahaya Awan Panas*: Menampilkan ilustrasi kerucut Stratovolcano Gunung Merapi dengan kawah lava pijar dan awan panas guguran (*Wedhus Gembel*) pekat bergulung-gulung menuruni lereng timur ke dataran rumput (suhu $300^\circ\text{C}-800^\circ\text{C}$, kecepatan $100-300\text{ km/jam}$).
        - *3. Ancaman Lahar Hujan*: Menampilkan alur lembah sungai lahar (Kali Gendol & Krasak) yang dialiri bubur lumpur vulkanik pekat berarus deras dengan batu-batu andesit besar, menara sirine EWS (*Early Warning System*) lahar dengan strobo, dan rambu peringatan batas aman $300-500\text{ meter}$.
        - *4. Peta Zonasi KRB*: Menampilkan peta resmi Kawasan Rawan Bencana (KRB) Gunung Merapi ([`public/1.webp`](./public/1.webp)) lengkap dengan indikator beacon `● PETA KRB MERAPI (III, II, I)`.
      - **Fitur Klik untuk Perbesar (Fullscreen Lightbox Modal)**:
        - Kotak visual di kolom kiri kini interaktif (`cursor-pointer`) dengan efek hover border kuning amber dan badge mengambang `[🔍 KLIK UNTUK PERBESAR]`.
        - Saat diklik, membuka Lightbox Modal Fullscreen di tengah layar (`z-[100]`, backdrop blur hitam pekat `bg-black/95`) yang menampilkan gambar atau ilustrasi SVG dalam ukuran maksimal tajam (`max-h-[76vh]`), lengkap dengan header status, tombol `✕ TUTUP [ESC]`, dan dukungan tombol keyboard `Escape`.
      - **Panel Materi Kanan Scrollable (`overflow-y-auto`)**:
        - Kolom materi di sisi kanan dilengkapi utilitas scrollbar retro kustom `.custom-pixel-scroll` di [`index.css`](./src/index.css) sehingga pengguna dapat menggulir teks penjelasan, poin-poin edukatif, dan kotak arahan darurat secara bebas dan leluasa tanpa risiko teks terpotong (*overflow-safe*).

12. **🌋 Redesain Visual Awan Panas Temuan 2: Asap Bergulung Alami Bersih & Alur Magma Pijar Berkelok Organik (Anti Bulat-Bulat & Anti Lebay)**:
    - Di modal **Temuan 2 Area 4** ([`DiscoveryModal.tsx`](./src/app/Level2/DiscoveryModal.tsx)), pada tab *Bahaya Awan Panas (Wedhus Gembel)*:
      - **Asap Vulkanik Bergulung Alami & Proporsional (Anti Bulatan Kaku & Anti Lebay)**:
        - Menghapus 13 deretan lingkaran manik-manik kaku (`<circle>`) dan menghindari penggambaran yang terlalu rumit/lebay.
        - Membangun struktur gumpalan awan piroklastik bergulung alami (*natural billowing cumuliform ash plume*) yang menyatu padu menuruni lereng Merapi:
          - *Siluet Selimut Awan*: Kontur dasar abu gelap yang menyatukan seluruh formasi asap menjadi satu massa awan guguran utuh.
          - *Struktur 3 Layer Kedalaman*: Layer bawah (abu jelaga pekat `#09090b` - `#18181b`), layer tengah (abu andesit `#334155` - `#475569`), dan layer atas (abu silika terang `#94a3b8` - `#e2e8f0`).
          - *Aksen Lekukan Awan*: Highlight garis lengkung putih-abu lembut pada puncak gumpalan awan untuk memberikan ilusi volume 3D alami tanpa garis tajam yang berantakan.
          - *Uap Solfatara Putih*: Kepulan uap solfatara putih meliuk lembut dari mulut kawah puncak.
          - *Pendaran Bara Hangat*: Pantulan hangat lembut oranye-merah (`#c2410c`, opacity 0.3) di bawah alur awan dekat lereng gunung.
      - **Alur Magma Pijar Kental Berkelok Alami & Kubah Magma (Anti Garis Lurus Kaku)**:
        - Menghapus garis tunggal lurus kaku yang sebelumnya menyerupai tongkat oranye.
        - Membangun kawah puncak dengan kubah magma membara bertingkat (oranye, jingga, kuning).
        - Alur lelehan lava mengalir berkelok alami mengikuti punggungan lereng dengan pendaran halo oranye halus, inti pijar putih-kuning (`#fef08a`), cabang alur lava sekunder, dan percikan batu pijar di ujung aliran.
      - **Penyelarasan Tata Letak & Kebersihan UI**:
        - Mengeliminasi kotak-kotak label berlebih yang saling bertumpuk; hanya mempertahankan satu badge resmi yang rapi di pojok kiri atas: `AWAN PANAS (300°C - 800°C)`.
        - Visual 100% serasi dan proporsional dengan style seni vektor retro Level 2 dan tab-tab materi lainnya.

13. **⛩️ Transformasi Pintu Keluar Area 4 Menjadi Gapura Pedesaan Merapi / Desa Tangguh Bencana (`drawPosPgaExitGapura`)**:
    - **Akar Masalah**: Pintu keluar Area 4 (Pos Pengamatan Merapi) menuju Area 5 (Simulasi Erupsi) sebelumnya menggunakan `drawClassroomExitDoor` (pintu kelas sekolah bertembok kuning dan dua panel geser), sehingga tampak janggal dan tidak realistis berada di tepi jalan raya lereng gunung di samping Posko Siaga Destana.
    - **Solusi Rekayasa (`drawPosPgaExitGapura`) di [`renderer.ts`](./src/app/Level2/engine/renderer.ts)**:
      - *Pilar Gapura Bata Merah & Batu Andesit*: Dua pilar kokoh berundak dengan umpak kaki bertingkat khas arsitektur pedesaan Yogyakarta/Sleman lereng Merapi.
      - *Mahkota Atap Limasan / Mini Joglo*: Balok kayu jati melintang dengan susunan genteng terakota bertingkat dan ornamen pataka puncak gapura.
      - *Papan Plang Kayu Berbingkai*: Menampilkan teks `JALUR SIMULASI` dan subteks `MENUJU AREA 5 ➔` (hijau saat dibuka) atau `GERBANG TERKUNCI` (kuning-oranye saat terkunci).
      - *Lentera Pos Ronda*: Lentera retro pada bracket kayu di kedua tiang gapura dengan pendaran cahaya hangat.
      - *Lorong Jalan Terbuka*: Lorong tengah terbuka bebas dilewati dengan panah hijau lantai `➔` saat terbuka, serta palang rintangan portal bergaris serong kuning-hitam retro dengan gembok kecil saat terkunci.
      - *Banner Mengambang*: Banner floating beranimasi `[JALUR MENUJU SIMULASI ERUPSI]` di puncak gapura.

---

### Bab 73: Perombakan Total Level 2 Area 5: Simulasi Erupsi Merapi (Skenario Dual Skenario, Letusan Eksplosif 4 Fase PVMBG, Transisi 3 SubMap Lereng, Tiang Sirine EWS, Migrasi Satwa Liar, Letusan Balistik & Awan Panas, dan Evakuasi Truk BPBD)

**Tanggal:** 30 September 2026  
**Status:** Selesai & Terverifikasi Penuh (`npm run build` Lolos Bersih 0 Error, 4.19s, `tsc -b` Lolos 0 Error)

#### Berkas yang Dimodifikasi & Dibuat:
- [`src/app/Level2/VolcanoPhaseModal.tsx`](./src/app/Level2/VolcanoPhaseModal.tsx) *(Baru)*
- [`src/utils/retroAudio.ts`](./src/utils/retroAudio.ts)
- [`src/app/Level2/engine/gameEngine.ts`](./src/app/Level2/engine/gameEngine.ts)
- [`src/app/Level2/engine/renderer.ts`](./src/app/Level2/engine/renderer.ts)
- [`src/app/Level2/engine/TectonicGame.tsx`](./src/app/Level2/engine/TectonicGame.tsx)

#### Rincian Perombakan & Fitur Baru:

1. **🔘 Scenario Selector Bar di Header Level 2 Area 5 (Dual Skenario)**:
   - Mengadopsi sistem selektor skenario seperti simulasi gempa di Area 2.
   - Di posisi atas tengah ditampilkan bilah selektor interaktif:
     - **🔴 LEDAKAN EKSPLOSIF [AKTIF]**: Default skenario, menampilkan letusan gas bertekanan tinggi, kolom abu cauliflower vertikal masif, semburan bom piroklastik eflata balistik, awan panas bergulung, dan evakuasi dramatis.
     - **🟠 LEDAKAN EFUSIF**: Pilihan skenario alternatif dengan aliran lelehan lava pijar tenang dan pembentukan kubah lava.
   - Pilihan skenario terintegrasi mulus dengan audio seleksi retro dan inisialisasi ulang simulasi secara real-time.

2. **📜 Modal Transisi 4 Fase Status PVMBG Eksklusif Sesuai Desain Tangkapan Layar**:
   - Dibuat komponen modal mandiri [`VolcanoPhaseModal.tsx`](./src/app/Level2/VolcanoPhaseModal.tsx) dengan estetika pixel modern Navy gelap (`#0c162d`), bingkai aksen gold amber, ornamen sudut siku-siku keemasan (*gold corner brackets*), dan tipografi jernih terbaca (`Plus Jakarta Sans`).
   - Setiap fase memiliki informasi komprehensif:
     - **FASE 1: STATUS NORMAL (LEVEL I)**: Penjelasan kondisi tenang Merapi, ciri-ciri visual lereng yang asri, serta checklist pengamatan.
     - **FASE 2: STATUS WASPADA (LEVEL II)**: Penjelasan peningkatan gempa tremor & asap fumarol putih, instruksi menjauh 2 km dari bibir kawah.
     - **FASE 3: STATUS SIAGA (LEVEL III)**: Penjelasan erupsi skala kecil, dentuman berulang, migrasi satwa lereng, keharusan memakai APD Masker N95 & Tas Siaga, serta evakuasi 3–5 km.
     - **FASE 4: STATUS AWAS (LEVEL IV)**: Penjelasan erupsi eksplosif dahsyat, awan panas, bom eflata, aktivasi sirine peringatan dini EWS, penyelamatan warga dusun rentan, dan evakuasi bersama armada truk BPBD.

3. **🗺️ Arsitektur Progresi 3 SubMap (Visualisasi Jarak & Skala Gunung)**:
   - **SubMap 1 (Lereng Atas / Dekat Kawah < 2 km)**:
     - Skala gunung diperbesar sangat masif (`mountainScale = 1.45`, `merapiPeakY = 46`) menggambarkan posisi pemain sangat dekat dengan puncak Merapi.
     - Lingkungan dusun lereng dengan Posko Destana, Tiang Sirine EWS, pohon-pohon lereng rimbun hijau.
     - Truk evakuasi dihilangkan dari SubMap 1 & 2 karena evakuasi awal dilakukan mandiri berjalan/berlari menjauh dari zona bahaya puncak.
   - **SubMap 2 (Lereng Tengah 2–3 km)**:
     - Skala gunung ukuran sedang (`mountainScale = 1.0`, `merapiPeakY = 88`).
     - Latar pedesaan bervariasi: Rumah Joglo serambi kayu, pos ronda, rumah bata desa, warung dusun lereng, vegetasi mulai layu menguning, dan kabut abu tipis.
   - **SubMap 3 (Zona Aman & Penjemputan Evakuasi 5+ km)**:
     - Skala gunung mengecil di kejauhan (`mountainScale = 0.65`, `merapiPeakY = 138`).
     - Bangunan utama berganti dari Posko Destana kecil menjadi **KANTOR & POSKO UTAMA KEBENCANAAN BPBD** (`drawKantorBpbd` di $x: 420$), tiang sirine EWS dengan strobo aktif, dan **Mobil Evakuasi BPBD** (`drawEvacuationTruckBpbd` di $x: 1840$).

4. **🌋 Perombakan Total Letusan Eksplosif Realistis (Anti Segitiga Kaku)**:
   - Menghapus rendering segitiga tunggal memantul yang tidak realistis.
   - Mengimplementasikan sistem letusan eksplosif berlapis pada `drawMagmaExplosiveFountain`:
     - *Vertical Incandescent Gas Jet*: Semburan kolom gas vertikal bertekanan tinggi dengan warna inti putih-kuning menyala (`#fef08a`, `#f97316`).
     - *Expanding Multi-Tier Cauliflower Ash Cloud*: Gumpalan kubah awan abu pekat bertingkat berputar dinamis yang mengembang ke angkasa.
     - *Pyroclastic Density Currents (Awan Panas / Wedhus Gembel)*: Gulungan awan abu panas bersuhu tinggi yang menuruni lereng barat dan timur.
     - *Ballistic Volcanic Bombs (Eflata Pijar)*: Lontaran bongkahan batu pijar (`sim.volcanoBombs`) dengan lintasan parabola gravitasi realistis, jejak ekor asap (*smoke trails*), dan rotasi dinamis saat melayang di udara.
     - *Volcanic Lightning*: Sambaran kilat vulkanik acak yang memecah kegelapan awan abu akibat gesekan partikel silika statis.

5. **🚨 Tiang Sirine Peringatan Dini Bencana EWS (Menggantikan Kentongan)**:
   - Kentongan bambu digantikan sepenuhnya dengan **Tiang Sirine EWS Modern Merapi** (`drawTiangSirineEws` di $x: 376$).
   - Dilengkapi 4 corong megafon omnidirectional abu-abu metalik, panel surya cadangan daya, kotak kontrol listrik darurat dengan gembok, dan lampu strobo peringatan merah berkedip.
   - Ditopang synthesizer audio baru `playEwsSiren()` di [`retroAudio.ts`](./src/utils/retroAudio.ts) yang menghasilkan modulasi frekuensi ganda 550 Hz $\leftrightarrow$ 880 Hz khas sirine bencana kebencanaan PVMBG/BPBD.

6. **🦌 Migrasi Kawanan Satwa Liar Lereng (Bio-Indikator Geologis)**:
   - Di Fase 3 (Siaga), diimplementasikan kawanan satwa liar lereng yang berhamburan lari turun dari kiri ke kanan melintasi Dusun (`drawMigratingAnimals`):
     - **Kawanan Burung**: Kepakan sayap cepat terbang melintasi langit kelabu.
     - **Rusa Hutan**: Gerakan melompat dinamis menghindari getaran lereng.
     - **Kera Ekor Panjang**: Berlari beriringan menyelamatkan diri dari hawa panas kawah.
     - **Macan Tutul Jawa**: Bergerak lincah turun ke arah lembah.
   - Menjadi materi pembelajaran visual tentang bio-indikator alami kearifan lokal dalam mendeteksi kenaikan aktivitas magma.

7. **💬 Balon Dialog Interaktif Karakter & Status Banner PVMBG di Posisi Tengah Atas**:
   - Di Fase 1 (Normal), karakter pemain menampilkan balon dialog pixel art alami di atas kepala: *"Wuah indah banget tempat ini!"* sebelum otomatis bertransisi ke peningkatan status berikutnya.
   - Banner status `STATUS AKTIF PVMBG` dipindahkan tepat ke **posisi tengah atas (top center)** layar dengan ukuran yang diperbesar (lebar 460px, tinggi 78px), kontras tinggi, dan tipografi modern yang sangat jernih dan tegas (`Plus Jakarta Sans`).

8. **🛡️ Alur Penyelamatan Terpadu & Evakuasi Truk BPBD ke TEA**:
   - Fase 4 memandu pemain merasakan guncangan gempa bumi vulkanik 5.2 SR selama 2 detik sebelum letusan eksplosif terjadi.
   - Pemain berlari membunyikan sirine di Tiang EWS ($x: 376$), menyelamatkan 3 warga rentan (Mbah Tejo, Bu Siti, Dani) yang segera berlari menuju mobil evakuasi, lalu bersama seluruh relawan dan warga naik ke dalam Mobil Evakuasi BPBD ($x: 1840$) yang melaju kencang menyelamatkan seluruh warga ke Tempat Evakuasi Akhir (TEA).

---

### Bab 74: Penyempurnaan Area 5: Pembesaran Banner & Prompt Evakuasi, Eliminasi Gerbang Map 1 & Map 2, Mekanik Hilangnya Seluruh NPC di Batas Kanan, Periode Tenang Map 2, dan Cutscene "Beberapa Hari Kemudian..."

**Tanggal:** 30 September 2026  
**Status:** Selesai & Terverifikasi Penuh (`npm run build` Lolos Bersih 0 Error, 2.00s, `tsc -b` Lolos 0 Error)

#### Berkas yang Dimodifikasi:
- [`src/app/Level2/engine/gameEngine.ts`](./src/app/Level2/engine/gameEngine.ts)
- [`src/app/Level2/engine/renderer.ts`](./src/app/Level2/engine/renderer.ts)
- [`src/app/Level2/engine/TectonicGame.tsx`](./src/app/Level2/engine/TectonicGame.tsx)

#### Rincian Penyempurnaan:

1. **📏 Pembesaran & Penataan Posisi Banner Evakuasi Atas (`drawVolcanoEvacuateRightPrompt`)**:
   - Menurunkan posisi vertikal banner dari `cardY = 100` menjadi `cardY = 145`, memberikan jarak ruang bernapas yang cukup lega di bawah bilah selektor skenario atas (*anti-mepet*).
   - Memperbesar dimensi banner dari lebar 560px menjadi 700px (tinggi 82px).
   - Memperbesar ukuran teks judul menjadi `900 16.5px "Plus Jakarta Sans"` dan subteks menjadi `bold 13.5px "Plus Jakarta Sans"`.
   - Menambahkan ornamen sudut siku-siku keemasan/oranye (*corner brackets*) dan efek drop shadow tebal yang elegan.

2. **📢 Pembesaran & Penegasan Prompt Interaksi Bawah (`nearInteractablePrompt`)**:
   - Memperbesar kotak prompt interaksi melayang di bagian bawah layar pada [`TectonicGame.tsx`](./src/app/Level2/engine/TectonicGame.tsx):
     - Padding diperbesar menjadi `px-5 sm:px-6 py-2 sm:py-2.5 rounded-2xl`.
     - Teks dipertebal menjadi `font-bold text-xs sm:text-sm md:text-base text-amber-100`.
     - Border emas bercahaya `border-2 border-amber-400` dengan bayangan `shadow-[0_6px_24px_rgba(0,0,0,0.85)]`.

3. **🏃 Seluruh NPC Evakuasi Berlari & Menghilang di Batas Kanan Map**:
   - Memperbaiki bug NPC yang sebelumnya terdiam di jalan (termasuk Komandan Satria dan relawan):
     - Sekarang sistem mengiterasi **seluruh NPC** di `state.npcs` (Pak Joko, Mbak Rina, Mbah Tejo, Bu Siti, Dani, dan Komandan Satria).
     - Seluruh warga dan tim berlari secara serentak ke arah kanan menjauhi lereng Merapi.
     - Begitu NPC mencapai tepi kanan peta ($X \ge 2100\text{px}$), NPC langsung dihapus dari map (`state.npcs.delete(nid)`), menciptakan efek realistis seolah-olah mereka telah berhasil menyeberang ke peta berikutnya.

4. **🚫 Eliminasi Gerbang Rintangan di Map 1 & Map 2**:
   - Mengikuti arahan pengguna, rambu gerbang portal keluar (`drawVolcanoEvacuationExitGate`) **dihilangkan sepenuhnya** dari Map 1 dan Map 2.
   - Jalan raya membentang bebas tanpa halangan ke arah kanan. Begitu karakter pemain mencapai batas kanan peta ($X \ge 2100\text{px}$), pemain otomatis langsung diteleportasi secara mulus ke peta selanjutnya.

5. **🍃 Periode Tenang Dusun Lereng Tengah (Map 2) Sebelum Peningkatan Status**:
   - Saat tiba di Map 2, simulasi **TIDAK langsung membuka Fase 3 (Siaga)**.
   - Guncangan gempa vulkanik **berhenti total** (`shakeIntensity = 0`).
   - Seluruh warga dusun di-spawn kembali di pemukiman lereng tengah Map 2.
   - Pemain diberikan waktu selama $\approx 6$ detik (`fase2_map2_calm`) untuk berkeliling, melompat, dan mengamati pemukiman warga lereng tengah yang asri dan tenang sementara waktu, didampingi banner hijau zamrud: *"✓ DUSUN LERENG TENGAH: SITUASI TENANG SEMENTARA ✓"*.

6. **⏳ Cutscene Transisi Narasi "Beberapa Hari Kemudian..."**:
   - Setelah waktu tenang di Map 2 usai, layar menampilkan cutscene sinematik dramatis berdurasi 3 detik (`fase3_beberapa_hari_kemudian` / `drawVolcanoTimeSkipOverlay`):
     - Latar belakang redup bergradasi gelap dengan kartu narasi berbingkai sudut oranye.
     - Badge waktu: `⏳ BEBERAPA HARI KEMUDIAN...`.
     - Narasi geologis: *"Aktivitas magma di dalam perut Merapi kian bergolak hebat! Terjadi ratusan gempa vulkanik dangkal, guguran lava pijar berulang, dan suhu kawah melonjak drastis. PVMBG secara resmi menaikkan status menjadi SIAGA!"*.
     - Didukung alarm peringatan darurat sebelum membuka pop-up **Fase 3: Status Siaga**, disusul fenomena migrasi kawanan satwa liar.

---

### Bab 75: Integrasi Foto Nyata Lahar Dingin, Penyesuaian Tangga Pemukiman Area 6, Eliminasi Emoji Sistem Operasi ke Pixel Art 2D Lintas Level, Perbaikan Stale Closure Popup Interaksi NPC Level 2, serta Penyeragaman Total Desain Popup & Prompt [E] / Enter Antara Level 1 dan Level 2

**Tanggal:** 1 Oktober 2026  
**Status:** Selesai & Terverifikasi Penuh (`npm run build` Lolos Bersih 0 Error, 2.44s, `tsc -b` Lolos 0 Error)

#### Berkas yang Dimodifikasi:
- [`src/app/Level2/DiscoveryModal.tsx`](./src/app/Level2/DiscoveryModal.tsx)
- [`src/app/Level2/engine/renderer.ts`](./src/app/Level2/engine/renderer.ts)
- [`src/app/Level2/engine/TectonicGame.tsx`](./src/app/Level2/engine/TectonicGame.tsx)
- [`src/app/Level2/engine/npcManagerL2.ts`](./src/app/Level2/engine/npcManagerL2.ts)
- [`src/app/Level1/EarthDive/EarthDiveGame.tsx`](./src/app/Level1/EarthDive/EarthDiveGame.tsx)
- [`src/app/Level1/EarthDive/engine/renderer.ts`](./src/app/Level1/EarthDive/engine/renderer.ts)
- [`src/app/Level1/EarthDive/engine/sprites.ts`](./src/app/Level1/EarthDive/engine/sprites.ts)
- [`src/components/PixelIcon.tsx`](./src/components/PixelIcon.tsx)

#### Rincian Perubahan & Penyempurnaan:

1. **🌊 Integrasi Foto Nyata Dokumentasi Banjir Lahar Dingin**:
   - Berkas foto dokumentasi otentik (`images.jpeg`) disalin ke folder `public/images.jpeg` dan dihubungkan secara dinamis ke [`DiscoveryModal.tsx`](./src/app/Level2/DiscoveryModal.tsx).
   - Foto lahar hujan ini kini tampil pada:
     - **Temuan 3 Area 6 (Pasca Erupsi & Bahaya Lahar Dingin)**: Menggantikan visual ilustrasi sebelumnya dengan foto dokumentasi lapangan nyata banjir lahar dingin yang menerjang pemukiman dan aliran sungai.
     - **Tab 3 Temuan 2 Area 4 (EWS & Lahar Hujan)**: Menyelaraskan referensi edukasi visual bahaya sekunder erupsi Merapi dengan foto yang sama.
     - Terintegrasi penuh dengan fitur Lightbox Fullscreen saat foto diklik untuk inspeksi visual detail beresolusi tinggi.

2. **🪜 Penyesuaian Presisi Posisi Tangga Pemukiman Warga (Area 6)**:
   - Pada [`renderer.ts`](./src/app/Level2/engine/renderer.ts) (`drawDamagedHouse`), posisi tangga kayu inspeksi atap rumah warga disempurnakan:
     - Kaki tangga menapak mantap di permukaan tanah pada $y: 354$ lengkap dengan bantalan alas kayu (*foot pads*) dan bayangan jatuh (*cast shadow*).
     - Kemiringan tangga bersandar secara natural pada lereng genteng atap rumah di $y: 254$.
     - Dilengkapi 7 anak tangga (*rungs*) proporsional dan serat kayu jati bertekstur pixel art alami.

3. **👾 Eliminasi Total Emoji Sistem Operasi ke Gaya Pixel Art 2D Lintas Level**:
   - Menghapus seluruh sisa Unicode/OS emojis di seluruh modul Level 1 dan Level 2 untuk menjaga integritas visual retro 8-bit/16-bit yang konsisten dan menghindari inkonsistensi rendering antar-perangkat (Windows, Android, iOS, macOS).
   - Menambahkan dan memperluas definisi icon SVG pixel art kustom pada [`PixelIcon.tsx`](./src/components/PixelIcon.tsx):
     - `rain`: Awan mendung dengan butiran tetesan air hujan pixel.
     - `rock`: Bongkahan batu vulkanik andesit bersudut tajam.
     - `prohibited`: Simbol lingkaran garis diagonal merah larangan.
     - `runner`: Siluet orang berlari cepat evakuasi.
     - `siren`: Menara sirene peringatan dini EWS.
     - `dot-yellow`, `dot-red`, `dot-orange`: Indikator status titik pendaran warna pixel tajam tanpa fallback dot OS.

4. **🐛 Perbaikan Bug Stale Closure Popup Interaksi NPC Menempel di Level 2**:
   - **Diagnosis Masalah**: Pemain yang telah menjauh dari NPC (misal Pak Joko di Area 4) mendapati popup bawah *"TEKAN [E] ATAU TAP UNTUK BICARA DENGAN..."* tetap menempel di layar dan tidak pernah hilang.
   - **Akar Masalah**: Pada [`TectonicGame.tsx`](./src/app/Level2/engine/TectonicGame.tsx), perbandingan `state.nearInteractablePrompt !== nearInteractablePrompt` di dalam loop `requestAnimationFrame` terjebak dalam *stale closure* React (variabel `nearInteractablePrompt` di dalam closure bernilai `null` sejak render pertama). Ketika pemain menjauh dan engine mengembalikan `state.nearInteractablePrompt = null`, evaluasi `null !== null` bernilai `false`, sehingga `setNearInteractablePrompt(null)` tidak pernah dipanggil. Hal serupa juga terjadi pada `discoveredInArea`.
   - **Solusi**:
     - Memperkenalkan `nearPromptRef` dan `discoveredInAreaRef` untuk melacak nilai prompt dan temuan secara mutabel tanpa terpengaruh siklus re-render atau stale closure.
     - Kondisi sinkronisasi diubah menjadi:
       ```ts
       if (state.nearInteractablePrompt !== nearPromptRef.current) {
         nearPromptRef.current = state.nearInteractablePrompt;
         setNearInteractablePrompt(state.nearInteractablePrompt);
       }
       ```
     - Begitu pemain melangkah keluar dari jangkauan interaksi, popup langsung terhapus bersih seketika dari layar.
     - Memperketat radius deteksi interaksi NPC pada [`npcManagerL2.ts`](./src/app/Level2/engine/npcManagerL2.ts) menjadi 46px (`minDistance = 46`, `dist < 46`) agar deteksi sangat responsif dan tidak ada delay saat berjalan menjauh.

5. **✨ Standardisasi Gaya Popup Bawah Antara Level 1 dan Level 2**:
   - Menggantikan pill badge kecil di [`EarthDiveGame.tsx`](./src/app/Level1/EarthDive/EarthDiveGame.tsx) dengan desain **Card Popup Besar Level 2** yang mewah, berani, dan berdaya tarik visual tinggi:
     - Dimensi responsif: `w-[min(94vw,860px)] px-2 animate-bounce bottom-12 sm:bottom-14 left-1/2 -translate-x-1/2`.
     - Kontainer card: `bg-slate-950/98 text-amber-100 border-[3.5px] border-amber-400 px-5 sm:px-8 py-3.5 sm:py-4 rounded-3xl font-extrabold text-sm sm:text-base md:text-xl shadow-[0_12px_36px_rgba(0,0,0,0.95)] backdrop-blur-md flex items-center justify-center gap-3 sm:gap-4 text-center leading-snug font-sans`.
     - Ikon siaran bersinar: `<PixelIcon name="broadcast" size={24} className="text-amber-400 shrink-0 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />`.
     - Tipografi tebal tegas font Plus Jakarta Sans huruf kapital dengan pelacakan spasi lebar (`uppercase tracking-wide font-black`).
     - Seluruh tombol aksi portal (`portal_down`, `portal_up`, `challenge_gate`) mendukung klik/tap langsung dengan umpan balik visual `hover:border-amber-300 active:scale-95 transition-all cursor-pointer`.

6. **🏷️ Penyeragaman Teks & Kotak `[E] Bicara` Menjadi `[E] / Enter` (Level 1 & Level 2)**:
   - Pada [`renderer.ts`](./src/app/Level1/EarthDive/engine/renderer.ts) (Level 1) dan [`renderer.ts`](./src/app/Level2/engine/renderer.ts) (Level 2):
     - Mengubah teks prompt interaksi melayang di atas kepala NPC dari `[E] BICARA` menjadi `[E] / Enter` agar konsisten 100% dengan Level 2.
     - Mengeliminasi segitiga balon ucapan yang bulky dan menggantinya dengan kotak pill modern:
       - Latar: `rgba(0, 0, 0, 0.88)`
       - Bingkai: kuning `#facc15` dengan ketebalan 1.5px
       - Dimensi: tinggi 15px, lebar dinamis `Math.max(56, textW + 16)`
       - Tipografi: `'bold 8.5px "Plus Jakarta Sans", sans-serif'`, warna putih `#ffffff` sejajar vertikal di tengah.

7. **🚫 Eliminasi Tabrakan Banner Portal & Kotak Prompt di Level 1**:
   - **Masalah**: Pada Level 1 (misal Batas Transform / Area 8), banner portal digambar di `y - 16` dan prompt `[E] / Enter` digambar di `y - 14`, mengakibatkan teks `BATAS TRANSFORM` tertabrak dan tertutup langsung oleh kotak `[E] / Enter` (`▼ BA [E] / Enter RM ▼`).
   - **Solusi**:
     - Pada [`sprites.ts`](./src/app/Level1/EarthDive/engine/sprites.ts) (`drawPortal`), posisi vertikal banner portal dinaikkan ke `y - 38 + bob` dengan tinggi 18px.
     - Bentuk banner diperbarui menggunakan kartu rounded badge modern bergaya Level 2 (`rgba(15, 23, 42, 0.95)`, border neon `#22c55e` / `#38bdf8`, teks Plus Jakarta Sans).
     - Kotak prompt `[E] / Enter` pada [`renderer.ts`](./src/app/Level1/EarthDive/engine/renderer.ts) diposisikan di `y - 10 + bounce`, tepat di atas mesin kapsul dan berada rapi di bawah banner tanpa tumpang tindih.

---

### Bab 76: Standarisasi Total Karakter NPC Lintas Level 1 & Level 2 (5 Anggota Tim Resmi), Preservasi 16 Siswa Ruang Kelas SMP (Level 2 Area 2), Evaluator Tunggal Gerbang Bu Tyas, Sistem Floating Badge Pixel Kaca Pembesar [🔍], dan Redesain Maskot Resqy Burung Hantu 2D Pixel

**Tanggal:** 1 Oktober 2026  
**Status:** Selesai & Terverifikasi Penuh (`npm run build` Lolos Bersih 0 Error, 2.37s, `tsc -b` Lolos 0 Error)

#### Berkas yang Dimodifikasi:
- [`src/app/Level1/EarthDive/engine/npcSprites.ts`](./src/app/Level1/EarthDive/engine/npcSprites.ts)
- [`src/app/Level1/EarthDive/engine/npcManager.ts`](./src/app/Level1/EarthDive/engine/npcManager.ts)
- [`src/app/Level1/EarthDive/engine/renderer.ts`](./src/app/Level1/EarthDive/engine/renderer.ts)
- [`src/app/Level1/EarthDive/dialogueData.ts`](./src/app/Level1/EarthDive/dialogueData.ts)
- [`src/app/Level2/engine/npcSpritesL2.ts`](./src/app/Level2/engine/npcSpritesL2.ts)
- [`src/app/Level2/engine/npcManagerL2.ts`](./src/app/Level2/engine/npcManagerL2.ts)
- [`src/app/Level2/engine/renderer.ts`](./src/app/Level2/engine/renderer.ts)
- [`src/app/Level2/dialogueDataL2.ts`](./src/app/Level2/dialogueDataL2.ts)

#### Rincian Penyempurnaan & Implementasi:

1. **👥 Standardisasi Total Karakter NPC Lintas Level Menjadi 5 Anggota Tim Resmi**:
   - Seluruh NPC peneliti dan staf di seluruh zona Level 1 (Zona 0 s.d. Zona 7) dan seluruh area Level 2 (Area 1, 3, 4, 6) distandarisasi secara ketat menjadi 5 karakter tetap dengan visual pixel art dan kepribadian khas:
     - **Zidane**: Kulit putih bersih, rambut agak berantakan modern, kacamata hitam keren (*cool glasses*), pakaian serba hitam, kepribadian cerdas, analitis, tenang, dan *cool*.
     - **Zahra**: Paras cantik, imut, menggemaskan (*gemesin*), kacamata bulat berbingkai emas (*round gold spectacles*), kerudung biru langit/toska (*sky blue hijab*), pakaian pink pastel, kepribadian ceria, ramah, dan penuh semangat.
     - **Ican**: Rambut ikal mengembang bervolume (*curly voluminous hair*), kepribadian agak jahil (*playful/usil*), humoris, namun tetap mengedukasi dan peduli keselamatan.
     - **Lintang**: Kerudung hijau zamrud (*emerald green hijab*), kacamata baca, kepribadian cerdas, sistematis, metodis, dan terstruktur.
     - **Bu Tyas, M.Pd.**: Dosen pembimbing universitas, kacamata dosen elegan, kerudung hitam anggun, kepribadian bijaksana, berwibawa, penuh bimbingan, dan evaluator teliti.
   - Dilengkapi generator potret dada (*bust portrait*) besar pixel art 2D transparan beresolusi tajam (`getZidanePortrait`, `getZahraPortrait`, `getIcanPortrait`, `getLintangPortrait`, `getBuTyasPortrait`) yang tampil pada kotak dialog Visual Novel di Level 1 dan Level 2.

2. **🏫 Preservasi Penuh Ekosistem 16 Siswa Ruang Kelas SMP (Level 2 Area 2)**:
   - Sesuai instruksi khusus, skenario Ruang Kelas SMP (Area 2) dikecualikan dari pemangkasan NPC:
     - Seluruh 16 murid kelas (`CLASSROOM_STUDENTS_L2`: Rian, Dito, Siti, Budi, Fani, Edo, Maya, Reza, Dewi, Bayu, Tari, Doni, Lina, Agus, Putri, Gilang) **tetap dipertahankan 100% utuh**.
     - Posisi 16 murid duduk di bangku saat pembelajaran materi, 16 murid merunduk di kolong meja dengan ransel di atas kepala saat gempa bumi, dan 16 murid berbaris tertib dievakuasi keluar kelas tetap berjalan sempurna.
     - Karakter guru kelas distandarisasi dari Bu Rahma menjadi **Bu Tyas, M.Pd.** (`bu_tyas`), memimpin pembelajaran materi IPA Struktur Lapisan Bumi, memberi aba-aba darurat saat gempa, dan mengawal evakuasi siswa.

3. **🎓 Otoritas Evaluator Tunggal Gerbang Evaluasi oleh Bu Tyas, M.Pd.**:
   - Menghapus komandan militer atau penjaga gerbang acak. Seluruh evaluasi gerbang di kedua level kini dibina dan diuji secara resmi oleh **Bu Tyas, M.Pd.**:
     - **Level 1**: Tantangan tebak kata Wordle di Zona 1 (Kerak Bumi: `KERAK`, `BENUA`, `SAMUDRA`), Zona 2 (Mantel Bumi: `MANTEL`, `PANAS`, `KONVEKSI`), Zona 3 (Inti Luar: `NIKEL`, `CAIRAN`, `MAGNET`), Zona 4 (Inti Dalam: `BOLABESIPADAT`, `SEPULUHRIBU`, `PUSAT`), Zona 5 (Batas Divergen: `PANGEA`, `MENJAUH`, `MAGMA`), Zona 6 (Batas Konvergen: `SUBDUKSI`, `PALUNG`, `MERAPI`), dan Zona 7 (Batas Transform: `TRANSFORM`, `SANANDREAS`, `SISMOGRAF`).
     - **Level 2**: Tantangan Teka-Teki Silang (TTS) di Area 1 (Kelas SMP: `DROP`, `COVER`, `HOLD`, `EVAKUASI`), Area 3 (Lapangan Sekolah: `TITIKKUMPUL`, `AMBULANS`, `P3K`, `AMAN`), Area 4 (Pos PGA Merapi: `NORMAL`, `WASPADA`, `SIAGA`, `AWAS`), dan Area 6 (Pascabencana: `REHABILITASI`, `REKONSTRUKSI`, `LAHAR`, `TANGGUH`).

4. **🔍 Sistem Floating Badge Pixel 2D Kaca Pembesar [🔍] Penanda Materi Edukasi**:
   - Setiap NPC yang memegang materi edukasi (`hasMaterial: true`) kini menampilkan **lencana kaca pembesar pixel 2D melayang** di atas kepala mereka:
     - **Status Belum Dibaca**: Kaca pembesar berbingkai emas berdenyut halus (`#f59e0b` / `#fbbf24`), lensa biru transparan dengan titik kilau intan putih, dan pip seruan amber yang menarik perhatian siswa untuk berinteraksi.
     - **Status Sudah Dibaca**: Begitu siswa berbicara dan membaca modul sains terkait, lencana otomatis bertransisi menjadi kaca pembesar hijau zamrud keselamatan (`#059669` / `#10b981`) lengkap dengan tanda centang hijau putih (`✓`) di sudut kanan badge.
   - Diimplementasikan di kedua engine render: [`renderer.ts`](./src/app/Level1/EarthDive/engine/renderer.ts) (`drawNpcMaterialBadge`) dan [`renderer.ts`](./src/app/Level2/engine/renderer.ts) (`drawNpcMaterialBadgeL2`).

5. **🦉 Redesain Maskot Resqy Menjadi Burung Hantu 2D Pixel ("Kuk-kuuk!")**:
   - Karakter maskot Resqy dirombak total dari robot kotak mekanik menjadi **Burung Hantu Bijak 2D Pixel Art**:
     - Sprite in-world dan avatar portrait menampilkan bulu tubuh cokelat keemasan hangat (`#78350f` / `#b45309`), dada krem lembut (`#fef3c7`), sepasang mata bulat besar kuning menyala yang ekspresif (`#fef08a`), paruh oranye kecil melengkung, serta jambul telinga berbulu halus (*feather tufts*).
     - Gaya bicara khas burung hantu cerdas diawali dengan seruan ramah *"Kuk-kuuk!"*.
     - Berfungsi sebagai pemandu ekspedisi: memperkenalkan formasi 5 rekan tim di awal area, mengarahkan siswa mendekati rekan yang memiliki ikon kaca pembesar [🔍], dan mengingatkan bahwa Bu Tyas menanti di gerbang untuk evaluasi.

6. **🦺 Preservasi Baju / Outfit Khusus Lingkungan Ekstrem Level 1**:
   - Kostum karakter di Level 1 beradaptasi secara dinamis mengikuti kondisi ekstrem strata geologis:
     - **Kerak Bumi (Zona 1)**: Mining Suit (rompi keselamatan oranye menyala dengan strip reflektor abu-abu dan helm tambang kuning bersenter depan).
     - **Mantel, Inti Luar, & Inti Dalam (Zona 2, 3, 4)**: Cryo High-Tech Hazard Suit (baju pelindung termal putih-perak beraksen biru es penangkal panas 10.000°F).
     - **Batas Divergen (Zona 5)**: Scuba Diving Gear (baju selam neoprene hitam-biru, tabung oksigen ganda di punggung, dan masker selam transparan untuk navigasi bawah air).
     - **Permukaan (Zona 0), Konvergen (Zona 6), Transform (Zona 7), & Level 2**: Signature Casual/Formal Outfit (pakaian ciri khas masing-masing karakter).

7. **🛡️ Arsitektur Kompatibilitas Mundur Zero-Regression (Backward Compatibility Aliases)**:
   - Menghindari risiko regresi atau *broken save state*:
     - Seluruh ID NPC legacy (seperti `prof_raditya`, `dr_gea`, `dr_bayu`, `komandan_hendra`, `rian`, `bu_rahma`, `kak_fajar`, dll.) tetap didaftarkan sebagai alias sah di dalam `CHARACTER_PROFILES`, `DIALOGUE_REGISTRY`, dan `npcManager` map.
     - Save progress yang tersimpan di `localStorage` siswa lama tetap dapat dimuat dengan mulus tanpa error 404/undefined, sambil menampilkan nama, dialog, dan potret baru dari formasi 5 karakter resmi.

8. **🎯 Distribusi Alami Jumlah NPC per Area (Eliminasi Pemaksaan 5 NPC di Tiap Zona)**:
   - Sesuai arahan pengguna, tidak memaksakan kehadiran kelima karakter sekaligus di setiap area yang berpotensi menyebabkan kepadatan berlebih (*visual clutter*), melainkan mengembalikan jumlah NPC ke proporsi alami dan orisinalnya dengan karakter yang dipilih secara ketat dari 5 karakter inti (Zidane, Zahra, Ican, Lintang, Bu Tyas):
     - **Level 1 (Earth Dive)**:
       - Zona 0 (Permukaan Bumi): **2 NPC** (Zidane, Zahra).
       - Zona 1 (Kerak Bumi): **4 NPC** (Zidane, Lintang [🔍], Ican, Bu Tyas).
       - Zona 2 (Mantel Bumi): **5 NPC** (Zahra [🔍], Lintang [🔍], Zidane, Ican, Bu Tyas).
       - Zona 3 (Inti Luar): **5 NPC** (Zidane, Ican, Zahra [🔍], Lintang [🔍], Bu Tyas).
       - Zona 4 (Inti Dalam): **3 NPC** (Zidane [🔍 Bola Besi Padat], Zahra [🔍 Altar 6.371 km], Bu Tyas [Wordle Sintesis]) — mengembalikan suasana hening dan misterius pusat bumi tanpa kepadatan karakter idle.
       - Zona 5 (Batas Divergen): **5 NPC** (Zidane [🔍], Zahra [🔍], Ican [🔍], Lintang [🔍], Bu Tyas).
       - Zona 6 (Batas Konvergen): **4 NPC** (Zidane [🔍], Zahra [🔍], Ican, Bu Tyas).
       - Zona 7 (Batas Transform): **4 NPC** (Zidane [🔍], Ican, Zahra [🔍], Bu Tyas).
     - **Level 2 (Tectonic & Disaster Analyst)**:
       - Area 1 (Ruang Kelas SMP Teori): **5 NPC** (Zidane, Zahra, Ican, Lintang, Bu Tyas).
       - Area 2 (Ruang Kelas SMP Simulasi Gempa): **16 Siswa** (`CLASSROOM_STUDENTS_L2`) + **Bu Tyas, M.Pd.** + Maskot Resqy.
       - Area 3 (Lapangan Sekolah Pascabencana): **4 NPC** (Zidane [🔍 Titik Kumpul], Zahra [🔍 Triage Medis], Ican, Bu Tyas [TTS]).
       - Area 4 (Pos PGA Merapi & Plaza): **4 NPC** (Zidane, Zahra [🔍 Status Merapi], Lintang [🔍 Zonasi KRB], Bu Tyas [TTS]).
       - Area 5 (Simulasi Erupsi & Evakuasi Lereng): Maskot Resqy + Warga Destana (Pak Joko, Mbak Rina, Mbah Tejo, Bu Siti, Dani, Satria).
       - Area 6 (Barak Pengungsian Terpadu & Pascabencana): **5 NPC** (Zidane [🔍], Zahra [🔍], Ican, Lintang [🔍], Bu Tyas).

---

### Bab 77: Penyelarasan Materi Sains & Distribusi Proporsional NPC Lapisan Dalam (Mantel s.d. Inti Dalam), Koreksi Proksimitas Interaksi & Mismatch Dialog Batas Konvergen/Transform, Isolasi State Inti Dalam, Penyembunyian Radar Batas Tektonik, Relokasi Kontrol Kondisi Konvergen, dan Eliminasi NPC Zidane & Sismograf di Batas Transform

**Tanggal:** 2 Oktober 2026  
**Status:** Selesai & Terverifikasi Penuh (`npm run build` Lolos Bersih 0 Error, `tsc -b` Lolos 0 Error)

#### Berkas yang Dimodifikasi:
- [`src/app/Level1/EarthDive/engine/zones.ts`](./src/app/Level1/EarthDive/engine/zones.ts)
- [`src/app/Level1/EarthDive/engine/npcManager.ts`](./src/app/Level1/EarthDive/engine/npcManager.ts)
- [`src/app/Level1/EarthDive/engine/renderer.ts`](./src/app/Level1/EarthDive/engine/renderer.ts)
- [`src/app/Level1/EarthDive/EarthDiveGame.tsx`](./src/app/Level1/EarthDive/EarthDiveGame.tsx)
- [`src/app/Level1/EarthDive/dialogueData.ts`](./src/app/Level1/EarthDive/dialogueData.ts)
- [`src/app/Level1/EarthDive/earthDiveData.ts`](./src/app/Level1/EarthDive/earthDiveData.ts)

#### Rincian Penyempurnaan & Implementasi:

1. **🧹 Penyelarasan Materi Kerak Bumi (Zona 1 — Eksklusif pada Lintang)**:
   - Menghapus duplikasi materi pada NPC Zahra di Kerak Bumi. Materi komparasi ilmiah Kerak Benua (~100 km, batuan granit, Gunung Merapi) vs Kerak Samudra (5-15 km, batuan basal padat berat) kini dipegang secara eksklusif oleh **Lintang** (`hasMaterial: true`, `discoveryId: 0`).
   - Zahra di Kerak Bumi kini berperan sebagai penyambut penjelajah yang mengarahkan pemain ke pos riset Lintang, menjaga alur kurikulum tetap fokus dan tidak membingungkan siswa.

2. **🏷️ Standarisasi Penamaan Asli NPC (Eliminasi Label "Peneliti")**:
   - Seluruh sebutan generik "Peneliti" di prompt floating, judul dialog, dan naskah percakapan diubah menjadi nama asli masing-masing karakter: **Zidane, Zahra, Ican, Lintang, dan Bu Tyas**.
   - Meningkatkan ikatan emosional dan pengenalan karakter tim bagi siswa SMP kelas 8.

3. **📉 Distribusi Proporsional NPC Lapisan Dalam (Makin Dalam, Makin Sedikit NPC)**:
   - Sesuai prinsip eksplorasi geologis *"makin dalam lapisannya, makin sedikit NPC-nya"*, jumlah karakter di strata terdalam dipangkas dari keramaian awal menjadi hanya NPC pembawa materi edukasi (`hasMaterial: true`) dan evaluator akhir Bu Tyas:
     - **Mantel Bumi (Zona 2)**: 3 NPC — **Zahra** [🔍 Arus Panas Konveksi], **Lintang** [🔍 Lapisan Mantel 2.900 km], dan **Bu Tyas** [Evaluator Wordle].
     - **Inti Luar (Zona 3)**: 3 NPC — **Zahra** [🔍 Dinamo Geoelektrik Logam Cair], **Lintang** [🔍 Medan Magnet Pelindung Bumi], dan **Bu Tyas** [Evaluator Wordle].
     - **Inti Dalam (Zona 4)**: 3 NPC — **Zidane** [🔍 Bola Besi Padat Tahan Leleh], **Zahra** [🔍 Titik Nol Gravitasi Pusat Bumi 6.371 km], dan **Bu Tyas** [Evaluator Wordle].
   - Menciptakan atmosfer petualangan bawah tanah yang sunyi, misterius, dan dramatis tanpa mengurangi satu pun materi ajar kurikulum.

4. **✂️ Pembersihan Duplikasi Materi di Batas Divergen (Zona 5)**:
   - Menghapus modul materi kedua dari NPC Ican di Batas Divergen sehingga materi pemekaran lempeng dan pembentukan samudra baru dipegang murni oleh **Lintang**, menghilangkan kebingungan siswa membaca materi kembar.

5. **🎯 Koreksi Presisi Jarak Proksimitas Interaksi di Batas Konvergen (Zona 6)**:
   - Memperbaiki koordinat dan ambang batas deteksi interaksi NPC Zidane dan Zahra di Batas Konvergen.
   - Mengatasi anomali di mana tombol `[E] / Enter` sebelumnya dapat ditekan dari kejauhan atau posisi pemain tidak serasi dengan posisi fisik NPC. Kini tombol interaksi hanya aktif saat karakter pemain berada tepat di dekat NPC target.

6. **🔒 Isolasi State Penemuan Terpisah di Inti Dalam (Zona 4)**:
   - Memperbaiki bug keterkaitan state (*state bleeding*) di mana saat pemain baru membaca salah satu materi di Inti Dalam (misal hanya membaca materi Zidane), kedua materi langsung keliru ditandai telah dibaca (`ic_disc1` dan `ic_disc2`).
   - Mengisolasi penandaan dan persistensi `ic_disc1` dan `ic_disc2` secara independen baik pada in-memory game state maupun di `localStorage`, memastikan siswa wajib membaca kedua materi sebelum dapat membuka tantangan evaluasi.

7. **🦉 Penyempurnaan Narasi Resqy & Penghapusan Tombol Ekstra `[🦉 INFO 2 KONDISI]`**:
   - Memperbarui naskah dialog Maskot Resqy di Batas Konvergen agar secara komprehensif menguraikan 2 kondisi tumbukan lempeng tektonik:
     - Kondisi 1: Tumbukan Benua-Benua (Daratan) yang melipat kerak bumi menjadi pegunungan lipatan tinggi dan busur vulkanik.
     - Kondisi 2: Tumbukan Samudra-Benua (Lautan) di mana lempeng samudra yang lebih berat menunjam ke bawah mantel, membentuk palung laut dalam dan busur kepulauan api.
   - Menghapus tombol ekstra `[🦉 INFO 2 KONDISI]` di bilah atas Batas Konvergen atas arahan pengguna agar antarmuka HUD bersih dan bebas clutter.

8. **🔄 Resolusi Mismatch Dialog di Batas Konvergen & Batas Transform**:
   - Memperbaiki bug tertukarnya alur percakapan:
     - Berbicara dengan Zidane di Batas Konvergen sebelumnya keliru memunculkan dialog Zahra.
     - Berbicara dengan Ican sebelumnya keliru memunculkan dialog Zidane.
   - Menyelaraskan seluruh `npcSpeakerId`, `CHARACTER_PROFILES`, dan relasi `DIALOGUE_REGISTRY` di `dialogueData.ts`.

9. **🗺️ Penyembunyian Radar Mini-Map di Seluruh Zona Batas Tektonik**:
   - Menyembunyikan radar preview peta (`RADAR BUMI`) untuk seluruh zona batas tektonik (`hudData.zoneIndex >= 5` di `EarthDiveGame.tsx`: Batas Divergen, Batas Konvergen, dan Batas Transform) agar pandangan pemain lapang dan fokus mengamati simulasi lempeng langsung di kanvas 2D.

10. **↗️ Relokasi Kontrol Pilihan Kondisi Konvergen ke Pojok Kanan Atas**:
    - Memindahkan tombol selector kondisi (`DARATAN`, `LAUTAN`, `ULANG`) dari bagian tengah atas ke **pojok kanan atas** layar dengan tata letak vertikal `pointer-events-auto flex flex-col items-end gap-1`, serasi dan konsisten dengan tombol kontrol simulasi gempa dan erupsi di Level 2.

11. **🚫 Eliminasi Penuh NPC Zidane & Materi Sismograf di Batas Transform (Zona 7)**:
    - Menghapus objek NPC Zidane (`z7_npc_zidane`) dari `zones.ts` dan inisialisasi state NPC di `npcManager.ts`.
    - Menghapus ketergantungan modul materi Temuan 15 ("Temuan 1: Sismograf & Bukti 20 Lempeng Bumi", `trans_seismo`) dari syarat pembukaan gerbang evaluasi Bu Tyas (`transform_challenge`).
    - Syarat gerbang akhir Batas Transform kini murni hanya memerlukan **Temuan 16** (Zahra: Sesar San Andreas & Wallace Creek).
    - Memperbarui discovery stratum Zona 7 di `earthDiveData.ts` menjadi San Andreas (`disc-transform-sanandreas`).
    - Menyelaraskan seluruh dialog Resqy, Ican, Lintang, dan Bu Tyas di `dialogueData.ts` sehingga bebas dari referensi terhadap Zidane maupun instrumen sismograf.

12. **🔍 Penyeragaman Total Desain Floating Badge Materi Edukasi [🔍] Level 2 Mengikuti Level 1**:
    - Menggantikan desain pin lingkaran lama di Level 2 (`drawNpcMaterialBadgeL2`) menjadi desain resmi kotak badge melayang seperti di Level 1 (`drawNpcMaterialBadge`).
    - Menampilkan kartu pill melayang (`pillW: 68, pillH: 17`) berbingkai emas/zamrud dengan pointer segitiga ke arah kepala NPC, ikon pixel art kaca pembesar (lensa cyan + gagang diagonal kayu/emas), dan teks status tebal `MATERI` (kuning) saat belum dibaca serta `BACA ✓` (hijau) saat sudah dibaca.
    - Menyelaraskan elevasi floating badge di Level 2 (`npc.y - 38`) sehingga bertengger sempurna di atas kepala karakter, seragam 100% dengan Level 1.

---

### Bab 78: Transformasi Area 4, 5, dan 6 Level 2: Relokasi & Konsistensi NPC Pos PGA (Zidane & Zahra), Perbesaran Tipografi Materi Edukasi & Integrasi Foto Nyata Wedhus Gembel, Penonaktifan Interaksi NPC Selama Simulasi Erupsi, Presisi Plang Posko BPBD, dan Konversi Kapsul Akhir Menjadi Mobil Truk Evakuasi Resmi BNPB/BPBD

**Tanggal:** 2 Oktober 2026  
**Status:** Selesai & Terverifikasi Penuh (`npm run build` Lolos Bersih 0 Error, Vite PWA Sukses)

#### Berkas yang Dimodifikasi:
- [`src/app/Level2/engine/npcManagerL2.ts`](./src/app/Level2/engine/npcManagerL2.ts)
- [`src/app/Level2/engine/gameEngine.ts`](./src/app/Level2/engine/gameEngine.ts)
- [`src/app/Level2/engine/renderer.ts`](./src/app/Level2/engine/renderer.ts)
- [`src/app/Level2/engine/TectonicGame.tsx`](./src/app/Level2/engine/TectonicGame.tsx)
- [`src/app/Level2/engine/zones.ts`](./src/app/Level2/engine/zones.ts)
- [`src/app/Level2/DiscoveryModal.tsx`](./src/app/Level2/DiscoveryModal.tsx)
- [`src/app/Level2/SeismographModal.tsx`](./src/app/Level2/SeismographModal.tsx)
- [`public/wedhus_gembel.jpg`](./public/wedhus_gembel.jpg)

#### Rincian Penyempurnaan & Implementasi:

1. **🏛️ Relokasi & Standarisasi Karakter NPC di Pos Pengamatan Merapi (PGA - Area 4)**:
   - **Zidane Masuk ke Dalam Pos PGA**: Memindahkan NPC Zidane ke dalam ruangan indoor Pos Pengamatan Merapi (`x: 350, y: 350`) bertugas di depan meja instrumen seismograf telemetri digital dan monitor pengawasan visual Merapi.
   - **Eliminasi Karakter Duplikat (Pak Surya)**: Karakter lama "Pak Surya" di dalam posko dihapus sepenuhnya dari `initNpcsL2` dan alur interaksi ruangan, menegakkan prinsip 5 karakter inti (Zidane, Zahra, Ican, Lintang, Bu Tyas) tanpa NPC asing.
   - **Zahra Dimajukan ke Lereng Luar**: Zahra diposisikan di lereng luar posko pada koordinat awal Zidane (`x: 380, y: 350`) sebagai peneliti seismik dan vulkanologi terdepan yang memandu siswa mempelajari aktivitas erupsi.
   - **Penyesuaian Busana / Outfit Tematik**:
     - Zahra dan Lintang mengenakan seragam petugas medis / relawan kesehatan lapangan (`medical_field`) dengan aksen rompi keselamatan lapangan.
     - Bu Tyas mengenakan seragam kebaya/batik guru formal (`teacher_kebaya`) yang anggun dan berwibawa sebagai evaluator ujian TTS.

2. **🔍 Perbesaran Tipografi Materi Edukasi & Penggantian Gambar Asli Wedhus Gembel (Area 4)**:
   - **Perbesaran Font Materi di Sisi Kanan Gambar**:
     - Mengoptimalkan seluruh ukuran font materi geologi vulkanik di [`DiscoveryModal.tsx`](./src/app/Level2/DiscoveryModal.tsx) dan [`SeismographModal.tsx`](./src/app/Level2/SeismographModal.tsx).
     - Judul modul, sub-heading, deskripsi fenomena ilmiah, dan poin mitigasi diperbesar proporsinya sehingga mudah dibaca secara nyaman pada resolusi layar laptop, desktop, maupun tablet tanpa menyisakan ruang kosong berlebih.
     - Materi Temuan 1 Zahra (Indikator Seismik & Status Aktivitas Vulkanik), Temuan 2 Lintang (Awan Panas Guguran & Zonasi KRB), dan Lab Seismograf Zidane mendapatkan peningkatan daya baca tipografis yang seragam.
   - **Integrasi Foto Asli Awan Panas Guguran (Wedhus Gembel)**:
     - Mengganti diagram ilustrasi SVG lama pada Temuan 2 (Tab 2: Bahaya Awan Panas) dengan **foto dokumentasi nyata letusan erupsi Gunung Merapi** dari berkas `images (1).jpeg`.
     - Foto diintegrasikan ke direktori publik sebagai [`public/wedhus_gembel.jpg`](./public/wedhus_gembel.jpg) (dengan fallback multi-format aman).
     - Dimensi tampilan gambar di dalam modal diperbesar memenuhi kotak wadah visual (*full container coverage*), menghasilkan kesan dramatis, autentik, dan menggugah kesadaran mitigasi siswa.

3. **🚨 Penonaktifan Interaksi Dialog NPC Selama Simulasi Erupsi Berlangsung (Area 5)**:
   - **Parameter Kontrol Interaksi (`allowInteraction`)**:
     - Menambahkan parameter `allowInteraction: boolean = true` pada fungsi `updateNpcsL2` di [`npcManagerL2.ts`](./src/app/Level2/engine/npcManagerL2.ts).
   - **Guard Simulasi Erupsi Aktif (`isVolcanoSimActive`)**:
     - Di [`gameEngine.ts`](./src/app/Level2/engine/gameEngine.ts), saat fase simulasi erupsi aktif (`volcanoSimActive === true`), sistem mengirimkan `allowInteraction = false` ke `updateNpcsL2`.
     - NPC warga lereng Destana tetap berpatroli santai di latar belakang sebagai elemen atmosfer hidup (*ambient crowd*), tetapi tidak berputar menghadap pemain (`facePlayer = false`) dan seluruh flag `isNearPlayer` dimatikan.
     - Balon prompt `[E] Bicara` di atas kepala NPC disembunyikan di [`renderer.ts`](./src/app/Level2/engine/renderer.ts), sehingga prompt instruksi darurat simulasi (pengambilan masker/kacamata APD, aktivasi sirine EWS, evakuasi warga dan evakuasi mobil) tidak terhalang atau tertimpa dialog santai NPC.
   - **Proteksi Klik Canvas**:
     - Di [`TectonicGame.tsx`](./src/app/Level2/engine/TectonicGame.tsx), event klik mouse/tap layar pada NPC diblokir saat simulasi erupsi berjalan, mengarahkan klik murni untuk memicu tindakan tanggap darurat simulasi.

4. **🏷️ Perbaikan Presisi Plang Nama Kantor & Posko Utama BPBD (Map 3 Area 5)**:
   - **Resolusi Masalah Teks Keluar Kotak (*Text Clipping/Overflow*)**:
     - Pada fungsi `drawKantorBpbd` di [`renderer.ts`](./src/app/Level2/engine/renderer.ts), papan plang nama diperlebar dari 128px menjadi **146px × 24px** (`boardW = 146, boardH = 24`).
     - Badge oranye akronim `BPBD` di sisi kiri diperlebar dari 18px menjadi **28px** dengan font `bold 7px` dan pembatas lebar aman `maxWidth = 22px`.
     - Teks baris atas: `POSKO UTAMA BENCANA` (font tebal `bold 8px`, `maxWidth = 105px`).
     - Teks baris bawah: `KABUPATEN SLEMAN / YOGYAKARTA` (font tebal `bold 6.5px`, `maxWidth = 105px`).
     - Seluruh teks dan badge terpusat rapi di dalam garis tepi plang kayu ganda, 100% bebas dari risiko terpotong atau menembus bingkai plang.

5. **🚒 Transformasi Objek Kapsul Akhir Menjadi Mobil Truk Evakuasi Rescue Resmi BPBD (Area 6)**:
   - **Adopsi Penuh Truk Evakuasi Area Simulasi**:
     - Mengubah objek kapsul pendarat fiksi ilmiah lama di Area 6 menjadi **Mobil Truk Evakuasi Rescue BPBD** yang 100% identik dengan truk penyelamatan warga pada simulasi Area 5.
     - Fungsi `drawFinalEvacuationCapsuleL2` di [`renderer.ts`](./src/app/Level2/engine/renderer.ts) kini memanggil langsung mesin perender truk evakuasi resmi: `drawEvacuationRescueTruck(ctx, px, py - 4, 'parked', animTick)`.
     - Tampil perkasa di atas aspal jalan raya (`py: 360`) dengan bodi oranye tangguh BPBD, lis garis hazard chevron kuning-hitam K3, stensil identitas `BPBD RESCUE` dan `BPBD`, supir relawan di dalam kabin kaca, kanopi terpal atap pelindung, lampu rotator strobo darurat merah-biru, dan 3 roda truk besar bertapak ganda.
   - **Efek Visual Kesiapan Siaga (Saat Terbuka / Unlocked)**:
     - Sorot lampu depan kristal LED bertenaga tinggi menyinari aspal jalan ke arah kanan.
     - Kepulan asap knalpot halus dan partikel kilau emas kemenangan (*victory gold particles*).
   - **Pembaruan Badge Mengambang & Prompt Aksi**:
     - Saat terkunci: `MOBIL EVAKUASI TERKUNCI [BICARA DENGAN BU TYAS]`
     - Saat terbuka: `★ MOBIL EVAKUASI SIAP BERANGKAT! ★ [E] NAIK KE MOBIL & SELESAIKAN LEVEL 2`
     - Menyelaraskan teks konfigurasi zona di [`zones.ts`](./src/app/Level2/engine/zones.ts) dan dialog game engine di [`gameEngine.ts`](./src/app/Level2/engine/gameEngine.ts) dari "Kapsul Evakuasi" menjadi "Mobil Evakuasi".

6. **🎨 Penyelarasan Warna Garis Lembah Alur Gunung Merapi Area 5 (Identik dengan Area 6)**:
   - Menghapus warna garis cokelat kemerahan (`#451a03`) pada guratan lembah sungai lahar Gunung Merapi di Area 5 saat pasca-erupsi.
   - Mengubah `ctx.strokeStyle` menjadi warna slate alami `#334155` yang 100% serasi dan identik dengan tampilan siluet Merapi di Area 6 (Barak Pengungsian BPBD) pada [`renderer.ts`](./src/app/Level2/engine/renderer.ts).

7. **🌋 Animasi Lelehan Magma Letusan Eksplosif Menuruni Lereng (Sesuai Referensi Visual)**:
   - Mengimplementasikan sistem animasi progresif lelehan magma (`magmaFlowProgress`) yang mengalir turun secara dinamis dari puncak kawah (`topX, topY`) menuruni lereng Gunung Merapi selama letusan eksplosif berlangsung (Fase 4 Status AWAS) hingga bermuara ke kolam genangan dasar.
   - Mengadopsi alur morfologi cabang magma sesuai tangkapan layar referensi:
     - **Batang Utama**: Mengalir turun dari puncak kawah hingga titik percabangan.
     - **Cabang Kiri**: Mengalir miring ke kiri, mendatar melintasi lereng teras, berakhir pada lidah kolam rounded di kiri (`drawLavaTongue`), serta membelah terjun ke bawah membentuk kolam genangan magma dasar kiri (`drawLavaDeltaPool`).
     - **Cabang Kanan**: Melengkung ke kanan melintasi lereng, membentuk lidah magma tengah yang mencuat ke arah kiri, dan terjun vertikal ke bawah membentuk kolam genangan magma dasar kanan yang luas membara.
     - **Busur Semburan Lava Puncak**: 4 busur parabola semburan lava pijar (`drawCraterLavaSprayArcs`) dengan tetesan bola lava menyala di ujung busur.
   - Multi-layer visual rendering pada [`renderer.ts`](./src/app/Level2/engine/renderer.ts): kerak batuan gelap (`#991b1b`), bodi lelehan magma merah menyala (`#ef4444`), inti panas pijar kuning-oranye berdenyut (`#fef08a`), gelombang kilau aliran mengalir (`lineDashOffset`), kepala tetesan magma pijar terdepan saat mengalir aktif (`showLeadingHead`), dan gelembung letupan magma di permukaan kolam.
   - Sinkronisasi state mesin di [`gameEngine.ts`](./src/app/Level2/engine/gameEngine.ts) dari nilai `0.0` saat gempa berakhir dan letusan meledak hingga `1.0` (tuntas) serta tetap persisten membeku/membara di kondisi pasca-erupsi.

8. **✅ Verifikasi Build Produksi & Integritas Sistem**:
   - `npm run build` sukses 100% dengan status 0 error (exit code 0).
   - Seluruh modul PWA precache, bundle chunk `dist/`, dan asset images terverifikasi valid dan siap saji.

---

### Bab 79: Implementasi Skenario Erupsi Efusif Area 5 Level 2, Overhaul Animasi Lelehan Magma Seamless, Lanskap Hilir Sungai Dinamis Multi-Submap, Kepulan Asap Amorf Vulkanik Abu-Abu Kehitaman, dan Stabilisasi Tremor Evakuasi

**Tanggal:** 2 Oktober 2026  
**Status:** Selesai & Terverifikasi Penuh (`npm run build` Lolos Bersih 0 Error, Vite PWA Sukses)

#### Berkas yang Dimodifikasi:
- [`src/app/Level2/engine/gameEngine.ts`](./src/app/Level2/engine/gameEngine.ts)
- [`src/app/Level2/engine/renderer.ts`](./src/app/Level2/engine/renderer.ts)
- [`src/app/Level2/engine/TectonicGame.tsx`](./src/app/Level2/engine/TectonicGame.tsx)
- [`src/app/Level2/VolcanoPhaseModal.tsx`](./src/app/Level2/VolcanoPhaseModal.tsx)

#### Rincian Penyempurnaan & Implementasi:

1. **🌋 Overhaul Animasi Lelehan Magma Menuruni Lereng Merapi (Seamless & Flank Sesuai Sketsa Referensi)**:
   - **Flank Lereng Kiri & Kanan**: Menambahkan dua jalur aliran lava utama pada lereng kiri (dari bibir kawah kiri menyusuri punggungan hingga kaki gunung kiri) dan lereng kanan (menyusuri punggungan kanan di luar rumpun pohon) persis sesuai garis merah sketsa referensi pengguna.
   - **Deselerasi Laju Aliran Magma**: Memperlambat laju turunnya magma secara dramatis dari ~3 detik menjadi ~14 detik (`magmaFlowProgress += 0.0012` per frame) untuk menghadirkan kesan magma andesitik kental yang merayap perlahan dan realistis.
   - **Eliminasi Border Menjadi Tekstur Fluida Menyatu (*Seamless Multi-Pass*)**: Menghilangkan seluruh garis tepi luar kaku (`#991b1b` / `#7f1d1d`) yang sebelumnya memecah percabangan. Mengadopsi arsitektur rendering global multi-pass:
     - Pass 1: Dasar lava merah menyala tebal (`#ef4444`).
     - Pass 2: Lapisan transisi oranye hangat (`#f97316`).
     - Pass 3: Inti panas kuning membara (`#fef08a`).
     - Pass 4: Garis kilau tengah beranimasi dinamis (`#ffffff`).
     - Pass 5: Kepala tetesan lava terdepan saat mengalir aktif.
     - Pass 6: Lidah lava rounded dan kolam genangan dasar.
   - Seluruh cabang menyatu tanpa batas patahan (*seamless fluid blending*).

2. **🌋 Implementasi Penuh Skenario Erupsi Efusif (Area 5 Simulasi Gunung Meletus)**:
   - Mengintegrasikan skenario erupsi **Efusif** berdampingan dengan skenario **Eksplosif**, dapat dipilih secara bebas via tombol switcher di HUD atas (`EKSPLOSIF` / `EFUSIF`).
   - Menerapkan karakteristik vulkanologis tipe efusif yang otentik:
     - **Tekanan Gas Rendah**: Tanpa dentuman suara bom raksasa dan tanpa lontaran batu piroklastik jatuh dari langit (`volcanoBombs` dinonaktifkan).
     - **Magma Cair & Encer**: Mengalir luas menyelimuti lereng secara anggun dan tenang.
     - **Eliminasi Efek Ledakan Puncak**: Menghapus total busur semburan kawah (`drawCraterLavaSprayArcs`) pada kawah puncak sehingga murni menyisakan danau magma mendidih tenang di bibir kawah dan lelehan menuruni lereng.
     - **Getaran Tremor Ringan Konstan**: Mengganti guncangan gempa dahsyat 5.2 SR (`4.8 SR`) menjadi getaran tremor vulkanik halus (`0.7 - 0.8 SR`) yang stabil.

3. **🌊 Lanskap Hilir Sungai Dinamis Multi-Submap & Multi-Fase (Downstream Riverbank)**:
   - Menghadirkan bentang alam hilir sungai di dekat gunung khusus pada skenario efusif, merefleksikan posisi geografis pemukiman lereng:
     - **Map 1 (Dekat Sungai)**: Sungai terlihat lebar di latar depan, dibatasi oleh pagar kayu pengaman dan papan plang informasi peringatan banjir lahar dingin.
     - **Map 2 (Mulai Menjauh)**: Sungai menyempit dan tampak bergeser lebih jauh ke arah tengah lembah seiring karakter melangkah menjauh.
     - **Map 3 (Sangat Jauh)**: Sungai tampak sebagai pita air tipis di lembah dasar kaki gunung kejauhan.
   - **Resolusi Masalah Sungai Melayang di Map 3 (Zero Floating)**:
     - Mengoreksi urutan render: bukit kaki gunung (`drawVolcanoSimulationHills`) digambar terlebih dahulu sebagai latar belakang dasar, baru kemudian sungai digambar di atasnya.
     - Menghapus pembatasan `if (subMap <= 2)` pada lereng bantaran depan (*near bank slope*), sehingga lereng bukit depan digambar penuh di **seluruh SubMap (1, 2, dan 3)** menyambung kontinu dari bibir bawah sungai ($Y=254$) langsung ke lantai pemukiman ($Y=360$). Menutup 100% celah abu-abu di bawah sungai pada Map 3.
     - Meletakkan deretan pohon pinus alami di lereng bukit depan Map 3 sebagai pembingkai bentang alam.
   - **Evolusi Kekeruhan Air Alami Antar-Fase**:
     - *Fase 1 (Normal) & Fase 2 (Waspada)*: Air sungai mengalir jernih kebiruan alami.
     - *Fase 3 (Siaga)*: Air mulai keruh bersedimen abu-abu kehijauan akibat endapan material vulkanik awal dari hulu.
     - *Fase 4 (Awas)*: Air berubah menjadi keruh pekat sedimen vulkanik alami (warna abu-abu/cokelat pekat `#292524`, `#44403c`, `#334155`), bersih dari vena/warna merah menyala yang tidak realistis.
     - Menggantikan garis putus-putus marka jalan dengan riak arus gelombang sinusoidal kontinu yang mengalir alami.

4. **💨 Overhaul Realisme Kepulan Asap Vulkanik: Harmonic Perturbed Amorphous Billows & Palet Abu-Abu Kehitaman**:
   - Merombak total gaya asap dari bulatan-bulatan kaku lingkaran (`ctx.arc`) menjadi **Harmonic Perturbed Amorphous Polygons**.
   - Terdiri dari 28 kluster cumulus uap/asap dengan 4 lobus amorf per kluster dan 10 titik poligon harmonik bergelombang (`pert = 1 + 0.24 * Math.sin(...)`).
   - Pola aliran dinamis: 55% uap menyebar luas mendatar melintasi lereng barat dan timur, 45% membubung lembut di atas kawah.
   - **Pewarnaan Abu-Abu Kehitaman Pekat**:
     - Inti dalam: Abu-abu gelap arang (`rgba(87, 83, 78)`).
     - Lapisan tengah: Abu kehitaman (`rgba(68, 64, 60)`).
     - Lapisan luar & tepi: Hitam jelaga vulkanik (`rgba(41, 37, 36)` hingga `rgba(28, 25, 23)`).
     - Mulut kawah: Pendaran bara hangat magma hanya di bibir kawah sebelum bertransisi menjadi awan abu-abu kehitaman pekat yang membubung luas.

5. **🚨 Stabilisasi & Konsistensi Tremor Gempa Menuju Mobil Evakuasi (`fase4_awas_truck`)**:
   - Mengatasi anomali di mana intensitas getaran gempa melonjak mendadak menjadi 3.2 - 4.0 SR saat seluruh 3 warga selesai dievakuasi.
   - Mengunci `shakeIntensity` pada `fase4_awas_truck` untuk skenario efusif tetap pada tremor vulkanik ringan (`0.7 + Math.sin(animTick * 0.2) * 0.25`), identik dengan fase penyelamatan warga sebelumnya.
   - Tetap menonaktifkan bom vulkanik jatuh selama proses lari dan naik ke mobil evakuasi BPBD.

6. **🪧 Pemasangan Rambu Resmi Jalur Evakuasi dengan Panah ke Kanan (Standar BNPB / ISO 7010) di Semua SubMap & Kedua Kondisi**:
   - Mengintegrasikan papan rambu jalur evakuasi resmi BNPB (`drawRambuJalurEvakuasiMerapi`) di ketiga submap (Map 1: Dusun Atas KRB III, Map 2: Dusun Tengah Lereng, Map 3: Posko Utama BPBD / Radius Aman) pada kedua skenario letusan (Eksplosif & Efusif).
   - Menerapkan spesifikasi desain standar keselamatan BNPB & ISO 7010:
     - **Pelat Hijau Keselamatan**: Pelat rounded berdimensi 76px × 46px warna hijau keselamatan BNPB (`#15803d`) dengan kilau reflektif diagonal.
     - **Bingkai Putih Ganda**: Lis putih tebal 2px (`#ffffff`) dengan inset border reflektif.
     - **Piktogram Orang Berlari (*Running Man*)**: Siluet putih sosok manusia berlari kencang ke arah kanan (kepala, tubuh condong, ayunan tangan, dan langkah kaki dinamis).
     - **Panah Tebal Menunjuk ke Kanan (`➔`)**: Batang panah tebal dengan kepala panah segitiga beranimasi denyut halus (`arrowPulse = Math.sin(animTick * 0.16) * 1.5`) dan kilau inti kuning (`#fef08a`).
     - **Tipografi Resmi**: Teks baris atas `JALUR EVAKUASI` (font tebal `bold 7px "Plus Jakarta Sans"`) dan teks panduan arah bawah adaptif:
       - SubMap 1: `ARAH EVAKUASI ➔`
       - SubMap 2: `KE RADIUS AMAN ➔`
       - SubMap 3: `KE TRUK BPBD ➔`
     - **Struktur Fisik**: Tiang pipa baja kokoh (`#334155`) dengan kilau reflektif, pelat dasar baut di tanah (`floorY = 356`), dan klem ganda di belakang papan.
     - **Distribusi Koordinat**: Ditempatkan merata di tiga sektor jalan (`x: 680`, `x: 1220`, dan `x: 1720`) di setiap submap.
     - **Proksimitas Interaktif**: Menampilkan instruksi `PAPAN JALUR EVAKUASI MERAPI (BNPB): IKUTI ARAH KE KANAN (➔)` saat pemain berada di dekat rambu.

7. **✅ Verifikasi Build Produksi & Integritas Sistem**:
   - `npm run build` sukses 100% tanpa kesalahan kompilasi TypeScript maupun Vite bundling error (3.59s).

---

### Bab 80: Transformasi Peta Level 3 Menjadi Ekspedisi Horizontal Gunung Merapi Fullscreen, Kartu Judul Level Terbaca, Tema Cerah Ramah Siswa SMP Kelas 8, dan Redesain Modal Edukatif

**Tanggal:** 3 Oktober 2026  
**Status:** Selesai & Terverifikasi Penuh (`npm run build` Lolos Bersih 0 Error, Vite PWA Sukses, Uji Browser Valid)

#### Berkas yang Dimodifikasi:
- [`src/app/Level3/index.tsx`](./src/app/Level3/index.tsx)
- [`src/app/Workspace/index.tsx`](./src/app/Workspace/index.tsx)
- [`src/index.css`](./src/index.css)

#### Rincian Penyempurnaan & Implementasi:

1. **🗺️ Transformasi Playthrough Peta Level 3 Menjadi Horizontal Penuh (Zero-Vertical Dead Space)**:
   - Mengubah peta Level 3 dari kolom vertikal sempit 540px berbingkai hitam kosong menjadi **bentang alam horizontal 1 layar penuh (*fullscreen*)** sepanjang 3.400px.
   - Mengimplementasikan alur perjalanan bergelombang halus dari kiri ke kanan melalui kurva kubik halus Bézier (`generateSmoothHorizontalRibbon`), menghubungkan 17 titik level penjelajahan mitigasi.
   - Dilengkapi navigasi interaktif: smooth scroll otomatis menuju level aktif, drag-to-pan dengan mouse, konversi roda gulir mouse vertikal ke horizontal, serta tombol panah cepat di tepi layar (`◀` dan `▶`).

2. **🌋 Lanskap Gunung Merapi Cerah, Hangat & Edukatif (4 Sektor Tematik)**:
   - **Sektor 1 (Lembah & Sekolah SMP, Level 1-3)**: Langit pagi cerah dengan matahari keemasan dan awan berarak, perbukitan sawah bertingkat hijau subur, Gedung SMP Negeri Sleman beratap genteng merah dan bendera merah putih, rumah joglo tradisional, serta jembatan kayu di atas Kali Gendol.
   - **Sektor 2 (Zona Rawan Gempa, Level 4-8)**: Dataran padas sesar geologis, menara sirine EWS Seismik BNPB berkedip merah dengan corong sirine ganda, Balai Desa Destana, dan rambu Titik Kumpul resmi BNPB.
   - **Sektor 3 (Lereng Merapi & KRB, Level 9-13)**: Hutan pinus lereng gunung, tanggul sabo dam beton penahan banjir lahar dingin, dan Gedung Pos Pengamatan Gunungapi Merapi (PGA - PVMBG) dengan kubah teropong dan menara antena telemetri 151.7 MHz.
   - **Sektor 4 (Puncak Merapi & Komando BPBD, Level 14-17)**: Siluet megah kerucut Stratovolcano Gunung Merapi dengan takik kawah, kepulan asap vulkanik amorf, kawah magma aktif, posko tenda darurat oranye BPBD, Truk Rescue Evakuasi BPBD, dan menara komunikasi darurat satelit.

3. **🏷️ Kartu Judul Level Jelas & Tipografi Rapi di Setiap Node**:
   - Menempatkan kartu plakat judul di setiap node level (bergantian atas dan bawah) sehingga teks judul terbaca nyaman tanpa bertabrakan dengan jalan.
   - Setiap kartu memuat nomor level (`LV.1` s.d. `LV.17`), judul misi lengkap (contoh: "Nyalakan Lampu Pertama", "Sensor Suhu", "Status Gunung"), dan status penyelesaian (`✓` atau `AKTIF`).
   - Avatar siswa Taruna melompat riang di atas node level aktif dengan balon sapaan interaktif (`Ayo Taruna! 🚩`).

4. **✨ Redesain Modal Edukatif Hangat & Ramah Anak SMP Kelas 8**:
   - Mengubah modal detail misi dari kotak gelap monoton menjadi kartu berkas ekspedisi mitigasi bernuansa perkamen krem-emas (`#fef3c7`) dengan bingkai kayu jati.
   - Memuat bagian terstruktur: label kategori tematik, **Situasi Kebencanaan** bergaya laporan lapangan BMKG/BPBD, **Target Misi Penyelamatan** berbingkai hijau zamrud kontras tinggi, dan tombol aksi `▶ MULAI MISI SEKARANG` yang responsif.
   - Menata ulang Modal Panduan LKPD menjadi panduan 3 langkah diskusi kelompok yang terstruktur dan Modal Proyek Sandbox yang bersih.

5. **🎛️ Penyelarasan Tombol Header & Komponen Navigasi (`pixel-btn-wood-compact`)**:
   - Membuat kelas CSS `.pixel-btn-wood-compact` di `src/index.css` untuk mencegah tombol kayu melebar berlebihan (400px) pada bilah navigasi atas Level 3 dan Workspace.
   - Tata letak header tertata proporsional tanpa risiko teks terpotong ataupun tumpang tindih.

6. **✅ Verifikasi Sistem & Browser Subagent**:
   - `npm run build` sukses 100% (exit code 0 dalam 1.90 detik).
   - Pengujian langsung di browser memvalidasi tampilan horizontal Gunung Merapi, tombol level berlabel rapi, avatar siswa, navigasi sektor bawah, dan transisi ke ruang kerja Workspace.

---

### Bab 81: Puncak Merapi Rusak/Kroak Pasca-Letusan Eksplosif, Aliran Lava Efusif 10 Cabang Tanpa Offset & Animasi Merayap Halus, Redesain Modal Status Merapi Krem Hangat, Lelehan Magma Area 6, Timer 15 Detik Evakuasi Warga, dan Modal Gagal Evakuasi

**Tanggal:** 4 Oktober 2026  
**Status:** Selesai & Terverifikasi Penuh (`npm run build` Lolos Bersih 0 Error, Vite PWA Sukses, Uji Browser Valid)

#### Berkas yang Dimodifikasi:
- [`src/app/Level2/engine/renderer.ts`](./src/app/Level2/engine/renderer.ts)
- [`src/app/Level2/engine/gameEngine.ts`](./src/app/Level2/engine/gameEngine.ts)
- [`src/app/Level2/VolcanoPhaseModal.tsx`](./src/app/Level2/VolcanoPhaseModal.tsx)
- [`src/app/Level2/VolcanoRescueFailedModal.tsx`](./src/app/Level2/VolcanoRescueFailedModal.tsx)
- [`src/app/Level2/engine/TectonicGame.tsx`](./src/app/Level2/engine/TectonicGame.tsx)

#### Rincian Penyempurnaan & Implementasi:

1. **🌋 Puncak Merapi Rusak / Kroak Pasca-Letusan Eksplosif (*Caldera Collapse Notch*)**:
   - Menghadirkan transformasi morfologi gunung api yang realistis: ketika erupsi eksplosif terjadi (Fase 4 AWAS Penyelamatan, Evakuasi Truk, dan kondisi pasca-letusan), puncak kerucut Merapi yang semula utuh berubah menjadi rusak/sompang (*kroak*) akibat keruntuhan kubah lava (*dome collapse*).
   - Di `src/app/Level2/engine/renderer.ts` pada fungsi `drawVolcanoSimulationAtmosphere`, logika `isExplosiveErupted` merender takik kaldera runtuh bergerigi (*jagged caldera notch*) dengan tebing andesit gelap (`#18181b` dan `#27272a`), retakan patahan batuan beku (`#09090b`), serta memindahkan titik semburan kolom abu letusan ke dasar rekahan takik ($Y = \text{topY} + 12 \cdot s$).
   - Memberikan visualisasi edukatif otentik fenomena vulkanisme eksplosif Merapi (seperti erupsi besar 2010 yang merombak morfologi puncak Merapi).

2. **🌋 Aliran Lava Efusif 10 Cabang Tanpa Offset & Animasi Merayap Halus (~55 Detik)**:
   - Mengembangkan skenario efusif dengan menambahkan seluruh 10 cabang aliran lava menuruni lereng Merapi sesuai goresan garis merah sketsa referensi pengguna:
     - Alur punggungan kiri terjauh (*far left ridge*)
     - Alur lereng barat atas (*left flank*)
     - Cabang anak lereng barat tengah (*left mid branch*)
     - Alur batang tengah kawah (*central trunk*)
     - Cabang alur tengah-kiri (*center-left chute*)
     - Cabang alur tengah-kanan (*center-right chute*)
     - Alur lereng timur atas (*right flank*)
     - Cabang anak lereng timur tengah (*right mid branch*)
     - Cabang anak lereng timur bawah (*right lower branch*)
     - Alur punggungan lereng kanan terjauh (*far right ridge*)
     - 7 kolam delta magma di dasar lereng dan teras batuan.
   - **Penyelarasan Titik Hulu Bebas Offset**: Memperbaiki titik awal cabang kiri terjauh (`topX - 24 * s, topY + 3 * s`) dan cabang kanan terjauh (`topX + 22 * s, topY + 3 * s`) sehingga berhulu kokoh di dalam kubah danau kawah magma (`poolW: 28 * s, poolH: 7 * s`), mengeliminasi 100% celah/gap offset antara bibir kawah dan aliran lava.
   - **Pemisahan Tegas Efusif vs Eksplosif**: Skenario letusan eksplosif strictly mempertahankan 3 jalur lava klasik (kiri lereng, tengah batang, kanan lereng), sedangkan 10 cabang aliran lelehan masif khusus diaktifkan pada skenario letusan efusif.
   - **Deselerasi Aliran Lava (~55 Detik)**: Menyetel laju aliran `flowRate` efusif menjadi `0.00030` per frame (~1.8% per detik, membutuhkan ~55 detik penuh untuk merayap dari puncak ke kaki gunung) dengan progres awal `0.01`, menciptakan visualisasi realistis lelehan lava andesitik bersuhu tinggi namun berviskositas kental (*slow viscous creeping flow*).

3. **✨ Redesain Modal Status Merapi Menjadi Palet Perkamen Krem Hangat & Kayu Retro**:
   - Mengubah total tema warna `VolcanoPhaseModal.tsx` dari palet biru dongker/navy gelap dingin (`#0f172a`, `#1e293b`) menjadi kartu ekspedisi bernuansa perkamen krem hangat (`#fef3c7`, `#fffbeb`, `#fef9c3`) dengan bingkai kayu jati retro (`#78350f`, `#b45309`, `#451a03`) yang serasi 100% dengan `DiscoveryModal.tsx` (sesuai Gambar 3 referensi pengguna).
   - Dilengkapi header plakat kayu dengan paku sudut rivet kuningan, pita status warna resmi PVMBG (Hijau Normal, Kuning Waspada, Oranye Siaga, Merah Awas) berbingkai kayu, teks deskripsi situasi dan rekomendasi mitigasi BNPB dengan kontras tinggi (`#451a03`, `#78350f`), serta tombol aksi kayu interaktif `[ MENGERTI & LANJUTKAN ]`.

4. **🌋 Guratan Tipis Lelehan Magma Merapi di Area 6 (Barak Pengungsian & Pemulihan)**:
   - Menghadirkan visual lelehan magma tipis-tipis di siluet latar belakang Gunung Merapi pada Area 6 (`drawArea6DistantLavaVeins`) persis sesuai sketsa garis merah pada gambar ke-4 pengguna.
   - Menggunakan rendering 3-pass halus: pass 1 pendaran oranye transparan lembut (`rgba(249, 115, 22, 0.45)`), pass 2 urat magma merah-oranye (`rgba(239, 68, 68, 0.85)`), dan pass 3 kilau inti tipis kuning keemasan (`#fef08a`), menghasilkan guratan magma sisa letusan yang tipis, tenang, dan estetik di kejauhan tanpa mendominasi pemandangan barak pengungsian.

5. **⏱️ Pengaktifan Timer 15 Detik Evakuasi Warga (Fase 4 Awas)**:
   - Memperbaiki bug di mana timer penyelamatan warga sebelumnya membeku/stuck.
   - Pada `fase4_awas_rescue` di `gameEngine.ts`, mengaktifkan pengurangan `sim.qteTimer -= 1` setiap frame (15 detik = 900 frame pada 60 FPS).
   - HUD telemetri menampilkan hitung mundur detik secara real-time (`Math.ceil(sim.qteTimer / 60) s`) dengan bar waktu berwarna merah-kuning menyala.

6. **🚨 Sistem Kegagalan Evakuasi & Modal Gagal Evakuasi Cepat (`VolcanoRescueFailedModal.tsx`)**:
   - Jika waktu 15 detik habis sebelum ketiga warga lereng (Pak Joko, Mbak Rina, Mbah Lansia) berhasil dievakuasi, sistem secara otomatis beralih ke state `sim.phase = 'failed'`, membunyikan efek audio peringatan darurat, dan menampilkan modal gagal evakuasi.
   - Menciptakan komponen modal baru [`VolcanoRescueFailedModal.tsx`](./src/app/Level2/VolcanoRescueFailedModal.tsx) dengan palet kayu-krem hangat, ikon peringatan retro `[!]`, analisis penyebab kegagalan (*"Waktu evakuasi 15 detik habis sebelum seluruh warga berhasil diarahkan ke mobil rescue"*), tips mitigasi kesiapsiagaan dari BNPB, serta tombol coba lagi cepat: `[ ↺ ] ULANGI EVAKUASI WARGA (15 DETIK)`.
   - Mengimplementasikan fungsi `retryVolcanoRescuePhase(state)` di `gameEngine.ts` yang mereset posisi warga, status evakuasi, dan timer kembali ke 15 detik penuh, memungkinkan siswa langsung mencoba kembali fase evakuasi warga tanpa harus mengulang simulasi dari awal Fase 1.

7. **✅ Verifikasi Build Produksi 100% Sukses**:
   - `npm run build` berhasil 100% tanpa kesalahan kompilasi TypeScript maupun Vite bundler error dalam 2.22 detik.

---

### Bab 82: Platforming Parkour Pilar Basal Mantel Bumi, Penukaran Map & Atmosfer Inti Luar vs Inti Dalam, Sistem Pembelian Baju Pelindung Geologis Berbasis Kristal Energi, Alur Dialog Pasca-Wordle Bu Tyas, dan Pembesaran Modal Peringatan Bahaya Ekstrem

**Tanggal:** 4 Oktober 2026  
**Status:** Selesai & Terverifikasi Penuh (`npm run build` Lolos Bersih 0 Error dalam 2.73s, Vite PWA Sukses, Uji Browser Valid)

#### Berkas yang Dimodifikasi:
- [`src/utils/studentAvatarSheet.ts`](./src/utils/studentAvatarSheet.ts)
- [`src/app/Level1/EarthDive/engine/player.ts`](./src/app/Level1/EarthDive/engine/player.ts)
- [`src/app/Level1/EarthDive/engine/renderer.ts`](./src/app/Level1/EarthDive/engine/renderer.ts)
- [`src/app/Level1/EarthDive/engine/zones.ts`](./src/app/Level1/EarthDive/engine/zones.ts)
- [`src/app/Level1/EarthDive/engine/npcManager.ts`](./src/app/Level1/EarthDive/engine/npcManager.ts)
- [`src/app/Level1/EarthDive/dialogueData.ts`](./src/app/Level1/EarthDive/dialogueData.ts)
- [`src/app/Level1/EarthDive/engine/gameEngine.ts`](./src/app/Level1/EarthDive/engine/gameEngine.ts)
- [`src/app/Level1/EarthDive/SuitMerchantModal.tsx`](./src/app/Level1/EarthDive/SuitMerchantModal.tsx)
- [`src/app/Level1/EarthDive/EarthDiveGame.tsx`](./src/app/Level1/EarthDive/EarthDiveGame.tsx)

#### Rincian Penyempurnaan & Implementasi:

1. **🧱 Platforming Parkour Pilar Basal & Danau Magma di Mantel Bumi (Zona 2)**:
   - **Rekonstruksi Medan Parkour**: Mengubah topografi Zona 2 (Mantel Bumi) dari lereng tanah padat biasa menjadi lintasan pilar-pilar batu basal hitam terapung (`basalt_pillar`) yang menjulang kokoh di atas danau magma konveksi termal yang membara luas.
   - **Penempatan Aman Elemen Interaktif (Zero-Magma Fall)**:
     - Merelokasi seluruh platform pilar agar memiliki jarak lompat proporsional yang ramah bagi anak SMP kelas 8.
     - Memposisikan NPC secara presisi di atas pilar aman: Zahra [🔍] di pilar $px = 380, py = 280$, Lintang [🔍] di pilar $px = 700, py = 260$, dan Bu Tyas di daratan stasiun gerbang $px = 1070, py = 356$.
     - Menempatkan Kristal Energi Mantel (`mantle_crystal_1`) di pilar melayang $px = 540, py = 210$, menjamin kristal dan NPC tidak pernah melesak atau terendam di dalam danau magma.

2. **🔄 Penukaran Map & Penyelarasan Atmosfer/Warna Inti Luar vs Inti Dalam**:
   - **Pertukaran Arsitektur Map**:
     - Zona 3 (Inti Luar, 2.900–5.150 km): Memakai konfigurasi map kubah batuan datar luas ($Y \approx 356$), memungkinkan eksplorasi luas di tengah pusaran logam cair.
     - Zona 4 (Inti Dalam, 5.150–6.371 km): Memakai konfigurasi teras kristal heksagonal bertingkat melintasi jurang fluida logam murni.
   - **Penyelarasan Efek Sains Khusus**:
     - Seluruh efek lucutan petir geodynamo dan visualisasi cincin loop fluks medan magnetik pelindung bumi **tetap dipertahankan secara eksklusif pada Inti Luar (Zona 3)** sesuai prinsip geofisika.
   - **Penyelarasan Warna & Suasana Lingkungan**:
     - *Inti Luar*: Mempertahankan atmosfer kuning keemasan hangat berpendar (`#fef08a`, `#f59e0b`) yang melambangkan energi dinamo magnetik dan radiasi konveksi logam cair 9.000°F.
     - *Inti Dalam*: Mengubah atmosfer menjadi lebih gelap pekat purba (`#18181b`, `#27272a`), tanah basal besi pekat gelap, dan pendaran magma redup yang kontras dengan pendaran kristal logam padat kompresi >3,6 juta atm.
   - **Penambahan Kristal Inti Dalam**: Menambahkan 1 objek kristal energi baru (`ic_crystal_1`) di pematang teras tengah Inti Dalam ($px = 590, py = 280$) sehingga setiap zona strata bumi kini memiliki kristal energi yang dapat ditambang siswa.

3. **💎 Sistem Ekonomi Kristal Energi & Merchant Baju Pelindung Geologis (Hazard Suits MK-1 s.d. MK-4)**:
   - **Alih Fungsi Kristal Energi**: Kristal energi kini memiliki kegunaan penting (*gameplay utility*) sebagai sumber daya langka untuk menukarkan setelan geologis tahan suhu dan tekanan ekstrem sebelum siswa diizinkan memasuki zona berikutnya.
   - **Katalog 4 Baju Pelindung Geologis**:
     | Zona Asal | Target Zona Tujuan | NPC Teknisi | Nama Baju Pelindung | Biaya Kristal | Avatar Mode Visual | Ketahanan Sains |
     |:---|:---|:---|:---|:---:|:---|:---|
     | Kerak Bumi (`crust`) | Mantel Bumi | Teknisi Joko ($px=1150$) | **Baju Pelindung Termal MK-1** (`mantle_suit`) | 1 Kristal | `hazard_mantle` | Tahan panas magma konveksi hingga 3.000°C |
     | Mantel Bumi (`mantle`) | Inti Luar | Teknisi Rudi ($px=1175$) | **Baju Elektromagnetik MK-2** (`outer_core_suit`) | 1 Kristal | `hazard_outer` | Isolasi fluks magnetik & lucutan listrik petir geodynamo |
     | Inti Luar (`outerCore`) | Inti Dalam | Teknisi Dian ($px=1140$) | **Exo-Suit Adamantine MK-3** (`inner_core_suit`) | 1 Kristal | `hazard_inner` | Tahan kompresi gravitasi ekstrem >3,6 juta atmosfer & 6.000°C |
     | Inti Dalam (`innerCore`) | Batas Divergen | Teknisi Arya ($px=1160$) | **Baju Penyelam Samudra Kedalaman** (`diver_suit`) | 1 Kristal | `diver` | Tabung oksigen ganda & pelindung hidrostatik laut dalam |
   - **Sistem Transaksi & Auto-Equip**:
     - Membuka modal interaktif [`SuitMerchantModal.tsx`](./src/app/Level1/EarthDive/SuitMerchantModal.tsx) saat pemain berinteraksi `[E]` dengan Teknisi.
     - Fungsi `buyAndEquipSuit` memotong 1 kristal energi yang diperoleh di area bersangkutan, mendaftarkan setelan ke `purchasedSuits`, dan seketika memasangnya ke karakter (`player.equippedSuit`).
     - State kepemilikan dan pakaian persisten tersimpan otomatis ke `localStorage` per user ID siswa.

4. **🚪 Gatekeeper Portal & Alur Dialog Berkesinambungan Bu Tyas Pasca-Wordle**:
   - **Alur Dialog Otomatis Bu Tyas**: Setelah siswa menjawab kuis Wordle gerbang dengan benar, Bu Tyas secara otomatis membuka dialog kelanjutan (`bu_tyas_crust_suit_guide`, `bu_tyas_mantle_suit_guide`, `bu_tyas_outer_core_suit_guide`, `bu_tyas_inner_core_suit_guide`). Bu Tyas menjelaskan bahaya ekstrem zona berikutnya dan mengarahkan siswa menemui Teknisi di sebelah kanan.
   - **Gatekeeper Portal Turun**: Jika pemain mencoba melompat ke portal turun tanpa memakai baju pelindung yang disyaratkan untuk zona tujuan, portal menolak akses dan memunculkan modal peringatan bahaya lingkungan ekstrem yang interaktif.

5. **🎨 Desain Sprite Sheet Avatar Karakter untuk Setiap Baju Pelindung**:
   - Di [`src/utils/studentAvatarSheet.ts`](./src/utils/studentAvatarSheet.ts), mengembangkan fungsi rendering visual avatar khusus untuk 4 jenis setelan geologis:
     - `hazard_mantle`: Helm silikat tebal oranye vulkanik, visor kaca amber reflektif, sabuk pengatur suhu berkedip, dan kisi-kisi pembuang panas konveksi.
     - `hazard_outer`: Helm pelindung titanium biru baja, sirip samping isolator fluks dinamo magnetik, visor HUD neon cyan terang, dan reaktor dinamo penangkal arus induksi di dada.
     - `hazard_inner`: Mahkota prisma emas adamantine berstruktur kisi heksagonal, visor surya anti-radiasi 6.000°C, baju pelapis ultra-tekanan tahan 3,6 juta atm, dan singularitas gravitasi mini di dada.
     - `diver`: Helm kaca bulat akrilik biru penyelam samudra kedalaman, sabuk ballast pemberat, dan tabung kompresi oksigen ganda di punggung.
   - Seluruh animasi gerak (idle, berjalan 4 frame, melompat, dan jatuh) dirender secara mulus dan konsisten.

6. **✨ Refinement Skalabilitas UI Modal (Font Besar & Hapus Narasi Dialog Teknisi)**:
   - **Penghapusan Narasi Teknisi**: Menghapus kotak dialog obrolan teknisi di dalam [`SuitMerchantModal.tsx`](./src/app/Level1/EarthDive/SuitMerchantModal.tsx) sesuai instruksi pengguna, sehingga antarmuka modal berfokus murni pada spesifikasi baju pelindung, harga penukaran kristal, dan tombol aksi beli/pasang.
   - **Pembesaran Tipografi Merchant Modal**: Memperbesar ukuran teks judul, deskripsi ketahanan geologis, dan tombol aksi kayu agar sangat mudah dan nyaman dibaca oleh siswa SMP kelas 8.
   - **Pembesaran Popup Peringatan Bahaya Ekstrem**:
     - Memperbesar dimensi modal peringatan `suitWarningModal` di [`EarthDiveGame.tsx`](./src/app/Level1/EarthDive/EarthDiveGame.tsx) dari `max-w-xl` menjadi `max-w-2xl sm:max-w-3xl` dengan padding lega `p-7 sm:p-9`.
     - Ikon peringatan retro `⚠️` diperbesar menjadi `w-20 h-20` dengan font `text-4xl sm:text-5xl`.
     - Teks judul diperbesar menjadi `text-2xl sm:text-3xl` dan paragraf penjelasan sains diperbesar ke `text-base sm:text-lg`.

7. **✅ Verifikasi Build Produksi 100% Sukses**:
   - `npm run build` berhasil 100% tanpa kesalahan kompilasi TypeScript maupun Vite bundling error dalam 2.73 detik.

---

### Bab 83: Audit Komprehensif Alur Dialog Interaktif, Resolusi Bug Freeze Cabang Pilihan, dan Penyelarasan Penuh Identitas & Potret NPC Lintas Level 1 & Level 2

**Tanggal:** 4 Oktober 2026  
**Status:** Selesai & Terverifikasi Penuh (`npm run build` Lolos Bersih 0 Error, `npx tsc --noEmit` Exit 0, 100% NPC Terverifikasi Cocok)

#### Berkas yang Dimodifikasi:
- [`src/app/Level1/EarthDive/dialogueData.ts`](./src/app/Level1/EarthDive/dialogueData.ts)
- [`src/app/Level2/dialogueDataL2.ts`](./src/app/Level2/dialogueDataL2.ts)
- [`src/app/Level2/engine/npcManagerL2.ts`](./src/app/Level2/engine/npcManagerL2.ts)
- [`src/app/Level1/EarthDive/SuitMerchantModal.tsx`](./src/app/Level1/EarthDive/SuitMerchantModal.tsx)

#### Rincian Penyempurnaan & Implementasi:

1. **🧊 Investigasi & Resolusi Bug Pilihan Dialog Kedua Membeku (Freezing Dialogue Branching)**:
   - **Gejala Masalah**: Saat pemain berdialog dengan NPC tertentu dan memilih opsi respon kedua (misalnya pada dialog Dr. Gea, Prof. Andini, atau Inspektur Budi), kotak dialog berhenti merespon dan karakter pemain membeku di tempat sampai tombol spasi ditekan manual berkali-kali.
   - **Akar Masalah**:
     - Pada `PROF_ANDINI_DIALOGUE`, pilihan *"Nanti saja, saya ingin menjelajah dulu"* mengarah ke `nextNodeId: 'done'`, namun node `'done'` tidak didefinisikan di dalam kamus `nodes`. Akibatnya, `activeNodeId` diset ke string `'done'` yang bernilai `undefined`, engine visual novel kehilangan referensi node aktif, sehingga tombol klik tidak merespon.
     - Pada `INSPEKTUR_BUDI_DIALOGUE`, terdapat inkonsistensi penulisan kapitalisasi string `start_tour_One` pada pilihan cabang, sementara ID node yang didefinisikan adalah `start_tour_one`.
     - Pada `PROF_RADITYA_DIALOGUE`, terdapat opsi percabangan yang merujuk ke node non-eksisten `tipe_gelombang` dan `lapisan_bumi`.
   - **Solusi Teknis**:
     - Menambahkan node terminal `done` yang sah dengan teks penutup ramah (*"Baiklah, jelajahi area ini terlebih dahulu. Temui saya lagi jika kamu sudah siap!"*).
     - Menyelaraskan seluruh huruf besar-kecil pada penamaan ID node dan referensi `nextNodeId`.
     - Memastikan seluruh cabang opsi dialog berakhir dengan baik atau kembali ke node induk yang valid.

2. **🔍 Audit Otomatis Pohon Dialog & Pembersihan Alur**:
   - Menjalankan script validasi traversal menyeluruh terhadap seluruh 38 pohon dialog di Level 1 dan 28 pohon dialog di Level 2.
   - Memastikan setiap `nextNodeId` pada node teks dan seluruh pilihan `choices[].nextNodeId` memiliki node pasangan yang valid di dalam objek dialog yang sama.
   - Hasil audit mengonfirmasi: **0 broken transitions** di seluruh dialog Level 1 dan Level 2.

3. **🎭 Penyelarasan Total Mismatch Karakter NPC di Level 1 (Zidane vs Zahra vs Lintang)**:
   - **Latar Belakang Masalah**: Pengguna melaporkan bahwa terdapat beberapa NPC yang percakapan atau spritenya tidak sesuai — misalnya di percakapan menyebut Zidane, namun bentuk NPC atau potretnya malah Lintang atau Zahra.
   - **Perbaikan Rinci di Level 1**:
     - **Zona 2 (Mantel Bumi - NPC Zahra)**: NPC di peta adalah Zahra (`z2_npc_zahra`), namun ID pembicara warisan `prof_sarah` di `CHARACTER_PROFILES` terpetakan ke **Zidane** (nama cyan `#38bdf8`, potret `zidane`). Diperbaiki menjadi **Zahra** (nama pink ceria `#f472b6`, gelar `'Peneliti Mineralogi Ceria'`, potret `'zahra'`).
     - **Zona 4 (Inti Dalam - NPC Zahra)**: NPC di peta adalah Zahra (`z4_npc_zahra`), namun pembicara `prof_lestari` terpetakan ke **Lintang**. Diperbaiki menjadi **Zahra** (nama dan potret Zahra).
     - **Zona 4 (Inti Dalam - NPC Lintang)**: NPC di peta adalah Lintang (`z4_npc_lintang`), namun pembicara `dr_farhan` terpetakan ke **Zidane**. Diperbaiki menjadi **Lintang** (nama hijau `#4ade80`, gelar `'Analis Geologi Analitis'`, potret `'lintang'`).
     - **Zona 7 (Patahan San Andreas - Lintang)**: Pohon dialog `PETUGAS_RUDI_TRANS_DIALOGUE` (`Pos Analisis Keselamatan Patahan bersama Lintang`) menggunakan pembicara `petugas_rudi` yang terpetakan ke **Ican**. Diperbarui menjadi `lintang` sehingga kotak dialog menampilkan nama dan potret Lintang secara konsisten.

4. **👥 Penyelarasan Total Mismatch Karakter NPC di Level 2**:
   - **Area 5 (Simulasi Erupsi Merapi - Pak Joko / Kepala Dusun)**:
     - NPC peta adalah Pak Joko (`l2_sim5_npc_pak_joko`, sprite berblangkon dan rompi hijau Destana), namun saat diajak bicara dialog `pak_joko_sim_intro` memunculkan profil **Lintang**.
     - Di `CHARACTER_PROFILES_L2`, profil `pak_joko` diperbaiki menjadi: nama: `'Pak Joko'`, gelar: `'Kepala Dusun Destana'`, warna: `#22c55e`, potret: `'pak_joko'`.
   - **Area 5 (Simulasi Erupsi Merapi - Mbak Rina / Warga Siaga)**:
     - NPC peta adalah Mbak Rina (`l2_sim5_npc_mbak_rina`, sprite berjaket merah relawan), namun memunculkan profil **Zahra**.
     - Di `CHARACTER_PROFILES_L2`, profil `mbak_rina` diperbaiki menjadi: nama: `'Mbak Rina'`, gelar: `'Warga Siaga Merapi'`, warna: `#f87171`, potret: `'mbak_rina'`.
   - **Area 5 (Simulasi Erupsi Merapi - Komandan Satria)**:
     - NPC peta adalah Komandan Satria BPBD/SAR (`l2_sim5_npc_satria`), namun dialog bawaannya terpasang `pak_joko_awas_evac` (dialog Pak Joko) dan profilnya terpetakan ke Bu Tyas.
     - Profil `komandan_satria` di `CHARACTER_PROFILES_L2` diperbaiki menjadi Komandan Satria (`#f97316`, potret `'komandan_satria'`) dan dialog interaksinya diarahkan ke `satria_sim_victory`.
   - **Area 6 (Barak Pengungsian - Ican)**:
     - NPC peta adalah Ican (`l2_shelter_npc_ican`), namun `dialogueId` yang dipasang adalah `mbah_joyo_shelter_dialogue` (pembicara Zidane tentang doa warga sepuh).
     - Di `npcManagerL2.ts`, `dialogueId` diubah ke `dani_shelter_dialogue` (pembicara Ican tentang logistik dapur umum & saling menyemangati pengungsi).
   - **Area 2 & Area 3 (Bu Tyas)**:
     - Profil `bu_rahma` sebelumnya menggunakan potret lama `bu_rahma` (baju khaki dinas), dan di Lapangan (Area 3) tipe NPC di peta adalah `bu_rahma`.
     - Diperbaiki ke potret `'bu_tyas'` dan tipe sprite peta di Area 3 diubah ke `'bu_tyas'` agar seragam dengan penampilannya di seluruh area lain.
   - **Profil Warisan Tagana (`pak_slamet`)**:
     - Profil `pak_slamet` di Level 2 diarahkan ke **Lintang** (sesuai modul lahar dingin Area 6 yang dibawakan Lintang), tidak lagi tertukar dengan Zahra.

5. **💎 Refinement Antarmuka SuitMerchantModal & Dialog Resqy**:
   - Memperbaiki padding, efek backdrop blur (`bg-black/80`), bayangan `shadow-2xl`, dan tipografi tombol pada [`SuitMerchantModal.tsx`](./src/app/Level1/EarthDive/SuitMerchantModal.tsx).
   - Menyederhanakan teks dialog pengarahan Resqy di berbagai zona Level 1 (menghilangkan sebutan teknis "NPC" dan menyebutkan rekan penjelajah secara alami).
   - Menyempurnakan istilah geologi pada Batas Divergen dari *"pematang tengah samudra"* menjadi istilah baku kurikulum IPA nasional: *"punggungan tengah samudra (mid-ocean ridge)"*.

6. **✅ Verifikasi Build Produksi 100% Sukses**:
   - Pemeriksaan tipe TypeScript `npx tsc --noEmit` lolos bersih dengan 0 error.
   - Seluruh 26 NPC di Level 1 dan 17 NPC di Level 2 terverifikasi 100% sinkron antara nama di peta, tipe sprite peta, nama pembicara, dan potret visual.

---

### Bab 84: Transformasi Map Penuh Area 6 Level 2 ke Level 3 Tanpa NPC, Overhaul Tema Terang Workspace (Action Lab) & Penyelarasan Palet Perkamen Krem Hangat Retro

**Tanggal:** 4 Oktober 2026  
**Status:** Selesai & Terverifikasi Penuh (`npm run build` Lolos Bersih 0 Error dalam 1.96s, Vite PWA Sukses)

#### Berkas yang Dimodifikasi:
- [`src/app/EvacuationGame/EvacuationCanvas.tsx`](./src/app/EvacuationGame/EvacuationCanvas.tsx)
- [`src/app/Workspace/index.tsx`](./src/app/Workspace/index.tsx)
- [`src/app/Workspace/MissionPanel.tsx`](./src/app/Workspace/MissionPanel.tsx)
- [`src/app/Workspace/BlockEditor/BlocklyComponent.tsx`](./src/app/Workspace/BlockEditor/BlocklyComponent.tsx)
- [`src/app/Workspace/ConsoleOutput.tsx`](./src/app/Workspace/ConsoleOutput.tsx)
- [`src/app/Workspace/SensorPanel.tsx`](./src/app/Workspace/SensorPanel.tsx)
- [`src/app/Level3/index.tsx`](./src/app/Level3/index.tsx)

#### Rincian Penyempurnaan & Implementasi:

1. **🗺️ Penggantian Map Level 3 Menjadi 1 Map Penuh Area 6 Level 2 (Barak Pengungsian & Pemulihan KRB I) Tanpa NPC**:
   - Mengganti total kanvas isometrik lama di [`EvacuationCanvas.tsx`](./src/app/EvacuationGame/EvacuationCanvas.tsx) dengan bentangan 1 map penuh 2.200px Area 6 dari Level 2 secara utuh:
     - Langit fajar aman, siluet Gunung Merapi berkaldera kroak di kejauhan dengan lelehan magma tipis dan kepulan asap vulkanik.
     - Perbukitan pinus, Spanduk Selamat Datang Barak Pengungsian Terpadu, Tenda Pleton Utama BPBD, Tandon Air Bersih Stainless & Bak Cuci Mata Darurat, Posko Medis PMI, Dapur Umum Tagana, Rumah Warga atap abu vulkanik & tangga bambu, Rambu Bahaya Lahar Hujan BNPB & Menara Sirine EWS Strobo, serta Mobil Evakuasi BNPB.
   - **Murni Map Tanpa NPC**: Tidak menggunakan NPC dialog/cerita maupun NPC pejalan kaki, menyajikan bentang alam shelter evakuasi yang bersih, luas, dan fokus pada skenario mitigasi.
   - **Navigasi Interaktif & Nav Bar Cepat**: Mendukung drag-to-pan halus dengan mouse/touch, zoom in/out roda mouse, dan tombol pintas lokasi POI (`GAPURA MASUK`, `TENDA BPBD`, `POSKO MEDIS`, `DAPUR TAGANA`, `SIRINE & LAHAR`, `MOBIL RESCUE`).
   - **Integrasi Feedback Hardware/Simulasi IoT**:
     - Sirine EWS strobo berkedip aktif dan memancarkan gelombang suara saat `buzzerOn` atau kondisi darurat aktif.
     - Lampu darurat LED merah (Pin 10) berkedip pada gapura dan spanduk; lampu aman LED hijau (Pin 11) berpendar di posko medis.
     - Pintu servo terbuka mengaktifkan pendaran jalur evakuasi aman.
     - Sensor gempa A1 memicu getaran layar (*screen shake*).

2. **🎨 Overhaul Tema Terang Workspace (Action Lab) dengan Palet Perkamen Krem Hangat & Kayu Retro (SS 3)**:
   - Mengubah latar belakang gelap gulita (`#0c0a09`) menjadi tema terang perkamen krem hangat (`bg-[#fefce8]`, `bg-[#fffbeb]`, `bg-[#fef3c7]`) dengan aksen lis kayu jati retro (`border-[#78350f]`, `border-[#b45309]`).
   - **Header Bar Workspace**: Menggunakan plakat kayu krem terang bergaris pembatas kayu, kotak judul misi berbingkai kayu jati dengan badge level oranye-cokelat, serta tombol-tombol utilitas (`Diorama WiFi`, `USB Serial`, `Tes Perangkat`, `Sensor`) berbentuk kartu perkamen krem yang elegan.
   - **MissionPanel (Kiri)**: Dirombak menjadi panel panduan perkamen terang (`bg-[#fffbeb]`), badge kategori oranye bata (`#b45309`), kartu langkah putih gading (`#fefce8`), kotak tips fakta kunci krem (`#fef3c7`), dan tombol validasi oranye hangat kayu (`#c2410c` ke `#b45309`).
   - **Blockly & Ruang Simulasi (Tengah Bawah)**: Header "Ruang Simulasi" mengadopsi palet krem hangat dengan tipografi pixel retro dan lis kayu jati.
   - **ConsoleOutput / Log Aktivitas (Kanan)**: Dirombak total menjadi panel perkamen terang dengan kartu log bersistem warna cerah kontras tinggi (biru langit untuk sistem, hijau zamrud untuk sukses, kuning hangat untuk peringatan, merah lembut untuk error).
   - **SensorPanel**: Modal slider sensor mengadopsi tema perkamen krem hangat dengan bingkai kayu jati.

3. **🏷️ Penyelarasan Kotak Header Level 3 (`LEVEL 3: ACTION LAB` & `TUNTAS`)**:
   - Di [`src/app/Level3/index.tsx`](./src/app/Level3/index.tsx), kotak judul `LEVEL 3: ACTION LAB | Digital Twin Merapi` dan kotak progres `TUNTAS: X / 17` diubah dari kotak gelap menjadi kartu perkamen krem hangat (`bg-[#fffbeb]/95`) dengan bingkai kayu jati (`border-2 border-[#b45309]`) dan tipografi pixel emas-cokelat yang serasi 100% dengan estetika SS 3.

4. **✅ Verifikasi Build Produksi 100% Sukses**:
   - `tsc -b && vite build` lolos bersih tanpa kesalahan dengan status exit code 0 dalam 1.96 detik.

---

### Bab 85: Transformasi Map Penuh Level 3 (`/level3`) Menjadi Lanskap Murni Area 6 Level 2 (Barak Pengungsian & Pemulihan KRB I) 3.800px — Bersih Tanpa Nama Bangunan, Tanpa Teks Label, dan Tanpa NPC

**Tanggal:** 4 Oktober 2026  
**Status:** Selesai & Terverifikasi Penuh (`npm run build` Lolos Bersih 0 Error dalam 1.95s, Vite PWA Sukses)

#### Berkas yang Dimodifikasi:
- [`src/app/Level3/index.tsx`](./src/app/Level3/index.tsx)

#### Rincian Penyempurnaan & Implementasi:

1. **🗺️ Eliminasi Total Dinding Interior Kelas & Papan Tulis di Sektor 1**:
   - Menghapus komponen interior ruang kelas lama (`#classroom_interior_sector1`: dinding wallpaper kuning, papan tulis hijau Lab IoT, jendela kaca kelas, meja praktikum, dan pintu evakuasi kelas kayu).
   - Membentangkan kanvas alam terbuka dari koordinat $x = 0$ hingga $x = 3.800$ secara penuh dan mulus.

2. **🌅 Implementasi Panorama Lengkap Area 6 (Barak Pengungsian KRB I) Sepanjang 3.800px**:
   - **Langit Fajar Harapan (Morning Hope Gradient)**: Membentang penuh dari $x = 0$ ke $3.800$ dengan gradien `#1e3a8a` (biru tua fajar) $\rightarrow$ `#0284c7` $\rightarrow$ `#38bdf8` $\rightarrow$ `#fef08a` (kuning keemasan fajar).
   - **Matahari Terbit & Awan Melayang**: Matahari pagi bersinar hangat di $x = 480$ dengan 3 cincin pendaran cahaya, didampingi gumpalan awan putih halus melayang dan kawanan burung fajar di berbagai sektor.
   - **Siluet Gunung Merapi Realistis**: Siluet stratovolcano Merapi di kejauhan dengan kaldera kubah lava menyala, alur lelehan lava pijar tipis, dan kepulan asap vulkanik membubung.
   - **3 Lapisan Perbukitan Hijau & Rumpun Pinus**: Tiga gelombang bukit hijau tropis membentang dari $x = 0$ ke $3.800$ dengan rumpun pohon pinus 3-tier.
   - **Bebatuan Andesit & Bunga Tropis**: Taburan bebatuan andesit dataran rendah dan bunga tropis kuning serta biru di sepanjang lereng.

3. **🏛️ Penempatan Landmark Otentik Area 6 (Murni Seni Vektor Tanpa Nama Bangunan & Tanpa Teks)**:
   - Seluruh teks label/nama bangunan (`KE DUSUN DESTANA`, `BARAK PENGUNGSIAN TERPADU`, `TENDA PLETON BPBD`, `AIR BERSIH`, `POSKO KESEHATAN PMI`, `N95`, `DAPUR UMUM TAGANA`, `BERAS`, `JALAN LICIN!`, `SABO DAM`, `AWAS LAHAR HUJAN`, `RESCUE`) **dihilangkan 100%**.
   - Background map bersih dari elemen tulisan buatan, mempertahankan keindahan murni seni visual Area 6:
     - *Gapura Masuk Dusun Destana*: Tiang baja oranye kembar, palang atas gelap bergaris cyan bersih, dan lampu sirine di pucuk.
     - *Spanduk Gerbang BPBD*: Tiang penyangga baja dengan palang melintang oranye-kuning berbingkai emas tanpa teks.
     - *Tenda Pleton Utama BPBD*: Tenda pleton oranye besar resmi BPBD dengan logo segitiga, tali pasak tanah, pintu kain tersingkap dengan interior hangat bercahaya, dan palet kayu beralas matras gulung biru.
     - *Tandon Air Bersih Stainless Steel & Pos Cuci Mata*: Silinder tangki stainless steel anti-abu belerang mengkilap, kubah penutup dengan segel gembok kuningan, keran air mengalir ke bak bilas mata darurat (*eye wash station*).
     - *Posko Medis PMI*: Tenda pleton putih bersih dengan lambang Palang Merah (*Red Cross*) merah menyala, tabung oksigen hijau medis dengan manometer emas, dan tumpukan kardus pasokan medis.
     - *Dapur Umum Tagana Kemensos*: Tenda pleton biru Tagana, kuali masakan besar di atas tungku kompor berapi dengan kepulan uap hangat mengepul, dan tumpukan karung logistik.
     - *Rumah Warga Pedesaan Atap Abu Vulkanik Tebal*: Dinding kayu pedesaan, atap genteng tertutup endapan abu vulkanik tebal ($>1.500\text{ kg/m}^3$), tangga bambu ganda 7 anak tangga bersandar kokoh dari tanah ke atap genteng, dan sekop pembersih.
     - *Rambu Peringatan Bahaya Lahar Dingin & Menara Sirine EWS*: Tiang loreng hitam-kuning, papan segitiga kuning tanda seru bahaya, dan menara sensor sirine EWS strobo.
     - *Mobil Evakuasi / Truk Rescue BNPB Gagah*: Truk 4x4 rescue oranye dengan kaca kabin biru, garis keselamatan kuning reflektif, strobo ganda merah-biru, dan ban off-road anti-lahar.

4. **🛣️ Jalur Aspal Mulus & Penyingkiran Gerbang Milestone Berteks**:
   - Menghapus plang gerbang pembatas sektor melintang jalan (`SEKTOR 2:...`, `SEKTOR 3:...`, `SEKTOR 4:...`) sehingga jalan aspal evakuasi terbentang bersih dan elegan.
   - Peta background kini 100% bebas dari elemen `<text>`, menyajikan lanskap murni seperti game eksplorasi profesional.

5. **✅ Verifikasi Build Produksi 100% Sukses**:
   - `tsc -b && vite build` lolos bersih tanpa kesalahan dengan status exit code 0 dalam 1.95 detik.

---

> **Catatan Tim**: Seluruh riwayat dan perubahan ini telah disinkronkan ke dalam berkas dokumentasi utama ([`README.md`](./README.md), [`PRD.md`](./PRD.md), [`design.md`](./design.md), [`walkthrough.md`](./walkthrough.md), [`Dashboard.md`](./Dashboard.md), dan [`progress_report.md`](./progress_report.md)).
