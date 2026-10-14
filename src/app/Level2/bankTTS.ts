// ── src/app/Level2/bankTTS.ts ────────────────────────────────────────────────
// BANK GRID TEKA-TEKI SILANG LEVEL 2 — BEBERAPA VARIAN PER AREA.
//
// ═══════════════════════════════════════════════════════════════════════════
// MENGAPA PERLU VARIAN
// ═══════════════════════════════════════════════════════════════════════════
//
//   Sebelumnya tiap area hanya punya SATU grid, sehingga seluruh siswa di
//   seluruh angkatan mengisi teka-teki yang sama persis. Jawabannya mudah
//   bocor: cukup bertanya kepada kakak kelas atau teman yang sudah main.
//
//   Sekarang tiap area punya beberapa grid utuh, dan satu grid diundi untuk
//   tiap siswa. Grid mana yang ia dapat berbeda dari temannya, tetapi tetap
//   sama bila ia membuka ulang area itu — sehingga tidak ada yang bisa
//   "mengundi ulang" dengan me-refresh halaman.
//
// ═══════════════════════════════════════════════════════════════════════════
// MENGAPA TIDAK DIACAK PER KATA
// ═══════════════════════════════════════════════════════════════════════════
//
//   TTS tidak dapat diacak per kata. Pada TTS, dua kata yang bersilangan
//   BERBAGI satu kotak, sehingga hurufnya WAJIB sama. Kalau salah satu
//   jawaban diganti tanpa memindahkan titik mulainya, huruf di titik potong
//   tidak lagi cocok — dan teka-tekinya menjadi MUSTAHIL DISELESAIKAN.
//
//   Yang lebih berbahaya: tidak ada error yang muncul. Siswa hanya akan
//   mengisi dan selalu salah, tanpa tahu mengapa. Karena itu:
//
//     1. Yang diundi adalah GRID UTUH, bukan kata per kata.
//     2. Ada VALIDATOR (periksaGrid) yang MEMBUKTIKAN setiap grid dapat
//        diselesaikan, dan uji otomatis menjalankannya atas seluruh bank.
//
// ═══════════════════════════════════════════════════════════════════════════
// ATURAN PENYUSUNAN — DIPERIKSA OTOMATIS
// ═══════════════════════════════════════════════════════════════════════════
//
//   1. Setiap kotak yang dipakai dua kata bersilangan WAJIB berhuruf sama.
//   2. Jumlah kata SERAGAM di semua varian satu area, supaya bebannya adil.
//   3. Seluruh huruf setiap jawaban wajib berada di dalam batas grid.
//   4. Tidak boleh ada jawaban kembar di dalam satu grid.
//   5. Dua kata searah tidak boleh saling menimpa.
//
//   Aturan ini ditegakkan oleh __tests__/bankTTS.test.ts, sehingga menambah
//   grid yang salah tidak mungkin lolos ke siswa.

import { benihDari, pilihBerbenih } from '../../missions/engine/undianBerbenih.ts';

export interface ClueTTS {
  id: string;
  number: number;
  direction: 'across' | 'down';
  answer: string;
  clue: string;
  /**
   * Petunjuk ALTERNATIF untuk jawaban yang SAMA.
   *
   * Gunanya: dua siswa yang kebetulan mendapat kata yang sama tetap membaca
   * kalimat soal yang BERBEDA, sementara jawabannya tidak berubah. Jadi menyalin
   * jawaban dari teman tidak lagi berguna, tetapi materi dan kuncinya tetap sama.
   *
   * Setiap kalimat di sini WAJIB memenuhi aturan yang sama seperti `clue`:
   * tidak boleh memuat kata jawabannya sendiri.
   */
  clueLain?: string[];
  startRow: number;
  startCol: number;
}

export interface GridTTS {
  rows: number;
  cols: number;
  clues: ClueTTS[];
}

// ══════════════════════════════════════════════════════════════════════════
// ISI BANK
// ══════════════════════════════════════════════════════════════════════════
// Varian pertama tiap area adalah grid yang SUDAH ADA sebelumnya, dipindahkan
// apa adanya dari CrosswordModal.tsx. Varian berikutnya ditambahkan kemudian.

