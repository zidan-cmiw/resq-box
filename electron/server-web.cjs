/**
 * Server HTTP internal untuk aplikasi desktop RESQ-BOX.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * MENGAPA BERKAS INI DIPISAHKAN DARI main.cjs
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   Di dalam main.cjs, server ini hanya dapat diuji dengan menjalankan
 *   aplikasi Electron yang membuka jendela. Jendela memerlukan layar, sehingga
 *   pengujiannya tidak dapat dilakukan di lingkungan tanpa tampilan.
 *
 *   Dengan dipisahkan menjadi modul tersendiri, seluruh perilakunya dapat
 *   diuji langsung oleh Node — termasuk dua hal yang paling penting:
 *
 *     1. Halaman benar-benar tersaji beserta jenis MIME yang tepat
 *     2. Penelusuran direktori DITOLAK (permintaan tidak dapat keluar dari
 *        folder web)
 *
 *   Menyerahkan berkas ini kepada pengguna tanpa menguji kedua hal itu berarti
 *   menyerahkan server berkas yang belum terbukti — dan itu berisiko, karena
 *   server berkas yang salah dapat membuka seluruh isi komputer.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * PERILAKU
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   - Melayani berkas dari folder yang diberikan
 *   - Alamat tanpa berkas (mis. /level3) dikembalikan ke index.html, supaya
 *     perutean sisi klien tetap bekerja saat halaman dimuat ulang
 *   - Permintaan yang mencoba keluar dari folder web ditolak dengan 403
 *   - Port 0 membuat sistem operasi memilih port bebas, sehingga dua salinan
 *     aplikasi tidak saling berebut
 */
'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const JENIS_MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.stl': 'model/stl',
  '.gz': 'application/gzip',
  '.txt': 'text/plain; charset=utf-8',
};

/**
 * Membuat server HTTP yang melayani folder web.
 *
 * @param {string} akarWeb Folder yang dilayani (biasanya `dist/`).
 * @returns {import('node:http').Server}
 */
function buatServerWeb(akarWeb) {
  const akarAman = path.resolve(akarWeb);

  return http.createServer((req, res) => {
    let jalurNama;
    try {
      jalurNama = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
    } catch {
      res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Permintaan tidak sah');
      return;
    }

    if (jalurNama.endsWith('/')) jalurNama += 'index.html';

    // ── Tolak byte nol ────────────────────────────────────────────────────
    // Ditemukan lewat pengujian: permintaan seperti `/../rahasia.txt%00.png`
    // menghasilkan jalur yang memuat byte nol, dan `fs.readFile` MELEMPAR
    // galat untuk jalur seperti itu. Karena galatnya dilempar SEBELUM
    // callback dipanggil, galat itu tidak tertangkap penangan `galat` di
    // bawah — dan seluruh proses aplikasi MATI.
    //
    // Satu permintaan yang cacat tidak boleh dapat mematikan aplikasi. Karena
    // itu ditolak lebih dahulu, sebelum menyentuh sistem berkas.
    if (jalurNama.includes('\0')) {
      res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Permintaan tidak sah');
      return;
    }

    let berkasAman;
    try {
      berkasAman = path.resolve(path.join(akarAman, jalurNama));
    } catch {
      // Jalur yang tidak dapat diselesaikan (mis. memuat karakter terlarang)
      // juga ditolak, bukan dibiarkan melempar.
      res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Permintaan tidak sah');
      return;
    }

    // ── Penjaga penelusuran direktori ─────────────────────────────────────
    // Perbandingan memakai pemisah jalur supaya `/dist-web` tidak dianggap
    // berada di dalam `/dist`. Tanpa pemisah itu, pencocokan awalannya bisa
    // lolos untuk folder bersaudara yang namanya berawalan sama.
    if (berkasAman !== akarAman && !berkasAman.startsWith(akarAman + path.sep)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Akses ditolak');
      return;
    }

    const kirim = (isi, jenis) => {
      res.writeHead(200, { 'Content-Type': jenis, 'Cache-Control': 'no-cache' });
      res.end(isi);
    };

    fs.readFile(berkasAman, (galat, isi) => {
      if (galat) {
        // Berkas tidak ada: kembalikan index.html supaya perutean sisi klien
        // tetap bekerja.
        fs.readFile(path.join(akarAman, 'index.html'), (galat2, index) => {
          if (galat2) {
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Berkas aplikasi tidak ditemukan');
            return;
          }
          kirim(index, JENIS_MIME['.html']);
        });
        return;
      }
      kirim(isi, JENIS_MIME[path.extname(berkasAman).toLowerCase()] || 'application/octet-stream');
    });
  });
}

/**
 * Menjalankan server pada port bebas di alamat loopback.
 *
 * @param {string} akarWeb Folder yang dilayani.
 * @returns {Promise<{ server: import('node:http').Server, alamat: string, port: number }>}
 */
function jalankanServerWeb(akarWeb) {
  return new Promise((selesai, gagal) => {
    const server = buatServerWeb(akarWeb);
    server.on('error', gagal);
    // Port 0 = sistem operasi memilih port yang bebas.
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      selesai({ server, alamat: `http://127.0.0.1:${port}/`, port });
    });
  });
}

module.exports = { buatServerWeb, jalankanServerWeb, JENIS_MIME };
