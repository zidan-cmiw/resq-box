#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  RESQ-BOX — Uji Beban Kapasitas (capacity/loadtest.js)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  Node.js murni. TIDAK ada dependensi npm baru: hanya `fetch` bawaan Node 18+
 *  (Node 24 terverifikasi), `node:perf_hooks`, dan `node:crypto`.
 *  TIDAK ada uji WebSocket — `ws` hanya ada di node_modules sebagai dependensi
 *  transitif `jsdom`, bukan dependensi proyek, jadi tidak dipakai sama sekali.
 *
 * ─── formula.md: bagaimana VU memetakan ke parameter kapasitas ────────────
 *
 *  Dari capacity/README.md §3:
 *
 *      λ          = U_req × C × R / 60          [req/s]
 *      U_req      = E × M                        (target concurrent user)
 *
 *  Uji beban tidak bisa "membuat" U_req secara langsung: yang bisa dikendalikan
 *  hanyalah berapa sesi yang BENAR-BENAR mengirim request pada satu waktu, yaitu
 *  suku `U_req × C`. Jadi:
 *
 *      VU  ≡  U_req × C          (sesi konkuren yang aktif mengirim request)
 *
 *  sehingga:
 *
 *      U_req   =  VU / C
 *      E       =  U_req / M  =  VU / (C × M)
 *
 *  Contoh: C = 0.25 (default capacity/README.md), M = 10 →
 *      VU = 10   ⇒  U_req = 40     ⇒  mendekati E = 4
 *      VU = 250  ⇒  U_req = 1 000  ⇒  E = 100
 *      VU = 2500 ⇒  U_req = 10 000 ⇒  E = 1 000
 *  dengan M = 1000 (skenario terburuk):
 *      VU = 2500 ⇒  U_req = 10 000 ⇒  E = 10
 *
 *  Laju request yang dicapai dilaporkan skrip ini sebagai `λ_achieved`, dan
 *  secara definisi:
 *
 *      λ_achieved = (total request) / (durasi detik)
 *      R_achieved = λ_achieved × 60 / (U_req × C)   [req/pemain/menit]
 *                 = λ_achieved × 60 / VU
 *
 *  Jadi `R_achieved` yang dicetak di laporan adalah nilai R efektif dari
 *  campuran sesi yang disimulasikan; bandingkan dengan R = 2.0 di model
 *  (R hari ini ≈ 1.5, diturunkan dari call-site nyata di README §1.2).
 *
 *  Campuran sesi (mengikuti perilaku nyata yang diverifikasi dari kode):
 *    - login            1×  POST /auth/v1/token?grant_type=password   (model auth baru)
 *    - write progres    D×  POST /rest/v1/rpc/rpc_insert_submission
 *                           (SAMA seperti submitLevelProgress, supabaseClient.ts:906)
 *    - baca baris sendiri  Q×  GET  /rest/v1/students?user_id=eq.<uid>
 *    - baca data kelas     T×  GET  /rest/v1/level_submissions?classroom_code=eq.<kode>
 *                           (SAMA seperti fetchClassroomSubmissions, supabaseClient.ts:960-964,
 *                            termasuk `select('*')` tanpa limit — itu memang pola yang diuji)
 *
 * ─── Cara pakai ───────────────────────────────────────────────────────────
 *
 *  node loadtest.js --help
 *  RESQ_DRY_RUN=1 node loadtest.js                     # cetak rencana, NOL request
 *
 *  RESQ_SUPABASE_URL="https://xxxx.supabase.co" \
 *  RESQ_SUPABASE_ANON_KEY="eyJ..." \
 *  RESQ_TEST_PASSWORD="rahasia-staging" \
 *  RESQ_VU=5 RESQ_DURATION_S=30 \
 *  node loadtest.js
 *
 * ⚠️  AMAN SECARA DEFAULT, TAPI TETAP BACA INI:
 *   • Default VU = 5 dan durasi = 30 s.
 *   • Di atas 100 VU butuh `RESQ_ALLOW_HIGH_VU=1` secara eksplisit.
 *   • Skrip ini TIDAK PERNAH mengirim DELETE/PATCH/PUT. Hanya GET dan POST.
 *   • Setiap write membuat BARIS BARU di `level_submissions` dan baris itu tidak
 *     pernah dihapus (rpc_insert_submission = INSERT murni, supabase_schema.sql:369-385).
 *     Jalankan HANYA terhadap proyek staging/sekali-pakai, bukan produksi.
 *   • `RESQ_ENABLE_STUDENT_UPSERT=1` juga menulis ke tabel `students`. Default MATI.
 *   • Skrip ini TIDAK membaca `.env` — konfigurasi hanya dari environment variable,
 *     supaya tidak ada risiko tidak sengaja menembak proyek dari `.env`.
 *
 * ─── Environment variables ────────────────────────────────────────────────
 *
 *  Wajib untuk uji nyata:
 *    RESQ_SUPABASE_URL            URL proyek, mis. https://abcd.supabase.co
 *    RESQ_SUPABASE_ANON_KEY       anon/publishable key
 *    RESQ_TEST_PASSWORD           password untuk semua akun sintetis
 *
 *  Beban & durasi:
 *    RESQ_VU                      jumlah virtual user            (default 5, maks 100 tanpa izin)
 *    RESQ_ALLOW_HIGH_VU           "1" untuk mengizinkan VU > 100  (default tidak diset)
 *    RESQ_DURATION_S              durasi uji (detik)             (default 30)
 *    RESQ_RAMP_S                  waktu ramp-up (detik)          (default 5)
 *    RESQ_TIMEOUT_MS              timeout per request (ms)        (default 10000)
 *    RESQ_TICK_MS                 periode loop tiap VU (ms)       (default 1000)
 *
 *  Identitas sintetis (model auth baru):
 *    RESQ_EMAIL_SUFFIX            suffix email                   (default resqbox.local)
 *    RESQ_USER_PREFIX             awalan username                (default resqload)
 *    RESQ_USER_START              nomor user pertama             (default 1)
 *                                 → email = <prefix><start+i>@<suffix>
 *
 *  Campuran sesi:
 *    RESQ_WRITE_INTERVAL_MS       jeda antar write progres (ms)   (default 60000)
 *    RESQ_READ_OWN_PROB           peluang baca baris sendiri/tick (default 0.05)
 *    RESQ_TEACHER_PROB            porsi VU yang berperan guru     (default 0.1)
 *    RESQ_TEACHER_READ_INTERVAL_MS jeda baca data kelas guru (ms) (default 60000)
 *    RESQ_CLASSROOM               kode kelas untuk baca kelas     (default RESQ-8A)
 *    RESQ_CLASS_READ_LIMIT        `limit` pada baca kelas; 0 = TANPA limit (pola asli)
 *                                                               (default 0)
 *    RESQ_ENABLE_WRITES           "0" untuk uji baca-saja         (default 1)
 *    RESQ_ENABLE_STUDENT_UPSERT   "1" untuk ikut menguji rpc_upsert_student (default 0)
 *    RESQ_SUBMISSION_ID_STYLE     "uuid" (default) atau "legacy"
 *                                 "legacy" mereproduksi bug klien saat ini
 *                                 (`sub-<ts>` bukan UUID → cast ::UUID gagal,
 *                                  supabaseClient.ts:882 vs supabase_schema.sql:375)
 *
 *  SLO & keluaran:
 *    RESQ_SLO_P95_MS              ambang p95 untuk PASS           (default 750)
 *    RESQ_SLO_ERROR_RATE          ambang rasio error untuk PASS   (default 0.01)
 *    RESQ_MAX_SAMPLES             ukuran reservoir latensi        (default 200000)
 *    RESQ_REPORT_JSON             path file laporan JSON opsional
 *    RESQ_DRY_RUN                 "1" = cetak rencana, nol request
 *    RESQ_QUIET                   "1" = ringkas
 *
 *  Untuk TLS self-signed di Supabase lokal: NODE_TLS_REJECT_UNAUTHORIZED=0
 *  (hanya untuk localhost; jangan dipakai ke host nyata).
 *
 *  Keluar dengan kode 0 bila PASS, 1 bila FAIL, 2 bila konfigurasi salah/ditolak
 *  atau bila tidak ada satu pun VU yang berhasil login (uji tidak berjalan).
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { performance } from 'node:perf_hooks';
import { randomUUID } from 'node:crypto';
import { writeFileSync } from 'node:fs';

