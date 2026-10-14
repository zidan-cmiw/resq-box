// ── bankSoal.test.ts ─────────────────────────────────────────────────────────
// Uji bank soal dan mesin pengundiannya.
//
// MENGAPA UJI INI ADA
//
//   1. Bank soal ditulis bertahap dan akan terus bertambah. Satu soal yang
//      salah (mis. punya DUA kunci benar, atau hanya punya 3 pilihan) akan
//      membuat siswa kehilangan nilai tanpa alasan yang jelas. Uji ini
//      menangkapnya sebelum sampai ke siswa.
//
//   2. Sifat "acak tetapi adil" adalah JANJI kepada guru. Janji itu tidak boleh
//      hanya berupa komentar di dalam kode — di sini ia dibuktikan: hasilnya
//      tetap untuk siswa yang sama, berbeda antar-siswa, dan komposisi tingkat
//      kesulitannya sama untuk semua orang.
//
//   3. Materi yang secara khusus diminta dosen IPA saat validasi (tumbukan dua
//      lempeng benua tidak menghasilkan subduksi; kolisi menghasilkan
//      pegunungan, subduksi menghasilkan gunung api; pengetahuan lokal
//      Indonesia) diuji keberadaannya supaya tidak terhapus tanpa sengaja.
//
// Jalankan: npm run test

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { BANK_SOAL, URUTAN_TINGKAT, kunciJawaban, soalUntukArea } from '../data/bankSoal.ts';
import { komposisiTingkat, undiSoal } from '../engine/undianSoal.ts';

describe('bank soal — keabsahan isi', () => {
  test('id soal unik', () => {
    const id = BANK_SOAL.map((s) => s.id);
    const ganda = id.filter((x, i) => id.indexOf(x) !== i);
    assert.deepEqual(ganda, [], `id soal ganda: ${ganda.join(', ')}`);
  });

  test('setiap soal punya tepat 4 pilihan jawaban', () => {
    const salah = BANK_SOAL.filter((s) => s.opsi.length !== 4).map(
      (s) => `${s.id} (${s.opsi.length} pilihan)`,
    );
    assert.deepEqual(salah, [], `jumlah pilihan tidak 4: ${salah.join('; ')}`);
  });

  test('setiap soal punya tepat SATU kunci benar', () => {
    const salah: string[] = [];
    for (const s of BANK_SOAL) {
      const jumlahBenar = s.opsi.filter((o) => o.benar === true).length;
      if (jumlahBenar !== 1) salah.push(`${s.id} (${jumlahBenar} kunci)`);
      if (kunciJawaban(s) === null) salah.push(`${s.id} (tanpa kunci)`);
    }
    assert.deepEqual(salah, [], `kunci jawaban bermasalah: ${salah.join('; ')}`);
  });

  test('id pilihan di dalam satu soal tidak kembar', () => {
    const salah: string[] = [];
    for (const s of BANK_SOAL) {
      const id = s.opsi.map((o) => o.id);
      if (new Set(id).size !== id.length) salah.push(s.id);
    }
    assert.deepEqual(salah, [], `id pilihan kembar: ${salah.join(', ')}`);
  });

  test('pertanyaan, pilihan, dan penjelasan tidak kosong', () => {
    const kosong: string[] = [];
    for (const s of BANK_SOAL) {
      if (s.pertanyaan.trim() === '') kosong.push(`${s.id}.pertanyaan`);
      if (s.penjelasan.trim() === '') kosong.push(`${s.id}.penjelasan`);
      if (s.area.trim() === '') kosong.push(`${s.id}.area`);
      for (const o of s.opsi) {
        if (o.teks.trim() === '') kosong.push(`${s.id}.opsi.${o.id}`);
      }
    }
    assert.deepEqual(kosong, [], `bagian kosong: ${kosong.join(', ')}`);
  });

  test('penjelasan cukup panjang untuk benar-benar mengajari', () => {
    // Bukan sekadar "Benar." — penjelasan harus menerangkan sebabnya.
    const terlaluPendek = BANK_SOAL.filter((s) => s.penjelasan.trim().length < 60).map(
      (s) => `${s.id} (${s.penjelasan.trim().length} huruf)`,
    );
    assert.deepEqual(terlaluPendek, [], `penjelasan terlalu pendek: ${terlaluPendek.join('; ')}`);
  });

  test('tingkat kesulitan hanya mudah, sedang, atau sulit', () => {
    const asing = BANK_SOAL.filter((s) => !URUTAN_TINGKAT.includes(s.tingkat)).map((s) => s.id);
    assert.deepEqual(asing, [], `tingkat tidak dikenal: ${asing.join(', ')}`);
  });

  test('setiap area yang punya soal menyediakan ketiga tingkat', () => {
    // Tanpa ini, undian tidak dapat adil: ada siswa yang terpaksa mendapat
    // tingkat berbeda hanya karena banknya belum lengkap.
    const area = [...new Set(BANK_SOAL.map((s) => s.area))];
    const kurang: string[] = [];
    for (const a of area) {
      for (const t of URUTAN_TINGKAT) {
        const jumlah = soalUntukArea(a).filter((s) => s.tingkat === t).length;
        if (jumlah === 0) kurang.push(`${a}/${t}`);
      }
    }
    assert.deepEqual(kurang, [], `area tanpa soal pada tingkat tertentu: ${kurang.join(', ')}`);
  });
});

