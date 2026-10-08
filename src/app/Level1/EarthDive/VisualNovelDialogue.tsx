// ── src/app/Level1/EarthDive/VisualNovelDialogue.tsx ──────────────────────────
// Komponen Dialog Visual Novel Interaktif RPG Level 1
// Menampilkan potret NPC di kiri & potret pemain di kanan (100% transparan tanpa kotak background),
// palet warna tenang dan elegan (tidak gonjreng), animasi ketik typewriter, micro-bounce, dan pilihan respons RPG.

import { useState, useEffect, useRef, useCallback } from 'react';
import type { DialogueTree, DialogueNode, CharacterProfile, DialogueChoice } from './dialogueData';
import { CHARACTER_PROFILES } from './dialogueData';
import { getNpcPortrait, getPlayerPortrait } from './engine/npcSprites';
import type { CustomAvatarConfig } from '../../../store/teacherStore';
import { retroAudio } from '../../../utils/retroAudio';
import PixelIcon from '../../../components/PixelIcon';

interface VisualNovelDialogueProps {
  dialogueTree: DialogueTree;
  playerName: string;
  avatarConfig?: CustomAvatarConfig;
  zoneId?: string;
  onClose: () => void;
  onMarkDiscovery?: (discoveryId: string) => void;
  onTriggerDiscovery?: (discoveryId: number) => void;
  onTriggerChallenge?: () => void;
}

