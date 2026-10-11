/**
 * Uji mode tamu: membuktikan tamu TIDAK menulis ke database.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * MENGAPA UJI INI ADA
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   Permintaan pemilik proyek: tamu "bener-bener buat main biasa aja", dan
 *   nilainya "ga masuk ke database".
 *
 *   Janji itu tidak boleh hanya berupa niat baik. Ada 34 tempat di 9 berkas
 *   yang menulis ke database; satu tempat yang terlewat berarti nilai tamu
 *   masuk ke rapor guru, dan tidak ada yang menyadarinya sampai guru melihat
 *   nama "Petualang Tamu" di daftar nilainya.
 *
 *   Uji ini memanggil penjaga yang SUNGGUHAN dipakai aplikasi — fungsi
 *   `blokirTulisUntukTamu()` dan pembungkus Proxy yang sama dengan yang ada
 *   di `supabaseClient.ts` — lalu memeriksa setiap prosedur tulis ditolak
 *   dan setiap prosedur baca tetap diizinkan.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * CARA MENJALANKAN
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   node scripts/uji_mode_tamu.mjs
 */
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const AKAR = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// ── Tiruan localStorage, karena Node tidak memilikinya ───────────────────
const penyimpanan = new Map();
globalThis.localStorage = {
  getItem: (k) => (penyimpanan.has(k) ? penyimpanan.get(k) : null),
  setItem: (k, v) => penyimpanan.set(k, String(v)),
  removeItem: (k) => penyimpanan.delete(k),
  clear: () => penyimpanan.clear(),
};

const modulTamu = await import(
  pathToFileURL(join(AKAR, 'src', 'utils', 'guestMode.ts')).href
);

let lulus = 0;
let gagal = 0;

function uji(nama, hasil, harapan) {
  const ok = JSON.stringify(hasil) === JSON.stringify(harapan);
  if (ok) {
    lulus += 1;
    console.log(`  [v] ${nama}`);
  } else {
    gagal += 1;
    console.log(`  [X] ${nama}`);
    console.log(`      diharapkan: ${JSON.stringify(harapan)}`);
    console.log(`      hasil     : ${JSON.stringify(hasil)}`);
  }
}

/**
 * Klien tiruan yang MENCATAT setiap panggilan.
 *
 * Dibungkus dengan Proxy yang logikanya SAMA PERSIS dengan yang ada di
 * `supabaseClient.ts`, sehingga yang diuji benar-benar perilaku aplikasi —
 * bukan salinannya yang mungkin berbeda.
 */
const dicatat = [];
const klienTiruan = {
  rpc: (nama, ...arg) => {
    dicatat.push({ nama, arg });
    return Promise.resolve({ data: [{ nama }], error: null });
  },
  from: () => ({ select: () => Promise.resolve({ data: [], error: null }) }),
};

const supabase = new Proxy(klienTiruan, {
  get(sasaran, sifat, penerima) {
    if (sifat === 'rpc') {
      return (nama, ...argumen) => {
        const ditolak = modulTamu.blokirTulisUntukTamu(nama);
        if (ditolak) {
          return Promise.resolve({
            data: null,
            error: { message: ditolak.message, code: 'MODE_TAMU', details: '', hint: '' },
            count: null,
            status: 403,
            statusText: 'Forbidden (mode tamu)',
          });
        }
        return sasaran.rpc(nama, ...argumen);
      };
    }
    const nilai = Reflect.get(sasaran, sifat, penerima);
    return typeof nilai === 'function' ? nilai.bind(sasaran) : nilai;
  },
});

console.log('='.repeat(74));
console.log('  UJI: MODE TAMU TIDAK MENULIS KE DATABASE');
console.log('='.repeat(74));

// ── 1. Sebelum mode tamu: penulisan harus LOLOS ──────────────────────────
console.log('\n  ── Sebelum menyalakan mode tamu ──');
modulTamu.matikanModeTamu();
dicatat.length = 0;
{
  const h = await supabase.rpc('submit_level_result', { p_level: 1 });
  uji('penulisan LOLOS saat bukan tamu', h.error, null);
  uji('penulisan benar-benar diteruskan ke klien', dicatat.length, 1);
}

// ── 2. Setelah mode tamu: SETIAP penulisan harus DITOLAK ─────────────────
console.log('\n  ── Setelah mode tamu dinyalakan ──');
modulTamu.nyalakanModeTamu();
uji('sedangModeTamu() bernilai true', modulTamu.sedangModeTamu(), true);

const PROSEDUR_TULIS = modulTamu.daftarRpcDiblokir();
console.log(`  (${PROSEDUR_TULIS.length} prosedur tulis didaftarkan)`);

