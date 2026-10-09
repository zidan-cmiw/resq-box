import { drawPixelFossil } from './sprites/medan-organik';

export function drawZoneBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  zoneId: string,
  frame: number,
  camX: number = 0,
  convergentMode: 'land' | 'ocean' = 'land',
): void {
  switch (zoneId) {
    case 'surface': {
      // 1. Gradien Langit Tropis Indonesia yang Cerah & Atmosferik
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, '#0284c7');   // Sky blue tropis
      skyGrad.addColorStop(0.38, '#38bdf8'); // Clear azure
      skyGrad.addColorStop(0.72, '#bae6fd');  // Haze lembah vulkanik
      skyGrad.addColorStop(1, '#e0f2fe');    // Horizon kabut hangat
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Matahari tropis dengan halo cahaya atmosferik berlapis
      const sunX = w - 130 - (camX * 0.02) % 60;
      const sunY = 46;
      const sunHalo = ctx.createRadialGradient(sunX, sunY, 6, sunX, sunY, 56);
      sunHalo.addColorStop(0, 'rgba(254, 240, 138, 0.5)');
      sunHalo.addColorStop(0.45, 'rgba(253, 224, 71, 0.18)');
      sunHalo.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = sunHalo;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 56, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(sunX, sunY, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(sunX, sunY, 12, 0, Math.PI * 2);
      ctx.fill();

      // Awan pixel tropis berlapis bergulir alami (Parallax & Wind)
      const c1X = ((frame * 0.18 - camX * 0.04) % (w + 300) + (w + 300)) % (w + 300) - 150;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.fillRect(c1X, 52, 90, 14);
      ctx.fillRect(c1X + 14, 42, 60, 14);
      ctx.fillRect(c1X + 28, 36, 32, 10);
      ctx.fillStyle = 'rgba(224, 242, 254, 0.4)';
      ctx.fillRect(c1X + 8, 62, 74, 4);

      const c2X = ((frame * 0.1 - camX * 0.025 + 460) % (w + 300) + (w + 300)) % (w + 300) - 150;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.78)';
      ctx.fillRect(c2X, 76, 110, 16);
      ctx.fillRect(c2X + 22, 66, 70, 14);
      ctx.fillRect(c2X + 42, 60, 32, 8);

      // 2. SILUET MAJESTIK GUNUNG MERAPI (STRATOVOLCANO CONE, YOGYAKARTA)
      // Karakteristik: Kerucut vulkanik asimetris, kubah lava aktif, alur lahar piroklastik,
      // kepulan asap solfatara putih terus menerus, lereng berhutan tropis lebat (ZERO SNOW).
      const farP = camX * 0.07;
      const farSpan = 1400;
      const fBaseX = -((farP % farSpan + farSpan) % farSpan);

      for (let rep = 0; rep < 2; rep++) {
        const ox = fBaseX + rep * farSpan;
        if (ox > w || ox + farSpan < -300) continue;

        const summitX = ox + 680;
        const summitY = Math.round(h * 0.20); // Puncak kawah Merapi yang tinggi

        // A. Kepulan Asap Solfatara Kawah Aktif Merapi (Billowing Volcanic Steam Plume Organik)
        for (let p = 0; p < 8; p++) {
          const pProg = ((frame * 0.04 + p * 0.125) % 1);
          const px = summitX + 6 + pProg * 45 + Math.sin(frame * 0.035 + p * 1.4) * (5 + pProg * 12);
          const py = summitY - 4 - pProg * 75;
          const pr = 8 + pProg * 24;
          const pAlpha = Math.max(0, (pProg < 0.15 ? pProg / 0.15 : (1 - pProg)) * 0.65);
          if (pAlpha <= 0.02) continue;

          // Multi-lobed organic steam cloud (gumpalan uap vulkanik alami)
          const lobes = 5;
          for (let l = 0; l < lobes; l++) {
            const angle = (l * Math.PI * 2) / lobes + Math.sin(frame * 0.02 + p + l) * 0.35;
            const dist = pr * 0.36;
            const lx = px + Math.cos(angle) * dist;
            const ly = py + Math.sin(angle) * dist * 0.85;
            const lr = pr * (0.62 + Math.sin(p * 2.1 + l * 1.5) * 0.16);

            const sGrad = ctx.createRadialGradient(lx - lr * 0.2, ly - lr * 0.2, lr * 0.1, lx, ly, lr);
            if (p % 2 === 0 && pProg < 0.22) {
              sGrad.addColorStop(0, `rgba(254, 240, 138, ${pAlpha * 0.55})`);
              sGrad.addColorStop(0.5, `rgba(241, 245, 249, ${pAlpha * 0.65})`);
            } else {
              sGrad.addColorStop(0, `rgba(255, 255, 255, ${pAlpha})`);
              sGrad.addColorStop(0.55, `rgba(241, 245, 249, ${pAlpha * 0.85})`);
            }
            sGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.fillStyle = sGrad;
            ctx.beginPath();
            ctx.arc(lx, ly, lr, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // B. Tubuh Kerucut Vulkanik Gunung Merapi (Sisi Terang & Lereng Barat)
        ctx.fillStyle = '#475569'; // Batuan vulkanik andesit/basalt lereng atas
        ctx.beginPath();
        ctx.moveTo(ox + 180, h * 0.74);
        ctx.lineTo(ox + 440, h * 0.44);
        ctx.lineTo(summitX - 25, summitY + 4);
        ctx.lineTo(summitX, summitY); // Bibir kawah kubah lava barat
        ctx.lineTo(summitX + 22, summitY + 3);
        ctx.lineTo(summitX + 42, summitY + 9);
        ctx.lineTo(ox + 920, h * 0.46);
        ctx.lineTo(ox + 1180, h * 0.74);
        ctx.fill();

        // C. Sisi Bayangan & Tebing Kawah Puncak (Eastern Ridge / Crater Rim Shadow)
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.moveTo(summitX + 4, summitY);
        ctx.lineTo(summitX + 22, summitY + 3);
        ctx.lineTo(summitX + 42, summitY + 9);
        ctx.lineTo(ox + 920, h * 0.46);
        ctx.lineTo(ox + 1180, h * 0.74);
        ctx.lineTo(ox + 720, h * 0.74);
        ctx.fill();

        // D. Kubah Lava Aktif Puncak Merapi (Lava Dome)
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(summitX + 2, summitY + 6, 14, Math.PI * 0.9, Math.PI * 2.1);
        ctx.fill();

        // E. Jurang Piroklastik & Alur Lahar (Gendol, Opak & Kaliurang Ravines)
        ctx.fillStyle = '#1e293b';
        const ravines = [
          [summitX - 10, summitY + 12, summitX - 35, h * 0.42, 6],
          [summitX + 12, summitY + 14, summitX + 40, h * 0.46, 7],
          [summitX + 28, summitY + 18, summitX + 85, h * 0.50, 8],
          [summitX - 45, h * 0.40, summitX - 110, h * 0.58, 9],
        ];
        for (const [rx1, ry1, rx2, ry2, rw] of ravines) {
          ctx.beginPath();
          ctx.moveTo(rx1, ry1);
          ctx.lineTo(rx2, ry2);
          ctx.lineTo(rx2 + rw, ry2 + 4);
          ctx.lineTo(rx1 + Math.floor(rw * 0.5), ry1 + 2);
          ctx.closePath();
          ctx.fill();
        }

        // F. Vegetasi Hutan Tropis Basah Menyelimuti Lereng Tengah Merapi
        ctx.fillStyle = '#064e3b';
        ctx.beginPath();
        ctx.moveTo(ox + 220, h * 0.74);
        ctx.lineTo(ox + 460, h * 0.50);
        ctx.lineTo(summitX - 40, h * 0.38);
        ctx.lineTo(summitX + 50, h * 0.40);
        ctx.lineTo(ox + 900, h * 0.52);
        ctx.lineTo(ox + 1140, h * 0.74);
        ctx.fill();

        ctx.fillStyle = '#047857';
        ctx.beginPath();
        ctx.moveTo(ox + 250, h * 0.74);
        ctx.lineTo(ox + 480, h * 0.54);
        ctx.lineTo(summitX - 30, h * 0.44);
        ctx.lineTo(summitX + 40, h * 0.45);
        ctx.lineTo(ox + 870, h * 0.56);
        ctx.lineTo(ox + 1100, h * 0.74);
        ctx.fill();

        // G. Siluet Gunung Sebelah Jauh (Punggungan Menoreh / Merbabu Jauh di Kiri)
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.moveTo(ox - 60, h * 0.74);
        ctx.lineTo(ox + 110, h * 0.54);
        ctx.lineTo(ox + 210, h * 0.58);
        ctx.lineTo(ox + 340, h * 0.74);
        ctx.fill();
      }

      // Kabut Atmosferik Lembah Tropis (Tropical Valley Mist)
      const valleyHaze = ctx.createLinearGradient(0, h * 0.5, 0, h * 0.78);
      valleyHaze.addColorStop(0, 'rgba(186, 230, 253, 0)');
      valleyHaze.addColorStop(0.55, 'rgba(186, 230, 253, 0.35)');
      valleyHaze.addColorStop(1, 'rgba(224, 242, 254, 0.75)');
      ctx.fillStyle = valleyHaze;
      ctx.fillRect(0, h * 0.5, w, h * 0.28);

      // 3. PERBUKITAN LERENG MERAPI DEKAT BERHUTAN TROPIS LEBAT (Mid Ridge, Parallax 0.16)
      // Kontur perbukitan Kaliurang & Plawangan kontinu murni tanpa celah vertikal atau sambungan terpotong
      const stepX = 24;

      // Lapisan Bukit 1 (Hijau Hutan Hujan Tropis Lembap #064e3b - Kontinu penuh)
      ctx.fillStyle = '#064e3b';
      ctx.beginPath();
      ctx.moveTo(-40, h);
      for (let sx = -40; sx <= w + 48; sx += stepX) {
        const worldX = sx + camX * 0.14;
        const hillY = h * 0.58 + Math.sin(worldX * 0.0032) * (h * 0.08) + Math.cos(worldX * 0.0068) * (h * 0.04);
        ctx.lineTo(sx, hillY);
      }
      ctx.lineTo(w + 48, h);
      ctx.closePath();
      ctx.fill();

      // Lapisan Bukit 2 (di depan): Hijau Zamrud Tropis #047857 - Kontinu penuh
      ctx.fillStyle = '#047857';
      ctx.beginPath();
      ctx.moveTo(-40, h);
      for (let sx = -40; sx <= w + 48; sx += stepX) {
        const worldX = sx + camX * 0.18 + 240;
        const hillY = h * 0.66 + Math.sin(worldX * 0.004) * (h * 0.07) + Math.cos(worldX * 0.0085) * (h * 0.035);
        ctx.lineTo(sx, hillY);
      }
      ctx.lineTo(w + 48, h);
      ctx.closePath();
      ctx.fill();

      // Siluet Pohon Pinus Lereng Berakar Kokoh (Tergantung koordinat dunia tanpa terpotong)
      const treeSpacing = 160;
      const startTreeIdx = Math.floor((camX * 0.18 - 80) / treeSpacing);
      const endTreeIdx = Math.ceil((camX * 0.18 + w + 80) / treeSpacing);

      for (let ti = startTreeIdx; ti <= endTreeIdx; ti++) {
        const treeWorldX = ti * treeSpacing + ((ti * 47) % 60);
        const screenX = treeWorldX - camX * 0.18;
        if (screenX < -30 || screenX > w + 30) continue;

        const worldX = screenX + camX * 0.18 + 240;
        const groundY = h * 0.66 + Math.sin(worldX * 0.004) * (h * 0.07) + Math.cos(worldX * 0.0085) * (h * 0.035);
        const tw = 16 + ((ti * 7) % 10);
        const th = 26 + ((ti * 11) % 14);

        // Batang pohon tertancap ke bukit
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(screenX - 2, groundY, 4, 10);

        // Mahkota pohon pinus bertingkat alami
        ctx.fillStyle = '#065f46';
        ctx.beginPath();
        ctx.moveTo(screenX, groundY - th);
        ctx.lineTo(screenX - tw / 2, groundY);
        ctx.lineTo(screenX + tw / 2, groundY);
        ctx.closePath();
        ctx.fill();

        // Highlight hijau segar di sisi kiri pohon
        ctx.fillStyle = '#059669';
        ctx.beginPath();
        ctx.moveTo(screenX, groundY - th);
        ctx.lineTo(screenX - tw / 2, groundY);
        ctx.lineTo(screenX, groundY);
        ctx.closePath();
        ctx.fill();
      }
      break;
    }

    case 'crust': {
      // ══════════════════════════════════════════════════════════════════════
      // AREA PERTAMBANGAN LITOSFER KERAK BUMI (DEEP MINING EXCAVATION)
      // Suasana lorong tambang dalam yang autentik: balok penyangga kayu kokoh,
      // pipa ventilasi industri, rel lori, urat mineral, dan lentera hangat.
      // Bersih tanpa plang teks / badge angka pos.
      // ══════════════════════════════════════════════════════════════════════

      // 1. Gradien Latar Gua Tambang Dalam
      const grd = ctx.createLinearGradient(0, 0, 0, h);
      grd.addColorStop(0, '#100a07');    // Atap langit-langit batuan gelap
      grd.addColorStop(0.35, '#190f0a'); // Dinding galian tambang
      grd.addColorStop(0.7, '#20120b');  // Area lantai terowongan
      grd.addColorStop(1, '#0e0704');    // Dasar batuan keras
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);

      // 2. Strata Batuan & Guratan Pahat Galian Dinding Belakang (Parallax 0.12)
      const wallOffset = (-camX * 0.12) % 400;
      ctx.fillStyle = 'rgba(46, 26, 17, 0.45)';
      for (let y = 60; y < h - 40; y += 38) {
        ctx.fillRect(0, y + Math.sin(y * 0.15) * 6, w, 14);
      }

      // Guratan pahat horizontal & rekahan vertikal alami
      ctx.fillStyle = 'rgba(24, 13, 8, 0.6)';
      for (let i = -400; i < w + 400; i += 180) {
        const sx = i + wallOffset;
        ctx.fillRect(sx + 30, 80, 2, 90);
        ctx.fillRect(sx + 110, 140, 2, 70);
        ctx.fillRect(sx + 70, 230, 3, 85);
      }

      // Urat Mineral Emas & Kuarsa Berpendar Halus di Dinding Tambang
      const oreOffset = (-camX * 0.15) % 520;
      const oreSpots = [
        [80, 110, 22, 6, '#fbbf24'],
        [160, 195, 30, 5, '#fef08a'],
        [310, 140, 18, 7, '#f59e0b'],
        [430, 240, 25, 6, '#fbbf24'],
      ];
      for (let rep = -1; rep < Math.ceil(w / 520) + 2; rep++) {
        const baseO = rep * 520 + oreOffset;
        for (const [ox, oy, ow, oh, col] of oreSpots) {
          const screenOx = baseO + (ox as number);
          if (screenOx < -40 || screenOx > w + 40) continue;
          ctx.fillStyle = col as string;
          ctx.globalAlpha = 0.35 + Math.sin(frame * 0.05 + screenOx) * 0.12;
          ctx.fillRect(screenOx, oy as number, ow as number, oh as number);
          ctx.fillRect(screenOx + 4, (oy as number) - 3, (ow as number) - 8, 3);
          ctx.fillRect(screenOx + 6, (oy as number) + (oh as number), (ow as number) - 12, 3);
          ctx.globalAlpha = 1.0;
        }
      }

      // Fosil-fosil purba pada dinding galian batu (Wall Strata Fossils - Parallax 0.12)
      const wallFossils: { ox: number; y: number; type: 'ammonite' | 'trilobite' | 'fish' | 'dino_ribs'; scale: number }[] = [
        { ox: 130, y: 110, type: 'ammonite', scale: 1.25 },
        { ox: 270, y: 165, type: 'fish', scale: 1.15 },
        { ox: 410, y: 95, type: 'trilobite', scale: 1.2 },
        { ox: 540, y: 150, type: 'dino_ribs', scale: 1.1 },
      ];
      const fossilSpan = 600;
      const fossilOffset = (-camX * 0.12) % fossilSpan;
      for (let rep = -1; rep < Math.ceil(w / fossilSpan) + 2; rep++) {
        const baseFX = rep * fossilSpan + fossilOffset;
        for (const wf of wallFossils) {
          const fx = baseFX + wf.ox;
          if (fx < -50 || fx > w + 50) continue;
          drawPixelFossil(ctx, fx, wf.y, wf.type, wf.scale, 0.65);
        }
      }

      // 3. Pipa Ventilasi Udara Tambang (Industrial Ventilation Ducting) di Langit-langit
      const ductY = 52;
      const ductH = 14;
      ctx.fillStyle = '#334155'; // Tabung seng bergelombang
      ctx.fillRect(0, ductY, w, ductH);
      ctx.fillStyle = '#1e293b'; // Bayangan bawah pipa
      ctx.fillRect(0, ductY + ductH - 3, w, 3);
      ctx.fillStyle = '#64748b'; // Sorotan atas pipa
      ctx.fillRect(0, ductY, w, 2);

      // Cincin Sambungan & Bracket Gantungan Pipa Logam
      const ductStep = 75;
      const ductOff = (-camX * 0.35) % ductStep;
      for (let dx = ductOff - ductStep; dx < w + ductStep; dx += ductStep) {
        // Cincin penguat pipa
        ctx.fillStyle = '#475569';
        ctx.fillRect(dx, ductY - 1, 6, ductH + 2);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(dx + 1, ductY, 2, ductH);

        // Kawat/rantai penggantung ke atap batu
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(dx + 2, 0, 2, ductY);
      }

      // 4. Kabel Listrik Industri yang Bergelombang (Catenary Sagging Power Cables)
      ctx.strokeStyle = '#1c1917';
      ctx.lineWidth = 2;
      const cableSpan = 210;
      const cableOff = (-camX * 0.4) % cableSpan;
      for (let cx = cableOff - cableSpan; cx < w + cableSpan; cx += cableSpan) {
        ctx.beginPath();
        ctx.moveTo(cx, 68);
        ctx.quadraticCurveTo(cx + cableSpan * 0.5, 96, cx + cableSpan, 68);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx, 74);
        ctx.quadraticCurveTo(cx + cableSpan * 0.5, 106, cx + cableSpan, 74);
        ctx.stroke();
      }

      // 5. Rel Kereta Tambang (Minecart Track) di Latar Belakang Bawah
      const trackY = h - 68;
      // Bantalan kayu rel
      ctx.fillStyle = '#3e2010';
      const tieStep = 32;
      const tieOff = (-camX * 0.55) % tieStep;
      for (let tx = tieOff - tieStep; tx < w + tieStep; tx += tieStep) {
        ctx.fillRect(tx, trackY + 4, 18, 5);
        ctx.fillStyle = '#1f1008';
        ctx.fillRect(tx, trackY + 8, 18, 2);
        ctx.fillStyle = '#3e2010';
      }
      // Rel besi ganda
      ctx.fillStyle = '#475569';
      ctx.fillRect(0, trackY, w, 3);
      ctx.fillRect(0, trackY + 7, w, 3);
      ctx.fillStyle = '#94a3b8'; // Kilau kepala rel besi
      ctx.fillRect(0, trackY, w, 1);
      ctx.fillRect(0, trackY + 7, w, 1);

      // Lori Tambang / Gerobak Bijih (Minecart) di Posisi Dunia Nyata
      const cartWorldX = 840;
      const cartScreenX = cartWorldX - camX * 0.55;
      if (cartScreenX > -80 && cartScreenX < w + 80) {
        const cy = trackY - 26;
        // Roda besi
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(cartScreenX + 10, trackY + 4, 6, 0, Math.PI * 2);
        ctx.arc(cartScreenX + 38, trackY + 4, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(cartScreenX + 8, trackY + 2, 4, 4);
        ctx.fillRect(cartScreenX + 36, trackY + 2, 4, 4);

        // Badan gerobak lori besi & kayu
        ctx.fillStyle = '#5c2d16';
        ctx.beginPath();
        ctx.moveTo(cartScreenX + 2, cy + 4);
        ctx.lineTo(cartScreenX + 46, cy + 4);
        ctx.lineTo(cartScreenX + 41, cy + 24);
        ctx.lineTo(cartScreenX + 7, cy + 24);
        ctx.closePath();
        ctx.fill();

        // Rangka penguat besi luar
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Tumpukan bongkahan batu mineral di dalam lori
        ctx.fillStyle = '#78716c';
        ctx.beginPath();
        ctx.arc(cartScreenX + 16, cy + 4, 7, Math.PI, Math.PI * 2);
        ctx.arc(cartScreenX + 28, cy + 2, 8, Math.PI, Math.PI * 2);
        ctx.arc(cartScreenX + 38, cy + 5, 6, Math.PI, Math.PI * 2);
        ctx.fill();

        // Kilau kristal di lori
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(cartScreenX + 24, cy - 2, 3, 3);
      }

      // 6. Rangka Balok Kayu Penyangga Tambang (Timber Bents / Mine Support Frames)
      // Terikat posisi dunia tanpa label teks
      const timberSpacing = 260;
      const tStartIdx = Math.floor((camX * 0.5 - 60) / timberSpacing);
      const tEndIdx = Math.ceil((camX * 0.5 + w + 60) / timberSpacing);

      for (let ti = tStartIdx; ti <= tEndIdx; ti++) {
        const frameWorldX = ti * timberSpacing;
        const fx = frameWorldX - camX * 0.5;
        if (fx < -60 || fx > w + 60) continue;

        // Tiang Kayu Vertikal (Kiri & Kanan Balok)
        ctx.fillStyle = '#451a03'; // Kayu tua kuat
        ctx.fillRect(fx - 14, 0, 14, h);
        ctx.fillStyle = '#78350f'; // Highlight kayu
        ctx.fillRect(fx - 12, 0, 4, h);
        ctx.fillStyle = '#270e02'; // Bayangan sudut tiang
        ctx.fillRect(fx - 2, 0, 2, h);

        // Balok Palang Atas (Cap Timber Beam)
        ctx.fillStyle = '#451a03';
        ctx.fillRect(fx - 18, 38, 76, 14);
        ctx.fillStyle = '#78350f';
        ctx.fillRect(fx - 18, 40, 76, 3);
        ctx.fillStyle = '#1c0a02';
        ctx.fillRect(fx - 18, 50, 76, 2);

        // Penopang Sudut Segitiga (Knee Braces)
        ctx.fillStyle = '#361402';
        ctx.beginPath();
        ctx.moveTo(fx, 52);
        ctx.lineTo(fx + 22, 52);
        ctx.lineTo(fx, 74);
        ctx.closePath();
        ctx.fill();

        // Baut Besi Pengikat Balok
        ctx.fillStyle = '#64748b';
        ctx.fillRect(fx - 8, 43, 3, 3);
        ctx.fillRect(fx + 4, 43, 3, 3);
        ctx.fillRect(fx - 8, 70, 3, 3);

        // Lentera Tambang Vintage Berpendar Hangat (Miner's Lantern)
        const lanternX = fx + 26;
        const lanternY = 64;

        // Kawat gantungan lentera
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(lanternX, 52);
        ctx.lineTo(lanternX, lanternY);
        ctx.stroke();

        // Pendaran Cahaya Lentera Hangat (Amber Radial Glow)
        const lanternGlow = ctx.createRadialGradient(
          lanternX, lanternY + 8, 3,
          lanternX, lanternY + 8, 54
        );
        const flicker = 0.88 + Math.sin(frame * 0.12 + ti * 1.7) * 0.12;
        lanternGlow.addColorStop(0, `rgba(254, 240, 138, ${0.45 * flicker})`);
        lanternGlow.addColorStop(0.35, `rgba(245, 158, 11, ${0.22 * flicker})`);
        lanternGlow.addColorStop(1, 'rgba(217, 119, 6, 0)');
        ctx.fillStyle = lanternGlow;
        ctx.beginPath();
        ctx.arc(lanternX, lanternY + 8, 54, 0, Math.PI * 2);
        ctx.fill();

        // Badan Logam & Kaca Lentera
        ctx.fillStyle = '#1e293b'; // Topi lentera
        ctx.fillRect(lanternX - 4, lanternY, 8, 3);
        ctx.fillRect(lanternX - 5, lanternY + 3, 10, 2);

        // Bohlam kaca pijar menyala
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(lanternX - 3, lanternY + 5, 6, 8);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(lanternX - 1, lanternY + 7, 2, 4);

        // Kerangka pelindung kawat kaca
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 1;
        ctx.strokeRect(lanternX - 3.5, lanternY + 5, 7, 8);

        // Mangkuk dasar lentera
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(lanternX - 5, lanternY + 13, 10, 3);
      }

      // ══════════════════════════════════════════════════════════════════════
      // 7. AKTIVITAS PENAMBANG PURBA LITOSFER (MINING WORKERS IN BACKGROUND)
      // Pekerja tambang latar belakang berhelm kuning menyala dengan lampu senter,
      // mengayunkan beliung (pickaxe swing) menghantam dinding batu disertai
      // percikan bunga api (sparks) dan partikel debu galian.
      // ══════════════════════════════════════════════════════════════════════
      const miners = [
        { worldX: 380, y: 220, dir: 1, type: 'pickaxe', cycleOffset: 0 },
        { worldX: 720, y: 200, dir: -1, type: 'pickaxe', cycleOffset: 14 },
        { worldX: 1040, y: 235, dir: 1, type: 'chisel', cycleOffset: 7 },
      ];

      for (const m of miners) {
        const mx = m.worldX - camX * 0.5;
        if (mx < -80 || mx > w + 80) continue;
        const my = m.y;
        const dir = m.dir;

        // Sorotan lampu helm tambang (Miner's Headlamp Cone of Light)
        const lampX = mx + dir * 5;
        const lampY = my - 16;
        const targetWallX = lampX + dir * 45;
        const targetWallY = lampY + 6;

        const lampCone = ctx.createRadialGradient(lampX, lampY, 2, targetWallX, targetWallY, 40);
        lampCone.addColorStop(0, 'rgba(254, 240, 138, 0.60)');
        lampCone.addColorStop(0.35, 'rgba(253, 224, 71, 0.22)');
        lampCone.addColorStop(1, 'rgba(253, 224, 71, 0)');
        ctx.fillStyle = lampCone;
        ctx.beginPath();
        ctx.moveTo(lampX, lampY);
        ctx.lineTo(targetWallX, targetWallY - 22);
        ctx.lineTo(targetWallX, targetWallY + 22);
        ctx.closePath();
        ctx.fill();

        // Kaki & Sepatu Boot
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(mx - 4, my, 4, 6);
        ctx.fillRect(mx + 1, my, 4, 6);

        // Celana Overalls Kerja Biru
        ctx.fillStyle = '#1d4ed8';
        ctx.fillRect(mx - 4, my - 8, 9, 8);

        // Rompi/Baju Kerja Oranye Keselamatan Tambang
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(mx - 5, my - 16, 11, 8);
        ctx.fillStyle = '#facc15'; // Reflektor vest
        ctx.fillRect(mx - 5, my - 13, 11, 2);

        // Kepala & Wajah
        ctx.fillStyle = '#fed7aa';
        ctx.fillRect(mx - 3, my - 21, 7, 5);

        // Helm Proyek Kuning (Safety Hardhat)
        ctx.fillStyle = '#eab308';
        ctx.fillRect(mx - 5, my - 25, 11, 4);
        ctx.fillRect(mx - 6, my - 21, 13, 2);

        // Lampu Tambang di Helm
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(lampX - 1, lampY - 1, 3, 3);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(lampX - 2, lampY - 2, 5, 5);

        if (m.type === 'pickaxe') {
          // Animasi ayunan beliung (Pickaxe Swing Animation)
          const swingFrame = (frame + m.cycleOffset) % 28;
          let pickAngle = 0;
          let hitSpark = false;

          if (swingFrame < 14) {
            // Mengangkat beliung ke belakang (Wind up)
            pickAngle = -Math.PI * 0.35 + (swingFrame / 14) * (-Math.PI * 0.25);
          } else if (swingFrame < 20) {
            // Mengayunkan ke dinding batu (Strike down!)
            const t = (swingFrame - 14) / 6;
            pickAngle = -Math.PI * 0.6 + t * (Math.PI * 0.85);
            if (swingFrame >= 18) hitSpark = true;
          } else {
            // Tahan sesaat di dinding
            pickAngle = Math.PI * 0.25;
          }

          // Lengan & Beliung
          ctx.save();
          ctx.translate(mx + dir * 3, my - 13);
          if (dir === -1) ctx.scale(-1, 1);
          ctx.rotate(pickAngle);

          // Gagang kayu beliung
          ctx.fillStyle = '#78350f';
          ctx.fillRect(-2, -18, 3, 20);

          // Mata besi beliung (Baja runcing melengkung)
          ctx.fillStyle = '#94a3b8';
          ctx.beginPath();
          ctx.moveTo(-10, -18);
          ctx.lineTo(8, -18);
          ctx.lineTo(10, -15);
          ctx.lineTo(0, -16);
          ctx.lineTo(-10, -15);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = '#e2e8f0';
          ctx.fillRect(-10, -17, 3, 2);
          ctx.fillRect(7, -17, 3, 2);
          ctx.restore();

          // Percikan api hantaman beliung ke dinding batu (Sparks on impact)
          if (hitSpark) {
            const sparkOriginX = mx + dir * 24;
            const sparkOriginY = my - 14;
            const sparkSeed = (frame * 19) & 0xff;

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(sparkOriginX, sparkOriginY, 2, 2);

            for (let sp = 0; sp < 4; sp++) {
              const spAngle = ((sparkSeed + sp * 57) % 360) * (Math.PI / 180);
              const spDist = 3 + (sp * 2.5);
              const spX = sparkOriginX + Math.cos(spAngle) * spDist;
              const spY = sparkOriginY + Math.sin(spAngle) * spDist;

              ctx.fillStyle = sp % 2 === 0 ? '#fef08a' : '#f97316';
              ctx.fillRect(Math.round(spX), Math.round(spY), 1.5, 1.5);
            }
          }
        } else {
          // Penambang memeriksa dinding urat mineral dengan palu & pahat
          const tapFrame = (frame + m.cycleOffset) % 16;
          ctx.fillStyle = '#94a3b8';
          ctx.fillRect(mx + dir * 6, my - 14, 8, 2);
          if (tapFrame < 4) {
            ctx.fillStyle = '#fef08a';
            ctx.fillRect(mx + dir * 14, my - 15, 2, 2); // Spark kecil
          }
        }
      }

      // 8. Semburat Panas Geotermal Lembut di Bagian Bawah Terowongan
      const geothermalHaze = ctx.createLinearGradient(0, h - 35, 0, h);
      geothermalHaze.addColorStop(0, 'rgba(234, 88, 12, 0)');
      geothermalHaze.addColorStop(1, 'rgba(234, 88, 12, 0.15)');
      ctx.fillStyle = geothermalHaze;
      ctx.fillRect(0, h - 35, w, 35);
      break;
    }

    case 'mantle': {
      // ══════════════════════════════════════════════════════════════════════
      // MANTEL BUMI (~860 KM): LAUTAN MAGMA & ASINOSFER REALISTIK PENUH ASAP
      // Gradasi warna magma murni yang membara tanpa garis-garis aneh,
      // dipenuhi kabut asap vulkanik organik realistis (tanpa lingkaran kaku).
      // ══════════════════════════════════════════════════════════════════════

      // 1. Gradasi Warna Magma Murni Membara (Atas Gelap Marun -> Bawah Jingga Magma)
      const grd = ctx.createLinearGradient(0, 0, 0, h);
      grd.addColorStop(0, '#1c0302');     // Batas atas litosfer - kerak mantel dingin pekat
      grd.addColorStop(0.18, '#350704');  // Merah marun vulkanik dalam
      grd.addColorStop(0.42, '#5e0d06');  // Merah magma mendidih
      grd.addColorStop(0.68, '#9a2408');  // Merah bata membara konveksi
      grd.addColorStop(0.85, '#c2410c');  // Jingga pijar astenosfer
      grd.addColorStop(1, '#ea580c');     // Dasar lautan magma silikat membara
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);

      // 2. Kolom Panas Konveksi Lembut Menyebar (Broad Vertical Thermal Glows - Non-Striped)
      for (let p = 0; p < 3; p++) {
        const pCam = camX * 0.08;
        const pSpacing = (w + 240) / 3;
        const px = ((p * pSpacing + 80 - pCam) % (w + 240) + (w + 240)) % (w + 240) - 120;
        const pWidth = 140;
        const pPulse = 0.07 + Math.sin(frame * 0.02 + p * 2.1) * 0.03;

        const pGrd = ctx.createRadialGradient(px, h * 0.65, 10, px, h * 0.65, pWidth);
        pGrd.addColorStop(0, `rgba(251, 146, 60, ${pPulse})`);
        pGrd.addColorStop(0.5, `rgba(234, 88, 12, ${pPulse * 0.45})`);
        pGrd.addColorStop(1, 'rgba(45, 10, 5, 0)');

        ctx.fillStyle = pGrd;
        ctx.fillRect(px - pWidth, 0, pWidth * 2, h);
      }

      // 3. ASAP VULKANIK REALISTIK ORGANIK (100% BEBAS BENTUK BULAT / CIRCLE)
      // Menggunakan kurva bezier berlapis dan pita harmonik poligon yang mengepul dinamis
      // Lapis A: Kabut Asap Tebal Bergulung di Bagian Bawah & Tengah (Rolling Low Fog)
      const smokeBanks = [
        { baseY: h * 0.76, amp: 26, speed: 0.012, alpha: 0.22, color: '42, 12, 8' },
        { baseY: h * 0.54, amp: 34, speed: 0.009, alpha: 0.18, color: '60, 18, 11' },
        { baseY: h * 0.32, amp: 40, speed: 0.007, alpha: 0.15, color: '35, 10, 7' },
      ];

      for (let sIdx = 0; sIdx < smokeBanks.length; sIdx++) {
        const sb = smokeBanks[sIdx];
        const sP = camX * (0.04 + sIdx * 0.03);

        ctx.fillStyle = `rgba(${sb.color}, ${sb.alpha})`;
        ctx.beginPath();
        ctx.moveTo(0, h);

        const startY = sb.baseY + Math.sin(frame * sb.speed - sP * 0.006) * sb.amp;
        ctx.lineTo(0, startY);

        for (let bx = 0; bx <= w + 40; bx += 30) {
          const t1 = frame * sb.speed + (bx - sP) * 0.007;
          const t2 = frame * (sb.speed * 1.6) + (bx - sP) * 0.013;
          const t3 = frame * (sb.speed * 0.6) + (bx - sP) * 0.003;
          const waveY = sb.baseY +
            Math.sin(t1) * sb.amp +
            Math.cos(t2) * (sb.amp * 0.45) +
            Math.sin(t3) * (sb.amp * 0.3);

          const prevX = Math.max(0, bx - 30);
          const cpX = (prevX + bx) / 2;
          ctx.quadraticCurveTo(cpX, waveY + Math.sin(t2) * 6, bx, waveY);
        }

        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();
      }

      // Lapis B: Gumpalan Kepulan Asap Vulkanik Vertikal Naik (Organic Rising Billows)
      // Dibentuk dari kurva asimetris yang melengkung dan mengembang seperti asap cerobong nyata
      for (let smk = 0; smk < 5; smk++) {
        const seed = smk * 89 + 17;
        const driftSpeed = 0.35 + (smk % 3) * 0.15;
        const riseSpeed = 0.55 + (smk % 2) * 0.2;
        const loopH = h * 1.2;

        const smkY = ((h - (frame * riseSpeed + seed * 23) % loopH) + loopH) % loopH - (h * 0.1);
        const sway = Math.sin(frame * 0.015 * driftSpeed + smk * 1.8) * 45;
        const smkX = (((seed * 73 + sway - camX * 0.12) % (w + 160) + (w + 160)) % (w + 160)) - 80;

        // Ketinggian relatif asap (makin tinggi makin mengembang dan memudar)
        const altitudeNorm = Math.max(0, Math.min(1, 1 - (smkY / h)));
        const billowW = 45 + altitudeNorm * 75;
        const billowH = 55 + altitudeNorm * 65;
        const smokeAlpha = Math.sin(altitudeNorm * Math.PI) * 0.16;

        if (smokeAlpha > 0.01) {
          const billowGrd = ctx.createRadialGradient(smkX, smkY, 6, smkX, smkY, billowW);
          billowGrd.addColorStop(0, `rgba(85, 24, 14, ${smokeAlpha})`);
          billowGrd.addColorStop(0.45, `rgba(50, 14, 9, ${smokeAlpha * 0.7})`);
          billowGrd.addColorStop(0.8, `rgba(30, 8, 6, ${smokeAlpha * 0.3})`);
          billowGrd.addColorStop(1, 'rgba(20, 5, 4, 0)');

          ctx.fillStyle = billowGrd;
          ctx.beginPath();
          // Bentuk poligon organik terdistorsi (tanpa lingkaran)
          const points = 7;
          for (let pt = 0; pt <= points; pt++) {
            const angle = (pt / points) * Math.PI * 2;
            const radiusMod = 1 + Math.sin(angle * 3 + frame * 0.03 + seed) * 0.28 +
              Math.cos(angle * 2 + seed * 0.5) * 0.18;
            const px = smkX + Math.cos(angle) * (billowW * radiusMod);
            const py = smkY + Math.sin(angle) * (billowH * radiusMod);
            if (pt === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
        }
      }

      // 4. Percikan Pijar Lahar & Debu Vulkanik Mengambang (Floating Embers & Volcanic Ash)
      for (let eb = 0; eb < 24; eb++) {
        const seedEb = (eb * 79 + 31);
        const ex = ((seedEb * 43 - camX * 0.12) % w + w) % w;
        const progress = ((frame * 0.5 + seedEb * 17) % 260) / 260;
        const ey = h * 0.98 - progress * (h * 0.9);
        const sway = Math.sin(frame * 0.04 + seedEb) * 14;

        const emberAlpha = Math.sin(progress * Math.PI) * 0.85;
        if (eb % 4 === 0) {
          // Debu abu vulkanik abu-abu gelap melayang dalam asap
          ctx.fillStyle = `rgba(180, 140, 130, ${emberAlpha * 0.5})`;
          ctx.fillRect(Math.round(ex + sway), Math.round(ey), 2, 2);
        } else {
          // Bara api magma menyala
          ctx.fillStyle = eb % 3 === 0 ? `rgba(254, 240, 138, ${emberAlpha})` : `rgba(249, 115, 22, ${emberAlpha})`;
          ctx.fillRect(Math.round(ex + sway), Math.round(ey), eb % 5 === 0 ? 3 : 2, eb % 5 === 0 ? 3 : 2);
        }
      }

      // 5. Pendaran Radiasi Termal Ambien Lembut
      const radiantPulse = Math.sin(frame * 0.025) * 0.03 + 0.10;
      ctx.fillStyle = `rgba(234, 88, 12, ${radiantPulse})`;
      ctx.fillRect(0, 0, w, h);
      break;
    }

    case 'outerCore': {
      // ══════════════════════════════════════════════════════════════════════
      // INTI LUAR (2.900 - 5.150 KM): KONDISI KUNING MATAHARI SEPERTI INTI DALAM SEBELUMNYA
      // Background gradasi magma keemasan fotorealistik kuning matahari cerah 5.000°C.
      // Ditambah efek kepulan asap termal kristalin organik keemasan.
      // DILENGKAPI EFEK GARIS MEDAN MAGNET BUMI (GEOMAGNETIC DIPOLE FLUX LOOPS)
      // ══════════════════════════════════════════════════════════════════════

      // 1. Gradien Magma Emas Pijar Lembut (Photorealistic Golden Solar Magma Gradient)
      const grd = ctx.createLinearGradient(0, 0, 0, h);
      grd.addColorStop(0, '#78350f');    // Kuning amber gelap hangat di puncak kubah terbuka
      grd.addColorStop(0.28, '#b45309'); // Kuning keemasan pekat
      grd.addColorStop(0.55, '#d97706'); // Kuning matahari membara
      grd.addColorStop(0.80, '#eab308'); // Kuning cerah pijar inti
      grd.addColorStop(1, '#fde047');    // Kuning matahari murni di atas permukaan tanah datar
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);

      // 2. ASAP TERMAL KEEMASAN ORGANIK REALISTIS (100% BEBAS BENTUK BULAT / CIRCLE)
      // Lapis A: Kabut Asap Emas Hangat Bergulung di Bagian Bawah & Tengah (Rolling Golden Fog)
      const smokeBanksOC = [
        { baseY: h * 0.72, amp: 22, speed: 0.010, alpha: 0.18, color: '120, 53, 15' },
        { baseY: h * 0.48, amp: 30, speed: 0.008, alpha: 0.14, color: '160, 75, 18' },
        { baseY: h * 0.28, amp: 35, speed: 0.006, alpha: 0.12, color: '100, 40, 12' },
      ];

      for (let sIdx = 0; sIdx < smokeBanksOC.length; sIdx++) {
        const sb = smokeBanksOC[sIdx];
        const sP = camX * (0.04 + sIdx * 0.03);

        ctx.fillStyle = `rgba(${sb.color}, ${sb.alpha})`;
        ctx.beginPath();
        ctx.moveTo(0, h);

        const startY = sb.baseY + Math.sin(frame * sb.speed - sP * 0.006) * sb.amp;
        ctx.lineTo(0, startY);

        for (let bx = 0; bx <= w + 40; bx += 30) {
          const t1 = frame * sb.speed + (bx - sP) * 0.007;
          const t2 = frame * (sb.speed * 1.6) + (bx - sP) * 0.013;
          const t3 = frame * (sb.speed * 0.6) + (bx - sP) * 0.003;
          const waveY = sb.baseY +
            Math.sin(t1) * sb.amp +
            Math.cos(t2) * (sb.amp * 0.45) +
            Math.sin(t3) * (sb.amp * 0.3);

          const prevX = Math.max(0, bx - 30);
          const cpX = (prevX + bx) / 2;
          ctx.quadraticCurveTo(cpX, waveY + Math.sin(t2) * 6, bx, waveY);
        }

        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();
      }

      // Lapis B: Gumpalan Kepulan Asap Termal Keemasan Naik
      for (let smk = 0; smk < 5; smk++) {
        const seed = smk * 83 + 19;
        const driftSpeed = 0.32 + (smk % 3) * 0.12;
        const riseSpeed = 0.45 + (smk % 2) * 0.18;
        const loopH = h * 1.2;

        const smkY = ((h - (frame * riseSpeed + seed * 23) % loopH) + loopH) % loopH - (h * 0.1);
        const sway = Math.sin(frame * 0.015 * driftSpeed + smk * 1.8) * 45;
        const smkX = (((seed * 73 + sway - camX * 0.12) % (w + 160) + (w + 160)) % (w + 160)) - 80;

        const altitudeNorm = Math.max(0, Math.min(1, 1 - (smkY / h)));
        const billowW = 45 + altitudeNorm * 75;
        const billowH = 55 + altitudeNorm * 65;
        const smokeAlpha = Math.sin(altitudeNorm * Math.PI) * 0.14;

        if (smokeAlpha > 0.01) {
          const billowGrd = ctx.createRadialGradient(smkX, smkY, 6, smkX, smkY, billowW);
          billowGrd.addColorStop(0, `rgba(180, 83, 9, ${smokeAlpha})`);
          billowGrd.addColorStop(0.45, `rgba(140, 60, 8, ${smokeAlpha * 0.7})`);
          billowGrd.addColorStop(0.8, `rgba(100, 40, 6, ${smokeAlpha * 0.3})`);
          billowGrd.addColorStop(1, 'rgba(60, 20, 4, 0)');

          ctx.fillStyle = billowGrd;
          ctx.beginPath();
          const points = 7;
          for (let pt = 0; pt <= points; pt++) {
            const angle = (pt / points) * Math.PI * 2;
            const radiusMod = 1 + Math.sin(angle * 3 + frame * 0.03 + seed) * 0.28 +
              Math.cos(angle * 2 + seed * 0.5) * 0.18;
            const px = smkX + Math.cos(angle) * (billowW * radiusMod);
            const py = smkY + Math.sin(angle) * (billowH * radiusMod);
            if (pt === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
        }
      }

      // Floating Luminous Amber Sparks & Gold Shimmer
      for (let sp = 0; sp < 22; sp++) {
        const seedSp = (sp * 71 + 29);
        const sx = ((seedSp * 47 - camX * 0.1) % w + w) % w;
        const progress = ((frame * 0.45 + seedSp * 13) % 240) / 240;
        const sy = h * 0.98 - progress * (h * 0.9);
        const sway = Math.sin(frame * 0.035 + seedSp) * 12;
        const sparkAlpha = Math.sin(progress * Math.PI) * 0.85;

        if (sp % 3 === 0) {
          ctx.fillStyle = `rgba(255, 255, 255, ${sparkAlpha * 0.9})`;
          ctx.fillRect(Math.round(sx + sway), Math.round(sy), 2, 2);
        } else {
          ctx.fillStyle = `rgba(254, 240, 138, ${sparkAlpha * 0.7})`;
          ctx.fillRect(Math.round(sx + sway), Math.round(sy), 1.5, 1.5);
        }
      }

      // 3. ── EFEK GARIS MEDAN MAGNET BUMI (GEOMAGNETIC DIPOLE FLUX LOOPS - TETAP DI INTI LUAR) ──
      // Meniru diagram kutub magnet dipole bumi melengkung anggun melintasi langit emas kuning:
      // Warna: Cyan elektrik menyala & Emas elektromagnetik bercahaya.
      ctx.save();
      const dipoleLoops = [
        { spanRatio: 0.35, peakRatio: 0.12, col: 'rgba(56, 189, 248, 0.75)', glowCol: 'rgba(186, 230, 253, 0.95)', lw: 2.2, speed: 0.8 },
        { spanRatio: 0.55, peakRatio: 0.18, col: 'rgba(254, 240, 138, 0.70)', glowCol: 'rgba(255, 255, 255, 0.90)', lw: 2.0, speed: -0.6 },
        { spanRatio: 0.75, peakRatio: 0.26, col: 'rgba(56, 189, 248, 0.65)', glowCol: 'rgba(125, 211, 252, 0.85)', lw: 2.5, speed: 0.9 },
        { spanRatio: 0.95, peakRatio: 0.34, col: 'rgba(250, 204, 21, 0.60)', glowCol: 'rgba(254, 240, 138, 0.80)', lw: 1.8, speed: -0.7 },
        { spanRatio: 1.15, peakRatio: 0.42, col: 'rgba(56, 189, 248, 0.55)', glowCol: 'rgba(186, 230, 253, 0.75)', lw: 1.6, speed: 0.8 },
      ];

      const magCenterBaseX = w / 2 - (camX * 0.1) % (w * 0.5);

      for (const loop of dipoleLoops) {
        const halfSpan = (w * loop.spanRatio) / 2;
        const leftX = magCenterBaseX - halfSpan;
        const rightX = magCenterBaseX + halfSpan;
        const peakY = h * loop.peakRatio + Math.sin(frame * 0.03 + loop.spanRatio * 5) * 12;

        // Glow lembut di sekitar garis medan
        ctx.strokeStyle = loop.col;
        ctx.lineWidth = loop.lw + 3;
        ctx.beginPath();
        ctx.moveTo(leftX, h * 0.88);
        ctx.bezierCurveTo(leftX - 40, peakY - 20, rightX + 40, peakY - 20, rightX, h * 0.88);
        ctx.stroke();

        // Garis medan inti bercahaya tajam
        ctx.strokeStyle = loop.glowCol;
        ctx.lineWidth = loop.lw;
        ctx.beginPath();
        ctx.moveTo(leftX, h * 0.88);
        ctx.bezierCurveTo(leftX - 40, peakY - 20, rightX + 40, peakY - 20, rightX, h * 0.88);
        ctx.stroke();

        // Fluks partikel medan magnet yang bergerak sepanjang garis (Magnetic flux energy pulses)
        const pulseCount = 3;
        for (let p = 0; p < pulseCount; p++) {
          const t = ((frame * 0.008 * loop.speed + (p / pulseCount)) % 1 + 1) % 1;
          const u = 1 - t;
          const p0x = leftX, p0y = h * 0.88;
          const p1x = leftX - 40, p1y = peakY - 20;
          const p2x = rightX + 40, p2y = peakY - 20;
          const p3x = rightX, p3y = h * 0.88;

          const px = u * u * u * p0x + 3 * u * u * t * p1x + 3 * u * t * t * p2x + t * t * t * p3x;
          const py = u * u * u * p0y + 3 * u * u * t * p1y + 3 * u * t * t * p2y + t * t * t * p3y;

          ctx.fillStyle = '#ffffff';
          ctx.fillRect(Math.round(px - 1.5), Math.round(py - 1.5), 3, 3);
          ctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
          ctx.fillRect(Math.round(px - 3), Math.round(py - 3), 6, 6);
        }
      }
      ctx.restore();

      // 4. Pendaran Radiasi Termal Cerah Global (High-Temperature Solar Incandescent Glow)
      const globalPulse = Math.sin(frame * 0.04) * 0.03 + 0.12;
      ctx.fillStyle = `rgba(254, 240, 138, ${globalPulse})`;
      ctx.fillRect(0, 0, w, h);
      break;
    }

    case 'innerCore': {
      // ══════════════════════════════════════════════════════════════════════
      // INTI DALAM (5.150 - 6.371 KM): KONDISI AGAK GELAP SEPERTI INTI LUAR SEBELUMNYA
      // Gradien magma tembaga-merah pekat membara (seperti kondisi Inti Luar sebelumnya)
      // Dilengkapi samudra fluida logam cair, kabut asap vulkanik gelap, dan floating embers
      // ══════════════════════════════════════════════════════════════════════

      // 1. Gradien Magma Gelap Kental Fotorealistik Halus (Smooth Deep Molten Magma Gradient)
      const grd = ctx.createLinearGradient(0, 0, 0, h);
      grd.addColorStop(0, '#3b0a04');    // Atas: Jingga merah tembaga gelap pekat
      grd.addColorStop(0.20, '#5c1507'); // Merah marun pekat
      grd.addColorStop(0.42, '#781d08'); // Oranye merah pijar
      grd.addColorStop(0.65, '#9a3412'); // Tembaga membara
      grd.addColorStop(0.85, '#ea580c'); // Jingga terang magma
      grd.addColorStop(1, '#c2410c');    // Pijar dasar tembaga jurang
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);

      // 2. Lapisan Samudra Fluida Logam Cair Halus (Smooth Molten Metal Fluid Waves)
      const coreTiers = [
        { baseY: h * 0.52, amp: 14, speed: 0.022, freq: 0.007, col: 'rgba(234, 88, 12, 0.40)' },
        { baseY: h * 0.68, amp: 18, speed: 0.030, freq: 0.009, col: 'rgba(245, 158, 11, 0.45)' },
        { baseY: h * 0.82, amp: 22, speed: 0.038, freq: 0.012, col: 'rgba(234, 88, 12, 0.35)' },
      ];

      for (let tIdx = 0; tIdx < coreTiers.length; tIdx++) {
        const tier = coreTiers[tIdx];
        const tierP = camX * (0.05 + tIdx * 0.03);

        ctx.fillStyle = tier.col;
        ctx.beginPath();
        ctx.moveTo(0, h);
        for (let bx = 0; bx <= w + 20; bx += 20) {
          const waveY = tier.baseY +
            Math.sin(frame * tier.speed + (bx - tierP) * tier.freq) * tier.amp +
            Math.cos(frame * (tier.speed * 1.5) + (bx - tierP) * (tier.freq * 2.0)) * (tier.amp * 0.35);
          ctx.lineTo(bx, waveY);
        }
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();
      }

      // 3. ASAP TERMAL MAGMA GELAP ORGANIK (100% BEBAS BENTUK BULAT / CIRCLE)
      // Lapis A: Kabut Asap Tebal Bergulung di Bagian Bawah & Tengah (Rolling Low Fog)
      const smokeBanksIC = [
        { baseY: h * 0.74, amp: 24, speed: 0.011, alpha: 0.20, color: '50, 14, 8' },
        { baseY: h * 0.52, amp: 32, speed: 0.008, alpha: 0.16, color: '68, 20, 10' },
        { baseY: h * 0.30, amp: 36, speed: 0.006, alpha: 0.13, color: '40, 10, 6' },
      ];

      for (let sIdx = 0; sIdx < smokeBanksIC.length; sIdx++) {
        const sb = smokeBanksIC[sIdx];
        const sP = camX * (0.04 + sIdx * 0.03);

        ctx.fillStyle = `rgba(${sb.color}, ${sb.alpha})`;
        ctx.beginPath();
        ctx.moveTo(0, h);

        const startY = sb.baseY + Math.sin(frame * sb.speed - sP * 0.006) * sb.amp;
        ctx.lineTo(0, startY);

        for (let bx = 0; bx <= w + 40; bx += 30) {
          const t1 = frame * sb.speed + (bx - sP) * 0.007;
          const t2 = frame * (sb.speed * 1.6) + (bx - sP) * 0.013;
          const t3 = frame * (sb.speed * 0.6) + (bx - sP) * 0.003;
          const waveY = sb.baseY +
            Math.sin(t1) * sb.amp +
            Math.cos(t2) * (sb.amp * 0.45) +
            Math.sin(t3) * (sb.amp * 0.3);

          const prevX = Math.max(0, bx - 30);
          const cpX = (prevX + bx) / 2;
          ctx.quadraticCurveTo(cpX, waveY + Math.sin(t2) * 6, bx, waveY);
        }

        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();
      }

      // Lapis B: Gumpalan Kepulan Asap Vertikal Naik (Organic Rising Billows)
      for (let smk = 0; smk < 5; smk++) {
        const seed = smk * 97 + 23;
        const driftSpeed = 0.35 + (smk % 3) * 0.15;
        const riseSpeed = 0.50 + (smk % 2) * 0.2;
        const loopH = h * 1.2;

        const smkY = ((h - (frame * riseSpeed + seed * 23) % loopH) + loopH) % loopH - (h * 0.1);
        const sway = Math.sin(frame * 0.015 * driftSpeed + smk * 1.8) * 45;
        const smkX = (((seed * 73 + sway - camX * 0.12) % (w + 160) + (w + 160)) % (w + 160)) - 80;

        const altitudeNorm = Math.max(0, Math.min(1, 1 - (smkY / h)));
        const billowW = 45 + altitudeNorm * 75;
        const billowH = 55 + altitudeNorm * 65;
        const smokeAlpha = Math.sin(altitudeNorm * Math.PI) * 0.15;

        if (smokeAlpha > 0.01) {
          const billowGrd = ctx.createRadialGradient(smkX, smkY, 6, smkX, smkY, billowW);
          billowGrd.addColorStop(0, `rgba(80, 22, 12, ${smokeAlpha})`);
          billowGrd.addColorStop(0.45, `rgba(55, 14, 8, ${smokeAlpha * 0.7})`);
          billowGrd.addColorStop(0.8, `rgba(35, 8, 6, ${smokeAlpha * 0.3})`);
          billowGrd.addColorStop(1, 'rgba(20, 5, 4, 0)');

          ctx.fillStyle = billowGrd;
          ctx.beginPath();
          const points = 7;
          for (let pt = 0; pt <= points; pt++) {
            const angle = (pt / points) * Math.PI * 2;
            const radiusMod = 1 + Math.sin(angle * 3 + frame * 0.03 + seed) * 0.28 +
              Math.cos(angle * 2 + seed * 0.5) * 0.18;
            const px = smkX + Math.cos(angle) * (billowW * radiusMod);
            const py = smkY + Math.sin(angle) * (billowH * radiusMod);
            if (pt === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
        }
      }

      // Floating Embers & Logam Pijar Partikel
      for (let eb = 0; eb < 20; eb++) {
        const seedEb = (eb * 79 + 31);
        const ex = ((seedEb * 43 - camX * 0.12) % w + w) % w;
        const progress = ((frame * 0.5 + seedEb * 17) % 260) / 260;
        const ey = h * 0.98 - progress * (h * 0.9);
        const sway = Math.sin(frame * 0.04 + seedEb) * 14;
        const emberAlpha = Math.sin(progress * Math.PI) * 0.8;

        if (eb % 3 === 0) {
          ctx.fillStyle = `rgba(254, 240, 138, ${emberAlpha})`;
          ctx.fillRect(Math.round(ex + sway), Math.round(ey), 2, 2);
        } else {
          ctx.fillStyle = `rgba(249, 115, 22, ${emberAlpha * 0.7})`;
          ctx.fillRect(Math.round(ex + sway), Math.round(ey), 1.5, 1.5);
        }
      }

      // 4. Pendaran Radiasi Termal Ambien Kental Gelap (Deep Molten Incandescent Glow)
      const coreWarmth = Math.sin(frame * 0.03) * 0.03 + 0.10;
      ctx.fillStyle = `rgba(234, 88, 12, ${coreWarmth})`;
      ctx.fillRect(0, 0, w, h);
      break;
    }

    case 'divergent': {
      // ══════════════════════════════════════════════════════════════════════
      // BATAS DIVERGEN: LAUTAN LUAS (OCEANIC DIVERGENT RIFT & MID-OCEAN RIDGE)
      // Karakteristik: Gradien biru lautan dari permukaan cerah di atas menuju
      // kedalaman samudra pekat di bawah, riak gelombang permukaan air, berkas
      // cahaya matahari (sunbeams/caustics) menembus air, dan gelembung melayang.
      // ══════════════════════════════════════════════════════════════════════

      // 1. Gradien Lautan Penuh (Full Ocean Gradient: Biru Cerah Atas -> Biru Safir Pekat Bawah)
      const oceanGrad = ctx.createLinearGradient(0, 0, 0, h);
      oceanGrad.addColorStop(0, '#0ea5e9');    // Biru muda cerah permukaan laut
      oceanGrad.addColorStop(0.08, '#0284c7'); // Biru laut tropis jernih
      oceanGrad.addColorStop(0.25, '#0369a1'); // Biru laut sedang
      oceanGrad.addColorStop(0.50, '#075985'); // Biru laut dalam
      oceanGrad.addColorStop(0.75, '#0c4a6e'); // Biru samudra safir pekat
      oceanGrad.addColorStop(1, '#082f49');    // Dasar samudra abisal
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. Permukaan Air Bergelombang Lembut di Bagian Paling Atas (y = 0 .. 16)
      ctx.save();
      const waveGrad = ctx.createLinearGradient(0, 0, 0, 18);
      waveGrad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
      waveGrad.addColorStop(0.3, 'rgba(186, 230, 253, 0.5)');
      waveGrad.addColorStop(1, 'rgba(14, 165, 233, 0)');
      ctx.fillStyle = waveGrad;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      for (let wx = 0; wx <= w; wx += 8) {
        const wy = 4 + Math.sin(frame * 0.05 + wx * 0.04) * 3 + Math.cos(frame * 0.03 + wx * 0.08) * 1.5;
        ctx.lineTo(wx, wy);
      }
      ctx.lineTo(w, 0);
      ctx.closePath();
      ctx.fill();

      // Garis buih putih puncak gelombang
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let wx = 0; wx <= w; wx += 6) {
        const wy = 3 + Math.sin(frame * 0.05 + wx * 0.04) * 2.5;
        if (wx === 0) ctx.moveTo(wx, wy);
        else ctx.lineTo(wx, wy);
      }
      ctx.stroke();
      ctx.restore();

      // 3. Berkas Cahaya Matahari (Sunbeams / Underwater God Rays) Menembus Air
      ctx.save();
      for (let r = 0; r < 7; r++) {
        const raySeed = r * 160;
        const rayX = ((raySeed - (camX * 0.03) + Math.sin(frame * 0.012 + r) * 25) % (w + 200)) - 100;
        const rayGrad = ctx.createLinearGradient(rayX, 0, rayX + 70, h * 0.8);
        rayGrad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
        rayGrad.addColorStop(0.3, 'rgba(186, 230, 253, 0.08)');
        rayGrad.addColorStop(0.7, 'rgba(56, 189, 248, 0.03)');
        rayGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');

        ctx.fillStyle = rayGrad;
        ctx.beginPath();
        ctx.moveTo(rayX - 10, 0);
        ctx.lineTo(rayX + 35, 0);
        ctx.lineTo(rayX + 110, h * 0.75);
        ctx.lineTo(rayX + 45, h * 0.75);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // 4. Partikel Gelembung Udara Lautan Melayang Perlahan Naik
      ctx.save();
      for (let b = 0; b < 24; b++) {
        const bProg = ((frame * 0.4 + b * 45) % 360) / 360;
        const bx = ((b * 55 + Math.sin(frame * 0.03 + b) * 16 - camX * 0.05) % (w + 80) + w + 80) % (w + 80) - 40;
        const by = h * 0.9 - bProg * (h * 0.85);
        const bAlpha = Math.sin(bProg * Math.PI) * 0.45;
        const bSize = (b % 3 === 0) ? 2.5 : 1.5;
        ctx.fillStyle = `rgba(224, 242, 254, ${bAlpha})`;
        ctx.beginPath();
        ctx.arc(bx, by, bSize, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      break;
    }

    case 'convergent': {
      // ══════════════════════════════════════════════════════════════════════
      // BATAS KONVERGEN: PESISIR SUBDUKSI SAMUDRA & BUSUR VULKANIK MERAPI
      // Karakteristik: Langit tropis cerah membiru, matahari bersinar hangat
      // di kiri atas, awan pixel bergulir, dan siluet megah barisan gunung api.
      // ══════════════════════════════════════════════════════════════════════

      // 1. Gradien Langit Tropis Indonesia yang Cerah & Biru Alami Sesuai Kondisi
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      if (convergentMode === 'land') {
        skyGrad.addColorStop(0, '#0284c7');    // Sky blue tropis pekat di zenit
        skyGrad.addColorStop(0.35, '#38bdf8'); // Clear azure
        skyGrad.addColorStop(0.70, '#7dd3fc'); // Sky haze di atas barisan gunung
        skyGrad.addColorStop(1, '#ffedd5');    // Horizon hangat daratan vulkanik
      } else {
        skyGrad.addColorStop(0, '#0369a1');    // Sky blue pesisir
        skyGrad.addColorStop(0.35, '#0ea5e9'); // Biru laut cerah
        skyGrad.addColorStop(0.70, '#7dd3fc'); // Kabut laut
        skyGrad.addColorStop(1, '#bae6fd');    // Horizon samudra
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. Matahari Tropis Bersinar Megah di Kiri Atas (Persis seperti Screenshot 1)
      const sunX = 110 - (camX * 0.015) % 60;
      const sunY = 54;

      // Halo korona matahari bertingkat
      const sunHalo = ctx.createRadialGradient(sunX, sunY, 8, sunX, sunY, 85);
      sunHalo.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      sunHalo.addColorStop(0.22, 'rgba(254, 240, 138, 0.65)');
      sunHalo.addColorStop(0.50, 'rgba(253, 224, 71, 0.22)');
      sunHalo.addColorStop(0.85, 'rgba(254, 215, 170, 0.08)');
      sunHalo.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = sunHalo;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 85, 0, Math.PI * 2);
      ctx.fill();

      // Piringan inti matahari bercahaya kuning-putih
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(sunX, sunY, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(sunX, sunY, 14, 0, Math.PI * 2);
      ctx.fill();

      // Sinar-sinar korona matahari halus yang berputar lembut
      ctx.save();
      ctx.translate(sunX, sunY);
      ctx.rotate(frame * 0.0025);
      ctx.fillStyle = 'rgba(254, 240, 138, 0.14)';
      for (let s = 0; s < 8; s++) {
        ctx.rotate((Math.PI * 2) / 8);
        ctx.beginPath();
        ctx.moveTo(-10, 0);
        ctx.lineTo(0, -135);
        ctx.lineTo(10, 0);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // 3. Awan Pixel Tropis Bergulir Alami (Parallax Ringan)
      const c1X = ((frame * 0.16 - camX * 0.035) % (w + 320) + (w + 320)) % (w + 320) - 160;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
      ctx.fillRect(c1X, 48, 88, 14);
      ctx.fillRect(c1X + 14, 38, 58, 14);
      ctx.fillRect(c1X + 28, 32, 30, 10);
      ctx.fillStyle = 'rgba(224, 242, 254, 0.45)';
      ctx.fillRect(c1X + 8, 58, 72, 4);

      const c2X = ((frame * 0.1 - camX * 0.02 + 420) % (w + 320) + (w + 320)) % (w + 320) - 160;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.80)';
      ctx.fillRect(c2X, 72, 105, 15);
      ctx.fillRect(c2X + 20, 62, 65, 14);
      ctx.fillRect(c2X + 38, 56, 30, 8);

      // 4. LATAR BELAKANG: GUNUNG API DARATAN (MODE LAND) ATAU HORIZON SAMUDRA LEPAS (MODE OCEAN)
      if (convergentMode === 'land') {
        // BARISAN PEGUNUNGAN VULKANIK JAUH (Far Mountain Silhouettes - Parallax 0.05)
        const farP = camX * 0.05;
        const farSpan = 900;
        const farBaseX = -((farP % farSpan + farSpan) % farSpan);

        for (let rep = -1; rep < Math.ceil(w / farSpan) + 2; rep++) {
          const ox = farBaseX + rep * farSpan;

          // Puncak Gunung Vulkanik Jauh 1 (Tinggi di Tengah)
          ctx.fillStyle = '#64748b'; // Abu-abu andesit atmosferik jauh
          ctx.beginPath();
          ctx.moveTo(ox - 80, h * 0.72);
          ctx.lineTo(ox + 160, h * 0.42);
          ctx.lineTo(ox + 340, h * 0.24); // Puncak kawah
          ctx.lineTo(ox + 370, h * 0.25);
          ctx.lineTo(ox + 520, h * 0.46);
          ctx.lineTo(ox + 720, h * 0.72);
          ctx.closePath();
          ctx.fill();

          // Kepulan Asap Fumarol / Solfatara Vulkanik Halus di Puncak (Organik & Lembut)
          for (let ap = 0; ap < 6; ap++) {
            const aProg = ((frame * 0.035 + ap * (1 / 6)) % 1);
            const apx = ox + 355 + aProg * 35 + Math.sin(frame * 0.03 + ap * 1.2) * (4 + aProg * 8);
            const apy = h * 0.24 - 6 - aProg * 55;
            const apr = 6 + aProg * 18;
            const aAlpha = Math.max(0, (aProg < 0.15 ? aProg / 0.15 : (1 - aProg)) * 0.50);
            if (aAlpha <= 0.02) continue;

            const lobes = 5;
            for (let l = 0; l < lobes; l++) {
              const angle = (l * Math.PI * 2) / lobes + Math.sin(frame * 0.02 + ap + l) * 0.3;
              const dist = apr * 0.35;
              const lx = apx + Math.cos(angle) * dist;
              const ly = apy + Math.sin(angle) * dist * 0.85;
              const lr = apr * (0.6 + Math.sin(ap * 2 + l) * 0.15);

              const fGrad = ctx.createRadialGradient(lx - lr * 0.2, ly - lr * 0.2, lr * 0.1, lx, ly, lr);
              fGrad.addColorStop(0, `rgba(255, 255, 255, ${aAlpha})`);
              fGrad.addColorStop(0.5, `rgba(241, 245, 249, ${aAlpha * 0.8})`);
              fGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

              ctx.fillStyle = fGrad;
              ctx.beginPath();
              ctx.arc(lx, ly, lr, 0, Math.PI * 2);
              ctx.fill();
            }
          }

          // Puncak Gunung Vulkanik Sebelah Kanan (Secondary Ridge)
          ctx.fillStyle = '#475569';
          ctx.beginPath();
          ctx.moveTo(ox + 390, h * 0.72);
          ctx.lineTo(ox + 560, h * 0.38);
          ctx.lineTo(ox + 690, h * 0.28);
          ctx.lineTo(ox + 720, h * 0.29);
          ctx.lineTo(ox + 880, h * 0.50);
          ctx.lineTo(ox + 1040, h * 0.72);
          ctx.closePath();
          ctx.fill();
        }

        // PERBUKITAN TEKTONIK MENENGAH (Mid Foothills Ridge - Parallax 0.11)
        const midP = camX * 0.11;
        const midSpan = 700;
        const midBaseX = -((midP % midSpan + midSpan) % midSpan);

        for (let rep = -1; rep < Math.ceil(w / midSpan) + 2; rep++) {
          const mx = midBaseX + rep * midSpan;
          ctx.fillStyle = '#334155'; // Abu-abu gelap lereng bukit
          ctx.beginPath();
          ctx.moveTo(mx - 40, h * 0.78);
          ctx.lineTo(mx + 110, h * 0.56);
          ctx.lineTo(mx + 250, h * 0.44);
          ctx.lineTo(mx + 420, h * 0.58);
          ctx.lineTo(mx + 560, h * 0.48);
          ctx.lineTo(mx + 740, h * 0.78);
          ctx.closePath();
          ctx.fill();
        }
      } else {
        // MODE LAUTAN: HORIZON SAMUDRA TROPIS LEPAS & KEPULAUAN KARANG RENDAH DI KEJAUHAN
        const oceanSeaY = 310;

        // Horizon air laut jauh (gradasi laut tenang membiru di kejauhan)
        const distSeaGrad = ctx.createLinearGradient(0, 160, 0, oceanSeaY);
        distSeaGrad.addColorStop(0, 'rgba(14, 165, 233, 0.40)');
        distSeaGrad.addColorStop(0.5, 'rgba(2, 132, 199, 0.65)');
        distSeaGrad.addColorStop(1, 'rgba(3, 105, 161, 0.88)');
        ctx.fillStyle = distSeaGrad;
        ctx.fillRect(0, 190, w, oceanSeaY - 190);

        // Siluet Kepulauan Karang Atol Rendah di Horison Jauh (Parallax 0.04, tinggi sangat rendah)
        const islandP = camX * 0.04;
        const islSpan = 850;
        const islBaseX = -((islandP % islSpan + islSpan) % islSpan);
        for (let rep = -1; rep < Math.ceil(w / islSpan) + 2; rep++) {
          const ix = islBaseX + rep * islSpan;
          ctx.fillStyle = '#1e293b'; // Siluet navy gelap lembut
          ctx.beginPath();
          ctx.moveTo(ix - 60, oceanSeaY);
          ctx.lineTo(ix + 40, oceanSeaY - 18);
          ctx.lineTo(ix + 120, oceanSeaY - 24);
          ctx.lineTo(ix + 190, oceanSeaY - 12);
          ctx.lineTo(ix + 280, oceanSeaY);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#334155';
          ctx.beginPath();
          ctx.moveTo(ix + 340, oceanSeaY);
          ctx.lineTo(ix + 420, oceanSeaY - 14);
          ctx.lineTo(ix + 510, oceanSeaY - 20);
          ctx.lineTo(ix + 600, oceanSeaY);
          ctx.closePath();
          ctx.fill();
        }

        // Burung camar pesisir pixel putih terbang anggun di angkasa
        const gulls = [
          { bx: 180, by: 110, spd: 0.28 },
          { bx: 460, by: 90, spd: 0.32 },
          { bx: 820, by: 130, spd: 0.25 },
          { bx: 1180, by: 105, spd: 0.30 },
        ];
        for (const gull of gulls) {
          const gx = ((gull.bx + frame * gull.spd - camX * 0.08) % (w + 200) + (w + 200)) % (w + 200) - 100;
          const flap = Math.sin(frame * 0.15 + gull.bx) * 2.5;
          const gy = gull.by + Math.sin(frame * 0.03 + gull.bx) * 4;
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(gx - 6, gy + flap);
          ctx.lineTo(gx, gy);
          ctx.lineTo(gx + 6, gy + flap);
          ctx.stroke();
        }

        // Kabut pesisir atmosferik lembut di atas garis laut
        const mistGrad = ctx.createLinearGradient(0, 180, 0, oceanSeaY);
        mistGrad.addColorStop(0, 'rgba(186, 230, 253, 0)');
        mistGrad.addColorStop(0.7, 'rgba(224, 242, 254, 0.25)');
        mistGrad.addColorStop(1, 'rgba(240, 249, 255, 0.50)');
        ctx.fillStyle = mistGrad;
        ctx.fillRect(0, 180, w, oceanSeaY - 180);
      }
      break;
    }

    case 'transform': {
      // ══════════════════════════════════════════════════════════════════════
      // BATAS TRANSFORM: GURUN SESAR SAN ANDREAS (TOP-DOWN BIRD'S-EYE VIEW)
      // Karakteristik: Pandangan dari udara/satelit atas dataran gurun gersang
      // bergelombang hangat, gradien pasir keemasan, distorsi gelombang panas.
      // ══════════════════════════════════════════════════════════════════════
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#78350f');   // Amber cokelat gurun utara
      bgGrad.addColorStop(0.3, '#92400e'); // Cokelat keemasan hangat
      bgGrad.addColorStop(0.5, '#b45309'); // Patahan tengah
      bgGrad.addColorStop(0.7, '#d97706'); // Emas gurun
      bgGrad.addColorStop(1, '#92400e');   // Gurun selatan
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Gelombang distorsi panas atmosfer gurun (Heat Shimmer)
      ctx.fillStyle = 'rgba(254, 240, 138, 0.04)';
      for (let hy = 0; hy < h; hy += 24) {
        const hShift = Math.sin(frame * 0.05 + hy * 0.08) * 8;
        ctx.fillRect(hShift, hy, w, 12);
      }
      break;
    }
  }
}

// ── Ekspor ulang ──────────────────────────────────────────────────────
// Pemakai lama (renderer.ts, player.ts, gameEngine.ts) mengimpor dari
// berkas ini, sehingga seluruh bagian yang dipindahkan diekspor ulang di
// sini. Dengan begitu tidak ada pemakai yang perlu diubah.
export { TILE, PLAYER_FRAME_W, PLAYER_FRAME_H, drawGroundTile, drawWallTile } from './sprites/konstanta';
export { drawPineTree, drawOakTree, drawShrub } from './sprites/tumbuhan';
export { drawPixelFossil, renderOrganicZoneTerrain, renderZoneStructures, renderOrganicDivergentTerrain } from './sprites/medan-organik';
export { getOceanicSubductingSlabTopY, getOceanicSlabSlope, getConvergentSeafloorProfile, drawPlateVectorArrow, renderConvergentLandMode, renderConvergentOceanMode, renderOrganicConvergentTerrain, renderOrganicTransformTerrain } from './sprites/lempeng-konvergen';
export { drawZoneDecorations, drawPortal, drawCrystal, drawDiscoveryPoint, drawInfoSign, drawChallengeGate, drawResearchBoat } from './sprites/objek';
export { getPlayerSheet } from '../../../../utils/studentAvatarSheet';
export { clearSpriteCache } from '../../../../utils/studentAvatarSheet';
