# RANCANGAN IMPLEMENTASI JOBSHEET & STUDI KASUS MITIGASI BENCANA (ACTION LAB LEVEL 3)
**Platform: RESQ-BOX — Gamifikasi Pembelajaran Mitigasi Bencana & IoT Embedded**  
**Referensi Format: `Jobshet LIDM NEW 22.pdf` | Program Hardware: `Yo.ino` (ESP32)**  
**Jenjang Sasaran: SMP / MTs (Kelas VII - VIII) — Mata Pelajaran IPA Terpadu & Informatika (Kurikulum Merdeka)**

---

## 1. PENDAHULUAN & TUJUAN KURIKULUM

Kurikulum Merdeka IPA SMP menekankan pemahaman konsep kebencanaan (gempa bumi, vulkanologi) dan penerapannya dalam kehidupan nyata melalui mitigasi bencana. Sistem **RESQ-BOX Action Lab (Level 3)** mengintegrasikan:
1. **Algoritma Pemrograman Visual (Blockly)** dengan kosakata ilmiah IPA Mitigasi (tanpa istilah teknis elektronika yang rumit).
2. **Diorama Fisik IoT (ESP32 `Yo.ino`)** sebagai umpan balik nyata (LED RGB Status, Motor Getar Seismik, Mist Humidifier Erupsi, Buzzer EWS, Layar OLED Informasi, dan Speaker DFPlayer).
3. **Digital Twin Web Simulator** yang memvisualisasikan data telemetri realistis (Canvas Seismograf bergerak dinamis, Skala Richter $M_L$, Suhu Termal Kawah °C, Partikel Erupsi Eksplosif/Efusif, dan Peta Penentuan Jalur Evakuasi Aman).

---

## 2. ARSITEKTUR BLOK CODING BARU (BAHASA IPA MITIGASI SMP)

### A. Blok yang Dihapus (Sesuai Arahan)
- `Kipas Ventilasi` (Dihapus)
- `Pintu Evakuasi` / Servo (Dihapus)
- `Tombol Darurat 1 & 2` (Dihapus)
- `Slider Kondisi Alam Manual` pada UI (Dihapus, diganti indikator dinamis otomatis)

### B. Daftar Blok Coding Baru & Pemetaan ke Hardware `Yo.ino`

