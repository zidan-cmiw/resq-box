import { useEffect, useRef } from 'react';
import { useRuntimeStore } from '../../store/runtimeStore';

export default function TelemetrySidePanel() {
  const {
    seismicLevel,
    richterScale,
    volcanoStatus,
    volcanoTemp,
    eruptionType,
    selectedRoute,
    activeShelter,
    oledMessage,
    rgbColor,
    pinStates,
  } = useRuntimeStore();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let offset = 0;
    const render = () => {
      offset += 1.6;
      const width = canvas.width;
      const height = canvas.height;
      const midY = height / 2;

      // Dark oscilloscope background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 18) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 12) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw seismogram wave
      ctx.beginPath();
      let strokeColor = '#10b981'; // Green for calm
      let baseAmp = 2;

      if (seismicLevel === 1) {
        strokeColor = '#f59e0b'; // Amber for Level 1
        baseAmp = 8;
      } else if (seismicLevel === 2) {
        strokeColor = '#f97316'; // Orange for Level 2
        baseAmp = 16;
      } else if (seismicLevel === 3) {
        strokeColor = '#ef4444'; // Red for Level 3
        baseAmp = 26;
      }

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2;

      for (let x = 0; x < width; x++) {
        let wave = 0;
        if (seismicLevel === 0) {
          wave = Math.sin((x + offset) * 0.15) * 1.5 + (Math.random() - 0.5) * 1.2;
        } else if (seismicLevel === 1) {
          wave = Math.sin((x + offset * 2) * 0.3) * baseAmp * 0.6 + Math.sin((x + offset) * 0.8) * 3;
        } else if (seismicLevel === 2) {
          wave = Math.sin((x + offset * 3) * 0.35) * baseAmp * 0.7 + Math.cos((x + offset * 2) * 0.7) * (baseAmp * 0.4);
        } else {
          const spike = (x % 14 === 0 ? (Math.random() > 0.5 ? 1 : -1) * 9 : 0);
          wave = Math.sin((x + offset * 4) * 0.4) * baseAmp + spike + (Math.random() - 0.5) * 7;
        }

        const y = Math.max(3, Math.min(height - 3, midY + wave));
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [seismicLevel]);

  // Status badges
  const quakeBadge = {
    0: { label: 'TENANG (Aman)', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    1: { label: 'RINGAN (Waspada)', bg: 'bg-amber-100 text-amber-800 border-amber-300' },
    2: { label: 'SEDANG (Siaga)', bg: 'bg-orange-100 text-orange-800 border-orange-300' },
    3: { label: 'KUAT (Darurat Evakuasi!)', bg: 'bg-red-100 text-red-800 border-red-300 animate-pulse' },
  }[seismicLevel];

  const volcanoBadge = {
    NORMAL: { label: 'LEVEL I: NORMAL', bg: 'bg-emerald-100 text-emerald-800 border-emerald-400' },
    WASPADA: { label: 'LEVEL II: WASPADA', bg: 'bg-amber-100 text-amber-800 border-amber-400' },
    SIAGA: { label: 'LEVEL III: SIAGA', bg: 'bg-orange-100 text-orange-800 border-orange-400' },
    AWAS: { label: 'LEVEL IV: AWAS', bg: 'bg-rose-100 text-rose-800 border-rose-500 animate-pulse' },
  }[volcanoStatus];

  const isLembahSungai = selectedRoute.includes('Lembah Sungai');

  // Konfigurasi lampu indikator status mitigasi yang sangat terang & menyala
  const lightConfig = {
    red: {
      bg: '#ff1744',
      glow: '0 0 16px #ff1744, 0 0 28px rgba(255, 23, 68, 0.9), inset 0 0 6px #ffffff',
      label: 'MERAH (AWAS)',
      color: '#dc2626',
      pulse: true,
    },
    orange: {
      bg: '#ff9100',
      glow: '0 0 16px #ff9100, 0 0 28px rgba(255, 145, 0, 0.9), inset 0 0 6px #ffffff',
      label: 'ORANYE (SIAGA)',
      color: '#ea580c',
      pulse: false,
    },
    yellow: {
      bg: '#ffea00',
      glow: '0 0 16px #ffea00, 0 0 28px rgba(255, 234, 0, 0.9), inset 0 0 6px #ffffff',
      label: 'KUNING (WASPADA)',
      color: '#ca8a04',
      pulse: false,
    },
    green: {
      bg: '#00e676',
      glow: '0 0 16px #00e676, 0 0 28px rgba(0, 230, 118, 0.9), inset 0 0 6px #ffffff',
      label: 'HIJAU (NORMAL)',
      color: '#16a34a',
      pulse: false,
    },
    off: {
      bg: '#475569',
      glow: 'inset 0 0 4px #1e293b',
      label: 'MATI',
      color: '#64748b',
      pulse: false,
    },
  }[rgbColor] || {
    bg: '#00e676',
    glow: '0 0 16px #00e676, 0 0 28px rgba(0, 230, 118, 0.9), inset 0 0 6px #ffffff',
    label: 'HIJAU (NORMAL)',
    color: '#16a34a',
    pulse: false,
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#fffbeb] text-[#1c1917] overflow-hidden select-none">
      {/* Panel Header */}
      <div className="px-3.5 py-2.5 bg-[#fef3c7] border-b-2 border-[#b45309] flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#10b981] animate-ping" />
          <div>
            <div className="font-pixel text-xs sm:text-[13px] font-bold text-[#451a03] leading-tight">Telemetri Digital Twin</div>
            <div className="text-[10px] text-[#78350f] font-semibold leading-none mt-0.5">Monitoring Merapi & EWS</div>
          </div>
        </div>
        <div className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#fde68a] text-[#78350f] border border-[#d97706] shadow-xs">
          STATUS AKTIF
        </div>
      </div>

      {/* Cards Container */}
      <div className="p-3 flex-1 flex flex-col gap-2.5 overflow-y-auto font-sans scrollbar-thin">
        {/* 1. SEISMOGRAF DINAMIS */}
        <div className="bg-[#fefce8] p-2.5 rounded-xl border border-[#b45309]/30 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-[#451a03] font-pixel">Seismograf Dinamis</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${quakeBadge.bg}`}>
              {quakeBadge.label}
            </span>
          </div>

          <div className="rounded-lg overflow-hidden border border-[#334155] shadow-inner mb-2">
            <canvas ref={canvasRef} width={260} height={52} className="w-full h-[52px] block" />
          </div>

          <div className="flex justify-between items-center bg-[#fdf2e9] px-2.5 py-1 rounded border border-[#ea580c]/30 text-xs">
            <span className="text-xs text-[#78350f] font-semibold">Skala Richter (ML):</span>
            <span className="font-mono font-bold text-xs sm:text-sm text-[#9a3412]">
              {richterScale.toFixed(1)} SR
            </span>
          </div>
        </div>

        {/* 2. SUHU & STATUS GUNUNG MERAPI */}
        <div className="bg-[#fefce8] p-2.5 rounded-xl border border-[#b45309]/30 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-[#451a03] font-pixel">Kawah Gunung Merapi</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${volcanoBadge.bg}`}>
              {volcanoBadge.label}
            </span>
          </div>

          {/* Suhu Gauge Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-[#78350f]">Suhu Termal Kawah:</span>
              <span className="font-mono font-bold text-red-600 text-xs">{volcanoTemp.toFixed(1)}°C</span>
            </div>
            <div className="w-full bg-[#e2e8f0] h-2.5 rounded-full overflow-hidden border border-stone-300">
              <div
                className="h-full transition-all duration-500 rounded-full"
                style={{
                  width: `${Math.min(100, Math.max(10, (volcanoTemp / 100) * 100))}%`,
                  background: 'linear-gradient(to right, #10b981 0%, #f59e0b 50%, #dc2626 100%)',
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-stone-600 font-bold mt-1">
              <span>20°C (Normal)</span>
              <span>50°C</span>
              <span>100°C (Kritis)</span>
            </div>
          </div>

          {/* Tipe Erupsi */}
          {eruptionType !== 'NONE' && (
            <div className="flex items-center justify-between bg-amber-50 px-2 py-1.5 rounded border border-amber-300 text-[10.5px]">
              <span className="font-bold text-amber-900">Tipe Letusan Aktif:</span>
              <span className="font-mono font-bold px-2 py-0.5 bg-amber-200 text-amber-950 rounded">
                {eruptionType === 'EKSPLOSIF' ? 'EKSPLOSIF (Kolom Abu)' : 'EFUSIF (Lava Pijar)'}
              </span>
            </div>
          )}
        </div>

        {/* 3. AKTIVITAS HARDWARE & AKTUATOR */}
        <div className="bg-[#fefce8] p-2.5 rounded-xl border border-[#b45309]/30 shadow-xs">
          <div className="text-xs font-bold text-[#451a03] font-pixel mb-2">Status Aktuator Diorama</div>
          <div className="grid grid-cols-2 gap-2.5 text-center">
            {/* Lampu Status Terang Benderang */}
            <div className="p-2 rounded-xl bg-[#fffbeb] border-2 border-stone-300/80 flex flex-col items-center justify-between gap-1.5 shadow-xs">
              <span className="text-[10px] text-[#78350f] font-bold">Lampu Status</span>
              <div className="relative flex items-center justify-center p-1.5 rounded-full bg-stone-900/90 border border-stone-600 shadow-inner">
                <span
                  className={`w-5 h-5 rounded-full block border border-white/60 transition-all duration-300 ${lightConfig.pulse ? 'animate-pulse' : ''}`}
                  style={{
                    backgroundColor: lightConfig.bg,
                    boxShadow: lightConfig.glow,
                  }}
                />
              </div>
              <span className="text-[9.5px] font-extrabold tracking-tight" style={{ color: lightConfig.color }}>
                {lightConfig.label}
              </span>
            </div>

            {/* Sirine EWS */}
            <div className="p-2 rounded-xl bg-[#fffbeb] border-2 border-stone-300/80 flex flex-col items-center justify-between gap-1.5 shadow-xs">
              <span className="text-[10px] text-[#78350f] font-bold">Sirine EWS</span>
              <div className="relative flex items-center justify-center p-1.5 rounded-full bg-stone-900/90 border border-stone-600 shadow-inner">
                <span
                  className={`w-5 h-5 rounded-full block border border-white/60 transition-all duration-300 ${
                    pinStates.BUZZER ? 'animate-pulse' : ''
                  }`}
                  style={
                    pinStates.BUZZER
                      ? {
                          backgroundColor: '#fbbf24',
                          boxShadow: '0 0 16px #f59e0b, 0 0 28px rgba(245, 158, 11, 0.9), inset 0 0 6px #ffffff',
                        }
                      : {
                          backgroundColor: '#475569',
                          boxShadow: 'inset 0 0 4px #1e293b',
                        }
                  }
                />
              </div>
              <span
                className={`text-[9.5px] font-extrabold tracking-tight ${
                  pinStates.BUZZER ? 'text-amber-600' : 'text-stone-500'
                }`}
              >
                {pinStates.BUZZER ? 'BERBUNYI' : 'HENING'}
              </span>
            </div>
          </div>
        </div>

        {/* 4. PENENTUAN JALUR EVAKUASI & POSKO */}
        <div className="bg-[#fefce8] p-2.5 rounded-xl border border-[#b45309]/30 shadow-xs">
          <div className="text-xs font-bold text-[#451a03] font-pixel mb-1.5">Manajemen Evakuasi Warga</div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-center px-2 py-1 rounded bg-[#fffbeb] border border-stone-200">
              <span className="font-semibold text-[#78350f] text-[10.5px]">Rute Evakuasi:</span>
              <span className={`font-bold px-2 py-0.5 rounded text-[10.5px] truncate max-w-[145px] ${
                isLembahSungai ? 'bg-red-200 text-red-900 border border-red-400' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              }`}>
                {selectedRoute}
              </span>
            </div>
            <div className="flex justify-between items-center px-2 py-1 rounded bg-[#fffbeb] border border-stone-200">
              <span className="font-semibold text-[#78350f] text-[10.5px]">Posko Penampungan:</span>
              <span className="font-bold text-stone-800 text-[10.5px] truncate max-w-[145px]">{activeShelter}</span>
            </div>
          </div>
        </div>

        {/* 5. MONITOR LAYAR INFORMASI PUBLIK */}
        <div className="bg-[#0b132b] p-2 rounded-xl border border-[#1c2541] shadow-inner font-mono text-[10px] text-[#48cae4]">
          <div className="text-[9px] text-[#64dfdf] mb-1 flex items-center justify-between border-b border-[#1c2541] pb-1">
            <span className="font-bold">Layar Informasi Publik</span>
            <span>Siaga Digital</span>
          </div>
          <div className="py-1 px-2 bg-[#000814] rounded text-emerald-400 font-bold text-[11px] truncate">
            {oledMessage}
          </div>
        </div>
      </div>
    </div>
  );
}
