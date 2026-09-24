// ── src/app/Level2/MiniChallengeModal.tsx ────────────────────────────
// Modal Kuis Tantangan Gerbang Tektonik Level 2
// Menguji pemahaman siswa mengenai mekanisme batas lempeng dan teori Pangea sebelum gerbang terbuka

import { useState } from 'react';
import type { MiniChallengeL2 } from './level2Data';
import { retroAudio } from '../../utils/retroAudio';
import PixelIcon from '../../components/PixelIcon';

interface MiniChallengeModalProps {
  challenge: MiniChallengeL2;
  onSuccess: () => void;
  onClose: () => void;
}

export default function MiniChallengeModal({
  challenge,
  onSuccess,
  onClose,
}: MiniChallengeModalProps) {
  const [selectedOptId, setSelectedOptId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSelectOption = (optId: string) => {
    if (isAnswered) return;
    retroAudio.playSelect();
    setSelectedOptId(optId);
  };

  const handleSubmit = () => {
    if (!selectedOptId || isAnswered) return;
    const opt = challenge.options.find((o) => o.id === selectedOptId);
    const correct = Boolean(opt?.isCorrect);

    setIsAnswered(true);
    setIsCorrect(correct);

    if (correct) {
      retroAudio.playWin();
    } else {
      retroAudio.playHover();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm select-none animate-fadeIn font-pixel">
      <div className="relative w-full max-w-xl bg-[#fef3c7] border-4 border-[#451a03] rounded-2xl p-4 sm:p-6 shadow-[0_12px_0_#1c0d02] text-[#451a03] max-h-[96vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-3 border-[#78350f] pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#b45309]/20 border border-[#b45309] flex items-center justify-center shrink-0">
              <PixelIcon name="key" size={18} className="text-[#92400e]" />
            </div>
            <div>
              <span className="text-[10px] text-[#b45309] uppercase tracking-widest block">
                GERBANG TANTANGAN TEKTONIK
              </span>
              <h2 className="text-xs sm:text-sm md:text-base text-[#451a03] font-pixel-title font-bold">
                {challenge.title}
              </h2>
            </div>
          </div>
          <button
            onClick={() => {
              retroAudio.playSelect();
              onClose();
            }}
            className="w-8 h-8 rounded-lg bg-[#b45309] hover:bg-[#92400e] text-amber-100 border-2 border-[#451a03] font-pixel-title text-xs flex items-center justify-center cursor-pointer active:translate-y-0.5 shadow-[0_2px_0_#451a03] shrink-0"
          >
            <PixelIcon name="cross" size={12} />
          </button>
        </div>

        {/* Question Prompt */}
        <div className="p-3.5 rounded-xl bg-amber-100/90 border-2 border-[#b45309]/40 mb-4">
          <p className="text-xs sm:text-sm font-bold leading-relaxed text-[#291305]">
            {challenge.question}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-2.5 mb-4">
          {challenge.options.map((opt) => {
            const isSelected = selectedOptId === opt.id;
            let optStyle = 'bg-[#fffbeb] hover:bg-[#fde68a] border-[#b45309]/40 text-[#451a03]';

            if (isAnswered) {
              if (opt.isCorrect) {
                optStyle = 'bg-emerald-100 border-emerald-600 text-emerald-950 font-bold shadow';
              } else if (isSelected && !opt.isCorrect) {
                optStyle = 'bg-rose-100 border-rose-600 text-rose-950';
              } else {
                optStyle = 'opacity-40 bg-slate-100 border-slate-300 text-slate-500';
              }
            } else if (isSelected) {
              optStyle = 'bg-amber-600 text-white border-amber-950 shadow-[0_3px_0_#451a03] -translate-y-0.5';
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                disabled={isAnswered}
                className={`w-full p-3 rounded-xl border-2 text-left text-xs transition-all cursor-pointer flex items-start gap-2.5 ${optStyle}`}
              >
                <span className="font-pixel-title text-[11px] shrink-0 uppercase mt-0.5">
                  [{opt.id}]
                </span>
                <span className="leading-relaxed">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {/* Result Explanation */}
        {isAnswered && (
          <div
            className={`p-3.5 rounded-xl border-2 mb-4 text-xs leading-relaxed animate-fadeIn ${
              isCorrect
                ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                : 'bg-rose-50 border-rose-500 text-rose-950'
            }`}
          >
            <span className="font-bold flex items-center gap-1.5 mb-1">
              <PixelIcon name={isCorrect ? 'unlock' : 'alert'} size={14} />
              <span>{isCorrect ? 'KUNCI GERBANG TERBUKA!' : 'JAWABAN BELUM TEPAT'}</span>
            </span>
            <p>{challenge.explanation}</p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end pt-2 border-t-2 border-[#b45309]/30">
          {!isAnswered ? (
            <button
              onClick={handleSubmit}
              disabled={!selectedOptId}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-pixel-title font-bold border-2 border-[#451a03] shadow-[0_4px_0_#231206] cursor-pointer active:translate-y-0.5"
            >
              BUKA GERBANG TEKTONIK
            </button>
          ) : (
            <div className="w-full flex justify-end">
              {isCorrect ? (
                <button
                  onClick={() => {
                    retroAudio.playSelect();
                    onSuccess();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-pixel-title font-bold border-2 border-emerald-950 shadow-[0_4px_0_#064e3b] cursor-pointer active:translate-y-0.5 flex items-center gap-2"
                >
                  <span>LANJUT KE AREA BERIKUTNYA</span>
                  <span>&gt;</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsAnswered(false);
                    setSelectedOptId(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-pixel-title font-bold border-2 border-amber-950 shadow cursor-pointer active:translate-y-0.5"
                >
                  COBA LAGI
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
