// ── isolasiProgres.test.ts ───────────────────────────────────────────────────
// Uji ISOLASI PROGRES antar-siswa.
//
// ═══════════════════════════════════════════════════════════════════════════
// MENGAPA UJI INI ADA — KEJADIAN NYATA
// ═══════════════════════════════════════════════════════════════════════════
//
//   `loadMissionsForUser(userId)` menyusun daftar KUNCI KANDIDAT, lalu memilih
//   daftar yang PALING PANJANG. Dua hal itu berbahaya bila digabung:
//
//     1. Kandidatnya juga memuat kunci PENGGUNA YANG SEDANG AKTIF, bukan hanya
//        kunci pengguna yang diminta.
//     2. Yang dipilih adalah yang paling panjang, sehingga daftar yang SALAH
//        selalu menang atas daftar yang benar.
//
//   Akibatnya, bila guru membuka progres siswa B sementara yang sedang login
//   adalah siswa A, dan A kebetulan lebih banyak menyelesaikan misi, maka
//   PROGRES A TERBACA SEBAGAI PROGRES B.
//
//   Sisi simpannya bahkan lebih buruk: `saveMissionsForUser` juga menimpa kunci
//   pengguna yang sedang login. Jadi menyimpan progres siswa B sementara siswa A
//   login akan MENGHAPUS progres A - kerusakan data, bukan sekadar salah baca.
//
//   Ini bukan kasus langka: satu komputer sekolah dipakai bergantian, dan guru
//   memang membuka progres siswa satu per satu.
//
// CARA MEMERIKSA
//   Aturannya dipindahkan ke modul MURNI `misiKunci.ts` supaya dapat diuji
//   sungguhan. Sebelumnya logika ini menyatu di `missionStore.ts`, yang tidak
//   dapat diimpor penguji Node karena rantai impornya bergantung pada Vite -
//   sehingga aturan sepenting ini tidak pernah diuji sama sekali.
//
// Jalankan: npm run test

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  PREFIX_MISI,
  kunciMisi,
  kunciYangBolehDibaca,
  pilihTerpanjang,
  saringIdMisi,
} from '../misiKunci.ts';

const MISI_SAH = new Set(['job_01', 'job_02', 'job_03', 'job_04', 'job_05', 'job_06']);

describe('isolasi progres — kunci yang boleh dibaca', () => {
  test('hanya kunci pengguna yang diminta', () => {
    const kunci = kunciYangBolehDibaca('siswa-B', { id: 'siswa-A', username: 'andi' });
    assert.deepEqual(kunci, [`${PREFIX_MISI}siswa-B`]);
  });

  test('kunci pengguna yang sedang login TIDAK ikut dibaca', () => {
    // Inilah inti kebocorannya: siswa A sedang login, tetapi yang diminta B.
    const kunci = kunciYangBolehDibaca('siswa-B', { id: 'siswa-A', username: 'andi' });
    assert.ok(
      !kunci.includes(kunciMisi('siswa-A')),
      'kunci siswa A ikut dibaca - progresnya dapat terbaca sebagai milik siswa B',
    );
    assert.ok(!kunci.includes(kunciMisi('andi')), 'nama pengguna siswa lain ikut dibaca');
  });

  test('data lama berbasis NAMA PENGGUNA tetap terbaca untuk pengguna yang sama', () => {
    // Data lama mungkin tersimpan dengan nama pengguna alih-alih id.
    const kunci = kunciYangBolehDibaca('siswa-A', { id: 'siswa-A', username: 'andi' });
    assert.deepEqual(kunci.sort(), [kunciMisi('siswa-A'), kunciMisi('andi')].sort());
  });

  test('nama pengguna dikenali juga bila yang diminta adalah namanya', () => {
    const kunci = kunciYangBolehDibaca('andi', { id: 'siswa-A', username: 'andi' });
    assert.deepEqual(kunci.sort(), [kunciMisi('siswa-A'), kunciMisi('andi')].sort());
  });

  test('tanpa pengguna aktif, hanya kunci target yang dibaca', () => {
    assert.deepEqual(kunciYangBolehDibaca('siswa-A', null), [kunciMisi('siswa-A')]);
    assert.deepEqual(kunciYangBolehDibaca('siswa-A'), [kunciMisi('siswa-A')]);
  });
});

describe('isolasi progres — pemilihan dan penyaringan daftar', () => {
  test('daftar terpanjang yang dipilih (untuk memulihkan kunci lama)', () => {
    assert.deepEqual(pilihTerpanjang([['job_01'], ['job_01', 'job_02'], []]), ['job_01', 'job_02']);
  });

  test('daftar kosong bila tidak ada kandidat', () => {
    assert.deepEqual(pilihTerpanjang([[], []]), []);
  });

  test('id misi yang tidak dikenal dibuang', () => {
    // Tanpa penyaringan, satu id usang membuat jumlah misi tuntas melebihi
    // jumlah misi sebenarnya - dan nilai yang dihitung dari situ menjadi salah.
    assert.deepEqual(saringIdMisi(['job_01', 'job_99', 'job_02'], MISI_SAH), ['job_01', 'job_02']);
  });

  test('isi yang bukan daftar atau bukan teks dibuang', () => {
    assert.deepEqual(saringIdMisi('bukan daftar', MISI_SAH), []);
    assert.deepEqual(saringIdMisi(null, MISI_SAH), []);
    assert.deepEqual(saringIdMisi([1, 'job_01', null], MISI_SAH), ['job_01']);
  });
});

describe('isolasi progres — penyimpanan benar-benar memakai aturan itu', () => {
  const SUMBER = readFileSync(new URL('../missionStore.ts', import.meta.url), 'utf8');

  test('penyimpanan mengimpor aturan kunci dari modul murni', () => {
    // Kalau berkas ini berhenti memakai modul itu, aturannya tidak lagi berlaku
    // meski uji di atas tetap hijau.
    assert.ok(
      SUMBER.includes('kunciYangBolehDibaca'),
      'missionStore tidak lagi memakai kunciYangBolehDibaca - isolasi progres tidak terjaga',
    );
  });

  test('tidak ada lagi penulisan kunci dengan pola nama pengguna secara langsung', () => {
    // Pola lama yang menyebabkan penimpaan progres siswa lain.
    const polaBerbahaya = /localStorage\.setItem\(\s*`resqbox_missions_\$\{/;
    assert.ok(
      !polaBerbahaya.test(SUMBER),
      'masih ada penulisan kunci misi secara langsung - berpotensi menimpa progres pengguna lain',
    );
  });

  test('tidak ada lagi pembacaan kunci dengan pola nama pengguna secara langsung', () => {
    const polaBerbahaya = /candidateKeys\.push\(\s*`resqbox_missions_\$\{/;
    assert.ok(
      !polaBerbahaya.test(SUMBER),
      'masih ada penambahan kunci misi secara langsung - berpotensi membaca progres pengguna lain',
    );
  });
});
