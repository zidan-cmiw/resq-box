import type {
  GameStateL2,
  AreaTransitionBannerL2,
  VolcanoSimulationDataL2,
} from './gameEngine';
import { MAP_WIDTH_PX, MAP_HEIGHT_PX } from './zones';
import {
  drawStudentCharacter,
  drawChasmMagma,
  drawClassroomFloorRubble,
  drawCrystal,
  drawInfoSign,
  drawDiscoveryTotem,
  getOrganicTerrainCacheL2,
  drawPlatformL2,
  drawSeismicVaultGate,
  PLAYER_FRAME_W,
  PLAYER_FRAME_H,
} from './sprites';
import {
  drawNpcWorldL2,
  drawMascotWorldL2,
  drawNpcMaterialBadgeL2,
  drawStudentSittingInDesk,
  drawStudentCoverUnderDesk,
  drawTeacherCoverUnderDesk,
  drawStudentEvacuatingPose,
  drawTeacherEvacuatingPose,
  drawPanicSpeechBubble,
  drawPlayerStunnedByRockImpact,
} from './npcSpritesL2';
import { CLASSROOM_STUDENTS_L2 } from './npcManagerL2';
import type { CustomAvatarConfig } from '../../../store/teacherStore';

// ── Fungsi gambar DASAR yang dipakai lintas tema ──────────────────────────
// Dipindahkan ke modul tersendiri agar berkas ini tidak lagi menampung
// 11.000 baris. Modul `draw/base` TIDAK boleh mengimpor apa pun dari modul
// tema, sehingga tidak terjadi impor melingkar.
//
// `export { ... }` di bawah sekaligus mengimpor dan mengekspor ulang, supaya
// konsumen (TectonicGame.tsx) tidak perlu diubah sama sekali.
export {
  drawRoundedBadgeL2,
  drawRealisticVolcanicSmoke,
} from './draw/base';
import {
  drawRoundedBadgeL2,
  drawRealisticVolcanicSmoke,
} from './draw/base';

// ── Kelompok gunung berapi (Langkah 2) ────────────────────────────────────
// Modul ini hanya bergantung pada ./base, sehingga tidak ada impor melingkar.
export { drawEruptingLavaFlows } from './draw/volcano';

// ── Kelompok lapangan evakuasi (Langkah 3) ────────────────────────────────
// Terbukti mandiri: hanya bergantung pada ./base.
export {
  drawAssemblyFieldGrassFloor,
  drawAssemblyFieldAtmosphere,
  drawAssemblyFieldBackDoor,
  drawAssemblyFieldExitGate,
} from './draw/assembly';
import {
  drawAssemblyFieldGrassFloor,
  drawAssemblyFieldAtmosphere,
  drawAssemblyFieldBackDoor,
  drawAssemblyFieldExitGate,
} from './draw/assembly';

// ── Kelompok ruang kelas & overlay (Langkah 4) ────────────────────────────
export {
  drawClassroomAtmosphere,
  drawClassroomFloorProps,
  getArea2DamageProgress,
  drawWhiteClassroomTileFloor,
  drawClassroomAtmosphereArea2,
  drawClassroomEntranceDoor,
  drawClassroomExitDoor,
} from './draw/classroom';
import {
  drawClassroomAtmosphere,
  drawClassroomFloorProps,
  getArea2DamageProgress,
  drawWhiteClassroomTileFloor,
  drawClassroomAtmosphereArea2,
  drawClassroomEntranceDoor,
  drawClassroomExitDoor,
} from './draw/classroom';

export {
  drawSimulationQteOverlay,
  drawSimulationQuakeTimerOverlay,
  drawSimulationEvacuationPrompt,
  drawVolcanoMitigationAtmosphere,
  drawNpcInteractionPromptL2,
  drawInteractionPromptL2,
} from './draw/overlay';
import {
  drawSimulationQteOverlay,
  drawSimulationQuakeTimerOverlay,
  drawSimulationEvacuationPrompt,
  drawVolcanoMitigationAtmosphere,
  drawNpcInteractionPromptL2,
  drawInteractionPromptL2,
} from './draw/overlay';

// ── Kelompok Merapi (Langkah 5 dari pemecahan berkas) ─────────────────────
// Termasuk desa pedesaan & truk penyelamat, yang harus ikut agar tidak
// terjadi impor melingkar (keduanya memanggil tiang sirine & kantor BPBD).
export {
  drawMerapiPrabencanaGround,
  drawMerapiBackGate,
  drawMerapiPrabencanaAtmosphere,
  drawRambuJalurEvakuasiMerapi,
  drawVolcanoSimulationGround,
  drawVolcanoSimulationAtmosphere,
  drawTiangSirineEws,
  drawKantorBpbd,
  drawMigratingAnimals,
  drawPlayerDisasterGearOverlay,
  drawVolcanoFleeingNpcPanicBubbles,
  drawPlayerVolcanoSpeechBubble,
  drawVolcanoSimulationVillage,
  drawEvacuationRescueTruck,
} from './draw/merapi';
import {
  drawMerapiPrabencanaGround,
  drawMerapiBackGate,
  drawMerapiPrabencanaAtmosphere,
  drawVolcanoSimulationGround,
  drawVolcanoSimulationAtmosphere,
  drawMigratingAnimals,
  drawPlayerDisasterGearOverlay,
  drawVolcanoFleeingNpcPanicBubbles,
  drawPlayerVolcanoSpeechBubble,
  drawEvacuationRescueTruck,
} from './draw/merapi';
import type { Point2D } from './draw/volcano';

