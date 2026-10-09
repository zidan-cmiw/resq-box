/**
 * Medan Organik (gaya Terraria) — bagian dari mesin gambar Earth Dive.
 *
 * Berkas ini dipecah dari sprites.ts (5.625 baris) agar tiap kelompok dapat
 * dicari tanpa menggulir melewati ribuan baris kode kelompok lain. Isi
 * fungsinya dipindahkan UTUH, tidak ditulis ulang.
 */

import { TILE } from './konstanta';
import type { ZoneConfig, DivergentFish } from '../zones';
import { MAP_WIDTH_PX, getDivergentTerrainElevation, getDivergentMantleY } from '../zones';
import { drawPineTree } from './tumbuhan';
import { drawOakTree } from './tumbuhan';
import { drawShrub } from './tumbuhan';

/**
 * Menggambar fosil purba (Ammonite, Trilobita, Ikan Purba, Tulang Dinosaurus)
 * dengan gaya pixel art autentik pada dinding batu atau strata bawah tanah.
 */
export function drawPixelFossil(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  type: 'ammonite' | 'trilobite' | 'fish' | 'dino_ribs' | 'bone',
  scale: number = 1.0,
  alpha: number = 0.85,
): void {
  ctx.save();
  ctx.globalAlpha = alpha;

  if (type === 'ammonite') {
    // Fosil Amonit Spiral
    const r = Math.round(9 * scale);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = Math.max(1, Math.round(2 * scale));
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(cx - 1, cy, Math.max(2, Math.round(5 * scale)), 0, Math.PI * 1.8);
    ctx.stroke();

    ctx.strokeStyle = '#64748b';
    ctx.beginPath();
    ctx.arc(cx - 1, cy, Math.max(1, Math.round(2.5 * scale)), 0, Math.PI * 1.5);
    ctx.stroke();

    // Guratan rusuk cangkang spiral
    ctx.fillStyle = '#f1f5f9';
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
      const rx = cx + Math.cos(a) * (r - 1);
      const ry = cy + Math.sin(a) * (r - 1);
      ctx.fillRect(Math.round(rx), Math.round(ry), 2, 2);
    }
  } else if (type === 'trilobite') {
    // Fosil Trilobita bertubuh segmen 3 lobus
    const tw = Math.round(14 * scale);
    const th = Math.round(18 * scale);
    // Cephalon (Kepala)
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.arc(cx, cy - th * 0.3, tw * 0.45, Math.PI, 0);
    ctx.fill();

    // Thorax (Segmen dada beruas)
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(cx - tw * 0.35, cy - th * 0.1, tw * 0.7, 2);
    ctx.fillRect(cx - tw * 0.4, cy + th * 0.05, tw * 0.8, 2);
    ctx.fillRect(cx - tw * 0.35, cy + th * 0.2, tw * 0.7, 2);

    // Pygidium (Ekor)
    ctx.fillStyle = '#64748b';
    ctx.fillRect(cx - tw * 0.25, cy + th * 0.35, tw * 0.5, 3);

    // Sumbu tengah (axial lobe)
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(cx - 1, cy - th * 0.35, 2, th * 0.75);
  } else if (type === 'fish') {
    // Kerangka Ikan Purba
    const fw = Math.round(24 * scale);
    // Tengkorak ikan
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.moveTo(cx - fw * 0.45, cy);
    ctx.lineTo(cx - fw * 0.25, cy - 4 * scale);
    ctx.lineTo(cx - fw * 0.2, cy + 4 * scale);
    ctx.closePath();
    ctx.fill();
    // Lubang mata fosil
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(cx - fw * 0.35, cy - 1, 2, 2);

    // Tulang belakang
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(cx - fw * 0.2, cy, fw * 0.55, 2);

    // Duri/tulang rusuk atas dan bawah
    ctx.fillStyle = '#94a3b8';
    for (let i = 0; i < 5; i++) {
      const ribX = cx - fw * 0.15 + i * (3.5 * scale);
      ctx.fillRect(ribX, cy - 3 * scale, 1.5, 3 * scale);
      ctx.fillRect(ribX, cy + 1, 1.5, 3 * scale);
    }
    // Ekor bercabang
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.moveTo(cx + fw * 0.35, cy);
    ctx.lineTo(cx + fw * 0.48, cy - 5 * scale);
    ctx.lineTo(cx + fw * 0.42, cy);
    ctx.lineTo(cx + fw * 0.48, cy + 5 * scale);
    ctx.closePath();
    ctx.fill();
  } else if (type === 'dino_ribs') {
    // Rusuk Dinosaurus / Reptil Purba Terkubur
    const rw = Math.round(22 * scale);
    ctx.fillStyle = '#e2e8f0';
    // Tulang punggung utama
    ctx.fillRect(cx - rw * 0.45, cy - 6 * scale, rw * 0.9, 3);
    // Lengkungan tulang rusuk
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = Math.max(1, Math.round(1.8 * scale));
    for (let r = 0; r < 4; r++) {
      const rx = cx - rw * 0.35 + r * (6 * scale);
      ctx.beginPath();
      ctx.moveTo(rx, cy - 5 * scale);
      ctx.quadraticCurveTo(rx + 4 * scale, cy + 4 * scale, rx - 3 * scale, cy + 9 * scale);
      ctx.stroke();
    }
  } else {
    // Tulang panjang / sendi paha
    const bw = Math.round(20 * scale);
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(cx - bw * 0.35, cy - 1.5, bw * 0.7, 3);
    // Bongkol sendi kiri & kanan
    ctx.beginPath();
    ctx.arc(cx - bw * 0.35, cy - 2, 2.5 * scale, 0, Math.PI * 2);
    ctx.arc(cx - bw * 0.35, cy + 2, 2.5 * scale, 0, Math.PI * 2);
    ctx.arc(cx + bw * 0.35, cy - 2, 2.5 * scale, 0, Math.PI * 2);
    ctx.arc(cx + bw * 0.35, cy + 2, 2.5 * scale, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

export function renderOrganicZoneTerrain(ctx: CanvasRenderingContext2D, zone: ZoneConfig): void {
  const w = zone.cols * TILE;
  const h = Math.max(zone.rows * TILE, 1600);
  const gProf = zone.groundProfile;
  const cProf = zone.ceilingProfile;

  ctx.imageSmoothingEnabled = false;

  // ── A. LANGIT-LANGIT GUA ORGANIK (UNDERGROUND CAIRN & CEILING) ──
  if (cProf && zone.id !== 'surface' && zone.id !== 'divergent' && zone.id !== 'outerCore') {
    let ceilColor = '#1c100b';
    let strataColor = '#2b1912';
    let edgeColor = '#4a2d21';

    if (zone.id === 'mantle') {
      ceilColor = '#120803';
      strataColor = '#241006';
      edgeColor = '#5c1e06';
    } else if (zone.id === 'outerCore') {
      ceilColor = '#2d0905';
      strataColor = '#4d1009';
      edgeColor = '#801c10';
    } else if (zone.id === 'innerCore') {
      ceilColor = '#2d0905';
      strataColor = '#4d1009';
      edgeColor = '#801c10';
    }

    // FONDASI SOLID LANGIT-LANGIT (100% BEBAS CELAH SUB-PIXEL)
    ctx.fillStyle = ceilColor;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    for (let bx = 0; bx < w; bx += 4) {
      ctx.lineTo(bx, cProf[bx] ?? 60);
    }
    ctx.lineTo(w, cProf[w - 1] ?? 60);
    ctx.lineTo(w, 0);
    ctx.closePath();
    ctx.fill();

    const sw = 2.5;
    for (let x = 0; x < w; x += 2) {
      const cY = cProf[x] ?? 60;
      ctx.fillStyle = ceilColor;
      ctx.fillRect(x, 0, sw, cY);

      // Sedimentary horizontal wave banding
      ctx.fillStyle = strataColor;
      const wave = Math.floor(Math.sin(x * 0.05) * 4);
      ctx.fillRect(x, Math.max(0, cY - 18 + wave), sw, 6);

      // Bottom jagged rock edge highlight
      ctx.fillStyle = edgeColor;
      ctx.fillRect(x, cY - 3, sw, 3);
    }

    // Natural Stalactites hanging down at organic intervals
    const stalactiteLocs = [
      { x: 120, h: 22, w: 10 },
      { x: 260, h: 28, w: 12 },
      { x: 440, h: 32, w: 14 },
      { x: 620, h: 24, w: 10 },
      { x: 810, h: 36, w: 16 },
      { x: 990, h: 26, w: 12 },
      { x: 1160, h: 30, w: 14 },
    ];

    for (const st of stalactiteLocs) {
      const topY = cProf[st.x] ?? 60;
      let stColor = '#5c3a2b';
      let stLight = '#8d5b43';
      if (zone.id === 'mantle') {
        stColor = '#3d1606';
        stLight = '#b91c1c';
      } else if (zone.id === 'outerCore') {
        stColor = '#5e1208';
        stLight = '#f59e0b';
      } else if (zone.id === 'innerCore') {
        stColor = '#5e1208';
        stLight = '#ea580c';
      }

      // Base body
      ctx.fillStyle = stColor;
      ctx.beginPath();
      ctx.moveTo(st.x - st.w / 2, topY);
      ctx.lineTo(st.x, topY + st.h);
      ctx.lineTo(st.x + st.w / 2, topY);
      ctx.fill();

      // Specular light facet
      ctx.fillStyle = stLight;
      ctx.beginPath();
      ctx.moveTo(st.x - st.w / 4, topY);
      ctx.lineTo(st.x, topY + st.h);
      ctx.lineTo(st.x, topY);
      ctx.fill();
    }
  }

  // ── B. STRATA GEOLOGI LANTAI & LERENG GUNUNG (GROUND MASS & STRATA) ──
  // FONDASI SOLID DASAR TANAH (100% ELIMINASI CELAH SUB-PIXEL & GARIS-GARIS VERTIKAL)
  let groundBaseColor = '#26201e';
  if (zone.id === 'crust') groundBaseColor = '#1a0d08';
  else if (zone.id === 'mantle') groundBaseColor = '#080201';
  else if (zone.id === 'outerCore') groundBaseColor = '#b45309';
  else if (zone.id === 'innerCore') groundBaseColor = '#120504';

  ctx.fillStyle = groundBaseColor;
  ctx.beginPath();
  ctx.moveTo(0, h);
  for (let bx = 0; bx < w; bx += 4) {
    ctx.lineTo(bx, (gProf[bx] ?? 360));
  }
  ctx.lineTo(w, (gProf[w - 1] ?? 360));
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();

  const sw = 2.5;
  for (let x = 0; x < w; x += 2) {
    const gY = gProf[x] ?? 360;
    const seed = (x * 43) & 0xffff;

    if (zone.id === 'surface') {
      // ── 1. BATUAN DASAR GRANIT MASIF (BEDROCK: gY + 40 -> 480) ──
      ctx.fillStyle = '#26201e';
      ctx.fillRect(x, gY + 40, sw, h - (gY + 40));

      // Lapisan sedimen kuarsa bergelombang kontinu
      ctx.fillStyle = '#38302c';
      const wave1 = Math.floor(Math.sin(x * 0.03) * 6);
      ctx.fillRect(x, gY + 60 + wave1, sw, 8);
      ctx.fillRect(x, gY + 100 - wave1, sw, 7);

      ctx.fillStyle = '#574e48';
      ctx.fillRect(x, gY + 75 + wave1, sw, 3); // Urat kuarsa putih abu

      // Serpihan pirit & mika
      if ((seed % 19) === 0) {
        ctx.fillStyle = '#facc15';
        ctx.fillRect(x, gY + 65 + (seed % 40), sw, 2);
      }

      // ── 2. LAPISAN LEMPUNG & KERIKIL (SUBSOIL: gY + 14 -> gY + 40) ──
      ctx.fillStyle = '#452618';
      ctx.fillRect(x, gY + 14, sw, 26);

      ctx.fillStyle = '#5c3520';
      ctx.fillRect(x, gY + 22 + (seed % 8), sw, 4);

      // Kerikil kecil
      if ((seed % 11) === 0) {
        ctx.fillStyle = '#78350f';
        ctx.fillRect(x, gY + 18 + (seed % 12), sw, 2);
      }

      // ── 3. LAPISAN HUMUS SUBUR (TOPSOIL: gY -> gY + 14) ──
      ctx.fillStyle = '#26140b';
      ctx.fillRect(x, gY, sw, 14);

      // Akar halus gantung menembus ke dalam tanah (Terraria feel!)
      if ((seed % 9) === 0) {
        ctx.fillStyle = '#3e2215';
        ctx.fillRect(x, gY + 2, 1, 6 + (seed % 5));
      }

      // ── 4. RUMPUT LERENG MULTILAPIS (TURF FLEKSIBEL MENGIKUTI KONTUR GUNUNG) ──
      // Lapisan 1: Hijau pekat dasar
      ctx.fillStyle = '#14532d';
      ctx.fillRect(x, gY - 1, sw, 4);

      // Lapisan 2: Hijau hutan subur
      ctx.fillStyle = '#15803d';
      ctx.fillRect(x, gY - 2, sw, 3);

      // Lapisan 3: Hijau zamrud cerah
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(x, gY - 3, sw, 2);

      // Lapisan 4: Pucuk rumput terkena sinar matahari
      ctx.fillStyle = '#86efac';
      ctx.fillRect(x, gY - 4, 1, 2);

      // Helai rumput mikro individu berdiri di atas lereng
      const bladeH = 2 + (seed % 4);
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(x + 1, gY - 4 - bladeH, 1, bladeH);

      // Bunga liar padang rumput & pegunungan
      if ((seed % 47) === 0) {
        ctx.fillStyle = '#facc15'; // Bunga mentega kuning
        ctx.fillRect(x, gY - 6, sw, 2);
      } else if ((seed % 53) === 0) {
        ctx.fillStyle = '#ffffff'; // Daisy putih
        ctx.fillRect(x, gY - 6, sw, 2);
      } else if ((seed % 71) === 0) {
        ctx.fillStyle = '#38bdf8'; // Gentian biru pegunungan
        ctx.fillRect(x, gY - 6, sw, 2);
      }

    } else if (zone.id === 'crust') {
      // ── KERAK BUMI / LITOSFER (BATUAN SEDIMEN, METAMORF & SINGKAPAN MOHO) ──
      ctx.fillStyle = '#1a0d08';
      ctx.fillRect(x, gY + 28, sw, h - (gY + 28));

      ctx.fillStyle = '#2f1810';
      ctx.fillRect(x, gY + 8, sw, 20);

      ctx.fillStyle = '#4a281a';
      ctx.fillRect(x, gY, sw, 8);

      // Garis patahan strata tektonik bergelombang
      const faultWave = Math.floor(Math.sin(x * 0.035) * 5);
      ctx.fillStyle = '#6e3c28';
      ctx.fillRect(x, gY + 16 + faultWave, sw, 3);

      // Urat kuarsa putih & pirit emas
      if ((seed % 19) === 0) {
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(x, gY + 10 + (seed % 20), sw, 2);
      } else if ((seed % 37) === 0) {
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(x, gY + 4 + (seed % 10), sw, 2);
      }

      // Garis Diskontinuitas Mohorovičić (Batas Moho) di kedalaman
      ctx.fillStyle = 'rgba(249, 115, 22, 0.35)';
      ctx.fillRect(x, gY + 65 + faultWave, sw, 3);

    } else if (zone.id === 'mantle') {
      // ── MANTEL BAWAH BUMI: BATUAN SILIKAT BRIDGMANITE & SUNGAI MAGMA KENTAL ──
      const magmaLevel = 360;
      const inBasin = (x >= 310 && x <= 635) || (x >= 770 && x <= 1075);

      if (inBasin && gY > magmaLevel) {
        // Dasar jurang batuan silikat di bawah aliran magma
        ctx.fillStyle = '#080201';
        ctx.fillRect(x, gY, sw, h - gY);

        // Sungai magma kental membara mengisi jurang dari magmaLevel ke dasar
        const magH = gY - magmaLevel;
        const magGrad = ctx.createLinearGradient(0, magmaLevel, 0, gY);
        magGrad.addColorStop(0, '#ffffff'); // Pijar putih keemasan permukaan
        magGrad.addColorStop(0.15, '#fef08a'); // Kuning magma panas
        magGrad.addColorStop(0.48, '#f97316'); // Oranye membara
        magGrad.addColorStop(0.82, '#dc2626'); // Merah kental
        magGrad.addColorStop(1, '#5a0c04');   // Dasar kental pekat
        ctx.fillStyle = magGrad;
        ctx.fillRect(x, magmaLevel, sw, magH);

        // Kerak silikat kaku yang terapung di aliran magma kental
        if ((seed % 11) === 0 && x % 6 === 0) {
          ctx.fillStyle = '#1c0402';
          ctx.fillRect(x, magmaLevel + 1, 5, 2);
        }

        // Garis riak permukaan magma menyala
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x, magmaLevel, 2, 1);

      } else {
        // Tebing batuan silikat Bridgmanite & Ferropericlase padat dan kokoh seperti beton
        ctx.fillStyle = '#0c0201';
        ctx.fillRect(x, gY + 24, sw, h - (gY + 24)); // Batuan dalam terkompresi jutaan atmosfer

        ctx.fillStyle = '#1e0503';
        ctx.fillRect(x, gY + 8, sw, 16); // Strata silikat marun pekat

        ctx.fillStyle = '#3a0904';
        ctx.fillRect(x, gY, sw, 8); // Permukaan atas tebing batu kaku

        // Bibir tebing di sekitar jurang magma berpendar merah-jingga panas
        if (inBasin || Math.abs(gY - magmaLevel) < 22) {
          ctx.fillStyle = '#ea580c';
          ctx.fillRect(x, gY - 1, sw, 2);
          ctx.fillStyle = '#f97316';
          ctx.fillRect(x, gY - 2, sw, 1);
        } else {
          // Tepian teras batuan silikat terpapar panas
          ctx.fillStyle = '#5a0d05';
          ctx.fillRect(x, gY - 1, sw, 1);
        }

        // Bintik kristal mineral silikat Bridgmanite berkilau di bawah tekanan
        if ((seed % 15) === 0) {
          ctx.fillStyle = '#f87171';
          ctx.fillRect(x, gY + 4 + (seed % 14), 2, 2);
          ctx.fillStyle = '#fb923c';
          ctx.fillRect(x + 1, gY + 5 + (seed % 14), 1, 1);
        }

        // Retakan magma panas membara di sela-sela lantai batu yang kaku
        if ((seed % 23) === 0) {
          ctx.fillStyle = '#ea580c';
          ctx.fillRect(x, gY + 2, 2, 4);
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(x, gY + 3, 1, 2);
        }
      }

    } else if (zone.id === 'outerCore') {
      // ── INTI LUAR: KONDISI KUNING MATAHARI SEPERTI INTI DALAM SEBELUMNYA (+EFEK MAGNET & LISTRIK) ──
      // Permukaan datar bola besi-nikel padat kuning emas bercahaya sepanas matahari 5.000°C
      // Dasar logam terkompresi kuat
      ctx.fillStyle = '#b45309';
      ctx.fillRect(x, gY + 28, sw, h - (gY + 28));

      // Badan bola besi-nikel padat kuning keemasan
      ctx.fillStyle = '#d97706';
      ctx.fillRect(x, gY + 12, sw, 16);

      // Lapisan kuning emas cerah
      ctx.fillStyle = '#eab308';
      ctx.fillRect(x, gY + 4, sw, 8);

      // Permukaan teratas kuning matahari menyala terang
      ctx.fillStyle = '#facc15';
      ctx.fillRect(x, gY, sw, 4);

      // Bibir permukaan atas berpendar kuning-putih berkilau matahari
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(x, gY - 1, sw, 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x, gY - 2, sw, 1);

      // Kilau partikel logam emas bersinar di permukaan
      if ((seed % 17) === 0) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x, gY - 3, 2, 2);
      } else if ((seed % 23) === 0) {
        ctx.fillStyle = '#fde047';
        ctx.fillRect(x, gY + 6 + (seed % 10), 2, 2);
      }

      // ── EFEK LISTRIK & DINAMO MEDAN MAGNET BUMI (TETAP DI INTI LUAR) ──
      // Urat energi listrik konduktif biru-cyan dinamo di pelat padat kuning emas
      if ((seed % 11) === 0) {
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(x, gY + 3 + (seed % 10), 2, 2);
        ctx.fillStyle = '#bae6fd';
        ctx.fillRect(x + 1, gY + 4 + (seed % 10), 1, 1);
      }

      // Retakan plasma elektromagnetik dinamo
      if ((seed % 19) === 0) {
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(x, gY + 2, 2, 4);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x, gY + 3, 1, 2);
      }

    } else if (zone.id === 'innerCore') {
      // ── INTI DALAM: KONDISI AGAK GELAP TANAH & MAGMANYA SEPERTI INTI LUAR SEBELUMNYA ──
      const metalLevel = 360;
      const inBasin = (x >= 390 && x <= 570) || (x >= 790 && x <= 970);

      if (inBasin && gY > metalLevel) {
        // Dasar jurang di bawah samudra logam cair agak gelap
        ctx.fillStyle = '#0f0403';
        ctx.fillRect(x, gY, sw, h - gY);

        // Samudra magma/logam cair nikel-besi mendidih menyala agak gelap kemerahan (seperti Inti Luar sebelumnya)
        const metH = gY - metalLevel;
        const dynGrad = ctx.createLinearGradient(0, metalLevel, 0, gY);
        dynGrad.addColorStop(0, '#ffffff'); // Pijar putih menyilaukan
        dynGrad.addColorStop(0.18, '#fef08a'); // Kuning logam cair membara
        dynGrad.addColorStop(0.45, '#f59e0b'); // Emas oranye pijar
        dynGrad.addColorStop(0.72, '#ea580c'); // Jingga termal bergolak
        dynGrad.addColorStop(1, '#7c1d06');   // Dasar logam kental pekat gelap
        ctx.fillStyle = dynGrad;
        ctx.fillRect(x, metalLevel, sw, metH);

        // Kerak pelat logam padat gelap yang mengapung di permukaan fluida berpusar
        if ((seed % 13) === 0 && x % 8 === 0) {
          ctx.fillStyle = '#1e0503';
          ctx.fillRect(x, metalLevel + 1, 6, 2);
        }

        // Garis riak permukaan logam cair menyilaukan
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x, metalLevel, sw, 1);

        // Percikan lahar pijar di permukaan samudra magma
        if ((seed % 29) === 0) {
          ctx.fillStyle = '#fb923c';
          ctx.fillRect(x, metalLevel - 1, 2, 2);
        }

      } else {
        // Pelat tanah agak gelap terkompresi kuat (seperti kondisi Inti Luar sebelumnya)
        ctx.fillStyle = '#120504';
        ctx.fillRect(x, gY + 24, sw, h - (gY + 24)); // Lapisan logam dalam pekat

        ctx.fillStyle = '#220b08';
        ctx.fillRect(x, gY + 8, sw, 16); // Badan pelat logam besi padat gelap

        ctx.fillStyle = '#3d140e';
        ctx.fillRect(x, gY, sw, 8); // Permukaan atas bongkahan tempat berpijak

        // Bibir pelat logam di tepi jurang magma berpendar panas tembaga-jingga
        if (inBasin || Math.abs(gY - metalLevel) < 22) {
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(x, gY - 1, sw, 2);
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(x, gY - 2, sw, 1);
        } else {
          // Kilau tepi pelat logam feromagnetik
          ctx.fillStyle = '#5c2217';
          ctx.fillRect(x, gY - 1, sw, 1);
        }

        // Urat bara panas di celah batuan gelap
        if ((seed % 17) === 0) {
          ctx.fillStyle = '#ea580c';
          ctx.fillRect(x, gY + 3 + (seed % 12), 2, 2);
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(x + 1, gY + 4 + (seed % 12), 1, 1);
        }

        // Retakan panas magma pekat
        if ((seed % 23) === 0) {
          ctx.fillStyle = '#ea580c';
          ctx.fillRect(x, gY + 2, 2, 4);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x, gY + 3, 1, 2);
        }
      }
    } else if (zone.id === 'divergent') {
      // ── BATAS DIVERGEN & LEMBAH RETAKAN (EAST AFRICAN RIFT / SUPERBENUA PANGEA) ──
      // 6 celah jurang dari ground profile: Jurang aktif (3) + celah beku (3)
      // Jurang aktif: 268-342, 950-1030, 1675-1745
      // Celah beku:   605-675, 1315-1385, 1975-2035
      const chasmRanges: [number, number][] = [
        [268, 342], [605, 675], [950, 1030],
        [1315, 1385], [1675, 1745], [1975, 2035],
      ];
      const inChasm = chasmRanges.some(([lo, hi]) => x >= lo && x <= hi);
      // Magma mengisi penuh dari bibir tebing (y~370) sampai dasar jurang (y~455)
      const magmaTopY = 375; // Permukaan lava tepat di bawah bibir tebing

      if (inChasm && gY > magmaTopY) {
        // Dasar jurang di bawah aliran magma
        ctx.fillStyle = '#0a0302';
        ctx.fillRect(x, gY, 2, h - gY);

        // Magma pijar naik dari mantel bumi mengisi penuh celah retakan
        const magH = gY - magmaTopY;
        const magGrad = ctx.createLinearGradient(0, magmaTopY, 0, gY);
        magGrad.addColorStop(0, '#ffffff');   // Permukaan pijar menyilaukan
        magGrad.addColorStop(0.08, '#fef08a'); // Kuning panas menyala
        magGrad.addColorStop(0.25, '#fb923c'); // Oranye cerah lava cair
        magGrad.addColorStop(0.50, '#f97316'); // Oranye membara
        magGrad.addColorStop(0.75, '#dc2626'); // Merah magma kental
        magGrad.addColorStop(1, '#450a0a');    // Dasar magma pekat
        ctx.fillStyle = magGrad;
        ctx.fillRect(x, magmaTopY, 2, magH);

        // Garis permukaan magma menyala terang murni tanpa serpihan/kerak
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x, magmaTopY, 2, 2);
        // Glow permukaan lava
        ctx.fillStyle = 'rgba(254, 240, 138, 0.5)';
        ctx.fillRect(x, magmaTopY - 2, 2, 3);
      } else if (inChasm) {
        // Area transisi dinding jurang yang mendekati bibir lava
        ctx.fillStyle = '#09090b';
        ctx.fillRect(x, gY + 16, 2, h - (gY + 16));
        ctx.fillStyle = '#18181b';
        ctx.fillRect(x, gY + 6, 2, 10);
        ctx.fillStyle = '#27272a';
        ctx.fillRect(x, gY, 2, 6);
        // Bibir tebing menyala oranye dekat celah
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(x, gY - 1, 2, 2);
        ctx.fillStyle = '#f97316';
        ctx.fillRect(x, gY - 2, 2, 1);
      } else {
        // Batuan basal hitam pekat & kerak benua yang meregang
        ctx.fillStyle = '#09090b';
        ctx.fillRect(x, gY + 24, 2, h - (gY + 24));

        ctx.fillStyle = '#18181b';
        ctx.fillRect(x, gY + 8, 2, 16);

        ctx.fillStyle = '#27272a';
        ctx.fillRect(x, gY, 2, 8);

        // Cek apakah dekat bibir celah mana pun
        const nearChasm = chasmRanges.some(([lo, hi]) => Math.abs(x - lo) < 22 || Math.abs(x - hi) < 22);
        if (nearChasm) {
          // Bibir tebing retakan membara oranye
          ctx.fillStyle = '#ea580c';
          ctx.fillRect(x, gY - 1, 2, 2);
          ctx.fillStyle = '#f97316';
          ctx.fillRect(x, gY - 2, 2, 1);
        } else {
          // Permukaan batu basal berdebu abu vulkanik
          ctx.fillStyle = '#3f3f46';
          ctx.fillRect(x, gY - 1, 2, 1);
        }

        // Bintik kristal sulfur/belerang kuning & mineral olivin kehijauan
        if ((seed % 21) === 0) {
          ctx.fillStyle = '#eab308';
          ctx.fillRect(x, gY + 3 + (seed % 10), 2, 2);
        } else if ((seed % 29) === 0) {
          ctx.fillStyle = '#84cc16';
          ctx.fillRect(x, gY + 5 + (seed % 12), 2, 2);
        }

        // Retakan mikro magma membara di lantai
        if ((seed % 27) === 0) {
          ctx.fillStyle = '#f97316';
          ctx.fillRect(x, gY + 2, 2, 3);
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(x, gY + 3, 1, 1);
        }
      }
    }
  }

  // ── FOSIL PURBA TERAWETKAN DI DALAM TANAH KERAK BUMI (CRUST UNDERGROUND FOSSILS) ──
  if (zone.id === 'crust' && gProf) {
    const undergroundFossils: { x: number; depth: number; type: 'ammonite' | 'trilobite' | 'fish' | 'dino_ribs'; scale: number }[] = [
      { x: 100, depth: 36, type: 'ammonite', scale: 0.9 },
      { x: 230, depth: 46, type: 'trilobite', scale: 0.85 },
      { x: 380, depth: 38, type: 'fish', scale: 0.95 },
      { x: 530, depth: 32, type: 'dino_ribs', scale: 0.9 },
      { x: 680, depth: 48, type: 'ammonite', scale: 1.1 },
      { x: 830, depth: 36, type: 'trilobite', scale: 0.9 },
      { x: 990, depth: 44, type: 'fish', scale: 1.0 },
      { x: 1150, depth: 34, type: 'dino_ribs', scale: 0.85 },
    ];

    for (const f of undergroundFossils) {
      const clampedX = Math.min(gProf.length - 1, Math.max(0, f.x));
      const fy = (gProf[clampedX] ?? 360) + f.depth;
      drawPixelFossil(ctx, f.x, fy, f.type, f.scale, 0.85);
    }
  }

  // ── C. STRUKTUR & PROPERTI EKSPEDISI GEOLOGIS (PROPS & FACILITIES) ──
  renderZoneStructures(ctx, zone);
}

