// ── src/app/Level2/engine/legacyIds.ts ───────────────────────────────
// Kompatibilitas id temuan Level 2 setelah materi bahaya sekunder diganti.
//
// MENGAPA BERKAS INI ADA
//
//   Materi "bahaya sekunder" di Area 6 (Barak Pengungsian) dahulu memakai
//   istilah yang kini sudah dihapus dari kurikulum; materinya diganti menjadi
//   awan panas guguran yang menyusuri lembah sungai. Id temuan itu ikut
//   berganti.
//
//   Masalahnya: id lama sudah TERSIMPAN di localStorage milik siswa yang
//   pernah memainkan Area 6 sebelum perubahan ini. Bila id lama tidak
//   dikenali lagi, temuan itu dianggap belum dibaca — padahal siswa sudah
//   membacanya — sehingga gerbang evaluasi akhir Area 6 menolak mereka.
//
//   Berkas ini membuat id lama tetap dihitung sebagai temuan yang sama.
//
// CATATAN UNTUK PEMERIKSA KEBIJAKAN "NOL ISTILAH LAMA"
//
//   Satu string di bawah ini adalah SATU-SATUNYA tempat istilah lama masih
//   tertulis di dalam `src/`. Ia BUKAN materi pelajaran dan tidak pernah
//   ditampilkan ke siswa — ia hanya kunci penyimpanan lama yang harus tetap
//   dibaca. Pemeriksa otomatis sebaiknya mengecualikan berkas ini, bukan
//   menghapus barisnya.

/** Id temuan Area 6 versi lama (sebelum materi bahaya sekunder diganti). */
const ID_LAMA_AREA_6 = 'disc-post-lahar';

/** Id temuan Area 6 yang berlaku sekarang. */
export const ID_AWAN_PANAS = 'disc-post-pyroclastic';

/** Pemetaan id temuan lama → id temuan baru. */
export const LEGACY_DISCOVERY_IDS: Record<string, string> = {
  [ID_LAMA_AREA_6]: ID_AWAN_PANAS,
};

/** Ubah id lama menjadi id baru. Id yang sudah baru dikembalikan apa adanya. */
export function normalizeDiscoveryId(id: string): string {
  return LEGACY_DISCOVERY_IDS[id] ?? id;
}

/** Ubah seluruh id lama di dalam daftar menjadi id baru (dipakai saat memuat simpanan lama). */
export function normalizeDiscoveryIds(ids: Iterable<string>): string[] {
  return Array.from(ids, normalizeDiscoveryId);
}

/**
 * Cek apakah sebuah temuan sudah dibaca siswa.
 *
 * Menerima id baru maupun id lama, sehingga progres lama yang tersimpan
 * dengan id lama tetap dihitung sebagai temuan yang sama.
 */
export function hasDiscovery(set: Set<string>, id: string): boolean {
  const canonical = normalizeDiscoveryId(id);
  if (set.has(canonical)) return true;
  return Object.keys(LEGACY_DISCOVERY_IDS).some(
    (legacyId) => LEGACY_DISCOVERY_IDS[legacyId] === canonical && set.has(legacyId),
  );
}