// ── RENDER INTERIOR GEDUNG POS PENGAMATAN MERAPI (PGA PVMBG) ──
function drawPosPengamatanInterior(
  ctx: CanvasRenderingContext2D,
  state: GameStateL2,
  viewW: number,
  viewH: number,
  avatarConfig?: CustomAvatarConfig
): void {
  const ROOM_W = 800;
  const ROOM_H = 480;
  const scale = Math.max(0.5, viewH / ROOM_H);
  const effectiveW = viewW / scale;

  // Kamera horizontal mengikuti pergerakan pemain di dalam ruangan (125 <= x <= 685)
  const targetCamX = state.player.x - effectiveW / 2;
  const camX = Math.max(0, Math.min(Math.max(0, ROOM_W - effectiveW), targetCamX));

  ctx.clearRect(0, 0, viewW, viewH);

  ctx.save();
  ctx.scale(scale, scale);
  ctx.translate(-camX, 0);

  const animTick = state.animTick;

  // 1. Dinding Belakang Laboratorium Posko (Slate Gelap High-Tech)
  const wallGrad = ctx.createLinearGradient(0, 0, 0, 360);
  wallGrad.addColorStop(0, '#0b1120');
  wallGrad.addColorStop(0.4, '#0f172a');
  wallGrad.addColorStop(1, '#1e293b');
  ctx.fillStyle = wallGrad;
  ctx.fillRect(0, 0, ROOM_W, 360);

  // Panel Garis Akustik Horizontal di Dinding
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  for (let y = 60; y < 360; y += 30) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(ROOM_W, y);
    ctx.stroke();
  }

  // 2. Plafon / Langit-langit Laboratorium (y: 0 - 46)
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, ROOM_W, 46);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 44, ROOM_W, 3);

  // Lampu Tabung Laboratorium LED Neon Putih-Kebiruan
  const lampXList = [120, 320, 520, 680];
  lampXList.forEach((lx) => {
    // Rangka Lampu
    ctx.fillStyle = '#475569';
    ctx.fillRect(lx - 36, 16, 72, 8);
    // Tabung Lampu Menyala
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(lx - 32, 20, 64, 4);

    // Pancaran Cahaya Halus ke Bawah (Downlight Cones)
    ctx.save();
    const coneGrad = ctx.createLinearGradient(lx, 24, lx, 240);
    coneGrad.addColorStop(0, 'rgba(248, 250, 252, 0.10)');
    coneGrad.addColorStop(1, 'rgba(248, 250, 252, 0)');
    ctx.fillStyle = coneGrad;
    ctx.beginPath();
    ctx.moveTo(lx - 32, 24);
    ctx.lineTo(lx + 32, 24);
    ctx.lineTo(lx + 70, 240);
    ctx.lineTo(lx - 70, 240);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  });

  // 3. Lantai Keramik/Vinyl Abu-abu Tahan Statis (y: 360 - 480)
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 360, ROOM_W, 120);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 356, ROOM_W, 4); // Lis plinth bawah

  // Garis Nat Ubin Lantai Persegi
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  for (let x = 0; x <= ROOM_W; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 360);
    ctx.lineTo(x, 480);
    ctx.stroke();
  }
  for (let y = 360; y <= 480; y += 30) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(ROOM_W, y);
    ctx.stroke();
  }

  // Garis Kuning Peringatan Bahaya (Safety Strip) di Depan Seismograf
  for (let sx = 550; sx < 705; sx += 14) {
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.moveTo(sx, 360);
    ctx.lineTo(sx + 7, 360);
    ctx.lineTo(sx + 3, 364);
    ctx.lineTo(sx - 4, 364);
    ctx.closePath();
    ctx.fill();
  }

  // ── 4. JENDELA PANORAMA OBSERVASI MERAPI (TENGAH, x: 215 - 525, y: 85 - 335) ──
  // Pemandangan gunung di dalam jendela DIBUAT IDENTIK 100% dengan Gunung Merapi di map luar!
  const winX = 215;
  const winY = 85;
  const winW = 310;
  const winH = 250;

  // Bingkai Tebal Jendela Observasi Baja Hitam
  ctx.fillStyle = '#020617';
  ctx.fillRect(winX - 5, winY - 5, winW + 10, winH + 10);
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 2;
  ctx.strokeRect(winX - 5, winY - 5, winW + 10, winH + 10);

  // Area Kaca Jendela (Clip agar pemandangan gunung tidak keluar)
  ctx.save();
  ctx.beginPath();
  ctx.rect(winX, winY, winW, winH);
  ctx.clip();

  // 4a. Langit Biru Cerah Pegunungan (Persis Map Luar)
  const skyGrad = ctx.createLinearGradient(winX, winY, winX, winY + winH);
  skyGrad.addColorStop(0, '#0284c7');
  skyGrad.addColorStop(0.35, '#38bdf8');
  skyGrad.addColorStop(0.7, '#7dd3fc');
  skyGrad.addColorStop(1, '#e0f2fe');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(winX, winY, winW, winH);

  // 4b. Awan Putih Alami Melayang Tenang (Stylized Clouds)
  const cloud1X = winX + ((animTick * 0.15) % (winW + 140)) - 60;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.beginPath();
  ctx.arc(cloud1X, winY + 36, 14, 0, Math.PI * 2);
  ctx.arc(cloud1X + 16, winY + 30, 18, 0, Math.PI * 2);
  ctx.arc(cloud1X + 38, winY + 33, 15, 0, Math.PI * 2);
  ctx.arc(cloud1X + 56, winY + 38, 11, 0, Math.PI * 2);
  ctx.fill();

  // 4c. Siluet Megah Gunung Stratovolcano Merapi (Identik dengan Gambar Map Luar!)
  const merapiPeakX = winX + winW * 0.52;
  const merapiPeakY = winY + 40;
  const baseY = winY + winH;

  const mountainGrad = ctx.createLinearGradient(0, merapiPeakY, 0, baseY);
  mountainGrad.addColorStop(0, '#475569'); // Puncak kawah abu-abu kebiruan
  mountainGrad.addColorStop(0.4, '#334155');
  mountainGrad.addColorStop(0.8, '#1e293b');
  mountainGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = mountainGrad;

  // Bentuk kerucut stratovolcano khas Merapi: Puncak Kawah Barat & Kubah Lava Aktif
  ctx.beginPath();
  ctx.moveTo(merapiPeakX - 320, baseY);
  ctx.lineTo(merapiPeakX - 42, merapiPeakY + 12);
  ctx.lineTo(merapiPeakX - 8, merapiPeakY);      // Puncak kawah barat
  ctx.lineTo(merapiPeakX + 14, merapiPeakY + 4);  // Kubah lava aktif
  ctx.lineTo(merapiPeakX + 340, baseY);
  ctx.closePath();
  ctx.fill();

  // Guratan Lembah Alur Sungai Lahar Merapi (Gendol & Krasak)
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(merapiPeakX + 14, merapiPeakY + 6);
  ctx.lineTo(merapiPeakX + 48, merapiPeakY + 75);
  ctx.lineTo(merapiPeakX + 110, baseY);
  ctx.moveTo(merapiPeakX - 8, merapiPeakY + 4);
  ctx.lineTo(merapiPeakX - 55, merapiPeakY + 90);
  ctx.lineTo(merapiPeakX - 125, baseY);
  ctx.stroke();

  // 4d. Kepulan Asap Solfatara Putih Halus Realistis (Identik Persis Map Luar)
  drawRealisticVolcanicSmoke(ctx, merapiPeakX + 2, merapiPeakY + 4, animTick, false);

  // 4e. Perbukitan Hijau Hutan Pinus Lereng Merapi di Bagian Bawah Jendela
  const hillGrad = ctx.createLinearGradient(0, 260, 0, baseY);
  hillGrad.addColorStop(0, '#166534');
  hillGrad.addColorStop(1, '#14532d');
  ctx.fillStyle = hillGrad;

  ctx.beginPath();
  ctx.moveTo(winX - 10, baseY);
  for (let hx = winX - 10; hx <= winX + winW + 10; hx += 20) {
    const hy = 292 + Math.sin(hx * 0.035) * 8;
    ctx.lineTo(hx, hy);
  }
  ctx.lineTo(winX + winW + 10, baseY);
  ctx.closePath();
  ctx.fill();

  // Rumpun Pepohonan Pinus Cemara 3D di Bukit Hijau Jendela
  const windowPines = [
    { px: winX + 24, py: 295, h: 22 },
    { px: winX + 44, py: 298, h: 17 },
    { px: winX + 68, py: 302, h: 14 },
    { px: winX + 230, py: 300, h: 16 },
    { px: winX + 254, py: 296, h: 22 },
    { px: winX + 280, py: 293, h: 25 },
  ];
  for (const tp of windowPines) {
    ctx.fillStyle = '#451a03';
    ctx.fillRect(tp.px - 1, tp.py - 4, 2, 6);
    ctx.fillStyle = '#14532d';
    ctx.beginPath();
    ctx.moveTo(tp.px, tp.py - tp.h);
    ctx.lineTo(tp.px + tp.h * 0.35, tp.py - 2);
    ctx.lineTo(tp.px - tp.h * 0.35, tp.py - 2);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.moveTo(tp.px, tp.py - tp.h);
    ctx.lineTo(tp.px, tp.py - 2);
    ctx.lineTo(tp.px - tp.h * 0.35, tp.py - 2);
    ctx.closePath();
    ctx.fill();
  }

  // 4f. Garis Bingkai Kaca Vertikal & Horizontal (Mullions)
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(winX + winW * 0.33 - 1.5, winY, 3, winH);
  ctx.fillRect(winX + winW * 0.66 - 1.5, winY, 3, winH);
  ctx.fillRect(winX, winY + winH * 0.45 - 1.5, winW, 3);

  // Kilatan Refleksi Diagonal Kaca Bersih
  ctx.fillStyle = 'rgba(255, 255, 255, 0.10)';
  ctx.beginPath();
  ctx.moveTo(winX + 20, winY);
  ctx.lineTo(winX + 55, winY);
  ctx.lineTo(winX, winY + 95);
  ctx.lineTo(winX, winY + 50);
  ctx.closePath();
  ctx.fill();

  ctx.restore(); // Tutup clip kaca

  // Plakat Header Jendela Observasi
  ctx.fillStyle = '#0369a1';
  ctx.fillRect(winX + winW / 2 - 75, winY - 14, 150, 14);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1;
  ctx.strokeRect(winX + winW / 2 - 75, winY - 14, 150, 14);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 7.5px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('JENDELA OBSERVASI VISUAL MERAPI', winX + winW / 2, winY - 7);

  // ── 5. MEJA OBSERVASI DI BAWAH JENDELA (SKALA PROPORSIONAL KARAKTER 24px) ──
  // Karakter: Tinggi 24px (y: 336 - 360). Meja setinggi pinggang: y = 342 (tinggi 18px).
  const deskX = 275;
  const deskY = 342;
  const deskW = 185;
  const deskH = 18;

  // Papan Meja Kerja Baja Abu-abu
  ctx.fillStyle = '#334155';
  ctx.fillRect(deskX, deskY, deskW, 4);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(deskX, deskY, deskW, 1.2); // Highlight lis atas

  // Kaki-kaki Meja Baja Kokoh
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(deskX + 6, deskY + 4, 5, deskH - 4);
  ctx.fillRect(deskX + deskW - 11, deskY + 4, 5, deskH - 4);
  ctx.fillRect(deskX + deskW / 2 - 2, deskY + 4, 4, deskH - 4);
  // Palang horizontal bawah meja
  ctx.fillRect(deskX + 6, deskY + 11, deskW - 12, 2);

  // ── Teropong / Binokular Jarak Jauh di Atas Meja Menghadap Puncak Kawah ──
  const scopeX = deskX + 28;
  const scopeY = deskY - 16;

  // Tripod Besi Teropong di Atas Meja (Setinggi Mata Karakter y: 326)
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(scopeX, scopeY + 12);
  ctx.lineTo(scopeX - 6, deskY);
  ctx.moveTo(scopeX, scopeY + 12);
  ctx.lineTo(scopeX + 6, deskY);
  ctx.moveTo(scopeX, scopeY + 12);
  ctx.lineTo(scopeX, deskY);
  ctx.stroke();

  // Tabung Teropong Miring ke Atas Mengarah ke Kawah
  ctx.save();
  ctx.translate(scopeX, scopeY + 6);
  ctx.rotate(-0.35);
  ctx.fillStyle = '#334155';
  ctx.fillRect(-8, -2.5, 16, 5);
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(8, -3.5, 3, 7); // Lensa depan biru
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(-11, -2, 3, 4);  // Eyepiece
  ctx.restore();

  // ── Monitor Telemetri 1 (Kamera Termal Kubah Lava) ──
  const mon1X = deskX + 62;
  const mon1Y = deskY - 14;
  // Dudukan
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(mon1X + 7, deskY - 2, 4, 2);
  // Casing Monitor Mini
  ctx.fillRect(mon1X, mon1Y, 18, 12);
  ctx.fillStyle = '#1e1b4b';
  ctx.fillRect(mon1X + 1, mon1Y + 1, 16, 10);
  // Titik Panas Kubah Lava Termal
  ctx.fillStyle = '#ea580c';
  ctx.beginPath();
  ctx.arc(mon1X + 9, mon1Y + 6, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(mon1X + 9, mon1Y + 5.5, 1.8, 0, Math.PI * 2);
  ctx.fill();

  // ── Monitor Telemetri 2 (Grafik Deformasi Tiltmeter & EDM) ──
  const mon2X = deskX + 88;
  const mon2Y = deskY - 14;
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(mon2X + 7, deskY - 2, 4, 2);
  ctx.fillRect(mon2X, mon2Y, 18, 12);
  ctx.fillStyle = '#022c22';
  ctx.fillRect(mon2X + 1, mon2Y + 1, 16, 10);
  // Garis Sinyal Deformasi Tiltmeter
  ctx.strokeStyle = '#34d399';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(mon2X + 2, mon2Y + 6);
  for (let gx = 0; gx < 14; gx += 2) {
    const dy = Math.sin(gx * 0.5 + animTick * 0.1) * 2;
    ctx.lineTo(mon2X + 2 + gx, mon2Y + 6 + dy);
  }
  ctx.stroke();

  // ── Buku Catatan Logbook Harian Pos PVMBG ──
  const bookX = deskX + 120;
  const bookY = deskY - 3;
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(bookX, bookY, 16, 3);
  ctx.fillStyle = '#854d0e';
  ctx.fillRect(bookX, bookY, 3, 3); // Jilid

  // ── Kursi Kantor Berputar (Swivel Chair) ──
  const chairX = deskX + 155;
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(chairX - 5, deskY + 6, 10, 3); // Dudukan
  ctx.fillRect(chairX - 1, deskY + 9, 2, 7);  // Tiang
  ctx.fillRect(chairX - 4, deskY + 16, 8, 2); // Kaki roda
  ctx.fillRect(chairX - 5, deskY - 1, 2, 8);  // Sandaran

  // ── 6. STASIUN SEISMOGRAF TELEMETRI MERAPI (KANAN, x: 560 - 700) ──
  // Skala proporsional karakter 24px: Tabletop at y: 342
  const seismoX = 560;
  const seismoY = 342;
  const seismoW = 140;
  const seismoH = 18;

  // Meja Seismograf Kokoh
  ctx.fillStyle = '#334155';
  ctx.fillRect(seismoX, seismoY, seismoW, 4);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(seismoX, seismoY, seismoW, 1.2);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(seismoX + 6, seismoY + 4, 5, seismoH - 4);
  ctx.fillRect(seismoX + seismoW - 11, seismoY + 4, 5, seismoH - 4);
  ctx.fillRect(seismoX + seismoW / 2 - 2, seismoY + 4, 4, seismoH - 4);
  ctx.fillRect(seismoX + 6, seismoY + 11, seismoW - 12, 2);

  // Tabung Drum Silinder Kertas Seismogram di Atas Meja (Status Normal: Halus & Landai)
  const drumX = seismoX + 14;
  const drumY = seismoY - 15;
  const drumW = 50;
  const drumH = 15;

  // Rangka Penyangga Samping Tabung Drum Baja
  ctx.fillStyle = '#475569';
  ctx.fillRect(drumX - 4, drumY + 1, 4, drumH - 1);
  ctx.fillRect(drumX + drumW, drumY + 1, 4, drumH - 1);

  // Silinder Tabung Putih Kertas Seismogram
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(drumX, drumY, drumW, drumH);
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1;
  ctx.strokeRect(drumX, drumY, drumW, drumH);

  // Garis Grid Horizontal Halus Kertas Seismogram
  ctx.strokeStyle = '#e0f2fe';
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  ctx.moveTo(drumX, drumY + 4);
  ctx.lineTo(drumX + drumW, drumY + 4);
  ctx.moveTo(drumX, drumY + 8);
  ctx.lineTo(drumX + drumW, drumY + 8);
  ctx.moveTo(drumX, drumY + 12);
  ctx.lineTo(drumX + drumW, drumY + 12);
  ctx.stroke();

  // Garis Gelombang Seismik Status Normal (Landai, Halus & Renggang Sesuai Sketsa)
  // Track 1 (Jalur Rekaman Atas - Biru Muda Halus)
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1;
  ctx.beginPath();
  const track1Y = drumY + 5;
  ctx.moveTo(drumX, track1Y);
  for (let dx = 0; dx <= drumW; dx += 2) {
    const yWave = track1Y + Math.sin(((dx / drumW) * Math.PI * 4) + animTick * 0.04) * 1.5;
    ctx.lineTo(drumX + dx, yWave);
  }
  ctx.stroke();

  // Track 2 (Jalur Rekaman Aktif Bawah - Biru Utama Seismograf)
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  const track2Y = drumY + 10.5;
  ctx.moveTo(drumX, track2Y);
  for (let dx = 0; dx <= drumW; dx += 2) {
    const yWave = track2Y + Math.sin(((dx / drumW) * Math.PI * 4) + animTick * 0.04) * 1.8;
    ctx.lineTo(drumX + dx, yWave);
  }
  ctx.stroke();

  // Jarum Stylus Pena Merah Pencatat (Menempel & Mengikuti Gelombang Secara Real-time)
  const needleX = drumX + drumW - 7;
  const needleY = track2Y + Math.sin((((drumW - 7) / drumW) * Math.PI * 4) + animTick * 0.04) * 1.8;

  // Tangkai Lengan Jarum Stylus
  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(needleX + 10, track2Y);
  ctx.lineTo(needleX, needleY);
  ctx.stroke();

  // Ujung Mata Pena Stylus
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.arc(needleX, needleY, 1.2, 0, Math.PI * 2);
  ctx.fill();

  // Kotak Telemetri Radio PVMBG (Di Kanan Tabung)
  const radioX = seismoX + 78;
  const radioY = seismoY - 12;
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(radioX, radioY, 44, 12);
  ctx.strokeStyle = '#475569';
  ctx.strokeRect(radioX, radioY, 44, 12);

  const isDataLed = Math.floor(animTick / 15) % 2 === 0;
  ctx.fillStyle = isDataLed ? '#22c55e' : '#14532d';
  ctx.fillRect(radioX + 4, radioY + 4, 3, 3);
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 5px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('151.7 MHz TELEMETRI', radioX + 10, radioY + 8);

  // ── Monitor Osiloskop Gelombang Digital di Dinding Atas Seismograf ──
  const oscX = seismoX + 5;
  const oscY = 225;
  const oscW = 130;
  const oscH = 80;

  // Plakat Header Stasiun Seismograf
  ctx.fillStyle = '#15803d';
  ctx.fillRect(oscX, oscY - 15, oscW, 13);
  ctx.strokeStyle = '#4ade80';
  ctx.lineWidth = 1;
  ctx.strokeRect(oscX, oscY - 15, oscW, 13);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 6.5px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('STASIUN SEISMOGRAF TELEMETRI', oscX + oscW / 2, oscY - 6.5);

  ctx.fillStyle = '#020617';
  ctx.fillRect(oscX, oscY, oscW, oscH);
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 1.2;
  ctx.strokeRect(oscX, oscY, oscW, oscH);

  // Grid Layar Osiloskop
  ctx.strokeStyle = 'rgba(34, 197, 94, 0.2)';
  ctx.lineWidth = 0.8;
  for (let gx = oscX + 13; gx < oscX + oscW; gx += 13) {
    ctx.beginPath();
    ctx.moveTo(gx, oscY);
    ctx.lineTo(gx, oscY + oscH);
    ctx.stroke();
  }
  for (let gy = oscY + 12; gy < oscY + oscH; gy += 12) {
    ctx.beginPath();
    ctx.moveTo(oscX, gy);
    ctx.lineTo(oscX + oscW, gy);
    ctx.stroke();
  }

  // Header Layar Digital
  ctx.fillStyle = '#4ade80';
  ctx.font = 'bold 7.5px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('LIVE SEISMOGRAM', oscX + 5, oscY + 10);
  ctx.fillStyle = '#22c55e';
  ctx.font = 'bold 6.5px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('DEPTH: 3.5 KM • STATUS: NORMAL', oscX + 5, oscY + 20);

  // Garis Gelombang Seismik Real-time Hijau Neon (Status Normal: Landai, Tenang & Renggang Sesuai Sketsa)
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  const midOscY = oscY + 45;
  ctx.moveTo(oscX + 4, midOscY);

  for (let gx = 0; gx <= oscW - 8; gx += 2) {
    // Gelombang halus landai tenang tanpa lonjakan V-spike
    const waveAmp = Math.sin((gx / (oscW - 8)) * Math.PI * 5 + animTick * 0.06) * 5;
    ctx.lineTo(oscX + 4 + gx, midOscY + waveAmp);
  }
  ctx.stroke();

  // Indikator 4 Status di Bawah Osiloskop
  const stColors = [
    { name: 'NORMAL', bg: '#15803d', active: true },
    { name: 'WASPADA', bg: '#ca8a04', active: false },
    { name: 'SIAGA', bg: '#ea580c', active: false },
    { name: 'AWAS', bg: '#dc2626', active: false },
  ];
  stColors.forEach((st, idx) => {
    const bx = oscX + 5 + idx * 30;
    const by = oscY + oscH - 14;
    ctx.fillStyle = st.active ? st.bg : '#1e293b';
    ctx.fillRect(bx, by, 28, 10);
    ctx.strokeStyle = st.active ? '#ffffff' : '#334155';
    ctx.lineWidth = 0.8;
    ctx.strokeRect(bx, by, 28, 10);
    ctx.fillStyle = st.active ? '#ffffff' : '#64748b';
    ctx.font = 'bold 5px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(st.name, bx + 14, by + 7.5);
  });

  // ── 7. PINTU KELUAR LAB (KIRI, x: 110 - 142, y: 312 - 360, SKALA PROPORSIONAL 48px) ──
  // Pintu setinggi 48px (2x tinggi karakter 24px)
  const doorX = 110;
  const doorY = 312;
  const doorW = 32;
  const doorH = 48;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(doorX - 2, doorY - 2, doorW + 4, doorH + 2);

  ctx.fillStyle = '#334155';
  ctx.fillRect(doorX, doorY, doorW, doorH);
  ctx.fillStyle = '#475569';
  ctx.fillRect(doorX + 2, doorY + 2, doorW - 4, doorH - 4);

  // Kaca Pintu
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(doorX + 8, doorY + 8, 16, 16);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1;
  ctx.strokeRect(doorX + 8, doorY + 8, 16, 16);

  // Gagang Pintu Baja Mengkilap (Setinggi Tangan Karakter y: 338)
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(doorX + doorW - 5, doorY + 24, 2, 8);

  // Plang EXIT Hijau di Atas Pintu
  ctx.fillStyle = '#15803d';
  ctx.fillRect(doorX - 4, doorY - 14, doorW + 8, 11);
  ctx.strokeStyle = '#4ade80';
  ctx.lineWidth = 1;
  ctx.strokeRect(doorX - 4, doorY - 14, doorW + 8, 11);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 6px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('KELUAR ➔', doorX + doorW / 2, doorY - 6);

  // Panel Kunci Digital di Samping Pintu
  const lockX = doorX + doorW + 4;
  const lockY = doorY + 18;
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(lockX, lockY, 10, 16);
  ctx.strokeStyle = '#475569';
  ctx.strokeRect(lockX, lockY, 10, 16);

  const isUnlocked = !!state.pgaRoomQuizSolved;
  ctx.fillStyle = isUnlocked ? '#22c55e' : '#dc2626';
  ctx.beginPath();
  ctx.arc(lockX + 5, lockY + 5, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Poster Penampang Gunung Merapi di Dinding Kiri (x: 156 - 192, y: 275 - 325)
  const postX = 156;
  const postY = 275;
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(postX, postY, 36, 50);
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1;
  ctx.strokeRect(postX, postY, 36, 50);
  ctx.fillStyle = '#0369a1';
  ctx.fillRect(postX, postY, 36, 8);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 4.5px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('MERAPI 2930M', postX + 18, postY + 5.5);
  ctx.fillStyle = '#64748b';
  ctx.beginPath();
  ctx.moveTo(postX + 18, postY + 14);
  ctx.lineTo(postX + 32, postY + 38);
  ctx.lineTo(postX + 4, postY + 38);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(postX + 16, postY + 22, 4, 16);

  // ── 8. NPC ZIDANE BERDIRI DI DALAM RUANGAN (x: 520, y: 360, SKALA 24px) ──
  // Zidane berdiri di antara meja observasi dan seismograf (tinggi meja di pinggangnya)
  const isNearZidane = Math.abs(state.player.x - 520) < 50;
  drawNpcWorldL2(
    ctx,
    'zidane',
    520,
    360,
    'left',
    0,
    isNearZidane,
    animTick
  );

  // Balon Prompt Interaksi di Atas Kepala Zidane (y: 310)
  if (isNearZidane) {
    const bubbleY = 310 + Math.sin(animTick * 0.12) * 3;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 6;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(520 - 64, bubbleY - 10, 128, 20, 6);
    ctx.fill();
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(520 - 4, bubbleY + 10);
    ctx.lineTo(520, bubbleY + 16);
    ctx.lineTo(520 + 4, bubbleY + 10);
    ctx.closePath();
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = '#0369a1';
    ctx.font = 'bold 8px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Tekan [E] Bicara Zidane', 520, bubbleY);
  }

  // ── 9. PEMAIN (STUDENT CHARACTER) & MASKOT RESQY ──
  drawStudentCharacter(
    ctx,
    state.player.x,
    state.player.y,
    state.player.dir,
    state.player.isWalking,
    state.player.walkFrame,
    state.player.onGround,
    state.player.vy,
    avatarConfig,
    state.zone.id
  );

  drawMascotWorldL2(
    ctx,
    state.player.x + (state.player.dir === 'right' ? -18 : 18),
    state.player.y - 14,
    state.player.dir,
    animTick
  );

  // Balon Prompt Pintu Keluar di Atas Pintu (y: 286)
  if (state.player.x <= 165) {
    const doorPromptY = 286 + Math.sin(animTick * 0.12) * 3;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 6;
    ctx.fillStyle = isUnlocked ? '#15803d' : '#991b1b';
    ctx.beginPath();
    ctx.roundRect(doorX - 45, doorPromptY - 11, 130, 22, 6);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 7px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      isUnlocked ? 'Tekan [E] Keluar Posko' : 'Tekan [E] Kuis Seismogram',
      doorX + 20,
      doorPromptY
    );
  }

  ctx.restore();

  // ── 10. HUD BAR ATAS (DESAIN ELEGAN NON-OBTRUSIVE) ──
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
  ctx.fillRect(16, 14, 380, 46);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(16, 14, 380, 46);

  ctx.fillStyle = Math.floor(animTick / 20) % 2 === 0 ? '#22c55e' : '#14532d';
  ctx.beginPath();
  ctx.arc(30, 30, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('POS PENGAMATAN MERAPI (PGA PVMBG)', 42, 28);

  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 8px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(
    `Ruang Observasi Vulkanologi • Kuis Keluar: ${isUnlocked ? 'SUDAH SELESAI ✓' : 'WAJIB DISELESAIKAN [TERKUNCI]'}`,
    42,
    44
  );
  ctx.restore();

  if (state.nearInteractablePrompt) {
    ctx.save();
    const promptW = Math.min(viewW - 32, 540);
    const px = (viewW - promptW) / 2;
    const py = viewH - 42;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.fillRect(px, py, promptW, 30);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(px, py, promptW, 30);
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(state.nearInteractablePrompt, viewW / 2, py + 15);
    ctx.restore();
  }
}

