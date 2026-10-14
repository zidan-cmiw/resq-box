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
  hint: string;
}

/** Bank varian: indeks zona -> daftar varian -> daftar kata. */
export const ZONE_GATE_BANK: Record<number, KataGerbang[][]> = {
  0: [
    // Permukaan Bumi
    [
      { word: 'KERAK', hint: 'Lapisan paling luar bumi tempat kita tinggal dan paling tipis.' },
      { word: 'BENUA', hint: 'Daratan luas tempat kita hidup di atas permukaan bumi.' },
      { word: 'BATUAN', hint: 'Benda padat alami yang menyusun lapisan kerak bumi.' },
    ],
    [
      { word: 'LITOSFER', hint: 'Nama lain lapisan batuan paling luar bumi, tempat seluruh kehidupan berlangsung.' },
      { word: 'DARATAN', hint: 'Bagian permukaan bumi yang tidak tertutup air.' },
      { word: 'MINERAL', hint: 'Bahan padat alami pembentuk batuan, misalnya kuarsa dan feldspar.' },
    ],
    [
      { word: 'PERMUKAAN', hint: 'Bagian bumi yang paling atas, tempat kita berpijak dan bernapas.' },
      { word: 'LAUTAN', hint: 'Bagian permukaan bumi yang tertutup air asin dan paling luas.' },
      { word: 'TANAH', hint: 'Lapisan paling atas kerak bumi tempat tumbuhan berakar.' },
    ],
    [
      { word: 'LEMBAH', hint: 'Bagian permukaan bumi yang lebih rendah di antara dua lereng.' },
      { word: 'GUNUNG', hint: 'Bentuk permukaan bumi yang menjulang tinggi ke atas.' },
      { word: 'SUNGAI', hint: 'Alur alami di permukaan bumi tempat air mengalir menuju laut.' },
    ],
    [
      { word: 'PEGUNUNGAN', hint: 'Bentang alam yang tersusun dari rangkaian gunung berderet memanjang.' },
      { word: 'DATARAN', hint: 'Wilayah permukaan bumi yang relatif rata dan terbentang luas.' },
      { word: 'PANTAI', hint: 'Bagian permukaan bumi yang menjadi batas antara daratan dan laut.' },
    ],
    [
      { word: 'BUKIT', hint: 'Bentang alam yang lebih rendah daripada gunung, namun lebih tinggi daripada dataran.' },
      { word: 'JURANG', hint: 'Bagian permukaan bumi yang sangat dalam dan curam, biasanya di pegunungan.' },
      { word: 'PULAU', hint: 'Daratan yang dikelilingi air dan terpisah dari daratan utama.' },
    ],
  ],
  1: [
    // Kerak Bumi
    [
      { word: 'KERAK', hint: 'Lapisan paling luar bumi tempat kita tinggal, dan merupakan lapisan yang paling tipis.' },
      { word: 'BENUA', hint: 'Jenis kerak bumi di bawah daratan yang memiliki ketebalan mencapai 100 kilometer.' },
      { word: 'SAMUDRA', hint: 'Jenis kerak bumi di bawah lautan yang tipis (5-15 km), tetapi lebih padat dan berat.' },
    ],
    [
      { word: 'LITOSFER', hint: 'Lapisan batuan paling luar bumi, tersusun dari kerak dan bagian atas mantel.' },
      { word: 'DARATAN', hint: 'Wilayah kerak bumi yang letaknya lebih tinggi daripada permukaan laut.' },
      { word: 'LAUTAN', hint: 'Wilayah kerak bumi yang tertutup air, keraknya lebih tipis tetapi lebih berat.' },
    ],
    [
      { word: 'TIPIS', hint: 'Kerak samudra bersifat ... dibandingkan kerak benua.' },
      { word: 'GRANIT', hint: 'Batuan penyusun utama kerak benua, berwarna lebih terang dan lebih ringan.' },
      { word: 'BASAL', hint: 'Batuan penyusun utama kerak samudra, berwarna gelap dan lebih padat.' },
    ],
    [
      // Pengetahuan lokal Indonesia — materi yang diminta dosen IPA saat validasi
      // (Indonesia berada di pertemuan lempeng, sehingga rawan gempa).
      { word: 'INDONESIA', hint: 'Negara yang terletak di pertemuan Lempeng Indo-Australia, Eurasia, dan Pasifik.' },
      { word: 'SUMATRA', hint: 'Pulau yang tanahnya subur karena abu vulkanik, tetapi juga rawan gempa.' },
      { word: 'GEMPA', hint: 'Peristiwa yang sering terjadi di Indonesia karena lempengnya saling bertumbukan.' },
    ],
    [
      { word: 'TEBAL', hint: 'Kerak benua bersifat ... dibandingkan kerak samudra.' },
      { word: 'SEDIMEN', hint: 'Batuan yang terbentuk dari endapan material di permukaan kerak.' },
      { word: 'LEMPENG', hint: 'Pecahan besar kerak bumi yang bergerak di atas lapisan yang kental.' },
    ],
    [
      { word: 'KERAS', hint: 'Sifat lapisan paling luar bumi yang membuat kita dapat berpijak di atasnya.' },
      { word: 'SILIKAT', hint: 'Senyawa pembentuk batuan yang banyak menyusun lapisan padat bumi.' },
      { word: 'BATU', hint: 'Benda padat alami yang menyusun lapisan kerak bumi.' },
    ],
    [
      { word: 'LERENG', hint: 'Sisi miring sebuah gunung atau bukit, dari kaki sampai ke puncaknya.' },
      { word: 'TANAH', hint: 'Lapisan paling atas kerak bumi tempat tumbuhan tumbuh dan berakar.' },
      { word: 'LEMPUNG', hint: 'Jenis tanah yang lengket dan kedap air, sering dipakai membuat kerajinan.' },
    ],
  ],
  2: [
    // Mantel Bumi — sengaja HANYA 2 kata, konsisten di semua varian.
    [
      { word: 'MANTEL', hint: 'Lapisan di bawah kerak bumi yang merupakan lapisan paling tebal (2.900 km).' },
      { word: 'KONVEKSI', hint: 'Arus perputaran panas di dalam mantel yang menggerakkan lempeng bumi.' },
    ],
    [
      { word: 'ADONAN', hint: 'Material mantel paling mirip benda kental ini, sehingga dapat mengalir sangat lambat.' },
      { word: 'FLUIDA', hint: 'Wujud material mantel: bukan padat kaku, melainkan ... sangat kental.' },
    ],
    [
      { word: 'SILIKAT', hint: 'Bahan batuan penyusun mantel bumi.' },
      { word: 'PANAS', hint: 'Suhu mantel berkisar 1.000 sampai 3.700 derajat Celsius, artinya mantel sangat...' },
    ],
    [
      { word: 'KENTAL', hint: 'Sifat material mantel: sangat ... sehingga mengalir sangat lambat.' },
      { word: 'ASTENOSFER', hint: 'Lapisan kental di bagian atas mantel, tepat di bawah kerak bumi.' },
    ],
    [
      { word: 'MELELEH', hint: 'Yang terjadi pada batuan bila suhunya melampaui titik leburnya.' },
      { word: 'SIRKULASI', hint: 'Nama lain perputaran aliran panas yang membentuk sel di dalam mantel.' },
    ],
    [
      { word: 'KONDUKSI', hint: 'Perpindahan panas melalui sebuah zat tanpa memindahkan zatnya sendiri.' },
      { word: 'GEOTERMAL', hint: 'Sebutan bagi energi panas yang berasal dari dalam bumi.' },
    ],
  ],
  3: [
    // Inti Luar
    [
      { word: 'NIKEL', hint: 'Bahan yang menjadi penyusun utama lapisan inti bumi adalah besi dan...' },
      { word: 'CAIRAN', hint: 'Inti luar bumi wujudnya berupa...' },
      { word: 'MAGNET', hint: 'Lapisan inti bumi luar menghasilkan medan... yang melindungi bumi dari radiasi matahari.' },
    ],
    [
      { word: 'BESI', hint: 'Logam utama penyusun inti bumi, bersama nikel.' },
      { word: 'LELEHAN', hint: 'Inti luar berupa ... logam, karena suhunya melampaui titik leleh besi.' },
      { word: 'KOMPAS', hint: 'Alat penunjuk arah yang bekerja karena memanfaatkan medan magnet bumi.' },
    ],
    [
      { word: 'LOGAM', hint: 'Inti bumi tersusun dari ... besi dan nikel, bukan batuan.' },
      { word: 'PANAS', hint: 'Suhu inti luar sekitar 5.000 derajat Celsius, artinya sangat...' },
      { word: 'KUTUB', hint: 'Medan magnet bumi memiliki dua ..., yaitu utara dan selatan.' },
    ],
    [
      { word: 'ARUS', hint: 'Logam cair di inti luar membentuk ... listrik yang menghasilkan medan magnet.' },
      { word: 'LISTRIK', hint: 'Jenis aliran yang timbul dari logam cair yang bergerak di inti luar.' },
      { word: 'LINDUNG', hint: 'Medan magnet bumi bertugas ... permukaan dari radiasi angkasa.' },
    ],
    [
      { word: 'MEDAN', hint: 'Wilayah yang dipengaruhi sebuah gaya, misalnya gaya magnet bumi.' },
      { word: 'GEODYNAMO', hint: 'Mekanisme perputaran logam di inti luar yang membangkitkan magnet bumi.' },
      { word: 'PERISAI', hint: 'Sebutan bagi medan magnet bumi karena melindungi dari radiasi angkasa.' },
    ],
    [
      { word: 'LEBUR', hint: 'Hancur menjadi zat alir karena panas yang sangat tinggi.' },
      { word: 'CAIR', hint: 'Wujud logam di inti luar, berbeda dengan inti dalam yang padat.' },
      { word: 'SUHU', hint: 'Besaran yang mencapai 5.000 derajat Celsius di inti luar bumi.' },
    ],
  ],
  4: [
    // Inti Dalam — sengaja HANYA 2 kata.
    [
      { word: 'INTIDALAM', hint: 'Lapisan terdalam planet bumi pada kedalaman 6.371 kilometer.' },
      { word: 'PADAT', hint: 'Inti dalam berbentuk sangat ... karena tekanan yang sangat besar dari segala arah.' },
    ],
    [
      { word: 'BESI', hint: 'Logam utama penyusun bola inti dalam bumi.' },
      { word: 'TEKANAN', hint: 'Penyebab inti dalam tetap padat walaupun suhunya 6.000 derajat Celsius.' },
    ],
    [
      { word: 'BOLA', hint: 'Bentuk inti dalam bumi, terselubung oleh inti luar.' },
      { word: 'PUSAT', hint: 'Letak inti dalam: di ... bumi.' },
    ],
    [
      { word: 'GRAVITASI', hint: 'Gaya yang menarik segala sesuatu menuju pusat bumi.' },
      { word: 'TERDALAM', hint: 'Inti dalam adalah lapisan yang paling ... di seluruh bumi.' },
    ],
    [
      { word: 'INTI', hint: 'Bagian paling tengah dari sesuatu, misalnya bagian terdalam bumi.' },
      { word: 'PADUAN', hint: 'Campuran dua logam atau lebih, seperti besi dan nikel di pusat bumi.' },
    ],
    [
      { word: 'NIKEL', hint: 'Logam penyusun inti bumi yang berpasangan dengan besi.' },
      { word: 'MAMPAT', hint: 'Keadaan zat yang partikelnya sangat rapat karena tekanan yang besar.' },
    ],
  ],
  5: [
    // Batas Divergen
    [
      { word: 'PANGEA', hint: 'Nama superbenua raksasa purba yang dulunya menyatukan seluruh daratan bumi.' },
      { word: 'MENJAUH', hint: 'Arah pergerakan dua lempeng tektonik pada batas divergen saling...' },
      { word: 'MAGMA', hint: 'Batuan cair panas dari mantel bumi yang menerobos naik mengisi celah rekahan lempeng.' },
    ],
    [
      { word: 'DIVERGEN', hint: 'Nama batas lempeng tempat dua lempeng bergerak saling menjauh.' },
      { word: 'CELAH', hint: 'Ruang terbuka yang terbentuk saat dua lempeng saling menjauh, lalu terisi magma.' },
      { word: 'REKAHAN', hint: 'Retakan pada kerak bumi tempat magma dapat naik ke permukaan.' },
    ],
    [
      { word: 'MEMISAH', hint: 'Arti kata divergen: kedua lempeng saling...' },
      { word: 'PUNGGUNG', hint: 'Bentuk dasar samudra yang menjulang di batas divergen: ... tengah samudra.' },
      { word: 'SAMUDRA', hint: 'Batas divergen paling banyak terdapat di dasar...' },
    ],
    [
      { word: 'TERBELAH', hint: 'Daratan Pangea perlahan ... menjadi benua-benua yang kita kenal sekarang.' },
      { word: 'TENGAH', hint: 'Batas divergen di dasar samudra disebut punggung ... samudra.' },
      { word: 'LAVA', hint: 'Magma yang sudah mencapai permukaan bumi disebut...' },
    ],
    [
      { word: 'MELEBAR', hint: 'Bertambah luas, seperti dasar samudra yang terus memanjang.' },
      { word: 'RETAK', hint: 'Keadaan kerak yang terbelah akibat gaya yang menariknya memisah.' },
      { word: 'ZONA', hint: 'Sebutan untuk daerah atau kawasan yang memiliki ciri tertentu.' },
    ],
    [
      { word: 'MENGAPUNG', hint: 'Keadaan lempeng yang berada di atas lapisan mantel yang kental.' },
      { word: 'GERAK', hint: 'Perpindahan posisi, seperti lempeng yang berpindah sangat lambat.' },
      { word: 'BENUA', hint: 'Daratan luas, yang dahulu menyatu lalu saling menjauh.' },
    ],
  ],
  6: [
    // Batas Konvergen — sengaja HANYA 2 kata.
    [
      { word: 'PALUNG', hint: 'Jurang sempit yang sangat dalam di dasar samudra akibat penunjaman lempeng.' },
      { word: 'MERAPI', hint: 'Contoh gunung berapi aktif di Indonesia yang terbentuk dari jalur subduksi lempeng.' },
    ],
    [
      { word: 'SUBDUKSI', hint: 'Nama proses saat lempeng samudra menunjam ke bawah lempeng benua.' },
      { word: 'TUMBUKAN', hint: 'Batas konvergen terjadi karena dua lempeng mengalami...' },
    ],
    [
      { word: 'MENUNJAM', hint: 'Arah gerak lempeng samudra terhadap lempeng benua pada zona subduksi.' },
      { word: 'LEMPENG', hint: 'Pecahan besar kerak bumi yang bergerak dan bertumbukan di batas konvergen.' },
    ],
    [
      // Tumbukan dua lempeng BENUA — materi yang diminta dosen IPA saat validasi.
      // Dua lempeng benua sama-sama ringan sehingga tidak ada yang menunjam,
      // dan hasilnya pegunungan lipatan, bukan gunung api.
      { word: 'HIMALAYA', hint: 'Pegunungan lipatan tertinggi di dunia, hasil tumbukan dua lempeng BENUA.' },
      { word: 'LIPATAN', hint: 'Bentuk pegunungan dari tumbukan dua lempeng benua, bukan gunung api.' },
    ],
    [
      { word: 'TABRAKAN', hint: 'Batas konvergen terjadi karena ... antara dua lempeng tektonik.' },
      { word: 'TINGGI', hint: 'Tumbukan dua lempeng benua mengangkat daratan menjadi pegunungan yang sangat...' },
    ],
    [
      { word: 'GUNUNG', hint: 'Bentuk permukaan bumi yang menjulang tinggi dan sering berbentuk kerucut.' },
      { word: 'PEGUNUNGAN', hint: 'Rangkaian gunung berderet memanjang, seperti hasil tumbukan lempeng.' },
    ],
    [
      { word: 'DANGKAL', hint: 'Sifat gempa yang pusatnya dekat permukaan, sehingga getarannya kuat.' },
      { word: 'MENDEKAT', hint: 'Arah gerak dua lempeng pada batas konvergen, yaitu saling...' },
    ],
  ],
  7: [
    // Batas Transform — sengaja HANYA 2 kata.
    [
      { word: 'TRANSFORM', hint: 'Batas lempeng tektonik di mana dua lempeng saling bergesekan mendatar berlawanan arah.' },
      { word: 'SANANDREAS', hint: 'Patahan mendatar terkenal di California yang membentang sepanjang 1.200 kilometer.' },
    ],
    [
      { word: 'GESERAN', hint: 'Jenis pergerakan lempeng pada batas transform: ... mendatar.' },
      { word: 'SESAR', hint: 'Nama lain patahan mendatar tempat dua lempeng bergesekan menyamping.' },
    ],
    [
      { word: 'MENDATAR', hint: 'Arah gesekan kedua lempeng pada batas transform: saling bergesekan...' },
      { word: 'PATAHAN', hint: 'Retakan panjang di kerak bumi akibat gesekan mendatar lempeng.' },
    ],
    [
      { word: 'BERGESEK', hint: 'Dua lempeng pada batas transform saling ... mendatar.' },
      { word: 'PATAH', hint: 'Batuan di sepanjang sesar dapat ... dan melepaskan energi gempa.' },
    ],
    [
      { word: 'HORIZONTAL', hint: 'Arah gesekan kedua lempeng pada batas transform, yaitu mendatar.' },
      { word: 'SEJAJAR', hint: 'Posisi dua garis yang arahnya sama dan tidak pernah berpotongan.' },
    ],
    [
      { word: 'REKAH', hint: 'Keadaan tanah yang terbelah-belah akibat gesekan lempeng mendatar.' },
      { word: 'TEGANGAN', hint: 'Yang menumpuk pada batuan akibat gesekan yang terus-menerus.' },
    ],
  ],
};

/** Seluruh varian milik satu zona (kosong bila zona tidak ada di bank). */
export function varianZona(zoneIdx: number): KataGerbang[][] {
  return ZONE_GATE_BANK[zoneIdx] ?? [];
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
