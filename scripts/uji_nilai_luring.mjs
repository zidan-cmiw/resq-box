/**
 * Uji: antrian nilai luring.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * MASALAH YANG DIUJI
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Saat siswa bermain di jaringan WiFi diorama ESP32, perangkat tidak punya
 * akses internet. Nilai tersimpan di perangkat, tetapi pengiriman ke server
 * gagal — dan SEBELUM PERBAIKAN INI nilai itu tidak pernah dicoba lagi.
 * Lebih buruk: ketika guru membuka dashboard dalam keadaan daring, cache lokal
 * ditulis ulang dengan data server sehingga nilai luring siswa tertimpa.
 *
 * Akibatnya siswa bisa menyelesaikan level dengan benar, tetapi nilainya tidak
 * pernah muncul di rapor guru.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * DUA RISIKO YANG DIUJI SECARA KHUSUS
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * 1. BARIS KEMBAR
 *
 *    `submit_level_result` memakai INSERT biasa, dan tabel
 *    `level_submissions` TIDAK punya batasan unik pada (student_id,
 *    level_number). Jadi mengirim ulang nilai yang sudah ada akan MENAMBAH
 *    baris kembar — dan dashboard guru memakai `.find()`, sehingga ia dapat
 *    menampilkan nilai yang lebih rendah daripada capaian sebenarnya.
 *
 *    Yang diuji: nilai yang sudah ada di server TIDAK dikirim ulang.
 *
 * 2. KIRIM DUA KALI DARI DUA JALUR
 *
 *    Ada dua jalur pengiriman: antrean koalesensi (jendela 5 detik) dan
 *    antrian nilai tertunda. Bila keduanya mengirim nilai yang sama, hasilnya
 *    juga baris kembar.
 *
 *    Yang diuji: nilai yang sedang menunggu di antrean koalesensi DILEWATI
 *    oleh antrian tertunda.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * CARA MENJALANKAN
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *     npm run test:nilai-luring
 *
 * Berkas ini mengimpor fungsi ASLI dari supabaseClient.ts (dibundel memakai
 * Vite), bukan menyalin logikanya. Supabase tiruan dipasang supaya
 * pengirimannya dapat diamati tanpa menyentuh database sungguhan.
 */
import { build } from 'vite';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const AKAR = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// ══════════════════════════════════════════════════════════════════════════
// Tiruan lingkungan peramban — dipasang SEBELUM modul dimuat
// ══════════════════════════════════════════════════════════════════════════
const penyimpanan = new Map();
globalThis.localStorage = {
  getItem: (k) => (penyimpanan.has(k) ? penyimpanan.get(k) : null),
  setItem: (k, v) => penyimpanan.set(k, String(v)),
  removeItem: (k) => penyimpanan.delete(k),
  clear: () => penyimpanan.clear(),
  key: (i) => Array.from(penyimpanan.keys())[i] ?? null,
  get length() {
    return penyimpanan.size;
  },
};

// Node 24 menyediakan `navigator` sebagai getter saja, sehingga tidak dapat
// ditimpa dengan penugasan biasa. `defineProperty` diperlukan di sini.
//
// Tiruan ini penting: uji harus dapat memalsukan keadaan "luring" untuk
// memastikan nilai TIDAK dikirim saat tidak ada internet.
Object.defineProperty(globalThis, 'navigator', {
  value: { onLine: true },
  writable: true,
  configurable: true,
});

const pendengar = new Map();
globalThis.window = {
  addEventListener: (nama, fn) => {
    if (!pendengar.has(nama)) pendengar.set(nama, []);
    pendengar.get(nama).push(fn);
  },
};
globalThis.document = { visibilityState: 'visible' };

// ══════════════════════════════════════════════════════════════════════════
// Klien Supabase tiruan
//
// MENGAPA MODULNYA DIGANTI, BUKAN OBJEKNYA DISUNTIK
//
//   `supabaseClient.ts` membuat kliennya sendiri saat modul dimuat:
//
//       export const supabase = isSupabaseConfigured
//         ? createClient(supabaseUrl, supabaseAnonKey, {...})
//         : null;
//
//   Tidak ada tempat untuk menyuntikkan klien tiruan dari luar. Karena itu
//   bundel Vite diarahkan supaya `@supabase/supabase-js` diganti dengan modul
//   tiruan ini. Dengan begitu, yang diuji tetap KODE ASLI dari
//   supabaseClient.ts — hanya lapisan jaringannya yang diganti.
// ══════════════════════════════════════════════════════════════════════════
const rpcDiterima = [];
let barisDiServer = [];
let rpcGagal = false;

