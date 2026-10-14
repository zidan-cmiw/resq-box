// ── src/missions/engine/pencocokanQA.ts ──────────────────────────────────────
// MESIN PENCOCOKAN PERTANYAAN SISWA DENGAN BANK QA GURU.
//
// ═══════════════════════════════════════════════════════════════════════════
// CARA KERJANYA, TANPA API DAN TANPA INTERNET
// ═══════════════════════════════════════════════════════════════════════════
//
//   1. Pertanyaan siswa dinormalkan: huruf kecil, tanda baca dibuang, kata
//      umum (yang, di, apa, bagaimana, ...) dibuang.
//
//   2. Kata diseragamkan lewat daftar sinonim, karena siswa menulis dengan
//      banyak ragam: "lindu" = "gempa", "wedhus gembel" = "awan panas",
//      "gunung berapi" = "gunung api", "gimana" = "bagaimana".
//
//   3. Tiap kata kunci bank diberi BOBOT berdasarkan seberapa JARANG kata itu
//      dipakai di seluruh bank (pembobotan IDF). Kata seperti "bumi" muncul di
//      banyak jawaban sehingga nilainya kecil; kata seperti "himalaya" atau
//      "piroklastik" hanya muncul di satu jawaban sehingga nilainya besar.
//      Inilah yang membuat pencocokan terasa "mengerti", bukan sekadar
//      mencocokkan huruf.
//
//   4. Skor sebuah jawaban = jumlah bobot kata kunci yang cocok, ditambah
//      bonus bila ada frasa utuh yang muncul (mis. "awan panas"), ditambah
//      sedikit bonus cakupan.
//
//   5. Bila skor tertinggi masih di bawah ambang, chatbot JUJUR mengatakan
//      belum tahu dan menawarkan topik terdekat — bukan mengarang jawaban.
//
// ═══════════════════════════════════════════════════════════════════════════
// MENGAPA TIDAK MENGARANG JAWABAN
// ═══════════════════════════════════════════════════════════════════════════
//
//   Chatbot yang menjawab dengan yakin padahal salah jauh lebih berbahaya
//   daripada chatbot yang mengaku tidak tahu. Untuk materi kebencanaan, jawaban
//   yang keliru dapat membuat siswa salah bertindak saat bencana sungguhan.
//   Karena itu bila tidak ada yang cocok, chatbot menawarkan topik dan meminta
//   siswa bertanya kepada guru.

import { BANK_QA, type EntriQA } from '../data/bankQA.ts';

/**
 * Skor minimum agar sebuah jawaban dianggap cocok.
 *
 * Angka ini BUKAN tebakan. Diukur dari bank yang ada sekarang:
 *   - pertanyaan sah paling rendah  : 3,31 ("bagaimana bantuan di pengungsian dibagi")
 *   - pertanyaan luar materi tertinggi: 2,30 ("siapa presiden pertama indonesia")
 * Ambang diletakkan di tengah celah itu supaya punya jarak aman di KEDUA sisi,
 * bukan hanya di satu sisi. Bila bank bertambah banyak, jarak ini diuji ulang
 * oleh `__tests__/pencocokanQA.test.ts`.
 */
export const AMBANG_COCOK = 2.9;

/**
 * Kata yang dibuang sebelum pencocokan: kata fungsi dan kata tanya.
 *
 * Sengaja TIDAK memuat kata seperti "tidak", "bukan", "padat", atau "cair",
 * karena kata-kata itu justru pembeda makna — "mantel itu padat?" dan
 * "mantel itu cair?" adalah dua pertanyaan berbeda.
 */
