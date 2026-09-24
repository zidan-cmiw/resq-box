// ── AppLayout.tsx ────────────────────────────────────────────────
// Full 2D Game Shell — Zero top navbar/header bar across all pages.
// Each page renders full-screen retro pixel scenes directly.

import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';

export default function AppLayout() {
  // Enforce dark mode default for game feel
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return <Outlet />;
}
