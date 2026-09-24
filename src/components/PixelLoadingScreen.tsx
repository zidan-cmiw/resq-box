// ── src/components/PixelLoadingScreen.tsx ─────────────────────────────────────
// Layar Loading Animasi 2D Pixel Art Retro Tema Petualangan & Mitigasi Geologi
// Menampilkan satelit radar berdenyut, explorer bobbing, progress bar bertingkat, dan pesan status bertahap.

import { useEffect, useState } from 'react';
import PixelIcon from './PixelIcon';

import type { PixelIconType } from './PixelIcon';

interface PixelLoadingScreenProps {
  title?: string;
  subtitle?: string;
  durationMs?: number; // Total loading time if auto-completing (default: 3200ms)
  onComplete?: () => void;
  fullScreen?: boolean;
}

const EXPEDITION_TIPS: { icon: PixelIconType; text: string }[] = [
  { icon: 'satellite', text: 'Menghubungkan transmisi radar satelit mitigasi...' },
  { icon: 'map', text: 'Membaca peta topografi lempeng tektonik Indonesia...' },
  { icon: 'backpack', text: 'Memeriksa ransel perlengkapan darurat & kotak P3K...' },
  { icon: 'volcano', text: 'Memindai aktivitas seismik dan status magma...' },
  { icon: 'lightning', text: 'Menyiapkan jalur evakuasi zona aman...' },
  { icon: 'check', text: 'Posko terhubung! Memulai simulasi petualangan...' },
];

