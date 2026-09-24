# AGENT.md

## Gaya Jawaban (WAJIB)
- Langsung ke inti. Tanpa basa-basi pembuka ("Baik, saya akan...", "Tentu, berikut...").
- Jawaban sesingkat mungkin. Kalau bisa dijawab 1 baris, jangan dibuat 1 paragraf.
- Jangan mengulang pertanyaan/instruksi user, jangan menjelaskan hal yang sudah jelas dari kode.
- Pakai poin/list untuk langkah-langkah, bukan narasi panjang.
- Kalau ada beberapa file yang diubah, cukup sebutkan nama file + ringkasan perubahan singkat — bukan narasi per file.
- Diam kalau tidak ada yang perlu dikatakan setelah eksekusi selesai (tidak perlu penutup basa-basi).

## Prinsip Kerja (WAJIB)
1. **Baca dulu, jangan asumsi.** Cek kode/file yang relevan sebelum mengubah atau menjawab.
2. **Jangan menebak.** Kalau tidak yakin soal API, library, atau struktur project, cek langsung ke source/dokumentasi — jangan mengarang.
3. **Verifikasi sebelum bilang "selesai".** Jalankan/build/test perubahan kalau memungkinkan. Jangan klaim berhasil tanpa cek.
4. **Ikuti konvensi yang sudah ada** — gaya penamaan, indentasi, struktur folder, pola kode di project ini. Jangan bikin gaya baru sendiri.
5. **Perubahan minimal dan presisi.** Jangan refactor/hapus/ubah kode yang tidak diminta, sekalipun menurutmu "lebih baik".
6. **Kalau ragu antar 2 pendekatan yang sama-sama valid**, pilih yang paling minimal & aman, sebutkan asumsi dalam satu baris, lalu lanjut kerjakan — jangan berhenti untuk tanya kalau keputusan itu bisa diambil sendiri secara wajar.
7. **Tanya HANYA** kalau requirement benar-benar ambigu dan salah jalan bisa berakibat besar (mis. hapus data, ubah skema, breaking change ke banyak tempat).
8. Kalau nemu bug/masalah di luar scope task, sebutkan singkat (1 baris), tapi jangan langsung diperbaiki kecuali diminta.

## Larangan
- Jangan install/hapus dependency tanpa bilang dulu.
- Jangan ubah file config sensitif (`.env`, `package.json`, `composer.json`, dll) kecuali memang itu tugasnya.
- Jangan generate kode yang tidak dites/tidak masuk akal hanya supaya kelihatan "selesai".

## Format Output Kode
- Kode langsung dalam code block, minim penjelasan sebelum/sesudahnya.
- Penjelasan hanya kalau ada keputusan non-trivial yang perlu diketahui user (1-3 baris cukup).
- Untuk perubahan multi-file: daftar singkat `nama_file — apa yang berubah`, bukan paragraf.

## Konteks Proyek

### Stack
- **Frontend**: React 19, TypeScript (~6.0), Vite 8
- **Styling**: Tailwind CSS 4 (`@tailwindcss/vite`), Custom Vanilla CSS Pixel Design Tokens (`src/index.css`)
- **State Management**: Zustand 5 (Multi-Store: `teacherStore`, `missionStore`, `workspaceStore`, `runtimeStore`, `simulatorStore`)
- **Block Editor**: Google Blockly 12 (Custom Arduino C generator + blok bahasa ramah anak Indonesia)
- **Drag & Drop**: `@dnd-kit/core`, `@dnd-kit/sortable`
- **Routing**: React Router DOM 7
- **Database & Auth**: Supabase Cloud (PostgreSQL, `pgcrypto` RPC) + LocalStorage Cache fallback (PWA Offline-Ready via `vite-plugin-pwa`)
- **Hardware Integration**: Web Serial API (USB) & WebSocket (WiFi ke ESP32 pada diorama fisik Smart Education Board)
- **Audio Synthesis**: Web Audio API (Sintesis Chiptune 8-Bit mandiri via `retroAudio.ts`)
- **Backend (Opsional/Pendukung)**: Laravel 11 (PHP 8.1+, Composer)

