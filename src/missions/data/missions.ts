export interface MissionValidation {
  requiredBlocks?: string[];
  codeContains?: string[];
  /**
   * WAJIB diisi untuk SETIAP misi — bukan lagi opsional.
   *
   * Memetakan "tipe blok anak" ke "tipe blok induk" yang harus membungkusnya,
   * mis. `{ resq_sirine_ews: 'resq_program' }` berarti blok sirine harus
   * tersambung DI DALAM blok program, bukan sekadar ada di kanvas.
   *
   * `validationEngine.ts` menolak misi yang tidak mencantumkannya, dan blok
   * yang diminta tetapi belum punya aturan sendiri otomatis diwajibkan berada
   * di dalam `resq_program`. Tanpa aturan ini, siswa dapat menjatuhkan blok
   * terlepas dari program dan tetap dinyatakan lulus.
   */
  ancestorConstraints: Record<string, string>;
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
    missions: 2,
  },
  {
    id: 'gempa',
    title: 'Mitigasi Gempa Sekolah & Rumah',
    icon: 'landslide',
    missions: 1,
  },
  {
    id: 'gunung',
    title: 'Vulkanologi & Erupsi Merapi',
    icon: 'volcano',
    missions: 1,
  },
  {
    id: 'proyek',
    title: 'Jalur Evakuasi & Grand Challenge',
    icon: 'emoji_objects',
    missions: 1,
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
  {
    id: 'job_01',
    category: 'pengenalan',
    level: 1,
    title: 'Misi 1: Lampu Status di Pos Pengamatan',
    icon: 'school',
    scenario: 'Malam pertama Andi berjaga di pos pengamatan gunung api. Sistem peringatan baru dipasang dan belum pernah dicoba. Sebelum musim hujan tiba, ia harus memastikan lampu status menyala hijau ketika sistem dihidupkan sebagai tanda bahwa kondisi sedang aman.',
    objective: 'Pasang blok Atur Lampu Status ke [Aman (Hijau)] di dalam blok Mulai Saat Dihidupkan.',
    hint: 'Buka Kategori Sistem ➔ ambil Mulai Saat Dihidupkan. Lalu Kategori Peringatan & EWS ➔ ambil Atur Lampu Status ke [Aman (Hijau)].',
    steps: [
      {
        title: 'Kenali kebutuhan petugas',
        description: "Petugas jaga malam butuh tanda yang langsung terlihat. Hijau berarti aman, tanpa perlu membaca angka apa pun.",        icon: 'school',
        tip: null,
      },
      {
        title: 'Susun kerangka program',
        description: "1. Kategori Sistem ➔ ambil Mulai Saat Dihidupkan.\n2. Kategori Peringatan & EWS ➔ ambil Atur Lampu Status ke [Aman (Hijau)], lalu pasang di dalamnya.",        icon: 'inventory_2',
        tip: null,
      },
      {
        title: 'Jalankan simulasi',
        description: "Klik MULAI, lalu perhatikan lampu status. Apakah sudah menyala hijau?",        icon: 'rocket_launch',
        tip: null,
      },
      {
        title: 'Validasi misi',
        description: "Klik VALIDASI MISI untuk memeriksa apakah susunan blok sudah tepat.",        icon: 'extension',
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
    title: 'Misi 2: Pesan untuk Warga di Layar Informasi',
    icon: 'school',
    scenario: 'Warga di lereng sering bertanya apa yang harus dilakukan ketika status gunung meningkat. Papan informasi digital di pos masih kosong, padahal satu kalimat singkat dapat mengarahkan ratusan orang sekaligus.',
    objective: 'Tampilkan pesan SIAGA GUNUNG API - IKUTI ARAHAN PETUGAS pada Layar Informasi di dalam blok Mulai Saat Dihidupkan.',
    hint: 'Kategori Sistem ➔ ambil Tampilkan di Layar Informasi. Tulis pesan singkat dengan huruf besar agar terbaca dari jauh.',
    steps: [
      {
        title: 'Kenali kebutuhan warga',
        description: "Warga membaca pesan dalam keadaan gelisah. Kalimat panjang tidak akan terbaca, kalimat pendek menyelamatkan.",        icon: 'school',
        tip: null,
      },
      {
        title: 'Susun blok pesan',
        description: "Kategori Sistem ➔ ambil Tampilkan di Layar Informasi, lalu ketik pesan yang ditentukan pada misi ini.",        icon: 'inventory_2',
        tip: null,
      },
      {
        title: 'Jalankan simulasi',
        description: "Klik MULAI dan periksa apakah pesan muncul utuh pada layar.",        icon: 'rocket_launch',
        tip: null,
      },
      {
        title: 'Validasi misi',
        description: "Klik VALIDASI MISI untuk memeriksa isi pesan dan letak blok.",        icon: 'extension',
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
    id: 'job_03',
    category: 'gempa',
    level: 3,
    title: 'Misi 3: Membedakan Gempa Sedang dan Gempa Besar',
    icon: 'landslide',
    scenario: 'Dua jenis guncangan sering terjadi. Gempa sedang membuat kaca bergetar, sedangkan gempa besar merobohkan dinding. Sistem yang memberi peringatan sama untuk keduanya akan membuat warga panik tanpa alasan, atau lengah ketika bahaya sesungguhnya datang.',
    objective: 'Gunakan blok Kalau... Maka dengan kondisi Tipe Gempa [Besar (>7 SR)] untuk menyalakan Lampu Awas dan menampilkan instruksi keselamatan.',
    hint: 'Kategori Pengambilan Keputusan ➔ Kalau... Maka Lakukan. Kategori Kondisi Bencana ➔ Tipe Gempa. Kategori Peringatan & EWS ➔ Lampu Awas. Kategori Sistem ➔ Layar Informasi.',
    steps: [
      {
        title: 'Bandingkan dua kondisi',
        description: "Gempa sedang tidak perlu evakuasi total. Gempa besar perlu. Sistem harus dapat membedakan keduanya sebelum bertindak.",        icon: 'school',
        tip: null,
      },
      {
        title: 'Susun percabangan',
        description: "1. Kategori Pengambilan Keputusan ➔ ambil Kalau... Maka Lakukan.\n2. Kategori Kondisi Bencana ➔ ambil Tipe Gempa [Besar (>7 SR)] dan pasangkan pada lubang kondisi.",        icon: 'inventory_2',
        tip: null,
      },
      {
        title: 'Isi bagian Maka',
        description: "Di dalam rongga Maka Lakukan: pasang Atur Lampu Status ke [Awas (Merah)] dan Tampilkan di Layar Informasi.",        icon: 'extension',
        tip: null,
      },
      {
        title: 'Uji lalu validasi',
        description: "Klik MULAI untuk melihat reaksi sistem, lalu VALIDASI MISI.",        icon: 'rocket_launch',
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
    id: 'job_04',
    category: 'gunung',
    level: 4,
    title: 'Misi 4: Menyesuaikan Lampu dengan Status Merapi',
    icon: 'volcano',
    scenario: 'Status Merapi dinaikkan secara bertahap oleh lembaga berwenang. Pos pengamatan membutuhkan sistem yang menyalakan lampu mengikuti status resmi, bukan menurut perkiraan petugas jaga.',
    objective: 'Gunakan blok simulasi erupsi Merapi dan atur lampu status mengikuti tingkat yang sedang berlaku.',
    hint: 'Kategori Kondisi Bencana ➔ blok simulasi erupsi Merapi. Kategori Peringatan & EWS ➔ Atur Lampu Status.',
    steps: [
      {
        title: 'Pahami arti status',
        description: "Normal, Waspada, Siaga, dan Awas bukan sebutan biasa. Tiap tingkat menentukan seberapa jauh warga harus menjauh.",        icon: 'school',
        tip: null,
      },
      {
        title: 'Susun blok kondisi',
        description: "Kategori Kondisi Bencana ➔ ambil blok simulasi erupsi Merapi, lalu tentukan status yang diuji.",        icon: 'inventory_2',
        tip: null,
      },
      {
        title: 'Hubungkan ke lampu',
        description: "Kategori Peringatan & EWS ➔ pasang Atur Lampu Status dengan warna yang sepadan.",        icon: 'extension',
        tip: null,
      },
      {
        title: 'Uji lalu validasi',
        description: "Klik MULAI, amati warna lampu, lalu VALIDASI MISI.",        icon: 'rocket_launch',
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
    id: 'job_05',
    category: 'proyek',
    level: 5,
    title: 'Misi 5: Sirine dan Arahan Keluar Bangunan',
    icon: 'landslide',
    scenario: 'Guncangan besar terjadi saat pelajaran berlangsung. Warga sekolah harus diberi tahu lewat suara, lalu diarahkan keluar menuju titik kumpul. Satu indikator saja tidak cukup ketika bangunan ikut terancam.',
    objective: 'Susun sistem lengkap: simulasi gempa, sirine EWS, pesan pada layar, dan aksi evakuasi keluar bangunan.',
    hint: 'Gabungkan Kategori Kondisi Bencana, Peringatan & EWS, Sistem, dan Aksi Evakuasi di dalam satu blok program.',
    steps: [
      {
        title: 'Kenali kebutuhan sekolah',
        description: "Warga sekolah perlu dua hal sekaligus: tanda bahaya yang terdengar, dan arahan ke mana harus pergi.",        icon: 'school',
        tip: null,
      },
      {
        title: 'Susun kondisi dan sirine',
        description: "Pasang blok simulasi gempa, lalu sirine EWS di dalam blok program.",        icon: 'inventory_2',
        tip: null,
      },
      {
        title: 'Tambahkan pesan dan aksi',
        description: "Pasang Tampilkan di Layar Informasi dan aksi Evakuasi Keluar Bangunan.",        icon: 'extension',
        tip: null,
      },
      {
        title: 'Uji lalu validasi',
        description: "Klik MULAI, amati pergerakan warga, lalu VALIDASI MISI.",        icon: 'rocket_launch',
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
];

// ══════════════════════════════════════════════════════════════════════════
// SUMBER TUNGGAL JUMLAH MISI
// ══════════════════════════════════════════════════════════════════════════
//
// Angka 20 pernah ditulis tetap di lebih dari lima belas tempat: teks status,
// tampilan guru, tutorial, dan - yang paling berbahaya - PENGHITUNGAN NILAI.
//
// Akibatnya, begitu jumlah misi berubah, semua tempat itu diam-diam berbohong:
// nilai di rapor guru menjadi salah, angka kemajuan di layar tidak lagi sesuai,
// dan TIDAK ADA error apa pun yang muncul. Ini jenis kesalahan yang sudah
// berulang kali ditemukan di proyek ini - nilai yang seharusnya diturunkan dari
// data, tetapi ditulis tangan.
//
// Karena itu jumlah misi hanya boleh diambil dari sini.
export const TOTAL_MISSIONS = MISSIONS.length;

/**
 * Poin untuk setiap misi yang tuntas. Menyelesaikan seluruh misi menghasilkan
 * 100 poin penuh. Penilaiannya memakai rumus `(jumlah / TOTAL_MISSIONS) * 100`,
 * sehingga hasilnya tetap bulat meski jumlah misinya bukan pembagi 100.
 */
export const POIN_PER_MISI = 100 / TOTAL_MISSIONS;
