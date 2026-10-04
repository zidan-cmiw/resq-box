# -*- coding: utf-8 -*-
"""
Generator for all 50 Jobs in RESQ-BOX Level 3 (Action Lab).
Matches the curriculum in JOBSHEET_IMPLEMENTATION_PLAN.md.
"""
import json

output_ts_path = r"c:\github\lidm buatan vincent\RESQ-BOX\src\missions\data\missions.ts"

# Categories
CATEGORIES = [
  { "id": "pengenalan", "title": "Fondasi EWS & Seismik", "icon": "school", "missions": 10 },
  { "id": "gempa", "title": "Mitigasi Gempa Bumi", "icon": "landslide", "missions": 15 },
  { "id": "gunung", "title": "Vulkanologi & Erupsi Merapi", "icon": "volcano", "missions": 15 },
  { "id": "proyek", "title": "Jalur Evakuasi & Grand Mission", "icon": "emoji_objects", "missions": 10 },
]

# Generate 50 jobs
jobs = []

def add_job(jid, cat, lvl, title, scenario, objective, hint, steps, req_blocks, code_contains):
    jobs.append({
        "id": jid,
        "category": cat,
        "level": lvl,
        "title": title,
        "icon": "school" if cat == "pengenalan" else ("landslide" if cat == "gempa" else ("volcano" if cat == "gunung" else "emoji_objects")),
        "scenario": scenario,
        "objective": objective,
        "hint": hint,
        "steps": [
            {"title": s[0], "description": s[1], "icon": s[2], "tip": s[3] if len(s) > 3 else None}
            for s in steps
        ],
        "validation": {
            "requiredBlocks": req_blocks,
            "codeContains": code_contains,
            "ancestorConstraints": {b: "resq_program" for b in req_blocks if b != "resq_program"}
        }
    })

# ── QUEST 1: FONDASI SISTEM PERINGATAN DINI & HARDWARE (Job 1 - 5)
add_job(
    "job_01", "pengenalan", 1, "Job 1: Sinyal Status Normal",
    "Sistem pemantauan baru dipasang di Pos Pengamatan. Saat kondisi aman, sistem menyalakan Lampu Status Hijau sebagai tanda bahwa sistem aktif dan kondisi normal.",
    "Gunakan blok Sistem Mitigasi untuk menyalakan Lampu Status Hijau (Aman).",
    "Buka kategori Peringatan & EWS, ambil blok 'Atur Lampu Status ke [Aman (Hijau)]', lalu masukkan ke dalam 'Mulai Saat Dihidupkan'.",
    [
        ("Kenali Misimu", "Pasang indikator kesiapan sistem mitigasi pertama. Warga desa perlu melihat lampu hijau menyala tenang!", "school"),
        ("Pilih Blok", "Cari Peringatan & EWS -> 'Atur Lampu Status ke [Aman (Hijau)]'.", "inventory_2"),
        ("Susun Blok", "Seret ke dalam kotak Mulai Saat Dihidupkan di blok Sistem Mitigasi.", "extension"),
        ("Jalankan & Validasi", "Klik tombol MULAI, periksa indikator lampu berubah hijau, lalu klik Validasi Misi!", "rocket_launch")
    ],
    ["resq_program", "resq_lampu_status"], ["api.setRgb"]
)

add_job(
    "job_02", "pengenalan", 2, "Job 2: Sinyal Waspada & Siaga",
    "Perubahan aktivitas alam mulai terdeteksi. Petugas harus mampu mengubah warna lampu status ke Kuning (Waspada) lalu Oranye (Siaga) secara bertahap.",
    "Ganti lampu status ke Kuning, beri jeda 2 detik, lalu ganti ke Oranye.",
    "Gunakan blok 'Jeda Waktu' dari kategori Sistem di antara dua blok pengaturan lampu status.",
    [
        ("Sinyal Bertahap", "Tingkat status bahaya bencana memiliki 4 level: Normal, Waspada, Siaga, dan Awas.", "school"),
        ("Kumpulkan Blok", "Ambil 2x Lampu Status (Kuning & Oranye) dan 1x Jeda Waktu 2 detik.", "inventory_2"),
        ("Susun Urutan", "Rangkai: Lampu Status Kuning -> Jeda Waktu 2 detik -> Lampu Status Oranye.", "extension"),
        ("Uji Transisi", "Jalankan simulasi dan amati perubahan warna lampu indikator di panel telemetri.", "rocket_launch")
    ],
    ["resq_program", "resq_lampu_status", "resq_tunggu"], ["api.setRgb", "api.delay"]
)

add_job(
    "job_03", "pengenalan", 3, "Job 3: Sinyal Bahaya Kritis & Sirine EWS",
    "Kondisi darurat terjadi! Sistem harus menyalakan Lampu Merah (Awas) dan membunyikan Sirine Peringatan Dini (EWS) selama 3 detik untuk memperingatkan warga.",
    "Nyalakan Lampu Status Merah dan bunyikan Sirine EWS selama 3 detik.",
    "Ambil blok 'Bunyikan Sirine EWS selama 3 detik' dari kategori Peringatan & EWS.",
    [
        ("Alarm Darurat", "Sirine EWS dan lampu merah adalah kombinasi audio-visual terpenting dalam evakuasi cepat.", "school"),
        ("Pilih Blok", "Ambil Lampu Status Merah dan Bunyikan Sirine EWS selama 3 detik.", "inventory_2"),
        ("Pasang di Sistem", "Masukkan kedua blok ke dalam Mulai Saat Dihidupkan.", "extension"),
        ("Bunyikan Sirine", "Tekan MULAI dan dengarkan bunyi sirine EWS aktif bersama lampu merah!", "rocket_launch")
    ],
    ["resq_program", "resq_lampu_status", "resq_sirine_ews"], ["api.setRgb", "api.setBuzzer"]
)

add_job(
    "job_04", "pengenalan", 4, "Job 4: Pusat Informasi Publik (Layar OLED)",
    "Saat sirine berbunyi, warga seringkali panik karena tidak tahu apa yang terjadi. Sistem harus menampilkan instruksi jelas pada Layar Informasi Publik (OLED).",
    "Kirim pesan instruksi evakuasi ke Layar Informasi OLED.",
    "Gunakan blok 'Tampilkan di Layar Informasi' dari kategori Sistem dan ketik instruksi evakuasi.",
    [
        ("Papan Informasi", "Layar OLED SSD1306 di diorama berfungsi sebagai papan pengumuman digital bagi masyarakat desa.", "school"),
        ("Pilih Blok", "Ambil Sistem -> 'Tampilkan di Layar Informasi', lalu ketik pesan mitigasi.", "inventory_2"),
        ("Rangkai Pesan", "Masukkan ke dalam Mulai Saat Dihidupkan bersama status lampu siaga.", "extension"),
        ("Cek Tampilan", "Jalankan simulasi dan baca teks pada kotak monitor OLED biru di panel telemetri!", "rocket_launch")
    ],
    ["resq_program", "resq_layar_oled"], ["api.setOledMessage"]
)

add_job(
    "job_05", "pengenalan", 5, "Job 5: Uji Mandiri Semua Indikator (Diagnostic)",
    "Sebelum musim penghujan dan ancaman letusan tiba, tim BPBD melakukan pengujian mandiri berkala pada seluruh alarm dan lampu sebanyak 3 kali pengulangan.",
    "Gunakan blok 'Ulangi Aksi 3 kali' untuk membunyikan sirine dan menyalakan lampu secara berkala.",
    "Masukkan Sirine EWS dan Jeda Waktu ke dalam blok 'Ulangi Aksi 3 kali'.",
    [
        ("Loop Uji Coba", "Pengulangan otomatis memastikan seluruh sistem peringatan bekerja tanpa macet.", "school"),
        ("Gunakan Loop", "Ambil Sistem -> 'Ulangi Aksi [3] kali', lalu masukkan aksi sirine dan lampu di dalamnya.", "inventory_2"),
        ("Rakit Pengujian", "Pastikan blok berada di dalam loop pengulangan.", "extension"),
        ("Uji Siklus", "Tekan MULAI dan saksikan alarm berulang 3 kali secara otomatis!", "rocket_launch")
    ],
    ["resq_program", "resq_ulangi", "resq_sirine_ews"], ["for (let", "api.setBuzzer"]
)

