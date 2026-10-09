// ── engine/draw/classroom.ts ──────────────────────────────────────────────
// Ruang kelas (Area 2): suasana, lantai, properti, keretakan dinding akibat
// gempa, pintu masuk dan keluar.
//
// Dipisahkan dari renderer.ts (Langkah 4 dari pemecahan berkas).
// Terbukti mandiri: hanya bergantung pada ./base dan tipe GameStateL2.
//
// ATURAN: hanya boleh mengimpor dari ./base dan ../gameEngine.

import { drawRoundedBadgeL2 } from './base';
import type { GameStateL2 } from '../gameEngine';

// ── Catatan bagian (dipindahkan dari renderer.ts) ─────────────────────────
// ── ATMOSPHERE: CLASSROOM INTERIOR, CHALKBOARDS, WINDOWS & HANGING LAMPS (AREA 1: MITIGASI GEMPA) ──
// ── PROPS DEKORASI LANTAI KELAS (PENGHAPUS, BOLPOIN, TEMPAT PENSIL, DLL) ──
// ── HELPER HITUNG PROGRES KERUSAKAN KELAS AREA 2 SECARA PROGRESIF (0.0 = UTUH, 1.0 = RUSAK TOTAL) ──
// ── LANTAI KERAMIK PUTIH RUANG KELAS SIMULASI (AREA 2: BERSIH / PASCA-GEMPA RETAK) ──
// ══════════════════════════════════════════════════════════════════════════
// 2B.1. RETAK-RETAK SEISMIK & KERUSAKAN STRUKTURAL PROGRESIF (AREA 2)
// ══════════════════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════════════════
// 2B. ATMOSPHERE: RUANG KELAS AREA 2 (SIMULASI TANGGAP GEMPA)
// - Menghadap ke kanan (depan kelas di sebelah kiri x: 0..250)
// - Papan tulis samping di dinding paling kiri (hanya kelihatan tebal/pinggirnya)
// - Meja guru di depan (x: 170) menghadap kanan
// - Meja & kursi murid berukuran proporsional natural (meja 44px, kursi 18px) menghadap kiri
// - Pintu evakuasi ke lapangan terbuka di ujung kanan (x: 2130)
// - Mode Pasca-Bencana: Suasana porak-poranda, tembok retak, meja kursi terbalik, buku berserakan
// ══════════════════════════════════════════════════════════════════════════
// ── ATMOSPHERE: MOUNT MERAPI ASH, ERUPTION SMOKE & PVMBG SIREN (AREA 5) ──
// ── PROMPT INTERAKSI NPC MELAYANG [E] / Enter (100% KONSISTEN LEVEL 1 & LEVEL 2) ──
// ── PROMPT INTERAKSI OBJEK MELAYANG (PORTAL / LANDER) (100% KONSISTEN LEVEL 1 & LEVEL 2) ──
// ── PINTU MASUK RUANG KELAS DI DINDING KIRI (TITIK AWAL PEMAIN DATANG) ──
// ── PINTU KELUAR RUANG KELAS MENJELANG AREA 2 (PINTU DI DINDING KANAN) ──


