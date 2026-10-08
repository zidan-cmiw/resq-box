import type { CustomAvatarConfig } from '../../../store/teacherStore';
const portraitCacheL2 = new Map<string, HTMLCanvasElement>();

function getOrCreateCanvas(
  key: string,
  w: number,
  h: number,
  draw: (ctx: CanvasRenderingContext2D) => void
): HTMLCanvasElement {
  if (portraitCacheL2.has(key)) return portraitCacheL2.get(key)!;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  draw(ctx);
  portraitCacheL2.set(key, c);
  return c;
}

export function clearPortraitCacheL2(): void {
  portraitCacheL2.clear();
}

export type NpcWorldTypeL2 =
  | 'zidane'
  | 'zahra'
  | 'ican'
  | 'lintang'
  | 'bu_tyas'
  | 'rian'
  | 'bu_rahma'
  | 'dito'
  | 'pak_surya'
  | 'siti'
  | 'kak_fajar'
  | 'resqy'
  | 'dr_alisa'
  | 'pak_bambang'
  | 'komandan_satria'
  | 'pak_hendra'
  | 'pak_joko'
  | 'mbak_rina'
  | 'bu_dini'
  | 'pak_slamet'
  | 'zahra_medis'
  | 'lintang_medis';

// ══════════════════════════════════════════════════════════════════════════
// 1. MENGGAMBAR NPC DI CANVAS DUNIA GAME (IN-WORLD SPRITES)
// ══════════════════════════════════════════════════════════════════════════
export function drawNpcWorldL2(
  ctx: CanvasRenderingContext2D,
  type: NpcWorldTypeL2,
  px: number,
  py: number,
  dir: 'left' | 'right',
  animFrame: number,
  _isNearPlayer: boolean,
  animTick: number
): void {
  ctx.save();
  ctx.translate(Math.round(px), Math.round(py));
  ctx.scale(dir === 'left' ? -1 : 1, 1);

  const bob = animFrame % 2 === 1 ? -1 : 0;

  // ── A. BAYANGAN KAKI DI LANTAI ──
  ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 9, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  if (type === 'zidane') {
    // ── ZIDANE (KETUA & DEV UTAMA: KULIT PUTIH, RAMBUT BERANTAKAN, KACAMATA, BAJU HITAM, COOL) ──
    const drawX = -12;
    const drawY = -32 + bob;

    // 1. Sepatu Kets Sneakers Hitam-Putih
    ctx.fillStyle = '#09090b';
    ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
    ctx.fillRect(drawX + 13, drawY + 26, 5, 6);
    ctx.fillStyle = '#ffffff'; // Sol putih
    ctx.fillRect(drawX + 6, drawY + 30, 5, 2);
    ctx.fillRect(drawX + 13, drawY + 30, 5, 2);

    // 2. Celana Panjang Slim Charcoal
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(drawX + 6, drawY + 19, 12, 8);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(drawX + 11, drawY + 19, 2, 8);

    // 3. Badan: Jaket/Kaos Hitam Cool Minimalis
    ctx.fillStyle = '#09090b';
    ctx.fillRect(drawX + 6, drawY + 9, 12, 11);
    ctx.fillStyle = '#18181b';
    ctx.fillRect(drawX + 7, drawY + 10, 10, 9);
    ctx.fillStyle = '#334155';
    ctx.fillRect(drawX + 11, drawY + 9, 2, 10);

    // Lengan Hitam & Tangan Putih
    ctx.fillStyle = '#09090b';
    ctx.fillRect(drawX + 4, drawY + 10, 2, 8);
    ctx.fillRect(drawX + 18, drawY + 10, 2, 8);
    ctx.fillStyle = '#fef08a'; // Kulit putih
    ctx.fillRect(drawX + 4, drawY + 18, 2, 3);
    ctx.fillRect(drawX + 18, drawY + 18, 2, 3);

    // 4. Wajah & Kulit Putih
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(drawX + 6, drawY + 1, 12, 8);

    // 5. Kacamata Cool Persegi Hitam dengan Glint
    ctx.fillStyle = '#09090b';
    ctx.fillRect(drawX + 8, drawY + 3, 4, 3);
    ctx.fillRect(drawX + 13, drawY + 3, 4, 3);
    ctx.fillRect(drawX + 11, drawY + 4, 3, 1);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(drawX + 9, drawY + 4, 2, 1);
    ctx.fillRect(drawX + 14, drawY + 4, 2, 1);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(drawX + 9, drawY + 3, 1, 1);
    ctx.fillRect(drawX + 14, drawY + 3, 1, 1);

    // 6. Rambut Hitam Agak Berantakan (Messy Cool Hair)
    ctx.fillStyle = '#18181b';
    ctx.fillRect(drawX + 5, drawY - 4, 14, 5);
    ctx.fillRect(drawX + 4, drawY - 2, 3, 4);
    ctx.fillRect(drawX + 17, drawY - 2, 2, 4);
    ctx.fillRect(drawX + 7, drawY - 6, 4, 3);
    ctx.fillRect(drawX + 13, drawY - 5, 4, 2);
    ctx.fillRect(drawX + 9, drawY - 1, 5, 2);
  } else if (type === 'zahra') {
    // ── ZAHRA (UI/UX: CANTIK, IMUT, GEMESIN, KACAMATA, KERUDUNG BIRU, BAJU PINK, CERIA) ──
    const drawX = -12;
    const drawY = -32 + bob;

    // 1. Sepatu Imut Pink Tua
    ctx.fillStyle = '#be185d';
    ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
    ctx.fillRect(drawX + 13, drawY + 26, 5, 6);

    // 2. Rok / Celana Panjang Navy
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(drawX + 6, drawY + 19, 12, 8);
    ctx.fillStyle = '#172554';
    ctx.fillRect(drawX + 11, drawY + 19, 2, 8);

    // 3. Baju Pink Manis Ceria (Pink Blouse)
    ctx.fillStyle = '#ec4899';
    ctx.fillRect(drawX + 6, drawY + 10, 12, 10);
    ctx.fillStyle = '#f472b6';
    ctx.fillRect(drawX + 7, drawY + 11, 10, 8);

    // Lengan Pink & Tangan
    ctx.fillStyle = '#ec4899';
    ctx.fillRect(drawX + 4, drawY + 11, 2, 7);
    ctx.fillRect(drawX + 18, drawY + 11, 2, 7);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(drawX + 4, drawY + 18, 2, 3);
    ctx.fillRect(drawX + 18, drawY + 18, 2, 3);

    // 4. Kerudung Biru Cerah (Sky Blue Hijab)
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(drawX + 4, drawY - 3, 16, 14);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(drawX + 5, drawY - 2, 14, 6);
    ctx.fillRect(drawX + 7, drawY + 8, 10, 4);

    // 5. Wajah Imut & Cantik
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(drawX + 7, drawY + 1, 10, 7);

    // 6. Kacamata Bulat Imut Emas
    ctx.fillStyle = '#d97706';
    ctx.fillRect(drawX + 8, drawY + 2, 4, 3);
    ctx.fillRect(drawX + 13, drawY + 2, 4, 3);
    ctx.fillRect(drawX + 11, drawY + 3, 3, 1);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(drawX + 9, drawY + 3, 2, 2);
    ctx.fillRect(drawX + 14, drawY + 3, 2, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(drawX + 9, drawY + 3, 1, 1);
    ctx.fillRect(drawX + 14, drawY + 3, 1, 1);

    // Senyum Ceria Pink
    ctx.fillStyle = '#e11d48';
    ctx.fillRect(drawX + 11, drawY + 6, 3, 1);
  } else if (type === 'ican') {
    // ── ICAN (HARDWARE ENGINEER: RAMBUT IKAL, SIFAT AGAK NGESELIN / USIL, CASUAL SPORTY) ──
    const drawX = -12;
    const drawY = -32 + bob;

    // 1. Sepatu Sneakers Sporty
    ctx.fillStyle = '#334155';
    ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
    ctx.fillRect(drawX + 13, drawY + 26, 5, 6);

    // 2. Celana Jeans Denim
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(drawX + 6, drawY + 19, 12, 8);
    ctx.fillStyle = '#1e40af';
    ctx.fillRect(drawX + 11, drawY + 19, 2, 8);

    // 3. Kaos Sporty Oranye-Abu
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(drawX + 6, drawY + 10, 12, 10);
    ctx.fillStyle = '#fb923c';
    ctx.fillRect(drawX + 8, drawY + 11, 8, 8);

    // Lengan & Tangan Sawo Matang
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(drawX + 4, drawY + 11, 2, 7);
    ctx.fillRect(drawX + 18, drawY + 11, 2, 7);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(drawX + 4, drawY + 18, 2, 3);
    ctx.fillRect(drawX + 18, drawY + 18, 2, 3);

    // 4. Wajah & Ekspresi Smirk Usil
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(drawX + 6, drawY + 2, 12, 8);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(drawX + 8, drawY + 4, 3, 2);
    ctx.fillRect(drawX + 14, drawY + 4, 3, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(drawX + 9, drawY + 4, 1, 1);
    ctx.fillRect(drawX + 15, drawY + 4, 1, 1);
    ctx.fillStyle = '#7c2d12';
    ctx.fillRect(drawX + 11, drawY + 7, 4, 1);
    ctx.fillRect(drawX + 14, drawY + 6, 1, 1);

    // 5. Rambut Ikal Khas (Curly Voluminous Hair)
    ctx.fillStyle = '#18181b';
    ctx.fillRect(drawX + 5, drawY - 4, 14, 6);
    ctx.fillRect(drawX + 4, drawY - 6, 4, 4);
    ctx.fillRect(drawX + 9, drawY - 7, 5, 4);
    ctx.fillRect(drawX + 15, drawY - 6, 4, 4);
    ctx.fillStyle = '#27272a';
    ctx.fillRect(drawX + 5, drawY - 5, 2, 2);
    ctx.fillRect(drawX + 11, drawY - 6, 2, 2);
    ctx.fillRect(drawX + 16, drawY - 5, 2, 2);
  } else if (type === 'lintang') {
    // ── LINTANG (MATERI IPA: KERUDUNG HIJAU, PINTAR, ANALITIS, RUNTUT) ──
    const drawX = -12;
    const drawY = -32 + bob;

    // 1. Sepatu Formal Anggun
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
    ctx.fillRect(drawX + 13, drawY + 26, 5, 6);

    // 2. Rok / Celana Panjang Charcoal
    ctx.fillStyle = '#334155';
    ctx.fillRect(drawX + 6, drawY + 19, 12, 8);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(drawX + 11, drawY + 19, 2, 8);

    // 3. Tunik / Blus Elegan Toska Muda
    ctx.fillStyle = '#0d9488';
    ctx.fillRect(drawX + 6, drawY + 10, 12, 10);
    ctx.fillStyle = '#14b8a6';
    ctx.fillRect(drawX + 7, drawY + 11, 10, 8);

    // Lengan & Tangan Membawa Notes Peneliti
    ctx.fillStyle = '#0d9488';
    ctx.fillRect(drawX + 4, drawY + 11, 2, 7);
    ctx.fillRect(drawX + 18, drawY + 11, 2, 7);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(drawX + 4, drawY + 18, 2, 3);
    ctx.fillRect(drawX + 18, drawY + 18, 2, 3);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(drawX + 17, drawY + 16, 4, 5);
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(drawX + 17, drawY + 16, 1, 5);

    // 4. Kerudung Hijau Emerald (Green Hijab)
    ctx.fillStyle = '#15803d';
    ctx.fillRect(drawX + 4, drawY - 3, 16, 14);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(drawX + 5, drawY - 2, 14, 6);
    ctx.fillRect(drawX + 7, drawY + 8, 10, 4);

    // 5. Wajah Pintar & Ramah
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(drawX + 7, drawY + 1, 10, 7);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(drawX + 9, drawY + 3, 2, 2);
    ctx.fillRect(drawX + 14, drawY + 3, 2, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(drawX + 9, drawY + 3, 1, 1);
    ctx.fillRect(drawX + 14, drawY + 3, 1, 1);
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(drawX + 10, drawY + 6, 3, 1);
  } else if (type === 'zahra_medis') {
    // ── ZAHRA PETUGAS MEDIS PMI (KERUDUNG BIRU, KACAMATA BULAT EMAS, JAS/ROMPI MEDIS PUTIH, LAMBANG PALANG MERAH, TAS P3K) ──
    const drawX = -12;
    const drawY = -32 + bob;

    // 1. Sepatu Medis Putih Bersih
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
    ctx.fillRect(drawX + 13, drawY + 26, 5, 6);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(drawX + 6, drawY + 29, 5, 3);
    ctx.fillRect(drawX + 13, drawY + 29, 5, 3);

    // 2. Celana Panjang Medis Putih
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(drawX + 6, drawY + 19, 12, 8);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(drawX + 11, drawY + 19, 2, 8);

    // 3. Jas / Rompi Medis Palang Merah Putih Bersih
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(drawX + 6, drawY + 10, 12, 10);
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(drawX + 7, drawY + 11, 10, 8);

    // Lambang Palang Merah PMI di Dada
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(drawX + 10, drawY + 12, 4, 6);
    ctx.fillRect(drawX + 8, drawY + 13, 8, 4);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(drawX + 11, drawY + 14, 2, 2);

    // Lengan Jas Putih & Tangan
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(drawX + 4, drawY + 11, 2, 7);
    ctx.fillRect(drawX + 18, drawY + 11, 2, 7);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(drawX + 4, drawY + 18, 2, 3);
    ctx.fillRect(drawX + 18, drawY + 18, 2, 3);

    // Tas Medis P3K Merah di Tangan Kiri
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(drawX + 17, drawY + 17, 6, 6);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(drawX + 19, drawY + 18, 2, 4);
    ctx.fillRect(drawX + 18, drawY + 19, 4, 2);

    // 4. Kerudung Biru Cerah Khas Zahra (Sky Blue Hijab)
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(drawX + 4, drawY - 3, 16, 14);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(drawX + 5, drawY - 2, 14, 6);
    ctx.fillRect(drawX + 7, drawY + 8, 10, 4);

    // 5. Wajah Imut & Cantik
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(drawX + 7, drawY + 1, 10, 7);

    // 6. Kacamata Bulat Imut Emas
    ctx.fillStyle = '#d97706';
    ctx.fillRect(drawX + 8, drawY + 2, 4, 3);
    ctx.fillRect(drawX + 13, drawY + 2, 4, 3);
    ctx.fillRect(drawX + 11, drawY + 3, 3, 1);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(drawX + 9, drawY + 3, 2, 2);
    ctx.fillRect(drawX + 14, drawY + 3, 2, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(drawX + 9, drawY + 3, 1, 1);
    ctx.fillRect(drawX + 14, drawY + 3, 1, 1);

    // Senyum Ceria
    ctx.fillStyle = '#e11d48';
    ctx.fillRect(drawX + 11, drawY + 6, 3, 1);
  } else if (type === 'lintang_medis') {
    // ── LINTANG PETUGAS MEDIS & KOORDINATOR TRIAGE (KERUDUNG HIJAU, KACAMATA, JAS MEDIS PUTIH, LAMBANG PALANG MERAH, PAPAN KLIPBOARD) ──
    const drawX = -12;
    const drawY = -32 + bob;

    // 1. Sepatu Medis Putih
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
    ctx.fillRect(drawX + 13, drawY + 26, 5, 6);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(drawX + 6, drawY + 29, 5, 3);
    ctx.fillRect(drawX + 13, drawY + 29, 5, 3);

    // 2. Celana Panjang Medis Putih
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(drawX + 6, drawY + 19, 12, 8);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(drawX + 11, drawY + 19, 2, 8);

    // 3. Jas Medis Triage Putih Bersih
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(drawX + 6, drawY + 10, 12, 10);
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(drawX + 7, drawY + 11, 10, 8);

    // Lambang Palang Merah di Dada Kiri
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(drawX + 8, drawY + 13, 3, 5);
    ctx.fillRect(drawX + 7, drawY + 14, 5, 3);

    // Lengan Jas Putih & Tangan
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(drawX + 4, drawY + 11, 2, 7);
    ctx.fillRect(drawX + 18, drawY + 11, 2, 7);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(drawX + 4, drawY + 18, 2, 3);
    ctx.fillRect(drawX + 18, drawY + 18, 2, 3);

    // Papan Clipboard Medis Triage di Tangan Kiri
    ctx.fillStyle = '#78350f';
    ctx.fillRect(drawX + 16, drawY + 14, 6, 8);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(drawX + 17, drawY + 15, 4, 6);
    ctx.fillStyle = '#dc2626'; // Lembar Triage Merah-Kuning-Hijau
    ctx.fillRect(drawX + 18, drawY + 16, 2, 1);
    ctx.fillStyle = '#eab308';
    ctx.fillRect(drawX + 18, drawY + 18, 2, 1);
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(drawX + 18, drawY + 20, 2, 1);

    // 4. Kerudung Hijau Pintar Khas Lintang (Emerald Hijab)
    ctx.fillStyle = '#15803d';
    ctx.fillRect(drawX + 4, drawY - 3, 16, 14);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(drawX + 5, drawY - 2, 14, 6);
    ctx.fillRect(drawX + 7, drawY + 8, 10, 4);

    // 5. Wajah Cerdas & Analitis
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(drawX + 7, drawY + 1, 10, 7);

    // 6. Kacamata Persegi Hijau-Perak Pintar
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(drawX + 8, drawY + 3, 4, 3);
    ctx.fillRect(drawX + 13, drawY + 3, 4, 3);
    ctx.fillRect(drawX + 11, drawY + 4, 3, 1);
    ctx.fillStyle = '#86efac';
    ctx.fillRect(drawX + 9, drawY + 4, 2, 1);
    ctx.fillRect(drawX + 14, drawY + 4, 2, 1);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(drawX + 9, drawY + 3, 1, 1);
    ctx.fillRect(drawX + 14, drawY + 3, 1, 1);

    // Senyum Percaya Diri
    ctx.fillStyle = '#059669';
    ctx.fillRect(drawX + 11, drawY + 6, 3, 1);
  } else if (type === 'bu_tyas') {
    // ── BU TYAS (DOSEN PEMBIMBING: KACAMATA, KERUDUNG HITAM, AKADEMISI, BIJAKSANA & EVALUATOR) ──
    const drawX = -12;
    const drawY = -32 + bob;

    // 1. Sepatu Pantofel Formal Hitam
    ctx.fillStyle = '#09090b';
    ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
    ctx.fillRect(drawX + 13, drawY + 26, 5, 6);

    // 2. Rok Panjang Formal Hitam / Maroon
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(drawX + 6, drawY + 18, 12, 9);

    // 3. Blazer Formal Dosen Maroon / Navy Berwibawa
    ctx.fillStyle = '#881337';
    ctx.fillRect(drawX + 6, drawY + 9, 12, 11);
    ctx.fillStyle = '#9f1239';
    ctx.fillRect(drawX + 7, drawY + 10, 10, 9);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(drawX + 11, drawY + 9, 2, 5);
    ctx.fillStyle = '#facc15'; // Pin Dosen Emas
    ctx.fillRect(drawX + 8, drawY + 11, 2, 2);

    // Lengan Blazer & Map Berkas Evaluasi
    ctx.fillStyle = '#881337';
    ctx.fillRect(drawX + 4, drawY + 10, 2, 8);
    ctx.fillRect(drawX + 18, drawY + 10, 2, 8);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(drawX + 4, drawY + 18, 2, 3);
    ctx.fillRect(drawX + 18, drawY + 18, 2, 3);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(drawX + 16, drawY + 15, 5, 6);
    ctx.fillStyle = '#fde68a';
    ctx.fillRect(drawX + 17, drawY + 16, 3, 4);

    // 4. Kerudung Hitam Anggun Berwibawa (Black Hijab)
    ctx.fillStyle = '#09090b';
    ctx.fillRect(drawX + 4, drawY - 3, 16, 14);
    ctx.fillStyle = '#18181b';
    ctx.fillRect(drawX + 5, drawY - 2, 14, 6);
    ctx.fillRect(drawX + 7, drawY + 8, 10, 4);

    // 5. Wajah Bijaksana & Berwibawa
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(drawX + 7, drawY + 1, 10, 7);

    // 6. Kacamata Dosen Elegan Bingkai Emas
    ctx.fillStyle = '#d97706';
    ctx.fillRect(drawX + 8, drawY + 2, 4, 3);
    ctx.fillRect(drawX + 13, drawY + 2, 4, 3);
    ctx.fillRect(drawX + 11, drawY + 3, 3, 1);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(drawX + 9, drawY + 3, 2, 2);
    ctx.fillRect(drawX + 14, drawY + 3, 2, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(drawX + 9, drawY + 3, 1, 1);
    ctx.fillRect(drawX + 14, drawY + 3, 1, 1);

    ctx.fillStyle = '#991b1b';
    ctx.fillRect(drawX + 10, drawY + 6, 3, 1);
  } else if (type === 'bu_rahma') {

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-6, -4, 5, 4);
    ctx.fillRect(1, -4, 5, 4);


    ctx.fillStyle = '#78350f';
    ctx.fillRect(-7, -16, 14, 12);
    ctx.fillStyle = '#92400e';
    ctx.fillRect(-6, -16, 12, 2);


    ctx.fillStyle = '#d97706';
    ctx.fillRect(-7, -26 + bob, 14, 11);
    ctx.fillStyle = '#fde68a';
    ctx.fillRect(-2, -26 + bob, 4, 6);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-1, -22 + bob, 2, 2);
    ctx.fillRect(-1, -18 + bob, 2, 2);

    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(3, -24 + bob, 3, 3);

    // Lengan Blazer Khaki & Tangan
    ctx.fillStyle = '#d97706';
    ctx.fillRect(-9, -25 + bob, 3, 7);
    ctx.fillRect(6, -25 + bob, 3, 7);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-9, -18 + bob, 3, 3);
    ctx.fillRect(6, -18 + bob, 3, 3);
    // Buku Agenda Guru di Tangan Kiri
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(5, -20 + bob, 5, 7);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(6, -19 + bob, 3, 5);

    // Wajah & Leher
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-4, -30 + bob, 8, 5);
    ctx.fillStyle = '#fba874';
    ctx.fillRect(-4, -26 + bob, 8, 1);

    // Kacamata Elegan
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-3, -29 + bob, 3, 2);
    ctx.fillRect(1, -29 + bob, 3, 2);
    ctx.fillRect(0, -29 + bob, 1, 1); // Bridge

    // Rambut Tersanggul Rapi Cokelat Gelap
    ctx.fillStyle = '#451a03';
    ctx.fillRect(-6, -34 + bob, 12, 5);
    ctx.fillRect(-6, -34 + bob, 2, 6);
    ctx.fillRect(4, -34 + bob, 2, 6);
    ctx.fillRect(-3, -37 + bob, 6, 4); // Sanggul atas
  } else if (type === 'pak_surya') {
    // ── INSTRUKTUR TANGGAP BENCANA PAK SURYA (ROMPI ORANYE LAPANGAN & TOPI) ──
    // Sepatu Boots Lapangan Hitam
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-6, -5, 5, 5);
    ctx.fillRect(1, -5, 5, 5);

    // Celana Kargo Lapangan Biru Navy
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-6, -16, 5, 11);
    ctx.fillRect(1, -16, 5, 11);

    // Rompi Keselamatan Oranye High-Vis & Garis Reflektor
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(-8, -27 + bob, 16, 12);
    ctx.fillStyle = '#facc15'; // Strip reflektor kuning
    ctx.fillRect(-8, -22 + bob, 16, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-6, -22 + bob, 12, 1);
    ctx.fillStyle = '#0f172a'; // Ritsleting tengah
    ctx.fillRect(-1, -27 + bob, 2, 12);

    // Lengan Kaos Hitam & Tangan
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-10, -26 + bob, 3, 7);
    ctx.fillRect(7, -26 + bob, 3, 7);
    ctx.fillStyle = '#f5af7e';
    ctx.fillRect(-10, -19 + bob, 3, 4);
    ctx.fillRect(7, -19 + bob, 3, 4);
    // Papan Jalan (Clipboard) di Tangan
    ctx.fillStyle = '#78350f';
    ctx.fillRect(6, -20 + bob, 5, 7);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(7, -19 + bob, 3, 5);

    // Wajah & Leher
    ctx.fillStyle = '#f5af7e';
    ctx.fillRect(-4, -31 + bob, 8, 5);
    // Mata Tegas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(1, -30 + bob, 2, 2);

    // Topi Lapangan BNPB Oranye
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(-6, -34 + bob, 12, 4);
    ctx.fillRect(1, -32 + bob, 7, 2); // Visor topi ke depan
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-2, -34 + bob, 4, 2); // Emblem topi
  } else if (type === 'komandan_satria') {
    // ── KOMANDAN TIM REAKSI CEPAT BPBD/SAR SATRIA ──
    // Sepatu Boots Lapangan Hitam
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-6, -5, 5, 5);
    ctx.fillRect(1, -5, 5, 5);

    // Celana Kargo Lapangan Hitam
    ctx.fillStyle = '#18181b';
    ctx.fillRect(-6, -16, 5, 11);
    ctx.fillRect(1, -16, 5, 11);

    // Rompi Lapangan BPBD Oranye Terang & Scotlight Perak
    ctx.fillStyle = '#f97316';
    ctx.fillRect(-8, -27 + bob, 16, 12);
    ctx.fillStyle = '#f1f5f9'; // Scotlight perak
    ctx.fillRect(-8, -22 + bob, 16, 2);
    ctx.fillStyle = '#0284c7'; // Segitiga BPBD
    ctx.fillRect(-2, -26 + bob, 4, 3);
    ctx.fillStyle = '#0f172a'; // Ritsleting tengah
    ctx.fillRect(-1, -27 + bob, 2, 12);

    // Lengan Baju Lapangan Hitam & Tangan
    ctx.fillStyle = '#18181b';
    ctx.fillRect(-10, -26 + bob, 3, 7);
    ctx.fillRect(7, -26 + bob, 3, 7);
    ctx.fillStyle = '#f5af7e';
    ctx.fillRect(-10, -19 + bob, 3, 4);
    ctx.fillRect(7, -19 + bob, 3, 4);

    // Wajah & Leher
    ctx.fillStyle = '#f5af7e';
    ctx.fillRect(-4, -31 + bob, 8, 5);
    // Mata Tegas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(1, -30 + bob, 2, 2);

    // Topi Lapangan Komando SAR Oranye
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(-6, -34 + bob, 12, 4);
    ctx.fillRect(1, -32 + bob, 7, 2);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-2, -34 + bob, 4, 2);
  } else if (type === 'dr_alisa') {
    // ── DOKTER RELAWAN MEDIS PMI DR. ALISA ──
    // Sepatu Medis Putih
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(-6, -5, 5, 5);
    ctx.fillRect(1, -5, 5, 5);

    // Celana Panjang Medis Putih
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-6, -16, 5, 11);
    ctx.fillRect(1, -16, 5, 11);

    // Jas/Rompi Medis Palang Merah
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-7, -27 + bob, 14, 12);
    ctx.fillStyle = '#ef4444'; // Lambang Palang Merah
    ctx.fillRect(-1, -24 + bob, 2, 6);
    ctx.fillRect(-3, -22 + bob, 6, 2);

    // Lengan Baju Putih & Tangan
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-9, -26 + bob, 3, 7);
    ctx.fillRect(6, -26 + bob, 3, 7);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-9, -19 + bob, 3, 4);
    ctx.fillRect(6, -19 + bob, 3, 4);
    // Tas Medis P3K Merah di Tangan
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(6, -20 + bob, 6, 6);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(8, -19 + bob, 2, 4);
    ctx.fillRect(7, -18 + bob, 4, 2);

    // Wajah & Leher
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-4, -31 + bob, 8, 5);
    // Mata Ramah
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(1, -30 + bob, 2, 2);

    // Jilbab / Penutup Kepala Medis Putih
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(-6, -35 + bob, 12, 6);
    ctx.fillRect(-6, -35 + bob, 2, 10);
    ctx.fillRect(4, -35 + bob, 2, 10);
  } else if (type === 'pak_bambang') {
    // ── KEPALA SEKOLAH PAK BAMBANG (KEMEJA BATIK COKELAT & PAPAN PRESENSI) ──
    // Sepatu Pantofel Hitam
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-6, -5, 5, 5);
    ctx.fillRect(1, -5, 5, 5);

    // Celana Panjang Dinas Cokelat Tua
    ctx.fillStyle = '#451a03';
    ctx.fillRect(-6, -16, 5, 11);
    ctx.fillRect(1, -16, 5, 11);

    // Kemeja Batik Dinas Cokelat Emas
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-7, -27 + bob, 14, 12);
    ctx.fillStyle = '#d97706'; // Aksen corak batik
    ctx.fillRect(-5, -25 + bob, 2, 2);
    ctx.fillRect(3, -25 + bob, 2, 2);
    ctx.fillRect(-1, -22 + bob, 2, 2);
    ctx.fillRect(-5, -19 + bob, 2, 2);
    ctx.fillRect(3, -19 + bob, 2, 2);

    // Tangan & Papan Presensi Kayu
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-9, -23 + bob, 3, 6);
    ctx.fillRect(6, -23 + bob, 3, 6);
    // Papan Clipboard Kayu & Kertas Presensi
    ctx.fillStyle = '#b45309';
    ctx.fillRect(6, -22 + bob, 6, 8);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(7, -21 + bob, 4, 6);

    // Wajah & Leher
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-4, -31 + bob, 8, 5);
    // Kacamata Berwibawa
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, -30 + bob, 4, 2);
    ctx.strokeStyle = '#f59e0b';
    ctx.strokeRect(0, -30 + bob, 4, 2);

    // Rambut Rapian Abu-abu Beruban
    ctx.fillStyle = '#475569';
    ctx.fillRect(-5, -34 + bob, 10, 4);
    ctx.fillRect(-6, -32 + bob, 2, 5);
  } else if (type === 'pak_hendra') {
    // ── PETUGAS SARPRAS & KEAMANAN PAK HENDRA ──
    // Sepatu Kerja Hitam
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-6, -5, 5, 5);
    ctx.fillRect(1, -5, 5, 5);

    // Celana Seragam Biru Tua Satpam
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(-6, -16, 5, 11);
    ctx.fillRect(1, -16, 5, 11);

    // Kemeja Seragam Biru Tua
    ctx.fillStyle = '#1e40af';
    ctx.fillRect(-7, -27 + bob, 14, 12);
    ctx.fillStyle = '#facc15'; // Lencana dada
    ctx.fillRect(2, -25 + bob, 2, 2);

    // Sabuk & HT (Walkie-Talkie)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-7, -17 + bob, 14, 2);
    ctx.fillStyle = '#334155'; // Body HT
    ctx.fillRect(-9, -19 + bob, 3, 5);
    ctx.fillStyle = '#0f172a'; // Antena HT
    ctx.fillRect(-8, -22 + bob, 1, 3);

    // Tangan & Wajah
    ctx.fillStyle = '#f5af7e';
    ctx.fillRect(-4, -31 + bob, 8, 5);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(1, -30 + bob, 2, 2);

    // Topi Pet Satpam Biru Tua
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(-6, -34 + bob, 12, 4);
    ctx.fillRect(1, -32 + bob, 6, 2); // Pet topi
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-1, -34 + bob, 3, 2); // Lencana topi
  } else if (type === 'resqy') {
    // ── ROBOT KOMPANION ORANYE RESQY (MELAYANG DI UDARA DENGAN AYUNAN HOVER) ──
    const hoverY = -24 + Math.sin(animTick * 0.08) * 3;

    // Antena Radar Kuning
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-1, hoverY - 7, 2, 3);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-2, hoverY - 9, 4, 2);

    // Bodi Robot Oranye Penyelamat
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(-7, hoverY - 4, 14, 12);
    ctx.fillStyle = '#f97316';
    ctx.fillRect(-6, hoverY - 3, 12, 10);
    // Garis Kuning Reflektif
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-6, hoverY + 3, 12, 2);

    // Layar Kaca Hitam CRT Glossy
    ctx.fillStyle = '#020617';
    ctx.fillRect(-4, hoverY - 2, 8, 5);
    // Mata Piksel Cyan Ceria
    ctx.fillStyle = '#67e8f9';
    ctx.fillRect(-3, hoverY - 1, 2, 2);
    ctx.fillRect(1, hoverY - 1, 2, 2);

    // Semburan Pendorong Bawah Biru (Hover Jets)
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-3, hoverY + 8, 6, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-2, hoverY + 9, 4, 1);
  } else if (type === 'pak_joko') {
    // ── KEPALA DUSUN DESTANA PAK JOKO (ROMPI HIJAU LUMUT & PECI/BLANGKON) ──
    // Sepatu pantofel cokelat gelap
    ctx.fillStyle = '#451a03';
    ctx.fillRect(-6, -5, 5, 5);
    ctx.fillRect(1, -5, 5, 5);

    // Celana Panjang Kargo Khaki/Krem
    ctx.fillStyle = '#b45309';
    ctx.fillRect(-6, -16, 5, 11);
    ctx.fillRect(1, -16, 5, 11);

    // Kemeja Putih & Rompi Hijau Destana
    ctx.fillStyle = '#15803d'; // Rompi hijau desa tangguh
    ctx.fillRect(-8, -27 + bob, 16, 12);
    ctx.fillStyle = '#ffffff'; // Kerah kemeja dalam putih
    ctx.fillRect(-2, -27 + bob, 4, 4);
    ctx.fillStyle = '#facc15'; // Bordir badge DESTANA
    ctx.fillRect(2, -24 + bob, 4, 3);
    ctx.fillStyle = '#052e16'; // Ritsleting tengah rompi
    ctx.fillRect(-1, -27 + bob, 2, 12);

    // Lengan Rompi Hijau & Tangan
    ctx.fillStyle = '#15803d';
    ctx.fillRect(-10, -26 + bob, 3, 7);
    ctx.fillRect(7, -26 + bob, 3, 7);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-10, -19 + bob, 3, 4);
    ctx.fillRect(7, -19 + bob, 3, 4);
    // Peta Zonasi KRB Merapi di Tangan
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(6, -20 + bob, 5, 7);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(7, -19 + bob, 3, 2);

    // Wajah & Leher Berwibawa
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-4, -31 + bob, 8, 5);
    // Mata & Senyum Ramah
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(1, -30 + bob, 2, 2);
    ctx.fillRect(-3, -30 + bob, 2, 2);
    // Kumis Tipis
    ctx.fillStyle = '#451a03';
    ctx.fillRect(-2, -28 + bob, 5, 1);

    // Peci / Blangkon Hitam Motif Emas
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(-6, -35 + bob, 12, 5);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-5, -32 + bob, 10, 1);
  } else if (type === 'mbak_rina') {
    // ── WARGA SIAGA MERAPI MBAK RINA (JAKET OUTDOOR MERAH & TAS SIAGA) ──
    // Sepatu Kets Lapangan Abu-abu
    ctx.fillStyle = '#334155';
    ctx.fillRect(-6, -5, 5, 5);
    ctx.fillRect(1, -5, 5, 5);

    // Celana Jeans Biru Tua
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(-6, -16, 5, 11);
    ctx.fillRect(1, -16, 5, 11);

    // Jaket Outdoor Siaga Merah Bata & Strip Abu Reflektor
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-8, -27 + bob, 16, 12);
    ctx.fillStyle = '#e2e8f0'; // Strip reflektor
    ctx.fillRect(-8, -22 + bob, 16, 2);
    // Masker Putih Tergantung di Leher (Siap Pakai)
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-3, -26 + bob, 6, 3);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(-4, -26 + bob, 1, 3);
    ctx.fillRect(3, -26 + bob, 1, 3);

    // Lengan Jaket Merah & Tangan
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-10, -26 + bob, 3, 7);
    ctx.fillRect(7, -26 + bob, 3, 7);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-10, -19 + bob, 3, 4);
    ctx.fillRect(7, -19 + bob, 3, 4);

    // Tas Ransel Siaga Oranye di Punggung Samping
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(-11, -26 + bob, 3, 10);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-11, -22 + bob, 3, 2);

    // Wajah & Leher Ceria
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-4, -31 + bob, 8, 5);
    // Mata Ramah
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(1, -30 + bob, 2, 2);
    ctx.fillRect(-3, -30 + bob, 2, 2);

    // Rambut Kuncir Kuda Cokelat dengan Bandana Biru
    ctx.fillStyle = '#451a03';
    ctx.fillRect(-5, -35 + bob, 10, 5);
    ctx.fillStyle = '#0284c7'; // Bandana biru
    ctx.fillRect(-6, -33 + bob, 12, 2);
    // Kuncir Rambut di Belakang
    ctx.fillStyle = '#451a03';
    ctx.fillRect(-7, -32 + bob, 3, 5);
  } else if (type === 'bu_dini') {
    // ── KOORDINATOR SHELTER BPBD BU DINI (ROMPI ORANYE BPBD, ID CARD & CLIPBOARD) ──
    // Sepatu pantofel hitam
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-6, -5, 5, 5);
    ctx.fillRect(1, -5, 5, 5);

    // Celana panjang dinas biru navy
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-6, -16, 5, 11);
    ctx.fillRect(1, -16, 5, 11);

    // Rompi Oranye BPBD & Scotlight Perak
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(-8, -27 + bob, 16, 12);
    ctx.fillStyle = '#f1f5f9'; // Scotlight perak
    ctx.fillRect(-8, -22 + bob, 16, 2);
    // Lanyard ID Card Koordinator
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-1, -26 + bob, 2, 4);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-2, -22 + bob, 4, 3);

    // Lengan Rompi Oranye & Tangan
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(-10, -26 + bob, 3, 7);
    ctx.fillRect(7, -26 + bob, 3, 7);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-10, -19 + bob, 3, 4);
    ctx.fillRect(7, -19 + bob, 3, 4);
    // Papan Clipboard Pendataan Barak
    ctx.fillStyle = '#b45309';
    ctx.fillRect(6, -21 + bob, 6, 7);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(7, -20 + bob, 4, 5);

    // Wajah & Leher Ramah
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-4, -31 + bob, 8, 5);
    // Mata Ramah
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(1, -30 + bob, 2, 2);
    ctx.fillRect(-3, -30 + bob, 2, 2);

    // Jilbab Rapi Oranye-Krem Khas BPBD
    ctx.fillStyle = '#fdba74';
    ctx.fillRect(-6, -35 + bob, 12, 6);
    ctx.fillRect(-6, -35 + bob, 2, 10);
    ctx.fillRect(4, -35 + bob, 2, 10);
  } else if (type === 'pak_slamet') {
    // ── RELAWAN TAGANA PAK SLAMET (ROMPI BIRU TAGANA, STRIP MERAH-PUTIH & HT) ──
    // Sepatu kargo lapangan cokelat
    ctx.fillStyle = '#451a03';
    ctx.fillRect(-6, -5, 5, 5);
    ctx.fillRect(1, -5, 5, 5);

    // Celana kargo lapangan biru navy
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(-6, -16, 5, 11);
    ctx.fillRect(1, -16, 5, 11);

    // Rompi Tagana Biru Tua
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(-8, -27 + bob, 16, 12);
    // Strip Merah-Putih Tagana di dada
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-8, -24 + bob, 16, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-8, -22 + bob, 16, 1);

    // Lengan Rompi Biru & Tangan
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(-10, -26 + bob, 3, 7);
    ctx.fillRect(7, -26 + bob, 3, 7);
    ctx.fillStyle = '#f5af7e';
    ctx.fillRect(-10, -19 + bob, 3, 4);
    ctx.fillRect(7, -19 + bob, 3, 4);
    // Radio HT Komunikasi Tagana di Tangan
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(7, -22 + bob, 3, 6);
    ctx.fillRect(8, -25 + bob, 1, 3); // Antena HT

    // Wajah & Leher Tangguh
    ctx.fillStyle = '#f5af7e';
    ctx.fillRect(-4, -31 + bob, 8, 5);
    // Mata & Kumis Tipis
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(1, -30 + bob, 2, 2);
    ctx.fillRect(-3, -30 + bob, 2, 2);
    ctx.fillRect(-2, -28 + bob, 5, 1);

    // Topi Rimba Relawan Tagana
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-7, -33 + bob, 14, 2);
    ctx.fillRect(-5, -36 + bob, 10, 4);
  } else {
    // ── SISWA/SISWI SMP KELAS 8 (RIAN, DITO, SITI, KAK FAJAR) ──
    // Sepatu Sekolah Hitam & Sol Putih
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-5, -4, 4, 4);
    ctx.fillRect(1, -4, 4, 4);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-5, -1, 4, 1);
    ctx.fillRect(1, -1, 4, 1);

    // Celana / Rok Biru Tua SMP
    ctx.fillStyle = '#1e3a8a';
    if (type === 'siti') {
      // Rok Rempel Biru SMP
      ctx.fillRect(-6, -14, 12, 10);
      ctx.fillStyle = '#172554';
      ctx.fillRect(-3, -14, 2, 10);
      ctx.fillRect(2, -14, 2, 10);
      // Kaus Kaki Putih
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(-5, -7, 4, 3);
      ctx.fillRect(1, -7, 4, 3);
    } else {
      // Celana Panjang Biru Tua SMP
      ctx.fillRect(-5, -14, 4, 10);
      ctx.fillRect(1, -14, 4, 10);
    }

    // Sabuk Hitam dengan Gesper Perak
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-5, -16, 10, 2);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(-1, -16, 2, 2);

    // Kemeja Seragam Putih SMP
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-6, -26 + bob, 12, 10);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(-6, -26 + bob, 1, 10);
    ctx.fillRect(5, -26 + bob, 1, 10);

    // Dasi Biru Tua SMP
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(-1, -25 + bob, 2, 6);
    ctx.fillRect(-2, -26 + bob, 4, 2); // Simpul dasi

    // Badge OSIS di Saku Dada Kiri
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(2, -23 + bob, 2, 3);

    // Atribut Khusus Per Karakter Siswa
    if (type === 'dito') {
      // Ban Lengan Merah-Putih PMR di Lengan Kanan
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(-8, -23 + bob, 3, 3);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-8, -21 + bob, 3, 1);
    } else if (type === 'siti') {
      // Pin Ketua OSIS Emas di Kerah
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-4, -25 + bob, 2, 2);
    } else if (type === 'kak_fajar') {
      // Rompi Relawan Hijau Muda di Luar Kemeja Putih
      ctx.fillStyle = '#10b981';
      ctx.fillRect(-7, -26 + bob, 3, 10);
      ctx.fillRect(4, -26 + bob, 3, 10);
    }

    // Lengan Kemeja Pendek Putih & Tangan
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-8, -25 + bob, 2, 5);
    ctx.fillRect(6, -25 + bob, 2, 5);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-8, -20 + bob, 2, 3);
    ctx.fillRect(6, -20 + bob, 2, 3);

    // Wajah & Leher
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-4, -30 + bob, 8, 5);
    // Mata Siswa
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(1, -29 + bob, 2, 2);

    // Rambut Siswa/Siswi
    if (type === 'siti') {
      // Rambut Siswi Berikat Kuncir Belakang
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(-5, -34 + bob, 10, 5);
      ctx.fillRect(-6, -32 + bob, 2, 5);
      ctx.fillRect(4, -32 + bob, 2, 5);
      // Kuncir Ekor Kuda di Belakang
      ctx.fillRect(-8, -31 + bob, 3, 4);
      ctx.fillStyle = '#c084fc'; // Ikat rambut ungu
      ctx.fillRect(-7, -33 + bob, 2, 2);
    } else if (type === 'kak_fajar') {
      // Rambut Siswa Senior Sedikit Belah Samping Rapi
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-5, -34 + bob, 10, 5);
      ctx.fillRect(-5, -35 + bob, 8, 2);
    } else if (type === 'dito') {
      // Rambut Siswa Pendek Atletis
      ctx.fillStyle = '#312e81';
      ctx.fillRect(-5, -34 + bob, 10, 5);
      ctx.fillRect(-3, -35 + bob, 6, 2);
    } else {
      // Rian: Rambut Ceria Sedikit Berombak
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(-5, -34 + bob, 10, 5);
      ctx.fillRect(-4, -35 + bob, 7, 2);
    }
  }

  ctx.restore();
}

