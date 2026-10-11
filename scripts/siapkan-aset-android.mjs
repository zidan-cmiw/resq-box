#!/usr/bin/env node
/**
 * Keluarkan `terrain-688.stl.gz` dari aset Android SEBELUM Gradle membangun APK.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * MASALAH YANG DISELESAIKAN
 * ══════════════════════════════════════════════════════════════════════════
 *
 *   Build APK gagal dengan:
 *
 *       :app:mergeDebugAssets
 *       Duplicate resources
 *         terrain-688.stl
 *         terrain-688.stl.gz
 *
 *   Sebabnya: kedua berkas itu berisi DATA YANG SAMA.
 *
 *       terrain-688.stl     3.165.784 B  (asli)
 *       terrain-688.stl.gz    944.000 B  (hasil kompresi berkas di atas)
 *
 *   Di web, kehadiran keduanya memang disengaja: aplikasi memuat `.gz` lebih
 *   dahulu (menghemat 2,2 MB), lalu beralih ke `.stl` bila dekompresi tidak
 *   didukung. Itu pilihan yang baik untuk web.
 *
 *   Tetapi di dalam APK, keduanya IKUT DIKEMAS — 3,9 MB untuk satu model yang
 *   sama, dan Gradle menolaknya sebagai sumber kembar.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * MENGAPA YANG DIKELUARKAN ADALAH `.gz`, BUKAN `.stl`
 * ══════════════════════════════════════════════════════════════════════════
 *
 *   `.stl` adalah berkas ASLI dan selalu dapat dipakai; tidak ada syarat
 *   khusus untuk membacanya.
 *
 *   `.gz` memerlukan `DecompressionStream('gzip')`. Di peramban modern API itu
 *   tersedia, tetapi WebView Android versi lama belum tentu memilikinya.
 *   Bila `.gz` ada tetapi `DecompressionStream` tidak ada, aplikasi akan
 *   beralih ke `.stl` — jadi keduanya sebenarnya bekerja. Namun menyimpan
 *   berkas yang hanya BERGUNA BILA API TERTENTU ADA, sambil menambah 944 KB
 *   dan menggagalkan build, tidak sepadan.
 *
 *   Jadi `.stl` dipertahankan dan `.gz` dikeluarkan. Ukuran APK bertambah
 *   sekitar 3 MB dibandingkan bila hanya `.gz` yang disertakan, tetapi model
 *   3D dijamin dapat dimuat di perangkat apa pun, dan buildnya tidak gagal.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * KAPAN DIJALANKAN
 * ══════════════════════════════════════════════════════════════════════════
 *
 *   Dijalankan otomatis sebagai bagian dari `npm run android:sync`, SETELAH
 *   `cap sync` selesai — karena `cap sync` menyalin ulang seluruh isi `dist/`
 *   ke aset Android, termasuk `.gz` yang baru saja kita keluarkan.
 *
 *   Aman dijalankan berkali-kali.
 */
import { existsSync, statSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const AKAR = join(dirname(fileURLToPath(import.meta.url)), '..');
const ASET = join(AKAR, 'android', 'app', 'src', 'main', 'assets', 'public');

const GZ = join(ASET, 'terrain-688.stl.gz');
const STL = join(ASET, 'terrain-688.stl');

console.log('\n  Menyiapkan aset Android...');

// ── 1. Pastikan foldernya ada ────────────────────────────────────────────
if (!existsSync(ASET)) {
  console.error(`  [X] Folder aset Android tidak ditemukan:\n      ${ASET}`);
  console.error('      Jalankan `cap sync android` lebih dahulu.');
  process.exit(1);
}

// ── 2. Pastikan `.stl` ADA sebelum mengeluarkan `.gz` ────────────────────
//
// Urutannya penting. Bila `.gz` dikeluarkan sementara `.stl` tidak ada,
// model 3D Merapi tidak akan dapat dimuat sama sekali. Memeriksa lebih dahulu
// mencegah build menghasilkan aplikasi yang rusak diam-diam.
if (!existsSync(STL)) {
  console.error('  [X] terrain-688.stl TIDAK ADA di aset Android.');
  console.error('      .gz TIDAK dikeluarkan, karena itu akan menghilangkan model 3D.');
  console.error('      Periksa apakah public/terrain-688.stl ada, lalu jalankan ulang sync.');
  process.exit(1);
}

const ukuranStl = statSync(STL).size;

// ── 3. Keluarkan `.gz` ───────────────────────────────────────────────────
if (existsSync(GZ)) {
  const ukuranGz = statSync(GZ).size;
  unlinkSync(GZ);
  console.log(`  [v] terrain-688.stl.gz dikeluarkan dari aset Android`);
  console.log(`        (${(ukuranGz / 1024 / 1024).toFixed(2)} MB) — mencegah "Duplicate resources"`);
} else {
  console.log('  [v] terrain-688.stl.gz memang sudah tidak ada');
}

console.log(`  [v] terrain-688.stl dipertahankan (${(ukuranStl / 1024 / 1024).toFixed(2)} MB)`);
console.log('  [v] Aset Android siap dibangun\n');
