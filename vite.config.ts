import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // ── Pemecahan chunk ────────────────────────────────────────────────
        // Tujuan: (1) unduhan pertama sekecil mungkin, (2) cache jangka
        // panjang — memperbarui kode level TIDAK memaksa siswa mengunduh
        // ulang library pihak ketiga.
        //
        // Catatan: paket yang sudah tidak dipakai (xyflow, lucide-react)
        // entrinya dihapus, karena @xyflow/react dan page-flip sudah tidak
        // diimpor apa pun. @dnd-kit dipertahankan karena masih dipakai.
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

          // Grafik & ikon serbaguna.
          if (id.includes('node_modules/recharts') || id.includes('node_modules/d3-'))
            return 'chart-vendor';
          if (id.includes('node_modules/lucide-react')) return 'icons';

          // Tarik-seret.
          if (id.includes('node_modules/@dnd-kit')) return 'dnd-vendor';

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
        enabled: true,
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
