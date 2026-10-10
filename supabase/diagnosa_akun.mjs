/**
 * Diagnosa lengkap: kenapa login gagal dengan "Profil tidak ditemukan".
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * MENGAPA BERKAS INI DIPERLUAS
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Versi pertama skrip ini hanya mencoba MASUK dan melaporkan berhasil/gagal.
 * Itu belum cukup: login dapat BERHASIL di Supabase Auth, tetapi tetap gagal
 * di aplikasi karena pengambilan profil setelahnya bermasalah. Persis itulah
 * gejalanya — pesannya "Profil tidak ditemukan", bukan "sandi salah".
 *
 * Versi ini menirukan SELURUH urutan yang dilakukan aplikasi saat login:
 *
 *   1. Masuk memakai nama pengguna + sandi      (Supabase Auth)
 *   2. Ambil profil lewat RPC get_my_profile    (langkah tempat gagalnya)
 *   3. Baca nilai yang dikembalikan, khususnya kunci 'found' dan 'role'
 *   4. Periksa kecocokan peran: akun guru tidak boleh masuk lewat pintu siswa
 *
 * Dengan begitu, bila langkah 2 atau 3 yang bermasalah, skrip ini menunjuk
 * langkah yang tepat — bukan sekadar mengatakan "gagal".
 *
 * TIDAK MENGUBAH APA PUN
 *   Hanya memanggil endpoint masuk dan satu fungsi yang sifatnya membaca.
 *   Tidak ada INSERT, UPDATE, atau DELETE. Sandi tidak pernah ditampilkan.
 *
 * CARA MENJALANKAN
 *   Lewat berkas .env:
 *       node supabase/diagnosa_akun.mjs
 *
 *   Atau lewat argumen (lebih praktis, tidak perlu menyimpan sandi):
 *       node supabase/diagnosa_akun.mjs guru <sandi-guru>
 *       node supabase/diagnosa_akun.mjs demo <sandi-demo>
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
const tebal = '═'.repeat(74);

if (!URL_SB || !KUNCI) {
  console.error('  Konfigurasi Supabase tidak ditemukan di .env');
  process.exit(2);
}

// Argumen baris perintah: namaPengguna sandi
const argNama = process.argv[2];
const argSandi = process.argv[3];

/**
 * Menirukan urutan login yang dilakukan aplikasi, langkah demi langkah.
 * Mengembalikan nama langkah yang gagal, atau 'berhasil'.
 */