const VARIAN_AREA_0: GridTTS[] = [
  {
    rows: 10,
    cols: 12,
    clues: [
      {
      id: 'c1',
      number: 1,
      direction: 'across',
      answer: 'BERLINDUNG',
      clue: 'Masuk ke bawah meja saat terjadi gempa untuk ... dari material yang jatuh.',
        clueLain: ['Tindakan mencari tempat aman di bawah meja agar tidak tertimpa benda yang jatuh.'],
      startRow: 1,
      startCol: 1,
      },
      {
      id: 'c2',
      number: 2,
      direction: 'down',
      answer: 'EVAKUASI',
      clue: 'Penyelamatan diri dengan berjalan tertib lewat tangga darurat menuju titik kumpul di lapangan sekolah.',
        clueLain: ['Upaya menyelamatkan diri menuju titik kumpul dengan tertib lewat jalur darurat.'],
      startRow: 1,
      startCol: 2,
      },
      {
      id: 'c3',
      number: 3,
      direction: 'down',
      answer: 'GEMPA',
      clue: 'Peristiwa getaran atau guncangan tanah mendadak yang kita simulasikan cara penyelamatannya di kelas.',
        clueLain: ['Guncangan tanah yang datang mendadak dan dapat merobohkan bangunan.'],
      startRow: 1,
      startCol: 10,
      },
      {
      id: 'c4',
      number: 4,
      direction: 'across',
      answer: 'SIAGA',
      clue: 'Tas darurat 72 jam yang diajarkan Bu Rahma berisi makanan, air, dan obat disebut Tas ... Bencana.',
        clueLain: ['Tas berisi makanan, air, dan obat untuk 72 jam pertama, disebut Tas ... Bencana.'],
      startRow: 7,
      startCol: 2,
      },
    ],
  },
  // VARIAN 2 — pola silang yang sudah dihitung dan diverifikasi:
  //   MERUNDUK[2]='R' = RINGAN[0]        -> titik potong di (0,2)
  //   RENCANA[2]='N' = RINGAN[2]         -> titik potong di (2,2)
  //   MERUNDUK[6]='U' = UPAYA[0]         -> titik potong di (0,6)
  //   RENCANA[6]='A' = UPAYA[2]          -> titik potong di (2,6)
  {
    rows: 6,
    cols: 8,
    clues: [
      {
        id: 'c1',
        number: 1,
        direction: 'across',
        answer: 'MERUNDUK',
        clue: 'Gerakan pertama saat gempa: ... ke bawah mendekati lantai agar tidak terkena benda yang jatuh.',
        clueLain: ['Gerakan menurunkan badan mendekati lantai saat gempa dimulai.'],
        startRow: 0,
        startCol: 0,
      },
      {
        id: 'c2',
        number: 2,
        direction: 'down',
        answer: 'RINGAN',
        clue: 'Sebutan untuk gempa berkekuatan kecil, yang getarannya hanya dirasakan sebagian orang.',
        clueLain: ['Sebutan gempa berkekuatan kecil; getarannya hanya terasa oleh sebagian orang.'],
        startRow: 0,
        startCol: 2,
      },
      {
        id: 'c3',
        number: 3,
        direction: 'across',
        answer: 'RENCANA',
        clue: 'Susunan langkah yang disiapkan jauh sebelum bencana terjadi, misalnya ... evakuasi sekolah.',
        clueLain: ['Sebelum bencana datang, sekolah menyusun ini agar tahu apa yang harus dilakukan: ... evakuasi.'],
        startRow: 2,
        startCol: 0,
      },
      {
        id: 'c4',
        number: 4,
        direction: 'down',
        answer: 'UPAYA',
        clue: 'Ikhtiar yang dilakukan manusia untuk mengurangi risiko bencana, misalnya latihan evakuasi rutin.',
        clueLain: ['Ikhtiar manusia untuk menekan risiko bencana, contohnya latihan berkala.'],
        startRow: 0,
        startCol: 6,
      },
    ],
  },
  {
    rows: 8,
    cols: 9,
    clues: [
      {
        id: 'c2',
        number: 1,
        direction: 'down',
        answer: 'BANGUNAN',
        clue: 'Struktur yang wajib dirancang tahan gempa di daerah rawan gempa.',
        clueLain: ['Struktur buatan manusia yang wajib dirancang tahan guncangan di daerah rawan.'],
        startRow: 0,
        startCol: 5,
      },
      {
        id: 'c3',
        number: 2,
        direction: 'down',
        answer: 'LATIHAN',
        clue: 'Kegiatan mengulang prosedur evakuasi agar menjadi kebiasaan saat panik.',
        clueLain: ['Kegiatan mengulang prosedur penyelamatan diri agar terbiasa saat panik.'],
        startRow: 0,
        startCol: 7,
      },
      {
        id: 'c1',
        number: 3,
        direction: 'across',
        answer: 'PERSIAPAN',
        clue: 'Segala usaha yang dilakukan SEBELUM bencana terjadi agar risiko berkurang.',
        clueLain: ['Semua yang dikerjakan jauh hari sebelum bencana, supaya risikonya mengecil.'],
        startRow: 1,
        startCol: 0,
      },
      {
        id: 'c4',
        number: 4,
        direction: 'down',
        answer: 'PETUGAS',
        clue: 'Orang yang bertugas menertibkan warga saat evakuasi berlangsung.',
        clueLain: ['Orang yang bertugas menertibkan warga saat proses penyelamatan berlangsung.'],
        startRow: 1,
        startCol: 0,
      },
    ],
  },
  // TAMBAH_VARIAN_0
];

