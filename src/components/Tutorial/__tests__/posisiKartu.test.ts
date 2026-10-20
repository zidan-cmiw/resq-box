/**
 * Pengujian pemosisian kartu panduan Resqy.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * MENGAPA PENGUJIAN INI ADA
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   Keluhan yang dilaporkan:
 *
 *     "Mending bubble text-nya dikecilin. Soalnya itu TIDAK MENUNJUKKAN di mana
 *      letak level-nya, tapi malah MENUTUPI. Aku selaku pengguna jadi bingung
 *      sendiri."
 *
 *   Penyebabnya bukan ukuran huruf, melainkan perhitungan posisi: ketika kedua
 *   sisi target sempit, versi lama memakai tinggi hampir seluruh layar lalu
 *   menggeser kartu ke atas sampai MENEMBUS kotak target.
 *
 *   Pengujian ini mengunci dua janji:
 *     1. Kartu TIDAK BERTUMPUK dengan kotak target, pada ukuran layar mana pun
 *        (termasuk iPad portrait 768px dan iPad landscape 1024px).
 *     2. Kartu tidak keluar dari tepi layar.
 *
 *   Satu kasus sengaja dibuat ekstrem — target nyaris setinggi layar — karena
 *   di situlah versi lama gagal.
 */
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import {
  hitungPosisiKartu,
  kotakKartu,
  LEBAR_MAKS_KARTU,
  type KotakTarget,
  type Penempatan,
} from '../posisiKartu.ts';

/** Membuat kotak target dari posisi & ukuran. */
function target(top: number, left: number, width = 240, height = 44): KotakTarget {
  return {
    top,
    left,
    width,
    height,
    bottom: top + height,
    right: left + width,
  };
}

function bertumpuk(
  a: { top: number; bottom: number; left: number; right: number },
  b: { top: number; bottom: number; left: number; right: number },
  toleransi = 1,
): boolean {
  return (
    a.left < b.right - toleransi &&
    a.right > b.left + toleransi &&
    a.top < b.bottom - toleransi &&
    a.bottom > b.top + toleransi
  );
}

interface Kasus {
  nama: string;
  winW: number;
  winH: number;
  target: KotakTarget;
  penempatan: Penempatan;
  tinggiIsi: number;
}

const KASUS: Kasus[] = [
  {
    nama: 'iPad portrait 768x1024 — tombol level di kiri atas',
    winW: 768,
    winH: 1024,
    target: target(300, 20),
    penempatan: 'right',
    tinggiIsi: 300,
  },
  {
    nama: 'iPad landscape 1024x768 — tombol level di kiri atas',
    winW: 1024,
    winH: 768,
    target: target(300, 20),
    penempatan: 'right',
    tinggiIsi: 300,
  },
  {
    nama: 'laptop 1186x700 — ukuran pada tangkapan layar keluhan',
    winW: 1186,
    winH: 700,
    target: target(300, 20),
    penempatan: 'right',
    tinggiIsi: 300,
  },
  {
    nama: 'desktop 1440x900',
    winW: 1440,
    winH: 900,
    target: target(320, 40),
    penempatan: 'right',
    tinggiIsi: 320,
  },
  {
    nama: 'HP 390x844',
    winW: 390,
    winH: 844,
    target: target(200, 16, 180),
    penempatan: 'bottom',
    tinggiIsi: 280,
  },
  {
    nama: 'HP kecil 360x640',
    winW: 360,
    winH: 640,
    target: target(180, 12, 160),
    penempatan: 'bottom',
    tinggiIsi: 260,
  },
  {
    // Kasus ekstrem: target nyaris setinggi layar. Di sinilah versi lama
    // memakai tinggi seluruh layar lalu menembus target.
    nama: 'KASUS EKSTREM — target nyaris setinggi layar 700px',
    winW: 1186,
    winH: 700,
    target: target(10, 20, 240, 660),
    penempatan: 'right',
    tinggiIsi: 300,
  },
  {
    nama: 'KASUS EKSTREM — target menempel di tepi atas, layar pendek',
    winW: 768,
    winH: 640,
    target: target(0, 16, 200, 120),
    penempatan: 'top',
    tinggiIsi: 300,
  },
];

describe('posisi kartu panduan — tidak boleh menutupi target', () => {
  for (const k of KASUS) {
    test(k.nama, () => {
      const posisi = hitungPosisiKartu(k.winW, k.winH, k.target, k.penempatan);
      const kartu = kotakKartu(posisi, k.winW, k.winH, k.tinggiIsi);

      assert.ok(
        !bertumpuk(kartu, k.target),
        `KARTU MENUTUPI TARGET.\n` +
          `  target : ${JSON.stringify(k.target)}\n` +
          `  kartu  : ${JSON.stringify(kartu)}\n` +
          `  kelas  : ${posisi.containerClass}`,
      );
    });
  }
});

describe('posisi kartu panduan — tetap di dalam layar', () => {
  for (const k of KASUS) {
    test(k.nama, () => {
      const posisi = hitungPosisiKartu(k.winW, k.winH, k.target, k.penempatan);
      const kartu = kotakKartu(posisi, k.winW, k.winH, k.tinggiIsi);

      assert.ok(kartu.left >= -1, `kartu melewati tepi kiri: ${kartu.left}`);
      assert.ok(
        kartu.right <= k.winW + 1,
        `kartu melewati tepi kanan: ${kartu.right} > ${k.winW}`,
      );
      assert.ok(kartu.top >= -1, `kartu melewati tepi atas: ${kartu.top}`);
      assert.ok(
        kartu.bottom <= k.winH + 1,
        `kartu melewati tepi bawah: ${kartu.bottom} > ${k.winH}`,
      );
    });
  }
});

describe('posisi kartu panduan — pemilihan sisi', () => {
  test('layar lebar dengan ruang samping lega memakai penempatan menyamping', () => {
    const posisi = hitungPosisiKartu(1440, 900, target(320, 40), 'right');
    assert.equal(posisi.containerClass, 'fixed');
    assert.ok(typeof posisi.containerStyle.width === 'string');
    const lebar = parseFloat(String(posisi.containerStyle.width));
    assert.ok(
      lebar <= LEBAR_MAKS_KARTU,
      `lebar kartu ${lebar} melebihi batas ${LEBAR_MAKS_KARTU}`,
    );
    const left = parseFloat(String(posisi.containerStyle.left));
    assert.ok(left > 40 + 240, 'kartu menyamping harus berada di kanan target');
  });

  test('iPad portrait memakai penempatan vertikal, bukan dipaksa menyamping', () => {
    const posisi = hitungPosisiKartu(768, 1024, target(300, 20), 'right');
    assert.notEqual(posisi.containerClass, 'fixed');
    assert.ok(posisi.containerClass.includes('left-1/2'));
  });

  test('langkah tanpa target diletakkan di tengah layar', () => {
    const posisi = hitungPosisiKartu(1024, 768, null, undefined);
    assert.ok(posisi.containerClass.includes('top-1/2'));
    assert.ok(posisi.containerClass.includes('max-w-[420px]'));
  });
});

describe('posisi kartu panduan — lebar kartu tidak melebihi layar sempit', () => {
  test('HP 360px: lebar kartu tidak melebihi 92% layar', () => {
    const posisi = hitungPosisiKartu(360, 640, target(180, 12, 160), 'bottom');
    const kartu = kotakKartu(posisi, 360, 640, 260);
    assert.ok(
      kartu.right - kartu.left <= 360 * 0.92 + 1,
      `lebar kartu ${kartu.right - kartu.left} melebihi 92% dari 360px`,
    );
  });
});
