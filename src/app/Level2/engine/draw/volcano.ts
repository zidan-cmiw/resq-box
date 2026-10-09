// ── engine/draw/volcano.ts ────────────────────────────────────────────────
// Gambar gunung berapi: kolom abu, air mancur magma, aliran lava, dan
// lapisan abu jatuh. Dipisahkan dari renderer.ts (Langkah 2 dari pemecahan).
//
// KENAPA BLOK INI YANG DIPILIH
//   Dari seluruh kelompok bertema gunung, blok ini adalah yang paling mandiri:
//   hanya membutuhkan CanvasRenderingContext2D dan drawRealisticVolcanicSmoke
//   dari modul DASAR. Tidak memanggil fungsi tema lain sama sekali.
//
//   Dua fungsi tema gunung yang lain (drawVolcanoSimulationVillage dan
//   drawEvacuationRescueTruck) SENGAJA TIDAK dipindahkan ke sini, karena
//   keduanya berada setelah blok ini di renderer.ts dan memanggil fungsi
//   volcano. Memindahkannya akan menimbulkan impor melingkar. Keduanya
//   menunggu langkah pemecahan berikutnya.
//
// ATURAN: modul ini hanya boleh mengimpor dari ./base (lapisan DASAR).

import { drawRealisticVolcanicSmoke } from './base';
import type {
  GameStateL2,
  BirdParticleL2,
  AshFallParticleL2,
  VolcanoSimulationDataL2,
} from '../gameEngine';

// C. KOLOM ABU GELAP KEHITAMAN BERGULUNG-GULUNG (STATUS SIAGA)
// C. KOLOM ABU GELAP KEHITAMAN BERGULUNG-GULUNG (STATUS SIAGA)
export function drawDenseDarkAshPlume(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  animTick: number,
  mountainScale: number = 1.0
): void {
  drawRealisticVolcanicSmoke(ctx, px, py, animTick, 'dark_ash', 1.1 * mountainScale);
}