export default function VisualNovelDialogue({
  dialogueTree,
  playerName,
  avatarConfig,
  zoneId,
  onClose,
  onMarkDiscovery,
  onTriggerDiscovery,
  onTriggerChallenge,
}: VisualNovelDialogueProps) {
  const [currentNodeId, setCurrentNodeId] = useState(dialogueTree.startNodeId);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [bounceActive, setBounceActive] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [historyLog, setHistoryLog] = useState<{ speaker: string; text: string; color: string }[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Canvas refs untuk portrait preview
  const npcCanvasRef = useRef<HTMLCanvasElement>(null);
  const playerCanvasRef = useRef<HTMLCanvasElement>(null);
  const typingTimerRef = useRef<number>(0);
  const autoPlayTimerRef = useRef<number>(0);

  const currentNode: DialogueNode | undefined = dialogueTree.nodes[currentNodeId];
  const rawSpeakerProfile: CharacterProfile =
    (currentNode && CHARACTER_PROFILES[currentNode.speakerId]) || CHARACTER_PROFILES.prof_raditya;
  const speakerProfile: CharacterProfile = {
    ...rawSpeakerProfile,
    name: rawSpeakerProfile.role === 'player' ? playerName || rawSpeakerProfile.name : rawSpeakerProfile.name,
  };

  const isNpcSpeaking = speakerProfile.role !== 'player';

  // Lawan bicara NPC di sebelah kiri selalu merupakan NPC percakapan ini
  const npcSpeakerId =
    dialogueTree.npcSpeakerId ||
    Object.values(dialogueTree.nodes).find((n) => n.speakerId !== 'player')?.speakerId ||
    'prof_raditya';
  const npcProfile = CHARACTER_PROFILES[npcSpeakerId] || CHARACTER_PROFILES.prof_raditya;

  // ── RENDER POTRET KARAKTER KE CANVAS PREVIEW (100% TRANSPARAN TANPA KOTAK BACKGROUND) ──
  const drawPortraits = useCallback(() => {
    // 1. Gambar NPC Portrait (Kiri)
    if (npcCanvasRef.current) {
      const cvs = npcCanvasRef.current;
      const ctx = cvs.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        const srcCvs = getNpcPortrait(npcProfile.portraitType, zoneId);
        ctx.drawImage(srcCvs, 0, 0, cvs.width, cvs.height);
      }
    }

    // 2. Gambar Player Portrait (Kanan)
    if (playerCanvasRef.current) {
      const cvs = playerCanvasRef.current;
      const ctx = cvs.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        const playerSrc = getPlayerPortrait(avatarConfig, zoneId);
        ctx.drawImage(playerSrc, 0, 0, cvs.width, cvs.height);
      }
    }
  }, [npcProfile.portraitType, avatarConfig, zoneId]);

  useEffect(() => {
    drawPortraits();
    const rafId = requestAnimationFrame(drawPortraits);
    return () => cancelAnimationFrame(rafId);
  }, [drawPortraits, currentNodeId, dialogueTree.id]);

  // ── LOGIKA TYPEWRITER ANIMASI TEKS ──
  useEffect(() => {
    if (!currentNode) return;

    const fullText = currentNode.text;
    setDisplayedText('');
    setIsTyping(true);

    // Trigger subtle micro-bounce animation pada pembicara
    setBounceActive(true);
    const bounceTimer = window.setTimeout(() => setBounceActive(false), 420);

    // Tandai discovery jika ada
    if (currentNode.discoveryIdToMark && onMarkDiscovery) {
      onMarkDiscovery(currentNode.discoveryIdToMark);
    }

    // Catat ke log histori percakapan
    setHistoryLog((prev) => [
      ...prev,
      {
        speaker: speakerProfile.name,
        text: fullText,
        color: speakerProfile.nameColor,
      },
    ]);

    let charIndex = 0;
    window.clearInterval(typingTimerRef.current);

    typingTimerRef.current = window.setInterval(() => {
      charIndex++;
      setDisplayedText(fullText.slice(0, charIndex));

      if (charIndex % 3 === 0) {
        retroAudio.playSelect();
      }

      if (charIndex >= fullText.length) {
        window.clearInterval(typingTimerRef.current);
        setIsTyping(false);
      }
    }, 22);

    return () => {
      window.clearInterval(typingTimerRef.current);
      window.clearTimeout(autoPlayTimerRef.current);
      window.clearTimeout(bounceTimer);
    };
  }, [currentNodeId, currentNode, speakerProfile.name, speakerProfile.nameColor, onMarkDiscovery]);

  // Jika node saat ini tidak ditemukan di pohon dialog, tutup secara aman agar game tidak stuck
  useEffect(() => {
    if (!currentNode) {
      console.warn(`[VisualNovelDialogue] Current node "${currentNodeId}" not found in tree "${dialogueTree.id}". Closing dialogue safely.`);
      onClose();
    }
  }, [currentNode, currentNodeId, dialogueTree.id, onClose]);

  // ── AUTO PLAY EFFECT ──
  useEffect(() => {
    if (autoPlay && !isTyping && currentNode?.nextNodeId && !currentNode?.choices) {
      autoPlayTimerRef.current = window.setTimeout(() => {
        handleAdvance();
      }, 2500);
    }
    return () => window.clearTimeout(autoPlayTimerRef.current);
  }, [autoPlay, isTyping, currentNode]);

  // ── ADVANCE / SKIP TYPEWRITER ──
  const handleAdvance = () => {
    // 1. Jika teks masih mengetik, selesaikan ketikan seketika
    if (isTyping && currentNode) {
      window.clearInterval(typingTimerRef.current);
      setDisplayedText(currentNode.text);
      setIsTyping(false);
      retroAudio.playSelect();
      return;
    }

    // 2. Jika ada pilihan percabangan, pemain harus memilih salah satu tombol
    if (currentNode?.choices && currentNode.choices.length > 0) {
      return;
    }

    // 3. Jika ada node berikutnya, lanjutkan
    if (currentNode?.nextNodeId) {
      if (!dialogueTree.nodes[currentNode.nextNodeId]) {
        console.warn(`[VisualNovelDialogue] Next node "${currentNode.nextNodeId}" not found in tree "${dialogueTree.id}". Closing dialogue.`);
        retroAudio.playPowerup();
        onClose();
        return;
      }
      retroAudio.playSelect();
      setCurrentNodeId(currentNode.nextNodeId);
      return;
    }

    // 4. Jika sudah akhir dialog, cek apakah ada trigger modal / challenge lalu tutup
    if (currentNode?.discoveryIdToMark && onMarkDiscovery) {
      onMarkDiscovery(currentNode.discoveryIdToMark);
    }
    if (currentNode?.triggerDiscoveryModal !== undefined && onTriggerDiscovery) {
      onTriggerDiscovery(currentNode.triggerDiscoveryModal);
    }
    if (currentNode?.triggerChallengeGate && onTriggerChallenge) {
      onTriggerChallenge();
    }
    retroAudio.playPowerup();
    onClose();
  };

  // ── MEMILIH OPSI PERCABANGAN ──
  const handleChoiceClick = (choice: DialogueChoice) => {
    retroAudio.playSelect();
    if (choice.discoveryIdToMark && onMarkDiscovery) {
      onMarkDiscovery(choice.discoveryIdToMark);
    }
    if (choice.triggerDiscoveryModal !== undefined && onTriggerDiscovery) {
      onClose();
      onTriggerDiscovery(choice.triggerDiscoveryModal);
      return;
    }
    if (choice.triggerChallengeGate && onTriggerChallenge) {
      onClose();
      onTriggerChallenge();
      return;
    }
    if (!dialogueTree.nodes[choice.nextNodeId]) {
      console.warn(`[VisualNovelDialogue] Target node "${choice.nextNodeId}" not found in tree "${dialogueTree.id}". Closing dialogue.`);
      onClose();
      return;
    }
    setCurrentNodeId(choice.nextNodeId);
  };

  // ── KEYBOARD SHORTCUTS ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showHistory) {
        if (e.code === 'Escape') {
          e.preventDefault();
          setShowHistory(false);
        }
        return;
      }
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleAdvance();
      } else if (e.code === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  if (!currentNode) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-[2px] select-none animate-fadeIn font-pixel">

      {/* ── HISTORI MODAL (JIKA DIBUKA DARI TOOLBAR) ── */}
      {showHistory && (
        <div className="absolute inset-4 md:inset-12 z-50 bg-slate-950/95 border border-slate-700 rounded-2xl p-4 sm:p-6 flex flex-col shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <h3 className="text-slate-200 text-[13px] sm:text-[15px] font-bold tracking-wider flex items-center gap-2">
              <PixelIcon name="book" size={14} className="text-amber-400" /> RIWAYAT PERCAKAPAN
            </h3>
            <button
              type="button"
              onClick={() => setShowHistory(false)}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[13px] rounded-lg transition-all shadow hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer pointer-events-auto"
            >
              <span>✕</span> KEMBALI
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 text-[13px] leading-relaxed">
            {historyLog.map((log, idx) => (
              <div key={idx} className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="font-bold block mb-1" style={{ color: log.color }}>
                  {log.speaker}:
                </span>
                <p className="text-slate-200">{log.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[14.5px] text-slate-400">Tekan <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">ESC</kbd> untuk kembali</span>
            <button
              type="button"
              onClick={() => setShowHistory(false)}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[13px] rounded-lg border border-slate-600 transition-colors cursor-pointer pointer-events-auto"
            >
              Tutup Riwayat
            </button>
          </div>
        </div>
      )}

      {/* ── KOTAK UTAMA VISUAL NOVEL DIALOGUE ── */}
      <div className="relative w-full max-w-5xl mx-auto flex flex-col">

        {/* ── BARIS ATAS: KEDUA POTRET KARAKTER DUDUK DI ATAS KOTAK CHAT (TANPA KOTAK BACKGROUND) ── */}
        <div className="flex items-end justify-between px-3 sm:px-8 -mb-1 z-10 pointer-events-none">

          {/* SISI KIRI: POTRET NPC (TRANSPARAN TANPA KOTAK BACKGROUND) */}
          <div
            className={`flex flex-col items-center pointer-events-auto transition-all duration-300 ${isNpcSpeaking
                ? 'opacity-100 scale-100 drop-shadow-[0_6px_16px_rgba(0,0,0,0.7)]'
                : 'opacity-60 scale-95 brightness-75'
              } ${isNpcSpeaking && bounceActive ? 'animate-microBounce' : ''}`}
          >
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 flex items-end justify-center">
              <canvas
                ref={npcCanvasRef}
                width={120}
                height={120}
                className="w-full h-full object-contain [image-rendering:pixelated]"
              />
            </div>
          </div>

          {/* SISI KANAN: POTRET KARAKTER PEMAIN (TRANSPARAN TANPA KOTAK BACKGROUND) */}
          <div
            className={`flex flex-col items-center pointer-events-auto transition-all duration-300 ${!isNpcSpeaking
                ? 'opacity-100 scale-100 drop-shadow-[0_6px_16px_rgba(0,0,0,0.7)]'
                : 'opacity-60 scale-95 brightness-75'
              } ${!isNpcSpeaking && bounceActive ? 'animate-microBounce' : ''}`}
          >
            <span className="text-[13.5px] text-slate-400 font-bold mb-0.5 tracking-wider drop-shadow hidden sm:inline">
              {playerName}
            </span>
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 flex items-end justify-center">
              <canvas
                ref={playerCanvasRef}
                width={120}
                height={120}
                className="w-full h-full object-contain [image-rendering:pixelated]"
              />
            </div>
          </div>

        </div>

        {/* ── KOTAK CHAT DIALOG GELAP ELEGAN (TIDAK GONJRENG, WARNA TENANG & STANDAR) ── */}
        <div
          onClick={handleAdvance}
          className="relative w-full bg-slate-950/85 border border-slate-700/60 rounded-2xl p-4 sm:p-6 shadow-2xl cursor-pointer backdrop-blur-md min-h-[150px] sm:min-h-[170px] flex flex-col justify-between transition-all hover:border-slate-600"
        >

          {/* TAG NAMA PEMBICARA (BERSIH & ELEGAN) */}
          <div className="flex items-center justify-between mb-2 sm:mb-2.5">
            <div className="flex items-baseline gap-2">
              <span
                className="text-base sm:text-lg md:text-xl font-bold tracking-wide transition-all drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                style={{ color: speakerProfile.nameColor }}
              >
                {speakerProfile.name}
              </span>
              <span className="text-[13px] sm:text-[15px] text-slate-300 font-medium tracking-wide hidden sm:inline">
                • {speakerProfile.title}
              </span>
            </div>

            {/* Indikator Lanjut / Spasi */}
            <span className="text-[13px] sm:text-[15px] text-amber-300/90 font-mono tracking-wider hidden sm:inline">
              [Klik / SPASI untuk Lanjut ▶]
            </span>
          </div>

          {/* AREA TEKS PERCAKAPAN DENGAN TYPEWRITER EFFECT */}
          <div className="flex-1 my-1.5">
            <p className="text-base sm:text-lg md:text-xl lg:text-[24px] text-slate-100 leading-relaxed sm:leading-relaxed md:leading-loose font-medium select-none tracking-normal">
              &ldquo;{displayedText}&rdquo;
              {isTyping && (
                <span className="inline-block w-2.5 h-4 ml-1 bg-amber-400 animate-ping align-middle" />
              )}
            </p>
          </div>

          {/* ── PILIHAN PERCABANGAN RESPON PEMAIN (TOMBOL WARNA BIASA, TIDAK GONJRENG) ── */}
          {currentNode?.choices && currentNode.choices.length > 0 && !isTyping && (
            <div
              className="mt-3 pt-3 border-t border-slate-800 flex flex-col sm:flex-row gap-2.5 z-20"
              onClick={(e) => e.stopPropagation()} // Mencegah advance dialog saat klik opsi
            >
              {currentNode.choices.map((choice, idx) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoiceClick(choice)}
                  className="flex-1 px-4 py-3 sm:py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 hover:border-slate-500 font-pixel text-[15px] sm:text-base tracking-wide shadow-md transition-all active:translate-y-0.5 flex items-center justify-start gap-2.5 cursor-pointer group"
                >
                  <span className="text-amber-400 font-mono font-bold shrink-0">[{idx + 1}]</span>
                  <span className="group-hover:translate-x-0.5 transition-transform text-left">
                    {choice.text}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* ── TOOLBAR BAWAH ── */}
          <div
            className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-800/80 text-[13px] sm:text-[15px] text-slate-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => setShowHistory(true)}
                className="hover:text-slate-200 cursor-pointer transition-colors"
              >
                Riwayat (History)
              </button>
              <button
                onClick={() => setAutoPlay(!autoPlay)}
                className={`cursor-pointer transition-colors ${autoPlay ? 'text-emerald-400 font-bold' : 'hover:text-slate-200'
                  }`}
              >
                {autoPlay ? '▶ Auto (ON)' : '▷ Auto'}
              </button>
              <button
                onClick={() => {
                  retroAudio.playSelect();
                  if (currentNode?.nextNodeId && dialogueTree.nodes[currentNode.nextNodeId]) {
                    setCurrentNodeId(currentNode.nextNodeId);
                  } else {
                    onClose();
                  }
                }}
                className="hover:text-slate-200 cursor-pointer transition-colors"
              >
                Skip
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
