// ── bankTTS.test.ts ──────────────────────────────────────────────────────────
// Uji bank grid Teka-Teki Silang Level 2.
//
// MENGAPA UJI INI PALING PENTING DI LEVEL 2
//
//   Sebuah TTS dapat terlihat benar di layar padahal MUSTAHIL DISELESAIKAN.
//   Penyebabnya satu: dua kata yang bersilangan berbagi satu kotak, sehingga
//   hurufnya wajib sama. Kalau tidak sama, siswa akan mengisi dan selalu salah
//   — tanpa pesan error apa pun, dan tanpa tahu mengapa.
//
//   Karena itu `periksaGrid` dijalankan atas SELURUH grid di dalam bank, dan
//   setiap masalah dilaporkan dengan nama grid serta koordinat kotaknya supaya
//   penulisnya langsung tahu bagian mana yang harus diperbaiki.
//
// Jalankan: npm run test

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { varianTTS, periksaGrid, undiGridTTS } from '../bankTTS.ts';
import { LEVEL2_AREAS } from '../level2Data.ts';

/**
 * Seluruh area Level 2, DITURUNKAN dari datanya, bukan ditulis tangan.
 * Ditulis tangan membuat daftar ini bisa basi begitu ada area baru - dan area
 * yang lupa didaftarkan justru area yang paling perlu diuji.
 */
// Area yang PUNYA soal TTS, mengikuti BANK SOAL RESQ-BOX.
// Area indeks 1 (Simulasi Tanggap Gempa) dan 4 (Simulasi Erupsi Merapi)
// sengaja tidak punya TTS - penilaiannya lewat jalannya simulasi itu sendiri.
const AREA = [0, 2, 3, 5];

/** Area yang WAJIB punya soal TTS. Area simulasi (1 dan 4) tidak wajib. */
const areaWajibBerTTS = (i: number) => i === 0 || i === 2 || i === 3 || i === 5;

/** Jalankan validator atas seluruh bank, kumpulkan kegagalannya. */
function semuaMasalah(): string[] {
  const keluhan: string[] = [];
  for (const area of AREA) {
    varianTTS(area).forEach((grid, i) => {
      for (const m of periksaGrid(grid)) {
        keluhan.push(`area ${area} varian ${i}: ${m}`);
      }
    });
  }
  return keluhan;
}

/**
 * Area yang variannya MASIH DITULIS.
 *
 * Sudah KOSONG: seluruh lima area kini punya tiga varian grid. Bila kelak ada
 * area baru yang variannya belum lengkap, daftarkan di sini — dan uji di bawah
 * akan menolak area yang sudah cukup varian tetapi masih terdaftar, sehingga
 * daftar ini tidak bisa menjadi alasan permanen untuk melewati aturan keadilan.
 */
const AREA_MENUNGGU_VARIAN: number[] = [];

describe('bank TTS — setiap grid WAJIB dapat diselesaikan', () => {  test('tidak ada satu pun grid yang mustahil diisi', () => {
    assert.deepEqual(semuaMasalah(), [], `grid bermasalah:\n  ${semuaMasalah().join('\n  ')}`);
  });

  test('validator benar-benar menangkap titik potong yang tidak cocok', () => {
    // Uji atas validatornya sendiri. Kalau validator ini tidak bekerja, seluruh
    // pemeriksaan di atas menjadi tidak berarti.
    const rusak = {
      rows: 5,
      cols: 5,
      clues: [
        {
          id: 'x1',
          number: 1,
          direction: 'across' as const,
          answer: 'BENAR',
          clue: 'kata mendatar',
          startRow: 0,
          startCol: 0,
        },
        {
          // Berbagi kotak (0,1) dengan BENAR. BENAR[1] = 'E', tetapi kata ini
          // dimulai dengan 'A' -> harus dilaporkan sebagai bentrok.
          id: 'x2',
          number: 2,
          direction: 'down' as const,
          answer: 'AMAN',
          clue: 'kata menurun',
          startRow: 0,
          startCol: 1,
        },
      ],
    };
    const masalah = periksaGrid(rusak);
    assert.ok(
      masalah.some((m) => m.includes('BENTROK')),
      `validator tidak menangkap bentrok titik potong: ${JSON.stringify(masalah)}`,
    );
  });

  test('validator menerima grid yang titik potongnya cocok', () => {
    const benar = {
      rows: 5,
      cols: 5,
      clues: [
        {
          id: 'y1',
          number: 1,
          direction: 'across' as const,
          answer: 'BENAR',
          clue: 'kata mendatar',
          startRow: 0,
          startCol: 0,
        },
        {
          // BENAR[1] = 'E', dan kata ini dimulai dengan 'E' -> cocok.
          id: 'y2',
          number: 2,
          direction: 'down' as const,
          answer: 'ENAK',
          clue: 'kata menurun',
          startRow: 0,
          startCol: 1,
        },
      ],
    };
    assert.deepEqual(periksaGrid(benar), [], 'grid yang sah justru ditolak');
  });

  test('validator menangkap huruf yang jatuh di luar batas grid', () => {
    const keluar = {
      rows: 3,
      cols: 3,
      clues: [
        {
          id: 'z1',
          number: 1,
          direction: 'across' as const,
          answer: 'PANJANGSEKALI',
          clue: 'terlalu panjang untuk grid 3 kolom',
          startRow: 0,
          startCol: 0,
        },
      ],
    };
    assert.ok(
      periksaGrid(keluar).some((m) => m.includes('luar batas')),
      'validator tidak menangkap huruf di luar batas grid',
    );
  });
});

