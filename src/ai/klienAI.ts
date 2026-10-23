/**
 * Klien AI sisi peramban.
 *
 * Tidak memuat kunci API apa pun. Semua permintaan diteruskan ke endpoint
 * `/api/chat` milik kita sendiri (Cloudflare Pages Function), yang menyimpan
 * kunci DeepSeek di sisi server.
 *
 * Fungsi di sini TIDAK PERNAH melempar. Semuanya mengembalikan objek
 * `{ ok, balasan }` atau `{ ok: false, galat }`, supaya pemanggil dapat
 * memutuskan sendiri: memakai AI, atau kembali ke jawaban lokal.
 */
import { getAuthSession } from '../utils/supabaseClient';

export interface RiwayatAI {
  peran: 'siswa' | 'resqy';
  isi: string;
}

export interface HasilTeks {
  ok: boolean;
  balasan?: string;
  galat?: string;
  sisa?: number;
  /** Token prompt yang kena cache - untuk memantau penghematan biaya. */
  cacheHit?: number;
}

const JALUR = '/api/chat';

async function panggil(isi: unknown): Promise<HasilTeks> {
  // Luring: jangan buang waktu, langsung beri tahu pemanggil.
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return { ok: false, galat: 'Sedang luring.' };
  }

  let token = '';
  try {
    const sesi = await getAuthSession();
    token = sesi?.access_token ?? '';
  } catch {
    token = '';
  }
  if (!token) {
    return { ok: false, galat: 'Sesi tidak ditemukan. Coba masuk ulang.' };
  }

  let respons: Response;
  try {
    respons = await fetch(JALUR, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(isi),
    });
  } catch {
    return { ok: false, galat: 'Tidak dapat menghubungi Resqy AI.' };
  }

  let data: any = null;
  try {
    data = await respons.json();
  } catch {
    data = null;
  }

  if (!respons.ok) {
    return {
      ok: false,
      galat: String(data?.galat ?? `Resqy AI menolak permintaan (${respons.status}).`),
      sisa: typeof data?.sisa === 'number' ? data.sisa : undefined,
    };
  }

  const balasan = typeof data?.balasan === 'string' ? data.balasan : '';
  if (!balasan) return { ok: false, galat: 'Resqy AI tidak memberi jawaban.' };

  return {
    ok: true,
    balasan,
    sisa: typeof data?.sisa === 'number' ? data.sisa : undefined,
    cacheHit: Number(data?.cacheHit ?? 0),
  };
}

/** Pertanyaan bebas kepada Resqy tentang aplikasi dan materinya. */
export function tanyaResqy(pesan: string, riwayat: RiwayatAI[] = []): Promise<HasilTeks> {
  return panggil({ mode: 'chat', pesan, riwayat });
}

/**
 * Umpan balik atas hasil evaluasi.
 *
 * Untuk jawaban yang SALAH, `data` tidak boleh memuat jawaban benarnya.
 * Endpoint server juga tidak menambahkannya sendiri - jadi nilai benar tidak
 * pernah sampai ke model. Ini pengaman berlapis terhadap kebocoran jawaban.
 */
export function mintaUmpanBalik(
  jenis: 'wordle' | 'tts' | 'blok',
  benar: boolean,
  data: Record<string, unknown>,
): Promise<HasilTeks> {
  return panggil({ mode: 'umpanBalik', jenis, benar, data });
}