const VARIAN_AREA_1: GridTTS[] = [
  {
    rows: 11,
    cols: 8,
    clues: [
      {
        id: 'c3',
        number: 1,
        direction: 'down',
        answer: 'LAPANGAN',
        clue: 'Ruang terbuka jauh dari bangunan yang dipakai sebagai titik kumpul.',
        clueLain: ['Tempat paling aman untuk berkumpul: luas dan tidak dikelilingi gedung.'],
        startRow: 0,
        startCol: 2,
      },
      {
        id: 'c2',
        number: 2,
        direction: 'down',
        answer: 'BERTAHAN',
        clue: 'Tetap berada di tempat berlindung sampai getaran benar-benar berhenti.',
        clueLain: ['Jangan buru-buru keluar; tunggu di tempat aman sampai guncangan benar-benar usai.'],
        startRow: 3,
        startCol: 1,
      },
      {
        id: 'c1',
        number: 3,
        direction: 'across',
        answer: 'MENUNDUK',
        clue: 'Menurunkan kepala mendekati lantai supaya tidak terkena benda yang jatuh.',
        clueLain: ['Gerakan menurunkan kepala ke arah lantai agar terhindar dari benda jatuh.'],
        startRow: 4,
        startCol: 0,
      },
      {
        id: 'c4',
        number: 4,
        direction: 'down',
        answer: 'MENJAUH',
        clue: 'Tindakan menghindar dari jendela kaca karena pecahannya dapat melukai.',
        clueLain: ['Jauhi kaca saat gempa karena pecahannya dapat melukai kulit.'],
        startRow: 4,
        startCol: 0,
      },
    ],
  },
  {
    rows: 8,
    cols: 8,
    clues: [
      {
        id: 'c4',
        number: 1,
        direction: 'across',
        answer: 'TANGGA',
        clue: 'Jalur turun darurat yang dipakai saat evakuasi, dan bukan lift.',
        clueLain: ['Jalur turun darurat yang dipakai saat penyelamatan diri, bukan lift.'],
        startRow: 0,
        startCol: 0,
      },
      {
        id: 'c2',
        number: 2,
        direction: 'down',
        answer: 'GETARAN',
        clue: 'Yang dirasakan saat gempa berlangsung, tanda harus segera berlindung.',
        clueLain: ['Yang dirasakan saat gempa berlangsung, tanda harus segera mencari perlindungan.'],
        startRow: 0,
        startCol: 3,
      },
      {
        id: 'c3',
        number: 3,
        direction: 'down',
        answer: 'JENDELA',
        clue: 'Bagian dinding yang harus dijauhi saat gempa karena mudah pecah.',
        clueLain: ['Kaca pada dinding bisa pecah dan melukai, jadi harus dijauhi saat gempa.'],
        startRow: 1,
        startCol: 5,
      },
      {
        id: 'c1',
        number: 4,
        direction: 'across',
        answer: 'KORIDOR',
        clue: 'Lorong penghubung antarkelas yang harus dijaga kosong saat gempa.',
        clueLain: ['Jalur penghubung antarkelas yang tidak boleh terhalang saat evakuasi.'],
        startRow: 4,
        startCol: 1,
      },
    ],
  },
  {
    rows: 7,
    cols: 6,
    clues: [
      {
        id: 'c4',
        number: 1,
        direction: 'down',
        answer: 'KEPALA',
        clue: 'Bagian tubuh yang dilindungi kedua tangan saat merunduk di bawah meja.',
        clueLain: ['Yang paling perlu dilindungi saat berlindung di bawah meja, karena rawan terbentur.'],
        startRow: 0,
        startCol: 1,
      },
      {
        id: 'c1',
        number: 2,
        direction: 'across',
        answer: 'TERTIB',
        clue: 'Sikap berbaris rapi tanpa saling mendorong ketika menuju titik kumpul.',
        clueLain: ['Saat menuju titik kumpul, jangan saling dorong dan tetap berbaris rapi.'],
        startRow: 1,
        startCol: 0,
      },
      {
        id: 'c2',
        number: 3,
        direction: 'down',
        answer: 'TANGAN',
        clue: 'Bagian tubuh yang dipakai melindungi kepala ketika merunduk.',
        clueLain: ['Bagian tubuh yang dipakai menutupi kepala saat berlindung di bawah meja.'],
        startRow: 1,
        startCol: 0,
      },
      {
        id: 'c3',
        number: 4,
        direction: 'down',
        answer: 'BANGKU',
        clue: 'Perabot kelas yang dapat dipakai berlindung bila mejanya tidak muat.',
        clueLain: ['Perabot kelas panjang berkaki yang dapat dipakai berlindung bila meja tidak muat.'],
        startRow: 1,
        startCol: 5,
      },
    ],
  },
];

