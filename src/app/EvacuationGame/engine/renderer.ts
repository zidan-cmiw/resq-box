// ── renderer.ts ───────────────────────────────────────────────────
// Merender peta isometrik ke HTML5 Canvas menggunakan projeksi
// standar isometrik 2:1 (diamond tiles).

import type { TileType } from '../mapData';
import { MAP_DATA, MAP_ROWS, MAP_COLS, TILE } from '../mapData';
import type { NPC } from './npc';

export const TILE_W = 32;  // scaled down for 40x40 map
export const TILE_H = 16;
export const TILE_DEPTH = 8;

// Konversi koordinat grid ke posisi layar isometrik
export function toScreen(row: number, col: number, originX: number, originY: number) {
  const x = originX + (col - row) * (TILE_W / 2);
  const y = originY + (col + row) * (TILE_H / 2);
  return { x, y };
}

// Warna untuk setiap jenis tile
const TILE_COLORS: Record<TileType, { top: string; left: string; right: string }> = {
  [TILE.VOID]:      { top: 'transparent', left: 'transparent', right: 'transparent' },
  [TILE.GRASS]:     { top: '#4ade80', left: '#16a34a', right: '#22c55e' },
  [TILE.VOLCANO]:   { top: '#78716c', left: '#44403c', right: '#57534e' },
  [TILE.PATH]:      { top: '#d97706', left: '#92400e', right: '#b45309' },
  [TILE.TREE]:      { top: '#15803d', left: '#14532d', right: '#166534' },
  [TILE.HOUSE]:     { top: '#2563eb', left: '#1e3a8a', right: '#1d4ed8' },
  [TILE.SCHOOL]:    { top: '#7c3aed', left: '#4c1d95', right: '#6d28d9' },
  [TILE.SAFE_ZONE]: { top: '#bbf7d0', left: '#16a34a', right: '#4ade80' },
  [TILE.GATE]:      { top: '#f59e0b', left: '#92400e', right: '#b45309' },
  [TILE.LAVA]:      { top: '#f97316', left: '#c2410c', right: '#ea580c' },
  [TILE.ROAD]:      { top: '#6b7280', left: '#374151', right: '#4b5563' },
};




function drawTile(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  colors: { top: string; left: string; right: string },
  z: number = 0,
  depth: number = TILE_DEPTH,
  glowColor?: string,
) {
  if (glowColor) {
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 12;
  }

  const ty = y - z;

  // Top face (diamond)
  ctx.beginPath();
  ctx.moveTo(x, ty);
  ctx.lineTo(x + TILE_W / 2, ty + TILE_H / 2);
  ctx.lineTo(x, ty + TILE_H);
  ctx.lineTo(x - TILE_W / 2, ty + TILE_H / 2);
  ctx.closePath();
  ctx.fillStyle = colors.top;
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Left face
  ctx.beginPath();
  ctx.moveTo(x - TILE_W / 2, ty + TILE_H / 2);
  ctx.lineTo(x, ty + TILE_H);
  ctx.lineTo(x, y + TILE_H + depth);
  ctx.lineTo(x - TILE_W / 2, y + TILE_H / 2 + depth);
  ctx.closePath();
  ctx.fillStyle = colors.left;
  ctx.fill();
  ctx.stroke();

  // Right face
  ctx.beginPath();
  ctx.moveTo(x, ty + TILE_H);
  ctx.lineTo(x + TILE_W / 2, ty + TILE_H / 2);
  ctx.lineTo(x + TILE_W / 2, y + TILE_H / 2 + depth);
  ctx.lineTo(x, y + TILE_H + depth);
  ctx.closePath();
  ctx.fillStyle = colors.right;
  ctx.fill();
  ctx.stroke();

  ctx.shadowBlur = 0;
}