describe('undian soal — keadilan dan keterulangan', () => {
  const AREA = 'mantle';

  test('jumlah soal sesuai permintaan', () => {
    assert.equal(undiSoal({ area: AREA, userId: 'siswa-1' }).length, 3);
    assert.equal(undiSoal({ area: AREA, userId: 'siswa-1', jumlah: 2 }).length, 2);
  });

  test('hasilnya TETAP bila diundi ulang dengan benih yang sama', () => {
    // Inilah yang mencegah siswa "mengundi ulang" dengan me-refresh halaman.
    const a = undiSoal({ area: AREA, userId: 'siswa-1' }).map((s) => s.id);
    const b = undiSoal({ area: AREA, userId: 'siswa-1' }).map((s) => s.id);
    assert.deepEqual(a, b, 'undian yang sama menghasilkan soal berbeda');
  });

  test('ulangan yang berbeda menghasilkan undian yang berbeda', () => {
    const pertama = undiSoal({ area: AREA, userId: 'siswa-1', ulangan: 0 }).map((s) => s.id);
    const kedua = undiSoal({ area: AREA, userId: 'siswa-1', ulangan: 1 }).map((s) => s.id);
    assert.notDeepEqual(pertama, kedua, 'ulangan tidak mengubah undian');
  });

  test('siswa berbeda mendapat soal yang berbeda', () => {
    const pengguna = Array.from({ length: 100 }, (_, i) => `siswa-${i}`);
    const undian = new Set(pengguna.map((u) => undiSoal({ area: AREA, userId: u }).map((s) => s.id).join('|')));
    // Bank berisi 3 soal per tingkat, jadi ada 3 x 3 x 3 = 27 kemungkinan.
    // Kalau undiannya benar-benar berbeda antar-siswa, jumlah kombinasi unik
    // seharusnya jauh lebih dari satu.
    assert.ok(
      undian.size >= 10,
      `hanya ${undian.size} kombinasi unik dari 100 siswa — undiannya tidak cukup bervariasi`,
    );
  });

  test('KOMPOSISI TINGKAT sama untuk semua siswa (inilah keadilannya)', () => {
    for (let i = 0; i < 50; i++) {
      const soal = undiSoal({ area: AREA, userId: `siswa-${i}` });
      assert.deepEqual(
        soal.map((s) => s.tingkat),
        ['mudah', 'sedang', 'sulit'],
        `siswa-${i} mendapat komposisi tingkat yang tidak adil`,
      );
    }
  });

  test('dua soal yang sama tidak pernah muncul dalam satu undian', () => {
    for (let i = 0; i < 50; i++) {
      const id = undiSoal({ area: AREA, userId: `siswa-${i}` }).map((s) => s.id);
      assert.equal(new Set(id).size, id.length, `ada soal kembar pada siswa-${i}`);
    }
  });

  test('area yang belum punya soal tidak membuat gagal, hanya kosong', () => {
    assert.deepEqual(undiSoal({ area: 'area-yang-belum-ada', userId: 'siswa-1' }), []);
  });

  test('permintaan 0 soal menghasilkan daftar kosong', () => {
    assert.deepEqual(undiSoal({ area: AREA, userId: 'siswa-1', jumlah: 0 }), []);
  });

  test('permintaan melebihi isi bank hanya mengembalikan sejumlah yang ada', () => {
    const jumlahBank = soalUntukArea(AREA).length;
    assert.equal(undiSoal({ area: AREA, userId: 'siswa-1', jumlah: 99 }).length, jumlahBank);
  });
});

