# Cara Menambah Akun Guru & Cara Isolasi Antar-Guru Bekerja

Dokumen ini menjawab dua hal:

1. **Bagaimana menambah akun guru** (sekarang: lewat Dashboard Supabase)
2. **Bagaimana data guru A dijaga agar tidak terlihat guru B**

---

## Bagian 1 — Menambah Akun Guru

### Kenapa tidak ada tombol "Tambah Guru" di aplikasi

Ini **disengaja**, dan bukan kekurangan yang terlewat.

Pendaftaran mandiri sudah **ditutup total** di server:

```
POST /auth/v1/signup  ->  HTTP 422
{"error_code":"signup_disabled","msg":"Signups not allowed for this instance"}
```

Artinya **tidak seorang pun bisa membuat akun sendiri** — baik siswa maupun guru.
Semua akun harus dibuat oleh pihak yang berwenang.

Guru hanya bisa membuat akun **SISWA**, dan hanya untuk **kelasnya sendiri**
(lihat Bagian 2). Tidak ada jalur bagi guru untuk membuat akun guru lain —
itu memang pembatasan yang benar, karena kalau ada, satu guru dapat membuat
akun guru palsu untuk mengintip kelas lain.

### Cara menambah akun guru — lewat Dashboard Supabase

Peran `teacher` **hanya dapat diberikan lewat `app_metadata`**, dan
`app_metadata` **hanya dapat ditulis oleh server**. Klien tidak bisa
mengisinya — ini sudah diuji:

```
Pendaftaran mandiri dengan data: {"role": "teacher"}
  -> HTTP 422, ditolak
```

Langkah-langkahnya:

1. Buka **Supabase Dashboard** -> proyek `miwfotsnkikozqhvewtw`
2. Masuk ke **Authentication** -> **Users** -> **Add user**
3. Isi:
   - **Email**: `<username>@resqbox.local`
     (pola email sintetis yang dipakai seluruh aplikasi ini)
   - **Password**: password guru
   - **Auto Confirm User**: **NYALA** (wajib, karena tidak ada verifikasi email)
   - **User Metadata** (bukan App Metadata): `{"name": "Bu Tyas", "username": "buatyas"}`
   - **App Metadata**: `{"role": "teacher", "username": "buatyas"}`
4. Simpan.

> **Email memakai `@resqbox.local`, bukan email sungguhan.**
> Guru masuk dengan mengetik **username**-nya saja; aplikasi menambahkan
> `@resqbox.local` di belakangnya secara otomatis.

### Urutan yang penting

`app_metadata.role` **harus** `teacher` **sebelum guru itu masuk pertama kali**.

Sebabnya peran diambil dari `app_metadata` saat token dibuat, lewat
`custom_access_token_hook`. Bila guru masuk lebih dahulu tanpa peran itu, ia
akan dibuatkan profil sebagai `student`. Perbaikan setelahnya masih mungkin
(mengubah `app_metadata` lalu meminta guru masuk ulang), tetapi lebih mudah
dilakukan benar sejak awal.

### Guru pertama untuk tiap sekolah

Untuk setiap sekolah baru, buat satu akun guru lewat Dashboard. Setelah itu
guru tersebut membuat kelasnya sendiri **di dalam aplikasi**
(tombol "BUAT KELAS BARU"), lalu membuat akun murid-muridnya.

---

## Bagian 2 — Isolasi Antar-Guru

### Rancangannya sudah ada, dan sudah diuji

Data guru A **tidak dapat dilihat guru B**. Ini dijaga di **tiga lapis**,
sehingga bila satu lapis terlewat, lapis lain tetap menahan.

### Lapis 1 — Tabel `classrooms` memiliki pemilik

```sql
create table public.classrooms (
  code             TEXT PRIMARY KEY,   -- kode kelas, unik sedunia
  name             TEXT NOT NULL,
  teacher_username TEXT NOT NULL,      -- PEMILIK kelas ini
  school_name      TEXT NOT NULL,
  ...
);
```

Setiap kelas **dimiliki tepat satu guru** lewat `teacher_username`.

Karena `code` adalah **PRIMARY KEY**, mustahil ada dua guru dengan kode kelas
yang sama. Ini penting: tanpa jaminan itu, pemeriksaan kepemilikan dapat
menyasar kelas guru lain.

### Lapis 2 — Kebijakan RLS membatasi per guru

Kebijakan pada `classrooms`:

```sql
create policy classrooms_select_member on public.classrooms
  for select using (public.is_class_member(code) OR public.is_admin());
```

Dan `is_class_member()` hanya mengembalikan **true** untuk guru yang namanya
tercatat sebagai pemilik kelas itu:

```sql
me.role = 'teacher' AND EXISTS (
  SELECT 1 FROM public.classrooms c
  WHERE c.code = p_code AND c.teacher_username = me.username)
```

Kebijakan pada data murid (`profiles` dan `level_submissions`) memakai
`can_read_student()`:

```sql
p_student_id = auth.uid()                    -- murid: dirinya sendiri
OR public.is_admin()                         -- admin: semua
OR (public.is_teacher() AND EXISTS (         -- guru: HANYA kelas yang dia ampu
      SELECT 1 FROM public.profiles s
      JOIN public.classrooms c ON c.code = s.classroom_code
      WHERE s.id = p_student_id
        AND c.teacher_username = (SELECT username FROM public.profiles
                                  WHERE id = auth.uid())
   ))
```

Jadi guru A yang menanyakan nilai murid guru B akan mendapat **nol baris**,
bukan pesan galat. Dari sisi guru A, data itu **tidak ada**.

### Lapis 3 — Fungsi RPC memeriksa kepemilikan sendiri

Fungsi `SECURITY DEFINER` **melewati RLS**. Karena itu fungsi-fungsi guru
harus memeriksa izin sendiri, dan semuanya sudah melakukannya.

`teacher_create_student` sebagai contoh:

```sql
IF NOT (v_me.is_admin OR v_me.role = 'admin') THEN
  IF NOT EXISTS (SELECT 1 FROM public.classrooms c
                 WHERE c.code = v_code AND c.teacher_username = v_me.username) THEN
    RAISE EXCEPTION 'Kelas % bukan milik Anda.', v_code USING ERRCODE = '42501';
  END IF;
END IF;
```

Periksa sendiri kapan saja:

```
python scripts/periksa_izin_guru.py
```

Per 12 fungsi guru yang menyentuh data murid/kelas, hasilnya:
**12 aman, 0 perlu diperiksa.**

### Bagaimana bila satu guru mengampu beberapa kelas

Sudah didukung. `classrooms` boleh memuat banyak baris dengan
`teacher_username` yang sama. `list_my_classrooms` mengembalikan semuanya,
dan `list_class_students` dapat dipanggil per kode kelas.

### Bagaimana bila dua guru berbagi satu kelas

**Belum didukung.** `classrooms.teacher_username` hanya memuat SATU nama.
Bila nanti perlu (misalnya guru IPA dan guru TIK mengampu kelas yang sama),
perlu tabel penghubung `classroom_teachers` dan perubahan pada
`is_class_member()` serta `can_read_student()`. Beri tahu bila ini
diperlukan.

---

## Bagian 3 — Yang BELUM Aman (temuan dari pemeriksaan ini)

### Kode kelas dapat dicacah tanpa login

Diuji langsung dari luar memakai kunci publik yang sama dengan peramban,
**tanpa login**:

```
class_code_info('RESQ-8A')  ->  {"found": true, "name": "Kelas VIII-A",
                                 "school_name": "SMP Negeri 1"}
class_code_info('RESQ-8B')  ->  {"found": true, "name": "Kelas VIII-B",
                                 "school_name": "SMP Negeri 1"}
```

Kode kelas dibuat dari yang **diketik guru sendiri**, jadi polanya mudah
ditebak: `RESQ-8A`, `RESQ-8B`, `RESQ-8C`, `RESQ-9A`, dan seterusnya.
Dari 21 tebakan yang dicoba, 2 langsung berhasil.

**Yang bocor:** keberadaan kelas, nama kelas, dan nama sekolah.
**Yang TIDAK bocor:** data murid. RLS pada `profiles` dan
`level_submissions` tetap menolak tanpa login (diuji: HTTP 401).

**Perbaikannya sudah disiapkan** di
`supabase/migrations/11_tutup_pencacahan_kode_kelas.sql`.

Kedua fungsi itu **tidak dipanggil sama sekali oleh aplikasi** — pencarian di
seluruh `src/` tidak menemukan satu pun pemanggilnya. Jadi menghapusnya tidak
mengurangi kemampuan aplikasi sedikit pun.

### Cara menjalankan migrasi itu

Buka **Supabase Dashboard** -> **SQL Editor** -> tempel seluruh isi
`supabase/migrations/11_tutup_pencacahan_kode_kelas.sql` -> **Run**.

Setelah dijalankan, verifikasi dengan:

```
python scripts/uji_isolasi_guru.py
```

Pada bagian "FUNGSI PUBLIK", kedua fungsi itu harus sudah **tidak ada lagi**.

---

## Bagian 4 — Hasil Pemeriksaan Keamanan

Semua diuji dari **luar**, memakai kunci publik yang sama dengan peramban:

| Yang diuji | Hasil |
|---|---|
Baca `profiles` tanpa login | HTTP 401 ditolak |
Baca `level_submissions` tanpa login | HTTP 401 ditolak |
Baca `classrooms` tanpa login | HTTP 401 ditolak |
Baca `rate_limits` tanpa login | HTTP 401 ditolak |
Panggil 13 fungsi privat tanpa login | ditolak semua |
Naikkan peran sendiri jadi admin | HTTP 401 ditolak |
Pendaftaran mandiri sebagai guru | HTTP 422 ditolak |
Ubah `role`/`is_admin`/`classroom_code` dari klien | ditahan trigger |
12 fungsi guru memeriksa kepemilikan kelas | aman semua |

Jalankan sendiri kapan saja:

```
python scripts/uji_isolasi_guru.py      # uji dari luar
python scripts/periksa_izin_guru.py     # periksa izin tiap fungsi
python scripts/uji_akses_tanpa_login.py # periksa tabel
```
