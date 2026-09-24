// ── src/app/Level2/missions/Mission3During.tsx ────────────────────────
// MISI 3: DURING DISASTER (Saat Bencana Terjadi - Tactical Crisis Decisions)
// Fitur:
// - 🚨 DISASTER ALERT: Efek guncangan layar (screen shake), sirine darurat, timer countdown 30s
// - Pengambilan keputusan taktis cepat (Gempa 6.5 SR & Erupsi Abu Vulkanik)
// - Sistem konsekuensi visual: Jumlah Warga Selamat (+40 Warga) & Resilience Points

import { useState, useEffect } from 'react';
import PixelIcon from '../../../components/PixelIcon';
import { retroAudio } from '../../../utils/retroAudio';

interface Mission3Props {
  onComplete: (pointsEarned: number, badge?: string) => void;
  isAlreadyCompleted?: boolean;
}

interface CrisisScenario {
  id: number;
  title: string;
  disasterType: 'gempa' | 'erupsi';
  situation: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    feedback: string;
    savedCount: number;
  }[];
}

const CRISIS_SCENARIOS: CrisisScenario[] = [
  {
    id: 1,
    title: 'GELOMBANG SEISMIK GEMPA 6.5 SR MENGGUNCANG RUANGAN!',
    disasterType: 'gempa',
    situation: 'Lantai bergetar hebat, lampu bergoyang keras, dan plafon mulai berjatuhan saat kamu berada di dalam kelas bersama teman-teman.',
    options: [
      {
        id: 'run',
        text: 'A. Berlari panik keluar ruangan saat guncangan sedang paling kencang.',
        isCorrect: false,
        feedback: 'Berbahaya! Berlari saat lantai bergetar memicu jatuh dan tertimpa pecahan genteng, kaca, atau reruntuhan kanopi pintu.',
        savedCount: 10,
      },
      {
        id: 'drop_cover',
        text: 'B. Lakukan "Drop, Cover, and Hold On" di bawah meja kokoh dan lindungi kepala.',
        isCorrect: true,
        feedback: 'Tindakan Tepat! Berlutut, melindungi kepala di bawah meja kokoh, dan berpegangan erat mencegah cedera fatal benturan.',
        savedCount: 35,
      },
      {
        id: 'window',
        text: 'C. Mendekati jendela kaca untuk melihat apakah bangunan lain roboh.',
        isCorrect: false,
        feedback: 'Fatal! Kaca jendela dapat pecah akibat tegangan geser gempa dan melukai tubuh.',
        savedCount: 5,
      },
      {
        id: 'valuables',
        text: 'D. Mencari tas sekolah dan barang-barang berharga yang tertinggal di pojok.',
        isCorrect: false,
        feedback: 'Keliru! Nyawa adalah prioritas utama. Mengambil barang menghabiskan detik-detik berharga perlindungan diri.',
        savedCount: 8,
      },
    ],
  },
  {
    id: 2,
    title: 'ERUPSI MERAPI: AWAN PANAS & HUJAN ABU VULKANIK!',
    disasterType: 'erupsi',
    situation: 'Puncak Merapi meletupkan kolom abu tebal 3.000 meter. Sirine bahaya berbunyi nyaring, dan abu vulkanik pekat mulai menghujani kota.',
    options: [
      {
        id: 'mask_evac',
        text: 'A. Kenakan masker/kain basah, kacamata pelindung, dan evakuasi menjauhi lembah sungai lahar.',
        isCorrect: true,
        feedback: 'Luar Biasa! Abu vulkanik mengandung partikel silika tajam. Masker dan kacamata melindungi paru-paru dan kornea mata saat evakuasi.',
        savedCount: 40,
      },
      {
        id: 'river_spectate',
        text: 'B. Menuju jembatan sungai untuk menonton dan merekam aliran lahar dingin.',
        isCorrect: false,
        feedback: 'Sangat Berbahaya! Aliran lahar dingin bergerak puluhan km/jam membawa batu besar dan menghancurkan jembatan seketika.',
        savedCount: 4,
      },
      {
        id: 'open_air',
        text: 'C. Berdiri di luar ruangan tanpa penutup hidung sambil menunggu arahan datang.',
        isCorrect: false,
        feedback: 'Menghirup abu vulkanik dapat memicu ISPA parah dan sesak napas dalam beberapa menit.',
        savedCount: 12,
      },
    ],
  },
];

