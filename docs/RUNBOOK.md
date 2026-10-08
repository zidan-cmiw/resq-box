# 🛠️ RESQ-BOX — Runbook Operasional

Panduan untuk **menjalankan dan merawat** RESQ-BOX sebagai produk nyata yang
dipakai banyak sekolah — bukan sekadar demo lomba.

Isinya: apa yang harus dipantau, apa yang harus dilakukan saat ada masalah,
dan ke mana harus melihat saat ada laporan dari lapangan.

---

## 1. Peta layanan

| Komponen | Di mana | Yang perlu dijaga |
|---|---|---|
Aplikasi web (SPA) | Vercel | Build sukses, env var lengkap, aset ter-cache |
Database & Auth | Supabase (Postgres + Auth) | Ukuran DB, egress, koneksi Realtime, backup |
PWA cache | Peramban siswa | Service worker tidak menahan versi lama |
Aset statis | `public/` di repo | Ukuran unduhan, header cache |

---

## 2. Monitoring — empat metrik yang wajib dipantau

Ini ambang yang perlu dipasang alarm. Angkanya **relatif terhadap jumlah
pengguna**; perbarui bila pemakaian tumbuh.

| # | Metrik | Di mana melihat | Ambang peringatan | Ambang kritis |
|---|---|---|---|---|
**1** | **Egress / bulan** | Supabase → Reports → Bandwidth | 70% kuota paket | 90% |
**2** | **Ukuran database** | Supabase → Database → Size | 70% kapasitas | 85% |
**3** | **Koneksi Realtime** | Supabase → Reports → Realtime | 60% batas paket | 80% |
**4** | **p95 latensi RPC** | Supabase → Reports → API | > 800 ms | > 2 s |

Tambahan yang berguna:

| Metrik | Dari mana | Kenapa |
|---|---|---|
**Error rate frontend** | Sentry (lihat bagian 3) | Tahu ada yang rusak sebelum siswa mengeluh |
**Web Vitals (LCP/INL/CLS)** | Sentry atau `VITE_MONITORING_ENDPOINT` | Mengukur "ngelag atau tidak" secara objektif |
**Uptime** | UptimeRobot / Better Stack (gratis) | Deteksi paling awal saat aplikasi tidak bisa dibuka |

### Cara menyalakan pelaporan

Isi di Vercel → Settings → Environment Variables (centang Production + Preview):

```ini
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key>
VITE_AUTH_EMAIL_DOMAIN=resqbox.local
VITE_SENTRY_DSN=https://<key>@o<org>.ingest.sentry.io/<project>
VITE_MONITORING_SAMPLE=0.1
VITE_APP_VERSION=<nomor rilis, mis. 1.0.0>
```

> Bila `VITE_SENTRY_DSN` dikosongkan, aplikasi tetap berjalan normal — hanya
> laporan error yang tidak terkirim. Semua sudah ditangani di
> `src/utils/monitoring.ts`.

`VITE_MONITORING_SAMPLE` mengatur berapa persen Web Vitals yang dikirim
(default 10%). Seribu siswa menghasilkan ~100 laporan per metrik — cukup untuk
melihat pola tanpa membanjiri kuota.

**Privasi:** sebelum dikirim, semua laporan melewati `redact()` yang membuang
email, UUID, JWT, nomor telepon, dan kunci berisi kredensial
(`src/utils/redact.ts`, diuji oleh `npm run test`).

---

## 3. Tanggap insiden

### 3.1 Aplikasi tidak bisa dibuka sama sekali

1. Cek status: **status.supabase.com** dan **vercel-status.com**.
2. Cek deployment terakhir di Vercel — apakah build gagal?
3. Bila baru saja deploy: **rollback** lewat Vercel → Deployments → pilih
   deployment sebelumnya → *Promote to Production*.
4. Bila Supabase yang bermasalah: tunggu, sambil pantau status page.

### 3.2 Siswa melaporkan "layar putih" atau error

