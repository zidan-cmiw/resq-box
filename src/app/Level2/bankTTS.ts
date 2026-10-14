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
    rows: 11,
    cols: 10,
    clues: [
      {
        id: 'c4',
        number: 1,
        direction: 'down',
        answer: 'MERUNDUK',
        clue: 'Gerakan pertama saat gempa: ... ke bawah mendekati lantai agar tidak terkena benda yang jatuh.',
        clueLain: ['Gerakan menurunkan badan mendekati lantai saat gempa dimulai.'],
        startRow: 0,
        startCol: 7,
      },
      {
        id: 'c2',
        number: 2,
        direction: 'down',
        answer: 'KORSLETING',
        clue: 'Bahaya listrik yang harus diwaspadai setelah guncangan mereda.',
        clueLain: ['Risiko hubungan arus pendek yang diperiksa sebelum meninggalkan area.'],
        startRow: 1,
        startCol: 2,
      },
      {
        id: 'c1',
        number: 3,
        direction: 'across',
        answer: 'BERLINDUNG',
        clue: 'Masuk ke bawah meja saat terjadi gempa untuk ... dari material yang jatuh.',
        clueLain: ['Tindakan mencari tempat aman di bawah meja agar tidak tertimpa benda yang jatuh.'],
        startRow: 3,
        startCol: 0,
      },
      {
        id: 'c3',
        number: 4,
        direction: 'down',
        answer: 'EVAKUASI',
        clue: 'Saat status AWAS, segera tinggalkan zona KRB III menuju tempat aman.',
        clueLain: ['Tindakan meninggalkan kawasan berbahaya ke tempat aman ketika status AWAS.'],
        startRow: 3,
        startCol: 1,
      },
    ],
  },
  {
    rows: 7,
    cols: 6,
    clues: [
      {
        id: 'c2',
        number: 1,
        direction: 'down',
        answer: 'PELUIT',
        clue: 'Alat yang dibunyikan untuk meminta pertolongan saat terjebak.',
        clueLain: ['Benda kecil di tas siaga yang bunyinya memanggil bantuan.'],
        startRow: 0,
        startCol: 1,
      },
      {
        id: 'c1',
        number: 2,
        direction: 'across',
        answer: 'SENTER',
        clue: 'Alat penerang di dalam tas siaga bencana.',
        clueLain: ['Perkakas bercahaya yang wajib ada di tas siaga untuk keadaan gelap.'],
        startRow: 1,
        startCol: 0,
      },
      {
        id: 'c4',
        number: 3,
        direction: 'down',
        answer: 'TANGGA',
        clue: 'Jalur turun darurat yang dipakai saat gempa, dan bukan lift.',
        clueLain: ['Jalur menurun di gedung yang wajib dipakai saat evakuasi, bukan lift.'],
        startRow: 1,
        startCol: 3,
      },
      {
        id: 'c3',
        number: 4,
        direction: 'down',
        answer: 'RANSUM',
        clue: 'Makanan darurat yang disimpan di dalam tas siaga bencana.',
        clueLain: ['Bekal makanan tahan lama untuk 72 jam pertama.'],
        startRow: 1,
        startCol: 5,
      },
    ],
  },
  {
    rows: 5,
    cols: 8,
    clues: [
      {
        id: 'c2',
        number: 1,
        direction: 'down',
        answer: 'GEMPA',
        clue: 'Peristiwa getaran atau guncangan tanah mendadak yang kita simulasikan cara penyelamatannya di kelas.',
        clueLain: ['Guncangan tanah yang datang mendadak dan dapat merobohkan bangunan.'],
        startRow: 0,
        startCol: 3,
      },
      {
        id: 'c3',
        number: 2,
        direction: 'down',
        answer: 'SIAGA',
        clue: 'Tingkat status gunung api Level III yang menunjukkan peningkatan aktivitas seismik secara nyata dan letusan dapat segera menyusul.',
        clueLain: ['Tingkat status gunung api Level III: aktivitas gempa meningkat nyata, letusan dapat menyusul.'],
        startRow: 0,
        startCol: 6,
      },
      {
        id: 'c1',
        number: 3,
        direction: 'across',
        answer: 'TERTIB',
        clue: 'Sikap berbaris rapi tanpa saling mendorong ketika evakuasi.',
        clueLain: ['Cara berjalan menuju titik kumpul: rapi dan tidak saling dorong.'],
        startRow: 1,
        startCol: 2,
      },
      {
        id: 'c4',
        number: 4,
        direction: 'across',
        answer: 'DENAH',
        clue: 'Gambar susunan ruangan yang dipelajari agar tahu jalur keluar.',
        clueLain: ['Yang dikenali sejak sebelum gempa supaya tahu jalan keluar sekolah.'],
        startRow: 4,
        startCol: 0,
      },
    ],
  },
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
    rows: 13,
    cols: 11,
    clues: [
      {
        id: 'c4',
        number: 1,
        direction: 'down',
        answer: 'SELAMAT',
        clue: 'Kondisi warga yang berhasil keluar dari bangunan tanpa cedera.',
        clueLain: ['Keadaan warga yang berhasil keluar dari bangunan tanpa luka sedikit pun.'],
        startRow: 0,
        startCol: 8,
      },
      {
        id: 'c3',
        number: 2,
        direction: 'down',
        answer: 'SUSULAN',
        clue: 'Getaran gempa bumi berikutnya yang berpotensi terjadi beberapa menit hingga beberapa hari setelah gempa utama.',
        clueLain: ['Getaran lanjutan setelah gempa utama, dapat terjadi beberapa menit sampai beberapa hari.'],
        startRow: 1,
        startCol: 7,
      },
      {
        id: 'c2',
        number: 3,
        direction: 'down',
        answer: 'PRESENSI',
        clue: 'Pemeriksaan menyeluruh di titik kumpul untuk memastikan tidak ada yang tertinggal.',
        clueLain: ['Pendataan ulang seluruh siswa di titik kumpul agar tidak ada yang hilang.'],
        startRow: 5,
        startCol: 3,
      },
      {
        id: 'c1',
        number: 4,
        direction: 'across',
        answer: 'KOORDINATOR',
        clue: 'Orang yang memimpin pemeriksaan di titik kumpul.',
        clueLain: ['Pihak yang mengatur pendataan warga di titik kumpul bersama guru.'],
        startRow: 6,
        startCol: 0,
      },
    ],
  },
  {
    rows: 6,
    cols: 9,
    clues: [
      {
        id: 'c2',
        number: 1,
        direction: 'down',
        answer: 'HOAKS',
        clue: 'Kabar bohong yang harus dihindari dan tidak disebarkan.',
        clueLain: ['Informasi palsu yang wajib tidak diteruskan ke orang lain.'],
        startRow: 0,
        startCol: 4,
      },
      {
        id: 'c1',
        number: 2,
        direction: 'across',
        answer: 'KORBAN',
        clue: 'Orang yang mengalami luka atau kerugian akibat peristiwa bencana.',
        clueLain: ['Siapa pun yang terkena dampak bencana, baik terluka maupun kehilangan harta.'],
        startRow: 1,
        startCol: 3,
      },
      {
        id: 'c4',
        number: 3,
        direction: 'down',
        answer: 'RETAK',
        clue: 'Keadaan bangunan yang harus dijauhi setelah gempa.',
        clueLain: ['Kondisi dinding gedung yang menandakan strukturnya belum aman.'],
        startRow: 1,
        startCol: 5,
      },
      {
        id: 'c3',
        number: 4,
        direction: 'across',
        answer: 'MEDIS',
        clue: 'Bantuan pertolongan pertama (P3K) dan perawatan kesehatan yang diberikan kepada korban luka atau syok di posko darurat.',
        clueLain: ['Bantuan pertolongan pertama dan perawatan kesehatan bagi korban luka di posko.'],
        startRow: 4,
        startCol: 0,
      },
    ],
  },
  {
    rows: 4,
    cols: 7,
    clues: [
      {
        id: 'c1',
        number: 1,
        direction: 'across',
        answer: 'KABEL',
        clue: 'Yang harus dijauhi bersama tiang dan pohon agar tidak tersengat.',
        clueLain: ['Saluran listrik yang berbahaya bila tersentuh setelah gempa.'],
        startRow: 0,
        startCol: 0,
      },
      {
        id: 'c2',
        number: 2,
        direction: 'down',
        answer: 'BMKG',
        clue: 'Lembaga resmi pemerintah yang berwenang menyiarkan informasi gempa bumi dan peringatan dini tsunami di Indonesia.',
        clueLain: ['Lembaga pemerintah yang menyiarkan informasi gempa dan peringatan dini tsunami.'],
        startRow: 0,
        startCol: 2,
      },
      {
        id: 'c3',
        number: 3,
        direction: 'down',
        answer: 'LUKA',
        clue: 'Keadaan korban yang mendapat pertolongan pertama setelah gempa.',
        clueLain: ['Akibat yang dialami korban sehingga perlu bantuan medis.'],
        startRow: 0,
        startCol: 4,
      },
      {
        id: 'c4',
        number: 4,
        direction: 'across',
        answer: 'GURU',
        clue: 'Yang melakukan presensi bersama koordinator di titik kumpul.',
        clueLain: ['Pendamping siswa yang memastikan semua anak terdata di titik kumpul.'],
        startRow: 1,
        startCol: 3,
      },
    ],
  },
];

