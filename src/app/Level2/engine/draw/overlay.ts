// ── engine/draw/overlay.ts ────────────────────────────────────────────────
// Lapisan tampilan di atas dunia permainan: hitung mundur QTE, pengukur waktu
// gempa, ajakan evakuasi, ajakan berinteraksi dengan NPC, suasana mitigasi
// gunung, dan prompt interaksi umum.
//
// Dipisahkan dari renderer.ts (Langkah 4 dari pemecahan berkas).
// Terbukti mandiri: hanya bergantung pada ./base.
//
// ATURAN: hanya boleh mengimpor dari ./base.

import { drawRealisticVolcanicSmoke } from './base';

export function drawSimulationQteOverlay(
  ctx: CanvasRenderingContext2D,
  viewW: number,
  viewH: number,
  timer: number,
  maxTimer: number,
  animTick: number,
  scenario: 'moderate' | 'severe' = 'severe'
): void {
  const isModerate = scenario === 'moderate';
  const cx = viewW / 2;
  const isCompact = viewW < 800;
  const cardW = Math.min(viewW - 24, isCompact ? 520 : 860);
  const cardH = isCompact ? 164 : 220;
  const cardX = cx - cardW / 2;
  const cardY = isCompact ? 76 : Math.max(88, Math.min(125, Math.floor(viewH * 0.10)));

  ctx.save();

  // Background kartu retro arcade gelap pekat
  ctx.fillStyle = 'rgba(11, 17, 32, 0.97)';
  ctx.fillRect(cardX, cardY, cardW, cardH);

  // Border berdenyut (Amber untuk gempa sedang, Merah untuk gempa besar)
  const pulseBorder = (animTick % 30 < 15);
  ctx.strokeStyle = isModerate
    ? (pulseBorder ? '#fde047' : '#d97706')
    : (pulseBorder ? '#f87171' : '#dc2626');
  ctx.lineWidth = isCompact ? 3 : 4;
  ctx.strokeRect(cardX, cardY, cardW, cardH);

  // Sudut-sudut retro pixel
  ctx.fillStyle = isModerate ? '#facc15' : '#f87171';
  const cSz = isCompact ? 10 : 14;
  const cTh = isCompact ? 3 : 4;
  ctx.fillRect(cardX + 4, cardY + 4, cSz, cTh);
  ctx.fillRect(cardX + 4, cardY + 4, cTh, cSz);
  ctx.fillRect(cardX + cardW - 4 - cSz, cardY + 4, cSz, cTh);
  ctx.fillRect(cardX + cardW - 4 - cTh, cardY + 4, cTh, cSz);
  ctx.fillRect(cardX + 4, cardY + cardH - 4 - cTh, cSz, cTh);
  ctx.fillRect(cardX + 4, cardY + cardH - 4 - cSz, cTh, cSz);
  ctx.fillRect(cardX + cardW - 4 - cSz, cardY + cardH - 4 - cTh, cSz, cTh);
  ctx.fillRect(cardX + cardW - 4 - cTh, cardY + cardH - 4 - cSz, cTh, cSz);

  // Baris 1: Judul Peringatan (Responsif)
  ctx.textAlign = 'center';
  ctx.font = isCompact
    ? '900 16px "Plus Jakarta Sans", sans-serif'
    : '900 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = isModerate ? '#fef08a' : '#fca5a5';
  ctx.fillText(
    isModerate
      ? '[ ! ] GEMPA SEDANG! AMBIL TAS & EVAKUASI!'
      : '[ ! ] AWAS GEMPA BESAR! MERUNDUK & BERLINDUNG!',
    cx,
    cardY + (isCompact ? 32 : 44)
  );

  // Baris 2: Tombol Aksi Utama yang Sangat Besar & Kontras
  const btnW = Math.min(cardW - (isCompact ? 28 : 56), 880);
  const btnH = isCompact ? 48 : 62;
  const btnY = cardY + (isCompact ? 48 : 64);
  ctx.fillStyle = isModerate ? '#d97706' : '#b45309';
  ctx.fillRect(cx - btnW / 2, btnY, btnW, btnH);
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = isCompact ? 2.5 : 3.5;
  ctx.strokeRect(cx - btnW / 2, btnY, btnW, btnH);

  ctx.font = isCompact
    ? '900 14px "Plus Jakarta Sans", sans-serif'
    : '900 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(
    isModerate
      ? 'TEKAN [E]  /  TAP AMBIL TAS & EVAKUASI!'
      : 'TEKAN [E]  /  TAP BERLINDUNG DI KOLONG MEJA!',
    cx,
    btnY + (isCompact ? 30 : 40)
  );

  // Baris 3: Bar Progress Waktu Besar & Nyaman Dibaca
  const barW = Math.min(cardW - (isCompact ? 28 : 56), 880);
  const barH = isCompact ? 24 : 30;
  const barX = cx - barW / 2;
  const barY = btnY + btnH + (isCompact ? 10 : 16);

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(barX, barY, barW, barH);
  const progress = Math.max(0, Math.min(1, timer / maxTimer));
  ctx.fillStyle = isModerate
    ? (progress > 0.35 ? '#10b981' : '#f59e0b')
    : (progress > 0.35 ? '#eab308' : '#ef4444');
  ctx.fillRect(barX, barY, barW * progress, barH);
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(barX, barY, barW, barH);

  const secondsLeft = (timer / 60).toFixed(1);
  ctx.font = isCompact
    ? '800 12px "Plus Jakarta Sans", sans-serif'
    : '800 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`SISA WAKTU: ${secondsLeft} DETIK`, cx, barY + (isCompact ? 17 : 21));

  ctx.restore();
}


