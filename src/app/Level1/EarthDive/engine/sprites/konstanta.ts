/**
 * Konstanta Ukuran dan Ubin Dasar — bagian dari mesin gambar Earth Dive.
 *
 * Berkas ini dipecah dari sprites.ts (5.625 baris) agar tiap kelompok dapat
 * dicari tanpa menggulir melewati ribuan baris kode kelompok lain. Isi
 * fungsinya dipindahkan UTUH, tidak ditulis ulang.
 */

// ── TILE SIZE ──
export const TILE = 32;

export const PLAYER_FRAME_W = 24;

export const PLAYER_FRAME_H = 32;

// ── BACKWARDS COMPATIBILITY TILE DRAWING ──
export function drawGroundTile(ctx: CanvasRenderingContext2D, x: number, y: number, _zoneId?: string): void {
  ctx.fillStyle = '#3e2723';
  ctx.fillRect(x, y, TILE, TILE);
}

export function drawWallTile(ctx: CanvasRenderingContext2D, x: number, y: number, _zoneId?: string): void {
  ctx.fillStyle = '#1c100b';
  ctx.fillRect(x, y, TILE, TILE);
}

