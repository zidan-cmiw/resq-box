/**
 * Geometri Lempeng dan Mode Konvergen — bagian dari mesin gambar Earth Dive.
 *
 * Berkas ini dipecah dari sprites.ts (5.625 baris) agar tiap kelompok dapat
 * dicari tanpa menggulir melewati ribuan baris kode kelompok lain. Isi
 * fungsinya dipindahkan UTUH, tidak ditulis ulang.
 */

import { TILE } from './konstanta';
import type { ZoneConfig } from '../zones';
import { getConvergentTerrainElevation, getSubductingPlateTopY, getConvergentMantleY } from '../zones';
import { drawPineTree } from './tumbuhan';

// Elevasi permukaan atas lempeng samudra yang menunjam ke bawah lempeng benua (Slab Subduksi Mulus Kontinu & Rigid)
export function getOceanicSubductingSlabTopY(x: number, p: number): number {
  const normP = Math.max(0, Math.min(1, p));
  const flexStart = 190 + Math.round(normP * 25);
  const trenchX = 370 + Math.round(normP * 12);
  const seafloorY = 350;
  // Palung laut adalah struktur jurang geologis dalam yang stabil (kedalaman 485 .. 510) tanpa deformasi melar kendur
  const trenchDepth = Math.round(485 + normP * 25);
  const targetSlope = 0.70; // Kemiringan sudut penunjaman ~35°

  if (x <= flexStart) {
    return seafloorY;
  }

  // Zona 1: Lengkungan mulus Hermite C1 dari lantai laut ke sumbu palung (trenchX)
  if (x <= trenchX) {
    const L = trenchX - flexStart;
    const u = (x - flexStart) / L;
    const h00 = 2 * u * u * u - 3 * u * u + 1;
    const h01 = -2 * u * u * u + 3 * u * u;
    const h11 = u * u * u - u * u;
    return Math.round(h00 * seafloorY + h01 * trenchDepth + h11 * (targetSlope * L));
  }

  // Zona 2: Penunjaman menembus di bawah lempeng benua (x > trenchX)
  // Menyatu 100% mulus (C1 kontinu) dari trenchX dengan turunan awal sama persis = targetSlope
  const rx = x - trenchX;
  return Math.round(trenchDepth + rx * targetSlope + (rx * rx * 0.00035));
}

// Kemiringan sudut (slope dy/dx) permukaan lempeng samudra untuk perhitungan vektor normal tegak lurus bidang slab

// Kemiringan sudut (slope dy/dx) permukaan lempeng samudra untuk perhitungan vektor normal tegak lurus bidang slab
export function getOceanicSlabSlope(x: number, p: number): number {
  const normP = Math.max(0, Math.min(1, p));
  const flexStart = 190 + Math.round(normP * 25);
  const trenchX = 370 + Math.round(normP * 12);
  const seafloorY = 350;
  const trenchDepth = Math.round(485 + normP * 25);
  const targetSlope = 0.70;

  if (x <= flexStart) {
    return 0;
  }
  if (x <= trenchX) {
    const L = trenchX - flexStart;
    const u = (x - flexStart) / L;
    const dh00 = 6 * u * u - 6 * u;
    const dh01 = -6 * u * u + 6 * u;
    const dh11 = 3 * u * u - 2 * u;
    const dy_du = dh00 * seafloorY + dh01 * trenchDepth + dh11 * (targetSlope * L);
    return dy_du / L;
  }
  const rx = x - trenchX;
  return targetSlope + 2 * rx * 0.00035;
}

// Profil dasar laut dari lantai samudra barat, palung laut, hingga bibir pantai

// Profil dasar laut dari lantai samudra barat, palung laut, hingga bibir pantai
export function getConvergentSeafloorProfile(x: number, p: number): number {
  const normP = Math.max(0, Math.min(1, p));
  const trenchX = 370 + Math.round(normP * 12);
  const trenchDepth = Math.round(485 + normP * 25);
  const coastX = 580;
  const seaLevelY = 300;

  // Di sebelah barat sumbu palung: dasar laut adalah permukaan atas lempeng samudra
  if (x <= trenchX) {
    return getOceanicSubductingSlabTopY(x, normP);
  }

  // Antara sumbu palung (trenchX) dan garis pantai (coastX):
  // Lereng benua (continental slope / accretionary wedge) kokoh dan stabil,
  // dengan sedikit kompresi pemadatan tektonik saat ditumbuk lempeng samudra (tanpa meleyot kendur)
  if (x <= coastX) {
    const u = (x - trenchX) / (coastX - trenchX);
    const s = u * u * (3 - 2 * u); // Smoothstep C1
    const yBase = trenchDepth * (1 - s) + seaLevelY * s;
    const wedgeCompress = Math.sin(u * Math.PI) * (normP * 10);
    return Math.round(yBase - wedgeCompress);
  }

  // Di daratan pantai lempeng benua (x > coastX)
  return getConvergentTerrainElevation(x, normP, 'ocean');
}

// ══════════════════════════════════════════════════════════════════════════
// RENDERING MEDAN DINAMIS AREA 7 (BATAS KONVERGEN):
// DUA LEMPENG BERTABRAKAN SECARA REALISTIS:
// 1. LEMPENG SAMUDRA NYATA BERGESER HORIZONTAL & MENUNJAM CURAM KE MANTEL (SUBDUKSI)
// 2. PALUNG LAUT MENDALAM TEMBUS KE BAWAH LAYAR (DASAR JURANG TERSEMBUNYI)
// 3. PELEBURAN PARSIAL & MAGMA MEMBARA NAIK KE ATAS (ORGANIK TANPA GARIS-GARIS WIRE)
// 4. PARTIKEL KONVEKSI CAIRAN MAGMA REALISTIS & ASAP VULKANIK BERGULUNG BEBAS BULET
// 5. KERAK BENUA MENGALAMI KOMPRESI & TERANGKAT MEMBENTUK GUNUNG VULKANIK
// ══════════════════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════════════════
// HELPER: TEKTONIK ARROW
// ══════════════════════════════════════════════════════════════════════════

export function drawPlateVectorArrow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angleRad: number,
  length: number,
  label: string,
  color: string,
  frame: number,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angleRad);

  const pulse = Math.sin(frame * 0.1) * 0.2 + 0.8;
  const shaftW = length;
  const shaftH = 7;
  const headSize = 13;

  // Glow halo
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.35 * pulse;
  ctx.fillRect(-2, -shaftH / 2 - 2, shaftW + 4, shaftH + 4);
  ctx.beginPath();
  ctx.moveTo(shaftW, -headSize - 2);
  ctx.lineTo(shaftW + headSize + 4, 0);
  ctx.lineTo(shaftW, headSize + 2);
  ctx.closePath();
  ctx.fill();

  // Solid Shaft
  ctx.globalAlpha = 0.95;
  ctx.fillStyle = color;
  ctx.fillRect(0, -shaftH / 2, shaftW, shaftH);

  // White core shaft
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(2, -shaftH / 2 + 2, shaftW - 2, shaftH - 4);

  // Solid Arrow Head
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(shaftW, -headSize);
  ctx.lineTo(shaftW + headSize, 0);
  ctx.lineTo(shaftW, headSize);
  ctx.closePath();
  ctx.fill();

  // White core Head
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(shaftW + 2, -headSize + 4);
  ctx.lineTo(shaftW + headSize - 3, 0);
  ctx.lineTo(shaftW + 2, headSize - 4);
  ctx.closePath();
  ctx.fill();

  // Animated moving indicator along shaft
  const chevronPos = ((frame * 0.8) % Math.max(1, shaftW - 4));
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(chevronPos, -shaftH / 2 + 1, 3, shaftH - 2);

  ctx.restore();

  // Label badge (drawn unrotated for clean readability)
  if (label) {
    ctx.save();
    ctx.font = 'bold 8.5px "Pixelify Sans", sans-serif';
    const textW = ctx.measureText(label).width;
    const badgeW = textW + 12;
    const badgeH = 16;
    const badgeX = Math.round(x - badgeW / 2);
    const badgeY = Math.round(y - 24);

    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(badgeX, badgeY, badgeW, badgeH);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.2;
    ctx.strokeRect(badgeX, badgeY, badgeW, badgeH);

    ctx.fillStyle = '#ffffff';
    ctx.fillText(label, badgeX + 6, badgeY + 11.5);
    ctx.restore();
  }
}