export function renderTectonicGameL2(
  ctx: CanvasRenderingContext2D,
  state: GameStateL2,
  viewW: number,
  viewH: number,
  avatarConfig?: CustomAvatarConfig
): void {
  // ── MODE INTERIOR RUANG POS PENGAMATAN MERAPI (PGA) ──
  if (state.isInsidePgaRoom) {
    drawPosPengamatanInterior(ctx, state, viewW, viewH, avatarConfig);
    return;
  }

  // ── 0. RESPONSIVE VIEWPORT SCALE (MATCH 480PX GAMEPLAY HEIGHT) ──
  const scale = Math.max(0.5, viewH / MAP_HEIGHT_PX);
  const effectiveW = viewW / scale;
  const effectiveH = MAP_HEIGHT_PX;

  // ── 1. CAMERA OFFSET ──
  const targetCamX = state.player.x - effectiveW / 2;
  const camX = Math.max(0, Math.min(MAP_WIDTH_PX - effectiveW, targetCamX));

  ctx.clearRect(0, 0, viewW, viewH);

  ctx.save();
  ctx.scale(scale, scale);

  // ============================================================================
 // FISIKA GETARAN KAMERA GEMPA (CAMERA SHAKE)
  // Pengali di bawah ini mengontrol seberapa jauh layar bergeser (pixel) per tingkat intensity:
  // - waveX & waveY : Ayunan gelombang seismik mulus (bergoyang ke samping / atas-bawah)
  // - jitterX & jitterY : Sentakan tektonik cepat / getar acak
  // ============================================================================
  let camShakeX = 0;
  let camShakeY = 0;
  if (state.simulation && state.simulation.shakeIntensity > 0) {
    const intensity = state.simulation.shakeIntensity;
    const waveX = Math.sin(state.animTick * 0.45) * 1.0 * intensity;
    const waveY = Math.cos(state.animTick * 0.55) * 1.0 * intensity;
    const jitterX = (Math.random() - 0.5) * 0.3 * intensity;
    const jitterY = (Math.random() - 0.5) * 0.2 * intensity;
    camShakeX = waveX + jitterX;
    camShakeY = waveY + jitterY;
  }
  ctx.translate(-camX + camShakeX, camShakeY);

  // ── 2. SKY & BACKGROUND (RUANG KELAS, SIMULASI, LAPANGAN EVAKUASI, & MERAPI) ──
  if (state.zone.id === 'area-simulasi-merapi') {
    drawVolcanoSimulationAtmosphere(ctx, camX, effectiveW, effectiveH, state);
  } else if (state.zone.id === 'area-barak-pengungsian') {
    drawShelterRecoveryAtmosphere(ctx, camX, effectiveW, effectiveH, state.animTick);
  } else if (state.zone.id === 'area-pos-pengamatan-merapi') {
    drawMerapiPrabencanaAtmosphere(ctx, camX, effectiveW, effectiveH, state.animTick);
  } else if (state.zone.id === 'area-lapangan-evakuasi') {
    drawAssemblyFieldAtmosphere(ctx, camX, effectiveW, effectiveH, state.animTick);
  } else if (state.zone.id === 'area-simulasi-gempa') {
    drawClassroomAtmosphereArea2(ctx, camX, effectiveW, effectiveH, state);
  } else if (state.zone.id === 'area-mitigasi-erupsi') {
    drawVolcanoMitigationAtmosphere(ctx, camX, effectiveW, effectiveH, state.animTick);
  } else {
    drawClassroomAtmosphere(ctx, camX, effectiveW, effectiveH, state.animTick);
  }

  // ── 3. CHASM HAZARDS (RETAKAN LANTAI KELAS ATAU MAGMA AKTIF) ──
  for (const haz of state.zone.chasmHazards) {
    if (state.zone.id === 'area-mitigasi-gempa' || state.zone.id === 'area-lapangan-evakuasi') {
      drawClassroomFloorRubble(ctx, haz.x, haz.y, haz.w, haz.h, state.animTick);
    } else {
      drawChasmMagma(ctx, haz.x, haz.y, haz.w, haz.h, state.animTick);
    }
  }

  // ── 4. KONTUR MEDAN ORGANIK KONTINU / LANTAI KERAMIK / LAPANGAN RUMPUT / LERENG MERAPI ──
  if (state.zone.id === 'area-simulasi-merapi') {
    drawVolcanoSimulationGround(ctx, camX, effectiveW, state);
  } else if (state.zone.id === 'area-barak-pengungsian') {
    drawShelterRecoveryGround(ctx, camX, effectiveW, state.animTick);
  } else if (state.zone.id === 'area-pos-pengamatan-merapi') {
    drawMerapiPrabencanaGround(ctx, camX, effectiveW, state.animTick);
  } else if (state.zone.id === 'area-lapangan-evakuasi') {
    drawAssemblyFieldGrassFloor(ctx, camX, effectiveW);
  } else if (state.zone.id === 'area-simulasi-gempa') {
    const dmg = getArea2DamageProgress(state);
    drawWhiteClassroomTileFloor(ctx, camX, effectiveW, dmg);
  } else {
    ctx.drawImage(getOrganicTerrainCacheL2(state.zone), 0, 0);
  }

  // Prop Dekorasi Lantai Ruang Kelas (Penghapus, Bolpoin, Tempat Pensil, Penggaris, Pesawat Kertas)
  if (state.zone.id === 'area-mitigasi-gempa') {
    drawClassroomFloorProps(ctx, camX, effectiveW, state.animTick);
  }

  // Platform & Jembatan Kerak Baru (Magma Beku) / Karang Andesit
  if (state.zone.platforms) {
    for (const plat of state.zone.platforms) {
      drawPlatformL2(ctx, plat, state.animTick);
    }
  }

  // ── 5. MAP OBJECTS (CATATAN GEOLOGIS, DISCOVERIES, GATES, PINTU KELAS, KAPSUL AKHIR) ──
  for (const obj of state.zone.objects) {
    if (obj.type === 'crystal') {
      if (!state.collectedCrystals.has(obj.id)) {
        drawCrystal(ctx, obj.px, obj.py, state.animTick);
      }
    } else if (obj.type === 'info_sign') {
      drawInfoSign(ctx, obj.px, obj.py);
    } else if (obj.type === 'discovery') {
      drawDiscoveryTotem(ctx, obj.px, obj.py, state.animTick);
    } else if (obj.type === 'challenge_gate') {
      const isUnlocked = state.unlockedGates.has(obj.id);
      const label = state.zone.id === 'area-pos-pengamatan-merapi'
        ? 'TTS PRABENCANA MERAPI'
        : state.zone.id === 'area-barak-pengungsian'
          ? 'TTS PASCABENCANA ERUPSI'
          : state.zone.id === 'area-mitigasi-erupsi'
            ? 'TTS ERUPSI MERAPI'
            : 'TTS SIAGA GEMPA';
      drawSeismicVaultGate(ctx, obj.px, obj.py, isUnlocked, state.animTick, label);
    } else if (obj.type === 'portal_exit') {
      const isUnlocked = state.zone.id === 'area-simulasi-merapi'
        ? state.unlockedGates.has('l2_gate_volcano_sim')
        : state.zone.id === 'area-pos-pengamatan-merapi'
          ? state.unlockedGates.has('l2_gate_volcano_prep')
          : state.zone.id === 'area-lapangan-evakuasi'
            ? state.unlockedGates.has('l2_gate_pascabencana')
            : state.zone.id === 'area-simulasi-gempa'
              ? state.unlockedGates.has('l2_gate_gempa_sim')
              : state.unlockedGates.has('l2_gate_gempa');
      const labelText = isUnlocked
        ? (state.zone.id === 'area-simulasi-merapi'
          ? '[KE BARAK PENGUNGSIAN (AREA 6)]'
          : state.zone.id === 'area-pos-pengamatan-merapi'
            ? '[JALUR MENUJU SIMULASI ERUPSI]'
            : state.zone.id === 'area-lapangan-evakuasi'
              ? '[JALUR POS PENGAMATAN TERBUKA]'
              : state.zone.id === 'area-simulasi-gempa'
                ? '[PINTU EVAKUASI LAPANGAN]'
                : '[PINTU AREA 2 TERBUKA]')
        : (state.zone.id === 'area-simulasi-merapi'
          ? '[SELESAIKAN EVAKUASI DUSUN]'
          : state.zone.id === 'area-pos-pengamatan-merapi'
            ? '[GERBANG EVAKUASI TERKUNCI]'
            : state.zone.id === 'area-lapangan-evakuasi'
              ? '[GERBANG EVAKUASI TERKUNCI]'
              : state.zone.id === 'area-simulasi-gempa'
                ? '[PINTU EVAKUASI TERKUNCI]'
                : '[PINTU AREA 2 TERKUNCI]');
      if (state.zone.id === 'area-simulasi-merapi') {
        // Jangan gambar gerbang keluar di Map 1 & Map 2 atau saat simulasi aktif (langsung tembus ke kanan)
        if (!state.volcanoSim || state.volcanoSim.phase === 'volcano_completed') {
          drawVolcanoEvacuationExitGate(ctx, obj.px, obj.py, state.animTick, isUnlocked, labelText);
        }
      } else if (state.zone.id === 'area-lapangan-evakuasi') {
        drawAssemblyFieldExitGate(ctx, obj.px, obj.py, state.animTick, isUnlocked, labelText);
      } else if (state.zone.id === 'area-pos-pengamatan-merapi') {
        drawPosPgaExitGapura(ctx, obj.px, obj.py, state.animTick, isUnlocked, labelText);
      } else {
        drawClassroomExitDoor(ctx, obj.px, obj.py, state.animTick, isUnlocked, labelText);
      }
    } else if (obj.type === 'portal_back') {
      if (state.zone.id === 'area-barak-pengungsian') {
        drawShelterEntranceBackGate(ctx, obj.px, obj.py);
      } else if (state.zone.id === 'area-simulasi-merapi' || state.zone.id === 'area-pos-pengamatan-merapi') {
        // DI AREA 5: Gerbang ke area sebelumnya HANYA tampil di Map 1 atau Map 3 setelah simulasi selesai!
        if (state.zone.id === 'area-simulasi-merapi' && state.volcanoSim) {
          const showBackGate =
            state.volcanoSim.subMap === 1 ||
            (state.volcanoSim.subMap === 3 && state.volcanoSim.phase === 'volcano_completed');
          if (showBackGate) {
            drawMerapiBackGate(ctx, obj.px, obj.py);
          }
        } else {
          drawMerapiBackGate(ctx, obj.px, obj.py);
        }
      } else if (state.zone.id === 'area-lapangan-evakuasi') {
        drawAssemblyFieldBackDoor(ctx, obj.px, obj.py);
      } else {
        drawClassroomEntranceDoor(ctx, obj.px, obj.py);
      }
    } else if (obj.type === 'lander_capsule') {
      const isUnlocked = state.unlockedGates.has('l2_gate_shelter_recovery');
      drawFinalEvacuationCapsuleL2(ctx, obj.px, obj.py, isUnlocked, state.animTick);
    }

    // Prompt interaksi untuk objek pintu & kapsul
    const distToPlayer = Math.hypot(state.player.x - obj.px, state.player.y - obj.py);
    if (distToPlayer < 55 && (obj.type === 'portal_exit' || obj.type === 'portal_back' || obj.type === 'lander_capsule')) {
      if (state.zone.id === 'area-simulasi-merapi' && state.volcanoSim) {
        if (obj.type === 'portal_exit' && state.volcanoSim.phase !== 'volcano_completed') continue;
        if (obj.type === 'portal_back') {
          const allowBack =
            state.volcanoSim.subMap === 1 ||
            (state.volcanoSim.subMap === 3 && state.volcanoSim.phase === 'volcano_completed');
          if (!allowBack) continue;
        }
      }
      drawInteractionPromptL2(ctx, obj.px, obj.py - 40, state.animTick);
    }
  }

  // 5.4. SATWA LIAR LERENG BERMIGRASI TURUN (AREA 5: FASE 3 SIAGA - DIGAMBAR DI ATAS PERMUKAAN TANAH)
  if (state.zone.id === 'area-simulasi-merapi' && state.volcanoSim?.migratingAnimals && state.volcanoSim.migratingAnimals.length > 0) {
    drawMigratingAnimals(ctx, state.volcanoSim.migratingAnimals, state.animTick, camX, effectiveW);
  }

  // Prompt interaksi pintu Gedung Pos Pengamatan Merapi (Area 4 Luar)
  if (state.zone.id === 'area-pos-pengamatan-merapi' && !state.isInsidePgaRoom) {
    if (Math.abs(state.player.x - 946) < 52) {
      drawInteractionPromptL2(ctx, 946, 268, state.animTick);
    }
  }

  // ── 5.5. RENDER NPC SEKOLAH LEVEL 2 & SIMULASI GEMPA ──
  const isArea2SimActive =
    state.zone.id === 'area-simulasi-gempa' &&
    state.simulation &&
    state.simulation.phase !== 'idle' &&
    state.simulation.phase !== 'completed';

  if (isArea2SimActive) {
    const sim = state.simulation;

    // A. RENDER NPC KELAS SESUAI FASE SIMULASI
    if (sim.phase === 'teaching' || sim.phase === 'quake_start' || sim.phase === 'quake_alert') {
      // Guru Bu Tyas di depan kelas (x: 200) menghadap ke murid (kanan)
      drawNpcWorldL2(ctx, 'bu_tyas', 200, 360, 'right', 0, false, state.animTick);
      // Seluruh 16 murid duduk tertib di kursi meja belajar masing-masing menghadap kiri (ke guru)
      CLASSROOM_STUDENTS_L2.forEach((st) => {
        drawStudentSittingInDesk(ctx, st.sitX, 360, st.type, undefined, state.animTick);
      });
      drawNpcWorldL2(ctx, 'resqy', 140, 360, 'right', 0, false, state.animTick);
    } else if (
      sim.phase === 'qte_cover' ||
      sim.phase === 'quake_holding' ||
      sim.phase === 'failed_impact' ||
      sim.phase === 'failed'
    ) {
      // Guru Bu Tyas BERLINDUNG di bawah meja guru
      drawTeacherCoverUnderDesk(ctx, 180, 360, state.animTick);
      // Semua 16 murid merunduk dan mendekap tengkuk di bawah meja masing-masing dengan tas di atas kepala
      CLASSROOM_STUDENTS_L2.forEach((st) => {
        drawStudentCoverUnderDesk(ctx, st.coverX, 360, st.type, undefined, state.animTick, true);
      });

      // Balon Seruan Teriakan Panik Murid (hanya di fase qte_cover & quake_holding)
      if (sim.phase === 'qte_cover' || sim.phase === 'quake_holding') {
        for (const shout of sim.panicShouts) {
          drawPanicSpeechBubble(ctx, shout.x, shout.y, shout.text, state.animTick, shout.staggerY || 0);
        }
      }
    } else if (sim.phase === 'quake_stopped') {
      // Guru Bu Tyas berdiri di depan kelas memberikan aba-aba evakuasi
      drawNpcWorldL2(ctx, 'bu_tyas', 190, 360, 'right', 0, false, state.animTick);
      // Murid-murid masih bersiap di bawah meja (tas di kepala)
      CLASSROOM_STUDENTS_L2.forEach((st) => {
        drawStudentCoverUnderDesk(ctx, st.coverX, 360, st.type, undefined, state.animTick, false);
      });
    } else if (sim.phase === 'evacuating' || sim.phase === 'completed') {
      // Bu Rahma memimpin di depan dan seluruh 16 siswa berbaris tertib dievakuasi menuju pintu keluar
      const buRahmaNpc = state.npcs.get('l2_sim_npc_bu_rahma');
      if (buRahmaNpc) {
        drawTeacherEvacuatingPose(ctx, buRahmaNpc.x, buRahmaNpc.y, state.animTick, buRahmaNpc.animFrame);
      }
      CLASSROOM_STUDENTS_L2.forEach((st) => {
        const npc = state.npcs.get(st.id);
        if (npc) {
          drawStudentEvacuatingPose(ctx, npc.x, npc.y, st.type, undefined, state.animTick, npc.animFrame);
        }
      });
    }

    // B. RENDER PUING-PUING ATAP JATUH (DEBRIS PARTICLES DENGAN VARIAN JELAS)
    if (sim.particles.length > 0) {
      for (const p of sim.particles) {
        ctx.save();
        ctx.translate(Math.round(p.x), Math.round(p.y));
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity ?? 1));

        if (p.type === 'tile') {
          // Papan Plafon Akustik (14-22px lebar)
          const w = p.width || 18;
          const h = p.height || 6;
          ctx.fillStyle = p.color;
          ctx.fillRect(-w / 2, -h / 2, w, h);
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 1;
          ctx.strokeRect(-w / 2, -h / 2, w, h);
          // Retakan halus plafon
          ctx.strokeStyle = '#cbd5e1';
          ctx.beginPath();
          ctx.moveTo(-w / 4, -h / 2);
          ctx.lineTo(0, h / 2);
          ctx.stroke();
        } else if (p.type === 'rock') {
          // Bongkahan Batu Beton / Semen (8-14px)
          const sz = p.size || 10;
          ctx.fillStyle = p.color;
          ctx.fillRect(-sz / 2, -sz / 2, sz, sz);
          ctx.fillStyle = '#94a3b8';
          ctx.fillRect(-sz / 2, -sz / 2, sz, 2); // Highlight atas
          ctx.fillStyle = '#334155';
          ctx.fillRect(-sz / 2, sz / 2 - 2, sz, 2); // Bayangan bawah
        } else {
          // Serpihan Plester & Debu Kapur
          const sz = p.size || 3;
          ctx.fillStyle = p.color;
          ctx.fillRect(-sz / 2, -sz / 2, sz, sz);
        }

        ctx.restore();
      }
    }

    // C. RENDER SISWA PEMAIN SESUAI FASE SIMULASI
    if (sim.phase === 'failed_impact') {
      const rock = sim.fallingRock;
      // Gambar animasi karakter tersungkur pusing atau panik melihat ke atas
      drawPlayerStunnedByRockImpact(
        ctx,
        498,
        360,
        avatarConfig,
        state.animTick,
        sim.failureImpactTimer || 0,
        rock?.hit ?? false,
        rock?.shards ?? []
      );

      // Jika batu belum menabrak kepala: render batu besar yang meluncur dari plafon
      if (rock && !rock.hit) {
        ctx.save();
        // Speed lines di atas batu yang meluncur
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(rock.x - 7, rock.y - 18);
        ctx.lineTo(rock.x - 7, rock.y - 6);
        ctx.moveTo(rock.x + 7, rock.y - 24);
        ctx.lineTo(rock.x + 7, rock.y - 8);
        ctx.stroke();

        // Bongkahan Batu Beton Besar Runtuh (28px)
        ctx.translate(rock.x, rock.y);
        ctx.fillStyle = '#475569';
        ctx.fillRect(-rock.size / 2, -rock.size / 2, rock.size, rock.size);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(-rock.size / 2 + 2, -rock.size / 2 + 2, rock.size - 4, rock.size - 4);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(-rock.size / 2, -rock.size / 2, rock.size, 3);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-rock.size / 2, rock.size / 2 - 3, rock.size, 3);
        // Garis retak batu
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-rock.size / 4, -rock.size / 2);
        ctx.lineTo(2, 0);
        ctx.lineTo(-2, rock.size / 2);
        ctx.stroke();
        ctx.restore();
      }
      drawMascotWorldL2(ctx, 498, 330, 'left', state.animTick);
    } else if (sim.playerCrouchedUnderDesk) {
      drawStudentCoverUnderDesk(ctx, 482, 360, 'player', avatarConfig, state.animTick, sim.phase === 'quake_holding');
      drawMascotWorldL2(ctx, 482, 330, 'left', state.animTick);
    } else if (sim.playerAtDesk) {
      drawStudentSittingInDesk(ctx, 498, 360, 'player', avatarConfig, state.animTick);
      drawMascotWorldL2(ctx, 498, 330, 'left', state.animTick);
    } else if (sim.phase === 'evacuating') {
      drawStudentEvacuatingPose(ctx, state.player.x, state.player.y, 'player', avatarConfig, state.animTick, state.player.walkFrame);
      drawMascotWorldL2(ctx, state.player.x, state.player.y - 12, state.player.dir, state.animTick);
    } else {
      drawStudentCharacter(
        ctx,
        state.player.x,
        state.player.y,
        state.player.dir,
        state.player.isWalking,
        state.player.walkFrame,
        state.player.onGround,
        state.player.vy,
        avatarConfig,
        state.zone.id
      );
      drawMascotWorldL2(ctx, state.player.x, state.player.y, state.player.dir, state.animTick);
    }
  } else {
    // ── MODE NORMAL DI LUAR SIMULASI (AREA 1 & AREA 2 EKSPLORASI) ──
    const isArea5PostEruption = state.zone.id === 'area-simulasi-merapi' &&
      (state.unlockedGates.has('l2_gate_volcano_sim') || state.volcanoSim?.phase === 'volcano_completed') &&
      (!state.volcanoSim || state.volcanoSim.phase === 'idle' || state.volcanoSim.phase === 'volcano_completed');

    const isArea2PostQuake = state.zone.id === 'area-simulasi-gempa' &&
      (state.unlockedGates.has('l2_gate_gempa_sim') || state.simulation?.phase === 'completed') &&
      (!state.simulation || state.simulation.phase === 'idle' || state.simulation.phase === 'completed');

    const isVolcanoBoarded = state.zone.id === 'area-simulasi-merapi' &&
      state.volcanoSim &&
      state.volcanoSim.phase !== 'volcano_completed' &&
      (state.volcanoSim.truckState === 'boarding' || state.volcanoSim.truckState === 'driving' || state.volcanoSim.phase === 'volcano_evacuated');

    if (state.npcs && !isArea5PostEruption && !isArea2PostQuake && !isVolcanoBoarded) {
      const isVolcanoSimActive =
        state.zone.id === 'area-simulasi-merapi' &&
        Boolean(
          state.volcanoSim &&
          state.volcanoSim.phase !== 'idle' &&
          state.volcanoSim.phase !== 'volcano_completed'
        );

      for (const npc of state.npcs.values()) {
        if (npc.x + 40 < camX || npc.x - 40 > camX + viewW) continue;
        drawNpcWorldL2(
          ctx,
          npc.type,
          npc.x,
          npc.y,
          npc.dir,
          npc.animFrame,
          isVolcanoSimActive ? false : npc.isNearPlayer,
          state.animTick
        );

        if (npc.hasMaterial) {
          const isDiscovered = npc.discoveryKey ? state.discoveredPoints?.has(npc.discoveryKey) ?? false : false;
          drawNpcMaterialBadgeL2(ctx, npc.x, npc.y - 38, state.animTick, isDiscovered);
        }

        if (npc.isNearPlayer && !isVolcanoSimActive) {
          drawNpcInteractionPromptL2(ctx, npc.x, npc.y, state.animTick);
        }
      }
    }

    const isInvul = state.player.invulnerableTimer > 0;
    if (!isVolcanoBoarded) {
      if (!isInvul || Math.floor(state.animTick / 4) % 2 === 0) {
        if (state.player.thrusterTimer > 0) {
          const drawX = Math.round(state.player.x - PLAYER_FRAME_W / 2);
          const drawY = Math.round(state.player.y - PLAYER_FRAME_H);
          ctx.save();
          const tAlpha = state.player.thrusterTimer / 16;
          ctx.globalAlpha = tAlpha;
          const flameH = 6 + (state.player.thrusterTimer % 4) * 2;

          ctx.fillStyle = '#00e5ff';
          ctx.fillRect(drawX + 6, drawY + PLAYER_FRAME_H - 1, 4, flameH);
          ctx.fillRect(drawX + 14, drawY + PLAYER_FRAME_H - 1, 4, flameH);

          ctx.fillStyle = '#ffffff';
          ctx.fillRect(drawX + 7, drawY + PLAYER_FRAME_H, 2, Math.max(2, flameH - 3));
          ctx.fillRect(drawX + 15, drawY + PLAYER_FRAME_H, 2, Math.max(2, flameH - 3));

          ctx.fillStyle = '#38bdf8';
          const sparkY = drawY + PLAYER_FRAME_H + flameH + (16 - state.player.thrusterTimer) * 1.2;
          const wobble = (state.animTick + state.player.thrusterTimer) % 3;
          ctx.fillRect(drawX + 6 + wobble, sparkY, 2, 2);
          ctx.fillRect(drawX + 14 - wobble, sparkY + 2, 2, 2);

          ctx.fillStyle = 'rgba(0, 229, 255, 0.2)';
          ctx.beginPath();
          ctx.arc(state.player.x, state.player.y + 4, 10, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }

        drawStudentCharacter(
          ctx,
          state.player.x,
          state.player.y,
          state.player.dir,
          state.player.isWalking,
          state.player.walkFrame,
          state.player.onGround,
          state.player.vy,
          avatarConfig,
          state.zone.id
        );

        // Perlengkapan Siaga Erupsi Merapi (Tas Siaga Bencana di Punggung & Masker N95 di Wajah)
        if (state.volcanoSim?.apdEquipped) {
          drawPlayerDisasterGearOverlay(
            ctx,
            state.player.x,
            state.player.y,
            state.player.dir,
            state.player.isWalking,
            state.player.walkFrame,
            state.player.onGround
          );
        }

        // Maskot Resqy di pundak digambar di area lain; di Area 2 ruang kelas, Resqy hadir sebagai NPC instruktur di depan kelas
        if (state.zone.id !== 'area-simulasi-gempa') {
          drawMascotWorldL2(ctx, state.player.x, state.player.y, state.player.dir, state.animTick);
        }

        // Bubble chat interaktif & teriakan panik evakuasi warga dusun KRB III (Area 5)
        if (state.zone.id === 'area-simulasi-merapi' && state.volcanoSim && !isArea5PostEruption) {
          drawVolcanoFleeingNpcPanicBubbles(ctx, state.npcs, state.volcanoSim.phase, state.animTick);
          drawVolcanoVillagerWorldBubbles(ctx, state.volcanoSim, state.animTick, state);
          if (state.volcanoSim.speechBubbleText) {
            drawPlayerVolcanoSpeechBubble(ctx, state.player.x, state.player.y, state.volcanoSim.speechBubbleText, state.animTick);
          }
        }
      }
    } else {
      // Saat seluruh warga & pemain sudah naik ke mobil evakuasi: Resqy terbang mengawal di atas truk
      if (state.volcanoSim && state.volcanoSim.phase !== 'volcano_completed') {
        drawMascotWorldL2(ctx, state.volcanoSim.truckX + 24, 290, 'right', state.animTick);
      }
    }
  }

  ctx.restore();

  // ── 7.5. OVERLAY SIMULASI GEMPA BUMI (QTE 10s & TIMER GEMPA 30s) ──
  if (isArea2SimActive && state.simulation) {
    if (state.simulation.phase === 'qte_cover') {
      drawSimulationQteOverlay(
        ctx,
        viewW,
        viewH,
        state.simulation.qteTimer,
        state.simulation.qteMaxTimer,
        state.animTick,
        state.simulation.quakeScenario
      );
    } else if (state.simulation.phase === 'quake_holding') {
      drawSimulationQuakeTimerOverlay(ctx, viewW, viewH, state.simulation.quakeTimer, state.simulation.quakeMaxTimer);
    } else if (state.simulation.phase === 'quake_stopped') {
      drawSimulationEvacuationPrompt(ctx, viewW, viewH);
    }
  }

  // ── 7.6. OVERLAY SIMULASI ERUPSI MERAPI (STATUS PVMBG & QTE 1, 2, 3) ──
  if (state.zone.id === 'area-simulasi-merapi' && state.volcanoSim) {
    drawVolcanoSimulationOverlays(ctx, viewW, viewH, state);
  }

  // ── 8. NOTIFIKASI PERALIHAN AREA ALA LEVEL 1 (POPUP KARTU EMAS SCREENSHOT 3) ──
  if (state.areaTransitionBanner) {
    drawAreaTransitionBannerL2(ctx, state.areaTransitionBanner, viewW, viewH);
  }
}