const VARIAN_AREA_3: GridTTS[] = [
  {
    rows: 7,
    cols: 7,
    clues: [
      {
        id: 'c2',
        number: 1,
        direction: 'down',
        answer: 'MASKER',
        clue: 'Alat yang menutup hidung dan mulut untuk menyaring abu vulkanik.',
        clueLain: ['Pelindung pernapasan yang wajib dikenakan saat status SIAGA.'],
        startRow: 0,
        startCol: 1,
      },
      {
        id: 'c1',
        number: 2,
        direction: 'across',
        answer: 'WASPADA',
        clue: 'Tingkat status gunung api satu langkah di atas Normal.',
        clueLain: ['Tingkat status gunung api satu tingkat di atas Normal, yaitu Level II.'],
        startRow: 1,
        startCol: 0,
      },
      {
        id: 'c3',
        number: 3,
        direction: 'down',
        answer: 'STATUS',
        clue: 'Tingkat kondisi gunung api, dari Normal sampai Awas.',
        clueLain: ['Tingkat kondisi gunung api, mulai dari Normal hingga Awas.'],
        startRow: 1,
        startCol: 2,
      },
      {
        id: 'c4',
        number: 4,
        direction: 'down',
        answer: 'PANTAU',
        clue: 'Kegiatan mengamati gunung api terus-menerus dari pos pengamatan.',
        clueLain: ['Kegiatan mengawasi gunung api tanpa henti dari pos pengamatan.'],
        startRow: 1,
        startCol: 3,
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
        answer: 'HUNIAN',
        clue: 'KRB III adalah zona larangan ... tetap karena selalu terancam awan panas.',
        clueLain: ['Jenis bangunan yang dilarang berdiri tetap di KRB III.'],
        startRow: 0,
        startCol: 4,
      },
      {
        id: 'c3',
        number: 2,
        direction: 'down',
        answer: 'GEMBEL',
        clue: 'Kata kedua dari sebutan Jawa untuk awan panas: wedhus ...',
        clueLain: ['Pasangan kata "wedhus", nama lain awan panas guguran.'],
        startRow: 1,
        startCol: 1,
      },
      {
        id: 'c1',
        number: 3,
        direction: 'across',
        answer: 'LERENG',
        clue: 'Bagian miring gunung tempat KRB II berada.',
        clueLain: ['Bagian gunung yang melandai di bawah puncak, termasuk zona tengah.'],
        startRow: 2,
        startCol: 0,
      },
      {
        id: 'c2',
        number: 4,
        direction: 'down',
        answer: 'GOGGLE',
        clue: 'Kacamata pelindung yang wajib dipakai bersama masker N95.',
        clueLain: ['Pelindung mata dari abu vulkanik, bagian dari APD warga Merapi.'],
        startRow: 2,
        startCol: 5,
      },
    ],
  },
  {
    rows: 6,
    cols: 5,
    clues: [
      {
        id: 'c3',
        number: 1,
        direction: 'down',
        answer: 'PVMBG',
        clue: 'Lembaga pemerintah yang memantau aktivitas gunung api di Indonesia.',
        clueLain: ['Nama lembaga yang berwenang mengeluarkan status gunung api di negara kita.'],
        startRow: 0,
        startCol: 0,
      },
      {
        id: 'c2',
        number: 2,
        direction: 'down',
        answer: 'SIAGA',
        clue: 'Tingkat status gunung api Level III yang menunjukkan peningkatan aktivitas seismik secara nyata dan letusan dapat segera menyusul.',
        clueLain: ['Tingkat status gunung api Level III: aktivitas gempa meningkat nyata, letusan dapat menyusul.'],
        startRow: 0,
        startCol: 1,
      },
      {
        id: 'c1',
        number: 3,
        direction: 'across',
        answer: 'MAGMA',
        clue: 'Batuan cair pijar bersuhu ribuan derajat di perut bumi, sekaligus nama aplikasi resmi pemantauan gunung api di Indonesia.',
        clueLain: ['Zat cair pijar bersuhu ribuan derajat di perut bumi, juga nama aplikasi pemantauan gunung api.'],
        startRow: 2,
        startCol: 0,
      },
      {
        id: 'c4',
        number: 4,
        direction: 'down',
        answer: 'AWAS',
        clue: 'Tingkat status aktivitas gunung api tertinggi (Level IV) yang menandakan letusan utama berpeluang besar segera terjadi.',
        clueLain: ['Tingkat status gunung api tertinggi, Level IV, tanda letusan utama segera terjadi.'],
        startRow: 2,
        startCol: 4,
      },
    ],
  },
];

