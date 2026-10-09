// ── engine/draw/merapi.ts ────────────────────────────────────────────────
// Kawasan Merapi prabencana dan simulasi gunung: tanah, gerbang, suasana,
// rambu jalur evakuasi, tiang sirine EWS, kantor BPBD, kawanan hewan yang
// bermigrasi, perlengkapan bencana pemain, gelembung panik warga, desa
// pedesaan, dan truk penyelamat.
//
// Dipisahkan dari renderer.ts (Langkah 5 dari pemecahan berkas).
//
// CATATAN PENTING — MENGHINDARI IMPOR MELINGKAR
//   Blok ini pada awalnya hanya mencakup baris 1818-3536. Namun blok itu
//   memanggil drawVolcanoSimulationVillage dan drawEvacuationRescueTruck yang
//   berada SETELAHNYA, sementara kedua fungsi itu memanggil balik
//   drawTiangSirineEws dan drawKantorBpbd yang ada DI DALAM blok. Itu akan
//   menimbulkan impor melingkar.
//
//   Penyelesaiannya: seluruh rentang 1818-4439 diambil UTUH. Hasilnya blok
//   menjadi benar-benar mandiri (tidak ada ketergantungan keluar), dan empat
//   fungsi yang tadinya tertunda ikut terselesaikan sekaligus.
//
// ATURAN: boleh mengimpor ./base dan ./volcano; tidak boleh mengimpor renderer.

import { drawRealisticVolcanicSmoke } from './base';
import {
  drawDenseDarkAshPlume,
  drawMagmaExplosiveFountain,
  drawMagmaEffusiveFountain,
  drawEffusiveDownstreamRiver,
  drawEruptingLavaFlows,
  drawFleeingBirdFlock,
  drawAshFallOverlay,
  drawVolcanoSimulationHills,
} from './volcano';
import type { GameStateL2, MigratingAnimalL2 } from '../gameEngine';
import type { NpcStateL2 } from '../npcManagerL2';


// ══════════════════════════════════════════════════════════════════════════
// 4. ATMOSPHERE & GROUND: PRABENCANA ERUPSI MERAPI (AREA 4: POS PGA & KRB III)
// ══════════════════════════════════════════════════════════════════════════

// A. LANTAI LERENG MERAPI (RUMPUT SUBUR, BEBATUAN ANDESIT & JALUR DESA)
export function drawMerapiPrabencanaGround(
  ctx: CanvasRenderingContext2D,
  camX: number,
  viewW: number,
  _animTick: number
): void {
  const floorY = 356;
  const floorH = 124;

  // 1. Dasar Rumput Lereng Pegunungan Subur (Lush Alpine Grass Gradient)
  const grassGrad = ctx.createLinearGradient(0, floorY, 0, floorY + floorH);
  grassGrad.addColorStop(0, '#15803d'); // Hijau segar lereng
  grassGrad.addColorStop(0.2, '#166534');
  grassGrad.addColorStop(0.6, '#14532d');
  grassGrad.addColorStop(0.9, '#3f2d1d'); // Lapisan tanah vulkanik subur
  grassGrad.addColorStop(1, '#27170a');  // Batuan dasar andesit
  ctx.fillStyle = grassGrad;
  ctx.fillRect(camX, floorY, viewW, floorH);

  // 2. Jalur Setapak Paving / Aspal Lereng Pedesaan (y: 356 - 364)
  ctx.fillStyle = '#334155'; // Aspal abu-abu
  ctx.fillRect(camX, floorY - 2, viewW, 8);
  ctx.fillStyle = '#475569';
  ctx.fillRect(camX, floorY - 2, viewW, 2);
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(camX, floorY + 6, viewW, 2); // Bibir rumput hijau

  // Garis Marka Putih Putus-Putus di Tengah Jalan Setapak
  const dashStep = 40;
  const startDash = Math.floor(camX / dashStep) * dashStep;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  for (let dx = startDash; dx < camX + viewW + dashStep; dx += dashStep) {
    ctx.fillRect(dx, floorY + 1, 20, 2);
  }

  // 3. Bebatuan Andesit Vulkanik & Bunga-Bunga Liar Lereng
  const stepX = 36;
  const startX = Math.floor(camX / stepX) * stepX - stepX * 2;
  const endX = camX + viewW + stepX * 2;

  for (let px = startX; px < endX; px += stepX) {
    const hash = Math.abs(Math.sin(px * 23.456) * 43758.5453);
    const fract = hash - Math.floor(hash);

    // Bebatuan Andesit Abu-abu
    if (fract > 0.5) {
      const rockY = floorY + 14 + Math.floor(fract * 30);
      ctx.fillStyle = '#475569';
      ctx.fillRect(px, rockY, 8, 5);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(px + 1, rockY, 6, 2);
      ctx.fillStyle = '#334155';
      ctx.fillRect(px, rockY + 4, 8, 2);
    } else {
      // Rumpun Bunga Liar Lereng Pegunungan (Kuning & Merah Muda)
      const flowerY = floorY + 10 + Math.floor(fract * 40);
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(px, flowerY, 2, 5);
      ctx.fillStyle = fract > 0.25 ? '#fde047' : '#f472b6';
      ctx.fillRect(px - 1, flowerY - 2, 4, 3);
    }
  }

  // 4. Lapisan Tanah Vulkanik Kaya Mineral (Subsurface Stratum)
  ctx.fillStyle = '#27170a';
  ctx.fillRect(camX, 460, viewW, 20);
  ctx.fillStyle = '#451a03';
  ctx.fillRect(camX, 460, viewW, 3);
}

// B. GAPURA KEMBALI MENUJU LAPANGAN SEKOLAH (PORTAL BACK MERAPI)
export function drawMerapiBackGate(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number
): void {
  ctx.save();
  ctx.translate(px, py);

  // Pilar Gapura Batu Andesit Kiri & Kanan (lebar gapura lebih lapang agar teks muat)
  ctx.fillStyle = '#334155';
  ctx.fillRect(-64, -68, 9, 68);
  ctx.fillRect(55, -68, 9, 68);
  ctx.fillStyle = '#475569';
  ctx.fillRect(-62, -68, 5, 68);
  ctx.fillRect(57, -68, 5, 68);

  // Palang Atas Gapura Kayu Jati Lereng
  ctx.fillStyle = '#78350f';
  ctx.fillRect(-72, -78, 144, 13);
  ctx.fillStyle = '#92400e';
  ctx.fillRect(-70, -76, 140, 8);

  // Papan Teks Penunjuk Arah (Lebar 132px, Tulisan Muat Sempurna Tanpa Keluar Kotak)
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-66, -63, 132, 20);
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 1.2;
  ctx.strokeRect(-66, -63, 132, 20);

  ctx.fillStyle = '#facc15';
  ctx.font = 'bold 9.5px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('KE AREA SEBELUMNYA', 0, -53);

  // Lampu Lentera Pos Ronda di Tiang
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(-58, -44, 5, 8);
  ctx.fillRect(53, -44, 5, 8);

  ctx.restore();
}

