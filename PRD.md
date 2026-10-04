# 📋 Product Requirement Document (PRD)
## RESQ-BOX v3.0 — Platform Media Pembelajaran IPA & Mitigasi Bencana

---

### 📌 Informasi Dokumen

| Field | Detail |
|---|---|
| **Nama Proyek** | RESQ-BOX (Rescue Block) |
| **Versi** | 3.10 — *Pixel Quest Edition* |
| **Tim** | RESQ-TEAM |
| **Kompetisi** | Divisi IPDP — LIDM 2026 (Tahap Finalis) |
| **Target Rilis** | September 2026 |
| **Terakhir Diperbarui** | 4 Oktober 2026 |

---

## 1. Ringkasan Eksekutif

**RESQ-BOX** adalah platform media pembelajaran digital berbasis web yang dirancang khusus untuk mata pelajaran **IPA Siswa SMP Kelas 8** dengan topik utama **Struktur Lapisan Bumi, Dinamika Lempeng Tektonik, dan Mitigasi Bencana Geologis (Gempa Bumi & Gunung Berapi)**, khususnya di kawasan rawan lereng gunung (KRB Merapi).

Platform ini memanfaatkan media manipulatif digital dan fisik:
1. **Materi Interaktif & Mini-Quest**: Visualisasi retro-pixel dan petualangan geologi (*Earth Dive* & Wordle Sains).
2. **Action Lab (Drag-and-Drop Block)**: Blok aksi-reaksi sederhana berbahasa ramah anak sebagai *alat bantu* menyusun respon keselamatan darurat (tanpa sintaksis atau istilah teknis coding).
3. **Evacuation Digital Twin**: Simulasi warga digital (NPC) yang bereaksi terhadap respon mitigasi siswa.
4. **Smart Education Board (Diorama Fisik)**: Alat peraga nyata pendukung pembelajaran untuk memberikan *feedback* getaran dan lampu secara konkret.

> 💡 **Pedagogical Stance**: RESQ-BOX **bukan** platform untuk mengajarkan keahlian pemrograman atau elektronika hardware. Pemrograman blok dan perangkat keras diposisikan murni sebagai **media ajar manipulatif (*enabler / learning tool*)** yang membuat konsep sains dan kesiapsiagaan bencana terasa nyata, interaktif, dan menyenangkan.

### Visi v3.0 — *Pixel Quest Edition*
Transformasi visual menyeluruh ke estetika **pixel art game 2D** untuk menciptakan pengalaman belajar yang lebih *fun*, imersif, dan dekat dengan dunia siswa SMP.

---

## 2. Latar Belakang & Permasalahan

### 2.1 Konteks Geografis & Kurikulum
Indonesia berada di pertemuan tiga lempeng tektonik aktif dan cincin api Pasifik (*Ring of Fire*). Materi Dinamika Lempeng dan Kebencanaan pada Kurikulum IPA SMP Kelas 8 menjadi sangat krusial, terutama bagi sekolah di wilayah rawan bencana.

### 2.2 Permasalahan Pembelajaran
1. **Materi Bencana & Struktur Bumi Masih Bersifat Abstrak**: Siswa kesulitan membayangkan pergerakan lempeng tektonik dan mekanisme erupsi vulkanik hanya dari buku teks statis.
2. **Edukasi Kesiapsiagaan Bersifat Pasif**: Sosialisasi mitigasi bencana di sekolah umumnya berupa ceramah atau brosur satu arah tanpa simulasi langsung yang melatih intuisi tanggap darurat.
3. **Ketiadaan Media Ajar Interaktif yang Konkret**: Guru kekurangan alat peraga interaktif yang mampu mendemonstrasikan bagaimana sistem peringatan dini (sensor bahaya ➔ sirine/jalur evakuasi) bekerja secara logis dan nyata.
4. **Keterbatasan Fasilitas & Koneksi Internet di Sekolah Daerah Rawan**: Media pembelajaran sering kali membutuhkan koneksi internet stabil atau peralatan mahal yang sulit diakses.

### 2.3 Solusi RESQ-BOX
RESQ-BOX menghadirkan ekosistem pembelajaran IPA terpadu:
- **Visualisasi Dinamis**: Menjelaskan struktur bumi dan lempeng tektonik melalui game petualangan vertikal retro-pixel (*Earth Dive*) yang memikat.
- **Simulasi Tanggap Darurat Interaktif**: Melatih urutan keselamatan mitigasi melalui *puzzle drag-and-drop*.
- **Eksperimen Logika Aksi Mitigasi**: Siswa merancang respon mitigasi menggunakan blok visual berbahasa sehari-hari (misal: *"Bila terdeteksi getaran gempa" ➔ "Bunyikan sirine & Nyalakan lampu evakuasi"*).
- **Feedback Nyata (Digital & Fisik)**: Siswa langsung melihat reaksi warga di layar (*Digital Twin*) dan merasakan getaran/lampu pada diorama fisik.

---

## 3. Pengguna & Persona

### 3.1 Pengguna Utama (Primary)

| Persona | Deskripsi |
|---|---|
| **Siswa SMP Kelas 8** | Usia 13-14 tahun, sedang mempelajari materi IPA tentang lempeng bumi. Terutama siswa di kawasan lereng gunung (KRB Merapi, Sleman, Yogyakarta). Familiar dengan game mobile dan internet dasar. |

### 3.2 Pengguna Sekunder (Secondary)

| Persona | Deskripsi |
|---|---|
| **Guru IPA / Geografi** | Membutuhkan media ajar interaktif untuk materi mitigasi bencana. Menggunakan platform untuk demonstrasi dan evaluasi pemahaman siswa. |
| **Guru Pembimbing** | Mengawasi proyek dan memberikan arahan akademis terkait relevansi materi. |

### 3.3 Konteks Penggunaan
- **Lingkungan**: Laboratorium komputer sekolah, ruang kelas dengan proyektor
- **Perangkat**: Desktop/laptop sekolah, tablet (responsif)
- **Koneksi**: Bisa terbatas — platform harus **offline-ready** (PWA)
- **Sesi**: Pembelajaran terstruktur 2-3 jam per pertemuan, progresif antar level

---

## 4. Alur Pembelajaran (Learning Flow)

```
┌─────────────────────────────────┐
│         LOGIN / ONBOARD         │
└────────────────┬────────────────┘
                 ▼
┌─────────────────────────────────┐
│          📊 DASHBOARD           │  ← Ikhtisar progres belajar & navigasi quest
└────────────────┬────────────────┘
                 ▼
┌─────────────────────────────────┐
│  🌍 LEVEL 1: EARTH EXPLORER     │  ← Materi IPA: Struktur Lapisan & Batas Lempeng Bumi (8 Area)
│  Zona 0: Permukaan Bumi (0 km)  │     Pegunungan lipatan & Poros Turun Geotermal
│  Zona 1: Kerak Bumi / Litosfer  │     Kerak Benua vs Samudra, Pangea, Subduksi
│  Zona 2: Mantel Bumi            │     Arus konveksi 7.000°F penggerak lempeng tektonik
│  Zona 3: Inti Luar (Logam Cair) │     Dinamika geodynamo medan magnet pelindung
│  Zona 4: Inti Dalam (Besi Padat)│     Pusat bumi 6.371 km, tekanan >3,6 juta atm
│  Zona 5: Batas Divergen         │     Lembah retakan (East African Rift), Pangea & basal baru
│  Zona 6: Batas Konvergen        │     Subduksi lempeng, palung laut dalam & busur api
│  Zona 7: Batas Transform        │     Sesar geser mendatar, Patahan San Andreas (Puncak Lv 1)
│  Gerbang Wordle per Lapisan     │     Evaluasi sains gerbang murni (3 kata target per strata)
│  Sistem Navigasi & Ketahanan    │     Turun/Naik Antar-Lapisan, HP Bar & Anti-Tunneling CCD
└────────────────┬────────────────┘
                 ▼ (Unlock otomatis setelah Core Synthesis Wordle 5 kata tuntas)
┌─────────────────────────────────┐
│ 🏫 LEVEL 2: DISASTER ANALYST    │  ← Simulasi & Mitigasi Tanggap Bencana Gempa SMP
│  Area 1: Teori & SOP Ruang Kelas│     Background Statis, Papan Tulis IPA Kelas 8, 7 NPC SMP, TTS Siaga Gempa
│  Area 2: Drill Simulasi Gempa   │     Cutscene 10s, QTE Kolong Meja, Batu Runtuh, 16 Murid Konsisten, Rambu K3/BNPB
│  Area 3: Lapangan & Titik Kumpul│     Evakuasi Terbuka, Prosedur Pasca-Gempa, Kapsul Kemenangan Level 2
│  Fitur Interaksi & Selebrasi    │     Visual Novel RPG Dialog, Zero-Emoji AI, Overlay Responsif
│  Sinkronisasi Posko Guru        │     Skoring Bertahap (35 / 70 / 100 Poin Tuntas)
└────────────────┬────────────────┘
                 ▼ (Unlock Level 3 HANYA SETELAH ketiga area Level 2 tuntas 100 Poin)
┌─────────────────────────────────┐
│      🎮 LEVEL 3: SIMULATION     │  ← Laboratorium Aksi Mitigasi (Digital Twin)
│  Mission Center (22 Lv)         │     Misi terpandu menyusun sistem tanggap darurat
│  Action Lab (Blockly)           │     Menghubungkan sensor bahaya dengan aksi penyelamatan
│  Evacuation Digital Twin        │     Warga digital merespons langsung aksi siswa di layar
│  My Projects                    │     Ruang kreasi bebas sistem mitigasi impian
└─────────────────────────────────┘
```

---

## 5. Fitur Utama & Spesifikasi

### 5.1 Dashboard
- **Hero Banner** bergaya pixel RPG dengan progress bar dan sapaan personal.
- **3 Kartu Level Petualangan** dengan status gembok/terbuka yang jelas.
- **Navigasi Cepat** ke bab materi dan misi aktif.

### 5.2 Level 1: Earth Explorer (Earth Dive Vertical Adventure)
| Fitur | Deskripsi |
|---|---|
| **Engine Game Earth Dive** | Game eksplorasi vertikal menembus 8 zona geologis & batas tektonik bumi (0 km hingga batas lempeng transform) dengan kontur medan organik kontinu (*smooth cosine interpolation* ala Terraria), fisika lereng mulus, jembatan gantung patahan, lorong tambang batuan dalam (*Deep Mining Tunnel*), sel konveksi mantel bumi, lautan logam cair inti luar, istana kristal inti dalam, serta kawasan pemekaran samudra batas divergen bawah laut dalam (*deep-sea divergent boundary*) lengkap dengan ekosistem penyelam scuba, mantel magma aktif, dan kerak pillow basalt baru bergradasi termal. |
| **Directional Spawning System** | Sistem transisi cerdas antar-area: saat menyelam ke lapisan berikutnya (`down`), pemain muncul di sisi awal (kiri) menghadap ke kanan; saat naik kembali ke lapisan atas (`up`), pemain muncul di sisi akhir (kanan) di samping portal turun keluar. |
| **Penyelarasan Terminologi Navigasi** | Mengganti sebutan "Sumur Bor" menjadi **"Turun Menuju Lapisan Selanjutnya"** (Poros Turun Geotermal) dan "Elevator" menjadi **"Naik Menuju Lapisan Sebelumnya"** (Derek Naik Evakuasi) pada seluruh teks objek, HUD, dan dialog modal. |
| **Gating Gerbang Murni & Modal Peringatan** | Akses turun diblokir ketat jika tantangan gerbang strata aktif belum tuntas. Memunculkan modal retro pixel *"AKSES TURUN DITOLAK! Tantangan Gerbang Belum Selesai"* dengan audio peringatan `retroAudio.playError()`. Evaluasi formatif terpusat murni di gerbang akhir lapisan (tanpa mini challenge di totem temuan). |
| **Fisika Platform Anti-Tunneling (CCD) & Jembatan Basal** | Mencegah bug karakter tembus platform/jembatan saat lompat atau double jump berkecepatan jatuh tinggi (`vy >= 6`) melalui *Continuous Collision Detection* lintasan vertikal (`prevY <= plat.y + 8 && currentY >= plat.y - 4`) dan toleransi tapak kaki lebar (`footMargin = 10`). Elevasi jembatan basal dinaikkan agar menapak kokoh di atas jurang magma. |
| **Sistem HP & Ketahanan Eksplorasi** | Karakter memiliki indikator darah (100 HP). Terjatuh ke jurang magma dalam (`player.y > 440`) mengurangi 25 HP, memicu ledakan audio, respawn di titik spawn aman, dan masa kebal 50 frame. Status HP ditampilkan di HUD atas dengan ikon Pixel Heart dan bar dinamis bergradien. |
| **Streamlined Telemetry HUD & Audio Kristal** | Tampilan status atas yang ringkas dan bersih, menampilkan kedalaman riil (KM), nama strata geologis aktif, radar irisan bumi 3D, perolehan Geo-Crystals (dengan SFX `retroAudio.playPowerup()`), serta indikator HP karakter. |
| **Discovery Modal 2-Panel & Animasi Lempeng** | Titik temuan geologis interaktif dengan ilustrasi komparasi bersih (Kerak Benua vs Samudra), diagram 3D animasi batas lempeng (Divergen, Konvergen subduksi, Transform sesar), temuan inti dalam (bola besi padat tahan leleh tekanan >3,6 juta atm & altar pusat bumi 6.371 km), serta animasi superbenua Pangea, penampang East African Rift, dan seafloor spreading. |
| **Gerbang Evaluasi Wordle Dinamis** | Syarat membuka gerbang turun antar-lapisan menggunakan tebak kata Wordle interaktif dengan panjang kata adaptif (`targetWord.length`, ukuran ubin dinamis `w-9`/`w-8`/`w-7`, dan modal kemenangan terpadu). Soal gerbang Area 6 mencakup `PANGEA`, `MENJAUH`, `MAGMA`. |
| **Gerbang Terbuka & Kapsul Akhir Evakuasi** | Keberhasilan Wordle gerbang membuka akses portal turun ke zona berikutnya secara mulus. Kapsul akhir evakuasi dan pop-up kemenangan Level 1 secara eksklusif muncul di Area 8 sebagai penutup Level 1. |
| **Skoring Dinamis Real-Time 8 Area (Total 100 Poin)** | Penilaian geologis adaptif 8 area: Permukaan (12 Poin), Kerak (25 Poin), Mantel (38 Poin), Inti Luar (50 Poin), Inti Dalam (63 Poin), Batas Divergen (75 Poin), Batas Konvergen (88 Poin), Batas Transform (100 Poin Tuntas). Telemetri progres otomatis tersinkronisasi ke dasbor pemantauan guru setiap gerbang terbuka. |
| **Area 8: Batas Transform & Patahan San Andreas (POV Top-Down)** | Eksplorasi zona ke-8 dengan sudut pandang unik dari atas (*2D Top-Down View*) di padang gurun California. Menampilkan jalan aspal terpotong geser dan pembelokan saluran sungai Wallace Creek sejauh 130m dengan tekstur poligon kontinu solid (*zero scanline gaps*), serta 25 benih rekahan sesar bercabang (*branching fissures*) bergradasi jurang hitam pekat dan sorotan tebing retak. |
| **Fisika Melompati Celah Sesar Top-Down 3D** | Rintangan jurang patahan mendatar ($Y = 228..252$) memblokir jalan kaki di tanah. Pemain dapat melompati lubang sesar dengan fisika lompatan parabola 3D (`jumpZ`, gravitasi vertikal `jumpZVelocity`, bayangan dinamis mengecil) menggunakan tombol Spasi atau tombol sentuh `LONCAT`. Tombol Atas murni menggerakkan karakter ke Utara tanpa memicu lompatan. |
| **D-Pad 4 Arah Tablet & Staf Peneliti Lapangan** | Kontrol sentuh D-Pad berlian 4 arah (Atas, Bawah, Kiri, Kanan) di kiri dan tombol aksi mandiri `LONCAT` & `AKSI [E]` di kanan. Staf peneliti lengkap (Dr. Maya, Prof. Sarah, Dr. Taufik, Petugas Rudi, Komandan Guntur) berdiri aman di tanah padat selatan ($Y = 315$). Evaluasi Wordle akhir (`TRANSFORM`, `SANANDREAS`, `SISMOGRAF`) membuka Kapsul Evakuasi Kemenangan Akhir Level 1. |
| **Rendering Anti-Burem Resolusi Tinggi (High-DPI / DevicePixelRatio)** | Skalasi buffer internal kanvas otomatis mengikuti `window.devicePixelRatio` di `resizeCanvas` dan aturan tipografi anti-aliasing tajam di `index.css`, menjamin teks pixel dan grafis tetap tajam 100% saat di-zoom in hingga 250% maupun pada layar Retina tablet murid. |
| **Multi-User Scoped State & Refresh Protection** | Penyimpanan sesi otomatis terisolasi per akun siswa (`resqbox_earthdive_progress_${userId}` dan `resqbox-unlocked-level_${userId}`), menjamin progres tidak hilang saat refresh dan mencegah kebocoran status antar-akun pada peramban yang sama. |
| **Platforming Pilar Basal Mantel Bumi** | Topografi Zona 2 (Mantel Bumi) direkonstruksi menjadi platforming pilar basal terapung (`basalt_pillar`) di atas danau magma konveksi termal yang mendidih. Penempatan NPC (Zahra di $px=380$, Lintang di $px=700$, Bu Tyas di $px=1070$) dan Kristal Geologis di $px=540$ diselaraskan secara presisi di atas pilar aman bebas magma (zero-magma fall). |
| **Penukaran Map Inti Luar vs Inti Dalam & Pembedaan Atmosfer** | Penukaran arsitektur map antara Inti Luar dan Inti Dalam: Inti Luar mengadopsi kubah batuan datar luas ($Y \approx 356$) dengan efek kilatan petir geodynamo dan loop medan magnetik kuning keemasan berpendar; Inti Dalam mengadopsi teras heksagonal purba melintasi jurang fluida bersuasana gelap pekat dan pendaran kristal logam padat kompresi >3,6 juta atm; serta penambahan 1 kristal energi baru di pematang tengah Inti Dalam ($px=590, py=280$). |
| **Sistem Baju Pelindung Geologis & Ekonomi Kristal Energi** | Mengalihfungsikan kristal energi sebagai mata uang geologis untuk membeli setelan khusus: Baju Termal MK-1 (Mantel Bumi), Baju Elektromagnetik MK-2 (Inti Luar), Exo-Suit Adamantine MK-3 (Inti Dalam), dan Baju Penyelam Samudra Kedalaman (Batas Divergen). Disediakan oleh 4 NPC Teknisi (Joko, Rudi, Dian, Arya) via modal `SuitMerchantModal.tsx` seharga 1 kristal per baju. Gatekeeping portal memblokir akses ke lapisan berikutnya jika setelan belum dipakai disertai peringatan bahaya lingkungan ekstrem `suitWarningModal`. |
| **Alur Dialog Bu Tyas Pasca-Wordle & Pengarahan Teknisi** | Alur dialog otomatis berkesinambungan bersama Bu Tyas begitu tebak kata Wordle selesai dijawab: Bu Tyas mengedukasi bahaya suhu/tekanan ekstrem zona berikutnya dan mengarahkan siswa menukar kristal ke Teknisi sebelum melompat ke portal bawah tanah. |
| **Visual Sprite Sheet Avatar Baju Pelindung Dinamis** | Integrasi 4 variasi sprite avatar siswa di `studentAvatarSheet.ts` (`hazard_mantle`, `hazard_outer`, `hazard_inner`, `diver`) dengan helm khusus, visor, kisi pendingin termal, sirip medan fluks dinamo, mahkota kristal emas adamantine, dan helm kubah selam laut dalam. |

