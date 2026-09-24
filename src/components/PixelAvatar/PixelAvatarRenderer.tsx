import React, { memo } from 'react';
import { DEFAULT_CUSTOM_AVATAR, type CustomAvatarConfig } from '../../store/teacherStore';

interface PixelAvatarRendererProps {
  config?: CustomAvatarConfig;
  size?: number; // Size in px (e.g. 40, 48, 64, 120)
  className?: string;
  animate?: boolean;
  bordered?: boolean;
}

// Color palettes for skin tones
const SKIN_PALETTE: Record<string, { base: string; shadow: string; blush?: string }> = {
  light: { base: '#fed7aa', shadow: '#fba874', blush: '#fb7185' },
  warm: { base: '#f5af7e', shadow: '#d97746', blush: '#f43f5e' },
  tan: { base: '#d97706', shadow: '#9a4214', blush: '#b45309' },
  brown: { base: '#92400e', shadow: '#5c2a10' },
  dark: { base: '#5c2c16', shadow: '#3a190b' },
  robot: { base: '#38bdf8', shadow: '#0284c7', blush: '#67e8f9' },
};

// Background gradient themes
const BG_THEMES: Record<string, { from: string; to: string; border: string }> = {
  amber: { from: '#f59e0b', to: '#b45309', border: '#78350f' },
  blue: { from: '#38bdf8', to: '#1d4ed8', border: '#1e3a8a' },
  emerald: { from: '#34d399', to: '#059669', border: '#064e3b' },
  rose: { from: '#fb7185', to: '#e11d48', border: '#881337' },
  purple: { from: '#c084fc', to: '#7c3aed', border: '#4c1d95' },
  cyan: { from: '#22d3ee', to: '#0891b2', border: '#164e63' },
};

