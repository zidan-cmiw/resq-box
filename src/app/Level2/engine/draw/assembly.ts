// ── engine/draw/assembly.ts ───────────────────────────────────────────────
// Lapangan sekolah pascabencana (Area 3): lantai rumput, suasana sekitar,
// pintu belakang, dan gerbang keluar.
//
// Dipisahkan dari renderer.ts (Langkah 3 dari pemecahan berkas).
//
// Blok ini terbukti MANDIRI: satu-satunya ketergantungannya adalah
// drawRoundedBadgeL2 dari ./base. Tidak memanggil fungsi tema lain, dan tidak
// memerlukan tipe dari ../gameEngine.
//
// ATURAN: hanya boleh mengimpor dari ./base.

import { drawRoundedBadgeL2 } from './base';

// 3. ATMOSPHERE: LAPANGAN SEKOLAH PASCABENCANA (AREA 3)
// ══════════════════════════════════════════════════════════════════════════

// A. LANTAI LAPANGAN HIJAU TERBUKA PASCABENCANA (AREA 3 FLOOR)
export function drawAssemblyFieldGrassFloor(
  ctx: CanvasRenderingContext2D,
  camX: number,
  viewW: number
): void {
  const floorY = 360;
  const floorH = 120;

  // 1. Dasar Rumput Lapangan Hijau Sejuk (Lush Green Grass Gradient)
  const grassGrad = ctx.createLinearGradient(0, floorY, 0, floorY + floorH);
  grassGrad.addColorStop(0, '#16a34a'); // Hijau cerah atas
  grassGrad.addColorStop(0.3, '#15803d');
  grassGrad.addColorStop(0.7, '#166534');
  grassGrad.addColorStop(1, '#14532d'); // Hijau gelap dasar
  ctx.fillStyle = grassGrad;
  ctx.fillRect(camX, floorY, viewW, floorH);

  // 2. Garis Pembatas Trotoar / Tepi Paving Gedung Sekolah (y: 356 - 360)
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(camX, floorY - 4, viewW, 4);
  ctx.fillStyle = '#475569';
  ctx.fillRect(camX, floorY - 4, viewW, 1);
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(camX, floorY, viewW, 2); // Highlight rumput paling atas

  // 3. Tekstur Rerumputan & Bintik Lapangan Terbuka Alami (Statis Sempurna, Tidak Berubah Saat Berjalan)
  const stepX = 28;
  const startX = Math.floor(camX / stepX) * stepX - stepX * 2;
  const endX = camX + viewW + stepX * 2;

  for (let px = startX; px < endX; px += stepX) {
    // Koordinat X selalu tetap di dunia (kelipatan stepX), tidak bergeser saat kamera bergerak
    const hash1 = Math.abs(Math.sin(px * 12.9898) * 43758.5453);
    const fract1 = hash1 - Math.floor(hash1);
    const randY = floorY + 10 + Math.floor(fract1 * (floorH - 28));

    const hash2 = Math.abs(Math.sin(px * 78.233) * 43758.5453);
    const fract2 = hash2 - Math.floor(hash2);

    ctx.fillStyle = fract2 > 0.45 ? '#4ade80' : '#22c55e';
    ctx.fillRect(px, randY, 2, 4);
    ctx.fillRect(px + 2, randY - 2, 2, 6);
    ctx.fillRect(px + 4, randY + 1, 2, 3);
  }

  // 4. Lapisan Bawah Tanah Subur Lapangan (y: 462 - 480)
  const groundSubGrad = ctx.createLinearGradient(0, 462, 0, 480);
  groundSubGrad.addColorStop(0, '#14532d');
  groundSubGrad.addColorStop(1, '#052e16');
  ctx.fillStyle = groundSubGrad;
  ctx.fillRect(camX, 462, viewW, 18);
  ctx.fillStyle = '#15803d';
  ctx.fillRect(camX, 462, viewW, 2);
}

