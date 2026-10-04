import { getPlayerSheet } from '../../../utils/studentAvatarSheet';
import type { CustomAvatarConfig } from '../../../store/teacherStore';
import type { ZoneConfigL2, PlatformL2 } from './zones';
import { MAP_WIDTH_PX } from './zones';

export const TILE = 32;
export const PLAYER_FRAME_W = 24;
export const PLAYER_FRAME_H = 32;

// ── 1. RENDER KARAKTER SISWA (KUSTOM PROFIL SAMA SEPERTI LEVEL 1) ──
export function drawStudentCharacter(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  dir: 'left' | 'right',
  isWalking: boolean,
  walkFrame: number,
  onGround: boolean,
  vy: number,
  avatarConfig?: CustomAvatarConfig,
  zoneId?: string
): void {
  const sheet = getPlayerSheet(avatarConfig, zoneId);

  // Hitung frame sprite berdasarkan pose
  let srcX = 0;
  if (!onGround) {
    srcX = vy < 0 ? 5 * PLAYER_FRAME_W : 6 * PLAYER_FRAME_W; // Melompat / Jatuh
  } else if (isWalking) {
    srcX = (walkFrame % 4) * PLAYER_FRAME_W; // Langkah jalan
  } else {
    srcX = 0; // Diam (Idle)
  }

  ctx.save();
  ctx.translate(Math.round(px), Math.round(py));
  ctx.scale(dir === 'left' ? -1 : 1, 1);

  ctx.drawImage(
    sheet,
    srcX,
    0,
    PLAYER_FRAME_W,
    PLAYER_FRAME_H,
    -PLAYER_FRAME_W / 2,
    -PLAYER_FRAME_H,
    PLAYER_FRAME_W,
    PLAYER_FRAME_H
  );

  ctx.restore();
}

// ── 2. RENDER MEDAN ORGANIK MULTILAPIS (STRATA GEOLOGI ALAMI - SEPERTI LEVEL 1) ──
export function renderOrganicZoneTerrainL2(
  ctx: CanvasRenderingContext2D,
  zone: ZoneConfigL2
): void {
  const profile = zone.groundProfile;
  if (!profile) return;
  const w = profile.length;
  const h = 1600;

  // FONDASI SOLID DASAR MEDAN LEVEL 2 (100% ELIMINASI CELAH SUB-PIXEL)
  ctx.fillStyle = zone.id === 'area-mitigasi-gempa' ? '#0f172a' : '#09090b';
  ctx.beginPath();
  ctx.moveTo(0, h);
  for (let bx = 0; bx < w; bx += 4) {
    ctx.lineTo(bx, profile[bx] ?? 360);
  }
  ctx.lineTo(w, profile[w - 1] ?? 360);
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();

  const sw = 2.5;
  for (let x = 0; x < w; x += 2) {
    const gY = profile[x] ?? 360;

    if (zone.id === 'area-mitigasi-gempa') {
      // ══════════════════════════════════════════════════════════════════════
      // ZONA 1: RUANG KELAS SMP (MITIGASI GEMPA) - LANTAI PARKET KAYU
      // ══════════════════════════════════════════════════════════════════════
      // 1. Lapisan Subfloor Beton Dasar Gedung
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x, gY + 32, sw, h - (gY + 32));

      // 2. Cor Semen / Subfloor Rangka Lantai
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(x, gY + 14, sw, 18);
      ctx.fillStyle = '#334155';
      ctx.fillRect(x, gY + 12, sw, 3);

      // 3. Bilah Parket Kayu Ruang Kelas (Parquet Wood Planks)
      const plankIdx = Math.floor(x / 32);
      const isAltPlank = plankIdx % 2 === 0;
      ctx.fillStyle = isAltPlank ? '#92400e' : '#78350f';
      ctx.fillRect(x, gY + 4, sw, 8);

      // Permukaan Atas Bilah Kayu Terang
      ctx.fillStyle = isAltPlank ? '#b45309' : '#92400e';
      ctx.fillRect(x, gY + 1, sw, 3);

      // Garis Nat Vertikal Pemisah Bilah Kayu setiap 32px
      if (x % 32 === 0) {
        ctx.fillStyle = '#451a03';
        ctx.fillRect(x, gY, sw, 12);
      }

      // Lis Plint Lantai Kayu (Skirting Board) paling atas
      ctx.fillStyle = '#d97706';
      ctx.fillRect(x, gY, sw, 1);

      // Serat halus kayu (Wood Grain Texture)
      if ((x * 17) % 31 < 4) {
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(x, gY + 3, sw, 1);
      }
    } else {
      // ══════════════════════════════════════════════════════════════════════
      // ZONA 2: LERENG MERAPI (MITIGASI ERUPSI) - ABU ANDESIT & KALDERA
      // ══════════════════════════════════════════════════════════════════════
      // 1. Batuan Dasar Andesit-Basalt Masif (Bedrock dalam)
      ctx.fillStyle = '#090d16';
      ctx.fillRect(x, gY + 45, sw, h - (gY + 45));

      // 2. Strata Piroklastik & Lapisan Abu Mengendap
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(x, gY + 12, sw, 35);

      // Gelombang lapisan piroklastik
      const compWave = Math.floor(Math.sin(x * 0.03) * 6);
      ctx.fillStyle = '#334155';
      ctx.fillRect(x, gY + 22 + compWave, sw, 6);
      ctx.fillRect(x, gY + 36 - compWave, sw, 5);

      // Urat lava dingin & kuarsa andesitik
      ctx.fillStyle = '#64748b';
      ctx.fillRect(x, gY + 28 + compWave, sw, 2);

      // 3. Permukaan Tebing Andesit & Lapisan Abu Silika Vulkanik
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(x, gY, sw, 12);

      ctx.fillStyle = '#292524';
      ctx.fillRect(x, gY, sw, 4);

      ctx.fillStyle = '#44403c';
      ctx.fillRect(x, gY, sw, 1.5);

      // Fissure magma hangat & percikan pijar Merapi
      if ((x * 13) % 47 < 3) {
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(x, gY + 2, sw, 3);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(x, gY + 3, sw, 1);
      }
    }
  }
}

