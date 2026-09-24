// ── renderer.ts ───────────────────────────────────────────────────
// Merender peta isometrik Desa Pegunungan ke HTML5 Canvas.
//
// OPTIMASI: Static map (terrain + buildings) di-cache ke offscreen canvas.
// Setiap frame hanya menggambar NPCs + efek dinamis (gate glow, LED, asap gunung).

import type { TileType } from '../mapData';
import { MAP_DATA, MAP_ROWS, MAP_COLS, TILE } from '../mapData';
import type { NPC } from './npc';

export const TILE_W = 24;
export const TILE_H = 12;
export const TILE_DEPTH = 6;

// Konversi koordinat grid ke posisi layar isometrik (tanpa origin offset)
export function toScreen(row: number, col: number, originX: number, originY: number) {
  const x = originX + (col - row) * (TILE_W / 2);
  const y = originY + (col + row) * (TILE_H / 2);
  return { x, y };
}

// Warna tile — Desa Pegunungan
const TILE_COLORS: Record<TileType, { top: string; left: string; right: string }> = {
  [TILE.VOID]:      { top: 'transparent', left: 'transparent', right: 'transparent' },
  [TILE.GRASS]:     { top: '#4ade80',  left: '#16a34a',  right: '#22c55e' },
  [TILE.VOLCANO]:   { top: '#78716c',  left: '#44403c',  right: '#57534e' },
  [TILE.PATH]:      { top: '#d4a574',  left: '#8b6914',  right: '#b8860b' }, // jalan setapak berbatu
  [TILE.PINE]:      { top: '#166534',  left: '#14532d',  right: '#15803d' },
  [TILE.HOUSE]:     { top: '#d4a574',  left: '#8b6914',  right: '#b8860b' }, // placeholder, drawn as building
  [TILE.MUSHOLA]:   { top: '#fef08a',  left: '#a16207',  right: '#ca8a04' }, // placeholder
  [TILE.SAFE_ZONE]: { top: '#bbf7d0',  left: '#16a34a',  right: '#4ade80' },
  [TILE.GATE]:      { top: '#f59e0b',  left: '#92400e',  right: '#b45309' },
  [TILE.LAVA]:      { top: '#f97316',  left: '#c2410c',  right: '#ea580c' },
  [TILE.DIRT_ROAD]: { top: '#a8876a',  left: '#6b5745',  right: '#8b7355' }, // tanah
  [TILE.RIVER]:     { top: '#38bdf8',  left: '#0369a1',  right: '#0284c7' },
  [TILE.BRIDGE]:    { top: '#a16207',  left: '#713f12',  right: '#854d0e' },
  [TILE.FARM]:      { top: '#86efac',  left: '#16a34a',  right: '#22c55e' }, // sawah hijau muda
  [TILE.ROCK]:      { top: '#9ca3af',  left: '#4b5563',  right: '#6b7280' },
  [TILE.TENT]:      { top: '#f97316',  left: '#c2410c',  right: '#ea580c' },
  [TILE.SCHOOL]:    { top: '#e2e8f0',  left: '#cbd5e1',  right: '#f1f5f9' },
};

const HOUSE_PALETTES = [
  { wall: { top: '#fde68a', left: '#a16207', right: '#ca8a04' }, roof: { top: '#92400e', left: '#78350f', right: '#854d0e' } },    // kayu kuning + atap coklat
  { wall: { top: '#fed7aa', left: '#c2410c', right: '#ea580c' }, roof: { top: '#78350f', left: '#451a03', right: '#713f12' } },    // oranye muda + atap coklat tua
  { wall: { top: '#e0e7ff', left: '#4338ca', right: '#4f46e5' }, roof: { top: '#dc2626', left: '#7f1d1d', right: '#991b1b' } },    // putih biru + atap merah
  { wall: { top: '#fef9c3', left: '#a16207', right: '#d97706' }, roof: { top: '#166534', left: '#14532d', right: '#15803d' } },    // krem + atap hijau
  { wall: { top: '#fce7f3', left: '#9d174d', right: '#be185d' }, roof: { top: '#713f12', left: '#451a03', right: '#854d0e' } },    // pink muda + atap coklat
  { wall: { top: '#d1fae5', left: '#059669', right: '#10b981' }, roof: { top: '#991b1b', left: '#7f1d1d', right: '#b91c1c' } },    // hijau muda + atap merah
];

