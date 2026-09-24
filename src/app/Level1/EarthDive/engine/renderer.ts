// ── src/app/Level1/EarthDive/engine/renderer.ts ─────────────────────────
// Pipeline render kanvas: paralaks latar belakang, medan organik (Terraria style),
// objek interaktif, avatar kustom siswa, dan efek partikel ter-cache 60 FPS.

import {
  TILE,
  getPlayerSheet,
  PLAYER_FRAME_W,
  PLAYER_FRAME_H,
  renderOrganicZoneTerrain,
  renderOrganicDivergentTerrain,
  renderOrganicConvergentTerrain,
  renderOrganicTransformTerrain,
  drawResearchBoat,
  drawPortal,
  drawCrystal,
  drawDiscoveryPoint,
  drawInfoSign,
  drawChallengeGate,
  drawZoneBackground,
  drawZoneDecorations,
} from './sprites';
import { drawNpcOnWorld, drawMascotWorld, type NpcWorldType } from './npcSprites';
import type { NpcState } from './npcManager';
import type { ZoneConfig, MapObject } from './zones';
import type { PlayerState } from './player';
import { getPlayerSpriteFrame } from './player';
import type { CustomAvatarConfig } from '../../../../store/teacherStore';

export interface Camera {
  x: number;
  y: number;
}

// ── CAMERA & SCALE ──
export function getGameScale(_canvasW: number, canvasH: number): number {
  // Target tinggi gameplay 480px (15 baris * 32px) agar seluruh dunia pas dari langit hingga tanah
  const scaleH = canvasH / 480;
  // Fleksibel mengikuti zoom-out (scale naik) maupun zoom-in / layar kecil (scale minimum 0.7)
  return Math.max(0.7, Math.round(scaleH * 100) / 100);
}

export function updateCamera(
  camera: Camera,
  player: PlayerState,
  viewW: number,
  viewH: number,
  mapW: number,
  mapH: number,
): void {
  // Kamera mengikuti posisi pemain secara halus (smooth easing)
  const targetX = player.x - viewW / 2;
  camera.x += (targetX - camera.x) * 0.12;

  // Clamp horizontal ke batas peta
  if (mapW <= viewW) {
    camera.x = 0;
  } else {
    camera.x = Math.max(0, Math.min(mapW - viewW, camera.x));
  }

  // Vertikal: saat tinggi tampilan melebihi atau sama dengan tinggi peta (seperti zoom-out),
  // kunci camera.y = 0 agar tanah menempel di dasar layar dan langit di bagian atas tanpa celah!
  if (mapH <= viewH) {
    camera.y = 0;
  } else {
    const targetY = player.y - player.height / 2 - viewH / 2;
    camera.y += (targetY - camera.y) * 0.12;
    camera.y = Math.max(0, Math.min(mapH - viewH, camera.y));
  }
}

// ── TERRAIN CACHE (Kinerja Tinggi 60 FPS Tanpa Lag) ──
// Render lanskap mikro-pixel organik sekali saja ke kanvas offscreen
let terrainCacheCanvas: HTMLCanvasElement | null = null;
let terrainCacheZoneId: string | null = null;

function getTerrainCache(zone: ZoneConfig): HTMLCanvasElement {
  if (terrainCacheCanvas && terrainCacheZoneId === zone.id) return terrainCacheCanvas;

  const c = document.createElement('canvas');
  c.width = zone.cols * TILE;
  // Perluas tinggi cache ke 1600px agar batuan dasar mantel terisi penuh ke bawah kanvas
  c.height = Math.max(zone.rows * TILE, 1600);
  const ctx = c.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Render lanskap organik multilapis (Terraria & TheoTown micro-pixels)
  renderOrganicZoneTerrain(ctx, zone);

  terrainCacheCanvas = c;
  terrainCacheZoneId = zone.id;
  return c;
}

export function invalidateTileCache(): void {
  terrainCacheCanvas = null;
  terrainCacheZoneId = null;
}