export default function Mission3During({ onComplete, isAlreadyCompleted = false }: Mission3Props) {
  const [currentScenarioIdx, setCurrentScenarioIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [decisionFeedback, setDecisionFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [citizensSaved, setCitizensSaved] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  const scenario = CRISIS_SCENARIOS[currentScenarioIdx];

  // 30s Countdown timer during crisis
  useEffect(() => {
    if (decisionFeedback) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          retroAudio.playExplosion();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [decisionFeedback, currentScenarioIdx]);

  const handleChooseOption = (opt: (typeof scenario.options)[0]) => {
    setSelectedOptionId(opt.id);
    setDecisionFeedback({ isCorrect: opt.isCorrect, text: opt.feedback });

    if (opt.isCorrect) {
      retroAudio.playWin();
      setCitizensSaved((prev) => prev + opt.savedCount);
    } else {
      retroAudio.playExplosion();
      setCitizensSaved((prev) => prev + opt.savedCount);
    }
  };

  const handleNextScenario = () => {
    retroAudio.playSelect();
    if (currentScenarioIdx < CRISIS_SCENARIOS.length - 1) {
      setCurrentScenarioIdx((prev) => prev + 1);
      setSelectedOptionId(null);
      setDecisionFeedback(null);
      setTimeLeft(30);
    } else {
      // Mission 3 Completed!
      onComplete(20, 'Quick Responder');
    }
  };

  return (
    <div className="flex flex-col gap-6 text-amber-950 font-pixel">
      {/* ── Emergency Siren Bar ── */}
      <div className="flex items-center justify-between bg-rose-600 text-white p-3 rounded-xl border-2 border-rose-950 shadow-[0_4px_0_#4c0519] animate-pulse">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-2xl animate-spin">e911_emergency</span>
          <span className="font-pixel-title text-xs md:text-sm font-bold tracking-wider">
            🚨 SITUASI DARURAT: SKENARIO {currentScenarioIdx + 1} / {CRISIS_SCENARIOS.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-2.5 py-1 rounded bg-black/40 border border-white/30 text-xs font-mono font-bold">
            WAKTU REAKSI: <span className={timeLeft <= 10 ? 'text-yellow-300 animate-ping' : ''}>{timeLeft}s</span>
          </div>
          <div className="px-2.5 py-1 rounded bg-emerald-900 border border-emerald-400 text-xs font-pixel-title font-bold">
            👥 WARGA SELAMAT: {citizensSaved}
          </div>
        </div>
      </div>

      {/* ── Main Crisis Situation Card with Screen Shake ── */}
      <div
        className={`bg-slate-950 border-2 border-rose-600 rounded-2xl p-6 text-slate-100 shadow-2xl relative overflow-hidden ${
          !decisionFeedback ? 'animate-shake' : ''
        }`}
      >
        {/* Scenario Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-rose-900/60 border border-rose-500 flex items-center justify-center">
            <PixelIcon name={scenario.disasterType === 'gempa' ? 'earthquake' : 'volcano'} size={18} />
          </div>
          <h3 className="font-pixel-title text-xs md:text-sm font-bold text-rose-400">
            {scenario.title}
          </h3>
        </div>

        {/* Narrative Box */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 leading-relaxed mb-5">
          {scenario.situation}
        </div>

        {/* Tactical Choice Options */}
        <div className="space-y-3">
          <span className="text-[11px] font-bold text-amber-300 block">
            PILIH KEPUTUSAN TAKTIS SEGERA:
          </span>
          <div className="grid grid-cols-1 gap-2.5">
            {scenario.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => !decisionFeedback && handleChooseOption(opt)}
                  disabled={Boolean(decisionFeedback)}
                  className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? opt.isCorrect
                        ? 'bg-emerald-900/90 border-emerald-400 text-white shadow-lg'
                        : 'bg-rose-900/90 border-rose-400 text-white shadow-lg'
                      : decisionFeedback
                      ? 'opacity-40 bg-slate-900 border-slate-800 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200 active:translate-y-0.5'
                  }`}
                >
                  <span className="text-xs font-bold leading-relaxed">{opt.text}</span>
                  {isSelected && (
                    <span className="text-sm font-bold ml-2">
                      {opt.isCorrect ? '✓ TEPAT (+RP)' : '✗ BERISIKO'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Consequence / Feedback Modal */}
        {decisionFeedback && (
          <div
            className={`mt-5 p-4 rounded-xl border-2 animate-fade-in ${
              decisionFeedback.isCorrect
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                : 'bg-rose-950/80 border-rose-500 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="font-pixel-title text-xs font-bold">
                {decisionFeedback.isCorrect ? '★ KEPUTUSAN EFEKTIF TERCAPAI!' : '⚠️ KONSEKUENSI KEPUTUSAN BERISIKO:'}
              </span>
            </div>
            <p className="text-xs leading-relaxed">{decisionFeedback.text}</p>
          </div>
        )}
      </div>

      {/* ── Footer Navigation ── */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs font-bold text-amber-900">
          Status Analis: {currentScenarioIdx + 1} dari {CRISIS_SCENARIOS.length} Skenario Darurat
        </span>

        {decisionFeedback && (
          <button
            onClick={handleNextScenario}
            className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-pixel-title font-bold border-2 border-amber-950 shadow-[0_4px_0_#78350f] cursor-pointer flex items-center gap-2 active:translate-y-0.5"
          >
            <span>
              {currentScenarioIdx < CRISIS_SCENARIOS.length - 1
                ? 'LANJUT KE SKENARIO BERIKUTNYA'
                : 'SELESAIKAN MISI 3 (+20 RP)'}
            </span>
            <span>&gt;</span>
          </button>
        )}

        {isAlreadyCompleted && !decisionFeedback && (
          <span className="px-4 py-2 rounded-xl bg-emerald-100 border border-emerald-500 text-emerald-800 text-xs font-bold">
            ✓ MISI 3 SELESAI (+20 RP)
          </span>
        )}
      </div>
    </div>
  );
}
