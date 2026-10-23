// ── src/app/Level2/level2Data.ts ─────────────────────────────────────
// Data terstruktur untuk LEVEL 2: DISASTER ANALYST (Mitigasi Kebencanaan Geologis)
// Diselaraskan 100% dengan materi resmi mitigasi bencana geologis untuk SMP Kelas 8:
// - Area 1: Mitigasi Bencana Gempa Bumi (Kesiapsiagaan 72 Jam & Drop-Cover-Hold On)
// - Area 2: Mitigasi Erupsi Vulkanik (4 Status PVMBG & Kawasan Rawan Bencana Merapi)

export interface DiscoveryPointL2 {
  id: string;
  title: string;
  shortDesc: string;
  fact: string;
  iconName: string;
  illustrationType:
  | 'earthquake-prep'
  | 'earthquake-mitigation-prep'
  | 'earthquake-action'
  | 'earthquake-post-safety'
  | 'earthquake-post-coordination'
  | 'volcano-status'
  | 'volcano-response'
  | 'volcano-post-ash'
  | 'volcano-post-sanitation'
  | 'volcano-post-pyroclastic'
  | 'wegener-pangea'
  | 'twin-mountains'
  | 'divergent-anim'
  | 'convergent-subduction'
  | 'convergent-landforms'
  | 'megathrust-earthquake'
  | 'seismograph-plates'
  | 'transform-sanandreas';
}

// ── ID MATERI "TIGA PERSIAPAN SEBELUM GEMPA" ───────────────────────────────
//
// Materi ini adalah SATU materi milik Area 1 (Mitigasi Gempa Bumi), namun
// gerbang TTS-nya juga menyebutkan kunci yang sama dengan `requiredKeys`.
// Karena itu id-nya ditulis SEKALI di sini lalu diimpor, supaya tulisan di
// `dialogueDataL2.ts`, `npcManagerL2.ts`, `gameEngine.ts`, dan katalog area
// tidak pernah berbeda huruf (kunci yang salah ketik TIDAK pernah terpenuhi,
// sehingga gerbang mustahil terbuka - dan itu tidak menimbulkan error apa pun).
export const MATERI_PERSIAPAN_GEMPA_ID = 'disc-earthquake-mitigation-prep';

export interface MiniChallengeL2 {
  id: string;
  title: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
  siagaClue?: string;
}

export interface TectonicAreaConfig {
  id: string;
  index: number;
  name: string;
  subtitle: string;
  location: string;
  boundaryType: 'mitigasi-gempa' | 'mitigasi-erupsi';
  badgeId: string;
  badgeName: string;
  colorTheme: {
    skyGradient: string;
    groundColor: string;
    accentColor: string;
    glowColor: string;
  };
  discoveries: DiscoveryPointL2[];
  challenge: MiniChallengeL2;
}