// ── MAIN RENDER FUNCTION ──
export function renderFrame(
  ctx: CanvasRenderingContext2D,
  canvasW: number,
  canvasH: number,
  camera: Camera,
  zone: ZoneConfig,
  player: PlayerState,
  frame: number,
  collectedIds: Set<string>,
  unlockedGates: Set<string>,
  nearObject: MapObject | null,
  scale: number = 1.5,
  avatarConfig?: CustomAvatarConfig,
  npcStates?: Map<string, NpcState>,
  divergentProgress: number = 1.0,
  convergentProgress: number = 1.0,
  transformProgress: number = 1.0,
): void {
  ctx.imageSmoothingEnabled = false;

  // 1. Bersihkan frame
  ctx.clearRect(0, 0, canvasW, canvasH);

  // 2. Latar belakang atmosferik dengan paralaks horizontal
  ctx.save();
  drawZoneBackground(ctx, canvasW, canvasH, zone.id, frame, camera.x);
  ctx.restore();

  // 3. Transformasi kamera dunia
  ctx.save();
  ctx.scale(scale, scale);
  ctx.translate(-Math.round(camera.x), -Math.round(camera.y));

  // 4. Gambar medan lanskap mikro-pixel (dari cache off-screen atau dinamis untuk divergent / convergent / transform)
  if (zone.id === 'divergent') {
    renderOrganicDivergentTerrain(ctx, zone, frame, divergentProgress);
  } else if (zone.id === 'convergent') {
    renderOrganicConvergentTerrain(ctx, zone, frame, convergentProgress);
  } else if (zone.id === 'transform') {
    renderOrganicTransformTerrain(ctx, zone, frame, transformProgress);
  } else {
    const terrain = getTerrainCache(zone);
    ctx.drawImage(terrain, 0, 0);
  }

  // 4.5. Elemen dekorasi dinamis beranimasi tiap frame (lava bubbling, electrical arcs, spires)
  drawZoneDecorations(ctx, zone.id, frame);

  // 5. Objek interaktif (Portal, Kristal, Titik Temuan, Papan Informasi, Gerbang Tantangan)
  for (const obj of zone.objects) {
    if (collectedIds.has(obj.id)) continue;

    const ox = obj.px !== undefined ? obj.px : obj.x * TILE;
    const oy = obj.py !== undefined ? obj.py : obj.y * TILE;

    switch (obj.type) {
      case 'npc': {
        const npcState = npcStates?.get(obj.id);
        const nx = npcState ? npcState.x : ox;
        const ny = npcState ? npcState.y : oy;
        const ndir = npcState ? npcState.dir : 'right';
        const nwalk = npcState ? (npcState.state === 'walk_left' || npcState.state === 'walk_right') : false;
        const ntype = (obj.data?.npcType as NpcWorldType) || 'prof_raditya';
        drawNpcOnWorld(ctx, nx, ny, ntype, ndir, nwalk, frame, zone.id);
        break;
      }
      case 'portal_down': {
        const portalDownLabel =
          zone.id === 'innerCore'
            ? '▼ BATAS DIVERGEN ▼'
            : zone.id === 'divergent'
              ? '▼ BATAS KONVERGEN ▼'
              : zone.id === 'convergent'
                ? '▼ BATAS TRANSFORM ▼'
                : zone.id === 'transform'
                  ? '★ KAPSUL AKHIR ★'
                  : undefined;
        drawPortal(ctx, ox, oy, true, frame, portalDownLabel);
        break;
      }
      case 'portal_up': {
        const portalUpLabel =
          zone.id === 'divergent'
            ? '▲ INTI DALAM ▲'
            : zone.id === 'convergent'
              ? '▲ BATAS DIVERGEN ▲'
              : zone.id === 'transform'
                ? '▲ BATAS KONVERGEN ▲'
                : undefined;
        drawPortal(ctx, ox, oy, false, frame, portalUpLabel);
        break;
      }
      case 'crystal':
        drawCrystal(ctx, ox, oy, frame);
        break;
      case 'discovery':
        drawDiscoveryPoint(ctx, ox, oy, frame);
        break;
      case 'info_sign':
        drawInfoSign(ctx, ox, oy);
        break;
      case 'challenge_gate': {
        const locked = !unlockedGates.has(obj.id);
        drawChallengeGate(ctx, ox, oy, locked, frame);
        break;
      }
    }

    // Prompt interaksi melayang tepat di atas objek
    if (nearObject && nearObject.id === obj.id && obj.type !== 'info_sign') {
      if (obj.type === 'npc') {
        const npcState = npcStates?.get(obj.id);
        const nx = npcState ? npcState.x : ox;
        const ny = npcState ? npcState.y : oy;
        drawNpcInteractionPrompt(ctx, nx, ny, frame, (obj.data?.name as string) || 'Bicara');
      } else {
        drawInteractionPrompt(ctx, ox, oy, frame);
      }
    }
  }

  // 5.5. Perahu Riset Otomatis di Kerak Samudra (Area 7: Batas Konvergen saat x < 530)
  if (zone.id === 'convergent' && player.x < 530) {
    drawResearchBoat(ctx, player.x, player.y, player.dir, frame);
  }

  // 6. Karakter pemain dengan avatar kustom murid & animasi dinamis (Squash & Stretch)
  const playerSheet = getPlayerSheet(avatarConfig, zone.id);
  const spriteFrame = getPlayerSpriteFrame(player);
  const srcX = spriteFrame * PLAYER_FRAME_W;
  const drawX = Math.round(player.x - PLAYER_FRAME_W / 2);
  const drawY = Math.round(player.y - PLAYER_FRAME_H);

  // Efek api roket pendorong (jet booster) saat lompatan ganda
  if (player.thrusterTimer > 0) {
    ctx.save();
    const tAlpha = player.thrusterTimer / 16;
    ctx.globalAlpha = tAlpha;
    const flameH = 6 + (player.thrusterTimer % 4) * 2;
    ctx.fillStyle = '#00e5ff';
    ctx.fillRect(drawX + 6, drawY + PLAYER_FRAME_H - 1, 4, flameH);
    ctx.fillRect(drawX + 14, drawY + PLAYER_FRAME_H - 1, 4, flameH);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(drawX + 7, drawY + PLAYER_FRAME_H, 2, Math.max(2, flameH - 3));
    ctx.fillRect(drawX + 15, drawY + PLAYER_FRAME_H, 2, Math.max(2, flameH - 3));
    ctx.restore();
  }

  // Hitung deformasi dinamis (Squash & Stretch)
  let scaleX = 1.0;
  let scaleY = 1.0;

  if (!player.onGround) {
    if (player.vy < -1.0) {
      // Regangan vertikal saat melompat ke atas
      scaleY = 1.12;
      scaleX = 0.90;
    } else if (player.vy > 1.5) {
      // Regangan aerodinamis saat jatuh bebas
      scaleY = 1.08;
      scaleX = 0.94;
    }
  } else if (player.landingSquashTimer > 0) {
    // Kompresi pendaratan (Squash impact) memipih lalu kembali normal
    const sq = player.landingSquashTimer / 6;
    scaleY = 1.0 - sq * 0.18;
    scaleX = 1.0 + sq * 0.22;
  }

  // Render karakter dengan pivot tepat di telapak kaki (player.x, player.y)
  const jumpZ = player.jumpZ || 0;

  // Di mode top-down (Batas Transform): gambar bayangan di tanah yang mengecil saat melompat
  if (zone.id === 'transform') {
    const shadowScale = Math.max(0.35, 1.0 - jumpZ * 0.025);
    ctx.save();
    ctx.fillStyle = `rgba(0, 0, 0, ${Math.max(0.12, 0.35 - jumpZ * 0.008)})`;
    ctx.beginPath();
    ctx.ellipse(Math.round(player.x), Math.round(player.y), 10 * shadowScale, 4.5 * shadowScale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.save();
  ctx.translate(Math.round(player.x), Math.round(player.y - jumpZ));
  ctx.scale(player.dir === 'left' ? -scaleX : scaleX, scaleY);

  // Efek kedip invulnerability saat terkena damage
  if (player.invulnerableTimer > 0 && Math.floor(player.invulnerableTimer / 4) % 2 === 1) {
    ctx.globalAlpha = 0.35;
  }

  ctx.drawImage(
    playerSheet,
    srcX, 0, PLAYER_FRAME_W, PLAYER_FRAME_H,
    -PLAYER_FRAME_W / 2, -PLAYER_FRAME_H, PLAYER_FRAME_W, PLAYER_FRAME_H,
  );

  ctx.restore();

  // 7. Maskot Pendamping Penyelamat "Resqy" melayang mendampingi pemain
  drawMascotWorld(ctx, player.x, player.y - jumpZ, player.dir, frame);

  ctx.restore();
}

// ── PROMPT INTERAKSI KHUSUS NPC ──
function drawNpcInteractionPrompt(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, _name: string): void {
  const bounce = Math.sin(frame * 0.12) * 3;
  const px = x;
  const py = y - 40 + bounce;

  // Background speech bubble piksel
  ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
  ctx.fillRect(px - 38, py - 9, 76, 18);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(px - 38, py - 9, 76, 18);

  // Panah segitiga kecil menunjuk ke kepala NPC
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(px - 2, py + 9, 4, 3);
  ctx.fillRect(px - 1, py + 12, 2, 2);

  // Label interaksi
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 8px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('[E] BICARA', px, py + 3);
  ctx.textAlign = 'start';
}

// ── PROMPT INTERAKSI MELAYANG ──
function drawInteractionPrompt(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number): void {
  const bounce = Math.sin(frame * 0.1) * 3;
  const px = x + TILE / 2;
  const py = y - 14 + bounce;

  // Background pill
  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
  ctx.fillRect(px - 28, py - 6, 56, 14);
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 1;
  ctx.strokeRect(px - 28, py - 6, 56, 14);

  // Teks tombol
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 8px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('[E] / Enter', px, py + 4);
  ctx.textAlign = 'start';
}

// ── OVERLAY TRANSISI ANTAR ZONA ──
export function drawTransitionOverlay(
  ctx: CanvasRenderingContext2D,
  canvasW: number,
  canvasH: number,
  progress: number,
  zoneName: string,
  depthLabel: string,
  isDescending: boolean,
): void {
  // Transisi fade in 0..0.12, tahan tampilan 0.12..0.85, fade out 0.85..1.0 (durasi total ~4 detik)
  let alpha = 1;
  if (progress < 0.12) {
    alpha = progress / 0.12;
  } else if (progress > 0.85) {
    alpha = (1 - progress) / 0.15;
  }

  ctx.fillStyle = `rgba(5, 8, 15, ${Math.max(0, Math.min(0.96, alpha * 0.96))})`;
  ctx.fillRect(0, 0, canvasW, canvasH);

  if (progress > 0.06 && progress < 0.94) {
    const textAlpha = Math.min(1, Math.min(progress / 0.12, (0.94 - progress) / 0.10));
    ctx.save();
    ctx.globalAlpha = textAlpha;

    const cx = canvasW / 2;
    const cy = canvasH / 2;

    // Panel kartu pengantar zona
    const cardW = Math.min(canvasW - 40, 520);
    const cardH = 140;
    const cardX = cx - cardW / 2;
    const cardY = cy - cardH / 2;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(cardX, cardY, cardW, cardH);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.strokeRect(cardX, cardY, cardW, cardH);

    // Aksen sudut pixel emas
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(cardX + 4, cardY + 4, 10, 4);
    ctx.fillRect(cardX + 4, cardY + 4, 4, 10);
    ctx.fillRect(cardX + cardW - 14, cardY + 4, 10, 4);
    ctx.fillRect(cardX + cardW - 8, cardY + 4, 4, 10);
    ctx.fillRect(cardX + 4, cardY + cardH - 8, 10, 4);
    ctx.fillRect(cardX + 4, cardY + cardH - 14, 4, 10);
    ctx.fillRect(cardX + cardW - 14, cardY + cardH - 8, 10, 4);
    ctx.fillRect(cardX + cardW - 8, cardY + cardH - 14, 4, 10);

    // Label arah penyelaman
    ctx.textAlign = 'center';
    ctx.font = 'bold 12px "Press Start 2P", monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(isDescending ? '▼ MEMASUKI LAPISAN ▼' : '▲ KEMBALI KE LAPISAN ▲', cx, cy - 28);

    // Nama Zona / Strata Besar
    ctx.font = 'bold 18px "Press Start 2P", monospace';
    ctx.fillStyle = '#fef08a';
    ctx.fillText(zoneName, cx, cy + 6);

    // Label Kedalaman (Hanya jika lapisan memiliki kedalaman)
    if (depthLabel && depthLabel.trim() !== '') {
      ctx.font = 'bold 11px "Press Start 2P", monospace';
      ctx.fillStyle = '#fbbf24';
      ctx.fillText(`KEDALAMAN: ${depthLabel}`, cx, cy + 38);
    }

    ctx.restore();
    ctx.textAlign = 'start';
  }
}
