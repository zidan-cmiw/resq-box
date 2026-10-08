// ── src/components/Tutorial/ResqyTutorialOverlay.tsx ─────────────────────
// Komponen Tutorial In-Game Interaktif (Gaya RPG / Mobile Legends Walkthrough)
// Dipandu oleh Resqy si Burung Hantu Bijak dengan Spotlight Highlight & Speech Box
// Desain 100% Responsif untuk Mobile Smartphone, Tablet, Laptop, dan Desktop

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ResqyMascot } from '../ResqyMascot';
import PixelIcon from '../PixelIcon';
import { retroAudio } from '../../utils/retroAudio';
import {
  type TutorialTourConfig,
  isTutorialCompleted,
  setTutorialCompleted,
} from './tutorialConfig';

interface ResqyTutorialOverlayProps {
  tour: TutorialTourConfig;
  userId?: string;
  autoStart?: boolean;
  onComplete?: () => void;
  onSkip?: () => void;
  showFloatingTrigger?: boolean;
}

export const ResqyTutorialOverlay: React.FC<ResqyTutorialOverlayProps> = ({
  tour,
  userId,
  autoStart = true,
  onComplete,
  onSkip,
  showFloatingTrigger = true,
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);
  const [winSize, setWinSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  const activeStep = tour.steps[currentStepIdx] || null;
  const overlayRef = useRef<HTMLDivElement>(null);

  // Periksa apakah tutorial sudah pernah diselesaikan
  useEffect(() => {
    if (autoStart) {
      const alreadyDone = isTutorialCompleted(tour.key, userId);
      if (!alreadyDone) {
        // Beri sedikit jeda agar DOM target selesai di-render
        const timer = setTimeout(() => {
          setIsActive(true);
          setCurrentStepIdx(0);
          retroAudio.playHover();
        }, 400);
        return () => clearTimeout(timer);
      }
    }
  }, [tour.key, userId, autoStart]);

  // Update ukuran window dan posisi highlight target
  const updateHighlight = useCallback(() => {
    if (!activeStep || !activeStep.targetSelector) {
      setHighlightRect(null);
      return;
    }

    const targetEl = document.querySelector(activeStep.targetSelector);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setHighlightRect(targetEl.getBoundingClientRect());

      // Ambil ulang posisi setelah animasi scroll browser selesai
      const timer = setTimeout(() => {
        const el = document.querySelector(activeStep.targetSelector!);
        if (el) {
          setHighlightRect(el.getBoundingClientRect());
        }
      }, 250);
      return () => clearTimeout(timer);
    } else {
      setHighlightRect(null);
    }
  }, [activeStep]);

  useEffect(() => {
    const handleResize = () => {
      setWinSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      updateHighlight();
    };

    if (isActive) {
      updateHighlight();
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', updateHighlight, true);
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', updateHighlight, true);
      };
    }
  }, [isActive, updateHighlight]);

  // Navigasi Langkah
  const handleNext = () => {
    retroAudio.playSelect();
    if (currentStepIdx < tour.steps.length - 1) {
      setCurrentStepIdx((prev) => prev + 1);
    } else {
      // Selesai Tour
      retroAudio.playWin();
      setTutorialCompleted(tour.key, userId);
      setIsActive(false);
      onComplete?.();
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      retroAudio.playHover();
      setCurrentStepIdx((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    retroAudio.playSelect();
    setTutorialCompleted(tour.key, userId);
    setIsActive(false);
    onSkip?.();
  };

  const handleManualStart = () => {
    retroAudio.playSelect();
    setCurrentStepIdx(0);
    setIsActive(true);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isActive) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // ── ALGORITMA PENEMPATAN RESPONSIF & BEBAS TABRAKAN (ANTI-OVERFLOW) ──
  // Menjamin:
  // 1. Elemen target TIDAK TERTUTUPI oleh dialog kartu Resqy.
  // 2. Dialog kartu TIDAK PERNAH terpotong di tepi layar (atas, bawah, kiri, kanan).
  // 3. Di mobile / tablet portrait, kartu dipusatkan horizontal dengan batasan tinggi adaptif.
  // 4. Di widescreen desktop, penempatan samping hanya aktif jika ruang samping benar-benar lega (>= 480px).
  const getCollisionFreePosition = () => {
    const winW = winSize.width;
    const winH = winSize.height;
    const isMobile = winW < 640;
    const edgePad = isMobile ? 10 : 16;

    if (!highlightRect) {
      // Langkah pembuka tanpa target: Di tengah layar
      return {
        containerClass:
          'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] sm:w-[90%] md:w-[86%] max-w-[680px]',
        containerStyle: {
          maxHeight: `${Math.min(winH - edgePad * 2, 600)}px`,
        } as React.CSSProperties,
      };
    }

    const targetTop = highlightRect.top;
    const targetBottom = highlightRect.bottom;
    const targetLeft = highlightRect.left;
    const targetRight = highlightRect.right;
    const targetCenterY = targetTop + highlightRect.height / 2;

    const spaceRight = Math.max(0, winW - targetRight - edgePad);
    const spaceLeft = Math.max(0, targetLeft - edgePad);
    const spaceAbove = Math.max(0, targetTop - edgePad);
    const spaceBelow = Math.max(0, winH - targetBottom - edgePad);

    // ── 1. PENEMPATAN SAMPING (HANYA LAYAR WIDESCREEN >= 1150px DENGAN RUANG >= 480px) ──
    const canSideWidescreen = winW >= 1150;
    const canFitRight =
      canSideWidescreen &&
      spaceRight >= 480 &&
      activeStep?.placement === 'right';
    const canFitLeft =
      canSideWidescreen &&
      spaceLeft >= 480 &&
      activeStep?.placement === 'left';

    if (canFitRight) {
      const cardW = Math.min(540, spaceRight - 16);
      const idealTop = targetCenterY - 150;
      const topPos = Math.max(edgePad, Math.min(winH - 360, idealTop));
      const maxH = Math.max(240, winH - topPos - edgePad);
      return {
        containerClass: 'fixed',
        containerStyle: {
          left: `${targetRight + 14}px`,
          top: `${topPos}px`,
          width: `${cardW}px`,
          maxHeight: `${maxH}px`,
        } as React.CSSProperties,
      };
    }

    if (canFitLeft) {
      const cardW = Math.min(540, spaceLeft - 16);
      const idealTop = targetCenterY - 150;
      const topPos = Math.max(edgePad, Math.min(winH - 360, idealTop));
      const maxH = Math.max(240, winH - topPos - edgePad);
      const leftPos = Math.max(edgePad, targetLeft - cardW - 14);
      return {
        containerClass: 'fixed',
        containerStyle: {
          left: `${leftPos}px`,
          top: `${topPos}px`,
          width: `${cardW}px`,
          maxHeight: `${maxH}px`,
        } as React.CSSProperties,
      };
    }

    // ── 2. PENEMPATAN VERTIKAL (STANDAR RESPONSIF UNTUK SEMUA UKURAN LAYAR) ──
    const horizClass =
      'fixed left-1/2 -translate-x-1/2 w-[95%] sm:w-[90%] md:w-[86%] max-w-[680px]';

    let placeBelow = spaceBelow >= spaceAbove;
    if (activeStep?.placement === 'bottom' && spaceBelow >= 180) {
      placeBelow = true;
    } else if (activeStep?.placement === 'top' && spaceAbove >= 180) {
      placeBelow = false;
    }

    if (placeBelow) {
      // Ditaruh di BAWAH elemen target
      const topPos = Math.max(edgePad, targetBottom + 12);
      const maxH = Math.max(160, winH - topPos - edgePad);

      // Jika sisa ruang bawah sempit (< 180px) dan atas jauh lebih lega:
      if (maxH < 180 && spaceAbove > maxH) {
        const bottomOffset = Math.max(edgePad, winH - targetTop + 12);
        const maxHAbove = Math.max(160, winH - bottomOffset - edgePad);
        return {
          containerClass: horizClass,
          containerStyle: {
            bottom: `${bottomOffset}px`,
            maxHeight: `${maxHAbove}px`,
          } as React.CSSProperties,
        };
      }

      return {
        containerClass: horizClass,
        containerStyle: {
          top: `${topPos}px`,
          maxHeight: `${maxH}px`,
        } as React.CSSProperties,
      };
    } else {
      // Ditaruh di ATAS elemen target
      const bottomOffset = Math.max(edgePad, winH - targetTop + 12);
      const maxH = Math.max(160, winH - bottomOffset - edgePad);

      // Jika sisa ruang atas sempit (< 180px) dan bawah jauh lebih lega:
      if (maxH < 180 && spaceBelow > maxH) {
        const topPos = Math.max(edgePad, targetBottom + 12);
        const maxHBelow = Math.max(160, winH - topPos - edgePad);
        return {
          containerClass: horizClass,
          containerStyle: {
            top: `${topPos}px`,
            maxHeight: `${maxHBelow}px`,
          } as React.CSSProperties,
        };
      }

      return {
        containerClass: horizClass,
        containerStyle: {
          bottom: `${bottomOffset}px`,
          maxHeight: `${maxH}px`,
        } as React.CSSProperties,
      };
    }
  };

  const isMobile = winSize.width < 640;
  const dialogPos = getCollisionFreePosition();

  return (
    <>
      {/* ── 1. TOMBOL FLOATING PEMICU PANDUAN KAPAN SAJA ── */}
      {showFloatingTrigger && !isActive && (
        <button
          type="button"
          onClick={handleManualStart}
          onMouseEnter={() => retroAudio.playHover()}
          className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-40 bg-[#fef9c3] hover:bg-[#fef08a] text-[#451a03] border-2 sm:border-3 border-[#78350f] rounded-xl sm:rounded-2xl px-2.5 py-1.5 sm:px-3.5 sm:py-2 shadow-[0_3px_0_#451a03,0_8px_16px_rgba(0,0,0,0.4)] flex items-center gap-1.5 sm:gap-2.5 font-pixel-title text-[14.5px] sm:text-[13px] font-bold cursor-pointer transition-all hover:scale-105 active:scale-95 group"
          title="Buka Panduan Resqy untuk halaman ini"
        >
          <ResqyMascot size={isMobile ? 22 : 24} className="group-hover:animate-bounce-subtle shrink-0" />
          <span className="hidden sm:inline">PANDUAN RESQY</span>
          <span className="text-[12.5px] sm:text-[13.5px] bg-[#b45309] text-amber-50 px-1 sm:px-1.5 py-0.5 rounded font-pixel font-semibold">?</span>
        </button>
      )}

      {/* ── 2. MODAL OVERLAY PANDUAN INTERAKTIF RESPONSIF ── */}
      {isActive && activeStep && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[999999] resqy-tutorial-overlay overflow-hidden select-none animate-fade-in font-['Plus_Jakarta_Sans',sans-serif]"
          style={{ pointerEvents: 'auto' }}
        >
          {/* A. Dark Backdrop dengan SVG Mask Spotlight Cutout (Elemen target 100% tampak dengan warna aslinya) */}
          {highlightRect ? (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none transition-all duration-300 ease-out"
              style={{ width: '100vw', height: '100vh' }}
            >
              <defs>
                <mask id="resqy-spotlight-mask">
                  <rect x="0" y="0" width="100%" height="100%" fill="#ffffff" />
                  <rect
                    x={Math.max(0, highlightRect.left - 6)}
                    y={Math.max(0, highlightRect.top - 6)}
                    width={highlightRect.width + 12}
                    height={highlightRect.height + 12}
                    rx="12"
                    ry="12"
                    fill="#000000"
                  />
                </mask>
              </defs>
              <rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                fill="rgba(5, 8, 19, 0.82)"
                mask="url(#resqy-spotlight-mask)"
              />
            </svg>
          ) : (
            <div className="absolute inset-0 bg-[#050813]/82" />
          )}

          {/* B. Spotlight Highlight Border Frame & Badge Penunjuk */}
          {highlightRect && (
            <div
              className="absolute pointer-events-none transition-all duration-300 ease-out"
              style={{
                top: Math.max(0, highlightRect.top - 6),
                left: Math.max(0, highlightRect.left - 6),
                width: highlightRect.width + 12,
                height: highlightRect.height + 12,
                borderRadius: '12px',
                border: '3px solid #f59e0b',
                boxShadow: '0 0 24px rgba(245, 158, 11, 0.9), 0 0 8px rgba(251, 191, 36, 0.6)',
                backgroundColor: 'transparent',
              }}
            >
              {/* Pulsing Corner Badge yang adaptif agar tidak terpotong tepi layar */}
              <div
                className="absolute bg-[#b45309] text-amber-100 border border-[#78350f] px-2 py-0.5 rounded-md font-pixel-title text-[12.5px] font-bold shadow-md animate-pulse whitespace-nowrap"
                style={{
                  left: highlightRect.left < 24 ? '4px' : '-8px',
                  top: highlightRect.top < 26 ? 'auto' : '-13px',
                  bottom: highlightRect.top < 26 ? '-13px' : 'auto',
                }}
              >
                FITUR INI {highlightRect.top < 26 ? '▲' : '▼'}
              </div>
            </div>
          )}

          {/* C. Kotak Dialog Panduan Resqy 100% Responsif */}
          <div
            className={`transition-all duration-300 z-[999999] ${dialogPos.containerClass}`}
            style={dialogPos.containerStyle}
          >
            {/* Main Parchment Board (Flex Col dengan Scroll Internal Halus) */}
            <div
              className="relative bg-[#fef9c3] border-3 sm:border-4 md:border-[5px] border-[#78350f] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 md:p-6 shadow-[0_6px_0_#451a03,0_16px_36px_rgba(0,0,0,0.65)] text-[#291305] flex flex-col justify-between w-full overflow-hidden"
              style={{ maxHeight: 'inherit' }}
            >
              {/* 1. Header Bar: Maskot + Badge + Judul + Tombol Tutup */}
              <div className="flex items-center justify-between gap-2 pb-2 mb-2 sm:pb-3 sm:mb-2.5 border-b-2 sm:border-b-3 border-[#b45309]/30 shrink-0">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="shrink-0 drop-shadow-md">
                    <ResqyMascot size={isMobile ? 38 : 52} talking={true} mood="wise" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-0.5">
                      <span className="px-2 py-0.5 rounded-md bg-[#b45309] text-amber-50 font-pixel-title text-[12.5px] sm:text-[13px] font-bold tracking-wider shadow-sm">
                        {activeStep.badge || 'PANDUAN RESQY'}
                      </span>
                      <span className="text-[13.5px] sm:text-[13px] text-[#78350f] font-pixel-title font-bold">
                        ({currentStepIdx + 1}/{tour.steps.length})
                      </span>
                    </div>
                    <h3 className="font-pixel-title text-[13px] sm:text-base md:text-lg lg:text-xl text-[#2e0e02] font-black leading-tight break-words">
                      {activeStep.title}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSkip}
                  className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-lg sm:rounded-xl bg-[#b45309] hover:bg-[#92400e] text-amber-100 border-2 border-[#451a03] font-pixel text-[13px] sm:text-[15px] flex items-center justify-center cursor-pointer active:translate-y-0.5 shadow-[0_2px_0_#451a03] shrink-0 transition-colors font-semibold"
                  title="Lewati panduan ini"
                >
                  ✕
                </button>
              </div>

              {/* 2. Isi Narasi Utama & Petunjuk Aksi (Scrollable Internal) */}
              <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain pr-1 custom-scrollbar">
                <p className="font-pixel text-[13px] sm:text-[15px] md:text-base lg:text-lg leading-relaxed text-[#1a0800] font-extrabold tracking-normal whitespace-pre-line py-1">
                  {activeStep.content}
                </p>

                {activeStep.actionHint && (
                  <div className="mt-2 pt-2 sm:mt-2.5 sm:pt-2.5 border-t-2 border-[#b45309]/25 flex items-start gap-2 sm:gap-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-amber-700/20 text-[#78350f] border border-[#b45309]/40 font-pixel-title text-[12.5px] sm:text-[14.5px] font-bold shrink-0 mt-0.5">
                      PETUNJUK AKSI
                    </span>
                    <p className="font-pixel text-[13px] sm:text-[15px] md:text-base leading-relaxed text-[#2e0e02] font-extrabold italic">
                      {activeStep.actionHint}
                    </p>
                  </div>
                )}
              </div>

              {/* 3. Footer Bar: Tombol di Atas, Indikator Titik Langkah di Bawah (Agar Tombol Tidak Tergeser ke Kanan) */}
              <div className="mt-2.5 pt-2 sm:mt-3 sm:pt-2.5 border-t-2 sm:border-t-3 border-[#b45309]/30 shrink-0 flex flex-col gap-2">
                {/* A. Baris Tombol Aksi (Penuh dan Lega, Bebas Terpotong) */}
                <div className="flex items-center justify-between gap-2 sm:gap-3 w-full">
                  {currentStepIdx > 0 ? (
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-amber-200/90 hover:bg-amber-300 text-[#78350f] border-2 border-[#b45309] font-pixel-title text-[13px] sm:text-[15px] font-bold transition-all cursor-pointer active:translate-y-0.5 shadow-sm whitespace-nowrap flex items-center justify-center gap-1 shrink-0"
                    >
                      <span>&lt;</span>
                      <span>SEBELUMNYA</span>
                    </button>
                  ) : (
                    <div className="w-1" />
                  )}

                  <button aria-label="Lanjut ke langkah berikutnya"
                    type="button"
                    onClick={handleNext}
                    className="px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-50 border-2 sm:border-3 border-[#451a03] shadow-[0_3px_0_#231206] text-[13px] sm:text-[15px] md:text-base font-pixel-title cursor-pointer active:translate-y-0.5 flex items-center justify-center gap-1.5 sm:gap-2 transition-all font-bold whitespace-nowrap shrink-0"
                  >
                    <PixelIcon name="check" size={16} className="text-amber-200 shrink-0" />
                    <span>
                      {currentStepIdx === tour.steps.length - 1
                        ? 'SAYA MENGERTI! ✓'
                        : 'LANJUTKAN >'}
                    </span>
                  </button>
                </div>

                {/* B. Baris Indikator Titik Langkah (Diposisikan di Bawah Tombol) */}
                <div className="flex items-center justify-center gap-2 pt-1 border-t border-[#b45309]/15 w-full">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center">
                    {tour.steps.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          retroAudio.playHover();
                          setCurrentStepIdx(idx);
                        }}
                        className={`h-2 sm:h-2.5 rounded-full transition-all cursor-pointer ${
                          idx === currentStepIdx
                            ? 'w-6 sm:w-8 bg-[#b45309]'
                            : idx < currentStepIdx
                            ? 'w-2 sm:w-2.5 bg-emerald-600'
                            : 'w-2 sm:w-2.5 bg-amber-200 border border-[#b45309]/40'
                        }`}
                        title={`Menuju langkah ${idx + 1}`}
                      />
                    ))}
                  </div>
                  <span className="text-[13.5px] sm:text-[13px] text-[#78350f] font-pixel-title font-bold shrink-0 ml-1">
                    ({currentStepIdx + 1}/{tour.steps.length})
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResqyTutorialOverlay;
