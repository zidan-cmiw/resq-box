// ── kompetensi.test.ts ─────────────────────────────────────────────────────
// Menjaga agar daftar kompetensi Level 3 tetap utuh dan pembagiannya
// berurutan tanpa tumpang tindih.
//
// MENGAPA UJI INI ADA
//   Rancangan kompetensi sempat dua kali berubah: pertama 8 butir dengan
//   pemetaan silang, lalu 12 butir, akhirnya 13 butir berurutan. Tiap
//   perubahan mudah merusak salah satu janji berikut:
//     - tiap misi punya blok kompetensi sendiri,
//     - tidak ada kompetensi yang terpakai dua kali,
//     - tidak ada kompetensi yang tidak dipakai sama sekali,
//     - tiap kompetensi punya indikator yang bisa diamati guru.
//   Uji ini mengunci keempatnya.

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  KOMPETENSI_LEVEL3,
  PETA_MISI,
  LABEL_ASPEK,
  kompetensiMisi,
  kalimatKompetensi,
} from '../data/kompetensi.ts';

describe('daftar kompetensi Level 3', () => {
  test('berjumlah tiga belas dan kodenya berurutan', () => {
    assert.equal(KOMPETENSI_LEVEL3.length, 13, 'jumlah kompetensi berubah');
    const kode = KOMPETENSI_LEVEL3.map((k) => k.kode);
    const seharusnya = Array.from({ length: 13 }, (_, i) => `K${i + 1}`);
    assert.deepEqual(kode, seharusnya, 'kode kompetensi harus K1 sampai K13 berurutan');
  });

  test('tiap kompetensi punya minimal tiga indikator yang terisi', () => {
    for (const k of KOMPETENSI_LEVEL3) {
      assert.ok(k.nama.trim().length > 0, `${k.kode} tidak punya rumusan`);
      assert.ok(
        k.indikator.length >= 3,
        `${k.kode} hanya punya ${k.indikator.length} indikator, minimal 3`,
      );
      for (const [i, teks] of k.indikator.entries()) {
        assert.ok(teks.trim().length > 10, `indikator ${k.kode}.${i + 1} terlalu pendek`);
      }
    }
  });

  test('setiap kompetensi masuk ke salah satu aspek yang dikenal', () => {
    for (const k of KOMPETENSI_LEVEL3) {
      assert.ok(LABEL_ASPEK[k.aspek], `${k.kode} memakai aspek tak dikenal: ${k.aspek}`);
    }
  });

  test('tidak ada kode kompetensi yang kembar', () => {
    const kode = KOMPETENSI_LEVEL3.map((k) => k.kode);
    assert.equal(new Set(kode).size, kode.length, 'ada kode kompetensi yang dipakai dua kali');
  });
});

describe('pembagian kompetensi ke lima misi', () => {
  test('setiap kompetensi dipakai TEPAT SATU kali', () => {
    const semua = Object.values(PETA_MISI).flat();
    const hitung = new Map<string, number>();
    for (const k of semua) hitung.set(k, (hitung.get(k) ?? 0) + 1);

    for (const k of KOMPETENSI_LEVEL3) {
      assert.equal(
        hitung.get(k.kode) ?? 0,
        1,
        `${k.kode} dipakai ${hitung.get(k.kode) ?? 0} kali, seharusnya tepat 1`,
      );
    }
  });

  test('tidak ada kode asing di peta misi', () => {
    const sah = new Set(KOMPETENSI_LEVEL3.map((k) => k.kode));
    for (const [misi, daftar] of Object.entries(PETA_MISI)) {
      for (const k of daftar) {
        assert.ok(sah.has(k), `misi ${misi} memakai kode ${k} yang tidak ada di daftar kompetensi`);
      }
    }
  });

  test('misi 1 sampai 5 semuanya punya kompetensi', () => {
    for (const nomor of [1, 2, 3, 4, 5]) {
      const isi = PETA_MISI[nomor] ?? [];
      assert.ok(isi.length >= 2, `misi ${nomor} hanya punya ${isi.length} kompetensi`);
    }
  });

  test('kompetensiMisi mengembalikan objek yang benar dan berurutan', () => {
    for (const nomor of [1, 2, 3, 4, 5]) {
      const hasil = kompetensiMisi(nomor);
      assert.deepEqual(
        hasil.map((k) => k.kode),
        PETA_MISI[nomor],
        `isi misi ${nomor} tidak sesuai`,
      );
      for (const k of hasil) assert.ok(k.indikator.length >= 3);
    }
    assert.deepEqual(kompetensiMisi(99), [], 'misi tak dikenal harus menghasilkan daftar kosong');
  });

  test('kalimat pembuka menyebut semua kode pada misi itu', () => {
    for (const nomor of [1, 2, 3, 4, 5]) {
      const kalimat = kalimatKompetensi(nomor);
      assert.match(kalimat, /diharapkan mampu/i, `kalimat misi ${nomor} tidak memakai frasa baku`);
      for (const kode of PETA_MISI[nomor]) {
        assert.ok(kalimat.includes(kode), `kalimat misi ${nomor} tidak menyebut ${kode}`);
      }
    }
  });
});
