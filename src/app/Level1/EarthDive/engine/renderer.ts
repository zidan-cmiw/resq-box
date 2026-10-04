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
import type { ZoneConfig, MapObject, DivergentFish } from './zones';
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
  divergentCoolProgress: number = 0,
  divergentWiltProgress: number = 0,
  divergentFishScared: boolean = false,
  divergentFish?: DivergentFish[],
  divergentSequencePhase: string = 'cooling',
  convergentMode: 'land' | 'ocean' = 'land',
  discoveredPoints?: Set<string>,
): void {
  ctx.imageSmoothingEnabled = false;

  // 1. Bersihkan frame
  ctx.clearRect(0, 0, canvasW, canvasH);

  // 2. Latar belakang atmosferik dengan paralaks horizontal
  ctx.save();
  drawZoneBackground(ctx, canvasW, canvasH, zone.id, frame, camera.x, convergentMode);
  ctx.restore();

  // 3. Transformasi kamera dunia
  ctx.save();
  ctx.scale(scale, scale);
  ctx.translate(-Math.round(camera.x), -Math.round(camera.y));

  // 4. Gambar medan lanskap mikro-pixel (dari cache off-screen atau dinamis untuk divergent / convergent / transform)
  if (zone.id === 'divergent') {
    renderOrganicDivergentTerrain(
      ctx,
      zone,
      frame,
      divergentProgress,
      divergentCoolProgress,
      divergentWiltProgress,
      divergentFishScared,
      divergentFish,
      divergentSequencePhase,
    );
  } else if (zone.id === 'convergent') {
    renderOrganicConvergentTerrain(ctx, zone, frame, convergentProgress, convergentMode);
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
        const nwalk = npcState ? (npcState.state === 'walk_left' || npcState.state === 'walk_right' || !!npcState.isFleeing) : false;
        const ntype = (obj.data?.npcType as NpcWorldType) || 'zidane';
        drawNpcOnWorld(ctx, nx, ny, ntype, ndir, nwalk, frame, zone.id);

        const hasMaterial = !!(obj.data?.hasMaterial || npcState?.hasMaterial);
        if (hasMaterial) {
          const discKey = (obj.data?.discoveryKey as string) || (npcState?.discoveryKey as string) || '';
          const isDiscovered = discKey ? (discoveredPoints?.has(discKey) ?? false) : false;
          drawNpcMaterialBadge(ctx, nx, ny - 38, frame, isDiscovered);
        }

        if (npcState?.isFleeing) {
          drawNpcPanicBadge(ctx, nx, ny - 36, frame);
        }
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

  // 5.5. Perahu Riset Otomatis di Kerak Samudra (Area 7: Batas Konvergen saat x < 576 dan kondisi lautan)
  if (zone.id === 'convergent' && convergentMode === 'ocean' && player.x < 576) {
    drawResearchBoat(ctx, player.x, player.y, player.dir, frame);
  }

  // 6. Karakter pemain dengan avatar kustom murid & animasi dinamis (Squash & Stretch)
  const playerSheet = getPlayerSheet(avatarConfig, zone.id, player.equippedSuit);
  const spriteFrame = getPlayerSpriteFrame(player, zone.id);
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

  if (zone.id !== 'divergent') {
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

  if (zone.id === 'divergent') {
    // Kemiringan tubuh aerodinamis saat berenang naik atau turun di air
    const swimTilt = player.vy < -0.5 ? -0.16 : player.vy > 0.5 ? 0.16 : 0;
    ctx.scale(player.dir === 'left' ? -scaleX : scaleX, scaleY);
    ctx.rotate(swimTilt);
  } else {
    ctx.scale(player.dir === 'left' ? -scaleX : scaleX, scaleY);
  }

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

  // 6.5. Gelembung pernapasan regulator penyelam pemain di bawah laut (Batas Divergen)
  if (zone.id === 'divergent') {
    const bubbleProg = ((frame * 0.45) % 65) / 65;
    if (bubbleProg < 0.8) {
      const bx = player.x + (player.dir === 'left' ? -8 : 8) + Math.sin(frame * 0.1) * 2;
      const by = player.y - jumpZ - PLAYER_FRAME_H + 10 - bubbleProg * 32;
      ctx.fillStyle = `rgba(224, 242, 254, ${0.75 * (1 - bubbleProg)})`;
      ctx.beginPath();
      ctx.arc(bx, by, 1.5 + bubbleProg * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 7. Maskot Pendamping Penyelamat "Resqy" melayang mendampingi pemain
  drawMascotWorld(ctx, player.x, player.y - jumpZ, player.dir, frame);

  ctx.restore();
}

// ── PROMPT INTERAKSI KHUSUS NPC (100% PERSIS GAYA LEVEL 2) ──
function drawNpcInteractionPrompt(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, _name: string): void {
  const bounce = Math.sin(frame * 0.1) * 3;
  const px = x;
  const py = y - 36 + bounce;

  const label = '[E] / Enter';
  ctx.save();
  ctx.font = 'bold 8.5px "Plus Jakarta Sans", sans-serif';
  const textW = ctx.measureText(label).width;
  const pillW = Math.max(56, Math.round(textW + 16));
  const bx = Math.round(px - pillW / 2);

  // Background pill persis Level 2
  ctx.fillStyle = 'rgba(0, 0, 0, 0.88)';
  ctx.fillRect(bx, py - 7, pillW, 15);
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(bx, py - 7, pillW, 15);

  // Teks tombol
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, px, py + 0.5);
  ctx.restore();
}

// ── BADGE INDIKATOR MATERI EDUKASI NPC: KACA PEMBESAR [🔍] ──
export function drawNpcMaterialBadge(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number,
  isDiscovered: boolean = false,
): void {
  const bob = Math.sin(frame * 0.08) * 3;
  const bx = Math.round(x);
  const by = Math.round(y - 8 + bob);

  ctx.save();
  const pillW = 68;
  const pillH = 17;
  const px = bx - pillW / 2;
  const py = by - pillH / 2;

  // Background and border
  if (isDiscovered) {
    ctx.fillStyle = 'rgba(6, 78, 59, 0.92)';
    ctx.fillRect(px, py, pillW, pillH);
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(px, py, pillW, pillH);
  } else {
    const pulseAlpha = 0.85 + Math.sin(frame * 0.12) * 0.15;
    ctx.fillStyle = `rgba(69, 26, 3, ${pulseAlpha})`;
    ctx.fillRect(px, py, pillW, pillH);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(px, py, pillW, pillH);
  }

  // Pointer segitiga ke arah kepala NPC
  ctx.fillStyle = isDiscovered ? '#34d399' : '#f59e0b';
  ctx.beginPath();
  ctx.moveTo(bx - 4, py + pillH);
  ctx.lineTo(bx + 4, py + pillH);
  ctx.lineTo(bx, py + pillH + 4);
  ctx.closePath();
  ctx.fill();

  // ── 2D PIXEL ART KACA PEMBESAR (MAGNIFYING GLASS) ──
  const mx = px + 4;
  const my = py + 3;

  // Gagang kaca pembesar (handle cokelat/emas diagonal)
  ctx.fillStyle = isDiscovered ? '#10b981' : '#d97706';
  ctx.fillRect(mx + 7, my + 7, 2, 2);
  ctx.fillRect(mx + 8, my + 8, 2, 2);
  ctx.fillStyle = isDiscovered ? '#065f46' : '#78350f';
  ctx.fillRect(mx + 9, my + 9, 2, 2);

  // Bingkai lingkaran lensa (lens rim)
  ctx.fillStyle = isDiscovered ? '#34d399' : '#fbbf24';
  ctx.fillRect(mx + 2, my + 0, 5, 1);
  ctx.fillRect(mx + 1, my + 1, 1, 5);
  ctx.fillRect(mx + 7, my + 1, 1, 5);
  ctx.fillRect(mx + 2, my + 6, 5, 1);

  // Kaca lensa cyan transparan
  ctx.fillStyle = isDiscovered ? '#a7f3d0' : '#38bdf8';
  ctx.fillRect(mx + 2, my + 1, 5, 5);
  // Specular shine lensa kaca pembesar putih
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(mx + 2, my + 2, 2, 1);
  ctx.fillRect(mx + 3, my + 1, 1, 1);

  // Teks label status
  ctx.font = 'bold 8.5px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  if (isDiscovered) {
    ctx.fillStyle = '#6ee7b7';
    ctx.fillText('BACA ✓', mx + 13, by + 0.5);
  } else {
    ctx.fillStyle = '#fef08a';
    ctx.fillText('MATERI', mx + 13, by + 0.5);
  }

  ctx.restore();
}

// ── BADGE EVAKUASI / KEPANIKAN NPC SAAT GEMPA ──
function drawNpcPanicBadge(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number): void {
  const bob = Math.sin(frame * 0.25) * 2.5;
  const bx = Math.round(x);
  const by = Math.round(y + bob);

  ctx.save();
  // Badge darurat merah berkedip [ ! ]
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(bx - 10, by - 8, 20, 16);
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(bx - 10, by - 8, 20, 16);

  // Teks tanda seru
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('!', bx, by + 1);

  // Butiran keringat panik melayang
  const sweatOffset = (frame * 0.7) % 8;
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(bx + 11, by - 4 + sweatOffset, 2, 3);
  ctx.fillRect(bx - 13, by - 2 + sweatOffset, 2, 3);

  ctx.restore();
}

// ── PROMPT INTERAKSI MELAYANG OBJEK / PORTAL (100% PERSIS GAYA LEVEL 2) ──
function drawInteractionPrompt(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number): void {
  const bounce = Math.sin(frame * 0.1) * 3;
  const px = x + TILE / 2;
  const py = y - 10 + bounce;

  const label = '[E] / Enter';
  ctx.save();
  ctx.font = 'bold 8.5px "Plus Jakarta Sans", sans-serif';
  const textW = ctx.measureText(label).width;
  const pillW = Math.max(56, Math.round(textW + 16));
  const bx = Math.round(px - pillW / 2);

  // Background pill
  ctx.fillStyle = 'rgba(0, 0, 0, 0.88)';
  ctx.fillRect(bx, py - 7, pillW, 15);
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(bx, py - 7, pillW, 15);

  // Teks tombol
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, px, py + 0.5);
  ctx.restore();
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

    // Panel kartu pengantar zona (Format Lebih Besar & Megah)
    const isCompact = canvasW < 768;
    const cardW = Math.min(canvasW - 48, isCompact ? 600 : 820);
    const cardH = isCompact ? 190 : 230;
    const cardX = cx - cardW / 2;
    const cardY = cy - cardH / 2;

    // Bayangan luar kartu retro mewah (Deep Drop Shadow)
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 32;
    ctx.shadowOffsetY = 12;

    // Panel gradien slate gelap mewah
    const cardGrad = ctx.createLinearGradient(cardX, cardY, cardX, cardY + cardH);
    cardGrad.addColorStop(0, '#0f172a');
    cardGrad.addColorStop(0.5, '#0b1120');
    cardGrad.addColorStop(1, '#020617');
    ctx.fillStyle = cardGrad;
    ctx.fillRect(cardX, cardY, cardW, cardH);
    ctx.restore();

    // Border emas tebal (Frame Utama)
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = isCompact ? 4 : 5;
    ctx.strokeRect(cardX, cardY, cardW, cardH);

    // Border kedua bagian dalam (Inner Inset Frame)
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.5;
    const inset = isCompact ? 6 : 8;
    ctx.strokeRect(cardX + inset, cardY + inset, cardW - inset * 2, cardH - inset * 2);

    // Aksen sudut pixel emas besar (Pixel Corner L-brackets)
    const bLen = isCompact ? 16 : 22;
    const bThick = isCompact ? 4 : 5;
    ctx.fillStyle = '#fbbf24';
    // Top-left
    ctx.fillRect(cardX + inset - 1, cardY + inset - 1, bLen, bThick);
    ctx.fillRect(cardX + inset - 1, cardY + inset - 1, bThick, bLen);
    // Top-right
    ctx.fillRect(cardX + cardW - inset - bLen + 1, cardY + inset - 1, bLen, bThick);
    ctx.fillRect(cardX + cardW - inset - bThick + 1, cardY + inset - 1, bThick, bLen);
    // Bottom-left
    ctx.fillRect(cardX + inset - 1, cardY + cardH - inset - bThick + 1, bLen, bThick);
    ctx.fillRect(cardX + inset - 1, cardY + cardH - inset - bLen + 1, bThick, bLen);
    // Bottom-right
    ctx.fillRect(cardX + cardW - inset - bLen + 1, cardY + cardH - inset - bThick + 1, bLen, bThick);
    ctx.fillRect(cardX + cardW - inset - bThick + 1, cardY + cardH - inset - bLen + 1, bThick, bLen);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 1. Label Arah Penyelaman (Cyan Terang - Huruf Sangat Jelas)
    const headerFontSize = isCompact ? 14 : 17;
    ctx.font = `bold ${headerFontSize}px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif`;
    ctx.fillStyle = '#38bdf8';
    const headerY = cy - (isCompact ? 50 : 60);
    ctx.fillText(
      isDescending ? '▼  MEMASUKI LAPISAN  ▼' : '▲  KEMBALI KE LAPISAN  ▲',
      cx,
      headerY
    );

    // 2. Nama Zona / Strata Besar (Ukuran Besar, Tajam, & Terbaca Sempurna)
    const hasDepth = Boolean(depthLabel && depthLabel.trim() !== '');
    const titleFontSize = isCompact
      ? (zoneName.length > 22 ? 22 : 28)
      : (zoneName.length > 22 ? 32 : 38);
    ctx.font = `800 ${titleFontSize}px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif`;

    // Glow teks kuning emas
    ctx.save();
    ctx.shadowColor = 'rgba(250, 204, 21, 0.5)';
    ctx.shadowBlur = 16;
    ctx.fillStyle = '#fef08a';
    const titleY = hasDepth ? cy : cy + (isCompact ? 12 : 16);
    ctx.fillText(zoneName, cx, titleY);
    ctx.restore();

    // 3. Label Kedalaman (Hanya jika lapisan memiliki kedalaman)
    if (hasDepth) {
      const depthFontSize = isCompact ? 13 : 16;
      ctx.font = `700 ${depthFontSize}px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif`;
      ctx.fillStyle = '#fbbf24';
      const depthY = cy + (isCompact ? 50 : 60);
      ctx.fillText(`KEDALAMAN: ${depthLabel}`, cx, depthY);
    }

    ctx.restore();
    ctx.textAlign = 'start';
    ctx.textBaseline = 'alphabetic';
  }
}
