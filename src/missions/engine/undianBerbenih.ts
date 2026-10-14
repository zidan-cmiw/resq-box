// ── src/missions/engine/undianBerbenih.ts ────────────────────────────────────
// MESIN UNDIAN BERBENIH — ACAK, TETAPI DAPAT DIPERIKSA.
//
// ═══════════════════════════════════════════════════════════════════════════
// MENGAPA BERBENIH, BUKAN Math.random()
// ═══════════════════════════════════════════════════════════════════════════
//
//   Kalau soal atau kata diundi dengan `Math.random()`, hasilnya BERUBAH setiap
//   halaman dimuat ulang. Akibatnya:
//
//     - Siswa dapat "mengundi ulang" dengan me-refresh sampai mendapat soal
//       yang ia rasa mudah.
//     - Guru tidak dapat memeriksa soal mana yang dikerjakan seorang siswa,
//       sehingga nilainya tidak dapat dipertanggungjawabkan.
//
//   Karena itu undiannya memakai BENIH (seed) angka yang diturunkan dari teks
//   yang stabil — biasanya gabungan id siswa dengan id area. Sifatnya:
//
//     - ACAK antar-siswa   : dua siswa hampir pasti mendapat varian berbeda.
//     - TETAP bagi satu siswa: membuka ulang area yang sama menghasilkan varian
//       yang sama, jadi tidak ada yang bisa "mengundi ulang".
//     - DAPAT DIPERIKSA    : dengan benih yang sama, hasilnya dapat dihitung
//       ulang oleh guru kapan saja.
//
//   Modul ini sengaja hanya berisi perhitungan murni: tidak menyentuh React,
//   tidak menyentuh jaringan, dan tidak bergantung pada data mana pun. Pemakainya
//   sekarang adalah bank kata gerbang Level 1 (`bankKataGerbang.ts`).

/**
 * Ubah teks menjadi benih angka (hash FNV-1a 32-bit).
 *
 * Dipilih karena sederhana, tidak butuh pustaka, dan sebaran hasilnya cukup
 * merata untuk keperluan ini. Bukan untuk keamanan — tidak ada rahasia di sini.
 */
export function benihDari(teks: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < teks.length; i++) {
    h ^= teks.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/**
 * Pembangkit bilangan acak berbenih (mulberry32).
 *
 * Sifat pentingnya: untuk benih yang sama, urutan angka yang dihasilkan SELALU
 * sama, di peramban mana pun. Inilah yang membuat undian ini dapat diperiksa.
 *
 * Hasilnya selalu berada pada rentang 0 (termasuk) sampai 1 (tidak termasuk),
 * sehingga dapat dikalikan langsung dengan panjang daftar.
 */
export function acakBerbenih(benih: number): () => number {
  let a = benih >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Pilih satu anggota daftar secara berbenih.
 *
 * Mengembalikan `null` bila daftarnya kosong, sehingga pemanggil wajib
 * menangani kasus itu alih-alih menerima `undefined` diam-diam.
 */
export function pilihBerbenih<T>(daftar: readonly T[], benih: number): T | null {
  if (daftar.length === 0) return null;
  const acak = acakBerbenih(benih);
  const idx = Math.min(daftar.length - 1, Math.floor(acak() * daftar.length));
  return daftar[idx];
}
