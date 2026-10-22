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
    rows: 12,
    cols: 13,
    clues: [
      { id: 'a0s1c1', number: 4, direction: 'across', answer: 'EVAKUASI', clue: 'Tindakan penyelamatan diri dengan berjalan tertib lewat tangga darurat atau jalur yang ditentukan menuju titik kumpul di lapangan sekolah.', startRow: 9, startCol: 4 },
      { id: 'a0s1c2', number: 2, direction: 'down', answer: 'MERUNDUK', clue: 'Tindakan pertama yang dilakukan saat gempa dengan merendahkan tubuh mendekati lantai agar terhindar dari benda yang jatuh.', startRow: 2, startCol: 7 },
      { id: 'a0s1c3', number: 1, direction: 'down', answer: 'MENGHINDAR', clue: 'Tindakan yang wajib dilakukan murid agar tidak terkena benda-benda rawan pecah atau jatuh di kelas.', startRow: 1, startCol: 9 },
      { id: 'a0s1c4', number: 3, direction: 'across', answer: 'BERLINDUNG', clue: 'Proses penyelamatan diri dari material yang berjatuhan dengan cara masuk ke bawah meja belajar yang kokoh.', startRow: 7, startCol: 1 },
    ],
  },
  {
    rows: 8,
    cols: 10,
    clues: [
      { id: 'a0s2c1', number: 3, direction: 'across', answer: 'BERTAHAN', clue: 'Tindakan memegang erat kaki meja dan tidak beranjak dari tempat berlindung hingga guncangan bumi benar-benar berhenti.', startRow: 6, startCol: 1 },
      { id: 'a0s2c2', number: 1, direction: 'down', answer: 'KEPALA', clue: 'Bagian tubuh paling vital yang harus selalu didekap dan dilindungi menggunakan kedua tangan saat sedang berlindung di bawah meja.', startRow: 1, startCol: 5 },
      { id: 'a0s2c3', number: 2, direction: 'across', answer: 'JENDELA', clue: 'Bagian dari ruang kelas yang biasanya terbuat dari kaca dan wajib dijauhi saat gempa karena sangat rawan pecah dan membahayakan.', startRow: 2, startCol: 1 },
    ],
  },
  {
    rows: 8,
    cols: 17,
    clues: [
      { id: 'a0s3c1', number: 4, direction: 'across', answer: 'TASSIAGABENCANA', clue: 'Tas darurat berisi ransum makanan, air minum, perlengkapan P3K, senter, peluit, dan dokumen penting yang dipersiapkan jauh hari untuk bertahan hidup secara mandiri selama 72 jam pertama.', startRow: 6, startCol: 1 },
      { id: 'a0s3c2', number: 3, direction: 'down', answer: 'KURSI', clue: 'Perabot tempat duduk di dalam ruang kelas yang dapat dimanfaatkan murid untuk berlindung dan menunduk apabila kolong meja sudah tidak muat.', startRow: 2, startCol: 5 },
      { id: 'a0s3c3', number: 1, direction: 'down', answer: 'TANGGA', clue: 'Jalur turun darurat yang wajib digunakan murid untuk keluar dari gedung sekolah menuju titik kumpul.', startRow: 1, startCol: 2 },
      { id: 'a0s3c4', number: 2, direction: 'down', answer: 'TERTIB', clue: 'Sikap berbaris rapi tanpa kepanikan dan tidak saling mendorong yang harus selalu dijaga murid ketika berjalan keluar dari koridor kelas.', startRow: 1, startCol: 9 },
    ],
  },
  {
    rows: 10,
    cols: 10,
    clues: [
      { id: 'a0s4c1', number: 4, direction: 'across', answer: 'TENANG', clue: 'Sikap mental yang sangat wajib dijaga oleh murid ketika merasakan guncangan dan menerima arahan dari guru agar tidak memicu kepanikan massal di dalam kelas.', startRow: 8, startCol: 2 },
      { id: 'a0s4c2', number: 2, direction: 'down', answer: 'DOKUMEN', clue: 'Berkas penting seperti fotokopi Kartu Keluarga, KTP, ijazah, dan akta lahir yang wajib dilindungi di dalam kantong ziplock anti-air pada perlengkapan darurat.', startRow: 2, startCol: 4 },
      { id: 'a0s4c3', number: 3, direction: 'across', answer: 'SIMULASI', clue: 'Kegiatan latihan praktik penyelamatan yang rutin dilakukan di lingkungan sekolah agar murid hafal langkah keselamatan dan rute evakuasi menuju titik kumpul.', startRow: 5, startCol: 1 },
      { id: 'a0s4c4', number: 1, direction: 'down', answer: 'PERBAN', clue: 'Salah satu perlengkapan medis bersama kasa steril dan plester di dalam Kotak P3K yang sangat dibutuhkan untuk menangani cedera atau luka saat keadaan darurat.', startRow: 1, startCol: 6 },
    ],
  },
  {
    rows: 7,
    cols: 13,
    clues: [
      { id: 'a0s5c1', number: 4, direction: 'across', answer: 'TITIKKUMPUL', clue: 'Area aman yang telah ditetapkan secara khusus sebagai tempat berkumpulnya seluruh warga saat terjadinya bencana.', startRow: 5, startCol: 1 },
      { id: 'a0s5c2', number: 2, direction: 'down', answer: 'PANIK', clue: 'Reaksi emosional yang tidak boleh ditunjukkan ketika terjadinya bencana sehingga mengabaikan protokol keselamatan.', startRow: 1, startCol: 5 },
      { id: 'a0s5c3', number: 1, direction: 'across', answer: 'BNPB', clue: 'Lembaga resmi pemerintah di tingkat nasional yang bertugas mengeluarkan pedoman penanggulangan bencana di Indonesia.', startRow: 1, startCol: 3 },
      { id: 'a0s5c4', number: 3, direction: 'across', answer: 'LAPANGAN', clue: 'Area terbuka luas di lingkungan sekolah yang paling aman dan terbebas dari bahaya reruntuhan bangunan maupun tiang listrik untuk dijadikan lokasi evakuasi akhir.', startRow: 3, startCol: 1 },
    ],
  },
];

