// ── src/components/ResqyMascot.tsx ─────────────────────────────────────
// Maskot Resmi RESQ-BOX: Resqy Burung Hantu Bijak 2D Pixel Art
// Digunakan untuk dialog panduan, tutorial in-game, dan asisten pembelajaran.

import React from 'react';

interface ResqyMascotProps {
  size?: number;
  className?: string;
  talking?: boolean;
  mood?: 'happy' | 'thinking' | 'excited' | 'wise';
}

export const ResqyMascot: React.FC<ResqyMascotProps> = ({
  size = 56,
  className = '',
  talking = false,
  mood = 'wise',
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center select-none relative ${className}`}
      style={{ width: size, height: size }}
      title="Resqy — Maskot Burung Hantu Bijak RESQ-BOX"
    >
      <svg
        viewBox="0 0 36 36"
        width={size}
        height={size}
        className={`w-full h-full drop-shadow-[0_3px_0_rgba(35,18,6,0.6)] ${
          talking ? 'animate-bounce-subtle' : ''
        }`}
        shapeRendering="crispEdges"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 1. Sparkles di sekitar Resqy */}
        <rect x="3" y="5" width="2" height="2" fill="#fde047" className="animate-pulse" />
        <rect x="31" y="7" width="2" height="2" fill="#67e8f9" className="animate-pulse" />
        <rect x="32" y="24" width="2" height="2" fill="#fde047" opacity="0.8" />
        <rect x="2" y="22" width="2" height="2" fill="#67e8f9" opacity="0.8" />

        {/* 2. Bayangan / Outline Luar Cokelat Tua Gelap */}
        <rect x="9" y="6" width="18" height="24" fill="#451a03" />
        <rect x="7" y="9" width="22" height="20" fill="#451a03" />

        {/* 3. Telinga Bulu Burung Hantu (Ear Tufts) */}
        <rect x="9" y="3" width="4" height="5" fill="#78350f" />
        <rect x="10" y="2" width="3" height="3" fill="#451a03" />
        <rect x="10" y="4" width="2" height="3" fill="#b45309" />

        <rect x="23" y="3" width="4" height="5" fill="#78350f" />
        <rect x="23" y="2" width="3" height="3" fill="#451a03" />
        <rect x="24" y="4" width="2" height="3" fill="#b45309" />

        {/* 4. Tubuh Utama Berbulu Cokelat Keemasan (Tawny Body) */}
        <rect x="8" y="8" width="20" height="20" fill="#b45309" />
        <rect x="10" y="7" width="16" height="21" fill="#d97706" />

        {/* 5. Sayap Kiri & Kanan (Flapping Wings) */}
        <g className={talking ? 'animate-wing-left' : ''}>
          <rect x="5" y="12" width="4" height="13" fill="#78350f" />
          <rect x="6" y="13" width="3" height="11" fill="#92400e" />
          <rect x="7" y="15" width="2" height="7" fill="#b45309" />
        </g>
        <g className={talking ? 'animate-wing-right' : ''}>
          <rect x="27" y="12" width="4" height="13" fill="#78350f" />
          <rect x="27" y="13" width="3" height="11" fill="#92400e" />
          <rect x="27" y="15" width="2" height="7" fill="#b45309" />
        </g>

        {/* 6. Dada Bulu Lembut Krem / Beige */}
        <rect x="12" y="15" width="12" height="12" fill="#fef3c7" />
        <rect x="13" y="16" width="10" height="10" fill="#fde68a" />
        {/* V-Chevron Feather Markings di dada */}
        <rect x="14" y="18" width="2" height="1" fill="#b45309" />
        <rect x="20" y="18" width="2" height="1" fill="#b45309" />
        <rect x="16" y="21" width="4" height="1" fill="#b45309" />
        <rect x="17" y="24" width="2" height="1" fill="#b45309" />

        {/* 7. Kacamata Peneliti Emas (Scholar Spectacles) */}
        <rect x="9" y="9" width="8" height="8" fill="#d97706" />
        <rect x="19" y="9" width="8" height="8" fill="#d97706" />
        <rect x="16" y="12" width="4" height="2" fill="#d97706" />

        {/* 8. Mata Bulat Burung Hantu yang Bijak */}
        <rect x="10" y="10" width="6" height="6" fill="#fef08a" />
        <rect x="20" y="10" width="6" height="6" fill="#fef08a" />
        {/* Pupil Mata Hitam */}
        <rect x="12" y="11" width="3" height="4" fill="#0f172a" />
        <rect x="21" y="11" width="3" height="4" fill="#0f172a" />
        {/* Kilauan Cahaya Mata (Specular Glint) */}
        <rect x="12" y="11" width="1" height="1" fill="#ffffff" />
        <rect x="21" y="11" width="1" height="1" fill="#ffffff" />

        {/* 9. Paruh Segitiga Oranye (Beak) */}
        <rect x="16" y="14" width="4" height="4" fill="#ea580c" />
        <rect x="17" y="15" width="2" height="2" fill="#f97316" />
        {talking && (
          <rect x="17" y="17" width="2" height="2" fill="#9a3412" />
        )}

        {/* 10. Topi Wisudawan / Pet Peneliti Opsional bila mode 'wise' */}
        {mood === 'wise' && (
          <>
            <rect x="13" y="1" width="10" height="2" fill="#1e293b" />
            <rect x="11" y="3" width="14" height="2" fill="#0f172a" />
            <rect x="17" y="0" width="2" height="2" fill="#f59e0b" />
            <rect x="23" y="3" width="2" height="3" fill="#f59e0b" />
          </>
        )}

        {/* 11. Cakar Burung Hantu Kecil di Bawah */}
        <rect x="12" y="29" width="4" height="2" fill="#f59e0b" />
        <rect x="20" y="29" width="4" height="2" fill="#f59e0b" />
        <rect x="13" y="30" width="2" height="2" fill="#d97706" />
        <rect x="21" y="30" width="2" height="2" fill="#d97706" />
      </svg>
    </div>
  );
};
