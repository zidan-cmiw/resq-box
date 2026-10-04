export const TILE = 32;

export const T = {
  AIR: 0,
  GROUND: 1,
  WALL: 2,
  GROUND_VAR: 3,
} as const;

// ── INTERACTABLE OBJECT TYPES ──
export type ObjType = 'discovery' | 'crystal' | 'info_sign' | 'challenge_gate' | 'portal_down' | 'portal_up' | 'npc';

export interface MapObject {
  type: ObjType;
  x: number;   // tile col (for legacy fallback)
  y: number;   // tile row (for legacy fallback)
  px?: number; // precise pixel X coordinate on terrain
  py?: number; // precise pixel Y coordinate on terrain
  id: string;  // unique ID for state tracking
  data?: Record<string, unknown>;
}

export interface Platform {
  x1: number;
  x2: number;
  y: number;
  h?: number;
  type?: 'wood_bridge' | 'scaffold' | 'basalt_pillar' | 'crystal_bridge' | 'cooled_crust';
}

export interface HazardArea {
  x: number;
  y: number;
  w: number;
  h: number;
  damage: number;
  type: 'molten_lava' | 'deep_trench' | 'toxic_fume';
}

export interface ZoneConfig {
  id: string;
  name: string;
  depthLabel: string;
  temperature: string;
  pressure: string;
  cols: number;
  rows: number;
  tiles: number[][];
  groundProfile: number[];   // Array of ground Y pixel coords (size MAP_WIDTH_PX)
  ceilingProfile: number[];  // Array of ceiling Y pixel coords (size MAP_WIDTH_PX, 0 = sky)
  platforms: Platform[];     // Wooden suspension bridges, basalt stepping pillars
  objects: MapObject[];
  hazards?: HazardArea[];    // Lava/magma chasms and hazardous zones
  playerSpawnX: number;      // Pixel X spawn position
  playerSpawnY: number;      // Pixel Y spawn position
}

// ── MAP CONSTANTS ──
export const COLS = 40;
export const ROWS = 15;
export const MAP_WIDTH_PX = COLS * TILE;  // 1280 px
export const MAP_HEIGHT_PX = ROWS * TILE; // 480 px

// ── PROFILE INTERPOLATION HELPER ──
// Interpolasi cosine halus (ease-in-out) antar titik elevasi geologis
export function interpolateProfile(points: [number, number][], width: number = MAP_WIDTH_PX): number[] {
  const profile = new Array<number>(width);
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    const startX = Math.max(0, Math.floor(x0));
    const endX = Math.min(width - 1, Math.floor(x1));
    for (let x = startX; x <= endX; x++) {
      const t = (x - x0) / (x1 - x0);
      const smoothT = (1 - Math.cos(t * Math.PI)) / 2;
      profile[x] = y0 + (y1 - y0) * smoothT;
    }
  }
  const firstY = points[0][1];
  for (let x = 0; x < Math.floor(points[0][0]); x++) profile[x] = firstY;
  const lastY = points[points.length - 1][1];
  for (let x = Math.floor(points[points.length - 1][0]); x < width; x++) profile[x] = lastY;
  return profile;
}

// Generate legacy tile grid from continuous ground & ceiling profiles
function generateTilesFromProfiles(ground: number[], ceiling: number[], numCols: number = COLS, numRows: number = ROWS): number[][] {
  const tiles: number[][] = [];
  for (let r = 0; r < numRows; r++) {
    const rowArr: number[] = [];
    for (let c = 0; c < numCols; c++) {
      const midX = c * TILE + TILE / 2;
      const gY = ground[Math.floor(midX)] ?? 360;
      const cY = ceiling[Math.floor(midX)] ?? 0;
      const tileTop = r * TILE;
      const tileBot = (r + 1) * TILE;

      if (cY > 0 && tileTop < cY) {
        rowArr.push(T.WALL);
      } else if (tileBot > gY) {
        rowArr.push(tileTop <= gY ? T.GROUND : T.GROUND_VAR);
      } else {
        rowArr.push(T.AIR);
      }
    }
    tiles.push(rowArr);
  }

  // Left & right map boundaries
  for (let r = 0; r < numRows; r++) {
    tiles[r][0] = T.WALL;
    tiles[r][numCols - 1] = T.WALL;
  }
  return tiles;
}

// ══════════════════════════════════════════════════════════════════════════
// ZONA 0: PERMUKAAN BUMI (Pegunungan Lipatan Benua & Rig Sumur Bor Dalam)
// ══════════════════════════════════════════════════════════════════════════
function buildSurface(): ZoneConfig {
  // Kontur gunung lipatan organik (Continental Fold Mountain)
  // Base camp (360) -> Naik ke Puncak Gunung (225) -> Ngarai Patahan & Jembatan Tali (330) -> Tapak Rig Bor (360)
  const groundPoints: [number, number][] = [
    [0, 360],
    [160, 360],
    [300, 320],
    [480, 225],
    [640, 225],
    [760, 310],
    [880, 395],   // Lembah ngarai patahan tektonik di bawah jembatan
    [980, 395],
    [1060, 340],
    [1140, 360],
    [1280, 360],
  ];

  const ceilingPoints: [number, number][] = [
    [0, 0],
    [1280, 0],
  ];

  const groundProfile = interpolateProfile(groundPoints);
  const ceilingProfile = interpolateProfile(ceilingPoints);
  const tiles = generateTilesFromProfiles(groundProfile, ceilingProfile);

  // Jembatan gantung kayu ekspedisi ala Terraria melintasi ngarai patahan
  const platforms: Platform[] = [
    { x1: 760, x2: 1040, y: 325, h: 10, type: 'wood_bridge' },
  ];

  const objects: MapObject[] = [
    {
      type: 'npc',
      px: 180, py: 328, // Menapak di lereng awal basecamp
      x: 6, y: 10,
      id: 'npc_raditya',
      data: {
        npcType: 'zidane',
        name: 'Zidane',
        dialogueId: 'z0_zidane_dialogue',
      },
    },
    {
      type: 'crystal',
      px: 620, py: 195, // Kristal di puncak bukit
      x: 19, y: 6,
      id: 'surface_crystal',
    },
    {
      type: 'npc',
      px: 900, py: 293, // Di atas jembatan kayu mendekati rig bor
      x: 28, y: 9,
      id: 'npc_maya',
      data: {
        npcType: 'zahra',
        name: 'Zahra',
        dialogueId: 'z0_zahra_dialogue',
      },
    },
    {
      type: 'portal_down',
      px: 1210, py: 328, // Di tapak pemboran industri (Kola Superdeep Borehole)
      x: 37, y: 10,
      id: 'surface_portal_down',
    },
  ];

  return {
    id: 'surface',
    name: 'Permukaan Bumi',
    depthLabel: '0 km (0 mil)',
    temperature: '25°C',
    pressure: '1 atm',
    cols: COLS,
    rows: ROWS,
    tiles,
    groundProfile,
    ceilingProfile,
    platforms,
    objects,
    playerSpawnX: 80,
    playerSpawnY: 360,
  };
}

