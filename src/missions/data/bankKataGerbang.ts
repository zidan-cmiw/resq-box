// ── src/missions/data/bankKataGerbang.ts ─────────────────────────────────────
// BANK KATA GERBANG SEISMIK LEVEL 1 — BEBERAPA VARIAN PER ZONA.
//
// ═══════════════════════════════════════════════════════════════════════════
// MENGAPA PERLU VARIAN
// ═══════════════════════════════════════════════════════════════════════════
//
//   Sebelumnya tiap zona hanya punya SATU set kata, sehingga seluruh siswa di
//   seluruh angkatan memecahkan kata yang sama persis. Akibatnya jawabannya
//   mudah bocor: cukup bertanya kepada kakak kelas atau teman yang sudah main.
//
//   Sekarang tiap zona punya beberapa varian, dan satu varian diundi untuk tiap
//   siswa. Kata yang harus dipecahkan berbeda antar-siswa, tetapi tetap sama
//   bila siswa yang sama membuka ulang zona itu — sehingga tidak ada yang bisa
//   "mengundi ulang" dengan me-refresh halaman.
//
// ═══════════════════════════════════════════════════════════════════════════
// ATURAN PENYUSUNAN — DIPERIKSA OTOMATIS
// ═══════════════════════════════════════════════════════════════════════════
//
//   1. JUMLAH KATA SERAGAM dalam satu zona. Zona 2 (Mantel) dan zona 6
//      (Konvergen) memakai 2 kata, zona lainnya 3 kata. Ini bukan kerapian
//      belaka: `targetCount` pada gerbang mengikuti jumlah kata varian yang
//      terundi, sehingga varian berisi 4 kata akan terasa jauh lebih berat
//      daripada varian berisi 2 kata — dan bebannya menjadi tidak adil.
//      Ada uji otomatis yang menegakkan aturan ini.
//
//   2. Semua varian pada satu zona menguji MATERI YANG SAMA. Yang berbeda hanya
//      kata dan petunjuknya, bukan konsepnya.
//
//   3. Petunjuk harus benar-benar menuntun, bukan menyebut jawabannya.
//
//   4. Kata ditulis dengan huruf kapital tanpa spasi, karena itulah yang
//      diketik siswa pada papan tebak kata.
//
// File ini murni data + satu fungsi pengundian, dipisah dari komponennya supaya
// dapat diuji otomatis tanpa perlu merender React.

import { benihDari, pilihBerbenih } from '../engine/undianBerbenih.ts';

export interface KataGerbang {
  word: string;
  /** Petunjuk utama. */
  hint: string;
  /**
   * Petunjuk ALTERNATIF untuk jawaban yang SAMA.
   *
   * Gunanya: dua siswa yang kebetulan mendapat kata yang sama tetap membaca
   * kalimat soal yang BERBEDA, sementara jawabannya tidak berubah. Dengan begitu
   * menyalin jawaban dari teman tidak lagi berguna, karena kalimat soalnya tidak
   * sama - tetapi materi dan kuncinya tetap sama persis.
   *
   * Setiap kalimat di sini WAJIB tetap memenuhi aturan yang sama seperti `hint`:
   * tidak boleh memuat kata jawabannya sendiri.
   */
  hintLain?: string[];
}

