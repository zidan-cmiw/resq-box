/**
 * Objek dan Dekorasi — bagian dari mesin gambar Earth Dive.
 *
 * Berkas ini dipecah dari sprites.ts (5.625 baris) agar tiap kelompok dapat
 * dicari tanpa menggulir melewati ribuan baris kode kelompok lain. Isi
 * fungsinya dipindahkan UTUH, tidak ditulis ulang.
 */

import { TILE } from './konstanta';

export function drawZoneDecorations(ctx: CanvasRenderingContext2D, zoneId: string, frame: number): void {
  if (zoneId === 'mantle') {
    // 1. Tetesan cairan pijar sesekali jatuh dari ujung stalaktit di langit-langit gua
    const stalactiteTips = [
      { x: 260, y: 103 },
      { x: 440, y: 77 },
      { x: 810, y: 116 },
      { x: 990, y: 101 },
    ];
    for (let i = 0; i < stalactiteTips.length; i++) {
      const tip = stalactiteTips[i];
      const dripCycle = ((frame * 0.35 + i * 28) % 90) / 90;
      if (dripCycle < 0.85) {
        const fallDist = dripCycle * (390 - tip.y);
        const dropY = tip.y + fallDist;
        ctx.fillStyle = dripCycle > 0.65 ? '#f97316' : '#fef08a';
        ctx.fillRect(tip.x - 1, dropY, 2, 4);

        // Kilau pijar di ujung stalaktit saat menetes
        ctx.fillStyle = 'rgba(254, 240, 138, 0.7)';
        ctx.fillRect(tip.x - 2, tip.y - 1, 4, 3);
      }
    }

    // 2. Gelembung letupan halus cairan magma kental di dasar jurang
    const lavaChasms = [380, 480, 580, 830, 930, 1020];
    for (const lx of lavaChasms) {
      for (let b = 0; b < 4; b++) {
        const prog = ((frame * 0.6 + b * 22) % 36) / 36;
        const bx = lx - 45 + ((b * 30 + frame * 0.25) % 90);
        const by = 398 - prog * 14;
        ctx.fillStyle = `rgba(254, 240, 138, ${1 - prog})`;
        ctx.fillRect(bx, by, 2, 2);
        ctx.fillStyle = `rgba(249, 115, 22, ${(1 - prog) * 0.6})`;
        ctx.fillRect(bx - 1, by + 1, 4, 1);
      }
    }

    // 3. Partikel bara api panas bumi / gelombang distorsi mengambang ke atas
    for (let ep = 0; ep < 12; ep++) {
      const eprog = ((frame * 0.35 + ep * 35) % 180) / 180;
      const ex = (ep * 105 + Math.sin(frame * 0.03 + ep) * 30 + 50) % 1280;
      const ey = 420 - eprog * 320;
      const alpha = Math.sin(eprog * Math.PI) * 0.55;
      ctx.fillStyle = `rgba(251, 146, 60, ${alpha})`;
      ctx.fillRect(ex, ey, 2, 2);
    }
  } else if (zoneId === 'outerCore') {
    // 1. Busur Kilatan Listrik Statis & Badai Elektromagnetik Dinamo (Biru-Putih)
    const arcPoints = [
      { x: 260, y: 345 },
      { x: 480, y: 345 },
      { x: 700, y: 345 },
      { x: 880, y: 345 },
      { x: 1080, y: 345 },
    ];
    for (let i = 0; i < arcPoints.length; i++) {
      const pt = arcPoints[i];
      const strikeInterval = (frame + i * 17) % 24;
      if (strikeInterval < 4) {
        ctx.strokeStyle = strikeInterval % 2 === 0 ? '#ffffff' : '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(pt.x - 18, pt.y + 4);
        ctx.lineTo(pt.x - 6, pt.y - 12);
        ctx.lineTo(pt.x + 4, pt.y + 2);
        ctx.lineTo(pt.x + 16, pt.y - 14);
        ctx.stroke();

        // Pijar elektrik
        ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.fillRect(pt.x - 8, pt.y - 8, 16, 12);
      }
    }

    // 2. Percikan Plasma Logam Cair & Partikel Listrik Membumbung ke Atas
    for (let p = 0; p < 14; p++) {
      const pProg = ((frame * 0.4 + p * 25) % 150) / 150;
      const px = (p * 95 + Math.sin(frame * 0.05 + p) * 20 + 30) % 1280;
      const py = 410 - pProg * 280;
      const pAlpha = Math.sin(pProg * Math.PI) * 0.75;
      ctx.fillStyle = p % 3 === 0 ? `rgba(255, 255, 255, ${pAlpha})` : p % 2 === 0 ? `rgba(254, 240, 138, ${pAlpha})` : `rgba(56, 189, 248, ${pAlpha})`;
      ctx.fillRect(px, py, 2, 2);
    }
  } else if (zoneId === 'innerCore') {
    // ── EFEK PARTIKEL INTI DALAM (KONDISI AGAK GELAP: BARA MAGMA & DISTORSI PANAS) ──
    // 1. Partikel bara api magma & debu panas bumi naik perlahan dari jurang magma
    for (let p = 0; p < 16; p++) {
      const pProg = ((frame * 0.25 + p * 20) % 180) / 180;
      const px = (p * 85 + Math.sin(frame * 0.02 + p) * 16 + 20) % 1280;
      const py = 420 - pProg * 340;
      const pAlpha = Math.sin(pProg * Math.PI) * 0.8;

      ctx.fillStyle = p % 3 === 0 ? `rgba(254, 240, 138, ${pAlpha})` : p % 2 === 0 ? `rgba(249, 115, 22, ${pAlpha})` : `rgba(234, 88, 12, ${pAlpha * 0.8})`;
      ctx.fillRect(px, py, 2, 2);
      if (p % 4 === 0) {
        ctx.fillStyle = `rgba(255, 255, 255, ${pAlpha * 0.5})`;
        ctx.fillRect(px - 1, py, 4, 1);
        ctx.fillRect(px, py - 1, 1, 4);
      }
    }

    // 2. Gelombang distorsi panas konstan tipis (Heat Shimmer 6.000°C)
    for (let wOff = 0; wOff < 8; wOff++) {
      const waveProg = ((frame * 0.3 + wOff * 30) % 120) / 120;
      const wx = (wOff * 160 + Math.sin(frame * 0.04 + wOff) * 25) % 1280;
      const wy = 380 - waveProg * 240;
      const wAlpha = Math.sin(waveProg * Math.PI) * 0.12;
      ctx.fillStyle = `rgba(254, 240, 138, ${wAlpha})`;
      ctx.fillRect(wx - 20, wy, 40, 2);
    }

    // 3. Kilau bintang halus pada faset kristal (Crystal Facet Twinkle di jembatan & teras)
    const sparklePoints = [
      { x: 280, y: 308 },
      { x: 480, y: 308 },
      { x: 680, y: 308 },
      { x: 880, y: 308 },
      { x: 1060, y: 328 },
      { x: 1200, y: 328 },
    ];
    for (let i = 0; i < sparklePoints.length; i++) {
      const sp = sparklePoints[i];
      const sparkCycle = (frame + i * 19) % 36;
      if (sparkCycle < 6) {
        ctx.fillStyle = sparkCycle % 2 === 0 ? '#ffffff' : '#fef08a';
        ctx.fillRect(sp.x - 2, sp.y, 5, 1);
        ctx.fillRect(sp.x, sp.y - 2, 1, 5);
      }
    }
  } else if (zoneId === 'divergent') {
    // ── EFEK DINAMIS BATAS DIVERGEN: GELEMBUNG UDARA LAUTAN MELAYANG ──
    for (let p = 0; p < 24; p++) {
      const pProg = ((frame * 0.4 + p * 28) % 240) / 240;
      const px = (p * 85 + Math.sin(frame * 0.04 + p) * 14 + 20) % 1500;
      const py = 360 - pProg * 260;
      const pAlpha = Math.sin(pProg * Math.PI) * 0.45;
      ctx.fillStyle = p % 2 === 0 ? `rgba(224, 242, 254, ${pAlpha})` : `rgba(56, 189, 248, ${pAlpha * 0.8})`;
      const bRad = (p % 4 === 0) ? 2.5 : 1.5;
      ctx.beginPath();
      ctx.arc(px, py, bRad, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// ══════════════════════════════════════════════════════════════════════════
// 5. INTERACTABLE OBJECTS (PORTALS, CRYSTALS, SIGNS, GATES)
// ══════════════════════════════════════════════════════════════════════════

export function drawPortal(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  isDown: boolean,
  frame: number,
  labelText?: string,
): void {
  const s = TILE;
  const pulse = Math.sin(frame * 0.1) * 0.25 + 0.75;

  if (isDown) {
    // ── KEPALA SUMUR BOR GEOTERMAL DALAM / KAPSUL AKHIR ──
    // Kaki bantalan baja masif menancap kokoh ke batuan/tanah di y + 26 -> y + 36
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - 6, y + 26, s + 12, 10);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x - 4, y + 24, s + 8, 4);

    // Collar silinder luar kepala bor (Outer wellhead collar)
    ctx.fillStyle = labelText ? '#065f46' : '#334155';
    ctx.fillRect(x - 2, y + 14, s + 4, 12);
    ctx.fillStyle = labelText ? '#059669' : '#475569';
    ctx.fillRect(x - 1, y + 12, s + 2, 4);

    // Flens baut industri melingkar
    ctx.fillStyle = labelText ? '#34d399' : '#64748b';
    for (let bx = x; bx <= x + s - 4; bx += 7) {
      ctx.fillRect(bx, y + 13, 3, 3);
    }

    // Pola garis peringatan keselamatan (Industrial safety hazard stripes)
    for (let i = 0; i < s + 4; i += 8) {
      ctx.fillStyle = labelText ? '#10b981' : '#facc15';
      ctx.fillRect(x - 2 + i, y + 22, 4, 4);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x + 2 + i, y + 22, 4, 4);
    }

    // Bukaan poros bor dalam dengan gradien kedalaman tektonik
    const shaftGrad = ctx.createLinearGradient(0, y + 8, 0, y + 32);
    if (labelText) {
      shaftGrad.addColorStop(0, '#059669');
      shaftGrad.addColorStop(0.5, '#047857');
      shaftGrad.addColorStop(1, '#064e3b');
    } else {
      shaftGrad.addColorStop(0, '#0284c7');
      shaftGrad.addColorStop(0.4, '#1e1b4b');
      shaftGrad.addColorStop(1, '#020617');
    }
    ctx.fillStyle = shaftGrad;
    ctx.fillRect(x + 4, y + 8, s - 8, 20);

    // Uap panas geotermal membubung dari sumur bor
    for (let v = 0; v < 3; v++) {
      const vProg = ((frame * 0.6 + v * 20) % 36) / 36;
      const vx = x + 10 + Math.sin(frame * 0.1 + v) * 5 + v * 4;
      const vy = y + 16 - vProg * 22;
      const vr = 2 + vProg * 4;
      ctx.fillStyle = labelText
        ? `rgba(167, 243, 208, ${(1 - vProg) * 0.6})`
        : `rgba(224, 242, 254, ${(1 - vProg) * 0.5})`;
      ctx.beginPath();
      ctx.arc(vx, vy, vr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Gigi roller pembimbing poros bor
    ctx.fillStyle = labelText ? '#6ee7b7' : '#94a3b8';
    ctx.fillRect(x + 2, y + 14, 3, 8);
    ctx.fillRect(x + s - 5, y + 14, 3, 8);

    // Banner hologram penanda kedalaman atau kapsul akhir (Gaya Konsisten Level 2)
    const bob = Math.sin(frame * 0.08) * 2;
    if (labelText) {
      // Vertical extraction beacon beam shooting upward into crystal cathedral
      const beamGrad = ctx.createLinearGradient(0, y + 8, 0, y - 65);
      beamGrad.addColorStop(0, 'rgba(52, 211, 153, 0.6)');
      beamGrad.addColorStop(0.5, 'rgba(251, 191, 36, 0.35)');
      beamGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = beamGrad;
      ctx.fillRect(x + 5, y - 65, s - 10, 73);

      ctx.save();
      ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
      const textW = ctx.measureText(labelText).width;
      const bannerW = Math.max(s + 36, Math.round(textW + 20));
      const bx = Math.round(x + s / 2 - bannerW / 2);
      const bannerY = Math.round(y - 38 + bob);
      const bannerH = 18;

      const isFinalCapsule = labelText.includes('KAPSUL');
      const bannerBorder = isFinalCapsule ? '#22c55e' : '#38bdf8';
      const bannerTextCol = isFinalCapsule ? '#86efac' : '#bae6fd';

      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(bx, bannerY, bannerW, bannerH, 4);
      } else {
        ctx.rect(bx, bannerY, bannerW, bannerH);
      }
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.fill();
      ctx.strokeStyle = bannerBorder;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = bannerTextCol;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(labelText, x + s / 2, bannerY + bannerH / 2);
      ctx.restore();
    } else {
      ctx.save();
      ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
      const text = '▼ TURUN KE LAPISAN SELANJUTNYA ▼';
      const textW = ctx.measureText(text).width;
      const bannerW = Math.max(s + 36, Math.round(textW + 20));
      const bx = Math.round(x + s / 2 - bannerW / 2);
      const bannerY = Math.round(y - 38 + bob);
      const bannerH = 18;

      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(bx, bannerY, bannerW, bannerH, 4);
      } else {
        ctx.rect(bx, bannerY, bannerW, bannerH);
      }
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.fill();
      ctx.strokeStyle = '#818cf8';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#c7d2fe';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, x + s / 2, bannerY + bannerH / 2);
      ctx.restore();
    }

  } else {
    // ── HOIST NAIK KE LAPISAN SEBELUMNYA ──
    // Kaki jangkar baja tebal di lantai batuan
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - 2, y + 30, 10, 4);
    ctx.fillRect(x + s - 8, y + 30, 10, 4);

    // Tiang rel panduan vertikal dengan sangkar baja kuning
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x + 2, y - 4, 4, 36);
    ctx.fillRect(x + s - 6, y - 4, 4, 36);

    // Rangka sangkar keselamatan bergaris kuning
    ctx.fillStyle = '#eab308';
    ctx.fillRect(x + 5, y - 4, 2, 36);
    ctx.fillRect(x + s - 7, y - 4, 2, 36);

    // Kisi tangga / kabel traksi lift
    ctx.fillStyle = '#64748b';
    for (let r = y; r < y + 30; r += 6) {
      ctx.fillRect(x + 6, r, s - 12, 2);
    }

    // Sinar energi traksi vertikal
    ctx.fillStyle = 'rgba(14, 165, 233, 0.25)';
    ctx.globalAlpha = pulse;
    ctx.fillRect(x + 6, y, s - 12, 32);
    ctx.globalAlpha = 1;

    // Banner hologram ke atas (Gaya Konsisten Level 2)
    const bob = Math.sin(frame * 0.08) * 2;
    const text = labelText || '▲ NAIK KE LAPISAN SEBELUMNYA ▲';
    ctx.save();
    ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
    const textW = ctx.measureText(text).width;
    const bannerW = Math.max(s + 36, Math.round(textW + 20));
    const bx = Math.round(x + s / 2 - bannerW / 2);
    const bannerY = Math.round(y - 38 + bob);
    const bannerH = 18;

    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(bx, bannerY, bannerW, bannerH, 4);
    } else {
      ctx.rect(bx, bannerY, bannerW, bannerH);
    }
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#bae6fd';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + s / 2, bannerY + bannerH / 2);
    ctx.restore();
  }
}