const VARIAN_AREA_2: GridTTS[] = [
  {
    rows: 11,
    cols: 8,
    clues: [
      {
      id: 'c1',
      number: 1,
      direction: 'across',
      answer: 'SUSULAN',
      clue: 'Getaran gempa bumi berikutnya yang berpotensi terjadi beberapa menit hingga beberapa hari setelah gempa utama.',
        clueLain: ['Getaran lanjutan setelah gempa utama, dapat terjadi beberapa menit sampai beberapa hari.'],
      startRow: 1,
      startCol: 1,
      },
      {
      id: 'c2',
      number: 2,
      direction: 'down',
      answer: 'LAPANGAN',
      clue: 'Area terbuka luas yang paling aman dijadikan titik kumpul warga sekolah karena terbebas dari bahaya reruntuhan bangunan.',
        clueLain: ['Area terbuka luas yang paling aman sebagai titik kumpul karena bebas reruntuhan.'],
      startRow: 1,
      startCol: 5,
      },
      {
      id: 'c3',
      number: 3,
      direction: 'across',
      answer: 'BMKG',
      clue: 'Lembaga resmi pemerintah yang berwenang menyiarkan informasi gempa bumi dan peringatan dini tsunami di Indonesia.',
        clueLain: ['Lembaga pemerintah yang menyiarkan informasi gempa dan peringatan dini tsunami.'],
      startRow: 6,
      startCol: 2,
      },
      {
      id: 'c4',
      number: 4,
      direction: 'down',
      answer: 'MEDIS',
      clue: 'Bantuan pertolongan pertama (P3K) dan perawatan kesehatan yang diberikan kepada korban luka atau syok di posko darurat.',
        clueLain: ['Bantuan pertolongan pertama dan perawatan kesehatan bagi korban luka di posko.'],
      startRow: 6,
      startCol: 3,
      },
    ],
  },
  {
    rows: 10,
    cols: 10,
    clues: [
      {
        id: 'c3',
        number: 1,
        direction: 'down',
        answer: 'KEHADIRAN',
        clue: 'Hal pertama yang diperiksa di titik kumpul, apakah semua sudah lengkap.',
        clueLain: ['Di titik kumpul, petugas menghitung orang untuk memastikan tidak ada yang tertinggal.'],
        startRow: 0,
        startCol: 7,
      },
      {
        id: 'c2',
        number: 2,
        direction: 'down',
        answer: 'BERKUMPUL',
        clue: 'Setelah guncangan usai, semua warga menuju lapangan agar mudah diperiksa.',
        clueLain: ['Petugas memeriksa kelengkapan warga tepat setelah guncangan reda, di tempat terbuka.'],
        startRow: 1,
        startCol: 1,
      },
      {
        id: 'c1',
        number: 3,
        direction: 'across',
        answer: 'RERUNTUHAN',
        clue: 'Puing bangunan yang menutup jalur evakuasi setelah gempa besar.',
        clueLain: ['Sisa bangunan yang runtuh dan menghalangi jalan keluar.'],
        startRow: 2,
        startCol: 0,
      },
      {
        id: 'c4',
        number: 4,
        direction: 'down',
        answer: 'AMBULANS',
        clue: 'Kendaraan pengangkut korban luka menuju rumah sakit terdekat.',
        clueLain: ['Kendaraan bersirine yang membawa orang terluka ke rumah sakit.'],
        startRow: 2,
        startCol: 8,
      },
    ],
  },
  {
    rows: 10,
    cols: 7,
    clues: [
      {
        id: 'c3',
        number: 1,
        direction: 'down',
        answer: 'KORBAN',
        clue: 'Orang yang mengalami luka atau kerugian akibat peristiwa bencana.',
        clueLain: ['Siapa pun yang terkena dampak bencana, baik terluka maupun kehilangan harta.'],
        startRow: 0,
        startCol: 3,
      },
      {
        id: 'c4',
        number: 2,
        direction: 'down',
        answer: 'POSKO',
        clue: 'Tempat penanganan darurat yang didirikan di lapangan evakuasi.',
        clueLain: ['Tempat penanganan darurat yang didirikan di area titik kumpul.'],
        startRow: 2,
        startCol: 0,
      },
      {
        id: 'c2',
        number: 3,
        direction: 'down',
        answer: 'PETUGAS',
        clue: 'Orang berkompeten yang dipanggil untuk menangani korban cedera.',
        clueLain: ['Pihak yang dipanggil karena keahliannya untuk merawat orang terluka.'],
        startRow: 3,
        startCol: 1,
      },
      {
        id: 'c1',
        number: 4,
        direction: 'across',
        answer: 'SELAMAT',
        clue: 'Kondisi warga yang berhasil keluar dari bangunan tanpa cedera.',
        clueLain: ['Keadaan warga yang berhasil keluar dari bangunan tanpa luka sedikit pun.'],
        startRow: 4,
        startCol: 0,
      },
    ],
  },
  // TAMBAH_VARIAN_2
];

