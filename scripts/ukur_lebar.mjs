/**
 * Mengukur tata letak halaman pada lebar layar tertentu.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * MENGAPA SKRIP INI ADA
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   Pekerjaan "buat tata letak HP" tidak boleh dikerjakan dengan menebak.
 *   Skrip ini mengukur DUA hal untuk setiap halaman:
 *
 *     1. Apakah ada elemen yang MELUBER keluar layar (lebar isi > lebar layar)
 *     2. Elemen mana yang paling lebar dan paling tinggi
 *
 *   Dengan begitu, perbaikan dapat dibuktikan terukur — sebelum dan sesudah.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * MENGAPA MEMAKAI DEVTOOLS PROTOCOL
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   Chrome headless MENGABAIKAN `--window-size` di bawah 504px, sehingga
 *   pengukuran pada lebar HP selalu salah bila memakai cara itu.
 *
 *   `Emulation.setDeviceMetricsOverride` di DevTools Protocol memberikan
 *   lebar yang BENAR. Karena itu lebar HP hanya dapat dipercaya dengan cara
 *   ini — dan itulah sebabnya pemeriksaan tata letak sebelumnya melewatkan
 *   masalah di HP.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * CARA MENJALANKAN
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   node scripts/ukur_lebar.mjs <lebar> <halaman>
 *
 *   Contoh:
 *     node scripts/ukur_lebar.mjs 390 login
 *     node scripts/ukur_lebar.mjs 390 dashboard
 *     node scripts/ukur_lebar.mjs 820 level1
 *
 *   Halaman yang memerlukan masuk: dashboard, level1, level2, level3,
 *   workspace, profil, guru.
 */
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const LEBAR = Number(process.argv[2] || 390);
const HALAMAN = process.argv[3] || 'login';
const TINGGI = Number(process.argv[4] || Math.round(LEBAR * 2.16) || 844);

// Argumen kelima: 'tamu' untuk menyiapkan sesi tamu lebih dahulu.
// Diperlukan karena Dashboard, Level 1-3, Profil, dan Dashboard Guru
// melindungi halamannya — tanpa sesi, pengguna dilempar ke halaman masuk.
const SEBAGAI = process.argv[5] || '';

const RUTE = {
  login: '/login',
  dashboard: '/',
  level1: '/level1',
  level2: '/level2',
  level3: '/level3',
  workspace: '/workspace',
  profil: '/profile',
  guru: '/teacher',
  kredit: '/credits',
};

const ALAMAT = `http://localhost:4173${RUTE[HALAMAN] || '/login'}`;
const PORT_CDF = 9340 + (LEBAR % 50);

const CHROME =
  process.env.CHROME_PATH ||
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const dir = mkdtempSync(join(tmpdir(), 'resq-lebar-'));

const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    `--remote-debugging-port=${PORT_CDF}`,
    `--user-data-dir=${dir}`,
    '--window-size=1200,900',
    'about:blank',
  ],
  { stdio: 'ignore' }
);

