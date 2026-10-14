// ── pencocokanQA.test.ts ─────────────────────────────────────────────────────
// Uji chatbot materi: bank QA guru dan mesin pencocokan lokalnya.
//
// MENGAPA UJI INI ADA
//
//   1. Chatbot ini TIDAK memakai AI. Jawabannya berasal dari bank yang ditulis
//      guru. Karena itu mutunya sepenuhnya bergantung pada mesin pencocokan:
//      kalau pencocokannya salah, siswa mendapat jawaban yang tidak nyambung —
//      dan itu lebih buruk daripada tidak menjawab sama sekali.
//
//   2. Yang diuji di sini adalah cara siswa BERTANYA SEBENARNYA: singkat, tanpa
//      ejaan baku, kadang memakai istilah daerah ("wedhus gembel"). Bukan
//      kalimat rapi seperti di buku.
//
//   3. Chatbot harus JUJUR saat tidak tahu. Kalau ia memaksakan jawaban untuk
//      pertanyaan yang tidak ada di bank, siswa bisa salah bertindak saat
//      bencana sungguhan.
//
//   4. Biaya nol hanya benar bila TIDAK ADA panggilan jaringan. Diuji dengan
//      memastikan seluruh fungsinya berjalan SINKRON dan tidak menyentuh
//      `fetch` sama sekali.
//
// Jalankan: npm run test

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { BANK_QA } from '../data/bankQA.ts';
import {
  normalisasi,
  tokenisasi,
  cocokkanQA,
  jawabPertanyaan,
  skorAkhirPertanyaan,
  AMBANG_COCOK,
} from '../engine/pencocokanQA.ts';

/** Ambil id jawaban teratas untuk sebuah pertanyaan. */
function idTeratas(pertanyaan: string): string | null {
  const hasil = cocokkanQA(pertanyaan);
  return hasil.length > 0 ? hasil[0].entri.id : null;
}

describe('bank QA — keabsahan isi', () => {
  test('id entri unik', () => {
    const id = BANK_QA.map((e) => e.id);
    const ganda = id.filter((x, i) => id.indexOf(x) !== i);
    assert.deepEqual(ganda, [], `id ganda: ${ganda.join(', ')}`);
  });

  test('pertanyaan, jawaban, dan topik tidak kosong', () => {
    const kosong: string[] = [];
    for (const e of BANK_QA) {
      if (e.pertanyaan.trim() === '') kosong.push(`${e.id}.pertanyaan`);
      if (e.jawaban.trim() === '') kosong.push(`${e.id}.jawaban`);
      if (e.topik.trim() === '') kosong.push(`${e.id}.topik`);
      if (e.kataKunci.length === 0) kosong.push(`${e.id}.kataKunci`);
    }
    assert.deepEqual(kosong, [], `bagian kosong: ${kosong.join(', ')}`);
  });

  test('jawaban cukup panjang untuk benar-benar menjelaskan', () => {
    const pendek = BANK_QA.filter((e) => e.jawaban.trim().length < 80).map(
      (e) => `${e.id} (${e.jawaban.trim().length} huruf)`,
    );
    assert.deepEqual(pendek, [], `jawaban terlalu pendek: ${pendek.join('; ')}`);
  });

  test('kata kunci setiap entri menghasilkan token yang bermakna', () => {
    // Kata kunci yang seluruhnya berupa kata umum akan mustahil dicocokkan.
    const mandul = BANK_QA.filter((e) =>
      e.kataKunci.every((kk) => tokenisasi(kk).length === 0),
    ).map((e) => e.id);
    assert.deepEqual(mandul, [], `kata kunci tanpa token: ${mandul.join(', ')}`);
  });

  test('ada cukup banyak topik untuk memberi saran', () => {
    const topik = new Set(BANK_QA.map((e) => e.topik));
    assert.ok(topik.size >= 6, `hanya ${topik.size} topik — saran akan terlalu sempit`);
  });
});

describe('normalisasi & tokenisasi', () => {
  test('huruf kecil dan tanda baca dibuang', () => {
    assert.equal(normalisasi('Apa itu GEMPA?!'), 'apa itu gempa');
  });

  test('kata umum dibuang', () => {
    assert.deepEqual(tokenisasi('apa itu gempa bumi'), ['gempa', 'bumi']);
  });

  test('istilah daerah diseragamkan', () => {
    // "lindu" adalah sebutan Jawa untuk gempa.
    assert.ok(tokenisasi('lindu itu apa').includes('gempa'));
    // "wedhus gembel" adalah sebutan Jawa untuk awan panas.
    const wedhus = tokenisasi('wedhus gembel');
    assert.ok(wedhus.includes('awan') && wedhus.includes('panas'));
  });

  test('ragam kata tanya diseragamkan', () => {
    assert.deepEqual(tokenisasi('gimana cara main'), tokenisasi('bagaimana cara main'));
  });
});

