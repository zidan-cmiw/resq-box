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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm select-none animate-fadeIn font-pixel">
      <div className="relative w-full max-w-3xl sm:max-w-4xl bg-[#fef3c7] border-4 border-[#451a03] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-[0_16px_0_#1c0d02] text-[#451a03] max-h-[96vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-3 border-[#78350f] pb-3.5 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#b45309]/20 border-2 border-[#b45309] flex items-center justify-center shrink-0">
              <PixelIcon name="key" size={22} className="text-[#92400e]" />
            </div>
            <div>
              <span className="text-[13px] sm:text-[15px] text-[#b45309] uppercase tracking-widest block font-bold">
                GERBANG TANTANGAN TEKTONIK
              </span>
              <h2 className="text-[15px] sm:text-base md:text-xl text-[#451a03] font-pixel-title font-bold">
                {challenge.title}
              </h2>
            </div>
          </div>
          <button aria-label="Tutup"
            onClick={() => {
              retroAudio.playSelect();
              onClose();
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#b45309] hover:bg-[#92400e] text-amber-100 border-2 border-[#451a03] font-pixel-title text-[15px] flex items-center justify-center cursor-pointer active:translate-y-0.5 shadow-[0_2px_0_#451a03] shrink-0 font-semibold"
          >
            <PixelIcon name="cross" size={14} />
          </button>
        </div>

        {/* Question Prompt */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-100/90 border-3 border-[#b45309]/40 mb-4.5 shadow-xs">
          <p className="font-sans text-base sm:text-lg md:text-xl font-semibold leading-relaxed text-[#291305]">
            {challenge.question}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-4.5">
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
                className={`w-full p-3.5 sm:p-4.5 rounded-xl border-2 sm:border-3 text-left transition-all cursor-pointer flex items-start gap-3 ${optStyle}`}
              >
                <span className="font-pixel-title text-[13px] sm:text-[15px] shrink-0 uppercase mt-0.5 font-bold">
                  [{opt.id}]
                </span>
                <span className="font-sans text-[15px] sm:text-base md:text-lg font-medium leading-relaxed">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {/* Result Explanation */}
        {isAnswered && (
          <div
            className={`p-4 sm:p-5 rounded-2xl border-3 mb-4.5 text-[15px] sm:text-base font-sans leading-relaxed animate-fadeIn ${
              isCorrect
                ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                : 'bg-rose-50 border-rose-500 text-rose-950'
            } font-medium`}
          >
            <span className="font-pixel-title text-[13px] sm:text-[15px] font-bold flex items-center gap-2 mb-2">
              <PixelIcon name={isCorrect ? 'unlock' : 'alert'} size={16} />
              <span>{isCorrect ? 'KUNCI GERBANG TERBUKA!' : 'JAWABAN BELUM TEPAT'}</span>
            </span>
            <p className="font-sans text-[15px] sm:text-base font-medium leading-relaxed">{challenge.explanation}</p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end pt-3 border-t-2 border-[#b45309]/30">
          {!isAnswered ? (
            <button
              onClick={handleSubmit}
              disabled={!selectedOptId}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[13px] sm:text-[15px] md:text-base font-pixel-title font-bold border-3 border-[#451a03] shadow-[0_4px_0_#231206] cursor-pointer active:translate-y-0.5"
            >
              BUKA GERBANG TEKTONIK ➔
            </button>
          ) : (
            <div className="w-full flex justify-end">
              {isCorrect ? (
                <button
                  onClick={() => {
                    retroAudio.playSelect();
                    onSuccess();
                  }}
                  className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[13px] sm:text-[15px] md:text-base font-pixel-title font-bold border-3 border-emerald-950 shadow-[0_4px_0_#064e3b] cursor-pointer active:translate-y-0.5 flex items-center gap-2"
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
                  className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-[13px] sm:text-[15px] md:text-base font-pixel-title font-bold border-2 border-amber-950 shadow-[0_3px_0_#451a03] cursor-pointer active:translate-y-0.5"
                >
                  COBA LAGI ↺
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
