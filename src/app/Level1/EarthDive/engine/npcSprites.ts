// ── src/app/Level1/EarthDive/engine/npcSprites.ts ─────────────────────────────
// Generator Sprite & Potret Karakter 2D Pixel Art Prosedural untuk NPC, Pemain, dan Maskot Resqy.
// 100% Menggunakan Pixel Art Murni tanpa Gambar Eksternal / Tanpa Emoji OS.

import type { CustomAvatarConfig } from '../../../../store/teacherStore';

const portraitCache = new Map<string, HTMLCanvasElement>();

function getOrCreateCanvas(key: string, w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void): HTMLCanvasElement {
  if (portraitCache.has(key)) return portraitCache.get(key)!;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  draw(ctx);
  portraitCache.set(key, c);
  return c;
}

export function clearPortraitCache(): void {
  portraitCache.clear();
}

// ══════════════════════════════════════════════════════════════════════════
// 1. MENGGAMBAR NPC DI DALAM DUNIA GAME (CANVAS WORLD)
// ══════════════════════════════════════════════════════════════════════════
export type NpcWorldType =
  | 'prof_raditya'
  | 'kapten_maya'
  | 'dr_gea'
  | 'prof_andini'
  | 'inspektur_budi'
  | 'komandan_hendra'
  | 'prof_sarah'
  | 'dr_bayu'
  | 'dr_danang'
  | 'petugas_rudi'
  | 'komandan_surya'
  | 'dr_fajar'
  | 'prof_ratna'
  | 'dr_aris'
  | 'petugas_joko'
  | 'komandan_teguh'
  | 'dr_bagus'
  | 'prof_lestari'
  | 'dr_farhan'
  | 'petugas_dian'
  | 'komandan_bintang'
  | 'dr_taufik'
  | 'prof_maya'
  | 'dr_citra'
  | 'prof_ilham'
  | 'komandan_satria'
  | 'komandan_arya'
  | 'komandan_guntur'
  | 'dr_maya_trans'
  | 'prof_sarah_trans'
  | 'dr_taufik_trans'
  | 'petugas_rudi_trans';