1. Buka Sentry → cari error dengan `tags.route` sesuai halaman yang dilaporkan.
2. Cocokkan `release` — apakah muncul setelah rilis tertentu?
3. Lihat `extra.device` — apakah hanya di perangkat/jaringan tertentu?
4. Bila terkait chunk gagal dimuat (`ChunkLoadError`): biasanya jaringan atau
   siswa masih memakai versi lama. Aplikasi sudah menampilkan tombol **Muat
   Ulang** untuk kasus ini (`src/components/AppErrorBoundary.tsx`).

### 3.3 Curiga kunci bocor atau akun disalahgunakan

**Anon key memang publik** — ia selalu ada di bundle peramban, jadi
kebocorannya bukan masalah selama RLS aktif. Yang berbahaya hanya
**service_role key**.

**Bila service_role key bocor:**
1. Supabase → Settings → API → **Roll** service_role key (langsung).
2. Periksa `level_submissions` dan `profiles` untuk perubahan tak dikenal.
3. Ganti password akun guru.
4. Bila perlu, pulihkan dari backup (bagian 4).

**Bila satu akun siswa disalahgunakan:**
```sql
-- Lihat aktivitas akun tersebut
SELECT * FROM public.level_submissions
WHERE student_id = (SELECT id FROM public.profiles WHERE lower(username) = 'USERNAME')
ORDER BY completed_at DESC;

-- Hapus akun beserta seluruh datanya (permanen)
DELETE FROM auth.users WHERE id = (SELECT id FROM public.profiles WHERE lower(username) = 'USERNAME');
```
Hapus lewat `auth.users` — `profiles` dan `level_submissions` akan ikut terhapus
karena memakai `ON DELETE CASCADE`.

### 3.4 Pendaftaran siswa spam

**Gejala:** banyak akun asing muncul di Posko Guru.

**Penanganan cepat** — tutup pendaftaran mandiri sementara:
```sql
-- Nonaktifkan sementara fungsi cek ketersediaan username
-- (pendaftaran akan gagal karena tidak bisa memvalidasi)
REVOKE EXECUTE ON FUNCTION public.username_available(TEXT) FROM anon;
```

**Penanganan permanen** (disarankan): pindah ke model **akun dibuat guru saja**,
sehingga siswa tidak bisa mendaftar sendiri. Guru membuat akun lewat Posko Guru.

**Penanganan tambahan:** pasang **Cloudflare Turnstile** pada formulir
pendaftaran.

Untuk menghapus akun spam massal:
```sql
-- Tinjau dulu sebelum menghapus!
SELECT username, name, classroom_code, created_at
FROM public.profiles
WHERE created_at > now() - interval '1 day'
ORDER BY created_at DESC;
```

### 3.5 Nilai tidak muncul di Posko Guru

Urutan pemeriksaan:

```sql
-- 1. Apakah nilai benar-benar tersimpan?
SELECT student_id, level_number, score, completed_at
FROM public.level_submissions
ORDER BY completed_at DESC LIMIT 10;

-- 2. Apakah siswanya punya kelas?
SELECT username, role, classroom_code FROM public.profiles WHERE role = 'student';

-- 3. Apakah kelasnya milik guru yang login?
SELECT code, name, teacher_username FROM public.classrooms;
```

Penyebab paling umum: `profiles.classroom_code` NULL (lihat migrasi 06) atau
`classrooms.teacher_username` tidak cocok dengan username guru yang login.

---

## 4. Backup & pemulihan

### Memastikan backup aktif

Supabase → **Database → Backups**. Pada paket Free, backup harian **tidak**
tersedia — aktifkan paket Pro, atau lakukan ekspor manual berkala:

```bash
# Ekspor manual (butuh connection string dari Dashboard → Connect)
pg_dump "$DATABASE_URL" --data-only --table=public.profiles \
  --table=public.classrooms --table=public.level_submissions \
  > backup-$(date +%Y%m%d).sql
```

