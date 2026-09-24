// ── components/PixelTrophy.tsx ──────────────────────────────────────────────
// Komponen 2D Pixel Art Trophy SVG dengan kilauan emas & bintang pixel

interface PixelTrophyProps {
  size?: number;
  className?: string;
  showSparkles?: boolean;
}

export default function PixelTrophy({ size = 80, className = '', showSparkles = true }: PixelTrophyProps) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        className="w-full h-full drop-shadow-[0_4px_0_rgba(0,0,0,0.35)]"
        shapeRendering="crispEdges"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ── SPARKLE STARS (Top Left & Top Right) ── */}
        {showSparkles && (
          <>
            {/* Left Sparkle (Cyan/White) */}
            <g className="animate-pulse" opacity="0.9">
              <rect x="3" y="4" width="2" height="2" fill="#ffffff" />
              <rect x="2" y="5" width="4" height="1" fill="#bae6fd" />
              <rect x="3.5" y="3" width="1" height="4" fill="#38bdf8" />
            </g>
            {/* Right Sparkle (Yellow/White) */}
            <g className="animate-pulse" opacity="0.95" style={{ animationDelay: '400ms' }}>
              <rect x="26" y="2" width="2" height="2" fill="#ffffff" />
              <rect x="25" y="3" width="4" height="1" fill="#fef08a" />
              <rect x="26.5" y="1" width="1" height="4" fill="#facc15" />
            </g>
            {/* Small Bottom Sparkle */}
            <g className="animate-pulse" opacity="0.8" style={{ animationDelay: '800ms' }}>
              <rect x="28" y="16" width="2" height="2" fill="#ffffff" />
            </g>
          </>
        )}

        {/* ── TROPHY OUTLINE (Dark Pixel Border) ── */}
        {/* Handles Outline */}
        <rect x="4" y="6" width="5" height="2" fill="#3b1506" />
        <rect x="4" y="8" width="2" height="5" fill="#3b1506" />
        <rect x="5" y="13" width="4" height="2" fill="#3b1506" />

        <rect x="23" y="6" width="5" height="2" fill="#3b1506" />
        <rect x="26" y="8" width="2" height="5" fill="#3b1506" />
        <rect x="23" y="13" width="4" height="2" fill="#3b1506" />

        {/* Cup Rim Outline */}
        <rect x="8" y="4" width="16" height="2" fill="#3b1506" />

        {/* Cup Body Outline */}
        <rect x="7" y="6" width="2" height="8" fill="#3b1506" />
        <rect x="23" y="6" width="2" height="8" fill="#3b1506" />
        <rect x="8" y="14" width="2" height="2" fill="#3b1506" />
        <rect x="22" y="14" width="2" height="2" fill="#3b1506" />
        <rect x="10" y="16" width="12" height="2" fill="#3b1506" />

        {/* Stem Outline */}
        <rect x="13" y="18" width="6" height="4" fill="#3b1506" />

        {/* Base Pedestal Outline */}
        <rect x="10" y="22" width="12" height="2" fill="#3b1506" />
        <rect x="7" y="24" width="18" height="2" fill="#3b1506" />
        <rect x="6" y="26" width="20" height="4" fill="#3b1506" />

        {/* ── TROPHY HANDLES INNER COLOR ── */}
        <rect x="6" y="8" width="2" height="4" fill="#f59e0b" />
        <rect x="24" y="8" width="2" height="4" fill="#d97706" />

        {/* ── CUP RIM FILL ── */}
        <rect x="9" y="5" width="14" height="1" fill="#fef08a" />

        {/* ── CUP BODY MAIN GOLD FILL ── */}
        <rect x="9" y="6" width="14" height="8" fill="#facc15" />
        <rect x="10" y="14" width="12" height="2" fill="#f59e0b" />

        {/* ── CUP HIGHLIGHTS (Left Side Light Glint) ── */}
        <rect x="9" y="6" width="3" height="7" fill="#fef9c3" />
        <rect x="10" y="7" width="1" height="5" fill="#ffffff" />
        <rect x="10" y="13" width="2" height="1" fill="#fef9c3" />

        {/* ── CUP SHADOWS (Right Side Ambient Shadow) ── */}
        <rect x="20" y="6" width="3" height="7" fill="#d97706" />
        <rect x="21" y="7" width="2" height="6" fill="#b45309" />
        <rect x="19" y="14" width="3" height="1" fill="#b45309" />

        {/* ── EMBOSSED STAR ON CUP ── */}
        <rect x="15" y="9" width="2" height="2" fill="#ffffff" />
        <rect x="14" y="9.5" width="4" height="1" fill="#ffffff" />
        <rect x="15.5" y="8" width="1" height="4" fill="#ffffff" />

        {/* ── STEM (PILLAR) ── */}
        <rect x="14" y="18" width="4" height="3" fill="#f59e0b" />
        <rect x="14" y="18" width="1" height="3" fill="#fef08a" />
        <rect x="17" y="18" width="1" height="3" fill="#b45309" />

        {/* ── BASE PEDESTAL (Wood & Gold) ── */}
        {/* Upper tier */}
        <rect x="11" y="22" width="10" height="1" fill="#d97706" />
        <rect x="11" y="22" width="2" height="1" fill="#fef08a" />
        {/* Mid tier */}
        <rect x="8" y="24" width="16" height="1" fill="#b45309" />
        <rect x="8" y="24" width="2" height="1" fill="#facc15" />
        {/* Bottom tier (Wood Plinth) */}
        <rect x="7" y="26" width="18" height="3" fill="#78350f" />
        <rect x="7" y="26" width="2" height="3" fill="#9a3412" />
        <rect x="23" y="26" width="2" height="3" fill="#451a03" />

        {/* Gold Plaque on Base */}
        <rect x="11" y="27" width="10" height="1.5" fill="#fef08a" />
        <rect x="13" y="27" width="6" height="1.5" fill="#facc15" />
      </svg>
    </div>
  );
}
