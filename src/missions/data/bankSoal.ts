// ── src/missions/data/bankSoal.ts ────────────────────────────────────────────
// BANK SOAL RESQ-BOX — tiga tingkat kesulitan per area.
//
// ═══════════════════════════════════════════════════════════════════════════
// MENGAPA BANK SOAL, BUKAN SOAL YANG DIGENERATE
// ═══════════════════════════════════════════════════════════════════════════
//
//   Dosen pembimbing menyarankan mengganti "soal yang digenerate" dengan bank
//   soal yang disiapkan lebih dahulu. Alasannya kuat:
//
//     - Kunci jawaban dapat ditinjau guru. Soal hasil generate bisa saja salah
//       kunci, dan nilai siswa ikut salah.
//     - Rapor tetap adil: tiap siswa menerima komposisi tingkat kesulitan yang
//       sama (lihat `undiSoal`), hanya soalnya yang berbeda.
//     - Tidak memerlukan API sama sekali, jadi tidak ada biaya dan tetap
//       berjalan saat internet sekolah mati.
//
// ═══════════════════════════════════════════════════════════════════════════
// ATURAN PENULISAN SOAL
// ═══════════════════════════════════════════════════════════════════════════
//
//   1. Tiap soal WAJIB punya tepat 4 pilihan dan tepat SATU kunci benar.
//      Ada uji otomatis yang memeriksa ini (`__tests__/bankSoal.test.ts`),
//      sehingga kesalahan ketik tertangkap sebelum sampai ke siswa.
//
//   2. Tiap soal WAJIB punya `penjelasan`. Siswa harus tahu MENGAPA, bukan
//      hanya benar/salah.
//
//   3. Tingkat kesulitan bukan soal panjang kalimat, melainkan jenis berpikir:
//        mudah  = mengingat / mengenali
//        sedang = memahami / menerapkan
//        sulit  = menganalisis / menjelaskan sebab-akibat
//      Ini menjawab kritik dosen bahwa "pertanyaannya masih terlalu gampang".
//
//   4. Soal antar-siswa berbeda REDAKSI dan KONTEKSNYA, tetapi kuncinya tetap
//      sama konsepnya. Satu konsep dapat menjadi beberapa soal hanya dengan
//      mengganti konteks (Merapi / Semeru / Krakatau, atau dibalik dari "apa"
//      menjadi "mengapa").
//
//   5. Soal harus berasal dari materi yang memang diajarkan di area itu.
//
// ═══════════════════════════════════════════════════════════════════════════
// STATUS BANK INI — PENTING DIBACA SEBELUM MENAMBAH SOAL
// ═══════════════════════════════════════════════════════════════════════════
//
//   YANG SUDAH DIPAKAI SISWA
//     Enam area Level 2 (54 soal). Diundi tiga soal per area, tersambung ke
//     `TectonicGame.tsx`.
//
//   YANG BELUM DIPAKAI
//     Delapan zona Level 1 (72 soal). Pemilik proyek memutuskan Level 1 tetap
//     memakai TEKA-TEKI KATA (Wordle), bukan pilihan ganda — karena itu soal
//     pilihan ganda Level 1 di sini TIDAK tampil ke siswa.
//
//     Materi yang diminta dosen IPA saat validasi (tumbukan dua lempeng benua,
//     Himalaya, pegunungan lipatan, pengetahuan lokal Indonesia) karena itu
//     ditegakkan di bank KATA GERBANG — `bankKataGerbang.ts` — supaya benar-
//     benar sampai ke siswa pada format yang dipakai Level 1.
//
//     Soal Level 1 di sini disimpan sebagai cadangan: sudah lengkap, sudah
//     diuji, siap dipakai bila suatu saat Level 1 memerlukan kuis pilihan
//     ganda. Menghapusnya berarti membuang materi yang sudah ditulis dan
//     ditinjau, jadi lebih baik disimpan dengan status yang jelas.
//
//   Setiap area menyediakan ketiga tingkat (3 mudah + 3 sedang + 3 sulit).
//   Ada uji otomatis yang menegakkan itu, sehingga menambah soal tidak dapat
//   diam-diam membuat pembagian tingkatnya timpang.

export type TingkatKesulitan = 'mudah' | 'sedang' | 'sulit';

/** Urutan tingkat dari yang paling ringan — dipakai saat membagi undian. */
export const URUTAN_TINGKAT: TingkatKesulitan[] = ['mudah', 'sedang', 'sulit'];

export interface OpsiSoal {
  /** 'a' | 'b' | 'c' | 'd' */
  id: string;
  teks: string;
  benar?: boolean;
}

export interface Soal {
  /** Unik di seluruh bank, mis. 'soal-mantel-mudah-1'. */
  id: string;
  /** Id area pemilik soal: id zona Level 1, atau id area Level 2. */
  area: string;
  tingkat: TingkatKesulitan;
  pertanyaan: string;
  opsi: OpsiSoal[];
  /** Mengapa jawabannya demikian — selalu diisi. */
  penjelasan: string;
  /** Petunjuk singkat yang muncul bila siswa menjawab salah (opsional). */
  petunjuk?: string;
}

