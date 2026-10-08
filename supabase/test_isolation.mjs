#!/usr/bin/env node
/**
 * RESQ-BOX — Uji Isolasi Data Antar-User (bukti "user #1 hanya bisa lihat miliknya")
 *
 * Skrip ini MEMBUKTIKAN, bukan mengasumsikan. Ia:
 *   1. Mendaftarkan dua akun uji (A dan B) lewat Supabase Auth.
 *   2. Login sebagai A, lalu mencoba membaca data milik B.
 *   3. Login sebagai B, lalu mencoba membaca data milik A.
 *   4. Mencoba membaca tabel kredensial (user_accounts) sebagai anon.
 *   5. Mencoba memanggil fungsi admin sebagai siswa biasa.
 *
 * Semua percobaan harus DITOLAK / mengembalikan kosong.
 *
 * ── Cara pakai ────────────────────────────────────────────────────────────
 *   Simpan berkas .env berisi:
 *     VITE_SUPABASE_URL=https://xxxx.supabase.co
 *     VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
 *
 *   Lalu:
 *     node supabase/test_isolation.mjs                # pakai akun uji acak
 *     node supabase/test_isolation.mjs --cleanup      # hapus akun uji setelahnya
 *
 * ── Peringatan ────────────────────────────────────────────────────────────
 *   • Jalankan di project Supabase UJI/STAGING lebih dulu, bukan produksi.
 *   • Skrip ini hanya MEMBACA dan membuat 2 akun siswa; tidak menghapus data
 *     apa pun kecuali diminta lewat --cleanup (dan itu hanya akun yang ia buat).
 *   • Kelas uji harus ada lebih dulu (default RESQ-8A). Lihat supabase/README.md.
 */

import { readFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');

// ── Baca .env sederhana (tanpa dependensi) ────────────────────────────────
function loadEnv() {
  const env = { ...process.env };
  for (const candidate of ['.env', '.env.local']) {
    try {
      const text = readFileSync(resolve(ROOT, candidate), 'utf8');
      for (const raw of text.split(/\r?\n/)) {
        const line = raw.trim();
        if (!line || line.startsWith('#')) continue;
        const eq = line.indexOf('=');
        if (eq === -1) continue;
        const key = line.slice(0, eq).trim();
        const val = line.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
        if (!(key in process.env)) env[key] = val;
      }
    } catch {
      /* berkas tidak ada: abaikan */
    }
  }
  return env;
}

const env = loadEnv();
const SUPABASE_URL = env.VITE_SUPABASE_URL;
const ANON_KEY = env.VITE_SUPABASE_ANON_KEY;
const EMAIL_DOMAIN = env.VITE_AUTH_EMAIL_DOMAIN || 'resqbox.local';
const TEST_CLASS = env.RESQ_TEST_CLASS || 'RESQ-8A';

if (!SUPABASE_URL || !ANON_KEY) {
  console.error('❌ VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY wajib ada di .env');
  process.exit(2);
}

const CLEANUP = process.argv.includes('--cleanup');

// ── Util HTTP ─────────────────────────────────────────────────────────────
async function call(path, { method = 'GET', token, body, headers = {} } = {}) {
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    method,
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${token || ANON_KEY}`,
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = text;
  }
  return { status: res.status, ok: res.ok, body: json };
}

const auth = {
  signUp: (email, password, data) =>
    call('/auth/v1/signup', { method: 'POST', body: { email, password, data } }),
  signIn: (email, password) =>
    call('/auth/v1/token?grant_type=password', { method: 'POST', body: { email, password } }),
};

// ── Pelaporan hasil ───────────────────────────────────────────────────────
const results = [];
function check(name, passed, detail) {
  results.push({ name, passed, detail });
  console.log(`  ${passed ? '✅' : '❌'}  ${name}`);
  if (detail) console.log(`        ${detail}`);
}

// ── Skenario ──────────────────────────────────────────────────────────────
const runId = randomBytes(3).toString('hex');
const userA = { username: `ujia${runId}`, password: `RahasiaA!${runId}` };
const userB = { username: `ujib${runId}`, password: `RahasiaB!${runId}` };

async function makeUser(u) {
  const email = `${u.username}@${EMAIL_DOMAIN}`;
  await auth.signUp(email, u.password, {
    username: u.username,
    name: `Uji ${u.username}`,
    absent_number: '1',
    classroom_code: TEST_CLASS,
  });
  const login = await auth.signIn(email, u.password);
  const token = login.body?.access_token;
  const id = login.body?.user?.id;
  return { ...u, email, token, id, login };
}

async function main() {
  console.log('\n🔐 RESQ-BOX — Uji Isolasi Data Antar-User');
  console.log(`   Project : ${SUPABASE_URL}`);
  console.log(`   Kelas   : ${TEST_CLASS}`);
  console.log('   ─────────────────────────────────────────────────────');

  // 0. Prasyarat: pastikan bisa daftar & login
  const A = await makeUser(userA);
  if (!A.token) {
    console.error('\n❌ Tidak bisa mendaftar/login akun uji A.');
    console.error('   Penyebab umum: "Confirm email" masih menyala, atau kode kelas belum ada.');
    console.error('   Respons:', JSON.stringify(A.login.body).slice(0, 300));
    process.exit(1);
  }

  const B = await makeUser(userB);
  if (!B.token) {
    console.error('\n❌ Tidak bisa mendaftar/login akun uji B.');
    console.error('   Respons:', JSON.stringify(B.login.body).slice(0, 300));
    process.exit(1);
  }

  console.log(`   Akun uji: A=${A.username} (${A.id})`);
  console.log(`             B=${B.username} (${B.id})`);
  console.log('   ─────────────────────────────────────────────────────\n');

  // ── 1. A hanya melihat barisnya sendiri di `profiles` ───────────────────
  const aProfiles = await call('/rest/v1/profiles?select=id,username', { token: A.token });
  const aRows = Array.isArray(aProfiles.body) ? aProfiles.body : [];
  const aSeesOnlySelf = aRows.length > 0 && aRows.every((r) => r.id === A.id);
  check(
    'A hanya melihat profilnya sendiri (bukan seluruh akun)',
    aSeesOnlySelf,
    `terlihat ${aRows.length} baris: ${aRows.map((r) => r.username).join(', ') || '-'}`
  );

  // ── 2. A tidak bisa membaca baris B walaupun tahu UUID-nya ──────────────
  const aReadsB = await call(`/rest/v1/profiles?select=id,username&id=eq.${B.id}`, { token: A.token });
  const aReadsBRows = Array.isArray(aReadsB.body) ? aReadsB.body : [];
  check(
    'A TIDAK bisa membaca profil B (walau tahu UUID B)',
    aReadsBRows.length === 0,
    `hasil: ${aReadsBRows.length} baris`
  );

  // ── 3. B tidak bisa membaca baris A ────────────────────────────────────
  const bReadsA = await call(`/rest/v1/profiles?select=id,username&id=eq.${A.id}`, { token: B.token });
  const bReadsARows = Array.isArray(bReadsA.body) ? bReadsA.body : [];
  check(
    'B TIDAK bisa membaca profil A',
    bReadsARows.length === 0,
    `hasil: ${bReadsARows.length} baris`
  );

  // ── 4. A tidak bisa membaca nilai milik B ──────────────────────────────
  const aSubs = await call(
    `/rest/v1/level_submissions?select=id,student_id&student_id=eq.${B.id}`,
    { token: A.token }
  );
  const aSubRows = Array.isArray(aSubs.body) ? aSubs.body : [];
  check(
    'A TIDAK bisa membaca nilai milik B',
    aSubRows.length === 0,
    `hasil: ${aSubRows.length} baris`
  );

  // ── 5. Tabel kredensial tertutup untuk anon ────────────────────────────
  const anonUsers = await call('/rest/v1/user_accounts?select=*&limit=1');
  const anonLeaked = Array.isArray(anonUsers.body) && anonUsers.body.length > 0;
  check(
    'anon TIDAK bisa membaca tabel user_accounts (hash password)',
    !anonLeaked,
    `HTTP ${anonUsers.status}`
  );

  // ── 6. anon hanya bisa memanggil fungsi publik yang disengaja ───────────
  const anonAdmin = await call('/rest/v1/rpc/admin_set_unlocked_level', {
    method: 'POST',
    body: { p_username: A.username, p_level: 3 },
  });
  check(
    'anon TIDAK bisa memanggil fungsi admin',
    anonAdmin.status >= 400,
    `HTTP ${anonAdmin.status}`
  );

  // ── 7. Siswa tidak bisa menaikkan levelnya sendiri lewat UPDATE ────────
  const selfPromote = await call(`/rest/v1/profiles?id=eq.${A.id}`, {
    method: 'PATCH',
    token: A.token,
    body: { unlocked_level: 3 },
    headers: { Prefer: 'return=representation' },
  });
  const afterPromote = await call(`/rest/v1/profiles?select=unlocked_level&id=eq.${A.id}`, {
    token: A.token,
  });
  const lvl = Array.isArray(afterPromote.body) ? afterPromote.body[0]?.unlocked_level : undefined;
  check(
    'A TIDAK bisa menaikkan unlocked_level sendiri (dikunci trigger)',
    lvl !== 3,
    `PATCH HTTP ${selfPromote.status}, unlocked_level sekarang = ${lvl}`
  );

  // ── 8. Siswa tidak bisa mengangkat diri jadi admin ─────────────────────
  const selfAdmin = await call(`/rest/v1/profiles?id=eq.${A.id}`, {
    method: 'PATCH',
    token: A.token,
    body: { is_admin: true, role: 'admin' },
    headers: { Prefer: 'return=representation' },
  });
  const afterAdmin = await call(`/rest/v1/profiles?select=is_admin,role&id=eq.${A.id}`, {
    token: A.token,
  });
  const row = Array.isArray(afterAdmin.body) ? afterAdmin.body[0] : {};
  check(
    'A TIDAK bisa mengangkat diri jadi admin',
    row?.is_admin !== true && row?.role !== 'admin',
    `PATCH HTTP ${selfAdmin.status}, is_admin=${row?.is_admin}, role=${row?.role}`
  );

  // ── 9. Menaikkan level lewat RPC resmi justru HARUS bekerja ────────────
  const legit = await call('/rest/v1/rpc/submit_level_result', {
    method: 'POST',
    token: A.token,
    body: { p_level: 1, p_missions: 8, p_details: { is_completed: true }, p_is_completed: true, p_client_score: 100 },
  });
  const legitScore = legit.body?.score ?? legit.body?.[0]?.score;
  check(
    'Jalur resmi (submit_level_result) BEKERJA untuk A',
    legit.status < 400,
    `HTTP ${legit.status}, score server = ${legitScore}`
  );

  // ── 10. Pemalsuan nilai dibatasi server ───────────────────────────────
  const spoof = await call('/rest/v1/rpc/submit_level_result', {
    method: 'POST',
    token: A.token,
    body: { p_level: 3, p_missions: 0, p_details: { is_completed: true }, p_is_completed: true, p_client_score: 100 },
  });
  const spoofScore = spoof.body?.score ?? spoof.body?.[0]?.score;
  check(
    'Klaim "selesai" tanpa capaian TIDAK diberi nilai 100',
    spoofScore !== 100,
    `HTTP ${spoof.status}, score server = ${spoofScore}`
  );

  // ── Ringkasan ──────────────────────────────────────────────────────────
  const passed = results.filter((r) => r.passed).length;
  const total = results.length;
  console.log('\n   ─────────────────────────────────────────────────────');
  console.log(`   HASIL: ${passed}/${total} pemeriksaan lolos`);

  if (passed === total) {
    console.log('   🎉 Isolasi data & kontrol otorisasi TERBUKTI bekerja.\n');
  } else {
    console.log('   ⚠️  Ada pemeriksaan yang gagal — periksa migrasi & policy RLS.\n');
    console.log('   Petunjuk: jalankan supabase/verify_security.sql untuk diagnosis.\n');
  }

  if (CLEANUP) {
    console.log('   ℹ️  --cleanup: hapus akun uji lewat SQL Editor (butuh service key):');
    console.log(`      DELETE FROM auth.users WHERE id IN ('${A.id}','${B.id}');\n`);
  }

  process.exit(passed === total ? 0 : 1);
}

main().catch((err) => {
  console.error('\n❌ Uji gagal dijalankan:', err?.message || err);
  process.exit(1);
});