// ── 1. KONFIGURASI ────────────────────────────────────────────────────────

const HELP = process.argv.includes('--help') || process.argv.includes('-h');

const env = (key, fallback) => {
  const v = process.env[key];
  return v === undefined || v === '' ? fallback : v;
};
const num = (key, fallback) => {
  const v = process.env[key];
  if (v === undefined || v === '') return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};
const flag = (key, fallback = false) => {
  const v = process.env[key];
  if (v === undefined || v === '') return fallback;
  return v === '1' || v.toLowerCase() === 'true' || v.toLowerCase() === 'yes';
};

const CFG = {
  url: (env('RESQ_SUPABASE_URL', 'https://dry-run.supabase.co')).replace(/\/+$/, ''),
  anonKey: env('RESQ_SUPABASE_ANON_KEY', 'dry-run-anon-key'),
  password: env('RESQ_TEST_PASSWORD', ''),

  vu: Math.max(1, Math.floor(num('RESQ_VU', 5))),
  allowHighVu: flag('RESQ_ALLOW_HIGH_VU', false),
  durationS: Math.max(1, num('RESQ_DURATION_S', 30)),
  rampS: Math.max(0, num('RESQ_RAMP_S', 5)),
  timeoutMs: Math.max(500, num('RESQ_TIMEOUT_MS', 10000)),
  tickMs: Math.max(50, num('RESQ_TICK_MS', 1000)),

  emailSuffix: env('RESQ_EMAIL_SUFFIX', 'resqbox.local'),
  userPrefix: env('RESQ_USER_PREFIX', 'resqload'),
  userStart: Math.floor(num('RESQ_USER_START', 1)),

  writeIntervalMs: Math.max(0, num('RESQ_WRITE_INTERVAL_MS', 60000)),
  readOwnProb: Math.min(1, Math.max(0, num('RESQ_READ_OWN_PROB', 0.05))),
  teacherProb: Math.min(1, Math.max(0, num('RESQ_TEACHER_PROB', 0.1))),
  teacherReadIntervalMs: Math.max(0, num('RESQ_TEACHER_READ_INTERVAL_MS', 60000)),
  classroom: env('RESQ_CLASSROOM', 'RESQ-8A'),
  classReadLimit: Math.max(0, Math.floor(num('RESQ_CLASS_READ_LIMIT', 0))),
  enableWrites: flag('RESQ_ENABLE_WRITES', true),
  enableStudentUpsert: flag('RESQ_ENABLE_STUDENT_UPSERT', false),
  submissionIdStyle: env('RESQ_SUBMISSION_ID_STYLE', 'uuid'),

  sloP95Ms: num('RESQ_SLO_P95_MS', 750),
  sloErrorRate: num('RESQ_SLO_ERROR_RATE', 0.01),
  maxSamples: Math.max(1000, Math.floor(num('RESQ_MAX_SAMPLES', 200000))),
  reportJson: env('RESQ_REPORT_JSON', ''),
  dryRun: flag('RESQ_DRY_RUN', false),
  quiet: flag('RESQ_QUIET', false),

  // konstanta model, hanya untuk pelaporan
  C: num('RESQ_C', 0.25),
  M: num('RESQ_M', 10),
};