# ── QUEST 2: DETEKSI FENOMENA SEISMIK & TELEMETRI DINAMIS (Job 6 - 10)
add_job(
    "job_06", "pengenalan", 6, "Job 6: Simulasi Gempa Ringan (3.2 SR)",
    "Sesar lokal bergerak perlahan. Sensor mencatat getaran mikroseismik berkekuatan 3.2 Skala Richter. Simulasikan fenomena ini dan nyalakan lampu waspada.",
    "Aktifkan Simulasi Getaran Gempa tingkat Ringan dan atur status ke Waspada.",
    "Ambil blok 'Simulasi Getaran Gempa [Ringan (3-4 SR)]' dari kategori Simulasi Bencana.",
    [
        ("Getaran Pertama", "Gempa bumi ringan biasanya hanya menggetarkan jendela dan dirasakan orang yang diam.", "school"),
        ("Pilih Blok", "Ambil Simulasi Bencana -> 'Simulasi Getaran Gempa [Ringan (3-4 SR)]' dan Lampu Status Kuning.", "inventory_2"),
        ("Pasang di Sistem", "Letakkan di dalam Mulai Saat Dihidupkan.", "extension"),
        ("Lihat Seismograf", "Jalankan dan amati grafik Seismograf melonjak dengan gelombang P kecil serta Skala Richter 3.4 SR!", "rocket_launch")
    ],
    ["resq_program", "resq_gempa_sim", "resq_lampu_status"], ["api.simGempa(1)"]
)

add_job(
    "job_07", "pengenalan", 7, "Job 7: Simulasi Gempa Sedang (5.5 SR)",
    "Guncangan gempa sedang berkekuatan 5.5 SR melanda. Di hardware, motor getar bergetar sedang dan audio gempa bergemuruh. Layar OLED memberi peringatan tetap tenang.",
    "Aktifkan Simulasi Getaran Gempa tingkat Sedang dan tampilkan pesan tetap tenang di OLED.",
    "Gunakan Simulasi Getaran Gempa [Sedang (5-6 SR)] dan blok Layar Informasi.",
    [
        ("Guncangan Sedang", "Benda-benda gantung berayun kuat dan perabot bergeser pada gempa 5.5 SR.", "school"),
        ("Rakit Simulasi", "Ambil Simulasi Bencana -> 'Simulasi Getaran Gempa [Sedang (5-6 SR)]' dan Sistem -> 'Tampilkan di Layar Informasi'.", "inventory_2"),
        ("Periksa Telemetri", "Amati amplitudo Seismograf membesar menjadi gelombang S yang rapat.", "extension"),
        ("Validasi", "Klik Validasi setelah simulasi berjalan sempurna.", "rocket_launch")
    ],
    ["resq_program", "resq_gempa_sim", "resq_layar_oled"], ["api.simGempa(2)"]
)

add_job(
    "job_08", "pengenalan", 8, "Job 8: Simulasi Gempa Kuat (>7.0 SR)",
    "Gempa tektonik destruktif berkekuatan >7.0 Skala Richter mengguncang! Motor getar diorama bergetar maksimal, sirine EWS meraung, dan lampu darurat merah menyala!",
    "Aktifkan Simulasi Gempa Kuat bersama Lampu Status Merah dan Sirine EWS.",
    "Gunakan Simulasi Gempa Kuat (>7 SR) + Lampu Merah + Sirine EWS.",
    [
        ("Guncangan Hebat", "Gempa di atas 7 SR dapat meretakkan dinding dan meruntuhkan struktur bangunan yang rapuh.", "school"),
        ("Susun Tanggap Darurat", "Gabungkan Simulasi Gempa Kuat, Lampu Status Merah, dan Sirine EWS.", "inventory_2"),
        ("Amati Puncak Gelombang", "Seismograf akan menunjukkan lonjakan amplitudo merah maksimal!", "extension"),
        ("Validasi Hasil", "Periksa bahwa Skala Richter mencapai level 7.4 SR di monitor telemetri.", "rocket_launch")
    ],
    ["resq_program", "resq_gempa_sim", "resq_sirine_ews", "resq_lampu_status"], ["api.simGempa(3)"]
)

add_job(
    "job_09", "pengenalan", 9, "Job 9: Logika Otomatisasi Sirine Berdasarkan Getaran",
    "Tidak semua getaran memerlukan sirine keras agar warga tidak panik. Buat logika: Kalau getaran terdeteksi kuat, bunyikan sirine; selain itu cukup nyalakan lampu aman.",
    "Gunakan blok 'Kalau... Selain Itu' dengan kondisi 'Gempa Terdeteksi Kuat?'.",
    "Buka Pengambilan Keputusan untuk blok Kalau... Selain Itu, dan Pemantauan Alam untuk kondisi getaran kuat.",
    [
        ("Logika Keputusan", "Sistem cerdas harus mampu mengambil keputusan secara otomatis berdasarkan ambang batas sensor.", "school"),
        ("Susun Kondisi", "Kalau: 'Gempa Terdeteksi Kuat?' -> Maka: Sirine EWS + Lampu Merah -> Selain Itu: Lampu Hijau.", "inventory_2"),
        ("Pasang di Loop", "Letakkan logika ini di dalam Jalankan Terus-Menerus.", "extension"),
        ("Uji Logika", "Jalankan simulasi dan uji respons logikanya.", "rocket_launch")
    ],
    ["resq_program", "resq_jika_tidak", "resq_getar_kuat", "resq_sirine_ews"], ["if (", "api.setBuzzer"]
)

add_job(
    "job_10", "pengenalan", 10, "Job 10: Analisis Gelombang Primer (P) dan Sekunder (S)",
    "Dalam seismologi, gelombang primer (P-wave) merambat lebih cepat dari gelombang sekunder (S-wave). Rancang simulasi yang memunculkan getaran ringan (P) lalu 2 detik kemudian guncangan kuat (S).",
    "Susun simulasi gempa ringan, jeda waktu 2 detik, lalu simulasi gempa kuat.",
    "Rangkai: Gempa Ringan -> Jeda 2 detik -> Gempa Kuat.",
    [
        ("Fisika Seismik", "Jeda antara gelombang P dan S adalah jendela emas bagi sistem EWS untuk memberi peringatan dini.", "school"),
        ("Rakit Urutan Gelombang", "1. Simulasi Gempa Ringan -> 2. Jeda Waktu 2 detik -> 3. Simulasi Gempa Kuat -> 4. Sirine EWS.", "inventory_2"),
        ("Perhatikan Seismograf", "Lihat transisi bentuk gelombang dari P kecil menjadi S lonjakan tajam pada canvas seismograf!", "extension"),
        ("Validasi Misi", "Klik Validasi jika urutan gelombang telah teruji.", "rocket_launch")
    ],
    ["resq_program", "resq_gempa_sim", "resq_tunggu"], ["api.simGempa(1)", "api.simGempa(3)"]
)

# ── QUEST 3: STUDY CASE MITIGASI GEMPA DI SEKOLAH (Job 11 - 15)
add_job(
    "job_11", "gempa", 11, "Job 11: Gempa Ringan Saat Jam Pelajaran",
    "Getaran ringan terasa saat jam pelajaran di lantai 2 gedung sekolah. Guru meminta siswa tidak panik dan menjauhi jendela kaca.",
    "Atur lokasi ke Gedung Sekolah, jalankan gempa ringan, dan tampilkan pesan tetap tenang.",
    "Gunakan blok Lokasi Kejadian [Gedung Sekolah], Gempa Ringan, dan Layar Informasi.",
    [
        ("Situasi Sekolah", "Siswa sedang belajar saat lantai bergetar halus. Kepanikan harus dicegah sejak awal!", "school"),
        ("Pilih Lokasi & Gempa", "Ambil Simulasi Bencana -> Lokasi: Gedung Sekolah dan Simulasi Gempa Ringan.", "inventory_2"),
        ("Kirim Pesan", "Tampilkan di Layar Informasi: 'TETAP TENANG - JAUHI KACA'.", "extension"),
        ("Uji Respon", "Jalankan simulasi dan pastikan pesan terbaca jelas.", "rocket_launch")
    ],
    ["resq_program", "resq_lokasi_mitigasi", "resq_gempa_sim", "resq_layar_oled"], ["api.setLocation", "api.simGempa(1)"]
)

add_job(
    "job_12", "gempa", 12, "Job 12: Protokol Drop, Cover, and Hold On",
    "Guncangan gempa meningkat menjadi kekuatan sedang (5.6 SR). Seluruh siswa wajib segera melakukan tindakan perlindungan diri di bawah meja kokoh!",
    "Aktifkan gempa sedang, bunyikan sirine EWS, dan tampilkan instruksi 'DROP COVER HOLD ON'.",
    "Gunakan Simulasi Gempa Sedang, Sirine EWS, dan Layar Informasi.",
    [
        ("SOP Gempa", "Drop (berlutut), Cover (lindungi kepala & leher di bawah meja), Hold on (pegang kaki meja kokoh).", "school"),
        ("Rakit SOP", "Pasang: Simulasi Gempa Sedang -> Sirine EWS 2 detik -> Tampilkan 'DROP COVER HOLD ON'.", "inventory_2"),
        ("Cek Respon", "Pastikan sirine berbunyi dan panduan mitigasi muncul di monitor.", "extension"),
        ("Validasi", "Klik tombol Validasi Misi.", "rocket_launch")
    ],
    ["resq_program", "resq_gempa_sim", "resq_sirine_ews", "resq_layar_oled"], ["api.simGempa(2)", "api.setBuzzer"]
)

