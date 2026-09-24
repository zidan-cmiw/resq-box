// ── src/app/Level1/EarthDive/earthDiveData.ts ───────────────────────────────────
// Data terstruktur untuk petualangan "EARTH DIVE" (Level 1)
// Diselaraskan 100% dengan Dokumen Materi "Perjalanan Menuju Geologis Bumi" & Kurikulum IPA SMP

export interface DiscoveryPoint {
  id: string;
  title: string;
  shortDesc: string;
  fact: string;
  iconName: string;
  imageSrc: string;
  illustrationType:
  | 'crust'
  | 'convection'
  | 'deep-mantle'
  | 'geodynamo'
  | 'inner-core'
  | 'divergent'
  | 'convergent'
  | 'transform'
  | 'mantle-convection'
  | 'bridgmanite'
  | 'molten-metal'
  | 'inner-core-center'
  | 'pangea-drift'
  | 'rift-valley'
  | 'seafloor-spreading'
  | 'wegener-pangea'
  | 'twin-mountains'
  | 'divergent-anim'
  | 'convergent-subduction'
  | 'convergent-landforms'
  | 'seismograph-plates'
  | 'transform-sanandreas';
}

export interface MiniChallenge {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
  siagaClue: string;
}

export interface EarthStrata {
  id: string;
  index: number;
  name: string;
  nameEn: string;
  depthRange: string;
  startDepthKm: number;
  targetDepthKm: number;
  tempRange: string;
  tempCelsius: number;
  pressureRange: string;
  pressureGpa: number;
  composition: string;
  stateOfMatter: 'Padat Kaku' | 'Semi-Cair Plastis' | 'Padat Berdensitas Tinggi' | 'Cair Logam' | 'Padat Kristalin';
  badgeId: string;
  badgeName: string;
  badgeIcon: string;
  colorTheme: {
    bgGradient: string;
    strataColor: string;
    accentColor: string;
    glowColor: string;
  };
  discovery: DiscoveryPoint;
  challenge: MiniChallenge;
}

// ── APERSEPSI & PANDUAN PENGANTAR PENJELAJAHAN (DARI MATERI DOKUMEN) ────────────
export const GEOLOGICAL_APERTURE_INTRO = {
  title: 'Pernahkah Kamu Terpikirkan untuk Menggali Bumi?',
  question: 'Seberapa dalam kamu dapat menggalinya? Mengapa penjelajahan ke interior bumi begitu menantang?',
  reason: 'Hingga kini manusia belum mampu menciptakan alat bor yang menahan suhu ribuan derajat dan tekanan luar biasa ekstrem di kedalaman bumi.',
  scientistMethod: 'Alih-alih menggali ribuan mil, para ilmuwan menggunakan data rekaman gempa bumi (gelombang seismik), formasi batuan beku magma, dan simulasi komputer berteknologi tinggi.',
};

