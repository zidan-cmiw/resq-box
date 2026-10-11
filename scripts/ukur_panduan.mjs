/**
 * Mengukur tata letak dialog panduan Resqy pada SETIAP langkahnya.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * MENGAPA SKRIP INI ADA
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   Dilaporkan dari laptop: pada langkah 3 panduan, ISI TEKSNYA HILANG —
 *   hanya tersisa celah kosong di antara judul dan tombol.
 *
 *   Mengukur hanya langkah 1 tidak berguna, karena di langkah 1 teksnya
 *   tampil normal. Masalahnya hanya muncul SETELAH tombol "LANJUTKAN"
 *   ditekan, sehingga pengukuran harus dilakukan pada langkah 3.
 *
 *   `--dump-dom` tidak dapat menekan tombol, jadi skrip ini memakai Chrome
 *   DevTools Protocol: menjalankan skrip DI DALAM halaman pada tiap langkah,
 *   lalu mengembalikan hasil ukurannya.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * CARA MENJALANKAN
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   node scripts/ukur_panduan.mjs [lebar] [tinggi]
 */
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const LEBAR = Number(process.argv[2] || 1708);
const TINGGI = Number(process.argv[3] || 1001);
const PORT_CDF = 9333;
const ALAMAT = 'http://localhost:4173/login';

const CHROME =
  process.env.CHROME_PATH ||
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const dir = mkdtempSync(join(tmpdir(), 'resq-cdp-'));

const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    `--remote-debugging-port=${PORT_CDF}`,
    `--user-data-dir=${dir}`,
    `--window-size=${LEBAR},${TINGGI}`,
    ALAMAT,
  ],
  { stdio: 'ignore' }
);

