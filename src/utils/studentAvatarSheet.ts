// ── src/utils/studentAvatarSheet.ts ──────────────────────────────────
// Generator Sprite Sheet Karakter Siswa 2D Pixel Art Prosedural
// Mendukung kustomisasi avatar siswa (kulit, rambut, warna rambut, pakaian, mata, aksesoris)
// Digunakan secara bersama oleh Level 1 (Earth Dive) dan Level 2 (Tectonic Explorer).

import type { CustomAvatarConfig } from '../store/teacherStore';

// Cached sprite sheets per konfigurasi avatar
const spriteCache = new Map<string, HTMLCanvasElement>();

function getOrCreate(
  key: string,
  w: number,
  h: number,
  draw: (ctx: CanvasRenderingContext2D) => void
): HTMLCanvasElement {
  if (spriteCache.has(key)) return spriteCache.get(key)!;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  draw(ctx);
  spriteCache.set(key, c);
  return c;
}

export function clearSpriteCache(): void {
  spriteCache.clear();
}

export function getPlayerSheet(
  avatarConfig?: CustomAvatarConfig,
  zoneId?: string,
  suitType?: string | null
): HTMLCanvasElement {
  const skinKey = avatarConfig?.skin || 'warm';
  const hairKey = avatarConfig?.hairStyle || 'spiky';
  const hairColor = avatarConfig?.hairColor || '#3e2723';
  const outfitKey = avatarConfig?.outfit || 'vest-orange';
  const eyesKey = avatarConfig?.eyes || 'determined';
  const accKey = avatarConfig?.accessory || 'walkie';

  // Tentukan mode pakaian lingkungan berdasarkan zona atau baju pelindung yang sedang dipakai
  const isClassroom =
    zoneId === 'classroom' ||
    zoneId === 'area-mitigasi-gempa' ||
    zoneId === 'area-simulasi-gempa';

  const effectiveSuit = suitType || (
    zoneId === 'mantle' ? 'mantle_suit' :
    zoneId === 'outerCore' ? 'outer_core_suit' :
    zoneId === 'innerCore' ? 'inner_core_suit' :
    zoneId === 'divergent' ? 'diver_suit' : null
  );

  let envMode: 'smp' | 'diver' | 'miner' | 'hazard_mantle' | 'hazard_outer' | 'hazard_inner' | 'normal' = 'normal';
  if (isClassroom) {
    envMode = 'smp';
  } else if (effectiveSuit === 'diver_suit' || zoneId === 'divergent') {
    envMode = 'diver';
  } else if (effectiveSuit === 'inner_core_suit') {
    envMode = 'hazard_inner';
  } else if (effectiveSuit === 'outer_core_suit') {
    envMode = 'hazard_outer';
  } else if (effectiveSuit === 'mantle_suit') {
    envMode = 'hazard_mantle';
  } else if (zoneId === 'crust') {
    envMode = 'miner';
  } else {
    envMode = 'normal';
  }

  const isDivergent = envMode === 'diver';
  const isCrust = envMode === 'miner';
  const isMantleSuit = envMode === 'hazard_mantle';
  const isOuterCoreSuit = envMode === 'hazard_outer';
  const isInnerCoreSuit = envMode === 'hazard_inner';
  const isHeatZone = isMantleSuit || isOuterCoreSuit || isInnerCoreSuit;

  const cacheKey = `player_${skinKey}_${hairKey}_${hairColor}_${outfitKey}_${eyesKey}_${accKey}_${envMode}`;

  return getOrCreate(cacheKey, 24 * 8, 32, (ctx) => {
    // Skin palette mapping
    const skinColors: Record<string, { base: string; shadow: string; blush?: string }> = {
      light: { base: '#fed7aa', shadow: '#fba874', blush: '#fb7185' },
      warm: { base: '#f5af7e', shadow: '#d97746', blush: '#f43f5e' },
      tan: { base: '#d97706', shadow: '#9a4214', blush: '#b45309' },
      brown: { base: '#92400e', shadow: '#5c2a10' },
      dark: { base: '#5c2c16', shadow: '#3a190b' },
      robot: { base: '#38bdf8', shadow: '#0284c7', blush: '#67e8f9' },
    };
    const skin = skinColors[skinKey] || skinColors.warm;

    // Outfit palette mapping
    const outfitColors: Record<
      string,
      { primary: string; secondary: string; pants: string; boots: string }
    > = {
      'vest-orange': { primary: '#ea580c', secondary: '#facc15', pants: '#1e293b', boots: '#78350f' },
      'jacket-blue': { primary: '#0284c7', secondary: '#38bdf8', pants: '#0f172a', boots: '#1e293b' },
      'gear-red': { primary: '#dc2626', secondary: '#ffffff', pants: '#1c1917', boots: '#991b1b' },
      'khaki': { primary: '#a16207', secondary: '#fed7aa', pants: '#78350f', boots: '#451a03' },
      'cyber': { primary: '#06b6d4', secondary: '#c084fc', pants: '#0f172a', boots: '#0891b2' },
    };
    let outfit = outfitColors[outfitKey] || outfitColors['vest-orange'];
    if (isClassroom) {
      // Seragam Sekolah SMP: Kemeja Putih Resmi, Dasi Biru Tua SMP, Celana/Rok Biru Tua SMP, Sepatu Hitam
      outfit = { primary: '#ffffff', secondary: '#1e3a8a', pants: '#1e3a8a', boots: '#0f172a' };
    } else if (isDivergent) {
      // Pakaian Penyelam Bawah Laut (Deep Sea Scuba Wetsuit)
      outfit = { primary: '#0369a1', secondary: '#facc15', pants: '#0f172a', boots: '#0284c7' };
    } else if (isCrust) {
      // Pakaian tambang litosfer
      outfit = { primary: '#ea580c', secondary: '#facc15', pants: '#1e293b', boots: '#0f172a' };
    } else if (isMantleSuit) {
      // 1. Baju Pelindung Biasa (Hazard Thermal MK-1): Oranye & Putih Tahan Panas 1.000°C
      outfit = { primary: '#f8fafc', secondary: '#f97316', pants: '#334155', boots: '#0f172a' };
    } else if (isOuterCoreSuit) {
      // 2. Baju Pelindung Lebih Canggih (Hazard Electromagnetic MK-2): Biru Dinamo & Perak 5.000°C
      outfit = { primary: '#0f172a', secondary: '#0284c7', pants: '#1e293b', boots: '#0369a1' };
    } else if (isInnerCoreSuit) {
      // 3. Baju Pelindung Super Canggih (Adamantine Hyper-Pressure Exo-Suit MK-3): Emas Surya 6.000°C & 3,6 Juta Atm
      outfit = { primary: '#facc15', secondary: '#ffffff', pants: '#78350f', boots: '#451a03' };
    }

    const drawChar = (x: number, flip: boolean, pose: 'normal' | 'jump' | 'fall' = 'normal') => {
      ctx.save();
      if (flip) {
        ctx.translate(x + 24, 0);
        ctx.scale(-1, 1);
        x = 0;
      }

      const yOffset = pose === 'jump' ? -2 : pose === 'fall' ? 1 : 0;

      // 1. Head / Skin
      ctx.fillStyle = skin.base;
      ctx.fillRect(x + 6, 2 + yOffset, 12, 10);
      ctx.fillStyle = skin.shadow;
      ctx.fillRect(x + 6, 10 + yOffset, 12, 2);

      // Robot cheeks / human blush
      if (skin.blush) {
        ctx.fillStyle = skin.blush;
        ctx.fillRect(x + 10, 8 + yOffset, 2, 1);
        ctx.fillRect(x + 15, 8 + yOffset, 2, 1);
      }

      // 2. Hairstyle & Hair Color (Hanya digambar jika bukan penyelam tertutup atau hazard suit)
      if (!isDivergent && !isHeatZone) {
        ctx.fillStyle = hairColor;
        if (hairKey === 'spiky') {
          ctx.fillRect(x + 5, 0 + yOffset, 14, 4);
          ctx.fillRect(x + 6, -2 + yOffset, 3, 2);
          ctx.fillRect(x + 11, -2 + yOffset, 4, 2);
          ctx.fillRect(x + 16, -1 + yOffset, 3, 2);
          ctx.fillRect(x + 4, 3 + yOffset, 2, 5);
        } else if (hairKey === 'parted') {
          ctx.fillRect(x + 5, 0 + yOffset, 14, 4);
          ctx.fillRect(x + 6, 3 + yOffset, 4, 3);
          ctx.fillRect(x + 12, 2 + yOffset, 7, 2);
          ctx.fillRect(x + 4, 3 + yOffset, 2, 6);
        } else if (hairKey === 'curly') {
          ctx.fillRect(x + 4, 0 + yOffset, 16, 5);
          ctx.fillRect(x + 5, -2 + yOffset, 4, 2);
          ctx.fillRect(x + 11, -2 + yOffset, 4, 2);
          ctx.fillRect(x + 16, -2 + yOffset, 3, 2);
          ctx.fillRect(x + 3, 2 + yOffset, 3, 8);
          ctx.fillRect(x + 18, 2 + yOffset, 3, 8);
        } else if (hairKey === 'ponytail') {
          ctx.fillRect(x + 5, 0 + yOffset, 14, 4);
          ctx.fillRect(x + 2, 2 + yOffset, 4, 8);
          ctx.fillRect(x + 1, 6 + yOffset, 3, 6);
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(x + 3, 3 + yOffset, 2, 2);
        } else if (hairKey === 'bob') {
          ctx.fillRect(x + 4, 0 + yOffset, 16, 5);
          ctx.fillRect(x + 4, 4 + yOffset, 3, 7);
          ctx.fillRect(x + 17, 4 + yOffset, 3, 7);
        } else if (hairKey === 'hijab') {
          // ── HIJAB RESCUER (Menggunakan hairColor kustom dari Bengkel Avatar) ──
          ctx.fillStyle = hairColor;
          // Kubah atas kepala & samping
          ctx.fillRect(x + 4, -1 + yOffset, 16, 14);
          ctx.fillRect(x + 5, 12 + yOffset, 14, 3);
          // Wajah siswa yang terlihat di tengah
          ctx.fillStyle = skin.base;
          ctx.fillRect(x + 7, 3 + yOffset, 10, 8);
          // Ciput putih di dahi
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x + 7, 3 + yOffset, 10, 1);
          // Dagu & penutup leher menutup penuh
          ctx.fillStyle = hairColor;
          ctx.fillRect(x + 6, 11 + yOffset, 12, 3);
          // Bros emas rescuer
          ctx.fillStyle = '#facc15';
          ctx.fillRect(x + 11, 12 + yOffset, 2, 2);
        } else if (hairKey === 'headband') {
          ctx.fillRect(x + 5, 0 + yOffset, 14, 4);
          ctx.fillRect(x + 7, -1 + yOffset, 4, 2);
          ctx.fillRect(x + 13, -1 + yOffset, 3, 2);
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(x + 5, 2 + yOffset, 14, 2);
        } else if (hairKey === 'cap') {
          ctx.fillStyle = outfit.primary;
          ctx.fillRect(x + 5, 0 + yOffset, 14, 4);
          ctx.fillRect(x + 11, 3 + yOffset, 8, 2);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x + 8, 1 + yOffset, 3, 2);
        } else {
          ctx.fillRect(x + 5, 0 + yOffset, 14, 4);
          ctx.fillRect(x + 5, 3 + yOffset, 2, 6);
        }
      }

      // Helm Khusus Berdasarkan Zona (Diver Helmet, Miner Helmet, atau Futuristic Hazmat Helmet)
      if (isDivergent) {
        // Helm / Masker Kaca Selam Laut Dalam (Deep Sea Scuba Mask & Diving Hood)
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(x + 4, -3 + yOffset, 16, 14); // Neoprene hood
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(x + 3, 1 + yOffset, 2, 8);
        ctx.fillRect(x + 19, 1 + yOffset, 2, 8);
        // Visor kaca masker selam besar panoramic cyan
        ctx.fillStyle = '#0369a1';
        ctx.fillRect(x + 10, 3 + yOffset, 8, 6);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(x + 11, 4 + yOffset, 6, 4);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + 12, 4 + yOffset, 4, 1);
        ctx.fillRect(x + 15, 6 + yOffset, 1, 1);
        // Regulator mouthpiece pernapasan selam
        ctx.fillStyle = '#64748b';
        ctx.fillRect(x + 12, 9 + yOffset, 4, 3);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(x + 13, 10 + yOffset, 2, 2);
      } else if (isCrust) {
        // Helm Tambang Kuning Terang dengan Senter Kerja
        ctx.fillStyle = '#eab308';
        ctx.fillRect(x + 4, -3 + yOffset, 16, 6);
        ctx.fillRect(x + 3, 2 + yOffset, 18, 2); // Brim visor
        ctx.fillStyle = '#ca8a04';
        ctx.fillRect(x + 5, -4 + yOffset, 14, 2);
        // Bracket lampu senter helm
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(x + 14, -1 + yOffset, 4, 4);
        // Bohlam menyala terang
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + 15, 0 + yOffset, 3, 3);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(x + 16, 0 + yOffset, 2, 2);
      } else if (isMantleSuit) {
        // 1. Helm Pelindung Termal Mantel (MK-1): Serat Silikat Tahan Panas 1.000°C & Visor Amber
        ctx.fillStyle = '#f97316';
        ctx.fillRect(x + 4, -3 + yOffset, 16, 14);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(x + 3, 1 + yOffset, 2, 8);
        ctx.fillRect(x + 19, 1 + yOffset, 2, 8);
        // Visor kaca termal amber reflektif
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(x + 10, 3 + yOffset, 8, 6);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(x + 11, 4 + yOffset, 6, 4);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(x + 12, 4 + yOffset, 4, 1);
      } else if (isOuterCoreSuit) {
        // 2. Helm Pelindung Inti Luar Elektromagnetik (MK-2): Titanium Biru Baja & Visor Neon Cyan HUD
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x + 4, -3 + yOffset, 16, 14);
        // Sirip/earpiece isolator fluks dinamo magnetik
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(x + 2, 1 + yOffset, 3, 8);
        ctx.fillRect(x + 19, 1 + yOffset, 3, 8);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(x + 3, 3 + yOffset, 1, 4);
        ctx.fillRect(x + 20, 3 + yOffset, 1, 4);
        // Visor kaca HUD neon cyan berdaya listrik dinamo
        ctx.fillStyle = '#0369a1';
        ctx.fillRect(x + 10, 3 + yOffset, 8, 6);
        ctx.fillStyle = '#00e5ff';
        ctx.fillRect(x + 11, 4 + yOffset, 6, 4);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + 12, 4 + yOffset, 4, 1);
      } else if (isInnerCoreSuit) {
        // 3. Helm Adamantine Hyper-Pressure Exo-Suit (MK-3): Mahkota Prisma Emas Surya 6.000°C & Tekanan Dahsyat
        ctx.fillStyle = '#facc15';
        ctx.fillRect(x + 4, -4 + yOffset, 16, 15);
        ctx.fillStyle = '#b45309';
        ctx.fillRect(x + 3, 0 + yOffset, 2, 9);
        ctx.fillRect(x + 19, 0 + yOffset, 2, 9);
        // Mahkota pelindung tekanan litostatik
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + 7, -5 + yOffset, 10, 2);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(x + 9, -6 + yOffset, 6, 2);
        // Visor prisma matahari putih-kuning menyilaukan
        ctx.fillStyle = '#ca8a04';
        ctx.fillRect(x + 10, 3 + yOffset, 8, 6);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + 11, 4 + yOffset, 6, 4);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(x + 12, 5 + yOffset, 4, 2);
      }

      // 3. Eyes / Visor (Hanya jika bukan diving mask atau hazard suit yang menutup penuh)
      if (!isHeatZone && !isDivergent) {
        if (eyesKey === 'goggles') {
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(x + 11, 4 + yOffset, 6, 3);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x + 12, 4 + yOffset, 2, 1);
          ctx.fillStyle = '#0284c7';
          ctx.fillRect(x + 8, 5 + yOffset, 3, 1);
        } else if (eyesKey === 'glasses') {
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(x + 11, 4 + yOffset, 3, 3);
          ctx.fillRect(x + 15, 4 + yOffset, 3, 3);
          ctx.fillRect(x + 14, 5 + yOffset, 1, 1);
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(x + 12, 5 + yOffset, 1, 1);
          ctx.fillRect(x + 16, 5 + yOffset, 1, 1);
        } else if (eyesKey === 'happy') {
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(x + 12, 5 + yOffset, 2, 1);
          ctx.fillRect(x + 15, 5 + yOffset, 2, 1);
          ctx.fillRect(x + 11, 6 + yOffset, 1, 1);
          ctx.fillRect(x + 17, 6 + yOffset, 1, 1);
        } else if (eyesKey === 'focus') {
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(x + 12, 5 + yOffset, 5, 2);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x + 13, 5 + yOffset, 1, 1);
          ctx.fillRect(x + 16, 5 + yOffset, 1, 1);
        } else {
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(x + 12, 5 + yOffset, 2, 2);
          ctx.fillRect(x + 15, 5 + yOffset, 2, 2);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x + 12, 5 + yOffset, 1, 1);
          ctx.fillRect(x + 15, 5 + yOffset, 1, 1);
        }

        // Mouth
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(x + 13, 9 + yOffset, 3, 1);
      }

      // 4. Body / Outfit
      ctx.fillStyle = outfit.primary;
      ctx.fillRect(x + 7, 12 + yOffset, 10, 8);
      ctx.fillStyle = outfit.secondary;
      ctx.fillRect(x + 8, 14 + yOffset, 8, 2);
      ctx.fillRect(x + 11, 12 + yOffset, 2, 8);

      if (isDivergent) {
        // Strip reflektor selam neon & dive computer di dada
        ctx.fillStyle = '#facc15';
        ctx.fillRect(x + 7, 14 + yOffset, 10, 1);
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(x + 10, 15 + yOffset, 4, 3);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(x + 11, 16 + yOffset, 2, 1);
      } else if (isCrust) {
        // Strip reflektor scotlight rompi tambang
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + 8, 14 + yOffset, 8, 1);
        ctx.fillStyle = '#facc15';
        ctx.fillRect(x + 7, 17 + yOffset, 10, 1);
      } else if (isMantleSuit) {
        // Kisi isolator pendingin termal mantel di dada
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(x + 10, 14 + yOffset, 4, 3);
        ctx.fillStyle = '#f97316';
        ctx.fillRect(x + 11, 15 + yOffset, 2, 1);
      } else if (isOuterCoreSuit) {
        // Inti reaktor pendingin dinamo elektromagnetik berdenyut neon cyan
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(x + 10, 14 + yOffset, 4, 4);
        ctx.fillStyle = '#00e5ff';
        ctx.fillRect(x + 11, 15 + yOffset, 2, 2);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + 11, 15 + yOffset, 1, 1);
        // Pelindung bahu isolator dinamo
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(x + 6, 12 + yOffset, 2, 3);
        ctx.fillRect(x + 16, 12 + yOffset, 2, 3);
      } else if (isInnerCoreSuit) {
        // Inti singularitas perisai anti-kompresi heksagonal emas surya
        ctx.fillStyle = '#b45309';
        ctx.fillRect(x + 9, 13 + yOffset, 6, 5);
        ctx.fillStyle = '#fde047';
        ctx.fillRect(x + 10, 14 + yOffset, 4, 3);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + 11, 14 + yOffset, 2, 2);
        // Pelat bahu heksagonal perisai gravitasi
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + 5, 12 + yOffset, 3, 3);
        ctx.fillRect(x + 16, 12 + yOffset, 3, 3);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(x + 6, 13 + yOffset, 1, 1);
        ctx.fillRect(x + 17, 13 + yOffset, 1, 1);
      }

      // Backpack / Scuba Oxygen Tanks
      if (isDivergent) {
        // Tabung Oksigen Penyelam Ganda (Twin Scuba Cylinders) di Punggung
        ctx.fillStyle = '#eab308'; // Tabung kuning keselamatan
        ctx.fillRect(x + 2, 10 + yOffset, 4, 10);
        ctx.fillStyle = '#fde047';
        ctx.fillRect(x + 3, 11 + yOffset, 2, 8);
        ctx.fillStyle = '#94a3b8'; // Katup valve perak
        ctx.fillRect(x + 3, 8 + yOffset, 2, 2);
        ctx.fillStyle = '#475569'; // Selang pernapasan
        ctx.fillRect(x + 5, 9 + yOffset, 4, 2);
        // Harness pengikat tabung di dada
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(x + 7, 13 + yOffset, 10, 2);
      } else {
        ctx.fillStyle = '#334155';
        ctx.fillRect(x + 4, 13 + yOffset, 3, 6);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(x + 5, 14 + yOffset, 2, 2);
      }

      // Dynamic arms based on pose
      if (pose === 'fall') {
        ctx.fillStyle = outfit.primary;
        ctx.fillRect(x + 3, 12 + yOffset, 4, 3);
        ctx.fillRect(x + 17, 12 + yOffset, 4, 3);
        ctx.fillStyle = skin.base;
        ctx.fillRect(x + 2, 13 + yOffset, 2, 2);
        ctx.fillRect(x + 20, 13 + yOffset, 2, 2);
      } else if (pose === 'jump') {
        ctx.fillStyle = outfit.primary;
        ctx.fillRect(x + 4, 10 + yOffset, 3, 4);
        ctx.fillRect(x + 17, 10 + yOffset, 3, 4);
        ctx.fillStyle = skin.base;
        ctx.fillRect(x + 4, 8 + yOffset, 2, 2);
        ctx.fillRect(x + 18, 8 + yOffset, 2, 2);
      }

      // 5. Pants & 6. Boots
      ctx.fillStyle = outfit.pants;
      if (pose === 'jump') {
        ctx.fillRect(x + 6, 19 + yOffset, 12, 4);
        ctx.fillRect(x + 5, 22 + yOffset, 5, 3);
        ctx.fillRect(x + 14, 22 + yOffset, 5, 3);
        ctx.fillStyle = outfit.boots;
        ctx.fillRect(x + 5, 25 + yOffset, 5, 3);
        ctx.fillRect(x + 14, 25 + yOffset, 5, 3);
      } else if (pose === 'fall') {
        ctx.fillRect(x + 7, 20 + yOffset, 10, 6);
        ctx.fillStyle = '#000000';
        ctx.fillRect(x + 11, 22 + yOffset, 2, 4);
        ctx.fillStyle = outfit.boots;
        ctx.fillRect(x + 6, 26 + yOffset, 4, 5);
        ctx.fillRect(x + 14, 26 + yOffset, 4, 5);
      } else {
        ctx.fillRect(x + 7, 20, 10, 6);
        ctx.fillStyle = '#000000';
        ctx.fillRect(x + 11, 22, 2, 4);
        ctx.fillStyle = outfit.boots;
        ctx.fillRect(x + 6, 26, 5, 4);
        ctx.fillRect(x + 13, 26, 5, 4);
      }

      if (isDivergent) {
        // Sepatu katak selam (fins)
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(x + 4, 28 + (pose === 'normal' ? 0 : yOffset), 6, 2);
        ctx.fillRect(x + 13, 28 + (pose === 'normal' ? 0 : yOffset), 6, 2);
      }

      // 7. Accessory
      if (accKey === 'mask') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + 11, 8 + yOffset, 7, 4);
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(x + 8, 9 + yOffset, 3, 1);
      } else if (accKey === 'headlamp') {
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(x + 14, 1 + yOffset, 4, 3);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(x + 16, 2 + yOffset, 2, 2);
      } else if (accKey === 'badge') {
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(x + 14, 13 + yOffset, 2, 2);
      } else if (accKey === 'walkie') {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x + 7, 13 + yOffset, 2, 4);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(x + 7, 11 + yOffset, 1, 2);
      }

      ctx.restore();
    };

    // Walk frame offsets (frames 0..3)
    const offsets = [
      { y: 0, l1: 0, l2: 0 },
      { y: -1, l1: -2, l2: 2 },
      { y: 0, l1: 0, l2: 0 },
      { y: -1, l1: 2, l2: -2 },
    ];

    for (let f = 0; f < 4; f++) {
      ctx.save();
      ctx.translate(0, offsets[f].y);
      drawChar(f * 24, false, 'normal');
      ctx.restore();
    }

    // Idle frames (frames 4 & 5)
    drawChar(4 * 24, false, 'normal');
    drawChar(5 * 24, false, 'normal');

    // Air poses: frame 6 (jump ascend), frame 7 (fall descend)
    drawChar(6 * 24, false, 'jump');
    drawChar(7 * 24, false, 'fall');
  });
}
