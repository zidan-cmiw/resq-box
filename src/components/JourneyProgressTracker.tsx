import {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';
import PixelIcon from './PixelIcon';
import { PixelAvatarRenderer } from './PixelAvatar/PixelAvatarRenderer';
import type { CustomAvatarConfig } from '../store/teacherStore';

export interface JourneyAreaCheckpoint {
  id: string;
  name: string;
  shortName: string;
  metricLabel: string;
  iconName: string;
  themeColor: string;
}

export interface JourneyProgressTrackerRef {
  updateProgress: (
    percent: number,
    facing?: 'left' | 'right',
    metricText?: string
  ) => void;
}

export interface JourneyProgressTrackerProps {
  title?: string;
  levelBadge?: string;
  totalAreas: number;
  currentAreaIndex: number;
  areas: JourneyAreaCheckpoint[];
  avatarConfig?: CustomAvatarConfig;
  initialPercent?: number;
  className?: string;
}

const JourneyProgressTracker = forwardRef<
  JourneyProgressTrackerRef,
  JourneyProgressTrackerProps
>(
  (
    {
      totalAreas,
      currentAreaIndex,
      areas,
      avatarConfig,
      initialPercent,
      className = '',
    },
    ref
  ) => {
    // Menghitung default persentase jika belum ada update imperatif
    const fallbackPct = Math.max(
      0,
      Math.min(
        100,
        initialPercent !== undefined
          ? initialPercent
          : ((currentAreaIndex + 0.5) / totalAreas) * 100
      )
    );

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // Refs untuk update DOM langsung di RAF loop (60 FPS tanpa re-render React berlebih)
    const fillBarRef = useRef<HTMLDivElement>(null);
    const markerRef = useRef<HTMLDivElement>(null);
    const markerAvatarRef = useRef<HTMLDivElement>(null);
    const markerLabelRef = useRef<HTMLSpanElement>(null);
    const currentPercentRef = useRef<number>(fallbackPct);

    useImperativeHandle(ref, () => ({
      updateProgress: (percent, facing, metricText) => {
        const clamped = Math.max(0, Math.min(100, percent));
        currentPercentRef.current = clamped;

        if (fillBarRef.current) {
          fillBarRef.current.style.width = `${clamped}%`;
        }

        if (markerRef.current) {
          markerRef.current.style.left = `${clamped}%`;
        }

        if (markerAvatarRef.current && facing) {
          markerAvatarRef.current.style.transform =
            facing === 'left' ? 'scaleX(-1)' : 'scaleX(1)';
        }

        if (markerLabelRef.current && metricText !== undefined) {
          markerLabelRef.current.textContent = metricText;
        }
      },
    }));

    const currentArea = areas[currentAreaIndex] || areas[0];

    return (
      <div
        className={`pointer-events-none select-none font-pixel w-[min(94vw,560px)] mx-auto relative ${className}`}
      >
        {/* Tooltip Hover Info (Mengambang saat kursor diarahkan ke node checkpoint) */}
        {hoveredIndex !== null && areas[hoveredIndex] && (
          <div
            className="absolute -top-7 z-30 pointer-events-none -translate-x-1/2 transition-all duration-75"
            style={{
              left: `${((hoveredIndex + 0.5) / totalAreas) * 100}%`,
            }}
          >
            <div className="bg-slate-950/95 text-amber-200 border border-amber-400/80 px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-pixel whitespace-nowrap shadow-lg flex items-center gap-1">
              <PixelIcon name={areas[hoveredIndex].iconName} size={10} />
              <span>{areas[hoveredIndex].name}</span>
              <span className="text-amber-400">({areas[hoveredIndex].metricLabel})</span>
            </div>
          </div>
        )}

        {/* ── TRACK BAR CONTAINER DENGAN AVATAR MARKER & CHECKPOINT NODES ── */}
        <div className="relative pt-6 sm:pt-7 pb-4 px-2 sm:px-3">
          {/* 1. Track Bar Kapsul */}
          <div className="relative h-2.5 sm:h-3 rounded-full bg-slate-950/85 border border-slate-700/80 shadow-[0_2px_8px_rgba(0,0,0,0.8),inset_0_1px_3px_rgba(0,0,0,0.9)]">
            {/* Dynamic Progress Fill Bar */}
            <div
              ref={fillBarRef}
              className="absolute left-0 top-0 bottom-0 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"
              style={{
                width: `${fallbackPct}%`,
                background:
                  'linear-gradient(90deg, #10b981 0%, #84cc16 28%, #eab308 55%, #f97316 80%, #ef4444 100%)',
              }}
            />

            {/* 2. Checkpoint Milestone Nodes */}
            {areas.map((area, idx) => {
              const nodeX = ((idx + 0.5) / totalAreas) * 100;
              const isCompleted = idx < currentAreaIndex;
              const isCurrent = idx === currentAreaIndex;

              return (
                <div
                  key={area.id}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 pointer-events-auto cursor-pointer group"
                  style={{ left: `${nodeX}%` }}
                >
                  {/* Lingkaran Pin Checkpoint */}
                  <div
                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-emerald-600 border-2 border-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.9)] text-emerald-100 scale-95'
                        : isCurrent
                          ? 'bg-gradient-to-b from-amber-400 to-amber-600 border-2 border-yellow-200 shadow-[0_0_12px_rgba(251,191,36,0.95)] text-slate-950 scale-110 animate-pulse'
                          : 'bg-slate-900/90 border border-slate-600/80 text-slate-400 opacity-75 hover:opacity-100 hover:scale-105'
                    }`}
                    title={`${area.name} (${area.metricLabel})`}
                  >
                    {isCompleted ? (
                      <PixelIcon name="check" size={10} className="text-white drop-shadow-sm" />
                    ) : isCurrent ? (
                      <PixelIcon name={area.iconName} size={11} className="text-slate-950" />
                    ) : (
                      <PixelIcon name={area.iconName} size={9} className="text-slate-400" />
                    )}
                  </div>

                  {/* Label Teks di Bawah Node (Metric) */}
                  <span
                    className={`absolute -bottom-3.5 sm:-bottom-4 left-1/2 -translate-x-1/2 text-[7px] sm:text-[8px] whitespace-nowrap font-pixel pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,1)] ${
                      isCurrent
                        ? 'text-yellow-300 font-bold'
                        : isCompleted
                          ? 'text-emerald-300'
                          : 'text-slate-400'
                    }`}
                  >
                    {area.metricLabel}
                  </span>
                </div>
              );
            })}

            {/* 3. Real-Time Moving Character Marker (Avatar Siswa + Pointer Panah ke Bar) */}
            <div
              ref={markerRef}
              className="absolute bottom-full mb-0.5 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none transition-none"
              style={{ left: `${fallbackPct}%` }}
            >
              {/* Badge Metrik / Posisi Teks Real-Time */}
              <span
                ref={markerLabelRef}
                className="mb-0.5 px-1 sm:px-1.5 py-0.2 rounded bg-slate-950/95 border border-cyan-400/90 text-[7px] sm:text-[8px] text-cyan-200 font-pixel whitespace-nowrap shadow-md drop-shadow-[0_1px_2px_rgba(0,0,0,1)]"
              >
                {currentArea?.shortName}
              </span>

              {/* Lingkaran Avatar Mini Siswa */}
              <div
                ref={markerAvatarRef}
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-cyan-300 bg-slate-950 shadow-[0_0_10px_rgba(56,189,248,0.9)] overflow-hidden flex items-center justify-center shrink-0 transition-transform duration-75"
              >
                <PixelAvatarRenderer
                  config={avatarConfig}
                  size={20}
                  bordered={false}
                />
              </div>

              {/* Downward Triangle Pointer (▼) Menunjuk Tepat ke Track Bar */}
              <div className="w-0 h-0 border-l-[3.5px] sm:border-l-[4px] border-l-transparent border-r-[3.5px] sm:border-r-[4px] border-r-transparent border-t-[5px] sm:border-t-[6px] border-t-cyan-300 drop-shadow-[0_0_4px_rgba(56,189,248,0.8)] -mt-0.5" />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

JourneyProgressTracker.displayName = 'JourneyProgressTracker';

// ── KONFIGURASI 8 CHECKPOINT LEVEL 1: EARTH EXPLORER ──
export const LEVEL1_TRACKER_AREAS: JourneyAreaCheckpoint[] = [
  {
    id: 'surface',
    name: 'Permukaan Bumi',
    shortName: 'Permukaan',
    metricLabel: '0 km',
    iconName: 'mountain',
    themeColor: '#10b981',
  },
  {
    id: 'crust',
    name: 'Kerak Bumi',
    shortName: 'Kerak',
    metricLabel: '35 km',
    iconName: 'pickaxe',
    themeColor: '#f59e0b',
  },
  {
    id: 'mantle',
    name: 'Mantel Bumi',
    shortName: 'Mantel',
    metricLabel: '2.900 km',
    iconName: 'flame',
    themeColor: '#f97316',
  },
  {
    id: 'outerCore',
    name: 'Inti Luar',
    shortName: 'Inti Luar',
    metricLabel: '5.150 km',
    iconName: 'zap',
    themeColor: '#ef4444',
  },
  {
    id: 'innerCore',
    name: 'Inti Dalam',
    shortName: 'Inti Dalam',
    metricLabel: '6.371 km',
    iconName: 'crystal',
    themeColor: '#eab308',
  },
  {
    id: 'divergent',
    name: 'Batas Divergen',
    shortName: 'Divergen',
    metricLabel: 'Divergen',
    iconName: 'divergent',
    themeColor: '#06b6d4',
  },
  {
    id: 'convergent',
    name: 'Batas Konvergen',
    shortName: 'Konvergen',
    metricLabel: 'Konvergen',
    iconName: 'convergent',
    themeColor: '#3b82f6',
  },
  {
    id: 'transform',
    name: 'Batas Transform',
    shortName: 'Transform',
    metricLabel: 'Transform',
    iconName: 'transform',
    themeColor: '#a855f7',
  },
];

// ── KONFIGURASI 6 CHECKPOINT LEVEL 2: DISASTER ANALYST ──
export const LEVEL2_TRACKER_AREAS: JourneyAreaCheckpoint[] = [
  {
    id: 'area-mitigasi-gempa',
    name: 'Ruang Kelas (Teori Gempa)',
    shortName: 'Teori Gempa',
    metricLabel: 'SOP 72 Jam',
    iconName: 'book',
    themeColor: '#3b82f6',
  },
  {
    id: 'area-simulasi-gempa',
    name: 'Simulasi Gempa (Drill)',
    shortName: 'Drill Gempa',
    metricLabel: 'Drop-Cover',
    iconName: 'earthquake',
    themeColor: '#f59e0b',
  },
  {
    id: 'area-lapangan-evakuasi',
    name: 'Lapangan Evakuasi',
    shortName: 'Titik Kumpul',
    metricLabel: 'Area Aman',
    iconName: 'runner',
    themeColor: '#10b981',
  },
  {
    id: 'area-pos-pengamatan-merapi',
    name: 'Pos Pengamatan Merapi',
    shortName: 'Pos PGA',
    metricLabel: 'Status PVMBG',
    iconName: 'seismogram',
    themeColor: '#06b6d4',
  },
  {
    id: 'area-simulasi-merapi',
    name: 'Simulasi Erupsi Merapi',
    shortName: 'Simulasi Erupsi',
    metricLabel: 'Status AWAS',
    iconName: 'volcano',
    themeColor: '#ef4444',
  },
  {
    id: 'area-barak-pengungsian',
    name: 'Barak Pengungsian',
    shortName: 'Barak BNPB',
    metricLabel: 'Zona Aman KRB I',
    iconName: 'tent',
    themeColor: '#059669',
  },
];

export default JourneyProgressTracker;
