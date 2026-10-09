/**
 * Diagnosa akun guru & demo yang dilaporkan hilang.
 *
 * MENGAPA BERKAS INI ADA
 *   Setelah migrasi 09 dijalankan, akun guru dan akun demo dilaporkan tidak
 *   dapat dipakai lagi. Ada beberapa kemungkinan yang sangat berbeda akibatnya,
 *   dan menebak di antara kemungkinan itu berbahaya:
 *
 *     a. Akun masih ada, hanya gagal masuk (mis. email/sandi berubah)
 *     b. Akun masih ada tetapi tidak muncul di tampilan tertentu
 *     c. Akun benar-benar terhapus dari auth.users
 *
 *   Untuk membedakannya, skrip ini MENCOBA MASUK sungguhan ke Supabase memakai
 *   kredensial dari .env. Jawaban server menunjukkan dengan pasti yang mana.
 *
 * PENTING — SKRIP INI TIDAK MENGUBAH APA PUN
 *   Ia hanya memanggil endpoint masuk (sign-in) dan membaca jawabannya.
 *   Tidak ada INSERT, UPDATE, atau DELETE. Sandi tidak pernah ditampilkan.
 *
 * CARA MENJALANKAN
 *   node supabase/diagnosa_akun.mjs
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const AKAR = join(dirname(fileURLToPath(import.meta.url)), '..');

function bacaEnv(nama) {
  const jalur = join(AKAR, nama);
  if (!existsSync(jalur)) return {};
  const hasil = {};
  for (const baris of readFileSync(jalur, 'utf8').split('\n')) {
    const t = baris.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i < 0) continue;
    let nilai = t.slice(i + 1).trim();
    if ((nilai.startsWith('"') && nilai.endsWith('"')) || (nilai.startsWith("'") && nilai.endsWith("'"))) {
      nilai = nilai.slice(1, -1);
    }
    hasil[t.slice(0, i).trim()] = nilai;
  }
  return hasil;
}

const dariFile = { ...bacaEnv('.env'), ...bacaEnv('.env.local') };
const nilai = (k) => process.env[k] ?? dariFile[k] ?? '';

const URL_SB = nilai('VITE_SUPABASE_URL');
const KUNCI = nilai('VITE_SUPABASE_ANON_KEY');
const DOMAIN = nilai('VITE_AUTH_EMAIL_DOMAIN') || 'resqbox.local';

const garis = '─'.repeat(74);

if (!URL_SB || !KUNCI) {
  console.error('  Konfigurasi Supabase tidak ditemukan di .env');
  process.exit(2);
}

console.log(`\n${garis}`);
console.log('  DIAGNOSA AKUN GURU & DEMO');
console.log(garis);
console.log(`\n  Supabase   : ${URL_SB}`);
console.log(`  Domain mail: @${DOMAIN}`);
console.log('\n  Skrip ini hanya MENCOBA MASUK (tidak mengubah apa pun).');

/**
 * Coba masuk. Mengembalikan keterangan hasilnya.
 *
 * PENTING: alamat surel dibuat dari nama pengguna, karena aplikasi ini memakai
 * alamat sintetis `<username>@resqbox.local`.
 */
