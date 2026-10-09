#!/usr/bin/env node
/**
 * Cek konfigurasi wajib SEBELUM membangun aplikasi.
 *
 * MENGAPA BERKAS INI ADA
 *   Vite mengganti `import.meta.env.VITE_*` dengan NILAI LITERAL pada saat
 *   build — bukan saat aplikasi berjalan. Jadi bila variabelnya tidak ada
 *   ketika build, nilainya menjadi string kosong dan TERPANGGANG permanen ke
 *   dalam berkas JavaScript.
 *
 *   Bahayanya: build TETAP SUKSES. Tidak ada error, tidak ada peringatan,
 *   bahkan berkas hasilnya terlihat normal. Yang terjadi baru ketahuan setelah
 *   webnya dibuka: tombol "MASUK" menampilkan pesan
 *
 *       "Mode luring: tidak bisa masuk tanpa koneksi ke server."
 *
 *   Pesan itu MENYESATKAN — jaringan pengguna tidak bermasalah; yang kurang
 *   adalah variabel lingkungan. Akibatnya waktu terbuang mencari masalah di
 *   tempat yang salah (jaringan, Supabase, browser).
 *
 *   Berkas ini membuat kesalahan itu muncul LEBIH AWAL dan JELAS: build
 *   dihentikan dengan pesan yang menyebutkan persis apa yang kurang.
 *
 * CARA KERJA
 *   Dijalankan otomatis oleh npm lewat `prebuild`, sehingga berjalan sebelum
 *   `tsc -b && vite build` di mana pun: di laptop, di Cloudflare Pages, atau
 *   di sistem CI lain.
 *
 * KAPAN DILEWATI
 *   Dukungan "mode luring" memang disengaja: aplikasi tetap dapat dibuka dan
 *   dipakai tanpa Supabase. Karena itu pemeriksaan ini hanya MENGHENTIKAN
 *   build bila variabelnya benar-benar tidak ada, dan tetap memberi pesan
 *   peringatan yang jelas dalam kasus lain yang meragukan.
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const AKAR = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Baca pasangan KEY=VALUE dari sebuah berkas .env (bila ada). */
function bacaEnvFile(nama) {
  const jalur = join(AKAR, nama);
  if (!existsSync(jalur)) return {};
  const hasil = {};
  for (const baris of readFileSync(jalur, 'utf8').split('\n')) {
    const t = baris.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i < 0) continue;
    const kunci = t.slice(0, i).trim();
    let nilai = t.slice(i + 1).trim();
    // Buang tanda kutip pembungkus
    if (
      (nilai.startsWith('"') && nilai.endsWith('"')) ||
      (nilai.startsWith("'") && nilai.endsWith("'"))
    ) {
      nilai = nilai.slice(1, -1);
    }
    hasil[kunci] = nilai;
  }
  return hasil;
}

const dariFile = { ...bacaEnvFile('.env'), ...bacaEnvFile('.env.local') };
const nilai = (kunci) => process.env[kunci] ?? dariFile[kunci] ?? '';

const URL_SB = nilai('VITE_SUPABASE_URL');
const KUNCI_SB = nilai('VITE_SUPABASE_ANON_KEY');

const masalah = [];

if (!URL_SB) {
  masalah.push(
    'VITE_SUPABASE_URL belum diisi.\n' +
      '      Contoh: https://<project-ref>.supabase.co'
  );
} else if (!/^https:\/\/[a-z0-9-]+\.supabase\.(co|in)$/i.test(URL_SB)) {
  masalah.push(
    `VITE_SUPABASE_URL bentuknya tidak seperti URL Supabase:\n` +
      `      "${URL_SB}"\n` +
      `      Seharusnya seperti: https://abcdefghijklmnop.supabase.co`
  );
}

if (!KUNCI_SB) {
  masalah.push(
    'VITE_SUPABASE_ANON_KEY belum diisi.\n' +
      '      Ambil dari Supabase Dashboard → Project Settings → API → anon public.'
  );
} else if (KUNCI_SB.length < 100) {
  masalah.push(
    `VITE_SUPABASE_ANON_KEY terlalu pendek (${KUNCI_SB.length} karakter).\n` +
      `      Kunci anon Supabase biasanya sekitar 200+ karakter.`
  );
}

if (masalah.length > 0) {
  // Jalan keluar yang disengaja: mode luring memang didukung aplikasi, jadi
  // membangun tanpa Supabase adalah pilihan yang sah — asalkan disengaja dan
  // dinyatakan lewat variabel, bukan terjadi karena kelupaan.
  if (process.env.RESQ_IZINKAN_TANPA_SUPABASE === '1') {
    console.warn(
      '\n  PERINGATAN: membangun TANPA konfigurasi Supabase' +
        ' (RESQ_IZINKAN_TANPA_SUPABASE=1).\n' +
        '  Aplikasi akan berjalan dalam mode luring dan TIDAK DAPAT LOGIN.\n'
    );
    console.warn(`  Yang belum diisi: ${masalah.map((m) => m.split('\n')[0]).join('; ')}\n`);
    process.exit(0);
  }

  const garis = '─'.repeat(72);
  console.error(`\n${garis}`);
  console.error('  BUILD DIHENTIKAN — konfigurasi Supabase belum lengkap');
  console.error(garis);
  console.error(
    '\n  Vite menanamkan nilai variabel ini ke dalam berkas JavaScript pada\n' +
      '  saat build. Tanpa nilainya, aplikasi akan terbangun dalam keadaan\n' +
      '  TIDAK DAPAT LOGIN, sementara build tetap terlihat berhasil.\n'
  );
  for (const m of masalah) console.error(`  • ${m}\n`);
  console.error('  CARA MEMPERBAIKI');
  console.error('    Di laptop   : salin .env.example menjadi .env lalu isi nilainya.');
  console.error('    Cloudflare  : Settings → Environment variables → tambahkan');
  console.error('                  kedua variabel di atas untuk Production & Preview.\n');
  console.error(garis);
  console.error('  Bila memang ingin membangun tanpa Supabase (mode luring),');
  console.error('  jalankan:  RESQ_IZINKAN_TANPA_SUPABASE=1 npm run build\n');
  process.exit(1);
}

console.log('  Konfigurasi Supabase OK');
console.log(`    URL  : ${URL_SB}`);
console.log(`    Kunci: ${KUNCI_SB.slice(0, 12)}… (${KUNCI_SB.length} karakter)`);