const PixelAvatarRendererComponent: React.FC<PixelAvatarRendererProps> = ({
  config = DEFAULT_CUSTOM_AVATAR,
  size = 48,
  className = '',
  bordered = true,
}) => {
  const skin = SKIN_PALETTE[config.skin] || SKIN_PALETTE.warm;
  const hairColor = config.hairColor || '#3e2723';
  const bgTheme = BG_THEMES[config.bgTheme] || BG_THEMES.amber;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden select-none ${
        bordered ? 'rounded-xl shadow-[0_3px_0_rgba(0,0,0,0.35)]' : 'rounded-lg'
      } ${className}`}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(180deg, ${bgTheme.from} 0%, ${bgTheme.to} 100%)`,
        border: bordered ? `2px solid ${bgTheme.border}` : 'none',
      }}
    >
      <svg
        viewBox="0 0 32 32"
        width="100%"
        height="100%"
        style={{ shapeRendering: 'crispEdges' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ── 1. BODY BASE & NECK ── */}
        {/* Neck */}
        <rect x="13" y="19" width="6" height="3" fill={skin.shadow} />

        {/* ── 2. OUTFIT / SERAGAM ── */}
        {config.outfit === 'vest-orange' && (
          <g>
            {/* Inner shirt */}
            <rect x="12" y="21" width="8" height="11" fill="#1e293b" />
            {/* Orange Vest */}
            <rect x="7" y="22" width="18" height="10" fill="#ea580c" />
            <rect x="9" y="21" width="14" height="2" fill="#ea580c" />
            {/* Reflective silver stripes */}
            <rect x="7" y="25" width="18" height="2" fill="#e2e8f0" />
            <rect x="7" y="28" width="18" height="2" fill="#facc15" />
            {/* Vest Collar / Zipper */}
            <rect x="15" y="22" width="2" height="10" fill="#1e293b" />
            <rect x="15" y="23" width="2" height="2" fill="#94a3b8" />
          </g>
        )}

        {config.outfit === 'jacket-blue' && (
          <g>
            {/* Inner shirt */}
            <rect x="12" y="21" width="8" height="11" fill="#0f172a" />
            {/* Blue Geologist Jacket */}
            <rect x="7" y="22" width="18" height="10" fill="#0284c7" />
            <rect x="9" y="21" width="14" height="2" fill="#0284c7" />
            {/* Yellow Expedition badge & pockets */}
            <rect x="9" y="24" width="4" height="4" fill="#0369a1" />
            <rect x="19" y="24" width="4" height="4" fill="#0369a1" />
            <rect x="10" y="25" width="2" height="1" fill="#facc15" />
            {/* Center zipper */}
            <rect x="15" y="22" width="2" height="10" fill="#facc15" />
          </g>
        )}

        {config.outfit === 'gear-red' && (
          <g>
            {/* Red Field Hazmat / Emergency Gear */}
            <rect x="7" y="22" width="18" height="10" fill="#dc2626" />
            <rect x="9" y="21" width="14" height="2" fill="#dc2626" />
            {/* Black shoulder pads & stripes */}
            <rect x="7" y="22" width="4" height="3" fill="#1e1b18" />
            <rect x="21" y="22" width="4" height="3" fill="#1e1b18" />
            <rect x="7" y="27" width="18" height="2" fill="#ffffff" />
            {/* Center black stripe */}
            <rect x="15" y="21" width="2" height="11" fill="#1e1b18" />
          </g>
        )}

        {config.outfit === 'khaki' && (
          <g>
            {/* Khaki Explorer Ranger Shirt */}
            <rect x="7" y="22" width="18" height="10" fill="#a16207" />
            <rect x="9" y="21" width="14" height="2" fill="#a16207" />
            {/* Collar */}
            <polygon points="12,21 16,25 15,21" fill="#78350f" />
            <polygon points="20,21 16,25 17,21" fill="#78350f" />
            {/* Chest Pockets with green flaps */}
            <rect x="9" y="24" width="4" height="4" fill="#78350f" />
            <rect x="19" y="24" width="4" height="4" fill="#78350f" />
            <rect x="9" y="24" width="4" height="1" fill="#15803d" />
            <rect x="19" y="24" width="4" height="1" fill="#15803d" />
          </g>
        )}

        {config.outfit === 'cyber' && (
          <g>
            {/* Cyber Mech Suit */}
            <rect x="7" y="22" width="18" height="10" fill="#0f172a" />
            <rect x="9" y="21" width="14" height="2" fill="#0f172a" />
            {/* Glowing neon plating */}
            <rect x="8" y="24" width="3" height="6" fill="#06b6d4" />
            <rect x="21" y="24" width="3" height="6" fill="#06b6d4" />
            {/* Glowing Core reactor in chest */}
            <rect x="14" y="24" width="4" height="4" fill="#38bdf8" />
            <rect x="15" y="25" width="2" height="2" fill="#ffffff" />
          </g>
        )}

        {/* ── 3. HEAD & FACE ── */}
        {/* Head Base */}
        <rect x="9" y="9" width="14" height="11" fill={skin.base} />
        <rect x="10" y="8" width="12" height="1" fill={skin.base} />
        <rect x="10" y="20" width="12" height="1" fill={skin.shadow} />
        {/* Ears */}
        <rect x="7" y="12" width="2" height="4" fill={skin.base} />
        <rect x="23" y="12" width="2" height="4" fill={skin.base} />
        <rect x="8" y="13" width="1" height="2" fill={skin.shadow} />
        <rect x="23" y="13" width="1" height="2" fill={skin.shadow} />

        {/* Cheeks / Blush if present */}
        {skin.blush && (
          <g opacity="0.6">
            <rect x="9" y="16" width="2" height="1" fill={skin.blush} />
            <rect x="21" y="16" width="2" height="1" fill={skin.blush} />
          </g>
        )}

        {/* ── 4. EYES & EXPRESSIONS ── */}
        {config.eyes === 'determined' && (
          <g>
            {/* Eyebrows */}
            <rect x="10" y="11" width="4" height="1" fill="#1e1b18" />
            <rect x="18" y="11" width="4" height="1" fill="#1e1b18" />
            {/* Eyes */}
            <rect x="11" y="13" width="3" height="3" fill="#1e1b18" />
            <rect x="18" y="13" width="3" height="3" fill="#1e1b18" />
            {/* Catchlight */}
            <rect x="11" y="13" width="1" height="1" fill="#ffffff" />
            <rect x="18" y="13" width="1" height="1" fill="#ffffff" />
            {/* Confident smile */}
            <rect x="14" y="18" width="4" height="1" fill="#78350f" />
            <rect x="17" y="17" width="1" height="1" fill="#78350f" />
          </g>
        )}

        {config.eyes === 'happy' && (
          <g>
            {/* Happy Curved Eyes ^_^ */}
            <rect x="11" y="13" width="3" height="1" fill="#1e1b18" />
            <rect x="10" y="14" width="1" height="2" fill="#1e1b18" />
            <rect x="14" y="14" width="1" height="2" fill="#1e1b18" />
            <rect x="18" y="13" width="3" height="1" fill="#1e1b18" />
            <rect x="17" y="14" width="1" height="2" fill="#1e1b18" />
            <rect x="21" y="14" width="1" height="2" fill="#1e1b18" />
            {/* Big Open Smile */}
            <rect x="13" y="17" width="6" height="2" fill="#881337" />
            <rect x="14" y="18" width="4" height="1" fill="#f43f5e" />
          </g>
        )}

        {config.eyes === 'focus' && (
          <g>
            {/* Sharp focused eyebrows */}
            <polygon points="10,11 14,13 14,12 10,10" fill="#1e1b18" />
            <polygon points="22,11 18,13 18,12 22,10" fill="#1e1b18" />
            {/* Sharp Eyes */}
            <rect x="11" y="13" width="3" height="2" fill="#1e1b18" />
            <rect x="18" y="13" width="3" height="2" fill="#1e1b18" />
            <rect x="12" y="13" width="1" height="1" fill="#ffffff" />
            <rect x="19" y="13" width="1" height="1" fill="#ffffff" />
            {/* Focused Mouth */}
            <rect x="14" y="18" width="4" height="1" fill="#1e1b18" />
          </g>
        )}

        {config.eyes === 'goggles' && (
          <g>
            {/* Eyes underneath */}
            <rect x="11" y="14" width="2" height="2" fill="#1e1b18" />
            <rect x="19" y="14" width="2" height="2" fill="#1e1b18" />
            {/* Safety Goggles / Visor */}
            <rect x="8" y="12" width="16" height="5" fill="#0284c7" opacity="0.4" />
            <rect x="8" y="12" width="16" height="1" fill="#0f172a" />
            <rect x="8" y="16" width="16" height="1" fill="#0f172a" />
            <rect x="8" y="12" width="1" height="5" fill="#0f172a" />
            <rect x="23" y="12" width="1" height="5" fill="#0f172a" />
            <rect x="15" y="13" width="2" height="2" fill="#0f172a" />
            {/* Lens Glare */}
            <rect x="10" y="13" width="3" height="1" fill="#ffffff" opacity="0.8" />
            <rect x="18" y="13" width="3" height="1" fill="#ffffff" opacity="0.8" />
            {/* Mouth */}
            <rect x="14" y="18" width="4" height="1" fill="#78350f" />
          </g>
        )}

        {config.eyes === 'glasses' && (
          <g>
            {/* Eyes */}
            <rect x="11" y="13" width="2" height="2" fill="#1e1b18" />
            <rect x="19" y="13" width="2" height="2" fill="#1e1b18" />
            {/* Glasses Frame */}
            <rect x="9" y="12" width="6" height="5" fill="none" stroke="#1e293b" strokeWidth="1" />
            <rect x="17" y="12" width="6" height="5" fill="none" stroke="#1e293b" strokeWidth="1" />
            <rect x="15" y="14" width="2" height="1" fill="#1e293b" />
            {/* Glare */}
            <rect x="10" y="13" width="2" height="1" fill="#ffffff" opacity="0.7" />
            <rect x="18" y="13" width="2" height="1" fill="#ffffff" opacity="0.7" />
            {/* Smart Smile */}
            <rect x="14" y="18" width="4" height="1" fill="#78350f" />
          </g>
        )}

        {/* ── 5. HAIR & HEADWEAR ── */}
        {config.hairStyle === 'spiky' && (
          <g fill={hairColor}>
            {/* Top spiky spikes */}
            <rect x="8" y="6" width="16" height="4" />
            <rect x="10" y="4" width="4" height="2" />
            <rect x="15" y="3" width="5" height="3" />
            <rect x="7" y="8" width="4" height="5" />
            <rect x="21" y="8" width="4" height="5" />
            {/* Forehead Bangs */}
            <rect x="10" y="8" width="5" height="3" />
            <rect x="16" y="8" width="4" height="2" />
          </g>
        )}

        {config.hairStyle === 'parted' && (
          <g fill={hairColor}>
            {/* Clean side-parted hair */}
            <rect x="8" y="5" width="16" height="5" />
            <rect x="10" y="4" width="12" height="2" />
            {/* Side burns */}
            <rect x="7" y="7" width="3" height="7" />
            <rect x="22" y="7" width="3" height="7" />
            {/* Side swoop */}
            <rect x="9" y="8" width="8" height="3" />
            <rect x="18" y="8" width="4" height="2" />
          </g>
        )}

        {config.hairStyle === 'curly' && (
          <g fill={hairColor}>
            {/* Curly textured afro/curls */}
            <rect x="7" y="4" width="18" height="7" />
            <rect x="9" y="3" width="14" height="2" />
            <rect x="6" y="6" width="20" height="6" />
            {/* Curly side volume */}
            <rect x="5" y="8" width="3" height="7" />
            <rect x="24" y="8" width="3" height="7" />
            {/* Forehead curls */}
            <rect x="9" y="9" width="4" height="2" />
            <rect x="14" y="8" width="4" height="3" />
            <rect x="19" y="9" width="4" height="2" />
          </g>
        )}

        {config.hairStyle === 'ponytail' && (
          <g fill={hairColor}>
            {/* Top base */}
            <rect x="8" y="5" width="16" height="5" />
            <rect x="10" y="4" width="12" height="2" />
            {/* Bangs */}
            <rect x="10" y="8" width="12" height="3" />
            {/* Side strands */}
            <rect x="7" y="8" width="3" height="7" />
            <rect x="22" y="8" width="3" height="7" />
            {/* High Ponytail sticking out right */}
            <rect x="22" y="3" width="5" height="5" />
            <rect x="25" y="5" width="4" height="6" />
            <rect x="27" y="10" width="3" height="5" />
            {/* Ponytail hair tie */}
            <rect x="22" y="4" width="2" height="3" fill="#ea580c" />
          </g>
        )}

        {config.hairStyle === 'bob' && (
          <g fill={hairColor}>
            {/* Cute chin-length bob cut */}
            <rect x="7" y="4" width="18" height="6" />
            <rect x="9" y="3" width="14" height="2" />
            {/* Side bob curves */}
            <rect x="6" y="8" width="4" height="11" />
            <rect x="22" y="8" width="4" height="11" />
            {/* Front straight bangs */}
            <rect x="9" y="8" width="14" height="3" />
          </g>
        )}

        {config.hairStyle === 'hijab' && (
          <g fill={hairColor}>
            {/* Top head wrap */}
            <rect x="7" y="4" width="18" height="5" />
            <rect x="9" y="3" width="14" height="2" />
            {/* Side drapes framing face without covering eyes */}
            <rect x="6" y="6" width="3" height="14" />
            <rect x="23" y="6" width="3" height="14" />
            {/* Forehead inner cap trim (above eyes) */}
            <rect x="9" y="8" width="14" height="2" fill="#ffffff" opacity="0.85" />
            {/* Chin & Neck wrap (below mouth) */}
            <rect x="8" y="19" width="16" height="4" />
            <rect x="10" y="22" width="12" height="2" />
            {/* Rescuer Gold Brooch */}
            <circle cx="16" cy="20" r="1.5" fill="#facc15" />
          </g>
        )}

        {config.hairStyle === 'headband' && (
          <g>
            {/* Spiky hair on top */}
            <g fill={hairColor}>
              <rect x="8" y="4" width="16" height="5" />
              <rect x="11" y="2" width="4" height="3" />
              <rect x="16" y="2" width="5" height="4" />
              <rect x="7" y="8" width="3" height="6" />
              <rect x="22" y="8" width="3" height="6" />
              <rect x="10" y="10" width="12" height="2" />
            </g>
            {/* Red Adventure Headband */}
            <rect x="7" y="7" width="18" height="3" fill="#dc2626" />
            <rect x="14" y="7" width="4" height="3" fill="#facc15" /> {/* Emblem */}
          </g>
        )}

        {config.hairStyle === 'cap' && (
          <g>
            {/* Hair underneath */}
            <rect x="7" y="8" width="3" height="6" fill={hairColor} />
            <rect x="22" y="8" width="3" height="6" fill={hairColor} />
            {/* Field Rescuer Cap */}
            <rect x="8" y="4" width="16" height="6" fill="#1e293b" />
            <rect x="10" y="3" width="12" height="2" fill="#1e293b" />
            {/* Cap Visor / Brim */}
            <rect x="6" y="8" width="20" height="2" fill="#0f172a" />
            {/* Cap Rescuer Badge */}
            <rect x="14" y="5" width="4" height="2" fill="#ea580c" />
            <rect x="15" y="5" width="2" height="1" fill="#facc15" />
          </g>
        )}

        {/* ── 6. ACCESSORIES ── */}
        {config.accessory === 'walkie' && (
          <g>
            {/* Walkie Talkie on Left Shoulder */}
            <rect x="4" y="20" width="4" height="7" fill="#1e293b" />
            {/* Antenna */}
            <rect x="5" y="15" width="1" height="5" fill="#0f172a" />
            {/* Speaker grill */}
            <rect x="5" y="22" width="2" height="1" fill="#475569" />
            <rect x="5" y="24" width="2" height="1" fill="#475569" />
            {/* Status light */}
            <rect x="7" y="21" width="1" height="1" fill="#22c55e" className="animate-pulse" />
          </g>
        )}

        {config.accessory === 'headlamp' && (
          <g>
            {/* Headlamp Strap */}
            <rect x="7" y="7" width="18" height="2" fill="#0f172a" />
            {/* Headlamp Housing & LED */}
            <rect x="14" y="5" width="4" height="4" fill="#334155" />
            <rect x="15" y="6" width="2" height="2" fill="#fef08a" className="animate-pulse" />
            {/* Light beam indicator */}
            <polygon points="14,6 18,6 22,2 10,2" fill="#fef08a" opacity="0.35" />
          </g>
        )}

        {config.accessory === 'mask' && (
          <g>
            {/* Volcanic Ash / Emergency Respirator Mask */}
            <rect x="11" y="16" width="10" height="5" fill="#e2e8f0" />
            <rect x="12" y="15" width="8" height="2" fill="#cbd5e1" />
            {/* Filter valves */}
            <circle cx="13" cy="18" r="1" fill="#0284c7" />
            <circle cx="19" cy="18" r="1" fill="#0284c7" />
            {/* Strap */}
            <line x1="11" y1="17" x2="8" y2="15" stroke="#64748b" strokeWidth="1" />
            <line x1="21" y1="17" x2="24" y2="15" stroke="#64748b" strokeWidth="1" />
          </g>
        )}

        {config.accessory === 'badge' && (
          <g>
            {/* Golden Star Medal of Honor */}
            <rect x="19" y="23" width="5" height="5" fill="#f59e0b" />
            <polygon points="21.5,22 23,26 20,26" fill="#fbbf24" />
            <rect x="21" y="24" width="1" height="1" fill="#ffffff" />
          </g>
        )}
      </svg>
    </div>
  );
};

export const PixelAvatarRenderer = memo(PixelAvatarRendererComponent);
