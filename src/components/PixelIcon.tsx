// ── src/components/PixelIcon.tsx ─────────────────────────────────────────────
// Komponen Kumpulan Ikon 2D Pixel Art SVG (Crisp Pixel Edges)
// Menggantikan seluruh emoji Unicode OS agar estetika pixel 2D game 100% konsisten.

export type PixelIconType =
  | 'trophy'
  | 'dice'
  | 'fire'
  | 'flame'
  | 'volcano'
  | 'earthquake'
  | 'wave'
  | 'water'
  | 'warning'
  | 'alert'
  | 'bulb'
  | 'gear'
  | 'rocket'
  | 'star'
  | 'sparkle'
  | 'shield'
  | 'map'
  | 'bell'
  | 'speaker'
  | 'sound-on'
  | 'sound-off'
  | 'thermometer'
  | 'door'
  | 'check'
  | 'cross'
  | 'lock'
  | 'unlock'
  | 'palette'
  | 'lightning'
  | 'smoke'
  | 'ash'
  | 'person'
  | 'user'
  | 'book'
  | 'compass'
  | 'play'
  | 'pause'
  | 'refresh'
  | 'celebration'
  | 'backpack'
  | 'clipboard'
  | 'key'
  | 'id-card'
  | 'trash'
  | 'printer'
  | 'explosion'
  | 'satellite'
  | 'search'
  | 'cursor'
  | 'chest-closed'
  | 'chest-open'
  | 'convergent'
  | 'divergent'
  | 'transform'
  | 'ruler'
  | 'ocean'
  | 'mountain'
  | 'crystal'
  | 'gem'
  | 'swords'
  | 'pickaxe'
  | 'fox'
  | 'target'
  | 'globe'
  | 'crown'
  | 'medal'
  | 'broadcast'
  | 'music'
  | 'fullscreen'
  | 'heart'
  | 'layers'
  | 'chart'
  | 'activity'
  | 'seismogram'
  | 'cpu'
  | 'zap'
  | 'x'
  | 'close'
  | 'rain'
  | 'cloud-rain'
  | 'rock'
  | 'boulder'
  | 'prohibited'
  | 'ban'
  | 'runner'
  | 'evacuate'
  | 'siren'
  | 'dot-yellow'
  | 'dot-red'
  | 'dot-orange';

interface PixelIconProps {
  name: PixelIconType | string;
  size?: number;
  className?: string;
  color?: string;
}

