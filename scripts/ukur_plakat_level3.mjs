/**
 * Mengukur posisi plakat misi dan avatar pada peta Level 3.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * MENGAPA SKRIP INI ADA
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   Pada tangkapan layar laptop (1280px) terlihat avatar pemain MENUTUPI
 *   judul misi aktif:
 *
 *       "Job 1: Siny[AVATAR]us Normal"
 *
 *   Dua percobaan perbaikan sebelumnya GAGAL karena dilakukan tanpa
 *   pengukuran:
 *
 *     1. Menghapus `-translate-x-1/2` pada plakat TIDAK berpengaruh, karena
 *        wadah titik memakai `items-center` sehingga flexbox tetap
 *        memusatkan plakatnya.
 *     2. Menggeser avatar memerlukan lebar plakat yang berbeda-beda untuk
 *        setiap misi, dan tidak diketahui berapa nilainya.
 *
 *   Skrip ini mengukur, untuk SETIAP titik misi:
 *
 *       - kotak plakat  (x, y, lebar, tinggi)
 *       - kotak avatar  (x, y, lebar, tinggi)  bila titik itu aktif
 *       - APAKAH keduanya BERTUMPUK
 *
 *   Dengan angka itu, perbaikannya dapat dihitung, bukan ditebak.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * CARA MENJALANKAN
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   node scripts/ukur_plakat_level3.mjs [lebar] [tinggi]
 */
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const LEBAR = Number(process.argv[2] || 1280);
const TINGGI = Number(process.argv[3] || 800);
const PORT = 9700 + (LEBAR % 40);

