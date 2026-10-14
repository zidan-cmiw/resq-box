// ── scripts/lihat_halaman.mjs ────────────────────────────────────────────────
// Memotret halaman aplikasi yang SEDANG BERJALAN, dan dapat menekan tombol
// terlebih dahulu. Tanpa memasang apa pun: memakai Edge yang sudah ada di
// Windows, dikendalikan lewat CDP dengan WebSocket bawaan Node.
//
// ═══════════════════════════════════════════════════════════════════════════
// MENGAPA SKRIP INI ADA
// ═══════════════════════════════════════════════════════════════════════════
//
//   Banyak cacat tampilan TIDAK DAPAT ditemukan dengan membaca kode. Tiga kali
//   ilustrasi konveksi salah dan ketiganya lolos typecheck, tes, dan lint. Pada
//   tutorial blok, panah langkah kedua jatuh di luar layar - dan komentar di
//   kodenya justru berbunyi benar, yang keliru adalah aturannya sendiri.
//
//   Skrip ini menutup celah itu: menjalankan aplikasinya, memotret layarnya, dan
//   menyimpan gambarnya untuk diperiksa dengan mata.
//
// ═══════════════════════════════════════════════════════════════════════════
// CARA PAKAI
// ═══════════════════════════════════════════════════════════════════════════
//
//   1. Jalankan server dev di terminal lain:
//          npm run dev                     (catat portnya, mis. 5174)
//
//   2. Jalankan Edge dengan port debug (sekali saja, biarkan tetap hidup):
//          msedge --headless=new --disable-gpu --remote-debugging-port=9222 \
//                 --user-data-dir=%TEMP%\edge-verif --window-size=1440,900 \
//                 http://localhost:5174/
//
//   3. Potret halaman:
//          node scripts/lihat_halaman.mjs /level2 --tekan "LANJUTKAN,LANJUTKAN,SAYA MENGERTI"
//
//      Opsi:
//        --tekan "A,B,C"   tekan tombol yang teksnya memuat A, lalu B, lalu C
//        --nama namafile  nama berkas keluaran (tanpa .png)
//        --ukur "SELECTOR" cetak posisi & ukuran elemen yang cocok, di layar
//
//   Gambar disimpan di direktori sementara.
//
// CATATAN: halaman yang butuh masuk sebagai siswa memerlukan sesi tersemai di
// profil Edge tersebut. Jangan menyemainya lewat berkas di `public/` yang
// tertinggal - itu pintu masuk sesi. Hapus setelah dipakai.

const CDP = process.env.RESQ_CDP || 'http://127.0.0.1:9222';
const PORT = process.env.RESQ_PORT || '5174';

// ── Argumen ───────────────────────────────────────────────────────────────
const arg = process.argv.slice(2);
const rute = arg[0] || '/';
const ambilOpsi = (nama) => {
  const i = arg.indexOf(nama);
  return i >= 0 ? arg[i + 1] : undefined;
};
const daftarTekan = (ambilOpsi('--tekan') || '').split(',').map((t) => t.trim()).filter(Boolean);
const namaKeluar = ambilOpsi('--nama') || ('halaman' + rute.replace(/[^a-z0-9]+/gi, '-'));
const ukurSelector = ambilOpsi('--ukur');

if (arg.includes('--bantuan') || arg.includes('-h')) {
  console.log('Pakai: node scripts/lihat_halaman.mjs <rute> [--tekan "A,B"] [--nama nama] [--ukur "selector"]');
  process.exit(0);
}

const tidur = (ms) => new Promise((r) => setTimeout(r, ms));
const { writeFileSync } = await import('node:fs');
const { tmpdir } = await import('node:os');
const { join } = await import('node:path');

// ── Sambung ke Edge ───────────────────────────────────────────────────────
let target;
try {
  const daftar = await (await fetch(`${CDP}/json`)).json();
  target = daftar.find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
} catch (e) {
  console.error('Tidak dapat menyambung ke Edge di ' + CDP);
  console.error('Jalankan Edge dengan --remote-debugging-port=9222 lebih dulu (lihat --bantuan).');
  process.exit(1);
}
if (!target) {
  console.error('Tidak ada target halaman di CDP.');
  process.exit(1);
}

