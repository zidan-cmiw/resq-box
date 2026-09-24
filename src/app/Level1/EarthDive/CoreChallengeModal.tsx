// ── src/app/Level1/EarthDive/CoreChallengeModal.tsx ──────────────────────────────
// Modal Puncak Ekspedisi Level 1: Sintesis Kausalitas Interior Bumi ➔ Bencana Permukaan
// Menggunakan Game Wordle Evaluasi Gabungan Seluruh Lapisan Interior Bumi
// 100% 2D Retro Pixel Font & Ikon Pixel Art (Zero Emoji OS)

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CORE_SYNTHESIS_DATA, CORE_SYNTHESIS_WORDS } from './earthDiveData';
import { retroAudio } from '../../../utils/retroAudio';
import { useAuthStore } from '../../../store/teacherStore';
import { submitLevelProgress } from '../../../utils/supabaseClient';
import PixelTrophy from '../../../components/PixelTrophy';
import PixelIcon from '../../../components/PixelIcon';
import Wordle from '../Wordle';

interface CoreChallengeModalProps {
  onClose: () => void;
  initialCompleted?: boolean;
}

export default function CoreChallengeModal({ onClose, initialCompleted = false }: CoreChallengeModalProps) {
  const navigate = useNavigate();
  const student = useAuthStore((state) => state.student);
  const unlockLevel = useAuthStore((state) => state.unlockLevel);

  const [isCompleted, setIsCompleted] = useState(initialCompleted);

  const handleWordleSuccess = async () => {
    setIsCompleted(true);
    retroAudio.playSuccess();

    // Unlock Level 2 in store and sync to database
    unlockLevel(2);
    if (student) {
      await submitLevelProgress({
        student_id: student.id,
        student_name: student.name,
        classroom_code: student.classroom_id || 'RESQ-8A',
        level_number: 1,
        score: 100,
        details: {
          mode: 'earth_dive_descent',
          is_completed: true,
          current_layer: 'Inti Dalam (5.150–6.371 km)',
          current_zone: 4,
          crystals: 5,
          total_crystals: 5,
          badges: ['Surface Scout', 'Tectonic Tracker', 'Mantle Explorer', 'Core Specialist'],
          words: ['LEMPENG', 'KONVEKSI', 'DINAMO', 'TEKANAN', 'SUBDUKSI'],
          status_text: 'TUNTAS',
          stage_label: 'Tuntas (Inti Bumi 6.371 km)',
        },
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md select-none animate-fadeIn">
      
      {/* ── PARCHMENT BOARD / COMPLETION SLATE ── */}
      <div className="relative w-full max-w-2xl bg-[#fef3c7] border-4 border-[#451a03] rounded-2xl p-4 sm:p-5 shadow-[0_16px_0_#1c0d02] text-[#451a03] font-pixel max-h-[95vh] overflow-y-auto">
        
        {!isCompleted ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between border-b-3 border-[#78350f] pb-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#b45309]/20 border border-[#b45309] flex items-center justify-center shrink-0">
                  <PixelIcon name="volcano" size={18} className="text-[#92400e]" />
                </div>
                <div>
                  <span className="text-[10px] text-rose-700 font-pixel uppercase tracking-widest block">
                    PUNCAK EKSPEDISI • 6.371 KM PUSAT BUMI
                  </span>
                  <h2 className="text-xs sm:text-sm md:text-base text-[#451a03] font-pixel-title font-bold">
                    {CORE_SYNTHESIS_DATA.title}
                  </h2>
                </div>
              </div>
              <button
                onClick={() => {
                  retroAudio.playSelect();
                  onClose();
                }}
                className="w-8 h-8 rounded-lg bg-[#b45309] hover:bg-[#92400e] text-amber-100 border-2 border-[#451a03] font-pixel-title text-xs flex items-center justify-center cursor-pointer shadow-[0_2px_0_#451a03] shrink-0"
                title="Tutup"
              >
                ✕
              </button>
            </div>

            {/* ── CAUSALITY CHAIN DIAGRAM (2D PIXEL ART) ── */}
            <div className="w-full bg-[#1c1917] border-3 border-[#78350f] rounded-xl p-3 mb-3 overflow-hidden shadow-inner">
              <span className="text-[9px] text-amber-400 font-pixel-title block mb-2 text-center">
                RANTAI KAUSALITAS INTERIOR BUMI ➔ BENCANA GEOLOGIS
              </span>
              <div className="flex items-center justify-between gap-1 sm:gap-2 text-center text-[8px] sm:text-[10px]">
                <div className="bg-amber-950/90 border border-amber-500 p-2 rounded-lg flex-1 text-amber-200">
                  <div className="flex justify-center mb-1">
                    <PixelIcon name="flame" size={16} />
                  </div>
                  <span className="font-pixel">Panas Inti Bumi</span>
                </div>
                <span className="text-amber-400 font-bold text-xs font-pixel-title">&gt;</span>
                <div className="bg-orange-950/90 border border-orange-500 p-2 rounded-lg flex-1 text-orange-200">
                  <div className="flex justify-center mb-1">
                    <PixelIcon name="refresh" size={16} />
                  </div>
                  <span className="font-pixel">Konveksi Mantel</span>
                </div>
                <span className="text-amber-400 font-bold text-xs font-pixel-title">&gt;</span>
                <div className="bg-rose-950/90 border border-rose-500 p-2 rounded-lg flex-1 text-rose-200">
                  <div className="flex justify-center mb-1">
                    <PixelIcon name="lightning" size={16} />
                  </div>
                  <span className="font-pixel">Pergeseran Lempeng</span>
                </div>
                <span className="text-amber-400 font-bold text-xs font-pixel-title">&gt;</span>
                <div className="bg-red-950/90 border border-red-500 p-2 rounded-lg flex-1 text-red-200">
                  <div className="flex justify-center mb-1">
                    <PixelIcon name="volcano" size={16} />
                  </div>
                  <span className="font-pixel">Gempa &amp; Erupsi</span>
                </div>
              </div>
            </div>

            {/* Context Explanation */}
            <div className="bg-[#fffbeb] p-3 rounded-xl border-2 border-[#b45309]/60 mb-3 shadow-xs">
              <p className="font-pixel text-xs text-[#78350f] leading-relaxed font-medium">
                Kamu telah menembus 6.371 km dari permukaan bumi hingga inti terdalam! Pecahkan <strong>5 kata kunci kausalitas geologi</strong> gabungan dari seluruh lapisan interior bumi untuk menuntaskan ekspedisi Level 1:
              </p>
            </div>

            {/* ── WORDLE GABUNGAN SELURUH AREA (5 KATA) ── */}
            <div className="bg-[#fffbeb] p-3 sm:p-4 rounded-xl border-2 border-[#b45309]/60 shadow-inner mb-3">
              <Wordle
                customWords={CORE_SYNTHESIS_WORDS}
                targetCount={CORE_SYNTHESIS_WORDS.length}
                gateTitle="SINTESIS GABUNGAN: 5 KATA KUNCI GEOLOGI"
                isGateChallenge={true}
                onSuccess={handleWordleSuccess}
              />
            </div>

            {/* Footer action */}
            <div className="flex items-center justify-between pt-2 border-t-2 border-[#b45309]/40">
              <button
                onClick={() => {
                  retroAudio.playSelect();
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-[#d97706]/20 hover:bg-[#d97706]/30 text-[#78350f] border-2 border-[#78350f] text-xs font-pixel-title cursor-pointer"
              >
                KEMBALI KE KAPSUL
              </button>
            </div>
          </>
        ) : (
          /* ── COMPLETION & LEVEL 2 / MENU UTAMA CHOICE SCREEN ── */
          <div className="text-center py-3 sm:py-5 animate-scaleUp">
            
            {/* Top Close Button for wandering/viewing open gate */}
            <div className="flex justify-end mb-1">
              <button
                onClick={() => {
                  retroAudio.playSelect();
                  onClose();
                }}
                className="w-8 h-8 rounded-lg bg-[#b45309]/20 hover:bg-[#b45309]/40 text-[#78350f] border border-[#78350f] font-pixel text-xs flex items-center justify-center cursor-pointer"
                title="Tutup Modal & Lihat Gerbang di Map"
              >
                ✕
              </button>
            </div>

            {/* Pixel Trophy */}
            <div className="flex justify-center mb-3">
              <PixelTrophy size={96} showSparkles={true} />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-500 text-emerald-800 text-[10px] font-pixel mb-2">
              <PixelIcon name="star" size={14} className="text-emerald-600" />
              <span>GERBANG SEISMIK INTI TELAH TERBUKA!</span>
            </div>

            <h1 className="text-base sm:text-xl font-pixel-title text-[#451a03] font-bold mb-3">
              LEVEL 1: EARTH DIVE SELESAI!
            </h1>

            {/* Badges and Crystals Showcase */}
            <div className="bg-[#fffbeb] border-3 border-[#b45309] rounded-2xl p-3.5 max-w-xl mx-auto mb-4 shadow-inner">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2.5">
                <div className="p-2 rounded-xl bg-[#fde68a] border border-[#d97706] text-center">
                  <div className="flex justify-center mb-1">
                    <PixelIcon name="globe" size={18} />
                  </div>
                  <span className="text-[9px] font-pixel text-[#78350f] font-bold block">SURFACE SCOUT</span>
                </div>
                <div className="p-2 rounded-xl bg-[#fde68a] border border-[#d97706] text-center">
                  <div className="flex justify-center mb-1">
                    <PixelIcon name="lightning" size={18} />
                  </div>
                  <span className="text-[9px] font-pixel text-[#78350f] font-bold block">TECTONIC TRACKER</span>
                </div>
                <div className="p-2 rounded-xl bg-[#fde68a] border border-[#d97706] text-center">
                  <div className="flex justify-center mb-1">
                    <PixelIcon name="flame" size={18} />
                  </div>
                  <span className="text-[9px] font-pixel text-[#78350f] font-bold block">MANTLE EXPLORER</span>
                </div>
                <div className="p-2 rounded-xl bg-amber-300 border-2 border-amber-600 text-center shadow-sm">
                  <div className="flex justify-center mb-1">
                    <PixelIcon name="volcano" size={18} />
                  </div>
                  <span className="text-[9px] font-pixel text-amber-950 font-bold block">CORE SPECIALIST</span>
                </div>
              </div>

              <div className="text-xs font-pixel text-cyan-800 bg-cyan-100 py-1.5 px-3 rounded-xl border border-cyan-400 inline-flex items-center gap-2">
                <PixelIcon name="crystal" size={13} />
                <span>5/5 Geo-Crystals Terkumpul</span>
                <span>•</span>
                <PixelIcon name="star" size={13} />
                <span>Skor Sempurna 100 XP</span>
              </div>
            </div>

            {/* Narrative Transition to Level 2 */}
            <div className="bg-gradient-to-r from-amber-900 to-rose-950 text-amber-100 p-3.5 rounded-2xl border-3 border-[#451a03] max-w-xl mx-auto mb-4 shadow-md text-left">
              <span className="font-pixel-title text-[9px] text-amber-400 block mb-1">
                JEMBATAN MISI TARUNA RESQ:
              </span>
              <p className="font-pixel text-xs leading-relaxed text-amber-100 italic">
                &ldquo;Kamu telah menembus 6.371 km, menyelesaikan semua pertanyaan geologi, dan membuka Gerbang Seismik Inti! Pilih kelanjutan misimu sekarang:&rdquo;
              </p>
            </div>

            {/* ── DUA PILIHAN UTAMA: MENU UTAMA ATAU LEVEL 2 ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto mb-3">
              
              {/* Option 1: MENU UTAMA */}
              <button
                onClick={() => {
                  retroAudio.playSelect();
                  navigate('/');
                }}
                className="p-3.5 rounded-xl bg-[#fef3c7] hover:bg-[#fde68a] text-[#78350f] border-3 border-[#78350f] shadow-[0_4px_0_#451a03] cursor-pointer transition-transform active:translate-y-0.5 text-left flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#b45309]/20 border border-[#b45309] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <PixelIcon name="globe" size={22} className="text-[#78350f]" />
                </div>
                <div>
                  <span className="text-[11px] font-pixel-title font-bold block text-[#451a03]">
                    MENU UTAMA
                  </span>
                  <span className="text-[9px] font-pixel text-[#92400e] block">
                    Kembali ke Beranda Taruna
                  </span>
                </div>
              </button>

              {/* Option 2: LANJUT KE LEVEL 2 */}
              <button
                onClick={() => {
                  retroAudio.playUnlock();
                  navigate('/level2');
                }}
                className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-3 border-[#064e3b] shadow-[0_5px_0_#064e3b] cursor-pointer transition-transform active:translate-y-0.5 text-left flex items-center gap-3 animate-pulse"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-950/40 border border-emerald-300 flex items-center justify-center shrink-0">
                  <PixelIcon name="volcano" size={22} className="text-emerald-100" />
                </div>
                <div>
                  <span className="text-[11px] font-pixel-title font-bold block text-white flex items-center gap-1">
                    LANJUT KE LEVEL 2
                    <span className="text-amber-300">&gt;</span>
                  </span>
                  <span className="text-[9px] font-pixel text-emerald-100 block">
                    Tantangan Erupsi Merapi
                  </span>
                </div>
              </button>

            </div>

            {/* Tertiary Action: Jelajahi Ruang Inti (Lihat Gerbang Terbuka di Map) */}
            <div className="pt-2 border-t border-[#b45309]/30">
              <button
                onClick={() => {
                  retroAudio.playSelect();
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-[#d97706]/15 hover:bg-[#d97706]/25 text-[#92400e] border border-[#b45309] text-[10px] font-pixel cursor-pointer transition-colors inline-flex items-center gap-1.5"
              >
                <PixelIcon name="clipboard" size={14} />
                <span>JELAJAHI RUANG INTI (LIHAT GERBANG TERBUKA &amp; KAPSUL)</span>
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