async function cariSoket() {
  for (let i = 0; i < 40; i += 1) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT_CDF}/json/list`, {
        signal: AbortSignal.timeout(3000),
      });
      const daftar = await r.json();
      const t = daftar.find((x) => x.type === 'page');
      if (t?.webSocketDebuggerUrl) return t.webSocketDebuggerUrl;
    } catch {
      // belum siap
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error('DevTools tidak siap');
}

const soket = new WebSocket(await cariSoket());
await new Promise((ok, gagal) => {
  soket.onopen = ok;
  soket.onerror = gagal;
});

let nomor = 0;
const menunggu = new Map();
soket.onmessage = (ev) => {
  const p = JSON.parse(ev.data);
  if (p.id && menunggu.has(p.id)) {
    menunggu.get(p.id)(p);
    menunggu.delete(p.id);
  }
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
    expression: ekspresi,
    returnByValue: true,
    awaitPromise: true,
  });
  if (r.result?.subtype === 'error') throw new Error(r.result.description);
  return r.result?.value;
}

const tunggu = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Skrip pengukuran ──────────────────────────────────────────────────────
//
// MENGAPA TIDAK MELAPORKAN SEMUA ELEMEN YANG LEBIH LEBAR DARI LAYAR
//
//   Versi pertama melaporkan setiap elemen yang keluar layar, dan hasilnya
//   MENYESATKAN: pada halaman login ia melaporkan 28 elemen, tetapi hampir
//   semuanya adalah ORNAMEN SVG latar (ellipse, g, circle) yang memang
//   sengaja dibuat lebih besar daripada layar dan memang terpotong.
//
//   Yang benar-benar merugikan pengguna hanya dua hal:
//
//     1. Halaman dapat DIGESER MENDATAR — ini yang paling mengganggu
//     2. TOMBOL atau KOLOM ISI keluar layar — tidak dapat ditekan atau dibaca
//
//   Selain itu, SEBAGIAN BESAR orang tua memiliki `overflow: hidden`,
//   sehingga anaknya yang lebih besar TIDAK menyebabkan halaman dapat
//   digeser. Kasus seperti itu tidak perlu dilaporkan.
//
//   Karena itu yang diperiksa hanya elemen yang BENAR-BENAR penting:
//   tombol, tautan, kolom isi, dan elemen yang memuat teksnya sendiri.
const UKUR = `(() => {
  const W = window.innerWidth;
  const H = window.innerHeight;

  const leluhurMemotong = (e) => {
    let p = e.parentElement;
    while (p && p !== document.body) {
      const cs = getComputedStyle(p);
      if (cs.overflowX === 'hidden' || cs.overflowX === 'clip') return true;
      p = p.parentElement;
    }
    return false;
  };

  // Hanya unsur yang penting bagi pengguna
  const penting = 'button,a,input,select,textarea,[role="button"],table,th,td,h1,h2,h3,p,label';
  const masalah = [];
  for (const e of document.querySelectorAll(penting)) {
    const r = e.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) continue;      // tidak terlihat
    if (r.bottom < 0 || r.top > H) continue;         // di luar pandangan tegak
    const kanan = Math.round(r.right - W);
    const kiri = Math.round(-r.left);
    if (kanan <= 2 && kiri <= 2) continue;
    masalah.push({
      tag: e.tagName.toLowerCase(),
      teks: (e.textContent || '').trim().slice(0, 34),
      kelas: (typeof e.className === 'string' ? e.className : '').slice(0, 55),
      kiri, kanan,
      w: Math.round(r.width), h: Math.round(r.height),
      terpotong: leluhurMemotong(e),
    });
  }

  // Elemen terbesar yang benar-benar mengatur tata letak
  const terbesar = [...document.querySelectorAll('main,section,aside,header,footer,div')]
    .map(e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
      return { tag: e.tagName.toLowerCase(),
               kelas: (typeof e.className === 'string' ? e.className : '').slice(0, 52),
               w: Math.round(r.width), h: Math.round(r.height),
               atas: Math.round(r.top),
               anak: e.children.length,
               arah: cs.flexDirection, gulirY: cs.overflowY }; })
    .filter(x => x.w > 120 && x.h > 45 && x.anak > 1)
    .sort((a, b) => (b.w * b.h) - (a.w * a.h))
    .slice(0, 7);

  return {
    layar: W + 'x' + H,
    lebarDokumen: document.documentElement.scrollWidth,
    lebarIsi: document.body.scrollWidth,
    gulirMendatar: document.documentElement.scrollWidth > W + 2 ||
                   document.body.scrollWidth > W + 2,

    // ── APAKAH SEMUA MUAT DI LAYAR? ────────────────────────────────────
    //
    //  Tidak adanya gulir mendatar TIDAK berarti tata letaknya nyaman.
    //  Halaman dapat muat mendatar tetapi jauh lebih tinggi daripada layar,
    //  sehingga pengguna harus menggulir untuk mencapai tombol utama.
    //  Pada layar yang dipakai sambil berdiri atau sambil memegang perangkat,
    //  itu membuat aplikasi terasa tidak dirancang untuk perangkatnya.
    tinggiIsi: document.documentElement.scrollHeight,
    rasioTinggi: Number((document.documentElement.scrollHeight / H).toFixed(2)),
    perluGulirTegak: document.documentElement.scrollHeight > H + 8,

    // Seberapa banyak ruang terbuang di bagian atas sebelum isi dimulai,
    // dan berapa tinggi ruang kosong terbesar di dalam halaman.
    persenTerlihat: Math.round((H / document.documentElement.scrollHeight) * 100),

    jumlahMasalah: masalah.length,
    masalah: masalah.sort((a, b) => Math.max(b.kanan, b.kiri) - Math.max(a.kanan, a.kiri)).slice(0, 10),
    terbesar,
  };
})()`;

try {
  await perintah('Page.enable');

  // ── Menyiapkan sesi tamu bila diminta ──────────────────────────────────
  //
  //  Halaman Dashboard, Level 1-3, Profil, dan Dashboard Guru dilindungi:
  //  tanpa sesi, pengguna dilempar ke halaman masuk dan pengukurannya
  //  menjadi pengukuran halaman yang salah.
  //
  //  Nilai yang ditulis SAMA dengan yang ditulis `loginAsGuest()` di
  //  `teacherStore.ts`, sehingga keadaan yang diukur benar-benar mewakili
  //  tamu yang sesungguhnya.
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
    await perintah('Emulation.setDeviceMetricsOverride', {
      width: LEBAR, height: TINGGI, deviceScaleFactor: 1, mobile: LEBAR < 700,
    });
    // Buka origin dulu supaya localStorage dapat ditulis untuk domain itu.
    await perintah('Page.navigate', { url: 'http://localhost:4173/login' });
    await tunggu(4000);

    const awanTamu = {
      currentUser: {
        id: 'tamu', username: 'tamu', role: 'student', name: 'Petualang Tamu',
        absent_number: '0', classroom_code: 'TAMU', school_name: 'Mode Coba',
        unlocked_level: 3,
      },
      profil: {
        id: 'tamu', name: 'Petualang Tamu', username: 'tamu',
        classroom_id: 'TAMU', class_name: 'Mode Coba (tanpa akun)',
        absent_number: '0', school_name: 'Mode Coba',
        custom_avatar: {
          skinTone: '#f5c9a6', hairStyle: 'short', hairColor: '#3b2314',
          outfitColor: '#2563eb', accessory: 'none',
        },
        progress: { missionCompletedIds: [], mitigationScores: {} },
      },
    };

    await nilai(`(() => {
      localStorage.setItem('resqbox-current-user', ${JSON.stringify(JSON.stringify(awanTamu.currentUser))});
      localStorage.setItem('resqbox-student-profile', ${JSON.stringify(JSON.stringify(awanTamu.profil))});
      localStorage.setItem('resqbox-unlocked-level', '3');
      localStorage.setItem('resqbox-unlocked-level_tamu', '3');
      localStorage.setItem('resqbox-mode-tamu', '1');
      // Tandai SELURUH panduan sudah selesai. Tanpa ini, panduan muncul
      // sendiri (autoStart) dan MENUTUPI halaman — sehingga yang terukur
      // adalah panduannya, bukan halamannya.
      const tur = ['login','dashboard_student','dashboard_teacher','profile',
                   'level1','level2','level3','workspace'];
      for (const t of tur) for (const u of ['tamu','guest']) {
        localStorage.setItem('resqbox_tour_completed_' + t + '_' + u, 'true');
      }
      return 'sesi tamu + panduan ditandai selesai';
    })()`);
  }

  await perintah('Emulation.setDeviceMetricsOverride', {
    width: LEBAR,
    height: TINGGI,
    deviceScaleFactor: 1,
    mobile: LEBAR < 700,
  });
  await perintah('Page.navigate', { url: ALAMAT });
  await tunggu(8000);

  // Pastikan tidak dilempar ke halaman masuk tanpa disadari.
  const urlAkhir = await nilai('location.pathname');
  if (urlAkhir !== (RUTE[HALAMAN] || '/login')) {
    console.log(`  PERHATIAN: dialihkan ke "${urlAkhir}" — sesi mungkin tidak cukup.`);
    console.log(`             pengukuran berikut adalah halaman "${urlAkhir}", bukan "${HALAMAN}".`);
    console.log('');
  }

  const hasil = await nilai(UKUR);

  console.log('='.repeat(78));
  console.log(`  ${HALAMAN.toUpperCase()}  pada lebar ${LEBAR}px  (${ALAMAT})`);
  console.log('='.repeat(78));
  console.log(`  layar terlihat    : ${hasil.layar}`);
  console.log(`  lebar dokumen     : ${hasil.lebarDokumen}px   isi: ${hasil.lebarIsi}px`);
  console.log(`  GULIR MENDATAR?   : ${hasil.gulirMendatar ? 'YA  <-- MASALAH' : 'tidak'}`);
  console.log(`  tinggi isi        : ${hasil.tinggiIsi}px  (${hasil.rasioTinggi}x tinggi layar)`);
  console.log(`  terlihat sekaligus: ${hasil.persenTerlihat}%  ${hasil.perluGulirTegak ? '<-- perlu digulir' : '(muat)'}`);
  console.log(`  tombol/teks keluar layar : ${hasil.jumlahMasalah}`);

  if (hasil.masalah?.length) {
    console.log('');
    console.log('  ── Tombol / teks yang keluar layar ──');
    for (const m of hasil.masalah) {
      const arah = m.kanan > 2 ? `kanan +${m.kanan}px` : `kiri +${m.kiri}px`;
      const potong = m.terpotong ? ' [dipotong leluhur]' : '';
      console.log(`    ${arah.padEnd(15)} w=${String(m.w).padStart(4)}  ${m.tag}${potong}`);
      if (m.teks) console.log(`        "${m.teks}"`);
      if (m.kelas) console.log(`        ${m.kelas}`);
    }
  }

  if (hasil.terbesar?.length) {
    console.log('');
    console.log('  ── Elemen terbesar (kandidat utama penata ulang) ──');
    for (const t of hasil.terbesar) {
      console.log(`    w=${String(t.w).padStart(5)} h=${String(t.h).padStart(5)} atas=${String(t.atas).padStart(5)}  ${t.tag}.${t.kelas}`);
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
