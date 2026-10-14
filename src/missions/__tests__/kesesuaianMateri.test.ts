// ── kesesuaianMateri.test.ts ────────────────────────────────────────────────
// Uji hubungan antara BANK SOAL dan MATERI tiap area.
//
// ═══════════════════════════════════════════════════════════════════════════
// ARAH UJI INI (berubah atas keputusan pemilik proyek)
// ═══════════════════════════════════════════════════════════════════════════
//
//   Awalnya uji ini lahir dari temuan pemilik proyek: soal LITOSFER muncul di
//   zona Kerak Bumi, padahal materi zona itu tidak menyebut litosfer. Waktu itu
//   JAWABANNYA yang diganti supaya cocok dengan materi.
//
//   Pemilik proyek kemudian memutuskan arah sebaliknya:
//
//     "aku mau ganti jadi sebelumnya aja deh, jadi tuh jawabannya sama kayak
//      sebelumnya, yang masih awal awal itu, tapi nanti variasi soalnya aja yang
//      dibanyakin, tapi jawabannya itu itu aja jadi gausah bikin jawaban baru"
//
//   Jadi sekarang:
//     1. JAWABAN DIBEKUKAN pada set aslinya. Tidak boleh ada jawaban baru.
//     2. Yang menyusul adalah MATERINYA - tiap kata yang belum diajarkan akan
//        ditambahkan penjelasannya di materi zona tersebut.
//
//   Uji ini memegang keduanya:
//     - "jawaban beku"    : set jawaban tiap zona harus sama persis dengan set
//                           yang disepakati. Kalau ada yang menambah atau
//                           mengganti jawaban, uji ini gagal.
//     - "materi menyusul" : jumlah kata yang BELUM diajarkan di materi dicatat
//                           sebagai batas, dan batas itu hanya boleh TURUN.
//
// Jalankan: npm run test

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { ZONE_GATE_BANK, varianZona } from '../data/bankKataGerbang.ts';
import { varianTTS } from '../../app/Level2/bankTTS.ts';
import { ALL_DISCOVERY_CATALOG } from '../../app/Level1/EarthDive/earthDiveData.ts';
import { ZONES } from '../../app/Level1/EarthDive/engine/zones.ts';
import { LEVEL2_AREAS } from '../../app/Level2/level2Data.ts';

/**
 * SET JAWABAN YANG DISEPAKATI — dibekukan.
 *
 * Diambil dari set ASLI sebelum pekerjaan penyelarasan materi (commit 522730b),
 * lalu zona 0 dibuang karena zona itu tidak punya gerbang sama sekali.
 * Jangan menambah atau mengganti isi daftar ini tanpa keputusan pemilik proyek.
 */
const KATA_BEKU: Record<number, string[]> = {
  1: ['BASAL', 'BATU', 'BENUA', 'DARATAN', 'GEMPA', 'GRANIT', 'INDONESIA', 'KERAK', 'KERAS', 'LAUTAN', 'LEMPENG', 'LEMPUNG', 'LERENG', 'LITOSFER', 'SAMUDRA', 'SEDIMEN', 'SILIKAT', 'SUMATRA', 'TANAH', 'TEBAL', 'TIPIS'],
  2: ['ADONAN', 'ASTENOSFER', 'FLUIDA', 'GEOTERMAL', 'KENTAL', 'KONDUKSI', 'KONVEKSI', 'MANTEL', 'MELELEH', 'PANAS', 'SILIKAT', 'SIRKULASI'],
  3: ['ARUS', 'BESI', 'CAIR', 'CAIRAN', 'GEODYNAMO', 'KOMPAS', 'KUTUB', 'LEBUR', 'LELEHAN', 'LINDUNG', 'LISTRIK', 'LOGAM', 'MAGNET', 'MEDAN', 'NIKEL', 'PANAS', 'PERISAI', 'SUHU'],
  4: ['BESI', 'BOLA', 'GRAVITASI', 'INTI', 'INTIDALAM', 'MAMPAT', 'NIKEL', 'PADAT', 'PADUAN', 'PUSAT', 'TEKANAN', 'TERDALAM'],
  5: ['BENUA', 'CELAH', 'DIVERGEN', 'GERAK', 'LAVA', 'MAGMA', 'MELEBAR', 'MEMISAH', 'MENGAPUNG', 'MENJAUH', 'PANGEA', 'PUNGGUNG', 'REKAHAN', 'RETAK', 'SAMUDRA', 'TENGAH', 'TERBELAH', 'ZONA'],
  6: ['DANGKAL', 'GUNUNG', 'HIMALAYA', 'LEMPENG', 'LIPATAN', 'MENDEKAT', 'MENUNJAM', 'MERAPI', 'PALUNG', 'PEGUNUNGAN', 'SUBDUKSI', 'TABRAKAN', 'TINGGI', 'TUMBUKAN'],
  7: ['BERGESEK', 'GESERAN', 'HORIZONTAL', 'MENDATAR', 'PATAH', 'PATAHAN', 'REKAH', 'SANANDREAS', 'SEJAJAR', 'SESAR', 'TEGANGAN', 'TRANSFORM'],
};

