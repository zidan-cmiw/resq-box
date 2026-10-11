# RESQ-BOX — Aplikasi Desktop (`.exe`)

Panduan ini menjelaskan cara membangun dan memakai aplikasi RESQ-BOX untuk
**laptop Windows**.

---

## Mengapa aplikasi ini ada

Ada satu masalah yang tidak bisa diselesaikan dari sisi website:

> Peramban **memblokir** koneksi `ws://` (tidak terenkripsi) dari halaman yang
> disajikan lewat **HTTPS**.

Website `https://resq-box.pages.dev` memakai HTTPS. Diorama ESP32 memakai
`ws://192.168.4.1:81`. Karena itu peramban **memblokir koneksi itu sebelum
dicoba** — dan tombol "Diorama WiFi" tidak pernah berhasil, walaupun WiFi
ESP32 sudah tersambung dengan benar.

**Yang salah bukan WiFi, bukan Board, dan bukan kode aplikasi — melainkan
DARI MANA halaman itu dibuka.**

Aplikasi desktop ini menyajikan halaman yang sama dari
`http://127.0.0.1:<port>` di dalam komputer sendiri. Alamat `127.0.0.1`
diperlakukan peramban sebagai **konteks aman**, sehingga `ws://` ke perangkat
di jaringan lokal **diizinkan**.

> **Sudah dibuktikan.** Menjalankan aplikasi web di `http://localhost:5173`
> dengan laptop tersambung ke WiFi `DIORAMA_ESP32` **berhasil** menyambung ke
> Board. Aplikasi ini melakukan hal yang sama — hanya dibungkus menjadi satu
> berkas yang dapat dijalankan.

---

## Untuk perangkat mana

| Perangkat | Yang dipakai | Board tersambung? |
|---|---|---|
**Laptop Windows** | **`.exe` ini** | ✅ **Bisa** |
Tablet Android | APK | ✅ Bisa |
iPad | Website (Safari) | ❌ Tidak bisa |
HP/laptop lain | Website | ❌ Tidak bisa |

**Catatan penting:** `.exe` **hanya untuk Windows.** iPad dan Android tidak
dapat menjalankannya. Untuk iPad, sudah dipastikan Safari tidak memiliki
penawarnya — diperlukan aplikasi iOS, dan itu memerlukan komputer Mac.

---

## Cara membangun

Di folder proyek, jalankan:

```powershell
npm run desktop:build
```

Selesai. Skripnya mengerjakan empat langkah sekaligus:

| # | Langkah |
|---|---|
1 | Membangun halaman web (`dist/`) |
2 | Menyiapkan folder hasil |
3 | Membuat ikon `.ico` |
4 | Memaketkan menjadi `.exe` |

**Butuh 3–8 menit** pada percobaan pertama, karena Electron (~100 MB) dan alat
bantu electron-builder perlu diunduh lebih dahulu. Setelah itu lebih cepat.

### Hasilnya

```
C:\resqbox-desktop\release\RESQ-BOX-0.0.0-portable.exe
```

**Ukuran: sekitar 114 MB.** Itu wajar — berkas ini membawa seluruh Chromium
dan Node.js di dalamnya, sehingga **tidak perlu pemasangan tambahan** di
komputer tujuan. Cukup salin dan jalankan.

Ingin hasilnya di folder lain? Sebutkan sebagai argumen:

```powershell
node scripts/bangun_desktop.mjs "D:\hasil-build"
```

---

## Cara memakai

1. **Sambungkan laptop ke WiFi `DIORAMA_ESP32`** (sandi `12345678`)
2. **Jalankan** `RESQ-BOX-0.0.0-portable.exe`
3. Masuk, lalu buka **Level 3 → Workspace**
4. Tekan tombol **Diorama WiFi** → alamat **`192.168.4.1`** → **Koneksikan**
5. Tunggu sampai muncul **"Diorama Fisik Terhubung!"** di log aktivitas

Jendela aplikasi akan terbuka sendiri. Tidak ada yang perlu diatur.

---

## Menjalankan tanpa membangun

Untuk pengembangan, jalankan langsung dari kode:

```powershell
npm run desktop
```

Ini menyajikan folder `dist/` yang sudah ada. **Jalankan `npm run build`
lebih dahulu** bila kode web baru saja diubah.

