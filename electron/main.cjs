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

// Halaman web berada di `dist/`. Saat sudah dikemas, folder itu ikut masuk
// ke dalam `app.asar` dan berada di samping berkas ini.
const AKAR_WEB = path.join(__dirname, 'dist');

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
    if (!fs.existsSync(path.join(AKAR_WEB, 'index.html'))) {
      dialog.showErrorBox(
        'Berkas aplikasi tidak ditemukan',
        `Aplikasi mencari halaman web di:\n${AKAR_WEB}\n\n` +
          'Folder itu tidak memuat index.html. Bila kamu menjalankan dari ' +
          'repositori, jalankan "npm run build" lebih dahulu.'
      );
      app.quit();
      return;
    }

    try {
      const { server, alamat } = await jalankanServerWeb(AKAR_WEB);
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
