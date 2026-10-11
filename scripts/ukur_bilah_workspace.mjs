/**
 * Mengukur elemen-elemen di bilah atas Workspace pada lebar tertentu.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * MENGAPA SKRIP INI ADA
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   Pada tangkapan layar HP (390px), tombol paling kiri di bilah atas
 *   Workspace terbaca "Ruan..." — teksnya terpotong dengan elipsis.
 *
 *   Teks aslinya adalah "Ruang Simulasi Sandbox", dan elemennya sudah memakai
 *   `truncate` beserta `min-w-0`. Jadi pemotongan itu memang disengaja — yang
 *   perlu diketahui adalah BERAPA LEBAR yang didapat elemen itu, dan elemen
 *   mana yang memakan sisanya.
 *
 *   Tanpa angka itu, perbaikannya hanya menebak.
 *
 * CARA MENJALANKAN
 *   node scripts/ukur_bilah_workspace.mjs [lebar] [tinggi]
 */
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const LEBAR = Number(process.argv[2] || 390);
const TINGGI = Number(process.argv[3] || 844);
const PORT = 9800 + (LEBAR % 40);

const CHROME =
  process.env.CHROME_PATH ||
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const dir = mkdtempSync(join(tmpdir(), 'resq-bilah-'));
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

const UKUR = `(() => {
  // Bilah atas Workspace = wadah yang memuat judul misi
  const judul = [...document.querySelectorAll('h1')]
    .find(e => (e.textContent || '').includes('Ruang Simulasi')
            || (e.textContent || '').includes('Sandbox')
            || (e.textContent || '').length > 3 && e.closest('header,div'));
  const bilah = judul ? judul.closest('div[class*="border"]')?.parentElement?.parentElement : null;

  const R = (e) => {
    if (!e) return null;
    const r = e.getBoundingClientRect();
    const cs = getComputedStyle(e);
    return {
      w: Math.round(r.width), h: Math.round(r.height),
      x: Math.round(r.left),
      teks: (e.textContent || '').trim().slice(0, 40),
      terpotong: e.scrollWidth > e.clientWidth + 1,
      butuhLebar: e.scrollWidth,
      dapatLebar: e.clientWidth,
    };
  };

  // Ukur seluruh anak bilah atas
  const anak = bilah ? [...bilah.children].map(R) : [];

  // Ukur juga seluruh isi DI DALAM baris judul, untuk mengetahui elemen mana
  // yang memakan ruang sehingga judulnya terpotong.
  const barisJudul = judul ? judul.parentElement : null;
  const isiJudul = barisJudul ? [...barisJudul.children].map(R) : [];
  const kartuJudul = barisJudul ? barisJudul.parentElement : null;

  return {
    layar: window.innerWidth + 'x' + window.innerHeight,
    judul: R(judul),
    kartuJudul: R(kartuJudul),
    barisJudul: R(barisJudul),
    isiJudul,
    anakBilah: anak,
  };
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
  await cmd('Page.navigate', { url: 'http://localhost:4173/workspace' });
  await tunggu(9000);

  const h = await nilai(UKUR);

  console.log('='.repeat(78));
  console.log(`  BILAH ATAS WORKSPACE pada ${LEBAR}px   (layar ${h.layar})`);
  console.log('='.repeat(78));
  console.log('');
  if (h.judul) {
    console.log(`  judul misi : "${h.judul.teks}"`);
    console.log(`      lebar didapat : ${h.judul.dapatLebar}px`);
    console.log(`      lebar dibutuh : ${h.judul.butuhLebar}px`);
    console.log(`      TERPOTONG     : ${h.judul.terpotong ? 'YA' : 'tidak'}`);
  } else {
    console.log('  judul misi tidak ditemukan');
  }
  console.log('');
  console.log('');
  console.log(`  kartu judul : w=${h.kartuJudul?.w}`);
  console.log(`  baris judul : w=${h.barisJudul?.w}`);
  console.log('  isi baris judul:');
  for (const a of (h.isiJudul || [])) {
    if (!a) continue;
    console.log(`      w=${String(a.w).padStart(4)} dapat=${String(a.dapatLebar).padStart(4)} butuh=${String(a.butuhLebar).padStart(4)}${a.terpotong ? ' TERPOTONG' : ''}  "${a.teks}"`);
  }
  console.log('');
  console.log(`  anak bilah atas : ${h.anakBilah.length}`);
  for (const a of h.anakBilah) {
    if (!a) continue;
    console.log(`      w=${String(a.w).padStart(4)} x=${String(a.x).padStart(4)}  "${a.teks}"`);
  }
} catch (e) {
  console.log('  GAGAL: ' + e.message);
} finally {
  try { soket.close(); } catch {}
  try { chrome.kill(); } catch {}
  try { rmSync(dir, { recursive: true, force: true }); } catch {}
}
process.exit(0);