globalThis.__tiruanSupabase = {
  get rpcDiterima() {
    return rpcDiterima;
  },
  set barisDiServer(v) {
    barisDiServer = v;
  },
  get barisDiServer() {
    return barisDiServer;
  },
  set rpcGagal(v) {
    rpcGagal = v;
  },
  // Pengambil ini WAJIB ada. Tanpa `get rpcGagal()`, penugasan dari uji
  // (`tiruan.rpcGagal = true`) tidak berpengaruh — nilainya menjadi
  // `undefined`, pengiriman tetap dianggap berhasil, dan uji bagian 4 gagal
  // tanpa menjelaskan sebabnya. Kesalahan ada di berkas uji ini, bukan pada
  // kode aplikasi yang diuji.
  get rpcGagal() {
    return rpcGagal;
  },
  reset() {
    rpcDiterima.length = 0;
    barisDiServer = [];
    rpcGagal = false;
  },
};

const dirSementara = mkdtempSync(join(tmpdir(), 'resq-uji-nilai-'));
const berkasMasuk = join(AKAR, 'scripts', '_uji_nilai_masuk.ts');
const berkasTiruan = join(dirSementara, 'supabase-tiruan.mjs');
// Berkas konfigurasi harus berada DI DALAM folder proyek, karena impor
// 'vite' di dalamnya perlu diselesaikan dari node_modules proyek.
// Konfigurasi di folder temp gagal dengan ERR_MODULE_NOT_FOUND.
const berkasKonfig = join(AKAR, 'scripts', '_uji_nilai_vite.config.mjs');
const dirBundel = join(dirSementara, 'bundel');

// Modul tiruan pengganti @supabase/supabase-js
writeFileSync(
  berkasTiruan,
  `const t = globalThis.__tiruanSupabase;
   // 'SupabaseClient' diekspor sebagai tipe karena supabaseClient.ts
   // mengimpornya. Sebuah tipe tidak berwujud saat berjalan, jadi cukup
   // dideklarasikan agar pemeriksa modul tidak mengeluh.
   export class SupabaseClient {}
   export class Session {}
   export function createClient() {
     return {
       rpc: async (nama, payload) => {
         if (nama === 'submit_level_result') {
           if (t.rpcGagal) return { data: null, error: { message: 'jaringan putus' } };
           t.rpcDiterima.push(payload);
           return { data: { success: true }, error: null };
         }
         return { data: null, error: null };
       },
       from: () => ({
         select: () => ({ limit: async () => ({ data: t.barisDiServer, error: null }) }),
       }),
       auth: {
         getSession: async () => ({ data: { session: null }, error: null }),
         onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
         signOut: async () => ({ error: null }),
       },
       removeChannel: () => {},
       channel: () => ({ on: () => ({ subscribe: () => {} }) }),
     };
   }
  `,
  'utf8'
);