### 5.3 Level 2: Disaster Analyst — Mitigasi Tanggap Darurat Bencana Sekolah & Ruang Kelas SMP
| Fitur | Deskripsi |
|---|---|
| **Transformasi Konsep Menjadi Mitigasi Sekolah** | Berdasarkan evolusi kurikulum IPA SMP Kelas 8, materi batas lempeng diintegrasikan ke Level 1 (Area 6-8), sedangkan Level 2 didedikasikan penuh untuk **Edukasi & Simulasi Mitigasi Kebencanaan Sekolah (Gempa Bumi & Erupsi Merapi)**. Terdiri dari 3 area: (1) **Area 1: Ruang Kelas SMP** (Teori Mitigasi & 3 Pilar), (2) **Area 2: Ruang Kelas Simulasi Gempa** (Drill Tanggap Darurat Interaktif), dan (3) **Area 3: Lapangan Evakuasi & Titik Kumpul** (Titik Kumpul Akhir & Kapsul Kemenangan). |
| **Area 1: Ruang Kelas SMP (Teori Mitigasi & 7 NPC)** | Latar ruang kelas realistis dengan meja belajar berderet kokoh di lantai (bebas paralaks melayang), papan tulis utama `IPA: KELAS 8`, mading corkboard 3 pilar mitigasi (Prabencana, Saat Gempa, Pascabencana), 7 NPC warga sekolah berseragam resmi SMP (Bu Rahma, Pak Surya, Kak Fajar, Rian, Dito, Siti, Siswa Penjelajah), modul ilustrasi SOP Gempa realistis, dan evaluasi Teka-Teki Silang (TTS). |
| **Area 2: Drill Simulasi Tanggap Gempa Ruang Kelas** | Skenario drill gempa interaktif: diawali penjelasan Bu Rahma di depan kelas (seluruh 16 murid duduk di kursi), sirine alarm gempa berbunyi, dialog peringatan darurat Bu Rahma, QTE 10 detik merunduk ke kolong meja belajar, cutscene batu beton runtuh menimpa kepala pemain jika telat merunduk, gempa 10 detik dengan tremor halus (2.0–3.0px), Bu Rahma ikut merunduk di bawah meja guru, seluruh siswa memegang ransel di atas kepala, dan aba-aba evakuasi tertib ke lapangan. |
| **Area 3: Lapangan Evakuasi Pascabencana & Titik Kumpul** | Lapangan terbuka hijau dengan rumput statis anti-jitter (`stepX = 28`), rambu resmi TITIK KUMPUL standar BNPB (`#14532d`, 4 panah inward, 4 figur siluet, teks `TITIK` `KUMPUL`), ambulans medis menapak tanah (`y = 360`) dengan bayangan kontak dan kaca sejajar, briefing otomatis Maskot Resqy, 5 NPC warga sekolah (Rian, Bu Rahma, Budi, Maya, Komandan Satria), dan evaluasi akhir Teka-Teki Silang (TTS). |
| **Ekosistem 16 Murid Kelas Konsisten 100% (Area 2)** | Array konstan `CLASSROOM_STUDENTS_L2` (Rian, Dito, Siti, Budi, Fani, Edo, Maya, Reza, Dewi, Bayu, Tari, Doni, Lina, Agus, Putri, Gilang). Murid konsisten 100% di semua fase: duduk saat guru mengajar, merunduk memegang tas ransel di atas kepala saat gempa, dan berbaris tertib di koridor evakuasi menuju pintu keluar lapangan. |
| **Ekosistem 5 NPC Lapangan Pascabencana (Area 3)** | Rian (`px: 160`, presensi & arahan titik kumpul), Bu Rahma (`px: 360`, Temuan 1: Protokol Keselamatan di Titik Kumpul), Budi (`px: 560`, pos P3K), Maya (`px: 760`, Temuan 2: Koordinasi Medis & Triase Darurat), dan Komandan Satria (`px: 1040`, penjaga gerbang evaluasi TTS & pembukaan Kapsul Akhir Evakuasi). |
| **Rumput Lapangan Statis Anti-Jitter & Bebas Paving** | Algoritma penempatan rumput menggunakan grid koordinat dunia statis mutlak (`stepX = 28`) dengan modulus hashing matematis sehingga bilah rumput dan bunga liar tetap di tempatnya (zero jitter) saat kamera bergeser atau pemain melangkah. Menghapus teks paving lantai agar lapangan terbuka hijau tampak asri. |
| **Ambulans Medis Menapak Tanah & Kaca Proporsional** | Posisi ambulans digeser ke kiri menjauh dari pintu, roda menapak pas di permukaan tanah pada `y = 360` (`ambY = 281`) dengan bayangan kontak roda hitam, kaca kabin sejajar tanpa melayang di atas kap mesin, serta sirene merah-biru di tengah atap. |
| **Briefing Otomatis Resqy & Zero-Emoji Standar** | Maskot Resqy menyapa pemain secara otomatis via visual novel saat masuk Area 3 (`resqy_briefing_area3`). Seluruh UI dialog dan antarmuka game 100% bersih dari emotikon OS/AI modern, digantikan teks dan badge pixel (`[ON]`, `[OFF]`, `[X]`, dll.). |
| **Pintu Belakang Tunggal & Pembersihan Garis Polisi** | Menghapus duplikasi pintu bertumpukan di awal area (`x = 40`) menjadi pintu tunggal bersih `drawAssemblyFieldBackDoor`, serta menghapus pita barikade kuning-hitam melayang di langit-langit. |
| **Discovery Counter Telemetri & Gating Komandan Satria** | Pelacakan status temuan terhubung ke counter HUD telemetri (`disc-post-safety` dan `disc-post-coordination`). Komandan Satria memblokir evaluasi TTS hingga kedua materi pascabencana selesai dibaca murid. |
| **Gerbang Teka-Teki Silang (TTS) Pascabencana Ramah SMP** | Evaluasi akhir Level 2 bersama Komandan Satria menggunakan grid Teka-Teki Silang (TTS) dengan 4 kata kunci sains ramah SMP Kelas 8 (`TITIKKUMPUL`, `AMBULANS`, `P3K`, `AMAN`) tanpa campuran istilah asing atau bocoran kunci jawaban di dialog NPC. |
| **Cutscene Kegagalan QTE & Animasi Batu Runtuh** | Jika pemain terlambat merunduk dalam durasi QTE 10 detik di Area 2, batu beton besar runtuh dari plafon menimpa kepala pemain disertai efek suara sakit (*hurt SFX*), 8 serpihan batu pecah berkeping-keping, bintang pusing berputar `★ ★ ★`, dan dialog evaluasi kegagalan dari Bu Rahma untuk mengulang simulasi dari awal. |
| **Standarisasi Rambu Resmi JALUR EVAKUASI (K3/BNPB)** | Menggantikan kotak hijau polos menjadi Rambu Resmi **JALUR EVAKUASI** standar keselamatan K3 dan BNPB di `x: 1620`: latar hijau keselamatan `#007a3d`, garis tepi putih ganda, pintu putih terbuka dengan sosok berlari hijau, divider garis putih, teks bold `JALUR EVAKUASI`, dan panah tebal putih menunjuk ke kanan menuju pintu evakuasi lapangan terbuka. |
| **Poster SOP Gempa Frame 104px Anti-Tembus** | Frame kayu poster SOP Gempa di `x: 260` diperlebar dari 70px menjadi 104px (`p1W = 104px`), menjamin butir *1. MERUNDUK*, *2. BERLINDUNG*, *3. BERTAHAN*, dan *DI BAWAH MEJA* tertata rapi di dalam batas poster dengan margin kanan 24px. |
| **Perbesaran Kartu Overlay Popup & Zero-Emoji AI** | Kartu overlay diperbesar proporsional: QTE diperlebar ke `720x118` (bar timer 16px tebal), Timer gempa diperbesar ke `680x80` (font 14px/9.5px tebal, pulsing beacon kedip, progress bar 7px), dan aba-aba evakuasi diperbesar ke `680x78`. Seluruh emotikon Unicode modern/AI dibersihkan total dan diganti badge pixel `[!]`, `[AMAN]`, `[TIPS]`, `[ULANG]`. |
| **Eliminasi Telemetri & Temuan Geologis di Ruang Kelas** | Area 2 difokuskan murni pada drill kebencanaan ruang kelas; telemetri teknis geologis (kedalaman, tekanan, suhu) dan objek temuan geologis dihapus total dari Area 2. |
| **Sinkronisasi Skoring Bertingkat Posko Guru** | Skor Level 2 tersinkronisasi ke Supabase dan Teacher Dashboard: Area 1 Selesai (35 Poin), Area 2 Selesai (70 Poin), Area 3 Selesai (100 Poin tuntas & membuka Level 3). |
| **Proteksi Penguncian Level 3 & Multi-User Autosave** | Level 3 di dashboard hanya terbuka jika seluruh misi Level 2 tuntas 100 Poin. Progres disimpan persisten per akun siswa (`resqbox_level2_progress_${userId}`) dengan perlindungan auto-save bertingkat saat bermain maupun reload peramban. |

### 5.4 Level 3: Simulation Game (Action Lab & Digital Twin)
| Fitur | Deskripsi |
|---|---|
| **Mission Center** | 22 misi bertingkat dengan narasi skenario darurat nyata (Gempa, Banjir Lahar, Erupsi) |
| **Action Lab (Blockly)** | Antarmuka blok visual berbahasa Indonesia ramah anak (contoh: *"Jika Sensor Getaran Mendeteksi Gempa" ➔ "Bunyikan Sirine & Buka Pintu Evakuasi"*). Siswa fokus pada logika mitigasi, bukan coding teknis. |
| **Sensor Panel** | Slider interaktif untuk mensimulasikan kondisi lingkungan (Skala MMI gempa, status aktivitas vulkanik) |
| **Evacuation Digital Twin** | Peta simulasi 2D di mana karakter warga (NPC) bergerak mencari tempat aman berdasarkan aksi yang diatur siswa |
| **My Projects** | Sandbox eksperimen bebas untuk merancang skenario mitigasi kreasi siswa sendiri |

### 5.5 Alat Peraga Interaktif (Smart Education Board Diorama)
| Komponen Diorama | Peran dalam Pembelajaran |
|---|---|
| **Miniatur Diorama** | Representasi fisik kawasan pemukiman lereng gunung |
| **Motor Getar (Haptic)** | Mensimulasikan getaran fisik gempa bumi secara nyata |
| **Lampu LED Jalur** | Menandai jalur evakuasi aman dan zona bahaya |
| **Sirine / Buzzer** | Membunyikan alarm peringatan dini kebencanaan |
| **Servo Gerbang** | Membuka gerbang keselamatan evakuasi |

**Mekanisme Dual-Feedback Loop**:
1. Logika mitigasi yang disusun siswa dikirimkan ke diorama via Web Serial API (*plug-and-play*).
2. Siswa merasakan getaran fisik gempa dan melihat lampu diorama menyala.
3. Secara bersamaan, warga digital (NPC) di layar bergerak menuju titik kumpul aman.

> **Catatan Media Ajar**: Hardware ini bekerja murni sebagai **alat peraga nyata (tangible learning aid)** pendukung pembelajaran IPA. Siswa tidak dibebani materi teknis elektronika/rangkaian sirkuit.

### 5.6 Posko Guru & Manajemen Kelas Terpadu (`/teacher`)
| Fitur Posko Guru | Spesifikasi Fungsional |
|---|---|
| **Pusat Monitoring Multi-Level** | Tabel data siswa interaktif bergaya papan pixel komando yang menampilkan Nama, Nomor Absen, Username, Kode Kelas, Level Aktif, serta status capaian per level (Level 1 Earth Dive, Level 2 Tectonic Explorer, Level 3 Lab Simulasi). |
| **Tata Letak Chip Level Anti-Wrap** | Badge level aktif (`LEVEL 1`, `LEVEL 2`, `LEVEL 3`) menggunakan format `inline-block whitespace-nowrap text-nowrap` dengan non-breaking space Unicode (`\u00A0`), mencegah teks patah vertikal ke bawah. |
| **Skoring Dinamis Real-Time Level 1 (20 Poin/Lapisan)** | Merekam skor geologi Level 1 secara proporsional sesuai capaian lapisan murid (Kerak 20, Lempeng 40, Mantel 60, Inti Luar 80, Inti Dalam 100), jumlah kristal terkumpul, dan lencana sains. |
| **Skoring Bertingkat Terintegrasi Level 2 (35/70/100 Poin)** | Kolom evaluasi `LV. 2 (TEKTONIK)` mencatat kemajuan nyata penjelajahan lempeng: Area 1 (35 Poin), Area 2 (70 Poin), Area 3 (100 Poin tuntas & membuka Level 3). Menghapus label statis 'Sedang disusun' menjadi status dinamis yang hidup. |
| **Standarisasi Status Ketuntasan Ketat** | Status `[ TUNTAS ]` secara ketat hanya diberikan apabila nilai murid telah mencapai 100 Poin penuh. Selama skor masih di bawah 100 (misal 20–80 poin di Lv. 1 atau 35–70 poin di Lv. 2), status otomatis menampilkan `[ PROGRES ]` dengan perolehan skor riil. |
| **Logika Level Aktif Murid Stabil** | Level aktif murid diproteksi dari lonjakan prematur ke level selanjutnya sebelum tantangan akhir area/strata tuntas 100 poin, konsisten baik sesi live maupun setelah refresh halaman. |
| **Filter Kelas & Level Dinamis** | Menyaring siswa berdasarkan kelas (Kelas 8A, Kelas 8B) serta filter level aktif (`SEMUA`, `LV.1`, `LV.2`, `LV.3`) secara *real-time*. |
| **Pencarian Cepat & Ekspor CSV** | Pencarian siswa instan berdasarkan nama atau nomor absen, serta fitur unduh rekap nilai format CSV lengkap dengan status dan nilai numerik per level. |
| **Cetak Rapor Belajar Geologi & Mitigasi** | Fitur cetak lembar rapor hasil belajar individual siswa lengkap dengan capaian lapisan bumi, dinamika lempeng tektonik, perolehan kristal, kata kunci sains, dan evaluasi guru. |
| **Kredensial Guru Resmi** | Akses cepat dengan username `guru` dan password `guru123`. |

### 5.7 Sistem Autentikasi, Registrasi & Profil Siswa
| Fitur Autentikasi | Spesifikasi Fungsional |
|---|---|
| **Registrasi Siswa Mandiri** | Pendaftaran akun baru dengan input Nama Lengkap, Nomor Absen, Username, Password, dan Kode Kelas valid (`8b`, `8B`, `RESQ-8A`, dll.). |
| **Dual Storage Sync** | Sinkronisasi data ke cloud database Supabase dengan fallback penyimpanan lokal (*Local Storage*) untuk kesiapan offline. |
| **Ganti Password Mandiri** | Fitur pada modal Profil Siswa (`/profile`) yang memungkinkan siswa memperbarui password mereka sewaktu-waktu. |
| **Proteksi Rute Cepat** | Perlindungan rute otomatis (*Zero-Delay Guard*) yang mengarahkan pengunjung tanpa sesi login langsung ke portal `/login`. |

---

## 6. Perubahan Desain v3.0 — Pixel Quest Edition

### 6.1 Identitas Visual & Atmosfer
| Aspek | Implementasi Pixel Quest (v3.0) |
|---|---|
| **Tipografi** | `'Press Start 2P'` untuk judul arcade, `'Pixelify Sans'` untuk teks materi & form, `'JetBrains Mono'` untuk kode/PIN. Bebas 100% dari font sans-serif modern standar browser. |
| **Latar Belakang Login** | *2D Tropical Misty Cloud Forest*: Kanopi hutan tropis, kabut lembah bergerak, berkas sinar matahari pagi (*god-rays*), dan partikel embun. |
| **Ikonografi & Standar Zero-Emoji** | 100% SVG 2D Pixel Art kustom (`PixelIcon`), bebas dari ketergantungan emoji sistem operasi untuk menjaga keseragaman tampilan antar-perangkat. |
| **Komponen UI** | Papan kayu ekspedisi (*Expedition Command Slate*) dengan 4 baut emas pixel (*golden corner rivets*) dan tombol taktil 3D. |
| **Audio Feedback** | Efek suara sintetis 8-bit (*Web Audio API Chiptune*) saat klik tombol, login berhasil, level terbuka, dan peringatan bahaya. |

### 6.3 Gamifikasi Pixel & Engine
- **Earth Dive (Level 1)**: Platformer penjelajahan geologis dengan kontur tanah & langit-langit gua kontinu (*continuous cosine terrain profile* ala Terraria / TheoTown), jembatan gantung, scaffolding tambang, dan animasi karakter hidup (walk, jump rise, fall glide, landing squash).
- **Directional Spawning System**: Alur perpindahan zona natural (bergerak maju menyelam ➔ spawn di kiri menghadap kanan; kembali naik ➔ spawn di kanan menghadap kiri).
- **Evacuation Game (Level 3)**: Simulasi evakuasi top-down pixel RPG dengan karakter NPC beranimasi walk-cycle dan navigasi jalur aman berbasis tilemap.
- **UI Overlay**: Pixel art HUD bertema petualangan ekspedisi sains tanpa elemen yang melayang atau terpotong.

---

## 7. Kebutuhan Non-Fungsional

| Aspek | Requirement |
|---|---|
| **Performa** | FPS game ≥ 30fps pada perangkat sekolah menengah. Upload logika ke hardware < 3 detik |
| **Aksesibilitas** | UI intuitif untuk usia 13-14 tahun tanpa perlu pemahaman teknik elektro |
| **Offline** | PWA dengan full offline support setelah pemuatan pertama |
| **Responsif** | Desktop-first (1024px+), adaptif untuk tablet (768px+) |
| **Browser** | Chrome 90+, Edge 90+, Firefox 90+ (Web Serial API hanya Chrome/Edge) |
| **Ukuran Bundle** | < 5MB initial load, lazy loading untuk Level 2 & 3 |
| **State Persistence** | LocalStorage untuk progress siswa, draft workspace, dan unlock level |

---

## 8. Arsitektur Teknis

### 8.1 Tech Stack

| Layer | Teknologi | Versi |
|---|---|---|
| **Framework** | React + TypeScript | 19 / TS 6 |
| **Build Tool** | Vite | 8.x |
| **Styling** | Tailwind CSS | 4.x |
| **State Management** | Zustand | 5.x |
| **Block Editor** | Google Blockly | 12.x |
| **Drag & Drop** | @dnd-kit (Core + Sortable) | 6.x / 10.x |
| **Routing** | React Router Dom | 7.x |
| **Icons** | Custom Pixel Icons (100% SVG) | — |
| **PWA** | Vite Plugin PWA | 1.x |
| **Backend** | Laravel (PHP) | 11.x |

### 8.2 Struktur Folder Saat Ini

```
RESQ-BOX/
├── src/
│   ├── app/
│   │   ├── AppLayout.tsx          ← Layout utama (Zero-Header Viewport)
│   │   ├── Dashboard/             ← Halaman utama (Hero Volcano Pixel Art)
│   │   ├── Level1/                ← Earth Explorer
│   │   │   ├── EarthDive/         ← Engine game petualangan vertikal 2D
│   │   │   │   ├── EarthDiveGame.tsx   ← Game loop & integrasi modal
│   │   │   │   ├── TelemetryHUD.tsx    ← HUD status kedalaman & strata
│   │   │   │   ├── DiscoveryModal.tsx  ← 2-Panel komparasi geologi
│   │   │   │   ├── MiniChallengeModal.tsx
│   │   │   │   ├── CoreChallengeModal.tsx
│   │   │   │   ├── earthDiveData.ts    ← Database lapisan geologis kurikulum
│   │   │   │   └── engine/
│   │   │   │       ├── zones.ts        ← Profil tanah organik 5 strata
│   │   │   │       ├── gameEngine.ts   ← State game & directional spawn
│   │   │   │       ├── player.ts       ← Fisika lereng mulus & pose udara
│   │   │   │       ├── renderer.ts     ← Pipeline kanvas & kamera presisi
│   │   │   │       └── sprites.ts      ← Generator grafis pixel & Merapi bg
│   │   ├── Level2/                ← Tectonic Explorer (3 Area) & Mitigasi Bencana
│   │   │   ├── engine/            ← Engine platformer tektonik 2D
│   │   │   │   ├── TectonicGame.tsx   ← Game loop, HUD & controller modal
│   │   │   │   ├── zones.ts           ← Konfigurasi medan retakan divergen
│   │   │   │   ├── gameEngine.ts      ← State game, auto-save & moving platforms
│   │   │   │   ├── player.ts          ← Fisika gerak & deteksi platform melayang
│   │   │   │   ├── renderer.ts        ← Rendering kanvas & kamera halus
│   │   │   │   └── sprites.ts         ← Latar belakang rift valley & partikel belerang
│   │   │   ├── CrosswordModal.tsx     ← Teka-teki silang gerbang tektonik
│   │   │   ├── DiscoveryModal.tsx     ← Rekonstruksi Pangea & diagram geologis
│   │   │   ├── MiniChallengeModal.tsx
│   │   │   ├── level2Data.ts          ← Database misi 3 area tektonik
│   │   │   ├── level2Sync.ts          ← Sinkronisasi progres & proteksi Level 3
│   │   │   ├── GempaBumi.tsx          ← Materi teori gempa bumi tektonik
│   │   │   ├── GunungMerapi.tsx       ← Materi erupsi vulkanik Merapi
│   │   │   └── PuzzleBoard.tsx        ← 10 skenario puzzle mitigasi bencana
│   │   ├── Level3/                ← Simulation Game (Misi + Proyek)
│   │   ├── Workspace/             ← Action Lab (Blockly + Sensor Panel)
│   │   ├── EvacuationGame/        ← Digital Twin canvas game
│   │   ├── Login/                 ← Portal login & registrasi siswa
│   │   ├── Profile/               ← Profil siswa & pilihan avatar pixel
│   │   ├── TeacherDashboard/      ← Posko monitoring kemajuan kelas guru
│   │   ├── Credits/               ← Papan apresiasi tim pengembang
│   │   └── components/            ← Komponen UI bersama (PixelIcon, dll.)
│   │   └── data/missions.ts       ← Data 22 level misi (JSON-like)
│   │
│   ├── mitigation/
│   │   └── data/scenarios.ts      ← 10 skenario mitigasi drag-drop
│   │
│   ├── store/
│   │   ├── authStore.ts           ← Auth state
│   │   ├── teacherStore.ts        ← Level unlock + classroom
│   │   ├── missionStore.ts        ← Progress misi
│   │   ├── workspaceStore.ts      ← Draft workspace & proyek
│   │   ├── runtimeStore.ts        ← Pin states & sensor values
│   │   └── simulatorStore.ts      ← Simulator state
│   │
│   └── assets/                    ← Gambar, SVG, aset statis
│
├── backend/                       ← Laravel backend
├── public/                        ← Aset publik & PWA icons
└── vite.config.ts
```

---

## 9. Metrik Keberhasilan

| Metrik | Target |
|---|---|
| **Completion Rate Level 1** | ≥ 80% siswa menyelesaikan Wordle dalam 1 sesi |
| **Completion Rate Level 2** | ≥ 70% siswa mendapat skor sempurna di ≥ 1 skenario |
| **Engagement Time** | Rata-rata ≥ 45 menit per sesi pembelajaran |
| **NPC Survival Rate** | Siswa mencapai ≥ 70% warga selamat di Evacuation Game |
| **Offline Reliability** | 100% fitur inti berfungsi tanpa internet setelah load pertama |

---

## 10. Roadmap Pengembangan

| Fase | Fokus | Status |
|---|---|---|
| **v1.0** | Fondasi (Vite + React + Blockly + Dashboard) | ✅ Selesai |
| **v2.0** | Modul Pembelajaran (Level 1-3) + Gamifikasi + Lock System | ✅ Selesai |
| **v3.0** | **Pixel Quest Edition** — redesign visual, optimasi performa, polish | 🔄 Sedang berjalan |
| **v3.1** | Integrasi hardware Smart Education Board + Web Serial API | 📋 Direncanakan |
| **v3.2** | Admin Panel guru + laporan progress siswa | 📋 Direncanakan |

### Prioritas v3.0

1. **[P0] Redesain Visual Pixel Art** — Font pixel, color palette, UI components
2. **[P0] Optimasi Performa EvacuationGame** — Fix lag, improve rendering
3. **[P1] Materi Interaktif Pixel-Style** — Redesain konten Level 1 & 2
4. **[P1] Pixel Art Assets** — Sprite characters, tilemap, icons
5. **[P2] Animasi & Transisi Pixel** — Page transitions, micro-interactions
6. **[P2] Sound Effects** — Retro 8-bit SFX untuk interaksi

---

