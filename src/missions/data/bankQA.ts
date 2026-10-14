// ── src/missions/data/bankQA.ts ──────────────────────────────────────────────
// BANK TANYA-JAWAB GURU UNTUK CHATBOT RESQY.
//
// ═══════════════════════════════════════════════════════════════════════════
// MENGAPA BANK QA, BUKAN LANGSUNG KE API
// ═══════════════════════════════════════════════════════════════════════════
//
//   Pemilik proyek ingin chatbot, tetapi khawatir biaya: "kalau chatbotnya
//   dipakai banyak orang, nanti tokennya habis bagaimana?"
//
//   Kekhawatiran itu benar dan mudah dihitung. Satu sekolah dengan 30 siswa,
//   masing-masing bertanya 10 kali, sudah 300 permintaan per hari. Dikalikan
//   beberapa sekolah, biayanya menjadi tidak terbatas dan tidak dapat
//   dianggarkan oleh sekolah.
//
//   Solusinya: jawabannya TIDAK dibuat oleh AI, melainkan ditulis oleh GURU
//   lebih dahulu. Chatbot lalu mencocokkan pertanyaan siswa dengan bank ini
//   secara lokal. Akibatnya:
//
//     - BIAYA NOL. Tidak ada permintaan jaringan sama sekali.
//     - JALAN TANPA INTERNET. Penting, karena saat bencana jaringan sering mati.
//     - JAWABANNYA PASTI BENAR, karena ditulis dan diperiksa guru — bukan
//       hasil tebakan model bahasa yang bisa keliru.
//     - TIDAK ADA DATA SISWA YANG KELUAR dari perangkat sekolah.
//
//   Ini juga menjawab keprihatinan guru: jawaban chatbot dapat dipertanggung-
//   jawabkan di depan kelas, karena gurulah penulisnya.
//
// ═══════════════════════════════════════════════════════════════════════════
// CARA MENAMBAH JAWABAN
// ═══════════════════════════════════════════════════════════════════════════
//
//   1. Tulis `pertanyaan` seperti guru akan menanyakannya.
//   2. Isi `kataKunci` — kata-kata yang PASTI muncul bila siswa menanyakan hal
//      ini. Tidak perlu lengkap; mesin pencocokan memberi bobot lebih besar
//      pada kata kunci yang panjang dan jarang.
//   3. Isi `frasa` untuk rangkaian kata yang bila muncul harus langsung cocok
//      (mis. "awan panas", "drop cover hold on").
//   4. Tulis `jawaban` dengan bahasa yang dapat dipahami siswa SMP.
//
//   `topik` dipakai untuk memberi SARAN bila pertanyaan siswa tidak ditemukan,
//   supaya chatbot tetap menolong dan tidak hanya menjawab "tidak tahu".

export interface EntriQA {
  /** Unik di seluruh bank, mis. 'qa-struktur-bumi'. */
  id: string;
  /** Pertanyaan contoh sebagaimana ditulis guru. */
  pertanyaan: string;
  /** Kata kunci pencocokan. Kata yang lebih spesifik lebih menentukan. */
  kataKunci: string[];
  /** Rangkaian kata yang bila muncul utuh langsung dianggap cocok. */
  frasa?: string[];
  /** Jawaban yang ditulis dan dipertanggungjawabkan guru. */
  jawaban: string;
  /** Topik singkat, untuk memberi saran saat tidak ada yang cocok. */
  topik: string;
  /** Id area terkait (opsional), mis. 'crust' atau 'area-simulasi-gempa'. */
  areaTerkait?: string;
}

