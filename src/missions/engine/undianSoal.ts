// ── src/missions/engine/undianSoal.ts ────────────────────────────────────────
// PENGUNDIAN SOAL YANG ADIL DAN DAPAT DIPERIKSA.
//
// ═══════════════════════════════════════════════════════════════════════════
// MENGAPA UNDIANNYA BERBENIH, BUKAN ACAK BIASA
// ═══════════════════════════════════════════════════════════════════════════
//
//   Kalau soal diundi dengan `Math.random()`, hasilnya BERUBAH setiap halaman
//   dimuat ulang. Akibatnya:
//
//     - Siswa dapat "mengundi ulang" dengan me-refresh sampai mendapat soal
//       yang ia rasa mudah.
//     - Guru tidak dapat memeriksa soal mana yang dikerjakan seorang siswa,
//       sehingga nilainya tidak dapat dipertanggungjawabkan.
//
//   Karena itu undiannya memakai BENIH (seed) yang diturunkan dari gabungan
//   id siswa + id area. Sifatnya:
//
//     - ACAK antar-siswa: dua siswa hampir pasti mendapat soal berbeda.
//     - TETAP bagi satu siswa: membuka ulang area yang sama menghasilkan soal
//       yang sama, jadi tidak ada yang bisa "mengundi ulang".
//     - DAPAT DIPERIKSA: dengan benih yang sama, hasilnya dapat dihitung ulang
//       oleh guru kapan saja.
//
// ═══════════════════════════════════════════════════════════════════════════
// MENGAPA KOMPOSISI TINGKATNYA DIPAKSA SAMA
// ═══════════════════════════════════════════════════════════════════════════
//
//   Supaya rapor adil. Kalau undian dibiarkan sepenuhnya bebas, seorang siswa
//   bisa kebetulan mendapat tiga soal sulit sementara temannya mendapat tiga
//   soal mudah — dan nilainya tidak lagi sebanding.
//
//   Jadi yang diundi HANYA soal mana pada tiap tingkat, bukan tingkatnya.
//   Setiap siswa menerima komposisi yang sama: 1 mudah + 1 sedang + 1 sulit
//   untuk tiga soal (lihat `komposisiTingkat`).

import {
  URUTAN_TINGKAT,
  soalUntukArea,
  type Soal,
  type TingkatKesulitan,
} from '../data/bankSoal.ts';

/** Jumlah soal bawaan untuk satu area. */
export const JUMLAH_SOAL_BAWAAN = 3;

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

/** Salinan daftar yang diacak (Fisher–Yates) memakai pembangkit berbenih. */
export function acakDaftar<T>(daftar: readonly T[], acak: () => number): T[] {
  const hasil = [...daftar];
  for (let i = hasil.length - 1; i > 0; i--) {
    const j = Math.floor(acak() * (i + 1));
    const sementara = hasil[i];
    hasil[i] = hasil[j];
    hasil[j] = sementara;
  }
  return hasil;
}

/**
 * Komposisi tingkat kesulitan yang adil untuk sejumlah soal.
 *
 * Dibagi serata mungkin mulai dari tingkat paling ringan, lalu diurutkan dari
 * mudah ke sulit supaya siswa mengerjakan yang ringan lebih dahulu:
 *
 *   3 soal -> mudah, sedang, sulit
 *   2 soal -> mudah, sedang
 *   4 soal -> mudah, mudah, sedang, sulit
 */
export function komposisiTingkat(jumlah: number): TingkatKesulitan[] {
  const hasil: TingkatKesulitan[] = [];
  for (let i = 0; i < Math.max(0, jumlah); i++) {
    hasil.push(URUTAN_TINGKAT[i % URUTAN_TINGKAT.length]);
  }
  return hasil.sort((a, b) => URUTAN_TINGKAT.indexOf(a) - URUTAN_TINGKAT.indexOf(b));
}

export interface PermintaanUndian {
  /** Id area: id zona Level 1 atau id area Level 2. */
  area: string;
  /**
   * Id siswa. Inilah yang membuat soal berbeda antar-siswa namun tetap sama
   * bagi siswa yang sama.
   */
  userId: string;
  /** Berapa soal yang diminta. Bawaannya 3. */
  jumlah?: number;
  /**
   * Pembeda bila area yang sama diulang (mis. siswa mengulang setelah remedi).
   * Biarkan 0 untuk pengambilan pertama.
   */
  ulangan?: number;
}

/**
 * Undi sejumlah soal untuk satu area, adil dan dapat diperiksa.
 *
 * Hasilnya diurutkan dari tingkat termudah ke tersulit. Tidak akan pernah
 * memuat soal yang sama dua kali. Bila bank untuk sesuatu tingkat belum cukup,
 * kekurangannya diisi dari soal yang belum terpakai — sehingga fungsi ini tidak
 * pernah gagal hanya karena banknya belum lengkap.
 */
export function undiSoal({
  area,
  userId,
  jumlah = JUMLAH_SOAL_BAWAAN,
  ulangan = 0,
}: PermintaanUndian): Soal[] {
  const semesta = soalUntukArea(area);
  const target = Math.min(Math.max(0, jumlah), semesta.length);
  if (target === 0) return [];

  // Satu pembangkit untuk seluruh proses, supaya urutannya konsisten.
  const acak = acakBerbenih(benihDari(`${userId}|${area}|${ulangan}`));

  // Acak tiap tingkat SEKALI, lalu ambil dari depan. Dengan begitu soal yang
  // belum terpakai tetap tersedia untuk undian berikutnya tanpa mengacak ulang.
  const perTingkat = new Map<TingkatKesulitan, Soal[]>();
  for (const tingkat of URUTAN_TINGKAT) {
    perTingkat.set(
      tingkat,
      acakDaftar(
        semesta.filter((s) => s.tingkat === tingkat),
        acak,
      ),
    );
  }

  const terpakai = new Set<string>();
  const hasil: Soal[] = [];

  for (const tingkat of komposisiTingkat(target)) {
    const kandidat = (perTingkat.get(tingkat) ?? []).find((s) => !terpakai.has(s.id));
    if (kandidat) {
      terpakai.add(kandidat.id);
      hasil.push(kandidat);
    }
  }

  // Lengkapi bila ada tingkat yang banknya masih kosong.
  if (hasil.length < target) {
    for (const s of acakDaftar(semesta, acak)) {
      if (hasil.length >= target) break;
      if (terpakai.has(s.id)) continue;
      terpakai.add(s.id);
      hasil.push(s);
    }
    // Kembalikan urutan mudah -> sulit setelah pengisian tambahan.
    hasil.sort((a, b) => URUTAN_TINGKAT.indexOf(a.tingkat) - URUTAN_TINGKAT.indexOf(b.tingkat));
  }

  return hasil;
}
