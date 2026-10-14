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
      startRow: 1,
      startCol: 1,
      },
      {
      id: 'c2',
      number: 2,
      direction: 'down',
      answer: 'EVAKUASI',
      clue: 'Penyelamatan diri dengan berjalan tertib lewat tangga darurat menuju titik kumpul di lapangan sekolah.',
      startRow: 1,
      startCol: 2,
      },
      {
      id: 'c3',
      number: 3,
      direction: 'down',
      answer: 'GEMPA',
      clue: 'Peristiwa getaran atau guncangan tanah mendadak yang kita simulasikan cara penyelamatannya di kelas.',
      startRow: 1,
      startCol: 10,
      },
      {
      id: 'c4',
      number: 4,
      direction: 'across',
      answer: 'SIAGA',
      clue: 'Tas darurat 72 jam yang diajarkan Bu Rahma berisi makanan, air, dan obat disebut Tas ... Bencana.',
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
        startRow: 0,
        startCol: 0,
      },
      {
        id: 'c2',
        number: 2,
        direction: 'down',
        answer: 'RINGAN',
        clue: 'Sebutan untuk gempa berkekuatan kecil, yang getarannya hanya dirasakan sebagian orang.',
        startRow: 0,
        startCol: 2,
      },
      {
        id: 'c3',
        number: 3,
        direction: 'across',
        answer: 'RENCANA',
        clue: 'Susunan langkah yang disiapkan jauh sebelum bencana terjadi, misalnya ... evakuasi sekolah.',
        startRow: 2,
        startCol: 0,
      },
      {
        id: 'c4',
        number: 4,
        direction: 'down',
        answer: 'UPAYA',
        clue: 'Ikhtiar yang dilakukan manusia untuk mengurangi risiko bencana, misalnya latihan evakuasi rutin.',
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
        startRow: 0,
        startCol: 5,
      },
      {
        id: 'c3',
        number: 2,
        direction: 'down',
        answer: 'LATIHAN',
        clue: 'Kegiatan mengulang prosedur evakuasi agar menjadi kebiasaan saat panik.',
        startRow: 0,
        startCol: 7,
      },
      {
        id: 'c1',
        number: 3,
        direction: 'across',
        answer: 'PERSIAPAN',
        clue: 'Segala usaha yang dilakukan SEBELUM bencana terjadi agar risiko berkurang.',
        startRow: 1,
        startCol: 0,
      },
      {
        id: 'c4',
        number: 4,
        direction: 'down',
        answer: 'PETUGAS',
        clue: 'Orang yang bertugas menertibkan warga saat evakuasi berlangsung.',
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
        startRow: 0,
        startCol: 2,
      },
      {
        id: 'c2',
        number: 2,
        direction: 'down',
        answer: 'BERTAHAN',
        clue: 'Tetap berada di tempat berlindung sampai getaran benar-benar berhenti.',
        startRow: 3,
        startCol: 1,
      },
      {
        id: 'c1',
        number: 3,
        direction: 'across',
        answer: 'MENUNDUK',
        clue: 'Menurunkan kepala mendekati lantai supaya tidak terkena benda yang jatuh.',
        startRow: 4,
        startCol: 0,
      },
      {
        id: 'c4',
        number: 4,
        direction: 'down',
        answer: 'MENJAUH',
        clue: 'Tindakan menjauh dari jendela kaca karena pecahannya dapat melukai.',
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
        startRow: 0,
        startCol: 0,
      },
      {
        id: 'c2',
        number: 2,
        direction: 'down',
        answer: 'GETARAN',
        clue: 'Yang dirasakan saat gempa berlangsung, tanda harus segera berlindung.',
        startRow: 0,
        startCol: 3,
      },
      {
        id: 'c3',
        number: 3,
        direction: 'down',
        answer: 'JENDELA',
        clue: 'Bagian dinding yang harus dijauhi saat gempa karena mudah pecah.',
        startRow: 1,
        startCol: 5,
      },
      {
        id: 'c1',
        number: 4,
        direction: 'across',
        answer: 'KORIDOR',
        clue: 'Lorong penghubung antarkelas yang harus dijaga kosong saat gempa.',
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
        startRow: 0,
        startCol: 1,
      },
      {
        id: 'c1',
        number: 2,
        direction: 'across',
        answer: 'TERTIB',
        clue: 'Sikap berbaris rapi tanpa saling mendorong ketika menuju titik kumpul.',
        startRow: 1,
        startCol: 0,
      },
      {
        id: 'c2',
        number: 3,
        direction: 'down',
        answer: 'TANGAN',
        clue: 'Bagian tubuh yang dipakai melindungi kepala ketika merunduk.',
        startRow: 1,
        startCol: 0,
      },
      {
        id: 'c3',
        number: 4,
        direction: 'down',
        answer: 'BANGKU',
        clue: 'Perabot kelas yang dapat dipakai berlindung bila mejanya tidak muat.',
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
      startRow: 1,
      startCol: 1,
      },
      {
      id: 'c2',
      number: 2,
      direction: 'down',
      answer: 'LAPANGAN',
      clue: 'Area terbuka luas yang paling aman dijadikan titik kumpul warga sekolah karena terbebas dari bahaya reruntuhan bangunan.',
      startRow: 1,
      startCol: 5,
      },
      {
      id: 'c3',
      number: 3,
      direction: 'across',
      answer: 'BMKG',
      clue: 'Lembaga resmi pemerintah yang berwenang menyiarkan informasi gempa bumi dan peringatan dini tsunami di Indonesia.',
      startRow: 6,
      startCol: 2,
      },
      {
      id: 'c4',
      number: 4,
      direction: 'down',
      answer: 'MEDIS',
      clue: 'Bantuan pertolongan pertama (P3K) dan perawatan kesehatan yang diberikan kepada korban luka atau syok di posko darurat.',
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
        startRow: 0,
        startCol: 7,
      },
      {
        id: 'c2',
        number: 2,
        direction: 'down',
        answer: 'BERKUMPUL',
        clue: 'Berkumpul di lapangan sesudah getaran berhenti agar mudah diperiksa.',
        startRow: 1,
        startCol: 1,
      },
      {
        id: 'c1',
        number: 3,
        direction: 'across',
        answer: 'RERUNTUHAN',
        clue: 'Puing bangunan yang menutup jalur evakuasi setelah gempa besar.',
        startRow: 2,
        startCol: 0,
      },
      {
        id: 'c4',
        number: 4,
        direction: 'down',
        answer: 'AMBULANS',
        clue: 'Kendaraan pengangkut korban luka menuju rumah sakit terdekat.',
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
        startRow: 0,
        startCol: 3,
      },
      {
        id: 'c4',
        number: 2,
        direction: 'down',
        answer: 'POSKO',
        clue: 'Tempat penanganan darurat yang didirikan di lapangan evakuasi.',
        startRow: 2,
        startCol: 0,
      },
      {
        id: 'c2',
        number: 3,
        direction: 'down',
        answer: 'PETUGAS',
        clue: 'Orang berkompeten yang dipanggil untuk menangani korban cedera.',
        startRow: 3,
        startCol: 1,
      },
      {
        id: 'c1',
        number: 4,
        direction: 'across',
        answer: 'SELAMAT',
        clue: 'Kondisi warga yang berhasil keluar dari bangunan tanpa cedera.',
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
      startRow: 1,
      startCol: 1,
      },
      {
      id: 'c2',
      number: 2,
      direction: 'down',
      answer: 'MASKER',
      clue: 'Alat pelindung pernapasan wajib disiapkan untuk menyaring partikel abu silika tajam agar tidak merusak paru-paru.',
      startRow: 1,
      startCol: 1,
      },
      {
      id: 'c3',
      number: 3,
      direction: 'down',
      answer: 'AWAS',
      clue: 'Tingkat status aktivitas gunung api tertinggi (Level IV) yang menandakan letusan utama berpeluang besar segera terjadi.',
      startRow: 1,
      startCol: 5,
      },
      {
      id: 'c4',
      number: 4,
      direction: 'across',
      answer: 'SIAGA',
      clue: 'Tingkat status gunung api Level III yang menunjukkan peningkatan aktivitas seismik secara nyata dan letusan dapat segera menyusul.',
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
        startRow: 0,
        startCol: 1,
      },
      {
        id: 'c3',
        number: 2,
        direction: 'down',
        answer: 'WASPADA',
        clue: 'Tingkat status gunung api satu langkah di atas Normal.',
        startRow: 0,
        startCol: 8,
      },
      {
        id: 'c1',
        number: 3,
        direction: 'across',
        answer: 'SEISMOGRAF',
        clue: 'Alat perekam getaran magma di pos pengamatan gunung api.',
        startRow: 1,
        startCol: 0,
      },
      {
        id: 'c4',
        number: 4,
        direction: 'down',
        answer: 'STATUS',
        clue: 'Tingkat kondisi gunung api, dari Normal sampai Awas.',
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
        startRow: 0,
        startCol: 1,
      },
      {
        id: 'c4',
        number: 2,
        direction: 'down',
        answer: 'GAS',
        clue: 'Zat yang komposisinya dipantau untuk menilai kesiapan gunung meletus.',
        startRow: 0,
        startCol: 4,
      },
      {
        id: 'c1',
        number: 3,
        direction: 'across',
        answer: 'PANTAU',
        clue: 'Kegiatan mengamati gunung api terus-menerus dari pos pengamatan.',
        startRow: 1,
        startCol: 0,
      },
      {
        id: 'c2',
        number: 4,
        direction: 'down',
        answer: 'PVMBG',
        clue: 'Lembaga pemerintah yang memantau aktivitas gunung api di Indonesia.',
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
      startRow: 1,
      startCol: 1,
      },
      {
      id: 'c2',
      number: 2,
      direction: 'down',
      answer: 'ATAP',
      clue: 'Bagian bangunan rumah yang wajib dibersihkan dari timbunan abu vulkanik tebal secara gotong royong agar tidak ambruk akibat beban berat.',
      startRow: 1,
      startCol: 2,
      },
      {
      id: 'c3',
      number: 3,
      direction: 'across',
      answer: 'PAPAN',
      // Catatan: harus 5 huruf berpola _A_A_ agar huruf silang dengan ATAP (kolom 2) dan AMAN (kolom 4) tetap cocok.
      clue: 'Papan panjang beralas kain yang dipakai petugas untuk mengusung korban luka ke posko medis (tandu darurat).',
      startRow: 3,
      startCol: 1,
      },
      {
      id: 'c4',
      number: 4,
      direction: 'down',
      answer: 'AMAN',
      clue: 'Kondisi keselamatan warga di barak pengungsian Zona KRB I yang terbebas dari ancaman awan panas dan guguran lava.',
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
        startRow: 0,
        startCol: 2,
      },
      {
        id: 'c3',
        number: 2,
        direction: 'down',
        answer: 'LOGISTIK',
        clue: 'Pasokan kebutuhan pokok bagi para pengungsi di barak.',
        startRow: 0,
        startCol: 3,
      },
      {
        id: 'c1',
        number: 3,
        direction: 'across',
        answer: 'PENGUNGSI',
        clue: 'Warga yang meninggalkan rumah dan tinggal di tempat penampungan.',
        startRow: 2,
        startCol: 0,
      },
      {
        id: 'c2',
        number: 4,
        direction: 'down',
        answer: 'SANITASI',
        clue: 'Sistem kebersihan yang wajib dijaga agar penyakit tidak menyebar.',
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
        startRow: 0,
        startCol: 4,
      },
      {
        id: 'c2',
        number: 2,
        direction: 'down',
        answer: 'TRAUMA',
        clue: 'Gangguan jiwa akibat bencana yang memerlukan dukungan psikologis.',
        startRow: 1,
        startCol: 1,
      },
      {
        id: 'c3',
        number: 3,
        direction: 'down',
        answer: 'TANDON',
        clue: 'Tempat penampungan air bersih yang harus dijaga kebersihannya.',
        startRow: 2,
        startCol: 5,
      },
      {
        id: 'c1',
        number: 4,
        direction: 'across',
        answer: 'LANSIA',
        clue: 'Kelompok lanjut usia yang perlu didahulukan menerima bantuan.',
        startRow: 3,
        startCol: 0,
      },
    ],
  },
  // TAMBAH_VARIAN_5
];

export const BANK_TTS: Record<number, GridTTS[]> = {
  0: VARIAN_AREA_0,
  1: VARIAN_AREA_1,
  2: VARIAN_AREA_2,
  3: VARIAN_AREA_3,
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