---

## Dua kendala khusus komputer ini

Perintah `electron-builder` biasa **GAGAL** di komputer ini karena dua hal.
Keduanya sudah ditangani oleh `scripts/bangun_desktop.mjs`.

### 1. Gagal memindahkan folder di dalam proyek

```
EPERM: operation not permitted, rename
'...\release\win-unpacked.tmp' -> '...\release\win-unpacked'
```

**Sudah dibuktikan** bahwa folder proyek ini memiliki pengaturan hak akses
yang membuat pemindahan folder besar gagal. Pengujiannya:

| Folder yang sama, 961 item | Hasil |
|---|---|
Di dalam proyek | ❌ **GAGAL** (4 kali berturut-turut) |
Di folder TEMP | ✅ Berhasil |
Di `C:\resqbox-desktop` | ✅ Berhasil |

**Penanganannya:** hasil build diarahkan **ke luar folder proyek**.

### 2. Gagal membuat ikon

```
node.exe process failed 3221226505
```

Alat pembuat ikon bawaan electron-builder **crash** di komputer ini.

**Penanganannya:** berkas `.ico` dibuat lebih dahulu memakai Pillow, lalu
hasilnya diberikan langsung kepada electron-builder.

---

## Uji server internal

Server yang melayani halaman dapat diuji tanpa membuka jendela:

```powershell
npm run desktop:uji-server
```

**21 pemeriksaan**, mencakup hal-hal yang paling berisiko:

| Yang diuji | |
|---|---|
Halaman tersaji beserta jenis MIME yang benar | ✅ |
Alamat tanpa berkas dikembalikan ke `index.html` | ✅ |
**Penelusuran direktori ditolak** (8 bentuk serangan) | ✅ |
Folder bersaudara yang namanya berawalan sama tidak terbuka | ✅ |
Port dipilih bebas oleh sistem | ✅ |
Hanya mendengarkan di `127.0.0.1` (tidak terbuka ke jaringan) | ✅ |

> **Penelusuran direktori** adalah hal yang paling penting di sini. Tanpa
> penjaganya, satu permintaan yang dirancang khusus dapat membaca berkas **di
> luar** folder aplikasi — termasuk berkas milik sistem. Karena itu ada
> delapan bentuk serangan yang diuji.

**Dua kerentanan nyata ditemukan lewat pengujian ini**, dan keduanya sudah
diperbaiki:

1. **Byte nol** (`%00`) pada alamat membuat `fs.readFile` melempar galat yang
   tidak tertangkap — dan **seluruh aplikasi mati**. Satu permintaan cacat
   tidak boleh dapat mematikan aplikasi.
2. **Folder bersaudara berawalan sama** (`dist-rahasia` terhadap `dist`) lolos
   dari pemeriksaan, karena pencocokan awalannya tidak memakai pemisah jalur.

---

## Berkas terkait

| Berkas | Isinya |
|---|---|
`electron/main.cjs` | Titik masuk: menjalankan server, membuka jendela |
`electron/server-web.cjs` | Server berkas + penjaga penelusuran direktori |
`scripts/bangun_desktop.mjs` | Skrip pembangun `.exe` |
`scripts/uji_server_desktop.mjs` | Uji server internal |
`build/icon.png` | Ikon sumber (512×512) |

---

## Catatan keamanan

Aplikasi ini sengaja dibuat **ketat**:

| Setelan | Nilai | Artinya |
|---|---|---|
`nodeIntegration` | `false` | Halaman tidak dapat menyentuh berkas komputer |
`contextIsolation` | `true` | Halaman terpisah dari proses utama |
`sandbox` | `true` | Halaman berjalan di kotak pasir |
**`webSecurity`** | **`true`** | **TIDAK dimatikan** |
Server | `127.0.0.1` saja | Tidak dapat diakses dari komputer lain di jaringan |

**`webSecurity` sengaja TIDAK dimatikan.** Banyak panduan menyarankan
mematikannya agar `ws://` dapat tersambung — tetapi itu **tidak perlu** di
sini. Karena halaman disajikan dari `127.0.0.1`, `ws://` sudah diizinkan
tanpa melemahkan keamanan peramban. Mematikannya hanya akan membuka celah
yang tidak diperlukan.