// ── CACHE KANVAS MEDAN ORGANIK UNTUK 60 FPS MULUS ──
let organicCacheCanvas: HTMLCanvasElement | null = null;
let organicCacheZoneId: string | null = null;

export function getOrganicTerrainCacheL2(zone: ZoneConfigL2): HTMLCanvasElement {
  if (organicCacheCanvas && organicCacheZoneId === zone.id) return organicCacheCanvas;

  const c = document.createElement('canvas');
  c.width = MAP_WIDTH_PX;
  c.height = 1600;
  const ctx = c.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  renderOrganicZoneTerrainL2(ctx, zone);

  organicCacheCanvas = c;
  organicCacheZoneId = zone.id;
  return c;
}

export function invalidateOrganicCacheL2(): void {
  organicCacheCanvas = null;
  organicCacheZoneId = null;
}

// ── RENDER PLATFORM & JEMBATAN ──
export function drawPlatformL2(
  ctx: CanvasRenderingContext2D,
  plat: PlatformL2,
  animTick: number
): void {
  const w = plat.x2 - plat.x1;
  const h = plat.h ?? 14;

  ctx.save();
  ctx.translate(plat.x1, plat.y);

  if (plat.type === 'cooled_crust') {
    // ── JEMBATAN KERAK BARU DARI MAGMA YANG MEMBEKU ──
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#292524';
    ctx.fillRect(0, 0, w, 4);

    ctx.fillStyle = '#57534e';
    ctx.fillRect(0, 0, w, 2);

    // Klem pengikat baja di ujung tebing
    ctx.fillStyle = '#44403c';
    ctx.fillRect(0, -2, 8, h + 4);
    ctx.fillRect(w - 8, -2, 8, h + 4);
    ctx.fillStyle = '#78716c';
    ctx.fillRect(2, 0, 4, 3);
    ctx.fillRect(w - 6, 0, 4, 3);

    // Urat magma membeku di dalam balok
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(10, 5, w - 20, 2);
    ctx.fillRect(16, 9, w - 32, 2);

    // Pendaran panas bawah jembatan
    const glow = Math.sin(animTick * 0.1) * 0.2 + 0.5;
    ctx.fillStyle = `rgba(234, 88, 12, ${glow * 0.4})`;
    ctx.fillRect(6, h, w - 12, 4);

    if (plat.label) {
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(plat.label, w / 2, -5);
    }
  } else if (plat.type === 'basalt_arch') {
    // ── JEMBATAN KARANG ANDESIT DI ATAS PALUNG LAUT DALAM ──
    // Badan dek jembatan batuan andesit kokoh (merentang penuh antar tebing)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, w, 5);

    ctx.fillStyle = '#334155';
    ctx.fillRect(0, 0, w, 2);

    // Undercarriage tumpuan karang andesit masif (Solid arched bedrock foundation)
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.quadraticCurveTo(w / 2, h + 8, w, h);
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();

    // Pilar abutment tebing kokoh di ujung kiri dan kanan tertanam rapat ke batuan
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, -2, 14, h + 20);
    ctx.fillRect(w - 14, -2, 14, h + 20);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(2, 0, 10, h + 16);
    ctx.fillRect(w - 12, 0, 10, h + 16);

    // Balustrade tiang batu pengaman karang & kabel baja
    const numPosts = 5;
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(6, -8);
    for (let i = 1; i < numPosts; i++) {
      const px = (w * i) / (numPosts - 1);
      ctx.lineTo(px, -6);
    }
    ctx.stroke();

    for (let i = 0; i < numPosts; i++) {
      const px = (w * i) / (numPosts - 1);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(px - 2, -10, 4, 10);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(px - 1, -11, 2, 2); // Lentera navigasi biru
    }

    if (plat.label) {
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(plat.label, w / 2, -16);
    }
  } else if (plat.type === 'wood_bridge') {
    // ── JEMBATAN PAPAN BANGKU KAYU KELAS KOKOH ──
    ctx.fillStyle = '#451a03';
    ctx.fillRect(0, 0, w, h);

    // Papan kayu tebal sekolah
    ctx.fillStyle = '#78350f';
    ctx.fillRect(0, 0, w, h - 3);

    ctx.fillStyle = '#92400e';
    ctx.fillRect(0, 0, w, 4);

    ctx.fillStyle = '#b45309';
    ctx.fillRect(0, 0, w, 2);

    // Garis sambungan bilah papan kayu setiap 16px
    for (let px = 16; px < w; px += 16) {
      ctx.fillStyle = '#451a03';
      ctx.fillRect(px - 1, 0, 2, h);
      // Paku keling pengikat
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(px - 3, 2, 2, 2);
      ctx.fillRect(px + 1, 2, 2, 2);
    }

    // Penyangga balok kayu diagonal di bawah
    ctx.fillStyle = '#5c2207';
    ctx.fillRect(4, h - 2, 8, 8);
    ctx.fillRect(w - 12, h - 2, 8, 8);

    // Tali tambang / pegangan tangan pengaman
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.lineTo(w, -6);
    ctx.stroke();

    // Tiang penyangga tali di ujung dan tengah
    for (const tx of [2, Math.floor(w / 2), w - 4]) {
      ctx.fillStyle = '#78350f';
      ctx.fillRect(tx - 1, -8, 4, 10);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(tx, -9, 2, 2);
    }

    if (plat.label) {
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(plat.label, w / 2, -14);
    }
  }

  ctx.restore();
}