| ID Blok | Tampilan Teks Blok (IPA Mitigasi) | Kategori | Parameter / Opsi | Sinkronisasi Hardware `Yo.ino` | Efek Digital Twin Web |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `resq_program` | **Sistem Mitigasi** | Sistem | `Mulai Saat Dihidupkan`, `Jalankan Terus-Menerus` | Loop utama Arduino | Inisialisasi thread simulasi |
| `resq_gempa_sim` | **Simulasi Getaran Gempa** | Fenomena Alam | `[Ringan (3-4 SR) / Sedang (5-6 SR) / Kuat (>7 SR)]` | `gempa 1`, `gempa 2`, `gempa 3` (Motor DC PWM getar + Speaker audio gempa bersamaan) | Gelombang seismograf melonjak tajam, gauge Skala Richter naik, peta bergetar |
| `resq_gunung_sim` | **Simulasi Aktivitas Gunung Merapi** | Fenomena Alam | Status: `[Normal / Waspada / Siaga / Awas]`, Tipe: `[Eksplosif / Efusif]` | `gunung 1/2/3`, `mist on/off` (Humidifier menyala + audio gemuruh) | Kawah mengeluarkan semburan abu & batu (Eksplosif) atau lelehan lava (Efusif); Suhu kawah naik |
| `resq_tipe_letusan`| **Tipe Letusan Gunung Api** | Fenomena Alam | `[Eksplosif (Ledakan & Abu) / Efusif (Lelehan Lava)]` | `mist on` durasi tinggi (Eksplosif) vs `mist on` stabil (Efusif) | Visualisasi partikel kawah: lontaran piroklastik vs aliran lava pijar |
| `resq_lampu_status`| **Atur Lampu Status Bencana** | Peringatan EWS | `[Hijau (Normal) / Kuning (Waspada) / Oranye (Siaga) / Merah (Awas)]` | `rgb green`, `rgb yellow`, `rgb orange`, `rgb red` | Lampu posko di peta berubah warna sesuai standar BNPB |
| `resq_sirine_ews` | **Bunyikan Sirine Peringatan Dini (EWS)** | Peringatan EWS | `selama [ ... ] detik` | `buzzer on` (durasi tertentu) | Gelombang suara audio EWS berdering |
| `resq_sirine_stop`| **Hentikan Sirine Peringatan Dini** | Peringatan EWS | - | `buzzer off` | Sirine hening |
| `resq_layar_oled` | **Tampilkan Pesan di Layar Informasi** | Pusat Informasi| `teks pesan [ ... ]` | Menampilkan teks di OLED SSD1306 | Kotak informasi publik di web menampilkan teks identik |
| `resq_jalur_evakuasi`| **Tentukan Jalur Evakuasi Warga** | Aksi Mitigasi | `[Jalur Lingkar Utama (Bebas Lahar) / Jalur Lembah Sungai (Rawan Lahar) / Jalur Lapangan Terbuka]` | Mengirim kode status rute ke Serial monitor | Garis rute di peta menyala hijau (aman) atau merah berkedip (bahaya); warga bergerak |
| `resq_lokasi_mitigasi`| **Lokasi Kejadian Mitigasi** | Kondisi Lokasi | `[Gedung Sekolah / Pemukiman Warga / Rumah Sakit / Dekat Jembatan Sungai]` | Konfigurasi profil simulasi | Karakter dan bangunan aktif di peta disesuaikan |
| `resq_posko` | **Buka Pos Pengungsian** | Aksi Mitigasi | `[Barak Pengungsian Terpadu (KRB I) / Posko Medis BPBD / Lapangan Terbuka]` | OLED menampilkan posko yang aktif | Tenda posko menyala hijau terang di simulator |
| `resq_sensor_seismik`| **Tingkat Getaran Seismik** | Pemantauan | Output: Angka / Level getaran | Membaca intensitas gempa | Sinkron dengan gelombang seismograf |
| `resq_sensor_suhu` | **Suhu Kawah (°C)** | Pemantauan | Output: Angka suhu (°C) | Membaca suhu aktual status Merapi | Sinkron dengan termometer digital kawah |
| `resq_jika_tidak` | **Kalau [Kondisi] Maka [Aksi] Selain Itu [Aksi]** | Pengambilan Keputusan | Kondisi logika | `if (...) { ... } else { ... }` | Evaluasi percabangan logika |
| `resq_bandingkan` | **Bandingkan Nilai [A] [> / < / ==] [B]** | Pengambilan Keputusan | Operator perbandingan | Relational operator C++ | Pembanding nilai telemetri |
| `resq_dan_atau` | **Kondisi [A] [DAN / ATAU] Kondisi [B]** | Pengambilan Keputusan | Logika boolean | `&&` atau `\|\|` | Evaluasi kondisi majemuk |
| `resq_tunggu` | **Jeda Waktu [ ... ] detik** | Waktu & Alur | Durasi detik | `delay(ms)` | Sleep timer asinkron |
| `resq_ulangi` | **Ulangi Aksi [ ... ] kali** | Waktu & Alur | Jumlah pengulangan | `for loop` | Loop terhitung |

> **Prinsip Kausalitas Ilmiah Vulkanologi (Aturan IPA):**
> Magma yang mendesak naik ke kubah selalu menimbulkan gempa vulkanik (*volcanic tremors*). Blok `Simulasi Aktivitas Gunung Merapi` status Siaga/Awas wajib dirangkai bersama blok deteksi/simulasi getaran gempa vulkanik. Jika tidak, simulator memberi umpan balik edukatif bahwa letusan tidak terjadi secara mendadak tanpa aktivitas seismik awal.

---

## 3. STRUKTUR 50 STUDY CASES (10 QUEST TEMATIK)

Berikut adalah daftar lengkap 50 Job yang terbagi ke dalam 10 Quest terstruktur, mencakup Gempa Ringan/Sedang/Kuat, Lokasi Sekolah, Rumah, Rumah Sakit, Jembatan, Letusan Eksplosif & Efusif, serta Penentuan Jalur Evakuasi.

```
========================================================================================
KURIKULUM JOBSHEET RESQ-BOX ACTION LAB (LEVEL 3)
50 JOBS DALAM 10 QUEST TEMATIK
========================================================================================
```

### QUEST 1: FONDASI SISTEM PERINGATAN DINI & SINKRONISASI HARDWARE (Job 1 - 5)
*Fokus: Menguasai cara kerja setiap modul output fisik diorama dan prinsip dasar EWS.*
- **Job 1 (Level 1) — Inisialisasi Sistem & Sinyal Status Normal**
  - *Skenario:* Mengaktifkan sistem pemantauan diorama. Saat desa dalam kondisi aman, sistem menyalakan lampu hijau.
  - *Blok:* `Mulai Saat Dihidupkan` $\rightarrow$ `Atur Lampu Status ke [Hijau (Normal)]` $\rightarrow$ `Tampilkan Pesan di Layar Informasi ["SISTEM AKTIF: KONDISI AMAN"]`.
  - *Hardware:* RGB LED Hijau menyala, OLED menampilkan teks kesiapan.
