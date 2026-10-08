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
    id: 'pengenalan',
    title: 'Fondasi EWS & Seismik',
    icon: 'school',
    missions: 5,
  },
  {
    id: 'gempa',
    title: 'Mitigasi Gempa Sekolah & Rumah',
    icon: 'landslide',
    missions: 5,
  },
  {
    id: 'gunung',
    title: 'Vulkanologi & Erupsi Merapi',
    icon: 'volcano',
    missions: 5,
  },
  {
    id: 'proyek',
    title: 'Jalur Evakuasi & Grand Challenge',
    icon: 'emoji_objects',
    missions: 5,
  },
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
  // ── QUEST 1: FONDASI EWS & SEISMIK (Level 1 - 5) ─────────────
  {
    id: 'job_01',
    category: 'pengenalan',
    level: 1,
    title: 'Job 1: Sinyal Status Normal',
    icon: 'school',
    scenario: 'Sistem pemantauan baru dipasang di Pos Pengamatan. Saat kondisi aman, sistem menyalakan Lampu Status Hijau sebagai tanda bahwa sistem aktif dan kondisi normal.',
    objective: 'Gunakan blok Sistem Mitigasi untuk menyalakan Lampu Status Hijau (Aman).',
    hint: "Buka Kategori 'Peringatan & EWS' (tosca) ➔ ambil blok 'Atur Lampu Status ke [Aman (Hijau)]', lalu pasang ke dalam 'Mulai Saat Dihidupkan' pada blok Sistem Mitigasi.",
    steps: [
      {
        title: 'Kenali Misimu',
        description: 'Pasang indikator kesiapan sistem mitigasi pertama. Warga desa perlu melihat lampu hijau menyala tenang!',
        icon: 'school',
        tip: 'Warna hijau adalah standar internasional untuk status kondisi aman dan normal.',
      },
      {
        title: 'Pilih Blok',
        description: "Buka Kategori Peringatan & EWS (warna tosca) ➔ ambil blok 'Atur Lampu Status ke [Aman (Hijau)]'.",
        icon: 'inventory_2',
        tip: "Di panel toolbox sebelah kiri, klik menu 'Peringatan & EWS' (ikon tosca) untuk menemukan blok lampu.",
      },
      {
        title: 'Susun Blok',
        description: "Seret blok 'Atur Lampu Status' ke dalam rongga 'Mulai Saat Dihidupkan' pada blok induk Sistem Mitigasi (Kategori Sistem).",
        icon: 'extension',
        tip: null,
      },
      {
        title: 'Jalankan & Validasi',
        description: 'Klik tombol MULAI di panel kontrol, periksa indikator lampu berubah hijau, lalu klik Validasi Misi!',
        icon: 'rocket_launch',
        tip: null,
      },
    ],
    validation: {
      requiredBlocks: ['resq_program', 'resq_lampu_status'],
      codeContains: ['api.setRgb'],
      ancestorConstraints: {
        resq_lampu_status: 'resq_program',
      },
    },
  },
  {
    id: 'job_02',
    category: 'pengenalan',
    level: 2,
    title: 'Job 2: Sinyal Waspada & Siaga Bertahap',
    icon: 'school',
    scenario: 'Perubahan aktivitas alam mulai terdeteksi. Petugas harus mampu mengubah warna lampu status ke Kuning (Waspada) lalu Oranye (Siaga) secara bertahap.',
    objective: 'Ganti lampu status ke Kuning, beri jeda 2 detik, lalu ganti ke Oranye.',
    hint: "Buka Kategori 'Peringatan & EWS' untuk 2x blok 'Atur Lampu Status', dan Kategori 'Sistem' untuk blok 'Jeda Sebentar' (atur ke 2 detik).",
    steps: [
      {
        title: 'Sinyal Bertahap',
        description: 'Tingkat status bahaya bencana memiliki 4 level standar BNPB: Normal (Hijau), Waspada (Kuning), Siaga (Oranye), dan Awas (Merah).',
        icon: 'school',
        tip: null,
      },
      {
        title: 'Kumpulkan Blok',
        description: "1. Buka Kategori Peringatan & EWS ➔ ambil 2x blok 'Atur Lampu Status ke' (pilih [Waspada (Kuning)] dan [Siaga (Oranye)]).\n2. Buka Kategori Sistem ➔ ambil 1x blok 'Jeda Sebentar' (atur angka ke 2 detik).",
        icon: 'inventory_2',
        tip: "Menu 'Sistem' berada paling atas (oranye), sedangkan menu 'Peringatan & EWS' berwarna tosca.",
      },
      {
        title: 'Susun Urutan',
        description: "Rangkai ke dalam rongga 'Mulai Saat Dihidupkan' (Kategori Sistem) dengan urutan:\n1. Lampu Status Kuning (Kategori Peringatan & EWS)\n2. Jeda Sebentar 2 detik (Kategori Sistem)\n3. Lampu Status Oranye (Kategori Peringatan & EWS)",
        icon: 'extension',
        tip: null,
      },
      {
        title: 'Uji Transisi',
        description: 'Jalankan simulasi dan amati perubahan transisi warna lampu dari kuning ke oranye di panel telemetri.',
        icon: 'rocket_launch',
        tip: null,
      },
    ],
    validation: {
      requiredBlocks: ['resq_program', 'resq_lampu_status', 'resq_tunggu'],
      codeContains: ['api.setRgb', 'api.delay'],
      ancestorConstraints: {
        resq_lampu_status: 'resq_program',
        resq_tunggu: 'resq_program',
      },
    },
  },
  {
    id: 'job_03',
    category: 'pengenalan',
    level: 3,
    title: 'Job 3: Sinyal Bahaya Kritis & Sirine EWS',
    icon: 'school',
    scenario: 'Kondisi darurat terjadi! Sistem harus menyalakan Lampu Merah (Awas) dan membunyikan Sirine Peringatan Dini (EWS) selama 3 detik untuk memperingatkan warga.',
    objective: 'Nyalakan Lampu Status Merah dan bunyikan Sirine EWS selama 3 detik.',
    hint: "Buka Kategori 'Peringatan & EWS' (tosca) ➔ ambil blok 'Atur Lampu Status ke [Awas (Merah)]' dan blok 'Bunyikan Sirine EWS selama [3] detik'.",
    steps: [
      {
        title: 'Alarm Darurat',
        description: 'Sirine EWS dan lampu merah adalah kombinasi audio-visual terpenting dalam evakuasi cepat masyarakat.',
        icon: 'school',
        tip: null,
      },
      {
        title: 'Pilih Blok',
        description: "Buka Kategori Peringatan & EWS ➔ ambil 2 blok berikut:\n1. Blok 'Atur Lampu Status ke [Awas (Merah)]'\n2. Blok 'Bunyikan Sirine EWS selama [3] detik'",
        icon: 'inventory_2',
        tip: "Kedua blok peringatan darurat ini berkumpul di menu 'Peringatan & EWS' (warna tosca).",
      },
      {
        title: 'Pasang di Sistem',
        description: "Masukkan kedua blok dari Kategori Peringatan & EWS tersebut ke dalam rongga 'Mulai Saat Dihidupkan' pada blok Sistem Mitigasi (Kategori Sistem).",
        icon: 'extension',
        tip: null,
      },
      {
        title: 'Bunyikan Sirine',
        description: 'Tekan tombol MULAI dan dengarkan bunyi sirine EWS aktif berpadu dengan lampu merah menyala!',
        icon: 'rocket_launch',
        tip: null,
      },
    ],
    validation: {
      requiredBlocks: ['resq_program', 'resq_lampu_status', 'resq_sirine_ews'],
      codeContains: ['api.setRgb', 'api.setBuzzer'],
      ancestorConstraints: {
        resq_lampu_status: 'resq_program',
        resq_sirine_ews: 'resq_program',
      },
    },
  },
  {
    id: 'job_04',
    category: 'pengenalan',
    level: 4,
    title: 'Job 4: Pusat Informasi Publik (Layar Pengumuman)',
    icon: 'school',
    scenario: 'Saat sirine berbunyi, warga seringkali panik karena tidak tahu apa yang terjadi. Sistem harus menampilkan instruksi jelas pada Layar Informasi Publik.',
    objective: 'Kirim pesan instruksi evakuasi ke Layar Informasi Publik.',
    hint: "Buka Kategori 'Sistem' (oranye) ➔ ambil blok 'Tampilkan di Layar Informasi' dan ketik instruksi evakuasi warga.",
    steps: [
      {
        title: 'Papan Informasi',
        description: 'Layar pengumuman digital di diorama berfungsi sebagai papan informasi panduan bagi masyarakat desa.',
        icon: 'school',
        tip: null,
      },
      {
        title: 'Pilih Blok',
        description: "Buka Kategori Sistem ➔ ambil blok 'Tampilkan di Layar Informasi', lalu ketik pesan instruksi evakuasi (misal: 'EVAKUASI SEGERA').",
        icon: 'inventory_2',
        tip: "Kategori 'Sistem' berada di urutan teratas toolbox di sebelah kiri.",
      },
      {
        title: 'Rangkai Pesan',
        description: "Masukkan blok layar tersebut ke dalam rongga 'Mulai Saat Dihidupkan' pada blok Sistem Mitigasi (Kategori Sistem).",
        icon: 'extension',
        tip: null,
      },
      {
        title: 'Cek Tampilan',
        description: 'Jalankan simulasi dan baca teks pada kotak monitor informasi publik di panel telemetri!',
        icon: 'rocket_launch',
        tip: null,
      },
    ],
    validation: {
      requiredBlocks: ['resq_program', 'resq_layar_oled'],
      codeContains: ['api.setOledMessage'],
      ancestorConstraints: {
        resq_layar_oled: 'resq_program',
      },
    },
  },
  {
    id: 'job_05',
    category: 'pengenalan',
    level: 5,
    title: 'Job 5: Uji Mandiri Semua Indikator (Diagnostic Drill)',
    icon: 'school',
    scenario: 'Sebelum musim penghujan dan ancaman letusan tiba, tim BPBD melakukan pengujian mandiri berkala pada seluruh alarm dan sirine sebanyak 3 kali pengulangan.',
    objective: "Gunakan blok 'Ulangi Aksi 3 kali' untuk membunyikan sirine EWS secara berkala.",
    hint: "Buka Kategori 'Sistem' ➔ ambil blok 'Ulangi Aksi [3] kali', lalu buka Kategori 'Peringatan & EWS' ➔ ambil blok 'Bunyikan Sirine EWS'.",
    steps: [
      {
        title: 'Loop Uji Coba',
        description: 'Pengulangan otomatis memastikan seluruh sistem peringatan bekerja tanpa macet saat dibutuhkan dalam kondisi nyata.',
        icon: 'school',
        tip: null,
      },
      {
        title: 'Gunakan Loop',
        description: "1. Buka Kategori Sistem ➔ ambil blok 'Ulangi Aksi [3] kali'.\n2. Buka Kategori Peringatan & EWS ➔ ambil blok 'Bunyikan Sirine EWS selama [3] detik'.",
        icon: 'inventory_2',
        tip: "Blok pengulangan ada di Kategori Sistem (oranye), sedangkan sirine di Peringatan & EWS (tosca).",
      },
      {
        title: 'Rakit Pengujian',
        description: "Masukkan blok 'Bunyikan Sirine EWS' ke dalam rongga blok 'Ulangi Aksi', lalu pasang blok loop tersebut ke dalam 'Mulai Saat Dihidupkan' (Kategori Sistem).",
        icon: 'extension',
        tip: null,
      },
      {
        title: 'Uji Siklus',
        description: 'Tekan MULAI dan saksikan alarm sirine berulang 3 kali secara otomatis!',
        icon: 'rocket_launch',
        tip: null,
      },
    ],
    validation: {
      requiredBlocks: ['resq_program', 'resq_ulangi', 'resq_sirine_ews'],
      codeContains: ['for (let', 'api.setBuzzer'],
      ancestorConstraints: {
        resq_ulangi: 'resq_program',
        resq_sirine_ews: 'resq_program',
      },
    },
  },

  // ── QUEST 2: MITIGASI GEMPA SEKOLAH & RUMAH (Level 6 - 10) ────
  {
    id: 'job_06',
    category: 'gempa',
    level: 6,
    title: 'Job 6: Simulasi Gempa Ringan di Sekolah',
    icon: 'landslide',
    scenario: 'Sesar lokal bergerak perlahan menimbulkan getaran ringan (3.2 SR) saat jam pelajaran di sekolah. Guru mengingatkan siswa untuk tetap tenang dan menjauhi jendela kaca.',
    objective: 'Aktifkan Simulasi Getaran Gempa tingkat Ringan dan tampilkan pesan tenang di Layar Informasi.',
    hint: "Buka Kategori 'Simulasi Bencana' (merah) ➔ ambil 'Simulasi Getaran Gempa: [Ringan]', lalu buka Kategori 'Sistem' (oranye) ➔ ambil 'Tampilkan di Layar Informasi'.",
    steps: [
      {
        title: 'Getaran Pertama',
        description: 'Gempa bumi ringan biasanya hanya menggetarkan jendela kaca dan dirasakan orang yang diam di dalam ruangan.',
        icon: 'school',
        tip: null,
      },
      {
        title: 'Pilih Blok',
        description: "1. Buka Kategori Simulasi Bencana ➔ ambil blok 'Simulasi Getaran Gempa' (atur dropdown ke [Ringan (3-4 SR)]).\n2. Buka Kategori Sistem ➔ ambil blok 'Tampilkan di Layar Informasi'.",
        icon: 'inventory_2',
        tip: "Kategori Simulasi Bencana berwarna merah, kategori Sistem berwarna oranye.",
      },
      {
        title: 'Kirim Pesan',
        description: "Masukkan kedua blok ke dalam 'Mulai Saat Dihidupkan' (Kategori Sistem), lalu ketik teks di blok layar: 'TETAP TENANG - JAUHI KACA'.",
        icon: 'extension',
        tip: null,
      },
      {
        title: 'Lihat Seismograf',
        description: 'Jalankan simulasi dan amati grafik Seismograf melonjak dengan getaran skala ringan!',
        icon: 'rocket_launch',
        tip: null,
      },
    ],
    validation: {
      requiredBlocks: ['resq_program', 'resq_gempa_sim', 'resq_layar_oled'],
      codeContains: ['api.simGempa(1)'],
      ancestorConstraints: {
        resq_gempa_sim: 'resq_program',
        resq_layar_oled: 'resq_program',
      },
    },
  },
  {
    id: 'job_07',
    category: 'gempa',
    level: 7,
    title: 'Job 7: Protokol Evakuasi Gempa Sedang: Keluar Bangunan',
    icon: 'landslide',
    scenario: 'Guncangan gempa meningkat menjadi kekuatan sedang (5.6 SR). Siswa dan warga di dalam bangunan panik! Bunyikan sirine EWS, susun blok evakuasi keluar bangunan agar warga di dalam gedung segera melangkah keluar ke area terbuka, dan tampilkan pesan mitigasi!',
    objective: "Aktifkan gempa sedang, bunyikan sirine EWS, arahkan evakuasi keluar bangunan, dan tampilkan instruksi mitigasi di layar.",
    hint: "Buka Kategori 'Simulasi Bencana' (Gempa Sedang), Kategori 'Peringatan & EWS' (Sirine EWS), Kategori 'Aksi & Evakuasi' (Evakuasi Keluar Bangunan), dan Kategori 'Sistem' (Layar Informasi).",
    steps: [
      {
        title: 'SOP Evakuasi Gedung',
        description: 'Saat gempa sedang terjadi, warga di dalam gedung harus segera keluar melalui pintu menuju halaman terbuka tanpa saling dorong.',
        icon: 'school',
        tip: null,
      },
      {
        title: 'Rakit SOP & Evakuasi',
        description: "Kumpulkan blok dari masing-masing kategori:\n1. Kategori Simulasi Bencana ➔ ambil 'Simulasi Getaran Gempa: [Sedang (5-6 SR)]'\n2. Kategori Peringatan & EWS ➔ ambil 'Bunyikan Sirine EWS selama [3] detik'\n3. Kategori Aksi & Evakuasi ➔ ambil 'Evakuasi Keluar Bangunan'\n4. Kategori Sistem ➔ ambil 'Tampilkan di Layar Informasi' (ketik: 'EVAKUASI KELUAR BANGUNAN')",
        icon: 'inventory_2',
        tip: "Cari blok getaran di menu merah, sirine di menu tosca, evakuasi di menu ungu, dan layar di menu oranye.",
      },
      {
        title: 'Cek Respon',
        description: "Susun keempat blok secara berurutan ke dalam 'Mulai Saat Dihidupkan' (Kategori Sistem).",
        icon: 'extension',
        tip: null,
      },
      {
        title: 'Validasi',
        description: 'Klik tombol MULAI, periksa warga melangkah keluar dari gedung ke halaman terbuka, lalu klik Validasi Misi!',
        icon: 'rocket_launch',
        tip: null,
      },
    ],
    validation: {
      requiredBlocks: ['resq_program', 'resq_gempa_sim', 'resq_sirine_ews', 'resq_evak_keluar_bangunan', 'resq_layar_oled'],
      codeContains: ['api.simGempa(2)', 'api.setBuzzer', "api.setEvacCommand('KELUAR_BANGUNAN')"],
      ancestorConstraints: {
        resq_gempa_sim: 'resq_program',
        resq_sirine_ews: 'resq_program',
        resq_evak_keluar_bangunan: 'resq_program',
        resq_layar_oled: 'resq_program',
      },
    },
  },
  {
    id: 'job_08',
    category: 'gempa',
    level: 8,
    title: 'Job 8: Gempa Besar & Alarm Evakuasi Sekolah',
    icon: 'landslide',
    scenario: 'Gempa berkekuatan besar (>7.0 SR) mengguncang sekolah. Lampu bahaya merah menyala dan sirine berulang untuk meminta seluruh warga sekolah bersiap evakuasi!',
    objective: 'Aktifkan gempa besar, ulangi sirine 3 kali, dan atur lampu bahaya merah.',
    hint: "Buka Kategori 'Simulasi Bencana' (Gempa Besar), Kategori 'Sistem' (Ulangi Aksi), serta Kategori 'Peringatan & EWS' (Sirine EWS & Lampu Merah).",
    steps: [
      {
        title: 'Gempa Destruktif',
        description: 'Guncangan hebat berpotensi merusak konstruksi dan memicu korsleting listrik gedung.',
        icon: 'school',
        tip: null,
      },
      {
        title: 'Loop Alarm',
        description: "1. Buka Kategori Simulasi Bencana ➔ ambil blok 'Simulasi Getaran Gempa: [Besar (>7 SR)]'.\n2. Buka Kategori Sistem ➔ ambil blok 'Ulangi Aksi [3] kali'.\n3. Buka Kategori Peringatan & EWS ➔ ambil blok 'Bunyikan Sirine EWS selama [3] detik' dan masukkan ke dalam rongga blok 'Ulangi Aksi'.",
        icon: 'inventory_2',
        tip: null,
      },
      {
        title: 'Lampu Bahaya',
        description: "Buka Kategori Peringatan & EWS ➔ ambil blok 'Atur Lampu Status ke [Awas (Merah)]'. Pasang semua blok secara berurutan ke dalam 'Mulai Saat Dihidupkan' (Kategori Sistem).",
        icon: 'extension',
        tip: null,
      },
      {
        title: 'Validasi',
        description: 'Jalankan simulasi dan periksa getaran besar, sirine berulang 3x, dan lampu merah menyala, lalu klik Validasi Misi!',
        icon: 'rocket_launch',
        tip: null,
      },
    ],
    validation: {
      requiredBlocks: ['resq_program', 'resq_gempa_sim', 'resq_ulangi', 'resq_sirine_ews', 'resq_lampu_status'],
      codeContains: ['api.simGempa(3)', 'for (let', "api.setRgb('red')"],
      ancestorConstraints: {
        resq_gempa_sim: 'resq_program',
        resq_ulangi: 'resq_program',
        resq_lampu_status: 'resq_program',
      },
    },
  },
  {
    id: 'job_09',
    category: 'gempa',
    level: 9,
    title: 'Job 9: Mencegah Kebakaran Rumah: Mematikan Kompor & Gas',
    icon: 'landslide',
    scenario: 'Gempa bumi besar terjadi saat keluarga sedang memasak di dapur. Kompor yang menyala dan selang gas yang bocor dapat memicu kebakaran hebat. Sistem mitigasi harus langsung membunyikan alarm dan meminta warga mematikan kompor!',
    objective: "Gunakan blok 'Kalau... Maka' dengan kondisi 'Tipe Gempa: [Besar (>7 SR)]' untuk menyalakan Lampu Merah dan menampilkan instruksi keselamatan.",
    hint: "Buka Kategori 'Pengambilan Keputusan' ('Kalau... Maka Lakukan'), Kategori 'Kondisi Bencana' ('Tipe Gempa: [Besar]'), Kategori 'Peringatan & EWS' (Lampu Merah), dan Kategori 'Sistem' (Layar Informasi).",
    steps: [
      {
        title: 'Bahaya Api Saat Gempa',
        description: 'Guncangan gempa besar sangat mudah merobohkan kompor penggorengan dan merusak pipa tabung gas di dapur.',
        icon: 'school',
        tip: 'Mematikan kompor sebelum lari keluar rumah mencegah kebakaran hebat pasca gempa.',
      },
      {
        title: 'Susun Kondisi Gempa Besar',
        description: "1. Buka Kategori Pengambilan Keputusan ➔ ambil blok 'Kalau [kondisi] Maka Lakukan'.\n2. Buka Kategori Kondisi Bencana ➔ ambil blok 'Tipe Gempa: [Besar (>7 SR)]' dan pasangkan di lubang kondisi 'Kalau'.",
        icon: 'inventory_2',
        tip: "Kategori Pengambilan Keputusan berwarna pink di bagian bawah, dan Kondisi Bencana berwarna biru.",
      },
      {
        title: 'Aksi Penyelamatan',
        description: "Di dalam rongga 'Maka Lakukan':\n1. Buka Kategori Peringatan & EWS ➔ pasang 'Atur Lampu Status ke [Awas (Merah)]'.\n2. Buka Kategori Sistem ➔ pasang 'Tampilkan di Layar Informasi' (ketik: 'MATIKAN KOMPOR & KELUAR RUMAH SEGERA').\nLalu pasang blok Kalau-Maka ini ke dalam 'Mulai Saat Dihidupkan' (Kategori Sistem).",
        icon: 'extension',
        tip: null,
      },
      {
        title: 'Uji Logika & Validasi',
        description: 'Klik tombol MULAI, perhatikan peringatan kebakaran menyala saat gempa besar terjadi, lalu klik VALIDASI MISI!',
        icon: 'rocket_launch',
        tip: null,
      },
    ],
    validation: {
      requiredBlocks: ['resq_program', 'resq_jika', 'resq_tipe_gempa', 'resq_lampu_status', 'resq_layar_oled'],
      codeContains: ['api.getSeismicLevel()', 'api.setRgb', 'api.setOledMessage'],
      ancestorConstraints: {
        resq_jika: 'resq_program',
        resq_lampu_status: 'resq_jika',
        resq_layar_oled: 'resq_jika',
      },
    },
  },
  {
    id: 'job_10',
    category: 'gempa',
    level: 10,
    title: 'Job 10: Evakuasi Gempa Besar ke Tanah Lapang Terdekat',
    icon: 'landslide',
    scenario: 'Gempa bumi besar mengguncang kawasan pemukiman dan sekolah! Seluruh warga dan siswa panik berlari-lari. Susun blok evakuasi ke tanah lapang terdekat yang jauh dari bangunan agar mereka selamat dari bahaya reruntuhan gedung!',
    objective: "Arahkan seluruh warga evakuasi ke tanah lapang terdekat yang jauh dari bangunan.",
    hint: "Buka Kategori 'Aksi & Evakuasi' (warna ungu) ➔ ambil blok 'Evakuasi ke Tanah Lapang Terdekat'.",
    steps: [
      {
        title: 'Pilihan Evakuasi Tanah Lapang',
        description: 'Saat gempa besar, bahaya terbesar adalah reruntuhan atap dan dinding. Arahkan warga menuju tanah lapang terbuka yang jauh dari bangunan!',
        icon: 'school',
        tip: null,
      },
      {
        title: 'Arahkan ke Tanah Lapang',
        description: "Buka Kategori Aksi & Evakuasi ➔ ambil blok 'Evakuasi ke Tanah Lapang Terdekat'. Pasang blok ini ke dalam 'Mulai Saat Dihidupkan' (Kategori Sistem).",
        icon: 'inventory_2',
        tip: "Kategori Aksi & Evakuasi berada di baris ke-4 toolbox dengan warna ungu.",
      },
      {
        title: 'Cek Pergerakan Warga',
        description: 'Jalankan simulasi dan amati warga yang semula panik kini bergerak teratur dan menyebar aman di tanah lapang terbuka terdekat!',
        icon: 'rocket_launch',
        tip: null,
      },
    ],
    validation: {
      requiredBlocks: ['resq_program', 'resq_evak_tanah_lapang'],
      codeContains: ["api.setEvacCommand('TANAH_LAPANG')"],
      ancestorConstraints: {
        resq_evak_tanah_lapang: 'resq_program',
      },
    },
  },

  // ── QUEST 3: VULKANOLOGI & ERUPSI MERAPI (Level 11 - 15) ──────
  {
    id: 'job_11',
    category: 'gunung',
    level: 11,
    title: 'Job 11: Pemantauan Merapi: Status Waspada',
    icon: 'volcano',
    scenario: 'Pos Pengamatan mencatat suhu kawah meningkat dan gempa tremor vulkanik mulai terekam. Sistem menaikkan status menjadi Waspada (Lampu Kuning) untuk warga lereng atas KRB III.',
    objective: 'Jalankan Simulasi Merapi status Waspada dan atur Lampu Status ke Kuning.',
    hint: "Buka Kategori 'Simulasi Bencana' ➔ ambil 'Simulasi Erupsi Merapi [Waspada]', lalu buka Kategori 'Peringatan & EWS' ➔ ambil 'Atur Lampu Status ke [Waspada (Kuning)]'.",
    steps: [
      {
        title: 'Peningkatan Aktivitas',
        description: 'Status Waspada menandakan adanya peningkatan aktivitas seismik dan termal di atas level normal.',
        icon: 'school',
        tip: null,
      },
      {
        title: 'Pasang Skenario',
        description: "1. Buka Kategori Simulasi Bencana ➔ ambil blok 'Simulasi Erupsi Merapi' (pilih status [Waspada (Fase 1)]).\n2. Buka Kategori Peringatan & EWS ➔ ambil blok 'Atur Lampu Status ke [Waspada (Kuning)]'.",
        icon: 'inventory_2',
        tip: "Kategori Simulasi Bencana berwarna merah, kategori Peringatan & EWS berwarna tosca.",
      },
      {
        title: 'Amati Diorama',
        description: "Pasang kedua blok ke dalam 'Mulai Saat Dihidupkan' (Kategori Sistem). Tekan MULAI, kawah mulai mengepulkan asap tipis dan lampu kuning diorama menyala!",
        icon: 'extension',
        tip: null,
      },
      {
        title: 'Validasi',
        description: 'Klik Validasi Misi untuk menyelesaikan verifikasi.',
        icon: 'rocket_launch',
        tip: null,
      },
    ],
    validation: {
      requiredBlocks: ['resq_program', 'resq_gunung_sim', 'resq_lampu_status'],
      codeContains: ["api.simGunung('WASPADA'", "api.setRgb('yellow')"],
      ancestorConstraints: {
        resq_gunung_sim: 'resq_program',
        resq_lampu_status: 'resq_program',
      },
    },
  },
  {
    id: 'job_12',
    category: 'gunung',
    level: 12,
    title: 'Job 12: Kenaikan Status Siaga & Siapkan Tas Bencana',
    icon: 'volcano',
    scenario: 'Aktivitas vulkanik meningkat pesat. Asap pekat mengepul dari kubah lava dan tremor terus berlangsung. BPBD menetapkan Status SIAGA (Lampu Oranye) dan mengimbau warga menyiapkan tas siaga bencana.',
    objective: 'Aktifkan Simulasi Merapi status Siaga, atur Lampu Status ke Oranye, dan tampilkan pesan di Layar Info.',
    hint: "Buka Kategori 'Simulasi Bencana' (Simulasi Merapi Siaga), Kategori 'Peringatan & EWS' (Lampu Oranye), dan Kategori 'Sistem' (Layar Informasi).",
    steps: [
      {
        title: 'Status Siaga',
        description: 'Pada status Siaga, warga KRB II dan KRB III mulai menyiapkan tas siaga dan surat berharga.',
        icon: 'school',
        tip: null,
      },
      {
        title: 'Rakit Status',
        description: "Kumpulkan blok dari masing-masing kategori:\n1. Buka Kategori Simulasi Bencana ➔ blok 'Simulasi Erupsi Merapi' (pilih [Siaga (Fase 2)])\n2. Buka Kategori Peringatan & EWS ➔ blok 'Atur Lampu Status ke [Siaga (Oranye)]'\n3. Buka Kategori Sistem ➔ blok 'Tampilkan di Layar Informasi' (ketik: 'STATUS SIAGA - SIAPKAN TAS BENCANA')",
        icon: 'inventory_2',
        tip: null,
      },
      {
        title: 'Periksa Monitor',
        description: "Susun ketiga blok ke dalam 'Mulai Saat Dihidupkan' (Kategori Sistem). Tekan MULAI dan amati perubahan status di layar pengumuman dan telemetri!",
        icon: 'extension',
        tip: null,
      },
      {
        title: 'Validasi',
        description: 'Klik Validasi Misi.',
        icon: 'rocket_launch',
        tip: null,
      },
    ],
    validation: {
      requiredBlocks: ['resq_program', 'resq_gunung_sim', 'resq_lampu_status', 'resq_layar_oled'],
      codeContains: ["api.simGunung('SIAGA'", "api.setRgb('orange')"],
      ancestorConstraints: {
        resq_gunung_sim: 'resq_program',
        resq_lampu_status: 'resq_program',
        resq_layar_oled: 'resq_program',
      },
    },
  },
  {
    id: 'job_13',
    category: 'gunung',
    level: 13,
    title: 'Job 13: Karakteristik Erupsi Efusif (Lava Pijar)',
    icon: 'volcano',
    scenario: 'Kubah lava Merapi runtuh perlahan memicu guguran lava pijar yang merayap menuruni lereng tanpa letusan eksplosif besar. Kenali tipe letusan efusif ini dan berikan peringatan bahaya.',
    objective: 'Aktifkan Simulasi Erupsi Merapi status Awas tipe Efusif dan atur Lampu Status ke Merah.',
    hint: "Buka Kategori 'Simulasi Bencana' ➔ ambil 'Simulasi Erupsi Merapi' [Awas, Tipe: Efusif], lalu buka Kategori 'Peringatan & EWS' ➔ ambil 'Atur Lampu Status ke [Awas (Merah)]'.",
    steps: [
      {
        title: 'Erupsi Efusif',
        description: 'Erupsi efusif didominasi oleh lelehan lava pijar bersuhu tinggi yang mengalir menuruni lembah kawah tanpa letusan awan panas vertikal besar.',
        icon: 'school',
        tip: null,
      },
      {
        title: 'Pilih Tipe Efusif',
        description: "1. Buka Kategori Simulasi Bencana ➔ ambil blok 'Simulasi Erupsi Merapi', atur status ke [Awas / Erupsi (Fase 3)] dan tipe ke [Efusif (Lelehan Kubah Lava / Lava Pijar)].\n2. Buka Kategori Peringatan & EWS ➔ ambil blok 'Atur Lampu Status ke [Awas (Merah)]'.",
        icon: 'inventory_2',
        tip: 'Letusan efusif menghasilkan lelehan lava pijar merah tanpa letusan kolom abu vertikal.',
      },
      {
        title: 'Amati Aliran',
        description: "Masukkan kedua blok ke dalam 'Mulai Saat Dihidupkan' (Kategori Sistem). Tekan MULAI dan perhatikan aliran lelehan lava merah menyala merayap di lereng kawah 3D!",
        icon: 'extension',
        tip: null,
      },
      {
        title: 'Validasi',
        description: 'Klik tombol Validasi Misi.',
        icon: 'rocket_launch',
        tip: null,
      },
    ],
    validation: {
      requiredBlocks: ['resq_program', 'resq_gunung_sim', 'resq_lampu_status'],
      codeContains: ["api.simGunung('AWAS', 'EFUSIF')", "api.setRgb('red')"],
      ancestorConstraints: {
        resq_gunung_sim: 'resq_program',
        resq_lampu_status: 'resq_program',
      },
    },
  },
  {
    id: 'job_14',
    category: 'gunung',
    level: 14,
    title: 'Job 14: Erupsi Eksplosif: Awan Panas & Kolom Plinian',
    icon: 'volcano',
    scenario: 'Tekanan gas magmatik sangat tinggi memicu letusan eksplosif dahsyat! Kolom abu menjulang tinggi dan awan panas (wedhus gembel) meluncur deras. Bunyikan sirine EWS dan nyalakan Lampu Merah!',
    objective: 'Aktifkan Simulasi Erupsi Eksplosif, bunyikan sirine EWS, dan atur Lampu Status ke Merah.',
    hint: "Buka Kategori 'Simulasi Bencana' (Simulasi Merapi Eksplosif) dan Kategori 'Peringatan & EWS' (Sirine EWS & Lampu Merah).",
    steps: [
      {
        title: 'Wedhus Gembel',
        description: 'Awan panas piroklastik bergerak hingga 100 km/jam dengan suhu mencapai 600°C. Evakuasi harus seketika!',
        icon: 'school',
        tip: null,
      },
      {
        title: 'Rakit Alarm Puncak',
        description: "1. Buka Kategori Simulasi Bencana ➔ ambil blok 'Simulasi Erupsi Merapi' (pilih status [Awas / Erupsi] dan tipe [Eksplosif (Ledakan & Abu)]).\n2. Buka Kategori Peringatan & EWS ➔ ambil blok 'Bunyikan Sirine EWS selama [3] detik' dan blok 'Atur Lampu Status ke [Awas (Merah)]'.",
        icon: 'inventory_2',
        tip: null,
      },
      {
        title: 'Saksikan Kolom Abu',
        description: "Rangkai ketiga blok tersebut ke dalam 'Mulai Saat Dihidupkan' (Kategori Sistem). Tekan MULAI dan saksikan semburan kolom abu Plinian raksasa membumbung tinggi di puncak Merapi!",
        icon: 'extension',
        tip: null,
      },
      {
        title: 'Validasi',
        description: 'Klik tombol Validasi Misi.',
        icon: 'rocket_launch',
        tip: null,
      },
    ],
    validation: {
      requiredBlocks: ['resq_program', 'resq_gunung_sim', 'resq_sirine_ews', 'resq_lampu_status'],
      codeContains: ["api.simGunung('AWAS', 'EKSPLOSIF')", 'api.setBuzzer', "api.setRgb('red')"],
      ancestorConstraints: {
        resq_gunung_sim: 'resq_program',
        resq_sirine_ews: 'resq_program',
        resq_lampu_status: 'resq_program',
      },
    },
  },
  {
    id: 'job_15',
    category: 'gunung',
    level: 15,
    title: 'Job 15: Bahaya Lahar Dingin di Lembah Sungai: Menjauhi Aliran Sungai',
    icon: 'volcano',
    scenario: 'Hujan lebat di puncak membawa jutaan meter kubik material vulkanik menjadi banjir lahar dingin di sungai! Warga di bantaran kali terancam. Bunyikan sirine EWS, susun blok evakuasi menjauh dari wilayah sungai, dan tampilkan pengumuman bahaya!',
    objective: 'Bunyikan sirine EWS, arahkan warga menjauhi wilayah sungai, dan tampilkan peringatan di layar.',
    hint: "Buka Kategori 'Peringatan & EWS' (Sirine EWS), Kategori 'Aksi & Evakuasi' (Evakuasi Menjauh dari Wilayah Sungai), dan Kategori 'Sistem' (Layar Informasi).",
    steps: [
      {
        title: 'Banjir Lahar Hujan',
        description: 'Lahar dingin membawa batu besar dan pasir pekat melalui Kali Gendol, Kali Kuning, dan Kali Boyong. Warga wajib segera naik ke bukit yang lebih tinggi!',
        icon: 'school',
        tip: null,
      },
      {
        title: 'Kirim Peringatan & Evakuasi',
        description: "1. Buka Kategori Peringatan & EWS ➔ ambil blok 'Bunyikan Sirine EWS selama [3] detik'.\n2. Buka Kategori Aksi & Evakuasi ➔ ambil blok 'Evakuasi Menjauh dari Wilayah Sungai'.\n3. Buka Kategori Sistem ➔ ambil blok 'Tampilkan di Layar Informasi', lalu ketik: 'BAHAYA LAHAR DINGIN - KOSONGKAN SUNGAI'.",
        icon: 'inventory_2',
        tip: null,
      },
      {
        title: 'Amati Aliran Sungai & Gerakan Warga',
        description: "Pasang ketiga blok ke dalam 'Mulai Saat Dihidupkan' (Kategori Sistem). Tekan MULAI dan saksikan warga di lembah sungai segera bergeser menjauh ke daratan tinggi!",
        icon: 'extension',
        tip: null,
      },
      {
        title: 'Validasi',
        description: 'Klik Validasi Misi.',
        icon: 'rocket_launch',
        tip: null,
      },
    ],
    validation: {
      requiredBlocks: ['resq_program', 'resq_sirine_ews', 'resq_evak_jauhi_sungai', 'resq_layar_oled'],
      codeContains: ['api.setBuzzer', "api.setEvacCommand('JAUHI_SUNGAI')", 'api.setOledMessage'],
      ancestorConstraints: {
        resq_sirine_ews: 'resq_program',
        resq_evak_jauhi_sungai: 'resq_program',
        resq_layar_oled: 'resq_program',
      },
    },
  },

  // ── QUEST 4: JALUR EVAKUASI & GRAND CHALLENGE (Level 16 - 20) ─
  {
    id: 'job_16',
    category: 'proyek',
    level: 16,
    title: 'Job 16: Jalur Evakuasi: Menjauhi Lembah Sungai Rawan Lahar',
    icon: 'emoji_objects',
    scenario: 'Lembah sungai terancam banjir lahar dingin dan awan panas. Siswa wajib mengarahkan rute evakuasi menjauhi alur lembah sungai dan mengumumkan instruksi keselamatan ke warga!',
    objective: "Arahkan evakuasi warga menjauhi wilayah alur lembah sungai dan tampilkan pesan rute aman di layar.",
    hint: "Buka Kategori 'Aksi & Evakuasi' (ungu) ➔ ambil 'Evakuasi Menjauhi Wilayah Alur Lembah Sungai', lalu buka Kategori 'Sistem' (oranye) ➔ ambil 'Tampilkan di Layar Informasi'.",
    steps: [
      {
        title: 'Ujian Navigasi Bahaya Lahar',
        description: 'Rute lembah sungai tampak dekat namun sangat mematikan saat lahar menerjang. Arahkan warga menjauhi alur sungai!',
        icon: 'school',
        tip: null,
      },
      {
        title: 'Pilih Evakuasi Jauhi Sungai',
        description: "1. Buka Kategori Aksi & Evakuasi ➔ ambil blok 'Evakuasi Menjauhi Wilayah Alur Lembah Sungai'.\n2. Buka Kategori Sistem ➔ ambil blok 'Tampilkan di Layar Informasi'.",
        icon: 'inventory_2',
        tip: "Kategori Aksi & Evakuasi berwarna ungu, kategori Sistem berwarna oranye.",
      },
      {
        title: 'Beri Pengumuman',
        description: "Pada blok layar ketik pesan: 'JAUHI LEMBAH SUNGAI - RAWAN LAHAR'. Pasang kedua blok ini ke dalam 'Mulai Saat Dihidupkan' (Kategori Sistem).",
        icon: 'extension',
        tip: null,
      },
      {
        title: 'Validasi',
        description: 'Jalankan simulasi dan klik Validasi Misi!',
        icon: 'rocket_launch',
        tip: null,
      },
    ],
    validation: {
      requiredBlocks: ['resq_program', 'resq_evak_jauhi_sungai', 'resq_layar_oled'],
      codeContains: ["api.setEvacCommand('JAUHI_SUNGAI')", 'api.setOledMessage'],
      ancestorConstraints: {
        resq_evak_jauhi_sungai: 'resq_program',
        resq_layar_oled: 'resq_program',
      },
    },
  },
  {
    id: 'job_17',
    category: 'proyek',
    level: 17,
    title: 'Job 17: Evakuasi Warga KRB III ke Zona KRB II',
    icon: 'emoji_objects',
    scenario: 'Status Merapi naik menjadi Waspada! Warga di lereng atas KRB III terancam dan panik berlari-lari. Susun blok evakuasi untuk mengarahkan seluruh warga lereng atas mengungsi turun ke Zona KRB II yang lebih aman.',
    objective: 'Arahkan seluruh warga lereng atas KRB III mengungsi ke Zona KRB II (Status Waspada).',
    hint: "Buka Kategori 'Aksi & Evakuasi' (warna ungu) ➔ ambil blok 'Evakuasi Warga ke [Zona KRB II (Status Waspada)]'.",
    steps: [
      {
        title: 'Sterilisasi KRB III',
        description: 'Semua warga di lereng atas dalam radius 5 km wajib mengungsi menjauhi kawah ke zona kuning KRB II.',
        icon: 'school',
        tip: null,
      },
      {
        title: 'Arahkan Evakuasi ke KRB II',
        description: "Buka Kategori Aksi & Evakuasi ➔ ambil blok 'Evakuasi Warga ke [Zona KRB II (Status Waspada)]'.",
        icon: 'inventory_2',
        tip: 'Seluruh blok aksi relokasi dan evakuasi berada di Kategori Aksi & Evakuasi (berwarna ungu).',
      },
      {
        title: 'Lihat Pergerakan Warga',
        description: "Pasang blok dari Kategori Aksi & Evakuasi ke dalam 'Mulai Saat Dihidupkan' (Kategori Sistem). Tekan MULAI dan saksikan warga lereng atas KRB III bergerak tertib mengungsi ke Zona KRB II!",
        icon: 'extension',
        tip: null,
      },
      {
        title: 'Validasi',
        description: 'Klik tombol Validasi Misi.',
        icon: 'rocket_launch',
        tip: null,
      },
    ],
    validation: {
      requiredBlocks: ['resq_program', 'resq_evak_krb'],
      codeContains: ["api.setEvacCommand('KRB2')"],
      ancestorConstraints: {
        resq_evak_krb: 'resq_program',
      },
    },
  },
  {
    id: 'job_18',
    category: 'proyek',
    level: 18,
    title: 'Job 18: Evakuasi Warga ke Zona Aman KRB I',
    icon: 'emoji_objects',
    scenario: 'Status Merapi meningkat menjadi Siaga! Warga di KRB II harus dievakuasi lebih jauh ke arah selatan menuju Zona KRB I (Aman) dengan panduan Lampu Status Siaga (Oranye).',
    objective: 'Arahkan evakuasi ke Zona KRB I dan nyalakan lampu status siaga (oranye).',
    hint: "Buka Kategori 'Aksi & Evakuasi' (Evakuasi Warga ke Zona KRB I) dan Kategori 'Peringatan & EWS' (Atur Lampu Status ke Siaga Oranye).",
    steps: [
      {
        title: 'Zona Aman KRB I',
        description: 'Zona KRB I berada di dataran rendah yang aman dan dilengkapi komplek barak penampungan logistik lengkap.',
        icon: 'school',
        tip: null,
      },
      {
        title: 'Rakit Evakuasi',
        description: "Kumpulkan blok dari masing-masing kategori:\n1. Kategori Aksi & Evakuasi ➔ ambil blok 'Evakuasi Warga ke [Zona KRB I (Status Siaga)]'\n2. Kategori Peringatan & EWS ➔ ambil blok 'Atur Lampu Status ke [Siaga (Oranye)]'",
        icon: 'inventory_2',
        tip: null,
      },
      {
        title: 'Periksa Telemetri',
        description: "Susun kedua blok ke dalam 'Mulai Saat Dihidupkan' (Kategori Sistem). Tekan MULAI dan saksikan warga bergerak tertib menuju kawasan KRB I serta lampu oranye menyala!",
        icon: 'extension',
        tip: null,
      },
      {
        title: 'Validasi',
        description: 'Klik tombol Validasi Misi.',
        icon: 'rocket_launch',
        tip: null,
      },
    ],
    validation: {
      requiredBlocks: ['resq_program', 'resq_evak_krb', 'resq_lampu_status'],
      codeContains: ["api.setEvacCommand('KRB1')", "api.setRgb('orange')"],
      ancestorConstraints: {
        resq_evak_krb: 'resq_program',
        resq_lampu_status: 'resq_program',
      },
    },
  },
  {
    id: 'job_19',
    category: 'proyek',
    level: 19,
    title: 'Job 19: Evakuasi Total Keluar Area Peta',
    icon: 'emoji_objects',
    scenario: 'Status AWAS tiba! Letusan Merapi eksplosif mengancam seluruh lereng. Seluruh warga dan armada mobil evakuasi darurat harus segera dievakuasi menjauh dari KRB I hingga keluar dari area peta!',
    objective: 'Bunyikan sirine EWS dan arahkan evakuasi menjauh dari KRB I keluar peta.',
    hint: "Buka Kategori 'Peringatan & EWS' (Sirine EWS) dan Kategori 'Aksi & Evakuasi' (Evakuasi Menjauh dari KRB I Luar Area Peta).",
    steps: [
      {
        title: 'Evakuasi Penuh Keluar Peta',
        description: 'Awan panas dan bom vulkanik meluncur cepat. Warga yang mencapai batas selatan peta akan selamat berpindah ke posko pengungsian luar wilayah!',
        icon: 'school',
        tip: null,
      },
      {
        title: 'Rakit Sistem Darurat',
        description: "Kumpulkan blok berikut:\n1. Kategori Peringatan & EWS ➔ ambil blok 'Bunyikan Sirine EWS selama [3] detik'\n2. Kategori Aksi & Evakuasi ➔ ambil blok 'Evakuasi Menjauh dari KRB I (Luar Area Peta)'",
        icon: 'inventory_2',
        tip: null,
      },
      {
        title: 'Saksikan Perjalanan',
        description: "Pasang semua blok ke dalam 'Mulai Saat Dihidupkan' (Kategori Sistem). Tekan MULAI, warga dan armada evakuasi melaju cepat ke perbatasan selatan hingga keluar area peta dengan selamat!",
        icon: 'extension',
        tip: null,
      },
      {
        title: 'Validasi',
        description: 'Klik tombol Validasi Misi.',
        icon: 'rocket_launch',
        tip: null,
      },
    ],
    validation: {
      requiredBlocks: ['resq_program', 'resq_sirine_ews', 'resq_evak_luar_map'],
      codeContains: ['api.setBuzzer', "api.setEvacCommand('LUAR_MAP')"],
      ancestorConstraints: {
        resq_sirine_ews: 'resq_program',
        resq_evak_luar_map: 'resq_program',
      },
    },
  },
  {
    id: 'job_20',
    category: 'proyek',
    level: 20,
    title: 'Job 20: Grand Challenge: Evakuasi Total Menuju Zona Aman',
    icon: 'emoji_objects',
    scenario: 'Misi puncak mitigasi Merapi! Aktifkan simulasi erupsi, bunyikan sirine EWS, nyalakan lampu bahaya merah, arahkan evakuasi keluar peta, dan kirim instruksi evakuasi total!',
    objective: 'Rangkai sistem mitigasi lengkap: Simulasi Erupsi Awas, Sirine EWS, Lampu Merah, Evakuasi Keluar Peta, dan Layar Info Publik.',
    hint: "Buka Kategori 'Simulasi Bencana' (Simulasi Merapi Awas), Kategori 'Peringatan & EWS' (Sirine EWS & Lampu Merah), Kategori 'Aksi & Evakuasi' (Evakuasi Keluar Peta), dan Kategori 'Sistem' (Layar Informasi).",
    steps: [
      {
        title: 'Misi Penyelamatan Paripurna',
        description: 'Integrasikan seluruh sensor, sinyal peringatan, dan keputusan rute evakuasi dalam satu sistem terpadu!',
        icon: 'school',
        tip: 'Ini adalah pembuktian keahlianmu sebagai Komandan Mitigasi Bencana RESQ-BOX!',
      },
      {
        title: 'Susun Komponen Lengkap',
        description: "Ambil 5 blok dari kategorinya masing-masing:\n1. Kategori Simulasi Bencana ➔ blok 'Simulasi Erupsi Merapi' [Awas / Erupsi, Eksplosif]\n2. Kategori Peringatan & EWS ➔ blok 'Bunyikan Sirine EWS selama [3] detik'\n3. Kategori Peringatan & EWS ➔ blok 'Atur Lampu Status ke [Awas (Merah)]'\n4. Kategori Aksi & Evakuasi ➔ blok 'Evakuasi Menjauh dari KRB I (Luar Area Peta)'\n5. Kategori Sistem ➔ blok 'Tampilkan di Layar Informasi' (ketik: 'EVAKUASI TOTAL SEKARANG')",
        icon: 'inventory_2',
        tip: 'Buka menu kategori yang sesuai berdasarkan warna blok di toolbox sebelah kiri.',
      },
      {
        title: 'Eksekusi Simulasi Akbar',
        description: "Rangkai kelima blok secara berurutan ke dalam rongga 'Mulai Saat Dihidupkan' (Kategori Sistem). Tekan MULAI dan saksikan seluruh warga serta armada evakuasi berhasil selamat tiba di zona aman!",
        icon: 'extension',
        tip: null,
      },
      {
        title: 'Tuntaskan Level 3',
        description: 'Klik VALIDASI MISI untuk menyelesaikan seluruh kurikulum Level 3 Action Lab!',
        icon: 'rocket_launch',
        tip: null,
      },
    ],
    validation: {
      requiredBlocks: [
        'resq_program',
        'resq_gunung_sim',
        'resq_sirine_ews',
        'resq_lampu_status',
        'resq_evak_luar_map',
        'resq_layar_oled',
      ],
      codeContains: [
        "api.simGunung('AWAS'",
        'api.setBuzzer',
        "api.setRgb('red')",
        "api.setEvacCommand('LUAR_MAP')",
        'api.setOledMessage',
      ],
      ancestorConstraints: {
        resq_gunung_sim: 'resq_program',
        resq_sirine_ews: 'resq_program',
        resq_lampu_status: 'resq_program',
        resq_evak_luar_map: 'resq_program',
        resq_layar_oled: 'resq_program',
      },
    },
  },
];