// ══════════════════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════════════════
// KONDISI 1: KONVERGEN DARATAN (TABRAKAN DUA LEMPENG BENUA & PEMBENTUKAN GUNUNG)
// Sesuai Konsep Video Referensi:
// - Dua lempeng benua:
//   1. Lempeng benua kiri ("kepadatan lebih rendah"): bentuk awal sudah menunjam miring ke kanan bawah (↘),
//      tanpa Gunung Anak Krakatau. Saat animasi, bergerak ke kanan menunjam ke bawah (↘).
//   2. Lempeng benua kanan ("kepadatan lebih tinggi"): bergerak ke kiri (←).
// - Di bawah lempeng: ada lapisan tanah/batuan padat litosfer dulu ("tanahnya dulu"),
//   baru di bawahnya lapisan mantel astenosfer yang berisi magma dengan arus konveksi.
// - Kedua lempeng saling bertabrakan (kompresi horizontal) melipat kerak membentuk gunung megah.
// - Saat gunung terbentuk, di dalam perut gunung terisi dapur magma (magma chamber) & pipa magma
//   yang naik dari zona peleburan mantel, namun magma TETAP TERKUNCI di dalam (tidak meletus keluar).
// ══════════════════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════════════════
// KONDISI 1: KONVERGEN DARATAN (TABRAKAN DUA LEMPENG BENUA & PEMBENTUKAN GUNUNG)
// Sesuai Konsep Video Referensi & Arahan Pengguna:
// - Dua lempeng benua:
//   1. Lempeng benua kiri: menunjam miring ke kanan-bawah (↘) dengan garis batas alami
//      (bebas dari garis hitam buatan), meluncur masuk ke dalam mantel.
//   2. Lempeng benua kanan: bergerak ke kiri (←).
// - Lapisan Mantel Astenosfer Magma: dibuat persis seperti di Area Divergen
//   (gradien magma pijar membara, arus konveksi sinusoidal, gelembung pijar, garis kontak Moho).
// - Di antara lempeng dan mantel terdapat lapisan tanah/batuan padat litosfer ("tanahnya dulu").
// - Tabrakan melipat kerak membentuk gunung megah yang natural dan rapi (tanpa tulisan berantakan).
// - Dapur magma terisi di dalam perut gunung dan diberi saluran pipa dari mantel,
//   namun magma TETAP TERKUNCI di dalam gunung dengan atap batuan padat kokoh (tidak meletus keluar).
// ══════════════════════════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════════════════
// KONDISI 1: KONVERGEN DARATAN (TABRAKAN DUA LEMPENG BENUA & PEMBENTUKAN GUNUNG)
// Sesuai Konsep Video Referensi:
// - Dua lempeng benua:
//   1. Lempeng benua kiri ("kepadatan lebih rendah"): bentuk awal sudah menunjam miring ke kanan bawah (↘),
//      tanpa Gunung Anak Krakatau. Saat animasi, bergerak ke kanan menunjam ke bawah (↘).
//   2. Lempeng benua kanan ("kepadatan lebih tinggi"): bergerak ke kiri (←).
// - Di bawah lempeng: ada lapisan tanah/batuan padat litosfer dulu ("tanahnya dulu"),
//   baru di bawahnya lapisan mantel astenosfer yang berisi magma dengan arus konveksi.
// - Kedua lempeng saling bertabrakan (kompresi horizontal) melipat kerak membentuk gunung megah.
// - Saat gunung terbentuk, di dalam perut gunung terisi dapur magma (magma chamber) & pipa magma
//   yang naik dari zona peleburan mantel, namun magma TETAP TERKUNCI di dalam (tidak meletus keluar).
// ══════════════════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════════════════
// KONDISI 1: KONVERGEN DARATAN (TABRAKAN DUA LEMPENG BENUA & PEMBENTUKAN GUNUNG)
// Sesuai Konsep Video Referensi & Arahan Pengguna:
// - Dua lempeng benua:
//   1. Lempeng benua kiri: menunjam miring ke kanan-bawah (↘) dengan garis batas alami
//      (bebas dari garis hitam buatan), meluncur masuk ke dalam mantel.
//   2. Lempeng benua kanan: bergerak ke kiri (←).
// - Lapisan Mantel Astenosfer Magma: dibuat persis seperti di Area Divergen
//   (gradien magma pijar membara, arus konveksi sinusoidal, gelembung pijar, garis kontak Moho).
// - Di antara lempeng dan mantel terdapat lapisan tanah/batuan padat litosfer ("tanahnya dulu").
// - Tabrakan melipat kerak membentuk gunung megah yang natural dan rapi (tanpa tulisan berantakan).
// - Dapur magma terisi di dalam perut gunung dan diberi saluran pipa dari mantel,
//   namun magma TETAP TERKUNCI di dalam gunung dengan atap batuan padat kokoh (tidak meletus keluar).
// ══════════════════════════════════════════════════════════════════════════
export function renderConvergentLandMode(
  ctx: CanvasRenderingContext2D,
  zone: ZoneConfig,
  frame: number,
  collisionProgress: number = 1.0,
): void {
  const w = zone.cols * TILE;
  const h = Math.max(zone.rows * TILE, 480);
  const p = Math.max(0, Math.min(1, collisionProgress));
  ctx.imageSmoothingEnabled = false;

  const leftShiftX = Math.round(p * 80);
  const contactX = 380 + leftShiftX;
  const curveStartX = 200 + leftShiftX;
  const baseY = 310;
  const plateThick = 95;
  const mountainPeakX = contactX + 200;
  const mountainEndX = contactX + 460;
  const mountainLift = p * 155;

  // Geometri Dapur Magma di dalam Gunung yang Terbentuk saat Konvergen Tabrakan Benua
  const chamberApexX = mountainPeakX;

  // ══════════════════════════════════════════════════════════════════════
  // LAYER 1: LAPISAN MANTEL BUMI & MAGMA TERPADU (UNIFIED ASTHENOSPHERE & MAGMA DOME)
  // PERSIS SEPERTI KONSEP BATAS DIVERGEN:
  // 1. Mantel dan magma yang naik ke perut gunung adalah SATU LAPISAN TUNGGAL
  // 2. Magma di dalam gunung BUKAN objek/layer terpisah, melainkan lapisan mantel
  //    itu sendiri yang membumbung naik ke dalam gunung saat kedua lempeng bertabrakan!
  // 3. Tekstur, warna gradien, arus konveksi, dan gelembung pijar 100% SAMA PERSIS dan MENYATU
  // 4. Bebas garis pembatas/sekat seolah satu fluida magma cair murni
  // ══════════════════════════════════════════════════════════════════════
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(-800, h);
  ctx.lineTo(-800, getConvergentMantleY(-800, p, 'land'));
  for (let mx = -800; mx <= w + 400; mx += 3) {
    ctx.lineTo(mx, getConvergentMantleY(mx, p, 'land'));
  }
  ctx.lineTo(w + 400, h);
  ctx.closePath();

  // Gradien Magma Murni Membara — SAMA PERSIS untuk seluruh lapisan mantel & magma gunung
  const topMantleY = getConvergentMantleY(chamberApexX, p, 'land');
  const moltenGrad = ctx.createLinearGradient(0, Math.min(412, topMantleY), 0, 500);
  moltenGrad.addColorStop(0.00, '#ffffff');    // Pucuk terpanas putih menyala di puncak magma
  moltenGrad.addColorStop(0.04, '#fef08a');   // Kuning menyala terang tipis di bibir atas
  moltenGrad.addColorStop(0.10, '#fde047');   // Inti konveksi magma emas keemasan
  moltenGrad.addColorStop(0.24, '#f97316');   // Magma oranye membara (WARNA UTAMA MANTEL)
  moltenGrad.addColorStop(0.65, '#f97316');   // Tubuh kubah magma sepenuhnya oranye mantel
  moltenGrad.addColorStop(0.85, '#ea580c');   // Vermilion sirkulasi mantel
  moltenGrad.addColorStop(0.95, '#dc2626');   // Merah magma dalam
  moltenGrad.addColorStop(1.00, '#991b1b');   // Mantel pekat abisal
  ctx.fillStyle = moltenGrad;
  ctx.fill();

  // Clip agar seluruh arus konveksi & gelembung tidak pernah overshooting/kelewatan ke atas
  ctx.clip();

  // Arus konveksi yang mengalir melintasi seluruh mantel dan membumbung ke gunung
  ctx.fillStyle = 'rgba(254, 240, 138, 0.38)';
  for (let mx = -800; mx <= w + 400; mx += 14) {
    const my = getConvergentMantleY(mx, p, 'land');
    const wave1 = Math.sin(frame * 0.03 + mx * 0.02) * 3.5;
    ctx.fillRect(mx, my + 14 + wave1, 14, 4);
  }
  ctx.fillStyle = 'rgba(249, 115, 22, 0.42)';
  for (let mx = -800; mx <= w + 400; mx += 18) {
    const my = getConvergentMantleY(mx, p, 'land');
    const wave2 = Math.cos(frame * 0.04 + mx * 0.025) * 3.5;
    ctx.fillRect(mx, my + 24 + wave2, 18, 4);
  }

  // Gelembung Pijar Magma Terapung di Seluruh Lapisan Mantel & Rongga Magma Gunung
  for (let i = 0; i < 28; i++) {
    const bx = (((i * 137 + frame * 0.35) % (w + 1200)) - 800);
    const my = getConvergentMantleY(bx, p, 'land');
    const by = my + 8 + ((i * 27) % 50) + Math.sin(frame * 0.05 + i) * 3;
    ctx.fillStyle = 'rgba(254, 240, 138, 0.75)';
    ctx.beginPath();
    ctx.arc(bx, by, 2.5 + (i % 2), 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(bx - 1, by - 1, 2, 2);
  }

  // Garis Kontak Moho Berpendar Hangat (persis Batas Divergen)
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.55)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let mx = -800; mx <= w + 400; mx += 6) {
    const my = getConvergentMantleY(mx, p, 'land');
    if (mx === -800) ctx.moveTo(mx, my);
    else ctx.lineTo(mx, my);
  }
  ctx.stroke();

  ctx.restore();

  // ══════════════════════════════════════════════════════════════════════
  // LAYER 2: LAPISAN TANAH & BATUAN PADAT LITOSFER BAWAH (SOLID KONTINU)
  // Menghubungkan dasar lempeng ke atas mantel bumi secara kontinu tanpa celah bocor.
  // Di area dapur magma yang membumbung di dalam gunung, ketebalan otomatis 0
  // (sehingga magma mantel Layer 1 memancar utuh di dalam perut gunung).
  // ══════════════════════════════════════════════════════════════════════
  ctx.save();
  const getPlateBottomY = (px: number) => {
    return px <= contactX ? (getSubductingPlateTopY(px, p) + plateThick) : (baseY + plateThick);
  };

  ctx.beginPath();
  // Jalur atas: dari -800 ke w + 400 mengikuti dasar lempeng tektonik
  ctx.moveTo(-800, getPlateBottomY(-800));
  for (let x = -800; x <= w + 400; x += 6) {
    ctx.lineTo(x, getPlateBottomY(x));
  }
  // Jalur bawah: dari w + 400 kembali ke -800 mengikuti permukaan mantel
  // Menggunakan Math.max(getPlateBottomY(x), getConvergentMantleY(x, p, 'land'))
  // sehingga di area magma naik ke perut gunung, ketebalan litosfer menjadi 0 secara mulus tanpa celah kosong.
  for (let x = w + 400; x >= -800; x -= 6) {
    const pBottom = getPlateBottomY(x);
    const mTop = getConvergentMantleY(x, p, 'land');
    ctx.lineTo(x, Math.max(pBottom, mTop));
  }
  ctx.closePath();

  const subGroundGrad = ctx.createLinearGradient(0, baseY + plateThick, 0, 424);
  subGroundGrad.addColorStop(0, '#382b21');  // Batuan kerak benua padat
  subGroundGrad.addColorStop(0.5, '#281e16'); // Litosfer padat berkompresi tinggi
  subGroundGrad.addColorStop(1, '#1b130e');  // Dasar kontak termal mantel
  ctx.fillStyle = subGroundGrad;
  ctx.fill();

  // Clip agar tekstur strata batuan hanya berada di dalam litosfer padat
  ctx.clip();

  // Tekstur strata batuan horizontal lembut (hanya di zona litosfer, aman di atas mantel)
  for (let gy = baseY + plateThick + 3; gy < 424; gy += 7) {
    const isEven = Math.floor(gy / 7) % 2 === 0;
    ctx.strokeStyle = isEven ? 'rgba(78, 62, 50, 0.35)' : 'rgba(38, 28, 21, 0.40)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-800, gy);
    for (let x = -800; x <= w + 400; x += 24) {
      const wave = Math.sin(x * 0.035 + gy * 0.08) * 2.0;
      ctx.lineTo(x, gy + wave);
    }
    ctx.stroke();
  }
  ctx.restore();

  // ══════════════════════════════════════════════════════════════════════
  // LAYER 3: LEMPENG BENUA KANAN & PEMBENTUKAN GUNUNG (Z-INDEX LEBIH RENDAH)
  // - Batuan gunung terangkat dan membentuk atap di atas magma mantel yang membumbung
  // - Di bawah atap gunung, rongga terbuka langsung memperlihatkan magma mantel Layer 1
  // ══════════════════════════════════════════════════════════════════════
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(contactX, getSubductingPlateTopY(contactX, p));
  for (let x = contactX; x <= w + 400; x += 4) {
    ctx.lineTo(x, getConvergentTerrainElevation(x, p, 'land'));
  }
  ctx.lineTo(w + 400, baseY + plateThick);
  for (let x = w + 400; x >= contactX; x -= 4) {
    const bottomY = Math.min(baseY + plateThick, getConvergentMantleY(x, p, 'land') + 2);
    ctx.lineTo(x, bottomY);
  }
  ctx.closePath();

  // Gradien kerak benua yang SAMA PERSIS dengan lempeng kiri (tebal 95px)
  const rightPlateGrad = ctx.createLinearGradient(0, baseY - mountainLift, 0, baseY + plateThick);
  rightPlateGrad.addColorStop(0, '#4a3f35');   // Sedimen atas
  rightPlateGrad.addColorStop(0.35, '#3a3028'); // Granit menengah
  rightPlateGrad.addColorStop(0.70, '#29211a'); // Granit dalam
  rightPlateGrad.addColorStop(1, '#1c1510');    // Batuan dasar mafik
  ctx.fillStyle = rightPlateGrad;
  ctx.fill();

  // Garis Lipatan Tektonik Antiklinal Alami yang Mulus Menyatukan Gunung & Dataran (5 lipatan)
  for (let f = 1; f <= 5; f++) {
    const fOffset = f * 17;
    ctx.strokeStyle = (f % 2 === 0) ? 'rgba(87, 72, 61, 0.40)' : 'rgba(53, 44, 37, 0.35)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    for (let x = contactX; x <= w + 400; x += 8) {
      const elev = getConvergentTerrainElevation(x, p, 'land');
      const sy = elev + fOffset;
      if (sy < baseY + plateThick + 4) {
        if (x === contactX) ctx.moveTo(x, sy);
        else ctx.lineTo(x, sy);
      }
    }
    ctx.stroke();
  }

  // Rumput Hijau Subur pada Permukaan Lempeng Kanan & Lereng Gunung
  ctx.beginPath();
  ctx.moveTo(contactX, getSubductingPlateTopY(contactX, p));
  for (let x = contactX; x <= w + 400; x += 4) {
    ctx.lineTo(x, getConvergentTerrainElevation(x, p, 'land'));
  }
  ctx.lineTo(w + 400, baseY + 4);
  for (let x = w + 400; x >= contactX; x -= 4) {
    ctx.lineTo(x, getConvergentTerrainElevation(x, p, 'land') + 4);
  }
  ctx.closePath();
  ctx.fillStyle = '#15803d';
  ctx.fill();

  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 2.0;
  ctx.beginPath();
  ctx.moveTo(contactX, getSubductingPlateTopY(contactX, p));
  for (let x = contactX; x <= w + 400; x += 4) {
    ctx.lineTo(x, getConvergentTerrainElevation(x, p, 'land'));
  }
  ctx.stroke();
  ctx.restore();

  // ══════════════════════════════════════════════════════════════════════
  // LAYER 5: LEMPENG BENUA KIRI (SLAB SUBDUKSI - Z-INDEX LEBIH TINGGI)
  // - Dirender SETELAH lempeng kanan dan gunung, sehingga lempeng kiri berada di atas
  //   pada area pertemuan lempeng (contactX), sesuai permintaan pengguna.
  // - Menunjam mulus dan curam tembus ke dasar layar dengan ketebalan 95px padat.
  // - Didukung animasi pergeseran strata horisontal nyata (strataOffset = leftShiftX)
  //   sehingga pergerakan lempeng tektonik tampak jelas dan hidup.
  // ══════════════════════════════════════════════════════════════════════
  ctx.save();
  const slabReachX = contactX + 260 + Math.round(p * 45);

  // 5A. Tubuh Lempeng Benua Kiri (Batuan Granit, Sedimen & Batuan Dasar Menunjam)
  ctx.beginPath();
  ctx.moveTo(-800, baseY);
  for (let x = -800; x <= slabReachX; x += 4) {
    ctx.lineTo(x, getSubductingPlateTopY(x, p));
  }
  ctx.lineTo(slabReachX, getSubductingPlateTopY(slabReachX, p) + plateThick);
  for (let x = slabReachX; x >= -800; x -= 4) {
    ctx.lineTo(x, getSubductingPlateTopY(x, p) + plateThick);
  }
  ctx.closePath();

  const leftPlateGrad = ctx.createLinearGradient(0, baseY, 0, baseY + plateThick);
  leftPlateGrad.addColorStop(0, '#4a3f35');   // Sedimen atas
  leftPlateGrad.addColorStop(0.35, '#3a3028'); // Granit menengah
  leftPlateGrad.addColorStop(0.70, '#29211a'); // Granit dalam
  leftPlateGrad.addColorStop(1, '#1c1510');    // Batuan dasar mafik
  ctx.fillStyle = leftPlateGrad;
  ctx.fill();

  // 5B. Garis Strata Internal Lempeng Kiri (4 lapisan strata tebal mengikuti penunjaman)
  for (let s = 1; s <= 4; s++) {
    const sOffset = s * 20;
    ctx.strokeStyle = (s % 2 === 0) ? 'rgba(87, 72, 61, 0.45)' : 'rgba(53, 44, 37, 0.45)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-800, baseY + sOffset);
    for (let x = -800; x <= slabReachX; x += 6) {
      ctx.lineTo(x, getSubductingPlateTopY(x, p) + sOffset);
    }
    ctx.stroke();
  }

  // 5B.2 TEKSTUR PERGERAKAN LEMPENG (STRATA BERGESER NYATA MENGIKUTI PERGERAKAN LEMPENG KE KANAN)
  const strataOffset = leftShiftX;

  // Garis kekar / patahan vertikal litosfer yang bergerak meluncur ke kanan
  for (let bx = -800; bx <= slabReachX; bx += 44) {
    const fx = bx + strataOffset;
    if (fx <= slabReachX) {
      const topY = getSubductingPlateTopY(fx, p);
      ctx.strokeStyle = (Math.floor(bx / 44) % 2 === 0) ? 'rgba(78, 62, 50, 0.28)' : 'rgba(38, 28, 21, 0.24)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(fx, topY + 4);
      ctx.lineTo(fx, topY + plateThick - 4);
      ctx.stroke();
    }
  }

  // Bintik kristal mineral padat yang bergeser dinamis bersama lempeng
  for (let i = 0; i < 48; i++) {
    const sx = (((i * 89 + strataOffset) % (contactX + 750)) - 750);
    const sy = baseY + 12 + ((i * 27) % (plateThick - 24));
    ctx.fillStyle = i % 3 === 0 ? 'rgba(255, 255, 255, 0.45)' : (i % 2 === 0 ? 'rgba(190, 160, 130, 0.35)' : 'rgba(40, 30, 22, 0.45)');
    ctx.fillRect(sx, sy, 2, 2);
  }

  // 5C. Rumput Hijau Subur pada Dataran Lempeng Barat (TERTUTUP PENUH SAMPAI contactX)
  ctx.beginPath();
  ctx.moveTo(-800, baseY);
  for (let x = -800; x <= contactX; x += 4) {
    ctx.lineTo(x, getSubductingPlateTopY(x, p));
  }
  ctx.lineTo(contactX, getSubductingPlateTopY(contactX, p) + 4);
  for (let x = contactX; x >= -800; x -= 4) {
    ctx.lineTo(x, getSubductingPlateTopY(x, p) + 4);
  }
  ctx.closePath();
  ctx.fillStyle = '#15803d';
  ctx.fill();

  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 2.0;
  ctx.beginPath();
  ctx.moveTo(-800, baseY);
  for (let x = -800; x <= contactX; x += 4) {
    ctx.lineTo(x, getSubductingPlateTopY(x, p));
  }
  ctx.stroke();

  // Rumpun rumput & ornamen di permukaan lempeng kiri yang bergerak nyata ke kanan
  for (let gx = -720; gx < contactX - 12; gx += 32) {
    const px = gx + strataOffset;
    if (px < contactX - 4) {
      const py = getSubductingPlateTopY(px, p);
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(px, py - 2, 3, 2);
      ctx.fillStyle = '#166534';
      ctx.fillRect(px + 1, py, 2, 2);
    }
  }

  // 5D. Kontak Alami Batuan pada Bidang Penunjaman di Bawah Gunung
  ctx.strokeStyle = 'rgba(30, 22, 16, 0.40)';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  for (let x = contactX; x <= slabReachX; x += 4) {
    const y = getSubductingPlateTopY(x, p);
    if (x === contactX) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // 5E. Zona Peleburan Parsial Ujung Slab di dalam Mantel (Benioff Partial Melt Zone)
  const meltX = contactX + 110;
  const meltY = getSubductingPlateTopY(meltX, p) + 20;
  const meltGlow = ctx.createRadialGradient(meltX + 45, meltY + 25, 8, meltX + 45, meltY + 25, 95);
  meltGlow.addColorStop(0, 'rgba(254, 240, 138, 0.90)');
  meltGlow.addColorStop(0.35, 'rgba(249, 115, 22, 0.65)');
  meltGlow.addColorStop(0.70, 'rgba(220, 38, 38, 0.30)');
  meltGlow.addColorStop(1, 'rgba(220, 38, 38, 0)');
  ctx.fillStyle = meltGlow;
  ctx.beginPath();
  ctx.arc(meltX + 45, meltY + 25, 95, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // ══════════════════════════════════════════════════════════════════════
  // LAYER 6: POHON-POHON PINUS (TERSEBAR ALAMI TANPA BERTUMPUKAN)
  // ══════════════════════════════════════════════════════════════════════
  const pineXs = [
    120,
    240,
    contactX + 35,
    mountainPeakX - 95,
    mountainPeakX + 115,
    mountainEndX - 30,
    mountainEndX + 90,
    mountainEndX + 220,
  ];
  for (const px of pineXs) {
    if (px < w + 200) {
      const treeY = getConvergentTerrainElevation(px, p, 'land');
      drawPineTree(ctx, px, treeY, 0.95);
    }
  }

  // ══════════════════════════════════════════════════════════════════════
  // LAYER 7: INDIKATOR VEKTOR GERAKAN LEMPENG (JELAS, EDUKATIF & BERANIMASI)
  // ══════════════════════════════════════════════════════════════════════
  // Panah 1: Lempeng kiri menunjam miring ke kanan bawah (↘)
  const leftArrowX = curveStartX + 30;
  const leftArrowY = getSubductingPlateTopY(leftArrowX, p) + 40;
  drawPlateVectorArrow(
    ctx,
    leftArrowX,
    leftArrowY,
    (Math.PI / 180) * 28,
    42,
    '',
    '#38bdf8',
    frame,
  );

  // Panah 2: Lempeng kanan menekan ke kiri (←)
  const rightArrowX = mountainEndX + 65;
  const rightArrowY = baseY + 40;
  drawPlateVectorArrow(
    ctx,
    rightArrowX,
    rightArrowY,
    Math.PI,
    42,
    '',
    '#f59e0b',
    frame,
  );
}

// ══════════════════════════════════════════════════════════════════════════
// KONDISI 2: KONVERGEN LAUTAN & PANTAI (SUBDUKSI SAMUDRA & PEMBENTUKAN PALUNG)
// Sesuai Arahan Pengguna & Sketsa Gambar:
// 1. Kurva Lempeng Samudra 100% MULUS KONTINU (bebas patahan siku di area subduksi).
// 2. Palung Laut berjarak jauh (~200px) dari garis pantai (trenchX ≈ 360..385, pantai di coastX = 580).
// 3. Lempeng Benua di kanan posisinya LEBIH TINGGI dari lempeng samudra, dengan kontur
//    perbukitan pasir pantai bergelombang alami (rolling sand dunes).
// 4. Lempeng Benua memiliki 5 LAPISAN STRATA BATUAN YANG SANGAT JELAS, TEGAS & KONTRAS
//    (Pasir Emas, Serpih Sedimen, Kerak Granit, Kerak Diorit, Litosfer Mafik).
// 5. TANPA LAPISAN MANTEL MAGMA: Di bawah lempeng adalah batuan litosfer padat dingin.
// 6. Indikator vektor gerakan lempeng bersih tanpa label badge teks.
// ══════════════════════════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════════════════════════
// KONDISI 2: KONVERGEN LAUTAN & PANTAI (SUBDUKSI SAMUDRA & PEMBENTUKAN PALUNG)
// Sesuai Arahan Pengguna & Sketsa Gambar:
// 1. Kurva Lempeng Samudra 100% MULUS KONTINU (bebas patahan siku di area subduksi).
// 2. Palung Laut berjarak jauh (~200px) dari garis pantai (trenchX ≈ 360..385, pantai di coastX = 580).
// 3. Lempeng Benua di kanan posisinya LEBIH TINGGI dari lempeng samudra, dengan kontur
//    perbukitan pasir pantai bergelombang alami (rolling sand dunes).
// 4. Lempeng Benua memiliki 5 LAPISAN STRATA BATUAN YANG SANGAT JELAS, TEGAS & KONTRAS
//    (Pasir Emas, Serpih Sedimen, Kerak Granit, Kerak Diorit, Litosfer Mafik).
// 5. TANPA LAPISAN MANTEL MAGMA: Di bawah lempeng adalah batuan litosfer padat dingin.
// 6. Indikator vektor gerakan lempeng bersih tanpa label badge teks.
// ══════════════════════════════════════════════════════════════════════════
export function renderConvergentOceanMode(
  ctx: CanvasRenderingContext2D,
  zone: ZoneConfig,
  frame: number,
  collisionProgress: number = 1.0,
): void {
  const w = zone.cols * TILE;
  const h = Math.max(zone.rows * TILE, 1600);
  const p = Math.max(0, Math.min(1, collisionProgress));
  ctx.imageSmoothingEnabled = false;

  const coastX = 580;
  const seaLevelY = 300;
  // Pergerakan nyata lempeng samudra meluncur maju ke kanan (110 px)
  const oceanicShift = Math.round(p * 110);
  const trenchX = 370 + Math.round(p * 12);
  const trenchDepth = Math.round(485 + p * 25);
  const slabThick = 75;
  // Slab subduksi menusuk menembus makin jauh & makin dalam ke bawah lempeng benua (p: 0 -> 1)
  const slabReachX = trenchX + 130 + Math.round(p * 260);

  const getContTop = (x: number) => {
    return x <= coastX ? getConvergentSeafloorProfile(x, p) : getConvergentTerrainElevation(x, p, 'ocean');
  };

  // ══════════════════════════════════════════════════════════════════════
  // LAYER 1: LITOSFER BAWAH PADAT DINGIN (DEEP LITHOSPHERE - TANPA LAPISAN MANTEL)
  // Sesuai arahan pengguna: TIDAK ADA LAPISAN MANTEL MAGMA di kondisi lautan.
  // Batuan litosfer mafik padat, dingin, dan stabil mengisi bagian bawah kanvas.
  // ══════════════════════════════════════════════════════════════════════
  ctx.save();
  const deepLithoGrad = ctx.createLinearGradient(0, 390, 0, h);
  deepLithoGrad.addColorStop(0, '#1c1917');
  deepLithoGrad.addColorStop(0.35, '#12100e');
  deepLithoGrad.addColorStop(1, '#080706');
  ctx.fillStyle = deepLithoGrad;
  ctx.fillRect(-800, 360, w + 1600, h - 360);

  // Tekstur strata litosfer horizontal padat
  for (let gy = 415; gy < Math.min(h, 950); gy += 15) {
    const isEven = Math.floor(gy / 15) % 2 === 0;
    ctx.strokeStyle = isEven ? 'rgba(68, 64, 60, 0.22)' : 'rgba(41, 37, 36, 0.28)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-800, gy);
    for (let x = -800; x <= w + 800; x += 32) {
      const wave = Math.sin(x * 0.02 + gy * 0.05) * 2.5;
      ctx.lineTo(x, gy + wave);
    }
    ctx.stroke();
  }
  ctx.restore();

  // ══════════════════════════════════════════════════════════════════════
  // LAYER 2: LEMPENG BENUA KANAN (5 LAPISAN STRATA BATUAN JELAS, TEGAS & BERGELOMBANG)
  // Sesuai arahan pengguna & sketsa:
  // - Posisi lempeng benua LEBIH TINGGI dari lempeng samudra
  // - Lapisan atas bergelombang alami (rolling sand dunes)
  // - 5 LAPISAN STRATA YANG SANGAT JELAS DENGAN WARNA KONTRAS & GARIS PEMISAH TEGAS:
  //   1. Pasir Pantai Emas & Batupasir Kuarsa (0 .. 22 px)
  //   2. Serpih Sedimen & Batulumpur Pantai (22 .. 54 px)
  //   3. Kerak Granit Atas Benua (54 .. 102 px)
  //   4. Kerak Bawah Diorit (102 .. 165 px)
  //   5. Batuan Dasar Metamorf Litosfer Benua (165+ px ke bawah)
  // ══════════════════════════════════════════════════════════════════════
  ctx.save();

  // Batas kliping tubuh lempeng benua
  ctx.beginPath();
  ctx.moveTo(trenchX, trenchDepth);
  for (let bx = trenchX; bx <= w + 800; bx += 4) {
    ctx.lineTo(bx, getContTop(bx));
  }
  ctx.lineTo(w + 800, h);
  for (let bx = w + 800; bx >= trenchX; bx -= 8) {
    const bY = bx <= slabReachX ? getOceanicSubductingSlabTopY(bx, p) : h;
    ctx.lineTo(bx, bY);
  }
  ctx.closePath();
  ctx.clip(); // Seluruh 5 strata batuan berada presisi di dalam tubuh lempeng benua

  // 2E. STRATA 5: BATUAN DASAR METAMORF LITOSFER BENUA (Paling Dasar)
  ctx.fillStyle = '#18181b';
  ctx.fillRect(trenchX - 20, 0, w + 1000, h);

  // 2D. STRATA 4: KERAK BAWAH DIORIT (Lower Crust / Diorite - Tebal 63px)
  // Warna abu-abu gelap kebiruan elegan yang kontras
  ctx.beginPath();
  ctx.moveTo(trenchX, trenchDepth + 102);
  for (let bx = trenchX; bx <= w + 800; bx += 4) {
    ctx.lineTo(bx, getContTop(bx) + 102);
  }
  ctx.lineTo(w + 800, h);
  ctx.lineTo(trenchX, h);
  ctx.closePath();
  const dioriteGrad = ctx.createLinearGradient(0, seaLevelY + 102, 0, seaLevelY + 220);
  dioriteGrad.addColorStop(0, '#334155');
  dioriteGrad.addColorStop(0.5, '#243042');
  dioriteGrad.addColorStop(1, '#1e293b');
  ctx.fillStyle = dioriteGrad;
  ctx.fill();

  // 2C. STRATA 3: KERAK GRANIT ATAS BENUA (Upper Granitic Crust - Tebal 48px)
  // Warna abu-abu kecokelatan andesit granit yang khas benua
  ctx.beginPath();
  ctx.moveTo(trenchX, trenchDepth + 54);
  for (let bx = trenchX; bx <= w + 800; bx += 4) {
    ctx.lineTo(bx, getContTop(bx) + 54);
  }
  ctx.lineTo(w + 800, h);
  ctx.lineTo(trenchX, h);
  ctx.closePath();
  const graniteGrad = ctx.createLinearGradient(0, seaLevelY + 54, 0, seaLevelY + 120);
  graniteGrad.addColorStop(0, '#57534e');
  graniteGrad.addColorStop(0.5, '#4b4742');
  graniteGrad.addColorStop(1, '#3f3b37');
  ctx.fillStyle = graniteGrad;
  ctx.fill();

  // Bintik kristal feldspar & mika pada granit
  for (let i = 0; i < 48; i++) {
    const gx = trenchX + 30 + ((i * 73) % (w + 400));
    const gy = getContTop(gx) + 60 + ((i * 17) % 36);
    ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 255, 255, 0.40)' : 'rgba(214, 211, 209, 0.35)';
    ctx.fillRect(gx, gy, 2, 2);
  }

  // 2B. STRATA 2: SERPIH SEDIMEN & BATULUMPUR PANTAI (Terrigenous Shale - Tebal 32px)
  // Warna cokelat kemerahan hangat yang memukau
  ctx.beginPath();
  ctx.moveTo(trenchX, trenchDepth + 22);
  for (let bx = trenchX; bx <= w + 800; bx += 4) {
    ctx.lineTo(bx, getContTop(bx) + 22);
  }
  ctx.lineTo(w + 800, h);
  ctx.lineTo(trenchX, h);
  ctx.closePath();
  const shaleGrad = ctx.createLinearGradient(0, seaLevelY + 22, 0, seaLevelY + 60);
  shaleGrad.addColorStop(0, '#9a3412');
  shaleGrad.addColorStop(0.5, '#852d0e');
  shaleGrad.addColorStop(1, '#71260c');
  ctx.fillStyle = shaleGrad;
  ctx.fill();

  // 2A. STRATA 1: PASIR PANTAI EMAS & BATUPASIR KUARSA (Gold Sandstone - Tebal 22px)
  // Warna pasir emas berkilauan sesuai sketsa pantai tropis
  ctx.beginPath();
  ctx.moveTo(trenchX, trenchDepth);
  for (let bx = trenchX; bx <= w + 800; bx += 4) {
    ctx.lineTo(bx, getContTop(bx));
  }
  ctx.lineTo(w + 800, h);
  ctx.lineTo(trenchX, h);
  ctx.closePath();
  const sandGrad = ctx.createLinearGradient(0, seaLevelY - 15, 0, seaLevelY + 30);
  sandGrad.addColorStop(0.00, '#fef9c3'); // Pasir putih keemasan halus di permukaan
  sandGrad.addColorStop(0.25, '#fef08a'); // Pasir hangat
  sandGrad.addColorStop(0.55, '#fde047'); // Emas pantai tropis
  sandGrad.addColorStop(0.85, '#ca8a04'); // Pasir basah padat
  sandGrad.addColorStop(1.00, '#a16207'); // Batupasir kontak
  ctx.fillStyle = sandGrad;
  ctx.fill();

  // ══════════════════════════════════════════════════════════════════════
  // GARIS PEMISAH STRATA GEOLOGI (BEDDING PLANES) YANG SANGAT JELAS & TEGAS
  // ══════════════════════════════════════════════════════════════════════
  const layerOffsets = [
    { offset: 22, color: 'rgba(69, 26, 3, 0.95)', width: 2.2 },   // Batas Pasir / Serpih
    { offset: 54, color: 'rgba(41, 37, 36, 0.95)', width: 2.2 },  // Batas Serpih / Granit
    { offset: 102, color: 'rgba(15, 23, 42, 0.95)', width: 2.5 }, // Batas Granit / Diorit
    { offset: 165, color: 'rgba(9, 9, 11, 0.95)', width: 2.5 },   // Batas Diorit / Basement
  ];

  for (const lp of layerOffsets) {
    ctx.strokeStyle = lp.color;
    ctx.lineWidth = lp.width;
    ctx.beginPath();
    ctx.moveTo(trenchX, trenchDepth + lp.offset);
    for (let bx = trenchX; bx <= w + 800; bx += 4) {
      ctx.lineTo(bx, getContTop(bx) + lp.offset);
    }
    ctx.stroke();
  }

  // Riak ombak pasir (sand ripples) alami di sepanjang daratan pantai
  for (let rx = coastX + 15; rx <= w + 800; rx += 28) {
    const topY = getContTop(rx);
    ctx.fillStyle = 'rgba(202, 138, 4, 0.50)';
    ctx.fillRect(rx, topY, 8, 1.5);
    ctx.fillStyle = 'rgba(254, 249, 195, 0.75)';
    ctx.fillRect(rx + 2, topY - 1, 4, 1);
  }

  // Taburan bintik pasir kristal kuarsa berkilau lembut di pantai
  for (let i = 0; i < 45; i++) {
    const spX = coastX + 10 + ((i * 47) % (w + 200));
    const spY = getContTop(spX) + ((i * 7) % 18);
    ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 255, 255, 0.75)' : 'rgba(254, 240, 138, 0.65)';
    ctx.fillRect(spX, spY, 1.5, 1.5);
  }

  // Dermaga Kayu Pantai di Bibir Air Laut (x: 574 .. 598, menyambung air laut & pasir pantai)
  ctx.fillStyle = '#451a03';
  ctx.fillRect(coastX - 6, seaLevelY, 5, 26);
  ctx.fillRect(coastX + 6, seaLevelY, 5, 26);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(coastX - 12, seaLevelY - 3, 26, 5);
  ctx.fillStyle = '#92400e';
  ctx.fillRect(coastX - 12, seaLevelY - 4, 26, 2);

  ctx.restore();

  // ══════════════════════════════════════════════════════════════════════
  // LAYER 3: LEMPENG SAMUDRA KIRI & SLAB SUBDUKSI MENUNJAM KAKU & REALISTIS
  // - Lempeng samudra meluncur maju secara nyata (oceanicShift = p * 110 px).
  // - Ujung slab (slabReachX) menusuk menembus jauh ke dalam litosfer benua (p * 260 px).
  // - Ketebalan lempeng 75px dihitung tegak lurus bidang normal permukaan slab (bebas distorsi meleyot).
  // - Patahan kekar basal miring tegak lurus slab menyusuri lintasan subduksi.
  // - Gesekan seismik aktif pada batas kontak megathrust membuktikan kedua lempeng bertumbukan.
  // ══════════════════════════════════════════════════════════════════════
  ctx.save();

  // 3A. Tubuh Lempeng Samudra & Slab Penunjaman (Ketebalan Tegak Lurus Presisi 75px)
  const tipSlope = getOceanicSlabSlope(slabReachX, p);
  const tipTheta = Math.atan(tipSlope);
  const tipNx = -Math.sin(tipTheta);
  const tipNy = Math.cos(tipTheta);

  ctx.beginPath();
  // Lintasan permukaan atas dari -800 sampai slabReachX
  ctx.moveTo(-800, 350);
  for (let x = -800; x <= slabReachX; x += 4) {
    ctx.lineTo(x, getOceanicSubductingSlabTopY(x, p));
  }
  // Ujung slab dipotong tegak lurus penampang geologis slab
  ctx.lineTo(slabReachX + tipNx * slabThick, getOceanicSubductingSlabTopY(slabReachX, p) + tipNy * slabThick);
  // Lintasan dasar bawah lempeng dari slabReachX kembali ke -800 mengikuti normal slab
  for (let x = slabReachX; x >= -800; x -= 6) {
    const topY = getOceanicSubductingSlabTopY(x, p);
    const sl = getOceanicSlabSlope(x, p);
    const th = Math.atan(sl);
    const nx = -Math.sin(th);
    const ny = Math.cos(th);
    ctx.lineTo(x + nx * slabThick, topY + ny * slabThick);
  }
  ctx.closePath();

  const oceanPlateGrad = ctx.createLinearGradient(0, 350, 0, 350 + slabThick);
  oceanPlateGrad.addColorStop(0.00, '#475569'); // Sedimen pelagis atas (slate)
  oceanPlateGrad.addColorStop(0.18, '#334155'); // Sedimen laut dalam
  oceanPlateGrad.addColorStop(0.35, '#1e293b'); // Basal bantal vulkanik (pillow basalt)
  oceanPlateGrad.addColorStop(0.65, '#111827'); // Sheeted dykes litosfer
  oceanPlateGrad.addColorStop(1.00, '#090d16'); // Gabro plutonik mafik padat
  ctx.fillStyle = oceanPlateGrad;
  ctx.fill();

  // 3B. Garis Strata Internal Lempeng Samudra Mengikuti Normal Slab Menunjam Mulus
  for (let s = 1; s <= 4; s++) {
    const sDist = s * (slabThick / 5);
    ctx.strokeStyle = (s % 2 === 0) ? 'rgba(71, 85, 105, 0.45)' : 'rgba(30, 41, 59, 0.40)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-800, 350 + sDist);
    for (let x = -800; x <= slabReachX; x += 6) {
      const topY = getOceanicSubductingSlabTopY(x, p);
      const sl = getOceanicSlabSlope(x, p);
      const th = Math.atan(sl);
      const nx = -Math.sin(th);
      const ny = Math.cos(th);
      ctx.lineTo(x + nx * sDist, topY + ny * sDist);
    }
    ctx.stroke();
  }

  // 3C. ANIMASI PERGERAKAN LEMPENG: PATAHAN KEKAR LITOSFER SAMUDRA MELUNCUR KE KANAN & MENUNJAM
  // Kekar tegak lurus bidang slab meluncur menyusuri rel lengkungan penunjaman
  for (let bx = -800; bx <= slabReachX; bx += 40) {
    const fx = bx + oceanicShift;
    if (fx <= slabReachX - 8) {
      const topY = getOceanicSubductingSlabTopY(fx, p);
      const sl = getOceanicSlabSlope(fx, p);
      const th = Math.atan(sl);
      const nx = -Math.sin(th);
      const ny = Math.cos(th);
      ctx.strokeStyle = (Math.floor(bx / 40) % 2 === 0) ? 'rgba(51, 65, 85, 0.40)' : 'rgba(15, 23, 42, 0.35)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(fx + nx * 4, topY + ny * 4);
      ctx.lineTo(fx + nx * (slabThick - 4), topY + ny * (slabThick - 4));
      ctx.stroke();
    }
  }

  // Bintik kristal mineral basal & olivin bergerak bergeser bersama lempeng
  for (let i = 0; i < 40; i++) {
    const sx = (((i * 97 + oceanicShift) % (trenchX + 700)) - 700);
    const sy = 350 + 10 + ((i * 23) % (slabThick - 20));
    ctx.fillStyle = i % 2 === 0 ? 'rgba(148, 163, 184, 0.45)' : 'rgba(30, 41, 59, 0.50)';
    ctx.fillRect(sx, sy, 2, 2);
  }

  // 3D. Garis Batas Sesar Kontak Penunjaman (Megathrust Plate Interface)
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.lineWidth = 2.0;
  ctx.beginPath();
  ctx.moveTo(trenchX, trenchDepth);
  for (let x = trenchX; x <= slabReachX; x += 5) {
    ctx.lineTo(x, getOceanicSubductingSlabTopY(x, p));
  }
  ctx.stroke();

  // Pendaran tegangan kompresi tektonik megathrust & percikan gesekan saat kedua lempeng bertumbukan
  if (p > 0.03 && p < 0.97) {
    const pulse = (Math.sin(frame * 0.25) + 1) / 2;
    ctx.strokeStyle = `rgba(56, 189, 248, ${0.20 + pulse * 0.30})`;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(trenchX, trenchDepth);
    for (let x = trenchX; x <= slabReachX; x += 6) {
      ctx.lineTo(x, getOceanicSubductingSlabTopY(x, p));
    }
    ctx.stroke();

    // Percikan gesekan batuan tektonik (tectonic stress sparks)
    for (let i = 0; i < 6; i++) {
      const spDist = Math.max(30, slabReachX - trenchX - 40);
      const fx = trenchX + 25 + ((i * 47 + frame * 2.5) % spDist);
      const fy = getOceanicSubductingSlabTopY(fx, p);
      const sparkGlow = (Math.sin(frame * 0.35 + i) + 1) / 2;
      ctx.fillStyle = i % 2 === 0 ? `rgba(254, 240, 138, ${0.45 + sparkGlow * 0.5})` : `rgba(249, 115, 22, ${0.40 + sparkGlow * 0.45})`;
      ctx.fillRect(fx - 1, fy - 1, 2, 2);
    }
  }

  ctx.restore();

  // ══════════════════════════════════════════════════════════════════════
  // LAYER 4: AIR LAUTAN LUAS & PEMBENTUKAN PALUNG SAMUDRA (x: -800 .. coastX)
  // - Permukaan air laut berada di seaLevelY = 300
  // - Palung laut berada di tengah laut (trenchX ≈ 360..385), berjarak jauh dari pantai (coastX = 580)
  // - Dasar air laut mengikuti pembentukan palung yang mendalam seiring p: 0 -> 1
  // - Air laut biru jernih memenuhi seluruh lantai samudra dan palung
  // ══════════════════════════════════════════════════════════════════════
  ctx.save();
  const oceanGrad = ctx.createLinearGradient(0, seaLevelY, 0, Math.max(trenchDepth + 20, 520));
  oceanGrad.addColorStop(0.00, 'rgba(56, 189, 248, 0.88)'); // Azure jernih tropis di permukaan
  oceanGrad.addColorStop(0.20, 'rgba(2, 132, 199, 0.92)');  // Biru samudra
  oceanGrad.addColorStop(0.55, 'rgba(3, 105, 161, 0.96)');  // Biru laut dalam
  oceanGrad.addColorStop(0.85, 'rgba(3, 35, 65, 0.98)');    // Biru abisal palung
  oceanGrad.addColorStop(1.00, 'rgba(2, 20, 40, 0.99)');    // Dasar jurang palung gelap pekat

  ctx.fillStyle = oceanGrad;
  ctx.beginPath();
  ctx.moveTo(-800, seaLevelY);
  ctx.lineTo(coastX, seaLevelY);
  for (let bx = coastX; bx >= -800; bx -= 4) {
    ctx.lineTo(bx, getConvergentSeafloorProfile(bx, p));
  }
  ctx.closePath();
  ctx.fill();

  // Sinar matahari menembus air laut (God rays miring menuju palung)
  const rayRays = [-650, -480, -310, -140, 30, 200, 350, 440];
  for (const rx of rayRays) {
    const drift = Math.sin(frame * 0.03 + rx * 0.01) * 8;
    const rayGrad = ctx.createLinearGradient(0, seaLevelY, 0, 440);
    rayGrad.addColorStop(0, 'rgba(255, 255, 255, 0.14)');
    rayGrad.addColorStop(0.5, 'rgba(186, 230, 253, 0.07)');
    rayGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
    ctx.fillStyle = rayGrad;
    ctx.beginPath();
    ctx.moveTo(rx + drift, seaLevelY);
    ctx.lineTo(rx + 24 + drift, seaLevelY);
    ctx.lineTo(rx + 44 + drift, 440);
    ctx.lineTo(rx + 12 + drift, 440);
    ctx.closePath();
    ctx.fill();
  }

  // Ombak permukaan laut beriak halus di seaLevelY = 300
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.beginPath();
  ctx.moveTo(-800, seaLevelY);
  for (let wx = -800; wx <= coastX - 2; wx += 4) {
    const waveSin = Math.sin(frame * 0.08 + wx * 0.05) * 1.5;
    ctx.lineTo(wx, seaLevelY + waveSin);
  }
  ctx.lineTo(coastX - 2, seaLevelY + 2);
  for (let wx = coastX - 2; wx >= -800; wx -= 4) {
    const waveSin = Math.sin(frame * 0.08 + wx * 0.05) * 1.5;
    ctx.lineTo(wx, seaLevelY + 1.5 + waveSin);
  }
  ctx.closePath();
  ctx.fill();

  // Buih ombak pantai yang memecah di bibir pasir & dermaga (x: coastX - 10 .. coastX + 6)
  const surfPulse = Math.sin(frame * 0.07) * 3;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.80)';
  ctx.fillRect(coastX - 8 + surfPulse, seaLevelY - 1, 14, 3);
  ctx.fillStyle = 'rgba(224, 242, 254, 0.65)';
  ctx.fillRect(coastX - 10 + surfPulse, seaLevelY + 1, 16, 2);

  ctx.restore();

  // ══════════════════════════════════════════════════════════════════════
  // LAYER 5: INDIKATOR VEKTOR GERAKAN LEMPENG (BERSIH TANPA LABEL TEKS)
  // - Panah 1: Lempeng Samudra (kiri) meluncur menunjam miring ke kanan bawah (↘)
  // - Panah 2: Lempeng Benua (kanan) menekan ke kiri (←)
  // ══════════════════════════════════════════════════════════════════════
  // Panah 1: Lempeng Samudra
  const oceanArrowX = 160 + oceanicShift;
  const oceanArrowY = 385;
  drawPlateVectorArrow(
    ctx,
    oceanArrowX,
    oceanArrowY,
    (Math.PI / 180) * 32, // Miring ke kanan bawah (↘)
    42,
    '',
    '#38bdf8',
    frame,
  );

  // Panah 2: Lempeng Benua
  const contArrowX = 760 - Math.round(p * 20);
  const contArrowY = 330;
  drawPlateVectorArrow(
    ctx,
    contArrowX,
    contArrowY,
    Math.PI, // Mengarah ke kiri (←)
    42,
    '',
    '#f59e0b',
    frame,
  );
}

