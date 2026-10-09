// ── src/app/Level1/EarthDive/engine/npcSprites.ts ─────────────────────────────
// Generator Sprite & Potret Karakter 2D Pixel Art Prosedural untuk NPC, Pemain, dan Maskot Resqy.
// 100% Menggunakan Pixel Art Murni tanpa Gambar Eksternal / Tanpa Emoji OS.


// ══════════════════════════════════════════════════════════════════════════
// 1. MENGGAMBAR NPC DI DALAM DUNIA GAME (CANVAS WORLD)
// ══════════════════════════════════════════════════════════════════════════
export type NpcWorldType =
  | 'zidane'
  | 'zahra'
  | 'ican'
  | 'lintang'
  | 'bu_tyas'
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

  if (type === 'zidane') {
    // ── ZIDANE (KETUA & DEV UTAMA: KULIT PUTIH, RAMBUT BERANTAKAN, KACAMATA, BAJU HITAM, COOL) ──
    const drawX = -12;
    const drawY = -32 + breathY;
    const isMining = zoneId === 'crust';
    const isHazard = zoneId === 'mantle' || zoneId === 'outerCore' || zoneId === 'innerCore';
    const isScuba = zoneId === 'divergent';

    if (isScuba) {
      // Kostum Penyelam Scuba Scuba Diver Zidane
      ctx.fillStyle = '#09090b';
      ctx.fillRect(drawX + 6, drawY + 26, 5, 5);
      ctx.fillRect(drawX + 13, drawY + 26, 5, 5);
      ctx.fillStyle = '#06b6d4'; // Fin sepatu katak cyan
      ctx.fillRect(drawX + 4, drawY + 29, 7, 2);
      ctx.fillRect(drawX + 13, drawY + 29, 7, 2);

      // Wetsuit Neoprene Hitam Cool
      ctx.fillStyle = '#09090b';
      ctx.fillRect(drawX + 6, drawY + 10, 12, 17);
      ctx.fillStyle = '#0284c7'; // Garis aksen cyan
      ctx.fillRect(drawX + 10, drawY + 11, 4, 15);

      // Tabung Oksigen Kembar Kuning di Punggung
      ctx.fillStyle = '#eab308';
      ctx.fillRect(drawX + 2, drawY + 9, 4, 11);
      ctx.fillStyle = '#fde047';
      ctx.fillRect(drawX + 3, drawY + 10, 2, 9);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(drawX + 3, drawY + 7, 2, 2);

      // Masker Kacamata Selam Panorama & Rambut Hitam Berantakan
      ctx.fillStyle = '#09090b';
      ctx.fillRect(drawX + 5, drawY - 1, 14, 11);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(drawX + 9, drawY + 2, 7, 6);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(drawX + 10, drawY + 3, 5, 4);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(drawX + 10, drawY + 3, 2, 1);
      // Rambut berantakan di atas hood
      ctx.fillStyle = '#18181b';
      ctx.fillRect(drawX + 6, drawY - 4, 11, 4);
      ctx.fillRect(drawX + 4, drawY - 2, 3, 3);
      ctx.fillRect(drawX + 15, drawY - 3, 3, 3);
    } else if (isMining) {
      // ── KOSTUM TAMBANG: ROMPI SAFETY & HELM SENTER ──
      // Sepatu tambang
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
      ctx.fillRect(drawX + 13, drawY + 26, 5, 6);
      // Celana kerja tambang abu gelap
      ctx.fillStyle = '#334155';
      ctx.fillRect(drawX + 6, drawY + 19, 12, 8);
      ctx.fillStyle = '#fde047'; // Pita reflektor celana
      ctx.fillRect(drawX + 6, drawY + 23, 12, 1);

      // Kaos hitam Zidane di dalam rompi tambang
      ctx.fillStyle = '#09090b';
      ctx.fillRect(drawX + 6, drawY + 10, 12, 10);
      // Rompi oranye tambang
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(drawX + 5, drawY + 10, 4, 10);
      ctx.fillRect(drawX + 15, drawY + 10, 4, 10);
      ctx.fillStyle = '#cbd5e1'; // Reflektor silver
      ctx.fillRect(drawX + 5, drawY + 14, 14, 2);

      // Tangan putih
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(drawX + 4, drawY + 18, 2, 3);
      ctx.fillRect(drawX + 18, drawY + 18, 2, 3);

      // Wajah putih & kacamata hitam cool
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(drawX + 6, drawY + 2, 12, 7);
      ctx.fillStyle = '#09090b';
      ctx.fillRect(drawX + 8, drawY + 4, 4, 3);
      ctx.fillRect(drawX + 13, drawY + 4, 4, 3);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(drawX + 9, drawY + 5, 2, 1);
      ctx.fillRect(drawX + 14, drawY + 5, 2, 1);

      // Helm tambang kuning dengan senter kepala
      ctx.fillStyle = '#eab308';
      ctx.fillRect(drawX + 4, drawY - 4, 16, 6);
      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(drawX + 3, drawY + 1, 18, 2);
      // Senter kepala & pancaran cahaya
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(drawX + 10, drawY - 3, 4, 3);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(drawX + 11, drawY - 2, 2, 2);

      // Rambut hitam berantakan menyembul di sisi helm
      ctx.fillStyle = '#18181b';
      ctx.fillRect(drawX + 4, drawY + 2, 2, 3);
      ctx.fillRect(drawX + 17, drawY + 2, 2, 3);
      ctx.fillRect(drawX + 6, drawY + 1, 3, 2);
    } else if (isHazard) {
      // ── KOSTUM PELINDUNG BERTEKNOLOGI TINGGI (CRYO HAZARD SUIT) ──
      // Sepatu pelindung termal
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
      ctx.fillRect(drawX + 13, drawY + 26, 5, 6);
      ctx.fillStyle = '#06b6d4'; // Sol bercahaya cyan
      ctx.fillRect(drawX + 6, drawY + 30, 5, 2);
      ctx.fillRect(drawX + 13, drawY + 30, 5, 2);

      // Baju pelindung putih-perak tahan panas ekstrem
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(drawX + 6, drawY + 10, 12, 17);
      ctx.fillStyle = '#06b6d4'; // Pipa pendingin cair cyan
      ctx.fillRect(drawX + 7, drawY + 12, 2, 14);
      ctx.fillRect(drawX + 15, drawY + 12, 2, 14);
      ctx.fillStyle = '#09090b'; // Core dada
      ctx.fillRect(drawX + 10, drawY + 12, 4, 5);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(drawX + 11, drawY + 13, 2, 3);

      // Tabung pendingin termal di punggung
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(drawX + 2, drawY + 9, 4, 11);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(drawX + 3, drawY + 10, 2, 9);

      // Helm pelindung berteknologi tinggi dengan visor transparan cyan
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(drawX + 4, drawY - 4, 16, 14);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(drawX + 6, drawY + 1, 12, 8);
      // Kacamata & rambut Zidane terlihat di balik visor
      ctx.fillStyle = '#00f5ff';
      ctx.fillRect(drawX + 7, drawY + 2, 10, 6);
      ctx.fillStyle = '#09090b';
      ctx.fillRect(drawX + 8, drawY + 3, 3, 2);
      ctx.fillRect(drawX + 13, drawY + 3, 3, 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(drawX + 8, drawY + 3, 1, 1);
    } else {
      // 1. Sepatu Kets Sneakers Hitam-Putih
      ctx.fillStyle = '#09090b';
      if (walkStep === 0) {
        ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
        ctx.fillRect(drawX + 13, drawY + 26, 5, 6);
        ctx.fillStyle = '#ffffff'; // Sol putih
        ctx.fillRect(drawX + 6, drawY + 30, 5, 2);
        ctx.fillRect(drawX + 13, drawY + 30, 5, 2);
      } else {
        ctx.fillRect(drawX + 4, drawY + 25, 5, 7);
        ctx.fillRect(drawX + 15, drawY + 27, 5, 5);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(drawX + 4, drawY + 30, 5, 2);
        ctx.fillRect(drawX + 15, drawY + 30, 5, 2);
      }

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
      // Kerah / Resleting halus
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
      ctx.fillRect(drawX + 11, drawY + 4, 3, 1); // Bridge
      // Lensa & pantulan cahaya
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(drawX + 9, drawY + 4, 2, 1);
      ctx.fillRect(drawX + 14, drawY + 4, 2, 1);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(drawX + 9, drawY + 3, 1, 1);
      ctx.fillRect(drawX + 14, drawY + 3, 1, 1);

      // 6. Rambut Hitam Agak Berantakan (Messy Cool Hair)
      ctx.fillStyle = '#18181b';
      ctx.fillRect(drawX + 5, drawY - 4, 14, 5);
      ctx.fillRect(drawX + 4, drawY - 2, 3, 4); // Cambang
      ctx.fillRect(drawX + 17, drawY - 2, 2, 4);
      // Tuft rambut berantakan
      ctx.fillRect(drawX + 7, drawY - 6, 4, 3);
      ctx.fillRect(drawX + 13, drawY - 5, 4, 2);
      ctx.fillRect(drawX + 9, drawY - 1, 5, 2); // Poni depan
    }
  } else if (type === 'zahra') {
    // ── ZAHRA (CANTIK, IMUT, GEMESIN, KACAMATA, KERUDUNG BIRU, BAJU PINK, CERIA) ──
    const drawX = -12;
    const drawY = -32 + breathY;
    const isMining = zoneId === 'crust';
    const isHazard = zoneId === 'mantle' || zoneId === 'outerCore' || zoneId === 'innerCore';
    const isScuba = zoneId === 'divergent';

    if (isScuba) {
      // Kostum Selam Scuba Zahra (Pink & Biru)
      ctx.fillStyle = '#0284c7'; // Fins biru
      ctx.fillRect(drawX + 4, drawY + 29, 7, 2);
      ctx.fillRect(drawX + 13, drawY + 29, 7, 2);

      // Wetsuit Pink Manis
      ctx.fillStyle = '#ec4899';
      ctx.fillRect(drawX + 6, drawY + 10, 12, 17);
      ctx.fillStyle = '#f472b6';
      ctx.fillRect(drawX + 7, drawY + 11, 10, 15);

      // Tabung Oksigen Penyelam
      ctx.fillStyle = '#eab308';
      ctx.fillRect(drawX + 2, drawY + 9, 4, 11);
      ctx.fillStyle = '#fde047';
      ctx.fillRect(drawX + 3, drawY + 10, 2, 9);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(drawX + 3, drawY + 7, 2, 2);

      // Kerudung Selam Biru Langit & Masker
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(drawX + 5, drawY - 2, 14, 13);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(drawX + 9, drawY + 2, 7, 6);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(drawX + 10, drawY + 3, 2, 1);
    } else if (isMining) {
      // ── KOSTUM TAMBANG ZAHRA: ROMPI SAFETY DI ATAS BAJU PINK & HELM SENTER DI ATAS KERUDUNG BIRU ──
      ctx.fillStyle = '#be185d';
      ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
      ctx.fillRect(drawX + 13, drawY + 26, 5, 6);

      // Rok/celana navy
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(drawX + 6, drawY + 19, 12, 8);
      ctx.fillStyle = '#fde047';
      ctx.fillRect(drawX + 6, drawY + 23, 12, 1);

      // Baju pink dengan rompi tambang oranye
      ctx.fillStyle = '#ec4899';
      ctx.fillRect(drawX + 6, drawY + 10, 12, 10);
      ctx.fillStyle = '#ea580c'; // Rompi
      ctx.fillRect(drawX + 5, drawY + 10, 4, 10);
      ctx.fillRect(drawX + 15, drawY + 10, 4, 10);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(drawX + 5, drawY + 14, 14, 2);

      // Kerudung biru cerah & Wajah imut
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(drawX + 5, drawY - 1, 14, 11);
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(drawX + 7, drawY + 3, 10, 6);

      // Kacamata bulat emas & senyum
      ctx.fillStyle = '#d97706';
      ctx.fillRect(drawX + 8, drawY + 4, 4, 3);
      ctx.fillRect(drawX + 13, drawY + 4, 4, 3);
      ctx.fillStyle = '#e11d48';
      ctx.fillRect(drawX + 11, drawY + 7, 3, 1);

      // Helm tambang kuning di atas kerudung biru
      ctx.fillStyle = '#eab308';
      ctx.fillRect(drawX + 4, drawY - 4, 16, 6);
      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(drawX + 3, drawY + 1, 18, 2);
      ctx.fillStyle = '#ffffff'; // Senter helm
      ctx.fillRect(drawX + 11, drawY - 2, 2, 2);
    } else if (isHazard) {
      // ── CRYO HAZARD SUIT ZAHRA (PUTIH-PINK DENGAN KERUDUNG BIRU PELINDUNG) ──
      ctx.fillStyle = '#831843';
      ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
      ctx.fillRect(drawX + 13, drawY + 26, 5, 6);
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(drawX + 6, drawY + 30, 5, 2);
      ctx.fillRect(drawX + 13, drawY + 30, 5, 2);

      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(drawX + 6, drawY + 10, 12, 17);
      ctx.fillStyle = '#ec4899'; // Garis pink
      ctx.fillRect(drawX + 7, drawY + 11, 10, 15);
      ctx.fillStyle = '#00f5ff'; // Pendingin
      ctx.fillRect(drawX + 10, drawY + 12, 4, 4);

      // Tabung pendingin
      ctx.fillStyle = '#eab308';
      ctx.fillRect(drawX + 2, drawY + 9, 4, 11);

      // Helm berkerudung biru termal dengan visor
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(drawX + 4, drawY - 4, 16, 14);
      ctx.fillStyle = '#00f5ff';
      ctx.fillRect(drawX + 7, drawY + 2, 10, 6);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(drawX + 8, drawY + 3, 2, 1);
    } else {
      // 1. Sepatu Imut Pink Tua
      ctx.fillStyle = '#be185d';
      if (walkStep === 0) {
        ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
        ctx.fillRect(drawX + 13, drawY + 26, 5, 6);
      } else {
        ctx.fillRect(drawX + 4, drawY + 25, 5, 7);
        ctx.fillRect(drawX + 15, drawY + 27, 5, 5);
      }

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
      ctx.fillStyle = '#fed7aa'; // Kulit manis
      ctx.fillRect(drawX + 4, drawY + 18, 2, 3);
      ctx.fillRect(drawX + 18, drawY + 18, 2, 3);

      // 4. Kerudung Biru Cerah (Sky Blue Hijab)
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(drawX + 4, drawY - 3, 16, 14);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(drawX + 5, drawY - 2, 14, 6); // Lipatan atas
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
    }
  } else if (type === 'ican') {
    // ── ICAN (RAMBUT IKAL, SIFAT AGAK NGESELIN / USIL, CASUAL SPORTY) ──
    const drawX = -12;
    const drawY = -32 + breathY;
    const isMining = zoneId === 'crust';
    const isHazard = zoneId === 'mantle' || zoneId === 'outerCore' || zoneId === 'innerCore';
    const isScuba = zoneId === 'divergent';

    if (isScuba) {
      // Kostum Selam Scuba Ican
      ctx.fillStyle = '#ea580c'; // Fin oranye
      ctx.fillRect(drawX + 4, drawY + 29, 7, 2);
      ctx.fillRect(drawX + 13, drawY + 29, 7, 2);

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(drawX + 6, drawY + 10, 12, 17);
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(drawX + 8, drawY + 11, 8, 15);

      ctx.fillStyle = '#eab308';
      ctx.fillRect(drawX + 2, drawY + 9, 4, 11);
      ctx.fillStyle = '#fde047';
      ctx.fillRect(drawX + 3, drawY + 10, 2, 9);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(drawX + 3, drawY + 7, 2, 2);

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(drawX + 5, drawY - 1, 14, 11);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(drawX + 9, drawY + 2, 7, 6);
      ctx.fillStyle = '#27272a';
      ctx.fillRect(drawX + 6, drawY - 4, 12, 4);
    } else if (isMining) {
      // ── KOSTUM TAMBANG ICAN: ROMPI ORANYE & HELM TAMBANG DENGAN RAMBUT IKAL MENYEMBUL ──
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
      ctx.fillRect(drawX + 13, drawY + 26, 5, 6);

      ctx.fillStyle = '#1d4ed8'; // Jeans
      ctx.fillRect(drawX + 6, drawY + 19, 12, 8);
      ctx.fillStyle = '#fde047';
      ctx.fillRect(drawX + 6, drawY + 23, 12, 1);

      ctx.fillStyle = '#ea580c'; // Rompi tambang
      ctx.fillRect(drawX + 6, drawY + 10, 12, 10);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(drawX + 6, drawY + 14, 12, 2);

      // Wajah & smirk usil
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(drawX + 6, drawY + 3, 12, 7);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(drawX + 8, drawY + 5, 3, 2);
      ctx.fillRect(drawX + 14, drawY + 5, 3, 2);
      ctx.fillStyle = '#7c2d12';
      ctx.fillRect(drawX + 12, drawY + 8, 3, 1);

      // Helm tambang miring & rambut ikal keluar di bawah helm
      ctx.fillStyle = '#eab308';
      ctx.fillRect(drawX + 4, drawY - 4, 16, 6);
      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(drawX + 3, drawY + 1, 18, 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(drawX + 11, drawY - 2, 2, 2);
      // Ikal rambut Ican menyembul di samping
      ctx.fillStyle = '#18181b';
      ctx.fillRect(drawX + 3, drawY + 1, 3, 4);
      ctx.fillRect(drawX + 17, drawY + 1, 3, 4);
    } else if (isHazard) {
      // ── CRYO HAZARD SUIT ICAN (ORANYE & PERAK TEKNO) ──
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
      ctx.fillRect(drawX + 13, drawY + 26, 5, 6);
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(drawX + 6, drawY + 30, 5, 2);
      ctx.fillRect(drawX + 13, drawY + 30, 5, 2);

      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(drawX + 6, drawY + 10, 12, 17);
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(drawX + 8, drawY + 11, 8, 15);
      ctx.fillStyle = '#00f5ff';
      ctx.fillRect(drawX + 10, drawY + 12, 4, 4);

      ctx.fillStyle = '#ea580c';
      ctx.fillRect(drawX + 2, drawY + 9, 4, 11);

      ctx.fillStyle = '#334155';
      ctx.fillRect(drawX + 4, drawY - 4, 16, 14);
      ctx.fillStyle = '#00f5ff';
      ctx.fillRect(drawX + 7, drawY + 2, 10, 6);
      // Ikal terlihat di luar helm
      ctx.fillStyle = '#18181b';
      ctx.fillRect(drawX + 3, drawY - 2, 3, 3);
      ctx.fillRect(drawX + 17, drawY - 2, 3, 3);
    } else {
      // 1. Sepatu Sneakers Sporty
      ctx.fillStyle = '#334155';
      if (walkStep === 0) {
        ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
        ctx.fillRect(drawX + 13, drawY + 26, 5, 6);
      } else {
        ctx.fillRect(drawX + 4, drawY + 25, 5, 7);
        ctx.fillRect(drawX + 15, drawY + 27, 5, 5);
      }

      // 2. Celana Jeans Denim
      ctx.fillStyle = '#1d4ed8';
      ctx.fillRect(drawX + 6, drawY + 19, 12, 8);
      ctx.fillStyle = '#1e40af';
      ctx.fillRect(drawX + 11, drawY + 19, 2, 8);

      // 3. Kaos Sporty Oranye-Abu (Hardware Tech Casual)
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(drawX + 6, drawY + 10, 12, 10);
      ctx.fillStyle = '#fb923c';
      ctx.fillRect(drawX + 8, drawY + 11, 8, 8);

      // Lengan & Tangan Sawo Matang
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(drawX + 4, drawY + 11, 2, 7);
      ctx.fillRect(drawX + 18, drawY + 11, 2, 7);
      ctx.fillStyle = '#f59e0b'; // Kulit sawo matang / natural
      ctx.fillRect(drawX + 4, drawY + 18, 2, 3);
      ctx.fillRect(drawX + 18, drawY + 18, 2, 3);

      // 4. Wajah & Ekspresi Smirk Usil
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(drawX + 6, drawY + 2, 12, 8);

      // Mata santai usil
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(drawX + 8, drawY + 4, 3, 2);
      ctx.fillRect(drawX + 14, drawY + 4, 3, 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(drawX + 9, drawY + 4, 1, 1);
      ctx.fillRect(drawX + 15, drawY + 4, 1, 1);

      // Senyum miring usil (smirk)
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
    }
  } else if (type === 'lintang') {
    // ── LINTANG (KERUDUNG HIJAU, PINTAR, ANALITIS, RUNTUT) ──
    const drawX = -12;
    const drawY = -32 + breathY;
    const isMining = zoneId === 'crust';
    const isHazard = zoneId === 'mantle' || zoneId === 'outerCore' || zoneId === 'innerCore';
    const isScuba = zoneId === 'divergent';

    if (isScuba) {
      // Kostum Selam Lintang (Hijau Zamrud & Emerald)
      ctx.fillStyle = '#16a34a'; // Fins hijau
      ctx.fillRect(drawX + 4, drawY + 29, 7, 2);
      ctx.fillRect(drawX + 13, drawY + 29, 7, 2);

      ctx.fillStyle = '#15803d';
      ctx.fillRect(drawX + 6, drawY + 10, 12, 17);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(drawX + 8, drawY + 11, 8, 15);

      ctx.fillStyle = '#eab308';
      ctx.fillRect(drawX + 2, drawY + 9, 4, 11);
      ctx.fillStyle = '#fde047';
      ctx.fillRect(drawX + 3, drawY + 10, 2, 9);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(drawX + 3, drawY + 7, 2, 2);

      ctx.fillStyle = '#166534';
      ctx.fillRect(drawX + 5, drawY - 2, 14, 13);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(drawX + 9, drawY + 2, 7, 6);
    } else if (isMining) {
      // ── KOSTUM TAMBANG LINTANG: ROMPI SAFETY & TABLET GEOLOGI & HELM DI ATAS KERUDUNG HIJAU ──
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
      ctx.fillRect(drawX + 13, drawY + 26, 5, 6);

      ctx.fillStyle = '#334155';
      ctx.fillRect(drawX + 6, drawY + 19, 12, 8);
      ctx.fillStyle = '#fde047';
      ctx.fillRect(drawX + 6, drawY + 23, 12, 1);

      ctx.fillStyle = '#0d9488'; // Blus toska
      ctx.fillRect(drawX + 6, drawY + 10, 12, 10);
      ctx.fillStyle = '#ea580c'; // Rompi
      ctx.fillRect(drawX + 5, drawY + 10, 4, 10);
      ctx.fillRect(drawX + 15, drawY + 10, 4, 10);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(drawX + 5, drawY + 14, 14, 2);

      // Tablet geologis di tangan
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(drawX + 16, drawY + 15, 5, 6);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(drawX + 17, drawY + 16, 3, 4);

      // Kerudung hijau zamrud di bawah helm
      ctx.fillStyle = '#15803d';
      ctx.fillRect(drawX + 5, drawY - 1, 14, 11);
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(drawX + 7, drawY + 3, 10, 6);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(drawX + 9, drawY + 4, 2, 2);
      ctx.fillRect(drawX + 14, drawY + 4, 2, 2);

      // Helm tambang kuning
      ctx.fillStyle = '#eab308';
      ctx.fillRect(drawX + 4, drawY - 4, 16, 6);
      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(drawX + 3, drawY + 1, 18, 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(drawX + 11, drawY - 2, 2, 2);
    } else if (isHazard) {
      // ── CRYO HAZARD SUIT LINTANG (HIJAU EMERALD & PERAK) ──
      ctx.fillStyle = '#064e3b';
      ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
      ctx.fillRect(drawX + 13, drawY + 26, 5, 6);
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(drawX + 6, drawY + 30, 5, 2);
      ctx.fillRect(drawX + 13, drawY + 30, 5, 2);

      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(drawX + 6, drawY + 10, 12, 17);
      ctx.fillStyle = '#15803d';
      ctx.fillRect(drawX + 8, drawY + 11, 8, 15);
      ctx.fillStyle = '#00f5ff';
      ctx.fillRect(drawX + 10, drawY + 12, 4, 4);

      ctx.fillStyle = '#16a34a';
      ctx.fillRect(drawX + 2, drawY + 9, 4, 11);

      ctx.fillStyle = '#15803d';
      ctx.fillRect(drawX + 4, drawY - 4, 16, 14);
      ctx.fillStyle = '#00f5ff';
      ctx.fillRect(drawX + 7, drawY + 2, 10, 6);
    } else {
      // 1. Sepatu Formal Anggun
      ctx.fillStyle = '#1e293b';
      if (walkStep === 0) {
        ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
        ctx.fillRect(drawX + 13, drawY + 26, 5, 6);
      } else {
        ctx.fillRect(drawX + 4, drawY + 25, 5, 7);
        ctx.fillRect(drawX + 15, drawY + 27, 5, 5);
      }

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
      // Buku catatan IPA kecil di tangan
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

      // Mata jernih pintar
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(drawX + 9, drawY + 3, 2, 2);
      ctx.fillRect(drawX + 14, drawY + 3, 2, 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(drawX + 9, drawY + 3, 1, 1);
      ctx.fillRect(drawX + 14, drawY + 3, 1, 1);

      // Senyum ramah
      ctx.fillStyle = '#991b1b';
      ctx.fillRect(drawX + 10, drawY + 6, 3, 1);
    }
  } else if (type === 'bu_tyas') {
    // ── BU TYAS (DOSEN PEMBIMBING: KACAMATA, KERUDUNG HITAM, AKADEMISI, BIJAKSANA & EVALUATOR) ──
    const drawX = -12;
    const drawY = -32 + breathY;
    const isMining = zoneId === 'crust';
    const isHazard = zoneId === 'mantle' || zoneId === 'outerCore' || zoneId === 'innerCore';
    const isScuba = zoneId === 'divergent';

    if (isScuba) {
      // Kostum Selam Bu Tyas
      ctx.fillStyle = '#09090b';
      ctx.fillRect(drawX + 4, drawY + 29, 7, 2);
      ctx.fillRect(drawX + 13, drawY + 29, 7, 2);

      ctx.fillStyle = '#09090b';
      ctx.fillRect(drawX + 6, drawY + 10, 12, 17);
      ctx.fillStyle = '#eab308'; // Strip emas dosen
      ctx.fillRect(drawX + 11, drawY + 11, 2, 15);

      ctx.fillStyle = '#eab308';
      ctx.fillRect(drawX + 2, drawY + 9, 4, 11);
      ctx.fillStyle = '#fde047';
      ctx.fillRect(drawX + 3, drawY + 10, 2, 9);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(drawX + 3, drawY + 7, 2, 2);

      ctx.fillStyle = '#09090b';
      ctx.fillRect(drawX + 5, drawY - 2, 14, 13);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(drawX + 9, drawY + 2, 7, 6);
    } else if (isMining) {
      // ── KOSTUM TAMBANG BU TYAS (INSPEKTUR/KETUA PEMBIMBING: HELM PUTIH PENGAWAS & CLIPBOARD EVALUASI) ──
      ctx.fillStyle = '#09090b';
      ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
      ctx.fillRect(drawX + 13, drawY + 26, 5, 6);

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(drawX + 6, drawY + 19, 12, 8);
      ctx.fillStyle = '#fde047';
      ctx.fillRect(drawX + 6, drawY + 23, 12, 1);

      ctx.fillStyle = '#881337'; // Kemeja maroon dosen
      ctx.fillRect(drawX + 6, drawY + 10, 12, 10);
      ctx.fillStyle = '#ea580c'; // Rompi pengawas tambang
      ctx.fillRect(drawX + 5, drawY + 10, 4, 10);
      ctx.fillRect(drawX + 15, drawY + 10, 4, 10);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(drawX + 5, drawY + 14, 14, 2);

      // Map berkas evaluasi Wordle di tangan
      ctx.fillStyle = '#b45309';
      ctx.fillRect(drawX + 16, drawY + 15, 5, 6);
      ctx.fillStyle = '#fde68a';
      ctx.fillRect(drawX + 17, drawY + 16, 3, 4);

      // Kerudung hitam anggun & kacamata emas
      ctx.fillStyle = '#09090b';
      ctx.fillRect(drawX + 5, drawY - 1, 14, 11);
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(drawX + 7, drawY + 3, 10, 6);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(drawX + 8, drawY + 4, 4, 3);
      ctx.fillRect(drawX + 13, drawY + 4, 4, 3);

      // Helm tambang putih pengawas ekspedisi (supervisor white hardhat)
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(drawX + 4, drawY - 4, 16, 6);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(drawX + 3, drawY + 1, 18, 2);
      ctx.fillStyle = '#facc15'; // Lambang lencana pengawas emas
      ctx.fillRect(drawX + 11, drawY - 2, 2, 2);
    } else if (isHazard) {
      // ── CRYO HAZARD SUIT BU TYAS (DOSEN PEMBIMBING LEVEL KOMANDO: PUTIH-MAROON & GOLD) ──
      ctx.fillStyle = '#09090b';
      ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
      ctx.fillRect(drawX + 13, drawY + 26, 5, 6);
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(drawX + 6, drawY + 30, 5, 2);
      ctx.fillRect(drawX + 13, drawY + 30, 5, 2);

      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(drawX + 6, drawY + 10, 12, 17);
      ctx.fillStyle = '#881337'; // Aksen maroon komando
      ctx.fillRect(drawX + 8, drawY + 11, 8, 15);
      ctx.fillStyle = '#facc15'; // Pin emas
      ctx.fillRect(drawX + 11, drawY + 13, 2, 2);

      // Map evaluasi digital
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(drawX + 16, drawY + 15, 5, 6);

      // Tabung pendingin ganda
      ctx.fillStyle = '#eab308';
      ctx.fillRect(drawX + 2, drawY + 9, 4, 11);

      // Helm pelindung berkerudung hitam dengan visor emas-cyan
      ctx.fillStyle = '#09090b';
      ctx.fillRect(drawX + 4, drawY - 4, 16, 14);
      ctx.fillStyle = '#00f5ff';
      ctx.fillRect(drawX + 7, drawY + 2, 10, 6);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(drawX + 8, drawY + 3, 2, 1);
    } else {
      // 1. Sepatu Pantofel Formal Hitam
      ctx.fillStyle = '#09090b';
      if (walkStep === 0) {
        ctx.fillRect(drawX + 6, drawY + 26, 5, 6);
        ctx.fillRect(drawX + 13, drawY + 26, 5, 6);
      } else {
        ctx.fillRect(drawX + 4, drawY + 25, 5, 7);
        ctx.fillRect(drawX + 15, drawY + 27, 5, 5);
      }

      // 2. Rok Panjang Formal Hitam / Maroon
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(drawX + 6, drawY + 18, 12, 9);

      // 3. Blazer Formal Dosen Maroon / Navy Berwibawa
      ctx.fillStyle = '#881337'; // Maroon tua elegan
      ctx.fillRect(drawX + 6, drawY + 9, 12, 11);
      ctx.fillStyle = '#9f1239';
      ctx.fillRect(drawX + 7, drawY + 10, 10, 9);
      // Kemeja dalam putih & Pin Dosen Emas di dada
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(drawX + 11, drawY + 9, 2, 5);
      ctx.fillStyle = '#facc15'; // Pin Emas
      ctx.fillRect(drawX + 8, drawY + 11, 2, 2);

      // Lengan Blazer & Map Berkas Evaluasi
      ctx.fillStyle = '#881337';
      ctx.fillRect(drawX + 4, drawY + 10, 2, 8);
      ctx.fillRect(drawX + 18, drawY + 10, 2, 8);
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(drawX + 4, drawY + 18, 2, 3);
      ctx.fillRect(drawX + 18, drawY + 18, 2, 3);
      // Map evaluasi Wordle/TTS di tangan
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
      // Mata bijak mengayomi
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(drawX + 9, drawY + 3, 2, 2);
      ctx.fillRect(drawX + 14, drawY + 3, 2, 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(drawX + 9, drawY + 3, 1, 1);
      ctx.fillRect(drawX + 14, drawY + 3, 1, 1);

      // Senyum ramah bijaksana
      ctx.fillStyle = '#991b1b';
      ctx.fillRect(drawX + 10, drawY + 6, 3, 1);
    }
  } else if (type === 'prof_raditya') {
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

    if (zoneId === 'divergent') {
      // PAKAIAN PENYELAM LAUT DALAM (DEEP SEA SCUBA DIVER SUIT)
      // Sepatu katak selam khaki-amber & kaki
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(drawX + 6, drawY + 26, 5, 5);
      ctx.fillRect(drawX + 13, drawY + 26, 5, 5);
      ctx.fillStyle = '#d97706'; // Fins
      ctx.fillRect(drawX + 4, drawY + 29, 7, 2);
      ctx.fillRect(drawX + 13, drawY + 29, 7, 2);

      // Celana Neoprene Selam
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(drawX + 6, drawY + 19, 12, 8);
      ctx.fillStyle = '#b45309'; // Pelindung lutut selam
      ctx.fillRect(drawX + 7, drawY + 21, 3, 3);
      ctx.fillRect(drawX + 14, drawY + 21, 3, 3);

      // Tabung Oksigen Penyelam di Punggung (Twin Yellow Cylinders)
      ctx.fillStyle = '#eab308';
      ctx.fillRect(drawX + 2, drawY + 9, 4, 11);
      ctx.fillStyle = '#fde047';
      ctx.fillRect(drawX + 3, drawY + 10, 2, 9);
      ctx.fillStyle = '#94a3b8'; // Katup valve
      ctx.fillRect(drawX + 3, drawY + 7, 2, 2);
      ctx.fillStyle = '#475569'; // Selang pernapasan
      ctx.fillRect(drawX + 5, drawY + 8, 4, 2);

      // Wetsuit Selam Amber-Safari & Sabuk Pemberat
      ctx.fillStyle = '#d97706';
      ctx.fillRect(drawX + 6, drawY + 10, 12, 9);
      ctx.fillStyle = '#0f172a'; // Harness sabuk dada & pemberat
      ctx.fillRect(drawX + 6, drawY + 17, 12, 2);
      ctx.fillStyle = '#38bdf8'; // Depth gauge konsol dada
      ctx.fillRect(drawX + 8, drawY + 12, 3, 3);

      // Helm & Masker Selam Kaca Laut Dalam
      ctx.fillStyle = '#0f172a'; // Hood neoprene
      ctx.fillRect(drawX + 5, drawY - 1, 14, 11);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(drawX + 4, drawY + 2, 2, 7);
      // Kaca masker selam cyan transparan
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(drawX + 9, drawY + 2, 7, 6);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(drawX + 10, drawY + 3, 5, 4);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(drawX + 11, drawY + 3, 3, 1);
      // Regulator pernapasan
      ctx.fillStyle = '#64748b';
      ctx.fillRect(drawX + 11, drawY + 8, 4, 3);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(drawX + 12, drawY + 9, 2, 2);

      // Gelembung napas kecil sesekali melayang ke atas
      const bProg = ((frame * 0.4 + 10) % 70) / 70;
      if (bProg < 0.75) {
        ctx.fillStyle = `rgba(224, 242, 254, ${0.7 * (1 - bProg)})`;
        ctx.beginPath();
        ctx.arc(drawX + 13, drawY + 6 - bProg * 26, 1.5 + bProg * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
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
    }
  } else if (type === 'prof_maya') {
    // ── PROF. MAYA (AHLI REKONSTRUKSI SUPERBENUA PANGEA) ──
    const drawX = -12;
    const drawY = -32 + breathY;

    if (zoneId === 'divergent') {
      // PAKAIAN PENYELAM LAUT DALAM PROF. MAYA (UNGU-VIOLET ROYAL DIVER)
      // Sepatu katak selam ungu & kaki
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(drawX + 6, drawY + 26, 5, 5);
      ctx.fillRect(drawX + 13, drawY + 26, 5, 5);
      ctx.fillStyle = '#7e22ce'; // Fins ungu
      ctx.fillRect(drawX + 4, drawY + 29, 7, 2);
      ctx.fillRect(drawX + 13, drawY + 29, 7, 2);

      // Celana Neoprene Selam
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(drawX + 6, drawY + 19, 12, 8);
      ctx.fillStyle = '#581c87';
      ctx.fillRect(drawX + 7, drawY + 21, 3, 3);
      ctx.fillRect(drawX + 14, drawY + 21, 3, 3);

      // Tabung Oksigen Penyelam di Punggung (Twin Lavender Cylinders)
      ctx.fillStyle = '#c084fc';
      ctx.fillRect(drawX + 2, drawY + 9, 4, 11);
      ctx.fillStyle = '#e9d5ff';
      ctx.fillRect(drawX + 3, drawY + 10, 2, 9);
      ctx.fillStyle = '#94a3b8'; // Katup valve
      ctx.fillRect(drawX + 3, drawY + 7, 2, 2);
      ctx.fillStyle = '#475569'; // Selang pernapasan
      ctx.fillRect(drawX + 5, drawY + 8, 4, 2);

      // Wetsuit Selam Ungu Violet & Garis Reflektor Perak
      ctx.fillStyle = '#7e22ce';
      ctx.fillRect(drawX + 6, drawY + 10, 12, 9);
      ctx.fillStyle = '#e2e8f0'; // Strip perak
      ctx.fillRect(drawX + 6, drawY + 13, 12, 1);
      ctx.fillStyle = '#0f172a'; // Sabuk pemberat
      ctx.fillRect(drawX + 6, drawY + 17, 12, 2);

      // Papan catat riset tahan air di tangan
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(drawX + 4, drawY + 14, 3, 4);

      // Helm & Masker Selam Kaca Laut Dalam
      ctx.fillStyle = '#0f172a'; // Hood neoprene
      ctx.fillRect(drawX + 5, drawY - 1, 14, 11);
      ctx.fillStyle = '#7e22ce';
      ctx.fillRect(drawX + 4, drawY + 2, 2, 7);
      // Kaca masker selam cyan transparan
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(drawX + 9, drawY + 2, 7, 6);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(drawX + 10, drawY + 3, 5, 4);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(drawX + 11, drawY + 3, 3, 1);
      // Regulator pernapasan
      ctx.fillStyle = '#64748b';
      ctx.fillRect(drawX + 11, drawY + 8, 4, 3);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(drawX + 12, drawY + 9, 2, 2);

      // Gelembung napas kecil
      const bProg = ((frame * 0.4 + 35) % 70) / 70;
      if (bProg < 0.75) {
        ctx.fillStyle = `rgba(224, 242, 254, ${0.7 * (1 - bProg)})`;
        ctx.beginPath();
        ctx.arc(drawX + 13, drawY + 6 - bProg * 26, 1.5 + bProg * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
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
    }
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

    if (zoneId === 'divergent') {
      // PAKAIAN PENYELAM LAUT DALAM PROF. ILHAM (HIGH-TECH OCEANOGRAPHER DIVER)
      // Sepatu katak selam biru samudra & kaki
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(drawX + 6, drawY + 26, 5, 5);
      ctx.fillRect(drawX + 13, drawY + 26, 5, 5);
      ctx.fillStyle = '#1d4ed8'; // Fins biru
      ctx.fillRect(drawX + 4, drawY + 29, 7, 2);
      ctx.fillRect(drawX + 13, drawY + 29, 7, 2);

      // Celana Neoprene Selam
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(drawX + 6, drawY + 19, 12, 8);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(drawX + 7, drawY + 21, 3, 3);
      ctx.fillRect(drawX + 14, drawY + 21, 3, 3);

      // Tabung Oksigen Penyelam di Punggung (Twin Ocean Blue Cylinders)
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(drawX + 2, drawY + 9, 4, 11);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(drawX + 3, drawY + 10, 2, 9);
      ctx.fillStyle = '#94a3b8'; // Katup valve
      ctx.fillRect(drawX + 3, drawY + 7, 2, 2);
      ctx.fillStyle = '#475569'; // Selang pernapasan
      ctx.fillRect(drawX + 5, drawY + 8, 4, 2);

      // Wetsuit Selam Biru Samudra & Sensor Termal Oseanografi
      ctx.fillStyle = '#1d4ed8';
      ctx.fillRect(drawX + 6, drawY + 10, 12, 9);
      ctx.fillStyle = '#06b6d4'; // Strip sensor cyan
      ctx.fillRect(drawX + 8, drawY + 12, 8, 2);
      ctx.fillStyle = '#0f172a'; // Sabuk pemberat
      ctx.fillRect(drawX + 6, drawY + 17, 12, 2);

      // Sensor probe suhu di pergelangan tangan
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(drawX + 4, drawY + 15, 3, 3);

      // Helm & Masker Selam Kaca Laut Dalam dengan Lampu Senter Kepala
      ctx.fillStyle = '#0f172a'; // Hood neoprene
      ctx.fillRect(drawX + 5, drawY - 1, 14, 11);
      ctx.fillStyle = '#1d4ed8';
      ctx.fillRect(drawX + 4, drawY + 2, 2, 7);
      // Kaca masker selam cyan transparan
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(drawX + 9, drawY + 2, 7, 6);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(drawX + 10, drawY + 3, 5, 4);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(drawX + 11, drawY + 3, 3, 1);
      // Senter kepala laut dalam di dahi
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(drawX + 11, drawY - 1, 4, 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(drawX + 12, drawY - 1, 2, 1);
      // Regulator pernapasan
      ctx.fillStyle = '#64748b';
      ctx.fillRect(drawX + 11, drawY + 8, 4, 3);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(drawX + 12, drawY + 9, 2, 2);

      // Gelembung napas kecil
      const bProg = ((frame * 0.4 + 20) % 70) / 70;
      if (bProg < 0.75) {
        ctx.fillStyle = `rgba(224, 242, 254, ${0.7 * (1 - bProg)})`;
        ctx.beginPath();
        ctx.arc(drawX + 13, drawY + 6 - bProg * 26, 1.5 + bProg * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
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
    }
  } else if (type === 'komandan_satria' || type === 'komandan_arya') {
    // ── KOMANDAN SATRIA & KOMANDAN ARYA (KEPALA PENJAGA GERBANG) ──
    const drawX = -12;
    const drawY = -32 + breathY;

    if (zoneId === 'divergent') {
      // PAKAIAN PENYELAM TAKTIS KOMANDAN SATRIA (TACTICAL COMBAT DIVER)
      // Sepatu katak selam taktis hitam-crimson & kaki
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(drawX + 6, drawY + 26, 5, 5);
      ctx.fillRect(drawX + 13, drawY + 26, 5, 5);
      ctx.fillStyle = '#881337'; // Fins crimson
      ctx.fillRect(drawX + 4, drawY + 29, 7, 2);
      ctx.fillRect(drawX + 13, drawY + 29, 7, 2);

      // Celana Neoprene Taktis Selam
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(drawX + 6, drawY + 19, 12, 8);
      ctx.fillStyle = '#9f1239';
      ctx.fillRect(drawX + 7, drawY + 21, 3, 3);
      ctx.fillRect(drawX + 14, drawY + 21, 3, 3);
      // Pisau selam militer di betis
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(drawX + 17, drawY + 22, 2, 5);

      // Tabung Oksigen Penyelam di Punggung (Heavy Duty Crimson Tanks)
      ctx.fillStyle = '#881337';
      ctx.fillRect(drawX + 2, drawY + 9, 4, 11);
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(drawX + 3, drawY + 10, 2, 9);
      ctx.fillStyle = '#e2e8f0'; // Katup valve perak
      ctx.fillRect(drawX + 3, drawY + 7, 2, 2);
      ctx.fillStyle = '#475569'; // Selang pernapasan
      ctx.fillRect(drawX + 5, drawY + 8, 4, 2);

      // Wetsuit Selam Crimson Taktis & Lencana Komando
      ctx.fillStyle = '#881337';
      ctx.fillRect(drawX + 6, drawY + 10, 12, 9);
      ctx.fillStyle = '#f43f5e'; // Lencana perisai
      ctx.fillRect(drawX + 9, drawY + 12, 4, 3);
      ctx.fillStyle = '#e2e8f0'; // Epaulet perak bahu
      ctx.fillRect(drawX + 4, drawY + 10, 4, 2);
      ctx.fillRect(drawX + 14, drawY + 10, 4, 2);
      ctx.fillStyle = '#0f172a'; // Sabuk taktis
      ctx.fillRect(drawX + 6, drawY + 17, 12, 2);

      // Helm & Masker Selam Taktis Kaca Laut Dalam
      ctx.fillStyle = '#0f172a'; // Hood neoprene
      ctx.fillRect(drawX + 5, drawY - 1, 14, 11);
      ctx.fillStyle = '#4c0519'; // List baret komando crimson di helm
      ctx.fillRect(drawX + 5, drawY - 2, 14, 3);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(drawX + 9, drawY - 1, 3, 2);
      // Kaca masker selam cyan HUD taktis
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(drawX + 9, drawY + 2, 7, 6);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(drawX + 10, drawY + 3, 5, 4);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(drawX + 11, drawY + 3, 3, 1);
      // Regulator pernapasan
      ctx.fillStyle = '#64748b';
      ctx.fillRect(drawX + 11, drawY + 8, 4, 3);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(drawX + 12, drawY + 9, 2, 2);

      // Gelembung napas kecil
      const bProg = ((frame * 0.4 + 50) % 70) / 70;
      if (bProg < 0.75) {
        ctx.fillStyle = `rgba(224, 242, 254, ${0.7 * (1 - bProg)})`;
        ctx.beginPath();
        ctx.arc(drawX + 13, drawY + 6 - bProg * 26, 1.5 + bProg * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
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
    }
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
  // Lingkar mata hitam
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-6, -5, 5, 5);
  ctx.fillRect(1, -5, 5, 5);
  // Lensa mata emas bercahaya
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(-5, -4, 4, 4);
  ctx.fillRect(1, -4, 4, 4);
  // Kacamata Bulat Peneliti Emas (Smart Scholar Spectacles)
  ctx.fillStyle = '#d97706';
  ctx.fillRect(-6, -6, 6, 1);
  ctx.fillRect(0, -6, 6, 1);
  ctx.fillRect(-1, -4, 2, 1); // Jembatan kacamata
  // Pupil mata & Kedip
  const isBlink = frame % 120 > 112;
  if (!isBlink) {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-4, -3, 2, 3);
    ctx.fillRect(2, -3, 2, 3);
    // Glint pantulan putih
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-4, -4, 1, 1);
    ctx.fillRect(2, -4, 1, 1);
  } else {
    // Garis mata terpejam imut saat berkedip
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
// 3. GENERATOR POTRET BESAR PIXEL ART (VISUAL NOVEL BUST DIALOGUE)
// 100% TRANSPARAN TANPA KOTAK BACKGROUND
// ══════════════════════════════════════════════════════════════════════════

export function drawNpcMaterialBadge(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number,
  isDiscovered: boolean = false,
): void {
  const bob = Math.sin(frame * 0.08) * 3;
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
    const pulseAlpha = 0.85 + Math.sin(frame * 0.12) * 0.15;
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

// ── Ekspor ulang ──────────────────────────────────────────────────────
// Pemakai lama mengimpor potret dari berkas ini, sehingga seluruhnya
// diekspor ulang di sini dan tidak ada pemakai yang perlu diubah.
export { portraitCache, clearPortraitCache, getOrCreateCanvas, getProfRadityaPortrait, getKaptenMayaPortrait, getResqyPortrait, getZidanePortrait, getZahraPortrait, getIcanPortrait, getLintangPortrait, getBuTyasPortrait, getDrGeaPortrait, getProfAndiniPortrait, getInspekturBudiPortrait, getKomandanHendraPortrait, getProfSarahPortrait, getDrBayuPortrait, getDrDanangPortrait, getPetugasRudiPortrait, getKomandanSuryaPortrait, getDrFajarPortrait, getProfRatnaPortrait, getDrArisPortrait, getPetugasJokoPortrait, getKomandanTeguhPortrait, getDrBagusPortrait, getProfLestariPortrait, getDrFarhanPortrait, getPetugasDianPortrait, getKomandanBintangPortrait, getDrTaufikPortrait, getProfMayaPortrait, getDrCitraPortrait, getProfIlhamPortrait, getKomandanSatriaPortrait, getKomandanAryaPortrait, getKomandanGunturPortrait, getRawNpcPortrait, getNpcPortrait, getPlayerPortrait } from './npcPortraits';
