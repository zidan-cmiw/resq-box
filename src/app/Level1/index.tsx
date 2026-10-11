// ── Level1/index.tsx ──────────────────────────────────────────────────────────
// Halaman Level 1: Earth Explorer
// Menghadirkan Game Petualangan 2D Full-Screen "EARTH DIVE" (Jelajahi Inti Bumi)

import EarthDiveGame from './EarthDive/EarthDiveGame';

export default function Level1Page() {
  return (
    <div className="fixed inset-0 w-screen w-[100dvw] h-screen h-[100dvh] safe-area-pad select-none bg-black overflow-x-hidden font-pixel">
      <EarthDiveGame />
    </div>
  );
}
