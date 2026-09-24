// ── src/app/Level1/EarthDive/engine/zones.ts ─────────────────────────────
// Definisi 5 zona geologi bumi dengan kontur medan organik kontinu
// (Continuous Ground & Ceiling Profile ala Terraria & TheoTown)
// Menghilangkan tangga piramida kotak 32px kaku secara tuntas.

export const TILE = 32;

// ── TILE TYPE IDS (Backwards Compatibility) ──
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
        npcType: 'prof_raditya',
        name: 'Prof. Raditya',
        dialogueId: 'prof_raditya_dialogue',
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
      px: 920, py: 293, // Berdiri di atas jembatan kayu mendekati rig bor
      x: 29, y: 9,
      id: 'npc_maya',
      data: {
        npcType: 'kapten_maya',
        name: 'Kapten Maya',
        dialogueId: 'kapten_maya_dialogue',
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
        npcType: 'dr_gea',
        name: 'Dr. Gea',
        dialogueId: 'dr_gea_dialogue',
      },
    },
    {
      type: 'npc',
      px: 540, py: 263,
      x: 17, y: 8,
      id: 'npc_andini',
      data: {
        npcType: 'prof_andini',
        name: 'Prof. Andini',
        dialogueId: 'prof_andini_dialogue',
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
        npcType: 'inspektur_budi',
        name: 'Inspektur Budi',
        dialogueId: 'inspektur_budi_dialogue',
      },
    },
    {
      type: 'npc',
      px: 1080, py: 288,
      x: 34, y: 9,
      id: 'npc_hendra',
      data: {
        npcType: 'komandan_hendra',
        name: 'Komandan Hendra',
        dialogueId: 'komandan_hendra_dialogue',
        isGateNpc: true,
        gateId: 'crust_challenge',
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
  // Menghilangkan kemiringan di bawah kaki instrumen/papan agar menempel 100% tanpa melayang/melesak
  const groundPoints: [number, number][] = [
    [0, 360],
    [160, 360],    // Area spawn & portal up (px=70)
    [210, 320],    // Tanjakan ke Teras Silikat 1
    [360, 320],    // Teras Datar Silikat 1: menampung discovery 1 (px=260) & info_sign 1 (px=310)
    [410, 400],    // Tebing patahan curam turun ke Jurang Magma 1
    [530, 400],    // Dasar Jurang Magma 1
    [590, 320],    // Tebing naik ke Pematang Bridgmanite Tengah
    [780, 320],    // Teras Datar Tengah: menampung crystal (px=680) & discovery 2 (px=730)
    [830, 400],    // Tebing patahan curam turun ke Jurang Magma 2
    [940, 400],    // Dasar Jurang Magma 2
    [990, 330],    // Tebing naik ke Teras Gerbang Seismik
    [1280, 330],   // Teras Datar Akhir: menampung info_sign 2 (px=1020), challenge_gate (px=1120), portal_down (px=1220)
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

  // Pilar struktur mineral silikat masif (Bridgmanite Monoliths) melintasi jurang magma
  const platforms: Platform[] = [
    { x1: 430, x2: 520, y: 350, h: 14, type: 'basalt_pillar' },
    { x1: 840, x2: 930, y: 350, h: 14, type: 'basalt_pillar' },
  ];

  const objects: MapObject[] = [
    { type: 'portal_up', px: 70, py: 328, x: 2, y: 10, id: 'mantle_portal_up' },
    {
      type: 'npc',
      px: 260, py: 288,
      x: 8, y: 9,
      id: 'npc_bayu',
      data: {
        npcType: 'dr_bayu',
        name: 'Dr. Bayu',
        dialogueId: 'dr_bayu_dialogue',
      },
    },
    {
      type: 'npc',
      px: 330, py: 288,
      x: 10, y: 9,
      id: 'npc_sarah',
      data: {
        npcType: 'prof_sarah',
        name: 'Prof. Sarah',
        dialogueId: 'prof_sarah_dialogue',
        isDiscoveryNpc: true,
        discoveryId: 4,
        discoveryKey: 'mantle_disc1',
      },
    },
    {
      type: 'crystal',
      px: 680, py: 296,
      x: 21, y: 9,
      id: 'mantle_crystal',
    },
    {
      type: 'npc',
      px: 730, py: 288,
      x: 22, y: 9,
      id: 'npc_danang',
      data: {
        npcType: 'dr_danang',
        name: 'Dr. Danang',
        dialogueId: 'dr_danang_dialogue',
        isDiscoveryNpc: true,
        discoveryId: 5,
        discoveryKey: 'mantle_disc2',
      },
    },
    {
      type: 'npc',
      px: 990, py: 298,
      x: 30, y: 10,
      id: 'npc_rudi',
      data: {
        npcType: 'petugas_rudi',
        name: 'Petugas Rudi',
        dialogueId: 'petugas_rudi_dialogue',
      },
    },
    {
      type: 'npc',
      px: 1100, py: 298,
      x: 34, y: 10,
      id: 'npc_surya',
      data: {
        npcType: 'komandan_surya',
        name: 'Komandan Surya',
        dialogueId: 'komandan_surya_dialogue',
        isGateNpc: true,
        gateId: 'mantle_challenge',
      },
    },
    {
      type: 'portal_down',
      px: 1220, py: 298,
      x: 38, y: 10,
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
      { x: 400, y: 370, w: 160, h: 50, damage: 25, type: 'molten_lava' },
      { x: 820, y: 370, w: 150, h: 50, damage: 25, type: 'molten_lava' },
    ],
    playerSpawnX: 80,
    playerSpawnY: 360,
  };
}

// ══════════════════════════════════════════════════════════════════════════
// ZONA 3: INTI LUAR (Lautan Logam Cair & Dinamo Medan Magnet Bumi)
// ══════════════════════════════════════════════════════════════════════════
function buildOuterCore(): ZoneConfig {
  // Profil tanah Inti Luar: Teras-teras pelat logam padat mengapung di atas samudra besi-nikel cair
  // Semua titik penempatan objek berada di atas platform datar sempurna (y1 == y2) agar menapak rata 100%
  const groundPoints: [number, number][] = [
    [0, 360],
    [160, 360],    // Area spawn & elevator naik (px=70)
    [210, 310],    // Tanjakan pelat logam padat 1
    [380, 310],    // Teras Pelat Logam 1: discovery 1 (px=270) & info_sign 1 (px=330)
    [390, 310],    // Tebing barat Chasm 1 tempat tumpuan jembatan kristal
    [415, 400],    // Dinding curam turun ke Samudra Logam Cair 1
    [545, 400],    // Dasar Samudra Logam Cair 1
    [570, 310],    // Tebing timur Chasm 1 tempat tumpuan jembatan kristal
    [590, 310],    // Pematang Pelat Logam Tengah
    [780, 310],    // Teras Pelat Logam Tengah: crystal (px=680) & discovery 2 (px=730)
    [790, 310],    // Tebing barat Chasm 2 tempat tumpuan jembatan kristal
    [815, 400],    // Dinding curam turun ke Samudra Logam Cair 2
    [945, 400],    // Dasar Samudra Logam Cair 2
    [970, 310],    // Tebing timur Chasm 2 tempat tumpuan jembatan kristal
    [1010, 330],   // Tanjakan halus ke Teras Gerbang Seismik Inti
    [1280, 330],   // Teras Pelat Logam Akhir: info_sign 2 (px=1020), challenge_gate (px=1120), portal_down (px=1220)
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

  // Pelat logam terapung elektromagnetik yang menjembatani samudra besi-nikel cair melintasi tebing
  const platforms: Platform[] = [
    { x1: 390, x2: 570, y: 310, h: 12, type: 'crystal_bridge' },
    { x1: 790, x2: 970, y: 310, h: 12, type: 'crystal_bridge' },
  ];

  const objects: MapObject[] = [
    { type: 'portal_up', px: 70, py: 324, x: 2, y: 10, id: 'oc_portal_up' },
    {
      type: 'npc',
      px: 270, py: 276,
      x: 8, y: 9,
      id: 'npc_fajar',
      data: {
        npcType: 'dr_fajar',
        name: 'Dr. Fajar',
        dialogueId: 'dr_fajar_dialogue',
      },
    },
    {
      type: 'npc',
      px: 330, py: 276,
      x: 10, y: 9,
      id: 'npc_ratna',
      data: {
        npcType: 'prof_ratna',
        name: 'Prof. Ratna',
        dialogueId: 'prof_ratna_dialogue',
        isDiscoveryNpc: true,
        discoveryId: 6,
        discoveryKey: 'oc_disc1',
      },
    },
    {
      type: 'crystal',
      px: 680, py: 286,
      x: 21, y: 9,
      id: 'oc_crystal',
    },
    {
      type: 'npc',
      px: 730, py: 276,
      x: 22, y: 9,
      id: 'npc_aris',
      data: {
        npcType: 'dr_aris',
        name: 'Dr. Aris',
        dialogueId: 'dr_aris_dialogue',
        isDiscoveryNpc: true,
        discoveryId: 7,
        discoveryKey: 'oc_disc2',
      },
    },
    {
      type: 'npc',
      px: 1020, py: 298,
      x: 31, y: 10,
      id: 'npc_joko',
      data: {
        npcType: 'petugas_joko',
        name: 'Petugas Joko',
        dialogueId: 'petugas_joko_dialogue',
      },
    },
    {
      type: 'npc',
      px: 1120, py: 294,
      x: 35, y: 9,
      id: 'npc_teguh',
      data: {
        npcType: 'komandan_teguh',
        name: 'Komandan Teguh',
        dialogueId: 'komandan_teguh_dialogue',
        isGateNpc: true,
        challengeId: 'oc_challenge',
      },
    },
    {
      type: 'portal_down',
      px: 1220, py: 294,
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
    hazards: [
      { x: 400, y: 370, w: 160, h: 50, damage: 25, type: 'molten_lava' },
      { x: 810, y: 370, w: 160, h: 50, damage: 25, type: 'molten_lava' },
    ],
    playerSpawnX: 80,
    playerSpawnY: 360,
  };
}

// ══════════════════════════════════════════════════════════════════════════
// ZONA 4: INTI DALAM (Istana Kristal Logam Heksagonal Padat 6.000°C - 6.371 KM)
// ══════════════════════════════════════════════════════════════════════════
function buildInnerCore(): ZoneConfig {
  // Profil tanah Inti Dalam: Datar sempurna (flat solid iron-nickel sphere)
  // Bentuk bola besi padat murni tanpa ada naik-turun kontur
  const groundPoints: [number, number][] = [
    [0, 350],
    [1280, 350],
  ];

  const ceilingPoints: [number, number][] = [
    [0, 60],
    [1280, 60],
  ];

  const groundProfile = interpolateProfile(groundPoints);
  const ceilingProfile = interpolateProfile(ceilingPoints);
  const tiles = generateTilesFromProfiles(groundProfile, ceilingProfile);

  const platforms: Platform[] = [];

  const objects: MapObject[] = [
    { type: 'portal_up', px: 70, py: 314, x: 2, y: 10, id: 'ic_portal_up' },
    {
      type: 'npc',
      px: 270, py: 350,
      x: 8, y: 10,
      id: 'npc_bagus',
      data: {
        npcType: 'dr_bagus',
        name: 'Dr. Bagus',
        dialogueId: 'dr_bagus_dialogue',
      },
    },
    {
      type: 'npc',
      px: 340, py: 350,
      x: 10, y: 10,
      id: 'npc_lestari',
      data: {
        npcType: 'prof_lestari',
        name: 'Prof. Lestari',
        dialogueId: 'prof_lestari_dialogue',
        isDiscoveryNpc: true,
        discoveryId: 8,
        discoveryKey: 'ic_disc1',
      },
    },
    {
      type: 'npc',
      px: 680, py: 350,
      x: 21, y: 10,
      id: 'npc_farhan',
      data: {
        npcType: 'dr_farhan',
        name: 'Dr. Farhan',
        dialogueId: 'dr_farhan_dialogue',
        isDiscoveryNpc: true,
        discoveryId: 9,
        discoveryKey: 'ic_disc2',
      },
    },
    {
      type: 'npc',
      px: 900, py: 350,
      x: 28, y: 10,
      id: 'npc_dian',
      data: {
        npcType: 'petugas_dian',
        name: 'Petugas Dian',
        dialogueId: 'petugas_dian_dialogue',
      },
    },
    {
      type: 'npc',
      px: 1040, py: 350,
      x: 32, y: 10,
      id: 'npc_bintang',
      data: {
        npcType: 'komandan_bintang',
        name: 'Komandan Bintang',
        dialogueId: 'komandan_bintang_dialogue',
        isGateNpc: true,
        challengeId: 'ic_challenge',
      },
    },
    {
      type: 'portal_down',
      px: 1180, py: 314,
      x: 37, y: 10,
      id: 'ic_portal_exit',
    },
  ];

  return {
    id: 'innerCore',
    name: 'Inti Dalam',
    depthLabel: '5.150–6.371 km (750 mil)',
    temperature: '5.500°C – 6.000°C (Sepanas Matahari)',
    pressure: '>3,6 Juta atm (360 GPa)',
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
// 6. ZONA BATAS DIVERGEN & LEMBAH RETAKAN (EAST AFRICAN RIFT & PANGEA)
// ══════════════════════════════════════════════════════════════════════════
function buildDivergentZone(): ZoneConfig {
  // ── MAP BATAS DIVERGEN: DINAMIKA PEMEKARAN LEMPENG AKTIF & GUNDUKAN ALAMI ──
  // Peta compact (1350px) agar celah pembelahan (x: 395..505) terlihat langsung di layar saat awal masuk.
  // Tanah memiliki gundukan/bukit bergelombang alami (bukan garis datar flat).
  // Lempeng Barat (0..395) -> Celah Magma Menganga Bersih (395..505) -> Lempeng Timur (505..1350)
  const divergentWidth = 1350;
  const divergentCols = Math.ceil(divergentWidth / TILE); // 43 cols

  // Baseline profil bergelombang alami
  const groundProfile = new Array<number>(divergentWidth).fill(360);
  const ceilingProfile = new Array<number>(divergentWidth).fill(0); // Langit terbuka celah benua

  // Hitung kontur awal tanah (sebelum terbelah, tanah tersambung utuh dengan gundukan alami)
  for (let x = 0; x < divergentWidth; x++) {
    groundProfile[x] = getDivergentTerrainElevation(x, 450, 0);
  }

  const tiles = generateTilesFromProfiles(groundProfile, ceilingProfile, divergentCols, ROWS);

  // Tidak ada platform di tengah magma — celah dibuat murni menganga bersih dan dramatis
  const platforms: Platform[] = [];

  // Hazard celah magma aktif di antara dua lempeng (x: 390..510)
  const hazards: HazardArea[] = [
    { x: 390, y: 385, w: 120, h: 60, damage: 100, type: 'molten_lava' },
  ];

  const objects: MapObject[] = [
    // 1. Portal Naik ke Inti Dalam
    {
      type: 'portal_up',
      px: 60, py: 350,
      x: 2, y: 11,
      id: 'div_portal_up',
    },
    // 2. NPC 1: Dr. Taufik (Pemandu & Saksi Dinamika Pembelahan Tektonik - di puncak bukit barat)
    {
      type: 'npc',
      px: 170, py: 345,
      x: 5, y: 10,
      id: 'npc_taufik',
      data: {
        npcType: 'dr_taufik',
        name: 'Dr. Taufik',
        dialogueId: 'dr_taufik_dialogue',
      },
    },
    // 3. Kristal Geologi 1
    {
      type: 'crystal',
      px: 230, py: 310,
      x: 7, y: 9,
      id: 'div_crystal_1',
    },
    // 4. NPC 2: Prof. Maya (Ahli Pangea & Benua Purba - Temuan 10 - di lembah sebelum celah)
    {
      type: 'npc',
      px: 290, py: 355,
      x: 9, y: 11,
      id: 'npc_maya',
      data: {
        npcType: 'prof_maya',
        name: 'Prof. Maya',
        dialogueId: 'prof_maya_dialogue',
        isDiscoveryNpc: true,
        discoveryId: 10,
        discoveryKey: 'div_disc1',
      },
    },
    // (Celah Magma Divergen di x: 395..505 — Bebas dari NPC & Tanpa Platform Tengah)
    // 5. NPC 3: Dr. Citra (Peneliti Pegunungan Kembar - Temuan 11 - menyambut di seberang celah)
    {
      type: 'npc',
      px: 600, py: 355,
      x: 18, y: 11,
      id: 'npc_citra',
      data: {
        npcType: 'dr_citra',
        name: 'Dr. Citra',
        dialogueId: 'dr_citra_dialogue',
        isDiscoveryNpc: true,
        discoveryId: 11,
        discoveryKey: 'div_disc2',
      },
    },
    // 6. Kristal Geologi 2 (di lereng bukit timur)
    {
      type: 'crystal',
      px: 750, py: 300,
      x: 23, y: 9,
      id: 'div_crystal_2',
    },
    // 7. NPC 4: Prof. Ilham (Pengamat Dinamika Pemekaran Divergen - Temuan 12 - di dataran bukit timur)
    {
      type: 'npc',
      px: 880, py: 345,
      x: 27, y: 10,
      id: 'npc_ilham',
      data: {
        npcType: 'prof_ilham',
        name: 'Prof. Ilham',
        dialogueId: 'prof_ilham_dialogue',
        isDiscoveryNpc: true,
        discoveryId: 12,
        discoveryKey: 'div_disc3',
      },
    },
    // 8. Kristal Geologi 3
    {
      type: 'crystal',
      px: 1020, py: 320,
      x: 31, y: 10,
      id: 'div_crystal_3',
    },
    // 9. NPC 5: Komandan Satria (Penjaga Akses Menuju Batas Konvergen)
    {
      type: 'npc',
      px: 1140, py: 355,
      x: 35, y: 11,
      id: 'npc_satria',
      data: {
        npcType: 'komandan_satria',
        name: 'Komandan Satria',
        dialogueId: 'komandan_satria_dialogue',
        isGateNpc: true,
        gateId: 'divergent_challenge',
        challengeId: 'divergent_challenge',
      },
    },
    // 10. Portal Turun ke Batas Konvergen
    {
      type: 'portal_down',
      px: 1240, py: 355,
      x: 38, y: 11,
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
    playerSpawnY: 355,
  };
}

// ── FUNGSI ELEVASI MEDAN BERGELOMBANG ORGANIK AREA 6 (100% MULUS & KONTINU) ──
export function getDivergentTerrainElevation(x: number, splitCenter: number = 450, p: number = 1.0): number {
  const maxGap = 110;
  const gap = p * maxGap;
  const leftEdge = Math.round(splitCenter - gap / 2);
  const rightEdge = Math.round(splitCenter + gap / 2);
  const flareMax = 14 * p;

  // Jika x berada di dalam celah rekahan magma yang terbuka
  if (gap > 4 && x > leftEdge && x < rightEdge) {
    return 455; // Jurang magma di dasar
  }

  // Kontur dasar Lempeng Barat (0 .. leftEdge) — Kurva mulus kontinu tanpa patahan
  if (x <= leftEdge) {
    // Gelombang harmonik lembut: bukit landai di x~120..170, lembah di x~260..290
    const hillWave = Math.sin((x / 240) * Math.PI) * 16 + Math.sin((x / 110) * Math.PI) * 4;
    let base = 372 - hillWave;

    // Bibir tebing terangkat menganga dengan Cosine S-Curve halus
    if (x >= leftEdge - 60) {
      const t = (x - (leftEdge - 60)) / 60;
      const sCurve = (1 - Math.cos(t * Math.PI)) / 2;
      base -= sCurve * flareMax;
    }
    return Math.round(base);
  }

  // Kontur dasar Lempeng Timur (rightEdge .. 1350) — Kurva mulus kontinu tanpa patahan
  const relX = x - rightEdge;
  // Gelombang bukit harmonik: bukit tektonik di relX~240 (x~740), teras di relX~380 (x~880), dataran di relX>550
  const eastWave = Math.sin((relX / 300) * Math.PI) * 18 + Math.sin((relX / 140) * Math.PI) * 4;
  let base = 372 - eastWave;

  // Bibir tebing timur terangkat menganga dengan Cosine S-Curve halus
  if (relX <= 60) {
    const t = 1 - relX / 60;
    const sCurve = (1 - Math.cos(t * Math.PI)) / 2;
    base -= sCurve * flareMax;
  }
  return Math.round(base);
}

// ── PENGUPDATE PROFIL MEDAN DINAMIS PEMEKARAN DIVERGEN (AREA 6) ──
export function updateDivergentGroundProfile(zone: ZoneConfig, progress: number): void {
  if (!zone.groundProfile || zone.id !== 'divergent') return;
  const p = Math.max(0, Math.min(1, progress));
  const splitCenter = 450;

  for (let x = 0; x < zone.groundProfile.length; x++) {
    zone.groundProfile[x] = getDivergentTerrainElevation(x, splitCenter, p);
  }
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
    // 1. Portal Naik Kembali ke Area 6 (Batas Divergen) di perairan samudra barat
    {
      type: 'portal_up',
      px: 60, py: 360,
      x: 2, y: 11,
      id: 'conv_portal_up',
    },

    {
      type: 'crystal',
      px: 340, py: 340,
      x: 10, y: 10,
      id: 'conv_crystal_1',
    },

    {
      type: 'info_sign',
      px: 540, py: 360,
      x: 17, y: 11,
      id: 'conv_sign_dock',
      data: {
        text: '"Lempeng samudra yang lebih padat menunjam miring ke bawah lempeng benua di palung laut. Selamat datang di daratan benua, silakan teliti batuan lipatan dan gunung berapi!"',
      },
    },

    {
      type: 'npc',
      px: 620, py: 360,
      x: 19, y: 11,
      id: 'npc_farhan',
      data: {
        npcType: 'dr_farhan',
        name: 'Dr. Farhan',
        dialogueId: 'dr_farhan_conv_dialogue',
        isDiscoveryNpc: true,
        discoveryId: 13,
        discoveryKey: 'conv_disc1',
      },
    },
    // 5. Kristal Geologi 2 (di lereng bukit kaki gunung)
    {
      type: 'crystal',
      px: 780, py: 320,
      x: 24, y: 10,
      id: 'conv_crystal_2',
    },
    // 6. NPC 2: Prof. Ratna (Ahli Vulkanologi & 3 Bentang Alam Tumbukan - Temuan 14 - di lereng gunung)
    {
      type: 'npc',
      px: 840, py: 280,
      x: 26, y: 9,
      id: 'npc_ratna',
      data: {
        npcType: 'prof_ratna',
        name: 'Prof. Ratna',
        dialogueId: 'prof_ratna_conv_dialogue',
        isDiscoveryNpc: true,
        discoveryId: 14,
        discoveryKey: 'conv_disc2',
      },
    },
    // 7. NPC 3: Dr. Bayu (Peneliti Vulkanologi & Teras Batuan Andesit)
    {
      type: 'npc',
      px: 1100, py: 280,
      x: 34, y: 8,
      id: 'npc_bayu',
      data: {
        npcType: 'dr_bayu',
        name: 'Dr. Bayu',
        dialogueId: 'dr_bayu_conv_dialogue',
      },
    },
    // 8. Kristal Geologi 3 (di teras altar timur)
    {
      type: 'crystal',
      px: 1240, py: 325,
      x: 38, y: 10,
      id: 'conv_crystal_3',
    },
    // 9. NPC 4: Komandan Arya (Penjaga Akses Menuju Batas Transform)
    {
      type: 'npc',
      px: 1380, py: 345,
      x: 43, y: 10,
      id: 'npc_arya',
      data: {
        npcType: 'komandan_arya',
        name: 'Komandan Arya',
        dialogueId: 'komandan_arya_dialogue',
        isGateNpc: true,
        gateId: 'convergent_challenge',
        challengeId: 'convergent_challenge',
      },
    },
    // 10. Portal Turun ke Batas Transform di ujung Altar Konvergen
    {
      type: 'portal_down',
      px: 1470, py: 345,
      x: 46, y: 10,
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
    playerSpawnY: 360,
  };
}

// ── FUNGSI ELEVASI MEDAN DINAMIS AREA 7 (BATAS KONVERGEN) ──
export function getConvergentTerrainElevation(x: number, progress: number = 1.0): number {
  const p = Math.max(0, Math.min(1, progress));

  // 1. Zona Perairan Samudra & Palung Terisi Air Penuh (x: 0 .. 530)
  // Permukaan laut stabil di y = 360 untuk navigasi perahu riset
  if (x <= 530) {
    return 360;
  }

  // 2. Kerak Benua & Terangkatnya Gunung Berapi (x: 530 .. 1536)
  const relX = x - 530;

  // Lipatan pegunungan vulkanik (puncak di x ~ 980)
  let mountainLift = 0;
  if (x >= 740 && x <= 1220) {
    const dist = Math.abs(x - 980);
    const bell = Math.max(0, Math.cos((dist / 240) * (Math.PI / 2)));
    mountainLift = Math.pow(bell, 1.6) * 135 * p; // Naik dari y=360 ke puncak y=225
  }

  // Gelombang lipatan tektonik benua harmonik
  const foldWave = (Math.sin((relX / 160) * Math.PI) * 10 + Math.sin((relX / 80) * Math.PI) * 4) * p;

  let baseElevation = 360 - mountainLift - foldWave;

  // Transisi mulus dari pantai dermaga (x: 530 .. 570)
  if (x >= 530 && x <= 570) {
    const t = (x - 530) / 40;
    baseElevation = 360 + (baseElevation - 360) * t;
  }

  // Transisi mulus menuju teras altar akhir (x: 1220 .. 1340) — Tanpa patahan tajam
  if (x >= 1220 && x < 1340) {
    const t = (x - 1220) / 120;
    const sCurve = (1 - Math.cos(t * Math.PI)) / 2;
    baseElevation = baseElevation * (1 - sCurve) + 345 * sCurve;
  } else if (x >= 1340) {
    baseElevation = 345;
  }

  return Math.round(baseElevation);
}

// ── PENGUPDATE PROFIL MEDAN DINAMIS PENUMBUKAN KONVERGEN (AREA 7) ──
export function updateConvergentGroundProfile(zone: ZoneConfig, progress: number): void {
  if (!zone.groundProfile || zone.id !== 'convergent') return;
  const p = Math.max(0, Math.min(1, progress));

  for (let x = 0; x < zone.groundProfile.length; x++) {
    zone.groundProfile[x] = getConvergentTerrainElevation(x, p);
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
    // 2. NPC 1: Dr. Maya (Pemandu Ekspedisi Patahan Gurun)
    {
      type: 'npc',
      px: 240,
      py: 180,
      x: 7,
      y: 5,
      id: 'npc_maya_trans',
      data: {
        npcType: 'dr_maya_trans',
        name: 'Dr. Maya',
        dialogueId: 'dr_maya_trans_dialogue',
      },
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
    // 4. Titik Temuan 1: Sismograf & Bukti 20 Lempeng Tektonik (ID: 15)
    {
      type: 'discovery',
      px: 540,
      py: 320,
      x: 16,
      y: 10,
      id: 'trans_disc1',
      data: { discoveryId: 15, discoveryKey: 'trans_seismo' },
    },
    // 5. NPC 2: Prof. Sarah (Peneliti Sismograf & 20 Lempeng Bumi)
    {
      type: 'npc',
      px: 540,
      py: 320,
      x: 16,
      y: 10,
      id: 'npc_sarah_trans',
      data: {
        npcType: 'prof_sarah_trans',
        name: 'Prof. Sarah',
        dialogueId: 'prof_sarah_trans_dialogue',
        discoveryId: 15,
        discoveryKey: 'trans_seismo',
        isDiscoveryNpc: true,
      },
    },
    // 6. Kristal Geologi 2 (di Lempeng Amerika Utara selatan, aman di tanah solid)
    {
      type: 'crystal',
      px: 720,
      py: 310,
      x: 22,
      y: 9,
      id: 'trans_crystal_2',
    },
    // 7. Titik Temuan 2: Batas Transform & Sesar San Andreas (ID: 16)
    {
      type: 'discovery',
      px: 880,
      py: 160,
      x: 27,
      y: 5,
      id: 'trans_disc2',
      data: { discoveryId: 16, discoveryKey: 'trans_sanandreas' },
    },
    // 8. NPC 3: Dr. Taufik (Peneliti Sesar San Andreas & Wallace Creek)
    {
      type: 'npc',
      px: 880,
      py: 160,
      x: 27,
      y: 5,
      id: 'npc_taufik_trans',
      data: {
        npcType: 'dr_taufik_trans',
        name: 'Dr. Taufik',
        dialogueId: 'dr_taufik_trans_dialogue',
        discoveryId: 16,
        discoveryKey: 'trans_sanandreas',
        isDiscoveryNpc: true,
      },
    },
    // 9. Kristal Geologi 3 (di Lempeng Amerika Utara selatan)
    {
      type: 'crystal',
      px: 1040,
      py: 330,
      x: 32,
      y: 10,
      id: 'trans_crystal_3',
    },
    // 10. NPC 4: Petugas Rudi (Pengawas Peringatan Dini Gempa Sesar)
    {
      type: 'npc',
      px: 1180,
      py: 320,
      x: 36,
      y: 10,
      id: 'npc_rudi_trans',
      data: {
        npcType: 'petugas_rudi_trans',
        name: 'Petugas Rudi',
        dialogueId: 'petugas_rudi_trans_dialogue',
      },
    },
    // 11. NPC 5: Komandan Guntur (Kepala Pengawas Batas Transform & Pintu Akhir - di tanah solid selatan)
    {
      type: 'npc',
      px: 1360,
      py: 315,
      x: 42,
      y: 9,
      id: 'npc_guntur_trans',
      data: {
        npcType: 'komandan_guntur',
        name: 'Komandan Guntur',
        dialogueId: 'komandan_guntur_dialogue',
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

    const objH = OBJECT_HEIGHTS[obj.type] ?? TILE;
    obj.py = surfaceY - objH;
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