// ══════════════════════════════════════════════════════════════════════════
// ZONA 1: KERAK BUMI / LITOSFER (Gua Batuan Organik & Batas Moho)
// ══════════════════════════════════════════════════════════════════════════
function buildCrust(): ZoneConfig {
  const groundPoints: [number, number][] = [
    [0, 370],
    [200, 370],
    [380, 295],  // Rak batu bertingkat alami (natural limestone terrace)
    [580, 295],
    [720, 360],  // Sesar turun tektonik (normal fault step)
    [920, 360],
    [1060, 320], // Patahan singkapan Moho
    [1280, 370],
  ];

  const ceilingPoints: [number, number][] = [
    [0, 50],
    [220, 75],
    [450, 40],
    [700, 85],
    [950, 50],
    [1280, 60],
  ];

  const groundProfile = interpolateProfile(groundPoints);
  const ceilingProfile = interpolateProfile(ceilingPoints);
  const tiles = generateTilesFromProfiles(groundProfile, ceilingProfile);

  const platforms: Platform[] = [
    { x1: 540, x2: 720, y: 295, h: 8, type: 'scaffold' },
    { x1: 820, x2: 980, y: 340, h: 8, type: 'scaffold' },
  ];

  const objects: MapObject[] = [
    { type: 'portal_up', px: 70, py: 338, x: 2, y: 10, id: 'crust_portal_up' },
    {
      type: 'npc',
      px: 170, py: 338,
      x: 5, y: 10,
      id: 'npc_gea',
      data: {
        npcType: 'zidane',
        name: 'Zidane',
        dialogueId: 'z1_zidane_dialogue',
      },
    },
    {
      type: 'npc',
      px: 540, py: 263,
      x: 17, y: 8,
      id: 'npc_andini',
      data: {
        npcType: 'lintang',
        name: 'Lintang',
        dialogueId: 'z1_lintang_dialogue',
        hasMaterial: true,
        isDiscoveryNpc: true,
        discoveryId: 0,
        discoveryKey: 'crust_disc_compare',
      },
    },
    {
      type: 'crystal',
      px: 700, py: 265,
      x: 22, y: 8,
      id: 'crust_crystal',
    },
    {
      type: 'npc',
      px: 860, py: 328,
      x: 27, y: 10,
      id: 'npc_budi',
      data: {
        npcType: 'ican',
        name: 'Ican',
        dialogueId: 'z1_ican_dialogue',
      },
    },
    {
      type: 'npc',
      px: 1080, py: 288,
      x: 34, y: 9,
      id: 'npc_hendra',
      data: {
        npcType: 'bu_tyas',
        name: 'Bu Tyas',
        dialogueId: 'z1_bu_tyas_dialogue',
        isGateNpc: true,
        gateId: 'crust_challenge',
      },
    },
    {
      type: 'npc',
      px: 1150, py: 310,
      x: 36, y: 10,
      id: 'crust_suit_merchant',
      data: {
        npcType: 'petugas_joko',
        name: 'Teknisi Joko',
        dialogueId: 'crust_merchant_dialogue',
        isSuitMerchant: true,
        suitType: 'mantle_suit',
        price: 1,
      },
    },
    {
      type: 'portal_down',
      px: 1220, py: 338,
      x: 38, y: 10,
      id: 'crust_portal_down',
    },
  ];

  return {
    id: 'crust',
    name: 'Kerak Bumi',
    depthLabel: '0–100 km (0–50 mil)',
    temperature: '25°C – 540°C',
    pressure: '1 atm–3 GPa',
    cols: COLS,
    rows: ROWS,
    tiles,
    groundProfile,
    ceilingProfile,
    platforms,
    objects,
    playerSpawnX: 80,
    playerSpawnY: 370,
  };
}

// ══════════════════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════════════════
// ZONA 2: MANTEL BUMI (Labirin Silikat Bridgmanite & Sungai Magma Kental)
// ══════════════════════════════════════════════════════════════════════════
function buildMantle(): ZoneConfig {
  // Kontur tanah dengan teras batuan silikat datar untuk tumpuan presisi seluruh objek
  // Diselingi danau magma membara lebar yang dilintasi platform pilar parkour bertingkat
  const groundPoints: [number, number][] = [
    [0, 330],
    [150, 330],    // Area spawn & portal up (px=60)
    [180, 320],    // Tanjakan ke Teras Silikat 1 (Zahra)
    [300, 320],    // Teras Datar Silikat 1: menampung Zahra (px=240)
    [330, 410],    // Tebing patahan curam turun ke Danau Magma 1
    [610, 410],    // Dasar Danau Magma 1 (penampung pilar parkour 1, 2, 3)
    [640, 320],    // Tebing naik ke Pulau Bridgmanite Tengah (Lintang)
    [760, 320],    // Teras Datar Tengah: menampung Lintang (px=700)
    [790, 410],    // Tebing patahan curam turun ke Danau Magma 2
    [1050, 410],   // Dasar Danau Magma 2 (penampung pilar parkour 4, 5, 6)
    [1080, 320],   // Tebing naik ke Teras Altar Akhir (Bu Tyas)
    [1280, 320],   // Teras Datar Akhir: menampung Bu Tyas (px=1130) & portal_down (px=1220)
  ];

  const ceilingPoints: [number, number][] = [
    [0, 65],
    [240, 75],
    [410, 45],
    [600, 80],
    [760, 50],
    [850, 75],
    [1000, 55],
    [1280, 65],
  ];

  const groundProfile = interpolateProfile(groundPoints);
  const ceilingProfile = interpolateProfile(ceilingPoints);
  const tiles = generateTilesFromProfiles(groundProfile, ceilingProfile);

  // Pilar struktur mineral silikat masif (Bridgmanite & Basalt Pillars) melintasi danau magma
  const platforms: Platform[] = [
    // Sektor Parkour 1: Melintasi Danau Magma Barat
    { x1: 340, x2: 405, y: 345, h: 14, type: 'basalt_pillar' },
    { x1: 440, x2: 510, y: 305, h: 14, type: 'basalt_pillar' }, // Pilar tinggi tempat kristal
    { x1: 545, x2: 610, y: 340, h: 14, type: 'basalt_pillar' },

    // Sektor Parkour 2: Melintasi Danau Magma Timur
    { x1: 800, x2: 865, y: 345, h: 14, type: 'basalt_pillar' },
    { x1: 895, x2: 960, y: 300, h: 14, type: 'basalt_pillar' }, // Pilar tinggi bertingkat
    { x1: 995, x2: 1055, y: 335, h: 14, type: 'basalt_pillar' },
  ];

  const objects: MapObject[] = [
    { type: 'portal_up', px: 60, py: 294, x: 2, y: 9, id: 'mantle_portal_up' },
    {
      type: 'npc',
      px: 240, py: 320,
      x: 7, y: 10,
      id: 'npc_sarah',
      data: {
        npcType: 'zahra',
        name: 'Zahra',
        dialogueId: 'z2_zahra_dialogue',
        hasMaterial: true,
        isDiscoveryNpc: true,
        discoveryId: 4,
        discoveryKey: 'mantle_disc1',
      },
    },
    {
      type: 'crystal',
      px: 475, py: 281, // Di atas pilar tinggi parkour 2 (x1: 440, x2: 510, y: 305)
      x: 15, y: 9,
      id: 'mantle_crystal',
    },
    {
      type: 'npc',
      px: 700, py: 320,
      x: 22, y: 10,
      id: 'z2_npc_lintang',
      data: {
        npcType: 'lintang',
        name: 'Lintang',
        dialogueId: 'z2_lintang_dialogue',
        hasMaterial: true,
        isDiscoveryNpc: true,
        discoveryId: 5,
        discoveryKey: 'mantle_disc2',
      },
    },
    {
      type: 'npc',
      px: 1130, py: 320,
      x: 35, y: 10,
      id: 'npc_surya',
      data: {
        npcType: 'bu_tyas',
        name: 'Bu Tyas',
        dialogueId: 'z2_bu_tyas_dialogue',
        isGateNpc: true,
        gateId: 'mantle_challenge',
      },
    },
    {
      type: 'npc',
      px: 1175, py: 320,
      x: 36, y: 10,
      id: 'mantle_suit_merchant',
      data: {
        npcType: 'petugas_rudi',
        name: 'Teknisi Rudi',
        dialogueId: 'mantle_merchant_dialogue',
        isSuitMerchant: true,
        suitType: 'outer_core_suit',
        price: 1,
      },
    },
    {
      type: 'portal_down',
      px: 1220, py: 284,
      x: 38, y: 9,
      id: 'mantle_portal_down',
    },
  ];

  return {
    id: 'mantle',
    name: 'Mantel Bumi',
    depthLabel: '660–2.900 km (1.800 mil)',
    temperature: '1.000°C – 3.700°C',
    pressure: '24 GPa–136 GPa (Hingga 1,3 Juta atm)',
    cols: COLS,
    rows: ROWS,
    tiles,
    groundProfile,
    ceilingProfile,
    platforms,
    objects,
    hazards: [
      { x: 310, y: 370, w: 320, h: 50, damage: 25, type: 'molten_lava' },
      { x: 770, y: 370, w: 300, h: 50, damage: 25, type: 'molten_lava' },
    ],
    playerSpawnX: 80,
    playerSpawnY: 330,
  };
}

