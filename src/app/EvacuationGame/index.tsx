// ── EvacuationGame/index.tsx ──────────────────────────────────────
// Halaman Simulasi Evakuasi Bencana — Game Isometrik RESQ-BOX

import { useNavigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useRuntimeStore } from '../../store/runtimeStore';

const EvacuationCanvas = lazy(() => import('./EvacuationCanvas'));

export default function EvacuationGame() {
  const navigate = useNavigate();
  const isRunning = useRuntimeStore((s) => s.isRunning);

  return (
    <div className="h-screen w-full flex flex-col bg-[#0f172a] text-white overflow-hidden">
      {/* Header */}
      <header className="shrink-0 h-14 flex items-center justify-between px-6 border-b border-white/10 bg-black/40 backdrop-blur">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
          </button>
          <div className="h-5 w-px bg-white/20" />
          <div>
            <h1 className="font-bold text-sm text-white">Simulasi Evakuasi Diorama</h1>
            <p className="text-xs text-white/40">Simulasi Evakuasi Bencana — Respon warga terhadap sistem peringatan yang kamu rancang</p>
          </div>
        </div>

        {/* Status Simulation */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
          isRunning
            ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
            : 'bg-white/10 border border-white/20 text-white/50'
        }`}>
          <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-white/30'}`} />
          {isRunning ? 'Simulasi Berjalan' : 'Simulasi Belum Dimulai'}
        </div>
      </header>

      {/* Info Banner jika simulasi belum dimulai */}
      {!isRunning && (
        <div className="shrink-0 mx-4 mt-3 rounded-xl bg-amber-500/10 border border-amber-500/30 px-4 py-3 text-sm text-amber-300 flex items-start gap-3">
          <span className="material-symbols-outlined text-amber-400 mt-0.5" style={{fontSize:'18px'}}>info</span>
          <div>
            <p className="font-semibold">Cara Melihat Simulasi Evakuasi:</p>
            <p className="text-xs text-amber-300/70 mt-0.5">
              Susun aturan peringatan di <strong>Ruang Simulasi</strong> (tab kiri), lalu tekan <strong>Mulai</strong>. Sistem peringatan yang kamu rancang akan mempengaruhi pergerakan warga di sini!
            </p>
          </div>
        </div>
      )}

      {/* Game Canvas */}
      <div className="flex-1 relative">
        <Suspense fallback={
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-white/60">
              <span className="material-symbols-outlined text-4xl animate-spin">progress_activity</span>
              <p className="text-sm">Memuat Peta Diorama...</p>
            </div>
          </div>
        }>
          <EvacuationCanvas />
        </Suspense>
      </div>

      {/* How-to Guide bottom bar */}
      <div className="shrink-0 px-4 pb-3 pt-2 border-t border-white/10 bg-black/30">
        <div className="flex items-center gap-6 text-xs text-white/60 justify-center">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> LED Merah → NPC panik & berlari</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> LED Hijau → Jalur evakuasi menyala</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-amber-600 inline-block" /> Servo Terbuka → Gerbang terbuka</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sky-400 inline-block" /> Sirine → NPC bergerak lebih cepat</span>
        </div>
      </div>
    </div>
  );
}