const HARD_VU_CAP = 100000; // pengaman mutlak
const MAX_VU_WITHOUT_CONSENT = 100;

// ── 2. BANTUAN ────────────────────────────────────────────────────────────

const t0 = performance.now();
const nowS = () => (performance.now() - t0) / 1000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const pad = (s, n) => String(s).padEnd(n);
const padL = (s, n) => String(s).padStart(n);
const fmtInt = (n) => Number(n).toLocaleString('en-US');
const fmtBytes = (n) => {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KiB`;
  if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(2)} MiB`;
  return `${(n / 1024 / 1024 / 1024).toFixed(2)} GiB`;
};

function printHelp() {
  const header = `
RESQ-BOX — uji beban kapasitas (capacity/loadtest.js)

PEMAKAIAN
  node loadtest.js [--help]

  Konfigurasi HANYA lewat environment variable (tidak membaca .env).

CONTOH
  # 1. Cetak rencana tanpa satu pun request jaringan (aman, tanpa kredensial)
  RESQ_DRY_RUN=1 node loadtest.js

  # 2. Uji kecil ke proyek STAGING (5 VU, 30 detik)
  RESQ_SUPABASE_URL="https://xxxx.supabase.co" \\
  RESQ_SUPABASE_ANON_KEY="eyJ..." \\
  RESQ_TEST_PASSWORD="rahasia-staging" \\
  RESQ_VU=5 RESQ_DURATION_S=30 \\
  node loadtest.js

  # 3. Baru boleh > 100 VU dengan persetujuan eksplisit
  RESQ_ALLOW_HIGH_VU=1 RESQ_VU=500 RESQ_DURATION_S=120 \\
  RESQ_SUPABASE_URL="..." RESQ_SUPABASE_ANON_KEY="..." RESQ_TEST_PASSWORD="..." \\
  node loadtest.js

MAPPING VU → KAPASITAS (lihat komentar panjang di kepala berkas ini)
  VU       = U_req x C        sesi konkuren yang aktif mengirim request
  U_req    = VU / C
  E        = VU / (C x M)
  R_achieved = lambda_achieved x 60 / VU      [req/pemain/menit]

ENVIRONMENT VARIABLES
${pad('  RESQ_SUPABASE_URL', 34)}wajib — URL proyek
${pad('  RESQ_SUPABASE_ANON_KEY', 34)}wajib — anon/publishable key
${pad('  RESQ_TEST_PASSWORD', 34)}wajib — password akun sintetis
${pad('  RESQ_VU', 34)}jumlah VU                       (default 5; > 100 butuh izin)
${pad('  RESQ_ALLOW_HIGH_VU', 34)}"1" mengizinkan VU > 100
${pad('  RESQ_DURATION_S', 34)}durasi uji, detik           (default 30)
${pad('  RESQ_RAMP_S', 34)}waktu ramp-up, detik         (default 5)
${pad('  RESQ_TIMEOUT_MS', 34)}timeout per request, ms     (default 10000)
${pad('  RESQ_TICK_MS', 34)}periode loop tiap VU, ms      (default 1000)
${pad('  RESQ_EMAIL_SUFFIX', 34)}suffix email                (default resqbox.local)
${pad('  RESQ_USER_PREFIX', 34)}awalan username             (default resqload)
${pad('  RESQ_USER_START', 34)}nomor user pertama          (default 1)
${pad('  RESQ_WRITE_INTERVAL_MS', 34)}jeda write progres, ms      (default 60000)
${pad('  RESQ_READ_OWN_PROB', 34)}peluang baca sendiri/tick   (default 0.05)
${pad('  RESQ_TEACHER_PROB', 34)}porsi VU berperan guru     (default 0.1)
${pad('  RESQ_TEACHER_READ_INTERVAL_MS', 34)}jeda baca kelas guru, ms    (default 60000)
${pad('  RESQ_CLASSROOM', 34)}kode kelas                  (default RESQ-8A)
${pad('  RESQ_CLASS_READ_LIMIT', 34)}limit baca kelas; 0 = tanpa limit (default 0)
${pad('  RESQ_ENABLE_WRITES', 34)}"0" = uji baca-saja          (default 1)
${pad('  RESQ_ENABLE_STUDENT_UPSERT', 34)}"1" = uji rpc_upsert_student (default 0)
${pad('  RESQ_SUBMISSION_ID_STYLE', 34)}"uuid" | "legacy"           (default uuid)
${pad('  RESQ_SLO_P95_MS', 34)}ambang p95 PASS             (default 750)
${pad('  RESQ_SLO_ERROR_RATE', 34)}ambang error PASS           (default 0.01)
${pad('  RESQ_MAX_SAMPLES', 34)}ukuran reservoir latensi    (default 200000)
${pad('  RESQ_REPORT_JSON', 34)}tulis laporan JSON ke path
${pad('  RESQ_DRY_RUN', 34)}"1" = cetak rencana saja
${pad('  RESQ_QUIET', 34)}"1" = keluaran ringkas
${pad('  RESQ_C', 34)}concurrent-active fraction   (default 0.25, hanya laporan)
${pad('  RESQ_M', 34)}multiplier                   (default 10, hanya laporan)

KEAMANAN
  • Skrip ini hanya mengirim GET dan POST. Tidak ada DELETE/PATCH/PUT.
  • Default 5 VU / 30 detik.
  • VU > 100 ditolak kecuali RESQ_ALLOW_HIGH_VU=1.
  • Setiap write MEMBUAT BARIS BARU di level_submissions yang tidak pernah
    dihapus. Jalankan hanya di proyek staging/sekali-pakai.
  • Tidak membaca .env sama sekali.

KELUARAN
  0 = PASS   1 = FAIL (SLO)   2 = konfigurasi salah, ditolak, atau uji tidak berjalan
`;
  process.stdout.write(header.trimStart());
}

