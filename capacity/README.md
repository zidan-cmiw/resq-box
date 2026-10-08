# RESQ-BOX — Model Kapasitas & Uji Beban

> Dokumen ini **tidak mengubah satu baris pun** kode aplikasi. Semua angka di sini
> berasal dari pembacaan berkas nyata (disebut sebagai `file:line`) atau dari
> pengukuran byte yang dijalankan langsung terhadap `RESQ-BOX\public\` dan
> `RESQ-BOX\dist\`. Angka yang **tidak bisa** diverifikasi ditandai eksplisit
> dengan `[PERLU VERIFIKASI]` beserta cara memverifikasinya.

Berkas dalam folder ini:

| Berkas | Isi |
|---|---|
| `README.md` | model kapasitas berparameter + tabel skenario + urutan titik jebol + mitigasi |
| `assets.md` | strategi aset & bandwidth (angka byte terukur, rencana cache, egress) |
| `loadtest.js` | uji beban Node.js (tanpa dependensi baru, HTTP saja, aman secara default) |
| `_measure_assets.py`, `_measure_avif.py`, `_measure_transfer.py`, `_measure_stl.py`, `_measure_icons.py` | skrip pengukuran read-only yang dipakai untuk membuktikan setiap angka byte di `assets.md`. Jalankan dengan `python <skrip>` dari folder ini. Tidak menulis apa pun ke `public/`. |
| `_measure_assets.json` | hasil mentah pengukuran WebP/AVIF |
| `_selftest-report.json` | contoh keluaran JSON `loadtest.js`, dihasilkan dari self-test offline (URL `http://127.0.0.1:59999`, tanpa trafik eksternal) — bukti bahwa jalur pelaporan berfungsi |

---

## 0. Ringkasan eksekutif (baca ini dulu)

> ✅ **STATUS: rekomendasi di dokumen ini SUDAH DITERAPKAN** (diperbarui setelah
> penerapan). Seluruh angka di §1–§6 adalah **audit baseline** dan tetap sah
> sebagai titik awal; kolom "Status" di bawah menunjukkan apa yang sudah berubah.
>
> | Rekomendasi | Status |
> |---|---|
> | Hapus aset mati (`frames/` 3,53 MB, `peta_lapisan_bumi.jpg`, `radar_bumi_lengkap*`, 2 duplikat gambar) | ✅ diterapkan — `public/` 10,23 → 4,69 MB |
> | Konversi latar ke WebP | ✅ diterapkan — 1,46 MB → 224 KB (−85%) |
> | Precache selektif level berat + runtime cache | ✅ diterapkan — precache **4.760 → 2.287 KiB (−52%)** |
> | `webp` masuk `globPatterns` supaya janji luring PRD terpenuhi | ✅ diterapkan |
> | Kompresi gzip untuk `terrain-688.stl` | ✅ diterapkan — unduhan level 3: **3,17 MB → 0,97 MB (−69%)** |
> | `Cache-Control` di `vercel.json` (aset immutable) | ✅ diterapkan — kunjungan ulang ~5,8 MB → ~0 |
> | Ikon PWA yang hilang (`pwa-192/512`) | ✅ dibuat — install PWA tidak lagi 404 |
> | Koalesensi tulis klien (jendela 5 detik) | ✅ diterapkan |
> | `unlockLevel` tidak lagi menulis berulang | ✅ diterapkan (write amplification dihapus) |
> | **`ON CONFLICT (student_id, level_number)`** + indeks komposit | ✅ diterapkan di `supabase/migrations/` — **ini yang menghentikan pertumbuhan DB tanpa batas** |
> | Supabase Auth + RLS ketat | ✅ diterapkan (lihat `supabase/README.md`) |
> | Read replica / partisi / antrean (tier ≥100.000) | ⏳ belum — baru perlu di skala itu |