export function drawSimulationQuakeTimerOverlay(
  ctx: CanvasRenderingContext2D,
  viewW: number,
  viewH: number,
  timer: number,
  maxTimer: number
): void {
  const cx = viewW / 2;
  const isCompact = viewW < 800;
  const cardW = Math.min(viewW - 24, isCompact ? 520 : 860);
  const cardH = isCompact ? 130 : 168;
  const cardX = cx - cardW / 2;
  const cardY = isCompact ? 76 : Math.max(88, Math.min(125, Math.floor(viewH * 0.10)));

  ctx.save();
  // Flash halus tepi layar
  ctx.fillStyle = 'rgba(239, 68, 68, 0.10)';
  ctx.fillRect(0, 0, viewW, 20);
  ctx.fillRect(0, viewH - 20, viewW, 20);

  // Kartu utama gelap dengan border kuning amber tebal
  ctx.fillStyle = '#0b1120';
  ctx.fillRect(cardX, cardY, cardW, cardH);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = isCompact ? 3 : 4;
  ctx.strokeRect(cardX, cardY, cardW, cardH);

  // Aksen retro corner
  ctx.fillStyle = '#f59e0b';
  const cSz = isCompact ? 10 : 12;
  const cTh = isCompact ? 3 : 4;
  ctx.fillRect(cardX + 4, cardY + 4, cSz, cTh);
  ctx.fillRect(cardX + 4, cardY + 4, cTh, cSz);
  ctx.fillRect(cardX + cardW - 4 - cSz, cardY + 4, cSz, cTh);
  ctx.fillRect(cardX + cardW - 4 - cTh, cardY + 4, cTh, cSz);
  ctx.fillRect(cardX + 4, cardY + cardH - 4 - cTh, cSz, cTh);
  ctx.fillRect(cardX + 4, cardY + cardH - 4 - cSz, cTh, cSz);
  ctx.fillRect(cardX + cardW - 4 - cSz, cardY + cardH - 4 - cTh, cSz, cTh);
  ctx.fillRect(cardX + cardW - 4 - cTh, cardY + cardH - 4 - cSz, cTh, cSz);

  // Indikator kedip merah/amber
  const indR = isCompact ? 11 : 15;
  const indX = cardX + (isCompact ? 32 : 48);
  const indY = cardY + (isCompact ? 44 : 58);
  const flash = Math.sin(timer * 0.15) > 0;
  ctx.fillStyle = flash ? '#ef4444' : '#f59e0b';
  ctx.beginPath();
  ctx.arc(indX, indY, indR, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = flash ? '#fca5a5' : '#fde68a';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(indX, indY, indR + 5, 0, Math.PI * 2);
  ctx.stroke();

  const secLeft = Math.ceil(timer / 60);
  const timeStr = `00:${secLeft.toString().padStart(2, '0')}`;

  const textLeft = indX + indR + (isCompact ? 14 : 24);

  // Teks Judul Timer Gempa
  ctx.textAlign = 'left';
  ctx.font = isCompact
    ? '900 17px "Plus Jakarta Sans", sans-serif'
    : '900 26px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText(`GUNCANGAN GEMPA: ${timeStr}`, textLeft, cardY + (isCompact ? 36 : 48));

  // Subtitle instruksi SOP
  ctx.font = isCompact
    ? '800 10.5px "Plus Jakarta Sans", sans-serif'
    : '800 14.5px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#f8fafc';
  ctx.fillText('TETAP MERUNDUK & BERTAHAN DI KAKI MEJA (HOLD ON)', textLeft, cardY + (isCompact ? 56 : 78));

  // Progress Bar timer guncangan
  const barX = textLeft;
  const barW = Math.max(120, cardW - (textLeft - cardX) - (isCompact ? 20 : 36));
  const barH = isCompact ? 16 : 22;
  const barY = cardY + (isCompact ? 74 : 100);

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(barX, barY, barW, barH);
  const p = Math.max(0, Math.min(1, timer / maxTimer));
  ctx.fillStyle = p > 0.3 ? '#ef4444' : '#f59e0b';
  ctx.fillRect(barX, barY, barW * p, barH);
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(barX, barY, barW, barH);

  ctx.restore();
}


export function drawSimulationEvacuationPrompt(
  ctx: CanvasRenderingContext2D,
  viewW: number,
  _viewH: number
): void {
  const cx = viewW / 2;
  const cardW = Math.min(viewW - 40, Math.max(880, Math.min(1150, Math.round(viewW * 0.70))));
  const cardH = 125;
  const cardX = cx - cardW / 2;
  const cardY = 52;

  ctx.save();
  ctx.fillStyle = '#064e3b';
  ctx.fillRect(cardX, cardY, cardW, cardH);
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 4;
  ctx.strokeRect(cardX, cardY, cardW, cardH);

  // Sudut retro emerald
  ctx.fillStyle = '#34d399';
  ctx.fillRect(cardX + 4, cardY + 4, 12, 4);
  ctx.fillRect(cardX + 4, cardY + 4, 4, 12);
  ctx.fillRect(cardX + cardW - 16, cardY + 4, 12, 4);
  ctx.fillRect(cardX + cardW - 8, cardY + 4, 4, 12);
  ctx.fillRect(cardX + 4, cardY + cardH - 8, 12, 4);
  ctx.fillRect(cardX + 4, cardY + cardH - 16, 4, 12);
  ctx.fillRect(cardX + cardW - 16, cardY + cardH - 8, 12, 4);
  ctx.fillRect(cardX + cardW - 8, cardY + cardH - 16, 4, 12);

  ctx.textAlign = 'center';
  ctx.font = '900 26px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#6ee7b7';
  ctx.fillText('[AMAN] GUNCANGAN SELESAI! AMBIL TAS LINDUNGI KEPALA', cx, cardY + 48);

  ctx.font = '800 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#fef08a';
  ctx.fillText('TEKAN [E] ATAU TAP UNTUK KELUAR DARI KOLONG MEJA & EVAKUASI', cx, cardY + 92);

  ctx.restore();
}


// ── ATMOSPHERE: MOUNT MERAPI ASH, ERUPTION SMOKE & PVMBG SIREN (AREA 5) ──
export function drawVolcanoMitigationAtmosphere(
  ctx: CanvasRenderingContext2D,
  camX: number,
  viewW: number,
  viewH: number,
  animTick: number
): void {
  // 1. Dark Volcanic Ash & Magma Twilight Sky Gradient (Langit Abu Merapi Menegangkan)
  const skyGrad = ctx.createLinearGradient(0, 0, 0, viewH);
  skyGrad.addColorStop(0, '#090505'); // Puncak langit jelaga hitam
  skyGrad.addColorStop(0.3, '#1e0a07'); // Merah jelaga vulkanik
  skyGrad.addColorStop(0.6, '#38120b'); // Bara tembaga gelap
  skyGrad.addColorStop(0.85, '#5c1d12'); // Hawa panas kawah
  skyGrad.addColorStop(1, '#7f1d1d'); // Pijar horizon
  ctx.fillStyle = skyGrad;
  ctx.fillRect(camX, 0, viewW, viewH);

  // 2. Siluet Megah Gunung Merapi dengan Asap Kawah Solfatara (Parallax 0.12)
  const paraFar = camX * 0.12;
  const merapiPeakX = camX + viewW * 0.5 - (paraFar % 300);
  const merapiPeakY = 120;

  // Gunung Merapi (Stratovolcano)
  ctx.save();
  ctx.fillStyle = '#1c0c08';
  ctx.beginPath();
  ctx.moveTo(merapiPeakX - 380, viewH);
  ctx.lineTo(merapiPeakX - 40, merapiPeakY + 15);
  ctx.lineTo(merapiPeakX, merapiPeakY); // Puncak kawah
  ctx.lineTo(merapiPeakX + 45, merapiPeakY + 20);
  ctx.lineTo(merapiPeakX + 420, viewH);
  ctx.closePath();
  ctx.fill();

  // Pendaran Kubah Lava Pijar di Puncak
  const lavaGlow = ctx.createRadialGradient(merapiPeakX, merapiPeakY + 5, 4, merapiPeakX, merapiPeakY + 5, 45);
  lavaGlow.addColorStop(0, 'rgba(239, 68, 68, 0.9)');
  lavaGlow.addColorStop(0.4, 'rgba(249, 115, 22, 0.5)');
  lavaGlow.addColorStop(1, 'rgba(239, 68, 68, 0)');
  ctx.fillStyle = lavaGlow;
  ctx.beginPath();
  ctx.arc(merapiPeakX, merapiPeakY + 5, 45, 0, Math.PI * 2);
  ctx.fill();

  // Asap Awan Abu Vulkanik Membubung Tinggi & Menggumpal Realistis dari Puncak Kawah
  drawRealisticVolcanicSmoke(ctx, merapiPeakX, merapiPeakY + 4, animTick, true);
  ctx.restore();

  // 3. Menara Sirene Early Warning System (EWS) PVMBG di Bukit Antara (Parallax 0.3)
  const paraMid = camX * 0.3;
  ctx.save();
  const ewsX = camX + ((600 - (paraMid % 1200) + 1200) % 1200);
  // Rangka menara EWS
  ctx.fillStyle = '#292524';
  ctx.fillRect(ewsX, 220, 6, 90);
  ctx.fillRect(ewsX - 8, 240, 22, 3);
  ctx.fillRect(ewsX - 6, 270, 18, 3);
  // Lampu Sirine Merah Strobo Berkedip Cepat (Status AWAS)
  const isSirenOn = Math.floor(animTick / 10) % 2 === 0;
  ctx.fillStyle = isSirenOn ? '#ef4444' : '#7f1d1d';
  ctx.fillRect(ewsX - 3, 214, 12, 8);
  if (isSirenOn) {
    ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
    ctx.beginPath();
    ctx.arc(ewsX + 3, 218, 22, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 4. Hujan Abu Vulkanik & Percikan Piroklastik Halus Berjatuhan
  for (let v = 0; v < 35; v++) {
    const fallSpeed = 0.9 + (v % 3) * 0.5;
    const vy = (viewH + ((animTick * fallSpeed + v * 30) % viewH)) % viewH;
    const vx = camX + ((v * 75 + animTick * 0.5 + Math.sin(animTick * 0.04 + v) * 10) % viewW);

    if (v % 7 === 0) {
      // Pijar abu panas
      ctx.fillStyle = 'rgba(248, 113, 113, 0.9)';
      ctx.fillRect(vx, vy, 2, 2);
    } else {
      // Abu silika kelabu
      ctx.fillStyle = 'rgba(168, 162, 158, 0.65)';
      ctx.fillRect(vx, vy, 2, 2);
    }
  }
}


// ── PROMPT INTERAKSI NPC MELAYANG [E] / Enter (100% KONSISTEN LEVEL 1 & LEVEL 2) ──
export function drawNpcInteractionPromptL2(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number
): void {
  const bounce = Math.sin(frame * 0.1) * 3;
  const px = x;
  const py = y - 36 + bounce;

  const label = '[E] / Enter';
  ctx.save();
  ctx.font = 'bold 8.5px "Plus Jakarta Sans", sans-serif';
  const textW = ctx.measureText(label).width;
  const pillW = Math.max(56, Math.round(textW + 16));
  const bx = Math.round(px - pillW / 2);

  // Background pill persis Level 1 & 2
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


// ── PROMPT INTERAKSI OBJEK MELAYANG (PORTAL / LANDER) (100% KONSISTEN LEVEL 1 & LEVEL 2) ──
export function drawInteractionPromptL2(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number
): void {
  const bounce = Math.sin(frame * 0.1) * 3;
  const px = x;
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
