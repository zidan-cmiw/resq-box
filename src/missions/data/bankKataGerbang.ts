// ── src/missions/data/bankKataGerbang.ts ─────────────────────────────────────
// BANK KATA GERBANG SEISMIK LEVEL 1 — BEBERAPA VARIAN PER ZONA.
//
// ═══════════════════════════════════════════════════════════════════════════
// MENGAPA PERLU VARIAN
// ═══════════════════════════════════════════════════════════════════════════
//
//   Sebelumnya tiap zona hanya punya SATU set kata, sehingga seluruh siswa di
//   seluruh angkatan memecahkan kata yang sama persis. Akibatnya jawabannya
//   mudah bocor: cukup bertanya kepada kakak kelas atau teman yang sudah main.
//
//   Sekarang tiap zona punya beberapa varian, dan satu varian diundi untuk tiap
//   siswa. Kata yang harus dipecahkan berbeda antar-siswa, tetapi tetap sama
//   bila siswa yang sama membuka ulang zona itu — sehingga tidak ada yang bisa
//   "mengundi ulang" dengan me-refresh halaman.
//
// ═══════════════════════════════════════════════════════════════════════════
// ATURAN PENYUSUNAN — DIPERIKSA OTOMATIS
// ═══════════════════════════════════════════════════════════════════════════
//
//   1. JUMLAH KATA SERAGAM dalam satu zona. Zona 2 (Mantel) dan zona 6
//      (Konvergen) memakai 2 kata, zona lainnya 3 kata. Ini bukan kerapian
//      belaka: `targetCount` pada gerbang mengikuti jumlah kata varian yang
//      terundi, sehingga varian berisi 4 kata akan terasa jauh lebih berat
//      daripada varian berisi 2 kata — dan bebannya menjadi tidak adil.
//      Ada uji otomatis yang menegakkan aturan ini.
//
//   2. Semua varian pada satu zona menguji MATERI YANG SAMA. Yang berbeda hanya
//      kata dan petunjuknya, bukan konsepnya.
//
//   3. Petunjuk harus benar-benar menuntun, bukan menyebut jawabannya.
//
//   4. Kata ditulis dengan huruf kapital tanpa spasi, karena itulah yang
//      diketik siswa pada papan tebak kata.
//
// File ini murni data + satu fungsi pengundian, dipisah dari komponennya supaya
// dapat diuji otomatis tanpa perlu merender React.

import { benihDari, pilihBerbenih } from '../engine/undianBerbenih.ts';

export interface KataGerbang {
  word: string;
  /** Petunjuk utama. */
  hint: string;
  /**
   * Petunjuk ALTERNATIF untuk jawaban yang SAMA.
   *
   * Gunanya: dua siswa yang kebetulan mendapat kata yang sama tetap membaca
   * kalimat soal yang BERBEDA, sementara jawabannya tidak berubah. Dengan begitu
   * menyalin jawaban dari teman tidak lagi berguna, karena kalimat soalnya tidak
   * sama - tetapi materi dan kuncinya tetap sama persis.
   *
   * Setiap kalimat di sini WAJIB tetap memenuhi aturan yang sama seperti `hint`:
   * tidak boleh memuat kata jawabannya sendiri.
   */
  hintLain?: string[];
}