export default function PixelIcon({ name, size = 16, className = '', color }: PixelIconProps) {
  const s = size;

  switch (name) {
    case 'trophy':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          <rect x="2" y="3" width="2" height="4" fill="#d97706" />
          <rect x="12" y="3" width="2" height="4" fill="#d97706" />
          <rect x="3" y="7" width="2" height="1" fill="#d97706" />
          <rect x="11" y="7" width="2" height="1" fill="#d97706" />
          <rect x="4" y="2" width="8" height="7" fill="#fbbf24" />
          <rect x="5" y="3" width="2" height="5" fill="#fef08a" />
          <rect x="9" y="3" width="2" height="5" fill="#f59e0b" />
          <rect x="5" y="9" width="6" height="2" fill="#d97706" />
          <rect x="7" y="11" width="2" height="2" fill="#92400e" />
          <rect x="5" y="13" width="6" height="2" fill="#78350f" />
          <rect x="4" y="14" width="8" height="1" fill="#451a03" />
        </svg>
      );

    case 'dice':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          <rect x="2" y="2" width="12" height="12" fill="#1e293b" />
          <rect x="3" y="3" width="10" height="10" fill="#f8fafc" />
          {/* Dice pips */}
          <rect x="5" y="5" width="2" height="2" fill="#0f172a" />
          <rect x="9" y="5" width="2" height="2" fill="#0f172a" />
          <rect x="7" y="7" width="2" height="2" fill="#ef4444" />
          <rect x="5" y="9" width="2" height="2" fill="#0f172a" />
          <rect x="9" y="9" width="2" height="2" fill="#0f172a" />
        </svg>
      );

    case 'fire':
    case 'flame':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          <rect x="7" y="1" width="2" height="2" fill="#ea580c" />
          <rect x="5" y="3" width="5" height="3" fill="#ea580c" />
          <rect x="4" y="6" width="8" height="8" fill="#f97316" />
          <rect x="6" y="7" width="4" height="6" fill="#facc15" />
          <rect x="7" y="9" width="2" height="3" fill="#ffffff" />
          <rect x="3" y="9" width="1" height="4" fill="#dc2626" />
          <rect x="12" y="8" width="1" height="5" fill="#dc2626" />
        </svg>
      );

    case 'volcano':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          {/* Eruption smoke / lava */}
          <rect x="7" y="1" width="2" height="2" fill="#f97316" />
          <rect x="6" y="3" width="4" height="2" fill="#ef4444" />
          <rect x="5" y="1" width="1" height="2" fill="#facc15" />
          <rect x="10" y="2" width="1" height="2" fill="#facc15" />
          {/* Mountain */}
          <rect x="6" y="5" width="4" height="2" fill="#ef4444" />
          <rect x="5" y="7" width="6" height="2" fill="#78350f" />
          <rect x="4" y="9" width="8" height="3" fill="#573312" />
          <rect x="2" y="12" width="12" height="3" fill="#382010" />
          {/* Magma stream */}
          <rect x="7" y="7" width="2" height="4" fill="#ea580c" />
          <rect x="8" y="11" width="1" height="3" fill="#f97316" />
        </svg>
      );

    case 'earthquake':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          <rect x="1" y="3" width="14" height="2" fill="#d97706" />
          {/* Fault lines */}
          <rect x="2" y="5" width="5" height="4" fill="#92400e" />
          <rect x="8" y="5" width="6" height="4" fill="#78350f" />
          <rect x="6" y="6" width="3" height="1" fill="#f59e0b" />
          <rect x="8" y="8" width="2" height="1" fill="#f59e0b" />
          <rect x="1" y="9" width="6" height="5" fill="#451a03" />
          <rect x="8" y="9" width="7" height="5" fill="#291203" />
          <rect x="6" y="10" width="2" height="3" fill="#ea580c" />
        </svg>
      );

    case 'warning':
    case 'alert':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          <rect x="7" y="1" width="2" height="2" fill="#f59e0b" />
          <rect x="6" y="3" width="4" height="2" fill="#f59e0b" />
          <rect x="5" y="5" width="6" height="2" fill="#f59e0b" />
          <rect x="4" y="7" width="8" height="2" fill="#f59e0b" />
          <rect x="3" y="9" width="10" height="2" fill="#f59e0b" />
          <rect x="2" y="11" width="12" height="2" fill="#f59e0b" />
          <rect x="1" y="13" width="14" height="2" fill="#d97706" />
          {/* Exclamation */}
          <rect x="7" y="5" width="2" height="4" fill="#0f172a" />
          <rect x="7" y="10" width="2" height="2" fill="#0f172a" />
        </svg>
      );

    case 'bulb':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          <rect x="5" y="1" width="6" height="2" fill="#fde047" />
          <rect x="4" y="3" width="8" height="5" fill="#facc15" />
          <rect x="5" y="8" width="6" height="2" fill="#eab308" />
          <rect x="6" y="10" width="4" height="2" fill="#ca8a04" />
          {/* Base screw */}
          <rect x="6" y="12" width="4" height="2" fill="#94a3b8" />
          <rect x="7" y="14" width="2" height="1" fill="#64748b" />
          {/* Highlight */}
          <rect x="6" y="4" width="2" height="2" fill="#ffffff" />
        </svg>
      );

    case 'gear':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          <rect x="7" y="1" width="2" height="2" fill="#64748b" />
          <rect x="7" y="13" width="2" height="2" fill="#64748b" />
          <rect x="1" y="7" width="2" height="2" fill="#64748b" />
          <rect x="13" y="7" width="2" height="2" fill="#64748b" />
          <rect x="4" y="4" width="8" height="8" fill="#94a3b8" />
          <rect x="6" y="3" width="4" height="10" fill="#94a3b8" />
          <rect x="3" y="6" width="10" height="4" fill="#94a3b8" />
          {/* Center hole */}
          <rect x="6" y="6" width="4" height="4" fill="#334155" />
        </svg>
      );

    case 'rocket':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          <rect x="11" y="2" width="2" height="2" fill="#ef4444" />
          <rect x="9" y="3" width="3" height="3" fill="#f8fafc" />
          <rect x="7" y="5" width="4" height="4" fill="#f8fafc" />
          <rect x="5" y="8" width="4" height="3" fill="#f8fafc" />
          {/* Window */}
          <rect x="9" y="5" width="2" height="2" fill="#0284c7" />
          {/* Wings */}
          <rect x="11" y="7" width="2" height="3" fill="#dc2626" />
          <rect x="4" y="7" width="2" height="3" fill="#dc2626" />
          {/* Exhaust flame */}
          <rect x="3" y="11" width="3" height="3" fill="#f97316" />
          <rect x="1" y="13" width="3" height="2" fill="#facc15" />
        </svg>
      );

    case 'star':
    case 'sparkle':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          <rect x="7" y="1" width="2" height="14" fill="#facc15" />
          <rect x="1" y="7" width="14" height="2" fill="#facc15" />
          <rect x="4" y="4" width="8" height="8" fill="#facc15" />
          <rect x="6" y="6" width="4" height="4" fill="#fef08a" />
          <rect x="7" y="7" width="2" height="2" fill="#ffffff" />
        </svg>
      );

    case 'shield':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          <rect x="3" y="2" width="10" height="2" fill="#3b82f6" />
          <rect x="2" y="4" width="12" height="5" fill="#3b82f6" />
          <rect x="3" y="9" width="10" height="3" fill="#2563eb" />
          <rect x="4" y="12" width="8" height="2" fill="#1d4ed8" />
          <rect x="6" y="14" width="4" height="1" fill="#1e40af" />
          <rect x="7" y="15" width="2" height="1" fill="#1e3a8a" />
          {/* Inner emblem */}
          <rect x="6" y="5" width="4" height="4" fill="#fef08a" />
          <rect x="7" y="9" width="2" height="2" fill="#facc15" />
        </svg>
      );

    case 'bell':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          <rect x="7" y="2" width="2" height="2" fill="#d97706" />
          <rect x="6" y="4" width="4" height="2" fill="#f59e0b" />
          <rect x="5" y="6" width="6" height="4" fill="#fbbf24" />
          <rect x="3" y="10" width="10" height="2" fill="#f59e0b" />
          <rect x="7" y="12" width="2" height="2" fill="#b45309" />
        </svg>
      );

    case 'speaker':
    case 'sound-on':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          <rect x="2" y="6" width="3" height="4" fill="#64748b" />
          <rect x="5" y="4" width="4" height="8" fill="#0ea5e9" />
          <rect x="6" y="3" width="2" height="10" fill="#0ea5e9" />
          {/* Sound waves */}
          <rect x="11" y="5" width="1" height="6" fill="#38bdf8" />
          <rect x="13" y="3" width="1" height="10" fill="#7dd3fc" />
        </svg>
      );

    case 'sound-off':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          <rect x="2" y="6" width="3" height="4" fill="#64748b" />
          <rect x="5" y="4" width="4" height="8" fill="#64748b" />
          <rect x="6" y="3" width="2" height="10" fill="#64748b" />
          {/* Slash */}
          <rect x="10" y="5" width="2" height="2" fill="#ef4444" />
          <rect x="12" y="7" width="2" height="2" fill="#ef4444" />
          <rect x="14" y="9" width="2" height="2" fill="#ef4444" />
        </svg>
      );

    case 'thermometer':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          <rect x="6" y="1" width="4" height="9" fill="#e2e8f0" />
          <rect x="5" y="10" width="6" height="5" fill="#ef4444" />
          <rect x="7" y="3" width="2" height="9" fill="#ef4444" />
          <rect x="7" y="2" width="2" height="2" fill="#f87171" />
        </svg>
      );

    case 'door':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          <rect x="3" y="2" width="10" height="12" fill="#78350f" />
          <rect x="4" y="3" width="8" height="10" fill="#b45309" />
          <rect x="10" y="8" width="1" height="2" fill="#facc15" />
          <rect x="2" y="13" width="12" height="2" fill="#451a03" />
        </svg>
      );

    case 'check':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          <rect x="3" y="8" width="2" height="3" fill="#10b981" />
          <rect x="5" y="10" width="2" height="3" fill="#10b981" />
          <rect x="7" y="12" width="2" height="2" fill="#10b981" />
          <rect x="9" y="8" width="2" height="4" fill="#10b981" />
          <rect x="11" y="4" width="2" height="4" fill="#10b981" />
          <rect x="13" y="2" width="2" height="3" fill="#10b981" />
        </svg>
      );

    case 'cross':
    case 'x':
    case 'close':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          <rect x="3" y="3" width="2" height="2" fill="#ef4444" />
          <rect x="5" y="5" width="2" height="2" fill="#ef4444" />
          <rect x="7" y="7" width="2" height="2" fill="#ef4444" />
          <rect x="9" y="9" width="2" height="2" fill="#ef4444" />
          <rect x="11" y="11" width="2" height="2" fill="#ef4444" />
          <rect x="11" y="3" width="2" height="2" fill="#ef4444" />
          <rect x="9" y="5" width="2" height="2" fill="#ef4444" />
          <rect x="5" y="9" width="2" height="2" fill="#ef4444" />
          <rect x="3" y="11" width="2" height="2" fill="#ef4444" />
        </svg>
      );

    case 'lock':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          <rect x="5" y="2" width="6" height="5" fill="#64748b" />
          <rect x="7" y="4" width="2" height="3" fill="#1e293b" />
          <rect x="4" y="7" width="8" height="7" fill="#f59e0b" />
          <rect x="7" y="9" width="2" height="3" fill="#78350f" />
        </svg>
      );

    case 'unlock':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          <rect x="7" y="1" width="6" height="5" fill="#64748b" />
          <rect x="9" y="3" width="2" height="3" fill="#1e293b" />
          <rect x="4" y="7" width="8" height="7" fill="#10b981" />
          <rect x="7" y="9" width="2" height="3" fill="#064e3b" />
        </svg>
      );

    case 'palette':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          <rect x="4" y="2" width="8" height="12" fill="#fef3c7" />
          <rect x="2" y="4" width="12" height="8" fill="#fef3c7" />
          <rect x="3" y="3" width="1" height="1" fill="#fef3c7" />
          <rect x="12" y="3" width="1" height="1" fill="#fef3c7" />
          {/* Color spots */}
          <rect x="4" y="5" width="2" height="2" fill="#ef4444" />
          <rect x="7" y="4" width="2" height="2" fill="#3b82f6" />
          <rect x="10" y="5" width="2" height="2" fill="#10b981" />
          <rect x="5" y="9" width="2" height="2" fill="#f59e0b" />
          {/* Thumb hole */}
          <rect x="9" y="9" width="2" height="2" fill="#451a03" />
        </svg>
      );

    case 'lightning':
    case 'zap':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          <rect x="8" y="1" width="3" height="5" fill="#facc15" />
          <rect x="5" y="5" width="7" height="3" fill="#facc15" />
          <rect x="4" y="7" width="4" height="4" fill="#facc15" />
          <rect x="5" y="10" width="3" height="5" fill="#eab308" />
        </svg>
      );

    case 'smoke':
    case 'ash':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          <rect x="3" y="6" width="5" height="4" fill="#94a3b8" />
          <rect x="7" y="4" width="6" height="6" fill="#cbd5e1" />
          <rect x="5" y="8" width="8" height="5" fill="#64748b" />
          <rect x="4" y="3" width="3" height="3" fill="#e2e8f0" />
        </svg>
      );

    case 'map':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          <rect x="2" y="3" width="4" height="10" fill="#fef3c7" />
          <rect x="6" y="2" width="4" height="10" fill="#fde68a" />
          <rect x="10" y="3" width="4" height="10" fill="#fef3c7" />
          {/* Path line */}
          <rect x="4" y="5" width="2" height="1" fill="#ef4444" />
          <rect x="6" y="6" width="3" height="1" fill="#ef4444" />
          <rect x="8" y="8" width="2" height="1" fill="#ef4444" />
          <rect x="11" y="9" width="2" height="2" fill="#ef4444" />
        </svg>
      );

    case 'celebration':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          <rect x="3" y="11" width="3" height="3" fill="#f59e0b" />
          <rect x="5" y="8" width="4" height="4" fill="#ef4444" />
          <rect x="8" y="5" width="3" height="3" fill="#3b82f6" />
          {/* Confetti */}
          <rect x="3" y="3" width="2" height="2" fill="#10b981" />
          <rect x="11" y="2" width="2" height="2" fill="#ec4899" />
          <rect x="12" y="8" width="2" height="2" fill="#facc15" />
          <rect x="1" y="7" width="2" height="2" fill="#8b5cf6" />
        </svg>
      );

    case 'backpack':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          {/* Top Handle */}
          <rect x="6" y="1" width="4" height="1" fill="#f59e0b" />
          <rect x="5" y="2" width="1" height="1" fill="#f59e0b" />
          <rect x="10" y="2" width="1" height="1" fill="#f59e0b" />
          {/* Main Bag Body */}
          <rect x="3" y="3" width="10" height="11" fill="#d97706" />
          <rect x="4" y="4" width="8" height="9" fill="#fbbf24" />
          {/* Flap & Straps */}
          <rect x="3" y="3" width="10" height="4" fill="#b45309" />
          <rect x="5" y="4" width="2" height="7" fill="#78350f" />
          <rect x="9" y="4" width="2" height="7" fill="#78350f" />
          {/* Buckles */}
          <rect x="5" y="8" width="2" height="2" fill="#fef08a" />
          <rect x="9" y="8" width="2" height="2" fill="#fef08a" />
          {/* Front Pocket */}
          <rect x="5" y="11" width="6" height="3" fill="#92400e" />
          <rect x="7" y="12" width="2" height="1" fill="#fef08a" />
          {/* Border Outline */}
          <rect x="2" y="3" width="1" height="11" fill="#451a03" />
          <rect x="13" y="3" width="1" height="11" fill="#451a03" />
          <rect x="3" y="14" width="10" height="1" fill="#451a03" />
          <rect x="3" y="2" width="10" height="1" fill="#451a03" />
        </svg>
      );

    case 'clipboard':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          {/* Metal Clip */}
          <rect x="6" y="1" width="4" height="2" fill="#cbd5e1" />
          <rect x="7" y="0" width="2" height="1" fill="#64748b" />
          <rect x="7" y="2" width="2" height="1" fill="#334155" />
          {/* Board Base */}
          <rect x="2" y="2" width="12" height="13" fill="#78350f" />
          {/* Paper Sheet */}
          <rect x="3" y="3" width="10" height="11" fill="#fef3c7" />
          {/* Ruled Lines */}
          <rect x="6" y="5" width="5" height="1" fill="#0284c7" />
          <rect x="6" y="7" width="5" height="1" fill="#0284c7" />
          <rect x="6" y="9" width="5" height="1" fill="#0284c7" />
          <rect x="6" y="11" width="4" height="1" fill="#0284c7" />
          {/* Checkmarks */}
          <rect x="4" y="5" width="1" height="1" fill="#16a34a" />
          <rect x="4" y="7" width="1" height="1" fill="#16a34a" />
          <rect x="4" y="9" width="1" height="1" fill="#16a34a" />
          {/* Outline */}
          <rect x="1" y="2" width="1" height="13" fill="#451a03" />
          <rect x="14" y="2" width="1" height="13" fill="#451a03" />
          <rect x="2" y="15" width="12" height="1" fill="#451a03" />
        </svg>
      );

    case 'key':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          <rect x="3" y="3" width="5" height="5" fill="#f59e0b" />
          <rect x="4" y="4" width="3" height="3" fill="#fbbf24" />
          <rect x="5" y="5" width="1" height="1" fill="#78350f" />
          <rect x="8" y="5" width="6" height="2" fill="#d97706" />
          <rect x="11" y="7" width="1" height="2" fill="#d97706" />
          <rect x="13" y="7" width="1" height="2" fill="#d97706" />
        </svg>
      );

    case 'id-card':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          <rect x="2" y="2" width="12" height="12" fill="#3b82f6" />
          <rect x="3" y="3" width="10" height="10" fill="#eff6ff" />
          <rect x="4" y="4" width="4" height="4" fill="#3b82f6" />
          <rect x="9" y="5" width="3" height="1" fill="#64748b" />
          <rect x="9" y="7" width="3" height="1" fill="#64748b" />
          <rect x="4" y="9" width="8" height="1" fill="#64748b" />
          <rect x="4" y="11" width="5" height="1" fill="#64748b" />
        </svg>
      );

    case 'person':
    case 'user':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          {/* Hat / Hair */}
          <rect x="5" y="1" width="6" height="2" fill="#b45309" />
          <rect x="4" y="3" width="8" height="2" fill="#b45309" />
          {/* Face */}
          <rect x="5" y="5" width="6" height="4" fill="#fde047" />
          {/* Eyes */}
          <rect x="6" y="6" width="1" height="1" fill="#1e293b" />
          <rect x="9" y="6" width="1" height="1" fill="#1e293b" />
          {/* Neck */}
          <rect x="7" y="9" width="2" height="1" fill="#fde047" />
          {/* Shoulders / Shirt */}
          <rect x="3" y="10" width="10" height="5" fill="#0284c7" />
          <rect x="4" y="11" width="8" height="4" fill="#0369a1" />
          <rect x="6" y="10" width="4" height="3" fill="#f97316" />
        </svg>
      );

    case 'trash':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          {/* Lid handle */}
          <rect x="6" y="1" width="4" height="1" fill="#cbd5e1" />
          {/* Lid */}
          <rect x="3" y="2" width="10" height="2" fill="#ef4444" />
          {/* Bin Body */}
          <rect x="4" y="4" width="8" height="10" fill="#dc2626" />
          <rect x="5" y="5" width="6" height="8" fill="#f87171" />
          {/* Vertical Slits */}
          <rect x="6" y="6" width="1" height="6" fill="#991b1b" />
          <rect x="8" y="6" width="1" height="6" fill="#991b1b" />
          {/* Base */}
          <rect x="4" y="14" width="8" height="1" fill="#7f1d1d" />
        </svg>
      );

    case 'printer':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          {/* Paper Top */}
          <rect x="5" y="1" width="6" height="4" fill="#f8fafc" />
          <rect x="6" y="2" width="4" height="1" fill="#94a3b8" />
          {/* Main Body */}
          <rect x="2" y="5" width="12" height="7" fill="#334155" />
          <rect x="3" y="6" width="10" height="5" fill="#475569" />
          {/* Status LED */}
          <rect x="11" y="7" width="1" height="1" fill="#10b981" />
          {/* Paper Exit Slot & Sheet Bottom */}
          <rect x="4" y="9" width="8" height="6" fill="#ffffff" />
          <rect x="5" y="11" width="6" height="1" fill="#0284c7" />
          <rect x="5" y="13" width="4" height="1" fill="#0284c7" />
          {/* Bottom feet */}
          <rect x="3" y="12" width="10" height="1" fill="#1e293b" />
        </svg>
      );

    case 'explosion':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          {/* Red outer bursts */}
          <rect x="7" y="0" width="2" height="2" fill="#ef4444" />
          <rect x="7" y="14" width="2" height="2" fill="#ef4444" />
          <rect x="0" y="7" width="2" height="2" fill="#ef4444" />
          <rect x="14" y="7" width="2" height="2" fill="#ef4444" />
          <rect x="2" y="2" width="2" height="2" fill="#ef4444" />
          <rect x="12" y="2" width="2" height="2" fill="#ef4444" />
          <rect x="2" y="12" width="2" height="2" fill="#ef4444" />
          <rect x="12" y="12" width="2" height="2" fill="#ef4444" />
          {/* Orange middle body */}
          <rect x="3" y="4" width="10" height="8" fill="#f97316" />
          <rect x="4" y="3" width="8" height="10" fill="#f97316" />
          {/* Yellow inner core */}
          <rect x="5" y="5" width="6" height="6" fill="#facc15" />
          <rect x="6" y="6" width="4" height="4" fill="#ffffff" />
        </svg>
      );

    case 'satellite':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          {/* Solar Panel Left */}
          <rect x="1" y="6" width="4" height="4" fill="#0284c7" />
          <rect x="2" y="7" width="2" height="2" fill="#38bdf8" />
          {/* Connector */}
          <rect x="5" y="7" width="2" height="2" fill="#94a3b8" />
          {/* Central Core */}
          <rect x="7" y="5" width="4" height="6" fill="#e2e8f0" />
          <rect x="8" y="6" width="2" height="4" fill="#f59e0b" />
          {/* Connector */}
          <rect x="11" y="7" width="2" height="2" fill="#94a3b8" />
          {/* Solar Panel Right */}
          <rect x="13" y="6" width="2" height="4" fill="#0284c7" />
          {/* Antenna & Dish */}
          <rect x="8" y="2" width="2" height="3" fill="#64748b" />
          <rect x="7" y="1" width="4" height="1" fill="#f87171" />
        </svg>
      );

    case 'search':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          {/* Lens Rim */}
          <rect x="3" y="2" width="6" height="1" fill="#0284c7" />
          <rect x="2" y="3" width="8" height="6" fill="#0284c7" />
          <rect x="3" y="9" width="6" height="1" fill="#0284c7" />
          {/* Glass Inner */}
          <rect x="4" y="4" width="4" height="4" fill="#e0f2fe" />
          <rect x="4" y="4" width="2" height="2" fill="#ffffff" />
          {/* Handle */}
          <rect x="8" y="8" width="2" height="2" fill="#b45309" />
          <rect x="10" y="10" width="2" height="2" fill="#b45309" />
          <rect x="12" y="12" width="3" height="3" fill="#78350f" />
        </svg>
      );

    case 'cursor':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          <rect x="2" y="1" width="2" height="11" fill="#1e293b" />
          <rect x="3" y="2" width="1" height="9" fill="#f8fafc" />
          <rect x="4" y="3" width="1" height="8" fill="#f8fafc" />
          <rect x="5" y="4" width="1" height="7" fill="#f8fafc" />
          <rect x="6" y="5" width="1" height="6" fill="#f8fafc" />
          <rect x="7" y="6" width="1" height="5" fill="#f8fafc" />
          <rect x="8" y="7" width="1" height="4" fill="#f8fafc" />
          <rect x="9" y="8" width="1" height="2" fill="#1e293b" />
          <rect x="6" y="10" width="4" height="2" fill="#1e293b" />
          <rect x="7" y="12" width="2" height="3" fill="#1e293b" />
          <rect x="8" y="12" width="1" height="2" fill="#f8fafc" />
        </svg>
      );

    case 'chest-closed':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          <rect x="2" y="3" width="12" height="10" fill="#78350f" />
          <rect x="3" y="4" width="10" height="4" fill="#b45309" />
          <rect x="2" y="7" width="12" height="1" fill="#451a03" />
          <rect x="3" y="8" width="10" height="4" fill="#92400e" />
          {/* Iron Bands */}
          <rect x="4" y="3" width="1" height="10" fill="#475569" />
          <rect x="11" y="3" width="1" height="10" fill="#475569" />
          {/* Gold Keyhole */}
          <rect x="7" y="7" width="2" height="3" fill="#facc15" />
        </svg>
      );

    case 'chest-open':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          {/* Open Lid */}
          <rect x="2" y="1" width="12" height="4" fill="#b45309" />
          <rect x="4" y="1" width="1" height="4" fill="#475569" />
          <rect x="11" y="1" width="1" height="4" fill="#475569" />
          {/* Glowing Treasure Inside */}
          <rect x="3" y="5" width="10" height="3" fill="#fde047" />
          <rect x="5" y="6" width="6" height="2" fill="#ffffff" />
          {/* Bottom Box */}
          <rect x="2" y="8" width="12" height="6" fill="#78350f" />
          <rect x="3" y="9" width="10" height="4" fill="#92400e" />
          <rect x="4" y="8" width="1" height="6" fill="#475569" />
          <rect x="11" y="8" width="1" height="6" fill="#475569" />
          <rect x="7" y="9" width="2" height="2" fill="#facc15" />
        </svg>
      );

    case 'convergent':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          {/* Arrow Left -> Right */}
          <rect x="1" y="7" width="4" height="2" fill="#ef4444" />
          <rect x="4" y="5" width="2" height="6" fill="#ef4444" />
          <rect x="6" y="6" width="1" height="4" fill="#ef4444" />
          {/* Collision center */}
          <rect x="7" y="3" width="2" height="10" fill="#facc15" />
          {/* Arrow Right -> Left */}
          <rect x="11" y="7" width="4" height="2" fill="#ef4444" />
          <rect x="10" y="5" width="2" height="6" fill="#ef4444" />
          <rect x="9" y="6" width="1" height="4" fill="#ef4444" />
        </svg>
      );

    case 'divergent':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          {/* Rift Center */}
          <rect x="7" y="1" width="2" height="14" fill="#38bdf8" />
          {/* Arrow Left pointing Left */}
          <rect x="2" y="7" width="4" height="2" fill="#0284c7" />
          <rect x="1" y="6" width="2" height="4" fill="#0284c7" />
          {/* Arrow Right pointing Right */}
          <rect x="10" y="7" width="4" height="2" fill="#0284c7" />
          <rect x="13" y="6" width="2" height="4" fill="#0284c7" />
        </svg>
      );

    case 'transform':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          {/* Fault Line */}
          <rect x="7" y="1" width="2" height="14" fill="#78350f" />
          {/* Up Arrow on Left */}
          <rect x="3" y="3" width="2" height="8" fill="#10b981" />
          <rect x="2" y="3" width="4" height="2" fill="#10b981" />
          {/* Down Arrow on Right */}
          <rect x="11" y="5" width="2" height="8" fill="#f59e0b" />
          <rect x="10" y="11" width="4" height="2" fill="#f59e0b" />
        </svg>
      );

    case 'ruler':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          <rect x="1" y="4" width="14" height="8" fill="#fef08a" />
          <rect x="1" y="4" width="14" height="1" fill="#ca8a04" />
          <rect x="1" y="11" width="14" height="1" fill="#ca8a04" />
          {/* Tick Marks */}
          <rect x="3" y="4" width="1" height="4" fill="#854d0e" />
          <rect x="5" y="4" width="1" height="2" fill="#854d0e" />
          <rect x="7" y="4" width="1" height="4" fill="#854d0e" />
          <rect x="9" y="4" width="1" height="2" fill="#854d0e" />
          <rect x="11" y="4" width="1" height="4" fill="#854d0e" />
          <rect x="13" y="4" width="1" height="2" fill="#854d0e" />
        </svg>
      );

    case 'ocean':
    case 'water':
    case 'wave':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          {/* Wave 1 */}
          <rect x="1" y="4" width="4" height="2" fill="#38bdf8" />
          <rect x="5" y="3" width="4" height="2" fill="#38bdf8" />
          <rect x="9" y="4" width="4" height="2" fill="#38bdf8" />
          <rect x="13" y="3" width="2" height="2" fill="#38bdf8" />
          {/* Wave 2 */}
          <rect x="2" y="8" width="4" height="2" fill="#0284c7" />
          <rect x="6" y="7" width="4" height="2" fill="#0284c7" />
          <rect x="10" y="8" width="4" height="2" fill="#0284c7" />
          {/* Deep Ocean */}
          <rect x="1" y="11" width="14" height="4" fill="#0369a1" />
          <rect x="3" y="12" width="3" height="1" fill="#bae6fd" />
          <rect x="9" y="13" width="4" height="1" fill="#bae6fd" />
        </svg>
      );

    case 'mountain':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          {/* Snow cap */}
          <rect x="7" y="2" width="2" height="2" fill="#f8fafc" />
          <rect x="6" y="4" width="4" height="2" fill="#f8fafc" />
          {/* Rock Body */}
          <rect x="5" y="6" width="6" height="3" fill="#64748b" />
          <rect x="4" y="9" width="8" height="3" fill="#475569" />
          <rect x="2" y="12" width="12" height="3" fill="#334155" />
          {/* Foothill Greens */}
          <rect x="1" y="14" width="4" height="2" fill="#15803d" />
          <rect x="11" y="14" width="4" height="2" fill="#15803d" />
        </svg>
      );

    case 'book':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          <rect x="2" y="3" width="12" height="11" fill="#b45309" />
          <rect x="3" y="4" width="5" height="9" fill="#fef3c7" />
          <rect x="8" y="4" width="5" height="9" fill="#fde68a" />
          <rect x="7" y="3" width="2" height="11" fill="#78350f" />
          <rect x="4" y="6" width="3" height="1" fill="#92400e" />
          <rect x="4" y="8" width="3" height="1" fill="#92400e" />
          <rect x="9" y="6" width="3" height="1" fill="#92400e" />
          <rect x="9" y="8" width="3" height="1" fill="#92400e" />
        </svg>
      );

    case 'compass':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          <rect x="4" y="2" width="8" height="12" fill="#0284c7" />
          <rect x="2" y="4" width="12" height="8" fill="#0284c7" />
          <rect x="4" y="4" width="8" height="8" fill="#f8fafc" />
          {/* Needle North (Red) */}
          <rect x="7" y="5" width="2" height="3" fill="#ef4444" />
          <rect x="8" y="4" width="1" height="1" fill="#ef4444" />
          {/* Needle South (Slate) */}
          <rect x="7" y="8" width="2" height="3" fill="#64748b" />
          <rect x="7" y="11" width="1" height="1" fill="#64748b" />
          {/* Pivot */}
          <rect x="7" y="7" width="2" height="2" fill="#f59e0b" />
        </svg>
      );

    case 'play':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          <rect x="4" y="2" width="2" height="12" fill="#10b981" />
          <rect x="6" y="3" width="2" height="10" fill="#10b981" />
          <rect x="8" y="5" width="2" height="6" fill="#10b981" />
          <rect x="10" y="6" width="2" height="4" fill="#10b981" />
          <rect x="12" y="7" width="1" height="2" fill="#10b981" />
        </svg>
      );

    case 'pause':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          <rect x="3" y="2" width="3" height="12" fill="#f59e0b" />
          <rect x="10" y="2" width="3" height="12" fill="#f59e0b" />
        </svg>
      );

    case 'refresh':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          <rect x="4" y="2" width="8" height="2" fill="#0284c7" />
          <rect x="12" y="2" width="2" height="6" fill="#0284c7" />
          <rect x="10" y="4" width="4" height="2" fill="#0284c7" />
          <rect x="4" y="12" width="8" height="2" fill="#0284c7" />
          <rect x="2" y="8" width="2" height="6" fill="#0284c7" />
          <rect x="2" y="10" width="4" height="2" fill="#0284c7" />
        </svg>
      );

    case 'crystal':
    case 'gem':
      return (
        <svg viewBox="0 0 16 16" width={s} height={s} shapeRendering="crispEdges" className={`inline-block ${className}`}>
          <rect x="5" y="2" width="6" height="2" fill="#38bdf8" />
          <rect x="3" y="4" width="10" height="3" fill="#0284c7" />
          <rect x="5" y="4" width="3" height="2" fill="#bae6fd" />
          <rect x="6" y="5" width="2" height="1" fill="#ffffff" />
          <rect x="4" y="7" width="8" height="3" fill="#0369a1" />
          <rect x="5" y="7" width="3" height="2" fill="#38bdf8" />
          <rect x="5" y="10" width="6" height="2" fill="#075985" />
          <rect x="6" y="12" width="4" height="2" fill="#0c4a6e" />
          <rect x="7" y="14" width="2" height="1" fill="#082f49" />
        </svg>
      );

    case 'swords':
      return (
        <svg viewBox="0 0 16 16" width={s} height={s} shapeRendering="crispEdges" className={`inline-block ${className}`}>
          <rect x="13" y="1" width="2" height="2" fill="#f8fafc" />
          <rect x="11" y="3" width="2" height="2" fill="#e2e8f0" />
          <rect x="9" y="5" width="2" height="2" fill="#cbd5e1" />
          <rect x="7" y="7" width="2" height="2" fill="#94a3b8" />
          <rect x="5" y="9" width="2" height="2" fill="#64748b" />
          <rect x="3" y="9" width="2" height="2" fill="#f59e0b" />
          <rect x="5" y="11" width="2" height="2" fill="#f59e0b" />
          <rect x="3" y="11" width="2" height="2" fill="#78350f" />
          <rect x="1" y="13" width="2" height="2" fill="#f59e0b" />
          <rect x="1" y="1" width="2" height="2" fill="#f8fafc" />
          <rect x="3" y="3" width="2" height="2" fill="#e2e8f0" />
          <rect x="5" y="5" width="2" height="2" fill="#cbd5e1" />
          <rect x="9" y="9" width="2" height="2" fill="#64748b" />
          <rect x="11" y="9" width="2" height="2" fill="#f59e0b" />
          <rect x="9" y="11" width="2" height="2" fill="#f59e0b" />
          <rect x="11" y="11" width="2" height="2" fill="#78350f" />
          <rect x="13" y="13" width="2" height="2" fill="#f59e0b" />
        </svg>
      );

    case 'pickaxe':
      return (
        <svg viewBox="0 0 16 16" width={s} height={s} shapeRendering="crispEdges" className={`inline-block ${className}`}>
          <rect x="8" y="1" width="6" height="2" fill="#94a3b8" />
          <rect x="13" y="3" width="2" height="3" fill="#cbd5e1" />
          <rect x="14" y="5" width="1" height="2" fill="#f1f5f9" />
          <rect x="3" y="3" width="6" height="2" fill="#64748b" />
          <rect x="1" y="5" width="2" height="3" fill="#475569" />
          <rect x="1" y="7" width="1" height="1" fill="#cbd5e1" />
          <rect x="8" y="2" width="2" height="2" fill="#e2e8f0" />
          <rect x="7" y="4" width="2" height="2" fill="#92400e" />
          <rect x="6" y="6" width="2" height="2" fill="#b45309" />
          <rect x="5" y="8" width="2" height="2" fill="#92400e" />
          <rect x="4" y="10" width="2" height="2" fill="#b45309" />
          <rect x="3" y="12" width="2" height="2" fill="#78350f" />
          <rect x="2" y="14" width="2" height="2" fill="#451a03" />
        </svg>
      );

    case 'fox':
      return (
        <svg viewBox="0 0 16 16" width={s} height={s} shapeRendering="crispEdges" className={`inline-block ${className}`}>
          <rect x="2" y="1" width="3" height="4" fill="#ea580c" />
          <rect x="3" y="2" width="1" height="2" fill="#fef08a" />
          <rect x="11" y="1" width="3" height="4" fill="#ea580c" />
          <rect x="12" y="2" width="1" height="2" fill="#fef08a" />
          <rect x="3" y="4" width="10" height="6" fill="#f97316" />
          <rect x="2" y="6" width="12" height="4" fill="#f97316" />
          <rect x="2" y="8" width="3" height="4" fill="#ffffff" />
          <rect x="11" y="8" width="3" height="4" fill="#ffffff" />
          <rect x="5" y="10" width="6" height="3" fill="#ffffff" />
          <rect x="4" y="7" width="2" height="2" fill="#1c1917" />
          <rect x="10" y="7" width="2" height="2" fill="#1c1917" />
          <rect x="4" y="7" width="1" height="1" fill="#ffffff" />
          <rect x="10" y="7" width="1" height="1" fill="#ffffff" />
          <rect x="7" y="11" width="2" height="2" fill="#1c1917" />
        </svg>
      );

    case 'target':
      return (
        <svg viewBox="0 0 16 16" width={s} height={s} shapeRendering="crispEdges" className={`inline-block ${className}`}>
          <rect x="4" y="1" width="8" height="2" fill="#ef4444" />
          <rect x="4" y="13" width="8" height="2" fill="#ef4444" />
          <rect x="1" y="4" width="2" height="8" fill="#ef4444" />
          <rect x="13" y="4" width="2" height="8" fill="#ef4444" />
          <rect x="3" y="3" width="10" height="10" fill="#ffffff" />
          <rect x="5" y="4" width="6" height="8" fill="#ef4444" />
          <rect x="4" y="5" width="8" height="6" fill="#ef4444" />
          <rect x="6" y="6" width="4" height="4" fill="#fef08a" />
          <rect x="7" y="7" width="2" height="2" fill="#ea580c" />
        </svg>
      );

    case 'globe':
      return (
        <svg viewBox="0 0 16 16" width={s} height={s} shapeRendering="crispEdges" className={`inline-block ${className}`}>
          <rect x="4" y="1" width="8" height="14" fill="#0284c7" />
          <rect x="2" y="3" width="12" height="10" fill="#0284c7" />
          <rect x="1" y="4" width="14" height="8" fill="#0284c7" />
          <rect x="4" y="3" width="3" height="4" fill="#15803d" />
          <rect x="8" y="2" width="4" height="3" fill="#16a34a" />
          <rect x="9" y="5" width="3" height="3" fill="#22c55e" />
          <rect x="3" y="8" width="4" height="4" fill="#16a34a" />
          <rect x="10" y="9" width="3" height="3" fill="#15803d" />
          <rect x="5" y="12" width="5" height="2" fill="#f8fafc" />
          <rect x="5" y="1" width="5" height="1" fill="#f8fafc" />
        </svg>
      );

    case 'crown':
      return (
        <svg viewBox="0 0 16 16" width={s} height={s} shapeRendering="crispEdges" className={`inline-block ${className}`}>
          <rect x="1" y="4" width="2" height="3" fill="#fbbf24" />
          <rect x="7" y="2" width="2" height="4" fill="#fef08a" />
          <rect x="13" y="4" width="2" height="3" fill="#fbbf24" />
          <rect x="2" y="7" width="12" height="5" fill="#f59e0b" />
          <rect x="3" y="12" width="10" height="2" fill="#d97706" />
          <rect x="3" y="9" width="2" height="2" fill="#ef4444" />
          <rect x="7" y="8" width="2" height="2" fill="#38bdf8" />
          <rect x="11" y="9" width="2" height="2" fill="#10b981" />
        </svg>
      );

    case 'medal':
      return (
        <svg viewBox="0 0 16 16" width={s} height={s} shapeRendering="crispEdges" className={`inline-block ${className}`}>
          <polygon points="3,1 6,1 5,7 2,7" fill="#3b82f6" />
          <polygon points="10,1 13,1 14,7 11,7" fill="#ef4444" />
          <polygon points="6,1 10,1 9,6 7,6" fill="#f8fafc" />
          <circle cx="8" cy="11" r="4.5" fill="#fbbf24" stroke="#b45309" strokeWidth="1" />
          <rect x="7" y="9" width="2" height="4" fill="#fef08a" />
          <rect x="6" y="10" width="4" height="2" fill="#fef08a" />
        </svg>
      );

    case 'broadcast':
    case 'megaphone':
      return (
        <svg viewBox="0 0 16 16" width={s} height={s} shapeRendering="crispEdges" className={`inline-block ${className}`}>
          <rect x="1" y="6" width="3" height="4" fill="#38bdf8" />
          <polygon points="4,6 10,2 10,14 4,10" fill="#0284c7" />
          <rect x="10" y="2" width="2" height="12" fill="#f59e0b" />
          <rect x="5" y="10" width="2" height="4" fill="#0369a1" />
          <rect x="13" y="4" width="1" height="2" fill="#38bdf8" />
          <rect x="13" y="10" width="1" height="2" fill="#38bdf8" />
          <rect x="15" y="6" width="1" height="4" fill="#38bdf8" />
        </svg>
      );

    case 'music':
      return (
        <svg viewBox="0 0 16 16" width={s} height={s} shapeRendering="crispEdges" className={`inline-block ${className}`}>
          <rect x="3" y="2" width="2" height="10" fill={color || '#facc15'} />
          <rect x="5" y="2" width="6" height="2" fill={color || '#facc15'} />
          <rect x="11" y="2" width="2" height="10" fill={color || '#facc15'} />
          <rect x="1" y="10" width="4" height="4" rx="2" fill={color || '#f59e0b'} />
          <rect x="9" y="10" width="4" height="4" rx="2" fill={color || '#f59e0b'} />
        </svg>
      );

    case 'fullscreen':
      return (
        <svg viewBox="0 0 16 16" width={s} height={s} shapeRendering="crispEdges" className={`inline-block ${className}`}>
          <rect x="1" y="1" width="4" height="2" fill={color || '#e2e8f0'} />
          <rect x="1" y="1" width="2" height="4" fill={color || '#e2e8f0'} />
          <rect x="11" y="1" width="4" height="2" fill={color || '#e2e8f0'} />
          <rect x="13" y="1" width="2" height="4" fill={color || '#e2e8f0'} />
          <rect x="1" y="13" width="4" height="2" fill={color || '#e2e8f0'} />
          <rect x="1" y="11" width="2" height="4" fill={color || '#e2e8f0'} />
          <rect x="11" y="13" width="4" height="2" fill={color || '#e2e8f0'} />
          <rect x="13" y="11" width="2" height="4" fill={color || '#e2e8f0'} />
        </svg>
      );

    case 'heart':
      return (
        <svg viewBox="0 0 16 16" width={s} height={s} shapeRendering="crispEdges" className={`inline-block ${className}`}>
          <rect x="3" y="3" width="4" height="2" fill="#f43f5e" />
          <rect x="9" y="3" width="4" height="2" fill="#f43f5e" />
          <rect x="2" y="5" width="12" height="4" fill="#e11d48" />
          <rect x="4" y="4" width="2" height="2" fill="#fda4af" />
          <rect x="3" y="9" width="10" height="2" fill="#be123c" />
          <rect x="5" y="11" width="6" height="2" fill="#9f1239" />
          <rect x="7" y="13" width="2" height="2" fill="#881337" />
        </svg>
      );

    case 'layers':
      return (
        <svg viewBox="0 0 16 16" width={s} height={s} shapeRendering="crispEdges" className={`inline-block ${className}`}>
          <polygon points="8,2 14,6 8,10 2,6" fill={color || '#38bdf8'} />
          <polygon points="8,5 14,9 8,13 2,9" fill={color || '#0284c7'} opacity="0.7" />
          <polygon points="8,8 14,12 8,16 2,12" fill={color || '#075985'} opacity="0.5" />
        </svg>
      );

    case 'chart':
    case 'activity':
    case 'seismogram':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          {/* Axis / Base */}
          <rect x="1" y="2" width="1" height="12" fill={color || '#64748b'} />
          <rect x="1" y="13" width="14" height="1" fill={color || '#64748b'} />
          {/* Bar 1 - Green (Normal) */}
          <rect x="3" y="9" width="2" height="4" fill="#22c55e" />
          <rect x="3" y="8" width="2" height="1" fill="#86efac" />
          {/* Bar 2 - Yellow (Waspada) */}
          <rect x="6" y="6" width="2" height="7" fill="#eab308" />
          <rect x="6" y="5" width="2" height="1" fill="#fef08a" />
          {/* Bar 3 - Orange (Siaga) */}
          <rect x="9" y="4" width="2" height="9" fill="#f97316" />
          <rect x="9" y="3" width="2" height="1" fill="#fed7aa" />
          {/* Bar 4 - Red (Awas) */}
          <rect x="12" y="2" width="2" height="11" fill="#ef4444" />
          <rect x="12" y="1" width="2" height="1" fill="#fca5a5" />
        </svg>
      );

    case 'cpu':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          <rect x="3" y="3" width="10" height="10" fill="#1e293b" />
          <rect x="4" y="4" width="8" height="8" fill="#334155" />
          <rect x="6" y="6" width="4" height="4" fill="#0284c7" />
          <rect x="5" y="1" width="1" height="2" fill="#facc15" />
          <rect x="7" y="1" width="1" height="2" fill="#facc15" />
          <rect x="9" y="1" width="1" height="2" fill="#facc15" />
          <rect x="5" y="13" width="1" height="2" fill="#facc15" />
          <rect x="7" y="13" width="1" height="2" fill="#facc15" />
          <rect x="9" y="13" width="1" height="2" fill="#facc15" />
          <rect x="1" y="5" width="2" height="1" fill="#facc15" />
          <rect x="1" y="7" width="2" height="1" fill="#facc15" />
          <rect x="1" y="9" width="2" height="1" fill="#facc15" />
          <rect x="13" y="5" width="2" height="1" fill="#facc15" />
          <rect x="13" y="7" width="2" height="1" fill="#facc15" />
          <rect x="13" y="9" width="2" height="1" fill="#facc15" />
        </svg>
      );

    case 'rain':
    case 'cloud-rain':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          {/* Awan Pixel Abu-Biru */}
          <rect x="5" y="2" width="6" height="2" fill="#cbd5e1" />
          <rect x="3" y="4" width="10" height="4" fill="#94a3b8" />
          <rect x="2" y="6" width="12" height="3" fill="#64748b" />
          <rect x="4" y="3" width="2" height="2" fill="#f8fafc" />
          {/* Butiran Hujan Pixel */}
          <rect x="3" y="10" width="1" height="3" fill="#38bdf8" />
          <rect x="6" y="11" width="1" height="3" fill="#38bdf8" />
          <rect x="9" y="10" width="1" height="3" fill="#38bdf8" />
          <rect x="12" y="11" width="1" height="3" fill="#38bdf8" />
          <rect x="4" y="14" width="1" height="1" fill="#7dd3fc" />
          <rect x="7" y="15" width="1" height="1" fill="#7dd3fc" />
          <rect x="10" y="14" width="1" height="1" fill="#7dd3fc" />
        </svg>
      );

    case 'rock':
    case 'boulder':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          {/* Batu Andesit Bertekstur 2D Pixel */}
          <rect x="4" y="3" width="7" height="2" fill="#94a3b8" />
          <rect x="3" y="5" width="10" height="7" fill="#64748b" />
          <rect x="2" y="7" width="12" height="5" fill="#475569" />
          <rect x="3" y="12" width="10" height="2" fill="#334155" />
          <rect x="5" y="4" width="3" height="2" fill="#cbd5e1" />
          <rect x="4" y="7" width="2" height="2" fill="#334155" />
          <rect x="9" y="8" width="3" height="2" fill="#1e293b" />
        </svg>
      );

    case 'prohibited':
    case 'ban':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          {/* Lingkaran Larangan Merah dengan Garis Silang */}
          <rect x="4" y="1" width="8" height="2" fill="#ef4444" />
          <rect x="2" y="3" width="12" height="2" fill="#ef4444" />
          <rect x="1" y="4" width="2" height="8" fill="#ef4444" />
          <rect x="13" y="4" width="2" height="8" fill="#ef4444" />
          <rect x="2" y="11" width="12" height="2" fill="#ef4444" />
          <rect x="4" y="13" width="8" height="2" fill="#ef4444" />
          {/* Garis Silang Diagonal */}
          <rect x="3" y="3" width="3" height="3" fill="#ef4444" />
          <rect x="5" y="5" width="3" height="3" fill="#ef4444" />
          <rect x="7" y="7" width="2" height="2" fill="#ef4444" />
          <rect x="8" y="8" width="3" height="3" fill="#ef4444" />
          <rect x="10" y="10" width="3" height="3" fill="#ef4444" />
          {/* Latar Putih Transparan */}
          <rect x="4" y="4" width="3" height="3" fill="#fee2e2" />
          <rect x="9" y="5" width="3" height="3" fill="#fee2e2" />
        </svg>
      );

    case 'runner':
    case 'evacuate':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          {/* Kepala Pelari */}
          <rect x="10" y="1" width="3" height="3" fill="#34d399" />
          {/* Tubuh Miring */}
          <rect x="7" y="4" width="4" height="4" fill="#10b981" />
          {/* Lengan Depan & Belakang */}
          <rect x="12" y="5" width="3" height="2" fill="#34d399" />
          <rect x="4" y="4" width="3" height="2" fill="#059669" />
          {/* Kaki Berlari */}
          <rect x="8" y="8" width="2" height="3" fill="#047857" />
          <rect x="10" y="10" width="3" height="2" fill="#34d399" />
          <rect x="12" y="12" width="2" height="2" fill="#059669" />
          <rect x="5" y="8" width="3" height="2" fill="#047857" />
          <rect x="3" y="10" width="3" height="2" fill="#059669" />
          <rect x="1" y="12" width="3" height="2" fill="#34d399" />
        </svg>
      );

    case 'siren':
      return (
        <svg
          viewBox="0 0 16 16"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          {/* Kubah Sirine EWS Merah / Kuning */}
          <rect x="5" y="3" width="6" height="3" fill="#ef4444" />
          <rect x="4" y="6" width="8" height="4" fill="#dc2626" />
          <rect x="6" y="4" width="2" height="2" fill="#fca5a5" />
          {/* Dudukan Sirine */}
          <rect x="3" y="10" width="10" height="2" fill="#475569" />
          <rect x="4" y="12" width="8" height="2" fill="#1e293b" />
          {/* Sinar Gelombang Peringatan */}
          <rect x="2" y="2" width="2" height="1" fill="#facc15" />
          <rect x="12" y="2" width="2" height="1" fill="#facc15" />
          <rect x="1" y="5" width="1" height="2" fill="#facc15" />
          <rect x="14" y="5" width="1" height="2" fill="#facc15" />
        </svg>
      );

    case 'dot-yellow':
      return (
        <svg
          viewBox="0 0 12 12"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          <rect x="1" y="1" width="10" height="10" fill="#78350f" />
          <rect x="2" y="2" width="8" height="8" fill="#facc15" />
          <rect x="3" y="3" width="3" height="3" fill="#fef08a" />
        </svg>
      );

    case 'dot-red':
      return (
        <svg
          viewBox="0 0 12 12"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          <rect x="1" y="1" width="10" height="10" fill="#4c0519" />
          <rect x="2" y="2" width="8" height="8" fill="#f43f5e" />
          <rect x="3" y="3" width="3" height="3" fill="#fecdd3" />
        </svg>
      );

    case 'dot-orange':
      return (
        <svg
          viewBox="0 0 12 12"
          width={s}
          height={s}
          shapeRendering="crispEdges"
          className={`inline-block ${className}`}
        >
          <rect x="1" y="1" width="10" height="10" fill="#7c2d12" />
          <rect x="2" y="2" width="8" height="8" fill="#f97316" />
          <rect x="3" y="3" width="3" height="3" fill="#ffedd5" />
        </svg>
      );

    default:
      return (
        <span className={`inline-block ${className}`} style={{ width: s, height: s, color }}>
          ●
        </span>
      );
  }
}