// ══════════════════════════════════════════════════════════════════════════
// 1.5. MASKOT RESQY BURUNG HANTU 2D PIXEL ART (WORLD COMPANION LEVEL 2)
// ══════════════════════════════════════════════════════════════════════════
export function drawMascotWorldL2(
  ctx: CanvasRenderingContext2D,
  playerX: number,
  playerY: number,
  playerDir: 'left' | 'right',
  frame: number,
): void {
  // Posisi Resqy melayang anggun di belakang atas pundak siswa pemain
  const hoverOffset = playerDir === 'right' ? -26 : 26;
  const hoverX = Math.round(playerX + hoverOffset);
  const hoverY = Math.round(playerY - 44 + Math.sin(frame * 0.08) * 3);

  ctx.save();
  ctx.translate(hoverX, hoverY);
  if (playerDir === 'left') ctx.scale(-1, 1);

  // Animasi kepakan sayap burung hantu (flapping wings)
  const wingFlap = Math.sin(frame * 0.18) * 3;

  // 1. Partikel Kilau Ajaib Pemandu di sekitar Resqy
  const sparklePhase = (frame % 40) / 40;
  if (sparklePhase < 0.5) {
    ctx.fillStyle = '#fde047';
    ctx.fillRect(8, -6, 2, 2);
    ctx.fillStyle = '#67e8f9';
    ctx.fillRect(-10, 4, 1, 1);
  } else {
    ctx.fillStyle = '#67e8f9';
    ctx.fillRect(10, 2, 1, 1);
    ctx.fillStyle = '#fde047';
    ctx.fillRect(-8, -4, 2, 2);
  }

  // 2. Bayangan Bulu Luar / Outline Cokelat Tua
  ctx.fillStyle = '#451a03';
  ctx.fillRect(-9, -8, 18, 18);
  ctx.fillRect(-8, -9, 16, 20);

  // 3. Telinga Bulu Burung Hantu (Ear Tufts) di kiri & kanan kepala
  ctx.fillStyle = '#78350f';
  ctx.fillRect(-7, -12, 3, 4);
  ctx.fillRect(4, -12, 3, 4);
  ctx.fillStyle = '#b45309';
  ctx.fillRect(-6, -11, 2, 3);
  ctx.fillRect(4, -11, 2, 3);

  // 4. Badan Utama Berbulu Cokelat Keemasan (Tawny Owl Body)
  ctx.fillStyle = '#b45309';
  ctx.fillRect(-8, -7, 16, 16);
  ctx.fillStyle = '#d97706';
  ctx.fillRect(-7, -6, 14, 14);

  // 5. Dada Bulu Lembut Krem / Beige (Chest Feather Patch)
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(-4, 0, 8, 8);
  ctx.fillStyle = '#fde68a';
  ctx.fillRect(-3, 1, 6, 6);
  // Motif bulu dada burung hantu kecil (V-chevron feather markings)
  ctx.fillStyle = '#b45309';
  ctx.fillRect(-2, 3, 1, 1);
  ctx.fillRect(1, 3, 1, 1);
  ctx.fillRect(-1, 5, 2, 1);

  // 6. Sayap Kiri & Kanan Beranimasi Mengepak Lembut
  ctx.fillStyle = '#78350f';
  ctx.fillRect(-11, -2 + wingFlap, 4, 8);
  ctx.fillRect(7, -2 - wingFlap, 4, 8);
  ctx.fillStyle = '#92400e';
  ctx.fillRect(-10, -1 + wingFlap, 3, 6);
  ctx.fillRect(7, -1 - wingFlap, 3, 6);

  // 7. Mata Bulat Burung Hantu yang Bijak & Lebar (Wise Owl Eyes)
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-6, -5, 5, 5);
  ctx.fillRect(1, -5, 5, 5);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(-5, -4, 4, 4);
  ctx.fillRect(1, -4, 4, 4);
  // Kacamata Bulat Peneliti Emas (Smart Scholar Spectacles)
  ctx.fillStyle = '#d97706';
  ctx.fillRect(-6, -6, 6, 1);
  ctx.fillRect(0, -6, 6, 1);
  ctx.fillRect(-1, -4, 2, 1);
  // Pupil mata & Kedip
  const isBlink = frame % 120 > 112;
  if (!isBlink) {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-4, -3, 2, 3);
    ctx.fillRect(2, -3, 2, 3);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-4, -4, 1, 1);
    ctx.fillRect(2, -4, 1, 1);
  } else {
    ctx.fillStyle = '#451a03';
    ctx.fillRect(-5, -3, 4, 1);
    ctx.fillRect(1, -3, 4, 1);
  }

  // 8. Paruh Segitiga Oranye Kecil (Beak)
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(-1, -1, 2, 2);
  ctx.fillStyle = '#f97316';
  ctx.fillRect(0, 0, 1, 1);

  // 9. Cakar Burung Hantu Kecil di Bawah (Tiny Yellow Talons)
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(-4, 9, 3, 2);
  ctx.fillRect(1, 9, 3, 2);

  ctx.restore();
}