// ── 2. RENDER DARATAN ALAMI BASALT (LAND SECTIONS) ──
export function drawLandSection(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
): void {
  ctx.save();

  // Batuan Basalt Hitam Arang
  ctx.fillStyle = '#18181b';
  ctx.fillRect(x, y, w, h);

  // Permukaan Atas Bertekstur Abu Gelap
  ctx.fillStyle = '#27272a';
  ctx.fillRect(x, y, w, 8);

  ctx.fillStyle = '#52525b';
  ctx.fillRect(x, y, w, 2);

  // Garis Retakan Magma Vertikal di Tepi Jurang
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(x + 1, y + 4, 2, h - 8);
  ctx.fillRect(x + w - 3, y + 4, 2, h - 8);

  ctx.fillStyle = '#f97316';
  ctx.fillRect(x + 2, y + 8, 1, h - 16);
  ctx.fillRect(x + w - 2, y + 8, 1, h - 16);

  // Lapisan Batuan Dalam
  ctx.fillStyle = '#09090b';
  for (let ly = y + 16; ly < y + h; ly += 18) {
    ctx.fillRect(x + 4, ly, w - 8, 3);
  }

  ctx.restore();
}

// ── 2B. RENDER DARATAN BATUAN ANDESIT & GRANIT TERLIPAT (BATAS KONVERGEN) ──
export function drawFoldedAndesite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
): void {
  ctx.save();

  // Tubuh Batuan Andesit Abu Gelap Kebiruan (High-Density Rock)
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x, y, w, h);

  // Permukaan Atas Tebing Lipatan (Slate Cap)
  ctx.fillStyle = '#334155';
  ctx.fillRect(x, y, w, 8);

  ctx.fillStyle = '#64748b';
  ctx.fillRect(x, y, w, 2);

  // Lapisan Batuan Terlipat (Sedimentary & Igneous Strata Foliasi Kompresi)
  ctx.fillStyle = '#0f172a';
  for (let ly = y + 14; ly < y + h; ly += 16) {
    ctx.fillRect(x + 2, ly, w - 4, 3);
  }

  // Urat Granit & Kuarsa Tertekan (Garis Abu-Abu Terang / Porphyritic Flecks)
  ctx.fillStyle = '#94a3b8';
  for (let fx = x + 12; fx < x + w - 10; fx += 28) {
    ctx.fillRect(fx, y + 10, 4, 2);
    ctx.fillRect(fx + 8, y + 24, 3, 2);
    ctx.fillRect(fx - 4, y + 38, 5, 2);
  }

  // Rekahan Tektonik Kompresi di Tepi Tebing
  ctx.fillStyle = '#090d16';
  ctx.fillRect(x, y + 4, 3, h - 4);
  ctx.fillRect(x + w - 3, y + 4, 3, h - 4);

  ctx.restore();
}

