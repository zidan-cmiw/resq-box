// ── NotFound/index.tsx ─────────────────────────────────────────────
// 404 Page — Pixel Art styled, matches the retro game theme

import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050813] flex flex-col items-center justify-center text-center px-4 select-none">
      {/* Pixel Art Stars Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.6 + 0.2,
              animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* 404 Number */}
      <div
        className="relative z-10 mb-4"
        style={{ fontFamily: "'Press Start 2P', monospace" }}
      >
        <h1
          className="text-7xl sm:text-8xl font-bold"
          style={{
            color: '#fbbf24',
            textShadow: '4px 4px 0 #78350f, -1px -1px 0 #451a03',
            imageRendering: 'pixelated',
          }}
        >
          404
        </h1>
      </div>

      {/* Message */}
      <p
        className="relative z-10 text-amber-200 text-[13px] sm:text-[15px] mb-2 font-semibold"
        style={{ fontFamily: "'Press Start 2P', monospace", lineHeight: '1.8' }}
      >
        HALAMAN TIDAK DITEMUKAN
      </p>
      <p
        className="relative z-10 text-amber-200/60 text-[13.5px] sm:text-[13px] mb-8 font-semibold"
        style={{ fontFamily: "'Press Start 2P', monospace", lineHeight: '1.6' }}
      >
        Sepertinya kamu tersesat di dalam gua vulkanik!
      </p>

      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="relative z-10 pixel-btn-wood-plank px-6 py-3 text-[13px] font-semibold"
        style={{ fontFamily: "'Press Start 2P', monospace" }}
      >
        ◀ KEMBALI KE BERANDA
      </button>
    </div>
  );
}
