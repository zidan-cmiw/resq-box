/**
 * Endpoint AI: /api/chat
 *
 * Dua mode:
 *   mode "chat"        - pertanyaan bebas kepada Resqy tentang aplikasi & materi
 *   mode "umpanBalik"  - tanggapan atas hasil evaluasi (Wordle, TTS, blok Level 3)
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * KEPUTUSAN PENTING: JAWABAN BENAR TIDAK PERNAH DIKIRIM SAAT SISWA SALAH
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  Melarang model membocorkan jawaban lewat instruksi saja TIDAK CUKUP: model
 *  yang diberi tahu jawabannya cenderung menyebutkannya walau dilarang.
 *
 *  Karena itu, ketika siswa menjawab salah, jawaban benar sama sekali tidak
 *  dimasukkan ke dalam prompt. Model tidak dapat membocorkan sesuatu yang
 *  tidak pernah ia terima. Ini pengaman berlapis, bukan sekadar imbauan.
 *
 *  Ketika siswa menjawab BENAR, jawabannya boleh dikirim karena siswa sudah
 *  mengetahuinya; model diminta menjelaskan MENGAPA itu benar.
 */

import { panggilDeepSeek, MODEL_BAWAAN, type Env, type PesanAI } from './_deepseek';
import { PENGETAHUAN_WEB, INSTRUKSI_CHAT, INSTRUKSI_UMPAN_BALIK } from './_pengetahuan';

interface PermintaanChat {
  mode: 'chat';
  pesan: string;
  riwayat?: { peran: 'siswa' | 'resqy'; isi: string }[];
}

interface PermintaanUmpanBalik {
  mode: 'umpanBalik';
  jenis: 'wordle' | 'tts' | 'blok';
  /** Benar bila siswa menjawab tepat. */
  benar: boolean;
  data: Record<string, unknown>;
}

type Permintaan = PermintaanChat | PermintaanUmpanBalik;

const MAKS_PESAN = 800;
const MAKS_RIWAYAT = 6;
const MAKS_RIWAYAT_ISI = 500;

function potong(teks: unknown, maks: number): string {
  const s = typeof teks === 'string' ? teks : String(teks ?? '');
  return s.length > maks ? s.slice(0, maks) + '…' : s;
}

