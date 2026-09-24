// ── src/app/Level2/CrosswordModal.tsx ────────────────────────────────
// Modal Teka-Teki Silang (TTS) Mitigasi Geologis Level 2
// Area 1: Mitigasi Gempa Bumi & Area 2: Mitigasi Erupsi Merapi
// Evaluasi akhir zona sebelum gerbang terbuka menuju area berikutnya atau kelulusan level

import { useState, useEffect, useRef } from 'react';
import PixelIcon from '../../components/PixelIcon';
import { retroAudio } from '../../utils/retroAudio';

interface CrosswordModalProps {
  areaIndex?: number;
  onSuccess: () => void;
  onClose: () => void;
}

interface ClueItem {
  id: string;
  number: number;
  direction: 'across' | 'down';
  answer: string;
  clue: string;
  startRow: number;
  startCol: number;
}

// ── CLUES AREA 1: MITIGASI GEMPA BUMI & KESIAPSIAGAAN ──
const CLUES_AREA_1: ClueItem[] = [
  {
    id: 'c1',
    number: 1,
    direction: 'across',
    answer: 'BERLINDUNG',
    clue: 'Aksi mencari perlindungan di bawah meja belajar kokoh saat guncangan gempa bumi terjadi (Merunduk, Berlindung, Bertahan).',
    startRow: 1,
    startCol: 1,
  },
  {
    id: 'c2',
    number: 2,
    direction: 'down',
    answer: 'EVAKUASI',
    clue: 'Proses perpindahan warga dari bangunan atau zona bahaya menuju titik kumpul aman yang telah ditentukan.',
    startRow: 1,
    startCol: 2,
  },
  {
    id: 'c3',
    number: 3,
    direction: 'down',
    answer: 'GEMPA',
    clue: 'Getaran atau guncangan pada permukaan bumi akibat pelepasan energi mendadak dari pergerakan lempeng tektonik.',
    startRow: 1,
    startCol: 10,
  },
  {
    id: 'c4',
    number: 4,
    direction: 'across',
    answer: 'SIAGA',
    clue: 'Sikap kesiapsiagaan menghadapi bencana, termasuk menyiapkan tas 72 jam dan mengenali jalur evakuasi.',
    startRow: 7,
    startCol: 2,
  },
];

// ── CLUES AREA 2: MITIGASI ERUPSI MERAPI & STATUS PVMBG ──
const CLUES_AREA_2: ClueItem[] = [
  {
    id: 'c1',
    number: 1,
    direction: 'across',
    answer: 'PVMBG',
    clue: 'Pusat Vulkanologi dan Mitigasi Bencana Geologi, lembaga resmi pemerintah pemantau aktivitas gunung api.',
    startRow: 1,
    startCol: 1,
  },
  {
    id: 'c2',
    number: 2,
    direction: 'down',
    answer: 'MERAPI',
    clue: 'Salah satu gunung api tipe stratovolcano paling aktif di Indonesia di perbatasan Yogyakarta dan Jawa Tengah.',
    startRow: 1,
    startCol: 3,
  },
  {
    id: 'c3',
    number: 3,
    direction: 'across',
    answer: 'LAHAR',
    clue: 'Aliran material vulkanik (batu, kerikil, pasir, debu) yang terbawa hujan deras menuruni alur lembah sungai.',
    startRow: 4,
    startCol: 2,
  },
  {
    id: 'c4',
    number: 4,
    direction: 'down',
    answer: 'AWAS',
    clue: 'Tingkat status aktivitas gunung api tertinggi (Level IV) yang menandakan letusan utama sedang atau segera terjadi.',
    startRow: 4,
    startCol: 5,
  },
];