### Menguji pemulihan (WAJIB dilakukan minimal sekali)

Backup yang belum pernah diuji restore **bukan backup**. Uji di proyek
Supabase terpisah:

1. Buat proyek Supabase baru khusus uji.
2. Jalankan seluruh migrasi di `supabase/migrations/` secara berurutan.
3. Muat data dari backup.
4. Pastikan `verify_security.sql` melaporkan `AMAN` dan data tampil di aplikasi.

Catat tanggal uji terakhir di bawah ini:

| Tanggal uji restore | Oleh | Hasil |
|---|---|---|
| _(belum pernah)_ | | |

---

## 5. Rutinitas pemeliharaan

### Setiap minggu
- [ ] Cek Sentry: ada error baru yang belum ditangani?
- [ ] Cek egress & ukuran DB (bagian 2)
- [ ] Cek apakah ada akun siswa yang perlu dibersihkan

### Setiap bulan
- [ ] Perbarui dependensi: `npm outdated`, lalu uji di lokal sebelum naik
- [ ] Tinjau kembali ambang alarm (bagian 2) sesuai pertumbuhan pengguna
- [ ] Periksa laporan error yang berulang — apakah perlu perbaikan mendesak

### Setiap kuartal
- [ ] Uji restore backup (bagian 4)
- [ ] Naikkan versi `VITE_APP_VERSION` agar laporan error bisa dilacak per rilis
- [ ] Tinjau kebijakan privasi (`/privacy`) — apakah masih sesuai praktik?

---

## 6. Menjalankan pemeriksaan sebelum rilis

```bash
cd RESQ-BOX

npm run typecheck      # TypeScript
npm run test           # uji privasi & mode hemat data
npm run test:sql       # validasi sintaks SQL + variabel PL/pgSQL
npm run build          # build produksi
npm run lint           # pelaporan saja (masih ada temuan lama)
```

CI menjalankan kelima langkah ini otomatis pada setiap push
(`.github/workflows/ci.yml`).

**Sebelum rilis ke produksi, pastikan:**

- [ ] `npm run typecheck` dan `npm run build` hijau
- [ ] `npm run test` hijau (29 uji)
- [ ] Migrasi SQL baru sudah dijalankan di database produksi
- [ ] `VITE_APP_VERSION` dinaikkan
- [ ] Sudah diuji di peramban sungguhan (Chrome Android + desktop)
- [ ] Halaman `/privacy` masih akurat

---

## 7. Catatan kapasitas

Model kapasitas berparameter lengkap ada di **`capacity/README.md`**. Ringkasnya:

| Jumlah pengguna bersamaan | Status | Yang perlu diperhatikan |
|---|---|---|
< 100 | ✅ Nyaman | Paket Free masih cukup |
100 – 1.000 | ⚠️ Perlu Pro | Egress & ukuran DB |
1.000 – 10.000 | ⚠️ Perlu Pro + optimasi | Koneksi Realtime, partisi tabel |
> 10.000 | 🔴 Perlu arsitektur baru | Lihat `tech stack rill + deploy (revisi)`, fase 1–5 |

**Tiga hal yang jebol lebih dulu** (dari audit): egress aset → ukuran database →
koneksi Realtime. Semuanya sudah dikurangi, tetapi tetap perlu dipantau.

---

## 8. Catatan penting

**Supabase Free menjeda proyek setelah 1 minggu tanpa aktivitas.** Untuk produk
yang dipakai sekolah secara berkala, ini risiko nyata — aplikasi akan mati tanpa
sebab yang jelas bagi guru. **Paket Pro menghapus masalah ini** dan sekaligus
memberi backup harian, egress 250 GB, dan database 8 GB.

**Jangan pernah** menaruh `service_role` key di variabel `VITE_*`. Semua yang
berawalan `VITE_` ikut ter-bundle ke peramban siswa.
