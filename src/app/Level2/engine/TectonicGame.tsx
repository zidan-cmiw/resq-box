// ── src/app/Level2/engine/TectonicGame.tsx ────────────────────────────
// Komponen Utama Canvas Game Level 2: Batas Divergen & Pecahnya Pangea
// Menyatukan engine fisika, multi-layer canvas renderer, karakter kustom siswa,
// HUD interaktif, pop-up temuan sains (DiscoveryModal), evaluasi Teka-Teki Silang (CrosswordModal),
// serta integrasi sinkronisasi progres ke Teacher Dashboard.

import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createInitialGameStateL2,
  updateGameEngineL2,
  saveLevel2Progress,
  loadLevel2Progress,
  clearLevel2Progress,
  switchAreaL2,
  startSimulationArea2,
  type GameStateL2,
} from './gameEngine';
import { renderTectonicGameL2 } from './renderer';
import {
  initPlayerInputL2,
  readPlayerInputL2,
  setMobileControlL2,
  resetMobileJustPressedL2,
} from './player';
import { LEVEL2_AREAS } from '../level2Data';
import DiscoveryModal from '../DiscoveryModal';
import CrosswordModal from '../CrosswordModal';
import MiniChallengeModal from '../MiniChallengeModal';
import TectonicVictoryModal from '../TectonicVictoryModal';
import VisualNovelDialogueL2 from '../VisualNovelDialogueL2';
import { DIALOGUE_TREES_L2, type DialogueTreeL2 } from '../dialogueDataL2';
import PixelIcon from '../../../components/PixelIcon';
import TelemetryHUD from '../../Level1/EarthDive/TelemetryHUD';
import { retroAudio } from '../../../utils/retroAudio';
import { toggleFullscreen, isFullscreenActive } from '../../../utils/fullscreen';
import { useAuthStore, getActiveCustomAvatar } from '../../../store/teacherStore';
import { syncLevel2Progress } from '../level2Sync';

