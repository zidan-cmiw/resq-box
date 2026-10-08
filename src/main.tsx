import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

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
