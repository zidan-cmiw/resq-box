// ── PixelIcons.tsx ──────────────────────────────────────────────────────────
// Crisp 2D Pixel-Art SVG Icons (No standard emojis)
// Styled to match the 8-bit / 16-bit retro aesthetic of RESQ-BOX.

interface PixelIconProps {
  name:
    | 'crust'
    | 'mantle'
    | 'outer-core'
    | 'inner-core'
    | 'chest-closed'
    | 'chest-open'
    | 'volcano'
    | 'convergent'
    | 'divergent'
    | 'transform'
    | 'map'
    | 'compass'
    | 'ocean'
    | 'mountain'
    | 'ruler'
    | 'shield'
    | 'alert'
    | 'search'
    | 'cursor'
    | 'play'
    | string;
  size?: number;
  className?: string;
}

export default function PixelIcon({ name, size = 18, className = '' }: PixelIconProps) {
  const commonSvgProps = {
    width: size,
    height: size,
    viewBox: '0 0 16 16',
    fill: 'currentColor',
    className: `inline-block shrink-0 ${className}`,
    style: { shapeRendering: 'crispEdges' as const },
  };

  switch (name) {
    case 'crust':
      // 2D Pixel Rock / Stone Block
      return (
        <svg {...commonSvgProps}>
          <rect x="3" y="3" width="10" height="10" fill="#78716c" />
          <rect x="3" y="3" width="10" height="2" fill="#a8a29e" />
          <rect x="3" y="3" width="2" height="10" fill="#a8a29e" />
          <rect x="11" y="3" width="2" height="10" fill="#57534e" />
          <rect x="3" y="11" width="10" height="2" fill="#44403c" />
          <rect x="6" y="6" width="2" height="2" fill="#d6d3d1" />
          <rect x="9" y="8" width="2" height="2" fill="#57534e" />
        </svg>
      );

    case 'mantle':
      // 2D Pixel Flame / Magma
      return (
        <svg {...commonSvgProps}>
          <rect x="7" y="2" width="2" height="3" fill="#fbbf24" />
          <rect x="5" y="4" width="6" height="3" fill="#f97316" />
          <rect x="4" y="6" width="8" height="4" fill="#ea580c" />
          <rect x="3" y="9" width="10" height="5" fill="#c2410c" />
          <rect x="6" y="8" width="4" height="4" fill="#facc15" />
          <rect x="7" y="6" width="2" height="2" fill="#fef08a" />
        </svg>
      );

    case 'outer-core':
      // 2D Pixel Molten Vortex / Swirl
      return (
        <svg {...commonSvgProps}>
          <rect x="4" y="3" width="8" height="10" fill="#dc2626" />
          <rect x="3" y="4" width="10" height="8" fill="#ef4444" />
          <rect x="5" y="5" width="6" height="6" fill="#f87171" />
          <rect x="7" y="7" width="2" height="2" fill="#fef08a" />
          <rect x="2" y="7" width="2" height="2" fill="#991b1b" />
          <rect x="12" y="7" width="2" height="2" fill="#991b1b" />
        </svg>
      );

    case 'inner-core':
      // 2D Pixel Crystal / Solid Core
      return (
        <svg {...commonSvgProps}>
          <rect x="7" y="2" width="2" height="2" fill="#fef08a" />
          <rect x="5" y="4" width="6" height="2" fill="#fde047" />
          <rect x="3" y="6" width="10" height="4" fill="#facc15" />
          <rect x="5" y="10" width="6" height="2" fill="#eab308" />
          <rect x="7" y="12" width="2" height="2" fill="#ca8a04" />
          <rect x="6" y="6" width="4" height="4" fill="#ffffff" />
        </svg>
      );

    case 'chest-closed':
      // 2D Pixel Wooden Chest (Closed)
      return (
        <svg {...commonSvgProps}>
          <rect x="2" y="3" width="12" height="10" fill="#78350f" />
          <rect x="2" y="3" width="12" height="3" fill="#92400e" />
          <rect x="2" y="3" width="2" height="10" fill="#b45309" />
          <rect x="12" y="3" width="2" height="10" fill="#451a03" />
          <rect x="2" y="11" width="12" height="2" fill="#451a03" />
          {/* Iron straps */}
          <rect x="5" y="3" width="2" height="10" fill="#d97706" />
          <rect x="9" y="3" width="2" height="10" fill="#d97706" />
          {/* Gold lock */}
          <rect x="7" y="7" width="2" height="3" fill="#facc15" />
          <rect x="7" y="8" width="2" height="1" fill="#451a03" />
        </svg>
      );

    case 'chest-open':
      // 2D Pixel Wooden Chest (Open with glowing book/treasure)
      return (
        <svg {...commonSvgProps}>
          {/* Open lid */}
          <rect x="1" y="1" width="14" height="3" fill="#b45309" />
          <rect x="2" y="2" width="12" height="1" fill="#fde047" />
          {/* Chest base */}
          <rect x="2" y="6" width="12" height="7" fill="#78350f" />
          <rect x="2" y="11" width="12" height="2" fill="#451a03" />
          {/* Glow / Book inside */}
          <rect x="4" y="4" width="8" height="4" fill="#fef08a" />
          <rect x="6" y="5" width="4" height="2" fill="#38bdf8" />
          {/* Gold straps */}
          <rect x="5" y="6" width="2" height="7" fill="#d97706" />
          <rect x="9" y="6" width="2" height="7" fill="#d97706" />
        </svg>
      );

    case 'volcano':
      // 2D Pixel Volcano
      return (
        <svg {...commonSvgProps}>
          <polygon points="8,3 3,14 13,14" fill="#57534e" />
          <polygon points="8,3 5,9 11,9" fill="#78716c" />
          {/* Lava peak */}
          <rect x="7" y="2" width="2" height="2" fill="#ef4444" />
          <rect x="6" y="4" width="4" height="2" fill="#f97316" />
          <rect x="7" y="6" width="2" height="3" fill="#ef4444" />
        </svg>
      );

    case 'convergent':
      // 2D Pixel Converging Arrows
      return (
        <svg {...commonSvgProps}>
          {/* Left arrow pointing right */}
          <rect x="1" y="7" width="5" height="2" fill="#ef4444" />
          <polygon points="6,5 8,8 6,11" fill="#ef4444" />
          {/* Right arrow pointing left */}
          <rect x="10" y="7" width="5" height="2" fill="#ef4444" />
          <polygon points="10,5 8,8 10,11" fill="#ef4444" />
          {/* Collision spark */}
          <rect x="7" y="4" width="2" height="2" fill="#facc15" />
          <rect x="7" y="10" width="2" height="2" fill="#facc15" />
        </svg>
      );

    case 'divergent':
      // 2D Pixel Diverging Arrows
      return (
        <svg {...commonSvgProps}>
          {/* Central rift */}
          <rect x="7" y="2" width="2" height="12" fill="#f97316" />
          {/* Left arrow pointing left */}
          <rect x="4" y="7" width="3" height="2" fill="#38bdf8" />
          <polygon points="4,5 2,8 4,11" fill="#38bdf8" />
          {/* Right arrow pointing right */}
          <rect x="9" y="7" width="3" height="2" fill="#38bdf8" />
          <polygon points="12,5 14,8 12,11" fill="#38bdf8" />
        </svg>
      );

    case 'transform':
      // 2D Pixel Transform Slip Arrows
      return (
        <svg {...commonSvgProps}>
          {/* Top arrow right */}
          <rect x="2" y="4" width="8" height="2" fill="#eab308" />
          <polygon points="10,2 14,5 10,8" fill="#eab308" />
          {/* Bottom arrow left */}
          <rect x="6" y="10" width="8" height="2" fill="#ca8a04" />
          <polygon points="6,8 2,11 6,14" fill="#ca8a04" />
          {/* Center fault line */}
          <rect x="2" y="7" width="12" height="2" fill="#ef4444" opacity="0.8" />
        </svg>
      );

    case 'map':
      // 2D Pixel Map / Globe
      return (
        <svg {...commonSvgProps}>
          <rect x="2" y="2" width="12" height="12" fill="#0284c7" />
          <rect x="4" y="4" width="4" height="3" fill="#22c55e" />
          <rect x="9" y="5" width="4" height="4" fill="#16a34a" />
          <rect x="5" y="9" width="6" height="3" fill="#22c55e" />
          <rect x="2" y="2" width="12" height="1" fill="#38bdf8" />
          <rect x="2" y="13" width="12" height="1" fill="#0369a1" />
        </svg>
      );

    case 'compass':
      // 2D Pixel Directional Compass
      return (
        <svg {...commonSvgProps}>
          <rect x="3" y="3" width="10" height="10" fill="#1e293b" />
          <rect x="7" y="1" width="2" height="4" fill="#ef4444" />
          <polygon points="7,4 9,4 8,1" fill="#ef4444" />
          <rect x="7" y="11" width="2" height="4" fill="#94a3b8" />
          <polygon points="7,12 9,12 8,15" fill="#94a3b8" />
          <rect x="7" y="7" width="2" height="2" fill="#facc15" />
        </svg>
      );

    case 'ocean':
      // 2D Pixel Ocean Waves
      return (
        <svg {...commonSvgProps}>
          <rect x="2" y="3" width="5" height="2" fill="#38bdf8" />
          <rect x="9" y="3" width="5" height="2" fill="#38bdf8" />
          <rect x="1" y="7" width="6" height="2" fill="#0284c7" />
          <rect x="8" y="7" width="7" height="2" fill="#0284c7" />
          <rect x="2" y="11" width="12" height="3" fill="#0369a1" />
        </svg>
      );

    case 'mountain':
      // 2D Pixel Mountain
      return (
        <svg {...commonSvgProps}>
          <polygon points="8,2 2,14 14,14" fill="#15803d" />
          <polygon points="8,2 6,6 10,6" fill="#f8fafc" />
          <polygon points="12,6 8,14 16,14" fill="#166534" />
          <polygon points="12,6 10,9 14,9" fill="#e2e8f0" />
        </svg>
      );

    case 'ruler':
      // 2D Pixel Distance / Ruler
      return (
        <svg {...commonSvgProps}>
          <rect x="2" y="5" width="12" height="6" fill="#fbbf24" />
          <rect x="2" y="5" width="12" height="1" fill="#d97706" />
          <rect x="2" y="10" width="12" height="1" fill="#92400e" />
          <rect x="4" y="5" width="1" height="3" fill="#451a03" />
          <rect x="6" y="5" width="1" height="2" fill="#451a03" />
          <rect x="8" y="5" width="1" height="3" fill="#451a03" />
          <rect x="10" y="5" width="1" height="2" fill="#451a03" />
          <rect x="12" y="5" width="1" height="3" fill="#451a03" />
        </svg>
      );

    case 'shield':
      // 2D Pixel Defense Shield
      return (
        <svg {...commonSvgProps}>
          <polygon points="8,1 14,3 14,9 8,15 2,9 2,3" fill="#3b82f6" />
          <polygon points="8,3 12,5 12,8 8,13 4,8 4,5" fill="#60a5fa" />
          <rect x="7" y="5" width="2" height="6" fill="#ffffff" />
          <rect x="5" y="7" width="6" height="2" fill="#ffffff" />
        </svg>
      );

    case 'alert':
      // 2D Pixel Warning Sign
      return (
        <svg {...commonSvgProps}>
          <polygon points="8,2 1,14 15,14" fill="#eab308" />
          <polygon points="8,4 3,13 13,13" fill="#fde047" />
          <rect x="7" y="6" width="2" height="4" fill="#451a03" />
          <rect x="7" y="11" width="2" height="2" fill="#451a03" />
        </svg>
      );

    case 'search':
      // 2D Pixel Magnifying Glass
      return (
        <svg {...commonSvgProps}>
          <rect x="3" y="3" width="7" height="7" fill="none" stroke="#fbbf24" strokeWidth="2" />
          <rect x="5" y="5" width="3" height="3" fill="#38bdf8" opacity="0.6" />
          <rect x="9" y="9" width="5" height="2" fill="#92400e" transform="rotate(45 9 9)" />
        </svg>
      );

    case 'cursor':
      // 2D Pixel Hand / Click Pointer
      return (
        <svg {...commonSvgProps}>
          <rect x="7" y="1" width="2" height="6" fill="#fef08a" />
          <rect x="5" y="6" width="6" height="7" fill="#fef08a" />
          <rect x="3" y="8" width="2" height="4" fill="#fde047" />
          <rect x="11" y="8" width="2" height="4" fill="#fde047" />
          <rect x="5" y="13" width="6" height="2" fill="#d97706" />
        </svg>
      );

    case 'play':
      return (
        <svg {...commonSvgProps}>
          <rect x="4" y="2" width="2" height="12" fill="#10b981" />
          <rect x="6" y="3" width="2" height="10" fill="#10b981" />
          <rect x="8" y="5" width="2" height="6" fill="#10b981" />
          <rect x="10" y="6" width="2" height="4" fill="#10b981" />
          <rect x="12" y="7" width="1" height="2" fill="#10b981" />
        </svg>
      );

    default:
      return null;
  }
}
