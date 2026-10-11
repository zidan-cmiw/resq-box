# Membangun Aplikasi Android RESQ-BOX

Panduan ini menjelaskan cara mengubah RESQ-BOX Web menjadi berkas **`.apk`**
yang dapat dipasang di tablet murid.

---

## Mengapa aplikasi Android, bukan `.exe`

Gejala yang dilaporkan:

> "Aku sudah ke Level 3, buka workspace-nya, lalu sambungkan ke WiFi ESP32.
> Setelah tersambung, aku tekan tombol Diorama WiFi, tapi tidak bisa nyambung."

**Penyebabnya bukan WiFi.** Penyebabnya campuran HTTP dan HTTPS:

| | |
|---|---|
| Web dibuka dari | `https://resq-box.pages.dev` — **HTTPS** |
| ESP32 memakai | `ws://192.168.4.1:81` — **HTTP biasa** |

Peramban **memblokir** campuran itu. Namanya **mixed content**, dan diblokir
**sebelum** koneksi dicoba. Karena itu hasilnya selalu gagal, walaupun WiFi
ESP32 sudah tersambung dengan benar.

`.exe` **tidak menyelesaikannya**, karena murid memakai tablet — dan tablet
tidak dapat menjalankan berkas Windows.

**Aplikasi Android menyelesaikannya** karena web disajikan dari dalam tablet
(`https://localhost`), dan Capacitor diatur untuk mengizinkan `ws://` lewat
`allowMixedContent`. Pengaturannya ada di `capacitor.config.ts`.

---

## Yang perlu dipasang lebih dulu

Membangun APK memerlukan **Android Studio**. Sekali pasang, sekitar 1–2 GB.

1. Unduh **Android Studio** dari <https://developer.android.com/studio>
2. Pasang dengan pilihan bawaan (biarkan semua kotak tercentang)
3. Jalankan sekali, biarkan ia mengunduh **Android SDK** sampai selesai
4. Setelah selesai, tutup Android Studio

> Android Studio sudah membawa JDK-nya sendiri, jadi **tidak perlu** memasang
> Java secara terpisah.

---

## Cara membangun APK

### Cara 1 — Baris perintah (paling cepat)

Buka PowerShell di folder proyek, lalu:

```powershell
# 1. Bangun web + salin ke proyek Android
npm run android:sync

# 2. Buka proyek Android di Android Studio
npm run android:open
```

Di Android Studio:

1. Tunggu **Gradle sync** selesai (biasanya 1–3 menit pada pertama kali;
   Android Studio akan mengunduh Gradle dan komponen SDK)
2. Menu **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
3. Setelah selesai, klik **locate** pada pemberitahuan yang muncul

APK-nya ada di:

```
android/app/build/outputs/apk/debug/app-debug.apk
```

### Cara 2 — Langsung dari Android Studio

1. Buka Android Studio → **Open** → pilih folder `android/` di dalam proyek
2. Tunggu Gradle sync
3. **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**

---

## Memasang APK ke tablet

1. Salin `app-debug.apk` ke tablet (kabel USB, Google Drive, atau WhatsApp ke
   diri sendiri)
2. Di tablet: **Pengaturan** → **Keamanan** → izinkan
   **"Instal dari sumber tidak dikenal"**
3. Buka berkas APK → **Instal**
4. Ikon **RESQ-BOX** akan muncul di layar utama

**APK `debug`** sudah cukup untuk dipakai di kelas dan untuk lomba. Untuk
menerbitkannya ke Play Store, diperlukan APK `release` yang ditandatangani —
lihat bagian di bawah.

---

## Cara memakai di kelas

Sekarang aplikasinya ada **di dalam tablet**, jadi masalah internet hilang:

| Langkah | Tablet | Keterangan |
|---|---|---|
| **1** | Tersambung **WiFi sekolah** | Buka aplikasi, **masuk**, buka Level 1–3 sekali |
| **2** | Pindah ke **WiFi ESP32** | Main + tekan **Diorama WiFi** → `192.168.4.1` |
| **3** | Kembali ke **WiFi sekolah** | Nilai terkirim ke server |

**Kenapa langkah 1 perlu?** Karena `Diorama WiFi` memerlukan `ws://`, dan itu
baru diizinkan di dalam aplikasi. Internet tetap tersedia di langkah 1 dan 3,
sehingga nilai dapat dikirim ke database guru.

---

## Kalau `Diorama WiFi` masih gagal

### 1. Periksa lewat chrome://inspect

Karena `webContentsDebuggingEnabled: true` sudah dinyalakan:

1. Sambungkan tablet ke komputer dengan kabel USB
2. Di komputer buka Chrome → ketik `chrome://inspect`
3. Pilih aplikasi RESQ-BOX → **Inspect**
4. Lihat tab **Console** saat menekan **Diorama WiFi**

Bila masih muncul pesan **Mixed Content**, berarti pengaturannya belum
terbaca. Periksa bahwa `android/app/src/main/assets/capacitor.config.json`
memuat `"allowMixedContent": true`.

### 2. Pastikan alamatnya benar

Alamat bawaan ESP32 adalah **`192.168.4.1`**. Bila kamu pernah mengubahnya,
sesuaikan. Bisa dipastikan dari pengaturan WiFi tablet: lihat **Gateway**
pada jaringan `DIORAMA_ESP32`.

### 3. Pastikan tablet benar-benar tersambung ke `DIORAMA_ESP32`

Buka pengaturan WiFi tablet. Bila tertulis *"Tidak ada internet"*, itu
**normal** — WiFi Board memang tidak punya internet. Yang penting statusnya
**Tersambung**.

### 4. Bila tetap gagal — ubah skema menjadi http

Di `capacitor.config.ts`, ubah:

```ts
server: {
  androidScheme: 'http',   // dari 'https'
},
```

lalu jalankan `npm run android:sync` dan bangun ulang APK.

Dengan `http`, campuran tidak lagi terjadi karena halamannya sendiri sudah
HTTP. **Kelemahannya:** service worker dan beberapa fitur web modern
memerlukan konteks aman, sehingga **mode luring bisa berhenti bekerja**.
Karena itu cara ini dijadikan pilihan terakhir.

---

## APK rilis (hanya bila ingin diterbitkan)

APK `debug` **tidak boleh** diunggah ke Play Store. Untuk itu perlu
ditandatangani:

```powershell
cd android
./gradlew bundleRelease     # menghasilkan .aab untuk Play Store
./gradlew assembleRelease   # menghasilkan .apk rilis
```

Sebelum itu, buat kunci penanda tangan:

```powershell
keytool -genkey -v -keystore resqbox-release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias resqbox
```

> **⚠️ PENTING:** berkas `.jks` adalah kunci aplikasimu. **Jangan pernah**
> memasukkannya ke git. `.gitignore` sudah menutupnya (`*.jks`,
> `*.keystore`). Simpan cadangannya di tempat aman — bila hilang, kamu tidak
> dapat menerbitkan pembaruan atas nama aplikasi yang sama lagi.

---

## Berkas mana yang disimpan di git

| Disimpan ✅ | Tidak disimpan ❌ |
|---|---|
`android/app/src/` (kode & sumber daya) | `android/app/build/` (hasil bangun) |
`android/*.gradle`, `gradle.properties` | `android/.gradle/` |
`android/gradle/wrapper/` | `android/local.properties` |
 | `android/app/src/main/assets/public/` (salinan web) |
 | `*.jks`, `*.keystore`, `*.apk`, `*.aab` |

Salinan web di `assets/public/` **tidak** disimpan karena dihasilkan ulang
oleh `npm run android:sync` dari folder `dist/`.
