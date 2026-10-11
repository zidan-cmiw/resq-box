/**
 * Mengukur kotak-kotak HUD Level 1 pada lebar tertentu, untuk mencari
 * tata letak yang TIDAK BERTUMPUK.
 *
 * MENGAPA SKRIP INI ADA
 *
 *   Menempatkan elemen HUD dengan menebak nilai `top` menghasilkan tumpang
 *   tindih: telemetri yang dipindah ke `top-[58px]` masih menimpa pil
 *   "PERMUKAAN BUMI", karena pil itu ternyata berakhir lebih rendah daripada
 *   perkiraan.
 *
 *   Skrip ini mengukur kotak NYATA setiap bagian HUD, lalu MEMERIKSA
 *   apakah ada yang saling menimpa secara tegak. Dengan begitu nilai `top`
 *   dapat dipilih dari angka, bukan dari perkiraan.
 *
 * CARA MENJALANKAN
 *   node scripts/ukur_hud_level1.mjs [lebar] [tinggi]
 */
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const LEBAR = Number(process.argv[2] || 390);
const TINGGI = Number(process.argv[3] || 844);
const PORT = 9600 + (LEBAR % 40);

const CHROME =
  process.env.CHROME_PATH ||
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const dir = mkdtempSync(join(tmpdir(), 'resq-hud-'));
const chrome = spawn(CHROME, [
  '--headless=new','--disable-gpu','--no-sandbox','--hide-scrollbars',
  `--remote-debugging-port=${PORT}`, `--user-data-dir=${dir}`,
  '--window-size=1200,900','about:blank',
], { stdio: 'ignore' });

const tunggu = (ms) => new Promise((r) => setTimeout(r, ms));

async function cari() {
  for (let i = 0; i < 40; i += 1) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/list`, { signal: AbortSignal.timeout(3000) });
      const t = (await r.json()).find((x) => x.type === 'page');
      if (t?.webSocketDebuggerUrl) return t.webSocketDebuggerUrl;
    } catch { /* belum siap */ }
    await tunggu(500);
  }
  throw new Error('DevTools tidak siap');
}

const soket = new WebSocket(await cari());
await new Promise((ok, g) => { soket.onopen = ok; soket.onerror = g; });
let n = 0; const peta = new Map();
soket.onmessage = (e) => { const p = JSON.parse(e.data); if (p.id && peta.has(p.id)) { peta.get(p.id)(p); peta.delete(p.id); } };
const cmd = (m, pr = {}) => { n += 1; const id = n; return new Promise((s, g) => { peta.set(id, (p) => (p.error ? g(new Error(JSON.stringify(p.error))) : s(p.result))); soket.send(JSON.stringify({ id, method: m, params: pr })); }); };
const nilai = async (x) => (await cmd('Runtime.evaluate', { expression: x, returnByValue: true, awaitPromise: true })).result?.value;

try {
  await cmd('Page.enable');
  await cmd('Emulation.setDeviceMetricsOverride', { width: LEBAR, height: TINGGI, deviceScaleFactor: 1, mobile: LEBAR < 700 });
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

  await cmd('Emulation.setDeviceMetricsOverride', { width: LEBAR, height: TINGGI, deviceScaleFactor: 1, mobile: LEBAR < 700 });
  await cmd('Page.navigate', { url: 'http://localhost:4173/level1' });
  await tunggu(9000);

  const hasil = await nilai(`(() => {
    const kotak = (nama, e) => {
      if (!e) return { nama, ada: false };
      const r = e.getBoundingClientRect();
      return { nama, ada: true, x: Math.round(r.left), y: Math.round(r.top),
               w: Math.round(r.width), h: Math.round(r.height),
               bawah: Math.round(r.bottom), kanan: Math.round(r.right) };
    };
    const cari = (teks) => [...document.querySelectorAll('div,span,button')]
      .find(e => (e.textContent||'').trim().startsWith(teks) && e.getBoundingClientRect().height > 8);

    const semua = [
      kotak('MENU (baris tombol kiri)', document.querySelector('button[title="Kembali ke Menu Utama"]')?.closest('div')),
      kotak('PIL STRATA (PERMUKAAN BUMI)', cari('PERMUKAAN')),
      // Kotak yang benar-benar memuat nama lapisan, dicari lewat kelasnya
      kotak('PIL STRATA (kelas)', (() => {
        const s = document.querySelector('span.uppercase.tracking-wider');
        return s ? s.closest('div') : null;
      })()),
      kotak('TELEMETRI', document.querySelector('div[class*="fixed"][class*="top-"] span')?.closest('div[class*="flex"]')),
      kotak('TOMBOL RADAR', document.querySelector('button[title="Buka Radar Bumi"]')),
    ].filter(k => k.ada);

    // Periksa tumpang tindih TEGAK antara kotak-kotak penting
    const tumpang = [];
    for (let i = 0; i < semua.length; i++) for (let j = i + 1; j < semua.length; j++) {
      const a = semua[i], b = semua[j];
      const tegak = a.y < b.bawah && b.y < a.bawah;
      const datar = a.x < b.kanan && b.x < a.kanan;
      if (tegak && datar) tumpang.push(a.nama + '  X  ' + b.nama);
    }

    return { layar: window.innerWidth + 'x' + window.innerHeight, kotak: semua, tumpang };
  })()`);

  console.log('='.repeat(76));
  console.log(`  HUD LEVEL 1 pada ${LEBAR}px`);
  console.log('='.repeat(76));
  console.log(`  layar: ${hasil.layar}`);
  console.log('');
  for (const k of hasil.kotak) {
    console.log(`  ${k.nama}`);
    console.log(`      x=${String(k.x).padStart(4)} y=${String(k.y).padStart(4)} w=${String(k.w).padStart(4)} h=${String(k.h).padStart(4)}  (bawah ${k.bawah}, kanan ${k.kanan})`);
  }
  console.log('');
  if (hasil.tumpang.length) {
    console.log(`  [X] TUMPANG TINDIH: ${hasil.tumpang.length}`);
    for (const t of hasil.tumpang) console.log(`      ${t}`);
  } else {
    console.log('  [v] Tidak ada kotak HUD yang bertumpuk.');
  }
} catch (e) {
  console.log('  GAGAL: ' + e.message);
} finally {
  try { soket.close(); } catch {}
  try { chrome.kill(); } catch {}
  try { rmSync(dir, { recursive: true, force: true }); } catch {}
}
process.exit(0);