describe('pencocokan — pertanyaan siswa yang sesungguhnya', () => {
  test('pertanyaan panjang mengenai lapisan bumi', () => {
    assert.equal(idTeratas('ada berapa lapisan di dalam bumi?'), 'qa-lapisan-bumi');
  });

  test('pertanyaan singkat tanpa ejaan baku', () => {
    assert.equal(idTeratas('mantel bumi bahannya apa'), 'qa-mantel-bumi');
  });

  test('miskonsepsi mantel sebagai batuan padat', () => {
    assert.equal(idTeratas('apakah mantel bumi itu batuan padat'), 'qa-mantel-bukan-padat');
  });

  test('istilah daerah untuk awan panas', () => {
    assert.equal(idTeratas('wedhus gembel itu apa'), 'qa-awan-panas');
  });

  test('pertanyaan spesifik dengan satu kata jarang (himalaya)', () => {
    assert.equal(idTeratas('mengapa himalaya tidak ada gunung api'), 'qa-himalaya');
  });

  test('pertanyaan yang mengandung kata "tidak" tidak kehilangan makna', () => {
    // "tidak" sengaja TIDAK dibuang, karena membedakan makna.
    assert.equal(idTeratas('kenapa tidak boleh pakai lift saat gempa'), 'qa-jangan-pakai-lift');
  });

  test('pertanyaan tentang status gunung api', () => {
    assert.equal(idTeratas('status gunung merapi ada apa saja'), 'qa-status-gunung');
  });

  test('pertanyaan tentang lahar dingin', () => {
    assert.equal(idTeratas('apa itu lahar dingin'), 'qa-lahar-dingin');
  });

  test('pertanyaan tentang alat pemantau', () => {
    assert.equal(idTeratas('apa fungsi seismograf'), 'qa-seismograf');
  });

  test('pertanyaan tentang tindakan saat gempa', () => {
    assert.equal(idTeratas('apa yang harus dilakukan saat terjadi gempa'), 'qa-drop-cover-hold');
  });

  test('pertanyaan tentang korban luka', () => {
    assert.equal(idTeratas('bagaimana menolong teman yang terluka'), 'qa-menolong-korban');
  });

  test('pertanyaan tentang batas lempeng', () => {
    assert.equal(idTeratas('apa saja jenis batas lempeng'), 'qa-tiga-batas-lempeng');
  });

  test('jawaban yang diberikan benar-benar berasal dari bank', () => {
    const hasil = jawabPertanyaan('apa itu awan panas');
    assert.equal(hasil.jenis, 'jawaban');
    if (hasil.jenis === 'jawaban') {
      assert.ok(
        BANK_QA.some((e) => e.id === hasil.entri.id),
        'jawaban tidak berasal dari bank',
      );
      assert.ok(hasil.skor >= 0, 'skor tidak wajar');
    }
  });
});

