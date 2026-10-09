/**
 * Periksa apakah pendaftaran mandiri di Supabase SUDAH benar-benar tertutup.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * MENGAPA BERKAS INI ADA
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Setelah pendaftaran mandiri ditutup di aplikasi (tombol dan formulirnya
 * dihapus, fungsinya menolak), masih ada satu pintu yang TIDAK dapat ditutup
 * lewat kode: endpoint pendaftaran Supabase. Endpoint itu berjalan di luar
 * PostgreSQL, sehingga tidak ada trigger atau policy yang dapat memblokirnya.
 *
 * Satu-satunya cara menutupnya adalah mematikan setelan di dashboard:
 *
 *     Authentication → Sign In / Providers → Email
 *         matikan "Allow new users to sign up"
 *
 * Selama setelan itu masih menyala, siapa pun yang tahu alamat Supabase dan
 * kunci `anon` (yang memang publik, karena dipakai di peramban) dapat membuat
 * akun lewat API — walaupun di tampilan tombolnya sudah tidak ada.
 *
 * Akun yang dibuat lewat jalan itu tetap akan mendapat profil siswa dengan
 * peran 'student' dari trigger, tetapi kelasnya kosong dan ia tidak dapat
 * membaca data kelas mana pun. Jadi kebocoran datanya TIDAK terjadi, tetapi
 * tabel `profiles` dapat dipenuhi akun sampah.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * CARA KERJA
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Skrip ini mengirim SATU permintaan pendaftaran dengan alamat yang sengaja
 * dibuat tidak mungkin dipakai orang lain, lalu MEMBACA JAWABANNYA:
 *
 *   - Ditolak (mis. "signups not allowed")  -> pendaftaran sudah TERTUTUP
 *   - Diterima / sesi dibuat                -> pendaftaran MASIH TERBUKA
 *
 * Akun yang mungkin terbuat dari pengujian ini memakai awalan `zz_uji_` dan
 * email `@resqbox.local`, sehingga mudah dikenali dan dihapus. Skrip ini
 * MENAMPILKAN perintah penghapusannya bila akun itu terbuat.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * CARA MENJALANKAN
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *     node supabase/cek_pendaftaran.mjs
 *
 * Membaca VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY dari berkas `.env`,
 * atau dari variabel lingkungan bila keduanya sudah diisi.
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const AKAR = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Baca pasangan KEY=VALUE dari sebuah berkas .env. */
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
    if (
      (nilai.startsWith('"') && nilai.endsWith('"')) ||
      (nilai.startsWith("'") && nilai.endsWith("'"))
    ) {
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

const garis = '─'.repeat(72);

if (!URL_SB || !KUNCI) {
  console.error(`\n${garis}`);
  console.error('  Tidak dapat memeriksa: konfigurasi Supabase tidak ditemukan.');
  console.error(garis);
  console.error('\n  Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di berkas .env,');
  console.error('  atau jalankan dengan variabel lingkungan yang sudah diisi.\n');
  process.exit(2);
}

// Alamat yang sengaja tidak mungkin dipakai orang lain, berawalan zz_uji_
const cap = Date.now().toString(36);
const USERNAME = `zz_uji_${cap}`;
const PASSWORD = `Uji-${cap}-Aman1`;
const EMAIL = `${USERNAME}@resqbox.local`;

console.log(`\n${garis}`);
console.log('  MEMERIKSA APAKAH PENDAFTARAN MANDIRI SUDAH TERTUTUP');
console.log(garis);
console.log(`\n  Alamat Supabase : ${URL_SB}`);
console.log(`  Alamat uji      : ${EMAIL}`);
console.log('\n  Mengirim satu permintaan pendaftaran untuk melihat jawabannya...\n');

let respons;
let badan = '';
try {
  respons = await fetch(`${URL_SB}/auth/v1/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: KUNCI,
      Authorization: `Bearer ${KUNCI}`,
    },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  badan = await respons.text();
} catch (e) {
  console.error(`  GAGAL menghubungi server: ${e.message}`);
  console.error('\n  Periksa koneksi internet, lalu jalankan ulang.\n');
  process.exit(2);
}

const kode = respons.status;
let isi = {};
try {
  isi = JSON.parse(badan);
} catch {
  /* jawaban bukan JSON */
}

// ── Pembacaan jawaban ──────────────────────────────────────────────────────
// GoTrue menolak pendaftaran yang dimatikan dengan HTTP 422 dan pesan
// "Signups not allowed for this instance". Kunci pesan itu yang diperiksa,
// bukan sekadar kode HTTP-nya, supaya tidak salah menyimpulkan.
const pesan = String(isi.msg || isi.message || isi.error_description || isi.error || '').toLowerCase();
const ditolakKarenaTutup =
  pesan.includes('signup') && (pesan.includes('not allowed') || pesan.includes('disabled'));
const terbuat = kode === 200 && (isi.id || isi.user || isi.access_token);
const sudahAda = pesan.includes('already registered') || pesan.includes('already been registered');

console.log(`  Jawaban server : HTTP ${kode}`);
if (pesan) console.log(`  Pesan          : ${pesan.slice(0, 120)}`);
console.log('');

console.log(garis);
if (ditolakKarenaTutup) {
  console.log('  HASIL: PENDAFTARAN MANDIRI SUDAH TERTUTUP');
  console.log(garis);
  console.log(`
  Server menolak permintaan pendaftaran. Ini berarti setelan
  "Allow new users to sign up" sudah dimatikan — pintu yang tidak dapat
  ditutup lewat kode kini benar-benar tertutup.

  Tidak ada akun yang terbuat dari pengujian ini.
`);
  process.exit(0);
}

if (sudahAda) {
  console.log('  HASIL: TIDAK DAPAT DISIMPULKAN');
  console.log(garis);
  console.log(`
  Server menjawab bahwa alamat itu sudah terdaftar. Ini jarang terjadi karena
  alamatnya dibuat acak. Jalankan ulang skrip ini.
`);
  process.exit(2);
}

if (terbuat) {
  console.log('  HASIL: >>> PENDAFTARAN MANDIRI MASIH TERBUKA <<<');
  console.log(garis);
  console.log(`
  Server MENERIMA pendaftaran. Siapa pun yang tahu alamat Supabase dan kunci
  'anon' dapat membuat akun lewat API, walaupun tombolnya sudah tidak ada di
  tampilan.

  Akun itu tetap tidak dapat membaca data kelas mana pun (kelasnya kosong dan
  RLS tetap berlaku), tetapi tabel 'profiles' dapat dipenuhi akun sampah.

  YANG HARUS DILAKUKAN — matikan setelannya:

      Authentication → Sign In / Providers → Email
          matikan "Allow new users to sign up"

  Setelah itu jalankan ulang skrip ini; hasilnya harus "SUDAH TERTUTUP".

  ⚠️ Sebuah akun uji mungkin sudah terbuat dari pengujian ini:
        username : ${USERNAME}
     Hapus lewat SQL Editor:
        DELETE FROM auth.users WHERE email = '${EMAIL}';
        DELETE FROM public.profiles WHERE username = '${USERNAME}';
`);
  process.exit(1);
}

console.log('  HASIL: TIDAK DAPAT DISIMPULKAN');
console.log(garis);
console.log(`
  Jawaban server tidak cocok dengan pola yang dikenal, jadi statusnya tidak
  dapat dipastikan. Kirim keluaran di atas untuk diperiksa lebih lanjut.

  Bila kode HTTP 422 dengan pesan menyebut "signup", kemungkinan besar
  pendaftaran sudah tertutup.
`);
process.exit(2);