const VARIAN_AREA_3: GridTTS[] = [
  {
    rows: 8,
    cols: 11,
    clues: [
      {
      id: 'c1',
      number: 1,
      direction: 'across',
      answer: 'MAGMA',
      clue: 'Batuan cair pijar bersuhu ribuan derajat di perut bumi, sekaligus nama aplikasi resmi pemantauan gunung api di Indonesia.',
        clueLain: ['Zat cair pijar bersuhu ribuan derajat di perut bumi, juga nama aplikasi pemantauan gunung api.'],
      startRow: 1,
      startCol: 1,
      },
      {
      id: 'c2',
      number: 2,
      direction: 'down',
      answer: 'MASKER',
      clue: 'Alat pelindung pernapasan wajib disiapkan untuk menyaring partikel abu silika tajam agar tidak merusak paru-paru.',
        clueLain: ['Alat pelindung pernapasan untuk menyaring abu tajam agar paru-paru tidak rusak.'],
      startRow: 1,
      startCol: 1,
      },
      {
      id: 'c3',
      number: 3,
      direction: 'down',
      answer: 'AWAS',
      clue: 'Tingkat status aktivitas gunung api tertinggi (Level IV) yang menandakan letusan utama berpeluang besar segera terjadi.',
        clueLain: ['Tingkat status gunung api tertinggi, Level IV, tanda letusan utama segera terjadi.'],
      startRow: 1,
      startCol: 5,
      },
      {
      id: 'c4',
      number: 4,
      direction: 'across',
      answer: 'SIAGA',
      clue: 'Tingkat status gunung api Level III yang menunjukkan peningkatan aktivitas seismik secara nyata dan letusan dapat segera menyusul.',
        clueLain: ['Tingkat status gunung api Level III: aktivitas gempa meningkat nyata, letusan dapat menyusul.'],
      startRow: 4,
      startCol: 5,
      },
    ],
  },
  {
    rows: 9,
    cols: 10,
    clues: [
      {
        id: 'c2',
        number: 1,
        direction: 'down',
        answer: 'DEFORMASI',
        clue: 'Perubahan bentuk tubuh gunung akibat tekanan magma dari dalam.',
        clueLain: ['Perubahan bentuk tubuh gunung akibat tekanan zat cair panas dari dalam.'],
        startRow: 0,
        startCol: 1,
      },
      {
        id: 'c3',
        number: 2,
        direction: 'down',
        answer: 'WASPADA',
        clue: 'Tingkat status gunung api satu langkah di atas Normal.',
        clueLain: ['Tingkat status gunung api satu tingkat di atas Normal, yaitu Level II.'],
        startRow: 0,
        startCol: 8,
      },
      {
        id: 'c1',
        number: 3,
        direction: 'across',
        answer: 'SEISMOGRAF',
        clue: 'Alat perekam getaran magma di pos pengamatan gunung api.',
        clueLain: ['Di pos pengamatan, alat ini mencatat setiap getaran yang berasal dari dalam gunung.'],
        startRow: 1,
        startCol: 0,
      },
      {
        id: 'c4',
        number: 4,
        direction: 'down',
        answer: 'STATUS',
        clue: 'Tingkat kondisi gunung api, dari Normal sampai Awas.',
        clueLain: ['Tingkat kondisi gunung api, mulai dari Normal hingga Awas.'],
        startRow: 1,
        startCol: 0,
      },
    ],
  },
  {
    rows: 6,
    cols: 6,
    clues: [
      {
        id: 'c3',
        number: 1,
        direction: 'down',
        answer: 'KABUT',
        clue: 'Sebutan sehari-hari untuk awan panas yang meluncur dari kawah.',
        clueLain: ['Warga biasa menyebut awan panas yang turun dari kawah dengan kata ini.'],
        startRow: 0,
        startCol: 1,
      },
      {
        id: 'c4',
        number: 2,
        direction: 'down',
        answer: 'GAS',
        clue: 'Zat yang komposisinya dipantau untuk menilai kesiapan gunung meletus.',
        clueLain: ['Zat yang keluar dari kawah dan komposisinya dipantau untuk menilai kesiapan letusan.'],
        startRow: 0,
        startCol: 4,
      },
      {
        id: 'c1',
        number: 3,
        direction: 'across',
        answer: 'PANTAU',
        clue: 'Kegiatan mengamati gunung api terus-menerus dari pos pengamatan.',
        clueLain: ['Kegiatan mengawasi gunung api tanpa henti dari pos pengamatan.'],
        startRow: 1,
        startCol: 0,
      },
      {
        id: 'c2',
        number: 4,
        direction: 'down',
        answer: 'PVMBG',
        clue: 'Lembaga pemerintah yang memantau aktivitas gunung api di Indonesia.',
        clueLain: ['Nama lembaga yang berwenang mengeluarkan status gunung api di negara kita.'],
        startRow: 1,
        startCol: 0,
      },
    ],
  },
  // TAMBAH_VARIAN_3
];

