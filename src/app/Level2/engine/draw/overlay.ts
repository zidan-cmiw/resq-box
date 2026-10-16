// ── engine/draw/overlay.ts ────────────────────────────────────────────────
// Lapisan tampilan di atas dunia permainan: hitung mundur QTE, pengukur waktu
// gempa, ajakan evakuasi, ajakan berinteraksi dengan NPC, suasana mitigasi
// gunung, dan prompt interaksi umum.
//
// Dipisahkan dari renderer.ts (Langkah 4 dari pemecahan berkas).
// Terbukti mandiri: hanya bergantung pada ./base dan ../tataLetakKartuL2.
//
// ATURAN: hanya boleh mengimpor dari ./base dan ../tataLetakKartuL2.
//   `tataLetakKartuL2` HANYA berisi angka tata letak + pembacaan skala kanvas
//   (tanpa impor apa pun), sehingga tidak menimbulkan impor melingkar.
//
// CATATAN POSISI KARTU
//   Semua kartu di berkas ini dulu digambar mulai `y = 52`–`90` sehingga
//   TERTUTUP tracker progres Level 2 yang berada di atas tengah layar.
//   Sekarang atasnya diambil dari `atasKartuAmanL2()` — lihat penjelasan
//   lengkap beserta angka pengukurannya di `../tataLetakKartuL2.ts`.
//
// CATATAN GAYA KARTU
//   Seluruh kartu di berkas ini digambar oleh SATU fungsi bersama,
//   `gambarKartuL2()` di `./base`. Fungsi itulah yang menyimpan gaya baku
//   kartu popup Level 2 (panel gelap, bingkai, sudut retro, ukuran judul,
//   ukuran baris, tinggi kartu yang mengikuti isinya). Kartu di berkas ini
//   hanya menentukan ISI dan AKSEN warnanya.
//   Sebelumnya tiap kartu menuliskan sendiri angka font dan tata letaknya.

import { drawRealisticVolcanicSmoke, gambarKartuL2 } from './base';
import { atasKartuAmanL2 } from '../tataLetakKartuL2';

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
  const isCompact = viewW < 800;
  const progres = Math.max(0, Math.min(1, timer / maxTimer));
  const secondsLeft = (timer / 60).toFixed(1);

  // Dulu langsung `isCompact ? 76 : ...` — terlalu tinggi sehingga judul kartu
  // tertutup tracker progres Level 2. Lihat ../tataLetakKartuL2.ts.
  gambarKartuL2(ctx, viewW, {
    y: atasKartuAmanL2(
      ctx,
      isCompact ? 76 : Math.max(88, Math.min(125, Math.floor(viewH * 0.10)))
    ),
    judul: isModerate
      ? '[ ! ] GEMPA SEDANG! AMBIL TAS & EVAKUASI!'
      : '[ ! ] AWAS GEMPA BESAR! MERUNDUK & BERLINDUNG!',
    aksen: isModerate ? 'amber' : 'merah',
    berdenyut: true,
    tick: animTick,
    baris: [
      {
        jenis: 'tombol',
        teks: isModerate
          ? 'TEKAN [E]  /  TAP AMBIL TAS & EVAKUASI!'
          : 'TEKAN [E]  /  TAP BERLINDUNG DI KOLONG MEJA!',
        isi: isModerate ? '#d97706' : '#b45309',
      },
    ],
    bilah: {
      teks: `SISA WAKTU: ${secondsLeft} DETIK`,
      progres,
      isi: isModerate
        ? (progres > 0.35 ? '#10b981' : '#f59e0b')
        : (progres > 0.35 ? '#eab308' : '#ef4444'),
    },
  });
}


export function drawSimulationQuakeTimerOverlay(
  ctx: CanvasRenderingContext2D,
  viewW: number,
  viewH: number,
  timer: number,
  maxTimer: number
): void {
  const isCompact = viewW < 800;
  const secLeft = Math.ceil(timer / 60);
  const timeStr = `00:${secLeft.toString().padStart(2, '0')}`;
  const p = Math.max(0, Math.min(1, timer / maxTimer));

  // Flash halus tepi layar (tanda guncangan masih berlangsung)
  ctx.save();
  ctx.fillStyle = 'rgba(239, 68, 68, 0.10)';
  ctx.fillRect(0, 0, viewW, 20);
  ctx.fillRect(0, viewH - 20, viewW, 20);
  ctx.restore();

  // Dulu langsung `isCompact ? 76 : ...` — terlalu tinggi sehingga tertutup
  // tracker progres Level 2. Lihat ../tataLetakKartuL2.ts.
  gambarKartuL2(ctx, viewW, {
    y: atasKartuAmanL2(
      ctx,
      isCompact ? 76 : Math.max(88, Math.min(125, Math.floor(viewH * 0.10)))
    ),
    judul: `GUNCANGAN GEMPA: ${timeStr}`,
    aksen: 'amber',
    baris: [
      {
        jenis: 'teks',
        teks: 'TETAP MERUNDUK & BERTAHAN DI KAKI MEJA (HOLD ON)',
        warnaTeks: '#f8fafc',
      },
    ],
    bilah: {
      // Bilah tanpa teks: hitung mundurnya sudah tertulis besar di judul.
      teks: '',
      progres: p,
      isi: p > 0.3 ? '#ef4444' : '#f59e0b',
    },
  });
}


export function drawSimulationEvacuationPrompt(
  ctx: CanvasRenderingContext2D,
  viewW: number,
  _viewH: number
): void {
  // Dulu tetap `52` — terlalu tinggi sehingga tertutup tracker progres Level 2.
  // Lihat ../tataLetakKartuL2.ts.
  gambarKartuL2(ctx, viewW, {
    y: atasKartuAmanL2(ctx, 52),
    judul: '[AMAN] GUNCANGAN SELESAI! AMBIL TAS LINDUNGI KEPALA',
    aksen: 'hijau',
    baris: [
      {
        jenis: 'tombol',
        teks: 'TEKAN [E] ATAU TAP UNTUK KELUAR DARI KOLONG MEJA & EVAKUASI',
        isi: '#047857',
        tepi: '#6ee7b7',
      },
    ],
  });
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
