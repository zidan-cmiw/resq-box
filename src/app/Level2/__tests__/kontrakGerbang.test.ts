// ── kontrakGerbang.test.ts ───────────────────────────────────────────────────
// Uji kontrak antara DAFTAR AREA dan DAFTAR MATERI WAJIB di gerbang Teka-Teki
// Silang Level 2.
//
// ═══════════════════════════════════════════════════════════════════════════
// MENGAPA UJI INI ADA — KEJADIAN NYATA
// ═══════════════════════════════════════════════════════════════════════════
//
//   Di `gameEngine.ts` ada rantai penentuan `requiredKeys`: daftar materi yang
//   WAJIB dibaca sebelum gerbang terbuka. Rantai itu hanya menyebut area 0, 2, 3,
//   dan 5 - sedangkan area 4 (Simulasi Erupsi Merapi) PUNYA DUA MATERI tetapi
//   tidak disebut.
//
//   Akibatnya area 4 mendapat `requiredKeys` kosong, sehingga `totalCount = 0`
//   dan gerbangnya terbuka TANPA membaca materi apa pun. Tidak ada error.
//
//   Uji ini menutup DUA arah bahaya sekaligus:
//
//     a. Area BERMATERI yang tidak terdaftar
//        -> gerbang terbuka tanpa membaca materi (materi bisa dilewati).
//
//     b. Area terdaftar yang TIDAK punya materi
//        -> requiredKeys tidak pernah terpenuhi, sehingga gerbangnya TIDAK AKAN
//           PERNAH terbuka dan levelnya mustahil diselesaikan.
//
//   Arah (b) lebih berbahaya daripada (a), dan keduanya sama-sama tidak
//   menimbulkan error apa pun.
//
// CARA MEMERIKSA
//   Daftar area beserta materinya diimpor dari `level2Data.ts` yang murni,
//   sedangkan rantai `requiredKeys` dibaca dari sumber `gameEngine.ts` sebagai
//   teks - karena modul itu memerlukan lingkungan peramban untuk dijalankan.
//
// Jalankan: npm run test

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { LEVEL2_AREAS } from '../level2Data.ts';

const GAME_ENGINE = readFileSync(new URL('../engine/gameEngine.ts', import.meta.url), 'utf8');

/**
 * Ambil potongan sumber yang memuat rantai penentuan `requiredKeys`.
 *
 * Awalnya ditandai `let requiredKeys`, dan akhirnya ditandai `let readCount`
 * yang selalu menyusul tepat setelah rantai itu selesai.
 */
function blokRequiredKeys(): string {
  const awal = GAME_ENGINE.indexOf('let requiredKeys');
  assert.ok(awal >= 0, 'penanda "let requiredKeys" tidak ditemukan di gameEngine.ts');

  const akhir = GAME_ENGINE.indexOf('let readCount', awal);
  assert.ok(akhir > awal, 'penanda "let readCount" tidak ditemukan setelah rantai requiredKeys');

  return GAME_ENGINE.slice(awal, akhir);
}

/** Apakah sebuah area disebut di dalam rantai requiredKeys? */
function areaDisebut(blok: string, indeks: number, id: string): boolean {
  return blok.includes(`currentAreaIndex === ${indeks}`) || blok.includes(`'${id}'`);
}

describe('kontrak gerbang TTS — materi wajib dibaca', () => {
  const blok = blokRequiredKeys();

  test('rantai requiredKeys berhasil dibaca dari sumber', () => {
    assert.ok(blok.length > 100, 'potongan rantai requiredKeys terlalu pendek - polanya mungkin berubah');
    assert.ok(blok.includes('requiredKeys = ['), 'tidak ada penetapan requiredKeys di dalam potongan');
  });

  test('SETIAP area yang punya materi WAJIB terdaftar di rantai requiredKeys', () => {
    // Arah (a): kalau tidak terdaftar, gerbangnya terbuka tanpa membaca materi -
    // dan materi yang sudah ditulis justru bisa dilewati begitu saja.
    const terlewat = LEVEL2_AREAS.map((a, i) => ({ i, id: a.id, jumlah: (a.discoveries ?? []).length }))
      .filter(({ i, id, jumlah }) => jumlah > 0 && !areaDisebut(blok, i, id))
      .map(({ i, id, jumlah }) => `indeks ${i} (${id}) punya ${jumlah} materi`);

    assert.deepEqual(
      terlewat,
      [],
      `area bermateri yang tidak diwajibkan membacanya - gerbangnya terbuka tanpa membaca:\n  ${terlewat.join('\n  ')}`,
    );
  });

  test('SETIAP area yang terdaftar di rantai WAJIB punya materi', () => {
    // Arah (b): area terdaftar tanpa materi membuat syaratnya tidak pernah
    // terpenuhi, sehingga gerbangnya TIDAK AKAN PERNAH terbuka.
    const salahDaftar = LEVEL2_AREAS.map((a, i) => ({ i, id: a.id, jumlah: (a.discoveries ?? []).length }))
      .filter(({ i, id, jumlah }) => jumlah === 0 && areaDisebut(blok, i, id))
      .map(({ i, id }) => `indeks ${i} (${id}) terdaftar tetapi tidak punya materi`);

    assert.deepEqual(
      salahDaftar,
      [],
      `area terdaftar tanpa materi - gerbangnya mustahil terbuka:\n  ${salahDaftar.join('\n  ')}`,
    );
  });

  test('setiap area yang diwajibkan menyebut kunci materi yang benar-benar ada', () => {
    // Kunci wajib diambil dari daftar materi area itu, supaya tidak ada kunci
    // yang salah ketik dan tidak pernah terpenuhi.
    const semuaKunciSah = new Set<string>();
    for (const a of LEVEL2_AREAS) {
      for (const d of a.discoveries ?? []) semuaKunciSah.add(d.id);
    }
    // Area 0 memakai kunci khusus untuk dua materinya, jadi kunci itu diizinkan
    // selain id materi yang terdaftar.
    const kunciKhusus = new Set(['l2_q_disc_prep', 'l2_q_disc_action']);

    const kunciDipakai = [...blok.matchAll(/'([a-z0-9_-]+)'/g)]
      .map((m) => m[1])
      .filter((k) => k.startsWith('disc-') || k.startsWith('l2_q_'));

    const asing = kunciDipakai.filter((k) => !semuaKunciSah.has(k) && !kunciKhusus.has(k));

    assert.deepEqual(asing, [], `kunci materi yang tidak dikenal: ${[...new Set(asing)].join(', ')}`);
  });
});
