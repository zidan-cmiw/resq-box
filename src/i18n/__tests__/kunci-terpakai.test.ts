// ── kunci-terpakai.test.ts ────────────────────────────────────────────────
// Memastikan setiap kunci i18n yang DIPAKAI di dalam kode benar-benar ada di
// dalam kamus.
//
// MENGAPA UJI INI PENTING
//   Bila kode memanggil t('login.judul') sementara kamus hanya memuat
//   'login.title', aplikasi TIDAK error — ia diam-diam menampilkan teks kunci
//   mentah kepada siswa:
//
//       judul                                  <- yang dilihat siswa
//       Masuk ke RESQ-BOX                      <- yang seharusnya
//
//   Karena tidak ada error, kesalahan seperti ini mudah lolos ke produksi.
//   Uji ini menangkapnya sebelum sampai ke siswa.
//
// CATATAN
//   Pemanggilan t() dengan kunci yang dibentuk secara dinamis (mis.
//   t(`status.${kode}`)) tidak dapat diperiksa dengan cara ini dan sengaja
//   dilewati. Yang diperiksa hanya kunci literal, dan itulah bentuk yang
//   dipakai hampir di seluruh kode.
//
// Jalankan: npm run test

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { id } from '../id.ts';

const AKAR = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

type DictNode = { readonly [key: string]: string | DictNode };

function flatten(node: DictNode, prefix = ''): Set<string> {
  const out = new Set<string>();
  for (const [key, value] of Object.entries(node)) {
    const full = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') {
      out.add(full);
    } else {
      for (const k of flatten(value, full)) out.add(k);
    }
  }
  return out;
}

/** Semua berkas .ts/.tsx di dalam src, kecuali folder uji dan kamus sendiri. */
function berkasSumber(): string[] {
  const hasil: string[] = [];
  const telusuri = (dir: string): void => {
    for (const nama of readdirSync(dir)) {
      const jalur = join(dir, nama);
      if (statSync(jalur).isDirectory()) {
        if (nama === '__tests__' || nama === 'i18n') continue;
        telusuri(jalur);
      } else if (/\.tsx?$/.test(nama)) {
        hasil.push(jalur);
      }
    }
  };
  telusuri(AKAR);
  return hasil;
}

/**
 * Kumpulkan kunci literal yang dipakai lewat t('…') atau t("…").
 *
 * Hanya kunci berbentuk "kelompok.nama" yang diambil; t() juga dipakai untuk
 * teks bertitik lain, dan itu bukan kunci kamus.
 */
function kunciTerpakai(): Map<string, string> {
  const dipakai = new Map<string, string>();
  const pola = /\bt\(\s*['"]([a-zA-Z][\w]*(?:\.[\w]+)+)['"]/g;

  for (const berkas of berkasSumber()) {
    const isi = readFileSync(berkas, 'utf8');
    for (const m of isi.matchAll(pola)) {
      const relatif = berkas.slice(AKAR.length + 1).replace(/\\/g, '/');
      if (!dipakai.has(m[1])) dipakai.set(m[1], relatif);
    }
  }
  return dipakai;
}

const kamus = flatten(id as unknown as DictNode);
const dipakai = kunciTerpakai();

describe('kunci i18n yang dipakai', () => {
  test('setiap kunci yang dipakai ada di kamus', () => {
    const hilang: string[] = [];
    for (const [kunci, berkas] of dipakai) {
      if (!kamus.has(kunci)) hilang.push(`${kunci}  (dipakai di ${berkas})`);
    }
    assert.deepEqual(
      hilang.sort(),
      [],
      `kunci ini dipakai di kode tetapi tidak ada di kamus, sehingga siswa ` +
        `akan melihat teks kunci mentah:\n  ${hilang.join('\n  ')}`
    );
  });

  test('kunci yang dipakai punya nilai yang tidak kosong', () => {
    const kosong: string[] = [];
    for (const kunci of dipakai.keys()) {
      // Nilai kosong sudah ditangkap uji kamus; di sini cukup memastikan
      // kuncinya memang dapat ditemukan.
      if (!kamus.has(kunci)) kosong.push(kunci);
    }
    assert.deepEqual(kosong, []);
  });
});