// ══════════════════════════════════════════════════════════════════════════
// ZONA 3: INTI LUAR (Lautan Logam Cair & Dinamo Medan Magnet Bumi)
// ══════════════════════════════════════════════════════════════════════════
function buildOuterCore(): ZoneConfig {
  // Profil tanah Inti Luar: Datar padat (flat solid iron-nickel bedrock) dengan kubah terbuka
  // Menampilkan busur kurva torus medan magnet bumi (Geomagnetic Dipole Loops) dan kilatan listrik
  const groundPoints: [number, number][] = [
    [0, 350],
    [1280, 350],
  ];

  const ceilingPoints: [number, number][] = [
    [0, 0],
    [1280, 0],
  ];

  const groundProfile = interpolateProfile(groundPoints);
  const ceilingProfile = interpolateProfile(ceilingPoints);
  const tiles = generateTilesFromProfiles(groundProfile, ceilingProfile);

  const platforms: Platform[] = [];

  const objects: MapObject[] = [
    { type: 'portal_up', px: 70, py: 314, x: 2, y: 10, id: 'oc_portal_up' },
    {
      type: 'npc',
      px: 380, py: 350,
      x: 12, y: 10,
      id: 'npc_ratna',
      data: {
        npcType: 'zahra',
        name: 'Zahra',
        dialogueId: 'z3_zahra_dialogue',
        hasMaterial: true,
        isDiscoveryNpc: true,
        discoveryId: 6,
        discoveryKey: 'oc_disc1',
      },
    },
    {
      type: 'crystal',
      px: 600, py: 326,
      x: 19, y: 10,
      id: 'oc_crystal',
    },
    {
      type: 'npc',
      px: 780, py: 350,
      x: 24, y: 10,
      id: 'npc_aris',
      data: {
        npcType: 'lintang',
        name: 'Lintang',
        dialogueId: 'z3_lintang_dialogue',
        hasMaterial: true,
        isDiscoveryNpc: true,
        discoveryId: 7,
        discoveryKey: 'oc_disc2',
      },
    },
    {
      type: 'npc',
      px: 1080, py: 350,
      x: 34, y: 10,
      id: 'npc_teguh',
      data: {
        npcType: 'bu_tyas',
        name: 'Bu Tyas',
        dialogueId: 'z3_bu_tyas_dialogue',
        isGateNpc: true,
        challengeId: 'oc_challenge',
        gateId: 'oc_challenge',
      },
    },
    {
      type: 'npc',
      px: 1140, py: 350,
      x: 36, y: 10,
      id: 'oc_suit_merchant',
      data: {
        npcType: 'petugas_dian',
        name: 'Teknisi Dian',
        dialogueId: 'oc_merchant_dialogue',
        isSuitMerchant: true,
        suitType: 'inner_core_suit',
        price: 1,
      },
    },
    {
      type: 'portal_down',
      px: 1200, py: 314,
      x: 38, y: 10,
      id: 'oc_portal_down',
    },
  ];

  return {
    id: 'outerCore',
    name: 'Inti Luar',
    depthLabel: '2.900–5.150 km (1.400 mil)',
    temperature: '4.000°C – 5.000°C',
    pressure: '136 GPa–330 GPa (Hingga 3,3 Juta atm)',
    cols: COLS,
    rows: ROWS,
    tiles,
    groundProfile,
    ceilingProfile,
    platforms,
    objects,
    playerSpawnX: 80,
    playerSpawnY: 350,
  };
}

// ══════════════════════════════════════════════════════════════════════════
// ZONA 4: INTI DALAM (Istana Kristal Logam Heksagonal Padat 6.000°C - 6.371 KM)
// ══════════════════════════════════════════════════════════════════════════
function buildInnerCore(): ZoneConfig {
  // Profil tanah Inti Dalam: Teras-teras batuan kristal emas padat yang membentang melintasi jurang fluida emas
  // Dihubungkan oleh Jembatan Kristal Emas bercahaya transparan
  const groundPoints: [number, number][] = [
    [0, 360],
    [160, 360],    // Area spawn & portal up (px=70)
    [210, 310],    // Tanjakan teras kristal emas 1
    [380, 310],    // Teras Kristal Emas 1: menampung Zahra (px=330)
    [390, 310],    // Tebing barat Chasm 1 tumpuan jembatan kristal
    [415, 400],    // Jurang fluida inti dalam 1
    [545, 400],    // Dasar Jurang 1
    [570, 310],    // Tebing timur Chasm 1 tumpuan jembatan kristal
    [590, 310],    // Pematang Kristal Emas Tengah
    [780, 310],    // Teras Tengah: menampung Lintang (px=730)
    [790, 310],    // Tebing barat Chasm 2 tumpuan jembatan kristal
    [815, 400],    // Jurang fluida inti dalam 2
    [945, 400],    // Dasar Jurang 2
    [970, 310],    // Tebing timur Chasm 2 tumpuan jembatan kristal
    [1010, 330],   // Tanjakan ke Teras Altar Akhir
    [1280, 330],   // Teras Altar Akhir: menampung Bu Tyas (px=1100) & Kapsul Akhir (px=1220)
  ];

  const ceilingPoints: [number, number][] = [
    [0, 60],
    [220, 75],
    [420, 45],
    [640, 80],
    [850, 50],
    [1050, 75],
    [1280, 60],
  ];

  const groundProfile = interpolateProfile(groundPoints);
  const ceilingProfile = interpolateProfile(ceilingPoints);
  const tiles = generateTilesFromProfiles(groundProfile, ceilingProfile);

  // Jembatan medan fluks kristal emas berlabuh ke kedua tebing melintasi jurang
  const platforms: Platform[] = [
    { x1: 390, x2: 570, y: 310, h: 12, type: 'crystal_bridge' },
    { x1: 790, x2: 970, y: 310, h: 12, type: 'crystal_bridge' },
  ];

  const objects: MapObject[] = [
    { type: 'portal_up', px: 70, py: 324, x: 2, y: 10, id: 'ic_portal_up' },
    {
      type: 'npc',
      px: 330, py: 310,
      x: 10, y: 9,
      id: 'z4_npc_zahra',
      data: {
        npcType: 'zahra',
        name: 'Zahra',
        dialogueId: 'z4_zahra_dialogue',
        hasMaterial: true,
        isDiscoveryNpc: true,
        discoveryId: 8,
        discoveryKey: 'ic_disc1',
      },
    },
    {
      type: 'crystal',
      px: 590, py: 280,
      x: 18, y: 9,
      id: 'ic_crystal',
    },
    {
      type: 'npc',
      px: 730, py: 310,
      x: 22, y: 9,
      id: 'z4_npc_lintang',
      data: {
        npcType: 'lintang',
        name: 'Lintang',
        dialogueId: 'z4_lintang_dialogue',
        hasMaterial: true,
        isDiscoveryNpc: true,
        discoveryId: 9,
        discoveryKey: 'ic_disc2',
      },
    },
    {
      type: 'npc',
      px: 1100, py: 330,
      x: 34, y: 10,
      id: 'npc_bintang',
      data: {
        npcType: 'bu_tyas',
        name: 'Bu Tyas',
        dialogueId: 'z4_bu_tyas_dialogue',
        isGateNpc: true,
        challengeId: 'ic_challenge',
        gateId: 'ic_challenge',
      },
    },
    {
      type: 'npc',
      px: 1160, py: 330,
      x: 36, y: 10,
      id: 'ic_suit_merchant',
      data: {
        npcType: 'komandan_arya',
        name: 'Teknisi Arya',
        dialogueId: 'ic_merchant_dialogue',
        isSuitMerchant: true,
        suitType: 'diver_suit',
        price: 1,
      },
    },
    {
      type: 'portal_down',
      px: 1220, py: 294,
      x: 38, y: 10,
      id: 'ic_portal_exit',
    },
  ];

  return {
    id: 'innerCore',
    name: 'Inti Dalam',
    depthLabel: '5.150–6.371 km (750 mil)',
    temperature: '5.500°C – 6.000°C',
    pressure: '>3,6 Juta atm (360 GPa)',
    cols: COLS,
    rows: ROWS,
    tiles,
    groundProfile,
    ceilingProfile,
    platforms,
    objects,
    hazards: [
      { x: 400, y: 370, w: 160, h: 50, damage: 25, type: 'molten_lava' },
      { x: 810, y: 370, w: 160, h: 50, damage: 25, type: 'molten_lava' },
    ],
    playerSpawnX: 80,
    playerSpawnY: 360,
  };
}

