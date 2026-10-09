/**
 * Periksa apakah fungsi RPC yang dipakai saat login dapat dipanggil.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * MENGAPA BERKAS INI ADA
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Login gagal dengan pesan "Profil tidak ditemukan", padahal query langsung ke
 * tabel menunjukkan profil guru dan demo ADA, emailnya benar, sudah
 * terkonfirmasi, dan perannya benar. Berarti masalahnya bukan pada datanya,
 * melainkan pada saat aplikasi MEMANGGIL fungsi `get_my_profile`.
 *
 * Pesan itu keluar dari dua tempat:
 *
 *     if (profileRes.error) { ... 'Profil tidak ditemukan' }   // RPC error
 *     if (!payload || payload.found === false) { ... }         // found=false
 *
 * Skrip ini memanggil fungsi itu lewat REST API untuk melihat jawaban
 * SEBENARNYA dari server — bukan dugaan.
 *
 * Yang kemungkinan besar terjadi: `REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public
 * FROM authenticated` di migrasi 04 mencabut hak eksekusi SEMUA fungsi,
 * lalu `GRANT` dikembalikan satu per satu. Bila daftar GRANT menyebut tanda
 * tangan fungsi yang tidak cocok (mis. `get_my_profile()` padahal fungsinya
 * memiliki parameter), GRANT itu GAGAL atau tidak mengenai sasaran — dan
 * fungsinya tetap tertutup untuk pengguna yang sudah login.
 *
 * PENTING — TIDAK MENGUBAH APA PUN
 *   Skrip ini hanya MENELEPON fungsi, tanpa argumen yang mengubah data.
 *   `get_my_profile` hanya membaca. Tidak ada INSERT/UPDATE/DELETE.
 *
 * CARA MENJALANKAN
 *   node supabase/cek_rpc.mjs
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
const garis = '─'.repeat(74);

if (!URL_SB || !KUNCI) {
  console.error('  Konfigurasi Supabase tidak ditemukan di .env');
  process.exit(2);
}

/** Panggil sebuah fungsi RPC tanpa login. */
async function panggilRpc(nama, argumen = {}) {
  const r = await fetch(`${URL_SB}/rest/v1/rpc/${nama}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: KUNCI,
      Authorization: `Bearer ${KUNCI}`,
    },
    body: JSON.stringify(argumen),
  });
  const teks = await r.text();
  let isi;
  try {
    isi = JSON.parse(teks);
  } catch {
    isi = teks;
  }
  return { status: r.status, isi, mentah: teks.slice(0, 400) };
}

console.log(`\n${garis}`);
console.log('  MEMERIKSA FUNGSI RPC YANG DIPAKAI SAAT LOGIN');
console.log(garis);
console.log(`\n  Supabase : ${URL_SB}`);
console.log('\n  Dipanggil TANPA login (memakai kunci anon), untuk melihat apakah');
console.log('  fungsi dapat dijangkau sama sekali dan galat apa yang muncul.');

// ── 1. get_my_profile — fungsi yang dicurigai ─────────────────────────────
console.log(`\n${garis}`);
console.log('  1. get_my_profile()   <-- dipanggil setiap kali login');
console.log(garis);
{
  const h = await panggilRpc('get_my_profile');
  console.log(`  HTTP ${h.status}`);
  console.log(`  Jawaban: ${h.mentah}`);
  if (h.status === 404) {
    console.log('\n  >>> FUNGSI TIDAK DITEMUKAN ATAU TERTUTUP');
    console.log('      Ini penjelasan yang paling mungkin untuk "Profil tidak');
    console.log('      ditemukan" walaupun profilnya ada di tabel.');
  } else if (h.status === 401 || h.status === 403) {
    console.log('\n  >>> FUNGSI MENOLAK AKSES (hak eksekusi dicabut)');
    console.log('      Haknya harus dikembalikan dengan GRANT EXECUTE.');
  } else if (h.status === 400 || h.status === 500) {
    console.log('\n  >>> FUNGSI ADA TETAPI GAGAL DIJALANKAN');
    console.log('      Periksa pesan di atas — biasanya ada kolom yang tidak ada.');
  } else if (h.status === 200) {
    console.log('\n  >>> Fungsi dapat dipanggil. Karena tanpa login, hasilnya');
    console.log('      seharusnya berupa galat "Harus login". Bila justru');
    console.log('      mengembalikan data, ada masalah lain — kirim keluaran ini.');
  }
}

// ── 2. Pembanding: fungsi yang seharusnya boleh tanpa login ───────────────
console.log(`\n${garis}`);
console.log('  2. Pembanding: username_available() — seharusnya BOLEH tanpa login');
console.log(garis);
{
  const h = await panggilRpc('username_available', { p_username: 'zz_cek_rpc' });
  console.log(`  HTTP ${h.status}`);
  console.log(`  Jawaban: ${h.mentah}`);
  if (h.status === 200) {
    console.log('\n  Baik: REST API dan kunci anon berfungsi. Jadi bila get_my_profile');
    console.log('  gagal di atas, masalahnya memang pada fungsi ITU, bukan koneksi.');
  } else {
    console.log('\n  Perhatian: fungsi pembanding ini pun gagal, sehingga masalahnya');
    console.log('  mungkin pada koneksi atau kunci, bukan pada get_my_profile.');
  }
}

// ── 3. Membandingkan tanda tangan yang di-GRANT dengan yang ada ───────────
console.log(`\n${garis}`);
console.log('  3. Ringkasan pemeriksaan daftar GRANT di migrasi');
console.log(garis);
{
  const mig = join(AKAR, 'supabase', 'migrations');
  const berkas = ['02_rpc_and_hardening.sql', '04_lock_functions_and_cleanup.sql', '09_absen_unik_per_kelas.sql'];
  for (const b of berkas) {
    const p = join(mig, b);
    if (!existsSync(p)) continue;
    const t = readFileSync(p, 'utf8');
    const baris = t.split('\n').filter((l) => /GRANT EXECUTE ON FUNCTION public\.get_my_profile/.test(l));
    console.log(`  ${b}:`);
    if (baris.length) {
      for (const l of baris) console.log(`      ${l.trim()}`);
    } else {
      console.log('      (tidak menyebut get_my_profile)');
    }
  }
}

console.log(`
${garis}
  LANGKAH BERIKUTNYA
${garis}

  Bila hasil nomor 1 menunjukkan FUNGSI TIDAK DITEMUKAN atau MENOLAK AKSES,
  jalankan perintah ini di Supabase SQL Editor untuk memulihkannya:

      GRANT EXECUTE ON FUNCTION public.get_my_profile() TO authenticated;

  Lalu jalankan ulang skrip ini. Bila hasilnya berubah, masalahnya memang
  pada hak eksekusi, dan login akan berfungsi kembali.

  Bila hasilnya tetap sama, kirim seluruh keluaran di atas untuk diperiksa.
`);