export const BANK_QA: EntriQA[] = [
  // ── STRUKTUR BUMI ────────────────────────────────────────────────────────
  {
    id: 'qa-lapisan-bumi',
    pertanyaan: 'Ada berapa lapisan di dalam bumi?',
    kataKunci: ['lapisan', 'bumi', 'struktur', 'susunan', 'dalam'],
    frasa: ['lapisan bumi', 'struktur bumi'],
    jawaban:
      'Bumi tersusun dari empat lapisan utama, dari luar ke dalam: (1) kerak bumi, (2) mantel, (3) inti luar, dan (4) inti dalam. Makin ke dalam, suhu dan tekanannya makin tinggi.',
    topik: 'Struktur Bumi',
    areaTerkait: 'crust',
  },
  {
    id: 'qa-kerak-bumi',
    pertanyaan: 'Apa itu kerak bumi?',
    kataKunci: ['kerak', 'kulit', 'bumi', 'benua', 'samudra', 'tipis'],
    frasa: ['kerak bumi', 'kerak benua', 'kerak samudra'],
    jawaban:
      'Kerak bumi adalah lapisan paling luar tempat kita tinggal. Ada dua jenis: kerak benua (tebal 30–100 km) dan kerak samudra (tipis 5–15 km). Walaupun lebih tipis, kerak samudra lebih berat karena batuannya lebih padat.',
    topik: 'Struktur Bumi',
    areaTerkait: 'crust',
  },
  {
    id: 'qa-mantel-bumi',
    pertanyaan: 'Apa itu mantel bumi dan apa bahannya?',
    kataKunci: ['mantel', 'astenosfer', 'tebal', 'silikat', 'adonan', 'kental'],
    frasa: ['mantel bumi', 'lapisan mantel'],
    jawaban:
      'Mantel adalah lapisan tertebal di bumi, sekitar 2.900 km, dengan suhu 1.000°C sampai 3.700°C. Materialnya berwujud fluida sangat kental seperti adonan — tidak padat kaku, dan tidak pula encer seperti air. Karena sangat kental, ia mengalir sangat lambat, hanya beberapa sentimeter per tahun.',
    topik: 'Struktur Bumi',
    areaTerkait: 'mantle',
  },
  {
    id: 'qa-mantel-bukan-padat',
    pertanyaan: 'Apakah mantel bumi itu batuan padat?',
    kataKunci: ['mantel', 'padat', 'batuan', 'kaku', 'cair', 'padat'],
    frasa: ['mantel padat', 'batuan padat'],
    jawaban:
      'Bukan. Material mantel bukan batuan padat yang kaku. Wujudnya fluida sangat kental, seperti adonan yang mengalir sangat lambat. Tetapi mantel juga bukan cairan encer — sebab gelombang gempa jenis S dapat melewatinya, dan gelombang S tidak dapat merambat melalui zat cair.',
    topik: 'Struktur Bumi',
    areaTerkait: 'mantle',
  },
  {
    id: 'qa-inti-bumi',
    pertanyaan: 'Apa itu inti luar dan inti dalam?',
    kataKunci: ['inti', 'luar', 'dalam', 'besi', 'nikel', 'logam', 'cair'],
    frasa: ['inti luar', 'inti dalam', 'inti bumi'],
    jawaban:
      'Inti luar berupa logam besi dan nikel yang mencair, bersuhu sekitar 5.000°C. Inti dalam berupa logam yang tetap padat meski suhunya sekitar 6.000°C, karena tekanan di sana luar biasa dahsyat sehingga atom logam tidak dapat meleleh.',
    topik: 'Struktur Bumi',
    areaTerkait: 'innerCore',
  },
  {
    id: 'qa-konveksi-mantel',
    pertanyaan: 'Apa itu arus konveksi di mantel?',
    kataKunci: ['konveksi', 'arus', 'mantel', 'panas', 'naik', 'turun', 'sel'],
    frasa: ['arus konveksi', 'sel konveksi'],
    jawaban:
      'Arus konveksi adalah siklus tertutup di dalam mantel. Material yang panas memuai, menjadi lebih ringan, lalu naik. Setelah mendingin di dekat kerak, material menyusut, menjadi lebih rapat, lalu turun kembali. Siklus inilah yang menyeret lempeng di atasnya, sehingga mantel disebut mesin penggerak lempeng bumi.',
    topik: 'Lempeng Tektonik',
    areaTerkait: 'mantle',
  },
  {
    id: 'qa-astenosfer',
    pertanyaan: 'Apa itu astenosfer?',
    kataKunci: ['astenosfer', 'lempeng', 'mengapung', 'kental', 'bergerak'],
    jawaban:
      'Astenosfer adalah lapisan kental di bagian atas mantel, tepat di bawah kerak. Karena mampu mengalir sangat lambat, lapisan ini menjadi alas yang memungkinkan lempeng bumi bergerak di atasnya.',
    topik: 'Struktur Bumi',
    areaTerkait: 'crust',
  },

  // ── LEMPENG TEKTONIK ─────────────────────────────────────────────────────
  {
    id: 'qa-lempeng-tektonik',
    pertanyaan: 'Apa itu lempeng tektonik?',
    kataKunci: ['lempeng', 'tektonik', 'bergerak', 'pecahan', 'kerak'],
    frasa: ['lempeng tektonik'],
    jawaban:
      'Lempeng tektonik adalah pecahan-pecahan besar kerak bumi yang mengapung di atas lapisan mantel yang kental. Lempeng-lempeng ini bergerak sangat lambat, hanya beberapa sentimeter per tahun, tetapi pergerakannya membentuk gunung, palung, dan menyebabkan gempa.',
    topik: 'Lempeng Tektonik',
  },
  {
    id: 'qa-tiga-batas-lempeng',
    pertanyaan: 'Apa saja jenis batas lempeng?',
    kataKunci: ['batas', 'lempeng', 'divergen', 'konvergen', 'transform'],
    frasa: ['batas lempeng', 'batas divergen', 'batas konvergen', 'batas transform'],
    jawaban:
      'Ada tiga: (1) divergen — lempeng saling menjauh, membentuk kerak baru di punggung tengah samudra; (2) konvergen — lempeng saling bertumbukan, membentuk palung dan gunung api; (3) transform — lempeng bergesekan mendatar saling berlawanan arah, menimbulkan gempa tanpa gunung api.',
    topik: 'Lempeng Tektonik',
    areaTerkait: 'convergent',
  },
  {
    id: 'qa-divergen',
    pertanyaan: 'Apa yang terjadi pada batas divergen?',
    kataKunci: ['divergen', 'menjauh', 'memisah', 'punggung', 'bukit', 'kerak', 'baru'],
    frasa: ['batas divergen', 'punggung tengah samudra'],
    jawaban:
      'Pada batas divergen, dua lempeng bergerak saling menjauh. Magma dari dalam bumi naik mengisi celah, lalu membeku dan membentuk kerak baru. Di dasar samudra, bentuknya berupa punggung tengah samudra.',
    topik: 'Lempeng Tektonik',
    areaTerkait: 'divergent',
  },
  {
    id: 'qa-konvergen-subduksi',
    pertanyaan: 'Apa yang terjadi pada batas konvergen?',
    kataKunci: ['konvergen', 'tumbukan', 'subduksi', 'menunjam', 'palung', 'gunung', 'api'],
    frasa: ['batas konvergen', 'zona subduksi'],
    jawaban:
      'Pada batas konvergen, dua lempeng saling bertumbukan. Bila lempeng samudra bertemu lempeng benua, lempeng samudra yang lebih berat menunjam ke bawah (subduksi). Lempeng yang menunjam meleleh menjadi magma, lalu magma naik dan membentuk gunung api. Dasar laut di atas zona subduksi melengkung turun menjadi palung.',
    topik: 'Lempeng Tektonik',
    areaTerkait: 'convergent',
  },
  {
    id: 'qa-himalaya',
    pertanyaan: 'Mengapa di Himalaya tidak ada gunung api?',
    kataKunci: ['himalaya', 'benua', 'tumbukan', 'kolisi', 'gunung', 'api', 'lipatan', 'pegunungan'],
    frasa: ['dua lempeng benua', 'pegunungan lipatan', 'tumbukan benua'],
    jawaban:
      'Gunung api memerlukan magma, dan magma dihasilkan oleh lempeng yang menunjam lalu meleleh. Pada tumbukan dua lempeng BENUA, keduanya sama-sama ringan sehingga tidak ada yang mampu menunjam. Karena tidak ada subduksi, tidak ada magma yang naik. Yang terjadi adalah keduanya terangkat dan terlipat, membentuk pegunungan lipatan seperti Himalaya.',
    topik: 'Lempeng Tektonik',
    areaTerkait: 'convergent',
  },
  {
    id: 'qa-subduksi-vs-kolisi',
    pertanyaan: 'Apa bedanya subduksi dan kolisi?',
    kataKunci: ['subduksi', 'kolisi', 'beda', 'perbedaan', 'menunjam', 'tumbukan', 'benua', 'samudra'],
    frasa: ['subduksi dan kolisi', 'beda subduksi'],
    jawaban:
      'Subduksi terjadi bila lempeng samudra bertemu lempeng benua: lempeng samudra yang lebih berat menunjam, meleleh, lalu membentuk gunung api (contoh: gunung api di Jawa). Kolisi terjadi bila dua lempeng benua bertumbukan: tidak ada yang menunjam karena keduanya ringan, sehingga terbentuk pegunungan lipatan (contoh: Himalaya).',
    topik: 'Lempeng Tektonik',
    areaTerkait: 'convergent',
  },
  {
    id: 'qa-transform',
    pertanyaan: 'Apa itu batas transform?',
    kataKunci: ['transform', 'gesek', 'mendatar', 'horizontal', 'berlawanan', 'sesar'],
    frasa: ['batas transform', 'sesar mendatar'],
    jawaban:
      'Pada batas transform, dua lempeng bergesekan mendatar saling berlawanan arah. Tidak ada kerak yang terbentuk maupun yang tenggelam, tetapi gesekannya menyimpan energi yang dilepaskan sebagai gempa bumi. Contohnya Sesar San Andreas di Amerika Serikat.',
    topik: 'Lempeng Tektonik',
    areaTerkait: 'transform',
  },
  {
    id: 'qa-indonesia-rawan-gempa',
    pertanyaan: 'Mengapa Indonesia sering terjadi gempa?',
    kataKunci: ['indonesia', 'gempa', 'rawan', 'lempeng', 'indo-australia', 'eurasia', 'pasifik'],
    frasa: ['indonesia rawan gempa', 'lempeng indo-australia'],
    jawaban:
      'Indonesia terletak di pertemuan beberapa lempeng tektonik besar, terutama Lempeng Indo-Australia, Lempeng Eurasia, dan Lempeng Pasifik. Lempeng-lempeng itu saling bertumbukan dan bergesekan, sehingga Indonesia sering mengalami gempa dan memiliki banyak gunung api.',
    topik: 'Lempeng Tektonik',
    areaTerkait: 'convergent',
  },
  {
    id: 'qa-sumatera-subur-gempa',
    pertanyaan: 'Mengapa Sumatra subur tetapi rawan gempa?',
    kataKunci: ['sumatra', 'subur', 'gempa', 'abu', 'vulkanik', 'tumbukan'],
    jawaban:
      'Keduanya berasal dari sebab yang sama: posisi Sumatra di zona tumbukan lempeng. Abu vulkanik dari gunung api membuat tanahnya subur, sementara pergerakan lempeng di bawahnya menimbulkan gempa.',
    topik: 'Lempeng Tektonik',
  },

  // ── GEMPA BUMI ───────────────────────────────────────────────────────────
  {
    id: 'qa-penyebab-gempa',
    pertanyaan: 'Apa penyebab gempa bumi?',
    kataKunci: ['penyebab', 'sebab', 'gempa', 'bumi', 'lempeng', 'gesekan', 'patah'],
    frasa: ['penyebab gempa', 'gempa bumi terjadi'],
    jawaban:
      'Gempa bumi paling sering disebabkan oleh pergerakan lempeng tektonik. Saat lempeng bergesekan atau bertumbukan, batuan menahan tekanan sampai suatu saat tidak kuat lagi dan patah. Patahan itu melepaskan energi berupa getaran yang kita rasakan sebagai gempa.',
    topik: 'Gempa Bumi',
  },
  {
    id: 'qa-drop-cover-hold',
    pertanyaan: 'Apa yang harus dilakukan saat gempa?',
    kataKunci: ['harus', 'dilakukan', 'saat', 'gempa', 'drop', 'cover', 'hold', 'merunduk', 'meja'],
    frasa: ['drop cover hold', 'saat gempa', 'saat terjadi gempa'],
    jawaban:
      'Lakukan tiga hal: (1) DROP — merunduk ke bawah mendekati lantai; (2) COVER — berlindung di bawah meja yang kuat dan jauh dari kaca; (3) HOLD ON — berpegangan pada kaki meja sampai getaran benar-benar berhenti. Jangan berlari keluar saat getaran masih berlangsung, karena saat itulah risiko terkena reruntuhan dan kaca paling besar.',
    topik: 'Mitigasi Gempa',
    areaTerkait: 'area-simulasi-gempa',
  },
  {
    id: 'qa-jangan-pakai-lift',
    pertanyaan: 'Kenapa tidak boleh pakai lift saat gempa?',
    kataKunci: ['lift', 'elevator', 'gempa', 'listrik', 'terjebak'],
    frasa: ['pakai lift', 'menggunakan lift'],
    jawaban:
      'Karena gempa dapat memutus aliran listrik dan merusak rel lift. Orang yang berada di dalam lift berisiko terjebak tanpa jalan keluar. Gunakan tangga darurat, dan hanya setelah getaran berhenti.',
    topik: 'Mitigasi Gempa',
    areaTerkait: 'area-mitigasi-gempa',
  },
  {
    id: 'qa-di-luar-ruangan',
    pertanyaan: 'Bagaimana kalau gempa terjadi saat kita di luar ruangan?',
    kataKunci: ['luar', 'ruangan', 'halaman', 'gempa', 'tiang', 'pohon', 'terbuka'],
    frasa: ['di luar ruangan', 'di luar gedung'],
    jawaban:
      'Menjauhlah dari bangunan, tiang listrik, papan reklame, dan pohon besar. Lalu merunduklah di area terbuka sambil melindungi kepala. Bahaya utama di luar ruangan adalah benda yang jatuh atau roboh, bukan lantainya.',
    topik: 'Mitigasi Gempa',
    areaTerkait: 'area-simulasi-gempa',
  },
  {
    id: 'qa-gempa-susulan',
    pertanyaan: 'Kenapa setelah gempa masih ada gempa susulan?',
    kataKunci: ['susulan', 'setelah', 'gempa', 'lagi', 'kembali', 'masuk', 'gedung'],
    frasa: ['gempa susulan'],
    jawaban:
      'Setelah patahan utama bergeser, batuan di sekitarnya masih menyesuaikan diri, sehingga terjadi gempa-gempa kecil susulan. Karena itu kita belum boleh langsung masuk kembali ke dalam gedung: bangunan yang sudah retak dapat runtuh pada susulan itu.',
    topik: 'Gempa Bumi',
  },
  {
    id: 'qa-magnitudo',
    pertanyaan: 'Apa itu magnitudo gempa?',
    kataKunci: ['magnitudo', 'skala', 'richter', 'kekuatan', 'besar', 'sr'],
    frasa: ['magnitudo gempa', 'skala richter'],
    jawaban:
      'Magnitudo adalah ukuran kekuatan gempa berdasarkan energi yang dilepaskan, dinyatakan dalam satuan Skala Richter (SR). Kenaikan satu angka berarti energinya jauh lebih besar, bukan sekadar dua kali lipat. Yang diukur adalah kekuatan gempanya, bukan besar kerusakannya.',
    topik: 'Gempa Bumi',
  },
  {
    id: 'qa-tanah-lunak',
    pertanyaan: 'Kenapa bangunan di tanah lunak lebih mudah rusak saat gempa?',
    kataKunci: ['tanah', 'lunak', 'basah', 'bangunan', 'rusak', 'goyang', 'diperkuat'],
    frasa: ['tanah lunak', 'tanah basah'],
    jawaban:
      'Tanah yang lunak dan mengandung banyak air memperkuat goyangan di permukaan. Akibatnya bangunan di atas tanah lunak bergoyang jauh lebih keras, sehingga kerusakannya biasanya lebih parah daripada di tanah yang keras.',
    topik: 'Gempa Bumi',
    areaTerkait: 'area-mitigasi-gempa',
  },
  {
    id: 'qa-titik-kumpul',
    pertanyaan: 'Di mana tempat berkumpul yang aman setelah gempa?',
    kataKunci: ['titik', 'kumpul', 'berkumpul', 'lapangan', 'aman', 'terbuka', 'evakuasi'],
    frasa: ['titik kumpul', 'lapangan terbuka', 'tempat berkumpul'],
    jawaban:
      'Titik kumpul yang aman adalah lapangan terbuka yang jauh dari bangunan, tiang, pohon besar, dan tembok. Sesampainya di sana, hal pertama yang harus dilakukan adalah memeriksa apakah semua teman dan guru sudah lengkap.',
    topik: 'Evakuasi',
    areaTerkait: 'area-lapangan-evakuasi',
  },
  {
    id: 'qa-menolong-korban',
    pertanyaan: 'Bagaimana menolong teman yang terluka?',
    kataKunci: ['menolong', 'korban', 'luka', 'terluka', 'patah', 'tulang', 'pindah'],
    frasa: ['menolong korban', 'korban luka'],
    jawaban:
      'Panggil guru atau petugas yang berkompeten, dan JANGAN memindahkan korban sembarangan. Korban yang mengalami cedera tulang dapat bertambah parah bila digerakkan dengan cara yang salah. Jaga korban tetap tenang dan tetap di tempatnya sampai penolong datang.',
    topik: 'Pertolongan Pertama',
    areaTerkait: 'area-lapangan-evakuasi',
  },
  {
    id: 'qa-tas-siaga',
    pertanyaan: 'Apa isi tas siaga bencana?',
    kataKunci: ['tas', 'siaga', 'bencana', 'isi', 'persiapan', 'logistik'],
    frasa: ['tas siaga', 'tas bencana'],
    jawaban:
      'Isi tas siaga bencana: air minum, makanan tahan lama, senter dan baterai cadangan, obat-obatan pribadi, kotak P3K, masker, pakaian ganti, dan salinan dokumen penting dalam plastik kedap air. Tas harus cukup ringan untuk dibawa sendiri saat harus segera pergi.',
    topik: 'Mitigasi Gempa',
    areaTerkait: 'area-mitigasi-gempa',
  },

  // ── GUNUNG API ───────────────────────────────────────────────────────────
  {
    id: 'qa-status-gunung',
    pertanyaan: 'Apa saja status gunung api?',
    kataKunci: ['status', 'gunung', 'api', 'normal', 'waspada', 'siaga', 'awas', 'level'],
    frasa: ['status gunung api', 'tingkat status'],
    jawaban:
      'Status gunung api di Indonesia ada empat tingkat: NORMAL (Level I), WASPADA (Level II), SIAGA (Level III), dan AWAS (Level IV). Setiap kenaikan tingkat diikuti tindakan yang makin tegas, dan pada status AWAS wilayah terancam harus sudah dikosongkan.',
    topik: 'Gunung Api',
    areaTerkait: 'area-pos-pengamatan-merapi',
  },
  {
    id: 'qa-pvmbg',
    pertanyaan: 'Siapa yang memantau gunung api di Indonesia?',
    kataKunci: ['pvmbg', 'memantau', 'pantau', 'gunung', 'api', 'vulkanologi', 'lembaga'],
    frasa: ['pvmbg', 'memantau gunung api'],
    jawaban:
      'PVMBG (Pusat Vulkanologi dan Mitigasi Bencana Geologi) bertugas memantau aktivitas gunung api dan menetapkan statusnya. Jangan tertukar: BMKG mengurus cuaca dan gempa tektonik, sedangkan BASARNAS bertugas mencari dan menolong korban.',
    topik: 'Gunung Api',
    areaTerkait: 'area-pos-pengamatan-merapi',
  },
  {
    id: 'qa-seismograf',
    pertanyaan: 'Apa itu seismograf?',
    kataKunci: ['seismograf', 'alat', 'rekam', 'getaran', 'magma', 'gempa'],
    frasa: ['alat seismograf'],
    jawaban:
      'Seismograf adalah alat perekam getaran. Di pos pengamatan gunung api, seismograf merekam getaran yang timbul karena magma bergerak dan menekan batuan di dalam gunung. Dari jumlah dan kekuatan getaran itu, petugas menilai kesiapan gunung untuk meletus.',
    topik: 'Gunung Api',
    areaTerkait: 'area-pos-pengamatan-merapi',
  },
  {
    id: 'qa-awan-panas',
    pertanyaan: 'Apa itu awan panas?',
    kataKunci: ['awan', 'panas', 'piroklastik', 'wedhus', 'gembel', 'aliran', 'berbahaya'],
    frasa: ['awan panas', 'aliran piroklastik'],
    jawaban:
      'Awan panas (aliran piroklastik) adalah campuran gas dan material vulkanik panas yang meluncur cepat menuruni lereng gunung. Suhunya mencapai ratusan derajat dan kecepatannya melebihi kemampuan manusia berlari, sehingga inilah bahaya paling mematikan dari letusan gunung api.',
    topik: 'Bahaya Vulkanik',
    areaTerkait: 'area-simulasi-merapi',
  },
  {
    id: 'qa-lahar-dingin',
    pertanyaan: 'Apa itu lahar dingin?',
    kataKunci: ['lahar', 'dingin', 'lumpur', 'sungai', 'hujan', 'banjir'],
    frasa: ['lahar dingin'],
    jawaban:
      'Lahar dingin adalah aliran campuran air, pasir, dan batu vulkanik yang turun melalui alur sungai, biasanya dipicu oleh hujan di lereng gunung. Disebut "dingin" karena tidak membara seperti lava, tetapi tetap sangat berbahaya karena menerjang apa saja di jalurnya.',
    topik: 'Bahaya Vulkanik',
    areaTerkait: 'area-simulasi-merapi',
  },
  {
    id: 'qa-kenapa-jauhi-sungai',
    pertanyaan: 'Mengapa tidak boleh berada di sungai saat erupsi?',
    kataKunci: ['sungai', 'lembah', 'erupsi', 'jauhi', 'aliran', 'lahar'],
    frasa: ['jauhi sungai', 'tepi sungai', 'alur sungai'],
    jawaban:
      'Lembah dan alur sungai adalah jalur alami bagi material vulkanik yang turun dari puncak, baik awan panas maupun lahar. Berada di sana sama dengan berdiri tepat di jalur alirannya. Karena itu saat erupsi, kita harus menjauhi lembah dan tepi sungai yang berhulu di gunung tersebut.',
    topik: 'Bahaya Vulkanik',
    areaTerkait: 'area-simulasi-merapi',
  },
  {
    id: 'qa-hujan-abu',
    pertanyaan: 'Apa yang harus dilakukan saat hujan abu?',
    kataKunci: ['hujan', 'abu', 'vulkanik', 'masker', 'jendela', 'dalam', 'rumah'],
    frasa: ['hujan abu', 'abu vulkanik'],
    jawaban:
      'Pakai masker atau kain basah untuk menutup mulut dan hidung, lalu tetap di dalam rumah dengan jendela dan pintu tertutup rapat. Setelah abu berhenti pun, tetap pakai masker saat membersihkan atap dan halaman, karena abu yang mengendap dapat terangkat kembali dan terhirup.',
    topik: 'Bahaya Vulkanik',
    areaTerkait: 'area-simulasi-merapi',
  },
  {
    id: 'qa-kenapa-bersihkan-atap',
    pertanyaan: 'Kenapa abu di atap harus dibersihkan?',
    kataKunci: ['abu', 'atap', 'bersih', 'runtuh', 'berat', 'hujan'],
    frasa: ['abu di atap', 'membersihkan atap'],
    jawaban:
      'Karena abu vulkanik menyerap air dan menjadi jauh lebih berat setelah terkena hujan. Banyak atap runtuh bukan karena gempa atau letusan, melainkan karena beban abu di atasnya. Karena itu abu perlu dibersihkan dengan hati-hati, sambil tetap memakai masker.',
    topik: 'Bahaya Vulkanik',
    areaTerkait: 'area-simulasi-merapi',
  },
  {
    id: 'qa-krb',
    pertanyaan: 'Apa itu KRB?',
    kataKunci: ['krb', 'kawasan', 'rawan', 'bencana', 'zona', 'iii', 'i'],
    frasa: ['kawasan rawan bencana', 'zona krb'],
    jawaban:
      'KRB adalah Kawasan Rawan Bencana, pembagian wilayah berdasarkan tingkat bahayanya terhadap letusan gunung api. KRB III adalah zona paling dekat kawah dan paling terancam, sehingga warganya harus mengungsi paling awal karena waktu amannya paling singkat. KRB I paling jauh dari kawah.',
    topik: 'Evakuasi',
    areaTerkait: 'area-pos-pengamatan-merapi',
  },
  {
    id: 'qa-arah-mengungsi',
    pertanyaan: 'Ke arah mana kita mengungsi saat gunung meletus?',
    kataKunci: ['arah', 'mengungsi', 'evakuasi', 'letusan', 'petugas', 'menjauh'],
    frasa: ['arah mengungsi', 'mengungsi saat erupsi'],
    jawaban:
      'Ikuti arah yang ditentukan petugas, bukan sekadar berusaha menjauh dari gunung. Bahaya gunung api tidak menyebar merata ke segala arah, melainkan mengikuti lembah dan alur sungai. Jalur yang secara arah tampak "menjauh" bisa justru menuju lembah yang menjadi jalur awan panas.',
    topik: 'Evakuasi',
    areaTerkait: 'area-simulasi-merapi',
  },

  // ── PENGUNGSIAN ──────────────────────────────────────────────────────────
  {
    id: 'qa-barak-pengungsian',
    pertanyaan: 'Apa yang harus dilakukan di barak pengungsian?',
    kataKunci: ['barak', 'pengungsian', 'daftar', 'pendataan', 'identitas', 'sanitasi'],
    frasa: ['barak pengungsian', 'daftar pengungsi'],
    jawaban:
      'Saat pertama tiba, daftarkan identitas diri dan jumlah anggota keluarga yang ikut. Pendataan ini penting agar petugas dapat menghitung kebutuhan makanan, air, obat, dan tempat tidur, sekaligus mengetahui siapa yang belum ditemukan. Jaga pula kebersihan dan sanitasi, karena tempat yang padat penghuni mudah menjadi tempat penyebaran penyakit.',
    topik: 'Pengungsian',
    areaTerkait: 'area-barak-pengungsian',
  },
  {
    id: 'qa-air-bersih-pengungsian',
    pertanyaan: 'Apakah air di pengungsian boleh langsung diminum?',
    kataKunci: ['air', 'minum', 'pengungsian', 'dimasak', 'bersih', 'matang'],
    frasa: ['air minum', 'air bersih'],
    jawaban:
      'Air yang tampak jernih belum tentu bebas kuman. Di tempat penampungan yang padat, penyakit saluran pencernaan mudah menyebar. Karena itu air minum di pengungsian harus dipastikan bersih dan sudah dimasak.',
    topik: 'Pengungsian',
    areaTerkait: 'area-barak-pengungsian',
  },
  {
    id: 'qa-pembagian-bantuan',
    pertanyaan: 'Bagaimana bantuan di pengungsian dibagi?',
    kataKunci: ['bantuan', 'bagi', 'pembagian', 'adil', 'bayi', 'lansia', 'rentan'],
    frasa: ['pembagian bantuan', 'kelompok rentan'],
    jawaban:
      'Bantuan harus dibagi berdasarkan KEBUTUHAN, bukan berdasarkan siapa yang datang paling awal atau paling cepat meminta. Kelompok rentan — bayi, ibu hamil, lansia, dan korban luka — perlu didahulukan karena kebutuhan dan kerentanannya berbeda.',
    topik: 'Pengungsian',
    areaTerkait: 'area-barak-pengungsian',
  },
  {
    id: 'qa-dukungan-psikologis',
    pertanyaan: 'Mengapa korban bencana perlu dukungan psikologis?',
    kataKunci: ['psikologis', 'trauma', 'takut', 'sedih', 'dukungan', 'pemulihan'],
    frasa: ['dukungan psikologis', 'trauma bencana'],
    jawaban:
      'Kebutuhan pengungsi tidak berhenti pada makanan dan tempat tinggal. Bencana menimbulkan trauma yang, bila tidak ditangani, dapat mengganggu kesehatan dan menghambat kemampuan seseorang untuk kembali menjalani hidup normal. Karena itu dukungan psikologis termasuk bagian penting penanganan bencana.',
    topik: 'Pengungsian',
    areaTerkait: 'area-barak-pengungsian',
  },

  // ── TENTANG APLIKASI ─────────────────────────────────────────────────────
  {
    id: 'qa-cara-main',
    pertanyaan: 'Bagaimana cara bermain RESQ-BOX?',
    kataKunci: ['cara', 'main', 'bermain', 'resq', 'box', 'level', 'mulai'],
    frasa: ['cara bermain', 'cara main'],
    jawaban:
      'RESQ-BOX punya tiga level. Level 1 mengajakmu menjelajah lapisan dalam bumi. Level 2 tentang pergerakan lempeng dan kebencanaan. Level 3 berupa simulasi 3D Gunung Merapi, tempat kamu menyusun program mitigasi memakai blok. Di dalam game, tekan [E] atau klik untuk berinteraksi dengan teman tim, kristal, dan gerbang tantangan.',
    topik: 'Tentang Aplikasi',
  },
  {
    id: 'qa-minta-jawaban',
    pertanyaan: 'Aku tidak paham, tolong jelaskan lebih sederhana.',
    kataKunci: ['tidak', 'paham', 'jelaskan', 'sederhana', 'bingung', 'ulang'],
    frasa: ['tidak paham', 'jelaskan ulang'],
    jawaban:
      'Tentu. Coba tanyakan bagian yang paling membingungkan dengan kata-katamu sendiri, misalnya "apa itu subduksi?" atau "kenapa membuat gunung api?". Aku akan berusaha menjelaskannya dengan bahasa yang lebih sederhana dan memberi contoh dari Indonesia.',
    topik: 'Tentang Aplikasi',
  },
];

/** Seluruh topik unik di dalam bank — dipakai untuk memberi saran. */
export function daftarTopik(): string[] {
  return [...new Set(BANK_QA.map((e) => e.topik))];
}
