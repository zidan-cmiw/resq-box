// ── monitoring.ts ─────────────────────────────────────────────────────────
// Lapisan observabilitas RESQ-BOX: pelaporan error + Web Vitals.
//
// MENGAPA INI ADA
//   Sebelumnya aplikasi ini "buta" di produksi: kalau game macet di HP siswa
//   di kota lain, tidak ada cara mengetahuinya. Semua kegagalan hanya masuk
//   console browser siswa sendiri. Modul ini mengirimkannya ke tempat yang
//   bisa kamu lihat.
//
// TANPA DEPENDENSI BARU
//   Tidak memakai paket apa pun. Kalau `VITE_SENTRY_DSN` diisi, laporan
//   dikirim ke Sentry memakai **Store Endpoint** resmi (protokol HTTP biasa).
//   Kalau `VITE_MONITORING_ENDPOINT` diisi, laporan dikirim sebagai JSON ke
//   endpoint milikmu sendiri. Kalau keduanya kosong, modul ini hanya mencatat
//   ke console — aplikasi tetap berjalan normal.
//
// CARA MENGISI
//   VITE_SENTRY_DSN=https://<key>@o<org>.ingest.sentry.io/<project>
//   VITE_MONITORING_ENDPOINT=https://contoh.com/api/log   (opsional)
//   VITE_MONITORING_SAMPLE=0.1                            (10% Web Vitals)
//
// PRIVASI
//   `redact()` membuang data pribadi sebelum dikirim: email, username,
//   password, token, dan UUID. Data siswa TIDAK ikut terkirim.

import { redact, sanitizeExtra } from './redact';

export { redact, sanitizeExtra };

// ── Konfigurasi ───────────────────────────────────────────────────────────
const SENTRY_DSN = (import.meta.env.VITE_SENTRY_DSN as string | undefined) || '';
const HTTP_ENDPOINT = (import.meta.env.VITE_MONITORING_ENDPOINT as string | undefined) || '';
// Web Vitals disampling supaya ribuan siswa tidak membanjiri endpoint.
const SAMPLE_RATE = clamp01(Number(import.meta.env.VITE_MONITORING_SAMPLE ?? 0.1));
const APP_VERSION = (import.meta.env.VITE_APP_VERSION as string | undefined) || 'dev';
const RELEASE = `resq-box@${APP_VERSION}`;

export const isMonitoringEnabled = Boolean(SENTRY_DSN || HTTP_ENDPOINT);

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0.1;
  return Math.min(1, Math.max(0, n));
}

// ── DSN Sentry → Store Endpoint ───────────────────────────────────────────
interface SentryTarget {
  url: string;
  authHeader: string;
}

