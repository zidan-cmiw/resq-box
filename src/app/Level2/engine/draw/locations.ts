// ── engine/draw/locations.ts ──────────────────────────────────────────────
// Gambar lokasi tambahan dan lapisan tampilan simulasi gunung:
//   • Fasilitas   : gerbang keluar evakuasi gunung, gapura keluar Pos PGA
//   • Overlay     : papan status gunung, transisi layar gelap, ajakan sirine,
//                   radar warga di luar layar, gelembung warga, dan 4 layar QTE
//                   (kentongan, penyelamatan warga, truk, kegagalan)
//   • Shelter     : tanah pemulihan, gerbang belakang, suasana pascabencana,
//                   urat lava di kejauhan, dan kapsul evakuasi akhir
//
// Dipisahkan dari renderer.ts (Langkah 6 dari pemecahan berkas).
//
// CATATAN PENAMAAN
//   Berkas ini memuat tiga tema yang berurutan di berkas asal. Ketiganya
//   diambil UTUH agar tidak ada panggilan dua arah antar-blok (pelajaran dari
//   Langkah 5). Memecahnya lagi menjadi tiga berkas terpisah dimungkinkan
//   kemudian, tetapi tidak mendesak: yang penting berkas ini tidak lagi
//   bercampur dengan orkestrator.
//
// ATURAN: boleh mengimpor ./base dan ./volcano; tidak boleh mengimpor renderer.

import { drawRoundedBadgeL2, drawRealisticVolcanicSmoke } from './base';
import { MAP_WIDTH_PX, MAP_HEIGHT_PX } from '../zones';
import type { GameStateL2, VolcanoSimulationDataL2 } from '../gameEngine';
import type { Point2D } from './volcano';
import { drawEvacuationRescueTruck } from './merapi';


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
export function drawTopVolcanoStatusBanner(
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
export function drawVolcanoDarkScreenTransition(
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
export function drawVolcanoSirenPromptOverlay(
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
export function drawOffscreenVillagerRadar(
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
export function drawVolcanoQteRescueOverlay(
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
export function drawVolcanoQteTruckOverlay(
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
export function drawVolcanoFailedOverlay(
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
export function drawArea6DistantLavaVeins(
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
