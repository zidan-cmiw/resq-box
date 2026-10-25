/**
 * KOMPETENSI LEVEL 3 — RESQ-BOX
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * DARI MANA DAFTAR INI BERASAL
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  Diturunkan dari tujuan pembelajaran pada RPP dan LKPD:
 *    1. Memahami dan menganalisis hubungan struktur bumi dengan fenomena
 *       bencana geologis serta upaya mitigasi yang dilakukan.
 *    2. Mengimplementasi dan menciptakan langkah mitigasi beserta jalur
 *       evakuasi secara tepat berdasarkan situasi bencana geologis.
 *    3. Mengoperasikan RESQ-BOX Web dan RESQ-BOX Board sebagai media
 *       dalam pembelajaran.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * MENGAPA BERURUTAN, BUKAN SILANG
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  Versi pertama pemetaan membuat satu kompetensi muncul di beberapa misi.
 *  Hasilnya sulit dijelaskan kepada siswa dan sulit dilacak guru: kalau siswa
 *  gagal di misi 3, tidak jelas kompetensi mana yang belum tuntas.
 *
 *  Versi ini membagi kompetensi menjadi BLOK BERURUTAN — satu blok untuk satu
 *  misi, tanpa tumpang tindih:
 *
 *      Misi 1 -> K1-K2
 *      Misi 2 -> K3-K4
 *      Misi 3 -> K5-K7
 *      Misi 4 -> K8-K10
 *      Misi 5 -> K11-K13
 *
 *  Konsekuensi yang diterima dengan sadar: sebuah kompetensi yang sebenarnya
 *  dipakai di banyak misi hanya DICATAT di satu misi. Contohnya "mengoperasikan
 *  RESQ-BOX" dipakai di kelima misi tetapi dinilai di misi 2.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * URUTAN MISI WEB BUKAN URUTAN LKPD
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  Lima misi web adalah PEMANASAN, dan sengaja memakai studi kasus yang
 *  BERBEDA dari lima studi kasus LKPD. Web melatih komponen satu per satu;
 *  LKPD meminta siswa merangkai seluruhnya dalam kerja kelompok.
 *
 *  Karena itu tidak semua blok LKPD harus dilatih di web. Blok yang hanya
 *  muncul di LKPD, misalnya Selain Itu dan evakuasi ke zona KRB, memang
 *  dipelajari langsung saat mengerjakan LKPD dengan panduan langkahnya.
 */

/** Kelompok kompetensi, mengikuti pembagian pada tujuan pembelajaran. */
export type AspekKompetensi = 'kebumian' | 'mitigasi' | 'teknologi' | 'komputasional';

export interface Kompetensi {
  /** Kode singkat, dipakai di popup misi dan rubrik. */
  kode: string;
  /** Rumusan kompetensi, dimulai dengan kata kerja terukur. */
  nama: string;
  aspek: AspekKompetensi;
  /** Indikator unjuk kerja — yang benar-benar dapat diamati guru. */
  indikator: string[];
}

export const LABEL_ASPEK: Record<AspekKompetensi, string> = {
  kebumian: 'Kebumian dan fenomena geologi',
  mitigasi: 'Mitigasi dan kesiapsiagaan',
  teknologi: 'Teknologi dan pengukuran',
  komputasional: 'Berpikir komputasional',
};

/**
 * Tiga belas kompetensi Level 3, berurutan sesuai urutan misi.
 *
 * Jangan menyisipkan kompetensi baru di tengah tanpa memperbarui
 * `PETA_MISI` — urutan ini dipakai untuk menampilkan blok kompetensi
 * pada popup misi.
 */
