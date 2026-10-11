/**
 * Uji server HTTP internal aplikasi desktop.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * MENGAPA UJI INI ADA
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   `main.cjs` membuka jendela, dan jendela memerlukan layar. Karena itu
 *   bagian itu tidak dapat diuji di lingkungan tanpa tampilan — menjalankannya
 *   hanya menghasilkan keluar tanpa keluaran, yang tidak membuktikan apa pun.
 *
 *   Tetapi bagian yang paling berisiko BUKAN jendelanya, melainkan SERVER
 *   BERKASNYA. Server berkas yang salah dapat membuka seluruh isi komputer.
 *   Karena itu server dipisahkan ke `server-web.cjs` dan diuji di sini,
 *   langsung oleh Node, tanpa perlu jendela.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * YANG DIUJI
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   1. index.html tersaji di alamat akar
 *   2. berkas di dalam folder tersaji dengan jenis MIME yang benar
 *   3. alamat tanpa berkas dikembalikan ke index.html (perutean sisi klien)
 *   4. PENELUSURAN DIREKTORI DITOLAK — tidak dapat keluar dari folder web
 *   5. port dipilih bebas oleh sistem operasi
 *   6. folder bersaudara yang namanya berawalan sama TIDAK ikut terbuka
 *
 * Cara menjalankan:  node scripts/uji_server_desktop.mjs
 */
import { createServer } from 'node:http';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import net from 'node:net';

const AKAR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { jalankanServerWeb } = await import(
  pathToFileURL(join(AKAR, 'electron', 'server-web.cjs')).href
);

let lulus = 0;
let gagal = 0;

function uji(nama, hasil, harapan) {
  const ok = JSON.stringify(hasil) === JSON.stringify(harapan);
  if (ok) {
    lulus++;
    console.log(`  [v] ${nama}`);
  } else {
    gagal++;
    console.log(`  [X] ${nama}`);
    console.log(`      diharapkan: ${JSON.stringify(harapan)}`);
    console.log(`      hasil     : ${JSON.stringify(hasil)}`);
  }
}

// ── Siapkan folder web tiruan ─────────────────────────────────────────────
const dir = mkdtempSync(join(tmpdir(), 'resq-server-'));
const web = join(dir, 'dist');
const bersaudara = join(dir, 'dist-rahasia');
mkdirSync(join(web, 'assets'), { recursive: true });
mkdirSync(bersaudara, { recursive: true });

writeFileSync(join(web, 'index.html'), '<!doctype html><title>HALAMAN UTAMA</title>');
writeFileSync(join(web, 'assets', 'app.js'), 'console.log("halo")');
writeFileSync(join(web, 'assets', 'gaya.css'), 'body{color:red}');
writeFileSync(join(web, 'model.stl'), 'data-stl');
// Berkas RAHASIA di luar folder web — TIDAK boleh dapat diakses.
writeFileSync(join(dir, 'rahasia.txt'), 'INI TIDAK BOLEH TERBACA');
writeFileSync(join(bersaudara, 'berkas.txt'), 'INI JUGA TIDAK BOLEH');

const { server, alamat, port } = await jalankanServerWeb(web);
console.log('\n' + '='.repeat(72));
console.log('  UJI: SERVER HTTP INTERNAL APLIKASI DESKTOP');
console.log('='.repeat(72));
console.log(`  folder web : ${web}`);
console.log(`  disajikan  : ${alamat}\n`);

const ambil = async (jalur) => {
  const r = await fetch(`http://127.0.0.1:${port}${jalur}`);
  return { status: r.status, jenis: r.headers.get('content-type') || '', isi: await r.text() };
};

// ── 1. Halaman utama ──────────────────────────────────────────────────────
const akar = await ambil('/');
uji('index.html tersaji di alamat akar', akar.status, 200);
uji('isinya benar', akar.isi.includes('HALAMAN UTAMA'), true);
uji('jenis MIME html', akar.jenis.startsWith('text/html'), true);

// ── 2. Berkas di dalam folder ─────────────────────────────────────────────
const js = await ambil('/assets/app.js');
uji('berkas .js tersaji', js.status, 200);
uji('jenis MIME javascript', js.jenis.includes('javascript'), true);

const css = await ambil('/assets/gaya.css');
uji('berkas .css jenis MIME benar', css.jenis.startsWith('text/css'), true);

const stl = await ambil('/model.stl');
uji('berkas .stl tersaji (model 3D)', stl.status, 200);