/** Bank varian: indeks zona -> daftar varian -> daftar kata. */
export const ZONE_GATE_BANK: Record<number, KataGerbang[][]> = {
  0: [
    // Permukaan Bumi
    [
      { word: 'KERAK', hint: 'Lapisan paling luar bumi tempat kita tinggal dan paling tipis.', hintLain: ['Bagian terluar bumi yang paling tipis, tempat kita berpijak.'] },
      { word: 'BENUA', hint: 'Daratan luas tempat kita hidup di atas permukaan bumi.', hintLain: ['Daratan yang sangat luas dan terpisah oleh lautan.'] },
      { word: 'BATUAN', hint: 'Benda padat alami yang menyusun lapisan kerak bumi.', hintLain: ['Bahan padat alami pembentuk kerak, misalnya granit dan basal.'] },
    ],
    [
      { word: 'LITOSFER', hint: 'Nama lain lapisan batuan paling luar bumi, tempat seluruh kehidupan berlangsung.', hintLain: ['Lapisan kaku terluar bumi, gabungan kerak dengan bagian atas mantel.'] },
      { word: 'DARATAN', hint: 'Bagian permukaan bumi yang tidak tertutup air.', hintLain: ['Bagian permukaan bumi yang kering dan tidak tergenang.'] },
      { word: 'MINERAL', hint: 'Bahan padat alami pembentuk batuan, misalnya kuarsa dan feldspar.', hintLain: ['Zat padat alami penyusun batuan, contohnya kuarsa.'] },
    ],
    [
      { word: 'PERMUKAAN', hint: 'Bagian bumi yang paling atas, tempat kita berpijak dan bernapas.', hintLain: ['Bagian teratas bumi yang dapat kita lihat dan pijak.'] },
      { word: 'LAUTAN', hint: 'Bagian permukaan bumi yang tertutup air asin dan paling luas.', hintLain: ['Wilayah bumi yang tergenang air asin dan paling luas.'] },
      { word: 'TANAH', hint: 'Lapisan paling atas kerak bumi tempat tumbuhan berakar.', hintLain: ['Lapisan gembur di permukaan tempat akar tumbuhan menancap.'] },
    ],
    [
      { word: 'LEMBAH', hint: 'Bagian permukaan bumi yang lebih rendah di antara dua lereng.', hintLain: ['Wilayah rendah di antara dua lereng gunung.'] },
      { word: 'GUNUNG', hint: 'Bentuk permukaan bumi yang menjulang tinggi ke atas.', hintLain: ['Bentang alam yang menjulang tinggi dan sering berbentuk kerucut.'] },
      { word: 'SUNGAI', hint: 'Alur alami di permukaan bumi tempat air mengalir menuju laut.', hintLain: ['Aliran air alami di daratan yang bermuara ke laut.'] },
    ],
    [
      { word: 'PEGUNUNGAN', hint: 'Bentang alam yang tersusun dari rangkaian gunung berderet memanjang.', hintLain: ['Kumpulan gunung yang berderet memanjang di satu wilayah.'] },
      { word: 'DATARAN', hint: 'Wilayah permukaan bumi yang relatif rata dan terbentang luas.', hintLain: ['Wilayah bumi yang permukaannya rata dan luas.'] },
      { word: 'PANTAI', hint: 'Bagian permukaan bumi yang menjadi batas antara daratan dan laut.', hintLain: ['Wilayah pertemuan antara daratan dengan laut, berpasir atau berbatu.'] },
    ],
    [
      { word: 'BUKIT', hint: 'Bentang alam yang lebih rendah daripada gunung, namun lebih tinggi daripada dataran.', hintLain: ['Bentang alam yang menjulang, tetapi lebih rendah daripada gunung.'] },
      { word: 'JURANG', hint: 'Bagian permukaan bumi yang sangat dalam dan curam, biasanya di pegunungan.', hintLain: ['Lembah sangat dalam dengan dinding curam, biasanya di daerah pegunungan.'] },
      { word: 'PULAU', hint: 'Daratan yang dikelilingi air dan terpisah dari daratan utama.', hintLain: ['Daratan yang seluruh sisinya dikelilingi air.'] },
    ],
  ],
  1: [
    // Kerak Bumi
    [
      { word: 'KERAK', hint: 'Lapisan paling luar bumi tempat kita tinggal, dan merupakan lapisan yang paling tipis.', hintLain: ['Bagian terluar bumi yang paling tipis, tempat kita berpijak.'] },
      { word: 'BENUA', hint: 'Jenis kerak bumi di bawah daratan yang memiliki ketebalan mencapai 100 kilometer.', hintLain: ['Daratan yang sangat luas; kerak bumi di bawahnya paling tebal, sampai 100 km.'] },
      { word: 'SAMUDRA', hint: 'Jenis kerak bumi di bawah lautan yang tipis (5-15 km), tetapi lebih padat dan berat.', hintLain: ['Lautan yang sangat luas; kerak di bawahnya hanya 5-15 km tetapi lebih berat.'] },
    ],
    [
      { word: 'LITOSFER', hint: 'Lapisan batuan paling luar bumi, tersusun dari kerak dan bagian atas mantel.', hintLain: ['Lapisan kaku terluar bumi, gabungan kerak dengan bagian atas mantel.'] },
      { word: 'DARATAN', hint: 'Wilayah kerak bumi yang letaknya lebih tinggi daripada permukaan laut.', hintLain: ['Bagian permukaan bumi yang kering dan tidak tertutup air.'] },
      { word: 'LAUTAN', hint: 'Wilayah kerak bumi yang tertutup air, keraknya lebih tipis tetapi lebih berat.', hintLain: ['Bagian bumi yang tergenang air asin dan menutupi sebagian besar permukaannya.'] },
    ],
    [
      { word: 'TIPIS', hint: 'Kerak samudra bersifat ... dibandingkan kerak benua.', hintLain: ['Sifat kerak di bawah lautan jika dibandingkan kerak di bawah daratan.'] },
      { word: 'GRANIT', hint: 'Batuan penyusun utama kerak benua, berwarna lebih terang dan lebih ringan.', hintLain: ['Jenis batuan yang mendominasi kerak di bawah daratan; warnanya terang.'] },
      { word: 'BASAL', hint: 'Batuan penyusun utama kerak samudra, berwarna gelap dan lebih padat.', hintLain: ['Jenis batuan yang mendominasi kerak di bawah lautan; warnanya gelap.'] },
    ],
    [
      // Pengetahuan lokal Indonesia — materi yang diminta dosen IPA saat validasi
      // (Indonesia berada di pertemuan lempeng, sehingga rawan gempa).
      { word: 'INDONESIA', hint: 'Negara yang terletak di pertemuan Lempeng Indo-Australia, Eurasia, dan Pasifik.', hintLain: ['Negara kita, berada di titik pertemuan tiga lempeng besar sehingga rawan gempa.'] },
      { word: 'SUMATRA', hint: 'Pulau yang tanahnya subur karena abu vulkanik, tetapi juga rawan gempa.', hintLain: ['Pulau di barat negara kita; tanahnya subur, tetapi sering diguncang gempa.'] },
      { word: 'GEMPA', hint: 'Peristiwa yang sering terjadi di Indonesia karena lempengnya saling bertumbukan.', hintLain: ['Getaran yang menjalar di permukaan bumi akibat lempeng yang bertumbukan.'] },
    ],
    [
      { word: 'TEBAL', hint: 'Kerak benua bersifat ... dibandingkan kerak samudra.', hintLain: ['Sifat kerak di bawah daratan jika dibandingkan kerak di bawah lautan.'] },
      { word: 'SEDIMEN', hint: 'Batuan yang terbentuk dari endapan material di permukaan kerak.', hintLain: ['Endapan yang mengeras lapis demi lapis di permukaan bumi.'] },
      { word: 'LEMPENG', hint: 'Pecahan besar kerak bumi yang bergerak di atas lapisan yang kental.', hintLain: ['Potongan raksasa kerak bumi yang saling bergerak dan bertumbukan.'] },
    ],
    [
      { word: 'KERAS', hint: 'Sifat lapisan paling luar bumi yang membuat kita dapat berpijak di atasnya.', hintLain: ['Sifat batuan di permukaan sehingga kita dapat berdiri di atasnya.'] },
      { word: 'SILIKAT', hint: 'Senyawa pembentuk batuan yang banyak menyusun lapisan padat bumi.', hintLain: ['Senyawa batuan yang mengandung silikon dan oksigen, banyak menyusun bumi.'] },
      { word: 'BATU', hint: 'Benda padat alami yang menyusun lapisan kerak bumi.', hintLain: ['Bahan padat alami pembentuk kerak, misalnya granit dan basal.'] },
    ],
    [
      { word: 'LERENG', hint: 'Sisi miring sebuah gunung atau bukit, dari kaki sampai ke puncaknya.', hintLain: ['Bagian miring gunung yang menghubungkan kaki dengan puncaknya.'] },
      { word: 'TANAH', hint: 'Lapisan paling atas kerak bumi tempat tumbuhan tumbuh dan berakar.', hintLain: ['Lapisan gembur di permukaan tempat akar tumbuhan menancap.'] },
      { word: 'LEMPUNG', hint: 'Jenis tanah yang lengket dan kedap air, sering dipakai membuat kerajinan.', hintLain: ['Jenis tanah yang liat dan sulit dilalui air; bahan dasar gerabah.'] },
    ],
  ],
  2: [
    // Mantel Bumi — sengaja HANYA 2 kata, konsisten di semua varian.
    [
      { word: 'MANTEL', hint: 'Lapisan di bawah kerak bumi yang merupakan lapisan paling tebal (2.900 km).', hintLain: ['Lapisan tertebal di dalam bumi, letaknya tepat di bawah kerak.'] },
      { word: 'KONVEKSI', hint: 'Arus perputaran panas di dalam mantel yang menggerakkan lempeng bumi.', hintLain: ['Perpindahan panas yang berputar membentuk sel, dan menjadi tenaga penggerak lempeng.'] },
    ],
    [
      { word: 'ADONAN', hint: 'Material mantel paling mirip benda kental ini, sehingga dapat mengalir sangat lambat.', hintLain: ['Material mantel diibaratkan seperti campuran tepung dan air yang kental ini.'] },
      { word: 'FLUIDA', hint: 'Wujud material mantel: bukan padat kaku, melainkan ... sangat kental.', hintLain: ['Sebutan untuk zat yang dapat mengalir, misalnya zat kental di dalam mantel.'] },
    ],
    [
      { word: 'SILIKAT', hint: 'Bahan batuan penyusun mantel bumi.', hintLain: ['Senyawa yang banyak menyusun batuan mantel, mengandung silikon dan oksigen.'] },
      { word: 'PANAS', hint: 'Suhu mantel berkisar 1.000 sampai 3.700 derajat Celsius, artinya mantel sangat...', hintLain: ['Keadaan suhu di dalam mantel yang mencapai ribuan derajat Celsius.'] },
    ],
    [
      { word: 'KENTAL', hint: 'Sifat material mantel: sangat ... sehingga mengalir sangat lambat.', hintLain: ['Sifat zat yang mengalir lambat karena partikelnya rapat, seperti material mantel.'] },
      { word: 'ASTENOSFER', hint: 'Lapisan kental di bagian atas mantel, tepat di bawah kerak bumi.', hintLain: ['Bagian paling atas mantel yang paling liat, tempat lempeng bergerak di atasnya.'] },
    ],
    [
      { word: 'MELELEH', hint: 'Yang terjadi pada batuan bila suhunya melampaui titik leburnya.', hintLain: ['Perubahan wujud batuan menjadi zat alir karena suhunya sangat tinggi.'] },
      { word: 'SIRKULASI', hint: 'Nama lain perputaran aliran panas yang membentuk sel di dalam mantel.', hintLain: ['Gerakan berputar aliran zat kental di dalam mantel, dari bawah ke atas lalu kembali turun.'] },
    ],
    [
      { word: 'KONDUKSI', hint: 'Perpindahan panas melalui sebuah zat tanpa memindahkan zatnya sendiri.', hintLain: ['Cara panas merambat melalui sebuah benda tanpa benda itu ikut berpindah.'] },
      { word: 'GEOTERMAL', hint: 'Sebutan bagi energi panas yang berasal dari dalam bumi.', hintLain: ['Istilah bagi panas bumi yang dimanfaatkan sebagai pembangkit listrik.'] },
    ],
  ],
  3: [
    // Inti Luar
    [
      { word: 'NIKEL', hint: 'Bahan yang menjadi penyusun utama lapisan inti bumi adalah besi dan...', hintLain: ['Logam berwarna keperakan yang mendampingi besi di pusat bumi.'] },
      { word: 'CAIRAN', hint: 'Inti luar bumi wujudnya berupa...', hintLain: ['Wujud zat yang dapat mengalir, seperti logam panas di inti luar.'] },
      { word: 'MAGNET', hint: 'Lapisan inti bumi luar menghasilkan medan... yang melindungi bumi dari radiasi matahari.', hintLain: ['Sifat gaya tarik yang dimiliki bumi dan dapat menarik besi.'] },
    ],
    [
      { word: 'BESI', hint: 'Logam utama penyusun inti bumi, bersama nikel.', hintLain: ['Logam yang paling banyak menyusun pusat bumi, bersama nikel.'] },
      { word: 'LELEHAN', hint: 'Inti luar berupa ... logam, karena suhunya melampaui titik leleh besi.', hintLain: ['Logam yang telah berubah menjadi zat alir karena panas.'] },
      { word: 'KOMPAS', hint: 'Alat penunjuk arah yang bekerja karena memanfaatkan medan magnet bumi.', hintLain: ['Alat navigasi berjarum yang selalu menunjuk ke arah utara dan selatan.'] },
    ],
    [
      { word: 'LOGAM', hint: 'Inti bumi tersusun dari ... besi dan nikel, bukan batuan.', hintLain: ['Bahan penghantar panas dan listrik yang baik, seperti besi dan nikel.'] },
      { word: 'PANAS', hint: 'Suhu inti luar sekitar 5.000 derajat Celsius, artinya sangat...', hintLain: ['Keadaan suhu di inti luar yang mencapai sekitar 5.000 derajat Celsius.'] },
      { word: 'KUTUB', hint: 'Medan magnet bumi memiliki dua ..., yaitu utara dan selatan.', hintLain: ['Sebutan bagi ujung utara dan ujung selatan sebuah magnet.'] },
    ],
    [
      { word: 'ARUS', hint: 'Logam cair di inti luar membentuk ... listrik yang menghasilkan medan magnet.', hintLain: ['Aliran listrik yang timbul dari logam yang bergerak di inti luar.'] },
      { word: 'LISTRIK', hint: 'Jenis aliran yang timbul dari logam cair yang bergerak di inti luar.', hintLain: ['Aliran energi yang muncul dari logam yang bergerak, dan membangkitkan magnet.'] },
      { word: 'LINDUNG', hint: 'Medan magnet bumi bertugas ... permukaan dari radiasi angkasa.', hintLain: ['Tugas medan magnet bumi: menahan radiasi angkasa agar tidak sampai ke permukaan.'] },
    ],
    [
      { word: 'MEDAN', hint: 'Wilayah yang dipengaruhi sebuah gaya, misalnya gaya magnet bumi.', hintLain: ['Ruang di sekitar magnet yang masih terpengaruh gaya tariknya.'] },
      { word: 'GEODYNAMO', hint: 'Mekanisme perputaran logam di inti luar yang membangkitkan magnet bumi.', hintLain: ['Cara kerja perputaran logam panas di inti luar sehingga bumi memiliki magnet.'] },
      { word: 'PERISAI', hint: 'Sebutan bagi medan magnet bumi karena melindungi dari radiasi angkasa.', hintLain: ['Sebutan bagi pelindung alami bumi dari radiasi angkasa.'] },
    ],
    [
      { word: 'LEBUR', hint: 'Hancur menjadi zat alir karena panas yang sangat tinggi.', hintLain: ['Peristiwa berubahnya logam menjadi zat alir akibat panas yang sangat tinggi.'] },
      { word: 'CAIR', hint: 'Wujud logam di inti luar, berbeda dengan inti dalam yang padat.', hintLain: ['Wujud zat yang mengalir dan tidak mempertahankan bentuknya.'] },
      { word: 'SUHU', hint: 'Besaran yang mencapai 5.000 derajat Celsius di inti luar bumi.', hintLain: ['Besaran yang diukur dengan termometer dan menyatakan derajat panas.'] },
    ],
  ],
  4: [
    // Inti Dalam — sengaja HANYA 2 kata.
    [
      { word: 'INTIDALAM', hint: 'Lapisan terdalam planet bumi pada kedalaman 6.371 kilometer.', hintLain: ['Bagian paling tengah bumi, berupa bola logam di kedalaman 6.371 km.'] },
      { word: 'PADAT', hint: 'Inti dalam berbentuk sangat ... karena tekanan yang sangat besar dari segala arah.', hintLain: ['Sifat zat yang partikelnya rapat dan tidak dapat mengalir, seperti lapisan terdalam bumi.'] },
    ],
    [
      { word: 'BESI', hint: 'Logam utama penyusun bola inti dalam bumi.', hintLain: ['Logam utama pada bola terdalam bumi, berpasangan dengan nikel.'] },
      { word: 'TEKANAN', hint: 'Penyebab inti dalam tetap padat walaupun suhunya 6.000 derajat Celsius.', hintLain: ['Gaya desak dari segala arah yang membuat bagian terdalam bumi tetap padat.'] },
    ],
    [
      { word: 'BOLA', hint: 'Bentuk inti dalam bumi, terselubung oleh inti luar.', hintLain: ['Bentuk bulat sempurna seperti yang dimiliki lapisan terdalam bumi.'] },
      { word: 'PUSAT', hint: 'Letak inti dalam: di ... bumi.', hintLain: ['Tempat kedudukan bagian terdalam bumi: di bagian paling tengah.'] },
    ],
    [
      { word: 'GRAVITASI', hint: 'Gaya yang menarik segala sesuatu menuju pusat bumi.', hintLain: ['Gaya tarik bumi yang membuat benda jatuh ke bawah.'] },
      { word: 'TERDALAM', hint: 'Inti dalam adalah lapisan yang paling ... di seluruh bumi.', hintLain: ['Kedudukan lapisan yang paling jauh dari permukaan bumi.'] },
    ],
    [
      { word: 'INTI', hint: 'Bagian paling tengah dari sesuatu, misalnya bagian terdalam bumi.', hintLain: ['Bagian paling tengah, misalnya pada buah atau pada bumi.'] },
      { word: 'PADUAN', hint: 'Campuran dua logam atau lebih, seperti besi dan nikel di pusat bumi.', hintLain: ['Hasil pencampuran beberapa logam, misalnya besi dengan nikel.'] },
    ],
    [
      { word: 'NIKEL', hint: 'Logam penyusun inti bumi yang berpasangan dengan besi.', hintLain: ['Logam berwarna keperakan yang menyertai besi di pusat bumi.'] },
      { word: 'MAMPAT', hint: 'Keadaan zat yang partikelnya sangat rapat karena tekanan yang besar.', hintLain: ['Keadaan zat yang partikelnya terdesak sangat rapat oleh tekanan besar.'] },
    ],
  ],
  5: [
    // Batas Divergen
    [
      { word: 'PANGEA', hint: 'Nama superbenua raksasa purba yang dulunya menyatukan seluruh daratan bumi.', hintLain: ['Benua raksasa purba yang dahulu menyatukan seluruh daratan dunia.'] },
      { word: 'MENJAUH', hint: 'Arah pergerakan dua lempeng tektonik pada batas divergen saling...', hintLain: ['Arah gerak dua lempeng pada batas divergen, yaitu saling meninggalkan.'] },
      { word: 'MAGMA', hint: 'Batuan cair panas dari mantel bumi yang menerobos naik mengisi celah rekahan lempeng.', hintLain: ['Zat cair panas dari dalam bumi yang naik mengisi rekahan kerak.'] },
    ],
    [
      { word: 'DIVERGEN', hint: 'Nama batas lempeng tempat dua lempeng bergerak saling menjauh.', hintLain: ['Sebutan batas lempeng yang kedua sisinya bergerak saling meninggalkan.'] },
      { word: 'CELAH', hint: 'Ruang terbuka yang terbentuk saat dua lempeng saling menjauh, lalu terisi magma.', hintLain: ['Rongga terbuka di kerak yang muncul ketika lempeng saling bergerak menjauh.'] },
      { word: 'REKAHAN', hint: 'Retakan pada kerak bumi tempat magma dapat naik ke permukaan.', hintLain: ['Belahan pada kerak bumi yang menjadi jalan naiknya zat cair panas.'] },
    ],
    [
      { word: 'MEMISAH', hint: 'Arti kata divergen: kedua lempeng saling...', hintLain: ['Arti kata divergen: kedua lempeng saling meninggalkan satu sama lain.'] },
      { word: 'PUNGGUNG', hint: 'Bentuk dasar samudra yang menjulang di batas divergen: ... tengah samudra.', hintLain: ['Bagian dasar laut yang meninggi di batas divergen, disebut ... tengah samudra.'] },
      { word: 'SAMUDRA', hint: 'Batas divergen paling banyak terdapat di dasar...', hintLain: ['Batas divergen paling banyak ditemukan di dasar lautan luas.'] },
    ],
    [
      { word: 'TERBELAH', hint: 'Daratan Pangea perlahan ... menjadi benua-benua yang kita kenal sekarang.', hintLain: ['Benua yang kita kenal sekarang dahulu menyatu, lalu saling melepaskan diri.'] },
      { word: 'TENGAH', hint: 'Batas divergen di dasar samudra disebut punggung ... samudra.', hintLain: ['Batas divergen di dasar laut disebut punggung ... laut.'] },
      { word: 'LAVA', hint: 'Magma yang sudah mencapai permukaan bumi disebut...', hintLain: ['Zat cair panas dari dalam bumi yang sudah keluar ke permukaan.'] },
    ],
    [
      { word: 'MELEBAR', hint: 'Bertambah luas, seperti dasar samudra yang terus memanjang.', hintLain: ['Bertambah lebar, seperti dasar laut yang terus memanjang.'] },
      { word: 'RETAK', hint: 'Keadaan kerak yang terbelah akibat gaya yang menariknya memisah.', hintLain: ['Keadaan kerak yang terbelah-belah karena ditarik ke dua arah.'] },
      { word: 'ZONA', hint: 'Sebutan untuk daerah atau kawasan yang memiliki ciri tertentu.', hintLain: ['Sebutan bagi kawasan yang punya ciri khas tertentu.'] },
    ],
    [
      { word: 'MENGAPUNG', hint: 'Keadaan lempeng yang berada di atas lapisan mantel yang kental.', hintLain: ['Keadaan lempeng yang terapung di atas lapisan kental di bawahnya.'] },
      { word: 'GERAK', hint: 'Perpindahan posisi, seperti lempeng yang berpindah sangat lambat.', hintLain: ['Perpindahan tempat, seperti lempeng yang berpindah beberapa sentimeter per tahun.'] },
      { word: 'BENUA', hint: 'Daratan luas, yang dahulu menyatu lalu saling menjauh.', hintLain: ['Daratan sangat luas yang dahulu bersatu lalu berpisah.'] },
    ],
  ],
  6: [
    // Batas Konvergen — sengaja HANYA 2 kata.
    [
      { word: 'PALUNG', hint: 'Jurang sempit yang sangat dalam di dasar samudra akibat penunjaman lempeng.', hintLain: ['Jurang sangat dalam di dasar laut, terbentuk saat lempeng menunjam.'] },
      { word: 'MERAPI', hint: 'Contoh gunung berapi aktif di Indonesia yang terbentuk dari jalur subduksi lempeng.', hintLain: ['Gunung berapi aktif di Jawa Tengah yang meletus dahsyat tahun 2010.'] },
    ],
    [
      { word: 'SUBDUKSI', hint: 'Nama proses saat lempeng samudra menunjam ke bawah lempeng benua.', hintLain: ['Sebutan proses penunjaman lempeng laut ke bawah lempeng daratan.'] },
      { word: 'TUMBUKAN', hint: 'Batas konvergen terjadi karena dua lempeng mengalami...', hintLain: ['Batas konvergen terjadi karena dua lempeng saling bertabrakan.'] },
    ],
    [
      { word: 'MENUNJAM', hint: 'Arah gerak lempeng samudra terhadap lempeng benua pada zona subduksi.', hintLain: ['Arah gerak lempeng laut pada zona subduksi: menyusup ke bawah lempeng daratan.'] },
      { word: 'LEMPENG', hint: 'Pecahan besar kerak bumi yang bergerak dan bertumbukan di batas konvergen.', hintLain: ['Potongan raksasa kerak bumi yang saling bertabrakan di batas konvergen.'] },
    ],
    [
      // Tumbukan dua lempeng BENUA — materi yang diminta dosen IPA saat validasi.
      // Dua lempeng benua sama-sama ringan sehingga tidak ada yang menunjam,
      // dan hasilnya pegunungan lipatan, bukan gunung api.
      { word: 'HIMALAYA', hint: 'Pegunungan lipatan tertinggi di dunia, hasil tumbukan dua lempeng BENUA.', hintLain: ['Rangkaian pegunungan tertinggi di dunia, hasil tumbukan dua lempeng daratan.'] },
      { word: 'LIPATAN', hint: 'Bentuk pegunungan dari tumbukan dua lempeng benua, bukan gunung api.', hintLain: ['Jenis pegunungan yang terbentuk dari tumbukan dua lempeng daratan.'] },
    ],
    [
      { word: 'TABRAKAN', hint: 'Batas konvergen terjadi karena ... antara dua lempeng tektonik.', hintLain: ['Peristiwa benturan antara dua lempeng yang membentuk batas konvergen.'] },
      { word: 'TINGGI', hint: 'Tumbukan dua lempeng benua mengangkat daratan menjadi pegunungan yang sangat...', hintLain: ['Akibat benturan dua lempeng daratan, tanah terangkat sampai menjulang ke langit.'] },
    ],
    [
      { word: 'GUNUNG', hint: 'Bentuk permukaan bumi yang menjulang tinggi dan sering berbentuk kerucut.', hintLain: ['Bentang alam menjulang yang sering berbentuk kerucut dan dapat meletus.'] },
      { word: 'PEGUNUNGAN', hint: 'Rangkaian gunung berderet memanjang, seperti hasil tumbukan lempeng.', hintLain: ['Kumpulan gunung yang berderet, terbentuk dari tumbukan lempeng.'] },
    ],
    [
      { word: 'DANGKAL', hint: 'Sifat gempa yang pusatnya dekat permukaan, sehingga getarannya kuat.', hintLain: ['Sifat gempa yang pusatnya dekat permukaan bumi; getarannya terasa kuat.'] },
      { word: 'MENDEKAT', hint: 'Arah gerak dua lempeng pada batas konvergen, yaitu saling...', hintLain: ['Pada batas konvergen, kedua lempeng bergerak saling menghampiri.'] },
    ],
  ],
  7: [
    // Batas Transform — sengaja HANYA 2 kata.
    [
      { word: 'TRANSFORM', hint: 'Batas lempeng tektonik di mana dua lempeng saling bergesekan mendatar berlawanan arah.', hintLain: ['Jenis batas lempeng tempat dua lempeng saling bergesekan mendatar berlawanan arah.'] },
      { word: 'SANANDREAS', hint: 'Patahan mendatar terkenal di California yang membentang sepanjang 1.200 kilometer.', hintLain: ['Patahan mendatar di California yang panjangnya sekitar 1.200 kilometer.'] },
    ],
    [
      { word: 'GESERAN', hint: 'Jenis pergerakan lempeng pada batas transform: ... mendatar.', hintLain: ['Pada batas transform, lempeng bergerak menyamping sejajar permukaan bumi.'] },
      { word: 'SESAR', hint: 'Nama lain patahan mendatar tempat dua lempeng bergesekan menyamping.', hintLain: ['Sebutan lain bagi patahan mendatar, tempat dua lempeng bergesekan menyamping.'] },
    ],
    [
      { word: 'MENDATAR', hint: 'Arah gesekan kedua lempeng pada batas transform: saling bergesekan...', hintLain: ['Arah gesekan kedua lempeng pada batas transform, yaitu sejajar permukaan.'] },
      { word: 'PATAHAN', hint: 'Retakan panjang di kerak bumi akibat gesekan mendatar lempeng.', hintLain: ['Retakan panjang di kerak akibat dua lempeng bergesekan menyamping.'] },
    ],
    [
      { word: 'BERGESEK', hint: 'Dua lempeng pada batas transform saling ... mendatar.', hintLain: ['Kedua lempeng bersentuhan dan saling menggosok menyamping di batas transform.'] },
      { word: 'PATAH', hint: 'Batuan di sepanjang sesar dapat ... dan melepaskan energi gempa.', hintLain: ['Ketika batuan di sepanjang sesar tak kuat lagi menahan, energi gempa terlepas.'] },
    ],
    [
      { word: 'HORIZONTAL', hint: 'Arah gesekan kedua lempeng pada batas transform, yaitu mendatar.', hintLain: ['Arah gesekan kedua lempeng pada batas transform: sejajar permukaan bumi.'] },
      { word: 'SEJAJAR', hint: 'Posisi dua garis yang arahnya sama dan tidak pernah berpotongan.', hintLain: ['Kedudukan dua garis yang arahnya sama dan tak pernah bertemu.'] },
    ],
    [
      { word: 'REKAH', hint: 'Keadaan tanah yang terbelah-belah akibat gesekan lempeng mendatar.', hintLain: ['Keadaan tanah yang pecah-pecah akibat gesekan lempeng mendatar.'] },
      { word: 'TEGANGAN', hint: 'Yang menumpuk pada batuan akibat gesekan yang terus-menerus.', hintLain: ['Yang terkumpul pada batuan karena gesekan terus-menerus, lalu dilepas saat retak.'] },
    ],
  ],
};

