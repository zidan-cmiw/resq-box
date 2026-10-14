// ── kataWordle.test.ts ───────────────────────────────────────────────────────
// Uji bank kata teka-teki kata (Wordle) Level 1.
//
// MENGAPA UJI INI ADA
//
//   Petunjuk yang memuat kata jawabannya sendiri membuat teka-teki itu tidak ada
//   gunanya. Kebocoran seperti itu SUDAH PERNAH terjadi di bank ini:
//
//     - JALUR -> "Jalur evakuasi aman yang wajib diikuti warga ..."
//     - SUSUL -> "Gempa susulan adalah gempa skala lebih kecil ..."
//
//   Keduanya baru ketahuan setelah banner "KESEMPATAN HABIS" terbukti
//   membocorkan jawaban dan petunjuk mulai ditampilkan. Uji ini memastikan
//   kebocoran yang sama tidak dapat terjadi lagi tanpa ketahuan.
//
// Jalankan: npm run test

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { WORD_BANK } from '../kataWordle.ts';

describe('bank kata Wordle — keabsahan isi', () => {
  test('bank tidak kosong', () => {
    assert.ok(WORD_BANK.length >= 5, `hanya ${WORD_BANK.length} kata — bank tampaknya terpotong`);
  });

  test('tidak ada kata yang diulang', () => {
    const kata = WORD_BANK.map((k) => k.word);
    const ganda = [...new Set(kata.filter((x, i) => kata.indexOf(x) !== i))];
    assert.deepEqual(ganda, [], `kata diulang: ${ganda.join(', ')}`);
  });

  test('setiap kata ditulis kapital A-Z tanpa spasi', () => {
    const salah: string[] = [];
    for (const k of WORD_BANK) {
      if (!/^[A-Z]+$/.test(k.word)) salah.push(`"${k.word}"`);
    }
    assert.deepEqual(salah, [], `kata bermasalah: ${salah.join(', ')}`);
  });

  test('setiap kata cukup panjang untuk ditebak', () => {
    const pendek = WORD_BANK.filter((k) => k.word.length < 3).map((k) => k.word);
    assert.deepEqual(pendek, [], `kata terlalu pendek: ${pendek.join(', ')}`);
  });

  test('PETUNJUK tidak boleh memuat kata jawabannya sendiri', () => {
    // Inilah uji terpenting di berkas ini. Pencocokan dilakukan tanpa peduli
    // huruf besar/kecil, dan juga menangkap jawaban yang tersembunyi di dalam
    // kata lain (mis. "susulan" memuat "SUSUL").
    const bocor: string[] = [];
    for (const k of WORD_BANK) {
      if (k.hint.toUpperCase().includes(k.word)) {
        bocor.push(`"${k.word}" -> "${k.hint}"`);
      }
    }
    assert.deepEqual(bocor, [], `petunjuk membocorkan jawaban:\n  ${bocor.join('\n  ')}`);
  });

  test('setiap petunjuk cukup panjang untuk menuntun', () => {
    const pendek = WORD_BANK.filter((k) => k.hint.trim().length < 25).map((k) => k.word);
    assert.deepEqual(pendek, [], `petunjuk terlalu pendek: ${pendek.join(', ')}`);
  });

  test('setiap petunjuk tidak kosong', () => {
    const kosong = WORD_BANK.filter((k) => k.hint.trim() === '').map((k) => k.word);
    assert.deepEqual(kosong, [], `petunjuk kosong: ${kosong.join(', ')}`);
  });

  test('uji kebocoran ini benar-benar bekerja', () => {
    // Memastikan ujinya tidak sekadar selalu lolos. Kalau pemeriksaannya rusak,
    // seluruh pemeriksaan di atas menjadi tidak berarti.
    const contoh = { word: 'JALUR', hint: 'Jalur evakuasi aman yang wajib diikuti warga.' };
    assert.ok(
      contoh.hint.toUpperCase().includes(contoh.word),
      'contoh kebocoran seharusnya terdeteksi oleh pemeriksaan yang dipakai di atas',
    );

    const tersembunyi = { word: 'SUSUL', hint: 'Gempa susulan berskala lebih kecil.' };
    assert.ok(
      tersembunyi.hint.toUpperCase().includes(tersembunyi.word),
      'kebocoran yang tersembunyi di dalam kata lain seharusnya juga terdeteksi',
    );
  });
});