// ══════════════════════════════════════════════════════════════════════════
// INDIKATOR KACA PEMBESAR MATERI EDUKASI LEVEL 2 (FLOATING DISCOVERY BADGE — PERSIS LEVEL 1)
// ══════════════════════════════════════════════════════════════════════════
export function drawNpcMaterialBadgeL2(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  animTick: number,
  isDiscovered: boolean = false,
): void {
  const bob = Math.sin(animTick * 0.08) * 3;
  const bx = Math.round(x);
  const by = Math.round(y - 8 + bob);

  ctx.save();
  const pillW = 68;
  const pillH = 17;
  const px = bx - pillW / 2;
  const py = by - pillH / 2;

  // Background and border
  if (isDiscovered) {
    ctx.fillStyle = 'rgba(6, 78, 59, 0.92)';
    ctx.fillRect(px, py, pillW, pillH);
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(px, py, pillW, pillH);
  } else {
    const pulseAlpha = 0.85 + Math.sin(animTick * 0.12) * 0.15;
    ctx.fillStyle = `rgba(69, 26, 3, ${pulseAlpha})`;
    ctx.fillRect(px, py, pillW, pillH);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(px, py, pillW, pillH);
  }

  // Pointer segitiga ke arah kepala NPC
  ctx.fillStyle = isDiscovered ? '#34d399' : '#f59e0b';
  ctx.beginPath();
  ctx.moveTo(bx - 4, py + pillH);
  ctx.lineTo(bx + 4, py + pillH);
  ctx.lineTo(bx, py + pillH + 4);
  ctx.closePath();
  ctx.fill();

  // ── 2D PIXEL ART KACA PEMBESAR (MAGNIFYING GLASS) ──
  const mx = px + 4;
  const my = py + 3;

  // Gagang kaca pembesar (handle cokelat/emas diagonal)
  ctx.fillStyle = isDiscovered ? '#10b981' : '#d97706';
  ctx.fillRect(mx + 7, my + 7, 2, 2);
  ctx.fillRect(mx + 8, my + 8, 2, 2);
  ctx.fillStyle = isDiscovered ? '#065f46' : '#78350f';
  ctx.fillRect(mx + 9, my + 9, 2, 2);

  // Bingkai lingkaran lensa (lens rim)
  ctx.fillStyle = isDiscovered ? '#34d399' : '#fbbf24';
  ctx.fillRect(mx + 2, my + 0, 5, 1);
  ctx.fillRect(mx + 1, my + 1, 1, 5);
  ctx.fillRect(mx + 7, my + 1, 1, 5);
  ctx.fillRect(mx + 2, my + 6, 5, 1);

  // Kaca lensa cyan transparan
  ctx.fillStyle = isDiscovered ? '#a7f3d0' : '#38bdf8';
  ctx.fillRect(mx + 2, my + 1, 5, 5);
  // Specular shine lensa kaca pembesar putih
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(mx + 2, my + 2, 2, 1);
  ctx.fillRect(mx + 3, my + 1, 1, 1);

  // Teks label status
  ctx.font = 'bold 8.5px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  if (isDiscovered) {
    ctx.fillStyle = '#6ee7b7';
    ctx.fillText('BACA ✓', mx + 13, by + 0.5);
  } else {
    ctx.fillStyle = '#fef08a';
    ctx.fillText('MATERI', mx + 13, by + 0.5);
  }

  ctx.restore();
}


