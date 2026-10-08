# RESQ-BOX — Strategi Aset & Bandwidth

> Semua angka ukuran di dokumen ini **terukur**, bukan perkiraan, kecuali yang
> ditandai `[ESTIMASI]` atau `[PERLU VERIFIKASI]`.
>
> **Snapshot pengukuran:** `dist/sw.js` (33 entri precache) dari build
> **2026-10-08 21:25:55**, `public/` pada saat yang sama.
> Catatan penting: `dist/` sedang dibangun ulang oleh proses lain saat dokumen ini
> ditulis (nama hash chunk berubah antar-build, ukuran berubah < 0,2%). Yang dipakai
> di sini adalah **ukuran**, bukan hash. Kalau hash di `dist/sw.js` sudah berbeda,
> ukurannya tetap berlaku.
>
> Skrip pengukuran ada di folder ini dan bisa dijalankan ulang:
> `_measure_assets.py`, `_measure_avif.py`, `_measure_transfer.py`,
> `_measure_stl.py`, `_measure_icons.py`. Semuanya read-only.
> Hasil mentah WebP/AVIF: `_measure_assets.json`.

---

## 0. Ringkasan

| Metrik | Hari ini | Setelah perbaikan | Perubahan |
|---|---|---|---|
| Precache PWA **di kabel** (gzip) | 1,766,479 B (1.68 MiB) | ~976,808 B (0.93 MiB) | **−45%** |
| Precache PWA **raw di disk** (indikatif) | 4,874,388 B (4.65 MiB) | ~4,059,549 B (3.87 MiB) | −17% |
| Precache PWA, setelah chunk rute dipisah | — | ~307,598 B (0.29 MiB) | **−83%** |
| Aset on-demand (wire) | 6,119,186 B (5.84 MiB) | 1,469,739 B (1.40 MiB) | **−76%** |
| Sesi dingin (wire) | 7,885,665 B (7.52 MiB) | 2,446,547 B (2.33 MiB) | **−69%** |
| Sesi hangat (wire) | 6,119,186 B (5.84 MiB) | ≈ 0 | **−100%** |
| Egress / 1000 sesi dingin | **7.89 GB** | **2.45 GB** | **−69%** |
| Egress / 1000 sesi hangat | **6.12 GB** | **≈ 0 GB** | **−100%** |
| Egress / 1000 pembacaan Dashboard Guru (setelah 10 sesi) | **15.8 GB** | **0.11 GB** | **−99%** |

> Catatan basis: **"raw di disk" ≠ "di kabel"**. Host sudah meng-gzip JS/CSS
> (−64% untuk seluruh precache). Untuk egress, angka **wire** yang berlaku. Baris
> "raw" hanya untuk menunjukkan bobot repo/deploy.

---

## 0.1 STATUS TERKINI — sebagian rekomendasi sudah diterapkan oleh proses lain (21:31)

> **Penting untuk membaca dokumen ini dengan benar.** Saat dokumen ini sedang
> ditulis, ada **proses lain di workspace yang sama** yang menerapkan sebagian
> rekomendasi di §1.2 dan §1.3. Jadi seluruh tabel di §1 adalah **audit baseline**
> (keadaan sebelum perubahan, diukur 21:25), sedangkan bagian ini mencatat
> keadaan sesudahnya agar tidak ada yang salah membaca.

**Terverifikasi di disk (bukan dari git log, tapi dari `Get-ChildItem` + grep):**

