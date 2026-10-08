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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm select-none animate-fadeIn">
      
      {/* ── PARCHMENT WOODEN CHALLENGE BOARD ── */}
      <div className="relative w-full max-w-3xl sm:max-w-4xl bg-[#fef3c7] border-4 border-[#451a03] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-[0_16px_0_#1c0d02] text-[#451a03] font-pixel max-h-[96vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-3 border-[#78350f] pb-3.5 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#b45309]/20 border-2 border-[#b45309] flex items-center justify-center shrink-0">
              <PixelIcon name="swords" size={20} className="text-[#92400e]" />
            </div>
            <div>
              <span className="text-[13px] sm:text-[15px] text-[#b45309] font-pixel uppercase tracking-widest block font-bold">
                GERBANG EVALUASI STRATA • {strataName}
              </span>
              <h2 className="text-[15px] sm:text-base md:text-xl text-[#451a03] font-pixel-title font-bold">
                Uji Pemahaman Geologi
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-[#fde68a] px-3 py-1.5 rounded-xl border-2 border-[#b45309] shadow-xs">
            <PixelIcon name="crystal" size={16} />
            <span className="text-[13px] sm:text-[15px] text-[#78350f] font-pixel-title font-bold">+1 Crystal</span>
          </div>
        </div>

        {/* Question Text */}
        <div className="bg-[#fffbeb] p-4 sm:p-5 rounded-2xl border-3 border-[#b45309]/60 mb-4.5 shadow-xs">
          <p className="font-sans text-base sm:text-lg md:text-xl text-[#291305] font-semibold leading-relaxed">
            {challenge.question}
          </p>
        </div>

        {/* ── OPTIONS LIST ── */}
        <div className="space-y-3 mb-4.5">
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
              btnStyle = 'bg-[#d97706] text-amber-50 border-[#451a03] shadow-[0_3px_0_#451a03]';
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                disabled={isAnswered && isCorrect}
                className={`w-full text-left p-3.5 sm:p-4 rounded-xl border-2 sm:border-3 transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-[#451a03]/10 flex items-center justify-center font-pixel-title text-[13px] sm:text-[15px] font-bold shrink-0">
                    {opt.id.toUpperCase()}
                  </span>
                  <span className="font-sans text-[15px] sm:text-base md:text-lg font-medium leading-relaxed">{opt.text}</span>
                </div>
                {isAnswered && opt.isCorrect && (
                  <span className="text-emerald-700 font-pixel-title text-[13px] sm:text-[15px] font-bold shrink-0 ml-2">✓ BENAR</span>
                )}
                {isAnswered && isSelected && !opt.isCorrect && (
                  <span className="text-rose-700 font-pixel-title text-[13px] sm:text-[15px] font-bold shrink-0 ml-2">✕ SALAH</span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── SIAGA MASCOT CLUE (ON ERROR) ── */}
        {showSiagaClue && (
          <div className="p-4 bg-amber-100/90 border-3 border-amber-500 rounded-2xl flex items-start gap-3.5 mb-4.5 animate-shake">
            <div className="w-12 h-12 rounded-xl bg-amber-500 border-2 border-amber-700 flex items-center justify-center shrink-0 shadow-inner">
              <PixelIcon name="fox" size={28} />
            </div>
            <div className="font-sans text-[15px] sm:text-base">
              <div className="flex items-center gap-2 mb-1.5">
                <PixelIcon name="bulb" size={15} className="text-amber-900" />
                <span className="font-pixel-title text-[13px] sm:text-[15px] text-amber-900 font-bold">
                  PETUNJUK DARI SIAGA
                </span>
              </div>
              <p className="text-amber-950 italic font-sans text-[15px] sm:text-base leading-relaxed font-medium">{challenge.siagaClue}</p>
            </div>
          </div>
        )}

        {/* ── SUCCESS EXPLANATION & REWARD BANNER ── */}
        {isAnswered && isCorrect && (
          <div className="p-4 sm:p-5 bg-emerald-100 border-3 border-emerald-500 rounded-2xl mb-4.5 animate-fadeIn">
            <div className="flex items-center gap-2 font-pixel-title text-[13px] sm:text-[15px] text-emerald-900 font-bold mb-2">
              <PixelIcon name="celebration" size={16} />
              <span>JAWABAN TEPAT! • +1 GEOCRYSTAL &amp; BADGE [{badgeName}]</span>
            </div>
            <p className="text-emerald-950 leading-relaxed font-sans text-[15px] sm:text-base font-medium">
              {challenge.explanation}
            </p>
          </div>
        )}

        {/* ── FOOTER ACTIONS ── */}
        <div className="flex items-center justify-between pt-3.5 border-t-2 border-[#b45309]/40">
          {!isAnswered ? (
            <>
              <button
                onClick={() => {
                  retroAudio.playSelect();
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl bg-[#d97706]/20 hover:bg-[#d97706]/30 text-[#78350f] border-2 border-[#78350f] text-[13px] sm:text-[15px] font-pixel-title cursor-pointer font-bold"
              >
                KEMBALI KE KAPSUL
              </button>
              <button
                onClick={handleVerify}
                disabled={!selectedOptId}
                className={`px-6 sm:px-8 py-3 rounded-xl border-3 font-pixel-title text-[13px] sm:text-[15px] md:text-base flex items-center gap-2 shadow-[0_4px_0_#231206] transition-transform active:translate-y-0.5 ${
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
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-3 border-[#064e3b] shadow-[0_4px_0_#064e3b] text-[13px] sm:text-[15px] md:text-base font-pixel-title flex items-center justify-center gap-2 cursor-pointer transition-transform active:translate-y-0.5"
            >
              <PixelIcon name="rocket" size={16} />
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
                className="px-5 py-2.5 rounded-xl bg-[#d97706]/20 text-[#78350f] border-2 border-[#78350f] text-[13px] sm:text-[15px] font-pixel-title cursor-pointer font-bold"
              >
                PELAJARI MATERI LAGI
              </button>
              <button
                onClick={handleRetry}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-amber-50 border-3 border-[#451a03] text-[13px] sm:text-[15px] md:text-base font-pixel-title cursor-pointer shadow-[0_3px_0_#231206] transition-transform active:translate-y-0.5 flex items-center gap-2"
              >
                <PixelIcon name="refresh" size={14} />
                <span>COBA LAGI</span>
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