// ── 2C. RENDER PANTAI PASIR HITAM VULKANIK (PALUNG KONVERGEN) ──
export function drawBlackSandBeach(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
): void {
  ctx.save();

  // Lapisan Pasir Vulkanik Hitam Arang
  ctx.fillStyle = '#18181b';
  ctx.fillRect(x, y, w, h);

  // Permukaan Pasir Halus Gelap
  ctx.fillStyle = '#27272a';
  ctx.fillRect(x, y, w, 6);

  ctx.fillStyle = '#3f3f46';
  ctx.fillRect(x, y, w, 2);

  // Bintik Pasir Magnetit Vulkanik (Mineral Glitter)
  ctx.fillStyle = '#52525b';
  for (let px = x + 6; px < x + w - 6; px += 18) {
    ctx.fillRect(px, y + 4, 2, 1);
    ctx.fillRect(px + 9, y + 10, 1, 1);
  }

  // Zona Basah Tepi Laut (Garis Kilap Air Laut Pasang)
  ctx.fillStyle = '#0369a1';
  ctx.fillRect(x + w - 12, y, 12, 3);

  ctx.restore();
}

// ── 3. RENDER DARATAN BARU (MAGMA YANG SUDAH MEMBEKU) ──
export function drawCooledCrustBridge(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
): void {
  ctx.save();

  // Balok Kerak Basalt Baru Beku (Warna Abu-Abu Gelap dengan Pendaran Dingin)
  ctx.fillStyle = '#27272a';
  ctx.fillRect(x, y, w, h);

  // Permukaan Kerak Baru
  ctx.fillStyle = '#3f3f46';
  ctx.fillRect(x, y, w, 6);

  ctx.fillStyle = '#71717a';
  ctx.fillRect(x, y, w, 2);

  // Urat-urat Magma yang Mendingin (Garis Merah Tua)
  ctx.fillStyle = '#991b1b';
  ctx.fillRect(x + 4, y + 10, w - 8, 2);
  ctx.fillRect(x + 10, y + 18, w - 20, 2);
  ctx.fillRect(x + 6, y + 26, w - 12, 2);


  ctx.restore();
}