const KATA_UMUM = new Set([
  'yang', 'di', 'ke', 'dari', 'dan', 'atau', 'itu', 'ini', 'adalah', 'ialah',
  'apa', 'apakah', 'saya', 'aku', 'kamu', 'kita', 'kami', 'untuk', 'pada',
  'dengan', 'dalam', 'oleh', 'sebagai', 'akan', 'bisa', 'dapat', 'ada',
  'juga', 'sudah', 'telah', 'masih', 'saja', 'sangat', 'lebih', 'paling',
  'kalau', 'jika', 'bila', 'agar', 'supaya', 'para', 'suatu', 'sebuah', 'hal',
  'ya', 'dong', 'sih', 'nih', 'deh', 'pun', 'tolong', 'mohon', 'kak', 'bu',
  'pak', 'mas', 'mbak', 'min', 'bang', 'eh', 'hmm', 'yaa', 'kok', 'gimana',
  'bagaimana', 'kenapa', 'mengapa', 'berapa', 'mana', 'dimana', 'kapan',
  'siapa', 'sebutkan', 'sebut', 'arti', 'maksud', 'maksudnya', 'jelaskan',
  'jelasin', 'terangkan', 'ceritakan', 'kasih', 'tahu', 'tau', 'mau', 'tanya',
  'bertanya', 'soal', 'tentang', 'menurut', 'kah', 'lah', 'nya', 'punya',
  'adakah', 'apasih', 'apaitu', 'the', 'is', 'what', 'why', 'how',
  'gak', 'ga', 'nggak', 'ngga', 'tdk', 'tak', 'lah', 'kah', 'sih', 'kan',
  'saat', 'ketika', 'waktu', 'habis', 'setelah', 'sebelum', 'sampai',
  // Kata pembuka pertanyaan yang tidak membawa topik. Dibuang supaya
  // "apa fungsi seismograf" dinilai sama dengan "seismograf itu apa".
  'fungsi', 'fungsinya', 'kegunaan', 'manfaat', 'manfaatnya', 'gunanya',
  'tujuan', 'tujuannya', 'contoh', 'contohnya', 'mengenai', 'peran',
  'perannya', 'cara', 'caranya', 'bolehkah', 'haruskah', 'perlukah',
]);

/**
 * Penyeragaman kata (sinonim).
 *
 * Kunci dan nilai sudah dalam bentuk setelah normalisasi (huruf kecil, tanpa
 * tanda baca). Satu arah saja: kata ragam -> kata baku.
 */
const SINONIM: Record<string, string> = {
  // gempa
  lindu: 'gempa',
  seisme: 'gempa',
  seismik: 'gempa',
  gempa: 'gempa',
  // lempeng
  lempeng: 'lempeng',
  lempengan: 'lempeng',
  plate: 'lempeng',
  // gunung api
  gunung: 'gunung',
  berapi: 'api',
  vulkanik: 'api',
  vulkanologi: 'api',
  volcano: 'api',
  merapi: 'api',
  // awan panas — "wedhus gembel" adalah sebutan Jawa untuk awan panas.
  // Keduanya dipetakan ke kata yang BERBEDA ("panas" dan "awan") supaya siswa
  // yang hanya menyebut istilah Jawa tetap menghasilkan DUA kata yang cocok,
  // bukan satu.
  piroklastik: 'panas',
  wedhus: 'panas',
  gembel: 'awan',
  // lahar
  lumpur: 'lahar',
  banjir: 'lahar',
  // ragam penulisan
  tektomik: 'lempeng',
  tektonik: 'lempeng',
  plat: 'lempeng',
  menunjam: 'subduksi',
  menunjamnya: 'subduksi',
  penunjaman: 'subduksi',
  // alat & lembaga
  pvmbg: 'pvmbg',
  bmkg: 'bmkg',
  // lain-lain
  bikin: 'membentuk',
  buat: 'membentuk',
  membuat: 'membentuk',
  terbentuk: 'membentuk',
  terbentuknya: 'membentuk',
  jadi: 'membentuk',
  terjadi: 'terjadi',
  kejadian: 'terjadi',
  penyebabnya: 'penyebab',
  sebabnya: 'penyebab',
  pemicu: 'penyebab',
  alasan: 'penyebab',
};

