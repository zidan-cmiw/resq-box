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
      shortDesc:
        'Kerak bumi adalah lapisan paling luar tempat tinggal kita, dengan kedalaman 0–100 km dan suhu 25°C–500°C. Terdiri dari Kerak Benua setebal 30–100 km dari batuan granit ringan (SiAl), serta Kerak Samudra setebal 5–15 km dari batuan basal yang lebih padat dan berat (SiMa).',
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
      shortDesc:
        'Astenosfer terletak tepat di bawah kerak bumi pada kedalaman 100–660 km, dengan ketebalan sekitar 560 km dan suhu 540°C–1.600°C. Karakteristiknya berupa batuan semi-cair yang bersifat plastis (dapat mengalir lambat), menjadi lapisan tempat mengapung dan bergeraknya lempeng tektonik bumi.',
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
      shortDesc:
        'Mantel bumi terletak di bawah kerak hingga batas inti pada kedalaman 660–2.900 km, dengan ketebalan 2.900 km menjadikannya lapisan tertebal di bumi. Bersuhu 1.000°C–3.700°C, karakteristiknya tersusun dari batuan padat panas yang mengalir lambat akibat arus konveksi, menjadi mesin penggerak lempeng bumi.',
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
      shortDesc:
        'Inti luar terletak di bawah mantel pada kedalaman 2.900–5.150 km, dengan ketebalan sekitar 2.250 km dan suhu 4.000°C–5.000°C. Karakteristiknya berwujud cairan logam besi dan nikel yang meleleh karena panas ekstrem. Perputaran aliran logam cair ini menghasilkan medan magnet yang melindungi bumi dari radiasi matahari.',
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
    tempRange: '5.500°C – 6.000°C',
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
      shortDesc:
        'Inti dalam terletak di pusat bumi pada kedalaman 5.150–6.371 km, berupa bola padat berdiameter sekitar 1.220 km dengan suhu 5.500°C–6.000°C. Karakteristiknya tersusun dari kristal logam besi dan nikel yang tetap berwujud padat karena tekanan gravitasi dahsyat di pusat bumi mencegahnya meleleh.',
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
      id: 'disc-transform-sanandreas',
      title: 'Batas Transform',
      shortDesc:
        'Batas lempeng sesar atau transform adalah batas lempeng yang menyebabkan terjadinya gerakan lempeng kulit bumi yang sejajar. Hal ini terjadi apabila lempengan bumi bergesek dalam posisi yang sama datar, sejajar, dan selalu bergerak.',
      fact:
        'Sesar San Andreas di Kalifornia bergeser sekitar 2 inci (5 cm) per tahun, memicu gempa dangkal saat energi gesekan batuan terlepas!',
      iconName: 'compass',
      imageSrc: '/images/geology/transform.jpg',
      illustrationType: 'transform-sanandreas',
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
        'Kerak bumi adalah lapisan paling luar tempat tinggal kita, dengan kedalaman 0–100 km dan suhu 25°C–500°C. Lapisan padat ini terdiri dari Kerak Benua setebal 30–100 km dari batuan granit ringan (SiAl), serta Kerak Samudra setebal 5–15 km dari batuan basal yang lebih padat dan berat (SiMa).',
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
        'Batas divergen adalah zona pertemuan dua lempeng tektonik yang bergerak saling menjauh. Celah pemisahan ini memicu gempa dangkal dan memungkinkan magma panas dari astenosfer naik ke atas, mendingin menjadi batuan basal baru serta membentuk punggung tengah samudra.',
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
        'Batas konvergen adalah zona tabrakan antara dua lempeng tektonik. Lempeng samudra yang lebih padat dan berat akan menunjam ke bawah lempeng benua (subduksi) lalu melebur di mantel bumi, membentuk palung laut dalam, jalur pegunungan lipatan, dan deretan gunung berapi aktif.',
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
        'Batas transform adalah zona di mana dua lempeng bergerak berpapasan mendatar secara horizontal. Pergeseran ini tidak membentuk ataupun meleburkan kerak bumi, tetapi gesekan batuan yang terkunci dapat melepaskan energi gempa bumi dangkal di sepanjang jalur sesar patahan.',
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
        'Mantel bumi terletak di bawah kerak hingga batas inti pada kedalaman 660–2.900 km, dengan ketebalan 2.900 km menjadikannya lapisan tertebal di bumi. Bersuhu 1.000°C–3.700°C, karakteristiknya tersusun dari batuan padat panas yang mengalir lambat akibat arus konveksi, menjadi mesin penggerak lempeng bumi.',
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
        'Batuan mantel terletak pada kedalaman 660–2.900 km dengan suhu mencapai 3.700°C. Karakteristik batuannya tetap kokoh dan berwujud padat karena ditekan oleh gaya gravitasi dahsyat dari seluruh lapisan di atasnya, sehingga batuan tidak mencair encer.',
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
        'Inti luar terletak di bawah mantel pada kedalaman 2.900–5.150 km, dengan ketebalan sekitar 2.250 km dan suhu 4.000°C–5.000°C. Karakteristiknya berwujud cairan logam besi dan nikel yang meleleh karena panas ekstrem. Perputaran aliran logam cair ini menghasilkan medan magnet yang melindungi bumi dari radiasi matahari.',
      fact:
        'Suhu 5.000°C di inti luar jauh melampaui titik leleh logam besi dan nikel! Akibatnya, inti luar bukanlah batuan padat seperti kerak atau mantel, melainkan logam cair meleleh yang terus berputar membentuk medan magnet bumi.',
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
        'Terletak di lapisan inti luar pada kedalaman 2.900–5.150 km dengan suhu 4.000°C–5.000°C. Karakteristik perputaran aliran logam cair yang terus mengalir berfungsi seperti dinamo raksasa, menghasilkan medan magnet pelindung yang menjaga bumi dari badai radiasi matahari.',
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
        'Inti dalam terletak di pusat bumi pada kedalaman 5.150–6.371 km, berupa bola padat berdiameter sekitar 1.220 km dengan suhu 5.500°C–6.000°C. Karakteristiknya tersusun dari kristal logam besi dan nikel yang tetap berwujud padat karena tekanan gravitasi dahsyat di pusat bumi mencegahnya meleleh.',
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
        'Terletak persis di pusat gravitasi bumi pada kedalaman 6.371 km dengan suhu 6.000°C. Karakteristik di titik pusat ini adalah gaya tarikan gravitasi saling meniadakan secara seimbang dari segala arah sehingga gaya gravitasi di sini bernilai nol.',
      fact:
        'Di titik pusat bumi ini, tarikan gravitasi saling meniadakan secara seimbang dari segala arah sehingga gaya gravitasi bernilai nol!',
      iconName: 'trophy',
      imageSrc: '/images/geology/inner_core.jpg',
      illustrationType: 'inner-core-center',
    },
    strata: EARTH_STRATA_DATA[4] || EARTH_STRATA_DATA[0],
  },

  // 10: Zona Batas Divergen — Prof. Maya: Alfred Wegener & Teori Pangea
  10: {
    discovery: {
      id: 'disc-wegener-pangea',
      title: 'Temuan 1: Alfred Wegener & Teori Pangea',
      shortDesc:
        'Dahulu kala sekitar 250 juta tahun lalu, seluruh benua di bumi menyatu menjadi satu benua raksasa (superkontinen) bernama PANGEA. Ilmuwan Alfred Wegener (1912) membuktikan benua-benua ini perlahan retak dan hanyut terpisah.',
      fact:
        'Bumi kita tidak padat membatu utuh, melainkan terpecah menjadi lempeng-lempeng tektonik yang terus bergerak perlahan di atas mantel bumi!',
      iconName: 'globe',
      imageSrc: '/images/geology/divergent.jpg',
      illustrationType: 'wegener-pangea',
    },
    strata: EARTH_STRATA_DATA[5] || EARTH_STRATA_DATA[0],
  },

  // 11: Fallback alias ke Temuan 2
  11: {
    discovery: {
      id: 'disc-divergent-anim',
      title: 'Temuan 2: Dinamika Batas Divergen',
      shortDesc:
        'Batas lempeng divergen terbentuk akibat pergerakan lempeng kulit bumi yang saling berlawanan atau saling menjauh. Hal tersebut menyebabkan magma panas naik ke permukaan dan mendesak permukaan bumi, sehingga membentuk lapisan permukaan bumi dan daratan kerak baru.',
      fact:
        'Magma yang terus keluar mendingin dan mengeras di batas divergen, menciptakan pematang tengah samudra (mid-ocean ridge) serta memperluas dasar laut!',
      iconName: 'zap',
      imageSrc: '/images/geology/divergent.jpg',
      illustrationType: 'divergent-anim',
    },
    strata: EARTH_STRATA_DATA[5] || EARTH_STRATA_DATA[0],
  },

  // 12: Zona Batas Divergen — Prof. Ilham: Dinamika Batas Divergen
  12: {
    discovery: {
      id: 'disc-divergent-anim',
      title: 'Temuan 2: Dinamika Batas Divergen',
      shortDesc:
        'Batas lempeng divergen terbentuk akibat pergerakan dua lempeng kulit bumi yang bergerak saling berlawanan atau saling menjauh. Hal tersebut menyebabkan magma panas dari mantel naik ke permukaan dan mendesak permukaan bumi, lalu membeku saat mendingin sehingga terbentuk lapisan permukaan bumi dan daratan kerak baru.',
      fact:
        'Magma yang membeku di batas divergen secara bertahap memperluas dasar samudra (seafloor spreading) dan menciptakan punggung pegunungan bawah laut raksasa!',
      iconName: 'zap',
      imageSrc: '/images/geology/divergent.jpg',
      illustrationType: 'divergent-anim',
    },
    strata: EARTH_STRATA_DATA[5] || EARTH_STRATA_DATA[0],
  },

  // 13: Zona Batas Konvergen — Dr. Farhan: Dinamika Batas Konvergen (Subduksi, Kolisi, Obduksi & Aceh 2004)
  13: {
    discovery: {
      id: 'disc-convergent-subduction',
      title: 'Temuan 1: Dinamika Batas Konvergen',
      shortDesc:
        'Batas konvergen terjadi akibat dua lempeng kulit bumi saling bertumbukan, sehingga salah satu lempeng tertekuk dan masuk ke bawah bagian lempeng lainnya. Gerakan dahsyat ini menimbulkan getaran gempa bumi yang sangat kuat dan dapat memicu tsunami, seperti gempa dan tsunami Aceh pada 26 Desember 2004.',
      fact:
        'Batas konvergen terbagi menjadi 3 jenis: Subduksi (membentuk deretan gunung api aktif seperti gunung Merapi & palung laut), Kolisi (tumbukan benua vs benua pembentuk Pegunungan Himalaya & Ural), dan Obduksi (lempeng benua menunjam di bawah samudra).',
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
      title: 'Batas Transform',
      shortDesc:
        'Batas lempeng sesar atau transform adalah batas lempeng yang menyebabkan terjadinya gerakan lempeng kulit bumi yang sejajar. Hal ini terjadi apabila lempengan bumi bergesek dalam posisi yang sama datar, sejajar, dan selalu bergerak.',
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