const CHROME =
  process.env.CHROME_PATH ||
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const dir = mkdtempSync(join(tmpdir(), 'resq-plakat-'));
const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
  `--remote-debugging-port=${PORT}`, `--user-data-dir=${dir}`,
  '--window-size=1400,1000', 'about:blank',
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
soket.onmessage = (e) => {
  const p = JSON.parse(e.data);
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

// Pergeseran avatar yang diuji, dari argumen ketiga.
// Berguna untuk mencari nilai yang membuat avatar TIDAK lagi menutupi plakat.
const GESER = process.argv[4] || '0';

const UKUR = `(() => {
  const R = (e) => { const r = e.getBoundingClientRect();
    return { x: Math.round(r.left), y: Math.round(r.top),
             w: Math.round(r.width), h: Math.round(r.height),
             kanan: Math.round(r.right), bawah: Math.round(r.bottom) }; };

  // Setiap titik misi = pembungkus yang memuat tombol 64px
  const titik = [...document.querySelectorAll('div.absolute')]
    .filter(e => e.querySelector('button[title]'));

  // Terapkan pergeseran avatar untuk diuji
  if (${GESER} !== 0) {
    for (const t of titik) {
      const av = t.querySelector('.animate-bounce');
      // Animasi bounce menimpa properti transform, jadi pergeseran
      // diterapkan lewat properti top — properti itu tidak dianimasikan.
      if (av) av.style.top = 'calc(-5rem + ${GESER}px)';
    }
  }

  const hasil = [];
  for (const t of titik) {
    const tombol = t.querySelector('button[title]');
    const judulTombol = tombol ? (tombol.getAttribute('title') || '') : '';
    if (!judulTombol) continue;

    // Plakat = elemen dengan atribut aria-label "Buka materi ..."
    const plakatEl = t.querySelector('[aria-label^="Buka materi"]');
    const avatarEl = t.querySelector('.animate-bounce');

    const plakat = plakatEl ? R(plakatEl) : null;
    const avatar = avatarEl ? R(avatarEl) : null;

    let tumpang = false;
    let tumpangLuas = 0;
    if (plakat && avatar) {
      const ox = Math.max(0, Math.min(plakat.kanan, avatar.kanan) - Math.max(plakat.x, avatar.x));
      const oy = Math.max(0, Math.min(plakat.bawah, avatar.bawah) - Math.max(plakat.y, avatar.y));
      tumpangLuas = ox * oy;
      tumpang = ox > 0 && oy > 0;
    }

    hasil.push({
      misi: judulTombol.slice(0, 34),
      aktif: !!avatar,
      tombol: R(tombol),
      plakat, avatar,
      tumpang, tumpangLuas,
      // Berapa piksel avatar masuk ke dalam plakat, dari kiri
      masukKiri: plakat && avatar ? Math.max(0, avatar.x - plakat.x) : null,
      lebarAvatar: avatar ? avatar.w : null,
    });
  }
  // Posisi gulir peta diperlukan untuk menafsirkan koordinat layar:
  // plakat dan avatar diukur dalam koordinat LAYAR, bukan koordinat peta.
  const petaGulir = document.querySelector('[class*="overflow-x"]');
  const gulir = petaGulir ? Math.round(petaGulir.scrollLeft) : null;

  return { layar: window.innerWidth + 'x' + window.innerHeight,
           gulirPeta: gulir, titik: hasil };
})()`;

try {
  await cmd('Page.enable');
  await cmd('Emulation.setDeviceMetricsOverride', {
    width: LEBAR, height: TINGGI, deviceScaleFactor: 1, mobile: LEBAR < 700,
  });
  await cmd('Page.navigate', { url: 'http://localhost:4173/login' });
  await tunggu(4500);

  const user = { id:'tamu', username:'tamu', role:'student', name:'Petualang Tamu',
    absent_number:'0', classroom_code:'TAMU', school_name:'Mode Coba', unlocked_level:3 };
  const profil = { id:'tamu', name:'Petualang Tamu', username:'tamu', classroom_id:'TAMU',
    class_name:'Mode Coba', absent_number:'0', school_name:'Mode Coba',
    custom_avatar:{ skinTone:'#f5c9a6', hairStyle:'short', hairColor:'#3b2314', outfitColor:'#2563eb', accessory:'none' },
    progress:{ missionCompletedIds:[], mitigationScores:{} } };

  await nilai(`(() => {
    localStorage.setItem('resqbox-current-user', ${JSON.stringify(JSON.stringify(user))});
    localStorage.setItem('resqbox-student-profile', ${JSON.stringify(JSON.stringify(profil))});
    localStorage.setItem('resqbox-unlocked-level','3');
    localStorage.setItem('resqbox-unlocked-level_tamu','3');
    localStorage.setItem('resqbox-mode-tamu','1');
    const tur = ['login','dashboard_student','dashboard_teacher','profile','level1','level2','level3','workspace'];
    for (const t of tur) for (const u of ['tamu','guest'])
      localStorage.setItem('resqbox_tour_completed_' + t + '_' + u, 'true');
    return 1;
  })()`);

  await cmd('Emulation.setDeviceMetricsOverride', {
    width: LEBAR, height: TINGGI, deviceScaleFactor: 1, mobile: LEBAR < 700,
  });
  await cmd('Page.navigate', { url: 'http://localhost:4173/level3' });
  await tunggu(9000);

  const h = await nilai(UKUR);

  console.log('='.repeat(84));
  console.log(`  PLAKAT & AVATAR LEVEL 3 pada ${LEBAR}px   (layar ${h.layar})`);
  console.log('='.repeat(84));
  console.log('');
  console.log(`  ${'misi'.padEnd(30)} ${'plakat x,w'.padEnd(16)} ${'avatar x,w'.padEnd(14)} hasil`);
  console.log('  ' + '-'.repeat(80));

  let jumlahTumpang = 0;
  let maksMasuk = 0;
  for (const t of h.titik) {
    const p = t.plakat ? `${String(t.plakat.x).padStart(5)},${String(t.plakat.w).padStart(4)}` : '   -  ,  - ';
    const a = t.avatar ? `${String(t.avatar.x).padStart(5)},${String(t.avatar.w).padStart(4)}` : '   -  ,  - ';
    const status = t.tumpang ? `TUMPANG (${t.tumpangLuas}px2, avatar masuk ${t.masukKiri}px)` : (t.aktif ? 'aman' : '');
    if (t.tumpang) { jumlahTumpang += 1; maksMasuk = Math.max(maksMasuk, t.masukKiri || 0); }
    console.log(`  ${t.misi.padEnd(30)} ${p.padEnd(16)} ${a.padEnd(14)} ${status}`);
  }

  console.log('');
  console.log(`  posisi gulir peta    : ${h.gulirPeta}px`);
  console.log(`  titik misi diperiksa : ${h.titik.length}`);
  console.log(`  BERTUMPUK            : ${jumlahTumpang}`);
  if (jumlahTumpang > 0) {
    console.log(`  avatar masuk sedalam : ${maksMasuk}px dari tepi kiri plakat`);
  }

  // Lebar plakat untuk semua misi — berguna untuk menentukan perbaikan
  const lebar = h.titik.filter((t) => t.plakat).map((t) => t.plakat.w);
  if (lebar.length) {
    console.log(`  lebar plakat         : min ${Math.min(...lebar)}, maks ${Math.max(...lebar)}`);
  }
} catch (e) {
  console.log('  GAGAL: ' + e.message);
} finally {
  try { soket.close(); } catch {}
  try { chrome.kill(); } catch {}
  try { rmSync(dir, { recursive: true, force: true }); } catch {}
}
process.exit(0);
