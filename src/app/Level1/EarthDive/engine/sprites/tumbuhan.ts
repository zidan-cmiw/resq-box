/**
 * Tumbuhan — bagian dari mesin gambar Earth Dive.
 *
 * Berkas ini dipecah dari sprites.ts (5.625 baris) agar tiap kelompok dapat
 * dicari tanpa menggulir melewati ribuan baris kode kelompok lain. Isi
 * fungsinya dipindahkan UTUH, tidak ditulis ulang.
 */

import { MAP_WIDTH_PX } from '../zones';

/**
 * 1. Pinus Alpin Runcing (Tall Serrated Alpine Pine) dengan akar adaptif kontur lereng
 */
export function drawPineTree(ctx: CanvasRenderingContext2D, x: number, groundY: number, s: number = 1.0, gProf?: number[]): void {
  // Batang kayu bertekstur serat alami
  const trunkW = Math.max(5, Math.floor(7 * s));
  const trunkH = Math.floor(34 * s);
  ctx.fillStyle = '#271002';
  ctx.fillRect(x - Math.floor(trunkW / 2), groundY - trunkH, trunkW, trunkH);
  ctx.fillStyle = '#5c3520';
  ctx.fillRect(x - Math.floor(trunkW / 2) + 1, groundY - trunkH + 2, Math.max(2, trunkW - 3), trunkH - 2);

  // Akar mencengkeram tanah secara kokoh menyesuaikan kontur lereng gProf
  const leftX = x - trunkW - 4;
  const rightX = x + trunkW + 4;
  const leftY = (gProf ? gProf[Math.max(0, Math.floor(leftX))] : groundY) ?? groundY;
  const maxW = gProf ? gProf.length : MAP_WIDTH_PX;
  const rightY = (gProf ? gProf[Math.min(maxW - 1, Math.floor(rightX))] : groundY) ?? groundY;

  ctx.fillStyle = '#271002';
  ctx.beginPath();
  ctx.moveTo(leftX, leftY + 3);
  ctx.lineTo(x - Math.floor(trunkW / 2), groundY - 6);
  ctx.lineTo(x + Math.floor(trunkW / 2), groundY - 6);
  ctx.lineTo(rightX, rightY + 3);
  ctx.lineTo(x, Math.max(leftY, rightY) + 5);
  ctx.closePath();
  ctx.fill();

  // Rumput/lumut alami di sekitar pangkal akar (merangkul tanah)
  ctx.fillStyle = '#15803d';
  ctx.fillRect(leftX, leftY - 1, 4, 3);
  ctx.fillRect(rightX - 4, rightY - 1, 4, 3);
  ctx.fillRect(x - 2, groundY - 1, 4, 2);

  // 4 Tingkat tajuk daun pinus bergerigi asimetris
  const tiers = [
    { yOff: 22 * s, w: 22 * s, h: 14 * s },
    { yOff: 34 * s, w: 18 * s, h: 13 * s },
    { yOff: 45 * s, w: 14 * s, h: 12 * s },
    { yOff: 55 * s, w: 8 * s, h: 10 * s },
  ];

  for (const t of tiers) {
    const ty = groundY - t.yOff;
    // Bayangan bawah daun pekat
    ctx.fillStyle = '#052e16';
    ctx.beginPath();
    ctx.moveTo(x - t.w, ty + 2);
    ctx.lineTo(x, ty - t.h);
    ctx.lineTo(x + t.w, ty + 2);
    ctx.fill();

    // Daun hijau hutan
    ctx.fillStyle = '#14532d';
    ctx.beginPath();
    ctx.moveTo(x - t.w * 0.9, ty);
    ctx.lineTo(x, ty - t.h * 0.95);
    ctx.lineTo(x + t.w * 0.9, ty);
    ctx.fill();

    // Highlight pucuk jarum pinus terkena sinar matahari
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.moveTo(x - t.w * 0.6, ty - 1);
    ctx.lineTo(x, ty - t.h * 0.95);
    ctx.lineTo(x + t.w * 0.2, ty - 1);
    ctx.fill();

    ctx.fillStyle = '#86efac';
    ctx.fillRect(x - 1, ty - t.h, 2, 2);
  }
}

/**
 * 2. Pohon Ek Berdaun Lebar & Berkelompok (Spreading Mountain Oak) dengan jangkar akar lereng
 */

/**
 * 2. Pohon Ek Berdaun Lebar & Berkelompok (Spreading Mountain Oak) dengan jangkar akar lereng
 */
