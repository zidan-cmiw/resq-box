// ── kontrakLaporanLevel.test.ts ──────────────────────────────────────────────
// Uji agar SETIAP laporan hasil level mengirim bidang yang diwajibkan server.
//
// ═══════════════════════════════════════════════════════════════════════════
// MENGAPA UJI INI ADA — KEJADIAN NYATA
// ═══════════════════════════════════════════════════════════════════════════
//
//   Server menyimpan nilai hasil level lewat satu aturan yang keras:
//
//       IF v_missions = 0 AND v_score < 100 THEN v_score := 0;
//
//   Artinya laporan yang TIDAK mengirim `missions` (dianggap 0) akan tercatat
//   bernilai NOL bila skor kliennya di bawah 100 - tanpa error, dan tanpa cara
//   apa pun bagi siswa untuk tahu mengapa nilainya kosong.
//
//   Itu nyaris terjadi: laporan dari Wordle Level 1 tidak mengirim `missions`
//   maupun `isCompleted`, sedangkan dua pemanggil Level 1 lainnya mengirim
//   lengkap. Laporan itu hanya selamat karena skornya KEBETULAN tepat 100.
//
//   Karena itu seluruh laporan kini diperiksa: setiap pemanggilan
//   `submitLevelProgress` WAJIB menyertakan `missions` dan `isCompleted`.
//
// CARA MEMERIKSA
//   Berkas sumbernya dibaca sebagai teks, karena pemanggilnya tersebar di
//   beberapa komponen Vite yang tidak dapat diimpor penguji Node.
//
// Jalankan: npm run test

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const AKAR_SRC = fileURLToPath(new URL('../../', import.meta.url));

function berkasSumber(): string[] {
  const hasil: string[] = [];
  const jelajah = (dir: string) => {
    for (const nama of readdirSync(dir)) {
      const penuh = join(dir, nama);
      if (statSync(penuh).isDirectory()) {
        if (nama !== '__tests__') jelajah(penuh);
        continue;
      }
      if (/\.tsx?$/.test(nama)) hasil.push(penuh);
    }
  };
  jelajah(AKAR_SRC);
  return hasil;
}

const relatif = (penuh: string) => penuh.slice(AKAR_SRC.length).replace(/\\/g, '/');

/**
 * Ambil seluruh blok pemanggilan `submitLevelProgress({ ... })`.
 *
 * Dipisahkan berdasarkan penutup pemanggilan `});` pada awal baris, dan TIDAK
 * bergantung pada kedalaman indentasinya - setiap pemanggil menjorok berbeda,
 * sehingga pola yang kaku terhadap indentasi akan melewatkan sebagian laporan
 * (itu terjadi pada versi pertama uji ini: hanya 2 dari 5 laporan terbaca).
 */
function blokLaporan(isi: string): string[] {
  return [...isi.matchAll(/submitLevelProgress\(\{[\s\S]*?\n\s*\}\);/g)].map((m) => m[0]);
}

describe('laporan hasil level — bidang wajib yang harus dikirim', () => {
  /** Seluruh blok laporan beserta berkas asalnya. */
  const laporan = berkasSumber().flatMap((berkas) =>
    blokLaporan(readFileSync(berkas, 'utf8')).map((blok) => ({ berkas: relatif(berkas), blok })),
  );

  test('setidaknya ada beberapa laporan yang terbaca', () => {
    // Menjaga agar uji ini tidak diam-diam tidak memeriksa apa pun bila polanya
    // berubah.
    assert.ok(laporan.length >= 4, `hanya ${laporan.length} laporan terbaca - polanya mungkin berubah`);
  });

  test('SETIAP laporan mengirim `missions`', () => {
    // Tanpa bidang ini, server menganggapnya 0 dan dapat memaksa nilai menjadi 0.
    // Bentuk singkatan properti (`missions,`) juga diterima, bukan hanya
    // `missions: ...`.
    const pelanggar = laporan.filter(({ blok }) => !/\bmissions\s*(?::|,|\})/.test(blok));
    assert.deepEqual(
      pelanggar.map((p) => p.berkas),
      [],
      `laporan tanpa bidang "missions" - nilainya dapat tercatat 0:\n  ${pelanggar.map((p) => p.berkas).join('\n  ')}`,
    );
  });

  test('SETIAP laporan mengirim `isCompleted`', () => {
    const pelanggar = laporan.filter(({ blok }) => !/\bisCompleted\s*(?::|,|\})/.test(blok));
    assert.deepEqual(
      pelanggar.map((p) => p.berkas),
      [],
      `laporan tanpa bidang "isCompleted":\n  ${pelanggar.map((p) => p.berkas).join('\n  ')}`,
    );
  });

  test('SETIAP laporan mengirim `level_number`', () => {
    const pelanggar = laporan.filter(({ blok }) => !/\blevel_number\s*(?::|,|\})/.test(blok));
    assert.deepEqual(pelanggar.map((p) => p.berkas), [], 'laporan tanpa level_number');
  });

  test('level_number yang dipakai hanya 1, 2, dan 3', () => {
    const dipakai = new Set<string>();
    for (const { blok } of laporan) {
      for (const m of blok.matchAll(/level_number\s*:\s*(\d+)/g)) dipakai.add(m[1]);
    }
    assert.deepEqual([...dipakai].sort(), ['1', '2', '3']);
  });

  test('server melarang klien menetapkan unlocked_level lewat jalur ini', () => {
    // `unlocked_level` dihitung server, jadi tidak boleh ikut dikirim.
    const terkirim = laporan.filter(({ blok }) => /unlocked_level\s*:/.test(blok));
    assert.deepEqual(terkirim.map((p) => p.berkas), [], 'laporan mengirim unlocked_level yang dihitung server');
  });
});