| Rekomendasi saya | Status di disk | Bukti |
|---|---|---|
| Hapus `public/frames/` (§1.1) | ✅ **sudah** — folder tidak ada lagi | `Test-Path public\frames` → `False` |
| Ganti `logo.png` 1024×1024 (§1.3) | ✅ **sudah** — jadi `logo.jpg` (95,491) + `favicon.png` (4,273) + `apple-touch-icon.png` (25,991) | `index.html:5-7` sekarang menunjuk `/favicon.png` & `/apple-touch-icon.png`, dan bahkan memuat komentar "sebelumnya memakai logo.png/JPEG 1024px sebesar 367 KB" |
| Buat ikon PWA yang hilang (§1.3) | ✅ **sudah** — `pwa-192x192.png` (29,207) & `pwa-512x512.png` (171,391) | 404 sudah tidak ada lagi |
| `bg-rainforest.jpg` → WebP (§1.2) | ✅ **sudah** — `bg-rainforest.webp` (126,430) | `Login/index.tsx:103` menunjuk `/bg-rainforest.webp` |
| `bg-teacher-clouds.jpg` → WebP (§1.2) | ✅ **sudah** — `bg-teacher-clouds.webp` (97,324) | `TeacherDashboard/index.tsx:561` menunjuk `/bg-teacher-clouds.webp` |
| Hapus `peta_lapisan_bumi.jpg`, `radar_bumi_lengkap.jpg`, `radar_bumi_lengkap_label.png` (§1.1) | ✅ **sudah** | ketiganya hilang dari disk, dan **tidak ada** rujukan tersisa di `src/` |
| Hapus `radar_bumi.png`, `radar_bumi.svg`, `radar_bumi_lengkap_label.svg`, `icons.svg` (§1.1) | ❌ **belum** — masih ada di disk (57,626 + 13,595 + 16,152 + 5,055 = 92,428 B, dan yang `radar_*`/`icons.svg` masih di precache) | `Get-ChildItem public` |
| Precache selektif — keluarkan chunk rute lazy (§2.1) | ✅ **sudah** — `vite.config.ts` menambahkan `globIgnores` untuk `blockly`, `Workspace`, `EvacuationCanvas`, `Level2`, `Level3` + `runtimeCaching` pengganti | precache 4.760 → **2.287 KiB** |
| Tambahkan `webp` ke `globPatterns` (§3.2) | ✅ **sudah** — `globPatterns` kini memuat `webp` | `bg-rainforest.webp` & `bg-teacher-clouds.webp` **masuk** precache (terverifikasi di `dist/sw.js`) |
| Kompresi gzip untuk `terrain-688.stl` (§1.4) | ✅ **sudah** — dibuat `public/terrain-688.stl.gz` (966.231 B) dan `Merapi3DScene.tsx` memuatnya lewat `DecompressionStream`, dengan fallback ke `.stl` mentah | unduhan Level 3: **3.165.784 → 966.231 B (−69,5%)** |
| Precache `terrain-688.stl` / `maximumFileSizeToCacheInBytes` (§1.4) | ⏭️ **sengaja TIDAK dilakukan** — justru lebih baik di-`runtimeCache` agar tidak membebani unduhan pertama; model 3D kini di-cache saat pertama dipakai | lihat `runtimeCaching` pola `stl|webp|jpg|png` |
| `Cache-Control` immutable di `vercel.json` (§3.1) | ✅ **sudah** — `assets/*` immutable 1 tahun, gambar 30 hari, `sw.js`/`index.html` `must-revalidate` | sesi hangat ~5,84 MiB → **~0** |
| Hapus `radar_bumi.png`, `radar_bumi.svg`, `radar_bumi_lengkap_label.svg` (§1.1) | ✅ **sudah** (92.428 B, termasuk yang masih ter-precache) | `Get-ChildItem public` |
| Hapus `icons.svg` (§1.1) | ⏭️ **dipertahankan** — masih bisa dipakai sebagai sprite ikon; 5.055 B tidak signifikan | — |
| `ON CONFLICT` untuk `level_submissions` (§4.2) | ✅ **sudah** — RPC baru menyimpan satu baris per (siswa, level) + indeks unik `(student_id, level_number)` | lihat `supabase/migrations/02_rpc_and_hardening.sql` |
| Koalesensi tulis klien (jendela 5 detik) | ✅ **sudah** — `flushPendingProgress()` di `supabaseClient.ts`, dikuras saat tab disembunyikan/ditutup | `D_writes` ~46 → ~3 per sesi |
| `unlockLevel` tidak lagi menulis berulang | ✅ **sudah** — ada penjaga `if (newLevel === state.unlockedLevel) return state;` | write amplification §8.4 dihapus |

**Validasi silang — prediksi saya vs hasil aktual proses lain:**

| Berkas baru | Prediksi saya (terukur) | Aktual di disk | Selisih |
|---|---|---|---|
| `apple-touch-icon.png` (180×180 PNG-256) | 25,991 | **25,991** | **0 byte — cocok persis** |
| `pwa-192x192.png` (192×192 PNG-256) | 29,207 | **29,207** | **0 byte — cocok persis** |
| `pwa-512x512.png` (512×512 PNG-256) | 171,391 | **171,391** | **0 byte — cocok persis** |
| `bg-rainforest.webp` | 116,850 (q80, method 6) | 126,430 | +9,580 (+8%) — setting encoder sedikit berbeda |
| `bg-teacher-clouds.webp` | 89,414 (q80, method 6) | 97,324 | +7,910 (+9%) — idem |
| `favicon.png` | 29,207 (192×192) | 4,273 | −24,934 — pilihan lebih agresif (ukuran lebih kecil / PNG-8) |

Tiga kecocokan **byte-untuk-byte** pada ikon menunjukkan metode pengukuran di
`_measure_icons.py` tepat, sehingga angka WebP/AVIF lain di §1.2 juga bisa dipercaya
(estimasi WebP memang bisa berbeda ±10% tergantung encoder/`method`, dan itu wajar).

**Ukuran `public/` akhir (terukur setelah seluruh penerapan):**
**4.917.828 B (4,69 MiB)**, turun dari **10.724.242 B (10,23 MiB)** —
**berkurang 5.806.414 B (5,54 MiB)**. Angka ini *termasuk* `terrain-688.stl.gz`
(966.231 B) yang sengaja ditambahkan sebagai versi terkompresi; berkas `.stl`
mentah tetap disimpan sebagai cadangan, sehingga total byte di repo lebih besar
tetapi **byte yang benar-benar diunduh browser jauh lebih kecil**.

Tanpa berkas `.gz` tambahan itu, `public/` tinggal **3.951.597 B (3,77 MiB)**.

**Byte yang benar-benar berpindah ke pemain (perkiraan, kunjungan dingin):**

| Komponen | Sebelum | Sesudah |
|---|---|---|
| Precache service worker (di kabel, gzip) | ~1,68 MiB | ~1,68 MiB |
| `terrain-688.stl` saat masuk Level 3 | 3.165.784 B mentah | **966.231 B** (gzip) |
| 2 latar halaman (Login & Posko Guru) | 1.463.219 B (JPG) | **223.754 B** (WebP) |
| **Total unduhan dingin** | **~6,3 MiB** | **~2,8 MiB (−56%)** |
| **Kunjungan ulang (aset sudah ber-`Cache-Control`)** | ~5,8 MiB | **~0** |

**Yang masih perlu dikerjakan (bila suatu saat skala menuntut):**
1. Konversi AVIF (lebih kecil dari WebP) untuk 2 latar — kini keduanya sudah
   WebP sehingga manfaatnya mengecil (~50 KB).