// ── CLUES AREA 3: PASCABENCANA, TITIK KUMPUL & PENANGANAN MEDIS ──
const CLUES_AREA_3: ClueItem[] = [
  {
    id: 'c1',
    number: 1,
    direction: 'across',
    answer: 'SUSULAN',
    clue: 'Getaran gempa bumi berikutnya yang berpotensi terjadi beberapa menit hingga beberapa hari setelah gempa utama.',
    startRow: 1,
    startCol: 1,
  },
  {
    id: 'c2',
    number: 2,
    direction: 'down',
    answer: 'LAPANGAN',
    clue: 'Area terbuka luas yang paling aman dijadikan titik kumpul warga sekolah karena terbebas dari bahaya reruntuhan bangunan.',
    startRow: 1,
    startCol: 5,
  },
  {
    id: 'c3',
    number: 3,
    direction: 'across',
    answer: 'BMKG',
    clue: 'Lembaga resmi pemerintah yang berwenang menyiarkan informasi gempa bumi dan peringatan dini tsunami di Indonesia.',
    startRow: 6,
    startCol: 2,
  },
  {
    id: 'c4',
    number: 4,
    direction: 'down',
    answer: 'MEDIS',
    clue: 'Bantuan pertolongan pertama (P3K) dan perawatan kesehatan yang diberikan kepada korban luka atau syok di posko darurat.',
    startRow: 6,
    startCol: 3,
  },
];