function json(isi: unknown, status = 200): Response {
  return new Response(JSON.stringify(isi), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

/** Panggil RPC kuota di Supabase memakai token siswa. */
async function mintaIzin(
  alamat: string,
  kunciAnon: string,
  tokenSiswa: string,
  jenis: 'chat' | 'umpan_balik',
): Promise<{ izin: boolean; sisa: number; pesan?: string }> {
  const r = await fetch(`${alamat.replace(/\/$/, '')}/rest/v1/rpc/minta_izin_ai`, {
    method: 'POST',
    headers: {
      apikey: kunciAnon,
      Authorization: `Bearer ${tokenSiswa}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ p_jenis: jenis }),
  });
  if (!r.ok) {
    throw new Error(`Kuota tidak dapat diperiksa (${r.status}).`);
  }
  const h = (await r.json()) as { izin?: boolean; sisa?: number; pesan?: string };
  return { izin: h.izin === true, sisa: Number(h.sisa ?? 0), pesan: h.pesan };
}

/** Susun pesan untuk mode chatbot. */
function pesanChat(p: PermintaanChat): PesanAI[] {
  const pesan: PesanAI[] = [
    { role: 'system', content: `${INSTRUKSI_CHAT}\n\n${PENGETAHUAN_WEB}` },
  ];
  for (const r of (p.riwayat ?? []).slice(-MAKS_RIWAYAT)) {
    pesan.push({
      role: r.peran === 'siswa' ? 'user' : 'assistant',
      content: potong(r.isi, MAKS_RIWAYAT_ISI),
    });
  }
  pesan.push({ role: 'user', content: potong(p.pesan, MAKS_PESAN) });
  return pesan;
}

/**
 * Susun pesan untuk umpan balik evaluasi.
 *
 * Perhatikan: pada cabang "salah", jawaban benar TIDAK disertakan.
 */
function pesanUmpanBalik(p: PermintaanUmpanBalik): PesanAI[] {
  const d = p.data ?? {};
  const baris: string[] = [];

  if (p.jenis === 'wordle') {
    baris.push(`Evaluasi: Wordle Level 1, zona ${potong(d.zona, 60)}.`);
    baris.push(`Jumlah huruf kata rahasia: ${potong(d.panjang, 4)}.`);
    baris.push(`Tebakan siswa: ${potong(d.tebakan, 40)}.`);
    baris.push(`Percobaan ke-${potong(d.percobaan, 3)}.`);
    if (p.benar) {
      baris.push(`Siswa BERHASIL menebak dengan tepat.`);
      baris.push(`Kata tersebut: ${potong(d.jawaban, 40)}.`);
      baris.push('Jelaskan mengapa kata itu benar dan kaitannya dengan materi zona tersebut.');
    } else {
      // Sengaja tanpa jawaban benar.
      baris.push(`Siswa BELUM tepat.`);
      baris.push(
        `Petunjuk warna yang diterima: ${potong(d.petunjukWarna, 300)}. ` +
          'Hijau berarti huruf benar pada posisi benar, kuning berarti huruf ada tetapi posisinya salah, ' +
          'abu-abu berarti huruf tidak dipakai.',
      );
      baris.push(
        'Beri petunjuk berpikir: konsep sains apa yang sedang dicari di zona itu, dan strategi memakai ' +
          'petunjuk warna. Jangan menyebut kata jawabannya.',
      );
    }
  } else if (p.jenis === 'tts') {
    baris.push(`Evaluasi: Teka-Teki Silang Level 2, area ${potong(d.area, 60)}.`);
    const daftar = Array.isArray(d.petunjuk) ? d.petunjuk.slice(0, 6) : [];
    baris.push('Daftar petunjuk:');
    for (const it of daftar as Record<string, unknown>[]) {
      baris.push(
        `  ${potong(it.nomor, 3)} ${potong(it.arah, 12)}, ${potong(it.panjang, 3)} huruf: ${potong(it.teks, 180)}`,
      );
    }
    const salah = Array.isArray(d.isianSalah) ? d.isianSalah.slice(0, 6) : [];
    if (p.benar) {
      baris.push('Seluruh isian siswa BENAR.');
      const kata = Array.isArray(d.kata) ? (d.kata as unknown[]).slice(0, 8) : [];
      if (kata.length) {
        baris.push('Istilah yang berhasil dijawab: ' + kata.map((k) => potong(k, 24)).join(', ') + '.');
      }
      baris.push(
        'Jelaskan hubungan istilah-istilah itu dengan materi mitigasi bencana di area tersebut. ' +
          'Siswa sudah mengetahuinya, jadi menyebutnya di sini tidak membocorkan apa pun.',
      );
    } else if (salah.length) {
      baris.push('Kata yang isiannya belum tepat (tanpa menyebut jawaban benarnya):');
      for (const it of salah as Record<string, unknown>[]) {
        baris.push(
          `  ${potong(it.nomor, 3)} ${potong(it.arah, 12)}, ${potong(it.panjang, 3)} huruf. ` +
            `Isian siswa: "${potong(it.isian, 40)}".`,
        );
      }
      baris.push(
        'Untuk tiap kata yang salah, tunjukkan konsep materi yang perlu dibaca ulang dan ajukan satu ' +
          'pertanyaan pemandu. Jangan menyebut jawaban benarnya, termasuk panjang atau awalan katanya.',
      );
    } else {
      baris.push('Siswa belum mengisi seluruh kotak.');
    }
  } else {
    baris.push(`Evaluasi: penyusunan blok Level 3, misi "${potong(d.misi, 120)}".`);
    baris.push(`Target misi: ${potong(d.target, 300)}.`);
    const blok = Array.isArray(d.blok) ? d.blok.slice(0, 24) : [];
    if (blok.length) {
      baris.push('Blok yang tersusun:');
      for (const b of blok as Record<string, unknown>[]) {
        baris.push(`  - ${potong(b.kategori, 30)}: ${potong(b.isi, 120)}`);
      }
    } else {
      baris.push('Kanvas masih kosong atau belum berisi blok yang dikenali.');
    }
    if (d.pesanKesalahan) baris.push(`Pesan validator: ${potong(d.pesanKesalahan, 200)}.`);
    baris.push(
      p.benar
        ? 'Susunan siswa sudah memenuhi target. Jelaskan mengapa susunan itu bekerja.'
        : 'Susunan belum memenuhi target. Perkirakan apa yang ingin dibuat siswa, lalu tunjukkan ' +
            'bagian alur yang perlu diperbaiki. Jangan menuliskan susunan blok lengkap yang siap dipakai.',
    );
  }

  return [
    { role: 'system', content: `${INSTRUKSI_UMPAN_BALIK}\n\n${PENGETAHUAN_WEB}` },
    { role: 'user', content: baris.join('\n') },
  ];
}

export const onRequestPost = async (context: {
  request: Request;
  env: Env;
}): Promise<Response> => {
  const { request, env } = context;

  if (!env.DEEPSEEK_API_KEY) {
    return json(
      { galat: 'Layanan AI belum disiapkan: DEEPSEEK_API_KEY belum diisi di Cloudflare.' },
      503,
    );
  }

  const alamat = env.SUPABASE_URL ?? '';
  const anon = env.SUPABASE_ANON_KEY ?? '';
  if (!alamat || !anon) {
    return json({ galat: 'Layanan AI belum disiapkan: SUPABASE_URL atau SUPABASE_ANON_KEY kosong.' }, 503);
  }

  const otorisasi = request.headers.get('Authorization') ?? '';
  const token = otorisasi.startsWith('Bearer ') ? otorisasi.slice(7).trim() : '';
  if (!token) {
    return json({ galat: 'Harus login untuk memakai Resqy.' }, 401);
  }

  let isi: Permintaan;
  try {
    isi = (await request.json()) as Permintaan;
  } catch {
    return json({ galat: 'Permintaan tidak dapat dibaca.' }, 400);
  }

  if (isi?.mode !== 'chat' && isi?.mode !== 'umpanBalik') {
    return json({ galat: 'Mode tidak dikenal.' }, 400);
  }

  // ── Kuota ──
  let izin: { izin: boolean; sisa: number; pesan?: string };
  try {
    izin = await mintaIzin(alamat, anon, token, isi.mode === 'chat' ? 'chat' : 'umpan_balik');
  } catch (e) {
    return json({ galat: e instanceof Error ? e.message : 'Kuota tidak dapat diperiksa.' }, 502);
  }
  if (!izin.izin) {
    return json({ galat: izin.pesan ?? 'Kuota AI hari ini sudah habis.', sisa: 0 }, 429);
  }

  // ── Susun prompt & panggil ──
  const pesan = isi.mode === 'chat' ? pesanChat(isi) : pesanUmpanBalik(isi);
  try {
    const hasil = await panggilDeepSeek(
      env.DEEPSEEK_API_KEY,
      env.DEEPSEEK_MODEL || MODEL_BAWAAN,
      pesan,
      { maksToken: isi.mode === 'chat' ? 340 : 260, suhu: 0.3 },
    );
    return json({
      balasan: hasil.balasan,
      sisa: izin.sisa,
      model: hasil.model,
      cacheHit: hasil.tokenCacheHit,
      promptToken: hasil.tokenPrompt,
      jawabanToken: hasil.tokenJawaban,
    });
  } catch (e) {
    return json({ galat: e instanceof Error ? e.message : 'AI sedang tidak dapat dihubungi.' }, 502);
  }
};

/** Permintaan selain POST ditolak dengan jelas. */
export const onRequest = async (): Promise<Response> =>
  json({ galat: 'Gunakan POST untuk endpoint ini.' }, 405);