// C. ATMOSPHERE ASLI LERENG MERAPI (POS PGA, SEISMOGRAF, KRB III & DUSUN DESTANA)
export function drawMerapiPrabencanaAtmosphere(
  ctx: CanvasRenderingContext2D,
  camX: number,
  viewW: number,
  _viewH: number,
  animTick: number
): void {
  // 1. Langit Pegunungan Pagi Hari Biru Asri & Segar (Alpine Sky Gradient)
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 260);
  skyGrad.addColorStop(0, '#0284c7'); // Biru langit cerah pegunungan
  skyGrad.addColorStop(0.35, '#38bdf8');
  skyGrad.addColorStop(0.7, '#7dd3fc');
  skyGrad.addColorStop(1, '#e0f2fe'); // Kabut tipis sejuk pegunungan
  ctx.fillStyle = skyGrad;
  ctx.fillRect(camX, 0, viewW, 260);

  // Awan Putih Alami Melayang Tenang (Stylized Clouds)
  const cloudOffsets = [80, 520, 980, 1440, 1920];
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  for (const cx of cloudOffsets) {
    const driftX = (cx + animTick * 0.12) % 2400;
    if (driftX + 140 > camX && driftX - 40 < camX + viewW) {
      ctx.beginPath();
      ctx.arc(driftX, 38, 15, 0, Math.PI * 2);
      ctx.arc(driftX + 18, 32, 20, 0, Math.PI * 2);
      ctx.arc(driftX + 42, 35, 17, 0, Math.PI * 2);
      ctx.arc(driftX + 62, 40, 12, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 2. Siluet Megah Gunung Stratovolcano Merapi (Parallax 0.08)
  const paraFar = camX * 0.08;
  const merapiX = camX + viewW * 0.5 - (paraFar % 350);
  const merapiPeakY = 88;

  // Siluet Badan Kerucut Gunung Merapi
  ctx.save();
  const mountainGrad = ctx.createLinearGradient(0, merapiPeakY, 0, 340);
  mountainGrad.addColorStop(0, '#475569'); // Puncak kawah abu-abu kebiruan
  mountainGrad.addColorStop(0.4, '#334155');
  mountainGrad.addColorStop(0.8, '#1e293b');
  mountainGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = mountainGrad;
  ctx.beginPath();
  ctx.moveTo(merapiX - 420, 360);
  ctx.lineTo(merapiX - 50, merapiPeakY + 12);
  ctx.lineTo(merapiX - 10, merapiPeakY);      // Puncak kawah barat
  ctx.lineTo(merapiX + 15, merapiPeakY + 4);  // Kubah lava aktif
  ctx.lineTo(merapiX + 450, 360);
  ctx.closePath();
  ctx.fill();

  // Guratan Lembah Alur Sungai Lahar Merapi (Gendol & Krasak)
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(merapiX + 15, merapiPeakY + 6);
  ctx.lineTo(merapiX + 60, merapiPeakY + 90);
  ctx.lineTo(merapiX + 140, 360);
  ctx.moveTo(merapiX - 10, merapiPeakY + 4);
  ctx.lineTo(merapiX - 70, merapiPeakY + 110);
  ctx.lineTo(merapiX - 160, 360);
  ctx.stroke();

  // Kepulan Asap Solfatara Kawah Putih Halus Realistis (Membubung Organik & Lembut, Bukan Bulatan Kaku)
  drawRealisticVolcanicSmoke(ctx, merapiX + 2, merapiPeakY + 4, animTick, false);
  ctx.restore();

  // 3. Perbukitan Hijau Hutan Pinus & Cemara Lereng Merapi (Parallax 0.22)
  const paraMid = camX * 0.22;
  const hillGrad = ctx.createLinearGradient(0, 200, 0, 360);
  hillGrad.addColorStop(0, '#166534');
  hillGrad.addColorStop(1, '#14532d');
  ctx.fillStyle = hillGrad;

  ctx.beginPath();
  ctx.moveTo(camX - 20, 360);
  for (let hx = camX - 40; hx <= camX + viewW + 40; hx += 40) {
    const hy = 230 + Math.sin((hx + paraMid) * 0.007) * 22;
    ctx.lineTo(hx, hy);
  }
  ctx.lineTo(camX + viewW + 20, 360);
  ctx.closePath();
  ctx.fill();

  // Rumpun-Rumpun Alami Pepohonan Pinus & Cemara Lereng Merapi (Bukan Pagar Rapat Berulang!)
  // Distribusi alami berjarak: kelompok pohon rimbun berselang-seling dengan padang rumput lereng & batu andesit
  const PINE_CLUSTERS = [
    { x: 110, h: 36, type: 'pine_tall' },
    { x: 132, h: 28, type: 'pine_mid' },
    { x: 154, h: 22, type: 'pine_small' },
    { x: 180, h: 14, type: 'bush' },
    { x: 280, h: 16, type: 'boulder' },
    { x: 310, h: 32, type: 'pine_mid' },
    { x: 335, h: 42, type: 'pine_tall' },
    { x: 360, h: 26, type: 'pine_mid' },
    // Clearing luas di sekitar x: 380 - 640 (Area Pos PGA & Seismograf terbuka menghadap puncak)
    { x: 670, h: 18, type: 'boulder' },
    { x: 700, h: 34, type: 'pine_mid' },
    { x: 728, h: 40, type: 'pine_tall' },
    { x: 755, h: 24, type: 'pine_mid' },
    { x: 775, h: 15, type: 'bush' },
    { x: 910, h: 38, type: 'pine_tall' },
    { x: 935, h: 30, type: 'pine_mid' },
    { x: 960, h: 22, type: 'pine_small' },
    { x: 985, h: 16, type: 'boulder' },
    // Padang rumput terbuka x: 1000 - 1160
    { x: 1180, h: 14, type: 'bush' },
    { x: 1210, h: 32, type: 'pine_mid' },
    { x: 1238, h: 42, type: 'pine_tall' },
    { x: 1265, h: 26, type: 'pine_mid' },
    { x: 1420, h: 36, type: 'pine_tall' },
    { x: 1445, h: 28, type: 'pine_mid' },
    { x: 1475, h: 18, type: 'boulder' },
    // Area Dusun Destana & Lereng KRB III
    { x: 1620, h: 34, type: 'pine_mid' },
    { x: 1648, h: 40, type: 'pine_tall' },
    { x: 1675, h: 22, type: 'pine_small' },
    { x: 1820, h: 38, type: 'pine_tall' },
    { x: 1848, h: 28, type: 'pine_mid' },
    { x: 1875, h: 16, type: 'boulder' },
    { x: 2020, h: 32, type: 'pine_mid' },
    { x: 2050, h: 42, type: 'pine_tall' },
  ];

  for (const tree of PINE_CLUSTERS) {
    const realX = tree.x;
    if (realX + 50 < camX || realX - 50 > camX + viewW) continue;
    const hillY = 230 + Math.sin((realX + paraMid) * 0.007) * 22;

    if (tree.type === 'boulder') {
      // Bongkahan Batu Andesit Lereng Merapi
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.ellipse(realX, hillY - 4, 10, 6, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.ellipse(realX - 2, hillY - 6, 6, 3, 0.2, 0, Math.PI * 2);
      ctx.fill();
      // Lumut hijau gunung
      ctx.fillStyle = '#15803d';
      ctx.fillRect(realX - 6, hillY - 6, 4, 2);
    } else if (tree.type === 'bush') {
      // Semak Belukar Lereng Hijau Rimbun
      ctx.fillStyle = '#14532d';
      ctx.beginPath();
      ctx.arc(realX, hillY - 6, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#16a34a';
      ctx.beginPath();
      ctx.arc(realX - 2, hillY - 8, 6, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Pohon Pinus / Cemara Bertingkat 3D (Tall / Mid / Small)
      const tH = tree.h;
      const tW = tH * 0.42;

      // Batang Kayu Cokelat
      ctx.fillStyle = '#451a03';
      ctx.fillRect(realX - 1.5, hillY - 8, 3, 10);

      // Daun Pinus Bertingkat 3 (Bawah, Tengah, Pucuk)
      // Tier Bawah (Lebar)
      ctx.fillStyle = '#14532d'; // Sisi bayangan kanan
      ctx.beginPath();
      ctx.moveTo(realX, hillY - tH * 0.6);
      ctx.lineTo(realX + tW, hillY - 6);
      ctx.lineTo(realX - tW, hillY - 6);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#16a34a'; // Sisi terang matahari kiri
      ctx.beginPath();
      ctx.moveTo(realX, hillY - tH * 0.6);
      ctx.lineTo(realX, hillY - 6);
      ctx.lineTo(realX - tW, hillY - 6);
      ctx.closePath();
      ctx.fill();

      // Tier Tengah (Sedang)
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.moveTo(realX, hillY - tH * 0.85);
      ctx.lineTo(realX + tW * 0.8, hillY - tH * 0.45);
      ctx.lineTo(realX - tW * 0.8, hillY - tH * 0.45);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.moveTo(realX, hillY - tH * 0.85);
      ctx.lineTo(realX, hillY - tH * 0.45);
      ctx.lineTo(realX - tW * 0.8, hillY - tH * 0.45);
      ctx.closePath();
      ctx.fill();

      // Tier Pucuk (Lancip Menusuk Langit)
      ctx.fillStyle = '#166534';
      ctx.beginPath();
      ctx.moveTo(realX, hillY - tH);
      ctx.lineTo(realX + tW * 0.55, hillY - tH * 0.72);
      ctx.lineTo(realX - tW * 0.55, hillY - tH * 0.72);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#4ade80';
      ctx.beginPath();
      ctx.moveTo(realX, hillY - tH);
      ctx.lineTo(realX, hillY - tH * 0.72);
      ctx.lineTo(realX - tW * 0.55, hillY - tH * 0.72);
      ctx.closePath();
      ctx.fill();
    }
  }

  // 4. Plaza Rambu Status Gunung Api & Peringatan KRB III (x: 390 - 720)
  const plazaX = 390;
  if (plazaX + 340 > camX && plazaX - 20 < camX + viewW) {
    // Tiang Papan Informasi 4 Status Gunung Api (Kokoh & Proporsional)
    ctx.fillStyle = '#334155';
    ctx.fillRect(plazaX + 12, 230, 7, 126);
    ctx.fillRect(plazaX + 163, 230, 7, 126);

    // Papan Utama 4 Status PVMBG (Diperlebar & Dipertinggi agar tulisan tidak mepet)
    const boardW = 182;
    const boardH = 94;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(plazaX, 220, boardW, boardH);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(plazaX + 2, 222, boardW - 4, boardH - 4);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(plazaX, 220, boardW, boardH);

    // Header Status Merapi (Font Modern Bersih & Jelas)
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 9.5px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('STATUS MERAPI (PVMBG)', plazaX + boardW / 2, 234);

    // 4 Kotak Status: I (Hijau), II (Kuning), III (Oranye), IV (Merah)
    // Diberi ruang vertikal & padding lapang agar tulisan NORMAL, WASPADA, SIAGA, AWAS tidak mepet!
    const statuses = [
      { code: 'I', label: 'NORMAL', bg: '#15803d', border: '#22c55e', text: '#ffffff' },
      { code: 'II', label: 'WASPADA', bg: '#ca8a04', border: '#facc15', text: '#000000' },
      { code: 'III', label: 'SIAGA', bg: '#ea580c', border: '#fb923c', text: '#ffffff' },
      { code: 'IV', label: 'AWAS', bg: '#dc2626', border: '#f87171', text: '#ffffff' },
    ];
    const boxW = 40;
    const boxH = 55;
    const startX = plazaX + 8;
    const boxY = 247;

    statuses.forEach((st, idx) => {
      const bx = startX + idx * (boxW + 2);
      // Background kotak status
      ctx.fillStyle = st.bg;
      ctx.fillRect(bx, boxY, boxW, boxH);
      ctx.strokeStyle = st.border;
      ctx.lineWidth = 1.2;
      ctx.strokeRect(bx, boxY, boxW, boxH);

      // Tingkat Status (I, II, III, IV) - Font modern, besar & jelas
      ctx.fillStyle = st.text;
      ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(st.code, bx + boxW / 2, boxY + 18);

      // Garis pemisah halus
      ctx.fillStyle = st.text;
      ctx.globalAlpha = 0.35;
      ctx.fillRect(bx + 4, boxY + 31, boxW - 8, 1);
      ctx.globalAlpha = 1.0;

      // Label Status (NORMAL, WASPADA, SIAGA, AWAS) - Font tebal modern dengan padding lapang dari bawah
      ctx.fillStyle = st.text;
      ctx.font = 'bold 8px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(st.label, bx + boxW / 2, boxY + 43);
    });

    // Papan Rambu Merah Peringatan KRB III (Digeser agar proporsional dengan papan status yang lebih lebar)
    const krbSignX = plazaX + 200;
    ctx.fillStyle = '#334155';
    ctx.fillRect(krbSignX + 22, 252, 5, 104);

    // Papan Merah Rambu Batas KRB III
    const krbW = 54;
    const krbH = 40;
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(krbSignX, 226, krbW, krbH);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(krbSignX + 2, 228, krbW - 4, krbH - 4);
    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 12.5px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('KRB III', krbSignX + krbW / 2, 240);
    ctx.font = 'bold 7.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('ZONA MERAH', krbSignX + krbW / 2, 255);

    // Rambu Hijau Arah Evakuasi Merapi
    const evaW = 56;
    const evaH = 34;
    const evaX = krbSignX + 64;
    ctx.fillStyle = '#334155';
    ctx.fillRect(evaX + evaW / 2 - 2, 274, 4, 82);

    ctx.fillStyle = '#16a34a';
    ctx.fillRect(evaX, 242, evaW, evaH);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(evaX, 242, evaW, evaH);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8.5px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('EVAKUASI', evaX + evaW / 2, 253);
    ctx.font = 'bold 8px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('➜ SELATAN', evaX + evaW / 2, 265);
  }

  // 5. Gedung Pos Pengamatan Gunung Api (PGA) PVMBG (x: 840 - 1080)
  const pgaX = 840;
  if (pgaX + 220 > camX && pgaX - 20 < camX + viewW) {
    // Gedung Utama Pos PGA (Putih Bersih Lis Biru Kementerian ESDM)
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(pgaX, 230, 160, 126);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(pgaX, 230, 160, 6);
    ctx.fillStyle = '#0284c7'; // Lis Biru PVMBG
    ctx.fillRect(pgaX, 226, 160, 5);

    // Plang Nama Resmi Gedung (Lebar & Jelas)
    ctx.fillStyle = '#0369a1';
    ctx.fillRect(pgaX + 5, 237, 150, 20);
    ctx.strokeStyle = '#bae6fd';
    ctx.lineWidth = 1;
    ctx.strokeRect(pgaX + 5, 237, 150, 20);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9.5px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('POS PENGAMATAN MERAPI', pgaX + 80, 247.5);

    // Jendela Posko Lantai 1 dengan Monitor Seismograf Menyala
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(pgaX + 16, 270, 48, 38);
    ctx.fillStyle = '#020617';
    ctx.fillRect(pgaX + 18, 272, 44, 34);

    // Garis Gelombang Seismograf Magma Hijau Neon (Status Normal: Halus & Landai)
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pgaX + 20, 289);
    for (let gx = 0; gx <= 40; gx += 2) {
      const wave = Math.sin((gx / 40) * Math.PI * 4 + animTick * 0.05) * 4;
      ctx.lineTo(pgaX + 20 + gx, 289 + wave);
    }
    ctx.stroke();

    // Pintu Masuk Posko (x: 930 - 962, Center: 946)
    ctx.fillStyle = '#334155';
    ctx.fillRect(pgaX + 90, 274, 32, 82);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(pgaX + 92, 276, 28, 80);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(pgaX + 116, 314, 2, 6); // Gagang pintu emas

    // Menara Antena Radio Komunikasi PVMBG (Rangka Besi Tinggi 100px)
    const towerX = pgaX + 180;
    ctx.fillStyle = '#475569';
    ctx.fillRect(towerX, 160, 4, 196);
    ctx.fillRect(towerX - 10, 200, 24, 2);
    ctx.fillRect(towerX - 8, 250, 20, 2);
    ctx.fillRect(towerX - 6, 300, 16, 2);

    // Kabel Bentang Penguat (Guy Wires)
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(towerX + 2, 170);
    ctx.lineTo(towerX - 35, 356);
    ctx.moveTo(towerX + 2, 170);
    ctx.lineTo(towerX + 35, 356);
    ctx.stroke();

    // Piringan Parabola Telemetri Menghadap ke Kawah
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.ellipse(towerX - 8, 185, 8, 14, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(towerX - 14, 184, 4, 2);

    // Lampu Indikator Hijau Menara Berkedip Tenang (Aktivitas Normal)
    const isLampOn = Math.floor(animTick / 25) % 2 === 0;
    ctx.fillStyle = isLampOn ? '#22c55e' : '#14532d';
    ctx.fillRect(towerX, 155, 4, 5);
  }

  // 6. Pemukiman Dusun Destana Lereng Merapi (x: 1300 - 1700)
  const villageX = 1320;
  if (villageX + 320 > camX && villageX - 40 < camX + viewW) {
    ctx.save();

    // ── RUMAH WARGA LERENG 1 (Dusun Destana) ──
    // Fondasi Batu Kali Andesit
    ctx.fillStyle = '#334155';
    ctx.fillRect(villageX - 2, 344, 104, 12);
    ctx.fillStyle = '#475569';
    ctx.fillRect(villageX, 344, 100, 3);

    // Dinding Bata Kayu Krem Hangat
    ctx.fillStyle = '#d97706';
    ctx.fillRect(villageX, 270, 100, 74);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(villageX + 2, 272, 96, 70);

    // Tiang Kayu Jati Soko Teras
    ctx.fillStyle = '#78350f';
    ctx.fillRect(villageX + 2, 270, 7, 74);
    ctx.fillRect(villageX + 91, 270, 7, 74);
    ctx.fillRect(villageX + 34, 270, 5, 74);

    // Pintu Kayu Masuk
    ctx.fillStyle = '#451a03';
    ctx.fillRect(villageX + 42, 292, 24, 52);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(villageX + 44, 294, 20, 50);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(villageX + 60, 318, 2, 5); // Gagang pintu

    // Jendela Kiri & Kanan Berbingkai
    ctx.fillStyle = '#78350f';
    ctx.fillRect(villageX + 12, 288, 20, 24);
    ctx.fillRect(villageX + 70, 288, 20, 24);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(villageX + 14, 290, 16, 20);
    ctx.fillRect(villageX + 72, 290, 16, 20);
    // Teralis Jendela Putih
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(villageX + 14, 290, 16, 20);
    ctx.strokeRect(villageX + 72, 290, 16, 20);

    // Atap Limasan Genteng Merah Terakota
    ctx.fillStyle = '#991b1b';
    ctx.beginPath();
    ctx.moveTo(villageX - 12, 270);
    ctx.lineTo(villageX + 50, 232);
    ctx.lineTo(villageX + 112, 270);
    ctx.closePath();
    ctx.fill();
    // Lis Wuwung Atap Genteng
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(villageX - 14, 268, 128, 4);

    // ── BALAI PERTEMUAN DUSUN TANGGUH BENCANA (POSKO DESTANA) ──
    const hallX = villageX + 125;
    const hallW = 130;
    const hallCenter = hallX + hallW / 2;

    // Fondasi Beton Batu Andesit Tahan Gempa
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(hallX - 3, 344, hallW + 6, 12);
    ctx.fillStyle = '#334155';
    ctx.fillRect(hallX, 344, hallW, 3);

    // Dinding Balai Dusun Krem Terang
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(hallX, 264, hallW, 80);

    // Tiang-Tiang Kayu Penyangga Balai (Soko Guru & Pilar Depan)
    ctx.fillStyle = '#78350f';
    ctx.fillRect(hallX + 3, 264, 8, 80);
    ctx.fillRect(hallX + hallW - 11, 264, 8, 80);
    ctx.fillRect(hallX + 42, 264, 6, 80);
    ctx.fillRect(hallX + hallW - 48, 264, 6, 80);

    // Pintu Masuk Ganda Kayu Jati Terbuka Ramah Warga
    ctx.fillStyle = '#451a03';
    ctx.fillRect(hallCenter - 14, 294, 28, 50);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(hallCenter - 12, 296, 11, 48);
    ctx.fillRect(hallCenter + 1, 296, 11, 48);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(hallCenter - 3, 318, 2, 4); // Gagang pintu kiri
    ctx.fillRect(hallCenter + 2, 318, 2, 4); // Gagang pintu kanan

    // Jendela Kiri & Kanan Balai dengan Ventilasi
    ctx.fillStyle = '#78350f';
    ctx.fillRect(hallX + 16, 290, 22, 26);
    ctx.fillRect(hallX + hallW - 38, 290, 22, 26);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(hallX + 18, 292, 18, 22);
    ctx.fillRect(hallX + hallW - 36, 292, 18, 22);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(hallX + 18, 292, 18, 22);
    ctx.strokeRect(hallX + hallW - 36, 292, 18, 22);

    // Papan Mading Informasi Jalur Evakuasi & Siaga di Teras Kiri
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(hallX + 14, 322, 26, 18);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(hallX + 16, 324, 22, 14);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(hallX + 18, 326, 18, 2);
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(hallX + 18, 330, 14, 2);
    ctx.fillRect(hallX + 18, 334, 16, 2);

    // Atap Joglo Tingkat Dua Khas Balai Desa Jawa
    // Tingkat 1 (Atap Bawah Luas)
    ctx.fillStyle = '#991b1b';
    ctx.beginPath();
    ctx.moveTo(hallX - 16, 264);
    ctx.lineTo(hallCenter, 230);
    ctx.lineTo(hallX + hallW + 16, 264);
    ctx.closePath();
    ctx.fill();
    // Lis Wuwung Bawah
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(hallX - 18, 262, hallW + 36, 4);

    // Tingkat 2 (Kubah Puncak Joglo Tradisional)
    ctx.fillStyle = '#7f1d1d';
    ctx.beginPath();
    ctx.moveTo(hallCenter - 34, 232);
    ctx.lineTo(hallCenter, 215);
    ctx.lineTo(hallCenter + 34, 232);
    ctx.closePath();
    ctx.fill();
    // Mahkota Puncak Joglo
    ctx.fillStyle = '#facc15';
    ctx.fillRect(hallCenter - 3, 212, 6, 4);

    // ── PAPAN NAMA RESMI BERBINGKAI: "POSKO SIAGA DESTANA" (CENTERED & RAPI) ──
    const signW = 126;
    const signH = 26;
    const signX = hallCenter - signW / 2;
    const signY = 266;

    // Bingkai Papan Nama Emas-Hijau BPBD
    ctx.fillStyle = '#14532d'; // Hijau tua khas BPBD / Destana
    ctx.fillRect(signX, signY, signW, signH);
    ctx.strokeStyle = '#facc15'; // Lis emas terang
    ctx.lineWidth = 1.8;
    ctx.strokeRect(signX, signY, signW, signH);

    // Sudut Aksen Emas
    ctx.fillStyle = '#facc15';
    ctx.fillRect(signX, signY, 3, 3);
    ctx.fillRect(signX + signW - 3, signY, 3, 3);
    ctx.fillRect(signX, signY + signH - 3, 3, 3);
    ctx.fillRect(signX + signW - 3, signY + signH - 3, 3, 3);

    // Teks Terpusat Sempurna (Explicit textAlign = 'center')
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('POSKO SIAGA DESTANA', hallCenter, signY + 9);

    // Sub-Label Kecil
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 7px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('DESA TANGGUH BENCANA MERAPI', hallCenter, signY + 19);

    // Kentongan Ronda Bambu Tradisional di Samping Posko
    ctx.fillStyle = '#78350f';
    ctx.fillRect(hallX - 28, 276, 5, 80);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(hallX - 32, 288, 12, 28);
    // Celah Kentongan Bambu
    ctx.fillStyle = '#451a03';
    ctx.fillRect(hallX - 27, 292, 2, 20);
    // Atap Kecil Pelindung Kentongan
    ctx.fillStyle = '#78350f';
    ctx.fillRect(hallX - 35, 284, 18, 4);

    ctx.restore();
  }
}

// ══════════════════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════════════════
// ── RAMBU RESMI JALUR EVAKUASI MERAPI DENGAN PANAH KE KANAN ➔ (STANDAR BNPB / ISO 7010) ──
// Ditampilkan di semua kondisi (Eksplosif & Efusif) dan di ketiga Map (Map 1, Map 2, Map 3)
export function drawRambuJalurEvakuasiMerapi(
  ctx: CanvasRenderingContext2D,
  signX: number,
  groundY: number,
  subMap: number,
  animTick: number,
  isPostEruption: boolean = false
): void {
  ctx.save();

  const signW = 76;
  const signH = 46;
  const signTopY = groundY - 76; // Elevasi atas papan di y = 280 (posisi tinggi nyaman di atas lantai)
  const plateX = signX - signW / 2;

  // 1. Tiang Rambu Baja Hitam-Abu Kokoh (Standar Rambu BNPB)
  const poleW = 5;
  const poleX = signX - poleW / 2;
  const poleTopY = signTopY + signH - 4;
  const poleHeight = groundY - poleTopY;

  // Bayangan tiang di tanah
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(signX, groundY + 1, 12, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tiang baja
  ctx.fillStyle = '#334155';
  ctx.fillRect(poleX, poleTopY, poleW, poleHeight);
  // Kilau reflektif tiang
  ctx.fillStyle = '#64748b';
  ctx.fillRect(poleX + 1, poleTopY, 1.5, poleHeight);
  // Pelat fondasi baut di tanah
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(signX - 7, groundY - 3, 14, 3);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(signX - 5, groundY - 4, 2, 2);
  ctx.fillRect(signX + 3, groundY - 4, 2, 2);

  // Klem penjepit tiang di belakang papan
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(signX - 6, signTopY + 12, 12, 5);
  ctx.fillRect(signX - 6, signTopY + 30, 12, 5);

  // 2. Bayangan Papan Rambu
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(plateX + 3, signTopY + 3, signW, signH);

  // 3. Pelat Dasar Papan Rambu Hijau Resmi BNPB (ISO 7010 Hijau Keselamatan #15803d)
  ctx.fillStyle = isPostEruption ? '#3f3f46' : '#15803d'; // Sedikit pudar berdebu jika pasca letusan
  ctx.beginPath();
  ctx.roundRect(plateX, signTopY, signW, signH, 4);
  ctx.fill();

  // Kilau reflektif diagonal kaca rambu
  const sheenGrad = ctx.createLinearGradient(plateX, signTopY, plateX + signW, signTopY + signH);
  sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0.16)');
  sheenGrad.addColorStop(0.45, 'rgba(255, 255, 255, 0.08)');
  sheenGrad.addColorStop(0.55, 'rgba(255, 255, 255, 0)');
  sheenGrad.addColorStop(1, 'rgba(0, 0, 0, 0.12)');
  ctx.fillStyle = sheenGrad;
  ctx.beginPath();
  ctx.roundRect(plateX, signTopY, signW, signH, 4);
  ctx.fill();

  // 4. Bingkai Ganda Putih Reflektif (Double White Border Standar Rambu Darurat)
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.0;
  ctx.beginPath();
  ctx.roundRect(plateX + 2, signTopY + 2, signW - 4, signH - 4, 3);
  ctx.stroke();

  // 5. Ikon Sosok Orang Berlari ke Kanan (Running Man Pictogram Standar BNPB)
  const iconBaseX = plateX + 15;
  const iconBaseY = signTopY + 16;

  ctx.fillStyle = '#ffffff';

  // Kepala
  ctx.beginPath();
  ctx.arc(iconBaseX, iconBaseY - 8, 3.0, 0, Math.PI * 2);
  ctx.fill();

  // Tubuh condong miring ke kanan (lari kencang)
  ctx.beginPath();
  ctx.moveTo(iconBaseX - 2, iconBaseY - 4.5);
  ctx.lineTo(iconBaseX + 3.5, iconBaseY - 4.5);
  ctx.lineTo(iconBaseX + 5, iconBaseY + 2.5);
  ctx.lineTo(iconBaseX, iconBaseY + 2.5);
  ctx.closePath();
  ctx.fill();

  // Tangan (ayunan lari)
  // Tangan depan (maju ke kanan)
  ctx.beginPath();
  ctx.moveTo(iconBaseX + 2, iconBaseY - 3.5);
  ctx.lineTo(iconBaseX + 7, iconBaseY - 1);
  ctx.lineTo(iconBaseX + 9, iconBaseY - 3.5);
  ctx.lineTo(iconBaseX + 8, iconBaseY - 4.5);
  ctx.lineTo(iconBaseX + 6, iconBaseY - 2.5);
  ctx.lineTo(iconBaseX + 2, iconBaseY - 4.5);
  ctx.closePath();
  ctx.fill();
  // Tangan belakang (mundur ke kiri)
  ctx.beginPath();
  ctx.moveTo(iconBaseX - 1, iconBaseY - 3.5);
  ctx.lineTo(iconBaseX - 5.5, iconBaseY - 1);
  ctx.lineTo(iconBaseX - 6.5, iconBaseY - 2.5);
  ctx.lineTo(iconBaseX - 2, iconBaseY - 4.5);
  ctx.closePath();
  ctx.fill();

  // Kaki (langkah lari lebar)
  // Kaki depan (menekuk ke kanan)
  ctx.beginPath();
  ctx.moveTo(iconBaseX + 2, iconBaseY + 1.5);
  ctx.lineTo(iconBaseX + 6.5, iconBaseY + 5);
  ctx.lineTo(iconBaseX + 6, iconBaseY + 9.5);
  ctx.lineTo(iconBaseX + 4.5, iconBaseY + 9.5);
  ctx.lineTo(iconBaseX + 5, iconBaseY + 6);
  ctx.lineTo(iconBaseX + 1, iconBaseY + 2.5);
  ctx.closePath();
  ctx.fill();
  // Kaki belakang (menendang ke kiri-belakang)
  ctx.beginPath();
  ctx.moveTo(iconBaseX, iconBaseY + 1.5);
  ctx.lineTo(iconBaseX - 4, iconBaseY + 4);
  ctx.lineTo(iconBaseX - 7.5, iconBaseY + 6.5);
  ctx.lineTo(iconBaseX - 6.5, iconBaseY + 8);
  ctx.lineTo(iconBaseX - 3, iconBaseY + 5);
  ctx.lineTo(iconBaseX + 1, iconBaseY + 2.5);
  ctx.closePath();
  ctx.fill();

  // 6. PANAH BESAR TEBAL MENUNJUK KE KANAN (➔)
  const arrowStartX = plateX + 32;
  const arrowCenterY = signTopY + 14.5;
  const arrowLength = 26;
  const arrowPulse = Math.sin(animTick * 0.16) * 1.5; // Efek denyut panduan arah

  ctx.fillStyle = '#ffffff';

  // Batang Panah (Shaft)
  ctx.fillRect(arrowStartX, arrowCenterY - 3.5, arrowLength - 10, 7);

  // Kepala Panah Segitiga (Arrowhead pointing RIGHT)
  const tipX = arrowStartX + arrowLength + arrowPulse;
  ctx.beginPath();
  ctx.moveTo(tipX, arrowCenterY);
  ctx.lineTo(tipX - 10, arrowCenterY - 6.5);
  ctx.lineTo(tipX - 10, arrowCenterY - 2.5);
  ctx.lineTo(tipX - 10, arrowCenterY + 2.5);
  ctx.lineTo(tipX - 10, arrowCenterY + 6.5);
  ctx.closePath();
  ctx.fill();

  // Kilau reflektif pada panah
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(arrowStartX + 2, arrowCenterY - 1, arrowLength - 14, 2);

  // 7. Garis Pemisah Tipis
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillRect(plateX + 6, signTopY + 26.5, signW - 12, 1.2);

  // 8. Teks Resmi: "JALUR EVAKUASI"
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 7px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('JALUR EVAKUASI', signX, signTopY + 33.5);

  // 9. Sub-teks Arah / Petunjuk Navigasi berdasarkan SubMap
  let subText = 'IKUTI ARAH ➔';
  if (subMap === 1) subText = 'ARAH EVAKUASI ➔';
  else if (subMap === 2) subText = 'KE RADIUS AMAN ➔';
  else if (subMap === 3) subText = '➔';

  ctx.fillStyle = '#fde047'; // Kuning cerah khas rambu keselamatan
  ctx.font = 'bold 5.5px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(subText, signX, signTopY + 40.5);

  // 10. Lapisan Debu / Abu Vulkanik Tipis di Atas Papan jika Pasca Letusan
  if (isPostEruption) {
    ctx.fillStyle = 'rgba(161, 161, 170, 0.65)';
    ctx.fillRect(plateX, signTopY, signW, 3);
    ctx.fillRect(plateX + 4, signTopY + 26.5, signW - 8, 2);
  }

  ctx.restore();
}

// A. LANTAI LERENG MERAPI DENGAN VEGETASI MENGUNING & ABU VULKANIK
export function drawVolcanoSimulationGround(
  ctx: CanvasRenderingContext2D,
  camX: number,
  viewW: number,
  state: GameStateL2
): void {
  const floorY = 356;
  const floorH = 124;
  const isSimCompleted = state.unlockedGates.has('l2_gate_volcano_sim');
  const isPostEruption = isSimCompleted && (!state.volcanoSim || state.volcanoSim.phase === 'idle' || state.volcanoSim.phase === 'volcano_completed');
  const wither = isPostEruption ? 1.0 : (state.volcanoSim?.vegetationWither ?? 0);

  // 1. Dasar Rumput Lereng Pegunungan (Transisi Hijau -> Kuning Kering -> Abu Vulkanik)
  const grassGrad = ctx.createLinearGradient(0, floorY, 0, floorY + floorH);
  if (wither < 0.35) {
    grassGrad.addColorStop(0, '#15803d');
    grassGrad.addColorStop(0.3, '#166534');
    grassGrad.addColorStop(0.7, '#14532d');
  } else if (wither < 0.75) {
    grassGrad.addColorStop(0, '#a16207');
    grassGrad.addColorStop(0.3, '#854d0e');
    grassGrad.addColorStop(0.7, '#713f12');
  } else {
    grassGrad.addColorStop(0, '#57534e'); // Tertutup debu abu vulkanik
    grassGrad.addColorStop(0.3, '#44403c');
    grassGrad.addColorStop(0.7, '#292524');
  }
  grassGrad.addColorStop(0.9, '#27170a');
  grassGrad.addColorStop(1, '#1c1917');
  ctx.fillStyle = grassGrad;
  ctx.fillRect(camX, floorY, viewW, floorH);

  // 2. Jalur Setapak Aspal / Paving Pedesaan (y: 356 - 364)
  ctx.fillStyle = wither > 0.6 ? '#475569' : '#334155';
  ctx.fillRect(camX, floorY - 2, viewW, 8);
  ctx.fillStyle = isPostEruption ? '#71717a' : '#64748b';
  ctx.fillRect(camX, floorY - 2, viewW, 2);

  // Lapisan Endapan Abu Vulkanik Tebal Pasca-Letusan di Atas Aspal
  if (isPostEruption) {
    ctx.fillStyle = 'rgba(113, 113, 122, 0.75)';
    ctx.fillRect(camX, floorY - 3, viewW, 3);
  }

  // Garis Marka Putus-Putus
  const dashStep = 40;
  const startDash = Math.floor(camX / dashStep) * dashStep;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  for (let dx = startDash; dx < camX + viewW + dashStep; dx += dashStep) {
    ctx.fillRect(dx, floorY + 1, 20, 2);
  }

  // Khusus Skenario Efusif Map 1 (Dekat Hilir Sungai): Pagar Pembatas Tanggul Sungai & Plang Peringatan Sungai
  if (state.volcanoSim?.scenario === 'effusive' && (state.volcanoSim?.subMap ?? 1) === 1) {
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2;
    for (let fx = 40; fx < 2200; fx += 80) {
      if (fx + 40 < camX || fx - 40 > camX + viewW) continue;
      // Tiang pagar
      ctx.fillStyle = '#451a03';
      ctx.fillRect(fx, floorY - 14, 4, 14);
      // Palang pagar
      ctx.fillStyle = '#78350f';
      ctx.fillRect(fx - 40, floorY - 12, 80, 2.5);
      ctx.fillRect(fx - 40, floorY - 6, 80, 2);
    }

    // Papan nama penanda aliran sungai di x: 210
    const signX = 210;
    if (signX + 60 > camX && signX - 60 < camX + viewW) {
      ctx.fillStyle = '#451a03';
      ctx.fillRect(signX - 2, floorY - 26, 4, 26);
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(signX - 44, floorY - 44, 88, 18);
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(signX - 44, floorY - 44, 88, 18);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 6.5px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('HILIR SUNGAI LAHAR', signX, floorY - 34);
      ctx.fillStyle = '#93c5fd';
      ctx.font = 'bold 5.5px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('ZONA ALIRAN LAVA & LAHAR', signX, floorY - 27);
    }
  }

  // 2.1. RAMBU RESMI JALUR EVAKUASI DENGAN PANAH KE KANAN ➔ (STANDAR BNPB / ISO 7010)
  // Berlaku di KEDUA KONDISI (Eksplosif & Efusif) dan di KETIGA SUBMAP (Map 1, Map 2, Map 3)
  const subMap = state.volcanoSim?.subMap ?? 1;
  const evaqSigns = [680, 1220, 1720];
  for (const signX of evaqSigns) {
    if (signX + 60 > camX && signX - 60 < camX + viewW) {
      drawRambuJalurEvakuasiMerapi(ctx, signX, floorY, subMap, state.animTick, isPostEruption);
    }
  }

  // 3. Bebatuan Andesit & Vegetasi Bunga Menguning
  const stepX = 36;
  const startX = Math.floor(camX / stepX) * stepX - stepX * 2;
  const endX = camX + viewW + stepX * 2;

  for (let px = startX; px < endX; px += stepX) {
    const hash = Math.abs(Math.sin(px * 23.456) * 43758.5453);
    const fract = hash - Math.floor(hash);

    if (fract > 0.5) {
      const rockY = floorY + 14 + Math.floor(fract * 30);
      ctx.fillStyle = '#475569';
      ctx.fillRect(px, rockY, 8, 5);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(px + 1, rockY, 6, 2);
      ctx.fillStyle = '#334155';
      ctx.fillRect(px, rockY + 4, 8, 2);
    } else {
      const flowerY = floorY + 10 + Math.floor(fract * 40);
      ctx.fillStyle = wither > 0.5 ? '#713f12' : '#16a34a';
      ctx.fillRect(px, flowerY, 2, 5);
      ctx.fillStyle = wither > 0.5 ? '#a16207' : (fract > 0.25 ? '#fde047' : '#f472b6');
      ctx.fillRect(px - 1, flowerY - 2, 4, 3);
    }
  }

  // 4. Lapisan Tanah Vulkanik Kaya Mineral
  ctx.fillStyle = '#27170a';
  ctx.fillRect(camX, 460, viewW, 20);
  ctx.fillStyle = '#451a03';
  ctx.fillRect(camX, 460, viewW, 3);
}

// B. ATMOSPHERE SIMULASI ERUPSI MERAPI (LANGIT MEREDUP, KAWAH MERAPI, BURUNG KABUR, HUJAN ABU)
export function drawVolcanoSimulationAtmosphere(
  ctx: CanvasRenderingContext2D,
  camX: number,
  viewW: number,
  _viewH: number,
  state: GameStateL2
): void {
  const animTick = state.animTick;
  const sim = state.volcanoSim;
  const isSimCompleted = state.unlockedGates.has('l2_gate_volcano_sim');
  const isPostEruption = isSimCompleted && (!sim || sim.phase === 'idle' || sim.phase === 'volcano_completed');

  const skyDim = isPostEruption ? 0.9 : (sim?.skyDimFactor ?? 0);
  const plumeType = isPostEruption ? 'dark_ash' : (sim?.volcanoPlume ?? 'white_steam');
  const wither = isPostEruption ? 1.0 : (sim?.vegetationWither ?? 0);

  // 1. Langit Pegunungan Dinamis
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 260);
  if (isPostEruption) {
    // Apocalyptic Post-Eruption Smoky Twilight (Pasca Erupsi Merapi)
    skyGrad.addColorStop(0, '#18181b');
    skyGrad.addColorStop(0.35, '#27272a');
    skyGrad.addColorStop(0.7, '#3f3f46');
    skyGrad.addColorStop(1, '#713f12'); // Hawa panas debu bara kawah di horizon
  } else if (sim?.statusLevel === 'AWAS') {
    // Apocalyptic Fire Glow di Status Awas
    skyGrad.addColorStop(0, '#7f1d1d');
    skyGrad.addColorStop(0.3, '#450a0a');
    skyGrad.addColorStop(0.7, '#1c1917');
    skyGrad.addColorStop(1, '#0f172a');
  } else if (skyDim > 0.4) {
    // Sky meredup mendung abu-abu sepia di Status Siaga
    skyGrad.addColorStop(0, '#334155');
    skyGrad.addColorStop(0.4, '#475569');
    skyGrad.addColorStop(0.8, '#64748b');
    skyGrad.addColorStop(1, '#78716c');
  } else if (sim?.statusLevel === 'WASPADA') {
    // Sky agak berkabut tipis
    skyGrad.addColorStop(0, '#0369a1');
    skyGrad.addColorStop(0.35, '#38bdf8');
    skyGrad.addColorStop(0.7, '#94a3b8');
    skyGrad.addColorStop(1, '#cbd5e1');
  } else {
    // Normal cerah asri
    skyGrad.addColorStop(0, '#0284c7');
    skyGrad.addColorStop(0.35, '#38bdf8');
    skyGrad.addColorStop(0.7, '#7dd3fc');
    skyGrad.addColorStop(1, '#e0f2fe');
  }
  ctx.fillStyle = skyGrad;
  ctx.fillRect(camX, 0, viewW, 260);

  // Awan Mendung / Abu Melayang
  const cloudOffsets = [80, 520, 980, 1440, 1920];
  ctx.fillStyle = isPostEruption
    ? 'rgba(39, 39, 42, 0.92)'
    : sim?.statusLevel === 'AWAS'
      ? 'rgba(68, 64, 60, 0.9)'
      : skyDim > 0.4
        ? 'rgba(148, 163, 184, 0.75)'
        : 'rgba(255, 255, 255, 0.85)';

  for (const cx of cloudOffsets) {
    const driftX = (cx + animTick * 0.12) % 2400;
    if (driftX + 140 > camX && driftX - 40 < camX + viewW) {
      ctx.beginPath();
      ctx.arc(driftX, 38, 15, 0, Math.PI * 2);
      ctx.arc(driftX + 18, 32, 20, 0, Math.PI * 2);
      ctx.arc(driftX + 42, 35, 17, 0, Math.PI * 2);
      ctx.arc(driftX + 62, 40, 12, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 2. Siluet Megah Gunung Merapi (Parallax 0.08) - Skala dinamis berdasarkan SubMap (Jarak Lereng)
  const subMap = sim?.subMap ?? 1;
  let mountainScale = 1.0;
  let merapiPeakY = 88;
  if (subMap === 1) {
    mountainScale = 1.45; // Map 1: Dekat lereng (<2 km) -> Gunung BESAR
    merapiPeakY = 46;
  } else if (subMap === 2) {
    mountainScale = 1.0;  // Map 2: Jarak sedang (2-3 km) -> Gunung SEDANG
    merapiPeakY = 88;
  } else if (subMap === 3) {
    mountainScale = 0.65; // Map 3: Jauh aman (5+ km) -> Gunung LEBIH KECIL
    merapiPeakY = 138;
  }

  const paraFar = camX * 0.08;
  const merapiX = camX + viewW * 0.5 - (paraFar % 350);

  ctx.save();
  const mountainGrad = ctx.createLinearGradient(0, merapiPeakY, 0, 360);
  if (isPostEruption) {
    mountainGrad.addColorStop(0, '#27272a');
    mountainGrad.addColorStop(0.4, '#18181b');
    mountainGrad.addColorStop(0.8, '#09090b');
    mountainGrad.addColorStop(1, '#000000');
  } else {
    mountainGrad.addColorStop(0, '#475569');
    mountainGrad.addColorStop(0.4, '#334155');
    mountainGrad.addColorStop(0.8, '#1e293b');
    mountainGrad.addColorStop(1, '#0f172a');
  }
  ctx.fillStyle = mountainGrad;
  // ── DETEKSI ERUPSI EKSPLOSIF (GUNUNG RUSAK / KROAK) ──
  const isEruptingAwas =
    sim?.volcanoPlume === 'magma_fountain' ||
    sim?.phase === 'fase4_awas_siren' ||
    sim?.phase === 'fase4_awas_rescue' ||
    sim?.phase === 'fase4_awas_truck' ||
    sim?.phase === 'volcano_completed';
  const isExplosiveScenario = sim ? sim.scenario === 'explosive' : true;
  const isExplosiveErupted = isExplosiveScenario && (isEruptingAwas || isPostEruption);

  ctx.beginPath();
  ctx.moveTo(merapiX - 420 * mountainScale, 360);
  if (isExplosiveErupted) {
    // Gunung agak rusak / kroak abis meletus eksplosif (caldera collapse / broken jagged crater notch)
    ctx.lineTo(merapiX - 55 * mountainScale, merapiPeakY + 14 * mountainScale);
    ctx.lineTo(merapiX - 42 * mountainScale, merapiPeakY + 20 * mountainScale);
    ctx.lineTo(merapiX - 32 * mountainScale, merapiPeakY + 38 * mountainScale);
    ctx.lineTo(merapiX - 18 * mountainScale, merapiPeakY + 34 * mountainScale);
    ctx.lineTo(merapiX - 6 * mountainScale, merapiPeakY + 46 * mountainScale); // Takik kawah kroak terdalam
    ctx.lineTo(merapiX + 8 * mountainScale, merapiPeakY + 44 * mountainScale);
    ctx.lineTo(merapiX + 22 * mountainScale, merapiPeakY + 30 * mountainScale);
    ctx.lineTo(merapiX + 34 * mountainScale, merapiPeakY + 34 * mountainScale);
    ctx.lineTo(merapiX + 44 * mountainScale, merapiPeakY + 16 * mountainScale);
  } else {
    // Normal / Efusif / Sebelum Erupsi: Kerucut Stratovolcano utuh
    ctx.lineTo(merapiX - 50 * mountainScale, merapiPeakY + 12 * mountainScale);
    ctx.lineTo(merapiX - 10 * mountainScale, merapiPeakY);
    ctx.lineTo(merapiX + 15 * mountainScale, merapiPeakY + 4 * mountainScale);
  }
  ctx.lineTo(merapiX + 450 * mountainScale, 360);
  ctx.closePath();
  ctx.fill();

  // Dinding dalam kaldera kawah kroak (shattered inner crater cliff face) saat eksplosif
  if (isExplosiveErupted) {
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.moveTo(merapiX - 42 * mountainScale, merapiPeakY + 20 * mountainScale);
    ctx.lineTo(merapiX - 6 * mountainScale, merapiPeakY + 46 * mountainScale);
    ctx.lineTo(merapiX + 8 * mountainScale, merapiPeakY + 44 * mountainScale);
    ctx.lineTo(merapiX + 34 * mountainScale, merapiPeakY + 34 * mountainScale);
    ctx.lineTo(merapiX + 20 * mountainScale, merapiPeakY + 22 * mountainScale);
    ctx.lineTo(merapiX - 12 * mountainScale, merapiPeakY + 26 * mountainScale);
    ctx.closePath();
    ctx.fill();

    // Rekahan retakan batuan andesit hancur di sekitar takik kroak
    ctx.strokeStyle = '#09090b';
    ctx.lineWidth = 2 * mountainScale;
    ctx.beginPath();
    ctx.moveTo(merapiX - 32 * mountainScale, merapiPeakY + 38 * mountainScale);
    ctx.lineTo(merapiX - 22 * mountainScale, merapiPeakY + 56 * mountainScale);
    ctx.moveTo(merapiX + 22 * mountainScale, merapiPeakY + 30 * mountainScale);
    ctx.lineTo(merapiX + 28 * mountainScale, merapiPeakY + 50 * mountainScale);
    ctx.stroke();
  }

  // Guratan Lembah Alur Sungai Lahar (Warna Slate Alami Serasi Area 6)
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 3 * mountainScale;
  ctx.beginPath();
  if (isExplosiveErupted) {
    ctx.moveTo(merapiX + 22 * mountainScale, merapiPeakY + 32 * mountainScale);
  } else {
    ctx.moveTo(merapiX + 15 * mountainScale, merapiPeakY + 6 * mountainScale);
  }
  ctx.lineTo(merapiX + 60 * mountainScale, merapiPeakY + 90 * mountainScale);
  ctx.lineTo(merapiX + 140 * mountainScale, 360);
  if (isExplosiveErupted) {
    ctx.moveTo(merapiX - 6 * mountainScale, merapiPeakY + 46 * mountainScale);
  } else {
    ctx.moveTo(merapiX - 10 * mountainScale, merapiPeakY + 4 * mountainScale);
  }
  ctx.lineTo(merapiX - 70 * mountainScale, merapiPeakY + 110 * mountainScale);
  ctx.lineTo(merapiX - 160 * mountainScale, 360);
  ctx.stroke();

  // ── LELEHAN MAGMA MENGALIR DARI PUNCAK KAWAH (STATUS AWAS / EKSPLOSIF / EFUSIF / PASCA ERUPSI) ──
  const showMagmaFlow =
    isPostEruption || isEruptingAwas || (sim?.magmaFlowProgress ?? 0) > 0;

  if (showMagmaFlow) {
    const progress = isPostEruption
      ? 1.0
      : (sim?.magmaFlowProgress !== undefined ? sim.magmaFlowProgress : 0);
    const lavaOriginY = isExplosiveErupted ? merapiPeakY + 38 * mountainScale : merapiPeakY;
    const scenario = sim?.scenario ?? 'explosive';
    drawEruptingLavaFlows(
      ctx,
      merapiX,
      lavaOriginY,
      mountainScale,
      progress,
      animTick,
      isPostEruption,
      scenario
    );
  }

  // ── KEPUAN KAWAH SESUAI FASE PVMBG ──
  const plumeX = merapiX + (isExplosiveErupted ? 1 : 2) * mountainScale;
  const plumeY = merapiPeakY + (isExplosiveErupted ? 40 : 4) * mountainScale;

  if (plumeType === 'clear') {
    // Fase 1 Normal: Gunung tenang asri tanpa asap sama sekali
  } else if (isPostEruption) {
    // Pasca Erupsi: Gunung Merapi Masih Mengeluarkan Kolom Asap Hitam Tebal & Bara Pijar
    drawRealisticVolcanicSmoke(ctx, plumeX, plumeY, animTick, 'dark_ash', 1.25 * mountainScale);
  } else if (plumeType === 'white_steam') {
    // 1. Asap Solfatara Putih Halus Fumarol (WASPADA)
    drawRealisticVolcanicSmoke(ctx, plumeX, plumeY, animTick, false, mountainScale);
  } else if (plumeType === 'dark_ash') {
    // 2. Kolom Abu Gelap Bergulung-gulung Tinggi (SIAGA)
    drawDenseDarkAshPlume(ctx, plumeX, plumeY, animTick, mountainScale);
  } else if (plumeType === 'magma_fountain') {
    if (sim?.scenario === 'effusive') {
      // 3. Erupsi Efusif: Magma cair encer, minim ledakan, uap tipis menyebar mendatar, tanpa bom batuan
      drawMagmaEffusiveFountain(ctx, plumeX, plumeY, animTick, mountainScale);
    } else {
      // 3. Ledakan Eksplosif: Gas Tekanan Tinggi, Awan Panas & Bom Piroklastik (AWAS)
      drawMagmaExplosiveFountain(ctx, plumeX, plumeY, animTick, sim, mountainScale);
    }
  }
  ctx.restore();

  // 3. Kawanan Burung Terbang Panik Menjauhi Kawah
  if (!isPostEruption && sim && sim.fleeingBirds.length > 0) {
    drawFleeingBirdFlock(ctx, sim.fleeingBirds);
  }

  // 4. Perbukitan Hijau Pinus dengan Daun Menguning (atau Terbakar/Layu Pasca Erupsi)
  drawVolcanoSimulationHills(ctx, camX, viewW, wither, animTick);

  // 4.1. Hilir Sungai di Dekat Gunung (KHUSUS SKENARIO EFUSIF)
  if (sim?.scenario === 'effusive') {
    drawEffusiveDownstreamRiver(ctx, camX, viewW, state);
  }

  // 5. Bangunan Pedesaan Dusun Destana & Pos Sirine EWS
  drawVolcanoSimulationVillage(ctx, camX, viewW, state);

  // 6. Truk Evakuasi BPBD di Ujung Jalan Dusun (HANYA MUNCUL DI MAP 3 / SAFE ZONE)
  if (sim && !isPostEruption && sim.subMap === 3) {
    drawEvacuationRescueTruck(ctx, sim.truckX, 356, sim.truckState, animTick);
  }

  // 7. Partikel Hujan Abu Vulkanik Melayang Turun (Saat simulasi atau Pasca Erupsi)
  if (isPostEruption) {
    for (let ap = 0; ap < 36; ap++) {
      const aSpeed = 0.75 + (ap % 4) * 0.35;
      const ay = ((animTick * aSpeed + ap * 28) % 360);
      const ax = camX + ((ap * 68 + Math.sin(animTick * 0.03 + ap) * 14) % viewW);
      ctx.fillStyle = ap % 6 === 0 ? 'rgba(249, 115, 22, 0.65)' : 'rgba(161, 161, 170, 0.65)';
      ctx.fillRect(ax, ay, 2, 2);
    }
  } else if (sim && sim.ashParticles.length > 0) {
    drawAshFallOverlay(ctx, sim.ashParticles);
  }
}


// H. BANGUNAN PEDESAAN DUSUN DESTANA & POS RONDA DENGAN KENTONGAN
// ── HELPER: TIANG SIRINE PERINGATAN DINI BENCANA EWS MERAPI (MENGGANTIKAN KENTONGAN) ──
export function drawTiangSirineEws(
  ctx: CanvasRenderingContext2D,
  poleX: number,
  groundY: number,
  isActive: boolean,
  animTick: number
): void {
  ctx.save();

  // 1. Pondasi Beton Tiang
  ctx.fillStyle = '#64748b';
  ctx.fillRect(poleX - 10, groundY - 8, 20, 8);
  ctx.fillStyle = '#475569';
  ctx.fillRect(poleX - 12, groundY - 3, 24, 3);

  // 2. Tiang Baja Tubular (Metal Lattice / Mast)
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(poleX - 3, groundY - 110, 6, 102);
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(poleX - 1, groundY - 110, 2, 102);

  // Cross-bracing / tangga tiang
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1.5;
  for (let ty = groundY - 95; ty < groundY - 20; ty += 12) {
    ctx.beginPath();
    ctx.moveTo(poleX - 5, ty);
    ctx.lineTo(poleX + 5, ty);
    ctx.stroke();
  }

  // 3. Kotak Kontrol Panel EWS Kuning (Waist Height, groundY - 48)
  ctx.fillStyle = '#ca8a04';
  ctx.fillRect(poleX - 9, groundY - 48, 18, 26);
  ctx.fillStyle = '#eab308';
  ctx.fillRect(poleX - 8, groundY - 47, 16, 24);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(poleX - 5, groundY - 43, 10, 8);
  ctx.fillStyle = isActive ? '#22c55e' : '#ef4444';
  ctx.beginPath();
  ctx.arc(poleX + 3, groundY - 28, 2, 0, Math.PI * 2);
  ctx.fill();

  // 4. Panel Surya Daya Cadangan di Atas (groundY - 116)
  ctx.fillStyle = '#1e3a8a';
  ctx.beginPath();
  ctx.moveTo(poleX - 14, groundY - 116);
  ctx.lineTo(poleX + 14, groundY - 120);
  ctx.lineTo(poleX + 14, groundY - 114);
  ctx.lineTo(poleX - 14, groundY - 110);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#60a5fa';
  ctx.lineWidth = 1;
  ctx.stroke();

  // 5. Corong Pengeras Suara Megafon Quad 4 Arah (groundY - 100)
  const sirenY = groundY - 100;
  ctx.fillStyle = '#334155';
  ctx.fillRect(poleX - 6, sirenY - 4, 12, 8);

  // Corong Kiri
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.moveTo(poleX - 6, sirenY - 2);
  ctx.lineTo(poleX - 22, sirenY - 9);
  ctx.lineTo(poleX - 22, sirenY + 7);
  ctx.lineTo(poleX - 6, sirenY + 2);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.ellipse(poleX - 22, sirenY - 1, 3, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Corong Kanan
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.moveTo(poleX + 6, sirenY - 2);
  ctx.lineTo(poleX + 22, sirenY - 9);
  ctx.lineTo(poleX + 22, sirenY + 7);
  ctx.lineTo(poleX + 6, sirenY + 2);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.ellipse(poleX + 22, sirenY - 1, 3, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // 6. Lampu Strobe Rotator Puncak (groundY - 108)
  const isFlash = isActive ? Math.floor(animTick / 6) % 2 === 0 : false;
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(poleX - 5, sirenY - 10, 10, 6);

  ctx.fillStyle = isFlash ? '#facc15' : (isActive ? '#ef4444' : '#71717a');
  ctx.beginPath();
  ctx.arc(poleX, sirenY - 10, 5, Math.PI, 0);
  ctx.fill();

  // Sorotan Cahaya Strobe jika Sirine Aktif
  if (isActive) {
    const pulseR = 36 + Math.sin(animTick * 0.35) * 14;
    const strobeGlow = ctx.createRadialGradient(poleX, sirenY - 10, 4, poleX, sirenY - 10, pulseR);
    strobeGlow.addColorStop(0, isFlash ? 'rgba(254, 240, 138, 0.9)' : 'rgba(239, 68, 68, 0.8)');
    strobeGlow.addColorStop(0.5, isFlash ? 'rgba(234, 179, 8, 0.35)' : 'rgba(220, 38, 38, 0.35)');
    strobeGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = strobeGlow;
    ctx.beginPath();
    ctx.arc(poleX, sirenY - 10, pulseR, 0, Math.PI * 2);
    ctx.fill();

    // Gelombang Suara (Sound Waves)
    ctx.strokeStyle = isFlash ? '#fde047' : '#ef4444';
    ctx.lineWidth = 2;
    for (let w = 1; w <= 3; w++) {
      const waveRadius = ((animTick * 2.5 + w * 20) % 60);
      const waveAlpha = 1 - waveRadius / 60;
      ctx.globalAlpha = Math.max(0, waveAlpha);
      ctx.beginPath();
      ctx.arc(poleX, sirenY - 1, waveRadius, -Math.PI * 0.45, Math.PI * 0.45);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(poleX, sirenY - 1, waveRadius, Math.PI * 0.55, Math.PI * 1.45);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  // Label Info Tiang
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 7px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SIRINE EWS', poleX, groundY - 124);

  ctx.restore();
}

// ── HELPER: KANTOR & POSKO UTAMA KEBENCANAAN BPBD (MAP 3 - SAFE ZONE) ──
export function drawKantorBpbd(
  ctx: CanvasRenderingContext2D,
  hallX: number,
  groundY: number,
  animTick: number
): void {
  const hallW = 160;
  const hallCenter = hallX + hallW / 2;
  const roofTopY = groundY - 106;
  const wallTopY = groundY - 78;

  ctx.save();

  // 1. Dinding Gedung BPBD Modern (Putih & Abu-Abu Kokoh)
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(hallX, wallTopY, hallW, 78);
  ctx.fillStyle = '#334155';
  ctx.fillRect(hallX - 4, groundY - 6, hallW + 8, 6);

  // Pilar Dinding Biru BPBD
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(hallX, wallTopY, 12, 78);
  ctx.fillRect(hallX + hallW - 12, wallTopY, 12, 78);
  ctx.fillRect(hallX + 44, wallTopY, 8, 78);
  ctx.fillRect(hallX + hallW - 52, wallTopY, 8, 78);

  // 2. Garis Hazard Oranye & Biru Khas Tanggap Bencana
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(hallX, wallTopY, hallW, 6);
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(hallX, wallTopY + 6, hallW, 3);

  // 3. Pintu Kaca & Jendela Kantor
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(hallCenter - 18, groundY - 50, 36, 50);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(hallCenter - 15, groundY - 46, 14, 44);
  ctx.fillRect(hallCenter + 1, groundY - 46, 14, 44);

  // Jendela Kiri & Kanan
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(hallX + 16, wallTopY + 18, 22, 24);
  ctx.fillRect(hallX + hallW - 38, wallTopY + 18, 22, 24);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  ctx.strokeRect(hallX + 16, wallTopY + 18, 22, 24);
  ctx.strokeRect(hallX + hallW - 38, wallTopY + 18, 22, 24);

  // 4. Atap Kanopi Modern Datar dengan Lis Oranye
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(hallX - 10, roofTopY + 14, hallW + 20, 14);
  ctx.fillStyle = '#f97316';
  ctx.fillRect(hallX - 12, roofTopY + 24, hallW + 24, 4);

  // 5. Antena Parabola & Tiang Radio Komunikasi Darurat di Atap
  ctx.fillStyle = '#64748b';
  ctx.fillRect(hallX + 24, roofTopY - 14, 3, 28);
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(hallX + 25, roofTopY - 14, 10, Math.PI * 0.9, Math.PI * 1.9);
  ctx.stroke();

  // Lampu signal tower merah berkedip
  const isRedBlink = Math.floor(animTick / 15) % 2 === 0;
  ctx.fillStyle = isRedBlink ? '#ef4444' : '#7f1d1d';
  ctx.beginPath();
  ctx.arc(hallX + 25, roofTopY - 16, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // 6. Plang Papan Nama Resmi BPBD (Besar, Proporsional, & Pas di dalam Box)
  const boardW = 146;
  const boardH = 24;
  const boardX = hallCenter - boardW / 2;
  const boardY = wallTopY - 17;

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(boardX, boardY, boardW, boardH);
  ctx.strokeStyle = '#f97316';
  ctx.lineWidth = 2;
  ctx.strokeRect(boardX, boardY, boardW, boardH);

  // Badge Kotak Oranye BPBD (Lebar 28px agar teks BPBD pas dengan padding lega)
  const badgeX = boardX + 3;
  const badgeY = boardY + 3;
  const badgeW = 28;
  const badgeH = 18;
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(badgeX, badgeY, badgeW, badgeH);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 7px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('BPBD', badgeX + badgeW / 2, badgeY + badgeH / 2, 22);

  // Teks Informasi Posko (Disesuaikan ukuran font dan batas maxWidth agar tidak keluar border)
  const textX = badgeX + badgeW + 6;
  const maxTextW = boardX + boardW - textX - 4; // 105px batas aman dalam kotak

  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 8px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('POSKO UTAMA BENCANA', textX, wallTopY - 5, maxTextW);

  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 6.5px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('KABUPATEN SLEMAN / YOGYAKARTA', textX, wallTopY + 4, maxTextW);

  // 7. Karung Pasir & Kotak Logistik Darurat di Depan Kantor
  ctx.fillStyle = '#d97706';
  ctx.fillRect(hallX + 6, groundY - 14, 20, 8);
  ctx.fillRect(hallX + 9, groundY - 20, 16, 7);
  ctx.fillStyle = '#b45309';
  ctx.fillRect(hallX + 7, groundY - 8, 20, 8);

  ctx.restore();
}

// ── HELPER: SATWA LIAR LERENG BERMIGRASI (BURUNG, RUSA, KERA, MACAN) ──
export function drawMigratingAnimals(
  ctx: CanvasRenderingContext2D,
  animals: MigratingAnimalL2[],
  animTick: number,
  camX: number,
  viewW: number
): void {
  ctx.save();

  for (const a of animals) {
    if (a.x + 60 < camX || a.x - 60 > camX + viewW) continue;

    ctx.save();
    ctx.translate(a.x, a.y);
    if (a.dir === 'left') ctx.scale(-1, 1);

    const runCycle = Math.sin(animTick * 0.4 + a.x * 0.05);
    const aKind = a.kind || a.type;

    // Kepulan debu lari di bawah kaki satwa darat
    if (aKind !== 'burung') {
      ctx.save();
      ctx.fillStyle = 'rgba(214, 211, 209, 0.55)';
      ctx.beginPath();
      ctx.arc(-12 - (animTick % 6), 5, 3 + (animTick % 3), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    if (aKind === 'burung') {
      const wingY = Math.sin(animTick * 0.5 + a.x * 0.1) * 8;
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.ellipse(0, 0, 7, 3.5, 0.1, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#020617';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-5, -wingY);
      ctx.lineTo(0, 0);
      ctx.lineTo(5, -wingY);
      ctx.stroke();

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(5, -1);
      ctx.lineTo(10, 0);
      ctx.lineTo(5, 1);
      ctx.closePath();
      ctx.fill();
    } else if (aKind === 'rusa') {
      const bounceY = Math.abs(Math.sin(animTick * 0.35 + a.x * 0.05)) * 4;
      ctx.translate(0, -bounceY);

      ctx.fillStyle = '#92400e';
      ctx.fillRect(-14, -14, 24, 11);
      ctx.fillStyle = '#b45309';
      ctx.fillRect(-12, -13, 20, 9);

      ctx.fillStyle = '#92400e';
      ctx.fillRect(8, -20, 6, 10);
      ctx.fillRect(11, -24, 8, 7);

      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(13, -24);
      ctx.lineTo(11, -32);
      ctx.lineTo(7, -35);
      ctx.moveTo(11, -29);
      ctx.lineTo(15, -34);
      ctx.stroke();

      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(8, -3);
      ctx.lineTo(11 + runCycle * 6, 8);
      ctx.moveTo(5, -3);
      ctx.lineTo(7 - runCycle * 6, 8);
      ctx.moveTo(-10, -3);
      ctx.lineTo(-7 - runCycle * 7, 8);
      ctx.moveTo(-13, -3);
      ctx.lineTo(-11 + runCycle * 7, 8);
      ctx.stroke();

      ctx.fillStyle = '#fef08a';
      ctx.fillRect(-16, -15, 3, 4);
    } else if (aKind === 'kera') {
      const bounceY = Math.abs(Math.sin(animTick * 0.45 + a.x * 0.08)) * 3;
      ctx.translate(0, -bounceY);

      ctx.fillStyle = '#78350f';
      ctx.fillRect(-8, -10, 14, 8);

      ctx.fillStyle = '#a8a29e';
      ctx.beginPath();
      ctx.arc(8, -10, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fca5a5';
      ctx.fillRect(9, -10, 3, 3);

      ctx.strokeStyle = '#57534e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-8, -8);
      ctx.quadraticCurveTo(-14, -18, -18, -12);
      ctx.stroke();

      ctx.strokeStyle = '#57534e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(4, -3);
      ctx.lineTo(7 + runCycle * 5, 5);
      ctx.moveTo(-6, -3);
      ctx.lineTo(-4 - runCycle * 5, 5);
      ctx.stroke();
    } else if (aKind === 'macan') {
      const spineFlex = Math.sin(animTick * 0.35 + a.x * 0.06) * 2;

      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.ellipse(0, -9 + spineFlex, 15, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#1c1917';
      ctx.fillRect(-8, -11 + spineFlex, 2, 2);
      ctx.fillRect(-2, -8 + spineFlex, 3, 2);
      ctx.fillRect(4, -11 + spineFlex, 2, 2);
      ctx.fillRect(6, -7 + spineFlex, 2, 2);

      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.arc(15, -11 + spineFlex, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(17, -12 + spineFlex, 2, 1.5);

      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-14, -8 + spineFlex);
      ctx.quadraticCurveTo(-22, -12, -24, -6);
      ctx.stroke();

      ctx.strokeStyle = '#c2410c';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(10, -4);
      ctx.lineTo(15 + runCycle * 7, 7);
      ctx.moveTo(-10, -4);
      ctx.lineTo(-8 - runCycle * 7, 7);
      ctx.stroke();
    }

    ctx.restore();
  }

  ctx.restore();
}

// ── HELPER: PERLENGKAPAN SIAGA ERUPSI (MASKER N95 DI WAJAH & TAS SIAGA DI PUNGGUNG) ──
export function drawPlayerDisasterGearOverlay(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  dir: 'left' | 'right',
  isWalking: boolean,
  walkFrame: number,
  onGround: boolean
): void {
  ctx.save();
  ctx.translate(Math.round(px), Math.round(py));
  ctx.scale(dir === 'left' ? -1 : 1, 1);

  const bobY = isWalking && onGround ? (walkFrame % 2 === 0 ? 0 : -1) : 0;

  // 1. TAS SIAGA BENCANA (RANSEL ORANYE-MERAH RESCUE DENGAN STRAP REFLEKTIF & SIMBOL MEDIS)
  const bagX = -13;
  const bagY = -23 + bobY;
  const bagW = 8;
  const bagH = 14;

  // Bayangan tas
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillRect(bagX - 1, bagY + 1, bagW + 2, bagH);

  // Badan tas
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(bagX, bagY, bagW, bagH);

  // Flap atas
  ctx.fillStyle = '#c2410c';
  ctx.fillRect(bagX, bagY, bagW, 4);

  // Pita reflektif perak pemantul cahaya
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(bagX, bagY + 6, bagW, 2);

  // Simbol Palang Putih (+)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(bagX + 2, bagY + 10, 4, 1.5);
  ctx.fillRect(bagX + 3.2, bagY + 8.8, 1.6, 4);

  // Tali ransel di bahu
  ctx.strokeStyle = '#9a3412';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(bagX + 5, bagY + 1);
  ctx.lineTo(-2, -21 + bobY);
  ctx.lineTo(-1, -12 + bobY);
  ctx.stroke();

  // 2. MASKER RESPIRATOR N95 (DI WAJAH / HIDUNG & MULUT KARAKTER)
  const maskX = 2;
  const maskY = -22 + bobY;
  const maskW = 6;
  const maskH = 6;

  // Kubah putih masker N95
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(maskX, maskY);
  ctx.lineTo(maskX + maskW, maskY + 2);
  ctx.lineTo(maskX + maskW - 1, maskY + maskH);
  ctx.lineTo(maskX, maskY + maskH);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Katup filter pernapasan N95 (titik oranye cerah)
  ctx.fillStyle = '#f97316';
  ctx.fillRect(maskX + maskW - 3, maskY + 2, 2, 2);

  // Tali elastis pengikat masker ke belakang kepala
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(maskX + 1, maskY + 1);
  ctx.lineTo(-4, maskY - 1);
  ctx.moveTo(maskX + 1, maskY + 4);
  ctx.lineTo(-4, maskY + 3);
  ctx.stroke();

  ctx.restore();
}

// ── HELPER: BUBBLE KEPANIKAN WARGA EVAKUASI (FASE 1: BELUM PANIK BANGET, FASE 2: PANIK BANGET) ──
export function drawVolcanoFleeingNpcPanicBubbles(
  ctx: CanvasRenderingContext2D,
  npcs: Map<string, NpcStateL2> | undefined,
  phase: string,
  animTick: number
): void {
  if (!npcs) return;

  const isMap1Evac = phase === 'fase2_waspada_evac';
  const isMap2Evac = phase === 'fase3_siaga_prep_evac';
  const isMap2Calm = phase === 'fase2_map2_arrived' || phase === 'fase2_map2_calm';
  const isMap3Calm = phase === 'fase3_map3_arrived';
  const isMap3After = phase === 'fase3_map3_after_timeskip';

  if (!isMap1Evac && !isMap2Evac && !isMap2Calm && !isMap3Calm && !isMap3After) return;

  const map1Dialogues = [
    'Ayo cepat mengungsi!',
    'Jauhi lereng ke zona 2 km!',
    'Tetap tenang, jalan cepat!',
    'Bawa bekal & surat berharga!',
    'Lari ke pos aman bawah!',
    'Ikuti jalur evakuasi!'
  ];

  const map2Dialogues = [
    'LARI!! ABU MAKIN TEBAL!!',
    'CEPAT KE RADIUS 5 KM!!',
    'MERAPI BERGEMURUH HEBAT!!',
    'SELAMATKAN DIRI, LARI!!',
    'AWAS AWAN PANAS! CEPAT!!',
    'JANGAN KETINGGALAN!!'
  ];

  const map2CalmDialogues = [
    'Fiuh, untung masih selamat!',
    'Napas dulu sebentar di posko...',
    'Alhamdulillah aman di radius 2-3 km!',
    'Semoga Merapi lekas tenang ya...',
    'Aman sementara di posko ini!',
    'Syukurlah kita sempat lari tadi!'
  ];

  const map3CalmDialogues = [
    'Syukurlah sudah tiba di posko pengungsian!',
    'Di sini radius 5 km, relatif lebih aman.',
    'BPBD sudah siaga dengan truk evakuasi.',
    'Istirahat dulu, amati arahan petugas!',
    'Semoga tidak terjadi erupsi besar ya...',
    'Tetap waspada dan siapkan perlengkapan!'
  ];

  const map3AfterDialogues = [
    'Aduh, gemuruh dari kawah terdengar lagi!',
    'Asapnya makin gelap pekat ke angkasa...',
    'Petugas minta kita kumpul dekat posko!',
    'Firasatku tidak enak, tetap siaga!',
    'Jangan jauh-jauh dari kendaraan evakuasi!',
    'Semua warga bersiap kalau ada sirine!'
  ];

  let idx = 0;
  for (const npc of npcs.values()) {
    if (npc.id === 'l2_sim5_npc_resqy') continue;
    idx++;

    // Hanya picu chat sekali saja (one-shot speech bubble) per fase
    if (npc.spokenPhase !== phase) {
      npc.spokenPhase = phase;
      const delay = idx * 20; // Stagger lembut antar NPC (0.33s jeda)
      npc.speechTimer = 210 + delay; // Durasi total tampil 3.5 detik (210 frame) setelah jeda
      const dialogueList = isMap2Evac
        ? map2Dialogues
        : isMap2Calm
          ? map2CalmDialogues
          : isMap3Calm
            ? map3CalmDialogues
            : isMap3After
              ? map3AfterDialogues
              : map1Dialogues;
      npc.speechText = dialogueList[idx % dialogueList.length];
    }

    // Jika timer habis atau belum di-set, lewati (tidak akan pernah muncul lagi di fase ini)
    if (!npc.speechTimer || npc.speechTimer <= 0) continue;

    npc.speechTimer--;

    // Tunggu jeda stagger sebelum memunculkan bubble
    if (npc.speechTimer > 210) continue;

    const text = npc.speechText || '';
    if (!text) continue;

    const bx = npc.x;
    const by = npc.y - 44;

    ctx.save();
    ctx.font = isMap2Evac
      ? '900 8.5px "Plus Jakarta Sans", system-ui, sans-serif'
      : (isMap2Calm || isMap3Calm || isMap3After)
        ? '800 8px "Plus Jakarta Sans", system-ui, sans-serif'
        : '700 8px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const textMetrics = ctx.measureText(text);
    const boxW = Math.max(textMetrics.width + 14, 60);
    const boxH = 18;

    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(bx - boxW / 2 + 2, by - boxH / 2 + 2, boxW, boxH);

    // Kotak bubble
    ctx.fillStyle = isMap2Evac
      ? '#fff1f2'
      : isMap3After
        ? '#fffbeb'
        : (isMap2Calm || isMap3Calm)
          ? '#f0fdf4'
          : '#f8fafc';
    ctx.beginPath();
    ctx.roundRect(bx - boxW / 2, by - boxH / 2, boxW, boxH, 4);
    ctx.fill();

    // Border: Merah jika Panik, Kuning/Orange jika Siaga Tinggi Menjelang Letusan, Hijau jika Tenang, Abu jika Fase 1
    if (isMap2Evac) {
      const isRed = Math.floor(animTick / 8) % 2 === 0;
      ctx.strokeStyle = isRed ? '#ef4444' : '#ea580c';
      ctx.lineWidth = 2;
    } else if (isMap3After) {
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.6;
    } else if (isMap2Calm || isMap3Calm) {
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 1.4;
    } else {
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.2;
    }
    ctx.stroke();

    // Ekor bubble menunjuk ke kepala
    ctx.fillStyle = isMap2Evac
      ? '#fff1f2'
      : isMap3After
        ? '#fffbeb'
        : (isMap2Calm || isMap3Calm)
          ? '#f0fdf4'
          : '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(bx - 3, by + boxH / 2);
    ctx.lineTo(bx, by + boxH / 2 + 5);
    ctx.lineTo(bx + 3, by + boxH / 2);
    ctx.closePath();
    ctx.fill();

    // Teks teriakan/ucapan warga
    ctx.fillStyle = isMap2Evac
      ? '#991b1b'
      : isMap3After
        ? '#78350f'
        : (isMap2Calm || isMap3Calm)
          ? '#14532d'
          : '#0f172a';
    ctx.fillText(text, bx, by);

    // Jika Fase 2 (Panik banget): tambahkan partikel keringat panik di samping kepala
    if (isMap2Evac) {
      const sweatY = by + 8 + ((animTick + idx * 7) % 6);
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(bx + 16, sweatY, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

// ── HELPER: SPEECH BUBBLE PEMAIN ("Wuah indah banget tempat ini!") ──
export function drawPlayerVolcanoSpeechBubble(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  text: string,
  animTick: number
): void {
  ctx.save();
  const floatY = Math.sin(animTick * 0.15) * 3;
  const bubbleY = py - 46 + floatY;

  ctx.font = 'bold 11px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif';
  const textW = ctx.measureText(text).width;
  const padX = 14;
  const bubbleW = textW + padX * 2;
  const bubbleH = 28;
  const bubbleX = px - bubbleW / 2;

  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 3;

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(bubbleX, bubbleY - bubbleH, bubbleW, bubbleH, 12);
  ctx.fill();
  ctx.shadowColor = 'transparent';

  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Ekor bubble ke kepala pemain
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(px - 6, bubbleY);
  ctx.lineTo(px, bubbleY + 8);
  ctx.lineTo(px + 6, bubbleY);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(px - 6, bubbleY);
  ctx.lineTo(px, bubbleY + 8);
  ctx.lineTo(px + 6, bubbleY);
  ctx.stroke();

  ctx.fillStyle = '#0369a1';
  ctx.textAlign = 'center';
  ctx.fillText(text, px, bubbleY - 10);

  ctx.restore();
}

// H. BANGUNAN PEDESAAN DUSUN & POS SIRINE EWS
export function drawVolcanoSimulationVillage(
  ctx: CanvasRenderingContext2D,
  camX: number,
  viewW: number,
  state: GameStateL2
): void {
  const animTick = state.animTick;
  const villageX = 350;
  if (villageX + 700 < camX || villageX - 100 > camX + viewW) return;

  const isSimCompleted = state.unlockedGates.has('l2_gate_volcano_sim');
  const isPostEruption = isSimCompleted && (!state.volcanoSim || state.volcanoSim.phase === 'idle' || state.volcanoSim.phase === 'volcano_completed');
  const subMap = state.volcanoSim?.subMap ?? 1;

  ctx.save();

  // 1. BANGUNAN UTAMA (MAP 3: KANTOR BPBD | MAP 1 & 2: POSKO DESTANA / JOGLO)
  const hallX = 420;
  const hallW = 140;
  const hallCenter = hallX + hallW / 2;

  if (subMap === 3) {
    // Map 3: Kantor & Posko Utama BPBD Modern
    drawKantorBpbd(ctx, hallX, 356, animTick);
  } else if (subMap === 2) {
    // Map 2: Rumah Joglo Serambi Teras Jati Pedesaan (Bentuk Arsitektur Variatif)
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(hallX, 264, hallW, 80);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(hallX + 3, 264, 8, 80);
    ctx.fillRect(hallX + hallW - 11, 264, 8, 80);
    ctx.fillRect(hallX + 38, 264, 6, 80);
    ctx.fillRect(hallX + hallW - 44, 264, 6, 80);

    // Teras kayu
    ctx.fillStyle = '#451a03';
    ctx.fillRect(hallCenter - 14, 294, 28, 50);

    // Atap Joglo Serambi
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.moveTo(hallX - 16, 264);
    ctx.lineTo(hallCenter, 224);
    ctx.lineTo(hallX + hallW + 16, 264);
    ctx.closePath();
    ctx.fill();

    // Papan Nama
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(hallCenter - 54, 268, 108, 16);
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(hallCenter - 54, 268, 108, 16);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 6.5px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('POSKO WARGA', hallCenter, 280);
  } else {
    // Map 1: Balai Desa Tangguh Bencana (Posko Destana Lereng Dekat)
    ctx.fillStyle = isPostEruption ? '#a1a1aa' : '#fef3c7';
    ctx.fillRect(hallX, 264, hallW, 80);
    ctx.fillStyle = isPostEruption ? '#09090b' : '#1e293b';
    ctx.fillRect(hallX - 3, 344, hallW + 6, 12);

    ctx.fillStyle = isPostEruption ? '#292524' : '#78350f';
    ctx.fillRect(hallX + 3, 264, 8, 80);
    ctx.fillRect(hallX + hallW - 11, 264, 8, 80);
    ctx.fillRect(hallX + 42, 264, 6, 80);
    ctx.fillRect(hallX + hallW - 48, 264, 6, 80);

    ctx.fillStyle = isPostEruption ? '#1c1917' : '#451a03';
    ctx.fillRect(hallCenter - 14, 294, 28, 50);

    ctx.fillStyle = isPostEruption ? '#450a0a' : '#991b1b';
    ctx.beginPath();
    ctx.moveTo(hallX - 16, 264);
    ctx.lineTo(hallCenter, 226);
    ctx.lineTo(hallX + hallW + 16, 264);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#14532d';
    ctx.fillRect(hallCenter - 54, 268, 108, 16);
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(hallCenter - 54, 268, 108, 16);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 6.5px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('POSKO SIAGA DESTANA', hallCenter, 279);
  }

  // 2. TIANG SIRINE PERINGATAN DINI EWS (MENGGANTIKAN KENTONGAN BAMBU)
  const ronX = 376;
  drawTiangSirineEws(ctx, ronX, 356, state.volcanoSim?.sirenActive ?? false, animTick);

  // Efek Sorot Cahaya & Bouncing Badge saat QTE / Misi Bunyikan Sirine EWS Aktif
  if (state.volcanoSim?.phase === 'fase4_awas_siren' || state.volcanoSim?.phase === 'qte_run_kentongan') {
    const pulseR = 22 + Math.sin(animTick * 0.25) * 6;
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(ronX, 308, pulseR, 0, Math.PI * 2);
    ctx.stroke();

    const bounce = Math.sin(animTick * 0.22) * 4;
    const badgeW = 186;
    const badgeH = 40;
    const badgeY = 214 + bounce;

    ctx.save();
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 18;

    // Background pill merah menyala
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.roundRect(ronX - badgeW / 2, badgeY, badgeW, badgeH, 8);
    ctx.fill();

    // Border emas tebal berdenyut
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 2.8;
    ctx.stroke();
    ctx.shadowColor = 'transparent';

    // Sudut aksen pixel retro
    ctx.fillStyle = '#fde047';
    ctx.fillRect(ronX - badgeW / 2 + 3, badgeY + 3, 6, 2);
    ctx.fillRect(ronX - badgeW / 2 + 3, badgeY + 3, 2, 6);
    ctx.fillRect(ronX + badgeW / 2 - 9, badgeY + 3, 6, 2);
    ctx.fillRect(ronX + badgeW / 2 - 5, badgeY + 3, 2, 6);

    // Panah bawah menunjuk tiang EWS
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.moveTo(ronX - 8, badgeY + badgeH);
    ctx.lineTo(ronX + 8, badgeY + badgeH);
    ctx.lineTo(ronX, badgeY + badgeH + 8);
    ctx.closePath();
    ctx.fill();

    // Teks Utama: [!] BUNYIKAN SIRINE EWS
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 13px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('[!] BUNYIKAN SIRINE', ronX, badgeY + 18);

    // Sub-panduan aksi
    ctx.fillStyle = '#fef08a';
    ctx.font = '800 10px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('TEKAN [E] / TAP DI SINI', ronX, badgeY + 32);

    ctx.restore();
  }

  // 3. RUMAH WARGA LERENG di x: 860 (ROBOH TOTAL AKIBAT BEBAN ENDAPAN ABU VULKANIK TEBAL)
  const houseX = 860;
  if (houseX + 160 > camX && houseX - 40 < camX + viewW) {
    if (isPostEruption) {
      // ── RUMAH ROBOH AMBRUK PASCA ERUPSI ──
      // Dinding Retak Parah
      ctx.fillStyle = '#71717a';
      ctx.fillRect(houseX, 284, 100, 60);

      ctx.strokeStyle = '#18181b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(houseX + 15, 286);
      ctx.lineTo(houseX + 28, 310);
      ctx.lineTo(houseX + 20, 335);
      ctx.moveTo(houseX + 75, 290);
      ctx.lineTo(houseX + 85, 318);
      ctx.lineTo(houseX + 80, 344);
      ctx.stroke();

      // Atap Roboh Total Amblas ke Bawah (Inverted V Shape / Caved-in)
      ctx.fillStyle = '#450a0a';
      ctx.beginPath();
      ctx.moveTo(houseX - 12, 276);
      ctx.lineTo(houseX + 50, 302); // Amblas runtuh ke dalam rumah!
      ctx.lineTo(houseX + 112, 278);
      ctx.lineTo(houseX + 104, 286);
      ctx.lineTo(houseX + 50, 310);
      ctx.lineTo(houseX - 4, 284);
      ctx.closePath();
      ctx.fill();

      // Balok Kayu Patah Mencuat Keluar
      ctx.fillStyle = '#292524';
      ctx.fillRect(houseX + 10, 274, 28, 5);
      ctx.fillRect(houseX + 58, 278, 32, 5);
      ctx.fillRect(houseX + 46, 268, 6, 18);

      // Puing-Puing Genteng Pecah Berserakan di Tanah
      ctx.fillStyle = '#7f1d1d';
      ctx.fillRect(houseX - 8, 346, 12, 6);
      ctx.fillRect(houseX + 18, 348, 14, 5);
      ctx.fillRect(houseX + 44, 347, 18, 6);
      ctx.fillRect(houseX + 82, 345, 16, 7);
      ctx.fillRect(houseX + 106, 349, 10, 4);

      // Endapan Timbunan Abu Vulkanik Tebal (>1.500 kg/m3) di Sekitar Reruntuhan
      ctx.fillStyle = '#52525b';
      ctx.beginPath();
      ctx.arc(houseX - 6, 354, 14, Math.PI, 0);
      ctx.arc(houseX + 50, 355, 22, Math.PI, 0);
      ctx.arc(houseX + 106, 354, 16, Math.PI, 0);
      ctx.fill();

      // Jendela Pecah Berlubang
      ctx.fillStyle = '#09090b';
      ctx.fillRect(houseX + 12, 298, 18, 16);
      ctx.fillRect(houseX + 70, 298, 18, 16);
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(houseX + 40, 304, 22, 40);

    } else {
      // ── RUMAH WARGA NORMAL SEBELUM ERUPSI ──
      ctx.fillStyle = '#d97706';
      ctx.fillRect(houseX, 272, 100, 72);
      ctx.fillStyle = '#991b1b';
      ctx.beginPath();
      ctx.moveTo(houseX - 12, 272);
      ctx.lineTo(houseX + 50, 234);
      ctx.lineTo(houseX + 112, 272);
      ctx.closePath();
      ctx.fill();

      // Pintu & Jendela
      ctx.fillStyle = '#451a03';
      ctx.fillRect(houseX + 40, 294, 22, 50);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(houseX + 12, 290, 18, 20);
      ctx.fillRect(houseX + 70, 290, 18, 20);
    }
  }

  ctx.restore();
}

// I. TRUK EVAKUASI BPBD RESCUE
export function drawEvacuationRescueTruck(
  ctx: CanvasRenderingContext2D,
  truckX: number,
  truckY: number,
  truckState: 'parked' | 'boarding' | 'driving',
  animTick: number
): void {
  ctx.save();
  ctx.translate(truckX, truckY);

  const isDriving = truckState === 'driving';
  const isBoarding = truckState === 'boarding';
  const isBoarded = isBoarding || isDriving;

  // Suspensi getar saat berjalan
  const bounceY = isDriving ? Math.sin(animTick * 0.45) * 1.5 : 0;

  // 1. Bayangan Truk di Aspal Jalan
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.ellipse(0, 4, 76, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.translate(0, bounceY);

  // 2. Ruang Interior Bak Belakang (Dinding dalam warna gelap sebelum penumpang digambar)
  ctx.fillStyle = '#7c2d12'; // Oranye gelap / kayu interior bak
  ctx.fillRect(-66, -50, 90, 36);
  ctx.fillStyle = '#431407';
  ctx.fillRect(-66, -50, 90, 6);

  // 3. Penumpang di Dalam Bak Belakang & Kabin Depan (Warga, Siswa/Pemain, Petugas)
  if (isBoarded) {
    const hopY = isBoarding ? Math.sin(Math.min(1, (animTick % 20) / 10) * Math.PI) * 2 : 0;

    // --- Penumpang 1: Mbah Tejo (Lansia) di x: -52 ---
    const mbahX = -52;
    const mbahY = -30 - hopY;
    // Peci hitam
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(mbahX - 5, mbahY - 18, 10, 4);
    // Wajah & rambut putih uban
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(mbahX - 6, mbahY - 14, 12, 5);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(mbahX - 5, mbahY - 13, 10, 7);
    // Mata & senyum lega
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(mbahX - 3, mbahY - 10, 2, 2);
    ctx.fillRect(mbahX + 1, mbahY - 10, 2, 2);
    // Baju putih
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(mbahX - 6, mbahY - 6, 12, 10);

    // --- Penumpang 2: Bu Siti (Warga Rentan) di x: -34 ---
    const sitiX = -34;
    const sitiY = -30 - hopY;
    // Hijab / Kerudung oranye cerah
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(sitiX - 6, sitiY - 17, 12, 12);
    // Wajah
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(sitiX - 4, sitiY - 13, 8, 6);
    // Mata tersenyum
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(sitiX - 3, sitiY - 11, 2, 1.5);
    ctx.fillRect(sitiX + 1, sitiY - 11, 2, 1.5);
    // Baju hijau toska
    ctx.fillStyle = '#0d9488';
    ctx.fillRect(sitiX - 6, sitiY - 5, 12, 10);

    // --- Penumpang 3: Dani (Anak Dusun) di x: -16 ---
    const daniX = -16;
    const daniY = -28 - hopY;
    // Rambut hitam jabrik
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(daniX - 5, daniY - 17, 10, 5);
    // Wajah
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(daniX - 4, daniY - 13, 8, 6);
    // Mata bulat
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(daniX - 3, daniY - 11, 2, 2);
    ctx.fillRect(daniX + 1, daniY - 11, 2, 2);
    // Baju merah
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(daniX - 5, daniY - 7, 10, 10);
    // Tangan Dani melambai gembira
    const daniWave = Math.sin(animTick * 0.35) * 4;
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(daniX - 9, daniY - 10 + daniWave, 4, 6);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(daniX - 10, daniY - 14 + daniWave, 4, 4);

    // --- Penumpang 4: Siswa Penyelamat (Karakter Pemain) di x: 2 ---
    const pX = 2;
    const pY = -30 - hopY;
    // Rambut pemain
    ctx.fillStyle = '#451a03';
    ctx.fillRect(pX - 5, pY - 18, 10, 5);
    // Wajah
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(pX - 4, pY - 13, 8, 7);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(pX - 3, pY - 10, 2, 2);
    ctx.fillRect(pX + 1, pY - 10, 2, 2);
    // Seragam / Rompi rescue oranye
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(pX - 6, pY - 6, 12, 10);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(pX - 2, pY - 6, 4, 10);
    // Tangan pemain melambai lega
    const pWave = Math.cos(animTick * 0.3) * 3;
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(pX + 6, pY - 9 + pWave, 4, 5);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(pX + 7, pY - 13 + pWave, 4, 4);

    // --- Penumpang 5: Mbak Rina / Pak Joko (Relawan Pendamping) di x: 17 ---
    const rinaX = 17;
    const rinaY = -29 - hopY;
    // Rambut kuncir / topi relawan
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(rinaX - 5, rinaY - 17, 10, 5);
    // Wajah
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(rinaX - 4, rinaY - 12, 8, 6);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(rinaX - 3, rinaY - 10, 2, 2);
    ctx.fillRect(rinaX + 1, rinaY - 10, 2, 2);
    // Rompi relawan kuning/merah
    ctx.fillStyle = '#eab308';
    ctx.fillRect(rinaX - 5, rinaY - 6, 10, 10);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(rinaX - 3, rinaY - 6, 6, 10);
  }

  // 4. Badan Truk BPBD Oranye Tangguh (Dinding Samping Bak Belakang & Kabin Depan)
  // Dinding samping bak belakang menutupi tubuh bagian bawah penumpang (y: -26 ke -12)
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(-66, -26, 92, 18);
  ctx.fillStyle = '#c2410c';
  ctx.fillRect(-66, -26, 92, 3); // Lis tepi atas bak

  // Garis Reflektor Kuning-Hitam Hazard Chevron di Lambung Bak Truk BPBD
  const stripeY = -21;
  ctx.fillStyle = '#fde047';
  ctx.fillRect(-64, stripeY, 88, 5);
  ctx.fillStyle = '#18181b';
  for (let sx = -60; sx < 20; sx += 12) {
    ctx.beginPath();
    ctx.moveTo(sx, stripeY);
    ctx.lineTo(sx + 5, stripeY);
    ctx.lineTo(sx + 2, stripeY + 5);
    ctx.lineTo(sx - 3, stripeY + 5);
    ctx.closePath();
    ctx.fill();
  }

  // Tulisan Resmi BPBD RESCUE di Bak
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 8.5px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('BPBD RESCUE', -20, -10);

  // 5. Kabin Depan Truk (Kanan, x: 26 to 68)
  ctx.fillStyle = '#c2410c';
  ctx.fillRect(26, -60, 42, 52);
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(28, -58, 38, 48);

  // Kaca Depan Kabin & Supir di Balik Kaca
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(44, -56, 20, 22);

  // Supir: Komandan Satria / Pak Joko di dalam kabin kemudi
  const driverX = 52;
  const driverY = -42;
  // Topi dinas SAR/Polisi biru
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(driverX - 4, driverY - 10, 8, 4);
  ctx.fillStyle = '#fed7aa';
  ctx.fillRect(driverX - 3, driverY - 6, 6, 6);
  ctx.fillStyle = '#1e40af';
  ctx.fillRect(driverX - 5, driverY, 10, 6);
  // Setir mobil
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(driverX + 6, driverY - 2, 4, 0, Math.PI * 2);
  ctx.stroke();

  // Lapisan Kaca Kaca Depan (Glass glare)
  ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
  ctx.fillRect(44, -56, 20, 22);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(46, -36);
  ctx.lineTo(62, -54);
  ctx.stroke();

  // Tulisan "BPBD" di Pintu Kabin Depan
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 9.5px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('BPBD', 42, -24);

  // 6. Tenda / Terpal Penutup Kanopi Bak Belakang (Atap Kanopi)
  ctx.fillStyle = '#475569';
  ctx.fillRect(-68, -68, 94, 18);
  ctx.fillStyle = '#334155';
  ctx.fillRect(-68, -52, 94, 4);
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(-68, -68, 94, 3); // Lis atas oranye kanopi

  // Tiang Penyangga Besi Kanopi
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(-66, -52, 3, 26);
  ctx.fillRect(-22, -52, 3, 26);
  ctx.fillRect(22, -52, 3, 26);

  // 7. Lampu Rotator Sirine Darurat di Atas Kabin
  const isRedFlash = Math.floor(animTick / 7) % 2 === 0;
  ctx.fillStyle = isRedFlash ? '#ef4444' : '#3b82f6';
  ctx.fillRect(40, -68, 14, 8);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(44, -66, 6, 4);

  // Sorot Cahaya Rotator
  ctx.fillStyle = isRedFlash ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)';
  ctx.beginPath();
  ctx.arc(47, -64, 24, 0, Math.PI * 2);
  ctx.fill();

  // Lampu Depan Menyala (Headlights)
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(66, -26, 3, 8);
  if (isDriving) {
    // Sorot lampu ke depan
    const beamGrad = ctx.createLinearGradient(69, -22, 130, -22);
    beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
    beamGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(69, -26);
    ctx.lineTo(130, -40);
    ctx.lineTo(130, -4);
    ctx.lineTo(69, -18);
    ctx.closePath();
    ctx.fill();
  }

  // 8. Roda Truk Besar dengan Velg Berputar
  const drawWheel = (wx: number) => {
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(wx, -6, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.arc(wx, -6, 5, 0, Math.PI * 2);
    ctx.fill();

    // Ruji velg berputar saat melaju
    if (isDriving) {
      const rotAngle = (animTick * 0.35) % (Math.PI * 2);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(wx + Math.cos(rotAngle) * 5, -6 + Math.sin(rotAngle) * 5);
      ctx.lineTo(wx - Math.cos(rotAngle) * 5, -6 - Math.sin(rotAngle) * 5);
      ctx.moveTo(wx + Math.sin(rotAngle) * 5, -6 - Math.cos(rotAngle) * 5);
      ctx.lineTo(wx - Math.sin(rotAngle) * 5, -6 + Math.cos(rotAngle) * 5);
      ctx.stroke();
    }
  };

  drawWheel(-44);
  drawWheel(-14);
  drawWheel(46);

  // 9. Asap Knalpot saat Melaju Kencang
  if (isDriving) {
    for (let p = 0; p < 5; p++) {
      const puffX = -72 - p * 14 - ((animTick * 2.8 + p * 10) % 40);
      const puffY = -10 - Math.sin(animTick * 0.2 + p) * 6;
      ctx.fillStyle = 'rgba(148, 163, 184, 0.65)';
      ctx.beginPath();
      ctx.arc(puffX, puffY, 4 + p * 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore(); // Restore bounce translation

  // 10. Label Status Mengambang di Atas Truk
  const bannerY = -92 + Math.sin(animTick * 0.1) * 2;
  const bannerText = isDriving
    ? '▲ MENUJU TEA (TEMPAT EVAKUASI AKHIR) ▲'
    : isBoarding
      ? '▲ SELURUH WARGA TELAH NAIK KE MOBIL! ▲'
      : 'MOBIL EVAKUASI BPBD';

  ctx.save();
  ctx.font = '900 11px "Plus Jakarta Sans", system-ui, sans-serif';
  const textW = ctx.measureText(bannerText).width;
  const padW = 24;
  const bW = Math.max(textW + padW, 140);
  const bH = 26;

  ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
  ctx.shadowBlur = 10;
  ctx.fillStyle = isDriving ? 'rgba(20, 83, 45, 0.95)' : isBoarding ? 'rgba(124, 45, 18, 0.95)' : 'rgba(15, 23, 42, 0.92)';
  ctx.beginPath();
  ctx.roundRect(-bW / 2, bannerY - bH / 2, bW, bH, 6);
  ctx.fill();
  ctx.shadowColor = 'transparent';

  ctx.strokeStyle = isDriving ? '#4ade80' : isBoarding ? '#fde047' : '#f97316';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(bannerText, 0, bannerY);
  ctx.restore();

  ctx.restore(); // Restore truckX, truckY
}
