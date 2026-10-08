// ── src/app/Level2/missions/Mission6Crossword.tsx ─────────────────────
// MISI 6: TEKA-TEKI SILANG (TTS) GEOLOGI & KEBENCANAAN (Command Center Lock)
// Istilah berbasis materi "Perjalanan Menuju Geologis Bumi":
// - DIVERGEN, PANGEA, SUBDUKSI, SEISMOGRAF, MERAPI
// - KONVERGEN, TRANSFORM, WEGENER, SESAR

import { useState } from 'react';
import PixelIcon from '../../../components/PixelIcon';
import { retroAudio } from '../../../utils/retroAudio';

interface Mission6Props {
  onComplete: (pointsEarned: number, badge?: string) => void;
  isAlreadyCompleted?: boolean;
}

interface CrosswordClue {
  id: string;
  number: number;
  direction: 'across' | 'down';
  answer: string;
  clue: string;
}

const CLUES: CrosswordClue[] = [
  // Mendatar (Across)
  {
    id: 'a1',
    number: 1,
    direction: 'across',
    answer: 'DIVERGEN',
    clue: 'Batas dua lempeng tektonik yang bergerak saling menjauh dan membentuk punggung tengah laut.',
  },
  {
    id: 'a2',
    number: 2,
    direction: 'across',
    answer: 'PANGEA',
    clue: 'Nama benua raksasa purba saat seluruh daratan bumi masih bersatu.',
  },
  {
    id: 'a3',
    number: 3,
    direction: 'across',
    answer: 'SUBDUKSI',
    clue: 'Proses penunjaman lempeng samudera ke bawah lempeng benua hingga melebur ke mantel.',
  },
  {
    id: 'a4',
    number: 4,
    direction: 'across',
    answer: 'SEISMOGRAF',
    clue: 'Instrumen yang mengubah getaran mekanik gelombang bumi menjadi sinyal listrik & grafik.',
  },
  {
    id: 'a5',
    number: 5,
    direction: 'across',
    answer: 'MERAPI',
    clue: 'Gunung api aktif di Indonesia yang terbentuk dari aktivitas subduksi lempeng konvergen.',
  },
  // Menurun (Down)
  {
    id: 'd1',
    number: 6,
    direction: 'down',
    answer: 'KONVERGEN',
    clue: 'Batas dua lempeng tektonik yang saling bertabrakan dan memicu gempa megathrust.',
  },
  {
    id: 'd2',
    number: 7,
    direction: 'down',
    answer: 'TRANSFORM',
    clue: 'Batas dua lempeng tektonik yang saling bergeser mendatar (contoh: Sesar San Andreas).',
  },
  {
    id: 'd3',
    number: 8,
    direction: 'down',
    answer: 'WEGENER',
    clue: 'Ilmuwan pencetus hipotesis pergeseran benua (Continental Drift) pada tahun 1912.',
  },
  {
    id: 'd4',
    number: 9,
    direction: 'down',
    answer: 'SESAR',
    clue: 'Zona patahan retakan batuan kerak bumi tempat terakumulasinya tegangan gempa bumi.',
  },
];

