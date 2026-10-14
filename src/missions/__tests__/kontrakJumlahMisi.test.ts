// ── kontrakJumlahMisi.test.ts ────────────────────────────────────────────────
// Uji agar JUMLAH MISI hanya berasal dari satu sumber, bukan ditulis tangan.
//
// ═══════════════════════════════════════════════════════════════════════════
// MENGAPA UJI INI ADA
// ═══════════════════════════════════════════════════════════════════════════
//
//   Angka 20 pernah ditulis tetap di lebih dari lima belas tempat. Yang paling
//   berbahaya ada di TEACHER DASHBOARD, karena di sana angka itu dipakai untuk
//   MENGHITUNG NILAI:
//
//       Math.round((completedMissionsCount / 20) * 100)
//
//   Begitu jumlah misi berubah, nilai yang dilaporkan kepada guru menjadi SALAH
//   - dan tidak ada error apa pun yang muncul. Teks kemajuan siswa juga ikut
//   berbohong, mis. "Selesai 3/20 Misi" padahal misinya sudah 25.
//
//   Karena itu jumlah misi kini hanya boleh diambil dari `TOTAL_MISSIONS` di
//   `missions.ts`. Uji ini menjaga agar tidak ada yang menuliskan angkanya lagi.
//
// ═══════════════════════════════════════════════════════════════════════════
// DUA TINGKAT PEMERIKSAAN
// ═══════════════════════════════════════════════════════════════════════════
//
//   1. MENGHITUNG (wajib bersih, tanpa kecuali) - pola yang dipakai untuk
//      menghitung nilai atau menampilkan kemajuan, mis. "/ 20) * 100".
//
//   2. MENYEBUT (masih ada, terdaftar) - teks deskriptif seperti "20 Misi Studi
//      Kasus" pada halaman beranda dan panduan. Angka itu tidak dihitung, hanya
//      disebut, sehingga risikonya lebih rendah. Daftarnya dicatat di bawah dan
//      diperiksa agar TIDAK BOLEH BASI: berkas yang sudah bersih wajib keluar
//      dari daftar, dan berkas baru yang menyebut angka itu akan langsung gagal.
//
// Jalankan: npm run test

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MISSIONS, TOTAL_MISSIONS, POIN_PER_MISI } from '../data/missions.ts';

const AKAR_SRC = fileURLToPath(new URL('../../', import.meta.url));

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

/** Nama berkas relatif terhadap src/, memakai garis miring biasa. */
function relatif(penuh: string): string {
  return penuh.slice(AKAR_SRC.length).replace(/\\/g, '/');
}

/**
 * Pola MENGHITUNG. Pola-pola ini tidak boleh ada sama sekali.
 */
const POLA_MENGHITUNG: { nama: string; pola: RegExp }[] = [
  { nama: 'pembagian nilai dengan 20', pola: /\/\s*20\s*\)\s*\*\s*100/ },
  { nama: 'kemajuan "/20 Misi"', pola: /\/\s*20\s+Misi/ },
  { nama: 'status "20/20"', pola: /20\s*\/\s*20/ },
];

/**
 * Berkas yang MASIH menyebut jumlah misi di teks deskriptif.
 *
 * SUDAH KOSONG: seluruh teks deskriptif kini mengambil angkanya dari
 * `TOTAL_MISSIONS` dan `POIN_PER_MISI`, sehingga tidak bisa basi.
 *
 * Daftar ini sengaja tetap dipertahankan - kalau kelak ada teks baru yang
 * menuliskan angkanya langsung, uji di bawah akan langsung gagal dan berkas itu
 * harus ditambahkan ke sini (dan sebaiknya diperbaiki, bukan didaftarkan).
 */
const MASIH_MENYEBUT: string[] = [];

describe('jumlah misi — sumber tunggalnya benar', () => {
  test('TOTAL_MISSIONS sama dengan jumlah misi yang sebenarnya', () => {
    assert.equal(TOTAL_MISSIONS, MISSIONS.length);
  });

  test('TOTAL_MISSIONS bukan angka yang ditulis tangan', () => {
    // Kalau seseorang mengganti isinya menjadi angka tetap, uji ini gagal.
    assert.equal(typeof TOTAL_MISSIONS, 'number');
    assert.ok(TOTAL_MISSIONS > 0, 'jumlah misi tidak wajar');
  });

  test('POIN_PER_MISI menghasilkan 100 poin bila seluruh misi tuntas', () => {
    assert.equal(Math.round(POIN_PER_MISI * TOTAL_MISSIONS), 100);
  });
});

describe('jumlah misi — tidak boleh dipakai untuk menghitung', () => {
  test('TIDAK ADA berkas yang menulis angka jumlah misi untuk menghitung nilai', () => {
    const pelanggar: string[] = [];

    for (const berkas of berkasSumber()) {
      const isi = readFileSync(berkas, 'utf8');
      for (const { nama, pola } of POLA_MENGHITUNG) {
        if (pola.test(isi)) {
          pelanggar.push(`${relatif(berkas)} -> ${nama}`);
        }
      }
    }

    assert.deepEqual(
      pelanggar,
      [],
      `angka jumlah misi masih ditulis tetap untuk menghitung - nilai menjadi salah bila jumlah misi berubah:\n  ${pelanggar.join('\n  ')}`,
    );
  });
});

describe('jumlah misi — teks deskriptif yang masih menyebut angkanya', () => {
  test('daftar berkas yang menyebut angkanya TIDAK BOLEH BASI', () => {
    const menyebut = berkasSumber()
      .filter((b) => /\b20\s+[Mm]isi/.test(readFileSync(b, 'utf8')))
      .map(relatif)
      .sort();

    assert.deepEqual(
      menyebut,
      [...MASIH_MENYEBUT].sort(),
      'daftar MASIH_MENYEBUT tidak lagi sesuai kenyataan. ' +
        'Berkas yang sudah bersih wajib dikeluarkan dari daftar, dan berkas baru yang menyebut angka itu wajib ditambahkan.',
    );
  });

  test('berkas yang menghitung nilai TIDAK BOLEH ada di daftar penyebut', () => {
    // Menjaga agar daftar ini tidak dipakai untuk menyamarkan pelanggaran
    // penghitungan.
    const menghitung = berkasSumber()
      .filter((b) => {
        const isi = readFileSync(b, 'utf8');
        return POLA_MENGHITUNG.some(({ pola }) => pola.test(isi));
      })
      .map(relatif);

    for (const b of menghitung) {
      assert.ok(!MASIH_MENYEBUT.includes(b), `${b} menghitung nilai, tidak boleh ada di daftar penyebut`);
    }
  });
});