// ══════════════════════════════════════════════════════════════════════════
// 2. POTRET BESAR KARAKTER NPC VISUAL NOVEL (120x120 TRANSPARAN)
// ══════════════════════════════════════════════════════════════════════════
export function getNpcPortraitL2(type: string): HTMLCanvasElement {
  const cacheKey = `portrait_l2_${type}`;

  return getOrCreateCanvas(cacheKey, 120, 120, (ctx) => {
    ctx.clearRect(0, 0, 120, 120);

    const p = 4;
    const offX = 20;
    const offY = 16;

    if (type === 'resqy') {
      // ── MASKOT RESQY BURUNG HANTU ──
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
      ctx.fillRect(offX + 9 * p, offY + 6 * p, 2 * p, 1 * p);
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
    } else if (type === 'zidane') {
      // ── ZIDANE ──
      // Bahu & Baju Hitam Cool
      ctx.fillStyle = '#09090b';
      ctx.fillRect(offX + 1 * p, offY + 16 * p, 18 * p, 8 * p);
      ctx.fillStyle = '#18181b';
      ctx.fillRect(offX + 3 * p, offY + 17 * p, 14 * p, 7 * p);
      ctx.fillStyle = '#334155';
      ctx.fillRect(offX + 8 * p, offY + 16 * p, 4 * p, 5 * p);

      // Leher & Dagu (Kulit Putih)
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(offX + 7 * p, offY + 13 * p, 6 * p, 3 * p);
      ctx.fillRect(offX + 5 * p, offY + 6 * p, 10 * p, 8 * p);

      // Kacamata Persegi Modern Hitam & Glint Cyan
      ctx.fillStyle = '#09090b';
      ctx.fillRect(offX + 5 * p, offY + 7 * p, 4 * p, 3 * p);
      ctx.fillRect(offX + 11 * p, offY + 7 * p, 4 * p, 3 * p);
      ctx.fillRect(offX + 9 * p, offY + 8 * p, 2 * p, 1 * p);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(offX + 6 * p, offY + 8 * p, 2 * p, 2 * p);
      ctx.fillRect(offX + 12 * p, offY + 8 * p, 2 * p, 2 * p);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(offX + 6 * p, offY + 8 * p, 1 * p, 1 * p);
      ctx.fillRect(offX + 12 * p, offY + 8 * p, 1 * p, 1 * p);

      // Senyum Tenang Cool
      ctx.fillStyle = '#451a03';
      ctx.fillRect(offX + 8 * p, offY + 12 * p, 4 * p, 1 * p);

      // Rambut Hitam Berantakan Stylish
      ctx.fillStyle = '#09090b';
      ctx.fillRect(offX + 3 * p, offY + 3 * p, 14 * p, 4 * p);
      ctx.fillRect(offX + 2 * p, offY + 5 * p, 3 * p, 5 * p);
      ctx.fillRect(offX + 15 * p, offY + 5 * p, 3 * p, 5 * p);
      ctx.fillRect(offX + 5 * p, offY - 1 * p, 4 * p, 4 * p);
      ctx.fillRect(offX + 11 * p, offY - 2 * p, 4 * p, 5 * p);
      ctx.fillRect(offX + 8 * p, offY + 0 * p, 3 * p, 4 * p);
      ctx.fillStyle = '#27272a';
      ctx.fillRect(offX + 6 * p, offY + 1 * p, 2 * p, 2 * p);
      ctx.fillRect(offX + 12 * p, offY + 0 * p, 2 * p, 2 * p);
    } else if (type === 'zahra') {
      // ── ZAHRA ──
      ctx.fillStyle = '#ec4899';
      ctx.fillRect(offX + 1 * p, offY + 16 * p, 18 * p, 8 * p);
      ctx.fillStyle = '#f472b6';
      ctx.fillRect(offX + 3 * p, offY + 17 * p, 14 * p, 7 * p);

      ctx.fillStyle = '#0284c7';
      ctx.fillRect(offX + 6 * p, offY + 13 * p, 8 * p, 6 * p);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(offX + 7 * p, offY + 14 * p, 6 * p, 4 * p);

      ctx.fillStyle = '#0284c7';
      ctx.fillRect(offX + 3 * p, offY + 2 * p, 14 * p, 13 * p);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(offX + 4 * p, offY + 1 * p, 12 * p, 4 * p);

      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(offX + 6 * p, offY + 5 * p, 8 * p, 8 * p);

      ctx.fillStyle = '#fda4af';
      ctx.fillRect(offX + 5 * p, offY + 10 * p, 2 * p, 2 * p);
      ctx.fillRect(offX + 13 * p, offY + 10 * p, 2 * p, 2 * p);

      ctx.fillStyle = '#d97706';
      ctx.fillRect(offX + 5 * p, offY + 7 * p, 4 * p, 3 * p);
      ctx.fillRect(offX + 11 * p, offY + 7 * p, 4 * p, 3 * p);
      ctx.fillRect(offX + 9 * p, offY + 8 * p, 2 * p, 1 * p);

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(offX + 6 * p, offY + 8 * p, 2 * p, 2 * p);
      ctx.fillRect(offX + 12 * p, offY + 8 * p, 2 * p, 2 * p);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(offX + 6 * p, offY + 8 * p, 1 * p, 1 * p);
      ctx.fillRect(offX + 12 * p, offY + 8 * p, 1 * p, 1 * p);

      ctx.fillStyle = '#e11d48';
      ctx.fillRect(offX + 8 * p, offY + 11 * p, 4 * p, 2 * p);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(offX + 9 * p, offY + 11 * p, 2 * p, 1 * p);
    } else if (type === 'ican') {
      // ── ICAN ──
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(offX + 1 * p, offY + 16 * p, 18 * p, 8 * p);
      ctx.fillStyle = '#fb923c';
      ctx.fillRect(offX + 4 * p, offY + 17 * p, 12 * p, 7 * p);
      ctx.fillStyle = '#334155';
      ctx.fillRect(offX + 8 * p, offY + 16 * p, 4 * p, 4 * p);

      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(offX + 7 * p, offY + 13 * p, 6 * p, 3 * p);
      ctx.fillRect(offX + 5 * p, offY + 6 * p, 10 * p, 8 * p);

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(offX + 6 * p, offY + 8 * p, 3 * p, 2 * p);
      ctx.fillRect(offX + 11 * p, offY + 8 * p, 3 * p, 2 * p);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(offX + 7 * p, offY + 8 * p, 1 * p, 1 * p);
      ctx.fillRect(offX + 12 * p, offY + 8 * p, 1 * p, 1 * p);

      ctx.fillStyle = '#7c2d12';
      ctx.fillRect(offX + 8 * p, offY + 12 * p, 4 * p, 1 * p);
      ctx.fillRect(offX + 12 * p, offY + 11 * p, 1 * p, 1 * p);

      ctx.fillStyle = '#18181b';
      ctx.fillRect(offX + 3 * p, offY + 2 * p, 14 * p, 5 * p);
      ctx.fillRect(offX + 2 * p, offY - 2 * p, 5 * p, 5 * p);
      ctx.fillRect(offX + 7 * p, offY - 4 * p, 6 * p, 6 * p);
      ctx.fillRect(offX + 13 * p, offY - 2 * p, 5 * p, 5 * p);
      ctx.fillStyle = '#27272a';
      ctx.fillRect(offX + 3 * p, offY - 1 * p, 2 * p, 2 * p);
      ctx.fillRect(offX + 9 * p, offY - 3 * p, 3 * p, 2 * p);
      ctx.fillRect(offX + 14 * p, offY - 1 * p, 2 * p, 2 * p);
    } else if (type === 'lintang') {
      // ── LINTANG ──
      ctx.fillStyle = '#0d9488';
      ctx.fillRect(offX + 1 * p, offY + 16 * p, 18 * p, 8 * p);
      ctx.fillStyle = '#14b8a6';
      ctx.fillRect(offX + 3 * p, offY + 17 * p, 14 * p, 7 * p);

      ctx.fillStyle = '#15803d';
      ctx.fillRect(offX + 6 * p, offY + 13 * p, 8 * p, 6 * p);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(offX + 7 * p, offY + 14 * p, 6 * p, 4 * p);

      ctx.fillStyle = '#15803d';
      ctx.fillRect(offX + 3 * p, offY + 2 * p, 14 * p, 13 * p);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(offX + 4 * p, offY + 1 * p, 12 * p, 4 * p);

      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(offX + 6 * p, offY + 5 * p, 8 * p, 8 * p);

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(offX + 7 * p, offY + 8 * p, 2 * p, 2 * p);
      ctx.fillRect(offX + 11 * p, offY + 8 * p, 2 * p, 2 * p);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(offX + 7 * p, offY + 8 * p, 1 * p, 1 * p);
      ctx.fillRect(offX + 11 * p, offY + 8 * p, 1 * p, 1 * p);

      ctx.fillStyle = '#991b1b';
      ctx.fillRect(offX + 8 * p, offY + 11 * p, 4 * p, 1 * p);
    } else if (type === 'bu_tyas') {
      // ── BU TYAS ──
      ctx.fillStyle = '#881337';
      ctx.fillRect(offX + 1 * p, offY + 16 * p, 18 * p, 8 * p);
      ctx.fillStyle = '#9f1239';
      ctx.fillRect(offX + 3 * p, offY + 17 * p, 14 * p, 7 * p);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(offX + 8 * p, offY + 16 * p, 4 * p, 5 * p);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(offX + 4 * p, offY + 18 * p, 2 * p, 2 * p);

      ctx.fillStyle = '#09090b';
      ctx.fillRect(offX + 6 * p, offY + 13 * p, 8 * p, 5 * p);
      ctx.fillStyle = '#18181b';
      ctx.fillRect(offX + 7 * p, offY + 14 * p, 6 * p, 4 * p);

      ctx.fillStyle = '#09090b';
      ctx.fillRect(offX + 3 * p, offY + 2 * p, 14 * p, 13 * p);
      ctx.fillStyle = '#18181b';
      ctx.fillRect(offX + 4 * p, offY + 1 * p, 12 * p, 4 * p);

      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(offX + 6 * p, offY + 5 * p, 8 * p, 8 * p);

      ctx.fillStyle = '#d97706';
      ctx.fillRect(offX + 5 * p, offY + 7 * p, 4 * p, 3 * p);
      ctx.fillRect(offX + 11 * p, offY + 7 * p, 4 * p, 3 * p);
      ctx.fillRect(offX + 9 * p, offY + 8 * p, 2 * p, 1 * p);

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(offX + 6 * p, offY + 8 * p, 2 * p, 2 * p);
      ctx.fillRect(offX + 12 * p, offY + 8 * p, 2 * p, 2 * p);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(offX + 6 * p, offY + 8 * p, 1 * p, 1 * p);
      ctx.fillRect(offX + 12 * p, offY + 8 * p, 1 * p, 1 * p);

      ctx.fillStyle = '#991b1b';
      ctx.fillRect(offX + 8 * p, offY + 11 * p, 4 * p, 1 * p);
    } else if (type === 'zahra_medis') {
      // ── ZAHRA PETUGAS MEDIS (PORTRAIT 120x120) ──
      // Jas medis putih, kerah putih, lambang palang merah di dada kiri
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(offX + 1 * p, offY + 15 * p, 18 * p, 9 * p);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(offX + 1 * p, offY + 15 * p, 3 * p, 9 * p);
      ctx.fillRect(offX + 16 * p, offY + 15 * p, 3 * p, 9 * p);

      // Lambang Palang Merah PMI di Dada
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(offX + 4 * p, offY + 16 * p, 4 * p, 5 * p);
      ctx.fillRect(offX + 3 * p, offY + 17 * p, 6 * p, 3 * p);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(offX + 5 * p, offY + 17 * p, 2 * p, 3 * p);
      ctx.fillRect(offX + 4 * p, offY + 18 * p, 4 * p, 1 * p);

      // Kerudung Biru Cerah Zahra
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(offX + 3 * p, offY + 2 * p, 14 * p, 13 * p);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(offX + 4 * p, offY + 1 * p, 12 * p, 4 * p);

      // Wajah
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(offX + 6 * p, offY + 5 * p, 8 * p, 8 * p);

      // Rona Pipi Pink Manis
      ctx.fillStyle = '#fda4af';
      ctx.fillRect(offX + 5 * p, offY + 10 * p, 2 * p, 2 * p);
      ctx.fillRect(offX + 13 * p, offY + 10 * p, 2 * p, 2 * p);

      // Kacamata Bulat Emas
      ctx.fillStyle = '#d97706';
      ctx.fillRect(offX + 5 * p, offY + 7 * p, 4 * p, 3 * p);
      ctx.fillRect(offX + 11 * p, offY + 7 * p, 4 * p, 3 * p);
      ctx.fillRect(offX + 9 * p, offY + 8 * p, 2 * p, 1 * p);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(offX + 6 * p, offY + 8 * p, 2 * p, 2 * p);
      ctx.fillRect(offX + 12 * p, offY + 8 * p, 2 * p, 2 * p);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(offX + 6 * p, offY + 8 * p, 1 * p, 1 * p);
      ctx.fillRect(offX + 12 * p, offY + 8 * p, 1 * p, 1 * p);

      // Senyum Manis
      ctx.fillStyle = '#e11d48';
      ctx.fillRect(offX + 8 * p, offY + 11 * p, 4 * p, 2 * p);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(offX + 9 * p, offY + 11 * p, 2 * p, 1 * p);
    } else if (type === 'lintang_medis') {
      // ── LINTANG PETUGAS MEDIS (PORTRAIT 120x120) ──
      // Jas medis putih, kerah putih, lambang palang merah di dada kiri
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(offX + 1 * p, offY + 15 * p, 18 * p, 9 * p);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(offX + 1 * p, offY + 15 * p, 3 * p, 9 * p);
      ctx.fillRect(offX + 16 * p, offY + 15 * p, 3 * p, 9 * p);

      // Lambang Palang Merah PMI di Dada
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(offX + 4 * p, offY + 16 * p, 4 * p, 5 * p);
      ctx.fillRect(offX + 3 * p, offY + 17 * p, 6 * p, 3 * p);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(offX + 5 * p, offY + 17 * p, 2 * p, 3 * p);
      ctx.fillRect(offX + 4 * p, offY + 18 * p, 4 * p, 1 * p);

      // Kerudung Hijau Emerald Lintang
      ctx.fillStyle = '#15803d';
      ctx.fillRect(offX + 3 * p, offY + 2 * p, 14 * p, 13 * p);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(offX + 4 * p, offY + 1 * p, 12 * p, 4 * p);

      // Wajah
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(offX + 6 * p, offY + 5 * p, 8 * p, 8 * p);

      // Kacamata Persegi Modern
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(offX + 5 * p, offY + 7 * p, 4 * p, 3 * p);
      ctx.fillRect(offX + 11 * p, offY + 7 * p, 4 * p, 3 * p);
      ctx.fillRect(offX + 9 * p, offY + 8 * p, 2 * p, 1 * p);
      ctx.fillStyle = '#86efac';
      ctx.fillRect(offX + 6 * p, offY + 8 * p, 2 * p, 2 * p);
      ctx.fillRect(offX + 12 * p, offY + 8 * p, 2 * p, 2 * p);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(offX + 6 * p, offY + 8 * p, 1 * p, 1 * p);
      ctx.fillRect(offX + 12 * p, offY + 8 * p, 1 * p, 1 * p);

      // Senyum Cerdas
      ctx.fillStyle = '#059669';
      ctx.fillRect(offX + 8 * p, offY + 11 * p, 4 * p, 1 * p);
    } else if (type === 'komandan_satria') {
      // ── KOMANDAN BPBD/SAR SATRIA ──
      // Rompi Lapangan Oranye & Scotlight Perak
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(offX + 1 * p, offY + 15 * p, 18 * p, 9 * p);
      ctx.fillStyle = '#f97316';
      ctx.fillRect(offX + 3 * p, offY + 15 * p, 14 * p, 9 * p);
      ctx.fillStyle = '#f1f5f9'; // Scotlight perak
      ctx.fillRect(offX + 1 * p, offY + 18 * p, 18 * p, 2 * p);
      ctx.fillStyle = '#0284c7'; // Badge Segitiga BPBD
      ctx.fillRect(offX + 4 * p, offY + 16 * p, 3 * p, 2 * p);

      // Leher & Wajah
      ctx.fillStyle = '#f5af7e';
      ctx.fillRect(offX + 7 * p, offY + 12 * p, 6 * p, 3 * p);
      ctx.fillRect(offX + 5 * p, offY + 5 * p, 10 * p, 8 * p);

      // Mata Tegas & Kumis Tipis
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(offX + 7 * p, offY + 7 * p, 2 * p, 2 * p);
      ctx.fillRect(offX + 11 * p, offY + 7 * p, 2 * p, 2 * p);
      ctx.fillRect(offX + 7 * p, offY + 10 * p, 6 * p, 1 * p);

      // Topi Komando Lapangan Oranye
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(offX + 4 * p, offY + 1 * p, 12 * p, 5 * p);
      ctx.fillRect(offX + 3 * p, offY + 4 * p, 14 * p, 2 * p);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(offX + 8 * p, offY + 2 * p, 4 * p, 2 * p);
    } else if (type === 'dr_alisa') {
      // ── DOKTER RELAWAN MEDIS PMI DR. ALISA ──
      // Jas/Rompi Medis Putih
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(offX + 1 * p, offY + 15 * p, 18 * p, 9 * p);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(offX + 1 * p, offY + 15 * p, 3 * p, 9 * p);
      ctx.fillRect(offX + 16 * p, offY + 15 * p, 3 * p, 9 * p);

      // Lambang Palang Merah
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(offX + 4 * p, offY + 16 * p, 4 * p, 5 * p);
      ctx.fillRect(offX + 3 * p, offY + 17 * p, 6 * p, 3 * p);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(offX + 5 * p, offY + 17 * p, 2 * p, 3 * p);
      ctx.fillRect(offX + 4 * p, offY + 18 * p, 4 * p, 1 * p);

      // Leher & Wajah
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(offX + 7 * p, offY + 12 * p, 6 * p, 3 * p);
      ctx.fillRect(offX + 5 * p, offY + 5 * p, 10 * p, 8 * p);

      // Mata & Senyum Ramah
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(offX + 7 * p, offY + 7 * p, 2 * p, 2 * p);
      ctx.fillRect(offX + 11 * p, offY + 7 * p, 2 * p, 2 * p);
      ctx.fillStyle = '#e11d48';
      ctx.fillRect(offX + 8 * p, offY + 10 * p, 4 * p, 1 * p);

      // Jilbab Medis Putih Bersih
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(offX + 4 * p, offY + 1 * p, 12 * p, 5 * p);
      ctx.fillRect(offX + 3 * p, offY + 4 * p, 2 * p, 9 * p);
      ctx.fillRect(offX + 15 * p, offY + 4 * p, 2 * p, 9 * p);
      ctx.fillRect(offX + 4 * p, offY + 13 * p, 12 * p, 2 * p);
    } else if (type === 'pak_bambang') {
      // ── KEPALA SEKOLAH PAK BAMBANG ──
      // Kemeja Batik Dinas Cokelat Emas
      ctx.fillStyle = '#78350f';
      ctx.fillRect(offX + 1 * p, offY + 15 * p, 18 * p, 9 * p);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(offX + 3 * p, offY + 16 * p, 3 * p, 3 * p);
      ctx.fillRect(offX + 14 * p, offY + 16 * p, 3 * p, 3 * p);
      ctx.fillRect(offX + 8 * p, offY + 19 * p, 4 * p, 4 * p);

      // Leher & Wajah
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(offX + 7 * p, offY + 12 * p, 6 * p, 3 * p);
      ctx.fillRect(offX + 5 * p, offY + 5 * p, 10 * p, 8 * p);

      // Kacamata Berwibawa
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(offX + 6 * p, offY + 7 * p, 3 * p, 2 * p);
      ctx.fillRect(offX + 11 * p, offY + 7 * p, 3 * p, 2 * p);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1;
      ctx.strokeRect(offX + 6 * p, offY + 7 * p, 3 * p, 2 * p);
      ctx.strokeRect(offX + 11 * p, offY + 7 * p, 3 * p, 2 * p);

      // Rambut Beruban Rapi
      ctx.fillStyle = '#64748b';
      ctx.fillRect(offX + 4 * p, offY + 1 * p, 12 * p, 5 * p);
      ctx.fillRect(offX + 3 * p, offY + 4 * p, 2 * p, 5 * p);
      ctx.fillRect(offX + 15 * p, offY + 4 * p, 2 * p, 5 * p);
    } else if (type === 'pak_hendra') {
      // ── PETUGAS SARPRAS PAK HENDRA ──
      // Kemeja Seragam Biru Tua
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(offX + 1 * p, offY + 15 * p, 18 * p, 9 * p);
      ctx.fillStyle = '#facc15'; // Badge Petugas
      ctx.fillRect(offX + 4 * p, offY + 17 * p, 3 * p, 3 * p);

      // Leher & Wajah
      ctx.fillStyle = '#f5af7e';
      ctx.fillRect(offX + 7 * p, offY + 12 * p, 6 * p, 3 * p);
      ctx.fillRect(offX + 5 * p, offY + 5 * p, 10 * p, 8 * p);

      // Mata & Senyum Ramah
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(offX + 7 * p, offY + 7 * p, 2 * p, 2 * p);
      ctx.fillRect(offX + 11 * p, offY + 7 * p, 2 * p, 2 * p);

      // Topi Pet Biru Tua
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(offX + 4 * p, offY + 1 * p, 12 * p, 5 * p);
      ctx.fillRect(offX + 3 * p, offY + 4 * p, 14 * p, 2 * p);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(offX + 8 * p, offY + 2 * p, 4 * p, 2 * p);
    } else if (type === 'bu_rahma') {
      // ── GURU IPA BU RAHMA (BLAZER DINAS KHAKI & KACAMATA) ──
      // Tubuh & Blazer Khaki
      ctx.fillStyle = '#b45309';
      ctx.fillRect(offX + 1 * p, offY + 15 * p, 18 * p, 9 * p);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(offX + 2 * p, offY + 16 * p, 16 * p, 8 * p);
      // Kerah Kemeja Putih di Dalam
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(offX + 7 * p, offY + 14 * p, 6 * p, 4 * p);
      // Lencana Guru Emas
      ctx.fillStyle = '#facc15';
      ctx.fillRect(offX + 14 * p, offY + 18 * p, 3 * p, 3 * p);

      // Leher
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(offX + 7 * p, offY + 12 * p, 6 * p, 3 * p);
      // Wajah
      ctx.fillRect(offX + 5 * p, offY + 5 * p, 10 * p, 8 * p);
      ctx.fillStyle = '#fba874';
      ctx.fillRect(offX + 5 * p, offY + 11 * p, 10 * p, 2 * p);
      // Rona Pipi
      ctx.fillStyle = '#fb7185';
      ctx.fillRect(offX + 6 * p, offY + 9 * p, 2 * p, 1 * p);
      ctx.fillRect(offX + 12 * p, offY + 9 * p, 2 * p, 1 * p);

      // Kacamata Berwibawa
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(offX + 6 * p, offY + 7 * p, 3 * p, 2 * p);
      ctx.fillRect(offX + 11 * p, offY + 7 * p, 3 * p, 2 * p);
      ctx.fillRect(offX + 9 * p, offY + 7 * p, 2 * p, 1 * p); // Frame bridge
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(offX + 6 * p, offY + 7 * p, 1 * p, 1 * p);
      ctx.fillRect(offX + 11 * p, offY + 7 * p, 1 * p, 1 * p);

      // Rambut Tersanggul Rapi
      ctx.fillStyle = '#451a03';
      ctx.fillRect(offX + 4 * p, offY + 1 * p, 12 * p, 5 * p);
      ctx.fillRect(offX + 3 * p, offY + 3 * p, 2 * p, 6 * p);
      ctx.fillRect(offX + 15 * p, offY + 3 * p, 2 * p, 6 * p);
      // Sanggul Atas
      ctx.fillRect(offX + 7 * p, offY - 2 * p, 6 * p, 3 * p);
    } else if (type === 'pak_surya') {
      // ── PAK SURYA (INSTRUKTUR LAPANGAN BNPB - ROMPI ORANYE) ──
      // Baju & Rompi Oranye
      ctx.fillStyle = '#c2410c';
      ctx.fillRect(offX + 1 * p, offY + 15 * p, 18 * p, 9 * p);
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(offX + 2 * p, offY + 16 * p, 16 * p, 8 * p);
      // Garis Reflektor Kuning
      ctx.fillStyle = '#facc15';
      ctx.fillRect(offX + 2 * p, offY + 18 * p, 16 * p, 2 * p);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(offX + 4 * p, offY + 18 * p, 12 * p, 1 * p);
      // Kaos Dalam Hitam
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(offX + 8 * p, offY + 15 * p, 4 * p, 4 * p);

      // Leher
      ctx.fillStyle = '#f5af7e';
      ctx.fillRect(offX + 7 * p, offY + 12 * p, 6 * p, 3 * p);
      // Wajah Tegas & Ramah
      ctx.fillRect(offX + 5 * p, offY + 5 * p, 10 * p, 8 * p);
      ctx.fillStyle = '#d97746';
      ctx.fillRect(offX + 5 * p, offY + 11 * p, 10 * p, 2 * p);

      // Mata & Alis
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(offX + 6 * p, offY + 7 * p, 2 * p, 2 * p);
      ctx.fillRect(offX + 12 * p, offY + 7 * p, 2 * p, 2 * p);
      ctx.fillRect(offX + 6 * p, offY + 5 * p, 3 * p, 1 * p);
      ctx.fillRect(offX + 11 * p, offY + 5 * p, 3 * p, 1 * p);

      // Topi Lapangan BNPB Oranye
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(offX + 4 * p, offY + 0 * p, 12 * p, 5 * p);
      ctx.fillRect(offX + 2 * p, offY + 3 * p, 16 * p, 2 * p); // Visor
      ctx.fillStyle = '#facc15';
      ctx.fillRect(offX + 8 * p, offY + 0 * p, 4 * p, 2 * p); // Emblem
    } else if (type === 'pak_joko') {
      // ── KEPALA DUSUN DESTANA PAK JOKO ──
      // Rompi Hijau Destana & Kemeja Putih
      ctx.fillStyle = '#15803d';
      ctx.fillRect(offX + 1 * p, offY + 15 * p, 18 * p, 9 * p);
      ctx.fillStyle = '#166534';
      ctx.fillRect(offX + 1 * p, offY + 15 * p, 4 * p, 9 * p);
      ctx.fillRect(offX + 15 * p, offY + 15 * p, 4 * p, 9 * p);
      ctx.fillStyle = '#ffffff'; // Kemeja putih dalam
      ctx.fillRect(offX + 7 * p, offY + 14 * p, 6 * p, 4 * p);
      // Badge Emas DESTANA
      ctx.fillStyle = '#facc15';
      ctx.fillRect(offX + 13 * p, offY + 17 * p, 4 * p, 3 * p);

      // Leher & Wajah Hangat
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(offX + 7 * p, offY + 12 * p, 6 * p, 3 * p);
      ctx.fillRect(offX + 5 * p, offY + 5 * p, 10 * p, 8 * p);

      // Mata & Senyum Ramah Bapak Dusun
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(offX + 7 * p, offY + 7 * p, 2 * p, 2 * p);
      ctx.fillRect(offX + 11 * p, offY + 7 * p, 2 * p, 2 * p);
      // Kumis Rapi
      ctx.fillStyle = '#451a03';
      ctx.fillRect(offX + 7 * p, offY + 10 * p, 6 * p, 1 * p);

      // Peci / Blangkon Hitam dengan Pita Batik Emas
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(offX + 4 * p, offY + 1 * p, 12 * p, 5 * p);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(offX + 4 * p, offY + 4 * p, 12 * p, 1 * p);
    } else if (type === 'mbak_rina') {
      // ── WARGA SIAGA MERAPI MBAK RINA ──
      // Jaket Outdoor Merah Bata & Strip Reflektor
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(offX + 1 * p, offY + 15 * p, 18 * p, 9 * p);
      ctx.fillStyle = '#b91c1c';
      ctx.fillRect(offX + 1 * p, offY + 15 * p, 3 * p, 9 * p);
      ctx.fillRect(offX + 16 * p, offY + 15 * p, 3 * p, 9 * p);
      ctx.fillStyle = '#e2e8f0'; // Strip reflektor
      ctx.fillRect(offX + 1 * p, offY + 18 * p, 18 * p, 2 * p);

      // Masker Putih Tergantung di Leher (Siap Pakai)
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(offX + 6 * p, offY + 13 * p, 8 * p, 3 * p);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(offX + 5 * p, offY + 13 * p, 1 * p, 3 * p);
      ctx.fillRect(offX + 14 * p, offY + 13 * p, 1 * p, 3 * p);

      // Leher & Wajah
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(offX + 7 * p, offY + 12 * p, 6 * p, 2 * p);
      ctx.fillRect(offX + 5 * p, offY + 5 * p, 10 * p, 8 * p);
      // Rona Pipi
      ctx.fillStyle = '#fb7185';
      ctx.fillRect(offX + 6 * p, offY + 9 * p, 2 * p, 1 * p);
      ctx.fillRect(offX + 12 * p, offY + 9 * p, 2 * p, 1 * p);

      // Mata Ceria
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(offX + 7 * p, offY + 7 * p, 2 * p, 2 * p);
      ctx.fillRect(offX + 11 * p, offY + 7 * p, 2 * p, 2 * p);

      // Rambut Cokelat Kuncir dengan Bandana Biru
      ctx.fillStyle = '#451a03';
      ctx.fillRect(offX + 4 * p, offY + 1 * p, 12 * p, 5 * p);
      ctx.fillRect(offX + 3 * p, offY + 3 * p, 2 * p, 6 * p);
      ctx.fillRect(offX + 15 * p, offY + 3 * p, 2 * p, 6 * p);
      ctx.fillStyle = '#0284c7'; // Bandana biru
      ctx.fillRect(offX + 3 * p, offY + 3 * p, 14 * p, 2 * p);
      // Kuncir Belakang
      ctx.fillStyle = '#451a03';
      ctx.fillRect(offX + 16 * p, offY + 1 * p, 4 * p, 4 * p);
    } else if (type === 'bu_dini') {
      // ── KOORDINATOR SHELTER BPBD BU DINI ──
      // Rompi Oranye BPBD & Scotlight Perak
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(offX + 1 * p, offY + 15 * p, 18 * p, 9 * p);
      ctx.fillStyle = '#f97316';
      ctx.fillRect(offX + 3 * p, offY + 15 * p, 14 * p, 9 * p);
      ctx.fillStyle = '#f1f5f9'; // Scotlight perak
      ctx.fillRect(offX + 1 * p, offY + 18 * p, 18 * p, 2 * p);
      // Lanyard & ID Card Koordinator
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(offX + 8 * p, offY + 14 * p, 4 * p, 4 * p);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(offX + 8 * p, offY + 18 * p, 4 * p, 4 * p);
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(offX + 9 * p, offY + 19 * p, 2 * p, 2 * p);

      // Leher & Wajah
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(offX + 7 * p, offY + 12 * p, 6 * p, 3 * p);
      ctx.fillRect(offX + 5 * p, offY + 5 * p, 10 * p, 8 * p);
      // Rona Pipi
      ctx.fillStyle = '#fb7185';
      ctx.fillRect(offX + 6 * p, offY + 9 * p, 2 * p, 1 * p);
      ctx.fillRect(offX + 12 * p, offY + 9 * p, 2 * p, 1 * p);

      // Mata Ramah Berwibawa
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(offX + 7 * p, offY + 7 * p, 2 * p, 2 * p);
      ctx.fillRect(offX + 11 * p, offY + 7 * p, 2 * p, 2 * p);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(offX + 7 * p, offY + 7 * p, 1 * p, 1 * p);
      ctx.fillRect(offX + 11 * p, offY + 7 * p, 1 * p, 1 * p);
      // Senyum
      ctx.fillStyle = '#b45309';
      ctx.fillRect(offX + 8 * p, offY + 11 * p, 4 * p, 1 * p);

      // Jilbab Rapi Oranye-Krem Khas BPBD
      ctx.fillStyle = '#fdba74';
      ctx.fillRect(offX + 4 * p, offY + 1 * p, 12 * p, 5 * p);
      ctx.fillRect(offX + 3 * p, offY + 4 * p, 2 * p, 8 * p);
      ctx.fillRect(offX + 15 * p, offY + 4 * p, 2 * p, 8 * p);
      ctx.fillRect(offX + 4 * p, offY + 12 * p, 12 * p, 2 * p);
    } else if (type === 'pak_slamet') {
      // ── RELAWAN TAGANA PAK SLAMET ──
      // Rompi Tagana Biru Tua & Strip Merah Putih
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(offX + 1 * p, offY + 15 * p, 18 * p, 9 * p);
      ctx.fillStyle = '#1d4ed8';
      ctx.fillRect(offX + 3 * p, offY + 15 * p, 14 * p, 9 * p);
      ctx.fillStyle = '#dc2626'; // Strip Merah
      ctx.fillRect(offX + 1 * p, offY + 18 * p, 18 * p, 2 * p);
      ctx.fillStyle = '#ffffff'; // Strip Putih
      ctx.fillRect(offX + 1 * p, offY + 20 * p, 18 * p, 1 * p);
      // HT di saku kiri
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(offX + 3 * p, offY + 15 * p, 3 * p, 4 * p);
      ctx.fillRect(offX + 4 * p, offY + 13 * p, 1 * p, 2 * p);

      // Leher & Wajah
      ctx.fillStyle = '#f5af7e';
      ctx.fillRect(offX + 7 * p, offY + 12 * p, 6 * p, 3 * p);
      ctx.fillRect(offX + 5 * p, offY + 5 * p, 10 * p, 8 * p);

      // Mata & Kumis Tipis
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(offX + 7 * p, offY + 7 * p, 2 * p, 2 * p);
      ctx.fillRect(offX + 11 * p, offY + 7 * p, 2 * p, 2 * p);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(offX + 7 * p, offY + 7 * p, 1 * p, 1 * p);
      ctx.fillRect(offX + 11 * p, offY + 7 * p, 1 * p, 1 * p);
      ctx.fillStyle = '#451a03';
      ctx.fillRect(offX + 7 * p, offY + 10 * p, 6 * p, 1 * p);

      // Topi Rimba Relawan Tagana
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(offX + 2 * p, offY + 3 * p, 16 * p, 2 * p); // Brim topi rimba
      ctx.fillRect(offX + 4 * p, offY + 0 * p, 12 * p, 4 * p);
      ctx.fillStyle = '#dc2626'; // Pita merah topi
      ctx.fillRect(offX + 4 * p, offY + 3 * p, 12 * p, 1 * p);
    } else {
      // ── SISWA/SISWI SMP (SERAGAM RESMI PUTIH-BIRU TUA DENGAN DASI SMP) ──
      // Kemeja Putih Seragam SMP
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(offX + 1 * p, offY + 15 * p, 18 * p, 9 * p);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(offX + 1 * p, offY + 15 * p, 3 * p, 9 * p);
      ctx.fillRect(offX + 16 * p, offY + 15 * p, 3 * p, 9 * p);

      // Kerah Kemeja Putih
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(offX + 6 * p, offY + 14 * p, 8 * p, 3 * p);

      // Dasi Biru Tua SMP
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(offX + 8 * p, offY + 15 * p, 4 * p, 2 * p); // Simpul
      ctx.fillRect(offX + 9 * p, offY + 17 * p, 2 * p, 7 * p); // Badan dasi

      // Badge OSIS di Saku Dada
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(offX + 4 * p, offY + 18 * p, 3 * p, 4 * p);

      // Atribut Khusus
      if (type === 'dito') {
        // Lencana PMR Merah-Putih
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(offX + 13 * p, offY + 17 * p, 4 * p, 4 * p);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(offX + 14 * p, offY + 18 * p, 2 * p, 2 * p);
      } else if (type === 'siti') {
        // Pin OSIS Emas
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(offX + 13 * p, offY + 17 * p, 3 * p, 3 * p);
      } else if (type === 'kak_fajar') {
        // Rompi Relawan Hijau
        ctx.fillStyle = '#10b981';
        ctx.fillRect(offX + 1 * p, offY + 15 * p, 4 * p, 9 * p);
        ctx.fillRect(offX + 15 * p, offY + 15 * p, 4 * p, 9 * p);
      }

      // Leher
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(offX + 7 * p, offY + 12 * p, 6 * p, 3 * p);

      // Wajah Siswa
      ctx.fillRect(offX + 5 * p, offY + 5 * p, 10 * p, 8 * p);
      ctx.fillStyle = '#fba874';
      ctx.fillRect(offX + 5 * p, offY + 11 * p, 10 * p, 2 * p);

      // Mata & Senyum
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(offX + 7 * p, offY + 7 * p, 2 * p, 2 * p);
      ctx.fillRect(offX + 11 * p, offY + 7 * p, 2 * p, 2 * p);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(offX + 7 * p, offY + 7 * p, 1 * p, 1 * p);
      ctx.fillRect(offX + 11 * p, offY + 7 * p, 1 * p, 1 * p);
      ctx.fillStyle = '#b45309';
      ctx.fillRect(offX + 8 * p, offY + 11 * p, 4 * p, 1 * p);

      // Rambut Khusus Karakter
      if (type === 'siti') {
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(offX + 4 * p, offY + 1 * p, 12 * p, 5 * p);
        ctx.fillRect(offX + 3 * p, offY + 4 * p, 2 * p, 7 * p);
        ctx.fillRect(offX + 15 * p, offY + 4 * p, 2 * p, 7 * p);
        // Kuncir Rambut di Belakang
        ctx.fillRect(offX + 16 * p, offY + 2 * p, 4 * p, 4 * p);
        ctx.fillStyle = '#c084fc';
        ctx.fillRect(offX + 15 * p, offY + 3 * p, 2 * p, 2 * p);
      } else if (type === 'kak_fajar') {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(offX + 4 * p, offY + 0 * p, 12 * p, 5 * p);
        ctx.fillRect(offX + 3 * p, offY + 2 * p, 2 * p, 5 * p);
        ctx.fillRect(offX + 15 * p, offY + 2 * p, 2 * p, 5 * p);
      } else {
        // Rian & Dito
        ctx.fillStyle = type === 'dito' ? '#312e81' : '#1c1917';
        ctx.fillRect(offX + 4 * p, offY + 1 * p, 12 * p, 5 * p);
        ctx.fillRect(offX + 3 * p, offY + 3 * p, 2 * p, 5 * p);
        ctx.fillRect(offX + 15 * p, offY + 3 * p, 2 * p, 5 * p);
      }
    }
  });
}

