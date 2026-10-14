// ── bankKataGerbang.test.ts ──────────────────────────────────────────────────
// Uji bank kata gerbang Level 1 dan pengundiannya per siswa.
//
// MENGAPA UJI INI ADA
//
//   1. ATURAN KEADILAN BEBAN. `targetCount` pada gerbang mengikuti jumlah kata
//      varian yang terundi. Jadi kalau satu varian berisi 4 kata sementara
//      varian lain berisi 2 kata, dua siswa mengerjakan beban yang berbeda
//      untuk materi yang sama — dan itu tidak adil. Uji ini menegakkannya.
//
//   2. PETUNJUK YANG MENUNTUN, BUKAN MEMBOCORKAN. Petunjuk yang memuat kata
//      jawabannya membuat teka-teki itu tidak ada gunanya. Uji ini memeriksa
//      setiap petunjuk di seluruh bank.
//
//   3. SIFAT UNDIAN. Harus berbeda antar-siswa, tetapi tetap bagi siswa yang
//      sama — supaya tidak ada yang bisa "mengundi ulang" dengan me-refresh.
//
// Jalankan: npm run test

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  ZONE_GATE_BANK,
  varianZona,
  undiKataGerbang,
  petunjukUntuk,
  type KataGerbang,
} from '../data/bankKataGerbang.ts';
import { ZONES } from '../../app/Level1/EarthDive/engine/zones.ts';

/**
 * Seluruh zona Level 1 yang PUNYA GERBANG, diturunkan dari data zonanya.
 *
 * Zona 0 (Permukaan Bumi) SENGAJA tidak ikut: ia titik awal Level 1 dan tidak
 * punya gerbang sama sekali - rantai syarat gerbang di EarthDiveGame dimulai
 * dari zona 1. Karena itu bank kata untuk zona 0 tidak akan pernah terpakai dan
 * sudah dihapus.
 *
 * Daftar yang ditulis tangan adalah cara bug ini masuk sejak awal: kalau ada zona
 * baru ditambahkan, daftar itu tidak ikut bertambah, sehingga zona tersebut tidak
 * pernah diuji - dan justru zona itulah yang paling perlu diuji. Karena
 * `undiKataGerbang` memakai zona 1 sebagai cadangan, zona yang lupa didaftarkan
 * akan diam-diam memakai kata zona 1, tanpa error apa pun.
 */
const ZONA = ZONES.map((_, i) => i).slice(1);

/** Seluruh kalimat petunjuk milik satu kata: yang utama dan seluruh variasinya. */
function semuaPetunjuk(kata: KataGerbang): string[] {
  return [kata.hint, ...(kata.hintLain ?? [])];
}

describe('bank kata gerbang — variasi redaksi petunjuk', () => {
  test('zona 2 (mantel) punya variasi redaksi untuk SETIAP katanya', () => {
    // Zona contoh: memastikan mekanismenya benar-benar terisi, bukan sekadar ada
    // di dalam tipe.
    for (const varian of varianZona(2)) {
      for (const kata of varian) {
        assert.ok(
          (kata.hintLain ?? []).length > 0,
          `kata "${kata.word}" di zona 2 belum punya variasi redaksi`,
        );
      }
    }
  });

  test('SETIAP kalimat variasi tetap tidak memuat kata jawabannya', () => {
    // Aturan yang sama seperti petunjuk utama. Variasi redaksi tidak boleh
    // menjadi celah kebocoran jawaban.
    const bocor: string[] = [];
    for (const zona of ZONA) {
      for (const varian of varianZona(zona)) {
        for (const kata of varian) {
          for (const kalimat of semuaPetunjuk(kata)) {
            if (kalimat.toUpperCase().includes(kata.word.toUpperCase())) {
              bocor.push(`zona ${zona} "${kata.word}": ${kalimat.slice(0, 45)}...`);
            }
          }
        }
      }
    }
    assert.deepEqual(bocor, [], `kalimat petunjuk yang membocorkan jawabannya:\n  ${bocor.join('\n  ')}`);
  });

  test('SETIAP kalimat variasi cukup panjang untuk menuntun', () => {
    for (const zona of ZONA) {
      for (const varian of varianZona(zona)) {
        for (const kata of varian) {
          for (const kalimat of semuaPetunjuk(kata)) {
            assert.ok(
              kalimat.trim().length >= 25,
              `variasi petunjuk "${kata.word}" terlalu pendek: "${kalimat}"`,
            );
          }
        }
      }
    }
  });
});

