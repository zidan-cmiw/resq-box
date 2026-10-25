import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // ── Pemuatan awal saat dev ────────────────────────────────────────────────
  // Blockly dan Three.js masing-masing tersusun atas RATUSAN berkas kecil.
  // Tanpa optimizeDeps, Vite mengubah tiap berkas itu satu per satu pada
  // permintaan pertama, sehingga membuka Level 3 atau peta Merapi terasa
  // menggantung beberapa detik.
  //
  // Dengan daftar ini, keduanya digabung sekali di awal lalu disajikan cepat.
  // Tidak berpengaruh apa pun pada hasil build produksi.
  optimizeDeps: {
    include: ['blockly', 'blockly/core', 'three'],
  },

  server: {
    // DENGARKAN DI SEMUA ANTARMUKA, BUKAN HANYA IPv6.
    //
    // Tanpa ini, Vite 8 mengikat server ke `localhost`, dan Node menerjemahkan
    // `localhost` menjadi ::1 lebih dahulu. Akibatnya server hanya melayani
    // alamat IPv6, sedangkan peramban yang mencoba 127.0.0.1 mendapat
    // "tidak dapat tersambung" — persis gejala "localhost tidak bisa dibuka
    // padahal sudah dijalankan".
    //
    // Dengan `true`, server melayani IPv4 dan IPv6 sekaligus, sehingga
    // localhost, 127.0.0.1, dan alamat IP komputer di jaringan lokal
    // semuanya dapat dibuka. Alamat IP lokal itu yang dipakai untuk menguji
    // tampilan di iPad atau HP.
    host: true,

    // Berkas yang hampir pasti dibuka lebih dahulu diubah lebih awal, supaya
    // klik pertama tidak menunggu.
    warmup: {
      clientFiles: [
        './src/main.tsx',
        './src/App.tsx',
        './src/app/Dashboard/index.tsx',
        './src/app/Login/index.tsx',
        './src/app/Level1/index.tsx',
        './src/app/Level2/index.tsx',
        './src/app/Level3/index.tsx',
      ],
    },
  },

  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // ── Pemecahan chunk ────────────────────────────────────────────────
        // Tujuan: (1) unduhan pertama sekecil mungkin, (2) cache jangka
        // panjang — memperbarui kode level TIDAK memaksa siswa mengunduh
        // ulang library pihak ketiga.
        //
        // Catatan: seluruh paket yang tidak lagi diimpor kode sudah DIBUANG
        // dari `package.json` (xyflow, dnd-kit, lucide-react, page-flip,
        // react-pageflip, motion, clsx, tailwind-merge).
        // Karena itu tidak ada lagi entri manualChunks untuknya — sebelumnya
        // ada cabang 'dnd-vendor', 'icons', dan 'chart-vendor' yang tidak
        // pernah menghasilkan chunk apa pun.
        //
        // ⚠️ `workbox-window` TIDAK termasuk yang dibuang. Paket itu memang
        // tidak diimpor langsung oleh `src/`, tetapi dibutuhkan oleh modul
        // virtual `virtual:pwa-register/react` yang dipakai `PWABadge.tsx`.
        // Tanpa `workbox-window` di `dependencies`, build gagal dengan
        // "Rolldown failed to resolve import \"workbox-window\"".
        // Jangan hapus lagi.
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return;

          // Mesin 3D — hanya dibutuhkan di Digital Twin Merapi.
          // Dipisah agar tidak ikut terbawa ke halaman lain.
          if (id.includes('node_modules/three')) return 'three-vendor';

          // Mesin blok kode — hanya di Workspace/Action Lab.
          if (id.includes('node_modules/blockly')) return 'blockly';

          // Klien database & autentikasi.
          if (id.includes('node_modules/@supabase') || id.includes('node_modules/supabase'))
            return 'supabase-vendor';

          // Inti React — paling stabil, paling sering dipakai ulang.
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/react-router') ||
            id.includes('node_modules/scheduler')
          )
            return 'react-vendor';

          // Sisanya: satu keranjang agar tidak menjadi puluhan chunk kecil.
          return 'vendor';
        },
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // ── autoUpdate, BUKAN prompt ──────────────────────────────────────
      // Sebelumnya 'prompt': service worker menunggu pengguna menekan tombol
      // "Muat Ulang" pada notifikasi PWABadge. Akibatnya, bila notifikasi itu
      // tidak terlihat atau ditutup, browser TETAP menyajikan berkas lama
      // tanpa batas waktu.
      //
      // Gejala nyata yang pernah terjadi: halaman login masih menampilkan kotak
      // akun demo yang sudah dihapus dari kode, dan gambar latar tampil rusak
      // karena berkas WebP baru belum pernah dimuat. Pengguna tidak punya cara
      // menyadari bahwa yang dilihatnya sudah usang.
      //
      // Dengan 'autoUpdate', service worker baru langsung mengambil alih dan
      // halaman dimuat ulang sendiri. Ini penting untuk lomba: juri yang pernah
      // membuka web akan selalu melihat versi terbaru tanpa perlu hard refresh.
      registerType: 'autoUpdate',
      devOptions: {
        // MATI saat dev — dulu `true`.
        //
        // Dengan service worker hidup di localhost, setiap permintaan melewati
        // Workbox lebih dulu. Akibatnya:
        //   1. halaman terasa lambat, terutama saat pertama dibuka,
        //   2. perubahan kode tidak muncul walau server sudah rekompilasi,
        //      karena yang dilayani adalah berkas dari cache.
        // Kedua gejala itu dilaporkan sebagai "localhost lemot".
        //
        // PWA tetap aktif pada hasil build produksi, jadi kemampuan luring
        // tidak berkurang.
        enabled: false,
      },
      workbox: {
        // `webp` wajib ada di sini: latar belakang halaman Login & Posko Guru
        // sekarang berformat WebP. Tanpa ini, janji "luring penuh" (PRD.md:253)
        // tidak terpenuhi untuk kedua halaman tersebut.
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
        // ── Precache selektif ──────────────────────────────────────────────
        // Modul berat hanya dibutuhkan setelah siswa membuka level terkait.
        // Mengeluarkannya dari precache awal memangkas unduhan pertama
        // (±2 MB) tanpa mengorbankan mode luring: setelah dipakai sekali,
        // berkasnya masuk cache lewat runtimeCaching di bawah.
        globIgnores: [
          'assets/blockly-*.js',
          'assets/three-vendor-*.js',
          'assets/Workspace-*.js',
          'assets/EvacuationCanvas-*.js',
          'assets/Level1-*.js',
          'assets/Level2-*.js',
          'assets/Level3-*.js',
          'assets/TeacherDashboard-*.js',
          // Ikon manifest sudah ditambahkan otomatis oleh vite-plugin-pwa;
          // mengecualikannya di sini mencegah entri precache ganda.
          'pwa-*.png',
        ],
        runtimeCaching: [
          {
            // Chunk aplikasi yang belum di-precache (Level 2, Level 3,
            // Action Lab/Blockly, Digital Twin 3D). Di-cache setelah dipakai
            // sehingga kunjungan berikutnya (termasuk saat luring) tersedia.
            urlPattern: /\/assets\/.*\.js$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'resqbox-deferred-chunks',
              expiration: {
                maxEntries: 40,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 hari
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Aset media besar (mis. model 3D terrain-688.stl) tidak
            // di-precache, tapi langsung di-cache saat pertama dipakai.
            urlPattern: /\.(?:stl|webp|jpg|jpeg|png)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'resqbox-media',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-static-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      manifest: {
        name: 'RESQ-BOX — Belajar Mitigasi Bencana',
        short_name: 'RESQ-BOX',
        description:
          'Platform media pembelajaran IPA interaktif & simulasi mitigasi bencana untuk SMP Kelas 8',
        lang: 'id',
        theme_color: '#0f172a',
        background_color: '#050813',
        display: 'standalone',
        orientation: 'landscape',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
});
