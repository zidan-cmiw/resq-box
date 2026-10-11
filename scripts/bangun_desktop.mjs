/**
 * Membangun aplikasi desktop RESQ-BOX (.exe) dengan aman.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * MENGAPA SKRIP INI ADA, BUKAN CUKUP `electron-builder` LANGSUNG
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Dua masalah nyata muncul saat membangun di komputer ini, dan keduanya
 * membuat perintah `electron-builder` biasa GAGAL:
 *
 * ── 1. GAGAL MEMINDAHKAN FOLDER DI DALAM PROYEK ──────────────────────────
 *
 *   electron-builder mengekstrak Electron ke `release/win-unpacked.tmp`,
 *   lalu memindahkannya menjadi `release/win-unpacked`. Langkah pemindahan itu
 *   gagal dengan:
 *
 *       EPERM: operation not permitted, rename
 *       '...\release\win-unpacked.tmp' -> '...\release\win-unpacked'
 *
 *   SUDAH DIBUKTIKAN: folder proyek ini memiliki pengaturan hak akses yang
 *   membuat pemindahan folder besar gagal, sedangkan pemindahan yang sama
 *   BERHASIL di folder lain. Pengujian yang dilakukan:
 *
 *       folder yang sama berisi 961 item
 *         di dalam proyek          -> GAGAL  (4 kali berturut-turut)
 *         di folder TEMP           -> BERHASIL
 *         di C:\resqbox-desktop    -> BERHASIL
 *
 *   Karena itu hasil build diarahkan KE LUAR folder proyek.
 *
 * ── 2. GAGAL MEMBUAT IKON ────────────────────────────────────────────────
 *
 *   electron-builder membuat berkas .ico dari .png memakai `icon-tool.js`
 *   bawaannya. Alat itu CRASH di komputer ini:
 *
 *       node.exe process failed 3221226505
 *
 *   Karena itu berkas .ico dibuat lebih dahulu di sini memakai Pillow, lalu
 *   hasilnya diberikan langsung kepada electron-builder. Ikon yang sudah jadi
 *   tidak perlu dikonversi lagi.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * CARA PAKAI
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   npm run desktop:build      membangun .exe portable
 *
 *   Hasilnya di:  C:\resqbox-desktop\release\
 *
 *   Folder itu dapat diubah lewat argumen pertama:
 *       node scripts/bangun_desktop.mjs "D:\hasil-build"
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const AKAR = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// Folder hasil build, DI LUAR proyek. Lihat alasan pada penjelasan di atas.
const FOLDER_KELUAR = process.argv[2] || 'C:\\resqbox-desktop';

// Python bawaan lingkungan ini, dipakai untuk membuat ikon .ico.
const PYTHON =
  process.env.RESQ_PYTHON ||
  'C:\\Users\\b3nny\\.dsh\\dsh-runtimes\\dsh-primary-runtime\\dependencies\\python\\python.exe';

function jalankan(perintah, argumen, opsi = {}) {
  return new Promise((selesai, gagal) => {
    const p = spawn(perintah, argumen, { stdio: 'inherit', cwd: AKAR, ...opsi });
    p.on('close', (kode) => (kode === 0 ? selesai() : gagal(new Error(`keluar dengan kode ${kode}`))));
    p.on('error', gagal);
  });
}

function jalankanDiam(perintah, argumen) {
  return new Promise((selesai) => {
    let keluaran = '';
    const p = spawn(perintah, argumen, { cwd: AKAR });
    p.stdout?.on('data', (d) => { keluaran += d.toString(); });
    p.stderr?.on('data', (d) => { keluaran += d.toString(); });
    p.on('close', () => selesai(keluaran));
    p.on('error', () => selesai(''));
  });
}

console.log('='.repeat(74));
console.log('  MEMBANGUN APLIKASI DESKTOP RESQ-BOX (.exe)');
console.log('='.repeat(74));

// ── Langkah 1: build web lebih dahulu ─────────────────────────────────────
console.log('\n[1/4] Membangun halaman web...');
await jalankan(
  process.platform === 'win32' ? 'cmd.exe' : 'npm',
  process.platform === 'win32' ? ['/c', 'npm', 'run', 'build'] : ['run', 'build']
);

if (!existsSync(join(AKAR, 'dist', 'index.html'))) {
  console.error('  [X] dist/index.html tidak ada setelah build');
  process.exit(1);
}
console.log('  [v] halaman web siap di dist/');

// ── Langkah 2: siapkan folder keluaran ────────────────────────────────────
console.log(`\n[2/4] Menyiapkan folder keluaran: ${FOLDER_KELUAR}`);
if (existsSync(FOLDER_KELUAR)) {
  try {
    rmSync(FOLDER_KELUAR, { recursive: true, force: true });
  } catch (e) {
    console.error(`  [X] tidak dapat membersihkan folder: ${e.message}`);
    console.error('      Tutup aplikasi RESQ-BOX bila sedang berjalan, lalu ulangi.');
    process.exit(1);
  }
}
mkdirSync(FOLDER_KELUAR, { recursive: true });
console.log('  [v] folder bersih');

// ── Langkah 3: buat ikon .ico ─────────────────────────────────────────────
console.log('\n[3/4] Membuat ikon aplikasi (.ico)...');
const pngIkon = join(AKAR, 'build', 'icon.png');
const icoIkon = join(FOLDER_KELUAR, 'icon.ico');

if (!existsSync(pngIkon)) {
  console.error(`  [X] ikon sumber tidak ada: ${pngIkon}`);
  process.exit(1);
}

const skripIkon = `
from PIL import Image
im = Image.open(r"${pngIkon}").convert("RGBA")
im.save(r"${icoIkon}", format="ICO",
        sizes=[(16,16),(24,24),(32,32),(48,48),(64,64),(128,128),(256,256)])
print("  [v] icon.ico dibuat")
`;
const keluaranIkon = await jalankanDiam(PYTHON, ['-c', skripIkon]);
process.stdout.write(keluaranIkon);

if (!existsSync(icoIkon)) {
  console.error('  [X] gagal membuat icon.ico — periksa apakah Pillow terpasang');
  process.exit(1);
}

// ── Langkah 4: paketkan menjadi .exe ──────────────────────────────────────
console.log('\n[4/4] Memaketkan menjadi .exe (perlu beberapa menit)...');
const cli = join(AKAR, 'node_modules', 'electron-builder', 'out', 'cli', 'cli.js');

await jalankan(process.execPath, [
  cli,
  '--win', 'portable', '--x64',
  `--config.directories.output=${FOLDER_KELUAR}\\release`,
  `--config.win.icon=${icoIkon}`,
]);

const folderHasil = join(FOLDER_KELUAR, 'release');
const berkasExe = existsSync(folderHasil)
  ? readdirSync(folderHasil).filter((f) => f.endsWith('.exe'))
  : [];

console.log('\n' + '='.repeat(74));
if (berkasExe.length) {
  console.log('  BERHASIL');
  for (const f of berkasExe) {
    const p = join(folderHasil, f);
    console.log(`  ${p}`);
    console.log(`  ukuran: ${(statSync(p).size / 1024 / 1024).toFixed(2)} MB`);
  }
  console.log('\n  Cara pakai:');
  console.log('    1. Sambungkan laptop ke WiFi "DIORAMA_ESP32" (sandi 12345678)');
  console.log('    2. Jalankan berkas .exe di atas');
  console.log('    3. Buka Level 3 -> Workspace -> tombol "Diorama WiFi"');
  console.log('    4. Alamat board: 192.168.4.1');
} else {
  console.log('  [X] GAGAL — tidak ada berkas .exe yang dihasilkan');
}
console.log('='.repeat(74) + '\n');