/** Seluruh varian milik satu zona (kosong bila zona tidak ada di bank). */
export function varianZona(zoneIdx: number): KataGerbang[][] {
  return ZONE_GATE_BANK[zoneIdx] ?? [];
}

/**
 * Petunjuk yang dibaca seorang siswa untuk satu kata.
 *
 * Kalimatnya dipilih dari `hint` dan `hintLain` memakai mesin berbenih yang
 * sama dengan pengundian kata, sehingga:
 *
 *   - BERBEDA antar-siswa - dua siswa yang kebetulan mendapat kata yang sama
 *     tetap membaca kalimat soal yang berbeda,
 *   - TETAP bagi siswa yang sama - menyegarkan halaman tidak mengubah kalimatnya,
 *     jadi tidak ada yang bisa mengundi ulang sampai mendapat kalimat termudah,
 *   - JAWABANNYA TIDAK BERUBAH - hanya redaksinya yang berbeda.
 */
export function petunjukUntuk(
  kata: KataGerbang,
  zona: number,
  indeksKata: number,
  userId: string,
): string {
  const pilihan = [kata.hint, ...(kata.hintLain ?? [])];
  if (pilihan.length <= 1) return kata.hint;

  const dipilih = pilihBerbenih(
    pilihan,
    benihDari(`${userId}|petunjuk|${zona}|${indeksKata}|${kata.word}`),
  );
  return dipilih ?? kata.hint;
}

