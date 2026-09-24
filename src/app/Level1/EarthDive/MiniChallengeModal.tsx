// ── src/app/Level1/EarthDive/MiniChallengeModal.tsx ──────────────────────────────
// Modal Mini-Challenge per Lapisan Bumi dengan Panduan Maskot Siaga
// 100% 2D Retro Pixel Font & Ikon Pixel Art (Zero Emoji OS)

import { useState } from 'react';
import type { MiniChallenge } from './earthDiveData';
import { retroAudio } from '../../../utils/retroAudio';
import PixelIcon from '../../../components/PixelIcon';

interface MiniChallengeModalProps {
  challenge: MiniChallenge;
  strataName: string;
  badgeName: string;
  onSuccess: () => void;
  onClose: () => void;
}

export default function MiniChallengeModal({
  challenge,
  strataName,
  badgeName,
  onSuccess,
  onClose,
}: MiniChallengeModalProps) {
  const [selectedOptId, setSelectedOptId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showSiagaClue, setShowSiagaClue] = useState(false);

  const handleSelect = (optId: string) => {
    if (isAnswered && isCorrect) return;
    retroAudio.playHover();
    setSelectedOptId(optId);
  };

  const handleVerify = () => {
    if (!selectedOptId) return;
    const chosen = challenge.options.find((o) => o.id === selectedOptId);
    if (!chosen) return;

    setIsAnswered(true);
    if (chosen.isCorrect) {
      setIsCorrect(true);
      setShowSiagaClue(false);
      retroAudio.playSuccess();
    } else {
      setIsCorrect(false);
      setShowSiagaClue(true);
      retroAudio.playError();
    }
  };

  const handleRetry = () => {
    retroAudio.playSelect();
    setSelectedOptId(null);
    setIsAnswered(false);
    setIsCorrect(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm select-none animate-fadeIn">
      
      {/* ── PARCHMENT WOODEN CHALLENGE BOARD ── */}
      <div className="relative w-full max-w-2xl bg-[#fef3c7] border-4 border-[#451a03] rounded-2xl p-4 sm:p-6 shadow-[0_12px_0_#1c0d02] text-[#451a03] font-pixel max-h-[96vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-3 border-[#78350f] pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#b45309]/20 border border-[#b45309] flex items-center justify-center shrink-0">
              <PixelIcon name="swords" size={16} className="text-[#92400e]" />
            </div>
            <div>
              <span className="text-[10px] text-[#b45309] font-pixel uppercase tracking-widest block">
                GERBANG EVALUASI STRATA • {strataName}
              </span>
              <h2 className="text-xs sm:text-sm md:text-base text-[#451a03] font-pixel-title font-bold">
                Uji Pemahaman Geologi
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 bg-[#fde68a] px-2.5 py-1.5 rounded-lg border-2 border-[#b45309]">
            <PixelIcon name="crystal" size={13} />
            <span className="text-[10px] text-[#78350f] font-pixel-title font-bold">+1 Crystal</span>
          </div>
        </div>

        {/* Question Text (100% 2D Pixel Font) */}
        <div className="bg-[#fffbeb] p-3.5 sm:p-4 rounded-xl border-2 border-[#b45309]/60 mb-4 shadow-xs">
          <p className="font-pixel text-xs sm:text-sm text-[#291305] font-semibold leading-relaxed">
            {challenge.question}
          </p>
        </div>

        {/* ── OPTIONS LIST (100% 2D PIXEL FONT) ── */}
        <div className="space-y-2.5 mb-4">
          {challenge.options.map((opt) => {
            const isSelected = selectedOptId === opt.id;
            let btnStyle = 'bg-[#fef3c7] border-[#b45309] text-[#451a03] hover:bg-[#fde68a]';

            if (isAnswered) {
              if (opt.isCorrect) {
                btnStyle = 'bg-emerald-100 border-emerald-600 text-emerald-950 font-bold';
              } else if (isSelected && !opt.isCorrect) {
                btnStyle = 'bg-rose-100 border-rose-600 text-rose-950';
              }
            } else if (isSelected) {
              btnStyle = 'bg-[#d97706] text-amber-50 border-[#451a03] shadow-[0_2px_0_#451a03]';
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                disabled={isAnswered && isCorrect}
                className={`w-full text-left p-3 rounded-xl border-2 transition-all flex items-center justify-between cursor-pointer font-pixel text-xs sm:text-sm ${btnStyle}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-[#451a03]/10 flex items-center justify-center font-pixel-title text-[10px] font-bold shrink-0">
                    {opt.id.toUpperCase()}
                  </span>
                  <span className="font-pixel text-xs sm:text-sm leading-normal">{opt.text}</span>
                </div>
                {isAnswered && opt.isCorrect && (
                  <span className="text-emerald-700 font-pixel-title text-xs font-bold shrink-0 ml-2">✓ BENAR</span>
                )}
                {isAnswered && isSelected && !opt.isCorrect && (
                  <span className="text-rose-700 font-pixel-title text-xs font-bold shrink-0 ml-2">✕ SALAH</span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── SIAGA MASCOT CLUE (ON ERROR) ── */}
        {showSiagaClue && (
          <div className="p-3 bg-amber-100/90 border-2 border-amber-500 rounded-xl flex items-start gap-3 mb-4 animate-shake">
            <div className="w-10 h-10 rounded-xl bg-amber-500 border border-amber-700 flex items-center justify-center shrink-0 shadow-inner">
              <PixelIcon name="fox" size={24} />
            </div>
            <div className="font-pixel text-xs">
              <div className="flex items-center gap-1.5 mb-1">
                <PixelIcon name="bulb" size={12} className="text-amber-900" />
                <span className="font-pixel-title text-[9px] text-amber-900 font-bold">
                  PETUNJUK DARI SIAGA
                </span>
              </div>
              <p className="text-amber-950 italic font-pixel text-xs leading-relaxed">{challenge.siagaClue}</p>
            </div>
          </div>
        )}

        {/* ── SUCCESS EXPLANATION & REWARD BANNER ── */}
        {isAnswered && isCorrect && (
          <div className="p-3 bg-emerald-100 border-2 border-emerald-500 rounded-xl mb-4 text-xs font-pixel animate-fadeIn">
            <div className="flex items-center gap-2 font-pixel-title text-[10px] text-emerald-900 font-bold mb-1">
              <PixelIcon name="celebration" size={14} />
              <span>JAWABAN TEPAT! • +1 GEOCRYSTAL &amp; BADGE [{badgeName}]</span>
            </div>
            <p className="text-emerald-950 leading-relaxed font-pixel text-xs">
              {challenge.explanation}
            </p>
          </div>
        )}

        {/* ── FOOTER ACTIONS ── */}
        <div className="flex items-center justify-between pt-3 border-t-2 border-[#b45309]/40">
          {!isAnswered ? (
            <>
              <button
                onClick={() => {
                  retroAudio.playSelect();
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-[#d97706]/20 hover:bg-[#d97706]/30 text-[#78350f] border-2 border-[#78350f] text-xs font-pixel-title cursor-pointer"
              >
                KEMBALI KE KAPSUL
              </button>
              <button
                onClick={handleVerify}
                disabled={!selectedOptId}
                className={`px-5 py-2.5 rounded-xl border-3 font-pixel-title text-xs flex items-center gap-2 shadow-[0_4px_0_#231206] transition-transform active:translate-y-0.5 ${
                  selectedOptId
                    ? 'bg-amber-600 hover:bg-amber-500 text-amber-50 border-[#451a03] cursor-pointer'
                    : 'bg-slate-300 text-slate-500 border-slate-400 cursor-not-allowed'
                }`}
              >
                <span>VERIFIKASI JAWABAN</span>
                <span className="font-bold">&gt;</span>
              </button>
            </>
          ) : isCorrect ? (
            <button
              onClick={() => {
                retroAudio.playUnlock();
                onSuccess();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-3 border-[#064e3b] shadow-[0_4px_0_#064e3b] text-xs font-pixel-title flex items-center justify-center gap-2 cursor-pointer transition-transform active:translate-y-0.5"
            >
              <PixelIcon name="rocket" size={14} />
              <span>BUKA STRATA BERIKUTNYA &amp; MENYELAM LAGI</span>
              <span className="font-bold">&gt;</span>
            </button>
          ) : (
            <div className="flex items-center justify-between w-full">
              <button
                onClick={() => {
                  retroAudio.playSelect();
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-[#d97706]/20 text-[#78350f] border-2 border-[#78350f] text-xs font-pixel-title cursor-pointer"
              >
                PELAJARI MATERI LAGI
              </button>
              <button
                onClick={handleRetry}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-amber-50 border-3 border-[#451a03] text-xs font-pixel-title cursor-pointer shadow-[0_3px_0_#231206] transition-transform active:translate-y-0.5 flex items-center gap-1.5"
              >
                <PixelIcon name="refresh" size={12} />
                <span>COBA LAGI</span>
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