describe('bank kata gerbang — petunjuk diundi per siswa', () => {
  test('kalimat yang dipilih selalu milik kata itu sendiri', () => {
    for (const zona of ZONA) {
      for (const varian of varianZona(zona)) {
        for (const kata of varian) {
          for (const siswa of ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']) {
            const dipilih = petunjukUntuk(kata, zona, 0, siswa);
            assert.ok(
              semuaPetunjuk(kata).includes(dipilih),
              `petunjuk untuk "${kata.word}" bukan salah satu kalimat miliknya`,
            );
          }
        }
      }
    }
  });

  test('TETAP bagi siswa yang sama — tidak bisa diundi ulang dengan menyegarkan', () => {
    for (const zona of ZONA) {
      for (const varian of varianZona(zona)) {
        for (const kata of varian) {
          assert.equal(
            petunjukUntuk(kata, zona, 0, 'siswa-tetap'),
            petunjukUntuk(kata, zona, 0, 'siswa-tetap'),
          );
        }
      }
    }
  });

  test('BERBEDA antar-siswa, sehingga menyalin jawaban tidak lagi berguna', () => {
    // Diperiksa pada kalimat yang MEMANG punya variasi, yaitu zona 2.
    let adaPerbedaan = false;
    for (const varian of varianZona(2)) {
      for (const kata of varian) {
        const kalimat = new Set(
          Array.from({ length: 40 }, (_, i) => petunjukUntuk(kata, 2, 0, `siswa-${i}`)),
        );
        if (kalimat.size > 1) adaPerbedaan = true;
      }
    }
    assert.ok(adaPerbedaan, 'tidak ada satu pun kata yang redaksinya berbeda antar-siswa');
  });
});