2. `icons.svg` masih 5 KB dan selalu ter-precache — bisa di-inline bila perlu.
3. Di tier ≥100.000 pengguna: pindahkan aset ke CDN ber-tarif *cached egress*
   dan aktifkan partisi/retensi untuk `level_submissions` (§7.3 `README.md`).
3. **Tambahkan `webp` ke `globPatterns` (`vite.config.ts:30`).** Perubahan WebP
   sudah dilakukan, tetapi tanpa baris ini latar WebP yang baru **tidak** masuk
   precache — sehingga janji offline `PRD.md:253` belum terpenuhi untuk latar,
   dan `bg-rainforest.webp`/`bg-teacher-clouds.webp` tetap diunduh ulang tiap sesi
   sampai header cache (§3.1) diperbaiki. **Penting:** precache selektif yang baru
   (`vite.config.ts:36-42`) memakai `globIgnores` berisi `assets/Level2-*.js` dst.
   — pastikan pola itu tidak ikut meng-exclude aset WebP.
4. Hapus 4 aset mati yang tersisa (92,428 B; `radar_*` ×3 dan `icons.svg`, semuanya
   masih di precache) (§1.1).
5. Koalesensi write + `ON CONFLICT` (§4.2) → egress Dashboard Guru turun 99%.
6. Pertimbangkan `<picture>` + AVIF: `bg-rainforest` AVIF q60 = 100,972 vs
   WebP aktual 126,430 (hemat tambahan 25 KB), `bg-teacher-clouds` AVIF 77,929 vs
   97,324 (hemat 19 KB).