export function drawCrystal(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number): void {
  // Shard kristal geologis melayang anggun di atas formasi kristal kecil
  const bounce = Math.sin(frame * 0.08) * 3;
  const yy = y + bounce;

  // Kristal dasar menancap di tanah pada y + 20 -> y + 26
  ctx.fillStyle = '#0891b2';
  ctx.fillRect(x + 10, y + 20, 3, 6);
  ctx.fillRect(x + 15, y + 18, 4, 8);
  ctx.fillRect(x + 21, y + 21, 3, 5);

  // Kristal utama terapung
  ctx.fillStyle = '#06b6d4';
  ctx.fillRect(x + 12, yy + 2, 8, 4);
  ctx.fillRect(x + 10, yy + 6, 12, 8);
  ctx.fillRect(x + 12, yy + 14, 8, 4);
  ctx.fillStyle = '#67e8f9';
  ctx.fillRect(x + 14, yy + 8, 4, 4);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 14, yy + 4, 2, 2);
}

export function drawDiscoveryPoint(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number): void {
  const pulse = Math.sin(frame * 0.06) * 0.2 + 0.8;

  // Kaki tripod instrumen survei geologis menancap di tanah menembus kemiringan lereng
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x + 4, y + 28, 6, 6); // Bantalan kaki kiri
  ctx.fillRect(x + 22, y + 28, 6, 6); // Bantalan kaki kanan
  ctx.fillRect(x + 5, y + 28, 22, 3); // Palang penyangga dasar

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x + 6, y + 16, 3, 14);
  ctx.fillRect(x + 23, y + 16, 3, 14);
  ctx.fillStyle = '#475569';
  ctx.fillRect(x + 14, y + 14, 4, 16); // Tiang teleskopik tengah

  // Pod sensor / holo-display geologis
  ctx.globalAlpha = pulse;
  ctx.fillStyle = '#facc15';
  ctx.fillRect(x + 8, y + 2, 16, 14);
  ctx.fillStyle = '#ca8a04';
  ctx.fillRect(x + 10, y + 4, 12, 10);
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(x + 12, y + 6, 8, 6);

  // Ikon geologi / mineral di layar
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 14, y + 7, 4, 2);
  ctx.fillRect(x + 15, y + 9, 2, 2);
  ctx.globalAlpha = 1;
}