function parseSentryDsn(dsn: string): SentryTarget | null {
  try {
    const u = new URL(dsn);
    const publicKey = u.username;
    const projectId = u.pathname.replace(/^\//, '');
    if (!publicKey || !projectId) return null;
    const host = u.host;
    return {
      url: `${u.protocol}//${host}/api/${projectId}/store/`,
      authHeader: `Sentry sentry_version=7, sentry_client=resq-box/1.0, sentry_key=${publicKey}`,
    };
  } catch {
    return null;
  }
}

const sentryTarget = SENTRY_DSN ? parseSentryDsn(SENTRY_DSN) : null;

// ── Konteks ───────────────────────────────────────────────────────────────
interface AppContext {
  route?: string;
  userId?: string; // sudah di-hash, bukan id asli
  role?: 'student' | 'teacher' | 'guest';
}

const context: AppContext = { route: '/', role: 'guest' };

export function setMonitoringContext(next: Partial<AppContext>): void {
  Object.assign(context, next);
}

/** Penanda sesi anonim — supaya beberapa error bisa dikelompokkan tanpa mengenali siswa. */
const sessionId = randomId();

function randomId(): string {
  try {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
  } catch {
    /* fallback di bawah */
  }
  return `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function deviceInfo(): Record<string, unknown> {
  if (typeof navigator === 'undefined') return {};
  const nav = navigator as Navigator & { deviceMemory?: number };
  return {
    userAgent: nav.userAgent,
    language: nav.language,
    // deviceMemory hanya ada di Chromium — berguna untuk melacak perangkat kelas bawah
    deviceMemory: nav.deviceMemory ?? null,
    hardwareConcurrency: nav.hardwareConcurrency ?? null,
    // Informasi koneksi membantu mengukur dampak mode hemat data
    connection:
      (nav as unknown as { connection?: { effectiveType?: string; saveData?: boolean } })
        .connection?.effectiveType ?? null,
    saveData:
      (nav as unknown as { connection?: { saveData?: boolean } }).connection?.saveData ?? null,
    online: nav.onLine,
  };
}

function viewport(): Record<string, unknown> {
  if (typeof window === 'undefined') return {};
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    dpr: window.devicePixelRatio,
  };
}

// ── Pengiriman ────────────────────────────────────────────────────────────
async function post(url: string, body: unknown, headers: Record<string, string>): Promise<void> {
  try {
    // keepalive supaya laporan terakhir tidak hilang saat tab ditutup.
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch {
    /* Observabilitas tidak boleh menjatuhkan aplikasi. Diamkan. */
  }
}

async function ship(payload: Record<string, unknown>): Promise<void> {
  if (sentryTarget) {
    await post(sentryTarget.url, payload, { 'X-Sentry-Auth': sentryTarget.authHeader });
  } else if (HTTP_ENDPOINT) {
    await post(HTTP_ENDPOINT, payload, {});
  }
}

// ── Pelaporan error ───────────────────────────────────────────────────────
export interface ReportOptions {
  /** Tingkat keparahan. */
  level?: 'fatal' | 'error' | 'warning' | 'info';
  /** Label singkat, mis. 'submitLevelProgress'. */
  scope?: string;
  /** Data tambahan — otomatis disunting. */
  extra?: Record<string, unknown>;
}

const seenErrors = new Set<string>();
const MAX_DEDUPE = 50;

/**
 * Laporkan error. Aman dipanggil di mana saja, termasuk saat monitoring mati.
 * Error yang sama tidak dikirim berulang kali dalam satu sesi.
 */
export function reportError(error: unknown, options: ReportOptions = {}): void {
  const level = options.level ?? 'error';
  const scope = options.scope ?? 'app';
  const err = error instanceof Error ? error : new Error(String(error));
  const message = redact(err.message || 'Tanpa pesan');

  const fingerprint = `${scope}|${message}`;
  if (seenErrors.has(fingerprint)) return;
  if (seenErrors.size < MAX_DEDUPE) seenErrors.add(fingerprint);

  // Selalu tampilkan di console agar developer lokal tetap bisa melihat.
  if (level === 'fatal' || level === 'error') {
    console.error(`[RESQ-BOX][${scope}]`, error);
  } else {
    console.warn(`[RESQ-BOX][${scope}]`, error);
  }

  if (!isMonitoringEnabled) return;

  const event = {
    level: level === 'fatal' ? 'fatal' : level,
    platform: 'javascript',
    logger: 'resq-box',
    release: RELEASE,
    environment: import.meta.env.MODE,
    message: { formatted: `[${scope}] ${message}` },
    timestamp: new Date().toISOString(),
    tags: {
      scope,
      route: context.route ?? '/',
      role: context.role ?? 'guest',
      session: sessionId,
    },
    // stacktrace disunting; dikirim sebagai string agar tidak bergantung pada
    // format frame Sentry yang bisa berubah antar versi protokol.
    extra: {
      stack: redact(err.stack ?? '').slice(0, 4000),
      ...sanitizeExtra(options.extra),
      device: deviceInfo(),
      viewport: viewport(),
    },
    user: { id: sessionId }, // id anonim — bukan id siswa
  };

  void ship(event);
}

// ── Web Vitals ────────────────────────────────────────────────────────────
export interface Vital {
  name: 'LCP' | 'CLS' | 'INP' | 'TTFB' | 'FCP';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

// Ambang sesuai rekomendasi web.dev (Core Web Vitals 2024).
const THRESHOLDS: Record<Vital['name'], [number, number]> = {
  LCP: [2500, 4000],
  CLS: [0.1, 0.25],
  INP: [200, 500],
  TTFB: [800, 1800],
  FCP: [1800, 3000],
};

function rate(name: Vital['name'], value: number): Vital['rating'] {
  const [good, poor] = THRESHOLDS[name];
  if (value <= good) return 'good';
  if (value <= poor) return 'needs-improvement';
  return 'poor';
}

const collectedVitals: Vital[] = [];

export function getCollectedVitals(): Vital[] {
  return [...collectedVitals];
}

function recordVital(name: Vital['name'], value: number): void {
  const vital: Vital = { name, value: Math.round(value * 1000) / 1000, rating: rate(name, value) };
  collectedVitals.push(vital);

  if (!isMonitoringEnabled) return;
  if (Math.random() > SAMPLE_RATE) return;

  void ship({
    level: 'info',
    platform: 'javascript',
    logger: 'resq-box.vitals',
    release: RELEASE,
    environment: import.meta.env.MODE,
    message: { formatted: `vital ${name}=${vital.value} (${vital.rating})` },
    timestamp: new Date().toISOString(),
    tags: {
      scope: 'web-vitals',
      metric: name,
      rating: vital.rating,
      route: context.route ?? '/',
      role: context.role ?? 'guest',
      session: sessionId,
    },
    extra: { device: deviceInfo(), viewport: viewport() },
    user: { id: sessionId },
  });
}

/**
 * Mulai mengumpulkan Web Vitals. Dipanggil sekali dari main.tsx.
 * Memakai PerformanceObserver sehingga tidak menambah beban berarti.
 */
export function initWebVitals(): void {
  if (typeof window === 'undefined' || typeof PerformanceObserver === 'undefined') return;

  try {
    // LCP
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
      if (last) recordVital('LCP', last.startTime);
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  } catch {
    /* tipe tidak didukung — lanjut ke metrik lain */
  }

  try {
    // CLS — akumulasi pergeseran layout, dilaporkan saat halaman disembunyikan.
    let cls = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as (PerformanceEntry & {
        value?: number;
        hadRecentInput?: boolean;
      })[]) {
        if (!entry.hadRecentInput && typeof entry.value === 'number') cls += entry.value;
      }
    }).observe({ type: 'layout-shift', buffered: true });

    const flushCls = () => {
      if (cls > 0) recordVital('CLS', cls);
    };
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') flushCls();
    });
    window.addEventListener('pagehide', flushCls);
  } catch {
    /* tidak didukung */
  }

  try {
    // INP — ambil interaksi terlama.
    let worstInteraction = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as (PerformanceEntry & { duration: number })[]) {
        if (entry.duration > worstInteraction) worstInteraction = entry.duration;
      }
    }).observe({ type: 'event', buffered: true, durationThreshold: 40 } as PerformanceObserverInit);

    window.addEventListener('pagehide', () => {
      if (worstInteraction > 0) recordVital('INP', worstInteraction);
    });
  } catch {
    /* tidak didukung */
  }

  try {
    const nav = performance.getEntriesByType('navigation')[0] as
      | (PerformanceEntry & { responseStart: number; firstContentfulPaint?: number })
      | undefined;
    if (nav && nav.responseStart > 0) recordVital('TTFB', nav.responseStart);

    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') recordVital('FCP', entry.startTime);
      }
    }).observe({ type: 'paint', buffered: true });
  } catch {
    /* tidak didukung */
  }
}

/**
 * Pasang penangkap error global. Dipanggil sekali dari main.tsx.
 * Menangkap error yang lolos dari ErrorBoundary React.
 */
export function initGlobalErrorHandlers(): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('error', (event) => {
    // Abaikan error dari resource (gambar/script gagal dimuat) — itu sudah
    // ditangani fallback masing-masing, dan tidak berguna sebagai sinyal bug.
    if (event.target && event.target !== window && !(event instanceof ErrorEvent)) return;
    const err = (event as ErrorEvent).error ?? (event as ErrorEvent).message;
    if (!err) return;
    reportError(err, { level: 'fatal', scope: 'window.onerror' });
  });

  window.addEventListener('unhandledrejection', (event) => {
    reportError(event.reason ?? 'unhandledrejection', {
      level: 'error',
      scope: 'unhandledrejection',
    });
  });
}

/**
 * Ukur durasi sebuah operasi async dan laporkan bila melewati ambang.
 * Berguna untuk memantau latensi RPC Supabase pada perangkat nyata.
 */
export async function measure<T>(
  scope: string,
  fn: () => Promise<T>,
  warnAboveMs = 3000
): Promise<T> {
  const start = performance.now();
  try {
    return await fn();
  } finally {
    const ms = performance.now() - start;
    if (ms > warnAboveMs) {
      reportError(new Error(`Operasi lambat: ${scope} memakan ${Math.round(ms)} ms`), {
        level: 'warning',
        scope: 'slow-operation',
        extra: { operation: scope, durationMs: Math.round(ms) },
      });
    }
  }
}