export const EARTH_STRATA_DATA: EarthStrata[] = [
  // ── 1. KERAK BUMI & LITOSFER (0 - 100 KM / 50 MIL) ──────────────────────
  {
    id: 'litosfer',
    index: 0,
    name: 'Kerak Bumi',
    nameEn: 'Earth Crust',
    depthRange: '0 – 100 km',
    startDepthKm: 0,
    targetDepthKm: 100,
    tempRange: '25°C – 500°C',
    tempCelsius: 450,
    pressureRange: '1 atm – 3 GPa',
    pressureGpa: 1.5,
    composition: 'Kerak Benua (daratan) & Kerak Samudra (dasar laut)',
    stateOfMatter: 'Padat Kaku',
    badgeId: 'surface-scout',
    badgeName: 'Penjelajah Kerak',
    badgeIcon: 'mountain',
    colorTheme: {
      bgGradient: 'from-[#1e3a8a] via-[#3b82f6] to-[#78350f]',
      strataColor: '#92400e',
      accentColor: '#fbbf24',
      glowColor: 'rgba(251, 191, 36, 0.4)',
    },
    discovery: {
      id: 'disc-litosfer',
      title: 'Kerak Bumi: Lapisan Paling Luar',
      shortDesc: 'Kerak bumi adalah kulit paling luar planet kita dan lapisan yang paling tipis. Terbagi menjadi dua bagian: Kerak Benua (daratan) dan Kerak Samudra (dasar laut).',
      fact: 'Kerak benua tebalnya mencapai 100 km. Sedangkan kerak samudra jauh lebih tipis (hanya 5–15 km), tapi batuannya lebih padat dan berat!',
      iconName: 'convergent',
      imageSrc: '/images/geology/crust.jpg',
      illustrationType: 'crust',
    },
    challenge: {
      id: 'chall-litosfer',
      question: 'Mengapa manusia belum pernah mengebor sampai tembus ke dalam bumi?',
      options: [
        { id: 'a', text: 'Karena di dalam bumi suhunya sangat panas dan tekanannya luar biasa tinggi.', isCorrect: true },
        { id: 'b', text: 'Karena di dalam bumi tidak ada gravitasi sama sekali.', isCorrect: false },
        { id: 'c', text: 'Karena seluruh bagian dalam bumi terbuat dari air asam.', isCorrect: false },
        { id: 'd', text: 'Karena tanah di bawah selalu runtuh.', isCorrect: false },
      ],
      explanation: 'Suhu di dalam bumi mencapai ribuan derajat Celsius dan tekanannya sangat tinggi, sehingga alat bor manusia belum mampu menembusnya.',
      siagaClue: 'Ingat dua hal utama: SUHU SANGAT PANAS dan TEKANAN SANGAT TINGGI!',
    },
  },

  // ── 2. DINAMIKA LEMPENG & ASTENOSFER (100 - 660 KM) ──────────────────────
  {
    id: 'astenosfer',
    index: 1,
    name: 'Dinamika Lempeng Tektonik (Astenosfer)',
    nameEn: 'Tectonic Plates & Asthenosphere',
    depthRange: '100 – 660 km (Zona Subduksi & Sesar)',
    startDepthKm: 100,
    targetDepthKm: 660,
    tempRange: '540°C – 1.600°C',
    tempCelsius: 1300,
    pressureRange: '3 GPa – 24 GPa',
    pressureGpa: 15,
    composition: 'Batuan Semi-Cair Plastis & Batuan Beku Magmatis Lempeng',
    stateOfMatter: 'Semi-Cair Plastis',
    badgeId: 'tectonic-tracker',
    badgeName: 'Tectonic Tracker',
    badgeIcon: 'volcano',
    colorTheme: {
      bgGradient: 'from-[#78350f] via-[#c2410c] to-[#991b1b]',
      strataColor: '#ea580c',
      accentColor: '#f97316',
      glowColor: 'rgba(234, 88, 12, 0.4)',
    },
    discovery: {
      id: 'disc-astenosfer',
      title: 'Zona Subduksi, Pangea & Palung Laut Dalam',
      shortDesc: 'Alfred Wegener membuktikan benua dulunya satu kesatuan (Pangea) yang terpecah menjadi 7 benua. Lempeng terus bergerak membentuk batas Konvergen, Divergen, dan Transform.',
      fact: 'Ketika lempeng benua dan samudra bertabrakan di batas konvergen, lempeng samudra yang lebih padat menyelinap di bawah lempeng benua (subduksi) lalu meleleh ke mantel. Fenomena ini membengkokkan dasar laut membentuk palung laut dalam, pegunungan, gunung berapi, dan gempa dahsyat!',
      iconName: 'volcano',
      imageSrc: '/images/geology/subduction.jpg',
      illustrationType: 'convection',
    },
    challenge: {
      id: 'chall-astenosfer',
      question: 'Berdasarkan teori tektonik lempeng, fenomena alam apakah yang terbentuk di sepanjang batas divergen dan batas konvergen?',
      options: [
        { id: 'a', text: 'Punggung tengah samudra terbentuk di batas divergen, sedangkan palung laut dalam terbentuk di sepanjang batas konvergen.', isCorrect: true },
        { id: 'b', text: 'Palung laut dalam terbentuk di batas divergen, sedangkan gurun pasir terbentuk di batas konvergen.', isCorrect: false },
        { id: 'c', text: 'Gunung berapi hanya terbentuk di batas transform, sedangkan batas konvergen selalu tenang.', isCorrect: false },
        { id: 'd', text: 'Kedua lempeng saling bergesekan tanpa menimbulkan gempa maupun perubahan bentuk dasar laut.', isCorrect: false },
      ],
      explanation: 'Punggung tengah samudra (mid-ocean ridges) terbentuk saat lempeng memisah (divergen), sementara palung laut dalam dan gunung api terbentuk saat lempeng bertabrakan dan menunjam (konvergen/subduksi).',
      siagaClue: 'Divergen (memisah) memunculkan kerak baru di tengah samudra; Konvergen (menunjam) melengkungkan dasar laut menjadi palung dalam!',
    },
  },

  // ── 3. MANTEL BUMI (660 - 2.900 KM / 1.800 MIL) ──────────────────────────
  {
    id: 'mantel-bawah',
    index: 2,
    name: 'Mantel Bumi',
    nameEn: 'Earth Mantle (Thickest Layer)',
    depthRange: '660 – 2.900 km (Tebal 2.900 km / 1.800 mil)',
    startDepthKm: 660,
    targetDepthKm: 2900,
    tempRange: '1.000°C – 3.700°C',
    tempCelsius: 2800,
    pressureRange: '24 GPa – 136 GPa',
    pressureGpa: 90,
    composition: 'Batuan Padat Lebih Berat & Padat dari Kerak (Mengalir Kental)',
    stateOfMatter: 'Padat Berdensitas Tinggi',
    badgeId: 'mantle-explorer',
    badgeName: 'Mantle Explorer',
    badgeIcon: 'earthquake',
    colorTheme: {
      bgGradient: 'from-[#991b1b] via-[#7f1d1d] to-[#450a0a]',
      strataColor: '#b91c1c',
      accentColor: '#ef4444',
      glowColor: 'rgba(239, 68, 68, 0.4)',
    },
    discovery: {
      id: 'disc-mantel-bawah',
      title: 'Lapisan Tertebal Bumi & Arus Konveksi Panas',
      shortDesc: 'Terletak di bawah kerak bumi dengan ketebalan mencapai 2.900 km (1.800 mil), menjadikannya lapisan tertebal bumi. Batuannya lebih padat dan lebih berat daripada kerak bumi.',
      fact: 'Meskipun padat, batuan mantel mengalir seperti cairan sangat kental dan bergerak lambat akibat arus konveksi panas! Tepi luarnya bersuhu >1.000°C dan bagian terdalamnya mencapai >3.700°C. Ilmuwan meneliti komposisinya melalui batuan beku lempeng hasil pendinginan magma.',
      iconName: 'earthquake',
      imageSrc: '/images/geology/mantle.jpg',
      illustrationType: 'deep-mantle',
    },
    challenge: {
      id: 'chall-mantel-bawah',
      question: 'Bagaimanakah karakteristik fisik batuan di lapisan Mantel Bumi dan penyebab pergerakannya?',
      options: [
        { id: 'a', text: 'Batuannya padat namun mengalir lambat seperti cairan kental akibat arus panas yang kuat (konveksi) dengan suhu 1.000°C hingga 3.700°C.', isCorrect: true },
        { id: 'b', text: 'Batuannya berupa logam cair encer seperti air dengan suhu selalu dingin di bawah 0°C.', isCorrect: false },
        { id: 'c', text: 'Merupakan lapisan tertipis yang diam membeku tanpa perpindahan energi panas apapun.', isCorrect: false },
        { id: 'd', text: 'Batuannya berupa pasir kering yang bergerak karena ditiup angin bawah tanah.', isCorrect: false },
      ],
      explanation: 'Mantel adalah lapisan tertebal (2.900 km / 1.800 mil). Batuan padatnya mengalir kental karena arus konveksi panas dari interior bumi, bersuhu 1.000°C di tepi luar hingga >3.700°C di bagian dalam.',
      siagaClue: 'Ingat istilah "arus konveksi panas", sifat "cairan sangat kental bergerak lambat", dan suhu 1.000°C - 3.700°C!',
    },
  },

  // ── 4. INTI LUAR (2.900 - 5.150 KM / 1.400 MIL) ──────────────────────────
  {
    id: 'inti-luar',
    index: 3,
    name: 'Inti Luar (Logam Cair Meleleh)',
    nameEn: 'Liquid Outer Core',
    depthRange: '2.900 – 5.150 km (Tebal 2.200–2.300 km / 1.400 mil)',
    startDepthKm: 2900,
    targetDepthKm: 5150,
    tempRange: '4.000°C – 5.000°C',
    tempCelsius: 4500,
    pressureRange: '136 GPa – 330 GPa',
    pressureGpa: 240,
    composition: 'Logam Besi (Fe) & Nikel (Ni) Cair Meleleh',
    stateOfMatter: 'Cair Logam',
    badgeId: 'magneto-guardian',
    badgeName: 'Magnetic Shield',
    badgeIcon: 'shield',
    colorTheme: {
      bgGradient: 'from-[#450a0a] via-[#ea580c] to-[#ca8a04]',
      strataColor: '#d97706',
      accentColor: '#f59e0b',
      glowColor: 'rgba(245, 158, 11, 0.4)',
    },
    discovery: {
      id: 'disc-inti-luar',
      title: 'Lautan Logam Meleleh pada Suhu 5.000°C',
      shortDesc: 'Lapisan dengan ketebalan 2.200 hingga 2.300 km (1.400 mil) yang sebagian besar terbuat dari logam besi dan nikel dengan suhu mencapai 5.000 derajat Celsius.',
      fact: 'Suhu 5.000°C di inti luar jauh melampaui titik leleh logam besi dan nikel! Akibatnya, inti luar bukanlah batuan padat seperti kerak atau mantel, melainkan logam cair meleleh yang terus berputar membentuk medan magnet bumi.',
      iconName: 'shield',
      imageSrc: '/images/geology/outer_core.jpg',
      illustrationType: 'molten-metal',
    },
    challenge: {
      id: 'chall-inti-luar',
      question: 'Mengapa wujud materi pada lapisan Inti Luar berupa logam cair meleleh, bukan batuan padat seperti kerak dan mantel?',
      options: [
        { id: 'a', text: 'Karena suhu panas mencapai 5.000°C jauh melampaui titik leleh logam besi dan nikel yang menyusunnya.', isCorrect: true },
        { id: 'b', text: 'Karena inti luar kemasukan air samudra melalui celah palung laut dalam.', isCorrect: false },
        { id: 'c', text: 'Karena tekanan di inti luar nol sehingga logam menguap menjadi air.', isCorrect: false },
        { id: 'd', text: 'Karena tersusun dari minyak bumi dan gas alam cair.', isCorrect: false },
      ],
      explanation: 'Di kedalaman 2.900 km, suhu 5.000°C telah melampaui titik lebur paduan besi dan nikel, sehingga material di sini berubah wujud seutuhnya menjadi logam cair meleleh!',
      siagaClue: 'Perhatikan hubungan suhu 5.000°C dengan "titik leleh logam besi dan nikel"!',
    },
  },

  // ── 5. INTI DALAM (5.150 - 6.371 KM / 750 MIL) ──────────────────────────
  {
    id: 'inti-dalam',
    index: 4,
    name: 'Inti Dalam (Bola Besi Padat)',
    nameEn: 'Solid Inner Core',
    depthRange: '5.150 – 6.371 km (Diameter 1.200–1.250 km / 750 mil)',
    startDepthKm: 5150,
    targetDepthKm: 6371,
    tempRange: '5.500°C – 6.000°C (Sepanas Matahari)',
    tempCelsius: 5800,
    pressureRange: '330 GPa – 360 GPa (>3,6 Juta Atm)',
    pressureGpa: 360,
    composition: 'Bola Besi Padat Berdiameter 1.200 - 1.250 km (750 mil)',
    stateOfMatter: 'Padat Kristalin',
    badgeId: 'core-specialist',
    badgeName: 'Core Specialist',
    badgeIcon: 'trophy',
    colorTheme: {
      bgGradient: 'from-[#78350f] via-[#d97706] to-[#fef08a]',
      strataColor: '#fef08a',
      accentColor: '#ffffff',
      glowColor: 'rgba(254, 240, 138, 0.6)',
    },
    discovery: {
      id: 'disc-inti-dalam',
      title: 'Bola Besi Padat Sepanas Permukaan Matahari',
      shortDesc: 'Lapisan berbentuk bola besi padat berdiameter 1.200-1.250 km (750 mil). Suhunya mencapai 6.000 derajat Celsius menjadikannya sepanas permukaan matahari!',
      fact: 'Meskipun lebih panas daripada inti luar yang meleleh, inti dalam BUKANLAH cairan melainkan benar-benar padat. Apa yang mencegah logam meleleh? Hal ini disebabkan oleh tekanan luar biasa yang dialaminya!',
      iconName: 'trophy',
      imageSrc: '/images/geology/inner_core.jpg',
      illustrationType: 'inner-core',
    },
    challenge: {
      id: 'chall-inti-dalam',
      question: 'Meskipun suhu Inti Dalam mencapai 6.000°C (sepanas permukaan matahari), mengapa inti dalam tetap berwujud padat dan tidak meleleh?',
      options: [
        { id: 'a', text: 'Karena tekanan luar biasa dahsyat yang dialaminya mencegah atom logam meleleh.', isCorrect: true },
        { id: 'b', text: 'Karena suhu 6.000°C masih belum cukup panas untuk mencairkan besi.', isCorrect: false },
        { id: 'c', text: 'Karena diselimuti oleh lapisan es abadi di pusat gravitasi.', isCorrect: false },
        { id: 'd', text: 'Karena terbuat dari batu intan berlian yang tidak terpengaruh panas.', isCorrect: false },
      ],
      explanation: 'Di pusat bumi, beban gravitasi seluruh massa planet menekan dengan kekuatan luar biasa (>3,6 juta atmosfer), sehingga atom besi terkunci rapat dalam wujud padat meski sepanas permukaan matahari!',
      siagaClue: 'Jawaban persis di teks: "Hal ini disebabkan oleh TEKANAN LUAR BIASA yang dialaminya"!',
    },
  },

  // ── 6. BATAS DIVERGEN & LEMBAH RETAKAN (EAST AFRICAN RIFT & PANGEA) ─────
  {
    id: 'divergen',
    index: 5,
    name: 'Batas Divergen',
    nameEn: 'Divergent Boundary & Rift Valley',
    depthRange: 'Kerak Litosfer & Celah Astenosfer (0–35 km)',
    startDepthKm: 0,
    targetDepthKm: 35,
    tempRange: '800°C – 1.200°C (Magma Celah)',
    tempCelsius: 1100,
    pressureRange: '1 GPa – 5 GPa',
    pressureGpa: 3,
    composition: 'Batuan Basal Baru, Patahan Sesar Normal, dan Intrusi Magma',
    stateOfMatter: 'Padat Kaku',
    badgeId: 'rift-divergent',
    badgeName: 'Penjelajah Patahan Retakan',
    badgeIcon: 'mountain',
    colorTheme: {
      bgGradient: 'from-[#18181b] via-[#7c2d12] to-[#ea580c]',
      strataColor: '#7c2d12',
      accentColor: '#f97316',
      glowColor: 'rgba(234, 88, 12, 0.5)',
    },
    discovery: {
      id: 'disc-pangea',
      title: 'Pangea & Pemekaran Lempeng Divergen',
      shortDesc: 'Batas divergen adalah zona tempat dua lempeng tektonik bergerak saling MENJAUH satu sama lain.',
      fact: 'Gaya tarikan membelah benua purba Pangea dan membentuk kerak dasar samudra baru melalui naiknya magma panas.',
      iconName: 'mountain',
      imageSrc: '/images/geology/divergent.jpg',
      illustrationType: 'pangea-drift',
    },
    challenge: {
      id: 'chall-divergen',
      question: 'Bagaimanakah arah pergerakan lempeng pada batas divergen?',
      options: [
        { id: 'a', text: 'Dua lempeng bergerak saling menjauh satu sama lain.', isCorrect: true },
        { id: 'b', text: 'Dua lempeng bertabrakan dan salah satunya menunjam.', isCorrect: false },
        { id: 'c', text: 'Dua lempeng berpapasan mendatar saling bergesekan.', isCorrect: false },
        { id: 'd', text: 'Dua lempeng diam dan membeku tanpa pergerakan.', isCorrect: false },
      ],
      explanation: 'Batas divergen dicirikan oleh lempeng tektonik yang bergerak saling menjauh, membuka rekahan bagi magma untuk naik.',
      siagaClue: 'Ingat arti divergen: lempeng bergerak SALING MENJAUH!',
    },
  },

  {
    id: 'konvergen',
    index: 6,
    name: 'Batas Konvergen',
    nameEn: 'Convergent Boundary & Subduction Zone',
    depthRange: '0–100 km (Zona Subduksi & Palung Abisal)',
    startDepthKm: 0,
    targetDepthKm: 100,
    tempRange: '1.000°C – 1.400°C',
    tempCelsius: 1250,
    pressureRange: '2 GPa – 10 GPa',
    pressureGpa: 6,
    composition: 'Batuan Andesit, Basal Samudra Menunjam, Granit Benua & Magma Silika',
    stateOfMatter: 'Padat Kaku',
    badgeId: 'subduction-master',
    badgeName: 'Pakar Subduksi & Palung',
    badgeIcon: 'volcano',
    colorTheme: {
      bgGradient: 'from-[#0369a1] via-[#1e293b] to-[#dc2626]',
      strataColor: '#1e293b',
      accentColor: '#ef4444',
      glowColor: 'rgba(239, 68, 68, 0.5)',
    },
    discovery: {
      id: 'disc-conv-subduction',
      title: 'Temuan 1: Dinamika Subduksi & Peleburan Lempeng',
      shortDesc: 'Dua lempeng saling menumbuk! Lempeng samudra yang padat dan berat menunjam ke bawah lempeng benua (subduksi) dan melebur kembali di mantel bumi.',
      fact: 'Batuan lempeng yang melebur di mantel membentuk magma baru yang lebih ringan, naik ke atas melahirkan dapur magma dan deretan gunung berapi aktif!',
      iconName: 'convergent',
      imageSrc: '/images/geology/convergent.jpg',
      illustrationType: 'convergent-subduction',
    },
    challenge: {
      id: 'chall-konvergen',
      question: 'Apa yang terjadi ketika lempeng samudra yang padat bertabrakan dengan lempeng benua yang lebih ringan di batas konvergen?',
      options: [
        { id: 'a', text: 'Lempeng samudra menunjam (subduksi) ke bawah lempeng benua dan melebur di mantel membentuk palung laut serta gunung berapi.', isCorrect: true },
        { id: 'b', text: 'Kedua lempeng bergerak saling menjauh meninggalkan jurang pemisah tanpa ada tumbukan.', isCorrect: false },
        { id: 'c', text: 'Kedua lempeng berpapasan mendatar tanpa ada yang menunjam atau melebur.', isCorrect: false },
        { id: 'd', text: 'Lempeng benua tenggelam ke samudra dan membekukan seluruh magma bumi.', isCorrect: false },
      ],
      explanation: 'Pada batas konvergen, lempeng samudra yang lebih padat menyelinap menunjam (subduksi) ke bawah lempeng benua dan meleleh di astenosfer, melahirkan palung laut dalam dan gunung berapi aktif!',
      siagaClue: 'Perhatikan kata kunci "menunjam (subduksi)", "melebur di mantel", dan "palung laut"!',
    },
  },

  // ── 8. BATAS TRANSFORM & SESAR SAN ANDREAS (PUNCAK LEVEL 1) ─────────────
  {
    id: 'transform',
    index: 7,
    name: 'Batas Transform',
    nameEn: 'Transform Boundary & Strike-Slip Fault',
    depthRange: 'Kerak Bumi & Sesar Dangkal (0–20 km)',
    startDepthKm: 0,
    targetDepthKm: 20,
    tempRange: 'Suhu Permukaan Gurun – 350°C (Zona Gesekan)',
    tempCelsius: 350,
    pressureRange: '1 atm – 2 GPa',
    pressureGpa: 1,
    composition: 'Batuan Sedimen Gurun, Granit Tergerus (Gouge), dan Breksia Sesar',
    stateOfMatter: 'Padat Kaku',
    badgeId: 'transform-master',
    badgeName: 'Pakar Sesar Transform',
    badgeIcon: 'compass',
    colorTheme: {
      bgGradient: 'from-[#78350f] via-[#b45309] to-[#d97706]',
      strataColor: '#78350f',
      accentColor: '#f59e0b',
      glowColor: 'rgba(245, 158, 11, 0.5)',
    },
    discovery: {
      id: 'disc-seismograph-plates',
      title: 'Temuan 1: Sismograf & Bukti 20 Lempeng Bumi',
      shortDesc: 'Sismograf bekerja mengubah getaran fisik tanah menjadi sinyal listrik yang tercatat rapi pada kertas seismogram.',
      fact: 'Rekaman gempa global membuktikan kulit luar bumi terpecah menjadi sekitar 20 lempeng yang terus bergerak di atas arus konveksi mantel!',
      iconName: 'broadcast',
      imageSrc: '/images/geology/transform.jpg',
      illustrationType: 'seismograph-plates',
    },
    challenge: {
      id: 'chall-transform',
      question: 'Bagaimanakah mekanisme pergerakan lempeng pada batas TRANSFORM dan apa yang terjadi pada permukaan tanah di sekitarnya?',
      options: [
        { id: 'a', text: 'Dua lempeng bergesekan horizontal saling berlawanan arah tanpa pembentukan atau peleburan kerak bumi, memicu gempa dangkal.', isCorrect: true },
        { id: 'b', text: 'Kedua lempeng saling menjauh dan memuntahkan lava dari dasar jurang laut dalam.', isCorrect: false },
        { id: 'c', text: 'Lempeng samudra menunjam miring ke bawah mantel bumi dan membentuk palung laut.', isCorrect: false },
        { id: 'd', text: 'Kedua lempeng saling berhenti bergerak selamanya sehingga tidak ada getaran sama sekali.', isCorrect: false },
      ],
      explanation: 'Pada batas transform, dua lempeng bergesekan mendatar (strike-slip) saling berlawanan arah. Tidak ada kerak baru yang terbentuk ataupun melebur, namun gesekan yang terkunci dapat melepaskan energi gempa bumi dangkal!',
      siagaClue: 'Ingat kata kunci: "bergesekan horizontal mendatar saling berlawanan arah"!',
    },
  },
];