const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((ok, gagal) => {
  ws.onopen = ok;
  ws.onerror = () => gagal(new Error('gagal menyambung ke CDP'));
});

let no = 0;
const tunggu = new Map();
ws.onmessage = (e) => {
  const p = JSON.parse(e.data);
  const j = tunggu.get(p.id);
  if (j) {
    tunggu.delete(p.id);
    j(p);
  }
};
const kirim = (method, params = {}) =>
  new Promise((selesai, gagal) => {
    const id = ++no;
    tunggu.set(id, (p) => (p.error ? gagal(new Error(p.error.message)) : selesai(p.result)));
    ws.send(JSON.stringify({ id, method, params }));
    setTimeout(() => {
      if (tunggu.has(id)) {
        tunggu.delete(id);
        gagal(new Error(method + ': waktu habis'));
      }
    }, 30000);
  });
const nilai = async (ekspresi) =>
  (await kirim('Runtime.evaluate', { expression: ekspresi, returnByValue: true, awaitPromise: true }))
    ?.result?.value;

// ── Buka halaman ──────────────────────────────────────────────────────────
console.log('Membuka http://localhost:' + PORT + rute);
await kirim('Page.navigate', { url: `http://localhost:${PORT}${rute}` });
await tidur(9000);

// ── Tekan tombol berurutan ────────────────────────────────────────────────
for (const teks of daftarTekan) {
  const hasil = await nilai(`(() => {
    const b = [...document.querySelectorAll('button')]
      .filter((x) => !x.disabled && x.offsetParent !== null)
      .find((x) => (x.textContent || '').toUpperCase().includes(${JSON.stringify(teks)}.toUpperCase()));
    if (!b) return 'TIDAK DITEMUKAN';
    b.click();
    return 'ditekan';
  })()`);
  console.log('  tekan "' + teks + '": ' + hasil);
  if (hasil === 'TIDAK DITEMUKAN') {
    const ada = await nilai(
      `[...document.querySelectorAll('button')].filter((b) => b.offsetParent !== null).map((b) => (b.textContent||'').trim().slice(0,28)).filter(Boolean).slice(0,20)`,
    );
    console.log('  tombol yang tersedia: ' + JSON.stringify(ada));
  }
  await tidur(1800);
}
await tidur(2500);

// ── Ukur elemen, bila diminta ─────────────────────────────────────────────
if (ukurSelector) {
  const hasil = await nilai(`(() => {
    const el = [...document.querySelectorAll(${JSON.stringify(ukurSelector)})];
    return {
      jumlah: el.length,
      layar: { l: window.innerWidth, t: window.innerHeight },
      kotak: el.slice(0, 12).map((e) => {
        const r = e.getBoundingClientRect();
        return {
          teks: (e.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 30),
          x: Math.round(r.x), y: Math.round(r.y),
          w: Math.round(r.width), h: Math.round(r.height),
          diluarLayar: r.x < 0 || r.y < 0 || r.right > window.innerWidth || r.bottom > window.innerHeight,
        };
      }),
    };
  })()`);
  console.log('  layar ' + hasil.layar.l + 'x' + hasil.layar.t + ', cocok ' + hasil.jumlah + ' elemen:');
  for (const k of hasil.kotak) {
    console.log(
      '    "' + k.teks + '"  x=' + k.x + ' y=' + k.y + ' w=' + k.w + ' h=' + k.h +
        (k.diluarLayar ? '  >>> DI LUAR LAYAR <<<' : ''),
    );
  }
}

// ── Potret ────────────────────────────────────────────────────────────────
const potret = await kirim('Page.captureScreenshot', { format: 'png' });
const jalur = join(tmpdir(), namaKeluar + '.png');
writeFileSync(jalur, Buffer.from(potret.data, 'base64'));
console.log('Gambar: ' + jalur);

ws.close();
