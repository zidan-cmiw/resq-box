# 📝 RESQ-BOX Update Log

Catatan perjalanan pengembangan aplikasi web RESQ-BOX.

---

## [2026-05-16] Fase Perencanaan & Brainstorming
- **Nama Proyek:** Fix menggunakan nama `RESQ-BOX`.
- **Arsitektur Halaman:** Beralih ke model *Multi Sub-page*. 
  - Akan ada **Dashboard** untuk melihat daftar proyek (draft lokal) dan daftar misi.
  - Memilih sebuah misi atau membuat proyek baru akan membuka **Workspace** baru (berisi Block Editor & Simulator).
- **Simulator Engine:** Fix 100% menggunakan *Custom JS Behavioral Engine* untuk simulasi rangkaian secara *real-time* ala Wokwi.
- **Penyimpanan:** Menggunakan `Local Storage` / `IndexedDB` untuk menyimpan data canvas/workspace secara lokal di *device* pengguna.
- **Struktur Folder:** `header.md` telah diupdate untuk merefleksikan perubahan struktur halaman (`app/Dashboard` dan `app/Workspace`).

---

## [2026-05-16] Penyelesaian Phase 0: Fondasi
- Menginisialisasi proyek menggunakan Vite + React + TypeScript.
- Berhasil setup **Tailwind CSS v4** menggunakan `@tailwindcss/vite` plugin dan mendefinisikan variabel global (warna *rescue orange*, *tech blue*, dan *dark mode*).
- Membuat logo animasi burung hantu yang imut menggunakan *AI image generation*.
- Menyelesaikan struktur *Routing* dengan `react-router-dom`.
- Membuat *placeholder component* UI dasar untuk `Dashboard`, `Workspace`, `BlockEditor`, dan `Simulator`.
- Struktur siap dilanjutkan ke eksekusi Phase 1 (Integrasi Blockly).

---

## [2026-05-18] Redesign Mission Panel → Step-by-Step Guide
- **MissionPanel.tsx** dirombak total dari tampilan info statis menjadi **stepper UI bertahap**.
  - Tiap misi kini punya 5 langkah: *Kenali Misi → Ambil Komponen → Sambungkan Kabel → Tulis Kode → Jalankan & Validasi*.
  - Setiap langkah punya: judul, deskripsi ramah anak, ikon warna-warni, dan tips opsional.
  - Navigasi Prev/Next dengan progress bar visual (dot indicator + bar indicator di header).
  - Tombol **VALIDASI MISI** hanya muncul di langkah terakhir — memaksa anak mengikuti urutan.
  - Tip box kuning muncul otomatis kalau langkah ada tips.
- **missions.ts** diupdate: interface `Mission` ditambah field `steps: MissionStep[]`, dan data tiap misi (level 1–5) sudah dilengkapi langkah bertahap yang ditulis dalam bahasa ramah anak-anak.
- Desain mengikuti color system yang sudah ada (primary, secondary-container, surface tokens Tailwind).


## [2026-09-08 / 2026-09-09] Pembaruan Sistem Autentikasi, Posko Guru & Visual 2D Pixel Art

### 1. Autentikasi Multi-Role & Manajemen Kelas Terpadu (Supabase + Local Cache)
- **Registrasi & Verifikasi Kelas Siswa**:
  - Siswa dapat mendaftar mandiri dengan memasukkan Nama, Nomor Absen, Username, Password, dan **Kode Kelas** valid (contoh: `8b`, `8B`, `RESQ-8A`, `RESQ-8B`).
  - Validasi kode kelas langsung terhubung ke database cloud Supabase (`classrooms` & `users`), dengan fallback penyimpanan lokal yang aman.
  - Perbaikan sinkronisasi data siswa di **Posko Guru (`/teacher`)**: data siswa baru kelas 8B langsung tampil secara *real-time* di tabel daftar siswa kelas yang bersangkutan.
- **Pembersihan Akun Demo & Standarisasi Akses Guru**:
  - Akun demo lama (`std-budi`, `std-siti`) dibersihkan secara otomatis saat inisialisasi agar data kelas bersih.
  - Kredensial akun resmi Guru distandarisasi ke username `guru` dan password `guru123`.
- **Fitur Ganti Password Siswa Mandiri**:
  - Menambahkan formulir dan mekanisme ganti password mandiri bagi siswa pada modal **Pengaturan Profil Siswa (`/profile`)**.
  - Password baru langsung tersimpan ke Supabase dan localStorage dengan notifikasi audio retro dan konfirmasi visual.
- **Proteksi Rute Cepat (Zero-Delay Route Guards)**:
  - Pengguna yang belum login (`!currentUser`) langsung diarahkan (*immediate redirect*) ke halaman login (`/login`) saat mengakses halaman utama (`/`).
  - Akses posko guru (`/teacher` dan `/guru`) terproteksi khusus untuk akun dengan role `teacher`.

### 2. Peningkatan Visual 2D Pixel Art & Desain Latar Belakang
- **Latar Belakang 2D Pixel Art Hutan Hujan Tropis Berkabut (Tropical Misty Cloud Forest)**:
  - Mengimplementasikan pemandangan hutan tropis berkabut semirip mungkin dengan referensi alam pegunungan Indonesia.
  - Efek atmosferik dinamis: kabut lembah mengalir (*drifting valley fog*), sinar matahari pagi (*god-rays shimmer*), dan partikel spora embun.
- **Ikonografi 2D Pixel Art Murni (`PixelIcon`)**:
  - Menggantikan seluruh emoji sistem operasi dengan ikon kustom 2D Pixel Art SVG (`PixelIcon`): Tas Siswa Pixel, Papan Tugas Guru, Kompas, Kunci, Profil Pengguna, Sekolah, Lencana ID, dan Panah Taktis.
- **Plakat Komando Kayu Retro (*Expedition Command Slate Card*)**:
  - Kotak login dan posko guru dipercantik dengan 4 baut emas pixel (*golden corner rivets*), border kayu timbul 3D, dan kontras warna tinggi yang ramah pandangan siswa.