// ── src/app/Level1/Wordle/kataWordle.ts ──────────────────────────────────────
// BANK KATA TEKA-TEKI KATA (WORDLE) LEVEL 1 — BESERTA PETUNJUKNYA.
//
// ═══════════════════════════════════════════════════════════════════════════
// MENGAPA DIPISAH DARI KOMPONENNYA
// ═══════════════════════════════════════════════════════════════════════════
//
//   Data ini sebelumnya berada di dalam `Wordle/index.tsx`, sehingga tidak dapat
//   diperiksa uji otomatis. Akibatnya ada DUA petunjuk yang memuat kata
//   jawabannya sendiri:
//
//     - JALUR  -> "Jalur evakuasi aman yang wajib diikuti warga ..."
//     - SUSUL  -> "Gempa susulan adalah gempa skala lebih kecil ..."
//
//   Selama petunjuk itu tidak pernah tampil, kebocoran itu tidak terasa. Tetapi
//   begitu petunjuk ditampilkan, keduanya langsung membocorkan jawabannya —
//   persis masalah yang baru saja diperbaiki pada banner "KESEMPATAN HABIS".
//
//   Karena itu petunjuk sekarang diuji: `__tests__/kataWordle.test.ts`
//   MENOLAK petunjuk yang memuat kata jawabannya, sehingga kebocoran seperti itu
//   tidak dapat terjadi lagi tanpa ketahuan.
//
// ═══════════════════════════════════════════════════════════════════════════
// ATURAN PENULISAN PETUNJUK
// ═══════════════════════════════════════════════════════════════════════════
//
//   1. Petunjuk HARUS menuntun ke arah jawaban, TETAPI tidak boleh memuat kata
//      jawabannya (termasuk sebagai bagian dari kata lain).
//   2. Petunjuk menjelaskan MAKNA atau CIRI, bukan mengeja hurufnya.
//   3. Kata ditulis kapital tanpa spasi, karena itulah yang diketik siswa.

export interface KataWordle {
  word: string;
  hint: string;
}

/**
 * Bank kata bawaan untuk teka-teki kata.
 *
 * Daftar ini dapat ditimpa oleh pemanggil lewat prop `customWords` — misalnya
 * gerbang tiap zona Level 1 yang memakai kata dari `bankKataGerbang.ts`.
 */
export const WORD_BANK: KataWordle[] = [
  { word: 'GEMPA', hint: 'Getaran di permukaan bumi akibat pelepasan energi lempeng tektonik.' },
  { word: 'MAGMA', hint: 'Batuan cair pijar yang sangat panas di dalam mantel bumi.' },
  { word: 'SESAR', hint: 'Patahan pada kerak bumi yang menjadi pusat gempa tektonik dangkal.' },
  { word: 'KERAK', hint: 'Lapisan bumi paling luar yang keras tempat manusia berpijak.' },
  { word: 'KRATER', hint: 'Lubang kawah di puncak gunung berapi tempat magma dan gas keluar saat erupsi.' },
  { word: 'EROSI', hint: 'Proses pengikisan tanah atau lereng gunung yang memicu longsor.' },
  { word: 'PANAS', hint: 'Energi termal ekstrem dari dalam bumi (geotermal) dan erupsi magma.' },
  { word: 'RETAK', hint: 'Kondisi rekahan tanah atau dinding bangunan akibat guncangan gempa.' },
  // Dulu: "Gempa susulan adalah gempa skala lebih kecil setelah gempa utama."
  // Kata "susulan" memuat kata jawabannya sendiri, sehingga petunjuk ini
  // membocorkan jawaban begitu ia ditampilkan. Diganti memakai kata "lanjutan".
  { word: 'SUSUL', hint: 'Gempa lanjutan berskala lebih kecil yang terjadi setelah gempa utama.' },
  { word: 'PUSAT', hint: 'Titik asal terjadinya gelombang gempa bumi di bawah tanah (hiposentrum).' },
  // Dulu: "Jalur evakuasi aman yang wajib diikuti warga saat terjadi bencana."
  // Kata "Jalur" di awal kalimat sama dengan jawabannya. Diganti memakai "Rute".
  { word: 'JALUR', hint: 'Rute aman yang wajib diikuti warga menuju tempat evakuasi saat bencana.' },
];