// ══════════════════════════════════════════════════════════════════════════
// 3. STRUKTUR FASILITAS GEOLOGI & PROPERTI ALAMI (TERRARIA STYLE)
// ══════════════════════════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════════════════════════
// 3. POHON & STRUKTUR FASILITAS GEOLOGI (TERRARIA & THEOTOWN STYLE)
// ══════════════════════════════════════════════════════════════════════════

// ── VARIASI POHON ORGANIK ──

/**
 * 1. Pinus Alpin Runcing (Tall Serrated Alpine Pine) dengan akar adaptif kontur lereng
 */

export function renderZoneStructures(ctx: CanvasRenderingContext2D, zone: ZoneConfig): void {
  const gProf = zone.groundProfile;

  // ── 1. JEMBATAN GANTUNG, PERANCAH TAMBANG & PILAR BASAL ──
  if (zone.platforms && gProf) {
    for (const plat of zone.platforms) {
      if (plat.type === 'wood_bridge') {
        // Jembatan Gantung Kayu Ekspedisi melintasi ngarai tektonik
        const bx1 = plat.x1;
        const bx2 = plat.x2;
        const by = plat.y;
        const bw = bx2 - bx1;

        // Tiang jangkar kayu kokoh menapak presisi tepat di atas permukaan tanah tanpa menusuk berlebihan ke dalam tebing
        const leftGround = gProf[Math.floor(bx1)] ?? (by + 20);
        const rightGround = gProf[Math.floor(bx2)] ?? (by + 20);
        const leftColH = Math.max(36, leftGround - (by - 36));
        const rightColH = Math.max(36, rightGround - (by - 36));

        ctx.fillStyle = '#271002';
        ctx.fillRect(bx1 - 8, by - 36, 10, leftColH);
        ctx.fillRect(bx2 - 2, by - 36, 10, rightColH);

        ctx.fillStyle = '#5c3520';
        ctx.fillRect(bx1 - 6, by - 34, 6, leftColH - 2);
        ctx.fillRect(bx2, by - 34, 6, rightColH - 2);

        // Plat tapak baja hitam di dasar tiang yang menempel rata tepat di atas permukaan tanah
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(bx1 - 9, leftGround - 2, 12, 4);
        ctx.fillRect(bx2 - 3, rightGround - 2, 12, 4);

        // Klem besi pengikat tiang ke tebing batu
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(bx1 - 9, by - 24, 12, 4);
        ctx.fillRect(bx2 - 3, by - 24, 12, 4);
        ctx.fillRect(bx1 - 9, by - 4, 12, 4);
        ctx.fillRect(bx2 - 3, by - 4, 12, 4);

        // Kabel gantung utama (lengkungan catenary tali baja)
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(bx1, by - 30);
        ctx.quadraticCurveTo(bx1 + bw / 2, by - 6, bx2, by - 30);
        ctx.stroke();

        // Tali penggantung vertikal berkala
        ctx.strokeStyle = '#92400e';
        ctx.lineWidth = 1;
        for (let x = bx1 + 16; x < bx2; x += 20) {
          const cableY = by - 30 + Math.sin(((x - bx1) / bw) * Math.PI) * 24;
          ctx.beginPath();
          ctx.moveTo(x, cableY);
          ctx.lineTo(x, by);
          ctx.stroke();
        }

        // Dek papan kayu jembatan berpola papan bertekstur
        ctx.fillStyle = '#451a03';
        ctx.fillRect(bx1, by, bw, 6);
        ctx.fillStyle = '#78350f';
        ctx.fillRect(bx1, by + 1, bw, 4);

        for (let x = bx1; x < bx2; x += 10) {
          ctx.fillStyle = '#271002';
          ctx.fillRect(x, by, 1, 6);
          ctx.fillStyle = '#a16207';
          ctx.fillRect(x + 2, by + 1, 6, 1);
        }

        // Railing pegangan tangan tali
        ctx.strokeStyle = '#a16207';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bx1, by - 12);
        ctx.lineTo(bx2, by - 12);
        ctx.stroke();

        // Lentera gantung ekspedisi di dekat pangkal jembatan (agar tidak bertabrakan dengan papan informasi di tengah)
        const lx = bx1 + 60;
        ctx.fillStyle = '#451a03';
        ctx.fillRect(lx - 1, by - 12, 2, 6);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(lx - 3, by - 6, 6, 7);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(lx - 2, by - 5, 4, 5);

      } else if (plat.type === 'scaffold') {
        // Perancah tambang litosfer MENEMPEL KOKOH KE LANTAI BATU DENGAN TIANG & X-BRACES
        const pw = plat.x2 - plat.x1;

        // Dek kayu perancah
        ctx.fillStyle = '#3e2215';
        ctx.fillRect(plat.x1, plat.y, pw, 7);
        ctx.fillStyle = '#78350f';
        ctx.fillRect(plat.x1, plat.y + 1, pw, 5);

        const maxW = gProf ? gProf.length : MAP_WIDTH_PX;
        for (let x = plat.x1; x <= plat.x2; x += 28) {
          const clampedX = Math.min(maxW - 1, Math.max(0, Math.floor(x)));
          const groundAtX = gProf[clampedX] ?? (plat.y + 50);
          const colH = Math.max(14, groundAtX - plat.y + 6);

          ctx.fillStyle = '#271002';
          ctx.fillRect(x - 3, plat.y, 6, colH);
          ctx.fillStyle = '#5c3520';
          ctx.fillRect(x - 1, plat.y, 2, colH);

          // Dudukan pondasi batu di dasar
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(x - 5, groundAtX - 2, 10, 5);
        }

        // Palang silang diagonal penyangga (X-Braces) antar tiang
        ctx.strokeStyle = '#5c3520';
        ctx.lineWidth = 1.8;
        for (let x = plat.x1; x + 28 <= plat.x2; x += 28) {
          const midX = Math.floor(x + 14);
          const groundMid = gProf[midX] ?? (plat.y + 45);
          const braceH = Math.min(32, groundMid - plat.y - 4);
          if (braceH > 10) {
            ctx.beginPath();
            ctx.moveTo(x, plat.y + 6);
            ctx.lineTo(x + 28, plat.y + braceH);
            ctx.moveTo(x + 28, plat.y + 6);
            ctx.lineTo(x, plat.y + braceH);
            ctx.stroke();
          }
        }

        // Pagar pengaman perancah
        ctx.strokeStyle = '#a16207';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(plat.x1, plat.y - 12);
        ctx.lineTo(plat.x2, plat.y - 12);
        ctx.stroke();

        // Lentera peringatan di ujung perancah
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(plat.x2 - 4, plat.y - 10, 6, 7);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(plat.x2 - 3, plat.y - 9, 4, 5);

      } else if (plat.type === 'basalt_pillar') {
        // Formasi Tebing Batu Pijakan Vulkanik Organik (Volcanic Stepping Crags)
        const pw = plat.x2 - plat.x1;
        const midX = Math.floor((plat.x1 + plat.x2) / 2);
        const groundAtMid = gProf[midX] ?? (plat.y + 50);
        // Tinggi kolom menancap pas di dasar jurang (groundAtMid), tidak menembus tanah di bawahnya
        const colH = Math.max(10, groundAtMid - plat.y);
        const baseGroundY = plat.y + colH;

        // Tubuh batuan beku vulkanik yang meruncing ke atas dan melebar ke bawah
        ctx.fillStyle = '#1c1917';
        ctx.beginPath();
        ctx.moveTo(plat.x1 - 3, plat.y + 4);
        ctx.lineTo(plat.x1, plat.y);
        ctx.lineTo(plat.x2, plat.y);
        ctx.lineTo(plat.x2 + 3, plat.y + 4);
        ctx.lineTo(plat.x2 + 7, plat.y + 20);
        ctx.lineTo(plat.x2 + 8, baseGroundY);
        ctx.lineTo(plat.x1 - 8, baseGroundY);
        ctx.lineTo(plat.x1 - 7, plat.y + 20);
        ctx.closePath();
        ctx.fill();

        // Faset batuan bertingkat (Terraced basalt rock shelves)
        ctx.fillStyle = '#292524';
        ctx.beginPath();
        ctx.moveTo(plat.x1 + 4, plat.y);
        ctx.lineTo(plat.x1 + Math.floor(pw * 0.55), plat.y);
        ctx.lineTo(plat.x1 + Math.floor(pw * 0.62), baseGroundY);
        ctx.lineTo(plat.x1 - 3, baseGroundY);
        ctx.closePath();
        ctx.fill();

        // Retakan magma panas membara (glowing magma fissure veins)
        ctx.strokeStyle = '#ea580c';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(plat.x1 + 18, plat.y + 8);
        ctx.lineTo(plat.x1 + 24, plat.y + 22);
        ctx.lineTo(plat.x1 + 16, plat.y + 38);
        ctx.lineTo(plat.x1 + 22, Math.min(baseGroundY - 3, plat.y + 44));
        ctx.stroke();

        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(plat.x1 + 20, plat.y + 14);
        ctx.lineTo(plat.x1 + 23, plat.y + 24);
        ctx.lineTo(plat.x1 + 18, plat.y + 34);
        ctx.stroke();

        // Permukaan pijakan batu bertekstur
        ctx.fillStyle = '#44403c';
        ctx.fillRect(plat.x1, plat.y, pw, 3);
        ctx.fillStyle = '#78716c';
        ctx.fillRect(plat.x1 + 3, plat.y, pw - 6, 1);
        ctx.fillStyle = '#a8a29e';
        ctx.fillRect(plat.x1 + 8, plat.y, Math.min(12, Math.floor(pw * 0.25)), 1);
        if (pw > 45) {
          ctx.fillRect(plat.x1 + Math.floor(pw * 0.55), plat.y, Math.min(16, pw - Math.floor(pw * 0.55) - 3), 1);
        }

        // Pendar panas magma di bagian pilar yang terendam (berakhir presisi di dasar jurang, menyatu alami)
        const magmaLevel = 360;
        if (baseGroundY > magmaLevel) {
          const heatGrad = ctx.createLinearGradient(0, magmaLevel, 0, baseGroundY);
          heatGrad.addColorStop(0, 'rgba(254, 240, 138, 0.4)');
          heatGrad.addColorStop(0.35, 'rgba(234, 88, 12, 0.3)');
          heatGrad.addColorStop(1, 'rgba(12, 2, 1, 0.85)');
          ctx.fillStyle = heatGrad;
          ctx.beginPath();
          ctx.moveTo(plat.x1 - 5, magmaLevel);
          ctx.lineTo(plat.x2 + 5, magmaLevel);
          ctx.lineTo(plat.x2 + 8, baseGroundY);
          ctx.lineTo(plat.x1 - 8, baseGroundY);
          ctx.closePath();
          ctx.fill();

          // Riak kontak lahar menyala di permukaan magma
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(plat.x1 - 6, magmaLevel, 6, 2);
          ctx.fillRect(plat.x2, magmaLevel, 6, 2);
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(plat.x1 - 9, magmaLevel + 1, 9, 2);
          ctx.fillRect(plat.x2, magmaLevel + 1, 9, 2);
        }

      } else if (plat.type === 'crystal_bridge') {
        // Jembatan medan fluks kristal emas berlabuh ke kedua tebing tebing
        const pw = plat.x2 - plat.x1;

        // Pylon penyangga kristal di tebing kiri dan kanan
        ctx.fillStyle = '#78350f';
        ctx.fillRect(plat.x1 - 6, plat.y - 14, 8, 26);
        ctx.fillRect(plat.x2 - 2, plat.y - 14, 8, 26);
        ctx.fillStyle = '#facc15';
        ctx.fillRect(plat.x1 - 4, plat.y - 12, 4, 22);
        ctx.fillRect(plat.x2, plat.y - 12, 4, 22);

        // Dek jembatan kristal transparan bercahaya
        ctx.fillStyle = 'rgba(254, 240, 138, 0.55)';
        ctx.fillRect(plat.x1, plat.y, pw, 8);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(plat.x1, plat.y + 1, pw, 2);

        // Chevron pola aliran energi
        ctx.fillStyle = 'rgba(251, 191, 36, 0.8)';
        for (let x = plat.x1 + 16; x < plat.x2 - 16; x += 24) {
          ctx.fillRect(x, plat.y + 3, 4, 3);
        }
      } else if (plat.type === 'cooled_crust') {
        // ── JEMBATAN KERAK BARU DARI MAGMA YANG MEMBEKU (PERSIS LEVEL 2) ──
        const pw = plat.x2 - plat.x1;
        const ph = plat.h ?? 14;

        ctx.fillStyle = '#1c1917';
        ctx.fillRect(plat.x1, plat.y, pw, ph);

        ctx.fillStyle = '#292524';
        ctx.fillRect(plat.x1, plat.y, pw, 4);

        ctx.fillStyle = '#57534e';
        ctx.fillRect(plat.x1, plat.y, pw, 2);

        // Klem pengikat baja di ujung tebing
        ctx.fillStyle = '#44403c';
        ctx.fillRect(plat.x1, plat.y - 2, 8, ph + 4);
        ctx.fillRect(plat.x2 - 8, plat.y - 2, 8, ph + 4);
        ctx.fillStyle = '#78716c';
        ctx.fillRect(plat.x1 + 2, plat.y, 4, 3);
        ctx.fillRect(plat.x2 - 6, plat.y, 4, 3);

        // Urat magma membeku di dalam balok
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(plat.x1 + 10, plat.y + 5, pw - 20, 2);
        ctx.fillRect(plat.x1 + 16, plat.y + 9, pw - 32, 2);

        // Pendaran panas bawah jembatan
        ctx.fillStyle = 'rgba(234, 88, 12, 0.45)';
        ctx.fillRect(plat.x1 + 6, plat.y + ph, pw - 12, 4);
      }
    }
  }

  // ── 2. PROPERTI SPESIFIK ZONA (POHON BERAGAM, BASECAMP, RIG PEMBORAN) ──
  if (zone.id === 'surface' && gProf) {
    // Susunan pohon beragam yang realistis:
    // Pohon Ek di dataran rendah, Pinus di lereng, Semak di dataran tinggi
    drawOakTree(ctx, 160, gProf[160] ?? 360, 1.15, gProf);
    drawPineTree(ctx, 230, gProf[230] ?? 340, 1.0, gProf);
    drawPineTree(ctx, 350, gProf[350] ?? 300, 1.25, gProf);
    drawPineTree(ctx, 470, gProf[470] ?? 230, 0.95, gProf);
    drawShrub(ctx, 520, gProf[520] ?? 225, 1.2, gProf);
    drawPineTree(ctx, 670, gProf[670] ?? 235, 1.2, gProf);
    drawOakTree(ctx, 730, gProf[730] ?? 295, 0.95, gProf);
    drawShrub(ctx, 1050, gProf[1050] ?? 345, 1.1, gProf);
    drawPineTree(ctx, 1105, gProf[1105] ?? 355, 1.1, gProf);

    // ── TAPAK KEMAH EKSPEDISI (BASE CAMP di x: 70 -> 150) ──
    const campX = 80;
    const campY = gProf[campX] ?? 360;

    // Tenda ekspedisi kutub/geologi kubah merah-putih
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(campX + 24, campY, 22, Math.PI, 0);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(campX + 24, campY, 14, Math.PI, 0);
    ctx.fill();

    ctx.fillStyle = '#172554';
    ctx.fillRect(campX + 20, campY - 12, 8, 12); // Pintu tenda

    // Tiang antena komunikasi & telemetri
    ctx.fillStyle = '#64748b';
    ctx.fillRect(campX + 54, campY - 32, 2, 32);
    ctx.fillRect(campX + 50, campY - 26, 10, 2);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(campX + 53, campY - 34, 4, 3); // LED antena

    // Peti instrumen seismik
    ctx.fillStyle = '#78350f';
    ctx.fillRect(campX + 58, campY - 8, 10, 8);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(campX + 59, campY - 7, 8, 2);

    // ── STASIUN PENGAMATAN PUNCAK GUNUNG (PEAK OUTPOST di x: 550) ──
    const peakX = 550;
    const peakY = gProf[peakX] ?? 225;

    // Teleskop kuningan geologis di atas tripod
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(peakX + 12, peakY - 18);
    ctx.lineTo(peakX + 4, peakY);
    ctx.lineTo(peakX + 20, peakY);
    ctx.stroke();

    // Tabung teleskop mengarah ke langit
    ctx.fillStyle = '#eab308';
    ctx.save();
    ctx.translate(peakX + 12, peakY - 18);
    ctx.rotate(-0.35);
    ctx.fillRect(-10, -4, 20, 6);
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(8, -5, 4, 8);
    ctx.restore();

    // Anemometer penunjuk arah angin
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(peakX + 32, peakY - 26, 2, 26);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(peakX + 32, peakY - 28, 8, 5);

    // ── MENARA RIG PEMBORAN SUMUR DALAM (KOLA SUPERDEEP RIG di x: 1140) ──
    const rigX = 1140;
    const rigY = gProf[rigX] ?? 360;

    // Rangka baja kisi (lattice tower) 90px tinggi
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(rigX + 6, rigY);
    ctx.lineTo(rigX + 32, rigY - 90);
    ctx.lineTo(rigX + 58, rigY);
    ctx.stroke();

    // Palang horizontal & kisi silang rangka baja
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.5;
    for (let hOff = 18; hOff < 90; hOff += 18) {
      const topW = (hOff / 90) * 26;
      const curY = rigY - hOff;
      ctx.beginPath();
      ctx.moveTo(rigX + 6 + topW, curY);
      ctx.lineTo(rigX + 58 - topW, curY);
      ctx.stroke();
    }

    // Derek katrol puncak & lampu strobo peringatan
    ctx.fillStyle = '#eab308';
    ctx.fillRect(rigX + 28, rigY - 96, 8, 6);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(rigX + 30, rigY - 99, 4, 3);

    // Pipa bor berputar masuk ke tanah
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(rigX + 30, rigY - 50, 4, 50);
  }
}