// ══════════════════════════════════════════════════════════════════════════
// 3. POTRET BESAR KARAKTER PEMAIN (SERAGAM SEKOLAH SMP RESMI - TRANSPARAN)
// ══════════════════════════════════════════════════════════════════════════
export function getPlayerPortraitL2(avatarConfig?: CustomAvatarConfig): HTMLCanvasElement {
  const skinKey = avatarConfig?.skin || 'warm';
  const hairKey = avatarConfig?.hairStyle || 'spiky';
  const hairColor = avatarConfig?.hairColor || '#3e2723';
  const cacheKey = `portrait_player_smp_${skinKey}_${hairKey}_${hairColor}`;

  return getOrCreateCanvas(cacheKey, 120, 120, (ctx) => {
    ctx.clearRect(0, 0, 120, 120);

    const skinPalette: Record<string, { base: string; shadow: string; blush?: string }> = {
      light: { base: '#fed7aa', shadow: '#fba874', blush: '#fb7185' },
      warm: { base: '#f5af7e', shadow: '#d97746', blush: '#f43f5e' },
      tan: { base: '#d97706', shadow: '#9a4214', blush: '#b45309' },
      brown: { base: '#92400e', shadow: '#5c2a10' },
      dark: { base: '#5c2c16', shadow: '#3a190b' },
      robot: { base: '#38bdf8', shadow: '#0284c7', blush: '#67e8f9' },
    };
    const skin = skinPalette[skinKey] || skinPalette.warm;

    const p = 4;
    const offX = 20;
    const offY = 16;

    // 1. Kemeja Seragam Putih Siswa SMP
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(offX + 1 * p, offY + 15 * p, 18 * p, 9 * p);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(offX + 1 * p, offY + 15 * p, 3 * p, 9 * p);
    ctx.fillRect(offX + 16 * p, offY + 15 * p, 3 * p, 9 * p);

    // Kerah Kemeja Putih
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(offX + 6 * p, offY + 14 * p, 8 * p, 3 * p);

    // Dasi Biru Tua SMP
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(offX + 8 * p, offY + 15 * p, 4 * p, 2 * p);
    ctx.fillRect(offX + 9 * p, offY + 17 * p, 2 * p, 7 * p);

    // Badge OSIS di Saku Dada
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(offX + 4 * p, offY + 18 * p, 3 * p, 4 * p);

    // 2. Leher & Wajah Siswa
    ctx.fillStyle = skin.base;
    ctx.fillRect(offX + 7 * p, offY + 12 * p, 6 * p, 3 * p);
    ctx.fillRect(offX + 5 * p, offY + 5 * p, 10 * p, 8 * p);
    ctx.fillStyle = skin.shadow;
    ctx.fillRect(offX + 5 * p, offY + 11 * p, 10 * p, 2 * p);

    if (skin.blush) {
      ctx.fillStyle = skin.blush;
      ctx.fillRect(offX + 6 * p, offY + 9 * p, 2 * p, 1 * p);
      ctx.fillRect(offX + 12 * p, offY + 9 * p, 2 * p, 1 * p);
    }

    // Mata Penjelajah Berbinar
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(offX + 7 * p, offY + 7 * p, 2 * p, 2 * p);
    ctx.fillRect(offX + 11 * p, offY + 7 * p, 2 * p, 2 * p);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(offX + 7 * p, offY + 7 * p, 1 * p, 1 * p);
    ctx.fillRect(offX + 11 * p, offY + 7 * p, 1 * p, 1 * p);
    // Senyum Semangat
    ctx.fillStyle = '#b45309';
    ctx.fillRect(offX + 8 * p, offY + 11 * p, 4 * p, 1 * p);

    // 3. Rambut / Hijab Siswa Sesuai Kustomisasi Pemain (Bengkel Avatar)
    ctx.fillStyle = hairColor;

    if (hairKey === 'hijab') {
      // ── HIJAB RESCUER (Sesuai Presisi Bengkel Avatar: Kubah Kepala, Samping, Dagu & Leher Tertutup) ──
      // Kubah atas jilbab melengkung rapi
      ctx.fillRect(offX + 4 * p, offY + 0 * p, 12 * p, 6 * p);
      ctx.fillRect(offX + 5 * p, offY - 2 * p, 10 * p, 3 * p);
      ctx.fillRect(offX + 6 * p, offY - 3 * p, 8 * p, 2 * p);

      // Ciput putih di dahi (di atas alis/mata)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(offX + 6 * p, offY + 4 * p, 8 * p, 1 * p);

      // Kerudung samping (menutup telinga & membingkai pipi hingga ke bahu)
      ctx.fillStyle = hairColor;
      ctx.fillRect(offX + 3 * p, offY + 2 * p, 3 * p, 12 * p);
      ctx.fillRect(offX + 14 * p, offY + 2 * p, 3 * p, 12 * p);

      // Lipatan bayangan kerudung samping (depth/volume 3D)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(offX + 5 * p, offY + 4 * p, 1 * p, 9 * p);
      ctx.fillRect(offX + 14 * p, offY + 4 * p, 1 * p, 9 * p);

      // Penutup dagu & leher (menutup leher sepenuhnya dari bawah mulut ke kerah kemeja)
      ctx.fillStyle = hairColor;
      ctx.fillRect(offX + 5 * p, offY + 12 * p, 10 * p, 4 * p);
      ctx.fillRect(offX + 6 * p, offY + 15 * p, 8 * p, 3 * p);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(offX + 6 * p, offY + 12 * p, 8 * p, 1 * p);

      // Bros Emas Penyelamat (Gold Brooch di dada/leher)
      ctx.fillStyle = '#facc15';
      ctx.fillRect(offX + 9 * p, offY + 14 * p, 2 * p, 2 * p);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(offX + 9 * p, offY + 14 * p, 1 * p, 1 * p);
    } else {
      // Rambut Dasar Umum
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
  });
}

// ══════════════════════════════════════════════════════════════════════════
// 4. IN-WORLD SIMULASI GEMPA: POSE SISWA DUDUK, MERUNDUK (COVER), & EVAKUASI
// ══════════════════════════════════════════════════════════════════════════

export function drawStudentSittingInDesk(
  ctx: CanvasRenderingContext2D,
  chairX: number,
  y: number,
  studentType: string,
  avatarConfig?: CustomAvatarConfig,
  animTick = 0
): void {
  ctx.save();
  ctx.translate(Math.round(chairX), Math.round(y));

  const bob = Math.sin(animTick * 0.05 + chairX) > 0 ? 1 : 0;
  const skin = avatarConfig?.skin === 'light' ? '#fed7aa' : '#f5af7e';
  const hair = studentType === 'player'
    ? (avatarConfig?.hairColor || '#1c1917')
    : studentType === 'siti'
      ? '#1e1b4b'
      : studentType === 'dito'
        ? '#312e81'
        : '#1c1917';

  // ── DUDUK DI KURSI MENGHADAP KE KIRI (MEJA DI SEBELAH KIRI, TINGGI MEJA 324) ──
  // 1. Kaki Siswa: Betis tegak dari dudukan kursi ke lantai, sepatu di lantai
  ctx.fillStyle = '#0f172a'; // Sepatu hitam
  ctx.fillRect(-14, -4, 6, 4);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-14, -1, 6, 1);

  // Celana / Rok Biru SMP
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(-13, -16, 4, 12); // Betis tegak
  ctx.fillRect(-14, -20, 14, 5); // Paha mendatar di atas dudukan kursi

  // 2. Pinggul & Sabuk
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-3, -22, 8, 3);

  // 3. Badan & Kemeja Putih Seragam SMP (Tegak Duduk Rapi di Kursi)
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(-4, -36 + bob, 10, 16);
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(5, -36 + bob, 1, 16);

  // Dasi Biru SMP di Sisi Depan Dada (Kiri)
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(-4, -34 + bob, 2, 8);

  // 4. Lengan Kemeja & Tangan Maju ke Depan di Atas Permukaan Meja Menulis
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-11, -36 + bob, 8, 4);
  ctx.fillStyle = skin;
  ctx.fillRect(-15, -36 + bob, 5, 3); // Tangan bertumpu di permukaan meja (y: -36 = 324)
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(-17, -38 + bob, 2, 6); // Bolpoin biru menulis di buku

  // 5. Leher & Wajah Siswa (Menghadap Kiri Menatap Papan Tulis & Guru)
  ctx.fillStyle = skin;
  ctx.fillRect(-4, -42 + bob, 8, 6);
  // Mata Siswa Menyimak
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-3, -40 + bob, 2, 2);

  // 6. Rambut / Hijab Siswa
  ctx.fillStyle = hair;
  if (studentType === 'player' && avatarConfig?.hairStyle === 'hijab') {
    // Hijab rapi menutupi kepala dan leher saat duduk menyimak
    ctx.fillRect(-6, -49 + bob, 12, 13);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-4, -43 + bob, 6, 1); // Ciput putih
    ctx.fillStyle = skin;
    ctx.fillRect(-4, -42 + bob, 6, 4); // Wajah samping
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-3, -40 + bob, 2, 2); // Mata
    ctx.fillStyle = hair;
    ctx.fillRect(-5, -38 + bob, 8, 3); // Dagu & leher tertutup hijab
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-2, -37 + bob, 1.5, 1.5); // Bros emas
  } else {
    ctx.fillRect(-5, -48 + bob, 10, 6);
    ctx.fillRect(3, -46 + bob, 2, 6);
    if (studentType === 'siti') {
      ctx.fillRect(4, -46 + bob, 4, 5); // Kuncir rambut belakang
      ctx.fillStyle = '#c084fc';
      ctx.fillRect(4, -47 + bob, 2, 2);
    }
  }

  ctx.restore();
}