/** Buang tanda baca, jadikan huruf kecil, rapikan spasi. */
export function normalisasi(teks: string): string {
  return teks
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Pecah teks menjadi kata bermakna (kata umum dan sinonim sudah diterapkan). */
export function tokenisasi(teks: string): string[] {
  return normalisasi(teks)
    .split(' ')
    .filter((k) => k.length > 1 && !KATA_UMUM.has(k))
    .map((k) => SINONIM[k] ?? k);
}

/**
 * Hitung bobot IDF tiap kata di seluruh bank.
 *
 * Kata yang muncul di banyak jawaban bernilai kecil; kata yang hanya muncul di
 * satu jawaban bernilai besar. Inilah yang membuat pertanyaan spesifik
 * ("himalaya") langsung mengarah ke jawaban yang tepat.
 */
function hitungIdf(bank: readonly EntriQA[]): Map<string, number> {
  const frekuensi = new Map<string, number>();

  for (const entri of bank) {
    const kataUnik = new Set<string>();
    for (const kk of entri.kataKunci) {
      for (const t of tokenisasi(kk)) kataUnik.add(t);
    }
    for (const f of entri.frasa ?? []) {
      for (const t of tokenisasi(f)) kataUnik.add(t);
    }
    for (const t of kataUnik) frekuensi.set(t, (frekuensi.get(t) ?? 0) + 1);
  }

  const idf = new Map<string, number>();
  const jumlah = bank.length;
  for (const [kata, df] of frekuensi) {
    idf.set(kata, Math.log(1 + jumlah / (1 + df)));
  }
  return idf;
}

/** Bobot sebuah kata kunci = jumlah bobot IDF tiap katanya. */
function bobotKataKunci(kataKunci: string, idf: Map<string, number>): number {
  const token = tokenisasi(kataKunci);
  if (token.length === 0) return 0;
  return token.reduce((jumlah, t) => jumlah + (idf.get(t) ?? 1), 0);
}

export interface HasilCocok {
  entri: EntriQA;
  skor: number;
}

/**
 * Urutkan seluruh bank berdasarkan kedekatannya dengan pertanyaan siswa.
 * Hasil terbaik ada di indeks 0.
 */
export function cocokkanQA(pertanyaan: string, bank: readonly EntriQA[] = BANK_QA): HasilCocok[] {
  const teks = normalisasi(pertanyaan);
  const tokenPertanyaan = new Set(tokenisasi(pertanyaan));
  const idf = hitungIdf(bank);

  const hasil = bank.map((entri) => ({ entri, skor: skorEntri(entri, teks, tokenPertanyaan, idf) }));
  return hasil.sort((a, b) => b.skor - a.skor);
}

function skorEntri(
  entri: EntriQA,
  teksPertanyaan: string,
  tokenPertanyaan: Set<string>,
  idf: Map<string, number>,
): number {
  let skorKataKunci = 0;
  let totalBobot = 0;

  for (const kk of entri.kataKunci) {
    const tokenKk = tokenisasi(kk);
    if (tokenKk.length === 0) continue;
    const bobot = bobotKataKunci(kk, idf);
    totalBobot += bobot;
    // Kata kunci dianggap cocok hanya bila SEMUA katanya muncul. Ini membuat
    // kata kunci majemuk seperti "awan panas" tidak cocok hanya karena ada
    // kata "awan".
    if (tokenKk.every((t) => tokenPertanyaan.has(t))) skorKataKunci += bobot;
  }

  // Bonus frasa: rangkaian kata yang muncul utuh di pertanyaan siswa.
  let bonusFrasa = 0;
  for (const f of entri.frasa ?? []) {
    const frasa = normalisasi(f);
    if (frasa.length > 0 && teksPertanyaan.includes(frasa)) bonusFrasa += 3;
  }

  // Bonus cakupan: entri yang lebih banyak kata kuncinya terpenuhi menang.
  const cakupan = totalBobot > 0 ? skorKataKunci / totalBobot : 0;

  return skorKataKunci + cakupan * 1.5 + bonusFrasa;
}

export type JawabanChatbot =
  | { jenis: 'jawaban'; entri: EntriQA; skor: number }
  | { jenis: 'tidak_ditemukan'; saran: string[] };

/**
 * Seluruh kata yang DIKENAL bank (dari kata kunci maupun frasa).
 *
 * Dipakai untuk menilai apakah pertanyaan siswa masih berada di dalam materi.
 */
function bangunIndeksKata(bank: readonly EntriQA[]): Set<string> {
  const indeks = new Set<string>();
  for (const entri of bank) {
    for (const kk of entri.kataKunci) for (const t of tokenisasi(kk)) indeks.add(t);
    for (const f of entri.frasa ?? []) for (const t of tokenisasi(f)) indeks.add(t);
  }
  return indeks;
}

/**
 * Apakah sebuah kata dikenal bank?
 *
 * Selain pencocokan persis, dipakai pencocokan awalan/akhiran untuk menangani
 * imbuhan bahasa Indonesia tanpa perlu pustaka stemming: "dibagi" dikenali
 * karena bank memuat "bagi", dan "pengungsian" dikenali karena sama persis.
 *
 * Hanya kata sepanjang 4 huruf atau lebih yang dianggap cukup bukti, supaya
 * potongan pendek seperti "kan" atau "nya" tidak membuat segalanya "dikenal".
 */
function kataDikenal(indeks: Set<string>, kata: string): boolean {
  if (indeks.has(kata)) return true;
  for (const t of indeks) {
    if (t.length >= 4 && (kata.startsWith(t) || kata.endsWith(t))) return true;
  }
  return false;
}

/**
 * Besarnya penalti untuk pertanyaan yang banyak memuat kata di luar materi.
 *
 * MENGAPA INI PERLU — temuan dari pengukuran, bukan dugaan.
 *
 * Pembobotan IDF saja TIDAK cukup. IDF hanya tahu bahwa sebuah kata jarang di
 * dalam bank, bukan bahwa kata itu umum di bahasa Indonesia. Akibatnya
 * "bagaimana cara membuat kue bolu" mendapat skor 3,31 hanya karena memuat kata
 * "cara" — hampir menyamai pertanyaan sah seperti "bagaimana bantuan di
 * pengungsian dibagi" yang berskor 3,31 juga. Rentangnya BERTUMPANG-TINDIH,
 * sehingga menaikkan ambang tidak akan pernah memisahkannya.
 *
 * Yang membedakan keduanya adalah kata-kata SISANYA: "kue", "bolu", dan
 * "lembut" tidak ada hubungannya dengan materi, sedangkan "pengungsian" dan
 * "dibagi" justru bagian dari materi. Karena itu pertanyaan yang mayoritas
 * katanya tidak dikenal bank diberi penalti.
 *
 * Penalti baru berlaku bila kata tak dikenal melebihi SEPARUH kata bermakna,
 * supaya pertanyaan singkat yang wajar (mis. "mantel bahannya apa") tidak
 * ikut terhukum.
 */
const PENALTI_TAK_DIKENAL = 6.0;

function penaltiLuarMateri(pertanyaan: string, indeks: Set<string>): number {
  const token = tokenisasi(pertanyaan);
  if (token.length === 0) return 0;

  const takDikenal = token.filter((t) => !kataDikenal(indeks, t)).length;
  const rasio = takDikenal / token.length;

  return Math.max(0, rasio - 0.5) * PENALTI_TAK_DIKENAL;
}

/**
 * Jawab pertanyaan siswa.
 *
 * Bila tidak ada yang cukup cocok, kembalikan `tidak_ditemukan` beserta saran
 * topik terdekat. Fungsi ini TIDAK pernah memanggil jaringan, sehingga biayanya
 * nol dan tetap bekerja tanpa internet.
 */
/**
 * Skor akhir sebuah pertanyaan setelah penalti luar-materi diterapkan.
 * Dipisah agar dapat diperiksa dan diuji tanpa harus menebak dari jawabannya.
 */
export function skorAkhirPertanyaan(
  pertanyaan: string,
  bank: readonly EntriQA[] = BANK_QA,
): { id: string | null; skor: number } {
  const hasil = cocokkanQA(pertanyaan, bank);
  const terbaik = hasil[0];
  const indeks = bangunIndeksKata(bank);
  const skor = (terbaik?.skor ?? 0) - penaltiLuarMateri(pertanyaan, indeks);
  return { id: terbaik?.entri.id ?? null, skor };
}

export function jawabPertanyaan(
  pertanyaan: string,
  bank: readonly EntriQA[] = BANK_QA,
): JawabanChatbot {
  if (normalisasi(pertanyaan).length === 0) {
    return { jenis: 'tidak_ditemukan', saran: daftarTopikUnik(bank).slice(0, 4) };
  }

  const hasil = cocokkanQA(pertanyaan, bank);
  const terbaik = hasil[0];
  const { skor } = skorAkhirPertanyaan(pertanyaan, bank);

  if (!terbaik || skor < AMBANG_COCOK) {
    // Saran diambil dari hasil terdekat, supaya tetap menolong.
    const saran = [...new Set(hasil.slice(0, 6).filter((h) => h.skor > 0).map((h) => h.entri.topik))];
    return {
      jenis: 'tidak_ditemukan',
      saran: saran.length > 0 ? saran.slice(0, 4) : daftarTopikUnik(bank).slice(0, 4),
    };
  }

  return { jenis: 'jawaban', entri: terbaik.entri, skor };
}

/** Daftar topik unik di dalam bank. */
export function daftarTopikUnik(bank: readonly EntriQA[] = BANK_QA): string[] {
  return [...new Set(bank.map((e) => e.topik))];
}

/** Daftar pertanyaan contoh, dipakai sebagai tombol saran di antarmuka. */
export function pertanyaanContoh(bank: readonly EntriQA[] = BANK_QA, jumlah = 4): string[] {
  return bank.slice(0, jumlah).map((e) => e.pertanyaan);
}
