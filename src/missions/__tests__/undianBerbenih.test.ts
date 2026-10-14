// ── undianBerbenih.test.ts ───────────────────────────────────────────────────
// Uji mesin undian berbenih.
//
// MENGAPA UJI INI ADA
//
//   Modul ini adalah dasar dari JANJI KEPADA GURU: "soal dan kata berbeda
//   antar-siswa, tetapi tetap sama bagi siswa yang sama, dan hasilnya dapat
//   diperiksa". Janji itu tidak boleh hanya berupa komentar di dalam kode.
//
//   Kalau mesin ini rusak — misalnya hasilnya berubah untuk benih yang sama —
//   akibatnya bukan sekadar tampilan aneh: siswa bisa "mengundi ulang" dengan
//   me-refresh sampai mendapat soal yang ia rasa mudah, dan nilai mereka tidak
//   lagi sebanding.
//
// Jalankan: npm run test

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { benihDari, acakBerbenih, pilihBerbenih } from '../engine/undianBerbenih.ts';

describe('benihDari — mengubah teks menjadi benih angka', () => {
  test('teks yang sama selalu menghasilkan benih yang sama', () => {
    assert.equal(benihDari('siswa-1|gerbang|2'), benihDari('siswa-1|gerbang|2'));
  });

  test('teks yang berbeda menghasilkan benih yang berbeda', () => {
    // Bukan jaminan matematis, tetapi untuk masukan yang wajar harus berbeda.
    const contoh = ['siswa-1', 'siswa-2', 'siswa-3', 'siswa-10', 'guru-1', ''];
    const benih = contoh.map(benihDari);
    assert.equal(new Set(benih).size, benih.length, 'ada benih yang bertabrakan');
  });

  test('perbedaan satu huruf saja sudah mengubah benih', () => {
    assert.notEqual(benihDari('area-1'), benihDari('area-2'));
  });

  test('benih selalu bilangan bulat tak bertanda 32-bit', () => {
    for (const t of ['a', 'zzz', 'sidang-akhir-2025', 'x'.repeat(500)]) {
      const b = benihDari(t);
      assert.ok(Number.isInteger(b), `benih bukan bilangan bulat untuk "${t.slice(0, 12)}"`);
      assert.ok(b >= 0 && b <= 0xffffffff, `benih di luar rentang 32-bit: ${b}`);
    }
  });
});

describe('acakBerbenih — pembangkit bilangan acak berbenih', () => {
  test('urutan angkanya SELALU sama untuk benih yang sama', () => {
    // Inilah inti janji "tidak bisa mengundi ulang dengan me-refresh".
    const a = Array.from({ length: 20 }, acakBerbenih(12345));
    const b = Array.from({ length: 20 }, acakBerbenih(12345));
    assert.deepEqual(a, b);
  });

  test('benih berbeda menghasilkan urutan yang berbeda', () => {
    const a = Array.from({ length: 10 }, acakBerbenih(1));
    const b = Array.from({ length: 10 }, acakBerbenih(2));
    assert.notDeepEqual(a, b);
  });

  test('seluruh hasilnya berada pada rentang 0 sampai 1', () => {
    const acak = acakBerbenih(benihDari('uji-rentang'));
    for (let i = 0; i < 1000; i++) {
      const v = acak();
      assert.ok(v >= 0 && v < 1, `nilai di luar rentang: ${v}`);
    }
  });

  test('sebarannya cukup merata, tidak menumpuk di satu sisi', () => {
    // Diperiksa dengan membagi rentang menjadi 10 keranjang. Kalau sebarannya
    // rusak, pengundian kata gerbang akan berat sebelah ke varian tertentu.
    const acak = acakBerbenih(benihDari('uji-sebaran'));
    const keranjang = new Array(10).fill(0);
    const jumlah = 5000;
    for (let i = 0; i < jumlah; i++) keranjang[Math.floor(acak() * 10)]++;
    for (let i = 0; i < 10; i++) {
      const rasio = keranjang[i] / jumlah;
      assert.ok(
        rasio > 0.06 && rasio < 0.14,
        `keranjang ${i} berisi ${(rasio * 100).toFixed(1)}% — sebaran terlalu timpang`,
      );
    }
  });
});

describe('pilihBerbenih — memilih satu anggota daftar', () => {
  test('daftar kosong menghasilkan null, bukan undefined', () => {
    assert.equal(pilihBerbenih([], 42), null);
  });

  test('hasilnya selalu salah satu anggota daftar', () => {
    const daftar = ['a', 'b', 'c'];
    for (let i = 0; i < 100; i++) {
      const hasil = pilihBerbenih(daftar, benihDari(`siswa-${i}`));
      assert.ok(hasil !== null && daftar.includes(hasil), `hasil di luar daftar: ${hasil}`);
    }
  });

  test('daftar berisi satu anggota selalu mengembalikan anggota itu', () => {
    for (let i = 0; i < 20; i++) {
      assert.equal(pilihBerbenih(['hanya'], benihDari(`x${i}`)), 'hanya');
    }
  });

  test('benih yang sama memilih anggota yang sama', () => {
    const daftar = ['a', 'b', 'c', 'd', 'e'];
    const b = benihDari('siswa-tetap');
    assert.equal(pilihBerbenih(daftar, b), pilihBerbenih(daftar, b));
  });

  test('semua anggota daftar benar-benar mungkin terpilih', () => {
    // Anggota yang tidak pernah terpilih berarti sia-sia ditulis.
    const daftar = ['a', 'b', 'c'];
    const terpilih = new Set(
      Array.from({ length: 300 }, (_, i) => pilihBerbenih(daftar, benihDari(`siswa-${i}`))),
    );
    assert.equal(terpilih.size, daftar.length, `hanya ${terpilih.size} dari ${daftar.length} pernah terpilih`);
  });
});
