// ── variasiRedaksi.test.ts ───────────────────────────────────────────────────
// Uji MUTU variasi redaksi soal untuk KEDUA bank: kata gerbang Level 1 (Wordle)
// dan petunjuk TTS Level 2.
//
// ═══════════════════════════════════════════════════════════════════════════
// MENGAPA UJI INI ADA
// ═══════════════════════════════════════════════════════════════════════════
//
//   Permintaan pemilik proyek: soal tetap berdasarkan materi tiap area dan
//   jawabannya tetap sama, tetapi KATA-KATA soalnya divariasikan per siswa -
//   supaya menyalin jawaban dari teman tidak lagi berguna.
//
//   Saat menulis variasi itu, 31 pasangan kalimat ternyata TERLALU MIRIP dengan
//   kalimat aslinya: hanya beda satu-dua kata. Secara aturan tidak ada yang
//   bocor, sehingga pemeriksa kebocoran saja tidak menangkapnya - tetapi maksud
//   pemilik proyek tidak tercapai, karena kalimatnya praktis sama.
//
//   Karena itu uji ini memeriksa KEMIRIPAN, bukan hanya kebocoran. Ukurannya
//   kemiripan Jaccard atas kata-kata yang panjangnya lebih dari dua huruf.
//
// Jalankan: npm run test

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { ZONE_GATE_BANK, varianZona, petunjukUntuk, type KataGerbang } from '../data/bankKataGerbang.ts';
import { varianTTS, petunjukTTSUntuk, type ClueTTS } from '../../app/Level2/bankTTS.ts';

/** Batas kemiripan yang dianggap masih wajar antara dua redaksi. */
const BATAS_MIRIP = 0.75;

function kataBermakna(teks: string): Set<string> {
  return new Set(
    teks
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((k) => k.length > 2),
  );
}

/** Kemiripan Jaccard: 1 = identik, 0 = tidak beririsan sama sekali. */
function kemiripan(a: string, b: string): number {
  const A = kataBermakna(a);
  const B = kataBermakna(b);
  let sama = 0;
  for (const k of A) if (B.has(k)) sama++;
  const gabungan = A.size + B.size - sama;
  return gabungan === 0 ? 1 : sama / gabungan;
}

interface Entri {
  asal: string;
  jawaban: string;
  kalimat: string[];
}

/** Seluruh entri dari kedua bank, diseragamkan bentuknya. */
function semuaEntri(): Entri[] {
  const hasil: Entri[] = [];

  for (const zona of Object.keys(ZONE_GATE_BANK).map(Number)) {
    for (const varian of varianZona(zona)) {
      for (const k of varian as KataGerbang[]) {
        hasil.push({
          asal: `Wordle zona ${zona}`,
          jawaban: k.word,
          kalimat: [k.hint, ...(k.hintLain ?? [])],
        });
      }
    }
  }

  for (const area of [0, 1, 2, 3, 4, 5]) {
    for (const grid of varianTTS(area)) {
      for (const c of grid.clues as ClueTTS[]) {
        hasil.push({
          asal: `TTS area ${area}`,
          jawaban: c.answer,
          kalimat: [c.clue, ...(c.clueLain ?? [])],
        });
      }
    }
  }

  return hasil;
}