// ── 4. RENDER JURANG MAGMA AKTIF DI DASAR CELAH ──
export function drawChasmMagma(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  animTick: number
): void {
  ctx.save();

  // Dasar Magma Pijar
  ctx.fillStyle = '#7c2d12';
  ctx.fillRect(x, y, w, h);

  ctx.fillStyle = '#dc2626';
  ctx.fillRect(x, y + 4, w, h - 4);

  // Permukaan Magma Bergejolak
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(x, y, w, 5);

  const offset = (animTick * 1.2) % 20;
  ctx.fillStyle = '#facc15';
  ctx.fillRect(x + offset, y + 1, Math.min(10, w - offset), 2);

  // Pendaran Panas ke Atas Jurang
  const grad = ctx.createLinearGradient(0, y, 0, y - 40);
  grad.addColorStop(0, 'rgba(234, 88, 12, 0.45)');
  grad.addColorStop(1, 'rgba(234, 88, 12, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(x, y - 40, w, 40);

  // Percikan Bara Api Melayang dari Celah
  const emberPhase = (animTick % 40) / 40;
  const emberY = y - emberPhase * 35;
  const emberX = x + w / 2 + Math.sin(animTick * 0.15) * 6;
  ctx.fillStyle = `rgba(250, 204, 21, ${1 - emberPhase})`;
  ctx.fillRect(emberX, emberY, 2, 2);

  ctx.restore();
}

// ── 4B. RENDER PALUNG LAUT DALAM (DEEP SEA TRENCH ABYSS) ──
export function drawDeepTrenchWater(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  animTick: number
): void {
  ctx.save();

  // Dasar Kedalaman Samudra (Ultra Deep Abyss Midnight Navy - Mengisi Penuh Jurang Palung tanpa Celah)
  ctx.fillStyle = '#020617';
  ctx.fillRect(x - 2, y, w + 4, h + 10);

  // Gradien Kedalaman Tekanan Tinggi Samudra Abisal
  const depthGrad = ctx.createLinearGradient(0, y, 0, y + h);
  depthGrad.addColorStop(0, '#0c4a6e'); // Permukaan air laut cyan-navy
  depthGrad.addColorStop(0.25, '#075985');
  depthGrad.addColorStop(0.6, '#082f49');
  depthGrad.addColorStop(1, '#020617'); // Dasar abisal gelap pekat
  ctx.fillStyle = depthGrad;
  ctx.fillRect(x - 2, y, w + 4, h + 10);

  // Permukaan Air Beriak Tepat di Bawah Dek Jembatan (y + 14)
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(x, y + 14, w, 5);

  // Buih & Riak Ombak Palung
  const waveShift = (animTick * 0.8) % 30;
  ctx.fillStyle = '#38bdf8';
  for (let wx = x; wx < x + w; wx += 20) {
    const rx = wx + waveShift;
    if (rx < x + w - 4) {
      ctx.fillRect(rx, y + 15, 10, 2);
    }
  }

  // Efek Tekanan Abisal (Gelombang Cahaya & Arus Kedalaman Samudra)
  const pulseAlpha = Math.sin(animTick * 0.05) * 0.15 + 0.25;
  ctx.fillStyle = `rgba(14, 165, 233, ${pulseAlpha})`;
  ctx.fillRect(x + 4, y + 26, w - 8, 3);
  ctx.fillRect(x + 12, y + 46, w - 24, 3);
  ctx.fillRect(x + 20, y + 70, w - 40, 2);

  // Berkas Cahaya Matahari Bawah Air (Sunlight God-Rays Penetration)
  for (let r = 0; r < 3; r++) {
    const rx = x + 30 + r * 55 + Math.sin(animTick * 0.04 + r) * 8;
    const rayGrad = ctx.createLinearGradient(rx, y, rx + 15, y + 70);
    rayGrad.addColorStop(0, 'rgba(56, 189, 248, 0.22)');
    rayGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = rayGrad;
    ctx.beginPath();
    ctx.moveTo(rx, y);
    ctx.lineTo(rx + 22, y);
    ctx.lineTo(rx + 42, y + 70);
    ctx.lineTo(rx + 12, y + 70);
    ctx.closePath();
    ctx.fill();
  }

  // Partikel Laut Melayang (Marine Snow & Bubbles)
  for (let p = 0; p < 8; p++) {
    const pPhase = ((animTick * 0.35 + p * 15) % 60) / 60;
    const py = y + h - pPhase * h;
    const px = x + ((p * 27 + animTick * 0.3) % (w - 12)) + 6;
    ctx.fillStyle = `rgba(186, 230, 253, ${0.85 * (1 - pPhase)})`;
    ctx.fillRect(px, py, 2, 2);
  }

  // Label Peringatan Jurang Palung Laut
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('PALUNG LAUT DALAM', x + w / 2, y + h - 14);

  ctx.restore();
}

// ── 4C. RENDER RETAKAN LANTAI RUANG KELAS & PUING BETON (AREA 4) ──
export function drawClassroomFloorRubble(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  animTick: number
): void {
  ctx.save();

  // Ruang hampa di bawah lantai yang retak
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x, y, w, h);

  // Balok beton cor yang retak di dasar
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x, y + 8, w, h - 8);

  ctx.fillStyle = '#334155';
  ctx.fillRect(x + 4, y + 14, w - 8, h - 18);

  // Reruntuhan pecahan parket kayu yang patah ke bawah
  for (let i = 0; i < 6; i++) {
    const rx = x + 10 + i * 18;
    const ry = y + 12 + (i % 3) * 6;
    ctx.fillStyle = '#78350f';
    ctx.fillRect(rx, ry, 12, 4);
    ctx.fillStyle = '#92400e';
    ctx.fillRect(rx + 2, ry, 8, 2);
  }

  // Pita pembatas peringatan kuning-hitam di pinggir atas lantai retak
  const tapeW = Math.min(w, 40);
  const stripeOffset = Math.floor(animTick * 0.5) % 8;
  ctx.fillStyle = '#eab308';
  ctx.fillRect(x + 2, y + 1, tapeW, 3);
  for (let s = -8; s < tapeW; s += 8) {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 2 + ((s + stripeOffset) % tapeW), y + 1, 4, 3);
  }

  // Debu semen melayang pelan dari celah retakan lantai
  for (let d = 0; d < 5; d++) {
    const dustSpeed = 0.4 + (d % 2) * 0.2;
    const dustY = y - 6 - ((animTick * dustSpeed + d * 15) % 25);
    const dustX = x + 8 + ((d * 22 + Math.sin(animTick * 0.05 + d) * 6) % (w - 16));
    ctx.fillStyle = 'rgba(203, 213, 225, 0.4)';
    ctx.fillRect(dustX, dustY, 2, 2);
  }

  ctx.restore();
}