describe('bank kata gerbang — keabsahan isi', () => {
  test('seluruh 8 zona Level 1 tersedia', () => {
    const hilang = ZONA.filter((z) => varianZona(z).length === 0);
    assert.deepEqual(hilang, [], `zona tanpa varian: ${hilang.join(', ')}`);
  });

  test('SETIAP zona Level 1 punya varian — tidak ada yang jatuh ke cadangan', () => {
    // Inilah penjaga yang menutup celah itu. Tanpa ini, zona baru yang belum
    // diisi katanya akan DIAM-DIAM memakai kata zona 1, karena undiKataGerbang
    // memakai zona 1 sebagai cadangan.
    const hilang = ZONES.map((z, i) => ({ i, id: z.id })).filter(({ i }) => i !== 0)
      .filter(({ i }) => varianZona(i).length === 0)
      .map(({ i, id }) => `zona ${i} (${id})`);

    assert.deepEqual(
      hilang,
      [],
      `zona tanpa varian kata — gerbangnya akan diam-diam memakai kata zona lain:\n  ${hilang.join('\n  ')}`,
    );
  });

  test('bank tidak menyimpan kunci zona yang bukan zona Level 1', () => {
    // Kebalikannya: kunci di luar jangkauan berarti varian yang tidak akan pernah
    // terundi, jadi sia-sia ditulis.
    const jumlahZona = ZONES.length;
    const berlebih = Object.keys(ZONE_GATE_BANK)
      .map(Number)
      .filter((z) => z < 0 || z >= jumlahZona);

    assert.deepEqual(berlebih, [], `kunci zona di luar jangkauan: ${berlebih.join(', ')}`);
  });

  test('setiap zona punya minimal 2 varian supaya benar-benar dapat diundi', () => {
    const kurang = ZONA.filter((z) => varianZona(z).length < 2).map(
      (z) => `zona ${z} (${varianZona(z).length} varian)`,
    );
    assert.deepEqual(kurang, [], `varian kurang: ${kurang.join(', ')}`);
  });

  test('JUMLAH KATA SERAGAM di semua varian satu zona (aturan keadilan beban)', () => {
    const tidakSeragam: string[] = [];
    for (const z of ZONA) {
      const jumlah = varianZona(z).map((v) => v.length);
      const unik = [...new Set(jumlah)];
      if (unik.length > 1) {
        tidakSeragam.push(`zona ${z} (${jumlah.join(' kata, ')} kata)`);
      }
    }
    assert.deepEqual(
      tidakSeragam,
      [],
      `beban tidak adil antar-varian: ${tidakSeragam.join('; ')}`,
    );
  });

  test('setiap varian berisi 2 atau 3 kata', () => {
    const aneh: string[] = [];
    for (const z of ZONA) {
      varianZona(z).forEach((v, i) => {
        if (v.length < 2 || v.length > 3) aneh.push(`zona ${z} varian ${i} (${v.length} kata)`);
      });
    }
    assert.deepEqual(aneh, [], `jumlah kata tidak wajar: ${aneh.join('; ')}`);
  });

  test('kata ditulis kapital, tanpa spasi, dan cukup panjang untuk ditebak', () => {
    const salah: string[] = [];
    for (const z of ZONA) {
      varianZona(z).forEach((v, i) => {
        for (const k of v) {
          if (k.word.trim() === '') salah.push(`zona ${z}.${i} kata kosong`);
          if (k.word !== k.word.toUpperCase()) salah.push(`zona ${z}.${i} "${k.word}" tidak kapital`);
          if (/\s/.test(k.word)) salah.push(`zona ${z}.${i} "${k.word}" memuat spasi`);
          if (k.word.length < 3) salah.push(`zona ${z}.${i} "${k.word}" terlalu pendek`);
        }
      });
    }
    assert.deepEqual(salah, [], `kata bermasalah: ${salah.join('; ')}`);
  });

  test('tidak ada kata kembar di dalam satu varian', () => {
    const kembar: string[] = [];
    for (const z of ZONA) {
      varianZona(z).forEach((v, i) => {
        const kata = v.map((k) => k.word);
        if (new Set(kata).size !== kata.length) kembar.push(`zona ${z} varian ${i}`);
      });
    }
    assert.deepEqual(kembar, [], `kata kembar dalam satu varian: ${kembar.join(', ')}`);
  });

  test('kata tidak diulang antar-varian dalam zona yang sama', () => {
    // Kalau diulang, dua siswa bisa mendapat teka-teki yang sama persis
    // walaupun variannya berbeda.
    const ulang: string[] = [];
    for (const z of ZONA) {
      const semua = varianZona(z).flatMap((v) => v.map((k) => k.word));
      const ganda = semua.filter((x, i) => semua.indexOf(x) !== i);
      if (ganda.length > 0) ulang.push(`zona ${z} (${[...new Set(ganda)].join(', ')})`);
    }
    assert.deepEqual(ulang, [], `kata diulang antar-varian: ${ulang.join('; ')}`);
  });

  test('PETUNJUK tidak boleh memuat kata jawabannya sendiri', () => {
    // Petunjuk yang menyebut jawabannya membuat teka-teki itu tidak berguna.
    const bocor: string[] = [];
    for (const z of ZONA) {
      varianZona(z).forEach((v, i) => {
        for (const k of v) {
          if (k.hint.toUpperCase().includes(k.word)) {
            bocor.push(`zona ${z}.${i} "${k.word}"`);
          }
        }
      });
    }
    assert.deepEqual(bocor, [], `petunjuk membocorkan jawaban: ${bocor.join('; ')}`);
  });

  test('setiap petunjuk cukup panjang untuk menuntun', () => {
    const pendek: string[] = [];
    for (const z of ZONA) {
      varianZona(z).forEach((v, i) => {
        for (const k of v) {
          if (k.hint.trim().length < 25) pendek.push(`zona ${z}.${i} "${k.word}"`);
        }
      });
    }
    assert.deepEqual(pendek, [], `petunjuk terlalu pendek: ${pendek.join('; ')}`);
  });

  test('urutan indeks zona di dalam bank adalah bilangan bulat 0..7', () => {
    const kunci = Object.keys(ZONE_GATE_BANK).map(Number).sort((a, b) => a - b);
    assert.deepEqual(kunci, ZONA, `kunci zona tidak sesuai: ${kunci.join(', ')}`);
  });
});