describe('bank TTS — kotak tidak boleh menempel', () => {
  // Aturan ini ditambahkan karena tampilan TTS sempat "berantakan": tiga kata
  // MENURUN berdiri di kolom bersebelahan, sehingga kotak-kotaknya menyatu
  // menjadi satu blok dan batas tiap kata tidak terlihat lagi.
  //
  // Uji ini membuktikan validator BENAR-BENAR MENANGKAP pelanggarannya;
  // tanpa bukti itu, "tidak ada temuan" pada seluruh bank tidak bermakna.

  test('validator menangkap dua kata MENURUN yang berdampingan', () => {
    const grid = {
      rows: 8,
      cols: 4,
      clues: [
        { id: 'a', number: 1, direction: 'down' as const, answer: 'MAMA',
          clue: 'contoh', startRow: 0, startCol: 0 },
        { id: 'b', number: 2, direction: 'down' as const, answer: 'PAPA',
          clue: 'contoh', startRow: 0, startCol: 1 },
      ],
    };
    const masalah = periksaGrid(grid);
    assert.ok(
      masalah.some((m) => m.includes('berdampingan')),
      `validator harus melaporkan kata berdampingan, tetapi hasilnya: ${JSON.stringify(masalah)}`,
    );
  });

  test('validator menangkap dua kata MENDATAR yang berdampingan', () => {
    const grid = {
      rows: 4,
      cols: 8,
      clues: [
        { id: 'a', number: 1, direction: 'across' as const, answer: 'MAMA',
          clue: 'contoh', startRow: 0, startCol: 0 },
        { id: 'b', number: 2, direction: 'across' as const, answer: 'PAPA',
          clue: 'contoh', startRow: 1, startCol: 0 },
      ],
    };
    const masalah = periksaGrid(grid);
    assert.ok(masalah.some((m) => m.includes('berdampingan')));
  });

  test('validator TIDAK menuduh kata yang berjarak cukup', () => {
    const grid = {
      rows: 8,
      cols: 4,
      clues: [
        { id: 'a', number: 1, direction: 'down' as const, answer: 'MAMA',
          clue: 'contoh', startRow: 0, startCol: 0 },
        { id: 'b', number: 2, direction: 'down' as const, answer: 'PAPA',
          clue: 'contoh', startRow: 0, startCol: 2 },
      ],
    };
    const masalah = periksaGrid(grid);
    assert.ok(
      !masalah.some((m) => m.includes('berdampingan')),
      'kata berjarak 2 kolom tidak boleh dilaporkan berdampingan',
    );
  });
});