// ── Primitif drawing ─────────────────────────────────────────────
function drawTile(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  colors: { top: string; left: string; right: string },
  z: number = 0,
  depth: number = TILE_DEPTH,
) {
  const ty = y - z;

  // Top face
  ctx.beginPath();
  ctx.moveTo(x,              ty);
  ctx.lineTo(x + TILE_W / 2, ty + TILE_H / 2);
  ctx.lineTo(x,              ty + TILE_H);
  ctx.lineTo(x - TILE_W / 2, ty + TILE_H / 2);
  ctx.closePath();
  ctx.fillStyle = colors.top;
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.10)';
  ctx.lineWidth = 0.5;
  ctx.stroke();

  // Left face
  ctx.beginPath();
  ctx.moveTo(x - TILE_W / 2, ty + TILE_H / 2);
  ctx.lineTo(x,              ty + TILE_H);
  ctx.lineTo(x,              y + TILE_H + depth);
  ctx.lineTo(x - TILE_W / 2, y + TILE_H / 2 + depth);
  ctx.closePath();
  ctx.fillStyle = colors.left;
  ctx.fill();
  ctx.stroke();

  // Right face
  ctx.beginPath();
  ctx.moveTo(x,              ty + TILE_H);
  ctx.lineTo(x + TILE_W / 2, ty + TILE_H / 2);
  ctx.lineTo(x + TILE_W / 2, y + TILE_H / 2 + depth);
  ctx.lineTo(x,              y + TILE_H + depth);
  ctx.closePath();
  ctx.fillStyle = colors.right;
  ctx.fill();
  ctx.stroke();
}

