# 🔐 RESQ-BOX — Panduan Pengerasan Keamanan Backend

Dokumen ini menjelaskan **apa yang berubah**, **kenapa**, dan **langkah pasangnya**
supaya backend RESQ-BOX (Supabase) aman dari segala sisi: akun, relasi data,
nilai, dan kuota pemanggilan.

> **Ringkas:** dulu keamanan bergantung pada kode di browser (bisa diakali
> siapa pun lewat DevTools). Sekarang keamanan ditegakkan oleh **database**
> (RLS) dan **layanan autentikasi** (Supabase Auth). Browser hanya boleh
> meminta; server yang memutuskan.

---

## 1. Masalah yang diperbaiki

| # | Sebelum | Dampak | Sekarang |
|---|---|---|---|
| 1 | 11 fungsi RPC `SECURITY DEFINER` di-`GRANT` ke `anon` **tanpa cek otorisasi** | Siapa pun yang punya anon key (selalu ada di bundle) bisa **menghapus seluruh kelas & siswa**, membuat akun guru palsu, memalsukan nilai | Semua RPC punya cek `auth.uid()` + peran + kepemilikan kelas; RPC lama **dihapus** |
| 2 | Policy RLS `USING (true)` | `anon` bisa `SELECT *` seluruh `user_accounts` termasuk **hash bcrypt**, dan `students` termasuk password | Policy diganti per-pemilik; akses langsung ke tabel lama **dicabut total** |
| 3 | Peran disimpan di localStorage | Ubah `role:"teacher"` di DevTools → masuk Posko Guru | Peran dari `app_metadata` di JWT (hanya server bisa menulis) + divalidasi RLS |
| 4 | Password plaintext ditulis dari klien (`Profile`) | Password siswa bocor; juga gagal senyap karena RLS | Ganti password lewat `supabase.auth.updateUser()` (bcrypt di server) |
| 5 | Tabel `students.password` | Guru melihat password siswa di layar | Kolom password hilang dari view; UI tidak menampilkannya |
| 6 | Level & nilai ditentukan klien | Siswa bisa membuka Level 3 atau mengaku skor 100 | `unlocked_level` & `score` **dihitung server**; kolom sensitif dikunci trigger |
| 7 | RPC tanpa batas laju | Brute-force login & banjir permintaan | Tabel `rate_limits` + `check_rate_limit()` per aksi |
| 8 | Bug cast UUID di submission | **Semua nilai gagal tersimpan** ke cloud (senyap, karena `catch {}`) | RPC baru memakai `auth.uid()`; error dilaporkan, tidak ditelan |

---

## 2. Arsitektur keamanan baru

```
Browser (React)
  │  hanya memegang: anon key (memang publik) + access token JWT milik sendiri
  │
  ├─ Supabase Auth ──► auth.users            (password: bcrypt, dikelola server)
  │                       │ trigger
  │                       ▼
  │                    profiles  ← identitas + peran + kelas + level
  │
  └─ PostgREST / RPC ──► RLS memfilter setiap baris berdasarkan auth.uid()
                             │
                             ├─ profiles          : hanya milik sendiri / kelas yang diampu
                             ├─ classrooms        : hanya kelas sendiri
                             ├─ level_submissions : hanya milik sendiri (guru: kelasnya)
                             └─ user_accounts     : TIDAK ADA akses dari klien
```

**Aturan emas yang kini berlaku di database:**

- **User #1 hanya bisa melihat & mengubah barisnya sendiri.** Ditegakkan oleh
  policy `profiles_select_owner` / `profiles_update_owner` yang memakai
  `auth.uid()`. User #2 **tidak bisa** membaca baris User #1 meski tahu UUID-nya.
- **Guru** hanya melihat siswa di kelas yang dia ampu
  (`can_read_student()` mencocokkan `classrooms.teacher_username`).
- **Admin** (`profiles.is_admin`) melihat lebih luas. Hanya bisa diberikan lewat
  `admin_promote_to_admin()` yang **tidak dapat dipanggil dari browser**.
- **Kolom sensitif dikunci trigger** `guard_profile_privileges`:
  `role`, `is_admin`, `classroom_code`, `username`, `unlocked_level` diabaikan
  bila klien mencoba mengubahnya.

---

## 3. Langkah pemasangan (urutan wajib)

