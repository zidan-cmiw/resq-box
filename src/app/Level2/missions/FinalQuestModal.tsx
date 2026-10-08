// ── src/app/Level2/missions/FinalQuestModal.tsx ──────────────────────
// Modal Selebrasi Kelulusan Level 2: Disaster Analyst & Response Master
// Menyerahkan 4 Lencana Kehormatan, Menyinkronkan 100 Poin ke Dashboard Guru,
// dan membuka akses ke Level 3: Simulation Game.

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PixelIcon from '../../../components/PixelIcon';
import { retroAudio } from '../../../utils/retroAudio';
import { useAuthStore } from '../../../store/teacherStore';
import { syncLevel2Progress } from '../level2Sync';

interface FinalQuestModalProps {
  onClose: () => void;
  resiliencePoints: number;
}

const BADGES = [
  {
    id: 'hazard_detective',
    title: 'Hazard Detective',
    icon: 'search',
    desc: 'Memahami pergeseran benua Wegener, 3 batas lempeng, dan gelombang seismograf.',
  },
  {
    id: 'safety_planner',
    title: 'Safety Planner',
    icon: 'map',
    desc: 'Berhasil merancang tata letak fasilitas mitigasi kota dan jalur aman evakuasi.',
  },
  {
    id: 'quick_responder',
    title: 'Quick Responder',
    icon: 'shield',
    desc: 'Membuat keputusan penyelamatan taktis cepat saat guncangan gempa & erupsi melanda.',
  },
  {
    id: 'resilience_builder',
    title: 'Resilience Builder',
    icon: 'trophy',
    desc: 'Menuntaskan seluruh rantai kesiapsiagaan bencana dan TTS geologi dengan nilai 100.',
  },
];

export default function FinalQuestModal({ onClose, resiliencePoints }: FinalQuestModalProps) {
  const navigate = useNavigate();
  const student = useAuthStore((state) => state.student);
  const unlockLevel = useAuthStore((state) => state.unlockLevel);

  useEffect(() => {
    retroAudio.playWin();

    // Pastikan unlock Level 3 di store lokal
    unlockLevel(3);

    // Sinkronisasi status tuntas 100 poin penuh ke Supabase & Posko Guru
    syncLevel2Progress(student, {
      score: 100,
      currentMission: 6,
      completedMissions: [1, 2, 3, 4, 5, 6],
      resiliencePoints: Math.max(100, resiliencePoints),
      badges: BADGES.map((b) => b.title),
      isCompleted: true,
      statusText: 'TUNTAS',
    });
  }, [student, unlockLevel, resiliencePoints]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-pixel">
      <div
        className="relative w-full max-w-2xl bg-gradient-to-b from-amber-950 via-slate-950 to-black border-4 border-amber-500 rounded-3xl p-6 md:p-8 text-center text-amber-100 shadow-[0_0_50px_rgba(245,158,11,0.3)] space-y-6 animate-scale-in"
      >
        {/* Close button */}
        <button
          onClick={() => {
            retroAudio.playSelect();
            onClose();
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-600/50 flex items-center justify-center text-amber-200 cursor-pointer shadow"
          title="Tutup Modal"
        >
          <PixelIcon name="cross" size={12} />
        </button>

        {/* Victory Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400 shadow-lg text-amber-400 mb-1">
            <PixelIcon name="trophy" size={32} />
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-300 font-pixel-title text-[13.5px] font-bold tracking-wider inline-block">
            ★ LEVEL 2: DISASTER ANALYST TUNTAS 100% ★
          </span>
          <h2 className="text-xl md:text-2xl font-black text-amber-300 font-pixel-title tracking-wide">
            SELAMAT, CHIEF DISASTER ANALYST!
          </h2>
          <p className="font-sans text-[13px] sm:text-[15px] text-amber-200/90 max-w-md mx-auto leading-relaxed font-medium">
            Kamu telah berhasil membuktikan pemahaman geologis dari pergeseran lempeng hingga mitigasi taktis kota.
            Seluruh warga Disaster City kini selamat dan siap menghadapi dinamika bumi!
          </p>
        </div>

        {/* Score & Resilience Badge Bar */}
        <div className="p-3.5 rounded-2xl bg-amber-900/30 border border-amber-500/30 flex items-center justify-around">
          <div>
            <span className="text-[13.5px] text-amber-400 block font-pixel-title font-bold">TOTAL SKOR</span>
            <span className="text-xl md:text-2xl font-black text-white font-pixel-title">100 POIN</span>
          </div>
          <div className="h-8 w-px bg-amber-500/30" />
          <div>
            <span className="text-[13.5px] text-amber-400 block font-pixel-title font-bold">STATUS SISWA</span>
            <span className="text-[13px] md:text-[15px] font-bold text-emerald-400">TUNTAS (RESQ MASTER)</span>
          </div>
          <div className="h-8 w-px bg-amber-500/30" />
          <div>
            <span className="text-[13.5px] text-amber-400 block font-pixel-title font-bold">LEVEL BERIKUTNYA</span>
            <span className="text-[13px] md:text-[15px] font-bold text-sky-400">LEVEL 3 TERBUKA!</span>
          </div>
        </div>

        {/* 4 Badges Earned */}
        <div className="space-y-2">
          <span className="text-[13.5px] sm:text-[13px] font-pixel-title text-amber-300 font-bold block text-left">
            4 LENCANA KEHORMATAN DIANUGERAHKAN:
          </span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {BADGES.map((b) => (
              <div
                key={b.id}
                className="p-3 rounded-xl bg-slate-900/90 border border-amber-500/40 flex flex-col items-center text-center shadow"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/50 flex items-center justify-center mb-1.5 text-amber-300">
                  <PixelIcon name={b.icon} size={16} />
                </div>
                <span className="font-pixel-title text-[13.5px] text-amber-200 font-bold leading-tight block mb-1">
                  {b.title}
                </span>
                <span className="font-sans text-[13.5px] text-slate-300 leading-snug block font-medium">{b.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-3">
          <button
            onClick={() => {
              retroAudio.playSelect();
              navigate('/');
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-pixel-title text-[13px] font-bold border-2 border-slate-600 shadow cursor-pointer transition-transform active:translate-y-0.5"
          >
            KEMBALI KE MENU UTAMA
          </button>
          <button
            onClick={() => {
              retroAudio.playSelect();
              navigate('/level3');
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-pixel-title text-[13px] font-bold border-2 border-emerald-400 shadow-[0_4px_0_#064e3b] cursor-pointer transition-transform active:translate-y-0.5 flex items-center justify-center gap-2"
          >
            <span>LANJUT KE LEVEL 3: SIMULATION GAME</span>
            <span>&gt;</span>
          </button>
        </div>
      </div>
    </div>
  );
}
