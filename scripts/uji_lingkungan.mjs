/**
 * Uji pengenalan lingkungan: website atau aplikasi?
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * MENGAPA UJI INI PENTING
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   Blok tombol unduh hanya boleh tampil di WEBSITE. Bila pengenalannya
 *   salah di aplikasi Android, pengguna yang sudah memasang aplikasi akan
 *   ditawari mengunduh aplikasi itu lagi — membingungkan.
 *
 *   Sebaliknya, bila pengenalannya salah di website, tombol unduhnya hilang
 *   dan tidak ada seorang pun yang dapat menemukan aplikasinya. Itu kerugian
 *   yang lebih besar.
 *
 *   Karena itu setiap tanda diuji SENDIRI-SENDIRI, bukan hanya gabungannya.
 *   Tanda yang tidak pernah diuji berarti tidak diketahui apakah bekerja.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * CARA MENJALANKAN
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   node scripts/uji_lingkungan.mjs
 */
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const AKAR = resolve(dirname(fileURLToPath(import.meta.url)), '..');

let lulus = 0;
let gagal = 0;

function uji(nama, hasil, harapan) {
  const ok = hasil === harapan;
  if (ok) {
    lulus += 1;
    console.log(`  [v] ${nama}`);
  } else {
    gagal += 1;
    console.log(`  [X] ${nama}`);
    console.log(`      diharapkan: ${harapan}   hasil: ${hasil}`);
  }
}

/**
 * Memuat modul ulang dengan `window` dan `navigator` tiruan.
 *
 * CATATAN: di Node 24, `navigator` dan `window` hanya memiliki GETTER,
 * sehingga penugasan biasa gagal dengan "Cannot set property navigator of
 * #<Object> which has only a getter". Karena itu dipakai
 * `Object.defineProperty`.
 */
async function denganLingkungan({ hostname, port = '', userAgent, capacitor }, fn) {
  const punyaWindow = 'window' in globalThis;
  const punyaNavigator = 'navigator' in globalThis;
  const windowLama = globalThis.window;
  const navigatorLama = globalThis.navigator;

  const pasang = (nama, nilai) => {
    Object.defineProperty(globalThis, nama, {
      value: nilai,
      configurable: true,
      writable: true,
    });
  };

  const skema = hostname === 'resq-box.pages.dev' ? 'https' : 'http';
  const hos = port ? `${hostname}:${port}` : hostname;

  pasang('window', {
    location: {
      hostname,
      port,
      href: `${skema}://${hos}/`,
    },
    ...(capacitor ? { Capacitor: capacitor } : {}),
  });
  pasang('navigator', { userAgent });

  // Modul sudah dimuat sekali; panggil fungsinya dengan lingkungan baru.
  const modul = await import(
    pathToFileURL(join(AKAR, 'src', 'utils', 'lingkungan.ts')).href
  );
  try {
    return fn(modul);
  } finally {
    if (punyaWindow) pasang('window', windowLama);
    else delete globalThis.window;
    if (punyaNavigator) pasang('navigator', navigatorLama);
    else delete globalThis.navigator;
  }
}

const UA_WEB_DESKTOP =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36';
const UA_WEB_IPAD =
  'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) AppleWebKit/605.1.15 ' +
  '(KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const UA_ANDROID_WEBVIEW =
  'Mozilla/5.0 (Linux; Android 15; POCO F7 Build/AP3A; wv) ' +
  'AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/152.0.0.0 Mobile Safari/537.36';
const UA_ELECTRON =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) RESQ-BOX/1.0.0 Chrome/152.0.0.0 Electron/44.7.0 Safari/537.36';

console.log('='.repeat(74));
console.log('  UJI: PENGENALAN LINGKUNGAN (website atau aplikasi)');
console.log('='.repeat(74));

// ── Kasus yang harus dikenali sebagai WEBSITE ───────────────────────────
console.log('\n  ── Harus dikenali sebagai WEBSITE (tombol unduh TAMPIL) ──');
{
  const hasil = await denganLingkungan(
    { hostname: 'resq-box.pages.dev', userAgent: UA_WEB_DESKTOP },
    (m) => m.sedangDiWeb()
  );
  uji('Chrome desktop di resq-box.pages.dev', hasil, true);
}
{
  const hasil = await denganLingkungan(
    { hostname: 'resq-box.pages.dev', userAgent: UA_WEB_IPAD },
    (m) => m.sedangDiWeb()
  );
  uji('Safari iPad di resq-box.pages.dev', hasil, true);
}
{
  // Capacitor ADA tetapi melaporkan platform 'web' -> tetap website.
  // Ini keadaan saat dijalankan di peramban biasa pada proyek ber-Capacitor.
  const hasil = await denganLingkungan(
    {
      hostname: 'resq-box.pages.dev',
      userAgent: UA_WEB_DESKTOP,
      capacitor: { platform: 'web', isNativePlatform: () => false },
    },
    (m) => m.sedangDiWeb()
  );
  uji('Capacitor ada tetapi platform "web"', hasil, true);
}