// ══════════════════════════════════════════════════════════════════════════
// 4. ANIMASI DINAMIS & DEKORASI REAL-TIME (REAL-TIME FRAME LOOP)
// ══════════════════════════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════════════════════════
// RENDERING MEDAN DINAMIS AREA 6 (BATAS DIVERGEN): PEMEKARAN LEMPENG,
// GUNDUKAN ALAMI, MAGMA MENGANGA BERSIH (TANPA PLATFORM), DAN TEKSTUR BATUAN KAYA
// ══════════════════════════════════════════════════════════════════════════
// RENDERING MEDAN DINAMIS AREA 6 (BATAS DIVERGEN): LAUTAN LUAS, PEMEKARAN
// LEMPENG SAMUDRA, LAPISAN MANTEL MAGMA DI BAWAH, TUMBUHAN & IKAN LAUT
// ══════════════════════════════════════════════════════════════════════════
export function renderOrganicDivergentTerrain(
  ctx: CanvasRenderingContext2D,
  zone: ZoneConfig,
  frame: number,
  progress: number = 1.0,
  coolProgress: number = 0,
  wiltProgress: number = 0,
  fishScared: boolean = false,
  fishList?: DivergentFish[],
  sequencePhase: string = 'cooling',
): void {
  const w = zone.cols * TILE;
  const h = Math.max(zone.rows * TILE, 1600);
  const p = Math.max(0, Math.min(1, progress));
  const splitCenter = 450;
  const maxGap = 110;
  const gap = p * maxGap;
  const leftEdge = Math.round(splitCenter - gap / 2);
  const rightEdge = Math.round(splitCenter + gap / 2);

  // Ketinggian Geologis & Geometri Ngarai Patahan Miring:
  // - Top lempeng (dasar laut) berada pada y ~ 248 (garis merah atas referensi)
  // - Batas mantel astenosfer bergelombang organik via getDivergentMantleY(x) (ikut membelah & bergeser selaras lempeng)
  // - Batas patahan dibuat miring dengan lereng bertingkat (slopeW ~ 26px)
  // - Magma celah dan mantel adalah SATU kesatuan zat cair pijar terpadu dengan tekstur & warna yang sama persis
  const slopeW = Math.min(38, Math.max(14, Math.round(gap * 0.35)));
  const lavaLeft = leftEdge + slopeW;
  const lavaRight = rightEdge - slopeW;
  const floorY = 372;

  ctx.imageSmoothingEnabled = false;

  // ══════════════════════════════════════════════════════════════════════
  // LAYER 0: LAPISAN MANTEL BUMI & MAGMA TERPADU (UNIFIED ASTHENOSPHERE & MAGMA)
  // Sesuai instruksi:
  // 1. Mantel dan magma celah adalah SATU LAPISAN TUNGGAL (bukan beda SVG/objek terpisah)
  // 2. Mantel di bawah lempeng ikut membelah dan bergeser selaras lempeng kiri & kanan
  // 3. Tekstur, warna gradien, dan arus konveksi magma celah SAMA PERSIS dengan mantel
  // 4. Tidak ada garis kontak/Moho yang memotong melintang di bawah magma rekahan
  // ══════════════════════════════════════════════════════════════════════
  ctx.save();

  // 1. Poligon Terpadu Seluruh Fluida Mantel & Magma yang Naik di Celah
  ctx.beginPath();
  ctx.moveTo(-600, h);
  ctx.lineTo(-600, getDivergentMantleY(-600, splitCenter, p, coolProgress));
  for (let mx = -600; mx <= w + 600; mx += 2) {
    ctx.lineTo(mx, getDivergentMantleY(mx, splitCenter, p, coolProgress));
  }
  ctx.lineTo(w + 600, h);
  ctx.closePath();

  // Gradien Magma Murni Membara — SAMA PERSIS untuk seluruh lapisan mantel & magma celah
  const moltenGrad = ctx.createLinearGradient(0, 365, 0, 485);
  moltenGrad.addColorStop(0, '#ffffff');    // Pucuk terpanas putih menyala di rekahan
  moltenGrad.addColorStop(0.06, '#fef08a'); // Kuning menyala terang
  moltenGrad.addColorStop(0.18, '#fde047'); // Inti konveksi magma kuning keemasan
  moltenGrad.addColorStop(0.38, '#f97316'); // Magma oranye membara di dasar lempeng
  moltenGrad.addColorStop(0.65, '#ea580c'); // Vermilion sirkulasi mantel
  moltenGrad.addColorStop(0.88, '#dc2626'); // Merah magma mantel dalam
  moltenGrad.addColorStop(1.0, '#991b1b');  // Mantel pekat
  ctx.fillStyle = moltenGrad;
  ctx.fill();

  // 2. Arus Konveksi Sinusoidal yang Melintasi Mantel & Magma Celah
  ctx.fillStyle = 'rgba(254, 240, 138, 0.42)';
  for (let mx = -600; mx <= w + 600; mx += 14) {
    const my = getDivergentMantleY(mx, splitCenter, p, coolProgress);
    const wave1 = Math.sin(frame * 0.03 + mx * 0.02) * 4;
    ctx.fillRect(mx, my + 8 + wave1, 14, 5);
  }
  ctx.fillStyle = 'rgba(249, 115, 22, 0.48)';
  for (let mx = -600; mx <= w + 600; mx += 18) {
    const my = getDivergentMantleY(mx, splitCenter, p, coolProgress);
    const wave2 = Math.cos(frame * 0.04 + mx * 0.025) * 4;
    ctx.fillRect(mx, my + 18 + wave2, 18, 5);
  }

  // 3. Gelembung Pijar Magma Terapung di Seluruh Lapisan Mantel & Rekahan Magma
  for (let i = 0; i < 16; i++) {
    const bx = (((i * 137 + frame * 0.35) % (w + 1200)) - 600);
    const mBase = getDivergentMantleY(bx, splitCenter, p, coolProgress);
    const by = mBase + 6 + ((i * 23) % 30) + Math.sin(frame * 0.05 + i) * 3;
    ctx.fillStyle = 'rgba(254, 240, 138, 0.65)';
    ctx.beginPath();
    ctx.arc(bx, by, 2.5 + (i % 2), 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fillRect(bx - 1, by - 1, 2, 2);
  }

  // 4. Garis Kontak Moho Berpendar Hangat (HANYA di Bawah Lempeng Barat & Timur, TIDAK memotong celah)
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.55)';
  ctx.lineWidth = 3;
  // Sisi barat (sepanjang seluruh dasar lempeng barat hingga rekahan lavaLeft)
  ctx.beginPath();
  for (let mx = -600; mx <= lavaLeft; mx += 6) {
    const my = getDivergentMantleY(mx, splitCenter, p, coolProgress);
    if (mx === -600) ctx.moveTo(mx, my);
    else ctx.lineTo(mx, my);
  }
  ctx.stroke();

  // Sisi timur (sepanjang seluruh dasar lempeng timur dari rekahan lavaRight)
  ctx.beginPath();
  for (let mx = lavaRight; mx <= w + 600; mx += 6) {
    const my = getDivergentMantleY(mx, splitCenter, p, coolProgress);
    if (mx === lavaRight) ctx.moveTo(mx, my);
    else ctx.lineTo(mx, my);
  }
  ctx.stroke();

  // 5. Efek di Celah Magma yang Terbuka (Saat p >= 0.45 dan belum membeku total)
  if (gap > 4 && p >= 0.45 && lavaRight > lavaLeft && coolProgress < 1) {
    const currentMagmaY = getDivergentMantleY(splitCenter, splitCenter, p, coolProgress);
    const lavaW = lavaRight - lavaLeft;

    // Pendaran hangat di permukaan magma cair yang membumbung (overlap 3px ke lereng dinding agar zero gap)
    ctx.fillStyle = `rgba(254, 240, 138, ${0.85 * (1 - coolProgress)})`;
    ctx.fillRect(lavaLeft - 3, currentMagmaY - 1, lavaW + 6, 3);

    // Gelembung hidrotermal & uap panas mendidih naik ke air laut
    for (let sp = 0; sp < 4; sp++) {
      const sProg = ((frame * 0.5 + sp * 30) % 110) / 110;
      const sx = lavaLeft + ((sp * 26 + frame * 0.25) % Math.max(8, lavaW));
      const sy = currentMagmaY - sProg * 85;
      const sAlpha = Math.sin(sProg * Math.PI) * 0.65 * (1 - coolProgress * 0.8);
      ctx.fillStyle = `rgba(224, 242, 254, ${sAlpha})`;
      ctx.beginPath();
      ctx.arc(sx, sy, 2 + sProg * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Rekahan pembekuan saat mulai mendingin
    if (coolProgress > 0.15) {
      ctx.strokeStyle = `rgba(239, 68, 68, ${0.85 * (1 - coolProgress)})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(lavaLeft + 3, currentMagmaY + 2);
      ctx.lineTo(splitCenter - 4, currentMagmaY + 3);
      ctx.lineTo(splitCenter + 6, currentMagmaY + 2);
      ctx.lineTo(lavaRight - 3, currentMagmaY + 4);
      ctx.stroke();
    }
  }
  ctx.restore();

  // ══════════════════════════════════════════════════════════════════════
  // LAYER 2: LEMPENG DASAR LAUT & KERAK BEKU SAMUDRA (DIVERGENT BOUNDARY)
  // Lempeng barat & timur membentang di atas mantel, mengapit celah rekahan di tengah.
  // Lereng ngarai patahan melandai miring bertingkat dari bibir atas ke lantai magma di Y = 372.
  // ══════════════════════════════════════════════════════════════════════

  // A. FONDASI SOLID BATUAN LEMPENG (Di atas mantel terpadu getDivergentMantleY)
  if (gap <= 4) {
    // 1. Belum membelah: Satu lempeng padat utuh tersambung dari barat ke timur
    ctx.fillStyle = '#090d16';
    ctx.beginPath();
    ctx.moveTo(-600, getDivergentMantleY(-600, splitCenter, p, coolProgress) + 4);
    for (let bx = -600; bx <= w + 600; bx += 2) {
      ctx.lineTo(bx, getDivergentTerrainElevation(bx, splitCenter, p, coolProgress));
    }
    ctx.lineTo(w + 600, getDivergentMantleY(w + 600, splitCenter, p, coolProgress) + 4);
    for (let bx = w + 600; bx >= -600; bx -= 4) {
      ctx.lineTo(bx, getDivergentMantleY(bx, splitCenter, p, coolProgress) + 4);
    }
    ctx.closePath();
    ctx.fill();
  } else {
    // 2. Lempeng Barat (dari -600 hingga ujung lereng barat di lavaLeft)
    ctx.fillStyle = '#090d16';
    ctx.beginPath();
    ctx.moveTo(-600, getDivergentMantleY(-600, splitCenter, p, coolProgress) + 4);
    for (let bx = -600; bx <= lavaLeft; bx += 2) {
      ctx.lineTo(bx, getDivergentTerrainElevation(bx, splitCenter, p, coolProgress));
    }
    for (let bx = lavaLeft; bx >= -600; bx -= 4) {
      ctx.lineTo(bx, getDivergentMantleY(bx, splitCenter, p, coolProgress) + 4);
    }
    ctx.closePath();
    ctx.fill();

    // 3. Lempeng Timur (dari awal lereng timur di lavaRight hingga w + 600)
    ctx.beginPath();
    ctx.moveTo(lavaRight, getDivergentTerrainElevation(lavaRight, splitCenter, p, coolProgress));
    for (let bx = lavaRight; bx <= w + 600; bx += 2) {
      ctx.lineTo(bx, getDivergentTerrainElevation(bx, splitCenter, p, coolProgress));
    }
    ctx.lineTo(w + 600, getDivergentMantleY(w + 600, splitCenter, p, coolProgress) + 4);
    for (let bx = w + 600; bx >= lavaRight; bx -= 4) {
      ctx.lineTo(bx, getDivergentMantleY(bx, splitCenter, p, coolProgress) + 4);
    }
    ctx.closePath();
    ctx.fill();
  }

  // B. RENDER SLICE STRATA BATUAN LEMPENG SAMUDRA SAMPAI KE DASAR MANTEL
  const drawPlateSlice = (x: number, isSlope: boolean = false) => {
    const gY = getDivergentTerrainElevation(x, splitCenter, p, coolProgress);
    const bY = getDivergentMantleY(x, splitCenter, p, coolProgress) + 4; // +4px untuk kontak mulus rapat ke mantel
    if (gY >= bY) return;
    const sw = 2.5;
    const totalThick = bY - gY;
    if (totalThick < 3) return;

    // 1. Lapisan dasar gabbro & peridotit lempeng samudra
    ctx.fillStyle = '#090d16';
    ctx.fillRect(x, gY + 36, sw, Math.max(0, totalThick - 36));

    // 2. Lapisan batuan gabbro pejal / plutonik
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x, gY + 18, sw, Math.min(18, Math.max(0, totalThick - 18)));

    // 3. Lapisan dyke basal bersusun
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x, gY + 6, sw, Math.min(12, Math.max(0, totalThick - 6)));

    // 4. Lapisan pillow basalt permukaan luar
    ctx.fillStyle = '#334155';
    ctx.fillRect(x, gY + 2, sw, Math.min(4, Math.max(0, totalThick - 2)));

    // 5. Permukaan sedimen / kerak tebing terluar
    if (isSlope) {
      // Pada lereng ngarai patahan: batuan basal terjal gelap bertingkat alami
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(x, gY, sw, 2);
      ctx.fillStyle = '#334155';
      ctx.fillRect(x, gY - 1, sw, 1);
    } else {
      ctx.fillStyle = '#0f766e'; // Hijau toska pekat sedimen laut dalam
      ctx.fillRect(x, gY, sw, 2);
      ctx.fillStyle = '#14b8a6'; // Lapisan pasir laut teratas
      ctx.fillRect(x, gY - 1, sw, 1);
    }

    // ── TEKSTUR STRATA LENGKAP DARI ATAS SAMPAI KE BAWAH MANTEL ──
    if (totalThick > 16) {
      const seed = (x * 7919) ^ 0x5a5a;
      for (let depthY = gY + 12; depthY < bY - 6; depthY += 12) {
        const strataNoise = Math.sin(x * 0.05 + depthY * 0.08) * 2;
        const bandColor = ((depthY + seed) % 24 < 12) ? 'rgba(30, 41, 59, 0.65)' : 'rgba(15, 23, 42, 0.55)';
        ctx.fillStyle = bandColor;
        ctx.fillRect(x, depthY + strataNoise, sw, 3);

        if ((depthY + seed) % 19 === 0) {
          ctx.fillStyle = '#334155';
          ctx.fillRect(x, depthY + 2, 2, 2);
        } else if ((depthY + seed) % 31 === 0) {
          ctx.fillStyle = isSlope ? '#475569' : '#0d9488';
          ctx.fillRect(x, depthY + 3, 1.5, 2);
        }
      }
    }

    // Pijar kontak termal lempeng dengan mantel di batas bawah
    ctx.fillStyle = 'rgba(254, 240, 138, 0.35)';
    ctx.fillRect(x, bY - 4, sw, 4);
  };

  // Render detail slice strata pada lempeng padat & lereng ngarai tembus sampai ke bawah
  if (gap <= 4) {
    for (let x = -600; x <= w + 600; x += 2) {
      const isSlope = (x > leftEdge && x < lavaLeft) || (x > lavaRight && x < rightEdge);
      drawPlateSlice(x, isSlope);
    }
  } else {
    // Dataran Lempeng Barat (-600 sampai leftEdge)
    for (let x = -600; x <= leftEdge; x += 2) {
      drawPlateSlice(x, false);
    }
    // Lereng Ngarai Barat Miring Atas (leftEdge sampai lavaLeft melandai miring ke floorY = 372)
    for (let x = leftEdge; x <= lavaLeft; x += 2) {
      drawPlateSlice(x, true);
    }
    // Lereng Ngarai Timur Miring Atas (lavaRight sampai rightEdge melandai miring dari floorY = 372)
    for (let x = lavaRight; x <= rightEdge; x += 2) {
      drawPlateSlice(x, true);
    }
    // Dataran Lempeng Timur (rightEdge sampai w + 600)
    for (let x = rightEdge; x <= w + 600; x += 2) {
      drawPlateSlice(x, false);
    }
  }

  // ══════════════════════════════════════════════════════════════════════
  // C. KERAK SAMUDRA HASIL PEMBEKUAN MAGMA DENGAN GRADASI TERMAL KE MAGMA BAWAH
  // Ketika magma membeku (coolProgress > 0), magma tidak turun kebawah.
  // Permukaan atas magma membeku menjadi lempeng daratan basal padat (y = floorY = 372),
  // sementara bagian bawah kerak membeku ini memiliki gradasi mulus organik ke magma
  // yang tetap menyala dan mengalir di bawahnya (seolah daratan bawahnya masih jadi bagian dari magma).
  // ══════════════════════════════════════════════════════════════════════
  if (gap > 4 && p >= 0.45 && lavaRight > lavaLeft && coolProgress > 0) {
    const cool = Math.max(0, Math.min(1, coolProgress));
    const crustLeft = lavaLeft - 4;
    const crustRight = lavaRight + 4;
    const crustW = crustRight - crustLeft;

    // Kedalaman kerak yang membeku: ~22px (dari y = 372 hingga ~394, pas sesuai garis merah)
    const crustH = 22;

    ctx.save();

    // 1. Poligon Kerak Membeku dengan lekukan organik pillow basalt di sisi bawah
    ctx.beginPath();
    ctx.moveTo(crustLeft, floorY);
    ctx.lineTo(crustRight, floorY);
    for (let cx = crustRight; cx >= crustLeft; cx -= 3) {
      const bWave = Math.sin((cx - splitCenter) * 0.15) * 2 + Math.cos((cx - splitCenter) * 0.08) * 1.5;
      const cy = floorY + crustH + bWave;
      ctx.lineTo(cx, cy);
    }
    ctx.closePath();

    // Gradasi Termal: Bagian atas batuan padat beku gelap, bagian bawah gradasi menyatu ke magma
    const crustGrad = ctx.createLinearGradient(0, floorY, 0, floorY + crustH + 3);
    crustGrad.addColorStop(0.00, `rgba(15, 23, 42, ${cool})`);          // Atas: #0f172a batuan basal padat utuh
    crustGrad.addColorStop(0.22, `rgba(30, 41, 59, ${cool})`);          // #1e293b batuan lempeng beku
    crustGrad.addColorStop(0.42, `rgba(51, 65, 85, ${cool * 0.95})`);    // #334155 basal abu-abu
    crustGrad.addColorStop(0.60, `rgba(69, 10, 10, ${cool * 0.92})`);    // #450a0a kerak hangus membara
    crustGrad.addColorStop(0.74, `rgba(127, 29, 29, ${cool * 0.80})`);   // #7f1d1d merah gelap pijar
    crustGrad.addColorStop(0.85, `rgba(234, 88, 12, ${cool * 0.55})`);   // #ea580c jingga magma membara
    crustGrad.addColorStop(0.94, `rgba(249, 115, 22, ${cool * 0.25})`);  // #f97316 batas pendar kuning-oranye
    crustGrad.addColorStop(1.00, `rgba(253, 224, 71, 0)`);               // 0% transparan, menyatu sempurna ke magma mantel di bawahnya!
    ctx.fillStyle = crustGrad;
    ctx.fill();

    // 2. Tekstur Kubah Pillow Basalt (Basal Bantal Samudra) di Bagian Atas Kerak
    for (let px = crustLeft + 2; px <= crustRight - 10; px += 13) {
      const lobeW = 13;
      const lobeH = 6 * cool;
      const pillowGrad = ctx.createRadialGradient(
        px + lobeW / 2, floorY + 4, 1,
        px + lobeW / 2, floorY + 4, lobeW / 2
      );
      pillowGrad.addColorStop(0, `rgba(71, 85, 105, ${cool * 0.65})`);  // #475569 highlight kubah
      pillowGrad.addColorStop(0.7, `rgba(30, 41, 59, ${cool * 0.85})`); // #1e293b sisi kubah
      pillowGrad.addColorStop(1, `rgba(15, 23, 42, ${cool})`);          // #0f172a celah antar bantal
      ctx.fillStyle = pillowGrad;
      ctx.beginPath();
      ctx.ellipse(px + lobeW / 2, floorY + 4, lobeW / 2, lobeH / 2, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Rekahan Kontraksi Pendinginan (Cooling Fractures)
    // Saat mendingin (cool < 0.85): retakan berpijar merah oranye
    // Saat membeku padat (cool >= 0.85): retakan mengeras menjadi joint batuan gelap
    const isGlowing = cool < 0.85;
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = isGlowing
      ? `rgba(239, 68, 68, ${0.9 * (1 - cool * 0.5)})`
      : 'rgba(15, 23, 42, 0.8)';
    ctx.beginPath();
    ctx.moveTo(crustLeft + 8, floorY + 1);
    ctx.lineTo(crustLeft + 20, floorY + 8);
    ctx.lineTo(crustLeft + 30, floorY + 5);
    ctx.lineTo(crustLeft + 44, floorY + 13);
    ctx.moveTo(crustRight - 10, floorY + 2);
    ctx.lineTo(crustRight - 22, floorY + 7);
    ctx.lineTo(crustRight - 34, floorY + 14);
    ctx.stroke();

    if (isGlowing) {
      ctx.strokeStyle = `rgba(249, 115, 22, ${0.75 * (1 - cool)})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // 4. Lapisan Lantai Daratan Baru yang Rapi & Solid di Permukaan
    ctx.fillStyle = `rgba(100, 116, 139, ${cool * 0.9})`; // #64748b highlight tepi atas lantai
    ctx.fillRect(crustLeft, floorY - 1, crustW, 1);
    ctx.fillStyle = `rgba(71, 85, 105, ${cool * 0.95})`; // #475569 permukaan lantai pijakan
    ctx.fillRect(crustLeft, floorY, crustW, 2);
    ctx.fillStyle = `rgba(51, 65, 85, ${cool})`;         // #334155 fondasi atas
    ctx.fillRect(crustLeft, floorY + 2, crustW, 2);

    // 5. Bintik Mineral Plagioklas & Olivin pada Kerak Baru
    for (let i = 0; i < 10; i++) {
      const sx = crustLeft + ((i * 19 + 7) % Math.max(10, crustW - 8));
      const sy = floorY + 5 + ((i * 11) % 11);
      ctx.fillStyle = (i % 2 === 0) ? `rgba(148, 163, 184, ${cool * 0.75})` : `rgba(45, 212, 191, ${cool * 0.5})`;
      ctx.fillRect(sx, sy, 2, 1.5);
    }

    ctx.restore();
  }



  // ══════════════════════════════════════════════════════════════════════
  // LAYER 3: TUMBUHAN LAUT (SEAWEED / RUMPUT LAUT) & EFEK LAYU KARENA SUHU NAIK
  // Sesuai instruksi: Awalnya subur, pasca-gempa suhu naik -> tanaman layu
  // ══════════════════════════════════════════════════════════════════════
  const plantPositions = [110, 150, 195, 240, 310, 350, 560, 610, 690, 760, 830, 920, 990, 1070];

  for (const px of plantPositions) {
    // Lewati tumbuhan jika berada di rongga patahan yang terbuka
    if (gap > 12 && px > leftEdge - 4 && px < rightEdge + 4) continue;

    const py = getDivergentTerrainElevation(px, splitCenter, p, coolProgress);
    const plantSeed = (px * 31) ^ 0x3c3c;
    const baseH = 20 + (plantSeed % 12);
    // Saat layu, tinggi tanaman menyusut dan terkulai
    const curH = baseH * (1 - wiltProgress * 0.45);
    const sway = Math.sin(frame * 0.04 + px * 0.06) * (4 * (1 - wiltProgress * 0.7));

    ctx.save();
    // Warna: Hijau zamrud segar jika wiltProgress=0, berubah cokelat gosong jika layu
    let plantColor = '#10b981';
    let plantColorDark = '#059669';
    let plantTipColor = '#34d399';

    if (wiltProgress > 0.6) {
      plantColor = '#78350f';     // Cokelat hangus layu
      plantColorDark = '#451a03'; // Cokelat pekat layu
      plantTipColor = '#a16207';  // Pucuk kering
    } else if (wiltProgress > 0.2) {
      plantColor = '#ca8a04';     // Menguning tanda suhu naik
      plantColorDark = '#854d0e';
      plantTipColor = '#facc15';
    }

    // Gambar batang utama dan daun rumput laut bergelombang
    ctx.strokeStyle = plantColorDark;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(px, py);
    const midX = px + sway * 0.6;
    const midY = py - curH * 0.55;
    const topX = px + sway;
    const topY = py - curH;
    ctx.quadraticCurveTo(midX, midY, topX, topY);
    ctx.stroke();

    ctx.strokeStyle = plantColor;
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Daun cabang kiri & kanan
    ctx.fillStyle = plantTipColor;
    ctx.fillRect(midX - 3, midY, 3, 2);
    ctx.fillRect(midX + 2, midY - 3, 3, 2);
    ctx.fillRect(topX - 1, topY - 1, 3, 3);

    // Jika layu (suhu naik), munculkan distorsi riak uap panas & gelembung kecil
    if (wiltProgress > 0.15) {
      const steamY = py - curH - ((frame * 0.6 + px) % 35);
      const steamAlpha = (1 - ((frame * 0.6 + px) % 35) / 35) * 0.55 * wiltProgress;
      ctx.fillStyle = `rgba(254, 215, 170, ${steamAlpha})`;
      ctx.fillRect(topX - 1 + Math.sin(frame * 0.15 + px) * 2, steamY, 2, 2);
    }
    ctx.restore();
  }

  // ══════════════════════════════════════════════════════════════════════
  // LAYER 4: IKAN-IKAN LAUT (OCEAN FISH)
  // Sesuai instruksi: Awalnya berenang di atas lempeng, pasca-gempa & suhu naik -> kabur menjauh
  // ══════════════════════════════════════════════════════════════════════
  const fishToRender = fishList && fishList.length > 0 ? fishList : [];
  for (const fish of fishToRender) {
    // Jika ikan sudah kabur ke luar batas layar, jangan render
    if (fish.x < -50 || fish.x > w + 50) continue;

    ctx.save();
    const fx = Math.round(fish.x);
    const fy = Math.round(fish.y);
    const sz = fish.size;
    const isRight = fish.dir === 'right';
    const tailWiggle = Math.sin(frame * 0.28 + fish.id) * 3;

    // A. Badan Ikan (Pixel Capsule Body)
    ctx.fillStyle = fish.color;
    ctx.beginPath();
    ctx.ellipse(fx, fy, sz * 0.6, sz * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();

    // B. Garis Aksen / Pola Garis Ikan
    ctx.fillStyle = fish.accentColor;
    const stripeX = isRight ? fx - 1 : fx + 1;
    ctx.fillRect(stripeX, fy - Math.round(sz * 0.28), 2, Math.round(sz * 0.56));

    // C. Sirip Ekor (Tail Fin) dengan animasi mengibas (wiggling)
    const tailX = isRight ? fx - sz * 0.6 : fx + sz * 0.6;
    ctx.fillStyle = fish.accentColor;
    ctx.beginPath();
    ctx.moveTo(tailX, fy);
    ctx.lineTo(tailX + (isRight ? -6 : 6), fy - 5 + tailWiggle);
    ctx.lineTo(tailX + (isRight ? -4 : 4), fy);
    ctx.lineTo(tailX + (isRight ? -6 : 6), fy + 5 + tailWiggle);
    ctx.closePath();
    ctx.fill();

    // D. Mata Ikan
    const eyeX = isRight ? fx + sz * 0.35 : fx - sz * 0.35;
    const eyeY = fy - 2;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(eyeX, eyeY, 2, 2);
    ctx.fillStyle = '#000000';
    ctx.fillRect(isRight ? eyeX + 1 : eyeX, eyeY, 1, 1);

    // E. Gelembung Kepanikan saat Ikan Kabur Menjauh (Fleeing Speed Bubbles)
    if (fishScared) {
      const bubbleX = isRight ? fx - sz * 0.8 : fx + sz * 0.8;
      ctx.fillStyle = 'rgba(224, 242, 254, 0.6)';
      ctx.beginPath();
      ctx.arc(bubbleX + Math.sin(frame * 0.3 + fish.id) * 2, fy + 1, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // ══════════════════════════════════════════════════════════════════════
  // LAYER 5: DISTORSI PANAS SEBAGAI INDIKATOR SUHU MENINGKAT
  // ══════════════════════════════════════════════════════════════════════
  if (sequencePhase === 'temp_rise' || sequencePhase === 'diverging') {
    ctx.save();
    // Gelombang termal halus naik dari dasar lempeng
    ctx.fillStyle = 'rgba(251, 146, 60, 0.05)';
    for (let ty = 140; ty < 240; ty += 8) {
      const tOff = Math.sin(frame * 0.1 + ty * 0.08) * 4;
      ctx.fillRect(0, ty + tOff, w, 3);
    }
    ctx.restore();
  }
}

// ══════════════════════════════════════════════════════════════════════════
// SPRITE PERAHU RISET GEOLOGI SAMUDRA PIXEL 2D (AREA 7: BATAS KONVERGEN)
// ══════════════════════════════════════════════════════════════════════════