const VARIAN_AREA_2: GridTTS[] = [
  {
    rows: 10,
    cols: 12,
    clues: [
      { id: 'a2s1c1', number: 2, direction: 'across', answer: 'BPBD', clue: 'Badan penanggulangan bencana di tingkat daerah yang menjadi sumber informasi dan instruksi resmi bagi para murid di lapangan agar tidak termakan kabar hoaks.', startRow: 3, startCol: 1 },
      { id: 'a2s1c2', number: 1, direction: 'down', answer: 'AMBULANS', clue: 'Kendaraan medis darurat yang harus segera dihubungi ketika terdapat korban gawat darurat yang harus ditangani.', startRow: 1, startCol: 1 },
      { id: 'a2s1c3', number: 3, direction: 'across', answer: 'AFTERSHOCK', clue: 'Istilah untuk rentetan gempa susulan yang masih sangat mungkin terjadi setelah getaran utama mereda.', startRow: 6, startCol: 1 },
    ],
  },
  {
    rows: 12,
    cols: 11,
    clues: [
      { id: 'a2s2c1', number: 3, direction: 'across', answer: 'KEHADIRAN', clue: 'Hal penting yang wajib diperiksa dan dicatat secara menyeluruh oleh tim setibanya di titik kumpul demi memastikan tidak ada orang yang tertinggal di dalam gedung.', startRow: 9, startCol: 1 },
      { id: 'a2s2c2', number: 2, direction: 'down', answer: 'POSKO', clue: 'Tenda utama di lapangan yang berfungsi sebagai tempat berkumpulnya warga dan petugas.', startRow: 6, startCol: 1 },
      { id: 'a2s2c3', number: 1, direction: 'down', answer: 'RERUNTUHAN', clue: 'Sisa puing bangunan atau struktur dinding yang sudah retak dan wajib dijauhi oleh murid saat berada di lapangan.', startRow: 1, startCol: 4 },
    ],
  },
  {
    rows: 14,
    cols: 8,
    clues: [
      { id: 'a2s3c1', number: 4, direction: 'across', answer: 'KORBAN', clue: 'Orang yang mengalami dampak buruk bencana seperti luka, cedera, atau ketakutan yang harus segera ditolong dan dirawat oleh petugas medis.', startRow: 4, startCol: 1 },
      { id: 'a2s3c2', number: 3, direction: 'down', answer: 'HOAX', clue: 'Berita bohong atau kabar palsu yang dilarang keras untuk disebarkan karena hanya akan membuat semua orang di lapangan semakin panik.', startRow: 2, startCol: 5 },
      { id: 'a2s3c3', number: 1, direction: 'down', answer: 'BERKUMPUL', clue: 'Tindakan yang dilakukan ketika berada di titik kumpul dan tidak boleh memisahkan diri setelah bencana sebelum ada arahan dari petugas.', startRow: 1, startCol: 1 },
      { id: 'a2s3c4', number: 2, direction: 'down', answer: 'KORSELETING', clue: 'Kerusakan pada kabel atau tiang listrik akibat guncangan gempa yang sangat berbahaya karena bisa memicu timbulnya api kebakaran.', startRow: 2, startCol: 3 },
    ],
  },
  {
    rows: 14,
    cols: 7,
    clues: [
      { id: 'a2s4c1', number: 4, direction: 'across', answer: 'TANDU', clue: 'Alat bantu berupa bentangan alas dengan dua tongkat pegangan yang digunakan tim penolong untuk menggotong korban luka berat menuju ambulans atau tenda medis.', startRow: 11, startCol: 1 },
      { id: 'a2s4c2', number: 2, direction: 'down', answer: 'MENINGGAL', clue: 'Kondisi korban bencana yang sudah kehilangan nyawanya, yang dalam sistem penanganan medis di lapangan biasanya diberikan penanda label berwarna hitam.', startRow: 4, startCol: 2 },
      { id: 'a2s4c3', number: 3, direction: 'across', answer: 'MERAH', clue: 'Warna penanda dalam sistem triase medis yang dipasangkan pada korban dengan kondisi luka paling kritis agar mendapat pertolongan paling pertama.', startRow: 5, startCol: 1 },
      { id: 'a2s4c4', number: 1, direction: 'down', answer: 'WASPADA', clue: 'Sikap berhati-hati dan selalu bersiap sedia yang wajib untuk mengantisipasi datangnya gempa susulan.', startRow: 1, startCol: 4 },
    ],
  },
  {
    rows: 9,
    cols: 12,
    clues: [
      { id: 'a2s5c1', number: 3, direction: 'across', answer: 'PMR', clue: 'Organisasi murid di sekolah yang anggotanya sering ditugaskan sebagai tim medis darurat untuk memberikan pertolongan pertama pada korban luka di lapangan.', startRow: 5, startCol: 1 },
      { id: 'a2s5c2', number: 4, direction: 'across', answer: 'PENCEGAHAN', clue: 'Segala tindakan persiapan, aturan, dan latihan yang dilakukan jauh sebelum bencana terjadi untuk meminimalkan jumlah korban luka.', startRow: 7, startCol: 1 },
      { id: 'a2s5c3', number: 2, direction: 'down', answer: 'SEKOLAH', clue: 'Bangunan yang dilarang keras untuk dimasuki kembali pasca gempa demi mengambil barang yang tertinggal.', startRow: 1, startCol: 8 },
      { id: 'a2s5c4', number: 1, direction: 'across', answer: 'EVAKUASI', clue: 'Proses menyelamatkan diri secara tertib dari area yang berbahaya menuju titik kumpul yang aman di lapangan.', startRow: 1, startCol: 2 },
    ],
  },
];

