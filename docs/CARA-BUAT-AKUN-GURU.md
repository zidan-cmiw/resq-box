# Cara Membuat Akun Guru Baru

Panduan ini untuk **guru baru** — baik di sekolah yang sama maupun di **sekolah lain**
yang mulai memakai RESQ-BOX.

Ada **dua cara**. Pilih salah satu.

| | Cara | Butuh kunci rahasia? | Kesulitan |
|---|---|---|---|
**A** | Skrip `kelola_akun_guru.py` | ✅ ya (`service_role`) | ⭐ mudah, 1 perintah |
**B** | Dashboard Supabase + SQL | ❌ tidak | ⭐⭐ perlu 2 langkah |

> **Disarankan Cara A** — lebih sedikit langkah, dan **langsung memeriksa hasilnya**.
> Kalau kunci `service_role` tidak tersedia, pakai **Cara B**.

---

# Kenapa tidak ada tombol "Tambah Guru" di aplikasi

Ini **disengaja**, bukan kekurangan.

Pendaftaran mandiri sudah **ditutup total** di server:

```
POST /auth/v1/signup  ->  HTTP 422
{"error_code":"signup_disabled"}
```

Artinya **tidak seorang pun bisa membuat akun sendiri** — baik siswa maupun guru.

Guru hanya bisa membuat akun **SISWA**, dan hanya untuk **kelasnya sendiri**.
Tidak ada jalur bagi guru untuk membuat akun guru lain — itu memang pembatasan
yang benar. Kalau ada, satu guru dapat membuat akun guru palsu untuk mengintip
kelas guru lain.

---

# Cara A — Pakai skrip (disarankan)

## Langkah 1 — Ambil kunci `service_role`

Buka **Supabase Dashboard → Settings → API → Project API keys**.

Di sana ada **dua** kunci. **Jangan sampai tertukar:**

| Nama | Untuk apa |
|---|---|
`anon` `public` | ❌ **bukan ini** — sudah ada di `.env`, tidak bisa membuat akun |
`service_role` `secret` | ✅ **ini yang dipakai** |

Kunci `service_role` biasanya **disembunyikan** — klik **Reveal** dulu, lalu **Copy**.

> ### ⚠️ Kunci ini sangat berbahaya
>
> `service_role` **MENEMBUS SELURUH RLS**. Siapa pun yang memilikinya bisa
> **membaca dan mengubah data SEMUA guru dan SEMUA murid**.
>
> - ✅ Boleh: tempel ke terminal di komputermu sendiri
> - ❌ Jangan: simpan di file, kirim lewat chat, atau tempel ke percakapan AI
>
> **Aplikasi RESQ-BOX tidak butuh kunci ini.** Aplikasi memakai `anon`, dan itu
> sudah benar. Kunci ini hanya untuk membuat akun.
>
> **Kalau terlanjur terkirim ke mana pun:** putar ulang di
> **Settings → API → Roll `service_role` key**.

## Langkah 2 — Buka terminal di folder proyek

```powershell
cd "C:\github\lidm buatan vincent\RESQ-BOX"
```

## Langkah 3 — Simpan kunci (berlaku di terminal itu saja)

**PowerShell:**
```powershell
$env:SUPABASE_SERVICE_ROLE_KEY = "TEMPEL_KUNCI_DI_SINI"
```

**CMD:**
```cmd
set SUPABASE_SERVICE_ROLE_KEY=TEMPEL_KUNCI_DI_SINI
```

Kunci ini **hilang sendiri** begitu terminal ditutup. **Tidak tersimpan ke file.**

## Langkah 4 — Buat akunnya

```powershell
python scripts/kelola_akun_guru.py buat <username> "<Nama>" "<Sekolah>"
```

**Contoh:**
```powershell
python scripts/kelola_akun_guru.py buat budi "Pak Budi" "SMP Negeri 2"
```

| Bagian | Aturan | Contoh |
|---|---|---|
`<username>` | huruf kecil, angka, titik, `_`, `-` (3–30 karakter) | `budi`, `buatya`, `pak_hendra` |
`<Nama>` | nama tampilan, pakai tanda kutip | `"Pak Budi"` |
`<Sekolah>` | nama sekolah, pakai tanda kutip | `"SMPN 3 Malang"` |

## Yang akan muncul di layar

