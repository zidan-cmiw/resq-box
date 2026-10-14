// ── kesesuaianMateri.test.ts ─────────────────────────────────────────────────
// Uji bahwa setiap jawaban bank soal benar-benar berasal dari MATERI areanya.
//
// ═══════════════════════════════════════════════════════════════════════════
// MENGAPA UJI INI ADA
// ═══════════════════════════════════════════════════════════════════════════
//
//   Pemilik proyek menemukan soal LITOSFER di zona Kerak Bumi, padahal materi
//   zona itu tidak pernah menyebut litosfer. Audit lalu menunjukkan hal itu
//   terjadi di BANYAK zona: kata-kata yang ditambahkan untuk memperbanyak varian
//   tidak diambil dari materi areanya.
//
//   Uji ini membandingkan setiap jawaban dengan teks materi areanya. Karena
//   perbandingan teks itu kasar (materi dapat menjelaskan konsep dengan kata
//   lain), hasilnya dipakai sebagai BATAS: jumlah kata yang belum selaras per
//   zona tidak boleh MELEBIHI angka yang tercatat, dan angka itu wajib TURUN
//   ketika zona diselaraskan - sehingga pekerjaan yang tersisa selalu terlihat
//   di keluaran npm test dan tidak bisa diam-diam bertambah.
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
 * Batas jumlah jawaban yang belum selaras dengan materi areanya.
 *
 * Angka ini WAJIB TURUN ketika sebuah zona/area diselaraskan. Bila hasil
 * sebenarnya lebih rendah, uji ini gagal dan meminta angkanya diturunkan -
 * supaya sisa pekerjaan tidak pernah terlupakan.
 */
const BATAS_ZONA: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 };
const BATAS_AREA: Record<number, number> = { 0: 7, 1: 12, 2: 7, 3: 4, 4: 10, 5: 8 };

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
function belumSelaras(daftarJawaban: string[], materi: string): string[] {
  return daftarJawaban.filter((k) => !materi.includes(k.toUpperCase()));
}

describe('kesesuaian materi — tidak ada bank untuk zona tanpa gerbang', () => {
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

describe('kesesuaian materi — Level 1 (Wordle) per zona', () => {
  for (let z = 1; z < ZONES.length; z++) {
    test(`zona ${z} (${ZONES[z]?.name ?? '?'}) tidak melebihi batas kata belum selaras`, () => {
      const materi = materiZona(z);
      assert.ok(materi.length > 50, `materi zona ${z} tidak terbaca`);

      const semua = [...new Set(varianZona(z).flat().map((k) => k.word))];
      const sisa = belumSelaras(semua, materi);
      const batas = BATAS_ZONA[z] ?? 0;

      assert.ok(
        sisa.length <= batas,
        `zona ${z}: ${sisa.length} kata belum selaras (batas ${batas}): ${sisa.join(', ')}\n` +
          '  Kata-kata ini tidak ada di materi zona tersebut, jadi soalnya menanyakan hal yang tidak diajarkan di sana.',
      );

      if (sisa.length < batas) {
        assert.fail(
          `zona ${z} sudah lebih selaras (${sisa.length}) daripada batasnya (${batas}). ` +
            `Turunkan BATAS_ZONA[${z}] menjadi ${sisa.length} supaya kemajuannya tercatat.`,
        );
      }
    });
  }
});

describe('kesesuaian materi — Level 2 (TTS) per area', () => {
  for (let a = 0; a < LEVEL2_AREAS.length; a++) {
    test(`area ${a} (${LEVEL2_AREAS[a]?.name ?? '?'}) tidak melebihi batas jawaban belum selaras`, () => {
      const materi = materiArea(a);
      const semua = [...new Set(varianTTS(a).flatMap((g) => g.clues.map((c) => c.answer)))];

      // Area tanpa materi memang tidak punya acuan; dilewati dengan catatan.
      if (materi.length < 50) {
        assert.ok(
          semua.length > 0,
          `area ${a} tidak punya materi maupun soal - keduanya kosong`,
        );
        return;
      }

      const sisa = belumSelaras(semua, materi);
      const batas = BATAS_AREA[a] ?? 0;

      assert.ok(
        sisa.length <= batas,
        `area ${a}: ${sisa.length} jawaban belum selaras (batas ${batas}): ${sisa.join(', ')}`,
      );

      if (sisa.length < batas) {
        assert.fail(
          `area ${a} sudah lebih selaras (${sisa.length}) daripada batasnya (${batas}). ` +
            `Turunkan BATAS_AREA[${a}] menjadi ${sisa.length}.`,
        );
      }
    });
  }
});
