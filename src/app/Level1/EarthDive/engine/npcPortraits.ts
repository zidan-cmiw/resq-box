/**
 * Potret NPC untuk kotak dialog Earth Dive.
 *
 * Berkas ini dipecah dari npcSprites.ts. Isinya 37 fungsi potret beserta
 * cache kanvasnya. Dipisahkan karena menggambar NPC di dunia permainan
 * (drawNpcOnWorld, 2.264 baris) sama sekali tidak berhubungan dengan
 * menggambar wajah untuk dialog.
 *
 * Seluruh fungsi potret hanya bergantung pada getOrCreateCanvas dan
 * portraitCache, sehingga dapat berdiri sendiri tanpa menyentuh kode dunia.
 */
import type { CustomAvatarConfig } from '../../../../store/teacherStore';


export const portraitCache = new Map<string, HTMLCanvasElement>();

export function getOrCreateCanvas(key: string, w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void): HTMLCanvasElement {
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

/** Kosongkan cache potret. Dipakai saat memori perlu dibebaskan. */
export function clearPortraitCache(): void {
  portraitCache.clear();
}


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

// ── 3C. POTRET BESAR MASKOT RESQY BURUNG HANTU (TRANSPARAN 120x120) ──

// ── 3C. POTRET BESAR MASKOT RESQY BURUNG HANTU (TRANSPARAN 120x120) ──
export function getResqyPortrait(): HTMLCanvasElement {
  return getOrCreateCanvas('portrait_resqy_owl_trans', 120, 120, (ctx) => {
    // 100% Transparan tanpa kotak latar belakang
    const p = 4;
    const offX = 20;
    const offY = 16;

    // 1. Telinga Bulu Burung Hantu (Ear Tufts)
    ctx.fillStyle = '#78350f';
    ctx.fillRect(offX + 2 * p, offY - 4 * p, 4 * p, 6 * p);
    ctx.fillRect(offX + 14 * p, offY - 4 * p, 4 * p, 6 * p);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(offX + 3 * p, offY - 3 * p, 2 * p, 4 * p);
    ctx.fillRect(offX + 15 * p, offY - 3 * p, 2 * p, 4 * p);

    // 2. Kepala & Bodi Utama (Tawny Feather Contour)
    ctx.fillStyle = '#451a03';
    ctx.fillRect(offX + 2 * p, offY + 0 * p, 16 * p, 18 * p);
    ctx.fillRect(offX + 1 * p, offY + 2 * p, 18 * p, 14 * p);

    ctx.fillStyle = '#92400e';
    ctx.fillRect(offX + 3 * p, offY + 1 * p, 14 * p, 16 * p);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(offX + 4 * p, offY + 2 * p, 12 * p, 14 * p);

    // 3. Bulu Pipi & Wajah Bulat (Facial Disk)
    ctx.fillStyle = '#d97706';
    ctx.fillRect(offX + 3 * p, offY + 4 * p, 6 * p, 7 * p);
    ctx.fillRect(offX + 11 * p, offY + 4 * p, 6 * p, 7 * p);

    // 4. Sayap Burung Hantu di Sisi (Folded Wings)
    ctx.fillStyle = '#78350f';
    ctx.fillRect(offX + 1 * p, offY + 8 * p, 3 * p, 9 * p);
    ctx.fillRect(offX + 16 * p, offY + 8 * p, 3 * p, 9 * p);
    ctx.fillStyle = '#92400e';
    ctx.fillRect(offX + 2 * p, offY + 9 * p, 2 * p, 7 * p);
    ctx.fillRect(offX + 16 * p, offY + 9 * p, 2 * p, 7 * p);

    // 5. Dada Bulu Lembut Krem & Chevron
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(offX + 5 * p, offY + 9 * p, 10 * p, 8 * p);
    ctx.fillStyle = '#fde68a';
    ctx.fillRect(offX + 6 * p, offY + 10 * p, 8 * p, 6 * p);
    // Motif V-chevron bulu dada
    ctx.fillStyle = '#b45309';
    ctx.fillRect(offX + 7 * p, offY + 11 * p, 2 * p, 1 * p);
    ctx.fillRect(offX + 11 * p, offY + 11 * p, 2 * p, 1 * p);
    ctx.fillRect(offX + 9 * p, offY + 13 * p, 2 * p, 1 * p);

    // 6. Mata Bulat Besar Burung Hantu (Huge Expressive Wise Eyes)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(offX + 4 * p, offY + 4 * p, 5 * p, 5 * p);
    ctx.fillRect(offX + 11 * p, offY + 4 * p, 5 * p, 5 * p);

    ctx.fillStyle = '#fef08a';
    ctx.fillRect(offX + 5 * p, offY + 5 * p, 4 * p, 4 * p);
    ctx.fillRect(offX + 11 * p, offY + 5 * p, 4 * p, 4 * p);

    // Kacamata Bulat Peneliti Emas (Gold Scholar Glasses)
    ctx.fillStyle = '#d97706';
    ctx.fillRect(offX + 3 * p, offY + 3 * p, 6 * p, 1 * p);
    ctx.fillRect(offX + 11 * p, offY + 3 * p, 6 * p, 1 * p);
    ctx.fillRect(offX + 9 * p, offY + 6 * p, 2 * p, 1 * p); // Jembatan kacamata
    ctx.fillRect(offX + 3 * p, offY + 4 * p, 1 * p, 5 * p);
    ctx.fillRect(offX + 16 * p, offY + 4 * p, 1 * p, 5 * p);

    // Pupil Hitam & Glint
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(offX + 6 * p, offY + 6 * p, 2 * p, 3 * p);
    ctx.fillRect(offX + 12 * p, offY + 6 * p, 2 * p, 3 * p);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(offX + 6 * p, offY + 5 * p, 1 * p, 1 * p);
    ctx.fillRect(offX + 12 * p, offY + 5 * p, 1 * p, 1 * p);

    // 7. Paruh Emas-Oranye (Beak)
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(offX + 9 * p, offY + 7 * p, 2 * p, 3 * p);
    ctx.fillStyle = '#f97316';
    ctx.fillRect(offX + 9 * p, offY + 8 * p, 2 * p, 1 * p);

    // 8. Cakar Kuning Imut di Bawah
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(offX + 6 * p, offY + 17 * p, 3 * p, 2 * p);
    ctx.fillRect(offX + 11 * p, offY + 17 * p, 3 * p, 2 * p);
  });
}

// ── 3C-1. POTRET BESAR ZIDANE (KETUA & DEV UTAMA: KACAMATA, RAMBUT BERANTAKAN, BAJU HITAM) ──

// ── 3C-1. POTRET BESAR ZIDANE (KETUA & DEV UTAMA: KACAMATA, RAMBUT BERANTAKAN, BAJU HITAM) ──
export function getZidanePortrait(): HTMLCanvasElement {
  return getOrCreateCanvas('portrait_zidane_trans', 120, 120, (ctx) => {
    const p = 4;
    const offX = 20;
    const offY = 16;

    // Bahu & Baju Hitam Cool
    ctx.fillStyle = '#09090b';
    ctx.fillRect(offX + 1 * p, offY + 16 * p, 18 * p, 8 * p);
    ctx.fillStyle = '#18181b';
    ctx.fillRect(offX + 3 * p, offY + 17 * p, 14 * p, 7 * p);
    ctx.fillStyle = '#334155'; // Kerah dalam
    ctx.fillRect(offX + 8 * p, offY + 16 * p, 4 * p, 5 * p);

    // Leher & Dagu (Kulit Putih)
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(offX + 7 * p, offY + 13 * p, 6 * p, 3 * p);

    // Wajah
    ctx.fillRect(offX + 5 * p, offY + 6 * p, 10 * p, 8 * p);

    // Kacamata Persegi Modern Hitam & Glint Cyan
    ctx.fillStyle = '#09090b';
    ctx.fillRect(offX + 5 * p, offY + 7 * p, 4 * p, 3 * p);
    ctx.fillRect(offX + 11 * p, offY + 7 * p, 4 * p, 3 * p);
    ctx.fillRect(offX + 9 * p, offY + 8 * p, 2 * p, 1 * p); // Bridge
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(offX + 6 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillRect(offX + 12 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillStyle = '#ffffff'; // Glint
    ctx.fillRect(offX + 6 * p, offY + 8 * p, 1 * p, 1 * p);
    ctx.fillRect(offX + 12 * p, offY + 8 * p, 1 * p, 1 * p);

    // Senyum Tenang Cool
    ctx.fillStyle = '#451a03';
    ctx.fillRect(offX + 8 * p, offY + 12 * p, 4 * p, 1 * p);

    // Rambut Hitam Berantakan Stylish (Messy Hair)
    ctx.fillStyle = '#09090b';
    ctx.fillRect(offX + 3 * p, offY + 3 * p, 14 * p, 4 * p);
    ctx.fillRect(offX + 2 * p, offY + 5 * p, 3 * p, 5 * p); // Sisi kiri
    ctx.fillRect(offX + 15 * p, offY + 5 * p, 3 * p, 5 * p); // Sisi kanan
    // Spikes ikal atas berantakan
    ctx.fillRect(offX + 5 * p, offY - 1 * p, 4 * p, 4 * p);
    ctx.fillRect(offX + 11 * p, offY - 2 * p, 4 * p, 5 * p);
    ctx.fillRect(offX + 8 * p, offY + 0 * p, 3 * p, 4 * p);
    ctx.fillStyle = '#27272a'; // Highlight rambut
    ctx.fillRect(offX + 6 * p, offY + 1 * p, 2 * p, 2 * p);
    ctx.fillRect(offX + 12 * p, offY + 0 * p, 2 * p, 2 * p);
  });
}

// ── 3C-2. POTRET BESAR ZAHRA (UI/UX: CANTIK, IMUT, GEMESIN, KACAMATA, KERUDUNG BIRU, BAJU PINK, CERIA) ──

// ── 3C-2. POTRET BESAR ZAHRA (UI/UX: CANTIK, IMUT, GEMESIN, KACAMATA, KERUDUNG BIRU, BAJU PINK, CERIA) ──
export function getZahraPortrait(): HTMLCanvasElement {
  return getOrCreateCanvas('portrait_zahra_trans', 120, 120, (ctx) => {
    const p = 4;
    const offX = 20;
    const offY = 16;

    // Baju Pink Manis & Bahu
    ctx.fillStyle = '#ec4899';
    ctx.fillRect(offX + 1 * p, offY + 16 * p, 18 * p, 8 * p);
    ctx.fillStyle = '#f472b6';
    ctx.fillRect(offX + 3 * p, offY + 17 * p, 14 * p, 7 * p);

    // Kerudung Biru Cerah (Sky Blue Hijab) Folds di Leher & Dada
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(offX + 6 * p, offY + 13 * p, 8 * p, 6 * p);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(offX + 7 * p, offY + 14 * p, 6 * p, 4 * p);

    // Kerudung Biru Utama Melingkari Kepala
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(offX + 3 * p, offY + 2 * p, 14 * p, 13 * p);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(offX + 4 * p, offY + 1 * p, 12 * p, 4 * p); // Puncak kerudung

    // Wajah Cantik Imut & Berseri
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(offX + 6 * p, offY + 5 * p, 8 * p, 8 * p);

    // Pipi Merona Pink Manis (Blush)
    ctx.fillStyle = '#fda4af';
    ctx.fillRect(offX + 5 * p, offY + 10 * p, 2 * p, 2 * p);
    ctx.fillRect(offX + 13 * p, offY + 10 * p, 2 * p, 2 * p);

    // Kacamata Bulat Imut Emas
    ctx.fillStyle = '#d97706';
    ctx.fillRect(offX + 5 * p, offY + 7 * p, 4 * p, 3 * p);
    ctx.fillRect(offX + 11 * p, offY + 7 * p, 4 * p, 3 * p);
    ctx.fillRect(offX + 9 * p, offY + 8 * p, 2 * p, 1 * p); // Bridge
    // Mata berbinar ceria
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(offX + 6 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillRect(offX + 12 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(offX + 6 * p, offY + 8 * p, 1 * p, 1 * p);
    ctx.fillRect(offX + 12 * p, offY + 8 * p, 1 * p, 1 * p);

    // Senyum Ceria Cantik
    ctx.fillStyle = '#e11d48';
    ctx.fillRect(offX + 8 * p, offY + 11 * p, 4 * p, 2 * p);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(offX + 9 * p, offY + 11 * p, 2 * p, 1 * p);
  });
}

// ── 3C-3. POTRET BESAR ICAN (HARDWARE ENGINEER: RAMBUT IKAL, SIFAT AGAK NGESELIN / USIL, CASUAL SPORTY) ──

// ── 3C-3. POTRET BESAR ICAN (HARDWARE ENGINEER: RAMBUT IKAL, SIFAT AGAK NGESELIN / USIL, CASUAL SPORTY) ──
export function getIcanPortrait(): HTMLCanvasElement {
  return getOrCreateCanvas('portrait_ican_trans', 120, 120, (ctx) => {
    const p = 4;
    const offX = 20;
    const offY = 16;

    // Kaos Sporty Oranye-Abu
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(offX + 1 * p, offY + 16 * p, 18 * p, 8 * p);
    ctx.fillStyle = '#fb923c';
    ctx.fillRect(offX + 4 * p, offY + 17 * p, 12 * p, 7 * p);
    ctx.fillStyle = '#334155'; // Kerah dalam
    ctx.fillRect(offX + 8 * p, offY + 16 * p, 4 * p, 4 * p);

    // Leher Sawo Matang Natural
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(offX + 7 * p, offY + 13 * p, 6 * p, 3 * p);

    // Wajah
    ctx.fillRect(offX + 5 * p, offY + 6 * p, 10 * p, 8 * p);

    // Mata Santai Usil
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(offX + 6 * p, offY + 8 * p, 3 * p, 2 * p);
    ctx.fillRect(offX + 11 * p, offY + 8 * p, 3 * p, 2 * p);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(offX + 7 * p, offY + 8 * p, 1 * p, 1 * p);
    ctx.fillRect(offX + 12 * p, offY + 8 * p, 1 * p, 1 * p);

    // Senyum Miring Usil (Playful Smirk)
    ctx.fillStyle = '#7c2d12';
    ctx.fillRect(offX + 8 * p, offY + 12 * p, 4 * p, 1 * p);
    ctx.fillRect(offX + 12 * p, offY + 11 * p, 1 * p, 1 * p); // Ujung bibir terangkat

    // Rambut Ikal Mengembang Khas (Voluminous Curly Hair)
    ctx.fillStyle = '#18181b';
    ctx.fillRect(offX + 3 * p, offY + 2 * p, 14 * p, 5 * p);
    // Gumpalan ikal di atas & pelipis
    ctx.fillRect(offX + 2 * p, offY - 2 * p, 5 * p, 5 * p);
    ctx.fillRect(offX + 7 * p, offY - 4 * p, 6 * p, 6 * p);
    ctx.fillRect(offX + 13 * p, offY - 2 * p, 5 * p, 5 * p);
    ctx.fillStyle = '#27272a'; // Texture highlight ikal
    ctx.fillRect(offX + 3 * p, offY - 1 * p, 2 * p, 2 * p);
    ctx.fillRect(offX + 9 * p, offY - 3 * p, 3 * p, 2 * p);
    ctx.fillRect(offX + 14 * p, offY - 1 * p, 2 * p, 2 * p);
  });
}

// ── 3C-4. POTRET BESAR LINTANG (MATERI IPA: KERUDUNG HIJAU, PINTAR, ANALITIS, RUNTUT) ──

// ── 3C-4. POTRET BESAR LINTANG (MATERI IPA: KERUDUNG HIJAU, PINTAR, ANALITIS, RUNTUT) ──
export function getLintangPortrait(): HTMLCanvasElement {
  return getOrCreateCanvas('portrait_lintang_trans', 120, 120, (ctx) => {
    const p = 4;
    const offX = 20;
    const offY = 16;

    // Tunik Elegan Toska Muda
    ctx.fillStyle = '#0d9488';
    ctx.fillRect(offX + 1 * p, offY + 16 * p, 18 * p, 8 * p);
    ctx.fillStyle = '#14b8a6';
    ctx.fillRect(offX + 3 * p, offY + 17 * p, 14 * p, 7 * p);

    // Kerudung Hijau Emerald (Green Hijab) Folds di Dada
    ctx.fillStyle = '#15803d';
    ctx.fillRect(offX + 6 * p, offY + 13 * p, 8 * p, 6 * p);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(offX + 7 * p, offY + 14 * p, 6 * p, 4 * p);

    // Kerudung Hijau Utama Melingkari Kepala
    ctx.fillStyle = '#15803d';
    ctx.fillRect(offX + 3 * p, offY + 2 * p, 14 * p, 13 * p);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(offX + 4 * p, offY + 1 * p, 12 * p, 4 * p);

    // Wajah Bersih & Cerdas
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(offX + 6 * p, offY + 5 * p, 8 * p, 8 * p);

    // Mata Jernih Berwawasan
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(offX + 7 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillRect(offX + 11 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(offX + 7 * p, offY + 8 * p, 1 * p, 1 * p);
    ctx.fillRect(offX + 11 * p, offY + 8 * p, 1 * p, 1 * p);

    // Senyum Ramah & Percaya Diri
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(offX + 8 * p, offY + 11 * p, 4 * p, 1 * p);
  });
}

// ── 3C-5. POTRET BESAR BU TYAS (DOSEN PEMBIMBING: KACAMATA, KERUDUNG HITAM, DOSEN BIJAKSANA) ──

// ── 3C-5. POTRET BESAR BU TYAS (DOSEN PEMBIMBING: KACAMATA, KERUDUNG HITAM, DOSEN BIJAKSANA) ──
export function getBuTyasPortrait(): HTMLCanvasElement {
  return getOrCreateCanvas('portrait_bu_tyas_trans', 120, 120, (ctx) => {
    const p = 4;
    const offX = 20;
    const offY = 16;

    // Blazer Dosen Formal Maroon Tua & Bahu
    ctx.fillStyle = '#881337';
    ctx.fillRect(offX + 1 * p, offY + 16 * p, 18 * p, 8 * p);
    ctx.fillStyle = '#9f1239';
    ctx.fillRect(offX + 3 * p, offY + 17 * p, 14 * p, 7 * p);
    // Kemeja dalam putih & Pin Bros Emas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(offX + 8 * p, offY + 16 * p, 4 * p, 5 * p);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(offX + 4 * p, offY + 18 * p, 2 * p, 2 * p);

    // Kerudung Hitam Anggun Folds di Leher
    ctx.fillStyle = '#09090b';
    ctx.fillRect(offX + 6 * p, offY + 13 * p, 8 * p, 5 * p);
    ctx.fillStyle = '#18181b';
    ctx.fillRect(offX + 7 * p, offY + 14 * p, 6 * p, 4 * p);

    // Kerudung Hitam Utama Melingkari Kepala
    ctx.fillStyle = '#09090b';
    ctx.fillRect(offX + 3 * p, offY + 2 * p, 14 * p, 13 * p);
    ctx.fillStyle = '#18181b';
    ctx.fillRect(offX + 4 * p, offY + 1 * p, 12 * p, 4 * p);

    // Wajah Bijaksana & Berwibawa
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(offX + 6 * p, offY + 5 * p, 8 * p, 8 * p);

    // Kacamata Dosen Elegan Emas
    ctx.fillStyle = '#d97706';
    ctx.fillRect(offX + 5 * p, offY + 7 * p, 4 * p, 3 * p);
    ctx.fillRect(offX + 11 * p, offY + 7 * p, 4 * p, 3 * p);
    ctx.fillRect(offX + 9 * p, offY + 8 * p, 2 * p, 1 * p); // Bridge
    // Mata Bijak Mengayomi
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(offX + 6 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillRect(offX + 12 * p, offY + 8 * p, 2 * p, 2 * p);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(offX + 6 * p, offY + 8 * p, 1 * p, 1 * p);
    ctx.fillRect(offX + 12 * p, offY + 8 * p, 1 * p, 1 * p);

    // Senyum Hangat Mengayomi
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(offX + 8 * p, offY + 11 * p, 4 * p, 1 * p);
  });
}

// ══════════════════════════════════════════════════════════════════════════
// INDIKATOR KACA PEMBESAR MATERI EDUKASI (FLOATING DISCOVERY INDICATOR)
// ══════════════════════════════════════════════════════════════════════════

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

// ── HELPER DASAR: MENGAMBIL PORTRAIT MENTAH NPC ──
export function getRawNpcPortrait(type: string): HTMLCanvasElement {
  switch (type) {
    case 'zidane':
      return getZidanePortrait();
    case 'zahra':
      return getZahraPortrait();
    case 'ican':
      return getIcanPortrait();
    case 'lintang':
      return getLintangPortrait();
    case 'bu_tyas':
      return getBuTyasPortrait();
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

    // Rambut / Hijab Sesuai Kustomisasi Siswa
    ctx.fillStyle = hairColor;

    if (hairKey === 'hijab') {
      // ── HIJAB RESCUER (Sesuai Bengkel Avatar) ──
      ctx.fillRect(offX + 4 * p, offY + 0 * p, 12 * p, 6 * p);
      ctx.fillRect(offX + 5 * p, offY - 2 * p, 10 * p, 3 * p);
      ctx.fillRect(offX + 6 * p, offY - 3 * p, 8 * p, 2 * p);

      // Ciput putih
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(offX + 6 * p, offY + 4 * p, 8 * p, 1 * p);

      // Sisi samping
      ctx.fillStyle = hairColor;
      ctx.fillRect(offX + 3 * p, offY + 2 * p, 3 * p, 12 * p);
      ctx.fillRect(offX + 14 * p, offY + 2 * p, 3 * p, 12 * p);

      // Lipatan bayangan
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(offX + 5 * p, offY + 4 * p, 1 * p, 9 * p);
      ctx.fillRect(offX + 14 * p, offY + 4 * p, 1 * p, 9 * p);

      // Penutup dagu & leher
      ctx.fillStyle = hairColor;
      ctx.fillRect(offX + 5 * p, offY + 12 * p, 10 * p, 4 * p);
      ctx.fillRect(offX + 6 * p, offY + 15 * p, 8 * p, 3 * p);

      // Bros emas
      ctx.fillStyle = '#facc15';
      ctx.fillRect(offX + 9 * p, offY + 14 * p, 2 * p, 2 * p);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(offX + 9 * p, offY + 14 * p, 1 * p, 1 * p);
    } else {
      ctx.fillRect(offX + 4 * p, offY + 1 * p, 12 * p, 5 * p);
      ctx.fillRect(offX + 3 * p, offY + 3 * p, 2 * p, 5 * p);
      ctx.fillRect(offX + 15 * p, offY + 3 * p, 2 * p, 5 * p);

      if (hairKey === 'spiky') {
        ctx.fillRect(offX + 4 * p, offY - 2 * p, 3 * p, 3 * p);
        ctx.fillRect(offX + 8 * p, offY - 3 * p, 3 * p, 4 * p);
        ctx.fillRect(offX + 12 * p, offY - 2 * p, 3 * p, 3 * p);
      } else if (hairKey === 'parted') {
        ctx.fillRect(offX + 5 * p, offY + 4 * p, 4 * p, 2 * p);
        ctx.fillRect(offX + 10 * p, offY + 3 * p, 5 * p, 2 * p);
      } else if (hairKey === 'curly') {
        ctx.fillRect(offX + 2 * p, offY + 0 * p, 4 * p, 4 * p);
        ctx.fillRect(offX + 6 * p, offY - 1 * p, 4 * p, 4 * p);
        ctx.fillRect(offX + 10 * p, offY - 1 * p, 4 * p, 4 * p);
        ctx.fillRect(offX + 14 * p, offY + 0 * p, 4 * p, 4 * p);
      } else if (hairKey === 'ponytail') {
        ctx.fillRect(offX + 16 * p, offY + 1 * p, 4 * p, 5 * p);
        ctx.fillRect(offX + 17 * p, offY + 5 * p, 3 * p, 6 * p);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(offX + 16 * p, offY + 2 * p, 2 * p, 2 * p);
      } else if (hairKey === 'bob') {
        ctx.fillRect(offX + 3 * p, offY + 4 * p, 3 * p, 8 * p);
        ctx.fillRect(offX + 14 * p, offY + 4 * p, 3 * p, 8 * p);
      } else if (hairKey === 'headband') {
        ctx.fillRect(offX + 4 * p, offY - 2 * p, 3 * p, 3 * p);
        ctx.fillRect(offX + 8 * p, offY - 3 * p, 3 * p, 4 * p);
        ctx.fillRect(offX + 12 * p, offY - 2 * p, 3 * p, 3 * p);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(offX + 4 * p, offY + 3 * p, 12 * p, 2 * p);
        ctx.fillStyle = '#facc15';
        ctx.fillRect(offX + 9 * p, offY + 3 * p, 2 * p, 2 * p);
      } else if (hairKey === 'cap') {
        ctx.fillStyle = '#1e3a8a';
        ctx.fillRect(offX + 4 * p, offY - 1 * p, 12 * p, 5 * p);
        ctx.fillRect(offX + 9 * p, offY + 3 * p, 7 * p, 2 * p);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(offX + 7 * p, offY + 0 * p, 3 * p, 2 * p);
      }
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