function drawBuilding(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  type: TileType,
  _row: number,
  _col: number,
) {
  // Ground tile underneath
  drawTile(ctx, x, y, TILE_COLORS[TILE.GRASS], 0, 8);

  const isMushola = type === TILE.MUSHOLA;
  const isSchool = type === TILE.SCHOOL;

  if (isSchool) {
    const bHeight = 12;
    const wallColor = { top: '#f8fafc', left: '#cbd5e1', right: '#e2e8f0' };
    const roofColor = { top: '#dc2626', left: '#991b1b', right: '#b91c1c' };
    drawTile(ctx, x, y, wallColor, bHeight, 0);
    drawTile(ctx, x, y, roofColor, bHeight + 3, 3);

    const ty = y - bHeight;
    // windows
    ctx.fillStyle = '#bfdbfe';
    for (let c = 0; c < 3; c++) {
      const wx = x - 10 + (c * 5);
      const wy = ty + 3 + (c * 2);
      ctx.beginPath();
      ctx.moveTo(wx, wy); ctx.lineTo(wx + 3, wy + 1.5);
      ctx.lineTo(wx + 3, wy + 5); ctx.lineTo(wx, wy + 3.5);
      ctx.fill();
    }
    // tiang bendera
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(x, ty - 16, 1.5, 16);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(x + 1.5, ty - 15, 6, 3);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 1.5, ty - 12, 6, 3);
    return;
  }

  // Rumah desa kecil / Mushola
  const bHeight = isMushola ? 12 : 6; 

  const paletteIdx = (_row + _col * 2) % HOUSE_PALETTES.length;
  const palette = HOUSE_PALETTES[paletteIdx];

  const wallColor = isMushola
    ? { top: '#f8fafc', left: '#94a3b8', right: '#cbd5e1' }
    : palette.wall;
  
  drawTile(ctx, x, y, wallColor, bHeight, 0);

  const roofColor = isMushola
    ? { top: '#16a34a', left: '#14532d', right: '#15803d' } // green dome
    : palette.roof;
    
  if (isMushola) {
    drawTile(ctx, x, y, roofColor, bHeight + 3, 3);
    const ty = y - bHeight - 3;
    
    // Kubah utama (Main dome) - Setengah lingkaran atas
    ctx.beginPath();
    ctx.arc(x, ty, 5, Math.PI, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = '#16a34a'; // green
    ctx.fill();
    ctx.strokeStyle = '#14532d'; // dark green border
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Tiang atas kubah & bulan sabit
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(x - 0.5, ty - 8, 1, 3);
    ctx.beginPath();
    ctx.arc(x, ty - 8, 1.5, Math.PI * 1.5, Math.PI * 0.5);
    ctx.strokeStyle = '#fbbf24'; // gold
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Menara kecil (Minaret) di sebelah kanan
    ctx.fillStyle = '#f8fafc'; // white
    ctx.fillRect(x + 6, ty - 2, 2.5, 8);
    // Atap menara
    ctx.beginPath();
    ctx.moveTo(x + 5, ty - 2);
    ctx.lineTo(x + 9.5, ty - 2);
    ctx.lineTo(x + 7.25, ty - 6);
    ctx.closePath();
    ctx.fillStyle = '#16a34a';
    ctx.fill();
    
    ctx.lineWidth = 0.5; // reset

  } else {
    // Atap limas segiempat (Pyramid Roof) untuk rumah biasa
    const ty = y - bHeight;
    const roofH = 8;
    const pw = TILE_W / 2;
    const ph = TILE_H / 2;
    
    // Front-Left Face
    ctx.beginPath();
    ctx.moveTo(x - pw, ty + ph);
    ctx.lineTo(x, ty + TILE_H);
    ctx.lineTo(x, ty + ph - roofH);
    ctx.closePath();
    ctx.fillStyle = roofColor.left;
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.stroke();

    // Front-Right Face
    ctx.beginPath();
    ctx.moveTo(x + pw, ty + ph);
    ctx.lineTo(x, ty + TILE_H);
    ctx.lineTo(x, ty + ph - roofH);
    ctx.closePath();
    ctx.fillStyle = roofColor.right;
    ctx.fill();
    ctx.stroke();
  }
}

function drawTent(ctx: CanvasRenderingContext2D, x: number, y: number) {
  drawTile(ctx, x, y, TILE_COLORS[TILE.SAFE_ZONE], 0, 8);
  const tentColor = { top: '#f97316', left: '#c2410c', right: '#ea580c' }; // orange
  drawTile(ctx, x, y, tentColor, 6, 0);
  const roofColor = { top: '#ffffff', left: '#e2e8f0', right: '#f1f5f9' }; // white roof
  drawTile(ctx, x, y, roofColor, 6 + 2, 2);
  
  // simple cross
  ctx.fillStyle = '#ef4444';
  const ty = y - 6;
  ctx.fillRect(x + 2, ty + 2, 3, 1);
  ctx.fillRect(x + 3, ty + 1, 1, 3);
}

function drawPineTree(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const cy = y + TILE_H / 2;

  // Trunk
  ctx.fillStyle = '#5c3a1e';
  ctx.fillRect(x - 1, cy - 5, 2, 5);

  // Pine layers (triangle shape — khas pegunungan)
  const layers = [
    { y: cy - 14, w: 8, h: 6, color: '#166534' },
    { y: cy - 11, w: 6, h: 5, color: '#15803d' },
    { y: cy - 8,  w: 4, h: 4, color: '#22c55e' },
  ];

  for (const l of layers) {
    ctx.beginPath();
    ctx.moveTo(x - l.w / 2, l.y + l.h);
    ctx.lineTo(x, l.y);
    ctx.lineTo(x + l.w / 2, l.y + l.h);
    ctx.closePath();
    ctx.fillStyle = l.color;
    ctx.fill();
  }

  // Snow cap on tallest trees (pegunungan tinggi)
  ctx.fillStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.moveTo(x - 2, cy - 12);
  ctx.lineTo(x, cy - 15);
  ctx.lineTo(x + 2, cy - 12);
  ctx.closePath();
  ctx.fill();
}

