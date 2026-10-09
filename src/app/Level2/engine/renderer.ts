import type {
  GameStateL2,
  AreaTransitionBannerL2,
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
} from './draw/merapi';

// ── Lokasi tambahan & lapisan simulasi (Langkah 6) ────────────────────────
export {
  drawArea6DistantLavaVeins,
  drawFinalEvacuationCapsuleL2,
  drawOffscreenVillagerRadar,
  drawPosPgaExitGapura,
  drawShelterEntranceBackGate,
  drawShelterRecoveryAtmosphere,
  drawShelterRecoveryGround,
  drawTopVolcanoStatusBanner,
  drawVolcanoDarkScreenTransition,
  drawVolcanoEvacuationExitGate,
  drawVolcanoFailedOverlay,
  drawVolcanoQteKentonganOverlay,
  drawVolcanoQteRescueOverlay,
  drawVolcanoQteTruckOverlay,
  drawVolcanoSimulationOverlays,
  drawVolcanoSirenPromptOverlay,
  drawVolcanoVillagerWorldBubbles,
} from './draw/locations';
import {
  drawFinalEvacuationCapsuleL2,
  drawPosPgaExitGapura,
  drawShelterEntranceBackGate,
  drawShelterRecoveryAtmosphere,
  drawShelterRecoveryGround,
  drawVolcanoEvacuationExitGate,
  drawVolcanoSimulationOverlays,
  drawVolcanoVillagerWorldBubbles,
} from './draw/locations';

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