- **Job 2 (Level 2) — Sinyal Peringatan Waspada & Siaga**
  - *Skenario:* Terjadi perubahan kondisi alam awal. Sistem harus mampu mengubah indikator visual ke warna kuning dan oranye.
  - *Blok:* Transisi lampu kuning (Waspada) dan oranye (Siaga) dengan jeda waktu.
  - *Hardware:* RGB LED berganti warna kuning $\rightarrow$ oranye.
- **Job 3 (Level 3) — Sinyal Bahaya Kritis & Sirine EWS**
  - *Skenario:* Ancaman bahaya mendadak. Sirine EWS dan lampu merah darurat harus aktif bersamaan.
  - *Blok:* `Atur Lampu Status ke [Merah (Awas)]` $\rightarrow$ `Bunyikan Sirine EWS selama [3] detik`.
  - *Hardware:* RGB LED Merah + Buzzer berbunyi nyaring.
- **Job 4 (Level 4) — Pusat Informasi Publik & Audio Pengumuman**
  - *Skenario:* Warga butuh instruksi tertulis dan suara agar tidak panik saat sirine berbunyi.
  - *Blok:* `Tampilkan Pesan di Layar Informasi ["PERINGATAN: BERSIAP EVAKUASI"]` + `Bunyikan Sirine EWS`.
  - *Hardware:* OLED menampilkan teks panduan, speaker mengeluarkan nada perhatian.
- **Job 5 (Level 5) — Uji Mandiri Semua Indikator EWS (Self-Diagnostic)**
  - *Skenario:* Petugas BPBD memeriksa seluruh aktuator sebelum musim hujan/letusan tiba (looping uji coba).
  - *Blok:* Ulangi 3 kali: Lampu Merah $\rightarrow$ Sirine 1 detik $\rightarrow$ Layar Informasi $\rightarrow$ Matikan.

---

### QUEST 2: DETEKSI FENOMENA SEISMIK & TELEMETRI DINAMIS (Job 6 - 10)
*Fokus: Memahami gelombang seismik, Skala Richter, dan respon fisik getaran.*
- **Job 6 (Level 6) — Simulasi Getaran Gempa Ringan (3.2 Skala Richter)**
  - *Skenario:* Sesar bumi kecil bergeser. Getaran hanya dirasakan beberapa warga di dalam rumah.
  - *Blok:* `Simulasi Getaran Gempa [Ringan]` $\rightarrow$ `Atur Lampu Status ke [Kuning]`.
  - *Hardware:* Motor DC bergetar pelan (PWM 20) + Speaker suara gempa berfrekuensi rendah.
  - *Web:* Gelombang Seismograf memunculkan gelombang P kecil, gauge Skala Richter menunjukkan 3.2 SR.
- **Job 7 (Level 7) — Simulasi Getaran Gempa Sedang (5.5 Skala Richter)**
  - *Skenario:* Gempa dangkal menggoyang pemukiman. Benda gantung berayun, jendela berderak.
  - *Blok:* `Simulasi Getaran Gempa [Sedang]` $\rightarrow$ `Atur Lampu Status ke [Oranye]` $\rightarrow$ `Tampilkan Pesan ["GEMPA SEDANG: TETAP TENANG"]`.
  - *Hardware:* Motor DC bergetar sedang (PWM 35) + Speaker suara gemuruh.
  - *Web:* Seismograf menunjukkan gelombang S yang jelas, Skala Richter di angka 5.5 SR.
- **Job 8 (Level 8) — Simulasi Getaran Gempa Kuat (>7.0 Skala Richter)**
  - *Skenario:* Gempa tektonik berkekuatan besar mengguncang kota. Dinding retak dan tanah bergoyang hebat.
  - *Blok:* `Simulasi Getaran Gempa [Kuat]` $\rightarrow$ `Atur Lampu Status ke [Merah]` $\rightarrow$ `Bunyikan Sirine EWS selama [5] detik`.
  - *Hardware:* Motor DC bergetar kencang (PWM 50) + Speaker suara patahan kerak bumi + Sirine.
  - *Web:* Seismograf melonjak dengan amplitudo maksimal, Skala Richter mencapai 7.2 SR.
- **Job 9 (Level 9) — Logika Otomatisasi Sirine Berdasarkan Tingkat Getaran**
  - *Skenario:* Sistem otomatis membedakan aksi: jika gempa ringan cukup beri info, jika gempa kuat wajib bunyikan sirine.
  - *Blok:* `Kalau [Tingkat Getaran Seismik == Kuat] Maka [Sirine EWS + Lampu Merah] Selain Itu [Lampu Kuning]`.
- **Job 10 (Level 10) — Analisis Gelombang Primer (P) dan Sekunder (S)**
  - *Skenario:* Mengamati jeda waktu tiba antara gelombang P (getaran awal cepat) dan gelombang S (guncangan utama perusak).
  - *Blok:* Gempa Ringan (P-wave) $\rightarrow$ Jeda 2 detik $\rightarrow$ Gempa Kuat (S-wave).