## 11. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Performa game lag di perangkat sekolah | Tinggi | Throttle rendering, offscreen canvas, tilemap optimization |
| Font pixel mengurangi keterbacaan materi panjang | Sedang | Gunakan pixel font hanya untuk heading/label, body text tetap readable font |
| Aset pixel art membutuhkan waktu produksi | Sedang | Prioritaskan elemen kunci, gunakan AI generation + manual pixel editing |
| Web Serial API tidak didukung di semua browser | Sedang | Graceful fallback ke simulasi murni virtual, pastikan Chrome/Edge tersedia di lab |
| Scope creep pada redesain | Tinggi | Freeze fitur di v3.0, fokus hanya pada visual overhaul + performa |

---

## 12. Tim Pengembangan (LIDM 2026 — Divisi IPDP)

| Nama | Peran & Tanggung Jawab |
|---|---|
| **Muhammad Zidane Romadhona Haryanto** | Ketua Tim & Developer Utama (Arsitektur Aplikasi, Simulasi & Fullstack) |
| **Ichsan Abror** | Hardware Engineer (Rancang Bangun Perangkat & Sensor Kebencanaan) |
| **Zahra Rokhadatul Aisy Ramadhani** | UI/UX Designer & Asisten Developer (Desain Antarmuka Pixel Art & Asisten Teknis) |
| **Lintang Pansavia Lysandra** | Penyusun Materi IPA & Manajemen Laporan (Kurikulum Kebencanaan & Dokumentasi Proyek) |
| **Rizki Arumning Tyas, M.Pd.** | Dosen Pendamping Inovasi Pembelajaran Digital Mitigasi Bencana • Universitas Negeri Yogyakarta |

---

## 13. Rekam Jejak Percakapan & Pengambilan Keputusan Desain (Session Log)

Bagian ini merekam seluruh instruksi, evaluasi, dan keputusan teknis yang telah disepakati dan diimplementasikan:

1. **Penegasan Pedagogis & Penyederhanaan Ruang Lingkup**:
   - Menghapus klaim bahwa platform mengajarkan "pemrograman komputer" atau "keahlian elektronika/hardware".
   - Menetapkan bahwa *drag-and-drop block* dan diorama fisik murni berfungsi sebagai **alat bantu manipulatif (*learning aids*)** agar siswa fokus 100% pada penguasaan materi IPA SMP Kelas 8 (Struktur Lapisan Bumi, Dinamika Lempeng Tektonik, dan Mitigasi Gempa/Erupsi Merapi).
2. **Pemberhentian Sidebar & Header Bawaan (Pure Full-Screen Game Shell)**:
   - Sidebar navigasi dihapus secara total.
   - Header atas bawaan (`AppLayout.tsx`) dihilangkan di seluruh halaman (Beranda, Profil Siswa, Credits, Level 1, Level 2, Level 3). Semua interaksi berpindah ke elemen tombol adegan (*in-scene UI*).
3. **Penyempurnaan Halaman Beranda (Title Screen Gunung Api Pixel)**:
   - Mengganti latar belakang dengan adegan gunung api pixel 2D SVG beranimasi (magma berdenyut, partikel asap kawah, bara api melayang, awan meluncur, matahari berdenyut).
   - Mengganti kartu menu modern menjadi papan kayu berukir 3D (*3D Wooden Planks*) untuk:
     - `1. EARTH EXPLORER`
     - `2. DISASTER ANALYST`
     - `3. SIMULATION GAME`
     - Tombol sekunder: `PANDUAN & MISI`, `PROFIL SISWA`, `CREDITS`.
   - Mengganti indikator nyawa/hati menjadi **Badge Profil Taruna** yang bersih (Avatar, Nama, Sekolah, Tingkat Kesiapsiagaan).
   - Menambahkan tombol **Layar Penuh (Fullscreen ⛶)** native untuk kebutuhan proyektor kelas.
4. **Implementasi Halaman Profil Siswa (`/profile`)**:
   - Tema adegan: *Nighttime Starry Rescue Camp* (langit malam bertabur bintang kelap-kelip animasi, bulan kawah pixel, dan pohon pinus gelap).
   - Form biodata murid: Pilihan avatar pixel (Rescuer Boy, Rescuer Girl, Ahli Geologi, Rescue Bot), Nama Lengkap, Kelas, Nomor Absen, Asal Sekolah, PIN Akses 4-Digit, dan Rekam Jejak Progres Level.
   - Posisi tombol: Tombol `SIMPAN PROFIL TARUNA ➔` dan tombol `◀ KEMBALI KE MENU UTAMA` disusun bertumpuk secara vertikal (bukan bersampingan) menggunakan papan kayu retro penuh.
5. **Implementasi Halaman Credits & Tim Pengembang (`/credits`)**:
   - Tema adegan: *Sunset Golden Mountain* (gradien langit senja keemasan, siluet gunung gelap, awan senja, dan kunang-kunang bara api).
   - Struktur tim diperbarui sesuai formasi resmi: Zidane (Ketua & Dev Utama), Ichsan (Hardware Engineer), Zahra (UI/UX & Asisten Dev), Lintang (Materi IPA & Laporan), dan Ibu Rizki Arumning Tyas, M.Pd. (Dosen Pembimbing).
   - Menghapus kotak *badge* teknologi (*TEKNOLOGI: React 19... PWA OFFLINE READY*) agar tampilan bersih dan terfokus pada apresiasi tim.
6. **Sintesis Efek Suara Chiptune 8-Bit (`retroAudio.ts`)**:
   - Mengembangkan generator Web Audio API mandiri untuk efek suara retro tanpa dependensi file audio eksternal (Select, Hover, Unlock, Error, Level Complete).
7. **Komitmen Desain Modul Mendatang**:
   - Seluruh modul level pembelajaran berikutnya disepakati akan menerapkan gaya visual retro pixel art konsisten tanpa bilah header atas konvensional.
8. **Transformasi Game 2D Level 2 Tectonic Explorer**:
   - Merancang Level 2 menjadi game penjelajahan 2D open-world bertema batas lempeng tektonik yang terbagi dalam 3 area sekuensial: Area 1 (Batas Divergen & Pangea), Area 2 (Batas Konvergen & Subduksi), dan Area 3 (Batas Transform & Sesar Geser).
9. **Desain Lembah Retakan Afrika (East African Rift) & Moving Platforms**:
   - Menciptakan atmosfer sabana Afrika yang terbelah (*rifting*): celah jurang vertikal dalam berhawa magma jingga, partikel asap belerang vulkanik mengepul, platform tanah bergerak lambat mendatar kiri-kanan, serta penyesuaian tata medan agar ramah anak tanpa parkur ekstrem.
10. **Resolusi Circular Dependency & Blank Screen Bug**:
   - Mengatasi layar putih akibat siklus dependensi antara `Level1/sprites.ts` dan `Level2/sprites.ts`. Mengekstrak sprite avatar ke modul mandiri `src/utils/studentAvatarSheet.ts` dan mendefinisikan konstanta lokal `TILE = 32`.
11. **Rekonstruksi Superbenua Pangea & Diagram Sains Presisi**:
   - Menggambar ulang peta Pangea 250 juta tahun lalu dalam format 2D pixel art akurat: menghapus poligon belah ketupat di Amerika Utara, menyatukan lekukan tanduk Eurasia menjadi kurva mulus, merapatkan lekukan Brasil ke Teluk Guinea Afrika, membersihkan latar belakang elips hijau pada rute pegunungan kembar, dan meniadakan semburan magma pada diagram divergen.
12. **Standarisasi 100% SVG Pixel Icon (Zero-Emoji)**:
   - Menghapus seluruh emotikon sistem operasi modern pada HUD, modal temuan, teka-teki silang, dan telemetri; digantikan oleh komponen kustom SVG 2D pixel `PixelIcon` (termasuk ikon `heart`).
13. **Penyelarasan Top HUD Sesuai Standar Level 1**:
   - Mengadopsi bilah atas seragam: tombol kayu `< MENU` langsung kembali ke beranda (`/`), tombol audio SFX, tombol Layar Penuh (⛶), badge pill nama area `● BATAS DIVERGEN`, serta pill status kristal & HP bar. Menghilangkan radar map di pojok kanan atas.
14. **Proteksi Penguncian Level 3 & Auto-Save Terisolasi**:
   - Menetapkan bahwa Level 3 hanya dapat terbuka setelah seluruh 3 area Level 2 tuntas (`completedMissions.length >= 3`).
   - Menerapkan mekanisme penahan (*clamping*) pada store akun siswa agar Level 3 tetap terkunci di dashboard.
   - Menghapus modal kemenangan prematur pada penyelesaian Area 1 dan menggantinya dengan plakat naratif persiapan menuju Area 2.
   - Menyimpan progres sesi penjelajahan secara otomatis ke `localStorage` (`resqbox_level2_progress_${userId}`) untuk melindungi siswa dari hilangnya data saat halaman di-refresh.
15. **Perbaikan Fisika Jembatan Karang Andesit & Ambang Hazard Palung (Area 2)**:
   - Memperbaiki kerusakan pemain saat menyeberangi Jembatan Karang Andesit di Area 2 (Batas Konvergen) dengan menambahkan status perlindungan `isSafeOnBridge` pada `player.ts`. Pemain 100% kebal bahaya selama berada di atas platform jembatan, dan kerusakan hazard jurang hanya aktif jika pemain benar-benar jatuh ke kedalaman palung (`y >= 420`).
16. **Eliminasi Total Objek Melayang (Zero-Floating Sprite Snapping di Level 2)**:
   - Menyesuaikan offset tumpuan kaki tanah seluruh objek (`OBJECT_GROUND_OFFSETS_L2` di `zones.ts`): Stasiun Siaga (`10px`), tangga kembali (`2px`), portal keluar (`0px`), gerbang evaluasi (`2px`), papan catatan geologis (`32px`), dan titik temuan sains (`34px`), sehingga menempel kokoh dan rata pada kontur tanah lereng vulkanik.
17. **Overhaul Animasi Erupsi & Kerapian Visual Area 2**:
   - Mengganti animasi lava keluar-masuk berbentuk batang kaku di latar belakang gunung berapi dengan semburan lahar berdenyut organik, pendaran magma kawah kaldera, dan gumpalan partikel abu vulkanik.
   - Menyambungkan lengkungan abutmen batu basal di bawah dek jembatan dan mengisi penuh air samudra palung laut dalam dari tepi ke tepi tanpa celah kosong.
18. **Penghapusan Tombol Bantuan Siaga (Integritas Asesmen Formatif)**:
   - Menghapus tombol dan hint "BANTUAN SIAGA" pada modal evaluasi Teka-Teki Silang (`CrosswordModal.tsx`) dan Kuis Tantangan (`MiniChallengeModal.tsx`) agar siswa menguji pemahaman sains secara mandiri tanpa jalan pintas contekan.
19. **Penyelarasan Kurikulum & Keputusan Alokasi Materi (Opsi A)**:
   - Menetapkan kurikulum Area 2 berfokus penuh pada 2 Temuan Geologis: Temuan 1 (Dinamika Subduksi & Peleburan Batuan di Mantel >1.200°C) dan Temuan 2 (3 Bentang Alam Tumbukan).
   - Materi Sismograf dan Teori 20 Lempeng Bumi dialokasikan secara proporsional ke Area 3 (Batas Transform) agar materi terbagi seimbang antar-zona penjelajahan.
20. **Redesain Temuan 2: 3 Ilustrasi Mandiri Retro Pixel 2D Beresolusi Penuh**:
   - Memisahkan 3 bentang alam konvergen menjadi 3 kanvas retro pixel 2D mandiri yang berganti penuh saat tab ditekan:
     - **Palung Laut Dalam**: Mengacu pada referensi riset laut dalam nyata, menampilkan kapal riset permukaan dengan derek (*crane*), dinding jurang ngarai basalt curam, kapal selam riset kuning berlampu sorot ganda yang menerangi dasar jurang abisal, mistar kedalaman 0–11.000 m (Challenger Deep), komparasi siluet Gunung Everest terendam >2.000 m di bawah permukaan laut, serta siluet paus sperma dan anglerfish bercahaya.
     - **Pegunungan Lipatan**: Puncak salju megah, hutan pinus kaki bukit, penampang lipatan batuan sedimen/sandstone/granit, panah kompresi lempeng horizontal (`➡ TEKANAN ⬅`), serta label lipatan Antiklin & Sinklin.
     - **Busur Gunung Berapi**: Kerucut stratovolcano Merapi aktif, kaldera magma, aliran lahar lereng, awan panas wedhus gembel, penampang slab menunjam meleleh di mantel bumi, serta dapur magma (*magma chamber*) raksasa.
21. **Perbaikan Tab Switcher Anti-Clipping & Desain Ramah SMP Kelas 8**:
   - Memperbaiki pemotongan garis tepi atas tombol tab switcher modal temuan dengan memberikan padding atas `pt-2.5 px-3 pb-2` dan mengeliminasi efek translasi negatif `-translate-y`.
   - Mengubah uraian bentang alam menjadi format 3 kotak poin mini berikon (proses pembentukan, karakteristik/kedalaman, dan fakta geologi di Indonesia) serta memadatkan seluruh teks catatan papan geologis menjadi maksimal 2 kalimat padat tanpa dinding teks berlebihan.
22. **Perancangan Arsitektur Area 3: Batas Transform, Sesar San Andreas & Sismograf**:
   - Merancang Area 3 (Batas Transform) sebagai penutup Level 2: bentang alam ngarai sesar gurun keemasan (*canyon strike-slip fault*), 2 temuan sains (Sismograf & Bukti 20 Lempeng Tektonik Dunia, serta Sesar San Andreas & Patahan Semangko), evaluasi akhir TTS (`TRANSFORM`, `SANANDREAS`, `SISMOGRAF`, `LEMPENG`), dan pembukaan gelar ketuntasan Level 2 (Skor 100) serta sinkronisasi ke Posko Guru.
23. **Penyempurnaan Visual, Fisika & Diagram Sains Area 3**:
   - **Latar Belakang Ngarai Senja Gurun**: Membersihkan garis-garis lava oranye melayang dan garis-garis kawat horizontal; menggantikannya dengan gradasi langit senja gurun yang hangat, matahari senja ber-halo lembut, siluet mesa dan gawir sesar bertingkat berparalaks, serta kabut dasar ngarai dan partikel debu seismik emas.
   - **Fisika Jembatan Anti-Tunneling**: Mengimplementasikan pelacakan lintasan vertikal (`prevY`) di `player.ts` agar pemain yang melompat jauh/tinggi dari puncak bukit terjal (`BUKIT SESAR TEKAN`) mendarat stabil di atas dek jembatan tanpa tembus ke jurang magma di bawahnya.
   - **Temuan Geologis 1 (Sismograf 3D Mekanik)**: Merender instrumen sismograf 3D mekanik presisi sesuai Gambar Referensi 3 dengan pelat dasar baja ber-bevel dan 4 baut, tiang kantilever C-frame, bandul silinder inersia, pena pencatat getaran, dan drum silinder seismogram (bebas dari tombol uji getar dan teks diagram internal).
   - **Temuan Geologis 2 (Blok 3D Isometrik Transform)**: Merender blok 3D isometrik transform sesuai Gambar Referensi 5 dengan dua lempeng kerak (3 lapisan geologis: tan, cokelat, terracotta) yang meluncur halus saling berlawanan arah pada bidang sesar vertikal, di mana panah merah di permukaan bergerak sinkron dengan tanahnya (tanpa elemen sungai dan pagar).
24. **Papan Catatan Geologis Balon Kata Proksimitas & Standarisasi Area 2**:
   - Mengubah dialog fullscreen papan catatan geologis (`info_sign`) menjadi balon kata melayang (*speech bubble*) tepat di atas tiang saat karakter mendekat (`dist < 50px`), dan menghilang otomatis saat menjauh.
   - Menghapus objek totem temuan ke-3 di Zona 2 agar Area 2 memiliki tepat 2 temuan sains teruji dan terbebas dari error crash.
25. **Penyelarasan Terminologi Level 1 & Proteksi Gerbang**:
   - Mengganti istilah "Sumur Bor" menjadi "Turun Menuju Lapisan Selanjutnya" dan "Elevator" menjadi "Naik Menuju Lapisan Sebelumnya".
   - Memasang proteksi modal peringatan *"AKSES TURUN DITOLAK! Tantangan Gerbang Belum Selesai"* jika pemain mencoba turun sebelum menyelesaikan evaluasi Wordle lapisan aktif.
26. **Fisika Platform Anti-Tunneling (CCD) & Rekonstruksi Jembatan Basal**:
   - Menghilangkan bug karakter menembus platform gantung saat jatuh berkecepatan tinggi (`vy >= 6`) melalui *Continuous Collision Detection* lintasan vertikal (`prevY`) dan toleransi tapak kaki lebar (`footMargin = 10`).
   - Menaikkan elevasi jembatan basal di Level 1 agar menapak kokoh di atas lava.
27. **Sistem Kristal Kumulatif Level 2 (Total 9 Kristal) & Counter Temuan Header**:
   - Menyeragamkan distribusi kristal Level 2: 3 kristal di setiap area (Area 1, 2, dan 3) dengan total kumulatif 9 kristal (`X/9`).
   - Memperbaiki sinkronisasi ID temuan geologis antara engine dan data katalog sehingga counter temuan pada header bertambah dinamis secara real-time.
28. **Integrasi Skoring Posko Guru & Modal Kemenangan Akhir Level 2 (`TectonicVictoryModal.tsx`)**:
   - Menghubungkan skoring Level 2 ke Teacher Dashboard & Supabase secara bertahap: Area 1 (35 Poin), Area 2 (70 Poin), Area 3 (100 Poin tuntas & membuka Level 3). Menghapus label statis 'Sedang disusun'.
   - Merancang modal kemenangan ekspedisi megah serasi dengan Level 1: piala pixel emas berkilau `<PixelTrophy>`, status pill hijau `EKSPEDISI TUNTAS!`, 3 lencana ekspedisi tektonik, kristal terkumpul `X/9`, kartu narasi jembatan kausalitas menuju mitigasi bencana Level 3, serta tombol navigasi langsung ke Level 3 atau Menu Utama.
29. **Animasi Jet Booster Biru Lompatan Ganda di Level 2**:
   - Menyelaraskan efek visual saat karakter melakukan lompatan ganda (*double jump*) di Level 2 persis menyerupai Level 1: semburan api jet roket pendorong biru cyan (`#00e5ff`) dengan inti putih berenergi tinggi (`#ffffff`), partikel percikan plasma biru berjatuhan (`#38bdf8`), dan pendaran cahaya pijakan halus di bawah telapak kaki.
30. **Transformasi RPG Visual Novel Level 1 (Sistem Dialog NPC & Maskot Resqy)**:
   - Mengubah mekanisme eksplorasi Level 1 (Earth Dive) dari papan catatan kayu statis menjadi petualangan RPG bernarasi yang hidup.
   - Papan catatan kayu dan totem temuan digantikan oleh karakter-karakter NPC peneliti:
     - Area 1: Prof. Raditya (Peneliti Batuan Bumi) & Kapten Maya (Pemandu Penyelaman Bumi).
     - Area 2: Dr. Gea (Peneliti Kerak Bumi), Prof. Andini (Guru Geologi), Inspektur Budi (Pengawas Batas Kerak), dan Komandan Hendra (Penjaga Pintu Mantel Bumi).
   - Mengembangkan modul dialog Visual Novel (`VisualNovelDialogue.tsx`) dengan potret karakter 100% transparan tanpa kotak latar belakang, efek ketik typewriter beranimasi, micro-bounce saat karakter berbicara, serta kotak dialog warna perkamen retro hangat ramah mata (bebas warna gonjreng).
   - Menambahkan robot pemandu penjelajah 2D pixel art "Resqy" (`MascotGuide.tsx`) di HUD kiri atas dengan radar berdenyut dan tips panduan kontekstual tanpa emoji sistem operasi.
31. **Standar Bahasa Ramah Anak SMP Kelas 8 & Eliminasi Total Istilah Asing (Zero Foreign Jargon)**:
   - Menyederhanakan seluruh bahasa dialog, alur cerita, dan materi temuan geologis agar ramah untuk rentang usia anak SMP kelas 8: kalimat pendek (1-2 kalimat per balon percakapan), tidak berbelit-belit, dan mudah dipahami.
   - Menghilangkan seluruh istilah asing yang membingungkan (*exosuit, jet booster, singkapan litosfer, subduksi, basaltik, densitas, rig pemboran, astenosfer, SiAl, anisotropy, dll.*).
   - Menerjemahkan konsep ilmiah ke bahasa sederhana: kerak bumi adalah kulit luar bumi yang paling tipis; kerak benua adalah daratan; kerak samudra adalah dasar laut yang padat dan berat; batas Moho adalah batas pemisah kerak dan mantel; lempeng bumi adalah pecahan kulit bumi yang bergerak perlahan.
   - Menyederhanakan kuis tebak kata Wordle gerbang (`KERAK`, `BENUA`, `SAMUDRA` di Area 2; `MANTEL`, `PANAS`, `KONVEKSI` di Area 3; `LOGAM`, `CAIR`, `MAGNET` di Area 4; serta `LEMPENG`, `KONVEKSI`, `MAGNET`, `TEKANAN`, `GEMPA` di Puncak Sintesis).
   - **Prinsip Soal Ramah & Autentik Materi**: Seluruh soal evaluasi gerbang di akhir tiap area wajib dibuat **mudah dipahami anak SMP kelas 8 dan MUTLAK diambil 100% dari materi yang telah dijelaskan oleh para NPC** di area tersebut. Dilarang keras membuat soal dari materi yang belum pernah diajarkan di area aktif.
32. **Penghapusan Objek Fisik Gerbang di Area 2 & Otorisasi NPC Penjaga Pintu**:
   - Menghilangkan balok gerbang fisik `challenge_gate` di Area 2 (Kerak Bumi) pada `zones.ts`, menyerahkan otorisasi pembukaan portal penurunan sepenuhnya kepada NPC Komandan Hendra.
