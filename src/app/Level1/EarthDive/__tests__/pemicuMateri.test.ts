// ── pemicuMateri.test.ts ────────────────────────────────────────────────────
// Penjaga: setiap materi yang DIPANGGIL dialog harus benar-benar ada di katalog.
//
// ═══════════════════════════════════════════════════════════════════════════
// MENGAPA UJI INI ADA
// ═══════════════════════════════════════════════════════════════════════════
//
//   Pemilik proyek melihat materi PANGEA terbuka saat ia berada di zona MANTEL.
//
//   Penyebabnya: node dialog Lintang (zona Mantel) memanggil
//   `triggerDiscoveryModal: 5`, padahal entri katalog nomor 5 sudah dihapus.
//   Karena getDiscoveryItem() JATUH KE CADANGAN - ia memakai
//   EARTH_STRATA_DATA[5] - yang terbuka bukan "tidak ada apa-apa", melainkan
//   materi zona Batas Divergen (Pangea). Diam-diam, tanpa pesan kesalahan.
//
//   Jadi bug-nya bukan salah tulis satu baris saja: SELURUH pemicu materi bisa
//   menunjuk entri yang sudah hilang dan pemain akan melihat materi zona LAIN
//   tanpa ada yang tahu. Uji ini memeriksa setiap pemicu terhadap katalog.
//
// Jalankan: npm run test

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { ALL_DISCOVERY_CATALOG, EARTH_STRATA_DATA, getDiscoveryItem } from '../earthDiveData.ts';
import { ZONES } from '../engine/zones.ts';

const AKAR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const berkasDialogMentah = readFileSync(resolve(AKAR, 'dialogueData.ts'), 'utf8');

/**
 * Isi berkas dialog TANPA komentar.
 *
 * Penting: komentar di berkas ini banyak yang MENYEBUT pola
 * `triggerDiscoveryModal: <angka>` saat menjelaskan bug lama. Kalau komentarnya
 * tidak dibuang, uji ini akan menganggap penjelasan itu sebagai pemicu sungguhan
 * dan gagal selamanya.
 */
const berkasDialog = berkasDialogMentah
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\/\/[^\n]*/g, '');

/** Seluruh id katalog yang masih ada. */
const idKatalog = new Set(Object.keys(ALL_DISCOVERY_CATALOG).map(Number));

describe('pemicu materi — setiap id yang dipanggil dialog harus ada di katalog', () => {
  test('tidak ada triggerDiscoveryModal yang menunjuk entri katalog hilang', () => {
    const dipanggil = [...berkasDialog.matchAll(/triggerDiscoveryModal:\s*(\d+)/g)].map((m) => Number(m[1]));
    assert.ok(dipanggil.length > 0, 'tidak ada satu pun pemicu materi yang terbaca - polanya berubah?');

    const hilang = [...new Set(dipanggil)].filter((id) => !idKatalog.has(id)).sort((a, b) => a - b);

    assert.deepEqual(
      hilang,
      [],
      `dialog memanggil materi yang TIDAK ADA di katalog: ${hilang.join(', ')}\n` +
        '  Karena getDiscoveryItem jatuh ke cadangan, pemain akan melihat materi ZONA LAIN\n' +
        '  tanpa pesan kesalahan. Perbaiki idnya, atau hapus pemicunya.',
    );
  });

  test('setiap zona hanya memakai materi yang benar-benar ada di katalog', () => {
    // Zona Mantel pernah menampilkan materi zona Batas Divergen. Uji ini mengunci
    // hubungan zona -> materi lewat objek ber-discoveryId.
    //
    // CATATAN: kunci katalog TIDAK sejajar dengan indeks EARTH_STRATA_DATA
    // (mis. katalog 4 memakai strata indeks 1), jadi keduanya memang boleh
    // berbeda. Yang diperiksa di sini hanya: idnya harus ADA di katalog.
    const bocor: string[] = [];

    ZONES.forEach((zona, indeks) => {
      for (const o of (zona.objects ?? []) as { id?: string; data?: { discoveryId?: number } }[]) {
        const id = o?.data?.discoveryId;
        if (typeof id !== 'number') continue;
        if (!idKatalog.has(id)) {
          bocor.push(
            `zona ${indeks} (${zona.name}): objek ${o.id} memakai katalog ${id} yang tidak ada - ` +
              'pemain akan melihat materi zona lain dari cadangan',
          );
        }
      }
    });

    assert.deepEqual(bocor, [], bocor.join('\n'));
  });

  test('getDiscoveryItem untuk id yang hilang tetap tidak menampilkan zona lain secara diam-diam', () => {
    // Ini mencatat PERILAKU CADANGANNYA, bukan memujinya: fungsi ini memang
    // mengembalikan sesuatu walau idnya tidak ada. Karena itu pemicu materi
    // WAJIB diperiksa di berkas dialog (uji di atas), bukan diserahkan ke sini.
    const hasil = getDiscoveryItem(5);
    assert.ok(hasil?.discovery, 'getDiscoveryItem seharusnya selalu mengembalikan materi');
    assert.equal(
      hasil.discovery.title,
      EARTH_STRATA_DATA[5]?.discovery?.title,
      'perilaku cadangan getDiscoveryItem berubah - periksa ulang seluruh pemicu materi',
    );
  });
});
