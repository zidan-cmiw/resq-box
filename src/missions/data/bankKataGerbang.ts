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
  1: [
    // Kerak Bumi.
    //
    // SELURUH kata di zona ini diambil dari materi zona Kerak Bumi sendiri:
    // kerak, lapisan, luar, padat, suhu, kerak benua (granit, ringan, SiAl),
    // kerak samudra (basal, tipis, berat, SiMa), dan tebal.
    [
      { word: 'KERAK', hint: 'Lapisan paling luar bumi tempat kita tinggal, dan paling tipis.', hintLain: ['Bagian terluar bumi yang menjadi tempat berpijak seluruh makhluk hidup.'] },
      { word: 'BENUA', hint: 'Jenis kerak bumi di bawah daratan, tebalnya sampai 100 kilometer.', hintLain: ['Kerak di bawah daratan; paling tebal di antara kedua jenis kerak.'] },
      { word: 'SAMUDRA', hint: 'Jenis kerak bumi di bawah lautan yang tipis (5-15 km), tetapi lebih padat dan berat.', hintLain: ['Kerak di bawah lautan; hanya 5-15 km tetapi paling berat.'] },
    ],
    [
      { word: 'GRANIT', hint: 'Batuan penyusun kerak benua, berwarna terang dan lebih ringan.', hintLain: ['Batuan pembentuk kerak di bawah daratan, bersifat ringan.'] },
      { word: 'BASAL', hint: 'Batuan penyusun kerak samudra, berwarna gelap dan lebih padat.', hintLain: ['Batuan pembentuk kerak di bawah lautan, bersifat padat dan berat.'] },
      { word: 'TIPIS', hint: 'Kerak samudra bersifat ... dibandingkan kerak benua.', hintLain: ['Sifat kerak di bawah lautan: hanya 5-15 kilometer tebalnya.'] },
    ],
    [
      { word: 'TEBAL', hint: 'Kerak benua bersifat ... dibandingkan kerak samudra.', hintLain: ['Sifat kerak di bawah daratan: mencapai 30-100 kilometer.'] },
      { word: 'PADAT', hint: 'Sifat lapisan kerak bumi yang tersusun dari batuan.', hintLain: ['Sifat lapisan terluar bumi karena terbuat dari batuan, bukan zat alir.'] },
      { word: 'BERAT', hint: 'Sifat kerak samudra selain lebih padat, dibandingkan kerak benua.', hintLain: ['Sifat kerak di bawah lautan yang membuatnya tenggelam lebih dalam.'] },
    ],
    [
      { word: 'LAPISAN', hint: 'Kerak bumi disebut sebagai ... paling luar dari bumi.', hintLain: ['Sebutan bagi kerak: bagian teratas yang menyusun tubuh bumi.'] },
      { word: 'SUHU', hint: 'Besaran yang berkisar 25 sampai 500 derajat Celsius di kerak bumi.', hintLain: ['Besaran yang diukur termometer; di kerak bumi nilainya 25-500 derajat.'] },
      { word: 'LUAR', hint: 'Kedudukan kerak bumi: lapisan paling ... dari bumi.', hintLain: ['Kedudukan kerak dibandingkan seluruh lapisan bumi lainnya.'] },
    ],
    [
      { word: 'RINGAN', hint: 'Sifat batuan granit penyusun kerak benua, selain berwarna terang.', hintLain: ['Sifat granit yang membuat kerak benua mengapung di atas kerak samudra.'] },
      { word: 'SIAL', hint: 'Nama lain kerak benua berdasarkan unsur penyusunnya: silika dan aluminium.', hintLain: ['Sebutan kerak benua dari dua unsur pembentuknya, silika dan aluminium.'] },
      { word: 'SIMA', hint: 'Nama lain kerak samudra berdasarkan unsur penyusunnya: silika dan magnesium.', hintLain: ['Sebutan kerak samudra dari dua unsur pembentuknya, silika dan magnesium.'] },
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
      { word: 'ARUS', hint: 'Aliran panas yang terbentuk di dalam mantel karena pemanasan dari bawah.', hintLain: ['Yang mengalir dan berputar di dalam mantel, menjadi tenaga penggerak lempeng.'] },
      { word: 'PANAS', hint: 'Suhu mantel berkisar 1.000 sampai 3.700 derajat Celsius, artinya mantel sangat...', hintLain: ['Keadaan suhu di dalam mantel yang mencapai ribuan derajat Celsius.'] },
    ],
    [
      { word: 'KENTAL', hint: 'Sifat material mantel: sangat ... sehingga mengalir sangat lambat.', hintLain: ['Sifat zat yang mengalir lambat karena partikelnya rapat, seperti material mantel.'] },
      { word: 'BERPUTAR', hint: 'Gerakan aliran panas mantel yang berbalik arah membentuk lingkaran.', hintLain: ['Sifat gerak aliran panas mantel: naik lalu turun kembali membentuk lingkaran.'] },
    ],
    [
      { word: 'MENDIDIH', hint: 'Keadaan air di dalam panci saat dipanaskan, dipakai sebagai perumpamaan arus mantel.', hintLain: ['Perumpamaan arus mantel: seperti air panas yang menggelegak di panci.'] },
      { word: 'PANCI', hint: 'Wadah tempat air direbus, dipakai sebagai perumpamaan arus konveksi mantel.', hintLain: ['Perkakas dapur untuk merebus air, menjadi perumpamaan sel konveksi.'] },
    ],
    [
      { word: 'LEMPENG', hint: 'Bagian kerak bumi yang digerakkan oleh arus panas di dalam mantel.', hintLain: ['Kepingan kerak bumi; arus mantel menjadi mesin penggeraknya.'] },
      { word: 'PENGGERAK', hint: 'Peran arus konveksi mantel bagi pergerakan lempeng bumi: sebagai mesin ...', hintLain: ['Peran arus mantel: menjadi mesin yang menggerakkan lempeng bumi.'] },
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
      { word: 'PUTARAN', hint: 'Gerakan berulang aliran logam cair di inti luar yang membangkitkan magnet.', hintLain: ['Gerak berulang logam cair inti luar; inilah yang menimbulkan medan magnet.'] },
      { word: 'EKSTREM', hint: 'Sifat panas di inti luar yang membuat logam besi dan nikel meleleh.', hintLain: ['Sifat suhu inti luar yang melampaui titik leleh besi dan nikel.'] },
    ],
    [
      { word: 'LOGAM', hint: 'Inti bumi tersusun dari ... besi dan nikel, bukan batuan.', hintLain: ['Bahan penghantar panas dan listrik yang baik, seperti besi dan nikel.'] },
      { word: 'PANAS', hint: 'Suhu inti luar sekitar 5.000 derajat Celsius, artinya sangat...', hintLain: ['Keadaan suhu di inti luar yang mencapai sekitar 5.000 derajat Celsius.'] },
      { word: 'DINAMO', hint: 'Alat pembangkit listrik; perputaran logam inti luar bekerja seperti ini.', hintLain: ['Perumpamaan bagi kerja inti luar: seperti ... raksasa yang berputar.'] },
    ],
    [
      { word: 'RAKSASA', hint: 'Ukuran dinamo yang menggambarkan besarnya medan magnet bumi.', hintLain: ['Sifat dinamo yang dibentuk oleh inti luar bumi: sangat besar.'] },
      { word: 'MATAHARI', hint: 'Bintang yang radiasinya dibelokkan oleh medan magnet bumi.', hintLain: ['Sumber badai radiasi yang ditahan oleh medan magnet bumi.'] },
      { word: 'LINDUNG', hint: 'Medan magnet bumi bertugas ... permukaan dari radiasi angkasa.', hintLain: ['Tugas medan magnet bumi: menahan radiasi angkasa agar tidak sampai ke permukaan.'] },
    ],
    [
      { word: 'MEDAN', hint: 'Wilayah yang dipengaruhi sebuah gaya, misalnya gaya magnet bumi.', hintLain: ['Ruang di sekitar magnet yang masih terpengaruh gaya tariknya.'] },
      { word: 'BADAI', hint: 'Sebutan bagi gangguan radiasi hebat yang datang dari matahari.', hintLain: ['Gangguan radiasi matahari yang dibelokkan medan magnet bumi.'] },
      { word: 'PERISAI', hint: 'Sebutan bagi medan magnet bumi karena melindungi dari radiasi angkasa.', hintLain: ['Sebutan bagi pelindung alami bumi dari radiasi angkasa.'] },
    ],
    [
      { word: 'RADIASI', hint: 'Pancaran berbahaya dari angkasa yang dilindungi medan magnet bumi.', hintLain: ['Pancaran berbahaya matahari yang dibelokkan oleh medan magnet bumi.'] },
      { word: 'CAIR', hint: 'Wujud logam di inti luar, berbeda dengan inti dalam yang padat.', hintLain: ['Wujud zat yang mengalir dan tidak mempertahankan bentuknya.'] },
      { word: 'SUHU', hint: 'Besaran yang mencapai 5.000 derajat Celsius di inti luar bumi.', hintLain: ['Besaran yang diukur dengan termometer dan menyatakan derajat panas.'] },
    ],
  ],
  4: [
    // Inti Dalam — sengaja HANYA 2 kata.
    [
      { word: 'KRISTAL', hint: 'Bentuk susunan logam besi dan nikel di inti dalam.', hintLain: ['Susunan atom logam yang teratur rapat di inti dalam.'] },
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
      { word: 'ATOM', hint: 'Bagian terkecil penyusun besi yang dikunci rapat oleh tekanan di inti dalam.', hintLain: ['Bagian terkecil penyusun logam; di inti dalam terkuci rapat oleh tekanan.'] },
    ],
    [
      { word: 'INTI', hint: 'Bagian paling tengah dari sesuatu, misalnya bagian terdalam bumi.', hintLain: ['Bagian paling tengah, misalnya pada buah atau pada bumi.'] },
      { word: 'NOL', hint: 'Nilai gravitasi tepat di pusat bumi, karena tarikan dari segala arah saling meniadakan.', hintLain: ['Nilai gaya tarik di titik pusat bumi: karena saling meniadakan.'] },
    ],
    [
      { word: 'NIKEL', hint: 'Logam penyusun inti bumi yang berpasangan dengan besi.', hintLain: ['Logam berwarna keperakan yang menyertai besi di pusat bumi.'] },
      { word: 'DAHSYAT', hint: 'Sifat tekanan di inti dalam yang membuat besi tetap padat.', hintLain: ['Sifat tekanan dari seluruh bumi yang mengunci besi tetap padat.'] },
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
      { word: 'INDONESIA', hint: 'Negara kepulauan yang terbentuk dari jalur subduksi lempeng aktif.', hintLain: ['Kepulauan yang lahir dari tumbukan lempeng, sehingga rawan gempa dan tsunami.'] },
      { word: 'GEMPA', hint: 'Getaran yang ditimbulkan oleh tumbukan dua lempeng kulit bumi.', hintLain: ['Getaran kuat akibat lempeng yang saling bertumbukan, dapat memicu tsunami.'] },
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
