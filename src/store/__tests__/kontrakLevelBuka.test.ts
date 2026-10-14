// ── kontrakLevelBuka.test.ts ─────────────────────────────────────────────────
// Uji agar `unlockLevel()` tidak pernah diminta membuka level di luar rentang
// yang diterima database.
//
// ═══════════════════════════════════════════════════════════════════════════
// MENGAPA UJI INI ADA — KEJADIAN NYATA
// ═══════════════════════════════════════════════════════════════════════════
//
//   `missionStore` pernah memanggil `unlockLevel(4)` setelah seluruh misi
//   tuntas, dengan alasan "Unlock beyond Level 3". Padahal:
//
//     - Tidak ada Level 4. Kolom `unlocked_level` dibatasi 1..3 oleh CHECK
//       constraint di `supabase/migrations/01_secure_schema.sql`.
//     - Trigger di server MENGABAIKAN setiap perubahan `unlocked_level` yang
//       datang dari klien, jadi angka 4 itu tidak akan pernah tersimpan.
//     - `unlockLevel()` sendiri TIDAK menjepit nilainya, meski variabelnya sudah
//       bernama `allowedLevel` - niatnya ada, tetapi tidak diwujudkan.
//
//   Akibatnya nilai itu hanya membuat keadaan LOKAL bertambah tanpa pernah
//   tersimpan, lalu hilang saat login berikutnya - seolah levelnya mundur.
//
// CARA MEMERIKSA
//   Batasnya TIDAK ditulis tangan di uji ini. Nilainya dibaca dari CHECK
//   constraint di berkas migrasi database, lalu dibandingkan dengan:
//     1. konstanta klien MAKS_LEVEL_BUKA, dan
//     2. setiap pemanggilan unlockLevel(<angka>) di seluruh berkas sumber.
//
//   Dengan begitu, bila batas di database berubah tanpa menyesuaikan kode,
//   uji ini gagal - dan sebaliknya.
//
// Jalankan: npm run test

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const AKAR_SRC = fileURLToPath(new URL('../../', import.meta.url));
const MIGRASI = fileURLToPath(new URL('../../../supabase/migrations/01_secure_schema.sql', import.meta.url));
const TEACHER_STORE = fileURLToPath(new URL('../teacherStore.ts', import.meta.url));

/** Batas atas `unlocked_level` menurut CHECK constraint di database. */
function batasDariDatabase(): number {
  const sql = readFileSync(MIGRASI, 'utf8');
  const cocok = sql.match(/unlocked_level\s+INT[^\n]*CHECK\s*\(\s*unlocked_level\s+BETWEEN\s+1\s+AND\s+(\d+)\s*\)/i);
  assert.ok(cocok, 'CHECK constraint untuk unlocked_level tidak ditemukan di migrasi database');
  return Number(cocok[1]);
}

/** Seluruh berkas .ts dan .tsx di bawah src/. */
function berkasSumber(): string[] {
  const hasil: string[] = [];
  const jelajah = (dir: string) => {
    for (const nama of readdirSync(dir)) {
      const penuh = join(dir, nama);
      if (statSync(penuh).isDirectory()) {
        if (nama !== '__tests__') jelajah(penuh);
        continue;
      }
      if (/\.tsx?$/.test(nama)) hasil.push(penuh);
    }
  };
  jelajah(AKAR_SRC);
  return hasil;
}

const relatif = (penuh: string) => penuh.slice(AKAR_SRC.length).replace(/\\/g, '/');

describe('level buka — batas dari database', () => {
  const batas = batasDariDatabase();

  test('batas terbaca dari CHECK constraint', () => {
    assert.ok(Number.isInteger(batas) && batas >= 1, `batas tidak wajar: ${batas}`);
  });

  test('MAKS_LEVEL_BUKA di klien SAMA DENGAN batas di database', () => {
    const isi = readFileSync(TEACHER_STORE, 'utf8');
    const cocok = isi.match(/MAKS_LEVEL_BUKA\s*=\s*(\d+)/);
    assert.ok(cocok, 'konstanta MAKS_LEVEL_BUKA tidak ditemukan di teacherStore.ts');
    assert.equal(
      Number(cocok[1]),
      batas,
      `klien memakai batas ${cocok[1]} sedangkan database membatasi ${batas}`,
    );
  });

  test('tidak ada pemanggilan unlockLevel di atas batas database', () => {
    // Inilah penjaga utamanya. Nilai di atas batas tidak akan pernah tersimpan
    // (trigger server mengabaikannya), sehingga hanya menghasilkan keadaan lokal
    // yang hilang saat login berikutnya.
    const pelanggar: string[] = [];

    for (const berkas of berkasSumber()) {
      const isi = readFileSync(berkas, 'utf8');
      for (const m of isi.matchAll(/unlockLevel\(\s*(\d+)\s*\)/g)) {
        const diminta = Number(m[1]);
        if (diminta > batas || diminta < 1) {
          pelanggar.push(`${relatif(berkas)} -> unlockLevel(${diminta})`);
        }
      }
    }

    assert.deepEqual(
      pelanggar,
      [],
      `unlockLevel diminta membuka level di luar rentang 1..${batas} — nilainya tidak akan tersimpan:\n  ${pelanggar.join('\n  ')}`,
    );
  });

  test('unlockLevel yang bertanda angka tetap hanya memakai 2 dan 3', () => {
    // Kedua level itulah yang memang dapat dibuka oleh siswa (Level 1 selalu
    // terbuka, Level 3 dibuka setelah Level 2 tuntas).
    const diminta = new Set<number>();
    for (const berkas of berkasSumber()) {
      for (const m of readFileSync(berkas, 'utf8').matchAll(/unlockLevel\(\s*(\d+)\s*\)/g)) {
        diminta.add(Number(m[1]));
      }
    }
    assert.deepEqual([...diminta].sort(), [2, 3]);
  });
});