---

### QUEST 3: STUDY CASE MITIGASI GEMPA DI LINGKUNGAN SEKOLAH (Job 11 - 15)
*Fokus: Protokol keselamatan saat jam pelajaran di ruang kelas dan evakuasi gedung sekolah.*
- **Job 11 (Level 11) — Gempa Ringan Saat Jam Pelajaran Sekolah**
  - *Skenario:* Getaran ringan terasa saat ujian berlangsung di lantai 2 gedung sekolah. Guru meminta siswa tidak panik dan menjauhi jendela kaca.
  - *Blok:* `Lokasi: [Gedung Sekolah]` $\rightarrow$ `Kalau [Getaran Ringan] Maka [Lampu Kuning + Tampilkan "TETAP TENANG - JAUHI KACA"]`.
- **Job 12 (Level 12) — Protokol Perlindungan Mandiri: Drop, Cover, and Hold On**
  - *Skenario:* Gempa meningkat menjadi guncangan sedang (5.6 SR). Siswa harus segera melakukan tindakan perlindungan darurat di dalam kelas.
  - *Blok:* `Kalau [Getaran Sedang] Maka [Sirine EWS + Tampilkan "DROP - COVER - HOLD ON (BERLINDUNG DI BAWAH MEJA)"]`.
- **Job 13 (Level 13) — Gempa Kuat di Sekolah: Pemadaman Listrik Otomatis**
  - *Skenario:* Gempa kuat mengguncang sekolah. Sistem harus menyalakan alarm evakuasi darurat untuk mencegah kebakaran akibat korsleting listrik.
  - *Blok:* Gempa Kuat $\rightarrow$ Sirine EWS berulang $\rightarrow$ Lampu Merah $\rightarrow$ Tampilkan pesan evakuasi darurat.
- **Job 14 (Level 14) — Penentuan Jalur Evakuasi Sekolah Menuju Lapangan Terbuka**
  - *Skenario:* Guncangan utama reda. Ratusan siswa harus keluar kelas menuju titik kumpul tanpa saling dorong di tangga sempit.
  - *Tantangan Mitigasi:* Pilihan antara menggunakan Lift (SANGAT BAHAYA) vs Tangga Darurat Menuju Lapangan Terbuka Sekolah (BENAR).
  - *Blok:* `Tentukan Jalur Evakuasi: [Jalur Lapangan Terbuka Sekolah]` $\rightarrow$ `Tampilkan ["MENUJU LAPANGAN - JAUHI BANGUNAN TINGGI"]`.
- **Job 15 (Level 15) — Evaluasi Keselamatan Sekolah & Triase Absensi Kelas**
  - *Skenario:* Semua siswa berkumpul di lapangan terbuka sekolah. Guru memeriksa absensi dan menyalakan lampu aman setelah gedung diperiksa tim ahli BPBD.

---

### QUEST 4: STUDY CASE MITIGASI GEMPA DI PEMUKIMAN RUMAH TANGGA (Job 16 - 20)
*Fokus: Keselamatan keluarga di rumah, pemadaman kompor/gas, dan evakuasi lingkungan warga.*
- **Job 16 (Level 16) — Deteksi Gempa Malam Hari di Rumah Tinggal**
  - *Skenario:* Pukul 02.00 dini hari gempa sedang terjadi saat warga tertidur lelap. Sistem penerangan darurat otomatis harus menyala agar warga tidak panik dalam kegelapan.
  - *Blok:* `Lokasi: [Pemukiman Warga]` $\rightarrow$ `Kalau [Getaran Sedang] Maka [Lampu Darurat Menyala + Sirine Bangun Warga]`.
- **Job 17 (Level 17) — Bahaya Ikutan: Mematikan Kompor Gas & Panel Listrik**
  - *Skenario:* Gempa besar sering memicu kebakaran akibat kebocoran pipa tabung gas dan kompor yang menyala saat guncangan.
  - *Blok:* Deteksi Getaran Kuat $\rightarrow$ Tampilkan instruksi: *"MATIKAN KOMPOR & KELUAR RUMAH SEGERA"*.
- **Job 18 (Level 18) — Penentuan Jalur Evakuasi Pemukiman Menuju Titik Kumpul RT/RW**
  - *Skenario:* Gang pemukiman padat dipenuhi puing genteng jatuh dan kabel tiang listrik putus. Siswa harus memilih rute jalan lapang desa menjauhi tiang listrik.
  - *Blok:* `Tentukan Jalur Evakuasi: [Jalur Jalan Lapang Desa Menuju Titik Kumpul RT]` (Menghindari gang sempit beratap rapuh).
