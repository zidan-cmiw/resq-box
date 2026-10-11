/**
 * RESQ-BOX — Aplikasi Desktop (Electron)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * MENGAPA APLIKASI DESKTOP ADA
 *
 *   Peramban memblokir koneksi `ws://` (tidak terenkripsi) dari halaman yang
 *   disajikan lewat HTTPS. Website `https://resq-box.pages.dev` karena itu
 *   TIDAK DAPAT menyambung ke diorama ESP32 di `ws://192.168.4.1:81`.
 *
 *   Sudah dibuktikan bahwa perbaikannya bukan pada Board, bukan pada WiFi,
 *   dan bukan pada kode aplikasi — melainkan pada DARI MANA halaman
 *   disajikan. Aplikasi web yang dijalankan di `http://localhost:5173`
 *   dengan laptop tersambung ke WiFi DIORAMA_ESP32 BERHASIL menyambung.
 *
 *   Aplikasi desktop ini melakukan hal yang sama: halaman yang sama disajikan
 *   dari `http://127.0.0.1:<port>` di dalam komputer sendiri. Alamat
 *   `127.0.0.1` diperlakukan peramban sebagai konteks aman, sehingga `ws://`
 *   ke perangkat di jaringan lokal DIIZINKAN.
 *
 * MENGAPA HTTP SERVER SENDIRI, BUKAN `file://`
 *
 *   Electron dapat memuat berkas langsung dengan `file://`. Tetapi:
 *
 *     1. `fetch()` dan modul ES sering gagal pada `file://` karena kebijakan
 *        asal yang ketat.
 *     2. Service worker (mode luring aplikasi) TIDAK berjalan pada `file://`.
 *     3. Perilaku `ws://` dari `file://` tidak pasti.
 *
 *   Melayani lewat `http://127.0.0.1` menghilangkan ketiga masalah itu
 *   sekaligus, dan keadaan halamannya menjadi SAMA dengan `localhost:5173`
 *   yang sudah terbukti bekerja.
 *
 * PORT DIPILIH OTOMATIS
 *
 *   Bila port tetap ditulis di kode, dua hal bisa bentrok: aplikasi lain yang
 *   memakai port itu, atau dua salinan RESQ-BOX yang dijalankan bersamaan.
 *   Port 0 membuat sistem operasi memilih port yang bebas.
 *
 * CATATAN UNTUK PENGUJIAN
 *
 *   Jendela memerlukan layar. Di lingkungan tanpa tampilan, aplikasi ini
 *   keluar tanpa keluaran apa pun — dan itu BUKAN tanda kerusakan. Bagian
 *   yang menentukan (server berkas) dipisahkan ke `server-web.cjs` supaya
 *   dapat diuji tersendiri tanpa membuka jendela.
 */
'use strict';

const { app, BrowserWindow, shell, dialog } = require('electron');
const fs = require('node:fs');
const path = require('node:path');
const { jalankanServerWeb } = require('./server-web.cjs');

/**
 * Mencari folder halaman web (`dist/`).
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * MENGAPA INI TIDAK BOLEH HANYA MEMAKAI `__dirname`
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   Versi pertama memakai `path.join(__dirname, 'dist')`. Itu BENAR saat
 *   dijalankan dari repositori, tetapi SALAH setelah dikemas:
 *
 *       __dirname  ->  <app.asar>/electron        (lokasi berkas ini)
 *       yang dituju ->  <app.asar>/electron/dist   <- TIDAK ADA
 *       seharusnya  ->  <app.asar>/dist            (di tingkat atas paket)
 *
 *   Akibatnya berkas .exe yang sudah dibangun MENOLAK dijalankan dengan
 *   pesan "Berkas aplikasi tidak ditemukan" — padahal seluruh isinya
 *   lengkap. Yang salah hanya cara mencarinya.
 *
 *   `app.getAppPath()` mengembalikan AKAR paket, bukan lokasi berkas ini,
 *   sehingga benar untuk kedua keadaan:
 *
 *       dari repositori  ->  <proyek>            lalu <proyek>/dist
 *       setelah dikemas  ->  <app.asar>          lalu <app.asar>/dist
 *
 *   Beberapa kemungkinan dicoba berurutan supaya aplikasi tetap dapat
 *   dijalankan walau susunan paketnya berbeda (mis. bila `dist` suatu saat
 *   diletakkan di dalam folder lain).
 *
 * @returns Jalur folder web yang benar-benar ada, atau null bila tidak ada.
 */
