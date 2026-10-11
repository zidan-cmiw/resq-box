# Cara Mengunggah Aplikasi agar Tombol Unduh Berfungsi

Halaman masuk website memiliki dua tombol unduh:

| Tombol | Nama berkas di GitHub | Ukuran |
|---|---|---|
**LAPTOP (.exe)** | `RESQ-BOX-Laptop.exe` | ~115 MB |
**ANDROID (.apk)** | `RESQ-BOX-Android.apk` | ~7 MB |

Berkasnya perlu diunggah **sekali** ke halaman Releases agar tombolnya
berfungsi.

---

## Penanda versi yang dipakai

Website memakai tautan:

```
https://github.com/zidan-cmiw/resq-box/releases/latest/download/<nama berkas>
```

Kata **`latest`** berarti **"rilis terbaru"** — jadi penanda versinya
**bebas**. Kamu boleh memakai `v1.0.0`, `v1.0.1`, `v2.0.0`, atau apa pun.

**Konsekuensinya:** setiap kali ada versi baru, cukup unggah berkasnya
dengan **nama yang sama** — **tidak perlu mengubah kode website sama
sekali.**

> **Satu syarat:** rilisnya **jangan** ditandai **"Pre-release"**. GitHub
> melewati rilis pra-rilis saat mencari yang terbaru, sehingga tombolnya
> akan menunjuk ke rilis yang salah.

---

## Mengapa lewat Releases, bukan langsung di website

| | Batas |
|---|---|
Cloudflare Pages (website ini) | **25 MB per berkas** |
GitHub Releases | 2 GB per berkas |

Berkas `.exe` berukuran **115 MB**, jauh melebihi batas website. Halaman
Releases memang disediakan GitHub untuk berkas sebesar itu, **dan tidak
membebani setiap pengunjung website dengan unduhan raksasa.**

---

## Berkas yang perlu diunggah

| Berkas di komputer | Ganti nama menjadi |
|---|---|
`C:\resqbox-desktop\release\RESQ-BOX-0.0.0-portable.exe` | **`RESQ-BOX-Laptop.exe`** |
`android\app\build\outputs\apk\debug\app-debug.apk` | **`RESQ-BOX-Android.apk`** |

> **Nama berkasnya HARUS persis seperti di atas.** Tombol di website mencari
> nama itu. Bila namanya berbeda, tombolnya menghasilkan halaman "not found".

---

## Langkah mengunggah

### 1. Buka halaman Releases

```
https://github.com/zidan-cmiw/resq-box/releases
```

### 2. Klik "Draft a new release"

### 3. Pilih atau buat penanda versi

Pada kotak **"Select tag"**, ketik:

```
v1.0.0
```

Lalu klik pilihan **"Create new tag: v1.0.0 on publish"** yang muncul.

> Penanda versinya **bebas** — lihat bagian "Penanda versi yang dipakai" di
> atas. Yang penting adalah **nama berkasnya**.

### 4. Isi judul rilis

```
RESQ-BOX v1.0.0
```

### 5. Isi keterangan (bebas, contoh)

```
Aplikasi RESQ-BOX untuk menyambung ke diorama fisik ESP32.

- RESQ-BOX-Laptop.exe — untuk laptop Windows
- RESQ-BOX-Android.apk — untuk tablet/HP Android

Diperlukan karena peramban memblokir koneksi tidak terenkripsi ke
perangkat di jaringan lokal, sehingga diorama tidak dapat tersambung
langsung dari website.
```

### 6. Unggah kedua berkas

Tarik keduanya ke kotak **"Attach binaries by dropping them here or
selecting them"** di bagian bawah.

**Setelah terunggah, ganti namanya:**

- Klik nama berkas → ganti menjadi `RESQ-BOX-Laptop.exe`
- Klik nama berkas → ganti menjadi `RESQ-BOX-Android.apk`

> Ukuran 115 MB memerlukan waktu unggah beberapa menit. Tunggu sampai bilah
> kemajuannya selesai.

### 7. Pastikan TIDAK ditandai "Pre-release"

Pada bagian **"Release label"**, biarkan **None** terpilih. **Jangan** pilih
**Pre-release**, karena akan membuat tombolnya menunjuk ke rilis yang salah.

### 8. Terbitkan

Klik **"Publish release"**.

### 9. Uji tombolnya

Buka `https://resq-box.pages.dev`, lalu klik kedua tombol unduh. Keduanya
harus langsung mengunduh berkasnya.

---

## Bila ada versi baru nanti

```powershell
# 1. Bangun web (dipakai website, APK, dan .exe sekaligus)
npm run build

# 2. Bangun .exe
npm run desktop:build

# 3. Bangun APK
cd android
$env:JAVA_HOME = 'C:\Program Files\Android\Android Studio\jbr'
.\gradlew.bat assembleDebug
cd ..
```

Lalu **buat rilis baru** dengan penanda versi berikutnya dan unggah kedua
berkas dengan **nama yang sama**. **Kode website tidak perlu diubah.**

---

## Mengapa aplikasi terpisah memang diperlukan

Ini bukan sekadar kemasan. Peramban **memblokir** koneksi `ws://` (tidak
terenkripsi) dari halaman yang disajikan lewat HTTPS. Website memakai HTTPS,
sedangkan diorama ESP32 memakai `ws://192.168.4.1:81` — karena itu
sambungannya **diblokir sebelum dicoba**.

Aplikasi desktop dan Android menyajikan halaman yang sama dari
`http://127.0.0.1`, yang oleh peramban dianggap konteks aman — sehingga
`ws://` ke perangkat di jaringan lokal **diizinkan**.

Keterangan ini juga dituliskan di halaman masuk, supaya tidak ada yang
mengira aplikasi hanya sekadar kemasan.