// ══════════════════════════════════════════════════════════════════════════
// 6. ZONA BATAS DIVERGEN & LEMBAH RETAKAN (EAST AFRICAN RIFT & PANGEA)
// ══════════════════════════════════════════════════════════════════════════
function buildDivergentZone(): ZoneConfig {
  // ── MAP BATAS DIVERGEN: DINAMIKA PEMEKARAN LEMPENG AKTIF & GUNDUKAN ALAMI ──
  // Peta compact (1350px) agar celah pembelahan (x: 395..505) terlihat langsung di layar saat awal masuk.
  // Tanah memiliki gundukan/bukit bergelombang alami (bukan garis datar flat).
  // Lempeng Barat (0..395) -> Celah Magma Menganga Bersih (395..505) -> Lempeng Timur (505..1350)
  const divergentWidth = 1350;
  const divergentCols = Math.ceil(divergentWidth / TILE); // 43 cols

  // Baseline profil bergelombang alami di dasar lautan (ditinggikan se-garis merah pada y ~ 248)
  const groundProfile = new Array<number>(divergentWidth).fill(248);
  const ceilingProfile = new Array<number>(divergentWidth).fill(0); // Lautan terbuka bebas

  // Hitung kontur awal tanah (sebelum terbelah, lempeng dasar laut tersambung utuh dengan gundukan alami)
  for (let x = 0; x < divergentWidth; x++) {
    groundProfile[x] = getDivergentTerrainElevation(x, 450, 0);
  }

  const tiles = generateTilesFromProfiles(groundProfile, ceilingProfile, divergentCols, ROWS);

  // Tidak ada platform di tengah magma — celah dibuat murni menganga bersih dan dramatis
  const platforms: Platform[] = [];

  // Hazard celah magma baru aktif secara dinamis saat celah terbuka dan magma naik dari mantel
  const hazards: HazardArea[] = [];

  const objects: MapObject[] = [
    // 1. Portal Naik ke Inti Dalam (di dasar laut barat)
    {
      type: 'portal_up',
      px: 60, py: 212,
      x: 2, y: 7,
      id: 'div_portal_up',
    },
    // 2. NPC 1: Zidane (di puncak bukit lempeng barat - Pemandu Lembah Retakan)
    {
      type: 'npc',
      px: 170, py: 248,
      x: 5, y: 8,
      id: 'npc_taufik',
      data: {
        npcType: 'zidane',
        name: 'Zidane',
        dialogueId: 'z5_zidane_dialogue',
      },
    },
    // 3. Kristal Geologi 1
    {
      type: 'crystal',
      px: 230, py: 220,
      x: 7, y: 7,
      id: 'div_crystal_1',
    },
    // 4. NPC 2: Zahra (di lembah sebelum celah - Temuan 10: Superbenua Pangea)
    {
      type: 'npc',
      px: 290, py: 248,
      x: 9, y: 8,
      id: 'npc_maya',
      data: {
        npcType: 'zahra',
        name: 'Zahra',
        dialogueId: 'z5_zahra_dialogue',
        hasMaterial: true,
        isDiscoveryNpc: true,
        discoveryId: 10,
        discoveryKey: 'div_disc1',
      },
    },
    // (Celah Magma Divergen di x: 395..505 — Tempat Magma dari Mantel Mengisi 1/3 Patahan & Membeku Membentuk Kerak Samudra Baru)
    // 5. Kristal Geologi 2 (di lereng bukit timur)
    {
      type: 'crystal',
      px: 680, py: 220,
      x: 21, y: 7,
      id: 'div_crystal_2',
    },
    // 6. NPC 3: Lintang (di lereng timur - Temuan 11: Pegunungan Kembar)
    {
      type: 'npc',
      px: 880, py: 248,
      x: 27, y: 8,
      id: 'npc_ilham',
      data: {
        npcType: 'lintang',
        name: 'Lintang',
        dialogueId: 'z5_lintang_dialogue',
        hasMaterial: true,
        isDiscoveryNpc: true,
        discoveryId: 11,
        discoveryKey: 'div_disc2',
      },
    },
    // 8. Kristal Geologi 3
    {
      type: 'crystal',
      px: 1020, py: 220,
      x: 31, y: 7,
      id: 'div_crystal_3',
    },
    // 9. NPC 5: Bu Tyas (Penjaga Akses Menuju Batas Konvergen)
    {
      type: 'npc',
      px: 1140, py: 248,
      x: 35, y: 8,
      id: 'npc_satria',
      data: {
        npcType: 'bu_tyas',
        name: 'Bu Tyas',
        dialogueId: 'z5_bu_tyas_dialogue',
        isGateNpc: true,
        gateId: 'divergent_challenge',
        challengeId: 'divergent_challenge',
      },
    },
    // 9. Portal Turun ke Batas Konvergen
    {
      type: 'portal_down',
      px: 1240, py: 212,
      x: 38, y: 7,
      id: 'div_portal_down',
    },
  ];

  return {
    id: 'divergent',
    name: 'Batas Divergen',
    depthLabel: '',
    temperature: '',
    pressure: '',
    cols: divergentCols,
    rows: ROWS,
    tiles,
    groundProfile,
    ceilingProfile,
    platforms,
    objects,
    hazards,
    playerSpawnX: 80,
    playerSpawnY: 195,
  };
}

// ── FUNGSI KONTUR BERGELOMBANG BATAS MANTEL ASTENOSFER (AREA 6) ──
// Lapisan lempeng ditebalkan ke bawah, dan lapisan mantel ditipiskan ke dasar kanvas (baseline y ~ 428, tebal mantel ~52px)
export function getMantleBoundaryY(x: number): number {
  const wave1 = Math.sin((x / 240) * Math.PI) * 8;
  const wave2 = Math.cos((x / 130) * Math.PI) * 4;
  const wave3 = Math.sin((x / 75) * Math.PI) * 2;
  return Math.round(428 + wave1 + wave2 + wave3);
}

// ── FUNGSI KONTUR DINAMIS MANTEL PEMEKARAN DIVERGEN (AREA 6) ──
// Mantel di bawah lempeng ikut membelah dan bergeser bersama lempeng kiri & kanan,
// dan menyatu mulus 100% sebagai satu lapisan dengan magma yang membumbung di celah
export function getDivergentMantleY(
  x: number,
  splitCenter: number = 450,
  p: number = 1.0,
  _coolProgress: number = 0,
): number {
  const maxGap = 110;
  const gap = p * maxGap;
  const leftEdge = Math.round(splitCenter - gap / 2);
  const rightEdge = Math.round(splitCenter + gap / 2);
  const slopeW = Math.min(38, Math.max(14, Math.round(gap * 0.35)));
  const lavaLeft = leftEdge + slopeW;
  const lavaRight = rightEdge - slopeW;
  const floorY = 372; // Elevasi magma sebatas garis merah referensi pengguna

  // Titik referensi dasar lempeng di bibir rekahan timur (lavaRight)
  const refEastX = Math.round(lavaRight - gap * 0.5);

  if (x <= lavaLeft) {
    const distFromRift = lavaLeft - x;
    const symBaseY = getMantleBoundaryY(refEastX + distFromRift);
    if (x >= 250) {
      return symBaseY;
    }
    // Bertransisi mulus ke profil alami lempeng barat di x < 250
    const blendT = Math.min(1, Math.max(0, (250 - x) / 100));
    const smoothT = (1 - Math.cos(blendT * Math.PI)) / 2;
    const westNaturalY = getMantleBoundaryY(x + gap * 0.5);
    return Math.round(symBaseY * (1 - smoothT) + westNaturalY * smoothT);
  }

  // 2. Lempeng Timur (x >= lavaRight): Dasar lempeng timur alami
  if (x >= lavaRight) {
    return getMantleBoundaryY(x - gap * 0.5);
  }

  // 3. Celah magma tengah (lavaLeft < x < lavaRight)
  // Magma dari mantel membumbung mengisi celah hingga ke garis merah (floorY = 372)
  const baseM = getMantleBoundaryY(refEastX); // ~428px

  let centerMagmaY = baseM;
  if (p >= 0.45) {
    const magmaRise = Math.min(1, (p - 0.45) / 0.55);
    centerMagmaY = baseM - magmaRise * (baseM - floorY);
  }

  return Math.round(centerMagmaY);
}