async function telusuriLogin(username, sandi, keterangan) {
  console.log(`\n${tebal}`);
  console.log(`  ${keterangan}`);
  console.log(tebal);

  if (!sandi) {
    console.log(`  DILEWATI — sandi untuk "${username}" tidak tersedia.`);
    console.log(`  Tambahkan ke .env:  VITE_${keterangan.includes('GURU') ? 'GURU' : 'DEMO'}_PASSWORD=<sandi>`);
    console.log(`  Atau jalankan:      node supabase/diagnosa_akun.mjs ${username} <sandi>`);
    return 'tanpa-sandi';
  }

  const email = `${username}@${DOMAIN}`;
  console.log(`  Alamat surel yang dibentuk aplikasi : ${email}`);
  console.log(`  Sandi                               : ${sandi.length} karakter (tidak ditampilkan)`);

  // ── LANGKAH 1: masuk ────────────────────────────────────────────────────
  console.log(`\n  LANGKAH 1 — Masuk ke Supabase Auth`);
  let isiMasuk;
  try {
    const r = await fetch(`${URL_SB}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: KUNCI, Authorization: `Bearer ${KUNCI}` },
      body: JSON.stringify({ email, password: sandi }),
    });
    isiMasuk = { status: r.status, isi: JSON.parse((await r.text()) || '{}') };
  } catch (e) {
    console.log(`    GAGAL menghubungi server: ${e.message}`);
    return 'galat-jaringan';
  }

  const pesanMasuk = String(
    isiMasuk.isi.error_description || isiMasuk.isi.msg || isiMasuk.isi.message || ''
  ).toLowerCase();

  console.log(`    HTTP ${isiMasuk.status}${pesanMasuk ? `  — ${pesanMasuk.slice(0, 100)}` : ''}`);

  if (!(isiMasuk.status === 200 && isiMasuk.isi.access_token)) {
    if (pesanMasuk.includes('invalid') || pesanMasuk.includes('credentials')) {
      console.log('\n  >>> BERHENTI DI LANGKAH 1: SANDI SALAH ATAU AKUN TIDAK ADA');
      console.log('      Supabase memberi jawaban yang sama untuk kedua hal itu,');
      console.log('      sehingga belum dapat dibedakan dari sini.');
      console.log('      Periksa sandi di Authentication > Users, atau setel ulang.');
      return 'sandi-salah';
    }
    if (pesanMasuk.includes('confirm')) {
      console.log('\n  >>> BERHENTI DI LANGKAH 1: AKUN BELUM TERKONFIRMASI');
      return 'belum-konfirmasi';
    }
    console.log('\n  >>> BERHENTI DI LANGKAH 1: jawaban tidak dikenal.');
    return 'masuk-gagal';
  }

  const token = isiMasuk.isi.access_token;
  const user = isiMasuk.isi.user || {};
  console.log('    BERHASIL. Sesi terbentuk.');
  console.log(`    peran di app_metadata : ${user.app_metadata?.role ?? '(tidak ada)'}`);

  // ── LANGKAH 2: ambil profil, langkah yang dicurigai ─────────────────────
  console.log(`\n  LANGKAH 2 — Ambil profil lewat RPC get_my_profile`);
  console.log('    (inilah langkah tempat aplikasi menampilkan "Profil tidak ditemukan")');

  const r2 = await fetch(`${URL_SB}/rest/v1/rpc/get_my_profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: KUNCI,
      Authorization: `Bearer ${token}`,
      'Accept-Profile': 'public',
    },
    body: '{}',
  });
  const teks2 = await r2.text();
  let isi2;
  try {
    isi2 = JSON.parse(teks2);
  } catch {
    isi2 = teks2;
  }

  console.log(`    HTTP ${r2.status}`);
  console.log(`    Jawaban: ${teks2.slice(0, 320)}`);

  if (r2.status === 401 || r2.status === 403) {
    console.log('\n  >>> GAGAL DI LANGKAH 2: HAK EKSEKUSI FUNGSI DITOLAK');
    console.log('      Login berhasil, tetapi fungsi pembaca profil tidak dapat');
    console.log('      dipanggil. Inilah penyebab pesan "Profil tidak ditemukan".');
    console.log('\n      Perbaiki dengan menjalankan di Supabase SQL Editor:');
    console.log('          GRANT EXECUTE ON FUNCTION public.get_my_profile() TO authenticated;');
    return 'rpc-ditolak';
  }
  if (r2.status === 404) {
    console.log('\n  >>> GAGAL DI LANGKAH 2: FUNGSI TIDAK DITEMUKAN');
    console.log('      Periksa apakah migrasi 02 atau 04 sudah pernah dijalankan.');
    return 'rpc-hilang';
  }
  if (r2.status !== 200) {
    console.log('\n  >>> GAGAL DI LANGKAH 2: FUNGSI ADA TETAPI GAGAL DIJALANKAN');
    console.log('      Pesan di atas biasanya menyebut kolom atau tabel yang');
    console.log('      tidak ada. Kirim keluaran ini untuk diperiksa.');
    return 'rpc-galat';
  }

  // ── LANGKAH 3: baca isi jawaban ─────────────────────────────────────────
  console.log(`\n  LANGKAH 3 — Membaca isi jawaban`);
  if (isi2 === null || isi2 === undefined || (Array.isArray(isi2) && isi2.length === 0)) {
    console.log('    Jawaban KOSONG.');
  } else {
    const profil = Array.isArray(isi2) ? isi2[0] : isi2;
    if (profil && typeof profil === 'object') {
      const punyaFound = Object.prototype.hasOwnProperty.call(profil, 'found');
      console.log(`    kunci 'found' ada?  : ${punyaFound ? 'YA' : 'TIDAK'}`);
      console.log(`    nilai 'found'       : ${JSON.stringify(profil.found)}`);
      console.log(`    username            : ${profil.username ?? '(tidak ada)'}`);
      console.log(`    role                : ${profil.role ?? '(tidak ada)'}`);
      console.log(`    unlocked_level      : ${profil.unlocked_level ?? '(tidak ada)'}`);

      // Inilah pemeriksaan yang dilakukan aplikasi:
      //     if (!payload || payload.found === false) -> "Profil tidak ditemukan"
      const aplikasiMenolak = !profil || profil.found === false;
      console.log(`\n    Pemeriksaan aplikasi (!payload || payload.found === false)`);
      console.log(`    hasilnya            : ${aplikasiMenolak ? 'MENOLAK' : 'MENERIMA'}`);

      if (aplikasiMenolak) {
        console.log('\n  >>> GAGAL DI LANGKAH 3: APLIKASI MENOLAK JAWABAN INI');
        if (!punyaFound) {
          console.log('      Kunci \'found\' tidak ada pada jawaban. Ini terjadi bila');
          console.log('      versi fungsi di database BUKAN versi dari migrasi 01/02.');
          console.log('      Jalankan ulang migrasi 02 untuk memulihkan definisinya.');
          return 'found-hilang';
        }
        console.log('      Fungsi menjawab found=false, artinya profilnya TIDAK ADA');
        console.log('      untuk id pengguna ini. Periksa dengan query:');
        console.log(`          SELECT * FROM public.profiles WHERE username = '${username}';`);
        return 'profil-tidak-ada';
      }

      // Langkah 4: kecocokan peran
      console.log(`\n  LANGKAH 4 — Kecocokan peran (pemeriksaan terakhir aplikasi)`);
      const mauGuru = keterangan.includes('GURU');
      if (mauGuru && profil.role !== 'teacher') {
        console.log(`    Peran profil: ${profil.role}, tetapi mencoba masuk lewat pintu GURU.`);
        console.log('\n  >>> GAGAL DI LANGKAH 4: "Akun ini bukan akun Guru."');
        console.log('      Perbaiki dengan:');
        console.log(`          UPDATE public.profiles SET role='teacher' WHERE username='${username}';`);
        return 'peran-salah';
      }
      if (!mauGuru && profil.role === 'teacher') {
        console.log('\n  >>> GAGAL DI LANGKAH 4: akun guru dicoba lewat pintu siswa.');
        return 'peran-salah';
      }
    }
  }

  console.log(`\n  >>> SELURUH LANGKAH BERHASIL — akun ini seharusnya dapat masuk.`);
  console.log('      Bila di aplikasi tetap gagal, masalahnya ada di sisi peramban:');
  console.log('      versi lama yang tersimpan, atau alamat Supabase yang berbeda.');
  return 'berhasil';
}

