// ── AppLayout.tsx ────────────────────────────────────────────────
// Full 2D Game Shell — Zero top navbar/header bar across all pages.
// Each page renders full-screen retro pixel scenes directly.

import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import PWABadge from './components/PWABadge';

export default function AppLayout() {
  // Enforce dark mode default for game feel
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <>
      <Outlet />
      {/*
        Badge PWA: menampilkan tawaran "muat ulang untuk versi baru" dan
        status siap-luring. Service worker didaftarkan dengan mode `prompt`
        (vite.config.ts), jadi TANPA komponen ini notifikasi pembaruan tidak
        akan pernah sampai ke pengguna.
      */}
      <PWABadge />
    </>
  );
}
