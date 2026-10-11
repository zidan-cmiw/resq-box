/**
 * MENGENALI DI LINGKUNGAN MANA APLIKASI SEDANG BERJALAN
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * MENGAPA DIPERLUKAN
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   Halaman masuk menampilkan tombol "Unduh aplikasi untuk diorama fisik".
 *   Tombol itu berguna di WEBSITE, tetapi tidak masuk akal di dalam APLIKASI
 *   Android maupun aplikasi laptop — penggunanya sudah memakai aplikasinya.
 *
 *   Permintaan pemilik proyek: tombol unduh "cuma di web doang", tidak di
 *   Android dan tidak di laptop.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * MENGAPA TIDAK CUKUP SATU CARA
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   Tidak ada satu tanda pun yang dapat diandalkan sendirian:
 *
 *   1. `window.Capacitor` — disuntikkan oleh Capacitor. Paling tepat, TETAPI
 *      hanya ada bila jembatan Capacitor benar-benar dimuat. Bila tidak ada,
 *      aplikasi Android akan salah dikenali sebagai website.
 *
 *   2. `location.hostname === 'localhost'` — `capacitor.config.ts` memakai
 *      `androidScheme: 'https'`, sehingga WebView Android menyajikan halaman
 *      dari `https://localhost`. Website memakai `resq-box.pages.dev`.
 *      Jadi keduanya berbeda dan dapat dibedakan. TETAPI bila suatu saat
 *      skema itu diubah, cara ini ikut gagal.
 *
 *   3. Penanda Electron — Electron menambahkan "Electron" pada user agent.
 *      Hanya berlaku untuk aplikasi laptop.
 *
 *   4. `navigator.userAgent` memuat "wv" — penanda WebView Android. Berguna
 *      sebagai cadangan, tetapi dapat berubah di versi Android mendatang.
 *
 *   Karena itu keempatnya diperiksa berurutan. Bila SALAH SATU menandai
 *   "ini aplikasi", hasilnya dianggap aplikasi. Salah menandai sebagai
 *   aplikasi hanya berarti satu blok tombol tidak tampil — jauh lebih ringan
 *   akibatnya daripada salah menandai sebagai website.
 */

/** Apakah sedang berjalan di dalam aplikasi (Android atau laptop). */
export function sedangDiAplikasi(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    // 1. Jembatan Capacitor — penanda paling tepat untuk aplikasi Android.
    const cap = (window as unknown as { Capacitor?: { isNativePlatform?: () => boolean; platform?: string } })
      .Capacitor;
    if (cap) {
      if (typeof cap.isNativePlatform === 'function' && cap.isNativePlatform()) {
        return true;
      }
      if (typeof cap.platform === 'string' && cap.platform !== 'web') {
        return true;
      }
    }

    const lokasi = window.location;

    // 2. Aplikasi Android disajikan dari https://localhost, website tidak.
    if (lokasi.hostname === 'localhost' || lokasi.hostname === '127.0.0.1') {
      return true;
    }

    const ua = navigator.userAgent || '';

    // 3. Aplikasi laptop (Electron).
    if (ua.includes('Electron')) return true;

    // 4. Cadangan: WebView Android.
    if (ua.includes('; wv)') || ua.includes(' wv)')) return true;

    return false;
  } catch {
    // Bila pemeriksaan gagal karena alasan apa pun, anggap WEBSITE.
    // Salah menampilkan tombol unduh tidak merusak apa pun; sebaliknya,
    // menyembunyikannya di website membuat fitur itu tidak berguna.
    return false;
  }
}

/** Apakah sedang berjalan di website. */
export function sedangDiWeb(): boolean {
  return !sedangDiAplikasi();
}