Semua dijalankan di **Supabase Dashboard → SQL Editor → New query**.
Tidak butuh Supabase CLI, tidak butuh service key.

### Langkah 1 — Jalankan migrasi

| Urutan | Berkas | Isi |
|---|---|---|
| 1 | `supabase/migrations/01_secure_schema.sql` | Tabel `profiles`/`classrooms`/`level_submissions`, RLS ketat, view `students` yang aman, penutupan tabel lama, indeks |
| 2 | `supabase/migrations/02_rpc_and_hardening.sql` | Hapus 11 RPC berbahaya, RPC baru ber-otorisasi, batas laju, hardening hak akses |
| 3 | `supabase/migrations/03_signup_role_control.sql` | Kontrol peran saat signup, RPC guru membuat akun siswa, fungsi admin, kelas awal |
| 4 | `supabase/migrations/04_lock_functions_and_cleanup.sql` | Kunci hak eksekusi seluruh fungsi sensitif |
| 5 | `supabase/migrations/05_realtime_publication.sql` | Nyalakan Realtime untuk tabel yang perlu |
| 6 | `supabase/migrations/06_fix_profile_trigger.sql` | Perbaiki trigger pembuatan profil (tiga sumber metadata) |
| 7 | `supabase/migrations/07_fix_rls_helper_grants.sql` | Perbaiki hak eksekusi fungsi bantu RLS |
| — | ~~`08_nisn_dan_tutup_pendaftaran.sql`~~ | **JANGAN DIJALANKAN.** Sudah digantikan oleh 09. Lihat catatan di bawah |
| 8 | `supabase/migrations/09_absen_unik_per_kelas.sql` | Pengenal unik siswa = **kode kelas + nomor absen**; hapus kolom `nisn` bila ada; kembalikan RPC guru ke 5 argumen; **perbaiki 3 fungsi yang masih membaca `nisn`** |

> ### ⚠️ PELAJARAN PENTING DARI MIGRASI 08 → 09
>
> Versi pertama migrasi 09 **membuang kolom `nisn` tanpa memperbarui fungsi
> yang membacanya**. Akibatnya di database produksi:
>
> ```
> ERROR 42703: record "v" has no field "nisn"
> ```
>
> Karena `get_my_profile` dipanggil **setiap kali login**, seluruh pengguna
> gagal masuk dengan pesan **"Profil tidak ditemukan"** — padahal akun dan
> profilnya ada. Pesan itu menyesatkan, dan penyebab sebenarnya baru ketahuan
> setelah fungsinya diuji langsung.
>
> **Aturan yang harus dipatuhi: setiap kali sebuah kolom dibuang, periksa
> SELURUH fungsi yang membacanya.** Caranya:
>
> ```sql
> SELECT p.proname
>   FROM pg_proc p
>   JOIN pg_namespace n ON n.oid = p.pronamespace
>  WHERE n.nspname = 'public'
>    AND pg_get_functiondef(p.oid) ILIKE '%nisn%';
> ```
>
> Hasilnya harus **kosong**. Pemeriksa otomatisnya ada di repositori:
> `npm run cek:kolom` — ia membandingkan seluruh migrasi sebagai satu
> rangkaian dan gagal bila ada fungsi yang membaca kolom yang sudah dibuang.

Jalankan **berurutan**. Setiap berkas idempoten (aman diulang).
Setelah langkah 3, periksa bagian **"5. VERIFIKASI"** di dalam berkas itu.

> ⚠️ **Bila login sudah terlanjur gagal dengan "Profil tidak ditemukan"**,
> jalankan `supabase/perbaiki_kolom_nisn.sql` di SQL Editor. Berkas itu
> mendefinisikan ulang ketiga fungsi yang rusak. Untuk memastikan
> penyebabnya, jalankan lebih dulu:
>
> ```
> npm run diagnosa:akun guru <sandi-guru>
> ```
>
> Skrip itu menirukan seluruh urutan login dan menunjuk **langkah mana** yang
> gagal, beserta kode galat dari server.