export default function TectonicGame() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef<GameStateL2 | null>(null);
  const rafRef = useRef<number>(0);

  const student = useAuthStore((state) => state.student);
  const currentUser = useAuthStore((state) => state.currentUser);
  const activeUserId = student?.id || currentUser?.id || currentUser?.username || 'guest';

  // Ambil konfigurasi avatar kustom siswa dari profile (sama persis dengan Level 1)
  const avatarConfig =
    student?.custom_avatar || currentUser?.avatar_config || getActiveCustomAvatar();

  const [currentAreaIndex, setCurrentAreaIndex] = useState(() => {
    const saved = loadLevel2Progress(activeUserId);
    return saved?.currentAreaIndex ?? 0;
  });
  const activeArea = LEVEL2_AREAS[currentAreaIndex] || LEVEL2_AREAS[0];

  // Sound & Fullscreen
  const [soundOn, setSoundOn] = useState(() => retroAudio.isEnabled());
  const [, setIsFullscreen] = useState(() => isFullscreenActive());

  // Modals & UI States
  const [inWorldSign, setInWorldSign] = useState<{
    id: string;
    text: string;
    ox: number;
    oy: number;
  } | null>(null);
  const inWorldSignRef = useRef<{ id: string; text: string; ox: number; oy: number } | null>(null);
  const signBubbleRef = useRef<HTMLDivElement>(null);
  const [activeDialogueTree, setActiveDialogueTree] = useState<DialogueTreeL2 | null>(null);
  const [activeDiscoveryIndex, setActiveDiscoveryIndex] = useState<number | null>(null);
  const [showCrossword, setShowCrossword] = useState(false);
  const [showMiniChallenge, setShowMiniChallenge] = useState(false);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [isGateLockedModalOpen, setIsGateLockedModalOpen] = useState(false);
  const [discoveryWarning, setDiscoveryWarning] = useState<{ read: number; total: number } | null>(null);

  // HUD States (Dimuat langsung dari save data akun aktif)
  const [playerHp, setPlayerHp] = useState(() => {
    const saved = loadLevel2Progress(activeUserId);
    return saved?.playerHealth ?? 100;
  });
  const [collectedCount, setCollectedCount] = useState(() => {
    const saved = loadLevel2Progress(activeUserId);
    return saved?.collectedCrystals?.length ?? 0;
  });
  const [totalCrystals] = useState(9); // 3 kristal per area × 3 area = total 9 kristal di Level 2
  const [discoveredInArea, setDiscoveredInArea] = useState(0);
  const [simPhase, setSimPhase] = useState<string>('idle');
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [nearInteractablePrompt, setNearInteractablePrompt] = useState<string | null>(null);

  // Deteksi perangkat sentuh / tablet persis Level 1
  useEffect(() => {
    const checkTouch = () => {
      const hasTouch =
        typeof window !== 'undefined' &&
        (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.innerWidth <= 1024);
      setIsTouchDevice(hasTouch);
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  // Mobile Touch Callbacks (4-Way D-Pad + Loncat & Aksi)
  const handleMobileBtnDown = useCallback((btn: 'left' | 'right' | 'up' | 'down' | 'jump' | 'interact') => {
    setMobileControlL2(btn, true);
  }, []);

  const handleMobileBtnUp = useCallback((btn: 'left' | 'right' | 'up' | 'down' | 'jump' | 'interact') => {
    setMobileControlL2(btn, false);
  }, []);

  // Pause check (if any modal is open)
  const isPaused =
    activeDiscoveryIndex !== null ||
    showCrossword ||
    showMiniChallenge ||
    showVictoryModal ||
    discoveryWarning !== null ||
    isGateLockedModalOpen ||
    activeDialogueTree !== null ||
    simPhase === 'failed';

  // ── INIT GAME STATE & INPUTS (SCOPED TO ACTIVE USER) ──
  useEffect(() => {
    initPlayerInputL2();

    // Pastikan gameState selalu dimuat eksklusif untuk activeUserId saat ini
    const state = createInitialGameStateL2(activeUserId);
    gameStateRef.current = state;
    setCurrentAreaIndex(state.currentAreaIndex);
    setPlayerHp(state.player.health);
    setCollectedCount(state.collectedCrystals.size);
  }, [activeUserId]);

  // ── RESQY STORY TUTOR DI AWAL AREA (PERSIS SEPERTI DI LEVEL 1) ──
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (currentAreaIndex === 0) {
      const seenKey = `resqbox_l2_mascot_area0_seen_${activeUserId}`;
      const hasSeen = localStorage.getItem(seenKey);
      if (!hasSeen) {
        const timer = window.setTimeout(() => {
          const tree = DIALOGUE_TREES_L2['resqy_briefing_area1'];
          if (tree) {
            setActiveDialogueTree(tree);
            try {
              localStorage.setItem(seenKey, 'true');
            } catch {}
          }
        }, 650);
        return () => window.clearTimeout(timer);
      }
    } else if (currentAreaIndex === 1) {
      const seenKey = `resqbox_l2_mascot_area1_seen_${activeUserId}`;
      const hasSeen = localStorage.getItem(seenKey);
      if (!hasSeen) {
        const timer = window.setTimeout(() => {
          const tree = DIALOGUE_TREES_L2['resqy_briefing_area2'];
          if (tree) {
            setActiveDialogueTree(tree);
            try {
              localStorage.setItem(seenKey, 'true');
            } catch {}
          }
        }, 650);
        return () => window.clearTimeout(timer);
      }
    } else if (currentAreaIndex === 2) {
      const seenKey = `resqbox_l2_mascot_area2_seen_${activeUserId}`;
      const hasSeen = localStorage.getItem(seenKey);
      if (!hasSeen) {
        const timer = window.setTimeout(() => {
          const tree = DIALOGUE_TREES_L2['resqy_briefing_area3'];
          if (tree) {
            setActiveDialogueTree(tree);
            try {
              localStorage.setItem(seenKey, 'true');
            } catch {}
          }
        }, 650);
        return () => window.clearTimeout(timer);
      }
    }
  }, [currentAreaIndex, activeUserId]);

  // ── SAVE PROGRESS ON PAGE REFRESH, TAB CLOSE, OR VISIBILITY CHANGE ──
  useEffect(() => {
    const handleSave = () => {
      if (gameStateRef.current) {
        saveLevel2Progress(gameStateRef.current, activeUserId);
      }
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && gameStateRef.current) {
        saveLevel2Progress(gameStateRef.current, activeUserId);
      }
    };

    window.addEventListener('beforeunload', handleSave);
    window.addEventListener('pagehide', handleSave);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleSave);
      window.removeEventListener('pagehide', handleSave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      handleSave();
    };
  }, [activeUserId]);

  // ── PERIODIC AUTOSAVE TIAP 4 DETIK (MENJAMIN DATA SELALU TERSIMPAN) ──
  useEffect(() => {
    const interval = window.setInterval(() => {
      if (gameStateRef.current && !isPaused) {
        saveLevel2Progress(gameStateRef.current, activeUserId);
      }
    }, 4000);
    return () => window.clearInterval(interval);
  }, [activeUserId, isPaused]);

  // ── SOUND TOGGLE ──
  const handleToggleSound = () => {
    const next = retroAudio.toggleSound();
    setSoundOn(next);
  };

  // ── WINDOW TEST HELPERS (DEV/TESTING) ──
  useEffect(() => {
    (window as any).__openDiscoveryL2 = (idx: number) => setActiveDiscoveryIndex(idx);
    (window as any).__switchAreaL2 = (areaIdx: number) => {
      if (gameStateRef.current) {
        switchAreaL2(gameStateRef.current, areaIdx, true);
        setCurrentAreaIndex(areaIdx);
      }
    };
    (window as any).__startSimulationArea2 = () => {
      if (gameStateRef.current) {
        startSimulationArea2(gameStateRef.current);
      }
    };
    (window as any).__showVictoryL2 = () => setShowVictoryModal(true);
    (window as any).__resetLevel2 = () => {
      clearLevel2Progress(activeUserId);
      try {
        localStorage.removeItem(`resqbox_l2_mascot_area0_seen_${activeUserId}`);
        localStorage.removeItem(`resqbox_l2_mascot_area1_seen_${activeUserId}`);
      } catch {}
      window.location.reload();
    };
    return () => {
      delete (window as any).__openDiscoveryL2;
      delete (window as any).__switchAreaL2;
      delete (window as any).__startSimulationArea2;
      delete (window as any).__showVictoryL2;
      delete (window as any).__resetLevel2;
    };
  }, [activeUserId]);

  // ── FULLSCREEN TOGGLE ──
  const handleToggleFullscreen = () => {
    retroAudio.playSelect();
    toggleFullscreen((active) => setIsFullscreen(active));
  };

  // ── CANVAS RESIZE HANDLER (DPR & ZOOM CRISP AWARE) ──
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    const cssW = window.innerWidth;
    const cssH = window.innerHeight;
    const pixelW = Math.round(cssW * dpr);
    const pixelH = Math.round(cssH * dpr);

    if (canvas.width !== pixelW || canvas.height !== pixelH) {
      canvas.width = pixelW;
      canvas.height = pixelH;
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
    }
  }, []);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  // ── MAIN GAME LOOP ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const loop = () => {
      const state = gameStateRef.current;
      if (!state) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      if (!isPaused) {
        const input = readPlayerInputL2();
        updateGameEngineL2(state, input);
        resetMobileJustPressedL2();

        // Sync local HUD states
        if (state.currentAreaIndex !== currentAreaIndex) {
          setCurrentAreaIndex(state.currentAreaIndex);
        }
        setPlayerHp(state.player.health);
        setCollectedCount(state.collectedCrystals.size);
        if (state.simulation.phase !== simPhase) {
          setSimPhase(state.simulation.phase);
        }

        if (state.pendingGateLocked) {
          setIsGateLockedModalOpen(true);
          state.pendingGateLocked = false;
        }

        // Sinkronisasi status HUD real-time (Kristal, HP, dan Temuan di Area Ini)
        if (state.collectedCrystals.size !== collectedCount) {
          setCollectedCount(state.collectedCrystals.size);
        }
        if (state.player.health !== playerHp) {
          setPlayerHp(state.player.health);
        }

        // Discovery count in current area (Area 1: Bu Rahma & Pak Surya, Area 3: dr. Alisa & Pak Bambang)
        let readInArea = 0;
        if (state.currentAreaIndex === 0) {
          const hasPrep = state.discoveredPoints.has('l2_q_disc_prep') || state.discoveredPoints.has('disc-earthquake-prep');
          const hasAction = state.discoveredPoints.has('l2_q_disc_action') || state.discoveredPoints.has('disc-earthquake-action');
          if (hasPrep) readInArea++;
          if (hasAction) readInArea++;
        } else if (state.currentAreaIndex === 2) {
          if (state.discoveredPoints.has('disc-post-safety')) readInArea++;
          if (state.discoveredPoints.has('disc-post-coordination')) readInArea++;
        } else {
          const currentAreaObj = LEVEL2_AREAS[state.currentAreaIndex] || LEVEL2_AREAS[0];
          readInArea = currentAreaObj.discoveries.filter((d) => state.discoveredPoints.has(d.id)).length;
        }
        if (readInArea !== discoveredInArea) {
          setDiscoveredInArea(readInArea);
        }

        // Sync near interactable prompt
        if (state.nearInteractablePrompt !== nearInteractablePrompt) {
          setNearInteractablePrompt(state.nearInteractablePrompt);
        }

        // Deteksi apakah pemain sedang berada di dekat papan catatan geologi (info_sign)
        const nearSignObj = state.zone.objects.find(
          (o) => o.type === 'info_sign' && Math.hypot(state.player.x - o.px, state.player.y - o.py) < 50
        );
        if (nearSignObj) {
          const signText = (nearSignObj.data?.text as string) || '';
          if (inWorldSignRef.current?.id !== nearSignObj.id) {
            const nextSign = { id: nearSignObj.id, text: signText, ox: nearSignObj.px, oy: nearSignObj.py };
            inWorldSignRef.current = nextSign;
            setInWorldSign(nextSign);
            retroAudio.playSelect();
          }
        } else if (inWorldSignRef.current) {
          inWorldSignRef.current = null;
          setInWorldSign(null);
        }

        // Update posisi floating speech bubble secara real-time tepat di atas papan catatan Level 2
        if (signBubbleRef.current && inWorldSignRef.current) {
          const sign = inWorldSignRef.current;
          const scale = Math.max(0.5, canvas.height / 480);
          const effectiveW = canvas.width / scale;
          const targetCamX = state.player.x - effectiveW / 2;
          const camX = Math.max(0, Math.min(2400 - effectiveW, targetCamX));

          const sx = (sign.ox + 16 - camX) * scale;
          const sy = (sign.oy) * scale;

          const boxW = Math.min(400, window.innerWidth - 32);
          let left = sx - boxW / 2;
          if (left + boxW > window.innerWidth - 16) {
            left = window.innerWidth - boxW - 16;
          }
          if (left < 16) {
            left = 16;
          }
          const bottom = Math.max(60, window.innerHeight - sy + 18);
          const arrowLeft = Math.max(16, Math.min(boxW - 24, sx - left));

          signBubbleRef.current.style.left = `${left}px`;
          signBubbleRef.current.style.bottom = `${bottom}px`;
          signBubbleRef.current.style.setProperty('--arrow-left', `${arrowLeft}px`);
        }

        // Sinkronisasi pemicu dialog Visual Novel RPG Level 2 dari engine
        if (state.activeDialogueTree && !activeDialogueTree) {
          setActiveDialogueTree(state.activeDialogueTree);
          state.activeDialogueTree = null;
        }

        if (state.pendingDiscoveryRequired) {
          setDiscoveryWarning(state.pendingDiscoveryRequired);
          state.pendingDiscoveryRequired = null;
          retroAudio.playError();
        }

        if (state.pendingDiscoveryIndex !== null) {
          setActiveDiscoveryIndex(state.pendingDiscoveryIndex);
          state.pendingDiscoveryIndex = null;
        }

        if (state.pendingCrossword) {
          setShowCrossword(true);
          state.pendingCrossword = false;
        }

        if (state.pendingMiniChallenge) {
          setShowMiniChallenge(true);
          state.pendingMiniChallenge = false;
        }

        if (state.isAreaCompleted) {
          state.isAreaCompleted = false;

          // Save final progress Level 2 ke Supabase & Teacher Dashboard
          syncLevel2Progress(student, {
            score: 100,
            currentMission: 3,
            completedMissions: [1, 2, 3],
            resiliencePoints: 100,
            badges: [
              'earthquake-prep',
              'earthquake-action',
              'post-disaster-master',
            ],
            isCompleted: true,
            statusText: 'TUNTAS',
          });
          useAuthStore.getState().unlockLevel(3);
          saveLevel2Progress(state, activeUserId);
          setShowVictoryModal(true);
        }
      }

      // Render canvas dengan avatar kustom siswa
      renderTectonicGameL2(ctx, state, canvas.width, canvas.height, avatarConfig);

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPaused, student, avatarConfig, activeUserId, currentAreaIndex]);

  // ── CROSSWORD PUZZLE SUCCESS HANDLER (AREA 1, AREA 2, AREA 3) ──
  const handleCrosswordSuccess = () => {
    const state = gameStateRef.current;
    if (state) {
      if (currentAreaIndex === 0) {
        state.unlockedGates.add('l2_gate_gempa');
        saveLevel2Progress(state, activeUserId);
        syncLevel2Progress(student, {
          score: 35,
          currentMission: 1,
          completedMissions: [1],
          resiliencePoints: 35,
          badges: ['earthquake-prep'],
          isCompleted: false,
          statusText: 'Area 1 Tuntas (35 Poin)',
        });
      } else if (currentAreaIndex === 1) {
        state.unlockedGates.add('l2_gate_gempa_sim');
        saveLevel2Progress(state, activeUserId);
        syncLevel2Progress(student, {
          score: 70,
          currentMission: 2,
          completedMissions: [1, 2],
          resiliencePoints: 70,
          badges: ['earthquake-action'],
          isCompleted: false,
          statusText: 'Area 2 Tuntas (70 Poin)',
        });
      } else if (currentAreaIndex === 2) {
        state.unlockedGates.add('l2_gate_pascabencana');
        saveLevel2Progress(state, activeUserId);
        syncLevel2Progress(student, {
          score: 100,
          currentMission: 3,
          completedMissions: [1, 2, 3],
          resiliencePoints: 100,
          badges: [
            'earthquake-prep',
            'earthquake-action',
            'post-disaster-master',
          ],
          isCompleted: true,
          statusText: 'TUNTAS',
        });
        useAuthStore.getState().unlockLevel(3);
        retroAudio.playWin();
        setShowCrossword(false);
        setTimeout(() => {
          setShowVictoryModal(true);
        }, 400);
        return;
      }
    }
    retroAudio.playWin();
    setShowCrossword(false);
  };

  // ── MINI CHALLENGE SUCCESS HANDLER (FALLBACK) ──
  const handleMiniChallengeSuccess = () => {
    const state = gameStateRef.current;
    if (state) {
      if (currentAreaIndex === 1) {
        state.unlockedGates.add('l2_gate_erupsi');
        state.isAreaCompleted = true;
        saveLevel2Progress(state, activeUserId);
        syncLevel2Progress(student, {
          score: 100,
          currentMission: 2,
          completedMissions: [1, 2],
          resiliencePoints: 100,
          badges: [
            'earthquake-responder',
            'volcano-responder',
          ],
          isCompleted: true,
          statusText: 'TUNTAS',
        });
        useAuthStore.getState().unlockLevel(3);
        retroAudio.playWin();
        setShowMiniChallenge(false);
        setTimeout(() => {
          setShowVictoryModal(true);
        }, 400);
        return;
      } else {
        state.unlockedGates.add('l2_gate_gempa');
        saveLevel2Progress(state, activeUserId);
        syncLevel2Progress(student, {
          score: 50,
          currentMission: 1,
          completedMissions: [1],
          resiliencePoints: 50,
          badges: ['earthquake-responder'],
          isCompleted: false,
          statusText: 'Area 1 Tuntas (50 Poin)',
        });
      }
    }
    retroAudio.playWin();
  };

  // ── CANVAS INTERACTION HANDLER (KLIK NPC & KLIK MASKOT RESQY) ──
  const handleCanvasClickEvent = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const state = gameStateRef.current;
    if (!canvas || !state || isPaused) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) * (canvas.width / rect.width);
    const clickY = (e.clientY - rect.top) * (canvas.height / rect.height);

    const scale = Math.max(0.5, canvas.height / 480);
    const effectiveW = canvas.width / scale;
    const targetCamX = state.player.x - effectiveW / 2;
    const camX = Math.max(0, Math.min(2400 - effectiveW, targetCamX));
    const worldX = camX + clickX / scale;
    const worldY = clickY / scale;

    // 1. Cek klik pada maskot Resqy melayang di belakang pundak pemain
    const resqyOffX = state.player.dir === 'right' ? -18 : 18;
    const resqyX = state.player.x + resqyOffX;
    const resqyY = state.player.y - 42;
    if (Math.hypot(worldX - resqyX, worldY - resqyY) < 38) {
      retroAudio.playSelect();
      const dialogueId =
        state.currentAreaIndex === 0
          ? 'resqy_briefing_area1'
          : state.currentAreaIndex === 1
          ? 'resqy_briefing_area2'
          : 'resqy_briefing_area3';
      const tree = DIALOGUE_TREES_L2[dialogueId];
      if (tree) {
        state.activeDialogueTree = tree;
        setActiveDialogueTree(tree);
      }
      return;
    }

    // 2. Cek klik pada NPC terdekat
    if (state.npcs) {
      for (const npc of state.npcs.values()) {
        if (Math.hypot(worldX - npc.x, worldY - (npc.y - 20)) < 38) {
          if (Math.hypot(state.player.x - npc.x, state.player.y - npc.y) < 85) {
            retroAudio.playSelect();
            const tree = DIALOGUE_TREES_L2[npc.dialogueId];
            if (tree) {
              state.activeDialogueTree = tree;
              setActiveDialogueTree(tree);
            }
          }
          return;
        }
      }
    }
  }, [isPaused]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#09090b] select-none font-pixel">
      {/* ── 1. GAME CANVAS ── */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClickEvent}
        className="absolute inset-0 w-full h-full block cursor-crosshair touch-none"
      />

      {/* ── 2. TOP HUD BAR (100% PERSIS DENGAN LEVEL 1) ── */}
      <div className="fixed top-2 sm:top-2.5 left-2 sm:left-3 right-2 sm:right-3 flex items-start justify-between pointer-events-none z-20">
        {/* TOP LEFT: COMPACT NAVIGATION & UTILITY BUTTONS + AREA PILL (GAYA LEVEL 1) */}
        <div className="flex flex-col items-start gap-1.5 pointer-events-auto">
          {/* Row 1: Tombol Navigasi Menu, Sound, dan Layar Penuh */}
          <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-950/85 backdrop-blur-md border-2 border-amber-800/80 p-1 sm:p-1.5 rounded-2xl shadow-[0_4px_0_#231206]">
            {/* Back to Menu (Kembali langsung ke Dashboard Utama) */}
            <button
              onClick={() => {
                retroAudio.playSelect();
                if (gameStateRef.current) {
                  saveLevel2Progress(gameStateRef.current, activeUserId);
                }
                navigate('/');
              }}
              className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-amber-950 hover:bg-amber-900 text-amber-200 border-2 border-amber-600/80 font-pixel-title text-[11px] sm:text-xs flex items-center gap-1.5 cursor-pointer transition-transform active:translate-y-0.5 shadow-[0_2px_0_#231206] whitespace-nowrap"
              title="Kembali ke Menu Utama"
            >
              <span className="text-amber-400 font-bold">&lt;</span>
              <span>MENU</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl border flex items-center justify-center cursor-pointer transition-all ${soundOn
                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-[0_2px_0_#78350f]'
                : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              title="Musik & Efek Suara"
            >
              <PixelIcon name={soundOn ? 'sound-on' : 'sound-off'} size={13} />
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={handleToggleFullscreen}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center cursor-pointer transition-all active:translate-y-0.5"
              title="Layar Penuh"
            >
              <PixelIcon name="fullscreen" size={13} />
            </button>
          </div>

          {/* Row 2: Current Area Badge Pill (Persis Ukuran & Font Level 1) */}
          <div className="bg-slate-950/95 backdrop-blur-md border-2 border-amber-700/90 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-amber-200 font-pixel text-[10px] sm:text-xs shadow-[0_4px_0_#231206] flex items-center gap-1.5 whitespace-nowrap">
            <span
              className={`w-2 h-2 rounded-full ${currentAreaIndex === 1
                ? 'bg-rose-500 animate-ping'
                : 'bg-emerald-400 animate-pulse'
                } shrink-0`}
            />
            <span className="font-bold text-amber-300 uppercase tracking-wide truncate max-w-[160px] sm:max-w-none">
              {activeArea.name}
            </span>
          </div>
        </div>

        {/* TOP CENTER: STREAMLINED REAL-TIME TELEMETRY PILL (Gaya Level 1 - Disembunyikan di Area 2 Simulasi) */}
        {currentAreaIndex !== 1 && (
          <div className="pointer-events-auto z-20">
            <TelemetryHUD
              crystalsCount={collectedCount}
              totalCrystals={totalCrystals}
              areaDiscoveriesRead={discoveredInArea}
              areaDiscoveriesTotal={activeArea.discoveries.length}
              playerHp={playerHp}
            />
          </div>
        )}

        {/* TOP RIGHT: Spacer */}
        <div className="pointer-events-none w-6 sm:w-12" />
      </div>

      {/* ── 3. DISCREET KEYBOARD CONTROLS GUIDE (Desktop Bottom Persis Level 1) ── */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-3 px-3.5 py-1 rounded-full bg-black/70 border border-amber-900/50 text-[9px] font-pixel text-slate-300 pointer-events-none z-10 select-none">
        <span>← → Gerak</span>
        <span>↑ / [Spasi] Lompat</span>
        <span>[E] Interaksi</span>
      </div>

      {/* ── 4. FLOATING INTERACTION HINT (BOTTOM CENTER PERSIS LEVEL 1) ── */}
      {nearInteractablePrompt && !isPaused && (
        <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 pointer-events-auto z-20 select-none animate-bounce">
          <div className="bg-slate-900/90 text-amber-200 border-2 border-amber-500/80 px-3.5 py-1.5 rounded-xl font-pixel text-xs shadow-lg flex items-center gap-2">
            <PixelIcon name="broadcast" size={13} />
            <span className="uppercase tracking-wide">{nearInteractablePrompt}</span>
          </div>
        </div>
      )}

      {/* ── 5. MOBILE & TABLET TOUCH CONTROLS (4-Way D-Pad + Dedicated Jump & Interact 100% PERSIS LEVEL 1) ── */}
      {(isTouchDevice || (typeof window !== 'undefined' && window.innerWidth <= 1024)) && (
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between pointer-events-none z-30 select-none">
          {/* Left 4-Way D-Pad (Atas, Bawah, Kiri, Kanan) */}
          <div className="flex flex-col items-center pointer-events-auto bg-slate-950/75 p-1 sm:p-1.5 rounded-2xl border-2 border-slate-700/90 backdrop-blur-md shadow-[0_4px_0_#0f172a]">
            {/* Up button */}
            <button
              onPointerDown={() => handleMobileBtnDown('up')}
              onPointerUp={() => handleMobileBtnUp('up')}
              onPointerLeave={() => handleMobileBtnUp('up')}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-blue-600 border-2 border-slate-600 text-slate-100 font-bold text-base flex items-center justify-center touch-none shadow-sm cursor-pointer"
              title="Lompat ke Atas"
            >
              ▲
            </button>
            {/* Left, Center indicator, Right */}
            <div className="flex items-center gap-1 sm:gap-1.5 my-1">
              <button
                onPointerDown={() => handleMobileBtnDown('left')}
                onPointerUp={() => handleMobileBtnUp('left')}
                onPointerLeave={() => handleMobileBtnUp('left')}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-blue-600 border-2 border-slate-600 text-slate-100 font-bold text-base flex items-center justify-center touch-none shadow-sm cursor-pointer"
                title="Bergerak ke Kiri"
              >
                ◀
              </button>
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-slate-700/70 border border-slate-600/80" />
              <button
                onPointerDown={() => handleMobileBtnDown('right')}
                onPointerUp={() => handleMobileBtnUp('right')}
                onPointerLeave={() => handleMobileBtnUp('right')}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-blue-600 border-2 border-slate-600 text-slate-100 font-bold text-base flex items-center justify-center touch-none shadow-sm cursor-pointer"
                title="Bergerak ke Kanan"
              >
                ▶
              </button>
            </div>
            {/* Down button */}
            <button
              onPointerDown={() => handleMobileBtnDown('down')}
              onPointerUp={() => handleMobileBtnUp('down')}
              onPointerLeave={() => handleMobileBtnUp('down')}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-blue-600 border-2 border-slate-600 text-slate-100 font-bold text-base flex items-center justify-center touch-none shadow-sm cursor-pointer"
              title="Merunduk / Jongkok"
            >
              ▼
            </button>
          </div>

          {/* Right Action Buttons: Dedicated Jump (LONCAT) & Interact (AKSI) */}
          <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto bg-slate-950/75 p-1.5 sm:p-2 rounded-2xl border-2 border-slate-700/90 backdrop-blur-md shadow-[0_4px_0_#0f172a]">
            {/* Tombol Loncat: LONCAT */}
            <button
              onPointerDown={() => handleMobileBtnDown('jump')}
              onPointerUp={() => handleMobileBtnUp('jump')}
              onPointerLeave={() => handleMobileBtnUp('jump')}
              className="w-14 h-12 sm:w-16 sm:h-13 rounded-xl bg-gradient-to-b from-blue-700 to-blue-900 active:from-blue-600 active:to-blue-800 border-2 border-blue-400 text-blue-100 font-pixel text-[11px] sm:text-xs flex flex-col items-center justify-center touch-none shadow-[0_3px_0_#1e3a8a] active:translate-y-0.5 cursor-pointer"
              title="Lompat"
            >
              <span className="text-sm font-bold leading-none">▲</span>
              <span className="text-[9px] font-pixel-title mt-0.5 tracking-wider">LONCAT</span>
            </button>

            {/* Tombol Interaksi [E] AKSI */}
            <button
              onPointerDown={() => handleMobileBtnDown('interact')}
              onPointerUp={() => handleMobileBtnUp('interact')}
              onPointerLeave={() => handleMobileBtnUp('interact')}
              className="w-14 h-12 sm:w-16 sm:h-13 rounded-xl bg-gradient-to-b from-amber-600 to-amber-800 active:from-amber-500 active:to-amber-700 border-2 border-amber-400 text-amber-50 font-pixel text-[11px] sm:text-xs flex flex-col items-center justify-center touch-none shadow-[0_3px_0_#78350f] active:translate-y-0.5 cursor-pointer"
              title="Interaksi (E)"
            >
              <span className="text-xs font-bold leading-none">[E]</span>
              <span className="text-[9px] font-pixel-title mt-0.5 tracking-wider">AKSI</span>
            </button>
          </div>
        </div>
      )}

      {/* ── POPUP PERINGATAN: AKSES TURUN / AREA TERKUNCI (100% PERSIS LEVEL 1) ── */}
      {isGateLockedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm select-none animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#fef3c7] border-4 border-[#451a03] rounded-2xl p-5 sm:p-6 shadow-[0_12px_0_#1c0d02] text-[#451a03] font-pixel text-center">
            <h3 className="text-sm sm:text-base font-pixel-title text-rose-950 font-bold mb-2.5">
              AKSES TURUN TERKUNCI!
            </h3>

            <p className="text-xs sm:text-sm text-[#451a03] leading-relaxed mb-5 font-pixel">
              Jalur turun menuju lapisan selanjutnya masih terkunci rapat. Kamu harus menyelesaikan tantangan dari peneliti di area ini terlebih dahulu untuk membuka akses turun!
            </p>

            <button
              onClick={() => {
                retroAudio.playSelect();
                setIsGateLockedModalOpen(false);
              }}
              className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-amber-50 border-3 border-[#451a03] shadow-[0_4px_0_#231206] text-xs font-pixel-title flex items-center justify-center gap-2 cursor-pointer transition-transform active:translate-y-0.5"
            >
              <span>SIAP, SELESAIKAN TANTANGAN PENELITI DULU</span>
            </button>
          </div>
        </div>
      )}

      {/* ── POPUP SIMULASI GAGAL: TELAT MERUNDUK DI BAWAH MEJA (ULANGI DARI AWAL) ── */}
      {simPhase === 'failed' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm select-none animate-fadeIn font-pixel">
          <div className="relative w-full max-w-md bg-[#1e1b4b] border-4 border-rose-600 rounded-2xl p-5 sm:p-6 shadow-[0_12px_0_#4c0519] text-white text-center">
            <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-rose-950/80 border-3 border-rose-500 flex items-center justify-center text-rose-300 font-pixel-title text-xl font-bold shadow-[0_4px_0_#4c0519] animate-pulse">
              [!]
            </div>

            <h3 className="text-sm sm:text-base font-pixel-title text-rose-400 font-bold mb-2">
              SIMULASI GAGAL! WAKTU HABIS!
            </h3>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
              Kamu terlambat merunduk dan berlindung di bawah meja saat gempa bumi terjadi.
            </p>

            <div className="bg-rose-950/70 border border-rose-800/80 rounded-xl p-3 mb-5 text-left text-xs text-rose-200">
              <span className="font-bold text-rose-400 block mb-1 font-pixel-title text-[10px]">[TIPS KESIAPSIAGAAN]</span>
              Saat gempa mengguncang, jangan panik atau berdiri mematung! Segera terapkan protokol <strong className="text-amber-300">Drop, Cover, and Hold On</strong> di bawah meja kokoh dalam detik-detik pertama!
            </div>

            <button
              onClick={() => {
                retroAudio.playSelect();
                if (gameStateRef.current) {
                  startSimulationArea2(gameStateRef.current);
                }
                setSimPhase('teaching');
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white border-3 border-rose-400 shadow-[0_4px_0_#881337] text-xs font-pixel-title flex items-center justify-center gap-2 cursor-pointer transition-transform active:translate-y-0.5"
            >
              <span>[ULANG] ULANGI SIMULASI DARI AWAL</span>
            </button>
          </div>
        </div>
      )}

      {/* ── POPUP PERINGATAN: TEMUAN GEOLOGIS BELUM SELESAI (100% PERSIS LEVEL 1) ── */}
      {discoveryWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm select-none animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#fef3c7] border-4 border-[#451a03] rounded-2xl p-5 sm:p-6 shadow-[0_12px_0_#1c0d02] text-[#451a03] font-pixel text-center">
            <h3 className="text-sm sm:text-base font-pixel-title text-amber-950 font-bold mb-2.5">
              TEMUAN GEOLOGIS BELUM SELESAI!
            </h3>

            <p className="text-xs sm:text-sm text-[#451a03] leading-relaxed mb-5 font-pixel">
              Kamu harus mengamati dan membaca seluruh Temuan Geologis di area ini (<span className="font-bold text-amber-800">{discoveryWarning.read}/{discoveryWarning.total}</span>) terlebih dahulu sebelum membuka Evaluasi Gerbang!
            </p>

            <button
              onClick={() => {
                retroAudio.playSelect();
                setDiscoveryWarning(null);
              }}
              className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-amber-50 border-3 border-[#451a03] shadow-[0_4px_0_#231206] text-xs font-pixel-title cursor-pointer active:translate-y-0.5"
            >
              SIAP, AMATI TEMUAN DULU
            </button>
          </div>
        </div>
      )}

      {/* ── 5. FLOATING IN-WORLD INFO SIGN SPEECH BUBBLE (LEVEL 2) ── */}
      {inWorldSign && (
        <div
          ref={signBubbleRef}
          className="fixed z-40 max-w-[420px] w-[90vw] sm:w-[380px] pointer-events-none animate-fadeIn select-none font-pixel"
        >
          <div className="relative bg-[#fef3c7] border-3 sm:border-4 border-[#451a03] rounded-2xl p-3.5 sm:p-4 shadow-[0_8px_0_#1c0d02] text-[#451a03]">
            {/* Header */}
            <div className="flex items-center gap-1.5 border-b-2 border-[#78350f] pb-1.5 mb-2">
              <PixelIcon name="clipboard" size={14} className="text-[#b45309] shrink-0" />
              <span className="font-pixel-title text-[9px] sm:text-[10px] text-[#b45309] tracking-widest uppercase font-bold">
                CATATAN EKSPEDISI GEOLOGI
              </span>
            </div>

            {/* Content text */}
            <p className="font-pixel text-[11px] sm:text-xs text-[#291305] leading-relaxed font-medium whitespace-pre-line">
              {inWorldSign.text}
            </p>

            {/* Downward triangle pointer pointing to the sign */}
            <div
              className="absolute -bottom-3 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-[#451a03]"
              style={{ left: 'var(--arrow-left, 36px)', transform: 'translateX(-50%)' }}
            />
            <div
              className="absolute -bottom-2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#fef3c7]"
              style={{ left: 'var(--arrow-left, 36px)', transform: 'translateX(-50%)' }}
            />
          </div>
        </div>
      )}

      {/* ── 5.5 VISUAL NOVEL RPG DIALOGUE SYSTEM (LEVEL 2) ── */}
      {activeDialogueTree && (
        <VisualNovelDialogueL2
          dialogueTree={activeDialogueTree}
          playerName={student?.name || currentUser?.name || 'Vincent'}
          avatarConfig={avatarConfig}
          onClose={() => {
            setActiveDialogueTree(null);
            if (gameStateRef.current) {
              gameStateRef.current.activeDialogueTree = null;
            }
          }}
          onMarkDiscovery={(discoveryId) => {
            const state = gameStateRef.current;
            if (state) {
              state.discoveredPoints.add(discoveryId);
              if (discoveryId === 'l2_q_disc_prep' || discoveryId === 'disc-earthquake-prep') {
                state.discoveredPoints.add('l2_q_disc_prep');
                state.discoveredPoints.add('disc-earthquake-prep');
              }
              if (discoveryId === 'l2_q_disc_action' || discoveryId === 'disc-earthquake-action') {
                state.discoveredPoints.add('l2_q_disc_action');
                state.discoveredPoints.add('disc-earthquake-action');
              }
              saveLevel2Progress(state, activeUserId);

              let readInArea = 0;
              if (currentAreaIndex === 0) {
                if (state.discoveredPoints.has('l2_q_disc_prep') || state.discoveredPoints.has('disc-earthquake-prep')) readInArea++;
                if (state.discoveredPoints.has('l2_q_disc_action') || state.discoveredPoints.has('disc-earthquake-action')) readInArea++;
              } else if (currentAreaIndex === 2) {
                if (state.discoveredPoints.has('disc-post-safety')) readInArea++;
                if (state.discoveredPoints.has('disc-post-coordination')) readInArea++;
              } else {
                readInArea = activeArea.discoveries.filter((d) => state.discoveredPoints.has(d.id)).length;
              }
              setDiscoveredInArea(readInArea);
            }
          }}
          onTriggerDiscovery={(discoveryIndex) => {
            setActiveDiscoveryIndex(discoveryIndex);
          }}
          onTriggerCrossword={() => {
            setShowCrossword(true);
          }}
          onTriggerSimulation={() => {
            if (gameStateRef.current) {
              startSimulationArea2(gameStateRef.current);
            }
          }}
        />
      )}

      {/* ── 6. DISCOVERY SCIENTIFIC MODAL ── */}
      {activeDiscoveryIndex !== null && activeArea.discoveries[activeDiscoveryIndex] && (
        <DiscoveryModal
          discovery={activeArea.discoveries[activeDiscoveryIndex]}
          areaName={activeArea.name}
          location={activeArea.location}
          onClose={() => {
            const disc = activeArea.discoveries[activeDiscoveryIndex];
            if (disc && gameStateRef.current) {
              gameStateRef.current.discoveredPoints.add(disc.id);
              if (currentAreaIndex === 0) {
                if (activeDiscoveryIndex === 0) gameStateRef.current.discoveredPoints.add('l2_q_disc_prep');
                if (activeDiscoveryIndex === 1) gameStateRef.current.discoveredPoints.add('l2_q_disc_action');
              } else if (currentAreaIndex === 2) {
                if (activeDiscoveryIndex === 0) gameStateRef.current.discoveredPoints.add('disc-post-safety');
                if (activeDiscoveryIndex === 1) gameStateRef.current.discoveredPoints.add('disc-post-coordination');
              }
              saveLevel2Progress(gameStateRef.current, activeUserId);

              let readInArea = 0;
              if (currentAreaIndex === 0) {
                if (gameStateRef.current.discoveredPoints.has('l2_q_disc_prep') || gameStateRef.current.discoveredPoints.has('disc-earthquake-prep')) readInArea++;
                if (gameStateRef.current.discoveredPoints.has('l2_q_disc_action') || gameStateRef.current.discoveredPoints.has('disc-earthquake-action')) readInArea++;
              } else if (currentAreaIndex === 2) {
                if (gameStateRef.current.discoveredPoints.has('disc-post-safety')) readInArea++;
                if (gameStateRef.current.discoveredPoints.has('disc-post-coordination')) readInArea++;
              } else {
                readInArea = activeArea.discoveries.filter((d) => gameStateRef.current!.discoveredPoints.has(d.id)).length;
              }
              setDiscoveredInArea(readInArea);
            }
            setActiveDiscoveryIndex(null);
          }}
        />
      )}

      {/* ── 7. TEKA-TEKI SILANG (TTS) GERBANG EVALUASI (AREA 1 & AREA 2) ── */}
      {showCrossword && (
        <CrosswordModal
          areaIndex={currentAreaIndex}
          onSuccess={handleCrosswordSuccess}
          onClose={() => setShowCrossword(false)}
        />
      )}

      {/* ── 8. MINI CHALLENGE GERBANG EVALUASI (AREA 2) ── */}
      {showMiniChallenge && activeArea.challenge && (
        <MiniChallengeModal
          challenge={activeArea.challenge}
          onSuccess={handleMiniChallengeSuccess}
          onClose={() => setShowMiniChallenge(false)}
        />
      )}

      {/* ── 9. LEVEL 2 VICTORY MODAL (SEPERTI LEVEL 1 CORE CHALLENGE VICTORY) ── */}
      {showVictoryModal && (
        <TectonicVictoryModal
          collectedCrystals={collectedCount}
          totalCrystals={totalCrystals}
          onClose={() => setShowVictoryModal(false)}
        />
      )}
    </div>
  );
}