// ── RENDER BANNER PERALIHAN AREA ALA LEVEL 1 (SCREENSHOT 3) ──
export function drawAreaTransitionBannerL2(
  ctx: CanvasRenderingContext2D,
  banner: AreaTransitionBannerL2,
  canvasW: number,
  canvasH: number
): void {
  const { direction, areaName, subtitle, timer, maxTimer } = banner;
  const progress = 1 - timer / maxTimer;

  // Transisi fade in 0..0.10, tahan 0.10..0.88, fade out 0.88..1.0
  let alpha = 1;
  if (progress < 0.10) {
    alpha = progress / 0.10;
  } else if (progress > 0.88) {
    alpha = (1 - progress) / 0.12;
  }
  alpha = Math.max(0, Math.min(1, alpha));

  ctx.save();
  ctx.globalAlpha = alpha;

  // Backdrop gelap fokus (Level 1 style)
  ctx.fillStyle = 'rgba(5, 8, 15, 0.88)';
  ctx.fillRect(0, 0, canvasW, canvasH);

  const cx = canvasW / 2;
  const cy = canvasH / 2;

  // Panel kartu pengantar zona (Format Lebih Besar & Megah)
  const isCompact = canvasW < 768;
  const cardW = Math.min(canvasW - 48, isCompact ? 600 : 820);
  const cardH = isCompact ? 190 : 230;
  const cardX = cx - cardW / 2;
  const cardY = cy - cardH / 2;

  // Bayangan luar kartu retro (Deep Drop Shadow)
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

  // 1. Label Arah Perpindahan (Cyan Terang - Huruf Sangat Jelas)
  const headerFontSize = isCompact ? 14 : 17;
  ctx.font = `bold ${headerFontSize}px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif`;
  ctx.fillStyle = '#38bdf8';
  const headerY = cy - (isCompact ? 50 : 60);
  ctx.fillText(
    direction === 'enter' ? '▼  MEMASUKI AREA BARU  ▼' : '▲  KEMBALI KE AREA SEBELUMNYA  ▲',
    cx,
    headerY
  );

  // 2. Nama Area (Judul Utama Kuning Emas Cerah - Besar, Tajam, & Terbaca Jelas)
  const hasSubtitle = Boolean(subtitle && subtitle.trim() !== '');
  const titleFontSize = isCompact
    ? (areaName.length > 22 ? 22 : 28)
    : (areaName.length > 22 ? 32 : 38);
  ctx.font = `800 ${titleFontSize}px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif`;

  ctx.save();
  ctx.shadowColor = 'rgba(250, 204, 21, 0.5)';
  ctx.shadowBlur = 16;
  ctx.fillStyle = '#fef08a';
  const titleY = hasSubtitle ? cy : cy + (isCompact ? 12 : 16);
  ctx.fillText(areaName, cx, titleY);
  ctx.restore();

  // 3. Subtitle / Deskripsi Karakteristik Area (Kuning Amber Hangat)
  if (hasSubtitle) {
    const subFontSize = isCompact
      ? (subtitle.length > 40 ? 12.5 : 14)
      : (subtitle.length > 45 ? 14.5 : 16.5);
    ctx.font = `600 ${subFontSize}px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif`;
    ctx.fillStyle = '#fbbf24';
    const subY = cy + (isCompact ? 50 : 60);
    ctx.fillText(subtitle, cx, subY);
  }

  ctx.restore();
  ctx.textAlign = 'start';
  ctx.textBaseline = 'alphabetic';
}

// ── GERBANG JALUR EVAKUASI DUSUN MENUJU BARAK PENGUNGSIAN (AREA 5 EXIT PORTAL) ──
export function drawVolcanoEvacuationExitGate(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  animTick: number,
  isUnlocked: boolean,
  labelText: string = '[KE BARAK PENGUNGSIAN (AREA 6)]'
): void {
  ctx.save();
  ctx.translate(px, py);

  // Dua Tiang Baja Rambu Jalur Evakuasi BNPB (Kiri & Kanan)
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(-32, -84, 8, 84);
  ctx.fillRect(24, -84, 8, 84);
  ctx.fillStyle = '#c2410c';
  ctx.fillRect(-30, -84, 4, 84);
  ctx.fillRect(26, -84, 4, 84);

  // Palang Rangka Baja Atas
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-44, -94, 88, 12);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-42, -92, 84, 8);

  // Rambu Hijau Resmi JALUR EVAKUASI (Standar BNPB)
  const signW = 96;
  const signH = 34;
  const signX = -signW / 2;
  const signY = -90;
  const signBg = isUnlocked ? '#007a3d' : '#334155';
  const signBorder = isUnlocked ? '#86efac' : '#94a3b8';
  drawRoundedBadgeL2(ctx, signX, signY, signW, signH, 5, signBg, signBorder, 2);

  // Teks Rambu Evakuasi
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 10.5px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('JALUR EVAKUASI', 0, signY + 11);

  // Subteks arah
  ctx.font = 'bold 8.5px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = isUnlocked ? '#86efac' : '#cbd5e1';
  ctx.fillText(isUnlocked ? 'KE BARAK KRB I →' : 'TERKUNCI', 0, signY + 23);

  // Lampu Sirine Siaga di Puncak Tiang
  const beaconColor = isUnlocked ? '#22c55e' : (Math.floor(animTick / 10) % 2 === 0 ? '#ef4444' : '#7f1d1d');
  ctx.fillStyle = beaconColor;
  ctx.fillRect(-30, -100, 6, 8);
  ctx.fillRect(24, -100, 6, 8);

  // Label Banner Mengambang di Atas Gerbang
  const pulse = Math.sin(animTick * 0.08) * 2;
  const bannerY = -124 + pulse;
  const bannerW = 210;
  const bannerH = 24;
  const bannerX = -bannerW / 2;
  const bannerBg = 'rgba(15, 23, 42, 0.95)';
  const bannerStroke = isUnlocked ? '#22c55e' : '#f59e0b';
  drawRoundedBadgeL2(ctx, bannerX, bannerY, bannerW, bannerH, 6, bannerBg, bannerStroke, 1.8);

  ctx.fillStyle = isUnlocked ? '#4ade80' : '#fbbf24';
  ctx.font = 'bold 9.5px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(labelText, 0, bannerY + bannerH / 2);

  ctx.restore();
}

// ── GAPURA JALUR MENUJU SIMULASI ERUPSI MERAPI (AREA 4 EXIT GAPURA DESA TANGGUH) ──
export function drawPosPgaExitGapura(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  animTick: number,
  isUnlocked: boolean,
  labelText: string = '[JALUR MENUJU SIMULASI ERUPSI]'
): void {
  ctx.save();
  ctx.translate(px, py);

  // 1. Dasar / Umpak Kaki Gapura Batu Andesit Berundak (Kiri & Kanan)
  // Pilar Kiri di x: -44, Pilar Kanan di x: +44
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-52, -6, 18, 6);
  ctx.fillRect(34, -6, 18, 6);
  ctx.fillStyle = '#334155';
  ctx.fillRect(-50, -12, 14, 6);
  ctx.fillRect(36, -12, 14, 6);

  // 2. Tiang Pilar Gapura Bata Merah & Andesit Berundak
  // Tiang Kiri (-48 sampai -38, lebar 10)
  ctx.fillStyle = '#c2410c';
  ctx.fillRect(-48, -72, 10, 60);
  ctx.fillStyle = '#9a3412';
  ctx.fillRect(-48, -72, 4, 60);
  // Garis-garis bata merah
  ctx.fillStyle = '#7c2d12';
  for (let by = -66; by < -12; by += 8) {
    ctx.fillRect(-48, by, 10, 1.5);
  }

  // Tiang Kanan (+38 sampai +48, lebar 10)
  ctx.fillStyle = '#c2410c';
  ctx.fillRect(38, -72, 10, 60);
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(44, -72, 4, 60);
  for (let by = -66; by < -12; by += 8) {
    ctx.fillRect(38, by, 10, 1.5);
  }

  // Kepala Pilar Berundak
  ctx.fillStyle = '#78350f';
  ctx.fillRect(-51, -76, 16, 5);
  ctx.fillRect(35, -76, 16, 5);
  ctx.fillStyle = '#92400e';
  ctx.fillRect(-49, -75, 12, 3);
  ctx.fillRect(37, -75, 12, 3);

  // 3. Balok Palang Kayu Jati Melintang di Atas Gapura
  ctx.fillStyle = '#451a03';
  ctx.fillRect(-56, -82, 112, 7);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(-54, -81, 108, 5);

  // 4. Atap Genteng Limasan / Mini Joglo Khas Pedesaan Jawa
  // Susunan genteng bertingkat
  ctx.fillStyle = '#9a3412';
  ctx.fillRect(-58, -87, 116, 6);
  ctx.fillStyle = '#b45309';
  ctx.fillRect(-56, -86, 112, 4);

  // Tingkat Atap Tengah
  ctx.fillStyle = '#9a3412';
  ctx.fillRect(-44, -93, 88, 7);
  ctx.fillStyle = '#b45309';
  ctx.fillRect(-42, -92, 84, 5);

  // Mahkota Atap Puncak
  ctx.fillStyle = '#78350f';
  ctx.fillRect(-22, -98, 44, 6);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(-8, -102, 16, 4); // Pataka puncak gapura

  // 5. Papan Nama Plang Gapura di Tengah (Di Bawah Balok Kayu)
  const signW = 76;
  const signH = 18;
  const signY = -74;
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-signW / 2, signY, signW, signH);
  ctx.strokeStyle = isUnlocked ? '#22c55e' : '#f59e0b';
  ctx.lineWidth = 1.2;
  ctx.strokeRect(-signW / 2, signY, signW, signH);

  // Teks Plang Gapura
  ctx.fillStyle = isUnlocked ? '#86efac' : '#fef08a';
  ctx.font = 'bold 8px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('JALUR SIMULASI', 0, signY + 6);

  ctx.fillStyle = isUnlocked ? '#4ade80' : '#f87171';
  ctx.font = 'bold 6.5px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(isUnlocked ? 'MENUJU AREA 5 ➔' : 'GERBANG TERKUNCI', 0, signY + 13.5);

  // 6. Lampu Lentera Pos Ronda di Kedua Tiang
  const lanternColor = isUnlocked ? '#4ade80' : '#facc15';
  // Lentera Kiri
  ctx.fillStyle = '#451a03';
  ctx.fillRect(-53, -48, 5, 2);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-57, -54, 7, 10);
  ctx.fillStyle = lanternColor;
  ctx.fillRect(-55, -52, 5, 6);

  // Lentera Kanan
  ctx.fillStyle = '#451a03';
  ctx.fillRect(48, -48, 5, 2);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(50, -54, 7, 10);
  ctx.fillStyle = lanternColor;
  ctx.fillRect(50, -52, 5, 6);

  // 7. Lorong Tengah Terbuka (Jalan Terbuka vs Palang Rintangan Terkunci)
  if (isUnlocked) {
    // Jalur Terbuka: Sorotan Pendaran Hijau/Emas di Lantai
    const floorGlow = ctx.createLinearGradient(0, -30, 0, 0);
    floorGlow.addColorStop(0, 'rgba(74, 222, 128, 0.22)');
    floorGlow.addColorStop(1, 'rgba(74, 222, 128, 0.02)');
    ctx.fillStyle = floorGlow;
    ctx.fillRect(-38, -35, 76, 35);

    // Panah Jalan Hijau Mengarahkan ke Kanan
    const arrowBounce = Math.sin(animTick * 0.12) * 3;
    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('➔', arrowBounce, -18);
  } else {
    // Jalur Terkunci: Palang Rintangan Portal Bergaris Garis Kuning-Hitam Retro
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(-38, -28, 76, 6);
    // Garis serong kuning
    ctx.fillStyle = '#facc15';
    for (let sx = -36; sx < 36; sx += 12) {
      ctx.beginPath();
      ctx.moveTo(sx, -22);
      ctx.lineTo(sx + 6, -28);
      ctx.lineTo(sx + 10, -28);
      ctx.lineTo(sx + 4, -22);
      ctx.closePath();
      ctx.fill();
    }

    // Gembok Kuning Retro di Tengah
    ctx.fillStyle = '#eab308';
    ctx.fillRect(-5, -29, 10, 8);
    ctx.strokeStyle = '#713f12';
    ctx.lineWidth = 1;
    ctx.strokeRect(-5, -29, 10, 8);
    // Lingkar gembok
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, -29, 3.5, Math.PI, 0);
    ctx.stroke();
  }

  // 8. Label Banner Mengambang di Puncak (Konsisten Gaya Level 2)
  const pulse = Math.sin(animTick * 0.08) * 2;
  const bannerY = -120 + pulse;
  const bannerW = 210;
  const bannerH = 24;
  const bannerX = -bannerW / 2;
  const bannerBg = 'rgba(15, 23, 42, 0.95)';
  const bannerStroke = isUnlocked ? '#22c55e' : '#f59e0b';
  drawRoundedBadgeL2(ctx, bannerX, bannerY, bannerW, bannerH, 6, bannerBg, bannerStroke, 1.8);

  ctx.fillStyle = isUnlocked ? '#4ade80' : '#fbbf24';
  ctx.font = 'bold 9.5px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(labelText, 0, bannerY + bannerH / 2);

  ctx.restore();
}

// ══════════════════════════════════════════════════════════════════════════
// 4. ATMOSPHERE & GROUND: PRABENCANA ERUPSI MERAPI (AREA 4: POS PGA & KRB III)

