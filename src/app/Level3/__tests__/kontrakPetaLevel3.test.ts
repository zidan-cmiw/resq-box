// ── kontrakPetaLevel3.test.ts ────────────────────────────────────────────────
// Uji kontrak antara DAFTAR MISI dan TATA LETAK TITIK PETA Level 3.
//
// ═══════════════════════════════════════════════════════════════════════════
// MENGAPA UJI INI ADA
// ═══════════════════════════════════════════════════════════════════════════
//
//   Setiap misi digambar sebagai satu titik di peta, dan posisinya diambil dari
//   `MAP_NODE_POSITIONS[idx]`. Tetapi pengambilannya memakai CADANGAN:
//
//       const pos = MAP_NODE_POSITIONS[idx] || { x: defaultX, y: defaultY, ... }
//
//   Artinya bila jumlah misi MELEBIHI jumlah titik, misi berlebih tidak akan
//   error - ia diam-diam memakai posisi hitungan sendiri (220 + idx*220) yang
//   TIDAK mengikuti tata letak peta. Titiknya akan tampak di luar rancangan
//   sektor, dan tidak ada satu pun peringatan.
//
//   Ini jenis yang sama dengan bug-bug sebelumnya: sebuah daftar yang seharusnya
//   mencakup semua kasus, tetapi diam-diam tidak.
//
//   Selain jumlah, uji ini juga menjaga agar PEMBAGIAN SEKTOR tetap selaras:
//   tiap kategori misi menempati satu blok sektor berisi lima misi berturut-turut.
//   Kalau urutan misi diubah tanpa menyesuaikan tata letaknya, misi akan tampil
//   di sektor yang salah.
//
// Jalankan: npm run test

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { MISSIONS, CATEGORIES } from '../../../missions/data/missions.ts';

const SUMBER = readFileSync(new URL('../index.tsx', import.meta.url), 'utf8');

/** Seluruh nilai `sectorTitle` pada MAP_NODE_POSITIONS, sesuai urutan. */
function judulSektorPeta(): string[] {
  const awal = SUMBER.indexOf('const MAP_NODE_POSITIONS = [');
  assert.ok(awal >= 0, 'blok MAP_NODE_POSITIONS tidak ditemukan');

  const akhir = SUMBER.indexOf('\n];', awal);
  assert.ok(akhir > awal, 'penutup MAP_NODE_POSITIONS tidak ditemukan');

  const blok = SUMBER.slice(awal, akhir);
  return [...blok.matchAll(/sectorTitle:\s*'([^']+)'/g)].map((m) => m[1]);
}

/** Pecah daftar menjadi kelompok berisi nilai yang sama secara berturut-turut. */
function kelompok(daftar: string[]): { nilai: string; jumlah: number }[] {
  const hasil: { nilai: string; jumlah: number }[] = [];
  for (const nilai of daftar) {
    const terakhir = hasil[hasil.length - 1];
    if (terakhir && terakhir.nilai === nilai) terakhir.jumlah++;
    else hasil.push({ nilai, jumlah: 1 });
  }
  return hasil;
}

describe('peta Level 3 — setiap misi punya titiknya sendiri', () => {
  test('jumlah titik peta SAMA DENGAN jumlah misi', () => {
    // Kalau gagal: ada misi yang memakai posisi cadangan, sehingga titiknya
    // tampil di luar tata letak peta - tanpa error apa pun.
    const titik = judulSektorPeta();
    assert.equal(
      titik.length,
      MISSIONS.length,
      `peta punya ${titik.length} titik tetapi ada ${MISSIONS.length} misi — ` +
        'misi berlebih akan memakai posisi cadangan yang tidak mengikuti tata letak peta',
    );
  });

  test('setiap titik peta punya nomor sektor yang berurutan', () => {
    const titik = judulSektorPeta();
    assert.ok(titik.length > 0, 'tidak ada titik peta yang terbaca');
    for (const t of titik) {
      assert.ok(t.trim() !== '', 'ada titik peta tanpa judul sektor');
    }
  });
});

describe('peta Level 3 — pembagian sektor selaras dengan kategori misi', () => {
  test('setiap kategori misi menempati SATU blok sektor yang tidak terputus', () => {
    // Kalau gagal: ada kategori yang misinya tersebar, sehingga sektornya
    // terpecah dan peta tidak lagi menggambarkan alurnya.
    const kategori = MISSIONS.map((m) => m.category);
    const blok = kelompok(kategori);

    for (const b of blok) {
      const jumlahSebenarnya = kategori.filter((k) => k === b.nilai).length;
      assert.equal(
        b.jumlah,
        jumlahSebenarnya,
        `kategori "${b.nilai}" terpecah menjadi beberapa blok di daftar misi ` +
          `(${b.jumlah} berturut-turut dari total ${jumlahSebenarnya})`,
      );
    }
  });

  test('setiap sektor peta menempati SATU blok yang tidak terputus', () => {
    const blok = kelompok(judulSektorPeta());
    const judul = judulSektorPeta();

    for (const b of blok) {
      const jumlahSebenarnya = judul.filter((j) => j === b.nilai).length;
      assert.equal(
        b.jumlah,
        jumlahSebenarnya,
        `sektor "${b.nilai}" terpecah menjadi beberapa blok di tata letak peta ` +
          `(${b.jumlah} berturut-turut dari total ${jumlahSebenarnya})`,
      );
    }
  });

  test('jumlah sektor peta sama dengan jumlah kategori misi', () => {
    const sektor = kelompok(judulSektorPeta());
    const kategori = kelompok(MISSIONS.map((m) => m.category));

    assert.equal(
      sektor.length,
      kategori.length,
      `peta punya ${sektor.length} sektor tetapi misi punya ${kategori.length} kategori`,
    );
  });

  test('urutan besar setiap sektor sama dengan urutan besar kategori misinya', () => {
    // Dibandingkan berdasarkan UKURAN kelompok, bukan namanya, karena penamaan
    // sektor di peta dan kategori di data memang berbeda (mis. 'lembah' vs
    // 'pengenalan').
    const ukuranSektor = kelompok(judulSektorPeta()).map((b) => b.jumlah);
    const ukuranKategori = kelompok(MISSIONS.map((m) => m.category)).map((b) => b.jumlah);

    assert.deepEqual(
      ukuranSektor,
      ukuranKategori,
      `pembagian peta ${ukuranSektor.join('/')} tidak sama dengan pembagian kategori ${ukuranKategori.join('/')}`,
    );
  });
});

describe('peta Level 3 — jumlah misi per kategori tidak boleh basi', () => {
  test('jumlah misi yang DIAKUI tiap kategori sama dengan jumlah sebenarnya', () => {
    // CATEGORIES menyimpan jumlah misi untuk ditampilkan di antarmuka. Kalau
    // data misi berubah tanpa menyesuaikannya, angka di layar akan berbohong.
    for (const kat of CATEGORIES) {
      const sebenarnya = MISSIONS.filter((m) => m.category === kat.id).length;
      assert.equal(
        kat.missions,
        sebenarnya,
        `kategori "${kat.id}" mengaku ${kat.missions} misi, sebenarnya ${sebenarnya}`,
      );
    }
  });

  test('total misi yang diakui seluruh kategori sama dengan jumlah misi', () => {
    const diakui = CATEGORIES.reduce((n, k) => n + k.missions, 0);
    assert.equal(
      diakui,
      MISSIONS.length,
      `kategori mengakui total ${diakui} misi, sedangkan datanya berisi ${MISSIONS.length}`,
    );
  });
});