export default function Mission6Crossword({ onComplete, isAlreadyCompleted = false }: Mission6Props) {
  const [userInputs, setUserInputs] = useState<{ [clueId: string]: string }>({});
  const [activeClueId, setActiveClueId] = useState<string>('a1');
  const [isSolved, setIsSolved] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ [clueId: string]: boolean }>({});

  const activeClue = CLUES.find((c) => c.id === activeClueId) || CLUES[0];

  const handleInputChange = (clueId: string, val: string) => {
    setUserInputs((prev) => ({
      ...prev,
      [clueId]: val.toUpperCase().replace(/[^A-Z]/g, ''),
    }));
    setValidationErrors((prev) => ({ ...prev, [clueId]: false }));
  };

  const handleValidateTTS = () => {
    const errors: { [clueId: string]: boolean } = {};
    let allCorrect = true;

    CLUES.forEach((clue) => {
      const input = (userInputs[clue.id] || '').trim();
      if (input !== clue.answer) {
        errors[clue.id] = true;
        allCorrect = false;
      }
    });

    setValidationErrors(errors);

    if (allCorrect) {
      retroAudio.playWin();
      setIsSolved(true);
      onComplete(10, 'Resilience Builder');
    } else {
      retroAudio.playHover();
      alert('Terdapat kata TTS yang masih keliru atau belum lengkap. Periksa kembali huruf dan petunjuknya!');
    }
  };

  const solvedCount = CLUES.filter(
    (c) => (userInputs[c.id] || '').trim() === c.answer
  ).length;

  return (
    <div className="flex flex-col gap-6 text-amber-950 font-pixel">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-amber-100/90 border-2 border-amber-900/40 p-3 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-amber-900 text-amber-100 flex items-center justify-center font-pixel-title text-[13px] font-bold">
            6
          </span>
          <span className="font-pixel-title text-[13px] md:text-[15px] font-bold text-amber-950">
            MISI 6: TEKA-TEKI SILANG GEOLOGIS (COMMAND CENTER LOCK)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded bg-slate-900 text-amber-300 font-pixel-title text-[13.5px] font-bold border border-amber-500/40">
            TERPECAHKAN: {solvedCount} / {CLUES.length} KATA
          </span>
        </div>
      </div>

      {/* Narrative Card */}
      <div className="bg-amber-950/5 border-2 border-amber-900/30 rounded-2xl p-4">
        <h3 className="text-[13px] md:text-[15px] font-bold text-amber-950 mb-1 flex items-center gap-2">
          <PixelIcon name="key" size={18} />
          <span>Kunci Akses Command Center: Teka-Teki Silang Geologi & Bencana</span>
        </h3>
        <p className="text-[14.5px] text-amber-900 leading-relaxed font-semibold">
          Pintu Command Center kota terkunci oleh enkripsi istilah sains geologis. Isi kotak TTS di bawah ini
          berdasarkan materi pergeseran benua, lempeng tektonik, dan mitigasi untuk membuka gerbang final Level 3!
        </p>
      </div>

      {/* Crossword Interactive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Clue List (Across & Down) */}
        <div className="lg:col-span-5 space-y-3">
          {/* MENDATAR (ACROSS) */}
          <div className="p-3.5 rounded-xl bg-slate-900 border-2 border-amber-900/40 text-slate-100">
            <span className="font-pixel-title text-[13.5px] text-amber-400 font-bold block mb-2">
              MENDATAR (ACROSS)
            </span>
            <div className="space-y-1.5">
              {CLUES.filter((c) => c.direction === 'across').map((c) => {
                const isCurrent = activeClueId === c.id;
                const isCorrect = (userInputs[c.id] || '') === c.answer;
                const hasError = validationErrors[c.id];

                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      retroAudio.playSelect();
                      setActiveClueId(c.id);
                    }}
                    className={`w-full p-2 rounded-lg text-left text-[13px] transition-all cursor-pointer flex items-center justify-between ${
                      isCurrent
                        ? 'bg-amber-700 text-white font-bold'
                        : isCorrect
                        ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40'
                        : hasError
                        ? 'bg-rose-950/70 text-rose-300 border border-rose-500/40'
                        : 'bg-slate-800 hover:bg-slate-750 text-slate-300'
                    }`}
                  >
                    <span>
                      #{c.number}. ({c.answer.length} Huruf)
                    </span>
                    {isCorrect ? (
                      <span className="text-emerald-400 font-bold">✓ TEPAT</span>
                    ) : (
                      <span className="text-[13.5px] text-slate-400 opacity-80 font-semibold">
                        {userInputs[c.id] || '......'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* MENURUN (DOWN) */}
          <div className="p-3.5 rounded-xl bg-slate-900 border-2 border-amber-900/40 text-slate-100">
            <span className="font-pixel-title text-[13.5px] text-sky-400 font-bold block mb-2">
              MENURUN (DOWN)
            </span>
            <div className="space-y-1.5">
              {CLUES.filter((c) => c.direction === 'down').map((c) => {
                const isCurrent = activeClueId === c.id;
                const isCorrect = (userInputs[c.id] || '') === c.answer;
                const hasError = validationErrors[c.id];

                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      retroAudio.playSelect();
                      setActiveClueId(c.id);
                    }}
                    className={`w-full p-2 rounded-lg text-left text-[13px] transition-all cursor-pointer flex items-center justify-between ${
                      isCurrent
                        ? 'bg-sky-700 text-white font-bold'
                        : isCorrect
                        ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40'
                        : hasError
                        ? 'bg-rose-950/70 text-rose-300 border border-rose-500/40'
                        : 'bg-slate-800 hover:bg-slate-750 text-slate-300'
                    }`}
                  >
                    <span>
                      #{c.number}. ({c.answer.length} Huruf)
                    </span>
                    {isCorrect ? (
                      <span className="text-emerald-400 font-bold">✓ TEPAT</span>
                    ) : (
                      <span className="text-[13.5px] text-slate-400 opacity-80 font-semibold">
                        {userInputs[c.id] || '......'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Active Clue Input Panel & Letter Blocks */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-amber-50 border-2 border-amber-900/30 rounded-2xl p-5 shadow-inner">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded bg-amber-900 text-white font-pixel-title text-[13.5px] font-bold">
                PETUNJUK SOAL #{activeClue.number} ({activeClue.direction === 'across' ? 'MENDATAR' : 'MENURUN'})
              </span>
              <span className="text-[13px] text-amber-900 font-bold font-mono">
                [{activeClue.answer.length} HURUF]
              </span>
            </div>

            <p className="text-[13px] md:text-[15px] text-amber-950 font-bold leading-relaxed mb-6">
              "{activeClue.clue}"
            </p>

            {/* Retro Letter Boxes */}
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              {Array.from({ length: activeClue.answer.length }).map((_, idx) => {
                const currentLetter = (userInputs[activeClue.id] || '')[idx] || '';
                return (
                  <div
                    key={idx}
                    className={`w-10 h-12 rounded-lg border-2 flex items-center justify-center font-pixel-title text-base font-bold shadow-md transition-all ${
                      currentLetter
                        ? 'bg-amber-900 text-amber-100 border-amber-950 shadow-[0_3px_0_#451a03]'
                        : 'bg-white text-slate-300 border-dashed border-amber-900/40'
                    }`}
                  >
                    {currentLetter || '_'}
                  </div>
                );
              })}
            </div>

            {/* Direct Input Field */}
            <div className="flex flex-col items-center gap-2 mb-4">
              <input
                type="text"
                value={userInputs[activeClue.id] || ''}
                maxLength={activeClue.answer.length}
                onChange={(e) => handleInputChange(activeClue.id, e.target.value)}
                placeholder={`KETIK ${activeClue.answer.length} HURUF JAWABAN...`}
                className="w-full max-w-sm px-4 py-2.5 rounded-xl bg-white border-2 border-amber-900/60 font-pixel-title text-center text-[13px] tracking-widest text-amber-950 focus:outline-none focus:border-amber-600 shadow-inner font-semibold"
              />
              <span className="text-[13.5px] text-amber-800 font-semibold">
                Tekan tombol keyboard untuk mengetik huruf kapital.
              </span>
            </div>
          </div>

          {/* Quick Navigation Between Clues */}
          <div className="flex items-center justify-between pt-4 border-t border-amber-900/20">
            <button
              onClick={() => {
                retroAudio.playSelect();
                const curIdx = CLUES.findIndex((c) => c.id === activeClueId);
                const prevIdx = (curIdx - 1 + CLUES.length) % CLUES.length;
                setActiveClueId(CLUES[prevIdx].id);
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 text-[13.5px] font-pixel-title font-bold cursor-pointer"
            >
              &lt; SOAL SEBELUMNYA
            </button>

            <button
              onClick={() => {
                retroAudio.playSelect();
                const curIdx = CLUES.findIndex((c) => c.id === activeClueId);
                const nextIdx = (curIdx + 1) % CLUES.length;
                setActiveClueId(CLUES[nextIdx].id);
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 text-[13.5px] font-pixel-title font-bold cursor-pointer"
            >
              SOAL BERIKUTNYA &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Footer Submit */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-[13px] text-amber-900 font-bold">
          Validasi Istilah Geologi: {solvedCount} dari {CLUES.length} Selesai
        </span>

        {isSolved || isAlreadyCompleted ? (
          <span className="px-4 py-2 rounded-xl bg-emerald-100 border border-emerald-500 text-emerald-800 text-[13px] font-bold">
            ✓ COMMAND CENTER TERBUKA! (+10 RP)
          </span>
        ) : (
          <button
            onClick={handleValidateTTS}
            className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-[13px] font-pixel-title font-bold border-2 border-amber-950 shadow-[0_4px_0_#78350f] cursor-pointer active:translate-y-0.5"
          >
            VALIDASI JAWABAN TTS & BUKA COMMAND CENTER
          </button>
        )}
      </div>
    </div>
  );
}