add_job(
    "job_13", "gempa", 13, "Job 13: Gempa Kuat di Sekolah & Alarm Evakuasi",
    "Gempa kuat meretakkan dinding sekolah. Sirine alarm evakuasi harus meraung berulang agar seluruh gedung segera dikosongkan.",
    "Aktifkan gempa kuat dan bunyikan Alarm Darurat evakuasi berulang.",
    "Gunakan Simulasi Gempa Kuat dan blok Alarm Evakuasi dari Peringatan & EWS.",
    [
        ("Evakuasi Gedung", "Setelah guncangan hebat, seluruh penghuni gedung sekolah harus bersiap dievakuasi keluar.", "school"),
        ("Kumpulkan Blok", "Ambil Simulasi Gempa Kuat dan Alarm Evakuasi 3 kali.", "inventory_2"),
        ("Rangkai", "Pasang di dalam Mulai Saat Dihidupkan.", "extension"),
        ("Validasi", "Jalankan dan amati sirine serta lampu darurat menyala sinkron.", "rocket_launch")
    ],
    ["resq_program", "resq_gempa_sim", "resq_alarm_darurat"], ["api.simGempa(3)"]
)

add_job(
    "job_14", "gempa", 14, "Job 14: Penentuan Jalur Evakuasi Lapangan Sekolah",
    "Guncangan utama reda. Siswa harus keluar kelas menuju titik kumpul tanpa saling dorong. Pilih jalur evakuasi aman menuju Lapangan Terbuka Sekolah!",
    "Pilih 'Jalur Lapangan Terbuka' dan buka titik kumpul lapangan.",
    "Gunakan blok 'Tentukan Jalur Evakuasi ke [Jalur Lapangan Terbuka]' dan 'Buka Posko [Titik Kumpul Lapangan]'.",
    [
        ("Pilihan Evakuasi", "Jangan menggunakan lift! Gunakan tangga darurat dan menuju lapangan terbuka jauh dari tiang & pohon tinggi.", "school"),
        ("Pilih Rute", "Ambil Aksi & Evakuasi -> Tentukan Jalur Evakuasi: Jalur Lapangan Terbuka.", "inventory_2"),
        ("Buka Titik Kumpul", "Tambahkan Buka Posko: Titik Kumpul Lapangan.", "extension"),
        ("Cek Rute", "Jalankan simulasi dan amati rute evakuasi di panel telemetri berubah hijau aman!", "rocket_launch")
    ],
    ["resq_program", "resq_jalur_evakuasi", "resq_posko"], ["api.setEvacRoute", "api.setActiveShelter"]
)

add_job(
    "job_15", "gempa", 15, "Job 15: Evaluasi Keselamatan Sekolah & Absensi",
    "Seluruh siswa telah berkumpul di lapangan terbuka sekolah. Guru memastikan semua siswa selamat dan menyalakan lampu status aman.",
    "Tampilkan pesan 'SEMUA SISWA SELAMAT DI LAPANGAN' dan nyalakan Lampu Status Hijau.",
    "Gunakan blok Layar Informasi dan Lampu Status Hijau.",
    [
        ("Hitung Jumlah Siswa", "Ketua kelas dan guru menghitung absensi untuk memastikan tidak ada siswa tertinggal di dalam kelas.", "school"),
        ("Kirim Laporan", "Tampilkan di Layar Informasi: 'SEMUA SISWA LENGKAP & AMAN'.", "inventory_2"),
        ("Status Aman", "Nyalakan Lampu Status Hijau.", "extension"),
        ("Selesai Quest Sekolah", "Validasi misi untuk menuntaskan bab mitigasi sekolah!", "rocket_launch")
    ],
    ["resq_program", "resq_layar_oled", "resq_lampu_status"], ["api.setOledMessage", "api.setRgb('green')"]
)

# ── QUEST 4: STUDY CASE MITIGASI GEMPA DI PEMUKIMAN (Job 16 - 20)
add_job(
    "job_16", "gempa", 16, "Job 16: Deteksi Gempa Malam Hari di Pemukiman",
    "Pukul 02.00 dini hari gempa sedang terjadi saat warga tertidur lelap. Sistem penerangan darurat otomatis harus menyala agar warga tidak panik dalam kegelapan.",
    "Atur lokasi ke Pemukiman Warga, aktifkan gempa sedang, dan nyalakan lampu darurat.",
    "Gunakan Lokasi: Pemukiman Warga, Gempa Sedang, dan Lampu Status Kuning.",
    [
        ("Gempa Malam Hari", "Kegelapan malam memperparah kepanikan. Lampu darurat otomatis membantu warga mencari jalan keluar.", "school"),
        ("Rakit Skenario", "Pasang Lokasi: Pemukiman Warga -> Gempa Sedang -> Lampu Status Kuning.", "inventory_2"),
        ("Tampilkan Info", "Kirim pesan: 'GEMPA TERDETEKSI - BANGUN DENGAN TENANG'.", "extension"),
        ("Validasi", "Uji coba dan validasi misi.", "rocket_launch")
    ],
    ["resq_program", "resq_lokasi_mitigasi", "resq_gempa_sim", "resq_lampu_status"], ["api.setLocation", "api.simGempa(2)"]
)

add_job(
    "job_17", "gempa", 17, "Job 17: Bahaya Sekunder: Pemadaman Kompor & Gas",
    "Gempa bumi sering memicu kebakaran hebat akibat kebocoran pipa gas dan kompor yang menyala saat guncangan. Buat peringatan untuk mematikan kompor segera.",
    "Jika gempa terdeteksi, tampilkan peringatan 'MATIKAN KOMPOR & LISTRIK' dan bunyikan sirine EWS.",
    "Gunakan Gempa Sedang, Sirine EWS, dan Layar Informasi.",
    [
        ("Bahaya Sekunder", "Kebakaran pasca-gempa seringkali menelan korban lebih banyak daripada guncangan itu sendiri.", "school"),
        ("Peringatan Kompor", "Tampilkan instruksi darurat: 'MATIKAN KOMPOR GAS & PANEL LISTRIK'.", "inventory_2"),
        ("Bunyikan Alarm", "Nyalakan sirine EWS selama 3 detik.", "extension"),
        ("Validasi Misi", "Tekan MULAI dan klik Validasi Misi.", "rocket_launch")
    ],
    ["resq_program", "resq_gempa_sim", "resq_sirine_ews", "resq_layar_oled"], ["api.simGempa", "api.setOledMessage"]
)

add_job(
    "job_18", "gempa", 18, "Job 18: Penentuan Jalur Evakuasi Jalan Lapang RT",
    "Gang sempit pemukiman padat dipenuhi puing genteng jatuh dan kabel putus. Warga harus diarahkan melalui jalan lapang menuju lapangan balai RW.",
    "Tentukan jalur evakuasi ke Jalur Lapangan Terbuka dan arahkan ke balai desa.",
    "Gunakan blok 'Tentukan Jalur Evakuasi ke [Jalur Lapangan Terbuka]'.",
    [
        ("Gang Padat Bahaya", "Genteng jatuh, pecahan kaca jendela, dan tembok pagar rentan roboh saat gempa di gang sempit.", "school"),
        ("Pilih Rute Lapang", "Ambil Tentukan Jalur Evakuasi: Jalur Lapangan Terbuka.", "inventory_2"),
        ("Hubungkan Posko", "Tambahkan Buka Posko: Titik Kumpul Lapangan.", "extension"),
        ("Validasi Rute", "Pastikan rute aman terpilih di monitor telemetri.", "rocket_launch")
    ],
    ["resq_program", "resq_jalur_evakuasi"], ["api.setEvacRoute"]
)