// ── SERVER PENGEMBANGAN: harus dianggap WEBSITE ─────────────────────────
//
// Ini kasus yang SEBELUMNYA SALAH. Versi pertama hanya memeriksa nama host,
// sehingga `localhost:5173` dikenali sebagai aplikasi — dan tombol unduh
// hilang saat halaman dicoba di laptop sendiri, padahal di website ada.
console.log('\n  ── Server pengembangan di laptop (tombol unduh HARUS tampil) ──');
{
  const hasil = await denganLingkungan(
    { hostname: 'localhost', port: '5173', userAgent: UA_WEB_DESKTOP },
    (m) => m.sedangDiWeb()
  );
  uji('vite dev di localhost:5173', hasil, true);
}
{
  const hasil = await denganLingkungan(
    { hostname: 'localhost', port: '4173', userAgent: UA_WEB_DESKTOP },
    (m) => m.sedangDiWeb()
  );
  uji('vite preview di localhost:4173', hasil, true);
}
{
  const hasil = await denganLingkungan(
    { hostname: '127.0.0.1', port: '3000', userAgent: UA_WEB_DESKTOP },
    (m) => m.sedangDiWeb()
  );
  uji('server lain di 127.0.0.1:3000', hasil, true);
}
{
  // Capacitor ADA dan platform 'android' -> tetap aplikasi walau ada port,
  // karena tanda Capacitor diperiksa lebih dahulu.
  const hasil = await denganLingkungan(
    {
      hostname: 'localhost',
      port: '5173',
      userAgent: UA_WEB_DESKTOP,
      capacitor: { platform: 'android', isNativePlatform: () => true },
    },
    (m) => m.sedangDiAplikasi()
  );
  uji('Capacitor android menang atas port', hasil, true);
}

// ── Kasus yang harus dikenali sebagai APLIKASI ──────────────────────────
console.log('\n  ── Harus dikenali sebagai APLIKASI (tombol unduh SEMBUNYI) ──');

// Tanda 4: nama host lokal TANPA port — inilah aplikasi Android.
// Server pengembangan PUNYA port, sehingga keduanya kini dapat dibedakan.
{
  const hasil = await denganLingkungan(
    { hostname: 'localhost', port: '', userAgent: UA_ANDROID_WEBVIEW },
    (m) => m.sedangDiAplikasi()
  );
  uji('Tanda host: https://localhost tanpa port (WebView Android)', hasil, true);
}
{
  // Aplikasi Android dikenali dari HOST saja, walaupun penanda "wv" tidak ada.
  // Ini penting: bila Android mengubah penanda user agent-nya, deteksi tetap
  // bekerja lewat nama host.
  const hasil = await denganLingkungan(
    { hostname: 'localhost', port: '', userAgent: UA_WEB_DESKTOP },
    (m) => m.sedangDiAplikasi()
  );
  uji('localhost tanpa port dikenali walau user agent biasa', hasil, true);
}
{
  // Aplikasi laptop menyajikan halamannya dari http://127.0.0.1:<port acak>,
  // dan dikenali lewat penanda Electron — BUKAN lewat nama host, karena nama
  // host itu dipakai juga oleh server pengembangan.
  const hasil = await denganLingkungan(
    { hostname: '127.0.0.1', port: '50068', userAgent: UA_ELECTRON },
    (m) => m.sedangDiAplikasi()
  );
  uji('Tanda Electron di 127.0.0.1:50068 (aplikasi laptop)', hasil, true);
}

// Tanda 3: Electron
{
  const hasil = await denganLingkungan(
    { hostname: 'contoh.com', userAgent: UA_ELECTRON },
    (m) => m.sedangDiAplikasi()
  );
  uji('Tanda user agent: Electron (aplikasi laptop)', hasil, true);
}

// Tanda 4: WebView Android
{
  const hasil = await denganLingkungan(
    { hostname: 'contoh.com', userAgent: UA_ANDROID_WEBVIEW },
    (m) => m.sedangDiAplikasi()
  );
  uji('Tanda user agent: "; wv)" (WebView Android)', hasil, true);
}

// Tanda 1: jembatan Capacitor — diuji SENDIRI, tanpa tanda lain,
// supaya diketahui apakah tanda ini benar-benar bekerja.
{
  const hasil = await denganLingkungan(
    {
      hostname: 'contoh.com',
      userAgent: UA_WEB_DESKTOP,
      capacitor: { isNativePlatform: () => true, platform: 'android' },
    },
    (m) => m.sedangDiAplikasi()
  );
  uji('Tanda Capacitor: isNativePlatform() true (sendiri)', hasil, true);
}
{
  const hasil = await denganLingkungan(
    {
      hostname: 'contoh.com',
      userAgent: UA_WEB_DESKTOP,
      capacitor: { platform: 'android' },
    },
    (m) => m.sedangDiAplikasi()
  );
  uji('Tanda Capacitor: platform "android" (sendiri)', hasil, true);
}

// ── Keadaan darurat: tidak ada window sama sekali ───────────────────────
console.log('\n  ── Keadaan darurat ──');
{
  const punyaWindow = 'window' in globalThis;
  const windowLama = globalThis.window;
  delete globalThis.window;
  const modul = await import(
    pathToFileURL(join(AKAR, 'src', 'utils', 'lingkungan.ts')).href
  );
  uji('tanpa window -> dianggap website (aman)', modul.sedangDiAplikasi(), false);
  if (punyaWindow) {
    Object.defineProperty(globalThis, 'window', {
      value: windowLama, configurable: true, writable: true,
    });
  }
}

// ── Pemeriksaan berkas: blok unduh benar-benar dibungkus ────────────────
console.log('\n  ── Berkas Login membungkus blok unduh dengan pemeriksaan ──');
{
  const { readFileSync } = await import('node:fs');
  const t = readFileSync(join(AKAR, 'src', 'app', 'Login', 'index.tsx'), 'utf8');
  uji('memakai sedangDiWeb()', t.includes('sedangDiWeb()'), true);
  uji('blok unduh dibungkus pemeriksaan', /sedangDiWeb\(\)\s*&&/.test(t), true);
  uji('tautan unduh masih ada di dalam', t.includes('TAUTAN_UNDUH.laptop'), true);
}

console.log('\n' + '='.repeat(74));
console.log(`  HASIL: ${lulus} lulus, ${gagal} gagal dari ${lulus + gagal} pemeriksaan`);
console.log('='.repeat(74));
process.exit(gagal > 0 ? 1 : 0);
