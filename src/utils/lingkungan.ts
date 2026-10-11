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
 *   2. Penanda Electron pada user agent — berlaku untuk aplikasi laptop.
 *
 *   3. `navigator.userAgent` memuat "wv" — penanda WebView Android. Berguna
 *      sebagai cadangan, tetapi dapat berubah di versi Android mendatang.
 *
 *   4. Nama host lokal TANPA port — inilah aplikasi Android.
 *      `capacitor.config.ts` memakai `androidScheme: 'https'`, sehingga
 *      WebView Android menyajikan halaman dari `https://localhost` pada port
 *      bawaan 443 — jadi `location.port` KOSONG.
 *
 *      PORT ITU PENTING. Versi pertama hanya memeriksa nama host, sehingga
 *      `http://localhost:5173` (server pengembangan Vite) ikut dikenali
 *      sebagai aplikasi. Akibatnya tombol unduh HILANG saat halaman dicoba di
 *      laptop sendiri, padahal di website tombolnya ada — membingungkan dan
 *      menyulitkan pengujian. Sekarang port diperiksa: server pengembangan
 *      dan `vite preview` PUNYA port, aplikasi Android tidak.
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
    const ua = navigator.userAgent || '';

    // 2. Penanda Electron — aplikasi laptop.
    //
    //    DIPERIKSA SEBELUM aturan localhost, karena aplikasi laptop menyajikan
    //    halamannya dari `http://127.0.0.1:<port acak>`. Tanpa pemeriksaan
    //    lebih dahulu, nilai `127.0.0.1` saja tidak cukup untuk membedakannya
    //    dari server pengembangan.
    if (ua.includes('Electron')) return true;

    // 3. Tanda WebView Android — penanda yang cukup khas.
    if (ua.includes('; wv)') || ua.includes(' wv)')) return true;

    // 4. localhost TANPA port — inilah aplikasi Android.
    //
    //    MENGAPA PORT YANG MENJADI PEMBEDANYA
    //
    //      Aplikasi Android menyajikan halamannya dari `https://localhost`
    //      dengan port bawaan 443, sehingga `location.port` KOSONG.
    //
    //      Server pengembangan Vite berjalan di `http://localhost:5173`, dan
    //      `vite preview` di `http://localhost:4173` — keduanya PUNYA port.
    //
    //      Sebelumnya aturan ini hanya memeriksa nama host, sehingga
    //      `localhost:5173` ikut dikenali sebagai aplikasi. Akibatnya tombol
    //      unduh HILANG saat pengembang mencoba halamannya di laptop sendiri,
    //      padahal di website tombolnya ada. Itu membingungkan dan menyulitkan
    //      pengujian.
    //
    //    Aplikasi laptop tidak terpengaruh: ia sudah dikenali lewat penanda
    //    Electron di atas, sehingga portnya tidak perlu diperiksa.
    const hosLokal = lokasi.hostname === 'localhost' || lokasi.hostname === '127.0.0.1';
    if (hosLokal && !lokasi.port) return true;

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