add_job(
    "job_19", "gempa", 19, "Job 19: Monitoring Gempa Susulan (Aftershock)",
    "Setelah gempa utama mereda, warga dilarang terburu-buru masuk ke dalam rumah karena struktur bangunan sudah rapuh. Sistem harus memantau gempa susulan berkala.",
    "Buat jeda waktu 3 detik setelah gempa pertama, lalu aktifkan gempa susulan ringan dan peringatkan warga tetap di luar.",
    "Rangkai: Gempa Sedang -> Jeda 3 detik -> Gempa Ringan -> Layar Informasi 'WASPADA GEMPA SUSULAN'.",
    [
        ("Gempa Susulan", "Aftershock berkekuatan lebih kecil tetap bisa meruntuhkan bangunan yang sudah mengalami keretakan.", "school"),
        ("Rakit Rangkaian", "Gempa Sedang -> Jeda 3 detik -> Gempa Ringan -> Tampilkan 'WASPADA GEMPA SUSULAN'.", "inventory_2"),
        ("Perhatikan Grafik", "Lihat di Seismograf muncul dua episode gelombang gempa berurutan!", "extension"),
        ("Validasi", "Klik Validasi Misi.", "rocket_launch")
    ],
    ["resq_program", "resq_gempa_sim", "resq_tunggu", "resq_layar_oled"], ["api.simGempa(2)", "api.delay", "api.simGempa(1)"]
)

add_job(
    "job_20", "gempa", 20, "Job 20: Penyelamatan Warga Rentan ke Pos Medis",
    "Tim relawan warga mendata korban cedera dan mendahulukan evakuasi warga lanjut usia serta balita menuju Posko Medis BPBD.",
    "Buka Posko Medis BPBD dan arahkan ambulans relawan.",
    "Gunakan blok Buka Posko [Posko Medis BPBD] dan Lampu Status Hijau.",
    [
        ("Kelompok Rentan", "Lansia, ibu hamil, balita, dan penyandang disabilitas mendapat prioritas evakuasi pertama.", "school"),
        ("Aktifkan Posko Medis", "Ambil Aksi & Evakuasi -> Buka Posko: Posko Medis BPBD.", "inventory_2"),
        ("Nyalakan Indikator", "Atur Lampu Status ke Hijau dan tampilkan info kesiapan medis.", "extension"),
        ("Selesai Misi RT", "Validasi misi untuk menyelesaikan studi kasus pemukiman warga!", "rocket_launch")
    ],
    ["resq_program", "resq_posko", "resq_lampu_status"], ["api.setActiveShelter", "api.setRgb"]
)

# ── QUEST 5: STUDY CASE MITIGASI GEMPA DI FASILITAS KRITIS (RS & JEMBATAN) (Job 21 - 25)
add_job(
    "job_21", "gempa", 21, "Job 21: Gempa Kuat di Rumah Sakit Daerah",
    "Ruang rawat inap RS Harapan Desa terguncang hebat akibat gempa 7.2 SR. Sistem harus menyalakan alarm triase darurat dan lampu merah.",
    "Atur lokasi ke Rumah Sakit, aktifkan Gempa Kuat, dan nyalakan Lampu Merah serta Sirine EWS.",
    "Gunakan Lokasi: Rumah Sakit, Gempa Kuat, Lampu Merah, dan Sirine EWS.",
    [
        ("Kedaruratan Medis", "Pasien dengan infus dan alat bantu napas membutuhkan penanganan khusus saat gedung RS berguncang.", "school"),
        ("Rakit Alarm RS", "Lokasi: Rumah Sakit -> Gempa Kuat -> Lampu Merah -> Sirine EWS.", "inventory_2"),
        ("Kirim Pesan Triase", "Tampilkan: 'DARURAT RS - EVAKUASI PASIEN KRITIS'.", "extension"),
        ("Validasi", "Jalankan simulasi dan klik Validasi Misi.", "rocket_launch")
    ],
    ["resq_program", "resq_lokasi_mitigasi", "resq_gempa_sim", "resq_lampu_status", "resq_sirine_ews"], ["api.setLocation", "api.simGempa(3)"]
)

add_job(
    "job_22", "gempa", 22, "Job 22: Pembukaan Jalur Khusus Ambulans & Triase",
    "Jalur gerbang utama harus steril dari kendaraan pribadi agar ambulans dapat keluar masuk tanpa hambatan mengangkut korban gempa.",
    "Tentukan Jalur Evakuasi dan buka Posko Medis BPBD untuk evakuasi darurat.",
    "Gunakan Jalur Evakuasi dan Posko Medis BPBD.",
    [
        ("Jalur Steril", "Ambulans membutuhkan jalur bebas hambatan untuk menyelamatkan nyawa korban luka berat.", "school"),
        ("Buka Akses", "Pasang Tentukan Jalur Evakuasi dan Buka Posko: Posko Medis BPBD.", "inventory_2"),
        ("Tampilkan Rute", "Tampilkan di Layar Informasi: 'JALUR STERIL AMBULANS AKTIF'.", "extension"),
        ("Validasi", "Klik tombol Validasi Misi.", "rocket_launch")
    ],
    ["resq_program", "resq_jalur_evakuasi", "resq_posko"], ["api.setEvacRoute", "api.setActiveShelter"]
)

add_job(
    "job_23", "gempa", 23, "Job 23: Gempa di Area Jembatan (Bahaya Likuefaksi)",
    "Gempa memicu fenomena likuefaksi (tanah berpasir dekat sungai mencair dan ambles). Fondasi jembatan retak berbahaya dan tidak boleh dilintasi!",
    "Atur lokasi ke Dekat Jembatan Sungai, aktifkan gempa kuat, dan beri peringatan jembatan retak.",
    "Gunakan Lokasi: Dekat Jembatan Sungai, Gempa Kuat, dan Layar Informasi.",
    [
        ("Likuefaksi Tanah", "Getaran gempa dapat membuat tanah jenuh air kehilangan kekuatannya dan mencair seperti lumpur hisap.", "school"),
        ("Rakit Lokasi Jembatan", "Lokasi: Dekat Jembatan Sungai -> Gempa Kuat -> Tampilkan: 'JEMBATAN RETAK - JANGAN DILINTASI'.", "inventory_2"),
        ("Sinyal Bahaya", "Nyalakan Lampu Status Merah.", "extension"),
        ("Validasi", "Jalankan dan klik Validasi.", "rocket_launch")
    ],
    ["resq_program", "resq_lokasi_mitigasi", "resq_gempa_sim", "resq_layar_oled"], ["api.setLocation", "api.simGempa(3)"]
)

add_job(
    "job_24", "gempa", 24, "Job 24: Pengalihan Rute Menjauhi Jembatan Retak",
    "Jalur terpendek melewati jembatan retak yang rawan runtuh. Siswa harus mengarahkan rute memutar yang kokoh melalui Jalur Lingkar Utama menuju posko aman.",
    "Pilih Jalur Lingkar Utama (Bebas Lahar/Jembatan Rusak) untuk mengalihkan arus evakuasi warga.",
    "Gunakan blok 'Tentukan Jalur Evakuasi ke [Jalur Lingkar Utama (Bebas Lahar)]'.",
    [
        ("Pengalihan Rute", "Jangan memaksakan lewat jembatan yang retak! Lebih baik memutar sedikit asalkan jalurnya aman dan kokoh.", "school"),
        ("Pilih Jalur Lingkar", "Ambil Tentukan Jalur Evakuasi: Jalur Lingkar Utama (Bebas Lahar).", "inventory_2"),
        ("Buka Posko", "Arahkan warga menuju Barak Pengungsian Terpadu (KRB I).", "extension"),
        ("Cek Rute Peta", "Pastikan rute lingkar aman terpilih di panel telemetri.", "rocket_launch")
    ],
    ["resq_program", "resq_jalur_evakuasi", "resq_posko"], ["api.setEvacRoute('Jalur Lingkar Utama"]
)

add_job(
    "job_25", "gempa", 25, "Job 25: Pusat Komando Bencana Rumah Sakit & Wilayah",
    "Mengintegrasikan seluruh sistem pemantauan gempa, pengalihan jembatan, dan posko medis ke dalam pusat komando terpadu.",
    "Susun alur lengkap: Deteksi Gempa Kuat -> Sirine EWS -> Alihkan Jalur Lingkar -> Buka Posko Medis.",
    "Gunakan Gempa Kuat, Sirine EWS, Jalur Lingkar, dan Posko Medis.",
    [
        ("Pusat Komando", "Koordinasi cepat antara rumah sakit, relawan, dan BPBD menyelamatkan ratusan warga saat gempa besar.", "school"),
        ("Rakit Alur Penuh", "1. Gempa Kuat -> 2. Sirine EWS -> 3. Jalur Lingkar Utama -> 4. Posko Medis BPBD.", "inventory_2"),
        ("Uji Sistem Lengkap", "Jalankan simulasi dan periksa seluruh indikator di panel telemetri.", "extension"),
        ("Selesai Quest Gempa", "Selamat! Kamu telah menuntaskan seluruh studi kasus gempa bumi!", "rocket_launch")
    ],
    ["resq_program", "resq_gempa_sim", "resq_sirine_ews", "resq_jalur_evakuasi", "resq_posko"], ["api.simGempa(3)", "api.setEvacRoute"]
)