export function drawNpcOnWorld(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  type: NpcWorldType,
  dir: 'left' | 'right',
  isWalking: boolean,
  frame: number,
  zoneId?: string,
): void {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.scale(dir === 'left' ? -1 : 1, 1);

  // Bobbing animasi jalan (2 frame) atau idle bernapas (frame % 60)
  const walkStep = isWalking ? Math.floor(frame / 8) % 2 : 0;
  const breathY = !isWalking ? Math.sin(frame * 0.06) * 1 : 0;

  if (type === 'prof_raditya') {
    // ── PROF. RADITYA (AHLI GEOLOGI SENIOR) ──
    const drawX = -12;
    const drawY = -32 + breathY;

    // Kaki & Sepatu Lapangan Cokelat Tua
    ctx.fillStyle = '#451a03';
    if (walkStep === 0) {
      ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
      ctx.fillRect(drawX + 13, drawY + 26, 5, 6);
    } else {
      ctx.fillRect(drawX + 4, drawY + 25, 5, 7);
      ctx.fillRect(drawX + 15, drawY + 27, 5, 5);
    }

    // Celana Khaki Lapangan
    ctx.fillStyle = '#a16207';
    ctx.fillRect(drawX + 6, drawY + 20, 12, 7);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(drawX + 11, drawY + 20, 2, 7); // Belahan celana

    // Sabuk Peralatan & Kantong Palu Geologi
    ctx.fillStyle = '#271002';
    ctx.fillRect(drawX + 5, drawY + 18, 14, 3);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(drawX + 4, drawY + 19, 2, 5); // Palu batu kecil menggantung

    // Badan: Rompi/Kemeja Safari Cokelat Muda
    ctx.fillStyle = '#d97706';
    ctx.fillRect(drawX + 6, drawY + 10, 12, 9);
    ctx.fillStyle = '#fef3c7'; // Dasi/Kerah kemeja putih
    ctx.fillRect(drawX + 10, drawY + 10, 4, 5);
    ctx.fillStyle = '#b45309'; // Saku rompi kiri-kanan
    ctx.fillRect(drawX + 7, drawY + 13, 3, 3);
    ctx.fillRect(drawX + 14, drawY + 13, 3, 3);

    // Lengan & Tangan
    ctx.fillStyle = '#d97706';
    ctx.fillRect(drawX + 4, drawY + 11, 2, 7);
    ctx.fillRect(drawX + 18, drawY + 11, 2, 7);
    ctx.fillStyle = '#fcd34d'; // Kulit tangan
    ctx.fillRect(drawX + 4, drawY + 18, 2, 2);
    ctx.fillRect(drawX + 18, drawY + 18, 2, 2);

    // Kepala & Wajah (Kulit Hangat)
    ctx.fillStyle = '#fcd34d';
    ctx.fillRect(drawX + 7, drawY + 3, 10, 8);

    // Rambut Cokelat Beruban Halus
    ctx.fillStyle = '#52525b';
    ctx.fillRect(drawX + 6, drawY + 1, 12, 3);
    ctx.fillRect(drawX + 6, drawY + 3, 2, 4);

    // Kacamata Geologis Bulat
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(drawX + 11, drawY + 5, 5, 4);
    ctx.fillStyle = '#38bdf8'; // Lensa biru reflektif
    ctx.fillRect(drawX + 12, drawY + 6, 3, 2);

    // Topi Rimba Geologis (Safari Boonie Hat)
    ctx.fillStyle = '#b45309';
    ctx.fillRect(drawX + 4, drawY + 0, 16, 3); // Daun topi
    ctx.fillStyle = '#d97706';
    ctx.fillRect(drawX + 7, drawY - 3, 10, 4); // Kubah topi
    ctx.fillStyle = '#78350f';
    ctx.fillRect(drawX + 7, drawY - 1, 10, 1); // Pita topi
  } else if (type === 'kapten_maya') {
    // ── KAPTEN MAYA (KEPALA TIM PEMBORAN RIG) ──
    const drawX = -12;
    const drawY = -32 + breathY;

    // Sepatu Safety Hitam-Baja
    ctx.fillStyle = '#0f172a';
    if (walkStep === 0) {
      ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
      ctx.fillRect(drawX + 13, drawY + 26, 5, 6);
    } else {
      ctx.fillRect(drawX + 4, drawY + 25, 5, 7);
      ctx.fillRect(drawX + 15, drawY + 27, 5, 5);
    }

    // Celana Cargo Navy Industri
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(drawX + 6, drawY + 19, 12, 8);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(drawX + 11, drawY + 19, 2, 8);

    // Badan: Rompi Keselamatan High-Vis Oranye & Kuning Reflektif
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(drawX + 6, drawY + 10, 12, 10);
    ctx.fillStyle = '#facc15'; // Strip scotlight kuning
    ctx.fillRect(drawX + 6, drawY + 13, 12, 2);
    ctx.fillRect(drawX + 6, drawY + 17, 12, 1);
    ctx.fillStyle = '#ffffff'; // Strip putih reflektor
    ctx.fillRect(drawX + 8, drawY + 13, 8, 2);

    // Lengan & Tablet Komputer Geologis
    ctx.fillStyle = '#c2410c';
    ctx.fillRect(drawX + 4, drawY + 11, 2, 7);
    ctx.fillRect(drawX + 18, drawY + 11, 2, 7);
    ctx.fillStyle = '#fed7aa'; // Tangan
    ctx.fillRect(drawX + 4, drawY + 18, 2, 2);
    ctx.fillRect(drawX + 18, drawY + 17, 3, 4);
    // Tablet di tangan kanan
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(drawX + 19, drawY + 15, 4, 6);
    ctx.fillStyle = '#00f0ff'; // Layar scanner tablet menyala
    ctx.fillRect(drawX + 20, drawY + 16, 2, 4);

    // Wajah & Senyum Ramah
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(drawX + 7, drawY + 3, 10, 8);
    ctx.fillStyle = '#0f172a'; // Mata
    ctx.fillRect(drawX + 13, drawY + 6, 2, 2);
    ctx.fillStyle = '#fb7185'; // Pipi merona
    ctx.fillRect(drawX + 12, drawY + 8, 2, 1);

    // Rambut Hitam Terikat Rapi
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(drawX + 6, drawY + 2, 12, 3);
    ctx.fillRect(drawX + 5, drawY + 4, 3, 6); // Kuncir belakang

    // Helm Keselamatan Konstruksi Oranye + Lampu Kepala (Mining Lamp)
    ctx.fillStyle = '#f97316';
    ctx.fillRect(drawX + 5, drawY - 1, 14, 3); // Bibir helm
    ctx.fillRect(drawX + 7, drawY - 4, 10, 4); // Kubah helm
    ctx.fillStyle = '#c2410c';
    ctx.fillRect(drawX + 7, drawY - 2, 10, 1);
    // Lampu Sorot Helm Depan
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(drawX + 14, drawY - 3, 4, 3);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(drawX + 15, drawY - 2, 2, 1);
  } else if (type === 'dr_gea') {
    // ── DR. GEA (AHLI MINERALOGI & LITOLOGI KERAK) ──
    const drawX = -12;
    const drawY = -32 + breathY;

    // Sepatu bot kerja abu-abu slate
    ctx.fillStyle = '#1e293b';
    if (walkStep === 0) {
      ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
      ctx.fillRect(drawX + 13, drawY + 26, 5, 6);
    } else {
      ctx.fillRect(drawX + 4, drawY + 25, 5, 7);
      ctx.fillRect(drawX + 15, drawY + 27, 5, 5);
    }

    // Celana kerja slate
    ctx.fillStyle = '#334155';
    ctx.fillRect(drawX + 6, drawY + 19, 12, 8);

    // Baju dalam cyan cerah & Jas lab putih mineralogi
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(drawX + 8, drawY + 10, 8, 9);
    ctx.fillStyle = '#f8fafc'; // Jas laboratorium putih
    ctx.fillRect(drawX + 5, drawY + 10, 4, 10);
    ctx.fillRect(drawX + 15, drawY + 10, 4, 10);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(drawX + 6, drawY + 13, 2, 3); // Saku jas

    // Tangan kiri memegang palu geologis kecil
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(drawX + 3, drawY + 11, 3, 6);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(drawX + 3, drawY + 17, 2, 2);
    // Palu geologi mini
    ctx.fillStyle = '#64748b';
    ctx.fillRect(drawX + 2, drawY + 16, 2, 6);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(drawX + 1, drawY + 15, 4, 2);

    // Tangan kanan
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(drawX + 18, drawY + 11, 3, 6);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(drawX + 18, drawY + 17, 2, 2);

    // Wajah & Kacamata Laboratorium
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(drawX + 7, drawY + 3, 10, 8);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(drawX + 13, drawY + 6, 2, 2); // Mata
    ctx.fillStyle = '#0284c7'; // Frame kacamata oval
    ctx.fillRect(drawX + 11, drawY + 5, 5, 3);
    ctx.fillStyle = '#bae6fd';
    ctx.fillRect(drawX + 12, drawY + 6, 3, 1);

    // Rambut cokelat kemerahan sanggul rapi dengan tusuk rambut cyan
    ctx.fillStyle = '#451a03';
    ctx.fillRect(drawX + 6, drawY + 1, 12, 3);
    ctx.fillRect(drawX + 5, drawY + 3, 3, 5);
    ctx.fillRect(drawX + 9, drawY - 3, 6, 5); // Sanggul atas
    ctx.fillStyle = '#22d3ee'; // Tusuk rambut mineral
    ctx.fillRect(drawX + 8, drawY - 2, 8, 1);
  } else if (type === 'prof_andini') {
    // ── PROF. ANDINI (PENELITI KOMPARASI KERAK BUMI) ──
    const drawX = -12;
    const drawY = -32 + breathY;

    // Sepatu hiking cokelat
    ctx.fillStyle = '#78350f';
    if (walkStep === 0) {
      ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
      ctx.fillRect(drawX + 13, drawY + 26, 5, 6);
    } else {
      ctx.fillRect(drawX + 4, drawY + 25, 5, 7);
      ctx.fillRect(drawX + 15, drawY + 27, 5, 5);
    }

    // Celana khaki ekspedisi
    ctx.fillStyle = '#d97706';
    ctx.fillRect(drawX + 6, drawY + 19, 12, 8);
    ctx.fillStyle = '#92400e';
    ctx.fillRect(drawX + 11, drawY + 19, 2, 8);

    // Badan: Rompi Ungu/Violet elegan di atas kaos lilac
    ctx.fillStyle = '#7c3aed';
    ctx.fillRect(drawX + 6, drawY + 10, 12, 10);
    ctx.fillStyle = '#e9d5ff'; // Kerah lilac
    ctx.fillRect(drawX + 9, drawY + 10, 6, 4);
    ctx.fillStyle = '#c084fc'; // Saku rompi
    ctx.fillRect(drawX + 7, drawY + 14, 3, 3);
    ctx.fillRect(drawX + 14, drawY + 14, 3, 3);

    // Tangan kanan memegang Datapad Survei Holografis menyala hijau
    ctx.fillStyle = '#7c3aed';
    ctx.fillRect(drawX + 4, drawY + 11, 2, 7);
    ctx.fillRect(drawX + 18, drawY + 11, 2, 7);
    ctx.fillStyle = '#f5af7e';
    ctx.fillRect(drawX + 4, drawY + 18, 2, 2);
    ctx.fillRect(drawX + 18, drawY + 17, 3, 3);
    // Datapad
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(drawX + 19, drawY + 14, 5, 7);
    ctx.fillStyle = '#10b981'; // Layar data komparasi menyala
    ctx.fillRect(drawX + 20, drawY + 15, 3, 5);

    // Wajah & Senyum ramah
    ctx.fillStyle = '#f5af7e';
    ctx.fillRect(drawX + 7, drawY + 3, 10, 8);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(drawX + 13, drawY + 6, 2, 2);
    ctx.fillStyle = '#f43f5e'; // Pipi
    ctx.fillRect(drawX + 12, drawY + 8, 2, 1);

    // Kacamata modis emas
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(drawX + 11, drawY + 5, 5, 3);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(drawX + 12, drawY + 6, 3, 1);

    // Rambut ikal cokelat tua bergelombang
    ctx.fillStyle = '#2e1065';
    ctx.fillRect(drawX + 6, drawY + 0, 12, 4);
    ctx.fillRect(drawX + 5, drawY + 3, 3, 6);
    ctx.fillRect(drawX + 15, drawY + 3, 3, 6);
  } else if (type === 'inspektur_budi') {
    // ── INSPEKTUR BUDI (GEOFISIKAWAN STASIUN MOHO) ──
    const drawX = -12;
    const drawY = -32 + breathY;

    // Sepatu bot baja keselamatan
    ctx.fillStyle = '#0f172a';
    if (walkStep === 0) {
      ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
      ctx.fillRect(drawX + 13, drawY + 26, 5, 6);
    } else {
      ctx.fillRect(drawX + 4, drawY + 25, 5, 7);
      ctx.fillRect(drawX + 15, drawY + 27, 5, 5);
    }

    // Baju tambang/surveyor tahan panas hijau zaitun (Olive)
    ctx.fillStyle = '#15803d';
    ctx.fillRect(drawX + 6, drawY + 10, 12, 17);
    ctx.fillStyle = '#facc15'; // Garis reflektor kuning menyala
    ctx.fillRect(drawX + 6, drawY + 15, 12, 2);
    ctx.fillRect(drawX + 6, drawY + 21, 12, 1);

    // Alat Seismometer Portabel di tangan kanan
    ctx.fillStyle = '#166534';
    ctx.fillRect(drawX + 4, drawY + 11, 2, 7);
    ctx.fillRect(drawX + 18, drawY + 11, 2, 7);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(drawX + 4, drawY + 18, 2, 2);
    ctx.fillRect(drawX + 18, drawY + 17, 3, 3);
    // Seismograf portable
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(drawX + 19, drawY + 15, 4, 6);
    ctx.fillStyle = '#ef4444'; // Lampu indikator anomali seismik merah
    ctx.fillRect(drawX + 20, drawY + 16, 2, 2);

    // Wajah & Jenggot tebal
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(drawX + 7, drawY + 3, 10, 8);
    ctx.fillStyle = '#3f3f46'; // Jenggot & kumis
    ctx.fillRect(drawX + 8, drawY + 8, 8, 3);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(drawX + 13, drawY + 5, 2, 2);

    // Helm Keselamatan Tambang Kuning Terang + Lampu LED
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(drawX + 5, drawY - 1, 14, 3);
    ctx.fillStyle = '#eab308';
    ctx.fillRect(drawX + 7, drawY - 4, 10, 4);
    // Lampu Sorot LED menyala putih-kuning
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(drawX + 13, drawY - 3, 4, 3);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(drawX + 14, drawY - 2, 2, 1);
  } else if (type === 'komandan_hendra') {
    // ── KOMANDAN HENDRA (KEPALA PENJAGA GERBANG SEISMIK MOHO) ──
    const drawX = -12;
    const drawY = -32 + breathY;

    // Sepatu lars militer hitam mengkilap
    ctx.fillStyle = '#020617';
    if (walkStep === 0) {
      ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
      ctx.fillRect(drawX + 13, drawY + 26, 5, 6);
    } else {
      ctx.fillRect(drawX + 4, drawY + 25, 5, 7);
      ctx.fillRect(drawX + 15, drawY + 27, 5, 5);
    }

    // Celana taktis perwira navy
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(drawX + 6, drawY + 19, 12, 8);

    // Jaket komandan navy dengan tanda pangkat emas & sabuk taktis
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(drawX + 6, drawY + 10, 12, 10);
    ctx.fillStyle = '#eab308'; // Epaulet bahu emas
    ctx.fillRect(drawX + 5, drawY + 10, 3, 2);
    ctx.fillRect(drawX + 16, drawY + 10, 3, 2);
    ctx.fillStyle = '#f59e0b'; // Lencana dada
    ctx.fillRect(drawX + 8, drawY + 13, 3, 3);
    ctx.fillStyle = '#78350f'; // Sabuk komando
    ctx.fillRect(drawX + 6, drawY + 17, 12, 2);
    ctx.fillStyle = '#facc15'; // Gesper emas
    ctx.fillRect(drawX + 11, drawY + 17, 2, 2);

    // Lengan tegap
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(drawX + 4, drawY + 11, 2, 7);
    ctx.fillRect(drawX + 18, drawY + 11, 2, 7);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(drawX + 4, drawY + 18, 2, 2);
    ctx.fillRect(drawX + 18, drawY + 18, 2, 2);

    // Wajah tegas berwibawa
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(drawX + 7, drawY + 3, 10, 8);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(drawX + 13, drawY + 6, 2, 2); // Mata tegas
    ctx.fillStyle = '#71717a'; // Alis berkarakter
    ctx.fillRect(drawX + 12, drawY + 4, 3, 1);

    // Baret Militer Taktis Navy dengan Emblem Seismik Emas
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(drawX + 5, drawY + 1, 14, 3);
    ctx.fillRect(drawX + 7, drawY - 2, 10, 4);
    ctx.fillRect(drawX + 15, drawY - 1, 3, 3); // Lengkungan baret
    ctx.fillStyle = '#fbbf24'; // Emblem komando emas
    ctx.fillRect(drawX + 9, drawY - 1, 3, 3);
  } else if (type === 'prof_sarah') {
    // ── PROF. SARAH (AHLI ARUS PANAS MANTEL) ──
    const drawX = -12;
    const drawY = -32 + breathY;
    // Sepatu bot gelap
    ctx.fillStyle = '#292524';
    ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
    ctx.fillRect(drawX + 13, drawY + 26, 5, 6);
    // Celana tahan panas abu-abu gelap
    ctx.fillStyle = '#44403c';
    ctx.fillRect(drawX + 6, drawY + 19, 12, 8);
    // Rompi geotermal oranye bata dengan aksen kuning
    ctx.fillStyle = '#c2410c';
    ctx.fillRect(drawX + 6, drawY + 10, 12, 9);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(drawX + 10, drawY + 10, 4, 5); // Kerah emas
    ctx.fillStyle = '#9a3412';
    ctx.fillRect(drawX + 7, drawY + 13, 3, 3);
    ctx.fillRect(drawX + 14, drawY + 13, 3, 3);
    // Tangan & Wajah
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(drawX + 4, drawY + 18, 2, 2);
    ctx.fillRect(drawX + 18, drawY + 18, 2, 2);
    ctx.fillRect(drawX + 7, drawY + 3, 10, 8);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(drawX + 13, drawY + 6, 2, 2); // Mata
    ctx.fillStyle = '#f97316'; // Kacamata penelitian
    ctx.fillRect(drawX + 11, drawY + 5, 5, 3);
    // Rambut cokelat kemerahan dikuncir
    ctx.fillStyle = '#571c0c';
    ctx.fillRect(drawX + 6, drawY + 1, 12, 3);
    ctx.fillRect(drawX + 5, drawY + 3, 3, 5);
    ctx.fillRect(drawX + 16, drawY + 3, 3, 4); // Kuncir belakang
  } else if (type === 'dr_bayu') {
    // ── DR. BAYU (AHLI ALIRAN BATUAN MANTEL) ──
    const drawX = -12;
    const drawY = -32 + breathY;
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
    ctx.fillRect(drawX + 13, drawY + 26, 5, 6);
    ctx.fillStyle = '#52525b';
    ctx.fillRect(drawX + 6, drawY + 19, 12, 8);
    // Rompi khaki lapangan
    ctx.fillStyle = '#d97706';
    ctx.fillRect(drawX + 6, drawY + 10, 12, 9);
    ctx.fillStyle = '#fde68a';
    ctx.fillRect(drawX + 10, drawY + 10, 4, 4);
    // Wajah & Helm Proyek Geotermal Kuning
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(drawX + 7, drawY + 4, 10, 7);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(drawX + 13, drawY + 6, 2, 2);
    // Helm kuning
    ctx.fillStyle = '#eab308';
    ctx.fillRect(drawX + 5, drawY + 1, 14, 3);
    ctx.fillRect(drawX + 7, drawY - 2, 10, 3);
    ctx.fillStyle = '#ffffff'; // Lampu helm
    ctx.fillRect(drawX + 15, drawY - 1, 2, 2);
  } else if (type === 'dr_danang') {
    // ── DR. DANANG (AHLI TEKANAN BATUAN MANTEL) ──
    const drawX = -12;
    const drawY = -32 + breathY;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
    ctx.fillRect(drawX + 13, drawY + 26, 5, 6);
    ctx.fillStyle = '#334155';
    ctx.fillRect(drawX + 6, drawY + 19, 12, 8);
    // Jas Lab Putih Sains dengan Aksen Biru
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(drawX + 6, drawY + 10, 12, 9);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(drawX + 10, drawY + 10, 4, 9); // Kemeja dalam cyan
    // Tablet sensor di tangan
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(drawX + 2, drawY + 14, 4, 6);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(drawX + 3, drawY + 15, 2, 4);
    // Wajah & Kacamata
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(drawX + 7, drawY + 3, 10, 8);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(drawX + 13, drawY + 6, 2, 2);
    ctx.fillStyle = '#475569';
    ctx.fillRect(drawX + 11, drawY + 5, 5, 3);
    // Rambut hitam rapi
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(drawX + 6, drawY + 1, 12, 3);
    ctx.fillRect(drawX + 5, drawY + 3, 2, 4);
  } else if (type === 'petugas_rudi') {
    // ── PETUGAS RUDI (PENGAWAS SUHU MANTEL BAWAH) ──
    const drawX = -12;
    const drawY = -32 + breathY;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
    ctx.fillRect(drawX + 13, drawY + 26, 5, 6);
    ctx.fillStyle = '#334155';
    ctx.fillRect(drawX + 6, drawY + 19, 12, 8);
    // Baju pengawas hijau keselamatan
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(drawX + 6, drawY + 10, 12, 9);
    ctx.fillStyle = '#fde047'; // Strip reflektor
    ctx.fillRect(drawX + 6, drawY + 14, 12, 2);
    // Wajah & Visor
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(drawX + 7, drawY + 3, 10, 8);
    ctx.fillStyle = '#0284c7'; // Visor pelindung panas
    ctx.fillRect(drawX + 11, drawY + 5, 6, 3);
    // Topi kerja hijau
    ctx.fillStyle = '#15803d';
    ctx.fillRect(drawX + 5, drawY + 1, 14, 3);
    ctx.fillRect(drawX + 7, drawY - 2, 10, 3);
  } else if (type === 'komandan_surya') {
    // ── KOMANDAN SURYA (PENJAGA PINTU INTI LUAR) ──
    const drawX = -12;
    const drawY = -32 + breathY;
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
    ctx.fillRect(drawX + 13, drawY + 26, 5, 6);
    ctx.fillStyle = '#44403c';
    ctx.fillRect(drawX + 6, drawY + 19, 12, 8);
    // Seragam militer merah bata marun komando
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(drawX + 6, drawY + 10, 12, 9);
    ctx.fillStyle = '#f59e0b'; // Epaulet bahu emas
    ctx.fillRect(drawX + 5, drawY + 10, 3, 2);
    ctx.fillRect(drawX + 16, drawY + 10, 3, 2);
    ctx.fillStyle = '#fbbf24'; // Lencana dada
    ctx.fillRect(drawX + 7, drawY + 13, 3, 3);
    // Wajah tegas
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(drawX + 7, drawY + 3, 10, 8);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(drawX + 13, drawY + 6, 2, 2);
    // Baret Komando Merah dengan Lambang Emas
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(drawX + 5, drawY + 1, 14, 3);
    ctx.fillRect(drawX + 7, drawY - 2, 10, 4);
    ctx.fillRect(drawX + 15, drawY - 1, 3, 3);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(drawX + 9, drawY - 1, 3, 3);
  } else if (type === 'dr_fajar') {
    // ── DR. FAJAR (AHLI GEOLOGI INTI LUAR / PEMANDU LAPANGAN) ──
    const drawX = -12;
    const drawY = -32 + breathY;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
    ctx.fillRect(drawX + 13, drawY + 26, 5, 6);
    ctx.fillStyle = '#334155';
    ctx.fillRect(drawX + 6, drawY + 19, 12, 8);
    // Baju pelindung panas biru cyan perak
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(drawX + 6, drawY + 10, 12, 9);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(drawX + 9, drawY + 12, 6, 5);
    // Wajah & Visor Elektromagnetik
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(drawX + 7, drawY + 3, 10, 8);
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(drawX + 11, drawY + 5, 6, 3);
    // Helm pelindung biru perak
    ctx.fillStyle = '#0369a1';
    ctx.fillRect(drawX + 5, drawY + 1, 14, 3);
    ctx.fillRect(drawX + 7, drawY - 2, 10, 3);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(drawX + 15, drawY - 3, 2, 3); // Antena sensor
  } else if (type === 'prof_ratna') {
    // ── PROF. RATNA (PENELITI LOGAM CAIR INTI LUAR) ──
    const drawX = -12;
    const drawY = -32 + breathY;
    ctx.fillStyle = '#292524';
    ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
    ctx.fillRect(drawX + 13, drawY + 26, 5, 6);
    ctx.fillStyle = '#44403c';
    ctx.fillRect(drawX + 6, drawY + 19, 12, 8);
    // Jas lab pelindung panas emas-amber
    ctx.fillStyle = '#d97706';
    ctx.fillRect(drawX + 6, drawY + 10, 12, 9);
    ctx.fillStyle = '#fef3c7'; // Kerah baju lab putih
    ctx.fillRect(drawX + 9, drawY + 10, 6, 4);
    // Wajah & Kacamata sains
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(drawX + 7, drawY + 3, 10, 8);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(drawX + 11, drawY + 5, 5, 2);
    // Rambut cokelat tua dikuncir rapi
    ctx.fillStyle = '#451a03';
    ctx.fillRect(drawX + 5, drawY + 1, 14, 3);
    ctx.fillRect(drawX + 5, drawY + 4, 3, 5);
    ctx.fillRect(drawX + 16, drawY + 4, 3, 5);
    ctx.fillRect(drawX + 17, drawY + 2, 3, 3); // Kuncir rambut belakang
  } else if (type === 'dr_aris') {
    // ── DR. ARIS (AHLI MEDAN MAGNET & GEODYNAMO) ──
    const drawX = -12;
    const drawY = -32 + breathY;
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
    ctx.fillRect(drawX + 13, drawY + 26, 5, 6);
    ctx.fillStyle = '#312e81';
    ctx.fillRect(drawX + 6, drawY + 19, 12, 8);
    // Seragam indigo elektromagnetik
    ctx.fillStyle = '#4338ca';
    ctx.fillRect(drawX + 6, drawY + 10, 12, 9);
    ctx.fillStyle = '#818cf8'; // Lencana sensor magnetik
    ctx.fillRect(drawX + 8, drawY + 12, 4, 4);
    // Wajah & Kacamata
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(drawX + 7, drawY + 3, 10, 8);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(drawX + 13, drawY + 6, 2, 2);
    // Rambut rapi gelap
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(drawX + 6, drawY + 1, 12, 3);
    ctx.fillRect(drawX + 5, drawY + 3, 2, 3);
  } else if (type === 'petugas_joko') {
    // ── PETUGAS JOKO (PENGAWAS RADIASI MAGNETIK) ──
    const drawX = -12;
    const drawY = -32 + breathY;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
    ctx.fillRect(drawX + 13, drawY + 26, 5, 6);
    ctx.fillStyle = '#334155';
    ctx.fillRect(drawX + 6, drawY + 19, 12, 8);
    // Baju hazard putih-perak dengan strip keselamatan kuning
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(drawX + 6, drawY + 10, 12, 9);
    ctx.fillStyle = '#eab308'; // Pita reflektor
    ctx.fillRect(drawX + 6, drawY + 14, 12, 2);
    // Wajah & Visor
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(drawX + 7, drawY + 3, 10, 8);
    ctx.fillStyle = '#10b981'; // Visor hijau anti-radiasi
    ctx.fillRect(drawX + 11, drawY + 5, 6, 3);
    // Helm keselamatan kuning cerah
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(drawX + 5, drawY + 1, 14, 3);
    ctx.fillRect(drawX + 7, drawY - 2, 10, 3);
  } else if (type === 'komandan_teguh') {
    // ── KOMANDAN TEGUH (PENJAGA PINTU INTI DALAM) ──
    const drawX = -12;
    const drawY = -32 + breathY;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
    ctx.fillRect(drawX + 13, drawY + 26, 5, 6);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(drawX + 6, drawY + 19, 12, 8);
    // Armor komando merah marun tua & baja
    ctx.fillStyle = '#881337';
    ctx.fillRect(drawX + 6, drawY + 10, 12, 9);
    ctx.fillStyle = '#f59e0b'; // Epaulet emas
    ctx.fillRect(drawX + 5, drawY + 10, 3, 2);
    ctx.fillRect(drawX + 16, drawY + 10, 3, 2);
    ctx.fillStyle = '#fbbf24'; // Bintang dada pelindung inti
    ctx.fillRect(drawX + 7, drawY + 13, 4, 3);
    // Wajah tegas
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(drawX + 7, drawY + 3, 10, 8);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(drawX + 13, drawY + 6, 2, 2);
    // Topi Perwira / Baret Komando Merah Gelap dengan Lambang Bintang Emas
    ctx.fillStyle = '#9f1239';
    ctx.fillRect(drawX + 5, drawY + 1, 14, 3);
    ctx.fillRect(drawX + 6, drawY - 2, 12, 4);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(drawX + 10, drawY - 1, 3, 3);
  } else if (type === 'dr_bagus') {
    // ── DR. BAGUS (PEMANDU GEOFISIKA INTI DALAM) ──
    const drawX = -12;
    const drawY = -32 + breathY;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
    ctx.fillRect(drawX + 13, drawY + 26, 5, 6);
    ctx.fillStyle = '#334155';
    ctx.fillRect(drawX + 6, drawY + 19, 12, 8);
    // Jas amber emas geofisika
    ctx.fillStyle = '#d97706';
    ctx.fillRect(drawX + 6, drawY + 10, 12, 9);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(drawX + 10, drawY + 10, 4, 9);
    // Wajah ramah & kacamata pelindung radiasi
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(drawX + 7, drawY + 3, 10, 8);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(drawX + 9, drawY + 5, 8, 3);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(drawX + 12, drawY + 6, 2, 2);
    // Rambut cokelat tersisir rapi
    ctx.fillStyle = '#78350f';
    ctx.fillRect(drawX + 6, drawY + 1, 12, 3);
    ctx.fillRect(drawX + 7, drawY - 2, 10, 3);
  } else if (type === 'prof_lestari') {
    // ── PROF. LESTARI (PENELITI KRISTAL BESI INTI DALAM) ──
    const drawX = -12;
    const drawY = -32 + breathY;
    ctx.fillStyle = '#3b0764';
    ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
    ctx.fillRect(drawX + 13, drawY + 26, 5, 6);
    ctx.fillStyle = '#581c87';
    ctx.fillRect(drawX + 6, drawY + 19, 12, 8);
    // Jas lab kristal ungu violet & liontin kristal
    ctx.fillStyle = '#7e22ce';
    ctx.fillRect(drawX + 6, drawY + 10, 12, 9);
    ctx.fillStyle = '#e9d5ff';
    ctx.fillRect(drawX + 10, drawY + 12, 4, 4);
    // Wajah cerdas
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(drawX + 7, drawY + 3, 10, 8);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(drawX + 12, drawY + 6, 2, 2);
    // Kacamata prisma kristal
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(drawX + 10, drawY + 5, 5, 2);
    // Rambut ungu tua bergelombang dengan jepit kristal emas
    ctx.fillStyle = '#3b0764';
    ctx.fillRect(drawX + 6, drawY + 1, 12, 3);
    ctx.fillRect(drawX + 7, drawY - 2, 11, 4);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(drawX + 14, drawY + 1, 3, 3);
  } else if (type === 'dr_farhan') {
    // ── DR. FARHAN (AHLI GRAVITASI PUSAT BUMI) ──
    const drawX = -12;
    const drawY = -32 + breathY;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
    ctx.fillRect(drawX + 13, drawY + 26, 5, 6);
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(drawX + 6, drawY + 19, 12, 8);
    // Mantel indigo kosmik gravitasi & scanner cyan
    ctx.fillStyle = '#3730a3';
    ctx.fillRect(drawX + 6, drawY + 10, 12, 9);
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(drawX + 4, drawY + 14, 3, 4); // Alat scanner gravitasi
    // Wajah fokus
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(drawX + 7, drawY + 3, 10, 8);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(drawX + 12, drawY + 6, 2, 2);
    // Headset komunikasi cyan & rambut hitam
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(drawX + 6, drawY + 1, 12, 3);
    ctx.fillRect(drawX + 7, drawY - 2, 10, 3);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(drawX + 5, drawY + 4, 2, 4);
  } else if (type === 'petugas_dian') {
    // ── PETUGAS DIAN (PENGAWAS KAPSUL EVAKUASI INTI) ──
    const drawX = -12;
    const drawY = -32 + breathY;
    ctx.fillStyle = '#064e3b';
    ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
    ctx.fillRect(drawX + 13, drawY + 26, 5, 6);
    ctx.fillStyle = '#065f46';
    ctx.fillRect(drawX + 6, drawY + 19, 12, 8);
    // Wearpack tekanan tinggi zamrud & sabuk keselamatan lime
    ctx.fillStyle = '#059669';
    ctx.fillRect(drawX + 6, drawY + 10, 12, 9);
    ctx.fillStyle = '#84cc16';
    ctx.fillRect(drawX + 6, drawY + 16, 12, 2);
    // Wajah
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(drawX + 7, drawY + 3, 10, 8);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(drawX + 12, drawY + 6, 2, 2);
    // Helm pelindung tekanan tinggi hijau dengan visor emas
    ctx.fillStyle = '#10b981';
    ctx.fillRect(drawX + 5, drawY + 1, 14, 3);
    ctx.fillRect(drawX + 6, drawY - 2, 12, 4);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(drawX + 10, drawY + 1, 6, 2);
  } else if (type === 'komandan_bintang') {
    // ── KOMANDAN BINTANG (KEPALA EKSPEDISI PUSAT BUMI) ──
    const drawX = -12;
    const drawY = -32 + breathY;
    ctx.fillStyle = '#020617';
    ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
    ctx.fillRect(drawX + 13, drawY + 26, 5, 6);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(drawX + 6, drawY + 19, 12, 8);
    // Seragam komando biru laut agung & ornamen bintang emas murni
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(drawX + 6, drawY + 10, 12, 9);
    ctx.fillStyle = '#eab308'; // Epaulet emas besar
    ctx.fillRect(drawX + 4, drawY + 10, 4, 2);
    ctx.fillRect(drawX + 14, drawY + 10, 4, 2);
    ctx.fillStyle = '#fde047'; // Lencana bintang agung di dada
    ctx.fillRect(drawX + 8, drawY + 12, 4, 4);
    // Wajah berwibawa
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(drawX + 7, drawY + 3, 10, 8);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(drawX + 13, drawY + 6, 2, 2);
    // Topi Komandan Tertinggi dengan Bintang Emas Berkilau
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(drawX + 5, drawY + 1, 14, 3);
    ctx.fillRect(drawX + 6, drawY - 2, 12, 4);
    ctx.fillStyle = '#eab308';
    ctx.fillRect(drawX + 9, drawY - 1, 4, 3);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(drawX + 10, drawY, 2, 1);
  } else if (type === 'dr_taufik') {
    // ── DR. TAUFIK (PEMANDU GEOLOGIS PANGEA) ──
    const drawX = -12;
    const drawY = -32 + breathY;
    ctx.fillStyle = '#78350f';
    ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
    ctx.fillRect(drawX + 13, drawY + 26, 5, 6);
    ctx.fillStyle = '#92400e';
    ctx.fillRect(drawX + 6, drawY + 19, 12, 8);
    // Jaket lapangan safari safari khaki & kantong kompas
    ctx.fillStyle = '#d97706';
    ctx.fillRect(drawX + 6, drawY + 10, 12, 9);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(drawX + 7, drawY + 13, 4, 4);
    ctx.fillRect(drawX + 13, drawY + 13, 4, 4);
    // Wajah
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(drawX + 7, drawY + 3, 10, 8);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(drawX + 12, drawY + 6, 2, 2);
    // Topi rimba penjelajah safari
    ctx.fillStyle = '#b45309';
    ctx.fillRect(drawX + 4, drawY + 1, 16, 3);
    ctx.fillRect(drawX + 6, drawY - 2, 12, 3);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(drawX + 6, drawY + 1, 12, 1);
  } else if (type === 'prof_maya') {
    // ── PROF. MAYA (AHLI REKONSTRUKSI SUPERBENUA PANGEA) ──
    const drawX = -12;
    const drawY = -32 + breathY;
    ctx.fillStyle = '#3b0764';
    ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
    ctx.fillRect(drawX + 13, drawY + 26, 5, 6);
    ctx.fillStyle = '#581c87';
    ctx.fillRect(drawX + 6, drawY + 19, 12, 8);
    // Mantel ungu terpelajar & syal perak
    ctx.fillStyle = '#7e22ce';
    ctx.fillRect(drawX + 6, drawY + 10, 12, 9);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(drawX + 9, drawY + 10, 6, 4);
    // Wajah & Kacamata sains cyan
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(drawX + 7, drawY + 3, 10, 8);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(drawX + 11, drawY + 5, 4, 3);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(drawX + 12, drawY + 6, 2, 2);
    // Rambut sanggul rapi gelap dengan jepit perak
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(drawX + 6, drawY + 1, 12, 4);
    ctx.fillRect(drawX + 7, drawY - 2, 10, 3);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(drawX + 5, drawY + 3, 2, 2);
  } else if (type === 'dr_citra') {
    // ── DR. CITRA (PENELITI RANTAI PEGUNUNGAN KEMBAR) ──
    const drawX = -12;
    const drawY = -32 + breathY;
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
    ctx.fillRect(drawX + 13, drawY + 26, 5, 6);
    ctx.fillStyle = '#292524';
    ctx.fillRect(drawX + 6, drawY + 19, 12, 8);
    // Rompi lapangan terakota & emblem geologi hijau
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(drawX + 6, drawY + 10, 12, 9);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(drawX + 8, drawY + 12, 3, 3);
    // Wajah
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(drawX + 7, drawY + 3, 10, 8);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(drawX + 12, drawY + 6, 2, 2);
    // Bandana / topi lapangan hijau zamrud
    ctx.fillStyle = '#047857';
    ctx.fillRect(drawX + 5, drawY + 1, 14, 3);
    ctx.fillRect(drawX + 6, drawY - 1, 12, 2);
  } else if (type === 'prof_ilham') {
    // ── PROF. ILHAM (AHLI PEMEKARAN KERAK SAMUDRA BARU) ──
    const drawX = -12;
    const drawY = -32 + breathY;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
    ctx.fillRect(drawX + 13, drawY + 26, 5, 6);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(drawX + 6, drawY + 19, 12, 8);
    // Jas laboratorium biru samudra dengan sensor termal cyan
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(drawX + 6, drawY + 10, 12, 9);
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(drawX + 9, drawY + 12, 6, 2);
    // Wajah
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(drawX + 7, drawY + 3, 10, 8);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(drawX + 12, drawY + 6, 2, 2);
    // Visor sensor kepala cyan bercahaya
    ctx.fillStyle = '#334155';
    ctx.fillRect(drawX + 6, drawY + 1, 12, 3);
    ctx.fillRect(drawX + 7, drawY - 2, 10, 3);
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(drawX + 11, drawY + 1, 5, 2);
  } else if (type === 'komandan_satria' || type === 'komandan_arya') {
    // ── KOMANDAN SATRIA & KOMANDAN ARYA (KEPALA PENJAGA GERBANG) ──
    const drawX = -12;
    const drawY = -32 + breathY;
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
    ctx.fillRect(drawX + 13, drawY + 26, 5, 6);
    ctx.fillStyle = '#292524';
    ctx.fillRect(drawX + 6, drawY + 19, 12, 8);
    // Zirah komando taktis crimson-obsidian & ornamen epaulet perak
    ctx.fillStyle = '#881337';
    ctx.fillRect(drawX + 6, drawY + 10, 12, 9);
    ctx.fillStyle = '#e2e8f0'; // Epaulet perak
    ctx.fillRect(drawX + 4, drawY + 10, 4, 2);
    ctx.fillRect(drawX + 14, drawY + 10, 4, 2);
    ctx.fillStyle = '#f43f5e'; // Lencana perisai tektonik di dada
    ctx.fillRect(drawX + 9, drawY + 12, 4, 4);
    // Wajah tegas
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(drawX + 7, drawY + 3, 10, 8);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(drawX + 13, drawY + 6, 2, 2);
    // Topi perwira baret komando crimson dengan emblem perak
    ctx.fillStyle = '#4c0519';
    ctx.fillRect(drawX + 5, drawY + 1, 14, 3);
    ctx.fillRect(drawX + 6, drawY - 2, 12, 4);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(drawX + 10, drawY - 1, 3, 3);
  } else if (
    type === 'dr_maya_trans' ||
    type === 'prof_sarah_trans' ||
    type === 'dr_taufik_trans' ||
    type === 'petugas_rudi_trans' ||
    type === 'komandan_guntur'
  ) {
    // ══════════════════════════════════════════════════════════════════════
    // PERSPEKTIF TOP-DOWN / HIGH-ANGLE OVERHEAD UNTUK AREA BATAS TRANSFORM
    // Menampilkan kepala, pundak, bayangan oval di tanah, dan gerakan langkah 4-arah.
    // ══════════════════════════════════════════════════════════════════════
    const legOffset = isWalking ? Math.sin(frame * 0.25) * 3 : 0;
    const breathScale = !isWalking ? Math.sin(frame * 0.06) * 0.5 : 0;

    // 1. Bayangan jatuh di tanah gurun di bawah kaki NPC (Top-down shadow)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 11, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Kaki & Sepatu dari Atas
    if (type === 'komandan_guntur') {
      ctx.fillStyle = '#1c1917'; // Sepatu taktis hitam
    } else if (type === 'dr_maya_trans') {
      ctx.fillStyle = '#334155'; // Sepatu riset lab
    } else if (type === 'prof_sarah_trans') {
      ctx.fillStyle = '#451a03'; // Sepatu bot lapangan cokelat
    } else if (type === 'dr_taufik_trans') {
      ctx.fillStyle = '#1e293b'; // Sepatu safety geofisika
    } else {
      ctx.fillStyle = '#292524'; // Sepatu kerja SAR
    }
    ctx.fillRect(-7, -4 - legOffset, 5, 8);
    ctx.fillRect(2, -4 + legOffset, 5, 8);

    // 3. Badan & Pundak (Shoulders & Torso from Above)
    if (type === 'komandan_guntur') {
      // Zirah komando taktis gurun amber-khaki dengan epaulet komandan emas
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-10, -18 + breathScale, 20, 14);
      // Epaulet bahu emas
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-11, -17 + breathScale, 4, 6);
      ctx.fillRect(7, -17 + breathScale, 4, 6);
      // Lencana perisai sesar tektonik di dada
      ctx.fillStyle = '#fde047';
      ctx.fillRect(-2, -14 + breathScale, 4, 4);
    } else if (type === 'dr_maya_trans') {
      // Jas lab putih dengan strip cyan aksen
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(-9, -17 + breathScale, 18, 13);
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(-3, -16 + breathScale, 6, 11);
      // Tablet riset digital di tangan
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(7, -12 + breathScale, 5, 7);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(8, -11 + breathScale, 3, 5);
    } else if (type === 'prof_sarah_trans') {
      // Rompi safari ekspedisi cokelat gurun dengan saku perlengkapan
      ctx.fillStyle = '#b45309';
      ctx.fillRect(-9, -17 + breathScale, 18, 13);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(-7, -13 + breathScale, 4, 4);
      ctx.fillRect(3, -13 + breathScale, 4, 4);
      // Kompas geologi emas
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(8, -8 + breathScale, 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === 'dr_taufik_trans') {
      // Rompi safety seismologi kuning neon bergaris perak
      ctx.fillStyle = '#eab308';
      ctx.fillRect(-9, -17 + breathScale, 18, 13);
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(-9, -14 + breathScale, 18, 2);
      // Unit kontrol sismograf genggam dengan LED berkedip
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(6, -13 + breathScale, 6, 8);
      ctx.fillStyle = (frame % 30 < 15) ? '#22c55e' : '#15803d';
      ctx.fillRect(8, -11 + breathScale, 2, 2);
    } else {
      // Petugas Rudi: Rompi SAR oranye terang dengan strip reflektif putih
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(-9, -17 + breathScale, 18, 13);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-9, -13 + breathScale, 18, 3);
      // Radio HT komunikasi di bahu
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-10, -18 + breathScale, 3, 5);
    }

    // 4. Kepala & Pelindung Kepala dari Atas (POV Overhead)
    const headY = -22 + breathScale;
    if (type === 'komandan_guntur') {
      // Baret perwira komando gurun miring cokelat tua dengan lambang emas
      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.ellipse(1, headY, 7, 7, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fde047';
      ctx.fillRect(3, headY - 3, 3, 3);
      // Wajah/tengkuk kulit hangat
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(-3, headY + 3, 6, 3);
    } else if (type === 'dr_maya_trans') {
      // Helm riset putih-cyan dengan lampu kepala (headlamp)
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.arc(0, headY, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(-6, headY - 2, 12, 3);
      // Headlamp LED biru menyala ke depan
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-2, headY - 8, 4, 3);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-1, headY - 7, 2, 1);
    } else if (type === 'prof_sarah_trans') {
      // Topi rimba bulat ekspedisi (Boonie Hat) dengan daun topi lebar
      ctx.fillStyle = '#92400e';
      ctx.beginPath();
      ctx.arc(0, headY, 9, 0, Math.PI * 2);
      ctx.fill();
      // Kubah tengah topi & pita
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.arc(0, headY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1;
      ctx.stroke();
    } else if (type === 'dr_taufik_trans') {
      // Topi safety geologis kuning cerah
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(0, headY, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(-6, headY, 12, 2);
      // Sensor visor
      ctx.fillStyle = '#334155';
      ctx.fillRect(-3, headY - 8, 6, 2);
    } else {
      // Petugas Rudi: Safety Hard Hat oranye terang
      ctx.fillStyle = '#c2410c';
      ctx.beginPath();
      ctx.arc(0, headY, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-1, headY - 7, 2, 14);
    }
  }

  // ── KOSTUM ADAPTIF BERDASARKAN ZONA (MINER & FUTURISTIC HAZARD SUIT) ──
  const isCrust = zoneId === 'crust';
  const isHeatZone = zoneId === 'mantle' || zoneId === 'outerCore' || zoneId === 'innerCore';

  if (isCrust) {
    const drawY = -32 + breathY;
    // 1. Rompi Tambang High-Vis Oranye & Strip Reflektor Neon
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(-6, drawY + 10, 12, 9);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-6, drawY + 13, 12, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-5, drawY + 13, 10, 1);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-1, drawY + 10, 2, 9); // Zipper tengah

    // 2. Helm Keselamatan Tambang Kuning & Lampu Senter Kepala (Headlamp)
    ctx.fillStyle = '#eab308';
    ctx.fillRect(-6, drawY - 2, 12, 6);
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(-7, drawY + 2, 14, 2);
    // Lampu kepala senter kerja
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(4, drawY - 1, 3, 4);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(5, drawY, 2, 2);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(5, drawY + 1, 2, 1);
    // Berkas cahaya senter tambang menyala ke depan
    ctx.fillStyle = 'rgba(254, 240, 138, 0.22)';
    ctx.beginPath();
    ctx.moveTo(7, drawY + 1);
    ctx.lineTo(26, drawY - 6);
    ctx.lineTo(26, drawY + 8);
    ctx.closePath();
    ctx.fill();
  } else if (isHeatZone) {
    const drawY = -32 + breathY;
    // 1. Baju Pelindung Suhu Ekstrem Futuristik (Pressurized Cryo Hazard Suit)
    // Lapisan pelindung dada & bahu titanium
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(-7, drawY + 10, 14, 9);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(-8, drawY + 10, 2, 5);
    ctx.fillRect(6, drawY + 10, 2, 5);
    // Inti Pendingin Krio Berpendar Cyan (Cryo-Cooling Chest Core)
    const cryoPulse = Math.sin(frame * 0.1) * 0.2 + 0.8;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-3, drawY + 12, 6, 5);
    ctx.fillStyle = `rgba(34, 211, 238, ${cryoPulse})`;
    ctx.fillRect(-2, drawY + 13, 4, 3);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-1, drawY + 14, 2, 1);
    // Saluran pendingin cair (coolant pipes)
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(-6, drawY + 12, 1, 6);
    ctx.fillRect(5, drawY + 12, 1, 6);

    // 2. Helm Masa Depan Tahan Panas & Radiasi (Titanium Thermal Full Helmet)
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(-6, drawY - 2, 13, 13);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(-7, drawY + 2, 2, 8);
    ctx.fillRect(6, drawY + 2, 2, 8);
    // Sensor antena samping
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-8, drawY + 3, 2, 3);
    // Visor Kaca HUD Neon Cyan
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(0, drawY + 3, 6, 5);
    ctx.fillStyle = '#22d3ee';
    ctx.fillRect(1, drawY + 4, 4, 3);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(2, drawY + 4, 2, 1);
  }

  ctx.restore();
}