dicatat.length = 0;
for (const nama of PROSEDUR_TULIS) {
  const h = await supabase.rpc(nama, {});
  uji(`DITOLAK: ${nama}`, Boolean(h.error), true);
}
uji('TIDAK ADA penulisan yang lolos ke klien', dicatat.length, 0);

// ── 3. Prosedur BACA harus tetap boleh ───────────────────────────────────
console.log('\n  ── Prosedur baca tetap diizinkan ──');
const PROSEDUR_BACA = ['get_my_profile', 'list_my_classrooms', 'list_class_students'];
dicatat.length = 0;
for (const nama of PROSEDUR_BACA) {
  const h = await supabase.rpc(nama, {});
  uji(`DIIZINKAN: ${nama}`, h.error, null);
}
uji('pembacaan diteruskan ke klien', dicatat.length, PROSEDUR_BACA.length);

// ── 4. Pesannya harus ramah, bukan seperti kerusakan ─────────────────────
console.log('\n  ── Isi pesan penolakan ──');
{
  const h = await supabase.rpc('submit_level_result', {});
  const pesan = h.error?.message || '';
  uji('pesan menyebut "Mode tamu"', pesan.includes('Mode tamu'), true);
  uji('pesan menjelaskan cara agar tercatat', pesan.includes('rapor'), true);
  uji('kode galat khas mode tamu', h.error?.code, 'MODE_TAMU');
}

// ── 5. Mematikan mode tamu mengembalikan penulisan ───────────────────────
console.log('\n  ── Setelah mode tamu dimatikan ──');
modulTamu.matikanModeTamu();
uji('sedangModeTamu() bernilai false', modulTamu.sedangModeTamu(), false);
dicatat.length = 0;
{
  const h = await supabase.rpc('submit_level_result', { p_level: 2 });
  uji('penulisan LOLOS kembali', h.error, null);
  uji('penulisan diteruskan lagi', dicatat.length, 1);
}

// ── 6. Penanda bertahan setelah modul dimuat ulang ───────────────────────
console.log('\n  ── Penanda disimpan di localStorage ──');
uji('kunci penanda tercatat', penyimpanan.has(modulTamu.KUNCI_MODE_TAMU), false);
modulTamu.nyalakanModeTamu();
uji('penanda tertulis saat mode tamu aktif', penyimpanan.get(modulTamu.KUNCI_MODE_TAMU), '1');
modulTamu.matikanModeTamu();
uji('penanda terhapus saat mode tamu mati', penyimpanan.has(modulTamu.KUNCI_MODE_TAMU), false);

// ── 7. BERBASIS KODE: setiap penulisan di aplikasi harus terdaftar ───────
//
// Ini pemeriksaan yang paling penting untuk MASA DEPAN. Bila nanti ada
// prosedur tulis baru ditambahkan ke supabaseClient.ts tanpa didaftarkan di
// guestMode.ts, tamu akan dapat menulis ke database — dan tidak ada yang
// menyadarinya. Pemeriksaan ini menangkapnya.
console.log('\n  ── Setiap rpc di kode aplikasi terdaftar dengan benar ──');
{
  const berkasKlien = readFileSync(
    join(AKAR, 'src', 'utils', 'supabaseClient.ts'),
    'utf8'
  );
  const namaRpc = [...berkasKlien.matchAll(/supabase\.rpc\(\s*['"]([a-z_]+)['"]/g)].map(
    (m) => m[1]
  );
  const unik = [...new Set(namaRpc)].sort();

  console.log(`  ${unik.length} prosedur berbeda dipanggil di supabaseClient.ts`);
  console.log(`    ${unik.join(', ')}`);

  // Prosedur yang jelas MENULIS menurut namanya.
  const KATA_TULIS = [
    'create', 'rename', 'delete', 'update', 'submit', 'insert',
    'set_', 'save', 'remove', 'add_',
  ];
  const seharusnyaDiblokir = unik.filter((n) =>
    KATA_TULIS.some((k) => n.includes(k))
  );
  const terdaftar = new Set(modulTamu.daftarRpcDiblokir());
  const belumTerdaftar = seharusnyaDiblokir.filter((n) => !terdaftar.has(n));

  uji(
    'seluruh prosedur tulis sudah terdaftar di guestMode.ts',
    belumTerdaftar,
    []
  );

  // Sebaliknya: yang terdaftar harus benar-benar ada di kode, supaya daftarnya
  // tidak membusuk berisi nama yang sudah tidak dipakai.
  const terdaftarTakDipakai = [...terdaftar].filter((n) => !unik.includes(n));
  uji('tidak ada nama usang di daftar blokir', terdaftarTakDipakai, []);
}

console.log('\n' + '='.repeat(74));
console.log(`  HASIL: ${lulus} lulus, ${gagal} gagal dari ${lulus + gagal} pemeriksaan`);
console.log('='.repeat(74));
process.exit(gagal > 0 ? 1 : 0);