// ── FUNGSI ELEVASI MEDAN BERGELOMBANG ORGANIK AREA 6 (DENGAN TEBING MIRING BERTEKSTUR) ──
export function getDivergentTerrainElevation(
  x: number,
  splitCenter: number = 450,
  p: number = 1.0,
  coolProgress: number = 0,
): number {
  const maxGap = 110;
  const gap = p * maxGap;
  const leftEdge = Math.round(splitCenter - gap / 2);
  const rightEdge = Math.round(splitCenter + gap / 2);

  // Fungsi elevasi kontur alami lempeng dasar laut barat (y ~ 248)
  const getWestBase = (px: number) => {
    const hillWave = Math.sin((px / 240) * Math.PI) * 10 + Math.sin((px / 110) * Math.PI) * 3;
    return 248 - hillWave;
  };

  // Fungsi elevasi kontur alami lempeng dasar laut timur
  const getEastBase = (px: number) => {
    const relX = px - rightEdge;
    const eastWave = Math.sin((relX / 300) * Math.PI) * 12 + Math.sin((relX / 140) * Math.PI) * 3;
    return 248 - eastWave;
  };

  // Saat lempeng belum membelah: satu kesatuan kontur utuh tanpa patahan
  if (gap <= 4) {
    if (x <= splitCenter) return Math.round(getWestBase(x));
    return Math.round(getEastBase(x));
  }

  // Dataran Lempeng Barat (x <= leftEdge)
  if (x <= leftEdge) {
    const distToLip = leftEdge - x;
    const droop = distToLip < 16 ? (1 - distToLip / 16) * 6 : 0;
    return Math.round(getWestBase(x) + droop);
  }

  // Dataran Lempeng Timur (x >= rightEdge)
  if (x >= rightEdge) {
    const distToLip = x - rightEdge;
    const droop = distToLip < 16 ? (1 - distToLip / 16) * 6 : 0;
    return Math.round(getEastBase(x) + droop);
  }

  // ── DI DALAM JURANG REKAHAN NGARAI (leftEdge < x < rightEdge) ──
  // Tebing miring alami bertingkat tembus sampai ke bawah (garis merah floorY = 372)
  const westLipY = Math.round(getWestBase(leftEdge)) + 6;
  const eastLipY = Math.round(getEastBase(rightEdge)) + 6;
  const floorY = 372; // Magma mengisi dan membeku sebatas garis merah referensi pengguna
  const slopeW = Math.min(38, Math.max(14, Math.round(gap * 0.35)));
  const lavaLeft = leftEdge + slopeW;
  const lavaRight = rightEdge - slopeW;

  // 1. Lereng ngarai patahan barat (miring alami dari bibir atas westLipY melandai ke lantai ngarai floorY = 372)
  if (x <= lavaLeft) {
    const t = (x - leftEdge) / Math.max(1, lavaLeft - leftEdge);
    const sCurve = (1 - Math.cos(t * Math.PI)) / 2;
    // Undakan batuan alami bertingkat patahan normal tektonik melandai tembus sampai ke dasar
    const stepLedge = Math.sin(t * Math.PI * 4.5) * (1 - t * 0.7) * 2;
    return Math.round(westLipY + sCurve * (floorY - westLipY) + stepLedge);
  }

  // 2. Lereng ngarai patahan timur (miring alami dari lantai ngarai floorY = 372 melandai ke bibir atas eastLipY)
  if (x >= lavaRight) {
    const t = (rightEdge - x) / Math.max(1, rightEdge - lavaRight);
    const sCurve = (1 - Math.cos(t * Math.PI)) / 2;
    const stepLedge = Math.sin(t * Math.PI * 4.5) * (1 - t * 0.7) * 2;
    return Math.round(eastLipY + sCurve * (floorY - eastLipY) + stepLedge);
  }

  // 3. Palung tengah antara kedua lereng ngarai (lavaLeft < x < lavaRight)
  // Ketika magma membeku (coolProgress >= 1), membeku menjadi daratan pillow basalt padat baru di y = 372
  if (coolProgress >= 1) {
    return floorY;
  }

  // Ketika magma naik dari mantel (p >= 0.45): elevasi mengikuti permukaan magma yang naik
  if (p >= 0.45) {
    const mantleBaseY = getMantleBoundaryY(splitCenter);
    const magmaRise = Math.min(1, (p - 0.45) / 0.55);
    return Math.round(mantleBaseY - magmaRise * (mantleBaseY - floorY));
  }

  // Ketika masih celah awal sebelum magma naik (p < 0.45): permukaan adalah batas atas mantel di getDivergentMantleY
  return getDivergentMantleY(x, splitCenter, p, coolProgress);
}

// ── PENGUPDATE PROFIL MEDAN DINAMIS PEMEKARAN DIVERGEN (AREA 6) ──
export function updateDivergentGroundProfile(
  zone: ZoneConfig,
  progress: number,
  coolProgress: number = 0,
): void {
  if (!zone.groundProfile || zone.id !== 'divergent') return;
  const p = Math.max(0, Math.min(1, progress));
  const splitCenter = 450;
  const maxGap = 110;
  const gap = p * maxGap;
  const leftEdge = Math.round(splitCenter - gap / 2);
  const rightEdge = Math.round(splitCenter + gap / 2);
  const slopeW = Math.min(38, Math.max(14, Math.round(gap * 0.35)));

  for (let x = 0; x < zone.groundProfile.length; x++) {
    zone.groundProfile[x] = getDivergentTerrainElevation(x, splitCenter, p, coolProgress);
  }

  // Magma hazard aktif di dasar ngarai tengah saat magma naik (p >= 0.45) dan belum membeku (coolProgress < 0.7)
  const hazardLeft = leftEdge + slopeW;
  const hazardRight = rightEdge - slopeW;
  const hazardW = Math.max(14, hazardRight - hazardLeft);

  zone.hazards = (gap > 12 && p >= 0.45 && coolProgress < 0.7) ? [
    { x: hazardLeft, y: 370, w: hazardW, h: 60, damage: 25, type: 'molten_lava' }
  ] : [];

  snapObjectsToGround(zone);
}

// ══════════════════════════════════════════════════════════════════════════
// 7. BUILD AREA 7: BATAS KONVERGEN (ZONA PENUMBUKAN, SUBDUKSI & GUNUNG VULKANIK)
// ══════════════════════════════════════════════════════════════════════════
// Map width: 48 kolom (1.536 px).
// - Kerak Samudra (x: 0 .. 435): Perairan laut biru dengan gelombang & mekanika Perahu Riset.
// - Palung Laut Dalam (x: 435 .. 545): Penunjaman lempeng samudra, rekahan terisi air laut, jembatan andesit kokoh.
// - Kerak Benua & Gunung Berapi (x: 545 .. 1536): Daratan terlipat, stratovolcano megah dengan dapur magma internal membara (tidak meletus keluar), 4 NPC peneliti & komandan di daratan benua, kristal geologi, dan portal altar transform.
export function buildConvergentZone(): ZoneConfig {
  const convergentCols = 48; // 1.536 px
  const tiles: number[][] = [];
  for (let r = 0; r < ROWS; r++) {
    tiles[r] = new Array(convergentCols).fill(T.AIR);
  }

  const groundProfile: number[] = new Array(convergentCols * TILE);
  const ceilingProfile: number[] = new Array(convergentCols * TILE).fill(0);
  for (let x = 0; x < groundProfile.length; x++) {
    groundProfile[x] = getConvergentTerrainElevation(x, 1.0);
    ceilingProfile[x] = 0;
  }

  const platforms: Platform[] = [];

  const hazards: HazardArea[] = [];

  const objects: MapObject[] = [
    // 1. Portal Naik Kembali ke Area 6 (Batas Divergen) di daratan lempeng barat
    {
      type: 'portal_up',
      px: 60, py: 310,
      x: 2, y: 9,
      id: 'conv_portal_up',
    },

    // 2. Kristal Geologi 1 (di dataran benua barat)
    {
      type: 'crystal',
      px: 180, py: 310,
      x: 5, y: 9,
      id: 'conv_crystal_1',
    },

    // 3. Papan Informasi Tumbukan Benua & Pembentukan Gunung
    {
      type: 'info_sign',
      px: 330, py: 310,
      x: 10, y: 9,
      id: 'conv_sign_dock',
      data: {
        text: '"Dua lempeng benua saling bertabrakan (Batas Konvergen)! Lempeng kiri menunjam ke bawah, gaya kompresi melipat kerak bumi dan membentuk gunung dengan dapur magma di dalamnya."',
      },
    },

    // 4. NPC 1: Zidane (Menganalisis Zona Subduksi Palung Jawa)
    {
      type: 'npc',
      px: 460, py: 310,
      x: 14, y: 9,
      id: 'z6_npc_zidane',
      data: {
        npcType: 'zidane',
        name: 'Zidane',
        dialogueId: 'z6_zidane_dialogue',
        hasMaterial: true,
        isDiscoveryNpc: true,
        discoveryId: 13,
        discoveryKey: 'conv_disc1',
      },
    },
    // 5. Kristal Geologi 2 (di puncak gunung yang megah!)
    {
      type: 'crystal',
      px: 620, py: 155,
      x: 19, y: 5,
      id: 'conv_crystal_2',
    },
    // 6. NPC 2: Zahra (Meneliti Busur Vulkanik & Erupsi)
    {
      type: 'npc',
      px: 740, py: 310,
      x: 23, y: 9,
      id: 'z6_npc_zahra',
      data: {
        npcType: 'zahra',
        name: 'Zahra',
        dialogueId: 'z6_zahra_dialogue',
        hasMaterial: true,
        isDiscoveryNpc: true,
        discoveryId: 14,
        discoveryKey: 'conv_disc2',
      },
    },
    // 7. NPC 3: Ican (Pengamat Deformasi Lempeng)
    {
      type: 'npc',
      px: 960, py: 310,
      x: 30, y: 9,
      id: 'z6_npc_ican',
      data: {
        npcType: 'ican',
        name: 'Ican',
        dialogueId: 'z6_ican_dialogue',
      },
    },
    // 8. Kristal Geologi 3 (di dataran timur)
    {
      type: 'crystal',
      px: 1260, py: 310,
      x: 39, y: 9,
      id: 'conv_crystal_3',
    },
    // 10. NPC 5: Bu Tyas (Evaluator Ujian Geologi Batas Konvergen & Penjaga Akses)
    {
      type: 'npc',
      px: 1380, py: 310,
      x: 43, y: 9,
      id: 'z6_npc_bu_tyas',
      data: {
        npcType: 'bu_tyas',
        name: 'Bu Tyas',
        dialogueId: 'z6_bu_tyas_dialogue',
        isGateNpc: true,
        gateId: 'convergent_challenge',
        challengeId: 'convergent_challenge',
      },
    },
    // 10. Portal Turun ke Batas Transform di ujung Altar Konvergen
    {
      type: 'portal_down',
      px: 1470, py: 310,
      x: 46, y: 9,
      id: 'conv_portal_down',
    },
  ];

  return {
    id: 'convergent',
    name: 'Batas Konvergen & Subduksi',
    depthLabel: '',
    temperature: '',
    pressure: '',
    cols: convergentCols,
    rows: ROWS,
    tiles,
    groundProfile,
    ceilingProfile,
    platforms,
    objects,
    hazards,
    playerSpawnX: 80,
    playerSpawnY: 310,
  };
}

