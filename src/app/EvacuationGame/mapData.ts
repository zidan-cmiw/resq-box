// ── mapData.ts ─────────────────────────────────────────────────────
// Representasi peta diorama RESQ-BOX — Desa Pegunungan
// Layout: Gunung vulkanik (kiri-atas), lereng hutan pinus, sungai mengalir,
// desa di lembah (rumah kayu, mushola), sawah, jalur evakuasi, titik kumpul.

export const TILE = {
  VOID: 0,       // Kosong / diluar peta
  GRASS: 1,      // Rumput
  VOLCANO: 2,    // Area gunung berapi (berbahaya)
  PATH: 3,       // Jalur evakuasi (jalan setapak berbatu)
  PINE: 4,       // Pohon pinus (khas pegunungan)
  HOUSE: 5,      // Rumah desa kecil (kayu/bambu)
  MUSHOLA: 6,    // Mushola/langgar desa
  SAFE_ZONE: 7,  // Titik kumpul (zona aman — lapangan terbuka)
  GATE: 8,       // Gerbang evakuasi (jembatan kayu)
  LAVA: 9,       // Aliran lava / awan panas
  DIRT_ROAD: 10, // Jalan tanah/berbatu
  RIVER: 11,     // Sungai
  BRIDGE: 12,    // Jembatan kayu
  FARM: 13,      // Sawah/ladang
  ROCK: 14,      // Batu besar
  TENT: 15,      // Tenda pengungsian
  SCHOOL: 16,    // Sekolah (SD/SMP)
} as const;

export type TileType = typeof TILE[keyof typeof TILE];

// Grid 24x36 — Desa Pegunungan
// Legend: 0=void,1=grass,2=volcano,3=path,4=pine,5=house,6=mushola
//         7=safe_zone,8=gate,9=lava,10=dirt_road,11=river,12=bridge
//         13=farm,14=rock, 15=tent, 16=school
const BASE_MAP: TileType[][] = [
  //col: 0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35
  [  9, 9, 9, 2, 4, 4, 4, 4, 4, 4, 4, 1, 4, 4, 4, 4, 4, 4, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4], // 0
  [  9, 9, 2, 2, 9, 4, 4, 4, 4, 4, 4, 4, 1, 4, 4, 4, 4, 4, 4, 1, 4, 4, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4], // 1
  [  9, 2, 2, 2, 9, 1, 4, 4, 4, 4, 4, 1, 4, 4, 4, 4,13,13,13, 1, 4, 4, 4, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4], // 2
  [  9, 2, 2, 2, 9, 3, 4, 4, 4, 4, 4, 1, 1, 1, 1,13,13,13,13, 1, 4, 4, 4, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4], // 3
  [  4, 9, 2, 9, 3, 3, 4, 4, 4, 4,14, 1, 1, 1, 1,13,13,13,13, 1, 4, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4], // 4
  [  4, 4, 9, 3, 3, 4, 4, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1,11,11,11,11,11,11,11, 4, 4, 4, 4, 4, 4, 4, 4, 4], // 5 river
  [  4, 3, 3, 4, 4, 4, 1, 1, 1, 5, 1, 1, 1, 5, 1, 1, 1, 1, 1,11,11, 1, 1, 1, 1, 1,11,11, 4, 4, 4, 4, 4, 4, 4, 4], // 6
  [  3, 3, 4, 4, 4, 1, 1, 5, 1, 5, 1, 1, 5, 5, 1,10,10,10,10,11, 1, 5, 1, 1, 5, 1, 1,11, 1, 4, 4, 4, 4, 4, 4, 4], // 7 road
  [  3, 4, 4, 4, 1, 1, 5, 1, 5, 1, 5, 1, 1, 1,10, 1, 1, 1, 1, 1, 1, 5, 1, 5, 5, 1, 1,11,11, 1, 4, 4, 4, 4, 4, 4], // 8
  [  1, 1, 1,14, 1, 1, 1, 5, 1, 6, 1, 5, 1, 1,10, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 1, 1,11,11, 1, 4, 4, 4, 4, 4], // 9 mushola
  [ 10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10], // 10 main road
  [  1, 1, 5, 1, 5, 1, 1, 1,13,13,13, 1, 5, 1,10, 1, 1, 5, 1, 5, 1, 1, 5, 1, 1, 1, 1, 1, 1,11, 1, 1, 1, 4, 4, 4], // 11
  [  1, 5, 5, 1, 5, 1, 5, 1,13,13,13, 1, 1, 5,10, 5, 1, 1, 5, 1, 6, 1, 1, 5, 1, 1, 1, 1, 1,11,11, 1, 1, 4, 4, 4], // 12 mushola
  [  4, 1, 5, 1, 1, 5, 1, 5, 1,13,13, 1, 5, 1,10, 1, 5, 1, 1, 5, 1, 5, 1, 1, 5, 1, 1, 1, 1, 1,11,11, 1, 1, 4, 4], // 13
  [  4, 1, 1, 5, 1, 1, 5, 1, 1, 1, 1, 5, 1, 5,10, 1, 1, 5, 5, 1, 1, 5, 5, 1, 1, 1, 1, 4, 1, 1, 1,11, 4, 4, 4, 4], // 14
  [  1, 1, 5, 1, 5, 1, 1, 5, 5, 1, 5, 1, 5, 1,10, 5, 1, 1, 1, 5, 1, 1, 5, 1, 1, 4, 4, 4, 4, 1, 1,11, 4, 4, 4, 4], // 15
  [ 10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10], // 16 main road
  [  1, 1, 1, 5, 5, 1, 1, 1, 5, 1, 5, 1, 1, 5, 1, 1, 5, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 1, 1, 1,11, 1, 1, 1, 4], // 17
  [  1, 5, 1, 1, 5, 1, 5, 5, 1,16, 1, 5, 1, 1, 5, 1, 1, 5, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 1, 1,11,11, 1, 1, 1, 4], // 18 school
  [  1, 1, 5, 1, 1, 5, 1, 5, 1, 1, 5, 1, 5, 1, 1, 5, 1, 1, 1,14, 1, 1, 1, 1, 1, 4, 4, 4, 1, 1,11, 1, 1, 1, 4, 4], // 19 (cleared pines around gate)
  [  4, 1, 1, 1, 1, 1, 1, 1, 1, 5, 1, 1, 1, 5, 1, 1, 1, 1, 4, 4, 4, 1, 1, 1, 8, 7, 7, 4, 1,11,11, 1, 1, 4, 4, 4], // 20 gate (cleared pines)
  [  4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4,15, 7, 7,15,15, 4,11, 1, 1, 4, 4, 4, 4], // 21 safe zone
  [  4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4,15, 7, 7, 7,15, 4, 4, 4, 4, 4, 4, 4, 4], // 22 safe zone
  [  4, 4, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,15,15, 7,15,15, 4, 4, 4, 4, 4, 4, 4, 4], // 23 safe zone
];