- **Job 19 (Level 19) — Deteksi Gempa Susulan (Aftershock Monitoring)**
  - *Skenario:* Setelah gempa pertama mereda, warga dilarang langsung masuk kembali ke dalam rumah karena struktur bangunan sudah rapuh.
  - *Blok:* Loop monitoring getaran susulan: jika getaran terulang kembali $\rightarrow$ sirine berbunyi lagi $\rightarrow$ tahan warga tetap di area terbuka.
- **Job 20 (Level 20) — Penyelamatan Warga Rentan (Lansia, Balita, & Disabilitas)**
  - *Skenario:* Mengorganisir tim relawan warga untuk mendahulukan evakuasi warga lanjut usia ke tenda posko kesehatan terpadu.

---

### QUEST 5: STUDY CASE MITIGASI GEMPA DI FASILITAS KRITIS (RS & JEMBATAN) (Job 21 - 25)
*Fokus: Pengambilan keputusan darurat pada infrastruktur vital dan bahaya likuefaksi/longsor jembatan.*
- **Job 21 (Level 21) — Gempa Kuat di Rumah Sakit Daerah**
  - *Skenario:* Ruang rawat inap RS Harapan Desa terguncang. Pasien kritis tidak boleh dievakuasi sembarangan tanpa brankar darurat.
  - *Blok:* `Lokasi: [Rumah Sakit]` $\rightarrow$ `Gempa Kuat` $\rightarrow$ `Aktifkan Sirine Triase + Lampu Merah`.
- **Job 22 (Level 22) — Penentuan Rute Khusus Akses Ambulans & Evakuasi Pasien**
  - *Skenario:* Membuka jalur bebas hambatan untuk armada ambulans keluar masuk mengangkut korban menuju lapangan helipad evakuasi.
  - *Blok:* `Tentukan Jalur Evakuasi: [Jalur Khusus Ambulans]` $\rightarrow$ `Buka Posko: [Pos Medis BPBD]`.
- **Job 23 (Level 23) — Gempa di Area Jembatan Sungai (Ancaman Likuefaksi Tanah)**
  - *Skenario:* Gempa memicu fenomena likuefaksi (tanah berpasir dekat sungai mencair dan ambles). Fondasi jembatan retak berbahaya.
  - *Blok:* `Lokasi: [Dekat Jembatan Sungai]` $\rightarrow$ Deteksi retakan tanah $\rightarrow$ Tampilkan *"JEMBATAN RETAK - JANGAN DILINTASI"*.
- **Job 24 (Level 24) — Pengalihan Rute Evakuasi Menjauhi Jembatan Rawan Runtuh**
  - *Tantangan Mitigasi:* Jalur terpendek melewati jembatan retak vs Jalur lingkar utara yang kokoh. Siswa wajib mengarahkan rute memutar yang aman.
  - *Blok:* `Tentukan Jalur Evakuasi: [Jalur Lingkar Utara (Bebas Jembatan Rusak)]`.
- **Job 25 (Level 25) — Pusat Pengendali Bencana Wilayah Terpadu (Command Center)**
  - *Skenario:* Mengintegrasikan laporan kondisi RS, jembatan, dan pemukiman ke dalam satu layar status utama BPBD.

---

### QUEST 6: KAUSALITAS VULKANOLOGI & FASE STATUS GUNUNG API (Job 26 - 30)
*Fokus: Memahami bahwa letusan gunung api selalu didahului gempa vulkanik dan kenaikan suhu kawah.*
- **Job 26 (Level 26) — Deteksi Gempa Vulkanik Dalam (Awal Kenaikan Magma)**
  - *Skenario:* Pos Pengamatan Gunung Api mendeteksi ratusan getaran gempa vulkanik dalam per hari. Ini tanda magma mulai mendesak pipa kawah.
  - *Blok:* `Simulasi Getaran Gempa [Ringan (Vulkanik)]` $\rightarrow$ `Atur Lampu Status ke [Kuning (Waspada)]`.
- **Job 27 (Level 27) — Pemantauan Suhu Termal Kawah & Pelepasan Gas Fumarol**
  - *Skenario:* Suhu kawah naik dari normal 27°C menjadi 45°C. Asap solfatara tipis mulai mengepul.
  - *Blok:* `Kalau [Suhu Kawah > 40°C] Maka [Lampu Kuning + Tampilkan "STATUS WASPADA - RADIUS 3 KM STERIL"]`.
  - *Web:* Termometer kawah menunjukkan 45°C, kepulan asap tipis muncul di kawah.
- **Job 28 (Level 28) — Tremor Menerus & Kenaikan Status ke SIAGA**
  - *Skenario:* Getaran tremor seismik berlangsung tanpa henti. Suhu kawah mencapai 70°C. Status dinaikkan menjadi SIAGA (Lampu Oranye).
  - *Blok:* Gempa Sedang Menerus + Suhu >65°C $\rightarrow$ Lampu Oranye $\rightarrow$ Tampilkan *"STATUS SIAGA - SIAPKAN TAS SIAGA BENCANA"*.