// B. ATMOSFER LAPANGAN SEKOLAH TERBUKA PASCABENCANA (AREA 3 SKY & PROPS)
export function drawAssemblyFieldAtmosphere(
  ctx: CanvasRenderingContext2D,
  camX: number,
  viewW: number,
  _viewH: number,
  animTick: number
): void {
  // 1. Langit Terbuka Siang Hari Pasca Gempa (Sky Gradient)
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 260);
  skyGrad.addColorStop(0, '#38bdf8'); // Biru langit cerah
  skyGrad.addColorStop(0.5, '#7dd3fc');
  skyGrad.addColorStop(0.85, '#bae6fd');
  skyGrad.addColorStop(1, '#e2e8f0'); // Kabut debu tipis di cakrawala
  ctx.fillStyle = skyGrad;
  ctx.fillRect(camX, 0, viewW, 260);

  // Awan Mengambang Halus di Langit (Stylized Pixel Clouds)
  const cloudOffsets = [40, 380, 820, 1260, 1720, 2100];
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  for (const cx of cloudOffsets) {
    const driftX = (cx + animTick * 0.15) % 2400;
    if (driftX + 120 > camX && driftX - 40 < camX + viewW) {
      ctx.beginPath();
      ctx.arc(driftX, 48, 16, 0, Math.PI * 2);
      ctx.arc(driftX + 20, 42, 22, 0, Math.PI * 2);
      ctx.arc(driftX + 46, 46, 18, 0, Math.PI * 2);
      ctx.arc(driftX + 66, 52, 12, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 2. Siluet Gedung Sekolah di Latar Belakang (y: 110 - 360)
  // Menampilkan bangunan kelas 2 lantai dari mana siswa baru saja dievakuasi
  const bldgGrad = ctx.createLinearGradient(0, 110, 0, 360);
  bldgGrad.addColorStop(0, '#f1f5f9');
  bldgGrad.addColorStop(1, '#cbd5e1');
  ctx.fillStyle = bldgGrad;
  ctx.fillRect(camX, 120, viewW, 240);

  // Atap Genteng Merah Bata Sekolah (Terracotta Roof)
  ctx.fillStyle = '#991b1b';
  ctx.fillRect(camX, 105, viewW, 16);
  ctx.fillStyle = '#b91c1c';
  ctx.fillRect(camX, 105, viewW, 4);
  ctx.fillStyle = '#450a0a';
  ctx.fillRect(camX, 120, viewW, 2);

  // Deretan Jendela Kelas Lantai 2 & Lantai 1 (setiap 60px)
  const winOff = ((camX % 60) + 60) % 60;
  for (let wx = camX - winOff; wx < camX + viewW + 60; wx += 60) {
    // Jendela Lantai 2
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(wx + 8, 140, 36, 48);
    ctx.fillStyle = '#60a5fa';
    ctx.fillRect(wx + 10, 142, 15, 20);
    ctx.fillRect(wx + 27, 142, 15, 20);
    ctx.fillRect(wx + 10, 165, 15, 20);
    ctx.fillRect(wx + 27, 165, 15, 20);

    // Lis Pembatas Lantai 2 dan Lantai 1
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(camX, 204, viewW, 8);

    // Jendela Lantai 1
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(wx + 8, 224, 36, 48);
    ctx.fillStyle = '#93c5fd';
    ctx.fillRect(wx + 10, 226, 15, 20);
    ctx.fillRect(wx + 27, 226, 15, 20);
    ctx.fillRect(wx + 10, 249, 15, 20);
    ctx.fillRect(wx + 27, 249, 15, 20);
  }

  // 3. Efek Kerusakan Gempa di Dinding Luar Gedung (Retakan Kecil di Bagian Atas Dinding)
  const crackPoints = [420, 800, 1200, 1680];
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1.2;
  for (const cpx of crackPoints) {
    if (cpx + 40 > camX && cpx - 40 < camX + viewW) {
      ctx.beginPath();
      ctx.moveTo(cpx, 114);
      ctx.lineTo(cpx + 6, 128);
      ctx.lineTo(cpx + 2, 140);
      ctx.lineTo(cpx + 7, 150);
      ctx.stroke();
    }
  }

  // 4. Pos Utilitas & Panel Listrik Darurat Pak Hendra (x: 290 - 350)
  if (camX < 380 && camX + viewW > 260) {
    ctx.save();
    // Tiang/Boks Panel Listrik
    ctx.fillStyle = '#475569';
    ctx.fillRect(300, 260, 36, 100);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(303, 263, 30, 48);

    // Indikator Listrik Padam [OFF]
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(308, 270, 26, 16);
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 6px monospace';
    ctx.fillText('[OFF]', 310, 281);

    // Tabung APAR Merah (Alat Pemadam Api Ringan)
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(344, 300, 10, 26);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(346, 308, 6, 6);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(347, 296, 4, 4); // Nozzle
    ctx.restore();
  }

  // 5. POSKO TENDA MEDIS PMI & TRIAGE LAPANGAN (x: 880 - 1080)
  if (camX < 1120 && camX + viewW > 840) {
    ctx.save();
    const tentX = 940;
    const tentY = 210;

    // Kanopi Tenda Segitiga PMI Putih Bersih
    ctx.beginPath();
    ctx.moveTo(tentX, tentY);
    ctx.lineTo(tentX - 80, 360);
    ctx.lineTo(tentX + 80, 360);
    ctx.closePath();
    ctx.fillStyle = '#f8fafc';
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Sisi samping tenda (bayangan abu-abu lembut)
    ctx.beginPath();
    ctx.moveTo(tentX, tentY);
    ctx.lineTo(tentX + 80, 360);
    ctx.lineTo(tentX + 115, 360);
    ctx.lineTo(tentX + 35, tentY + 15);
    ctx.closePath();
    ctx.fillStyle = '#e2e8f0';
    ctx.fill();

    // Logo Palang Merah (PMI Red Cross) Besar di Tengah Tenda
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(tentX - 4, tentY + 45, 8, 26);
    ctx.fillRect(tentX - 13, tentY + 54, 26, 8);

    // Spanduk Posko Medis
    drawRoundedBadgeL2(ctx, tentX - 60, tentY + 78, 120, 20, 4, '#ffffff', '#ef4444', 1.5);
    ctx.fillStyle = '#b91c1c';
    ctx.font = '900 9.5px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('POSKO MEDIS PMI', tentX, tentY + 88);

    // ── VELBED MEDIS & PASIEN YANG SEDANG DIRAWAT ──
    const bedX = tentX - 64;
    const bedY = 335;
    const bedW = 46;

    // Kaki-kaki Velbed (Rangka Besi Hijau Medis)
    ctx.fillStyle = '#166534';
    ctx.fillRect(bedX + 2, bedY + 5, 4, 20);
    ctx.fillRect(bedX + bedW - 6, bedY + 5, 4, 20);
    // Palang Rangka
    ctx.fillStyle = '#15803d';
    ctx.fillRect(bedX, bedY, bedW, 6);

    // Kasur / Matras Busa Medis
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(bedX + 2, bedY - 3, bedW - 4, 4);

    // Bantal Putih Empuk di Bawah Kepala Pasien
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(bedX + 3, bedY - 9, 13, 7);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(bedX + 4, bedY - 3, 11, 1);

    // ── KARAKTER PASIEN KORBAN GEMPA YANG SEDANG DIRAWAT ──
    // Efek Nafas Halus Dada Pasien
    const patientBreath = Math.sin(animTick * 0.08) * 0.8;

    // Rambut Pasien (Cokelat/Hitam di Belakang Kepala)
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(bedX + 4, bedY - 14, 8, 8);

    // Wajah Pasien (Kulit Sawo Matang Peach)
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(bedX + 6, bedY - 12, 8, 7);

    // Mata Terpejam Tenang (Tertidur Istirahat)
    ctx.fillStyle = '#44403c';
    ctx.fillRect(bedX + 10, bedY - 9, 3, 1);

    // Perban / Kompres Putih di Dahi Pasien
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(bedX + 6, bedY - 14, 8, 3);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(bedX + 9, bedY - 14, 2, 3); // Palang merah kecil di perban

    // Selimut Rumah Sakit Hijau Toska Menutupi Tubuh Pasien
    const blanketY = bedY - 6 - patientBreath;
    ctx.fillStyle = '#86efac'; // Hijau muda toska selimut
    ctx.fillRect(bedX + 14, blanketY, bedW - 16, 10 + patientBreath);
    // Lipatan Putih Selimut di Bagian Atas Dada
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(bedX + 13, blanketY - 2, 6, 3);
    // Tekstur Lipatan Selimut Lembut
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(bedX + 22, blanketY + 3, bedW - 26, 1.5);
    ctx.fillRect(bedX + 26, blanketY + 6, bedW - 32, 1.5);

    // Lengan Pasien di Luar Selimut (Terhubung ke Tiang Infus)
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(bedX + 7, bedY - 5, 8, 3); // Lengan tangan
    // Perban di Pergelangan Tangan Pasien Tempat Jarum Infus Masuk
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(bedX + 5, bedY - 6, 3, 4);

    // Papan Catatan Rekam Medis (Medical Chart) Menggantung di Kaki Ranjang
    ctx.fillStyle = '#92400e';
    ctx.fillRect(bedX + bedW - 3, bedY + 2, 6, 8);
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(bedX + bedW - 2, bedY + 3, 4, 6);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(bedX + bedW - 1, bedY + 5, 2, 1);

    // Kotak Obat P3K Putih dengan Palang Merah
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(tentX + 35, 340, 16, 14);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(tentX + 41, 343, 4, 8);
    ctx.fillRect(tentX + 39, 345, 8, 4);

    // ── TIANG INFUS DENGAN SELANG KE TANGAN PASIEN ──
    const ivPoleX = tentX - 72;
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(ivPoleX, 298);
    ctx.lineTo(ivPoleX, 360);
    // Kaki Tripod Tiang Infus
    ctx.moveTo(ivPoleX - 6, 360);
    ctx.lineTo(ivPoleX + 6, 360);
    ctx.stroke();

    // Gantungan & Kantung Cairan Infus (Transparan Kebiruan Berpendar)
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(ivPoleX - 4, 302, 8, 14);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(ivPoleX - 2, 304, 2, 6); // Highlight kilau kaca/plastik
    // Tutup / Nozzle Infus
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(ivPoleX - 2, 316, 4, 2);

    // Selang Infus Lentur Melengkung dari Kantung ke Tangan Pasien
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(ivPoleX, 318);
    ctx.quadraticCurveTo(ivPoleX + 4, 335, bedX + 5, bedY - 4);
    ctx.stroke();

    // Tetesan Cairan Infus Bergerak Perlahan Turun
    const dripOffset = ((animTick * 0.4) % 10) / 10;
    const dripY = 308 + dripOffset * 7;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(ivPoleX - 1, dripY, 2, 2);

    ctx.restore();
  }

  // 6. TIANG BENDERA MERAH PUTIH INDONESIA (x: 1380)
  if (camX < 1440 && camX + viewW > 1320) {
    ctx.save();
    const poleX = 1380;
    // Pondasi Tiang Bendera Beton 3 Tingkat
    ctx.fillStyle = '#475569';
    ctx.fillRect(poleX - 24, 350, 48, 10);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(poleX - 16, 344, 32, 6);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(poleX - 8, 340, 16, 4);

    // Tiang Stainless Steel Tinggi (y: 80 - 340)
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(poleX - 2, 80, 4, 260);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(poleX - 1, 80, 2, 260); // Highlight kilau

    // Puncak Tiang Emas
    ctx.beginPath();
    ctx.arc(poleX, 78, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#fbbf24';
    ctx.fill();

    // Bendera Merah Putih Berkibar Dinamis
    const flagW = 46;
    const flagH = 28;
    const wave = Math.sin(animTick * 0.08) * 3;

    // Warna Merah
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(poleX + 2, 84);
    ctx.quadraticCurveTo(poleX + flagW / 2, 84 + wave, poleX + flagW, 84 - wave);
    ctx.lineTo(poleX + flagW, 84 + flagH / 2 - wave);
    ctx.quadraticCurveTo(poleX + flagW / 2, 84 + flagH / 2 + wave, poleX + 2, 84 + flagH / 2);
    ctx.closePath();
    ctx.fill();

    // Warna Putih
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(poleX + 2, 84 + flagH / 2);
    ctx.quadraticCurveTo(poleX + flagW / 2, 84 + flagH / 2 + wave, poleX + flagW, 84 + flagH / 2 - wave);
    ctx.lineTo(poleX + flagW, 84 + flagH - wave);
    ctx.quadraticCurveTo(poleX + flagW / 2, 84 + flagH + wave, poleX + 2, 84 + flagH);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // 7. RAMBU TITIK KUMPUL RESMI BNPB / ISO 7010 (SESUAI SS GAMBAR 3)
  if (camX < 1550 && camX + viewW > 1410) {
    ctx.save();
    const signX = 1480;
    const signW = 66;
    const signH = 80;
    const signTopY = 135;

    // Tiang Rambu Baja Kuat
    ctx.fillStyle = '#475569';
    ctx.fillRect(signX - 3.5, signTopY + signH, 7, 360 - (signTopY + signH));
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(signX - 1.5, signTopY + signH, 2, 360 - (signTopY + signH)); // Kilau tiang

    // Latar Papan Rambu Hijau Tua BNPB (#14532d)
    ctx.fillStyle = '#14532d';
    ctx.fillRect(signX - signW / 2, signTopY, signW, signH);

    // Bingkai Putih Tepi Rambu (Inset Border)
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(signX - signW / 2 + 3, signTopY + 3, signW - 6, signH - 6);

    // ── 4 PANAH PUTIH MENUNJUK KE TITIK TENGAH (SESUAI SS GAMBAR 3) ──
    ctx.fillStyle = '#ffffff';

    // 1. Panah Pojok Kiri Atas (Menunjuk ke Tengah Bawah-Kanan)
    ctx.beginPath();
    ctx.moveTo(signX - signW / 2 + 6, signTopY + 6);
    ctx.lineTo(signX - signW / 2 + 14, signTopY + 6);
    ctx.lineTo(signX - signW / 2 + 6, signTopY + 14);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(signX - signW / 2 + 11, signTopY + 11);
    ctx.lineTo(signX - signW / 2 + 17, signTopY + 17);
    ctx.lineTo(signX - signW / 2 + 14, signTopY + 19);
    ctx.lineTo(signX - signW / 2 + 8, signTopY + 13);
    ctx.closePath();
    ctx.fill();

    // 2. Panah Pojok Kanan Atas (Menunjuk ke Tengah Bawah-Kiri)
    ctx.beginPath();
    ctx.moveTo(signX + signW / 2 - 6, signTopY + 6);
    ctx.lineTo(signX + signW / 2 - 14, signTopY + 6);
    ctx.lineTo(signX + signW / 2 - 6, signTopY + 14);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(signX + signW / 2 - 11, signTopY + 11);
    ctx.lineTo(signX + signW / 2 - 17, signTopY + 17);
    ctx.lineTo(signX + signW / 2 - 14, signTopY + 19);
    ctx.lineTo(signX + signW / 2 - 8, signTopY + 13);
    ctx.closePath();
    ctx.fill();

    // 3. Panah Pojok Kiri Bawah (Di Atas Teks)
    ctx.beginPath();
    ctx.moveTo(signX - signW / 2 + 6, signTopY + 54);
    ctx.lineTo(signX - signW / 2 + 14, signTopY + 54);
    ctx.lineTo(signX - signW / 2 + 6, signTopY + 46);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(signX - signW / 2 + 11, signTopY + 49);
    ctx.lineTo(signX - signW / 2 + 17, signTopY + 43);
    ctx.lineTo(signX - signW / 2 + 14, signTopY + 41);
    ctx.lineTo(signX - signW / 2 + 8, signTopY + 47);
    ctx.closePath();
    ctx.fill();

    // 4. Panah Pojok Kanan Bawah (Di Atas Teks)
    ctx.beginPath();
    ctx.moveTo(signX + signW / 2 - 6, signTopY + 54);
    ctx.lineTo(signX + signW / 2 - 14, signTopY + 54);
    ctx.lineTo(signX + signW / 2 - 6, signTopY + 46);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(signX + signW / 2 - 11, signTopY + 49);
    ctx.lineTo(signX + signW / 2 - 17, signTopY + 43);
    ctx.lineTo(signX + signW / 2 - 14, signTopY + 41);
    ctx.lineTo(signX + signW / 2 - 8, signTopY + 47);
    ctx.closePath();
    ctx.fill();

    // ── 4 SILUET ORANG DI TENGAH (1 DEPAN, 3 BELAKANG SESUAI SS GAMBAR 3) ──
    // Kepala Belakang Atas
    ctx.beginPath();
    ctx.arc(signX, signTopY + 19, 4, 0, Math.PI * 2);
    ctx.fill();

    // Kepala Belakang Kiri
    ctx.beginPath();
    ctx.arc(signX - 9, signTopY + 25, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(signX - 14, signTopY + 29, 10, 14);

    // Kepala Belakang Kanan
    ctx.beginPath();
    ctx.arc(signX + 9, signTopY + 25, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(signX + 4, signTopY + 29, 10, 14);

    // Badan Belakang Atas
    ctx.fillRect(signX - 5, signTopY + 23, 10, 14);

    // Figur Orang Utama di Depan (Kepala & Badan Lengkap dengan Garis Pemisah)
    ctx.beginPath();
    ctx.arc(signX, signTopY + 31, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Lengan & Tubuh Depan
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(signX - 7, signTopY + 36, 14, 17);
    // Garis leher/pemisah lengan gelap tipis
    ctx.fillStyle = '#14532d';
    ctx.fillRect(signX - 4, signTopY + 40, 2, 13);
    ctx.fillRect(signX + 2, signTopY + 40, 2, 13);

    // ── TEKS BOLD BESAR: TITIK KUMPUL (PERSIS GAMBAR 3) ──
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = '900 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('TITIK', signX, signTopY + 62);
    ctx.font = '900 10.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('KUMPUL', signX, signTopY + 73);

    ctx.restore();
  }

  // 8. TENDA KOMANDO KEPALA SEKOLAH & PRESENSI GURU (x: 1560 - 1700)
  if (camX < 1740 && camX + viewW > 1520) {
    ctx.save();
    const cTentX = 1620;
    // Tenda Kanopi Biru-Oranye
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(cTentX - 50, 240, 100, 16);
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(cTentX - 50, 256, 100, 6);

    // Tiang Penyangga Tenda
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(cTentX - 48, 262, 4, 98);
    ctx.fillRect(cTentX + 44, 262, 4, 98);

    // Meja Presensi & Koordinasi
    ctx.fillStyle = '#78350f';
    ctx.fillRect(cTentX - 32, 324, 64, 8);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(cTentX - 28, 332, 4, 28);
    ctx.fillRect(cTentX + 24, 332, 4, 28);

    // Megaphone / Pengeras Suara TOA Putih-Merah di Meja
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(cTentX - 18, 314, 12, 8);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(cTentX - 6, 312, 6, 12);

    // Papan Catatan Presensi Siswa (Clipboard)
    ctx.fillStyle = '#d97706';
    ctx.fillRect(cTentX + 6, 312, 14, 12);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cTentX + 8, 314, 10, 8);

    // Spanduk Posko Komando
    drawRoundedBadgeL2(ctx, cTentX - 48, 266, 96, 18, 4, '#0f172a', '#38bdf8', 1);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 8.5px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('POSKO PRESENSI', cTentX, 275);

    ctx.restore();
  }

  // 9. AMBULANS TRANSIT EVAKUASI (DI SEBELAH KIRI PINTU KELUAR, x: 1840)
  if (camX + viewW > 1750 && camX < 1960) {
    ctx.save();
    const ambX = 1840;
    const ambY = 281; // Posisi vertikal presisi agar roda napak tanah sempurna di y = 360

    // 1. Bayangan Kontak Tanah (Ground Contact Shadow di Bawah Roda)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
    ctx.fillRect(ambX - 60, 358, 142, 2.5);
    ctx.fillRect(ambX - 38, 359, 20, 2);
    ctx.fillRect(ambX + 36, 359, 20, 2);

    // 2. Bumper Baja Depan & Belakang
    ctx.fillStyle = '#475569';
    ctx.fillRect(ambX - 60, ambY + 46, 4, 18); // Bumper belakang
    ctx.fillRect(ambX + 74, ambY + 46, 5, 18); // Bumper depan

    // 3. Bodi Utama Ambulans Putih Bersih (Kotak Kabin Pasien Belakang)
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(ambX - 56, ambY, 104, 64);
    // Moncong Depan Kap Mesin & Grille (Menghadap Kanan)
    ctx.fillRect(ambX + 48, ambY + 22, 26, 42);

    // Grille Depan & Lampu Utama
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(ambX + 71, ambY + 38, 3, 16);
    ctx.fillStyle = '#fef08a'; // Lampu depan kuning keemasan
    ctx.fillRect(ambX + 71, ambY + 26, 3, 8);

    // 4. Jendela Kaca Biru Presisi (Tercakup 100% di Dalam Kabin Tanpa Menggantung di Udara)
    // Jendela 1: Pasien Belakang
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(ambX - 48, ambY + 7, 30, 18);
    // Jendela 2: Pintu Samping Pasien
    ctx.fillRect(ambX - 12, ambY + 7, 28, 18);
    // Jendela 3: Kabin Pengemudi
    ctx.fillRect(ambX + 22, ambY + 7, 22, 18);

    // Kaca Depan Miring (Windshield Glass Slope) Menghubungkan Atap ke Kap Mesin
    ctx.beginPath();
    ctx.moveTo(ambX + 44, ambY + 7);
    ctx.lineTo(ambX + 50, ambY + 22);
    ctx.lineTo(ambX + 44, ambY + 22);
    ctx.closePath();
    ctx.fill();

    // Bingkai & Pilar Putih Antar Kaca
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(ambX - 18, ambY + 5, 6, 22); // Pilar 1
    ctx.fillRect(ambX + 16, ambY + 5, 6, 22); // Pilar 2

    // 5. Garis Stripping Oranye & Merah Tanggap Bencana di Bodi Ambulans
    ctx.fillStyle = '#f97316';
    ctx.fillRect(ambX - 56, ambY + 36, 130, 6);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(ambX - 56, ambY + 42, 130, 3);

    // 6. Simbol Palang Biru Ambulans (Star of Life Cross)
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(ambX - 31, ambY + 13, 4, 14);
    ctx.fillRect(ambX - 36, ambY + 18, 14, 4);

    // 7. Spatbor / Lengkungan Roda (Wheel Wells)
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(ambX - 28, 346, 16, Math.PI, 0);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ambX + 46, 346, 16, Math.PI, 0);
    ctx.fill();

    // 8. Roda Ambulans Napak Tanah Sempurna (Pusat Y: 346, Radius: 14, Dasar: 360)
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(ambX - 28, 346, 14, 0, Math.PI * 2);
    ctx.arc(ambX + 46, 346, 14, 0, Math.PI * 2);
    ctx.fill();

    // Velg Perak & Dop Roda
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(ambX - 28, 346, 6, 0, Math.PI * 2);
    ctx.arc(ambX + 46, 346, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.arc(ambX - 28, 346, 2.5, 0, Math.PI * 2);
    ctx.arc(ambX + 46, 346, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // 9. Lampu Strobo Sirine Darurat Berkelip di Atap Kabin Pengemudi
    const flashTick = Math.floor(animTick / 8) % 2;
    // Dudukan Sirine
    ctx.fillStyle = '#334155';
    ctx.fillRect(ambX + 24, ambY - 3, 24, 3);

    // Lampu Merah (Kiri) & Biru (Kanan)
    ctx.fillStyle = flashTick === 1 ? '#ef4444' : '#7f1d1d';
    ctx.fillRect(ambX + 25, ambY - 9, 10, 6);
    ctx.fillStyle = flashTick === 0 ? '#38bdf8' : '#1e3a8a';
    ctx.fillRect(ambX + 37, ambY - 9, 10, 6);

    // Efek Cahaya Pendaran Strobo
    ctx.fillStyle = flashTick === 0 ? 'rgba(56, 189, 248, 0.28)' : 'rgba(239, 68, 68, 0.28)';
    ctx.beginPath();
    ctx.arc(ambX + 36, ambY - 6, 26, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

// ── PINTU KEMBALI MENUJU KELAS 8A DARI LAPANGAN (PORTAL BACK AREA 3) ──
// Ukuran proporsional & rapi (tidak menutupi jendela lantai 1 di y: 224-272)
export function drawAssemblyFieldBackDoor(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number
): void {
  ctx.save();
  const doorW = 50;
  const doorH = 68; // Tinggi proporsional agar tidak menutupi jendela di atasnya
  const topY = y - doorH; // y = 360 -> topY = 292 (jendela lantai 1 berakhir di y = 272)

  // 1. Kusen Pintu Kaca Masuk Gedung Sekolah (Baja Modern)
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x - doorW / 2 - 3, topY - 3, doorW + 6, doorH + 3);
  ctx.fillStyle = '#334155';
  ctx.fillRect(x - doorW / 2 - 1.5, topY - 1.5, doorW + 3, doorH + 1.5);

  // 2. Ruang Masuk Lorong Menuju Kelas 8A (Terang dari Dalam Gedung)
  const hallGrad = ctx.createLinearGradient(x - doorW / 2, topY, x + doorW / 2, topY);
  hallGrad.addColorStop(0, '#64748b');
  hallGrad.addColorStop(0.5, '#cbd5e1');
  hallGrad.addColorStop(1, '#f1f5f9');
  ctx.fillStyle = hallGrad;
  ctx.fillRect(x - doorW / 2, topY, doorW, doorH);

  // Kaca Pintu Reflektif Biru & Gagang Baja
  ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
  ctx.fillRect(x - doorW / 2 + 3, topY + 6, doorW / 2 - 5, doorH - 10);
  ctx.fillRect(x + 2, topY + 6, doorW / 2 - 5, doorH - 10);

  // Garis Pemisah Daun Pintu Ganda
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x - 1, topY, 2, doorH);

  // Gagang Pintu Vertikal Emas
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(x - 5, topY + 30, 2.5, 14);
  ctx.fillRect(x + 2.5, topY + 30, 2.5, 14);

  // Plakat Header Nama Pintu di Atas Kusen (y: 278-290, tetap di bawah batas jendela y: 272)
  const plaqueW = 60;
  const plaqueH = 12;
  const plaqueY = topY - 14;
  drawRoundedBadgeL2(ctx, x - plaqueW / 2, plaqueY, plaqueW, plaqueH, 3, '#15803d', '#4ade80', 1.2);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 8.5px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('KELAS 8A', x, plaqueY + plaqueH / 2);

  ctx.restore();
}

// ── GERBANG KELUAR MENUJU LERENG MERAPI (AREA 3 EXIT GAPURA) ──
// Dibuat persis seperti Gapura Lereng Merapi di screenshot 2 (Clean, Minimalis & Retro)
export function drawAssemblyFieldExitGate(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  _animTick: number,
  isUnlocked: boolean,
  _labelText?: string
): void {
  ctx.save();
  ctx.translate(px, py);

  // 1. Pilar Gapura Batu Andesit Kiri & Kanan (lebar gapura lebih lapang & proporsional)
  ctx.fillStyle = '#334155';
  ctx.fillRect(-36, -64, 8, 64);
  ctx.fillRect(28, -64, 8, 64);
  ctx.fillStyle = '#475569';
  ctx.fillRect(-34, -64, 4, 64);
  ctx.fillRect(30, -64, 4, 64);

  // 2. Palang Atas Gapura Kayu Jati Lereng
  ctx.fillStyle = '#78350f';
  ctx.fillRect(-42, -74, 84, 12);
  ctx.fillStyle = '#92400e';
  ctx.fillRect(-40, -72, 80, 8);

  // 3. Papan Teks Penunjuk Arah (Lebar 76px, Kotak Diperbesar Agar Teks Tidak Keluar)
  const signText = isUnlocked ? 'POS MERAPI' : 'GERBANG TERKUNCI';
  const textColor = isUnlocked ? '#4ade80' : '#f87171';
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-38, -60, 76, 18);
  ctx.strokeStyle = textColor;
  ctx.lineWidth = 1.2;
  ctx.strokeRect(-38, -60, 76, 18);

  ctx.fillStyle = textColor;
  ctx.font = 'bold 9.5px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(signText, 0, -50);

  // 4. Lampu Lentera Pos Ronda di Tiang
  const lanternColor = isUnlocked ? '#22c55e' : '#f59e0b';
  ctx.fillStyle = lanternColor;
  ctx.fillRect(-32, -44, 5, 8);
  ctx.fillRect(27, -44, 5, 8);

  // 5. Palang Penghalang Sederhana Jika Terkunci
  if (!isUnlocked) {
    // Palang kayu sederhana melintang di antara kedua tiang
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-28, -28, 56, 5);
    ctx.fillStyle = '#92400e';
    ctx.fillRect(-28, -27, 56, 2);

    // Gembok kecil di tengah
    ctx.fillStyle = '#eab308';
    ctx.fillRect(-5, -27, 10, 10);
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 1;
    ctx.strokeRect(-5, -27, 10, 10);
    // Lingkar atas gembok
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, -27, 4, Math.PI, 0);
    ctx.stroke();
  }

  ctx.restore();
}