// ── 3. Perutean sisi klien ────────────────────────────────────────────────
const rute = await ambil('/level3');
uji('alamat tanpa berkas dikembalikan ke index.html', rute.isi.includes('HALAMAN UTAMA'), true);

const ruteDalam = await ambil('/level3/workspace');
uji('alamat bersarang juga dikembalikan ke index.html', ruteDalam.isi.includes('HALAMAN UTAMA'), true);

// ── 4. PENELUSURAN DIREKTORI — yang paling penting ────────────────────────
//
// MENGAPA MEMAKAI PERMINTAAN MENTAH, BUKAN fetch()
//
//   Versi pertama uji ini memakai fetch(). Hasilnya MENYESATKAN: tiga dari
//   empat uji penelusuran "lulus" walaupun penjaganya sengaja dicabut —
//   artinya uji itu tidak menguji apa pun.
//
//   Sebabnya: peramban dan fetch() MENORMALKAN segmen `..` SEBELUM mengirim
//   permintaan. `/../rahasia.txt` diubah menjadi `/rahasia.txt`, sehingga
//   penjaganya tidak pernah diuji. Hanya bentuk berkode (%2F, %2e%2e) yang
//   lolos sampai ke server — dan hanya itulah yang benar-benar menguji.
//
//   Karena itu uji penelusuran di sini mengirim permintaan HTTP MENTAH lewat
//   soket, sehingga jalur yang sampai ke server persis seperti yang ditulis.
function permintaanMentah(jalur) {
  return new Promise((selesai) => {
    const soket = net.connect(port, '127.0.0.1', () => {
      soket.write(
        `GET ${jalur} HTTP/1.1\r\n` +
          `Host: 127.0.0.1:${port}\r\n` +
          'Connection: close\r\n\r\n'
      );
    });
    let mentah = '';
    soket.on('data', (d) => { mentah += d.toString('utf8'); });
    soket.on('close', () => selesai(mentah));
    soket.on('error', () => selesai(''));
    setTimeout(() => { try { soket.destroy(); } catch {} selesai(mentah); }, 5000);
  });
}

const JALUR_TERLARANG = [
  ['/../rahasia.txt', 'jalur .. sederhana'],
  ['/../../rahasia.txt', 'jalur .. dua tingkat'],
  ['/..%2Frahasia.txt', 'jalur .. berkode %2F'],
  ['/%2e%2e/rahasia.txt', 'jalur .. berkode %2e%2e'],
  ['/....//rahasia.txt', 'jalur ....// '],
  ['/..%5Crahasia.txt', 'jalur .. dengan garis miring terbalik'],
  ['/../rahasia.txt%00.png', 'jalur .. dengan byte nol'],
  ['/./../rahasia.txt', 'jalur ./.. '],
];

console.log('\n  ── Uji penelusuran direktori (permintaan mentah) ──');
for (const [jalur, keterangan] of JALUR_TERLARANG) {
  const jawab = await permintaanMentah(jalur);
  const terbaca = jawab.includes('TIDAK BOLEH TERBACA');
  uji(`ditolak: ${keterangan}`, terbaca, false);
}

// ── 5. Folder bersaudara yang namanya berawalan sama ─────────────────────
//
// Kasus yang mudah terlewat: bila penjagaannya memakai pencocokan awalan
// TANPA pemisah jalur, `/dist-rahasia` akan dianggap berada di dalam `/dist`
// karena namanya berawalan sama.
const saudara = await permintaanMentah('/../dist-rahasia/berkas.txt');
uji('folder bersaudara berawalan sama TIDAK terbuka', saudara.includes('TIDAK BOLEH'), false);

// ── 6. Port dipilih sistem ────────────────────────────────────────────────
uji('port dipilih otomatis (bukan 0)', port > 0, true);
uji('hanya mendengarkan di loopback', server.address().address, '127.0.0.1');

// ── 7. Dua server tidak berebut port ──────────────────────────────────────
const kedua = await jalankanServerWeb(web);
uji('server kedua dapat port berbeda', kedua.port !== port, true);
kedua.server.close();

console.log('\n' + '='.repeat(72));
console.log(`  HASIL: ${lulus} lulus, ${gagal} gagal dari ${lulus + gagal} pemeriksaan`);
console.log('='.repeat(72) + '\n');

server.close();
rmSync(dir, { recursive: true, force: true });
process.exit(gagal > 0 ? 1 : 0);