// ── 5. RENDER KAPSUL SIAGA LANDER (STASIUN OBSERVASI AWAL) ──
export function drawLanderCapsule(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  animTick: number
): void {
  ctx.save();
  ctx.translate(px, py);

  // Landing Struts / Legs
  ctx.strokeStyle = '#71717a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-16, 0);
  ctx.lineTo(-24, 10);
  ctx.lineTo(-28, 10);
  ctx.moveTo(16, 0);
  ctx.lineTo(24, 10);
  ctx.lineTo(28, 10);
  ctx.stroke();

  // Capsule Main Body (White & Orange Research Capsule)
  ctx.fillStyle = '#18181b';
  ctx.fillRect(-20, -40, 40, 40);

  ctx.fillStyle = '#f8fafc'; // White Hull
  ctx.fillRect(-18, -38, 36, 36);

  ctx.fillStyle = '#ea580c'; // Orange Striping
  ctx.fillRect(-18, -22, 36, 8);

  // Cockpit Window Dome
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(-9, -34, 18, 9);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(-7, -32, 14, 5);
  ctx.fillStyle = '#e0f2fe';
  ctx.fillRect(-5, -31, 5, 2);

  // Spinning Radar on Top
  const dishOffset = Math.sin(animTick * 0.08) * 5;
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(dishOffset, -45, 6, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ca8a04';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Blinking Beacon
  const beaconOn = Math.floor((animTick % 30) / 15) === 0;
  ctx.fillStyle = beaconOn ? '#22c55e' : '#15803d';
  ctx.fillRect(-16, -42, 3, 3);

  // Sign Label
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-26, -56, 52, 11);
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('', 0, -48);

  ctx.restore();
}

// ── 6. RENDER CATATAN GEOLOGIS ("i" SIGN BOARD) — PERSIS SEPERTI LEVEL 1 ──
export function drawInfoSign(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number
): void {
  ctx.save();

  // Plat besi dasar kokoh tepat rata menempel di tanah (y + 29 s.d. y + 32)
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x - 9, y + 29, 18, 3);

  // Tiang kayu kokoh menopang papan dari y + 14 hingga y + 29
  ctx.fillStyle = '#451a03';
  ctx.fillRect(x - 3, y + 14, 6, 15);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x - 2, y + 14, 3, 15);

  // Papan kayu dengan bingkai kayu gelap & kertas perkamen
  ctx.fillStyle = '#271002';
  ctx.fillRect(x - 13, y + 1, 26, 16);
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(x - 11, y + 3, 22, 12);

  // Huruf "i" biru geologis yang tegas
  ctx.fillStyle = '#1d4ed8';
  ctx.fillRect(x - 2, y + 5, 4, 2); // Titik i
  ctx.fillRect(x - 2, y + 8, 4, 5); // Garis i

  ctx.restore();
}

// ── 7. RENDER TEMUAN GEOLOGIS (EXPEDITION SURVEY POD) — PERSIS SEPERTI LEVEL 1 ──
export function drawDiscoveryTotem(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  animTick: number
): void {
  const pulse = Math.sin(animTick * 0.06) * 0.2 + 0.8;

  ctx.save();

  // Kaki tripod instrumen survei geologis menancap di tanah menembus kemiringan lereng
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x - 12, y + 28, 6, 6); // Bantalan kaki kiri
  ctx.fillRect(x + 6, y + 28, 6, 6);  // Bantalan kaki kanan
  ctx.fillRect(x - 11, y + 28, 22, 3); // Palang penyangga dasar

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x - 10, y + 16, 3, 14);
  ctx.fillRect(x + 7, y + 16, 3, 14);
  ctx.fillStyle = '#475569';
  ctx.fillRect(x - 2, y + 14, 4, 16); // Tiang teleskopik tengah

  // Pod sensor / holo-display geologis
  ctx.globalAlpha = pulse;
  ctx.fillStyle = '#facc15';
  ctx.fillRect(x - 8, y + 2, 16, 14);
  ctx.fillStyle = '#ca8a04';
  ctx.fillRect(x - 6, y + 4, 12, 10);
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(x - 4, y + 6, 8, 6);

  // Ikon geologi / mineral di layar
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x - 2, y + 7, 4, 2);
  ctx.fillRect(x - 1, y + 9, 2, 2);
  ctx.globalAlpha = 1;

  // Label Banner
  const bob = Math.sin(animTick * 0.08) * 3;
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('TEMUAN GEOLOGI', x, y - 6 + bob);

  ctx.restore();
}