export function drawInfoSign(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  // Papan informasi geologis dengan dudukan plat baja rapi yang berhenti tepat di level permukaan (y + 32)
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x + 7, y + 29, 18, 3); // Plat besi dasar tepat rata di lantai

  // Tiang kayu kokoh menopang papan dari y + 14 hingga y + 29
  ctx.fillStyle = '#451a03';
  ctx.fillRect(x + 13, y + 14, 6, 15);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x + 14, y + 14, 3, 15);

  // Papan kayu dengan bingkai kayu gelap & kertas perkamen
  ctx.fillStyle = '#271002';
  ctx.fillRect(x + 3, y + 1, 26, 16);
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(x + 5, y + 3, 22, 12);

  // Huruf "i" biru geologis yang tegas
  ctx.fillStyle = '#1d4ed8';
  ctx.fillRect(x + 14, y + 5, 4, 2); // Titik i
  ctx.fillRect(x + 14, y + 8, 4, 5); // Garis i
}

export function drawChallengeGate(ctx: CanvasRenderingContext2D, x: number, y: number, locked: boolean, frame: number): void {
  const s = TILE;

  // ── LENGKUNGAN GERBANG SEISMIK HIDROLIK (CURVED INDUSTRIAL SEISMIC VAULT ARCH) ──
  // Bantalan pondasi baja kiri & kanan tertanam kuat ke dalam tanah (y + 28 -> y + 36)
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x - 5, y + 28, 12, 8);
  ctx.fillRect(x + s - 7, y + 28, 12, 8);

  // Kolom vertikal paduan titanium seismik
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x - 4, y + 4, 9, 26);
  ctx.fillRect(x + s - 5, y + 4, 9, 26);

  // Silinder hidrolik peredam gempa pada kolom
  ctx.fillStyle = '#64748b';
  ctx.fillRect(x - 2, y + 8, 5, 18);
  ctx.fillRect(x + s - 3, y + 8, 5, 18);

  // Garis keselamatan industri hitam & kuning pada pilar
  for (let sy = y + 10; sy < y + 26; sy += 6) {
    ctx.fillStyle = '#facc15';
    ctx.fillRect(x - 4, sy, 9, 3);
    ctx.fillRect(x + s - 5, sy, 9, 3);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - 4, sy + 3, 9, 3);
    ctx.fillRect(x + s - 5, sy + 3, 9, 3);
  }

  // Lengkungan atas kubah seismik (Curved Vault Arch Canopy)
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(x + s / 2, y + 8, s / 2 + 5, Math.PI, 0);
  ctx.lineTo(x + s + 5, y + 8);
  ctx.arc(x + s / 2, y + 8, s / 2 - 4, 0, Math.PI, true);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x + s / 2, y + 8, s / 2 + 5, Math.PI, 0);
  ctx.stroke();

  if (locked) {
    // ── STATUS TERKUNCI: MEDAN PENGHALANG LASER MERAH PULSATIF ──
    const pulse = Math.sin(frame * 0.1) * 0.18 + 0.82;

    // Lampu strobo peringatan merah berkedip di puncak kubah
    const strobe = (frame % 30 < 15);
    ctx.fillStyle = strobe ? '#ef4444' : '#7f1d1d';
    ctx.fillRect(x + s / 2 - 3, y - 8, 6, 5);
    if (strobe) {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.beginPath();
      ctx.arc(x + s / 2, y - 6, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Tirai medan energi laser berdenyut
    ctx.globalAlpha = pulse * 0.85;
    const laserGrad = ctx.createLinearGradient(0, y + 8, 0, y + 32);
    laserGrad.addColorStop(0, 'rgba(239, 68, 68, 0.7)');
    laserGrad.addColorStop(0.5, 'rgba(249, 115, 22, 0.5)');
    laserGrad.addColorStop(1, 'rgba(220, 38, 38, 0.8)');
    ctx.fillStyle = laserGrad;
    ctx.fillRect(x + 5, y + 8, s - 10, 22);

    // Garis sinar laser pemindai horizontal yang bergerak turun naik
    const scanY = y + 10 + ((frame * 0.8) % 18);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 5, scanY, s - 10, 2);
    ctx.fillStyle = '#fca5a5';
    ctx.fillRect(x + 5, scanY - 1, s - 10, 4);
    ctx.globalAlpha = 1;

    // Simbol gembok digital seismik melayang di tengah
    ctx.fillStyle = '#facc15';
    ctx.fillRect(x + s / 2 - 4, y + 16, 8, 8);
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(x + s / 2 - 3, y + 12, 6, 5);
    ctx.clearRect(x + s / 2 - 1, y + 14, 2, 2);

  } else {
    // ── STATUS TERBUKA: AKSES LOLOS AMAN (CLEARED APERTURE) ──
    // Lampu clearance hijau di puncak kubah
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(x + s / 2 - 3, y - 8, 6, 5);

    // Medan clearance hijau transparan
    ctx.fillStyle = 'rgba(34, 197, 94, 0.22)';
    ctx.fillRect(x + 5, y + 8, s - 10, 22);

    // Chevron penunjuk jalan tembus
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.moveTo(x + s / 2 - 5, y + 14);
    ctx.lineTo(x + s / 2, y + 19);
    ctx.lineTo(x + s / 2 + 5, y + 14);
    ctx.lineTo(x + s / 2, y + 17);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x + s / 2 - 5, y + 20);
    ctx.lineTo(x + s / 2, y + 25);
    ctx.lineTo(x + s / 2 + 5, y + 20);
    ctx.lineTo(x + s / 2, y + 23);
    ctx.closePath();
    ctx.fill();
  }
}

