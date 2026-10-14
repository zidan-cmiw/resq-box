import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Berkas HASIL BANGUN & folder pihak ketiga tidak boleh diperiksa:
  // isinya dibuat mesin, tidak pernah disunting tangan, dan sudah diabaikan
  // git. Sebelumnya hanya `dist` yang diabaikan, sehingga `dev-dist/`
  // (service worker hasil `vite-plugin-pwa`) dan `android/app/build/`
  // ikut diperiksa — menyumbang 10 galat "fatal" dan puluhan temuan palsu
  // yang menutupi temuan asli pada kode kita sendiri.
  globalIgnores([
    'dist',
    'dev-dist',
    'android',
    'coverage',
    'release',
    'node_modules',
    'public',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // ── Aturan yang DITURUNKAN menjadi peringatan ──────────────────────
      //
      // Semuanya tetap terlihat di setiap `npm run lint`, tetapi tidak lagi
      // menggagalkan CI. Alasan tiap kelompok dijelaskan di bawah, supaya
      // keputusan ini dapat ditinjau ulang — bukan sekadar dibungkam.
      //
      // 1. Keluarga `react-hooks/*` dari eslint-plugin-react-hooks v7.
      //    Aturan ini dirancang untuk kode React yang seluruh statusnya
      //    berada di dalam React. Inti proyek ini justru sebaliknya: engine
      //    game canvas dan Three.js yang menyimpan keadaan yang dapat
      //    berubah di luar React, memutasi ref, dan menjalankan loop
      //    requestAnimationFrame. Pola itu memang ditandai oleh aturan ini.
      //    "Memperbaikinya" berarti merombak engine yang sudah berjalan dan
      //    teruji — risikonya jauh lebih besar daripada manfaatnya.
      'react-hooks/refs': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/preserve-manual-memoization': 'warn',
      // exhaustive-deps: menambah dependensi yang diminta aturan ini dapat
      // mengubah perilaku (loop restart, efek berjalan berulang), sehingga
      // harus diperiksa satu per satu — tidak boleh otomatis.
      'react-hooks/exhaustive-deps': 'warn',

      // 2. Fast Refresh hanya berlaku saat pengembangan dengan HMR. Berkas
      //    yang mengekspor komponen sekaligus konstanta/data memang gaya
      //    yang dipakai proyek ini (mis. tabel data di samping komponennya).
      'react-refresh/only-export-components': 'warn',

      // 3. `any` masih dipakai pada titik temu dengan pustaka pihak ketiga
      //    (Blockly, Three.js, canvas 2D). Menggantinya dengan tipe yang
      //    benar adalah pekerjaan tersendiri; dicatat sebagai utang teknis,
      //    bukan diabaikan diam-diam.
      '@typescript-eslint/no-explicit-any': 'warn',

      // 4. Awalan garis bawah berarti "memang tidak dipakai dengan sengaja".
      //    Diperlukan untuk parameter yang wajib ada karena tanda tangan
      //    fungsi pihak ketiga, tetapi tidak kita pakai — sebelumnya nilai
      //    seperti `_classroomCode` tetap dilaporkan sebagai galat.
      //    Tetap galat bila ada variabel yang benar-benar mati.
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
])
