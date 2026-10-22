// ── src/app/Level2/CrosswordModal.tsx ────────────────────────────────
// Modal Teka-Teki Silang (TTS) Mitigasi Geologis Level 2
// Area 1: Mitigasi Gempa Bumi & Area 2: Mitigasi Erupsi Merapi
// Evaluasi akhir zona sebelum gerbang terbuka menuju area berikutnya atau kelulusan level

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import PixelIcon from '../../components/PixelIcon';
import { retroAudio } from '../../utils/retroAudio';

// Bank grid TTS: tiap area punya beberapa varian, dan satu varian diundi per
// siswa supaya seluruh angkatan tidak mengisi teka-teki yang sama persis.
import { varianTTS, petunjukTTSUntuk, type ClueTTS, type GridTTS } from './bankTTS';

interface CrosswordModalProps {
  areaIndex?: number;
  /**
   * Id siswa. Dulu dipakai mengundi grid; kini hanya memilih redaksi petunjuk
   * (lihat `petunjukTTSUntuk`). Tidak lagi menentukan soal mana yang tampil.
   */
  userId?: string;
  onSuccess: () => void;
  onClose: () => void;
}

/**
 * Satu soal TTS. Dipanggil bergantian oleh `CrosswordModal` untuk soal 1..5.
 *
 * Dipisah menjadi komponen sendiri dan diberi `key` per nomor soal, sehingga
 * seluruh state isian (huruf, sel aktif, status selesai) otomatis direset saat
 * pindah soal — tanpa perlu membersihkan state satu per satu.
 */
interface PuzzleSatuProps {
  gridDasar: GridTTS;
  areaIndex: number;
  userId: string;
  nomorSoal: number;
  totalSoal: number;
  labelLanjut: string;
  onLanjut: () => void;
  onClose: () => void;
}