export function drawStudentCoverUnderDesk(
  ctx: CanvasRenderingContext2D,
  deskCenterX: number,
  y: number,
  studentType: string,
  avatarConfig?: CustomAvatarConfig,
  animTick = 0,
  isPanic = true
): void {
  ctx.save();
  const jitter = isPanic ? Math.sin(animTick * 0.8) * 1.5 : 0;
  ctx.translate(Math.round(deskCenterX + jitter), Math.round(y));

  const skin = avatarConfig?.skin === 'light' ? '#fed7aa' : '#f5af7e';
  const hair = studentType === 'player'
    ? (avatarConfig?.hairColor || '#1c1917')
    : studentType === 'siti'
      ? '#1e1b4b'
      : studentType === 'dito'
        ? '#312e81'
        : '#1c1917';

  // Warna Tas Ransel Sekolah (Backpack Shield)
  const bagColors: Record<string, { base: string; shadow: string; hi: string; stripe: string }> = {
    player: { base: '#1d4ed8', shadow: '#1e3a8a', hi: '#60a5fa', stripe: '#facc15' },
    siti: { base: '#7e22ce', shadow: '#581c87', hi: '#c084fc', stripe: '#f472b6' },
    dito: { base: '#c2410c', shadow: '#7c2d12', hi: '#fb923c', stripe: '#38bdf8' },
    rian: { base: '#0f766e', shadow: '#134e4a', hi: '#2dd4bf', stripe: '#facc15' },
  };
  const bag = bagColors[studentType] || bagColors.player;

  // ── POSE DROP, COVER, & HOLD ON DENGAN TAS DI ATAS KEPALA ──
  // Maksimum tinggi tubuh ~22px, sangat muat di kolong meja (tinggi meja 36px)

  // 1. Kaki bersimpuh / berjongkok rendah di lantai
  ctx.fillStyle = '#0f172a'; // Sepatu
  ctx.fillRect(-10, -4, 6, 4);
  ctx.fillRect(-4, -4, 6, 4);

  // 2. Celana Biru SMP (Berjongkok rendah merapat ke lantai)
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(-11, -9, 13, 6);

  // 3. Badan membungkuk rendah melindungi organ vital (Drop)
  ctx.fillStyle = '#f8fafc'; // Kemeja putih
  ctx.fillRect(-6, -15, 13, 7);
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(-6, -10, 13, 2);

  // 4. Kepala Merunduk Masuk ke Dalam (Berlindung di Bawah Tas)
  ctx.fillStyle = hair;
  ctx.fillRect(2, -17, 9, 6);
  ctx.fillStyle = skin;
  ctx.fillRect(5, -14, 6, 5);

  // 5. TAS RANSEL SEKOLAH DIDEPAP DI ATAS KEPALA & TENGKUK (BAG SHIELD)
  // Menutupi seluruh tempurung kepala dan tengkuk dari bahaya puing runtuh
  ctx.fillStyle = bag.shadow;
  ctx.fillRect(0, -23, 13, 8); // Bayangan & bodi bawah tas
  ctx.fillStyle = bag.base;
  ctx.fillRect(0, -24, 12, 7); // Bodi utama ransel empuk
  ctx.fillStyle = bag.hi;
  ctx.fillRect(1, -25, 9, 2);  // Kontur bantalan atas tas
  // Pita Garis Pengaman Reflektif (Safety Reflective Band)
  ctx.fillStyle = bag.stripe;
  ctx.fillRect(1, -21, 10, 2);
  // Handle / Gantungan Atas Tas Ransel
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(4, -26, 4, 2);

  // 6. Tangan & Lengan:
  // Lengan 1: Menekan Erat Tas Ransel di Atas Kepala
  ctx.fillStyle = '#f8fafc'; // Lengan kemeja putih
  ctx.fillRect(1, -21, 5, 4);
  ctx.fillStyle = skin;      // Telapak tangan memegang erat tali ransel di atas kepala
  ctx.fillRect(3, -24, 4, 3);

  // Lengan 2: Menggenggam Erat Kaki Meja Belajar (Hold On)
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(6, -12, 8, 3);
  ctx.fillStyle = skin;
  ctx.fillRect(12, -12, 4, 4); // Cengkeraman tangan di kaki meja

  // Keringat Panik / Shock
  if (isPanic && animTick % 20 < 10) {
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(12, -20, 2, 2);
  }

  ctx.restore();
}