# ── QUEST 6: KAUSALITAS VULKANOLOGI & FASE STATUS GUNUNG API (Job 26 - 30)
add_job(
    "job_26", "gunung", 26, "Job 26: Deteksi Gempa Vulkanik Dalam Merapi",
    "Pos Pengamatan Gunung Merapi mendeteksi ratusan getaran gempa vulkanik per hari. Ini adalah tanda magma di perut bumi mendesak naik ke kubah lava.",
    "Simulasikan getaran vulkanik ringan dan atur lampu status ke Kuning (Waspada).",
    "Gunakan Simulasi Getaran Gempa [Ringan] dan Lampu Status [Kuning (Waspada)].",
    [
        ("Tanda Awal Magma", "Magma yang naik mendesak dan memecahkan lapisan batuan, menghasilkan gempa vulkanik (volcanic tremor).", "school"),
        ("Rakit Skenario", "Gempa Ringan -> Lampu Status Kuning -> Tampilkan 'GEMPA VULKANIK TERDETEKSI'.", "inventory_2"),
        ("Cek Seismograf", "Amati tremor halus di seismograf dan lampu kuning menyala.", "extension"),
        ("Validasi", "Klik tombol Validasi Misi.", "rocket_launch")
    ],
    ["resq_program", "resq_gempa_sim", "resq_lampu_status"], ["api.simGempa(1)", "api.setRgb('yellow')"]
)

add_job(
    "job_27", "gunung", 27, "Job 27: Pemantauan Suhu Termal Kawah & Fumarol",
    "Suhu kawah meningkat dari normal 27°C menjadi 45°C disertai pelepasan gas fumarol solfatara. Aktifkan simulasi status Waspada.",
    "Jalankan Simulasi Erupsi Merapi status Waspada dan tampilkan suhu kawah.",
    "Gunakan blok 'Simulasi Erupsi Merapi [Waspada (Fase 1)]'.",
    [
        ("Termal Kawah", "Peningkatan suhu kawah menandakan kubah lava mulai memanas aktif dan gas magmatik mendesak ke permukaan.", "school"),
        ("Pilih Blok Merapi", "Ambil Simulasi Bencana -> 'Simulasi Erupsi Merapi [Waspada (Fase 1)]'.", "inventory_2"),
        ("Perhatikan Gauge Suhu", "Suhu kawah di panel telemetri akan naik ke angka 43.8°C!", "extension"),
        ("Validasi", "Klik Validasi setelah suhu terkonfirmasi naik.", "rocket_launch")
    ],
    ["resq_program", "resq_gunung_sim"], ["api.simGunung('WASPADA'"]
)

add_job(
    "job_28", "gunung", 28, "Job 28: Tremor Menerus & Kenaikan Status ke Siaga",
    "Getaran tremor seismik berlangsung tanpa henti. Suhu kawah mencapai 70°C. BPBD menaikkan status menjadi SIAGA (Lampu Oranye).",
    "Aktifkan Simulasi Merapi status Siaga dan atur Lampu Status ke Oranye.",
    "Gunakan Simulasi Merapi [Siaga (Fase 2)] dan Lampu Status [Oranye].",
    [
        ("Status Siaga", "Pada status Siaga, warga di lereng atas mulai mengamankan ternak dan menyiapkan tas siaga bencana.", "school"),
        ("Pasang Status Siaga", "Simulasi Merapi [Siaga] -> Lampu Status Oranye -> Tampilkan 'STATUS SIAGA - SIAPKAN TAS BENCANA'.", "inventory_2"),
        ("Amati Termometer", "Suhu kawah melonjak ke 68.4°C dan lampu oranye menyala!", "extension"),
        ("Validasi", "Klik tombol Validasi Misi.", "rocket_launch")
    ],
    ["resq_program", "resq_gunung_sim", "resq_lampu_status"], ["api.simGunung('SIAGA'", "api.setRgb('orange')"]
)

add_job(
    "job_29", "gunung", 29, "Job 29: Kausalitas Vulkanik: Gempa Mendahului Erupsi",
    "Hukum IPA Vulkanologi: Erupsi tidak bisa terjadi tanpa didahului gempa vulkanik! Susun gempa vulkanik terlebih dahulu, jeda 2 detik, lalu aktifkan erupsi Merapi status Awas.",
    "Susun urutan kausalitas: Gempa Sedang -> Jeda 2 detik -> Erupsi Merapi Status Awas.",
    "Rangkai: Gempa Sedang -> Jeda Waktu 2 detik -> Simulasi Erupsi Merapi [Awas].",
    [
        ("Prinsip Kausalitas", "Secara vulkanologi, naiknya magma selalu meretakkan batuan kerak bumi terlebih dahulu.", "school"),
        ("Susun Urutan Benar", "1. Simulasi Gempa Sedang -> 2. Jeda Waktu 2 detik -> 3. Simulasi Erupsi Merapi [Awas].", "inventory_2"),
        ("Lihat Efek Hardware", "Motor bergetar sesaat sebelum letusan dimulai di diorama!", "extension"),
        ("Validasi Kausalitas", "Validasi misi ilmiah ini.", "rocket_launch")
    ],
    ["resq_program", "resq_gempa_sim", "resq_tunggu", "resq_gunung_sim"], ["api.simGempa", "api.delay", "api.simGunung('AWAS'"]
)

add_job(
    "job_30", "gunung", 30, "Job 30: Menghidupkan Asap Kawah Humidifier Fisik",
    "Uji coba modul mist maker (humidifier) pada diorama ESP32 untuk menyemburkan kabut uap asap letusan putih dari lubang kawah.",
    "Aktifkan Erupsi Merapi status Awas dan bunyikan sirine EWS.",
    "Gunakan Simulasi Erupsi Merapi [Awas] dan Sirine EWS.",
    [
        ("Uap Asap Fisik", "Di hardware, pin MIST_PIN 26 mengaktifkan ultrasonic mist maker untuk menghasilkan efek asap letusan nyata.", "school"),
        ("Rakit Asap & Alarm", "Simulasi Erupsi Merapi [Awas] -> Sirine EWS 3 detik -> Lampu Status Merah.", "inventory_2"),
        ("Periksa Mist", "Status Asap Mist di panel aktuator akan menyala 'MENYEMBUR'!", "extension"),
        ("Validasi", "Klik Validasi Misi.", "rocket_launch")
    ],
    ["resq_program", "resq_gunung_sim", "resq_sirine_ews"], ["api.simGunung('AWAS'", "api.setBuzzer"]
)

# ── QUEST 7: STUDY CASE LETUSAN GUNUNG API TIPE EFUSIF (Job 31 - 35)
add_job(
    "job_31", "gunung", 31, "Job 31: Karakteristik Erupsi Efusif (Lava Pijar)",
    "Kubah lava Gunung Merapi runtuh perlahan. Terjadi guguran lava pijar yang merayap menuruni lereng tanpa ledakan besar.",
    "Aktifkan Simulasi Erupsi Merapi tipe Efusif dan atur lampu status ke Oranye (Siaga).",
    "Gunakan Simulasi Erupsi Merapi [Siaga, Tipe: Efusif] dan Lampu Status Oranye.",
    [
        ("Erupsi Efusif", "Erupsi efusif terjadi karena magma memiliki viskositas encer dan tekanan gas rendah, menghasilkan lelehan lava.", "school"),
        ("Pilih Tipe Efusif", "Pilih Simulasi Erupsi Merapi dengan opsi 'Efusif (Lelehan Lava Pijar)'.", "inventory_2"),
        ("Amati Indikator", "Di panel telemetri akan muncul badge 'Tipe Letusan: EFUSIF (Lava Pijar)'.", "extension"),
        ("Validasi", "Klik tombol Validasi Misi.", "rocket_launch")
    ],
    ["resq_program", "resq_gunung_sim", "resq_lampu_status"], ["api.simGunung('SIAGA', 'EFUSIF')"]
)