describe('bank TTS — keabsahan isi', () => {
  test('SETIAP area Level 2 punya grid di bank — tidak ada yang jatuh ke cadangan', () => {
    // Inilah penjaga terpenting berkas ini.
    //
    // Kejadian nyata: area 4 (Simulasi Erupsi Merapi) pernah TIDAK punya entri
    // di bank, sehingga undiannya jatuh ke cadangan area 0 - dan siswa di area
    // erupsi justru mendapat teka-teki bertema GEMPA. Tidak ada error apa pun.
    //
    // Daftar area diambil dari LEVEL2_AREAS supaya penjaga ini ikut menangkap
    // area baru yang ditambahkan kelak tanpa grid.
    const hilang = LEVEL2_AREAS.map((a, i) => ({ i, id: a.id }))
      .filter(({ i }) => areaWajibBerTTS(i))
      .filter(({ i }) => varianTTS(i).length === 0)
      .map(({ i, id }) => `indeks ${i} (${id})`);

    assert.deepEqual(
      hilang,
      [],
      `area tanpa grid — materinya akan diam-diam memakai grid area lain:\n  ${hilang.join('\n  ')}`,
    );
  });

  test('bank tidak menyimpan kunci area yang bukan area Level 2', () => {
    // Kebalikannya: kunci yang tidak punya area berarti grid yang tidak akan
    // pernah terundi, jadi sia-sia ditulis.
    const jumlahArea = LEVEL2_AREAS.length;
    const berlebih = Object.keys(AREA)
      .map(Number)
      .filter((i) => i < 0 || i >= jumlahArea);

    assert.deepEqual(berlebih, [], `kunci area di luar jangkauan: ${berlebih.join(', ')}`);
  });

  test('seluruh area yang diuji memang ada di bank', () => {
    const hilang = AREA.filter((a) => varianTTS(a).length === 0);
    assert.deepEqual(hilang, [], `area tanpa grid: ${hilang.join(', ')}`);
  });

  test('setiap area punya minimal 2 varian supaya benar-benar dapat diundi', () => {
    // Kalau hanya ada satu varian, seluruh siswa tetap mendapat teka-teki yang
    // sama dan pengundian ini tidak ada gunanya.
    const kurang = AREA.filter(
      (a) => !AREA_MENUNGGU_VARIAN.includes(a) && varianTTS(a).length < 2,
    ).map((a) => `area ${a} (${varianTTS(a).length} varian)`);
    assert.deepEqual(kurang, [], `varian kurang: ${kurang.join(', ')}`);
  });

  test('daftar area yang menunggu varian tidak boleh basi', () => {
    // Begitu sebuah area sudah punya >= 2 varian, ia WAJIB dikeluarkan dari
    // daftar penunggu. Tanpa uji ini, daftar itu bisa dipakai selamanya untuk
    // menghindari aturan keadilan.
    const sudahCukup = AREA_MENUNGGU_VARIAN.filter((a) => varianTTS(a).length >= 2);
    assert.deepEqual(
      sudahCukup,
      [],
      `area ini sudah punya >= 2 varian, keluarkan dari AREA_MENUNGGU_VARIAN: ${sudahCukup.join(', ')}`,
    );
  });

  test('setiap soal TTS berisi 3 atau 4 kata (sesuai bank soal)', () => {
    // BANK SOAL memecah evaluasi tiap area menjadi 5 SOAL kecil, bukan satu
    // teka-teki besar. Tiap soal memuat 2-3 petunjuk mendatar/menurun sehingga
    // jumlah katanya 3 atau 4.
    const aneh: string[] = [];
    for (const a of AREA) {
      varianTTS(a).forEach((g, i) => {
        if (g.clues.length < 3 || g.clues.length > 4) {
          aneh.push(`area ${a} soal ${i + 1} (${g.clues.length} kata)`);
        }
      });
    }
    assert.deepEqual(aneh, [], `jumlah kata tidak wajar: ${aneh.join('; ')}`);
  });

  test('setiap area berTTS berisi TEPAT 5 soal', () => {
    const salah = AREA.filter((a) => varianTTS(a).length !== 5)
      .map((a) => `area ${a} (${varianTTS(a).length} soal)`);
    assert.deepEqual(salah, [], `jumlah soal tidak lima: ${salah.join('; ')}`);
  });

  test('setiap jawaban berupa huruf kapital A-Z dan cukup panjang', () => {
    const salah: string[] = [];
    for (const a of AREA) {
      varianTTS(a).forEach((g, i) => {
        for (const c of g.clues) {
          if (!/^[A-Z]+$/.test(c.answer)) salah.push(`area ${a}.${i} "${c.answer}" bukan A-Z`);
          if (c.answer.length < 3) salah.push(`area ${a}.${i} "${c.answer}" terlalu pendek`);
        }
      });
    }
    assert.deepEqual(salah, [], `jawaban bermasalah: ${salah.join('; ')}`);
  });

  test('setiap petunjuk cukup panjang untuk menuntun', () => {
    const pendek: string[] = [];
    for (const a of AREA) {
      varianTTS(a).forEach((g, i) => {
        for (const c of g.clues) {
          if (c.clue.trim().length < 40) pendek.push(`area ${a}.${i} "${c.answer}"`);
        }
      });
    }
    assert.deepEqual(pendek, [], `petunjuk terlalu pendek: ${pendek.join('; ')}`);
  });

  test('ukuran grid wajar dan setiap kata muat di dalamnya', () => {
    const aneh: string[] = [];
    for (const a of AREA) {
      varianTTS(a).forEach((g, i) => {
        if (g.rows < 3 || g.cols < 3) aneh.push(`area ${a}.${i} ukuran ${g.rows}x${g.cols}`);
        const terpanjang = Math.max(...g.clues.map((c) => c.answer.length));
        if (terpanjang > Math.max(g.rows, g.cols)) {
          aneh.push(`area ${a}.${i} kata terpanjang ${terpanjang} lebih panjang dari grid`);
        }
      });
    }
    assert.deepEqual(aneh, [], `ukuran grid bermasalah: ${aneh.join('; ')}`);
  });

  test('tidak ada jawaban yang diulang antar-varian pada area yang sama', () => {
    // Kalau diulang, dua siswa bisa mengisi kata yang sama walau gridnya berbeda.
    const ulang: string[] = [];
    for (const a of AREA) {
      const semua = varianTTS(a).flatMap((g) => g.clues.map((c) => c.answer));
      const ganda = [...new Set(semua.filter((x, i) => semua.indexOf(x) !== i))];
      if (ganda.length > 0) ulang.push(`area ${a} (${ganda.join(', ')})`);
    }
    assert.deepEqual(ulang, [], `jawaban diulang antar-varian: ${ulang.join('; ')}`);
  });
});

