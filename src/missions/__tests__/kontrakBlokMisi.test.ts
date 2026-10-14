// ── kontrakBlokMisi.test.ts ──────────────────────────────────────────────────
// Uji kontrak antara BLOK YANG DISYARATKAN MISI dan BLOK YANG BENAR-BENAR ADA.
//
// ═══════════════════════════════════════════════════════════════════════════
// MENGAPA UJI INI ADA
// ═══════════════════════════════════════════════════════════════════════════
//
//   Setiap misi menyebut daftar blok yang wajib dipakai siswa (`requiredBlocks`).
//   Daftar itu diperiksa oleh mesin validasi saat siswa menekan "Periksa".
//
//   Bahayanya: kalau sebuah blok DIHAPUS atau DIGANTI NAMA, tetapi masih
//   disyaratkan oleh suatu misi, maka:
//
//     - blok itu tidak dapat diambil siswa dari toolbox, sehingga
//     - misi tersebut MUSTAHIL diselesaikan, dan
//     - TIDAK ADA error yang muncul - siswa hanya akan gagal terus.
//
//   Ini bukan kekhawatiran teoritis: sepuluh blok yatim pernah dihapus dari
//   proyek ini. Ketika itu kebetulan tidak ada misi yang memakainya, tetapi
//   tidak ada apa pun yang menjaminnya. Uji inilah yang menjaminnya.
//
//   Arah sebaliknya juga diperiksa: blok yang terdefinisi tetapi TIDAK ada di
//   toolbox berarti blok yang tidak akan pernah dapat dipakai siswa - persis
//   masalah sepuluh blok yatim itu.
//
// Jalankan: npm run test

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { MISSIONS } from '../data/missions.ts';

const baca = (jalur: string) => readFileSync(new URL(jalur, import.meta.url), 'utf8');

const CORE = baca('../../engine/blockly/blocks/core.ts');
const TOOLBOX = baca('../../app/Workspace/BlockEditor/BlocklyComponent.tsx');

/** Seluruh tipe blok yang benar-benar didefinisikan. */
function blokTerdefinisi(): string[] {
  const nama = [...CORE.matchAll(/Blockly\.Blocks\['(resq_[a-z0-9_]+)'\]/g)].map((m) => m[1]);
  return [...new Set(nama)];
}

/** Seluruh tipe blok yang tersedia di toolbox (jadi dapat diambil siswa). */
function blokDiToolbox(): Set<string> {
  const nama = [...TOOLBOX.matchAll(/type:\s*'(resq_[a-z0-9_]+)'/g)].map((m) => m[1]);
  return new Set(nama);
}

/** Seluruh blok yang disyaratkan misi, beserta misi yang mensyaratkannya. */
function blokDisyaratkan(): { id: string; blok: string }[] {
  const hasil: { id: string; blok: string }[] = [];
  for (const misi of MISSIONS) {
    // requiredBlocks berada DI DALAM `validation`, bukan langsung pada misi.
    for (const blok of misi.validation.requiredBlocks ?? []) {
      hasil.push({ id: misi.id, blok });
    }
  }
  return hasil;
}

describe('kontrak blok misi — prasyarat uji', () => {
  test('blok terdefinisi terbaca dari sumber', () => {
    assert.ok(blokTerdefinisi().length >= 20, `hanya ${blokTerdefinisi().length} blok terbaca - polanya mungkin berubah`);
  });

  test('blok toolbox terbaca dari sumber', () => {
    assert.ok(blokDiToolbox().size >= 20, `hanya ${blokDiToolbox().size} blok terbaca dari toolbox`);
  });

  test('misi menyebut blok yang disyaratkan', () => {
    assert.ok(blokDisyaratkan().length > 0, 'tidak ada requiredBlocks yang terbaca - uji ini jadi tidak berarti');
  });
});

describe('kontrak blok misi — misi tidak boleh mustahil diselesaikan', () => {
  test('SETIAP blok yang disyaratkan misi benar-benar TERDEFINISI', () => {
    // Kalau gagal di sini, ada misi yang meminta blok yang tidak ada - dan misi
    // itu mustahil diselesaikan tanpa error apa pun.
    const terdefinisi = new Set(blokTerdefinisi());
    const hilang = blokDisyaratkan()
      .filter(({ blok }) => !terdefinisi.has(blok))
      .map(({ id, blok }) => `misi ${id} meminta "${blok}"`);

    assert.deepEqual(
      hilang,
      [],
      `blok yang disyaratkan misi tetapi tidak terdefinisi:\n  ${[...new Set(hilang)].join('\n  ')}`,
    );
  });

  test('SETIAP blok yang disyaratkan misi TERSEDIA di toolbox', () => {
    // Terdefinisi saja belum cukup: kalau tidak ada di toolbox, siswa tidak
    // dapat mengambilnya, sehingga misinya tetap mustahil diselesaikan.
    const toolbox = blokDiToolbox();
    const takTerjangkau = blokDisyaratkan()
      .filter(({ blok }) => !toolbox.has(blok))
      .map(({ id, blok }) => `misi ${id} meminta "${blok}"`);

    assert.deepEqual(
      takTerjangkau,
      [],
      `blok yang disyaratkan misi tetapi tidak ada di toolbox:\n  ${[...new Set(takTerjangkau)].join('\n  ')}`,
    );
  });

  test('setiap misi menyebut minimal satu blok', () => {
    // requiredBlocks sudah diwajibkan pada tipenya; uji ini memastikan datanya
    // benar-benar mengikuti, bukan hanya tipenya.
    const kosong = MISSIONS.filter((m) => (m.validation.requiredBlocks ?? []).length === 0).map((m) => m.id);
    assert.deepEqual(kosong, [], `misi tanpa requiredBlocks: ${kosong.join(', ')}`);
  });
});

describe('kontrak blok misi — tidak ada blok yang tidak terjangkau', () => {
  test('SETIAP blok yang terdefinisi ADA di toolbox', () => {
    // Arah sebaliknya. Sepuluh blok yatim pernah ada di proyek ini: terdefinisi
    // tetapi tidak dimuat toolbox, sehingga tidak akan pernah dapat dipakai
    // siswa. Uji ini mencegah hal itu terulang.
    const toolbox = blokDiToolbox();
    const yatim = blokTerdefinisi().filter((b) => !toolbox.has(b));

    assert.deepEqual(yatim, [], `blok terdefinisi tetapi tidak ada di toolbox: ${yatim.join(', ')}`);
  });

  test('setiap blok di toolbox benar-benar terdefinisi', () => {
    // Kebalikannya: toolbox yang memuat blok tak terdefinisi akan gagal saat
    // dimuat peramban, dan itu merusak seluruh editor blok.
    const terdefinisi = new Set(blokTerdefinisi());
    const asing = [...blokDiToolbox()].filter((b) => !terdefinisi.has(b));

    assert.deepEqual(asing, [], `blok di toolbox yang tidak terdefinisi: ${asing.join(', ')}`);
  });
});