function PuzzleSatu({
  gridDasar,
  areaIndex,
  userId,
  nomorSoal,
  totalSoal,
  labelLanjut,
  onLanjut,
  onClose,
}: PuzzleSatuProps) {
  // Grid DIUNDI per siswa (lihat bankTTS.ts). Hasilnya berbeda antar-siswa,
  // tetapi tetap sama bila siswa yang sama membuka ulang area ini — sehingga
  // tidak ada yang bisa "mengundi ulang" dengan me-refresh halaman.
  //
  // Sebelumnya clues/rows/cols ditulis tetap dalam rantai ternary di sini,
  // sehingga seluruh siswa di seluruh angkatan mengisi teka-teki yang sama.
  // Grid DAN redaksi petunjuknya diundi per siswa: dua siswa yang kebetulan
  // mendapat kata yang sama tetap membaca kalimat soal yang berbeda, sehingga
  // menyalin jawaban tidak lagi berguna - sementara kuncinya tetap sama.
  // Grid sudah ditentukan induk (soal ke-`nomorSoal`); di sini hanya redaksi
  // petunjuknya yang dipilih. Tetap memakai useMemo agar tidak dihitung ulang
  // pada setiap ketukan tombol.
  const gridTerpilih = useMemo(
    () => ({
      ...gridDasar,
      clues: gridDasar.clues.map((c) => ({
        ...c,
        clue: petunjukTTSUntuk(c, areaIndex, userId),
      })),
    }),
    [gridDasar, areaIndex, userId],
  );

  const clues = useMemo(() => gridTerpilih?.clues ?? [], [gridTerpilih]);
  const rows = gridTerpilih?.rows ?? 10;
  const cols = gridTerpilih?.cols ?? 12;
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
  /**
   * Memproses satu tombol: huruf A-Z, atau 'HAPUS'.
   *
   * Dulu logika ini hanya ada di dalam pendengar `keydown`, sehingga TTS HANYA
   * bisa diisi memakai papan ketik fisik. Akibatnya di HP/tablet — yang tidak
   * punya papan ketik — teka-teki sama sekali tidak bisa diisi. Sekarang logika
   * yang sama dipakai kibor fisik DAN kibor layar di bawah papan.
   */
  const prosesTombol = useCallback(
    (tombol: string) => {
      if (isCompleted) return;

      const activeClue = clues.find((c) => c.id === activeClueId);
      if (!activeClue) return;

      const cellKey = `${selectedCell.r}-${selectedCell.c}`;

      if (tombol === 'HAPUS') {
        retroAudio.playHover();
        setGrid((prev) => ({ ...prev, [cellKey]: '' }));
        if (activeClue.direction === 'across') {
          const prevC = selectedCell.c - 1;
          if (prevC >= activeClue.startCol) setSelectedCell({ r: selectedCell.r, c: prevC });
        } else {
          const prevR = selectedCell.r - 1;
          if (prevR >= activeClue.startRow) setSelectedCell({ r: prevR, c: selectedCell.c });
        }
        return;
      }

      if (!/^[A-Z]$/.test(tombol)) return;

      retroAudio.playSelect();
      setGrid((prev) => ({ ...prev, [cellKey]: tombol }));
      setValidationError(null);

      // Maju ke kotak berikutnya pada arah petunjuk yang sedang aktif.
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
    },
    [activeClueId, selectedCell, isCompleted, clues],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        e.preventDefault();
        prosesTombol('HAPUS');
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
        prosesTombol(e.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prosesTombol]);

  // Select Clue
  const handleSelectClue = (clue: ClueTTS) => {
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
      // playError() tidak mengembalikan nilai, sehingga `??` versi lama selalu
      // melanjutkan ke playHover(). Keduanya tetap dipanggil supaya bunyi yang
      // terdengar persis sama seperti sebelumnya.
      if (retroAudio.playError) retroAudio.playError();
      retroAudio.playHover();
      setValidationError('Masih ada huruf yang belum tepat! Periksa kembali petunjuknya.');
    }
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm select-none animate-fadeIn font-pixel outline-none"
    >
      <div className="relative w-full max-w-4xl xl:max-w-5xl bg-[#fef3c7] border-4 border-[#451a03] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-[0_16px_0_#1c0d02] text-[#451a03] max-h-[96vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-3 border-[#78350f] pb-3 mb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#b45309]/20 border-2 border-[#b45309] flex items-center justify-center shrink-0">
              <PixelIcon name="key" size={24} className="text-[#92400e]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#451a03] font-pixel-title font-bold">
                {areaIndex === 5
                  ? 'TEKA-TEKI SILANG: PASCABENCANA ERUPSI MERAPI'
                  : areaIndex === 3
                    ? 'TEKA-TEKI SILANG: PRABENCANA ERUPSI MERAPI'
                    : areaIndex === 2
                      ? 'TEKA-TEKI SILANG: PASCABENCANA & TITIK KUMPUL'
                      : areaIndex === 1
                        ? 'TEKA-TEKI SILANG: SIMULASI GEMPA BUMI'
                        : 'TEKA-TEKI SILANG: MITIGASI GEMPA BUMI'}
              </h2>
              {/* Penanda soal ke berapa, karena tiap area berisi 5 soal
                  (BANK SOAL RESQ-BOX) yang dikerjakan bergantian. */}
              <p className="text-[11px] sm:text-xs text-[#92400e] font-semibold mt-0.5">
                Soal {nomorSoal} dari {totalSoal}
              </p>
            </div>
          </div>
          <button aria-label="Tutup"
            onClick={() => {
              retroAudio.playSelect();
              onClose();
            }}
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#b45309] hover:bg-[#92400e] text-amber-100 border-2 border-[#451a03] font-pixel-title text-[15px] sm:text-base flex items-center justify-center cursor-pointer active:translate-y-0.5 shadow-[0_2px_0_#451a03] shrink-0 font-medium"
            title="Tutup"
          >
            <PixelIcon name="cross" size={16} />
          </button>
        </div>

        {/* ── CARA MENGISI ── */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-amber-100/90 border-2 border-[#b45309]/40 mb-4 text-[#291305] font-sans">
          <p className="text-[13px] sm:text-sm font-black uppercase tracking-wide text-[#92400e] mb-1.5">
            Cara mengisi teka-teki
          </p>
          <ol className="text-[14px] sm:text-[15px] md:text-base font-semibold leading-relaxed list-decimal pl-5 space-y-0.5">
            <li>
              Ketuk salah satu <strong>PETUNJUK KATA</strong> — kotak jawabannya
              langsung menyala. Bisa juga langsung mengetuk kotak bernomor.
            </li>
            <li>
              <strong>Ketik hurufnya</strong>. Di laptop pakai papan ketik; di HP
              pakai tombol huruf di bawah papan.
            </li>
            <li>
              Isi <strong>semua</strong> kata, lalu tekan <strong>CEK JAWABAN</strong>.
            </li>
          </ol>
          <p className="text-[12.5px] sm:text-[13.5px] text-[#78350f] font-semibold mt-1.5 leading-snug">
            <strong>MENURUN</strong> = jawaban ditulis tegak ke bawah ·{' '}
            <strong>MENDATAR</strong> = ditulis ke samping. Angka kecil di kotak
            adalah nomor petunjuknya.
          </p>
        </div>

        {/* Main Content Layout: Crossword Grid (Left) + Clues List (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 mb-4 items-start">
          {/* ── CROSSWORD GRID (7 cols on desktop) ── */}
          <div className="lg:col-span-7 bg-[#0f172a] p-4 sm:p-5 rounded-2xl border-3 sm:border-4 border-[#451a03] shadow-inner flex flex-col items-center justify-center overflow-x-auto">
            <div
              className="grid gap-1.5 sm:gap-2"
              style={{
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                width: '100%',
                maxWidth: areaIndex === 3 ? '540px' : areaIndex === 2 ? '500px' : areaIndex === 1 ? '480px' : '540px',
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
                        className="aspect-square bg-slate-900/60 rounded-md"
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
                      className={`relative aspect-square rounded-lg border-2 sm:border-3 font-pixel-title text-base sm:text-lg md:text-xl font-bold flex items-center justify-center transition-all cursor-pointer ${isSelected
                        ? 'bg-amber-400 text-amber-950 border-amber-300 ring-3 ring-amber-400 scale-105 z-10 shadow-lg'
                        : letter
                          ? 'bg-[#fef3c7] text-[#451a03] border-amber-600 shadow-xs'
                          : 'bg-slate-800 text-slate-100 border-slate-600 hover:border-amber-400'
                        }`}
                    >
                      {clueNumber && (
                        <span className="absolute top-0.5 left-1 text-[12.5px] sm:text-[14.5px] text-amber-500 font-bold leading-none pointer-events-none">
                          {clueNumber}
                        </span>
                      )}
                      <span>{letter}</span>
                    </button>
                  );
                })
              )}
            </div>

            {/* ── KIBOR LAYAR ──────────────────────────────────────────────
                Wajib ada. Tanpa ini teka-teki TIDAK BISA diisi di HP/tablet,
                karena perangkat sentuh tidak punya papan ketik fisik sedangkan
                masukan sebelumnya hanya ditangkap dari `keydown` jendela. */}
            <div className="mt-3 w-full max-w-[540px] space-y-1.5 select-none">
              {(
                [
                  'QWERTYUIOP'.split(''),
                  'ASDFGHJKL'.split(''),
                  ['HAPUS', ...'ZXCVBNM'.split('')],
                ] as string[][]
              ).map((baris, bi) => (
                <div key={bi} className="flex justify-center gap-1 sm:gap-1.5">
                  {baris.map((k) => (
                    <button
                      key={k}
                      onClick={() => prosesTombol(k)}
                      aria-label={k === 'HAPUS' ? 'Hapus huruf' : `Huruf ${k}`}
                      className={`rounded-md border-2 border-[#451a03] font-pixel-title font-bold cursor-pointer active:translate-y-0.5 shadow-[0_2px_0_#451a03] transition-colors ${
                        k === 'HAPUS'
                          ? 'flex-[1.6] bg-[#b45309] hover:bg-[#92400e] text-amber-50 text-[11px] sm:text-xs py-2'
                          : 'flex-1 bg-[#fde68a] hover:bg-[#fcd34d] text-[#451a03] text-[13px] sm:text-sm py-2'
                      }`}
                    >
                      {k === 'HAPUS' ? '⌫ HAPUS' : k}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* ── CLUES LIST (5 cols on desktop) ── */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-[13px] sm:text-[15px] md:text-base font-pixel-title text-[#b45309] block uppercase tracking-wider font-bold">
              PETUNJUK KATA:
            </span>
            {clues.map((clue) => {
              const isActive = activeClueId === clue.id;
              return (
                <button
                  key={clue.id}
                  onClick={() => handleSelectClue(clue)}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-xl border-2 sm:border-3 transition-all cursor-pointer block ${isActive
                    ? 'bg-amber-600 text-white border-amber-950 shadow-[0_3px_0_#451a03] -translate-y-0.5'
                    : 'bg-[#fffbeb] hover:bg-[#fde68a] text-[#451a03] border-[#b45309]/40'
                    }`}
                >
                  <div className="flex items-center gap-2 mb-1.5 font-pixel-title text-[13px] sm:text-[15px] font-semibold">
                    <span
                      className={`px-2.5 py-0.5 rounded-md font-bold ${isActive ? 'bg-amber-800 text-amber-200' : 'bg-[#b45309]/20 text-[#b45309]'
                        }`}
                    >
                      {clue.number} {clue.direction === 'across' ? 'MENDATAR' : 'MENURUN'}
                    </span>
                    <span className="opacity-80 font-bold">({clue.answer.length} HURUF)</span>
                  </div>
                  <p className={`text-[15px] sm:text-base md:text-[18px] leading-relaxed font-sans ${isActive ? 'text-white font-bold' : 'text-[#291305] font-semibold'}`}>
                    {clue.clue}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-100 border-2 border-rose-500 text-rose-900 text-[15px] sm:text-base font-bold text-center">
            {validationError}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-3 border-t-2 border-[#b45309]/30">
          <div className="flex items-center gap-1.5 text-[13px] text-[#78350f] font-semibold">
          </div>

          {!isCompleted ? (
            <button aria-label="Lanjutkan"
              onClick={handleCheckSolution}
              className="px-7 sm:px-9 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-50 border-3 border-[#451a03] shadow-[0_4px_0_#231206] text-[15px] sm:text-base md:text-lg font-pixel-title cursor-pointer active:translate-y-0.5 flex items-center gap-2.5 font-bold"
            >
              <PixelIcon name="check" size={18} className="text-amber-200" />
              <span>CEK JAWABAN</span>
            </button>
          ) : (
            <button
              onClick={() => {
                retroAudio.playSelect();
                onLanjut();
              }}
              className="px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white border-3 border-emerald-950 shadow-[0_4px_0_#064e3b] text-[15px] sm:text-base md:text-lg font-pixel-title cursor-pointer active:translate-y-0.5 flex items-center gap-2.5 animate-bounce font-bold"
            >
              <PixelIcon name="unlock" size={18} />
              <span>{labelLanjut}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Induk TTS Level 2.
 *
 * BANK SOAL RESQ-BOX memecah evaluasi tiap area menjadi 5 SOAL kecil, bukan
 * satu teka-teki besar. Karena itu modal ini menampilkan soal 1..5 bergantian,
 * dan `onSuccess` baru dipanggil setelah soal TERAKHIR selesai.
 *
 * Area yang tidak punya grid di bank (area 2 dan 5 — keduanya area simulasi)
 * tidak pernah membuka modal ini; alurnya ditangani TectonicGame.
 */
export default function CrosswordModal({
  areaIndex = 0,
  userId = 'guest',
  onSuccess,
  onClose,
}: CrosswordModalProps) {
  const daftarSoal = useMemo(() => varianTTS(areaIndex), [areaIndex]);
  const [soalIndex, setSoalIndex] = useState(0);

  const gridDasar = daftarSoal[soalIndex];
  if (!gridDasar) return null;

  const terakhir = soalIndex + 1 >= daftarSoal.length;

  return (
    <PuzzleSatu
      key={`${areaIndex}-${soalIndex}`}
      gridDasar={gridDasar}
      areaIndex={areaIndex}
      userId={userId ?? 'guest'}
      nomorSoal={soalIndex + 1}
      totalSoal={daftarSoal.length}
      labelLanjut={
        terakhir
          ? areaIndex === 5
            ? 'SELESAIKAN EKSPEDISI LEVEL 2!'
            : 'BUKA GERBANG KE AREA SELANJUTNYA!'
          : `LANJUT KE SOAL ${soalIndex + 2}`
      }
      onLanjut={() => {
        if (terakhir) onSuccess();
        else setSoalIndex(soalIndex + 1);
      }}
      onClose={onClose}
    />
  );
}
