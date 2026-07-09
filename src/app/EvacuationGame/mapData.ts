// ── mapData.ts ─────────────────────────────────────────────────────
// Representasi peta diorama RESQ-BOX dalam bentuk grid isometrik.
// Terinspirasi dari layout diorama: Gunung Merapi (kiri-atas),
// jalur evakuasi (hijau), desa (kanan-bawah), titik kumpul (pojok kanan).

export const TILE = {
  VOID: 0,       // Kosong / diluar peta
  GRASS: 1,      // Rumput
  VOLCANO: 2,    // Area gunung berapi (berbahaya)
  PATH: 3,       // Jalur evakuasi (jalan setapak)
  TREE: 4,       // Pohon / hutan
  HOUSE: 5,      // Rumah warga
  SCHOOL: 6,     // Sekolah
  SAFE_ZONE: 7,  // Titik kumpul (zona aman)
  GATE: 8,       // Gerbang evakuasi (terbuka/tertutup berdasarkan Servo)
  LAVA: 9,       // Aliran lahar/lava
  ROAD: 10,      // Jalan utama
} as const;

export type TileType = typeof TILE[keyof typeof TILE];

// Grid 16x24 (solid rectangle)
const BASE_MAP: TileType[][] = [
  [ 9,9,9,9,1,1,1,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [ 9,9,2,9,1,1,1,1,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [ 9,2,2,2,9,1,1,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [ 9,2,2,2,9,1,1,1,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [ 1,9,2,9,3,3,1,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [ 1,1,9,3,3,3,4,1,1,1,4,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [ 1,1,3,3,1,1,1,1,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [ 1,3,3,1,1,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [ 1,3,1,1,4,1,1,1,1,1,1,5,1,1,1,1,1,1,1,1,1,1,1,1],
  [ 3,3,1,1,1,1,4,1,1,1,5,5,1,1,1,1,1,1,1,1,1,1,1,1],
  [ 3,1,1,4,1,1,1,1,1,5,5,5,1,1,4,1,1,1,1,1,1,1,1,1],
  [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10],
  [ 1,1,1,4,1,1,5,1,1,5,5,1,1,4,1,1,1,4,4,4,4,4,4,4],
  [ 1,1,4,1,1,1,5,5,1,1,5,5,1,1,1,1,6,4,7,7,7,7,7,4],
  [ 1,4,1,1,1,1,1,5,5,1,1,5,5,1,1,6,6,8,7,7,7,7,7,4],
  [ 1,1,1,4,1,1,1,1,5,5,1,1,5,1,6,6,6,4,7,7,7,7,7,4],
];

export const MAP_ROWS = 32;
export const MAP_COLS = 48;

// Scale map 2x
export const MAP_DATA: TileType[][] = [];
for (let r = 0; r < MAP_ROWS; r++) {
  const row: TileType[] = [];
  for (let c = 0; c < MAP_COLS; c++) {
    row.push(BASE_MAP[Math.floor(r / 2)][Math.floor(c / 2)]);
  }
  MAP_DATA.push(row);
}

export const SAFE_ZONE_TILES: [number, number][] = [];
for (let r = 0; r < MAP_ROWS; r++) {
  for (let c = 0; c < MAP_COLS; c++) {
    if (MAP_DATA[r][c] === TILE.SAFE_ZONE) {
      SAFE_ZONE_TILES.push([r, c]);
    }
  }
}

export const EVACUATION_GATE: [number, number] = [28, 34];

export const NPC_SPAWN_POINTS: [number, number][] = [];
const possibleSpawns: [number, number][] = [];
for (let r = 16; r < MAP_ROWS - 1; r++) {
  for (let c = 12; c < MAP_COLS - 8; c++) {
    if (MAP_DATA[r][c] === TILE.GRASS) {
      possibleSpawns.push([r, c]);
    }
  }
}
possibleSpawns.sort(() => Math.random() - 0.5);
for (let i = 0; i < 30; i++) {
  if (possibleSpawns[i]) NPC_SPAWN_POINTS.push(possibleSpawns[i]);
}

export const GATE_POSITION: [number, number] = [28, 34];

// Tile yang bisa dilewati NPC
export const WALKABLE_TILES: TileType[] = [
  TILE.GRASS, TILE.PATH, TILE.ROAD, TILE.SAFE_ZONE,
];