export const KOMPETENSI_LEVEL3: Kompetensi[] = [
  {
    kode: 'K1',
    nama: 'Menafsirkan status bahaya dan warna indikator',
    aspek: 'kebumian',
    indikator: [
      'Menyebutkan urutan status: Normal, Waspada, Siaga, dan Awas.',
      'Menghubungkan tiap status dengan warna lampu yang sesuai.',
      'Menjelaskan bahwa penetapan status dilakukan lembaga berwenang, bukan oleh sistem buatan sendiri.',
    ],
  },
  {
    kode: 'K2',
    nama: 'Menjelaskan alur sistem peringatan dini dari kondisi menuju tindakan',
    aspek: 'teknologi',
    indikator: [
      'Menyebutkan urutan alur: kondisi terdeteksi, diolah, lalu indikator menyala.',
      'Menunjukkan bagian mana yang berperan sebagai masukan, pengolah, dan keluaran.',
      'Menjelaskan akibat yang terjadi bila salah satu bagian alur tidak bekerja.',
    ],
  },
  {
    kode: 'K3',
    nama: 'Menyusun pesan peringatan yang sesuai kondisi bahaya',
    aspek: 'teknologi',
    indikator: [
      'Pesan menyebut jenis bahaya yang sedang terjadi.',
      'Pesan menyebut tindakan yang harus segera dilakukan warga.',
      'Pesan cukup singkat sehingga dapat dibaca dalam keadaan panik.',
    ],
  },
  {
    kode: 'K4',
    nama: 'Mengoperasikan RESQ-BOX Web dan RESQ-BOX Board',
    aspek: 'teknologi',
    indikator: [
      'Membuka area kerja Level 3 dan memilih misi yang dituju.',
      'Menyusun blok lalu menjalankan simulasi tanpa dibantu penuh.',
      'Menghubungkan Board dan menjalankan sistem pada diorama.',
    ],
  },
  {
    kode: 'K5',
    nama: 'Membedakan karakteristik erupsi efusif dan eksplosif',
    aspek: 'kebumian',
    indikator: [
      'Menyebutkan ciri erupsi efusif berupa lelehan lava yang mengalir.',
      'Menyebutkan ciri erupsi eksplosif berupa lontaran material dan awan panas.',
      'Memilih tindakan mitigasi yang berbeda untuk kedua jenis erupsi.',
    ],
  },
  {
    kode: 'K6',
    nama: 'Mengidentifikasi bahaya ikutan erupsi',
    aspek: 'kebumian',
    indikator: [
      'Menyebutkan bahaya ikutan: awan panas, lahar, dan abu vulkanik.',
      'Menjelaskan arah dan penyebab terjadinya masing-masing bahaya.',
      'Menentukan bentuk perlindungan yang sesuai untuk tiap bahaya.',
    ],
  },
  {
    kode: 'K7',
    nama: 'Menafsirkan status gunung api dan zona KRB',
    aspek: 'mitigasi',
    indikator: [
      'Menyebutkan arti KRB I, KRB II, dan KRB III.',
      'Menghubungkan kenaikan status dengan meluasnya radius bahaya.',
      'Menentukan zona evakuasi yang tepat sesuai status yang berlaku.',
    ],
  },
  {
    kode: 'K8',
    nama: 'Menghubungkan pergerakan lempeng dengan terjadinya gempa bumi',
    aspek: 'kebumian',
    indikator: [
      'Menyebutkan jenis batas lempeng: divergen, konvergen, dan transform.',
      'Menjelaskan gempa terjadi ketika batuan tidak lagi kuat menahan tegangan.',
      'Mengaitkan posisi Indonesia pada pertemuan lempeng dengan seringnya gempa.',
    ],
  },
  {
    kode: 'K9',
    nama: 'Menjelaskan hubungan kekuatan guncangan dengan tingkat kerusakan',
    aspek: 'kebumian',
    indikator: [
      'Menyatakan bahwa guncangan lebih besar berpotensi menimbulkan kerusakan lebih luas.',
      'Menjelaskan kerusakan juga dipengaruhi kedalaman sumber dan jarak dari pusat gempa.',
      'Menghubungkan tingkat kerusakan dengan tindakan mitigasi yang dipilih.',
    ],
  },
  {
    kode: 'K10',
    nama: 'Menetapkan ambang batas kondisi dan logika percabangan',
    aspek: 'komputasional',
    indikator: [
      'Membedakan gempa sedang dan gempa besar berdasarkan angka yang diberikan.',
      'Menempatkan kondisi pada blok Kalau–Maka, bukan di luar keputusan.',
      'Memastikan hanya satu cabang yang berjalan untuk satu kondisi.',
    ],
  },
  {
    kode: 'K11',
    nama: 'Menentukan tindakan mitigasi sesuai tingkat bahaya',
    aspek: 'mitigasi',
    indikator: [
      'Memilih kombinasi lampu, sirine, dan pesan yang sepadan dengan tingkat bahaya.',
      'Tidak memakai tindakan berlebihan untuk bahaya yang masih rendah.',
      'Menjelaskan alasan pemilihan tindakan tersebut.',
    ],
  },
  {
    kode: 'K12',
    nama: 'Merancang jalur evakuasi menuju zona aman',
    aspek: 'mitigasi',
    indikator: [
      'Menentukan arah evakuasi yang menjauh dari sumber bahaya.',
      'Mempertimbangkan letak titik kumpul dalam menentukan arah.',
      'Memastikan jalur yang dipilih tidak melewati area berbahaya.',
    ],
  },
  {
    kode: 'K13',
    nama: 'Menguji dan memperbaiki sistem yang belum bekerja',
    aspek: 'komputasional',
    indikator: [
      'Menjalankan simulasi dan mencatat hasil apa adanya.',
      'Menemukan bagian yang salah berdasarkan gejala yang muncul.',
      'Memperbaiki bagian tersebut lalu menguji ulang untuk membandingkan hasil.',
    ],
  },
];

/** Nomor misi web yang memakai tiap blok kompetensi. */
export const PETA_MISI: Record<number, string[]> = {
  1: ['K1', 'K2'],
  2: ['K3', 'K4'],
  3: ['K5', 'K6', 'K7'],
  4: ['K8', 'K9', 'K10'],
  5: ['K11', 'K12', 'K13'],
};

/** Ambil seluruh kompetensi yang dicapai pada satu misi. */
export function kompetensiMisi(nomorMisi: number): Kompetensi[] {
  const kode = PETA_MISI[nomorMisi] ?? [];
  return KOMPETENSI_LEVEL3.filter((k) => kode.includes(k.kode));
}

/** Kalimat pembuka popup misi. */
export function kalimatKompetensi(nomorMisi: number): string {
  const daftar = PETA_MISI[nomorMisi] ?? [];
  if (daftar.length === 0) return 'Setelah menyelesaikan misi ini, kalian diharapkan mampu menerapkan langkah mitigasi.';
  if (daftar.length === 1) {
    return `Setelah menyelesaikan misi ini, kalian diharapkan mampu melakukan kompetensi ${daftar[0]}.`;
  }
  const akhir = daftar[daftar.length - 1];
  const awal = daftar.slice(0, -1).join(', ');
  return `Setelah menyelesaikan misi ini, kalian diharapkan mampu melakukan kompetensi ${awal}, dan ${akhir}.`;
}