33. **Resolusi Bug Kunci Gerbang & Alur Masuk Portal Murni**:
   - Memperbaiki bug di mana penyelesaian kuis via dialog NPC awalnya tidak mendaftarkan `crust_challenge` ke `unlockedGates` (karena `game.pendingChallenge` bernilai `null`).
   - Menyempurnakan alur navigasi portal:
     - Jika siswa **sudah menyelesaikan soal**: cukup berdiri di portal dan menekan tombol **ENTER** (atau `[E]` / Panah Bawah) untuk langsung menyelam ke area selanjutnya tanpa pop-up peringatan sama sekali.
     - Jika siswa **belum menyelesaikan soal**: barulah muncul pop-up peringatan *"AKSES TURUN TERKUNCI! Kamu harus menyelesaikan tantangan dari peneliti di area ini terlebih dahulu"*.
   - Menghapus tombol manual *"Buka Akses Turun"* dari pop-up modal sesuai instruksi pengguna.
34. **Pedoman Baku & Aturan Immutability Desain untuk Area Selanjutnya (Area 3, 4, 5)**:
   - Menetapkan aturan baku pengembangan area selanjutnya di Level 1:
     - **Yang diubah HANYA 3 hal**: (1) Papan catatan geologis ➔ NPC pemandu, (2) Temuan geologis ➔ NPC peneliti materi, (3) Tantangan gerbang fisik ➔ NPC penjaga pintu.
     - **DILARANG MENGUBAH DESAIN**: Tampilan antarmuka yang sudah baku (kotak chat Visual Novel, warna tombol, font pixel, layout, widget Resqy) bersifat permanen dan tidak boleh dirombak.
      - **Bahasa & Materi**: Wajib ringkas (1-2 kalimat), ramah anak SMP kelas 8, dan 100% bebas dari istilah asing.
      - **Soal Evaluasi Gerbang**: Wajib mudah dipahami siswa SMP kelas 8 dan **harus diambil langsung dari materi yang sudah dijelaskan oleh NPC di area tersebut** (tidak boleh menguji materi di luar penjelasan).
35. **Transformasi RPG Visual Novel & Standarisasi Area 3 (Mantel Bumi)**:
   - Mengubah seluruh papan catatan kayu (`mantle_sign1`, `mantle_sign2`), temuan geologis (`mantle_disc1`, `mantle_disc2`), dan objek gerbang fisik (`mantle_challenge`) di Zona 2 (Mantel Bumi) menjadi 5 karakter NPC hidup:
     - **Dr. Bayu** (*Ahli Geologi Mantel*): Pemandu lapangan teras silikat yang menjelaskan bahwa mantel adalah lapisan paling tebal (2.900 km) dan batuannya mengalir kental karena panas.
     - **Prof. Sarah** (*Peneliti Arus Panas Mantel*): Menjelaskan arus perputaran panas (konveksi) yang bekerja seperti air mendidih dan menggerakkan lempeng bumi, serta membuka modul Temuan Geologis 4.
     - **Dr. Danang** (*Ahli Batuan Mantel*): Menjelaskan mengapa batuan mantel tetap padat berkat tekanan dahsyat dari seluruh massa bumi di atasnya, serta membuka modul Temuan Geologis 5.
     - **Petugas Rudi** (*Pengawas Suhu Mantel Bawah*): Memperingatkan peningkatan suhu mendekati dasar mantel dan mengarahkan pemain ke pos penjagaan gerbang.
     - **Komandan Surya** (*Penjaga Pintu Inti Luar*): Menggantikan gerbang fisik `challenge_gate`, menguji pemahaman materi mantel bumi siswa dengan tebak kata Wordle (`MANTEL`, `PANAS`, `KONVEKSI`), dan membuka otorisasi portal penurunan menuju Inti Luar bumi.
   - Memasang briefing awal interaktif Maskot Resqy (`mascot_mantle_intro` & `mascot_mantle_guide`) dengan tips kontekstual tanpa emoji sistem operasi.
   - Mempertahankan integritas desain antarmuka 100% baku (kotak dialog Visual Novel, potret transparan, tombol retro kayu, font pixel) serta bahasa sederhana ramah anak SMP kelas 8 tanpa istilah asing.
36. **Koreksi Posisi & Urutan Narasi Karakter Mantel Bumi (Dr. Bayu & Prof. Sarah)**:
    - Menyelaraskan posisi awal teras silikat Mantel Bumi (Zona 2) agar urutan narasi dan visualisasi logis dan konsisten:
      - **Dr. Bayu** ditempatkan lebih awal di `px: 260` sebagai NPC penyambut kedatangan yang memperkenalkan lapisan mantel bumi dan memberi arahan kepada penjelajah untuk menemui peneliti di bukit depan.
      - **Prof. Sarah** ditempatkan di teras depannya pada `px: 330` untuk membedah materi Temuan Geologis 4 mengenai arus panas konveksi.
    - Menjamin alur percakapan terhubung rapi dari ucapan selamat datang Dr. Bayu menuju penjelasan sains mendalam Prof. Sarah dan Dr. Danang.
37. **Transformasi RPG Visual Novel & Standarisasi Area 4 (Inti Luar)**:
    - Mengubah seluruh papan catatan kayu (`oc_sign1`, `oc_sign2`), temuan geologis (`oc_disc1`, `oc_disc2`), dan objek gerbang fisik (`oc_challenge`) di Zona 3 (Inti Luar) menjadi 5 karakter NPC hidup:
      - **Dr. Fajar** (*Pemandu Lapangan Inti Luar*): Berada di teras awal (px: 270), menyambut kedatangan pemain dan mengenalkan lautan logam besi-nikel cair meleleh pada suhu 9.000°F.
      - **Prof. Ratna** (*Peneliti Logam Cair Inti Luar*): Berada di teras depan (px: 330), membedah materi Temuan Geologis 6 mengenai sifat lautan logam cair.
      - **Dr. Aris** (*Ahli Medan Magnet Bumi*): Berada di teras tengah (px: 730), membedah materi Temuan Geologis 7 mengenai dinamo bumi dan perisai medan magnet pelindung bumi dari badai matahari.
      - **Petugas Joko** (*Pengawas Radiasi Magnetik*): Berada di pos pemantau (px: 1020), mengarahkan pemain ke pos penjagaan gerbang.
      - **Komandan Teguh** (*Penjaga Pintu Inti Dalam*): Menggantikan gerbang fisik `oc_challenge` di px: 1120, menguji pemahaman inti luar siswa dengan Wordle (`NIKEL`, `CAIRAN`, `MAGNET`), dan membuka otorisasi portal menuju Inti Dalam.
    - Mengintegrasikan briefing otomatis Resqy (`mascot_outer_core_intro`) dan tips panduan (`mascot_outer_core_guide`).
38. **Penyempurnaan Dialog Komandan Teguh (Anti Bocor Kunci Jawaban & 2 Opsi Percabangan)**:
    - Memperbarui pohon dialog Komandan Teguh di Inti Luar agar tidak memberikan atau membocorkan kata target/kunci jawaban (`NIKEL`, `CAIRAN`, `MAGNET`).
    - Menyajikan 2 pilihan percabangan bagi siswa saat ditanya kesiapan:
      - Opsi 1 (*"Sudah paham Komandan, saya siap tantangannya!"*): Langsung memicu kuis tebak kata Wordle gerbang.
      - Opsi 2 (*"Saya mau melihat-lihat materi dulu, Komandan."*): Komandan menyambut hangat dan mengarahkan siswa untuk kembali mempelajari modul dari Prof. Ratna dan Dr. Aris di teras sebelumnya tanpa paksaan.
39. **Transformasi RPG Visual Novel & Standarisasi Area 5 (Inti Dalam)**:
    - Mengubah seluruh papan catatan kayu (`ic_sign1`, `ic_sign2`), temuan geologis (`ic_disc1`, `ic_disc2`), dan gerbang fisik (`ic_challenge`) di Zona 4 (Inti Dalam) menjadi 5 karakter NPC hidup:
      - **Dr. Bagus** (*Pemandu Geofisika Inti Dalam*): Menyapa penjelajah di teras awal monolit (px: 270) dan mengarahkan pemain ke Prof. Lestari.
      - **Prof. Lestari** (*Peneliti Kristal Besi Inti Dalam*): Menjelaskan bola besi padat 10.000°F tahan leleh akibat tekanan dahsyat di teras monolit (px: 340, Temuan 8).
      - **Dr. Farhan** (*Ahli Gravitasi Pusat Bumi*): Menjelaskan titik pusat bumi 6.371 km dengan gravitasi bernilai nol di Altar Mahkota (px: 680, Temuan 9).
      - **Petugas Dian** (*Pengawas Kapsul Evakuasi Inti*): Mengingatkan kesiapan kapsul akhir evakuasi di pos pengawas (px: 900).
      - **Komandan Bintang** (*Kepala Ekspedisi Pusat Bumi*): Mengawal kapsul akhir evakuasi di px: 1040, menguji siswa dengan Wordle (`BOLABESIPADAT`, `SEPULUHRIBU`, `PUSAT`) tanpa membocorkan kunci jawaban, dilengkapi 2 opsi percabangan (siap tantangan vs melihat-lihat materi terlebih dahulu).
    - Menyederhanakan materi temuan 8 & 9 serta menyelaraskan briefing & tips panduan Maskot Resqy (`mascot_inner_core_intro` & `mascot_inner_core_guide`).
    - Membuka kapsul akhir evakuasi (`ic_portal_exit`, px: 1180) untuk menyelesaikan Level 1 dan melanjutkan ke Level 2.
40. **Penyelarasan Soal Evaluasi Wordle Area 4 & Area 5**:
    - Memperbarui daftar kata tebak kata Wordle gerbang pada `EarthDiveGame.tsx`:
      - Area 4 (Inti Luar): `NIKEL` (*Bahan penyusun utama bersama besi*), `CAIRAN` (*Wujud inti luar*), `MAGNET` (*Medan pelindung bumi dari radiasi matahari*).
      - Area 5 (Inti Dalam): `BOLABESIPADAT` (*Bentuk inti dalam bumi*), `SEPULUHRIBU` (*Suhu inti dalam mencapai ... derajat fahrenheit*), `PUSAT` (*Titik terdalam bumi pada kedalaman 6.371 km*).
    - Menyesuaikan penataan ubin huruf adaptif pada `Wordle/index.tsx` agar muat dengan proporsional pada kata hingga 13 huruf tanpa terpotong.
41. **Penyelarasan Peta & Materi Batas Divergen (Area 6) Langsung dari Level 2**:
    - Memindahkan dan mengintegrasikan ekosistem Batas Divergen dari Level 2 ke Level 1 sebagai Area ke-6:
      - **Kontur Peta 2.200 px**: Mengadopsi kontur medan luas (69 kolom) dengan 3 jembatan kerak dingin (*cooled crust bridge*), 3 jurang magma aktif bergejolak, tebing ngarai retakan vertikal, dan panorama puncak gunung celah vulkanik berparalaks.
      - **3 Modul Temuan Sains Interaktif**: Peta interaktif Pangea 7 keping lempeng benua yang dapat diklik, peta rekonstruksi sabuk pegunungan kembar Appalachian-Caledonian, dan simulator animasi pemekaran lempeng divergen.
      - **Ekosistem 5 NPC Visual Novel**: Dr. Taufik (pemandu), Prof. Maya (peneliti Pangea), Dr. Citra (peneliti pegunungan kembar), Prof. Ilham (ahli pemekaran samudra), dan Komandan Satria (penjaga gerbang Wordle).
      - **Koreksi Teks Portal Inti Dalam**: Mengubah teks portal di Inti Dalam dari *"★ KAPSUL AKHIR ★"* menjadi *"▼ BATAS DIVERGEN ▼"* serta mengarahkan alur transit pemain meluncur ke Area 6.
42. **Penyempurnaan Modal Temuan Sains & Overhaul Magma Mengisi Penuh Celah Jurang**:
    - **Modal Temuan Layar Penuh**: Memperbesar kontainer gambar materi temuan di `DiscoveryModal.tsx` menjadi `h-72 sm:h-80` (288–320 px) dan melepas pembatas `max-h-[300px]` pada SVG sehingga modul Pangea, Pegunungan Kembar, dan Simulator Pemekaran tampil penuh, jernih, dan tidak terpotong.
    - **Lava Mengisi Penuh Celah Jurang**: Memperluas deteksi jurang di `sprites.ts` ke seluruh 6 celah retakan, menyelaraskan elevasi permukaan lava `magmaTopY = 375` agar mengisi penuh jurang hingga ke dasar terdalam (y = 455) dengan gradien 6 tahap panas pijar (`#ffffff` ➔ `#fef08a` ➔ `#fb923c` ➔ `#f97316` ➔ `#dc2626` ➔ `#450a0a`), pulau kerak basal mengapung, pendaran glow permukaan tebing, 6 titik kepulan uap fumarol, dan letupan gelembung magma mendidih.
43. **Arsitektur Lebar Peta Dinamis (Dynamic Zone Width) & Kamera Bergulir Penuh 2.200 px**:
    - Mengatasi masalah hilangnya Komandan Satria, Gerbang Tantangan Wordle, dan Portal Turun di Area 6.
    - Mengganti seluruh pembatas peta statis `MAP_WIDTH_PX = 1280` menjadi dinamis per zona `zone.cols * TILE` (2.208 px untuk Area 6) pada kamera `gameEngine.ts` (`initGame`, `handleTransitionStep`, `renderGame`), batas gerak karakter `initialX`, rendering medan penuh `renderOrganicZoneTerrain` di `sprites.ts`, dan elevasi tanah `getGroundY`/`getCeilingY` di `zones.ts`.
    - Kamera kini bergulir mulus (smooth parallax scrolling) melintasi seluruh 2.200 px mengikuti pemain hingga ke Altar Akhir di mana Komandan Satria (`px: 2060`), Gerbang Wordle (`px: 2110`), dan Portal Turun (`px: 2160`) menyambut pemain secara utuh.
44. **Overhaul Total Ekosistem Batas Konvergen (Area 7: Palung Subduksi & Vulkanisme)**:
    - **Penapakan Kaki NPC di Permukaan Tanah (Zero Floating)**: Memperbaiki offset `OBJECT_HEIGHTS.npc = 0` dan mendaftarkan 4 NPC Area 7 (`npc_farhan`, `npc_ratna`, `npc_bayu`, `npc_arya`) ke `createInitialNpcs` (`zoneIndex === 6`) sehingga posisi berdiri NPC selalu terkunci presisi di elevasi tanah aktual `getGroundY`.
    - **Palung Menunjam di Tengah Laut Tanpa Jembatan & Lava**: Menempatkan palung samudra di tengah bentang perairan laut (`x: 240..460`) di mana lempeng samudra menunjam miring (*subducting slab*) ke mantel bumi (`y: 405 -> 495+`). Menghapus jembatan dan magma/lava, menggantikannya dengan batuan mantel padat bersahaja (`#362208`). Pemain mengarungi samudra dengan Perahu Riset Oseanografi pixel 2D.
    - **Pengisian Air Laut Penuh**: Air laut biru membentang luas dari `x = 0` hingga bibir dermaga benua `x = 518`, memenuhi seluruh kedalaman palung (`y: 360 -> 460`) dengan riak ombak alami dan berkas cahaya matahari (*caustics*).
    - **Penghalusan Teras Altar Akhir (Smooth Cosine S-Curve)**: Menghilangkan patahan tebing tajam 12 px di `x = 1340`, menggantikannya dengan transisi kurva Cosine S-Curve kontinu sepanjang `x: 1220..1340` sehingga lereng kaki gunung melandai mulus menuju lantai Altar Batas Transform.
    - **Pemulihan Latar Langit Tropis & Pegunungan Vulkanik Megah**: Mengisi `case 'convergent':` di `drawZoneBackground` dengan langit biru tropis cerah, matahari bersinar hangat dengan rotasi berkas korona di kiri atas, awan pixel berarak, siluet barisan gunung berapi andesit dengan kepulan uap kawah solfatara, dan kabut horizon pesisir.
45. **Penyempurnaan HUD Telemetri, Eliminasi Celah Palung & Pembaruan Kerak Samudra (Area 7)**:
    - **Penghapusan Tombol Simulasi dari HUD**: Menghapus tombol `↻ SIMULASI PALUNG & GUNUNG` dan `↻ SIMULASI PEMEKARAN` dari bilah status HUD di `EarthDiveGame.tsx` agar tampilan permainan bersih, terfokus, dan bebas dari tombol berulang yang tidak diperlukan.
    - **Header Telemetry HUD Terkunci Presisi di Tengah Layar**: Mengisolasi kontainer `TelemetryHUD` ke dalam wrapper mandiri `fixed top-2.5 sm:top-3 left-1/2 -translate-x-1/2 z-20` sehingga seluruh indikator kedalaman, suhu, tekanan, kristal, dan bar HP terkunci secara matematis tepat di tengah layar pada semua resolusi peramban tanpa tergeser oleh widget navigasi kiri atau radar kanan.
    - **Formula Dasar Laut Terpadu (`getConvergentSeafloorProfile`) & Eliminasi Celah/Gap**:
      - Mengatasi celah langit/kabut tembus pandang di antara air laut dan lereng benua dengan formula profil dasar laut terpadu yang dipakai bersama oleh kerak samudra, prisma akresi lereng benua, dan cekungan air laut.
      - Mengisi fondasi mantel astenosfer peridotit solid dari `y = 356` ke bawah kanvas (`h`) di seluruh bentang peta, menjamin 100% tidak ada celah latar belakang yang dapat terlihat.
    - **Peningkatan Visual & Strata Geologis Kerak Samudra (*Ophiolite Sequence*)**:
      - Mengembangkan visualisasi kerak samudra (*oceanic crust*) berlapis otentik:
        1. *Pelagic Marine Sediment*: Silt laut dalam kelabu (`#475569`, `#64748b`) dengan garis laminasi halus.
        2. *Pillow Basalt*: Kubah membulat basal bantal vulkanik berulang (`#1e293b`, `#334155`) lengkap dengan kontur kaca pendinginan vulkanik (`#0f172a`), inklusi kristal feldspar (`#cbd5e1`), dan urat zeolit hidrotermal biru laut (`#38bdf8`).
        3. *Sheeted Dykes*: Intrusi lembar diabase basaltik vertikal (`#141d2c`).
        4. *Layered Gabbro*: Batuan ultra-mafik pekat (`#090d16`) yang diperkaya butiran kristal mineral olivin & piroksen hijau zamrud (`#0d9488`, `#10b981`).
        5. *Tectonic Bend Flexure*: Retakan regangan normal di punggung palung luar saat lempeng menekuk menunjam ke mantel.
    - **Pembersihan Artefak Kotak Putih pada Animasi Palung**: Menghapus blok animasi persegi air mengalir deras (`rushWave`) dan partikel kotak gelembung dari kanvas air palung di `sprites.ts` sesuai permintaan pengguna, mempertahankan tampilan air samudra jernih yang tenang dan alami.
46. **Pembaruan Menyeluruh Responsivitas Web, Tablet Viewport, & Pengisian Medan Penuh Anti-Cutoff**:
    - **Skala Adaptif Viewport Tablet (`getGameScale`)**: Memperbarui kalkulasi skala layar pada `renderer.ts` dengan rasio proporsional dinamis `Math.max(0.7, Math.round((canvasH / 480) * 100) / 100)` sehingga proporsi dunia game selalu presisi mengisi kanvas perangkat tanpa terdistorsi.
    - **Pencegahan Map Mengambang / Terpotong saat Zoom-Out**: Mengunci pergeseran kamera (`camera.x = 0`, `camera.y = 0` saat `map <= view`) dan memperdalam batas bawah kanvas rendering medan (`h = Math.max(zone.rows * TILE, 1600)`) serta memperluas bentang horizontal rendering dari `-800` hingga `w + 800` di seluruh strata dan Level 2.
    - **Arsitektur Layout HUD Atas Adaptif Bebas Tabrakan**: Pada resolusi tablet atau saat zoom-in (< 1280 px), bilah HUD Telemetri diposisikan di baris ke-2 dengan chip angka berformat `shrink-0 whitespace-nowrap`, tombol Menu dan Strata Pill berdampingan ringkas di baris 1 kiri, dan Radar Bumi responsif di kanan atas dengan kontrol collapse `▲`/`▼`.
47. **Persistensi Posisi Karakter di Semua Lapisan Saat Refresh & Pemutaran Ulang Animasi Dinamis Tektonik**:
    - **Penyimpanan Posisi Karakter Per-Zona**: Memperbarui skema penyimpanan `SavedEarthDiveProgress` di `gameEngine.ts` dengan kamus histori posisi per-zona (`zonePositions: Record<number, { x: number; y: number; dir: 'left' | 'right' }>`) pada `localStorage` (dual-key per user dan fallback default).
    - **Zero Reset on Reload di Seluruh Area**: Menghapus pemaksaan reset posisi hardcoded ke kapal atau titik awal area (`x = 110`) saat reload peramban di Batas Konvergen maupun area lainnya. Karakter tetap melanjutkan petualangan persis dari posisi horizontal dan arah hadap terakhir.
    - **Peningkatan Frekuensi Auto-Save & Web Lifecycle Listeners**: Auto-save dipercepat menjadi setiap 45 frame (~750 ms) serta instan saat karakter berhenti melangkah, didukung listener `pagehide` dan `visibilitychange` di `EarthDiveGame.tsx`.
    - **Pemutaran Ulang Animasi Dinamis Tektonik**: Saat halaman di-refresh, animasi tektonik (Batas Divergen / Area 6 dan Batas Konvergen / Area 7) selalu diputar ulang dari awal (`progress = 0`) agar murid tetap dapat menyaksikan keagungan fenomena pembentukan pegunungan dan rekahan kerak, sementara karakter terangkat naik secara dinamis dan mulus (`player.y = getEffectiveGround`) mengikuti pertumbuhan pegunungan langsung di bawah kakinya.
    - **Auto-Snapping Objek Tanah Dinamis**: Memanggil `snapObjectsToGround` secara reaktif saat animasi tektonik berlangsung agar seluruh objek (kristal, papan catatan, NPC, dan gerbang) ikut terangkat bersama kontur tanah.