const VARIAN_AREA_5: GridTTS[] = [
  {
    rows: 6,
    cols: 7,
    clues: [
      {
      id: 'c1',
      number: 1,
      direction: 'across',
      answer: 'BARAK',
      clue: 'Tempat penampungan pengungsian terpadu yang aman bagi warga terdampak erupsi, dilengkapi posko medis dan logistik.',
        clueLain: ['Tempat penampungan terpadu yang aman bagi warga terdampak letusan, lengkap dengan posko.'],
      startRow: 1,
      startCol: 1,
      },
      {
      id: 'c2',
      number: 2,
      direction: 'down',
      answer: 'ATAP',
      clue: 'Bagian bangunan rumah yang wajib dibersihkan dari timbunan abu vulkanik tebal secara gotong royong agar tidak ambruk akibat beban berat.',
        clueLain: ['Bagian teratas rumah yang wajib dibersihkan dari timbunan abu agar tidak ambruk.'],
      startRow: 1,
      startCol: 2,
      },
      {
      id: 'c3',
      number: 3,
      direction: 'across',
      answer: 'PAPAN',
      // Catatan: harus 5 huruf berpola _A_A_ agar huruf silang dengan ATAP (kolom 2) dan AMAN (kolom 4) tetap cocok.
      clue: 'Alas panjang beralas kain yang dipakai petugas mengusung korban luka ke posko medis, disebut tandu darurat.',
        clueLain: ['Tandu darurat: alas berkain yang dipakai petugas mengusung orang terluka ke posko.'],
      startRow: 3,
      startCol: 1,
      },
      {
      id: 'c4',
      number: 4,
      direction: 'down',
      answer: 'AMAN',
      clue: 'Keadaan warga di barak pengungsian Zona KRB I yang terbebas dari bahaya awan panas dan guguran lava.',
        clueLain: ['Warga di barak Zona KRB I jauh dari jangkauan awan panas maupun guguran lava.'],
      startRow: 1,
      startCol: 4,
      },
    ],
  },
  {
    rows: 10,
    cols: 9,
    clues: [
      {
        id: 'c4',
        number: 1,
        direction: 'down',
        answer: 'BANTUAN',
        clue: 'Kiriman kebutuhan yang dibagi menurut kebutuhan, bukan siapa yang cepat.',
        clueLain: ['Barang kiriman yang dibagikan sesuai keperluan tiap keluarga, bukan siapa yang paling cepat mengantre.'],
        startRow: 0,
        startCol: 2,
      },
      {
        id: 'c3',
        number: 2,
        direction: 'down',
        answer: 'LOGISTIK',
        clue: 'Pasokan kebutuhan pokok bagi para pengungsi di barak.',
        clueLain: ['Pasokan kebutuhan pokok bagi warga yang tinggal di penampungan.'],
        startRow: 0,
        startCol: 3,
      },
      {
        id: 'c1',
        number: 3,
        direction: 'across',
        answer: 'PENGUNGSI',
        clue: 'Warga yang meninggalkan rumah dan tinggal di tempat penampungan.',
        clueLain: ['Warga yang untuk sementara tidak tinggal di rumahnya karena harus mencari tempat aman.'],
        startRow: 2,
        startCol: 0,
      },
      {
        id: 'c2',
        number: 4,
        direction: 'down',
        answer: 'SANITASI',
        clue: 'Sistem kebersihan yang wajib dijaga agar penyakit tidak menyebar.',
        clueLain: ['Di penampungan, air bersih, jamban, dan pembuangan sampah harus dijaga agar wabah tidak muncul.'],
        startRow: 2,
        startCol: 7,
      },
    ],
  },
  {
    rows: 8,
    cols: 6,
    clues: [
      {
        id: 'c4',
        number: 1,
        direction: 'down',
        answer: 'MEDIS',
        clue: 'Layanan kesehatan yang wajib tersedia di barak pengungsian.',
        clueLain: ['Layanan kesehatan yang wajib tersedia di tempat penampungan.'],
        startRow: 0,
        startCol: 4,
      },
      {
        id: 'c2',
        number: 2,
        direction: 'down',
        answer: 'TRAUMA',
        clue: 'Gangguan jiwa akibat bencana yang memerlukan dukungan psikologis.',
        clueLain: ['Luka batin yang dialami penyintas bencana dan butuh pendampingan psikolog.'],
        startRow: 1,
        startCol: 1,
      },
      {
        id: 'c3',
        number: 3,
        direction: 'down',
        answer: 'TANDON',
        clue: 'Tempat penampungan air bersih yang harus dijaga kebersihannya.',
        clueLain: ['Wadah besar penampung air bersih yang harus dijaga kebersihannya.'],
        startRow: 2,
        startCol: 5,
      },
      {
        id: 'c1',
        number: 4,
        direction: 'across',
        answer: 'LANSIA',
        clue: 'Kelompok lanjut usia yang perlu didahulukan menerima bantuan.',
        clueLain: ['Kelompok warga yang sudah berumur dan perlu didahulukan menerima bantuan.'],
        startRow: 3,
        startCol: 0,
      },
    ],
  },
  // TAMBAH_VARIAN_5
];