describe('komposisiTingkat — pembagian yang adil', () => {
  test('3 soal dibagi satu per tingkat', () => {
    assert.deepEqual(komposisiTingkat(3), ['mudah', 'sedang', 'sulit']);
  });

  test('2 soal dibagi ke tingkat paling ringan lebih dahulu', () => {
    assert.deepEqual(komposisiTingkat(2), ['mudah', 'sedang']);
  });

  test('selisih jumlah antar-tingkat tidak lebih dari satu', () => {
    for (let n = 1; n <= 12; n++) {
      const komposisi = komposisiTingkat(n);
      const hitung = URUTAN_TINGKAT.map((t) => komposisi.filter((x) => x === t).length);
      const selisih = Math.max(...hitung) - Math.min(...hitung);
      assert.ok(selisih <= 1, `untuk ${n} soal, pembagiannya tidak rata: ${hitung.join('/')}`);
    }
  });
});

describe('materi wajib dari validasi dosen IPA', () => {
  const semuaTeks = BANK_SOAL.map(
    (s) => `${s.pertanyaan} ${s.opsi.map((o) => o.teks).join(' ')} ${s.penjelasan}`,
  ).join(' ');

  test('ada soal tentang tumbukan dua lempeng benua yang tidak menunjam', () => {
    assert.ok(
      /dua lempeng benua|sesama lempeng benua|dua lempeng BENUA/i.test(semuaTeks),
      'soal tentang tumbukan dua lempeng benua tidak ditemukan',
    );
  });

  test('ada soal yang membedakan pegunungan lipatan dari gunung api', () => {
    assert.ok(
      /pegunungan lipatan/i.test(semuaTeks) && /gunung api/i.test(semuaTeks),
      'soal pembeda pegunungan lipatan vs gunung api tidak ditemukan',
    );
  });

  test('ada soal yang menyebut Himalaya sebagai contoh kolisi benua', () => {
    assert.ok(/Himalaya/i.test(semuaTeks), 'contoh Himalaya tidak ditemukan');
  });

  test('ada soal pengetahuan lokal Indonesia (Indo-Australia & Eurasia)', () => {
    assert.ok(
      /Indo-Australia/i.test(semuaTeks) && /Eurasia/i.test(semuaTeks),
      'pengetahuan lokal tentang lempeng Indonesia tidak ditemukan',
    );
  });

  test('ada soal yang kunci jawabannya menyebut mantel sebagai fluida kental', () => {
    const soalMantel = BANK_SOAL.filter((s) => s.area === 'mantle');
    const adaKunciFluida = soalMantel.some((s) => {
      const kunci = s.opsi.find((o) => o.benar === true);
      return Boolean(kunci && /fluida\s+(sangat\s+)?kental/i.test(kunci.teks));
    });
    assert.ok(
      adaKunciFluida,
      'tidak ada kunci jawaban yang menyebut mantel sebagai fluida kental',
    );
  });

  test('kunci jawaban & penjelasan mantel TIDAK menyebutnya batuan padat', () => {
    // Catatan penting: pilihan yang SALAH (distraktor) justru BOLEH menyebut
    // "batuan padat" — memang itulah miskonsepsi yang harus dikenali siswa.
    // Yang tidak boleh adalah KUNCI atau PENJELASAN yang menyatakannya, karena
    // keduanya itulah yang dipercaya siswa sebagai benar.
    const bermasalah: string[] = [];
    for (const s of BANK_SOAL.filter((x) => x.area === 'mantle')) {
      const kunci = s.opsi.find((o) => o.benar === true);
      if (kunci && /batuan padat/i.test(kunci.teks)) bermasalah.push(`${s.id} (kunci jawaban)`);
      if (/batuan padat/i.test(s.penjelasan)) bermasalah.push(`${s.id} (penjelasan)`);
    }
    assert.deepEqual(
      bermasalah,
      [],
      `mantel masih disebut batuan padat pada: ${bermasalah.join('; ')}`,
    );
  });
});