/** Bank kata gerbang: indeks zona -> daftar varian -> daftar kata. */
export const ZONE_GATE_BANK: Record<number, KataGerbang[][]> = {
  1: [
    // Kerak Bumi — 5 soal dari BANK SOAL RESQ-BOX Level 1
    [
      { word: 'SUBDUKSI', hint: 'Zona tumbukan antara kerak benua dan kerak samudra disebut...' },
      { word: 'LITOSFER', hint: 'Lapisan padat nan kaku yang menyatukan kerak bumi dan mantel atas menjadi lempeng-lempeng tektonik disebut...' },
      { word: 'SIAL', hint: 'Komposisi batuan apakah yang paling mendominasi membentuk kerak benua?' },
      { word: 'SIMA', hint: 'Komposisi batuan apakah yang paling mendominasi membentuk kerak samudra?' },
    ],
  ],
  2: [
    // Mantel Bumi — 5 soal dari BANK SOAL RESQ-BOX Level 1
    [
      { word: 'MANTEL', hint: 'Bagian tertebal dari lapisan bumi hingga 2900 km disebut...' },
      { word: 'GEOTERMAL', hint: 'Panas yang berasal dari dalam bumi disebut...' },
      { word: 'KONVEKSI', hint: 'Arus panas yang berputar naik-turun di dalam mantel bumi disebut...' },
      { word: 'ASTENOSFER', hint: 'Tempat yang menjadi zona mengapungnya lempeng tektonik adalah...' },
      { word: '1000', hint: 'Suhu minimal mantel bumi mencapai ... derajat Celsius.' },
    ],
  ],
  3: [
    // Inti Luar — 5 soal dari BANK SOAL RESQ-BOX Level 1
    [
      { word: 'CAIRAN', hint: 'Wujud material pada lapisan inti luar berupa...' },
      { word: 'MEDANMAGNET', hint: 'Akibat adanya proses geodinamo yang menimbulkan arus listrik di inti luar bumi, terbentuklah...' },
      { word: '5000', hint: 'Suhu maksimal yang dapat dicapai lapisan inti luar adalah ... derajat Celsius.' },
      { word: 'GEODYNAMO', hint: 'Proses terbentuknya medan magnet bumi dikenal sebagai...' },
    ],
  ],
  4: [
    // Inti Dalam — 5 soal dari BANK SOAL RESQ-BOX Level 1
    [
      { word: 'PADAT', hint: 'Material pada lapisan inti dalam berwujud...' },
      { word: 'NOL', hint: 'Berapakah nilai gaya gravitasi yang akan dirasakan saat berada tepat di titik pusat bumi?' },
      { word: 'PWAVES', hint: 'Jenis gelombang seismik yang dapat mendeteksi keberadaan inti dalam disebut...' },
      { word: '1220', hint: 'Berapa kilometerkah jari-jari atau kedalaman lapisan inti dalam?' },
      { word: 'INTILUAR', hint: 'Inti dalam terletak di bawah lapisan cair panas yang disebut...' },
    ],
  ],
  5: [
    // Batas Divergen — 5 soal dari BANK SOAL RESQ-BOX Level 1
    [
      { word: 'DIVERGEN', hint: 'Pergerakan dua lempeng tektonik yang saling menjauh satu sama lain disebut...' },
      { word: 'PANGEA', hint: 'Pada masa purba sekitar 250 juta tahun yang lalu, seluruh benua di bumi masih menyatu menjadi satu daratan super raksasa yang disebut...' },
      { word: 'LEMBAH', hint: 'Pergerakan lempeng divergen yang memisahkan kerak benua akan membentuk bentang alam berupa...' },
      { word: 'ASIA', hint: 'Selain Amerika Utara dan Eropa, daratan purba di belahan utara juga menjadi cikal bakal benua...' },
    ],
  ],
  6: [
    // Batas Konvergen — 5 soal dari BANK SOAL RESQ-BOX Level 1
    [
      { word: 'KONVERGEN', hint: 'Pergerakan dua lempeng tektonik yang saling mendekat dan bertumbukan satu sama lain disebut pergerakan lempeng...' },
      { word: 'PALUNG', hint: 'Bentang alam berupa dasar laut yang sangat dalam, sempit, dan memanjang akibat subduksi disebut...' },
      { word: 'OPAK', hint: 'Sesar yang terletak di kawasan DIY dan sebagian Jawa Tengah akibat aktivitas tektonik lempeng konvergen di selatan Pulau Jawa adalah...' },
      { word: 'SAMUDRA', hint: 'Jenis lempeng apakah yang memiliki massa jenis lebih berat sehingga menunjam di bawah lempeng yang lebih ringan?' },
      { word: 'HIMALAYA', hint: 'Apa nama pegunungan di Nepal, India, yang terbentuk akibat tumbukan antar kerak benua?' },
    ],
  ],
  7: [
    // Batas Transform — 5 soal dari BANK SOAL RESQ-BOX Level 1
    [
      { word: 'SANANDREAS', hint: 'Sesar yang terletak di Kalifornia, Amerika Serikat akibat aktivitas lempeng transform adalah...' },
      { word: 'TRANSFORM', hint: 'Pergerakan dua lempeng tektonik yang saling bergesekan secara horizontal satu sama lain disebut...' },
      { word: 'HORIZONTAL', hint: 'Arah gerakan lempeng tektonik transform adalah...' },
      { word: 'GEMPABUMI', hint: 'Bencana apakah yang akan terjadi ketika dua buah lempeng bergerak secara transform?' },
    ],
  ],
};

