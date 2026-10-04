import { useEffect, useRef } from 'react';
import { useRuntimeStore } from '../../store/runtimeStore';

export default function SensorPanel() {
  const {
    showSensorPanel,
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
    mistActive,
  } = useRuntimeStore();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!showSensorPanel) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let offset = 0;
    const render = () => {
      offset += 1.5;
      const width = canvas.width;
      const height = canvas.height;
      const midY = height / 2;

      // Dark oscilloscope background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 15) {
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
        baseAmp = 7;
      } else if (seismicLevel === 2) {
        strokeColor = '#f97316'; // Orange for Level 2
        baseAmp = 15;
      } else if (seismicLevel === 3) {
        strokeColor = '#ef4444'; // Red for Level 3
        baseAmp = 24;
      }

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1.8;

      for (let x = 0; x < width; x++) {
        let wave = 0;
        if (seismicLevel === 0) {
          wave = Math.sin((x + offset) * 0.15) * 1.5 + (Math.random() - 0.5) * 1.2;
        } else if (seismicLevel === 1) {
          wave = Math.sin((x + offset * 2) * 0.3) * baseAmp * 0.6 + Math.sin((x + offset) * 0.8) * 3;
        } else if (seismicLevel === 2) {
          wave = Math.sin((x + offset * 3) * 0.35) * baseAmp * 0.7 + Math.cos((x + offset * 2) * 0.7) * (baseAmp * 0.4);
        } else {
          const spike = (x % 16 === 0 ? (Math.random() > 0.5 ? 1 : -1) * 8 : 0);
          wave = Math.sin((x + offset * 4) * 0.4) * baseAmp + spike + (Math.random() - 0.5) * 6;
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
  }, [showSensorPanel, seismicLevel]);

  if (!showSensorPanel) return null;

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

  return (
    <div
      className="absolute bottom-4 right-[336px] z-50 w-80 bg-[#fffbeb] rounded-2xl border-2 border-[#b45309] shadow-2xl overflow-hidden text-[#1c1917]"
      style={{ backdropFilter: 'blur(8px)' }}
    >
      {/* Panel Header */}
      <div className="px-3.5 py-2.5 bg-[#fef3c7] border-b-2 border-[#b45309] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-ping" />
          <div>
            <div className="font-pixel text-xs font-bold text-[#451a03]">Telemetri Digital Twin</div>
            <div className="text-[10px] text-[#78350f] font-medium">Monitoring Real-time Merapi & EWS</div>
          </div>
        </div>
        <div className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#fde68a] text-[#78350f] border border-[#d97706]">
          ESP32 SINKRON
        </div>
      </div>

      <div className="p-3.5 flex flex-col gap-3 font-sans max-h-[460px] overflow-y-auto">
        {/* 1. SEISMOGRAF DINAMIS */}
        <div className="bg-[#fefce8] p-2.5 rounded-xl border border-[#b45309]/30">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-[#451a03] font-pixel">Seismograf Dinamis</span>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${quakeBadge.bg}`}>
              {quakeBadge.label}
            </span>
          </div>

          <div className="rounded-lg overflow-hidden border border-[#334155] shadow-inner mb-2">
            <canvas ref={canvasRef} width={280} height={60} className="w-full h-[60px] block" />
          </div>

          <div className="flex justify-between items-center bg-[#fdf2e9] px-2 py-1 rounded-md border border-[#ea580c]/30 text-xs">
            <span className="text-[11px] text-[#78350f] font-medium">Skala Richter (ML):</span>
            <span className="font-mono font-bold text-sm text-[#9a3412]">
              {richterScale.toFixed(1)} SR
            </span>
          </div>
        </div>

        {/* 2. SUHU & STATUS GUNUNG MERAPI */}
        <div className="bg-[#fefce8] p-2.5 rounded-xl border border-[#b45309]/30">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-[#451a03] font-pixel">Kawah Gunung Merapi</span>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${volcanoBadge.bg}`}>
              {volcanoBadge.label}
            </span>
          </div>

          {/* Suhu Gauge Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-[11px] font-medium mb-1">
              <span className="text-[#78350f]">Suhu Termal Kawah:</span>
              <span className="font-mono font-bold text-red-600">{volcanoTemp.toFixed(1)}°C</span>
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
            <div className="flex justify-between text-[9px] text-stone-500 font-bold mt-0.5">
              <span>20°C (Normal)</span>
              <span>50°C</span>
              <span>100°C (Kritis)</span>
            </div>
          </div>

          {/* Tipe Erupsi */}
          {eruptionType !== 'NONE' && (
            <div className="flex items-center justify-between bg-amber-50 p-1.5 rounded border border-amber-300 text-[10px]">
              <span className="font-bold text-amber-900">Tipe Letusan Aktif:</span>
              <span className="font-mono font-bold px-1.5 py-0.5 bg-amber-200 text-amber-950 rounded">
                {eruptionType === 'EKSPLOSIF' ? 'EKSPLOSIF (Kolom Abu)' : 'EFUSIF (Lava Pijar)'}
              </span>
            </div>
          )}
        </div>

        {/* 3. AKTIVITAS HARDWARE & AKTUATOR */}
        <div className="bg-[#fefce8] p-2.5 rounded-xl border border-[#b45309]/30">
          <div className="text-xs font-bold text-[#451a03] font-pixel mb-1.5">Status Aktuator Diorama</div>
          <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
            {/* Lampu RGB */}
            <div className="p-1.5 rounded-lg bg-[#fffbeb] border border-stone-300 flex flex-col items-center gap-1">
              <span className="text-[9px] text-stone-600 font-medium">Lampu Status</span>
              <span
                className="w-3.5 h-3.5 rounded-full border shadow-sm"
                style={{
                  backgroundColor:
                    rgbColor === 'red' ? '#ef4444' :
                    rgbColor === 'orange' ? '#f97316' :
                    rgbColor === 'yellow' ? '#eab308' :
                    rgbColor === 'green' ? '#10b981' : '#a8a29e',
                }}
              />
              <span className="font-mono text-[9px] font-bold capitalize">{rgbColor}</span>
            </div>

            {/* Sirine EWS */}
            <div className="p-1.5 rounded-lg bg-[#fffbeb] border border-stone-300 flex flex-col items-center gap-1">
              <span className="text-[9px] text-stone-600 font-medium">Sirine EWS</span>
              <span className={`w-3.5 h-3.5 rounded-full border shadow-sm ${pinStates.BUZZER ? 'bg-amber-500 animate-ping' : 'bg-stone-300'}`} />
              <span className="font-mono text-[9px] font-bold">{pinStates.BUZZER ? 'BERBUNYI' : 'HENING'}</span>
            </div>

            {/* Mist Maker (Asap) */}
            <div className="p-1.5 rounded-lg bg-[#fffbeb] border border-stone-300 flex flex-col items-center gap-1">
              <span className="text-[9px] text-stone-600 font-medium">Asap Mist</span>
              <span className={`w-3.5 h-3.5 rounded-full border shadow-sm ${mistActive ? 'bg-purple-500 animate-pulse' : 'bg-stone-300'}`} />
              <span className="font-mono text-[9px] font-bold">{mistActive ? 'MENYEMBUR' : 'MATI'}</span>
            </div>
          </div>
        </div>

        {/* 4. PENENTUAN JALUR EVAKUASI & POSKO */}
        <div className="bg-[#fefce8] p-2.5 rounded-xl border border-[#b45309]/30">
          <div className="text-xs font-bold text-[#451a03] font-pixel mb-1.5">Manajemen Evakuasi Warga</div>
          <div className="space-y-1.5 text-[10px]">
            <div className="flex justify-between items-center p-1.5 rounded bg-[#fffbeb] border border-stone-200">
              <span className="font-medium text-[#78350f]">Rute Evakuasi:</span>
              <span className={`font-bold px-1.5 py-0.5 rounded ${
                isLembahSungai ? 'bg-red-200 text-red-900 border border-red-400' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              }`}>
                {selectedRoute}
              </span>
            </div>
            <div className="flex justify-between items-center p-1.5 rounded bg-[#fffbeb] border border-stone-200">
              <span className="font-medium text-[#78350f]">Posko Penampungan:</span>
              <span className="font-bold text-stone-800">{activeShelter}</span>
            </div>
          </div>
        </div>

        {/* 5. MONITOR LAYAR OLED */}
        <div className="bg-[#0b132b] p-2 rounded-xl border border-[#1c2541] shadow-inner font-mono text-[10px] text-[#48cae4]">
          <div className="text-[9px] text-[#64dfdf] mb-1 flex items-center justify-between border-b border-[#1c2541] pb-0.5">
            <span>OLED SSD1306 (128x64)</span>
            <span>ESP32</span>
          </div>
          <div className="py-1 px-1.5 bg-[#000814] rounded text-emerald-400 font-bold truncate">
            {oledMessage}
          </div>
        </div>
      </div>
    </div>
  );
}