describe('kejujuran chatbot saat tidak tahu', () => {
  test('pertanyaan di luar materi tidak dipaksakan dijawab', () => {
    const hasil = jawabPertanyaan('bagaimana cara membuat kue bolu yang lembut');
    assert.equal(
      hasil.jenis,
      'tidak_ditemukan',
      'chatbot menjawab pertanyaan yang tidak ada di bank — ini berbahaya untuk materi kebencanaan',
    );
  });

  test('pertanyaan kosong tidak membuat gagal', () => {
    const hasil = jawabPertanyaan('   ');
    assert.equal(hasil.jenis, 'tidak_ditemukan');
    if (hasil.jenis === 'tidak_ditemukan') {
      assert.ok(hasil.saran.length > 0, 'saran topik tidak boleh kosong');
    }
  });

  test('saat tidak tahu, chatbot tetap memberi saran topik', () => {
    const hasil = jawabPertanyaan('resep rendang padang');
    assert.equal(hasil.jenis, 'tidak_ditemukan');
    if (hasil.jenis === 'tidak_ditemukan') {
      assert.ok(hasil.saran.length > 0, 'saran topik tidak boleh kosong');
      for (const s of hasil.saran) {
        assert.ok(typeof s === 'string' && s.trim() !== '', 'saran topik kosong');
      }
    }
  });

  test('skor pertanyaan di luar materi jauh lebih rendah daripada pertanyaan sah', () => {
    const luar = cocokkanQA('bagaimana cara membuat kue bolu')[0].skor;
    const dalam = cocokkanQA('apa itu awan panas')[0].skor;
    assert.ok(
      dalam > luar,
      `pertanyaan sah (${dalam.toFixed(2)}) seharusnya lebih tinggi daripada pertanyaan luar materi (${luar.toFixed(2)})`,
    );
  });

  test('JARAK PEMISAH skor masih lebar — ambang tidak boleh mepet ke salah satu sisi', () => {
    // Uji ini adalah penjaga terpenting di berkas ini.
    //
    // Pembobotan IDF saja TIDAK cukup untuk memisahkan pertanyaan sah dari
    // pertanyaan luar materi: keduanya pernah sama-sama berskor 3,31 sehingga
    // rentangnya bertumpang-tindih dan ambang secanggih apa pun tidak akan
    // berhasil. Karena itu ditambahkan penalti untuk kata yang tidak dikenal
    // bank. Uji ini memastikan pemisahan itu BENAR-BENAR terjadi, dan akan
    // gagal bila suatu saat bank bertambah dan jaraknya kembali mepet.
    const pertanyaanSah = [
      'ada berapa lapisan di dalam bumi?',
      'mantel bumi bahannya apa',
      'apakah mantel bumi itu batuan padat',
      'wedhus gembel itu apa',
      'mengapa himalaya tidak ada gunung api',
      'kenapa tidak boleh pakai lift saat gempa',
      'status gunung merapi ada apa saja',
      'apa itu lahar dingin',
      'apa fungsi seismograf',
      'apa yang harus dilakukan saat terjadi gempa',
      'bagaimana menolong teman yang terluka',
      'apa saja jenis batas lempeng',
      'apa itu awan panas',
      'apa itu subduksi',
      'apa itu pvmbg',
      'apa isi tas siaga',
      'kenapa abu di atap harus dibersihkan',
      'apa itu krb',
      'bagaimana bantuan di pengungsian dibagi',
      'apa itu magnitudo',
    ];

    const luarMateri = [
      'bagaimana cara membuat kue bolu yang lembut',
      'resep rendang padang',
      'siapa presiden pertama indonesia',
      'berapa harga tiket kereta',
      'bagaimana cara belajar matematika',
    ];

    const sahTerendah = Math.min(...pertanyaanSah.map((q) => skorAkhirPertanyaan(q).skor));
    const luarTertinggi = Math.max(...luarMateri.map((q) => skorAkhirPertanyaan(q).skor));

    assert.ok(
      sahTerendah > luarTertinggi,
      `rentang skor bertumpang-tindih: sah terendah ${sahTerendah.toFixed(2)} vs luar tertinggi ${luarTertinggi.toFixed(2)}`,
    );

    // Ambang harus berada di dalam celah, dengan jarak yang tidak mepet.
    assert.ok(
      AMBANG_COCOK > luarTertinggi && AMBANG_COCOK < sahTerendah,
      `ambang ${AMBANG_COCOK} tidak berada di dalam celah (${luarTertinggi.toFixed(2)} .. ${sahTerendah.toFixed(2)})`,
    );

    const jarakBawah = AMBANG_COCOK - luarTertinggi;
    const jarakAtas = sahTerendah - AMBANG_COCOK;
    const jarakTerkecil = Math.min(jarakBawah, jarakAtas);
    assert.ok(
      jarakTerkecil >= 0.25,
      `jarak aman terlalu sempit: ${jarakTerkecil.toFixed(2)} (bawah ${jarakBawah.toFixed(2)}, atas ${jarakAtas.toFixed(2)})`,
    );
  });

  test('pertanyaan sah tetap dijawab walau memakai kata di luar bank', () => {
    // "fungsi" tidak ada di bank, tetapi pertanyaannya sah. Penalti luar-materi
    // hanya boleh berlaku bila kata tak dikenal MELEBIHI SEPARUH.
    const hasil = jawabPertanyaan('apa fungsi seismograf');
    assert.equal(hasil.jenis, 'jawaban');
  });
});

describe('biaya nol — tidak ada panggilan jaringan', () => {
  test('seluruh fungsi berjalan sinkron dan tidak memakai fetch', () => {
    // Kalau ada satu saja panggilan jaringan, `fetch` akan terpanggil di sini.
    const asli = globalThis.fetch;
    let terpanggil = false;
    globalThis.fetch = (() => {
      terpanggil = true;
      throw new Error('chatbot tidak boleh mengakses jaringan');
    }) as typeof globalThis.fetch;

    try {
      cocokkanQA('apa itu gempa bumi');
      jawabPertanyaan('apa itu gempa bumi');
      jawabPertanyaan('resep rendang');
      tokenisasi('wedhus gembel');
      normalisasi('Apa itu LEMPENG?');
    } finally {
      globalThis.fetch = asli;
    }

    assert.equal(terpanggil, false, 'chatbot memanggil jaringan — biayanya tidak nol');
  });
});