// ══════════════════════════════════════════════════════════════════════════
// J. OVERLAYS UI: WIDGET PVMBG & 3 QTE INTERAKTIF (KENTONGAN, RESCUE 3 WARGA, MOBIL EVAKUASI)
// ══════════════════════════════════════════════════════════════════════════

// BUBBLE CHAT INTERAKTIF DI ATAS KEPALA WARGA (WORLD SPACE)
export function drawVolcanoVillagerWorldBubbles(
  ctx: CanvasRenderingContext2D,
  sim: VolcanoSimulationDataL2,
  animTick: number,
  state?: GameStateL2
): void {
  const isRescuePhase =
    sim.phase === 'fase4_awas_rescue' ||
    sim.phase === 'qte_rescue_villagers' ||
    sim.phase === 'fase4_awas_siren' ||
    sim.phase === 'eruption_climax';
  if (!isRescuePhase) return;

  for (const v of sim.villagersToRescue) {
    if (v.rescued) continue;

    const npc = state?.npcs?.get(v.npcId);
    const vx = npc ? npc.x : v.x;
    const vy = npc ? npc.y : v.y;

    const bounce = Math.sin(animTick * 0.22 + vx * 0.08) * 4.5;
    const bx = vx;
    const by = vy - 54 + bounce;

    ctx.save();
    // Drop shadow tebal
    ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 3;

    // Bubble background putih tebal
    const bW = 104;
    const bH = 28;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(bx - bW / 2, by - bH / 2, bW, bH, 8);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    const isRedPulse = Math.floor(animTick / 8) % 2 === 0;
    ctx.strokeStyle = isRedPulse ? '#dc2626' : '#ea580c';
    ctx.lineWidth = 2.8;
    ctx.stroke();

    // Ekor bubble menunjuk ke kepala warga
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(bx - 6, by + bH / 2 - 1);
    ctx.lineTo(bx, by + bH / 2 + 9);
    ctx.lineTo(bx + 6, by + bH / 2 - 1);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = isRedPulse ? '#dc2626' : '#ea580c';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(bx - 6, by + bH / 2 - 1);
    ctx.lineTo(bx, by + bH / 2 + 9);
    ctx.lineTo(bx + 6, by + bH / 2 - 1);
    ctx.stroke();

    // Teks teriakan minta tolong: "TOLONGGG!"
    ctx.fillStyle = isRedPulse ? '#dc2626' : '#991b1b';
    ctx.font = '900 12px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('TOLONGGG!', bx, by);

    // Partikel tetesan keringat cemas
    const sweatProgress = (animTick * 0.25 + vx * 0.05) % 8;
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(bx + bW / 2 + 5, by - 6 + sweatProgress, 2.2, 0, Math.PI * 2);
    ctx.arc(bx - bW / 2 - 5, by - 3 + sweatProgress, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
  // Catatan: Warga yang sudah diselamatkan tidak lagi menampilkan bubble tolong,
  // melainkan langsung berjalan beriringan mengikuti pemain sampai naik Mobil Evakuasi.
}

export function drawVolcanoSimulationOverlays(
  ctx: CanvasRenderingContext2D,
  viewW: number,
  viewH: number,
  state: GameStateL2
): void {
  const sim = state.volcanoSim;
  if (!sim) return;

  // A. TRANSISI LAYAR GELAP "BEBERAPA HARI KEMUDIAN..." (Menutupi seluruh layar saat jeda waktu)
  if (
    sim.phase === 'fase2_dark_screen' ||
    sim.phase === 'fase3_beberapa_hari_kemudian' ||
    sim.phase === 'fase3_map3_dark_screen'
  ) {
    drawVolcanoDarkScreenTransition(ctx, viewW, viewH, sim.darkScreenTimer ?? 180);
    return;
  }

  const hasActiveActionCard =
    sim.phase === 'fase4_awas_siren' ||
    sim.phase === 'fase4_awas_rescue' ||
    sim.phase === 'fase4_awas_truck' ||
    sim.phase === 'qte_run_kentongan' ||
    sim.phase === 'qte_rescue_villagers' ||
    sim.phase === 'qte_truck_evac';

  // B. BANNER STATUS GUNUNG UTAMA DI ATAS (Hanya saat TIDAK ada action card aktif agar tidak saling tumpuk!)
  if (!hasActiveActionCard && sim.phase !== 'idle' && sim.phase !== 'volcano_completed') {
    drawTopVolcanoStatusBanner(ctx, viewW, sim.statusLevel, state.animTick);
  }

  // 3. OVERLAY GEMPA BESAR: Teks tengah layar dihilangkan sesuai permintaan user ("di ss an kedua itu diilangin aja")

  // 4. OVERLAY BUNYIKAN SIRINE EWS (FASE 4 AWAS)
  if (sim.phase === 'fase4_awas_siren') {
    drawVolcanoSirenPromptOverlay(ctx, viewW, viewH, sim, state);
  }
  // 4b. QTE KENTONGAN (FASE 2 WASPADA MAP 1)
  else if (sim.phase === 'qte_run_kentongan') {
    drawVolcanoQteKentonganOverlay(ctx, viewW, viewH, sim, state);
  }
  // 5. RADAR & RESCUE WARGA (FASE 4 AWAS)
  else if (sim.phase === 'fase4_awas_rescue' || sim.phase === 'qte_rescue_villagers') {
    const scale = Math.max(0.5, viewH / MAP_HEIGHT_PX);
    const effectiveW = viewW / scale;
    const targetCamX = state.player.x - effectiveW / 2;
    const camX = Math.max(0, Math.min(MAP_WIDTH_PX - effectiveW, targetCamX));
    drawOffscreenVillagerRadar(ctx, viewW, viewH, sim, camX, scale, state.animTick, state);
    drawVolcanoQteRescueOverlay(ctx, viewW, viewH, sim, state.animTick);
  }
  // 6. OVERLAY LARI KE MOBIL EVAKUASI (FASE 4 AWAS)
  else if (sim.phase === 'fase4_awas_truck' || sim.phase === 'qte_truck_evac') {
    drawVolcanoQteTruckOverlay(ctx, viewW, viewH, sim, state);
  }
  // 7. OVERLAY GAGAL & RETRY
  else if (sim.phase === 'failed') {
    drawVolcanoFailedOverlay(ctx, viewW, viewH, sim);
  }
}

// 1. BANNER STATUS UTAMA GUNUNG MERAPI (TOP CENTER, BERWIBAWA, HURUF BESAR & JELAS TERBACA)
function drawTopVolcanoStatusBanner(
  ctx: CanvasRenderingContext2D,
  viewW: number,
  status: 'NORMAL' | 'WASPADA' | 'SIAGA' | 'AWAS',
  animTick: number
): void {
  const cx = viewW / 2;
  const isCompact = viewW < 768;
  const cardW = Math.min(viewW - 28, isCompact ? 520 : 760);
  const cardH = isCompact ? 46 : 56;
  const cardY = isCompact ? 72 : 82;

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 4;

  ctx.fillStyle = 'rgba(10, 16, 30, 0.96)';
  ctx.beginPath();
  ctx.roundRect(cx - cardW / 2, cardY, cardW, cardH, 10);
  ctx.fill();
  ctx.shadowColor = 'transparent';

  let borderColor = '#22c55e';
  let cornerColor = '#4ade80';
  let statusText = '● STATUS GUNUNG MERAPI: LEVEL I (NORMAL) ●';
  let textColor = '#86efac';

  if (status === 'WASPADA') {
    borderColor = '#facc15';
    cornerColor = '#fde047';
    statusText = '▲ STATUS GUNUNG MERAPI: LEVEL II (WASPADA) ▲';
    textColor = '#fef08a';
  } else if (status === 'SIAGA') {
    borderColor = '#f97316';
    cornerColor = '#fb923c';
    statusText = '▲ STATUS GUNUNG MERAPI: LEVEL III (SIAGA) ▲';
    textColor = '#fed7aa';
  } else if (status === 'AWAS') {
    const isFlashing = Math.floor(animTick / 12) % 2 === 0;
    borderColor = isFlashing ? '#f87171' : '#ef4444';
    cornerColor = isFlashing ? '#ffffff' : '#ef4444';
    statusText = '▲ STATUS GUNUNG MERAPI: LEVEL IV (AWAS) ▲';
    textColor = isFlashing ? '#fee2e2' : '#fca5a5';
  }

  ctx.strokeStyle = borderColor;
  ctx.lineWidth = isCompact ? 2.8 : 3.5;
  ctx.stroke();

  // Corner brackets aksen retro-tactical
  const leftX = cx - cardW / 2;
  const rightX = cx + cardW / 2;
  const bW = isCompact ? 10 : 13;
  const bT = isCompact ? 2.5 : 3.5;
  ctx.fillStyle = cornerColor;
  ctx.fillRect(leftX + 4, cardY + 4, bW, bT);
  ctx.fillRect(leftX + 4, cardY + 4, bT, bW);
  ctx.fillRect(rightX - 4 - bW, cardY + 4, bW, bT);
  ctx.fillRect(rightX - 4 - bT, cardY + 4, bT, bW);
  ctx.fillRect(leftX + 4, cardY + cardH - 4 - bT, bW, bT);
  ctx.fillRect(leftX + 4, cardY + cardH - 4 - bW, bT, bW);
  ctx.fillRect(rightX - 4 - bW, cardY + cardH - 4 - bT, bW, bT);
  ctx.fillRect(rightX - 4 - bT, cardY + cardH - 4 - bW, bT, bW);

  // Teks status besar, tebal, dan berwibawa
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = isCompact
    ? '900 14px "Plus Jakarta Sans", system-ui, sans-serif'
    : '900 20px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillStyle = textColor;
  ctx.shadowColor = borderColor;
  ctx.shadowBlur = 8;
  ctx.fillText(statusText, cx, cardY + cardH / 2);
  ctx.shadowBlur = 0;

  ctx.restore();
}

// 2. OVERLAY TRANSISI LAYAR GELAP DENGAN TEKS "BEBERAPA HARI KEMUDIAN..."
function drawVolcanoDarkScreenTransition(
  ctx: CanvasRenderingContext2D,
  viewW: number,
  viewH: number,
  timer: number
): void {
  ctx.save();
  // Layar hitam pekat / pitch black
  ctx.fillStyle = '#030712';
  ctx.fillRect(0, 0, viewW, viewH);

  const cx = viewW / 2;
  const cy = viewH / 2;

  // Animasi fade in halus (180->150), solid di tengah, fade out di akhir (30->0)
  let alpha = 1;
  if (timer > 150) {
    alpha = (180 - timer) / 30;
  } else if (timer < 30) {
    alpha = timer / 30;
  }
  alpha = Math.max(0, Math.min(1, alpha));

  ctx.globalAlpha = alpha;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Subtitle / Ikon jam pasir
  ctx.font = '700 15px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('⏳ WAKTU BERLALU', cx, cy - 28);

  // Teks Utama: BEBERAPA HARI KEMUDIAN... (Besar, megah, berwibawa)
  ctx.font = '900 28px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
  ctx.shadowBlur = 16;
  ctx.fillText('BEBERAPA HARI KEMUDIAN...', cx, cy + 12);
  ctx.shadowBlur = 0;

  // Garis aksen bawah
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(cx - 100, cy + 38);
  ctx.lineTo(cx + 100, cy + 38);
  ctx.stroke();

  ctx.restore();
}

// 1.7. OVERLAY PERINGATAN BUNYIKAN SIRINE EWS (GAYA KARTU GEMPA BUMI: BESAR, JELAS, HIGH-CONTRAST)
function drawVolcanoSirenPromptOverlay(
  ctx: CanvasRenderingContext2D,
  viewW: number,
  _viewH: number,
  _sim: VolcanoSimulationDataL2,
  state: GameStateL2
): void {
  const cx = viewW / 2;
  const isCompact = viewW < 800;
  const cardW = Math.min(viewW - 24, isCompact ? 520 : 860);
  const cardH = isCompact ? 116 : 136;
  const cardX = cx - cardW / 2;
  const cardY = isCompact ? 72 : 82;

  ctx.save();
  // Kartu gelap pekat bergaya simulasi gempa
  ctx.fillStyle = 'rgba(11, 17, 32, 0.97)';
  ctx.fillRect(cardX, cardY, cardW, cardH);

  const isBlink = Math.floor(state.animTick / 10) % 2 === 0;
  ctx.strokeStyle = isBlink ? '#ef4444' : '#f97316';
  ctx.lineWidth = isCompact ? 3 : 4;
  ctx.strokeRect(cardX, cardY, cardW, cardH);

  // Sudut-sudut retro pixel khas simulasi gempa
  ctx.fillStyle = isBlink ? '#ef4444' : '#f87171';
  const cSz = isCompact ? 10 : 13;
  const cTh = isCompact ? 3 : 4;
  ctx.fillRect(cardX + 4, cardY + 4, cSz, cTh);
  ctx.fillRect(cardX + 4, cardY + 4, cTh, cSz);
  ctx.fillRect(cardX + cardW - 4 - cSz, cardY + 4, cSz, cTh);
  ctx.fillRect(cardX + cardW - 4 - cTh, cardY + 4, cTh, cSz);
  ctx.fillRect(cardX + 4, cardY + cardH - 4 - cTh, cSz, cTh);
  ctx.fillRect(cardX + 4, cardY + cardH - 4 - cSz, cTh, cSz);
  ctx.fillRect(cardX + cardW - 4 - cSz, cardY + cardH - 4 - cTh, cSz, cTh);
  ctx.fillRect(cardX + cardW - 4 - cTh, cardY + cardH - 4 - cSz, cTh, cSz);

  // Baris 1: Header Peringatan Besar & Terbaca
  ctx.textAlign = 'center';
  ctx.font = isCompact
    ? '900 17px "Plus Jakarta Sans", sans-serif'
    : '900 23px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#fca5a5';
  ctx.fillText('▲ [STATUS AWAS] GUNUNG MELETUS! SEGERA BUNYIKAN SIRINE EWS! ▲', cx, cardY + (isCompact ? 30 : 36));

  // Baris 2: Tombol Aksi Utama yang Sangat Besar & Kontras
  const distToPole = Math.round(Math.abs(state.player.x - 376));
  const isNearPole = distToPole <= 55;

  const btnW = Math.min(cardW - (isCompact ? 28 : 56), 800);
  const btnH = isCompact ? 52 : 64;
  const btnY = cardY + (isCompact ? 48 : 56);

  ctx.fillStyle = isNearPole ? '#dc2626' : '#b45309';
  ctx.fillRect(cx - btnW / 2, btnY, btnW, btnH);
  ctx.strokeStyle = isNearPole ? '#fde047' : '#fef08a';
  ctx.lineWidth = isCompact ? 3 : 3.8;
  ctx.strokeRect(cx - btnW / 2, btnY, btnW, btnH);

  ctx.font = isCompact
    ? '900 16px "Plus Jakarta Sans", sans-serif'
    : '900 21px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textBaseline = 'middle';

  if (!isNearPole) {
    ctx.fillText(`LARI KE TIANG SIRINE DI SAMPING POSKO! [SISA: ${distToPole}M]`, cx, btnY + btnH / 2);
  } else {
    ctx.fillText('TEKAN [E] / [SPASI] / TAP UNTUK MEMBUNYIKAN SIRINE DARURAT!', cx, btnY + btnH / 2);
  }

  ctx.restore();
}

// 3. RADAR INDIKATOR WARGA DI LUAR LAYAR (PANAH KIRI / KANAN SCREEN SPACE)
function drawOffscreenVillagerRadar(
  ctx: CanvasRenderingContext2D,
  viewW: number,
  _viewH: number,
  sim: VolcanoSimulationDataL2,
  camX: number,
  scale: number,
  animTick: number,
  state: GameStateL2
): void {
  const effectiveW = viewW / scale;
  let leftIdx = 0;
  let rightIdx = 0;

  for (const v of sim.villagersToRescue) {
    if (v.rescued) continue;
    const npc = state.npcs.get(v.npcId);
    const targetX = npc ? npc.x : v.x;

    // Cek apakah posisi warga berada di luar layar sebelah kiri
    if (targetX < camX) {
      const badgeW = 320;
      const badgeH = 54;
      const badgeX = 18;
      const badgeY = 96 + leftIdx * 64;
      leftIdx++;

      const isBlink = Math.floor(animTick / 12) % 2 === 0;
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 4;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.98)';
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 10);
      ctx.fill();
      ctx.shadowColor = 'transparent';

      ctx.strokeStyle = isBlink ? '#ef4444' : '#f59e0b';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      ctx.fillStyle = isBlink ? '#f87171' : '#fde047';
      ctx.font = '900 17.5px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(`◀ [!] TOLONG: ${v.name.toUpperCase()}`, badgeX + 18, badgeY + badgeH / 2);
      ctx.restore();
    }
    // Cek apakah posisi warga berada di luar layar sebelah kanan
    else if (targetX > camX + effectiveW) {
      const badgeW = 320;
      const badgeH = 54;
      const badgeX = viewW - badgeW - 18;
      const badgeY = 96 + rightIdx * 64;
      rightIdx++;

      const isBlink = Math.floor(animTick / 12) % 2 === 0;
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 4;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.98)';
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 10);
      ctx.fill();
      ctx.shadowColor = 'transparent';

      ctx.strokeStyle = isBlink ? '#ef4444' : '#f59e0b';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      ctx.fillStyle = isBlink ? '#f87171' : '#fde047';
      ctx.font = '900 17.5px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(`TOLONG: ${v.name.toUpperCase()} [!] ▶`, badgeX + badgeW - 18, badgeY + badgeH / 2);
      ctx.restore();
    }
  }
}

