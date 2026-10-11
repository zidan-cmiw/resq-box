/**
 * Uji: bisakah halaman HTTPS membuka ws:// ke perangkat di jaringan lokal?
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * MENGAPA UJI INI ADA
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   Dilaporkan: "webnya gabisa nyambung ke hardwarenya", dan ada saran dari
 *   teman untuk memakai "middleware translator".
 *
 *   Sebelum menyarankan apa pun, perilakunya diukur. Yang diuji:
 *
 *     1. Dari halaman HTTP  (http://127.0.0.1)  -> ws:// diperbolehkan?
 *     2. Dari halaman HTTPS (https://...)       -> ws:// diblokir?
 *
 *   Yang diperiksa adalah LAPISAN YANG MEMBLOKIR: apakah permintaan sampai ke
 *   jaringan, atau dihentikan sebelum dicoba.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * CARA MENJALANKAN
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   node scripts/uji_blokir_ws.mjs <url-halaman>
 *
 *   Contoh:
 *     node scripts/uji_blokir_ws.mjs http://127.0.0.1:4173/workspace
 */
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const HALAMAN = process.argv[2] || 'http://127.0.0.1:4173/workspace';
const PORT = 9910;

const CHROME =
  process.env.CHROME_PATH ||
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const dir = mkdtempSync(join(tmpdir(), 'resq-ws-'));
const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--no-sandbox',
  `--remote-debugging-port=${PORT}`, `--user-data-dir=${dir}`,
  '--window-size=1200,900', 'about:blank',
], { stdio: 'ignore' });

const tunggu = (ms) => new Promise((r) => setTimeout(r, ms));

