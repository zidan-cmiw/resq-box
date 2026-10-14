// ── kontrakTutorial.test.ts ──────────────────────────────────────────────────
// Uji KONTRAK antara tutorial blok berpanah dan definisi blok yang sebenarnya.
//
// ═══════════════════════════════════════════════════════════════════════════
// MENGAPA UJI INI ADA
// ═══════════════════════════════════════════════════════════════════════════
//
//   Tutorial blok berpanah (TutorialBlok.tsx) bergantung pada beberapa hal di
//   berkas LAIN, dan bila salah satu berubah, tutorialnya rusak TANPA ERROR:
//
//     1. Id blok `resq_program` dan `resq_lampu_status`. Kalau salah ketik,
//        langkah 2 dan 3 tidak akan PERNAH bisa dilewati - siswa mentok.
//     2. Blok lampu wajib ada di dalam toolbox, dan berada pada kategori yang
//        disebut tutorial ("Peringatan & EWS"). Kalau kategorinya diganti nama,
//        instruksi tutorialnya menyesatkan.
//     3. Blok `resq_program` wajib punya input pernyataan. Tanpa itu, blok lampu
//        TIDAK MUNGKIN diseret ke dalamnya - dan tutorialnya mustahil dituntaskan.
//     4. Blok lampu wajib berupa blok pernyataan (punya sambungan sebelumnya),
//        supaya memang bisa masuk ke input pernyataan tadi.
//
//   Pemeriksaan ini membaca berkas sumbernya sebagai teks. Cara itu memang tidak
//   secantik mengimpor modulnya, tetapi Blockly memerlukan lingkungan peramban
//   sehingga tidak dapat dimuat di dalam uji Node. Yang diperiksa sengaja
//   penanda yang stabil (id blok, nama kategori, nama fungsi), bukan seluruh isi.
//
// Jalankan: npm run test

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const baca = (jalur: string) => readFileSync(new URL(jalur, import.meta.url), 'utf8');

const CORE = baca('../../../engine/blockly/blocks/core.ts');
const TOOLBOX = baca('../BlockEditor/BlocklyComponent.tsx');
const TUTORIAL = baca('../TutorialBlok.tsx');

describe('kontrak tutorial blok — id blok', () => {
  test('kedua id blok yang dipakai tutorial benar-benar terdefinisi', () => {
    for (const id of ['resq_program', 'resq_lampu_status']) {
      assert.ok(
        CORE.includes(`Blockly.Blocks['${id}']`),
        `blok "${id}" tidak terdefinisi di core.ts — tutorialnya akan mentok tanpa error`,
      );
    }
  });

  test('id blok yang dipakai tutorial sama dengan yang tertulis di komponennya', () => {
    // Menjaga agar uji ini tidak ikut basi bila id di TutorialBlok diganti.
    assert.ok(TUTORIAL.includes("'resq_program'"), 'TutorialBlok tidak lagi memakai resq_program');
    assert.ok(TUTORIAL.includes("'resq_lampu_status'"), 'TutorialBlok tidak lagi memakai resq_lampu_status');
  });
});

describe('kontrak tutorial blok — toolbox', () => {
  test('blok lampu benar-benar tersedia di toolbox', () => {
    // Tanpa ini, siswa tidak akan menemukan blok yang diminta tutorial.
    assert.ok(
      TOOLBOX.includes("type: 'resq_lampu_status'"),
      'resq_lampu_status tidak ada di toolbox — siswa tidak dapat mengambilnya',
    );
  });

  test('blok program tersedia di toolbox', () => {
    assert.ok(TOOLBOX.includes("type: 'resq_program'"), 'resq_program tidak ada di toolbox');
  });

  test('kategori yang disebut tutorial benar-benar ada', () => {
    // Teks tutorial menyuruh siswa membuka kategori "Peringatan & EWS".
    assert.ok(
      TOOLBOX.includes("name: 'Peringatan & EWS'"),
      'kategori "Peringatan & EWS" tidak ada — instruksi tutorialnya menyesatkan',
    );
  });
});

describe('kontrak tutorial blok — bentuk blok', () => {
  /** Ambil isi definisi sebuah blok, dari namanya sampai penutup objeknya. */
  function definisiBlok(id: string): string {
    const awal = CORE.indexOf(`Blockly.Blocks['${id}'] = {`);
    assert.ok(awal >= 0, `definisi blok "${id}" tidak ditemukan`);
    const akhir = CORE.indexOf('\n  };', awal);
    assert.ok(akhir > awal, `penutup definisi blok "${id}" tidak ditemukan`);
    return CORE.slice(awal, akhir);
  }

  test('blok program punya input pernyataan, supaya blok lain bisa dimasukkan', () => {
    // Inilah yang membuat langkah 3 tutorial mungkin: menyeret blok lampu KE
    // DALAM blok program. Tanpa input pernyataan, langkah itu mustahil.
    const isi = definisiBlok('resq_program');
    assert.ok(
      isi.includes('appendStatementInput'),
      'resq_program tidak punya input pernyataan — tutorial langkah 3 mustahil diselesaikan',
    );
    assert.ok(
      isi.includes("appendStatementInput('SETUP')"),
      'input pernyataan SETUP tidak ditemukan di resq_program',
    );
  });

  test('blok lampu berupa blok pernyataan, supaya bisa masuk ke input pernyataan', () => {
    const isi = definisiBlok('resq_lampu_status');
    assert.ok(
      isi.includes('setPreviousStatement(true'),
      'resq_lampu_status bukan blok pernyataan — ia tidak dapat dimasukkan ke blok program',
    );
  });
});

describe('kontrak tutorial blok — teks instruksi cocok dengan label sebenarnya', () => {
  test('label blok program sesuai yang disebut tutorial', () => {
    // Tutorial menyebut blok besar ini "Sistem Mitigasi".
    assert.ok(
      CORE.includes("appendField('Sistem Mitigasi')"),
      'label "Sistem Mitigasi" tidak ada — siswa akan mencari blok yang salah',
    );
  });

  test('label input pernyataan sesuai yang disebut tutorial', () => {
    // Tutorial menyuruh menyeret ke bagian "Mulai Saat Dihidupkan".
    assert.ok(
      CORE.includes("appendField('Mulai Saat Dihidupkan')"),
      'label "Mulai Saat Dihidupkan" tidak ada — instruksi tutorialnya menyesatkan',
    );
  });

  test('label blok lampu sesuai yang disebut tutorial', () => {
    // Tutorial menyebut blok "Atur Lampu Status".
    assert.ok(
      CORE.includes("appendField('Atur Lampu Status ke')"),
      'label "Atur Lampu Status" tidak ada — siswa akan mencari blok yang salah',
    );
  });
});