// ── FUNGSI ELEVASI MEDAN DINAMIS AREA 7 (BATAS KONVERGEN) ──
// Mendukung 2 Kondisi:
// 1. 'land' (Konvergen Tabrakan Benua): Lempeng benua kiri menunjam miring ke kanan bawah,
//    lempeng benua kanan bergeser ke kiri dan bertabrakan membentuk gunung dengan dapur magma di dalamnya.
// ══════════════════════════════════════════════════════════════════════
// ── FUNGSI KONTUR BERGELOMBANG MANTEL & MAGMA TERPADU (AREA 7) ──
// SAMA PERSIS DENGAN KONSEP BATAS DIVERGEN:
// - Di luar gunung: Atas mantel bergelombang organik natural (baseline ~424px).
// - Di dalam gunung: Saat lempeng bertabrakan (p > 0.05), magma dari mantel membumbung naik
//   mengisi rongga perut gunung hingga membentuk dapur magma terpadu.
export function getConvergentMantleY(
  x: number,
  progress: number = 0,
  mode: 'land' | 'ocean' = 'land',
): number {
  const wave1 = Math.sin((x / 240) * Math.PI) * 7;
  const wave2 = Math.cos((x / 130) * Math.PI) * 3.5;
  const wave3 = Math.sin((x / 75) * Math.PI) * 2;
  const baseMantle = Math.round(424 + wave1 + wave2 + wave3);

  if (mode !== 'land') {
    return baseMantle;
  }

  const p = Math.max(0, Math.min(1, progress));
  if (p <= 0.05) {
    return baseMantle;
  }

  // Geometri Dapur Magma Terpadu di dalam Gunung (SAMA PERSIS KONSEP BATAS DIVERGEN)
  // Magma dari mantel membumbung naik mengisi perut gunung saat lempeng saling bertabrakan
  const leftShiftX = Math.round(p * 80);
  const contactX = 380 + leftShiftX;
  const mountainPeakX = contactX + 200;
  const chamberLeftX = contactX - 15;
  const chamberRightX = mountainPeakX + 190;
  const chamberApexX = mountainPeakX;

  if (x <= chamberLeftX || x >= chamberRightX) {
    return baseMantle;
  }

  const baseY = 310;
  const mountainLift = p * 155;
  const chamberApexY = Math.round(baseY - mountainLift * 0.60);

  // Bentuk kubah dapur magma di dalam gunung (bell curve halus C1)
  const halfW = x <= chamberApexX ? (chamberApexX - chamberLeftX) : (chamberRightX - chamberApexX);
  const u = Math.min(1, Math.abs(x - chamberApexX) / halfW);
  const bell = Math.cos(u * (Math.PI / 2));
  const ceilingY = Math.round(baseMantle - Math.pow(bell, 1.35) * (baseMantle - chamberApexY));

  // Magma perlahan naik dari mantel mengisi perut gunung seiring tabrakan (p: 0.10 -> 1.0)
  const magmaRiseProg = Math.max(0, Math.min(1, (p - 0.10) / 0.90));
  const currentLiquidSurfaceY = Math.round(baseMantle - magmaRiseProg * (baseMantle - chamberApexY));

  // Permukaan magma yang naik dari mantel
  const magmaY = Math.max(currentLiquidSurfaceY, ceilingY);
  return Math.min(baseMantle, Math.round(magmaY));
}

// ══════════════════════════════════════════════════════════════════════
// ELEVASI PERMUKAAN LEMPENG BENUA KIRI (SLAB SUBDUKSI MENUNJAM KE KANAN BAWAH)
// Dataran benua barat yang melengkung mulus menunjam langsung ke dasar mantel bumi.
// ══════════════════════════════════════════════════════════════════════
export function getSubductingPlateTopY(x: number, progress: number = 1.0): number {
  const p = Math.max(0, Math.min(1, progress));
  const leftShiftX = Math.round(p * 80);
  const leftShiftY = Math.round(p * 28);
  const contactX = 380 + leftShiftX;
  const curveStartX = 200 + leftShiftX;
  const baseY = 310;
  const slabSlope = 0.60;

  if (x <= curveStartX) {
    // Dataran lempeng benua barat (elevasi stabil rata)
    return baseY;
  }
  if (x <= contactX) {
    // Lengkungan lempeng menunjam mulus (Hermite Spline C1) dari horizontal ke slabSlope
    const dx = contactX - curveStartX;
    const u = (x - curveStartX) / dx;
    const y0 = baseY;
    const y1 = baseY + leftShiftY;
    const h00 = 2 * u * u * u - 3 * u * u + 1;
    const h01 = -2 * u * u * u + 3 * u * u;
    const h11 = u * u * u - u * u;
    return Math.round(h00 * y0 + h01 * y1 + h11 * dx * slabSlope);
  }
  // Menunjam mulus dan semakin curam langsung ke dasar mantel bumi (full tembus ke bawah)
  const rx = x - contactX;
  return Math.round(baseY + leftShiftY + rx * slabSlope + Math.pow(rx / 135, 1.85) * 45);
}