add_job(
    "job_32", "gunung", 32, "Job 32: Pemetaan Alur Bahaya Lava di Bantaran Sungai",
    "Lava pijar bersuhu >800°C mengalir mengikuti alur lembah sungai. Pemukiman di dekat bantaran sungai berada di zona bahaya tinggi.",
    "Tampilkan peringatan 'ZONA BAHAYA LAVA: KOSONGKAN BANTARAN SUNGAI' di layar OLED.",
    "Gunakan blok Layar Informasi dan Lampu Status Oranye.",
    [
        ("Lembah Sungai Merapi", "Sungai seperti Kali Boyong, Krasak, dan Gendol menjadi saluran alami aliran lava pijar.", "school"),
        ("Peringatan Sungai", "Tampilkan di Layar Informasi: 'KOSONGKAN BANTARAN SUNGAI RADIUS 500 METER'.", "inventory_2"),
        ("Status Waspada", "Nyalakan Lampu Status Oranye.", "extension"),
        ("Validasi", "Klik tombol Validasi Misi.", "rocket_launch")
    ],
    ["resq_program", "resq_layar_oled", "resq_lampu_status"], ["api.setOledMessage", "api.setRgb"]
)

add_job(
    "job_33", "gunung", 33, "Job 33: Sistem Peringatan Dini Bantaran Sungai",
    "Mengaktifkan sirine berkala untuk mengingatkan penambang pasir dan warga pinggir sungai agar segera mengevakuasi diri ke tempat tinggi.",
    "Gunakan pengulangan 3 kali untuk membunyikan sirine berkala.",
    "Gunakan blok 'Ulangi Aksi 3 kali', Sirine EWS, dan Jeda Waktu.",
    [
        ("Sirine Bantaran", "Sirine di pos pantau sungai memperingatkan penambang pasir dan warga lereng bawah.", "school"),
        ("Rakit Loop", "Ulangi 3 kali: Sirine EWS 1 detik -> Jeda Waktu 1 detik.", "inventory_2"),
        ("Cek Siklus", "Pastikan sirine berbunyi berkala 3 kali.", "extension"),
        ("Validasi", "Klik Validasi Misi.", "rocket_launch")
    ],
    ["resq_program", "resq_ulangi", "resq_sirine_ews"], ["for (let", "api.setBuzzer"]
)

add_job(
    "job_34", "gunung", 34, "Job 34: Jalur Evakuasi Efusif: Menjauhi Lembah Sungai",
    "Siswa memilih rute evakuasi warga lereng: Menghindari jalan setapak pinggir kali menuju jalur lingkar bukit bebas lava!",
    "Tentukan Jalur Evakuasi ke 'Jalur Lingkar Utama (Bebas Lahar)' dan buka Barak Pengungsian.",
    "Gunakan blok 'Tentukan Jalur Evakuasi ke [Jalur Lingkar Utama (Bebas Lahar)]'.",
    [
        ("Keputusan Mitigasi", "Jangan menyusuri sungai! Menanjaklah ke punggung bukit menjauhi alur lembah sungai.", "school"),
        ("Pilih Jalur Aman", "Ambil Tentukan Jalur Evakuasi: Jalur Lingkar Utama (Bebas Lahar).", "inventory_2"),
        ("Buka Barak KRB I", "Tambahkan Buka Posko: Barak Pengungsian Terpadu (KRB I).", "extension"),
        ("Cek Rute Hijau", "Rute aman di panel telemetri akan berstatus aman!", "rocket_launch")
    ],
    ["resq_program", "resq_jalur_evakuasi", "resq_posko"], ["api.setEvacRoute('Jalur Lingkar Utama", "api.setActiveShelter"]
)

add_job(
    "job_35", "gunung", 35, "Job 35: Bahaya Lahar Dingin Saat Terjadi Hujan Puncak",
    "Hujan lebat di puncak gunung menghanyutkan endapan material vulkanik menjadi banjir lahar dingin dahsyat di sungai. Nyalakan sirine dan lampu merah!",
    "Aktifkan Sirine EWS, Lampu Merah, dan tampilkan 'BAHAYA BANJIR LAHAR DINGIN DI SUNGAI'.",
    "Gunakan Sirine EWS, Lampu Merah, dan Layar Informasi.",
    [
        ("Lahar Hujan / Dingin", "Air hujan bercampur pasir dan batu besar membentuk aliran lumpur padat berkecepatan tinggi yang merusak jembatan.", "school"),
        ("Rakit Alarm Lahar", "Lampu Status Merah -> Sirine EWS 3 detik -> Tampilkan 'BAHAYA LAHAR DINGIN'.", "inventory_2"),
        ("Jalur Menjauh", "Pastikan rute tetap mengarah menjauhi sungai.", "extension"),
        ("Selesai Quest Efusif", "Validasi misi untuk menuntaskan bab erupsi efusif!", "rocket_launch")
    ],
    ["resq_program", "resq_lampu_status", "resq_sirine_ews", "resq_layar_oled"], ["api.setRgb('red')", "api.setBuzzer"]
)

# ── QUEST 8: STUDY CASE LETUSAN GUNUNG API TIPE EKSPLOSIF (Job 36 - 40)
add_job(
    "job_36", "gunung", 36, "Job 36: Karakteristik Erupsi Eksplosif (Ledakan & Abu)",
    "Tekanan gas magma tinggi mendobrak sumbat kawah! Terjadi ledakan dahsyat dengan kolom abu vertikal setinggi 5 km dan awan panas.",
    "Aktifkan Simulasi Erupsi Merapi tipe Eksplosif status Awas bersama Lampu Merah dan Sirine EWS.",
    "Gunakan Simulasi Erupsi Merapi [Awas, Tipe: Eksplosif], Lampu Merah, dan Sirine EWS.",
    [
        ("Letusan Eksplosif", "Gas terlarut dalam magma andesitik melepaskan energi secara mendadak, menghasilkan dentuman dan semburan piroklastik.", "school"),
        ("Rakit Eksplosif", "Simulasi Erupsi Merapi [Awas, Tipe: Eksplosif] -> Lampu Merah -> Sirine EWS 4 detik.", "inventory_2"),
        ("Amati Partikel & Asap", "Di hardware mist maker menyembur kencang dan panel telemetri menampilkan status AWAS Eksplosif!", "extension"),
        ("Validasi", "Klik tombol Validasi Misi.", "rocket_launch")
    ],
    ["resq_program", "resq_gunung_sim", "resq_lampu_status", "resq_sirine_ews"], ["api.simGunung('AWAS', 'EKSPLOSIF')", "api.setRgb('red')"]
)

add_job(
    "job_37", "gunung", 37, "Job 37: Peringatan Awan Panas Piroklastik",
    "Awan panas (wedhus gembel) bersuhu 600°C bergulung menuruni lereng dengan kecepatan 200 km/jam. Tidak ada waktu menunggu, evakuasi kilat harus dilakukan!",
    "Tampilkan pesan 'AWAS AWAN PANAS - EVAKUASI SEGERA' dan bunyikan alarm darurat.",
    "Gunakan Layar Informasi dan Alarm Darurat.",
    [
        ("Awan Panas / Piroklastik", "Campuran gas panas, abu, dan batu pijar yang meluncur cepat menuruni lembah lereng.", "school"),
        ("Alarm Kilat", "Alarm Darurat 3 kali -> Tampilkan 'AWAS AWAN PANAS - EVAKUASI SEGERA'.", "inventory_2"),
        ("Bunyikan Alarm", "Pastikan sirine dan lampu berkedip cepat.", "extension"),
        ("Validasi", "Klik tombol Validasi Misi.", "rocket_launch")
    ],
    ["resq_program", "resq_alarm_darurat", "resq_layar_oled"], ["api.setOledMessage"]
)

add_job(
    "job_38", "gunung", 38, "Job 38: Bahaya Hujan Abu Vulkanik & Masker APD",
    "Hujan abu silika tajam melanda pemukiman. Sistem menginstruksikan warga memakai masker basah dan kacamata pelindung untuk mencegah ISPA.",
    "Tampilkan panduan 'PAKAI MASKER & KACAMATA PELINDUNG' dan atur status Siaga.",
    "Gunakan Layar Informasi dan Lampu Status Oranye.",
    [
        ("Bahaya Abu Vulkanik", "Abu vulkanik bukanlah abu kayu biasa, melainkan butiran kaca dan kristal mineral tajam yang berbahaya bagi paru-paru.", "school"),
        ("Panduan APD", "Tampilkan di Layar Informasi: 'PAKAI MASKER & KACAMATA PELINDUNG'.", "inventory_2"),
        ("Status Waspada/Siaga", "Nyalakan Lampu Status Oranye.", "extension"),
        ("Validasi", "Klik Validasi Misi.", "rocket_launch")
    ],
    ["resq_program", "resq_layar_oled", "resq_lampu_status"], ["api.setOledMessage", "api.setRgb"]
)

