# 🔌 Referensi Blok ↔ Hardware — RESQ-BOX

Pemetaan antara blok Blockly yang dilihat siswa, API sandbox yang dijalankan,
dan komponen fisik pada diorama ESP32.

Dokumen ini penting karena **19 blok didaftarkan di kode tetapi tidak muncul di
toolbox** sehingga siswa tidak bisa memakainya. Sebelumnya tidak ada catatan
apa pun tentang hal ini.

---

## 1. Hardware yang terpasang

Sumber: `program_esp/program_esp.ino` dan `yom/yom.ino` (pin identik).

| Komponen | GPIO | Catatan |
|---|---|---|
Buzzer (sirine) | 25 | |
Kipas kabut / mist | 26 | |
LED RGB — R / G / B | 27 / 32 / 33 | **Common Anode (Active LOW)** |
LED Merah (bahaya) | 14 | |
Motor getar | 19 (AIN1), 18 (AIN2) | driver H-bridge |
OLED 128×64 | I²C (0x3C) | |
DFPlayer (audio) | RX 16, TX 17 | |
WebSocket | port 81 | SSID `DIORAMA_ESP32` |

### ⚠️ TIDAK ada sensor

Diputuskan oleh pemilik proyek: **diorama tidak memakai sensor apa pun.**
Konsekuensinya:

- Firmware tidak memanggil `analogRead` sama sekali.
- Firmware **tidak pernah** mengirim baris `SENSOR:...`.
- Karena itu parser `SENSOR:` di `src/app/Workspace/index.tsx` **sudah dihapus**
  (sebelumnya ada, tetapi merupakan jalur mati).
- Blok `Tombol D2` dan `Tombol D3` **selalu bernilai `false`** saat dijalankan.
  Blok tetap boleh dipakai untuk melatih pola percabangan, tetapi **jangan
  dijadikan dasar penilaian otomatis**.

Bila kelak sensor ditambahkan, firmware cukup memancarkan baris berikut dan
menghidupkan kembali parser di `handleHardwareLine`:

```
SENSOR:A1:750     getaran, 0–1023   (analog)
SENSOR:A2:600     suhu, 0–1023      (analog)
SENSOR:D2:1       tombol 1          (digital)
SENSOR:D3:0       tombol 2          (digital)
```

Pin input yang masih bebas pada ESP32: **34, 35, 36, 39** (hanya masukan).

---

## 2. Blok yang muncul di toolbox (23 blok)

Dikelompokkan menjadi 6 kategori: **Sistem**, **Simulasi Bencana**,
**Peringatan & EWS**, **Aksi & Evakuasi**, **Kondisi Bencana**, dan
**Pengambilan Keputusan**.

Seluruh blok di toolbox **memiliki generator** dan **seluruh API yang
dipanggilnya tersedia** di sandbox. Tidak ada blok yang menghasilkan kode error.

---

## 3. Blok tersembunyi (17 blok)

Didaftarkan di `src/engine/blockly/blocks/core.ts` dan punya generator, tetapi
tidak ada di toolbox sehingga **tidak dapat dipakai siswa**.

| Blok | Fungsi | Perlu hardware? | Status |
|---|---|---|---|
`resq_led` | Nyalakan LED pada pin | LED | ⚠️ hardware ada, blok tersembunyi |
`resq_led_kedip` | Kedipkan LED | LED | ⚠️ hardware ada, blok tersembunyi |
`resq_semua_led_mati` | Matikan semua LED | LED | ⚠️ hardware ada, blok tersembunyi |
`resq_buzzer` | Bunyikan buzzer | Buzzer | ⚠️ hardware ada, blok tersembunyi |
`resq_buzzer_nada` | Buzzer dengan nada | Buzzer | ⚠️ hardware ada, blok tersembunyi |
`resq_buzzer_stop` | Hentikan buzzer | Buzzer | ⚠️ hardware ada, blok tersembunyi |
`resq_mist` | Nyalakan kipas kabut | Mist | ⚠️ hardware ada, blok tersembunyi |
`resq_motor_getar` | Getarkan motor | Motor | ⚠️ hardware ada, blok tersembunyi |
`resq_audio` | Putar / hentikan audio | DFPlayer | ⚠️ hardware ada, blok tersembunyi |
`resq_stopall` | Hentikan semua aktuator | — | ✅ layak ditampilkan |
`resq_tampil` | Tampilkan nilai di layar | OLED | ✅ layak ditampilkan |
`resq_tombol_1` | Tombol D2 ditekan? | **Tombol** | ❌ tidak ada tombol |
`resq_tombol_2` | Tombol D3 ditekan? | **Tombol** | ❌ tidak ada tombol |
`resq_motor` | Motor biasa | Motor | ❌ **stub** — hanya `api.print`, tidak menggerakkan apa pun |
`resq_servo` | Servo | **Servo** | ❌ tidak ada servo di firmware |
`resq_hitung` | Operasi hitung | — | ✅ blok matematika, layak ditampilkan |
`resq_bukan` | Negasi logika | — | ✅ blok logika, layak ditampilkan |

### Rekomendasi

**Tampilkan (10 blok)** — hardware tersedia atau murni logika:
`resq_led`, `resq_led_kedip`, `resq_semua_led_mati`, `resq_buzzer`,
`resq_buzzer_nada`, `resq_buzzer_stop`, `resq_mist`, `resq_motor_getar`,
`resq_audio`, `resq_stopall`, `resq_tampil`, `resq_hitung`, `resq_bukan`.

**Jangan tampilkan (4 blok)**:
- `resq_tombol_1`, `resq_tombol_2` — tidak ada tombol pada diorama.
- `resq_servo` — tidak ada servo pada firmware.
- `resq_motor` — **stub**: hanya mencetak teks, tidak menggerakkan motor.
  Ini menyesatkan bila ditampilkan; sebaiknya diperbaiki lebih dulu agar
  memanggil `api.setMotor` seperti `resq_motor_getar`.

> Keputusan akhir ada pada pemilik proyek, karena menyangkut alur kurikulum.
> Dokumen ini mencatat keadaan sebenarnya agar keputusannya berbasis fakta.

---

## 4. Cara memverifikasi ulang

Setelah mengubah toolbox atau menambah blok, jalankan pemeriksaan berikut
untuk memastikan tidak ada blok yang putus:

```bash
# 1. Blok yang didaftarkan vs yang ada di toolbox
python scripts/check_blocks.py

# 2. Pastikan seluruh API yang dipanggil generator benar-benar tersedia
grep -o "api\.[a-zA-Z]*" src/engine/blockly/jsGenerator.ts | sort -u

# 3. Verifikasi menyeluruh
npm run typecheck && npm run test && npm run build
```
