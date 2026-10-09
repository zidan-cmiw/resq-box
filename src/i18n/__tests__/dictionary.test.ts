// Verifikasi bahwa kunci yang dipakai benar-benar ada di kamus
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

const dict = await import('../id.ts');
const flat = new Set<string>();
function walk(obj, prefix) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'string') flat.add(key);
    else if (v && typeof v === 'object') walk(v, key);
  }
}
walk(dict.id, '');
const keys = [...flat].sort();

describe('kamus i18n', () => {
  test('memuat kunci yang cukup', () => {
    assert.ok(keys.length >= 100, `hanya ${keys.length} kunci`);
  });
  test('tidak ada nilai kosong', () => {
    const empty = keys.filter(k => {
      const parts = k.split('.');
      let cur = dict.id;
      for (const p of parts) cur = cur[p];
      return String(cur).trim() === '';
    });
    assert.deepEqual(empty, [], `kunci kosong: ${empty.join(', ')}`);
  });
  test('penanda {nama} seimbang', () => {
    for (const k of keys) {
      const parts = k.split('.');
      let cur = dict.id;
      for (const p of parts) cur = cur[p];
      const buka = (String(cur).match(/\{/g) ?? []).length;
      const tutup = (String(cur).match(/\}/g) ?? []).length;
      assert.equal(buka, tutup, `penanda tidak seimbang di ${k}`);
    }
  });
});