const VARIAN_AREA_5: GridTTS[] = [
  {
    rows: 10,
    cols: 9,
    clues: [
      {
        id: 'c3',
        number: 1,
        direction: 'down',
        answer: 'TANDON',
        clue: 'Wadah besar penampung air bersih yang harus dijaga kebersihannya.',
        clueLain: ['Tempat penampungan air bersih yang harus dijaga kebersihannya.'],
        startRow: 0,
        startCol: 2,
      },
      {
        id: 'c1',
        number: 2,
        direction: 'across',
        answer: 'PENGUNGSI',
        clue: 'Warga yang meninggalkan rumah dan tinggal sementara di tempat penampungan.',
        clueLain: ['Warga yang untuk sementara tidak tinggal di rumahnya karena mencari tempat aman.'],
        startRow: 2,
        startCol: 0,
      },
      {
        id: 'c4',
        number: 3,
        direction: 'down',
        answer: 'GOTONG',
        clue: 'Sikap bersama-sama warga saat membersihkan atap dari abu: ... royong.',
        clueLain: ['Cara warga membersihkan atap secara bersama-sama.'],
        startRow: 2,
        startCol: 3,
      },
      {
        id: 'c2',
        number: 4,
        direction: 'down',
        answer: 'SANITASI',
        clue: 'Sistem kebersihan di penampungan yang wajib dijaga agar penyakit tidak menyebar.',
        clueLain: ['Di penampungan, air bersih dan pembuangan sampah harus dijaga agar wabah tidak muncul.'],
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
        id: 'c3',
        number: 1,
        direction: 'down',
        answer: 'WEDHUS',
        clue: 'Kata Jawa di depan "gembel", nama lain awan panas guguran.',
        clueLain: ['Sebutan Jawa untuk awan panas guguran: ... gembel.'],
        startRow: 0,
        startCol: 4,
      },
      {
        id: 'c2',
        number: 2,
        direction: 'down',
        answer: 'SILIKA',
        clue: 'Senyawa dalam abu vulkanik yang tajam dan dapat melukai paru-paru.',
        clueLain: ['Bahan dalam abu vulkanik yang berbentuk pecahan kaca mikroskopis.'],
        startRow: 0,
        startCol: 5,
      },
      {
        id: 'c4',
        number: 3,
        direction: 'down',
        answer: 'LEMBAH',
        clue: 'Bentuk bentang alam yang dilalui awan panas guguran saat meluncur turun.',
        clueLain: ['Awan panas guguran meluncur deras menyusuri ... sungai.'],
        startRow: 2,
        startCol: 1,
      },
      {
        id: 'c1',
        number: 4,
        direction: 'across',
        answer: 'AMBRUK',
        clue: 'Risiko pada atap rumah karena beban abu yang sangat berat, terutama saat basah.',
        clueLain: ['Yang terjadi pada atap rumah bila timbunan abu tidak dibersihkan.'],
        startRow: 4,
        startCol: 0,
      },
    ],
  },
  {
    rows: 5,
    cols: 7,
    clues: [
      {
        id: 'c3',
        number: 1,
        direction: 'down',
        answer: 'PARU',
        clue: 'Organ tubuh yang rusak bila menghirup abu vulkanik tanpa pelindung.',
        clueLain: ['Bagian tubuh yang paling terancam oleh pecahan kaca mikroskopis dalam abu.'],
        startRow: 0,
        startCol: 3,
      },
      {
        id: 'c1',
        number: 2,
        direction: 'across',
        answer: 'TAJAM',
        clue: 'Sifat butiran abu vulkanik yang dapat melukai kornea mata.',
        clueLain: ['Sifat pecahan kaca mikroskopis di dalam abu vulkanik.'],
        startRow: 1,
        startCol: 2,
      },
      {
        id: 'c2',
        number: 3,
        direction: 'down',
        answer: 'ATAP',
        clue: 'Bagian teratas rumah yang wajib dibersihkan dari timbunan abu agar tidak ambruk.',
        clueLain: ['Bagian rumah yang paling menanggung beban timbunan abu vulkanik.'],
        startRow: 1,
        startCol: 5,
      },
      {
        id: 'c4',
        number: 4,
        direction: 'across',
        answer: 'DEBU',
        clue: 'Endapan vulkanik halus yang menumpuk tebal di atap rumah.',
        clueLain: ['Butiran sangat halus dari letusan yang mengendap di atap dan jalan.'],
        startRow: 3,
        startCol: 0,
      },
    ],
  },
];