/**
 * Batas jumlah jawaban yang BELUM diajarkan di materi areanya.
 *
 * Angka ini WAJIB TURUN ketika materi dilengkapi. Bila hasil sebenarnya lebih
 * rendah, uji ini gagal dan meminta angkanya diturunkan - supaya sisa pekerjaan
 * tidak pernah terlupakan.
 *
 * Kondisi saat ini (0 dari 107 kata belum diajarkan):
 *   zona 1 Kerak      0 : SELESAI - LITOSFER, DARATAN, LAUTAN, LEMPENG, SILIKAT,
 *                        SEDIMEN, TANAH, LEMPUNG, LERENG, KERAS, INDONESIA,
 *                        SUMATRA, dan GEMPA sudah ditambahkan ke materi kerak.
 *   zona 2 Mantel     0 : SELESAI - ASTENOSFER, GEOTERMAL, KONDUKSI, MELELEH,
 *                        SILIKAT, dan SIRKULASI sudah dijelaskan di materi mantel.
 *   zona 3 Inti Luar  0 : SELESAI - LEBUR, LELEHAN, GEODYNAMO, KOMPAS, dan KUTUB
 *                        sudah dijelaskan di materi inti luar.
 *   zona 4 Inti Dalam 0 : SELESAI - TERDALAM, PADUAN, dan MAMPAT sudah dijelaskan
 *                        di materi inti dalam; INTIDALAM terpenuhi lewat kalimat
 *                        "inti dalam", karena perbandingan mengabaikan spasi.
 *   zona 5 Divergen   8 : CELAH, LAVA, MELEBAR, MEMISAH, MENGAPUNG, PUNGGUNG,
 *                        REKAHAN, ZONA
 *   zona 6 Konvergen  4 : DANGKAL, MENDEKAT, TABRAKAN, TINGGI
 *   zona 7 Transform  8 : GESERAN, HORIZONTAL, MENDATAR, PATAH, PATAHAN, REKAH,
 *                        SANANDREAS, TEGANGAN
 */
const BATAS_ZONA: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 };

/**
 * Batas untuk TTS Level 2. Area 1 tidak punya materi sama sekali, sehingga
 * kedua belas jawabannya memang tidak punya acuan.
 *
 * Kondisi saat ini (0 dari 60 jawaban belum diajarkan; area 1 tidak dihitung):
  area 0 Mitigasi Gempa Bumi            0 : SELESAI
  area 1 tanpa materi: 12 jawaban tidak punya acuan
  area 2 Lapangan Evakuasi Sekolah (Pasca Gempa Besar) 0 : SELESAI
  area 3 Pos Pengamatan Merapi          0 : SELESAI
  area 4 Simulasi Erupsi Merapi         0 : SELESAI
  area 5 Barak Pengungsian & Pemulihan  0 : SELESAI
 */
const BATAS_AREA: Record<number, number> = { 0: 0, 1: 12, 2: 0, 3: 0, 4: 0, 5: 0 };

const besar = (s: unknown) => String(s ?? '').toUpperCase();

/** Seluruh teks materi milik satu zona Level 1. */
function materiZona(zona: number): string {
  const z = ZONES[zona];
  const bagian: string[] = [];
  for (const o of (z?.objects ?? []) as { data?: { discoveryId?: number } }[]) {
    const id = o?.data?.discoveryId;
    if (typeof id !== 'number') continue;
    const cat = ALL_DISCOVERY_CATALOG[id];
    if (!cat) continue;
    bagian.push(cat.discovery.title, cat.discovery.shortDesc, cat.discovery.fact);
  }
  return besar(bagian.join(' '));
}