add_job(
    "job_39", "gunung", 39, "Job 39: Jalur Evakuasi Eksplosif: Menjauhi Arah Angin Abu",
    "Angin bertiup ke Timur membawa abu pekat dengan jarak pandang nol. Arahkan warga mengevakuasi diri melalui Jalur Lingkar Barat/Utara menuju Barak KRB I!",
    "Tentukan Jalur Evakuasi ke Jalur Lingkar Utama dan buka Barak Pengungsian.",
    "Gunakan blok 'Tentukan Jalur Evakuasi ke [Jalur Lingkar Utama]' dan 'Buka Posko [Barak Pengungsian Terpadu]'.",
    [
        ("Arah Angin Abu", "Evakuasi harus memperhitungkan arah tiupan angin agar kendaraan warga tidak terjebak hujan abu tebal.", "school"),
        ("Pilih Rute Barat", "Ambil Tentukan Jalur Evakuasi: Jalur Lingkar Utama (Bebas Lahar).", "inventory_2"),
        ("Aktifkan Barak", "Tambahkan Buka Posko: Barak Pengungsian Terpadu (KRB I).", "extension"),
        ("Validasi Rute", "Pastikan rute lingkar aktif di panel telemetri.", "rocket_launch")
    ],
    ["resq_program", "resq_jalur_evakuasi", "resq_posko"], ["api.setEvacRoute", "api.setActiveShelter"]
)

add_job(
    "job_40", "gunung", 40, "Job 40: Pensterilan Radius Bahaya 10 KM (KRB III)",
    "Status Awas resmi diberlakukan PVMBG. Seluruh pemukiman dalam radius 10 km (KRB III) harus steril total. Pastikan seluruh sirine dan lampu status merah aktif!",
    "Susun: Simulasi Erupsi Eksplosif -> Lampu Merah -> Sirine EWS -> Tampilkan 'RADIUS 10 KM KOSONG TOTAL'.",
    "Gunakan Simulasi Erupsi Merapi [Awas], Lampu Merah, Sirine EWS, dan Layar Informasi.",
    [
        ("Sterilisasi Zona Merah", "Tidak boleh ada satu pun warga bertahan di kawasan KRB III selama letusan eksplosif berlangsung.", "school"),
        ("Rakit Sistem Penuh", "Erupsi Merapi Eksplosif -> Lampu Merah -> Sirine EWS -> Tampilkan 'RADIUS 10 KM STERIL'.", "inventory_2"),
        ("Uji Tanggap", "Periksa seluruh output hardware aktif serempak!", "extension"),
        ("Selesai Quest Eksplosif", "Selamat! Kamu telah menguasai mitigasi letusan eksplosif!", "rocket_launch")
    ],
    ["resq_program", "resq_gunung_sim", "resq_lampu_status", "resq_sirine_ews", "resq_layar_oled"], ["api.simGunung('AWAS'", "api.setRgb('red')"]
)

# ── QUEST 9: PENENTUAN JALUR EVAKUASI TERPADU & POSKO KRB (Job 41 - 45)
add_job(
    "job_41", "proyek", 41, "Job 41: Membaca Peta Kawasan Rawan Bencana (KRB)",
    "Mengenal tiga zona mitigasi resmi PVMBG: KRB III (Paling Bahaya), KRB II (Waspada Lontaran Batu), dan KRB I (Aman untuk Pengungsian).",
    "Tampilkan informasi zonasi KRB di Layar Informasi dan atur status ke Waspada.",
    "Gunakan blok Layar Informasi dan Lampu Status Kuning.",
    [
        ("Zonasi Merapi", "KRB III selalu terancam awan panas dan aliran lava. KRB I adalah zona aman di dataran rendah.", "school"),
        ("Kirim Edukasi", "Tampilkan di Layar Informasi: 'KRB III: BAHAYA | KRB I: POS PENGUNGSIAN'.", "inventory_2"),
        ("Nyalakan Sinyal", "Atur Lampu Status ke Kuning.", "extension"),
        ("Validasi", "Klik Validasi Misi.", "rocket_launch")
    ],
    ["resq_program", "resq_layar_oled", "resq_lampu_status"], ["api.setOledMessage"]
)

add_job(
    "job_42", "proyek", 42, "Job 42: Keputusan Rute: Jalur Utama vs Lembah Sungai",
    "Dua rute terlihat di peta: Rute jalan pintas lembah sungai vs Rute lingkar utama. Jika siswa salah pilih rute lembah sungai, simulator memberi peringatan bahaya!",
    "Pilih 'Jalur Lingkar Utama (Bebas Lahar)' sebagai rute mitigasi yang benar.",
    "Gunakan blok 'Tentukan Jalur Evakuasi ke [Jalur Lingkar Utama (Bebas Lahar)]'.",
    [
        ("Ujian Navigasi", "Rute lembah sungai memang tampak lebih dekat, tetapi itu adalah jebakan maut banjir lahar dingin!", "school"),
        ("Pilih Rute Tepat", "Ambil Tentukan Jalur Evakuasi: Jalur Lingkar Utama (Bebas Lahar).", "inventory_2"),
        ("Periksa Warna", "Di panel telemetri, rute akan berwarna hijau sukses!", "extension"),
        ("Validasi Keputusan", "Klik tombol Validasi Misi.", "rocket_launch")
    ],
    ["resq_program", "resq_jalur_evakuasi"], ["api.setEvacRoute('Jalur Lingkar Utama"]
)

add_job(
    "job_43", "proyek", 43, "Job 43: Aktivasi Barak Pengungsian Terpadu (KRB I)",
    "Menyiapkan tenda pleton BPBD, tandon air bersih, dan pos kesehatan di area aman KRB I untuk menampung ratusan pengungsi dari lereng atas.",
    "Buka Barak Pengungsian Terpadu (KRB I) dan nyalakan Lampu Status Hijau.",
    "Gunakan blok 'Buka Posko [Barak Pengungsian Terpadu (KRB I)]' dan Lampu Status Hijau.",
    [
        ("Barak Pengungsian", "Barak KRB I dilengkapi fasilitas dapur umum, tandon air, pos trauma healing, dan pos medis.", "school"),
        ("Buka Posko", "Ambil Aksi & Evakuasi -> Buka Posko: Barak Pengungsian Terpadu (KRB I).", "inventory_2"),
        ("Kesiapan Logistik", "Atur Lampu Status ke Hijau dan tampilkan pesan kesiapan posko.", "extension"),
        ("Validasi", "Klik Validasi Misi.", "rocket_launch")
    ],
    ["resq_program", "resq_posko", "resq_lampu_status"], ["api.setActiveShelter('Barak Pengungsian", "api.setRgb('green')"]
)

add_job(
    "job_44", "proyek", 44, "Job 44: Jalur Khusus Logistik TAGANA & Medis",
    "Truk pengangkut sembako dan mobil tangki air bersih harus melalui rute yang tidak bertabrakan dengan arus warga yang sedang mengungsi.",
    "Tentukan rute evakuasi lingkar utama dan buka posko pengungsian bersamaan.",
    "Gunakan Jalur Lingkar Utama dan Barak Pengungsian Terpadu.",
    [
        ("Manajemen Arus", "Pemisahan jalur logistik dan jalur pengungsi mencegah kemacetan total di gerbang masuk barak.", "school"),
        ("Rakit Terpadu", "Tentukan Jalur Evakuasi: Jalur Lingkar Utama -> Buka Posko: Barak KRB I.", "inventory_2"),
        ("Tampilkan Status", "Tampilkan: 'LOGISTIK & BARAK SIAP 100%'.", "extension"),
        ("Validasi", "Klik tombol Validasi Misi.", "rocket_launch")
    ],
    ["resq_program", "resq_jalur_evakuasi", "resq_posko"], ["api.setEvacRoute", "api.setActiveShelter"]
)

add_job(
    "job_45", "proyek", 45, "Job 45: Simulasi Waktu Tanggap Evakuasi Warga",
    "Mengukur kecepatan respon sistem. Sejak sirine dibunyikan, warga memiliki jendela waktu emas 15 menit untuk mengosongkan dusun dan tiba di barak aman.",
    "Bunyikan sirine EWS 3 detik, pilih jalur lingkar aman, dan buka barak pengungsian.",
    "Gunakan Sirine EWS, Jalur Lingkar Utama, dan Barak Pengungsian Terpadu.",
    [
        ("Golden Time", "Kecepatan bereaksi menentukan keselamatan. Latihan berkala melatih refleks warga saat sirine berbunyi.", "school"),
        ("Rakit Cepat", "1. Sirine EWS 3 detik -> 2. Jalur Lingkar Utama -> 3. Barak Pengungsian KRB I.", "inventory_2"),
        ("Uji Simulasi", "Jalankan simulasi dan perhatikan respon cepat sistem!", "extension"),
        ("Selesai Quest 9", "Validasi misi untuk membuka Grand Mission terakhir!", "rocket_launch")
    ],
    ["resq_program", "resq_sirine_ews", "resq_jalur_evakuasi", "resq_posko"], ["api.setBuzzer", "api.setEvacRoute"]
)

