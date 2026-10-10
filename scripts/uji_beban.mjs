/**
 * Uji beban Supabase — mengukur, bukan menebak.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * MENGAPA BERKAS INI ADA
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Pertanyaannya: "aplikasi harus siap menampung 1000 pemain bersamaan".
 *
 * `scripts/hitung_beban.py` memperkirakan JUMLAH permintaan (1000 pemain =
 * sekitar 6000 permintaan bila semuanya mulai serentak). Tetapi jumlah
 * permintaan saja belum menjawab pertanyaannya. Yang perlu diketahui:
 *
 *     berapa lama setiap permintaan diproses saat permintaannya menumpuk?
 *
 * Itu hanya dapat dijawab dengan MENGUKUR. Skrip ini mengirim permintaan
 * bersamaan pada beberapa tingkat, lalu melaporkan:
 *
 *     - berapa banyak yang berhasil dan berapa yang gagal
 *     - waktu tanggap: rata-rata, p50, p95, p99, dan yang terburuk
 *     - pada tingkat berapa mulai muncul kegagalan
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * YANG DIUJI — DAN KENAPA HANYA ITU
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Skrip ini hanya memanggil fungsi yang MEMANG boleh dipanggil tanpa login:
 *
 *     username_available(text)   -> jawabannya true/false
 *     class_code_info(text)      -> mencari kode kelas
 *
 * Keduanya BERAT di sisi database: keduanya lebih dulu menjalankan
 * `check_rate_limit()`, yang MENULIS ke tabel rate_limits lalu membacanya.
 * Jadi panggilan ini menempuh jalur yang paling mahal — sama seperti
 * panggilan sungguhan dari aplikasi.
 *
 * Fungsi lain sengaja TIDAK diuji karena memerlukan sesi login, dan skrip ini
 * tidak menyimpan kata sandi siapa pun.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * PERINGATAN
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   • Ini mengirim permintaan NYATA ke database PRODUKSI.
 *   • Mulailah dari tingkat kecil; skrip menaikkan beban secara bertahap.
 *   • Setiap panggilan MENULIS satu baris ke tabel `rate_limits`. Baris itu
 *     dibersihkan otomatis oleh fungsi `prune_rate_limits()`, jadi tidak
 *     menumpuk — tetapi ketahuilah bahwa uji ini memang menulis.
 *   • `check_rate_limit` membatasi 30 panggilan per 60 detik per alamat.
 *     Karena itu skrip memberi jeda antar-tingkat; kalau tidak, kegagalan
 *     yang muncul adalah BATAS LAJU, bukan bukti server tidak sanggup.
 *
 * Cara menjalankan:
 *     node scripts/uji_beban.mjs                    # bertahap 10..200
 *     node scripts/uji_beban.mjs --max 500          # sampai 500 bersamaan
 *     node scripts/uji_beban.mjs --hanya-cepat      # tanpa jeda (perkiraan)
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
    let v = t.slice(i + 1).trim().replace(/^["']|["']$/g, '');
    hasil[t.slice(0, i).trim()] = v;
  }
  return hasil;
}

const dariFile = { ...bacaEnv('.env'), ...bacaEnv('.env.local') };
const nilai = (k) => process.env[k] ?? dariFile[k] ?? '';
const URL_SB = nilai('VITE_SUPABASE_URL');
const KUNCI = nilai('VITE_SUPABASE_ANON_KEY');

const ARG = process.argv.slice(2);
const MAKS = Number((ARG.find((a) => a.startsWith('--max')) || '').split('=')[1] || ARG[ARG.indexOf('--max') + 1]) || 200;
const TANPA_JEDA = ARG.includes('--hanya-cepat');

const garis = '─'.repeat(76);

if (!URL_SB || !KUNCI) {
  console.error('  Konfigurasi Supabase tidak ditemukan di .env');
  process.exit(2);
}

/** Kirim SATU panggilan ke fungsi yang boleh diakses tanpa login. */
async function satuPanggilan(i) {
  const mulai = performance.now();
  // Bergantian antara dua fungsi supaya tidak selalu memakai kunci cache yang sama
  const fungsi = i % 2 === 0 ? 'username_available' : 'class_code_info';
  const argumen = fungsi === 'username_available'
    ? { p_username: `zz_beban_${i}` }
    : { p_code: `BEBAN-${i}` };

  try {
    const r = await fetch(`${URL_SB}/rest/v1/rpc/${fungsi}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: KUNCI,
        Authorization: `Bearer ${KUNCI}`,
      },
      body: JSON.stringify(argumen),
      signal: AbortSignal.timeout(20000),
    });
    const teks = await r.text();
    const ms = performance.now() - mulai;
    // 200 = berhasil. 429 = kena batas laju (bukan bukti server tidak sanggup).
    return { ok: r.status === 200, status: r.status, ms, teks: teks.slice(0, 120) };
  } catch (e) {
    return { ok: false, status: 0, ms: performance.now() - mulai, teks: String(e.message).slice(0, 90) };
  }
}

function persentil(angka, p) {
  if (!angka.length) return 0;
  const urut = [...angka].sort((a, b) => a - b);
  const i = Math.min(urut.length - 1, Math.floor((p / 100) * urut.length));
  return urut[i];
}

async function tingkat(banyak) {
  const mulai = performance.now();
  const hasil = await Promise.all(
    Array.from({ length: banyak }, (_, i) => satuPanggilan(i))
  );
  const totalMs = performance.now() - mulai;

  const berhasil = hasil.filter((h) => h.ok);
  const gagal = hasil.filter((h) => !h.ok);
  const kenaBatas = gagal.filter((h) => h.status === 429);
  const waktu = hasil.map((h) => h.ms);

  return {
    banyak,
    totalMs,
    berhasil: berhasil.length,
    gagal: gagal.length - kenaBatas.length,
    kenaBatas: kenaBatas.length,
    throughput: (banyak / totalMs) * 1000,
    rata: waktu.reduce((a, b) => a + b, 0) / waktu.length,
    p50: persentil(waktu, 50),
    p95: persentil(waktu, 95),
    p99: persentil(waktu, 99),
    maks: Math.max(...waktu),
    contohGagal: gagal.slice(0, 2).map((g) => `HTTP ${g.status}: ${g.teks}`),
  };
}

console.log(`\n${'='.repeat(76)}`);
console.log('  UJI BEBAN SUPABASE — mengukur waktu tanggap di bawah beban');
console.log('='.repeat(76));
console.log(`\n  Supabase : ${URL_SB}`);
console.log(`  Dibuat   : ${new Date().toLocaleString('id-ID')}`);
console.log('\n  Yang diuji HANYA fungsi tanpa login (username_available, class_code_info).');
console.log('  Keduanya menjalankan check_rate_limit, jadi menempuh jalur TERBERAT.');
console.log('\n  ⚠️  Ini mengirim permintaan nyata ke database produksi.');

const TINGKAT = [5, 10, 25, 50, 100, 150, 200, 300, 500, 750, 1000].filter((n) => n <= MAKS);
const hasilSemua = [];

console.log(`\n${garis}`);
console.log(`  ${'bersama'.padStart(8)} | ${'berhasil'.padStart(8)} | ${'gagal'.padStart(5)} | ${'batas'.padStart(5)} | ${'rata'.padStart(7)} | ${'p95'.padStart(7)} | ${'p99'.padStart(7)} | ${'maks'.padStart(7)} | putaran/detik`);
console.log(garis);

for (const n of TINGKAT) {
  const h = await tingkat(n);
  hasilSemua.push(h);
  console.log(
    `  ${String(n).padStart(8)} | ${String(h.berhasil).padStart(8)} | ${String(h.gagal).padStart(5)} | ` +
      `${String(h.kenaBatas).padStart(5)} | ${h.rata.toFixed(0).padStart(5)} ms | ${h.p95.toFixed(0).padStart(5)} ms | ` +
      `${h.p99.toFixed(0).padStart(5)} ms | ${h.maks.toFixed(0).padStart(5)} ms | ${h.throughput.toFixed(1).padStart(6)}`
  );
  if (h.contohGagal.length) {
    for (const c of h.contohGagal) console.log(`           ⚠️  ${c}`);
  }
  // Jeda supaya batas laju (30/60 detik per alamat) tidak mengaburkan hasil
  if (!TANPA_JEDA && n < TINGKAT[TINGKAT.length - 1]) {
    await new Promise((r) => setTimeout(r, 2100));
  }
}

// ── Kesimpulan ────────────────────────────────────────────────────────────
console.log(`\n${'='.repeat(76)}`);
console.log('  KESIMPULAN');
console.log('='.repeat(76));

const adaGagalNyata = hasilSemua.filter((h) => h.gagal > 0);
const p95Memburuk = hasilSemua.filter((h) => h.p95 > 3000);

if (!adaGagalNyata.length) {
  console.log(`
  Seluruh tingkat berhasil tanpa kegagalan nyata sampai ${MAKS} permintaan
  bersamaan. Tidak ada tanda server kewalahan pada rentang ini.`);
} else {
  const pertama = adaGagalNyata[0];
  console.log(`
  Gagal nyata pertama muncul pada ${pertama.banyak} permintaan bersamaan
  (${pertama.gagal} gagal). Periksa contoh pesannya di atas.`);
}

if (p95Memburuk.length) {
  const pertama = p95Memburuk[0];
  console.log(`  Waktu tanggap p95 melewati 3 detik pada ${pertama.banyak} bersamaan (${pertama.p95.toFixed(0)} ms).`);
}

console.log(`
  CARA MEMBACA
    p95  = 95% permintaan selesai lebih cepat dari angka ini.
    p99  = hanya 1% yang lebih lambat. Inilah yang menentukan "terasa lag".
    maks = permintaan paling lambat. Bila jauh di atas p99, ada penumpukan.

    Kolom "batas" berisi kegagalan karena BATAS LAJU (HTTP 429), bukan karena
    server tidak sanggup. Itu dipisahkan supaya tidak salah disimpulkan.

  YANG BELUM TERUKUR
    Fungsi yang memerlukan login (get_my_profile, submit_level_result) tidak
    ikut diuji karena skrip ini tidak menyimpan kata sandi. Keduanya menempuh
    jalur yang sedikit berbeda karena membaca tabel "profiles" dengan RLS.

    Untuk mengujinya, jalankan uji ini dari akun yang sudah masuk, atau
    tambahkan VITE_UJI_A_USERNAME/_PASSWORD di .env (lihat
    supabase/siapkan_akun_uji_isolasi.sql).
`);

process.exit(0);