// ── 8. RENDER KRISTAL TEKTONIK ──
export function drawCrystal(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  animTick: number
): void {
  ctx.save();
  ctx.translate(x, y);

  const bob = Math.sin(animTick * 0.1) * 3;
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.moveTo(0, -12 + bob);
  ctx.lineTo(8, bob);
  ctx.lineTo(0, 12 + bob);
  ctx.lineTo(-8, bob);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.moveTo(0, -8 + bob);
  ctx.lineTo(5, bob);
  ctx.lineTo(0, 8 + bob);
  ctx.lineTo(-5, bob);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

// ── 9. RENDER SUMUR BOR EKSTRAKSI (FORWARD GATE / EXIT PORTAL ALA LEVEL 1) ──
export function drawGeothermalShaftPortal(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  animTick: number,
  isUnlocked: boolean,
  labelText: string = '▼ PORTAL BERIKUTNYA ▼'
): void {
  ctx.save();
  ctx.translate(x, y);

  // Kaki bantalan baja masif menancap kokoh ke batuan (y - 4 -> y + 8)
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-20, -10, 40, 10);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-16, -12, 32, 4);

  // Collar silinder luar kepala bor (Outer wellhead collar)
  ctx.fillStyle = isUnlocked ? '#065f46' : '#334155';
  ctx.fillRect(-14, -28, 28, 18);
  ctx.fillStyle = isUnlocked ? '#059669' : '#475569';
  ctx.fillRect(-12, -32, 24, 6);

  // Flens baut industri melingkar
  ctx.fillStyle = isUnlocked ? '#34d399' : '#64748b';
  for (let bx = -10; bx <= 8; bx += 6) {
    ctx.fillRect(bx, -31, 3, 3);
  }

  // Pola garis peringatan keselamatan (Industrial safety hazard stripes)
  for (let i = -14; i <= 10; i += 8) {
    ctx.fillStyle = isUnlocked ? '#10b981' : '#facc15';
    ctx.fillRect(i, -20, 4, 4);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(i + 4, -20, 4, 4);
  }

  // Bukaan poros sumur bor dengan gradien kedalaman
  const shaftGrad = ctx.createLinearGradient(0, -32, 0, -4);
  if (isUnlocked) {
    shaftGrad.addColorStop(0, '#059669');
    shaftGrad.addColorStop(0.5, '#047857');
    shaftGrad.addColorStop(1, '#064e3b');
  } else {
    shaftGrad.addColorStop(0, '#0284c7');
    shaftGrad.addColorStop(0.5, '#1e1b4b');
    shaftGrad.addColorStop(1, '#020617');
  }
  ctx.fillStyle = shaftGrad;
  ctx.fillRect(-8, -28, 16, 24);

  // Uap panas geotermal membubung dari sumur bor
  for (let v = 0; v < 3; v++) {
    const vProg = ((animTick * 0.6 + v * 20) % 36) / 36;
    const vx = Math.sin(animTick * 0.1 + v) * 4 + (v - 1) * 3;
    const vy = -26 - vProg * 28;
    const vr = 2 + vProg * 5;
    ctx.fillStyle = isUnlocked
      ? `rgba(167, 243, 208, ${(1 - vProg) * 0.6})`
      : `rgba(224, 242, 254, ${(1 - vProg) * 0.5})`;
    ctx.beginPath();
    ctx.arc(vx, vy, vr, 0, Math.PI * 2);
    ctx.fill();
  }

  // Banner hologram penanda tujuan
  const bob = Math.sin(animTick * 0.08) * 3;
  ctx.font = 'bold 8.5px "Plus Jakarta Sans", sans-serif';
  const textW = ctx.measureText(labelText).width;
  const bannerW = Math.max(90, Math.round(textW + 18));
  ctx.fillStyle = isUnlocked ? 'rgba(6, 78, 59, 0.95)' : 'rgba(15, 23, 42, 0.95)';
  ctx.fillRect(-bannerW / 2, -56 + bob, bannerW, 16);
  ctx.strokeStyle = isUnlocked ? '#34d399' : '#f59e0b';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-bannerW / 2, -56 + bob, bannerW, 16);

  ctx.fillStyle = isUnlocked ? '#fef08a' : '#facc15';
  ctx.textAlign = 'center';
  ctx.fillText(labelText, 0, -44 + bob);

  ctx.restore();
}