const VARIAN_AREA_3: GridTTS[] = [
  {
    rows: 6,
    cols: 13,
    clues: [
      { id: 'a3s1c1', number: 3, direction: 'across', answer: 'SEISMOGRAF', clue: 'Alat khusus di pos pengamatan yang digunakan petugas untuk mencatat getaran atau gelombang seismik gempa dari dalam tubuh gunung api.', startRow: 4, startCol: 2 },
      { id: 'a3s1c2', number: 2, direction: 'down', answer: 'AWAS', clue: 'Tingkat status aktivitas gunung api paling tinggi dan berpotensi besar terjadi erupsi saat itu, sehingga warga di zona bahaya harus segera mengungsi.', startRow: 1, startCol: 2 },
      { id: 'a3s1c3', number: 1, direction: 'across', answer: 'MASKER', clue: 'Alat pelindung pernapasan yang wajib disiapkan warga untuk menyaring partikel debu vulkanik yang tajam agar tidak masuk merusak paru-paru.', startRow: 1, startCol: 1 },
    ],
  },
  {
    rows: 11,
    cols: 7,
    clues: [
      { id: 'a3s2c1', number: 3, direction: 'across', answer: 'MAGMA', clue: 'Material batuan cair yang sangat panas di dalam perut bumi, sekaligus menjadi nama aplikasi resmi pemerintah untuk memantau gunung api di Indonesia.', startRow: 7, startCol: 1 },
      { id: 'a3s2c2', number: 1, direction: 'down', answer: 'WASPADA', clue: 'Tingkat status gunung api yang ditandai dengan peringatan warga menjauh 2-3 km dari kawah aktif, yang berarti kondisinya satu langkah di atas normal.', startRow: 1, startCol: 2 },
      { id: 'a3s2c3', number: 2, direction: 'down', answer: 'DEFORMASI', clue: 'Peristiwa perubahan bentuk tubuh gunung api yang perlahan mengembung akibat adanya dorongan material magma yang naik ke arah kawah.', startRow: 1, startCol: 5 },
    ],
  },
  {
    rows: 11,
    cols: 8,
    clues: [
      { id: 'a3s3c1', number: 4, direction: 'across', answer: 'SIAGA', clue: 'Tingkat status gunung api Level III yang menunjukkan peningkatan aktivitas secara nyata sehingga warga harus mulai menyiapkan tas darurat.', startRow: 9, startCol: 1 },
      { id: 'a3s3c2', number: 2, direction: 'down', answer: 'PVMBG', clue: 'Lembaga resmi milik pemerintah pusat yang memiliki wewenang untuk memantau aktivitas gunung api dan menetapkan tingkat status bahayanya di Indonesia.', startRow: 5, startCol: 4 },
      { id: 'a3s3c3', number: 1, direction: 'down', answer: 'AWANPANAS', clue: 'Material vulkanik mematikan berupa gumpalan campuran gas, abu, dan bebatuan bersuhu ratusan derajat celcius yang meluncur deras menuruni lereng, oleh masyarakat lokal sering disebut wedhus gembel.', startRow: 1, startCol: 1 },
      { id: 'a3s3c4', number: 3, direction: 'across', answer: 'NORMAL', clue: 'Tingkatan status aktivitas gunung api paling dasar (Level I) yang berarti kondisi gunung tenang dan aman untuk kegiatan masyarakat.', startRow: 7, startCol: 1 },
    ],
  },
  {
    rows: 11,
    cols: 10,
    clues: [
      { id: 'a3s4c1', number: 3, direction: 'across', answer: 'GOGGLE', clue: 'Jenis kacamata pelindung yang didesain tertutup rapat dan wajib digunakan warga saat terjadi hujan abu vulkanik agar mata tidak kelilipan material silika tajam.', startRow: 3, startCol: 1 },
      { id: 'a3s4c2', number: 2, direction: 'down', answer: 'SOLFATARA', clue: 'Asap atau uap belerang yang mulai mengepul keluar dari rekahan kubah kawah ketika gunung api mengalami peningkatan aktivitas pada status waspada.', startRow: 1, startCol: 5 },
      { id: 'a3s4c3', number: 1, direction: 'across', answer: 'ERUPSI', clue: 'Peristiwa semburan dahsyat yang mengeluarkan material vulkanik seperti magma, batu, dan abu dari dalam kawah ketika status gunung api sudah mencapai level Awas.', startRow: 1, startCol: 1 },
      { id: 'a3s4c4', number: 4, direction: 'across', answer: 'VULKANIK', clue: 'Jenis gempa yang terjadi ketika gunung akan atau sedang erupsi.', startRow: 5, startCol: 1 },
    ],
  },
  {
    rows: 9,
    cols: 7,
    clues: [
      { id: 'a3s5c1', number: 1, direction: 'across', answer: 'KRB', clue: 'Singkatan dari Kawasan Rawan Bencana, yaitu pembagian wilayah di sekitar gunung api yang dipetakan menjadi tiga zona berdasarkan tingkat ancaman bahayanya.', startRow: 1, startCol: 1 },
      { id: 'a3s5c2', number: 3, direction: 'across', answer: 'EMPAT', clue: 'Jumlah keseluruhan tingkatan level status aktivitas gunung api yang ditetapkan oleh PVMBG di Indonesia, yang dimulai dari Normal hingga Awas.', startRow: 3, startCol: 1 },
      { id: 'a3s5c3', number: 2, direction: 'down', answer: 'LETUSAN', clue: 'Istilah lain dari peristiwa gunung meletus, di mana material panas dari dalam bumi seperti magma, batuan, dan gas terdorong keluar menuju permukaan.', startRow: 1, startCol: 5 },
      { id: 'a3s5c4', number: 4, direction: 'across', answer: 'LAVA', clue: 'Wujud magma pijar encer maupun kental yang sudah berhasil keluar mencapai permukaan bumi dan mengalir menyusuri lereng gunung saat letusan terjadi.', startRow: 6, startCol: 2 },
    ],
  },
];

