/**
 * Aturan: titik area mana di tracker progres yang dapat ditekan?
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * MENGAPA BERKAS INI DIPISAHKAN
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Awalnya aturan ini ditulis langsung di dalam `JourneyProgressTracker.tsx`.
 * Akibatnya ia tidak dapat diuji: berkas komponen itu mengimpor store yang
 * membaca `localStorage`, dan Node tidak menyediakannya.
 *
 * Yang terjadi kemudian: perbaikan teleport hanya dikerjakan di mesin
 * permainan (`teleportToZone`), sedangkan gerbang di komponen ini TIDAK ikut
 * diperbaiki. Hasilnya keluhan pemain tetap: "masih belum bisa". Pengujian
 * atas mesin saja tidak dapat menangkap hal itu, karena gerbangnya ada di
 * tempat lain yang tidak teruji.
 *
 * Fungsi murni yang tidak bergantung pada React maupun penyimpanan peramban
 * dapat diuji langsung. Itulah alasan berkas ini berdiri sendiri.
 */

/**
 * Apakah sebuah titik area dapat ditekan untuk berpindah ke sana?
 *
 * ATURANNYA
 *   1. Titik hanya dapat ditekan bila tracker memang menerima penangan klik
 *      (`adaPenanganKlik`). Tanpa itu, titiknya hanya menampilkan keterangan.
 *   2. Area tempat pemain BERADA SEKARANG tidak perlu ditekan.
 *   3. Hanya area yang SUDAH TERBUKA — yaitu yang pernah dikunjungi, atau
 *      yang berada di belakang posisi sekarang.
 *
 *   Syarat nomor 3 yang kedua ("di belakang posisi sekarang") disediakan untuk
 *   berkas simpanan LAMA yang belum mengisi daftar kunjungan. Tanpa itu,
 *   pemain lama tidak akan dapat menekan titik mana pun.
 *
 * MENGAPA BUKAN SEKADAR "DI BELAKANG POSISI SEKARANG"
 *
 *   Versi pertama memakai:
 *
 *       const bisaTeleport = idx < currentAreaIndex;
 *
 *   Itu berarti hanya area di BELAKANG yang dapat ditekan. Akibatnya pemain
 *   yang sudah pernah sampai Mantel lalu kembali ke Kerak tidak dapat menekan
 *   Mantel — padahal area itu sudah terbuka.
 *
 *   Bedanya penting:
 *       idx < currentAreaIndex   -> area yang sudah DILEWATI
 *       areaDikunjungi.has(idx)  -> area yang sudah DIBUKA
 *
 *   Area yang belum pernah dibuka tetap tidak dapat ditekan, sehingga materi
 *   dan tantangan di antaranya tidak terlewat.
 *
 * @param idx              indeks titik area yang diperiksa
 * @param currentAreaIndex indeks area tempat pemain berada sekarang
 * @param areaDikunjungi   daftar indeks area yang pernah dimasuki
 * @param adaPenanganKlik  apakah tracker menerima penangan klik
 */
export function areaDapatDitekan(
  idx: number,
  currentAreaIndex: number,
  areaDikunjungi: number[] | undefined,
  adaPenanganKlik: boolean
): boolean {
  if (!adaPenanganKlik) return false;
  if (idx === currentAreaIndex) return false;
  const dikunjungi = new Set(areaDikunjungi ?? []);
  return dikunjungi.has(idx) || idx < currentAreaIndex;
}