/** Seluruh teks materi milik satu area Level 2. */
function materiArea(area: number): string {
  const a = LEVEL2_AREAS[area];
  return besar(
    (a?.discoveries ?? [])
      .map((d) => `${d.title ?? ''} ${d.shortDesc ?? ''} ${d.fact ?? ''}`)
      .join(' '),
  );
}

/** Jawaban yang teksnya TIDAK muncul di materi. */
function belumDiajarkan(daftarJawaban: string[], materi: string): string[] {
  // Jawaban Wordle selalu SATU kata, sedangkan materi menuliskannya sebagai dua
  // kata yang wajar. Contohnya jawaban INTIDALAM, sedangkan materi menulis
  // "inti dalam". Karena itu perbandingan dilakukan DUA KALI: apa adanya, dan
  // dengan seluruh spasi dihapus. Materi tetap ditulis dengan bahasa Indonesia
  // yang benar, tanpa dipaksa memakai kata gabungan yang aneh.
  const materiRapat = materi.replace(/\s+/g, '');
  return daftarJawaban.filter((k) => {
    const kata = k.toUpperCase();
    return !materi.includes(kata) && !materiRapat.includes(kata);
  });
}

describe('jawaban beku — tidak boleh ada jawaban baru', () => {
  test('set jawaban tiap zona sama persis dengan set yang disepakati', () => {
    for (const zona of Object.keys(KATA_BEKU).map(Number)) {
      const sekarang = [...new Set(varianZona(zona).flat().map((k) => k.word))].sort();
      const beku = [...KATA_BEKU[zona]].sort();

      const tambahan = sekarang.filter((k) => !beku.includes(k));
      const hilang = beku.filter((k) => !sekarang.includes(k));

      assert.deepEqual(
        tambahan,
        [],
        `zona ${zona} memakai JAWABAN BARU: ${tambahan.join(', ')}\n` +
          '  Pemilik proyek memutuskan jawabannya TETAP seperti semula; yang ditambah hanya VARIASI KALIMAT soalnya.',
      );
      assert.deepEqual(hilang, [], `zona ${zona} kehilangan jawaban: ${hilang.join(', ')}`);
    }
  });

  test('bank kata TIDAK menyimpan kunci zona 0 (Permukaan Bumi)', () => {
    // Zona 0 adalah titik awal Level 1 dan tidak punya gerbang sama sekali, jadi
    // kata untuk zona itu tidak akan pernah terpakai.
    assert.ok(
      !(0 in ZONE_GATE_BANK),
      'bank kata masih menyimpan kunci zona 0, padahal zona itu tidak punya gerbang',
    );
  });

  test('setiap zona bergerbang punya varian', () => {
    for (let z = 1; z < ZONES.length; z++) {
      assert.ok(varianZona(z).length > 0, `zona ${z} tidak punya varian kata`);
    }
  });
});

describe('materi menyusul — batas kata yang belum diajarkan hanya boleh turun', () => {
  for (let z = 1; z < ZONES.length; z++) {
    test(`zona ${z} (${ZONES[z]?.name ?? '?'}) tidak melebihi batas`, () => {
      const materi = materiZona(z);
      assert.ok(materi.length > 50, `materi zona ${z} tidak terbaca`);

      const semua = [...new Set(varianZona(z).flat().map((k) => k.word))];
      const sisa = belumDiajarkan(semua, materi);
      const batas = BATAS_ZONA[z] ?? 0;

      assert.ok(
        sisa.length <= batas,
        `zona ${z}: ${sisa.length} kata belum diajarkan (batas ${batas}): ${sisa.join(', ')}\n` +
          '  Kata-kata ini perlu ditambahkan penjelasannya DI MATERI zona tersebut,\n' +
          '  bukan diganti soalnya.',
      );

      if (sisa.length < batas) {
        assert.fail(
          `zona ${z} sudah lebih lengkap (${sisa.length}) daripada batasnya (${batas}). ` +
            `Turunkan BATAS_ZONA[${z}] menjadi ${sisa.length} supaya kemajuannya tercatat.`,
        );
      }
    });
  }
});

