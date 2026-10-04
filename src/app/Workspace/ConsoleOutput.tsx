import { useEffect, useRef } from 'react';
import { useRuntimeStore, type ConsoleLog } from '../../store/runtimeStore';

const LOG_STYLES: Record<ConsoleLog['type'], { icon: string; color: string; bg: string }> = {
  system:  { icon: '🚀', color: 'text-sky-950 font-medium',     bg: 'bg-sky-50 border border-sky-300' },
  success: { icon: '✓',  color: 'text-emerald-950 font-medium', bg: 'bg-emerald-50 border border-emerald-300' },
  info:    { icon: 'ℹ',  color: 'text-blue-950 font-medium',    bg: 'bg-blue-50 border border-blue-300' },
  warn:    { icon: '⚠',  color: 'text-amber-950 font-medium',   bg: 'bg-amber-50 border border-amber-300' },
  error:   { icon: '✕',  color: 'text-rose-950 font-medium',    bg: 'bg-rose-50 border border-rose-300' },
};

export default function ConsoleOutput() {
  const { consoleLogs, clearLogs, isRunning } = useRuntimeStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new logs
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleLogs]);

  return (
    <div className="h-full flex flex-col bg-[#fffbeb] text-[#1c1917] font-mono text-xs select-text">
      {/* Panel sub-header (SS 3 Warm Parchment) */}
      <div className="h-9 shrink-0 flex items-center px-3 gap-2 border-b-2 border-[#b45309] bg-[#fef3c7]">
        <span className="text-[#b45309] text-xs">📟</span>
        <span className="font-pixel text-[10px] text-[#78350f] font-bold flex-1">
          LOG AKTIVITAS
          {consoleLogs.length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-[#b45309] text-white text-[9px] border border-[#78350f] font-bold shadow-sm">
              {consoleLogs.length}
            </span>
          )}
        </span>

        {/* Running status indicator */}
        {isRunning ? (
          <div className="flex items-center gap-1 text-[#15803d] text-[10px] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse shadow-[0_0_6px_#10b981]" />
            <span>RUNNING</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-[#78716c] text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a8a29e]" />
            <span>IDLE</span>
          </div>
        )}

        {/* Clear button */}
        {consoleLogs.length > 0 && (
          <button
            onClick={clearLogs}
            className="p-1 hover:bg-[#fde68a] rounded transition-colors text-[#78350f] ml-1"
            title="Bersihkan log"
          >
            🗑️
          </button>
        )}
      </div>

      {/* Log entries — scrollable */}
      <div className="flex-1 overflow-y-auto p-2.5 flex flex-col gap-1.5 bg-[#fffbeb]">
        {consoleLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-[#78350f]/60 select-none py-8">
            <span className="text-2xl opacity-60">📟</span>
            <span className="text-[11px] text-center font-sans text-[#78350f] font-medium leading-relaxed">
              Klik tombol <strong className="text-[#15803d] font-mono font-bold">[MULAI]</strong> di atas<br />
              untuk menjalankan simulasi logika
            </span>
          </div>
        ) : (
          consoleLogs.map((log) => {
            const style = LOG_STYLES[log.type] || LOG_STYLES.info;
            return (
              <div
                key={log.id}
                className={`flex items-start gap-2 px-2.5 py-1.5 rounded-lg ${style.bg} text-[11px] shadow-sm`}
              >
                <span className="shrink-0 mt-0.5 text-xs select-none">
                  {style.icon}
                </span>
                <span className={`flex-1 leading-relaxed ${style.color}`}>
                  {log.text}
                </span>
                <span className="text-[9px] text-[#78716c] shrink-0 mt-0.5 select-none font-sans font-medium">
                  {log.timestamp}
                </span>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