export function getConvergentTerrainElevation(
  x: number,
  progress: number = 1.0,
  mode: 'land' | 'ocean' = 'land',
): number {
  const p = Math.max(0, Math.min(1, progress));

  if (mode === 'land') {
    // ══════════════════════════════════════════════════════════════════════
    // KONDISI 1: KONVERGEN DARATAN (TABRAKAN BENUA & PEMBENTUKAN GUNUNG)
    // Sesuai Konsep Video Referensi:
    // Dua lempeng benua: lempeng kiri menunjam miring ke kanan bawah (↘),
    // lempeng kanan bergeser ke kiri (←) dan bertabrakan membentuk gunung
    // yang di dalamnya terisi dapur magma.
    // ══════════════════════════════════════════════════════════════════════
    const leftShiftX = Math.round(p * 80);
    const contactX = 380 + leftShiftX;

    // Lempeng kiri menunjam ke kanan bawah (x <= contactX)
    if (x <= contactX) {
      return getSubductingPlateTopY(x, p);
    }

    // Lempeng kanan: Pembentukan gunung hasil tabrakan kedua lempeng benua (x > contactX)
    return Math.round(getConvergentLandRightElevation(x, p));
  } else {
    // ══════════════════════════════════════════════════════════════════════
    // KONDISI 2: KONVERGEN LAUTAN & PANTAI (PALUNG SAMUDRA & PANTAI BENUA)
    // Sesuai Arahan Pengguna & Sketsa:
    // - x <= 580: Zona Perairan Samudra (permukaan laut stabil di y = 300 untuk perahu riset)
    // - x > 580: Lempeng Benua dibuat lebih tinggi dari lempeng samudra (y ≈ 280 .. 290)
    //   dengan kontur bukit pasir pesisir yang bergelombang alami (rolling sand dunes)
    // ══════════════════════════════════════════════════════════════════════
    const seaLevelY = 300;
    const coastX = 580;

    if (x <= coastX) {
      return seaLevelY;
    }

    const relX = x - coastX;
    // Kontur bukit pasir pesisir bergelombang lembut alami
    const duneWave1 = Math.sin((relX / 90) * Math.PI) * 7.5;
    const duneWave2 = Math.sin((relX / 175) * Math.PI) * 4.5;
    let baseElev = 286 - duneWave1 - duneWave2;

    // Transisi melandai mulus di bibir pantai dari air laut (y = 300 di x = 580) ke perbukitan pasir
    if (relX < 45) {
      const t = relX / 45;
      const s = (1 - Math.cos(t * Math.PI)) / 2;
      baseElev = seaLevelY * (1 - s) + baseElev * s;
    }

    // Transisi mulus ke teras altar portal timur (x >= 1350)
    if (x >= 1350 && x <= 1450) {
      const t = (x - 1350) / 100;
      const s = (1 - Math.cos(t * Math.PI)) / 2;
      baseElev = baseElev * (1 - s) + 300 * s;
    } else if (x > 1450) {
      baseElev = 300;
    }

    return Math.round(baseElev);
  }
}

// Elevasi lempeng benua kanan pada mode daratan:
// Tabrakan kedua lempeng benua melipat kerak dan membentuk gunung megah secara dinamis
function getConvergentLandRightElevation(x: number, p: number): number {
  const base = 310;
  const leftShiftX = Math.round(p * 80);
  const leftShiftY = Math.round(p * 28);
  const contactX = 380 + leftShiftX;
  const mountainWidth = 460;
  const mountainPeakX = contactX + 200;
  const mountainEndX = contactX + mountainWidth;

  // Pembentukan gunung dinamis dari hasil tabrakan kedua lempeng benua (p: 0 -> 1)
  // Di p=0, tanah datar murni (base = 310)
  // Saat tabrakan p: 0 -> 1, lempeng terlipat membentuk gunung menjulang setinggi 155px (peak = 155)
  let mountainLift = 0;
  if (x >= contactX && x <= mountainEndX) {
    const dist = x - mountainPeakX;
    const halfW = dist < 0 ? (mountainPeakX - contactX) : (mountainEndX - mountainPeakX);
    const u = Math.min(1, Math.abs(dist) / halfW);
    const bell = Math.cos(u * (Math.PI / 2));
    const currentLift = p * 155;
    mountainLift = Math.pow(bell, 1.35) * currentLift;

    // Variasi lipatan tektonik alami pada lereng gunung
    const foldWave = Math.sin(((x - contactX) / 80) * Math.PI) * (p * 2.5) * Math.sin(bell * Math.PI);
    mountainLift += foldWave;
  }

  // Di titik kontak contactX, pastikan elevasi tepat menyatu dengan lempeng kiri
  let elev = base - Math.max(0, mountainLift);
  if (x === contactX) {
    elev = base + leftShiftY;
  } else if (x > contactX && x < contactX + 25) {
    // Transisi sangat halus di titik kontak
    const t = (x - contactX) / 25;
    const leftY = getSubductingPlateTopY(contactX, p);
    elev = leftY * (1 - t) + elev * t;
  }

  // Transisi mulus menuju teras altar akhir (x: 1220 .. 1340)
  if (x >= 1220 && x < 1340) {
    const t = (x - 1220) / 120;
    const sCurve = (1 - Math.cos(t * Math.PI)) / 2;
    elev = elev * (1 - sCurve) + 310 * sCurve;
  } else if (x >= 1340) {
    elev = 310;
  }

  return elev;
}

// ── PENGUPDATE PROFIL MEDAN DINAMIS PENUMBUKAN KONVERGEN (AREA 7) ──
export function updateConvergentGroundProfile(
  zone: ZoneConfig,
  progress: number,
  mode: 'land' | 'ocean' = 'land',
): void {
  if (!zone.groundProfile || zone.id !== 'convergent') return;
  const p = Math.max(0, Math.min(1, progress));

  for (let x = 0; x < zone.groundProfile.length; x++) {
    zone.groundProfile[x] = getConvergentTerrainElevation(x, p, mode);
  }
  snapObjectsToGround(zone);
}

// ── AREA 8: BATAS TRANSFORM (SESAR SAN ANDREAS — SUDUT PANDANG ATAS / TOP-DOWN) ──
function buildTransformZone(): ZoneConfig {
  const transformCols = 48; // 1.536 px (map gurun luas)
  const mapWidthPx = transformCols * TILE;
  const tiles: number[][] = [];
  for (let r = 0; r < ROWS; r++) {
    tiles.push(new Array(transformCols).fill(T.AIR));
  }

  // Profil dasar untuk kompatibilitas sistem koordinat
  const groundProfile = new Array<number>(mapWidthPx).fill(430);
  const ceilingProfile = new Array<number>(mapWidthPx).fill(60);

  const objects: MapObject[] = [
    // 1. Portal Naik kembali ke Batas Konvergen (sisi barat / kiri pada tanah solid)
    {
      type: 'portal_up',
      px: 80,
      py: 310,
      x: 2,
      y: 9,
      id: 'trans_portal_up',
    },
    // 3. Kristal Geologi 1 (di Lempeng Pasifik utara)
    {
      type: 'crystal',
      px: 380,
      py: 140,
      x: 11,
      y: 4,
      id: 'trans_crystal_1',
    },
    // 4. NPC 2: Ican (Pengawas Deformasi & Patahan Batuan)
    {
      type: 'npc',
      px: 560,
      py: 170,
      x: 17,
      y: 5,
      id: 'z7_npc_ican',
      data: {
        npcType: 'ican',
        name: 'Ican',
        dialogueId: 'z7_ican_dialogue',
      },
    },
    // 5. Kristal Geologi 2 (di Lempeng Amerika Utara selatan, aman di tanah solid)
    {
      type: 'crystal',
      px: 720,
      py: 310,
      x: 22,
      y: 9,
      id: 'trans_crystal_2',
    },
    // 6. NPC 3: Zahra (Meneliti Sesar San Andreas & Wallace Creek)
    {
      type: 'npc',
      px: 880,
      py: 160,
      x: 27,
      y: 5,
      id: 'z7_npc_zahra',
      data: {
        npcType: 'zahra',
        name: 'Zahra',
        dialogueId: 'z7_zahra_dialogue',
        hasMaterial: true,
        discoveryId: 16,
        discoveryKey: 'trans_sanandreas',
        isDiscoveryNpc: true,
      },
    },
    // 7. Kristal Geologi 3 (di Lempeng Amerika Utara selatan)
    {
      type: 'crystal',
      px: 1040,
      py: 330,
      x: 32,
      y: 10,
      id: 'trans_crystal_3',
    },
    // 8. NPC 4: Bu Tyas (Evaluator Akhir Level 1 & Penjaga Kapsul Evakuasi)
    {
      type: 'npc',
      px: 1360,
      py: 315,
      x: 42,
      y: 9,
      id: 'z7_npc_bu_tyas',
      data: {
        npcType: 'bu_tyas',
        name: 'Bu Tyas',
        dialogueId: 'z7_bu_tyas_dialogue',
        isGateNpc: true,
        gateId: 'transform_challenge',
        challengeId: 'transform_challenge',
      },
    },
    // 12. Kapsul Evakuasi Kemenangan Akhir Level 1 (di tanah solid selatan)
    {
      type: 'portal_down',
      px: 1470,
      py: 310,
      x: 46,
      y: 9,
      id: 'trans_portal_exit',
    },
  ];

  return {
    id: 'transform',
    name: 'Batas Transform',
    depthLabel: '',
    temperature: '',
    pressure: '',
    cols: transformCols,
    rows: ROWS,
    tiles,
    groundProfile,
    ceilingProfile,
    platforms: [],
    objects,
    playerSpawnX: 120,
    playerSpawnY: 310,
  };
}