48. **Implementasi Penuh Area 8 (Batas Transform — Patahan San Andreas & POV Top-Down 2D)**:
    - **Perspektif 2D Pandangan Atas (*Top-Down View*)**: Mengadopsi perspektif sudut pandang atas di padang gurun California untuk memvisualisasikan fenomena pergeseran mendatar (*strike-slip fault*) Lempeng Pasifik (bergerak barat laut) dan Lempeng Amerika Utara (bergerak tenggara).
    - **Fitur Geologis Otentik**: Menampilkan jalan raya terpotong geser dan pembelokan sungai Wallace Creek sejauh 130m dengan tekstur poligon mulus kontinu solid (*zero scanline gaps*) tanpa kerucut/penghalang darurat merah.
    - **Rekahan Gempa Realistis (*Branching Rupture Fissures*)**: Menggantikan garis miring monoton dengan 25 benih rekahan geologis bercabang alami dengan gradasi rekahan tanah hitam pekat dan sorotan bebatuan retak (*lithic highlights*).
49. **Penyempurnaan Fisika Lompat Celah Sesar, D-Pad 4 Arah Tablet, Pemisahan Tombol Atas vs Lompat, Penataan NPC Padat & Evaluasi Tuntas**:
    - **Fisika Melompati Celah Sesar Top-Down 3D**: Bibir celah patahan mendatar ($Y = 228..252$) memblokir jalan kaki di tanah. Pemain melompat menggunakan fisika parabola top-down 3D (`jumpZ`, gravitasi vertikal `jumpZVelocity`, bayangan dinamis mengecil) dengan tombol Spasi atau tombol sentuh `LONCAT`.
    - **Pemisahan Input Atas dan Lompat**: Tombol `ArrowUp` / `KeyW` dan D-pad Up sentuh secara murni menggerakkan karakter ke atas / Utara (`dy = -SPEED`) tanpa memicu lompatan. Melompat murni dieksekusi via `Space` atau tombol sentuh `LONCAT`.
    - **Penataan NPC & Kapsul Evakuasi di Daratan Padat**: Menyelaraskan koordinat Komandan Guntur (`npc_guntur_trans`) ke daratan padat lempeng selatan pada $X = 1360, Y = 315$, berdampingan dengan Kapsul Evakuasi Akhir ($X = 1470, Y = 315$) dan Kristal Geologi 2 ($X = 720, Y = 310$), bebas dari posisi di dalam jurang sesar.
    - **Penyelarasan Kunci Temuan Sains & Pembukaan Tantangan Evaluasi Akhir**: Mendaftarkan seluruh variasi alias kunci temuan sains (`trans_seismo`, `trans_disc1`, `disc_15` & `trans_sanandreas`, `trans_disc2`, `disc_16`) sehingga membaca materi langsung membuka tantangan Wordle akhir (`TRANSFORM`, `SANANDREAS`, `SISMOGRAF`) bersama Komandan Guntur untuk menyelesaikan Level 1 (skor 100 poin penuh).
    - **Analog D-Pad Sentuh 4 Arah & Tombol Aksi Mandiri**: D-Pad berlian 4 arah (Atas, Bawah, Kiri, Kanan) di kiri dan tombol aksi mandiri `LONCAT` & `AKSI [E]` di kanan dengan kontras retro jelas.
50. **Pencegahan Tampilan Buram pada Zoom Layar (High-DPI / DevicePixelRatio Scaling) & Optimasi HUD Tablet**:
    - **High-DPI / DevicePixelRatio Rendering**: Skalasi buffer internal kanvas otomatis memperhitungkan `window.devicePixelRatio` di `resizeCanvas` (`EarthDiveGame.tsx` & `TectonicGame.tsx`) dan aturan tipografi anti-aliasing tajam di `index.css`, menjamin ketajaman 100% pada zoom-in hingga 250% maupun pada layar Retina tablet iPad murid.
    - **Optimasi Layout Tablet**: Penataan kontainer navigasi kiri atas bertingkat vertikal (`flex-col xl:flex-row`) pada layar medium/tablet dan teks suhu ringkas (`350°C`) di `TelemetryHUD.tsx` menjamin zero overlap dengan tombol menu atau telemetri di tengah.
51. **Isolasi Penuh Progres Multi-Akun (Strict User Scoping)**:
    - **Akar Masalah Kebocoran Area 8 ke Akun Lain**: Mengatasi bug di mana akun siswa lain/baru langsung masuk ke Area 8 akibat pembacaan kunci cadangan global (`resqbox_earthdive_progress`) dan persistensi referensi state game in-memory saat beralih akun.
    - **Pemberlakuan Strict User Scoping**: Menghapus total mirroring ke kunci bersama dan menghapus fallback di `loadEarthDiveProgress`. Kunci penyimpanan selalu spesifik per user (`resqbox_earthdive_progress_${userId}`).
    - **Re-inisialisasi State Game Otomatis**: Memastikan objek `gameRef.current` di `EarthDiveGame.tsx` selalu di-create ulang jika `gameRef.current.userId !== activeUserId` sehingga akun baru selalu memulai dari Zona 0 (0 km).
    - **Penjaga Lifecycle Auto-Save**: Menjaga fungsi auto-save agar hanya menyimpan data jika `gameRef.current.userId === activeUserId`.
    - **Sanitasi Kunci Legacy pada Login & Logout**: Menghapus kunci residu `resqbox_earthdive_progress` di `teacherStore.ts` saat akun login maupun logout.
52. **Penyelarasan Header Telemetri Diciutkan (Collapsible Pill) di Semua Layar**:
    - **Header Kapsul Seragam 100%**: Mengubah bilah header indikator telemetri menjadi tombol kapsul retro `[ 📢 TELEMETRI  ▼ ]` persis seperti tangkapan layar pengguna pada seluruh perangkat (ponsel, tablet, laptop, dan desktop) serta pada Level 1 dan Level 2.
    - **Status Awal Diciutkan (*Default Collapsed*)**: Bilah telemetri tertutup secara default saat memasuki game (`isExpanded = false`), membebaskan pandangan visual latar belakang geologis agar lapang dan imersif.
    - **Interaksi Dropdown Responsif**: Mengklik kapsul membuka panel indikator lengkap (Kedalaman, Tekanan, Suhu, Kristal, Temuan, dan HP) di bawah garis pembatas retro (`border-b border-amber-800/40`), dan mengklik kembali melipatnya secara mulus.
53. **Visual Geologi Murni Interior Bumi & Eliminasi Obstruksi Latar Belakang/Lantai (Kerak Fosil/Miners, Mantel Lautan Magma Cair, Inti Luar Medan Magnet, Inti Dalam Datar Bersih)**:
    - **Kerak Bumi**: Fosil purba ammonite, trilobita, dan flora pakis kuno tertanam di latar belakang dan batuan tanah; animasi penambang geologis mengayun beliung (*pickaxe*) dengan percikan api (*impact sparks*).
    - **Mantel Bumi**: Lautan magma silikat cair penuh bersuhu ribuan derajat dengan arus konveksi berombak dinamis; eliminasi total serpihan batuan basal mengambang sehingga latar belakang bersih dan cair.
    - **Inti Luar**: Samudra logam mendidih 9.000°F berwarna kuning-emas pijar cerah; 5 kurva torus medan magnet bumi dipole (*geomagnetic dipole flux loops*) cyan elektrik dan emas berpijar sebagai simbol generator dinamo pelindung bumi.
    - **Inti Dalam**: Profil tanah 100% datar sempurna ($y = 350$) berwarna kuning keemasan bola besi padat; eliminasi total altar mahkota, pilar kristal tengah (`ic_crystal`), dan obelisk kerucut ground spikes.
54. **Sistem Kostum Adaptif Lingkungan Zona (Pakaian Tambang Kerak Bumi & Baju Pelindung Futuristik Tahan Panas Mantel/Inti) pada Sprite Dunia & Potret Visual Novel**:
    - **Kerak Bumi**: Player dan seluruh NPC memakai pakaian kerja tambang: rompi keselamatan oranye terang bergaris reflektor scotlight neon kuning-putih serta helm keselamatan proyek kuning berlampu senter kepala (*mining headlamp*) yang menyala dan memancarkan berkas cahaya ke depan.
    - **Mantel Bumi, Inti Luar, dan Inti Dalam**: Player dan seluruh NPC memakai baju pelindung masa depan canggih (*futuristic cryo-exosuit*): helm termal titanium tertutup dengan kaca visor HUD neon cyan, baju pelindung bertekanan dengan inti pendingin krio (*cryo-cooling power core*) berdenyut cyan, saluran pendingin cair (*coolant conduits*), sarung tangan termal, dan sol sepatu penolak panas.
    - **Permukaan Bumi & Batas Lempeng Tektonik**: Pakaian normal bawaan dipertahankan tanpa perubahan karena berada di atas permukaan bumi.
    - **Sinkronisasi Potret Dialog Visual Novel**: Potret NPC (`getNpcPortrait`) dan potret avatar siswa (`getPlayerPortrait`) secara otomatis mengikuti kostum zona (helm & rompi tambang di Kerak Bumi; helm & baju pelindung futuristik di Mantel dan Inti Bumi).
    - **Penyempurnaan Modal Riwayat Chat**: Tombol tutup silang `✕ KEMBALI`, tombol footer `Tutup Riwayat`, dan listener tombol `Escape`.
55. **Standarisasi Suhu Celcius Murni (°C) & Penyembunyian Telemetri Batas Tektonik (Level 1 Earth Dive)**:
    - **Standarisasi 100% Celcius Murni (Zero Fahrenheit)**:
      - Menghapus seluruh satuan dan konversi Fahrenheit (`°F`) dari seluruh katalog data strata geologi ([`earthDiveData.ts`](./src/app/Level1/EarthDive/earthDiveData.ts)), soal evaluasi dan pilihan ganda, penjelasan sains, clue siaga, dan mini-game gerbang kata (kata kunci diubah menjadi `ENAMRIBU` dengan petunjuk Celcius).
      - Menghapus Fahrenheit dari dialog seluruh pemandu NPC ([`dialogueData.ts`](./src/app/Level1/EarthDive/dialogueData.ts)) seperti Resqy, Dr. Fajar, Dr. Bagus, dan Prof. Lestari (menggunakan `5.000°C` di Inti Luar dan `6.000°C` di Inti Dalam).
      - Mengonversi seluruh diagram ilmiah SVG di [`DiscoveryModal.tsx`](./src/app/Level1/EarthDive/DiscoveryModal.tsx) (termometer titik leleh logam, arus konveksi mantel, batas D'', lautan logam cair, dan badge suhu ekstrem) ke Celcius murni.
      - Menghapus Fahrenheit dari konfigurasi zona ([`zones.ts`](./src/app/Level1/EarthDive/engine/zones.ts)) dan engine rendering ([`sprites.ts`](./src/app/Level1/EarthDive/engine/sprites.ts)).
    - **Penyembunyian Parameter Interior pada Batas Lempeng Tektonik (Divergen, Konvergen, Transform)**:
      - Pada zona Batas Divergen, Batas Konvergen, dan Batas Transform, indikator Kedalaman (KM), Tekanan (GPa), dan Suhu (°C) dihilangkan dari bilah TelemetryHUD karena wilayah ini merepresentasikan interaksi lempeng permukaan di mana parameter interior bumi tidak esensial.
      - Bilah TelemetryHUD pada ketiga zona batas tektonik hanya menampilkan: Kristal Terkumpul, Temuan Geologis Area, dan Bar Ketahanan HP.
      - Kartu transisi antar-lapisan ([`renderer.ts`](./src/app/Level1/EarthDive/engine/renderer.ts)) menyembunyikan label kedalaman jika `depthLabel` bernilai kosong, dan modal temuan sains menyembunyikan kedalaman/suhu untuk batas tektonik.
56. **Transformasi Area 2 Level 2: Simulasi Tanggap Gempa Ruang Kelas (Drill Drop-Cover-Hold On, Cutscene Gempa 10 Detik, Animasi Batu Runtuh, 16 Murid Kelas Konsisten, dan Standarisasi Rambu Resmi Jalur Evakuasi K3/BNPB)**:
    - **Arahan & Aspirasi Pengguna**:
      1. Bubble chat murid diatur bervariasi per meja dan berukuran ringkas, bersih 100% dari emotikon AI/OS modern (gunakan pixel 2D badge).
      2. Durasi gempa disetel 10 detik (600 frame) dengan getaran tremor halus (2.0–3.0px) tanpa guncangan ekstrem.
      3. Guru Bu Rahma dan seluruh 16 murid di kelas berlindung di bawah meja sambil memegang tas ransel di atas kepala untuk melindungi kepala dari reruntuhan.
      4. Efek serpihan debu/plafon plafon berjatuhan dibuat lebih nyata dan kentara.
      5. Jika pemain terlambat menekan QTE (10 detik habis), terjadi animasi dramatis batu beton besar runtuh menimpa kepala pemain disertai efek suara sakit (*hurt SFX*), pecahan batu hancur berkeping-keping, dan bintang pusing berputar `★ ★ ★`, diikuti dialog evaluasi Bu Rahma untuk mengulang simulasi.
      6. Seluruh kartu popup overlay di layar (QTE 720x118, Timer Gempa 680x80, Aba-aba Evakuasi 680x78) diperbesar agar terbaca jelas dan proporsional.
      7. Jumlah murid diperbanyak menjadi 16 murid (`CLASSROOM_STUDENTS_L2`) dan konsisten 100% di semua fase (saat guru mengajar di meja, saat merunduk di kolong meja, dan saat berbaris evakuasi ke pintu keluar).
      8. Telemetri teknis geologis dan temuan geologis dihapus total dari Area 2.
      9. Poster 1 (SOP Gempa di `x: 260`): Frame kayu diperlebar dari 70px menjadi 104px (`p1W = 104px`) sehingga teks 1. MERUNDUK, 2. BERLINDUNG, 3. BERTAHAN, dan DI BAWAH MEJA tidak lagi tembus ke luar frame (margin kanan lega 24px).
      10. Poster 3 di `x: 1620`: Dirombak dari kotak hijau polos menjadi Rambu Resmi **JALUR EVAKUASI** standar keselamatan K3/BNPB sesuai referensi gambar ketiga (latar hijau keselamatan `#007a3d`, double white border, pintu darurat putih dengan siluet orang berlari hijau keluar pintu, garis pembatas putih, teks tebal `JALUR EVAKUASI`, dan panah tebal putih menunjuk ke kanan menuju pintu lapangan terbuka).
    - **Hasil Implementasi & Verifikasi**:
      - Modul [`npcManagerL2.ts`](./src/app/Level2/engine/npcManagerL2.ts), [`gameEngine.ts`](./src/app/Level2/engine/gameEngine.ts), [`renderer.ts`](./src/app/Level2/engine/renderer.ts), [`zones.ts`](./src/app/Level2/engine/zones.ts), dan [`level2Data.ts`](./src/app/Level2/level2Data.ts) telah diselaraskan penuh.
      - Pintu evakuasi lapangan di `x: 2130` aktif dan menampilkan indikator kelulusan drill `★ PINTU LAPANGAN TERBUKA ★`.
      - Build verifikasi `npm run build` sukses bersih dengan 0 error kompilasi TypeScript.
57. **Transformasi Area 3 Level 2: Lapangan Evakuasi Pascabencana (Ambulans Medis Menapak Tanah, Rumput Statis Anti-Jitter, Rambu Titik Kumpul Standar BNPB, Briefing Otomatis Resqy, Ekosistem 5 NPC & Evaluasi TTS Komandan Satria)**:
    - **Arahan & Aspirasi Pengguna**:
      1. Akses kembali dari Area 2 ke Area 1 diperbaiki pada pintu paling kiri (`portal_back`).
      2. Popup nama area baru saat transisi diperbesar menyerupai Level 1.
      3. Di Area 3 (Lapangan Sekolah Pascabencana), catatan geologis dan temuan geologis diganti menjadi NPC, serta tantangan gerbang diganti menjadi NPC Komandan Satria.
      4. Robot Resqy menyapa pemain secara otomatis via visual novel saat masuk Area 3 tanpa harus diklik manual.
      5. Menghapus pintu ganda yang bertumpukan di awal area (`x = 40`) menjadi pintu tunggal bersih.
      6. Menghapus garis polisi kuning-hitam melayang di atas kepala murid.
      7. Merombak rambu Titik Kumpul sesuai standar BNPB (latar hijau tua `#14532d`, double border putih, 4 panah diagonal ke dalam, 4 figur siluet manusia, teks tebal `TITIK` dan `KUMPUL`).
      8. Menggeser ambulans ke kiri agar tidak terpotong pintu, menurunkan posisinya hingga menapak tanah di `y = 360` (`ambY = 281`) dengan bayangan roda, kaca sejajar tanpa melayang di atas kap, dan sirene merah-biru di atap tengah.
      9. Rumput lapangan tidak boleh berubah-ubah (jitter) saat pemain melangkah; diganti dengan algoritma penempatan rumput statis berbasis koordinat dunia absolut (`stepX = 28`). Teks lantai paving dihapus.
      10. Counter temuan telemetri HUD disinkronkan bertambah saat membaca materi pascabencana (`disc-post-safety` dan `disc-post-coordination`).
      11. Soal TTS disederhanakan ramah anak SMP Kelas 8 (`TITIKKUMPUL`, `AMBULANS`, `P3K`, `AMAN`) dan 100% diambil dari materi lapangan tanpa bocoran jawaban di dialog NPC.
      12. Standarisasi 100% Zero-Emoji pada UI Visual Novel dan game.
    - **Hasil Implementasi & Verifikasi**:
      - Modul [`renderer.ts`](./src/app/Level2/engine/renderer.ts), [`gameEngine.ts`](./src/app/Level2/engine/gameEngine.ts), [`TectonicGame.tsx`](./src/app/Level2/engine/TectonicGame.tsx), [`dialogueDataL2.ts`](./src/app/Level2/dialogueDataL2.ts), [`npcManagerL2.ts`](./src/app/Level2/engine/npcManagerL2.ts), [`DiscoveryModal.tsx`](./src/app/Level2/DiscoveryModal.tsx), [`VisualNovelDialogueL2.tsx`](./src/app/Level2/VisualNovelDialogueL2.tsx), [`zones.ts`](./src/app/Level2/engine/zones.ts), dan [`level2Data.ts`](./src/app/Level2/level2Data.ts) telah diselaraskan penuh.
      - Alur evaluasi terkunci ketat hingga 2 materi dibaca, kuis TTS berfungsi mulus, dan kapsul kemenangan Level 2 terbuka tuntas.
      - Build verifikasi `npm run build` sukses bersih dengan 0 error kompilasi TypeScript.
58. **Standarisasi Menyeluruh UI, Tombol Sentuh / D-Pad Analog, Kotak Percakapan, dan Kotak Materi Level 2 Selaras Level 1**:
    - **Arahan & Aspirasi Pengguna**:
      1. Tombol analog/kontrol sentuh di Level 2 tidak sama dengan Level 1 dan memerlukan zoom in ekstrem (250%) baru muncul. Dirombak agar sistem tombol dan visibilitasnya 100% persis Level 1.
      2. Seluruh gaya visual (style) di Level 2 disamakan dengan Level 1: kotak menu atas, tombol navigasi, kotak percakapan visual novel, kotak materi (Discovery Modal), dan tombol aksi.
      3. Sistem percakapan robot Resqy di Level 2 disamakan dengan Level 1 (percakapan interaktif RPG dengan pilihan jawaban, dan Resqy murni sebagai maskot terbang di belakang pundak tanpa duplikat NPC di tanah).
    - **Hasil Implementasi & Verifikasi**:
      - **Kontrol Sentuh & D-Pad**: Menghapus `sm:hidden` dan menggantinya dengan logika responsif Level 1: `isTouchDevice || (typeof window !== 'undefined' && window.innerWidth <= 1024)`. Tombol kini langsung muncul di perangkat layar sentuh dan lebar layar $\le$ 1024px tanpa zoom in.
      - **4-Way D-Pad & Dual Action Buttons**: Mengadopsi D-Pad 4 arah di kiri (▲, ◀, dot tengah, ▶, ▼) dengan container rounded gelap (`bg-slate-950/75 border-2 border-slate-700/90 shadow-[0_4px_0_#0f172a]`), serta tombol aksi di kanan: **LONCAT** (gradasi biru + panah atas) dan **[E] AKSI** (gradasi amber). Menambahkan panduan keyboard desktop bawah (`← → Gerak`, `↑ / [Spasi] Lompat`, `[E] Interaksi`) dan balon petunjuk mengambang `nearInteractablePrompt`.
      - **Kotak Menu HUD Atas**: Diselaraskan dengan Level 1: tombol `< MENU` berbingkai ganda (`bg-amber-950 border-2 border-amber-600/80 font-pixel-title text-[11px] sm:text-xs text-amber-200 shadow-[0_2px_0_#231206]`), tombol toggle Suara dan Layar Penuh berbasis PixelIcon SVG, serta badge zona aktif berteks tebal amber dengan lampu indikator hijau/merah.
      - **Kotak Percakapan (VisualNovelDialogueL2)**: Penyelarasan label `[Klik / SPASI untuk Lanjut ▶]`, `▶ Auto (ON)` / `▷ Auto`, tombol riwayat `📜 RIWAYAT PERCAKAPAN` dan `✕ KEMBALI`, potret karakter 100% transparan tanpa kotak latar belakang kaku, serta pilihan percabangan RPG bernomor `[1]`, `[2]`.
      - **Kotak Materi (DiscoveryModal)**: Lebar modal ditingkatkan menjadi `max-w-4xl`, kanvas ilustrasi sains diperbesar ke `h-[380px] sm:h-[450px] md:h-[500px]` dengan latar `#0c0a09`, tombol tutup `✕`, dan tata letak 2 kolom (`LOKASI PENELITIAN` & `FAKTA SAINS RESMI`).
      - **Resolusi Bug NPC**: Menghapus duplikat NPC Resqy statis di tanah (Area 2 & 3), memperbaiki algoritma proksimitas NPC di `npcManagerL2.ts` sehingga hanya memilih 1 NPC terdekat untuk menghilangkan bug teks menumpuk `[E] [E] BICARA`, mengganti prompt menjadi pill kuning 56x14px (`[E] / Enter`), serta mengaktifkan interaksi klik langsung pada canvas untuk NPC dan pendamping Resqy.
      - **Resolusi Duplikasi Key & Build Bersih**: Menghapus duplikasi key `resqy_briefing_area3` di `dialogueDataL2.ts` dan memperkaya pilihan respons percakapan. Hasil build `npm run build` sukses bersih dengan 0 error kompilasi TypeScript.