// ══════════════════════════════════════════════════════════════════════════
// 6. LATAR BELAKANG PARALAKS (TERRARIA-STYLE SKY & MOUNTAIN RANGES)
// ══════════════════════════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════════════════════════
// SPRITE PERAHU RISET GEOLOGI SAMUDRA PIXEL 2D (AREA 7: BATAS KONVERGEN)
// ══════════════════════════════════════════════════════════════════════════
export function drawResearchBoat(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  dir: 'left' | 'right',
  frame: number,
): void {
  ctx.save();
  ctx.imageSmoothingEnabled = false;

  // Gerakan terapung mengapung lembut di permukaan air
  const bob = Math.sin(frame * 0.08) * 1.5;
  const boatY = py + bob;

  // Dimensi perahu: lebar 46px, tinggi 14px
  const boatW = 46;
  const boatH = 13;
  const startX = px - boatW / 2;

  // 1. Buih & Riak Gelombang Haluan di Permukaan Air
  const rippleW = boatW + 10 + Math.sin(frame * 0.1) * 3;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.fillRect(px - rippleW / 2, boatY + 4, rippleW, 2);
  ctx.fillStyle = 'rgba(186, 230, 253, 0.45)';
  ctx.fillRect(px - rippleW / 2 - 3, boatY + 6, rippleW + 6, 2);

  // 2. Lambung Bawah Baja Riset (Deep Navy Steel)
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  if (dir === 'right') {
    ctx.moveTo(startX + 2, boatY + 2);
    ctx.lineTo(startX + boatW - 8, boatY + 2);
    ctx.lineTo(startX + boatW, boatY - 3); // Haluan naik membelah ombak
    ctx.lineTo(startX + boatW - 4, boatY + boatH);
    ctx.lineTo(startX + 6, boatY + boatH);
    ctx.lineTo(startX, boatY + 4);
  } else {
    ctx.moveTo(startX + boatW - 2, boatY + 2);
    ctx.lineTo(startX + 8, boatY + 2);
    ctx.lineTo(startX, boatY - 3); // Haluan kiri
    ctx.lineTo(startX + 4, boatY + boatH);
    ctx.lineTo(startX + boatW - 6, boatY + boatH);
    ctx.lineTo(startX + boatW, boatY + 4);
  }
  ctx.closePath();
  ctx.fill();

  // 3. Garis Aksen Lambung Biru Riset
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(startX + 6, boatY + 3, boatW - 12, 3);

  // 4. Dek & Kabin Riset
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(startX + 12, boatY - 8, 20, 10);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(startX + (dir === 'right' ? 22 : 14), boatY - 6, 8, 5);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(startX + 10, boatY - 10, 24, 2);

  // 5. Antena Radar & Lampu Riset
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(startX + (dir === 'right' ? 14 : 28), boatY - 18, 2, 8);
  const blink = Math.floor(frame / 20) % 2 === 0;
  ctx.fillStyle = blink ? '#ef4444' : '#22c55e';
  ctx.fillRect(startX + (dir === 'right' ? 13 : 27), boatY - 20, 4, 3);

  ctx.restore();
}