- **Job 29 (Level 29) — Pengujian Hukum Kausalitas: Larangan Letusan Tanpa Gempa**
  - *Skenario:* Menguji pemahaman siswa. Jika siswa memasang blok erupsi tanpa ada blok gempa vulkanik sebelumnya, sistem menolak simulasi dan memberi penjelasan vulkanologi.
- **Job 30 (Level 30) — Menghidupkan Asap Kawah Pertama dengan Humidifier Fisik**
  - *Skenario:* Uji coba penyemburan uap kabut asap letusan pada kawah diorama hardware menggunakan modul Mist Maker ESP32.
  - *Hardware:* `mist on` selama 3 detik, uap asap putih mengepul keluar dari lubang kawah diorama.

---

### QUEST 7: STUDY CASE LETUSAN GUNUNG API TIPE EFUSIF (LELEHAN LAVA PIJAR) (Job 31 - 35)
*Fokus: Mitigasi letusan bertipe lelehan kubah lava cair yang mengalir perlahan menuruni alur sungai.*
- **Job 31 (Level 31) — Karakteristik Letusan Efusif (Tekanan Gas Rendah, Magma Basaltik)**
  - *Skenario:* Kubah lava Gunung Merapi runtuh perlahan. Terjadi guguran lava pijar yang merayap menuruni lereng tanpa ledakan besar.
  - *Blok:* `Simulasi Aktivitas Gunung Merapi: [Siaga, Tipe: Efusif]` $\rightarrow$ `Lampu Oranye`.
  - *Web:* Simulator menampilkan lelehan lava oranye-merah yang merayap turun di alur Kali Boyong.
- **Job 32 (Level 32) — Pemetaan Alur Bahaya Aliran Lava Pijar di Bantaran Sungai**
  - *Skenario:* Lava pijar bersuhu >800°C mengalir mengikuti lembah sungai. Pemukiman yang berada di tepi sungai berada dalam zona bahaya tinggi.
  - *Blok:* Pantau lokasi sungai $\rightarrow$ Tampilkan instruksi: *"ZONA BAHAYA LAVA: KOSONGKAN BANTARAN SUNGAI DALAM RADIUS 500 METER"*.
- **Job 33 (Level 33) — Sistem Peringatan Dini Bantaran Sungai (Sirine Berkala)**
  - *Skenario:* Mengaktifkan sirine berkala untuk mengingatkan penambang pasir dan warga pinggir kali agar segera naik ke tempat tinggi.
  - *Blok:* Ulangi 3 kali: Sirine 2 detik $\rightarrow$ Jeda 2 detik $\rightarrow$ Lampu Oranye berkedip.
- **Job 34 (Level 34) — Penentuan Jalur Evakuasi Efusif: Menghindari Lembah Sungai ke Dataran Tinggi**
  - *Tantangan Mitigasi:* Siswa memilih rute evakuasi warga lereng:
    - *Pilihan 1 (Salah):* Menyusuri jalan setapak pinggir kali (Terancam panas lava pijar).
    - *Pilihan 2 (Benar):* Menanjak ke punggung bukit dataran tinggi menjauhi sungai menuju Barak KRB I.
  - *Blok:* `Tentukan Jalur Evakuasi: [Jalur Lingkar Bukit Bebas Alur Sungai]`.
- **Job 35 (Level 35) — Bahaya Lahar Dingin Saat Terjadi Hujan di Puncak Gunung**
  - *Skenario:* Hujan deras di puncak gunung menyapu jutaan meter kubik material endapan lava menjadi banjir lahar dingin yang dahsyat di sungai.

---

### QUEST 8: STUDY CASE LETUSAN GUNUNG API TIPE EKSPLOSIF (LEDAKAN & ABU) (Job 36 - 40)
*Fokus: Mitigasi letusan dahsyat bertekanan tinggi dengan lontaran batu, awan panas, dan kolom abu vulkanik.*
- **Job 36 (Level 36) — Karakteristik Letusan Eksplosif (Tekanan Gas Dahsyat, Awan Panas)**
  - *Skenario:* Tekanan gas magma andesitik mendobrak sumbat lava! Terjadi dentuman dahsyat, semburan kolom abu setinggi 5 km, dan awan panas (*wedhus gembel*).
  - *Blok:* `Simulasi Aktivitas Gunung Merapi: [Awas, Tipe: Eksplosif]` $\rightarrow$ `Lampu Merah` $\rightarrow$ `Sirine EWS Berkelanjutan`.
  - *Hardware:* Mist Maker menyembur kencang terus menerus, Buzzer berbunyi sirine darurat, Speaker gemuruh dentuman.
  - *Web:* Semburan partikel abu tebal vertikal, proyektil batu piroklastik meluncur keluar, kawah membara.