59. **Simulasi Tanggap Erupsi Merapi (Area 5): Mekanika Pengawalan Warga Mengikuti Pemain, Jalur Hamburan Burung dari Puncak Gunung, dan Skalabilitas UI**:
    - **Arahan & Aspirasi Pengguna**:
      1. Warga dusun yang dievakuasi (Dani, Mbah Joyo, Bu Tejo) tidak boleh diam di tempat setelah ditolong; mereka harus ikut berjalan beriringan bersama pemain sampai naik ke bak truk evakuasi BPBD.
      2. Urutan saat memasuki Area 5: popup memasuki area simulasi harus muncul dan tuntas terlebih dahulu sebelum robot Resqy memulai pengarahan taktis.
      3. Burung-burung panik tidak boleh terbang searah dari kiri ke kanan; burung harus muncul dari arah puncak gunung berapi dan kabur menyebar ke arah kanan dan kiri, serta ukurannya diperkecil secara proporsional.
      4. Kotak status gunung api di pojok kanan atas, kartu panel misi di sebelah kanan layar ("Tolong Dani", status evakuasi), dan popup QTE harus diperbesar agar terbaca jelas dan proporsional di layar.
    - **Hasil Implementasi & Verifikasi**:
      - **Mekanika Pengawalan Warga (Follower System)**: Mengimplementasikan sistem antrean pengikut berjenjang di `gameEngine.ts` di mana warga yang diselamatkan masuk ke state `following` dan melangkah mengikuti jejak pemain hingga ke truk BPBD di `x: 1840`.
      - **Orkestrasi Transisi Masuk**: Popup banner selamat datang *"MEMASUKI AREA SIMULASI ERUPSI MERAPI"* berjalan mandiri hingga pudar sebelum dialog Resqy diinisialisasi.
      - **Hamburan Burung Puncak Merapi**: Partikel burung terbang divergen dari koordinat puncak kawah Merapi (kiri-atas/tengah-atas) menyebar ke kiri dan kanan dengan ukuran 0.7x yang realistis.
      - **Hierarki & Skalabilitas UI**: Panel status PVMBG (Waspada, Siaga, Awas), daftar misi penyelamatan, dan popup kartu QTE diperbesar dimensi serta ketebalan tipografinya.
      - **Build Bersih**: Verifikasi `npx tsc -p tsconfig.app.json --noEmit` lolos tanpa kendala.
60. **Kebijakan Anti-Pengulangan Evaluasi TTS & Standarisasi Dialog Unlocked NPC Level 2 Selaras Level 1 (Area 1, Area 3, dan Area 4)**:
    - **Arahan & Aspirasi Pengguna**:
      1. Ketika pemain sudah menyelesaikan Teka-Teki Silang (TTS) evaluasi gerbang di Area 4 dan gerbang sudah terbuka, pemain tidak boleh dapat mengulang atau membuka TTS lagi.
      2. Mekanisme disamakan persis dengan konsep Level 1: ketika mengobrol kembali dengan NPC penguji, NPC berbicara ramah mengonfirmasi kelulusan dan mempersilakan lanjut ke area berikutnya.
      3. Aturan ini harus berlaku konsisten untuk seluruh evaluasi Level 2: Area 1 (Kak Fajar, gerbang `l2_gate_gempa`), Area 3 (Komandan Satria, gerbang `l2_gate_pascabencana`), dan Area 4 (Komandan Satria, gerbang `l2_gate_volcano_prep`).
    - **Hasil Implementasi & Verifikasi**:
      - **Unlocked Dialogue Trees Level 2**: Di `dialogueDataL2.ts`, diintegrasikan dialog apresiasi kelulusan tanpa opsi tantangan: `kak_fajar_unlocked_dialogue` (Area 1), `satria_field_unlocked_dialogue` (Area 3), dan `satria_volcano_unlocked_dialogue` (Area 4).
      - **Routing Sentral `getNpcDialogueTreeL2`**: Fungsi terpadu di `gameEngine.ts` mengevaluasi status `unlockedGates.has(...)` sebelum mengembalikan pohon percakapan ke UI.
      - **Penguncian Ganda Modal TTS**: Komponen `TectonicGame.tsx` memagari pemicu `onTriggerCrossword`, `state.pendingCrossword`, dan rendering `<CrosswordModal />` dengan `!isCurrentGateUnlocked()`.
      - **Verifikasi Build**: Kompilasi TypeScript sukses dengan 0 error (*exit code 0*).
61. **Penskalaan Parameter Getaran Seismik, Pengurangan Material Runtuh & Konfigurasi Tuning Gempa Mandiri**:
    - **Arahan & Aspirasi Pengguna**:
      1. Getaran gempa besar dikecilkan karena guncangan sebelumnya terlalu ekstrem dan membuat pusing.
      2. Disediakan lokasi pengaturan mandiri agar pengembang/guru dapat mengatur sendiri parameter amplitudo getaran gempa sedang dan gempa besar.
      3. Jumlah material/puing plafon yang jatuh dikurangi menjadi sekitar ~8-10 puing dan jeda jatuhnya diatur teratur.
    - **Hasil Implementasi & Verifikasi**:
      - Menyediakan konstanta terpusat `EARTHQUAKE_TUNING` pada [`gameEngine.ts`](./src/app/Level2/engine/gameEngine.ts) dengan parameter `moderate` dan `severe`.
      - Amplitudo gempa besar diturunkan menjadi `shakeIntensityX: 3.2` dan `shakeIntensityY: 2.4`.
      - Batas maksimum debris jatuh dibatasi `maxDebris: 8` dengan jeda interval antar-jatuhan `debrisInterval: 60`.
      - Build verifikasi `npm run build` sukses bersih dengan 0 error kompilasi TypeScript.
62. **Penyempurnaan Area 3 & Area 4: Proporsi Pintu, Redesain Gerbang Lapangan Sederhana, Papan 4 Status Merapi Bebas Overflow, dan Modernisasi Font "Plus Jakarta Sans"**:
    - **Arahan & Aspirasi Pengguna**:
      1. Pintu awal Area 3 (dari ruang kelas ke lapangan) ketinggian dan menutupi jendela gedung sekolah; minta dikecilkan.
      2. Teks materi di Area 3 over dari kotaknya dan kepanjangan hingga terpotong ke bawah.
      3. Pintu keluar Area 3 diganti menjadi gerbang sederhana (bukan pintu dan bukan gerbang alay/fantasi, melainkan gerbang lapangan sederhana).
      4. Tulisan di gerbang Area 4 over dari kotaknya, kotak latar diperlebar dan font diganti serasi font materi.
      5. Teks di seluruh papan Area 4 diganti fontnya dan diperbesar agar terbaca, posisi jangan mepet border (termasuk status Merapi: Normal, Waspada, Siaga, Awas).
      6. Font materi di Area 4 diperbesar dan teksnya diringkas.
    - **Hasil Implementasi & Verifikasi**:
      - Pintu awal Area 3 diturunkan menjadi `46px` tinggi sehingga jendela kaca gedung sekolah terlihat utuh.
      - Pintu keluar Area 3 dirombak menjadi gerbang lapangan sederhana (`drawAssemblyFieldExitGate`), papan nama diperlebar menjadi `76px` dengan font `bold 9.5px "Plus Jakarta Sans", sans-serif`.
      - Gerbang masuk Area 4 diperlebar ke `132px`, Papan 4 Status Merapi diperlebar ke `182x94px` dengan padding lega dan font modern sans-serif tebal.
      - Materi edukasi di `DiscoveryModal.tsx` dan `level2Data.ts` diringkas padat dan fontnya diperbesar.
      - Build verifikasi `npm run build` sukses bersih dengan 0 error kompilasi TypeScript.
63. **Overhaul Alur Simulasi Gempa Area 2: Pacing Tremor 1 Detik Pra-Alert, Kurikulum IPA Struktur Lapisan Bumi, dan Retakan Dinding Atas Halus Area 2 & Area 3**:
    - **Arahan & Aspirasi Pengguna**:
      1. Alur simulasi di Area 2 diperbaiki: saat guru mengajar, terjadi gempa/getaran terlebih dahulu selama ~1 detik, baru kemudian Bu Rahma berteriak "Ada gempa!", lalu gempa berlanjut ke tahap QTE.
      2. Materi yang dijelaskan oleh Bu Rahma diganti dari matematika ke materi IPA resmi: **Struktur Lapisan Bumi**.
      3. Retakan dinding pada gempa besar di Area 2 jangan retak parah di seluruh dinding, melainkan dibuat kecil/halus di bagian atas dinding dekat plafon saja.
      4. Retakan pada gedung sekolah di Area 3 juga dibuat kecil/halus di bagian atas dinding saja.
    - **Hasil Implementasi & Verifikasi**:
      - Naskah Bu Rahma (`intro_start`, `bu_rahma_teaching_cutscene`) dan papan tulis kelas diubah menjadi `IPA: STRUKTUR BUMI` (kerak bumi, mantel panas, inti bumi, lempeng tektonik).
      - Menambahkan fase `quake_start` (60 frame / ~1 detik) di mana layar berguncang dan alarm mulai berbunyi sebelum Bu Rahma memicu dialog peringatan darurat.
      - Fungsi `drawClassroomEarthquakeWallCracks` dirombak total: retakan dinding gempa besar di Area 2 menjadi retakan rambut tipis (`1.2px`) yang hanya berada di balok dinding atas ($y \le 50\text{px}$).
      - Retakan gedung sekolah di Area 3 dibatasi hanya pada dinding atas ($y = 114..150\text{px}$).
      - Penamaan resmi Area 3 diselaraskan menjadi `Lapangan Evakuasi Sekolah (Pasca Gempa Besar)`.
      - Build verifikasi `npm run build` sukses bersih dengan 0 error kompilasi TypeScript.
64. **Overhaul Lingkungan Lautan Penuh, Elevasi Lempeng Dasar Laut, Lapisan Mantel Magma, & Sekuens Dinamis (Gempa, Kenaikan Suhu, Ikan Panik & Tumbuhan Layu) di Batas Divergen (Level 1 Area 6)**:
    - **Arahan & Aspirasi Pengguna**:
      1. Mengubah lingkungan Area 6 dari daratan/senja menjadi lautan penuh dengan gradasi air laut biru muda di atas hingga gelap di dasar samudra.
      2. Menaikkan posisi lempeng dasar laut ke $Y \approx 248$ sesuai garis merah atas referensi, dan menambahkan lapisan mantel magma di bawah $Y = 408$.
      3. Patahan diperdalam menembus mantel, dan magma naik mengisi sepertiga kedalaman celah.
      4. Sekuens dinamis: ikan berenang damai ➔ gempa seismik ➔ kenaikan suhu drastis (ikan panik melesat kabur, tumbuhan laut layu mengkerut gosong) ➔ lempeng membelah ➔ magma membeku.
      5. Menghadirkan tombol replay `ULANG ANIMASI` di pojok kiri atas.
    - **Hasil Implementasi & Verifikasi**:
      - Modul [`zones.ts`](./src/app/Level1/EarthDive/engine/zones.ts), [`sprites.ts`](./src/app/Level1/EarthDive/engine/sprites.ts), [`renderer.ts`](./src/app/Level1/EarthDive/engine/renderer.ts), dan [`gameEngine.ts`](./src/app/Level1/EarthDive/engine/gameEngine.ts) diselaraskan penuh.
      - State machine sekuensial multi-fase berjalan teratur dan dapat diulang kembali via tombol `ULANG ANIMASI`.
      - Build verifikasi `npm run build` sukses bersih dengan 0 error kompilasi TypeScript.
65. **Kostum Penyelam Scuba (Pemain & 4 NPC), Pembekuan Magma di Tempat Tanpa Turun ke Bawah, Kerak Basal dengan Gradasi Termal Magma, dan Simetrisasi Penuh Lempeng Divergen (Level 1 Area 6)**:
    - **Arahan & Aspirasi Pengguna**:
      1. Karakter pemain dan seluruh NPC di Batas Divergen wajib memakai pakaian penyelam scuba lengkap karena berada di bawah air laut dalam.
      2. Saat pendinginan (`coolProgress`), magma TIDAK BOLEH ditarik turun kembali ke bawah dan diganti daratan baru; melainkan magma itu sendiri yang membeku di tempat menjadi daratan baru.
      3. Daratan hasil pembekuan dibikin setebal area garis merah referensi pengguna ($y = 326..350$), dan bagian bawah daratan dibikin gradasi alami dengan magma di bawahnya sehingga seolah-olah bawahnya masih menyatu dengan magma mantel yang mendidih.
      4. Celah magma terbuka di kaki tebing kiri dan kanan ditutup penuh oleh daratan tebing lempeng.
      5. Tonjolan batuan bawah yang menggantung di kaki lempeng kiri dihapus agar lempeng barat dan timur simetris sempurna di kedua sisi rekahan.
    - **Hasil Implementasi & Verifikasi**:
      - **Kostum Penyelam Scuba**: Pemain (`studentAvatarSheet.ts`) dan 4 NPC peneliti (`npcSprites.ts`) mengenakan wetsuit neoprene, kacamata masker visor panorama cyan, corong regulator pernapasan, tangki tabung oksigen ganda di punggung, sirip sepatu katak fleksibel, serta efek gelembung napas berkala (`renderer.ts`).
      - **Fisika Pembekuan Magma di Tempat**: Logika penurunan magma ke dasar mantel dihapus dari `zones.ts`; magma tetap stabil di celah rekahan $y = 326$.
      - **Kerak Pillow Basalt Bergradasi Termal**: Bagian atas magma membeku menjadi batuan basal samudra padat di $y = 326..336$, bertransisi linier melalui batuan hangus kemerahan ($y = 338..344$), pijar jingga magma ($y = 346..350$), dan memudar 100% transparan menyatu ke magma mantel di bawah $y = 352$.
      - **Penutupan Kaki Tebing**: Menghilangkan interpolasi kurva pemotong di bawah lereng tebing; batuan lempeng barat dan timur solid utuh hingga batas mantel bawah ($\approx 365\text{ px}$).
      - **Simetrisasi Presisi Lempeng**: Dasar lempeng barat di area rekahan mencerminkan (*mirror*) bentuk dasar lempeng timur secara matematis (`refEastX`), kedua lempeng bertemu rekahan di kedalaman yang sama persis ($y = 346\text{ px}$) dengan dinding tebing $20\text{ px}$ yang identik, dan tonjolan asimetris terhapus bersih.
      - **Verifikasi Build**: Lolos kompilasi TypeScript dan bundler Vite `npm run build` dengan 0 error (1.80s).
66. **Mode Renang 4 Arah (Batas Divergen), Karakter & NPC Penyelam Mengambang di Air, Penebalan Lempeng Samudra, Penipisan Lapisan Mantel, & Percepatan Pembekuan Magma (5 Detik)**:
    - **Arahan & Aspirasi Pengguna**:
      1. Karakter pemain dan para NPC tidak menapak tanah, melainkan mengambang di air seperti sedang menyelam di laut dalam.
      2. Kontrol pergerakan di Batas Divergen dibuat 4 arah (bisa berenang ke atas, bawah, kiri, dan kanan).
      3. Animasi proses dari keluarnya magma setelah patahan terbuka sampai membeku dipercepat menjadi sekitar 5 detik.
      4. Lapisan lempeng samudra ditebalkan ke bawah, dan lapisan mantel magma ditipiskan ke dasar kanvas karena sebelumnya terlalu tebal.
    - **Hasil Implementasi & Verifikasi**:
      - **Kontrol Renang 4 Arah**: Di [`player.ts`](./src/app/Level1/EarthDive/engine/player.ts), pada `zone.id === 'divergent'`, gravitasi tanah dimatikan (`player.onGround = false`). Tombol W/Up/Spasi untuk berenang ke atas, S/Down untuk menyelam ke bawah, A/Left & D/Right untuk meluncur horizontal dengan hambatan air dan gaya apung lembut (*buoyancy bobbing*).
      - **Karakter & NPC Mengambang di Air**: Karakter dan seluruh 4 NPC (Dr. Taufik, Prof. Maya, Prof. Ilham, Komandan Satria) di [`npcManager.ts`](./src/app/Level1/EarthDive/engine/npcManager.ts) dan [`zones.ts`](./src/app/Level1/EarthDive/engine/zones.ts) mengambang $\approx 42\text{ px}$ di atas dasar laut dengan osilasi apung alami dan gerak renang horizontal.
      - **Percepatan Pembekuan Magma 5 Detik**: Di [`gameEngine.ts`](./src/app/Level1/EarthDive/engine/gameEngine.ts), durasi pendinginan pasca-pemekaran dipangkas dari 14 detik menjadi 5 detik (100 tick magma mendidih aktif, 180 tick pembekuan pillow basalt utuh di $Y = 326$).
      - **Penebalan Lempeng & Penipisan Mantel**: Di [`zones.ts`](./src/app/Level1/EarthDive/engine/zones.ts), batas mantel `getMantleBoundaryY` diturunkan ke baseline $Y = 428$. Lempeng samudra menebal menjadi $\approx 180\text{ px}$ ($Y = 248..428$), dan lapisan mantel magma menipis menjadi $\approx 52\text{ px}$ di dasar kanvas ($Y = 428..480$) dengan gradasi termal yang diselaraskan di [`sprites.ts`](./src/app/Level1/EarthDive/engine/sprites.ts).
      - **Verifikasi Build**: Lolos kompilasi TypeScript dan bundler Vite `npm run build` dengan 0 error (2.08s).