// ══════════════════════════════════════════════════════════════════════════
// 2. MASKOT RESQY MELAYANG DI DUNIA (WORLD COMPANION)
// ══════════════════════════════════════════════════════════════════════════
export function drawMascotWorld(
  ctx: CanvasRenderingContext2D,
  playerX: number,
  playerY: number,
  playerDir: 'left' | 'right',
  frame: number,
): void {
  // Posisi Resqy melayang anggun di belakang atas pundak pemain
  const hoverOffset = playerDir === 'right' ? -26 : 26;
  const hoverX = Math.round(playerX + hoverOffset);
  const hoverY = Math.round(playerY - 44 + Math.sin(frame * 0.08) * 3);

  ctx.save();
  ctx.translate(hoverX, hoverY);
  if (playerDir === 'left') ctx.scale(-1, 1);

  // 1. Semburan Ion Biru Pendorong Bawah
  const thrusterH = 4 + (frame % 3) * 2;
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(-2, 10, 4, thrusterH);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-1, 10, 2, Math.max(2, thrusterH - 2));

  // 2. Bodi Bulat Resqy (Oranye Penyelamat RESQ-BOX)
  ctx.fillStyle = '#0f172a'; // Outline
  ctx.fillRect(-9, -7, 18, 17);
  ctx.fillRect(-8, -8, 16, 19);

  ctx.fillStyle = '#f97316'; // Casing Oranye
  ctx.fillRect(-7, -6, 14, 15);
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(-7, 5, 14, 4); // Shading bawah

  // Strip Kuning Keselamatan
  ctx.fillStyle = '#facc15';
  ctx.fillRect(-7, 2, 14, 2);

  // 3. Layar Digital CRT Cyan
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-5, -4, 10, 6);
  ctx.fillStyle = '#06b6d4';
  ctx.fillRect(-4, -3, 8, 4);

  // Mata Piksel Berkedip Ceria
  const isBlink = frame % 140 > 132;
  ctx.fillStyle = '#ffffff';
  if (!isBlink) {
    ctx.fillRect(-3, -2, 2, 2);
    ctx.fillRect(1, -2, 2, 2);
  } else {
    ctx.fillRect(-3, -1, 2, 1);
    ctx.fillRect(1, -1, 2, 1);
  }

  // 4. Antena Radar Mini di Kepala
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-1, -11, 2, 4);
  const radarGlow = Math.sin(frame * 0.15) > 0 ? '#facc15' : '#fb923c';
  ctx.fillStyle = radarGlow;
  ctx.fillRect(-2, -13, 4, 2);

  ctx.restore();
}

