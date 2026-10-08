// ── redact.test.ts ────────────────────────────────────────────────────────
// Uji penyunting data pribadi.
//
// MENGAPA UJI INI PENTING
//   Kalau `redact()` gagal, nama atau email siswa bisa ikut terkirim ke
//   layanan monitoring pihak ketiga. Uji ini memastikan data pribadi benar-benar
//   hilang sebelum keluar dari peramban.
//
// Jalankan: npm run test

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { redact, sanitizeExtra } from '../redact.ts';

describe('redact — data yang harus hilang', () => {
  test('email disunting', () => {
    const hasil = redact('login gagal untuk zidan@resqbox.local');
    assert.ok(!hasil.includes('zidan@resqbox.local'), 'email masih terlihat');
    assert.ok(hasil.includes('[email]'));
  });

  test('email di dalam teks panjang tetap disunting', () => {
    const hasil = redact('Gagal: user budi.santoso+kelas8b@smpn1-yogya.sch.id tidak ditemukan');
    assert.ok(!hasil.includes('@'), `masih ada @ di: ${hasil}`);
  });

  test('UUID disunting (id siswa tidak boleh ikut)', () => {
    const id = '3f2504e0-4f89-11d3-9a0c-0305e82c3301';
    const hasil = redact(`profil ${id} tidak ditemukan`);
    assert.ok(!hasil.includes(id), 'UUID masih terlihat');
    assert.ok(hasil.includes('[uuid]'));
  });

  test('JWT disunting', () => {
    const jwt =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U';
    const hasil = redact(`Authorization: Bearer ${jwt}`);
    assert.ok(!hasil.includes(jwt), 'JWT masih terlihat');
    assert.ok(hasil.includes('[jwt]'));
  });

  test('nomor telepon disunting', () => {
    const hasil = redact('hubungi 08123456789 atau +6281234567890');
    assert.ok(!hasil.includes('08123456789'), 'nomor telepon masih terlihat');
    assert.ok(hasil.includes('[telepon]'));
  });

  test('password dalam pasangan kunci-nilai disunting', () => {
    const hasil = redact('password=rahasia123');
    assert.ok(!hasil.includes('rahasia123'), 'password masih terlihat');
  });

  test('token dalam JSON disunting', () => {
    const hasil = redact('{"access_token":"abc123def456","user":"budi"}');
    assert.ok(!hasil.includes('abc123def456'), 'token masih terlihat');
  });
});

describe('redact — tidak merusak pesan yang aman', () => {
  test('pesan error biasa dibiarkan apa adanya', () => {
    const pesan = 'Gagal memuat terrain-688.stl: HTTP 404';
    assert.equal(redact(pesan), pesan);
  });

  test('angka biasa tidak dianggap telepon', () => {
    const pesan = 'skor 100 poin, 6371 km, tekanan 3600000 atm';
    assert.equal(redact(pesan), pesan);
  });

  test('string kosong aman', () => {
    assert.equal(redact(''), '');
  });

  test('string tanpa data pribadi tidak berubah', () => {
    const pesan = 'Cannot read properties of undefined (reading map)';
    assert.equal(redact(pesan), pesan);
  });
});

describe('sanitizeExtra — metadata laporan', () => {
  test('kunci sensitif diganti penanda, nilainya tidak dikirim', () => {
    const hasil = sanitizeExtra({
      password: 'rahasia123',
      accessToken: 'abc',
      authorization: 'Bearer xyz',
      nama_siswa: 'Budi',
    });
    assert.equal(hasil.password, '[disunting]');
    assert.equal(hasil.accessToken, '[disunting]');
    assert.equal(hasil.authorization, '[disunting]');
    // Kunci yang tidak sensitif tetap ada, tapi isinya disunting
    assert.equal(hasil.nama_siswa, 'Budi');
  });

  test('email di dalam nilai disunting walau kuncinya aman', () => {
    const hasil = sanitizeExtra({ catatan: 'siswa zidan@resqbox.local gagal' });
    assert.ok(!String(hasil.catatan).includes('@'), 'email masih ada');
  });

  test('angka & boolean dibiarkan (untuk metrik)', () => {
    const hasil = sanitizeExtra({ durasiMs: 4200, gagal: true, kosong: null });
    assert.equal(hasil.durasiMs, 4200);
    assert.equal(hasil.gagal, true);
    assert.equal(hasil.kosong, null);
  });

  test('string panjang dipotong', () => {
    const panjang = 'x'.repeat(5000);
    const hasil = sanitizeExtra({ stack: panjang });
    assert.ok(String(hasil.stack).length <= 500, 'tidak dipotong');
  });

  test('undefined dibuang', () => {
    const hasil = sanitizeExtra({ ada: 'ya', tidakAda: undefined });
    assert.ok(!('tidakAda' in hasil));
  });

  test('objek bersarang diserialisasi & disunting', () => {
    const hasil = sanitizeExtra({ siswa: { email: 'a@b.com', kelas: '8A' } });
    const teks = String(hasil.siswa);
    assert.ok(!teks.includes('a@b.com'), 'email bersarang masih ada');
    assert.ok(teks.includes('8A'), 'data aman tetap ada');
  });

  test('objek tanpa properti aman', () => {
    assert.deepEqual(sanitizeExtra(), {});
    assert.deepEqual(sanitizeExtra(undefined), {});
  });

  test('objek melingkar tidak membuat crash', () => {
    const a: Record<string, unknown> = {};
    a.diri = a;
    const hasil = sanitizeExtra({ x: a });
    assert.equal(hasil.x, '[tidak dapat diserialisasi]');
  });
});