describe('undian grid TTS — berbeda antar-siswa, tetap bagi satu siswa', () => {
  test('hasilnya TETAP bila diundi ulang untuk siswa yang sama', () => {
    for (const a of AREA) {
      const pertama = JSON.stringify(undiGridTTS(a, 'siswa-1'));
      const kedua = JSON.stringify(undiGridTTS(a, 'siswa-1'));
      assert.equal(pertama, kedua, `area ${a}: undian berubah untuk siswa yang sama`);
    }
  });

  test('hasilnya selalu salah satu grid yang sah dari area itu', () => {
    for (const a of AREA) {
      const sah = new Set(varianTTS(a).map((g) => JSON.stringify(g)));
      for (const u of ['a', 'b', 'siswa-1', 'siswa-2', 'guru-1']) {
        const hasil = undiGridTTS(a, u);
        assert.ok(hasil !== null, `area ${a}: undian menghasilkan null`);
        assert.ok(sah.has(JSON.stringify(hasil)), `area ${a}: undian di luar bank`);
      }
    }
  });

  test('siswa berbeda mendapat grid yang berbeda', () => {
    const kurangBervariasi: string[] = [];
    for (const a of AREA) {
      // Area yang variannya masih ditulis belum bisa bervariasi. Dijaga oleh uji
      // "daftar area yang menunggu varian tidak boleh basi" di atas.
      if (AREA_MENUNGGU_VARIAN.includes(a)) continue;
      const terpakai = new Set(
        Array.from({ length: 100 }, (_, i) => JSON.stringify(undiGridTTS(a, `siswa-${i}`))),
      );
      if (terpakai.size < 2) kurangBervariasi.push(`area ${a} (hanya ${terpakai.size} grid terpakai)`);
    }
    assert.deepEqual(kurangBervariasi, [], `undian tidak bervariasi: ${kurangBervariasi.join('; ')}`);
  });

  test('setiap varian yang ada benar-benar mungkin terundi', () => {
    const tidakTerpakai: string[] = [];
    for (const a of AREA) {
      const terpakai = new Set(
        Array.from({ length: 300 }, (_, i) => JSON.stringify(undiGridTTS(a, `siswa-${i}`))),
      );
      const total = varianTTS(a).length;
      if (terpakai.size < total) {
        tidakTerpakai.push(`area ${a} (${terpakai.size} dari ${total} varian terpakai)`);
      }
    }
    assert.deepEqual(tidakTerpakai, [], `ada varian yang tak pernah terundi: ${tidakTerpakai.join('; ')}`);
  });

  test('area yang tidak ada di bank tetap memberi grid cadangan, bukan null', () => {
    assert.ok(undiGridTTS(99, 'siswa-1') !== null, 'area tak dikenal menghasilkan null');
  });
});