function drawBuilding(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  type: TileType,
  ledOn: boolean,
) {
  // Draw grass base first
  drawTile(ctx, x, y, TILE_COLORS[TILE.GRASS], 0, 10);

  const isSchool = type === TILE.SCHOOL;
  // Bikin gedung jauh lebih tinggi! Sekolah = 70, Rumah = 45
  const bHeight = isSchool ? 70 : 45;

  // Draw building walls (White/Gray for school, Warm for houses)
  const wallColor = isSchool
    ? { top: '#e2e8f0', left: '#cbd5e1', right: '#94a3b8' }
    : { top: '#fef08a', left: '#fde047', right: '#eab308' };

  drawTile(ctx, x, y, wallColor, bHeight, 0);

  // Draw overhanging roof
  const roofColor = isSchool
    ? { top: '#ef4444', left: '#b91c1c', right: '#991b1b' } // Red roof for school
    : { top: '#3b82f6', left: '#1d4ed8', right: '#1e3a8a' }; // Blue roof for houses
  drawTile(ctx, x, y, roofColor, bHeight + 4, 4);

  // Draw Windows
  const winColor = ledOn ? '#fca5a5' : '#bae6fd'; // Red if danger, light blue normally
  ctx.fillStyle = winColor;
  if (ledOn) {
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 8;
  }
  
  const ty = y - bHeight;
  // Karena TILE_W = 32, TILE_H = 16, muka kiri dan kanan lebih kecil
  // ty adalah y - bHeight (posisi atap)
  const rows = isSchool ? 5 : 3;
  const cols = 2;

  // Left Face Windows
  // Permukaan kiri membentang dari x - 16 sampai x.
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const wx = x - 14 + (c * 6);
      const wy = ty + 5 + (c * 3) + (r * 10);
      ctx.beginPath();
      ctx.moveTo(wx, wy);
      ctx.lineTo(wx + 4, wy + 2);
      ctx.lineTo(wx + 4, wy + 8);
      ctx.lineTo(wx, wy + 6);
      ctx.fill();
    }
  }

  // Right Face Windows
  // Permukaan kanan membentang dari x sampai x + 16.
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const wx = x + 4 + (c * 6);
      const wy = ty + 10 - (c * 3) + (r * 10);
      ctx.beginPath();
      ctx.moveTo(wx, wy);
      ctx.lineTo(wx + 4, wy - 2);
      ctx.lineTo(wx + 4, wy + 4);
      ctx.lineTo(wx, wy + 6);
      ctx.fill();
    }
  }
  ctx.shadowBlur = 0;

  // LED danger indicator on top of roof
  if (ledOn) {
    ctx.beginPath();
    ctx.ellipse(x, y - bHeight - 4 + TILE_H/2, 6, 3, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

export interface RenderState {
  ledBahaya: boolean;
  ledAman: boolean;
  gateOpen: boolean;
  buzzerOn: boolean;
  shakeX: number;
  shakeY: number;
  volcanoFrame: number; // for animated smoke
  earthquakeIntensity: number;
  temperature: number;
}

export function renderMap(
  ctx: CanvasRenderingContext2D,
  originX: number,
  originY: number,
  state: RenderState,
  npcs: NPC[],
) {
  type RenderItem = 
    | { type: 'tile'; row: number; col: number; depth: number }
    | { type: 'npc'; npc: NPC; depth: number }
    | { type: 'led'; row: number; col: number; depth: number };

  const queue: RenderItem[] = [];

  // 1. Build Queue
  for (let r = 0; r < MAP_ROWS; r++) {
    for (let c = 0; c < MAP_COLS; c++) {
      if (MAP_DATA[r][c] !== TILE.VOID) {
        queue.push({ type: 'tile', row: r, col: c, depth: r + c });
        if (state.ledAman && MAP_DATA[r][c] === TILE.PATH) {
          queue.push({ type: 'led', row: r, col: c, depth: r + c + 0.1 });
        }
      }
    }
  }

  for (const npc of npcs) {
    // Add small offset to depth so NPC draws slightly after the tile it's currently on
    queue.push({ type: 'npc', npc, depth: npc.row + npc.col + 0.5 });
  }

  // 2. Sort Queue (Painter's Algorithm)
  queue.sort((a, b) => a.depth - b.depth);

  // 3. Render everything in order
  for (const item of queue) {
    if (item.type === 'tile') {
      const { row, col } = item;
      const tile = MAP_DATA[row][col] as TileType;
      const { x, y } = toScreen(row, col, originX, originY);
      const isGate = tile === TILE.GATE;

      let colors = TILE_COLORS[tile];
      let glowColor: string | undefined;

      if (isGate) {
        colors = state.gateOpen
          ? { top: '#4ade80', left: '#16a34a', right: '#22c55e' }
          : { top: '#ef4444', left: '#991b1b', right: '#dc2626' };
        glowColor = state.gateOpen ? 'rgba(74,222,128,0.8)' : 'rgba(239,68,68,0.8)';
      }

      if (tile === TILE.SAFE_ZONE && state.ledAman) {
        glowColor = 'rgba(74, 222, 128, 0.6)';
      }

      const isBuilding = tile === TILE.HOUSE || tile === TILE.SCHOOL;

      if (!isBuilding) {
        const elevated = tile === TILE.VOLCANO || tile === TILE.LAVA;
        
        // Bikin gunung berapi menjulang SANGAT TINGGI dengan bentuk kerucut
        // Center volcano kira-kira di row=5, col=5
        let z = 0;
        if (elevated) {
          const distToCenter = Math.abs(row - 5) + Math.abs(col - 5);
          z = Math.max(0, 75 - distToCenter * 15);
        }
        
        drawTile(ctx, x, y, colors, z, 10, glowColor);

        // Draw volcano crater and smoke (only on the very top tile, dist == 0)
        if (tile === TILE.VOLCANO && z >= 75) {
          ctx.beginPath();
          ctx.ellipse(x, y - z + TILE_H / 2, 6, 3, 0, 0, Math.PI * 2);
          ctx.fillStyle = '#1c1917';
          ctx.fill();

          const isErupting = state.temperature > 700;
          const smokeY = y - z - 5 + Math.sin(state.volcanoFrame * 0.05) * 3;
          ctx.beginPath();
          ctx.arc(x, smokeY - 12, (isErupting ? 10 : 6) + (state.volcanoFrame % 20) * 0.2, 0, Math.PI * 2);
          ctx.fillStyle = isErupting ? 'rgba(239, 68, 68, 0.8)' : 'rgba(160, 160, 160, 0.7)';
          ctx.fill();
        }

        // Draw tree trunk and crown
        if (tile === TILE.TREE) {
          const cy = y + TILE_H / 2;
          ctx.fillStyle = '#78350f';
          ctx.fillRect(x - 1, cy - 6, 2, 6);
          ctx.fillStyle = '#14532d';
          ctx.beginPath(); ctx.arc(x, cy - 10, 7, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#16a34a';
          ctx.beginPath(); ctx.arc(x - 3, cy - 8, 5, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(x + 3, cy - 8, 5, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(x, cy - 12, 6, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#4ade80';
          ctx.beginPath(); ctx.arc(x - 2, cy - 13, 3, 0, Math.PI * 2); ctx.fill();
        }

        // Draw gate symbol (only on one of the gate tiles)
        if (isGate && row % 2 === 0 && col % 2 === 0) {
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 8px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(state.gateOpen ? '🚪' : '🔒', x + TILE_W/4, y - 5 + TILE_H / 2);
        }

      } else {
        drawBuilding(ctx, x, y, tile, state.ledBahaya);
      }
    } else if (item.type === 'led') {
      const { x, y } = toScreen(item.row, item.col, originX, originY);
      ctx.beginPath();
      ctx.arc(x, y + TILE_H / 2, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#4ade80';
      ctx.shadowColor = '#4ade80';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    } else if (item.type === 'npc') {
      const npc = item.npc;
      const { x, y } = toScreen(npc.row, npc.col, originX, originY);
      const py = y + TILE_H / 2; // center on tile top

      // Shadow
      ctx.beginPath();
      ctx.ellipse(x, py + 1, 4, 2, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fill();

      // Body
      ctx.beginPath();
      ctx.arc(x, py - 4, 4, 0, Math.PI * 2);
      ctx.fillStyle = npc.state === 'safe'
        ? '#4ade80'
        : npc.state === 'blocked'
          ? '#ef4444'
          : npc.state === 'panic'
            ? '#f97316'
            : '#3b82f6';
      ctx.fill();

      // Stroke
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Emote / State Icon
      if (npc.currentEmote) {
        ctx.fillStyle = '#fff';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        // Subtle bounce animation for the emote
        const bounce = Math.sin(npc.emoteTimer * 0.2) * 2;
        ctx.fillText(npc.currentEmote, x, py - 14 + bounce);
      }
    }
  }

  // Buzzer wave animation
  if (state.buzzerOn) {
    const { x: vx, y: vy } = toScreen(1, 2, originX, originY);
    for (let i = 1; i <= 3; i++) {
      const alpha = 1 - (state.volcanoFrame % 30) / 30;
      const r = ((state.volcanoFrame % 30) / 30) * 30 * i;
      ctx.beginPath();
      ctx.arc(vx, vy, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(239, 68, 68, ${alpha / i})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
}
