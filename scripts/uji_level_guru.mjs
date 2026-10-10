/**
 * Uji: level mana yang boleh dibuka oleh tiap peran.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * MENGAPA BERKAS INI ADA
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Guru perlu membuka dan menguji ketiga level untuk demonstrasi di kelas.
 * Tetapi akun guru dibuat dengan `unlocked_level = 1`, sehingga Level 2 dan
 * Level 3 terhalang — padahal kartu levelnya di beranda TAMPAK terbuka.
 * Gejalanya menyesatkan: ditekan, tidak terjadi apa-apa.
 *
 * Penyebabnya aturan yang sama ditulis ulang di beberapa tempat, dan tidak
 * semuanya diperbarui:
 *
 *     Dashboard       kartu level tampak TERBUKA untuk guru  (sudah benar)
 *     App.tsx         LevelGuard mengalihkan kembali ke beranda (SALAH)
 *     Dashboard       handleLevelClick memainkan suara terkunci (SALAH)
 *
 * Perbaikannya mengumpulkan aturan itu di satu fungsi,
 * `levelTertinggiYangBoleh`. Berkas ini menguji fungsi itu LANGSUNG, supaya
 * aturannya tidak dapat berbeda lagi antar tempat.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * MENGAPA BUNDEL DULU, BARU DIUJI
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * `teacherStore.ts` mengimpor berkas lain tanpa ekstensi (cara Vite), dan
 * mengimpor store yang membaca `localStorage`. Node tidak menyediakan
 * keduanya. Karena itu engine-nya dibundel memakai API Vite lebih dulu —
 * sehingga yang diuji adalah KODE ASLI yang sama dengan yang dijalankan
 * aplikasi, bukan salinan logikanya.
 *
 * Cara menjalankan:
 *     npm run test:level-guru
 */
import { build } from 'vite';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const AKAR = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// ── 1. Bundel fungsi aturannya ────────────────────────────────────────────
const dirSementara = mkdtempSync(join(tmpdir(), 'resq-uji-level-'));
const berkasMasuk = join(AKAR, 'scripts', '_uji_level_masuk.ts');

writeFileSync(
  berkasMasuk,
  `export { levelTertinggiYangBoleh } from '../src/store/teacherStore';\n`,
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
      lib: { entry: berkasMasuk, formats: ['es'], fileName: () => 'level.mjs' },
      minify: false,
      rollupOptions: { external: [] },
    },
  });

  // ── 2. Tiruan `localStorage` ─────────────────────────────────────────────
  //
  // `teacherStore.ts` membaca `localStorage` saat MODULNYA DIMUAT (untuk
  // memulihkan sesi yang tersimpan), dan Node tidak menyediakannya. Tanpa
  // tiruan ini, impor gagal sebelum satu pun pemeriksaan berjalan.
  //
  // Tiruan ini sengaja dibuat sesederhana mungkin dan SELALU KOSONG: yang
  // diuji adalah aturan peran, bukan pemulihan sesi. Nilai kosong juga
  // memastikan tidak ada sesi tersimpan yang memengaruhi hasil uji.
  const penyimpanan = new Map();
  globalThis.localStorage = {
    getItem: (k) => (penyimpanan.has(k) ? penyimpanan.get(k) : null),
    setItem: (k, v) => penyimpanan.set(k, String(v)),
    removeItem: (k) => penyimpanan.delete(k),
    clear: () => penyimpanan.clear(),
    key: (i) => Array.from(penyimpanan.keys())[i] ?? null,
    get length() {
      return penyimpanan.size;
    },
  };

  ekspor = await import(pathToFileURL(join(dirSementara, 'level.mjs')).href);
} finally {
  try { rmSync(berkasMasuk, { force: true }); } catch { /* abaikan */ }
}

const { levelTertinggiYangBoleh } = ekspor;

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
console.log('  UJI: LEVEL YANG BOLEH DIBUKA PER PERAN');
console.log('='.repeat(76));
console.log('  Memakai kode asli dari src/store/teacherStore.ts (dibundel Vite).');

