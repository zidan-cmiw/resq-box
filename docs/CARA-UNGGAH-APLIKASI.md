# Cara Mengunggah Aplikasi agar Tombol Unduh Berfungsi

Halaman masuk website memiliki dua tombol unduh:

| Tombol | Berkas | Ukuran |
|---|---|---|
**LAPTOP (.exe)** | `RESQ-BOX-Laptop.exe` | ~114 MB |
**ANDROID (.apk)** | `RESQ-BOX-Android.apk` | ~7 MB |

Tombolnya mengarah ke **halaman Releases** repositori. Berkasnya **harus
diunggah sekali** agar tombolnya berfungsi. Panduan ini menjelaskan caranya.

---

## Mengapa lewat Releases, bukan langsung di website

| | Batas |
|---|---|
Cloudflare Pages (website) | **25 MB per berkas** |
GitHub Releases | 2 GB per berkas |

Berkas `.exe` berukuran **114 MB**, jauh melebihi batas website. Halaman
Releases memang disediakan GitHub untuk berkas sebesar itu, **dan tidak
membebani setiap pengunjung website dengan unduhan raksasa.**

---

## Berkas yang perlu diunggah

| Berkas di komputer | Nama saat diunggah |
|---|---|
`C:\resqbox-desktop\release\RESQ-BOX-0.0.0-portable.exe` | **`RESQ-BOX-Laptop.exe`** |
`android\app\build\outputs\apk\debug\app-debug.apk` | **`RESQ-BOX-Android.apk`** |

> **Nama saat diunggah HARUS persis seperti di atas.** Tombol di website
> mencari nama itu. Bila namanya berbeda, tombolnya menghasilkan halaman
> "not found".

---

## Langkah mengunggah

### 1. Buka halaman Releases

```
https://github.com/zidan-cmiw/resq-box/releases
```

### 2. Buat rilis baru

Klik **"Draft a new release"** (atau **"Create a new release"**).

### 3. Isi penanda versi

Pada kolom **"Choose a tag"**, ketik:

```
v1.0.0
```

Lalu klik **"Create new tag: v1.0.0 on publish"** yang muncul.

> **Harus `v1.0.0`.** Tombol di website mencari penanda versi itu.

### 4. Isi judul dan keterangan

**Release title:**
```
RESQ-BOX v1.0.0
```

**Describe this release:** (bebas, contoh)
```
Aplikasi RESQ-BOX untuk menyambung ke diorama fisik ESP32.

- RESQ-BOX-Laptop.exe — untuk laptop Windows
- RESQ-BOX-Android.apk — untuk tablet/HP Android

Diperlukan karena peramban memblokir koneksi tidak terenkripsi ke
perangkat di jaringan lokal, sehingga diorama tidak dapat tersambung
langsung dari website.
```

### 5. Unggah kedua berkas

Tarik kedua berkas ke kotak **"Attach binaries by dropping them here or
selecting them"** di bagian bawah.

**Setelah terunggah, ganti namanya:**

- Klik nama berkas → ganti menjadi `RESQ-BOX-Laptop.exe`
- Klik nama berkas → ganti menjadi `RESQ-BOX-Android.apk`

> Ukuran 114 MB memerlukan waktu unggah beberapa menit, tergantung
> kecepatan internet. Tunggu sampai bilah kemajuannya selesai.

### 6. Terbitkan

Klik **"Publish release"**.

### 7. Uji tombolnya

Buka `https://resq-box.pages.dev`, lalu klik kedua tombol unduh. Keduanya
harus langsung mengunduh berkasnya.

---

## Bila ada versi baru nanti

Setiap kali ada perbaikan, kedua aplikasi perlu dibangun ulang:

```powershell
# 1. Bangun web (dipakai website, APK, dan .exe)
npm run build

# 2. Bangun .exe
npm run desktop:build

# 3. Bangun APK
cd android
$env:JAVA_HOME = 'C:\Program Files\Android\Android Studio\jbr'
.\gradlew.bat assembleDebug
cd ..
```

Lalu **buat rilis baru** dengan penanda versi berikutnya (`v1.0.1`,
`v1.0.2`, dan seterusnya), dan **perbarui `PENANDA_RILIS`** di
`src/app/Login/index.tsx` agar tombolnya menunjuk ke versi terbaru.

---

## Mengapa aplikasi terpisah diperlukan

Ini bukan sekadar kemasan. Peramban **memblokir** koneksi `ws://` (tidak
terenkripsi) dari halaman yang disajikan lewat HTTPS. Website memakai HTTPS,
sedangkan diorama ESP32 memakai `ws://192.168.4.1:81` — karena itu
sambungannya **diblokir sebelum dicoba**.

Aplikasi desktop dan Android menyajikan halaman yang sama dari
`http://127.0.0.1`, yang oleh peramban dianggap konteks aman — sehingga
`ws://` ke perangkat di jaringan lokal **diizinkan**.

Keterangan ini juga dituliskan di halaman masuk, supaya tidak ada yang
mengira aplikasi hanya sekadar kemasan.
