import type { ZoneConfig } from './zones';
import { MAP_WIDTH_PX, getDivergentTerrainElevation, getConvergentTerrainElevation } from './zones';

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
  if (cProf && zone.id !== 'surface' && zone.id !== 'divergent') {
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
      ceilColor = '#451a03';
      strataColor = '#78350f';
      edgeColor = '#b45309';
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
        stColor = '#b45309';
        stLight = '#fef08a';
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
  else if (zone.id === 'outerCore') groundBaseColor = '#120504';
  else if (zone.id === 'innerCore') groundBaseColor = '#b45309';

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
      const inBasin = (x >= 380 && x <= 560) || (x >= 800 && x <= 970);

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
      // ── INTI LUAR: PELAT LOGAM BESI-NIKEL PADAT & SAMUDRA LOGAM CAIR 5.000°C ──
      const metalLevel = 360;
      const inBasin = (x >= 390 && x <= 570) || (x >= 800 && x <= 970);

      if (inBasin && gY > metalLevel) {
        // Dasar jurang di bawah samudra logam cair
        ctx.fillStyle = '#0f0403';
        ctx.fillRect(x, gY, sw, h - gY);

        // Samudra logam cair nikel-besi mendidih menyala (4.000°C - 6.000°C)
        const metH = gY - metalLevel;
        const dynGrad = ctx.createLinearGradient(0, metalLevel, 0, gY);
        dynGrad.addColorStop(0, '#ffffff'); // Pijar putih menyilaukan sepanas permukaan matahari
        dynGrad.addColorStop(0.18, '#fef08a'); // Kuning logam cair membara
        dynGrad.addColorStop(0.48, '#f59e0b'); // Emas oranye pijar dinamo
        dynGrad.addColorStop(0.78, '#ea580c'); // Jingga termal bergolak
        dynGrad.addColorStop(1, '#7c1d06');   // Dasar logam kental pekat
        ctx.fillStyle = dynGrad;
        ctx.fillRect(x, metalLevel, sw, metH);

        // Kerak pelat logam padat yang mengapung di permukaan fluida berpusar
        if ((seed % 13) === 0 && x % 8 === 0) {
          ctx.fillStyle = '#1e0503';
          ctx.fillRect(x, metalLevel + 1, 6, 2);
        }

        // Garis riak permukaan logam cair menyilaukan
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x, metalLevel, sw, 1);

        // Bintik kilatan percikan listrik konduktif di permukaan samudra
        if ((seed % 29) === 0) {
          ctx.fillStyle = '#67e8f9';
          ctx.fillRect(x, metalLevel - 1, 2, 2);
        }

      } else {
        // Pelat logam padat terkompresi (Paduan Besi-Nikel Gelap Berpendar Emas)
        ctx.fillStyle = '#120504';
        ctx.fillRect(x, gY + 24, sw, h - (gY + 24)); // Lapisan logam dalam pekat

        ctx.fillStyle = '#220b08';
        ctx.fillRect(x, gY + 8, sw, 16); // Badan pelat logam besi padat

        ctx.fillStyle = '#3d140e';
        ctx.fillRect(x, gY, sw, 8); // Permukaan atas bongkahan logam tempat berpijak

        // Bibir pelat logam di tepi samudra cair berpendar panas keemasan
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

        // Urat logam konduktif bercahaya di pelat padat
        if ((seed % 17) === 0) {
          ctx.fillStyle = '#fde047';
          ctx.fillRect(x, gY + 3 + (seed % 12), 2, 2);
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(x + 1, gY + 4 + (seed % 12), 1, 1);
        }

        // Retakan panas elektromagnetik
        if ((seed % 23) === 0) {
          ctx.fillStyle = '#ea580c';
          ctx.fillRect(x, gY + 2, 2, 4);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x, gY + 3, 1, 2);
        }
      }

    } else if (zone.id === 'innerCore') {
      // ── INTI DALAM (BOLA BESI PADAT MURNI BERWARNA KUNING SEPANAS MATAHARI 6.000°C) ──
      // Permukaan tanah datar padat berwarna kuning matahari bercahaya
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

      // Bibir permukaan atas berpendar kuning-putih berkilau (efek bola besi panas matahari)
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

        // Kerak basal membeku yang terapung di atas lava
        if ((seed % 9) === 0 && x % 6 === 0) {
          ctx.fillStyle = '#1c1917';
          ctx.fillRect(x, magmaTopY + 2, 6, 3);
          ctx.fillStyle = '#27272a';
          ctx.fillRect(x, magmaTopY + 1, 6, 1);
        }

        // Garis permukaan magma menyala terang
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
        ctx.fillRect(plat.x1 + 8, plat.y, 12, 1);
        ctx.fillRect(plat.x1 + 35, plat.y, 16, 1);

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
    const lavaChasms = [470, 885];
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
      { x: 340, y: 310 },
      { x: 480, y: 350 },
      { x: 700, y: 300 },
      { x: 880, y: 350 },
      { x: 1080, y: 320 },
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
    // ── EFEK PARTIKEL KATEDRAL KRISTAL LOGAM INTI DALAM (SAKRAL & TENANG) ──
    // 1. Partikel debu intan bercahaya naik perlahan dan tenang dari sela kristal
    for (let p = 0; p < 16; p++) {
      const pProg = ((frame * 0.25 + p * 20) % 180) / 180;
      const px = (p * 85 + Math.sin(frame * 0.02 + p) * 16 + 20) % 1280;
      const py = 420 - pProg * 340;
      const pAlpha = Math.sin(pProg * Math.PI) * 0.8;

      ctx.fillStyle = p % 3 === 0 ? `rgba(255, 255, 255, ${pAlpha})` : p % 2 === 0 ? `rgba(254, 240, 138, ${pAlpha})` : `rgba(251, 191, 36, ${pAlpha * 0.7})`;
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

    // 3. Kilau bintang halus pada faset kristal (Crystal Facet Twinkle)
    const sparklePoints = [
      { x: 270, y: 298 },
      { x: 410, y: 298 },
      { x: 590, y: 226 },
      { x: 680, y: 238 },
      { x: 920, y: 308 },
      { x: 1040, y: 308 },
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
    // ── EFEK DINAMIS BATAS DIVERGEN & LEMBAH RETAKAN ──
    // Partikel bara api / debu vulkanik halus mengambang ke langit
    for (let p = 0; p < 18; p++) {
      const pProg = ((frame * 0.3 + p * 22) % 150) / 150;
      const px = (p * 120 + Math.sin(frame * 0.03 + p) * 22 + 40) % 2000;
      const py = 420 - pProg * 280;
      const pAlpha = Math.sin(pProg * Math.PI) * 0.5;
      ctx.fillStyle = p % 2 === 0 ? `rgba(249, 115, 22, ${pAlpha})` : `rgba(254, 240, 138, ${pAlpha})`;
      ctx.fillRect(px, py, 2, 2);
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

    // Banner hologram penanda kedalaman atau kapsul akhir
    const bob = Math.sin(frame * 0.08) * 2;
    if (labelText) {
      // Emerald & Gold glowing banner for custom label / extraction capsule
      ctx.font = 'bold 7.5px monospace';
      const textW = ctx.measureText(labelText).width;
      const bannerW = Math.max(s + 48, Math.round(textW + 16));
      const bx = Math.round(x + s / 2 - bannerW / 2);

      ctx.fillStyle = 'rgba(6, 78, 59, 0.95)';
      ctx.fillRect(bx, y - 14 + bob, bannerW, 13);
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(bx, y - 14 + bob, bannerW, 13);

      ctx.fillStyle = '#fef08a';
      ctx.textAlign = 'center';
      ctx.fillText(labelText, x + s / 2, y - 4 + bob);
      ctx.textAlign = 'start';

      // Vertical extraction beacon beam shooting upward into crystal cathedral
      const beamGrad = ctx.createLinearGradient(0, y + 8, 0, y - 65);
      beamGrad.addColorStop(0, 'rgba(52, 211, 153, 0.6)');
      beamGrad.addColorStop(0.5, 'rgba(251, 191, 36, 0.35)');
      beamGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = beamGrad;
      ctx.fillRect(x + 5, y - 65, s - 10, 73);
    } else {
      ctx.fillStyle = 'rgba(79, 70, 229, 0.9)';
      const bannerW = s + 64;
      ctx.fillRect(x + s / 2 - bannerW / 2, y - 14 + bob, bannerW, 12);
      ctx.strokeStyle = '#a5b4fc';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + s / 2 - bannerW / 2, y - 14 + bob, bannerW, 12);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 6.5px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('▼ TURUN KE LAPISAN SELANJUTNYA ▼', x + s / 2, y - 5 + bob);
      ctx.textAlign = 'start';
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

    // Banner hologram ke atas
    const bob = Math.sin(frame * 0.08) * 2;
    ctx.fillStyle = 'rgba(14, 165, 233, 0.9)';
    const bannerW = s + (labelText ? 50 : 64);
    ctx.fillRect(x + s / 2 - bannerW / 2, y - 14 + bob, bannerW, 12);
    ctx.strokeStyle = '#7dd3fc';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + s / 2 - bannerW / 2, y - 14 + bob, bannerW, 12);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 6.5px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(labelText || '▲ NAIK KE LAPISAN SEBELUMNYA ▲', x + s / 2, y - 5 + bob);
    ctx.textAlign = 'start';
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

        // A. Kepulan Asap Solfatara Kawah Aktif Merapi (Billowing Volcanic Steam Plume)
        for (let p = 0; p < 9; p++) {
          const pProg = ((frame * 0.05 + p * 0.75) % 6) / 6;
          const px = summitX + 6 + pProg * 45 + Math.sin(frame * 0.04 + p) * 6;
          const py = summitY - 4 - pProg * 75;
          const pr = 7 + pProg * 22;
          const pAlpha = Math.max(0, (1 - pProg) * 0.65);

          // Asap uap putih pekat
          ctx.fillStyle = `rgba(255, 255, 255, ${pAlpha})`;
          ctx.beginPath();
          ctx.arc(px, py, pr, 0, Math.PI * 2);
          ctx.fill();

          // Semburat uap belerang vulkanik kekuningan
          if (p % 2 === 0) {
            ctx.fillStyle = `rgba(254, 240, 138, ${pAlpha * 0.35})`;
            ctx.beginPath();
            ctx.arc(px - 3, py + 2, pr * 0.6, 0, Math.PI * 2);
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
      // MANTEL BUMI (~860 KM): LAUTAN MAGMA PENUH (FULL MAGMA OCEAN)
      // Samudra magma silikat cair raksasa yang membara dari atas hingga bawah,
      // gelombang arus konveksi mantel yang berombak dinamis, letupan gelembung
      // magma pijar, dan kerak basal membeku yang terapung bebas.
      // (100% BEBAS STRUKTUR PILAR / BANGUNAN KOTAK SESUAI INSTRUKSI PENGGUNA)
      // ══════════════════════════════════════════════════════════════════════

      // 1. Gradien Lautan Magma Penuh Menyala (Atas Merah Magma -> Bawah Kuning Membara)
      const grd = ctx.createLinearGradient(0, 0, 0, h);
      grd.addColorStop(0, '#2d0502');    // Merah marun membara batas atas
      grd.addColorStop(0.22, '#4d0a04'); // Merah magma pekat
      grd.addColorStop(0.45, '#7f1d1d'); // Merah darah membara bersuhu ribuan derajat
      grd.addColorStop(0.68, '#c2410c'); // Oranye membara arus konveksi mantel
      grd.addColorStop(0.86, '#ea580c'); // Jingga terang mendidih
      grd.addColorStop(1, '#f97316');    // Dasar lautan magma cair
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);

      // 2. Gelombang Distorsi Panas Atmosferik Mantel (Undulating Convection Thermal Waves)
      for (let y = 15; y < h - 10; y += 18) {
        const waveOffset = Math.sin(frame * 0.04 + y * 0.04) * 8;
        const hazeAlpha = 0.04 + Math.sin(frame * 0.06 + y * 0.05) * 0.025;
        ctx.fillStyle = `rgba(254, 240, 138, ${hazeAlpha})`;
        ctx.fillRect(0, y + waveOffset, w, 10);
      }

      // 3. Lapisan Gelombang Arus Konveksi Magma (Surging Convective Magma Swells - 3 Tiers)
      // Bergerak secara dinamis meniru fluida mantel astinosfer yang mengalir perlahan
      const magmaTiers = [
        { baseY: h * 0.32, amp: 14, speed: 0.018, freq: 0.007, col: 'rgba(153, 27, 27, 0.75)', crestCol: '#ea580c', crestH: 3 },
        { baseY: h * 0.52, amp: 18, speed: 0.025, freq: 0.009, col: 'rgba(194, 65, 12, 0.82)', crestCol: '#f97316', crestH: 3 },
        { baseY: h * 0.72, amp: 22, speed: 0.032, freq: 0.011, col: 'rgba(234, 88, 12, 0.90)', crestCol: '#fde047', crestH: 4 },
      ];

      for (let tIdx = 0; tIdx < magmaTiers.length; tIdx++) {
        const tier = magmaTiers[tIdx];
        const tierP = camX * (0.05 + tIdx * 0.04);

        ctx.fillStyle = tier.col;
        ctx.beginPath();
        ctx.moveTo(0, h);

        const startY = tier.baseY + Math.sin(frame * tier.speed + (0 - tierP) * tier.freq) * tier.amp;
        ctx.lineTo(0, startY);

        for (let bx = 0; bx <= w + 16; bx += 16) {
          const waveY = tier.baseY +
            Math.sin(frame * tier.speed + (bx - tierP) * tier.freq) * tier.amp +
            Math.cos(frame * (tier.speed * 1.5) + (bx - tierP) * (tier.freq * 2)) * (tier.amp * 0.35);
          ctx.lineTo(bx, waveY);
        }
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();

        // Puncak Pijar Menyala pada Bibir Gelombang Magma (Incandescent Crests)
        ctx.fillStyle = tier.crestCol;
        for (let bx = 0; bx <= w; bx += 8) {
          const waveY = tier.baseY +
            Math.sin(frame * tier.speed + (bx - tierP) * tier.freq) * tier.amp +
            Math.cos(frame * (tier.speed * 1.5) + (bx - tierP) * (tier.freq * 2)) * (tier.amp * 0.35);
          ctx.fillRect(bx, waveY - 1, 8, tier.crestH);
        }
      }

      // 4. Gelembung Magma Meletup & Partikel Percikan Lahar Panas (Bubbling Lava & Embers)
      for (let eb = 0; eb < 16; eb++) {
        const seedEb = (eb * 79 + 31);
        const ex = ((seedEb * 43 - camX * 0.1) % w + w) % w;
        const progress = ((frame * 0.6 + seedEb * 17) % 240) / 240;
        const ey = h * 0.95 - progress * (h * 0.65);
        const sway = Math.sin(frame * 0.05 + seedEb) * 12;

        const emberAlpha = Math.sin(progress * Math.PI);
        ctx.fillStyle = eb % 3 === 0 ? `rgba(254, 240, 138, ${emberAlpha})` : `rgba(249, 115, 22, ${emberAlpha})`;
        ctx.fillRect(Math.round(ex + sway), Math.round(ey), 2, 2);
      }

      // 6. Pendaran Radiasi Termal Global Sangat Kuat
      const radiantPulse = Math.sin(frame * 0.03) * 0.05 + 0.14;
      ctx.fillStyle = `rgba(249, 115, 22, ${radiantPulse})`;
      ctx.fillRect(0, 0, w, h);
      break;
    }

    case 'outerCore': {
      // ══════════════════════════════════════════════════════════════════════
      // INTI LUAR (2.900 - 5.150 KM): SAMUDRA BESI-NIKEL CAIR CERAH 5.000°C
      // Suhu dahsyat 4.000°C - 5.000°C: Samudra fluida logam mendidih jauh lebih cerah
      // berwarna kuning-oranye berpijar emas menyilaukan.
      // DILENGKAPI EFEK MEDAN MAGNET BUMI (GEOMAGNETIC DIPOLE FLUX LOOPS):
      // Garis-garis fluks medan magnet dipole bumi melengkung anggun melintasi langit,
      // melambangkan generator dinamo bumi yang melindungi bumi dari radiasi matahari.
      // (100% BEBAS DARI BONGKAHAN TRAPESIUM / BATUAN KAKU SESUAI INSTRUKSI)
      // ══════════════════════════════════════════════════════════════════════

      // 1. Gradien Magma Logam Cair Jauh Lebih Cerah (Bright Incandescent Golden-Orange Liquid Ocean)
      const grd = ctx.createLinearGradient(0, 0, 0, h);
      grd.addColorStop(0, '#5a1306');    // Atas: Jingga merah hangat batas mantel-inti
      grd.addColorStop(0.20, '#9a3412'); // Oranye tembaga pijar
      grd.addColorStop(0.45, '#ea580c'); // Jingga terang membara 4.000°C
      grd.addColorStop(0.70, '#f59e0b'); // Emas pijar samudra logam cair nikel-besi
      grd.addColorStop(0.90, '#facc15'); // Kuning membara menyilaukan
      grd.addColorStop(1, '#fef08a');    // Dasar logam cair putih-kuning 5.000°C
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);

      // 2. Gelombang Distorsi Termal Cair Berpendar Terang (Bright Thermal Convection Bands)
      for (let y = 15; y < h - 15; y += 18) {
        const waveOffset = Math.sin(frame * 0.05 + y * 0.04) * 10;
        const hazeAlpha = 0.07 + Math.sin(frame * 0.07 + y * 0.06) * 0.035;
        ctx.fillStyle = `rgba(255, 255, 255, ${hazeAlpha})`;
        ctx.fillRect(0, y + waveOffset, w, 8);
      }

      // 3. Lapisan Samudra Fluida Logam Menyilaukan (Brilliant Molten Metal Ocean Waves - 3 Layers)
      const coreTiers = [
        { baseY: h * 0.45, amp: 12, speed: 0.024, freq: 0.008, col: 'rgba(234, 88, 12, 0.65)', crestCol: '#fde047' },
        { baseY: h * 0.62, amp: 16, speed: 0.032, freq: 0.010, col: 'rgba(245, 158, 11, 0.75)', crestCol: '#fef08a' },
        { baseY: h * 0.78, amp: 20, speed: 0.042, freq: 0.013, col: 'rgba(250, 204, 21, 0.85)', crestCol: '#ffffff' },
      ];

      for (let tIdx = 0; tIdx < coreTiers.length; tIdx++) {
        const tier = coreTiers[tIdx];
        const tierP = camX * (0.06 + tIdx * 0.04);

        ctx.fillStyle = tier.col;
        ctx.beginPath();
        ctx.moveTo(0, h);
        for (let bx = 0; bx <= w + 16; bx += 16) {
          const waveY = tier.baseY +
            Math.sin(frame * tier.speed + (bx - tierP) * tier.freq) * tier.amp +
            Math.cos(frame * (tier.speed * 1.6) + (bx - tierP) * (tier.freq * 2.2)) * (tier.amp * 0.4);
          ctx.lineTo(bx, waveY);
        }
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();

        // Puncak gelombang menyilaukan
        ctx.fillStyle = tier.crestCol;
        for (let bx = 0; bx <= w; bx += 8) {
          const waveY = tier.baseY +
            Math.sin(frame * tier.speed + (bx - tierP) * tier.freq) * tier.amp +
            Math.cos(frame * (tier.speed * 1.6) + (bx - tierP) * (tier.freq * 2.2)) * (tier.amp * 0.4);
          ctx.fillRect(bx, waveY - 1, 8, 3);
        }
      }

      // 4. ── EFEK GARIS MEDAN MAGNET BUMI (GEOMAGNETIC DIPOLE FLUX LOOPS) ──
      // Meniru diagram kutub magnet dipole bumi (Image 4):
      // Garis fluks melengkung anggun membentuk kurva torus megah melintasi langit.
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

      // 5. Pendaran Radiasi Termal Cerah Global (High-Temperature Incandescent Glow)
      const globalPulse = Math.sin(frame * 0.04) * 0.04 + 0.16;
      ctx.fillStyle = `rgba(254, 240, 138, ${globalPulse})`;
      ctx.fillRect(0, 0, w, h);
      break;
    }

    case 'innerCore': {
      // ══════════════════════════════════════════════════════════════════════
      // INTI DALAM (5.150 - 6.371 KM): BOLA BESI PADAT KUNING SEPANAS MATAHARI 6.000°C
      // Background polos kuning keemasan magma yang tenang dan megah.
      // (100% BEBAS PILAR HEKSAGONAL, BEBAS BANGUNAN, & BEBAS LENS FLARE SILAU)
      // ══════════════════════════════════════════════════════════════════════

      // 1. Gradien Polos Kuning Magma Hangat Bersinar (Clean Golden-Yellow Magma Glow)
      const grd = ctx.createLinearGradient(0, 0, 0, h);
      grd.addColorStop(0, '#78350f');    // Kuning amber gelap hangat di atap
      grd.addColorStop(0.25, '#b45309'); // Kuning keemasan pekat
      grd.addColorStop(0.50, '#d97706'); // Kuning matahari membara
      grd.addColorStop(0.75, '#eab308'); // Kuning cerah pijar inti
      grd.addColorStop(1, '#fde047');    // Kuning matahari murni di atas permukaan tanah datar
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);

      // 2. Riak Gelombang Hangat Magma Lembut Polos (Subtle Warm Magma Ripples)
      for (let y = 20; y < h - 20; y += 22) {
        const waveOffset = Math.sin(frame * 0.03 + y * 0.035) * 6;
        const shimmerAlpha = 0.04 + Math.sin(frame * 0.05 + y * 0.04) * 0.02;
        ctx.fillStyle = `rgba(254, 240, 138, ${shimmerAlpha})`;
        ctx.fillRect(0, y + waveOffset, w, 12);
      }

      // 3. Pendaran Hangat Merata Bola Besi Padat (Homogeneous Solid Core Radiance)
      const coreWarmth = Math.sin(frame * 0.03) * 0.03 + 0.10;
      ctx.fillStyle = `rgba(254, 240, 138, ${coreWarmth})`;
      ctx.fillRect(0, 0, w, h);
      break;
    }

    case 'divergent': {
      // ══════════════════════════════════════════════════════════════════════
      // BATAS DIVERGEN: LEMBAH RETAKAN VULKANIK (BARISAN GUNUNG & MATAHARI SENJA)
      // Karakteristik: Langit atmosferik hangat keemasan, matahari bersinar
      // megah dengan halo korona, dan barisan pegunungan bertingkat yang indah.
      // ══════════════════════════════════════════════════════════════════════

      // 1. Gradien Langit Atmosferik Lembah Retakan
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, '#0f172a');    // Indigo pekat langit atas
      skyGrad.addColorStop(0.26, '#1e1b4b'); // Violet senja
      skyGrad.addColorStop(0.52, '#431407'); // Merah tembaga pegunungan
      skyGrad.addColorStop(0.76, '#9a3412'); // Amber keemasan cakrawala
      skyGrad.addColorStop(1, '#f97316');    // Pijar oranye hangat di horizon
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. Matahari Bersinar Megah di Atas Barisan Pegunungan
      const sunX = w * 0.44 - (camX * 0.02) % 60;
      const sunY = h * 0.28;
      const sunHalo = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 110);
      sunHalo.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      sunHalo.addColorStop(0.18, 'rgba(254, 240, 138, 0.7)');
      sunHalo.addColorStop(0.45, 'rgba(251, 146, 60, 0.3)');
      sunHalo.addColorStop(0.8, 'rgba(234, 88, 12, 0.1)');
      sunHalo.addColorStop(1, 'rgba(234, 88, 12, 0)');
      ctx.fillStyle = sunHalo;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 110, 0, Math.PI * 2);
      ctx.fill();

      // Piringan inti matahari
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(sunX, sunY, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(sunX, sunY, 22, 0, Math.PI * 2);
      ctx.fill();

      // Sinar-sinar korona matahari halus
      ctx.save();
      ctx.translate(sunX, sunY);
      ctx.rotate(frame * 0.003);
      ctx.fillStyle = 'rgba(254, 240, 138, 0.08)';
      for (let s = 0; s < 8; s++) {
        ctx.rotate((Math.PI * 2) / 8);
        ctx.beginPath();
        ctx.moveTo(-12, 0);
        ctx.lineTo(0, -180);
        ctx.lineTo(12, 0);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // 3. Siluet Barisan Pegunungan Jauh (Far Mountain Peaks - Parallax 0.06)
      const farP = camX * 0.06;
      ctx.save();
      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.moveTo(0, h);
      const mSpan = 600;
      for (let mx = -200; mx <= w + 400; mx += 150) {
        const sx = mx - (farP % mSpan);
        const peakH = 140 + ((Math.abs(mx * 13) % 70));
        ctx.lineTo(sx, h - peakH);
        ctx.lineTo(sx + 75, h - (peakH - 45));
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 4. Barisan Lereng Gunung Vulkanik Sedang (Mid Mountain Ridges - Parallax 0.16)
      const midP = camX * 0.16;
      ctx.save();
      ctx.fillStyle = '#27272a';
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let rx = -200; rx <= w + 400; rx += 180) {
        const sx = rx - (midP % 540);
        const ridgeH = 110 + ((Math.abs(rx * 17) % 55));
        ctx.lineTo(sx, h - ridgeH);
        ctx.lineTo(sx + 90, h - (ridgeH - 35));
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 5. Kaki Gunung / Dinding Ngarai Retakan Dekat (Near Scarp - Parallax 0.30)
      const nearP = camX * 0.30;
      ctx.save();
      ctx.fillStyle = '#1c1917';
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let nx = -200; nx <= w + 400; nx += 220) {
        const sx = nx - (nearP % 660);
        const scarpH = 75 + ((Math.abs(nx * 19) % 35));
        ctx.lineTo(sx, h - scarpH);
        ctx.lineTo(sx + 110, h - (scarpH - 20));
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 6. Kabut Atmosferik Hangat di Atas Kaki Pegunungan
      const hazeGrad = ctx.createLinearGradient(0, h - 120, 0, h - 30);
      hazeGrad.addColorStop(0, 'rgba(234, 88, 12, 0)');
      hazeGrad.addColorStop(1, 'rgba(249, 115, 22, 0.16)');
      ctx.fillStyle = hazeGrad;
      ctx.fillRect(0, h - 120, w, 90);
      break;
    }

    case 'convergent': {
      // ══════════════════════════════════════════════════════════════════════
      // BATAS KONVERGEN: PESISIR SUBDUKSI SAMUDRA & BUSUR VULKANIK MERAPI
      // Karakteristik: Langit tropis cerah membiru, matahari bersinar hangat
      // di kiri atas, awan pixel bergulir, dan siluet megah barisan gunung api.
      // ══════════════════════════════════════════════════════════════════════

      // 1. Gradien Langit Tropis Indonesia yang Cerah & Biru Alami
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, '#0284c7');    // Sky blue tropis pekat di zenit
      skyGrad.addColorStop(0.35, '#38bdf8'); // Clear azure
      skyGrad.addColorStop(0.70, '#7dd3fc'); // Sky haze di atas barisan gunung
      skyGrad.addColorStop(1, '#bae6fd');    // Horizon kabut atmosferik lembut
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

      // 4. BARISAN PEGUNUNGAN VULKANIK JAUH (Far Mountain Silhouettes - Parallax 0.05)
      // Warna abu-abu kebiruan atmosferik andesit (#64748b & #475569) persis Screenshot 1
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

        // Kepulan Asap Fumarol / Solfatara Vulkanik Halus di Puncak
        for (let ap = 0; ap < 6; ap++) {
          const aProg = ((frame * 0.04 + ap * 0.8) % 5) / 5;
          const apx = ox + 355 + aProg * 35 + Math.sin(frame * 0.03 + ap) * 5;
          const apy = h * 0.24 - 6 - aProg * 55;
          const apr = 6 + aProg * 16;
          const aAlpha = Math.max(0, (1 - aProg) * 0.50);
          ctx.fillStyle = `rgba(255, 255, 255, ${aAlpha})`;
          ctx.beginPath();
          ctx.arc(apx, apy, apr, 0, Math.PI * 2);
          ctx.fill();
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

      // 5. PERBUKITAN TEKTONIK MENENGAH (Mid Foothills Ridge - Parallax 0.11)
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

      // 6. Kabut Pesisir Atmosferik Hangat di Horizon Bawah
      const mistGrad = ctx.createLinearGradient(0, h * 0.58, 0, h * 0.78);
      mistGrad.addColorStop(0, 'rgba(186, 230, 253, 0)');
      mistGrad.addColorStop(0.6, 'rgba(224, 242, 254, 0.35)');
      mistGrad.addColorStop(1, 'rgba(240, 249, 255, 0.75)');
      ctx.fillStyle = mistGrad;
      ctx.fillRect(0, h * 0.58, w, h * 0.20);
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
export function renderOrganicDivergentTerrain(
  ctx: CanvasRenderingContext2D,
  zone: ZoneConfig,
  frame: number,
  progress: number = 1.0,
): void {
  const w = zone.cols * TILE;
  const h = Math.max(zone.rows * TILE, 1600);
  const p = Math.max(0, Math.min(1, progress));
  const splitCenter = 450;
  const maxGap = 110;
  const gap = p * maxGap;
  const leftEdge = Math.round(splitCenter - gap / 2);
  const rightEdge = Math.round(splitCenter + gap / 2);
  const magmaY = Math.round(455 - (p > 0.15 ? ((p - 0.15) / 0.85) : 0) * 70);

  ctx.imageSmoothingEnabled = false;

  // ══════════════════════════════════════════════════════════════════════
  // LAYER 1: BACK LAYER MAGMA (Z-Index paling belakang)
  // Menghindari glitch dan berada di bawah lapisan batuan
  // ══════════════════════════════════════════════════════════════════════
  if (gap > 4) {
    const magH = h - magmaY;
    const magGrad = ctx.createLinearGradient(0, magmaY, 0, h);
    magGrad.addColorStop(0, '#ffffff');    // Permukaan pijar menyilaukan
    magGrad.addColorStop(0.06, '#fef08a'); // Kuning panas menyala
    magGrad.addColorStop(0.22, '#fb923c'); // Oranye cerah lava cair
    magGrad.addColorStop(0.48, '#ea580c'); // Oranye membara
    magGrad.addColorStop(0.72, '#dc2626'); // Merah magma kental
    magGrad.addColorStop(1, '#450a0a');    // Dasar magma pekat

    ctx.fillStyle = magGrad;
    ctx.fillRect(leftEdge - 4, magmaY, gap + 8, magH);

    // Permukaan magma bergelombang lembut & garis putih pijar
    const pulse = Math.sin(frame * 0.05) * 1.5;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(leftEdge, magmaY + pulse, gap, 2);
    ctx.fillStyle = 'rgba(254, 240, 138, 0.65)';
    ctx.fillRect(leftEdge, magmaY + pulse - 2, gap, 3);

    // Pulau-pulau kecil kerak basal beku yang terapung di atas lava
    for (let bx = leftEdge + 12; bx < rightEdge - 12; bx += 28) {
      const bFloat = Math.sin(frame * 0.04 + bx) * 1.5;
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(bx, magmaY + 3 + bFloat, 10, 4);
      ctx.fillStyle = '#27272a';
      ctx.fillRect(bx + 2, magmaY + 2 + bFloat, 6, 2);
    }
  }

  // ══════════════════════════════════════════════════════════════════════
  // LAYER 2: LEMPENG DARATAN DENGAN GUNDUKAN & TEKSTUR STRATA BATUAN KAYA
  // ══════════════════════════════════════════════════════════════════════

  // A. FONDASI SOLID DASAR LEMPENG (100% ELIMINASI CELAH SUB-PIXEL & GARIS-GARIS VERTIKAL)
  ctx.fillStyle = '#090d16';
  // Lempeng Barat
  ctx.beginPath();
  ctx.moveTo(-600, h);
  for (let bx = -600; bx <= leftEdge; bx += 4) {
    ctx.lineTo(bx, getDivergentTerrainElevation(bx, splitCenter, p));
  }
  ctx.lineTo(leftEdge, h);
  ctx.closePath();
  ctx.fill();

  // Lempeng Timur
  ctx.beginPath();
  ctx.moveTo(rightEdge, h);
  for (let bx = rightEdge; bx <= w + 600; bx += 4) {
    ctx.lineTo(bx, getDivergentTerrainElevation(bx, splitCenter, p));
  }
  ctx.lineTo(w + 600, h);
  ctx.closePath();
  ctx.fill();

  const drawPlateSlice = (x: number, isWest: boolean) => {
    const gY = getDivergentTerrainElevation(x, splitCenter, p);
    const nearLip = isWest ? (x >= leftEdge - 24) : (x <= rightEdge + 24);
    const veryNearLip = isWest ? (x >= leftEdge - 8) : (x <= rightEdge + 8);
    const sw = 2.5; // Sedikit tumpang tindih untuk mencegah celah seam rasterisasi pada semua zoom level

    // 1. Lapisan tanah dasar paling bawah (Mantel Atas / Deep Lithosphere)
    ctx.fillStyle = '#090d16';
    ctx.fillRect(x, gY + 36, sw, h - (gY + 36));

    // 2. Lapisan batuan gabbro / beku padat (Mid-crust)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x, gY + 18, sw, 18);

    // 3. Lapisan batuan basal sekunder
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x, gY + 6, sw, 12);

    // 4. Lapisan kerak permukaan luar (Upper crust)
    ctx.fillStyle = '#334155';
    ctx.fillRect(x, gY + 2, sw, 4);

    // 5. Garis kontur permukaan atas (Top rim & highlights)
    if (veryNearLip) {
      // Bibir tebing terpanggang panas magma
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(x, gY - 1, sw, 2);
      ctx.fillStyle = '#f97316';
      ctx.fillRect(x, gY - 2, sw, 1);
    } else if (nearLip) {
      ctx.fillStyle = '#c2410c';
      ctx.fillRect(x, gY - 1, sw, 2);
      ctx.fillStyle = '#fb923c';
      ctx.fillRect(x, gY - 2, sw, 1);
    } else {
      // Permukaan batuan vulkanik bertekstur
      ctx.fillStyle = '#475569';
      ctx.fillRect(x, gY, sw, 2);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(x, gY - 1, sw, 1);
    }

    // ── TEKSTUR STRATA BATUAN MENYATU & NYAMBUNG MULUS ──
    const seed = (x * 7919) ^ 0x5a5a;

    // A. Gelombang strata horizontal kontinu (sedimen/foliasi batuan lempeng yang mengalir mulus)
    const strataOffset1 = Math.sin(x * 0.035) * 3;
    const strataOffset2 = Math.cos(x * 0.025) * 4;
    ctx.fillStyle = 'rgba(71, 85, 105, 0.35)';
    ctx.fillRect(x, gY + 12 + strataOffset1, sw, 3);
    ctx.fillStyle = 'rgba(30, 41, 59, 0.45)';
    ctx.fillRect(x, gY + 26 + strataOffset2, sw, 3);

    // B. Urat magma lembut berpendar hanya tepat di bibir celah (bukan garis potong vertikal)
    if (nearLip && (seed % 17 === 0)) {
      ctx.fillStyle = 'rgba(249, 115, 22, 0.7)';
      ctx.fillRect(x, gY + 4 + (seed % 12), sw, 4);
    }

    // C. Bintik-bintik kerikil basal halus & kristal mineral alami yang tertanam di batuan
    if (seed % 19 === 0) {
      ctx.fillStyle = '#64748b'; // Kerikil batuan beku halus
      ctx.fillRect(x, gY + 10 + (seed % 16), 2, 2);
    } else if (seed % 31 === 0) {
      ctx.fillStyle = '#65a30d'; // Mineral peridotit/olivin mantel
      ctx.fillRect(x, gY + 14 + (seed % 18), 1, 2);
    } else if (seed % 41 === 0) {
      ctx.fillStyle = '#eab308'; // Mineral sulfur/belerang vulkanik
      ctx.fillRect(x, gY + 8 + (seed % 14), 1, 2);
    }
  };

  // Render Lempeng Barat (-600 .. leftEdge)
  for (let x = -600; x <= leftEdge; x += 2) {
    drawPlateSlice(x, true);
  }

  // Tebing vertikal potong Lempeng Barat di sisi retakan
  if (gap > 4) {
    const leftLipY = getDivergentTerrainElevation(leftEdge, splitCenter, p);
    ctx.fillStyle = '#020617';
    ctx.fillRect(leftEdge, leftLipY, 4, magmaY - leftLipY + 4);
    // Cahaya pantulan lava di dinding tebing
    const cliffGlow = ctx.createLinearGradient(0, leftLipY, 0, magmaY);
    cliffGlow.addColorStop(0, 'rgba(234, 88, 12, 0.1)');
    cliffGlow.addColorStop(0.7, 'rgba(234, 88, 12, 0.6)');
    cliffGlow.addColorStop(1, 'rgba(251, 146, 60, 0.9)');
    ctx.fillStyle = cliffGlow;
    ctx.fillRect(leftEdge + 2, leftLipY, 2, magmaY - leftLipY);
  }

  // Render Lempeng Timur (rightEdge .. w + 600)
  for (let x = rightEdge; x <= w + 600; x += 2) {
    drawPlateSlice(x, false);
  }

  // Tebing vertikal potong Lempeng Timur di sisi retakan
  if (gap > 4) {
    const rightLipY = getDivergentTerrainElevation(rightEdge, splitCenter, p);
    ctx.fillStyle = '#020617';
    ctx.fillRect(rightEdge - 4, rightLipY, 4, magmaY - rightLipY + 4);
    // Cahaya pantulan lava di dinding tebing
    const cliffGlow = ctx.createLinearGradient(0, rightLipY, 0, magmaY);
    cliffGlow.addColorStop(0, 'rgba(234, 88, 12, 0.1)');
    cliffGlow.addColorStop(0.7, 'rgba(234, 88, 12, 0.6)');
    cliffGlow.addColorStop(1, 'rgba(251, 146, 60, 0.9)');
    ctx.fillStyle = cliffGlow;
    ctx.fillRect(rightEdge - 4, rightLipY, 2, magmaY - rightLipY);
  }

  // ══════════════════════════════════════════════════════════════════════
  // LAYER 3: EFEK SULUR ASAP & UAP VULKANIK REALISTIS (BUKAN BOLA BULAT)
  // Aliran uap geotermal meliuk-liuk alami (sinuous fluid plumes) & bara api mikro
  // ══════════════════════════════════════════════════════════════════════
  if (p > 0.25 && gap > 20) {
    ctx.save();

    // 1. Sulur-sulur Uap Panas Meliuk Halus (Flowing Steam Ribbons)
    const numColumns = 4;
    for (let c = 0; c < numColumns; c++) {
      // Posisi pangkal uap di permukaan celah magma
      const baseX = leftEdge + 14 + (c * (gap - 28)) / (numColumns - 1);
      const timeOffset = frame * 0.035 + c * 1.7;

      for (let w = 0; w < 2; w++) {
        const speed = 0.55 + w * 0.25;
        const phase = (frame * speed * 0.018 + c * 0.75 + w * 1.3) % 1;
        const plumeHeight = 100 + w * 35;
        const topY = magmaY - plumeHeight * phase;
        const currentAlpha = Math.sin(phase * Math.PI) * 0.16; // Lembut & transparan

        if (currentAlpha <= 0.01) continue;

        ctx.beginPath();
        const startWidth = 6 + w * 3;
        const leftBase = baseX - startWidth / 2 + Math.sin(timeOffset) * 3;
        const rightBase = baseX + startWidth / 2 + Math.sin(timeOffset) * 3;

        ctx.moveTo(leftBase, magmaY);

        // Meliuk ke atas ditiup arus konveksi udara & angin sepoi ke kanan
        const driftX = Math.sin(timeOffset + 1.2) * 10 + (phase * 14);
        const midY = (magmaY + topY) / 2;
        const midWidth = 14 + phase * 18;
        const topWidth = 22 + phase * 26;

        const cp1x = leftBase - 6 + Math.sin(frame * 0.04 + c) * 8;
        const cp1y = magmaY - (magmaY - midY) * 0.55;
        const cp2x = baseX - midWidth / 2 + driftX * 0.5;
        const cp2y = midY;

        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, baseX - topWidth / 2 + driftX, topY);
        ctx.lineTo(baseX + topWidth / 2 + driftX, topY);

        const cp3x = baseX + midWidth / 2 + driftX * 0.5;
        const cp3y = midY;
        const cp4x = rightBase + 6 + Math.sin(frame * 0.04 + c + 1) * 8;
        const cp4y = magmaY - (magmaY - midY) * 0.55;

        ctx.bezierCurveTo(cp3x, cp3y, cp4x, cp4y, rightBase, magmaY);
        ctx.closePath();

        // Gradien uap: pendaran hangat di dekat lava -> uap putih tipis -> memudar di udara
        const grad = ctx.createLinearGradient(baseX, magmaY, baseX + driftX, topY);
        grad.addColorStop(0, `rgba(254, 215, 170, ${currentAlpha * 0.75})`);
        grad.addColorStop(0.3, `rgba(226, 232, 240, ${currentAlpha})`);
        grad.addColorStop(0.7, `rgba(203, 213, 225, ${currentAlpha * 0.45})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = grad;
        ctx.fill();
      }
    }

    // 2. Partikel Bara Api Mikro yang Mengapung Bersama Hawa Panas
    const numSparks = 7;
    for (let s = 0; s < numSparks; s++) {
      const sparkCycle = ((frame * 0.45 + s * 37) % 85) / 85;
      const sparkX = leftEdge + 10 + ((s * 26 + frame * 0.18) % Math.max(10, gap - 20)) + Math.sin(frame * 0.04 + s) * 6;
      const sparkY = magmaY - sparkCycle * 90;
      const sparkAlpha = Math.sin(sparkCycle * Math.PI);

      ctx.fillStyle = s % 2 === 0
        ? `rgba(254, 240, 138, ${sparkAlpha * 0.8})` // Emas pijar
        : `rgba(251, 146, 60, ${sparkAlpha * 0.7})`;  // Oranye bara
      ctx.fillRect(sparkX, sparkY, 1.5, 2);
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
// Menjamin konsistensi elevasi 100% antara kerak benua, kerak samudra, dan air laut
// sehingga mustahil ada celah (gap) yang terbentuk selama animasi subduksi
// ══════════════════════════════════════════════════════════════════════════
export function getConvergentSeafloorProfile(x: number, p: number): number {
  if (x <= 240) {
    return 405; // Lantai samudra abisal datar sebelum palung
  }
  if (x <= 380) {
    // Lereng palung luar (outer-trench slope) melengkung mulus ke sumbu palung (x=380)
    const t = (x - 240) / 140;
    const sCurve = (1 - Math.cos(t * Math.PI)) / 2;
    return 405 + sCurve * 55 * p; // Palung mendalam hingga y = 460
  }
  if (x <= 518) {
    // Lereng prisma akresi benua naik mulus dari dasar palung (y=405+55*p) ke dermaga pantai (y=360)
    const t = (x - 380) / 138;
    const sCurve = (1 - Math.cos(t * Math.PI)) / 2;
    const trenchBottom = 405 + 55 * p;
    return trenchBottom - sCurve * (trenchBottom - 360);
  }
  return 360; // Batuan dasar daratan pantai & pesisir
}

// ══════════════════════════════════════════════════════════════════════════
// RENDERING MEDAN DINAMIS AREA 7 (BATAS KONVERGEN): SUBDUKSI SAMUDRA MENUNJAM,
// PALUNG DALAM DI TENGAH LAUT (TERISI AIR), KERAK SAMUDRA KAYA STRATA & MINERAL,
// GUNUNG BERAPI DARATAN, TANPA CELAH/LAVA/JEMBATAN
// ══════════════════════════════════════════════════════════════════════════
export function renderOrganicConvergentTerrain(
  ctx: CanvasRenderingContext2D,
  zone: ZoneConfig,
  frame: number,
  collisionProgress: number = 1.0,
): void {
  const w = zone.cols * TILE;
  const h = Math.max(zone.rows * TILE, 1600);
  const p = Math.max(0, Math.min(1, collisionProgress));
  ctx.imageSmoothingEnabled = false;

  // ══════════════════════════════════════════════════════════════════════
  // LAYER 1: FONDASI MANTEL ASTENOSFER SOLID (ELIMINASI SEMUA CELAH BACKGROUND)
  // ══════════════════════════════════════════════════════════════════════
  // Mengisi penuh dari y=356 ke bawah canvas (h) pada seluruh lebar map.
  // Menjamin 100% TIDAK ADA celah langit/kabut yang dapat tembus di bawah air atau lereng!
  const asthenoGrad = ctx.createLinearGradient(0, 356, 0, h);
  asthenoGrad.addColorStop(0, '#261405'); // Batuan mantel astenosfer peridotit pekat
  asthenoGrad.addColorStop(0.35, '#190d03');
  asthenoGrad.addColorStop(1, '#0c0601');
  ctx.fillStyle = asthenoGrad;
  ctx.fillRect(-800, 356, w + 1600, h - 356);

  // ══════════════════════════════════════════════════════════════════════
  // LAYER 2: KERAK SAMUDRA BERSTRATA KAYA (OFIOILIT LITOSFER SAMUDRA)
  // ══════════════════════════════════════════════════════════════════════
  // Membentang dari x=-800 hingga menunjam ke bawah lempeng benua (x=500)
  const sw = 2.5; // Tumpang tindih mikro untuk mencegah celah garis sub-pixel
  for (let x = -800; x <= 500; x += 2) {
    let topY: number;
    if (x <= 380) {
      topY = getConvergentSeafloorProfile(x, p);
    } else {
      // Penunjaman lempeng samudra menembus astenosfer di bawah prisma akresi benua
      const plungeT = (x - 380) / 120;
      topY = (405 + 55 * p) + plungeT * 55 * p;
    }

    const slabThickness = 48;

    // A. LAPISAN 4: GABRO PLUTONIK BERLAPIS & MANTEL PERIDOTIT (topY + 34 s/d topY + 48)
    ctx.fillStyle = '#090d16'; // Ultra-mafik kristalin pekat
    ctx.fillRect(x, topY + 34, sw, slabThickness - 34);

    // B. LAPISAN 3: SHEETED DYKES / KOMPLEKS DYKE BERSUSUN (topY + 20 s/d topY + 34)
    ctx.fillStyle = '#141d2c'; // Diabase mafik basaltik
    ctx.fillRect(x, topY + 20, sw, 14);

    // C. LAPISAN 2: BASAL BANTAL VULKANIK (PILLOW BASALT CRUST) (topY + 5 s/d topY + 20)
    ctx.fillStyle = '#1e293b'; // Basalt crust utama
    ctx.fillRect(x, topY + 5, sw, 15);

    // D. LAPISAN 1: SEDIMEN LAUT PELAGIS (PELAGIC SEDIMENT) (topY s/d topY + 5)
    ctx.fillStyle = '#475569'; // Silt laut dalam
    ctx.fillRect(x, topY + 2, sw, 3);
    ctx.fillStyle = '#64748b'; // Permukaan sedimen laut terang
    ctx.fillRect(x, topY, sw, 2);

    // STRATA & TEKSTUR KHAS KERAK SAMUDRA:
    // 1. Laminasi sedimen laut halus
    if (x % 6 === 0) {
      ctx.fillStyle = 'rgba(148, 163, 184, 0.45)';
      ctx.fillRect(x, topY + 1, sw, 1);
    }

    // 2. Dykes intrusi vertikal di zona sheeted dykes
    if (x % 14 === 0) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x, topY + 22, sw, 10);
    }

    // 3. Kristal mineral khas kerak samudra (Olivin & Piroksen Hijau Zamrud khas Gabro/Peridotit)
    const seed = (x * 7919) ^ 0x5a5a;
    if (seed % 19 === 0) {
      // Kristal Olivin hijau zamrud
      ctx.fillStyle = '#0d9488';
      ctx.fillRect(x, topY + 36 + (seed % 9), 1.5, 2);
    } else if (seed % 23 === 0) {
      // Kristal Piroksen hijau laut terang
      ctx.fillStyle = '#10b981';
      ctx.fillRect(x, topY + 38 + (seed % 7), 1.5, 1.5);
    } else if (seed % 31 === 0) {
      // Kristal feldspar / kalsit hidrotermal
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(x, topY + 8 + (seed % 10), 1.5, 1.5);
    } else if (seed % 41 === 0) {
      // Urat kuarsa / zeolit hidrotermal biru laut
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(x, topY + 11 + (seed % 8), 1.5, 2);
    }

    // 4. Retakan kompresi tektonik di daerah penekukan palung (outer-trench flexure)
    if (p > 0.3 && x >= 280 && x <= 370 && (x % 28 === 0)) {
      ctx.fillStyle = '#020617';
      ctx.fillRect(x, topY + 2, 1, 14);
    }
  }

  // Bentukan visual Basal Bantal (Pillow Lava Lobes) membulat di sepanjang permukaan kerak samudra (x: -800..380)
  ctx.save();
  for (let px = -800; px < 380; px += 18) {
    const pY = getConvergentSeafloorProfile(px, p);
    // Garis kubah basal bantal
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(px + 8, pY + 12, 7, Math.PI, 0, false);
    ctx.stroke();
    // Bayangan pendinginan kaca vulkanik di batas bantal
    ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
    ctx.fillRect(px + 14, pY + 8, 2, 8);
  }
  ctx.restore();

  // ══════════════════════════════════════════════════════════════════════
  // LAYER 3: KERAK BENUA & PRISMA AKRESI LERENG PALUNG (x: 380 .. w + 800)
  // ══════════════════════════════════════════════════════════════════════
  // FONDASI SOLID KERAK BENUA & PRISMA AKRESI (100% BEBAS CELAH SUB-PIXEL & GARIS VERTIKAL)
  ctx.fillStyle = '#1c1917';
  ctx.beginPath();
  ctx.moveTo(380, h);
  for (let bx = 380; bx <= 530; bx += 4) {
    ctx.lineTo(bx, getConvergentSeafloorProfile(bx, p));
  }
  for (let bx = 530; bx <= w + 800; bx += 4) {
    ctx.lineTo(bx, getConvergentTerrainElevation(bx, p));
  }
  ctx.lineTo(w + 800, h);
  ctx.closePath();
  ctx.fill();

  // A. Lereng Prisma Akresi Palung (x: 380 .. 530)
  // Permukaan batuan mengikuti EXACTLY getConvergentSeafloorProfile(x, p) sehingga rapat tanpa celah
  for (let x = 380; x <= 530; x += 2) {
    const slopeY = getConvergentSeafloorProfile(x, p);

    // Litosfer benua dalam (Granit & kristalin dasar)
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(x, slopeY + 36, sw, h - (slopeY + 36));

    // Kerak benua tengah (Batuan andesit padat & batuan dasar beku)
    ctx.fillStyle = '#292524';
    ctx.fillRect(x, slopeY + 12, sw, 24);

    // Lapisan batuan lereng atas (Andesit vulkanik terlipat)
    ctx.fillStyle = '#44403c';
    ctx.fillRect(x, slopeY + 3, sw, 9);

    // Puncak permukaan batuan tepi lereng
    ctx.fillStyle = '#57534e';
    ctx.fillRect(x, slopeY, sw, 3);
    ctx.fillStyle = '#78716c';
    ctx.fillRect(x, slopeY - 1, sw, 1);

    // Garis foliasi lipatan tektonik lereng
    const foldWedge = Math.sin(x * 0.08) * 3;
    ctx.fillStyle = 'rgba(120, 113, 108, 0.35)';
    ctx.fillRect(x, slopeY + 8 + foldWedge, sw, 1.5);
    ctx.fillStyle = 'rgba(28, 25, 23, 0.45)';
    ctx.fillRect(x, slopeY + 20 + foldWedge, sw, 1.5);
  }

  // B. Daratan Kerak Benua & Barisan Pegunungan Vulkanik Terlipat (x: 530 .. w + 800)
  for (let x = 530; x <= w + 800; x += 2) {
    const gY = getConvergentTerrainElevation(x, p);

    // Deep lithosphere / crystalline basement
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(x, gY + 45, sw, h - (gY + 45));

    // Middle continental crust (Granite & gneiss)
    ctx.fillStyle = '#292524';
    ctx.fillRect(x, gY + 22, sw, 23);

    // Volcanic andesite rock layer
    ctx.fillStyle = '#44403c';
    ctx.fillRect(x, gY + 8, sw, 14);

    // Upper andesite & tuff layer
    ctx.fillStyle = '#57534e';
    ctx.fillRect(x, gY + 2, sw, 6);

    // Surface crest & highlights
    ctx.fillStyle = '#78716c';
    ctx.fillRect(x, gY, sw, 2);
    ctx.fillStyle = '#a8a29e';
    ctx.fillRect(x, gY - 1, sw, 1);

    // Strata compression foliation (folded rock lines from collision)
    const foldStrata = Math.sin(x * 0.04) * 4;
    ctx.fillStyle = 'rgba(120, 113, 108, 0.4)';
    ctx.fillRect(x, gY + 14 + foldStrata, sw, 2);
    ctx.fillStyle = 'rgba(41, 37, 36, 0.5)';
    ctx.fillRect(x, gY + 28 + foldStrata, sw, 2);

    // Andesite mineral crystals
    const seed = (x * 4391) ^ 0x3c3c;
    if (seed % 17 === 0) {
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(x, gY + 10 + (seed % 18), 1, 2);
    } else if (seed % 29 === 0) {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(x, gY + 16 + (seed % 14), 2, 1);
    }
  }

  // ══════════════════════════════════════════════════════════════════════
  // LAYER 4: CEKUNGAN SAMUDRA & AIR PALUNG SUBDUKSI PENUH (x: -800 .. 518)
  // ══════════════════════════════════════════════════════════════════════
  // 1. Badan Air Laut Utama Solid Kontinu (100% Bebas Garis-Garis Vertikal & Celah Seam)
  const maxBedY = 405 + 55 * p + 15;
  const oceanGrad = ctx.createLinearGradient(0, 360, 0, maxBedY);
  oceanGrad.addColorStop(0, 'rgba(56, 189, 248, 0.88)');   // Permukaan azure cerah
  oceanGrad.addColorStop(0.28, 'rgba(2, 132, 199, 0.92)'); // Biru samudra jernih
  oceanGrad.addColorStop(0.68, 'rgba(3, 105, 161, 0.96)'); // Biru laut dalam
  oceanGrad.addColorStop(1, 'rgba(8, 47, 73, 0.99)');       // Biru pekat abisal dasar palung

  ctx.fillStyle = oceanGrad;
  ctx.beginPath();
  ctx.moveTo(-800, 360);
  ctx.lineTo(518, 360);
  for (let bx = 518; bx >= -800; bx -= 4) {
    ctx.lineTo(bx, getConvergentSeafloorProfile(bx, p));
  }
  ctx.closePath();
  ctx.fill();

  // 2. Sinar Bias Cahaya Matahari (Soft Angled Sun Rays / Caustics) Meliuk Halus
  ctx.save();
  const rayRays = [-650, -480, -310, -140, 30, 200, 370];
  for (const rx of rayRays) {
    const drift = Math.sin(frame * 0.03 + rx * 0.01) * 10;
    const rayGrad = ctx.createLinearGradient(0, 360, 0, 420);
    rayGrad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
    rayGrad.addColorStop(0.5, 'rgba(186, 230, 253, 0.06)');
    rayGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');

    ctx.fillStyle = rayGrad;
    ctx.beginPath();
    ctx.moveTo(rx + drift, 360);
    ctx.lineTo(rx + 28 + drift, 360);
    ctx.lineTo(rx + 48 + drift, 420);
    ctx.lineTo(rx + 12 + drift, 420);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // 3. Ombak Permukaan Laut Kontinu & Buih Putih Mengalir (Bukan Kotak-Kotak Terputus)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
  ctx.beginPath();
  ctx.moveTo(-800, 360);
  for (let wx = -800; wx <= 516; wx += 4) {
    const waveSin = Math.sin(frame * 0.08 + wx * 0.05) * 1.5;
    ctx.lineTo(wx, 360 + waveSin);
  }
  ctx.lineTo(516, 362);
  for (let wx = 516; wx >= -800; wx -= 4) {
    const waveSin = Math.sin(frame * 0.08 + wx * 0.05) * 1.5;
    ctx.lineTo(wx, 361.5 + waveSin);
  }
  ctx.closePath();
  ctx.fill();

  // Garis kilau air cyan terang di bawah buih
  ctx.fillStyle = 'rgba(186, 230, 253, 0.55)';
  ctx.beginPath();
  ctx.moveTo(-800, 361.5);
  for (let wx = -800; wx <= 516; wx += 4) {
    const waveSin = Math.sin(frame * 0.08 + wx * 0.05) * 1.5;
    ctx.lineTo(wx, 361.5 + waveSin);
  }
  ctx.lineTo(516, 363.5);
  for (let wx = 516; wx >= -800; wx -= 4) {
    const waveSin = Math.sin(frame * 0.08 + wx * 0.05) * 1.5;
    ctx.lineTo(wx, 363 + waveSin);
  }
  ctx.closePath();
  ctx.fill();

  // Dermaga riset di tepi pantai (x: 512 .. 535)
  ctx.fillStyle = '#451a03'; // Tiang kayu vertikal menancap ke batuan daratan
  ctx.fillRect(516, 360, 5, 24);
  ctx.fillRect(528, 360, 5, 24);
  // Papan geladak dermaga
  ctx.fillStyle = '#78350f';
  ctx.fillRect(512, 357, 24, 5);
  ctx.fillStyle = '#92400e';
  ctx.fillRect(512, 356, 24, 2);
  // Baut pengikat tali perahu (mooring cleat)
  ctx.fillStyle = '#475569';
  ctx.fillRect(520, 354, 6, 2);
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
  const faultY = 240; // Garis sesar transform membentang di tengah Y = 240

  // Pergeseran horizontal berlawanan arah lempeng tektonik
  // Lempeng Pasifik (Utara / Y < 240) bergerak ke Kiri (Barat Laut)
  // Lempeng Amerika Utara (Selatan / Y >= 240) bergerak ke Kanan (Tenggara)
  const shiftNorth = -Math.round(65 * p);
  const shiftSouth = Math.round(65 * p);

  ctx.imageSmoothingEnabled = false;

  // 1. BASE TERRAIN (LEMPENG UTARA & SELATAN DENGAN STRATA GURUN & PERGESERAN)
  // Lempeng Utara (Lempeng Pasifik, Y: 0 s/d 240)
  ctx.save();
  ctx.fillStyle = '#b45309'; // Tanah gurun alluvial kuning kecokelatan
  ctx.fillRect(0, 0, w, faultY);

  // Gelombang pasir alami yang bergeser bersama Lempeng Pasifik
  ctx.fillStyle = '#c26d18';
  for (let dy = 16; dy < faultY - 12; dy += 32) {
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

  // Lapisan batu dan kerikil kuarsa yang bergeser bersama lempeng utara
  for (let bx = -100; bx < w + 100; bx += 48) {
    const px = bx + shiftNorth;
    const seed = (bx * 3137) ^ 0x4a4a;
    const by = (Math.abs(seed) % (faultY - 30)) + 15;
    ctx.fillStyle = 'rgba(254, 240, 138, 0.25)';
    ctx.fillRect(px, by, 4, 3);
    ctx.fillStyle = 'rgba(69, 26, 3, 0.35)';
    ctx.fillRect(px + 4, by + 1, 3, 3);
  }

  // Lempeng Selatan (Lempeng Amerika Utara, Y: 240 s/d h)
  ctx.fillStyle = '#92400e'; // Tanah gurun alluvial cokelat kemerahan
  ctx.fillRect(0, faultY, w, h - faultY);

  // Gelombang pasir alami yang bergeser bersama Lempeng Amerika Utara
  ctx.fillStyle = '#78350f';
  for (let dy = faultY + 24; dy < h - 16; dy += 34) {
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

  // Lapisan kerikil gurun lempeng selatan yang bergeser bersama lempeng selatan
  for (let bx = -100; bx < w + 100; bx += 48) {
    const px = bx + shiftSouth;
    const seed = (bx * 7919) ^ 0x6b6b;
    const by = faultY + 15 + (Math.abs(seed) % (h - faultY - 35));
    ctx.fillStyle = 'rgba(254, 240, 138, 0.2)';
    ctx.fillRect(px, by, 4, 3);
    ctx.fillStyle = 'rgba(69, 26, 3, 0.4)';
    ctx.fillRect(px + 4, by + 1, 3, 3);
  }
  ctx.restore();

  // 2. SUNGAI KERING TERGESER (WALLACE CREEK OFFSET STREAM BED - SOLID CONTINUOUS TEXTURE)
  // Ikon geologi Sesar San Andreas: Alur sungai yang memotong tegak lurus patahan terpotong dan bergeser
  const creekBaseX = 720;
  const creekWidth = 24;

  // Gambar alur Sungai Wallace Creek sebagai poligon kontinu solid (tanpa scanlines/garis-garis celah)
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

  // Saluran Utara Wallace Creek (Y: 0 s/d faultY - 4)
  drawStreamChannel(0, faultY - 4, shiftNorth);

  // Saluran Selatan Wallace Creek (Y: faultY + 4 s/d h)
  drawStreamChannel(faultY + 4, h, shiftSouth);

  // Alur patahan penghubung sungai yang tergeser (Sheared channel along fault)
  if (p > 0.02) {
    const northCX = creekBaseX + shiftNorth + Math.sin((faultY - 4) * 0.04) * 6;
    const southCX = creekBaseX + shiftSouth + Math.sin((faultY + 4) * 0.04) * 6;
    const minX = Math.min(northCX, southCX) - creekWidth / 2;
    const maxX = Math.max(northCX, southCX) + creekWidth / 2;

    // Celah kering sungai terseret di sepanjang bidang sesar
    ctx.fillStyle = '#44403c';
    ctx.fillRect(minX - 2, faultY - 7, maxX - minX + 4, 14);
    ctx.fillStyle = '#292524';
    ctx.fillRect(minX + 2, faultY - 4, maxX - minX - 4, 8);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(minX + 5, faultY - 2, maxX - minX - 10, 4);

    // Label Geologi Wallace Creek & Garis Pengukuran Offset
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
    ctx.fillRect(minX - 10, faultY - 28, (maxX - minX) + 20, 16);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1;
    ctx.strokeRect(minX - 10, faultY - 28, (maxX - minX) + 20, 16);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    const offsetMeters = Math.round(p * 130);
    ctx.fillText(`OFFSET WALLACE CREEK: ${offsetMeters}m`, (minX + maxX) / 2, faultY - 17);
    ctx.restore();
  }

  // 3. JALAN RAYA ASPAL GURUN TERPOTONG (OFFSET HIGHWAY - SOLID CONTINUOUS PIXEL TEXTURE)
  const roadBaseX = 360;
  const roadWidth = 32;

  // Bagian Jalan Utara (Bergeser ke kiri bersama Lempeng Pasifik)
  const rNorthX = roadBaseX + shiftNorth;
  // Permukaan aspal solid penuh
  ctx.fillStyle = '#262626';
  ctx.fillRect(rNorthX - roadWidth / 2, 0, roadWidth, faultY - 4);
  // Tekstur kerikil aspal halus
  ctx.fillStyle = '#1f1f1f';
  for (let ry = 8; ry < faultY - 10; ry += 12) {
    ctx.fillRect(rNorthX - roadWidth / 2 + 4, ry, 6, 2);
    ctx.fillRect(rNorthX + 2, ry + 4, 7, 2);
  }
  // Garis bahu jalan putih solid
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(rNorthX - roadWidth / 2 + 1, 0, 2, faultY - 4);
  ctx.fillRect(rNorthX + roadWidth / 2 - 3, 0, 2, faultY - 4);
  // Garis marka kuning putus-putus tengah jalan
  ctx.fillStyle = '#f59e0b';
  for (let ry = 4; ry < faultY - 14; ry += 20) {
    ctx.fillRect(rNorthX - 1, ry, 2, 10);
  }

  // Bagian Jalan Selatan (Bergeser ke kanan bersama Lempeng Amerika Utara)
  const rSouthX = roadBaseX + shiftSouth;
  ctx.fillStyle = '#262626';
  ctx.fillRect(rSouthX - roadWidth / 2, faultY + 4, roadWidth, h - faultY - 4);
  ctx.fillStyle = '#1f1f1f';
  for (let ry = faultY + 12; ry < h - 10; ry += 12) {
    ctx.fillRect(rSouthX - roadWidth / 2 + 4, ry, 6, 2);
    ctx.fillRect(rSouthX + 2, ry + 4, 7, 2);
  }
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(rSouthX - roadWidth / 2 + 1, faultY + 4, 2, h - faultY - 4);
  ctx.fillRect(rSouthX + roadWidth / 2 - 3, faultY + 4, 2, h - faultY - 4);
  ctx.fillStyle = '#f59e0b';
  for (let ry = faultY + 14; ry < h - 10; ry += 20) {
    ctx.fillRect(rSouthX - 1, ry, 2, 10);
  }

  // Patahan aspal robek & retakan tektonik alami di titik potong jalan (tanpa cone merah)
  if (p > 0.03) {
    // Serpihan dan pecahan aspal hitam terkelupas alami
    ctx.fillStyle = '#171717';
    ctx.fillRect(rNorthX - roadWidth / 2 - 2, faultY - 7, roadWidth + 4, 5);
    ctx.fillRect(rSouthX - roadWidth / 2 - 2, faultY + 2, roadWidth + 4, 5);

    // Kerikil aspal abu-abu berserakan di sekitar patahan
    ctx.fillStyle = '#404040';
    ctx.fillRect(rNorthX - 8, faultY - 8, 3, 2);
    ctx.fillRect(rNorthX + 6, faultY - 7, 4, 2);
    ctx.fillRect(rSouthX - 6, faultY + 5, 4, 2);
    ctx.fillRect(rSouthX + 8, faultY + 6, 3, 2);
  }

  // 4. GARIS SESAR SAN ANDREAS (REALISTIC FAULT SCARP & JAGGED BRANCHING FISSURES)
  const fissureH = 10 + Math.round(p * 8);

  // Palung celah sesar hitam pekat di dalam perut bumi
  ctx.fillStyle = '#09090b';
  ctx.fillRect(0, faultY - fissureH / 2, w, fissureH);

  // Bayangan kedalaman rongga bawah
  ctx.fillStyle = '#18181b';
  ctx.fillRect(0, faultY - fissureH / 2 + 2, w, fissureH - 4);

  // Bibir sesar atas (Fault Scarp Edge) berpendar pasir terik
  ctx.fillStyle = '#fde047';
  ctx.fillRect(0, faultY - fissureH / 2 - 1, w, 2);
  ctx.fillStyle = '#451a03';
  ctx.fillRect(0, faultY + fissureH / 2, w, 3);

  // ── RETAKAN TANAH SEISMIK REALISTIS (JAGGED BRANCHING EARTHQUAKE RUPTURES) ──
  // Bukan garis miring satu arah, melainkan retakan bumi alami bercabang dan berliku
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
    // 1. Retakan ke arah Lempeng Utara
    const startX = f.x + shiftNorth * 0.3;
    const startY = faultY - fissureH / 2;
    const midX = startX + Math.sin(f.angle1) * (f.len * 0.55);
    const midY = startY - Math.cos(f.angle1) * (f.len * 0.55);
    const endX = midX + Math.sin(f.angle2) * (f.len * 0.45);
    const endY = midY - Math.cos(f.angle2) * (f.len * 0.45);

    // Garis retakan gelap dalam
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(midX, midY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Highlight tanah merekah di sisi retakan
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(startX + 1, startY);
    ctx.lineTo(midX + 1, midY);
    ctx.lineTo(endX + 1, endY);
    ctx.stroke();

    // Percabangan retakan (Crack Bifurcation)
    if (f.branch) {
      const bEndX = midX + Math.sin(f.angle1 + 0.75) * (f.len * 0.35);
      const bEndY = midY - Math.cos(f.angle1 + 0.75) * (f.len * 0.35);
      ctx.strokeStyle = '#18181b';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(midX, midY);
      ctx.lineTo(bEndX, bEndY);
      ctx.stroke();
    }

    // 2. Retakan ke arah Lempeng Selatan
    const sStartX = f.x + 18 + shiftSouth * 0.3;
    const sStartY = faultY + fissureH / 2;
    const sMidX = sStartX + Math.sin(f.angle2) * (f.len * 0.5);
    const sMidY = sStartY + Math.cos(f.angle2) * (f.len * 0.5);
    const sEndX = sMidX + Math.sin(f.angle1) * (f.len * 0.5);
    const sEndY = sMidY + Math.cos(f.angle1) * (f.len * 0.5);

    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 2.2;
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

    if (f.branch) {
      const sbEndX = sMidX - Math.sin(f.angle2 - 0.7) * (f.len * 0.32);
      const sbEndY = sMidY + Math.cos(f.angle2 - 0.7) * (f.len * 0.32);
      ctx.strokeStyle = '#18181b';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(sMidX, sMidY);
      ctx.lineTo(sbEndX, sbEndY);
      ctx.stroke();
    }
  }
  ctx.restore();

  // 5. DEBU SEISMIK & GESEKAN TEKTONIK AKTIF (SEISMIC FRICTION DUST PUFFS)
  if (p > 0.05) {
    for (let dp = 0; dp < 16; dp++) {
      const dCycle = ((frame * 0.08 + dp * 1.5) % 10) / 10;
      const dx = ((dp * 97 + frame * 0.4) % (w - 40)) + 20;
      const dy = faultY + Math.sin(frame * 0.1 + dp) * 5;
      const dr = 3 + dCycle * 8;
      const dAlpha = Math.max(0, (1 - dCycle) * 0.45);

      ctx.fillStyle = `rgba(254, 215, 170, ${dAlpha})`;
      ctx.beginPath();
      ctx.arc(dx, dy, dr, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 6. INDIKATOR TEKTONIK & PANAH PERGERAKAN LEMPENG (TACTICAL OVERHEAD PLATES)
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

  // 7. VEGETASI GURUN & BATUAN DARI ATAS (TOP-DOWN JOSHUA TREES & ARID BOULDERS)
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