const VARIAN_AREA_4: GridTTS[] = [
  {
    rows: 10,
    cols: 9,
    clues: [
      {
        id: 'c3',
        number: 1,
        direction: 'down',
        answer: 'MUNTAHAN',
        clue: 'Material yang disemburkan gunung ke luar saat erupsi memuncak.',
        clueLain: ['Yang keluar dari kawah ketika letusan mencapai puncaknya.'],
        startRow: 0,
        startCol: 2,
      },
      {
        id: 'c1',
        number: 2,
        direction: 'across',
        answer: 'KENDARAAN',
        clue: 'Alat angkut yang dipakai warga untuk keluar dari zona KRB III.',
        clueLain: ['Saat status AWAS, warga meninggalkan zona KRB III menggunakan ...'],
        startRow: 2,
        startCol: 0,
      },
      {
        id: 'c4',
        number: 3,
        direction: 'down',
        answer: 'KACAMATA',
        clue: 'Pelindung mata dari abu vulkanik, dipakai bersama masker.',
        clueLain: ['Alat yang menutup kedua mata agar abu vulkanik tidak melukai kornea.'],
        startRow: 2,
        startCol: 0,
      },
      {
        id: 'c2',
        number: 4,
        direction: 'down',
        answer: 'EVAKUASI',
        clue: 'Saat status AWAS, segera tinggalkan zona KRB III menuju tempat aman.',
        clueLain: ['Tindakan meninggalkan kawasan berbahaya ke tempat aman ketika status AWAS.'],
        startRow: 2,
        startCol: 1,
      },
    ],
  },
  {
    rows: 7,
    cols: 6,
    clues: [
      {
        id: 'c3',
        number: 1,
        direction: 'down',
        answer: 'MASKER',
        clue: 'Alat yang menutup hidung dan mulut untuk menyaring abu vulkanik.',
        clueLain: ['Pelindung pernapasan yang wajib dikenakan saat status SIAGA.'],
        startRow: 0,
        startCol: 4,
      },
      {
        id: 'c2',
        number: 2,
        direction: 'down',
        answer: 'TREMOR',
        clue: 'Getaran halus dari dalam gunung yang mendahului erupsi.',
        clueLain: ['Gempa kecil terus-menerus yang menjadi tanda awal gunung akan meletus.'],
        startRow: 1,
        startCol: 1,
      },
      {
        id: 'c4',
        number: 3,
        direction: 'down',
        answer: 'TUTUP',
        clue: 'Tindakan pada jendela dan pintu agar abu tidak masuk ke rumah.',
        clueLain: ['Yang dilakukan pada jendela agar abu vulkanik tidak masuk.'],
        startRow: 1,
        startCol: 2,
      },
      {
        id: 'c1',
        number: 4,
        direction: 'across',
        answer: 'ERUPSI',
        clue: 'Peristiwa keluarnya magma dan gas dari gunung ke permukaan.',
        clueLain: ['Peristiwa letusan gunung api yang mengeluarkan magma dan abu.'],
        startRow: 2,
        startCol: 0,
      },
    ],
  },
  {
    rows: 5,
    cols: 7,
    clues: [
      {
        id: 'c2',
        number: 1,
        direction: 'down',
        answer: 'PANIK',
        clue: 'Kondisi gelisah hewan liar yang menjadi tanda awal erupsi.',
        clueLain: ['Keadaan berlarian binatang di lereng gunung sebelum letusan.'],
        startRow: 0,
        startCol: 1,
      },
      {
        id: 'c1',
        number: 2,
        direction: 'across',
        answer: 'SATWA',
        clue: 'Hewan liar di lereng gunung yang gelisah dan turun ke desa sebelum letusan.',
        clueLain: ['Binatang yang panik dan turun gunung menjelang erupsi.'],
        startRow: 1,
        startCol: 0,
      },
      {
        id: 'c3',
        number: 3,
        direction: 'down',
        answer: 'ASAP',
        clue: 'Tanda awal erupsi: keluar ... putih dari puncak gunung.',
        clueLain: ['Yang mengepul dari kawah; putih saat WASPADA, kelabu pekat saat SIAGA.'],
        startRow: 1,
        startCol: 4,
      },
      {
        id: 'c4',
        number: 4,
        direction: 'across',
        answer: 'LAYU',
        clue: 'Keadaan tumbuhan akibat panas tanah sebelum gunung meletus.',
        clueLain: ['Yang terjadi pada tanaman karena tanah menjadi panas menjelang letusan.'],
        startRow: 3,
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