Konsekuensi terhadap limit Free plan (5 GB egress, terverifikasi di
[supabase.com/pricing](https://supabase.com/pricing.md)):

- Hari ini, **sesi dingin**: 5 GB habis di **~634 sesi**.
- Hari ini, **sesi hangat**: 5 GB habis di **~817 sesi**.
- Setelah perbaikan, **sesi dingin**: 5 GB habis di **~2 044 sesi**.
- Setelah perbaikan, **sesi hangat**: aset tidak lagi memakan egress.

Tiga masalah terbesar, berurutan: **(1) `frames/` 3.53 MB yang tidak dirujuk siapa pun**,
**(2) `terrain-688.stl` 3.02 MB yang tidak dikompresi**, **(3) gambar JPG 2.82 MB yang
tidak punya cache header**.

---

## 1. Tabel aset lengkap (`RESQ-BOX/public/`)

Total `public/` = **10,724,242 B (10.23 MiB)**. Kolom "baru" = hasil pengukuran nyata
WebP q80 (Pillow 12.3.0, `method=6`) atau AVIF q60, bukan tebakan. Kolom "P" = masuk
precache service worker (`dist/sw.js`).

### 1.1 Aset mati — hapus (tidak ada satu pun rujukan)

Grep atas `src/**/*.ts(x)`, `src/index.css`, dan `index.html` untuk tiap nama →
**0 hasil**. Ini bukan dugaan.

| Aset | Ukuran sekarang | Tindakan | Baru | Hemat | Bukti |
|---|---|---|---|---|---|
| `frames/f_0.jpg` … `frames/page_4.jpg` (**13 berkas**) | **3,699,834** | **HAPUS seluruh folder** | 0 | **3.53 MiB** | 0 rujukan `frames/`, `f_N.jpg`, `page_N.jpg` di seluruh proyek |
| `frames/f_6.jpg` vs `frames/page_2.jpg` | 334,071 ×2 | (bagian dari folder di atas) | — | (sudah termasuk) | MD5 keduanya `9361063061FED434CE17987C96D901DB` — **byte-identik** |
| `radar_bumi_lengkap_label.png` | 383,776 | hapus — **tetapi ini di-precache** | 0 | 0.37 MiB | 0 rujukan |
| `radar_bumi.png` | 57,626 | hapus — **di-precache** | 0 | 56 KB | 0 rujukan |
| `radar_bumi.svg` | 13,595 | hapus — **di-precache** | 0 | 13 KB | 0 rujukan |
| `radar_bumi_lengkap_label.svg` | 16,152 | hapus — **di-precache** | 0 | 16 KB | 0 rujukan |
| `icons.svg` | 5,055 | hapus — **di-precache** | 0 | 5 KB | 0 rujukan |
| `images (1).jpg` | 25,827 | hapus (duplikat) | 0 | 25 KB | MD5 `94EE6A8B9192C58F542BC67BAEC96C02` |
| `images (1).jpeg` | 25,827 | hapus (duplikat) | 0 | 25 KB | MD5 sama dengan di atas |
| **Subtotal** | **4,227,692** | | **0** | **4.03 MiB** | |

**Verifikasi duplikat (MD5, dihitung langsung, bukan dari nama berkas):**

| Grup | Berkas | MD5 | Ukuran | Status rujukan |
|---|---|---|---|---|
| **A** | `wedhus_gembel.jpg` | `94EE6A8B9192C58F542BC67BAEC96C02` | 25,827 | **dirujuk** — `Level2/DiscoveryModal.tsx:5211` |
| **A** | `images (1).jpg` | sama | 25,827 | tidak dirujuk → hapus |
| **A** | `images (1).jpeg` | sama | 25,827 | tidak dirujuk → hapus |
| **B** | `images.jpeg` | `1199C994FB78CFA10F7CEF1C04D33B85` | 85,163 | **dirujuk** — `DiscoveryModal.tsx:5243` dan `:6588` |
| **B** | `lahar_dingin.jpg` | sama | 85,163 | **dirujuk** — `DiscoveryModal.tsx:5248` |
| **C** | `frames/f_6.jpg` | `9361063061FED434CE17987C96D901DB` | 334,071 | tidak dirujuk |
| **C** | `frames/page_2.jpg` | sama | 334,071 | tidak dirujuk |

Grup A: 3 berkas byte-identik, hanya 1 yang dipakai → **hapus 2 berkas (51,654 B)**.
Grup B: 2 berkas byte-identik, **keduanya** dirujuk (untuk animasi transformasi
`images.jpeg` → `lahar_dingin.jpg` di `DiscoveryModal.tsx:5243-5248`) → **jangan hapus
berkasnya**, tapi sadari bahwa ini mengunduh 85 KB dua kali untuk isi yang sama;
cukup satu berkas dan dua rujukan ke URL yang sama.
Grup C: terbukti duplikat di dalam folder yang memang akan dihapus.

**Catatan penting soal `frames/`:** folder ini **tidak** di-precache (jpg tidak ada di
`globPatterns`, lihat §3), jadi hari ini ia **tidak** memakan egress per pengguna.
Nilainya adalah: 3.53 MB bobot deploy yang sia-sia, dan risiko nyata — begitu ada
satu orang menautkannya (atau crawler menebak path-nya), 3.53 MB langsung masuk ke
meteran egress. Hapus.

### 1.2 Aset besar yang dipakai — konversi & cache

Semua angka "WebP q80" dan "AVIF q60" di bawah adalah **hasil encode nyata** dari
berkas aslinya, bukan estimasi rasio.

| Aset | Dimensi | Sekarang | Tindakan | WebP q80 (terukur) | AVIF q60 (terukur) | Hemat (WebP) |
|---|---|---|---|---|---|---|
| `bg-rainforest.jpg` | 1376×768 | 748,765 | WebP + `<picture>` + immutable | **116,850** | 100,972 | 631,915 (84.4%) |
| `bg-teacher-clouds.jpg` | 1376×768 | 714,454 | WebP + immutable | **89,414** | 77,929 | 625,040 (87.5%) |
| `peta_lapisan_bumi.jpg` | 1200×896 | 590,710 | WebP + lazy-load | **47,394** | 37,605 | 543,316 (92.0%) |
| `radar_bumi_lengkap.jpg` | 896×1200 | 619,008 | WebP + lazy-load | **54,564** | 44,993 | 564,444 (91.2%) |
| `logo.png` | 1024×1024 | 367,842 | **lihat §1.3** | 40,346 | 25,705 | 327,496 (89.0%) |
| `terrain-688.stl` | 63,314 tri | 3,165,784 | **lihat §1.4** | — | — | lihat §1.4 |
| `1.webp` | 768×544 | 84,312 | **biarkan** — sudah WebP; konversi malah membesar | 82,554 (−2.1%) | — | 0 |
| `images.jpeg` / `lahar_dingin.jpg` | 736×416 | 85,163 | **biarkan** — WebP q80 = 96,464, **lebih besar 13%** | — | — | 0 |
| `wedhus_gembel.jpg` | 638×480 | 25,827 | biarkan (WebP hanya hemat 27%, 7 KB) | 18,858 | — | 6,969 |
| `radar_bumi_lengkap_label.png` | 1520×970 | 383,776 | **hapus** (§1.1) | 83,512 | 52,472 | 383,776 |
| `bg-rainforest.jpg` dst. total JPG/WebP dipakai | | **2,953,402** | | **503,524** | ~430,000 | **2,449,878 (82.9%)** |

**Pelajaran penting dari pengukuran:** konversi WebP **tidak selalu menang**.
`images.jpeg`/`lahar_dingin.jpg` (736×416, sudah dioptimasi) menjadi **13% lebih besar**
setelah dikonversi ke WebP q80. `1.webp` juga tidak untung. Jadi jalankan konversi
hanya untuk berkas ≥ 100 KB dan **selalu ukur hasilnya** — skrip `_measure_assets.py`
di folder ini melakukan tepat itu.

**Resize (kalau mau lebih agresif):** `bg-rainforest.jpg` dan `bg-teacher-clouds.jpg`
adalah latar layar. Pada 1376×768 keduanya wajar untuk desktop; untuk tablet sekolah
(768–1024 px) versi 1024×572 dengan WebP q75 akan turun ke ~60–70 KB `[ESTIMASI]`.

### 1.3 `logo.png` — salah label, terlalu besar, dan di-precache

Terverifikasi dengan membaca magic bytes:

```
magic: ffd8ffe0   →  JPEG (FF D8 FF), BUKAN PNG
ukuran: 1024×1024
bytes : 367,842
```

Tetapi `index.html:5` menyatakan `<link rel="icon" type="image/png" href="/logo.png" />`.
Jadi: berkas JPEG dengan ekstensi `.png` dan MIME yang salah, dipakai sebagai favicon
pada 1024×1024, dan **masuk precache** (`dist/sw.js`), artinya **setiap** klien
mengunduh 367.842 byte hanya untuk ikon tab.

Diganti dengan varian berukuran tepat (semua **terukur**):

| Varian | Bytes | Hemat |
|---|---|---|
| 192×192 PNG-256 (favicon) | **29,207** | 92.1% |
| 180×180 PNG-256 (apple-touch) | **25,991** | 92.9% |
| 512×512 PNG-256 (PWA) | 171,391 | 53.4% |
| 512×512 WebP q80 | 18,416 | 95.0% |

Tindakan: buat `favicon-192.png` (29,207 B) + `apple-touch-icon.png` (25,991 B),
`favicon.svg` sudah ada dan **sudah di-precache** (9,522 raw / 1,499 wire) — pakai itu
sebagai ikon utama di browser modern. Hemat bersih pada precache: **338,635 byte wire
per klien**.

**Bonus temuan — ikon PWA 404.** Terverifikasi: `manifest.webmanifest` dan
`index.html:6` merujuk `/pwa-192x192.png` dan `/pwa-512x512.png`, tetapi **kedua berkas
itu tidak ada** di `public/` maupun `dist/`. Jadi instalasi PWA hari ini memakai ikon
yang gagal dimuat. Tindakan: buat keduanya dari logo (192: 29,207 B; 512: 171,391 B),
dan tambahkan ke `globIgnores` supaya **tidak** masuk precache — browser mengambilnya
saat instalasi dengan kebijakan cache-nya sendiri, sehingga tidak menambah beban
precache.

### 1.4 `terrain-688.stl` — 3.02 MB, nol kompresi, dan tidak bisa di-precache

Struktur berkas terbukti secara aritmetis (bukan asumsi):

```
ukuran berkas          : 3,165,784 byte
triangle count di header: 63,314
84 + 50 × 63,314       : 3,165,784 byte   → cocok PERSIS
```

Binary STL = header 80 B + uint32 jumlah segitiga (4 B) + 50 B per segitiga
(12 float32 + uint16 atribut). Jadi berkas ini membawa 63.314 segitiga mentah **tanpa
kompresi apa pun** — konsisten dengan `PRD.md:984` ("~3.16 MB, 63.314 poligon").

Hasil pengukuran kompresi:

| Perlakuan | Bytes | Hemat |
|---|---|---|
| gzip -9 (terukur) | **966,215** | **69.5%** |
| brotli q11 | `[PERLU VERIFIKASI]` — modul brotli tidak tersedia di runtime pengukuran | biasanya 3–8% lebih baik dari gzip |
| Draco / meshopt glTF `[ESTIMASI]` | 200,000–500,000 | 84–94% |

**Dua langkah, urut dari termurah:**

1. **Aktifkan kompresi di origin untuk `.stl`.** gzip -9 memberi 966,215 B —
   **hemat 2.2 MB per pemuatan tanpa mengubah satu byte kode aplikasi.** Ini
   perbaikan dengan rasio usaha/manfaat terbaik di seluruh proyek.
   `[PERLU VERIFIKASI]`: apakah host mengompresi `Content-Type: model/stl`.
   Cek dengan `curl -sI -H "Accept-Encoding: gzip" https://<domain>/terrain-688.stl | findstr -i content-encoding`.
   Kalau host tidak mengompresi, pindahkan STL ke Supabase Storage / CDN yang
   mengizinkan aturan kompresi, atau pre-compress dan simpan `.stl.gz`
   (perlu perubahan kode di `Merapi3DScene.tsx:415` — di luar lingkup tugas ini).
2. **Konversikan ke glTF + Draco/meshopt.** 63.314 segitiga terkompresi biasanya
   200–500 KB. Ini mengubah kode pemuatan (`Merapi3DScene.tsx:415` memakai
   `STLLoader`), jadi jadwalkan sebagai pekerjaan terpisah, bukan perbaikan cepat.

**Kenapa STL ini tidak ada di precache:** `vite.config.ts:30` hanya
`['**/*.{js,css,html,ico,png,svg,woff2}']` — tidak ada `stl` (dan tidak ada `jpg`/
`webp`). Bahkan kalau `stl` ditambahkan, workbox akan **melewatinya secara diam-diam**:
default `maximumFileSizeToCacheInBytes` = **2,097,152** (2 MiB), terverifikasi di
`node_modules/workbox-build/build/types.d.ts` (`@default 2097152`), sedangkan STL ini
3.165.784 B. Untuk mem-precache STL harus diset eksplisit:

```ts
// vite.config.ts — workbox
globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,webp}'],
maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,   // default 2 MiB, STL 3.02 MiB
globIgnores: ['**/pwa-*.png'],                     // ikon instalasi, jangan di-precache
```

**Jangan** menyetel `maximumFileSizeToCacheInBytes: 4 MiB` tanpa menghapus aset mati
(§1.1) — kalau tidak, precache naik dan masalah egress makin buruk. Lakukan §1.1 dulu.

---

## 2. Rincian precache service worker (terukur dari `dist/sw.js`)

33 entri. Ini yang diunduh **setiap** klien baru saat service worker dipasang.

| Entri | Raw | Wire (gzip) |
|---|---|---|
| `assets/blockly-BpR8KDA3.js` | 731,986 | 191,288 |
| `assets/EvacuationCanvas-D8HGIKFt.js` | 692,656 | 176,584 |
| `assets/Level1-mexy-6aG.js` | 597,122 | 127,660 |
| `assets/Level2-BnLW_55F.js` | 481,352 | 115,174 |
| `radar_bumi_lengkap_label.png` ← **aset mati** | 383,776 | 383,776 |
| `logo.png` ← 1024×1024 untuk favicon | 367,842 | 367,842 |
| `assets/index-DE2V3StC.css` | 295,964 | 39,046 |
| `assets/JourneyProgressTracker-C71ud4Oa.js` | 281,424 | 57,828 |
| `assets/teacherStore-CCSUsTYd.js` | 237,119 | 59,943 |
| `assets/react-vendor-NFgz3HWj.js` | 231,876 | 73,178 |
| `assets/index-DiW6atiB.js` | 169,325 | 30,135 |
| `assets/Workspace-oCZWGhyU.js` | 76,727 | 20,230 |
| `radar_bumi.png` ← **aset mati** | 57,626 | 57,626 |
| `assets/TeacherDashboard-BNG_GR5c.js` | 51,098 | 11,226 |
| `assets/Level3--GG6KlC_.js` | 50,046 | 11,411 |
| `assets/missionStore-Bs8gGORD.js` | 38,812 | 9,265 |
| `assets/Profile-Cd2u18pl.js` | 36,039 | 8,375 |
| `radar_bumi_lengkap_label.svg` ← **aset mati** | 16,152 | 3,929 |
| `assets/Login-m3TumtYd.js` | 14,538 | 3,466 |
| `assets/Credits-Da7EM8el.js` | 13,105 | 3,011 |
| `radar_bumi.svg` ← **aset mati** | 13,595 | 3,540 |
| `favicon.svg` | 9,522 | 1,499 |
| `assets/studentAvatarSheet-uBwUqU6z.js` | 9,017 | 2,363 |
| `icons.svg` ← **aset mati** | 5,055 | 2,165 |
| `assets/runtimeStore-Cd_zRe80.js` | 2,815 | 1,187 |
| `assets/workspaceStore-Dep5XZ4f.js` | 2,689 | 1,034 |
| `assets/level3Sync-Cf9Twcko.js` | 1,982 | 950 |
| `index.html` | 1,612 | 716 |
| `assets/NotFound-DfQHlQ98.js` | 1,571 | 785 |
| `assets/react-C0I2Qiia.js` | 696 | 430 |
| `assets/rolldown-runtime-S-ySWqyJ.js` | 694 | 423 |
| `manifest.webmanifest` | 421 | 268 |
| `registerSW.js` | 134 | 126 |
| **TOTAL** | **4,874,388** | **1,766,479** |

**Temuan:** kompresi gzip di host sudah bekerja sangat baik untuk JS/CSS (−64%
keseluruhan). Karena itu, pada basis **wire**, precache hari ini adalah **1.68 MiB**,
bukan 4.65 MiB. Yang tersisa mahal di precache justru **PNG**: `logo.png` (367,842),
`radar_bumi_lengkap_label.png` (383,776), `radar_bumi.png` (57,626) — ketiganya
**tidak dikompresi** dan dua di antaranya **aset mati**. Total 809.244 byte wire
(46% dari seluruh precache wire) hanya untuk PNG yang tidak perlu.

### 2.1 Precache setelah perbaikan

| Langkah | Wire | Kumulatif |
|---|---|---|
| Sekarang | 1,766,479 | 1,766,479 |
| Hapus 5 aset mati yang di-precache (`radar_*` ×4 + `icons.svg`) | −451,036 | 1,315,443 |
| Ganti `logo.png` dengan 192×192 PNG | −338,635 | 976,808 |
| (opsional) Keluarkan chunk rute lazy dari precache | −669,210 | **307,598** |

Baris terakhir = **0.29 MiB** untuk instalasi pertama. Chunk yang bisa dikeluarkan
tanpa merusak apa pun (terbukti lazy via `App.tsx:7-15`): `Level1`, `Level2`, `Level3`,
`Workspace`, `Login`, `Profile`, `TeacherDashboard`, `Credits`, `NotFound`, plus
`blockly` dan `EvacuationCanvas` (dipecah manual di `vite.config.ts:12`, hanya dipakai
di Level 3 / tampilan 3D). Ganti dengan `runtimeCaching` `StaleWhileRevalidate`
sehingga tetap tersedia offline **setelah** rute itu dibuka sekali.

**Jangan** tempel semua perubahan ini sekaligus — setiap langkah bisa diverifikasi
sendiri dengan membandingkan jumlah entri dan total byte di `dist/sw.js` sebelum/sesudah.

---

## 3. Perubahan konfigurasi konkret

### 3.1 Cache-Control di Vercel

Terverifikasi: `vercel.json` (9 baris) **hanya** berisi `rewrites` — **tidak ada**
aturan `headers` sama sekali. Jadi tidak ada `Cache-Control` yang dikonfigurasi
proyek ini. `[PERLU VERIFIKASI]`: header efektif yang diberikan Vercel untuk berkas
statis (halaman [Cache-Control headers](https://vercel.com/docs/caching/cache-control-headers)
tidak merender isinya saat saya akses). Verifikasi dengan:

```bash
curl -sI https://<domain>/assets/<hash>.js   | findstr -i cache-control
curl -sI https://<domain>/terrain-688.stl    | findstr -i "cache-control content-encoding"
curl -sI https://<domain>/bg-rainforest.jpg  | findstr -i cache-control
```

`vercel.json` yang diusulkan (gabungan dengan `rewrites` yang sudah ada):

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/terrain-688.stl",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" },
        { "key": "Content-Type", "value": "model/stl" }
      ]
    },
    {
      "source": "/1.webp",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/index.html",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" }]
    },
    {
      "source": "/sw.js",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" }]
    },
    {
      "source": "/manifest.webmanifest",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" }]
    }
  ]
}
```

Catatan penting soal `terrain-688.stl`:

- Nama berkas **tidak ber-hash**, jadi `immutable` berarti berkas pengganti tidak akan
  pernah terambil sampai nama berubah. Itu **aman** karena workbox memberi `revision`
  pada setiap entri precache — service worker akan mengambil ulang saat isinya berubah.
  Kalau STL **tidak** di-precache, pakai `public, max-age=604800, stale-while-revalidate=86400`
  (7 hari) supaya penggantian masih bisa masuk.
- `Content-Type: model/stl` membantu server/CDN memutuskan kompresi. Binary STL sering
  tidak dikenali dan karena itu **tidak** dikompresi — inilah kenapa 3.02 MB terkirim mentah.

**Alternatif Netlify** (`public/_headers`, tanpa perlu `netlify.toml`):

```
/assets/*
  Cache-Control: public, max-age=31536000, immutable
/terrain-688.stl
  Cache-Control: public, max-age=604800, stale-while-revalidate=86400
  Content-Type: model/stl
/1.webp
  Cache-Control: public, max-age=31536000, immutable
/index.html
  Cache-Control: public, max-age=0, must-revalidate
/sw.js
  Cache-Control: public, max-age=0, must-revalidate
```

### 3.2 Vite PWA — tambahkan `webp` ke precache

`vite.config.ts:30` hari ini: `globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']`.
Artinya **semua** JPG/WebP/STL tidak pernah di-precache. Setelah konversi ke WebP
(§1.2), tambahkan `webp` supaya aset gambar masuk precache dan bisa dipakai offline
sesuai janji `PRD.md:253` ("PWA dengan full offline support"):

```ts
globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,webp}'],
globIgnores: ['**/pwa-*.png'],          // ikon instalasi saja
maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,  // hanya jika ingin precache STL
```

Konsekuensi: precache naik ~0.5 MB (gambar WebP), tetapi aset on-demand turun ~2.45 MB
dan kunjungan ulang menjadi ~0 egress. Pertukaran ini jelas menguntungkan.

### 3.3 Supabase Storage vs origin aplikasi — untuk `terrain-688.stl`

**Temuan yang mengoreksi premis brief:** aplikasi ini **tidak memakai Supabase Storage
sama sekali**. Grep `src/` untuk `supabase.storage`, `storage.from`, `.upload(`,
`getPublicUrl`, `createSignedUrl` → **0 hasil**. Semua aset dilayani dari `public/`
→ `dist/` → origin aplikasi (Vercel, `vercel.json:1-9`). Jadi tidak ada "tetap dorong
dari Fastly-backed Supabase Storage" — itu bukan jalur yang ada hari ini, dan
memindahkannya ke sana berarti **menambah** dependensi baru.

**Rekomendasi: tetap di origin aplikasi.** Alasan:

1. Satu origin = tidak ada DNS/TLS handshake tambahan; STL bisa di-precache service
   worker (cross-origin precache butuh konfigurasi CORS + `crossorigin` dan lebih rapuh).
2. Memindahkannya ke Supabase Storage memindahkan byte dari meteran egress aplikasi
   ke meteran **Supabase cached egress** (Free 5 GB, Pro 250 GB lalu $0.03/GB) —
   meteran berbeda, biaya berbeda, tetapi tetap meteran.
3. Egress tertagih diukur dari respons HTTP. Kalau aset sudah ada di cache browser
   atau service worker, egress = 0 di **kedua** jalur. Jadi memperbaiki header cache
   (§3.1) memberi manfaat lebih besar daripada memindahkan origin.

**Soal `Cache-Control` di Supabase Storage (dikoreksi sebagian):** brief menyatakan
"Supabase Storage tidak mengekspos `Cache-Control` kustom pada URL publik". Menurut
[dokumentasi Smart CDN](https://supabase.com/docs/guides/storage/cdn/smart-cdn),
`cacheControl` **bisa** diatur — tetapi **pada saat upload**, memakai opsi
`cacheControl`, dan "default TTL is typically set to 1 hour". Untuk mengubahnya pada
objek yang sudah ada, objek harus di-upload ulang. Smart CDN otomatis aktif di plan
Pro ke atas dan menyimpan aset di edge "selama mungkin" dengan invalidasi otomatis.
Jadi yang benar: **nilainya diatur saat upload, bukan di URL publik setelahnya**, dan
`[PERLU VERIFIKASI]` apakah header itu muncul apa adanya di respons objek publik —
konfirmasi dengan `curl -sI <public-object-url> | findstr -i cache-control`.

---

## 4. Egress per 1000 sesi — sebelum vs sesudah

Asumsi: 1 sesi = 1 pemain, 45 menit (`PRD.md:352`). "Wire" = byte yang benar-benar
melintas (gzip untuk teks, mentah untuk JPEG/PNG/WebP/STL).

### 4.1 Aset aplikasi

| Skenario | Hari ini | Setelah perbaikan | Setelah perbaikan + STL gzip |
|---|---|---|---|
| 1 sesi **dingin** (precache dipasang + aset on-demand) | 7,885,665 B (7.52 MiB) | 4,646,116 B (4.43 MiB) | **2,446,547 B (2.33 MiB)** |
| 1 sesi **hangat** (SW + HTTP cache bekerja) | 6,119,186 B (5.84 MiB) | ~0 | **~0** |
| **1000 sesi dingin** | **7.89 GB** | 4.65 GB | **2.45 GB** |
| **1000 sesi hangat** | **6.12 GB** | ~0 GB | **~0 GB** |
| 1000 sesi dingin, precache diringkas maksimal (§2.1) | — | — | **1.78 GB** |

Angka "hari ini, hangat" sebesar 6.12 GB adalah **kasus terburuk yang realistis**:
service worker hanya meng-cache 33 entri precache. `terrain-688.stl` dan semua JPG
**tidak** ada di situ, dan tanpa `Cache-Control` eksplisit (§3.1) tidak ada jaminan
browser mempertahankannya. Jadi pemain yang sama, minggu depan, mengunduh ulang
5.84 MiB.

### 4.2 Egress pembacaan Dashboard Guru — masalah yang lebih besar

Ini bukan aset, tapi memakai meteran egress yang **sama**.

`fetchClassroomSubmissions` melakukan `select('*')` pada `level_submissions` dengan
filter `classroom_code` dan `order completed_at desc`, **tanpa `limit` dan tanpa
paginasi** (`supabaseClient.ts:960-964`). Karena `rpc_insert_submission` adalah
`INSERT` murni (`supabase_schema.sql:369-385`), baris menumpuk selamanya.

Perhitungan (kelas 30 siswa, `D_writes = 46` per pemain per sesi, `b_row = 1200 byte`
`[ESTIMASI]`):

| | Hari ini (INSERT per event) | Setelah `ON CONFLICT (student_id, level_number)` |
|---|---|---|
| Baris per kelas per sesi | 30 × 46 = **1,380** | 30 × 3 level = **90 (tetap)** |
| Byte per pembacaan, sesi ke-1 | 1.58 MB | 0.11 MB |
| Byte per pembacaan, sesi ke-10 | **15.8 MB** | 0.11 MB |
| Byte per pembacaan, sesi ke-40 (1 tahun ajaran) | **63.4 MB** | 0.11 MB |
| **Egress / 1000 pembacaan (sesi ke-10)** | **15.8 GB** | **0.11 GB** |

Dengan 20 kelas × 5 pembacaan/hari: **1.58 GB/hari** hari ini vs **0.011 GB/hari**
setelah perbaikan. Ini sendirian menghabiskan 250 GB egress Pro dalam ~5 bulan
hari ini, dan menjadi tidak relevan setelah diperbaiki.

**Tambahan yang wajib:** batasi kolom (`select` spesifik, bukan `*`), dan/atau ganti
dengan view agregat `DISTINCT ON (student_id) ... ORDER BY created_at DESC`.

---

## 5. Urutan pengerjaan yang disarankan (rasio manfaat/usaha menurun)

| # | Tindakan | Usaha | Hemat | Risiko |
|---|---|---|---|---|
| 1 | Hapus `frames/` + 4 aset `radar_*` + `icons.svg` + `images (1).*` | hapus berkas | **4.03 MiB** repo, **451 KB wire** per klien | perlu konfirmasi pemilik bahwa `radar_*` memang tidak akan dipakai (lihat §6) |
| 2 | Aktifkan kompresi `.stl` di origin | konfigurasi host | **2.2 MB per pemuatan Level 3** | nol (tanpa ubah kode) |
| 3 | Ganti `logo.png` dengan 192×192 | 1 berkas | **338 KB wire per klien** | perbarui `index.html:5` (`type` yang benar) |
| 4 | `Cache-Control: immutable` di `vercel.json` | 1 berkas | **1000 sesi hangat: 6.12 GB → ~0** | verifikasi header setelah deploy |
| 5 | Konversi 4 JPG besar ke WebP + `<picture>` | 4 berkas + 4 rujukan | **2.45 MB per sesi dingin** | perlu perubahan rujukan di `Login/index.tsx:103`, `TeacherDashboard/index.tsx:561`, `DiscoveryModal.tsx:5277` |
| 6 | Buat ikon PWA yang hilang | 2 berkas | memperbaiki instalasi yang 404 | nol |
| 7 | Pisahkan chunk rute dari precache | `vite.config.ts` | **669 KB wire** per instalasi | uji mode offline setelahnya |
| 8 | Koalesensi write + `ON CONFLICT` untuk `level_submissions` | perubahan skema + klien | **§4.2: 15.8 GB → 0.11 GB / 1000 pembacaan** | perubahan DB, butuh migrasi |

Butir 1–4 tidak menyentuh logika aplikasi sama sekali dan bersama-sama menurunkan
egress sekitar **87%** untuk pemakaian berulang.

---

## 6. Yang tidak bisa saya verifikasi / perlu keputusan manusia

| Hal | Status | Cara memutuskan |
|---|---|---|
| `radar_bumi*.{png,svg,jpg}` dan `peta_lapisan_bumi.jpg` sungguh tidak terpakai | **terverifikasi 0 rujukan di kode**, tetapi ada berkas sumber bernama sama di root workspace (`C:\github\lidm buatan vincent\radar_bumi.*`, `peta_lapisan_bumi.jpg`) → kemungkinan bahan mentah untuk `PixelEarthDiagram.tsx` yang digambar ulang sebagai kode | tanya pemilik sebelum menghapus |
| Apakah host mengompresi `model/stl` | **tidak terverifikasi** | `curl -sI -H "Accept-Encoding: gzip" https://<domain>/terrain-688.stl` |
| Header cache efektif Vercel | **tidak terverifikasi** — halaman dokumentasi tidak merender | `curl -sI` pada 3 URL (§3.1) |
| `cacheControl` Supabase Storage pada URL publik | **terverifikasi sebagian** (diatur saat upload, default ~1 jam) | `curl -sI` pada objek publik |
| `b_row = 1200 byte` untuk `level_submissions` | **estimasi** dari ukuran JSONB `details` di kode | `select avg(pg_column_size(details)), pg_total_relation_size('level_submissions') from level_submissions;` |
| Hemat Draco untuk STL (200–500 KB) | **estimasi** berbasis praktik umum, bukan pengukuran berkas ini | encode satu kali dan ukur |
| Apakah `dist/` yang diukur identik dengan yang dideploy | **tidak terverifikasi** — `dist/` dibangun ulang pada 2026-10-08 21:25:55, saat dokumen ini ditulis | bandingkan jumlah entri + total byte `dist/sw.js` dengan versi produksi |