export default function CrosswordModal({ areaIndex = 0, onSuccess, onClose }: CrosswordModalProps) {
  const clues = areaIndex === 2 ? CLUES_AREA_3 : areaIndex === 1 ? CLUES_AREA_2 : CLUES_AREA_1;
  const rows = areaIndex === 2 ? 11 : areaIndex === 1 ? 9 : 10;
  const cols = areaIndex === 2 ? 8 : areaIndex === 1 ? 8 : 12;
  const initialClue = clues[0];

  // Cell data map: "r-c" -> { char, isFixed, clueNumber, activeIn: [] }
  const [grid, setGrid] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const c of clues) {
      for (let i = 0; i < c.answer.length; i++) {
        const r = c.direction === 'across' ? c.startRow : c.startRow + i;
        const col = c.direction === 'across' ? c.startCol + i : c.startCol;
        initial[`${r}-${col}`] = '';
      }
    }
    return initial;
  });

  const [activeClueId, setActiveClueId] = useState<string>(initialClue.id);
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number }>({
    r: initialClue.startRow,
    c: initialClue.startCol,
  });
  const [isCompleted, setIsCompleted] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Focus container on mount for keyboard listening
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  // Keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCompleted) return;

      const activeClue = clues.find((c) => c.id === activeClueId);
      if (!activeClue) return;

      const key = e.key.toUpperCase();

      // Letter A-Z
      if (/^[A-Z]$/.test(key)) {
        e.preventDefault();
        retroAudio.playSelect();
        const cellKey = `${selectedCell.r}-${selectedCell.c}`;

        setGrid((prev) => ({ ...prev, [cellKey]: key }));
        setValidationError(null);

        // Advance to next cell in current clue direction
        if (activeClue.direction === 'across') {
          const nextC = selectedCell.c + 1;
          if (nextC < activeClue.startCol + activeClue.answer.length) {
            setSelectedCell({ r: selectedCell.r, c: nextC });
          }
        } else {
          const nextR = selectedCell.r + 1;
          if (nextR < activeClue.startRow + activeClue.answer.length) {
            setSelectedCell({ r: nextR, c: selectedCell.c });
          }
        }
      }

      // Backspace
      else if (e.key === 'Backspace') {
        e.preventDefault();
        retroAudio.playHover();
        const cellKey = `${selectedCell.r}-${selectedCell.c}`;
        setGrid((prev) => ({ ...prev, [cellKey]: '' }));

        // Move to previous cell
        if (activeClue.direction === 'across') {
          const prevC = selectedCell.c - 1;
          if (prevC >= activeClue.startCol) {
            setSelectedCell({ r: selectedCell.r, c: prevC });
          }
        } else {
          const prevR = selectedCell.r - 1;
          if (prevR >= activeClue.startRow) {
            setSelectedCell({ r: prevR, c: selectedCell.c });
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeClueId, selectedCell, isCompleted, clues]);

  // Select Clue
  const handleSelectClue = (clue: ClueItem) => {
    retroAudio.playSelect();
    setActiveClueId(clue.id);
    setSelectedCell({ r: clue.startRow, c: clue.startCol });
  };

  // Check Solution
  const handleCheckSolution = () => {
    let allCorrect = true;

    for (const c of clues) {
      for (let i = 0; i < c.answer.length; i++) {
        const r = c.direction === 'across' ? c.startRow : c.startRow + i;
        const col = c.direction === 'across' ? c.startCol + i : c.startCol;
        const entered = grid[`${r}-${col}`]?.toUpperCase() || '';
        if (entered !== c.answer[i]) {
          allCorrect = false;
          break;
        }
      }
      if (!allCorrect) break;
    }

    if (allCorrect) {
      retroAudio.playWin();
      setIsCompleted(true);
      setValidationError(null);
    } else {
      retroAudio.playError?.() ?? retroAudio.playHover();
      setValidationError('Masih ada huruf yang belum tepat! Periksa kembali petunjuknya.');
    }
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm select-none animate-fadeIn font-pixel outline-none"
    >
      <div className="relative w-full max-w-2xl bg-[#fef3c7] border-4 border-[#451a03] rounded-2xl p-4 sm:p-5 shadow-[0_12px_0_#1c0d02] text-[#451a03] max-h-[96vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-3 border-[#78350f] pb-2.5 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#b45309]/20 border border-[#b45309] flex items-center justify-center shrink-0">
              <PixelIcon name="key" size={18} className="text-[#92400e]" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm text-[#451a03] font-pixel-title font-bold">
                {areaIndex === 2
                  ? 'TEKA-TEKI SILANG: PASCABENCANA & TITIK KUMPUL'
                  : areaIndex === 1
                  ? 'TEKA-TEKI SILANG: MITIGASI ERUPSI MERAPI'
                  : 'TEKA-TEKI SILANG: MITIGASI GEMPA BUMI'}
              </h2>
            </div>
          </div>
          <button
            onClick={() => {
              retroAudio.playSelect();
              onClose();
            }}
            className="w-8 h-8 rounded-lg bg-[#b45309] hover:bg-[#92400e] text-amber-100 border-2 border-[#451a03] font-pixel-title text-xs flex items-center justify-center cursor-pointer active:translate-y-0.5 shadow-[0_2px_0_#451a03] shrink-0"
            title="Tutup"
          >
            <PixelIcon name="cross" size={12} />
          </button>
        </div>

        {/* Instructions */}
        <div className="p-2.5 rounded-xl bg-amber-100/90 border-2 border-[#b45309]/40 mb-3 text-[10px] text-[#291305]">
          Isi kotak teka-teki silang dengan istilah sains geologi &amp; kesiapsiagaan mitigasi bencana yang tepat! Klik petunjuk atau kotak untuk mulai mengetik.
        </div>

        {/* Main Content Layout: Crossword Grid (Left) + Clues List (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3 items-start">
          {/* ── CROSSWORD GRID (7 cols on desktop) ── */}
          <div className="md:col-span-7 bg-[#0f172a] p-3 rounded-xl border-3 border-[#451a03] shadow-inner flex flex-col items-center justify-center overflow-x-auto">
            <div
              className="grid gap-1"
              style={{
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                width: '100%',
                maxWidth: areaIndex === 2 ? '340px' : areaIndex === 1 ? '320px' : '390px',
              }}
            >
              {Array.from({ length: rows }).map((_, r) =>
                Array.from({ length: cols }).map((_, c) => {
                  const key = `${r}-${c}`;
                  const isCrosswordCell = key in grid;

                  if (!isCrosswordCell) {
                    return (
                      <div
                        key={key}
                        className="aspect-square bg-slate-900/60 rounded-xs"
                      />
                    );
                  }

                  const isSelected = selectedCell.r === r && selectedCell.c === c;
                  const clueNumber = clues.find((cl) => cl.startRow === r && cl.startCol === c)?.number;
                  const letter = grid[key] || '';

                  return (
                    <button
                      key={key}
                      onClick={() => {
                        retroAudio.playSelect();
                        setSelectedCell({ r, c });
                        // If cell belongs to current clue, keep it; else find first clue it belongs to
                        const belongsToCurrent = clues.find(
                          (cl) =>
                            cl.id === activeClueId &&
                            ((cl.direction === 'across' && cl.startRow === r && c >= cl.startCol && c < cl.startCol + cl.answer.length) ||
                              (cl.direction === 'down' && cl.startCol === c && r >= cl.startRow && r < cl.startRow + cl.answer.length))
                        );
                        if (!belongsToCurrent) {
                          const otherClue = clues.find(
                            (cl) =>
                              (cl.direction === 'across' && cl.startRow === r && c >= cl.startCol && c < cl.startCol + cl.answer.length) ||
                              (cl.direction === 'down' && cl.startCol === c && r >= cl.startRow && r < cl.startRow + cl.answer.length)
                          );
                          if (otherClue) setActiveClueId(otherClue.id);
                        }
                      }}
                      className={`relative aspect-square rounded border-2 font-pixel-title text-xs sm:text-sm font-bold flex items-center justify-center transition-all cursor-pointer ${isSelected
                        ? 'bg-amber-400 text-amber-950 border-amber-300 ring-2 ring-amber-400 scale-105 z-10'
                        : letter
                          ? 'bg-[#fef3c7] text-[#451a03] border-amber-600'
                          : 'bg-slate-800 text-slate-100 border-slate-600 hover:border-amber-400'
                        }`}
                    >
                      {clueNumber && (
                        <span className="absolute top-0.5 left-1 text-[7px] text-amber-600 font-bold leading-none pointer-events-none">
                          {clueNumber}
                        </span>
                      )}
                      <span>{letter}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* ── CLUES LIST (5 cols on desktop) ── */}
          <div className="md:col-span-5 space-y-2 text-xs">
            <span className="text-[9px] font-pixel-title text-[#b45309] block uppercase tracking-wider">
              PETUNJUK KATA:
            </span>
            {clues.map((clue) => {
              const isActive = activeClueId === clue.id;
              return (
                <button
                  key={clue.id}
                  onClick={() => handleSelectClue(clue)}
                  className={`w-full text-left p-2 rounded-xl border-2 transition-all cursor-pointer block ${isActive
                    ? 'bg-amber-600 text-white border-amber-950 shadow-[0_2px_0_#451a03] -translate-y-0.5'
                    : 'bg-[#fffbeb] hover:bg-[#fde68a] text-[#451a03] border-[#b45309]/40'
                    }`}
                >
                  <div className="flex items-center gap-1.5 mb-1 font-pixel-title text-[9px]">
                    <span
                      className={`px-1.5 py-0.5 rounded ${isActive ? 'bg-amber-800 text-amber-200' : 'bg-[#b45309]/20 text-[#b45309]'
                        }`}
                    >
                      {clue.number} {clue.direction === 'across' ? 'MENDATAR' : 'MENURUN'}
                    </span>
                    <span className="opacity-75">({clue.answer.length} HURUF)</span>
                  </div>
                  <p className="text-[10px] leading-relaxed line-clamp-2">
                    {clue.clue}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="mb-3 p-2 rounded-xl bg-rose-100 border-2 border-rose-500 text-rose-900 text-xs font-bold text-center">
            {validationError}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2 border-t-2 border-[#b45309]/30">
          <div className="flex items-center gap-1.5 text-[9px] text-[#78350f]">
          </div>

          {!isCompleted ? (
            <button
              onClick={handleCheckSolution}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-50 border-3 border-[#451a03] shadow-[0_3px_0_#231206] text-xs font-pixel-title cursor-pointer active:translate-y-0.5 flex items-center gap-2"
            >
              <PixelIcon name="check" size={13} className="text-amber-200" />
              <span>CEK JAWABAN</span>
            </button>
          ) : (
            <button
              onClick={() => {
                retroAudio.playSelect();
                onSuccess();
              }}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white border-3 border-emerald-950 shadow-[0_3px_0_#064e3b] text-xs font-pixel-title cursor-pointer active:translate-y-0.5 flex items-center gap-2 animate-bounce"
            >
              <PixelIcon name="unlock" size={13} />
              <span>
                {areaIndex === 1
                  ? 'SELESAIKAN EKSPEDISI LEVEL 2!'
                  : 'BUKA GERBANG KE AREA 2!'}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