// ── GURU BU RAHMA BERLINDUNG DI BAWAH MEJA GURU DENGAN MAP AGENDA DI KEPALA ──
export function drawTeacherCoverUnderDesk(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  animTick = 0
): void {
  ctx.save();
  const jitter = Math.sin(animTick * 0.75) * 1.5;
  ctx.translate(Math.round(x + jitter), Math.round(y));

  // Sepatu pantofel hitam di lantai
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-10, -4, 6, 4);
  ctx.fillRect(-4, -4, 6, 4);

  // Rok panjang khaki dilipat bersimpuh rendah di lantai
  ctx.fillStyle = '#78350f';
  ctx.fillRect(-12, -11, 16, 8);
  ctx.fillStyle = '#92400e';
  ctx.fillRect(-10, -7, 12, 2);

  // Blazer dinas khaki membungkuk rendah di kolong meja guru (Drop & Cover)
  ctx.fillStyle = '#d97706';
  ctx.fillRect(-6, -17, 14, 8);
  ctx.fillStyle = '#b45309';
  ctx.fillRect(-6, -12, 14, 2);

  // Kepala guru merunduk mendekap tengkuk
  ctx.fillStyle = '#451a03'; // Sanggul rambut
  ctx.fillRect(2, -18, 10, 6);
  ctx.fillStyle = '#fed7aa'; // Wajah
  ctx.fillRect(6, -14, 6, 4);

  // Kacamata guru
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(7, -14, 4, 2);

  // MAP AGENDA DOKUMEN / TAS KERJA TEBAL DI ATAS KEPALA BU RAHMA
  ctx.fillStyle = '#1e3a8a'; // Map arsip biru tua tebal
  ctx.fillRect(1, -24, 13, 6);
  ctx.fillStyle = '#f59e0b'; // Penjepit / clasp emas map agenda
  ctx.fillRect(5, -25, 4, 2);
  ctx.fillRect(1, -22, 13, 1);

  // Lengan blazer khaki mendekap erat map agenda di atas kepala
  ctx.fillStyle = '#d97706';
  ctx.fillRect(1, -21, 6, 4);
  ctx.fillStyle = '#fed7aa';
  ctx.fillRect(3, -24, 4, 3);

  // Lengan kedua memegang erat kaki meja guru (Hold On)
  ctx.fillStyle = '#d97706';
  ctx.fillRect(6, -13, 8, 3);
  ctx.fillStyle = '#fed7aa';
  ctx.fillRect(12, -13, 4, 4);

  ctx.restore();
}

