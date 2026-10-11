/**
 * MODE TAMU — mencoba RESQ-BOX tanpa akun, tanpa menyentuh database.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * MENGAPA MODE INI ADA
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   Ada orang yang hanya ingin MENCOBA aplikasi ini — guru yang menilai,
 *   orang tua, atau siswa yang belum punya akun. Meminta mereka membuat akun
 *   lebih dahulu membuat mereka berhenti sebelum mencoba.
 *
 *   Karena itu disediakan tombol "Coba Tanpa Login" di halaman masuk.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * ATURAN UTAMA: TIDAK BOLEH MENYENTUH DATABASE
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   Permintaan pemilik proyek: tamu "bener-bener buat main biasa aja", dan
 *   nilainya "ga masuk ke database".
 *
 *   Aturan itu TIDAK dijalankan dengan harapan "semoga tidak terpanggil".
 *   Ada 34 tempat di 9 berkas yang menulis ke database, dan mengandalkan
 *   setiap tempat itu memeriksa mode tamu sendiri akan rapuh — satu tempat
 *   yang terlewat berarti nilai tamu masuk ke rapor guru.
 *
 *   Sebagai gantinya, penjaganya dipasang di LAPISAN TERENDAH: seluruh
 *   penulisan ke database lewat `supabase.rpc`, dan `supabaseClient.ts`
 *   menolak setiap `rpc` yang menulis selama mode tamu aktif. Dengan begitu
 *   aturan itu berlaku untuk SELURUH aplikasi sekaligus, termasuk kode yang
 *   ditulis nanti.
 *
 *   Penjaganya ada di `blokirTulisUntukTamu()` di bawah, dipanggil dari
 *   pembungkus klien di `supabaseClient.ts`.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * APA YANG TETAP BEKERJA DI MODE TAMU
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   - Seluruh Level 1, 2, dan 3 dapat dimainkan
 *   - Kemajuan disimpan di perangkat sendiri (localStorage), supaya tamu
 *     dapat melanjutkan bila menutup lalu membuka lagi
 *   - Nilai tampil di akhir level sebagai umpan balik
 *
 *   Yang TIDAK bekerja, dan memang tidak seharusnya:
 *   - Nilai tidak masuk ke rapor guru
 *   - Tidak dapat membuka Posko Guru (memerlukan akun guru sungguhan)
 *   - Sambungan ke diorama fisik tetap bekerja — itu lewat WebSocket
 *     langsung ke ESP32, tidak melalui database
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * MENGAPA PENANDA DISIMPAN DI localStorage
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   Supaya tamu yang menyegarkan halaman (atau menutup lalu membuka lagi)
 *   tidak perlu menekan tombolnya sekali lagi. Penanda ini juga yang dibaca
 *   penjaga database, dan ia harus tersedia SEBELUM React dijalankan.
 */

// ── Penanda yang dibaca lapisan database ──────────────────────────────────
//
// Disimpan juga sebagai variabel modul, bukan hanya di localStorage, supaya
// pemeriksaannya cepat dan tetap benar walau localStorage tidak tersedia
// (mis. mode penyamaran yang ketat).
const KUNCI_PENANDA = 'resqbox-mode-tamu';

let tamuAktif = false;

// Baca penanda saat modul dimuat, SEBELUM React berjalan.
try {
  if (typeof localStorage !== 'undefined') {
    tamuAktif = localStorage.getItem(KUNCI_PENANDA) === '1';
  }
} catch {
  // localStorage tidak tersedia — anggap bukan tamu.
  tamuAktif = false;
}

/**
 * Apakah aplikasi sedang berjalan dalam mode tamu.
 *
 * Dipakai penjaga database, jadi fungsi ini harus TIDAK PERNAH melempar.
 */
export function sedangModeTamu(): boolean {
  return tamuAktif;
}

/**
 * Nama prosedur database yang MENULIS data.
 *
 * Prosedur di luar daftar ini hanya MEMBACA dan tetap diizinkan, supaya
 * halaman yang menampilkan data contoh tidak rusak di mode tamu.
 *
 * MENGAPA DIDAFTARKAN, BUKAN SEBALIKNYA
 *   Pendekatan "blokir semuanya kecuali daftar baca" lebih aman, tetapi
 *   akan memutus halaman yang memang perlu membaca sesuatu. Pendekatan
 *   "blokir yang menulis" dipilih karena daftar tulisnya JELAS dan TERBATAS:
 *   seluruhnya ada di `supabaseClient.ts` dan dapat diperiksa.
 *
 *   Bila nanti ada prosedur tulis baru, ia HARUS ditambahkan ke sini —
 *   dan ada pemeriksa otomatis (`scripts/periksa_mode_tamu.py`) yang
 *   memastikan tidak ada prosedur tulis yang terlewat.
 */
const RPC_MENULIS = new Set([
  'create_my_classroom',
  'rename_my_classroom',
  'delete_my_classroom',
  'teacher_create_student',
  'delete_my_student',
  'update_my_profile',
  'update_my_teacher_profile',
  'submit_level_result',
]);

/**
 * Menolak penulisan database selama mode tamu.
 *
 * @param namaRpc Nama prosedur yang hendak dipanggil.
 * @returns Objek galat bila ditolak, atau null bila boleh dilanjutkan.
 */
export function blokirTulisUntukTamu(
  namaRpc: string
): { message: string } | null {
  if (!tamuAktif) return null;
  if (!RPC_MENULIS.has(namaRpc)) return null;

  // Pesannya sengaja ramah dan menjelaskan, bukan sekadar "ditolak".
  // Ia dapat muncul di layar, jadi tidak boleh terdengar seperti kerusakan.
  return {
    message:
      'Mode tamu: kemajuan tidak disimpan ke rapor. ' +
      'Masuk dengan akun sekolah bila ingin nilaimu tercatat.',
  };
}

/** Daftar prosedur yang diblokir — dipakai pemeriksa otomatis. */
export function daftarRpcDiblokir(): string[] {
  return [...RPC_MENULIS];
}

/** Menyalakan mode tamu. */
export function nyalakanModeTamu(): void {
  tamuAktif = true;
  try {
    localStorage.setItem(KUNCI_PENANDA, '1');
  } catch {
    // Tidak dapat disimpan — mode tamu tetap aktif untuk sesi ini.
  }
}

/** Mematikan mode tamu. Dipanggil saat keluar atau saat masuk sungguhan. */
export function matikanModeTamu(): void {
  tamuAktif = false;
  try {
    localStorage.removeItem(KUNCI_PENANDA);
  } catch {
    // Tidak apa-apa.
  }
}

/** Kunci localStorage milik mode tamu, untuk pembersihan. */
export const KUNCI_MODE_TAMU = KUNCI_PENANDA;