// 4. QTE 1: LARI KE POS RONDA & MEMUKUL KENTONGAN (MAP 1 WASPADA - GAYA KARTU GEMPA BUMI)
export function drawVolcanoQteKentonganOverlay(
  ctx: CanvasRenderingContext2D,
  viewW: number,
  _viewH: number,
  sim: VolcanoSimulationDataL2,
  state: GameStateL2
): void {
  const isBlinkVisible = (state.animTick % 60) < 46;
  if (!isBlinkVisible) return;

  const cx = viewW / 2;
  const isCompact = viewW < 800;
  const cardW = Math.min(viewW - 24, isCompact ? 520 : 860);
  const cardH = isCompact ? 144 : 168;
  const cardX = cx - cardW / 2;
  const cardY = isCompact ? 72 : 82;

  ctx.save();
  ctx.fillStyle = 'rgba(11, 17, 32, 0.97)';
  ctx.fillRect(cardX, cardY, cardW, cardH);
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = isCompact ? 3 : 4;
  ctx.strokeRect(cardX, cardY, cardW, cardH);

  // Sudut dekoratif retro piksel
  ctx.fillStyle = '#fde047';
  const cSz = isCompact ? 10 : 13;
  const cTh = isCompact ? 3 : 4;
  ctx.fillRect(cardX + 4, cardY + 4, cSz, cTh);
  ctx.fillRect(cardX + 4, cardY + 4, cTh, cSz);
  ctx.fillRect(cardX + cardW - 4 - cSz, cardY + 4, cSz, cTh);
  ctx.fillRect(cardX + cardW - 4 - cTh, cardY + 4, cTh, cSz);
  ctx.fillRect(cardX + 4, cardY + cardH - 4 - cTh, cSz, cTh);
  ctx.fillRect(cardX + 4, cardY + cardH - 4 - cSz, cTh, cSz);
  ctx.fillRect(cardX + cardW - 4 - cSz, cardY + cardH - 4 - cTh, cSz, cTh);
  ctx.fillRect(cardX + cardW - 4 - cTh, cardY + cardH - 4 - cSz, cTh, cSz);

  // Baris 1: Judul Peringatan
  ctx.textAlign = 'center';
  ctx.font = isCompact
    ? '900 15px "Plus Jakarta Sans", sans-serif'
    : '900 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#fef08a';
  ctx.fillText('▲ [STATUS WASPADA] SEGERA BUNYIKAN KENTONGAN DI POS RONDA! ▲', cx, cardY + (isCompact ? 28 : 34));

  // Baris 2: Tombol Aksi Utama yang Kontras & Besar
  const btnW = Math.min(cardW - (isCompact ? 28 : 56), 800);
  const btnH = isCompact ? 44 : 52;
  const btnY = cardY + (isCompact ? 42 : 50);
  ctx.fillStyle = '#d97706';
  ctx.fillRect(cx - btnW / 2, btnY, btnW, btnH);
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = isCompact ? 2.5 : 3;
  ctx.strokeRect(cx - btnW / 2, btnY, btnW, btnH);

  const distToPos = Math.round(Math.abs(state.player.x - 440));
  ctx.font = isCompact
    ? '900 13.5px "Plus Jakarta Sans", sans-serif'
    : '900 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#ffffff';

  if (distToPos > 65) {
    ctx.fillText(`LARI KE POS RONDA! [SISA: ${distToPos}M]`, cx, btnY + (isCompact ? 27 : 32));
  } else {
    ctx.fillText(`TEKAN [E] / TAP SEKARANG! (${sim.kentonganHits}/3)`, cx, btnY + (isCompact ? 27 : 32));
  }

  // Baris 3: Progress Bar Waktu
  const barW = btnW;
  const barH = isCompact ? 20 : 26;
  const barX = cx - barW / 2;
  const barY = btnY + btnH + (isCompact ? 10 : 14);

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(barX, barY, barW, barH);
  const progress = Math.max(0, Math.min(1, sim.qteTimer / sim.qteMaxTimer));
  ctx.fillStyle = progress > 0.35 ? '#10b981' : '#ef4444';
  ctx.fillRect(barX, barY, barW * progress, barH);
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(barX, barY, barW, barH);

  const secondsLeft = (sim.qteTimer / 60).toFixed(1);
  ctx.font = isCompact
    ? '800 11.5px "Plus Jakarta Sans", sans-serif'
    : '800 14px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`SISA WAKTU: ${secondsLeft} DETIK`, cx, barY + (isCompact ? 14 : 18));

  ctx.restore();
}

// 5. QTE 2: APD MASKER & CARI 3 WARGA DUSUN (MAP 3 AWAS - GAYA KARTU GEMPA BUMI)
function drawVolcanoQteRescueOverlay(
  ctx: CanvasRenderingContext2D,
  viewW: number,
  _viewH: number,
  sim: VolcanoSimulationDataL2,
  _animTick: number
): void {
  const cx = viewW / 2;
  const isCompact = viewW < 800;
  const cardW = Math.min(viewW - 24, isCompact ? 520 : 860);
  const cardH = isCompact ? 168 : 192;
  const cardX = cx - cardW / 2;
  const cardY = isCompact ? 72 : 82;

  ctx.save();
  ctx.fillStyle = 'rgba(11, 17, 32, 0.97)';
  ctx.fillRect(cardX, cardY, cardW, cardH);
  ctx.strokeStyle = '#ea580c';
  ctx.lineWidth = isCompact ? 3 : 4;
  ctx.strokeRect(cardX, cardY, cardW, cardH);

  // Sudut dekoratif retro piksel
  ctx.fillStyle = '#fb923c';
  const cSz = isCompact ? 10 : 13;
  const cTh = isCompact ? 3 : 4;
  ctx.fillRect(cardX + 4, cardY + 4, cSz, cTh);
  ctx.fillRect(cardX + 4, cardY + 4, cTh, cSz);
  ctx.fillRect(cardX + cardW - 4 - cSz, cardY + 4, cSz, cTh);
  ctx.fillRect(cardX + cardW - 4 - cTh, cardY + 4, cTh, cSz);
  ctx.fillRect(cardX + 4, cardY + cardH - 4 - cTh, cSz, cTh);
  ctx.fillRect(cardX + 4, cardY + cardH - 4 - cSz, cTh, cSz);
  ctx.fillRect(cardX + cardW - 4 - cSz, cardY + cardH - 4 - cTh, cSz, cTh);
  ctx.fillRect(cardX + cardW - 4 - cTh, cardY + cardH - 4 - cSz, cTh, cSz);

  // Baris 1: Header Peringatan Besar & Nyaman Dibaca
  ctx.textAlign = 'center';
  ctx.font = isCompact
    ? '900 15px "Plus Jakarta Sans", sans-serif'
    : '900 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#fed7aa';
  ctx.fillText('▲ [STATUS AWAS] EVAKUASI DUSUN: BANTU 3 WARGA KE MOBIL BPBD! ▲', cx, cardY + (isCompact ? 28 : 34));

  // Dua Kotak Checklist Kompak & Kontras
  const boxW = Math.min(cardW - (isCompact ? 28 : 56), 800);
  const boxX = cx - boxW / 2;
  const boxH = isCompact ? 32 : 36;

  // Langkah 1: APD Masker N95
  const box1Y = cardY + (isCompact ? 40 : 48);
  ctx.fillStyle = sim.apdEquipped ? 'rgba(34, 197, 94, 0.22)' : 'rgba(234, 88, 12, 0.25)';
  ctx.fillRect(boxX, box1Y, boxW, boxH);
  ctx.strokeStyle = sim.apdEquipped ? '#22c55e' : '#ea580c';
  ctx.lineWidth = 2;
  ctx.strokeRect(boxX, box1Y, boxW, boxH);

  ctx.textAlign = 'left';
  ctx.font = isCompact
    ? '900 12.5px "Plus Jakarta Sans", sans-serif'
    : '900 15px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = sim.apdEquipped ? '#4ade80' : '#fef08a';
  ctx.fillText(
    sim.apdEquipped
      ? '[✓] 1. MASKER N95 & GOGGLE: TERPASANG & AMAN DARI ABU VULKANIK'
      : '[ ! ] 1. AMBIL TAS SIAGA & PAKAI MASKER N95 [TEKAN E / TAP]',
    boxX + 16,
    box1Y + boxH / 2 + 5
  );

  // Langkah 2: Selamatkan 3 Warga Dusun
  const rescuedCount = sim.villagersToRescue.filter((v) => v.rescued).length;
  const isAllRescued = rescuedCount >= 3;
  const box2Y = box1Y + boxH + (isCompact ? 8 : 10);

  ctx.fillStyle = isAllRescued ? 'rgba(34, 197, 94, 0.22)' : 'rgba(249, 115, 22, 0.22)';
  ctx.fillRect(boxX, box2Y, boxW, boxH);
  ctx.strokeStyle = isAllRescued ? '#22c55e' : '#f97316';
  ctx.lineWidth = 2;
  ctx.strokeRect(boxX, box2Y, boxW, boxH);

  ctx.fillStyle = isAllRescued ? '#4ade80' : (sim.apdEquipped ? '#fde047' : '#cbd5e1');
  ctx.fillText(
    isAllRescued
      ? '[✓] 2. WARGA DUSUN: 3/3 BERHASIL DIARAHKAN KE MOBIL EVAKUASI!'
      : `[ ! ] 2. SELAMATKAN 3 WARGA: ${rescuedCount}/3 [DEKATI WARGA & TEKAN E / TAP]`,
    boxX + 16,
    box2Y + boxH / 2 + 5
  );

  // Baris 3: Progress Bar Waktu
  const barW = boxW;
  const barH = isCompact ? 18 : 24;
  const barX = cx - barW / 2;
  const barY = box2Y + boxH + (isCompact ? 10 : 12);

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(barX, barY, barW, barH);
  const progress = Math.max(0, Math.min(1, sim.qteTimer / sim.qteMaxTimer));
  ctx.fillStyle = progress > 0.35 ? '#ea580c' : '#ef4444';
  ctx.fillRect(barX, barY, barW * progress, barH);
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(barX, barY, barW, barH);

  const secondsLeft = (sim.qteTimer / 60).toFixed(1);
  ctx.textAlign = 'center';
  ctx.font = isCompact
    ? '800 11.5px "Plus Jakarta Sans", sans-serif'
    : '800 14px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`SISA WAKTU: ${secondsLeft} DETIK`, cx, barY + (isCompact ? 13 : 17));

  ctx.restore();
}

// 6. QTE 3: SPRINT MENUJU MOBIL EVAKUASI (MAP 3 AWAS - GAYA KARTU GEMPA BUMI)
function drawVolcanoQteTruckOverlay(
  ctx: CanvasRenderingContext2D,
  viewW: number,
  _viewH: number,
  _sim: VolcanoSimulationDataL2,
  state: GameStateL2
): void {
  const isBlinkVisible = (state.animTick % 60) < 46;
  if (!isBlinkVisible) return;

  const cx = viewW / 2;
  const isCompact = viewW < 800;
  const cardW = Math.min(viewW - 24, isCompact ? 520 : 860);
  const cardH = isCompact ? 116 : 136;
  const cardX = cx - cardW / 2;
  const cardY = isCompact ? 72 : 82;

  ctx.save();
  ctx.fillStyle = 'rgba(11, 17, 32, 0.97)';
  ctx.fillRect(cardX, cardY, cardW, cardH);

  // Border Berkedip Merah Darurat
  const isRed = Math.floor(state.animTick / 10) % 2 === 0;
  ctx.strokeStyle = isRed ? '#dc2626' : '#ef4444';
  ctx.lineWidth = isCompact ? 3 : 4;
  ctx.strokeRect(cardX, cardY, cardW, cardH);

  // Sudut dekoratif retro piksel
  ctx.fillStyle = '#f87171';
  const cSz = isCompact ? 10 : 13;
  const cTh = isCompact ? 3 : 4;
  ctx.fillRect(cardX + 4, cardY + 4, cSz, cTh);
  ctx.fillRect(cardX + 4, cardY + 4, cTh, cSz);
  ctx.fillRect(cardX + cardW - 4 - cSz, cardY + 4, cSz, cTh);
  ctx.fillRect(cardX + cardW - 4 - cTh, cardY + 4, cTh, cSz);
  ctx.fillRect(cardX + 4, cardY + cardH - 4 - cTh, cSz, cTh);
  ctx.fillRect(cardX + 4, cardY + cardH - 4 - cSz, cTh, cSz);
  ctx.fillRect(cardX + cardW - 4 - cSz, cardY + cardH - 4 - cTh, cSz, cTh);
  ctx.fillRect(cardX + cardW - 4 - cTh, cardY + cardH - 4 - cSz, cTh, cSz);

  // Baris 1: Header Peringatan Besar & Nyaman Dibaca
  ctx.textAlign = 'center';
  ctx.font = isCompact
    ? '900 17px "Plus Jakarta Sans", sans-serif'
    : '900 23px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#fca5a5';
  ctx.fillText('▲ [STATUS AWAS] SELURUH WARGA SIAP! LARI KE MOBIL EVAKUASI BPBD! ▲', cx, cardY + (isCompact ? 30 : 36));

  // Baris 2: Bar Jarak ke Mobil Evakuasi
  const barW = Math.min(cardW - (isCompact ? 28 : 56), 800);
  const barH = isCompact ? 52 : 64;
  const barY = cardY + (isCompact ? 48 : 56);

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(cx - barW / 2, barY, barW, barH);

  const distToTruck = Math.max(0, Math.round(1800 - state.player.x));
  const progressPct = Math.min(100, Math.max(0, Math.floor(((state.player.x - 800) / 1000) * 100)));

  const sprintGrad = ctx.createLinearGradient(cx - barW / 2, 0, cx + barW / 2, 0);
  sprintGrad.addColorStop(0, '#f97316');
  sprintGrad.addColorStop(0.6, '#eab308');
  sprintGrad.addColorStop(1, '#22c55e');

  ctx.fillStyle = sprintGrad;
  ctx.fillRect(cx - barW / 2, barY, barW * (progressPct / 100), barH);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.strokeRect(cx - barW / 2, barY, barW, barH);

  ctx.fillStyle = '#ffffff';
  ctx.font = isCompact
    ? '900 16px "Plus Jakarta Sans", sans-serif'
    : '900 21px "Plus Jakarta Sans", sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText(
    distToTruck <= 0 ? '[✓] TIBA DI MOBIL EVAKUASI BPBD! BERHASIL MENGUNGSI!' : `JARAK KE MOBIL: ${distToTruck} METER (LARI KE KANAN ➔)`,
    cx,
    barY + barH / 2
  );

  ctx.restore();
}

// 7. MODAL GAGAL & RETRY FASE (GAYA KARTU GEMPA BUMI)
function drawVolcanoFailedOverlay(
  ctx: CanvasRenderingContext2D,
  viewW: number,
  _viewH: number,
  sim: VolcanoSimulationDataL2
): void {
  const cx = viewW / 2;
  const isCompact = viewW < 800;
  const cardW = Math.min(viewW - 24, isCompact ? 520 : 860);
  const cardH = isCompact ? 148 : 168;
  const cardX = cx - cardW / 2;
  const cardY = isCompact ? 72 : 82;

  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.98)';
  ctx.fillRect(cardX, cardY, cardW, cardH);
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = isCompact ? 3 : 4;
  ctx.strokeRect(cardX, cardY, cardW, cardH);

  // Sudut dekoratif retro piksel
  ctx.fillStyle = '#f87171';
  const cSz = isCompact ? 10 : 13;
  const cTh = isCompact ? 3 : 4;
  ctx.fillRect(cardX + 4, cardY + 4, cSz, cTh);
  ctx.fillRect(cardX + 4, cardY + 4, cTh, cSz);
  ctx.fillRect(cardX + cardW - 4 - cSz, cardY + 4, cSz, cTh);
  ctx.fillRect(cardX + cardW - 4 - cTh, cardY + 4, cTh, cSz);
  ctx.fillRect(cardX + 4, cardY + cardH - 4 - cTh, cSz, cTh);
  ctx.fillRect(cardX + 4, cardY + cardH - 4 - cSz, cTh, cSz);
  ctx.fillRect(cardX + cardW - 4 - cSz, cardY + cardH - 4 - cTh, cSz, cTh);
  ctx.fillRect(cardX + cardW - 4 - cTh, cardY + cardH - 4 - cSz, cTh, cSz);

  ctx.textAlign = 'center';
  ctx.font = isCompact
    ? '900 16px "Plus Jakarta Sans", sans-serif'
    : '900 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#fca5a5';
  ctx.fillText('[ ! ] EVAKUASI TERHAMBAT!', cx, cardY + (isCompact ? 32 : 38));

  // Penjelasan Alasan Kegagalan Ringkas
  ctx.font = isCompact
    ? '800 12px "Plus Jakarta Sans", sans-serif'
    : '800 14px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#e2e8f0';
  const reason = sim.failureReason || 'Kesigapan mitigasi terlambat. Waspada bahaya awan panas!';
  ctx.fillText(reason, cx, cardY + (isCompact ? 60 : 72));

  // Tombol Ulangi Fase
  const btnW = Math.min(cardW - (isCompact ? 28 : 56), 640);
  const btnH = isCompact ? 40 : 48;
  const btnY = cardY + (isCompact ? 86 : 100);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(cx - btnW / 2, btnY, btnW, btnH);
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = isCompact ? 2 : 3;
  ctx.strokeRect(cx - btnW / 2, btnY, btnW, btnH);

  ctx.fillStyle = '#ffffff';
  ctx.font = isCompact
    ? '900 13px "Plus Jakarta Sans", sans-serif'
    : '900 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('TEKAN [E] / TAP UNTUK MENCOBA LAGI', cx, btnY + (isCompact ? 25 : 30));

  ctx.restore();
}

// ══════════════════════════════════════════════════════════════════════════
// 8. ATMOSPHERE & GROUND: AREA 6 PASCABENCANA ERUPSI MERAPI
//    (BARAK PENGUNGSIAN TERPADU, POSKO MEDIS, TANDON AIR & BAHAYA LAHAR)
// ══════════════════════════════════════════════════════════════════════════

