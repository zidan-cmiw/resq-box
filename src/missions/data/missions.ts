export interface MissionValidation {
  requiredBlocks?: string[];
  codeContains?: string[];
  ancestorConstraints?: Record<string, string>;
}

export interface MissionStep {
  title: string;
  description: string;
  icon: string;
  tip?: string | null;
}

export type MissionCategory = 'pengenalan' | 'gempa' | 'gunung' | 'proyek';

export const CATEGORIES: { id: MissionCategory; title: string; icon: string; missions: number }[] = [
  {
    "id": "pengenalan",
    "title": "Fondasi EWS & Seismik",
    "icon": "school",
    "missions": 10
  },
  {
    "id": "gempa",
    "title": "Mitigasi Gempa Bumi",
    "icon": "landslide",
    "missions": 15
  },
  {
    "id": "gunung",
    "title": "Vulkanologi & Erupsi Merapi",
    "icon": "volcano",
    "missions": 15
  },
  {
    "id": "proyek",
    "title": "Jalur Evakuasi & Grand Mission",
    "icon": "emoji_objects",
    "missions": 10
  }
];

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

export const MISSIONS: Mission[] = [
  {
    "id": "job_01",
    "category": "pengenalan",
    "level": 1,
    "title": "Job 1: Sinyal Status Normal",
    "icon": "school",
    "scenario": "Sistem pemantauan baru dipasang di Pos Pengamatan. Saat kondisi aman, sistem menyalakan Lampu Status Hijau sebagai tanda bahwa sistem aktif dan kondisi normal.",
    "objective": "Gunakan blok Sistem Mitigasi untuk menyalakan Lampu Status Hijau (Aman).",
    "hint": "Buka kategori Peringatan & EWS, ambil blok 'Atur Lampu Status ke [Aman (Hijau)]', lalu masukkan ke dalam 'Mulai Saat Dihidupkan'.",
    "steps": [
      {
        "title": "Kenali Misimu",
        "description": "Pasang indikator kesiapan sistem mitigasi pertama. Warga desa perlu melihat lampu hijau menyala tenang!",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Pilih Blok",
        "description": "Cari Peringatan & EWS -> 'Atur Lampu Status ke [Aman (Hijau)]'.",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Susun Blok",
        "description": "Seret ke dalam kotak Mulai Saat Dihidupkan di blok Sistem Mitigasi.",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Jalankan & Validasi",
        "description": "Klik tombol MULAI, periksa indikator lampu berubah hijau, lalu klik Validasi Misi!",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_lampu_status"
      ],
      "codeContains": [
        "api.setRgb"
      ],
      "ancestorConstraints": {
        "resq_lampu_status": "resq_program"
      }
    }
  },
  {
    "id": "job_02",
    "category": "pengenalan",
    "level": 2,
    "title": "Job 2: Sinyal Waspada & Siaga",
    "icon": "school",
    "scenario": "Perubahan aktivitas alam mulai terdeteksi. Petugas harus mampu mengubah warna lampu status ke Kuning (Waspada) lalu Oranye (Siaga) secara bertahap.",
    "objective": "Ganti lampu status ke Kuning, beri jeda 2 detik, lalu ganti ke Oranye.",
    "hint": "Gunakan blok 'Jeda Waktu' dari kategori Sistem di antara dua blok pengaturan lampu status.",
    "steps": [
      {
        "title": "Sinyal Bertahap",
        "description": "Tingkat status bahaya bencana memiliki 4 level: Normal, Waspada, Siaga, dan Awas.",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Kumpulkan Blok",
        "description": "Ambil 2x Lampu Status (Kuning & Oranye) dan 1x Jeda Waktu 2 detik.",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Susun Urutan",
        "description": "Rangkai: Lampu Status Kuning -> Jeda Waktu 2 detik -> Lampu Status Oranye.",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Uji Transisi",
        "description": "Jalankan simulasi dan amati perubahan warna lampu indikator di panel telemetri.",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_lampu_status",
        "resq_tunggu"
      ],
      "codeContains": [
        "api.setRgb",
        "api.delay"
      ],
      "ancestorConstraints": {
        "resq_lampu_status": "resq_program",
        "resq_tunggu": "resq_program"
      }
    }
  },
  {
    "id": "job_03",
    "category": "pengenalan",
    "level": 3,
    "title": "Job 3: Sinyal Bahaya Kritis & Sirine EWS",
    "icon": "school",
    "scenario": "Kondisi darurat terjadi! Sistem harus menyalakan Lampu Merah (Awas) dan membunyikan Sirine Peringatan Dini (EWS) selama 3 detik untuk memperingatkan warga.",
    "objective": "Nyalakan Lampu Status Merah dan bunyikan Sirine EWS selama 3 detik.",
    "hint": "Ambil blok 'Bunyikan Sirine EWS selama 3 detik' dari kategori Peringatan & EWS.",
    "steps": [
      {
        "title": "Alarm Darurat",
        "description": "Sirine EWS dan lampu merah adalah kombinasi audio-visual terpenting dalam evakuasi cepat.",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Pilih Blok",
        "description": "Ambil Lampu Status Merah dan Bunyikan Sirine EWS selama 3 detik.",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Pasang di Sistem",
        "description": "Masukkan kedua blok ke dalam Mulai Saat Dihidupkan.",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Bunyikan Sirine",
        "description": "Tekan MULAI dan dengarkan bunyi sirine EWS aktif bersama lampu merah!",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_lampu_status",
        "resq_sirine_ews"
      ],
      "codeContains": [
        "api.setRgb",
        "api.setBuzzer"
      ],
      "ancestorConstraints": {
        "resq_lampu_status": "resq_program",
        "resq_sirine_ews": "resq_program"
      }
    }
  },
  {
    "id": "job_04",
    "category": "pengenalan",
    "level": 4,
    "title": "Job 4: Pusat Informasi Publik (Layar OLED)",
    "icon": "school",
    "scenario": "Saat sirine berbunyi, warga seringkali panik karena tidak tahu apa yang terjadi. Sistem harus menampilkan instruksi jelas pada Layar Informasi Publik (OLED).",
    "objective": "Kirim pesan instruksi evakuasi ke Layar Informasi OLED.",
    "hint": "Gunakan blok 'Tampilkan di Layar Informasi' dari kategori Sistem dan ketik instruksi evakuasi.",
    "steps": [
      {
        "title": "Papan Informasi",
        "description": "Layar OLED SSD1306 di diorama berfungsi sebagai papan pengumuman digital bagi masyarakat desa.",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Pilih Blok",
        "description": "Ambil Sistem -> 'Tampilkan di Layar Informasi', lalu ketik pesan mitigasi.",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Rangkai Pesan",
        "description": "Masukkan ke dalam Mulai Saat Dihidupkan bersama status lampu siaga.",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Cek Tampilan",
        "description": "Jalankan simulasi dan baca teks pada kotak monitor OLED biru di panel telemetri!",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_layar_oled"
      ],
      "codeContains": [
        "api.setOledMessage"
      ],
      "ancestorConstraints": {
        "resq_layar_oled": "resq_program"
      }
    }
  },
  {
    "id": "job_05",
    "category": "pengenalan",
    "level": 5,
    "title": "Job 5: Uji Mandiri Semua Indikator (Diagnostic)",
    "icon": "school",
    "scenario": "Sebelum musim penghujan dan ancaman letusan tiba, tim BPBD melakukan pengujian mandiri berkala pada seluruh alarm dan lampu sebanyak 3 kali pengulangan.",
    "objective": "Gunakan blok 'Ulangi Aksi 3 kali' untuk membunyikan sirine dan menyalakan lampu secara berkala.",
    "hint": "Masukkan Sirine EWS dan Jeda Waktu ke dalam blok 'Ulangi Aksi 3 kali'.",
    "steps": [
      {
        "title": "Loop Uji Coba",
        "description": "Pengulangan otomatis memastikan seluruh sistem peringatan bekerja tanpa macet.",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Gunakan Loop",
        "description": "Ambil Sistem -> 'Ulangi Aksi [3] kali', lalu masukkan aksi sirine dan lampu di dalamnya.",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Rakit Pengujian",
        "description": "Pastikan blok berada di dalam loop pengulangan.",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Uji Siklus",
        "description": "Tekan MULAI dan saksikan alarm berulang 3 kali secara otomatis!",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_ulangi",
        "resq_sirine_ews"
      ],
      "codeContains": [
        "for (let",
        "api.setBuzzer"
      ],
      "ancestorConstraints": {
        "resq_ulangi": "resq_program",
        "resq_sirine_ews": "resq_program"
      }
    }
  },
  {
    "id": "job_06",
    "category": "pengenalan",
    "level": 6,
    "title": "Job 6: Simulasi Gempa Ringan (3.2 SR)",
    "icon": "school",
    "scenario": "Sesar lokal bergerak perlahan. Sensor mencatat getaran mikroseismik berkekuatan 3.2 Skala Richter. Simulasikan fenomena ini dan nyalakan lampu waspada.",
    "objective": "Aktifkan Simulasi Getaran Gempa tingkat Ringan dan atur status ke Waspada.",
    "hint": "Ambil blok 'Simulasi Getaran Gempa [Ringan (3-4 SR)]' dari kategori Simulasi Bencana.",
    "steps": [
      {
        "title": "Getaran Pertama",
        "description": "Gempa bumi ringan biasanya hanya menggetarkan jendela dan dirasakan orang yang diam.",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Pilih Blok",
        "description": "Ambil Simulasi Bencana -> 'Simulasi Getaran Gempa [Ringan (3-4 SR)]' dan Lampu Status Kuning.",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Pasang di Sistem",
        "description": "Letakkan di dalam Mulai Saat Dihidupkan.",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Lihat Seismograf",
        "description": "Jalankan dan amati grafik Seismograf melonjak dengan gelombang P kecil serta Skala Richter 3.4 SR!",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_gempa_sim",
        "resq_lampu_status"
      ],
      "codeContains": [
        "api.simGempa(1)"
      ],
      "ancestorConstraints": {
        "resq_gempa_sim": "resq_program",
        "resq_lampu_status": "resq_program"
      }
    }
  },
  {
    "id": "job_07",
    "category": "pengenalan",
    "level": 7,
    "title": "Job 7: Simulasi Gempa Sedang (5.5 SR)",
    "icon": "school",
    "scenario": "Guncangan gempa sedang berkekuatan 5.5 SR melanda. Di hardware, motor getar bergetar sedang dan audio gempa bergemuruh. Layar OLED memberi peringatan tetap tenang.",
    "objective": "Aktifkan Simulasi Getaran Gempa tingkat Sedang dan tampilkan pesan tetap tenang di OLED.",
    "hint": "Gunakan Simulasi Getaran Gempa [Sedang (5-6 SR)] dan blok Layar Informasi.",
    "steps": [
      {
        "title": "Guncangan Sedang",
        "description": "Benda-benda gantung berayun kuat dan perabot bergeser pada gempa 5.5 SR.",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Rakit Simulasi",
        "description": "Ambil Simulasi Bencana -> 'Simulasi Getaran Gempa [Sedang (5-6 SR)]' dan Sistem -> 'Tampilkan di Layar Informasi'.",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Periksa Telemetri",
        "description": "Amati amplitudo Seismograf membesar menjadi gelombang S yang rapat.",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Validasi",
        "description": "Klik Validasi setelah simulasi berjalan sempurna.",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_gempa_sim",
        "resq_layar_oled"
      ],
      "codeContains": [
        "api.simGempa(2)"
      ],
      "ancestorConstraints": {
        "resq_gempa_sim": "resq_program",
        "resq_layar_oled": "resq_program"
      }
    }
  },
  {
    "id": "job_08",
    "category": "pengenalan",
    "level": 8,
    "title": "Job 8: Simulasi Gempa Kuat (>7.0 SR)",
    "icon": "school",
    "scenario": "Gempa tektonik destruktif berkekuatan >7.0 Skala Richter mengguncang! Motor getar diorama bergetar maksimal, sirine EWS meraung, dan lampu darurat merah menyala!",
    "objective": "Aktifkan Simulasi Gempa Kuat bersama Lampu Status Merah dan Sirine EWS.",
    "hint": "Gunakan Simulasi Gempa Kuat (>7 SR) + Lampu Merah + Sirine EWS.",
    "steps": [
      {
        "title": "Guncangan Hebat",
        "description": "Gempa di atas 7 SR dapat meretakkan dinding dan meruntuhkan struktur bangunan yang rapuh.",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Susun Tanggap Darurat",
        "description": "Gabungkan Simulasi Gempa Kuat, Lampu Status Merah, dan Sirine EWS.",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Amati Puncak Gelombang",
        "description": "Seismograf akan menunjukkan lonjakan amplitudo merah maksimal!",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Validasi Hasil",
        "description": "Periksa bahwa Skala Richter mencapai level 7.4 SR di monitor telemetri.",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_gempa_sim",
        "resq_sirine_ews",
        "resq_lampu_status"
      ],
      "codeContains": [
        "api.simGempa(3)"
      ],
      "ancestorConstraints": {
        "resq_gempa_sim": "resq_program",
        "resq_sirine_ews": "resq_program",
        "resq_lampu_status": "resq_program"
      }
    }
  },
  {
    "id": "job_09",
    "category": "pengenalan",
    "level": 9,
    "title": "Job 9: Logika Otomatisasi Sirine Berdasarkan Getaran",
    "icon": "school",
    "scenario": "Tidak semua getaran memerlukan sirine keras agar warga tidak panik. Buat logika: Kalau getaran terdeteksi kuat, bunyikan sirine; selain itu cukup nyalakan lampu aman.",
    "objective": "Gunakan blok 'Kalau... Selain Itu' dengan kondisi 'Gempa Terdeteksi Kuat?'.",
    "hint": "Buka Pengambilan Keputusan untuk blok Kalau... Selain Itu, dan Pemantauan Alam untuk kondisi getaran kuat.",
    "steps": [
      {
        "title": "Logika Keputusan",
        "description": "Sistem cerdas harus mampu mengambil keputusan secara otomatis berdasarkan ambang batas sensor.",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Susun Kondisi",
        "description": "Kalau: 'Gempa Terdeteksi Kuat?' -> Maka: Sirine EWS + Lampu Merah -> Selain Itu: Lampu Hijau.",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Pasang di Loop",
        "description": "Letakkan logika ini di dalam Jalankan Terus-Menerus.",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Uji Logika",
        "description": "Jalankan simulasi dan uji respons logikanya.",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_jika_tidak",
        "resq_getar_kuat",
        "resq_sirine_ews"
      ],
      "codeContains": [
        "if (",
        "api.setBuzzer"
      ],
      "ancestorConstraints": {
        "resq_jika_tidak": "resq_program",
        "resq_getar_kuat": "resq_program",
        "resq_sirine_ews": "resq_program"
      }
    }
  },
  {
    "id": "job_10",
    "category": "pengenalan",
    "level": 10,
    "title": "Job 10: Analisis Gelombang Primer (P) dan Sekunder (S)",
    "icon": "school",
    "scenario": "Dalam seismologi, gelombang primer (P-wave) merambat lebih cepat dari gelombang sekunder (S-wave). Rancang simulasi yang memunculkan getaran ringan (P) lalu 2 detik kemudian guncangan kuat (S).",
    "objective": "Susun simulasi gempa ringan, jeda waktu 2 detik, lalu simulasi gempa kuat.",
    "hint": "Rangkai: Gempa Ringan -> Jeda 2 detik -> Gempa Kuat.",
    "steps": [
      {
        "title": "Fisika Seismik",
        "description": "Jeda antara gelombang P dan S adalah jendela emas bagi sistem EWS untuk memberi peringatan dini.",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Rakit Urutan Gelombang",
        "description": "1. Simulasi Gempa Ringan -> 2. Jeda Waktu 2 detik -> 3. Simulasi Gempa Kuat -> 4. Sirine EWS.",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Perhatikan Seismograf",
        "description": "Lihat transisi bentuk gelombang dari P kecil menjadi S lonjakan tajam pada canvas seismograf!",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Validasi Misi",
        "description": "Klik Validasi jika urutan gelombang telah teruji.",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_gempa_sim",
        "resq_tunggu"
      ],
      "codeContains": [
        "api.simGempa(1)",
        "api.simGempa(3)"
      ],
      "ancestorConstraints": {
        "resq_gempa_sim": "resq_program",
        "resq_tunggu": "resq_program"
      }
    }
  },
  {
    "id": "job_11",
    "category": "gempa",
    "level": 11,
    "title": "Job 11: Gempa Ringan Saat Jam Pelajaran",
    "icon": "landslide",
    "scenario": "Getaran ringan terasa saat jam pelajaran di lantai 2 gedung sekolah. Guru meminta siswa tidak panik dan menjauhi jendela kaca.",
    "objective": "Atur lokasi ke Gedung Sekolah, jalankan gempa ringan, dan tampilkan pesan tetap tenang.",
    "hint": "Gunakan blok Lokasi Kejadian [Gedung Sekolah], Gempa Ringan, dan Layar Informasi.",
    "steps": [
      {
        "title": "Situasi Sekolah",
        "description": "Siswa sedang belajar saat lantai bergetar halus. Kepanikan harus dicegah sejak awal!",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Pilih Lokasi & Gempa",
        "description": "Ambil Simulasi Bencana -> Lokasi: Gedung Sekolah dan Simulasi Gempa Ringan.",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Kirim Pesan",
        "description": "Tampilkan di Layar Informasi: 'TETAP TENANG - JAUHI KACA'.",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Uji Respon",
        "description": "Jalankan simulasi dan pastikan pesan terbaca jelas.",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_lokasi_mitigasi",
        "resq_gempa_sim",
        "resq_layar_oled"
      ],
      "codeContains": [
        "api.setLocation",
        "api.simGempa(1)"
      ],
      "ancestorConstraints": {
        "resq_lokasi_mitigasi": "resq_program",
        "resq_gempa_sim": "resq_program",
        "resq_layar_oled": "resq_program"
      }
    }
  },
  {
    "id": "job_12",
    "category": "gempa",
    "level": 12,
    "title": "Job 12: Protokol Drop, Cover, and Hold On",
    "icon": "landslide",
    "scenario": "Guncangan gempa meningkat menjadi kekuatan sedang (5.6 SR). Seluruh siswa wajib segera melakukan tindakan perlindungan diri di bawah meja kokoh!",
    "objective": "Aktifkan gempa sedang, bunyikan sirine EWS, dan tampilkan instruksi 'DROP COVER HOLD ON'.",
    "hint": "Gunakan Simulasi Gempa Sedang, Sirine EWS, dan Layar Informasi.",
    "steps": [
      {
        "title": "SOP Gempa",
        "description": "Drop (berlutut), Cover (lindungi kepala & leher di bawah meja), Hold on (pegang kaki meja kokoh).",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Rakit SOP",
        "description": "Pasang: Simulasi Gempa Sedang -> Sirine EWS 2 detik -> Tampilkan 'DROP COVER HOLD ON'.",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Cek Respon",
        "description": "Pastikan sirine berbunyi dan panduan mitigasi muncul di monitor.",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Validasi",
        "description": "Klik tombol Validasi Misi.",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_gempa_sim",
        "resq_sirine_ews",
        "resq_layar_oled"
      ],
      "codeContains": [
        "api.simGempa(2)",
        "api.setBuzzer"
      ],
      "ancestorConstraints": {
        "resq_gempa_sim": "resq_program",
        "resq_sirine_ews": "resq_program",
        "resq_layar_oled": "resq_program"
      }
    }
  },
  {
    "id": "job_13",
    "category": "gempa",
    "level": 13,
    "title": "Job 13: Gempa Kuat di Sekolah & Alarm Evakuasi",
    "icon": "landslide",
    "scenario": "Gempa kuat meretakkan dinding sekolah. Sirine alarm evakuasi harus meraung berulang agar seluruh gedung segera dikosongkan.",
    "objective": "Aktifkan gempa kuat dan bunyikan Alarm Darurat evakuasi berulang.",
    "hint": "Gunakan Simulasi Gempa Kuat dan blok Alarm Evakuasi dari Peringatan & EWS.",
    "steps": [
      {
        "title": "Evakuasi Gedung",
        "description": "Setelah guncangan hebat, seluruh penghuni gedung sekolah harus bersiap dievakuasi keluar.",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Kumpulkan Blok",
        "description": "Ambil Simulasi Gempa Kuat dan Alarm Evakuasi 3 kali.",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Rangkai",
        "description": "Pasang di dalam Mulai Saat Dihidupkan.",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Validasi",
        "description": "Jalankan dan amati sirine serta lampu darurat menyala sinkron.",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_gempa_sim",
        "resq_alarm_darurat"
      ],
      "codeContains": [
        "api.simGempa(3)"
      ],
      "ancestorConstraints": {
        "resq_gempa_sim": "resq_program",
        "resq_alarm_darurat": "resq_program"
      }
    }
  },
  {
    "id": "job_14",
    "category": "gempa",
    "level": 14,
    "title": "Job 14: Penentuan Jalur Evakuasi Lapangan Sekolah",
    "icon": "landslide",
    "scenario": "Guncangan utama reda. Siswa harus keluar kelas menuju titik kumpul tanpa saling dorong. Pilih jalur evakuasi aman menuju Lapangan Terbuka Sekolah!",
    "objective": "Pilih 'Jalur Lapangan Terbuka' dan buka titik kumpul lapangan.",
    "hint": "Gunakan blok 'Tentukan Jalur Evakuasi ke [Jalur Lapangan Terbuka]' dan 'Buka Posko [Titik Kumpul Lapangan]'.",
    "steps": [
      {
        "title": "Pilihan Evakuasi",
        "description": "Jangan menggunakan lift! Gunakan tangga darurat dan menuju lapangan terbuka jauh dari tiang & pohon tinggi.",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Pilih Rute",
        "description": "Ambil Aksi & Evakuasi -> Tentukan Jalur Evakuasi: Jalur Lapangan Terbuka.",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Buka Titik Kumpul",
        "description": "Tambahkan Buka Posko: Titik Kumpul Lapangan.",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Cek Rute",
        "description": "Jalankan simulasi dan amati rute evakuasi di panel telemetri berubah hijau aman!",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_jalur_evakuasi",
        "resq_posko"
      ],
      "codeContains": [
        "api.setEvacRoute",
        "api.setActiveShelter"
      ],
      "ancestorConstraints": {
        "resq_jalur_evakuasi": "resq_program",
        "resq_posko": "resq_program"
      }
    }
  },
  {
    "id": "job_15",
    "category": "gempa",
    "level": 15,
    "title": "Job 15: Evaluasi Keselamatan Sekolah & Absensi",
    "icon": "landslide",
    "scenario": "Seluruh siswa telah berkumpul di lapangan terbuka sekolah. Guru memastikan semua siswa selamat dan menyalakan lampu status aman.",
    "objective": "Tampilkan pesan 'SEMUA SISWA SELAMAT DI LAPANGAN' dan nyalakan Lampu Status Hijau.",
    "hint": "Gunakan blok Layar Informasi dan Lampu Status Hijau.",
    "steps": [
      {
        "title": "Hitung Jumlah Siswa",
        "description": "Ketua kelas dan guru menghitung absensi untuk memastikan tidak ada siswa tertinggal di dalam kelas.",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Kirim Laporan",
        "description": "Tampilkan di Layar Informasi: 'SEMUA SISWA LENGKAP & AMAN'.",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Status Aman",
        "description": "Nyalakan Lampu Status Hijau.",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Selesai Quest Sekolah",
        "description": "Validasi misi untuk menuntaskan bab mitigasi sekolah!",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_layar_oled",
        "resq_lampu_status"
      ],
      "codeContains": [
        "api.setOledMessage",
        "api.setRgb('green')"
      ],
      "ancestorConstraints": {
        "resq_layar_oled": "resq_program",
        "resq_lampu_status": "resq_program"
      }
    }
  },
  {
    "id": "job_16",
    "category": "gempa",
    "level": 16,
    "title": "Job 16: Deteksi Gempa Malam Hari di Pemukiman",
    "icon": "landslide",
    "scenario": "Pukul 02.00 dini hari gempa sedang terjadi saat warga tertidur lelap. Sistem penerangan darurat otomatis harus menyala agar warga tidak panik dalam kegelapan.",
    "objective": "Atur lokasi ke Pemukiman Warga, aktifkan gempa sedang, dan nyalakan lampu darurat.",
    "hint": "Gunakan Lokasi: Pemukiman Warga, Gempa Sedang, dan Lampu Status Kuning.",
    "steps": [
      {
        "title": "Gempa Malam Hari",
        "description": "Kegelapan malam memperparah kepanikan. Lampu darurat otomatis membantu warga mencari jalan keluar.",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Rakit Skenario",
        "description": "Pasang Lokasi: Pemukiman Warga -> Gempa Sedang -> Lampu Status Kuning.",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Tampilkan Info",
        "description": "Kirim pesan: 'GEMPA TERDETEKSI - BANGUN DENGAN TENANG'.",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Validasi",
        "description": "Uji coba dan validasi misi.",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_lokasi_mitigasi",
        "resq_gempa_sim",
        "resq_lampu_status"
      ],
      "codeContains": [
        "api.setLocation",
        "api.simGempa(2)"
      ],
      "ancestorConstraints": {
        "resq_lokasi_mitigasi": "resq_program",
        "resq_gempa_sim": "resq_program",
        "resq_lampu_status": "resq_program"
      }
    }
  },
  {
    "id": "job_17",
    "category": "gempa",
    "level": 17,
    "title": "Job 17: Bahaya Sekunder: Pemadaman Kompor & Gas",
    "icon": "landslide",
    "scenario": "Gempa bumi sering memicu kebakaran hebat akibat kebocoran pipa gas dan kompor yang menyala saat guncangan. Buat peringatan untuk mematikan kompor segera.",
    "objective": "Jika gempa terdeteksi, tampilkan peringatan 'MATIKAN KOMPOR & LISTRIK' dan bunyikan sirine EWS.",
    "hint": "Gunakan Gempa Sedang, Sirine EWS, dan Layar Informasi.",
    "steps": [
      {
        "title": "Bahaya Sekunder",
        "description": "Kebakaran pasca-gempa seringkali menelan korban lebih banyak daripada guncangan itu sendiri.",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Peringatan Kompor",
        "description": "Tampilkan instruksi darurat: 'MATIKAN KOMPOR GAS & PANEL LISTRIK'.",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Bunyikan Alarm",
        "description": "Nyalakan sirine EWS selama 3 detik.",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Validasi Misi",
        "description": "Tekan MULAI dan klik Validasi Misi.",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_gempa_sim",
        "resq_sirine_ews",
        "resq_layar_oled"
      ],
      "codeContains": [
        "api.simGempa",
        "api.setOledMessage"
      ],
      "ancestorConstraints": {
        "resq_gempa_sim": "resq_program",
        "resq_sirine_ews": "resq_program",
        "resq_layar_oled": "resq_program"
      }
    }
  },
  {
    "id": "job_18",
    "category": "gempa",
    "level": 18,
    "title": "Job 18: Penentuan Jalur Evakuasi Jalan Lapang RT",
    "icon": "landslide",
    "scenario": "Gang sempit pemukiman padat dipenuhi puing genteng jatuh dan kabel putus. Warga harus diarahkan melalui jalan lapang menuju lapangan balai RW.",
    "objective": "Tentukan jalur evakuasi ke Jalur Lapangan Terbuka dan arahkan ke balai desa.",
    "hint": "Gunakan blok 'Tentukan Jalur Evakuasi ke [Jalur Lapangan Terbuka]'.",
    "steps": [
      {
        "title": "Gang Padat Bahaya",
        "description": "Genteng jatuh, pecahan kaca jendela, dan tembok pagar rentan roboh saat gempa di gang sempit.",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Pilih Rute Lapang",
        "description": "Ambil Tentukan Jalur Evakuasi: Jalur Lapangan Terbuka.",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Hubungkan Posko",
        "description": "Tambahkan Buka Posko: Titik Kumpul Lapangan.",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Validasi Rute",
        "description": "Pastikan rute aman terpilih di monitor telemetri.",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_jalur_evakuasi"
      ],
      "codeContains": [
        "api.setEvacRoute"
      ],
      "ancestorConstraints": {
        "resq_jalur_evakuasi": "resq_program"
      }
    }
  },
  {
    "id": "job_19",
    "category": "gempa",
    "level": 19,
    "title": "Job 19: Monitoring Gempa Susulan (Aftershock)",
    "icon": "landslide",
    "scenario": "Setelah gempa utama mereda, warga dilarang terburu-buru masuk ke dalam rumah karena struktur bangunan sudah rapuh. Sistem harus memantau gempa susulan berkala.",
    "objective": "Buat jeda waktu 3 detik setelah gempa pertama, lalu aktifkan gempa susulan ringan dan peringatkan warga tetap di luar.",
    "hint": "Rangkai: Gempa Sedang -> Jeda 3 detik -> Gempa Ringan -> Layar Informasi 'WASPADA GEMPA SUSULAN'.",
    "steps": [
      {
        "title": "Gempa Susulan",
        "description": "Aftershock berkekuatan lebih kecil tetap bisa meruntuhkan bangunan yang sudah mengalami keretakan.",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Rakit Rangkaian",
        "description": "Gempa Sedang -> Jeda 3 detik -> Gempa Ringan -> Tampilkan 'WASPADA GEMPA SUSULAN'.",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Perhatikan Grafik",
        "description": "Lihat di Seismograf muncul dua episode gelombang gempa berurutan!",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Validasi",
        "description": "Klik Validasi Misi.",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_gempa_sim",
        "resq_tunggu",
        "resq_layar_oled"
      ],
      "codeContains": [
        "api.simGempa(2)",
        "api.delay",
        "api.simGempa(1)"
      ],
      "ancestorConstraints": {
        "resq_gempa_sim": "resq_program",
        "resq_tunggu": "resq_program",
        "resq_layar_oled": "resq_program"
      }
    }
  },
  {
    "id": "job_20",
    "category": "gempa",
    "level": 20,
    "title": "Job 20: Penyelamatan Warga Rentan ke Pos Medis",
    "icon": "landslide",
    "scenario": "Tim relawan warga mendata korban cedera dan mendahulukan evakuasi warga lanjut usia serta balita menuju Posko Medis BPBD.",
    "objective": "Buka Posko Medis BPBD dan arahkan ambulans relawan.",
    "hint": "Gunakan blok Buka Posko [Posko Medis BPBD] dan Lampu Status Hijau.",
    "steps": [
      {
        "title": "Kelompok Rentan",
        "description": "Lansia, ibu hamil, balita, dan penyandang disabilitas mendapat prioritas evakuasi pertama.",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Aktifkan Posko Medis",
        "description": "Ambil Aksi & Evakuasi -> Buka Posko: Posko Medis BPBD.",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Nyalakan Indikator",
        "description": "Atur Lampu Status ke Hijau dan tampilkan info kesiapan medis.",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Selesai Misi RT",
        "description": "Validasi misi untuk menyelesaikan studi kasus pemukiman warga!",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_posko",
        "resq_lampu_status"
      ],
      "codeContains": [
        "api.setActiveShelter",
        "api.setRgb"
      ],
      "ancestorConstraints": {
        "resq_posko": "resq_program",
        "resq_lampu_status": "resq_program"
      }
    }
  },
  {
    "id": "job_21",
    "category": "gempa",
    "level": 21,
    "title": "Job 21: Gempa Kuat di Rumah Sakit Daerah",
    "icon": "landslide",
    "scenario": "Ruang rawat inap RS Harapan Desa terguncang hebat akibat gempa 7.2 SR. Sistem harus menyalakan alarm triase darurat dan lampu merah.",
    "objective": "Atur lokasi ke Rumah Sakit, aktifkan Gempa Kuat, dan nyalakan Lampu Merah serta Sirine EWS.",
    "hint": "Gunakan Lokasi: Rumah Sakit, Gempa Kuat, Lampu Merah, dan Sirine EWS.",
    "steps": [
      {
        "title": "Kedaruratan Medis",
        "description": "Pasien dengan infus dan alat bantu napas membutuhkan penanganan khusus saat gedung RS berguncang.",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Rakit Alarm RS",
        "description": "Lokasi: Rumah Sakit -> Gempa Kuat -> Lampu Merah -> Sirine EWS.",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Kirim Pesan Triase",
        "description": "Tampilkan: 'DARURAT RS - EVAKUASI PASIEN KRITIS'.",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Validasi",
        "description": "Jalankan simulasi dan klik Validasi Misi.",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_lokasi_mitigasi",
        "resq_gempa_sim",
        "resq_lampu_status",
        "resq_sirine_ews"
      ],
      "codeContains": [
        "api.setLocation",
        "api.simGempa(3)"
      ],
      "ancestorConstraints": {
        "resq_lokasi_mitigasi": "resq_program",
        "resq_gempa_sim": "resq_program",
        "resq_lampu_status": "resq_program",
        "resq_sirine_ews": "resq_program"
      }
    }
  },
  {
    "id": "job_22",
    "category": "gempa",
    "level": 22,
    "title": "Job 22: Pembukaan Jalur Khusus Ambulans & Triase",
    "icon": "landslide",
    "scenario": "Jalur gerbang utama harus steril dari kendaraan pribadi agar ambulans dapat keluar masuk tanpa hambatan mengangkut korban gempa.",
    "objective": "Tentukan Jalur Evakuasi dan buka Posko Medis BPBD untuk evakuasi darurat.",
    "hint": "Gunakan Jalur Evakuasi dan Posko Medis BPBD.",
    "steps": [
      {
        "title": "Jalur Steril",
        "description": "Ambulans membutuhkan jalur bebas hambatan untuk menyelamatkan nyawa korban luka berat.",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Buka Akses",
        "description": "Pasang Tentukan Jalur Evakuasi dan Buka Posko: Posko Medis BPBD.",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Tampilkan Rute",
        "description": "Tampilkan di Layar Informasi: 'JALUR STERIL AMBULANS AKTIF'.",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Validasi",
        "description": "Klik tombol Validasi Misi.",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_jalur_evakuasi",
        "resq_posko"
      ],
      "codeContains": [
        "api.setEvacRoute",
        "api.setActiveShelter"
      ],
      "ancestorConstraints": {
        "resq_jalur_evakuasi": "resq_program",
        "resq_posko": "resq_program"
      }
    }
  },
  {
    "id": "job_23",
    "category": "gempa",
    "level": 23,
    "title": "Job 23: Gempa di Area Jembatan (Bahaya Likuefaksi)",
    "icon": "landslide",
    "scenario": "Gempa memicu fenomena likuefaksi (tanah berpasir dekat sungai mencair dan ambles). Fondasi jembatan retak berbahaya dan tidak boleh dilintasi!",
    "objective": "Atur lokasi ke Dekat Jembatan Sungai, aktifkan gempa kuat, dan beri peringatan jembatan retak.",
    "hint": "Gunakan Lokasi: Dekat Jembatan Sungai, Gempa Kuat, dan Layar Informasi.",
    "steps": [
      {
        "title": "Likuefaksi Tanah",
        "description": "Getaran gempa dapat membuat tanah jenuh air kehilangan kekuatannya dan mencair seperti lumpur hisap.",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Rakit Lokasi Jembatan",
        "description": "Lokasi: Dekat Jembatan Sungai -> Gempa Kuat -> Tampilkan: 'JEMBATAN RETAK - JANGAN DILINTASI'.",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Sinyal Bahaya",
        "description": "Nyalakan Lampu Status Merah.",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Validasi",
        "description": "Jalankan dan klik Validasi.",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_lokasi_mitigasi",
        "resq_gempa_sim",
        "resq_layar_oled"
      ],
      "codeContains": [
        "api.setLocation",
        "api.simGempa(3)"
      ],
      "ancestorConstraints": {
        "resq_lokasi_mitigasi": "resq_program",
        "resq_gempa_sim": "resq_program",
        "resq_layar_oled": "resq_program"
      }
    }
  },
  {
    "id": "job_24",
    "category": "gempa",
    "level": 24,
    "title": "Job 24: Pengalihan Rute Menjauhi Jembatan Retak",
    "icon": "landslide",
    "scenario": "Jalur terpendek melewati jembatan retak yang rawan runtuh. Siswa harus mengarahkan rute memutar yang kokoh melalui Jalur Lingkar Utama menuju posko aman.",
    "objective": "Pilih Jalur Lingkar Utama (Bebas Lahar/Jembatan Rusak) untuk mengalihkan arus evakuasi warga.",
    "hint": "Gunakan blok 'Tentukan Jalur Evakuasi ke [Jalur Lingkar Utama (Bebas Lahar)]'.",
    "steps": [
      {
        "title": "Pengalihan Rute",
        "description": "Jangan memaksakan lewat jembatan yang retak! Lebih baik memutar sedikit asalkan jalurnya aman dan kokoh.",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Pilih Jalur Lingkar",
        "description": "Ambil Tentukan Jalur Evakuasi: Jalur Lingkar Utama (Bebas Lahar).",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Buka Posko",
        "description": "Arahkan warga menuju Barak Pengungsian Terpadu (KRB I).",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Cek Rute Peta",
        "description": "Pastikan rute lingkar aman terpilih di panel telemetri.",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_jalur_evakuasi",
        "resq_posko"
      ],
      "codeContains": [
        "api.setEvacRoute('Jalur Lingkar Utama"
      ],
      "ancestorConstraints": {
        "resq_jalur_evakuasi": "resq_program",
        "resq_posko": "resq_program"
      }
    }
  },
  {
    "id": "job_25",
    "category": "gempa",
    "level": 25,
    "title": "Job 25: Pusat Komando Bencana Rumah Sakit & Wilayah",
    "icon": "landslide",
    "scenario": "Mengintegrasikan seluruh sistem pemantauan gempa, pengalihan jembatan, dan posko medis ke dalam pusat komando terpadu.",
    "objective": "Susun alur lengkap: Deteksi Gempa Kuat -> Sirine EWS -> Alihkan Jalur Lingkar -> Buka Posko Medis.",
    "hint": "Gunakan Gempa Kuat, Sirine EWS, Jalur Lingkar, dan Posko Medis.",
    "steps": [
      {
        "title": "Pusat Komando",
        "description": "Koordinasi cepat antara rumah sakit, relawan, dan BPBD menyelamatkan ratusan warga saat gempa besar.",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Rakit Alur Penuh",
        "description": "1. Gempa Kuat -> 2. Sirine EWS -> 3. Jalur Lingkar Utama -> 4. Posko Medis BPBD.",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Uji Sistem Lengkap",
        "description": "Jalankan simulasi dan periksa seluruh indikator di panel telemetri.",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Selesai Quest Gempa",
        "description": "Selamat! Kamu telah menuntaskan seluruh studi kasus gempa bumi!",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_gempa_sim",
        "resq_sirine_ews",
        "resq_jalur_evakuasi",
        "resq_posko"
      ],
      "codeContains": [
        "api.simGempa(3)",
        "api.setEvacRoute"
      ],
      "ancestorConstraints": {
        "resq_gempa_sim": "resq_program",
        "resq_sirine_ews": "resq_program",
        "resq_jalur_evakuasi": "resq_program",
        "resq_posko": "resq_program"
      }
    }
  },
  {
    "id": "job_26",
    "category": "gunung",
    "level": 26,
    "title": "Job 26: Deteksi Gempa Vulkanik Dalam Merapi",
    "icon": "volcano",
    "scenario": "Pos Pengamatan Gunung Merapi mendeteksi ratusan getaran gempa vulkanik per hari. Ini adalah tanda magma di perut bumi mendesak naik ke kubah lava.",
    "objective": "Simulasikan getaran vulkanik ringan dan atur lampu status ke Kuning (Waspada).",
    "hint": "Gunakan Simulasi Getaran Gempa [Ringan] dan Lampu Status [Kuning (Waspada)].",
    "steps": [
      {
        "title": "Tanda Awal Magma",
        "description": "Magma yang naik mendesak dan memecahkan lapisan batuan, menghasilkan gempa vulkanik (volcanic tremor).",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Rakit Skenario",
        "description": "Gempa Ringan -> Lampu Status Kuning -> Tampilkan 'GEMPA VULKANIK TERDETEKSI'.",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Cek Seismograf",
        "description": "Amati tremor halus di seismograf dan lampu kuning menyala.",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Validasi",
        "description": "Klik tombol Validasi Misi.",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_gempa_sim",
        "resq_lampu_status"
      ],
      "codeContains": [
        "api.simGempa(1)",
        "api.setRgb('yellow')"
      ],
      "ancestorConstraints": {
        "resq_gempa_sim": "resq_program",
        "resq_lampu_status": "resq_program"
      }
    }
  },
  {
    "id": "job_27",
    "category": "gunung",
    "level": 27,
    "title": "Job 27: Pemantauan Suhu Termal Kawah & Fumarol",
    "icon": "volcano",
    "scenario": "Suhu kawah meningkat dari normal 27°C menjadi 45°C disertai pelepasan gas fumarol solfatara. Aktifkan simulasi status Waspada.",
    "objective": "Jalankan Simulasi Erupsi Merapi status Waspada dan tampilkan suhu kawah.",
    "hint": "Gunakan blok 'Simulasi Erupsi Merapi [Waspada (Fase 1)]'.",
    "steps": [
      {
        "title": "Termal Kawah",
        "description": "Peningkatan suhu kawah menandakan kubah lava mulai memanas aktif dan gas magmatik mendesak ke permukaan.",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Pilih Blok Merapi",
        "description": "Ambil Simulasi Bencana -> 'Simulasi Erupsi Merapi [Waspada (Fase 1)]'.",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Perhatikan Gauge Suhu",
        "description": "Suhu kawah di panel telemetri akan naik ke angka 43.8°C!",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Validasi",
        "description": "Klik Validasi setelah suhu terkonfirmasi naik.",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_gunung_sim"
      ],
      "codeContains": [
        "api.simGunung('WASPADA'"
      ],
      "ancestorConstraints": {
        "resq_gunung_sim": "resq_program"
      }
    }
  },
  {
    "id": "job_28",
    "category": "gunung",
    "level": 28,
    "title": "Job 28: Tremor Menerus & Kenaikan Status ke Siaga",
    "icon": "volcano",
    "scenario": "Getaran tremor seismik berlangsung tanpa henti. Suhu kawah mencapai 70°C. BPBD menaikkan status menjadi SIAGA (Lampu Oranye).",
    "objective": "Aktifkan Simulasi Merapi status Siaga dan atur Lampu Status ke Oranye.",
    "hint": "Gunakan Simulasi Merapi [Siaga (Fase 2)] dan Lampu Status [Oranye].",
    "steps": [
      {
        "title": "Status Siaga",
        "description": "Pada status Siaga, warga di lereng atas mulai mengamankan ternak dan menyiapkan tas siaga bencana.",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Pasang Status Siaga",
        "description": "Simulasi Merapi [Siaga] -> Lampu Status Oranye -> Tampilkan 'STATUS SIAGA - SIAPKAN TAS BENCANA'.",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Amati Termometer",
        "description": "Suhu kawah melonjak ke 68.4°C dan lampu oranye menyala!",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Validasi",
        "description": "Klik tombol Validasi Misi.",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_gunung_sim",
        "resq_lampu_status"
      ],
      "codeContains": [
        "api.simGunung('SIAGA'",
        "api.setRgb('orange')"
      ],
      "ancestorConstraints": {
        "resq_gunung_sim": "resq_program",
        "resq_lampu_status": "resq_program"
      }
    }
  },
  {
    "id": "job_29",
    "category": "gunung",
    "level": 29,
    "title": "Job 29: Kausalitas Vulkanik: Gempa Mendahului Erupsi",
    "icon": "volcano",
    "scenario": "Hukum IPA Vulkanologi: Erupsi tidak bisa terjadi tanpa didahului gempa vulkanik! Susun gempa vulkanik terlebih dahulu, jeda 2 detik, lalu aktifkan erupsi Merapi status Awas.",
    "objective": "Susun urutan kausalitas: Gempa Sedang -> Jeda 2 detik -> Erupsi Merapi Status Awas.",
    "hint": "Rangkai: Gempa Sedang -> Jeda Waktu 2 detik -> Simulasi Erupsi Merapi [Awas].",
    "steps": [
      {
        "title": "Prinsip Kausalitas",
        "description": "Secara vulkanologi, naiknya magma selalu meretakkan batuan kerak bumi terlebih dahulu.",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Susun Urutan Benar",
        "description": "1. Simulasi Gempa Sedang -> 2. Jeda Waktu 2 detik -> 3. Simulasi Erupsi Merapi [Awas].",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Lihat Efek Hardware",
        "description": "Motor bergetar sesaat sebelum letusan dimulai di diorama!",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Validasi Kausalitas",
        "description": "Validasi misi ilmiah ini.",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_gempa_sim",
        "resq_tunggu",
        "resq_gunung_sim"
      ],
      "codeContains": [
        "api.simGempa",
        "api.delay",
        "api.simGunung('AWAS'"
      ],
      "ancestorConstraints": {
        "resq_gempa_sim": "resq_program",
        "resq_tunggu": "resq_program",
        "resq_gunung_sim": "resq_program"
      }
    }
  },
  {
    "id": "job_30",
    "category": "gunung",
    "level": 30,
    "title": "Job 30: Menghidupkan Asap Kawah Humidifier Fisik",
    "icon": "volcano",
    "scenario": "Uji coba modul mist maker (humidifier) pada diorama ESP32 untuk menyemburkan kabut uap asap letusan putih dari lubang kawah.",
    "objective": "Aktifkan Erupsi Merapi status Awas dan bunyikan sirine EWS.",
    "hint": "Gunakan Simulasi Erupsi Merapi [Awas] dan Sirine EWS.",
    "steps": [
      {
        "title": "Uap Asap Fisik",
        "description": "Di hardware, pin MIST_PIN 26 mengaktifkan ultrasonic mist maker untuk menghasilkan efek asap letusan nyata.",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Rakit Asap & Alarm",
        "description": "Simulasi Erupsi Merapi [Awas] -> Sirine EWS 3 detik -> Lampu Status Merah.",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Periksa Mist",
        "description": "Status Asap Mist di panel aktuator akan menyala 'MENYEMBUR'!",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Validasi",
        "description": "Klik Validasi Misi.",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_gunung_sim",
        "resq_sirine_ews"
      ],
      "codeContains": [
        "api.simGunung('AWAS'",
        "api.setBuzzer"
      ],
      "ancestorConstraints": {
        "resq_gunung_sim": "resq_program",
        "resq_sirine_ews": "resq_program"
      }
    }
  },
  {
    "id": "job_31",
    "category": "gunung",
    "level": 31,
    "title": "Job 31: Karakteristik Erupsi Efusif (Lava Pijar)",
    "icon": "volcano",
    "scenario": "Kubah lava Gunung Merapi runtuh perlahan. Terjadi guguran lava pijar yang merayap menuruni lereng tanpa ledakan besar.",
    "objective": "Aktifkan Simulasi Erupsi Merapi tipe Efusif dan atur lampu status ke Oranye (Siaga).",
    "hint": "Gunakan Simulasi Erupsi Merapi [Siaga, Tipe: Efusif] dan Lampu Status Oranye.",
    "steps": [
      {
        "title": "Erupsi Efusif",
        "description": "Erupsi efusif terjadi karena magma memiliki viskositas encer dan tekanan gas rendah, menghasilkan lelehan lava.",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Pilih Tipe Efusif",
        "description": "Pilih Simulasi Erupsi Merapi dengan opsi 'Efusif (Lelehan Lava Pijar)'.",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Amati Indikator",
        "description": "Di panel telemetri akan muncul badge 'Tipe Letusan: EFUSIF (Lava Pijar)'.",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Validasi",
        "description": "Klik tombol Validasi Misi.",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_gunung_sim",
        "resq_lampu_status"
      ],
      "codeContains": [
        "api.simGunung('SIAGA', 'EFUSIF')"
      ],
      "ancestorConstraints": {
        "resq_gunung_sim": "resq_program",
        "resq_lampu_status": "resq_program"
      }
    }
  },
  {
    "id": "job_32",
    "category": "gunung",
    "level": 32,
    "title": "Job 32: Pemetaan Alur Bahaya Lava di Bantaran Sungai",
    "icon": "volcano",
    "scenario": "Lava pijar bersuhu >800°C mengalir mengikuti alur lembah sungai. Pemukiman di dekat bantaran sungai berada di zona bahaya tinggi.",
    "objective": "Tampilkan peringatan 'ZONA BAHAYA LAVA: KOSONGKAN BANTARAN SUNGAI' di layar OLED.",
    "hint": "Gunakan blok Layar Informasi dan Lampu Status Oranye.",
    "steps": [
      {
        "title": "Lembah Sungai Merapi",
        "description": "Sungai seperti Kali Boyong, Krasak, dan Gendol menjadi saluran alami aliran lava pijar.",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Peringatan Sungai",
        "description": "Tampilkan di Layar Informasi: 'KOSONGKAN BANTARAN SUNGAI RADIUS 500 METER'.",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Status Waspada",
        "description": "Nyalakan Lampu Status Oranye.",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Validasi",
        "description": "Klik tombol Validasi Misi.",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_layar_oled",
        "resq_lampu_status"
      ],
      "codeContains": [
        "api.setOledMessage",
        "api.setRgb"
      ],
      "ancestorConstraints": {
        "resq_layar_oled": "resq_program",
        "resq_lampu_status": "resq_program"
      }
    }
  },
  {
    "id": "job_33",
    "category": "gunung",
    "level": 33,
    "title": "Job 33: Sistem Peringatan Dini Bantaran Sungai",
    "icon": "volcano",
    "scenario": "Mengaktifkan sirine berkala untuk mengingatkan penambang pasir dan warga pinggir sungai agar segera mengevakuasi diri ke tempat tinggi.",
    "objective": "Gunakan pengulangan 3 kali untuk membunyikan sirine berkala.",
    "hint": "Gunakan blok 'Ulangi Aksi 3 kali', Sirine EWS, dan Jeda Waktu.",
    "steps": [
      {
        "title": "Sirine Bantaran",
        "description": "Sirine di pos pantau sungai memperingatkan penambang pasir dan warga lereng bawah.",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Rakit Loop",
        "description": "Ulangi 3 kali: Sirine EWS 1 detik -> Jeda Waktu 1 detik.",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Cek Siklus",
        "description": "Pastikan sirine berbunyi berkala 3 kali.",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Validasi",
        "description": "Klik Validasi Misi.",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_ulangi",
        "resq_sirine_ews"
      ],
      "codeContains": [
        "for (let",
        "api.setBuzzer"
      ],
      "ancestorConstraints": {
        "resq_ulangi": "resq_program",
        "resq_sirine_ews": "resq_program"
      }
    }
  },
  {
    "id": "job_34",
    "category": "gunung",
    "level": 34,
    "title": "Job 34: Jalur Evakuasi Efusif: Menjauhi Lembah Sungai",
    "icon": "volcano",
    "scenario": "Siswa memilih rute evakuasi warga lereng: Menghindari jalan setapak pinggir kali menuju jalur lingkar bukit bebas lava!",
    "objective": "Tentukan Jalur Evakuasi ke 'Jalur Lingkar Utama (Bebas Lahar)' dan buka Barak Pengungsian.",
    "hint": "Gunakan blok 'Tentukan Jalur Evakuasi ke [Jalur Lingkar Utama (Bebas Lahar)]'.",
    "steps": [
      {
        "title": "Keputusan Mitigasi",
        "description": "Jangan menyusuri sungai! Menanjaklah ke punggung bukit menjauhi alur lembah sungai.",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Pilih Jalur Aman",
        "description": "Ambil Tentukan Jalur Evakuasi: Jalur Lingkar Utama (Bebas Lahar).",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Buka Barak KRB I",
        "description": "Tambahkan Buka Posko: Barak Pengungsian Terpadu (KRB I).",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Cek Rute Hijau",
        "description": "Rute aman di panel telemetri akan berstatus aman!",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_jalur_evakuasi",
        "resq_posko"
      ],
      "codeContains": [
        "api.setEvacRoute('Jalur Lingkar Utama",
        "api.setActiveShelter"
      ],
      "ancestorConstraints": {
        "resq_jalur_evakuasi": "resq_program",
        "resq_posko": "resq_program"
      }
    }
  },
  {
    "id": "job_35",
    "category": "gunung",
    "level": 35,
    "title": "Job 35: Bahaya Lahar Dingin Saat Terjadi Hujan Puncak",
    "icon": "volcano",
    "scenario": "Hujan lebat di puncak gunung menghanyutkan endapan material vulkanik menjadi banjir lahar dingin dahsyat di sungai. Nyalakan sirine dan lampu merah!",
    "objective": "Aktifkan Sirine EWS, Lampu Merah, dan tampilkan 'BAHAYA BANJIR LAHAR DINGIN DI SUNGAI'.",
    "hint": "Gunakan Sirine EWS, Lampu Merah, dan Layar Informasi.",
    "steps": [
      {
        "title": "Lahar Hujan / Dingin",
        "description": "Air hujan bercampur pasir dan batu besar membentuk aliran lumpur padat berkecepatan tinggi yang merusak jembatan.",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Rakit Alarm Lahar",
        "description": "Lampu Status Merah -> Sirine EWS 3 detik -> Tampilkan 'BAHAYA LAHAR DINGIN'.",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Jalur Menjauh",
        "description": "Pastikan rute tetap mengarah menjauhi sungai.",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Selesai Quest Efusif",
        "description": "Validasi misi untuk menuntaskan bab erupsi efusif!",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_lampu_status",
        "resq_sirine_ews",
        "resq_layar_oled"
      ],
      "codeContains": [
        "api.setRgb('red')",
        "api.setBuzzer"
      ],
      "ancestorConstraints": {
        "resq_lampu_status": "resq_program",
        "resq_sirine_ews": "resq_program",
        "resq_layar_oled": "resq_program"
      }
    }
  },
  {
    "id": "job_36",
    "category": "gunung",
    "level": 36,
    "title": "Job 36: Karakteristik Erupsi Eksplosif (Ledakan & Abu)",
    "icon": "volcano",
    "scenario": "Tekanan gas magma tinggi mendobrak sumbat kawah! Terjadi ledakan dahsyat dengan kolom abu vertikal setinggi 5 km dan awan panas.",
    "objective": "Aktifkan Simulasi Erupsi Merapi tipe Eksplosif status Awas bersama Lampu Merah dan Sirine EWS.",
    "hint": "Gunakan Simulasi Erupsi Merapi [Awas, Tipe: Eksplosif], Lampu Merah, dan Sirine EWS.",
    "steps": [
      {
        "title": "Letusan Eksplosif",
        "description": "Gas terlarut dalam magma andesitik melepaskan energi secara mendadak, menghasilkan dentuman dan semburan piroklastik.",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Rakit Eksplosif",
        "description": "Simulasi Erupsi Merapi [Awas, Tipe: Eksplosif] -> Lampu Merah -> Sirine EWS 4 detik.",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Amati Partikel & Asap",
        "description": "Di hardware mist maker menyembur kencang dan panel telemetri menampilkan status AWAS Eksplosif!",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Validasi",
        "description": "Klik tombol Validasi Misi.",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_gunung_sim",
        "resq_lampu_status",
        "resq_sirine_ews"
      ],
      "codeContains": [
        "api.simGunung('AWAS', 'EKSPLOSIF')",
        "api.setRgb('red')"
      ],
      "ancestorConstraints": {
        "resq_gunung_sim": "resq_program",
        "resq_lampu_status": "resq_program",
        "resq_sirine_ews": "resq_program"
      }
    }
  },
  {
    "id": "job_37",
    "category": "gunung",
    "level": 37,
    "title": "Job 37: Peringatan Awan Panas Piroklastik",
    "icon": "volcano",
    "scenario": "Awan panas (wedhus gembel) bersuhu 600°C bergulung menuruni lereng dengan kecepatan 200 km/jam. Tidak ada waktu menunggu, evakuasi kilat harus dilakukan!",
    "objective": "Tampilkan pesan 'AWAS AWAN PANAS - EVAKUASI SEGERA' dan bunyikan alarm darurat.",
    "hint": "Gunakan Layar Informasi dan Alarm Darurat.",
    "steps": [
      {
        "title": "Awan Panas / Piroklastik",
        "description": "Campuran gas panas, abu, dan batu pijar yang meluncur cepat menuruni lembah lereng.",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Alarm Kilat",
        "description": "Alarm Darurat 3 kali -> Tampilkan 'AWAS AWAN PANAS - EVAKUASI SEGERA'.",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Bunyikan Alarm",
        "description": "Pastikan sirine dan lampu berkedip cepat.",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Validasi",
        "description": "Klik tombol Validasi Misi.",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_alarm_darurat",
        "resq_layar_oled"
      ],
      "codeContains": [
        "api.setOledMessage"
      ],
      "ancestorConstraints": {
        "resq_alarm_darurat": "resq_program",
        "resq_layar_oled": "resq_program"
      }
    }
  },
  {
    "id": "job_38",
    "category": "gunung",
    "level": 38,
    "title": "Job 38: Bahaya Hujan Abu Vulkanik & Masker APD",
    "icon": "volcano",
    "scenario": "Hujan abu silika tajam melanda pemukiman. Sistem menginstruksikan warga memakai masker basah dan kacamata pelindung untuk mencegah ISPA.",
    "objective": "Tampilkan panduan 'PAKAI MASKER & KACAMATA PELINDUNG' dan atur status Siaga.",
    "hint": "Gunakan Layar Informasi dan Lampu Status Oranye.",
    "steps": [
      {
        "title": "Bahaya Abu Vulkanik",
        "description": "Abu vulkanik bukanlah abu kayu biasa, melainkan butiran kaca dan kristal mineral tajam yang berbahaya bagi paru-paru.",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Panduan APD",
        "description": "Tampilkan di Layar Informasi: 'PAKAI MASKER & KACAMATA PELINDUNG'.",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Status Waspada/Siaga",
        "description": "Nyalakan Lampu Status Oranye.",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Validasi",
        "description": "Klik Validasi Misi.",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_layar_oled",
        "resq_lampu_status"
      ],
      "codeContains": [
        "api.setOledMessage",
        "api.setRgb"
      ],
      "ancestorConstraints": {
        "resq_layar_oled": "resq_program",
        "resq_lampu_status": "resq_program"
      }
    }
  },
  {
    "id": "job_39",
    "category": "gunung",
    "level": 39,
    "title": "Job 39: Jalur Evakuasi Eksplosif: Menjauhi Arah Angin Abu",
    "icon": "volcano",
    "scenario": "Angin bertiup ke Timur membawa abu pekat dengan jarak pandang nol. Arahkan warga mengevakuasi diri melalui Jalur Lingkar Barat/Utara menuju Barak KRB I!",
    "objective": "Tentukan Jalur Evakuasi ke Jalur Lingkar Utama dan buka Barak Pengungsian.",
    "hint": "Gunakan blok 'Tentukan Jalur Evakuasi ke [Jalur Lingkar Utama]' dan 'Buka Posko [Barak Pengungsian Terpadu]'.",
    "steps": [
      {
        "title": "Arah Angin Abu",
        "description": "Evakuasi harus memperhitungkan arah tiupan angin agar kendaraan warga tidak terjebak hujan abu tebal.",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Pilih Rute Barat",
        "description": "Ambil Tentukan Jalur Evakuasi: Jalur Lingkar Utama (Bebas Lahar).",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Aktifkan Barak",
        "description": "Tambahkan Buka Posko: Barak Pengungsian Terpadu (KRB I).",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Validasi Rute",
        "description": "Pastikan rute lingkar aktif di panel telemetri.",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_jalur_evakuasi",
        "resq_posko"
      ],
      "codeContains": [
        "api.setEvacRoute",
        "api.setActiveShelter"
      ],
      "ancestorConstraints": {
        "resq_jalur_evakuasi": "resq_program",
        "resq_posko": "resq_program"
      }
    }
  },
  {
    "id": "job_40",
    "category": "gunung",
    "level": 40,
    "title": "Job 40: Pensterilan Radius Bahaya 10 KM (KRB III)",
    "icon": "volcano",
    "scenario": "Status Awas resmi diberlakukan PVMBG. Seluruh pemukiman dalam radius 10 km (KRB III) harus steril total. Pastikan seluruh sirine dan lampu status merah aktif!",
    "objective": "Susun: Simulasi Erupsi Eksplosif -> Lampu Merah -> Sirine EWS -> Tampilkan 'RADIUS 10 KM KOSONG TOTAL'.",
    "hint": "Gunakan Simulasi Erupsi Merapi [Awas], Lampu Merah, Sirine EWS, dan Layar Informasi.",
    "steps": [
      {
        "title": "Sterilisasi Zona Merah",
        "description": "Tidak boleh ada satu pun warga bertahan di kawasan KRB III selama letusan eksplosif berlangsung.",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Rakit Sistem Penuh",
        "description": "Erupsi Merapi Eksplosif -> Lampu Merah -> Sirine EWS -> Tampilkan 'RADIUS 10 KM STERIL'.",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Uji Tanggap",
        "description": "Periksa seluruh output hardware aktif serempak!",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Selesai Quest Eksplosif",
        "description": "Selamat! Kamu telah menguasai mitigasi letusan eksplosif!",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_gunung_sim",
        "resq_lampu_status",
        "resq_sirine_ews",
        "resq_layar_oled"
      ],
      "codeContains": [
        "api.simGunung('AWAS'",
        "api.setRgb('red')"
      ],
      "ancestorConstraints": {
        "resq_gunung_sim": "resq_program",
        "resq_lampu_status": "resq_program",
        "resq_sirine_ews": "resq_program",
        "resq_layar_oled": "resq_program"
      }
    }
  },
  {
    "id": "job_41",
    "category": "proyek",
    "level": 41,
    "title": "Job 41: Membaca Peta Kawasan Rawan Bencana (KRB)",
    "icon": "emoji_objects",
    "scenario": "Mengenal tiga zona mitigasi resmi PVMBG: KRB III (Paling Bahaya), KRB II (Waspada Lontaran Batu), dan KRB I (Aman untuk Pengungsian).",
    "objective": "Tampilkan informasi zonasi KRB di Layar Informasi dan atur status ke Waspada.",
    "hint": "Gunakan blok Layar Informasi dan Lampu Status Kuning.",
    "steps": [
      {
        "title": "Zonasi Merapi",
        "description": "KRB III selalu terancam awan panas dan aliran lava. KRB I adalah zona aman di dataran rendah.",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Kirim Edukasi",
        "description": "Tampilkan di Layar Informasi: 'KRB III: BAHAYA | KRB I: POS PENGUNGSIAN'.",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Nyalakan Sinyal",
        "description": "Atur Lampu Status ke Kuning.",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Validasi",
        "description": "Klik Validasi Misi.",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_layar_oled",
        "resq_lampu_status"
      ],
      "codeContains": [
        "api.setOledMessage"
      ],
      "ancestorConstraints": {
        "resq_layar_oled": "resq_program",
        "resq_lampu_status": "resq_program"
      }
    }
  },
  {
    "id": "job_42",
    "category": "proyek",
    "level": 42,
    "title": "Job 42: Keputusan Rute: Jalur Utama vs Lembah Sungai",
    "icon": "emoji_objects",
    "scenario": "Dua rute terlihat di peta: Rute jalan pintas lembah sungai vs Rute lingkar utama. Jika siswa salah pilih rute lembah sungai, simulator memberi peringatan bahaya!",
    "objective": "Pilih 'Jalur Lingkar Utama (Bebas Lahar)' sebagai rute mitigasi yang benar.",
    "hint": "Gunakan blok 'Tentukan Jalur Evakuasi ke [Jalur Lingkar Utama (Bebas Lahar)]'.",
    "steps": [
      {
        "title": "Ujian Navigasi",
        "description": "Rute lembah sungai memang tampak lebih dekat, tetapi itu adalah jebakan maut banjir lahar dingin!",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Pilih Rute Tepat",
        "description": "Ambil Tentukan Jalur Evakuasi: Jalur Lingkar Utama (Bebas Lahar).",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Periksa Warna",
        "description": "Di panel telemetri, rute akan berwarna hijau sukses!",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Validasi Keputusan",
        "description": "Klik tombol Validasi Misi.",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_jalur_evakuasi"
      ],
      "codeContains": [
        "api.setEvacRoute('Jalur Lingkar Utama"
      ],
      "ancestorConstraints": {
        "resq_jalur_evakuasi": "resq_program"
      }
    }
  },
  {
    "id": "job_43",
    "category": "proyek",
    "level": 43,
    "title": "Job 43: Aktivasi Barak Pengungsian Terpadu (KRB I)",
    "icon": "emoji_objects",
    "scenario": "Menyiapkan tenda pleton BPBD, tandon air bersih, dan pos kesehatan di area aman KRB I untuk menampung ratusan pengungsi dari lereng atas.",
    "objective": "Buka Barak Pengungsian Terpadu (KRB I) dan nyalakan Lampu Status Hijau.",
    "hint": "Gunakan blok 'Buka Posko [Barak Pengungsian Terpadu (KRB I)]' dan Lampu Status Hijau.",
    "steps": [
      {
        "title": "Barak Pengungsian",
        "description": "Barak KRB I dilengkapi fasilitas dapur umum, tandon air, pos trauma healing, dan pos medis.",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Buka Posko",
        "description": "Ambil Aksi & Evakuasi -> Buka Posko: Barak Pengungsian Terpadu (KRB I).",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Kesiapan Logistik",
        "description": "Atur Lampu Status ke Hijau dan tampilkan pesan kesiapan posko.",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Validasi",
        "description": "Klik Validasi Misi.",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_posko",
        "resq_lampu_status"
      ],
      "codeContains": [
        "api.setActiveShelter('Barak Pengungsian",
        "api.setRgb('green')"
      ],
      "ancestorConstraints": {
        "resq_posko": "resq_program",
        "resq_lampu_status": "resq_program"
      }
    }
  },
  {
    "id": "job_44",
    "category": "proyek",
    "level": 44,
    "title": "Job 44: Jalur Khusus Logistik TAGANA & Medis",
    "icon": "emoji_objects",
    "scenario": "Truk pengangkut sembako dan mobil tangki air bersih harus melalui rute yang tidak bertabrakan dengan arus warga yang sedang mengungsi.",
    "objective": "Tentukan rute evakuasi lingkar utama dan buka posko pengungsian bersamaan.",
    "hint": "Gunakan Jalur Lingkar Utama dan Barak Pengungsian Terpadu.",
    "steps": [
      {
        "title": "Manajemen Arus",
        "description": "Pemisahan jalur logistik dan jalur pengungsi mencegah kemacetan total di gerbang masuk barak.",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Rakit Terpadu",
        "description": "Tentukan Jalur Evakuasi: Jalur Lingkar Utama -> Buka Posko: Barak KRB I.",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Tampilkan Status",
        "description": "Tampilkan: 'LOGISTIK & BARAK SIAP 100%'.",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Validasi",
        "description": "Klik tombol Validasi Misi.",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_jalur_evakuasi",
        "resq_posko"
      ],
      "codeContains": [
        "api.setEvacRoute",
        "api.setActiveShelter"
      ],
      "ancestorConstraints": {
        "resq_jalur_evakuasi": "resq_program",
        "resq_posko": "resq_program"
      }
    }
  },
  {
    "id": "job_45",
    "category": "proyek",
    "level": 45,
    "title": "Job 45: Simulasi Waktu Tanggap Evakuasi Warga",
    "icon": "emoji_objects",
    "scenario": "Mengukur kecepatan respon sistem. Sejak sirine dibunyikan, warga memiliki jendela waktu emas 15 menit untuk mengosongkan dusun dan tiba di barak aman.",
    "objective": "Bunyikan sirine EWS 3 detik, pilih jalur lingkar aman, dan buka barak pengungsian.",
    "hint": "Gunakan Sirine EWS, Jalur Lingkar Utama, dan Barak Pengungsian Terpadu.",
    "steps": [
      {
        "title": "Golden Time",
        "description": "Kecepatan bereaksi menentukan keselamatan. Latihan berkala melatih refleks warga saat sirine berbunyi.",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Rakit Cepat",
        "description": "1. Sirine EWS 3 detik -> 2. Jalur Lingkar Utama -> 3. Barak Pengungsian KRB I.",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Uji Simulasi",
        "description": "Jalankan simulasi dan perhatikan respon cepat sistem!",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Selesai Quest 9",
        "description": "Validasi misi untuk membuka Grand Mission terakhir!",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_sirine_ews",
        "resq_jalur_evakuasi",
        "resq_posko"
      ],
      "codeContains": [
        "api.setBuzzer",
        "api.setEvacRoute"
      ],
      "ancestorConstraints": {
        "resq_sirine_ews": "resq_program",
        "resq_jalur_evakuasi": "resq_program",
        "resq_posko": "resq_program"
      }
    }
  },
  {
    "id": "job_46",
    "category": "proyek",
    "level": 46,
    "title": "Job 46: Bencana Ganda: Gempa Memicu Erupsi Merapi",
    "icon": "emoji_objects",
    "scenario": "Gempa tektonik 6.8 SR meretakkan dinding lereng Merapi, memicu runtuhnya kubah lava dan letusan efusif secara bersamaan!",
    "objective": "Susun simulasi gempa kuat terlebih dahulu, lalu aktifkan erupsi Merapi dan sirine EWS.",
    "hint": "Gunakan Simulasi Gempa Kuat, Simulasi Erupsi Merapi [Awas], Sirine EWS, dan Lampu Merah.",
    "steps": [
      {
        "title": "Multi-Bencana",
        "description": "Gempa besar seringkali memicu ketidakstabilan kubah lava gunung api di dekat episentrum.",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Rakit Gempa & Erupsi",
        "description": "Simulasi Gempa Kuat -> Jeda 2 detik -> Simulasi Erupsi Merapi [Awas] -> Sirine EWS.",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Uji Hardware",
        "description": "Motor bergetar kencang, speaker bersuara gemuruh, mist menyembur, dan sirine berbunyi!",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Validasi",
        "description": "Klik Validasi Misi.",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_gempa_sim",
        "resq_gunung_sim",
        "resq_sirine_ews"
      ],
      "codeContains": [
        "api.simGempa(3)",
        "api.simGunung('AWAS'",
        "api.setBuzzer"
      ],
      "ancestorConstraints": {
        "resq_gempa_sim": "resq_program",
        "resq_gunung_sim": "resq_program",
        "resq_sirine_ews": "resq_program"
      }
    }
  },
  {
    "id": "job_47",
    "category": "proyek",
    "level": 47,
    "title": "Job 47: Erupsi Eksplosif Malam Hari & Pemadaman Listrik",
    "icon": "emoji_objects",
    "scenario": "Listrik gardu utama padam total akibat sambaran petir vulkanik di malam hari. Sistem mandiri RESQ-BOX mengambil alih kendali darurat.",
    "objective": "Nyalakan Lampu Darurat Merah, sirine EWS, dan tampilkan petunjuk arah pada layar OLED.",
    "hint": "Gunakan Lampu Merah, Sirine EWS, dan Layar Informasi OLED.",
    "steps": [
      {
        "title": "Sistem Darurat Mandiri",
        "description": "Sistem IoT berbasis mikrokontroler dengan baterai cadangan tetap beroperasi saat jaringan listrik kota lumpuh.",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Rakit Respon Mandiri",
        "description": "Lampu Status Merah -> Sirine EWS 3 detik -> Tampilkan 'LISTRIK PADAM - IKUTI LAMPU JALUR'.",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Cek Layar OLED",
        "description": "Periksa pesan instruksi darurat tetap menyala terang di monitor OLED.",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Validasi",
        "description": "Klik Validasi Misi.",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_lampu_status",
        "resq_sirine_ews",
        "resq_layar_oled"
      ],
      "codeContains": [
        "api.setRgb('red')",
        "api.setBuzzer",
        "api.setOledMessage"
      ],
      "ancestorConstraints": {
        "resq_lampu_status": "resq_program",
        "resq_sirine_ews": "resq_program",
        "resq_layar_oled": "resq_program"
      }
    }
  },
  {
    "id": "job_48",
    "category": "proyek",
    "level": 48,
    "title": "Job 48: Pengalihan Jalur Saat Rute Tertutup Longsor",
    "icon": "emoji_objects",
    "scenario": "Saat evakuasi berlangsung, sebuah bukit longsor menutup jalur utama. Gunakan logika percabangan untuk mengalihkan warga ke rute darurat.",
    "objective": "Gunakan blok 'Kalau... Selain Itu' untuk mengarahkan jalur evakuasi.",
    "hint": "Gunakan blok Kalau... Selain Itu dan Tentukan Jalur Evakuasi.",
    "steps": [
      {
        "title": "Dinamika Lapangan",
        "description": "Bencana sering memicu longsor sekunder yang menutup jalan raya utama.",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Rakit Percabangan",
        "description": "Gunakan Kalau... Selain Itu untuk menentukan jalur evakuasi alternatif.",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Tetapkan Rute",
        "description": "Pastikan rute alternatif terpilih aman di panel telemetri.",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Validasi",
        "description": "Klik tombol Validasi Misi.",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_jika_tidak",
        "resq_jalur_evakuasi"
      ],
      "codeContains": [
        "if (",
        "api.setEvacRoute"
      ],
      "ancestorConstraints": {
        "resq_jika_tidak": "resq_program",
        "resq_jalur_evakuasi": "resq_program"
      }
    }
  },
  {
    "id": "job_49",
    "category": "proyek",
    "level": 49,
    "title": "Job 49: Otomasi Pusat Pengendali Operasi (PUSDALOPS)",
    "icon": "emoji_objects",
    "scenario": "Merancang sistem cerdas PUSDALOPS BPBD: memantau sensor getaran, suhu kawah, status lampu RGB, sirine, hingga mengarahkan warga ke barak pengungsian secara otomatis.",
    "objective": "Susun alur pemantauan otomatis lengkap dengan multi-aksi.",
    "hint": "Gunakan Simulasi Bencana, Peringatan EWS, Jalur Evakuasi, dan Posko Pengungsian.",
    "steps": [
      {
        "title": "PUSDALOPS Cerdas",
        "description": "Pusat Pengendali Operasi mengintegrasikan data lapangan dan mengambil tindakan mitigasi otomatis demi keselamatan masyarakat.",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Susun Sistem Terpadu",
        "description": "1. Status Merah -> 2. Sirine EWS -> 3. Tentukan Jalur Lingkar Utama -> 4. Buka Barak KRB I.",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Uji Tanggap Penuh",
        "description": "Saksikan seluruh indikator diorama dan simulator aktif serempak!",
        "icon": "extension",
        "tip": null
      },
      {
        "title": "Validasi",
        "description": "Klik Validasi Misi.",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_lampu_status",
        "resq_sirine_ews",
        "resq_jalur_evakuasi",
        "resq_posko"
      ],
      "codeContains": [
        "api.setRgb",
        "api.setBuzzer",
        "api.setEvacRoute",
        "api.setActiveShelter"
      ],
      "ancestorConstraints": {
        "resq_lampu_status": "resq_program",
        "resq_sirine_ews": "resq_program",
        "resq_jalur_evakuasi": "resq_program",
        "resq_posko": "resq_program"
      }
    }
  },
  {
    "id": "job_50",
    "category": "proyek",
    "level": 50,
    "title": "Job 50: Zero Victim Hero Challenge (Tantangan Akhir)",
    "icon": "emoji_objects",
    "scenario": "Tantangan puncak! Erupsi eksplosif besar Merapi dan gempa vulkanik hebat melanda kota. Terapkan seluruh ilmu mitigasi untuk mengevakuasi 100% warga tanpa ada korban jiwa!",
    "objective": "Rakit sistem mitigasi total: Gempa -> Erupsi Eksplosif -> Sirine EWS -> Jalur Lingkar Bebas Lahar -> Barak Pengungsian KRB I.",
    "hint": "Gunakan Gempa Sim, Gunung Sim, Sirine EWS, Jalur Evakuasi, Posko KRB I, dan Layar OLED.",
    "steps": [
      {
        "title": "Misi Pahlawan Mitigasi",
        "description": "Ujian akhir kompetensi seorang relawan dan pahlawan mitigasi bencana! Buktikan desamu selamat 100%!",
        "icon": "school",
        "tip": null
      },
      {
        "title": "Rakit Alur Puncak",
        "description": "1. Gempa Kuat -> 2. Erupsi Merapi Eksplosif -> 3. Sirine EWS -> 4. Jalur Lingkar Bebas Lahar -> 5. Buka Barak KRB I -> 6. Tampilkan 'MISI LULUS: ZERO VICTIM'.",
        "icon": "inventory_2",
        "tip": null
      },
      {
        "title": "Validasi Kemenangan",
        "description": "Jalankan simulasi dan raih sertifikat kelulusan Level 3 Action Lab!",
        "icon": "rocket_launch",
        "tip": null
      }
    ],
    "validation": {
      "requiredBlocks": [
        "resq_program",
        "resq_gempa_sim",
        "resq_gunung_sim",
        "resq_sirine_ews",
        "resq_jalur_evakuasi",
        "resq_posko",
        "resq_layar_oled"
      ],
      "codeContains": [
        "api.simGempa",
        "api.simGunung",
        "api.setBuzzer",
        "api.setEvacRoute",
        "api.setActiveShelter",
        "api.setOledMessage"
      ],
      "ancestorConstraints": {
        "resq_gempa_sim": "resq_program",
        "resq_gunung_sim": "resq_program",
        "resq_sirine_ews": "resq_program",
        "resq_jalur_evakuasi": "resq_program",
        "resq_posko": "resq_program",
        "resq_layar_oled": "resq_program"
      }
    }
  }
];
