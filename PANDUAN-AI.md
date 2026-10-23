# PANDUAN CHATBOT & UMPAN BALIK AI

Dokumen ini menjelaskan apa yang sudah dibangun, dan **apa yang harus kamu
lakukan agar menyala**. Tanpa langkah 1–3 di bawah, Resqy AI belum aktif.

---

## Apa yang sudah dibangun

| Berkas | Isi |
|---|---|
`functions/api/chat.ts` | Endpoint server: mode `chat` dan `umpanBalik` |
`functions/api/_deepseek.ts` | Pemanggil DeepSeek + pesan galat berbahasa Indonesia |
`functions/api/_pengetahuan.ts` | Basis pengetahuan tentang seluruh aplikasi |
`src/ai/klienAI.ts` | Klien peramban (tanpa kunci API) |
`src/ai/useUmpanBalik.ts` | Hook peminta umpan balik (dipakai 3 level) |
`src/components/UmpanBalikAI.tsx` | Kotak umpan balik di layar |
`src/store/evaluasiStore.ts` | Penanda "sedang evaluasi" |
`supabase/migrations/16_kuota_ai.sql` | Tabel & RPC kuota harian |

### Perilaku di aplikasi

1. **Chatbot disembunyikan saat evaluasi.** Tombol Resqy hilang selama Wordle
   (Level 1) dan TTS (Level 2) terbuka, muncul lagi setelah ditutup.
2. **Umpan balik setelah menjawab.** Muncul di Wordle, TTS, dan validasi blok
   Level 3. Benar: dijelaskan mengapa benar. Salah: ditunjukkan apa yang perlu
   ditinjau.
3. **Jawaban benar tidak pernah dikirim ke AI saat siswa salah.** Ini bukan
   sekadar imbauan: pada cabang "salah", jawaban benar tidak dimasukkan ke
   prompt, sehingga model tidak mungkin membocorkannya.
4. **Cadangan luring.** Bila AI mati atau kuota habis, chatbot kembali memakai
   catatan guru di perangkat (`bankQA`), dan memberi tahu siswa.

---

## Langkah mengaktifkan

### 1. Jalankan migrasi kuota

Supabase → SQL Editor → jalankan:

```
supabase/migrations/16_kuota_ai.sql
```

Harus muncul:

```
NOTICE:  [OK] Tabel ai_usage tersedia.
NOTICE:  [OK] Fungsi minta_izin_ai tersedia.
NOTICE:  Migrasi 16 selesai.
```

### 2. Isi variabel lingkungan di Cloudflare

Cloudflare → Pages → **resq-box** → Settings → **Environment variables**
(Production **dan** Preview):

| Nama | Isi | Wajib |
|---|---|---|
`DEEPSEEK_API_KEY` | kunci API DeepSeek | **ya** |
`SUPABASE_URL` | `https://miwfotsnkikozqhvewtw.supabase.co` | **ya** |
`SUPABASE_ANON_KEY` | kunci anon (bukan service_role) | **ya** |
`DEEPSEEK_MODEL` | `deepseek-chat` (bawaan) | tidak |

`DEEPSEEK_API_KEY` **wajib** ditandai *Secret* (encrypt). Setelah disimpan,
nilainya tidak dapat dibaca lagi — hanya bisa diganti.

> Kunci API **tidak pernah** masuk ke kode, APK, atau exe. Itulah sebabnya
> pemanggilan AI harus lewat `functions/api/chat.ts`.

### 3. Deploy ulang

Push ke `main` memicu build Cloudflare. Pages Functions di folder `functions/`
ikut ter-deploy otomatis bersama situs.

**Penting:** deployment Cloudflare saat ini sedang bermasalah (build tidak
memakai commit terbaru). Fungsi AI **tidak akan hidup** sebelum masalah
deployment itu selesai. Lihat Deployments di dashboard.

### 4. Uji

