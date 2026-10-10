# Membersihkan akun uji

Akun uji yang dibuat untuk membuktikan isolasi data **harus dihapus**
sebelum lomba, supaya tidak ada akun tak terpakai yang tertinggal.

## Akun yang dibuat

| Username | Email | Kegunaan |
|---|---|---|
`ujia` | `ujia@resqbox.local` | Pemeran "user #1" dalam uji isolasi |
`ujib` | `ujib@resqbox.local` | Pemeran "user lain" |

Dibuat oleh `supabase/siapkan_akun_uji_isolasi.sql`.

## Cara menghapus

Jalankan di Supabase SQL Editor:

```sql
-- Menghapus akun uji. Profil dan nilainya ikut terhapus lewat ON DELETE CASCADE.
DELETE FROM auth.users WHERE email IN ('ujia@resqbox.local', 'ujib@resqbox.local');

-- Pastikan sudah bersih. Angka ini HARUS 0.
SELECT count(*) AS sisa_akun_uji
  FROM auth.users
 WHERE email LIKE 'ujia@%' OR email LIKE 'ujib@%' OR email LIKE 'zz_uji_%';
```

## Setelah dibersihkan

Hapus juga baris `VITE_UJI_*` dari `.env` bila masih ada, lalu:

```
npm run test:isolation
```

akan menampilkan petunjuk untuk menyiapkan ulang akun bila diuji lagi.