// ── GURU BU RAHMA MEMIMPIN EVAKUASI KE LAPANGAN TERBUKA ──
export function drawTeacherEvacuatingPose(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  _animTick = 0,
  walkFrame = 0
): void {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));

  const bob = walkFrame % 2 === 1 ? -1 : 0;
  const legOffset = (walkFrame % 4 === 1 ? 3 : walkFrame % 4 === 3 ? -3 : 0);

  // 1. Sepatu Pantofel Hitam Berjalan
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-5 - legOffset, -4, 4, 4);
  ctx.fillRect(1 + legOffset, -4, 4, 4);

  // Rok Panjang Dinas Khaki
  ctx.fillStyle = '#78350f';
  ctx.fillRect(-6, -16, 12, 12);
  ctx.fillStyle = '#92400e';
  ctx.fillRect(-5, -16, 10, 2);

  // 2. Blazer Dinas Khaki
  ctx.fillStyle = '#d97706';
  ctx.fillRect(-7, -27 + bob, 14, 11);
  ctx.fillStyle = '#fde68a'; // Kerah kemeja putih dalam
  ctx.fillRect(-2, -27 + bob, 4, 5);

  // 3. Wajah & Sanggul Menghadap Kanan (Arah Jalur Keluar)
  ctx.fillStyle = '#fed7aa';
  ctx.fillRect(-4, -31 + bob, 8, 5);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(1, -30 + bob, 3, 2); // Kacamata
  ctx.fillStyle = '#451a03'; // Rambut & sanggul
  ctx.fillRect(-6, -35 + bob, 12, 5);
  ctx.fillRect(-4, -38 + bob, 6, 4);

  // 4. TANGAN MENGANGKAT BUKU AGENDA GURU SEBAGAI PELINDUNG KEPALA
  ctx.fillStyle = '#d97706';
  ctx.fillRect(-8, -28 + bob, 3, 7);
  ctx.fillStyle = '#fed7aa';
  ctx.fillRect(-8, -32 + bob, 3, 4);

  // Buku Agenda Guru Biru Tebal di Atas Kepala
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(-9, -39 + bob, 18, 6);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-8, -38 + bob, 16, 4);

  // Tangan Kanan Mengarahkan Murid Maju Cepat
  ctx.fillStyle = '#d97706';
  ctx.fillRect(5, -26 + bob, 6, 3);
  ctx.fillStyle = '#fed7aa';
  ctx.fillRect(10, -26 + bob, 4, 3);

  ctx.restore();
}

export function drawStudentEvacuatingPose(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  studentType: string,
  avatarConfig?: CustomAvatarConfig,
  _animTick = 0,
  walkFrame = 0
): void {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));

  const bob = walkFrame % 2 === 1 ? -1 : 0;
  const legOffset = (walkFrame % 4 === 1 ? 3 : walkFrame % 4 === 3 ? -3 : 0);
  const skin = avatarConfig?.skin === 'light' ? '#fed7aa' : '#f5af7e';
  const hair = studentType === 'player'
    ? (avatarConfig?.hairColor || '#1c1917')
    : studentType === 'siti'
      ? '#1e1b4b'
      : studentType === 'dito'
        ? '#312e81'
        : '#1c1917';

  // 1. Kaki Berjalan Cepat Tertib
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-5 - legOffset, -4, 4, 4);
  ctx.fillRect(1 + legOffset, -4, 4, 4);

  // Celana / Rok SMP
  ctx.fillStyle = '#1e3a8a';
  if (studentType === 'siti') {
    ctx.fillRect(-6, -14, 12, 10);
  } else {
    ctx.fillRect(-5 - legOffset, -14, 4, 10);
    ctx.fillRect(1 + legOffset, -14, 4, 10);
  }

  // 2. Kemeja Putih Seragam SMP
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(-6, -26 + bob, 12, 11);
  ctx.fillStyle = '#1e3a8a'; // Dasi
  ctx.fillRect(-1, -25 + bob, 2, 6);

  // 3. Wajah & Kepala Menghadap Kanan (Arah Jalur Keluar)
  ctx.fillStyle = skin;
  ctx.fillRect(-4, -30 + bob, 8, 5);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(1, -29 + bob, 2, 2); // Mata waspada
  ctx.fillStyle = hair;
  ctx.fillRect(-5, -34 + bob, 10, 5);

  // 4. KEDUA TANGAN MENGANGKAT TAS SEKOLAH / BUKU TEBAL DI ATAS KEPALA (PERLINDUNGAN PUING)
  // Lengan Terangkat ke Atas
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-8, -28 + bob, 3, 7);
  ctx.fillRect(5, -28 + bob, 3, 7);
  ctx.fillStyle = skin;
  ctx.fillRect(-8, -32 + bob, 3, 4);
  ctx.fillRect(5, -32 + bob, 3, 4);

  // Tas Ransel Sekolah Sebagai Pelindung Kepala (Shield Bag)
  ctx.fillStyle = '#0369a1'; // Tas Biru Navy
  ctx.fillRect(-9, -38 + bob, 18, 7);
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(-8, -37 + bob, 16, 5);
  // Strip Reflektor Kuning di Tas
  ctx.fillStyle = '#facc15';
  ctx.fillRect(-7, -35 + bob, 14, 2);

  ctx.restore();
}

export function drawPanicSpeechBubble(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  animTick = 0,
  staggerY = 0
): void {
  ctx.save();
  const shake = Math.sin(animTick * 0.6 + x) * 1.0;
  const bubbleY = y - 50 + staggerY + shake;

  ctx.font = "800 13px 'Plus Jakarta Sans', sans-serif";
  const textW = ctx.measureText(text).width;
  const padX = 9;
  const bw = Math.round(textW + padX * 2);
  const bh = 22;
  const bx = Math.round(x - bw / 2);

  // Kotak Bubble Retro Merah Peringatan (Jelas & Terbaca)
  ctx.fillStyle = '#fff5f5';
  ctx.fillRect(bx, Math.round(bubbleY), bw, bh);
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2.2;
  ctx.strokeRect(bx, Math.round(bubbleY), bw, bh);

  // Ekor Balon Kecil Mengarah ke Karakter
  ctx.fillStyle = '#fff5f5';
  ctx.beginPath();
  ctx.moveTo(x - 5, Math.round(bubbleY) + bh);
  ctx.lineTo(x, Math.round(bubbleY) + bh + 6);
  ctx.lineTo(x + 5, Math.round(bubbleY) + bh);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#ef4444';
  ctx.beginPath();
  ctx.moveTo(x - 5, Math.round(bubbleY) + bh);
  ctx.lineTo(x, Math.round(bubbleY) + bh + 6);
  ctx.lineTo(x + 5, Math.round(bubbleY) + bh);
  ctx.stroke();

  // Teks Teriakan Panik (Jelas & Kontras)
  ctx.fillStyle = '#991b1b';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, Math.round(bubbleY) + bh / 2 + 1);

  ctx.restore();
}

// ── KARAKTER TERTIMPA BATU BESAR (CUTSCENE GAGAL QTE / TELAT BERLINDUNG) ──
export function drawPlayerStunnedByRockImpact(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  avatarConfig?: CustomAvatarConfig,
  animTick = 0,
  timer = 0,
  hit = false,
  shards: { x: number; y: number; size: number; color: string }[] = []
): void {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));

  const skin = avatarConfig?.skin === 'light' ? '#fed7aa' : '#f5af7e';
  const hair = avatarConfig?.hairColor || '#1c1917';

  if (!hit) {
    // ── FASE SEBELUM TERKENA BATU: BERDIRI PANIK MELIHAT KE ATAS ──
    // Sepatu
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-6, -4, 5, 4);
    ctx.fillRect(1, -4, 5, 4);

    // Celana Biru SMP
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(-6, -14, 12, 10);

    // Baju Putih SMP
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-7, -26, 14, 12);
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(-1, -25, 2, 8); // Dasi biru

    // Kepala Menghadap ke Atas (Melihat plafon runtuh)
    ctx.fillStyle = hair;
    ctx.fillRect(-6, -34, 12, 8);
    ctx.fillStyle = skin;
    ctx.fillRect(-5, -31, 10, 6);

    // Mata Kaget & Mulut Terbuka
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-3, -30, 2, 2);
    ctx.fillRect(1, -30, 2, 2);
    ctx.fillRect(-2, -26, 4, 2);

    // Tangan Panik Terangkat Melindungi Kepala
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-9, -32, 3, 10);
    ctx.fillRect(6, -32, 3, 10);
    ctx.fillStyle = skin;
    ctx.fillRect(-9, -35, 3, 4);
    ctx.fillRect(6, -35, 3, 4);

    // Tanda Seru Retro di Atas Kepala
    if (animTick % 10 < 7) {
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-2, -45, 4, 7);
      ctx.fillRect(-2, -36, 4, 3);
    }
  } else {
    // ── FASE SETELAH TERHANTAM BATU BESAR: TERSUNGKUR LEMAS & PUSING BERPUTAR ──
    const slumpJitter = Math.sin(animTick * 0.4) * 0.8;

    // Sepatu rebah di lantai
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-12, -4, 6, 4);
    ctx.fillRect(-5, -4, 6, 4);

    // Celana biru tertekuk di lantai
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(-12, -10, 14, 6);

    // Tubuh kemeja putih tersungkur membungkuk ke meja
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(-6, -17 + slumpJitter, 14, 8);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-6, -18 + slumpJitter, 13, 7);

    // Kepala tertunduk lemas
    ctx.fillStyle = hair;
    ctx.fillRect(2, -19 + slumpJitter, 10, 7);
    ctx.fillStyle = skin;
    ctx.fillRect(5, -15 + slumpJitter, 6, 5);

    // Mata Pusing Kartun (Silang Dazed 'x')
    ctx.fillStyle = '#475569';
    ctx.fillRect(6, -14 + slumpJitter, 1, 1);
    ctx.fillRect(8, -14 + slumpJitter, 1, 1);
    ctx.fillRect(7, -13 + slumpJitter, 1, 1);
    ctx.fillRect(6, -12 + slumpJitter, 1, 1);
    ctx.fillRect(8, -12 + slumpJitter, 1, 1);

    // Benjolan Komik / Hurt Bump Merah di Kepala
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(3, -23 + slumpJitter, 4, 4);
    ctx.fillStyle = '#fca5a5';
    ctx.fillRect(4, -22 + slumpJitter, 2, 2);

    // Tetesan Keringat Pusing
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(11, -16 + slumpJitter, 2, 3);

    // ── 3 BINTANG KUNING PUSING BERPUTAR MENGELILINGI KEPALA (★ ★ ★) ──
    for (let i = 0; i < 3; i++) {
      const angle = (timer * 0.12) + (i * (Math.PI * 2 / 3));
      const starRadiusX = 14;
      const starRadiusY = 5;
      const sx = 7 + Math.cos(angle) * starRadiusX;
      const sy = -26 + slumpJitter + Math.sin(angle) * starRadiusY;

      // Bentuk Bintang Pixel 2D Kuning Terang
      ctx.fillStyle = '#facc15';
      ctx.fillRect(Math.round(sx) - 1, Math.round(sy) - 2, 3, 5);
      ctx.fillRect(Math.round(sx) - 2, Math.round(sy) - 1, 5, 3);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(Math.round(sx), Math.round(sy), 1, 1);
    }
  }

  ctx.restore();

  // Render serpihan batu yang terlempar di sekitar karakter
  if (shards && shards.length > 0) {
    for (const sh of shards) {
      ctx.save();
      ctx.fillStyle = sh.color || '#64748b';
      ctx.fillRect(Math.round(sh.x - sh.size / 2), Math.round(sh.y - sh.size / 2), sh.size, sh.size);
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.fillRect(Math.round(sh.x - sh.size / 2), Math.round(sh.y - sh.size / 2), sh.size, 1);
      ctx.restore();
    }
  }
}