```
  Membuat akun guru: budi
      email  : budi@resqbox.local
      nama   : Pak Budi
      sekolah: SMP Negeri 2

  [v] Akun dibuat. id = 8f3a...

  ┌─────────────────────────────────────────────────────────────┐
  │  KATA SANDI AWAL — CATAT SEKARANG, TIDAK AKAN DITAMPILKAN   │
  └─────────────────────────────────────────────────────────────┘

      username : budi
      password : xK9mPq2vLw4n

      Sampaikan ke guru, dan minta ia MENGGANTI kata sandi
      setelah masuk pertama kali.

  ── Memeriksa akun budi ──
      id            : 8f3a...
      terkonfirmasi : ya
      app_metadata.role     : teacher
      app_metadata.username : budi
      profiles.role : teacher

  HASIL: akun budi SIAP dipakai sebagai guru
```

### 🔴 Kata sandinya muncul SEKALI SAJA

Skrip **tidak menyimpannya** dan **tidak bisa menampilkannya lagi**.
**Copy sekarang** sebelum terminal ditutup.

Kalau kelewat, lakukan **Reset Kata Sandi** (lihat bagian di bawah).

## Langkah 5 — Sampaikan ke guru

| Yang disampaikan | Contoh |
|---|---|
**Username** | `budi` |
**Kata sandi awal** | `xK9mPq2vLw4n` |
**Cara masuk** | Buka aplikasi, ketik **username**-nya saja |

> **Guru masuk memakai USERNAME, bukan email.** Aplikasi menambahkan
> `@resqbox.local` di belakangnya secara otomatis.

---

# Cara B — Lewat Dashboard (tanpa kunci rahasia)

Cara ini tidak memerlukan `service_role` sama sekali.

## Langkah 1 — Buat penggunanya

**Authentication → Users → Add user**

| Kolom | Isi |
|---|---|
**Email** | `<username>@resqbox.local` — misal `budi@resqbox.local` |
**Password** | kata sandi guru |
**Auto Confirm User** | ✅ **NYALA** — wajib, karena tidak ada verifikasi email |
**User Metadata** | `{"name": "Pak Budi", "username": "budi", "school_name": "SMP Negeri 2"}` |

Klik **Create user**.

> **Perhatikan: hanya ada SATU kolom metadata**, yaitu **User Metadata**.
> Dashboard Supabase versi sekarang **tidak menyediakan** kolom "App Metadata".
> Itu **tidak masalah** — perannya dipasang di Langkah 2.

## Langkah 2 — Pasang perannya (SQL Editor)

**Kenapa perlu langkah ini?** Trigger pembuat profil membaca peran dari
**`app_metadata`**, bukan `user_metadata`:

```sql
v_role := CASE
  WHEN COALESCE(NEW.raw_app_meta_data ->> 'role', '') IN ('teacher','admin')
  THEN NEW.raw_app_meta_data ->> 'role'
  ELSE 'student'          -- kalau tidak ada app_metadata, jatuh ke sini
END;
```

Jadi tanpa Langkah 2, guru itu akan menjadi **siswa**.

Buka **SQL Editor**, tempel ini (**ganti `budi` dengan username kamu**), lalu **Run**:

```sql
-- 1. Pasang peran di app_metadata — ini yang menentukan peran saat login
UPDATE auth.users
   SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb)
       || jsonb_build_object('role', 'teacher', 'username', 'budi')
 WHERE email = 'budi@resqbox.local';

-- 2. Samakan peran di profil — ini yang dipakai pemeriksaan RLS
UPDATE public.profiles
   SET role = 'teacher'
 WHERE username = 'budi';
```

## Langkah 3 — Guru HARUS masuk ulang

Peran diambil dari `app_metadata` **saat token dibuat**. Token yang lama masih
membawa peran lama, jadi guru itu **wajib keluar lalu masuk lagi**.

## Langkah 4 — Periksa hasilnya

```powershell
python scripts/kelola_akun_guru.py periksa budi
```

> Perintah `periksa` **hanya membaca** — tidak mengubah apa pun. Tetap butuh
> kunci `service_role` untuk membaca daftar pengguna.

---

# Perintah lain yang berguna

```powershell
# Lihat semua akun guru yang sudah ada
python scripts/kelola_akun_guru.py daftar

# Periksa satu akun: perannya benar? sudah dikonfirmasi?
python scripts/kelola_akun_guru.py periksa budi
```

`periksa` dan `daftar` **tidak mengubah apa pun**.

---

# Setelah akun guru jadi

Guru itu **membuat kelasnya sendiri di dalam aplikasi**:

1. Masuk sebagai guru
2. Klik **+ BUAT KELAS BARU**
3. Isi nama kelas → Simpan → **kode kelas muncul** (mis. `RESQ-KELA483920`)
4. Buka **EDIT KELAS → + TAMBAH SISWA** → buatkan akun untuk murid-muridnya

