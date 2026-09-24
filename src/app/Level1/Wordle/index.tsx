import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/teacherStore';
import { retroAudio } from '../../../utils/retroAudio';
import PixelTrophy from '../../../components/PixelTrophy';
import { submitLevelProgress } from '../../../utils/supabaseClient';

function seededRandom(seed: number) {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

const WORD_BANK = [
  { word: 'GEMPA', hint: 'Getaran di permukaan bumi akibat pelepasan energi lempeng tektonik.' },
  { word: 'MAGMA', hint: 'Batuan cair pijar yang sangat panas di dalam mantel bumi.' },
  { word: 'SESAR', hint: 'Patahan pada kerak bumi yang menjadi pusat gempa tektonik dangkal.' },
  { word: 'KERAK', hint: 'Lapisan bumi paling luar yang keras tempat manusia berpijak.' },
  { word: 'LAHAR', hint: 'Aliran material vulkanik dari gunung berapi yang bercampur air hujan.' },
  { word: 'EROSI', hint: 'Proses pengikisan tanah atau lereng gunung yang memicu longsor.' },
  { word: 'PANAS', hint: 'Energi termal ekstrem dari dalam bumi (geotermal) & erupsi magma.' },
  { word: 'RETAK', hint: 'Kondisi rekahan tanah atau dinding bangunan akibat guncangan gempa.' },
  { word: 'SUSUL', hint: 'Gempa susulan adalah gempa skala lebih kecil setelah gempa utama.' },
  { word: 'PUSAT', hint: 'Titik asal terjadinya gelombang gempa bumi di bawah tanah (hiposentrum).' },
  { word: 'JALUR', hint: 'Jalur evakuasi aman yang wajib diikuti warga saat terjadi bencana.' },
];

const MAX_GUESSES = 3;

type GuessStatus = 'correct' | 'present' | 'absent' | 'empty';

export interface WordleProps {
  customWords?: { word: string; hint: string }[];
  targetCount?: number;
  gateTitle?: string;
  isGateChallenge?: boolean;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function Wordle({
  customWords,
  targetCount = 3,
  gateTitle,
  isGateChallenge = false,
  onSuccess,
  onClose,
}: WordleProps = {}) {
  const navigate = useNavigate();
  const student = useAuthStore((state) => state.student);
  const unlockLevel = useAuthStore((state) => state.unlockLevel);

  const [questions, setQuestions] = useState<typeof WORD_BANK>([]);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost' | 'completed'>('playing');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize randomized questions deterministically for student or use custom strata words
  useEffect(() => {
    if (customWords && customWords.length > 0) {
      setQuestions(customWords.slice(0, targetCount));
      return;
    }

    const seedString = student?.id || student?.name || 'default-seed';
    let seed = 0;
    for (let i = 0; i < seedString.length; i++) {
      seed += seedString.charCodeAt(i);
    }

    const shuffled = [...WORD_BANK];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom(seed++) * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    setQuestions(shuffled.slice(0, targetCount));
  }, [student, customWords, targetCount]);

  const targetWord = questions[currentQIdx]?.word || '';
  const currentHint = questions[currentQIdx]?.hint || '';
  const wordLength = targetWord.length || 5;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const onKeyPress = useCallback(
    (key: string) => {
      if (gameState !== 'playing') return;

      if (key === 'ENTER') {
        if (currentGuess.length !== wordLength) {
          retroAudio.playLocked();
          showToast(`Masukkan ${wordLength} huruf lengkap!`);
          return;
        }

        const newGuesses = [...guesses, currentGuess];
        setGuesses(newGuesses);
        setCurrentGuess('');

        if (currentGuess === targetWord) {
          retroAudio.playWin();
          setGameState('won');
        } else if (newGuesses.length >= MAX_GUESSES) {
          retroAudio.playLocked();
          setGameState('lost');
        } else {
          retroAudio.playSelect();
        }
      } else if (key === 'BACKSPACE' || key === 'DEL') {
        retroAudio.playHover();
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (/^[A-Z]$/.test(key) && currentGuess.length < wordLength) {
        retroAudio.playHover();
        setCurrentGuess((prev) => prev + key);
      }
    },
    [currentGuess, gameState, guesses, targetWord, wordLength]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onKeyPress('ENTER');
      } else if (e.key === 'Backspace') {
        onKeyPress('BACKSPACE');
      } else {
        const key = e.key.toUpperCase();
        if (/^[A-Z]$/.test(key)) {
          onKeyPress(key);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKeyPress]);

  const handleNextQuestion = () => {
    retroAudio.playSelect();
    if (currentQIdx < questions.length - 1) {
      setCurrentQIdx((p) => p + 1);
      setGuesses([]);
      setCurrentGuess('');
      setGameState('playing');
    } else {
      setGameState('completed');
      if (isGateChallenge) {
        onSuccess?.();
      } else {
        unlockLevel(2);
        // Record Level 1 submission to database / cloud
        submitLevelProgress({
          student_id: student?.id || 'std-1',
          student_name: student?.name || 'RESQ-Team',
          classroom_code: student?.classroom_id || 'RESQ-8A',
          level_number: 1,
          score: 100,
          details: {
            questions_solved: questions.length,
            words: questions.map((q) => q.word),
          },
        });
      }
    }
  };

  const handleRetryCurrent = () => {
    retroAudio.playSelect();
    setGuesses([]);
    setCurrentGuess('');
    setGameState('playing');
  };

  const handleRestartAll = () => {
    retroAudio.playSelect();
    setCurrentQIdx(0);
    setGuesses([]);
    setCurrentGuess('');
    setGameState('playing');
  };

  const getLetterStatus = (letter: string, index: number, word: string): GuessStatus => {
    if (word[index] === letter) return 'correct';
    if (word.includes(letter)) return 'present';
    return 'absent';
  };

  // Keyboard layout rows
  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DEL'],
  ];

  // Calculate used letter statuses
  const usedLetters: Record<string, GuessStatus> = {};
  guesses.forEach((guess) => {
    guess.split('').forEach((letter, i) => {
      const status = getLetterStatus(letter, i, targetWord);
      if (status === 'correct') {
        usedLetters[letter] = 'correct';
      } else if (status === 'present' && usedLetters[letter] !== 'correct') {
        usedLetters[letter] = 'present';
      } else if (status === 'absent' && !usedLetters[letter]) {
        usedLetters[letter] = 'absent';
      }
    });
  });

  if (questions.length === 0) {
    return (
      <div className="w-full text-center py-6 font-pixel text-amber-950 font-bold">
        Memuat Quest Geologi...
      </div>
    );
  }

  // ── ALL QUESTS COMPLETED SCREEN (BALANCED / PROPORSONAL) ──
  if (gameState === 'completed') {
    if (isGateChallenge) {
      return (
        <div
          className="w-full mx-auto my-auto flex flex-col items-center justify-center p-5 sm:p-6 bg-amber-100/95 rounded-2xl border-4 border-amber-950 shadow-[0_8px_0_#78350f] font-pixel animate-fade-in select-none text-center space-y-4"
          style={{ maxWidth: '480px' }}
        >
          <div className="p-3 bg-emerald-400 rounded-2xl border-3 border-amber-950 shadow-[0_4px_0_#064e3b] flex items-center justify-center animate-bounce-slight">
            <PixelTrophy size={64} showSparkles={true} />
          </div>

          <div className="space-y-1.5 w-full">
            <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-500 text-slate-950 font-pixel-title text-[10px] sm:text-xs border-2 border-amber-950 shadow">
              GERBANG TERBUKA!
            </span>
            <h3 className="font-pixel-title text-sm sm:text-base text-amber-950 pt-1">
              EVALUASI SEISMIK TUNTAS
            </h3>
            <p className="font-pixel text-xs text-amber-900 leading-relaxed font-medium">
              Kamu berhasil memecahkan seluruh kode geologi strata ini! Jalur turun menuju lapisan berikutnya kini telah terbuka.
            </p>
          </div>

          <button
            onClick={() => {
              retroAudio.playPowerup();
              onSuccess?.();
              onClose?.();
            }}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-emerald-50 font-pixel-title text-xs sm:text-sm border-3 border-amber-950 shadow-[0_4px_0_#064e3b] transition-transform active:translate-y-0.5 cursor-pointer text-center"
          >
            BUKA AKSES TURUN ▼
          </button>
        </div>
      );
    }

    if (onClose) {
      return (
        <div
          className="w-full mx-auto my-auto flex flex-col items-center justify-center p-5 sm:p-6 bg-amber-100/95 rounded-2xl border-4 border-amber-950 shadow-[0_8px_0_#78350f] font-pixel animate-fade-in select-none text-center space-y-4"
          style={{ maxWidth: '480px' }}
        >
          <div className="p-3 bg-amber-400 rounded-2xl border-3 border-amber-950 shadow-[0_4px_0_#78350f] flex items-center justify-center animate-bounce-slight">
            <PixelTrophy size={64} showSparkles={true} />
          </div>

          <div className="space-y-1.5 w-full">
            <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-500 text-slate-950 font-pixel-title text-[10px] sm:text-xs border-2 border-amber-950 shadow">
              MINI CHALLENGE SELESAI!
            </span>
            <h3 className="font-pixel-title text-sm sm:text-base text-amber-950 pt-1">
              PEMAHAMAN GEOLOGI TERCATAT
            </h3>
            <p className="font-pixel text-xs text-amber-900 leading-relaxed font-medium">
              Kamu berhasil menjawab seluruh teka-teki geologi pada temuan ini! Pengetahuanmu tentang dinamika bumi semakin mendalam.
            </p>
          </div>

          <button
            onClick={() => {
              retroAudio.playPowerup();
              onSuccess?.();
              onClose();
            }}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-emerald-50 font-pixel-title text-xs sm:text-sm border-3 border-amber-950 shadow-[0_4px_0_#064e3b] transition-transform active:translate-y-0.5 cursor-pointer text-center"
          >
            KEMBALI KE PENJELAJAHAN ➔
          </button>
        </div>
      );
    }

    return (
      <div
        className="w-full mx-auto my-auto flex flex-col items-center justify-center p-5 sm:p-6 bg-amber-100/95 rounded-2xl border-4 border-amber-950 shadow-[0_8px_0_#78350f] font-pixel animate-fade-in select-none text-center space-y-3.5"
        style={{ maxWidth: '480px' }}
      >

        {/* Pixel Trophy */}
        <div className="p-3 bg-amber-400 rounded-2xl border-3 border-amber-950 shadow-[0_4px_0_#78350f] flex items-center justify-center animate-bounce-slight">
          <PixelTrophy size={72} showSparkles={true} />
        </div>

        {/* Victory Header */}
        <div className="space-y-1.5 w-full">
          <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-500 text-slate-950 font-pixel-title text-[10px] sm:text-xs border-2 border-amber-950 shadow">
            STAGE 1 CLEARED
          </span>
          <h3 className="font-pixel-title text-sm sm:text-base text-amber-950 pt-1">
            SELAMAT, MISI SELESAI!
          </h3>
        </div>

        {/* Compact Result Card */}
        <div className="w-full p-3.5 bg-white/95 rounded-xl border-2 border-amber-950/30 shadow-sm space-y-2.5 text-center">
          <p className="text-xs sm:text-sm text-amber-950 font-pixel font-bold leading-relaxed">
            Kamu telah menguasai <span className="text-amber-800 font-extrabold">Struktur Lapisan Bumi</span> &amp; <span className="text-amber-800 font-extrabold">Dinamika Lempeng Tektonik</span>!
          </p>
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-amber-950/20 text-[10px] sm:text-xs text-amber-950 font-bold">
            <span className="bg-amber-100 py-1.5 px-2 rounded-lg border border-amber-950/30 truncate">
              Bab 1 &amp; 2
            </span>
            <span className="bg-amber-100 py-1.5 px-2 rounded-lg border border-amber-950/30 truncate">
              Wordle: 3/3
            </span>
            <span className="bg-emerald-200 text-emerald-950 py-1.5 px-2 rounded-lg border border-emerald-950/30 font-bold truncate">
              Level 2 Buka
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2 pt-1">
          <button
            onClick={() => {
              retroAudio.playSelect();
              navigate('/level2');
            }}
            className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-pixel-title text-xs sm:text-sm border-3 border-amber-950 shadow-[0_4px_0_#064e3b] transition-transform active:translate-y-0.5 cursor-pointer text-center"
          >
            LANJUT KE LEVEL 2
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                retroAudio.playSelect();
                navigate('/');
              }}
              className="flex-1 py-2.5 px-3 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-950 font-pixel font-bold text-xs border-2 border-amber-950 shadow-[0_2px_0_#78350f] cursor-pointer"
            >
              MENU UTAMA
            </button>

            <button
              onClick={handleRestartAll}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-200 font-pixel font-bold text-xs border-2 border-slate-950 shadow-[0_2px_0_#0f172a] cursor-pointer whitespace-nowrap"
              title="Mainkan Ulang Quest"
            >
              ULANG
            </button>
          </div>
        </div>

      </div>
    );
  }

  // ── GAMEPLAY SCREEN (BALANCED / PROPORSONAL KE LEBAR & TINGGI) ──
  return (
    <div
      className="w-full mx-auto flex flex-col items-center gap-3 select-none font-pixel text-amber-950"
      style={{ maxWidth: '540px' }}
    >

      {/* ── Header: Quest Title & Progress Indicator ── */}
      <div className="w-full flex items-center justify-between pb-2 border-b-2 border-amber-950/20">
        <div className="flex items-center gap-2">
          <span className="">
            {isGateChallenge ? '' : 'QUEST'}
          </span>
          <span className="font-pixel-title text-xs sm:text-sm text-amber-950">
            {gateTitle || `KATA GEOLOGI (SOAL ${currentQIdx + 1} / ${questions.length})`}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {questions.map((_, idx) => (
            <span
              key={idx}
              className={`w-4 h-4 rounded border-2 border-amber-950 flex items-center justify-center text-[9px] font-bold ${idx < currentQIdx
                ? 'bg-emerald-500 text-white'
                : idx === currentQIdx
                  ? 'bg-amber-400 text-amber-950 animate-pulse'
                  : 'bg-amber-100 text-amber-800'
                }`}
            >
              {idx + 1}
            </span>
          ))}
          {onClose && (
            <button
              onClick={() => {
                retroAudio.playSelect();
                onClose();
              }}
              className="ml-2 w-6 h-6 rounded bg-amber-950/20 hover:bg-amber-950/40 text-amber-950 font-bold text-xs flex items-center justify-center cursor-pointer"
              title="Tutup"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── Compact Clue Box ── */}
      <div className="w-full py-2 px-3 bg-amber-100/90 rounded-xl border-2 border-amber-950/30 flex items-center gap-2 shadow-inner text-left">
        <span className="px-1.5 py-0.5 rounded bg-amber-900 text-amber-200 text-[9px] font-bold uppercase shrink-0">
          PETUNJUK
        </span>
        <p className="text-xs text-amber-950 font-bold leading-snug truncate sm:whitespace-normal">
          "{currentHint}"
        </p>
      </div>

      {/* ── Compact Dynamic Wordle Grid ── */}
      <div className="flex flex-col gap-1 my-0.5">
        {Array.from({ length: MAX_GUESSES }).map((_, rowIdx) => {
          const isCurrentRow = rowIdx === guesses.length;
          const guess = guesses[rowIdx] || (isCurrentRow ? currentGuess : '');

          return (
            <div key={rowIdx} className="flex gap-1 justify-center">
              {Array.from({ length: wordLength }).map((_, colIdx) => {
                const letter = guess[colIdx] || '';
                let tileBg = 'bg-amber-50 border-amber-950/40 text-amber-950';

                if (rowIdx < guesses.length) {
                  const status = getLetterStatus(letter, colIdx, targetWord);
                  if (status === 'correct') {
                    tileBg = 'bg-emerald-500 border-emerald-950 text-slate-950 shadow-[0_2px_0_#064e3b] font-bold';
                  } else if (status === 'present') {
                    tileBg = 'bg-amber-400 border-amber-950 text-slate-950 shadow-[0_2px_0_#78350f] font-bold';
                  } else {
                    tileBg = 'bg-slate-700 border-slate-950 text-slate-300 shadow-inner font-bold';
                  }
                } else if (isCurrentRow && letter) {
                  tileBg = 'bg-amber-200 border-amber-950 text-amber-950 scale-105 shadow-[0_2px_0_#78350f]';
                }

                // Dynamic responsive tile sizing based on word length
                const sizeClass =
                  wordLength <= 5
                    ? 'w-9 h-9 sm:w-10 sm:h-10 text-sm sm:text-base'
                    : wordLength === 6
                      ? 'w-8 h-8 sm:w-9 sm:h-9 text-xs sm:text-sm'
                      : wordLength === 7
                        ? 'w-7 h-8 sm:w-8 sm:h-9 text-[11px] sm:text-xs'
                        : 'w-6 h-7 sm:w-7 sm:h-8 text-[10px] sm:text-xs';

                return (
                  <div
                    key={colIdx}
                    className={`${sizeClass} rounded-lg border-2 flex items-center justify-center font-pixel-title transition-all ${tileBg}`}
                  >
                    {letter}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* ── Toast Alert ── */}
      {toastMessage && (
        <div className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold text-xs border-2 border-rose-950 animate-bounce-slight shadow">
          {toastMessage}
        </div>
      )}

      {/* ── Outcome Banners ── */}
      {gameState === 'won' && (
        <div className="w-full py-1.5 px-3 bg-emerald-100 border-2 border-emerald-700 rounded-xl flex items-center justify-between gap-2 animate-fade-in shadow text-left">
          <div>
            <span className="font-pixel-title text-xs text-emerald-900 block">
              BENAR! KATA: {targetWord}
            </span>
            <span className="text-[10px] text-emerald-800">
              Selesai dalam {guesses.length} percobaan!
            </span>
          </div>
          <button
            onClick={handleNextQuestion}
            className="py-1.5 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-pixel-title text-[11px] border-2 border-emerald-950 shadow-[0_2px_0_#064e3b] cursor-pointer whitespace-nowrap"
          >
            {currentQIdx < questions.length - 1 ? 'SOAL BERIKUTNYA' : 'SELESAI'}
          </button>
        </div>
      )}

      {gameState === 'lost' && (
        <div className="w-full py-1.5 px-3 bg-rose-100 border-2 border-rose-700 rounded-xl flex items-center justify-between gap-2 animate-fade-in shadow text-left">
          <div>
            <span className="font-pixel-title text-xs text-rose-900 block">
              KESEMPATAN HABIS! KATA: {targetWord}
            </span>
            <span className="text-[10px] text-rose-800">
              Coba pecahkan kembali kata ini!
            </span>
          </div>
          <button
            onClick={handleRetryCurrent}
            className="py-1.5 px-3 rounded-lg bg-rose-500 hover:bg-rose-400 text-white font-pixel-title text-[11px] border-2 border-rose-950 shadow-[0_2px_0_#881337] cursor-pointer whitespace-nowrap"
          >
            COBA LAGI
          </button>
        </div>
      )}

      {/* ── Compact On-Screen Pixel Keyboard ── */}
      <div className="w-full flex flex-col gap-1 pt-0.5">
        {keyboardRows.map((row, rIdx) => (
          <div key={rIdx} className="flex justify-center gap-1">
            {row.map((k) => {
              const status = usedLetters[k];
              let keyBg = 'bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-950/40 shadow-[0_1.5px_0_#78350f]';
              if (status === 'correct') {
                keyBg = 'bg-emerald-500 text-slate-950 font-bold border-emerald-950 shadow-[0_1.5px_0_#064e3b]';
              } else if (status === 'present') {
                keyBg = 'bg-amber-400 text-slate-950 font-bold border-amber-950 shadow-[0_1.5px_0_#78350f]';
              } else if (status === 'absent') {
                keyBg = 'bg-slate-700 text-slate-400 border-slate-950 opacity-60';
              }

              const isActionKey = k === 'ENTER' || k === 'DEL';

              return (
                <button
                  key={k}
                  onClick={() => onKeyPress(k)}
                  className={`py-1.5 rounded-lg border-2 font-bold text-xs transition-transform active:translate-y-0.5 cursor-pointer ${isActionKey ? 'px-2 sm:px-2.5 text-[10px]' : 'px-1.5 sm:px-2 flex-1 max-w-[36px]'
                    } ${keyBg}`}
                >
                  {k}
                </button>
              );
            })}
          </div>
        ))}
      </div>

    </div>
  );
}