function cariAkarWeb() {
  const calon = [
    // Cara utama: akar paket, benar untuk repositori maupun setelah dikemas.
    path.join(app.getAppPath(), 'dist'),
    // Cadangan: di samping berkas ini (susunan saat dijalankan dari sumber).
    path.join(__dirname, 'dist'),
    // Cadangan: satu tingkat di atas, untuk susunan kemasan yang berbeda.
    path.join(__dirname, '..', 'dist'),
    // Cadangan: sumber daya di luar asar, bila dist diletakkan terpisah.
    path.join(process.resourcesPath || '', 'dist'),
  ];

  for (const c of calon) {
    try {
      if (c && fs.existsSync(path.join(c, 'index.html'))) return c;
    } catch {
      // Jalur yang tidak dapat diperiksa cukup dilewati.
    }
  }
  return null;
}

// Halaman web. Pencarian sebenarnya dilakukan saat aplikasi siap, karena
// `app.getAppPath()` baru dapat dipanggil setelah Electron siap.
let AKAR_WEB = path.join(__dirname, 'dist');

let jendela = null;

function buatJendela(alamat) {
  jendela = new BrowserWindow({
    width: 1366,
    height: 850,
    minWidth: 900,
    minHeight: 620,
    backgroundColor: '#0f172a',
    title: 'RESQ-BOX',
    // Bilah menu disembunyikan supaya tampilannya seperti aplikasi, bukan
    // peramban. Tetap dapat dimunculkan dengan tombol Alt bila diperlukan.
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      // Halaman TIDAK dapat menyentuh berkas maupun menjalankan perintah
      // sistem. Aplikasi ini tidak memerlukan jembatan ke Node, jadi tidak
      // ada yang perlu dibuka.
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      // JANGAN dimatikan. Halaman disajikan dari http://127.0.0.1, dan justru
      // itulah yang membuat ws:// ke Board diizinkan tanpa perlu melemahkan
      // keamanan peramban.
      webSecurity: true,
    },
  });

  jendela.once('ready-to-show', () => jendela.show());

  // Tautan luar (mis. situs referensi) dibuka di peramban bawaan, bukan
  // menggantikan aplikasi.
  jendela.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });

  jendela.loadURL(alamat);

  jendela.on('closed', () => {
    jendela = null;
  });
}

// Hanya satu salinan aplikasi yang boleh berjalan. Dua salinan akan berebut
// port dan membingungkan pengguna.
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (jendela) {
      if (jendela.isMinimized()) jendela.restore();
      jendela.focus();
    }
  });

  app.whenReady().then(async () => {
    // Pencarian dilakukan DI SINI, bukan di tingkat atas berkas, karena
    // `app.getAppPath()` baru dapat dipanggil setelah Electron siap.
    const akarDitemukan = cariAkarWeb();

    if (!akarDitemukan) {
      // Tampilkan SEMUA lokasi yang sudah dicoba, supaya penyebabnya dapat
      // diketahui dari pesan itu sendiri — tanpa perlu menebak.
      const dicoba = [
        path.join(app.getAppPath(), 'dist'),
        path.join(__dirname, 'dist'),
        path.join(__dirname, '..', 'dist'),
        path.join(process.resourcesPath || '', 'dist'),
      ]
        .filter(Boolean)
        .map((c) => `  • ${c}`)
        .join('\n');

      dialog.showErrorBox(
        'Berkas aplikasi tidak ditemukan',
        'Aplikasi tidak menemukan halaman web (index.html).\n\n' +
          'Lokasi yang sudah dicoba:\n' +
          `${dicoba}\n\n` +
          `Akar paket : ${app.getAppPath()}\n` +
          `Berkas ini : ${__dirname}\n` +
          `Dikemas    : ${app.isPackaged ? 'ya' : 'tidak'}\n\n` +
          'Bila kamu menjalankan dari repositori, jalankan "npm run build" ' +
          'lebih dahulu.'
      );
      app.quit();
      return;
    }

    AKAR_WEB = akarDitemukan;

    try {
      const { server, alamat } = await jalankanServerWeb(AKAR_WEB);
      console.log(`[RESQ-BOX] Halaman web ditemukan di: ${AKAR_WEB}`);
      console.log(`[RESQ-BOX] Aplikasi disajikan dari ${alamat}`);
      console.log('[RESQ-BOX] Dari alamat ini, koneksi ws:// ke Board diizinkan.');
      buatJendela(alamat);

      app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0 && server.listening) {
          buatJendela(`http://127.0.0.1:${server.address().port}/`);
        }
      });
    } catch (galat) {
      dialog.showErrorBox('Server gagal dijalankan', String(galat));
      app.quit();
    }
  });

  app.on('window-all-closed', () => {
    app.quit();
  });
}