// ── CORE SYNTHESIS QUESTION (PUNCAK LEVEL 1 & PINTU MASUK LEVEL 2) ───────────
export interface CoreSynthesisQuestion {
  title: string;
  context: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
}

export const CORE_SYNTHESIS_DATA: CoreSynthesisQuestion = {
  title: 'Puncak Ekspedisi: Kausalitas Dinamika Bumi & Bencana Geologis',
  context:
    'Kamu telah menembus 6.371 km dari permukaan bumi hingga inti terdalam! Panas luar biasa (6.000°C) di inti memanaskan mantel bumi, memicu arus konveksi raksasa yang menggerakkan 20 lempeng tektonik di litosfer.',
  question:
    'Bagaimanakah pergerakan lempeng tektonik yang dipicu oleh arus konveksi panas mantel bumi ini dapat menyebabkan terjadinya bencana geologis (seperti gempa bumi dan letusan Gunung Merapi)?',
  options: [
    {
      id: 'opt-1',
      text: 'Tabrakan lempeng di batas konvergen memicu subduksi di mana lempeng meleleh kembali ke mantel, melepaskan getaran seismik (gempa) dan mendorong magma naik membentuk gunung berapi aktif.',
      isCorrect: true,
    },
    {
      id: 'opt-2',
      text: 'Inti dalam bumi menyedot air laut ke dalam tanah sehingga memicu gelombang badai dan banjir bandang di permukaan.',
      isCorrect: false,
    },
    {
      id: 'opt-3',
      text: 'Medan magnet bumi yang bocor membakar hutan di lereng gunung sehingga memicu kebakaran gambut.',
      isCorrect: false,
    },
    {
      id: 'opt-4',
      text: 'Batu mantel bumi yang padat mematikan semua getaran seismik sehingga gunung berapi tidak akan pernah meletus lagi.',
      isCorrect: false,
    },
  ],
  explanation:
    'Sains geologis membuktikan: Panas interior bumi adalah mesin penggerak alam! Arus konveksi mantel menggeser lempeng. Di zona konvergen (seperti pertemuan lempeng Indo-Australia dan Eurasia di bawah pulau Jawa), lempeng menunjam dan meleleh, memicu gempa bumi dahsyat serta menyuplai kantung magma letusan Gunung Merapi!',
};