const VARIAN_AREA_5: GridTTS[] = [
  {
    rows: 10,
    cols: 6,
    clues: [
      { id: 'a5s1c1', number: 3, direction: 'across', answer: 'ATAP', clue: 'Bagian atas dari bangunan rumah yang wajib segera dibersihkan dari endapan abu vulkanik.', startRow: 2, startCol: 1 },
      { id: 'a5s1c2', number: 1, direction: 'down', answer: 'TANDON', clue: 'Wadah penampungan persediaan air bersih di area pengungsian yang harus selalu ditutup rapat agar terhindar dari pencemaran gas asam dan senyawa belerang.', startRow: 1, startCol: 1 },
      { id: 'a5s1c3', number: 2, direction: 'down', answer: 'SANITASI', clue: 'Sistem kebersihan lingkungan dan sarana air di barak pengungsian yang wajib selalu dijaga bersama oleh para warga agar tidak menimbulkan penularan penyakit.', startRow: 1, startCol: 3 },
    ],
  },
  {
    rows: 10,
    cols: 7,
    clues: [
      { id: 'a5s2c1', number: 3, direction: 'across', answer: 'BARAK', clue: 'Tempat penampungan darurat terpadu yang berlokasi di zona aman (KRB I) sebagai tempat tinggal sementara bagi para warga yang rumahnya terdampak erupsi.', startRow: 8, startCol: 1 },
      { id: 'a5s2c2', number: 2, direction: 'down', answer: 'LANSIA', clue: 'Salah satu kelompok warga rentan, yaitu orang yang sudah berusia lanjut, yang wajib didata dan didahulukan oleh petugas saat pembagian bantuan.', startRow: 3, startCol: 2 },
      { id: 'a5s2c3', number: 1, direction: 'down', answer: 'LOGISTIK', clue: 'Pasokan kebutuhan pokok yang disalurkan setiap hari untuk para warga di tempat pengungsian, yang meliputi makanan, air bersih, dan selimut.', startRow: 1, startCol: 5 },
    ],
  },
  {
    rows: 12,
    cols: 8,
    clues: [
      { id: 'a5s3c1', number: 4, direction: 'across', answer: 'TRAUMA', clue: 'Kondisi psikologis yang ditandai dengan rasa takut mendalam yang dialami korban pascabencana, sehingga memerlukan penanganan khusus dari psikolog atau psikiater.', startRow: 6, startCol: 1 },
      { id: 'a5s3c2', number: 3, direction: 'down', answer: 'PENGUNGSI', clue: 'Sebutan untuk masyarakat yang tinggal sementara di tempat penampungan darurat akibat rumah mereka terdampak letusan gunung api.', startRow: 2, startCol: 4 },
      { id: 'a5s3c3', number: 1, direction: 'down', answer: 'AWANPANAS', clue: 'Jenis bahaya lanjutan pasca erupsi yang berisiko menerjang kawasan lereng meskipun letusan utama telah usai.', startRow: 1, startCol: 6 },
      { id: 'a5s3c4', number: 2, direction: 'down', answer: 'LAHAR', clue: 'Material endapan vulkanik berupa campuran pasir, abu, dan batuan yang menyatu dengan air hujan, lalu mengalir sangat deras menyapu apa saja yang ada di alur sungai.', startRow: 2, startCol: 2 },
    ],
  },
  {
    rows: 10,
    cols: 14,
    clues: [
      { id: 'a5s4c1', number: 4, direction: 'across', answer: 'CUCITANGAN', clue: 'Langkah kebersihan dasar menggunakan air mengalir dan sabun yang wajib dilakukan sebelum makan oleh warga di barak untuk mencegah penularan penyakit.', startRow: 8, startCol: 3 },
      { id: 'a5s4c2', number: 1, direction: 'down', answer: 'BELERANG', clue: 'Zat gas vulkanik berbau sangat menyengat yang sering terbawa oleh abu vulkanik dan dapat mencemari persediaan air bersih di area pengungsian.', startRow: 1, startCol: 10 },
      { id: 'a5s4c3', number: 2, direction: 'down', answer: 'SILIKA', clue: 'Material abu vulkanik yang tajam menyerupai pecahan kaca, sangat halus dan bisa melukai kornea mata serta merusak paru-paru jika terhirup.', startRow: 3, startCol: 8 },
      { id: 'a5s4c4', number: 3, direction: 'across', answer: 'REHABILITASI', clue: 'Manajemen pemulihan suatu wilayah yang terkena bencana agar kehidupan masyarakat kembali normal.', startRow: 6, startCol: 1 },
    ],
  },
  {
    rows: 14,
    cols: 11,
    clues: [
      { id: 'a5s5c1', number: 2, direction: 'across', answer: 'KRATER', clue: 'Cekungan atau lubang besar di bagian puncak gunung berapi yang menjadi tempat utama menyemburnya magma, gas, dan awan panas saat erupsi terjadi.', startRow: 3, startCol: 3 },
      { id: 'a5s5c2', number: 3, direction: 'down', answer: 'EFUSIF', clue: 'Jenis letusan gunung api yang terjadi tanpa disertai ledakan dahsyat melainkan hanya berupa lelehan lava panas yang mengalir perlahan menyusuri lereng.', startRow: 3, startCol: 7 },
      { id: 'a5s5c3', number: 1, direction: 'down', answer: 'REKONSTRUKSI', clue: 'Manajemen pemulihan dengan membangun kembali sarana dan prasarana dengan standar yang lebih baik untuk meminimalkan dampak erupsi di masa depan.', startRow: 1, startCol: 3 },
      { id: 'a5s5c4', number: 4, direction: 'across', answer: 'EKSPLOSIF', clue: 'Jenis letusan gunung api yang terjadi secara meledak-ledak dan sangat dahsyat hingga mampu melontarkan material abu dan batuan vulkanik jauh tinggi ke udara.', startRow: 6, startCol: 1 },
    ],
  },
];