// ══════════════════════════════════════════════════════════════════════════
// PROFIL DASAR LAUT TERPADU AREA 7 (BATAS KONVERGEN)
// Menjamin konsistensi elevasi 100% antara lempeng samudra, palung subduksi menunjam,
// dan prisma akresi benua. Dasar palung menunjam ke y = 570 (jauh di bawah 480 px),
// sehingga dasar jurang palung 100% TIDAK TERLIHAT di layar kanvas!
// ══════════════════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════════════════
// PROFIL DASAR LAUT TERPADU AREA 7 (BATAS KONVERGEN: LAUTAN & PALUNG)
// Sesuai Arahan Pengguna & Sketsa:
// 1. Kurva Lempeng Samudra & Dasar Laut 100% MULUS KONTINU (Hermite C1 Continuous)
//    bebas dari sudut patahan tajam.
// 2. Palung Laut berjarak ~200px dari garis pantai (trenchX ≈ 360..385, pantai di coastX = 580).
// 3. Palung mendalam secara dinamis seiring animasi tumbukan lempeng samudra (p: 0 -> 1).
// 4. Lempeng benua di kanan posisinya lebih tinggi dari samudra (elevasi bergelombang alami di pantai).
// ══════════════════════════════════════════════════════════════════════════

// Elevasi permukaan atas lempeng samudra yang menunjam ke bawah lempeng benua (Slab Subduksi Mulus Kontinu & Rigid)