function drawRock(ctx: CanvasRenderingContext2D, x: number, y: number) {
  drawTile(ctx, x, y, TILE_COLORS[TILE.GRASS], 0, 8);
  // Rock on top
  const ry = y + TILE_H / 2;
  ctx.fillStyle = '#6b7280';
  ctx.beginPath();
  ctx.ellipse(x, ry - 4, 6, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#9ca3af';
  ctx.beginPath();
  ctx.ellipse(x - 1, ry - 5, 4, 3, -0.3, 0, Math.PI * 2);
  ctx.fill();
  // Highlight
  ctx.fillStyle = '#d1d5db';
  ctx.beginPath();
  ctx.ellipse(x - 2, ry - 6, 2, 1.5, -0.3, 0, Math.PI * 2);
  ctx.fill();
}

function drawFarmTile(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // Base sawah
  drawTile(ctx, x, y, TILE_COLORS[TILE.FARM], 0, 6);

  // Rice paddy lines (garis sawah)
  ctx.strokeStyle = '#16a34a';
  ctx.lineWidth = 0.4;
  for (let i = -3; i <= 3; i++) {
    ctx.beginPath();
    ctx.moveTo(x - TILE_W / 2 + 2, y + TILE_H / 2 + i * 1.5);
    ctx.lineTo(x + TILE_W / 2 - 2, y + TILE_H / 2 + i * 1.5);
    ctx.stroke();
  }
}

function drawBridge(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // Water underneath
  drawTile(ctx, x, y, TILE_COLORS[TILE.RIVER], 0, 8);

  // Bridge planks on top
  const bridgeColor = { top: '#a16207', left: '#713f12', right: '#854d0e' };
  drawTile(ctx, x, y, bridgeColor, 3, 2);

  // Railing posts
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x - TILE_W / 2 + 2, y - 3, 1.5, 5);
  ctx.fillRect(x + TILE_W / 2 - 3, y - 3, 1.5, 5);
}

// ── Offscreen Cache ───────────────────────────────────────────────
type AnyCtx = any; // CanvasRenderingContext2D fallback

interface StaticCache {
  canvas: OffscreenCanvas | HTMLCanvasElement;
  ledBahaya: boolean;
}

let staticCache: StaticCache | null = null;

// Ukuran offscreen cukup besar untuk seluruh peta
const ISO_MAP_W = (MAP_COLS + MAP_ROWS) * (TILE_W / 2) + 200;
const ISO_MAP_H = (MAP_COLS + MAP_ROWS) * (TILE_H / 2) + 300;

// Origin di dalam offscreen canvas
const OFF_ORIGIN_X = MAP_ROWS * (TILE_W / 2);
const OFF_ORIGIN_Y = 80;

// Pre-sorted static tile list
type StaticTileItem = { row: number; col: number };
const STATIC_TILES: StaticTileItem[] = [];
for (let r = 0; r < MAP_ROWS; r++) {
  for (let c = 0; c < MAP_COLS; c++) {
    if (MAP_DATA[r][c] !== TILE.VOID) {
      STATIC_TILES.push({ row: r, col: c });
    }
  }
}
STATIC_TILES.sort((a, b) => (a.row + a.col) - (b.row + b.col));