export function updateTransformGroundProfile(_zone: ZoneConfig, _progress: number): void {
  // Pada zona transform (top-down view), pergeseran lempeng dianimasikan langsung pada kanvas
}


// ══════════════════════════════════════════════════════════════════════════
// SNAP OBJECTS TO GROUND PROFILE (Eliminate Floating Objects)
// ══════════════════════════════════════════════════════════════════════════
// Each object type has a visual height offset. The object's py is set so that
// its bottom edge sits exactly on the ground surface.
const OBJECT_HEIGHTS: Record<ObjType, number> = {
  info_sign: 32,
  discovery: 34,
  crystal: 24,
  challenge_gate: 36,
  portal_down: 36,
  portal_up: 36,
  npc: 0, // Telapak kaki NPC menempel tepat pada elevasi tanah (surfaceY)
};

function snapObjectsToGround(zone: ZoneConfig): void {
  if (zone.id === 'transform') {
    // Pada zona transform (POV dari atas / top-down), py adalah posisi 2D di bidang gurun,
    // tidak boleh di-override oleh elevasi kontur samping!
    return;
  }
  const gProf = zone.groundProfile;
  if (!gProf) return;
  const maxW = gProf.length;

  for (const obj of zone.objects) {
    if (obj.px === undefined) continue;
    const clampedX = Math.max(0, Math.min(maxW - 1, Math.floor(obj.px + TILE / 2)));
    let surfaceY = gProf[clampedX] ?? 360;

    // Check if there is a platform at this X position that is ABOVE ground
    if (zone.platforms) {
      for (const plat of zone.platforms) {
        if (clampedX >= plat.x1 && clampedX <= plat.x2 && plat.y < surfaceY) {
          // If the object was placed near or above the platform level, snap to platform deck
          if (obj.py !== undefined && Math.abs(obj.py - plat.y) < 70) {
            surfaceY = plat.y;
            break;
          }
        }
      }
    }

    // Di Batas Divergen (Area 6): NPC penyelam mengambang di air (~42px di atas dasar lempeng)
    if (zone.id === 'divergent' && obj.type === 'npc') {
      obj.py = surfaceY - 42;
    } else {
      const objH = OBJECT_HEIGHTS[obj.type] ?? TILE;
      obj.py = surfaceY - objH;
    }
  }
}

// Snap platforms (bridges & scaffolds) to the ground at their endpoints
function snapPlatformsToGround(zone: ZoneConfig): void {
  const gProf = zone.groundProfile;
  if (!gProf || !zone.platforms) return;
  const maxW = gProf.length;

  for (const plat of zone.platforms) {
    const gY1 = gProf[Math.min(maxW - 1, Math.floor(plat.x1))] ?? 360;
    const gY2 = gProf[Math.min(maxW - 1, Math.floor(plat.x2))] ?? 360;

    if (plat.type === 'wood_bridge') {
      // Bridge deck rests flush with higher cliff shoulder
      plat.y = Math.min(gY1, gY2);
    } else if (plat.type === 'scaffold') {
      // Mining scaffold deck rests flush with upper rock terrace
      plat.y = gY1;
    } else if (plat.type === 'crystal_bridge') {
      // Energy crystal bridge spans between the two metallic promontories
      plat.y = Math.min(gY1, gY2);
    } else if (plat.type === 'cooled_crust') {
      // Cooled crust bridge sits flush with the canyon lip
      plat.y = Math.min(gY1, gY2);
    }
  }
}

// ══════════════════════════════════════════════════════════════════════════
// EXPORTED ZONE REGISTRY & QUERIES
// ══════════════════════════════════════════════════════════════════════════
function buildAndSnap(buildFn: () => ZoneConfig): ZoneConfig {
  const zone = buildFn();
  snapPlatformsToGround(zone); // 1. Snap platforms terlebih dahulu agar posisi platform.y sudah final
  snapObjectsToGround(zone);   // 2. Snap objects agar menempel tepat di atas permukaan platform yang sudah final
  return zone;
}

export const ZONES: ZoneConfig[] = [
  buildAndSnap(buildSurface),
  buildAndSnap(buildCrust),
  buildAndSnap(buildMantle),
  buildAndSnap(buildOuterCore),
  buildAndSnap(buildInnerCore),
  buildAndSnap(buildDivergentZone),
  buildAndSnap(buildConvergentZone),
  buildAndSnap(buildTransformZone),
];

export function getZone(index: number): ZoneConfig {
  return ZONES[Math.max(0, Math.min(index, ZONES.length - 1))];
}

export function getGroundY(zone: ZoneConfig, x: number): number {
  const maxW = zone.groundProfile ? zone.groundProfile.length : zone.cols * TILE;
  const px = Math.max(0, Math.min(maxW - 1, Math.floor(x)));
  return zone.groundProfile ? zone.groundProfile[px] : 360;
}

export function getCeilingY(zone: ZoneConfig, x: number): number {
  const maxW = zone.ceilingProfile ? zone.ceilingProfile.length : zone.cols * TILE;
  const px = Math.max(0, Math.min(maxW - 1, Math.floor(x)));
  return zone.ceilingProfile ? zone.ceilingProfile[px] : 0;
}

export function getObjectPos(obj: MapObject): { x: number; y: number } {
  return {
    x: obj.px !== undefined ? obj.px : obj.x * TILE + TILE / 2,
    y: obj.py !== undefined ? obj.py : obj.y * TILE + TILE / 2,
  };
}

// ── COLLISION HELPERS (Backwards Compatibility) ──
export function isSolid(zone: ZoneConfig, col: number, row: number): boolean {
  if (col < 0 || col >= zone.cols || row < 0 || row >= zone.rows) return true;
  const t = zone.tiles[row]?.[col];
  return t === T.GROUND || t === T.WALL || t === T.GROUND_VAR;
}

export function tileAtPx(zone: ZoneConfig, px: number, py: number): number {
  const col = Math.floor(px / TILE);
  const row = Math.floor(py / TILE);
  if (col < 0 || col >= zone.cols || row < 0 || row >= zone.rows) return T.WALL;
  return zone.tiles[row][col];
}

// ── IKAN-IKAN LAUT AREA 6 (BATAS DIVERGEN) ──
export interface DivergentFish {
  id: number;
  x: number;
  y: number;
  baseY: number;
  vx: number;
  dir: 'left' | 'right';
  color: string;
  accentColor: string;
  size: number;
}

export function createInitialDivergentFish(): DivergentFish[] {
  return [
    { id: 1, x: 180, y: 110, baseY: 110, vx: 0.7, dir: 'right', color: '#f97316', accentColor: '#ffffff', size: 14 },
    { id: 2, x: 280, y: 80, baseY: 80, vx: -0.6, dir: 'left', color: '#0284c7', accentColor: '#facc15', size: 16 },
    { id: 3, x: 380, y: 145, baseY: 145, vx: 0.8, dir: 'right', color: '#eab308', accentColor: '#ffffff', size: 12 },
    { id: 4, x: 540, y: 90, baseY: 90, vx: -0.7, dir: 'left', color: '#06b6d4', accentColor: '#38bdf8', size: 15 },
    { id: 5, x: 670, y: 130, baseY: 130, vx: 0.6, dir: 'right', color: '#f43f5e', accentColor: '#fda4af', size: 13 },
    { id: 6, x: 820, y: 95, baseY: 95, vx: -0.8, dir: 'left', color: '#10b981', accentColor: '#a7f3d0', size: 14 },
    { id: 7, x: 980, y: 125, baseY: 125, vx: 0.7, dir: 'right', color: '#a855f7', accentColor: '#e9d5ff', size: 15 },
    { id: 8, x: 1120, y: 105, baseY: 105, vx: -0.6, dir: 'left', color: '#38bdf8', accentColor: '#ffffff', size: 13 },
  ];
}
