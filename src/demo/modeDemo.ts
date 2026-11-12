/**
 * MODE DEMO — saklar khusus untuk keperluan presentasi.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * MENGAPA MODUL INI ADA
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  Saat demo di depan juri, soal yang berbeda-beda menyulitkan: setiap area
 *  punya bank sendiri, dan undiannya bergantung pada ID akun. Untuk demo,
 *  soal dibekukan menjadi SATU kata Wordle dan SATU grid TTS yang sudah
 *  diketahui jawabannya.
 *
 *  Modul ini sengaja dibuat sebagai saklar, bukan perubahan tetap:
 *
 *      ?demo=1   -> mode demo menyala
 *      tanpa itu -> seluruh aplikasi berjalan seperti biasa
 *
 *  Status disimpan di sessionStorage, sehingga hilang ketika tab ditutup.
 *  Dengan begitu, risiko "lupa mematikan" tidak terbawa ke kunjungan
 *  berikutnya atau ke peramban lain.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * BATAS PENGARUH
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  Yang BERUBAH hanya dua hal:
 *    1. Isi soal Wordle Level 1 dan soal TTS Level 2 (dibekukan).
 *    2. Jumlah soal yang ditampilkan (satu, bukan tiga atau lima).
 *
 *  Yang TIDAK berubah: bank soal, penilaian, penyimpanan nilai, kunci level,
 *  dan seluruh alur selain dua di atas.
 */

const KUNCI_SESI = 'resqbox_mode_demo';

/** Kata yang dipakai saat mode demo. Petunjuknya diambil dari bank asli. */
export const KATA_DEMO = 'MAGMA';

/** Area TTS yang dipakai saat mode demo: Area 1 (Mitigasi Gempa Bumi). */
export const AREA_DEMO_TTS = 0;

/**
 * Apakah mode demo menyala?
 *
 * Dicek sekali dari URL, lalu diingat selama tab hidup. Pemanggilan berulang
 * aman dan murah; hasilnya memo di memori.
 */
let sudahDiperiksa = false;
let aktif = false;

export function modeDemoAktif(): boolean {
  if (sudahDiperiksa) return aktif;
  sudahDiperiksa = true;

  try {
    if (typeof window === 'undefined') return (aktif = false);

    const url = new URLSearchParams(window.location.search);
    if (url.get('demo') === '1') {
      window.sessionStorage.setItem(KUNCI_SESI, '1');
      return (aktif = true);
    }

    if (url.get('demo') === '0') {
      window.sessionStorage.removeItem(KUNCI_SESI);
      return (aktif = false);
    }

    aktif = window.sessionStorage.getItem(KUNCI_SESI) === '1';
    return aktif;
  } catch {
    // Peramban yang memblokir sessionStorage tetap boleh membuka aplikasi;
    // mode demo dianggap mati.
    return (aktif = false);
  }
}

/** Matikan mode demo (dipakai bila perlu kembali ke perilaku biasa). */
export function matikanModeDemo(): void {
  sudahDiperiksa = true;
  aktif = false;
  try {
    window.sessionStorage.removeItem(KUNCI_SESI);
  } catch {
    /* diabaikan */
  }
}
