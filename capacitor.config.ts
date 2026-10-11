import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Konfigurasi Capacitor — membungkus RESQ-BOX Web menjadi aplikasi Android.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * MENGAPA APLIKASI ANDROID, BUKAN `.exe` ATAU WEB SAJA
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Masalah yang sedang diselesaikan:
 *
 *   Web dibuka dari `https://resq-box.pages.dev` (HTTPS), sedangkan ESP32
 *   memakai `ws://192.168.4.1:81` (tidak terenkripsi). Peramban MEMBLOKIR
 *   campuran itu — namanya "mixed content" — dan memblokirnya SEBELUM koneksi
 *   dicoba. Akibatnya tombol "Diorama WiFi" tidak pernah berhasil walaupun
 *   WiFi ESP32 sudah tersambung dengan benar.
 *
 *   Ini bukan kesalahan WiFi, dan tidak dapat diatasi dengan berpindah
 *   jaringan. Yang harus berubah adalah DARI MANA halaman itu dibuka.
 *
 * Dua hal yang membuat aplikasi Android menyelesaikannya:
 *
 *   1. `androidScheme: 'https'`
 *      WebView menyajikan halaman dari `https://localhost`. Ini dianggap
 *      "konteks aman", sehingga seluruh fitur web modern tetap berjalan —
 *      termasuk service worker (mode luring) dan penyimpanan lokal.
 *
 *   2. `allowMixedContent: true`
 *      Inilah kuncinya. Tanpa ini, WebView memperlakukan `ws://` sebagai
 *      campuran yang diblokir — sama seperti peramban biasa. Dengan ini,
 *      koneksi ke ESP32 di jaringan lokal diizinkan.
 *
 *   `.exe` TIDAK dipilih karena murid memakai tablet, dan tablet tidak dapat
 *   menjalankan berkas Windows.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * YANG PERLU DIKETAHUI SEBELUM MEMBANGUN
 * ══════════════════════════════════════════════════════════════════════════
 *
 *   - Aplikasi ini memuat web dari `dist/` yang sudah dibangun lebih dahulu.
 *     Jadi urutannya: `pnpm run build` lalu `pnpm run android:sync`.
 *   - Membangun APK memerlukan Android Studio (atau JDK + Android SDK).
 *   - `allowMixedContent` membuka akses HTTP tidak terenkripsi di dalam
 *     aplikasi. Itu memang diperlukan untuk berbicara dengan perangkat di
 *     jaringan lokal, tetapi ketahuilah bahwa permukaan risikonya bertambah:
 *     konten dari sumber tidak terenkripsi dapat masuk ke WebView.
 *     Karena jaringan Board bersifat lokal dan tertutup (ESP32 memancarkan
 *     WiFi-nya sendiri tanpa akses internet), risiko itu dapat diterima untuk
 *     keperluan pembelajaran di kelas.
 */
const config: CapacitorConfig = {
  appId: 'id.resqbox.app',
  appName: 'RESQ-BOX',
  webDir: 'dist',

  // ── Konfigurasi server ───────────────────────────────────────────────────
  server: {
    // Menyajikan halaman dari https://localhost di dalam WebView.
    // Dampaknya: konteks aman terjaga (service worker & penyimpanan lokal
    // berjalan), tetapi ws:// tetap diblokir KECUALI allowMixedContent
    // dinyalakan di bawah.
    androidScheme: 'https',
  },

  android: {
    // ── INTI DARI SELURUH KONFIGURASI INI ────────────────────────────────
    // Mengizinkan halaman https://localhost membuka koneksi ws:// ke ESP32.
    // Tanpa ini, tombol "Diorama WiFi" akan gagal tanpa penjelasan — persis
    // gejala yang dilaporkan.
    allowMixedContent: true,

    // Berguna saat menelusuri masalah: WebView dapat diperiksa lewat
    // chrome://inspect dari komputer.
    webContentsDebuggingEnabled: true,
  },

  // Catatan: konfigurasi SplashScreen sengaja TIDAK ditulis di sini, karena
  // plugin `@capacitor/splash-screen` tidak dipasang. Konfigurasi untuk plugin
  // yang tidak ada akan diabaikan tanpa peringatan — jadi menuliskannya hanya
  // menimbulkan kesan bahwa layar pembuka sudah diatur, padahal tidak.
  // Bila nanti ingin mengaturnya: pasang pluginnya lebih dulu, baru tambahkan
  // blok `plugins.SplashScreen` di sini.
};

export default config;
