// ── i18n/index.ts ─────────────────────────────────────────────────────────
// Infrastruktur multi-bahasa untuk RESQ-BOX.
//
// MENGAPA TIDAK MEMAKAI PAKET SEPERTI i18next / react-i18next
//   Unduhan pertama baru saja ditekan dari 2,27 MB menjadi 1,61 MB agar
//   terjangkau di koneksi sekolah. Menambahkan paket i18n berarti menambah
//   ±40 KB untuk fitur yang kebutuhannya sederhana: dua bahasa, tanpa
//   pluralisasi rumit, tanpa pemuatan kamus dari jaringan.
//
//   Implementasi ini memakai `Intl` bawaan peramban, sehingga nol byte
//   tambahan dan tetap mendukung format tanggal & angka per wilayah.
//
// CARA PAKAI
//   Di dalam komponen React:
//     const { t } = useI18n();
//     <h1>{t('login.title')}</h1>
//
//   Di luar komponen (mis. mesin game):
//     import { t } from '../i18n';
//     console.log(t('common.loading'));
//
// MENAMBAH BAHASA BARU
//   1. Salin `id.ts` menjadi `en.ts` (atau kode bahasa lain) dan terjemahkan.
//   2. Daftarkan di `LOCALES` di bawah.
//   TypeScript akan MEMASTIKAN kamus baru lengkap: bila ada kunci yang
//   tertinggal, build gagal. Ini mencegah teks muncul dalam bahasa campuran.

import { useSyncExternalStore } from 'react';
import { id } from './id';

/** Kamus Bahasa Indonesia — menjadi acuan bentuk kunci. */
export type Dictionary = typeof id;

const LOCALES: Record<string, Dictionary> = {
  id,
  // en: en,   ← tambahkan di sini setelah menerjemahkan
};

/** Bahasa yang dianggap cocok dengan Bahasa Indonesia (awalan kode). */
const ID_PREFIXES = ['id'];

const STORAGE_KEY = 'resqbox-locale';

export type LocaleCode = string;

let activeLocale: LocaleCode = detectInitial();
const listeners = new Set<() => void>();

/** Pilih bahasa awal: simpanan pengguna → bahasa peramban → Indonesia. */
function detectInitial(): LocaleCode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && LOCALES[saved]) return saved;
  } catch {
    /* localStorage tidak tersedia (mode privat) */
  }

  const nav = typeof navigator !== 'undefined' ? navigator.language || '' : '';
  const lower = nav.toLowerCase();
  if (ID_PREFIXES.some((p) => lower.startsWith(p))) return 'id';

  // Bahasa yang belum tersedia tetap jatuh ke Indonesia, bukan menampilkan
  // kunci mentah seperti "login.title" ke hadapan siswa.
  return 'id';
}

function emit(): void {
  for (const l of listeners) l();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): LocaleCode {
  return activeLocale;
}

/** Daftar bahasa yang tersedia, untuk ditampilkan di pengaturan. */
export const AVAILABLE_LOCALES: { code: LocaleCode; label: string }[] = [
  { code: 'id', label: 'Bahasa Indonesia' },
];

export function getLocale(): LocaleCode {
  return activeLocale;
}

export function setLocale(code: LocaleCode): void {
  if (!LOCALES[code] || code === activeLocale) return;
  activeLocale = code;
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch {
    /* abaikan */
  }
  if (typeof document !== 'undefined') {
    document.documentElement.lang = code;
  }
  emit();
}

/** Ambil nilai bersarang dari kamus berdasarkan kunci bertitik. */
function lookup(dict: Dictionary, key: string): string | undefined {
  const parts = key.split('.');
  let cur: unknown = dict;
  for (const p of parts) {
    if (cur === null || typeof cur !== 'object') return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return typeof cur === 'string' ? cur : undefined;
}

export interface TranslateOptions {
  /** Nilai pengganti untuk penanda {nama} di dalam teks. */
  vars?: Record<string, string | number>;
}

/**
 * Terjemahkan kunci. Bila kunci tidak ditemukan, kembalikan `fallback`
 * (atau kunci itu sendiri) agar aplikasi tidak pernah menampilkan kosong.
 */
export function t(key: string, options?: TranslateOptions): string {
  const dict = LOCALES[activeLocale] ?? LOCALES.id;
  let text = lookup(dict, key);

  if (text === undefined) {
    // Coba kamus acuan agar teks tetap muncul dalam bahasa asli.
    text = lookup(LOCALES.id, key);
  }
  if (text === undefined) {
    if (import.meta.env.DEV) {
      // Terlihat saat pengembangan, tidak sampai ke siswa.
      console.warn(`[i18n] kunci tidak ditemukan: ${key}`);
    }
    return key;
  }

  if (options?.vars) {
    for (const [name, value] of Object.entries(options.vars)) {
      text = text.replaceAll(`{${name}}`, String(value));
    }
  }
  return text;
}

/** Versi hook — komponen ikut render ulang saat bahasa berubah. */
export function useI18n(): { t: typeof t; locale: LocaleCode } {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  // `locale` sengaja dibaca agar hook berlangganan perubahan.
  void locale;
  return { t, locale };
}

// ── Pemformatan sesuai wilayah ────────────────────────────────────────────
// Memakai Intl bawaan peramban: tanggal dan angka mengikuti kebiasaan
// pengguna, tanpa pustaka tambahan.

function intlLocale(): string {
  return activeLocale === 'id' ? 'id-ID' : activeLocale;
}

export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(intlLocale(), options).format(value);
}

export function formatDate(
  value: Date | number,
  options?: Intl.DateTimeFormatOptions
): string {
  return new Intl.DateTimeFormat(
    intlLocale(),
    options ?? { day: 'numeric', month: 'long', year: 'numeric' }
  ).format(value);
}

export function formatTime(value: Date | number): string {
  return new Intl.DateTimeFormat(intlLocale(), {
    hour: '2-digit',
    minute: '2-digit',
  }).format(value);
}