async function cariSoket() {
  for (let i = 0; i < 40; i += 1) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/list`, {
        signal: AbortSignal.timeout(3000),
      });
      const t = (await r.json()).find((x) => x.type === 'page');
      if (t?.webSocketDebuggerUrl) return t.webSocketDebuggerUrl;
    } catch { /* belum siap */ }
    await tunggu(500);
  }
  throw new Error('DevTools tidak siap');
}

const soket = new WebSocket(await cariSoket());
await new Promise((ok, g) => { soket.onopen = ok; soket.onerror = g; });

let n = 0;
const peta = new Map();
const logMasuk = [];
soket.onmessage = (e) => {
  const p = JSON.parse(e.data);
  if (p.method === 'Log.entryAdded') logMasuk.push(p.params.entry.text);
  if (p.id && peta.has(p.id)) { peta.get(p.id)(p); peta.delete(p.id); }
};
const cmd = (m, pr = {}) => {
  n += 1; const id = n;
  return new Promise((s, g) => {
    peta.set(id, (p) => (p.error ? g(new Error(JSON.stringify(p.error))) : s(p.result)));
    soket.send(JSON.stringify({ id, method: m, params: pr }));
  });
};
const nilai = async (x) =>
  (await cmd('Runtime.evaluate', { expression: x, returnByValue: true, awaitPromise: true }))
    .result?.value;

/**
 * Coba buka ws:// dari dalam halaman, lalu laporkan hasilnya.
 *
 * MENGAPA MENUNGGU 'error' ATAU 'open' DAN BUKAN MENANGKAP EXCEPTION SAJA
 *
 *   Pada koneksi yang DIBLOKIR sebagai mixed content, WebSocket TIDAK melempar
 *   exception saat dibuat. Ia memanggil onerror seketika, dan pesan di konsol
 *   berbunyi seperti:
 *
 *       "Mixed Content: The page at 'https://...' was loaded over HTTPS, but
 *        attempted to connect to the insecure WebSocket endpoint 'ws://...'.
 *        This request has been blocked."
 *
 *   Karena itu yang diperiksa adalah: berapa lama sampai onerror dipanggil,
 *   dan apa isi pesan konsolnya.
 */
const COBA = `(() => new Promise((selesai) => {
  const mulai = Date.now();
  const pesanKonsol = [];
  const asliError = console.error;
  console.error = (...a) => { pesanKonsol.push(a.map(String).join(' ')); asliError(...a); };

  let ws;
  try {
    ws = new WebSocket('ws://192.168.4.1:81');
  } catch (e) {
    console.error = asliError;
    return selesai({ hasil: 'exception-saat-dibuat', pesan: String(e), ms: 0 });
  }

  const selesaiSekali = (hasil, pesan) => {
    console.error = asliError;
    const ms = Date.now() - mulai;
    try { ws.close(); } catch {}
    selesai({ hasil, pesan: pesan || '', ms, pesanKonsol: pesanKonsol.slice(0, 3) });
  };

  ws.onopen = () => selesaiSekali('TERBUKA', 'koneksi berhasil');
  ws.onerror = () => selesaiSekali('GAGAL', 'onerror dipanggil');
  setTimeout(() => selesaiSekali('WAKTU HABIS', 'tidak ada respons dalam 5 detik'), 5000);
}))()`;

try {
  await cmd('Page.enable');
  await cmd('Runtime.enable');
  await cmd('Log.enable');

  await cmd('Page.navigate', { url: HALAMAN });
  await tunggu(7000);

  const asal = await nilai('location.origin');
  const protokol = await nilai('location.protocol');
  const konteksAman = await nilai('window.isSecureContext');

  console.log('='.repeat(78));
  console.log('  UJI: KONEKSI ws:// DARI HALAMAN');
  console.log('='.repeat(78));
  console.log(`  halaman          : ${HALAMAN}`);
  console.log(`  origin           : ${asal}`);
  console.log(`  protokol         : ${protokol}`);
  console.log(`  konteks aman     : ${konteksAman}`);
  console.log('');

  const hasil = await nilai(COBA);
  console.log(`  percobaan ws://192.168.4.1:81`);
  console.log(`      hasil    : ${hasil.hasil}`);
  console.log(`      waktu    : ${hasil.ms} ms`);
  console.log(`      pesan    : ${hasil.pesan}`);
  if (hasil.pesanKonsol?.length) {
    console.log(`      konsol   :`);
    for (const p of hasil.pesanKonsol) {
      console.log(`          ${String(p).slice(0, 150)}`);
    }
  }
  console.log('');

  const soalWs = logMasuk.filter((t) =>
    /mixed content|insecure|websocket|ws:\/\//i.test(t));
  if (soalWs.length) {
    console.log('  ── PESAN DARI PERAMBAN ──');
    for (const t of soalWs.slice(0, 4)) {
      console.log('      ' + String(t).slice(0, 200));
    }
    console.log('');
  }

  console.log('  ── TAFSIRAN ──');
  if (hasil.hasil === 'GAGAL' && hasil.ms < 200) {
    console.log('      Gagal dalam waktu SANGAT SINGKAT (<200 ms).');
    console.log('      Itu tanda permintaan DIBLOKIR SEBELUM dicoba ke jaringan —');
    console.log('      bukan perangkat yang tidak menjawab. Perangkat yang tidak');
    console.log('      ada memerlukan waktu lebih lama (batas waktu TCP).');
  } else if (hasil.hasil === 'GAGAL') {
    console.log('      Gagal dalam waktu lebih lama — kemungkinan permintaan');
    console.log('      MEMANG DIKIRIM tetapi tidak ada yang menjawab di alamat itu.');
  } else if (hasil.hasil === 'TERBUKA') {
    console.log('      Koneksi BERHASIL. Berarti ws:// diperbolehkan dari halaman ini.');
  } else {
    console.log('      Tidak ada respons. Periksa apakah pesan konsol menyebut');
    console.log('      "Mixed Content".');
  }
} catch (e) {
  console.log('  GAGAL: ' + e.message);
} finally {
  try { soket.close(); } catch {}
  try { chrome.kill(); } catch {}
  try { rmSync(dir, { recursive: true, force: true }); } catch {}
}
process.exit(0);
