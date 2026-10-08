// ── src/app/Level2/missions/Mission4After.tsx ─────────────────────────
// MISI 4: AFTER DISASTER (Pasca Bencana - Tanggap Darurat & Evakuasi Aman)
// Pembelajaran:
// - Prosedur keselamatan saat guncangan mereda (Jalur terblokir puing, kabel jatuh, aftershocks)
// - Penyusunan 4 Langkah Prioritas SOP Evakuasi Pasca Bencana

import { useState } from 'react';
import PixelIcon from '../../../components/PixelIcon';
import { retroAudio } from '../../../utils/retroAudio';

interface Mission4Props {
  onComplete: (pointsEarned: number, badge?: string) => void;
  isAlreadyCompleted?: boolean;
}

interface PriorityStep {
  id: string;
  order: number;
  title: string;
  desc: string;
  icon: string;
}

const AFTER_STEPS: PriorityStep[] = [
  {
    id: 'step_p3k',
    order: 1,
    title: '1. Pertolongan Pertama (P3K) & Cek Luka',
    desc: 'Periksa luka pada diri sendiri dan rekan terdekat. Berikan pertolongan pertama pada pendarahan atau cedera ringan.',
    icon: 'shield',
  },
  {
    id: 'step_evac',
    order: 2,
    title: '2. Evakuasi Tertib ke Titik Kumpul Lapangan',
    desc: 'Keluar ruangan dengan tertib melindungi kepala. Hindari tiang listrik, dinding retak, dan jalur kabel terputus.',
    icon: 'target',
  },
  {
    id: 'step_aftershock',
    order: 3,
    title: '3. Waspada Gempa Susulan (Aftershocks)',
    desc: 'Tetap berada di area terbuka dan jangan terburu-buru masuk kembali ke dalam gedung yang sudah mengalami keretakan.',
    icon: 'earthquake',
  },
  {
    id: 'step_report',
    order: 4,
    title: '4. Pendataan di Posko & Pantau Radio Resmi',
    desc: 'Laporkan identitas ke tim posko darurat dan dengarkan informasi resmi BMKG/BNPB melalui radio baterai.',
    icon: 'broadcast',
  },
];

