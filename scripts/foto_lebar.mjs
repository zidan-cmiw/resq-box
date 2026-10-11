/**
 * Mengambil tangkapan layar setiap halaman pada lebar tertentu.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * MENGAPA SKRIP INI ADA
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   Angka pengukuran dapat memberi tahu ADA yang salah, tetapi tidak dapat
 *   memberi tahu APA YANG TERASA TIDAK NYAMAN. Untuk merancang tata letak HP,
 *   layarnya harus DILIHAT.
 *
 *   Skrip ini memakai DevTools Protocol karena Chrome headless MENGABAIKAN
 *   `--window-size` di bawah 504px — sehingga tangkapan layar "390px" dengan
 *   cara biasa sebenarnya memperlihatkan halaman berlebar 504px yang
 *   dipotong, dan itu menyesatkan.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * CARA MENJALANKAN
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   node scripts/foto_lebar.mjs <lebar> <halaman> [tamu]
 *
 *   Contoh:
 *     node scripts/foto_lebar.mjs 390 dashboard tamu
 *     node scripts/foto_lebar.mjs 390 level1 tamu
 *     node scripts/foto_lebar.mjs 820 level3 tamu
 */
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const LEBAR = Number(process.argv[2] || 390);
const HALAMAN = process.argv[3] || 'dashboard';
const SEBAGAI = process.argv[4] || 'tamu';
const TINGGI = Number(process.argv[5] || Math.round(LEBAR * 2.16));

const RUTE = {
  login: '/login', dashboard: '/', level1: '/level1', level2: '/level2',
  level3: '/level3', workspace: '/workspace', profil: '/profile',
  guru: '/teacher', kredit: '/credits',
};

const PORT_CDF = 9400 + (LEBAR % 60) + HALAMAN.length;

const CHROME =
  process.env.CHROME_PATH ||
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const dir = mkdtempSync(join(tmpdir(), 'resq-foto-'));

const chrome = spawn(
  CHROME,
  [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
    `--remote-debugging-port=${PORT_CDF}`, `--user-data-dir=${dir}`,
    '--window-size=1200,900', 'about:blank',
  ],
  { stdio: 'ignore' }
);

