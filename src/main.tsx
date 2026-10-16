import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initGlobalErrorHandlers, initWebVitals } from './utils/monitoring'
import { kirimNilaiTertunda } from './utils/supabaseClient'
import { initTema } from './utils/tema'

// ── Tema terang / gelap ───────────────────────────────────────────────────
// Kelas `.dark` sudah dipasang oleh skrip kecil di index.html sebelum halaman
// digambar, sehingga tidak ada kedipan putih. Panggilan ini melanjutkan
// pekerjaannya: menyinkronkan keadaan, memperbarui warna bilah peramban, dan
// meneruskan perubahan pengaturan sistem selama pengguna belum memilih sendiri.
initTema()

// ── Observabilitas ────────────────────────────────────────────────────────
// Tanpa ini, kegagalan yang terjadi di HP siswa tidak pernah sampai ke kita.
// Keduanya aman dipanggil walau monitoring belum dikonfigurasi (no-op).
initGlobalErrorHandlers()
initWebVitals()

// ── Kirim nilai yang tertunda dari sesi luring ────────────────────────────
//
// Saat siswa bermain di jaringan WiFi diorama ESP32, perangkat tidak punya
// akses internet, sehingga pengiriman nilai ke server gagal. Nilainya tetap
// tercatat di perangkat dan dikirim ulang di sini — saat aplikasi dibuka
// kembali dalam keadaan tersambung internet.
//
// MENGAPA DIBERI JEDA: sesi login perlu dipulihkan lebih dahulu. Bila
// pengiriman dicoba sebelum sesi siap, server menolaknya sebagai "Harus
// login" dan percobaan itu sia-sia.
//
// Aman dipanggil walau tidak ada nilai tertunda, dan walau sedang luring —
// dalam keadaan luring fungsi ini berhenti dengan sendirinya.
setTimeout(() => {
  void kirimNilaiTertunda()
}, 3000)

// ── Mobile Game Protection: Disable Long-Press Context Menu & Double-Tap Zoom ──
if (typeof window !== 'undefined') {
  // 1. Matikan Context Menu (menu popup tekan-lama Android/iOS & klik kanan) di seluruh aplikasi
  window.addEventListener(
    'contextmenu',
    (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }
      e.preventDefault();
    },
    { capture: true, passive: false }
  );

  // 2. Matikan Double-Tap to Zoom pada Layar Sentuh Mobile / Tablet
  let lastTouchEndTime = 0;
  document.addEventListener(
    'touchend',
    (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTouchEndTime <= 300) {
        const target = e.target as HTMLElement | null;
        if (!target || (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA')) {
          e.preventDefault();
        }
      }
      lastTouchEndTime = now;
    },
    { passive: false }
  );

  // 3. Matikan Gesture Zoom (Pinch to Zoom) pada Level Halaman Dokumen
  document.addEventListener(
    'gesturestart',
    (e: Event) => {
      e.preventDefault();
    },
    { passive: false }
  );
  document.addEventListener(
    'gesturechange',
    (e: Event) => {
      e.preventDefault();
    },
    { passive: false }
  );
  document.addEventListener(
    'gestureend',
    (e: Event) => {
      e.preventDefault();
    },
    { passive: false }
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