67. **Overhaul Total Pos Pengamatan Merapi (Area 4 Level 2): Penukaran Posisi Bangunan & NPC, Pemindahan Materi Status Merapi ke Relawan, Pasien Kasur Medis Area 3, Redesain Vektor Seismograf Mekanik, Penskalaan Furnitur Indoor 24px, Pemandangan Jendela Merapi, Ikon Pixel Art 2D SVG, Gelombang 4 Status Sesuai Sketsa Pensil, Prompt Pintu Luar [E] / Enter, Kontrol Sentuh Mobile Borderless Transparan (Level 1 & Level 2), Integrasi Peta Zonasi KRB Merapi (1.webp), serta Redesain Asap Vulkanik Cauliflower & Alur Magma Berkelok Organik**:
    - **Arahan & Aspirasi Pengguna**:
      1. Tambahkan pasien yang sedang dirawat di atas ranjang kasur lipat medis pada posko tenda evakuasi Area 3.
      2. Tukar posisi bangunan di Area 4: Plaza Status Merapi beserta Relawan Mbak Rina di depan, dan gedung Pos Pengamatan Merapi beserta Pak Surya di belakang.
      3. Pindahkan Materi 1 (Tingkat Status Aktivitas Merapi) dari Pak Surya ke Relawan Mbak Rina karena relawan yang menjaga bangunan status gunung tersebut.
      4. Perbaiki keterbacaan materi alat seismograf di modal: gambar seismograf diperjelas dan diperbesar, hilangkan teks yang menumpuk.
      5. Sesuaikan ukuran furnitur di dalam ruangan Pos PGA (meja, monitor, teropong bintang, pintu) agar tidak kegedean dan proporsional terhadap tinggi karakter ($24\text{px}$).
      6. Samakan bentuk gunung di luar jendela observasi dengan bentuk Gunung Merapi di map luar.
      7. Hapus seluruh emotikon sistem operasi modern dan ganti dengan ikon style pixel art 2D (perbaiki kemunculan titik hitam fallback dot).
      8. Ubah bentuk gelombang seismogram monitor agar persis sesuai sketsa pensil 4 baris pengguna: Normal bergelombang landai halus, Waspada gelombang sedang, Siaga riak rapat berfrekuensi tinggi, Awas getaran tremor rapat kontinu ekstrem tanpa jeda datar.
      9. Munculkan popup prompt interaksi `[E] / Enter` saat mendekati pintu masuk luar Pos Pengamatan Merapi.
      10. Sinkronisasikan animasi jarum pena seismograf di meja ruangan indoor agar mengikuti gelombang halus status normal.
      11. Hilangkan background kotak hitam pembungkus (bounding box) pada kontrol analog D-Pad dan tombol aksi/loncat agar melayang transparan langsung di atas kanvas permainan.
      12. Pada modal Temuan 2 Area 4, tambahkan materi edukasi tentang Kawasan Rawan Bencana (KRB Merapi) dengan gambar visual peta dari berkas `1.webp` pada tab KRB, sedangkan materi lainnya (APD, Awan Panas, Lahar Hujan) menggunakan ilustrasi visual yang serasi dengan masing-masing materi; buat panel materi kanan bisa di-scroll, dan gambar kiri bisa diklik untuk tampilan penuh (lightbox fullscreen).
      13. Pada tab Awan Panas (Temuan 2 Area 4), perbaiki tekstur asap vulkanik agar tidak menggunakan bulatan-bulatan kaku, melainkan kepulan asap realistis berstruktur kubah kembang kol (cauliflower billows) seperti pada pemandangan Pos Pengamatan Merapi, serta buat alur lelehan magma keluar dari kawah menjadi realistis dan berkelok alami dengan kubah lava dan kerak batuan (bukan garis lurus kaku).
      14. Pada pintu keluar Area 4 (Pos Pengamatan Merapi) menuju Area 5 (Simulasi Erupsi Merapi), ubah bentuk pintu indoor kelas sekolah yang bertembok kuning menjadi gapura masuk pedesaan lereng Gunung Merapi / Desa Tangguh Bencana (Destana).
    - **Hasil Implementasi & Verifikasi**:
      - **Pasien Rawat Kasur Medis**: Menambahkan figur pasien pixel art berselimut dengan tiang infus di tenda medis Area 3 ([`renderer.ts`](./src/app/Level2/engine/renderer.ts)).
      - **Pertukaran Bangunan & NPC Area 4**: Plaza Status Merapi & Mbak Rina dipindahkan ke depan ($X \approx 500..650$), Gedung PGA & Pak Surya dipindahkan ke belakang ($X \approx 900..1050$) di [`zones.ts`](./src/app/Level2/engine/zones.ts) dan [`renderer.ts`](./src/app/Level2/engine/renderer.ts).
      - **Migrasi Materi 1 ke Mbak Rina**: Materi 4 Tingkat Aktivitas Gunung Merapi dipindahkan ke Mbak Rina di [`dialogueDataL2.ts`](./src/app/Level2/dialogueDataL2.ts) dan [`level2Data.ts`](./src/app/Level2/level2Data.ts).
      - **Redesain Vektor Seismograf Keterbacaan Tinggi**: Membangun diagram vektor presisi tinggi (`viewBox="0 0 740 330"`) yang memvisualisasikan fondasi batuan, rangka kaku, pegas spiral, massa beban inersia silinder emas berpendar, lengan stylus, jarum tinta merah, drum berputar dengan kertas kisi milimeter, serta 3 kartu penjelasan edukatif hukum kelembaman, drum putar, dan sensor geofon radio FM 151.7 MHz di [`SeismographModal.tsx`](./src/app/Level2/SeismographModal.tsx).
      - **Penskalaan Ergonomis Furnitur Indoor**: Meja observasi diturunkan ke elevasi pinggang ($y = 342$, tinggi meja $18\text{px}$), monitor ganda diperkecil ke $18\times 12\text{px}$, teleskop optik diatur sejajar mata ($y = 326$), dan pintu diperkecil ke $32\times 48\text{px}$ di [`renderer.ts`](./src/app/Level2/engine/renderer.ts).
      - **Pemandangan Jendela Observasi Merapi Otentik**: Menampilkan kerucut Stratovolcano Merapi dengan takik kawah barat, kubah lava aktif, alur lahar Kali Gendol & Krasak, vegetasi lereng pinus, dan kepulan asap vulkanik organik `drawRealisticVolcanicSmoke` di [`renderer.ts`](./src/app/Level2/engine/renderer.ts).
      - **Standarisasi Ikon Pixel Art 2D Kustom**: Menghapus seluruh emotikon OS dan menambahkan definisi ikon pixel kustom (`chart`/`activity`, `search`, `gear`, `cross`/`x`, `volcano`) di [`PixelIcon.tsx`](./src/components/PixelIcon.tsx), menuntaskan bug titik hitam fallback dot.
      - **Formula Gelombang 4 Status Sketsa Pensil**: Mengimplementasikan persamaan gelombang matematis presisi 4 baris status Merapi di [`SeismographModal.tsx`](./src/app/Level2/SeismographModal.tsx) dan menghapus pola spike ECG pada monitor dinding di [`renderer.ts`](./src/app/Level2/engine/renderer.ts).
      - **Prompt Interaksi Pintu Luar `[E] / Enter`**: Menambahkan prompt floating pixel retro `[E] / Enter` di pintu masuk luar Pos PGA ($dist < 52\text{px}$) di [`renderer.ts`](./src/app/Level2/engine/renderer.ts) dan [`gameEngine.ts`](./src/app/Level2/engine/gameEngine.ts).
      - **Sinkronisasi Animasi Jarum Stylus**: Jarum tinta merah pada drum seismograf ruangan PGA bergerak vertikal real-time mengikuti gelombang normal halus di [`renderer.ts`](./src/app/Level2/engine/renderer.ts).
      - **Kontrol Sentuh Mobile Borderless Transparan**: Menghapus container background gelap `bg-slate-950/75 border-2 rounded-2xl` pada D-Pad analog dan tombol aksi di [`EarthDiveGame.tsx`](./src/app/Level1/EarthDive/EarthDiveGame.tsx) dan [`TectonicGame.tsx`](./src/app/Level2/engine/TectonicGame.tsx).
      - **Penyelarasan Visual Serasi, Lightbox Fullscreen & Panel Scrollable (Temuan 2 Area 4)**: Menghadirkan 4 tab edukatif (APD, Awan Panas Wedhus Gembel, Lahar Hujan Sungai & EWS, serta Peta Resmi Zonasi KRB Merapi `1.webp`) di [`DiscoveryModal.tsx`](./src/app/Level2/DiscoveryModal.tsx). Setiap materi dilengkapi visual yang serasi, gambar kiri dapat diklik untuk membuka modal Lightbox Fullscreen beresolusi tinggi, dan panel materi di sebelah kanan dapat di-scroll (`overflow-y-auto`) dengan scrollbar pixel retro kustom.
      - **Asap Vulkanik Bergulung Alami & Magma Pijar Berkelok (Anti Bulat & Anti Lebay)**: Menggantikan 13 bulatan lingkaran kaku pada SVG Awan Panas dengan struktur kepulan awan piroklastik bergulung alami (*natural billowing ash plume*) 3 layer kedalaman yang menyatu padu dan proporsional (bebas bentuk aneh/lebay), aksen lengkungan puncak awan yang lembut, kubah kawah membara, serta alur lelehan magma kental berkelok dengan cabang sekunder dan percikan batu pijar.
      - **Transformasi Portal Pintu Menjadi Gapura Lereng Merapi (`drawPosPgaExitGapura`)**: Menggantikan rendering pintu kelas indoor `drawClassroomExitDoor` dengan gapura pedesaan berornamen pilar batu andesit bertingkat & bata merah, atap limasan / mini joglo terakota dengan mahkota pataka puncak, lentera pos ronda hangat pada tiang kayu, plang berbingkai `JALUR SIMULASI / MENUJU AREA 5 ➔`, lorong jalan terbuka beraspal dengan panah hijau lantai `➔` (serta palang rintangan serong kuning-hitam saat terkunci), dan floating banner beranimasi `[JALUR MENUJU SIMULASI ERUPSI]` di [`renderer.ts`](./src/app/Level2/engine/renderer.ts).
      - **Verifikasi Build**: Lolos kompilasi TypeScript dan bundler Vite `npm run build` dengan 0 error (2.17s).
68. **Integrasi Foto Nyata Banjir Lahar Dingin, Penyesuaian Tangga Area 6, Eliminasi Emotikon ke Ikon Pixel Art 2D Lintas Level & Area, Perbaikan Bug Stale Closure Popup Interaksi NPC Level 2, serta Penyeragaman Penuh Gaya Popup Bawah & Prompt [E] / Enter (Level 1 & Level 2)**:
    - **Arahan & Aspirasi Pengguna**:
      1. Ganti foto materi banjir lahar dingin di modal temuan (Temuan 3 Area 6 dan Tab 3 Temuan 2 Area 4) menggunakan foto dokumentasi nyata `images.jpeg`.
      2. Perbaiki posisi tangga di rumah pemukiman Area 6 agar menapak rapi di tanah dan bersandar alami pada lereng atap.
      3. Jangan gunakan emotikon sistem operasi di semua level dan area, ganti dengan style pixel art 2D yang serasi.
      4. Perbaiki bug popup interaksi NPC di Level 2 yang tetap menempel dan tidak mau hilang meskipun karakter pemain sudah berjalan jauh.
      5. Samakan style popup bawah antara Level 1 dan Level 2 menggunakan card popup besar Level 2 yang tebal, beranimasi, dan berikon siaran.
      6. Samakan style kotak dan teks `[E] Bicara` di atas NPC Level 1 menjadi `[E] / Enter` persis seperti di Level 2.
      7. Samakan style banner portal dan hindari tabrakan teks dengan kotak `[E] / Enter` di Level 1 seperti yang ada di Level 2.
    - **Hasil Implementasi & Verifikasi**:
      - **Foto Nyata Lahar Dingin**: Disematkan ke `public/images.jpeg` dan dihubungkan ke [`DiscoveryModal.tsx`](./src/app/Level2/DiscoveryModal.tsx) untuk materi lahar hujan dan pascabencana Merapi, lengkap dengan dukungan Lightbox Fullscreen.
      - **Presisi Tangga Pemukiman Area 6**: Di [`renderer.ts`](./src/app/Level2/engine/renderer.ts), kaki tangga menapak tanah pada $y: 354$ dengan bantalan dan bayangan, bersandar di genteng atap $y: 254$, dengan 7 rungs proporsional.
      - **Ikon Pixel Art 2D Kustom**: Seluruh emoji OS dibersihkan dan digantikan dengan ikon SVG pixel 2D kustom (`rain`, `rock`, `prohibited`, `runner`, `siren`, `dot-yellow`, `dot-red`, `dot-orange`) di [`PixelIcon.tsx`](./src/components/PixelIcon.tsx).
      - **Resolusi Stale Closure Popup NPC Level 2**: Di [`TectonicGame.tsx`](./src/app/Level2/engine/TectonicGame.tsx), menambahkan `nearPromptRef` dan `discoveredInAreaRef` untuk memutus stale closure di dalam RAF loop, memastikan `setNearInteractablePrompt(null)` terpanggil seketika saat pemain menjauh. Radius interaksi di [`npcManagerL2.ts`](./src/app/Level2/engine/npcManagerL2.ts) diperketat ke 46px.
      - **Card Popup Bawah Besar Level 1**: Di [`EarthDiveGame.tsx`](./src/app/Level1/EarthDive/EarthDiveGame.tsx), tombol/pill kecil digantikan oleh card popup besar Level 2 (`w-[min(94vw,860px)]`, border amber 3.5px, background slate-950/98, ikon siaran `<PixelIcon name="broadcast" size={24} />`, teks Plus Jakarta Sans tebal kapital, dan animasi pantulan lembut).
      - **Standarisasi Kotak `[E] / Enter`**: Teks `[E] BICARA` digantikan dengan `[E] / Enter` di Level 1 [`renderer.ts`](./src/app/Level1/EarthDive/engine/renderer.ts), dengan styling kotak pill hitam berbingkai kuning `#facc15` 1.5px dan font Plus Jakarta Sans tanpa segitiga balon ucapan, seragam dengan Level 2.
      - **Pemisahan Vertikal Banner Portal & Kotak Prompt**: Di [`sprites.ts`](./src/app/Level1/EarthDive/engine/sprites.ts), banner portal dinaikkan ke $y - 38 + \text{bob}$ dengan desain rounded badge Level 2, dan kotak prompt diposisikan di $y - 10 + \text{bounce}$, menghilangkan tabrakan teks sepenuhnya.
      - **Verifikasi Build**: Lolos kompilasi TypeScript dan bundler Vite `npm run build` dengan 0 error (2.44s).
69. **Standardisasi Karakter NPC Lintas Level (5 Anggota Tim Resmi), Preservasi 16 Siswa Ruang Kelas SMP (Level 2 Area 2), Evaluator Gerbang Tunggal Bu Tyas, Sistem Floating Badge Pixel Kaca Pembesar [🔍], dan Redesain Maskot Resqy Burung Hantu 2D Pixel**:
    - **Arahan & Aspirasi Pengguna**:
      1. Standardisasi karakter NPC di seluruh area Level 1 dan Level 2 menjadi 5 karakter tetap: **Zidane, Zahra, Ican, Lintang, dan Bu Tyas**.
      2. Pengecualian khusus: Level 2 Area 2 (Ruang Kelas SMP) mempertahankan 16 murid kelas dengan guru Bu Tyas, M.Pd.
      3. Karakteristik & profil visual:
         - **Zidane**: Kulit putih, rambut agak berantakan, kacamata cool, baju hitam, sifat pintar & cool.
         - **Zahra**: Cantik, imut, gemesin, kacamata bulat emas, kerudung biru, baju pink, sifat ceria.
         - **Ican**: Rambut ikal mengembang, sifat agak ngeselin / playful tapi edukatif.
         - **Lintang**: Kerudung hijau (ijo), sifat pintar & analitis/sistematis.
         - **Bu Tyas**: Kacamata dosen, kerudung hitam anggun, sifat dosen pembimbing & evaluator bijaksana.
      4. Otoritas evaluasi: Bu Tyas menguji tantangan Wordle di gerbang Level 1 dan TTS Crossword di gerbang Level 2 (Area 1, 3, 4, 6).
      5. Materi edukasi diakses lewat NPC; NPC pemegang materi wajib memiliki floating badge 2D pixel **kaca pembesar [🔍]** di atas kepala (emas berdenyut jika belum dibaca, hijau centang jika sudah dibaca).
      6. Redesain maskot Resqy dari robot menjadi burung hantu bijak 2D pixel ("Kuk-kuuk!").
      7. Preservasi outfit khusus Level 1: baju tambang (Kerak Bumi), cryo hazard suit (Mantel, Inti Luar, Inti Dalam), scuba gear (Divergen), kasual/formal (Permukaan, Konvergen, Transform, Level 2).
    - **Hasil Implementasi & Verifikasi**:
      - **Sprite & Bust Portraits 5 Karakter**: Generator sprite dinamis dan bust portrait transparan (`getZidanePortrait`, `getZahraPortrait`, `getIcanPortrait`, `getLintangPortrait`, `getBuTyasPortrait`) di Level 1 ([`npcSprites.ts`](./src/app/Level1/EarthDive/engine/npcSprites.ts)) dan Level 2 ([`npcSpritesL2.ts`](./src/app/Level2/engine/npcSpritesL2.ts)).
      - **Floating Badge Kaca Pembesar [🔍]**: Indikator material melayang diimplementasikan di renderer Level 1 ([`renderer.ts`](./src/app/Level1/EarthDive/engine/renderer.ts)) dan Level 2 ([`renderer.ts`](./src/app/Level2/engine/renderer.ts)) dengan animasi denyut emas (belum dibaca) dan hijau zamrud centang (sudah dibaca).
      - **Preservasi 16 Siswa Kelas SMP**: Seluruh 16 murid di Level 2 Area 2 tetap aktif di semua fase mitigasi (duduk, merunduk di kolong meja dengan tas ransel di kepala, dan evakuasi keluar) dengan guru Bu Tyas, M.Pd. di [`npcManagerL2.ts`](./src/app/Level2/engine/npcManagerL2.ts), [`renderer.ts`](./src/app/Level2/engine/renderer.ts), dan [`dialogueDataL2.ts`](./src/app/Level2/dialogueDataL2.ts).
      - **Evaluator Bu Tyas**: Dialog dan pemicu evaluasi Wordle Level 1 (Zona 1-7) dan TTS Level 2 (Area 1, 3, 4, 6) dialihkan kepada Bu Tyas, M.Pd.
      - **Maskot Burung Hantu Resqy**: Sprite in-world, ikon profil, dan naskah briefing Maskot Resqy diredesain menjadi burung hantu pixel cerdas berseru *"Kuk-kuuk!"*.
      - **Distribusi Alami Jumlah NPC per Area**: Mengeliminasi pemaksaan 5 NPC di setiap zona/area demi menghindari penumpukan visual. Jumlah NPC disesuaikan dengan proporsi orisinalnya (Level 1 Zona 0: 2 NPC [Zidane, Zahra], Zona 1: 4 NPC, Zona 2: 5 NPC, Zona 3: 5 NPC, Zona 4 Inti Dalam: 3 NPC [Zidane, Zahra, Bu Tyas], Zona 5: 5 NPC, Zona 6: 4 NPC, Zona 7: 4 NPC; Level 2 Area 1: 5 NPC, Area 2: 16 Siswa + Bu Tyas + Resqy, Area 3: 4 NPC, Area 4: 4 NPC, Area 5: Warga Destana, Area 6: 5 NPC) dengan karakter yang selalu dipilih secara konsisten dari 5 karakter inti.
      - **Zero-Regression Compatibility**: Seluruh ID legacy NPC dipetakan sebagai alias di `CHARACTER_PROFILES`, `DIALOGUE_REGISTRY`, dan `npcManager` menjamin keamanan progres siswa.
      - **Verifikasi Build**: Lolos kompilasi TypeScript dan bundler Vite `npm run build` dengan 0 error (4.21s).
70. **Penyelarasan Materi Sains, Distribusi Proporsional NPC Lapisan Dalam (Mantel s.d. Inti Dalam), Koreksi Proksimitas Interaksi & Mismatch Dialog Batas Konvergen/Transform, Isolasi State Inti Dalam, Penyembunyian Radar Batas Tektonik, Relokasi Kontrol Kondisi Konvergen, dan Eliminasi NPC Zidane & Sismograf di Batas Transform**:
    - **Arahan & Aspirasi Pengguna**:
      1. Di area Kerak Bumi, materi sains hanya boleh ada di Lintang, jangan ada duplikasi di Zahra.
      2. Jangan gunakan sebutan generik "Peneliti" di dialog dan prompt interaksi, sesuaikan dengan nama asli karakter NPC.
      3. Di lapisan mantel ke dalam sampai inti dalam, kurangi jumlah NPC secara bertahap (makin dalam lapisannya, makin sedikit NPC-nya); di lapisan dalam cukup NPC pembawa materi dan Bu Tyas saja.
      4. Di Batas Divergen, hapus duplikasi materi pada NPC Ican, materi cukup di Lintang.
      5. Di Batas Konvergen, perbaiki anomali posisi dan proksimitas interaksi NPC Zidane dan Zahra agar tidak bisa ditekan [E] dari kejauhan.
      6. Di Inti Dalam, perbaiki bug di mana membaca satu materi langsung menandai kedua materi terbaca.
      7. Di Batas Konvergen, perbaiki dialog Resqy tentang 2 kondisi tumbukan lempeng dan hapus tombol ekstra `[🦉 INFO 2 KONDISI]`.
      8. Perbaiki dialog tertukar (bicara ke Zidane muncul Zahra, bicara ke Ican muncul Zidane) di Batas Konvergen dan Transform.
      9. Hilangkan radar mini-map di area-area batas tektonik (Divergen, Konvergen, Transform).
      10. Pindahkan tombol pilihan kondisi konvergen (`DARATAN`, `LAUTAN`, `ULANG`) ke pojok kanan atas seperti kontrol simulasi di Level 2.
      11. Di Batas Transform, hapus NPC Zidane dan materi "Temuan 1: Sismograf & Bukti 20 Lempeng Bumi". Syarat gerbang Bu Tyas hanya membutuhkan materi Zahra (Sesar San Andreas).
    - **Hasil Implementasi & Verifikasi**:
      - **Penyelarasan Materi Kerak Bumi**: Duplikasi materi di Zahra dihapus; Lintang menjadi pemegang tunggal Discovery 0 (`trans_seismo` / Kerak Benua vs Samudra).
      - **Standarisasi Nama Asli Karakter**: Teks label generik "Peneliti" dibersihkan 100% dari seluruh dialog, floating prompt, dan title bar.
      - **Distribusi Proporsional Kedalaman**: Mantel (Zona 2) 3 NPC (Zahra [🔍], Lintang [🔍], Bu Tyas); Inti Luar (Zona 3) 3 NPC (Zahra [🔍], Lintang [🔍], Bu Tyas); Inti Dalam (Zona 4) 3 NPC (Zidane [🔍], Zahra [🔍], Bu Tyas).
      - **Pembersihan Materi Divergen**: Ican di Batas Divergen murni sebagai pemandu keselamatan tanpa materi duplikat.
      - **Koreksi Proksimitas Konvergen**: Ambang batas deteksi interaksi diperketat dan diselaraskan ke posisi fisik NPC Zidane dan Zahra.
      - **Isolasi State Inti Dalam**: State `ic_disc1` dan `ic_disc2` dipisahkan secara independen baik in-memory maupun di `localStorage`.
      - **Narasi 2 Kondisi Resqy & Clean HUD**: Penjelasan Resqy mencakup Benua-Benua dan Samudra-Benua; tombol ekstra `[🦉 INFO 2 KONDISI]` dihapus.
      - **Resolusi Mismatch Dialog**: Relasi ID speaker dan pohon dialog di [`dialogueData.ts`](./src/app/Level1/EarthDive/dialogueData.ts) diselaraskan 100%.
      - **Radar Mini-Map Tersembunyi**: Kondisi `hudData.zoneIndex >= 5` di [`EarthDiveGame.tsx`](./src/app/Level1/EarthDive/EarthDiveGame.tsx) menyembunyikan radar pada ketiga zona batas tektonik.
      - **Relokasi Tombol Kondisi**: Tombol `DARATAN`, `LAUTAN`, dan `ULANG` dipindahkan ke pojok kanan atas dengan layout vertikal rapi.
      - **Eliminasi Zidane & Sismograf di Batas Transform**: `z7_npc_zidane` dihapus dari [`zones.ts`](./src/app/Level1/EarthDive/engine/zones.ts) dan [`npcManager.ts`](./src/app/Level1/EarthDive/engine/npcManager.ts). Syarat gerbang Bu Tyas di [`EarthDiveGame.tsx`](./src/app/Level1/EarthDive/EarthDiveGame.tsx) hanya memerlukan Temuan 16 (Zahra). Dialog diselaraskan bebas sismograf.
      - **Penyeragaman Desain Floating Badge Materi Edukasi [🔍] Level 2 Menjadi Identik Level 1**: Menggantikan desain pin lingkaran lama di Level 2 (`drawNpcMaterialBadgeL2`) dengan kartu pill badge melayang (`pillW: 68, pillH: 17`) berbingkai emas/zamrud dengan pointer segitiga ke kepala NPC, ikon pixel art kaca pembesar, dan teks status `MATERI` / `BACA ✓` persis seperti di Level 1.
      - **Verifikasi Build**: Lolos kompilasi TypeScript `npx tsc --noEmit` dengan 0 error dan `npm run build` sukses 100%.
