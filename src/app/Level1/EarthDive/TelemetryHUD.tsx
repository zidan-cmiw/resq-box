import { useState } from 'react';
import PixelIcon from '../../../components/PixelIcon';
import { retroAudio } from '../../../utils/retroAudio';

interface TelemetryHUDProps {
  currentDepthKm?: number;
  currentTempLabel?: string;
  currentPressureGpa?: number;
  crystalsCount: number;
  totalCrystals: number;
  areaDiscoveriesRead?: number;
  areaDiscoveriesTotal?: number;
  playerHp?: number;
}

export default function TelemetryHUD({
  currentDepthKm,
  currentTempLabel,
  currentPressureGpa,
  crystalsCount,
  totalCrystals,
  areaDiscoveriesRead = 0,
  areaDiscoveriesTotal = 0,
  playerHp = 100,
}: TelemetryHUDProps) {
  // Sesuai permintaan pengguna: Tampilan header indikator diciutkan secara default (persis seperti tangkapan layar)
  // di semua ukuran layar (mobile, tablet, desktop) dan dapat dibuka/tutup dengan sekali klik.
  const [isExpanded, setIsExpanded] = useState(false);
  const formattedDepth = currentDepthKm !== undefined ? currentDepthKm.toLocaleString('id-ID') : null;

  return (
    <div className="bg-slate-950/95 backdrop-blur-md border-2 sm:border-3 border-amber-600/90 rounded-2xl sm:rounded-3xl p-1.5 sm:p-2 shadow-[0_5px_0_#231206] text-amber-200 font-sans font-bold flex flex-col items-stretch select-none whitespace-nowrap transition-all duration-200 w-auto min-w-[170px] sm:min-w-[195px] max-w-[calc(100vw-24px)]">
      
      {/* Header Pill yang dapat diklik di SEMUA layar (Mobile, Tablet, Desktop) persis seperti tangkapan layar */}
      <button
        onClick={() => {
          retroAudio.playSelect();
          setIsExpanded(!isExpanded);
        }}
        className={`flex items-center justify-between gap-3 px-2 py-1 text-amber-400 hover:text-amber-200 cursor-pointer transition-all active:translate-y-0.5 border-b border-amber-800/40 ${
          isExpanded ? 'pb-1.5 mb-1.5' : 'pb-1'
        }`}
        title={isExpanded ? "Sembunyikan Telemetri" : "Tampilkan Indikator Telemetri"}
      >
        <span className="flex items-center gap-1.5 tracking-wider font-sans text-[13px] sm:text-[15px] font-extrabold text-amber-400">
          <PixelIcon name="broadcast" size={13} className="text-cyan-400 shrink-0" />
          <span>TELEMETRI</span>
        </span>
        <span className="text-amber-400 font-bold text-[13px] sm:text-[15px] px-1">
          {isExpanded ? '▲' : '▼'}
        </span>
      </button>

      {/* Indikator Telemetri (Muncul saat panel diperluas / diklik) */}
      {isExpanded && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 xl:gap-3 animate-fadeIn pt-1">
          {/* 1. Kedalaman */}
          {formattedDepth !== null && (
            <div className="flex items-center justify-between sm:justify-start gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900/95 border border-blue-500/70 shrink-0 whitespace-nowrap" title="Kedalaman saat ini">
              <div className="flex items-center gap-1.5">
                <PixelIcon name="ruler" size={14} className="text-blue-400 shrink-0" />
                <span className="text-[14.5px] sm:text-[13px] text-blue-300 font-bold tracking-wide">KEDALAMAN</span>
              </div>
              <span className="text-[13px] sm:text-[15px] md:text-base font-extrabold text-blue-100 whitespace-nowrap">
                {formattedDepth} <span className="text-[14.5px] sm:text-[13px] text-blue-300 font-bold">KM</span>
              </span>
            </div>
          )}

          {/* 2. Tekanan */}
          {currentPressureGpa !== undefined && (
            <div className="flex items-center justify-between sm:justify-start gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900/95 border border-rose-500/70 shrink-0 whitespace-nowrap" title="Tekanan interior">
              <div className="flex items-center gap-1.5">
                <PixelIcon name="earthquake" size={14} className="text-rose-400 shrink-0" />
                <span className="text-[14.5px] sm:text-[13px] text-rose-300 font-bold tracking-wide">TEKANAN</span>
              </div>
              <span className="text-[13px] sm:text-[15px] md:text-base font-extrabold text-rose-100 whitespace-nowrap">
                {currentPressureGpa} <span className="text-[14.5px] sm:text-[13px] text-rose-300 font-bold">GPa</span>
              </span>
            </div>
          )}

          {/* 3. Suhu */}
          {currentTempLabel && (
            <div className="flex items-center justify-between sm:justify-start gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900/95 border border-amber-500/70 shrink-0 whitespace-nowrap" title="Suhu Interior Bumi">
              <div className="flex items-center gap-1.5">
                <PixelIcon name="fire" size={14} className="text-amber-400 shrink-0" />
                <span className="text-[14.5px] sm:text-[13px] text-amber-300 font-bold tracking-wide">SUHU</span>
              </div>
              <span className="text-[13px] sm:text-[15px] md:text-base font-extrabold text-amber-100 whitespace-nowrap">
                <span className="inline 2xl:hidden">
                  {currentTempLabel.includes('–') || currentTempLabel.includes('-')
                    ? currentTempLabel.split(/[–-]/).pop()?.replace(/[()]/g, '').trim() || currentTempLabel
                    : currentTempLabel.replace(/[()]/g, '').trim()}
                </span>
                <span className="hidden 2xl:inline">
                  {currentTempLabel}
                </span>
              </span>
            </div>
          )}

          {/* 4. Kristal */}
          <div className="flex items-center justify-between sm:justify-start gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900/95 border border-cyan-500/70 shrink-0 whitespace-nowrap" title="Kristal geologi terkumpul">
            <div className="flex items-center gap-1.5">
              <PixelIcon name="crystal" size={14} className="text-cyan-300 shrink-0" />
              <span className="text-[14.5px] sm:text-[13px] text-cyan-300 font-bold tracking-wide">KRISTAL</span>
            </div>
            <span className="text-[13px] sm:text-[15px] md:text-base font-extrabold text-cyan-100 whitespace-nowrap">
              {crystalsCount}/{totalCrystals}
            </span>
          </div>

          {/* 5. Temuan Geologis Area Ini */}
          {areaDiscoveriesTotal > 0 && (
            <div className="flex items-center justify-between sm:justify-start gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900/95 border border-amber-500/70 shrink-0 whitespace-nowrap" title="Temuan Geologis Area Ini">
              <div className="flex items-center gap-1.5">
                <PixelIcon name="search" size={14} className="text-amber-300 shrink-0" />
                <span className="text-[14.5px] sm:text-[13px] text-amber-300 font-bold tracking-wide">TEMUAN</span>
              </div>
              <span className="text-[13px] sm:text-[15px] md:text-base font-extrabold text-amber-100 whitespace-nowrap">
                {areaDiscoveriesRead}/{areaDiscoveriesTotal}
              </span>
            </div>
          )}

          {/* 6. Ketahanan Eksplorasi (HP) */}
          <div
            className="flex items-center justify-between sm:justify-start gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900/95 border border-rose-500/70 shrink-0 whitespace-nowrap"
            title="Ketahanan Eksplorasi (HP)"
          >
            <div className="flex items-center gap-1.5">
              <PixelIcon name="heart" size={14} className="text-rose-400 shrink-0" />
              <span className="text-[14.5px] sm:text-[13px] text-rose-300 font-bold tracking-wide">HP</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-12 sm:w-16 xl:w-20 h-3 bg-slate-800 rounded-full border border-slate-700 overflow-hidden p-0.5 shrink-0">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    playerHp > 50
                      ? 'bg-gradient-to-r from-emerald-500 to-green-400'
                      : playerHp > 25
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                        : 'bg-gradient-to-r from-rose-600 to-red-500 animate-pulse'
                  }`}
                  style={{ width: `${playerHp}%` }}
                />
              </div>
              <span className="text-[14.5px] sm:text-[13px] md:text-[15px] font-bold text-rose-100 shrink-0">
                {playerHp}%
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