describe('kesesuaian materi — Level 2 (TTS) per area', () => {
  for (let a = 0; a < LEVEL2_AREAS.length; a++) {
    test(`area ${a} (${LEVEL2_AREAS[a]?.name ?? '?'}) tidak melebihi batas`, () => {
      const materi = materiArea(a);
      const semua = [...new Set(varianTTS(a).flatMap((g) => g.clues.map((c) => c.answer)))];

      // Area tanpa materi memang tidak punya acuan; dilewati dengan catatan.
      if (materi.length < 50) {
        assert.ok(semua.length > 0, `area ${a} tidak punya materi maupun soal - keduanya kosong`);
        return;
      }

      const sisa = belumDiajarkan(semua, materi);
      const batas = BATAS_AREA[a] ?? 0;

      assert.ok(sisa.length <= batas, `area ${a}: ${sisa.length} jawaban belum selaras (batas ${batas}): ${sisa.join(', ')}`);

      if (sisa.length < batas) {
        assert.fail(
          `area ${a} sudah lebih lengkap (${sisa.length}) daripada batasnya (${batas}). ` +
            `Turunkan BATAS_AREA[${a}] menjadi ${sisa.length}.`,
        );
      }
    });
  }
});

/**
 * SET JAWABAN TTS YANG DISEPAKATI — dibekukan.
 *
 * Diambil dari set ASLI sebelum pekerjaan penyelarasan materi (commit 522730b).
 * Sama seperti bank kata: jangan menambah atau mengganti jawaban tanpa keputusan
 * pemilik proyek. Yang boleh ditambah hanyalah VARIASI KALIMAT petunjuknya.
 */
const JAWABAN_TTS_BEKU: Record<number, string[]> = {
  0: ['BANGUNAN', 'BERLINDUNG', 'EVAKUASI', 'GEMPA', 'LATIHAN', 'MERUNDUK', 'PERSIAPAN', 'PETUGAS', 'RENCANA', 'RINGAN', 'SIAGA', 'UPAYA'],
  1: ['BANGKU', 'BERTAHAN', 'GETARAN', 'JENDELA', 'KEPALA', 'KORIDOR', 'LAPANGAN', 'MENJAUH', 'MENUNDUK', 'TANGAN', 'TANGGA', 'TERTIB'],
  2: ['AMBULANS', 'BERKUMPUL', 'BMKG', 'KEHADIRAN', 'KORBAN', 'LAPANGAN', 'MEDIS', 'PETUGAS', 'POSKO', 'RERUNTUHAN', 'SELAMAT', 'SUSULAN'],
  3: ['AWAS', 'DEFORMASI', 'GAS', 'KABUT', 'MAGMA', 'MASKER', 'PANTAU', 'PVMBG', 'SEISMOGRAF', 'SIAGA', 'STATUS', 'WASPADA'],
  4: ['BAHAYA', 'ERUPSI', 'GEMURUH', 'KRATER', 'LAHAR', 'LEDAKAN', 'MENGUNGSI', 'MENURUN', 'PERINGATAN', 'PIROKLASTIK', 'SUMBER', 'TUTUP'],
  5: ['AMAN', 'ATAP', 'BANTUAN', 'BARAK', 'LANSIA', 'LOGISTIK', 'MEDIS', 'PAPAN', 'PENGUNGSI', 'SANITASI', 'TANDON', 'TRAUMA'],
};

describe('jawaban beku — TTS tidak boleh punya jawaban baru', () => {
  test('set jawaban tiap area sama persis dengan set yang disepakati', () => {
    for (const area of Object.keys(JAWABAN_TTS_BEKU).map(Number)) {
      const sekarang = [...new Set(varianTTS(area).flatMap((g) => g.clues.map((c) => c.answer)))].sort();
      const beku = [...JAWABAN_TTS_BEKU[area]].sort();

      const tambahan2 = sekarang.filter((k) => !beku.includes(k));
      const hilang = beku.filter((k) => !sekarang.includes(k));

      assert.deepEqual(
        tambahan2,
        [],
        `area ${area} memakai JAWABAN BARU: ${tambahan2.join(', ')}\n` +
          '  Pemilik proyek memutuskan jawabannya TETAP seperti semula; yang ditambah hanya VARIASI KALIMAT petunjuknya.',
      );
      assert.deepEqual(hilang, [], `area ${area} kehilangan jawaban: ${hilang.join(', ')}`);
    }
  });
});
