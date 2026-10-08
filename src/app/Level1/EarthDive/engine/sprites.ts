import type { ZoneConfig, DivergentFish } from './zones';
import { MAP_WIDTH_PX, getDivergentTerrainElevation, getConvergentTerrainElevation, getSubductingPlateTopY, getDivergentMantleY, getConvergentMantleY } from './zones';

// ── TILE SIZE ──
export const TILE = 32;
export const PLAYER_FRAME_W = 24;
export const PLAYER_FRAME_H = 32;


export { getPlayerSheet } from '../../../../utils/studentAvatarSheet';

/**
 * Menggambar fosil purba (Ammonite, Trilobita, Ikan Purba, Tulang Dinosaurus)
 * dengan gaya pixel art autentik pada dinding batu atau strata bawah tanah.
 */
function drawPixelFossil(
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
function drawPineTree(ctx: CanvasRenderingContext2D, x: number, groundY: number, s: number = 1.0, gProf?: number[]): void {
  // Batang kayu bertekstur serat alami
  const trunkW = Math.max(5, Math.floor(7 * s));
  const trunkH = Math.floor(34 * s);
  ctx.fillStyle = '#271002';
  ctx.fillRect(x - Math.floor(trunkW / 2), groundY - trunkH, trunkW, trunkH);
  ctx.fillStyle = '#5c3520';
  ctx.fillRect(x - Math.floor(trunkW / 2) + 1, groundY - trunkH + 2, Math.max(2, trunkW - 3), trunkH - 2);

  // Akar mencengkeram tanah secara kokoh menyesuaikan kontur lereng gProf
  const leftX = x - trunkW - 4;
  const rightX = x + trunkW + 4;
  const leftY = (gProf ? gProf[Math.max(0, Math.floor(leftX))] : groundY) ?? groundY;
  const maxW = gProf ? gProf.length : MAP_WIDTH_PX;
  const rightY = (gProf ? gProf[Math.min(maxW - 1, Math.floor(rightX))] : groundY) ?? groundY;

  ctx.fillStyle = '#271002';
  ctx.beginPath();
  ctx.moveTo(leftX, leftY + 3);
  ctx.lineTo(x - Math.floor(trunkW / 2), groundY - 6);
  ctx.lineTo(x + Math.floor(trunkW / 2), groundY - 6);
  ctx.lineTo(rightX, rightY + 3);
  ctx.lineTo(x, Math.max(leftY, rightY) + 5);
  ctx.closePath();
  ctx.fill();

  // Rumput/lumut alami di sekitar pangkal akar (merangkul tanah)
  ctx.fillStyle = '#15803d';
  ctx.fillRect(leftX, leftY - 1, 4, 3);
  ctx.fillRect(rightX - 4, rightY - 1, 4, 3);
  ctx.fillRect(x - 2, groundY - 1, 4, 2);

  // 4 Tingkat tajuk daun pinus bergerigi asimetris
  const tiers = [
    { yOff: 22 * s, w: 22 * s, h: 14 * s },
    { yOff: 34 * s, w: 18 * s, h: 13 * s },
    { yOff: 45 * s, w: 14 * s, h: 12 * s },
    { yOff: 55 * s, w: 8 * s, h: 10 * s },
  ];

  for (const t of tiers) {
    const ty = groundY - t.yOff;
    // Bayangan bawah daun pekat
    ctx.fillStyle = '#052e16';
    ctx.beginPath();
    ctx.moveTo(x - t.w, ty + 2);
    ctx.lineTo(x, ty - t.h);
    ctx.lineTo(x + t.w, ty + 2);
    ctx.fill();

    // Daun hijau hutan
    ctx.fillStyle = '#14532d';
    ctx.beginPath();
    ctx.moveTo(x - t.w * 0.9, ty);
    ctx.lineTo(x, ty - t.h * 0.95);
    ctx.lineTo(x + t.w * 0.9, ty);
    ctx.fill();

    // Highlight pucuk jarum pinus terkena sinar matahari
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.moveTo(x - t.w * 0.6, ty - 1);
    ctx.lineTo(x, ty - t.h * 0.95);
    ctx.lineTo(x + t.w * 0.2, ty - 1);
    ctx.fill();

    ctx.fillStyle = '#86efac';
    ctx.fillRect(x - 1, ty - t.h, 2, 2);
  }
}

/**
 * 2. Pohon Ek Berdaun Lebar & Berkelompok (Spreading Mountain Oak) dengan jangkar akar lereng
 */
function drawOakTree(ctx: CanvasRenderingContext2D, x: number, groundY: number, s: number = 1.0, gProf?: number[]): void {
  const trunkW = Math.max(6, Math.floor(8 * s));
  const trunkH = Math.floor(28 * s);

  // Batang kokoh bercabang
  ctx.fillStyle = '#382012';
  ctx.fillRect(x - Math.floor(trunkW / 2), groundY - trunkH, trunkW, trunkH);
  ctx.fillStyle = '#6b3c1b';
  ctx.fillRect(x - Math.floor(trunkW / 2) + 2, groundY - trunkH + 2, Math.max(2, trunkW - 4), trunkH - 2);

  // Cabang kiri dan kanan
  ctx.fillStyle = '#382012';
  ctx.fillRect(x - 10 * s, groundY - trunkH + 4, 8 * s, 4 * s);
  ctx.fillRect(x + 4 * s, groundY - trunkH + 2, 8 * s, 4 * s);

  // Akar mencengkeram tanah mengikuti kemiringan lereng
  const leftX = x - trunkW - 5;
  const rightX = x + trunkW + 5;
  const leftY = (gProf ? gProf[Math.max(0, Math.floor(leftX))] : groundY) ?? groundY;
  const maxW = gProf ? gProf.length : MAP_WIDTH_PX;
  const rightY = (gProf ? gProf[Math.min(maxW - 1, Math.floor(rightX))] : groundY) ?? groundY;

  ctx.fillStyle = '#382012';
  ctx.beginPath();
  ctx.moveTo(leftX, leftY + 3);
  ctx.lineTo(x - Math.floor(trunkW / 2), groundY - 5);
  ctx.lineTo(x + Math.floor(trunkW / 2), groundY - 5);
  ctx.lineTo(rightX, rightY + 3);
  ctx.lineTo(x, Math.max(leftY, rightY) + 5);
  ctx.closePath();
  ctx.fill();

  // Kluster kanopi daun awan organik (Terraria Canopy Style)
  const canopies = [
    { cx: x - 9 * s, cy: groundY - trunkH - 4 * s, r: 13 * s },
    { cx: x + 9 * s, cy: groundY - trunkH - 6 * s, r: 14 * s },
    { cx: x, cy: groundY - trunkH - 14 * s, r: 16 * s },
  ];

  for (const c of canopies) {
    // Shadow
    ctx.fillStyle = '#064e3b';
    ctx.beginPath();
    ctx.arc(c.cx, c.cy + 3, c.r, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = '#047857';
    ctx.beginPath();
    ctx.arc(c.cx, c.cy, c.r * 0.92, 0, Math.PI * 2);
    ctx.fill();

    // Highlight
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(c.cx - 2, c.cy - 3, c.r * 0.65, 0, Math.PI * 2);
    ctx.fill();

    // Sunlit tip
    ctx.fillStyle = '#6ee7b7';
    ctx.fillRect(c.cx - 3, c.cy - c.r * 0.75, 6, 3);
  }

  // Rumput di pangkal akar
  ctx.fillStyle = '#15803d';
  ctx.fillRect(leftX, leftY - 1, 5, 3);
  ctx.fillRect(rightX - 5, rightY - 1, 5, 3);
}

/**
 * 3. Semak Belukar Pegunungan Rendah (Alpine Berry Shrub)
 */
function drawShrub(ctx: CanvasRenderingContext2D, x: number, groundY: number, s: number = 1.0, gProf?: number[]): void {
  const w = 18 * s;
  const h = 10 * s;
  const realY = (gProf ? gProf[Math.floor(x)] : groundY) ?? groundY;

  ctx.fillStyle = '#064e3b';
  ctx.beginPath();
  ctx.ellipse(x, realY - h * 0.5 + 1, w * 0.5, h * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#059669';
  ctx.beginPath();
  ctx.ellipse(x, realY - h * 0.6, w * 0.45, h * 0.45, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#34d399';
  ctx.beginPath();
  ctx.ellipse(x - 2, realY - h * 0.75, w * 0.28, h * 0.25, 0, 0, Math.PI * 2);
  ctx.fill();

  // Bintik buah beri merah pegunungan
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(x - 4, realY - 5, 2, 2);
  ctx.fillRect(x + 3, realY - 7, 2, 2);
  ctx.fillRect(x, realY - 8, 2, 2);
}

function renderZoneStructures(ctx: CanvasRenderingContext2D, zone: ZoneConfig): void {
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
export function drawGroundTile(ctx: CanvasRenderingContext2D, x: number, y: number, _zoneId?: string): void {
  ctx.fillStyle = '#3e2723';
  ctx.fillRect(x, y, TILE, TILE);
}

export function drawWallTile(ctx: CanvasRenderingContext2D, x: number, y: number, _zoneId?: string): void {
  ctx.fillStyle = '#1c100b';
  ctx.fillRect(x, y, TILE, TILE);
}

export { clearSpriteCache } from '../../../../utils/studentAvatarSheet';