async function cariSoket() {
  for (let i = 0; i < 40; i += 1) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT_CDF}/json/list`, {
        signal: AbortSignal.timeout(3000),
      });
      const t = (await r.json()).find((x) => x.type === 'page');
      if (t?.webSocketDebuggerUrl) return t.webSocketDebuggerUrl;
    } catch { /* belum siap */ }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error('DevTools tidak siap');
}

const soket = new WebSocket(await cariSoket());
await new Promise((ok, gagal) => { soket.onopen = ok; soket.onerror = gagal; });

let nomor = 0;
const menunggu = new Map();
soket.onmessage = (ev) => {
  const p = JSON.parse(ev.data);
  if (p.id && menunggu.has(p.id)) { menunggu.get(p.id)(p); menunggu.delete(p.id); }
};

function perintah(method, params = {}) {
  nomor += 1;
  const id = nomor;
  return new Promise((selesai, gagal) => {
    menunggu.set(id, (p) => (p.error ? gagal(new Error(JSON.stringify(p.error))) : selesai(p.result)));
    soket.send(JSON.stringify({ id, method, params }));
  });
}

async function nilai(ekspresi) {
  const r = await perintah('Runtime.evaluate', {
    expression: ekspresi, returnByValue: true, awaitPromise: true,
  });
  return r.result?.value;
}

const tunggu = (ms) => new Promise((r) => setTimeout(r, ms));

try {
  await perintah('Page.enable');
  await perintah('Emulation.setDeviceMetricsOverride', {
    width: LEBAR, height: TINGGI, deviceScaleFactor: 2, mobile: LEBAR < 700,
  });

// ── SESI GURU ──────────────────────────────────────────────────────────
  //
  //  `TeacherGuard` hanya memeriksa `currentUser?.role === 'teacher'`, jadi
  //  Dashboard Guru dapat diukur dengan menuliskan sesi guru ke localStorage.
  //  TIDAK ada data murid yang dibuat — halaman akan tampil dengan daftar
  //  kosong, dan yang diukur adalah TATA LETAKNYA, bukan datanya.
  if (SEBAGAI === 'guru' || SEBAGAI === 'teacher') {
    await perintah('Emulation.setDeviceMetricsOverride', {
      width: LEBAR, height: TINGGI, deviceScaleFactor: 1, mobile: LEBAR < 700,
    });
    await perintah('Page.navigate', { url: 'http://localhost:4173/login' });
    await tunggu(4000);

    const guru = {
      id: 'guru-uji', username: 'guru', role: 'teacher', name: 'Bu Tyas',
      absent_number: '', classroom_code: 'GURU', school_name: 'SMP Uji',
      unlocked_level: 3,
    };
    await nilai(`(() => {
      localStorage.setItem('resqbox-current-user', ${JSON.stringify(JSON.stringify(guru))});
      localStorage.setItem('resqbox-unlocked-level', '3');
      const tur = ['login','dashboard_student','dashboard_teacher','profile',
                   'level1','level2','level3','workspace'];
      for (const t of tur) for (const u of ['tamu','guest','guru-uji']) {
        localStorage.setItem('resqbox_tour_completed_' + t + '_' + u, 'true');
      }
      return 'sesi guru disiapkan';
    })()`);
  }

  if (SEBAGAI === 'tamu') {
    await perintah('Page.navigate', { url: 'http://localhost:4173/login' });
    await tunggu(4500);
    const user = {
      id: 'tamu', username: 'tamu', role: 'student', name: 'Petualang Tamu',
      absent_number: '0', classroom_code: 'TAMU', school_name: 'Mode Coba',
      unlocked_level: 3,
    };
    const profil = {
      id: 'tamu', name: 'Petualang Tamu', username: 'tamu',
      classroom_id: 'TAMU', class_name: 'Mode Coba (tanpa akun)',
      absent_number: '0', school_name: 'Mode Coba',
      custom_avatar: {
        skinTone: '#f5c9a6', hairStyle: 'short', hairColor: '#3b2314',
        outfitColor: '#2563eb', accessory: 'none',
      },
      progress: { missionCompletedIds: [], mitigationScores: {} },
    };
    await nilai(`(() => {
      localStorage.setItem('resqbox-current-user', ${JSON.stringify(JSON.stringify(user))});
      localStorage.setItem('resqbox-student-profile', ${JSON.stringify(JSON.stringify(profil))});
      localStorage.setItem('resqbox-unlocked-level', '3');
      localStorage.setItem('resqbox-unlocked-level_tamu', '3');
      localStorage.setItem('resqbox-mode-tamu', '1');

      // ── Tandai SELURUH panduan sudah selesai ─────────────────────────────
      //
      //  MENGAPA INI WAJIB SEBELUM MENGUKUR
      //
      //    ResqyTutorialOverlay memiliki autoStart = true, sehingga pada
      //    kunjungan pertama panduan MUNCUL SENDIRI dan MENUTUPI SELURUH
      //    LAYAR — di HP ia menempati hampir seluruh layar.
      //
      //    Tanpa menandainya selesai, yang diukur adalah PANDUANNYA, bukan
      //    halamannya. Pengukuran pertama melaporkan Dashboard
      //    "100% muat, 0 masalah" — dan itu keliru, karena yang terlihat
      //    saat itu adalah lapisan panduan di atasnya.
      //
      //  Kunci dibentuk oleh setTutorialCompleted() di tutorialConfig.ts:
      //      resqbox_tour_completed_<tur>_<userId>
      const tur = ['login','dashboard_student','dashboard_teacher','profile',
                   'level1','level2','level3','workspace'];
      const id = ['tamu','guest'];
      let n = 0;
      for (const t of tur) for (const u of id) {
        localStorage.setItem('resqbox_tour_completed_' + t + '_' + u, 'true');
        n++;
      }
      return 'sesi tamu + ' + n + ' panduan ditandai selesai';
    })()`);
  }

  await perintah('Emulation.setDeviceMetricsOverride', {
    width: LEBAR, height: TINGGI, deviceScaleFactor: 2, mobile: LEBAR < 700,
  });
  await perintah('Page.navigate', { url: `http://localhost:4173${RUTE[HALAMAN] || '/'}` });
  await tunggu(9000);

  const r = await perintah('Page.captureScreenshot', { format: 'png' });
  const jalur = join(process.env.TEMP || '.', `layar-${HALAMAN}-${LEBAR}.png`);
  writeFileSync(jalur, Buffer.from(r.data, 'base64'));
  console.log(`  ${HALAMAN} @ ${LEBAR}px  ->  ${jalur}`);
} catch (e) {
  console.log('  GAGAL: ' + e.message);
} finally {
  try { soket.close(); } catch {}
  try { chrome.kill(); } catch {}
  try { rmSync(dir, { recursive: true, force: true }); } catch {}
}
process.exit(0);