// D. LETUSAN EKSPLOSIF MERAPI (STATUS AWAS):
// Semburan gas tekanan tinggi, kubah awan abu bunga kol (cauliflower),
// awan panas wedhus gembel di lereng, dan semburan batu piroklastik/eflata dengan jejak asap/bara!
export function drawMagmaExplosiveFountain(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  animTick: number,
  sim?: VolcanoSimulationDataL2,
  mountainScale: number = 1.0
): void {
  ctx.save();

  // 1. Pijar Kawah Membara Ekstrem (Crater Incandescent Core & Light Dome)
  const glowPulse = (45 + Math.sin(animTick * 0.25) * 12) * mountainScale;
  const craterGlow = ctx.createRadialGradient(px, py, 4, px, py, Math.max(8, glowPulse));
  craterGlow.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
  craterGlow.addColorStop(0.2, 'rgba(254, 240, 138, 0.85)');
  craterGlow.addColorStop(0.5, 'rgba(249, 115, 22, 0.65)');
  craterGlow.addColorStop(0.8, 'rgba(220, 38, 38, 0.35)');
  craterGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = craterGlow;
  ctx.beginPath();
  ctx.arc(px, py - 4, Math.max(8, glowPulse), 0, Math.PI * 2);
  ctx.fill();

  // 2. Kolom Semburan Gas & Magma Tekanan Tinggi (Vertical Gas Jet Core)
  const jetH = (120 + Math.sin(animTick * 0.18) * 25) * mountainScale;
  const jetW = (18 + Math.cos(animTick * 0.22) * 4) * mountainScale;

  const jetGrad = ctx.createLinearGradient(px, py, px, py - jetH);
  jetGrad.addColorStop(0, '#ffffff');
  jetGrad.addColorStop(0.15, '#fef08a');
  jetGrad.addColorStop(0.4, '#f97316');
  jetGrad.addColorStop(0.7, '#ea580c');
  jetGrad.addColorStop(0.9, '#7f1d1d');
  jetGrad.addColorStop(1, '#27272a');

  ctx.fillStyle = jetGrad;
  ctx.beginPath();
  ctx.moveTo(px - jetW * 0.7, py);
  ctx.lineTo(px - jetW * 1.3, py - jetH * 0.6);
  ctx.quadraticCurveTo(px, py - jetH, px + jetW * 1.3, py - jetH * 0.6);
  ctx.lineTo(px + jetW * 0.7, py);
  ctx.closePath();
  ctx.fill();

  // 3. Kolom Abu Erupsi Tebal Realistis (Bukan Bulatan Kaku)
  // Menggunakan teknik kepulan amorf organik bergelombang bertingkat seperti saat Siaga, tetapi jauh lebih tebal & masif
  drawRealisticVolcanicSmoke(ctx, px, py, animTick, 'dark_ash', 2.3 * mountainScale);
  drawRealisticVolcanicSmoke(ctx, px - 6 * mountainScale, py - 14 * mountainScale, animTick + 45, 'dark_ash', 1.75 * mountainScale);


  // 5. Lontaran Bom Batuan Piroklastik (Eflata) Berpijar & Berasap (sim.volcanoBombs)
  if (sim && sim.volcanoBombs && sim.volcanoBombs.length > 0) {
    for (const b of sim.volcanoBombs) {
      if (b.trail && b.trail.length > 0) {
        for (let t = 0; t < b.trail.length; t++) {
          const pt = b.trail[t];
          ctx.fillStyle = t % 2 === 0
            ? `rgba(249, 115, 22, ${pt.opacity * 0.7})`
            : `rgba(82, 82, 91, ${pt.opacity * 0.6})`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, Math.max(1, (b.size * 0.45) * (t / b.trail.length)), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.rotation);

      const bombGlow = ctx.createRadialGradient(0, 0, 1, 0, 0, b.size * 1.8);
      bombGlow.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      bombGlow.addColorStop(0.35, 'rgba(249, 115, 22, 0.75)');
      bombGlow.addColorStop(1, 'rgba(220, 38, 38, 0)');
      ctx.fillStyle = bombGlow;
      ctx.beginPath();
      ctx.arc(0, 0, b.size * 1.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#1c1917';
      ctx.beginPath();
      ctx.moveTo(-b.size * 0.5, -b.size * 0.4);
      ctx.lineTo(b.size * 0.4, -b.size * 0.6);
      ctx.lineTo(b.size * 0.6, b.size * 0.2);
      ctx.lineTo(-b.size * 0.2, b.size * 0.6);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-b.size * 0.3, -b.size * 0.2);
      ctx.lineTo(b.size * 0.1, 0);
      ctx.lineTo(b.size * 0.3, b.size * 0.3);
      ctx.stroke();

      ctx.restore();
    }
  }

  // 6. Kilatan Petir Vulkanik Berpendar Kuat (Volcanic Lightning)
  if (animTick % 24 < 6) {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#67e8f9';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(px - 14 * mountainScale, py - 40 * mountainScale);
    ctx.lineTo(px + 12 * mountainScale, py - 85 * mountainScale);
    ctx.lineTo(px - 10 * mountainScale, py - 125 * mountainScale);
    ctx.lineTo(px + 18 * mountainScale, py - 175 * mountainScale);
    ctx.stroke();

    ctx.strokeStyle = '#a5f3fc';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(px + 12 * mountainScale, py - 85 * mountainScale);
    ctx.lineTo(px + 35 * mountainScale, py - 105 * mountainScale);
    ctx.stroke();
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  }

  ctx.restore();
}

// D.2. ERUPSI EFUSIF MERAPI (STATUS AWAS - SKENARIO EFUSIF):
// Tekanan gas rendah, magma cair & encer, minim ledakan material padat,
// tanpa semburan pilar gas vertikal & tanpa bom piroklastik,
// dengan kepulan uap solfatara & gas vulkanik melimpah yang menyebar mendatar secara luas di atas puncak dan lereng.
// DIBUAT REALISTIS: Menggunakan Harmonic Perturbed Amorphous Polygons (BUKAN lingkaran bunder-bunder kaku)!
export function drawMagmaEffusiveFountain(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  animTick: number,
  mountainScale: number = 1.0
): void {
  ctx.save();

  // 1. Pijar Kubah Magma Membara Tenang di Kawah (Bukan Ledakan Semburan Tinggi)
  const glowPulse = (32 + Math.sin(animTick * 0.18) * 8) * mountainScale;
  const craterGlow = ctx.createRadialGradient(px, py, 2, px, py, Math.max(6, glowPulse));
  craterGlow.addColorStop(0, '#ffffff');
  craterGlow.addColorStop(0.25, '#fef08a');
  craterGlow.addColorStop(0.55, '#f97316');
  craterGlow.addColorStop(0.85, 'rgba(239, 68, 68, 0.4)');
  craterGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = craterGlow;
  ctx.beginPath();
  ctx.arc(px, py - 2, Math.max(6, glowPulse), 0, Math.PI * 2);
  ctx.fill();

  // 2. Danau Magma Mendidih Lembut di Bibir Kawah (Lava Pool Dome)
  const poolW = 28 * mountainScale;
  const poolH = 7 * mountainScale;
  const poolGrad = ctx.createLinearGradient(px - poolW, py, px + poolW, py);
  poolGrad.addColorStop(0, '#ef4444');
  poolGrad.addColorStop(0.3, '#f97316');
  poolGrad.addColorStop(0.5, '#fef08a');
  poolGrad.addColorStop(0.7, '#f97316');
  poolGrad.addColorStop(1, '#ef4444');
  ctx.fillStyle = poolGrad;
  ctx.beginPath();
  ctx.ellipse(px, py, poolW, poolH, 0, 0, Math.PI * 2);
  ctx.fill();

  // 3. KEPUAN ASAP & UAP VULKANIK REALISTIS MELIMPAH (BANYAK & AMORF BERGULUNG, BUKAN BUNDER-BUNDER)
  // Menggunakan teknik Harmonic Perturbed Amorphous Polygons dengan multi-lobe cumulus billow
  // Menghasilkan tekstur asap bergelombang organik seperti kepulan gas fumarol & solfatara asli
  const puffCount = 28; // Volume kepulan melimpah (28 kluster awan amorf)

  for (let i = 0; i < puffCount; i++) {
    // Progres naik & menyebar: laju tenang tapi menyebar lebar
    const speed = 0.0034;
    const progress = ((animTick * speed + i / puffCount) % 1);

    // Dua sistem aliran: 55% menyebar ke lereng barat/timur, 45% membubung lembut di atas kawah
    const isFlankSpread = i % 2 === 0;
    const driftDir = i % 4 < 2 ? -1 : 1; // Kiri atau kanan lereng

    // Drift horizontal dominan (menyebar luas di atas lereng)
    const horizDrift = isFlankSpread
      ? driftDir * (16 + progress * 98 + (i % 5) * 8) * mountainScale
      : driftDir * (6 + progress * 44) * mountainScale;

    // Turbulensi angin lereng meliuk organik
    const sway = Math.sin(animTick * 0.02 + i * 1.4) * (8 + progress * 18) * mountainScale;

    // Ketinggian naik (lebih rendah dari letusan eksplosif tapi membubung luas)
    const maxRise = (isFlankSpread ? 55 : 88) * mountainScale;
    const puffX = px + horizDrift + sway;
    const puffY = py - (progress * maxRise + Math.abs(horizDrift) * 0.14);

    // Radius mengembang bertahap saat uap memuai
    const baseR = (11 + (i % 3) * 3) * mountainScale;
    const expandR = (isFlankSpread ? 44 : 38) * mountainScale;
    const r = baseR + progress * expandR;

    // Transparansi memudar lembut (Gaussian envelope)
    let alpha: number;
    if (progress < 0.15) {
      alpha = (progress / 0.15) * 0.78;
    } else {
      alpha = Math.max(0, Math.pow(1 - progress, 1.15) * 0.78);
    }
    if (alpha <= 0.01) continue;

    // Multi-lobe Amorphous Billows (4 lobus amorf per puff)
    const lobeCount = 4;
    const puffSeed = i * 2.71828;
    const rotSpeed = animTick * 0.008 * (i % 2 === 0 ? 1 : -1);

    for (let l = 0; l < lobeCount; l++) {
      const angle = (l / lobeCount) * Math.PI * 2 + rotSpeed + puffSeed;
      const dist = r * (0.32 + Math.sin(puffSeed + l * 1.8) * 0.1);
      const lx = puffX + Math.cos(angle) * dist;
      const ly = puffY + Math.sin(angle) * dist * 0.75; // Sedikit pipih aerodinamis
      const lr = r * (0.55 + Math.sin(puffSeed * 1.3 + l) * 0.15);

      const radGrad = ctx.createRadialGradient(
        lx - lr * 0.25, ly - lr * 0.25, lr * 0.05,
        lx, ly, lr
      );

      if (progress < 0.16 && l % 2 === 0) {
        // Dekat mulut kawah: pendaran bara magma membara di balik asap abu gelap
        radGrad.addColorStop(0, `rgba(249, 115, 22, ${alpha * 0.9})`);
        radGrad.addColorStop(0.35, `rgba(180, 83, 9, ${alpha * 0.65})`);
        radGrad.addColorStop(0.7, `rgba(68, 64, 60, ${alpha * 0.45})`);
        radGrad.addColorStop(1, 'rgba(28, 25, 23, 0)');
      } else {
        // Gumpalan asap abu-abu kehitaman tebal realistis (Sesuai instruksi pengguna)
        radGrad.addColorStop(0, `rgba(87, 83, 78, ${alpha * 0.95})`);   // Abu gelap
        radGrad.addColorStop(0.3, `rgba(68, 64, 60, ${alpha * 0.88})`);  // Abu kehitaman
        radGrad.addColorStop(0.65, `rgba(41, 37, 36, ${alpha * 0.65})`); // Hitam arang
        radGrad.addColorStop(0.88, `rgba(28, 25, 23, ${alpha * 0.3})`);  // Jelaga vulkanik
        radGrad.addColorStop(1, 'rgba(12, 10, 9, 0)');
      }

      ctx.fillStyle = radGrad;

      // Kontur Poligon Harmonik Bergelombang 10-Titik (Harmonic Perturbed Polygon)
      // BUKAN lingkaran bunder-bunder kaku! Bentuknya amorf, berserat, dan berlipat-lipat alami
      ctx.beginPath();
      const numPts = 10;
      for (let p = 0; p <= numPts; p++) {
        const theta = (p / numPts) * Math.PI * 2;
        const pert = 1 + 0.24 * Math.sin(theta * 3 + puffSeed + l)
          + 0.14 * Math.cos(theta * 4 - puffSeed);
        const ptX = lx + Math.cos(theta) * lr * pert;
        const ptY = ly + Math.sin(theta) * lr * pert * 0.82;
        if (p === 0) ctx.moveTo(ptX, ptY);
        else ctx.lineTo(ptX, ptY);
      }
      ctx.closePath();
      ctx.fill();
    }
  }

  // 4. Gelembung Letupan Magma Cair di Permukaan Kawah
  for (let b = 0; b < 3; b++) {
    const bPhase = (animTick * 0.12 + b * 2.3) % (Math.PI * 2);
    const bScale = Math.sin(bPhase);
    if (bScale > 0.4) {
      const bx = px + (b - 1) * 8 * mountainScale;
      const by = py - 2 + Math.cos(bPhase) * 2 * mountainScale;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(bx, by, 2 * bScale * mountainScale, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

// D.3. HILIR SUNGAI DI DEKAT GUNUNG (SKENARIO EFUSIF):
// - Map 1: Dekat sungai (sungai lebar di midground)
// - Map 2: Mulai jauh dari sungai (sungai di lembah bukit lebih jauh)
// - Map 3: Jauh banget dari sungai (sungai pita kecil di kejauhan kaki bukit)
// - Perubahan warna air antar-fase:
//   * Fase 1 & 2: Biru segar alami pegunungan
//   * Fase 3: Mulai mengeruh kecokelatan akibat abu & endapan lereng
//   * Fase 4: Keruh banget pekat sedimen vulkanik (KERUH, BUKAN MERAH!)
export function drawEffusiveDownstreamRiver(
  ctx: CanvasRenderingContext2D,
  camX: number,
  viewW: number,
  state: GameStateL2
): void {
  const sim = state.volcanoSim;
  const animTick = state.animTick;
  const subMap = sim?.subMap ?? 1;
  const isPostEruption =
    state.unlockedGates.has('l2_gate_volcano_sim') &&
    (!sim || sim.phase === 'idle' || sim.phase === 'volcano_completed');
  const wither = isPostEruption ? 1.0 : (sim?.vegetationWither ?? 0);

  // Tentukan Fase Kekeruhan Air Sungai Sesuai Request Pengguna:
  // - Fase 1 & 2: Biru bersih segar alami pegunungan (Normal & Waspada)
  // - Fase 3: Mulai mengeruh abu-abu kecokelatan (Siaga)
  // - Fase 4: Keruh banget pekat sedimen vulkanik (Awas / Pasca Erupsi) - KERUH, BUKAN MERAH!
  let turbidityStage: 'clear_blue' | 'murky_silt' | 'magmatic_turbid' = 'clear_blue';

  if (isPostEruption) {
    turbidityStage = 'magmatic_turbid';
  } else if (sim) {
    if (
      sim.phase === 'fase4_awas_earthquake' ||
      sim.phase === 'fase4_awas_siren' ||
      sim.phase === 'fase4_awas_rescue' ||
      sim.phase === 'fase4_awas_truck' ||
      sim.phase === 'volcano_completed' ||
      sim.statusLevel === 'AWAS'
    ) {
      turbidityStage = 'magmatic_turbid';
    } else if (
      sim.phase === 'fase3_siaga_popup' ||
      sim.phase === 'fase3_siaga_migration' ||
      sim.phase === 'fase3_siaga_prep_evac' ||
      sim.phase === 'fase3_map3_arrived' ||
      sim.phase === 'fase3_map3_after_timeskip' ||
      sim.statusLevel === 'SIAGA'
    ) {
      turbidityStage = 'murky_silt';
    } else {
      turbidityStage = 'clear_blue';
    }
  }

  // Parameter geometri sungai berdasarkan SubMap (Perspektif Jarak):
  // - Map 1 (Dekat hilir sungai): Lebar ~46px, mengalir di lembah tepat di belakang jalan desa (Y: 286..332),
  //   dengan tebing bantaran dekat yang menyambung langsung ke lantai desa (Y: 330..360)
  // - Map 2 (Mulai jauh): Lebar ~24px di lembah perbukitan tengah (Y: 254..278),
  //   dengan punggungan bukit depan yang menyambung ke lantai desa (Y: 276..360)
  // - Map 3 (Sangat jauh): Pita sungai kecil ~8px di lembah kejauhan (Y: 248..256),
  //   dengan perbukitan depan yang menyambung solid ke lantai desa (Y: 254..360)
  let riverTopY = 286;
  let riverBotY = 332;
  let riverWaveFreq = 0.007;
  let riverWaveAmp = 6;
  let parallaxSpeed = 0.16;

  if (subMap === 1) {
    riverTopY = 286;
    riverBotY = 332;
    riverWaveFreq = 0.007;
    riverWaveAmp = 6;
    parallaxSpeed = 0.16;
  } else if (subMap === 2) {
    riverTopY = 254;
    riverBotY = 278;
    riverWaveFreq = 0.011;
    riverWaveAmp = 4;
    parallaxSpeed = 0.11;
  } else {
    // Map 3: Jauh banget dari sungai (pita kecil di lembah kejauhan)
    riverTopY = 248;
    riverBotY = 256;
    riverWaveFreq = 0.015;
    riverWaveAmp = 2;
    parallaxSpeed = 0.08;
  }

  const paraX = camX * parallaxSpeed;
  const riverHeight = riverBotY - riverTopY;

  ctx.save();

  // 1. Dinding Tebing Seberang / Hulu Sungai (Far Riverbank Slope)
  ctx.fillStyle = turbidityStage === 'magmatic_turbid' ? '#292524' : '#451a03';
  ctx.beginPath();
  ctx.moveTo(camX - 20, riverBotY);
  for (let x = camX - 40; x <= camX + viewW + 40; x += 30) {
    const bankY = riverTopY - 4 + Math.sin((x + paraX) * riverWaveFreq) * riverWaveAmp;
    ctx.lineTo(x, bankY);
  }
  ctx.lineTo(camX + viewW + 20, riverBotY);
  ctx.closePath();
  ctx.fill();

  // 2. Badan Air Sungai Sesuai Fase Kekeruhan
  const waterGrad = ctx.createLinearGradient(0, riverTopY, 0, riverBotY);
  if (turbidityStage === 'clear_blue') {
    // Fase 1 & 2: Biru segar alami pegunungan
    waterGrad.addColorStop(0, '#0284c7');
    waterGrad.addColorStop(0.35, '#0ea5e9');
    waterGrad.addColorStop(0.75, '#38bdf8');
    waterGrad.addColorStop(1, '#0369a1');
  } else if (turbidityStage === 'murky_silt') {
    // Fase 3: Mulai mengeruh kecokelatan akibat abu & endapan lereng
    waterGrad.addColorStop(0, '#475569');
    waterGrad.addColorStop(0.35, '#64748b');
    waterGrad.addColorStop(0.7, '#78716c');
    waterGrad.addColorStop(1, '#57534e');
  } else {
    // Fase 4: Keruh banget pekat sedimen vulkanik (Sesuai Koreksi: KERUH, BUKAN MERAH!)
    waterGrad.addColorStop(0, '#292524'); // Sedimen batuan abu gelap
    waterGrad.addColorStop(0.3, '#44403c'); // Lumpur vulkanik keruh kecokelatan
    waterGrad.addColorStop(0.7, '#334155'); // Air keruh abu lelehan Merapi
    waterGrad.addColorStop(1, '#1c1917'); // Lumpur pekat dasar sungai
  }

  ctx.fillStyle = waterGrad;
  ctx.beginPath();
  ctx.moveTo(camX - 20, riverBotY);
  for (let x = camX - 40; x <= camX + viewW + 40; x += 25) {
    const wy = riverTopY + Math.sin((x + paraX) * riverWaveFreq) * riverWaveAmp;
    ctx.lineTo(x, wy);
  }
  ctx.lineTo(camX + viewW + 20, riverBotY);
  ctx.closePath();
  ctx.fill();

  // 3. Gelombang & Arus Aliran Air Dinamis (Mengalir Organik Tanpa Garis Putus-Putus Marka Jalan)
  ctx.setLineDash([]);
  const waveColor =
    turbidityStage === 'clear_blue'
      ? 'rgba(255, 255, 255, 0.45)'
      : turbidityStage === 'murky_silt'
        ? 'rgba(226, 232, 240, 0.28)'
        : 'rgba(168, 162, 158, 0.32)';

  ctx.strokeStyle = waveColor;
  ctx.lineWidth = Math.max(1, 1.4 * (riverHeight / 50));

  for (let layer = 0; layer < (subMap === 3 ? 1 : 3); layer++) {
    const layerY = riverTopY + (riverHeight * (0.3 + layer * 0.26));
    ctx.beginPath();
    ctx.moveTo(camX - 20, layerY);
    for (let x = camX - 40; x <= camX + viewW + 40; x += 25) {
      const cy = layerY + Math.sin((x + paraX * (1 + layer * 0.15) + animTick * (1.1 + layer * 0.3)) * (riverWaveFreq * (0.9 + layer * 0.15))) * (riverWaveAmp * (0.5 + layer * 0.2));
      ctx.lineTo(x, cy);
    }
    ctx.stroke();
  }

  // 4. Khusus Fase 4 (Awas / Pasca Erupsi): Kepulan Uap Panas Halus & Pusaran Lumpur Sedimen (BUKAN MAGMA MERAH)
  if (turbidityStage === 'magmatic_turbid') {
    if (subMap <= 2) {
      ctx.strokeStyle = 'rgba(82, 82, 91, 0.35)';
      ctx.lineWidth = 1.2;
      for (let layer = 0; layer < 2; layer++) {
        const swirlY = riverTopY + riverHeight * (0.4 + layer * 0.25);
        ctx.beginPath();
        for (let x = camX - 40; x <= camX + viewW + 40; x += 30) {
          const sy = swirlY + Math.sin((x + paraX + animTick * 0.8) * 0.015) * (riverWaveAmp * 0.6);
          if (x === camX - 40) ctx.moveTo(x, sy);
          else ctx.lineTo(x, sy);
        }
        ctx.stroke();
      }

      for (let st = 0; st < 4; st++) {
        const steamX = camX + ((st * 110 + animTick * 0.7) % (viewW + 100)) - 50;
        const steamY = riverTopY + 4 - ((animTick * 0.45 + st * 18) % 22);
        const steamAlpha = Math.max(0, 0.32 - ((animTick * 0.45 + st * 18) % 22) / 22);
        ctx.fillStyle = `rgba(241, 245, 249, ${steamAlpha})`;
        ctx.beginPath();
        ctx.arc(steamX, steamY, 5 + st * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // 5. Bebatuan Andesit di Tepian Sungai (SubMap 1 & 2)
  if (subMap <= 2) {
    const rockPositions = [
      { x: 120, r: 6 }, { x: 280, r: 5 }, { x: 490, r: 8 }, { x: 740, r: 5 },
      { x: 990, r: 7 }, { x: 1240, r: 5 }, { x: 1510, r: 8 }, { x: 1820, r: 6 }
    ];
    for (const r of rockPositions) {
      const rx = r.x;
      if (rx + 30 < camX || rx - 30 > camX + viewW) continue;
      const ry = riverTopY + Math.sin((rx + paraX) * riverWaveFreq) * riverWaveAmp + 2;
      ctx.fillStyle = turbidityStage === 'magmatic_turbid' ? '#292524' : '#475569';
      ctx.beginPath();
      ctx.arc(rx, ry, r.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = turbidityStage === 'magmatic_turbid' ? '#44403c' : '#64748b';
      ctx.fillRect(rx - r.r * 0.5, ry - r.r * 0.6, r.r, r.r * 0.4);
    }
  }

  // 6. Tanggul Bantaran Dekat (Near Riverbank Slope yang Menyambung Penuh ke Lantai Dusun Y = 360)
  // BERLAKU DI SELURUH SUBMAP (1, 2, DAN 3)!
  // Mengeliminasi efek melayang secara total karena tanah depan menutup dari bibir bawah air langsung ke 360!
  const bankGrad = ctx.createLinearGradient(0, riverBotY - 4, 0, 360);
  if (wither < 0.35) {
    bankGrad.addColorStop(0, '#15803d');
    bankGrad.addColorStop(0.5, '#166534');
    bankGrad.addColorStop(1, '#14532d');
  } else if (wither < 0.75) {
    bankGrad.addColorStop(0, '#854d0e');
    bankGrad.addColorStop(0.5, '#713f12');
    bankGrad.addColorStop(1, '#451a03');
  } else {
    bankGrad.addColorStop(0, '#44403c');
    bankGrad.addColorStop(0.5, '#292524');
    bankGrad.addColorStop(1, '#1c1917');
  }

  ctx.fillStyle = bankGrad;
  ctx.beginPath();
  ctx.moveTo(camX - 20, 360);
  for (let x = camX - 40; x <= camX + viewW + 40; x += 25) {
    const nearY = riverBotY - 2 + Math.sin((x + paraX) * riverWaveFreq + 1.2) * (riverWaveAmp * 0.5);
    ctx.lineTo(x, nearY);
  }
  ctx.lineTo(camX + viewW + 20, 360);
  ctx.closePath();
  ctx.fill();

  // Garis tepian bebatuan koral/kerikil di bibir bantaran dekat (hanya di SubMap 1 & 2)
  if (subMap <= 2) {
    ctx.strokeStyle = turbidityStage === 'magmatic_turbid' ? '#292524' : '#713f12';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = camX - 40; x <= camX + viewW + 40; x += 25) {
      const nearY = riverBotY - 2 + Math.sin((x + paraX) * riverWaveFreq + 1.2) * (riverWaveAmp * 0.5);
      if (x === camX - 40) ctx.moveTo(x, nearY);
      else ctx.lineTo(x, nearY);
    }
    ctx.stroke();
  }

  // Khusus SubMap 3: Rumpun Pohon Pinus Kecil di Perbukitan Depan (Radius 5 km)
  if (subMap === 3) {
    const MAP3_PINE_CLUSTERS = [
      { x: 90, h: 28 }, { x: 340, h: 32 }, { x: 740, h: 26 },
      { x: 1180, h: 30 }, { x: 1620, h: 28 }, { x: 2010, h: 32 }
    ];
    for (const tree of MAP3_PINE_CLUSTERS) {
      const realX = tree.x;
      if (realX + 40 < camX || realX - 40 > camX + viewW) continue;
      const tH = tree.h;
      const tW = tH * 0.4;
      const nearY = riverBotY + 8 + Math.sin((realX + paraX) * riverWaveFreq + 1.2) * (riverWaveAmp * 0.5);

      // Batang kayu
      ctx.fillStyle = '#451a03';
      ctx.fillRect(realX - 1.5, nearY - 6, 3, 8);

      let c1 = wither > 0.6 ? '#713f12' : wither > 0.3 ? '#854d0e' : '#14532d';
      let c2 = wither > 0.6 ? '#a16207' : wither > 0.3 ? '#ca8a04' : '#16a34a';

      // Tier 1
      ctx.fillStyle = c1;
      ctx.beginPath();
      ctx.moveTo(realX, nearY - tH * 0.6);
      ctx.lineTo(realX + tW, nearY - 4);
      ctx.lineTo(realX - tW, nearY - 4);
      ctx.closePath();
      ctx.fill();

      // Tier 2
      ctx.fillStyle = c2;
      ctx.beginPath();
      ctx.moveTo(realX, nearY - tH);
      ctx.lineTo(realX + tW * 0.7, nearY - tH * 0.45);
      ctx.lineTo(realX - tW * 0.7, nearY - tH * 0.45);
      ctx.closePath();
      ctx.fill();
    }
  }

  ctx.restore();
}

// ─────────────────────────────────────────────────────────────────────────────
// E. ANIMASI LELEHAN MAGMA MENGALIR TURUN DARI PUNCAK KAWAH MERAPI (STATUS AWAS)
// Alur cabang lelehan magma merah membara, lidah lava lereng, dan kolam genangan magma dasar
// ─────────────────────────────────────────────────────────────────────────────

export interface Point2D {
  x: number;
  y: number;
}

interface ActiveLavaStream {
  activePts: Point2D[];
  headPt: Point2D;
  width: number;
  progress: number;
}

export function getActiveLavaStream(
  pts: Point2D[],
  prog: number,
  width: number
): ActiveLavaStream | null {
  if (prog <= 0 || pts.length < 2) return null;

  // Hitung jarak kumulatif antar titik
  const dists: number[] = [0];
  let totalLen = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const d = Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y);
    totalLen += d;
    dists.push(totalLen);
  }

  const targetLen = prog * totalLen;
  const activePts: Point2D[] = [pts[0]];
  let headPt = pts[0];

  for (let i = 0; i < pts.length - 1; i++) {
    const dStart = dists[i];
    const dEnd = dists[i + 1];
    const segLen = dEnd - dStart;

    if (targetLen >= dEnd) {
      activePts.push(pts[i + 1]);
      headPt = pts[i + 1];
    } else if (targetLen > dStart) {
      const segT = (targetLen - dStart) / Math.max(0.001, segLen);
      headPt = {
        x: pts[i].x + (pts[i + 1].x - pts[i].x) * segT,
        y: pts[i].y + (pts[i + 1].y - pts[i].y) * segT,
      };
      activePts.push(headPt);
      break;
    } else {
      break;
    }
  }

  if (activePts.length < 2) return null;

  return {
    activePts,
    headPt,
    width,
    progress: prog,
  };
}

export function drawLavaDeltaPool(
  ctx: CanvasRenderingContext2D,
  cx: number,
  baseY: number,
  w: number,
  h: number,
  isPostEruption: boolean,
  animTick: number
): void {
  if (w <= 0 || h <= 0) return;
  ctx.save();

  // 1. Pendaran Panas Termal di Sekitar Kolam Magma
  const glowRadius = Math.max(w * 0.65, h * 2);
  const glowGrad = ctx.createRadialGradient(cx, baseY - h * 0.4, 2, cx, baseY - h * 0.4, glowRadius);
  glowGrad.addColorStop(0, isPostEruption ? 'rgba(234, 88, 12, 0.45)' : 'rgba(249, 115, 22, 0.55)');
  glowGrad.addColorStop(0.55, isPostEruption ? 'rgba(220, 38, 38, 0.22)' : 'rgba(239, 68, 68, 0.25)');
  glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(cx, baseY - h * 0.3, glowRadius, 0, Math.PI * 2);
  ctx.fill();

  // 2. Badan Kolam Magma Meleleh Bergradasi Halus (Menyatu tanpa garis batas kaku)
  const poolGrad = ctx.createRadialGradient(cx, baseY - h * 0.5, 2, cx, baseY - h * 0.5, w * 0.5);
  poolGrad.addColorStop(0, isPostEruption ? '#ea580c' : '#fef08a');
  poolGrad.addColorStop(0.35, isPostEruption ? '#dc2626' : '#f97316');
  poolGrad.addColorStop(0.85, isPostEruption ? '#b91c1c' : '#ef4444');
  poolGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
  ctx.fillStyle = poolGrad;

  ctx.beginPath();
  ctx.moveTo(cx - w * 0.5, baseY);
  ctx.quadraticCurveTo(cx - w * 0.25, baseY - h, cx, baseY - h);
  ctx.quadraticCurveTo(cx + w * 0.25, baseY - h, cx + w * 0.5, baseY);
  ctx.closePath();
  ctx.fill();

  // 3. Gelembung Letupan Magma Pijar di Permukaan Kolam
  if (!isPostEruption) {
    for (let b = 0; b < 3; b++) {
      const bPhase = (animTick * 0.08 + b * 2.1) % (Math.PI * 2);
      const bScale = Math.sin(bPhase);
      if (bScale > 0.3) {
        const bx = cx + (b - 1) * (w * 0.22);
        const by = baseY - h * (0.35 + (b % 2) * 0.25);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(bx, by, 1.8 * bScale, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  ctx.restore();
}


export function drawEruptingLavaFlows(
  ctx: CanvasRenderingContext2D,
  merapiX: number,
  merapiPeakY: number,
  mountainScale: number,
  progress: number,
  animTick: number,
  isPostEruption: boolean = false,
  scenario: 'explosive' | 'effusive' = 'explosive'
): void {
  if (progress <= 0) return;

  const s = mountainScale;
  const topX = merapiX + 2 * s;
  const topY = merapiPeakY + 4 * s;
  const baseY = 360;
  const H = baseY - topY;

  // Titik persimpangan utama di tengah lereng
  const pFork: Point2D = { x: topX - 2 * s, y: topY + 0.18 * H };

  // 1. Aliran Bahu Terluar Lereng Kiri (Far-Left Ridge) - Mulai tepat dari bibir kawah kiri atas menyusuri siluet terluar hingga dasar
  const farLeftRidgePoints: Point2D[] = [
    { x: topX - 24 * s, y: topY + 3 * s },
    { x: topX - 48 * s, y: topY + 0.08 * H },
    { x: topX - 78 * s, y: topY + 0.18 * H },
    { x: topX - 165 * s, y: topY + 0.44 * H },
    { x: topX - 225 * s, y: topY + 0.62 * H },
    { x: topX - 295 * s, y: topY + 0.82 * H },
    { x: topX - 365 * s, y: baseY - 2 * s },
  ];

  // 2. Aliran Lereng Kiri Utama (Menyusuri lembah lereng kiri)
  const leftFlankPoints: Point2D[] = [
    { x: topX - 14 * s, y: topY },
    { x: topX - 36 * s, y: topY + 0.12 * H },
    { x: topX - 66 * s, y: topY + 0.24 * H },
    { x: topX - 96 * s, y: topY + 0.38 * H },
    { x: topX - 120 * s, y: topY + 0.52 * H },
    { x: topX - 144 * s, y: topY + 0.66 * H },
    { x: topX - 168 * s, y: topY + 0.82 * H },
    { x: topX - 188 * s, y: baseY - 2 * s },
  ];

  // 3. Cabang Lereng Kiri Tengah (Bercabang dari aliran kiri utama di tengah lereng ke arah kiri bawah)
  const leftMidBranchPoints: Point2D[] = [
    { x: topX - 96 * s, y: topY + 0.38 * H },
    { x: topX - 126 * s, y: topY + 0.50 * H },
    { x: topX - 156 * s, y: topY + 0.65 * H },
    { x: topX - 178 * s, y: topY + 0.80 * H },
    { x: topX - 198 * s, y: baseY - 2 * s },
  ];

  // 4. Batang Aliran Tengah Utama dari Puncak Kawah ke Persimpangan
  const trunkPoints: Point2D[] = [
    { x: topX, y: topY },
    { x: topX - 2 * s, y: topY + 0.08 * H },
    pFork,
  ];

  // 5. Cabang Tengah Kiri (Mengalir di sisi kiri pohon tengah menuju dasar)
  const centerLeftPoints: Point2D[] = [
    pFork,
    { x: topX - 14 * s, y: topY + 0.32 * H },
    { x: topX - 26 * s, y: topY + 0.50 * H },
    { x: topX - 38 * s, y: topY + 0.70 * H },
    { x: topX - 48 * s, y: baseY - 2 * s },
  ];

  // 6. Cabang Tengah Kanan (Mengalir di sisi kanan pohon tengah menuju dasar)
  const centerRightPoints: Point2D[] = [
    pFork,
    { x: topX + 12 * s, y: topY + 0.32 * H },
    { x: topX + 22 * s, y: topY + 0.50 * H },
    { x: topX + 30 * s, y: topY + 0.70 * H },
    { x: topX + 36 * s, y: baseY - 2 * s },
  ];

  // 7. Aliran Lereng Kanan Utama (Menyusuri lembah lereng kanan)
  const rightFlankPoints: Point2D[] = [
    { x: topX + 14 * s, y: topY },
    { x: topX + 42 * s, y: topY + 0.16 * H },
    { x: topX + 78 * s, y: topY + 0.32 * H },
    { x: topX + 104 * s, y: topY + 0.48 * H },
    { x: topX + 130 * s, y: topY + 0.64 * H },
    { x: topX + 154 * s, y: topY + 0.80 * H },
    { x: topX + 172 * s, y: baseY - 2 * s },
  ];

  // 8. Cabang Lereng Kanan Tengah (Bercabang dari aliran kanan utama di tengah lereng ke arah kanan bawah)
  const rightMidBranchPoints: Point2D[] = [
    { x: topX + 78 * s, y: topY + 0.32 * H },
    { x: topX + 114 * s, y: topY + 0.46 * H },
    { x: topX + 152 * s, y: topY + 0.62 * H },
    { x: topX + 182 * s, y: topY + 0.78 * H },
    { x: topX + 205 * s, y: baseY - 2 * s },
  ];

  // 9. Cabang Lereng Kanan Bawah (Bercabang di dekat kaki lereng kanan)
  const rightLowerBranchPoints: Point2D[] = [
    { x: topX + 130 * s, y: topY + 0.64 * H },
    { x: topX + 155 * s, y: topY + 0.78 * H },
    { x: topX + 174 * s, y: baseY - 2 * s },
  ];

  // 10. Aliran Bahu Terluar Lereng Kanan (Far-Right Ridge) - Mulai tepat dari bibir kawah kanan atas menyusuri siluet terluar hingga dasar
  const farRightRidgePoints: Point2D[] = [
    { x: topX + 22 * s, y: topY + 3 * s },
    { x: topX + 45 * s, y: topY + 0.08 * H },
    { x: topX + 78 * s, y: topY + 0.18 * H },
    { x: topX + 180 * s, y: topY + 0.48 * H },
    { x: topX + 245 * s, y: topY + 0.66 * H },
    { x: topX + 318 * s, y: topY + 0.84 * H },
    { x: topX + 385 * s, y: baseY - 2 * s },
  ];

  const isEffusive = scenario === 'effusive';

  // Perhitungan progresi bertahap dari puncak ke bawah secara mulus dan mengalir
  const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
  const pLeftFlank = clamp01(progress / 0.95);
  const pTrunk = clamp01(progress / 0.15);
  const pCenterLeft = clamp01((progress - 0.08) / 0.92);
  const pCenterRight = clamp01((progress - 0.08) / 0.92);
  const pRightFlank = clamp01(progress / 0.95);

  // Progresi khusus cabang lava tambahan (HANYA AKTIF DI SKENARIO EFUSIF)
  const pFarLeftRidge = clamp01(progress / 0.95);
  const pLeftMidBranch = clamp01((progress - 0.08) / 0.92);
  const pRightMidBranch = clamp01((progress - 0.08) / 0.92);
  const pRightLowerBranch = clamp01((progress - 0.16) / 0.84);
  const pFarRightRidge = clamp01(progress / 0.95);

  // Aliran lava standar (Skenario Eksplosif: 3 jalur utama klasik)
  const baseStreamConfigs: { pts: Point2D[]; prog: number; w: number }[] = [
    { pts: leftFlankPoints, prog: pLeftFlank, w: Math.max(5.5, 9.5 * s) },
    { pts: trunkPoints, prog: pTrunk, w: Math.max(6, 11 * s) },
    { pts: centerLeftPoints, prog: pCenterLeft, w: Math.max(5, 8.5 * s) },
    { pts: centerRightPoints, prog: pCenterRight, w: Math.max(5, 8.5 * s) },
    { pts: rightFlankPoints, prog: pRightFlank, w: Math.max(5.5, 9.5 * s) },
  ];

  // Tambahan aliran lava melimpah (KHUSUS SKENARIO EFUSIF: Sesuai sketsa garis merah pengguna)
  const effusiveExtraConfigs: { pts: Point2D[]; prog: number; w: number }[] = [
    { pts: farLeftRidgePoints, prog: pFarLeftRidge, w: Math.max(5, 8.5 * s) },
    { pts: leftMidBranchPoints, prog: pLeftMidBranch, w: Math.max(4.5, 7.5 * s) },
    { pts: rightMidBranchPoints, prog: pRightMidBranch, w: Math.max(4.5, 7.5 * s) },
    { pts: rightLowerBranchPoints, prog: pRightLowerBranch, w: Math.max(3.8, 6.2 * s) },
    { pts: farRightRidgePoints, prog: pFarRightRidge, w: Math.max(5, 8.5 * s) },
  ];

  const streamConfigs = isEffusive
    ? [...baseStreamConfigs, ...effusiveExtraConfigs]
    : baseStreamConfigs;

  const activeStreams: ActiveLavaStream[] = [];
  for (const cfg of streamConfigs) {
    const act = getActiveLavaStream(cfg.pts, cfg.prog, cfg.w);
    if (act) activeStreams.push(act);
  }

  if (activeStreams.length === 0) return;

  // ─────────────────────────────────────────────────────────────────────────
  // UNIFIED RENDERING MULTI-PASS:
  // Semua cabang digambar dalam lintasan bersama tanpa garis tepi/stroke luar kaku (no border)
  // sehingga tekstur di titik persimpangan dan lelehan menyatu secara seamless & cair.
  // ─────────────────────────────────────────────────────────────────────────

  // PASS 1: Dasar Lelehan Magma Merah Menyala + Thermal Bloom Soft Glow
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowColor = isPostEruption ? 'rgba(234, 88, 12, 0.65)' : 'rgba(249, 115, 22, 0.85)';
  ctx.shadowBlur = Math.max(6, 11 * s);
  ctx.strokeStyle = isPostEruption ? '#dc2626' : '#ef4444';

  for (const st of activeStreams) {
    ctx.lineWidth = st.width;
    ctx.beginPath();
    ctx.moveTo(st.activePts[0].x, st.activePts[0].y);
    for (let i = 1; i < st.activePts.length; i++) {
      ctx.lineTo(st.activePts[i].x, st.activePts[i].y);
    }
    ctx.stroke();
  }
  ctx.restore();

  // PASS 2: Aliran Inti Panas Oranye Menyala
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = isPostEruption ? '#ea580c' : '#f97316';

  for (const st of activeStreams) {
    ctx.lineWidth = Math.max(2.4, st.width * 0.58);
    ctx.beginPath();
    ctx.moveTo(st.activePts[0].x, st.activePts[0].y);
    for (let i = 1; i < st.activePts.length; i++) {
      ctx.lineTo(st.activePts[i].x, st.activePts[i].y);
    }
    ctx.stroke();
  }
  ctx.restore();

  // PASS 3: Inti Pijar Emas/Kuning Terang
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const pulse = Math.sin(animTick * 0.15) * 0.5 + 0.5;
  ctx.strokeStyle = isPostEruption
    ? (pulse > 0.5 ? '#f59e0b' : '#ea580c')
    : (pulse > 0.4 ? '#fef08a' : '#fffbeb');

  for (const st of activeStreams) {
    ctx.lineWidth = Math.max(1.3, st.width * 0.26);
    ctx.beginPath();
    ctx.moveTo(st.activePts[0].x, st.activePts[0].y);
    for (let i = 1; i < st.activePts.length; i++) {
      ctx.lineTo(st.activePts[i].x, st.activePts[i].y);
    }
    ctx.stroke();
  }
  ctx.restore();

  // PASS 4: Kilau Aliran Viskositas Mengalir (Shimmer Wave Tanpa Border)
  if (!isPostEruption) {
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.setLineDash([7 * s, 14 * s]);
    ctx.lineDashOffset = -animTick * 0.5;

    for (const st of activeStreams) {
      ctx.lineWidth = Math.max(1.0, st.width * 0.16);
      ctx.beginPath();
      ctx.moveTo(st.activePts[0].x, st.activePts[0].y);
      for (let i = 1; i < st.activePts.length; i++) {
        ctx.lineTo(st.activePts[i].x, st.activePts[i].y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  // PASS 5: Kepala Tetesan Magma Bulat Lembut di Ujung Terdepan (Tanpa Border Gelap)
  for (const st of activeStreams) {
    if (st.progress < 0.99) {
      const headPt = st.headPt;
      const headR = st.width * 0.85;
      const blobGrad = ctx.createRadialGradient(
        headPt.x,
        headPt.y,
        1,
        headPt.x,
        headPt.y,
        headR * 1.5
      );
      blobGrad.addColorStop(0, '#ffffff');
      blobGrad.addColorStop(0.3, '#fef08a');
      blobGrad.addColorStop(0.65, '#f97316');
      blobGrad.addColorStop(0.88, '#ef4444');
      blobGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');

      ctx.fillStyle = blobGrad;
      ctx.beginPath();
      ctx.arc(headPt.x, headPt.y, headR * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Percikan bara pijar halus melayang dari ujung lava
      if (!isPostEruption) {
        for (let sp = 0; sp < 2; sp++) {
          const spAng = animTick * 0.18 + sp * 3.14;
          const spDist = headR * (1.1 + Math.sin(animTick * 0.25 + sp) * 0.3);
          ctx.fillStyle = sp % 2 === 0 ? '#fde047' : '#f97316';
          ctx.fillRect(
            headPt.x + Math.cos(spAng) * spDist,
            headPt.y + Math.sin(spAng) * spDist,
            2,
            2
          );
        }
      }
    }
  }

  // PASS 6: Kolam Genangan Magma di Dasar Saat Mencapai Kaki Gunung
  if (pLeftFlank >= 0.88) {
    const scale = (pLeftFlank - 0.88) / 0.12;
    drawLavaDeltaPool(ctx, topX - 188 * s, baseY, 50 * s * scale, 13 * s * scale, isPostEruption, animTick);
  }
  if (pCenterLeft >= 0.88 || pCenterRight >= 0.88) {
    const scale = Math.max((pCenterLeft - 0.88) / 0.12, (pCenterRight - 0.88) / 0.12);
    drawLavaDeltaPool(ctx, topX - 6 * s, baseY, 85 * s * scale, 18 * s * scale, isPostEruption, animTick);
  }
  if (pRightFlank >= 0.88) {
    const scale = (pRightFlank - 0.88) / 0.12;
    drawLavaDeltaPool(ctx, topX + 172 * s, baseY, 50 * s * scale, 13 * s * scale, isPostEruption, animTick);
  }

  // Genangan delta tambahan khusus skenario efusif
  if (isEffusive) {
    if (pFarLeftRidge >= 0.88) {
      const scale = (pFarLeftRidge - 0.88) / 0.12;
      drawLavaDeltaPool(ctx, topX - 365 * s, baseY, 65 * s * scale, 15 * s * scale, isPostEruption, animTick);
    }
    if (pLeftMidBranch >= 0.88) {
      const scale = (pLeftMidBranch - 0.88) / 0.12;
      drawLavaDeltaPool(ctx, topX - 198 * s, baseY, 45 * s * scale, 12 * s * scale, isPostEruption, animTick);
    }
    if (pRightMidBranch >= 0.88) {
      const scale = (pRightMidBranch - 0.88) / 0.12;
      drawLavaDeltaPool(ctx, topX + 205 * s, baseY, 50 * s * scale, 13 * s * scale, isPostEruption, animTick);
    }
    if (pFarRightRidge >= 0.88) {
      const scale = (pFarRightRidge - 0.88) / 0.12;
      drawLavaDeltaPool(ctx, topX + 385 * s, baseY, 65 * s * scale, 15 * s * scale, isPostEruption, animTick);
    }
  }
}

// E. KAWANAN BURUNG TERBANG ANGGUN MENJAUHI PUNCAK (TANDA ALAM STATUS SIAGA)
export function drawFleeingBirdFlock(
  ctx: CanvasRenderingContext2D,
  birds: BirdParticleL2[]
): void {
  ctx.save();

  for (const b of birds) {
    ctx.save();
    ctx.translate(b.x, b.y);
    // Burung menghadap arah lajunya (kiri / kanan)
    if (b.facing === 'left' || b.vx < 0) {
      ctx.scale(-1, 1);
    }

    const wingY = Math.sin(b.wingAngle) * (b.size * 1.15);

    // Sayap Burung: Dua Kurva Aerodinamis Anggun (Bodi Halus & Kecil)
    ctx.strokeStyle = '#020617';
    ctx.lineWidth = 1.8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Sayap Kiri (Belakang)
    ctx.beginPath();
    ctx.moveTo(-b.size * 1.35, -wingY);
    ctx.quadraticCurveTo(-b.size * 0.65, -wingY * 0.3 - 1.5, 0, 0);
    ctx.stroke();

    // Sayap Kanan (Depan)
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(b.size * 0.65, -wingY * 0.3 - 1.5, b.size * 1.35, -wingY);
    ctx.stroke();

    // Highlight tipis warna perak/putih di tepi sayap
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(-b.size * 1.3, -wingY - 0.4);
    ctx.quadraticCurveTo(-b.size * 0.65, -wingY * 0.3 - 2, 0, -0.4);
    ctx.quadraticCurveTo(b.size * 0.65, -wingY * 0.3 - 2, b.size * 1.3, -wingY - 0.4);
    ctx.stroke();

    // Tubuh Burung Kecil & Ramping (Sleek aerodynamic body)
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(0, 0, b.size * 0.55, b.size * 0.3, 0.12, 0, Math.PI * 2);
    ctx.fill();

    // Ekor Burung di Belakang
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.moveTo(-b.size * 0.35, 0);
    ctx.lineTo(-b.size * 1.0, -1.0);
    ctx.lineTo(-b.size * 0.3, 1.0);
    ctx.closePath();
    ctx.fill();

    // Paruh Ramping Emas Menghadap Depan
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(b.size * 0.45, -0.4);
    ctx.lineTo(b.size * 0.9, 0.4);
    ctx.lineTo(b.size * 0.4, 1.2);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
  ctx.restore();
}

// F. HUJAN ABU VULKANIK MELAYANG TURUN
export function drawAshFallOverlay(
  ctx: CanvasRenderingContext2D,
  particles: AshFallParticleL2[]
): void {
  ctx.save();
  for (const p of particles) {
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.opacity;
    ctx.fillRect(p.x, p.y, p.size, p.size);
  }
  ctx.restore();
}

// G. PERBUKITAN PINUS DENGAN DAUN MENGUNING (LAYU)
export function drawVolcanoSimulationHills(
  ctx: CanvasRenderingContext2D,
  camX: number,
  viewW: number,
  wither: number,
  _animTick: number
): void {
  const paraMid = camX * 0.22;
  const hillGrad = ctx.createLinearGradient(0, 200, 0, 360);
  if (wither < 0.35) {
    hillGrad.addColorStop(0, '#166534');
    hillGrad.addColorStop(1, '#14532d');
  } else if (wither < 0.75) {
    hillGrad.addColorStop(0, '#854d0e');
    hillGrad.addColorStop(1, '#713f12');
  } else {
    hillGrad.addColorStop(0, '#44403c');
    hillGrad.addColorStop(1, '#292524');
  }
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

  // Rumpun Pohon Pinus Lereng
  const SIM_PINE_CLUSTERS = [
    { x: 110, h: 36 },
    { x: 140, h: 28 },
    { x: 310, h: 34 },
    { x: 338, h: 42 },
    { x: 720, h: 38 },
    { x: 750, h: 26 },
    { x: 920, h: 40 },
    { x: 950, h: 30 },
    { x: 1220, h: 36 },
    { x: 1250, h: 42 },
    { x: 1640, h: 38 },
    { x: 1670, h: 28 },
    { x: 2030, h: 36 },
    { x: 2060, h: 42 },
  ];

  for (const tree of SIM_PINE_CLUSTERS) {
    const realX = tree.x;
    if (realX + 50 < camX || realX - 50 > camX + viewW) continue;
    const hillY = 230 + Math.sin((realX + paraMid) * 0.007) * 22;
    const tH = tree.h;
    const tW = tH * 0.42;

    // Batang Kayu
    ctx.fillStyle = '#451a03';
    ctx.fillRect(realX - 1.5, hillY - 8, 3, 10);

    // Daun Bertingkat (Hijau Segar -> Menguning Layu -> Kering Cokelat)
    let c1 = '#14532d';
    let c2 = '#16a34a';
    let c3 = '#22c55e';
    if (wither > 0.6) {
      c1 = '#713f12';
      c2 = '#a16207';
      c3 = '#ca8a04';
    } else if (wither > 0.3) {
      c1 = '#854d0e';
      c2 = '#ca8a04';
      c3 = '#eab308';
    }

    // Tier 1
    ctx.fillStyle = c1;
    ctx.beginPath();
    ctx.moveTo(realX, hillY - tH * 0.6);
    ctx.lineTo(realX + tW, hillY - 6);
    ctx.lineTo(realX - tW, hillY - 6);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = c2;
    ctx.beginPath();
    ctx.moveTo(realX, hillY - tH * 0.6);
    ctx.lineTo(realX, hillY - 6);
    ctx.lineTo(realX - tW, hillY - 6);
    ctx.closePath();
    ctx.fill();

    // Tier 2
    ctx.fillStyle = c2;
    ctx.beginPath();
    ctx.moveTo(realX, hillY - tH * 0.85);
    ctx.lineTo(realX + tW * 0.8, hillY - tH * 0.45);
    ctx.lineTo(realX - tW * 0.8, hillY - tH * 0.45);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = c3;
    ctx.beginPath();
    ctx.moveTo(realX, hillY - tH * 0.85);
    ctx.lineTo(realX, hillY - tH * 0.45);
    ctx.lineTo(realX - tW * 0.8, hillY - tH * 0.45);
    ctx.closePath();
    ctx.fill();

    // Tier Pucuk
    ctx.fillStyle = c1;
    ctx.beginPath();
    ctx.moveTo(realX, hillY - tH);
    ctx.lineTo(realX + tW * 0.55, hillY - tH * 0.72);
    ctx.lineTo(realX - tW * 0.55, hillY - tH * 0.72);
    ctx.closePath();
    ctx.fill();
  }
}
