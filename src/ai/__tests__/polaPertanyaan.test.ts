// ── polaPertanyaan.test.ts ────────────────────────────────────────────────
// Mengunci dua janji lapisan regex:
//   1. pertanyaan yang jawabannya pasti TIDAK diteruskan ke AI
//   2. permintaan jawaban langsung SELALU ditolak
//
// Uji ini juga menjaga sisi sebaliknya: pertanyaan biasa tidak boleh ikut
// tertangkap, karena kalau terlalu rakus, chatbot akan menjawab "cara buka
// level 2" padahal siswa bertanya "apa itu level magma".

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalisasiTeks,
  deteksiPola,
  cobaMintaJawaban,
  DAFTAR_POLA,
} from '../polaPertanyaan.ts';

describe('normalisasi teks siswa', () => {
  test('menyeragamkan singkatan yang sering dipakai', () => {
    assert.equal(normalisasiTeks('gmn cara buka lv2'), 'bagaimana cara buka level 2');
    assert.equal(normalisasiTeks('gk bisa login nih'), 'tidak bisa login nih');
    assert.equal(normalisasiTeks('sy lupa password'), 'saya lupa password');
  });

  test('membuang tanda baca dan spasi berlebih', () => {
    assert.equal(normalisasiTeks('  Halo!!!   Resqy?? '), 'halo resqy');
  });

  test('teks kosong tetap kosong', () => {
    assert.equal(normalisasiTeks('   '), '');
  });
});

describe('pola pertanyaan yang jawabannya pasti', () => {
  const kasus: [string, string][] = [
    ['cara buka level 2 gimana?', 'bukaLevel2'],
    ['level 2 kok masih gembok', 'bukaLevel2'],
    ['gimana cara masuk level 3', 'bukaLevel3'],
    ['cara ganti password', 'gantiPassword'],
    ['saya lupa password', 'gantiPassword'],
    ['lupa username saya', 'lupaUsername'],
    ['gabisa login', 'tidakBisaMasuk'],
    ['kalau offline bisa main ga', 'luring'],
    ['cara sambung diorama', 'diorama'],
    ['nilai saya dilihat dimana', 'lihatNilai'],
    ['aplikasi lemot', 'hematData'],
    ['cara ganti bahasa inggris', 'gantiBahasa'],
    ['cara main wordle', 'caraWordle'],
    ['halo resqy', 'sapaan'],
    ['terima kasih', 'terimaKasih'],
    ['kamu siapa', 'siapaKamu'],
  ];

  for (const [teks, nama] of kasus) {
    test(`"${teks}" cocok ke pola ${nama}`, () => {
      const hasil = deteksiPola(teks);
      assert.ok(hasil, 'tidak ada pola yang cocok');
      assert.equal(hasil?.nama, nama);
      assert.ok(hasil!.balasan.length > 40, 'balasan terlalu pendek');
    });
  }

  test('setiap pola punya balasan yang tidak kosong', () => {
    assert.ok(DAFTAR_POLA.length >= 14, `pola hanya ${DAFTAR_POLA.length}`);
    assert.equal(new Set(DAFTAR_POLA).size, DAFTAR_POLA.length, 'ada nama pola kembar');
  });
});

describe('pertanyaan biasa TIDAK ikut tertangkap', () => {
  const luput = [
    'apa itu magma',
    'mengapa gunung merapi sering erupsi',
    'apa bedanya lahar dan awan panas',
    'jelaskan proses subduksi lempeng',
    'siapa alfred wegener',
    'berapa jumlah warga di simulasi',
  ];

  for (const teks of luput) {
    test(`"${teks}" dibiarkan ke jalur AI`, () => {
      assert.equal(deteksiPola(teks), null, 'pertanyaan materi ikut tertangkap pola');
    });
  }

  test('pertanyaan nilai tanpa kata tanya tidak dianggap pola', () => {
    // "berapa nilai 75" bukan pertanyaan navigasi
    assert.equal(deteksiPola('berapa nilai 75'), null);
  });
});

describe('permintaan jawaban langsung harus ditolak', () => {
  const curang = [
    'kunci jawaban tts',
    'jawaban tts nomor 3 apa',
    'kasih tau jawaban wordle dong',
    'jawaban no 2 apa ya',
    'bocorin jawaban dong',
    'huruf apa yang benar di kotak 4',
  ];

  for (const teks of curang) {
    test(`"${teks}" terdeteksi sebagai permintaan jawaban`, () => {
      assert.equal(cobaMintaJawaban(teks), true);
    });
  }

  test('pertanyaan CARA mengerjakan bukan permintaan jawaban', () => {
    for (const teks of ['cara isi tts gimana', 'cara main wordle', 'apa itu kunci determinasi']) {
      assert.equal(cobaMintaJawaban(teks), false, `"${teks}" salah dianggap curang`);
    }
  });

  test('pertanyaan materi biasa tidak dianggap curang', () => {
    assert.equal(cobaMintaJawaban('apa itu lahar'), false);
  });
});
