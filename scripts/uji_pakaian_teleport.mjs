/**
 * Uji dua perbaikan pada Level 1 EarthDive.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * DUA KELUHAN YANG DIUJI
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * 1. TELEPORT KE AREA YANG SUDAH PERNAH DIBUKA
 *    "aku udah pernah ke area mantel tapi aku balik lagi ke kerak terus aku
 *     mau ke mantel tuh gabisa teleport"
 *
 * 2. PAKAIAN YANG SUDAH DIBELI DIMINTA BELI LAGI
 *    "pas mau ke area mantel perlu beli pakaiannya lagi padahal kan sebelumnya
 *     udah dibeli"
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * MENGAPA BUNDEL DULU, BARU DIUJI
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   `gameEngine.ts` mengimpor berkas lain TANPA ekstensi (mis. `from './zones'`).
 *   Itu cara Vite, dan Node tidak mengenalinya — Node menuntut `./zones.ts`.
 *   Ada 47 impor seperti itu di folder engine, jadi menambahkan ekstensi
 *   satu per satu bukan pilihan yang wajar.
 *
 *   Karena itu berkas ini MEMBUNDEL engine memakai API Vite lebih dulu, lalu
 *   mengimpor hasilnya. Dengan begitu uji ini memakai KODE ASLI yang sama
 *   dengan yang dijalankan aplikasi — bukan salinan logikanya.
 *
 *   Menyalin logika ke dalam uji berarti menguji salinan, dan salinan dapat
 *   tetap benar walaupun kode aslinya rusak.
 *
 * Cara menjalankan:
 *     npm run test:pakaian
 */
import { build } from 'vite';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const AKAR = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// ── 1. Berkas titik masuk sementara untuk bundel ──────────────────────────
const dirSementara = mkdtempSync(join(tmpdir(), 'resq-uji-'));
const berkasMasuk = join(AKAR, 'scripts', '_uji_masuk.ts');

writeFileSync(
  berkasMasuk,
  `export { teleportToZone, checkSuitRequirements, getRequiredSuitForZone }
     from '../src/app/Level1/EarthDive/engine/gameEngine';
   export const jumlahZona = 8;
  `,
  'utf8'
);

let ekspor;
try {
  await build({
    root: AKAR,
    logLevel: 'error',
    build: {
      outDir: dirSementara,
      emptyOutDir: true,
      lib: {
        entry: berkasMasuk,
        formats: ['es'],
        fileName: () => 'engine.mjs',
      },
      // Tanpa minifikasi supaya bila ada galat, namanya masih terbaca
      minify: false,
      // Semua dependensi ikut dibundel supaya tidak perlu resolusi saat uji
      rollupOptions: { external: [] },
    },
  });
  ekspor = await import(pathToFileURL(join(dirSementara, 'engine.mjs')).href);
} finally {
  try { rmSync(berkasMasuk, { force: true }); } catch { /* abaikan */ }
}

const { teleportToZone, checkSuitRequirements, getRequiredSuitForZone } = ekspor;

// ── Kerangka state seminimal mungkin ──────────────────────────────────────
// Hanya memuat bagian yang dibaca kedua fungsi yang diuji, supaya uji ini
// tidak bergantung pada localStorage atau canvas yang tidak ada di Node.
function buatState({ zona = 1, pernahKe = [], pakaian = [], dipakai = null } = {}) {
  return {
    currentZone: zona,
    zonesVisited: new Set(pernahKe),
    purchasedSuits: new Set(pakaian),
    isTransitioning: false,
    transitionProgress: 0,
    transitionTargetZone: zona,
    transitionDirection: 'down',
    player: { equippedSuit: dipakai },
    pendingSuitRequired: null,
    userId: 'uji',
    collectedCrystals: new Set(),
    discoveredPoints: new Set(),
    unlockedGates: new Set(),
  };
}

let lulus = 0;
let gagal = 0;

function uji(nama, hasil, harapan) {
  if (hasil === harapan) {
    lulus++;
    console.log(`  [v] ${nama}`);
  } else {
    gagal++;
    console.log(`  [X] ${nama}`);
    console.log(`      diharapkan: ${harapan}   hasil: ${hasil}`);
  }
}

console.log('\n' + '='.repeat(76));
console.log('  UJI: TELEPORT KE AREA TERBUKA & PAKAIAN TIDAK PERLU DIBELI LAGI');
console.log('='.repeat(76));
console.log('  Memakai kode asli dari gameEngine.ts (dibundel memakai Vite).');

// ═══════════════════════════════════════════════════════════════════════════
console.log('\n── 1. TELEPORT: kembali ke area yang sudah pernah dibuka ──');
//
// CATATAN: semua area mulai dari Mantel (2) MEWAJIBKAN baju pelindung. Karena
// itu data uji di bagian ini menyertakan pakaian yang sudah dibeli — tanpa itu
// teleport memang ditolak, dan penolakan itu BENAR.
//
// Uji pertama versi ini tidak menyertakannya, sehingga dua pemeriksaan gagal
// dan pesannya "belum memiliki baju pelindung". Kegagalan itu justru
// membuktikan dua hal sekaligus: aturan pakaian bekerja, dan teleport tidak
// dapat dipakai sebagai jalan pintas melewatinya.

uji(
  'Pernah ke Mantel (2), sekarang di Kerak (1), teleport ke Mantel',
  teleportToZone(buatState({ zona: 1, pernahKe: [0, 1, 2], pakaian: ['mantle_suit'] }), 2).success,
  true
);