// ══════════════════════════════════════════════════════════════════════════
// EXPORT DISPATCHER: RENDERING MEDAN DINAMIS AREA 7 (BATAS KONVERGEN)
// ══════════════════════════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════════════════════════
// EXPORT DISPATCHER: RENDERING MEDAN DINAMIS AREA 7 (BATAS KONVERGEN)
// ══════════════════════════════════════════════════════════════════════════
export function renderOrganicConvergentTerrain(
  ctx: CanvasRenderingContext2D,
  zone: ZoneConfig,
  frame: number,
  collisionProgress: number = 1.0,
  mode: 'land' | 'ocean' = 'land',
): void {
  if (mode === 'land') {
    renderConvergentLandMode(ctx, zone, frame, collisionProgress);
  } else {
    renderConvergentOceanMode(ctx, zone, frame, collisionProgress);
  }
}


// ══════════════════════════════════════════════════════════════════════════
// RENDERING MEDAN DINAMIS AREA 8 (BATAS TRANSFORM):
// GURUN SESAR SAN ANDREAS (TOP-DOWN VIEW / POV DARI ATAS)
// Gerakan sesar mendatar geser kanan-kiri (strike-slip horizontal displacement),
// sungai tergeser (Wallace Creek offset stream), jalan terputus, retakan en echelon,
// dan indikator panah pergerakan Lempeng Pasifik & Lempeng Amerika Utara.
// ══════════════════════════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════════════════════════
// RENDERING MEDAN DINAMIS AREA 8 (BATAS TRANSFORM):
// GURUN SESAR SAN ANDREAS (TOP-DOWN VIEW / POV DARI ATAS)
// Gerakan sesar mendatar geser kanan-kiri (strike-slip horizontal displacement),
// sungai tergeser (Wallace Creek offset stream), jalan terputus, retakan en echelon,
// dan indikator panah pergerakan Lempeng Pasifik & Lempeng Amerika Utara.
// ══════════════════════════════════════════════════════════════════════════
export function renderOrganicTransformTerrain(
  ctx: CanvasRenderingContext2D,
  zone: ZoneConfig,
  frame: number,
  transformProgress: number = 1.0,
): void {
  const w = zone.cols * TILE;
  const h = Math.max(zone.rows * TILE, 480);
  const p = Math.max(0, Math.min(1, transformProgress));
  ctx.imageSmoothingEnabled = false;

  // ══════════════════════════════════════════════════════════════════════
  // KALKULASI PROGRES TAHAPAN SEISMIK & PERGESERAN LEMPENG
  // Sesuai Arahan Pengguna:
  // 1. Fase Tenang Awal (p: 0.00 .. 0.08): Tanah menyatu utuh tanpa gempa.
  // 2. Fase Gempa Dulu (p: 0.08 .. 0.30): Gempa tremor tektonik mengguncang layar,
  //    tetapi tanah MASIH UTUH BERSATU (belum ada retakan sama sekali!).
  // 3. Fase Retakan Merekah (p: 0.30 .. 0.50): Di bawah tekanan gempa yang berlanjut,
  //    barulah retakan sesar mulai merekah dan menjalar bertahap.
  // 4. Fase Pergeseran Mendatar (p: 0.50 .. 0.90): Seiring gempanya, lempeng bergeser
  //    secara mendatar (strike-slip) sejauh 1/3 dari jarak sebelumnya (maks 22px per lempeng).
  // 5. Fase Patahan Menetap (p: 0.90 .. 1.00): Gempa mereda ke 0, bekas patahan bergerigi menetap.
  // ══════════════════════════════════════════════════════════════════════
  const crackP = p < 0.30 ? 0 : Math.min(1, (p - 0.30) / 0.20);
  const rawShiftP = p < 0.50 ? 0 : Math.min(1, (p - 0.50) / 0.40);
  // S-Curve Smoothstep untuk akselerasi dan deselerasi pergeseran tektonik alami
  const shiftP = rawShiftP * rawShiftP * (3 - 2 * rawShiftP);

  // Jarak pergeseran dibuat 1/3 dari sebelumnya (maksimal 22px per lempeng, total offset = 44px)
  const maxShift = 22;
  const shiftNorth = -Math.round(maxShift * shiftP);
  const shiftSouth = Math.round(maxShift * shiftP);

  // ── KONTUR GARIS SESAR BERGERIGI & BERTINGKAT (JAGGED STEPPED FAULT TRACE) ──
  // Sesuai arahan pengguna: Garis patahan TIDAK lurus penggaris, melainkan memiliki
  // bekas patahan bergerigi alami, undulasi tektonik, dan patahan stepped en-echelon.
  const getFaultBaseY = (x: number): number => {
    const w1 = Math.sin(x * 0.012) * 5.0;
    const w2 = Math.cos(x * 0.038) * 3.0;
    const microJag = Math.sin(x * 0.14) * 2.0;
    const stepSeg = ((Math.floor((x + 40) / 160) % 3) - 1) * 3.5;
    return 240 + w1 + w2 + microJag + stepSeg;
  };

  // Lebar celah retakan sesar saat merekah
  const getHalfGap = (x: number): number => {
    if (crackP <= 0) return 0;
    return (crackP * 3.5) + (Math.abs(Math.sin(x * 0.08)) * 1.8 * crackP);
  };

  // ══════════════════════════════════════════════════════════════════════
  // LAYER 1: BASE TERRAIN (LEMPENG UTARA & SELATAN DENGAN STRATA GURUN)
  // - Saat p < 0.18: Kedua lempeng bertemu tepat dan rapat (tanah menyatu 100% utuh).
  // - Saat p >= 0.18: Celah retakan mulai membuka di antara kedua lempeng.
  // ══════════════════════════════════════════════════════════════════════
  ctx.save();

  // 1A. Lempeng Utara (Lempeng Pasifik - Gurun Aluvial Kuning Kecokelatan)
  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(w, 0);
  ctx.lineTo(w, getFaultBaseY(w) - getHalfGap(w));
  for (let x = w; x >= 0; x -= 4) {
    ctx.lineTo(x, getFaultBaseY(x) - getHalfGap(x));
  }
  ctx.closePath();
  ctx.fill();

  // Gelombang pasir alami yang bergeser bersama Lempeng Pasifik (Utara)
  ctx.fillStyle = '#c26d18';
  for (let dy = 16; dy < 210; dy += 32) {
    const waveShift = ((shiftNorth * 0.8) % 120 + 120) % 120;
    ctx.beginPath();
    ctx.moveTo(0, dy);
    for (let x = -120; x <= w + 120; x += 60) {
      const wx = x + waveShift;
      ctx.quadraticCurveTo(wx + 30, dy + 6, wx + 60, dy);
    }
    ctx.lineTo(w, dy + 10);
    ctx.lineTo(0, dy + 10);
    ctx.closePath();
    ctx.fill();
  }

  // Kerikil kuarsa yang bergeser bersama lempeng utara
  for (let bx = -100; bx < w + 100; bx += 48) {
    const px = bx + shiftNorth;
    const seed = (bx * 3137) ^ 0x4a4a;
    const by = (Math.abs(seed) % 195) + 15;
    ctx.fillStyle = 'rgba(254, 240, 138, 0.25)';
    ctx.fillRect(px, by, 4, 3);
    ctx.fillStyle = 'rgba(69, 26, 3, 0.35)';
    ctx.fillRect(px + 4, by + 1, 3, 3);
  }

  // 1B. Lempeng Selatan (Lempeng Amerika Utara - Gurun Aluvial Cokelat Kemerahan)
  ctx.fillStyle = '#92400e';
  ctx.beginPath();
  ctx.moveTo(0, getFaultBaseY(0) + getHalfGap(0));
  for (let x = 0; x <= w; x += 4) {
    ctx.lineTo(x, getFaultBaseY(x) + getHalfGap(x));
  }
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  // Gelombang pasir alami yang bergeser bersama Lempeng Amerika Utara (Selatan)
  ctx.fillStyle = '#78350f';
  for (let dy = 264; dy < h - 16; dy += 34) {
    const waveShift = ((shiftSouth * 0.8) % 120 + 120) % 120;
    ctx.beginPath();
    ctx.moveTo(0, dy);
    for (let x = -120; x <= w + 120; x += 60) {
      const wx = x + waveShift;
      ctx.quadraticCurveTo(wx + 30, dy + 6, wx + 60, dy);
    }
    ctx.lineTo(w, dy + 10);
    ctx.lineTo(0, dy + 10);
    ctx.closePath();
    ctx.fill();
  }

  // Kerikil gurun lempeng selatan yang bergeser bersama lempeng selatan
  for (let bx = -100; bx < w + 100; bx += 48) {
    const px = bx + shiftSouth;
    const seed = (bx * 7919) ^ 0x6b6b;
    const by = 265 + (Math.abs(seed) % (h - 295));
    ctx.fillStyle = 'rgba(254, 240, 138, 0.2)';
    ctx.fillRect(px, by, 4, 3);
    ctx.fillStyle = 'rgba(69, 26, 3, 0.4)';
    ctx.fillRect(px + 4, by + 1, 3, 3);
  }
  ctx.restore();

  // ══════════════════════════════════════════════════════════════════════
  // LAYER 2: SUNGAI KERING TERGESER (WALLACE CREEK OFFSET STREAM BED)
  // - Saat tanah utuh (p < 0.18): Alur sungai menyatu lurus tanpa patahan.
  // - Saat bergeser (p >= 0.38): Alur sungai tergeser terpotong secara dramatis.
  // ══════════════════════════════════════════════════════════════════════
  const creekBaseX = 720;
  const creekWidth = 24;

  const drawStreamChannel = (startY: number, endY: number, shift: number) => {
    // 1. Bantaran pasir aluvial luar (Dry sand bank)
    ctx.fillStyle = '#78716c';
    ctx.beginPath();
    ctx.moveTo(creekBaseX + shift - creekWidth / 2 - 2, startY);
    for (let y = startY; y <= endY; y += 8) {
      const m = Math.sin(y * 0.04) * 6;
      ctx.lineTo(creekBaseX + shift + m - creekWidth / 2 - 2, y);
    }
    for (let y = endY; y >= startY; y -= 8) {
      const m = Math.sin(y * 0.04) * 6;
      ctx.lineTo(creekBaseX + shift + m + creekWidth / 2 + 2, y);
    }
    ctx.closePath();
    ctx.fill();

    // 2. Dasar batu kerikil sungai (Gravel bed)
    ctx.fillStyle = '#44403c';
    ctx.beginPath();
    ctx.moveTo(creekBaseX + shift - creekWidth / 2 + 2, startY);
    for (let y = startY; y <= endY; y += 8) {
      const m = Math.sin(y * 0.04) * 6;
      ctx.lineTo(creekBaseX + shift + m - creekWidth / 2 + 2, y);
    }
    for (let y = endY; y >= startY; y -= 8) {
      const m = Math.sin(y * 0.04) * 6;
      ctx.lineTo(creekBaseX + shift + m + creekWidth / 2 - 2, y);
    }
    ctx.closePath();
    ctx.fill();

    // 3. Aliran air jernih musiman di tengah (Stream water)
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.moveTo(creekBaseX + shift - 3, startY);
    for (let y = startY; y <= endY; y += 8) {
      const m = Math.sin(y * 0.04) * 6;
      ctx.lineTo(creekBaseX + shift + m - 3, y);
    }
    for (let y = endY; y >= startY; y -= 8) {
      const m = Math.sin(y * 0.04) * 6;
      ctx.lineTo(creekBaseX + shift + m + 3, y);
    }
    ctx.closePath();
    ctx.fill();

    // 4. Kilau air biru muda beranimasi
    ctx.fillStyle = '#38bdf8';
    for (let y = startY + 6; y < endY - 6; y += 22) {
      const m = Math.sin(y * 0.04) * 6;
      ctx.fillRect(creekBaseX + shift + m - 1, y + Math.sin(frame * 0.06 + y) * 2, 2, 5);
    }
  };

  const creekNorthEndY = getFaultBaseY(creekBaseX + shiftNorth) - getHalfGap(creekBaseX + shiftNorth);
  const creekSouthStartY = getFaultBaseY(creekBaseX + shiftSouth) + getHalfGap(creekBaseX + shiftSouth);

  // Saluran Utara Wallace Creek
  drawStreamChannel(0, creekNorthEndY, shiftNorth);
  // Saluran Selatan Wallace Creek
  drawStreamChannel(creekSouthStartY, h, shiftSouth);

  // Alur sesar penghubung sungai yang tergeser (Sheared channel along fault)
  if (shiftP > 0.02) {
    const northCX = creekBaseX + shiftNorth + Math.sin(creekNorthEndY * 0.04) * 6;
    const southCX = creekBaseX + shiftSouth + Math.sin(creekSouthStartY * 0.04) * 6;
    const minX = Math.min(northCX, southCX) - creekWidth / 2;
    const maxX = Math.max(northCX, southCX) + creekWidth / 2;
    const midY = (creekNorthEndY + creekSouthStartY) / 2;

    // Celah kering sungai terseret di sepanjang bidang sesar
    ctx.fillStyle = '#44403c';
    ctx.fillRect(minX - 2, midY - 6, maxX - minX + 4, 12);
    ctx.fillStyle = '#292524';
    ctx.fillRect(minX + 2, midY - 3, maxX - minX - 4, 6);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(minX + 4, midY - 1.5, maxX - minX - 8, 3);
  }

  // ══════════════════════════════════════════════════════════════════════
  // LAYER 3: JALAN RAYA ASPAL GURUN (OFFSET HIGHWAY)
  // - Saat tanah utuh (p < 0.18): Jalan aspal menyatu lurus tanpa retakan.
  // - Saat gempa (p >= 0.18): Retakan aspal merekah di garis sesar.
  // - Saat bergeser (p >= 0.38): Jalan terpotong dan bergeser ~22px kiri & kanan.
  // ══════════════════════════════════════════════════════════════════════
  const roadBaseX = 360;
  const roadWidth = 32;

  // Bagian Jalan Utara (Bergeser ke kiri bersama Lempeng Pasifik)
  const rNorthX = roadBaseX + shiftNorth;
  const roadNorthEndY = getFaultBaseY(rNorthX) - getHalfGap(rNorthX);
  ctx.fillStyle = '#262626';
  ctx.fillRect(rNorthX - roadWidth / 2, 0, roadWidth, roadNorthEndY);
  // Tekstur aspal halus
  ctx.fillStyle = '#1f1f1f';
  for (let ry = 8; ry < roadNorthEndY - 6; ry += 12) {
    ctx.fillRect(rNorthX - roadWidth / 2 + 4, ry, 6, 2);
    ctx.fillRect(rNorthX + 2, ry + 4, 7, 2);
  }
  // Garis bahu jalan putih solid
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(rNorthX - roadWidth / 2 + 1, 0, 2, roadNorthEndY);
  ctx.fillRect(rNorthX + roadWidth / 2 - 3, 0, 2, roadNorthEndY);
  // Marka kuning putus-putus
  ctx.fillStyle = '#f59e0b';
  for (let ry = 4; ry < roadNorthEndY - 10; ry += 20) {
    ctx.fillRect(rNorthX - 1, ry, 2, Math.min(10, roadNorthEndY - ry));
  }

  // Bagian Jalan Selatan (Bergeser ke kanan bersama Lempeng Amerika Utara)
  const rSouthX = roadBaseX + shiftSouth;
  const roadSouthStartY = getFaultBaseY(rSouthX) + getHalfGap(rSouthX);
  ctx.fillStyle = '#262626';
  ctx.fillRect(rSouthX - roadWidth / 2, roadSouthStartY, roadWidth, h - roadSouthStartY);
  ctx.fillStyle = '#1f1f1f';
  for (let ry = roadSouthStartY + 8; ry < h - 10; ry += 12) {
    ctx.fillRect(rSouthX - roadWidth / 2 + 4, ry, 6, 2);
    ctx.fillRect(rSouthX + 2, ry + 4, 7, 2);
  }
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(rSouthX - roadWidth / 2 + 1, roadSouthStartY, 2, h - roadSouthStartY);
  ctx.fillRect(rSouthX + roadWidth / 2 - 3, roadSouthStartY, 2, h - roadSouthStartY);
  ctx.fillStyle = '#f59e0b';
  for (let ry = roadSouthStartY + 10; ry < h - 10; ry += 20) {
    ctx.fillRect(rSouthX - 1, ry, 2, 10);
  }

  // Patahan aspal robek di titik potong sesar saat retakan / geser terjadi
  if (crackP > 0.05) {
    ctx.fillStyle = '#171717';
    ctx.fillRect(rNorthX - roadWidth / 2 - 2, roadNorthEndY - 4, roadWidth + 4, 4);
    ctx.fillRect(rSouthX - roadWidth / 2 - 2, roadSouthStartY, roadWidth + 4, 4);

    if (shiftP > 0.03) {
      // Kerikil aspal abu-abu berserakan di zona geser
      ctx.fillStyle = '#404040';
      ctx.fillRect(rNorthX - 6, roadNorthEndY - 5, 3, 2);
      ctx.fillRect(rNorthX + 6, roadNorthEndY - 4, 4, 2);
      ctx.fillRect(rSouthX - 6, roadSouthStartY + 3, 4, 2);
      ctx.fillRect(rSouthX + 8, roadSouthStartY + 4, 3, 2);
    }
  }

  // ══════════════════════════════════════════════════════════════════════
  // LAYER 4: BIDANG PATAHAN BERGERIGI, REKAHAN & BEKAS PATAHAN SESAR NYATA
  // - Hanya muncul saat gempa terjadi (crackP > 0)
  // - Mengikuti kontur berliku getFaultBaseY(x) (BUKAN garis lurus kaku)
  // - Menampilkan tebing patahan (fault scarps), goresan gesek (slickensides),
  //   dan puing-puing pecahan batuan (fault breccia) di sepanjang celah!
  // ══════════════════════════════════════════════════════════════════════
  if (crackP > 0) {
    ctx.save();

    // 4A. Jurang Rekahan Sesar Hitam Pekat (Fracture Void)
    ctx.beginPath();
    ctx.moveTo(0, getFaultBaseY(0) - getHalfGap(0));
    for (let x = 0; x <= w; x += 4) {
      ctx.lineTo(x, getFaultBaseY(x) - getHalfGap(x));
    }
    for (let x = w; x >= 0; x -= 4) {
      ctx.lineTo(x, getFaultBaseY(x) + getHalfGap(x));
    }
    ctx.closePath();
    ctx.fillStyle = '#09090b'; // Hitam pekat kedalaman patahan
    ctx.fill();

    // 4B. Bayangan Dinding Sesar Dalam (Subsurface Shadow)
    ctx.beginPath();
    ctx.moveTo(0, getFaultBaseY(0) - getHalfGap(0) + 1);
    for (let x = 0; x <= w; x += 4) {
      ctx.lineTo(x, getFaultBaseY(x) - getHalfGap(x) + 1);
    }
    for (let x = w; x >= 0; x -= 4) {
      ctx.lineTo(x, getFaultBaseY(x) + getHalfGap(x) - 1);
    }
    ctx.closePath();
    ctx.fillStyle = '#18181b';
    ctx.fill();

    // 4C. Bibir Sesar Atas Bergerigi (Jagged Fault Scarp Edge Highlight)
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(0, getFaultBaseY(0) - getHalfGap(0));
    for (let x = 0; x <= w; x += 4) {
      ctx.lineTo(x, getFaultBaseY(x) - getHalfGap(x));
    }
    ctx.stroke();

    // 4D. Tebing Sesar Bawah Berbayang Gelap (Southern Fault Scarp)
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(0, getFaultBaseY(0) + getHalfGap(0));
    for (let x = 0; x <= w; x += 4) {
      ctx.lineTo(x, getFaultBaseY(x) + getHalfGap(x));
    }
    ctx.stroke();

    // 4E. GORESAN SESAR MENDATAR (SLICKENSIDES STRIATIONS) PADA BEKAS PATAHAN
    // Garis-garis gores mendatar sejajar bidang sesar hasil gesekan antar-lempeng
    if (shiftP > 0.04) {
      ctx.lineWidth = 1.2;
      for (let x = 20; x < w; x += 36) {
        const fy = getFaultBaseY(x);
        const stLen = 8 + (Math.abs(Math.sin(x * 0.1)) * 14);
        ctx.strokeStyle = (Math.floor(x / 36) % 2 === 0) ? 'rgba(120, 53, 15, 0.75)' : 'rgba(28, 25, 23, 0.65)';
        ctx.beginPath();
        ctx.moveTo(x - stLen / 2, fy);
        ctx.lineTo(x + stLen / 2, fy);
        ctx.stroke();
      }
    }

    // 4F. PUING & PECAHAN BATUAN PATAHAN (FAULT BRECCIA & GOUGE)
    // Serpihan dan kerikil batuan hancur yang berserakan di sepanjang celah patahan bergerigi
    for (let i = 0; i < 48; i++) {
      const seedX = (i * 73 + 17) % (w - 40) + 20;
      const fy = getFaultBaseY(seedX);
      const bShift = (i % 2 === 0 ? shiftNorth : shiftSouth) * 0.4;
      const bx = seedX + bShift;
      const by = fy + (Math.sin(i * 1.7) * (getHalfGap(seedX) + 2));
      const bSize = 2 + (i % 3);

      ctx.fillStyle = i % 3 === 0 ? '#44403c' : (i % 2 === 0 ? '#78716c' : '#78350f');
      ctx.fillRect(bx, by, bSize, bSize);
      if (i % 4 === 0) {
        ctx.fillStyle = '#fde047';
        ctx.fillRect(bx, by - 1, 1.5, 1);
      }
    }

    ctx.restore();
  }

  // ══════════════════════════════════════════════════════════════════════
  // LAYER 5: RETAKAN TANAH SEISMIK BERCABANG (JAGGED BRANCHING EARTHQUAKE RUPTURES)
  // - Hanya muncul saat gempa terjadi (crackP > 0)
  // - Merambat memanjang dinamis seiring intensitas gempa (crackP)
  // ══════════════════════════════════════════════════════════════════════
  if (crackP > 0.05) {
    ctx.save();
    const faultSeeds = [
      { x: 30, len: 26, angle1: -0.6, angle2: -0.9, branch: true },
      { x: 75, len: 18, angle1: 0.4, angle2: 0.7, branch: false },
      { x: 120, len: 32, angle1: -0.8, angle2: -0.4, branch: true },
      { x: 170, len: 22, angle1: 0.5, angle2: 0.2, branch: false },
      { x: 215, len: 38, angle1: -0.7, angle2: -1.0, branch: true },
      { x: 270, len: 20, angle1: 0.3, angle2: 0.8, branch: false },
      { x: 310, len: 30, angle1: -0.5, angle2: -0.8, branch: true },
      { x: 420, len: 36, angle1: 0.6, angle2: 0.3, branch: true },
      { x: 470, len: 24, angle1: -0.7, angle2: -0.4, branch: false },
      { x: 520, len: 40, angle1: -0.4, angle2: -0.9, branch: true },
      { x: 580, len: 22, angle1: 0.7, angle2: 0.5, branch: false },
      { x: 630, len: 34, angle1: -0.6, angle2: -0.8, branch: true },
      { x: 680, len: 28, angle1: 0.4, angle2: 0.7, branch: true },
      { x: 800, len: 32, angle1: -0.7, angle2: -0.5, branch: true },
      { x: 855, len: 20, angle1: 0.5, angle2: 0.8, branch: false },
      { x: 910, len: 38, angle1: -0.5, angle2: -0.9, branch: true },
      { x: 970, len: 24, angle1: 0.3, angle2: 0.6, branch: false },
      { x: 1020, len: 35, angle1: -0.8, angle2: -0.6, branch: true },
      { x: 1080, len: 22, angle1: 0.6, angle2: 0.9, branch: false },
      { x: 1140, len: 42, angle1: -0.4, angle2: -0.8, branch: true },
      { x: 1200, len: 26, angle1: 0.5, angle2: 0.3, branch: true },
      { x: 1260, len: 34, angle1: -0.7, angle2: -0.5, branch: false },
      { x: 1320, len: 28, angle1: 0.4, angle2: 0.8, branch: true },
      { x: 1380, len: 36, angle1: -0.6, angle2: -0.9, branch: true },
      { x: 1440, len: 22, angle1: 0.5, angle2: 0.4, branch: false },
    ];

    for (const f of faultSeeds) {
      const curLen = f.len * crackP;

      // 1. Retakan ke arah Lempeng Utara
      const startX = f.x + shiftNorth * 0.3;
      const startY = getFaultBaseY(startX) - getHalfGap(startX);
      const midX = startX + Math.sin(f.angle1) * (curLen * 0.55);
      const midY = startY - Math.cos(f.angle1) * (curLen * 0.55);
      const endX = midX + Math.sin(f.angle2) * (curLen * 0.45);
      const endY = midY - Math.cos(f.angle2) * (curLen * 0.45);

      ctx.strokeStyle = '#18181b';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(midX, midY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(startX + 1, startY);
      ctx.lineTo(midX + 1, midY);
      ctx.lineTo(endX + 1, endY);
      ctx.stroke();

      if (f.branch && crackP > 0.4) {
        const bEndX = midX + Math.sin(f.angle1 + 0.75) * (curLen * 0.35);
        const bEndY = midY - Math.cos(f.angle1 + 0.75) * (curLen * 0.35);
        ctx.strokeStyle = '#18181b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(midX, midY);
        ctx.lineTo(bEndX, bEndY);
        ctx.stroke();
      }

      // 2. Retakan ke arah Lempeng Selatan
      const sStartX = f.x + 18 + shiftSouth * 0.3;
      const sStartY = getFaultBaseY(sStartX) + getHalfGap(sStartX);
      const sMidX = sStartX + Math.sin(f.angle2) * (curLen * 0.5);
      const sMidY = sStartY + Math.cos(f.angle2) * (curLen * 0.5);
      const sEndX = sMidX + Math.sin(f.angle1) * (curLen * 0.5);
      const sEndY = sMidY + Math.cos(f.angle1) * (curLen * 0.5);

      ctx.strokeStyle = '#18181b';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(sStartX, sStartY);
      ctx.lineTo(sMidX, sMidY);
      ctx.lineTo(sEndX, sEndY);
      ctx.stroke();

      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(sStartX + 1, sStartY);
      ctx.lineTo(sMidX + 1, sMidY);
      ctx.lineTo(sEndX + 1, sEndY);
      ctx.stroke();

      if (f.branch && crackP > 0.4) {
        const sbEndX = sMidX - Math.sin(f.angle2 - 0.7) * (curLen * 0.32);
        const sbEndY = sMidY + Math.cos(f.angle2 - 0.7) * (curLen * 0.32);
        ctx.strokeStyle = '#18181b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(sMidX, sMidY);
        ctx.lineTo(sbEndX, sbEndY);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  // ══════════════════════════════════════════════════════════════════════
  // LAYER 6: INDIKATOR TEKTONIK & PANAH PERGERAKAN LEMPENG (OVERHEAD PLATES)
  // ══════════════════════════════════════════════════════════════════════
  ctx.save();
  // Spanduk & Panah Lempeng Pasifik (Bergerak ke Barat Laut / Kiri)
  const indNorthX = 1120 + shiftNorth * 0.3;
  const indNorthY = 120;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fillRect(indNorthX - 130, indNorthY - 14, 260, 28);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(indNorthX - 130, indNorthY - 14, 260, 28);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 9px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('LEMPENG PASIFIK (BARAT LAUT)', indNorthX, indNorthY - 1);
  ctx.fillStyle = '#bae6fd';
  ctx.font = '8px monospace';
  ctx.fillText('Kecepatan Geser: ~5 cm/tahun', indNorthX, indNorthY + 9);

  // Spanduk & Panah Lempeng Amerika Utara (Bergerak ke Tenggara / Kanan)
  const indSouthX = 1120 + shiftSouth * 0.3;
  const indSouthY = 360;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fillRect(indSouthX - 130, indSouthY - 14, 260, 28);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(indSouthX - 130, indSouthY - 14, 260, 28);

  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 9px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('LEMPENG AMERIKA UTARA (TENGGARA)', indSouthX, indSouthY - 1);
  ctx.fillStyle = '#fef08a';
  ctx.font = '8px monospace';
  ctx.fillText('Kecepatan Geser: ~5 cm/tahun', indSouthX, indSouthY + 9);
  ctx.restore();

  // ══════════════════════════════════════════════════════════════════════
  // LAYER 7: VEGETASI GURUN & BATUAN DARI ATAS (TOP-DOWN JOSHUA TREES & BOULDERS)
  // ══════════════════════════════════════════════════════════════════════
  const desertFoliage = [
    { x: 180, y: 80, isNorth: true, type: 'tree' },
    { x: 540, y: 150, isNorth: true, type: 'bush' },
    { x: 920, y: 70, isNorth: true, type: 'boulder' },
    { x: 1350, y: 140, isNorth: true, type: 'bush' },
    { x: 220, y: 340, isNorth: false, type: 'bush' },
    { x: 620, y: 400, isNorth: false, type: 'tree' },
    { x: 980, y: 310, isNorth: false, type: 'boulder' },
    { x: 1420, y: 380, isNorth: false, type: 'tree' },
  ];

  for (const obj of desertFoliage) {
    const shift = obj.isNorth ? shiftNorth : shiftSouth;
    const ox = obj.x + shift;
    const oy = obj.y;

    if (obj.type === 'tree') {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
      ctx.beginPath();
      ctx.arc(ox + 5, oy + 5, 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#365314'; // Hijau zaitun gelap
      ctx.beginPath();
      ctx.arc(ox, oy, 11, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#4d7c0f'; // Hijau semak terang
      ctx.beginPath();
      ctx.arc(ox - 2, oy - 2, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#a16207'; // Batang pusat
      ctx.fillRect(ox - 2, oy - 2, 4, 4);
    } else if (obj.type === 'bush') {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
      ctx.beginPath();
      ctx.arc(ox + 3, oy + 3, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#65a30d';
      ctx.beginPath();
      ctx.arc(ox, oy, 6, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
      ctx.fillRect(ox + 2, oy + 2, 14, 10);

      ctx.fillStyle = '#57534e';
      ctx.fillRect(ox - 2, oy - 2, 14, 10);
      ctx.fillStyle = '#78716c';
      ctx.fillRect(ox - 2, oy - 2, 14, 3);
      ctx.fillStyle = '#a8a29e';
      ctx.fillRect(ox - 1, oy - 1, 4, 2);
    }
  }
}

// ── BACKWARDS COMPATIBILITY TILE DRAWING ──