export default function Mission4After({ onComplete, isAlreadyCompleted = false }: Mission4Props) {
  // Shuffled initial cards
  const [placedStepIds, setPlacedStepIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSelectStep = (id: string) => {
    retroAudio.playSelect();
    if (placedStepIds.includes(id)) {
      setPlacedStepIds((prev) => prev.filter((item) => item !== id));
    } else {
      setPlacedStepIds((prev) => [...prev, id]);
    }
    setFeedback(null);
  };

  const handleVerifyPriority = () => {
    // Expected order: step_p3k -> step_evac -> step_aftershock -> step_report
    const correctIds = ['step_p3k', 'step_evac', 'step_aftershock', 'step_report'];
    const isCorrect =
      placedStepIds.length === 4 &&
      placedStepIds.every((id, idx) => id === correctIds[idx]);

    if (isCorrect) {
      retroAudio.playWin();
      setIsSuccess(true);
      setFeedback('Luar Biasa! Urutan penanganan tanggap darurat pasca bencana sudah tepat sesuai SOP BNPB.');
      onComplete(20);
    } else {
      retroAudio.playHover();
      setFeedback('Urutan prioritas belum tepat. Ingat: Keselamatan jiwa & luka fisik dulu, evakuasi tertib, waspadai gempa susulan, baru koordinasi posko!');
    }
  };

  return (
    <div className="flex flex-col gap-6 text-amber-950 font-pixel">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-amber-100/90 border-2 border-amber-900/40 p-3 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-amber-900 text-amber-100 flex items-center justify-center font-pixel-title text-[13px] font-bold">
            4
          </span>
          <span className="font-pixel-title text-[13px] md:text-[15px] font-bold text-amber-950">
            MISI 4: AFTER DISASTER (TANGGAP DARURAT & PEMULIHAN)
          </span>
        </div>
        <span className="px-3 py-1 rounded bg-slate-800 text-amber-300 font-pixel-title text-[13.5px] font-semibold">
          SOP EVAKUASI PASCA BENCANA
        </span>
      </div>

      {/* Situational Context Card */}
      <div className="bg-amber-950/5 border-2 border-amber-900/30 rounded-2xl p-4">
        <h3 className="text-[13px] md:text-[15px] font-bold text-amber-950 mb-1 flex items-center gap-2">
          <PixelIcon name="clipboard" size={18} />
          <span>Guncangan Utama Telah Mereda: Apa yang Harus Dilakukan?</span>
        </h3>
        <p className="text-[14.5px] text-amber-900 leading-relaxed font-semibold">
          Setelah gempa utama atau luncuran awan panas mereda, ancaman belum sepenuhnya selesai! Terdapat bahaya
          gempa susulan (<em>aftershocks</em>), jalanan tertimbun reruntuhan genteng, dan kebocoran instalasi.
          Susunlah <strong>4 Prioritas Tanggap Darurat</strong> berikut dari yang paling mendesak (Prioritas 1)
          hingga pemulihan (Prioritas 4).
        </p>
      </div>

      {/* Priority Slots (1 to 4) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((pNum) => {
          const placedId = placedStepIds[pNum - 1];
          const stepData = AFTER_STEPS.find((s) => s.id === placedId);

          return (
            <div
              key={pNum}
              className="p-3.5 rounded-xl border-2 border-dashed border-amber-900/40 bg-amber-100/60 flex flex-col justify-between min-h-[160px]"
            >
              <div>
                <span className="text-[13.5px] font-pixel-title font-bold text-amber-900 block mb-2">
                  PRIORITAS #{pNum}
                </span>

                {stepData ? (
                  <div className="p-3 rounded-lg bg-amber-900 text-amber-100 border border-amber-950 shadow">
                    <span className="font-bold text-[13px] block mb-1">{stepData.title}</span>
                    <p className="text-[13.5px] text-amber-200/90 leading-tight font-semibold">{stepData.desc}</p>
                  </div>
                ) : (
                  <span className="text-[13.5px] text-amber-800/60 italic block text-center py-6 font-semibold">
                    [Belum Terisi]
                  </span>
                )}
              </div>

              {stepData && (
                <button
                  onClick={() => handleSelectStep(stepData.id)}
                  className="text-[12.5px] text-rose-700 underline mt-2 self-center cursor-pointer font-semibold"
                >
                  Batal Pilih
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Selectable Step Options */}
      <div className="p-4 rounded-xl bg-slate-900 border-2 border-amber-900/40 space-y-3">
        <span className="text-[13px] font-bold text-amber-300 block">
          KLIK KARTU SESUAI URUTAN PRIORITAS PENYELAMATAN:
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {AFTER_STEPS.map((step) => {
            const isPicked = placedStepIds.includes(step.id);
            const pickedIndex = placedStepIds.indexOf(step.id);

            return (
              <button
                key={step.id}
                onClick={() => handleSelectStep(step.id)}
                className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer flex items-start gap-3 ${
                  isPicked
                    ? 'bg-amber-800 border-amber-400 text-white shadow'
                    : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-200'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-black/40 border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                  <PixelIcon name={step.icon} size={18} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[13px] text-amber-200 block mb-0.5">
                      {step.title}
                    </span>
                    {isPicked && (
                      <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold text-[12.5px]">
                        Urutan #{pickedIndex + 1}
                      </span>
                    )}
                  </div>
                  <p className="text-[13.5px] text-slate-300 font-semibold">{step.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback Message */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl border text-[13px] leading-relaxed ${
            isSuccess
              ? 'bg-emerald-100 border-emerald-500 text-emerald-950'
              : 'bg-rose-100 border-rose-500 text-rose-950'
          } font-semibold`}
        >
          {feedback}
        </div>
      )}

      {/* Footer Submit */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => {
            retroAudio.playHover();
            setPlacedStepIds([]);
            setFeedback(null);
          }}
          className="px-4 py-2 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-950 text-[13px] font-pixel-title font-bold border border-amber-900/30 cursor-pointer"
        >
          RESET PILIHAN
        </button>

        {isSuccess || isAlreadyCompleted ? (
          <span className="px-4 py-2 rounded-xl bg-emerald-100 border border-emerald-500 text-emerald-800 text-[13px] font-bold">
            ✓ MISI 4 SELESAI (+20 RP)
          </span>
        ) : (
          <button
            onClick={handleVerifyPriority}
            disabled={placedStepIds.length !== 4}
            className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[13px] font-pixel-title font-bold border-2 border-amber-950 shadow-[0_4px_0_#78350f] cursor-pointer active:translate-y-0.5"
          >
            VALIDASI PRIORITAS EVAKUASI
          </button>
        )}
      </div>
    </div>
  );
}
