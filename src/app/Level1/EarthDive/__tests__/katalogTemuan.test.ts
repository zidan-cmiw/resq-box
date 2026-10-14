// ── katalogTemuan.test.ts ────────────────────────────────────────────────────
// Uji hubungan antara TEMUAN yang dipasang di zona dan KATALOG temuan.
//
// ═══════════════════════════════════════════════════════════════════════════
// MENGAPA UJI INI ADA — KEJADIAN NYATA, BUKAN KEKHAWATIRAN TEORITIS
// ═══════════════════════════════════════════════════════════════════════════
//
//   Entri katalog nomor 5 ("Batuan Mantel & Tekanan Dahsyat") pernah DIHAPUS
//   karena dosen IPA menegaskan tidak ada batuan padat di mantel. Tetapi NPC
//   Lintang di zona mantel masih memakai `discoveryId: 5`.
//
//   Fungsi pengambilnya (`getDiscoveryItem`) memakai katalog lebih dahulu, lalu
//   JATUH KE CADANGAN bila kuncinya tidak ada:
//
//       ALL_DISCOVERY_CATALOG[numId]  ->  kalau tidak ada ->
//       EARTH_STRATA_DATA[min(numId, ...)]  ->  materi ZONA LAIN
//
//   Akibatnya, materi yang tampil di zona MANTEL adalah materi zona BATAS
//   DIVERGEN (Pangea). Materi yang salah tempat, di zona yang salah, dan
//   TIDAK ADA ERROR APA PUN yang muncul.
//
//   Uji ini menutup celah itu: setiap id temuan yang dipasang di zona WAJIB
//   punya entri katalog. Dengan begitu, penghapusan entri katalog berikutnya
//   akan LANGSUNG GAGAL di sini, bukan diam-diam menampilkan materi zona lain.
//
// Jalankan: npm run test

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { ZONES } from '../engine/zones.ts';
import { ALL_DISCOVERY_CATALOG, EARTH_STRATA_DATA, getDiscoveryItem } from '../earthDiveData.ts';

/** Bentuk data objek yang kita perlukan, tanpa bergantung pada tipe internalnya. */
interface DataTemuan {
  discoveryId?: number;
  isDiscoveryNpc?: boolean;
  hasMaterial?: boolean;
}

function dataDari(obj: unknown): DataTemuan {
  return ((obj as { data?: DataTemuan }).data ?? {}) as DataTemuan;
}

/** Seluruh id temuan yang DIPASANG di zona, beserta zona pemasangnya. */
function temuanTerpasang(): { id: number; zona: number; namaZona: string }[] {
  const hasil: { id: number; zona: number; namaZona: string }[] = [];

  ZONES.forEach((zone, idx) => {
    for (const obj of zone.objects) {
      const data = dataDari(obj);
      const idLangsung = (obj as unknown as { discovery?: number }).discovery;
      const id = typeof data.discoveryId === 'number' ? data.discoveryId : idLangsung;
      if (typeof id === 'number') {
        hasil.push({ id, zona: idx, namaZona: zone.id });
      }
    }
  });

  return hasil;
}

