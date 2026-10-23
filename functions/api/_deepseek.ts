/**
 * Pemanggil API DeepSeek dari sisi server (Cloudflare Pages Function).
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * MENGAPA HARUS DI SERVER
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  Kunci API DeepSeek memberi akses penuh ke tagihan pemiliknya. Aplikasi ini
 *  disebar sebagai web publik, APK, dan berkas exe — ketiganya dapat dibongkar
 *  isinya. Kunci yang ditaruh di sisi klien pasti akan diambil orang lain.
 *
 *  Karena itu kunci hanya ada di variabel lingkungan Cloudflare
 *  (`DEEPSEEK_API_KEY`), dan klien memanggil endpoint /api/chat milik kita.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * SOAL CACHE HIT
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  DeepSeek memberi potongan harga besar untuk token yang "kena cache", yaitu
 *  bagian AWAL prompt yang sama persis dengan permintaan sebelumnya.
 *
 *  Supaya sering kena cache, urutan pesan selalu:
 *      1. system  : INSTRUKSI + PENGETAHUAN_WEB  (statis, tidak pernah berubah)
 *      2. riwayat : percakapan sebelumnya         (berubah)
 *      3. user    : pertanyaan terbaru            (berubah)
 *
 *  Apa pun yang berubah di awal akan menggugurkan cache untuk SELURUH sisa
 *  prompt. Karena itu tidak ada tanggal, nama siswa, atau nomor acak di
 *  bagian system.
 */

export interface Env {
  DEEPSEEK_API_KEY: string;
  DEEPSEEK_MODEL?: string;
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
}

export interface PesanAI {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface HasilAI {
  balasan: string;
  model: string;
  /** Token prompt yang kena cache - dipakai untuk memantau penghematan. */
  tokenCacheHit: number;
  tokenPrompt: number;
  tokenJawaban: number;
}

const ALAMAT = 'https://api.deepseek.com/chat/completions';

/**
 * Memanggil DeepSeek. Melempar Error dengan pesan berbahasa Indonesia bila
 * gagal, supaya endpoint dapat meneruskannya apa adanya ke pengguna.
 */
export async function panggilDeepSeek(
  kunci: string,
  model: string,
  pesan: PesanAI[],
  opsi: { maksToken?: number; suhu?: number } = {},
): Promise<HasilAI> {
  const badan = {
    model,
    messages: pesan,
    // Rendah supaya jawaban konsisten dan tidak "berimprovisasi" soal fakta.
    temperature: opsi.suhu ?? 0.3,
    max_tokens: opsi.maksToken ?? 320,
    stream: false,
  };

  let respons: Response;
  try {
    respons = await fetch(ALAMAT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${kunci}`,
      },
      body: JSON.stringify(badan),
    });
  } catch {
    throw new Error('Tidak dapat menghubungi layanan AI. Periksa sambungan internet.');
  }

  const teks = await respons.text();

  if (!respons.ok) {
    // Kode yang paling mungkin muncul: 401 kunci salah, 402 saldo habis,
    // 429 terlalu sering, 400 nama model keliru.
    if (respons.status === 401) {
      throw new Error('Kunci API DeepSeek ditolak. Periksa DEEPSEEK_API_KEY di Cloudflare.');
    }
    if (respons.status === 402) {
      throw new Error('Saldo DeepSeek habis. Isi ulang agar Resqy dapat menjawab lagi.');
    }
    if (respons.status === 429) {
      throw new Error('Terlalu banyak permintaan ke AI. Tunggu sebentar lalu coba lagi.');
    }
    throw new Error(`Layanan AI menolak permintaan (${respons.status}): ${teks.slice(0, 180)}`);
  }

  let data: any;
  try {
    data = JSON.parse(teks);
  } catch {
    throw new Error('Jawaban AI tidak dapat dibaca.');
  }

  const balasan = data?.choices?.[0]?.message?.content;
  if (typeof balasan !== 'string' || balasan.trim() === '') {
    throw new Error('AI tidak memberi jawaban. Coba lagi sebentar.');
  }

  const pakai = data?.usage ?? {};
  return {
    balasan: balasan.trim(),
    model: String(data?.model ?? model),
    tokenCacheHit: Number(pakai.prompt_cache_hit_tokens ?? 0),
    tokenPrompt: Number(pakai.prompt_tokens ?? 0),
    tokenJawaban: Number(pakai.completion_tokens ?? 0),
  };
}

/** Model bawaan. Dapat diganti lewat variabel lingkungan DEEPSEEK_MODEL. */
export const MODEL_BAWAAN = 'deepseek-chat';
