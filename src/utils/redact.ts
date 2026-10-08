// ── redact.ts ─────────────────────────────────────────────────────────────
// Penyunting data pribadi sebelum dikirim ke layanan monitoring.
//
// MENGAPA DIPISAH
//   Ini bagian paling sensitif untuk privasi: kalau gagal, nama atau email
//   siswa bisa ikut terkirim ke pihak ketiga. Karena itu logikanya dipisah
//   ke modul TANPA ketergantungan apa pun — agar bisa diuji otomatis
//   (lihat `src/utils/__tests__/redact.test.ts`).
//
// YANG DISUNTING
//   email · JWT · UUID · password/token/secret/apikey · nomor telepon

const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.-]+/g;
const UUID_RE = /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi;
const JWT_RE = /\beyJ[\w-]{10,}\.[\w-]{10,}\.[\w-]{10,}\b/g;

/** `key: value` atau `key=value` untuk kunci yang berisi kredensial. */
const SECRET_PAIR_RE =
  /("?(?:password|passwd|pwd|token|access_token|refresh_token|apikey|api_key|authorization|secret|otp|pin)"?\s*[:=]\s*)("[^"]*"|'[^']*'|[^\s,;}"']+)/gi;

/** Nomor telepon Indonesia: 08xx, +628xx, 628xx. */
const PHONE_RE = /(?:\+62|62|0)8[1-9][0-9]{6,11}\b/g;

/**
 * Buang data yang bisa mengidentifikasi siswa.
 * Aman dipanggil dengan string apa pun, termasuk string kosong.
 */
export function redact(input: string): string {
  if (!input) return '';
  return input
    .replace(JWT_RE, '[jwt]')
    .replace(EMAIL_RE, '[email]')
    .replace(UUID_RE, '[uuid]')
    .replace(PHONE_RE, '[telepon]')
    .replace(SECRET_PAIR_RE, '$1[disunting]');
}

/** Kunci objek yang isinya tidak boleh ikut terkirim, apa pun nilainya. */
const SENSITIVE_KEY_RE = /password|passwd|pwd|token|secret|apikey|api_key|authorization|otp|pin/i;

/**
 * Sunting nilai sebuah objek metadata secara rekursif.
 * - Kunci sensitif → diganti penanda, nilainya tidak pernah dikirim.
 * - String → disunting lalu dipotong agar tidak membanjiri endpoint.
 * - Angka/boolean/null → dibiarkan.
 * - Objek/array → diserialisasi, disunting, lalu dipotong.
 */
export function sanitizeExtra(
  extra?: Record<string, unknown>,
  maxLength = 500
): Record<string, unknown> {
  if (!extra) return {};
  const out: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(extra)) {
    if (value === undefined) continue;

    if (SENSITIVE_KEY_RE.test(key)) {
      out[key] = '[disunting]';
      continue;
    }

    if (typeof value === 'string') {
      out[key] = redact(value).slice(0, maxLength);
      continue;
    }

    if (typeof value === 'number' || typeof value === 'boolean' || value === null) {
      out[key] = value;
      continue;
    }

    try {
      out[key] = redact(JSON.stringify(value)).slice(0, maxLength);
    } catch {
      out[key] = '[tidak dapat diserialisasi]';
    }
  }

  return out;
}