// A. LANTAI KOMPLEKS BARAK PENGUNGSIAN (RUMPUT LERENG, JALUR SETAPAK ASPAL & SANDBAGS)
export function drawShelterRecoveryGround(
  ctx: CanvasRenderingContext2D,
  camX: number,
  viewW: number,
  _animTick: number
): void {
  const floorY = 356;
  const floorH = 124;

  // 1. Dasar Rumput Hijau Lereng Dataran Rendah (Sama Harmonis dengan Area 5)
  const groundGrad = ctx.createLinearGradient(0, floorY, 0, floorY + floorH);
  groundGrad.addColorStop(0, '#15803d');
  groundGrad.addColorStop(0.3, '#166534');
  groundGrad.addColorStop(0.7, '#14532d');
  groundGrad.addColorStop(0.9, '#27170a');
  groundGrad.addColorStop(1, '#1c1917');
  ctx.fillStyle = groundGrad;
  ctx.fillRect(camX, floorY, viewW, floorH);

  // 2. Jalur Setapak Aspal Bersih Shelter Siaga (y: 356 - 364)
  ctx.fillStyle = '#334155';
  ctx.fillRect(camX, floorY - 2, viewW, 8);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(camX, floorY - 2, viewW, 2);

  // Garis Marka Putus-Putus Jalur Evakuasi Aman
  const dashStep = 40;
  const startDash = Math.floor(camX / dashStep) * dashStep;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  for (let dx = startDash; dx < camX + viewW + dashStep; dx += dashStep) {
    ctx.fillRect(dx, floorY + 1, 20, 2);
  }

  // 3. Saluran Drainase Air Hujan & Endapan Abu Tipis di Tepi Jalur
  ctx.fillStyle = '#475569';
  ctx.fillRect(camX, floorY + 6, viewW, 4);
  ctx.fillStyle = '#94a3b8'; // Abu vulkanik tipis yang disapu rapi ke tepi jalan
  ctx.fillRect(camX, floorY + 6, viewW, 1.5);

  // Endapan Abu Vulkanik yang Disapu ke Tepi Trotoar (Tumpukan Abu Rapi Gotong Royong)
  const ashPileStep = 48;
  const startAsh = Math.floor(camX / ashPileStep) * ashPileStep;
  for (let ax = startAsh; ax < camX + viewW + ashPileStep; ax += ashPileStep) {
    const hash = Math.abs(Math.sin(ax * 19.821) * 43758.5453);
    if (hash - Math.floor(hash) > 0.4) {
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.arc(ax, floorY + 6, 6, Math.PI, 0);
      ctx.fill();
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.arc(ax, floorY + 5, 4, Math.PI, 0);
      ctx.fill();
    }
  }

  // 4. Karung Pasir Penahan Luapan Air & Pembatas Tenda (Sandbags Barrier)
  const sandbagLocations = [330, 540, 850, 1060, 1270, 1480, 1920];
  for (const bx of sandbagLocations) {
    if (bx + 40 > camX && bx - 40 < camX + viewW) {
      // 2 tumpuk karung goni
      ctx.fillStyle = '#b45309';
      ctx.fillRect(bx - 14, floorY - 7, 28, 6);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(bx - 12, floorY - 6, 24, 4);
      ctx.fillStyle = '#92400e';
      ctx.fillRect(bx - 10, floorY - 12, 20, 6);
      ctx.fillStyle = '#b45309';
      ctx.fillRect(bx - 8, floorY - 11, 16, 4);
    }
  }

  // 5. Bebatuan Andesit & Bunga Tropis Dataran Rendah
  const stepX = 36;
  const startX = Math.floor(camX / stepX) * stepX - stepX * 2;
  const endX = camX + viewW + stepX * 2;

  for (let px = startX; px < endX; px += stepX) {
    const hash = Math.abs(Math.sin(px * 23.456) * 43758.5453);
    const fract = hash - Math.floor(hash);

    if (fract > 0.5) {
      const rockY = floorY + 16 + Math.floor(fract * 30);
      ctx.fillStyle = '#475569';
      ctx.fillRect(px, rockY, 8, 5);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(px + 1, rockY, 6, 2);
      ctx.fillStyle = '#334155';
      ctx.fillRect(px, rockY + 4, 8, 2);
    } else {
      const flowerY = floorY + 12 + Math.floor(fract * 40);
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(px, flowerY, 2, 5);
      ctx.fillStyle = fract > 0.25 ? '#fde047' : '#38bdf8';
      ctx.fillRect(px - 1, flowerY - 2, 4, 3);
    }
  }
}

// B. GAPURA KEMBALI MENUJU DUSUN DESTANA (PORTAL BACK AREA 6)
export function drawShelterEntranceBackGate(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number
): void {
  ctx.save();
  ctx.translate(px, py);

  // Dua Tiang Baja Oranye BPBD Kiri & Kanan
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(-28, -72, 8, 72);
  ctx.fillRect(20, -72, 8, 72);
  ctx.fillStyle = '#c2410c';
  ctx.fillRect(-26, -72, 4, 72);
  ctx.fillRect(22, -72, 4, 72);

  // Palang Atas Papan Petunjuk Arah Posko Terpadu (Kotak Disesuaikan Lebar & Rapi)
  const gateSignW = 126;
  const gateSignH = 22;
  const gateSignX = -gateSignW / 2;
  const gateSignY = -86;

  // Background Papan Kotak Gelap Berborder Cyan Bersih
  drawRoundedBadgeL2(
    ctx,
    gateSignX,
    gateSignY,
    gateSignW,
    gateSignH,
    5,
    '#0f172a',
    '#38bdf8',
    1.5
  );

  // Tulisan Papan Arah Mudah Dibaca (Plus Jakarta Sans Bold)
  ctx.fillStyle = '#38bdf8';
  ctx.font = '900 9px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('KE DUSUN DESTANA', 0, gateSignY + gateSignH / 2);

  // Lampu Sirine Siaga di Pucuk Tiang Gapura
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(-27, -92, 6, 6);
  ctx.fillRect(21, -92, 6, 6);
  ctx.restore();
}