// Konfigurasi Vite KHUSUS untuk uji ini.
//
// MENGAPA TIDAK MEMAKAI vite.config.ts PROYEK
//   Konfigurasi proyek memuat plugin PWA (`vite-plugin-pwa`). Plugin itu
//   mencoba menghasilkan service worker saat proses bundel selesai, dan
//   gagal dengan "Unable to write the service worker file. Invalid URL"
//   ketika dipakai untuk membundel pustaka alih-alih aplikasi.
//
//   Karena itu uji ini memakai konfigurasi sendiri yang minimal. Isinya sama
//   untuk hal yang penting: alias Supabase tiruan dan nilai env, supaya
//   `supabaseClient.ts` benar-benar membuat kliennya.
// ══════════════════════════════════════════════════════════════════════════
// Konfigurasi Vite KHUSUS untuk uji ini.
//
// MENGAPA TIDAK MEMAKAI vite.config.ts PROYEK
//   Konfigurasi proyek memuat plugin PWA (`vite-plugin-pwa`). Plugin itu
//   mencoba menghasilkan service worker saat proses bundel selesai, dan gagal
//   dengan "Unable to write the service worker file. Invalid URL" ketika
//   dipakai untuk membundel pustaka alih-alih aplikasi.
//
// MENGAPA ISI BERKAS INI DIRAKIT, BUKAN DITULIS SEBAGAI SATU TEMPLATE
//   Isi berkas konfigurasi ini perlu menyisipkan nilai-nilai (path) yang
//   dihitung saat uji berjalan. Menulisnya sebagai satu template literal
//   bersarang membuat tanda kutip dan `${}` saling bertabrakan, dan berkas
//   yang dihasilkan menjadi tidak sah. Merakitnya baris demi baris jauh lebih
//   mudah dibaca dan tidak rawan.
//
// MENGAPA `resolve.alias`, BUKAN `rollupOptions.alias`
//   `alias` BUKAN pilihan yang sah di dalam `rollupOptions`. Menaruhnya di
//   sana membuat Vite mengabaikannya dengan peringatan "Invalid key: Expected
//   never but received alias" — dan tiruan Supabase tidak pernah terpasang,
//   sehingga `supabase` bernilai null dan seluruh pengiriman berhenti lebih
//   awal tanpa gejala yang jelas.
// ══════════════════════════════════════════════════════════════════════════
const barisKonfig = [
  "import { defineConfig } from 'vite';",
  'export default defineConfig({',
  "  logLevel: 'error',",
  '  resolve: {',
  "    alias: { '@supabase/supabase-js': " + JSON.stringify(berkasTiruan) + ' },',
  '  },',
  '  build: {',
  '    outDir: ' + JSON.stringify(dirBundel) + ',',
  '    emptyOutDir: true,',
  '    lib: { entry: ' + JSON.stringify(berkasMasuk) + ", formats: ['es'], fileName: () => 'nilai.mjs' },",
  '    minify: false,',
  '    rollupOptions: { external: [] },',
  '  },',
  '  define: {',
  // Nilai `define` disisipkan sebagai POTONGAN KODE, jadi harus berupa string
  // berkode (JSON.stringify) — bukan string biasa yang ditulis dengan tanda
  // kutip. Menulisnya sebagai "teks" biasa menghasilkan
  // INVALID_DEFINE_CONFIG: Unexpected token.
  "    'import.meta.env.VITE_SUPABASE_URL': " +
    JSON.stringify(JSON.stringify('https://tiruan.supabase.co')) +
    ',',
  "    'import.meta.env.VITE_SUPABASE_ANON_KEY': " +
    JSON.stringify(JSON.stringify('kunci-tiruan-uji-yang-panjang-sekali-1234567890')) +
    ',',
  '  },',
  '});',
  '',
].join('\n');

writeFileSync(berkasKonfig, barisKonfig, 'utf8');

writeFileSync(
  berkasMasuk,
  "export { kirimNilaiTertunda, jumlahNilaiTertunda, submitLevelProgress }\n" +
    "  from '../src/utils/supabaseClient';\n",
  'utf8'
);

let ekspor;
try {
  await build({
    configFile: berkasKonfig,
    root: AKAR,
  });
  ekspor = await import(pathToFileURL(join(dirBundel, 'nilai.mjs')).href);
} finally {
  try { rmSync(berkasMasuk, { force: true }); } catch { /* abaikan */ }
  try { rmSync(berkasKonfig, { force: true }); } catch { /* abaikan */ }
}

const { kirimNilaiTertunda, jumlahNilaiTertunda, submitLevelProgress } = ekspor;
const tiruan = globalThis.__tiruanSupabase;

let lulus = 0;
let gagal = 0;
const pesanGagal = [];

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
    pesanGagal.push(nama);
  }
}

const SISWA = 'aaaaaaaa-1111-4111-8111-aaaaaaaaaaaa';
const KUNCI = 'resqbox-nilai-belum-terkirim';

function nilaiPalsu(level, skor = 50) {
  return {
    student_id: SISWA,
    student_name: 'Siswa Uji',
    classroom_code: 'RESQ-8A',
    level_number: level,
    score: skor,
    details: { missions: 4 },
    isCompleted: false,
  };
}

console.log('\n' + '='.repeat(76));
console.log('  UJI: ANTRIAN NILAI LURING');
console.log('='.repeat(76));
console.log('  Memakai kode asli dari src/utils/supabaseClient.ts (dibundel Vite).');

// ══════════════════════════════════════════════════════════════════════════
console.log('\n── 1. Nilai yang gagal dikirim TERCATAT dan dapat dikirim menyusul ──');

tiruan.reset();
penyimpanan.clear();
globalThis.navigator.onLine = false; // luring

await submitLevelProgress(nilaiPalsu(1, 50));
uji('Saat luring, nilai tercatat sebagai belum terkirim', jumlahNilaiTertunda(), 1);
uji('Saat luring, TIDAK ada pengiriman yang dicoba', tiruan.rpcDiterima.length, 0);

// Jaringan kembali
globalThis.navigator.onLine = true;
const hasil1 = await kirimNilaiTertunda();
uji('Setelah tersambung, 1 nilai berhasil dikirim', hasil1.terkirim, 1);
uji('Antrian menjadi kosong', jumlahNilaiTertunda(), 0);
uji('Server menerima 1 pengiriman', tiruan.rpcDiterima.length, 1);
uji('Level yang dikirim benar', tiruan.rpcDiterima[0]?.p_level, 1);