// ── 10. RENDER LIFT PNEUMATIK (RETURN HOIST / BACK PORTAL ALA LEVEL 1) ──
export function drawAscentHoistPortal(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  animTick: number,
  labelText: string = '▲ KEMBALI KE AREA 1 ▲'
): void {
  ctx.save();
  ctx.translate(x, y);

  // Kaki jangkar baja tebal di lantai batuan
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-18, -4, 36, 6);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-14, -8, 28, 4);

  // Tiang rel panduan vertikal
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-14, -55, 6, 52);
  ctx.fillRect(8, -55, 6, 52);

  // Rangka sangkar keselamatan bergaris kuning
  ctx.fillStyle = '#eab308';
  ctx.fillRect(-12, -55, 2, 52);
  ctx.fillRect(10, -55, 2, 52);

  // Kisi tangga / kabel traksi lift
  ctx.fillStyle = '#64748b';
  for (let r = -50; r < -8; r += 8) {
    ctx.fillRect(-8, r, 16, 2);
  }

  // Sinar energi traksi vertikal
  const pulse = Math.sin(animTick * 0.1) * 0.25 + 0.75;
  ctx.fillStyle = `rgba(14, 165, 233, ${0.28 * pulse})`;
  ctx.fillRect(-8, -50, 16, 44);

  // Banner hologram ke atas
  const bob = Math.sin(animTick * 0.08) * 3;
  ctx.font = 'bold 8.5px "Plus Jakarta Sans", sans-serif';
  const textW2 = ctx.measureText(labelText).width;
  const bannerW2 = Math.max(90, Math.round(textW2 + 18));
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.fillRect(-bannerW2 / 2, -76 + bob, bannerW2, 16);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-bannerW2 / 2, -76 + bob, bannerW2, 16);

  ctx.fillStyle = '#7dd3fc';
  ctx.textAlign = 'center';
  ctx.fillText(labelText, 0, -64 + bob);

  ctx.restore();
}

// ── 11. RENDER GERBANG SEISMIK HIDROLIK (GERBANG EVALUASI TEKTONIK ALA LEVEL 1) ──
export function drawSeismicVaultGate(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  isUnlocked: boolean,
  animTick: number,
  label: string = 'GERBANG EVALUASI'
): void {
  ctx.save();
  ctx.translate(x, y);

  // Bantalan pondasi baja kiri & kanan tertanam kuat ke dalam tanah
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-28, -6, 20, 8);
  ctx.fillRect(8, -6, 20, 8);

  // Kolom vertikal paduan titanium seismik
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-26, -65, 14, 60);
  ctx.fillRect(12, -65, 14, 60);

  // Silinder hidrolik peredam gempa pada kolom
  ctx.fillStyle = '#64748b';
  ctx.fillRect(-22, -55, 6, 42);
  ctx.fillRect(16, -55, 6, 42);

  // Garis keselamatan industri hitam & kuning pada pilar
  for (let sy = -50; sy < -10; sy += 10) {
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-26, sy, 14, 5);
    ctx.fillRect(12, sy, 14, 5);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-26, sy + 5, 14, 5);
    ctx.fillRect(12, sy + 5, 14, 5);
  }

  // Lengkungan atas kubah seismik (Curved Vault Arch Canopy)
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(0, -65, 28, Math.PI, 0);
  ctx.lineTo(26, -65);
  ctx.arc(0, -65, 12, 0, Math.PI, true);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, -65, 28, Math.PI, 0);
  ctx.stroke();

  if (isUnlocked) {
    // ── STATUS TERBUKA: RADIASI MEDAN ENERGI HIJAU ──
    const pulse = Math.sin(animTick * 0.1) * 0.15 + 0.35;
    ctx.fillStyle = `rgba(34, 197, 94, ${pulse})`;
    ctx.fillRect(-12, -65, 24, 65);

    // Lampu hijau di puncak kubah
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(0, -96, 5, 0, Math.PI * 2);
    ctx.fill();

    // Banner Terbuka
    ctx.fillStyle = 'rgba(6, 78, 59, 0.95)';
    ctx.fillRect(-35, -42, 70, 14);
    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-35, -42, 70, 14);

    ctx.fillStyle = '#4ade80';
    ctx.font = '900 10.5px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TERBUKA', 0, -32);
  } else {
    // ── STATUS TERKUNCI: MEDAN PENGHALANG LASER MERAH PULSATIF ──
    const pulse = Math.sin(animTick * 0.15) * 0.2 + 0.8;

    // Lampu strobo merah berkedip di puncak kubah
    const strobe = (animTick % 30 < 15);
    ctx.fillStyle = strobe ? '#ef4444' : '#7f1d1d';
    ctx.fillRect(-4, -98, 8, 6);
    if (strobe) {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.45)';
      ctx.beginPath();
      ctx.arc(0, -95, 12, 0, Math.PI * 2);
      ctx.fill();
    }

    // Garis laser pengaman vertikal
    ctx.fillStyle = `rgba(239, 68, 68, ${pulse})`;
    for (let lx = -9; lx <= 9; lx += 4) {
      ctx.fillRect(lx, -65, 2, 65);
    }

    // Hologram Ikon Gembok & Keterangan
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.fillRect(-55, -45, 110, 16);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-55, -45, 110, 16);

    ctx.fillStyle = '#fca5a5';
    ctx.font = '900 9.5px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, 0, -34);
  }

  ctx.restore();
}

// Alias for backward compatibility
export const drawChallengeGate = drawSeismicVaultGate;