// C. ATMOSPHERE BARAK PENGUNGSIAN TERPADU (ZONA AMAN KRB I)
export function drawShelterRecoveryAtmosphere(
  ctx: CanvasRenderingContext2D,
  camX: number,
  viewW: number,
  _viewH: number,
  animTick: number
): void {
  // 1. Langit Dataran Rendah KRB I yang Aman & Tenang (Morning Hope Gradient)
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 260);
  skyGrad.addColorStop(0, '#1e3a8a'); // Biru tua fajar aman
  skyGrad.addColorStop(0.35, '#0284c7');
  skyGrad.addColorStop(0.7, '#38bdf8');
  skyGrad.addColorStop(1, '#fef08a'); // Sinar fajar keemasan membawa harapan
  ctx.fillStyle = skyGrad;
  ctx.fillRect(camX, 0, viewW, 260);

  // Awan Putih Lembut Melintas Perlahan
  const cloudOffsets = [120, 640, 1180, 1680, 2120];
  ctx.fillStyle = 'rgba(255, 255, 255, 0.78)';
  for (const cx of cloudOffsets) {
    const driftX = (cx + animTick * 0.08) % 2500;
    if (driftX + 160 > camX && driftX - 40 < camX + viewW) {
      ctx.beginPath();
      ctx.arc(driftX, 36, 16, 0, Math.PI * 2);
      ctx.arc(driftX + 22, 28, 22, 0, Math.PI * 2);
      ctx.arc(driftX + 48, 32, 18, 0, Math.PI * 2);
      ctx.arc(driftX + 70, 38, 14, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 2. Siluet Puncak Gunung Merapi JAUH DI KEJAUHAN (>20 KM - ZONA AMAN) (Parallax 0.04)
  // Dibuat bentuk identik persis dengan Gunung Merapi di Area 5 tetapi diskala lebih kecil & jauh
  const paraFar = camX * 0.04;
  const merapiX = camX + viewW * 0.65 - (paraFar % 280);
  const merapiPeakY = 138; // Lebih kecil & rendah karena dilihat dari dataran rendah KRB I (>20 km)
  const mScale = 0.58; // Skala siluet identik dengan Gunung Merapi di Area 5

  ctx.save();
  const mountainGrad = ctx.createLinearGradient(0, merapiPeakY, 0, 360);
  mountainGrad.addColorStop(0, '#64748b'); // Siluet andesit abu-abu tenang berkabut di kejauhan
  mountainGrad.addColorStop(0.4, '#475569');
  mountainGrad.addColorStop(0.8, '#334155');
  mountainGrad.addColorStop(1, '#1e293b');
  ctx.fillStyle = mountainGrad;
  ctx.beginPath();
  // Persis profil Merapi Area 5 diskala mScale:
  ctx.moveTo(merapiX - 420 * mScale, 360);
  ctx.lineTo(merapiX - 50 * mScale, merapiPeakY + 12 * mScale);
  ctx.lineTo(merapiX - 10 * mScale, merapiPeakY);
  ctx.lineTo(merapiX + 15 * mScale, merapiPeakY + 4 * mScale);
  ctx.lineTo(merapiX + 450 * mScale, 360);
  ctx.closePath();
  ctx.fill();

  // Guratan Lembah Alur Sungai Lahar Persis Area 5
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(merapiX + 15 * mScale, merapiPeakY + 6 * mScale);
  ctx.lineTo(merapiX + 60 * mScale, merapiPeakY + 90 * mScale);
  ctx.lineTo(merapiX + 140 * mScale, 360);
  ctx.moveTo(merapiX - 10 * mScale, merapiPeakY + 4 * mScale);
  ctx.lineTo(merapiX - 70 * mScale, merapiPeakY + 110 * mScale);
  ctx.lineTo(merapiX - 160 * mScale, 360);
  ctx.stroke();

  // ── LELEHAN MAGMA TIPIS-TIPIS DI AREA BARAK PENGUNGSIAN (SESUAI GAMBAR 4 REFERENSI PENGGUNA) ──
  drawArea6DistantLavaVeins(ctx, merapiX, merapiPeakY, mScale, animTick);

  // Kepulan Asap Vulkanik Realistis Membubung Pasca-Erupsi (Bukan Bulatan Kaku!)
  drawRealisticVolcanicSmoke(ctx, merapiX + 2, merapiPeakY + 2, animTick, 'post_eruption_distant', mScale);
  ctx.restore();

  // 3. Perbukitan Hijau Dataran Rendah & Pepohonan Pinus (Parallax 0.16)
  const paraMid = camX * 0.16;
  const hillGrad = ctx.createLinearGradient(0, 210, 0, 360);
  hillGrad.addColorStop(0, '#15803d');
  hillGrad.addColorStop(1, '#166534');
  ctx.fillStyle = hillGrad;

  ctx.beginPath();
  ctx.moveTo(camX - 20, 360);
  for (let hx = camX - 40; hx <= camX + viewW + 40; hx += 40) {
    const hy = 240 + Math.sin((hx + paraMid) * 0.006) * 18;
    ctx.lineTo(hx, hy);
  }
  ctx.lineTo(camX + viewW + 20, 360);
  ctx.closePath();
  ctx.fill();

  // Rumpun Pohon Pinus Lereng Dataran Rendah (Bentuk Persis Sama Seperti di Area 5)
  const SHELTER_PINE_CLUSTERS = [
    { x: 120, h: 32 },
    { x: 150, h: 26 },
    { x: 280, h: 36 },
    { x: 310, h: 28 },
    { x: 580, h: 34 },
    { x: 610, h: 40 },
    { x: 740, h: 30 },
    { x: 1140, h: 36 },
    { x: 1170, h: 28 },
    { x: 1280, h: 38 },
    { x: 1600, h: 32 },
    { x: 1630, h: 36 },
    { x: 1860, h: 34 },
    { x: 2040, h: 36 },
  ];

  for (const tree of SHELTER_PINE_CLUSTERS) {
    const realX = tree.x;
    if (realX + 50 < camX || realX - 50 > camX + viewW) continue;
    const hillY = 240 + Math.sin((realX + paraMid) * 0.006) * 18;
    const tH = tree.h;
    const tW = tH * 0.42;

    // Batang Kayu
    ctx.fillStyle = '#451a03';
    ctx.fillRect(realX - 1.5, hillY - 8, 3, 10);

    // Rindang Daun Pinus Hijau Tropis Bertingkat 3 Tier (Sama Persis Gaya Area 5)
    const c1 = '#14532d';
    const c2 = '#16a34a';
    const c3 = '#22c55e';

    // Tier 1 (Bawah)
    ctx.fillStyle = c1;
    ctx.beginPath();
    ctx.moveTo(realX, hillY - tH * 0.6);
    ctx.lineTo(realX + tW, hillY - 6);
    ctx.lineTo(realX - tW, hillY - 6);
    ctx.closePath();
    ctx.fill();

    // Tier 2 (Tengah)
    ctx.fillStyle = c2;
    ctx.beginPath();
    ctx.moveTo(realX, hillY - tH * 0.85);
    ctx.lineTo(realX + tW * 0.8, hillY - tH * 0.45);
    ctx.lineTo(realX - tW * 0.8, hillY - tH * 0.45);
    ctx.closePath();
    ctx.fill();

    // Tier 3 (Pucuk)
    ctx.fillStyle = c3;
    ctx.beginPath();
    ctx.moveTo(realX, hillY - tH);
    ctx.lineTo(realX + tW * 0.55, hillY - tH * 0.72);
    ctx.lineTo(realX - tW * 0.55, hillY - tH * 0.72);
    ctx.closePath();
    ctx.fill();
  }

  // ════════════════════════════════════════════════════════════════════════
  // 4. STRUKTUR SPESIFIK AREA 6 DI DUNIA NYATA (SHELTER, POSKO, TANDON & LAHAR)
  // ════════════════════════════════════════════════════════════════════════

  // ── 4.1. SPANDUK SELAMAT DATANG BARAK PENGUNGSIAN TERPADU (x: 140 - 240) ──
  const archX = 180;
  if (archX + 140 > camX && archX - 140 < camX + viewW) {
    ctx.save();
    // Tiang Penyangga Spanduk Kokoh Sesuai Lebar Spanduk Baru
    ctx.fillStyle = '#475569';
    ctx.fillRect(archX - 98, 196, 6, 160);
    ctx.fillRect(archX + 92, 196, 6, 160);

    // Spanduk Resmi BPBD (Kotak Proporsional, Lebar Pas, Teks Terbaca Jelas)
    const bannerW = 196;
    const bannerH = 42;
    const bannerX = archX - bannerW / 2;
    const bannerY = 198;

    const bannerGrad = ctx.createLinearGradient(0, bannerY, 0, bannerY + bannerH);
    bannerGrad.addColorStop(0, '#ea580c');
    bannerGrad.addColorStop(1, '#c2410c');
    drawRoundedBadgeL2(ctx, bannerX, bannerY, bannerW, bannerH, 6, bannerGrad, '#facc15', 2);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('BARAK PENGUNGSIAN TERPADU', archX, bannerY + 14);

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 8.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('ZONA AMAN KRB I (DATARAN RENDAH)', archX, bannerY + 29);
    ctx.restore();
  }

  // ── 4.2. TENDA PLETON UTAMA BPBD (x: 360 - 520, Koordinator Bu Dini di x: 460) ──
  const tentX = 440;
  if (tentX + 160 > camX && tentX - 160 < camX + viewW) {
    ctx.save();
    // Badan Tenda Pleton Oranye BPBD
    ctx.fillStyle = '#c2410c';
    ctx.beginPath();
    ctx.moveTo(tentX - 80, 356);
    ctx.lineTo(tentX - 60, 270);
    ctx.lineTo(tentX, 240); // Bubungan atap tenda
    ctx.lineTo(tentX + 60, 270);
    ctx.lineTo(tentX + 80, 356);
    ctx.closePath();
    ctx.fill();

    // Dinding Samping Tenda dengan Bayangan Lipatan Kain
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.moveTo(tentX - 60, 270);
    ctx.lineTo(tentX, 240);
    ctx.lineTo(tentX + 60, 270);
    ctx.lineTo(tentX + 50, 356);
    ctx.lineTo(tentX - 50, 356);
    ctx.closePath();
    ctx.fill();

    // Pintu Masuk Tenda (Kain Tersingkap) & Cahaya Hangat di Dalam
    ctx.fillStyle = '#7c2d12';
    ctx.fillRect(tentX - 22, 285, 44, 71);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(tentX - 18, 290, 36, 66); // Interior hangat barak

    // Tali Pancang Tenda Pasak Tanah
    ctx.strokeStyle = '#78716c';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(tentX - 60, 270);
    ctx.lineTo(tentX - 95, 356);
    ctx.moveTo(tentX + 60, 270);
    ctx.lineTo(tentX + 95, 356);
    ctx.stroke();

    // Logo Segitiga BPBD di Dinding Tenda (Segitiga Biru & Oranye)
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.arc(tentX, 260, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.moveTo(tentX, 252);
    ctx.lineTo(tentX - 7, 266);
    ctx.lineTo(tentX + 7, 266);
    ctx.closePath();
    ctx.fill();

    // Palet Kayu & Tumpukan Matras Tidur di Samping Tenda
    ctx.fillStyle = '#78350f';
    ctx.fillRect(tentX + 56, 346, 26, 10);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(tentX + 58, 338, 22, 8); // Gulungan kasur biru
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(tentX + 60, 332, 18, 6);

    // Papan Nama Tenda BPBD (Kotak Pas, Rapi & Elegan)
    const tentSignW = 144;
    const tentSignH = 22;
    const tentSignX = tentX - tentSignW / 2;
    const tentSignY = 226;
    drawRoundedBadgeL2(
      ctx,
      tentSignX,
      tentSignY,
      tentSignW,
      tentSignH,
      5,
      '#0f172a',
      '#facc15',
      1.5
    );
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 10.5px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('TENDA PLETON BPBD', tentX, tentSignY + tentSignH / 2);

    ctx.restore();
  }

  // ── 4.3. TANDON AIR BERSIH STAINLESS & POS CUCI MATA (x: 620 - 700) ──
  const tankX = 660;
  if (tankX + 80 > camX && tankX - 80 < camX + viewW) {
    ctx.save();
    // Rangka Kaki Baja Penyangga Tandon
    ctx.fillStyle = '#334155';
    ctx.fillRect(tankX - 22, 286, 6, 70);
    ctx.fillRect(tankX + 16, 286, 6, 70);
    ctx.fillRect(tankX - 22, 320, 44, 4); // Palang silang penyangga

    // Silinder Tangki Stainless Steel (Anti-Abu Belerang)
    const tankGrad = ctx.createLinearGradient(tankX - 26, 0, tankX + 26, 0);
    tankGrad.addColorStop(0, '#94a3b8');
    tankGrad.addColorStop(0.3, '#f1f5f9'); // Kilau stainless steel
    tankGrad.addColorStop(0.7, '#cbd5e1');
    tankGrad.addColorStop(1, '#64748b');
    ctx.fillStyle = tankGrad;
    ctx.fillRect(tankX - 26, 236, 52, 54);

    // Tutup Rapat Kubah Tandon
    ctx.beginPath();
    ctx.ellipse(tankX, 236, 26, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    // Gembok / Segel Penutup Tandon
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(tankX - 4, 226, 8, 8);

    // Sabuk Pengikat Logam Tandon
    ctx.fillStyle = '#475569';
    ctx.fillRect(tankX - 26, 252, 52, 3);
    ctx.fillRect(tankX - 26, 272, 52, 3);

    // Keran Air Mengalir & Bak Bilas Mata Darurat (Eye Wash Station)
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(tankX + 22, 290, 8, 4); // Pipa keran
    ctx.fillRect(tankX + 28, 294, 2, 8);
    // Tetesan Air Segar Mengalir
    const dropY = 302 + (animTick * 1.5) % 18;
    ctx.fillStyle = '#0ea5e9';
    ctx.fillRect(tankX + 27, dropY, 3, 4);

    // Bak Penampung Air Cuci Mata
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(tankX + 18, 322, 22, 12);
    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(tankX + 20, 324, 18, 8);

    // Spanduk Edukasi Sanitasi Tandon (Kotak Pas Disesuaikan dengan Teks)
    const tankSignW = 72;
    const tankSignH = 22;
    const tankSignX = tankX - 54;
    const tankSignY = 294;
    drawRoundedBadgeL2(
      ctx,
      tankSignX,
      tankSignY,
      tankSignW,
      tankSignH,
      4,
      '#065f46',
      '#34d399',
      1.5
    );
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 10px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('AIR BERSIH', tankSignX + tankSignW / 2, tankSignY + tankSignH / 2);

    ctx.restore();
  }

  // ── 4.4. POSKO MEDIS PMI (x: 880 - 1040, dr. Alisa di x: 980) ──
  const pmiX = 960;
  if (pmiX + 160 > camX && pmiX - 160 < camX + viewW) {
    ctx.save();
    // Tenda Putih Bersih Posko Medis
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(pmiX - 70, 356);
    ctx.lineTo(pmiX - 55, 270);
    ctx.lineTo(pmiX, 242);
    ctx.lineTo(pmiX + 55, 270);
    ctx.lineTo(pmiX + 70, 356);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Dinding Samping Tenda Medis
    ctx.fillStyle = '#f1f5f9';
    ctx.beginPath();
    ctx.moveTo(pmiX - 55, 270);
    ctx.lineTo(pmiX, 242);
    ctx.lineTo(pmiX + 55, 270);
    ctx.lineTo(pmiX + 45, 356);
    ctx.lineTo(pmiX - 45, 356);
    ctx.closePath();
    ctx.fill();

    // Lambang Palang Merah Besar di Tengah Dinding
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(pmiX - 4, 258, 8, 24);
    ctx.fillRect(pmiX - 12, 266, 24, 8);

    // Tabung Oksigen Hijau Medis di Samping Tenda
    ctx.fillStyle = '#15803d';
    ctx.fillRect(pmiX + 52, 316, 10, 40);
    ctx.beginPath();
    ctx.ellipse(pmiX + 57, 316, 5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    // Manometer & Katup Oksigen
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(pmiX + 55, 308, 4, 8);
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(pmiX + 57, 306, 3, 0, Math.PI * 2);
    ctx.fill();

    // Kotak Kardus Pasokan Masker N95 & Kacamata Goggle
    ctx.fillStyle = '#d97706';
    ctx.fillRect(pmiX - 70, 336, 24, 20);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(pmiX - 68, 338, 20, 8);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 8.5px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('N95', pmiX - 58, 350);

    // Spanduk Resmi Posko Kesehatan PMI (Kotak Disesuaikan & Tulisan Mudah Dibaca)
    const pmiSignW = 156;
    const pmiSignH = 22;
    const pmiSignX = pmiX - pmiSignW / 2;
    const pmiSignY = 226;
    drawRoundedBadgeL2(
      ctx,
      pmiSignX,
      pmiSignY,
      pmiSignW,
      pmiSignH,
      5,
      '#991b1b',
      '#ffffff',
      1.5
    );
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 10.5px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('POSKO KESEHATAN PMI', pmiX, pmiSignY + pmiSignH / 2);

    ctx.restore();
  }

  // ── 4.5. DAPUR UMUM TAGANA KEMENSOS (x: 1300 - 1460, Pak Slamet di x: 1440) ──
  const taganaX = 1380;
  if (taganaX + 160 > camX && taganaX - 160 < camX + viewW) {
    ctx.save();
    // Tenda Biru Tagana
    ctx.fillStyle = '#1e40af';
    ctx.beginPath();
    ctx.moveTo(taganaX - 70, 356);
    ctx.lineTo(taganaX - 55, 270);
    ctx.lineTo(taganaX, 244);
    ctx.lineTo(taganaX + 55, 270);
    ctx.lineTo(taganaX + 70, 356);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.moveTo(taganaX - 55, 270);
    ctx.lineTo(taganaX, 244);
    ctx.lineTo(taganaX + 55, 270);
    ctx.lineTo(taganaX + 45, 356);
    ctx.lineTo(taganaX - 45, 356);
    ctx.closePath();
    ctx.fill();

    // Kuali Besar Masakan Hangat di Luar Tenda
    ctx.fillStyle = '#334155';
    ctx.fillRect(taganaX + 50, 332, 28, 14);
    ctx.beginPath();
    ctx.arc(taganaX + 64, 346, 14, 0, Math.PI);
    ctx.fill();
    // Api Kompor Gas Biru-Kuning
    const flameColor = animTick % 4 < 2 ? '#38bdf8' : '#facc15';
    ctx.fillStyle = flameColor;
    ctx.fillRect(taganaX + 56, 350, 16, 6);

    // Asap Hangat Masakan Mengepul
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let st = 0; st < 3; st++) {
      const steamY = 326 - st * 8 - (animTick % 12);
      ctx.beginPath();
      ctx.arc(taganaX + 64 + Math.sin(animTick * 0.1 + st) * 3, steamY, 4 + st * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Karung Logistik Beras BULOG
    ctx.fillStyle = '#d97706';
    ctx.fillRect(taganaX - 68, 328, 22, 28);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(taganaX - 66, 330, 18, 12);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 8.5px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('BERAS', taganaX - 57, 345);

    // Spanduk Dapur Umum (Kotak Disesuaikan & Tulisan Mudah Dibaca)
    const taganaSignW = 156;
    const taganaSignH = 22;
    const taganaSignX = taganaX - taganaSignW / 2;
    const taganaSignY = 226;
    drawRoundedBadgeL2(
      ctx,
      taganaSignX,
      taganaSignY,
      taganaSignW,
      taganaSignH,
      5,
      '#1e3a8a',
      '#93c5fd',
      1.5
    );
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 10.5px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('DAPUR UMUM TAGANA', taganaX, taganaSignY + taganaSignH / 2);

    ctx.restore();
  }

  // ── 4.6. RUMAH WARGA DATARAN RENDAH DENGAN ATAP ABU VULKANIK TEBAL (x: 1650 - 1840) ──
  const houseX = 1740;
  if (houseX + 160 > camX && houseX - 160 < camX + viewW) {
    ctx.save();
    // Dinding Rumah Papan
    ctx.fillStyle = '#d97706';
    ctx.fillRect(houseX - 50, 280, 100, 76);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(houseX - 46, 284, 92, 72);

    // Pintu & Jendela
    ctx.fillStyle = '#451a03';
    ctx.fillRect(houseX - 14, 308, 28, 48);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(houseX - 40, 300, 18, 20);
    ctx.fillRect(houseX + 22, 300, 18, 20);

    // Atap Genteng Rumah
    ctx.fillStyle = '#991b1b';
    ctx.beginPath();
    ctx.moveTo(houseX - 64, 280);
    ctx.lineTo(houseX, 232);
    ctx.lineTo(houseX + 64, 280);
    ctx.closePath();
    ctx.fill();

    // ── ENDAPAN ABU VULKANIK TEBAL DI ATAS GENTENG (BAHAYA ATAP AMBRUK >1.500 KG/M3) ──
    ctx.fillStyle = '#64748b'; // Lapisan abu vulkanik abu-abu gelap tebal
    ctx.beginPath();
    ctx.moveTo(houseX - 64, 280);
    ctx.lineTo(houseX, 232);
    ctx.lineTo(houseX + 64, 280);
    ctx.lineTo(houseX + 60, 274);
    ctx.lineTo(houseX, 226);
    ctx.lineTo(houseX - 60, 274);
    ctx.closePath();
    ctx.fill();

    // Guratan Abu Vulkanik Runtuh Halus
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(houseX - 30, 256, 12, 18);
    ctx.fillRect(houseX + 14, 252, 14, 22);

    // ── TANGGA BAMBU BERSANDAR DI ATAP (POSISI KOKOH DI TANAH & MENYANDAR DI ATAP) ──
    // Bayangan kaki tangga di tanah
    ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
    ctx.fillRect(houseX + 55, 354, 14, 2);

    // Kaki bantalan tangga (Grounded di permukaan tanah y: 354)
    ctx.fillStyle = '#451a03';
    ctx.fillRect(houseX + 56.5, 353, 3.5, 3);
    ctx.fillRect(houseX + 64.5, 353, 3.5, 3);

    // Tiang Tangga Bambu Ganda (Menyandar dari tanah y: 354 ke atap y: 254)
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    // Tiang kiri
    ctx.moveTo(houseX + 58, 354);
    ctx.lineTo(houseX + 44, 254);
    // Tiang kanan
    ctx.moveTo(houseX + 66, 354);
    ctx.lineTo(houseX + 52, 254);
    ctx.stroke();

    // Kilau Serat Bambu
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(houseX + 58.8, 353);
    ctx.lineTo(houseX + 44.8, 255);
    ctx.moveTo(houseX + 66.8, 353);
    ctx.lineTo(houseX + 52.8, 255);
    ctx.stroke();

    // 7 Anak Tangga (Rungs) Menghubungkan Tiang Kiri & Kanan Secara Pas
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2;
    for (let r = 0; r < 7; r++) {
      const curY = 342 - r * 12.5;
      const t = (354 - curY) / (354 - 254);
      const x1 = (houseX + 58) * (1 - t) + (houseX + 44) * t;
      const x2 = (houseX + 66) * (1 - t) + (houseX + 52) * t;
      ctx.beginPath();
      ctx.moveTo(x1, curY);
      ctx.lineTo(x2, curY);
      ctx.stroke();
    }

    // Sekop & Sapu Lidi di Depan Rumah
    ctx.fillStyle = '#a16207';
    ctx.fillRect(houseX - 42, 332, 2, 24);
    ctx.fillStyle = '#475569';
    ctx.fillRect(houseX - 46, 350, 10, 6); // Mata sekop

    // Rambu Peringatan Jalan Berabu (Kotak Proporsional & Font Terbaca Jelas)
    const roadSignW = 48;
    const roadSignH = 26;
    const roadSignX = houseX - 90;
    const roadSignY = 308;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(roadSignX + roadSignW / 2 - 1.5, roadSignY + roadSignH, 3, 24); // Tiang
    drawRoundedBadgeL2(ctx, roadSignX, roadSignY, roadSignW, roadSignH, 4, '#facc15', '#0f172a', 1.5);
    ctx.fillStyle = '#0f172a';
    ctx.font = '900 8.5px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('JALAN', roadSignX + roadSignW / 2, roadSignY + 8);
    ctx.fillText('LICIN!', roadSignX + roadSignW / 2, roadSignY + 18);

    ctx.restore();
  }

  // ── 4.7. RAMBU PERINGATAN BAHAYA BANJIR LAHAR DINGIN BNPB (x: 1880 - 1940) ──
  const laharSignX = 1910;
  if (laharSignX + 80 > camX && laharSignX - 80 < camX + viewW) {
    ctx.save();
    // Tiang Rambu Baja Hitam-Kuning
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(laharSignX - 3, 270, 6, 86);
    // Garis Loreng Hitam-Kuning di Tiang
    ctx.fillStyle = '#facc15';
    ctx.fillRect(laharSignX - 3, 290, 6, 8);
    ctx.fillRect(laharSignX - 3, 310, 6, 8);
    ctx.fillRect(laharSignX - 3, 330, 6, 8);

    // Papan Rambu Peringatan Segitiga Kuning Lahar Dingin
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(laharSignX, 230);
    ctx.lineTo(laharSignX - 36, 270);
    ctx.lineTo(laharSignX + 36, 270);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Ikon Tanda Seru Bahaya
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(laharSignX - 2, 244, 4, 14);
    ctx.fillRect(laharSignX - 2, 262, 4, 4);

    // Papan Tambahan Bawah: "AWAS LAHAR HUJAN DARI HULU MERAPI" (Kotak Pas & Font Jelas)
    const laharBoardW = 144;
    const laharBoardH = 30;
    const laharBoardX = laharSignX - laharBoardW / 2;
    const laharBoardY = 270;
    drawRoundedBadgeL2(
      ctx,
      laharBoardX,
      laharBoardY,
      laharBoardW,
      laharBoardH,
      5,
      '#dc2626',
      '#ffffff',
      1.5
    );
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 10px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('AWAS LAHAR HUJAN', laharSignX, laharBoardY + 10);
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 8.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('HULU SUNGAI MERAPI', laharSignX, laharBoardY + 21);

    // Sensor EWS Sirene di Puncak Tiang
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(laharSignX - 8, 222, 16, 8);
    // Lampu Strobo EWS
    const isSireneFlash = Math.floor(animTick / 10) % 2 === 0;
    ctx.fillStyle = isSireneFlash ? '#ef4444' : '#f59e0b';
    ctx.beginPath();
    ctx.arc(laharSignX, 218, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // 5. Partikel Halus Debu Abu Vulkanik yang Melayang Tenang (Safe Ambient Dusting)
  ctx.fillStyle = 'rgba(203, 213, 225, 0.45)';
  for (let p = 0; p < 24; p++) {
    const px = (camX + (p * 97 + animTick * 0.4)) % (viewW + 200) - 100 + camX;
    const py = 60 + (p * 37 + animTick * 0.7) % 290;
    ctx.fillRect(px, py, 2, 2);
  }
}

// ── LELEHAN MAGMA TIPIS-TIPIS DI AREA BARAK PENGUNGSIAN (SESUAI GAMBAR 4 REFERENSI PENGGUNA) ──
function drawArea6DistantLavaVeins(
  ctx: CanvasRenderingContext2D,
  merapiX: number,
  merapiPeakY: number,
  mScale: number,
  animTick: number
): void {
  // Alur lelehan magma tipis-tipis di Area 6 sesuai goresan garis merah Gambar 4:
  // 1. Alur Lembah Kiri: mulai dari tengah lembah kiri, membelah dua (cabang kiri dan cabang kanan) menuju kaki gunung
  const leftFork: Point2D = { x: merapiX - 70 * mScale, y: merapiPeakY + 110 * mScale };
  const leftUpperStem: Point2D[] = [
    { x: merapiX - 42 * mScale, y: merapiPeakY + 70 * mScale },
    { x: merapiX - 56 * mScale, y: merapiPeakY + 92 * mScale },
    leftFork,
  ];
  const leftBranchOuter: Point2D[] = [
    leftFork,
    { x: merapiX - 98 * mScale, y: merapiPeakY + 148 * mScale },
    { x: merapiX - 130 * mScale, y: merapiPeakY + 188 * mScale },
    { x: merapiX - 160 * mScale, y: 360 },
  ];
  const leftBranchInner: Point2D[] = [
    leftFork,
    { x: merapiX - 70 * mScale, y: merapiPeakY + 110 * mScale },
    { x: merapiX - 76 * mScale, y: merapiPeakY + 145 * mScale },
    { x: merapiX - 84 * mScale, y: merapiPeakY + 185 * mScale },
    { x: merapiX - 92 * mScale, y: 360 },
  ];

  // 2. Alur Lereng Kanan: dari lereng tengah kanan menyusuri lembah menuju kaki gunung di belakang pinus
  const rightStem: Point2D[] = [
    { x: merapiX + 50 * mScale, y: merapiPeakY + 78 * mScale },
    { x: merapiX + 76 * mScale, y: merapiPeakY + 115 * mScale },
    { x: merapiX + 108 * mScale, y: merapiPeakY + 152 * mScale },
    { x: merapiX + 140 * mScale, y: 360 },
  ];

  const streams = [leftUpperStem, leftBranchOuter, leftBranchInner, rightStem];

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Pass 1: Pendaran merah hangat lembut tipis (Subtle Thermal Glow)
  ctx.shadowColor = 'rgba(239, 68, 68, 0.45)';
  ctx.shadowBlur = 6;
  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 3.2;
  for (const s of streams) {
    ctx.beginPath();
    ctx.moveTo(s[0].x, s[0].y);
    for (let i = 1; i < s.length; i++) ctx.lineTo(s[i].x, s[i].y);
    ctx.stroke();
  }

  // Pass 2: Inti oranye hangat tipis
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.strokeStyle = '#ea580c';
  ctx.lineWidth = 1.8;
  for (const s of streams) {
    ctx.beginPath();
    ctx.moveTo(s[0].x, s[0].y);
    for (let i = 1; i < s.length; i++) ctx.lineTo(s[i].x, s[i].y);
    ctx.stroke();
  }

  // Pass 3: Benang pijar kuning emas berdenyut halus (Pulsing Ember Thread)
  const pulse = Math.sin(animTick * 0.08) * 0.5 + 0.5;
  ctx.strokeStyle = pulse > 0.4 ? '#fef08a' : '#f59e0b';
  ctx.lineWidth = 0.9;
  for (const s of streams) {
    ctx.beginPath();
    ctx.moveTo(s[0].x, s[0].y);
    for (let i = 1; i < s.length; i++) ctx.lineTo(s[i].x, s[i].y);
    ctx.stroke();
  }

  ctx.restore();
}

// D. MOBIL EVAKUASI AKHIR KEMENANGAN LEVEL 2 (PERSIS SAMA DENGAN MOBIL DI AREA SIMULASI ERUPSI)
export function drawFinalEvacuationCapsuleL2(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  isUnlocked: boolean,
  animTick: number
): void {
  // 1. Gambar Truk Evakuasi yang persis sama dengan Truk di Area Simulasi Erupsi (Area 5)
  drawEvacuationRescueTruck(ctx, px, py - 4, 'parked', animTick);

  ctx.save();
  ctx.translate(px, py - 4);

  // 2. Efek Kesiapan jika Unlocked (Sorot Lampu Depan, Asap Knalpot, Partikel Emas)
  if (isUnlocked) {
    // Sorot Lampu Depan ke Depan Jalan
    const beamGrad = ctx.createLinearGradient(69, -22, 140, -22);
    beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
    beamGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(69, -26);
    ctx.lineTo(140, -40);
    ctx.lineTo(140, -4);
    ctx.lineTo(69, -18);
    ctx.closePath();
    ctx.fill();

    // Asap Knalpot Mesin Menyala
    const puff = (animTick * 0.15) % 3;
    ctx.fillStyle = 'rgba(226, 232, 240, 0.45)';
    ctx.beginPath();
    ctx.arc(-74 - puff * 5, -12 - puff * 2, 3 + puff * 2, 0, Math.PI * 2);
    ctx.fill();

    // Partikel kilau emas kemenangan di sekitar mobil
    for (let i = 0; i < 6; i++) {
      const angle = animTick * 0.05 + i * (Math.PI / 3);
      const radX = 64 + Math.sin(animTick * 0.08 + i) * 6;
      const radY = 28 + Math.cos(animTick * 0.08 + i) * 4;
      const sx = Math.cos(angle) * radX;
      const sy = -32 + Math.sin(angle) * radY;
      ctx.fillStyle = i % 2 === 0 ? '#fde047' : '#38bdf8';
      ctx.fillRect(sx - 2, sy - 2, 4, 4);
    }
  }

  // 3. Floating Badge di Atas Mobil Evakuasi
  const badgeY = -104 + Math.sin(animTick * 0.08) * 3;
  const badgeW = isUnlocked ? 236 : 210;
  const badgeH = 34;

  drawRoundedBadgeL2(
    ctx,
    -badgeW / 2,
    badgeY,
    badgeW,
    badgeH,
    6,
    'rgba(15, 23, 42, 0.95)',
    isUnlocked ? '#22c55e' : '#f59e0b',
    1.5
  );

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = isUnlocked ? '#4ade80' : '#fbbf24';
  ctx.font = '900 11px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(
    isUnlocked ? '★ MOBIL EVAKUASI SIAP BERANGKAT! ★' : 'MOBIL EVAKUASI TERKUNCI',
    0,
    badgeY + 11
  );

  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 8.5px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(
    isUnlocked ? '[E] NAIK KE MOBIL & SELESAIKAN LEVEL 2' : '[BICARA DENGAN BU TYAS]',
    0,
    badgeY + 24
  );

  ctx.restore();
}