describe('variasi redaksi — kalimat alternatif benar-benar BERBEDA', () => {
  const entri = semuaEntri();

  test('kedua bank terbaca', () => {
    // Sejak BANK SOAL RESQ-BOX Level 1 dipakai apa adanya, bank kata gerbang
    // berisi 34 kata dengan SATU redaksi resmi per kata (tanpa hintLain).
    // Bank TTS Level 2 tetap memakai redaksi alternatif.
    assert.ok(entri.length >= 100, `hanya ${entri.length} entri terbaca - polanya mungkin berubah`);
  });

  test('tidak ada pasangan kalimat yang terlalu mirip', () => {
    const terlaluMirip: string[] = [];

    for (const e of entri) {
      for (let i = 0; i < e.kalimat.length; i++) {
        for (let j = i + 1; j < e.kalimat.length; j++) {
          const m = kemiripan(e.kalimat[i], e.kalimat[j]);
          if (m >= BATAS_MIRIP) {
            terlaluMirip.push(
              `${e.asal} "${e.jawaban}" (kemiripan ${m.toFixed(2)}):\n      ${e.kalimat[j]}`,
            );
          }
        }
      }
    }

    assert.deepEqual(
      terlaluMirip,
      [],
      `kalimat alternatif yang terlalu mirip dengan kalimat aslinya - maksud "kata-kata diubah" tidak tercapai:\n  ${terlaluMirip.join('\n  ')}`,
    );
  });

  test('SETIAP kalimat tetap tidak memuat kata jawabannya sendiri', () => {
    const bocor: string[] = [];
    for (const e of entri) {
      for (const kalimat of e.kalimat) {
        // Dicocokkan sebagai KATA UTUH, bukan potongan huruf. Tanpa batas kata,
        // jawaban "ASIA" akan dianggap bocor hanya karena kalimatnya memuat
        // "Laurasia" — padahal itu nama daratan purba, bukan jawabannya.
        const pola = new RegExp(`(^|[^A-Z0-9])${e.jawaban.toUpperCase()}([^A-Z0-9]|$)`);
        if (pola.test(kalimat.toUpperCase())) {
          bocor.push(`${e.asal} "${e.jawaban}": ${kalimat.slice(0, 50)}...`);
        }
      }
    }
    assert.deepEqual(bocor, [], `kalimat yang membocorkan jawabannya:\n  ${bocor.join('\n  ')}`);
  });

  test('SETIAP kalimat cukup panjang untuk menuntun', () => {
    for (const e of entri) {
      for (const kalimat of e.kalimat) {
        assert.ok(
          kalimat.trim().length >= 25,
          `kalimat terlalu pendek untuk "${e.jawaban}": "${kalimat}"`,
        );
      }
    }
  });
});

describe('variasi redaksi — diundi per siswa, jawaban tidak berubah', () => {
  test('Wordle: kalimat yang dipilih selalu milik kata itu, TETAP bagi siswa yang sama', () => {
    for (const zona of Object.keys(ZONE_GATE_BANK).map(Number)) {
      for (const varian of varianZona(zona)) {
        for (const k of varian as KataGerbang[]) {
          const semua = [k.hint, ...(k.hintLain ?? [])];
          const a = petunjukUntuk(k, zona, 0, 'siswa-tetap');
          const b = petunjukUntuk(k, zona, 0, 'siswa-tetap');
          assert.equal(a, b, `Wordle "${k.word}": kalimat berubah untuk siswa yang sama`);
          assert.ok(semua.includes(a), `Wordle "${k.word}": kalimat di luar daftar miliknya`);
        }
      }
    }
  });

  test('TTS: kalimat yang dipilih selalu milik kata itu, TETAP bagi siswa yang sama', () => {
    for (const area of [0, 1, 2, 3, 4, 5]) {
      for (const grid of varianTTS(area)) {
        for (const c of grid.clues as ClueTTS[]) {
          const semua = [c.clue, ...(c.clueLain ?? [])];
          const a = petunjukTTSUntuk(c, area, 'siswa-tetap');
          const b = petunjukTTSUntuk(c, area, 'siswa-tetap');
          assert.equal(a, b, `TTS "${c.answer}": kalimat berubah untuk siswa yang sama`);
          assert.ok(semua.includes(a), `TTS "${c.answer}": kalimat di luar daftar miliknya`);
        }
      }
    }
  });

  test('Wordle: bank soal resmi memakai SATU redaksi per kata (tanpa hintLain)', () => {
    // Bank soal Level 1 dipakai apa adanya, sehingga tiap kata hanya punya satu
    // kalimat. Uji ini menjaga agar tidak ada yang diam-diam menambahkan redaksi
    // alternatif yang tidak pernah disetujui.
    const berlebih: string[] = [];
    for (const zona of Object.keys(ZONE_GATE_BANK).map(Number)) {
      for (const varian of varianZona(zona)) {
        for (const k of varian as KataGerbang[]) {
          if (k.hintLain && k.hintLain.length > 0) {
            berlebih.push(`zona ${zona} "${k.word}"`);
          }
        }
      }
    }
    assert.deepEqual(berlebih, [], `kata yang punya redaksi alternatif tak terduga:\n  ${berlebih.join('\n  ')}`);
  });

  test('TTS: ada petunjuk yang redaksinya benar-benar berbeda antar-siswa', () => {
    const beda = new Set<string>();
    for (const grid of varianTTS(3)) {
      for (const c of grid.clues as ClueTTS[]) {
        for (let i = 0; i < 30; i++) beda.add(petunjukTTSUntuk(c, 3, `siswa-${i}`));
      }
    }
    assert.ok(beda.size > 1, 'tidak ada satu pun petunjuk TTS yang redaksinya berbeda antar-siswa');
  });
});
