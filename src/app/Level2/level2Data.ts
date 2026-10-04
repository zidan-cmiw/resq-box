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
  | 'earthquake-action'
  | 'earthquake-post-safety'
  | 'earthquake-post-coordination'
  | 'volcano-status'
  | 'volcano-response'
  | 'volcano-post-ash'
  | 'volcano-post-sanitation'
  | 'volcano-post-lahar'
  | 'wegener-pangea'
  | 'twin-mountains'
  | 'divergent-anim'
  | 'convergent-subduction'
  | 'convergent-landforms'
  | 'megathrust-earthquake'
  | 'seismograph-plates'
  | 'transform-sanandreas';
}

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
          'Kesiapsiagaan dimulai sebelum gempa terjadi: mengenali denah darurat, menata perabot berat agar tidak roboh, serta menyiapkan Tas Siaga Bencana (Survival Kit 72 Jam) yang memuat 4 kebutuhan vital: Air Minum & Ransum Makanan Darurat, Kotak P3K, Senter & Peluit SAR, serta Dokumen Penting (KK, KTP, Ijazah, Akta Lahir) & Uang Tunai dalam kantong ziplock anti-air.',
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
          'Saat guncangan terjadi: Segera Merunduk/berlutut ke lantai (Drop), Berlindung di bawah meja belajar kokoh untuk mendekap kepala dan tengkuk (Cover), dan Bertahan memegang erat kaki meja (Hold On). Setelah guncangan mereda: segera evakuasi tertib tanpa lift menyusuri tangga darurat menuju titik kumpul.',
        fact:
          'Jangan gunakan lift saat gempa bumi! Selalu gunakan tangga darurat dan waspadai kemungkinan gempa bumi susulan serta bahaya korsleting listrik.',
        iconName: 'zap',
        illustrationType: 'earthquake-action',
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
    discoveries: [],
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
          'Setelah getaran gempa berhenti, keselamatan tetap menjadi prioritas utama. Waspadai bahaya gempa susulan (aftershock), hindari mendekati bangunan yang retak, dan prioritaskan pertolongan pertama (P3K) bagi korban yang terluka.',
        fact:
          'BNPB menginstruksikan warga untuk tetap berada di tempat terbuka jauh dari tiang, kabel listrik, dan pohon, serta memeriksa potensi korsleting listrik atau kebocoran gas sebelum meninggalkan area.',
        iconName: 'shield',
        illustrationType: 'earthquake-post-safety',
      },
      {
        id: 'disc-post-coordination',
        title: 'Manajemen Titik Kumpul & Komunikasi Resmi',
        shortDesc:
          'Di titik kumpul (assembly point), koordinator bencana dan guru melakukan presensi menyeluruh untuk memastikan tidak ada siswa yang tertinggal di dalam gedung. Dengarkan instruksi resmi dari BMKG atau BPBD dan hindari menyebarkan isu hoaks.',
        fact:
          'Jangan pernah kembali masuk ke dalam gedung sekolah yang retak untuk mengambil barang yang tertinggal hingga tim ahli menyatakan struktur bangunan sudah aman.',
        iconName: 'clipboard',
        illustrationType: 'earthquake-post-coordination',
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
        title: 'Temuan 1: 4 Tingkat Status Aktivitas Gunung Api & MAGMA Indonesia',
        shortDesc:
          'PVMBG menetapkan 4 status gunung api: Level I (Normal - hijau), Level II (Waspada - kuning), Level III (Siaga - oranye), dan Level IV (Awas - merah). Pantau info resmi lewat aplikasi MAGMA Indonesia.',
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
          'Kawasan Merapi dibagi 3 zona resmi: KRB III (zona merah lereng puncak rawan awan panas), KRB II (lereng tengah siap evakuasi mandiri), dan KRB I (bantaran sungai rawan banjir lahar). Warga wajib menyiapkan APD masker N95, kacamata goggle, dan baju tertutup.',
        fact:
          'KRB III adalah zona larangan hunian tetap karena selalu terancam awan panas (wedhus gembel). Saat status Awas (Level IV), seluruh warga di KRB III wajib segera dievakuasi total!',
        iconName: 'shield',
        illustrationType: 'volcano-response',
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
          'Erupsi gunung api diawali oleh gempa tremor dan asap putih (WASPADA), disusul asap kelabu pekat, satwa panik turun gunung, dan tumbuhan layu akibat panas tanah (SIAGA), hingga muntahan magma dan dentuman dahsyat (AWAS).',
        fact:
          'Hewan liar memiliki kepekaan insting terhadap gelombang mikro seismik dan perubahan suhu tanah sehingga selalu bermigrasi menjauhi puncak sebelum letusan terjadi.',
        iconName: 'mountain',
        illustrationType: 'volcano-status',
      },
      {
        id: 'disc-volcano-sim-evac',
        title: 'Temuan 2: Protokol Evakuasi Mandiri & Penggunaan APD',
        shortDesc:
          'Saat status SIAGA, siapkan tas siaga dan kenakan masker serta kacamata tertutup untuk menyaring abu vulkanik. Saat status AWAS, segera tinggalkan zona KRB III menggunakan kendaraan evakuasi menuju Tempat Evakuasi Akhir (TEA).',
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
    subtitle: 'Pascabencana Erupsi: Barak Terpadu, Penanganan Abu & Waspada Lahar',
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
          'Endapan debu vulkanik tebal di atap rumah wajib dibersihkan secara gotong royong agar atap tidak ambruk akibat beban abu yang sangat berat (terutama saat basah terkena hujan). Selain itu, hindari mengendarai motor atau mobil dengan kecepatan tinggi di jalanan berabu karena jalan sangat licin dan partikel abu menyumbat serta merusak mesin kendaraan.',
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
          'Abu vulkanik mengandung pecahan kaca silika tajam mikroskopis yang dapat merusak jaringan paru-paru dan melukai kornea mata. Selalu kenakan masker dan kacamata tertutup saat beraktivitas. Jika mata terkena debu, basuh dengan air mengalir dan jangan pernah mengucek mata. Pastikan seluruh tandon dan sumber air minum ditutup rapat agar tidak tercemar gas asam dan belerang beracun.',
        fact:
          'Air minum yang terpapar abu vulkanik dapat mengalami penurunan pH drastis (sangat asam) dan terkontaminasi senyawa belerang berbahaya. Tutup tandon air rapat-rapat dan gunakan air bersih higienis di posko pengungsian!',
        iconName: 'heart',
        illustrationType: 'volcano-post-sanitation',
      },
      // Temuan 3: Waspada Bahaya Sekunder: Aliran Banjir Lahar Dingin
      {
        id: 'disc-post-lahar',
        title: 'Temuan 3: Bahaya Sekunder — Waspada Banjir Lahar Dingin',
        shortDesc:
          'Bahaya letusan gunung api belum berakhir saat erupsi reda! Jutaan meter kubik material pasir, kerikil, dan bongkahan batu vulkanik yang mengendap di lereng puncak dapat tersapu hujan lebat menjadi banjir lahar dingin (lahar hujan) yang meluap menerjang bantaran sungai yang berhulu di Merapi.',
        fact:
          'BNPB mengimbau masyarakat untuk menjauhi lembah dan bantaran sungai yang berhulu di puncak gunung berapi saat musim hujan, serta mematuhi sirene Early Warning System (EWS) banjir lahar dingin!',
        iconName: 'mountain',
        illustrationType: 'volcano-post-lahar',
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
          text: 'Membersihkan timbunan abu di atap rumah agar tidak roboh, menutup sumber air minum, memakai masker, dan menjauhi bantaran sungai saat hujan lebat karena ancaman lahar dingin.',
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
        'Sempurna! Protokol pascabencana resmi BNPB meliputi pembersihan atap rumah dari beban berat abu, perlindungan sumber air minum dari belerang, penggunaan masker pelindung silika, dan kewaspadaan terhadap banjir lahar dingin di daerah aliran sungai!',
      siagaClue:
        'Pascabencana Erupsi = "Bersihkan atap gotong royong, tutup tandon air minum, pakai masker, dan jauhi sungai saat hujan (waspada lahar dingin)!"',
    },
  },
];