describe('undian kata gerbang — berbeda antar-siswa, tetap bagi satu siswa', () => {
  test('hasilnya TETAP bila diundi ulang untuk siswa yang sama', () => {
    for (const z of ZONA) {
      const a = undiKataGerbang(z, 'siswa-1').map((k) => k.word);
      const b = undiKataGerbang(z, 'siswa-1').map((k) => k.word);
      assert.deepEqual(a, b, `zona ${z}: undian berubah untuk siswa yang sama`);
      assert.ok(a.length > 0, `zona ${z}: undian kosong`);
    }
  });

  test('siswa berbeda mendapat varian yang berbeda', () => {
    // Diuji per zona: dari 100 siswa, harus ada lebih dari satu varian terpakai.
    const kurangBervariasi: string[] = [];
    for (const z of ZONA) {
      const terpakai = new Set(
        Array.from({ length: 100 }, (_, i) =>
          undiKataGerbang(z, `siswa-${i}`).map((k) => k.word).join('|'),
        ),
      );
      if (terpakai.size < 2) kurangBervariasi.push(`zona ${z} (hanya ${terpakai.size} varian terpakai)`);
    }
    assert.deepEqual(kurangBervariasi, [], `undian tidak bervariasi: ${kurangBervariasi.join('; ')}`);
  });

  test('setiap varian yang ada benar-benar mungkin terundi', () => {
    // Kalau ada varian yang tidak pernah terundi, ia tidak ada gunanya.
    const tidakTerpakai: string[] = [];
    for (const z of ZONA) {
      const terpakai = new Set(
        Array.from({ length: 300 }, (_, i) =>
          undiKataGerbang(z, `siswa-${i}`).map((k) => k.word).join('|'),
        ),
      );
      const total = varianZona(z).length;
      if (terpakai.size < total) {
        tidakTerpakai.push(`zona ${z} (${terpakai.size} dari ${total} varian terpakai)`);
      }
    }
    assert.deepEqual(tidakTerpakai, [], `ada varian yang tak pernah terundi: ${tidakTerpakai.join('; ')}`);
  });

  test('zona yang tidak ada di bank tetap memberi kata cadangan, bukan kosong', () => {
    const hasil = undiKataGerbang(99, 'siswa-1');
    assert.ok(hasil.length > 0, 'zona tak dikenal menghasilkan daftar kosong');
  });

  test('hasil undian selalu salah satu varian yang sah dari zona itu', () => {
    for (const z of ZONA) {
      const sah = new Set(varianZona(z).map((v) => v.map((k) => k.word).join('|')));
      for (const u of ['a', 'b', 'c', 'siswa-1', 'siswa-2']) {
        const kunci = undiKataGerbang(z, u).map((k) => k.word).join('|');
        assert.ok(sah.has(kunci), `zona ${z}: undian menghasilkan varian di luar bank`);
      }
    }
  });
});

describe('materi wajib dari validasi dosen IPA — di format yang benar-benar dipakai Level 1', () => {
  // Level 1 memakai teka-teki kata, bukan pilihan ganda. Karena itu materi yang
  // diminta dosen saat validasi harus dapat dijumpai DI SINI — bukan hanya di
  // data yang tidak pernah tampil ke siswa.
  const semuaKata = ZONA.flatMap((z) => varianZona(z).flatMap((v) => v.map((k) => k.word)));
  const semuaPetunjuk = ZONA.flatMap((z) => varianZona(z).flatMap((v) => v.map((k) => k.hint)));
  const seluruhTeks = [...semuaKata, ...semuaPetunjuk].join(' ').toUpperCase();

  test('ada kata tentang tumbukan dua lempeng benua (Himalaya)', () => {
    assert.ok(semuaKata.includes('HIMALAYA'), 'kata HIMALAYA tidak ada di bank kata gerbang');
    assert.ok(
      /DUA LEMPENG BENUA|LEMPENG BENUA/i.test(seluruhTeks),
      'tidak ada petunjuk yang menyebut tumbukan dua lempeng benua',
    );
  });

  test('ada kata yang membedakan pegunungan lipatan dari gunung api', () => {
    assert.ok(semuaKata.includes('LIPATAN'), 'kata LIPATAN tidak ada di bank kata gerbang');
    assert.ok(/GUNUNG API/i.test(seluruhTeks), 'petunjuk pembeda gunung api tidak ditemukan');
  });

  test('ada pengetahuan lokal Indonesia (lempeng & kerawanan gempa)', () => {
    // Set jawaban ASLI menempatkan materi dosen ini di zona Kerak Bumi. Karena
    // penempatan zona bisa berubah, diperiksa ke SELURUH bank - yang penting
    // pengetahuannya masih ADA dan tetap dipakai.
    const semua = Object.keys(ZONE_GATE_BANK)
      .map(Number)
      .flatMap((z) => varianZona(z).flat().map((k) => k.word));

    assert.ok(semua.includes('INDONESIA'), 'materi dosen tentang Indonesia hilang dari bank');
    assert.ok(semua.includes('GEMPA'), 'materi dosen tentang kerawanan gempa hilang dari bank');
  });

  test('ada materi mantel sebagai fluida kental, bukan batuan padat', () => {
    assert.ok(semuaKata.includes('FLUIDA'), 'kata FLUIDA tidak ada di bank kata gerbang');
    assert.ok(/KENTAL/i.test(seluruhTeks), 'petunjuk yang menyebut fluida kental tidak ditemukan');
  });
});
