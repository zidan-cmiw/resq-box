// ── kontrakTracker.test.ts ───────────────────────────────────────────────────
// Uji agar tracker progres Level 2 tetap SAMA dengan Level 1.
//
// ═══════════════════════════════════════════════════════════════════════════
// MENGAPA UJI INI ADA — KEJADIAN NYATA
// ═══════════════════════════════════════════════════════════════════════════
//
//   Keluhan pemilik proyek: "samakan tracker Level 2 dengan Level 1 - Level 2
//   masih bertumpuk."
//
//   Penyebabnya bukan komponen trackernya, melainkan PEMBUNGKUSNYA di Level 2:
//   komponen `JourneyProgressTracker` TIDAK punya lebar bawaan, sehingga tanpa
//   kelas lebar pada pembungkusnya ia meluber dan saling menumpuk. Level 1 sudah
//   benar sejak awal.
//
//   Karena itu yang diperiksa di sini adalah KESAMAAN keduanya, bukan sekadar
//   ada atau tidaknya sebuah kelas. Bila kelak salah satu diubah dan yang lain
//   tidak, keduanya akan berbeda lagi dengan cara yang persis sama.
//
// Jalankan: npm run test

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const LEVEL1 = readFileSync(new URL('../../app/Level1/EarthDive/EarthDiveGame.tsx', import.meta.url), 'utf8');
const LEVEL2 = readFileSync(new URL('../../app/Level2/engine/TectonicGame.tsx', import.meta.url), 'utf8');

/**
 * Kelas pada pembungkus <div> yang membungkus <JourneyProgressTracker ... />.
 *
 * Diambil dari pembungkus TERDEKAT sebelum komponennya, karena di kedua berkas
 * ada banyak <div> lain.
 */
function kelasPembungkus(isi: string): string {
  const cocok = isi.match(/<div\s+className="([^"]+)"\s*>\s*\n\s*<JourneyProgressTracker/);
  assert.ok(cocok, 'pembungkus <JourneyProgressTracker> tidak ditemukan - polanya mungkin berubah');
  return cocok[1].trim().replace(/\s+/g, ' ');
}

describe('tracker progres — Level 2 harus sama dengan Level 1', () => {
  const kelas1 = kelasPembungkus(LEVEL1);
  const kelas2 = kelasPembungkus(LEVEL2);

  test('kedua level memakai komponen tracker yang sama', () => {
    const impor1 = LEVEL1.match(/from '([^']*JourneyProgressTracker)'/);
    const impor2 = LEVEL2.match(/from '([^']*JourneyProgressTracker)'/);
    assert.ok(impor1 && impor2, 'impor JourneyProgressTracker tidak ditemukan');
    assert.equal(impor2[1], impor1[1], 'kedua level mengimpor komponen tracker dari berkas yang berbeda');
  });

  test('kelas pembungkus tracker IDENTIK di kedua level', () => {
    assert.equal(
      kelas2,
      kelas1,
      'pembungkus tracker Level 2 berbeda dari Level 1 - tampilannya akan berbeda pula:\n' +
        `  Level 1: ${kelas1}\n  Level 2: ${kelas2}`,
    );
  });

  test('pembungkus punya kelas LEBAR di kedua level', () => {
    // Inilah akar keluhan "bertumpuk": komponen tracker tidak punya lebar
    // bawaan, jadi tanpa kelas lebar pada pembungkusnya ia meluber.
    for (const [nama, kelas] of [['Level 1', kelas1], ['Level 2', kelas2]] as const) {
      assert.ok(
        /(^|\s)(w-|max-w-)/.test(kelas),
        `pembungkus tracker ${nama} tidak punya kelas lebar - trackernya akan meluber dan bertumpuk`,
      );
    }
  });

  test('kedua level menempatkan tracker pada posisi yang sama', () => {
    for (const [nama, kelas] of [['Level 1', kelas1], ['Level 2', kelas2]] as const) {
      assert.ok(/(^|\s)top-/.test(kelas), `tracker ${nama} tidak punya kelas posisi atas (top-*)`);
      assert.ok(/(^|\s)absolute/.test(kelas), `tracker ${nama} tidak diposisikan absolute`);
      assert.ok(
        /(^|\s)-translate-x-1\/2/.test(kelas),
        `tracker ${nama} tidak dipusatkan mendatar (-translate-x-1/2)`,
      );
    }
  });
});