Buka aplikasi → masuk sebagai siswa → klik tombol Resqy → tanya
"cara akses level 2 gimana?". Bila jawabannya masuk akal, AI sudah aktif.

---

## Menguji di komputer sendiri

Cloudflare Function tidak berjalan lewat `vite preview`. Untuk mencoba lokal:

```powershell
cd "C:\github\lidm buatan vincent\RESQ-BOX"

# 1. buat berkas .dev.vars (JANGAN di-commit)
@"
DEEPSEEK_API_KEY=isi-kunci-di-sini
SUPABASE_URL=https://miwfotsnkikozqhvewtw.supabase.co
SUPABASE_ANON_KEY=isi-kunci-anon
"@ | Out-File .dev.vars -Encoding utf8

# 2. bangun lalu jalankan lewat wrangler
npm run build
npx wrangler pages dev dist --compatibility-date=2025-01-01
```

Buka alamat yang dicetak wrangler (biasanya `http://localhost:8788`).

Pastikan `.dev.vars` ada di `.gitignore` — kalau tidak, kuncinya ikut terunggah.

---

## Pengendalian biaya

| Pengaman | Nilai |
|---|---|
Kuota chat per siswa per hari | **20** pesan |
Kuota umpan balik per siswa per hari | **40** kali |
Guru dan admin | tanpa batas (untuk demonstrasi) |
Panjang jawaban | ≤ 340 token (chat), ≤ 260 token (umpan balik) |
Riwayat yang dikirim | 6 pesan terakhir, masing-masing ≤ 500 aksara |
Suhu | 0.3 (faktual, tidak berimprovisasi) |

Kuota dihitung **di database**, bukan di peramban, sehingga tidak bisa dihapus
siswa dengan membersihkan data peramban.

### Cache hit

DeepSeek memberi harga jauh lebih murah untuk token yang "kena cache", yaitu
awal prompt yang sama persis dengan permintaan sebelumnya.

Supaya sering kena cache, urutan pesan selalu:

1. `system` — INSTRUKSI + `PENGETAHUAN_WEB` (**statis, tidak pernah berubah**)
2. `riwayat` — percakapan sebelumnya
3. `user` — pertanyaan terbaru

**Aturan penting:** jangan menambahkan tanggal, nama siswa, atau nomor acak ke
bagian `system`. Satu kata yang berubah di awal akan menggugurkan cache untuk
seluruh sisa prompt, dan biaya token kembali penuh.

Jumlah token yang berhasil di-cache dikembalikan sebagai `cacheHit` pada
respons endpoint, sehingga penghematannya dapat dipantau.

---

## Bila ada masalah

| Gejala | Sebab | Tindakan |
|---|---|---|
"Layanan AI belum disiapkan" | env var belum diisi | Langkah 2 |
"Kunci API DeepSeek ditolak" | kunci salah atau dicabut | ganti `DEEPSEEK_API_KEY` |
"Saldo DeepSeek habis" | token habis | isi ulang di platform DeepSeek |
"Kuota tanya-jawab habis" | batas harian tercapai | normal; reset besok |
"Kuota tidak dapat diperiksa" | migrasi 16 belum jalan | Langkah 1 |
Chatbot menjawab dari catatan, bukan AI | AI mati / luring | cek env & deployment |

---

## Batas yang perlu diketahui

- Pengetahuan AI berasal dari teks tetap di `_pengetahuan.ts`. Fitur baru yang
  ditambahkan kemudian **tidak** otomatis diketahui AI sampai teks itu
  diperbarui. Perbarui dengan sadar: setiap perubahan menggugurkan cache.
- Umpan balik AI bukan penilaian. Nilai tetap dihitung server lewat
  `submit_level_result`; AI hanya memberi penjelasan.
- AI tidak dapat melihat layar siswa. Ia hanya tahu apa yang dikirim klien
  (mis. teks tebakan dan warna petunjuknya).