function buildStaticCache(ledBahaya: boolean): StaticCache {
  let offCanvas: OffscreenCanvas | HTMLCanvasElement;
  let offCtx: AnyCtx;

  if (typeof OffscreenCanvas !== 'undefined') {
    offCanvas = new OffscreenCanvas(ISO_MAP_W, ISO_MAP_H);
    offCtx = offCanvas.getContext('2d') as AnyCtx;
  } else {
    offCanvas = document.createElement('canvas');
    (offCanvas as HTMLCanvasElement).width = ISO_MAP_W;
    (offCanvas as HTMLCanvasElement).height = ISO_MAP_H;
    offCtx = (offCanvas as HTMLCanvasElement).getContext('2d') as AnyCtx;
  }

  for (const { row, col } of STATIC_TILES) {
    const tile = MAP_DATA[row][col] as TileType;
    const { x, y } = toScreen(row, col, OFF_ORIGIN_X, OFF_ORIGIN_Y);
    const isBuilding = tile === TILE.HOUSE || tile === TILE.MUSHOLA || tile === TILE.SCHOOL;

    if (isBuilding) {
      drawBuilding(offCtx, x, y, tile, row, col);
      // Overlay jendela merah saat ledBahaya dihapus untuk menyederhanakan
    } else if (tile === TILE.TENT) {
      drawTent(offCtx, x, y);
    } else if (tile === TILE.PINE) {
      drawTile(offCtx, x, y, TILE_COLORS[TILE.GRASS], 0, 8);
      drawPineTree(offCtx, x, y);
    } else if (tile === TILE.ROCK) {
      drawRock(offCtx, x, y);
    } else if (tile === TILE.FARM) {
      drawFarmTile(offCtx, x, y);
    } else if (tile === TILE.BRIDGE) {
      drawBridge(offCtx, x, y);
    } else if (tile === TILE.RIVER) {
      // Animated in dynamic pass, but draw base here
      drawTile(offCtx, x, y, TILE_COLORS[TILE.RIVER], -2, 8);
    } else {
      const elevated = tile === TILE.VOLCANO || tile === TILE.LAVA;
      let z = 0;
      if (elevated) {
        const distToCenter = Math.abs(row - 4) + Math.abs(col - 6);
        z = Math.max(0, 60 - distToCenter * 8);
      }
      drawTile(offCtx, x, y, TILE_COLORS[tile], z, 8);

      // Kawah gunung
      if (tile === TILE.VOLCANO && z >= 55) {
        offCtx.beginPath();
        offCtx.ellipse(x, y - z + TILE_H / 2, 5, 2.5, 0, 0, Math.PI * 2);
        offCtx.fillStyle = '#1c1917';
        offCtx.fill();
      }
    }
  }

  return { canvas: offCanvas, ledBahaya };
}

// ── Public types ──────────────────────────────────────────────────
export interface RenderState {
  ledBahaya: boolean;
  ledAman: boolean;
  gateOpen: boolean;
  buzzerOn: boolean;
  shakeX: number;
  shakeY: number;
  volcanoFrame: number;
  earthquakeIntensity: number;
  temperature: number;
}