// ── 3. STATISTIK ──────────────────────────────────────────────────────────

class Stats {
  constructor(maxSamples) {
    this.maxSamples = maxSamples;
    this.samples = new Float64Array(maxSamples);
    this.n = 0;            // jumlah sampel yang sudah "masuk" reservoir
    this.total = 0;        // total request selesai
    this.byStatus = new Map();
    this.byEndpoint = new Map();
    this.netErrors = new Map();
    this.bytesIn = 0;
    this.bytesOut = 0;
    this.authFailures = 0;
    this.ok = 0;
  }

  record(endpoint, status, ms, bytesIn = 0, bytesOut = 0, errCode = null) {
    this.total += 1;
    this.bytesIn += bytesIn;
    this.bytesOut += bytesOut;

    const key = status === 0 ? `net:${errCode || 'error'}` : String(status);
    this.byStatus.set(key, (this.byStatus.get(key) || 0) + 1);

    const ep = this.byEndpoint.get(endpoint) || { total: 0, ok: 0, fail: 0, sumMs: 0 };
    ep.total += 1;
    ep.sumMs += ms;
    if (status >= 200 && status < 300) ep.ok += 1;
    else ep.fail += 1;
    this.byEndpoint.set(endpoint, ep);

    if (status === 0) this.netErrors.set(errCode || 'error', (this.netErrors.get(errCode || 'error') || 0) + 1);
    if (status >= 200 && status < 300) this.ok += 1;

    // Reservoir sampling (Algorithm R) → persentil tetap akurat tanpa OOM.
    if (this.n < this.maxSamples) {
      this.samples[this.n] = ms;
    } else {
      const j = Math.floor(Math.random() * this.n);
      if (j < this.maxSamples) this.samples[j] = ms;
    }
    this.n += 1;
  }

  percentile(p) {
    const len = Math.min(this.n, this.maxSamples);
    if (len === 0) return 0;
    const arr = Array.prototype.slice.call(this.samples, 0, len).sort((a, b) => a - b);
    const idx = Math.min(len - 1, Math.max(0, Math.ceil((p / 100) * len) - 1));
    return arr[idx];
  }

  errorCount() {
    let e = 0;
    for (const [k, v] of this.byStatus) {
      const code = Number(k);
      if (!(code >= 200 && code < 300)) e += v;
    }
    return e;
  }

  errorRate() {
    return this.total === 0 ? 0 : this.errorCount() / this.total;
  }
}

// ── 4. HTTP ───────────────────────────────────────────────────────────────

const BASE_HEADERS = () => ({
  apikey: CFG.anonKey,
  'Content-Type': 'application/json',
  'X-Client-Info': 'resqbox-capacity-loadtest/1.0',
});

// Ambil kode error jaringan sedalam mungkin. `fetch` di Node membungkus error
// koneksi sebagai TypeError → cause (AggregateError) → errors[] → code.
function netCode(err) {
  if (!err) return 'UNKNOWN';
  const direct = err.code || err.cause?.code;
  if (direct) return direct;
  const nested = err.cause?.errors;
  if (Array.isArray(nested) && nested.length > 0) {
    const codes = [...new Set(nested.map((e) => e?.code || e?.name).filter(Boolean))];
    if (codes.length > 0) return codes.join('|');
  }
  if (Array.isArray(err.errors) && err.errors.length > 0) {
    const codes = [...new Set(err.errors.map((e) => e?.code || e?.name).filter(Boolean))];
    if (codes.length > 0) return codes.join('|');
  }
  // Terakhir: pesan cause sering lebih informatif daripada namanya
  // (mis. "bad port" untuk port yang diblokir undici).
  if (err.cause?.message) return String(err.cause.message).slice(0, 60);
  return err.cause?.name || err.name || 'UNKNOWN';
}