export const MAP_ROWS = 48;
export const MAP_COLS = 72;

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

// Gate position (scaled 2x from base row 20, col 24)
export const EVACUATION_GATE: [number, number] = [40, 48];

export const NPC_SPAWN_POINTS: [number, number][] = [];
export const GATE_POSITION: [number, number] = [40, 48];

// Tile yang bisa dilewati NPC (tenda tidak bisa dilewati, hanya safe_zone/rumput di tengah)
export const WALKABLE_TILES: TileType[] = [
  TILE.GRASS, TILE.PATH, TILE.DIRT_ROAD, TILE.SAFE_ZONE, TILE.BRIDGE, TILE.FARM,
];

// ══════════════════════════════════════════════════════════════════════════
// TITIK AWAL WARGA
// ══════════════════════════════════════════════════════════════════════════
//
// Diletakkan di AKHIR berkas karena pemeriksaan "dapat dilewati" memakai
// WALKABLE_TILES yang baru didefinisikan di atas.
//
// Sebelumnya titik awal warga dikocok acak:
//     possibleSpawns.sort(() => Math.random() - 0.5);
//
// Dua masalah pada cara itu:
//
//   1. Pengocokan dengan pembanding acak itu BIAS, dan hasilnya BERUBAH setiap
//      kali halaman dimuat - sehingga perilaku warga tidak dapat diulang maupun
//      diuji dengan andal.
//   2. Petak yang terpilih bisa berada di kantong yang TERPUTUS dari titik
//      kumpul. Warga di sana mustahil mengungsi: ia berdiri diam atau
//      berputar-putar, dan tampak "ngaco" tanpa sebab yang jelas.
//
// Sekarang hanya petak yang terbukti tersambung ke titik kumpul yang dipakai,
// dengan penelusuran sederhana (BFS) dan urutan yang TETAP.
const petakTersambungKeTitikKumpul = (() => {
  const bisaDilewati = (r: number, c: number) => {
    const t = MAP_DATA[r][c] as TileType;
    // Gerbang IKUT dianggap dapat dilewati.
    //
    // `TILE.GATE` sengaja tidak ada di WALKABLE_TILES karena penelusur jalur
    // menanganinya terpisah lewat parameter `gateOpen`. Akibatnya gerbang adalah
    // satu-satunya penghubung desa ke titik kumpul, dan penelusuran yang tidak
    // mengikutkannya akan berhenti di situ - tidak menemukan satu petak pun.
    //
    // Yang diperiksa di sini adalah keterjangkauan SAAT GERBANG TERBUKA, yaitu
    // keadaan evakuasi yang sebenarnya.
    return WALKABLE_TILES.includes(t) || t === TILE.GATE;
  };

  const terlihat = new Set<string>();
  const antre: [number, number][] = [];
  for (const [r, c] of SAFE_ZONE_TILES) {
    terlihat.add(`${r},${c}`);
    antre.push([r, c]);
  }

  while (antre.length > 0) {
    const [r, c] = antre.pop() as [number, number];
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nc < 0 || nr >= MAP_ROWS || nc >= MAP_COLS) continue;
      const kunci = `${nr},${nc}`;
      if (terlihat.has(kunci) || !bisaDilewati(nr, nc)) continue;
      terlihat.add(kunci);
      antre.push([nr, nc]);
    }
  }
  return terlihat;
})();

const kandidatTitikAwal: [number, number][] = [];
for (let r = 12; r < MAP_ROWS - 10; r++) {
  for (let c = 0; c < MAP_COLS - 20; c++) {
    if (MAP_DATA[r][c] === TILE.GRASS && petakTersambungKeTitikKumpul.has(`${r},${c}`)) {
      kandidatTitikAwal.push([r, c]);
    }
  }
}

// Sebarkan merata dengan langkah tetap - bukan acak - supaya hasilnya sama
// setiap kali halaman dimuat.
const JUMLAH_WARGA = 50;
const langkahSebar = Math.max(1, Math.floor(kandidatTitikAwal.length / JUMLAH_WARGA));
for (let i = 0; i < JUMLAH_WARGA && i * langkahSebar < kandidatTitikAwal.length; i++) {
  NPC_SPAWN_POINTS.push(kandidatTitikAwal[i * langkahSebar]);
}