# ── QUEST 10: GRAND MISSION PROYEK TERPADU (FINAL BOSS) (Job 46 - 50)
add_job(
    "job_46", "proyek", 46, "Job 46: Bencana Ganda: Gempa Memicu Erupsi Merapi",
    "Gempa tektonik 6.8 SR meretakkan dinding lereng Merapi, memicu runtuhnya kubah lava dan letusan efusif secara bersamaan!",
    "Susun simulasi gempa kuat terlebih dahulu, lalu aktifkan erupsi Merapi dan sirine EWS.",
    "Gunakan Simulasi Gempa Kuat, Simulasi Erupsi Merapi [Awas], Sirine EWS, dan Lampu Merah.",
    [
        ("Multi-Bencana", "Gempa besar seringkali memicu ketidakstabilan kubah lava gunung api di dekat episentrum.", "school"),
        ("Rakit Gempa & Erupsi", "Simulasi Gempa Kuat -> Jeda 2 detik -> Simulasi Erupsi Merapi [Awas] -> Sirine EWS.", "inventory_2"),
        ("Uji Hardware", "Motor bergetar kencang, speaker bersuara gemuruh, mist menyembur, dan sirine berbunyi!", "extension"),
        ("Validasi", "Klik Validasi Misi.", "rocket_launch")
    ],
    ["resq_program", "resq_gempa_sim", "resq_gunung_sim", "resq_sirine_ews"], ["api.simGempa(3)", "api.simGunung('AWAS'", "api.setBuzzer"]
)

add_job(
    "job_47", "proyek", 47, "Job 47: Erupsi Eksplosif Malam Hari & Pemadaman Listrik",
    "Listrik gardu utama padam total akibat sambaran petir vulkanik di malam hari. Sistem mandiri RESQ-BOX mengambil alih kendali darurat.",
    "Nyalakan Lampu Darurat Merah, sirine EWS, dan tampilkan petunjuk arah pada layar OLED.",
    "Gunakan Lampu Merah, Sirine EWS, dan Layar Informasi OLED.",
    [
        ("Sistem Darurat Mandiri", "Sistem IoT berbasis mikrokontroler dengan baterai cadangan tetap beroperasi saat jaringan listrik kota lumpuh.", "school"),
        ("Rakit Respon Mandiri", "Lampu Status Merah -> Sirine EWS 3 detik -> Tampilkan 'LISTRIK PADAM - IKUTI LAMPU JALUR'.", "inventory_2"),
        ("Cek Layar OLED", "Periksa pesan instruksi darurat tetap menyala terang di monitor OLED.", "extension"),
        ("Validasi", "Klik Validasi Misi.", "rocket_launch")
    ],
    ["resq_program", "resq_lampu_status", "resq_sirine_ews", "resq_layar_oled"], ["api.setRgb('red')", "api.setBuzzer", "api.setOledMessage"]
)

add_job(
    "job_48", "proyek", 48, "Job 48: Pengalihan Jalur Saat Rute Tertutup Longsor",
    "Saat evakuasi berlangsung, sebuah bukit longsor menutup jalur utama. Gunakan logika percabangan untuk mengalihkan warga ke rute darurat.",
    "Gunakan blok 'Kalau... Selain Itu' untuk mengarahkan jalur evakuasi.",
    "Gunakan blok Kalau... Selain Itu dan Tentukan Jalur Evakuasi.",
    [
        ("Dinamika Lapangan", "Bencana sering memicu longsor sekunder yang menutup jalan raya utama.", "school"),
        ("Rakit Percabangan", "Gunakan Kalau... Selain Itu untuk menentukan jalur evakuasi alternatif.", "inventory_2"),
        ("Tetapkan Rute", "Pastikan rute alternatif terpilih aman di panel telemetri.", "extension"),
        ("Validasi", "Klik tombol Validasi Misi.", "rocket_launch")
    ],
    ["resq_program", "resq_jika_tidak", "resq_jalur_evakuasi"], ["if (", "api.setEvacRoute"]
)

add_job(
    "job_49", "proyek", 49, "Job 49: Otomasi Pusat Pengendali Operasi (PUSDALOPS)",
    "Merancang sistem cerdas PUSDALOPS BPBD: memantau sensor getaran, suhu kawah, status lampu RGB, sirine, hingga mengarahkan warga ke barak pengungsian secara otomatis.",
    "Susun alur pemantauan otomatis lengkap dengan multi-aksi.",
    "Gunakan Simulasi Bencana, Peringatan EWS, Jalur Evakuasi, dan Posko Pengungsian.",
    [
        ("PUSDALOPS Cerdas", "Pusat Pengendali Operasi mengintegrasikan data lapangan dan mengambil tindakan mitigasi otomatis demi keselamatan masyarakat.", "school"),
        ("Susun Sistem Terpadu", "1. Status Merah -> 2. Sirine EWS -> 3. Tentukan Jalur Lingkar Utama -> 4. Buka Barak KRB I.", "inventory_2"),
        ("Uji Tanggap Penuh", "Saksikan seluruh indikator diorama dan simulator aktif serempak!", "extension"),
        ("Validasi", "Klik Validasi Misi.", "rocket_launch")
    ],
    ["resq_program", "resq_lampu_status", "resq_sirine_ews", "resq_jalur_evakuasi", "resq_posko"], ["api.setRgb", "api.setBuzzer", "api.setEvacRoute", "api.setActiveShelter"]
)

add_job(
    "job_50", "proyek", 50, "Job 50: Zero Victim Hero Challenge (Tantangan Akhir)",
    "Tantangan puncak! Erupsi eksplosif besar Merapi dan gempa vulkanik hebat melanda kota. Terapkan seluruh ilmu mitigasi untuk mengevakuasi 100% warga tanpa ada korban jiwa!",
    "Rakit sistem mitigasi total: Gempa -> Erupsi Eksplosif -> Sirine EWS -> Jalur Lingkar Bebas Lahar -> Barak Pengungsian KRB I.",
    "Gunakan Gempa Sim, Gunung Sim, Sirine EWS, Jalur Evakuasi, Posko KRB I, dan Layar OLED.",
    [
        ("Misi Pahlawan Mitigasi", "Ujian akhir kompetensi seorang relawan dan pahlawan mitigasi bencana! Buktikan desamu selamat 100%!", "school"),
        ("Rakit Alur Puncak", "1. Gempa Kuat -> 2. Erupsi Merapi Eksplosif -> 3. Sirine EWS -> 4. Jalur Lingkar Bebas Lahar -> 5. Buka Barak KRB I -> 6. Tampilkan 'MISI LULUS: ZERO VICTIM'.", "inventory_2"),
        ("Validasi Kemenangan", "Jalankan simulasi dan raih sertifikat kelulusan Level 3 Action Lab!", "rocket_launch")
    ],
    ["resq_program", "resq_gempa_sim", "resq_gunung_sim", "resq_sirine_ews", "resq_jalur_evakuasi", "resq_posko", "resq_layar_oled"],
    ["api.simGempa", "api.simGunung", "api.setBuzzer", "api.setEvacRoute", "api.setActiveShelter", "api.setOledMessage"]
)

# Build TypeScript code
ts_content = """export interface MissionValidation {
  requiredBlocks?: string[];
  codeContains?: string[];
  ancestorConstraints?: Record<string, string>;
}

export interface MissionStep {
  title: string;
  description: string;
  icon: string;
  tip?: string;
}

export type MissionCategory = 'pengenalan' | 'gempa' | 'gunung' | 'proyek';

export const CATEGORIES: { id: MissionCategory; title: string; icon: string; missions: number }[] = """ + json.dumps(CATEGORIES, indent=2) + """;

export interface Mission {
  id: string;
  category: MissionCategory;
  level: number;
  title: string;
  icon: string;
  scenario: string;
  objective: string;
  hint: string;
  steps: MissionStep[];
  validation: MissionValidation;
}

const st = (title: string, description: string, icon: string, tip?: string): MissionStep => ({ title, description, icon, tip });

export const MISSIONS: Mission[] = """ + json.dumps(jobs, indent=2, ensure_ascii=False) + """;
"""

with open(output_ts_path, 'w', encoding='utf-8') as f:
    f.write(ts_content)

print(f"Successfully generated {len(jobs)} missions to {output_ts_path}!")
