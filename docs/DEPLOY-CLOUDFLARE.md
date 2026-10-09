# Deploy ke Cloudflare Pages

Panduan langkah demi langkah untuk RESQ-BOX. Ikuti berurutan.

---

## Mengapa pindah dari Vercel

Jaringan kampus **memblokir seluruh domain `vercel.app`** dengan menjail
DNS-nya:

```
DNS kampus:  vercel.app  →  127.0.0.1
```

`127.0.0.1` berarti "komputer sendiri". Jadi browser mencari web server di
laptop pengguna, tidak menemukan apa pun, lalu menampilkan
"This site can't be reached". Dari WiFi kampus, web di Vercel **tidak dapat
dibuka sama sekali** — bukan lambat, bukan error, tetapi benar-benar tidak bisa.

Bukti pengujian dari jaringan kampus:

| Domain | Hasil |
|---|---|
`vercel.app` | **DIJAIL** ke `127.0.0.1` |
`pages.dev` (Cloudflare) | DNS normal |
`workers.dev` (Cloudflare) | DNS normal |
`cloudflare-pages.pages.dev` | HTTP 522 (terhubung ke edge Cloudflare) |
`developers.cloudflare.com` | HTTP 200 |

**Pelajaran:** sebelum memilih hosting, uji dari **jaringan tempat aplikasi akan
dipakai**, bukan hanya dari jaringan rumah.

---

## Langkah 1 — Daftar / masuk Cloudflare

Buka **dash.cloudflare.com**, buat akun gratis bila belum punya.

Tidak perlu membeli domain. Cloudflare akan memberi subdomain gratis
`<nama-project>.pages.dev`.

---

## Langkah 2 — Buat project Pages

1. Di sidebar, pilih **Workers & Pages**
2. Klik **Create** → tab **Pages** → **Connect to Git**
3. Izinkan Cloudflare mengakses GitHub, lalu pilih repo **`zidan-cmiw/resq-box`**
4. Klik **Begin setup**

---

## Langkah 3 — Setelan build

Isi persis seperti ini:

| Kolom | Nilai |
|---|---|
**Project name** | `resq-box` (atau nama lain; menentukan URL `*.pages.dev`) |
**Production branch** | `main` |
**Framework preset** | `Vite` |
**Build command** | `npm run build` |
**Build output directory** | `dist` |
**Root directory** | *(biarkan kosong)* |

> **Penting:** biarkan **Root directory** kosong. Repo ini hanya satu proyek
> Vite di akar; mengisinya akan membuat build gagal karena berkas `package.json`
> tidak ditemukan.
>
> `npm run build` otomatis menjalankan `prebuild` lebih dahulu, yaitu
> `scripts/cek-env.mjs`, yang memeriksa dua variabel di Langkah 4. Bila
> variabelnya belum diisi, **build dihentikan** dengan pesan jelas — bukan
> menghasilkan web yang tidak bisa login.

---

## Langkah 4 — ⚠️ Environment variables (JANGAN DILEWATI)

**Buka bagian "Environment variables (advanced)" SEBELUM menekan Save and Deploy.**

Tambahkan **dua** variabel ini. Pada tiap variabel, centang **Production** dan
**Preview**:

| Name | Value |
|---|---|
`VITE_SUPABASE_URL` | `https://miwfotsnkikozqhvewtw.supabase.co` |
`VITE_SUPABASE_ANON_KEY` | *(anon key — lihat cara mengambilnya di bawah)* |

### Cara mengambil anon key

1. Buka **supabase.com/dashboard** → pilih project RESQ-BOX
2. **Project Settings** (ikon gerigi) → **API**
3. Cari bagian **Project API keys** → salin **`anon` `public`**

> **Kenapa ini wajib:** Vite menanamkan nilai variabel ke dalam berkas
> JavaScript **pada saat build**, bukan saat aplikasi berjalan. Tanpa nilainya,
> aplikasi terbangun dengan alamat kosong dan tombol MASUK akan menampilkan
> *"Mode luring: tidak bisa masuk tanpa koneksi ke server"* — pesan yang
> menyesatkan, karena jaringannya tidak bermasalah.
>
> `anon key` **bukan rahasia.** Kunci ini memang dirancang untuk dipakai di
> peramban; keamanan data ditegakkan oleh Row Level Security di database.
> Yang **tidak boleh** dimasukkan ke sini adalah **`service_role` key**.

### Variabel opsional

Tambahkan bila ingin pelaporan error (boleh dilewati):

| Name | Value |
|---|---|
`VITE_SENTRY_DSN` | DSN dari sentry.io |
`VITE_APP_VERSION` | mis. `1.0.0` |

---

## Langkah 5 — Save and Deploy

Klik **Save and Deploy**. Build memerlukan 1–3 menit.

Tunggu sampai muncul status **Success**. URL aplikasi akan tampil di atas,
berbentuk seperti:

```
https://resq-box.pages.dev
```

**Itu URL aslimu.** Bila nama `resq-box` sudah dipakai orang lain, Cloudflare
akan menambahkan akhiran, mis. `resq-box-abc.pages.dev` — pakai yang tertulis
di dashboard, bukan yang ditebak.

---

## Langkah 6 — Verifikasi (WAJIB, jangan dilewati)

### 6a. Buka dari WiFi kampus

Ini tujuan utama migrasi. Pastikan benar-benar bisa dibuka dari jaringan
tempat lomba akan berlangsung.

Bila **berhasil** → migrasi selesai.

Bila **gagal**, catat pesan error-nya dan lanjut ke Langkah 7.

### 6b. Cek header keamanan

Buka **securityheaders.com**, masukkan URL `*.pages.dev`-mu. Harus muncul:

| Header | Nilai benar |
|---|---|
`X-Content-Type-Options` | `nosniff` |
`X-Frame-Options` | `DENY` |
`Referrer-Policy` | `strict-origin-when-cross-origin` |
`Strict-Transport-Security` | ada |
`Content-Security-Policy` | ada |

Bila header **tidak muncul**, berarti berkas `public/_headers` tidak terbaca.
Periksa bahwa berkas itu ada di dalam folder `dist/` setelah build.

### 6c. Uji fungsi inti

| Uji | Hasil benar |
|---|---|
Buka halaman login | Latar hutan muncul (bukan ikon gambar rusak) |
Login sebagai siswa | Masuk ke Dashboard |
Login sebagai guru | Masuk ke Posko Guru |
Login `demo` | Level 2 dan 3 terbuka |
Buka Console (F12) | Tidak ada error `Refused to connect` atau `Refused to load` |

> **Bila muncul `Refused to connect`**, berarti `connect-src` pada CSP memblokir
> Supabase. Laporkan pesan persisnya — perlu penyesuaian CSP.
>
> **Bila font tampil salah**, berarti `style-src` atau `font-src` kurang tepat.

### 6d. Uji dari HP

Buka URL yang sama di ponsel. Ini penting karena siswa akan memakai ponsel,
dan sebagian besar trafik sekolah berasal dari sana.

---

## Langkah 7 — Bila gagal diakses dari kampus

Lakukan berurutan:

1. **Uji dari jaringan lain** (hotspot seluler). Bila berhasil di hotspot tetapi
   gagal di kampus, berarti jaringan kampus memblokir Cloudflare juga.
2. **Uji `pages.dev` polos**: buka `https://cloudflare-pages.pages.dev` di
   WiFi kampus. Bila itu pun gagal, seluruh `pages.dev` diblokir — perlu
   domain sendiri.
3. **Bila perlu domain sendiri**: daftarkan domain (mis. `resqbox.id`), lalu
   tambahkan sebagai **Custom domain** di Cloudflare Pages. Domain sendiri
   umumnya tidak masuk daftar blokir kampus.

---

## Setelah deploy — pembaruan berikutnya

Setiap kali kamu `git push` ke branch `main`, Cloudflare **otomatis membangun
dan men-deploy ulang**. Tidak ada langkah manual.

Karena PWA kini memakai `autoUpdate`, pengguna yang pernah membuka web akan
otomatis mendapat versi terbaru. Sebelumnya memakai `prompt`, sehingga pengguna
bisa terjebak di versi lama tanpa batas waktu — ini pernah menyebabkan halaman
login masih menampilkan fitur yang sudah dihapus.

---

## Yang perlu diperiksa berkala

| Kapan | Apa |
|---|---|
Sebelum lomba | Deploy ulang, lalu uji dari WiFi tempat lomba |
Sebelum lomba | Hapus akun `demo` bila tidak diperlukan juri |
Sebelum lomba | Ganti kata sandi guru dan demo dari nilai contoh |
Sesudah lomba | Backup database (lihat `supabase/README.md`) |

---

## Bila perlu kembali ke Vercel

Berkas `vercel.json` sudah dihapus. Bila suatu saat perlu kembali, ambil dari
riwayat git:

```
git log --oneline -- vercel.json
git show <commit>:vercel.json > vercel.json
```

Tetapi ingat: **Vercel tidak dapat diakses dari jaringan kampus.** Hanya
lakukan bila penilaian dilakukan dari luar jaringan itu.

---

## Ringkasan berkas terkait

| Berkas | Fungsi |
|---|---|
`public/_headers` | 6 header keamanan + aturan cache untuk Cloudflare Pages |
`scripts/cek-env.mjs` | Menghentikan build bila env var Supabase belum diisi |
`vite.config.ts` | Konfigurasi PWA (`registerType: 'autoUpdate'`) |
`package.json` | `prebuild` menjalankan `cek-env.mjs` sebelum build |