describe('hubungan temuan dengan katalog', () => {
  test('ada temuan yang terpasang di zona (prasyarat uji lainnya)', () => {
    assert.ok(temuanTerpasang().length > 0, 'tidak ada temuan terpasang — uji ini jadi tidak berarti');
  });

  test('SETIAP id temuan yang dipasang di zona WAJIB ada di katalog', () => {
    // Inilah penjaga utama berkas ini. Kegagalan di sini berarti ada temuan
    // yang akan menampilkan MATERI ZONA LAIN tanpa error apa pun.
    const hilang = temuanTerpasang()
      .filter((t) => !(t.id in ALL_DISCOVERY_CATALOG))
      .map((t) => `zona ${t.zona} (${t.namaZona}) memakai id ${t.id}`);

    assert.deepEqual(
      hilang,
      [],
      `id temuan tanpa entri katalog — materi zona lain akan tampil:\n  ${hilang.join('\n  ')}`,
    );
  });

  test('jebakan cadangan itu NYATA — dibuktikan, bukan dikhawatirkan', () => {
    // Menunjukkan bahwa id yang tidak ada di katalog memang menghasilkan materi
    // zona lain. Kalau perilaku ini suatu saat diperbaiki (mis. mengembalikan
    // null), uji ini akan gagal dan penjaganya bisa dilonggarkan.
    const idTidakAda = 999;
    const hasil = getDiscoveryItem(idTidakAda);
    const zonaTerakhir = EARTH_STRATA_DATA[EARTH_STRATA_DATA.length - 1];

    assert.equal(
      hasil.discovery.id,
      zonaTerakhir.discovery.id,
      'perilaku cadangan berubah — periksa apakah penjaga di atas masih diperlukan',
    );
  });

  test('setiap id temuan yang terpasang benar-benar menghasilkan temuan yang ada', () => {
    for (const t of temuanTerpasang()) {
      const hasil = getDiscoveryItem(t.id);
      assert.ok(hasil.discovery, `id ${t.id} tidak menghasilkan temuan`);
      assert.ok(hasil.discovery.id, `id ${t.id} menghasilkan temuan tanpa id`);
      assert.ok(
        hasil.discovery.title.trim() !== '',
        `temuan id ${t.id} tidak punya judul`,
      );
    }
  });
});

describe('area mantel — hanya SATU materi', () => {
  const idxMantel = ZONES.findIndex((z) => z.id === 'mantle');

  test('zona mantel ditemukan', () => {
    assert.ok(idxMantel >= 0, 'zona dengan id "mantle" tidak ditemukan di ZONES');
  });

  test('tepat satu objek materi di zona mantel', () => {
    // Permintaan pemilik proyek: materi di area mantel cukup SATU.
    const materi = ZONES[idxMantel].objects.filter((o) => {
      const data = dataDari(o);
      return o.type === 'discovery' || data.isDiscoveryNpc === true;
    });
    assert.equal(
      materi.length,
      1,
      `zona mantel punya ${materi.length} materi — seharusnya tepat 1`,
    );
  });

  test('materi zona mantel BUKAN materi zona divergen', () => {
    // Kejadian nyata: materi yang tampil di zona mantel pernah justru materi
    // zona Batas Divergen, karena id 5 dihapus dari katalog.
    const objekMateri = ZONES[idxMantel].objects.find(
      (o) => dataDari(o).isDiscoveryNpc === true || o.type === 'discovery',
    );
    assert.ok(objekMateri, 'tidak ada objek materi di zona mantel');

    const id = dataDari(objekMateri).discoveryId;
    assert.equal(typeof id, 'number', 'objek materi zona mantel tidak punya discoveryId');

    const item = getDiscoveryItem(id as number);
    const teks = `${item.discovery.title} ${item.discovery.shortDesc} ${item.discovery.fact}`;

    assert.ok(
      !/divergen|pangea/i.test(teks),
      `materi zona mantel justru berisi materi divergen: "${item.discovery.title}"`,
    );
  });

  test('tidak ada NPC di zona mana pun yang memakai materi dengan judul divergen di zona non-divergen', () => {
    // Pemeriksaan menyeluruh: materi bertema divergen hanya boleh muncul di zona
    // yang memang tentang divergen.
    const salahTempat: string[] = [];

    ZONES.forEach((zone, idx) => {
      const zonaDivergen = /divergen|divergent/.test(zone.id);
      if (zonaDivergen) return;

      for (const obj of zone.objects) {
        const id = dataDari(obj).discoveryId;
        if (typeof id !== 'number') continue;
        const item = getDiscoveryItem(id);
        const teks = `${item.discovery.title} ${item.discovery.shortDesc}`;
        if (/divergen|pangea/i.test(teks)) {
          salahTempat.push(`zona ${idx} (${zone.id}) -> "${item.discovery.title}"`);
        }
      }
    });

    assert.deepEqual(salahTempat, [], `materi divergen muncul di zona lain:\n  ${salahTempat.join('\n  ')}`);
  });
});