### Struktur Folder Penting
- `src/app/` : Halaman dan modul utama aplikasi
  - `Dashboard/` : Title screen 2D SVG pixel art (pemandangan Gunung Merapi, tombol papan kayu 3D, player HUD, fullscreen)
  - `Level1/` : Earth Explorer (Struktur Lapisan Bumi dengan simulator bor, Dinamika Lempeng Tektonik, dan Quest Wordle)
  - `Level2/` : Disaster Analyst (Karakteristik Gempa, Erupsi Merapi/KRB, dan Quest Mitigasi 10 skenario puzzle drag-and-drop)
  - `Level3/` : Simulation Game (Mission Center 22 skenario mitigasi dan sandbox My Projects)
  - `Workspace/` : Action Lab (Editor Blockly, panel slider sensor simulasi, digital twin, koneksi serial/WebSocket)
  - `EvacuationGame/` : Digital Twin (Peta Canvas 2D dengan NPC AI pathfinding A* yang bereaksi terhadap respon mitigasi)
  - `TeacherDashboard/` : Posko Guru (`/teacher` & `/guru`), rekap progres gabungan Level 1–3, cetak rapor, manajemen kelas & akun siswa
  - `Login/` & `Profile/` : Autentikasi multi-role, pemilihan avatar pixel, dan ganti password mandiri
- `src/engine/` : Definisi custom block Blockly, Arduino C code generator, JavaScript runtime interpreter, dan kode sanitizer keamanan
- `src/missions/data/` : Data skenario dan kriteria validasi 22 misi mitigasi (`missions.ts`)
- `src/mitigation/data/` : Data 10 skenario puzzle mitigasi bencana (`scenarios.ts`)
- `src/store/` : Zustand multi-store (`teacherStore.ts`, `missionStore.ts`, `workspaceStore.ts`, `runtimeStore.ts`, `simulatorStore.ts`)
- `src/components/` : Ikon 2D pixel art kustom murni (`PixelIcon.tsx`) dan generator avatar pixel
- `src/utils/` : Klien Supabase & local cache (`supabaseClient.ts`), audio synthesizer (`retroAudio.ts`), fullscreen API (`fullscreen.ts`), Web Serial (`webSerial.ts`)
- `backend/` : Layanan API Laravel 11 untuk manajemen kelas dan sinkronisasi data siswa

### Cara Run
- **Frontend**:
  ```bash
  cd RESQ-BOX
  npm install
  npm run dev
  ```
  *(Akses: `http://localhost:5173/`)*
- **Backend (Opsional)**:
  ```bash
  cd backend
  composer install
  cp .env.example .env
  php artisan key:generate
  php artisan migrate
  php artisan serve
  ```
  *(API: `http://127.0.0.1:8000/api`)*

### Cara Test
- **Type-check & Build**: `npm run build` (`tsc -b && vite build`)
- **Linting**: `npm run lint` (ESLint)
- **Preview Bundle**: `npm run preview`

### Cara Build
- `npm run build` *(output di folder `dist/`)*

### Catatan Khusus
- **Fokus Pedagogis (LIDM 2026 IPDP)**: Materi IPA SMP Kelas 8 (Bumi & Mitigasi). Bukan untuk belajar coding/hardware; Blockly dan hardware murni alat bantu manipulatif (*learning aids*).
- **Zero-Header Viewport Standard**: Tidak ada navbar atas di `AppLayout.tsx`. Wajib full-screen 2D viewport dengan navigasi dalam adegan (*in-scene wooden planks*).
- **Zero OS Emoji Standard**: Dilarang menggunakan emoji bawaan OS. Wajib menggunakan ikon SVG 2D Pixel Art via `PixelIcon.tsx` (`shapeRendering="crispEdges"`).
- **Tipografi Pixel Berjenjang**: `'Press Start 2P'` (heading/tombol kayu), `'Pixelify Sans'` (body text/form), `'JetBrains Mono'` (kode/PIN).
- **Dual Storage & Offline-First**: Cloud Supabase + fallback LocalStorage/BroadcastChannel (PWA Offline-Ready).
- **Kredensial Default**: Guru (`guru` / `guru123`), Demo Juri unlock Level 3 (`demo` / `demo123`).
- **Dual Hardware Feedback Loop**: Web Serial API (USB) & WebSocket (WiFi ESP32).