// ── ATMOSPHERE: CLASSROOM INTERIOR, CHALKBOARDS, WINDOWS & HANGING LAMPS (AREA 1: MITIGASI GEMPA) ──
export function drawClassroomAtmosphere(
  ctx: CanvasRenderingContext2D,
  camX: number,
  viewW: number,
  viewH: number,
  animTick: number
): void {
  // 1. Dinding Atas Ruang Kelas (Cat Dinding Krem Bersih & Lembut)
  const wallGrad = ctx.createLinearGradient(0, 0, 0, 240);
  wallGrad.addColorStop(0, '#f8fafc'); // Putih gading bersih dekat plafon
  wallGrad.addColorStop(0.5, '#f1f5f9'); // Abu-abu terang lembut
  wallGrad.addColorStop(1, '#e2e8f0'); // Gradasi halus ke lis kayu
  ctx.fillStyle = wallGrad;
  ctx.fillRect(camX, 0, viewW, 240);

  // 1B. Plafon Ruang Kelas & Balok Struktur (Ceiling Cornice & Acoustic Tiles)
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(camX, 0, viewW, 16);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(camX, 15, viewW, 2);

  // Garis Nat Plafon Akustik Kelas setiap 120px
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
  ctx.lineWidth = 1;
  const ceilingOffset = ((camX % 120) + 120) % 120;
  ctx.beginPath();
  for (let cx = camX - ceilingOffset; cx < camX + viewW + 120; cx += 120) {
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, 16);
  }
  ctx.stroke();

  // 2. Lis Dinding Kayu Tengah (Classroom Dado Rail Moulding pada y: 236 - 246)
  ctx.fillStyle = '#92400e';
  ctx.fillRect(camX, 236, viewW, 10);
  ctx.fillStyle = '#b45309';
  ctx.fillRect(camX, 236, viewW, 3);
  ctx.fillStyle = '#451a03';
  ctx.fillRect(camX, 244, viewW, 2);

  // 3. Panel Dinding Kayu Bawah (Wainscoting Paneling y: 246 - 360)
  ctx.fillStyle = '#78350f';
  ctx.fillRect(camX, 246, viewW, 114);

  // Bilah Panel Kayu Vertikal (Wainscot Slats) setiap 40px
  const slatOffset = ((camX % 40) + 40) % 40;
  for (let sx = camX - slatOffset; sx < camX + viewW + 40; sx += 40) {
    ctx.fillStyle = '#451a03';
    ctx.fillRect(sx, 246, 2, 114);
    ctx.fillStyle = '#92400e';
    ctx.fillRect(sx + 2, 246, 2, 114);
  }

  // 3B. Dinding Samping Kiri Kelas & Pintu Masuk Terbuka (x: 0 .. 80)
  if (camX < 140) {
    ctx.save();
    // Tiang Dinding Pembatas Kiri Kelas
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 16, 360);
    ctx.fillStyle = '#334155';
    ctx.fillRect(16, 0, 8, 360);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(0, 350, 24, 10); // Baseboard

    // Pintu Masuk Ruang Kelas Terbuka Menempel Dinding Kiri
    drawClassroomEntranceDoor(ctx, 48, 360);
    ctx.restore();
  }

  // 3C. Dinding Samping Kanan Kelas (x: 2180 .. 2208)
  if (camX + viewW > 2150) {
    ctx.save();
    ctx.fillStyle = '#334155';
    ctx.fillRect(2184, 0, 8, 360);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(2192, 0, 16, 360);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(2184, 350, 24, 10); // Baseboard
    ctx.restore();
  }

  // 4. Jendela Kaca Besar Ruang Kelas (Classroom Windows with Daylight & Trees)
  // Jendela berada pada posisi dunia tetap: x = 180, 760, 1380, 1920
  const windowPositions = [180, 760, 1380, 1920];
  for (const winX of windowPositions) {
    if (winX + 160 < camX || winX > camX + viewW) continue;

    ctx.save();
    // Kusen Jendela Kayu Jati Luar
    ctx.fillStyle = '#451a03';
    ctx.fillRect(winX - 4, 46, 148, 148);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(winX, 50, 140, 140);

    // Kaca Jendela & Kliping Pemandangan Luar (Mencegah Daun Tembus ke Dalam Kelas)
    ctx.save();
    ctx.beginPath();
    ctx.rect(winX + 6, 56, 128, 128);
    ctx.clip(); // 100% Terklip di dalam kaca jendela

    // Langit Cerah di Luar Sekolah
    const skyGrad = ctx.createLinearGradient(0, 56, 0, 184);
    skyGrad.addColorStop(0, '#38bdf8');
    skyGrad.addColorStop(0.7, '#7dd3fc');
    skyGrad.addColorStop(1, '#bae6fd');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(winX + 6, 56, 128, 128);

    // Siluet Atap Gedung Kampus Sekolah di Luar
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(winX + 12, 135, 116, 49);
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(winX + 10, 135);
    ctx.lineTo(winX + 55, 115);
    ctx.lineTo(winX + 100, 115);
    ctx.lineTo(winX + 128, 135);
    ctx.closePath();
    ctx.fill();

    // Batang & Ranting Pohon Sekolah di Luar Kaca
    ctx.fillStyle = '#5c2605';
    ctx.fillRect(winX + 62, 120, 12, 64);
    ctx.fillRect(winX + 45, 135, 20, 4);
    ctx.fillRect(winX + 70, 130, 24, 4);

    // Rimbun Daun Pohon Sekolah (Solid, Tertiup Angin Perlahan di Luar Jendela)
    const treeSway = Math.sin(animTick * 0.03 + winX) * 3;
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(winX + 38 + treeSway, 125, 26, 0, Math.PI * 2);
    ctx.arc(winX + 74 - treeSway, 112, 32, 0, Math.PI * 2);
    ctx.arc(winX + 106 + treeSway, 128, 22, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.arc(winX + 44 + treeSway, 118, 18, 0, Math.PI * 2);
    ctx.arc(winX + 78 - treeSway, 105, 22, 0, Math.PI * 2);
    ctx.arc(winX + 102 + treeSway, 120, 16, 0, Math.PI * 2);
    ctx.fill();

    // Kilau Kaca Diagonal di Luar
    ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.beginPath();
    ctx.moveTo(winX + 14, 56);
    ctx.lineTo(winX + 35, 56);
    ctx.lineTo(winX + 10, 184);
    ctx.lineTo(winX + 6, 184);
    ctx.closePath();
    ctx.fill();

    ctx.restore(); // Tutup kliping kaca

    // Bingkai Salib Pemisah Kaca (Window Mullions) DIGAMBAR DI DEPAN KACA & DAUN
    ctx.fillStyle = '#451a03';
    ctx.fillRect(winX + 67, 56, 8, 128);
    ctx.fillRect(winX + 6, 116, 128, 8);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(winX + 68, 56, 6, 128);
    ctx.fillRect(winX + 6, 117, 128, 6);

    // Ambang Bawah Jendela (Window Sill)
    ctx.fillStyle = '#b45309';
    ctx.fillRect(winX - 8, 184, 156, 8);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(winX - 8, 191, 156, 2);

    // Berkas Sinar Matahari Masuk ke Dalam Kelas (God Rays)
    const rayGrad = ctx.createLinearGradient(winX + 70, 56, winX + 140, 320);
    rayGrad.addColorStop(0, 'rgba(254, 240, 138, 0.16)');
    rayGrad.addColorStop(0.6, 'rgba(254, 240, 138, 0.07)');
    rayGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = rayGrad;
    ctx.beginPath();
    ctx.moveTo(winX + 10, 56);
    ctx.lineTo(winX + 134, 56);
    ctx.lineTo(winX + 210, 340);
    ctx.lineTo(winX + 30, 340);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // 5. Tiga Papan Tulis Kapur Hijau Besar dengan Catatan & Rumus Berbeda-beda
  const boards = [
    { x: 380, type: 'math_physics' },
    { x: 1100, type: 'mitigation' }, // Diposisikan rapi di tengah koridor antara jendela 760 dan 1380
    { x: 1600, type: 'evacuation' },
  ];

  for (const b of boards) {
    const bX = b.x;
    if (bX + 230 < camX || bX > camX + viewW) continue;

    ctx.save();
    // Bingkai Kayu Papan Tulis
    ctx.fillStyle = '#451a03';
    ctx.fillRect(bX - 3, 57, 226, 126);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(bX, 60, 220, 120);

    // Permukaan Hijau Tua Papan Tulis Kapur
    ctx.fillStyle = '#064e3b';
    ctx.fillRect(bX + 6, 66, 208, 108);

    // Baki Kapur di Bawah Papan
    ctx.fillStyle = '#92400e';
    ctx.fillRect(bX - 4, 180, 228, 7);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(bX - 2, 180, 224, 2);

    // Kapur & Penghapus di Atas Baki
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(bX + 24, 176, 12, 4);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(bX + 40, 176, 10, 4);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(bX + 60, 174, 24, 6); // Badan kayu penghapus
    ctx.fillStyle = '#64748b';
    ctx.fillRect(bX + 60, 178, 24, 3); // Kain felt hitam

    ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';

    if (b.type === 'math_physics') {
      // ── PAPAN 1: IPA KELAS 8 (STRUKTUR BUMI) ──
      ctx.fillStyle = '#fef08a';
      ctx.fillText('IPA: STRUKTUR BUMI', bX + 16, 82);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('1. KERAK BUMI', bX + 16, 98);
      ctx.fillText('2. MANTEL BUMI', bX + 16, 114);
      ctx.fillText('3. INTI BUMI', bX + 16, 130);

      // Ilustrasi Irisan Lapisan Bumi Kapur
      const cx = bX + 164;
      const cy = 125;
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 16, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, 26, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#a7f3d0';
      ctx.font = 'bold 8px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('LEMPENG', bX + 138, 92);
    } else if (b.type === 'mitigation') {
      // ── PAPAN 2: SIMULASI GEMPA KE KANAN (DI TENGAH SEGMEN KORIDOR) ──
      ctx.fillStyle = '#fde047';
      ctx.fillText('SIMULASI GEMPA KE KANAN', bX + 14, 82);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('1. MERUNDUK (DROP)', bX + 16, 100);
      ctx.fillText('2. BERLINDUNG (COVER)', bX + 16, 116);
      ctx.fillText('3. BERTAHAN (HOLD ON)', bX + 16, 132);

      // Panah Kapur Kuning Besar Mengarah ke Kanan Menuju Area 2
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(bX + 140, 152);
      ctx.lineTo(bX + 195, 152);
      ctx.lineTo(bX + 185, 144);
      ctx.moveTo(bX + 195, 152);
      ctx.lineTo(bX + 185, 160);
      ctx.stroke();

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 8px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('AREA 2 ➔', bX + 60, 156);
    } else {
      // ── PAPAN 3: JALUR EVAKUASI KELAS ──
      ctx.fillStyle = '#4ade80';
      ctx.fillText('JALUR EVAKUASI', bX + 16, 82);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('IKUTI PETUNJUK GURU', bX + 16, 100);
      ctx.fillText('JANGAN PAKAI LIFT!', bX + 16, 116);
      ctx.fillText('KE LAPANGAN SEGERA', bX + 16, 132);

      // Panah Kapur Hijau Menuju Pintu
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(bX + 155, 155);
      ctx.lineTo(bX + 195, 155);
      ctx.lineTo(bX + 185, 149);
      ctx.moveTo(bX + 195, 155);
      ctx.lineTo(bX + 185, 161);
      ctx.stroke();

      // Lambang Bendera Titik Kumpul
      ctx.fillStyle = '#f87171';
      ctx.beginPath();
      ctx.moveTo(bX + 175, 96);
      ctx.lineTo(bX + 192, 102);
      ctx.lineTo(bX + 175, 108);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(bX + 173, 96, 2, 22);
    }

    ctx.restore();
  }

  // 6. Papan Mading Gabus Sekolah (Cork Bulletin Board dipisah di x: 920 agar TIDAK tumpang tindih)
  const corkX = 920;
  if (corkX + 160 >= camX && corkX <= camX + viewW) {
    ctx.save();
    ctx.fillStyle = '#451a03';
    ctx.fillRect(corkX - 2, 68, 154, 104);
    ctx.fillStyle = '#b45309'; // Tekstur gabus
    ctx.fillRect(corkX, 70, 150, 100);

    // Kertas-kertas Pengumuman 3 Pilar Mitigasi: PRABENCANA, BENCANA, PASCABENCANA
    // Lembar 1: PRABENCANA (Kuning)
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(corkX + 8, 80, 42, 76);
    ctx.fillStyle = '#ef4444'; // Jarum Pin Merah
    ctx.beginPath();
    ctx.arc(corkX + 29, 83, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#78350f';
    ctx.font = 'bold 7.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('PRA-', corkX + 12, 95);
    ctx.fillText('BENCANA', corkX + 8, 104);
    ctx.fillStyle = '#92400e';
    ctx.fillText('• SIAGA', corkX + 8, 118);
    ctx.fillText('• TSB 72', corkX + 8, 128);
    ctx.fillText('• DENAH', corkX + 8, 138);

    // Lembar 2: BENCANA (Biru)
    ctx.fillStyle = '#bae6fd';
    ctx.fillRect(corkX + 54, 80, 42, 76);
    ctx.fillStyle = '#2563eb'; // Jarum Pin Biru
    ctx.beginPath();
    ctx.arc(corkX + 75, 83, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0c4a6e';
    ctx.font = 'bold 7.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('SAAT', corkX + 62, 95);
    ctx.fillText('GEMPA', corkX + 58, 104);
    ctx.fillStyle = '#0369a1';
    ctx.fillText('• RUNDUK', corkX + 56, 118);
    ctx.fillText('• LINDUNG', corkX + 56, 128);
    ctx.fillText('• TAHAN', corkX + 56, 138);

    // Lembar 3: PASCABENCANA (Hijau)
    ctx.fillStyle = '#dcfce7';
    ctx.fillRect(corkX + 100, 80, 44, 76);
    ctx.fillStyle = '#16a34a'; // Jarum Pin Hijau
    ctx.beginPath();
    ctx.arc(corkX + 122, 83, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#14532d';
    ctx.font = 'bold 7.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('PASCA-', corkX + 102, 95);
    ctx.fillText('BENCANA', corkX + 98, 104);
    ctx.fillStyle = '#15803d';
    ctx.fillText('• TANGGA', corkX + 100, 118);
    ctx.fillText('• NO LIFT', corkX + 100, 128);
    ctx.fillText('• KUMPUL', corkX + 100, 138);

    ctx.restore();
  }

  // 7. Jam Dinding Sekolah (School Clock at x: 700)
  const clockX = 700;
  if (clockX + 30 >= camX && clockX - 30 <= camX + viewW) {
    ctx.save();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(clockX, 42, 17, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(clockX, 42, 14, 0, Math.PI * 2);
    ctx.fill();

    // Jarum Jam & Menit
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(clockX, 42);
    ctx.lineTo(clockX, 33);
    ctx.moveTo(clockX, 42);
    ctx.lineTo(clockX + 7, 42);
    ctx.stroke();

    // Titik Poros Merah
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(clockX, 42, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // 8. Rambu Hijau Titik Evakuasi / Running Man di Atas Pintu (x: 1880)
  const exitSignX = 1880;
  if (exitSignX + 40 >= camX && exitSignX <= camX + viewW) {
    ctx.save();
    ctx.fillStyle = '#14532d';
    ctx.fillRect(exitSignX, 36, 42, 18);
    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(exitSignX + 1, 37, 40, 16);

    // Siluet Orang Berlari Putih
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(exitSignX + 12, 41, 4, 4); // Kepala
    ctx.fillRect(exitSignX + 14, 46, 3, 5); // Badan
    ctx.fillRect(exitSignX + 12, 49, 3, 3); // Kaki
    ctx.fillRect(exitSignX + 17, 48, 3, 3);

    // Panah Evakuasi Putih
    ctx.beginPath();
    ctx.moveTo(exitSignX + 25, 45);
    ctx.lineTo(exitSignX + 32, 45);
    ctx.lineTo(exitSignX + 29, 42);
    ctx.moveTo(exitSignX + 32, 45);
    ctx.lineTo(exitSignX + 29, 48);
    ctx.stroke();

    ctx.restore();
  }

  // 9. Lampu Neon Gantung Berayun Halus (Hanging Fluorescent Fixtures with Light Beams)
  for (let l = 0; l < 8; l++) {
    const lampWorldX = 120 + l * 280;
    if (lampWorldX + 70 < camX || lampWorldX - 70 > camX + viewW) continue;

    // Ayunan halus respons seismik
    const sway = Math.sin(animTick * 0.05 + l) * 3;
    const lampY = 48;

    ctx.save();
    // Kabel Penggantung Hitam dari Plafon
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(lampWorldX - 22, 16);
    ctx.lineTo(lampWorldX - 22 + sway * 0.5, lampY);
    ctx.moveTo(lampWorldX + 22, 16);
    ctx.lineTo(lampWorldX + 22 + sway * 0.5, lampY);
    ctx.stroke();

    // Kap Lampu Neon Logam Abu-abu
    ctx.translate(sway, 0);
    ctx.fillStyle = '#334155';
    ctx.fillRect(lampWorldX - 32, lampY, 64, 7);

    // Tabung Neon Menyala Terang
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(lampWorldX - 28, lampY + 5, 56, 4);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(lampWorldX - 24, lampY + 6, 48, 2);

    // Berkas Cahaya Sorot Lampu ke Bawah (Volumetric Downward Cone)
    const coneGrad = ctx.createLinearGradient(0, lampY + 9, 0, 240);
    coneGrad.addColorStop(0, 'rgba(254, 240, 138, 0.14)');
    coneGrad.addColorStop(0.5, 'rgba(254, 240, 138, 0.06)');
    coneGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = coneGrad;
    ctx.beginPath();
    ctx.moveTo(lampWorldX - 28, lampY + 9);
    ctx.lineTo(lampWorldX + 28, lampY + 9);
    ctx.lineTo(lampWorldX + 65, 240);
    ctx.lineTo(lampWorldX - 65, 240);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // 10. Perabot Meja Ganda & Kursi Siswa SMP di Latar Belakang (DIAM DI TEMPAT / STATIS KOORDINAT DUNIA)
  const deskWorldPositions = [200, 480, 780, 1080, 1380, 1680, 1920];
  ctx.save();
  for (const deskX of deskWorldPositions) {
    if (deskX + 90 < camX || deskX - 30 > camX + viewW) continue;

    // ── MEJA GANDA SISWA KAYU JATI & BESI HITAM ──
    // Daun Meja Kayu Solid dengan Tepi Bevel
    ctx.fillStyle = '#b45309';
    ctx.fillRect(deskX, 308, 64, 6);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(deskX + 1, 308, 62, 2);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(deskX, 313, 64, 1);

    // Rak Kolong Buku di Bawah Meja
    ctx.fillStyle = '#451a03';
    ctx.fillRect(deskX + 4, 320, 56, 4);

    // Tumpukan Buku Warna-Warni di Kolong Meja
    ctx.fillStyle = '#0284c7'; // Buku Biru
    ctx.fillRect(deskX + 8, 316, 16, 4);
    ctx.fillStyle = '#ef4444'; // Buku Merah
    ctx.fillRect(deskX + 10, 314, 14, 2);
    ctx.fillStyle = '#10b981'; // Buku Hijau
    ctx.fillRect(deskX + 38, 317, 18, 3);

    // Kaki Meja Besi Hollow Hitam
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(deskX + 2, 314, 4, 46);
    ctx.fillRect(deskX + 58, 314, 4, 46);
    // Palang Besi Penyangga Kaki Meja
    ctx.fillStyle = '#334155';
    ctx.fillRect(deskX + 2, 344, 60, 3);
    // Sepatu Karet Kaki Meja
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(deskX + 1, 358, 6, 2);
    ctx.fillRect(deskX + 57, 358, 6, 2);

    // ── 2 KURSI BELAJAR SISWA SMP DENGAN SANDARAN BILAH KAYU ──
    // Kursi Kiri
    const c1X = deskX - 16;
    ctx.fillStyle = '#b45309';
    ctx.fillRect(c1X, 322, 14, 4); // Dudukan kursi
    ctx.fillRect(c1X + 1, 300, 12, 5); // Sandaran atas
    ctx.fillRect(c1X + 1, 308, 12, 3); // Sandaran tengah
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(c1X + 1, 300, 2, 60); // Tiang sandaran & kaki belakang
    ctx.fillRect(c1X + 12, 326, 2, 34); // Kaki depan kursi

    // Kursi Kanan
    const c2X = deskX + 68;
    ctx.fillStyle = '#b45309';
    ctx.fillRect(c2X, 322, 14, 4); // Dudukan kursi
    ctx.fillRect(c2X + 1, 300, 12, 5); // Sandaran atas
    ctx.fillRect(c2X + 1, 308, 12, 3); // Sandaran tengah
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(c2X + 11, 300, 2, 60); // Tiang sandaran & kaki belakang
    ctx.fillRect(c2X, 326, 2, 34); // Kaki depan kursi
  }
  ctx.restore();

  // 11. Partikel Debu Ruang Kelas & Butir Kapur Melayang Halus di Udara
  for (let p = 0; p < 22; p++) {
    const pSpeed = 0.5 + (p % 3) * 0.25;
    const px = camX + ((animTick * pSpeed + p * 95) % (viewW + 20)) - 10;
    const py = 60 + ((p * 27 + Math.sin(animTick * 0.03 + p) * 14) % (viewH - 120));

    // Bintik partikel kapur / debu sinar matahari keemasan
    ctx.fillStyle = p % 3 === 0 ? 'rgba(254, 240, 138, 0.45)' : 'rgba(241, 245, 249, 0.35)';
    ctx.fillRect(Math.round(px), Math.round(py), 2, 2);
  }
}


// ── PROPS DEKORASI LANTAI KELAS (PENGHAPUS, BOLPOIN, TEMPAT PENSIL, DLL) ──
export function drawClassroomFloorProps(
  ctx: CanvasRenderingContext2D,
  camX: number,
  viewW: number,
  _animTick?: number
): void {
  const floorY = 360;

  // 1. Penghapus Papan Tulis Jatuh (x: 250)
  const e1X = 250;
  if (e1X + 24 >= camX && e1X <= camX + viewW) {
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
    ctx.fillRect(e1X + 1, floorY, 20, 2);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(e1X, floorY - 3, 20, 3);
    ctx.fillStyle = '#92400e';
    ctx.fillRect(e1X, floorY - 8, 20, 5);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(e1X + 1, floorY - 8, 18, 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillRect(e1X + 3, floorY - 4, 6, 2);
    ctx.restore();
  }

  // 2. Bolpoin Biru & Pensil Kuning (x: 440)
  const penX = 440;
  if (penX + 30 >= camX && penX <= camX + viewW) {
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
    ctx.fillRect(penX, floorY, 22, 1);
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(penX, floorY - 3, 18, 3);
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(penX + 2, floorY - 4, 6, 1);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(penX + 18, floorY - 2, 4, 1);

    ctx.fillStyle = '#eab308';
    ctx.fillRect(penX + 8, floorY - 6, 20, 2);
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(penX + 6, floorY - 6, 3, 2);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(penX + 9, floorY - 6, 2, 2);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(penX + 28, floorY - 5, 2, 1);
    ctx.restore();
  }

  // 3. Tempat Pensil Kain / Kotak Pensil Ritsleting (x: 720)
  const caseX = 720;
  if (caseX + 32 >= camX && caseX <= camX + viewW) {
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
    ctx.fillRect(caseX + 2, floorY, 28, 2);
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(caseX, floorY - 9, 28, 9);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(caseX + 2, floorY - 8, 24, 7);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(caseX + 3, floorY - 9, 22, 2);
    ctx.fillStyle = '#f97316';
    ctx.fillRect(caseX + 24, floorY - 7, 3, 4);
    ctx.restore();
  }

  // 4. Penggaris Plastik Bening Kuning 30cm (x: 940)
  const rulerX = 940;
  if (rulerX + 38 >= camX && rulerX <= camX + viewW) {
    ctx.save();
    ctx.fillStyle = 'rgba(253, 224, 71, 0.85)';
    ctx.fillRect(rulerX, floorY - 4, 36, 4);
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(rulerX, floorY - 1, 36, 1);
    ctx.fillStyle = '#713f12';
    for (let m = rulerX + 4; m < rulerX + 34; m += 4) {
      ctx.fillRect(m, floorY - 4, 1, 2);
    }
    ctx.restore();
  }

  // 5. Pesawat Kertas Putih (x: 1180)
  const planeX = 1180;
  if (planeX + 24 >= camX && planeX <= camX + viewW) {
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
    ctx.beginPath();
    ctx.moveTo(planeX, floorY);
    ctx.lineTo(planeX + 18, floorY);
    ctx.lineTo(planeX + 8, floorY + 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(planeX, floorY - 2);
    ctx.lineTo(planeX + 16, floorY - 8);
    ctx.lineTo(planeX + 10, floorY - 2);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.moveTo(planeX, floorY - 2);
    ctx.lineTo(planeX + 10, floorY - 2);
    ctx.lineTo(planeX + 14, floorY);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // 6. Buku Tulis Sekolah Terbuka (x: 1400)
  const bookX = 1400;
  if (bookX + 34 >= camX && bookX <= camX + viewW) {
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
    ctx.fillRect(bookX + 1, floorY, 30, 2);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(bookX, floorY - 5, 32, 5);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(bookX + 2, floorY - 5, 13, 4);
    ctx.fillRect(bookX + 17, floorY - 5, 13, 4);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(bookX + 15, floorY - 5, 2, 4);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(bookX + 4, floorY - 4, 9, 1);
    ctx.fillRect(bookX + 4, floorY - 2, 8, 1);
    ctx.fillRect(bookX + 19, floorY - 4, 9, 1);
    ctx.fillRect(bookX + 19, floorY - 2, 7, 1);
    ctx.restore();
  }

  // 7. Botol Minum / Tumbler Sekolah (x: 1640)
  const botX = 1640;
  if (botX + 18 >= camX && botX <= camX + viewW) {
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
    ctx.fillRect(botX + 1, floorY, 14, 2);
    ctx.fillStyle = '#059669';
    ctx.fillRect(botX + 2, floorY - 14, 12, 14);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(botX + 4, floorY - 13, 8, 12);
    ctx.fillStyle = '#334155';
    ctx.fillRect(botX + 3, floorY - 17, 10, 3);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(botX + 8, floorY - 18, 4, Math.PI, 0);
    ctx.stroke();
    ctx.restore();
  }

  // 8. Batang Kapur Tulis Putih & Oranye (x: 1870)
  const chX = 1870;
  if (chX + 22 >= camX && chX <= camX + viewW) {
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(chX, floorY - 3, 10, 3);
    ctx.fillStyle = '#fde047';
    ctx.fillRect(chX + 12, floorY - 2, 7, 2);
    ctx.restore();
  }
}


// ── HELPER HITUNG PROGRES KERUSAKAN KELAS AREA 2 SECARA PROGRESIF (0.0 = UTUH, 1.0 = RUSAK TOTAL) ──
export function getArea2DamageProgress(state: GameStateL2): number {
  if (state.zone.id !== 'area-simulasi-gempa') return 0;
  const isModerate = state.simulation?.quakeScenario === 'moderate';

  if (state.simulation && state.simulation.phase !== 'idle') {
    if (state.simulation.damageProgress !== undefined) {
      const maxLimit = isModerate ? 0.14 : 1.0;
      return Math.max(0, Math.min(maxLimit, state.simulation.damageProgress));
    }
    if (
      state.simulation.phase === 'quake_stopped' ||
      state.simulation.phase === 'evacuating' ||
      state.simulation.phase === 'completed'
    ) {
      return isModerate ? 0.14 : 1.0;
    }
    if (state.simulation.phase === 'quake_holding') {
      const holdRatio = 1 - Math.max(0, state.simulation.quakeTimer / (state.simulation.quakeMaxTimer || 600));
      return 0.25 + holdRatio * 0.75;
    }
    if (state.simulation.phase === 'qte_cover') {
      const qRatio = 1 - Math.max(0, state.simulation.qteTimer / (state.simulation.qteMaxTimer || 600));
      return isModerate ? 0.06 + qRatio * 0.08 : 0.12 + qRatio * 0.13;
    }
    if (state.simulation.phase === 'quake_alert' || state.simulation.phase === 'quake_start') {
      return isModerate ? 0.04 : 0.08;
    }
    return 0;
  }
  if (state.unlockedGates.has('l2_gate_gempa_sim') || state.simulation?.phase === 'completed') {
    return isModerate ? 0.14 : 1.0;
  }
  return 0;
}


// ── LANTAI KERAMIK PUTIH RUANG KELAS SIMULASI (AREA 2: BERSIH / PASCA-GEMPA RETAK) ──
export function drawWhiteClassroomTileFloor(
  ctx: CanvasRenderingContext2D,
  camX: number,
  viewW: number,
  damageProgressInput: number | boolean = 0
): void {
  const floorY = 360;
  const floorH = 120;
  const dmg = typeof damageProgressInput === 'boolean'
    ? (damageProgressInput ? 1.0 : 0.0)
    : Math.max(0, Math.min(1, damageProgressInput));

  // 1. Dasar Ubin Keramik (Halus memudar dari putih bersih #f8fafc ke abu semen #e2e8f0)
  ctx.fillStyle = dmg < 0.25 ? '#f8fafc' : dmg < 0.65 ? '#f1f5f9' : '#e2e8f0';
  ctx.fillRect(camX, floorY, viewW, floorH);

  // 2. Lis Dinding Bawah / Plinth Slate
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(camX, floorY - 5, viewW, 5);
  ctx.fillStyle = '#334155';
  ctx.fillRect(camX, floorY - 5, viewW, 2);

  // 3. Grid Nat Keramik (40x40 pixel)
  ctx.strokeStyle = dmg >= 0.45 ? '#94a3b8' : '#e2e8f0';
  ctx.lineWidth = 1;
  const tileOffX = ((camX % 40) + 40) % 40;
  ctx.beginPath();
  for (let tx = camX - tileOffX; tx < camX + viewW + 40; tx += 40) {
    ctx.moveTo(tx, floorY);
    ctx.lineTo(tx, floorY + floorH);
  }
  for (let ty = floorY; ty <= floorY + floorH; ty += 40) {
    ctx.moveTo(camX, ty);
    ctx.lineTo(camX + viewW, ty);
  }
  ctx.stroke();

  // 4. Pola Kilau Lembut Ubin Keramik Bersih (Memudar saat debu mulai turun)
  if (dmg < 0.45) {
    const sheenAlpha = 1 - dmg / 0.45;
    ctx.save();
    ctx.globalAlpha = sheenAlpha;
    for (let tx = camX - tileOffX; tx < camX + viewW + 40; tx += 40) {
      for (let ty = floorY; ty < floorY + floorH; ty += 40) {
        const tileIndex = Math.floor(tx / 40) + Math.floor(ty / 40);
        if (tileIndex % 2 === 0) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.fillRect(tx + 1, ty + 1, 38, 38);
        }
      }
    }

    // Pantulan Cahaya Kilap Permukaan Keramik (Glossy Sheen)
    const sheenGrad = ctx.createLinearGradient(0, floorY, 0, floorY + 24);
    sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
    sheenGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.15)');
    sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = sheenGrad;
    ctx.fillRect(camX, floorY, viewW, 24);
    ctx.restore();
  }

  // 5. PASCA & SAAT GEMPA: Noda debu bertahap, retakan nat ubin pecah, dan serpihan puing beton
  if (dmg >= 0.18) {
    const dustAlpha = Math.min(1, (dmg - 0.18) / 0.65);
    const dustSeedPositions = [
      60, 190, 310, 470, 620, 780, 940, 1100, 1280, 1440, 1600, 1780, 1940, 2080
    ];
    const dustCount = Math.max(2, Math.floor(dustSeedPositions.length * Math.min(1, (dmg - 0.15) / 0.7)));
    for (let i = 0; i < dustCount; i++) {
      const dX = dustSeedPositions[i];
      if (dX + 70 < camX || dX - 70 > camX + viewW) continue;
      const dustGrad = ctx.createRadialGradient(dX, floorY + 18, 3, dX, floorY + 18, 42);
      dustGrad.addColorStop(0, `rgba(148, 163, 184, ${0.38 * dustAlpha})`);
      dustGrad.addColorStop(0.6, `rgba(203, 213, 225, ${0.18 * dustAlpha})`);
      dustGrad.addColorStop(1, 'rgba(203, 213, 225, 0)');
      ctx.fillStyle = dustGrad;
      ctx.beginPath();
      ctx.ellipse(dX, floorY + 18, 42, 16, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (dmg >= 0.28) {
    // Retakan ubin keramik pecah (fractured tiles bertambah seiring kuatnya gempa)
    ctx.save();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.3;
    const crackTiles = [
      { x: 120, y: floorY + 4 },
      { x: 280, y: floorY + 2 },
      { x: 380, y: floorY + 12 },
      { x: 500, y: floorY + 5 },
      { x: 680, y: floorY + 18 },
      { x: 820, y: floorY + 8 },
      { x: 980, y: floorY + 2 },
      { x: 1140, y: floorY + 14 },
      { x: 1320, y: floorY + 6 },
      { x: 1500, y: floorY + 10 },
      { x: 1680, y: floorY + 4 },
      { x: 1840, y: floorY + 16 },
      { x: 2020, y: floorY + 8 },
    ];
    const crackCount = Math.max(1, Math.floor(crackTiles.length * Math.min(1, (dmg - 0.25) / 0.7)));
    for (let i = 0; i < crackCount; i++) {
      const cr = crackTiles[i];
      if (cr.x + 40 < camX || cr.x - 40 > camX + viewW) continue;
      ctx.beginPath();
      ctx.moveTo(cr.x, cr.y);
      ctx.lineTo(cr.x + 8, cr.y + 7);
      ctx.lineTo(cr.x + 18, cr.y + 5);
      ctx.lineTo(cr.x + 28, cr.y + 16);
      if (dmg >= 0.5) {
        ctx.moveTo(cr.x + 8, cr.y + 7);
        ctx.lineTo(cr.x + 12, cr.y + 19);
        ctx.moveTo(cr.x + 18, cr.y + 5);
        ctx.lineTo(cr.x + 24, cr.y - 2);
      }
      ctx.stroke();

      if (dmg >= 0.6) {
        ctx.fillStyle = '#64748b';
        ctx.fillRect(cr.x + 4, cr.y + 2, 3, 3);
        ctx.fillStyle = '#475569';
        ctx.fillRect(cr.x + 14, cr.y + 10, 4, 3);
      }
    }
    ctx.restore();
  }

  if (dmg >= 0.35) {
    // Serpihan puing beton/gipsum plafon berjatuhan di lantai
    const rubbleBits = [
      { x: 140, y: floorY + 8, s: 7, c: '#94a3b8' },
      { x: 230, y: floorY + 14, s: 5, c: '#cbd5e1' },
      { x: 330, y: floorY + 5, s: 8, c: '#64748b' },
      { x: 490, y: floorY + 12, s: 6, c: '#94a3b8' },
      { x: 610, y: floorY + 7, s: 9, c: '#475569' },
      { x: 740, y: floorY + 16, s: 5, c: '#cbd5e1' },
      { x: 890, y: floorY + 6, s: 7, c: '#94a3b8' },
      { x: 1040, y: floorY + 13, s: 6, c: '#64748b' },
      { x: 1220, y: floorY + 9, s: 8, c: '#cbd5e1' },
      { x: 1390, y: floorY + 15, s: 5, c: '#94a3b8' },
      { x: 1560, y: floorY + 6, s: 7, c: '#64748b' },
      { x: 1720, y: floorY + 14, s: 9, c: '#475569' },
      { x: 1910, y: floorY + 8, s: 6, c: '#cbd5e1' },
      { x: 2060, y: floorY + 11, s: 8, c: '#94a3b8' },
    ];
    const rubbleCount = Math.max(2, Math.floor(rubbleBits.length * Math.min(1, (dmg - 0.35) / 0.6)));
    for (let i = 0; i < rubbleCount; i++) {
      const r = rubbleBits[i];
      if (r.x + 20 < camX || r.x - 20 > camX + viewW) continue;
      ctx.fillStyle = r.c;
      ctx.fillRect(r.x, r.y, r.s, r.s - 2);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
      ctx.fillRect(r.x + 1, r.y + r.s - 2, r.s - 1, 2);
    }
  }
}


// ══════════════════════════════════════════════════════════════════════════
// 2B.1. RETAK-RETAK SEISMIK & KERUSAKAN STRUKTURAL PROGRESIF (AREA 2)
// ══════════════════════════════════════════════════════════════════════════
export function drawClassroomEarthquakeWallCracks(
  ctx: CanvasRenderingContext2D,
  camX: number,
  viewW: number,
  dmg: number = 1.0
): void {
  if (dmg < 0.08) return;
  ctx.save();

  // 1. Celah Plafon Gipsum Halus (Hanya saat gempa kuat)
  const ceilingGaps = [
    { x: 420, w: 22 },
    { x: 1040, w: 26 },
    { x: 1740, w: 24 },
  ];

  if (dmg >= 0.35) {
    const activeGapCount = Math.max(1, Math.floor(ceilingGaps.length * Math.min(1, (dmg - 0.3) / 0.7)));
    for (let g = 0; g < activeGapCount; g++) {
      const gap = ceilingGaps[g];
      if (gap.x + gap.w < camX || gap.x > camX + viewW) continue;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(gap.x, 0, gap.w, 10);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(gap.x + 4, 0);
      ctx.lineTo(gap.x + 8, 12);
      ctx.stroke();
    }
  }

  // 2. Retakan Kecil Hanya di Bagian Atas Dinding (Hairline Cracks Dekat Plafon/Balok)
  // Tidak retak besar ke bawah dinding/lantai sesuai permintaan
  const wallCracks: [number, number][][] = [
    [[140, 14], [146, 24], [142, 34], [148, 44]],
    [[380, 12], [374, 22], [378, 32], [372, 42]],
    [[640, 14], [646, 24], [642, 34], [648, 46]],
    [[980, 12], [986, 22], [982, 32], [988, 42]],
    [[1360, 14], [1354, 24], [1358, 34], [1352, 44]],
    [[1740, 12], [1746, 22], [1742, 32], [1748, 42]],
    [[2020, 14], [2026, 24], [2022, 34], [2028, 44]],
  ];

  const activeCrackCount = Math.min(
    wallCracks.length,
    Math.max(2, Math.floor(wallCracks.length * Math.min(1, (dmg - 0.08) / 0.72)))
  );

  for (let k = 0; k < activeCrackCount; k++) {
    const pts = wallCracks[k];
    const minX = Math.min(...pts.map((p) => p[0]));
    const maxX = Math.max(...pts.map((p) => p[0]));
    if (maxX + 30 < camX || minX - 30 > camX + viewW) continue;

    // Highlight halus
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pts[0][0] + 1, pts[0][1]);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i][0] + 1, pts[i][1]);
    }
    ctx.stroke();

    // Garis retakan kecil gelap
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i][0], pts[i][1]);
    }
    ctx.stroke();
  }

  ctx.restore();
}


// ══════════════════════════════════════════════════════════════════════════
// 2B. ATMOSPHERE: RUANG KELAS AREA 2 (SIMULASI TANGGAP GEMPA)
// - Menghadap ke kanan (depan kelas di sebelah kiri x: 0..250)
// - Papan tulis samping di dinding paling kiri (hanya kelihatan tebal/pinggirnya)
// - Meja guru di depan (x: 170) menghadap kanan
// - Meja & kursi murid berukuran proporsional natural (meja 44px, kursi 18px) menghadap kiri
// - Pintu evakuasi ke lapangan terbuka di ujung kanan (x: 2130)
// - Mode Pasca-Bencana: Suasana porak-poranda, tembok retak, meja kursi terbalik, buku berserakan
// ══════════════════════════════════════════════════════════════════════════
export function drawClassroomAtmosphereArea2(
  ctx: CanvasRenderingContext2D,
  camX: number,
  viewW: number,
  _viewH: number,
  state: GameStateL2
): void {
  const animTick = state.animTick;
  const shakeIntensity = state.simulation?.shakeIntensity || 0;
  const dmg = getArea2DamageProgress(state);

  // 1. Dinding Atas Ruang Kelas (Cat Krem & Abu Halus)
  const wallGrad = ctx.createLinearGradient(0, 0, 0, 240);
  wallGrad.addColorStop(0, '#f8fafc');
  wallGrad.addColorStop(0.5, '#f1f5f9');
  wallGrad.addColorStop(1, '#e2e8f0');
  ctx.fillStyle = wallGrad;
  ctx.fillRect(camX, 0, viewW, 240);

  // Plafon Akustik & Balok Struktur (y: 0..16)
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(camX, 0, viewW, 16);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(camX, 15, viewW, 2);

  // Nat Plafon setiap 120px
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
  ctx.lineWidth = 1;
  const ceilingOffset = ((camX % 120) + 120) % 120;
  ctx.beginPath();
  for (let cx = camX - ceilingOffset; cx < camX + viewW + 120; cx += 120) {
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, 16);
  }
  ctx.stroke();

  // 2. Lis Dinding Kayu Tengah (y: 236..246)
  ctx.fillStyle = '#92400e';
  ctx.fillRect(camX, 236, viewW, 10);
  ctx.fillStyle = '#b45309';
  ctx.fillRect(camX, 236, viewW, 3);
  ctx.fillStyle = '#451a03';
  ctx.fillRect(camX, 244, viewW, 2);

  // 3. Panel Kayu Bawah (y: 246..360)
  ctx.fillStyle = '#78350f';
  ctx.fillRect(camX, 246, viewW, 114);
  const slatOffset = ((camX % 40) + 40) % 40;
  for (let sx = camX - slatOffset; sx < camX + viewW + 40; sx += 40) {
    ctx.fillStyle = '#451a03';
    ctx.fillRect(sx, 246, 2, 114);
    ctx.fillStyle = '#92400e';
    ctx.fillRect(sx + 2, 246, 2, 114);
  }

  // ── RETAKAN SEISMIK & KERUSAKAN PLAFON PROGRESIF (Hanya untuk Skenario Gempa Besar) ──
  const isModerate = state.simulation?.quakeScenario === 'moderate';
  if (!isModerate && dmg > 0.08) {
    drawClassroomEarthquakeWallCracks(ctx, camX, viewW, dmg);
  }

  // 4. DINDING DEPAN PALING KIRI & PAPAN TULIS SAMPING (x: 0..40)
  if (camX < 120) {
    ctx.save();
    // Tiang Struktur Dinding Depan Kelas
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 18, 360);
    ctx.fillStyle = '#334155';
    ctx.fillRect(18, 0, 8, 360);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(0, 350, 26, 10); // Baseboard

    // ── PAPAN TULIS MENEMPEL DI DINDING KIRI MENGHADAP KE KANAN (SIDE PROFILE) ──
    ctx.save();
    const bbTilt = (!isModerate && dmg > 0.3) ? Math.min(0.045, ((dmg - 0.3) / 0.7) * 0.045) : 0;
    if (bbTilt > 0) {
      // Papan tulis miring karena baut braket dinding atas longgar/terlepas akibat gempa besar
      ctx.translate(22, 260);
      ctx.rotate(bbTilt);
      ctx.translate(-22, -260);
    }

    // Braket Besi Penyangga Papan di Dinding
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(16, 95, 8, 8);
    ctx.fillRect(16, 260, 8, 8);

    // Frame Kayu Sisi Samping Papan Tulis (y: 90..274)
    ctx.fillStyle = '#451a03';
    ctx.fillRect(22, 90, 4, 184);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(24, 92, 2, 180);

    // Sisi Permukaan Papan Tulis Hijau Tua yang Menghadap ke Kanan
    ctx.fillStyle = '#064e3b';
    ctx.fillRect(26, 94, 6, 176);
    ctx.fillStyle = '#047857';
    ctx.fillRect(28, 98, 2, 168); // Highlight garis hijau papan tulis

    if (isModerate || dmg < 0.45) {
      // Baki Kapur di Bagian Bawah Mencuat ke Kanan (x: 24..38, y: 270..276)
      ctx.fillStyle = '#92400e';
      ctx.fillRect(24, 270, 16, 6);
      ctx.fillStyle = '#b45309';
      ctx.fillRect(24, 270, 16, 2);

      // Batang Kapur Putih & Kuning di Atas Baki
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(28, 267, 4, 3);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(33, 267, 3, 3);

      // Penghapus Papan Kayu di Ujung Baki
      ctx.fillStyle = '#451a03';
      ctx.fillRect(36, 265, 4, 5);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(36, 269, 4, 2);
    } else {
      // Baki kapur retak miring (Skenario Gempa Besar)
      ctx.fillStyle = '#92400e';
      ctx.fillRect(24, 272, 14, 5);

      // Batang kapur patah dan penghapus jatuh berserakan di atas lantai keramik
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(32, 357, 4, 2);
      ctx.fillRect(40, 358, 3, 2);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(46, 357, 3, 2);

      // Penghapus kayu jatuh terguling di lantai
      ctx.fillStyle = '#451a03';
      ctx.fillRect(52, 355, 6, 4);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(52, 354, 6, 1);
    }

    ctx.restore();
    ctx.restore();
  }

  // 5. MEJA GURU DI DEPAN KELAS (x: 150) MENGHADAP KE KANAN
  const chairFactor = dmg > 0.25 ? Math.min(1, (dmg - 0.25) / 0.75) : 0;
  const tDeskX = 150 + 4 * chairFactor;
  if (tDeskX + 70 >= camX && tDeskX - 30 <= camX + viewW) {
    ctx.save();

    // Kursi Guru di Sebelah Kiri Meja (x: 126)
    const tChairX = 126 - 4 * chairFactor;
    ctx.save();
    if (chairFactor > 0) {
      // Kursi terdorong ke belakang dan miring membentur tiang secara halus
      ctx.translate(tChairX + 8, 360);
      ctx.rotate(-0.14 * chairFactor);
      ctx.translate(-(tChairX + 8), -360);
    }
    ctx.fillStyle = '#92400e';
    ctx.fillRect(tChairX + 4, 308, 3, 52); // Tiang sandaran
    ctx.fillRect(tChairX, 308, 14, 8); // Sandaran kursi
    ctx.fillRect(tChairX, 338, 16, 4); // Dudukan kursi
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(tChairX + 2, 342, 3, 18); // Kaki depan & belakang
    ctx.fillRect(tChairX + 12, 342, 3, 18);
    ctx.restore();

    // Daun Meja Guru
    ctx.save();
    if (chairFactor > 0) {
      ctx.translate(tDeskX + 28, 360);
      ctx.rotate(0.018 * chairFactor);
      ctx.translate(-(tDeskX + 28), -360);
    }
    ctx.fillStyle = '#b45309';
    ctx.fillRect(tDeskX, 324, 56, 5);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(tDeskX + 1, 324, 54, 2);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(tDeskX, 328, 56, 1);

    // Lemari Laci Meja di Sisi Kiri
    ctx.fillStyle = '#78350f';
    ctx.fillRect(tDeskX + 2, 329, 18, 29);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(tDeskX + 2, 338, 18, 1);
    ctx.fillRect(tDeskX + 2, 348, 18, 1);

    if (dmg >= 0.5) {
      // Laci tengah terbuka meluncur keluar akibat guncangan gempa
      const slideOut = Math.min(16, (dmg - 0.5) * 32);
      ctx.fillStyle = '#451a03';
      ctx.fillRect(tDeskX + 8, 340, slideOut, 8);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(tDeskX + slideOut, 341, 10, 6);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(tDeskX + slideOut + 8, 343, 3, 2);
    } else {
      // Gagang Laci Logam Emas
      ctx.fillStyle = '#facc15';
      ctx.fillRect(tDeskX + 9, 333, 4, 2);
      ctx.fillRect(tDeskX + 9, 343, 4, 2);
      ctx.fillRect(tDeskX + 9, 353, 4, 2);
    }

    // Kaki Meja Logam Hitam di Sisi Kanan
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(tDeskX + 52, 329, 3, 31);
    ctx.fillRect(tDeskX + 20, 357, 33, 2); // Palang bawah
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(tDeskX + 51, 358, 5, 2); // Sepatu karet

    if (isModerate || dmg < 0.45) {
      // Props di Atas Meja Guru (Tumpukan Buku, Tempat Pensil, Agenda) rapi
      ctx.fillStyle = '#0284c7'; // Buku agenda biru
      ctx.fillRect(tDeskX + 6, 318, 14, 6);
      ctx.fillStyle = '#ef4444'; // Buku merah
      ctx.fillRect(tDeskX + 7, 316, 12, 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(tDeskX + 8, 319, 8, 3);
      // Tempat Pensil
      ctx.fillStyle = '#475569';
      ctx.fillRect(tDeskX + 26, 315, 6, 9);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(tDeskX + 27, 311, 1, 4);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(tDeskX + 29, 312, 1, 3);
      ctx.fillStyle = '#eab308';
      ctx.fillRect(tDeskX + 31, 310, 1, 5);
    } else {
      // Tempat pensil terguling di ujung meja (Skenario Gempa Besar)
      ctx.fillStyle = '#475569';
      ctx.fillRect(tDeskX + 38, 321, 9, 4);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(tDeskX + 48, 322, 4, 1);

      // Buku agenda, buku nilai, dan lembar tugas ujian jatuh berserakan di lantai
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(tDeskX + 16, 357, 14, 3);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(tDeskX + 34, 358, 12, 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(tDeskX + 24, 356, 8, 4);
      ctx.fillRect(tDeskX + 50, 358, 6, 2);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(tDeskX + 29, 359, 4, 1);
    }

    ctx.restore();
    ctx.restore();
  }

  // 6. JENDELA KACA PROPORSIONAL NATURAL (Lebar 84px, Tinggi 96px pada y: 80..176)
  const windowPositions = [390, 880, 1370, 1860];
  for (const winX of windowPositions) {
    if (winX + 90 < camX || winX - 10 > camX + viewW) continue;

    ctx.save();
    // Kusen Kayu Jati
    ctx.fillStyle = '#451a03';
    ctx.fillRect(winX - 3, 77, 90, 102);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(winX, 80, 84, 96);

    // Kaca Jendela & Pemandangan Luar
    ctx.save();
    ctx.beginPath();
    ctx.rect(winX + 4, 84, 76, 88);
    ctx.clip();

    // Langit Biru Siang Hari
    const skyGrad = ctx.createLinearGradient(0, 84, 0, 172);
    skyGrad.addColorStop(0, '#38bdf8');
    skyGrad.addColorStop(0.7, '#7dd3fc');
    skyGrad.addColorStop(1, '#bae6fd');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(winX + 4, 84, 76, 88);

    // Atap Gedung Sekolah di Luar
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(winX + 8, 136, 68, 36);
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(winX + 6, 136);
    ctx.lineTo(winX + 35, 122);
    ctx.lineTo(winX + 65, 122);
    ctx.lineTo(winX + 78, 136);
    ctx.closePath();
    ctx.fill();

    // Pohon Sekolah
    const sway = Math.sin(animTick * 0.03 + winX) * 2;
    ctx.fillStyle = '#5c2605';
    ctx.fillRect(winX + 38, 128, 8, 44);
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(winX + 26 + sway, 130, 16, 0, Math.PI * 2);
    ctx.arc(winX + 48 - sway, 120, 20, 0, Math.PI * 2);
    ctx.arc(winX + 64 + sway, 132, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.arc(winX + 30 + sway, 126, 11, 0, Math.PI * 2);
    ctx.arc(winX + 50 - sway, 116, 14, 0, Math.PI * 2);
    ctx.fill();

    // Pantulan Kilau Kaca Diagonal
    ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.beginPath();
    ctx.moveTo(winX + 12, 84);
    ctx.lineTo(winX + 28, 84);
    ctx.lineTo(winX + 8, 172);
    ctx.lineTo(winX + 4, 172);
    ctx.closePath();
    ctx.fill();

    // RETAKAN KACA JENDELA: Hanya muncul pada Skenario Gempa Besar (dmg >= 0.35)
    if (!isModerate && dmg >= 0.35) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(winX + 8, 90);
      ctx.lineTo(winX + 32, 118);
      ctx.lineTo(winX + 22, 145);
      if (dmg >= 0.55) {
        ctx.lineTo(winX + 46, 170);
        ctx.moveTo(winX + 32, 118);
        ctx.lineTo(winX + 62, 108);
      }
      if (dmg >= 0.75) {
        ctx.lineTo(winX + 74, 132);
        ctx.moveTo(winX + 55, 86);
        ctx.lineTo(winX + 42, 126);
        ctx.lineTo(winX + 68, 160);
      }
      ctx.stroke();

      ctx.strokeStyle = 'rgba(15, 23, 42, 0.4)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(winX + 9, 91);
      ctx.lineTo(winX + 33, 119);
      ctx.lineTo(winX + 23, 146);
      ctx.stroke();
    }

    ctx.restore();

    // Bingkai Salib Pemisah Kaca
    ctx.fillStyle = '#451a03';
    ctx.fillRect(winX + 40, 84, 5, 88);
    ctx.fillRect(winX + 4, 126, 76, 5);

    // Ambang Bawah Jendela
    ctx.fillStyle = '#b45309';
    ctx.fillRect(winX - 5, 176, 94, 6);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(winX - 5, 181, 94, 2);

    ctx.restore();
  }

  // 7. POSTER EDUKASI MITIGASI PADA DINDING KELAS
  // Poster 1: SOP 3B (Drop, Cover, Hold On) di x: 260
  const p1X = 260;
  const p1W = 104;
  const p1H = 98;
  if (p1X + p1W + 10 >= camX && p1X - 10 <= camX + viewW) {
    ctx.save();
    const p1Rot = dmg > 0.3 ? -0.065 * Math.min(1, (dmg - 0.3) / 0.7) : 0;
    if (p1Rot !== 0) {
      // Sudut paku copot, poster miring bertahap
      ctx.translate(p1X + p1W / 2, 95 + p1H / 2);
      ctx.rotate(p1Rot);
      ctx.translate(-(p1X + p1W / 2), -(95 + p1H / 2));
    }
    // Bingkai Kayu Jati Kokoh
    ctx.fillStyle = '#3e1a06';
    ctx.fillRect(p1X - 3, 95, p1W + 6, p1H + 6);
    // Kertas Poster Putih Gading
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(p1X, 98, p1W, p1H);

    // Header Merah Tebal
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(p1X, 98, p1W, 22);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 10.5px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SOP GEMPA', p1X + p1W / 2, 113);

    // Garis Aksen Emas Bawah Header
    ctx.fillStyle = '#facc15';
    ctx.fillRect(p1X, 120, p1W, 2);

    // Butir SOP 3B (Drop, Cover, Hold On)
    ctx.textAlign = 'left';
    ctx.font = 'bold 8.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#1e3a8a';
    ctx.fillText('1. MERUNDUK', p1X + 8, 136);
    ctx.fillText('2. BERLINDUNG', p1X + 8, 151);
    ctx.fillText('3. BERTAHAN', p1X + 8, 166);

    ctx.fillStyle = '#15803d';
    ctx.fillText('DI BAWAH MEJA', p1X + 8, 183);

    ctx.restore();
  }

  // Poster 2: Denah Jalur Evakuasi Sekolah di x: 1120
  const p2X = 1120;
  const p2W = 96;
  const p2H = 98;
  if (p2X + p2W + 10 >= camX && p2X - 10 <= camX + viewW) {
    ctx.save();
    const p2Rot = dmg > 0.3 ? 0.045 * Math.min(1, (dmg - 0.3) / 0.7) : 0;
    if (p2Rot !== 0) {
      // Bingkai miring bertahap
      ctx.translate(p2X + p2W / 2, 95 + p2H / 2);
      ctx.rotate(p2Rot);
      ctx.translate(-(p2X + p2W / 2), -(95 + p2H / 2));
    }
    ctx.fillStyle = '#3e1a06';
    ctx.fillRect(p2X - 3, 95, p2W + 6, p2H + 6);
    ctx.fillStyle = '#f0f9ff';
    ctx.fillRect(p2X, 98, p2W, p2H);

    // Header Biru
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(p2X, 98, p2W, 22);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 10px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('JALUR KELAS', p2X + p2W / 2, 113);

    // Garis Aksen
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(p2X, 120, p2W, 2);

    // Panah Evakuasi Hijau
    ctx.strokeStyle = '#16a34a';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(p2X + 20, 146);
    ctx.lineTo(p2X + 76, 146);
    ctx.lineTo(p2X + 66, 138);
    ctx.moveTo(p2X + 76, 146);
    ctx.lineTo(p2X + 66, 154);
    ctx.stroke();

    ctx.fillStyle = '#15803d';
    ctx.textAlign = 'center';
    ctx.font = 'bold 8.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('MENUJU', p2X + p2W / 2, 168);
    ctx.fillText('LAPANGAN', p2X + p2W / 2, 180);
    ctx.restore();
  }

  // Poster 3: Rambu Resmi Jalur Evakuasi di x: 1620
  const p3X = 1620;
  const p3W = 86;
  const p3H = 114;
  if (p3X + p3W + 10 >= camX && p3X - 10 <= camX + viewW) {
    ctx.save();
    const p3Rot = dmg > 0.35 ? -0.035 * Math.min(1, (dmg - 0.35) / 0.65) : 0;
    if (p3Rot !== 0) {
      ctx.translate(p3X + p3W / 2, 88 + p3H / 2);
      ctx.rotate(p3Rot);
      ctx.translate(-(p3X + p3W / 2), -(88 + p3H / 2));
    }
    // Bingkai Luar Gelap
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(p3X - 3, 85, p3W + 6, p3H + 6);

    // Latar Belakang Hijau Keselamatan (Safety Green)
    ctx.fillStyle = '#007a3d';
    ctx.fillRect(p3X, 88, p3W, p3H);

    // Garis Tepi Putih Ganda
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(p3X + 3, 91, p3W - 6, p3H - 6);

    // ── BAGIAN ATAS: PINTU DARURAT PUTIH DENGAN SOSOK BERLARI HIJAU ──
    const doorX = p3X + 27;
    const doorY = 96;
    const doorW = 36;
    const doorH = 46;

    // Kusen & Daun Pintu Putih Terbuka
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(doorX, doorY, doorW, doorH);

    // Sudut Bayangan Ambang Pintu
    ctx.fillStyle = '#007a3d';
    ctx.beginPath();
    ctx.moveTo(doorX + doorW - 5, doorY + doorH);
    ctx.lineTo(doorX + doorW, doorY + doorH - 4);
    ctx.lineTo(doorX + doorW, doorY + doorH);
    ctx.closePath();
    ctx.fill();

    // Sosok Orang Berlari Hijau (Running Man Icon)
    const runX = doorX + 17;
    const runY = doorY + 6;

    // 1. Kepala
    ctx.fillStyle = '#007a3d';
    ctx.beginPath();
    ctx.arc(runX + 2, runY + 5, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // 2. Tubuh Condong Maju
    ctx.strokeStyle = '#007a3d';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(runX + 2, runY + 10);
    ctx.lineTo(runX - 2, runY + 23);
    ctx.stroke();

    // 3. Lengan Berlari
    ctx.beginPath();
    ctx.moveTo(runX + 1, runY + 13);
    ctx.lineTo(runX + 8, runY + 12);
    ctx.lineTo(runX + 14, runY + 17);
    ctx.moveTo(runX - 1, runY + 14);
    ctx.lineTo(runX - 8, runY + 12);
    ctx.lineTo(runX - 11, runY + 19);
    ctx.stroke();

    // 4. Kaki Berlari Cepat
    ctx.beginPath();
    ctx.moveTo(runX - 2, runY + 23);
    ctx.lineTo(runX + 5, runY + 30);
    ctx.lineTo(runX + 10, runY + 38);
    ctx.moveTo(runX - 2, runY + 23);
    ctx.lineTo(runX - 8, runY + 28);
    ctx.lineTo(runX - 11, runY + 27);
    ctx.stroke();

    // ── PEMBATAS GARIS PUTIH HORIZONTAL ──
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(p3X + 3, 148);
    ctx.lineTo(p3X + p3W - 3, 148);
    ctx.stroke();

    // ── BAGIAN BAWAH: TEKS "JALUR EVAKUASI" & PANAH KANAN ──
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.font = '900 9.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('JALUR', p3X + 8, 165);
    ctx.fillText('EVAKUASI', p3X + 8, 178);

    // Panah Tebal Putih Menunjuk ke Kanan
    const arrX = p3X + 64;
    const arrY = 168;
    ctx.fillRect(arrX - 2, arrY - 4, 8, 8);
    ctx.beginPath();
    ctx.moveTo(arrX + 6, arrY - 8);
    ctx.lineTo(arrX + 15, arrY);
    ctx.lineTo(arrX + 6, arrY + 8);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // Jam Dinding Sekolah di x: 640
  const clockX = 640;
  if (clockX + 25 >= camX && clockX - 25 <= camX + viewW) {
    ctx.save();
    const clockRot = dmg > 0.3 ? 0.22 * Math.min(1, (dmg - 0.3) / 0.7) : 0;
    if (clockRot !== 0) {
      // Jam dinding miring bertahap karena guncangan seismik
      ctx.translate(clockX, 48);
      ctx.rotate(clockRot);
      ctx.translate(-clockX, -48);
    }
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(clockX, 48, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(clockX, 48, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(clockX, 48);
    ctx.lineTo(clockX, 41);
    ctx.moveTo(clockX, 48);
    ctx.lineTo(clockX + 6, 48);
    ctx.stroke();

    if (dmg >= 0.55) {
      // Retakan kaca jam dinding
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(clockX - 8, 42);
      ctx.lineTo(clockX - 1, 49);
      ctx.lineTo(clockX + 8, 47);
      ctx.stroke();
    }
    ctx.restore();
  }

  // 8. LAMPU NEON GANTUNG PROPORSIONAL (TIDAK RUSAK PADA GEMPA SEDANG)
  for (let l = 0; l < 8; l++) {
    const lampX = 160 + l * 260;
    if (lampX + 60 < camX || lampX - 60 > camX + viewW) continue;

    ctx.save();
    if (isModerate) {
      // SKENARIO GEMPA SEDANG: Lampu tetap utuh & menyala terang, berayun seiring getaran gempa
      const baseSway = Math.sin(animTick * 0.05 + l) * 2;
      const quakeSway = shakeIntensity > 0 ? Math.sin(animTick * 0.18 + l) * (3.5 + shakeIntensity * 2.2) : 0;
      const totalSway = baseSway + quakeSway;
      const lampY = 44;

      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(lampX - 16, 16);
      ctx.lineTo(lampX - 16 + totalSway * 0.5, lampY);
      ctx.moveTo(lampX + 16, 16);
      ctx.lineTo(lampX + 16 + totalSway * 0.5, lampY);
      ctx.stroke();

      ctx.translate(totalSway, 0);
      ctx.fillStyle = '#334155';
      ctx.fillRect(lampX - 22, lampY, 44, 6);

      // Selalu menyala terang tanpa padam
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(lampX - 18, lampY + 4, 36, 3);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(lampX - 14, lampY + 5, 28, 1);
    } else if (dmg < 0.65) {
      // Skenario Gempa Besar: Lampu menyala, berayun kencang, sesekali kelap-kelip jika dmg >= 0.35
      const baseSway = Math.sin(animTick * 0.05 + l) * 2;
      const quakeSway = shakeIntensity > 0 ? Math.sin(animTick * 0.2 + l) * (5 + shakeIntensity) : 0;
      const totalSway = baseSway + quakeSway;
      const lampY = 44;

      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(lampX - 16, 16);
      ctx.lineTo(lampX - 16 + totalSway * 0.5, lampY);
      ctx.moveTo(lampX + 16, 16);
      ctx.lineTo(lampX + 16 + totalSway * 0.5, lampY);
      ctx.stroke();

      ctx.translate(totalSway, 0);
      ctx.fillStyle = '#334155';
      ctx.fillRect(lampX - 22, lampY, 44, 6);

      const isFlickerOff = dmg >= 0.35 && (animTick % 32 < 4);
      if (isFlickerOff) {
        ctx.fillStyle = '#713f12';
        ctx.fillRect(lampX - 18, lampY + 4, 36, 3);
      } else {
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(lampX - 18, lampY + 4, 36, 3);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(lampX - 14, lampY + 5, 28, 1);
      }
    } else {
      // Skenario Gempa Besar Pasca-Gempa (dmg >= 0.65): Listrik padam, kabel putus miring
      const isBrokenTilted = l % 3 === 1;
      if (isBrokenTilted) {
        const tiltProg = Math.min(1, (dmg - 0.65) / 0.35);
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(lampX - 16, 16);
        ctx.lineTo(lampX - 16 + 6 * tiltProg, 44 + 4 * tiltProg);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(lampX + 16, 16);
        ctx.lineTo(lampX + 16 + 2 * tiltProg, 44 - 16 * tiltProg);
        ctx.stroke();

        ctx.translate(lampX - 16 + 6 * tiltProg, 44 + 4 * tiltProg);
        ctx.rotate(0.42 * tiltProg);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-6, 0, 44, 6);
        ctx.fillStyle = '#475569';
        ctx.fillRect(-2, 4, 36, 2);
      } else {
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(lampX - 16, 16);
        ctx.lineTo(lampX - 16, 44);
        ctx.moveTo(lampX + 16, 16);
        ctx.lineTo(lampX + 16, 44);
        ctx.stroke();

        ctx.fillStyle = '#1e293b';
        ctx.fillRect(lampX - 22, 44, 44, 6);
        ctx.fillStyle = '#334155';
        ctx.fillRect(lampX - 18, 48, 36, 2);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(lampX - 6, 48, 4, 2);
      }
    }
    ctx.restore();
  }

  // 9. MEJA & KURSI MURID (BERGESER SEDIKIT DI GEMPA SEDANG / RETAK & TERGULING DI GEMPA BESAR)
  const deskPositions = [
    260, 360, 460, 560, 660, 760, 860, 960, 1060, 1160, 1260, 1360, 1460, 1560, 1660, 1760, 1860,
  ];
  ctx.save();
  for (let i = 0; i < deskPositions.length; i++) {
    const rawDeskX = deskPositions[i];
    if (rawDeskX + 70 < camX || rawDeskX - 30 > camX + viewW) continue;

    if (isModerate) {
      // ── SKENARIO GEMPA SEDANG: MEJA HANYA BERGESER SEDIKIT, KURSI TEGAK, TANPA RETAKAN ──
      const deskJolt = (dmg >= 0.05) ? Math.sin(rawDeskX * 0.17) * 4 : 0;
      const deskX = rawDeskX + deskJolt;

      ctx.save();
      if (deskJolt !== 0) {
        ctx.translate(deskX + 23, 360);
        ctx.rotate(Math.sin(rawDeskX * 0.09) * 0.015);
        ctx.translate(-(deskX + 23), -360);
      }

      ctx.fillStyle = '#b45309';
      ctx.fillRect(deskX, 324, 46, 5);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(deskX + 1, 324, 44, 2);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(deskX, 328, 46, 1);

      // Rak Kolong Buku Meja
      ctx.fillStyle = '#451a03';
      ctx.fillRect(deskX + 3, 330, 40, 4);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(deskX + 6, 331, 12, 3);
      ctx.fillStyle = '#10b981';
      ctx.fillRect(deskX + 22, 331, 14, 3);

      // Kaki Meja Besi Hollow Hitam
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(deskX + 2, 329, 3, 31);
      ctx.fillRect(deskX + 41, 329, 3, 31);
      ctx.fillStyle = '#334155';
      ctx.fillRect(deskX + 2, 355, 42, 2);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(deskX + 1, 358, 5, 2);
      ctx.fillRect(deskX + 40, 358, 5, 2);

      // Buku & Alat Tulis di Meja
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(deskX + 26, 322, 12, 2);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(deskX + 28, 321, 8, 1);
      ctx.restore();

      // Kursi Murid tetap berdiri tegak di samping meja (tidak terguling)
      const chairX = deskX + 38;
      ctx.fillStyle = '#b45309';
      ctx.fillRect(chairX - 4, 338, 16, 4);
      ctx.fillRect(chairX + 9, 312, 3, 30);
      ctx.fillRect(chairX + 5, 312, 7, 5);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(chairX + 9, 342, 2, 18);
      ctx.fillRect(chairX - 2, 342, 2, 18);

      // Beberapa buku/kertas jatuh sedikit di lantai agar terasa agak berantakan
      if (dmg >= 0.08 && i % 3 === 0) {
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(deskX + 16, 357, 10, 3);
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(deskX + 18, 358, 6, 1);
      }
    } else if (dmg < 0.22) {
      // ── SKENARIO GEMPA BESAR: MODE NORMAL SEBELUM BENCANA (MEJA & KURSI RAPI) ──
      const deskX = rawDeskX;
      ctx.fillStyle = '#b45309';
      ctx.fillRect(deskX, 324, 46, 5);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(deskX + 1, 324, 44, 2);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(deskX, 328, 46, 1);

      // Rak Kolong Buku Meja
      ctx.fillStyle = '#451a03';
      ctx.fillRect(deskX + 3, 330, 40, 4);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(deskX + 6, 331, 12, 3);
      ctx.fillStyle = '#10b981';
      ctx.fillRect(deskX + 22, 331, 14, 3);

      // Kaki Meja Besi Hollow Hitam
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(deskX + 2, 329, 3, 31);
      ctx.fillRect(deskX + 41, 329, 3, 31);
      ctx.fillStyle = '#334155';
      ctx.fillRect(deskX + 2, 355, 42, 2);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(deskX + 1, 358, 5, 2);
      ctx.fillRect(deskX + 40, 358, 5, 2);

      // Buku & Alat Tulis di Atas Permukaan Meja
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(deskX + 26, 322, 12, 2);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(deskX + 28, 321, 8, 1);

      // Kursi Murid di Sebelah Kanan Meja
      const chairX = deskX + 38;
      ctx.fillStyle = '#b45309';
      ctx.fillRect(chairX - 4, 338, 16, 4);
      ctx.fillRect(chairX + 9, 312, 3, 30);
      ctx.fillRect(chairX + 5, 312, 7, 5);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(chairX + 9, 342, 2, 18);
      ctx.fillRect(chairX - 2, 342, 2, 18);
    } else {
      // ── SKENARIO GEMPA BESAR: SAAT & PASCA-GEMPA (MEJA RETAK TERKENA PUING, KURSI TERGULING REBAH) ──
      const deskFactor = Math.min(1, (dmg - 0.22) / 0.78);
      const joltX = Math.sin(rawDeskX * 0.17) * 9 * deskFactor;
      const joltRot = Math.sin(rawDeskX * 0.09) * 0.045 * deskFactor;
      const deskX = rawDeskX + joltX;

      ctx.save();
      ctx.translate(deskX + 23, 360);
      ctx.rotate(joltRot);
      ctx.translate(-(deskX + 23), -360);

      // Daun Meja Murid
      ctx.fillStyle = '#b45309';
      ctx.fillRect(deskX, 324, 46, 5);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(deskX + 1, 324, 44, 2);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(deskX, 328, 46, 1);

      // Rak Kolong Meja
      ctx.fillStyle = '#451a03';
      ctx.fillRect(deskX + 3, 330, 40, 4);
      if (i % 2 === 0) {
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(deskX + 6, 331, 8, 3);
      }

      // Kaki Meja
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(deskX + 2, 329, 3, 31);
      ctx.fillRect(deskX + 41, 329, 3, 31);
      ctx.fillStyle = '#334155';
      ctx.fillRect(deskX + 2, 355, 42, 2);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(deskX + 1, 358, 5, 2);
      ctx.fillRect(deskX + 40, 358, 5, 2);

      // Retakan kayu pada daun meja akibat benturan puing beton jatuh (Skenario Gempa Besar)
      if (dmg >= 0.38) {
        ctx.strokeStyle = '#271003';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        if (i % 2 === 0) {
          ctx.moveTo(deskX + 10, 324);
          ctx.lineTo(deskX + 17, 326);
          ctx.lineTo(deskX + 25, 328);
        } else {
          ctx.moveTo(deskX + 20, 324);
          ctx.lineTo(deskX + 27, 326);
          ctx.lineTo(deskX + 36, 328);
        }
        ctx.stroke();
      }

      // Serpihan puing plafon di atas meja
      if (dmg >= 0.45 && i % 3 === 0) {
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(deskX + 14, 322, 5, 2);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(deskX + 30, 321, 6, 3);
      }

      ctx.restore();

      // KURSI MURID: TERGULING REBAH DI LANTAI ATAU TERDORONG BERTAHAP
      if (dmg < 0.32) {
        // Masih berdiri tegak
        const chairX = deskX + 38;
        ctx.fillStyle = '#b45309';
        ctx.fillRect(chairX - 4, 338, 16, 4);
        ctx.fillRect(chairX + 9, 312, 3, 30);
        ctx.fillRect(chairX + 5, 312, 7, 5);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(chairX + 9, 342, 2, 18);
        ctx.fillRect(chairX - 2, 342, 2, 18);
      } else {
        const chairTumble = Math.min(1, (dmg - 0.32) / 0.68);
        ctx.save();
        const chairPattern = i % 3;
        if (chairPattern === 0) {
          // Kursi terguling rebah miring di lantai
          const fellChairX = deskX + 36;
          ctx.translate(fellChairX + 8, 358);
          ctx.rotate(1.52 * chairTumble);
          ctx.fillStyle = '#b45309';
          ctx.fillRect(-8, -2, 16, 4);
          ctx.fillRect(5, -28, 3, 28);
          ctx.fillRect(1, -28, 7, 5);
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(5, 2, 2, 18);
          ctx.fillRect(-6, 2, 2, 18);

          // Retakan pada sandaran kursi
          if (dmg >= 0.5) {
            ctx.strokeStyle = '#271003';
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.moveTo(2, -26);
            ctx.lineTo(6, -24);
            ctx.stroke();
          }
        } else if (chairPattern === 1) {
          // Kursi terbalik condong ke belakang
          const tiltChairX = deskX + 46;
          ctx.translate(tiltChairX + 8, 360);
          ctx.rotate(-0.28 * chairTumble);
          ctx.fillStyle = '#b45309';
          ctx.fillRect(-8, -22, 16, 4);
          ctx.fillRect(5, -48, 3, 28);
          ctx.fillRect(1, -48, 7, 5);
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(5, -18, 2, 18);
          ctx.fillRect(-6, -18, 2, 18);
        } else {
          // Kursi terdorong jauh ke koridor jalan
          const pushedChairX = deskX + 38 + 14 * chairTumble;
          ctx.fillStyle = '#b45309';
          ctx.fillRect(pushedChairX - 4, 338, 16, 4);
          ctx.fillRect(pushedChairX + 9, 312, 3, 30);
          ctx.fillRect(pushedChairX + 5, 312, 7, 5);
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(pushedChairX + 9, 342, 2, 18);
          ctx.fillRect(pushedChairX - 2, 342, 2, 18);
        }
        ctx.restore();
      }

      // BUKU, ALAT TULIS, LEMBAR UJIAN, & TEMPAT PENSIL JATUH BERSERAKAN
      if (dmg >= 0.32) {
        const bookColors = ['#0284c7', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];
        const bColor = bookColors[i % bookColors.length];

        // Buku terbuka di lantai keramik
        ctx.fillStyle = bColor;
        ctx.fillRect(deskX + 12, 357, 13, 3);
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(deskX + 14, 358, 9, 1);
      }

      if (dmg >= 0.5) {
        // Lembar kertas putih ujian berserakan
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(deskX + 28, 356, 10, 4);
        ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.fillRect(deskX + 30, 357, 6, 1);
        ctx.fillRect(deskX + 30, 359, 6, 1);
      }

      if (dmg >= 0.75 && i % 2 === 1) {
        // Tempat pensil & bolpoin tercecer
        ctx.fillStyle = '#6366f1';
        ctx.fillRect(deskX + 44, 357, 7, 3);
        ctx.fillStyle = '#eab308';
        ctx.fillRect(deskX + 53, 358, 5, 1);
      }
    }
  }
  ctx.restore();
}


// ── PINTU MASUK RUANG KELAS DI DINDING KIRI (TITIK AWAL PEMAIN DATANG) ──
export function drawClassroomEntranceDoor(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number
): void {
  ctx.save();
  const doorW = 52;
  const doorH = 96;
  const topY = y - doorH;

  // 1. Kusen Kayu Pintu Kelas Sisi Kiri Menempel di Dinding
  ctx.fillStyle = '#451a03';
  ctx.fillRect(x - doorW / 2 - 4, topY - 4, doorW + 8, doorH + 4);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x - doorW / 2 - 2, topY - 2, doorW + 4, doorH + 2);

  // 2. Ruang Bukaan Pintu: Lorong Sekolah Terang di Sebelah Kiri
  const hallGrad = ctx.createLinearGradient(x - doorW / 2, topY, x + doorW / 2, topY);
  hallGrad.addColorStop(0, '#94a3b8');
  hallGrad.addColorStop(0.3, '#cbd5e1');
  hallGrad.addColorStop(1, '#e2e8f0');
  ctx.fillStyle = hallGrad;
  ctx.fillRect(x - doorW / 2, topY, doorW, doorH);

  // Lantai Koridor Ubin di Luar Ruang Kelas
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(x - doorW / 2, topY + 50, doorW, doorH - 50);
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - doorW / 2 + 16, topY + 50);
  ctx.lineTo(x - doorW / 2 + 8, y);
  ctx.moveTo(x - doorW / 2 + 36, topY + 50);
  ctx.lineTo(x - doorW / 2 + 30, y);
  ctx.stroke();

  // Daun Pintu Kayu Terbuka Menempel Rata ke Dinding Kiri
  ctx.fillStyle = '#92400e';
  ctx.fillRect(x - doorW / 2 - 12, topY + 2, 12, doorH - 2);
  ctx.fillStyle = '#b45309';
  ctx.fillRect(x - doorW / 2 - 10, topY + 20, 9, 44);

  // Plakat Nama Kelas di Atas Pintu
  const plaqueW = 68;
  const plaqueH = 18;
  const plaqueY = topY - 22;
  drawRoundedBadgeL2(ctx, x - plaqueW / 2, plaqueY, plaqueW, plaqueH, 4, '#0f172a', '#f59e0b', 1.5);

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 9.5px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('KELAS 8A', x, plaqueY + plaqueH / 2);

  ctx.restore();
}


// ── PINTU KELUAR RUANG KELAS MENJELANG AREA 2 (PINTU DI DINDING KANAN) ──
export function drawClassroomExitDoor(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  animTick: number,
  isUnlocked: boolean,
  labelText: string = 'PINTU AREA 2'
): void {
  ctx.save();
  const doorW = 58;
  const doorH = 96;
  const topY = y - doorH;

  // 1. Kusen Kayu Pintu Ganda Sekolah Menempel di Dinding
  ctx.fillStyle = '#451a03';
  ctx.fillRect(x - doorW / 2 - 5, topY - 5, doorW + 10, doorH + 5);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x - doorW / 2 - 2, topY - 2, doorW + 4, doorH + 2);

  if (isUnlocked) {
    // Pintu Terbuka: Cahaya Terang dari Lorong Area 2 Memancar
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(x - doorW / 2, topY, doorW, doorH);

    // Gradasi Sorotan Cahaya Ke Lantai Kelas
    const lightGlow = ctx.createLinearGradient(x, topY, x, y + 30);
    lightGlow.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
    lightGlow.addColorStop(0.6, 'rgba(254, 240, 138, 0.18)');
    lightGlow.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = lightGlow;
    ctx.beginPath();
    ctx.moveTo(x - doorW / 2, topY);
    ctx.lineTo(x + doorW / 2, topY);
    ctx.lineTo(x + doorW / 2 + 35, y + 25);
    ctx.lineTo(x - doorW / 2 - 35, y + 25);
    ctx.closePath();
    ctx.fill();

    // Daun Pintu Kayu Terbuka Miring ke Luar Kiri & Kanan
    ctx.fillStyle = '#92400e';
    ctx.fillRect(x - doorW / 2 - 8, topY + 4, 8, doorH - 4);
    ctx.fillRect(x + doorW / 2, topY + 4, 8, doorH - 4);

    // Lorong Sekolah Terbuka di Kejauhan Menuju Area 2
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(x - 16, topY + 25, 32, doorH - 25);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(x - 2, topY + 35, 4, doorH - 35);
  } else {
    // Pintu Tertutup Rapat (Sebelum Lulus TTS Kak Fajar)
    ctx.fillStyle = '#92400e';
    ctx.fillRect(x - doorW / 2, topY, doorW, doorH);

    // Pemisah Daun Pintu Ganda Kiri & Kanan
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x - 1, topY, 2, doorH);

    // Panel Kayu Berukir pada Daun Pintu
    ctx.fillStyle = '#b45309';
    ctx.fillRect(x - doorW / 2 + 4, topY + 46, 22, 44);
    ctx.fillRect(x + 2, topY + 46, 22, 44);

    // Kaca Intip Persegi Panjang dengan Kisi Pengaman (Wire Glass)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x - doorW / 2 + 5, topY + 10, 20, 30);
    ctx.fillRect(x + 3, topY + 10, 20, 30);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(x - doorW / 2 + 7, topY + 12, 16, 26);
    ctx.fillRect(x + 5, topY + 12, 16, 26);
    // Kisi Kawat Pengaman
    ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
    ctx.fillRect(x - doorW / 2 + 14, topY + 12, 2, 26);
    ctx.fillRect(x + 12, topY + 12, 2, 26);

    // Gagang Pintu Baja Vertikal (Push Handle Bar)
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(x - 8, topY + 50, 3, 16);
    ctx.fillRect(x + 5, topY + 50, 3, 16);

    // Gembok / Ikon Terkunci Retro di Tengah Pintu
    const lockY = topY + 56;
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(x - 6, lockY, 12, 9);
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 6, lockY, 12, 9);
    ctx.beginPath();
    ctx.arc(x, lockY - 2, 4, Math.PI, 0);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // 2. Rambu Evakuasi Hijau di Atas Pintu (Green Evacuation / Exit Sign)
  const signW = 84;
  const signH = 22;
  const signY = topY - 28;
  drawRoundedBadgeL2(
    ctx,
    x - signW / 2,
    signY,
    signW,
    signH,
    4,
    isUnlocked ? '#15803d' : '#14532d',
    isUnlocked ? '#86efac' : '#22c55e',
    1.5
  );

  // Teks Rambu Evakuasi
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(isUnlocked ? 'KELUAR ➔' : 'JALUR KELUAR', x, signY + signH / 2);

  // Label Mengambang Pintu (Sesuai Gaya Level 1)
  const bannerY = signY - 26 + Math.sin(animTick * 0.08) * 2;
  const bannerW = 168;
  const bannerH = 22;
  drawRoundedBadgeL2(
    ctx,
    x - bannerW / 2,
    bannerY,
    bannerW,
    bannerH,
    5,
    'rgba(15, 23, 42, 0.92)',
    isUnlocked ? '#22c55e' : '#f59e0b',
    1.5
  );

  ctx.fillStyle = isUnlocked ? '#4ade80' : '#fbbf24';
  ctx.font = 'bold 9.5px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(labelText, x, bannerY + bannerH / 2);

  ctx.restore();
}
