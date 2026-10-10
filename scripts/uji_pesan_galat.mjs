/**
 * Uji pengklasifikasian galat createStudentByTeacher.
 *
 * MENGAPA BERKAS INI ADA
 *   Guru melaporkan notifikasi "Kelas ini bukan kelas yang Anda ampu" muncul
 *   saat passwordnya hanya 5 karakter, dan saat nomor absennya sudah dipakai.
 *   Keduanya BUKAN masalah kelas.
 *
 *   Penyebabnya ada dua di kode:
 *     1. `msg.includes('absen')` ditempatkan paling awal, sehingga menangkap
 *        pesan server apa pun yang menyebut kata "absen".
 *     2. Semua galat yang tidak dikenali jatuh ke baris terakhir dan
 *        ditampilkan sebagai "bukan kelas Anda".
 *
 *   Berkas ini menguji pemetaan pesan galat -> pesan pengguna, memakai pesan
 *   yang BENAR-BENAR dikirim server, supaya kesalahan seperti itu tertangkap
 *   sebelum sampai ke pengguna.
 *
 * Cara menjalankan:
 *     node scripts/uji_pesan_galat.mjs
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const AKAR = join(dirname(fileURLToPath(import.meta.url)), '..');

// Pemetaan yang SAMA dengan yang ada di supabaseClient.ts. Disalin ke sini
// karena fungsi aslinya memerlukan koneksi Supabase; yang diuji di sini
// hanyalah bagian pengklasifikasian pesannya.
function klasifikasiGalat(pesanAsli, { absen = '5', username = 'rizky15' } = {}) {
  const asli = pesanAsli || '';
  const msg = asli.toLowerCase();

  if (msg.includes('nomor absen') && msg.includes('sudah dipakai')) {
    return `Nomor absen ${absen} sudah dipakai siswa lain di kelas ini. Pilih nomor lain.`;
  }
  if (msg.includes('username') && msg.includes('sudah ada')) {
    return `Username "${username}" sudah ada! Pilih yang lain.`;
  }
  if (msg.includes('unique') || msg.includes('duplicate') || msg.includes('sudah terdaftar')) {
    return (
      `Username "${username}" atau nomor absen ${absen} sudah dipakai di kelas ini. ` +
      'Periksa daftar siswa, lalu coba lagi dengan nilai yang berbeda.'
    );
  }
  if (msg.includes('password') || msg.includes('sandi')) {
    return 'Password minimal 6 karakter.';
  }
  if (msg.includes('nomor absen')) {
    return 'Nomor absen wajib diisi dan harus berupa angka (1–3 digit).';
  }
  if (msg.includes('bukan milik')) {
    return 'Kelas ini bukan kelas yang Anda ampu. Pastikan Anda masuk sebagai guru pemilik kelas ini.';
  }
  if (msg.includes('hanya guru')) {
    return 'Hanya akun guru yang dapat membuat akun siswa.';
  }
  if (msg.includes('tidak ditemukan')) {
    return 'Kode kelas tidak ditemukan di server.';
  }
  if (msg.includes('harus login') || msg.includes('jwt')) {
    return 'Sesi Anda berakhir. Silakan masuk kembali.';
  }
  if (msg.includes('terlalu banyak')) {
    return 'Terlalu banyak pembuatan akun. Tunggu sebentar.';
  }
  return `Gagal membuat akun siswa: ${asli || 'penyebab tidak diketahui.'}`;
}

// ═══════════════════════════════════════════════════════════════════════════
// Pesan galat yang BENAR-BENAR dikirim server, beserta pesan yang SEHARUSNYA
// muncul untuk guru.
// ═══════════════════════════════════════════════════════════════════════════
const KASUS = [
  {
    nama: 'Nomor absen sudah dipakai (pesan dari server)',
    galat: 'Nomor absen 5 sudah dipakai siswa lain di kelas ini. Pilih nomor lain.',
    harus: 'sudah dipakai siswa lain',
    tidakBoleh: 'bukan kelas yang Anda ampu',
  },
  {
    nama: 'Nomor absen sudah dipakai (pesan dari batasan)',
    galat: 'Nomor absen 5 sudah dipakai siswa lain di kelas ini. Pilih nomor lain.',
    harus: 'sudah dipakai siswa lain',
    tidakBoleh: 'bukan kelas yang Anda ampu',
  },
  {
    nama: 'Username sudah ada',
    galat: 'Username rizky15 sudah ada! Pilih username lain.',
    harus: 'sudah ada',
    tidakBoleh: 'bukan kelas yang Anda ampu',
  },
  {
    nama: 'Password terlalu pendek',
    galat: 'Password minimal 6 karakter.',
    harus: 'Password minimal 6 karakter',
    tidakBoleh: 'bukan kelas yang Anda ampu',
  },
  {
    nama: 'Kelas memang bukan milik guru (INI yang benar)',
    galat: 'Kelas RESQ-8A bukan milik Anda.',
    harus: 'bukan kelas yang Anda ampu',
    tidakBoleh: null,
  },
  {
    nama: 'Bukan akun guru',
    galat: 'Hanya guru yang boleh membuat akun siswa.',
    harus: 'Hanya akun guru',
    tidakBoleh: 'bukan kelas yang Anda ampu',
  },
  {
    nama: 'Kelas tidak ditemukan',
    galat: 'Kode kelas RESQ-9Z tidak ditemukan.',
    harus: 'tidak ditemukan di server',
    tidakBoleh: 'bukan kelas yang Anda ampu',
  },
  {
    nama: 'Sesi berakhir',
    galat: 'Harus login.',
    harus: 'Sesi Anda berakhir',
    tidakBoleh: 'bukan kelas yang Anda ampu',
  },
  {
    nama: 'Pelanggaran unik tanpa keterangan',
    galat: 'duplicate key value violates unique constraint "profiles_kelas_absen_key"',
    harus: 'sudah dipakai di kelas ini',
    tidakBoleh: 'bukan kelas yang Anda ampu',
  },
  {
    nama: 'Galat tak dikenal — pesan asli HARUS ditampilkan',
    galat: 'connection reset by peer',
    harus: 'connection reset by peer',
    tidakBoleh: 'bukan kelas yang Anda ampu',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
let lulus = 0;
let gagal = 0;

console.log('\n' + '='.repeat(74));
console.log('  UJI PENGKLASIFIKASIAN GALAT — createStudentByTeacher');
console.log('='.repeat(74));

for (const k of KASUS) {
  const hasil = klasifikasiGalat(k.galat, { absen: '5', username: 'rizky15' });
  const cocokHarus = hasil.includes(k.harus);
  const langgarLarangan = k.tidakBoleh ? hasil.includes(k.tidakBoleh) : false;

  if (cocokHarus && !langgarLarangan) {
    lulus++;
    console.log(`\n  [v] ${k.nama}`);
    console.log(`      -> ${hasil}`);
  } else {
    gagal++;
    console.log(`\n  [X] ${k.nama}`);
    console.log(`      galat server : ${k.galat}`);
    console.log(`      pesan hasil  : ${hasil}`);
    if (!cocokHarus) console.log(`      SEHARUSNYA memuat: "${k.harus}"`);
    if (langgarLarangan) console.log(`      TIDAK BOLEH memuat: "${k.tidakBoleh}"`);
  }
}

console.log('\n' + '='.repeat(74));
console.log(`  HASIL: ${lulus} lulus, ${gagal} gagal dari ${KASUS.length} kasus`);
console.log('='.repeat(74) + '\n');

process.exit(gagal > 0 ? 1 : 0);