export function drawOakTree(ctx: CanvasRenderingContext2D, x: number, groundY: number, s: number = 1.0, gProf?: number[]): void {
  const trunkW = Math.max(6, Math.floor(8 * s));
  const trunkH = Math.floor(28 * s);

  // Batang kokoh bercabang
  ctx.fillStyle = '#382012';
  ctx.fillRect(x - Math.floor(trunkW / 2), groundY - trunkH, trunkW, trunkH);
  ctx.fillStyle = '#6b3c1b';
  ctx.fillRect(x - Math.floor(trunkW / 2) + 2, groundY - trunkH + 2, Math.max(2, trunkW - 4), trunkH - 2);

  // Cabang kiri dan kanan
  ctx.fillStyle = '#382012';
  ctx.fillRect(x - 10 * s, groundY - trunkH + 4, 8 * s, 4 * s);
  ctx.fillRect(x + 4 * s, groundY - trunkH + 2, 8 * s, 4 * s);

  // Akar mencengkeram tanah mengikuti kemiringan lereng
  const leftX = x - trunkW - 5;
  const rightX = x + trunkW + 5;
  const leftY = (gProf ? gProf[Math.max(0, Math.floor(leftX))] : groundY) ?? groundY;
  const maxW = gProf ? gProf.length : MAP_WIDTH_PX;
  const rightY = (gProf ? gProf[Math.min(maxW - 1, Math.floor(rightX))] : groundY) ?? groundY;

  ctx.fillStyle = '#382012';
  ctx.beginPath();
  ctx.moveTo(leftX, leftY + 3);
  ctx.lineTo(x - Math.floor(trunkW / 2), groundY - 5);
  ctx.lineTo(x + Math.floor(trunkW / 2), groundY - 5);
  ctx.lineTo(rightX, rightY + 3);
  ctx.lineTo(x, Math.max(leftY, rightY) + 5);
  ctx.closePath();
  ctx.fill();

  // Kluster kanopi daun awan organik (Terraria Canopy Style)
  const canopies = [
    { cx: x - 9 * s, cy: groundY - trunkH - 4 * s, r: 13 * s },
    { cx: x + 9 * s, cy: groundY - trunkH - 6 * s, r: 14 * s },
    { cx: x, cy: groundY - trunkH - 14 * s, r: 16 * s },
  ];

  for (const c of canopies) {
    // Shadow
    ctx.fillStyle = '#064e3b';
    ctx.beginPath();
    ctx.arc(c.cx, c.cy + 3, c.r, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = '#047857';
    ctx.beginPath();
    ctx.arc(c.cx, c.cy, c.r * 0.92, 0, Math.PI * 2);
    ctx.fill();

    // Highlight
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(c.cx - 2, c.cy - 3, c.r * 0.65, 0, Math.PI * 2);
    ctx.fill();

    // Sunlit tip
    ctx.fillStyle = '#6ee7b7';
    ctx.fillRect(c.cx - 3, c.cy - c.r * 0.75, 6, 3);
  }

  // Rumput di pangkal akar
  ctx.fillStyle = '#15803d';
  ctx.fillRect(leftX, leftY - 1, 5, 3);
  ctx.fillRect(rightX - 5, rightY - 1, 5, 3);
}

/**
 * 3. Semak Belukar Pegunungan Rendah (Alpine Berry Shrub)
 */

/**
 * 3. Semak Belukar Pegunungan Rendah (Alpine Berry Shrub)
 */
export function drawShrub(ctx: CanvasRenderingContext2D, x: number, groundY: number, s: number = 1.0, gProf?: number[]): void {
  const w = 18 * s;
  const h = 10 * s;
  const realY = (gProf ? gProf[Math.floor(x)] : groundY) ?? groundY;

  ctx.fillStyle = '#064e3b';
  ctx.beginPath();
  ctx.ellipse(x, realY - h * 0.5 + 1, w * 0.5, h * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#059669';
  ctx.beginPath();
  ctx.ellipse(x, realY - h * 0.6, w * 0.45, h * 0.45, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#34d399';
  ctx.beginPath();
  ctx.ellipse(x - 2, realY - h * 0.75, w * 0.28, h * 0.25, 0, 0, Math.PI * 2);
  ctx.fill();

  // Bintik buah beri merah pegunungan
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(x - 4, realY - 5, 2, 2);
  ctx.fillRect(x + 3, realY - 7, 2, 2);
  ctx.fillRect(x, realY - 8, 2, 2);
}