- **Job 37 (Level 37) — Peringatan Awan Panas Piroklastik (Kecepatan Luncur 200 km/jam)**
  - *Skenario:* Awan panas bergulung turun menuruni lereng dengan suhu 600°C. Tidak ada waktu berpikir lama, evakuasi harus dilakukan dalam hitungan detik!
  - *Blok:* Status Awas Eksplosif $\rightarrow$ Tampilkan *"AWAS AWAN PANAS - EVAKUASI KILAT SEKARANG!"*.
- **Job 38 (Level 38) — Bahaya Hujan Abu Vulkanik & Pemakaian APD (Masker & Kacamata)**
  - *Skenario:* Hujan abu silika tajam melanda pemukiman. Jika dihirup dapat menyebabkan infeksi saluran pernapasan (ISPA).
  - *Blok:* Tampilkan panduan mitigasi: *"PAKAI MASKER BASAH & KACAMATA PELINDUNG - MASUK KENDARAAN TERTUTUP"*.
- **Job 39 (Level 39) — Penentuan Jalur Evakuasi Eksplosif: Menjauhi Arah Angin Abu Vulkanik**
  - *Tantangan Mitigasi:* Angin bertiup ke arah Timur membawa abu pekat. Jalur mana yang harus dipilih?
    - *Jalur Timur (Salah):* Terjebak jarak pandang nol dan hujan abu pekat.
    - *Jalur Barat / Selatan (Benar):* Menjauhi arah sebaran abu menuju Barak KRB I.
  - *Blok:* `Tentukan Jalur Evakuasi: [Jalur Lingkar Barat Menjauhi Angin Abu]`.
- **Job 40 (Level 40) — Pensterilan Radius Bahaya 10 KM (Zona Merah KRB III)**
  - *Skenario:* Memastikan seluruh desa di lingkar lereng atas kosong total dan seluruh pintu gerbang pembatas dijaga ketat tim SAR.

---

### QUEST 9: PENENTUAN JALUR EVAKUASI TERPADU & MANAJEMEN POSKO (Job 41 - 45)
*Fokus: Mengintegrasikan rute peta diorama, zona KRB, dan manajemen barak pengungsian.*
- **Job 41 (Level 41) — Membaca Zona Kawasan Rawan Bencana (KRB III, II, dan I)**
  - *Skenario:* Mengenal peta zonasi resmi PVMBG pada diorama: KRB III (Paling bahaya/harus kosong), KRB II (Waspada lontaran batu), KRB I (Aman untuk pengungsian).
  - *Blok:* Tampilkan status zonasi tiap wilayah pada peta diorama.
- **Job 42 (Level 42) — Penentuan Jalur Evakuasi Utama vs Jalur Terjepit Alur Sungai**
  - *Skenario:* Terjadi kepanikan warga. Dua rute terlihat di peta: Rute pintas lembah sungai vs Rute utama jalan raya aspal. Siswa merakit blok keputusan navigasi aman.
  - *Blok:* `Kalau [Status == Awas] Maka [Tentukan Jalur Evakuasi: Jalur Utama Bebas Lahar] Selain Itu [Jalur Pantauan]`.
- **Job 43 (Level 43) — Aktivasi Barak Pengungsian Terpadu (KRB I)**
  - *Skenario:* Menyiapkan tenda pleton BPBD, dapur umum TAGANA, dan tandon air bersih di area aman KRB I.
  - *Blok:* `Buka Posko: [Barak Pengungsian Terpadu KRB I]` $\rightarrow$ `Tampilkan Pesan ["BARAK PENGUNGSIAN TERPADU SIAP"]`.
  - *Web:* Tenda barak pengungsian di simulator menyala hijau terang menyambut warga yang tiba.
- **Job 44 (Level 44) — Pembagian Jalur Khusus Logistik Bantuan & Dapur Umum**
  - *Skenario:* Truk pengangkut sembako dan mobil tangki air bersih harus melalui rute yang tidak bertabrakan dengan arus warga yang sedang mengungsi.
- **Job 45 (Level 45) — Simulasi Waktu Tanggap Evakuasi (Response Time Challenge)**
  - *Skenario:* Mengukur kecepatan respon sistem. Berapa detik waktu yang dibutuhkan sejak sirine berbunyi hingga 100% warga berhasil tiba di barak aman?

---

### QUEST 10: PROYEK AKHIR TANGGAP DARURAT TERPADU (GRAND MISSION) (Job 46 - 50)
*Fokus: Ujian kompetensi komprehensif memadukan multi-bencana dan pengambilan keputusan tingkat tinggi (HOTS).*
- **Job 46 (Level 46) — Bencana Ganda: Gempa Kuat Memicu Letusan Efusif Merapi**
  - *Skenario:* Gempa tektonik 6.5 SR meretakkan lereng Merapi, memicu runtuhnya kubah lava dan aliran lahar panas secara bersamaan!
  - *Tantangan:* Merakit deteksi guncangan gempa $\rightarrow$ bunyikan sirine gempa $\rightarrow$ evakuasi warga dari bangunan rapuh $\rightarrow$ arahkan menjauhi sungai lahar.
