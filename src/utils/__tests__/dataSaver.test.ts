// ── dataSaver.test.ts ─────────────────────────────────────────────────────
// Uji pemilihan mode hemat data.
//
// MENGAPA UJI INI PENTING
//   Mode hemat data menentukan apakah scene 3D (~966 KB) dimuat atau tidak.
//   Kalau logikanya salah, siswa di koneksi 2G tetap dipaksa mengunduh aset
//   berat — atau sebaliknya, siswa di WiFi kencang kehilangan tampilan 3D.
//
// Jalankan: npm run test

import { test, describe, beforeEach, afterEach, mock } from 'node:test';
import assert from 'node:assert/strict';

// ── Tiruan lingkungan peramban sebelum modul dimuat ───────────────────────
interface FakeConnection {
  saveData?: boolean;
  effectiveType?: string;
  addEventListener?: (type: string, cb: () => void) => void;
}

let fakeConnection: FakeConnection = {};
const storage = new Map<string, string>();

const fakeWindow = {
  addEventListener: () => {},
  removeEventListener: () => {},
};

const fakeNavigator = {
  get connection() {
    return fakeConnection;
  },
  userAgent: 'node-test',
  language: 'id-ID',
  onLine: true,
};

// Node 24 mengekspos `navigator` sebagai properti getter-only, jadi penugasan
// langsung gagal. defineProperty dipakai agar tiruan ini bisa dipasang.
function defineGlobal(name: string, value: unknown): void {
  Object.defineProperty(globalThis, name, {
    value,
    writable: true,
    configurable: true,
    enumerable: true,
  });
}

defineGlobal('window', fakeWindow);
defineGlobal('navigator', fakeNavigator);
defineGlobal('localStorage', {
  getItem: (k: string) => storage.get(k) ?? null,
  setItem: (k: string, v: string) => void storage.set(k, v),
  removeItem: (k: string) => void storage.delete(k),
});

// Impor SETELAH tiruan terpasang.
const { setDataSaverMode, isDataSaverActive, describeReason } = await import('../dataSaver.ts');

beforeEach(() => {
  storage.clear();
  fakeConnection = {};
  setDataSaverMode('auto');
  storage.clear();
});

afterEach(() => {
  mock.restoreAll();
});

describe('mode manual', () => {
  test('NYALAKAN selalu mengaktifkan, walau jaringan kencang', () => {
    fakeConnection = { effectiveType: '4g', saveData: false };
    setDataSaverMode('on');
    assert.equal(isDataSaverActive(), true);
  });

  test('MATIKAN selalu mematikan, walau jaringan 2G', () => {
    fakeConnection = { effectiveType: '2g', saveData: false };
    setDataSaverMode('off');
    assert.equal(isDataSaverActive(), false);
  });

  test('pilihan pengguna disimpan di localStorage', () => {
    setDataSaverMode('on');
    assert.equal(storage.get('resqbox-data-saver'), 'on');
    setDataSaverMode('off');
    assert.equal(storage.get('resqbox-data-saver'), 'off');
  });
});

describe('mode otomatis mengikuti kondisi jaringan', () => {
  test('saveData dari peramban → aktif', () => {
    fakeConnection = { saveData: true, effectiveType: '4g' };
    setDataSaverMode('auto');
    assert.equal(isDataSaverActive(), true);
  });

  test('jaringan 2G → aktif', () => {
    fakeConnection = { saveData: false, effectiveType: '2g' };
    setDataSaverMode('auto');
    assert.equal(isDataSaverActive(), true);
  });

  test('jaringan 3G → aktif', () => {
    fakeConnection = { saveData: false, effectiveType: '3g' };
    setDataSaverMode('auto');
    assert.equal(isDataSaverActive(), true);
  });

  test('jaringan slow-2g → aktif', () => {
    fakeConnection = { saveData: false, effectiveType: 'slow-2g' };
    setDataSaverMode('auto');
    assert.equal(isDataSaverActive(), true);
  });

  test('jaringan 4G tanpa saveData → tidak aktif', () => {
    fakeConnection = { saveData: false, effectiveType: '4g' };
    setDataSaverMode('auto');
    assert.equal(isDataSaverActive(), false);
  });

  test('peramban tanpa Network Information API → tidak aktif (aman)', () => {
    fakeConnection = {};
    setDataSaverMode('auto');
    assert.equal(isDataSaverActive(), false);
  });
});

describe('penjelasan untuk pengguna', () => {
  test('setiap alasan punya penjelasan yang bisa dibaca', () => {
    for (const reason of [
      'manual-on',
      'manual-off',
      'auto-metered',
      'auto-slow',
      'off',
    ] as const) {
      const teks = describeReason(reason);
      assert.ok(teks.length > 10, `penjelasan "${reason}" terlalu pendek`);
      assert.ok(!teks.includes('undefined'), `penjelasan "${reason}" bocor`);
    }
  });
});
