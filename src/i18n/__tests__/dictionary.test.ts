// ── dictionary.test.ts ────────────────────────────────────────────────────
// Uji integritas kamus i18n.
//
// MENGAPA UJI INI PENTING
//   Kamus terjemahan mudah rusak saat ditambah: kunci kosong, atau penanda
//   variabel yang tidak ditutup (mis. "Halo {nama") akan tampil MENTAH di
//   layar siswa. Uji ini menangkap keduanya sebelum sampai ke produksi.
//
// Jalankan: npm run test

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { id } from '../id.ts';

type DictNode = { readonly [key: string]: string | DictNode };

/** Kumpulkan seluruh kunci bertitik beserta nilainya. */
function flatten(node: DictNode, prefix = ''): Map<string, string> {
  const out = new Map<string, string>();
  for (const [key, value] of Object.entries(node)) {
    const full = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') {
      out.set(full, value);
    } else {
      for (const [k, v] of flatten(value, full)) out.set(k, v);
    }
  }
  return out;
}

const entries = flatten(id as unknown as DictNode);
const keys = [...entries.keys()].sort();

describe('kamus i18n', () => {
  test('memuat kunci yang cukup', () => {
    assert.ok(
      keys.length >= 100,
      `hanya ${keys.length} kunci — kamus tampaknya belum lengkap`
    );
  });

  test('setiap kunci punya kelompok (ada titik)', () => {
    const tanpaKelompok = keys.filter((k) => !k.includes('.'));
    assert.deepEqual(
      tanpaKelompok,
      [],
      `kunci tanpa kelompok: ${tanpaKelompok.join(', ')}`
    );
  });

  test('tidak ada nilai kosong atau hanya spasi', () => {
    const kosong = keys.filter((k) => (entries.get(k) ?? '').trim() === '');
    assert.deepEqual(kosong, [], `nilai kosong: ${kosong.join(', ')}`);
  });

  test('penanda {nama} seimbang buka-tutup', () => {
    const rusak: string[] = [];
    for (const [key, value] of entries) {
      const buka = (value.match(/\{/g) ?? []).length;
      const tutup = (value.match(/\}/g) ?? []).length;
      if (buka !== tutup) rusak.push(`${key} (${buka} buka, ${tutup} tutup)`);
    }
    assert.deepEqual(rusak, [], `penanda tidak seimbang: ${rusak.join('; ')}`);
  });

  test('teks tidak memuat emoji bawaan sistem operasi', () => {
    // Proyek ini memakai standar "Zero OS Emoji"; simbol teks monokrom
    // (bintang, centang, panah) tetap diizinkan.
    const emojiRe = /[\u{1F000}-\u{1FAFF}\u{FE0F}\u{20E3}]/u;
    const ada = [...entries.entries()]
      .filter(([, v]) => emojiRe.test(v))
      .map(([k]) => k);
    assert.deepEqual(ada, [], `teks memuat emoji OS: ${ada.join(', ')}`);
  });
});