/** Seluruh varian milik satu zona (kosong bila zona tidak ada di bank). */
export function varianZona(zoneIdx: number): KataGerbang[][] {
  return ZONE_GATE_BANK[zoneIdx] ?? [];
}

/**
 * Petunjuk yang dibaca seorang siswa untuk satu kata.
 *
 * Kalimatnya dipilih dari `hint` dan `hintLain` memakai mesin berbenih yang
 * sama dengan pengundian kata, sehingga:
 *
 *   - BERBEDA antar-siswa - dua siswa yang kebetulan mendapat kata yang sama
 *     tetap membaca kalimat soal yang berbeda,
 *   - TETAP bagi siswa yang sama - menyegarkan halaman tidak mengubah kalimatnya,
 *     jadi tidak ada yang bisa mengundi ulang sampai mendapat kalimat termudah,
 *   - JAWABANNYA TIDAK BERUBAH - hanya redaksinya yang berbeda.
 */
export function petunjukUntuk(
  kata: KataGerbang,
  zona: number,
  indeksKata: number,
  userId: string,
): string {
  const pilihan = [kata.hint, ...(kata.hintLain ?? [])];
  if (pilihan.length <= 1) return kata.hint;

  const dipilih = pilihBerbenih(
    pilihan,
    benihDari(`${userId}|petunjuk|${zona}|${indeksKata}|${kata.word}`),
  );
  return dipilih ?? kata.hint;
}

/**
 * Undi satu varian set kata gerbang untuk siswa ini.
 *
 * Memakai mesin berbenih yang sama seperti bank soal (`acakBerbenih` +
 * `benihDari`), sehingga sifatnya:
 *
 *   - BERBEDA antar-siswa — kata yang harus dipecahkan tidak lagi sama semua,
 *   - TETAP bagi siswa yang sama — membuka ulang zona yang sama menghasilkan
 *     kata yang sama, sehingga tidak ada yang bisa "mengundi ulang" dengan
 *     me-refresh halaman, dan
 *   - DAPAT DIPERIKSA guru — dengan benih yang sama, hasilnya dapat dihitung
 *     ulang kapan saja.
 *
 * Bila zona yang diminta tidak ada di bank, dipakai zona 1 sebagai cadangan
 * supaya gerbangnya tidak pernah kosong.
 */
export function undiKataGerbang(zoneIdx: number, userId: string): KataGerbang[] {
  const varian = pilihBerbenih(varianZona(zoneIdx), benihDari(`${userId}|gerbang|${zoneIdx}`));
  if (varian) return varian;

  // Zona yang diminta tidak ada di bank — pakai zona 1 sebagai cadangan supaya
  // gerbangnya tidak pernah kosong. Benihnya memakai penanda zona cadangan,
  // bukan nomor zona yang salah, agar hasilnya tetap dapat diperiksa.
  const cadangan = pilihBerbenih(varianZona(1), benihDari(`${userId}|gerbang|1`));
  return cadangan ?? [];
}