async function cobaMasuk(username, sandi, keterangan) {
  const email = `${username}@${DOMAIN}`;
  console.log(`\n${garis}`);
  console.log(`  ${keterangan}`);
  console.log(garis);
  console.log(`  Alamat uji : ${email}`);
  console.log(`  Sandi      : ${sandi ? `(dari .env, ${sandi.length} karakter)` : '(TIDAK ADA di .env)'}`);

  if (!sandi) {
    console.log('\n  >>> Dilewati: sandi tidak tersedia di .env, jadi tidak dapat diuji.');
    return 'tanpa-sandi';
  }

  let respons, badan;
  try {
    respons = await fetch(`${URL_SB}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: KUNCI,
        Authorization: `Bearer ${KUNCI}`,
      },
      body: JSON.stringify({ email, password: sandi }),
    });
    badan = await respons.text();
  } catch (e) {
    console.log(`\n  GAGAL menghubungi server: ${e.message}`);
    return 'galat-jaringan';
  }

  let isi = {};
  try {
    isi = JSON.parse(badan);
  } catch {
    /* bukan JSON */
  }

  const pesan = String(
    isi.error_description || isi.msg || isi.message || isi.error || ''
  ).toLowerCase();

  console.log(`\n  Jawaban : HTTP ${respons.status}`);
  if (pesan) console.log(`  Pesan   : ${pesan.slice(0, 110)}`);

  if (respons.status === 200 && isi.access_token) {
    const u = isi.user || {};
    const app = u.app_metadata || {};
    console.log('\n  >>> AKUN MASIH ADA DAN DAPAT DIPAKAI');
    console.log(`      peran di app_metadata : ${app.role ?? '(tidak ada)'}`);
    console.log(`      kelas                 : ${app.classroom_code ?? '(tidak ada)'}`);
    console.log('      Kesimpulan: akun TIDAK terhapus. Kalau tidak terlihat di');
    console.log('      tampilan, penyebabnya ada di aplikasi, bukan di database.');
    return 'bisa-masuk';
  }

  if (pesan.includes('invalid') || pesan.includes('credentials')) {
    console.log('\n  >>> SANDI TIDAK COCOK, ATAU ALAMAT SURELNYA BERBEDA');
    console.log('      Ini BUKAN bukti akun terhapus. Supabase memberi jawaban yang');
    console.log('      sama untuk "akun tidak ada" dan "sandi salah", jadi keduanya');
    console.log('      belum dapat dibedakan dari sini.');
    return 'sandi-atau-alamat';
  }

  if (pesan.includes('confirm') || pesan.includes('not confirmed')) {
    console.log('\n  >>> AKUN ADA TETAPI BELUM TERKONFIRMASI');
    console.log('      Akun yang dibuat guru seharusnya langsung terkonfirmasi.');
    return 'belum-konfirmasi';
  }

  console.log('\n  >>> Jawaban tidak dikenal — kirim keluaran ini untuk diperiksa.');
  return 'tidak-dikenal';
}

const hasil = {};

// Akun guru & demo: sandi diambil dari .env bila ada. Nama variabelnya
// mengikuti kebiasaan yang sudah dipakai proyek ini.
hasil.guru = await cobaMasuk(
  nilai('VITE_GURU_USERNAME') || 'guru',
  nilai('VITE_GURU_PASSWORD'),
  'AKUN GURU'
);

hasil.demo = await cobaMasuk(
  nilai('VITE_DEMO_USERNAME') || 'demo',
  nilai('VITE_DEMO_PASSWORD'),
  'AKUN DEMO'
);

console.log(`\n${garis}`);
console.log('  RINGKASAN');
console.log(garis);
for (const [nama, h] of Object.entries(hasil)) {
  const arti = {
    'bisa-masuk': 'AKUN ADA, dapat dipakai',
    'sandi-atau-alamat': 'perlu diperiksa (sandi/alamat)',
    'belum-konfirmasi': 'ADA, tetapi belum dikonfirmasi',
    'tanpa-sandi': 'tidak diuji (sandi tidak ada di .env)',
    'galat-jaringan': 'tidak diuji (jaringan)',
    'tidak-dikenal': 'tidak dapat disimpulkan',
  }[h] || h;
  console.log(`  akun ${nama.padEnd(6)} : ${arti}`);
}

console.log(`
  CATATAN: bila hasilnya "tidak diuji (sandi tidak ada di .env)", tambahkan
  baris berikut ke .env lalu jalankan ulang:

      VITE_GURU_PASSWORD=<sandi guru>
      VITE_DEMO_PASSWORD=<sandi demo>

  Skrip ini tidak pernah menampilkan sandi, hanya panjangnya.
`);
