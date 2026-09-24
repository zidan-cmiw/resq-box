import AnimatedCounter from './AnimatedCounter';

interface DepthGaugeProps {
  /** Current depth in km, 0-6371 */
  depth: number;
  /** Current temperature in °C */
  temperature: number;
  /** Label for the current layer */
  label: string;
  className?: string;
}

export default function DepthGauge({ depth, temperature, label, className = '' }: DepthGaugeProps) {
  const maxDepth = 6371;
  const pct = Math.min((depth / maxDepth) * 100, 100);

  // Temperature color: blue(0°C) → orange(3000°C) → red(6000°C)
  const tempHue = Math.max(0, 30 - (temperature / 6000) * 30);
  const tempColor = `hsl(${tempHue}, 90%, 55%)`;

  return (
    <div className={`flex gap-4 items-stretch ${className}`}>
      {/* Depth Bar */}
      <div className="flex flex-col items-center gap-1 w-14">
        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Kedalaman</span>
        <div className="relative flex-1 w-6 bg-surface-variant rounded-full overflow-hidden min-h-[120px]">
          <div
            className="absolute bottom-0 left-0 right-0 rounded-full transition-all duration-1000 ease-out"
            style={{
              height: `${pct}%`,
              background: `linear-gradient(to top, #dc2626, #f97316, #a8a29e)`,
            }}
          />
          {/* Pointer */}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full border-2 border-primary shadow-lg transition-all duration-1000 ease-out z-10"
            style={{ bottom: `calc(${pct}% - 6px)` }}
          />
        </div>
        <div className="text-center">
          <AnimatedCounter end={depth} suffix=" km" className="text-xs font-bold text-on-surface tabular-nums" />
        </div>
      </div>

      {/* Temperature Bar */}
      <div className="flex flex-col items-center gap-1 w-14">
        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Suhu</span>
        <div className="relative flex-1 w-6 bg-surface-variant rounded-full overflow-hidden min-h-[120px]">
          {/* Thermometer fill */}
          <div
            className="absolute bottom-0 left-0 right-0 rounded-full transition-all duration-1000 ease-out"
            style={{
              height: `${Math.min((temperature / 6000) * 100, 100)}%`,
              background: `linear-gradient(to top, ${tempColor}, #fbbf24)`,
            }}
          />
          {/* Thermometer bulb */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full shadow-inner transition-colors duration-1000"
            style={{ backgroundColor: tempColor }}
          />
        </div>
        <div className="text-center">
          <AnimatedCounter end={temperature} suffix="°C" className="text-xs font-bold tabular-nums" style={{ color: tempColor } as any} />
        </div>
      </div>

      {/* Layer Label */}
      <div className="flex items-center">
        <div
          className="px-3 py-1.5 rounded-lg text-xs font-bold text-on-surface bg-surface-variant/60 transition-all duration-500 whitespace-nowrap"
        >
          {label}
        </div>
      </div>
    </div>
  );
}
