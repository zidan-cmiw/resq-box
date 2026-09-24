// ============================================================
// RESQ-BOX — Mitigasi Bencana Scenarios
// Puzzle mode: siswa menyusun urutan tindakan yang benar
// Fokus: Gempa Bumi dan Gunung Meletus
// ============================================================

export interface MitigationAction {
  id: string;
  label: string;         // Tindakan yang ditampilkan
  icon: string;          // Material Symbols icon name
  isCorrect: boolean;    // false = blok pengecoh (wrong answer)
  explanation: string;   // Penjelasan kenapa benar/salah
}

export interface MitigationScenario {
  id: string;
  disaster: 'gempa' | 'kebakaran' | 'tsunami' | 'evakuasi'; // 'kebakaran' is used for gunung meletus in the UI colors
  level: number;
  title: string;
  subtitle: string;      // Konteks singkat situasi
  description: string;   // Narasi lengkap skenario
  icon: string;
  color: string;         // Tailwind bg color untuk card
  borderColor: string;
  correctOrder: string[];  // Array ID tindakan yang benar, dalam urutan
  actions: MitigationAction[];
}

export const MITIGATION_SCENARIOS: MitigationScenario[] = [
  // 1
  {
    id: 'gempa-dalam-kelas',
    disaster: 'gempa',
    level: 1,
    title: 'Gempa di Dalam Kelas',
    subtitle: 'Sedang belajar saat gempa terjadi',
    description: 'Saat guru sedang menjelaskan materi, tiba-tiba lantai bergetar hebat, meja dan kursi bergoyang, serta beberapa buku jatuh dari rak. Apa yang harus kamu lakukan pertama?',
    icon: 'earthquake',
    color: 'bg-[#FEF3C7]',
    borderColor: 'border-[#F59E0B]',
    correctOrder: ['duck', 'cover', 'hold', 'evacuate', 'assembly'],
    actions: [
      { id: 'duck', label: 'Berlindung di bawah meja yang kuat', icon: 'table_restaurant', isCorrect: true, explanation: 'Benar! Meja melindungi dari benda yang jatuh dari atap.' },
      { id: 'cover', label: 'Lindungi kepala dan leher dengan tangan/tas', icon: 'back_hand', isCorrect: true, explanation: 'Benar! Kepala adalah bagian paling vital yang harus terlindungi dari reruntuhan.' },
      { id: 'hold', label: 'Berpegangan pada kaki meja dan tunggu guncangan berhenti', icon: 'timer', isCorrect: true, explanation: 'Benar! Jangan langsung berlari karena guncangan bisa membuatmu terjatuh.' },
      { id: 'evacuate', label: 'Evakuasi ke luar kelas dengan tertib setelah guncangan berhenti', icon: 'directions_run', isCorrect: true, explanation: 'Benar! Jangan berebut, jalan cepat namun tidak berlari.' },
      { id: 'assembly', label: 'Kumpul di titik kumpul (lapangan)', icon: 'groups', isCorrect: true, explanation: 'Benar! Di tempat terbuka kamu aman dari bangunan runtuh dan mudah didata oleh guru.' },
      { id: 'run-during', label: 'Langsung lari keluar kelas secara acak', icon: 'sprint', isCorrect: false, explanation: 'Salah! Lari saat gempa berisiko tertimpa bangunan dan menyebabkan kepanikan berlebih.' },
      { id: 'window', label: 'Lompat dari jendela terdekat', icon: 'window', isCorrect: false, explanation: 'Salah! Jendela kaca sangat berbahaya dan bisa pecah melukaimu.' }
    ]
  },
  // 2
  {
    id: 'gempa-di-kantin',
    disaster: 'gempa',
    level: 1,
    title: 'Gempa Saat di Kantin',
    subtitle: 'Jam istirahat makan',
    description: 'Kamu sedang menikmati semangkuk bakso panas di kantin sekolah. Tiba-tiba terjadi gempa yang sangat kuat. Panci kuah di warung bergoyang dan rak makanan hampir roboh.',
    icon: 'restaurant',
    color: 'bg-amber-100',
    borderColor: 'border-amber-500',
    correctOrder: ['jauhi-kompor', 'lindung-kepala', 'tunggu-reda', 'keluar-terbuka'],
    actions: [
      { id: 'jauhi-kompor', label: 'Segera menjauh dari area dapur dan kompor panas', icon: 'local_fire_department', isCorrect: true, explanation: 'Benar! Kuah panas dan api kompor sangat berbahaya saat gempa.' },
      { id: 'lindung-kepala', label: 'Berlindung di bawah meja kantin atau lindungi kepala', icon: 'health_and_safety', isCorrect: true, explanation: 'Benar! Lindungi diri dari benda-benda yang berjatuhan.' },
      { id: 'tunggu-reda', label: 'Tunggu hingga guncangan benar-benar reda', icon: 'hourglass_empty', isCorrect: true, explanation: 'Benar! Berjalan saat guncangan hebat berisiko terpeleset benda jatuh atau tumpahan makanan.' },
      { id: 'keluar-terbuka', label: 'Keluar perlahan menuju area terbuka/lapangan', icon: 'directions_walk', isCorrect: true, explanation: 'Benar! Jauhi bangunan kantin setelah aman.' },
      { id: 'selamatkan-makanan', label: 'Bawa mangkuk makanan lari keluar', icon: 'ramen_dining', isCorrect: false, explanation: 'Salah! Jangan pikirkan makanan, makanan panas yang tumpah bisa melukaimu.' },
      { id: 'sembunyi-kulkas', label: 'Sembunyi di samping kulkas minuman', icon: 'kitchen', isCorrect: false, explanation: 'Salah! Kulkas adalah benda berat yang mudah roboh dan menimpa tubuhmu.' }
    ]
  },
  // 3
  {
    id: 'gempa-upacara',
    disaster: 'gempa',
    level: 1,
    title: 'Gempa Saat Upacara',
    subtitle: 'Berada di lapangan terbuka',
    description: 'Saat sedang mengikuti upacara bendera hari Senin di lapangan terbuka, tiba-tiba tanah bergoyang dengan sangat kuat hingga kamu sulit berdiri tegang.',
    icon: 'flag',
    color: 'bg-green-100',
    borderColor: 'border-green-600',
    correctOrder: ['jongkok', 'jauhi-tiang', 'tunggu-instruksi'],
    actions: [
      { id: 'jongkok', label: 'Segera berjongkok di tempat', icon: 'accessibility_new', isCorrect: true, explanation: 'Benar! Berjongkok membuat posisi tubuh lebih stabil sehingga tidak mudah terjatuh.' },
      { id: 'jauhi-tiang', label: 'Geser posisi menjauh dari tiang bendera atau pohon besar', icon: 'park', isCorrect: true, explanation: 'Benar! Benda tinggi seperti tiang dan pohon bisa patah dan menimpa kita.' },
      { id: 'tunggu-instruksi', label: 'Tetap di lapangan dan tunggu instruksi guru', icon: 'campaign', isCorrect: true, explanation: 'Benar! Lapangan adalah tempat teraman (titik kumpul). Jangan lari kembali ke kelas.' },
      { id: 'lari-ke-kelas', label: 'Berlari masuk ke dalam kelas untuk mengambil tas', icon: 'backpack', isCorrect: false, explanation: 'Sangat Fatal! Masuk ke bangunan saat gempa adalah tindakan paling berbahaya.' },
      { id: 'berdiri-kaku', label: 'Berdiri tegak menghormat bendera', icon: 'front_hand', isCorrect: false, explanation: 'Salah! Keselamatan nyawa adalah yang utama, guncangan kuat bisa membuatmu terpelanting.' }
    ]
  },
  // 4
  {
    id: 'hujan-abu-vulkanik',
    disaster: 'kebakaran', // Uses 'kebakaran' styling for volcano
    level: 1,
    title: 'Hujan Abu Vulkanik',
    subtitle: 'Saat perjalanan pulang sekolah',
    description: 'Gunung berapi yang berjarak 15km dari sekolahmu meletus. Saat di jalan pulang, langit mendadak gelap dan hujan abu vulkanik pekat mulai turun.',
    icon: 'volcano',
    color: 'bg-[#FEE2E2]',
    borderColor: 'border-[#EF4444]',
    correctOrder: ['pakai-masker', 'lindungi-mata', 'cari-tempat-berteduh', 'tutup-pintu'],
    actions: [
      { id: 'pakai-masker', label: 'Segera pakai masker atau tutup hidung dengan kain/baju', icon: 'masks', isCorrect: true, explanation: 'Benar! Abu vulkanik berbentuk kristal kaca kecil yang bisa merusak paru-paru jika terhirup.' },
      { id: 'lindungi-mata', label: 'Pakai kacamata atau lindungi mata agar tidak kelilipan', icon: 'visibility', isCorrect: true, explanation: 'Benar! Abu vulkanik sangat tajam dan bisa menggores kornea mata (jangan dikucek).' },
      { id: 'cari-tempat-berteduh', label: 'Cari bangunan terdekat untuk berteduh sementara', icon: 'roofing', isCorrect: true, explanation: 'Benar! Kurangi paparan langsung abu vulkanik di luar ruangan.' },
      { id: 'tutup-pintu', label: 'Tutup rapat pintu, jendela, dan ventilasi jika sudah di dalam', icon: 'door_front', isCorrect: true, explanation: 'Benar! Cegah abu menyusup masuk ke dalam ruangan.' },
      { id: 'bersihkan-air', label: 'Cuci muka menggunakan air jalanan', icon: 'water_drop', isCorrect: false, explanation: 'Salah! Air yang tercampur abu vulkanik akan berubah menjadi lumpur pekat atau semen.' },
      { id: 'terus-jalan', label: 'Lari menembus hujan abu sambil menutup mata', icon: 'directions_run', isCorrect: false, explanation: 'Salah! Berlari akan membuatmu menghirup napas lebih dalam (lebih banyak abu masuk paru-paru).' }
    ]
  },
  // 5
  {
    id: 'awan-panas',
    disaster: 'kebakaran',
    level: 1,
    title: 'Awan Panas Mendekat',
    subtitle: 'Sirine desa di lereng gunung berbunyi',
    description: 'Sirine evakuasi berbunyi nyaring. Terlihat kepulan awan panas (wedhus gembel) yang pekat bergerak cepat menuruni lereng gunung ke arah desamu.',
    icon: 'air',
    color: 'bg-red-100',
    borderColor: 'border-red-500',
    correctOrder: ['tinggalkan-barang', 'segera-evakuasi', 'ikuti-jalur', 'menuju-posko'],
    actions: [
      { id: 'tinggalkan-barang', label: 'Tinggalkan semua barang berharga, utamakan nyawa', icon: 'no_luggage', isCorrect: true, explanation: 'Benar! Awan panas bisa bergerak hingga 100km/jam, tidak ada waktu untuk berkemas.' },
      { id: 'segera-evakuasi', label: 'Segera lari / naik kendaraan evakuasi', icon: 'directions_run', isCorrect: true, explanation: 'Benar! Jauhi arah datangnya awan panas secepat mungkin.' },
      { id: 'ikuti-jalur', label: 'Ikuti rambu dan arah jalur evakuasi resmi', icon: 'route', isCorrect: true, explanation: 'Benar! Jalur evakuasi sudah dipetakan ke area yang aman dari lintasan lahar/awan panas.' },
      { id: 'menuju-posko', label: 'Berkumpul di posko pengungsian di zona aman', icon: 'maps_home_work', isCorrect: true, explanation: 'Benar! Di posko terdapat bantuan medis, makanan, dan masker yang memadai.' },
      { id: 'masuk-bunker', label: 'Bersembunyi di dalam kamar dan tutup pintu', icon: 'home', isCorrect: false, explanation: 'Fatal! Suhu awan panas bisa mencapai 1000 derajat Celcius, rumah akan hangus.' },
      { id: 'foto-video', label: 'Berhenti sebentar untuk memotret awan panas', icon: 'photo_camera', isCorrect: false, explanation: 'Sangat Fatal! Banyak korban jiwa akibat menunda evakuasi hanya demi merekam video.' }
    ]
  },
  // 6
  {
    id: 'gempa-di-jalan',
    disaster: 'gempa',
    level: 1,
    title: 'Gempa Saat Berkendara',
    subtitle: 'Di dalam mobil / angkutan umum',
    description: 'Saat mobil sedang melaju, tiba-tiba kendaraan terasa oleng dan bergoyang hebat akibat gempa. Tiang listrik di pinggir jalan terlihat bergoyang maju-mundur.',
    icon: 'directions_car',
    color: 'bg-stone-100',
    borderColor: 'border-stone-400',
    correctOrder: ['kurangi-kecepatan', 'minggir', 'jauhi-pohon', 'tetap-di-mobil'],
    actions: [
      { id: 'kurangi-kecepatan', label: 'Kurangi kecepatan kendaraan secara perlahan', icon: 'speed', isCorrect: true, explanation: 'Benar! Mengerem mendadak bisa menyebabkan tabrakan beruntun di belakang.' },
      { id: 'minggir', label: 'Menepi ke kiri jalan dan nyalakan lampu hazard', icon: 'turn_left', isCorrect: true, explanation: 'Benar! Berikan bagian tengah jalan untuk kendaraan darurat (ambulans/pemadam).' },
      { id: 'jauhi-pohon', label: 'Pastikan berhenti tidak di bawah pohon/papan reklame', icon: 'park', isCorrect: true, explanation: 'Benar! Benda-benda tinggi tersebut sangat rawan roboh menimpa kendaraan.' },
      { id: 'tetap-di-mobil', label: 'Tetap di dalam mobil hingga guncangan reda', icon: 'airline_seat_recline_normal', isCorrect: true, explanation: 'Benar! Mobil memberikan perlindungan dari serpihan kecil yang berjatuhan (asal tidak tertimpa benda berat).' },
      { id: 'rem-mendadak', label: 'Rem mendadak dan tinggalkan mobil di tengah jalan', icon: 'car_crash', isCorrect: false, explanation: 'Salah! Membahayakan dan akan memblokir jalan raya.' },
      { id: 'lari-keluar', label: 'Lompat keluar dari mobil saat masih melaju', icon: 'directions_run', isCorrect: false, explanation: 'Salah! Berisiko tinggi terjatuh dan tertabrak kendaraan lain.' }
    ]
  },
  // 7
  {
    id: 'gempa-di-pasar',
    disaster: 'gempa',
    level: 1,
    title: 'Gempa di Pasar Tradisional',
    subtitle: 'Banyak barang berserakan',
    description: 'Kamu sedang menemani ibumu berbelanja di pasar yang sempit dan ramai. Terjadi gempa yang membuat tumpukan barang-barang dagangan jatuh berserakan.',
    icon: 'store',
    color: 'bg-emerald-100',
    borderColor: 'border-emerald-500',
    correctOrder: ['lindungi-kepala-tas', 'jauhi-kaca', 'tunggu-reda', 'keluar-pelan'],
    actions: [
      { id: 'lindungi-kepala-tas', label: 'Lindungi kepala dengan keranjang belanja / tas', icon: 'shopping_basket', isCorrect: true, explanation: 'Benar! Kepala harus terlindungi dari barang-barang dagangan yang jatuh.' },
      { id: 'jauhi-kaca', label: 'Menjauh dari rak besi tinggi atau etalase kaca', icon: 'crop_square', isCorrect: true, explanation: 'Benar! Rak bisa ambruk dan etalase kaca sangat berbahaya jika pecah.' },
      { id: 'tunggu-reda', label: 'Berjongkok di tempat kosong dan tunggu gempa reda', icon: 'accessibility_new', isCorrect: true, explanation: 'Benar! Jangan lari berdesakan dengan orang lain.' },
      { id: 'keluar-pelan', label: 'Jalan pelan keluar area pasar setelah aman', icon: 'directions_walk', isCorrect: true, explanation: 'Benar! Hindari kepanikan saat evakuasi.' },
      { id: 'lari-teriak', label: 'Lari keluar menerobos orang lain sambil berteriak', icon: 'record_voice_over', isCorrect: false, explanation: 'Salah! Membuat panik massa bisa memicu saling injak yang berujung kematian.' }
    ]
  },
  // 8
  {
    id: 'gempa-malam',
    disaster: 'gempa',
    level: 1,
    title: 'Gempa Saat Tidur Malam',
    subtitle: 'Listrik tiba-tiba padam',
    description: 'Tengah malam kamu sedang tidur lelap. Kasurmu tiba-tiba terguncang kuat ke kiri dan kanan. Terdengar suara benda jatuh dan listrik rumah seketika padam.',
    icon: 'bedtime',
    color: 'bg-indigo-100',
    borderColor: 'border-indigo-500',
    correctOrder: ['bangun-guling', 'bawah-kasur', 'ambil-senter', 'evakuasi-luar'],
    actions: [
      { id: 'bangun-guling', label: 'Gulingkan badan menjauh dari atas kasur', icon: 'airline_seat_individual_suite', isCorrect: true, explanation: 'Benar! Plafon rumah bisa runtuh menimpa tempat tidur.' },
      { id: 'bawah-kasur', label: 'Berlindung di samping kasur/lemari kuat (Segitiga Kehidupan)', icon: 'bed', isCorrect: true, explanation: 'Benar! Berada di samping benda padat yang tidak bisa gepeng akan membentuk rongga aman.' },
      { id: 'ambil-senter', label: 'Nyalakan senter HP / alat penerangan darurat', icon: 'flashlight_on', isCorrect: true, explanation: 'Benar! Karena listrik mati, kamu butuh cahaya untuk melihat jalan keluar yang aman.' },
      { id: 'evakuasi-luar', label: 'Berjalan hati-hati menuju luar rumah setelah reda', icon: 'meeting_room', isCorrect: true, explanation: 'Benar! Waspada terhadap pecahan kaca atau paku di lantai.' },
      { id: 'nyalakan-lilin', label: 'Segera nyalakan korek api / lilin', icon: 'local_fire_department', isCorrect: false, explanation: 'Sangat Bahaya! Gempa bisa merusak pipa gas/tabung elpiji. Percikan api bisa memicu ledakan.' }
    ]
  },
  // 9
  {
    id: 'evakuasi-rentan',
    disaster: 'evakuasi',
    level: 1,
    title: 'Membantu Kelompok Rentan',
    subtitle: 'Tugas sebagai relawan PMR',
    description: 'Guncangan gempa telah reda, namun sirine waspada bahaya erupsi menyala. Kamu melihat seorang kakek tetanggamu kebingungan dan sulit berjalan.',
    icon: 'elderly',
    color: 'bg-sky-100',
    borderColor: 'border-sky-500',
    correctOrder: ['tenangkan-lansia', 'bawa-kursi-roda', 'evakuasi-bersama', 'lapor-posko'],
    actions: [
      { id: 'tenangkan-lansia', label: 'Dekati, ajak bicara, dan tenangkan si kakek', icon: 'psychology', isCorrect: true, explanation: 'Benar! Lansia mudah mengalami serangan jantung atau syok jika panik berlebih.' },
      { id: 'bawa-kursi-roda', label: 'Siapkan kursi roda / tongkat alat bantu jalannya', icon: 'accessible_forward', isCorrect: true, explanation: 'Benar! Kelompok rentan butuh alat bantu untuk evakuasi cepat.' },
      { id: 'evakuasi-bersama', label: 'Bimbing perlahan menuju jalur evakuasi', icon: 'escalator_warning', isCorrect: true, explanation: 'Benar! Jangan tinggalkan mereka sendirian dalam kondisi bingung.' },
      { id: 'lapor-posko', label: 'Lapor ke petugas medis saat tiba di titik kumpul', icon: 'medical_services', isCorrect: true, explanation: 'Benar! Pastikan mereka langsung mendapat pengecekan kesehatan.' },
      { id: 'tinggalkan', label: 'Suruh kakek itu diam saja, kamu lari duluan', icon: 'sprint', isCorrect: false, explanation: 'Salah! Kita wajib mendahulukan anak kecil, ibu hamil, lansia, dan penyandang disabilitas.' }
    ]
  },
  // 10
  {
    id: 'tas-siaga',
    disaster: 'evakuasi',
    level: 1,
    title: 'Menyiapkan Tas Siaga',
    subtitle: 'Fase Pra-Bencana',
    description: 'BMKG menetapkan status gunung berapi di dekat daerahmu menjadi level "SIAGA". Keluargamu memutuskan untuk menyiapkan Tas Siaga Bencana sedari sekarang.',
    icon: 'backpack',
    color: 'bg-fuchsia-100',
    borderColor: 'border-fuchsia-500',
    correctOrder: ['dokumen-penting', 'kotak-p3k', 'makanan-minuman', 'senter-peluit'],
    actions: [
      { id: 'dokumen-penting', label: 'Kumpulkan dokumen penting di map plastik', icon: 'folder_open', isCorrect: true, explanation: 'Benar! Ijazah, KK, surat tanah penting dilindungi dari abu vulkanik/hujan.' },
      { id: 'kotak-p3k', label: 'Masukkan masker N95, obat-obatan, dan P3K', icon: 'medical_services', isCorrect: true, explanation: 'Benar! Masker adalah alat terpenting saat erupsi. Obat pribadi juga wajib dibawa.' },
      { id: 'makanan-minuman', label: 'Siapkan air minum botol dan makanan awet (roti/biskuit)', icon: 'fastfood', isCorrect: true, explanation: 'Benar! Persediaan ini untuk bertahan hidup setidaknya 1-3 hari pertama.' },
      { id: 'senter-peluit', label: 'Sediakan senter, radio portabel, dan peluit', icon: 'sports_score', isCorrect: true, explanation: 'Benar! Peluit berguna memanggil bantuan tanpa menghabiskan energi untuk berteriak.' },
      { id: 'bawa-brankas', label: 'Masukkan brankas besi ke dalam koper besar', icon: 'inventory_2', isCorrect: false, explanation: 'Salah! Tas Siaga Bencana haruslah ringan dan mudah dibawa berlari.' },
      { id: 'mainan-ps', label: 'Masukkan mainan, PS5, dan laptop gaming', icon: 'videogame_asset', isCorrect: false, explanation: 'Salah! Saat bencana, utamakan barang primer penunjang keselamatan.' }
    ]
  }
];