uji(
  'Pernah ke Inti Dalam (4), sekarang di Kerak (1), teleport ke Inti Dalam',
  teleportToZone(
    buatState({
      zona: 1,
      pernahKe: [0, 1, 2, 3, 4],
      pakaian: ['mantle_suit', 'outer_core_suit', 'inner_core_suit'],
    }),
    4
  ).success,
  true
);

uji(
  'Pernah ke area 5, sekarang di Kerak, teleport ke area 5 (butuh diver_suit)',
  teleportToZone(
    buatState({
      zona: 1,
      pernahKe: [0, 1, 2, 3, 4, 5],
      pakaian: ['mantle_suit', 'outer_core_suit', 'inner_core_suit', 'diver_suit'],
    }),
    5
  ).success,
  true
);

uji(
  'Belum pernah ke area 5, teleport ke area 5 -> DITOLAK',
  teleportToZone(buatState({ zona: 1, pernahKe: [0, 1, 2] }), 5).success,
  false
);

uji(
  'Teleport ke area tempat berada sekarang -> DITOLAK',
  teleportToZone(buatState({ zona: 2, pernahKe: [0, 1, 2] }), 2).success,
  false
);

uji(
  'Teleport ke area yang tidak ada (99) -> DITOLAK',
  teleportToZone(buatState({ zona: 1, pernahKe: [0, 1] }), 99).success,
  false
);

uji(
  'Sedang berpindah area -> DITOLAK',
  (() => {
    const s = buatState({ zona: 1, pernahKe: [0, 1, 2] });
    s.isTransitioning = true;
    return teleportToZone(s, 2).success;
  })(),
  false
);

uji(
  'Teleport ke area berpakai, pakaian BELUM dibeli -> DITOLAK (bukan jalan pintas)',
  teleportToZone(buatState({ zona: 1, pernahKe: [0, 1, 2], pakaian: [] }), 2).success,
  false
);

uji(
  'Teleport ke area berpakai, pakaian SUDAH dibeli -> DIIZINKAN',
  teleportToZone(buatState({ zona: 1, pernahKe: [0, 1, 2], pakaian: ['mantle_suit'] }), 2).success,
  true
);

// ═══════════════════════════════════════════════════════════════════════════
console.log('\n── 2. PAKAIAN yang sudah dibeli tidak diminta beli lagi ──');

uji(
  'Sudah beli baju Mantel, kembali ke Kerak, turun lagi -> BOLEH',
  checkSuitRequirements(buatState({ zona: 1, pakaian: ['mantle_suit'], dipakai: null })),
  true
);

uji(
  'Sudah beli baju Mantel -> pakaian OTOMATIS dikenakan',
  (() => {
    const s = buatState({ zona: 1, pakaian: ['mantle_suit'], dipakai: null });
    checkSuitRequirements(s);
    return s.player.equippedSuit;
  })(),
  'mantle_suit'
);

uji(
  'Belum pernah beli baju Mantel -> DITOLAK, harus beli',
  checkSuitRequirements(buatState({ zona: 1, pakaian: [], dipakai: null })),
  false
);

uji(
  'Belum pernah beli -> muncul peringatan wajib beli',
  (() => {
    const s = buatState({ zona: 1, pakaian: [], dipakai: null });
    checkSuitRequirements(s);
    return s.pendingSuitRequired?.harusBeli === true;
  })(),
  true
);

uji(
  'Sudah beli -> TIDAK ada peringatan (langsung jalan)',
  (() => {
    const s = buatState({ zona: 1, pakaian: ['mantle_suit'], dipakai: null });
    checkSuitRequirements(s);
    return s.pendingSuitRequired === null;
  })(),
  true
);

uji(
  'Sudah beli 2 baju, kembali ke Kerak, turun lagi -> tetap dimiliki',
  (() => {
    const s = buatState({ zona: 1, pakaian: ['mantle_suit', 'outer_core_suit'], dipakai: null });
    const boleh = checkSuitRequirements(s);
    return boleh === true && s.player.equippedSuit === 'mantle_suit';
  })(),
  true
);

// ═══════════════════════════════════════════════════════════════════════════
console.log('\n── 3. PEMETAAN PAKAIAN PER ZONA (tidak boleh bergeser) ──');

uji('Area 0 Permukaan  -> tanpa pakaian', getRequiredSuitForZone(0), null);
uji('Area 1 Kerak      -> tanpa pakaian', getRequiredSuitForZone(1), null);
uji('Area 2 Mantel     -> mantle_suit', getRequiredSuitForZone(2), 'mantle_suit');
uji('Area 3 Inti Luar  -> outer_core_suit', getRequiredSuitForZone(3), 'outer_core_suit');
uji('Area 4 Inti Dalam -> inner_core_suit', getRequiredSuitForZone(4), 'inner_core_suit');
uji('Area 5 Divergen   -> diver_suit', getRequiredSuitForZone(5), 'diver_suit');
uji('Area 6 Konvergen  -> diver_suit', getRequiredSuitForZone(6), 'diver_suit');
uji('Area 7 Transform  -> diver_suit', getRequiredSuitForZone(7), 'diver_suit');

console.log('\n' + '='.repeat(76));
console.log(`  HASIL: ${lulus} lulus, ${gagal} gagal dari ${lulus + gagal} pemeriksaan`);
console.log('='.repeat(76) + '\n');

try { rmSync(dirSementara, { recursive: true, force: true }); } catch { /* abaikan */ }
process.exit(gagal > 0 ? 1 : 0);
