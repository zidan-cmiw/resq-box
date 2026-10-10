/**
 * PEMBUKTIAN: uji ini benar-benar dapat GAGAL.
 *
 * MENGAPA BERKAS INI ADA
 *   `scripts/uji_pesan_galat.mjs` melaporkan 10 lulus dari 10 kasus. Tetapi
 *   uji yang selalu lulus tidak membuktikan apa pun — ia bisa saja tidak
 *   menguji apa-apa.
 *
 *   Berkas ini memakai logika LAMA yang bermasalah (versi yang menyebabkan
 *   notifikasi "Kelas ini bukan kelas yang Anda ampu" muncul untuk masalah
 *   password dan nomor absen), lalu menjalankan kasus uji yang SAMA. Bila
 *   ujinya benar, hasilnya HARUS gagal.
 *
 * Cara menjalankan:
 *     node scripts/uji_pesan_galat_lama.mjs
 *
 * Hasil yang diharapkan: BANYAK GAGAL. Itu berarti ujinya bekerja.
 */
const KASUS = [
  { nama: 'Nomor absen sudah dipakai', galat: 'Nomor absen 5 sudah dipakai siswa lain di kelas ini. Pilih nomor lain.', harus: 'sudah dipakai siswa lain', tidakBoleh: 'bukan kelas yang Anda ampu' },
  { nama: 'Username sudah ada', galat: 'Username rizky15 sudah ada! Pilih username lain.', harus: 'sudah ada', tidakBoleh: 'bukan kelas yang Anda ampu' },
  { nama: 'Password terlalu pendek', galat: 'Password minimal 6 karakter.', harus: 'Password minimal 6 karakter', tidakBoleh: 'bukan kelas yang Anda ampu' },
  { nama: 'Kelas memang bukan milik guru', galat: 'Kelas RESQ-8A bukan milik Anda.', harus: 'bukan kelas yang Anda ampu', tidakBoleh: null },
  { nama: 'Bukan akun guru', galat: 'Hanya guru yang boleh membuat akun siswa.', harus: 'Hanya akun guru', tidakBoleh: 'bukan kelas yang Anda ampu' },
  { nama: 'Kelas tidak ditemukan', galat: 'Kode kelas RESQ-9Z tidak ditemukan.', harus: 'tidak ditemukan di server', tidakBoleh: 'bukan kelas yang Anda ampu' },
  { nama: 'Sesi berakhir', galat: 'Harus login.', harus: 'Sesi Anda berakhir', tidakBoleh: 'bukan kelas yang Anda ampu' },
  { nama: 'Pelanggaran unik tanpa keterangan', galat: 'duplicate key value violates unique constraint "profiles_kelas_absen_key"', harus: 'sudah dipakai di kelas ini', tidakBoleh: 'bukan kelas yang Anda ampu' },
  { nama: 'Galat tak dikenal — pesan asli HARUS ditampilkan', galat: 'connection reset by peer', harus: 'connection reset by peer', tidakBoleh: 'bukan kelas yang Anda ampu' },
];

// ── LOGIKA LAMA — sengaja disalin apa adanya dari versi yang bermasalah ──
function klasifikasiGalatLama(pesanAsli, { absen = '5', username = 'rizky15' } = {}) {
  const msg = (pesanAsli || '').toLowerCase();
  if (msg.includes('nomor absen') || msg.includes('absen')) {
    return pesanAsli.includes('sudah dipakai')
      ? 'Nomor absen ' + absen + ' sudah dipakai siswa lain di kelas ini. Pilih nomor lain.'
      : 'Nomor absen harus berupa angka (1-3 digit).';
  }
  if (msg.includes('sudah')) {
    return 'Username "' + username + '" sudah ada!';
  }
  if (msg.includes('bukan milik') || msg.includes('hanya guru')) {
    return 'Kelas ini bukan kelas yang Anda ampu.';
  }
  return 'Gagal membuat akun siswa di server.';
}

let lulus = 0;
let gagal = 0;

console.log('\n' + '='.repeat(74));
console.log('  UJI DENGAN LOGIKA LAMA — hasilnya HARUS BANYAK GAGAL');
console.log('='.repeat(74));

for (const k of KASUS) {
  const hasil = klasifikasiGalatLama(k.galat, { absen: '5', username: 'rizky15' });
  const cocokHarus = hasil.includes(k.harus);
  const langgarLarangan = k.tidakBoleh ? hasil.includes(k.tidakBoleh) : false;

  if (cocokHarus && !langgarLarangan) {
    lulus++;
    console.log(`\n  [v] ${k.nama}`);
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
console.log('');
console.log('  Bila angka gagal > 0, ujinya BEKERJA: ia mampu membedakan logika');
console.log('  yang benar dari yang salah. Itulah yang perlu dibuktikan.');
console.log('='.repeat(74) + '\n');

// Berkas ini SENGAJA keluar dengan kode 0: tujuannya menunjukkan bahwa
// logika lama memang salah, bukan untuk lulus.
process.exit(0);