- **Job 47 (Level 47) — Erupsi Eksplosif Malam Hari Disertai Pemadaman Listrik Kota**
  - *Skenario:* Listrik gardu utama padam total akibat sambaran petir vulkanik. Sistem darurat RESQ-BOX mengambil alih kendali otomatis.
  - *Tantangan:* Lampu cadangan menyala $\rightarrow$ Sirine EWS meraung $\rightarrow$ Tampilkan teks petunjuk arah evakuasi pada layar OLED.
- **Job 48 (Level 48) — Pengalihan Jalur Evakuasi Dinamis Saat Jalur Utama Tertutup Longsor**
  - *Skenario:* Saat evakuasi berlangsung, jalur utama barat tertimbun longsor tanah. Sistem harus mendeteksi sumbatan jalan dan mengalihkan warga ke rute darurat timur.
  - *Tantangan:* Logika kondisi percabangan: `Kalau [Jalur Utama Terputus] Maka [Alihkan ke Jalur Alternatif Timur]`.
- **Job 49 (Level 49) — Otomasi Pusat Pengendali Operasi (PUSDALOPS BPBD)**
  - *Skenario:* Merancang sistem cerdas yang mengoordinasikan seluruh desa: memantau sensor seismograf, suhu kawah, status RGB, sirine, hingga validasi keselamatan warga di barak.
- **Job 50 (Level 50) — Tantangan Akhir: "Zero Victim Hero Challenge"**
  - *Skenario Puncak:* Siswa dihadapkan pada skenario nyata bencana dahsyat tanpa petunjuk blok (unassisted challenge). Siswa harus menerapkan seluruh prinsip mitigasi sains, memilih jalur evakuasi yang tepat, dan menyelamatkan 100% warga desa tanpa ada korban jiwa.
  - *Validasi:* Hardware diorama menyala sempurna (Motor getar, mist asap, RGB merah, sirine, OLED menampilkan "MISI LULUS: ZERO VICTIM").

---

## 4. LEMBAR KERJA PESERTA DIDIK (LKPD) & PANDUAN PENGUJIAN

Untuk setiap Quest, Jobsheet menyediakan:
1. **Tabel Data Pengamatan Hardware & Simulator**:
   - Parameter input yang dirakit.
   - Respon fisik hardware (warna LED, getaran motor, asap mist, suara speaker).
   - Indikator telemetri web (Skala Richter, Suhu °C, Bentuk Gelombang Seismograf).
2. **Evaluasi Jalur Evakuasi**:
   - Analisis mengapa jalur bantaran sungai berbahaya.
   - Analisis arah angin dan sebaran material piroklastik.
3. **Pertanyaan Refleksi HOTS (Higher Order Thinking Skills)**:
   - *Contoh HOTS 1:* "Mengapa letusan tipe eksplosif membutuhkan radius sterilisasi wilayah yang jauh lebih luas daripada letusan efusif?"
   - *Contoh HOTS 2:* "Jika kamu menjadi komandan BPBD, faktor apa saja yang kamu pertimbangkan sebelum memutuskan membunyikan sirine evakuasi massal agar tidak memicu kepanikan buta?"

---

## 5. LANGKAH IMPLEMENTASI KODE BERIKUTNYA

1. **Memperbarui Definisi Blok Blockly (`src/engine/blockly/blocks/core.ts`)**:
   - Mendaftarkan blok baru: `resq_tipe_letusan`, `resq_jalur_evakuasi`, `resq_lokasi_mitigasi`, `resq_posko`.
   - Memutakhirkan opsi pada `resq_gempa_sim` dan `resq_gunung_sim`.
   - Menghapus blok kipas, pintu servo, dan tombol 1 & 2.
2. **Memperbarui Generator JavaScript (`src/engine/blockly/jsGenerator.ts`)**:
   - Menghasilkan kode panggilan API simulasi yang mendukung pemilihan jalur evakuasi dan tipe letusan.
3. **Memperbarui Telemetri UI (`SensorPanel.tsx` $\rightarrow$ `TelemetryPanel.tsx`)**:
   - Mengganti slider manual dengan Canvas Seismograf bergerak, Richter Gauge, dan Termometer Kawah digital.
4. **Memperbarui Data Misi (`src/missions/data/missions.ts`)**:
   - Memasukkan dataset 50 misi / Jobsheet ke dalam store Level 3 sehingga siswa dapat memilih dan menyelesaikan setiap level secara interaktif.