export default function PixelLoadingScreen({
  title = 'MEMUAT PETUALANGAN...',
  subtitle = 'Menghubungkan ke posko komando mitigasi geologi',
  durationMs = 3200,
  onComplete,
  fullScreen = true,
}: PixelLoadingScreenProps) {
  const [progress, setProgress] = useState(5);
  const [tipIndex, setTipIndex] = useState(0);
  const [radarStep, setRadarStep] = useState(0);

  // Radar scanning step animation
  useEffect(() => {
    const radarInterval = setInterval(() => {
      setRadarStep((prev) => (prev + 1) % 4);
    }, 250);
    return () => clearInterval(radarInterval);
  }, []);

  // Progress Bar timing
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / durationMs) * 100));
      setProgress(pct);

      // Change tip smoothly as progress advances
      const newTipIndex = Math.min(
        EXPEDITION_TIPS.length - 1,
        Math.floor((pct / 100) * EXPEDITION_TIPS.length)
      );
      setTipIndex(newTipIndex);

      if (pct >= 100) {
        clearInterval(interval);
        if (onComplete) {
          setTimeout(onComplete, 350);
        }
      }
    }, 50);

    return () => clearInterval(interval);
  }, [durationMs, onComplete]);

  // 16 segmented chunky pixel blocks for progress bar
  const totalBlocks = 16;
  const activeBlocks = Math.min(totalBlocks, Math.floor((progress / 100) * totalBlocks) + (progress > 0 ? 1 : 0));

  return (
    <div
      className={`${
        fullScreen ? 'fixed inset-0 z-50' : 'w-full h-full'
      } bg-[#050813]/95 backdrop-blur-md flex flex-col items-center justify-center p-4 font-pixel select-none animate-fade-in`}
    >
      {/* Background Pixel Grid Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

      {/* ── CENTRAL RETRO COMMAND TERMINAL CARD ── */}
      <div className="relative z-10 w-full max-w-[460px] bg-[#fef3c7] border-4 border-[#3e1f07] rounded-3xl p-6 md:p-8 shadow-[0_14px_0_#231206,0_25px_50px_rgba(0,0,0,0.9)] space-y-5 text-center transition-all">
        {/* 4 Golden Pixel Corner Rivets */}
        <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 bg-amber-400 border-2 border-amber-950 shadow-sm" />
        <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 bg-amber-400 border-2 border-amber-950 shadow-sm" />
        <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 bg-amber-400 border-2 border-amber-950 shadow-sm" />
        <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 bg-amber-400 border-2 border-amber-950 shadow-sm" />

        {/* ── 2D PIXEL ART DUAL ANIMATION (RADAR + RESCUE EXPEDITION BEACON) ── */}
        <div className="flex items-center justify-center gap-4 pt-1">
          {/* Radar Box */}
          <div className="relative w-24 h-24 bg-amber-950 rounded-2xl border-4 border-amber-800 flex items-center justify-center shadow-[inset_0_4px_0_rgba(0,0,0,0.4)] overflow-hidden">
            {/* Animated Radar Pulse Rings */}
            <div className="absolute inset-2 rounded-full border border-emerald-400/30 animate-ping" />
            <div className="absolute inset-4 rounded-full border border-emerald-400/50 animate-pulse" />

            {/* Radar Grid Crosshair */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
              <div className="w-full h-[1px] bg-emerald-400" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
              <div className="h-full w-[1px] bg-emerald-400" />
            </div>

            {/* Pixel Radar Dish SVG */}
            <svg
              viewBox="0 0 24 24"
              className="w-14 h-14 relative z-10"
              shapeRendering="crispEdges"
            >
              {/* Antenna Mast */}
              <rect x="11" y="12" width="2" height="9" fill="#94a3b8" />
              <rect x="7" y="19" width="10" height="2" fill="#475569" />
              <rect x="5" y="21" width="14" height="2" fill="#1e293b" />

              {/* Parabolic Dish Bowl */}
              <rect x="5" y="6" width="2" height="8" fill="#f8fafc" />
              <rect x="7" y="4" width="2" height="12" fill="#f8fafc" />
              <rect x="9" y="3" width="2" height="14" fill="#e2e8f0" />
              <rect x="11" y="4" width="2" height="12" fill="#cbd5e1" />

              {/* Feed Horn & Signal Transmitter */}
              <rect x="13" y="9" width="5" height="2" fill="#f59e0b" />
              <rect x="17" y="8" width="3" height="4" fill="#ef4444" />
              {/* Glowing Blinking Pixel Beacon Light */}
              <rect
                x="18"
                y="7"
                width="2"
                height="2"
                fill={radarStep % 2 === 0 ? '#fde047' : '#ef4444'}
              />

              {/* Radiating Signal Waves (Pixel Arcs based on radarStep) */}
              {radarStep >= 1 && <rect x="20" y="5" width="2" height="2" fill="#38bdf8" />}
              {radarStep >= 2 && <rect x="22" y="8" width="2" height="4" fill="#38bdf8" />}
              {radarStep >= 3 && <rect x="20" y="13" width="2" height="2" fill="#38bdf8" />}
            </svg>
          </div>

          {/* Cute 2D Pixel Explorer Sprite Box */}
          <div className="relative w-24 h-24 bg-amber-950 rounded-2xl border-4 border-amber-800 flex items-center justify-center shadow-[inset_0_4px_0_rgba(0,0,0,0.4)] overflow-hidden">
            <svg
              viewBox="0 0 24 24"
              className={`w-14 h-14 relative z-10 transition-transform duration-200 ${
                radarStep % 2 === 0 ? 'translate-y-0.5' : '-translate-y-0.5'
              }`}
              shapeRendering="crispEdges"
            >
              {/* Explorer Hat */}
              <rect x="7" y="3" width="10" height="2" fill="#d97706" />
              <rect x="5" y="5" width="14" height="2" fill="#b45309" />

              {/* Head / Face */}
              <rect x="7" y="7" width="10" height="6" fill="#fcd34d" />
              {/* Eyes */}
              <rect x="9" y="9" width="2" height="2" fill="#1e293b" />
              <rect x="13" y="9" width="2" height="2" fill="#1e293b" />

              {/* Rescue Uniform (Red/Orange Vest) */}
              <rect x="7" y="13" width="10" height="5" fill="#ea580c" />
              <rect x="9" y="14" width="6" height="3" fill="#fde047" />
              {/* Backpack */}
              <rect x="5" y="13" width="2" height="5" fill="#78350f" />

              {/* Legs / Boots */}
              <rect x="8" y="18" width="3" height="3" fill="#1e293b" />
              <rect x="13" y="18" width="3" height="3" fill="#1e293b" />
            </svg>

            {/* Stepped shadow underneath */}
            <div className="absolute bottom-2 w-12 h-1.5 bg-black/40 rounded-full" />
          </div>
        </div>

        {/* ── TITLE & SUBTITLE ── */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-950 text-amber-300 border-2 border-amber-500 shadow-[0_2px_0_#451a03]">
            <PixelIcon name="compass" size={14} className="text-emerald-400 animate-spin" />
            <span className="font-pixel-title text-xs tracking-wider uppercase">{title}</span>
          </div>
          <p className="text-xs text-amber-950 font-bold leading-relaxed px-2">{subtitle}</p>
        </div>

        {/* ── 2D SEGMENTED CHUNKY PIXEL PROGRESS BAR ── */}
        <div className="space-y-2 pt-1">
          <div className="flex justify-between items-center text-[11px] font-pixel-title font-bold text-amber-950 px-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
              STATUS TRANSMISI
            </span>
            <span className="font-pixel-title text-xs text-emerald-900 font-black tracking-wider">
              {progress}%
            </span>
          </div>

          {/* Progress Bar Frame */}
          <div className="p-2 bg-amber-950 rounded-2xl border-4 border-amber-900 shadow-[inset_0_4px_0_rgba(0,0,0,0.6)]">
            <div className="grid grid-cols-16 gap-1 h-5">
              {Array.from({ length: totalBlocks }).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-full rounded-xs transition-all duration-150 ${
                    idx < activeBlocks
                      ? 'bg-gradient-to-t from-emerald-600 via-emerald-400 to-emerald-200 border-t-2 border-emerald-100 shadow-[0_0_10px_rgba(52,211,153,0.9)]'
                      : 'bg-amber-950/70 border border-amber-900/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── DYNAMIC STATUS LOG CONTAINER ── */}
        <div className="p-3 bg-amber-100/95 rounded-2xl border-2 border-amber-950/30 text-[11px] font-bold text-amber-950 flex items-center justify-center gap-2 min-h-[44px] shadow-inner">
          <PixelIcon name={EXPEDITION_TIPS[tipIndex].icon} size={16} className="shrink-0 animate-bounce" />
          <span className="transition-all duration-300 leading-snug">{EXPEDITION_TIPS[tipIndex].text}</span>
        </div>
      </div>
    </div>
  );
}

