// ── src/store/misiKunci.ts ───────────────────────────────────────────────────
// Logika MURNI untuk menentukan kunci penyimpanan progres misi.
//
// ═══════════════════════════════════════════════════════════════════════════
// MENGAPA BERKAS INI DIPISAH
// ═══════════════════════════════════════════════════════════════════════════
//
//   Logika ini sebelumnya menyatu di dalam `missionStore.ts`, yang tidak dapat
//   diimpor oleh penguji Node karena rantai impornya bergantung pada Vite.
//   Akibatnya aturan sepenting ISOLASI PROGRES ANTAR-SISWA tidak pernah diuji.
//
//   Isi berkas ini sengaja TIDAK mengimpor apa pun, sehingga dapat diuji
//   sungguhan - bukan sekadar diperiksa teksnya.
//
// ═══════════════════════════════════════════════════════════════════════════
// ATURAN YANG DIJAGA
// ═══════════════════════════════════════════════════════════════════════════
//
//   1. Progres hanya boleh dibaca dari kunci MILIK PENGGUNA YANG DIMINTA.
//      Kunci pengguna lain TIDAK BOLEH ikut dibaca, sekalipun ia sedang login.
//      Satu komputer sekolah dipakai bergantian, dan guru membuka progres siswa
//      satu per satu - jadi mencampurnya berarti menampilkan progres siswa lain.
//
//   2. Kunci berbasis NAMA PENGGUNA tetap dibaca, karena data lama mungkin
//      tersimpan dengan nama pengguna alih-alih id. Tetapi HANYA bila nama itu
//      memang menunjuk pengguna yang sama.

/** Awalan kunci penyimpanan progres misi. */
export const PREFIX_MISI = 'resqbox_missions_';

/** Identitas pengguna aktif yang tersimpan di peramban. */
export interface PenggunaAktif {
  id?: string;
  username?: string;
}

/** Kunci penyimpanan progres untuk satu identitas. */
export function kunciMisi(identitas: string): string {
  return `${PREFIX_MISI}${identitas}`;
}

/**
 * Kunci-kunci yang BOLEH dibaca untuk pengguna yang diminta.
 *
 * Hanya berisi alias milik pengguna itu sendiri - tidak pernah milik pengguna
 * lain, meskipun pengguna lain itu sedang login di peramban yang sama.
 */
export function kunciYangBolehDibaca(
  targetId: string,
  penggunaAktif?: PenggunaAktif | null,
): string[] {
  const alias = new Set<string>([targetId]);

  // Data lama berbasis nama pengguna hanya boleh dipakai bila pengguna aktif
  // memang menunjuk orang yang sama dengan yang diminta.
  const penggunaAktifAdalahTarget =
    !!penggunaAktif &&
    (penggunaAktif.id === targetId || penggunaAktif.username === targetId);

  if (penggunaAktifAdalahTarget) {
    if (penggunaAktif.id) alias.add(penggunaAktif.id);
    if (penggunaAktif.username) alias.add(penggunaAktif.username);
  }

  return [...alias].map(kunciMisi);
}

/**
 * Pilih daftar terpanjang di antara kandidat.
 *
 * Dipakai untuk memulihkan data yang tersimpan pada kunci lama (mis. nama
 * pengguna) ketika kunci barunya belum terisi. Aman karena seluruh kandidat
 * sudah dipastikan milik pengguna yang sama oleh `kunciYangBolehDibaca`.
 */
export function pilihTerpanjang<T>(kandidat: T[][]): T[] {
  let terbaik: T[] = [];
  for (const daftar of kandidat) {
    if (daftar.length > terbaik.length) terbaik = daftar;
  }
  return terbaik;
}

/**
 * Saring daftar id misi agar hanya berisi id yang benar-benar ada.
 *
 * Tanpa penyaringan ini, satu id usang di penyimpanan dapat membuat jumlah misi
 * yang "tuntas" melebihi jumlah misi sebenarnya - dan nilai yang dihitung dari
 * situ menjadi salah.
 */
export function saringIdMisi(daftar: unknown, validIds: Set<string>): string[] {
  if (!Array.isArray(daftar)) return [];
  return daftar.filter((id): id is string => typeof id === 'string' && validIds.has(id));
}