// ── KATALOG LENGKAP AREA LEVEL 2 (MITIGASI KEBENCANAAN) ───────────────────
export const LEVEL2_AREAS: TectonicAreaConfig[] = [
  // ── AREA 1: MITIGASI BENCANA GEMPA BUMI (KESIAPSIAGAAN & DROP-COVER-HOLD) ──
  {
    id: 'area-mitigasi-gempa',
    index: 0,
    name: 'Mitigasi Gempa Bumi',
    subtitle: 'Kesiapsiagaan, Simulasi Kelas & Jalur Evakuasi',
    location: 'Ruang Kelas Sekolah & Jalur Evakuasi',
    boundaryType: 'mitigasi-gempa',
    badgeId: 'earthquake-responder',
    badgeName: 'Earthquake Responder',
    colorTheme: {
      skyGradient: 'from-[#f1f5f9] via-[#e2e8f0] to-[#cbd5e1]',
      groundColor: '#78350f',
      accentColor: '#f59e0b',
      glowColor: 'rgba(245, 158, 11, 0.4)',
    },
    discoveries: [
      // Temuan 1: Kesiapsiagaan Sebelum Gempa & Tas Siaga (72 Jam)
      {
        id: 'disc-earthquake-prep',
        title: 'Temuan 1: Kesiapsiagaan & Tas Siaga Bencana (72 Jam)',
        shortDesc:
          'Kesiapsiagaan dimulai sebelum gempa terjadi. Ada beberapa upaya yang dapat kita lakukan. Pertama, persiapan sejak jauh sebelum gempa: mengenali denah darurat dan menata perabot berat agar tidak roboh. Pilih juga perabot yang ringan untuk dipasang di dinding, supaya tidak membahayakan bila jatuh. Kedua, menyusun rencana evakuasi bersama keluarga, lalu mengikuti latihan atau simulasi gempa secara berkala. Ketiga, memastikan bangunan rumah dan sekolah cukup kuat. Keempat, menyiapkan Tas Siaga Bencana (Survival Kit 72 Jam) yang memuat 4 kebutuhan vital: Air Minum & Ransum Makanan Darurat, Kotak P3K (kasa steril, perban, dan plester), Senter & Peluit SAR, serta Dokumen Penting (KK, KTP, Ijazah, Akta Lahir) & Uang Tunai dalam kantong ziplock anti-air. Saat gempa benar-benar terjadi, ikuti arahan petugas yang bertugas.',
        fact:
          'Tas Siaga Bencana wajib diletakkan di tempat strategis yang mudah dijangkau saat evakuasi darurat, berisi air minum, makanan tahan lama, P3K, senter, peluit, serta fotokopi dokumen penting (KK, KTP, ijazah, akta lahir) dan uang tunai secukupnya!',
        iconName: 'shield',
        illustrationType: 'earthquake-prep',
      },
      // Temuan 2: Aksi Tanggap Saat & Pasca Gempa (Merunduk, Berlindung, Bertahan)
      {
        id: 'disc-earthquake-action',
        title: 'Temuan 2: Aksi Keselamatan Gempa (Merunduk, Berlindung, Bertahan)',
        shortDesc:
          'Saat guncangan terjadi: Segera Merunduk/berlutut ke lantai (Drop), Berlindung di bawah meja belajar atau kursi kokoh untuk mendekap kepala dan tengkuk (Cover), dan Bertahan memegang erat kaki meja (Hold On). Setelah guncangan mereda: segera evakuasi tertib tanpa lift menyusuri tangga darurat menuju titik kumpul. Tetap tenang dan menghindar dari jendela kaca agar tidak terluka oleh pecahannya.',
        fact:
          'Jangan gunakan lift saat gempa bumi! Selalu gunakan tangga darurat dan waspadai kemungkinan gempa bumi susulan serta bahaya korsleting listrik.',
        iconName: 'zap',
        illustrationType: 'earthquake-action',
      },
      // Temuan 3 (PINDAH ke sini dari Area 2, permintaan pemilik proyek):
      // "Tiga Persiapan Sebelum Gempa" — bangunan tahan gempa, jalur evakuasi,
      // dan titik kumpul. Materi ini SEBELUMNYA hanya terpasang pada Resqy di
      // Area 2, sehingga pemain yang berada di Area 1 tidak menemukannya sama
      // sekali. Sekarang materi ini terdaftar di katalog Area 1 (indeks 2) dan
      // dibuka lewat Ican, yang memang membahas kepanikan & jalur evakuasi.
      //
      // Id-nya tetap `disc-earthquake-mitigation-prep` supaya pemain yang sudah
      // pernah membaca materi ini di Area 2 (progres tersimpan) tidak diminta
      // membacanya ulang, dan supaya gerbang Area 2 tidak mustahil terbuka.
      {
        id: MATERI_PERSIAPAN_GEMPA_ID,
        title: 'Temuan 3: Tiga Persiapan Sebelum Gempa — Bangunan Tahan Gempa, Jalur Evakuasi & Titik Kumpul',
        shortDesc:
          'Gempa belum bisa diramalkan, jadi persiapan harus dilakukan sebelum gempa terjadi. Pertama, membangun bangunan tahan gempa: kolom, balok, dan rangka beton bertulang yang kuat, atap dari bahan ringan, serta lemari, rak, dan papan tulis yang dipaku atau disekrup menempel ke dinding supaya tidak roboh menimpa kita. Kedua, menyiapkan jalur evakuasi: rute keluar yang ditandai tanda panah hijau dan selalu bebas dari barang, menyusuri koridor kelas lalu menuruni tangga darurat, serta letaknya menjauh dari jendela kaca besar, cermin, dan lemari tinggi yang mudah pecah atau jatuh. Ketiga, menyiapkan titik kumpul: tempat terbuka seperti lapangan sekolah yang jauh dari gedung, tiang listrik, dan pohon besar. Supaya semua hafal, kita berlatih simulasi evakuasi secara tertib: saat sirine berbunyi kita menunduk rendah di bawah bangku, melindungi kepala dan tengkuk dengan kedua tangan, lalu bertahan memegang kaki meja sampai getaran berhenti, barulah berjalan tertib menuju titik kumpul.',
        fact:
          'Jalur evakuasi dan titik kumpul harus dikenali dan dilatih seluruh penghuni bangunan jauh sebelum gempa terjadi — bukan saat guncangan sudah berlangsung. BNPB & BMKG menekankan tiga persiapan ini agar saat gempa kita tinggal mengikuti rute yang sudah hafal, tanpa berpikir panik dan tanpa memakai lift!',
        iconName: 'shield',
        illustrationType: 'earthquake-mitigation-prep',
      },
      // Temuan 3: istilah penting yang dipakai soal TTS area ini.
      {
        id: 'disc-terms-mitigasi',
        title: 'Temuan 4: Istilah Penting Saat Gempa',
        shortDesc:
          'Beberapa istilah berikut sering muncul saat gempa terjadi. Merunduk berarti merendahkan tubuh mendekati lantai agar terhindar dari benda yang jatuh. Berlindung adalah proses penyelamatan diri dengan masuk ke bawah meja belajar yang kokoh, atau memakai kursi sebagai tempat berlindung dan menunduk apabila kolong meja sudah tidak muat. Saat berjalan keluar dari koridor kelas, murid wajib menjaga sikap tertib, yaitu berbaris rapi tanpa kepanikan dan tidak saling mendorong. Sikap tenang juga wajib dijaga ketika merasakan guncangan dan menerima arahan dari guru, agar tidak memicu panik, yakni reaksi emosional yang membuat orang mengabaikan protokol keselamatan. BNPB adalah lembaga resmi pemerintah di tingkat nasional yang bertugas mengeluarkan pedoman penanggulangan bencana di Indonesia. Setelah keluar, seluruh warga menuju lapangan, yaitu area terbuka luas yang terbebas dari reruntuhan bangunan maupun tiang listrik, lalu berkumpul di titik kumpul yang telah ditetapkan secara khusus sebagai tempat berkumpulnya seluruh warga. Jendela adalah bagian dari ruang kelas yang biasanya terbuat dari kaca, dan wajib dijauhi saat gempa karena rawan pecah. Di dalam Kotak P3K, perban disimpan bersama kasa steril dan plester untuk menangani cedera atau luka saat keadaan darurat.',
        fact:
          'Urutan yang benar saat gempa: merunduk, berlindung, bertahan, lalu berjalan tertib menuju titik kumpul di lapangan. Panik hanya menambah risiko cedera.',
        iconName: 'clipboard',
        illustrationType: 'earthquake-prep',
      },
    ],
    challenge: {
      id: 'chall-gate-gempa',
      title: 'Ujian Analis: Kesiapsiagaan & Mitigasi Gempa Bumi',
      question:
        'Tindakan paling tepat dan aman yang harus dilakukan seorang siswa saat berada di dalam ruangan kelas ketika gempa bumi kuat tiba-tiba mengguncang adalah...',
      options: [
        {
          id: 'a',
          text: 'Segera lakukan Drop, Cover, and Hold On (merunduk, berlindung di bawah meja kokoh, lindungi kepala), tunggu hingga guncangan reda sebelum evakuasi tenang lewat tangga.',
          isCorrect: true,
        },
        {
          id: 'b',
          text: 'Langsung berlari kencang berebut keluar pintu kelas dan menggunakan lift darurat untuk turun ke lantai dasar.',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'Berdiri tegak di samping jendela kaca besar untuk memantau dari mana arah retakan tanah berasal.',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'Berteriak panik dan memanjat lemari buku di pojok kelas agar tubuh tidak menyentuh lantai yang berguncang.',
          isCorrect: false,
        },
      ],
      explanation:
        'Tepat sekali! Standar keselamatan internasional saat gempa adalah Drop (merunduk), Cover (berlindung di bawah meja kokoh), dan Hold On (pegang erat kaki meja). Setelah getaran berhenti, evakuasi tertib menuju titik kumpul tanpa menggunakan lift!',
      siagaClue:
        'Mitigasi Gempa = "Drop, Cover, Hold On di bawah meja kokoh, lalu evakuasi tangga ke titik kumpul terbuka"!',
    },
  },

  // ── AREA 2: SIMULASI TANGGAP GEMPA BUMI (DROP, COVER, HOLD ON & EVAKUASI) ──
  {
    id: 'area-simulasi-gempa',
    index: 1,
    name: 'Simulasi Tanggap Gempa',
    subtitle: 'Latihan Kesiapsiagaan, Drop-Cover-Hold On & Evakuasi Kelas',
    location: 'Ruang Kelas 8A (Simulasi Tanggap Bencana)',
    boundaryType: 'mitigasi-gempa',
    badgeId: 'earthquake-responder',
    badgeName: 'Earthquake Drill Master',
    colorTheme: {
      skyGradient: 'from-[#f1f5f9] via-[#e2e8f0] to-[#cbd5e1]',
      groundColor: '#78350f',
      accentColor: '#f59e0b',
      glowColor: 'rgba(245, 158, 11, 0.4)',
    },
    discoveries: [
      // Temuan 1: Tiga Persiapan SEBELUM Gempa — bangunan tahan gempa, jalur
      // evakuasi, dan titik kumpul.
      //
      // Area ini sebelumnya TIDAK PUNYA materi sama sekali (`discoveries: []`),
      // sehingga gerbangnya (l2_gate_gempa_sim) terbuka tanpa bacaan apa pun.
      // Materi ini tetap dapat dibuka dari area ini lewat dialog Resqy
      // (`resqy_briefing_area2` di `dialogueDataL2.ts`), jadi jalur lama tidak
      // dihapus.
      //
      // CATATAN PENTING (perbaikan berikutnya): id yang SAMA kini juga terdaftar
      // sebagai temuan indeks 2 di katalog Area 1 (`area-mitigasi-gempa`), karena
      // materi ini sesungguhnya milik Area 1 dan pemain harus dapat menemukannya
      // di sana. Keduanya menunjuk satu id yang sama persis, sehingga membacanya
      // di Area 1 langsung dihitung "sudah dibaca" di Area 2 (dan sebaliknya) —
      // materi ini tidak pernah diminta dibaca dua kali.
      //
      // `illustrationType: 'earthquake-mitigation-prep'` adalah nilai BARU yang
      // didaftarkan di `DiscoveryPointL2` di atas, karena gambar materi ini
      // (bangunan, jalur evakuasi, titik kumpul) tidak sama dengan gambar
      // "Tas Siaga 72 Jam" (`earthquake-prep`) maupun gambar pascabencana.
      {
        id: MATERI_PERSIAPAN_GEMPA_ID,
        title: 'Temuan 1: Tiga Persiapan Sebelum Gempa — Bangunan Tahan Gempa, Jalur Evakuasi & Titik Kumpul',
        shortDesc:
          'Gempa belum bisa diramalkan, jadi persiapan harus dilakukan sebelum gempa terjadi. Pertama, membangun bangunan tahan gempa: kolom, balok, dan rangka beton bertulang yang kuat, atap dari bahan ringan, serta lemari, rak, dan papan tulis yang dipaku atau disekrup menempel ke dinding supaya tidak roboh menimpa kita. Kedua, menyiapkan jalur evakuasi: rute keluar yang ditandai tanda panah hijau dan selalu bebas dari barang, menyusuri koridor kelas lalu menuruni tangga darurat, serta letaknya menjauh dari jendela kaca besar, cermin, dan lemari tinggi yang mudah pecah atau jatuh. Ketiga, menyiapkan titik kumpul: tempat terbuka seperti lapangan sekolah yang jauh dari gedung, tiang listrik, dan pohon besar. Supaya semua hafal, kita berlatih simulasi evakuasi secara tertib: saat sirine berbunyi kita menunduk rendah di bawah bangku, melindungi kepala dan tengkuk dengan kedua tangan, lalu bertahan memegang kaki meja sampai getaran berhenti, barulah berjalan tertib menuju titik kumpul.',
        fact:
          'Jalur evakuasi dan titik kumpul harus dikenali dan dilatih seluruh penghuni bangunan jauh sebelum gempa terjadi — bukan saat guncangan sudah berlangsung. BNPB & BMKG menekankan tiga persiapan ini agar saat gempa kita tinggal mengikuti rute yang sudah hafal, tanpa berpikir panik dan tanpa memakai lift!',
        iconName: 'shield',
        illustrationType: 'earthquake-mitigation-prep',
      },
    ],
    challenge: {
      id: 'chall-gate-simulasi',
      title: 'Ujian Akhir Simulasi: Tanggap Gempa Bumi Sekolah',
      question:
        'Urutan tindakan penyelamatan mandiri yang paling tepat saat sirine gempa berbunyi di sekolah hingga evakuasi selesai adalah...',
      options: [
        {
          id: 'a',
          text: 'Merunduk (Drop) -> Berlindung di kolong meja kokoh (Cover) -> Bertahan pegang kaki meja (Hold On) -> Setelah getaran reda, evakuasi tertib ke lapangan terbuka.',
          isCorrect: true,
        },
        {
          id: 'b',
          text: 'Langsung berteriak panik dan berebut keluar pintu menggunakan lift darurat untuk turun ke lantai bawah.',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'Berdiri di dekat jendela kaca besar untuk merekam video guncangan tanah dengan ponsel.',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'Memanjat ke atas meja dan lemari agar tidak menyentuh lantai yang sedang berguncang.',
          isCorrect: false,
        },
      ],
      explanation:
        'Sempurna! Protokol keselamatan internasional dan BNPB adalah 3B (Merunduk, Berlindung, Bertahan) di bawah meja kokoh, lalu setelah getaran reda barulah evakuasi tertib lewat tangga menuju titik kumpul lapangan terbuka!',
      siagaClue:
        'Simulasi Gempa = "Merunduk -> Berlindung di bawah meja -> Bertahan pegang kaki meja -> Evakuasi tertib ke titik kumpul"!',
    },
  },

  // ── AREA 3: MITIGASI PASCABENCANA GEMPA BUMI (TITIK KUMPUL & POSKO MEDIS) ──
  {
    id: 'area-lapangan-evakuasi',
    index: 2,
    name: 'Lapangan Evakuasi Sekolah (Pasca Gempa Besar)',
    subtitle: 'Mitigasi Pascabencana Gempa, Titik Kumpul & Pertolongan Medis',
    location: 'Lapangan Upacara Sekolah (Titik Kumpul Evakuasi)',
    boundaryType: 'mitigasi-gempa',
    badgeId: 'post-disaster-master',
    badgeName: 'Post-Earthquake Responder',
    colorTheme: {
      skyGradient: 'from-[#0284c7] via-[#38bdf8] to-[#bae6fd]',
      groundColor: '#166534',
      accentColor: '#10b981',
      glowColor: 'rgba(16, 185, 129, 0.4)',
    },
    discoveries: [
      {
        id: 'disc-post-safety',
        title: 'Prosedur Keselamatan & Medis Pascabencana',
        shortDesc:
          'Setelah getaran gempa berhenti, keselamatan tetap menjadi prioritas utama. Waspadai bahaya gempa susulan (aftershock) dan hindari mendekati bangunan yang retak atau reruntuhan bangunan yang masih bisa roboh. Prioritaskan pertolongan pertama (P3K) bagi korban yang terluka, lalu hubungi ambulans atau tim medis bila lukanya cukup berat. Para petugas dan guru mengarahkan warga agar tetap tenang dan tidak panik. Korban dengan luka paling kritis diberi penanda merah agar ditolong lebih dulu; korban yang tidak dapat berjalan diangkut memakai tandu menuju ambulans. Seluruh tindakan pencegahan ini bertujuan menekan jumlah korban.',
        fact:
          'BNPB menginstruksikan warga untuk tetap berada di tempat terbuka jauh dari tiang, kabel listrik, dan pohon, serta memeriksa potensi korsleting listrik atau kebocoran gas sebelum meninggalkan area.',
        iconName: 'shield',
        illustrationType: 'earthquake-post-safety',
      },
      {
        id: 'disc-post-coordination',
        title: 'Manajemen Titik Kumpul & Komunikasi Resmi',
        shortDesc:
          'Di titik kumpul (assembly point) yang biasanya berupa lapangan terbuka, koordinator bencana dan guru melakukan presensi menyeluruh untuk memastikan tidak ada siswa yang tertinggal di dalam gedung. Seluruh warga diminta berkumpul di tempat itu dan tidak berpencar. Hasil kehadiran dicatat, lalu dilaporkan ke posko utama. Dengarkan instruksi resmi dari BMKG atau BPBD, hindari menyebarkan hoax, periksa potensi korseleting listrik, dan biarkan anggota PMR membantu tim medis selama proses evakuasi berlangsung.',
        fact:
          'Jangan pernah kembali masuk ke dalam gedung sekolah yang retak untuk mengambil barang yang tertinggal hingga tim ahli menyatakan struktur bangunan sudah aman.',
        iconName: 'clipboard',
        illustrationType: 'earthquake-post-coordination',
      },
      // Temuan 3: istilah penting yang dipakai soal TTS area ini.
      {
        id: 'disc-terms-lapangan',
        title: 'Istilah Penting di Lapangan Evakuasi',
        shortDesc:
          'Di lapangan evakuasi, BPBD adalah badan penanggulangan bencana di tingkat daerah yang menjadi sumber informasi dan instruksi resmi, sehingga murid tidak termakan hoax, yaitu berita bohong atau kabar palsu yang dilarang disebarkan karena membuat orang semakin panik. Murid wajib menjauhi reruntuhan, yakni sisa puing bangunan atau struktur dinding yang sudah retak, dan memeriksa potensi korsleting, yaitu kerusakan pada kabel atau tiang listrik yang dapat memicu api kebakaran. Korban adalah orang yang mengalami dampak buruk bencana, seperti luka, cedera, atau ketakutan, dan harus segera ditolong. Korban luka berat diangkut memakai tandu, yaitu bentangan alas dengan dua tongkat pegangan, menuju ambulans, kendaraan medis darurat yang harus segera dihubungi. Korban yang meninggal, yakni sudah kehilangan nyawanya, biasanya diberi penanda label berwarna hitam. Selama gempa susulan masih mungkin terjadi, seluruh warga harus tetap waspada, yaitu sikap berhati-hati dan selalu bersiap sedia. Pencegahan adalah segala tindakan persiapan, aturan, dan latihan yang dilakukan jauh sebelum bencana terjadi untuk meminimalkan jumlah korban luka.',
        fact:
          'Urutan pertolongan di lapangan: amankan diri, jauhi reruntuhan, minta bantuan medis melalui ambulans, lalu catat kondisi setiap korban.',
        iconName: 'clipboard',
        illustrationType: 'earthquake-post-safety',
      },
    ],
    challenge: {
      id: 'chall-gate-pascabencana',
      title: 'Ujian Akhir: Tanggap Pascabencana Gempa Bumi',
      question:
        'Tindakan yang paling tepat dilakukan siswa setelah berhasil dievakuasi dan berkumpul di lapangan terbuka sekolah adalah...',
      options: [
        {
          id: 'a',
          text: 'Tetap berada di titik kumpul lapangan terbuka, melaporkan kondisi diri/teman ke posko P3K, waspada gempa susulan, dan menunggu instruksi resmi dari guru/BPBD.',
          isCorrect: true,
        },
        {
          id: 'b',
          text: 'Segera masuk kembali ke ruang kelas lantai 2 untuk mengambil tas, buku, dan gawai yang tertinggal di bawah meja.',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'Menyebarkan kabar di media sosial bahwa sekolah akan runtuh total tanpa memverifikasi sumber dari BMKG.',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'Berdiri dan berteduh di samping tembok pembatas sekolah yang retak atau di bawah tiang listrik besar.',
          isCorrect: false,
        },
      ],
      explanation:
        'Benar sekali! Di titik kumpul terbuka, kita harus tetap tenang, melakukan presensi, melaporkan korban luka ke posko P3K, waspada gempa susulan, dan hanya mempercayai informasi resmi dari BMKG/BPBD!',
      siagaClue:
        'Pascabencana = "Tetap di lapangan terbuka -> Waspada gempa susulan -> Lapor posko medis P3K -> Pantau info resmi BMKG"!',
    },
  },

  // ── AREA 4: PRABENCANA ERUPSI MERAPI (POS PENGAMATAN PVMBG & LERENG MERAPI KRB III) ──
  {
    id: 'area-pos-pengamatan-merapi',
    index: 3,
    name: 'Pos Pengamatan Merapi',
    subtitle: 'Prabencana Erupsi Merapi: Status PVMBG & Kesiapsiagaan KRB',
    location: 'Pos Pengamatan PVMBG & Lereng Merapi (KRB III)',
    boundaryType: 'mitigasi-erupsi',
    badgeId: 'volcano-prep-master',
    badgeName: 'Volcano Preparedness Master',
    colorTheme: {
      skyGradient: 'from-[#38bdf8] via-[#7dd3fc] to-[#bae6fd]',
      groundColor: '#166534',
      accentColor: '#f97316',
      glowColor: 'rgba(249, 115, 22, 0.4)',
    },
    discoveries: [
      // Temuan 1: Tingkat Status Aktivitas Gunung Api (Level I-IV) & MAGMA Indonesia
      {
        id: 'disc-volcano-status',
        title: 'Temuan 1: 4 Tingkat Status Aktivitas Gunung Api & magma Indonesia',
        shortDesc:
          'PVMBG menetapkan 4 status gunung api: Level I (Normal - hijau), Level II (Waspada - kuning), Level III (Siaga - oranye), dan Level IV (Awas - merah). Pantau info resmi lewat aplikasi magma Indonesia. Di pos pengamatan, petugas memantau gunung dengan beberapa alat. seismograf merekam getaran atau gempa tremor di dalam gunung. Alat lain mengukur deformasi, yaitu perubahan bentuk tubuh gunung yang mengembung karena magma naik ke bawah kawah. Petugas juga memeriksa gas vulkanik yang keluar dari kawah, karena gas beracun berbahaya bagi warga. Pengamatan kadang terhambat kabut tebal yang menutupi puncak, sehingga petugas mengandalkan kamera pemantau. Pada status Waspada, asap solfatara putih mulai mengepul dari kawah. Bila tekanan terus meningkat, erupsi dapat terjadi dan lava panas mengalir menuruni lereng.',
        fact:
          'Pada Level IV (AWAS), letusan utama sedang atau segera terjadi. Warga di Kawasan Rawan Bencana III (KRB III) wajib segera evakuasi mandiri!',
        iconName: 'mountain',
        illustrationType: 'volcano-status',
      },
      // Temuan 2: Kawasan Rawan Bencana (KRB Merapi) & APD Perlindungan Abu
      {
        id: 'disc-volcano-response',
        title: 'Temuan 2: Zonasi KRB Merapi & APD Pelindung Abu Vulkanik',
        shortDesc:
          'Kawasan Merapi dibagi 3 zona resmi: KRB III (zona merah lereng puncak rawan awan panas), KRB II (lereng tengah siap evakuasi mandiri), dan KRB I (bantaran sungai rawan aliran awan panas guguran). Warga wajib menyiapkan APD masker N95, kacamata goggle, dan baju tertutup.',
        fact:
          'KRB III adalah zona larangan hunian tetap karena selalu terancam awan panas (wedhus gembel). Saat status Awas (Level IV), seluruh warga di KRB III wajib segera dievakuasi total!',
        iconName: 'shield',
        illustrationType: 'volcano-response',
      },
      // Temuan 3: istilah penting yang dipakai soal TTS area ini.
      {
        id: 'disc-terms-merapi',
        title: 'Temuan 3: Istilah Penting di Pos Pengamatan',
        shortDesc:
          'Status gunung api dibagi menjadi empat tingkat. Normal adalah tingkatan paling dasar (Level I), yang berarti kondisi gunung tenang dan aman untuk kegiatan masyarakat. Waspada adalah tingkat satu langkah di atas normal, ditandai dengan peringatan agar warga menjauh dua sampai tiga kilometer dari kawah aktif. KRB adalah singkatan dari Kawasan Rawan Bencana, yaitu pembagian wilayah di sekitar gunung api menjadi tiga zona berdasarkan tingkat ancaman bahayanya. Erupsi atau letusan adalah peristiwa semburan material vulkanik dari dalam kawah. Magma adalah batuan cair yang sangat panas di dalam perut bumi; setelah berhasil keluar mencapai permukaan, ia disebut lava dan mengalir menyusuri lereng. Awan panas adalah material vulkanik mematikan berupa gumpalan campuran gas, abu, dan bebatuan bersuhu ratusan derajat Celsius yang meluncur deras menuruni lereng, dan oleh masyarakat setempat sering disebut wedhus gembel. Untuk melindungi diri, warga memakai masker, yaitu alat pelindung pernapasan untuk menyaring partikel debu vulkanik yang tajam, serta goggle, yaitu kacamata pelindung yang tertutup rapat agar mata tidak kelilipan material silika. Petugas memantau gunung dengan seismograf, yaitu alat khusus di pos pengamatan yang digunakan untuk mencatat getaran atau gelombang seismik dari tubuh gunung api.',
        fact:
          'Saat status mencapai Awas, jangan menunggu. Ikuti jalur evakuasi, karena awan panas dapat meluncur lebih cepat daripada kendaraan di lereng.',
        iconName: 'clipboard',
        illustrationType: 'volcano-status',
      },
    ],
    challenge: {
      id: 'chall-gate-volcano-prep',
      title: 'Ujian Analis: Kesiapsiagaan Prabencana Erupsi Merapi',
      question:
        'Tingkat status aktivitas gunung api tertinggi yang menandakan letusan utama sedang atau berpeluang besar segera terjadi sehingga warga di Kawasan Rawan Bencana III (KRB III) wajib segera mengungsi adalah...',
      options: [
        {
          id: 'a',
          text: 'Level IV (AWAS) - letusan utama sedang atau segera berlangsung, warga di KRB III wajib segera mengungsi.',
          isCorrect: true,
        },
        {
          id: 'b',
          text: 'Level I (NORMAL) - aktivitas dasar visual dan seismik aman untuk seluruh kegiatan masyarakat.',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'Level II (WASPADA) - peningkatan aktivitas minor, warga cukup diimbau tidak mendekati kawah.',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'Level III (SIAGA) - peningkatan seismik nyata, posko mulai siaga namun belum evakuasi total.',
          isCorrect: false,
        },
      ],
      explanation:
        'Tepat sekali! Tingkat status tertinggi PVMBG adalah Level IV (AWAS). Pada tingkat ini, letusan utama sedang atau segera terjadi dan seluruh warga di KRB III wajib segera dievakuasi keluar dari radius bahaya!',
      siagaClue:
        'Prabencana Erupsi = "Level IV (AWAS) = Erupsi utama mengancam, warga KRB III wajib segera evakuasi dengan masker dan tas siaga"!',
    },
  },

  // ── AREA 5: SIMULASI TANGGAP ERUPSI GUNUNG MERAPI (DUSUN DESTANA KRB III) ──
  {
    id: 'area-simulasi-merapi',
    index: 4,
    name: 'Simulasi Erupsi Merapi',
    subtitle: 'Simulasi Tanggap Bencana: 4 Status PVMBG, QTE Kesiapsiagaan & Evakuasi Dusun',
    location: 'Desa Tangguh Bencana (Destana) & Lereng Merapi KRB III',
    boundaryType: 'mitigasi-erupsi',
    badgeId: 'volcano-survivor-hero',
    badgeName: 'Merapi Volcano Survivor & Hero',
    colorTheme: {
      skyGradient: 'from-[#0284c7] via-[#38bdf8] to-[#e0f2fe]',
      groundColor: '#15803d',
      accentColor: '#dc2626',
      glowColor: 'rgba(220, 38, 38, 0.4)',
    },
    discoveries: [
      {
        id: 'disc-volcano-sim-signs',
        title: 'Temuan 1: Urutan Tanda Alam Erupsi & Status PVMBG',
        shortDesc:
          'Erupsi gunung api tidak datang tiba-tiba. Sebelumnya ada tanda-tanda alam yang berurutan. Mula-mula muncul gempa tremor dan asap putih dari krater di puncak (status WASPADA), lalu PVMBG memberi peringatan kepada warga. Selanjutnya asap berubah kelabu pekat, terdengar gemuruh, satwa panik menurun dari gunung, dan tumbuhan layu akibat panas tanah (status SIAGA). Puncaknya terjadi ledakan yang menyemburkan muntahan magma (status AWAS). sumber bahaya seperti awan panas piroklastik dan lahar mengancam lereng gunung.',
        fact:
          'Hewan liar memiliki kepekaan insting terhadap gelombang mikro seismik dan perubahan suhu tanah sehingga selalu bermigrasi menjauhi puncak sebelum letusan terjadi. Tanda-tanda alam inilah yang menjadi peringatan dini bagi warga agar segera menjauh dari bahaya.',
        iconName: 'mountain',
        illustrationType: 'volcano-status',
      },
      {
        id: 'disc-volcano-sim-evac',
        title: 'Temuan 2: Protokol Evakuasi Mandiri & Penggunaan APD',
        shortDesc:
          'Saat status SIAGA, siapkan tas siaga dan kenakan masker serta kacamata tertutup untuk menyaring abu vulkanik. Saat status AWAS, segera mengungsi dan tinggalkan zona KRB III menggunakan kendaraan evakuasi menuju Tempat Evakuasi Akhir (TEA).',
        fact:
          'Abu vulkanik sangat tajam seperti pecahan kaca mikroskopis. Jangan pernah mengucek mata yang terkena abu dan segera gunakan air mengalir.',
        iconName: 'shield',
        illustrationType: 'volcano-response',
      },
    ],
    challenge: {
      id: 'chall-gate-volcano-sim',
      title: 'Ujian Akhir: Simulasi Tanggap Darurat Erupsi Merapi',
      question:
        'Saat terjadi hujan abu lebat dan status gunung api resmi dinaikkan menjadi AWAS (Level IV) dengan suara dentuman magma, tindakan paling tepat adalah...',
      options: [
        {
          id: 'a',
          text: 'Segera mengenakan masker dan kacamata pelindung, lalu langsung menaiki kendaraan evakuasi keluar dari KRB III.',
          isCorrect: true,
        },
        {
          id: 'b',
          text: 'Tetap berada di dalam rumah dan menunggu letusan selesai tanpa menggunakan masker.',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'Mendaki ke lereng atas untuk memotret kepulan awan panas dari jarak dekat.',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'Mengucek mata yang perih dan bersembunyi di bawah pohon rindang di lereng.',
          isCorrect: false,
        },
      ],
      explanation:
        'Sangat tepat! Pada status AWAS, seluruh warga KRB III wajib segera keluar radius bahaya dengan kendaraan evakuasi serta mengenakan APD pelindung abu vulkanik!',
      siagaClue:
        'Simulasi Tanggap Erupsi = "Pakai masker & goggle, evakuasi kilat dengan truk keluar KRB III menuju zona aman!"',
    },
  },
  // ── AREA 6: PASCABENCANA ERUPSI MERAPI (BARAK PENGUNGSIAN & PEMULIHAN BAHAYA SEKUNDER) ──
  {
    id: 'area-barak-pengungsian',
    index: 5,
    name: 'Barak Pengungsian & Pemulihan',
    subtitle: 'Pascabencana Erupsi: Barak Terpadu, Penanganan Abu & Waspada Awan Panas',
    location: 'Barak Pengungsian Terpadu (Zona Aman KRB I / Dataran Rendah)',
    boundaryType: 'mitigasi-erupsi',
    badgeId: 'volcano-recovery-master',
    badgeName: 'Volcano Recovery & Rehabilitation Master',
    colorTheme: {
      skyGradient: 'from-[#0284c7] via-[#38bdf8] to-[#bae6fd]',
      groundColor: '#166534',
      accentColor: '#059669',
      glowColor: 'rgba(5, 150, 105, 0.4)',
    },
    discoveries: [
      // Temuan 1: Penanganan Abu Vulkanik & Pembersihan Atap Rumah Gotong Royong
      {
        id: 'disc-post-ash',
        title: 'Temuan 1: Penanganan Abu Vulkanik & Pembersihan Atap Rumah',
        shortDesc:
          'Endapan debu vulkanik tebal di atap rumah wajib dibersihkan secara gotong royong agar atap tidak ambruk akibat beban abu yang sangat berat (terutama saat basah terkena hujan). Selain itu, hindari mengendarai motor atau mobil dengan kecepatan tinggi di jalanan berabu karena jalan sangat licin dan partikel abu menyumbat serta merusak mesin kendaraan. Setelah petugas menyatakan wilayah sudah aman, warga yang rumahnya rusak tinggal sementara di barak pengungsian. Di sana bantuan logistik seperti makanan, selimut, dan air bersih disalurkan setiap hari. Kelompok yang perlu didahulukan, misalnya lansia dan anak-anak, didata oleh petugas. Jadwal pembagian bantuan dan informasi penting ditempel di papan pengumuman barak agar semua warga mengetahuinya. Setelah keadaan dinyatakan aman, tahap rehabilitasi memulihkan kehidupan warga, lalu rekonstruksi membangun kembali sarana dengan standar yang lebih baik.',
        fact:
          'Buku Saku BNPB menegaskan: Bersihkan atap dari timbunan debu vulkanik karena beratnya bisa merobohkan dan merusak atap rumah atau bangunan. Kurangi paparan abu dan hindari berkendara di jalan berabu!',
        iconName: 'shield',
        illustrationType: 'volcano-post-ash',
      },
      // Temuan 2: Kesehatan, Sanitasi & Sumber Air Bersih Tertutup
      {
        id: 'disc-post-sanitation',
        title: 'Temuan 2: Kesehatan, Sanitasi & Perlindungan Air Minum',
        shortDesc:
          'Abu vulkanik tersusun atas material silika yang menjadi komposisi dalam pembuatan kaca yang dapat merusak jaringan paru-paru dan melukai kornea mata. Selalu kenakan masker dan kacamata tertutup saat beraktivitas. Jika mata terkena debu, basuh dengan air mengalir dan jangan pernah mengucek mata. Pastikan seluruh tandon dan sumber air minum ditutup rapat agar tidak tercemar gas asam dan belerang beracun. Di barak pengungsian, jaga kebersihan air dan sanitasi agar tidak menimbulkan penyakit. Warga yang luka atau mengalami trauma akibat bencana segera ditangani oleh tim medis. Biasakan cucitangan memakai air mengalir dan sabun sebelum makan.',
        fact:
          'Air minum yang terpapar abu vulkanik dapat mengalami penurunan pH drastis (sangat asam) dan terkontaminasi senyawa belerang berbahaya. Tutup tandon air rapat-rapat dan gunakan air bersih higienis di posko pengungsian!',
        iconName: 'heart',
        illustrationType: 'volcano-post-sanitation',
      },
      // Temuan 3: Waspada Bahaya Sekunder: Awan Panas Guguran di Lembah Sungai
      {
        id: 'disc-post-pyroclastic',
        title: 'Temuan 3: Bahaya Sekunder — Waspada Awan Panas Guguran di Lembah Sungai',
        shortDesc:
          'Bahaya letusan gunung api belum berakhir saat erupsi reda! Awan panas guguran (wedhus gembel) berisi gas dan material vulkanik panas bersuhu 300-700 °C dapat meluncur deras menyusuri lembah sungai yang berhulu di Merapi, menghancurkan jembatan dan sabo dam di alurnya. Material vulkanik yang bercampur air hujan mengalir sebagai lahar. Letusan eksplosif menyemburkan material dari krater, sedangkan erupsi efusif hanya mengeluarkan lelehan lava yang mengalir perlahan.',
        fact:
          'BNPB & PVMBG mengimbau masyarakat untuk menjauhi lembah dan bantaran sungai yang berhulu di puncak gunung berapi, serta mematuhi sirene Early Warning System (EWS) sungai yang memantau getaran dan aliran awan panas!',
        iconName: 'mountain',
        illustrationType: 'volcano-post-pyroclastic',
      },
      // Temuan 4: istilah penting yang dipakai soal TTS area ini.
      {
        id: 'disc-terms-posko',
        title: 'Temuan 4: Istilah Penting di Barak Pengungsian',
        shortDesc:
          'Di barak pengungsian, istilah berikut perlu dipahami. Barak adalah tempat penampungan darurat terpadu di zona aman (KRB I) sebagai tempat tinggal sementara bagi warga yang rumahnya terdampak erupsi. Trauma adalah kondisi psikologis yang ditandai rasa takut mendalam pada korban pascabencana, sehingga memerlukan penanganan khusus dari psikolog atau psikiater. Air bersih di posko dapat tercemar belerang, yaitu zat gas vulkanik berbau sangat menyengat yang sering terbawa abu vulkanik. Bahaya lanjutan pascaerupsi tetap ada: awan panas dapat menerjang kawasan lereng meskipun letusan utama telah usai. Krater adalah cekungan atau lubang besar di puncak gunung yang menjadi tempat menyemburnya magma, gas, dan awan panas. Letusan eksplosif terjadi secara meledak-ledak dan sangat dahsyat, mampu melontarkan abu dan batuan vulkanik tinggi ke udara. Setelah keadaan dinyatakan aman, tahap rekonstruksi adalah manajemen pemulihan dengan membangun kembali sarana dan prasarana agar standarnya lebih baik, sehingga dampak erupsi di masa depan dapat diminimalkan.',
        fact:
          'Trauma bukan kelemahan, melainkan kondisi psikologis yang membutuhkan pendampingan. Jangan ragu merujuk korban kepada psikolog.',
        iconName: 'clipboard',
        illustrationType: 'volcano-post-ash',
      },
    ],
    challenge: {
      id: 'chall-gate-shelter-recovery',
      title: 'Ujian Akhir Analis: Pascabencana Erupsi & Pemulihan Bahaya Sekunder',
      question:
        'Tindakan pascabencana erupsi yang paling tepat untuk menjaga keselamatan tempat tinggal dan kesehatan warga di sekitar kawasan terdampak hujan abu adalah...',
      options: [
        {
          id: 'a',
          text: 'Membersihkan timbunan abu di atap rumah agar tidak roboh, menutup sumber air minum, memakai masker, dan menjauhi alur sungai karena ancaman awan panas guguran di lembah sungai.',
          isCorrect: true,
        },
        {
          id: 'b',
          text: 'Membiarkan endapan abu tebal menumpuk di atap rumah dan mengendarai sepeda motor dengan kecepatan tinggi di jalanan berdebu.',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'Membuka penutup tandon air minum agar terkena hujan abu dan mengucek mata yang perih dengan tangan kotor.',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'Bermain dan mandi di aliran sungai yang berhulu di puncak Merapi saat hujan deras sedang mengguyur kawasan puncak.',
          isCorrect: false,
        },
      ],
      explanation:
        'Sempurna! Protokol pascabencana resmi BNPB meliputi pembersihan atap rumah dari beban berat abu, perlindungan sumber air minum dari belerang, penggunaan masker pelindung silika, dan kewaspadaan terhadap awan panas guguran yang menyusuri lembah sungai!',
      siagaClue:
        'Pascabencana Erupsi = "Bersihkan atap gotong royong, tutup tandon air minum, pakai masker, dan jauhi lembah sungai (waspada awan panas guguran)!"',
    },
  },
];