const VARIAN_AREA_4: GridTTS[] = [
  {
    rows: 17,
    cols: 11,
    clues: [
      {
        id: 'c3',
        number: 1,
        direction: 'down',
        answer: 'MENGUNGSI',
        clue: 'Meninggalkan rumah menuju tempat aman atas arahan petugas.',
        clueLain: ['Apa yang dilakukan warga ketika petugas meminta mereka pergi ke tempat yang lebih aman.'],
        startRow: 0,
        startCol: 7,
      },
      {
        id: 'c1',
        number: 2,
        direction: 'across',
        answer: 'PIROKLASTIK',
        clue: 'Aliran gas dan material panas yang meluncur cepat menuruni lereng gunung.',
        clueLain: ['Campuran awan gas dan batuan panas yang melesat turun dari puncak.'],
        startRow: 7,
        startCol: 0,
      },
      {
        id: 'c2',
        number: 3,
        direction: 'down',
        answer: 'PERINGATAN',
        clue: 'Pemberitahuan resmi mengenai ancaman bahaya yang akan datang.',
        clueLain: ['Kabar resmi dari pihak berwenang bahwa bahaya sedang mendekat.'],
        startRow: 7,
        startCol: 0,
      },
      {
        id: 'c4',
        number: 4,
        direction: 'down',
        answer: 'LEDAKAN',
        clue: 'Letusan dahsyat yang menyemburkan material vulkanik ke udara.',
        clueLain: ['Peristiwa letusan hebat yang menyemburkan material vulkanik ke udara.'],
        startRow: 7,
        startCol: 5,
      },
    ],
  },
  {
    rows: 7,
    cols: 11,
    clues: [
      {
        id: 'c2',
        number: 1,
        direction: 'down',
        answer: 'GEMURUH',
        clue: 'Suara berdengung keras dari dalam gunung tanda aktivitas meningkat.',
        clueLain: ['Bunyi berat dari perut gunung yang menandakan aktivitasnya naik.'],
        startRow: 0,
        startCol: 5,
      },
      {
        id: 'c3',
        number: 2,
        direction: 'down',
        answer: 'ERUPSI',
        clue: 'Peristiwa keluarnya magma dan gas dari dalam gunung menuju permukaan.',
        clueLain: ['Peristiwa keluarnya zat cair panas dan gas dari gunung ke permukaan.'],
        startRow: 0,
        startCol: 8,
      },
      {
        id: 'c1',
        number: 3,
        direction: 'across',
        answer: 'MENURUN',
        clue: 'Arah aliran awan panas, yaitu mengikuti lereng dan lembah.',
        clueLain: ['Arah aliran awan panas: bergerak turun mengikuti lereng dan lembah.'],
        startRow: 1,
        startCol: 4,
      },
      {
        id: 'c4',
        number: 4,
        direction: 'across',
        answer: 'KRATER',
        clue: 'Lubang kawah di puncak gunung tempat magma dan gas keluar.',
        clueLain: ['Lubang kawah di puncak gunung tempat zat cair panas dan gas keluar.'],
        startRow: 4,
        startCol: 0,
      },
    ],
  },
  {
    rows: 10,
    cols: 6,
    clues: [
      {
        id: 'c3',
        number: 1,
        direction: 'down',
        answer: 'LAHAR',
        clue: 'Aliran campuran air, pasir, dan batu vulkanik yang turun melalui alur sungai.',
        clueLain: ['Ketika hujan bercampur material vulkanik mengalir deras menyusuri lembah sungai.'],
        startRow: 0,
        startCol: 5,
      },
      {
        id: 'c4',
        number: 2,
        direction: 'down',
        answer: 'TUTUP',
        clue: 'Yang harus dilakukan pada jendela dan pintu agar abu tidak masuk.',
        clueLain: ['Tindakan pada jendela dan pintu agar abu tidak masuk ke rumah.'],
        startRow: 3,
        startCol: 1,
      },
      {
        id: 'c1',
        number: 3,
        direction: 'across',
        answer: 'SUMBER',
        clue: 'Tempat air berasal, yang wajib dilindungi dari abu vulkanik.',
        clueLain: ['Tempat air berasal dan wajib dilindungi agar tidak tercemar abu.'],
        startRow: 4,
        startCol: 0,
      },
      {
        id: 'c2',
        number: 4,
        direction: 'down',
        answer: 'BAHAYA',
        clue: 'Kondisi yang mengancam keselamatan sehingga warga harus menjauh.',
        clueLain: ['Keadaan yang mengancam keselamatan sehingga warga wajib menjauh.'],
        startRow: 4,
        startCol: 3,
      },
    ],
  },
];

export const BANK_TTS: Record<number, GridTTS[]> = {
  0: VARIAN_AREA_0,
  1: VARIAN_AREA_1,
  2: VARIAN_AREA_2,
  3: VARIAN_AREA_3,
  4: VARIAN_AREA_4,
  5: VARIAN_AREA_5,
};

// ══════════════════════════════════════════════════════════════════════════
// VALIDATOR — MEMBUKTIKAN SEBUAH GRID DAPAT DISELESAIKAN
// ══════════════════════════════════════════════════════════════════════════

/** Satu kotak grid beserta huruf yang seharusnya mengisinya. */
interface KotakTerisi {
  huruf: string;
  pemakai: string[];
}

/**
 * Periksa apakah sebuah grid TTS dapat diselesaikan.
 *
 * Mengembalikan daftar masalah; daftar KOSONG berarti grid itu sah.
 *
 * Fungsi ini sengaja murni — tidak menyentuh React dan tidak menyentuh
 * jaringan — supaya dapat dijalankan atas seluruh bank di dalam uji otomatis.
 *
 * Pemeriksaan terpentingnya adalah TITIK POTONG. Pada TTS, satu kotak dapat
 * dipakai satu kata mendatar dan satu kata menurun sekaligus, sehingga hurufnya
 * wajib sama. Kalau tidak sama, teka-tekinya mustahil diisi — dan tanpa
 * validator, kesalahan itu tidak akan terlihat sampai siswa mengeluh.
 */