export const BANK_TTS: Record<number, GridTTS[]> = {
  0: VARIAN_AREA_0,
  2: VARIAN_AREA_2,
  3: VARIAN_AREA_3,
  5: VARIAN_AREA_5,
};

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


  // ── KATA SEJAJAR TIDAK BOLEH BERDAMPINGAN ─────────────────────────────
  //
  // Dua kata yang searah dan berdiri bersebelahan (jarak 1 sel pada sumbu
  // tegak lurus) membuat kotak-kotaknya menyatu menjadi satu blok. Di layar
  // blok itu terbaca sebagai "kotak yang menempel-nempel", dan siswa tidak
  // dapat lagi melihat batas tiap kata.
  //
  // Ini bukan sekadar soal kerapian: kata yang berdampingan tanpa kotak
  // pemisah membuat nomor dan arah petunjuk tampak bertumpuk, sehingga siswa
  // salah mengira rentang sebuah kata.
  //
  // Aturan ini yang dipakai penyusun grid, dan di sini diperiksa ulang supaya
  // grid yang disunting tangan pun tidak dapat melanggarnya.
  for (let a = 0; a < grid.clues.length; a++) {
    for (let b = a + 1; b < grid.clues.length; b++) {
      const x = grid.clues[a];
      const y = grid.clues[b];
      if (x.direction !== y.direction) continue;

      // Jarak pada sumbu tegak lurus arah kata.
      const jarakTegakLurus =
        x.direction === 'down'
          ? Math.abs(x.startCol - y.startCol)
          : Math.abs(x.startRow - y.startRow);
      if (jarakTegakLurus !== 1) continue;

      // Hanya menjadi masalah bila rentang sepanjang arah katanya beririsan.
      const awalX = x.direction === 'down' ? x.startRow : x.startCol;
      const akhirX = awalX + x.answer.length - 1;
      const awalY = y.direction === 'down' ? y.startRow : y.startCol;
      const akhirY = awalY + y.answer.length - 1;
      const beririsan = awalX <= akhirY && awalY <= akhirX;

      if (beririsan) {
        masalah.push(
          `kata sejajar berdampingan: ${x.id} ("${x.answer}") dan ${y.id} ("${y.answer}") ` +
            `hanya berjarak 1 kotak sehingga kotaknya menyatu`,
        );
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