**Kamu tidak perlu mengatur kelas dari Dashboard.** Setiap guru mengurus
kelasnya sendiri.

## Untuk sekolah baru

Cukup buat **satu akun guru** untuk sekolah itu. Guru tersebut lalu membuat
kelasnya dan akun murid-muridnya sendiri.

**Tidak perlu akun admin terpisah per sekolah** — setiap guru sudah otomatis
terisolasi. Guru A **tidak dapat** melihat data guru B (dijaga RLS + fungsi RPC,
diperiksa otomatis oleh `scripts/periksa_izin_guru.py`).

---

# Kalau ada masalah

## ❌ `GAGAL MEMERIKSA (HTTP 401)` atau `(HTTP 403)`

**Kuncinya salah** — kemungkinan besar kamu menempel kunci **`anon`**, bukan
`service_role`. Ulangi Langkah 1 Cara A.

Pesan `not_admin` / `Invalid API key` berarti persis itu.

> **Catatan:** versi skrip yang lama akan salah melaporkan **"Akun TIDAK
> DITEMUKAN"** dalam keadaan ini — padahal akunnya belum tentu tidak ada. Sudah
> diperbaiki; sekarang dikatakan terus terang bahwa **pemeriksaannya** yang gagal.

## ❌ `A user with this email address has already been registered`

Username itu **sudah dipakai**. Pilih username lain, atau lihat yang sudah ada:
```powershell
python scripts/kelola_akun_guru.py daftar
```

## ❌ `PERAN SALAH: 'student' seharusnya 'teacher'`

Akunnya dibuat tanpa `app_metadata`. Perbaiki dengan **SQL Editor**:

```sql
UPDATE auth.users
   SET raw_app_meta_data = COALESCE(raw_app_meta_data,'{}'::jsonb)
       || jsonb_build_object('role','teacher','username','budi')
 WHERE email = 'budi@resqbox.local';
UPDATE public.profiles SET role='teacher' WHERE username='budi';
```

Lalu guru itu **masuk ulang**.

## ❌ `BELUM TERKONFIRMASI. Guru tidak akan dapat masuk.`

Di Dashboard, buka pengguna itu dan pilih **Confirm email**.

## ❌ `SUPABASE_SERVICE_ROLE_KEY` tidak terbaca

Kamu menutup terminal lalu membuka yang baru. **Ulangi Langkah 3.**

## ❌ Kata sandi hilang / kelewat

**Guru tidak punya menu "ganti kata sandi" di aplikasi** (menu itu hanya ada di
Profil Siswa). Jadi reset dilakukan dari Dashboard:

**Authentication → Users → cari `budi@resqbox.local` → pilih pengguna →
Reset Password** (atau **Send recovery**).

Bila menu itu tidak tersedia untuk pengguna email sintetis, **hapus akunnya**
lalu buat ulang dengan username yang sama:

```powershell
python scripts/kelola_akun_guru.py buat budi "Pak Budi" "SMP Negeri 2"
```

## ❌ Kunci `service_role` tidak ditemukan

Pakai **Cara B** — tidak butuh kunci sama sekali.

---

# Kapan perlu membangun ulang APK & `.exe`

**Membuat akun guru TIDAK memerlukan pembangunan ulang apa pun.** Akun guru
adalah data di server, bukan kode di aplikasi.

| Yang kamu ubah | Perlu rebuild APK & `.exe`? |
|---|---|
Buat akun guru | ❌ **tidak** |
Jalankan migrasi SQL | ❌ **tidak** |
Ubah kode di `src/` | ✅ **ya** |

Untuk memeriksa apakah APK & `.exe` masih terbaru:

```powershell
python scripts/periksa_kesegaran_apk_exe.py
```

---

# Ringkasan cepat

```powershell
# 1. Buka terminal
cd "C:\github\lidm buatan vincent\RESQ-BOX"

# 2. Simpan kunci service_role (sekali per terminal)
$env:SUPABASE_SERVICE_ROLE_KEY = "TEMPEL_KUNCI"

# 3. Buat akun
python scripts/kelola_akun_guru.py buat budi "Pak Budi" "SMP Negeri 2"

# 4. CATAT KATA SANDINYA — hanya muncul sekali

# 5. Sampaikan username + kata sandi awal ke guru
```

**Terkait:** [KEAMANAN-AKUN-GURU.md](KEAMANAN-AKUN-GURU.md) — penjelasan
bagaimana data guru A dijaga agar tidak terlihat guru B.