export function periksaGrid(grid: GridTTS): string[] {
  const masalah: string[] = [];
  const kotak = new Map<string, KotakTerisi>();

  if (grid.clues.length === 0) {
    return ['grid tidak memiliki satu kata pun'];
  }

  const jawabanTerpakai = new Set<string>();
  const nomorTerpakai = new Set<number>();
  const idTerpakai = new Set<string>();

  for (const c of grid.clues) {
    const nama = `${c.id} ("${c.answer}")`;

    // ── Keabsahan dasar ──────────────────────────────────────────────────
    if (idTerpakai.has(c.id)) masalah.push(`id kembar: ${c.id}`);
    idTerpakai.add(c.id);

    if (c.clue.trim() === '') masalah.push(`${nama}: petunjuk kosong`);

    if (!/^[A-Z]+$/.test(c.answer)) {
      masalah.push(`${nama}: jawaban harus huruf kapital A-Z tanpa spasi`);
      continue;
    }
    if (c.answer.length < 3) masalah.push(`${nama}: jawaban terlalu pendek`);

    if (jawabanTerpakai.has(c.answer)) masalah.push(`jawaban kembar dalam satu grid: ${c.answer}`);
    jawabanTerpakai.add(c.answer);

    if (nomorTerpakai.has(c.number)) masalah.push(`nomor ${c.number} dipakai dua kali`);
    nomorTerpakai.add(c.number);

    if (c.startRow < 0 || c.startCol < 0) {
      masalah.push(`${nama}: titik mulai bernilai negatif`);
      continue;
    }

    for (let i = 0; i < c.answer.length; i++) {
      const r = c.direction === 'across' ? c.startRow : c.startRow + i;
      const k = c.direction === 'across' ? c.startCol + i : c.startCol;

      // ── Seluruh huruf wajib berada di dalam batas grid ──────────────────
      if (r >= grid.rows || k >= grid.cols) {
        masalah.push(`${nama}: huruf ke-${i + 1} jatuh di luar batas grid (${r},${k})`);
        break;
      }

      // ── Titik potong: huruf yang sama wajib menempati kotak yang sama ───
      const kunci = `${r}-${k}`;
      const sudah = kotak.get(kunci);
      const pemakaiKini = `${c.id}:${c.direction}`;

      if (!sudah) {
        kotak.set(kunci, { huruf: c.answer[i], pemakai: [pemakaiKini] });
      } else if (sudah.huruf !== c.answer[i]) {
        masalah.push(
          `BENTROK di kotak (${r},${k}): ${sudah.pemakai.join(' + ')} memakai "${sudah.huruf}", ` +
            `tetapi ${pemakaiKini} memakai "${c.answer[i]}" — TTS ini mustahil diisi`,
        );
      } else {
        sudah.pemakai.push(pemakaiKini);
      }
    }
  }

  // ── Dua kata SEARAH tidak boleh saling menimpa ─────────────────────────
  // Kalau menimpa, keduanya mengklaim kotak yang sama pada baris/kolom yang
  // sama, sehingga salah satu huruf pasti terbuang.
  for (let a = 0; a < grid.clues.length; a++) {
    for (let b = a + 1; b < grid.clues.length; b++) {
      const x = grid.clues[a];
      const y = grid.clues[b];
      if (x.direction !== y.direction) continue;

      const selX = new Set<string>();
      for (let i = 0; i < x.answer.length; i++) {
        const r = x.direction === 'across' ? x.startRow : x.startRow + i;
        const k = x.direction === 'across' ? x.startCol + i : x.startCol;
        selX.add(`${r}-${k}`);
      }
      for (let j = 0; j < y.answer.length; j++) {
        const r = y.direction === 'across' ? y.startRow : y.startRow + j;
        const k = y.direction === 'across' ? y.startCol + j : y.startCol;
        if (selX.has(`${r}-${k}`)) {
          masalah.push(`dua kata searah saling menimpa di kotak (${r},${k}): ${x.id} dan ${y.id}`);
        }
      }
    }
  }

  return masalah;
}

// ══════════════════════════════════════════════════════════════════════════
// PENGUNDIAN
// ══════════════════════════════════════════════════════════════════════════

/** Seluruh varian milik satu area (kosong bila area tidak ada di bank). */
/**
 * Petunjuk yang dibaca seorang siswa untuk satu kata TTS.
 *
 * Kalimatnya dipilih dari `clue` dan `clueLain` memakai mesin berbenih yang sama
 * dengan pengundian grid, sehingga:
 *
 *   - BERBEDA antar-siswa - dua siswa yang kebetulan mendapat kata yang sama
 *     tetap membaca kalimat soal yang berbeda,
 *   - TETAP bagi siswa yang sama - menyegarkan halaman tidak mengubah kalimatnya,
 *   - JAWABANNYA TIDAK BERUBAH - hanya redaksinya yang berbeda.
 */
export function petunjukTTSUntuk(
  clue: ClueTTS,
  area: number,
  userId: string,
): string {
  const pilihan = [clue.clue, ...(clue.clueLain ?? [])];
  if (pilihan.length <= 1) return clue.clue;

  const dipilih = pilihBerbenih(
    pilihan,
    benihDari(`${userId}|tts|${area}|${clue.id}|${clue.answer}`),
  );
  return dipilih ?? clue.clue;
}

export function varianTTS(areaIndex: number): GridTTS[] {
  return BANK_TTS[areaIndex] ?? [];
}

/**
 * Undi satu grid untuk siswa ini.
 *
 * Memakai mesin berbenih yang sama seperti bank kata gerbang Level 1, sehingga
 * sifatnya sama:
 *
 *   - BERBEDA antar-siswa — tidak lagi seluruh angkatan mengisi teka-teki yang
 *     sama persis,
 *   - TETAP bagi siswa yang sama — membuka ulang area itu menghasilkan grid yang
 *     sama, sehingga tidak ada yang bisa "mengundi ulang" dengan me-refresh, dan
 *   - DAPAT DIPERIKSA guru — dengan benih yang sama hasilnya dapat dihitung ulang.
 *
 * Mengembalikan `null` hanya bila bank benar-benar kosong, sehingga pemanggil
 * wajib menanganinya alih-alih menerima nilai tak terduga.
 */
export function undiGridTTS(areaIndex: number, userId: string): GridTTS | null {
  const langsung = pilihBerbenih(varianTTS(areaIndex), benihDari(`${userId}|tts|${areaIndex}`));
  if (langsung) return langsung;

  // Area tidak ada di bank — pakai area 0 sebagai cadangan supaya teka-tekinya
  // tidak pernah kosong. Benihnya memakai penanda area 0, bukan nomor area yang
  // salah, agar hasilnya tetap dapat diperiksa.
  return pilihBerbenih(varianTTS(0), benihDari(`${userId}|tts|0`));
}