1. **(BASELINE, kini jauh lebih baik) Titik jebol pertama bukan database, tapi
   bandwidth aset.** Saat audit, satu sesi dingin memindahkan **7.52 MiB terukur**
   (precache PWA 1.68 MiB *di kabel* + `terrain-688.stl` 3.02 MB mentah + gambar
   2.82 MB), dan **setiap sesi hangat** masih memindahkan **5.84 MiB** karena STL +
   JPG tidak di-precache dan tidak punya `Cache-Control` eksplisit. Free plan
   Supabase memberi 5 GB egress; itu habis dalam **~634 sesi dingin** atau
   **~817 sesi hangat** ([supabase.com/pricing](https://supabase.com/pricing.md),
   rincian di `assets.md`).
   → **Setelah perbaikan:** precache 2.29 MiB *mentah* (lebih kecil lagi di kabel),
   STL 0,97 MB terkompresi, semua aset ber-`Cache-Control`, dan kunjungan ulang
   nyaris 0 byte. Titik jebol ini tertunda beberapa kali lipat.
2. **(BASELINE, kini tertutup) Titik jebol kedua: ukuran DB.** `rpc_insert_submission`
   lama adalah `INSERT` murni tanpa `ON CONFLICT` (`supabase_schema.sql:369-385`),
   sedangkan klien memanggilnya pada **setiap** penyelesaian misi/gate. Jadi
   `level_submissions` tumbuh ~46 baris per pemain per sesi dan **tidak pernah**
   di-`UPDATE`. Free plan = 500 MB.
   → **Setelah perbaikan:** RPC baru menyimpan **satu baris per (siswa, level)**,
   ditambah indeks unik `(student_id, level_number)` dan koalesensi tulis 5 detik.
   Pertumbuhan per pemain turun dari ~46 baris/sesi menjadi **3 baris (satu per level)**.
3. **(BASELINE) Titik jebol ketiga: Realtime concurrent connections.** Batasnya
   200 (Free) / 500 (Pro) / 10.000 (Pro tanpa spend cap, Team)
   ([docs Realtime limits](https://supabase.com/docs/guides/realtime/limits)).
   Dashboard guru membuka 1 koneksi Realtime per guru (`supabaseClient.ts:1104-1121`).
   → Langganan sekarang dibuat **idempoten** (memanggil ulang menutup channel lama)
   sehingga tidak menumpuk; batas per-tier tetap perlu diperhatikan di skala besar.
4. **Autosave tidak menulis ke jaringan.** `gameEngine.ts:720-723`
   ("every 45 frames") dan `TectonicGame.tsx:358-366` (setiap 4 detik) menulis ke
   **`localStorage`**, bukan Supabase — lihat `saveEarthDiveProgress` di
   `src/app/Level1/EarthDive/engine/gameEngine.ts:110-161` dan `saveLevel2Progress`
   di `src/app/Level2/engine/gameEngine.ts:313-331`, keduanya hanya `localStorage.setItem`.
   Ini kabar baik: tidak ada write amplification per frame. Yang berbahaya adalah
   **frekuensi write event-driven** (butir 2), bukan frame rate.
5. **(SUDAH USAI) Supabase Auth kini dipakai.** Saat audit, `supabase.auth`,
   `signInWithPassword`, dan `auth/v1` tidak muncul sama sekali di `src/`. Sekarang
   `supabaseClient.ts` memakai Supabase Auth (email sintetis `<username>@resqbox.local`)
   dan seluruh RPC baru diverifikasi server. Lihat `supabase/README.md`.

---

## 1. Fakta terverifikasi dari kode

### 1.1 Seluruh panggilan jaringan di `src/utils/supabaseClient.ts` (1132 baris)

| # | Baris | Operasi | Endpoint PostgREST/RPC | Dipanggil dari (trigger nyata) | Frekuensi |
|---|---|---|---|---|---|
| 1 | `:297` | `rpc` | `verify_login` | `Login/index.tsx` (submit form) | 1×/sesi/pemain |
| 2 | `:447` | `rpc` | `register_student_account` | `Login/index.tsx` (daftar) | 1× sekali seumur akun |
| 3 | `:511` | `rpc` | `register_teacher_account` | `Login/index.tsx` | 1× sekali seumur akun |
| 4 | `:559` | `rpc` | `rpc_create_classroom` | `TeacherDashboard` (buat kelas) | jarang |
| 5 | `:609` | `rpc` | `rpc_update_classroom_name` | `TeacherDashboard` (rename kelas) | jarang |
| 6 | `:647` | `rpc` | `rpc_update_teacher_profile` | `teacherStore.ts:382` (simpan profil guru) | jarang |
| 7 | `:697` | `rpc` | `rpc_delete_classroom` | `TeacherDashboard` | jarang (destruktif) |
| 8 | `:771` | `rpc` | `create_student_by_teacher` | `TeacherDashboard` | jarang |
| 9 | `:817` | `rpc` | `rpc_delete_student` | `TeacherDashboard` | jarang (destruktif) |
| 10 | `:860` | `rpc` | `rpc_upsert_student` | `syncStudentToCloud` ← `teacherStore.ts:362` (`updateProfile`) & `teacherStore.ts:410` (`unlockLevel`) | **1× per unlock level & per simpan profil** |
| 11 | `:906` | `rpc` | `rpc_insert_submission` | `submitLevelProgress` ← `earthDiveSync.ts:146`, `level2Sync.ts:51`, `level3Sync.ts:114`, `CoreChallengeModal.tsx:35`, `Wordle/index.tsx:158`, `PuzzleBoard.tsx:101` | **paling sering** — lihat §1.2 |
| 12 | `:935-939` | `select` | `students` (`eq classroom_code`, `order absent_number`) | `TeacherDashboard/index.tsx:99` **saja** | 1× per pemilihan kelas |
| 13 | `:960-964` | `select` | `level_submissions` (`eq classroom_code`, `order completed_at desc`) | `TeacherDashboard/index.tsx:100` **saja** | 1× per pemilihan kelas |
| 14 | `:1105-1121` | Realtime | channel `classroom-<kode>`, 2 binding `postgres_changes` (`students` event `*`, `level_submissions` event `INSERT`) | `TeacherDashboard/index.tsx:109` | 1 koneksi WS tahan lama per guru |
| 15 | `Profile/index.tsx:91-92` | `update` | `user_accounts`, `students` (ganti PIN) | `Profile` | jarang — **tetapi ditolak RLS**, lihat §1.4 |

Tambahan di luar `supabaseClient.ts`: **tidak ada**. Grep untuk `supabase.storage`,
`storage.from`, `.upload(`, `getPublicUrl` di seluruh `src/` → **0 hasil**. Aplikasi
belum memakai Supabase Storage sama sekali.

### 1.2 Berapa write per pemain per sesi (diturunkan dari call-site nyata)

`submitLevelProgress` → `rpc_insert_submission` dipanggil pada tiap peristiwa berikut:

| Level | Call-site | Jumlah trigger per sesi | Bukti |
|---|---|---|---|
| L1 | 8 gate strata | 8 | `earthDiveSync.ts:20-29` mendefinisikan 8 lapisan; `EarthDiveGame.tsx:929` (cabang non-final) & `:919` (final) |
| L1 | CoreChallengeModal | 1 | `EarthDiveGame.tsx:1859` |
| L1 | Wordle selesai | 1 | `Wordle/index.tsx:158` |
| L1 | mini-challenge lain | ± 5–15 (bisa berulang) | `EarthDiveGame.tsx:950` (cabang `else`) |
| L2 | 8 call-site `syncLevel2Progress` | ± 8 | `TectonicGame.tsx:632, 681, 693, 705, 724, 744, 777, 799` |
| L2 | FinalQuest + PuzzleBoard | 2 | `FinalQuestModal.tsx:57`, `PuzzleBoard.tsx:101` |
| L3 | **tiap misi selesai** | **20** | `missionStore.ts:159-167`; `MISSIONS` = 20 item (dibuktikan: `missions.ts:56` deklarasi, isinya `job_01`…`job_20`, terhitung tepat 20) |
| L3 | sync pasif saat mount | 1 | `Level3/index.tsx:98` |
| semua | `rpc_upsert_student` saat `unlockLevel` | 3 (+ amplifikasi) | `teacherStore.ts:410`; **amplifikasi**: `level2Sync.ts:47` memanggil `unlockLevel(3)` pada setiap sync yang `isDone`, dan `unlockLevel` **tidak** menjaga "sudah pernah unlock?" → 1 upsert tambahan tiap kali |

**Kesimpulan: `D_writes ≈ 30 (rendah) / 46 (tipikal) / 70 (tinggi)` request write per
pemain per sesi penuh 3 level.** Ini estimasi dari jumlah call-site × perkiraan
trigger; jumlah trigger mini-challenge L1 (`EarthDiveGame.tsx:950`) adalah bagian
yang paling tidak pasti dan **tidak bisa** saya ukur tanpa menjalankan aplikasinya.

### 1.3 Autosave: dikonfirmasi, tapi bukan beban jaringan

| Berkas | Baris | Kadens | Tujuan | Dampak jaringan |
|---|---|---|---|---|
| `src/app/Level1/EarthDive/engine/gameEngine.ts` | `:720-723` (komentar), `:722` (`state.frame % 45 === 0 \|\| justStopped`) | tiap 45 frame ≈ 0.75 s saat bergerak | `saveEarthDiveProgress` → `localStorage.setItem` (`:156`) | **0** |
| `src/app/Level2/engine/TectonicGame.tsx` | `:358-366` (`setInterval(..., 4000)`) | tiap 4 detik | `saveLevel2Progress` → `localStorage.setItem` (`gameEngine.ts:329`) | **0** |

Perhatikan `TectonicGame.tsx:340-348`: `visibilitychange`/`beforeunload`/`pagehide`
juga hanya memanggil `saveLevel2Progress` (lokal). **Tidak ada** jalur autosave →
Supabase. Jadi `R` (request/menit) **tidak** dipengaruhi frame rate sama sekali.
Yang perlu dijaga: jangan sampai ada yang "memperbaiki" ini dengan menambahkan
mirror ke Supabase tanpa debounce.

### 1.4 Temuan tambahan yang membatasi kapasitas

1. **`rpc_insert_submission` kemungkinan gagal diam-diam hari ini.**
   Klien membuat `id: 'sub-<timestamp>-<rand>'` (`supabaseClient.ts:882`) — **bukan UUID** —
   sementara RPC melakukan `COALESCE((p_data->>'id')::UUID, gen_random_uuid())`
   (`supabase_schema.sql:375`). Cast itu akan melempar
   `invalid input syntax for type uuid`. Pemanggilnya mengabaikan `error`
   (`supabaseClient.ts:906` hanya `await supabase.rpc(...)` tanpa cek `{ error }`),
   sehingga kegagalan tidak terlihat. `[PERLU VERIFIKASI]` — buktikan dengan
   `select count(*) from level_submissions;` sebelum & sesudah satu sesi nyata,
   atau lihat Postgres logs. Efek sampingnya: tabel mungkin **lebih kecil** dari
   perkiraan model ini, dan Dashboard Guru tetap terisi karena
   `fetchClassroomSubmissions` **mensintesis** baris dari `localStorage`
   (`supabaseClient.ts:982-1082`) ketika hasil query kosong (`:972`). Ini persis
   "reads and synthesises data" yang disebut di brief.
2. **`rpc_insert_submission` INSERT-only, tanpa upsert.** `supabase_schema.sql:369-385`.
   Satu baris per write event, selamanya. Ini akar dari §0 butir 2.
3. **`fetchClassroomSubmissions` mengambil `select('*')` tanpa `limit`/paginasi**
   (`supabaseClient.ts:960-964`) dan mengurutkan `completed_at desc`. Payload per
   pembacaan tumbuh linier terhadap akumulasi aktivitas kelas, selamanya.
4. **RLS memblokir update langsung dari klien.** `Profile/index.tsx:91-92` menulis ke
   `user_accounts` & `students` dari browser dengan anon key, tetapi policy yang ada
   hanya `FOR SELECT` (`supabase_schema.sql:107-120`). Update itu tidak akan
   mengubah baris apa pun. Bukan masalah kapasitas, tapi mengubah asumsi "write"
   pada model auth baru.
5. **Indeks yang ada:** `idx_users_username`, `idx_students_classroom`,
   `idx_submissions_classroom`, `idx_submissions_student`
   (`supabase_schema.sql:65-68`). **Belum ada** indeks komposit untuk pola query
   sebenarnya: `students (classroom_code, absent_number)` dan
   `level_submissions (classroom_code, completed_at DESC)`.
6. **`PWABadge.tsx:5`** memasang `setInterval` cek update SW **tiap 1 jam**, tetapi
   komponen ini **tidak pernah di-mount** (tidak ada `import PWABadge` di `App.tsx`,
   `main.tsx`, maupun `AppLayout.tsx`). Jadi kontribusinya **0 request** hari ini.
   Kalau nanti di-mount, ini menambah `R_pwa = 1/60` request per menit.

### 1.5 Target proyek sendiri (PRD)

| Target | Nilai | Sumber |
|---|---|---|
| Ukuran bundle initial | < 5 MB, lazy load Level 2 & 3 | `PRD.md:256` |
| Offline | PWA full offline setelah load pertama | `PRD.md:253` |
| Engagement time | rata-rata ≥ 45 menit per sesi | `PRD.md:352` |
| FPS | ≥ 30 fps di perangkat sekolah | `PRD.md:251` |
| Persistence | LocalStorage untuk progres | `PRD.md:257` |

`S = 45 menit` (PRD.md:352) dipakai sebagai panjang sesi di model ini.
Precache PWA terukur **4.65 MiB di disk** dan **1.68 MiB di kabel** (gzip) dari
`dist/sw.js`, 33 entri — jadi atribut "raw" sudah 93% dari batas "< 5 MB" PRD, padahal
itu baru service worker. Perhatikan: **untuk egress yang berlaku adalah angka kabel
1.68 MiB**, bukan 4.65 MiB, karena host sudah meng-gzip JS/CSS (−64%). Sisa beban
precache yang mahal justru PNG yang tidak dikompresi — dan dua di antaranya aset mati
(`assets.md` §2). Seluruh angka bandwidth di dokumen ini memakai basis **wire/kabel**.

---

## 2. Parameter input

Model ini **tidak** dipatok pada satu angka. Semua besaran turunan ditulis sebagai
fungsi dari parameter berikut.

| Simbol | Arti | Satuan | Default di model ini | Asal |
|---|---|---|---|---|
| `E` | estimasi pemain **nyata simultan** (manusia, sesi terbuka) | pemain | 10 / 30 / 100 / 300 / 1000 (skenario) | brief owner |
| `M_lo`, `M_hi` | multiplier kesiapan | × | **10** dan **1000** | brief owner |
| `U_req` | target concurrent user yang harus dilayani = `E × M` | sesi | turunan | rumus §3.1 |
| `C` | *concurrent-active fraction*: porsi sesi yang **sedang** mengirim request pada satu detik tertentu | – | **0.25** | estimasi; gameplay mayoritas lokal (canvas) |
| `R` | request jaringan per pemain per menit (total, semua endpoint) | req/min | **2.0** | turunan §1.2 (hari ini ≈ 1.5) |
| `R_w` | request **write** per pemain per menit | req/min | **1.0** | `D_writes/S ≈ 46/45` |
| `P` | *peak-to-average ratio* request | × | **3.0** | estimasi (awal pelajaran/jeda) |
| `P_auth` | faktor burst khusus login | × | **10** | estimasi (satu kelas login serentak) |
| `D_writes` | write progress per pemain per sesi | baris | **46** (30–70) | turunan §1.2 |
| `S` | panjang sesi | menit | **45** | `PRD.md:352` |
| `b_row` | byte per baris `level_submissions` (termasuk JSONB `details`) | byte | **1200** | estimasi; `[PERLU VERIFIKASI]` §6 |
| `A_cold` | byte aset per pemain, kunjungan pertama (**di kabel**) | byte | **7 885 665** | terukur `assets.md` §4.1 |
| `A_warm` | byte aset per pemain, kunjungan ulang hari ini (**di kabel**) | byte | **6 119 186** | terukur (STL + gambar tidak di-precache, tanpa cache header) |
| `f_t` | rasio guru terhadap total pengguna | – | **1/31** | estimasi (1 guru : 30 siswa) |
| `Sess_mo` | sesi per bulan | sesi | per skenario | turunan |
| `L_ws` | koneksi Realtime per guru | koneksi | **1** | `supabaseClient.ts:1104` |
| `t_q` | durasi query rata-rata di DB | detik | **0.01** | estimasi |
| `k_safe` | faktor keamanan pool koneksi | × | **1.5** | praktik umum |

---

## 3. Rumus

### 3.1 Concurrent user & laju request

```
U_req        = E × M                       ; M ∈ [M_lo, M_hi] = [10, 1000]
λ            = U_req × C × R / 60          ; req/s  (rata-rata)
λ_peak       = λ × P                        ; req/s  (puncak)
λ_auth_peak  = U_req × C × P_auth / 60      ; req/s  (khusus login, durasi pendek)
λ_w          = U_req × C × R_w / 60         ; write/s
```

### 3.2 Kebutuhan koneksi

Klien browser **tidak** membuka koneksi Postgres. `@supabase/supabase-js` memakai
anon key lewat **HTTPS ke PostgREST/Auth/Realtime**, jadi yang perlu dihitung
adalah koneksi **sisi server** (PostgREST/Auth/Realtime → Postgres) plus koneksi
Realtime (WebSocket) per klien:

```
Conn_realtime = U_req × f_t × L_ws                     ; koneksi WS aktif
Conn_pool     = λ_peak × t_q × k_safe                  ; Little's Law: L = λ × W
Conn_total    = Conn_pool(PgREST) + Conn_pool(Auth) + Conn_realtime_bin
                + Conn_storage + Conn_reserved
                <  MaxConnections(compute_size)
```

`Conn_realtime` adalah batas **platform terpisah** (bukan Postgres):
lihat §5. `Conn_pool` adalah alasan memakai **Supavisor/PgBouncer transaction mode**
— tetapi hanya untuk komponen **server-side** (Edge Function, worker antrean).
Browser tidak bisa dan tidak boleh memakai pooler (lihat §7.2).

### 3.3 Bandwidth (egress)

```
Egress_app_per_session = A_cold × cold_frac + A_warm × (1 - cold_frac)
Egress_api_per_session = Q_teacher × b_read        ; b_read = baris × b_row
Egress_total(1000 sesi) = 1000 × (Egress_app + Egress_api)
Egress_month            = Sess_mo × (Egress_app + Egress_api) + Egress_auth_realtime
```

dengan `Q_teacher` = jumlah pembacaan tabel oleh guru per sesi, dan
`b_read = rows_in_class × b_row` — **inilah yang tumbuh tanpa batas** karena §1.4 butir 2 & 3.

### 3.4 Pertumbuhan storage

```
ΔStorage_month = Sess_mo × D_writes × b_row × k_index
```
`k_index` = overhead indeks, default **1.25**. Karena tabelnya INSERT-only,
`ΔStorage_month` **tidak pernah** turun dan tidak ada jalur pemadatan selain
`VACUUM`/partisi/retensi.

### 3.5 Realtime (fan-out)

```
Msg_s = λ_w_per_class × n_subscriber            ; pesan/detik
Join_s = U_req × f_t / S / 60                   ; channel join/detik (guru buka dashboard)
```
Setiap write ke `students`/`level_submissions` menghasilkan 1 pesan
`postgres_changes` ke **setiap** subscriber kelas itu
(`supabaseClient.ts:1107-1120`), dan kedua tabel berada di publication
`supabase_realtime` (`supabase_schema.sql:78-83`).

---

## 4. Tabel skenario

Konstanta: `C = 0.25`, `R = 2.0`, `R_w = 1.0`, `P = 3`, `S = 45`, `b_row = 1200 B`,
`f_t = 1/31`. Maka `λ = U_req / 120` req/s dan `λ_w = U_req / 240` write/s.

### 4.1 Rentang `M·E` dan laju request

| `E` (pemain nyata) | `U_req` @ M=10 | `U_req` @ M=100 | `U_req` @ M=1000 | `λ` @ M=10 (req/s) | `λ` @ M=100 | `λ` @ M=1000 | `λ_peak` @ M=1000 (P=3) | `λ_w` @ M=1000 |
|---|---|---|---|---|---|---|---|---|
| **10** | 100 | 1 000 | 10 000 | 0.83 | 8.3 | 83.3 | 250 | 41.7 |
| **30** | 300 | 3 000 | 30 000 | 2.5 | 25.0 | 250 | 750 | 125 |
| **100** | 1 000 | 10 000 | 100 000 | 8.3 | 83.3 | 833 | 2 500 | 417 |
| **300** | 3 000 | 30 000 | 300 000 | 25.0 | 250 | 2 500 | 7 500 | 1 250 |
| **1000** | 10 000 | 100 000 | **1 000 000** | 83.3 | 833 | 8 333 | 25 000 | 4 167 |

Rentang keseluruhan `M·E` = **100 … 10 000 … 1 000 000** (persis seperti diminta).

### 4.2 Yang jebol lebih dulu per tier

| Tier `U_req` | Realtime conn dibutuhkan (`f_t=1/31`) | Egress aset / 1000 sesi (hari ini, di kabel) | Storage / bulan (asumsi 4 sesi/pemain/bulan) | Jebol pertama |
|---|---|---|---|---|
| 100 | 4 | 7.89 GB dingin / 6.12 GB hangat | 300 pemain → 1 200 sesi → ~65 MB | **Egress Free 5 GB** |
| 1 000 | 33 | 7.89 GB / 6.12 GB | 3 000 pemain → 12 000 sesi → ~647 MB | **DB Free 500 MB** + egress |
| 10 000 | 323 | 7.89 GB / 6.12 GB | 30 000 pemain → 120 000 sesi → 6.5 GB | **Realtime Free 200 / Pro 500** + egress Pro 250 GB |
| 100 000 | 3 226 | 7.89 GB / 6.12 GB → 789 GB | 300 000 pemain → 1.2 M sesi → 65 GB | **Egress Pro 250 GB**, lalu DB |
| 1 000 000 | 32 258 | 7.89 GB / 6.12 GB → 7.89 TB | 3 M pemain → 12 M sesi → 647 GB | **Realtime 10 000 (plafon Pro/Team)**, **egress TB**, **write 4 167/s** |

Cara membaca: **`E=1000` pada `M=10` (U=10 000) sudah menembus batas Realtime Free
dan Pro.** Jadi multiplier `M=1000` bukan latihan teoretis: `E=30, M=1000` (U=30 000)
sudah butuh ~968 koneksi Realtime — 2× batas Pro.

---

## 5. Limit platform yang menghadang (angka terverifikasi)

Semua limit di bawah diambil dari dokumentasi resmi Supabase pada saat penulisan.
**Verifikasi ulang terhadap dokumen terkini sebelum mengunci anggaran** — angka
ini bisa berubah.

| Limit | Nilai terverifikasi | Sumber |
|---|---|---|
| Realtime concurrent connections | Free **200** / Pro **500** / Pro tanpa spend cap **10 000** / Team **10 000** / Enterprise 10 000+ | [Realtime limits](https://supabase.com/docs/guides/realtime/limits) |
| Realtime messages/detik | Free **100** / Pro **500** / Pro tanpa spend cap **2 500** | idem |
| Realtime channel joins/detik | Free **100** / Pro **500** / Pro tanpa spend cap **2 500** | idem |
| Realtime channels per connection | **100** | idem |
| Postgres change payload | **1 024 KB** | idem |
| Realtime included per bulan | Free **200** conn + **2 Juta** pesan; Pro **500** conn + **5 Juta** pesan, lalu **$2.50/Juta**; conn ekstra **$10 / 1000** | [Pricing](https://supabase.com/pricing.md) |
| DB size | Free **500 MB**; Pro **8 GB** disk termasuk, lalu **$0.125/GB** | idem |
| Max DB size rekomendasi per compute | Nano 500 MB, Micro 10 GB, Small 50 GB, Medium 100 GB, Large 200 GB, XL 500 GB | [Compute and Disk](https://supabase.com/docs/guides/platform/compute-and-disk) |
| Egress | Free **5 GB** (+5 GB cached); Pro **250 GB** lalu **$0.09/GB** (+250 GB cached lalu $0.03/GB) | [Pricing](https://supabase.com/pricing.md) |
| File storage | Free **1 GB**; Pro **100 GB** lalu $0.0213/GB | idem |
| Auth MAU | Free **50 000**; Pro **100 000** lalu **$0.00325/MAU** | idem |
| Postgres `max_connections` per compute | Nano **60**, Micro **60**, Small **90**, Medium **120**, Large **160**, XL **240**, 2XL **380** | [Compute and Disk](https://supabase.com/docs/guides/platform/compute-and-disk) |
| Connection Pooler max clients | Nano/Micro **200**, Small **400**, Medium **600**, Large **800**, XL **1 000** | idem |
| Free project pausing | **dijeda setelah 1 minggu tanpa aktivitas**; batas 2 proyek aktif | [Pricing](https://supabase.com/pricing.md) |
| Pooler | Supavisor (shared, semua proyek, IPv4-only) & PgBouncer (dedicated, plan berbayar). `Direct + Supavisor backend + PgBouncer backend < Postgres max_connections`, dan **Auth/Storage/PostgREST/health-checker memakai jatah yang sama** | [Pooling and limits](https://supabase.com/docs/guides/database/connecting-to-postgres/pooling-and-limits) |

### 5.1 Urutan "jebol lebih dulu" (definitif)

1. **Egress bandwidth — 5 GB (Free) / 250 GB (Pro).** Dihabiskan **aset**, bukan API.
   `A_cold = 7.52 MiB`, `A_warm = 5.84 MiB` (di kabel) → Free habis di **~634 sesi
   dingin** atau **~817 sesi hangat**; Pro habis di **~40 850 sesi hangat**
   (≈ 1 360 pemain × 30 hari) atau **~31 700 sesi dingin**. Naik sebagai `O(sesi)`
   dan tidak bisa dikompensasi oleh indeks, pooling, atau naik compute.
2. **Ukuran DB — 500 MB (Free) / 8 GB disk (Pro).** Tumbuh `D_writes × b_row`
   per sesi, monoton, tanpa `UPDATE`. 300 siswa × 4 sesi/bulan ≈ **65 MB/bulan**;
   3 000 siswa ≈ **647 MB/bulan** (Free jebol < 1 bulan).
3. **Realtime concurrent connections — 200 / 500 / 10 000.** `U_req/31` koneksi.
   Free jebol di `U_req ≈ 6 200`; Pro di `U_req ≈ 15 500`; plafon 10 000 jebol di
   `U_req ≈ 310 000`.
4. **Koneksi Postgres & compute (60 koneksi di Nano/Micro).** PostgREST, Auth,
   Storage, dan Realtime berbagi `max_connections` yang sama. `[PERLU VERIFIKASI]`:
   berapa pool PostgREST di proyek ini — cek `Database → Settings → Pool size` dan
   Observability → *Database Connections*.
5. **Latensi baca Dashboard Guru (`select('*')` tanpa limit).** Bukan limit platform,
   tapi tumbuh linier: 32 siswa × 46 write = **1 472 baris baru per kelas per sesi**;
   setelah 10 sesi, satu pembacaan dashboard ≈ **17.7 MB** (`1 472 × 10 × 1.2 KB`),
   dan itu memakan meteran egress yang sama dengan butir 1.
6. **MAU Auth.** Pro: 100 000 termasuk. `U_req = 1 000 000` menyiratkan MAU ≥ 10⁶ →
   ~**$2 925/bulan** hanya MAU (`(1e6 − 1e5) × $0.00325`). `[PERLU VERIFIKASI]` biaya
   terkini.
7. **Free project pausing setelah 1 minggu idle.** Untuk aplikasi sekolah yang
   dipakai mingguan, ini risiko operasional nyata yang sering terlewat.

---

## 6. Yang tidak bisa saya verifikasi

Disebut eksplisit agar tidak dianggap fakta:

| Klaim | Status | Cara verifikasi |
|---|---|---|
| `rpc_insert_submission` benar-benar gagal karena cast UUID | **dugaan kuat**, belum diuji terhadap layanan hidup | jalankan 1 sesi nyata, bandingkan `count(*)` sebelum/sesudah, atau baca Postgres logs |
| `b_row = 1200 byte` per baris `level_submissions` | **estimasi** dari ukuran JSONB `details` yang saya baca di kode | `select pg_total_relation_size('level_submissions'), avg(pg_column_size(details)) from level_submissions;` |
| Jumlah trigger mini-challenge L1 (5–15) | **estimasi**, tidak ada konstanta di kode | instrumentasi `submitLevelProgress` di staging |
| `t_q = 0.01 s` (durasi query) | **estimasi** | `pg_stat_statements` di staging |
| Pool size PostgREST aktual | **tidak diketahui** | Supabase Dashboard → Database Settings / Observability |
| Header cache default host (Vercel) | **tidak terverifikasi** — halaman [Cache-Control headers Vercel](https://vercel.com/docs/caching/cache-control-headers) tidak merender isinya saat saya akses | `curl -I https://<domain>/terrain-688.stl` dan `/assets/<hash>.js`, lalu baca `cache-control` |
| `cacheControl` pada Supabase Storage | **terverifikasi sebagian** — dokumen Smart CDN menyatakan `cacheControl` diatur **saat upload** dan default TTL "typically 1 hour"; Smart CDN (Pro+) menyimpan di edge "selama mungkin" dan invalidasi otomatis | [Smart CDN](https://supabase.com/docs/guides/storage/cdn/smart-cdn); konfirmasi dengan `curl -I` pada URL objek publik |

---

## 7. Mitigasi per tier

### 7.1 Tier `U_req` 100 – 1 000 (E=10…100, M=10; "sekolah biasa")

- **Debounce + koalesensi write.** Batasi maksimal 1 write progress per pemain per
  **15 detik** dengan trailing edge. Ini menurunkan `D_writes` dari ~46 menjadi
  ~3 per sesi **tanpa** kehilangan progres, karena progres sudah persisten di
  `localStorage` (`gameEngine.ts:156`, `gameEngine.ts:329`) dan akan dikirim saat
  `visibilitychange`/`pagehide` (`TectonicGame.tsx:340-348`).
- **Ubah `rpc_insert_submission` menjadi UPSERT.** Tambahkan
  `UNIQUE (student_id, level_number)` lalu `ON CONFLICT ... DO UPDATE`. Satu baris
  per (siswa, level) selamanya → storage turun **~15×** (dari 1 baris per event
  menjadi 1 baris tetap) dan Dashboard Guru berhenti tumbuh.
- **Amankan `localStorage` sebagai sumber kebenaran.** Jangan pernah menambah
  mirror per frame ke Supabase.
- **Cache-Control immutable untuk aset ber-hash.** Lihat `assets.md` §3.
- **Hapus aset mati (baseline 21:25).** 4.23 MB dari 10.23 MB `public/` tidak dirujuk
  kode apa pun (terukur, `assets.md` §1.1) — dan 476 KB di antaranya bahkan masuk
  precache sehingga diunduh **setiap** klien; sebagian sudah dihapus oleh proses lain
  (lihat `assets.md` §0.1). Tambahan: `terrain-688.stl` (3.02 MB) cukup di-gzip di
  origin untuk turun ke 966 KB (−69.5%, terukur) tanpa mengubah kode — **ini masih
  belum dikerjakan dan sekarang menjadi perbaikan terbesar yang tersisa.**

### 7.2 Tier `U_req` 10 000 – 100 000 (E=30…1000, M=100–1000)

- **Perbaiki Realtime, jangan tambah.** (a) Sempitkan binding `students` dari
  `event: '*'` menjadi hanya `INSERT,UPDATE` (`supabaseClient.ts:1109`);
  (b) pertimbangkan `broadcast` dari database alih-alih `postgres_changes` untuk
  mengurangi fan-out; (c) satu guru = satu channel (sudah begitu), jangan satu
  channel per kelas terbuka paralel.
- **Wajib: naik ke Pro tanpa spend cap** kalau guru konkuren > 500.
- **Sederhanakan query guru.** Ganti `select('*')` (`supabaseClient.ts:960-964`)
  menjadi view agregat per siswa (`DISTINCT ON (student_id) ... ORDER BY level_number`)
  atau minimal `&limit=200&order=completed_at.desc`, plus filter kolom.
- **Indeks komposit** (lihat `supabase_schema.sql:65-68` sebagai basis):
  ```sql
  CREATE INDEX IF NOT EXISTS idx_students_class_absent
    ON students (classroom_code, absent_number);
  CREATE INDEX IF NOT EXISTS idx_submissions_class_completed
    ON level_submissions (classroom_code, completed_at DESC);
  CREATE UNIQUE INDEX IF NOT EXISTS uq_submissions_student_level
    ON level_submissions (student_id, level_number);
  ```
- **Connection pooling — hanya untuk sisi server.** Supavisor transaction mode
  dipakai oleh komponen server (Edge Function, worker). **Klien browser tidak boleh**
  memakai host pooler: pooler berbicara protokol wire Postgres, tidak bisa dipakai
  dari browser, dan akan memaksa kredensial DB masuk ke bundle. Browser tetap
  memakai `https://<ref>.supabase.co` + anon key. `[PERLU VERIFIKASI]` port/host
  pooler persis: ambil dari Dashboard → Connect.
- **Precache selektif.** Keluarkan chunk rute lazy dari precache awal
  (**669 KB wire dari 1.68 MiB** yang di-precache — `assets.md` §2.1) dan pakai
  `runtimeCaching` `StaleWhileRevalidate`, supaya instalasi pertama turun ke
  ~0.29 MiB sekaligus tetap offline setelah rute dibuka sekali. Ini menyerang titik
  jebol #1 secara langsung untuk setiap klien baru.

### 7.3 Tier `U_req` 100 000 – 1 000 000 (M=1000, "siap kalau pemakaian melonjak")

- **Aset harus keluar dari origin aplikasi — atau berhenti diunduh ulang.**
  Setelah perbaikan `assets.md` §4.1: kunjungan pertama ≈ **2.33 MiB** (STL di-gzip)
  dan kunjungan ulang ≈ **0**. Untuk 10⁶ sesi **dingin** itu masih 2.33 TB. Di tier ini
  hanya dua opsi: (a) konversi agresif (AVIF untuk gambar + Draco/meshopt untuk STL,
  target < 1 MB per sesi), atau (b) pisahkan aset ke CDN dengan tarif cached-egress.
- **Egress wajib masuk anggaran cached egress** Supabase ($0.03/GB) atau CDN lain;
  $0.09/GB egress biasa untuk TB-scale = puluhan ribu dolar `[PERLU VERIFIKASI]`.
- **Queue + write-behind wajib.** `λ_w = 4 167 write/s` di `b_row = 1.2 KB` ≈
  **5 MB/s write murni** plus indeks + WAL. Ini butuh compute ≥ 4XL
  (480 koneksi, 20 000 IOPS baseline menurut [Compute and Disk](https://supabase.com/docs/guides/platform/compute-and-disk))
  dan sebuah **antrean** (pgmq/Redis/SQS) di depan `rpc_insert_submission`, dengan
  batch `INSERT ... SELECT FROM unnest($1)` alih-alih satu RPC per event.
- **Read replica / pemisahan jalur baca.** Saat dashboard guru mulai bersaing
  dengan jalur tulis, arahkan pembacaan analitik ke read replica
  ([Read Replicas](https://supabase.com/docs/guides/platform/compute-and-disk)) atau
  ke tabel materialized view yang di-refresh periodik — bukan ke tabel transaksional.
- **Partisi & retensi.** `level_submissions` sebaiknya dipartisi per bulan dan
  diarsipkan; tanpa ini `ΔStorage_month = 647 GB` tidak bisa dipertahankan.
- **Autoscaling compute + spend cap** sebagai pengaman anggaran
  ([Cost control](https://supabase.com/docs/guides/platform/cost-control)).

---

## 8. "Jangan dipatok ke satu estimasi" — desain menurun anggun 10 → 1 000 000

Tujuannya: **perilaku benar** di semua skala, bukan "berfungsi sampai N lalu mati".
Perubahan berikut semuanya kompatibel dengan arsitektur sekarang.

1. **Write-behind queue di IndexedDB (bukan localStorage).**
   `localStorage` sinkron dan ~5 MB; IndexedDB asinkron dan jauh lebih besar.
   Antrean menyimpan `{student_id, level_number, score, details, ts, attempts}`.
   Satu worker per tab menguras antrean. Jika satu pemain menghasilkan 20 write,
   yang terkirim adalah **1 upsert terbaru** — bukan 20 INSERT (idempoten).
2. **Koalesensi by key, bukan by time.** Kunci = `student_id + level_number`;
   write baru **menggantikan** yang belum terkirim, bukan menumpuk.
3. **Exponential backoff + jitter, menghormati `Retry-After`.** Pada 429/503/504
   dan `too_many_connections`/`tenant_events` (kode error Realtime yang
   didokumentasikan), backoff `min(base × 2^n, 60 s) × (0.5 + rand())`. Tidak
   pernah ada retry tanpa batas.
4. **Tanpa write amplification.** Ini cacat yang sudah ada sekarang:
   `level2Sync.ts:47` memanggil `unlockLevel(3)` pada **setiap** sync yang `isDone`,
   dan `unlockLevel` (`teacherStore.ts:390-424`) **selalu** memanggil
   `syncStudentToCloud` tanpa cek "apakah nilainya berubah?". Perbaikan:
   `if (newLevel === state.unlockedLevel) return;` sebelum sync.
   Terukur dari kode: 1 write tambahan per sync setelah level selesai — pada 20 sync
   itu 20 write sia-sia per pemain.
5. **Circuit breaker + mode lokal.** Jika error rate > ambang selama N detik, berhenti
   mengirim ke jaringan dan tetap 100% lokal (aplikasi memang sudah offline-first
   lewat `localStorage` + service worker, `PRD.md:253`). Sinkronisasi ulang saat
   `online`/`visibilitychange`. Pemain **tidak pernah** melihat kegagalan.
6. **Batas atas yang eksplisit, bukan asumsi.** Set `max_rows` pada pembacaan guru
   dan `limit` pada PostgREST. Query yang tidak terbatas (`supabaseClient.ts:960-964`)
   adalah satu-satunya hal di aplikasi ini yang tumbuh tanpa plafon.
7. **Anggaran yang dipantau, bukan ditebak.** Empat metrik yang harus ada alarmnya:
   egress/bulan, `pg_database_size`, Realtime concurrent connections, dan
   p95 latensi `level_submissions`. Formula di §3 memberi ambang untuk keempatnya
   sebagai fungsi dari `E` dan `M` — jadi kalau `E` berubah, anggarannya ikut berubah
   otomatis, bukan angka mati.

---

## 9. Cara memakai `loadtest.js`

```bash
cd "RESQ-BOX/capacity"

# 1. Lihat bantuan & daftar env var
node loadtest.js --help

# 2. Kering: cetak rencana tanpa satu pun request jaringan (aman, default URL palsu)
RESQ_DRY_RUN=1 node loadtest.js

# 3. Uji kecil ke proyek staging (5 VU, 30 detik)
RESQ_SUPABASE_URL="https://xxxx.supabase.co" \
RESQ_SUPABASE_ANON_KEY="eyJ..." \
RESQ_TEST_PASSWORD="rahasia-staging" \
RESQ_VU=5 RESQ_DURATION_S=30 \
node loadtest.js

# 4. Baru boleh > 100 VU dengan persetujuan eksplisit
RESQ_ALLOW_HIGH_VU=1 RESQ_VU=500 ...
```

**Jangan** menjalankan ini terhadap proyek produksi tanpa proyek staging terpisah:
setiap write membuat baris baru yang tidak pernah dihapus (§1.4 butir 2), dan
skrip ini **tidak pernah** mengirim `DELETE`.

### 9.1 Status verifikasi `loadtest.js`

Skrip sudah **diuji jalan** (bukan hanya ditulis) pada lingkungan ini:

| Uji | Hasil |
|---|---|
| `node --check loadtest.js` | lolos (exit 0) |
| `node loadtest.js --help` | mencetak blok bantuan lengkap (exit 0) |
| `RESQ_DRY_RUN=1 node loadtest.js` | mencetak rencana, **nol request** (exit 0) |
| `RESQ_VU=200 node loadtest.js` (tanpa izin) | ditolak, pesan jelas (exit 2) |
| `RESQ_VU=500 RESQ_ALLOW_HIGH_VU=1 RESQ_DRY_RUN=1` | diizinkan, mencetak `U_req = 2 000`, `E = 200` (exit 0) |
| Tanpa kredensial & bukan dry-run | ditolak dengan 3 pesan wajib (exit 2) |
| Self-test offline ke `http://127.0.0.1:59999` (port tertutup, **tanpa trafik eksternal**) | kode error jaringan terbaca `ECONNREFUSED`, verdict `TIDAK BERJALAN`, laporan JSON tertulis, exit 2 — lihat `_selftest-report.json` |

Uji terhadap layanan Supabase hidup **belum dan tidak akan** dijalankan dari sesi ini
sesuai aturan: tidak menjalankan uji beban terhadap layanan hidup.

### 9.2 Kode keluar

| Kode | Arti |
|---|---|
| `0` | PASS — p95 ≤ `RESQ_SLO_P95_MS` **dan** rasio error ≤ `RESQ_SLO_ERROR_RATE` **dan** tidak ada kegagalan auth |
| `1` | FAIL — SLO terlampaui, tetapi uji benar-benar berjalan |
| `2` | Konfigurasi salah/ditolak, **atau** tidak ada satu pun VU yang berhasil login sehingga uji tidak pernah berjalan (λ dan R pada laporan itu **tidak boleh** ditafsirkan) |

### 9.3 Menaikkan VU secara bertahap (cara mencari kapasitas nyata)

1. Mulai `RESQ_VU=5 RESQ_DURATION_S=60`. Pastikan **0 error** dan p95 jauh di bawah SLO.
2. Ganti `RESQ_SLO_P95_MS` menjadi ambang yang kamu janjikan ke pengguna (mis. 750 ms).
3. Naikkan VU 2× setiap kali (`5 → 10 → 20 → 40 → 80`), dengan
   `RESQ_ALLOW_HIGH_VU=1` setelah melewati 100.
4. Titik ketika p95 melewati SLO **atau** error mulai muncul adalah **kapasitas nyata**
   pada konfigurasi Supabase saat itu. Catat `λ dicapai` di titik itu.
5. Masukkan λ tersebut ke rumus `U_req = λ × 60 / (C × R)` di §3.1 untuk mendapatkan
   berapa concurrent user yang sebenarnya bisa dilayani — lalu bandingkan dengan
   `E × M` dari tabel §4.1. Kalau lebih kecil, perbaiki dulu tiga titik jebol di §5.

---

## 10. Kesimpulan angka kunci

| | `E = 10` (M=10) | `E = 1000` (M=1000) |
|---|---|---|
| `U_req` | **100** | **1 000 000** |
| `λ` rata-rata | **0.83 req/s** | **8 333 req/s** |
| `λ_peak` (P=3) | **2.5 req/s** | **25 000 req/s** |
| `λ_w` | **0.42 write/s** | **4 167 write/s** |
| Realtime conn | **4** | **32 258** |
| Egress aset / 1000 sesi | **7.89 GB** dingin / **6.12 GB** hangat | **7.89 GB / 6.12 GB** (per-sesi tetap; yang berubah jumlah sesinya) |
| Storage / bulan | **~1 MB** (10 pemain × 4 sesi) | **~647 GB** (3 M pemain × 4 sesi) |
| Jebol pertama | **Egress Free 5 GB** (sudah, di ~634 sesi dingin) | **Realtime 10 000 + egress TB + write 4 167/s** |

Tiga hal yang jebol lebih dulu: **egress aset → ukuran DB → Realtime connections.**