// ══════════════════════════════════════════════════════════════════════════
// 3. GENERATOR POTRET BESAR PIXEL ART (VISUAL NOVEL BUST DIALOGUE)
// 100% TRANSPARAN TANPA KOTAK BACKGROUND
// ══════════════════════════════════════════════════════════════════════════

// ── 3A. POTRET BESAR PROF. RADITYA (TRANSPARAN) ──
export function getProfRadityaPortrait(): HTMLCanvasElement {
  return getOrCreateCanvas('portrait_prof_raditya_trans', 120, 120, (ctx) => {
    // 100% Transparan tanpa kotak latar belakang
    const p = 4;
    const offX = 20;
    const offY = 16;

    // Tubuh & Bahu (Baju Safari Khaki)
    ctx.fillStyle = '#b45309';
    ctx.fillRect(offX + 1 * p, offY + 16 * p, 18 * p, 8 * p);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(offX + 3 * p, offY + 17 * p, 14 * p, 7 * p);

    // Kerah & Dasi Peneliti
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(offX + 7 * p, offY + 16 * p, 6 * p, 7 * p);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(offX + 9 * p, offY + 17 * p, 2 * p, 6 * p);

    // Leher & Dagu
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(offX + 7 * p, offY + 13 * p, 6 * p, 3 * p);

    // Wajah
    ctx.fillStyle = '#fcd34d';
    ctx.fillRect(offX + 5 * p, offY + 6 * p, 10 * p, 8 * p);

    // Jenggot/Kumis Tipis Elegan
    ctx.fillStyle = '#71717a';
    ctx.fillRect(offX + 8 * p, offY + 11 * p, 4 * p, 2 * p);
    ctx.fillStyle = '#451a03'; // Senyum ramah
    ctx.fillRect(offX + 9 * p, offY + 12 * p, 2 * p, 1 * p);

    // Kacamata Tebal Emas
    ctx.fillStyle = '#d97706'; // Bingkai kacamata
    ctx.fillRect(offX + 5 * p, offY + 7 * p, 4 * p, 3 * p);
    ctx.fillRect(offX + 11 * p, offY + 7 * p, 4 * p, 3 * p);
    ctx.fillRect(offX + 9 * p, offY + 8 * p, 2 * p, 1 * p);
    // Kaca Reflektif Biru Langit
    ctx.fillStyle = '#7dd3fc';
    ctx.fillRect(offX + 6 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillRect(offX + 12 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillStyle = '#ffffff'; // Glint pantulan cahaya
    ctx.fillRect(offX + 6 * p, offY + 8 * p, 1 * p, 1 * p);
    ctx.fillRect(offX + 12 * p, offY + 8 * p, 1 * p, 1 * p);

    // Rambut Abu-abu Halus
    ctx.fillStyle = '#71717a';
    ctx.fillRect(offX + 4 * p, offY + 4 * p, 12 * p, 3 * p);
    ctx.fillRect(offX + 3 * p, offY + 6 * p, 2 * p, 5 * p);
    ctx.fillRect(offX + 15 * p, offY + 6 * p, 2 * p, 5 * p);

    // Topi Rimba Geologis (Safari Hat)
    ctx.fillStyle = '#92400e';
    ctx.fillRect(offX + 1 * p, offY + 3 * p, 18 * p, 2 * p); // Pinggiran daun topi
    ctx.fillStyle = '#b45309';
    ctx.fillRect(offX + 4 * p, offY - 1 * p, 12 * p, 4 * p); // Kubah topi
    ctx.fillStyle = '#451a03';
    ctx.fillRect(offX + 4 * p, offY + 2 * p, 12 * p, 1 * p); // Pita kulit topi
  });
}

// ── 3B. POTRET BESAR KAPTEN MAYA (TRANSPARAN) ──
export function getKaptenMayaPortrait(): HTMLCanvasElement {
  return getOrCreateCanvas('portrait_kapten_maya_trans', 120, 120, (ctx) => {
    // 100% Transparan tanpa kotak latar belakang
    const p = 4;
    const offX = 20;
    const offY = 16;

    // Rompi High-Vis & Bahu
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(offX + 1 * p, offY + 16 * p, 18 * p, 8 * p);
    ctx.fillStyle = '#facc15'; // Strip Scotlight Kuning
    ctx.fillRect(offX + 2 * p, offY + 18 * p, 16 * p, 2 * p);
    ctx.fillStyle = '#ffffff'; // Scotlight Tengah
    ctx.fillRect(offX + 5 * p, offY + 18 * p, 10 * p, 2 * p);
    ctx.fillStyle = '#0f172a'; // Kaos dalam hitam
    ctx.fillRect(offX + 8 * p, offY + 16 * p, 4 * p, 3 * p);

    // Leher
    ctx.fillStyle = '#fb923c';
    ctx.fillRect(offX + 7 * p, offY + 13 * p, 6 * p, 3 * p);

    // Wajah
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(offX + 5 * p, offY + 6 * p, 10 * p, 8 * p);

    // Pipi Merona & Senyum Tegas
    ctx.fillStyle = '#fb7185';
    ctx.fillRect(offX + 5 * p, offY + 10 * p, 2 * p, 1 * p);
    ctx.fillRect(offX + 13 * p, offY + 10 * p, 2 * p, 1 * p);
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(offX + 8 * p, offY + 11 * p, 4 * p, 1 * p);

    // Mata Karismatik Cokelat Gelap
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(offX + 6 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillRect(offX + 12 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillStyle = '#ffffff'; // Kilau mata
    ctx.fillRect(offX + 6 * p, offY + 8 * p, 1 * p, 1 * p);
    ctx.fillRect(offX + 12 * p, offY + 8 * p, 1 * p, 1 * p);

    // Headset Komunikator Lapangan (Mic Boom)
    ctx.fillStyle = '#64748b';
    ctx.fillRect(offX + 3 * p, offY + 8 * p, 2 * p, 4 * p);
    ctx.fillRect(offX + 4 * p, offY + 11 * p, 4 * p, 1 * p);
    ctx.fillStyle = '#06b6d4'; // Indikator led mic
    ctx.fillRect(offX + 7 * p, offY + 11 * p, 1 * p, 1 * p);

    // Rambut Hitam Bergelombang
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(offX + 4 * p, offY + 4 * p, 12 * p, 3 * p);
    ctx.fillRect(offX + 3 * p, offY + 7 * p, 2 * p, 6 * p);
    ctx.fillRect(offX + 15 * p, offY + 7 * p, 2 * p, 6 * p);

    // Helm Keselamatan Industri Oranye dengan Lampu Sorot
    ctx.fillStyle = '#c2410c';
    ctx.fillRect(offX + 1 * p, offY + 2 * p, 18 * p, 2 * p); // Daun helm
    ctx.fillStyle = '#f97316';
    ctx.fillRect(offX + 3 * p, offY - 2 * p, 14 * p, 4 * p); // Badan helm
    ctx.fillStyle = '#fdba74';
    ctx.fillRect(offX + 4 * p, offY - 2 * p, 12 * p, 1 * p); // Highlight atas

    // Lampu Sorot Tambang di Dahi Helm
    ctx.fillStyle = '#334155';
    ctx.fillRect(offX + 8 * p, offY - 1 * p, 4 * p, 3 * p);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(offX + 9 * p, offY + 0 * p, 2 * p, 2 * p);
  });
}

// ── 3C. POTRET BESAR MASKOT RESQY (TRANSPARAN) ──
export function getResqyPortrait(): HTMLCanvasElement {
  return getOrCreateCanvas('portrait_resqy_trans', 120, 120, (ctx) => {
    // 100% Transparan tanpa kotak latar belakang
    const p = 4;
    const offX = 22;
    const offY = 20;

    // Antena Pemancar Radar Mini
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(offX + 9 * p, offY - 3 * p, 1 * p, 3 * p);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(offX + 8 * p, offY - 5 * p, 3 * p, 2 * p);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(offX + 9 * p, offY - 5 * p, 1 * p, 1 * p);

    // Bodi Robotik Oranye Penyelamat (Chassis)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(offX + 2 * p, offY + 0 * p, 15 * p, 15 * p);

    ctx.fillStyle = '#f97316';
    ctx.fillRect(offX + 3 * p, offY + 1 * p, 13 * p, 13 * p);
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(offX + 3 * p, offY + 10 * p, 13 * p, 4 * p);

    // Garis Keselamatan Kuning Reflektif
    ctx.fillStyle = '#facc15';
    ctx.fillRect(offX + 3 * p, offY + 8 * p, 13 * p, 2 * p);

    // Layar Kaca CRT Hitam Glossy
    ctx.fillStyle = '#020617';
    ctx.fillRect(offX + 5 * p, offY + 2 * p, 9 * p, 6 * p);
    ctx.fillStyle = '#0891b2';
    ctx.fillRect(offX + 6 * p, offY + 3 * p, 7 * p, 4 * p);

    // Mata Digital Piksel Cyan Ceria (Happy Expressive Face)
    ctx.fillStyle = '#67e8f9';
    ctx.fillRect(offX + 7 * p, offY + 4 * p, 2 * p, 2 * p);
    ctx.fillRect(offX + 10 * p, offY + 4 * p, 2 * p, 2 * p);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(offX + 7 * p, offY + 4 * p, 1 * p, 1 * p);
    ctx.fillRect(offX + 10 * p, offY + 4 * p, 1 * p, 1 * p);

    // Pendorong Hover Bawah
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(offX + 7 * p, offY + 15 * p, 5 * p, 2 * p);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(offX + 8 * p, offY + 15 * p, 3 * p, 1 * p);
  });
}

// ── 3D. POTRET BESAR DR. GEA (MINERALOGI - TRANSPARAN) ──
export function getDrGeaPortrait(): HTMLCanvasElement {
  return getOrCreateCanvas('portrait_dr_gea_trans', 120, 120, (ctx) => {
    const p = 4;
    const offX = 20;
    const offY = 16;

    // Jas Lab Putih & Bahu
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(offX + 1 * p, offY + 16 * p, 18 * p, 8 * p);
    ctx.fillStyle = '#06b6d4'; // Kerah dalam Cyan
    ctx.fillRect(offX + 6 * p, offY + 16 * p, 8 * p, 5 * p);
    ctx.fillStyle = '#e2e8f0'; // Bayangan lipatan jas
    ctx.fillRect(offX + 4 * p, offY + 18 * p, 2 * p, 6 * p);
    ctx.fillRect(offX + 14 * p, offY + 18 * p, 2 * p, 6 * p);

    // Leher
    ctx.fillStyle = '#fcd34d';
    ctx.fillRect(offX + 7 * p, offY + 13 * p, 6 * p, 3 * p);

    // Wajah
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(offX + 5 * p, offY + 6 * p, 10 * p, 8 * p);

    // Pipi & Senyum Cerdas
    ctx.fillStyle = '#fb7185';
    ctx.fillRect(offX + 5 * p, offY + 10 * p, 2 * p, 1 * p);
    ctx.fillRect(offX + 13 * p, offY + 10 * p, 2 * p, 1 * p);
    ctx.fillStyle = '#be123c';
    ctx.fillRect(offX + 8 * p, offY + 11 * p, 4 * p, 1 * p);

    // Mata & Kacamata Laboratorium Oval Cyan
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(offX + 6 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillRect(offX + 12 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillStyle = '#0284c7'; // Frame kacamata
    ctx.fillRect(offX + 5 * p, offY + 7 * p, 4 * p, 3 * p);
    ctx.fillRect(offX + 11 * p, offY + 7 * p, 4 * p, 3 * p);
    ctx.fillRect(offX + 9 * p, offY + 8 * p, 2 * p, 1 * p); // Jembatan hidung
    // Lensa Reflektif Biru Muda
    ctx.fillStyle = '#7dd3fc';
    ctx.fillRect(offX + 6 * p, offY + 8 * p, 2 * p, 1 * p);
    ctx.fillRect(offX + 12 * p, offY + 8 * p, 2 * p, 1 * p);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(offX + 6 * p, offY + 8 * p, 1 * p, 1 * p);
    ctx.fillRect(offX + 12 * p, offY + 8 * p, 1 * p, 1 * p);

    // Rambut Cokelat Kemerahan dengan Sanggul Tinggi
    ctx.fillStyle = '#451a03';
    ctx.fillRect(offX + 4 * p, offY + 3 * p, 12 * p, 4 * p);
    ctx.fillRect(offX + 3 * p, offY + 6 * p, 2 * p, 5 * p);
    ctx.fillRect(offX + 15 * p, offY + 6 * p, 2 * p, 5 * p);
    // Sanggul atas
    ctx.fillRect(offX + 7 * p, offY - 2 * p, 6 * p, 5 * p);
    // Tusuk rambut Cyan menyala
    ctx.fillStyle = '#22d3ee';
    ctx.fillRect(offX + 5 * p, offY - 1 * p, 10 * p, 1 * p);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(offX + 14 * p, offY - 2 * p, 2 * p, 2 * p); // Permata tusuk rambut
  });
}

// ── 3E. POTRET BESAR PROF. ANDINI (KOMPARASI KERAK - TRANSPARAN) ──
export function getProfAndiniPortrait(): HTMLCanvasElement {
  return getOrCreateCanvas('portrait_prof_andini_trans', 120, 120, (ctx) => {
    const p = 4;
    const offX = 20;
    const offY = 16;

    // Rompi Lapangan Ungu/Violet Mewah
    ctx.fillStyle = '#7c3aed';
    ctx.fillRect(offX + 1 * p, offY + 16 * p, 18 * p, 8 * p);
    ctx.fillStyle = '#e9d5ff'; // Kerah baju dalam Lilac
    ctx.fillRect(offX + 7 * p, offY + 16 * p, 6 * p, 4 * p);
    ctx.fillStyle = '#c084fc'; // Saku & detail rompi
    ctx.fillRect(offX + 3 * p, offY + 18 * p, 3 * p, 4 * p);
    ctx.fillRect(offX + 14 * p, offY + 18 * p, 3 * p, 4 * p);

    // Datapad Geologis Holografis di tangan bawah
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(offX + 13 * p, offY + 18 * p, 6 * p, 6 * p);
    ctx.fillStyle = '#10b981'; // Layar hijau toska
    ctx.fillRect(offX + 14 * p, offY + 19 * p, 4 * p, 4 * p);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(offX + 15 * p, offY + 20 * p, 2 * p, 1 * p);

    // Leher & Dagu
    ctx.fillStyle = '#f5af7e';
    ctx.fillRect(offX + 7 * p, offY + 13 * p, 6 * p, 3 * p);

    // Wajah
    ctx.fillStyle = '#f5af7e';
    ctx.fillRect(offX + 5 * p, offY + 6 * p, 10 * p, 8 * p);

    // Pipi & Senyum Percaya Diri
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(offX + 5 * p, offY + 10 * p, 2 * p, 1 * p);
    ctx.fillRect(offX + 13 * p, offY + 10 * p, 2 * p, 1 * p);
    ctx.fillStyle = '#9f1239';
    ctx.fillRect(offX + 8 * p, offY + 11 * p, 4 * p, 1 * p);

    // Kacamata Modis Emas & Mata Karismatik
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(offX + 6 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillRect(offX + 12 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillStyle = '#f59e0b'; // Frame kacamata emas
    ctx.fillRect(offX + 5 * p, offY + 7 * p, 4 * p, 3 * p);
    ctx.fillRect(offX + 11 * p, offY + 7 * p, 4 * p, 3 * p);
    ctx.fillRect(offX + 9 * p, offY + 8 * p, 2 * p, 1 * p);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(offX + 6 * p, offY + 8 * p, 2 * p, 1 * p);
    ctx.fillRect(offX + 12 * p, offY + 8 * p, 2 * p, 1 * p);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(offX + 6 * p, offY + 8 * p, 1 * p, 1 * p);
    ctx.fillRect(offX + 12 * p, offY + 8 * p, 1 * p, 1 * p);

    // Rambut Ikal Mengembang Elegan Deep Violet
    ctx.fillStyle = '#2e1065';
    ctx.fillRect(offX + 4 * p, offY + 2 * p, 12 * p, 5 * p);
    ctx.fillRect(offX + 3 * p, offY + 5 * p, 3 * p, 8 * p);
    ctx.fillRect(offX + 14 * p, offY + 5 * p, 3 * p, 8 * p);
  });
}

// ── 3F. POTRET BESAR INSPEKTUR BUDI (GEOFISIKA MOHO - TRANSPARAN) ──
export function getInspekturBudiPortrait(): HTMLCanvasElement {
  return getOrCreateCanvas('portrait_inspektur_budi_trans', 120, 120, (ctx) => {
    const p = 4;
    const offX = 20;
    const offY = 16;

    // Baju Tahan Panas Tambang Hijau Zaitun (Olive)
    ctx.fillStyle = '#15803d';
    ctx.fillRect(offX + 1 * p, offY + 16 * p, 18 * p, 8 * p);
    // Strip Scotlight Kuning Reflektif & Putih
    ctx.fillStyle = '#facc15';
    ctx.fillRect(offX + 2 * p, offY + 18 * p, 16 * p, 2 * p);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(offX + 6 * p, offY + 18 * p, 8 * p, 2 * p);

    // Leher
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(offX + 7 * p, offY + 13 * p, 6 * p, 3 * p);

    // Wajah
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(offX + 5 * p, offY + 6 * p, 10 * p, 8 * p);

    // Jenggot & Kumis Tebal Khas Surveyor Lapangan
    ctx.fillStyle = '#3f3f46';
    ctx.fillRect(offX + 6 * p, offY + 10 * p, 8 * p, 4 * p);
    ctx.fillRect(offX + 7 * p, offY + 13 * p, 6 * p, 2 * p);
    ctx.fillStyle = '#18181b';
    ctx.fillRect(offX + 8 * p, offY + 11 * p, 4 * p, 1 * p); // Garis mulut

    // Mata Tajam & Alis Tebal
    ctx.fillStyle = '#18181b';
    ctx.fillRect(offX + 6 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillRect(offX + 12 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(offX + 6 * p, offY + 8 * p, 1 * p, 1 * p);
    ctx.fillRect(offX + 12 * p, offY + 8 * p, 1 * p, 1 * p);
    // Alis
    ctx.fillStyle = '#3f3f46';
    ctx.fillRect(offX + 5 * p, offY + 6 * p, 3 * p, 1 * p);
    ctx.fillRect(offX + 12 * p, offY + 6 * p, 3 * p, 1 * p);

    // Helm Keselamatan Tambang Kuning Terang
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(offX + 1 * p, offY + 2 * p, 18 * p, 2 * p); // Daun helm
    ctx.fillStyle = '#eab308';
    ctx.fillRect(offX + 3 * p, offY - 2 * p, 14 * p, 4 * p); // Kubah helm
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(offX + 4 * p, offY - 2 * p, 12 * p, 1 * p); // Highlight

    // Lampu Sorot LED Dahi Helm
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(offX + 8 * p, offY - 1 * p, 4 * p, 3 * p);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(offX + 9 * p, offY + 0 * p, 2 * p, 2 * p);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(offX + 9 * p, offY + 0 * p, 1 * p, 1 * p);
  });
}

// ── 3G. POTRET BESAR KOMANDAN HENDRA (PENJAGA GERBANG MOHO - TRANSPARAN) ──
export function getKomandanHendraPortrait(): HTMLCanvasElement {
  return getOrCreateCanvas('portrait_komandan_hendra_trans', 120, 120, (ctx) => {
    const p = 4;
    const offX = 20;
    const offY = 16;

    // Jaket Taktis Komandan Navy
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(offX + 1 * p, offY + 16 * p, 18 * p, 8 * p);
    // Epaulet Pangkat Emas di Bahu
    ctx.fillStyle = '#eab308';
    ctx.fillRect(offX + 1 * p, offY + 16 * p, 4 * p, 2 * p);
    ctx.fillRect(offX + 15 * p, offY + 16 * p, 4 * p, 2 * p);
    // Kerah Tinggi & Dasi Merah Perwira
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(offX + 6 * p, offY + 16 * p, 8 * p, 3 * p);
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(offX + 9 * p, offY + 17 * p, 2 * p, 5 * p);
    // Lencana Seismik Emas di Dada
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(offX + 4 * p, offY + 19 * p, 3 * p, 3 * p);

    // Leher Tegap
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(offX + 7 * p, offY + 13 * p, 6 * p, 3 * p);

    // Wajah Berwibawa
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(offX + 5 * p, offY + 6 * p, 10 * p, 8 * p);

    // Garis Rahang Tegas & Senyum Mantap
    ctx.fillStyle = '#c2410c';
    ctx.fillRect(offX + 8 * p, offY + 11 * p, 4 * p, 1 * p);
    ctx.fillStyle = '#9a3412';
    ctx.fillRect(offX + 7 * p, offY + 13 * p, 6 * p, 1 * p);

    // Mata Elang Berpengalaman & Alis Komandan
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(offX + 6 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillRect(offX + 12 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(offX + 6 * p, offY + 8 * p, 1 * p, 1 * p);
    ctx.fillRect(offX + 12 * p, offY + 8 * p, 1 * p, 1 * p);
    // Alis Tegas
    ctx.fillStyle = '#475569';
    ctx.fillRect(offX + 5 * p, offY + 6 * p, 4 * p, 1 * p);
    ctx.fillRect(offX + 11 * p, offY + 6 * p, 4 * p, 1 * p);

    // Rambut Samping Abu-abu
    ctx.fillStyle = '#64748b';
    ctx.fillRect(offX + 4 * p, offY + 5 * p, 2 * p, 4 * p);
    ctx.fillRect(offX + 14 * p, offY + 5 * p, 2 * p, 4 * p);

    // Baret Militer Taktis Navy dengan Emblem Emas
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(offX + 3 * p, offY + 1 * p, 14 * p, 3 * p); // Pita baret
    ctx.fillRect(offX + 5 * p, offY - 2 * p, 11 * p, 4 * p); // Kubah baret
    ctx.fillRect(offX + 14 * p, offY - 1 * p, 4 * p, 3 * p); // Jatuh baret kanan
    // Lambang/Emblem Seismik Moho Emas di Baret
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(offX + 7 * p, offY - 1 * p, 3 * p, 3 * p);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(offX + 8 * p, offY + 0 * p, 1 * p, 1 * p);
  });
}

export function getProfSarahPortrait(): HTMLCanvasElement {
  return getOrCreateCanvas('portrait_prof_sarah_trans', 120, 120, (ctx) => {
    const p = 4;
    const offX = 20;
    const offY = 16;
    // Jaket Geotermal Oranye Bata
    ctx.fillStyle = '#c2410c';
    ctx.fillRect(offX + 1 * p, offY + 16 * p, 18 * p, 8 * p);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(offX + 7 * p, offY + 16 * p, 6 * p, 4 * p);
    ctx.fillStyle = '#9a3412';
    ctx.fillRect(offX + 3 * p, offY + 18 * p, 3 * p, 3 * p);
    ctx.fillRect(offX + 14 * p, offY + 18 * p, 3 * p, 3 * p);
    // Leher
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(offX + 7 * p, offY + 13 * p, 6 * p, 3 * p);
    // Wajah
    ctx.fillRect(offX + 5 * p, offY + 6 * p, 10 * p, 8 * p);
    // Mata & Kacamata Oranye Sains
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(offX + 6 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillRect(offX + 12 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(offX + 5 * p, offY + 7 * p, 4 * p, 3 * p);
    ctx.fillRect(offX + 11 * p, offY + 7 * p, 4 * p, 3 * p);
    ctx.fillRect(offX + 9 * p, offY + 8 * p, 2 * p, 1 * p); // Jembatan kacamata
    // Senyum Ramah
    ctx.fillStyle = '#c2410c';
    ctx.fillRect(offX + 8 * p, offY + 12 * p, 4 * p, 1 * p);
    // Rambut Cokelat Kemerahan dengan Kuncir
    ctx.fillStyle = '#571c0c';
    ctx.fillRect(offX + 4 * p, offY + 3 * p, 12 * p, 3 * p);
    ctx.fillRect(offX + 3 * p, offY + 5 * p, 2 * p, 6 * p);
    ctx.fillRect(offX + 15 * p, offY + 5 * p, 2 * p, 6 * p);
    ctx.fillRect(offX + 15 * p, offY + 2 * p, 4 * p, 4 * p); // Kuncir belakang
  });
}

export function getDrBayuPortrait(): HTMLCanvasElement {
  return getOrCreateCanvas('portrait_dr_bayu_trans', 120, 120, (ctx) => {
    const p = 4;
    const offX = 20;
    const offY = 16;
    // Rompi Khaki Lapangan
    ctx.fillStyle = '#d97706';
    ctx.fillRect(offX + 1 * p, offY + 16 * p, 18 * p, 8 * p);
    ctx.fillStyle = '#fde68a';
    ctx.fillRect(offX + 7 * p, offY + 16 * p, 6 * p, 5 * p);
    // Leher
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(offX + 7 * p, offY + 13 * p, 6 * p, 3 * p);
    // Wajah
    ctx.fillRect(offX + 5 * p, offY + 6 * p, 10 * p, 8 * p);
    // Mata
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(offX + 6 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillRect(offX + 12 * p, offY + 8 * p, 2 * p, 2 * p);
    // Alis & Senyum
    ctx.fillStyle = '#451a03';
    ctx.fillRect(offX + 6 * p, offY + 6 * p, 3 * p, 1 * p);
    ctx.fillRect(offX + 11 * p, offY + 6 * p, 3 * p, 1 * p);
    ctx.fillRect(offX + 8 * p, offY + 12 * p, 4 * p, 1 * p);
    // Helm Kuning Proyek Geotermal
    ctx.fillStyle = '#eab308';
    ctx.fillRect(offX + 3 * p, offY + 2 * p, 14 * p, 3 * p);
    ctx.fillRect(offX + 5 * p, offY - 2 * p, 10 * p, 4 * p);
    // Lampu Sorot Helm
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(offX + 9 * p, offY + 0 * p, 2 * p, 2 * p);
  });
}

export function getDrDanangPortrait(): HTMLCanvasElement {
  return getOrCreateCanvas('portrait_dr_danang_trans', 120, 120, (ctx) => {
    const p = 4;
    const offX = 20;
    const offY = 16;
    // Jas Lab Putih Sains & Kemeja Cyan
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(offX + 1 * p, offY + 16 * p, 18 * p, 8 * p);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(offX + 7 * p, offY + 16 * p, 6 * p, 8 * p);
    // Leher
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(offX + 7 * p, offY + 13 * p, 6 * p, 3 * p);
    // Wajah
    ctx.fillRect(offX + 5 * p, offY + 6 * p, 10 * p, 8 * p);
    // Mata & Kacamata Bingkai Hitam
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(offX + 6 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillRect(offX + 12 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillStyle = '#334155';
    ctx.fillRect(offX + 5 * p, offY + 7 * p, 4 * p, 3 * p);
    ctx.fillRect(offX + 11 * p, offY + 7 * p, 4 * p, 3 * p);
    ctx.fillRect(offX + 9 * p, offY + 8 * p, 2 * p, 1 * p);
    // Rambut Hitam Rapi
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(offX + 4 * p, offY + 3 * p, 12 * p, 3 * p);
    ctx.fillRect(offX + 4 * p, offY + 5 * p, 2 * p, 4 * p);
    ctx.fillRect(offX + 14 * p, offY + 5 * p, 2 * p, 4 * p);
  });
}

export function getPetugasRudiPortrait(): HTMLCanvasElement {
  return getOrCreateCanvas('portrait_petugas_rudi_trans', 120, 120, (ctx) => {
    const p = 4;
    const offX = 20;
    const offY = 16;
    // Pakaian Keselamatan Hijau & Strip Reflektor Kuning
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(offX + 1 * p, offY + 16 * p, 18 * p, 8 * p);
    ctx.fillStyle = '#fde047';
    ctx.fillRect(offX + 1 * p, offY + 19 * p, 18 * p, 2 * p);
    // Leher
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(offX + 7 * p, offY + 13 * p, 6 * p, 3 * p);
    // Wajah
    ctx.fillRect(offX + 5 * p, offY + 6 * p, 10 * p, 8 * p);
    // Visor Pelindung Panas Biru
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(offX + 4 * p, offY + 7 * p, 12 * p, 4 * p);
    ctx.fillStyle = '#bae6fd';
    ctx.fillRect(offX + 6 * p, offY + 8 * p, 6 * p, 1 * p); // Pantulan kilau visor
    // Topi Kerja Hijau
    ctx.fillStyle = '#15803d';
    ctx.fillRect(offX + 3 * p, offY + 2 * p, 14 * p, 4 * p);
    ctx.fillRect(offX + 5 * p, offY - 1 * p, 10 * p, 3 * p);
  });
}

export function getKomandanSuryaPortrait(): HTMLCanvasElement {
  return getOrCreateCanvas('portrait_komandan_surya_trans', 120, 120, (ctx) => {
    const p = 4;
    const offX = 20;
    const offY = 16;
    // Seragam Militer Merah Marun Komando
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(offX + 1 * p, offY + 16 * p, 18 * p, 8 * p);
    ctx.fillStyle = '#f59e0b'; // Epaulet bahu emas
    ctx.fillRect(offX + 1 * p, offY + 16 * p, 4 * p, 2 * p);
    ctx.fillRect(offX + 15 * p, offY + 16 * p, 4 * p, 2 * p);
    ctx.fillStyle = '#fbbf24'; // Lencana dada
    ctx.fillRect(offX + 4 * p, offY + 19 * p, 3 * p, 3 * p);
    // Leher
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(offX + 7 * p, offY + 13 * p, 6 * p, 3 * p);
    // Wajah Berwibawa
    ctx.fillRect(offX + 5 * p, offY + 6 * p, 10 * p, 8 * p);
    // Mata Tegas & Alis
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(offX + 6 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillRect(offX + 12 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(offX + 5 * p, offY + 6 * p, 4 * p, 1 * p);
    ctx.fillRect(offX + 11 * p, offY + 6 * p, 4 * p, 1 * p);
    // Baret Merah Komando dengan Emblem Emas
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(offX + 3 * p, offY + 1 * p, 14 * p, 3 * p);
    ctx.fillRect(offX + 5 * p, offY - 2 * p, 11 * p, 4 * p);
    ctx.fillRect(offX + 14 * p, offY - 1 * p, 4 * p, 3 * p);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(offX + 7 * p, offY - 1 * p, 3 * p, 3 * p);
  });
}

// ── 3L. POTRET DR. FAJAR (AHLI GEOLOGI INTI LUAR - TRANSPARAN 120x120) ──
export function getDrFajarPortrait(): HTMLCanvasElement {
  return getOrCreateCanvas('portrait_dr_fajar_trans', 120, 120, (ctx) => {
    const p = 4;
    const offX = 20;
    const offY = 16;
    // Baju pelindung panas biru cyan perak
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(offX + 1 * p, offY + 16 * p, 18 * p, 8 * p);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(offX + 6 * p, offY + 16 * p, 8 * p, 8 * p);
    // Leher
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(offX + 7 * p, offY + 13 * p, 6 * p, 3 * p);
    // Wajah
    ctx.fillRect(offX + 5 * p, offY + 6 * p, 10 * p, 8 * p);
    // Visor elektromagnetik biru muda berkilau
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(offX + 5 * p, offY + 7 * p, 10 * p, 3 * p);
    ctx.fillStyle = '#cffafe';
    ctx.fillRect(offX + 7 * p, offY + 7 * p, 3 * p, 1 * p);
    // Helm pelindung biru perak dengan antena sensor
    ctx.fillStyle = '#0369a1';
    ctx.fillRect(offX + 3 * p, offY + 1 * p, 14 * p, 5 * p);
    ctx.fillRect(offX + 5 * p, offY - 2 * p, 10 * p, 4 * p);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(offX + 13 * p, offY - 4 * p, 2 * p, 3 * p);
  });
}

// ── 3M. POTRET PROF. RATNA (PENELITI LOGAM CAIR INTI LUAR - TRANSPARAN 120x120) ──
export function getProfRatnaPortrait(): HTMLCanvasElement {
  return getOrCreateCanvas('portrait_prof_ratna_trans', 120, 120, (ctx) => {
    const p = 4;
    const offX = 20;
    const offY = 16;
    // Jas lab pelindung panas emas-amber
    ctx.fillStyle = '#d97706';
    ctx.fillRect(offX + 1 * p, offY + 16 * p, 18 * p, 8 * p);
    ctx.fillStyle = '#fef3c7'; // Kerah baju lab putih
    ctx.fillRect(offX + 7 * p, offY + 16 * p, 6 * p, 8 * p);
    // Leher
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(offX + 7 * p, offY + 13 * p, 6 * p, 3 * p);
    // Wajah
    ctx.fillRect(offX + 5 * p, offY + 6 * p, 10 * p, 8 * p);
    // Pipi hangat
    ctx.fillStyle = '#fba874';
    ctx.fillRect(offX + 5 * p, offY + 10 * p, 2 * p, 1 * p);
    ctx.fillRect(offX + 13 * p, offY + 10 * p, 2 * p, 1 * p);
    // Mata & Kacamata sains
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(offX + 6 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillRect(offX + 12 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillStyle = '#92400e';
    ctx.fillRect(offX + 5 * p, offY + 7 * p, 4 * p, 1 * p);
    ctx.fillRect(offX + 11 * p, offY + 7 * p, 4 * p, 1 * p);
    ctx.fillRect(offX + 9 * p, offY + 8 * p, 2 * p, 1 * p);
    // Rambut cokelat tua dikuncir rapi
    ctx.fillStyle = '#451a03';
    ctx.fillRect(offX + 3 * p, offY + 1 * p, 14 * p, 4 * p);
    ctx.fillRect(offX + 3 * p, offY + 5 * p, 2 * p, 8 * p);
    ctx.fillRect(offX + 15 * p, offY + 5 * p, 2 * p, 8 * p);
    ctx.fillRect(offX + 16 * p, offY + 3 * p, 3 * p, 4 * p); // Kuncir samping
  });
}

// ── 3N. POTRET DR. ARIS (AHLI MEDAN MAGNET BUMI - TRANSPARAN 120x120) ──
export function getDrArisPortrait(): HTMLCanvasElement {
  return getOrCreateCanvas('portrait_dr_aris_trans', 120, 120, (ctx) => {
    const p = 4;
    const offX = 20;
    const offY = 16;
    // Seragam indigo elektromagnetik
    ctx.fillStyle = '#4338ca';
    ctx.fillRect(offX + 1 * p, offY + 16 * p, 18 * p, 8 * p);
    ctx.fillStyle = '#818cf8'; // Lencana fluks magnetik
    ctx.fillRect(offX + 4 * p, offY + 18 * p, 4 * p, 4 * p);
    // Leher
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(offX + 7 * p, offY + 13 * p, 6 * p, 3 * p);
    // Wajah
    ctx.fillRect(offX + 5 * p, offY + 6 * p, 10 * p, 8 * p);
    // Mata & Kacamata
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(offX + 6 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillRect(offX + 12 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillStyle = '#6366f1';
    ctx.fillRect(offX + 5 * p, offY + 7 * p, 4 * p, 1 * p);
    ctx.fillRect(offX + 11 * p, offY + 7 * p, 4 * p, 1 * p);
    ctx.fillRect(offX + 9 * p, offY + 8 * p, 2 * p, 1 * p);
    // Rambut hitam rapi belah samping
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(offX + 4 * p, offY + 2 * p, 12 * p, 4 * p);
    ctx.fillRect(offX + 3 * p, offY + 4 * p, 2 * p, 4 * p);
    ctx.fillRect(offX + 15 * p, offY + 4 * p, 2 * p, 4 * p);
  });
}

// ── 3O. POTRET PETUGAS JOKO (PENGAWAS RADIASI MAGNETIK - TRANSPARAN 120x120) ──
export function getPetugasJokoPortrait(): HTMLCanvasElement {
  return getOrCreateCanvas('portrait_petugas_joko_trans', 120, 120, (ctx) => {
    const p = 4;
    const offX = 20;
    const offY = 16;
    // Baju hazard perak dengan pita reflektor kuning
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(offX + 1 * p, offY + 16 * p, 18 * p, 8 * p);
    ctx.fillStyle = '#eab308'; // Pita reflektor
    ctx.fillRect(offX + 1 * p, offY + 19 * p, 18 * p, 2 * p);
    // Leher
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(offX + 7 * p, offY + 13 * p, 6 * p, 3 * p);
    // Wajah & Visor hijau anti-radiasi
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(offX + 5 * p, offY + 6 * p, 10 * p, 8 * p);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(offX + 5 * p, offY + 7 * p, 10 * p, 3 * p);
    ctx.fillStyle = '#a7f3d0';
    ctx.fillRect(offX + 7 * p, offY + 7 * p, 3 * p, 1 * p);
    // Helm keselamatan kuning tebal
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(offX + 2 * p, offY + 1 * p, 16 * p, 4 * p);
    ctx.fillRect(offX + 4 * p, offY - 2 * p, 12 * p, 4 * p);
  });
}

// ── 3P. POTRET KOMANDAN TEGUH (PENJAGA PINTU INTI DALAM - TRANSPARAN 120x120) ──
export function getKomandanTeguhPortrait(): HTMLCanvasElement {
  return getOrCreateCanvas('portrait_komandan_teguh_trans', 120, 120, (ctx) => {
    const p = 4;
    const offX = 20;
    const offY = 16;
    // Armor komando merah marun tua & baja
    ctx.fillStyle = '#881337';
    ctx.fillRect(offX + 1 * p, offY + 16 * p, 18 * p, 8 * p);
    ctx.fillStyle = '#f59e0b'; // Epaulet emas
    ctx.fillRect(offX + 1 * p, offY + 16 * p, 4 * p, 2 * p);
    ctx.fillRect(offX + 15 * p, offY + 16 * p, 4 * p, 2 * p);
    ctx.fillStyle = '#fbbf24'; // Bintang dada pelindung inti
    ctx.fillRect(offX + 4 * p, offY + 19 * p, 4 * p, 3 * p);
    // Leher
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(offX + 7 * p, offY + 13 * p, 6 * p, 3 * p);
    // Wajah Berwibawa & Tegas
    ctx.fillRect(offX + 5 * p, offY + 6 * p, 10 * p, 8 * p);
    // Mata & Alis Tegas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(offX + 6 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillRect(offX + 12 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillStyle = '#4c0519';
    ctx.fillRect(offX + 5 * p, offY + 6 * p, 4 * p, 1 * p);
    ctx.fillRect(offX + 11 * p, offY + 6 * p, 4 * p, 1 * p);
    // Baret / Topi Perwira Merah Gelap dengan Lambang Bintang Emas
    ctx.fillStyle = '#9f1239';
    ctx.fillRect(offX + 3 * p, offY + 1 * p, 14 * p, 3 * p);
    ctx.fillRect(offX + 5 * p, offY - 2 * p, 11 * p, 4 * p);
    ctx.fillRect(offX + 14 * p, offY - 1 * p, 4 * p, 3 * p);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(offX + 8 * p, offY - 1 * p, 3 * p, 3 * p);
  });
}

// ── 3Q. POTRET DR. BAGUS (PEMANDU GEOFISIKA INTI DALAM - TRANSPARAN 120x120) ──
export function getDrBagusPortrait(): HTMLCanvasElement {
  return getOrCreateCanvas('portrait_dr_bagus_trans', 120, 120, (ctx) => {
    const p = 4;
    const offX = 20;
    const offY = 16;
    // Jas amber emas geofisika
    ctx.fillStyle = '#d97706';
    ctx.fillRect(offX + 1 * p, offY + 16 * p, 18 * p, 8 * p);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(offX + 7 * p, offY + 16 * p, 6 * p, 8 * p);
    ctx.fillStyle = '#b45309'; // Dasi oranye tua
    ctx.fillRect(offX + 9 * p, offY + 17 * p, 2 * p, 6 * p);
    // Leher
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(offX + 7 * p, offY + 13 * p, 6 * p, 3 * p);
    // Wajah ramah & bersahabat
    ctx.fillRect(offX + 5 * p, offY + 6 * p, 10 * p, 8 * p);
    // Kacamata pelindung radiasi amber terang
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(offX + 5 * p, offY + 7 * p, 4 * p, 3 * p);
    ctx.fillRect(offX + 11 * p, offY + 7 * p, 4 * p, 3 * p);
    ctx.fillRect(offX + 9 * p, offY + 8 * p, 2 * p, 1 * p);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(offX + 6 * p, offY + 8 * p, 2 * p, 1 * p);
    ctx.fillRect(offX + 12 * p, offY + 8 * p, 2 * p, 1 * p);
    // Senyum hangat
    ctx.fillStyle = '#7c2d12';
    ctx.fillRect(offX + 8 * p, offY + 11 * p, 4 * p, 1 * p);
    // Rambut cokelat tersisir rapi
    ctx.fillStyle = '#78350f';
    ctx.fillRect(offX + 4 * p, offY + 2 * p, 12 * p, 5 * p);
    ctx.fillRect(offX + 3 * p, offY + 4 * p, 2 * p, 4 * p);
    ctx.fillRect(offX + 15 * p, offY + 4 * p, 2 * p, 4 * p);
    ctx.fillRect(offX + 6 * p, offY + 1 * p, 8 * p, 2 * p);
  });
}

// ── 3R. POTRET PROF. LESTARI (PENELITI KRISTAL BESI INTI DALAM - TRANSPARAN 120x120) ──
export function getProfLestariPortrait(): HTMLCanvasElement {
  return getOrCreateCanvas('portrait_prof_lestari_trans', 120, 120, (ctx) => {
    const p = 4;
    const offX = 20;
    const offY = 16;
    // Jas lab ungu violet
    ctx.fillStyle = '#7e22ce';
    ctx.fillRect(offX + 1 * p, offY + 16 * p, 18 * p, 8 * p);
    ctx.fillStyle = '#e9d5ff';
    ctx.fillRect(offX + 7 * p, offY + 16 * p, 6 * p, 8 * p);
    ctx.fillStyle = '#facc15'; // Liontin kristal heksagonal emas
    ctx.fillRect(offX + 9 * p, offY + 18 * p, 2 * p, 2 * p);
    // Leher
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(offX + 7 * p, offY + 13 * p, 6 * p, 3 * p);
    // Wajah cerdas & bijaksana
    ctx.fillRect(offX + 5 * p, offY + 6 * p, 10 * p, 8 * p);
    // Kacamata prisma kristal biru langit
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(offX + 5 * p, offY + 7 * p, 4 * p, 3 * p);
    ctx.fillRect(offX + 11 * p, offY + 7 * p, 4 * p, 3 * p);
    ctx.fillRect(offX + 9 * p, offY + 8 * p, 2 * p, 1 * p);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(offX + 6 * p, offY + 8 * p, 2 * p, 1 * p);
    ctx.fillRect(offX + 12 * p, offY + 8 * p, 2 * p, 1 * p);
    // Senyum simpul
    ctx.fillStyle = '#7c2d12';
    ctx.fillRect(offX + 8 * p, offY + 11 * p, 4 * p, 1 * p);
    // Rambut ungu tua anggun dengan jepit kristal emas
    ctx.fillStyle = '#3b0764';
    ctx.fillRect(offX + 4 * p, offY + 1 * p, 12 * p, 6 * p);
    ctx.fillRect(offX + 2 * p, offY + 4 * p, 3 * p, 7 * p);
    ctx.fillRect(offX + 15 * p, offY + 4 * p, 3 * p, 7 * p);
    ctx.fillStyle = '#facc15'; // Jepit rambut kristal
    ctx.fillRect(offX + 14 * p, offY + 3 * p, 2 * p, 2 * p);
  });
}

// ── 3S. POTRET DR. FARHAN (AHLI GRAVITASI PUSAT BUMI - TRANSPARAN 120x120) ──
export function getDrFarhanPortrait(): HTMLCanvasElement {
  return getOrCreateCanvas('portrait_dr_farhan_trans', 120, 120, (ctx) => {
    const p = 4;
    const offX = 20;
    const offY = 16;
    // Mantel indigo kosmik
    ctx.fillStyle = '#3730a3';
    ctx.fillRect(offX + 1 * p, offY + 16 * p, 18 * p, 8 * p);
    ctx.fillStyle = '#06b6d4'; // Kerah tekno cyan
    ctx.fillRect(offX + 6 * p, offY + 16 * p, 8 * p, 3 * p);
    ctx.fillStyle = '#38bdf8'; // Lencana gravitasi
    ctx.fillRect(offX + 3 * p, offY + 18 * p, 2 * p, 3 * p);
    // Leher
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(offX + 7 * p, offY + 13 * p, 6 * p, 3 * p);
    // Wajah fokus analitis
    ctx.fillRect(offX + 5 * p, offY + 6 * p, 10 * p, 8 * p);
    // Mata tajam
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(offX + 6 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillRect(offX + 12 * p, offY + 8 * p, 2 * p, 2 * p);
    // Headset komunikasi cyan & rambut hitam modern
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(offX + 3 * p, offY + 7 * p, 2 * p, 4 * p);
    ctx.fillRect(offX + 4 * p, offY + 10 * p, 2 * p, 1 * p);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(offX + 4 * p, offY + 2 * p, 12 * p, 5 * p);
    ctx.fillRect(offX + 6 * p, offY + 0 * p, 8 * p, 2 * p);
    ctx.fillRect(offX + 15 * p, offY + 4 * p, 2 * p, 4 * p);
  });
}

// ── 3T. POTRET PETUGAS DIAN (PENGAWAS KAPSUL EVAKUASI INTI - TRANSPARAN 120x120) ──
export function getPetugasDianPortrait(): HTMLCanvasElement {
  return getOrCreateCanvas('portrait_petugas_dian_trans', 120, 120, (ctx) => {
    const p = 4;
    const offX = 20;
    const offY = 16;
    // Wearpack tekanan tinggi hijau zamrud & rompi lime
    ctx.fillStyle = '#059669';
    ctx.fillRect(offX + 1 * p, offY + 16 * p, 18 * p, 8 * p);
    ctx.fillStyle = '#84cc16';
    ctx.fillRect(offX + 5 * p, offY + 16 * p, 10 * p, 3 * p);
    ctx.fillRect(offX + 1 * p, offY + 20 * p, 18 * p, 2 * p);
    // Leher
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(offX + 7 * p, offY + 13 * p, 6 * p, 3 * p);
    // Wajah ramah & tangkas
    ctx.fillRect(offX + 5 * p, offY + 6 * p, 10 * p, 8 * p);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(offX + 6 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillRect(offX + 12 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillStyle = '#7c2d12';
    ctx.fillRect(offX + 8 * p, offY + 11 * p, 4 * p, 1 * p);
    // Helm keselamatan tekanan tinggi zamrud dengan lis emas
    ctx.fillStyle = '#10b981';
    ctx.fillRect(offX + 3 * p, offY + 1 * p, 14 * p, 5 * p);
    ctx.fillRect(offX + 4 * p, offY - 1 * p, 12 * p, 3 * p);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(offX + 5 * p, offY + 4 * p, 10 * p, 2 * p);
  });
}

// ── 3U. POTRET KOMANDAN BINTANG (KEPALA EKSPEDISI PUSAT BUMI - TRANSPARAN 120x120) ──
export function getKomandanBintangPortrait(): HTMLCanvasElement {
  return getOrCreateCanvas('portrait_komandan_bintang_trans', 120, 120, (ctx) => {
    const p = 4;
    const offX = 20;
    const offY = 16;
    // Seragam komando biru laut agung
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(offX + 1 * p, offY + 16 * p, 18 * p, 8 * p);
    ctx.fillStyle = '#eab308'; // Epaulet emas megah di bahu
    ctx.fillRect(offX + 1 * p, offY + 16 * p, 5 * p, 2 * p);
    ctx.fillRect(offX + 14 * p, offY + 16 * p, 5 * p, 2 * p);
    ctx.fillStyle = '#fde047'; // Lencana Bintang Agung Emas di dada
    ctx.fillRect(offX + 4 * p, offY + 19 * p, 4 * p, 4 * p);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(offX + 5 * p, offY + 20 * p, 2 * p, 2 * p);
    // Leher
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(offX + 7 * p, offY + 13 * p, 6 * p, 3 * p);
    // Wajah Berwibawa & Kharismatik
    ctx.fillRect(offX + 5 * p, offY + 6 * p, 10 * p, 8 * p);
    // Mata & Alis Komandan Tegas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(offX + 6 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillRect(offX + 12 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(offX + 5 * p, offY + 6 * p, 4 * p, 1 * p);
    ctx.fillRect(offX + 11 * p, offY + 6 * p, 4 * p, 1 * p);
    // Topi Perwira Komandan Tertinggi dengan Lambang Bintang Emas Berkilau
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(offX + 3 * p, offY + 1 * p, 14 * p, 3 * p);
    ctx.fillRect(offX + 4 * p, offY - 2 * p, 12 * p, 4 * p);
    ctx.fillRect(offX + 14 * p, offY - 1 * p, 4 * p, 3 * p);
    ctx.fillStyle = '#eab308';
    ctx.fillRect(offX + 8 * p, offY - 1 * p, 4 * p, 4 * p);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(offX + 9 * p, offY + 0 * p, 2 * p, 2 * p);
  });
}

// ── 3V. POTRET DR. TAUFIK (PEMANDU GEOLOGIS PANGEA - TRANSPARAN 120x120) ──
export function getDrTaufikPortrait(): HTMLCanvasElement {
  return getOrCreateCanvas('portrait_dr_taufik_trans', 120, 120, (ctx) => {
    const p = 4;
    const offX = 20;
    const offY = 16;
    // Jaket safari khaki & kerah cokelat
    ctx.fillStyle = '#d97706';
    ctx.fillRect(offX + 1 * p, offY + 16 * p, 18 * p, 8 * p);
    ctx.fillStyle = '#92400e';
    ctx.fillRect(offX + 7 * p, offY + 16 * p, 6 * p, 8 * p);
    // Kantong kompas dada
    ctx.fillStyle = '#b45309';
    ctx.fillRect(offX + 3 * p, offY + 18 * p, 4 * p, 4 * p);
    ctx.fillRect(offX + 13 * p, offY + 18 * p, 4 * p, 4 * p);
    // Leher
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(offX + 7 * p, offY + 13 * p, 6 * p, 3 * p);
    // Wajah
    ctx.fillRect(offX + 5 * p, offY + 6 * p, 10 * p, 8 * p);
    // Mata ramah & alis
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(offX + 6 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillRect(offX + 12 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillStyle = '#7c2d12';
    ctx.fillRect(offX + 8 * p, offY + 11 * p, 4 * p, 1 * p);
    // Topi safari penjelajah dengan pita kuning
    ctx.fillStyle = '#b45309';
    ctx.fillRect(offX + 2 * p, offY + 2 * p, 16 * p, 4 * p);
    ctx.fillRect(offX + 4 * p, offY - 1 * p, 12 * p, 4 * p);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(offX + 4 * p, offY + 2 * p, 12 * p, 1 * p);
  });
}

// ── 3W. POTRET PROF. MAYA (AHLI SUPERBENUA PANGEA - TRANSPARAN 120x120) ──
export function getProfMayaPortrait(): HTMLCanvasElement {
  return getOrCreateCanvas('portrait_prof_maya_trans', 120, 120, (ctx) => {
    const p = 4;
    const offX = 20;
    const offY = 16;
    // Mantel ungu terpelajar
    ctx.fillStyle = '#7e22ce';
    ctx.fillRect(offX + 1 * p, offY + 16 * p, 18 * p, 8 * p);
    ctx.fillStyle = '#e2e8f0'; // Syal perak
    ctx.fillRect(offX + 6 * p, offY + 16 * p, 8 * p, 6 * p);
    // Leher
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(offX + 7 * p, offY + 13 * p, 6 * p, 3 * p);
    // Wajah
    ctx.fillRect(offX + 5 * p, offY + 6 * p, 10 * p, 8 * p);
    // Kacamata sains cyan cerdas
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(offX + 5 * p, offY + 7 * p, 4 * p, 3 * p);
    ctx.fillRect(offX + 11 * p, offY + 7 * p, 4 * p, 3 * p);
    ctx.fillRect(offX + 9 * p, offY + 8 * p, 2 * p, 1 * p);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(offX + 6 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillRect(offX + 12 * p, offY + 8 * p, 2 * p, 2 * p);
    // Senyum bijak
    ctx.fillStyle = '#be185d';
    ctx.fillRect(offX + 8 * p, offY + 12 * p, 4 * p, 1 * p);
    // Rambut sanggul rapi gelap dengan jepit perak
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(offX + 4 * p, offY + 2 * p, 12 * p, 5 * p);
    ctx.fillRect(offX + 5 * p, offY - 1 * p, 10 * p, 4 * p);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(offX + 3 * p, offY + 3 * p, 2 * p, 2 * p);
  });
}

// ── 3X. POTRET DR. CITRA (PENELITI PEGUNUNGAN KEMBAR - TRANSPARAN 120x120) ──
export function getDrCitraPortrait(): HTMLCanvasElement {
  return getOrCreateCanvas('portrait_dr_citra_trans', 120, 120, (ctx) => {
    const p = 4;
    const offX = 20;
    const offY = 16;
    // Rompi lapangan terakota & kaos gelap
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(offX + 1 * p, offY + 16 * p, 18 * p, 8 * p);
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(offX + 7 * p, offY + 16 * p, 6 * p, 8 * p);
    ctx.fillStyle = '#10b981'; // Pin geologi zamrud
    ctx.fillRect(offX + 4 * p, offY + 19 * p, 2 * p, 2 * p);
    // Leher
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(offX + 7 * p, offY + 13 * p, 6 * p, 3 * p);
    // Wajah
    ctx.fillRect(offX + 5 * p, offY + 6 * p, 10 * p, 8 * p);
    // Mata antusias & alis
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(offX + 6 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillRect(offX + 12 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillStyle = '#7c2d12';
    ctx.fillRect(offX + 8 * p, offY + 11 * p, 4 * p, 1 * p);
    // Bandana / topi lapangan hijau zamrud
    ctx.fillStyle = '#047857';
    ctx.fillRect(offX + 3 * p, offY + 1 * p, 14 * p, 4 * p);
    ctx.fillRect(offX + 4 * p, offY - 1 * p, 12 * p, 3 * p);
    ctx.fillStyle = '#065f46';
    ctx.fillRect(offX + 4 * p, offY + 4 * p, 12 * p, 1 * p);
  });
}

// ── 3Y. POTRET PROF. ILHAM (AHLI PEMEKARAN SAMUDRA - TRANSPARAN 120x120) ──
export function getProfIlhamPortrait(): HTMLCanvasElement {
  return getOrCreateCanvas('portrait_prof_ilham_trans', 120, 120, (ctx) => {
    const p = 4;
    const offX = 20;
    const offY = 16;
    // Jas laboratorium biru samudra
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(offX + 1 * p, offY + 16 * p, 18 * p, 8 * p);
    ctx.fillStyle = '#06b6d4'; // Indikator sensor termal
    ctx.fillRect(offX + 7 * p, offY + 18 * p, 6 * p, 2 * p);
    // Leher
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(offX + 7 * p, offY + 13 * p, 6 * p, 3 * p);
    // Wajah
    ctx.fillRect(offX + 5 * p, offY + 6 * p, 10 * p, 8 * p);
    // Mata tajam
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(offX + 6 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillRect(offX + 12 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillStyle = '#7c2d12';
    ctx.fillRect(offX + 8 * p, offY + 11 * p, 4 * p, 1 * p);
    // Visor sensor kepala cyan bercahaya
    ctx.fillStyle = '#334155';
    ctx.fillRect(offX + 4 * p, offY + 2 * p, 12 * p, 4 * p);
    ctx.fillRect(offX + 5 * p, offY - 1 * p, 10 * p, 3 * p);
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(offX + 10 * p, offY + 3 * p, 5 * p, 2 * p);
  });
}

// ── 3Z. POTRET KOMANDAN SATRIA (PENJAGA GERBANG LEMBAH RETAKAN - TRANSPARAN 120x120) ──
export function getKomandanSatriaPortrait(): HTMLCanvasElement {
  return getOrCreateCanvas('portrait_komandan_satria_trans', 120, 120, (ctx) => {
    const p = 4;
    const offX = 20;
    const offY = 16;
    // Zirah komando taktis crimson-obsidian
    ctx.fillStyle = '#881337';
    ctx.fillRect(offX + 1 * p, offY + 16 * p, 18 * p, 8 * p);
    ctx.fillStyle = '#e2e8f0'; // Epaulet perak kokoh
    ctx.fillRect(offX + 1 * p, offY + 16 * p, 5 * p, 2 * p);
    ctx.fillRect(offX + 14 * p, offY + 16 * p, 5 * p, 2 * p);
    ctx.fillStyle = '#f43f5e'; // Lencana perisai tektonik
    ctx.fillRect(offX + 4 * p, offY + 19 * p, 4 * p, 4 * p);
    // Leher
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(offX + 7 * p, offY + 13 * p, 6 * p, 3 * p);
    // Wajah Berwibawa & Tegas
    ctx.fillRect(offX + 5 * p, offY + 6 * p, 10 * p, 8 * p);
    // Mata & Alis Komandan
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(offX + 6 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillRect(offX + 12 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillStyle = '#881337';
    ctx.fillRect(offX + 5 * p, offY + 6 * p, 4 * p, 1 * p);
    ctx.fillRect(offX + 11 * p, offY + 6 * p, 4 * p, 1 * p);
    // Topi baret perwira komando crimson dengan emblem perak
    ctx.fillStyle = '#4c0519';
    ctx.fillRect(offX + 3 * p, offY + 1 * p, 14 * p, 3 * p);
    ctx.fillRect(offX + 4 * p, offY - 2 * p, 12 * p, 4 * p);
    ctx.fillRect(offX + 14 * p, offY - 1 * p, 4 * p, 3 * p);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(offX + 8 * p, offY - 1 * p, 4 * p, 4 * p);
  });
}

// ── 3AA. POTRET KOMANDAN ARYA (PENJAGA ALTAR BATAS KONVERGEN - TRANSPARAN 120x120) ──
export function getKomandanAryaPortrait(): HTMLCanvasElement {
  return getOrCreateCanvas('portrait_komandan_arya_trans', 120, 120, (ctx) => {
    const p = 4;
    const offX = 20;
    const offY = 16;
    // Zirah komando pelat andesit merah-oranye lava
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(offX + 1 * p, offY + 16 * p, 18 * p, 8 * p);
    ctx.fillStyle = '#f59e0b'; // Epaulet emas vulkanik
    ctx.fillRect(offX + 1 * p, offY + 16 * p, 5 * p, 2 * p);
    ctx.fillRect(offX + 14 * p, offY + 16 * p, 5 * p, 2 * p);
    ctx.fillStyle = '#fb923c'; // Lencana gunung api di dada
    ctx.fillRect(offX + 4 * p, offY + 19 * p, 4 * p, 4 * p);
    // Leher
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(offX + 7 * p, offY + 13 * p, 6 * p, 3 * p);
    // Wajah Berwibawa
    ctx.fillRect(offX + 5 * p, offY + 6 * p, 10 * p, 8 * p);
    // Mata & Alis Komandan
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(offX + 6 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillRect(offX + 12 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(offX + 5 * p, offY + 6 * p, 4 * p, 1 * p);
    ctx.fillRect(offX + 11 * p, offY + 6 * p, 4 * p, 1 * p);
    // Topi baret perwira komando merah darah dengan emblem elang emas
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(offX + 3 * p, offY + 1 * p, 14 * p, 3 * p);
    ctx.fillRect(offX + 4 * p, offY - 2 * p, 12 * p, 4 * p);
    ctx.fillRect(offX + 14 * p, offY - 1 * p, 4 * p, 3 * p);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(offX + 8 * p, offY - 1 * p, 4 * p, 4 * p);
  });
}

// ── 3BB. POTRET KOMANDAN GUNTUR (KOMANDAN SEKTOR SESAR SAN ANDREAS - TRANSPARAN 120x120) ──
export function getKomandanGunturPortrait(): HTMLCanvasElement {
  return getOrCreateCanvas('portrait_komandan_guntur_trans', 120, 120, (ctx) => {
    const p = 4;
    const offX = 20;
    const offY = 16;
    // Zirah taktis gurun amber-cokelat
    ctx.fillStyle = '#78350f';
    ctx.fillRect(offX + 1 * p, offY + 16 * p, 18 * p, 8 * p);
    // Epaulet komandan emas
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(offX + 1 * p, offY + 16 * p, 5 * p, 2 * p);
    ctx.fillRect(offX + 14 * p, offY + 16 * p, 5 * p, 2 * p);
    // Lencana perisai sesar tektonik emas berkilau
    ctx.fillStyle = '#fde047';
    ctx.fillRect(offX + 4 * p, offY + 19 * p, 4 * p, 4 * p);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(offX + 5 * p, offY + 20 * p, 2 * p, 2 * p);
    // Leher
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(offX + 7 * p, offY + 13 * p, 6 * p, 3 * p);
    // Wajah Berwibawa & Tangguh
    ctx.fillRect(offX + 5 * p, offY + 6 * p, 10 * p, 8 * p);
    // Mata tajam
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(offX + 6 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillRect(offX + 12 * p, offY + 8 * p, 2 * p, 2 * p);
    // Alis tebal komandan
    ctx.fillStyle = '#451a03';
    ctx.fillRect(offX + 5 * p, offY + 6 * p, 4 * p, 1 * p);
    ctx.fillRect(offX + 11 * p, offY + 6 * p, 4 * p, 1 * p);
    // Kumis rapi militer
    ctx.fillRect(offX + 7 * p, offY + 11 * p, 6 * p, 1 * p);
    // Baret perwira komando gurun cokelat tua dengan emblem emas
    ctx.fillStyle = '#451a03';
    ctx.fillRect(offX + 3 * p, offY + 1 * p, 14 * p, 3 * p);
    ctx.fillRect(offX + 4 * p, offY - 2 * p, 12 * p, 4 * p);
    ctx.fillRect(offX + 14 * p, offY - 1 * p, 4 * p, 3 * p);
    ctx.fillStyle = '#fde047';
    ctx.fillRect(offX + 8 * p, offY - 1 * p, 4 * p, 4 * p);
  });
}

// ── HELPER DASAR: MENGAMBIL PORTRAIT MENTAH NPC ──
function getRawNpcPortrait(type: string): HTMLCanvasElement {
  switch (type) {
    case 'kapten_maya':
      return getKaptenMayaPortrait();
    case 'resqy':
      return getResqyPortrait();
    case 'dr_gea':
      return getDrGeaPortrait();
    case 'prof_andini':
      return getProfAndiniPortrait();
    case 'inspektur_budi':
      return getInspekturBudiPortrait();
    case 'komandan_hendra':
      return getKomandanHendraPortrait();
    case 'prof_sarah':
      return getProfSarahPortrait();
    case 'dr_bayu':
      return getDrBayuPortrait();
    case 'dr_danang':
      return getDrDanangPortrait();
    case 'petugas_rudi':
      return getPetugasRudiPortrait();
    case 'komandan_surya':
      return getKomandanSuryaPortrait();
    case 'dr_fajar':
      return getDrFajarPortrait();
    case 'prof_ratna':
      return getProfRatnaPortrait();
    case 'dr_aris':
      return getDrArisPortrait();
    case 'petugas_joko':
      return getPetugasJokoPortrait();
    case 'komandan_teguh':
      return getKomandanTeguhPortrait();
    case 'dr_bagus':
      return getDrBagusPortrait();
    case 'prof_lestari':
      return getProfLestariPortrait();
    case 'dr_farhan':
      return getDrFarhanPortrait();
    case 'petugas_dian':
      return getPetugasDianPortrait();
    case 'komandan_bintang':
      return getKomandanBintangPortrait();
    case 'dr_taufik':
      return getDrTaufikPortrait();
    case 'prof_maya':
      return getProfMayaPortrait();
    case 'dr_citra':
      return getDrCitraPortrait();
    case 'prof_ilham':
      return getProfIlhamPortrait();
    case 'komandan_satria':
      return getKomandanSatriaPortrait();
    case 'komandan_arya':
      return getKomandanAryaPortrait();
    case 'komandan_guntur':
      return getKomandanGunturPortrait();
    case 'prof_raditya':
    default:
      return getProfRadityaPortrait();
  }
}

// ── HELPER UNIVERSAL: MENGAMBIL PORTRAIT NPC BERDASARKAN TIPE & ZONA ──
export function getNpcPortrait(type: string, zoneId?: string): HTMLCanvasElement {
  // Resqy adalah robot terbang kompanion, tidak perlu berganti pakaian
  if (type === 'resqy') return getResqyPortrait();

  const isCrust = zoneId === 'crust';
  const isHeatZone = zoneId === 'mantle' || zoneId === 'outerCore' || zoneId === 'innerCore';
  const baseCanvas = getRawNpcPortrait(type);

  if (!isCrust && !isHeatZone) {
    return baseCanvas;
  }

  const envMode = isCrust ? 'miner' : 'hazard';
  const cacheKey = `portrait_npc_${type}_${envMode}`;

  return getOrCreateCanvas(cacheKey, 120, 120, (ctx) => {
    // 1. Gambar portrait dasar NPC
    ctx.drawImage(baseCanvas, 0, 0);

    const p = 4;
    const offX = 20;
    const offY = 16;

    if (isCrust) {
      // ── KOSTUM PENAMBANG KERAK BUMI ──
      // Rompi Tambang High-Vis Oranye & Strip Reflektor Neon
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(offX + 1 * p, offY + 16 * p, 18 * p, 8 * p);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(offX + 1 * p, offY + 19 * p, 18 * p, 2 * p);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(offX + 3 * p, offY + 19 * p, 14 * p, 1 * p);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(offX + 9 * p, offY + 16 * p, 2 * p, 8 * p); // Zipper

      // Helm Proyek Tambang Kuning & Headlamp Menyala Terang
      ctx.fillStyle = '#eab308';
      ctx.fillRect(offX + 4 * p, offY - 2 * p, 12 * p, 7 * p);
      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(offX + 3 * p, offY + 4 * p, 14 * p, 2 * p); // Brim
      // Lampu senter helm
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(offX + 8 * p, offY + 0 * p, 4 * p, 4 * p);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(offX + 9 * p, offY + 1 * p, 2 * p, 2 * p);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(offX + 9 * p, offY + 0 * p, 2 * p, 1 * p);
    } else if (isHeatZone) {
      // ── KOSTUM PELINDUNG MASA DEPAN TAHAN PANAS (MANTEL / INTI) ──
      // Baju Pelindung Titanium Krio
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(offX + 1 * p, offY + 16 * p, 18 * p, 8 * p);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(offX + 0 * p, offY + 16 * p, 3 * p, 4 * p);
      ctx.fillRect(offX + 17 * p, offY + 16 * p, 3 * p, 4 * p);
      // Inti pendingin krio di dada
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(offX + 7 * p, offY + 17 * p, 6 * p, 6 * p);
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(offX + 8 * p, offY + 18 * p, 4 * p, 4 * p);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(offX + 9 * p, offY + 19 * p, 2 * p, 2 * p);
      // Conduits pendingin cyan
      ctx.fillStyle = '#22d3ee';
      ctx.fillRect(offX + 3 * p, offY + 17 * p, 2 * p, 6 * p);
      ctx.fillRect(offX + 15 * p, offY + 17 * p, 2 * p, 6 * p);

      // Helm Futuristik Tertutup dengan Visor HUD Cyan
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(offX + 3 * p, offY - 2 * p, 14 * p, 16 * p);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(offX + 2 * p, offY + 2 * p, 2 * p, 10 * p);
      ctx.fillRect(offX + 16 * p, offY + 2 * p, 2 * p, 10 * p);
      // Visor kaca HUD neon cyan
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(offX + 5 * p, offY + 4 * p, 10 * p, 6 * p);
      ctx.fillStyle = '#22d3ee';
      ctx.fillRect(offX + 6 * p, offY + 5 * p, 8 * p, 4 * p);
      ctx.fillStyle = '#a5f3fc';
      ctx.fillRect(offX + 7 * p, offY + 6 * p, 4 * p, 1 * p);
    }
  });
}

// ── 3H. POTRET BESAR KARAKTER PEMAIN (CUSTOM AVATAR SISWA - TRANSPARAN) ──
export function getPlayerPortrait(avatarConfig?: CustomAvatarConfig, zoneId?: string): HTMLCanvasElement {
  const skinKey = avatarConfig?.skin || 'warm';
  const hairKey = avatarConfig?.hairStyle || 'spiky';
  const hairColor = avatarConfig?.hairColor || '#3e2723';
  const outfitKey = avatarConfig?.outfit || 'vest-orange';
  const isCrust = zoneId === 'crust';
  const isHeatZone = zoneId === 'mantle' || zoneId === 'outerCore' || zoneId === 'innerCore';
  const envMode = isCrust ? 'miner' : isHeatZone ? 'hazard' : 'normal';
  const cacheKey = `portrait_player_trans_${skinKey}_${hairKey}_${hairColor}_${outfitKey}_${envMode}`;

  return getOrCreateCanvas(cacheKey, 120, 120, (ctx) => {
    // 100% Transparan tanpa kotak latar belakang
    const skinPalette: Record<string, { base: string; shadow: string; blush?: string }> = {
      light: { base: '#fed7aa', shadow: '#fba874', blush: '#fb7185' },
      warm: { base: '#f5af7e', shadow: '#d97746', blush: '#f43f5e' },
      tan: { base: '#d97706', shadow: '#9a4214', blush: '#b45309' },
      brown: { base: '#92400e', shadow: '#5c2a10' },
      dark: { base: '#5c2c16', shadow: '#3a190b' },
      robot: { base: '#38bdf8', shadow: '#0284c7', blush: '#67e8f9' },
    };
    const skin = skinPalette[skinKey] || skinPalette.warm;

    const outfitPalette: Record<string, { primary: string; secondary: string }> = {
      'vest-orange': { primary: '#ea580c', secondary: '#facc15' },
      'jacket-blue': { primary: '#0284c7', secondary: '#38bdf8' },
      'gear-red': { primary: '#dc2626', secondary: '#ffffff' },
      'khaki': { primary: '#a16207', secondary: '#fed7aa' },
      'cyber': { primary: '#06b6d4', secondary: '#c084fc' },
    };
    const outfit = outfitPalette[outfitKey] || outfitPalette['vest-orange'];

    const p = 4;
    const offX = 20;
    const offY = 16;

    // Baju & Bahu Siswa
    ctx.fillStyle = outfit.primary;
    ctx.fillRect(offX + 1 * p, offY + 16 * p, 18 * p, 8 * p);
    ctx.fillStyle = outfit.secondary;
    ctx.fillRect(offX + 7 * p, offY + 16 * p, 6 * p, 8 * p);

    // Leher
    ctx.fillStyle = skin.shadow;
    ctx.fillRect(offX + 7 * p, offY + 13 * p, 6 * p, 3 * p);

    // Wajah Siswa
    ctx.fillStyle = skin.base;
    ctx.fillRect(offX + 5 * p, offY + 6 * p, 10 * p, 8 * p);

    // Pipi Merona / Robot glow
    if (skin.blush) {
      ctx.fillStyle = skin.blush;
      ctx.fillRect(offX + 5 * p, offY + 10 * p, 2 * p, 1 * p);
      ctx.fillRect(offX + 13 * p, offY + 10 * p, 2 * p, 1 * p);
    }

    // Mata Siswa yang Bersemangat (Determined eyes)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(offX + 6 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillRect(offX + 12 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(offX + 6 * p, offY + 8 * p, 1 * p, 1 * p);
    ctx.fillRect(offX + 12 * p, offY + 8 * p, 1 * p, 1 * p);

    // Senyum Percaya Diri
    ctx.fillStyle = '#7c2d12';
    ctx.fillRect(offX + 8 * p, offY + 11 * p, 4 * p, 1 * p);

    // Rambut Sesuai Kustomisasi Siswa
    ctx.fillStyle = hairColor;
    if (hairKey === 'spiky') {
      ctx.fillRect(offX + 4 * p, offY + 2 * p, 12 * p, 5 * p);
      ctx.fillRect(offX + 5 * p, offY + 0 * p, 3 * p, 2 * p);
      ctx.fillRect(offX + 9 * p, offY - 1 * p, 3 * p, 3 * p);
      ctx.fillRect(offX + 13 * p, offY + 0 * p, 3 * p, 2 * p);
      ctx.fillRect(offX + 3 * p, offY + 5 * p, 2 * p, 5 * p);
      ctx.fillRect(offX + 15 * p, offY + 5 * p, 2 * p, 5 * p);
    } else {
      ctx.fillRect(offX + 4 * p, offY + 3 * p, 12 * p, 5 * p);
      ctx.fillRect(offX + 4 * p, offY + 1 * p, 10 * p, 3 * p);
      ctx.fillRect(offX + 3 * p, offY + 5 * p, 2 * p, 6 * p);
      ctx.fillRect(offX + 15 * p, offY + 5 * p, 2 * p, 6 * p);
    }

    // ── OVERLAY KOSTUM BERDASARKAN ZONA (JIKA ADA) ──
    if (isCrust) {
      // Rompi Tambang High-Vis Oranye & Strip Reflektor Neon
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(offX + 1 * p, offY + 16 * p, 18 * p, 8 * p);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(offX + 1 * p, offY + 19 * p, 18 * p, 2 * p);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(offX + 3 * p, offY + 19 * p, 14 * p, 1 * p);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(offX + 9 * p, offY + 16 * p, 2 * p, 8 * p);

      // Helm Keselamatan Tambang Kuning & Lampu Senter Kepala (Headlamp)
      ctx.fillStyle = '#eab308';
      ctx.fillRect(offX + 4 * p, offY - 2 * p, 12 * p, 7 * p);
      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(offX + 3 * p, offY + 4 * p, 14 * p, 2 * p);
      // Lampu senter helm
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(offX + 8 * p, offY + 0 * p, 4 * p, 4 * p);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(offX + 9 * p, offY + 1 * p, 2 * p, 2 * p);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(offX + 9 * p, offY + 0 * p, 2 * p, 1 * p);
    } else if (isHeatZone) {
      // Baju Pelindung Titanium Krio
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(offX + 1 * p, offY + 16 * p, 18 * p, 8 * p);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(offX + 0 * p, offY + 16 * p, 3 * p, 4 * p);
      ctx.fillRect(offX + 17 * p, offY + 16 * p, 3 * p, 4 * p);
      // Inti pendingin krio di dada
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(offX + 7 * p, offY + 17 * p, 6 * p, 6 * p);
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(offX + 8 * p, offY + 18 * p, 4 * p, 4 * p);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(offX + 9 * p, offY + 19 * p, 2 * p, 2 * p);
      // Conduits pendingin cyan
      ctx.fillStyle = '#22d3ee';
      ctx.fillRect(offX + 3 * p, offY + 17 * p, 2 * p, 6 * p);
      ctx.fillRect(offX + 15 * p, offY + 17 * p, 2 * p, 6 * p);

      // Helm Futuristik Tertutup dengan Visor HUD Cyan
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(offX + 3 * p, offY - 2 * p, 14 * p, 16 * p);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(offX + 2 * p, offY + 2 * p, 2 * p, 10 * p);
      ctx.fillRect(offX + 16 * p, offY + 2 * p, 2 * p, 10 * p);
      // Visor kaca HUD neon cyan
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(offX + 5 * p, offY + 4 * p, 10 * p, 6 * p);
      ctx.fillStyle = '#22d3ee';
      ctx.fillRect(offX + 6 * p, offY + 5 * p, 8 * p, 4 * p);
      ctx.fillStyle = '#a5f3fc';
      ctx.fillRect(offX + 7 * p, offY + 6 * p, 4 * p, 1 * p);
    }
  });
}
