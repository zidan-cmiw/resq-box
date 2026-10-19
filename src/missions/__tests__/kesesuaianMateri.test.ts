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
  // Sejak BANK SOAL RESQ-BOX Level 1 dipakai apa adanya (keputusan pemilik
  // proyek), daftar ini mengikuti isi bank soal: 5 kata per zona, kecuali
  // zona 7 (4 kata, karena soal ke-5 jawabannya kembar dengan soal ke-2).
  1: ['SIAL', 'SIMA', 'SUBDUKSI', 'LITOSFER'],
  2: ['MANTEL', 'GEOTERMAL', 'KONVEKSI', 'ASTENOSFER', '1000'],
  3: ['CAIRAN', 'MEDANMAGNET', '5000', 'GEODYNAMO'],
  4: ['PADAT', 'NOL', 'PWAVES', '1220', 'INTILUAR'],
  5: ['DIVERGEN', 'PANGEA', 'LEMBAH', 'ASIA'],
  6: ['KONVERGEN', 'PALUNG', 'OPAK', 'SAMUDRA', 'HIMALAYA'],
  7: ['SANANDREAS', 'TRANSFORM', 'HORIZONTAL', 'GEMPABUMI'],
};

const BATAS_ZONA: Record<number, number> = { 1: 2, 2: 0, 3: 0, 4: 2, 5: 1, 6: 1, 7: 0 };


const BATAS_AREA: Record<number, number> = { 0: 5, 1: 0, 2: 7, 3: 3, 4: 0, 5: 7 };

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
  // Normalisasi: buang titik, koma, spasi, dan tanda hubung dari KEDUA sisi.
  // Tanpa ini, jawaban "5000" dianggap tidak diajarkan hanya karena materi
  // menulisnya "5.000", dan "PWAVES" karena materi menulis "P-Waves" - sebuah
  // positif palsu yang membuat batas sisa pekerjaan terlihat lebih besar
  // daripada kenyataan.
  const rapat = (s: string) => s.toUpperCase().replace(/[.,\s-]/g, '');
  const materiRapat = rapat(materi);
  return daftarJawaban.filter((k) => {
    const kata = rapat(k);
    return !materi.includes(k.toUpperCase()) && !materiRapat.includes(kata);
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
  // Mengikuti BANK SOAL RESQ-BOX (keputusan pemilik proyek). Hanya 4 area yang
  // punya TTS: Kelas (0), Lapangan (2), Pos Pemantauan (3), Posko (5).
  // Area 1 dan 4 adalah area SIMULASI, jadi tidak muncul di sini.
  0: ['BERLINDUNG', 'BERTAHAN', 'BNPB', 'DOKUMEN', 'EVAKUASI', 'JENDELA', 'KEPALA', 'KURSI', 'LAPANGAN', 'MENGHINDAR', 'MERUNDUK', 'PANIK', 'PERBAN', 'SIMULASI', 'TANGGA', 'TASSIAGABENCANA', 'TENANG', 'TERTIB', 'TITIKUMPUL'],
  2: ['AFTERSHOCK', 'AMBULANS', 'BERKUMPUL', 'BPBD', 'EVAKUASI', 'HOAX', 'KEHADIRAN', 'KORBAN', 'KORSELETING', 'MENINGGAL', 'MERAH', 'PENCEGAHAN', 'PMR', 'POSKO', 'RERUNTUHAN', 'SEKOLAH', 'TANDU', 'WASPADA'],
  3: ['AWANPANAS', 'AWAS', 'DEFORMASI', 'EMPAT', 'ERUPSI', 'GOGGLE', 'KRB', 'LAVA', 'LETUSAN', 'MAGMA', 'MASKER', 'NORMAL', 'PVMBG', 'SEISMOGRAF', 'SIAGA', 'SOLFATARA', 'VULKANIK', 'WASPADA'],
  5: ['ATAP', 'AWANPANAS', 'BARAK', 'BELERANG', 'CUCITANGAN', 'EFUSIF', 'EKSPLOSIF', 'KRATER', 'LAHAR', 'LANSIA', 'LOGISTIK', 'PENGUNGSI', 'REHABILITASI', 'REKONSTRUKSI', 'SANITASI', 'SILIKA', 'TANDON', 'TRAUMA'],
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