/** Semua soal yang terdaftar di bank. */
export const BANK_SOAL: Soal[] = [
  // ══════════════════════════════════════════════════════════════════════════
  // AREA: KERAK BUMI (Level 1, zona 'crust')
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'soal-crust-mudah-1',
    area: 'crust',
    tingkat: 'mudah',
    pertanyaan: 'Lapisan bumi paling luar, tempat kita tinggal dan berpijak, disebut...',
    opsi: [
      { id: 'a', teks: 'Kerak bumi', benar: true },
      { id: 'b', teks: 'Mantel bumi' },
      { id: 'c', teks: 'Inti luar' },
      { id: 'd', teks: 'Inti dalam' },
    ],
    penjelasan:
      'Kerak bumi adalah lapisan paling luar dari struktur bumi. Ketebalannya hanya sebagian kecil dari seluruh tebal bumi, tetapi seluruh kehidupan berlangsung di atasnya.',
  },
  {
    id: 'soal-crust-mudah-2',
    area: 'crust',
    tingkat: 'mudah',
    pertanyaan: 'Kerak bumi tersusun dari dua jenis kerak yang berbeda, yaitu...',
    opsi: [
      { id: 'a', teks: 'Kerak benua dan kerak samudra', benar: true },
      { id: 'b', teks: 'Kerak panas dan kerak dingin' },
      { id: 'c', teks: 'Kerak basah dan kerak kering' },
      { id: 'd', teks: 'Kerak tua dan kerak muda' },
    ],
    penjelasan:
      'Kerak bumi terdiri atas kerak benua (lebih tebal) dan kerak samudra (lebih tipis). Keduanya berbeda ketebalan, susunan batuan, dan beratnya.',
  },
  {
    id: 'soal-crust-mudah-3',
    area: 'crust',
    tingkat: 'mudah',
    pertanyaan: 'Kerak samudra jauh lebih tipis daripada kerak benua. Tebalnya kira-kira...',
    opsi: [
      { id: 'a', teks: '5 sampai 15 kilometer', benar: true },
      { id: 'b', teks: '30 sampai 100 kilometer' },
      { id: 'c', teks: '660 sampai 2.900 kilometer' },
      { id: 'd', teks: '2.900 sampai 5.150 kilometer' },
    ],
    penjelasan:
      'Kerak samudra hanya setebal 5–15 km, sedangkan kerak benua 30–100 km. Jadi kerak samudra jauh lebih tipis, walaupun batuannya lebih berat.',
  },
  {
    id: 'soal-crust-sedang-1',
    area: 'crust',
    tingkat: 'sedang',
    pertanyaan:
      'Kerak samudra lebih tipis, tetapi justru lebih berat daripada kerak benua. Mengapa demikian?',
    opsi: [
      { id: 'a', teks: 'Karena batuannya lebih padat, sehingga lebih berat untuk ukuran yang sama', benar: true },
      { id: 'b', teks: 'Karena usianya lebih tua sehingga bertambah berat' },
      { id: 'c', teks: 'Karena berada di bawah air, sehingga airnya menambah berat' },
      { id: 'd', teks: 'Karena tidak terkena sinar matahari' },
    ],
    penjelasan:
      'Berat tidak ditentukan oleh tebal, melainkan oleh kerapatan (massa jenis) batuan. Batuan kerak samudra lebih padat daripada batuan kerak benua.',
    petunjuk: 'Ingat: yang menentukan berat bukan seberapa tebal, melainkan seberapa padat batuannya.',
  },
  {
    id: 'soal-crust-sedang-2',
    area: 'crust',
    tingkat: 'sedang',
    pertanyaan:
      'Bagaimana para ilmuwan dapat mengetahui susunan lapisan di dalam bumi, padahal belum ada yang berhasil menggali sampai ke sana?',
    opsi: [
      { id: 'a', teks: 'Dengan merekam gelombang gempa bumi yang merambat melewati lapisan-lapisan itu', benar: true },
      { id: 'b', teks: 'Dengan menebak dari bentuk gunung di permukaan' },
      { id: 'c', teks: 'Dengan mengukur suhu udara di permukaan bumi' },
      { id: 'd', teks: 'Dengan memakai pesawat yang terbang sangat tinggi' },
    ],
    penjelasan:
      'Gelombang gempa merambat melalui seluruh bagian bumi. Kecepatan dan arah rambatnya berubah saat melewati lapisan yang berbeda, dan dari perubahan itu ilmuwan menyusun gambaran lapisan dalam bumi.',
  },
  {
    id: 'soal-crust-sedang-3',
    area: 'crust',
    tingkat: 'sedang',
    pertanyaan:
      'Suhu di dalam bumi makin panas seiring bertambahnya kedalaman. Pada bagian paling bawah kerak bumi, suhunya dapat mencapai sekitar...',
    opsi: [
      { id: 'a', teks: '500 derajat Celsius', benar: true },
      { id: 'b', teks: '5 derajat Celsius' },
      { id: 'c', teks: '50 derajat Celsius' },
      { id: 'd', teks: '5.000 derajat Celsius' },
    ],
    penjelasan:
      'Suhu kerak bumi berkisar 25°C di permukaan hingga sekitar 500°C di bagian bawahnya. Suhu 5.000°C baru dijumpai jauh di dalam, yaitu di inti bumi.',
  },
  {
    id: 'soal-crust-sulit-1',
    area: 'crust',
    tingkat: 'sulit',
    pertanyaan:
      'Ketika kerak samudra dan kerak benua bertumbukan, kerak samudra yang menunjam ke bawah. Mengapa bukan kerak benua yang menunjam?',
    opsi: [
      { id: 'a', teks: 'Karena kerak samudra lebih padat, sehingga lebih berat dan tenggelam ke bawah', benar: true },
      { id: 'b', teks: 'Karena kerak benua lebih tua sehingga lebih rapuh' },
      { id: 'c', teks: 'Karena kerak samudra lebih tipis sehingga mudah patah' },
      { id: 'd', teks: 'Karena kerak benua lebih dingin sehingga mengeras' },
    ],
    penjelasan:
      'Pada tumbukan lempeng, yang menunjam adalah lempeng yang massa jenisnya lebih besar. Kerak samudra lebih padat, sehingga tenggelam di bawah kerak benua yang lebih ringan.',
  },
  {
    id: 'soal-crust-sulit-2',
    area: 'crust',
    tingkat: 'sulit',
    pertanyaan:
      'Mengapa gempa dan letusan gunung api lebih sering terjadi pada kerak yang tipis dibanding kerak yang tebal?',
    opsi: [
      { id: 'a', teks: 'Karena kerak yang tipis lebih mudah patah dan lebih mudah ditembus magma dari dalam bumi', benar: true },
      { id: 'b', teks: 'Karena kerak yang tipis suhunya selalu lebih dingin' },
      { id: 'c', teks: 'Karena kerak yang tipis tidak dilindungi air laut' },
      { id: 'd', teks: 'Karena kerak yang tipis selalu lebih tua usianya' },
    ],
    penjelasan:
      'Kerak yang tipis lebih lemah terhadap tekanan dari dalam bumi, sehingga lebih mudah retak (menyebabkan gempa) dan lebih mudah dilewati magma (menyebabkan letusan).',
  },
  {
    id: 'soal-crust-sulit-3',
    area: 'crust',
    tingkat: 'sulit',
    pertanyaan:
      'Di bawah kerak bumi terdapat lapisan yang bersifat kental (astenosfer). Apa peran lapisan itu bagi lempeng bumi?',
    opsi: [
      { id: 'a', teks: 'Menjadi alas yang memungkinkan lempeng bergerak perlahan di atasnya', benar: true },
      { id: 'b', teks: 'Menahan lempeng agar tidak pernah bergerak' },
      { id: 'c', teks: 'Menyerap seluruh panas yang keluar dari inti bumi' },
      { id: 'd', teks: 'Menjadi tempat hidup makhluk di dalam bumi' },
    ],
    penjelasan:
      'Astenosfer bersifat kental dan mampu mengalir sangat lambat. Karena itulah lempeng di atasnya dapat bergerak, walaupun sangat lambat.',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // AREA: MANTEL BUMI (Level 1, zona 'mantle')
  // Soal di sini mengikuti materi terbaru: material mantel berwujud FLUIDA
  // KENTAL seperti adonan, bukan batuan padat yang kaku.
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'soal-mantle-mudah-1',
    area: 'mantle',
    tingkat: 'mudah',
    pertanyaan: 'Lapisan bumi yang paling tebal adalah...',
    opsi: [
      { id: 'a', teks: 'Mantel bumi', benar: true },
      { id: 'b', teks: 'Kerak bumi' },
      { id: 'c', teks: 'Inti luar' },
      { id: 'd', teks: 'Inti dalam' },
    ],
    penjelasan:
      'Mantel bumi setebal sekitar 2.900 km, menjadikannya lapisan tertebal di bumi. Kerak bumi jauh lebih tipis.',
  },
  {
    id: 'soal-mantle-mudah-2',
    area: 'mantle',
    tingkat: 'mudah',
    pertanyaan: 'Ketebalan mantel bumi sekitar...',
    opsi: [
      { id: 'a', teks: '2.900 kilometer', benar: true },
      { id: 'b', teks: '15 kilometer' },
      { id: 'c', teks: '100 kilometer' },
      { id: 'd', teks: '6.371 kilometer' },
    ],
    penjelasan:
      'Mantel membentang dari kedalaman sekitar 660 km sampai 2.900 km, dengan ketebalan sekitar 2.900 km.',
  },
  {
    id: 'soal-mantle-mudah-3',
    area: 'mantle',
    tingkat: 'mudah',
    pertanyaan: 'Suhu material di mantel bumi berkisar antara...',
    opsi: [
      { id: 'a', teks: '1.000 derajat Celsius hingga 3.700 derajat Celsius', benar: true },
      { id: 'b', teks: '0 derajat Celsius hingga 25 derajat Celsius' },
      { id: 'c', teks: '25 derajat Celsius hingga 500 derajat Celsius' },
      { id: 'd', teks: '5.000 derajat Celsius hingga 6.000 derajat Celsius' },
    ],
    penjelasan:
      'Suhu mantel berkisar 1.000°C di tepi luarnya hingga sekitar 3.700°C di bagian terdalam. Suhu di atas 5.000°C baru terdapat di inti bumi.',
  },
  {
    id: 'soal-mantle-sedang-1',
    area: 'mantle',
    tingkat: 'sedang',
    pertanyaan: 'Bagaimana wujud material mantel bumi?',
    opsi: [
      { id: 'a', teks: 'Fluida sangat kental seperti adonan, sehingga dapat mengalir walau sangat lambat', benar: true },
      { id: 'b', teks: 'Batuan padat yang benar-benar kaku dan tidak dapat mengalir' },
      { id: 'c', teks: 'Air encer yang mengalir dengan cepat' },
      { id: 'd', teks: 'Gas panas yang memenuhi rongga di bawah kerak' },
    ],
    penjelasan:
      'Material mantel berwujud fluida kental — tidak padat kaku, dan tidak pula encer seperti air. Karena sangat kental, ia mengalir sangat lambat, hanya beberapa sentimeter per tahun.',
  },
  {
    id: 'soal-mantle-sedang-2',
    area: 'mantle',
    tingkat: 'sedang',
    pertanyaan: 'Arus konveksi di dalam mantel bumi terjadi karena...',
    opsi: [
      { id: 'a', teks: 'Material panas naik, lalu mendingin dan turun kembali, sehingga membentuk siklus berputar', benar: true },
      { id: 'b', teks: 'Material mantel mengalir satu arah saja dan tidak pernah kembali' },
      { id: 'c', teks: 'Angin dari permukaan meniup material mantel' },
      { id: 'd', teks: 'Air laut merembes masuk ke dalam mantel' },
    ],
    penjelasan:
      'Konveksi adalah siklus tertutup: material panas memuai lalu naik, mendingin di dekat kerak, menjadi lebih rapat, lalu turun kembali. Siklus inilah yang menggerakkan lempeng.',
  },
  {
    id: 'soal-mantle-sedang-3',
    area: 'mantle',
    tingkat: 'sedang',
    pertanyaan: 'Mantel bumi sering disebut sebagai "mesin penggerak lempeng bumi". Mengapa?',
    opsi: [
      { id: 'a', teks: 'Karena arus konveksi di dalamnya menyeret lempeng yang berada di atasnya', benar: true },
      { id: 'b', teks: 'Karena mantel menarik lempeng dengan gaya magnet' },
      { id: 'c', teks: 'Karena mantel mendorong lempeng dengan semburan angin' },
      { id: 'd', teks: 'Karena lempeng menempel mati pada mantel sehingga ikut berputar' },
    ],
    penjelasan:
      'Arus konveksi mantel bergerak seperti ban berjalan yang sangat lambat. Lempeng yang mengapung di atasnya ikut terseret, sehingga berpindah tempat.',
  },
  {
    id: 'soal-mantle-sulit-1',
    area: 'mantle',
    tingkat: 'sulit',
    pertanyaan:
      'Arus konveksi mantel disebut sebagai siklus tertutup, bukan aliran satu arah. Apa yang membuktikannya?',
    opsi: [
      { id: 'a', teks: 'Material yang naik di satu tempat akan turun kembali di tempat lain setelah mendingin', benar: true },
      { id: 'b', teks: 'Material mantel berhenti mengalir pada malam hari' },
      { id: 'c', teks: 'Material mantel hanya bergerak ke atas dan tidak pernah turun' },
      { id: 'd', teks: 'Material mantel tidak pernah berpindah tempat sama sekali' },
    ],
    penjelasan:
      'Kalau konveksi hanya satu arah, lama-kelamaan seluruh material akan menumpuk di satu tempat. Kenyataannya material yang naik akan mendingin, menjadi lebih rapat, lalu tenggelam kembali — itulah siklusnya.',
  },
  {
    id: 'soal-mantle-sulit-2',
    area: 'mantle',
    tingkat: 'sulit',
    pertanyaan:
      'Mengapa bagian mantel yang dekat inti bumi bergerak naik, sedangkan yang dekat kerak bergerak turun?',
    opsi: [
      { id: 'a', teks: 'Karena material memuai saat panas sehingga lebih ringan, dan menyusut saat mendingin sehingga lebih rapat', benar: true },
      { id: 'b', teks: 'Karena tertarik oleh gravitasi bulan' },
      { id: 'c', teks: 'Karena terdorong oleh angin dari permukaan' },
      { id: 'd', teks: 'Karena beratnya bertambah ketika menjadi panas' },
    ],
    penjelasan:
      'Material yang panas memuai, sehingga massa jenisnya berkurang dan ia naik. Setelah mendingin di dekat kerak, material menyusut dan menjadi lebih rapat, sehingga tenggelam kembali.',
  },
  {
    id: 'soal-mantle-sulit-3',
    area: 'mantle',
    tingkat: 'sulit',
    pertanyaan:
      'Kalau mantel bumi benar-benar berupa cairan encer seperti air, apa yang akan terjadi pada gelombang gempa jenis S (gelombang geser)?',
    opsi: [
      { id: 'a', teks: 'Gelombang S tidak dapat melewatinya, padahal kenyataannya gelombang S tercatat melewati mantel', benar: true },
      { id: 'b', teks: 'Gelombang S akan bergerak jauh lebih cepat' },
      { id: 'c', teks: 'Gelombang S akan berubah menjadi cahaya' },
      { id: 'd', teks: 'Tidak ada pengaruh apa pun terhadap gelombang S' },
    ],
    penjelasan:
      'Gelombang geser tidak dapat merambat melalui zat cair. Karena gelombang S tercatat melewati mantel, material mantel tidak boleh berupa cairan encer — melainkan fluida yang sangat kental.',
    petunjuk: 'Ingat istilahnya: mantel itu fluida KENTAL, bukan cairan encer seperti air.',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // AREA: BATAS KONVERGEN (Level 1, zona 'convergent')
  // Memuat materi yang diminta dosen IPA: tumbukan dua benua TIDAK menghasilkan
  // subduksi (Himalaya), sedangkan subduksi menghasilkan gunung api; ditambah
  // pengetahuan lokal Indonesia.
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'soal-convergent-mudah-1',
    area: 'convergent',
    tingkat: 'mudah',
    pertanyaan: 'Batas lempeng yang terjadi ketika dua lempeng saling bertumbukan disebut...',
    opsi: [
      { id: 'a', teks: 'Batas konvergen', benar: true },
      { id: 'b', teks: 'Batas divergen' },
      { id: 'c', teks: 'Batas transform' },
      { id: 'd', teks: 'Batas netral' },
    ],
    penjelasan:
      'Konvergen berarti saling mendekat dan bertumbukan. Kebalikannya adalah divergen (saling menjauh), sedangkan transform adalah bergeser berdampingan.',
  },
  {
    id: 'soal-convergent-mudah-2',
    area: 'convergent',
    tingkat: 'mudah',
    pertanyaan: 'Ketika lempeng samudra bertemu lempeng benua, lempeng yang menunjam ke bawah adalah...',
    opsi: [
      { id: 'a', teks: 'Lempeng samudra', benar: true },
      { id: 'b', teks: 'Lempeng benua' },
      { id: 'c', teks: 'Keduanya terangkat ke atas' },
      { id: 'd', teks: 'Keduanya berhenti bergerak' },
    ],
    penjelasan:
      'Lempeng samudra lebih padat sehingga lebih berat, dan karena itu menunjam masuk ke bawah lempeng benua yang lebih ringan.',
  },
  {
    id: 'soal-convergent-mudah-3',
    area: 'convergent',
    tingkat: 'mudah',
    pertanyaan: 'Palung laut yang sangat dalam, seperti Palung Jawa, terbentuk di...',
    opsi: [
      { id: 'a', teks: 'Zona subduksi pada batas konvergen', benar: true },
      { id: 'b', teks: 'Tengah samudra pada batas divergen' },
      { id: 'c', teks: 'Puncak sebuah gunung berapi' },
      { id: 'd', teks: 'Dasar sebuah danau di pegunungan' },
    ],
    penjelasan:
      'Saat lempeng samudra menunjam ke bawah lempeng benua, dasar laut di tempat itu tertarik turun sehingga terbentuk palung yang sangat dalam.',
  },
  {
    id: 'soal-convergent-sedang-1',
    area: 'convergent',
    tingkat: 'sedang',
    pertanyaan: 'Rangkaian gunung api di Pulau Jawa terbentuk karena...',
    opsi: [
      { id: 'a', teks: 'Lempeng samudra menunjam, meleleh menjadi magma, lalu magma naik ke permukaan', benar: true },
      { id: 'b', teks: 'Dua lempeng benua saling bergesekan mendatar' },
      { id: 'c', teks: 'Air laut menguap lalu membentuk gunung' },
      { id: 'd', teks: 'Angin membawa pasir dan menumpuknya menjadi gunung' },
    ],
    penjelasan:
      'Lempeng samudra yang menunjam meleleh di kedalaman karena panas bumi, menghasilkan magma. Magma yang lebih ringan naik ke permukaan dan membentuk gunung api.',
  },
  {
    id: 'soal-convergent-sedang-2',
    area: 'convergent',
    tingkat: 'sedang',
    pertanyaan:
      'Indonesia terletak di pertemuan Lempeng Indo-Australia dan Lempeng Eurasia. Akibat paling nyata bagi Indonesia adalah...',
    opsi: [
      { id: 'a', teks: 'Sering terjadi gempa bumi dan memiliki banyak gunung api', benar: true },
      { id: 'b', teks: 'Tidak pernah terjadi gempa bumi' },
      { id: 'c', teks: 'Seluruh wilayahnya berupa daratan yang rata' },
      { id: 'd', teks: 'Tidak memiliki gunung api sama sekali' },
    ],
    penjelasan:
      'Pertemuan dua lempeng membuat wilayah Indonesia rawan gempa, dan subduksi lempeng samudra di bawahnya menghasilkan banyak gunung api.',
  },
  {
    id: 'soal-convergent-sedang-3',
    area: 'convergent',
    tingkat: 'sedang',
    pertanyaan:
      'Tanah di Pulau Sumatra terkenal subur, tetapi pulau itu juga rawan gempa. Bagaimana keduanya dapat berhubungan?',
    opsi: [
      { id: 'a', teks: 'Kesuburannya berasal dari abu vulkanik, dan letaknya di zona tumbukan lempeng menyebabkan rawan gempa', benar: true },
      { id: 'b', teks: 'Kesuburan dan gempa sama-sama disebabkan oleh curah hujan yang tinggi' },
      { id: 'c', teks: 'Tanah yang subur selalu menyebabkan gempa' },
      { id: 'd', teks: 'Keduanya tidak berhubungan sama sekali' },
    ],
    penjelasan:
      'Dua-duanya berasal dari sebab yang sama: posisi Sumatra di zona tumbukan lempeng. Abu vulkanik menyuburkan tanah, sementara pergerakan lempengnya menimbulkan gempa.',
  },
  {
    id: 'soal-convergent-sulit-1',
    area: 'convergent',
    tingkat: 'sulit',
    pertanyaan: 'Ketika dua lempeng BENUA bertumbukan, tidak terjadi subduksi. Mengapa demikian?',
    opsi: [
      { id: 'a', teks: 'Karena keduanya sama-sama ringan, sehingga tidak ada yang mampu menunjam dan keduanya terangkat', benar: true },
      { id: 'b', teks: 'Karena lempeng benua terlalu dingin untuk dapat menunjam' },
      { id: 'c', teks: 'Karena lempeng benua lebih tipis daripada lempeng samudra' },
      { id: 'd', teks: 'Karena lempeng benua tidak dapat bergerak' },
    ],
    penjelasan:
      'Subduksi terjadi karena ada perbedaan massa jenis. Sesama lempeng benua massa jenisnya serupa dan keduanya ringan, sehingga tidak ada yang tenggelam — yang terjadi adalah keduanya terangkat dan terlipat.',
  },
  {
    id: 'soal-convergent-sulit-2',
    area: 'convergent',
    tingkat: 'sulit',
    pertanyaan:
      'Pegunungan Himalaya terbentuk dari tumbukan dua lempeng benua. Mengapa di sana TIDAK terbentuk gunung api seperti di Jawa?',
    opsi: [
      { id: 'a', teks: 'Karena tumbukan dua lempeng benua tidak menghasilkan subduksi, sehingga tidak ada magma yang naik', benar: true },
      { id: 'b', teks: 'Karena Himalaya terlalu tinggi untuk mengeluarkan magma' },
      { id: 'c', teks: 'Karena di sekitar Himalaya tidak ada air' },
      { id: 'd', teks: 'Karena Himalaya berada di tengah benua' },
    ],
    penjelasan:
      'Gunung api memerlukan magma, dan magma dihasilkan oleh lempeng yang menunjam lalu meleleh. Pada tumbukan benua–benua tidak ada yang menunjam, sehingga terbentuk pegunungan lipatan, bukan gunung api.',
  },
  {
    id: 'soal-convergent-sulit-3',
    area: 'convergent',
    tingkat: 'sulit',
    pertanyaan:
      'Berdasarkan perbedaan massa jenis kerak, kesimpulan yang paling tepat tentang pertemuan lempeng adalah...',
    opsi: [
      { id: 'a', teks: 'Subduksi terjadi bila ada perbedaan massa jenis kerak; zona subduksi menghasilkan gunung api, sedangkan tumbukan sesama benua menghasilkan pegunungan lipatan', benar: true },
      { id: 'b', teks: 'Semua pertemuan lempeng selalu menghasilkan gunung api' },
      { id: 'c', teks: 'Semua pertemuan lempeng selalu menghasilkan pegunungan lipatan' },
      { id: 'd', teks: 'Massa jenis kerak tidak berpengaruh pada bentuk permukaan bumi' },
    ],
    penjelasan:
      'Jenis pertemuan lempeng menentukan bentuk permukaan bumi. Subduksi (samudra–benua) menghasilkan gunung api, sedangkan kolisi (benua–benua) menghasilkan pegunungan lipatan seperti Himalaya.',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // LEVEL 2 — AREA 1: MITIGASI GEMPA BUMI (kesiapsiagaan sebelum gempa)
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'soal-area-mitigasi-gempa-mudah-1',
    area: 'area-mitigasi-gempa',
    tingkat: 'mudah',
    pertanyaan: 'Saat gempa bumi terjadi, langkah pertama yang harus dilakukan adalah...',
    opsi: [
      { id: 'a', teks: 'Melindungi kepala dan berlindung di bawah meja yang kuat', benar: true },
      { id: 'b', teks: 'Berlari keluar sambil berteriak' },
      { id: 'c', teks: 'Naik ke lantai paling atas' },
      { id: 'd', teks: 'Masuk ke dalam lift agar cepat turun' },
    ],
    penjelasan:
      'Prioritas pertama adalah melindungi kepala dan tubuh dari benda yang jatuh. Berlindung di bawah meja yang kuat adalah cara tercepat dan paling aman.',
  },
  {
    id: 'soal-area-mitigasi-gempa-mudah-2',
    area: 'area-mitigasi-gempa',
    tingkat: 'mudah',
    pertanyaan: 'Perabot tinggi seperti lemari buku sebaiknya...',
    opsi: [
      { id: 'a', teks: 'Dikunci atau ditempel ke dinding agar tidak roboh saat gempa', benar: true },
      { id: 'b', teks: 'Diletakkan tepat di depan pintu keluar' },
      { id: 'c', teks: 'Dipindahkan ke lantai paling atas' },
      { id: 'd', teks: 'Dibiarkan berdiri bebas di tengah ruangan' },
    ],
    penjelasan:
      'Lemari tinggi yang tidak terpasang ke dinding mudah roboh dan menimpa orang saat gempa. Menguncinya ke dinding adalah langkah mitigasi yang murah dan sangat efektif.',
  },
  {
    id: 'soal-area-mitigasi-gempa-mudah-3',
    area: 'area-mitigasi-gempa',
    tingkat: 'mudah',
    pertanyaan: 'Isi "tas siaga bencana" yang paling tepat adalah...',
    opsi: [
      { id: 'a', teks: 'Air minum, makanan tahan lama, senter, obat-obatan, dan salinan dokumen penting', benar: true },
      { id: 'b', teks: 'Mainan dan buku komik' },
      { id: 'c', teks: 'Kompor gas dan peralatan memasak' },
      { id: 'd', teks: 'Perabot rumah tangga dan karpet' },
    ],
    penjelasan:
      'Tas siaga harus berisi kebutuhan bertahan hidup paling dasar selama beberapa hari, dan cukup ringan untuk dibawa sendiri saat harus segera pergi.',
  },
  {
    id: 'soal-area-mitigasi-gempa-sedang-1',
    area: 'area-mitigasi-gempa',
    tingkat: 'sedang',
    pertanyaan: 'Mengapa latihan evakuasi gempa perlu dilakukan berulang-ulang, bukan cukup sekali?',
    opsi: [
      { id: 'a', teks: 'Agar gerakan yang tepat menjadi kebiasaan otomatis sehingga tetap dilakukan saat panik', benar: true },
      { id: 'b', teks: 'Agar sekolah terlihat rapi dan tertib' },
      { id: 'c', teks: 'Agar siswa hafal nama semua gedung sekolah' },
      { id: 'd', teks: 'Agar guru tidak perlu mengawasi siswa lagi' },
    ],
    penjelasan:
      'Saat gempa, waktu berpikir sangat singkat dan rasa panik tinggi. Hanya tindakan yang sudah menjadi kebiasaan yang dapat diandalkan pada saat seperti itu.',
  },
  {
    id: 'soal-area-mitigasi-gempa-sedang-2',
    area: 'area-mitigasi-gempa',
    tingkat: 'sedang',
    pertanyaan: 'Saat gempa berlangsung, mengapa kita tidak boleh menggunakan lift?',
    opsi: [
      { id: 'a', teks: 'Karena aliran listrik dapat terputus sehingga kita terjebak di dalamnya', benar: true },
      { id: 'b', teks: 'Karena lift bergerak terlalu lambat' },
      { id: 'c', teks: 'Karena lift hanya boleh dipakai untuk barang' },
      { id: 'd', teks: 'Karena lift mengeluarkan suara yang keras' },
    ],
    penjelasan:
      'Gempa dapat memutus aliran listrik dan merusak rel lift. Orang yang berada di dalam lift berisiko terjebak tanpa jalan keluar.',
  },
  {
    id: 'soal-area-mitigasi-gempa-sedang-3',
    area: 'area-mitigasi-gempa',
    tingkat: 'sedang',
    pertanyaan: 'Bangunan yang dirancang tahan gempa biasanya memiliki...',
    opsi: [
      { id: 'a', teks: 'Rangka yang lentur sehingga ikut bergoyang tanpa patah', benar: true },
      { id: 'b', teks: 'Dinding yang sangat kaku dan berat' },
      { id: 'c', teks: 'Bahan yang mudah retak agar cepat diganti' },
      { id: 'd', teks: 'Pondasi yang sangat dangkal' },
    ],
    penjelasan:
      'Bangunan tahan gempa dibuat lentur, bukan kaku. Rangka yang lentur menyerap dan mengikuti getaran, sedangkan bangunan yang terlalu kaku justru mudah patah.',
  },
  {
    id: 'soal-area-mitigasi-gempa-sulit-1',
    area: 'area-mitigasi-gempa',
    tingkat: 'sulit',
    pertanyaan: 'Mengapa membangun rumah di atas tanah yang lunak dan basah lebih berbahaya saat gempa?',
    opsi: [
      { id: 'a', teks: 'Karena tanah lunak memperkuat getaran gempa, sehingga bangunan bergoyang jauh lebih keras', benar: true },
      { id: 'b', teks: 'Karena tanah lunak membuat gempa berlangsung lebih lama' },
      { id: 'c', teks: 'Karena tanah lunak menarik gempa ke arahnya' },
      { id: 'd', teks: 'Karena tanah lunak membuat bangunan menjadi lebih ringan' },
    ],
    penjelasan:
      'Tanah yang lunak dan mengandung banyak air memperbesar goyangan di permukaan. Karena itu kerusakan bangunan di daerah tanah lunak biasanya jauh lebih parah daripada di tanah keras.',
  },
  {
    id: 'soal-area-mitigasi-gempa-sulit-2',
    area: 'area-mitigasi-gempa',
    tingkat: 'sulit',
    pertanyaan:
      'Peringatan dini gempa hanya memberi waktu beberapa detik. Tindakan yang paling tepat dalam waktu sesingkat itu adalah...',
    opsi: [
      { id: 'a', teks: 'Langsung berlindung di tempat, karena berusaha mencari jalan keluar justru berisiko terkena reruntuhan', benar: true },
      { id: 'b', teks: 'Berlari sejauh mungkin meninggalkan bangunan' },
      { id: 'c', teks: 'Menelepon keluarga lebih dahulu' },
      { id: 'd', teks: 'Mengambil barang berharga di lantai atas' },
    ],
    penjelasan:
      'Dalam hitungan detik, berlari tidak akan cukup untuk keluar dari bangunan, tetapi justru melewati banyak bahaya seperti kaca dan benda jatuh. Berlindung di tempat adalah pilihan paling aman.',
  },
  {
    id: 'soal-area-mitigasi-gempa-sulit-3',
    area: 'area-mitigasi-gempa',
    tingkat: 'sulit',
    pertanyaan: 'Mengapa Indonesia jauh lebih rawan gempa bumi dibandingkan banyak negara lain?',
    opsi: [
      { id: 'a', teks: 'Karena wilayahnya terletak pada pertemuan beberapa lempeng tektonik besar', benar: true },
      { id: 'b', teks: 'Karena Indonesia dilalui garis khatulistiwa' },
      { id: 'c', teks: 'Karena Indonesia memiliki hutan hujan yang luas' },
      { id: 'd', teks: 'Karena Indonesia hanya memiliki dua musim' },
    ],
    penjelasan:
      'Indonesia berada di antara lempeng Indo-Australia, Eurasia, dan Pasifik yang saling bertumbukan. Pertemuan lempeng inilah sumber gempa, bukan iklim atau letak khatulistiwanya.',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // LEVEL 2 — AREA 2: SIMULASI TANGGAP GEMPA (drop, cover, hold on)
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'soal-area-simulasi-gempa-mudah-1',
    area: 'area-simulasi-gempa',
    tingkat: 'mudah',
    pertanyaan: 'Gerakan "DROP" saat gempa berarti...',
    opsi: [
      { id: 'a', teks: 'Merunduk ke bawah mendekati lantai', benar: true },
      { id: 'b', teks: 'Melompat keluar melalui jendela' },
      { id: 'c', teks: 'Berdiri tegak di tengah ruangan' },
      { id: 'd', teks: 'Berlari naik ke lantai atas' },
    ],
    penjelasan:
      'Merunduk dilakukan agar tubuh berada serendah mungkin, sehingga kecil kemungkinan terkena benda yang jatuh atau terlempar.',
  },
  {
    id: 'soal-area-simulasi-gempa-mudah-2',
    area: 'area-simulasi-gempa',
    tingkat: 'mudah',
    pertanyaan: 'Setelah merunduk dan berlindung, langkah berikutnya dalam tanggap gempa adalah...',
    opsi: [
      { id: 'a', teks: 'Berpegangan kuat pada kaki meja sampai getaran benar-benar berhenti', benar: true },
      { id: 'b', teks: 'Langsung berlari keluar ruangan' },
      { id: 'c', teks: 'Berdiri dan melihat keadaan di luar jendela' },
      { id: 'd', teks: 'Menelepon teman untuk memberi tahu' },
    ],
    penjelasan:
      'Berpegangan membuat tempat berlindung tidak bergeser dari atas kita. Getaran bisa berlangsung puluhan detik, jadi kita harus bertahan di tempat sampai benar-benar berhenti.',
  },
  {
    id: 'soal-area-simulasi-gempa-mudah-3',
    area: 'area-simulasi-gempa',
    tingkat: 'mudah',
    pertanyaan: 'Saat gempa terjadi di dalam kelas, tempat berlindung yang paling tepat adalah...',
    opsi: [
      { id: 'a', teks: 'Di bawah meja yang kuat dan jauh dari kaca jendela', benar: true },
      { id: 'b', teks: 'Tepat di dekat jendela kaca' },
      { id: 'c', teks: 'Di tengah koridor yang ramai' },
      { id: 'd', teks: 'Di dalam lemari kelas' },
    ],
    penjelasan:
      'Meja yang kuat melindungi dari benda jatuh, sedangkan jendela kaca berisiko pecah. Lemari justru berbahaya karena dapat roboh menimpa.',
  },
  {
    id: 'soal-area-simulasi-gempa-sedang-1',
    area: 'area-simulasi-gempa',
    tingkat: 'sedang',
    pertanyaan: 'Mengapa kita harus menjauhi jendela kaca saat gempa?',
    opsi: [
      { id: 'a', teks: 'Karena kaca dapat pecah dan serpihannya melukai orang di sekitarnya', benar: true },
      { id: 'b', teks: 'Karena jendela membuat ruangan menjadi panas' },
      { id: 'c', teks: 'Karena jendela menghalangi pandangan kita' },
      { id: 'd', teks: 'Karena jendela terlalu berat untuk dibuka' },
    ],
    penjelasan:
      'Kaca jendela mudah pecah ketika rangka bangunan bergoyang. Pecahannya terlempar ke dalam ruangan dan menjadi salah satu penyebab luka yang paling sering saat gempa.',
  },
  {
    id: 'soal-area-simulasi-gempa-sedang-2',
    area: 'area-simulasi-gempa',
    tingkat: 'sedang',
    pertanyaan: 'Jika gempa terjadi saat kita sedang berada di luar ruangan, yang harus dilakukan adalah...',
    opsi: [
      { id: 'a', teks: 'Menjauh dari bangunan, tiang listrik, dan pohon besar, lalu merunduk di area terbuka', benar: true },
      { id: 'b', teks: 'Segera masuk ke gedung terdekat' },
      { id: 'c', teks: 'Berdiri tepat di bawah tiang listrik' },
      { id: 'd', teks: 'Berlari menempel di sepanjang dinding gedung' },
    ],
    penjelasan:
      'Di luar ruangan, bahaya utamanya adalah benda yang jatuh atau roboh: tembok, tiang, papan reklame, dan pohon. Area terbuka yang jauh dari semua itu adalah tempat paling aman.',
  },
  {
    id: 'soal-area-simulasi-gempa-sedang-3',
    area: 'area-simulasi-gempa',
    tingkat: 'sedang',
    pertanyaan: 'Jika gempa terjadi saat kita berada di dalam kendaraan yang sedang berjalan...',
    opsi: [
      { id: 'a', teks: 'Menepi di tempat aman yang jauh dari jembatan dan tiang, lalu tetap berada di dalam kendaraan', benar: true },
      { id: 'b', teks: 'Mempercepat kendaraan agar cepat sampai tujuan' },
      { id: 'c', teks: 'Berhenti tepat di atas jembatan' },
      { id: 'd', teks: 'Keluar dan berlari di tengah jalan raya' },
    ],
    penjelasan:
      'Kendaraan memberi perlindungan dari benda jatuh. Menepi jauh dari jembatan dan tiang penting karena keduanya dapat runtuh, dan jembatan bisa terputus.',
  },
  {
    id: 'soal-area-simulasi-gempa-sulit-1',
    area: 'area-simulasi-gempa',
    tingkat: 'sulit',
    pertanyaan: 'Mengapa berlari keluar gedung SAAT gempa sedang berlangsung justru lebih berbahaya?',
    opsi: [
      { id: 'a', teks: 'Karena saat getaran paling kuat, risiko terkena reruntuhan, kaca, dan benda jatuh paling besar', benar: true },
      { id: 'b', teks: 'Karena berlari membuat getaran gempa menjadi lebih kuat' },
      { id: 'c', teks: 'Karena pintu kelas selalu dalam keadaan terkunci' },
      { id: 'd', teks: 'Karena suhu di luar gedung lebih panas' },
    ],
    penjelasan:
      'Puncak getaran adalah saat paling berbahaya di seluruh bangunan. Berada di jalur keluar pada saat itu berarti melewati kaca, plafon, dan dinding yang sedang paling mungkin runtuh.',
  },
  {
    id: 'soal-area-simulasi-gempa-sulit-2',
    area: 'area-simulasi-gempa',
    tingkat: 'sulit',
    pertanyaan:
      'Setelah getaran gempa berhenti, mengapa kita belum boleh langsung masuk kembali ke dalam gedung?',
    opsi: [
      { id: 'a', teks: 'Karena bangunan bisa saja sudah rusak dan berpotensi runtuh bila terjadi gempa susulan', benar: true },
      { id: 'b', teks: 'Karena gedung akan segera dibersihkan petugas' },
      { id: 'c', teks: 'Karena aliran listrik pasti sudah mati' },
      { id: 'd', teks: 'Karena tidak boleh ada kegiatan setelah gempa' },
    ],
    penjelasan:
      'Gempa besar hampir selalu diikuti gempa susulan. Bangunan yang sudah retak dapat runtuh pada susulan itu, jadi gedung harus diperiksa lebih dahulu.',
  },
  {
    id: 'soal-area-simulasi-gempa-sulit-3',
    area: 'area-simulasi-gempa',
    tingkat: 'sulit',
    pertanyaan:
      'Mengapa "merunduk, berlindung, berpegangan" lebih ditekankan daripada berlari ke luar ruangan?',
    opsi: [
      { id: 'a', teks: 'Karena melindungi diri di tempat dapat dilakukan segera dan melindungi dari benda jatuh, sedangkan berlari memakan waktu dan melewati banyak bahaya', benar: true },
      { id: 'b', teks: 'Karena berlari dilarang di lingkungan sekolah' },
      { id: 'c', teks: 'Karena melindungi diri tidak memerlukan tenaga' },
      { id: 'd', teks: 'Karena gempa selalu berlangsung sangat lama' },
    ],
    penjelasan:
      'Yang menentukan bukan jarak, melainkan kecepatan berlindung. Merunduk dan berlindung bisa dilakukan dalam satu detik, sedangkan berlari keluar gedung bertingkat tidak mungkin selesai sebelum getaran berakhir.',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // LEVEL 2 — AREA 3: LAPANGAN EVAKUASI SEKOLAH (pasca gempa besar)
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'soal-area-lapangan-evakuasi-mudah-1',
    area: 'area-lapangan-evakuasi',
    tingkat: 'mudah',
    pertanyaan: 'Setelah gempa besar, tempat berkumpul yang aman di sekolah adalah...',
    opsi: [
      { id: 'a', teks: 'Lapangan terbuka yang jauh dari bangunan, tiang, dan pohon besar', benar: true },
      { id: 'b', teks: 'Di dalam kelas masing-masing' },
      { id: 'c', teks: 'Di bawah pohon besar agar tidak kepanasan' },
      { id: 'd', teks: 'Menempel di dekat tembok sekolah' },
    ],
    penjelasan:
      'Titik kumpul harus berupa ruang terbuka. Bangunan, tiang, pohon, dan tembok semuanya berpotensi roboh pada gempa susulan.',
  },
  {
    id: 'soal-area-lapangan-evakuasi-mudah-2',
    area: 'area-lapangan-evakuasi',
    tingkat: 'mudah',
    pertanyaan: 'Sesampainya di titik kumpul, hal pertama yang perlu dilakukan adalah...',
    opsi: [
      { id: 'a', teks: 'Memeriksa apakah semua teman dan guru sudah lengkap', benar: true },
      { id: 'b', teks: 'Langsung pulang ke rumah masing-masing' },
      { id: 'c', teks: 'Bermain untuk menghilangkan rasa takut' },
      { id: 'd', teks: 'Kembali ke kelas untuk mengambil tas' },
    ],
    penjelasan:
      'Tujuan titik kumpul adalah memastikan siapa yang sudah aman dan siapa yang masih belum ditemukan. Pemeriksaan kehadiran adalah hal pertama yang harus dilakukan.',
  },
  {
    id: 'soal-area-lapangan-evakuasi-mudah-3',
    area: 'area-lapangan-evakuasi',
    tingkat: 'mudah',
    pertanyaan: 'Jika ada teman yang terluka, yang sebaiknya dilakukan adalah...',
    opsi: [
      { id: 'a', teks: 'Memanggil guru atau petugas berkompeten, dan tidak memindahkan korban sembarangan', benar: true },
      { id: 'b', teks: 'Mengangkat korban lalu membawanya berlari' },
      { id: 'c', teks: 'Membiarkannya sendirian sampai petugas datang' },
      { id: 'd', teks: 'Memberinya minum sebanyak mungkin' },
    ],
    penjelasan:
      'Pertolongan pertama yang salah dapat memperburuk cedera. Tugas kita adalah memanggil penolong yang berkompeten dan menjaga korban tetap tenang di tempatnya.',
  },
  {
    id: 'soal-area-lapangan-evakuasi-sedang-1',
    area: 'area-lapangan-evakuasi',
    tingkat: 'sedang',
    pertanyaan: 'Mengapa korban yang mengalami cedera tulang tidak boleh dipindahkan sembarangan?',
    opsi: [
      { id: 'a', teks: 'Karena pergerakan yang salah dapat memperparah cederanya', benar: true },
      { id: 'b', teks: 'Karena korban harus selalu istirahat di tempat' },
      { id: 'c', teks: 'Karena korban tidak boleh disentuh sama sekali' },
      { id: 'd', teks: 'Karena korban akan sembuh dengan sendirinya' },
    ],
    penjelasan:
      'Tulang yang patah dapat menggeser dan melukai pembuluh darah atau saraf di sekitarnya bila digerakkan. Karena itu pemindahan harus dilakukan oleh petugas terlatih.',
  },
  {
    id: 'soal-area-lapangan-evakuasi-sedang-2',
    area: 'area-lapangan-evakuasi',
    tingkat: 'sedang',
    pertanyaan:
      'Di lapangan evakuasi, mengapa perlu ada pembagian tugas seperti pencatat, pencari bantuan, dan penjaga?',
    opsi: [
      { id: 'a', teks: 'Agar pertolongan berjalan teratur dan tidak ada korban yang terlewat', benar: true },
      { id: 'b', teks: 'Agar terlihat rapi oleh pengawas sekolah' },
      { id: 'c', teks: 'Agar semua orang mempunyai kesibukan' },
      { id: 'd', teks: 'Agar tidak perlu saling berkomunikasi' },
    ],
    penjelasan:
      'Dalam keadaan darurat, pekerjaan yang tidak dibagi akan bertumpuk pada beberapa orang sementara yang lain menganggur. Pembagian tugas membuat pertolongan cepat dan menyeluruh.',
  },
  {
    id: 'soal-area-lapangan-evakuasi-sedang-3',
    area: 'area-lapangan-evakuasi',
    tingkat: 'sedang',
    pertanyaan:
      'Informasi apa yang PALING penting dilaporkan kepada petugas saat berada di titik kumpul?',
    opsi: [
      { id: 'a', teks: 'Jumlah orang yang selamat, yang terluka, dan yang belum ditemukan', benar: true },
      { id: 'b', teks: 'Warna tas milik masing-masing siswa' },
      { id: 'c', teks: 'Jadwal pelajaran pada hari itu' },
      { id: 'd', teks: 'Nama jalan menuju sekolah' },
    ],
    penjelasan:
      'Petugas membutuhkan gambaran korban untuk menentukan prioritas pertolongan. Yang paling menentukan adalah berapa yang aman, berapa yang luka, dan siapa yang masih hilang.',
  },
  {
    id: 'soal-area-lapangan-evakuasi-sulit-1',
    area: 'area-lapangan-evakuasi',
    tingkat: 'sulit',
    pertanyaan:
      'Setelah gempa besar, mengapa jalur evakuasi bisa berbeda dari jalur yang biasa dilatihkan?',
    opsi: [
      { id: 'a', teks: 'Karena reruntuhan, jalan yang retak, atau kebakaran dapat menutup jalur semula sehingga perlu jalur alternatif', benar: true },
      { id: 'b', teks: 'Karena guru ingin mencoba jalur yang baru' },
      { id: 'c', teks: 'Karena jalur lama sudah tidak dipakai lagi' },
      { id: 'd', teks: 'Karena jalur baru selalu lebih pendek' },
    ],
    penjelasan:
      'Jalur yang direncanakan mengandaikan bangunan masih berdiri. Gempa besar dapat meruntuhkan bangunan ke jalur itu, sehingga selalu diperlukan jalur alternatif yang sudah dikenal sebelumnya.',
  },
  {
    id: 'soal-area-lapangan-evakuasi-sulit-2',
    area: 'area-lapangan-evakuasi',
    tingkat: 'sulit',
    pertanyaan:
      'Mengapa pengungsian perlu memisahkan penanganan berdasarkan kelompok seperti balita, lansia, dan korban luka?',
    opsi: [
      { id: 'a', teks: 'Karena kebutuhan dan tingkat kerentanan tiap kelompok berbeda, sehingga penanganannya harus disesuaikan', benar: true },
      { id: 'b', teks: 'Agar pengungsian terlihat lebih tertata' },
      { id: 'c', teks: 'Agar tidak terjadi keributan antar-pengungsi' },
      { id: 'd', teks: 'Agar jumlah pengungsi lebih mudah dihitung' },
    ],
    penjelasan:
      'Bayi memerlukan makanan khusus, lansia memerlukan obat rutin, dan korban luka memerlukan perawatan medis. Bila semuanya disatukan tanpa pemilahan, kelompok paling rentan justru paling akhir tertangani.',
  },
  {
    id: 'soal-area-lapangan-evakuasi-sulit-3',
    area: 'area-lapangan-evakuasi',
    tingkat: 'sulit',
    pertanyaan:
      'Bila terjadi gempa susulan saat kita sedang menolong korban di lapangan, urutan tindakan yang paling tepat adalah...',
    opsi: [
      { id: 'a', teks: 'Melindungi diri sendiri lebih dahulu, lalu melanjutkan pertolongan setelah getaran berhenti', benar: true },
      { id: 'b', teks: 'Terus menolong korban tanpa menghiraukan getaran' },
      { id: 'c', teks: 'Meninggalkan korban lalu pulang ke rumah' },
      { id: 'd', teks: 'Merekam kejadian dengan ponsel' },
    ],
    penjelasan:
      'Penolong yang menjadi korban tidak dapat menolong siapa pun. Melindungi diri lebih dahulu bukan tindakan pengecut, melainkan syarat agar pertolongan tetap mungkin dilanjutkan.',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // LEVEL 2 — AREA 4: POS PENGAMATAN MERAPI (pemantauan & status PVMBG)
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'soal-area-pos-pengamatan-merapi-mudah-1',
    area: 'area-pos-pengamatan-merapi',
    tingkat: 'mudah',
    pertanyaan: 'Lembaga yang bertugas memantau aktivitas gunung api di Indonesia adalah...',
    opsi: [
      { id: 'a', teks: 'PVMBG (Pusat Vulkanologi dan Mitigasi Bencana Geologi)', benar: true },
      { id: 'b', teks: 'BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)' },
      { id: 'c', teks: 'BASARNAS (Badan SAR Nasional)' },
      { id: 'd', teks: 'Perpustakaan Nasional' },
    ],
    penjelasan:
      'PVMBG bertugas memantau gunung api dan menetapkan statusnya. BMKG mengurus cuaca dan gempa tektonik, sedangkan BASARNAS bertugas mencari dan menolong korban.',
  },
  {
    id: 'soal-area-pos-pengamatan-merapi-mudah-2',
    area: 'area-pos-pengamatan-merapi',
    tingkat: 'mudah',
    pertanyaan: 'Tingkat status gunung api yang PALING tinggi di Indonesia adalah...',
    opsi: [
      { id: 'a', teks: 'AWAS (Level IV)', benar: true },
      { id: 'b', teks: 'SIAGA (Level III)' },
      { id: 'c', teks: 'WASPADA (Level II)' },
      { id: 'd', teks: 'NORMAL (Level I)' },
    ],
    penjelasan:
      'Status gunung api Indonesia berjenjang dari NORMAL, WASPADA, SIAGA, hingga AWAS sebagai tingkat tertinggi. Pada status AWAS, wilayah terancam harus sudah dikosongkan.',
  },
  {
    id: 'soal-area-pos-pengamatan-merapi-mudah-3',
    area: 'area-pos-pengamatan-merapi',
    tingkat: 'mudah',
    pertanyaan: 'Urutan status gunung api dari yang paling aman adalah...',
    opsi: [
      { id: 'a', teks: 'Normal, Waspada, Siaga, Awas', benar: true },
      { id: 'b', teks: 'Awas, Siaga, Waspada, Normal' },
      { id: 'c', teks: 'Normal, Siaga, Waspada, Awas' },
      { id: 'd', teks: 'Waspada, Normal, Awas, Siaga' },
    ],
    penjelasan:
      'Urutan yang benar adalah Normal (I), Waspada (II), Siaga (III), lalu Awas (IV). Setiap kenaikan tingkat diikuti tindakan yang makin tegas.',
  },
  {
    id: 'soal-area-pos-pengamatan-merapi-sedang-1',
    area: 'area-pos-pengamatan-merapi',
    tingkat: 'sedang',
    pertanyaan: 'Saat Gunung Merapi berstatus SIAGA, langkah yang tepat bagi warga di zona rawan adalah...',
    opsi: [
      { id: 'a', teks: 'Mempersiapkan diri dan barang bawaan untuk kemungkinan evakuasi', benar: true },
      { id: 'b', teks: 'Tetap beraktivitas seperti biasa di lereng gunung' },
      { id: 'c', teks: 'Mendaki untuk melihat keadaan kawah' },
      { id: 'd', teks: 'Menunggu sampai status AWAS baru mulai bersiap' },
    ],
    penjelasan:
      'SIAGA adalah peringatan agar bersiap. Menunggu sampai AWAS berarti bersiap pada saat yang paling sempit, padahal evakuasi memerlukan waktu.',
  },
  {
    id: 'soal-area-pos-pengamatan-merapi-sedang-2',
    area: 'area-pos-pengamatan-merapi',
    tingkat: 'sedang',
    pertanyaan: 'Apa kegunaan alat seismograf di pos pengamatan gunung api?',
    opsi: [
      { id: 'a', teks: 'Merekam getaran yang berhubungan dengan pergerakan magma di dalam gunung', benar: true },
      { id: 'b', teks: 'Mengukur suhu udara di sekitar gunung' },
      { id: 'c', teks: 'Menghitung jumlah penduduk di lereng gunung' },
      { id: 'd', teks: 'Mengukur curah hujan harian' },
    ],
    penjelasan:
      'Magma yang naik ke permukaan menekan dan memecah batuan, lalu menimbulkan getaran. Seismograf merekam getaran itu, dan dari jumlah serta kekuatannya petugas menilai kesiapan gunung untuk meletus.',
  },
  {
    id: 'soal-area-pos-pengamatan-merapi-sedang-3',
    area: 'area-pos-pengamatan-merapi',
    tingkat: 'sedang',
    pertanyaan: 'Aliran gas dan material panas yang meluncur cepat di sepanjang lereng gunung disebut...',
    opsi: [
      { id: 'a', teks: 'Awan panas (aliran piroklastik)', benar: true },
      { id: 'b', teks: 'Kabut pagi' },
      { id: 'c', teks: 'Asap pembakaran sampah' },
      { id: 'd', teks: 'Kabut asap akibat kebakaran hutan' },
    ],
    penjelasan:
      'Aliran piroklastik atau awan panas adalah campuran gas dan material vulkanik panas yang bergerak menuruni lereng dengan kecepatan tinggi. Inilah bahaya utama letusan Merapi.',
  },
  {
    id: 'soal-area-pos-pengamatan-merapi-sulit-1',
    area: 'area-pos-pengamatan-merapi',
    tingkat: 'sulit',
    pertanyaan:
      'Mengapa peningkatan status gunung api dilakukan bertahap dan tidak langsung ke tingkat tertinggi?',
    opsi: [
      { id: 'a', teks: 'Karena setiap tingkat memicu tindakan yang berbeda, dan kenaikan bertahap memberi waktu warga bersiap tanpa kepanikan yang tidak perlu', benar: true },
      { id: 'b', teks: 'Karena alat pemantau tidak dapat mendeteksi kondisi secara langsung' },
      { id: 'c', teks: 'Karena pemerintah ingin menghemat biaya evakuasi' },
      { id: 'd', teks: 'Karena status gunung api hanya bersifat formalitas' },
    ],
    penjelasan:
      'Kenaikan bertahap membuat warga mempersiapkan diri selangkah demi selangkah: menyiapkan dokumen, barang bawaan, jalur, lalu mengungsi. Evakuasi mendadak justru lebih berisiko dan lebih memakan korban.',
  },
  {
    id: 'soal-area-pos-pengamatan-merapi-sulit-2',
    area: 'area-pos-pengamatan-merapi',
    tingkat: 'sulit',
    pertanyaan: 'Data apa yang membuat PVMBG menaikkan status sebuah gunung api?',
    opsi: [
      { id: 'a', teks: 'Peningkatan jumlah dan kekuatan gempa vulkanik, perubahan bentuk tubuh gunung, serta perubahan suhu dan komposisi gas', benar: true },
      { id: 'b', teks: 'Perubahan cuaca harian di sekitar gunung' },
      { id: 'c', teks: 'Jumlah wisatawan yang datang berkunjung' },
      { id: 'd', teks: 'Ramalan yang beredar di media sosial' },
    ],
    penjelasan:
      'Status ditetapkan berdasarkan data pengukuran, bukan perkiraan. Gempa vulkanik, perubahan bentuk tubuh gunung, dan perubahan gas adalah tanda pergerakan magma yang dapat diukur.',
  },
  {
    id: 'soal-area-pos-pengamatan-merapi-sulit-3',
    area: 'area-pos-pengamatan-merapi',
    tingkat: 'sulit',
    pertanyaan:
      'Mengapa warga di zona KRB III harus mengungsi lebih dahulu dibandingkan warga di zona KRB I?',
    opsi: [
      { id: 'a', teks: 'Karena KRB III adalah zona paling dekat kawah dan paling terancam, sehingga waktu amannya paling singkat', benar: true },
      { id: 'b', teks: 'Karena jumlah penduduk di KRB III lebih sedikit' },
      { id: 'c', teks: 'Karena KRB III lebih jauh dari jalan raya' },
      { id: 'd', teks: 'Karena KRB I tidak pernah terancam sama sekali' },
    ],
    penjelasan:
      'KRB III (Kawasan Rawan Bencana III) adalah zona paling berbahaya karena selalu terancam awan panas dan guguran. Karena waktu amannya paling singkat, warga di sana harus mengungsi paling awal.',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // LEVEL 2 — AREA 5: SIMULASI MERAPI (tindakan saat erupsi)
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'soal-area-simulasi-merapi-mudah-1',
    area: 'area-simulasi-merapi',
    tingkat: 'mudah',
    pertanyaan: 'Saat terjadi hujan abu vulkanik, yang sebaiknya dipakai untuk menutup mulut dan hidung adalah...',
    opsi: [
      { id: 'a', teks: 'Masker, atau kain yang dibasahi air bila masker tidak ada', benar: true },
      { id: 'b', teks: 'Kertas tipis' },
      { id: 'c', teks: 'Daun kering' },
      { id: 'd', teks: 'Tidak perlu apa pun, cukup ditahan napas' },
    ],
    penjelasan:
      'Partikel abu vulkanik sangat halus dan dapat masuk ke saluran pernapasan. Masker atau kain basah menyaring partikel itu sebelum terhirup.',
  },
  {
    id: 'soal-area-simulasi-merapi-mudah-2',
    area: 'area-simulasi-merapi',
    tingkat: 'mudah',
    pertanyaan: 'Saat hujan abu, sebaiknya kita...',
    opsi: [
      { id: 'a', teks: 'Tetap di dalam rumah dan menutup rapat jendela serta pintu', benar: true },
      { id: 'b', teks: 'Bermain di luar rumah agar tidak jenuh' },
      { id: 'c', teks: 'Membuka semua jendela agar udara segar masuk' },
      { id: 'd', teks: 'Mencuci kendaraan di halaman rumah' },
    ],
    penjelasan:
      'Berada di dalam ruangan tertutup mengurangi jumlah abu yang terhirup. Kegiatan di luar rumah justru menambah paparan abu dan berisiko bagi kesehatan.',
  },
  {
    id: 'soal-area-simulasi-merapi-mudah-3',
    area: 'area-simulasi-merapi',
    tingkat: 'mudah',
    pertanyaan: 'Arah yang PALING aman untuk mengungsi saat Gunung Merapi erupsi adalah...',
    opsi: [
      { id: 'a', teks: 'Menjauh dari kawah, mengikuti arah yang ditentukan petugas', benar: true },
      { id: 'b', teks: 'Mendekati kawah agar dapat melihat letusannya' },
      { id: 'c', teks: 'Menyusuri sungai yang berhulu di Merapi' },
      { id: 'd', teks: 'Tetap di lereng sambil menunggu informasi' },
    ],
    penjelasan:
      'Arah mengungsi tidak boleh ditentukan sendiri. Petugas sudah memperhitungkan arah awan panas, aliran lahar, dan kondisi jalur. Sungai yang berhulu di Merapi justru jalur paling berbahaya.',
  },
  {
    id: 'soal-area-simulasi-merapi-sedang-1',
    area: 'area-simulasi-merapi',
    tingkat: 'sedang',
    pertanyaan:
      'Mengapa kita tidak boleh berada di lembah atau tepi sungai yang berhulu di Gunung Merapi saat erupsi?',
    opsi: [
      { id: 'a', teks: 'Karena awan panas dan lahar mengalir mengikuti lembah dan alur sungai', benar: true },
      { id: 'b', teks: 'Karena air sungai menjadi keruh dan kotor' },
      { id: 'c', teks: 'Karena di lembah tidak ada sinyal telepon' },
      { id: 'd', teks: 'Karena lembah selalu gelap pada malam hari' },
    ],
    penjelasan:
      'Lembah dan sungai adalah jalur alami bagi material vulkanik yang turun dari puncak. Berada di sana sama dengan berdiri tepat di jalur alirannya.',
  },
  {
    id: 'soal-area-simulasi-merapi-sedang-2',
    area: 'area-simulasi-merapi',
    tingkat: 'sedang',
    pertanyaan: 'Apa yang dimaksud dengan lahar dingin?',
    opsi: [
      { id: 'a', teks: 'Aliran campuran air, pasir, dan batu vulkanik yang turun melalui sungai, biasanya dipicu hujan', benar: true },
      { id: 'b', teks: 'Lava yang sudah mendingin dan mengeras di lereng' },
      { id: 'c', teks: 'Air hujan biasa yang turun di sekitar gunung' },
      { id: 'd', teks: 'Kabut dingin yang keluar dari kawah gunung' },
    ],
    penjelasan:
      'Lahar dingin disebut "dingin" karena tidak membara seperti lava, tetapi tetap sangat berbahaya. Endapan vulkanik di lereng terangkat oleh air hujan dan mengalir deras sebagai lumpur batu.',
  },
  {
    id: 'soal-area-simulasi-merapi-sedang-3',
    area: 'area-simulasi-merapi',
    tingkat: 'sedang',
    pertanyaan:
      'Setelah hujan abu berhenti, mengapa kita tetap perlu memakai masker saat membersihkan atap dan halaman?',
    opsi: [
      { id: 'a', teks: 'Karena abu yang sudah mengendap dapat terangkat kembali ke udara dan terhirup', benar: true },
      { id: 'b', teks: 'Karena abu berwarna gelap dan mengotori pakaian' },
      { id: 'c', teks: 'Karena abu dapat merusak alat sapu' },
      { id: 'd', teks: 'Karena atap menjadi panas setelah terkena abu' },
    ],
    penjelasan:
      'Abu vulkanik tetap berbahaya dalam jangka panjang. Kegiatan menyapu dan membersihkan justru paling banyak menerbangkan abu, sehingga masker tetap diperlukan.',
  },
  {
    id: 'soal-area-simulasi-merapi-sulit-1',
    area: 'area-simulasi-merapi',
    tingkat: 'sulit',
    pertanyaan: 'Mengapa awan panas jauh lebih berbahaya dibandingkan hujan abu vulkanik biasa?',
    opsi: [
      { id: 'a', teks: 'Karena awan panas bergerak sangat cepat dengan suhu sangat tinggi dan melindas segala sesuatu di jalurnya', benar: true },
      { id: 'b', teks: 'Karena warnanya lebih gelap sehingga sulit terlihat' },
      { id: 'c', teks: 'Karena baunya sangat menyengat' },
      { id: 'd', teks: 'Karena suaranya sangat keras' },
    ],
    penjelasan:
      'Hujan abu mengganggu kesehatan, sedangkan awan panas dapat membunuh seketika karena suhunya mencapai ratusan derajat dan kecepatannya melebihi kemampuan manusia berlari.',
  },
  {
    id: 'soal-area-simulasi-merapi-sulit-2',
    area: 'area-simulasi-merapi',
    tingkat: 'sulit',
    pertanyaan:
      'Jika atap rumah dipenuhi abu vulkanik yang tebal, mengapa abu itu perlu segera dibersihkan dengan hati-hati?',
    opsi: [
      { id: 'a', teks: 'Karena beban abu dapat membuat atap runtuh, terutama bila kemudian terkena air hujan', benar: true },
      { id: 'b', teks: 'Karena abu membuat warna atap berubah' },
      { id: 'c', teks: 'Karena abu menyumbat saluran pembuangan air' },
      { id: 'd', teks: 'Karena abu membuat suhu rumah meningkat' },
    ],
    penjelasan:
      'Abu vulkanik menyerap air dan menjadi jauh lebih berat setelah hujan. Banyak atap runtuh bukan karena gempa atau letusan, melainkan karena bebannya sendiri.',
  },
  {
    id: 'soal-area-simulasi-merapi-sulit-3',
    area: 'area-simulasi-merapi',
    tingkat: 'sulit',
    pertanyaan:
      'Mengapa evakuasi saat erupsi harus mengikuti arahan petugas, bukan sekadar berusaha menjauh dari gunung?',
    opsi: [
      { id: 'a', teks: 'Karena jalur yang tampak menjauh belum tentu aman — bisa saja melewati lembah sungai atau jalur awan panas', benar: true },
      { id: 'b', teks: 'Karena petugas ingin agar arahannya selalu diikuti' },
      { id: 'c', teks: 'Karena jalan yang ditunjuk petugas selalu lebih lebar' },
      { id: 'd', teks: 'Karena arahan petugas selalu berupa jalur yang lebih pendek' },
    ],
    penjelasan:
      'Bahaya gunung api tidak menyebar merata ke segala arah, melainkan mengikuti lembah dan alur sungai. Jalur yang secara arah "menjauh" bisa justru menuju lembah yang menjadi jalur awan panas.',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // LEVEL 2 — AREA 6: BARAK PENGUNGSIAN (penanganan pengungsi)
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'soal-area-barak-pengungsian-mudah-1',
    area: 'area-barak-pengungsian',
    tingkat: 'mudah',
    pertanyaan: 'Tempat penampungan sementara bagi warga yang harus meninggalkan rumahnya disebut...',
    opsi: [
      { id: 'a', teks: 'Barak pengungsian', benar: true },
      { id: 'b', teks: 'Pos ronda' },
      { id: 'c', teks: 'Gudang logistik' },
      { id: 'd', teks: 'Balai pertemuan warga' },
    ],
    penjelasan:
      'Barak pengungsian adalah tempat penampungan sementara yang menyediakan tempat berlindung, makanan, air bersih, dan layanan kesehatan bagi para pengungsi.',
  },
  {
    id: 'soal-area-barak-pengungsian-mudah-2',
    area: 'area-barak-pengungsian',
    tingkat: 'mudah',
    pertanyaan: 'Hal yang perlu didaftarkan saat pertama kali tiba di barak pengungsian adalah...',
    opsi: [
      { id: 'a', teks: 'Identitas diri dan jumlah anggota keluarga yang ikut', benar: true },
      { id: 'b', teks: 'Warna pakaian yang dipakai' },
      { id: 'c', teks: 'Berat badan setiap anggota keluarga' },
      { id: 'd', teks: 'Ukuran sepatu setiap anggota keluarga' },
    ],
    penjelasan:
      'Pendaftaran diperlukan agar petugas mengetahui jumlah pengungsi dan dapat menghitung kebutuhan makanan, air, obat, serta tempat tidur.',
  },
  {
    id: 'soal-area-barak-pengungsian-mudah-3',
    area: 'area-barak-pengungsian',
    tingkat: 'mudah',
    pertanyaan: 'Air minum yang disediakan di pengungsian harus dipastikan...',
    opsi: [
      { id: 'a', teks: 'Bersih dan sudah dimasak', benar: true },
      { id: 'b', teks: 'Berwarna jernih saja' },
      { id: 'c', teks: 'Selalu dalam keadaan dingin' },
      { id: 'd', teks: 'Memiliki rasa manis' },
    ],
    penjelasan:
      'Air yang tampak jernih belum tentu bebas kuman. Di tempat penampungan yang padat, penyakit saluran pencernaan mudah menyebar, sehingga air harus dipastikan sudah dimasak.',
  },
  {
    id: 'soal-area-barak-pengungsian-sedang-1',
    area: 'area-barak-pengungsian',
    tingkat: 'sedang',
    pertanyaan: 'Mengapa kebersihan dan sanitasi di barak pengungsian harus sangat diperhatikan?',
    opsi: [
      { id: 'a', teks: 'Karena tempat yang padat penghuni sangat mudah menjadi tempat penyebaran penyakit', benar: true },
      { id: 'b', teks: 'Karena agar barak terlihat rapi saat diperiksa' },
      { id: 'c', teks: 'Karena air bersih di barak sangat terbatas' },
      { id: 'd', teks: 'Karena pengungsi tidak terbiasa menjaga kebersihan' },
    ],
    penjelasan:
      'Banyak orang berkumpul di ruang sempit dengan air dan sanitasi terbatas. Kondisi itu mempercepat penyebaran penyakit seperti diare dan infeksi saluran pernapasan.',
  },
  {
    id: 'soal-area-barak-pengungsian-sedang-2',
    area: 'area-barak-pengungsian',
    tingkat: 'sedang',
    pertanyaan: 'Pembagian bantuan di pengungsian sebaiknya didasarkan pada...',
    opsi: [
      { id: 'a', teks: 'Kebutuhan tiap kelompok, dengan memperhatikan bayi, ibu hamil, lansia, dan korban luka', benar: true },
      { id: 'b', teks: 'Siapa yang datang paling awal' },
      { id: 'c', teks: 'Siapa yang paling kuat dan paling cepat mengambil' },
      { id: 'd', teks: 'Siapa yang paling dekat dengan petugas' },
    ],
    penjelasan:
      'Bantuan darurat harus diberikan berdasarkan kebutuhan, bukan berdasarkan siapa yang paling cepat meminta. Kelompok rentan justru paling perlu didahulukan.',
  },
  {
    id: 'soal-area-barak-pengungsian-sedang-3',
    area: 'area-barak-pengungsian',
    tingkat: 'sedang',
    pertanyaan: 'Mengapa anak-anak di pengungsian perlu mendapat perhatian khusus?',
    opsi: [
      { id: 'a', teks: 'Karena mereka lebih rentan terhadap penyakit, gangguan psikologis, dan kehilangan pengawasan', benar: true },
      { id: 'b', teks: 'Karena mereka paling berisik di barak' },
      { id: 'c', teks: 'Karena mereka tidak memerlukan makanan' },
      { id: 'd', teks: 'Karena mereka sudah dapat bekerja membantu' },
    ],
    penjelasan:
      'Anak-anak memiliki daya tahan tubuh yang belum sempurna, lebih mudah mengalami trauma, dan mudah terpisah dari keluarganya. Karena itu mereka termasuk kelompok yang harus diutamakan.',
  },
  {
    id: 'soal-area-barak-pengungsian-sulit-1',
    area: 'area-barak-pengungsian',
    tingkat: 'sulit',
    pertanyaan: 'Mengapa pendataan pengungsi yang rapi sangat penting dalam penanganan bencana?',
    opsi: [
      { id: 'a', teks: 'Karena dari data itu dapat dihitung kebutuhan logistik dan obat, serta diketahui siapa yang belum ditemukan', benar: true },
      { id: 'b', teks: 'Karena agar barak pengungsian terlihat tertib' },
      { id: 'c', teks: 'Karena pemerintah memerlukan tanda tangan pengungsi' },
      { id: 'd', teks: 'Karena agar pengungsi tidak keluar dari barak' },
    ],
    penjelasan:
      'Tanpa data yang akurat, bantuan bisa berlebih di satu tempat dan kurang di tempat lain. Pendataan juga menjadi cara menemukan orang yang masih hilang.',
  },
  {
    id: 'soal-area-barak-pengungsian-sulit-2',
    area: 'area-barak-pengungsian',
    tingkat: 'sulit',
    pertanyaan:
      'Bila jumlah pengungsi melebihi kapasitas barak, tindakan yang paling tepat adalah...',
    opsi: [
      { id: 'a', teks: 'Menyiapkan lokasi penampungan tambahan dan memisahkan kelompok rentan agar tetap tertangani', benar: true },
      { id: 'b', teks: 'Menolak kedatangan pengungsi yang baru' },
      { id: 'c', teks: 'Membiarkan pengungsi berdesakan tanpa penanganan tambahan' },
      { id: 'd', teks: 'Memulangkan sebagian pengungsi ke zona bahaya' },
    ],
    penjelasan:
      'Kepadatan yang berlebihan mempercepat penyebaran penyakit dan menimbulkan ketegangan. Menolak atau memulangkan pengungsi bukan pilihan, karena keselamatan mereka yang diutamakan.',
  },
  {
    id: 'soal-area-barak-pengungsian-sulit-3',
    area: 'area-barak-pengungsian',
    tingkat: 'sulit',
    pertanyaan: 'Mengapa dukungan psikologis termasuk bagian penting penanganan di pengungsian?',
    opsi: [
      { id: 'a', teks: 'Karena bencana menimbulkan trauma yang dapat menghambat pemulihan bila tidak ditangani', benar: true },
      { id: 'b', teks: 'Karena agar pengungsi tidak menangis di depan orang lain' },
      { id: 'c', teks: 'Karena pemerintah mewajibkan setiap pengungsi didampingi' },
      { id: 'd', teks: 'Karena agar pengungsi cepat pulang ke rumahnya' },
    ],
    penjelasan:
      'Kebutuhan pengungsi tidak berhenti pada makanan dan tempat tinggal. Trauma yang tidak ditangani dapat mengganggu kesehatan dan kemampuan seseorang untuk kembali menjalani hidup normal.',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // LEVEL 1 — ZONA 'surface': PERMUKAAN BUMI (pengenalan struktur bumi)
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'soal-surface-mudah-1',
    area: 'surface',
    tingkat: 'mudah',
    pertanyaan: 'Urutan lapisan bumi dari yang paling LUAR ke yang paling dalam adalah...',
    opsi: [
      { id: 'a', teks: 'Kerak, mantel, inti luar, inti dalam', benar: true },
      { id: 'b', teks: 'Inti dalam, inti luar, mantel, kerak' },
      { id: 'c', teks: 'Mantel, kerak, inti dalam, inti luar' },
      { id: 'd', teks: 'Kerak, inti luar, mantel, inti dalam' },
    ],
    penjelasan:
      'Bumi tersusun berlapis seperti bawang: kerak bumi paling luar, lalu mantel yang paling tebal, kemudian inti luar, dan inti dalam di pusatnya.',
  },
  {
    id: 'soal-surface-mudah-2',
    area: 'surface',
    tingkat: 'mudah',
    pertanyaan: 'Semakin dalam kita masuk ke dalam bumi, suhu dan tekanannya...',
    opsi: [
      { id: 'a', teks: 'Semakin tinggi', benar: true },
      { id: 'b', teks: 'Semakin rendah' },
      { id: 'c', teks: 'Tetap tidak berubah' },
      { id: 'd', teks: 'Naik lalu kembali seperti semula' },
    ],
    penjelasan:
      'Suhu dan tekanan meningkat seiring bertambahnya kedalaman. Inilah sebabnya bagian terdalam bumi jauh lebih panas dan lebih tertekan daripada permukaannya.',
  },
  {
    id: 'soal-surface-mudah-3',
    area: 'surface',
    tingkat: 'mudah',
    pertanyaan: 'Jari-jari bumi dari permukaan sampai ke pusatnya kira-kira...',
    opsi: [
      { id: 'a', teks: '6.371 kilometer', benar: true },
      { id: 'b', teks: '637 kilometer' },
      { id: 'c', teks: '63.710 kilometer' },
      { id: 'd', teks: '6,371 kilometer' },
    ],
    penjelasan:
      'Jari-jari bumi sekitar 6.371 km. Kedalaman itu menjadi patokan: inti dalam baru dimulai pada kedalaman lebih dari 5.000 km.',
  },
  {
    id: 'soal-surface-sedang-1',
    area: 'surface',
    tingkat: 'sedang',
    pertanyaan: 'Mengapa manusia belum pernah berhasil menggali sampai ke mantel bumi?',
    opsi: [
      { id: 'a', teks: 'Karena suhu dan tekanannya terlalu ekstrem untuk alat maupun manusia', benar: true },
      { id: 'b', teks: 'Karena tidak ada yang mau membiayai penggalian' },
      { id: 'c', teks: 'Karena mantel bumi tidak berbentuk benda padat' },
      { id: 'd', teks: 'Karena mantel bumi terbuat dari logam yang sangat keras' },
    ],
    penjelasan:
      'Pada kedalaman beberapa kilometer saja, suhu dan tekanan sudah cukup untuk merusak alat bor. Lubang terdalam yang pernah dibuat manusia (Kola, Rusia) belum menembus kerak bumi.',
  },
  {
    id: 'soal-surface-sedang-2',
    area: 'surface',
    tingkat: 'sedang',
    pertanyaan: 'Bagaimana ilmuwan dapat mengetahui isi dalam bumi tanpa menggali ke sana?',
    opsi: [
      { id: 'a', teks: 'Dengan mengamati gelombang gempa yang merambat melewati lapisan-lapisan bumi', benar: true },
      { id: 'b', teks: 'Dengan mengukur suhu udara di permukaan' },
      { id: 'c', teks: 'Dengan melihat bentuk awan di langit' },
      { id: 'd', teks: 'Dengan menebak dari warna tanah di permukaan' },
    ],
    penjelasan:
      'Gelombang gempa merambat melalui seluruh bagian bumi. Kecepatan dan arah rambatnya berubah saat melewati lapisan yang sifatnya berbeda, dan dari perubahan itu ilmuwan menyusun gambaran lapisan dalam bumi.',
  },
  {
    id: 'soal-surface-sedang-3',
    area: 'surface',
    tingkat: 'sedang',
    pertanyaan: 'Lapisan bumi yang paling tebal dan menjadi penyusun terbesar volume bumi adalah...',
    opsi: [
      { id: 'a', teks: 'Mantel bumi', benar: true },
      { id: 'b', teks: 'Kerak bumi' },
      { id: 'c', teks: 'Inti luar' },
      { id: 'd', teks: 'Atmosfer' },
    ],
    penjelasan:
      'Mantel setebal sekitar 2.900 km sehingga menjadi lapisan tertebal. Kerak bumi hanya bagian tipis di permukaan, sedangkan inti bumi jauh lebih kecil volumenya.',
  },
  {
    id: 'soal-surface-sulit-1',
    area: 'surface',
    tingkat: 'sulit',
    pertanyaan:
      'Mengapa bertambahnya tekanan seiring kedalaman justru dapat membuat suatu zat TETAP padat meskipun suhunya sangat tinggi?',
    opsi: [
      { id: 'a', teks: 'Karena tekanan yang sangat besar menahan atom-atom untuk tidak dapat bergerak meleleh', benar: true },
      { id: 'b', teks: 'Karena tekanan tinggi menurunkan suhu zat tersebut' },
      { id: 'c', teks: 'Karena tekanan tinggi membuat zat berubah menjadi gas' },
      { id: 'd', teks: 'Karena tekanan tidak berpengaruh terhadap wujud zat' },
    ],
    penjelasan:
      'Meleleh terjadi bila atom dapat bergerak bebas meninggalkan susunannya. Tekanan yang sangat besar menekan atom-atom itu tetap rapat, sehingga zat tetap padat walau suhunya melampaui titik lelehnya pada tekanan biasa.',
  },
  {
    id: 'soal-surface-sulit-2',
    area: 'surface',
    tingkat: 'sulit',
    pertanyaan:
      'Jika gelombang gempa tercatat BERBELOK saat melewati suatu kedalaman tertentu, kesimpulan apa yang paling tepat?',
    opsi: [
      { id: 'a', teks: 'Pada kedalaman itu sifat material bumi berubah, sehingga ada batas antar-lapisan', benar: true },
      { id: 'b', teks: 'Gempa tersebut berhenti di kedalaman itu' },
      { id: 'c', teks: 'Tidak ada lapisan apa pun di bawah kedalaman itu' },
      { id: 'd', teks: 'Alat pencatatnya rusak' },
    ],
    penjelasan:
      'Gelombang merambat lurus bila sifat mediumnya seragam. Pembelokan menandakan sifat medium berubah, sehingga kedalaman itu dapat disimpulkan sebagai batas antara dua lapisan yang berbeda.',
  },
  {
    id: 'soal-surface-sulit-3',
    area: 'surface',
    tingkat: 'sulit',
    pertanyaan:
      'Mengapa mempelajari susunan dalam bumi penting bagi kehidupan manusia di permukaan?',
    opsi: [
      { id: 'a', teks: 'Karena proses di dalam bumi menggerakkan lempeng, menimbulkan gempa, dan membentuk gunung api yang memengaruhi keselamatan warga', benar: true },
      { id: 'b', teks: 'Karena susunan dalam bumi menentukan harga bahan bakar' },
      { id: 'c', teks: 'Karena susunan dalam bumi memengaruhi warna langit' },
      { id: 'd', teks: 'Karena susunan dalam bumi menentukan jumlah penduduk' },
    ],
    penjelasan:
      'Seluruh bencana geologi berawal dari proses di dalam bumi: arus konveksi mantel menggerakkan lempeng, tumbukan lempeng menimbulkan gempa, dan subduksi menghasilkan gunung api. Memahaminya adalah dasar kesiapsiagaan.',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // LEVEL 1 — ZONA 'outerCore': INTI LUAR
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'soal-outerCore-mudah-1',
    area: 'outerCore',
    tingkat: 'mudah',
    pertanyaan: 'Inti luar bumi tersusun dari logam...',
    opsi: [
      { id: 'a', teks: 'Besi dan nikel dalam keadaan cair', benar: true },
      { id: 'b', teks: 'Silikat dan aluminium dalam keadaan padat' },
      { id: 'c', teks: 'Air dan uap panas' },
      { id: 'd', teks: 'Batu granit dan pasir' },
    ],
    penjelasan:
      'Inti luar tersusun dari besi dan nikel yang mencair. Bagian inilah yang menjadi cair, sedangkan inti dalam tetap padat.',
  },
  {
    id: 'soal-outerCore-mudah-2',
    area: 'outerCore',
    tingkat: 'mudah',
    pertanyaan: 'Suhu di inti luar bumi mencapai sekitar...',
    opsi: [
      { id: 'a', teks: '5.000 derajat Celsius', benar: true },
      { id: 'b', teks: '500 derajat Celsius' },
      { id: 'c', teks: '50 derajat Celsius' },
      { id: 'd', teks: '15.000 derajat Celsius' },
    ],
    penjelasan:
      'Suhu inti luar sekitar 5.000°C, jauh melampaui titik leleh besi dan nikel. Karena itu logam di inti luar berada dalam keadaan cair.',
  },
  {
    id: 'soal-outerCore-mudah-3',
    area: 'outerCore',
    tingkat: 'mudah',
    pertanyaan: 'Inti luar terletak di antara...',
    opsi: [
      { id: 'a', teks: 'Mantel bumi dan inti dalam', benar: true },
      { id: 'b', teks: 'Kerak bumi dan mantel bumi' },
      { id: 'c', teks: 'Atmosfer dan kerak bumi' },
      { id: 'd', teks: 'Kerak samudra dan kerak benua' },
    ],
    penjelasan:
      'Urutannya dari luar ke dalam: kerak, mantel, lalu inti luar, dan terakhir inti dalam di pusatnya. Jadi inti luar tepat berada di antara mantel dan inti dalam.',
  },
  {
    id: 'soal-outerCore-sedang-1',
    area: 'outerCore',
    tingkat: 'sedang',
    pertanyaan: 'Mengapa besi dan nikel di inti luar berada dalam keadaan CAIR?',
    opsi: [
      { id: 'a', teks: 'Karena suhunya melampaui titik leleh besi dan nikel', benar: true },
      { id: 'b', teks: 'Karena tercampur air dari samudra' },
      { id: 'c', teks: 'Karena tekanannya terlalu rendah' },
      { id: 'd', teks: 'Karena mengandung banyak gas' },
    ],
    penjelasan:
      'Setiap logam meleleh bila suhunya melewati titik lelehnya. Suhu inti luar sekitar 5.000°C, sedangkan besi sudah meleleh pada sekitar 1.538°C, sehingga logam di sana mencair.',
  },
  {
    id: 'soal-outerCore-sedang-2',
    area: 'outerCore',
    tingkat: 'sedang',
    pertanyaan: 'Inti luar yang berupa logam cair dan terus berputar berperan penting sebagai...',
    opsi: [
      { id: 'a', teks: 'Penghasil medan magnet bumi', benar: true },
      { id: 'b', teks: 'Penghasil air tanah' },
      { id: 'c', teks: 'Penghasil angin muson' },
      { id: 'd', teks: 'Penghasil pasang surut laut' },
    ],
    penjelasan:
      'Logam cair yang bergerak di inti luar menghasilkan arus listrik, dan arus listrik itulah yang membangkitkan medan magnet bumi. Medan magnet ini melindungi kita dari radiasi angkasa.',
  },
  {
    id: 'soal-outerCore-sedang-3',
    area: 'outerCore',
    tingkat: 'sedang',
    pertanyaan: 'Gelombang gempa jenis S tidak dapat melewati inti luar. Apa artinya?',
    opsi: [
      { id: 'a', teks: 'Bahwa inti luar memang berwujud cair, karena gelombang S tidak dapat merambat di zat cair', benar: true },
      { id: 'b', teks: 'Bahwa inti luar berwujud padat yang sangat keras' },
      { id: 'c', teks: 'Bahwa inti luar tidak dilalui gempa sama sekali' },
      { id: 'd', teks: 'Bahwa inti luar berisi rongga kosong' },
    ],
    penjelasan:
      'Gelombang geser (S) hanya dapat merambat melalui zat padat. Fakta bahwa gelombang S tidak diteruskan oleh inti luar menjadi salah satu bukti terkuat bahwa inti luar berwujud cair.',
  },
  {
    id: 'soal-outerCore-sulit-1',
    area: 'outerCore',
    tingkat: 'sulit',
    pertanyaan:
      'Inti dalam bersuhu lebih tinggi daripada inti luar, tetapi inti dalam justru PADAT. Bagaimana ini mungkin?',
    opsi: [
      { id: 'a', teks: 'Karena tekanan di inti dalam jauh lebih besar, sehingga atom logam tertahan untuk tidak meleleh', benar: true },
      { id: 'b', teks: 'Karena inti dalam tersusun dari bahan yang berbeda sama sekali' },
      { id: 'c', teks: 'Karena inti dalam tidak pernah menerima panas dari inti luar' },
      { id: 'd', teks: 'Karena suhu inti dalam sebenarnya lebih rendah' },
    ],
    penjelasan:
      'Titik leleh sebuah zat naik bila tekanannya bertambah. Di inti dalam, tekanannya begitu besar sehingga titik leleh logam naik melebihi suhunya — dan logam itu tetap padat meski sangat panas.',
  },
  {
    id: 'soal-outerCore-sulit-2',
    area: 'outerCore',
    tingkat: 'sulit',
    pertanyaan:
      'Jika inti luar berhenti bergerak, apa yang paling mungkin terjadi pada bumi?',
    opsi: [
      { id: 'a', teks: 'Medan magnet bumi melemah atau hilang, sehingga permukaan bumi lebih terpapar radiasi angkasa', benar: true },
      { id: 'b', teks: 'Gravitasi bumi langsung hilang' },
      { id: 'c', teks: 'Bumi berhenti berputar pada porosnya' },
      { id: 'd', teks: 'Seluruh gunung api langsung padam' },
    ],
    penjelasan:
      'Medan magnet bumi dihasilkan oleh logam cair yang bergerak di inti luar. Bila gerakan itu berhenti, medan magnetnya melemah, dan kehidupan di permukaan kehilangan pelindung dari radiasi angkasa.',
  },
  {
    id: 'soal-outerCore-sulit-3',
    area: 'outerCore',
    tingkat: 'sulit',
    pertanyaan:
      'Mengapa penemuan bahwa gelombang S tidak melewati inti luar dianggap bukti yang sangat kuat, bukan sekadar dugaan?',
    opsi: [
      { id: 'a', teks: 'Karena sifat gelombang S yang tidak dapat merambat di zat cair adalah sifat fisika yang pasti, sehingga wujud inti luar dapat disimpulkan tanpa harus melihatnya', benar: true },
      { id: 'b', teks: 'Karena gelombang S hanya muncul pada gempa besar' },
      { id: 'c', teks: 'Karena gelombang S dapat dihitung dengan cepat' },
      { id: 'd', teks: 'Karena gelombang S hanya ada di Indonesia' },
    ],
    penjelasan:
      'Kesimpulan ini berdiri di atas sifat fisika yang sudah pasti: gelombang geser tidak dapat merambat melalui zat cair. Karena itu fakta "gelombang S tidak lewat" secara langsung memaksa kesimpulan "inti luar cair".',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // LEVEL 1 — ZONA 'innerCore': INTI DALAM
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'soal-innerCore-mudah-1',
    area: 'innerCore',
    tingkat: 'mudah',
    pertanyaan: 'Bagaimana wujud inti dalam bumi?',
    opsi: [
      { id: 'a', teks: 'Bola logam besi dan nikel yang padat', benar: true },
      { id: 'b', teks: 'Logam cair yang mengalir' },
      { id: 'c', teks: 'Batuan silikat yang kental' },
      { id: 'd', teks: 'Gas panas bertekanan tinggi' },
    ],
    penjelasan:
      'Inti dalam berupa bola logam besi dan nikel yang tetap padat, meskipun suhunya sangat tinggi, karena tekanannya luar biasa besar.',
  },
  {
    id: 'soal-innerCore-mudah-2',
    area: 'innerCore',
    tingkat: 'mudah',
    pertanyaan: 'Suhu di inti dalam bumi diperkirakan mencapai sekitar...',
    opsi: [
      { id: 'a', teks: '6.000 derajat Celsius', benar: true },
      { id: 'b', teks: '600 derajat Celsius' },
      { id: 'c', teks: '60 derajat Celsius' },
      { id: 'd', teks: '600.000 derajat Celsius' },
    ],
    penjelasan:
      'Suhu inti dalam diperkirakan sekitar 6.000°C, sebanding dengan suhu permukaan matahari. Tetapi tekanan yang sangat besar membuatnya tetap berwujud padat.',
  },
  {
    id: 'soal-innerCore-mudah-3',
    area: 'innerCore',
    tingkat: 'mudah',
    pertanyaan: 'Inti dalam terletak di...',
    opsi: [
      { id: 'a', teks: 'Pusat bumi, di dalam inti luar', benar: true },
      { id: 'b', teks: 'Antara kerak dan mantel' },
      { id: 'c', teks: 'Di bawah kerak samudra' },
      { id: 'd', teks: 'Di atas mantel bumi' },
    ],
    penjelasan:
      'Inti dalam adalah lapisan terdalam, berbentuk bola yang terselubung oleh inti luar. Karena itu ia berada di pusat bumi.',
  },
  {
    id: 'soal-innerCore-sedang-1',
    area: 'innerCore',
    tingkat: 'sedang',
    pertanyaan:
      'Apa yang menyebabkan atom logam di inti dalam tidak meleleh walaupun suhunya sangat tinggi?',
    opsi: [
      { id: 'a', teks: 'Tekanan yang luar biasa dahsyat dari seluruh massa bumi di atasnya', benar: true },
      { id: 'b', teks: 'Karena inti dalam tidak mengandung besi' },
      { id: 'c', teks: 'Karena inti dalam didinginkan oleh air bawah tanah' },
      { id: 'd', teks: 'Karena inti dalam tidak menerima panas dari mana pun' },
    ],
    penjelasan:
      'Tekanan dari seluruh massa bumi menekan atom-atom logam tetap rapat pada susunannya, sehingga atom tidak dapat bergerak bebas untuk meleleh. Inilah sebabnya inti dalam tetap padat.',
  },
  {
    id: 'soal-innerCore-sedang-2',
    area: 'innerCore',
    tingkat: 'sedang',
    pertanyaan: 'Mengapa suhu 6.000°C di inti dalam tidak terasa di permukaan bumi?',
    opsi: [
      { id: 'a', teks: 'Karena panas itu terhalang ribuan kilometer batuan yang bersifat penghantar panas buruk', benar: true },
      { id: 'b', teks: 'Karena panas di inti dalam tidak nyata' },
      { id: 'c', teks: 'Karena panas itu langsung keluar ke angkasa' },
      { id: 'd', teks: 'Karena inti dalam terbuat dari bahan yang tidak panas' },
    ],
    penjelasan:
      'Panas merambat melalui batuan dengan sangat lambat. Lapisan kerak dan mantel yang tebal menahan hampir seluruh panas itu, sehingga permukaan bumi tetap dapat dihuni.',
  },
  {
    id: 'soal-innerCore-sedang-3',
    area: 'innerCore',
    tingkat: 'sedang',
    pertanyaan: 'Perbedaan utama antara inti luar dan inti dalam adalah...',
    opsi: [
      { id: 'a', teks: 'Inti luar berwujud cair, sedangkan inti dalam berwujud padat', benar: true },
      { id: 'b', teks: 'Inti luar berwujud padat, sedangkan inti dalam cair' },
      { id: 'c', teks: 'Inti luar mengandung air, inti dalam mengandung gas' },
      { id: 'd', teks: 'Inti luar lebih panas daripada inti dalam' },
    ],
    penjelasan:
      'Walaupun sama-sama tersusun dari besi dan nikel, inti luar mencair sedangkan inti dalam tetap padat. Penyebabnya adalah tekanan: tekanan di inti dalam jauh lebih besar sehingga menaikkan titik leleh logam di sana.',
  },
  {
    id: 'soal-innerCore-sulit-1',
    area: 'innerCore',
    tingkat: 'sulit',
    pertanyaan:
      'Seorang siswa berpendapat: "Inti dalam pasti lebih dingin daripada inti luar, sebab kalau tidak, ia akan meleleh." Di mana kesalahan penalaran itu?',
    opsi: [
      { id: 'a', teks: 'Suhu bukan satu-satunya penentu wujud zat; tekanan juga menaikkan titik leleh, sehingga zat bisa tetap padat meski lebih panas', benar: true },
      { id: 'b', teks: 'Kesalahannya adalah inti dalam memang tidak mengandung logam' },
      { id: 'c', teks: 'Kesalahannya adalah inti dalam sebenarnya juga mencair' },
      { id: 'd', teks: 'Kesalahannya adalah suhu tidak dapat diukur di dalam bumi' },
    ],
    penjelasan:
      'Wujud zat ditentukan oleh suhu DAN tekanan. Pada tekanan yang jauh lebih besar, titik leleh logam naik, sehingga inti dalam dapat lebih panas daripada inti luar namun tetap berwujud padat.',
  },
  {
    id: 'soal-innerCore-sulit-2',
    area: 'innerCore',
    tingkat: 'sulit',
    pertanyaan:
      'Mengapa para ilmuwan memperkirakan inti bumi tersusun dari besi dan nikel, padahal tidak ada yang pernah mengambil sampelnya?',
    opsi: [
      { id: 'a', teks: 'Karena meteorit yang jatuh ke bumi banyak yang tersusun dari besi dan nikel, dan karena massa jenis bumi hanya masuk akal bila bagian dalamnya berupa logam berat', benar: true },
      { id: 'b', teks: 'Karena besi dan nikel banyak dijual di pasaran' },
      { id: 'c', teks: 'Karena besi dan nikel berwarna gelap seperti inti bumi' },
      { id: 'd', teks: 'Karena besi dan nikel tidak dapat meleleh' },
    ],
    penjelasan:
      'Ada dua bukti tidak langsung. Pertama, meteorit yang dianggap sisa pembentukan planet banyak mengandung besi dan nikel. Kedua, massa jenis rata-rata bumi hanya dapat dijelaskan bila bagian dalamnya berupa logam yang jauh lebih berat daripada batuan permukaan.',
  },
  {
    id: 'soal-innerCore-sulit-3',
    area: 'innerCore',
    tingkat: 'sulit',
    pertanyaan:
      'Panas dari inti bumi akhirnya ikut berperan membentuk gunung api di permukaan. Bagaimana rangkaian peristiwanya?',
    opsi: [
      { id: 'a', teks: 'Panas inti memanaskan mantel sehingga terjadi arus konveksi, arus itu menggerakkan lempeng, dan lempeng yang menunjam meleleh menjadi magma yang naik ke permukaan', benar: true },
      { id: 'b', teks: 'Panas inti naik langsung melalui udara lalu membakar puncak gunung' },
      { id: 'c', teks: 'Panas inti menarik air laut ke puncak gunung' },
      { id: 'd', teks: 'Panas inti tidak berhubungan sama sekali dengan gunung api' },
    ],
    penjelasan:
      'Rangkaiannya berjalan bertahap: panas inti ➜ konveksi mantel ➜ pergerakan lempeng ➜ subduksi dan pelelehan ➜ magma naik ➜ letusan. Karena itu gunung api tidak muncul di sembarang tempat, melainkan di batas lempeng.',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // LEVEL 1 — ZONA 'divergent': BATAS DIVERGEN
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'soal-divergent-mudah-1',
    area: 'divergent',
    tingkat: 'mudah',
    pertanyaan: 'Batas divergen adalah batas lempeng yang kedua lempengnya...',
    opsi: [
      { id: 'a', teks: 'Saling menjauh', benar: true },
      { id: 'b', teks: 'Saling bertumbukan' },
      { id: 'c', teks: 'Bergesekan mendatar' },
      { id: 'd', teks: 'Tidak bergerak sama sekali' },
    ],
    penjelasan:
      'Divergen berarti memisah. Kedua lempeng bergerak saling menjauh sehingga terbentuk celah yang diisi magma dari dalam bumi.',
  },
  {
    id: 'soal-divergent-mudah-2',
    area: 'divergent',
    tingkat: 'mudah',
    pertanyaan: 'Batas divergen di dasar samudra membentuk...',
    opsi: [
      { id: 'a', teks: 'Punggung tengah samudra', benar: true },
      { id: 'b', teks: 'Palung laut yang sangat dalam' },
      { id: 'c', teks: 'Pegunungan lipatan' },
      { id: 'd', teks: 'Danau vulkanik' },
    ],
    penjelasan:
      'Magma yang naik melalui celah kemudian membeku dan menumpuk, membentuk rangkaian pegunungan di dasar samudra yang disebut punggung tengah samudra.',
  },
  {
    id: 'soal-divergent-mudah-3',
    area: 'divergent',
    tingkat: 'mudah',
    pertanyaan: 'Magma yang naik di batas divergen kemudian membeku menjadi...',
    opsi: [
      { id: 'a', teks: 'Kerak bumi yang baru', benar: true },
      { id: 'b', teks: 'Palung laut' },
      { id: 'c', teks: 'Awan panas' },
      { id: 'd', teks: 'Batu bara' },
    ],
    penjelasan:
      'Di batas divergen, kerak baru terus terbentuk dari magma yang membeku. Karena itu batas divergen disebut juga zona pembentukan kerak baru.',
  },
  {
    id: 'soal-divergent-sedang-1',
    area: 'divergent',
    tingkat: 'sedang',
    pertanyaan: 'Mengapa batas divergen disebut sebagai tempat lahirnya kerak baru?',
    opsi: [
      { id: 'a', teks: 'Karena magma dari dalam bumi naik mengisi celah dan membeku menjadi kerak baru', benar: true },
      { id: 'b', teks: 'Karena kerak lama terangkat ke permukaan' },
      { id: 'c', teks: 'Karena air laut berubah menjadi batuan' },
      { id: 'd', teks: 'Karena angin menumpuk pasir di dasar laut' },
    ],
    penjelasan:
      'Saat lempeng saling menjauh, celah di antaranya terisi magma. Magma itu membeku dan menjadi kerak baru, sehingga luas kerak bumi bertambah di tempat itu.',
  },
  {
    id: 'soal-divergent-sedang-2',
    area: 'divergent',
    tingkat: 'sedang',
    pertanyaan: 'Jika kerak baru terus terbentuk di batas divergen, mengapa bumi tidak semakin besar?',
    opsi: [
      { id: 'a', teks: 'Karena di tempat lain kerak bumi menunjam kembali ke dalam mantel pada zona subduksi', benar: true },
      { id: 'b', teks: 'Karena kerak baru langsung menguap' },
      { id: 'c', teks: 'Karena kerak baru berubah menjadi air laut' },
      { id: 'd', teks: 'Karena kerak baru tidak benar-benar bertambah' },
    ],
    penjelasan:
      'Kerak yang terbentuk di batas divergen kelak menunjam kembali ke mantel di zona subduksi. Karena ada yang lahir dan ada yang tenggelam, luas permukaan bumi tetap seimbang.',
  },
  {
    id: 'soal-divergent-sedang-3',
    area: 'divergent',
    tingkat: 'sedang',
    pertanyaan: 'Mengapa Indonesia memiliki banyak gunung api, padahal batas divergen justru lebih banyak di dasar samudra?',
    opsi: [
      { id: 'a', teks: 'Karena gunung api Indonesia terbentuk di batas KONVERGEN (zona subduksi), bukan di batas divergen', benar: true },
      { id: 'b', teks: 'Karena Indonesia berada di tengah lempeng yang sangat besar' },
      { id: 'c', teks: 'Karena gunung api Indonesia berasal dari batas divergen di daratan' },
      { id: 'd', teks: 'Karena gunung api tidak berhubungan dengan batas lempeng' },
    ],
    penjelasan:
      'Gunung api Indonesia terbentuk oleh subduksi lempeng samudra di bawah lempeng benua, yaitu pada batas konvergen. Batas divergen lebih banyak terdapat di dasar samudra, jauh dari Indonesia.',
  },
  {
    id: 'soal-divergent-sulit-1',
    area: 'divergent',
    tingkat: 'sulit',
    pertanyaan:
      'Mengapa batuan kerak yang paling dekat dengan punggung tengah samudra berusia paling MUDA, sedangkan yang semakin jauh semakin tua?',
    opsi: [
      { id: 'a', teks: 'Karena kerak baru terbentuk di punggung itu dan terus mendorong kerak yang lebih tua ke samping seiring waktu', benar: true },
      { id: 'b', teks: 'Karena kerak yang jauh dari punggung lebih cepat lapuk' },
      { id: 'c', teks: 'Karena kerak yang dekat punggung baru saja terangkat dari palung' },
      { id: 'd', teks: 'Karena kerak yang jauh berasal dari benua yang berbeda' },
    ],
    penjelasan:
      'Kerak baru selalu lahir di punggung tengah samudra, lalu terdorong menjauh oleh kerak yang lebih baru di belakangnya. Semakin jauh dari punggung, semakin lama kerak itu terbentuk — jadi semakin tua usianya.',
  },
  {
    id: 'soal-divergent-sulit-2',
    area: 'divergent',
    tingkat: 'sulit',
    pertanyaan:
      'Benua-benua yang kini terpisah oleh samudra dahulu pernah menyatu (Pangea). Proses apa yang memisahkan mereka?',
    opsi: [
      { id: 'a', teks: 'Terbentuknya kerak baru di batas divergen yang mendorong benua-benua saling menjauh', benar: true },
      { id: 'b', teks: 'Gempa besar yang memecah benua menjadi potongan kecil' },
      { id: 'c', teks: 'Air laut yang mengikis benua secara perlahan' },
      { id: 'd', teks: 'Letusan gunung api yang melempar benua ke tempat lain' },
    ],
    penjelasan:
      'Kerak baru yang terus terbentuk di punggung tengah samudra bekerja seperti ban berjalan yang melebarkan dasar samudra. Pelan-pelan, benua-benua yang dahulu menyatu terdorong saling menjauh.',
  },
  {
    id: 'soal-divergent-sulit-3',
    area: 'divergent',
    tingkat: 'sulit',
    pertanyaan:
      'Islandia terbelah oleh batas divergen yang muncul di DARATAN. Apa yang paling mungkin dijumpai di sana?',
    opsi: [
      { id: 'a', teks: 'Aktivitas gunung api dan retakan besar yang membelah wilayah, karena magma naik melalui celah lempeng', benar: true },
      { id: 'b', teks: 'Palung laut yang sangat dalam di tengah pulau' },
      { id: 'c', teks: 'Pegunungan lipatan tinggi seperti Himalaya' },
      { id: 'd', teks: 'Tidak ada aktivitas geologi sama sekali' },
    ],
    penjelasan:
      'Pada batas divergen, magma naik mengisi celah lempeng. Bila itu terjadi di daratan, hasilnya adalah retakan besar yang membelah wilayah disertai aktivitas gunung api — persis seperti yang dijumpai di Islandia.',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // LEVEL 1 — ZONA 'transform': BATAS TRANSFORM
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'soal-transform-mudah-1',
    area: 'transform',
    tingkat: 'mudah',
    pertanyaan: 'Pada batas transform, kedua lempeng bergerak...',
    opsi: [
      { id: 'a', teks: 'Bergesekan mendatar saling berlawanan arah', benar: true },
      { id: 'b', teks: 'Saling menjauh dan membentuk kerak baru' },
      { id: 'c', teks: 'Saling bertumbukan sampai salah satu menunjam' },
      { id: 'd', teks: 'Naik ke atas permukaan laut' },
    ],
    penjelasan:
      'Pada batas transform, kedua lempeng tidak menjauh dan tidak menunjam, melainkan bergesekan menyamping dengan arah yang berlawanan.',
  },
  {
    id: 'soal-transform-mudah-2',
    area: 'transform',
    tingkat: 'mudah',
    pertanyaan: 'Bencana yang paling sering ditimbulkan oleh batas transform adalah...',
    opsi: [
      { id: 'a', teks: 'Gempa bumi', benar: true },
      { id: 'b', teks: 'Letusan gunung api' },
      { id: 'c', teks: 'Banjir bandang' },
      { id: 'd', teks: 'Angin topan' },
    ],
    penjelasan:
      'Gesekan mendatar menyimpan energi yang sangat besar. Saat batuan tidak lagi kuat menahannya, energi itu dilepaskan sebagai gempa bumi.',
  },
  {
    id: 'soal-transform-mudah-3',
    area: 'transform',
    tingkat: 'mudah',
    pertanyaan: 'Contoh batas transform yang terkenal di dunia adalah...',
    opsi: [
      { id: 'a', teks: 'Sesar San Andreas di Amerika Serikat', benar: true },
      { id: 'b', teks: 'Pegunungan Himalaya' },
      { id: 'c', teks: 'Punggung Tengah Samudra' },
      { id: 'd', teks: 'Palung Jawa' },
    ],
    penjelasan:
      'Sesar San Andreas adalah contoh klasik batas transform. Himalaya contoh tumbukan benua, Punggung Tengah Samudra contoh divergen, dan Palung Jawa contoh subduksi.',
  },
  {
    id: 'soal-transform-sedang-1',
    area: 'transform',
    tingkat: 'sedang',
    pertanyaan: 'Mengapa di batas transform biasanya TIDAK terbentuk gunung api?',
    opsi: [
      { id: 'a', teks: 'Karena tidak ada lempeng yang menunjam dan meleleh, sehingga tidak ada magma yang naik', benar: true },
      { id: 'b', teks: 'Karena di batas transform tidak ada panas sama sekali' },
      { id: 'c', teks: 'Karena batuannya terlalu keras untuk dilewati magma' },
      { id: 'd', teks: 'Karena batas transform hanya ada di dasar laut' },
    ],
    penjelasan:
      'Gunung api memerlukan magma, dan magma dihasilkan oleh lempeng yang menunjam lalu meleleh. Di batas transform tidak ada yang menunjam maupun meleleh, sehingga tidak ada gunung api yang terbentuk.',
  },
  {
    id: 'soal-transform-sedang-2',
    area: 'transform',
    tingkat: 'sedang',
    pertanyaan: 'Apa yang terjadi pada batuan di sepanjang sesar mendatar saat kedua lempeng terus bergesekan?',
    opsi: [
      { id: 'a', teks: 'Terkumpul energi yang makin lama makin besar sampai akhirnya terlepas sebagai gempa', benar: true },
      { id: 'b', teks: 'Meleleh dan menjadi magma' },
      { id: 'c', teks: 'Berubah menjadi kerak baru' },
      { id: 'd', teks: 'Menguap menjadi gas' },
    ],
    penjelasan:
      'Gesekan menahan pergerakan lempeng dan menyimpan energi di batuan. Ketika batuan tidak lagi mampu menahan, energi itu terlepas sekaligus sebagai gempa bumi.',
  },
  {
    id: 'soal-transform-sedang-3',
    area: 'transform',
    tingkat: 'sedang',
    pertanyaan: 'Perbedaan paling mendasar antara batas transform dan batas konvergen adalah...',
    opsi: [
      { id: 'a', teks: 'Pada transform lempeng bergesekan menyamping, sedangkan pada konvergen lempeng saling bertumbukan dan salah satunya dapat menunjam', benar: true },
      { id: 'b', teks: 'Pada transform selalu terjadi letusan, pada konvergen tidak' },
      { id: 'c', teks: 'Pada transform lempeng saling menjauh, pada konvergen saling mendekat' },
      { id: 'd', teks: 'Tidak ada perbedaan keduanya' },
    ],
    penjelasan:
      'Arah geraknya yang berbeda. Transform: menggeser menyamping. Konvergen: saling mendekat hingga bertumbukan, dan dapat menghasilkan subduksi beserta gunung api.',
  },
  {
    id: 'soal-transform-sulit-1',
    area: 'transform',
    tingkat: 'sulit',
    pertanyaan:
      'Mengapa gempa yang berasal dari batas transform dapat sangat merusak, walaupun tidak menimbulkan gunung api?',
    opsi: [
      { id: 'a', teks: 'Karena gempanya dangkal dan berlangsung di daratan tempat banyak pemukiman, sehingga getarannya kuat dan langsung mengenai bangunan', benar: true },
      { id: 'b', teks: 'Karena gempa transform selalu berkekuatan paling besar di dunia' },
      { id: 'c', teks: 'Karena gempa transform diikuti oleh awan panas' },
      { id: 'd', teks: 'Karena gempa transform tidak dapat terdeteksi alat' },
    ],
    penjelasan:
      'Sesar mendatar banyak terdapat di daratan dan sumber gempanya relatif dangkal. Getaran dari sumber yang dangkal sampai ke permukaan dengan kekuatan yang masih besar, sehingga kerusakan bangunan bisa sangat parah.',
  },
  {
    id: 'soal-transform-sulit-2',
    area: 'transform',
    tingkat: 'sulit',
    pertanyaan:
      'Bagaimana batas transform dapat dibuktikan dari pengamatan di permukaan tanah?',
    opsi: [
      { id: 'a', teks: 'Adanya alur sungai, jalan, atau pagar yang tiba-tiba tergeser ke samping', benar: true },
      { id: 'b', teks: 'Adanya kubah magma yang naik ke permukaan' },
      { id: 'c', teks: 'Adanya palung yang sangat dalam' },
      { id: 'd', teks: 'Adanya kerak baru yang terbentuk' },
    ],
    penjelasan:
      'Pergeseran mendatar meninggalkan jejak yang terlihat: alur sungai, jalan, bahkan pagar yang dahulu lurus menjadi terbelah dan bergeser ke samping. Jejak inilah bukti nyata pergerakan sesar mendatar.',
  },
  {
    id: 'soal-transform-sulit-3',
    area: 'transform',
    tingkat: 'sulit',
    pertanyaan:
      'Ketiga jenis batas lempeng sama-sama dapat menimbulkan gempa. Mengapa gempa akibat subduksi bisa jauh lebih besar daripada gempa akibat batas divergen?',
    opsi: [
      { id: 'a', teks: 'Karena pada subduksi lempeng yang panjang dan besar menunjam masuk sekaligus, sehingga bidang patahannya jauh lebih luas', benar: true },
      { id: 'b', teks: 'Karena pada subduksi tidak ada gesekan sama sekali' },
      { id: 'c', teks: 'Karena batas divergen tidak dapat menghasilkan gempa' },
      { id: 'd', teks: 'Karena subduksi terjadi lebih dekat ke permukaan' },
    ],
    penjelasan:
      'Kekuatan gempa bergantung pada luas bidang patahan yang bergeser sekaligus. Pada zona subduksi, bidang pertemuan lempengnya sangat luas dan panjang, sehingga gempa yang dilepaskan bisa jauh lebih besar.',
  },
];

/** Seluruh soal milik satu area. */
export function soalUntukArea(area: string): Soal[] {
  return BANK_SOAL.filter((s) => s.area === area);
}

/** Soal satu area pada satu tingkat kesulitan. */
export function soalUntukAreaTingkat(area: string, tingkat: TingkatKesulitan): Soal[] {
  return BANK_SOAL.filter((s) => s.area === area && s.tingkat === tingkat);
}

/** Kunci jawaban sebuah soal (id opsi yang benar), atau null bila tidak ada. */
export function kunciJawaban(soal: Soal): string | null {
  const benar = soal.opsi.find((o) => o.benar === true);
  return benar ? benar.id : null;
}