// ═══════════════════════════════════════════════════════════════════════════
console.log(`\n${tebal}`);
console.log('  DIAGNOSA LOGIN — menirukan urutan yang dilakukan aplikasi');
console.log(tebal);
console.log(`\n  Supabase    : ${URL_SB}`);
console.log(`  Domain mail : @${DOMAIN}`);
console.log('  Skrip ini TIDAK mengubah apa pun (hanya masuk dan membaca).');

const daftar = argNama
  ? [[argNama, argSandi, `AKUN ${argNama.toUpperCase()}`]]
  : [
      [nilai('VITE_GURU_USERNAME') || 'guru', nilai('VITE_GURU_PASSWORD'), 'AKUN GURU'],
      [nilai('VITE_DEMO_USERNAME') || 'demo', nilai('VITE_DEMO_PASSWORD'), 'AKUN DEMO'],
    ];

const hasil = {};
for (const [nama, sandi, ket] of daftar) {
  hasil[ket] = await telusuriLogin(nama, sandi, ket);
}

console.log(`\n${tebal}`);
console.log('  RINGKASAN');
console.log(tebal);
const arti = {
  berhasil: 'BERHASIL — akun dapat masuk',
  'sandi-salah': 'GAGAL di langkah 1: sandi salah atau akun tidak ada',
  'belum-konfirmasi': 'GAGAL di langkah 1: akun belum dikonfirmasi',
  'rpc-ditolak': 'GAGAL di langkah 2: HAK FUNGSI DITOLAK  <-- paling mungkin',
  'rpc-hilang': 'GAGAL di langkah 2: fungsi get_my_profile tidak ada',
  'rpc-galat': 'GAGAL di langkah 2: fungsi gagal dijalankan',
  'found-hilang': "GAGAL di langkah 3: kunci 'found' tidak ada",
  'profil-tidak-ada': 'GAGAL di langkah 3: profil tidak ada di tabel',
  'peran-salah': 'GAGAL di langkah 4: peran tidak cocok dengan pintu masuk',
  'masuk-gagal': 'GAGAL di langkah 1: jawaban tidak dikenal',
  'galat-jaringan': 'TIDAK DIUJI: jaringan',
  'tanpa-sandi': 'TIDAK DIUJI: sandi belum tersedia',
};
for (const [ket, h] of Object.entries(hasil)) {
  console.log(`  ${ket.padEnd(12)}: ${arti[h] ?? h}`);
}
console.log('');