71. **Transformasi Area 4, 5, dan 6 Level 2: Relokasi & Konsistensi NPC Pos PGA (Zidane & Zahra), Perbesaran Tipografi Materi Edukasi & Integrasi Foto Nyata Wedhus Gembel, Penonaktifan Interaksi NPC Selama Simulasi Erupsi, Presisi Plang Posko BPBD, dan Konversi Kapsul Akhir Menjadi Mobil Truk Evakuasi Resmi BNPB/BPBD**:
    - **Arahan & Aspirasi Pengguna**:
      1. Di Area 4 (Pos Pengamatan Merapi), font materi edukasi diperbesar lagi agar mudah dibaca, dan gambar materi diperbesar proporsional mengisi kotak.
      2. Seluruh materi di Area Pos Pengamatan Merapi (Temuan 1 Zahra, Seismograf Lab Indoor, Temuan 2 Lintang) font-nya diperbesar terutama di sebelah kanan gambar, serta gambar ilustrasi diagram Wedhus Gembel diganti foto asli dari berkas `images (1).jpeg`.
      3. Di Area 5 (Simulasi Gunung Meletus), saat simulasi erupsi aktif dibuat agar pemain tidak bisa berinteraksi/terdistraksi dialog santai dengan NPC.
      4. Di Area 5 (Map 3 Kantor BPBD), perbaiki tulisan plang nama posko agar sesuai di dalam bingkai dan tidak keluar dari kotak plang.
      5. Di Area 6 (Evakuasi Akhir), bentuk kapsul fiksi ilmiah diganti menjadi mobil truk evakuasi resmi BNPB/BPBD yang sama persis dengan mobil truk penyelamatan di area simulasi erupsi.
    - **Hasil Implementasi & Verifikasi**:
      - **Relokasi NPC Pos PGA & Hapus Karakter Asing**: Zidane ditempatkan di dalam ruang observasi PGA di depan instrumen seismograf telemetri menggantikan Pak Surya (Pak Surya dihapus 100%). Zahra diposisikan di lereng luar (`x: 380`) memandu data seismik Merapi. Zahra dan Lintang mengenakan seragam medis lapangan (`medical_field`), Bu Tyas mengenakan kebaya guru formal (`teacher_kebaya`).
      - **Tipografi Materi & Foto Nyata Wedhus Gembel**: Seluruh font teks edukasi di sebelah kanan gambar diperbesar di [`DiscoveryModal.tsx`](./src/app/Level2/DiscoveryModal.tsx) dan [`SeismographModal.tsx`](./src/app/Level2/SeismographModal.tsx). Ilustrasi awan panas diganti foto dokumentasi asli erupsi Merapi [`public/wedhus_gembel.jpg`](./public/wedhus_gembel.jpg) yang tampil penuh di kotak visual.
      - **Guard Interaksi NPC Saat Simulasi Erupsi**: Ditambahkan parameter `allowInteraction` di [`npcManagerL2.ts`](./src/app/Level2/engine/npcManagerL2.ts). Saat `isVolcanoSimActive` di [`gameEngine.ts`](./src/app/Level2/engine/gameEngine.ts), NPC berpatroli santai tanpa menghadapkan pandangan ke pemain, balon dialog `[E]` disembunyikan di [`renderer.ts`](./src/app/Level2/engine/renderer.ts), dan klik canvas pada NPC diabaikan di [`TectonicGame.tsx`](./src/app/Level2/engine/TectonicGame.tsx) agar fokus murni pada instruksi darurat simulasi.
      - **Presisi Plang Posko BPBD**: Papan plang diperlebar ke 146px × 24px, badge oranye BPBD 28px × 18px (`maxWidth: 22px`), dan teks baris ganda `POSKO UTAMA BENCANA` / `KABUPATEN SLEMAN / YOGYAKARTA` (`maxWidth: 105px`) di [`renderer.ts`](./src/app/Level2/engine/renderer.ts) menjamin estetika bebas clipping.
      - **Mobil Truk Evakuasi Resmi BPBD Area 6**: Objek kapsul akhir dirombak total menjadi Truk Evakuasi Rescue BPBD via pemanggilan langsung `drawEvacuationRescueTruck` di `drawFinalEvacuationCapsuleL2`, lengkap dengan bodi oranye, lis chevron kuning-hitam, supir di kabin, kanopi, sirine rotator merah-biru, sorot lampu LED kristal saat terbuka, serta floating badge `MOBIL EVAKUASI`.
      - **Penyelarasan Warna Garis Gunung Merapi Area 5**: Garis lembah alur lahar di Area 5 yang sebelumnya berwarna cokelat kemerahan (`#451a03`) pada kondisi pasca-erupsi diganti menjadi warna slate alami `#334155` yang 100% serasi dan identik dengan tampilan siluet Gunung Merapi di Area 6.
      - **Animasi Lelehan Magma Letusan Eksplosif**: Mengimplementasikan sistem progresi lelehan magma dinamis (`magmaFlowProgress`) yang mengalir turun dari puncak kawah menuruni lereng saat letusan eksplosif meledak (Fase 4 AWAS), membentuk cabang kiri dengan lidah kolam teras dan kolam dasar, cabang kanan melengkung dengan lidah magma tengah dan kolam dasar luas membara, serta 4 busur semburan lava puncak (*crater lava spray arcs*), didukung visual multi-layer dan gelembung permukaan di [`renderer.ts`](./src/app/Level2/engine/renderer.ts) dan [`gameEngine.ts`](./src/app/Level2/engine/gameEngine.ts).
      - **Verifikasi Build**: Lolos pengujian kompilasi TypeScript dan Vite build `npm run build` dengan 0 error (exit code 0).
72. **Implementasi Skenario Erupsi Efusif Area 5 Level 2, Overhaul Animasi Lelehan Magma Seamless, Lanskap Hilir Sungai Dinamis Multi-Submap, Kepulan Asap Amorf Vulkanik Abu-Abu Kehitaman, dan Stabilisasi Tremor Evakuasi**:
    - **Arahan & Aspirasi Pengguna**:
      1. Tambahkan animasi lelehan magma yang keluar saat gunung meletus pada letusan eksplosif sesuai sketsa referensi, mengalir pelan (~14s) dari atas ke bawah, dan hilangkan garis pinggir (border) agar tekstur menyatu mulus (*seamless*).
      2. Buat tipe letusan efusif berdampingan dengan tipe eksplosif pada simulasi Area 5. Efusif bercirikan: tekanan gas rendah, magma cair encer, minim ledakan (tanpa busur percikan dan tanpa bom vulkanik jatuh), dan gempa tremor ringan konstan.
      3. Tambahkan latar pemandangan hilir sungai dekat gunung di skenario efusif dengan perspektif bertahap (Map 1 dekat sungai, Map 2 menjauh, Map 3 sangat jauh) dan evolusi kekeruhan air dinamis (jernih -> mulai keruh -> keruh pekat sedimen vulkanik alami, tanpa warna merah menyala).
      4. Perbaiki masalah sungai melayang di Map 3 agar menapak menyatu dengan bukit dan pemukiman.
      5. Ganti bentuk kepulan asap dari bulatan-bulatan kaku lingkaran menjadi kepulan realistis yang melimpah dan amorf bergelombang, dengan warna abu-abu kehitaman pekat.
      6. Selaraskan intensitas gempa saat seluruh warga selesai dievakuasi menuju mobil evakuasi (`fase4_awas_truck`) agar tetap bergetar ringan konstan (tanpa lonjakan mendadak).
      7. Di area simulasi gunung meletus, pasang papan jalur evakuasi dengan panah ke kanan di ketiga map dan pada kedua kondisi (eksplosif dan efusif).
    - **Hasil Implementasi & Verifikasi**:
      - **Overhaul Animasi Lelehan Magma Merapi**: Mengalir perlahan (~14 detik) menelusuri lereng kiri dan kanan sesuai sketsa referensi pengguna, dirender dengan sistem multi-pass tanpa garis tepi kaku sehingga menyatu sempurna.
      - **Skenario Erupsi Efusif Lengkap**: Tombol switcher HUD `EKSPLOSIF` / `EFUSIF` aktif; letusan efusif murni menampilkan danau lava kawah dan lelehan menuruni lereng tanpa efek ledakan kawah, tanpa bom vulkanik jatuh, serta diiringi getaran tremor vulkanik ringan stabil (`0.7 - 0.8 SR`).
      - **Lanskap Hilir Sungai Alami & Zero Floating**: Penataan urutan render (bukit latar belakang digambar duluan) dan pemanjangan lereng bantaran depan (*near bank slope*) ke seluruh submap (1, 2, dan 3) menyambung penuh dari bibir bawah sungai ($Y=254$) langsung ke lantai pemukiman ($Y=360$), mengeliminasi 100% celah abu-abu di Map 3. Kekeruhan air berevolusi dinamis dari jernih ke sedimen vulkanik keruh pekat (`#292524`, `#44403c`, `#334155`) dengan riak gelombang sinusoidal alami.
      - **Kepulan Asap Amorf Vulkanik Realistis**: Mengganti `ctx.arc` dengan 28 kluster cumulus *Harmonic Perturbed Amorphous Polygons* 10-titik ber-radial gradient warna abu-abu kehitaman pekat (`rgba(87, 83, 78)` hingga `rgba(28, 25, 23)`).
      - **Konsistensi Tremor Fase Evakuasi Mobil**: Getaran gempa saat lari menuju mobil evakuasi (`fase4_awas_truck`) dikunci pada tremor vulkanik ringan (`0.7 + Math.sin(animTick * 0.2) * 0.25`), menyatu mulus tanpa lonjakan getaran.
      - **Rambu Resmi Jalur Evakuasi BNPB (Panah Kanan ➔)**: Papan rambu jalur evakuasi resmi BNPB (`drawRambuJalurEvakuasiMerapi`) terpasang kokoh di tiang baja pada ketiga submap (Map 1, Map 2, Map 3) pada kedua kondisi erupsi di koordinat `x: 680`, `x: 1220`, dan `x: 1720`, lengkap dengan piktogram *running man*, panah ke kanan berdenyut, teks panduan arah adaptif, dan prompt proksimitas.
      - **Verifikasi Build**: Lolos kompilasi TypeScript dan Vite build `npm run build` dengan 0 error (exit code 0).
73. **Puncak Merapi Rusak/Kroak Pasca-Letusan Eksplosif, Aliran Lava Efusif 10 Cabang Tanpa Offset & Animasi Merayap Halus, Redesain Modal Status Merapi Krem Hangat, Lelehan Magma Area 6, Timer 15 Detik Evakuasi Warga, dan Modal Gagal Evakuasi**:
    - **Arahan & Aspirasi Pengguna**:
      1. Di kondisi eksplosif Area 5, saat gunung meletus buat gunungnya agak rusak/kroak (*caldera collapse*) pasca-letusan.
      2. Di skenario efusif, perbanyak aliran lava yang keluar dari gunung sesuai sketsa garis merah pengguna, dan animasi turunnya diperlambat lagi jangan cepat-cepat.
      3. Ganti skema warna kotak popup status fase Merapi (Fase 1-4) menjadi seperti gambar ketiga (Discovery Modal: nuansa perkamen krem hangat dan kayu retro).
      4. Di Area 6 (Barak Pengungsian & Pemulihan), buat gunung di kejauhan tampak masih ada magmanya tipis-tipis sesuai sketsa garis merah gambar keempat.
      5. Pada fase evakuasi warga (Fase 4 Awas), waktu 15 detik yang sebelumnya beku/stuck harus berjalan mundur dinamis (*countdown timer*), dan jika waktu habis sebelum ketiga warga diselamatkan, terjadi kegagalan (modal gagal evakuasi) dengan tombol ulangi/coba lagi (*retry*).
      6. Pastikan banyak aliran lava hanya ada di skenario efusif, sedangkan skenario eksplosif tetap mempertahankan 3 aliran lava klasik seperti semula.
      7. Perbaiki offset/celah pada aliran lava kawah agar berhulu pas di dalam danau kawah magma, dan perlambat lagi animasi turunnya lava.
    - **Hasil Implementasi & Verifikasi**:
      - **Puncak Merapi Rusak / Kroak Eksplosif**: Mengimplementasikan `isExplosiveErupted` di `drawVolcanoSimulationAtmosphere` ([`renderer.ts`](./src/app/Level2/engine/renderer.ts)) yang merender takik kaldera runtuh bergerigi (*jagged caldera notch*) dengan batuan andesit gelap (`#18181b`), tebing rekahan (`#27272a`), dan garis retakan (`#09090b`), serta merelokasi asal semburan kolom abu letusan ke rekahan takik kaldera.
      - **Aliran Lava Efusif 10 Cabang Tanpa Offset**: Mengintegrasikan 10 cabang aliran lava menuruni lereng (`farLeftRidgePoints`, `leftFlankPoints`, `leftMidBranchPoints`, `trunkPoints`, `centerLeftPoints`, `centerRightPoints`, `rightFlankPoints`, `rightMidBranchPoints`, `rightLowerBranchPoints`, `farRightRidgePoints`) dan 7 kolam delta di [`renderer.ts`](./src/app/Level2/engine/renderer.ts) khusus pada skenario efusif, mengeliminasi offset bibir kawah (`topX - 24 * s` dan `topX + 22 * s`), serta mempertahankan 3 cabang klasik pada skenario eksplosif.
      - **Deselerasi Aliran Lava (~55 Detik)**: Menurunkan laju aliran `flowRate` efusif ke `0.00030` per frame dan initial progress `0.01` di [`gameEngine.ts`](./src/app/Level2/engine/gameEngine.ts), menghasilkan pergerakan lava kental andesitik yang merayap perlahan dan anggun (~55 detik total).
      - **Redesain Modal Status Merapi Krem Hangat**: Mengubah palet warna [`VolcanoPhaseModal.tsx`](./src/app/Level2/VolcanoPhaseModal.tsx) menjadi perkamen krem hangat (`#fef3c7`, `#fffbeb`, `#fef9c3`) dengan bingkai kayu retro (`#78350f`, `#b45309`, `#451a03`), paku rivet kuningan, pita status warna resmi PVMBG berbingkai kayu, teks kontras tinggi, dan tombol kayu interaktif.
      - **Lelehan Magma Tipis Area 6**: Mengimplementasikan `drawArea6DistantLavaVeins` di [`renderer.ts`](./src/app/Level2/engine/renderer.ts) dengan 3-pass rendering halus (oranye transparan, merah-oranye, dan kilau inti kuning emas) pada siluet kejauhan Gunung Merapi di Area 6 sesuai sketsa pengguna.
      - **Timer Hitung Mundur 15 Detik Evakuasi Warga**: Mengaktifkan pengurangan `sim.qteTimer -= 1` per frame pada `fase4_awas_rescue` di [`gameEngine.ts`](./src/app/Level2/engine/gameEngine.ts) (15 detik = 900 frame) dengan tampilan detik real-time di HUD telemetri.
      - **Sistem & Modal Gagal Evakuasi (`VolcanoRescueFailedModal.tsx`)**: Mengalihkan simulasi ke state `failed` saat waktu habis, memicu audio darurat, menampilkan modal gagal bernuansa kayu-krem hangat dengan tips mitigasi BNPB, dan menyediakan tombol coba lagi instan `[ ↺ ] ULANGI EVAKUASI WARGA (15 DETIK)` via `retryVolcanoRescuePhase(state)` tanpa mereset seluruh fase dari awal.
      - **Verifikasi Build**: Lolos kompilasi TypeScript dan Vite build `npm run build` dengan 0 error (exit code 0 dalam 2.22s).
74. **Platforming Parkour Pilar Basal Mantel Bumi, Penukaran Map & Atmosfer Inti Luar vs Inti Dalam, Sistem Pembelian Baju Pelindung Geologis Berbasis Kristal Energi, Alur Dialog Pasca-Wordle Bu Tyas, dan Pembesaran Modal Peringatan Bahaya Ekstrem**:
    - **Arahan & Aspirasi Pengguna**:
      1. Di Level 1 area mantel bumi, buat lintasan platform parkur dengan danau magma di bawahnya; sesuaikan letak NPC dan kristal agar berada di atas platform aman (jangan sampai di dalam magma).
      2. Tukar map antara Inti Luar dan Inti Dalam (mapnya saja), dengan efek magnet dan lucutan petir tetap berada di Inti Luar.
      3. Ubah warna dan suasana kondisi: Inti Luar tetap kuning keemasan (seperti kondisi Inti Dalam sebelumnya), dan Inti Dalam dibuat agak gelap tanahnya dan magmanya (seperti kondisi Inti Luar sebelumnya).
      4. Alihfungsikan kristal energi agar berguna untuk membeli baju pelindung geologis. Di Kerak Bumi sediakan NPC Teknisi setelah Bu Tyas untuk membeli baju pelindung termal mantel bumi menggunakan kristal kerak; setelah menjawab pertanyaan Bu Tyas, Bu Tyas berbicara lagi mengarahkan ke NPC Teknisi tersebut.
      5. Terapkan konsep serupa secara bertahap: di Mantel Bumi beli baju pelindung untuk ke Inti Luar, di Inti Luar beli baju pelindung untuk ke Inti Dalam, dan di Inti Dalam beli baju selam untuk ke Batas Divergen. Harga baju pelindung seharga 1 kristal yang didapat di area terkait.
      6. Hapus kotak narasi teknisi pada modal pembelian baju dan perbesar font teksnya agar mudah dibaca.
      7. Perbesar ukuran popup peringatan bahaya ekstrem beserta font-nya saat pemain mencoba melompat ke portal tanpa memakai baju pelindung yang sesuai.
    - **Hasil Implementasi & Verifikasi**:
      - **Platforming Pilar Basal Mantel Bumi**: Topografi Zona 2 di [`zones.ts`](./src/app/Level1/EarthDive/engine/zones.ts) dirombak menjadi deretan pilar basal hitam (`basalt_pillar`) terapung di atas danau lava konveksi. NPC Zahra ($px=380$), Lintang ($px=700$), Bu Tyas ($px=1070$), dan Kristal Energi ($px=540$) ditata aman di atas pilar.
      - **Penukaran Map Inti Luar vs Inti Dalam**: Map Zona 3 mengadopsi kubah batuan datar dengan efek lucutan listrik dan medan magnetik kuning hangat; Map Zona 4 mengadopsi teras heksagonal purba melintasi jurang fluida dengan nuansa gelap pekat; serta penambahan kristal energi baru di Inti Dalam ($px=590, py=280$).
      - **Sistem Merchant Baju Pelindung Geologis**: 4 NPC Teknisi (Joko di Kerak, Rudi di Mantel, Dian di Inti Luar, Arya di Inti Dalam) terpasang di samping Bu Tyas sebelum Portal Turun. Modal transaksi [`SuitMerchantModal.tsx`](./src/app/Level1/EarthDive/SuitMerchantModal.tsx) melayani penukaran Baju Termal MK-1, Baju Elektromagnetik MK-2, Exo-Suit Adamantine MK-3, dan Baju Selam Scuba dengan auto-equip dan persistensi per user ID.
      - **Gatekeeper Portal & Dialog Berkesinambungan Bu Tyas**: Dialog kelanjutan otomatis Bu Tyas pasca-Wordle di [`dialogueData.ts`](./src/app/Level1/EarthDive/dialogueData.ts) dan [`EarthDiveGame.tsx`](./src/app/Level1/EarthDive/EarthDiveGame.tsx) mengarahkan siswa ke Teknisi. Portal memblokir akses ke area berikutnya jika baju belum dipakai.
      - **Avatar Sheet 4 Tingkat Baju Pelindung**: Desain rendering sprite dinamis di [`studentAvatarSheet.ts`](./src/utils/studentAvatarSheet.ts) untuk mode `hazard_mantle`, `hazard_outer`, `hazard_inner`, dan `diver`.
      - **UI Modal Refinement**: Kotak narasi teknisi dihapus dari `SuitMerchantModal.tsx`, font diperbesar; modal peringatan `suitWarningModal` di `EarthDiveGame.tsx` diperbesar menjadi `max-w-2xl sm:max-w-3xl` dengan ikon 80x80px dan font sains yang lebih besar.
      - **Verifikasi Build**: Lolos kompilasi TypeScript dan Vite build `npm run build` dengan 0 error (exit code 0 dalam 2.73s).
75. **Audit Komprehensif Alur Dialog Interaktif, Resolusi Bug Freeze Cabang Pilihan, dan Penyelarasan Penuh Identitas & Potret NPC Lintas Level 1 & Level 2**:
    - **Arahan & Aspirasi Pengguna**:
      1. Selesaikan masalah saat pemain memilih opsi kedua pada percabangan dialog yang menyebabkan game langsung membeku (freeze) dan hanya bisa lanjut setelah spasi ditekan.
      2. Periksa seluruh percakapan di Level 1 dan Level 2 untuk memastikan tidak ada lagi error atau aliran dialog yang buntu.
      3. Periksa dan benerin ketidaksesuaian NPC di Level 1 dan Level 2: ada beberapa NPC yang di percakapannya menyebut nama tertentu (misal Zidane), tetapi bentuk/potret NPC-nya malah karakter lain (misal Lintang).
    - **Hasil Implementasi & Verifikasi**:
      - **Resolusi Bug Freeze Pilihan Kedua**: Menambahkan node terminal `done` yang hilang pada `PROF_ANDINI_DIALOGUE`, mengoreksi case-sensitivity `start_tour_one` di `INSPEKTUR_BUDI_DIALOGUE`, serta menyambungkan percabangan di `PROF_RADITYA_DIALOGUE`.
      - **Audit Integritas Pohon Dialog**: Menjalankan automated traversal script ke 38 pohon dialog Level 1 dan 28 pohon dialog Level 2. Hasil: 0 broken transitions.
      - **Penyelarasan NPC Level 1**: Profil `prof_sarah` di Zona 2 diperbaiki ke Zahra (`#f472b6`, potret `zahra`), `prof_lestari` di Zona 4 diperbaiki ke Zahra, `dr_farhan` di Zona 4 diperbaiki ke Lintang (`#4ade80`, potret `lintang`), dan `PETUGAS_RUDI_TRANS_DIALOGUE` di Zona 7 diperbaiki ke pembicara `lintang`.
      - **Penyelarasan NPC Level 2**: Profil `pak_joko` di Area 5 dikembalikan ke Pak Joko Destana (`#22c55e`, potret `pak_joko`), profil `mbak_rina` di Area 5 dikembalikan ke Mbak Rina Warga Siaga (`#f87171`, potret `mbak_rina`), NPC `l2_sim5_npc_satria` dihubungkan ke Komandan Satria (`#f97316`, potret `komandan_satria`) dengan dialog kemenangan `satria_sim_victory`, NPC `l2_shelter_npc_ican` di Area 6 dihubungkan ke dialog Ican `dani_shelter_dialogue`, profil `bu_rahma` dan tipe map Area 3 diselaraskan ke `bu_tyas`, serta profil warisan `pak_slamet` dan `pak_hendra` dirapikan.
      - **Refinement Antarmuka Modal & Edukasi**: Mempercantik visual `SuitMerchantModal.tsx`, merapikan narasi briefing Resqy, dan menyempurnakan istilah geologi menjadi *"punggungan tengah samudra (mid-ocean ridge)"*.
      - **Verifikasi Build**: Lolos kompilasi TypeScript `npx tsc --noEmit` dengan 0 error dan `npm run build` sukses 100%.