async function call(stats, endpoint, url, { method = 'GET', headers = {}, body = null } = {}) {
  const started = performance.now();
  let status = 0;
  let errCode = null;
  let bytesIn = 0;
  let bytesOut = 0;

  try {
    // Pengaman: tidak ada metode destruktif, apa pun yang terjadi.
    if (method !== 'GET' && method !== 'POST') {
      throw new Error(`metode tidak diizinkan: ${method}`);
    }
    const payload = body === null ? undefined : JSON.stringify(body);
    if (payload) bytesOut = Buffer.byteLength(payload);

    const res = await fetch(url, {
      method,
      headers: { ...BASE_HEADERS(), ...headers },
      body: payload,
      signal: AbortSignal.timeout(CFG.timeoutMs),
      redirect: 'follow',
    });
    status = res.status;
    // Konsumsi body agar koneksi bisa dipakai ulang (keep-alive) dan
    // agar byte masuk terhitung.
    const text = await res.text();
    bytesIn = Buffer.byteLength(text);
  } catch (err) {
    status = 0;
    errCode = netCode(err);
    bytesIn = 0;
  }

  const ms = performance.now() - started;
  stats.record(endpoint, status, ms, bytesIn, bytesOut, errCode);
  return { status, ms, ok: status >= 200 && status < 300 };
}

// ── 5. VIRTUAL USER ───────────────────────────────────────────────────────

function makeEmail(i) {
  return `${CFG.userPrefix}${i}@${CFG.emailSuffix}`;
}

async function authenticate(stats, i) {
  const email = makeEmail(i);
  const url = `${CFG.url}/auth/v1/token?grant_type=password`;
  const started = performance.now();
  let status = 0;
  let errCode = null;
  let token = null;
  let uid = null;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: BASE_HEADERS(),
      body: JSON.stringify({ email, password: CFG.password }),
      signal: AbortSignal.timeout(CFG.timeoutMs),
    });
    status = res.status;
    const text = await res.text();
    if (status >= 200 && status < 300) {
      try {
        const j = JSON.parse(text);
        token = j.access_token || null;
        uid = j.user?.id || null;
      } catch { /* biarkan null */ }
    }
  } catch (err) {
    errCode = netCode(err);
  }
  const ms = performance.now() - started;
  stats.record('AUTH login', status, ms, 0, 0, errCode);
  if (!token) stats.authFailures += 1;
  return { token, uid, email, status };
}

function buildSubmission(uid, levelNumber) {
  const id = CFG.submissionIdStyle === 'legacy'
    ? `sub-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` // mereproduksi bug klien
    : randomUUID();
  const details = {
    mode: 'loadtest',
    is_completed: false,
    completed_missions: ['job_01', 'job_02', 'job_03'],
    completed_count: 3,
    total_missions: 20,
    status_text: '3 Poin',
    stage_label: 'Selesai 3/20 Misi (15 Poin)',
  };
  return {
    p_data: {
      id,
      student_id: uid || randomUUID(),
      student_name: 'Load Test User',
      classroom_code: CFG.classroom,
      level_number: levelNumber,
      score: 15,
      details,
      completed_at: new Date().toISOString(),
    },
  };
}

function buildStudentUpsert(uid) {
  return {
    p_data: {
      id: uid || randomUUID(),
      classroom_code: CFG.classroom,
      name: 'Load Test User',
      class_name: 'Kelas Uji Beban',
      absent_number: '1',
      avatar_config: {},
      unlocked_level: 2,
    },
  };
}

async function runVu(stats, cfg) {
  const auth = await authenticate(stats, cfg.index);
  if (!auth.token) return; // tidak ada token → tidak bisa melanjutkan sesi

  const authHeader = { Authorization: `Bearer ${auth.token}` };
  const deadline = cfg.deadline;
  const levelNumber = 1 + (cfg.index % 3);

  let nextWriteAt = 0;
  let nextTeacherReadAt = 0;

  while (performance.now() < deadline) {
    const t = performance.now();

    if (cfg.role === 'teacher') {
      if (t >= nextTeacherReadAt) {
        nextTeacherReadAt = t + CFG.teacherReadIntervalMs;
        const limit = CFG.classReadLimit > 0 ? `&limit=${CFG.classReadLimit}` : '';
        await call(
          stats,
          'GET level_submissions (kelas)',
          `${CFG.url}/rest/v1/level_submissions?select=*&classroom_code=eq.${encodeURIComponent(
            CFG.classroom
          )}&order=completed_at.desc${limit}`,
          { headers: authHeader }
        );
      }
    } else {
      if (CFG.enableWrites && t >= nextWriteAt) {
        nextWriteAt = t + CFG.writeIntervalMs;
        await call(stats, 'POST rpc_insert_submission', `${CFG.url}/rest/v1/rpc/rpc_insert_submission`, {
          method: 'POST',
          headers: { ...authHeader, Prefer: 'return=minimal' },
          body: buildSubmission(auth.uid, levelNumber),
        });

        if (CFG.enableStudentUpsert) {
          await call(stats, 'POST rpc_upsert_student', `${CFG.url}/rest/v1/rpc/rpc_upsert_student`, {
            method: 'POST',
            headers: { ...authHeader, Prefer: 'return=minimal' },
            body: buildStudentUpsert(auth.uid),
          });
        }
      }

      if (Math.random() < CFG.readOwnProb) {
        const filter = auth.uid ? `user_id=eq.${auth.uid}` : 'limit=1';
        await call(stats, 'GET students (sendiri)', `${CFG.url}/rest/v1/students?select=*&${filter}&limit=1`, {
          headers: authHeader,
        });
      }
    }

    const elapsed = performance.now() - t;
    const wait = CFG.tickMs - elapsed;
    if (wait > 0) await sleep(wait);
  }
}