// ── SOAL WORDLE GABUNGAN SELURUH AREA (PUNCAK EKSPEDISI SINTESIS BUMI) ─────────
export const CORE_SYNTHESIS_WORDS: { word: string; hint: string }[] = [
  {
    word: 'LEMPENG',
    hint: '[KERAK BUMI] Pecahan kulit luar bumi yang bergerak mengapung perlahan di atas mantel.',
  },
  {
    word: 'KONVEKSI',
    hint: '[MANTEL BUMI] Arus perputaran panas di dalam mantel yang menggerakkan lempeng bumi.',
  },
  {
    word: 'MAGNET',
    hint: '[INTI LUAR] Perisai pelindung bumi yang dihasilkan dari perputaran cairan logam di inti luar.',
  },
  {
    word: 'TEKANAN',
    hint: '[INTI DALAM] Kekuatan dahsyat di pusat bumi yang menjaga bola besi inti dalam tetap padat.',
  },
  {
    word: 'GEMPA',
    hint: '[BENCANA ALAM] Getaran di permukaan bumi akibat pertemuan dan pergesekan lempeng tektonik.',
  },
];


export const ALL_DISCOVERY_CATALOG: Record<number, { discovery: DiscoveryPoint; strata: EarthStrata }> = {

  0: {
    discovery: {
      id: 'disc-crust-compare',
      title: 'Perbedaan Kerak Benua & Samudra',
      shortDesc:
        'Kerak bumi terbagi menjadi dua: Kerak Benua di bawah daratan dan Kerak Samudra di bawah lautan. Keduanya punya ketebalan dan jenis batuan yang berbeda.',
      fact:
        'Kerak benua tebalnya sampai 100 km dan terbuat dari granit. Kerak samudra tipis (5–15 km), tapi terbuat dari basal yang lebih padat dan berat!',
      iconName: 'mountain',
      imageSrc: '/images/geology/crust.jpg',
      illustrationType: 'crust',
    },
    strata: EARTH_STRATA_DATA[0],
  },

  // 1: Zona Kerak Bumi — Batas Divergen (Constructive margins -> Midocean ridges)
  1: {
    discovery: {
      id: 'disc-divergen',
      title: 'Batas Divergen',
      shortDesc:
        'Batas divergen adalah tempat di mana dua lempeng tektonik bergerak saling menjauh. Saat kedua batas itu memisah, sering terjadi fenomena gempa dan menciptakan area di mana batuan cair (magma) dari astenosfer mantel bumi naik ke atas membentuk pemekaran dasar samudra dan punggung tengah samudra (Mid-Ocean Ridges).',
      fact:
        'Punggung tengah samudra (mid-ocean ridges) terbentuk di sepanjang batas divergen! Magma yang menyusup ke rekahan celah mendingin membentuk kerak samudra baru yang padat dan memperluas dasar lautan.',
      iconName: 'mountain',
      imageSrc: '/images/geology/divergent.jpg',
      illustrationType: 'divergent',
    },
    strata: EARTH_STRATA_DATA[0],
  },

  // 2: Zona Kerak Bumi — Batas Konvergen (Destructive margins -> Subduction zones)
  2: {
    discovery: {
      id: 'disc-konvergen',
      title: 'Batas Konvergen',
      shortDesc:
        'Batas konvergen (penyebab peleburan lempeng tektonik) adalah tempat di mana dua lempeng bertabrakan. Lempeng samudra yang lebih padat dan berat akan terdorong menyelinap di bawah lempeng benua (subduksi). Proses ini membengkokkan dasar laut membentuk palung laut dalam dan meleburkan lempeng kembali ke mantel bumi.',
      fact:
        'Subduksi di batas konvergen memicu peleburan lempeng ke mantel, menciptakan pegunungan besar, deretan gunung berapi aktif (seperti Gunung Merapi di Indonesia), gempa bumi dahsyat, serta palung laut dalam!',
      iconName: 'volcano',
      imageSrc: '/images/geology/convergent.jpg',
      illustrationType: 'convergent',
    },
    strata: EARTH_STRATA_DATA[0],
  },

  3: {
    discovery: {
      id: 'disc-transform',
      title: 'Batas Transform',
      shortDesc:
        'Batas transform adalah tempat di mana kedua lempeng saling bergeser secara horizontal (berpapasan mendatar). Kedua lempeng saling bergesekan tanpa ada pembentukan kerak baru ataupun peleburan lempeng, menyebabkan terbentuknya zona rekahan patahan (sesar geser tektonik).',
      fact:
        'Gesekan intens di batas transform menyebabkan adanya zona patahan aktif seperti Patahan San Andreas yang bergeser sekitar 2 inci (5 cm) setiap tahun, sering memicu gempa bumi tektonik dangkal yang sangat kuat!',
      iconName: 'earthquake',
      imageSrc: '/images/geology/transform.jpg',
      illustrationType: 'transform',
    },
    strata: EARTH_STRATA_DATA[0],
  },

  // 4: Zona Mantel Bumi — Titik 1: Arus Panas Mantel (Konveksi)
  4: {
    discovery: {
      id: 'disc-mantel-bawah',
      title: 'Arus Panas Mantel Bumi (Konveksi)',
      shortDesc:
        'Mantel bumi terletak di bawah kerak bumi dengan ketebalan 2.900 km, dan merupakan lapisan paling tebal. Suhunya sangat tinggi sehingga batuan mengalir pelan seperti cairan kental.',
      fact:
        'Arus panas yang berputar di dalam mantel disebut arus konveksi, bekerja seperti air mendidih di panci. Arus inilah yang menjadi mesin penggerak lempeng bumi di permukaan!',
      iconName: 'volcano',
      imageSrc: '/images/geology/mantle.jpg',
      illustrationType: 'mantle-convection',
    },
    strata: EARTH_STRATA_DATA[1] || EARTH_STRATA_DATA[0],
  },

  // 5: Zona Mantel Bumi — Titik 2: Batuan Mantel & Tekanan Dahsyat
  5: {
    discovery: {
      id: 'disc-bridgmanite',
      title: 'Batuan Mantel & Tekanan Dahsyat',
      shortDesc:
        'Walaupun suhu di mantel bumi sangat panas, batuannya tetap padat dan tidak mencair encer. Hal ini terjadi karena adanya tekanan dahsyat yang menekan batuan dari segala arah.',
      fact:
        'Tekanan besar di mantel mengunci butiran batuan agar tetap padat dan kokoh. Batuan ini sangat kuat menopang seluruh lapisan kerak bumi di atasnya!',
      iconName: 'mountain',
      imageSrc: '/images/geology/mantle.jpg',
      illustrationType: 'bridgmanite',
    },
    strata: EARTH_STRATA_DATA[1] || EARTH_STRATA_DATA[0],
  },

  // 6: Zona Inti Luar — Logam Cair Meleleh (Suhu 5.000°C)
  6: {
    discovery: {
      id: 'disc-inti-luar',
      title: 'Inti Luar: Lautan Logam Cair',
      shortDesc:
        'Inti luar bumi memiliki ketebalan sekitar 2.200 kilometer dan sebagian besar tersusun dari logam besi serta nikel.',
      fact:
        'Suhu di inti luar sangat panas mencapai 5.000°C! Panas dahsyat ini membuat seluruh logam meleleh menjadi lautan cairan yang terus bergerak.',
      iconName: 'shield',
      imageSrc: '/images/geology/outer_core.jpg',
      illustrationType: 'molten-metal',
    },
    strata: EARTH_STRATA_DATA[3] || EARTH_STRATA_DATA[0],
  },

  // 7: Zona Inti Luar — Geodynamo & Medan Magnet Bumi
  7: {
    discovery: {
      id: 'disc-geodynamo',
      title: 'Medan Magnet Pelindung Bumi',
      shortDesc:
        'Perputaran lautan logam cair di inti luar bekerja bagai dinamo listrik raksasa yang menciptakan medan magnet pelindung bumi.',
      fact:
        'Medan magnet ini menjadi perisai utama bumi! Perisai ini membelokkan radiasi berbahaya dari badai matahari sehingga kehidupan di bumi tetap terlindungi dengan aman.',
      iconName: 'shield',
      imageSrc: '/images/geology/outer_core.jpg',
      illustrationType: 'geodynamo',
    },
    strata: EARTH_STRATA_DATA[3] || EARTH_STRATA_DATA[0],
  },

  // 8: Zona Inti Dalam — Bola Besi Padat Sepanas Matahari
  8: {
    discovery: {
      id: 'disc-inti-dalam',
      title: 'Inti Dalam: Bola Besi Padat',
      shortDesc:
        'Inti dalam bumi berbentuk bola besi padat dengan suhu luar biasa panas mencapai 6.000°C (sepanas permukaan matahari).',
      fact:
        'Meskipun sangat panas, inti dalam tetap berwujud PADAT! Tekanan luar biasa dahsyat dari seluruh bumi mengunci atom besi begitu rapat sehingga tidak bisa meleleh.',
      iconName: 'trophy',
      imageSrc: '/images/geology/inner_core.jpg',
      illustrationType: 'inner-core',
    },
    strata: EARTH_STRATA_DATA[4] || EARTH_STRATA_DATA[0],
  },

  // 9: Zona Inti Dalam Altar Pusat Gravitasi 6.371 KM
  9: {
    discovery: {
      id: 'disc-inti-dalam-center',
      title: 'Pusat Bumi 6.371 KM & Gravitasi Nol',
      shortDesc:
        'Selamat datang di titik terdalam bumi pada kedalaman 6.371 kilometer! Ini adalah titik pusat planet tempat kita berpijak.',
      fact:
        'Di titik pusat bumi ini, tarikan gravitasi saling meniadakan secara seimbang dari segala arah sehingga gaya gravitasi bernilai nol!',
      iconName: 'trophy',
      imageSrc: '/images/geology/inner_core.jpg',
      illustrationType: 'inner-core-center',
    },
    strata: EARTH_STRATA_DATA[4] || EARTH_STRATA_DATA[0],
  },

  // 10: Zona Batas Divergen — Prof. Maya: Alfred Wegener & Teori Pangea (Persis Level 2)
  10: {
    discovery: {
      id: 'disc-wegener-pangea',
      title: 'Temuan 1: Alfred Wegener & Teori Pangea',
      shortDesc:
        'Dahulu kala, seluruh benua menyatu menjadi satu daratan raksasa bernama PANGEA. Oleh Alfred Wegener (1912), benua ini terbukti pecah dan perlahan hanyut terpisah.',
      fact:
        'Bumi terbagi menjadi lempeng-lempeng tektonik yang terus bergerak di atas mantel bumi seperti rakit raksasa!',
      iconName: 'globe',
      imageSrc: '/images/geology/divergent.jpg',
      illustrationType: 'wegener-pangea',
    },
    strata: EARTH_STRATA_DATA[5] || EARTH_STRATA_DATA[0],
  },

  // 11: Zona Batas Divergen — Dr. Citra: Bukti Rantai Pegunungan Kembar (Persis Level 2)
  11: {
    discovery: {
      id: 'disc-twin-mountains',
      title: 'Temuan 2: Bukti Rantai Pegunungan Kembar',
      shortDesc:
        'Pegunungan Appalachian di Amerika dan Pegunungan Caledonian di Eropa memiliki jenis dan usia batuan yang sama persis.',
      fact:
        'Jika kedua benua disatukan kembali, dua pegunungan ini bersambung rapi menjadi satu rantai utuh tanpa terputus!',
      iconName: 'mountain',
      imageSrc: '/images/geology/divergent.jpg',
      illustrationType: 'twin-mountains',
    },
    strata: EARTH_STRATA_DATA[5] || EARTH_STRATA_DATA[0],
  },

  // 12: Zona Batas Divergen — Prof. Ilham: Dinamika Pemekaran Batas Divergen (Persis Level 2)
  12: {
    discovery: {
      id: 'disc-divergent-anim',
      title: 'Temuan 3: Dinamika Pemekaran Batas Divergen',
      shortDesc:
        'Di batas divergen, dua lempeng bergerak saling menjauh. Magma panas dari mantel naik mengisi celah dan membeku menjadi kerak baru.',
      fact:
        'Pemekaran ini membentuk Pematang Tengah Samudra (Mid-Ocean Ridge) dan terus memperluas dasar laut.',
      iconName: 'zap',
      imageSrc: '/images/geology/divergent.jpg',
      illustrationType: 'divergent-anim',
    },
    strata: EARTH_STRATA_DATA[5] || EARTH_STRATA_DATA[0],
  },

  // 13: Zona Batas Konvergen — Dr. Farhan: Dinamika Subduksi & Peleburan Lempeng (Persis Level 2)
  13: {
    discovery: {
      id: 'disc-convergent-subduction',
      title: 'Temuan 1: Dinamika Subduksi & Peleburan Lempeng',
      shortDesc:
        'Dua lempeng saling bertabrakan! Lempeng samudra yang lebih padat dan berat menunjam ke bawah lempeng benua (subduksi) lalu melebur kembali di mantel bumi.',
      fact:
        'Magma hasil peleburan ini memiliki massa jenis lebih ringan sehingga bergerak naik, membentuk kantung dapur magma dan jalur busur gunung api aktif!',
      iconName: 'convergent',
      imageSrc: '/images/geology/convergent.jpg',
      illustrationType: 'convergent-subduction',
    },
    strata: EARTH_STRATA_DATA[6] || EARTH_STRATA_DATA[0],
  },

  // 14: Zona Batas Konvergen — Prof. Ratna: Tiga Bentang Alam Hasil Tumbukan Lempeng (Persis Level 2)
  14: {
    discovery: {
      id: 'disc-convergent-landforms',
      title: 'Temuan 2: Tiga Bentang Alam Hasil Tumbukan Lempeng',
      shortDesc:
        'Tumbukan lempeng konvergen menghasilkan 3 bentang alam utama di bumi: (1) Palung Laut Dalam, (2) Pegunungan Lipatan, dan (3) Busur Gunung Berapi aktif.',
      fact:
        'Kepulauan Indonesia terbentuk dari jalur subduksi lempeng aktif, melahirkan Palung Jawa di dasar samudra serta deretan gunung berapi aktif seperti Gunung Merapi.',
      iconName: 'volcano',
      imageSrc: '/images/geology/convergent.jpg',
      illustrationType: 'convergent-landforms',
    },
    strata: EARTH_STRATA_DATA[6] || EARTH_STRATA_DATA[0],
  },

  // 15: Zona Batas Transform — Prof. Sarah: Sismograf & Bukti 20 Lempeng Bumi (Persis Level 2)
  15: {
    discovery: {
      id: 'disc-seismograph-plates',
      title: 'Temuan 1: Sismograf & Bukti 20 Lempeng Bumi',
      shortDesc:
        'Sismograf bekerja mengubah getaran fisik tanah menjadi sinyal listrik yang tercatat rapi pada kertas seismogram.',
      fact:
        'Rekaman gempa global membuktikan kulit luar bumi terpecah menjadi sekitar 20 lempeng yang terus bergerak di atas arus konveksi mantel!',
      iconName: 'broadcast',
      imageSrc: '/images/geology/transform.jpg',
      illustrationType: 'seismograph-plates',
    },
    strata: EARTH_STRATA_DATA[7] || EARTH_STRATA_DATA[0],
  },

  // 16: Zona Batas Transform — Dr. Taufik: Batas Transform & Patahan San Andreas (Persis Level 2)
  16: {
    discovery: {
      id: 'disc-transform-sanandreas',
      title: 'Temuan 2: Batas Transform & Sesar San Andreas',
      shortDesc:
        'Dua lempeng bergesekan mendatar (horizontal) saling berlawanan arah tanpa membuat kerak baru ataupun meleburkan batuan.',
      fact:
        'Sesar San Andreas di Kalifornia bergeser sekitar 2 inci (5 cm) per tahun, memicu gempa dangkal saat energi gesekan batuan terlepas!',
      iconName: 'compass',
      imageSrc: '/images/geology/transform.jpg',
      illustrationType: 'transform-sanandreas',
    },
    strata: EARTH_STRATA_DATA[7] || EARTH_STRATA_DATA[0],
  },
};

export function getDiscoveryItem(discoveryId: number | string): { discovery: DiscoveryPoint; strata: EarthStrata } {
  const numId = typeof discoveryId === 'number' ? discoveryId : parseInt(String(discoveryId), 10);
  if (!isNaN(numId) && ALL_DISCOVERY_CATALOG[numId]) {
    return ALL_DISCOVERY_CATALOG[numId];
  }
  const idx = !isNaN(numId) ? numId : 0;
  const strata = EARTH_STRATA_DATA[Math.min(idx, EARTH_STRATA_DATA.length - 1)];
  return {
    discovery: strata.discovery,
    strata,
  };
}