> ⚠️ **Migrasi 08 JANGAN dijalankan.** Berkas itu memakai NISN sebagai pengenal
> unik, dan cara itu sudah ditinggalkan karena terlalu merepotkan. Penggantinya
> adalah migrasi 09, yang memakai pasangan kode kelas + nomor absen.
>
> - Bila 08 **belum pernah** dijalankan: lewati saja, langsung ke 09.
> - Bila 08 **sudah terlanjur** dijalankan: jalankan 09 setelahnya. Migrasi 09
>   sudah dirancang aman untuk kedua keadaan — kolom `nisn` dibuang bila ada,
>   dan dilewati tanpa galat bila tidak ada.
>
> Berkas 08 sengaja tidak dihapus agar riwayat migrasi tetap runut (nomor 09
> tanpa 08 akan membingungkan). Isinya kini hanya catatan.

> ⚠️ **Menutup pendaftaran mandiri TIDAK bisa dilakukan lewat SQL.** Endpoint
> pendaftaran berjalan di luar PostgreSQL, sehingga tidak ada trigger yang
> dapat memblokirnya. Matikan di dashboard:
> **Authentication → Sign In / Providers → Email → matikan "Allow new users to
> sign up"**. Tanpa langkah ini, siswa masih dapat mendaftar lewat API
> walaupun tombolnya sudah dihapus dari tampilan.
>
> Hal ini penting karena pengenal unik siswa sekarang adalah kode kelas +
> nomor absen. Kalau pendaftaran mandiri dibuka kembali, siswa dapat memilih
> nomor absen yang berbeda-beda sehingga aturan itu tidak lagi menghalanginya
> membuat banyak akun.

> ⚠️ **Periksa dulu sebelum menjalankan migrasi 09.** Migrasi itu memasang index
> unik pada (kode kelas + nomor absen) untuk siswa. Bila di database sudah ada
> nomor absen kembar di kelas yang sama, **index akan gagal dibuat** dan
> migrasi berhenti. Cek lebih dulu di SQL Editor:
>
> ```sql
> SELECT classroom_code, absent_number, count(*) AS jumlah,
>        string_agg(name, ', ') AS nama_siswa
>   FROM public.profiles
>  WHERE role = 'student' AND classroom_code IS NOT NULL
>  GROUP BY classroom_code, absent_number
> HAVING count(*) > 1
>  ORDER BY classroom_code, absent_number;
> ```
>
> Hasil kosong berarti aman. Bila ada isinya, ubah nomor absen salah satu siswa
> lebih dulu, misalnya:
>
> ```sql
> UPDATE public.profiles SET absent_number = '17' WHERE username = 'nama_siswa';
> ```
>
> Ini kemungkinan besar terjadi pada akun **demo**: bila akun itu dibuat tanpa
> mengisi nomor absen, kolomnya bernilai '1', dan siswa pertama yang dibuat guru
> di kelas yang sama juga bernilai '1'.

> ⚠️ **Kalau migrasi 01 berhenti dengan error
> `function public.can_read_student(character varying) does not exist`:**
> itu terjadi bila database Anda masih menyimpan view `students` lama (dari
> skema v2, yang kolom `id`-nya bertipe `varchar`). Jalankan
> **`supabase/fix_students_view.sql`** lebih dulu — skrip itu melepas objek
> lama, menampilkan diagnosis, lalu Anda jalankan ulang `01_secure_schema.sql`.
> Errornya muncul di langkah **paling akhir** migrasi 01, jadi tabel
> `profiles`, `classrooms`, `level_submissions`, RLS, trigger, dan indeks
> sudah berhasil dibuat — bukan masalah, cukup lanjutkan.

### Langkah 2 — Setelan Authentication

Buka **Authentication → Sign In / Providers → Email**. Buat keputusan:

- **Untuk kelas/lomba (disarankan):** matikan **"Confirm email"**.
  Alasannya: siswa memakai email sintetis `<username>@resqbox.local` yang
  tidak bisa menerima email, jadi kalau konfirmasi email menyala,
  **tidak ada siswa yang bisa login**. Ini bukan penurunan keamanan selama
  password tetap kuat dan akun dibuat oleh guru/admin.
- Bila konfirmasi email tetap ingin menyala, pakai email asli siswa dan
  sesuaikan `VITE_AUTH_EMAIL_DOMAIN` (lihat Langkah 5).

### Langkah 3 — Buat akun Guru

Akun guru **tidak** bisa didaftarkan sendiri (sengaja). Buat lewat
**Authentication → Users → Add user → Create new user**:

| Kolom | Nilai |
|---|---|
| Email | `guru@resqbox.local` |
| Password | (password guru yang kuat) |
| **Auto Confirm User** | ✅ aktif |
| **User Metadata (app_metadata)** | `{"role":"teacher","username":"guru","name":"Bapak Guru IPA","school_name":"SMP Negeri 1"}` |

> ⚠️ **Wajib di `app_metadata`, bukan `user_metadata`.** `app_metadata` hanya
> bisa ditulis server, sedangkan `user_metadata` bisa diisi sendiri oleh
> pemanggil `signUp()`. Kalau salah tempat, pendaftar mandiri bisa
> mengangkat dirinya jadi guru.

Profil guru akan **otomatis** dibuat oleh trigger `handle_new_auth_user`.

### Langkah 4 — Buat akun Demo untuk juri

Buat user kedua dengan `app_metadata`:

```json
{"role":"student","username":"demo","name":"Taruna Demo","classroom_code":"RESQ-8A"}
```

**WAJIB** — buka semua level untuk akun itu:

```sql
SELECT public.admin_set_unlocked_level('demo', 3);
```

Harus dijalankan, bukan opsional. Level akun demo dibaca dari kolom
`profiles.unlocked_level`, tepat seperti akun siswa lain. Bila langkah ini
terlewat, akun demo hanya terbuka sampai Level 1.

Sebelumnya level akun demo dipaksa di sisi kode (delapan tempat memeriksa
`username === 'demo'`). Paksaan itu sudah dihapus karena menampilkan
kredensial di halaman login dan membuka level tanpa dasar data. Sekarang
satu-satunya cara yang berlaku adalah perintah di atas.

Siswa lain **tidak bisa** melakukan ini — fungsinya dicabut dari `anon`
dan `authenticated`, sehingga hanya dapat dijalankan dari SQL Editor atau
`service_role`.

### Langkah 5 — Setel environment

Berkas `.env` (jangan pernah di-commit — sudah ada di `.gitignore`):

```ini
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key — memang publik, aman di browser>
# Opsional: domain email sintetis
VITE_AUTH_EMAIL_DOMAIN=resqbox.local
```

Build ulang: `npm run build`.

### Langkah 6 — Aktifkan Custom Access Token Hook (disarankan)

**Authentication → Hooks → Customize Access Token (JWT) Claims →**
pilih fungsi `public.custom_access_token_hook`.

Manfaat: `role` & `classroom_code` ikut ke dalam JWT, sehingga policy RLS tidak
perlu membaca tabel `profiles` setiap kali → query lebih cepat saat ramai.
**Tanpa hook ini semuanya tetap benar**, hanya sedikit lebih lambat
(ada fallback ke tabel `profiles`).

---

## 4. Cara memverifikasi keamanannya (buktikan, jangan percaya)

Jalankan `supabase/verify_security.sql`. Isinya membuktikan antara lain:

1. **Tidak ada policy `USING (true)`** yang tersisa.
2. **`anon` hanya bisa memanggil 3 fungsi** yang tidak membocorkan data.
3. **Semua tabel punya RLS aktif + FORCE.**
4. **Password tidak bisa dibaca siapa pun dari klien** (`SELECT` ke
   `user_accounts` sebagai `anon` → permission denied).
5. **Isolasi antar-user**: dengan menyamar sebagai dua user berbeda,
   user A tidak melihat baris user B.

Uji manual tercepat (paling meyakinkan) — buka DevTools di aplikasi yang
sudah login sebagai siswa A, lalu di Console:

```js
// Ambil klien Supabase dari bundle (kalau tidak diekspos, cukup pakai fetch)
const r = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/profiles?select=*`, {
  headers: { apikey: import.meta.env.VITE_SUPABASE_ANON_KEY }
});
console.log(await r.json());   // harus: [] atau error — BUKAN daftar semua user
```

Sebelum perbaikan, perintah itu mengembalikan **seluruh akun beserta hash
password**. Sesudahnya harus kosong/tertolak.

---

## 5. Service Role Key — apa itu & kenapa **tidak** dipakai di browser

Anda memilih "belum punya / belum tahu". Ini penjelasannya:

**Apa itu.** Supabase memberi dua kunci:

| Kunci | Sifat | Boleh di mana |
|---|---|---|
| `anon` (public) | Terbatas, tunduk pada RLS | **Boleh** di browser — memang dirancang begitu |
| `service_role` (secret) | **Melewati seluruh RLS.** Setara akses penuh database | **HANYA di server.** Tidak boleh pernah masuk bundle/browser/Git |

**Di mana mengambilnya:** Dashboard → **Settings → API** →
bagian *Project API keys* → `service_role` (bertanda `secret`).

**Aturan pakainya:**

- Jangan pernah menaruhnya di `.env` yang di-prefix `VITE_`. Variabel
  `VITE_*` **ikut ter-bundle ke browser**.
- Simpan sebagai secret di server (Vercel → Settings → Environment Variables,
  atau Supabase Edge Function secrets).
- Untungnya, **untuk pemasangan sekarang Anda tidak membutuhkannya**: semua
  operasi admin (promosi admin, set level, buat akun guru) sudah tersedia
  sebagai fungsi SQL yang Anda jalankan sendiri di SQL Editor.
- Service key baru dibutuhkan bila nanti ingin:
  - **Edge Function `migrate_legacy_accounts`** — memindahkan akun lama
    (password lama mereka tetap dipakai) ke Supabase Auth,
  - **reset password siswa oleh guru** dari Posko Guru,
  - **membuat akun guru dari dalam aplikasi**.

Kalau nanti ingin salah satu itu, bilang saja — saya buatkan Edge Function-nya
(di sanalah service key dipakai, dan tidak pernah menyentuh browser).

---

## 6. Akun lama (dari skema v2) — apa yang terjadi

Data **keadaan** (nama, kelas, absen, avatar, level) sudah dikopi ke `profiles`
oleh migrasi 01. Yang **belum** pindah adalah password, karena password lama
berada di `user_accounts` di luar Supabase Auth.

Tiga pilihan:

| Pilihan | Cara | Password siswa |
|---|---|---|
| **A. Daftar ulang (paling sederhana, disarankan)** | Siswa klik "Daftar Akun Baru" dengan username & kode kelas yang sama | Diganti baru oleh siswa |
| **B. Reset serentak** | Guru/admin membuat ulang password lewat Dashboard → Authentication → Users | Diganti guru, dibagikan ke siswa |
| **C. Migrasi otomatis (butuh service key)** | Edge Function membaca `user_accounts`, lalu `auth.admin.createUser()` dengan password lama | **Tetap sama** — siswa tidak perlu tahu |

Setelah semua akun pindah dan diverifikasi, baru jalankan pembersihan:

```sql
-- Pastikan TIDAK ada lagi yang butuh login lama sebelum menjalankan ini!
SELECT public.admin_purge_legacy_password_hashes();
```

Ini menimpa hash lama dengan `'REVOKED'` supaya tidak ada sisa kredensial
yang menganggur di tabel.

---

## 7. Kapasitas: 1.000+ pemain bersamaan

Lihat **`../capacity/README.md`** — di sana ada model kapasitas berparameter
(bukan satu angka mati), tabel skenario E = 10 … 1.000 dengan pengali ×10–×1000,
daftar **apa yang jebol lebih dulu** di tiap tingkatan, dan mitigasinya.
Ada juga **`../capacity/loadtest.js`** yang bisa Anda jalankan sendiri
(`RESQ_DRY_RUN=1 node capacity/loadtest.js` untuk mencoba tanpa trafik) dan
**`../capacity/assets.md`** untuk strategi aset/bandwidth.

Yang sudah dikerjakan di sisi backend:

- **Satu baris per (siswa, level)** — bukan lagi `INSERT` murni per peristiwa,
  jadi `level_submissions` berhenti tumbuh tanpa batas.
- **Indeks** untuk pola query nyata: `(classroom_code)`, `(student_id, level_number)`,
  `(classroom_code, level_number)`, `completed_at DESC`.
- **Batas laju** per akun pada aksi tulis, sehingga satu klien nakal tidak
  menghabiskan kapasitas bersama.
- **`statement_timeout`** per fungsi berat, sehingga satu query lambat tidak
  menyandera koneksi.
- **`FORCE ROW LEVEL SECURITY`** — bahkan pemilik tabel tetap tunduk policy.

Yang sudah dikerjakan di sisi klien & aset:

- **Koalesensi tulis**: progres digabung per level dalam jendela 5 detik, dan
  dikuras saat tab disembunyikan/ditutup (`flushPendingProgress()`).
- **Precache selektif**: modul Level 2/3, Blockly, dan Digital Twin di-cache
  saat pertama dipakai, bukan diunduh semua di awal — precache **4.760 → 2.287 KiB**.
- **Model 3D terkompresi**: `terrain-688.stl.gz` (966 KB vs 3,17 MB).
- **`Cache-Control`** di `vercel.json`: aset ber-hash immutable, `sw.js`/`index.html`
  selalu divalidasi ulang.
- **Realtime channel idempoten** — memanggil ulang langganan menutup channel lama,
  mencegah channel menumpuk di satu browser.

Untuk produksi (>1000 bersamaan), pantau empat metrik ini dan pasang alarm
(ambangnya sebagai fungsi `E` dan `M` di `capacity/README.md` §3): egress/bulan,
`pg_database_size`, Realtime concurrent connections, dan p95 latensi
`level_submissions`. Bila guru konkuren > 500, naik ke Pro tanpa spend cap.


---

## 8. Checklist keamanan sebelum lomba

- [ ] Ketiga migrasi dijalankan berurutan, tanpa error.
- [ ] `verify_security.sql` dijalankan — semua baris berstatus **AMAN**.
- [ ] "Confirm email" dimatikan **atau** email asli siswa dipakai.
- [ ] Akun guru dibuat dengan `app_metadata.role = "teacher"` (bukan `user_metadata`).
- [ ] Custom Access Token Hook aktif (opsional tapi disarankan).
- [ ] `.env` tidak ter-commit (`git check-ignore .env` mengembalikan `.env`).
- [ ] Service role key **tidak ada** di repo maupun di variabel `VITE_*`.
- [ ] Password guru & demo sudah diganti dari nilai contoh.
- [ ] Level akun demo sudah dibuka: `SELECT public.admin_set_unlocked_level('demo', 3);`
- [ ] Kredensial akun demo **tidak ditampilkan di antarmuka** (kotak di halaman
      login sudah dihapus; jangan ditambahkan kembali sebelum lomba).
- [ ] Uji DevTools: `SELECT` ke `profiles`/`user_accounts` sebagai anon → kosong/tertolak.
- [ ] Uji dua akun: siswa A tidak bisa melihat data siswa B.
- [ ] `npm run build` hijau.
- [ ] Backup: Dashboard → Database → Backups aktif.

---

## 9. Kalau ada masalah

| Gejala | Penyebab paling mungkin | Solusi |
|---|---|---|
| **`ERROR 42883: function public.can_read_student(character varying) does not exist`** | View `students` lama (skema v2) masih ada; kolom `id`-nya `varchar`, sehingga policy memanggil `can_read_student(text)` padahal fungsinya menerima `uuid` | Jalankan **`fix_students_view.sql`**, pastikan hasil B4 kosong, lalu jalankan ulang `01_secure_schema.sql` |
| `ERROR 42P07: relation "students" already exists` | Ada sisa objek `students` dari percobaan sebelumnya | Sama seperti di atas — `fix_students_view.sql` melepasnya |
| "Kode kelas tidak terdaftar" saat daftar | Trigger memvalidasi `classrooms`, kode belum ada | Tambah kelas: `INSERT INTO classrooms(code,name,teacher_username,school_name) VALUES ('RESQ-8C','Kelas VIII-C','guru','SMP N 1');` |
| Siswa berhasil daftar tapi tidak bisa login | "Confirm email" masih menyala | Matikan di Authentication → Providers → Email |
| Guru tidak bisa masuk Posko Guru | `app_metadata.role` bukan `teacher`, atau salah taruh di `user_metadata` | Perbaiki `app_metadata` user tersebut |
| Login bilang "Username atau password salah" padahal akun lama | Akun lama belum ada di Supabase Auth | Pilih salah satu jalur di bagian 6 |
| Nilai tidak muncul di Posko Guru | Cache lokal menampilkan data lama | Klik refresh kelas; atau cek `list_class_submissions` via SQL |
| "Terlalu banyak permintaan" | Batas laju aktif | Tunggu 1 menit; batasnya memang disengaja |

---

*Terakhir diperbarui seiring migrasi keamanan RESQ-BOX.*