// ── 6. VALIDASI & PENGAMAN ────────────────────────────────────────────────

function validate() {
  const errors = [];
  const warnings = [];

  if (CFG.vu > MAX_VU_WITHOUT_CONSENT && !CFG.allowHighVu) {
    errors.push(
      `RESQ_VU=${CFG.vu} melebihi batas aman ${MAX_VU_WITHOUT_CONSENT}. ` +
        'Set RESQ_ALLOW_HIGH_VU=1 kalau kamu benar-benar bermaksud demikian.'
    );
  }
  if (CFG.vu > HARD_VU_CAP) {
    errors.push(`RESQ_VU=${CFG.vu} melebihi batas mutlak ${HARD_VU_CAP}.`);
  }
  if (!['uuid', 'legacy'].includes(CFG.submissionIdStyle)) {
    errors.push('RESQ_SUBMISSION_ID_STYLE harus "uuid" atau "legacy".');
  }
  if (CFG.emailSuffix.includes('@')) {
    errors.push(`RESQ_EMAIL_SUFFIX tidak boleh memuat "@" (dapat: ${CFG.emailSuffix}).`);
  }

  if (!CFG.dryRun) {
    if (!process.env.RESQ_SUPABASE_URL) errors.push('RESQ_SUPABASE_URL wajib diisi (atau pakai RESQ_DRY_RUN=1).');
    if (!process.env.RESQ_SUPABASE_ANON_KEY) errors.push('RESQ_SUPABASE_ANON_KEY wajib diisi (atau pakai RESQ_DRY_RUN=1).');
    if (!CFG.password) errors.push('RESQ_TEST_PASSWORD wajib diisi (atau pakai RESQ_DRY_RUN=1).');
    if (!/^https?:\/\//.test(CFG.url)) errors.push(`RESQ_SUPABASE_URL harus http(s):// (dapat: ${CFG.url}).`);
    if (CFG.url === 'https://dry-run.supabase.co') {
      warnings.push('URL masih default dry-run; pastikan ini proyek staging, bukan placeholder.');
    }
  }
  if (CFG.teacherProb === 0 && CFG.classReadLimit === 0) {
    warnings.push('RESQ_TEACHER_PROB=0 → jalur baca kelas (fetchClassroomSubmissions) tidak diuji.');
  }

  return { errors, warnings };
}

function estimateRows() {
  if (!CFG.enableWrites) return 0;
  const studentVu = Math.round(CFG.vu * (1 - CFG.teacherProb));
  const durationMs = CFG.durationS * 1000;
  const writesPerVu = CFG.writeIntervalMs > 0 ? Math.max(1, Math.floor(durationMs / CFG.writeIntervalMs)) : 1;
  return studentVu * writesPerVu * (CFG.enableStudentUpsert ? 2 : 1);
}

function printPlan() {
  const uReq = CFG.vu / CFG.C;
  const e = uReq / CFG.M;
  const lines = [
    '',
    '── RENCANA UJI ──────────────────────────────────────────────────────────',
    `  Target URL              : ${CFG.url}`,
    `  VU (U_req x C)          : ${CFG.vu}${CFG.allowHighVu ? '  [HIGH-VU DIIZINKAN]' : ''}`,
    `  Durasi / ramp-up        : ${CFG.durationS} s / ${CFG.rampS} s`,
    `  Tick per VU             : ${CFG.tickMs} ms`,
    `  Interval write progres  : ${CFG.enableWrites ? `${CFG.writeIntervalMs} ms` : 'NONAKTIF (uji baca-saja)'}`,
    `  Interval baca kelas     : ${CFG.teacherReadIntervalMs} ms (porsi guru ${(CFG.teacherProb * 100).toFixed(1)}%)`,
    `  Peluang baca sendiri    : ${(CFG.readOwnProb * 100).toFixed(1)}% per tick`,
    `  rpc_upsert_student      : ${CFG.enableStudentUpsert ? 'AKTIF (menulis ke tabel students)' : 'nonaktif'}`,
    `  Gaya id submission      : ${CFG.submissionIdStyle}${CFG.submissionIdStyle === 'legacy' ? '  ← mereproduksi bug cast ::UUID' : ''}`,
    `  Email sintetis          : ${makeEmail(CFG.userStart)} … ${makeEmail(CFG.userStart + CFG.vu - 1)}`,
    `  SLO                     : p95 ≤ ${CFG.sloP95Ms} ms, error ≤ ${(CFG.sloErrorRate * 100).toFixed(2)}%`,
    `  Reservoir latensi       : ${fmtInt(CFG.maxSamples)} sampel`,
    '',
    '  Turunan model kapasitas (C = ' + CFG.C + ', M = ' + CFG.M + '):',
    `    U_req = VU / C        = ${fmtInt(Math.round(uReq))} concurrent user`,
    `    E     = VU / (C x M)  = ${e.toFixed(1)} pemain nyata simultan`,
    '',
    `  ⚠  Perkiraan baris BARU di level_submissions: ~${fmtInt(estimateRows())}`,
    '     (INSERT murni, tidak pernah dihapus — pakai proyek staging/sekali-pakai)',
    '─────────────────────────────────────────────────────────────────────────',
    '',
  ];
  process.stdout.write(lines.join('\n'));
}

// ── 7. ORKESTRASI ─────────────────────────────────────────────────────────

async function main() {
  if (HELP) {
    printHelp();
    process.exit(0);
  }

  const { errors, warnings } = validate();
  for (const w of warnings) process.stderr.write(`PERINGATAN: ${w}\n`);
  if (errors.length > 0) {
    for (const e of errors) process.stderr.write(`ERROR: ${e}\n`);
    process.stderr.write('\nJalankan `node loadtest.js --help` untuk daftar lengkap.\n');
    process.exit(2);
  }

  if (!CFG.quiet) printPlan();

  if (CFG.dryRun) {
    process.stdout.write('RESQ_DRY_RUN=1 → nol request dikirim. Selesai.\n');
    process.exit(0);
  }

  const stats = new Stats(CFG.maxSamples);
  const start = performance.now();
  const deadline = start + CFG.durationS * 1000;

  process.stdout.write(`Mulai ${CFG.vu} VU, ramp ${CFG.rampS}s, durasi ${CFG.durationS}s…\n`);

  const rampStep = CFG.rampS > 0 ? (CFG.rampS * 1000) / CFG.vu : 0;
  const workers = [];
  for (let i = 0; i < CFG.vu; i += 1) {
    const index = CFG.userStart + i;
    const role = Math.random() < CFG.teacherProb ? 'teacher' : 'student';
    workers.push(runVu(stats, { index, role, deadline }));
    if (rampStep > 0 && i < CFG.vu - 1) await sleep(rampStep);
  }

  // Progres langsung (bukan busy-poll: hanya untuk keluaran).
  let progressTimer = null;
  if (!CFG.quiet) {
    progressTimer = setInterval(() => {
      const el = nowS();
      const rps = el > 0 ? stats.total / el : 0;
      process.stdout.write(
        `\r  t=${el.toFixed(0)}s  req=${fmtInt(stats.total)}  ` +
          `λ=${rps.toFixed(1)}/s  err=${fmtInt(stats.errorCount())}   `
      );
    }, 2000);
  }

  await Promise.allSettled(workers);
  if (progressTimer) clearInterval(progressTimer);
  if (!CFG.quiet) process.stdout.write('\r'.padEnd(1) + ' '.repeat(78) + '\r');

  const elapsedS = (performance.now() - start) / 1000;
  const rps = elapsedS > 0 ? stats.total / elapsedS : 0;
  const p50 = stats.percentile(50);
  const p95 = stats.percentile(95);
  const p99 = stats.percentile(99);
  const errCount = stats.errorCount();
  const errRate = stats.errorRate();
  const rAchieved = (rps * 60) / CFG.vu;
  const uReq = CFG.vu / CFG.C;
  const ePlayers = uReq / CFG.M;

  // Kalau tidak ada satu pun VU yang berhasil login, uji beban tidak pernah
  // benar-benar berjalan: λ dan R di bawah TIDAK boleh ditafsirkan.
  const aborted = stats.authFailures >= CFG.vu;

  const pass = !aborted && p95 <= CFG.sloP95Ms && errRate <= CFG.sloErrorRate && stats.authFailures === 0;

  const out = [];
  out.push('');
  out.push('══ HASIL UJI BEBAN ═══════════════════════════════════════════════════════');
  out.push(`  Durasi terukur          : ${elapsedS.toFixed(2)} s`);
  out.push(`  VU                      : ${fmtInt(CFG.vu)}`);
  out.push(`  Total request           : ${fmtInt(stats.total)}`);
  out.push(`  Berhasil (2xx)          : ${fmtInt(stats.ok)}`);
  out.push(`  Error                   : ${fmtInt(errCount)}  (${(errRate * 100).toFixed(3)}%)`);
  out.push(`  Kegagalan auth          : ${fmtInt(stats.authFailures)}${aborted ? '   ← SEMUA VU GAGAL LOGIN' : ''}`);
  out.push('');
  if (aborted) {
    out.push('  ⚠  UJI TIDAK BERJALAN. Tidak ada VU yang berhasil login, jadi beban');
    out.push('     sesi tidak pernah disimulasikan. Angka λ dan R di bawah TIDAK');
    out.push('     merepresentasikan kapasitas apa pun — perbaiki autentikasi dulu:');
    out.push(`       • apakah akun <${CFG.userPrefix}N@${CFG.emailSuffix}> sudah dibuat di Supabase Auth?`);
    out.push('       • apakah "Email provider" aktif dan "Confirm email" dimatikan?');
    out.push(`       • apakah RESQ_TEST_PASSWORD benar? (URL: ${CFG.url})`);
    out.push(`       • status HTTP terakhir: ${[...stats.byStatus.keys()].join(', ') || 'tidak ada'}`);
    out.push('');
  }
  out.push(`  λ dicapai               : ${rps.toFixed(2)} req/s`);
  out.push(`  R dicapai               : ${rAchieved.toFixed(2)} req/pemain/menit  (model: 2.0)`);
  out.push(`  U_req setara (VU/C)     : ${fmtInt(Math.round(uReq))} concurrent user`);
  out.push(`  E setara (VU/(C×M))     : ${ePlayers.toFixed(1)} pemain nyata simultan  (M=${CFG.M})`);
  out.push('');
  out.push(`  Latensi p50             : ${p50.toFixed(1)} ms`);
  out.push(`  Latensi p95             : ${p95.toFixed(1)} ms   (SLO ≤ ${CFG.sloP95Ms} ms)`);
  out.push(`  Latensi p99             : ${p99.toFixed(1)} ms`);
  out.push(`  Sampel latensi          : ${fmtInt(Math.min(stats.n, CFG.maxSamples))} dari ${fmtInt(stats.n)}`);
  out.push('');
  out.push(`  Byte keluar (request)   : ${fmtBytes(stats.bytesOut)}`);
  out.push(`  Byte masuk (response)   : ${fmtBytes(stats.bytesIn)}`);
  out.push('');
  out.push('  Error per kode status:');
  const sortedStatus = [...stats.byStatus.entries()].sort((a, b) => b[1] - a[1]);
  for (const [code, count] of sortedStatus) {
    const isErr = !(Number(code) >= 200 && Number(code) < 300);
    out.push(`    ${pad(code, 26)} ${padL(fmtInt(count), 10)}${isErr ? '   ← GAGAL' : ''}`);
  }
  if (stats.netErrors.size > 0) {
    out.push('  Error jaringan:');
    for (const [code, count] of [...stats.netErrors.entries()].sort((a, b) => b[1] - a[1])) {
      out.push(`    ${pad(code, 26)} ${padL(fmtInt(count), 10)}`);
    }
  }
  out.push('');
  out.push('  Per endpoint (rata-rata ms / gagal):');
  for (const [ep, s] of [...stats.byEndpoint.entries()].sort((a, b) => b[1].total - a[1].total)) {
    const avg = s.total ? s.sumMs / s.total : 0;
    out.push(`    ${pad(ep, 34)} n=${padL(fmtInt(s.total), 8)}  avg=${padL(avg.toFixed(1), 8)} ms  gagal=${fmtInt(s.fail)}`);
  }
  out.push('');
  out.push('  Petunjuk tafsir:');
  if (errCount > 0) {
    out.push('    • 401/403 → token/anon key/RLS. Cek RESQ_TEST_PASSWORD dan policy.');
    out.push('    • 429     → rate limit; turunkan VU atau tambah backoff di klien.');
    out.push('    • 5xx/504 → Postgres/PostgREST kelelahan: lihat compute, pool, dan indeks.');
    out.push('    • net:     → timeout/DNS/TLS; cek RESQ_TIMEOUT_MS dan koneksi.');
    out.push('    • 400 dengan "invalid input syntax for type uuid" → kamu memakai');
    out.push('      RESQ_SUBMISSION_ID_STYLE=legacy, yang memang mereproduksi bug klien.');
  } else {
    out.push('    • Nol error: naikkan RESQ_VU bertahap (dengan RESQ_ALLOW_HIGH_VU=1)');
    out.push('      sampai p95 melewati SLO, lalu catat λ di titik itu sebagai kapasitas nyata.');
  }
  out.push('');
  const verdict = aborted ? 'TIDAK BERJALAN' : pass ? 'PASS' : 'FAIL';
  out.push(
    `  ══> ${verdict}  (p95 ${p95.toFixed(1)} ms vs ${CFG.sloP95Ms} ms; ` +
      `error ${(errRate * 100).toFixed(3)}% vs ${(CFG.sloErrorRate * 100).toFixed(2)}%)`
  );
  out.push('══════════════════════════════════════════════════════════════════════════');
  out.push('');
  process.stdout.write(out.join('\n'));

  if (CFG.reportJson) {
    const report = {
      startedAt: new Date(Date.now() - elapsedS * 1000).toISOString(),
      finishedAt: new Date().toISOString(),
      config: { ...CFG, anonKey: '***', password: '***' },
      metrics: {
        elapsedS,
        vu: CFG.vu,
        totalRequests: stats.total,
        ok: stats.ok,
        errors: errCount,
        errorRate: errRate,
        authFailures: stats.authFailures,
        achievedReqPerS: rps,
        achievedReqPerPlayerPerMin: rAchieved,
        p50Ms: p50,
        p95Ms: p95,
        p99Ms: p99,
        bytesOut: stats.bytesOut,
        bytesIn: stats.bytesIn,
        byStatus: Object.fromEntries(stats.byStatus),
        byEndpoint: Object.fromEntries(
          [...stats.byEndpoint.entries()].map(([k, v]) => [k, { ...v, avgMs: v.total ? v.sumMs / v.total : 0 }])
        ),
      },
      slo: { p95Ms: CFG.sloP95Ms, errorRate: CFG.sloErrorRate },
      verdict,
      abortedAtAuth: aborted,
    };
    try {
      writeFileSync(CFG.reportJson, JSON.stringify(report, null, 2));
      process.stdout.write(`Laporan JSON ditulis ke ${CFG.reportJson}\n`);
    } catch (err) {
      process.stderr.write(`Gagal menulis laporan JSON: ${err.message}\n`);
    }
  }

  // 0 = PASS, 1 = FAIL (SLO), 2 = uji tidak berjalan karena autentikasi.
  process.exit(aborted ? 2 : pass ? 0 : 1);
}

main().catch((err) => {
  process.stderr.write(`Gagal menjalankan uji beban: ${err?.stack || err}\n`);
  process.exit(2);
});