// ── Main render function ──────────────────────────────────────────
export function renderMap(
  ctx: CanvasRenderingContext2D,
  originX: number,
  originY: number,
  state: RenderState,
  npcs: NPC[],
) {
  // 1. Rebuild static cache jika belum ada atau ledBahaya berubah
  if (!staticCache || staticCache.ledBahaya !== state.ledBahaya) {
    staticCache = buildStaticCache(state.ledBahaya);
  }

  // 2. Blit static map ke canvas utama
  const blitX = originX + state.shakeX - OFF_ORIGIN_X;
  const blitY = originY + state.shakeY - OFF_ORIGIN_Y;
  ctx.drawImage(staticCache.canvas, blitX, blitY);

  // Helper: grid → screen (dengan shake)
  const toS = (r: number, c: number) => ({
    x: originX + state.shakeX + (c - r) * (TILE_W / 2),
    y: originY + state.shakeY + (c + r) * (TILE_H / 2),
  });

  // 3. Dynamic: river animation, gate glow, path glow
  for (const { row, col } of STATIC_TILES) {
    const tile = MAP_DATA[row][col] as TileType;

    // River shimmer
    if (tile === TILE.RIVER) {
      const { x, y } = toS(row, col);
      const shimmer = Math.sin((state.volcanoFrame + row * 3 + col * 5) * 0.08) * 0.15;
      ctx.beginPath();
      ctx.moveTo(x, y - 2);
      ctx.lineTo(x + TILE_W / 2, y + TILE_H / 2 - 2);
      ctx.lineTo(x, y + TILE_H - 2);
      ctx.lineTo(x - TILE_W / 2, y + TILE_H / 2 - 2);
      ctx.closePath();
      ctx.fillStyle = `rgba(56, 189, 248, ${0.15 + shimmer})`;
      ctx.fill();
    }

    if (tile !== TILE.GATE && !(tile === TILE.SAFE_ZONE && state.ledAman) && !(tile === TILE.PATH && state.ledAman)) continue;

    const { x, y } = toS(row, col);

    if (tile === TILE.GATE) {
      const gateColors = state.gateOpen
        ? { top: '#4ade80', left: '#16a34a', right: '#22c55e' }
        : { top: '#ef4444', left: '#991b1b', right: '#dc2626' };
      drawTile(ctx, x, y, gateColors, 0, 8);

      if (row % 2 === 0 && col % 2 === 0) {
        ctx.shadowColor = state.gateOpen ? 'rgba(74,222,128,0.9)' : 'rgba(239,68,68,0.9)';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.ellipse(x, y + TILE_H / 2, 6, 3, 0, 0, Math.PI * 2);
        ctx.fillStyle = state.gateOpen ? '#4ade80' : '#ef4444';
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = state.gateOpen ? '#4ade80' : '#ef4444';
        ctx.fillRect(x + TILE_W / 4 - 3, y - 5 + TILE_H / 2, 6, 6);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(x + TILE_W / 4 - 1, y - 3 + TILE_H / 2, 2, 2);
      }
    }

    if (tile === TILE.PATH && state.ledAman) {
      ctx.beginPath();
      ctx.arc(x, y + TILE_H / 2, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#4ade80';
      ctx.shadowColor = '#4ade80';
      ctx.shadowBlur = 4;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    if (tile === TILE.SAFE_ZONE && state.ledAman) {
      ctx.beginPath();
      ctx.ellipse(x, y + TILE_H / 2, TILE_W / 2, TILE_H / 2, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(74,222,128,0.15)';
      ctx.fill();
    }
  }

  // 4. Asap gunung
  {
    const { x, y } = toS(4, 6); // center volcano scaled
    const z = 60;
    const isErupting = state.temperature > 700;
    const smokeY = y - z - 4 + Math.sin(state.volcanoFrame * 0.05) * 2;
    ctx.beginPath();
    ctx.arc(x, smokeY - 8,
      (isErupting ? 8 : 5) + (state.volcanoFrame % 20) * 0.15,
      0, Math.PI * 2);
    ctx.fillStyle = isErupting ? 'rgba(239,68,68,0.75)' : 'rgba(160,160,160,0.55)';
    ctx.fill();
  }

  // 5. NPCs
  const npcItems = npcs.map(npc => ({ npc, depth: npc.row + npc.col }));
  npcItems.sort((a, b) => a.depth - b.depth);

  for (const { npc } of npcItems) {
    const { x, y } = toS(npc.row, npc.col);
    const py = y + TILE_H / 2;

    // Shadow
    ctx.beginPath();
    ctx.ellipse(x, py + 1, 3, 1.5, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fill();

    // Body
    ctx.beginPath();
    ctx.arc(x, py - 3, 3, 0, Math.PI * 2);
    ctx.fillStyle =
      npc.state === 'safe'    ? '#4ade80' :
      npc.state === 'blocked' ? '#ef4444' :
      npc.state === 'panic'   ? '#f97316' : '#3b82f6';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Emote
    if (npc.currentEmote) {
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'center';
      const bounce = Math.sin(npc.emoteTimer * 0.2) * 1.5;
      ctx.fillText(npc.currentEmote, x, py - 10 + bounce);
    }
  }

  // 6. Buzzer wave
  if (state.buzzerOn) {
    const { x: vx, y: vy } = toS(2, 4);
    for (let i = 1; i <= 3; i++) {
      const alpha = 1 - (state.volcanoFrame % 30) / 30;
      const r = ((state.volcanoFrame % 30) / 30) * 25 * i;
      ctx.beginPath();
      ctx.arc(vx, vy, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(239,68,68,${alpha / i})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }
}

// Ekspos fungsi untuk invalidate cache dari luar
export function invalidateStaticCache() {
  staticCache = null;
}