// ══════════════════════════════════════════════════════════════════════════
console.log('\n── 2. ANTI BARIS KEMBAR: nilai yang sudah ada di server DILEWATI ──');
//
// Ini risiko paling serius. Bila nilai yang sudah tersimpan dikirim ulang,
// `level_submissions` mendapat baris kembar — dan dashboard guru memakai
// `.find()`, sehingga dapat menampilkan nilai yang lebih rendah.

tiruan.reset();
penyimpanan.clear();

// Siswa selesai luring; nilainya belum terkirim.
globalThis.navigator.onLine = false;
await submitLevelProgress(nilaiPalsu(2, 70));
uji('Ada 1 nilai tertunda sebelum pengiriman ulang', jumlahNilaiTertunda(), 1);

// Ternyata server SUDAH punya nilai untuk level itu (mis. terkirim pada
// sesi sebelumnya lewat jalur lain).
tiruan.barisDiServer = [
  { student_id: SISWA, level_number: 2, score: 70 },
];
globalThis.navigator.onLine = true;

const hasil2 = await kirimNilaiTertunda();
uji('Nilai yang sudah ada di server DILEWATI, tidak dikirim', hasil2.dilewati, 1);
uji('TIDAK ada pengiriman baru ke server', tiruan.rpcDiterima.length, 0);
uji('Catatan tertunda dibersihkan', jumlahNilaiTertunda(), 0);

// ══════════════════════════════════════════════════════════════════════════
console.log('\n── 3. ANTI KIRIM-DUA-KALI: level di antrean koalesensi DILEWATI ──');

tiruan.reset();
penyimpanan.clear();
globalThis.navigator.onLine = true;

// Pengiriman ini MASUK ke antrean koalesensi (bukan milestone), sehingga
// nilainya masih menunggu di antrean saat `kirimNilaiTertunda` dipanggil.
void submitLevelProgress(nilaiPalsu(3, 30));
uji('Nilai tercatat sebagai tertunda', jumlahNilaiTertunda(), 1);

const hasil3 = await kirimNilaiTertunda();
uji(
  'Level yang sedang menunggu di antrean koalesensi DILEWATI',
  hasil3.dilewati >= 1,
  true
);
uji(
  'Antrian tertunda TIDAK mengirim sendiri (biar antrean yang urus)',
  tiruan.rpcDiterima.length,
  0
);

// ══════════════════════════════════════════════════════════════════════════
console.log('\n── 4. Gagal lagi: catatan DIBIARKAN, tidak menyerah ──');

tiruan.reset();
penyimpanan.clear();
globalThis.navigator.onLine = false;
await submitLevelProgress(nilaiPalsu(1, 90));
uji('Ada 1 nilai tertunda', jumlahNilaiTertunda(), 1);

globalThis.navigator.onLine = true;
tiruan.rpcGagal = true; // server menolak
const hasil4 = await kirimNilaiTertunda();
uji('Pengiriman dicoba tetapi gagal', hasil4.gagal, 1);
uji('Catatan TETAP ada supaya dicoba lagi nanti', jumlahNilaiTertunda(), 1);

// Percobaan berikutnya berhasil
tiruan.rpcGagal = false;
const hasil5 = await kirimNilaiTertunda();
uji('Percobaan berikutnya berhasil', hasil5.terkirim, 1);
uji('Antrian kini kosong', jumlahNilaiTertunda(), 0);

// ══════════════════════════════════════════════════════════════════════════
console.log('\n── 5. Beberapa level sekaligus ──');

tiruan.reset();
penyimpanan.clear();
globalThis.navigator.onLine = false;
await submitLevelProgress(nilaiPalsu(1, 100));
await submitLevelProgress(nilaiPalsu(2, 100));
await submitLevelProgress(nilaiPalsu(3, 80));
uji('Tiga nilai tercatat tertunda', jumlahNilaiTertunda(), 3);

globalThis.navigator.onLine = true;
const hasil6 = await kirimNilaiTertunda();
uji('Ketiganya terkirim', hasil6.terkirim, 3);
uji('Antrian kosong', jumlahNilaiTertunda(), 0);
uji(
  'Level yang terkirim tepat 1, 2, dan 3',
  tiruan.rpcDiterima.map((p) => p.p_level).sort((a, b) => a - b),
  [1, 2, 3]
);

console.log('\n' + '='.repeat(76));
console.log(`  HASIL: ${lulus} lulus, ${gagal} gagal dari ${lulus + gagal} pemeriksaan`);
console.log('='.repeat(76) + '\n');

try { rmSync(dirSementara, { recursive: true, force: true }); } catch { /* abaikan */ }
process.exit(gagal > 0 ? 1 : 0);