/** Menunggu sampai endpoint DevTools siap, lalu kembalikan URL soketnya. */
async function cariSoket() {
  for (let i = 0; i < 40; i += 1) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT_CDF}/json/list`, {
        signal: AbortSignal.timeout(3000),
      });
      const daftar = await r.json();
      const halaman = daftar.find(
        (t) => t.type === 'page' && String(t.url).includes('/login')
      );
      if (halaman?.webSocketDebuggerUrl) return halaman.webSocketDebuggerUrl;
    } catch {
      // Belum siap; coba lagi.
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error('DevTools tidak pernah siap');
}

const soket = new WebSocket(await cariSoket());
await new Promise((ok, gagal) => {
  soket.onopen = ok;
  soket.onerror = gagal;
});

let nomor = 0;
const menunggu = new Map();

soket.onmessage = (ev) => {
  const pesan = JSON.parse(ev.data);
  if (pesan.id && menunggu.has(pesan.id)) {
    menunggu.get(pesan.id)(pesan);
    menunggu.delete(pesan.id);
  }
};

/** Menjalankan skrip di dalam halaman dan mengembalikan nilainya. */
function jalankan(ekspresi) {
  nomor += 1;
  const id = nomor;
  return new Promise((selesai, gagal) => {
    menunggu.set(id, (pesan) => {
      if (pesan.error) return gagal(new Error(JSON.stringify(pesan.error)));
      const hasil = pesan.result?.result;
      if (hasil?.subtype === 'error') {
        return gagal(new Error(hasil.description || 'galat di halaman'));
      }
      selesai(hasil?.value);
    });
    soket.send(
      JSON.stringify({
        id,
        method: 'Runtime.evaluate',
        params: { expression: ekspresi, returnByValue: true, awaitPromise: true },
      })
    );
  });
}

/** Mengambil tangkapan layar halaman, dikembalikan sebagai berkas PNG. */
function tangkapLayar(nama) {
  nomor += 1;
  const id = nomor;
  return new Promise((selesai, gagal) => {
    menunggu.set(id, (pesan) => {
      if (pesan.error) return gagal(new Error(JSON.stringify(pesan.error)));
      const data = pesan.result?.data;
      if (!data) return gagal(new Error('tidak ada data tangkapan layar'));
      const jalur = join(process.env.TEMP || '.', `panduan-${nama}.png`);
      writeFileSync(jalur, Buffer.from(data, 'base64'));
      selesai(jalur);
    });
    soket.send(
      JSON.stringify({
        id,
        method: 'Page.captureScreenshot',
        params: { format: 'png' },
      })
    );
  });
}

const tunggu = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Skrip pengukuran, dijalankan di dalam halaman ────────────────────────
const UKUR = `(() => {
  const dialog = document.querySelector('.resqy-tutorial-overlay [class*="max-w-[680px]"]');
  if (!dialog) return { galat: 'dialog tidak ditemukan' };
  const papan = dialog.firstElementChild;
  const anak = papan ? [...papan.children] : [];
  const kotak = (e) => {
    if (!e) return null;
    const r = e.getBoundingClientRect();
    const cs = getComputedStyle(e);
    return {
      w: Math.round(r.width), h: Math.round(r.height),
      atas: Math.round(r.top), bawah: Math.round(r.bottom),
      flex: cs.flex, minH: cs.minHeight, maxH: cs.maxHeight,
      overflowY: cs.overflowY, display: cs.display,
      scrollH: e.scrollHeight, clientH: e.clientHeight,
    };
  };
  const isi = anak.find(e => (e.className||'').includes('overflow-y-auto'));
  const judul = papan ? papan.querySelector('h3') : null;
  const badan = papan ? papan.querySelector('p') : null;
  return {
    layar: window.innerWidth + 'x' + window.innerHeight,
    langkah: (document.querySelector('.resqy-tutorial-overlay span')||{}).textContent || '?',
    tinggiDialogTerpasang: dialog.style.maxHeight || '(tidak ada)',
    dialog: kotak(dialog),
    papan: kotak(papan),
    jumlahAnakPapan: anak.length,
    kelasAnak: anak.map(e => (e.className||'').slice(0, 45)),
    kotakIsi: kotak(isi),
    warnaIsi: isi ? getComputedStyle(isi).color : null,
    opasitasIsi: isi ? getComputedStyle(isi).opacity : null,
    teksJudul: judul ? judul.textContent.slice(0, 45) : null,
    teksBadan: badan ? badan.textContent.slice(0, 70) : null,
    tinggiBadan: badan ? Math.round(badan.getBoundingClientRect().height) : null,
  };
})()`;

try {
  // Aktifkan domain Page supaya tangkapan layar dapat diambil.
  await new Promise((ok) => {
    nomor += 1;
    menunggu.set(nomor, () => ok());
    soket.send(JSON.stringify({ id: nomor, method: 'Page.enable' }));
  });

  await tunggu(6000); // tunggu React siap

  for (let langkah = 1; langkah <= 3; langkah += 1) {
    const hasil = await jalankan(UKUR);
    console.log('');
    console.log('='.repeat(72));
    console.log(`  LANGKAH ${langkah}`);
    console.log('='.repeat(72));
    console.log(JSON.stringify(hasil, null, 2));

    // Simpan gambar SETIAP langkah, supaya dapat diperiksa dengan mata.
    try {
      const jalur = await tangkapLayar(`langkah${langkah}`);
      console.log(`  gambar: ${jalur}`);
    } catch (e) {
      console.log(`  gambar gagal: ${e.message}`);
    }

    if (langkah < 3) {
      const ditekan = await jalankan(`(() => {
        const b = [...document.querySelectorAll('.resqy-tutorial-overlay button')]
          .find(x => (x.textContent||'').includes('LANJUTKAN'));
        if (!b) return 'tombol LANJUTKAN tidak ada';
        b.click();
        return 'ditekan';
      })()`);
      console.log(`  -> ${ditekan}`);
      await tunggu(1200);
    }
  }
} catch (e) {
  console.log('  GAGAL: ' + e.message);
} finally {
  try { soket.close(); } catch {}
  try { chrome.kill(); } catch {}
  try { rmSync(dir, { recursive: true, force: true }); } catch {}
}
process.exit(0);
