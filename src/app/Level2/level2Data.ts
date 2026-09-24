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
          'Kesiapsiagaan dimulai sebelum gempa terjadi: mengenali denah rumah/sekolah, menata perabot berat agar tidak roboh, serta menyiapkan Tas Siaga Bencana untuk bertahan hidup minimal 72 jam pertama.',
        fact:
          'Tas Siaga Bencana wajib diletakkan di tempat strategis yang mudah dijangkau saat evakuasi darurat, berisi air, makanan tahan lama, P3K, senter, peluit, dan dokumen penting!',
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
    name: 'Lapangan Evakuasi Sekolah',
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
];