/**
 * Undi satu varian set kata gerbang untuk siswa ini.
 *
 * Memakai mesin berbenih yang sama seperti bank soal (`acakBerbenih` +
 * `benihDari`), sehingga sifatnya:
 *
 *   - BERBEDA antar-siswa — kata yang harus dipecahkan tidak lagi sama semua,
 *   - TETAP bagi siswa yang sama — membuka ulang zona yang sama menghasilkan
 *     kata yang sama, sehingga tidak ada yang bisa "mengundi ulang" dengan
 *     me-refresh halaman, dan
 *   - DAPAT DIPERIKSA guru — dengan benih yang sama, hasilnya dapat dihitung
 *     ulang kapan saja.
 *
 * Bila zona yang diminta tidak ada di bank, dipakai zona 1 sebagai cadangan
 * supaya gerbangnya tidak pernah kosong.
 */
export function undiKataGerbang(zoneIdx: number, userId: string): KataGerbang[] {
  const varian = pilihBerbenih(varianZona(zoneIdx), benihDari(`${userId}|gerbang|${zoneIdx}`));
  if (varian) return varian;

  // Zona yang diminta tidak ada di bank — pakai zona 1 sebagai cadangan supaya
  // gerbangnya tidak pernah kosong. Benihnya memakai penanda zona cadangan,
  // bukan nomor zona yang salah, agar hasilnya tetap dapat diperiksa.
  const cadangan = pilihBerbenih(varianZona(1), benihDari(`${userId}|gerbang|1`));
  return cadangan ?? [];
}