// ═══════════════════════════════════════════════════════════════════════════
console.log('\n── GURU: harus dapat SELURUH level, berapa pun unlocked_level-nya ──');

uji('Guru dengan unlocked_level = 1 (nilai bawaan akun baru) -> Level 1', levelTertinggiYangBoleh('teacher', 1) >= 1, true);
uji('Guru dengan unlocked_level = 1 -> Level 2 boleh', levelTertinggiYangBoleh('teacher', 1) >= 2, true);
uji('Guru dengan unlocked_level = 1 -> Level 3 boleh', levelTertinggiYangBoleh('teacher', 1) >= 3, true);
uji('Guru dengan unlocked_level = 0 -> Level 1 boleh', levelTertinggiYangBoleh('teacher', 0) >= 1, true);
uji('Guru dengan unlocked_level = 0 -> Level 3 boleh', levelTertinggiYangBoleh('teacher', 0) >= 3, true);
uji('Guru dengan unlocked_level = 2 -> Level 3 boleh', levelTertinggiYangBoleh('teacher', 2) >= 3, true);

// ═══════════════════════════════════════════════════════════════════════════
console.log('\n── ADMIN: sama seperti guru ──');

uji('Admin dengan unlocked_level = 1 -> Level 2 boleh', levelTertinggiYangBoleh('admin', 1) >= 2, true);
uji('Admin dengan unlocked_level = 1 -> Level 3 boleh', levelTertinggiYangBoleh('admin', 1) >= 3, true);

// ═══════════════════════════════════════════════════════════════════════════
console.log('\n── SISWA: TIDAK berubah, tetap mengikuti capaian ──');

uji('Siswa dengan unlocked_level = 1 -> Level 1 boleh', levelTertinggiYangBoleh('student', 1) >= 1, true);
uji('Siswa dengan unlocked_level = 1 -> Level 2 TERKUNCI', levelTertinggiYangBoleh('student', 1) >= 2, false);
uji('Siswa dengan unlocked_level = 1 -> Level 3 TERKUNCI', levelTertinggiYangBoleh('student', 1) >= 3, false);
uji('Siswa dengan unlocked_level = 2 -> Level 2 boleh', levelTertinggiYangBoleh('student', 2) >= 2, true);
uji('Siswa dengan unlocked_level = 2 -> Level 3 TERKUNCI', levelTertinggiYangBoleh('student', 2) >= 3, false);
uji('Siswa dengan unlocked_level = 3 -> Level 3 boleh', levelTertinggiYangBoleh('student', 3) >= 3, true);

// ═══════════════════════════════════════════════════════════════════════════
console.log('\n── PERAN TIDAK DIKENAL: diperlakukan sebagai siswa (aman) ──');
//
// Pemeriksaan ini penting: bila peran kosong diperlakukan sebagai guru, siswa
// yang datanya belum termuat sesaat akan mendapat akses penuh. Untuk hal yang
// berkaitan dengan akses, arah yang aman adalah MENOLAK lebih dulu.
uji('Peran undefined dengan level 1 -> Level 2 TERKUNCI', levelTertinggiYangBoleh(undefined, 1) >= 2, false);
uji('Peran null dengan level 1 -> Level 3 TERKUNCI', levelTertinggiYangBoleh(null, 1) >= 3, false);
uji('Peran kosong "" dengan level 1 -> Level 2 TERKUNCI', levelTertinggiYangBoleh('', 1) >= 2, false);
uji('Peran tak dikenal "x" dengan level 1 -> Level 3 TERKUNCI', levelTertinggiYangBoleh('x', 1) >= 3, false);

console.log('\n' + '='.repeat(76));
console.log(`  HASIL: ${lulus} lulus, ${gagal} gagal dari ${lulus + gagal} pemeriksaan`);
console.log('='.repeat(76) + '\n');

try { rmSync(dirSementara, { recursive: true, force: true }); } catch { /* abaikan */ }
process.exit(gagal > 0 ? 1 : 0);
