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
  startSimulationArea5,
  retryVolcanoPhase,
  retryVolcanoRescuePhase,
  getNpcDialogueTreeL2,
  type GameStateL2,
} from './gameEngine';
import { TOTAL_CRYSTALS_L2 } from './zones';
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
import SeismographModal from '../SeismographModal';
import Wordle from '../../Level1/Wordle';
import VisualNovelDialogueL2 from '../VisualNovelDialogueL2';
import { VolcanoPhaseModal, type VolcanoPhaseType } from '../VolcanoPhaseModal';
import { VolcanoRescueFailedModal } from '../VolcanoRescueFailedModal';
import { DIALOGUE_TREES_L2, type DialogueTreeL2 } from '../dialogueDataL2';
import PixelIcon from '../../../components/PixelIcon';
import TelemetryHUD from '../../Level1/EarthDive/TelemetryHUD';
import { retroAudio } from '../../../utils/retroAudio';
import { toggleFullscreen, isFullscreenActive } from '../../../utils/fullscreen';
import { useAuthStore, getActiveCustomAvatar } from '../../../store/teacherStore';
import { syncLevel2Progress } from '../level2Sync';
import JourneyProgressTracker, {
  LEVEL2_TRACKER_AREAS,
  type JourneyProgressTrackerRef,
} from '../../../components/JourneyProgressTracker';
import ResqyTutorialOverlay from '../../../components/Tutorial/ResqyTutorialOverlay';
import { TUTORIAL_TOURS } from '../../../components/Tutorial/tutorialConfig';

export default function TectonicGame() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef<GameStateL2 | null>(null);
  const rafRef = useRef<number>(0);
  const journeyTrackerRef = useRef<JourneyProgressTrackerRef>(null);

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
  const [showSeismographModal, setShowSeismographModal] = useState(false);
  const [showPgaWordle, setShowPgaWordle] = useState(false);
  const [isGateLockedModalOpen, setIsGateLockedModalOpen] = useState(false);
  const [discoveryWarning, setDiscoveryWarning] = useState<{ read: number; total: number } | null>(null);

  // Cek apakah gerbang evaluasi TTS / tantangan di area saat ini sudah berhasil diselesaikan & terbuka
  const isCurrentGateUnlocked = useCallback(() => {
    const state = gameStateRef.current;
    if (!state) return false;
    if (currentAreaIndex === 0) return state.unlockedGates.has('l2_gate_gempa');
    if (currentAreaIndex === 1) return state.unlockedGates.has('l2_gate_gempa_sim');
    if (currentAreaIndex === 2) return state.unlockedGates.has('l2_gate_pascabencana');
    if (currentAreaIndex === 3) return state.unlockedGates.has('l2_gate_volcano_prep');
    if (currentAreaIndex === 4) return state.unlockedGates.has('l2_gate_volcano_sim');
    if (currentAreaIndex === 5) return state.unlockedGates.has('l2_gate_shelter_recovery');
    return false;
  }, [currentAreaIndex]);

  // HUD States (Dimuat langsung dari save data akun aktif)
  const [playerHp, setPlayerHp] = useState(() => {
    const saved = loadLevel2Progress(activeUserId);
    return saved?.playerHealth ?? 100;
  });
  const [collectedCount, setCollectedCount] = useState(() => {
    const saved = loadLevel2Progress(activeUserId);
    return Math.min(TOTAL_CRYSTALS_L2, saved?.collectedCrystals?.length ?? 0);
  });
  const [totalCrystals] = useState(TOTAL_CRYSTALS_L2); // Total 21 kristal (4 di Area 1, 3 di Area 2, 4 di Area 3, 3 di Area 4, 3 di Area 5, 4 di Area 6)
  const [discoveredInArea, setDiscoveredInArea] = useState(0);
  const [simPhase, setSimPhase] = useState<string>('idle');
  const [activeScenario, setActiveScenario] = useState<'moderate' | 'severe'>('moderate');
  const [activeVolcanoScenario, setActiveVolcanoScenario] = useState<'explosive' | 'effusive'>('explosive');
  const [activeVolcanoPhaseModal, setActiveVolcanoPhaseModal] = useState<VolcanoPhaseType | null>(null);
  const [isVolcanoFailed, setIsVolcanoFailed] = useState(false);
  const [volcanoFailureReason, setVolcanoFailureReason] = useState<string | undefined>(undefined);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [nearInteractablePrompt, setNearInteractablePrompt] = useState<string | null>(null);
  const nearPromptRef = useRef<string | null>(null);
  const discoveredInAreaRef = useRef<number>(0);

  // Handler memilih dan menjalankan skenario simulasi gempa (Gempa Sedang / Gempa Besar)
  const handleSelectScenario = useCallback((scenario: 'moderate' | 'severe') => {
    retroAudio.playSelect();
    setActiveScenario(scenario);
    if (gameStateRef.current) {
      startSimulationArea2(gameStateRef.current, scenario);
      setSimPhase('teaching');
      if (gameStateRef.current.activeDialogueTree) {
        setActiveDialogueTree(gameStateRef.current.activeDialogueTree);
      }
    }
  }, []);

  // Handler memilih dan menjalankan skenario simulasi erupsi gunung api (Eksplosif / Efusif)
  const handleSelectVolcanoScenario = useCallback((scenario: 'explosive' | 'effusive') => {
    retroAudio.playSelect();
    setActiveVolcanoScenario(scenario);
    if (gameStateRef.current) {
      if (gameStateRef.current.volcanoSim) {
        gameStateRef.current.volcanoSim.scenario = scenario;
      }
      startSimulationArea5(gameStateRef.current, scenario);
      setActiveVolcanoPhaseModal('NORMAL');
    }
  }, []);

  // Handler transisi melanjutkan fase status Merapi dari modal popup
  const handleContinueVolcanoPhase = useCallback(() => {
    retroAudio.playSelect();
    const currentModal = activeVolcanoPhaseModal;
    setActiveVolcanoPhaseModal(null);
    const state = gameStateRef.current;
    if (!state || !state.volcanoSim) return;

    if (currentModal === 'NORMAL') {
      state.volcanoSim.phase = 'fase1_normal_exploring';
      state.volcanoSim.fase1Timer = 120; // 2 detik mengamati keindahan lereng normal
    } else if (currentModal === 'WASPADA') {
      state.volcanoSim.phase = 'fase2_waspada_evac';
      state.volcanoSim.statusLevel = 'WASPADA';
      state.volcanoSim.volcanoPlume = 'white_steam';
    } else if (currentModal === 'SIAGA') {
      state.volcanoSim.phase = 'fase3_siaga_migration';
      state.volcanoSim.statusLevel = 'SIAGA';
      state.volcanoSim.volcanoPlume = 'dark_ash';
      state.volcanoSim.skyDimFactor = 0.65;
      state.volcanoSim.vegetationWither = 0.45;
    } else if (currentModal === 'AWAS') {
      state.volcanoSim.phase = 'fase4_awas_earthquake';
      state.volcanoSim.statusLevel = 'AWAS';
      state.volcanoSim.earthquakeTimer = 120; // 2 detik gempa bumi besar 5.2 SR
      state.volcanoSim.skyDimFactor = 1.0;
      state.volcanoSim.vegetationWither = 0.85;
    }
  }, [activeVolcanoPhaseModal]);

  // Handler retry untuk mengulang evakuasi 3 warga dusun saat batas 15 detik habis
  const handleRetryVolcanoRescue = useCallback(() => {
    retroAudio.playSelect();
    setIsVolcanoFailed(false);
    if (gameStateRef.current) {
      retryVolcanoRescuePhase(gameStateRef.current);
    }
  }, []);

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
    showSeismographModal ||
    showPgaWordle ||
    discoveryWarning !== null ||
    isGateLockedModalOpen ||
    activeDialogueTree !== null ||
    activeVolcanoPhaseModal !== null ||
    simPhase === 'failed' ||
    isVolcanoFailed;

  // ── INIT GAME STATE & INPUTS (SCOPED TO ACTIVE USER) ──
  useEffect(() => {
    initPlayerInputL2();

    // Pastikan gameState selalu dimuat eksklusif untuk activeUserId saat ini
    const state = createInitialGameStateL2(activeUserId);
    gameStateRef.current = state;
    setCurrentAreaIndex(state.currentAreaIndex);
    setPlayerHp(state.player.health);
    setCollectedCount(Math.min(TOTAL_CRYSTALS_L2, state.collectedCrystals.size));
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
            } catch { }
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
            } catch { }
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
            } catch { }
          }
        }, 650);
        return () => window.clearTimeout(timer);
      }
    } else if (currentAreaIndex === 3) {
      const seenKey = `resqbox_l2_mascot_area3_seen_${activeUserId}`;
      const hasSeen = localStorage.getItem(seenKey);
      if (!hasSeen) {
        const timer = window.setTimeout(() => {
          const tree = DIALOGUE_TREES_L2['resqy_briefing_area4'];
          if (tree) {
            setActiveDialogueTree(tree);
            try {
              localStorage.setItem(seenKey, 'true');
            } catch { }
          }
        }, 650);
        return () => window.clearTimeout(timer);
      }
    } else if (currentAreaIndex === 4) {
      // Area 5 (Simulasi Erupsi Merapi): Resqy akan otomatis menyapa dan memberikan pilihan simulasi
      // tepat setelah banner nama area selesai ditampilkan (ditangani oleh updateGameEngineL2)
    } else if (currentAreaIndex === 5) {
      const seenKey = `resqbox_l2_mascot_area5_seen_${activeUserId}`;
      const hasSeen = localStorage.getItem(seenKey);
      if (!hasSeen) {
        const timer = window.setTimeout(() => {
          const tree = DIALOGUE_TREES_L2['resqy_briefing_area6'];
          if (tree) {
            setActiveDialogueTree(tree);
            try {
              localStorage.setItem(seenKey, 'true');
            } catch { }
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
    (window as any).__startSimulationArea2 = (scenario: 'moderate' | 'severe' = 'moderate') => {
      if (gameStateRef.current) {
        startSimulationArea2(gameStateRef.current, scenario);
        setActiveScenario(scenario);
        setSimPhase('teaching');
        if (gameStateRef.current.activeDialogueTree) {
          setActiveDialogueTree(gameStateRef.current.activeDialogueTree);
        }
      }
    };
    (window as any).__startSimulationArea5 = () => {
      if (gameStateRef.current) {
        startSimulationArea5(gameStateRef.current);
        if (gameStateRef.current.activeDialogueTree) {
          setActiveDialogueTree(gameStateRef.current.activeDialogueTree);
        }
      }
    };
    (window as any).__showVictoryL2 = () => setShowVictoryModal(true);
    (window as any).__resetLevel2 = () => {
      clearLevel2Progress(activeUserId);
      try {
        localStorage.removeItem(`resqbox_l2_mascot_area0_seen_${activeUserId}`);
        localStorage.removeItem(`resqbox_l2_mascot_area1_seen_${activeUserId}`);
      } catch { }
      window.location.reload();
    };
    return () => {
      delete (window as any).__openDiscoveryL2;
      delete (window as any).__switchAreaL2;
      delete (window as any).__startSimulationArea2;
      delete (window as any).__startSimulationArea5;
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
        const clampedCrystals = Math.min(TOTAL_CRYSTALS_L2, state.collectedCrystals.size);
        setCollectedCount(clampedCrystals);
        if (state.simulation.phase !== simPhase) {
          setSimPhase(state.simulation.phase);
        }

        // Sinkronisasi status fase modal popup simulasi erupsi Merapi
        if (state.volcanoSim) {
          if (state.volcanoSim.phase === 'fase1_normal_popup' && activeVolcanoPhaseModal !== 'NORMAL') {
            setActiveVolcanoPhaseModal('NORMAL');
          } else if (state.volcanoSim.phase === 'fase2_waspada_popup' && activeVolcanoPhaseModal !== 'WASPADA') {
            setActiveVolcanoPhaseModal('WASPADA');
          } else if (state.volcanoSim.phase === 'fase3_siaga_popup' && activeVolcanoPhaseModal !== 'SIAGA') {
            setActiveVolcanoPhaseModal('SIAGA');
          } else if (state.volcanoSim.phase === 'fase4_awas_popup' && activeVolcanoPhaseModal !== 'AWAS') {
            setActiveVolcanoPhaseModal('AWAS');
          }

          const volcanoFailedNow = state.volcanoSim.phase === 'failed';
          if (volcanoFailedNow !== isVolcanoFailed) {
            setIsVolcanoFailed(volcanoFailedNow);
            if (volcanoFailedNow) {
              setVolcanoFailureReason(state.volcanoSim.failureReason);
            }
          }
        }

        if (state.pendingGateLocked) {
          setIsGateLockedModalOpen(true);
          state.pendingGateLocked = false;
        }

        // Sinkronisasi status HUD real-time (Kristal, HP, dan Temuan di Area Ini)
        if (clampedCrystals !== collectedCount) {
          setCollectedCount(clampedCrystals);
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
        } else if (state.currentAreaIndex === 3) {
          if (state.discoveredPoints.has('disc-volcano-status')) readInArea++;
          if (state.discoveredPoints.has('disc-volcano-response')) readInArea++;
        } else if (state.currentAreaIndex === 5) {
          if (state.discoveredPoints.has('disc-post-ash')) readInArea++;
          if (state.discoveredPoints.has('disc-post-sanitation')) readInArea++;
          if (state.discoveredPoints.has('disc-post-lahar')) readInArea++;
        } else {
          const currentAreaObj = LEVEL2_AREAS[state.currentAreaIndex] || LEVEL2_AREAS[0];
          readInArea = currentAreaObj.discoveries.filter((d) => state.discoveredPoints.has(d.id)).length;
        }
        if (readInArea !== discoveredInAreaRef.current) {
          discoveredInAreaRef.current = readInArea;
          setDiscoveredInArea(readInArea);
        }

        // Sync near interactable prompt (menggunakan ref untuk mencegah stale closure di RAF loop)
        if (state.nearInteractablePrompt !== nearPromptRef.current) {
          nearPromptRef.current = state.nearInteractablePrompt;
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
          if (!isCurrentGateUnlocked()) {
            setShowCrossword(true);
          }
          state.pendingCrossword = false;
        }

        if (state.pendingMiniChallenge) {
          setShowMiniChallenge(true);
          state.pendingMiniChallenge = false;
        }

        if (state.pendingPgaWordle) {
          setShowPgaWordle(true);
          state.pendingPgaWordle = false;
        }

        if (state.isAreaCompleted) {
          state.isAreaCompleted = false;

          // Save final progress Level 2 ke Supabase & Teacher Dashboard
          syncLevel2Progress(student, {
            score: 100,
            currentMission: 6,
            completedMissions: [1, 2, 3, 4, 5, 6],
            resiliencePoints: 100,
            badges: [
              'earthquake-prep',
              'earthquake-action',
              'post-disaster-master',
              'volcano-prep-master',
              'volcano-sim-hero',
              'volcano-recovery-master',
            ],
            isCompleted: true,
            statusText: 'TUNTAS: MASTER MITIGASI GEMPA & ERUPSI',
          });
          useAuthStore.getState().unlockLevel(3);
          saveLevel2Progress(state, activeUserId);
          setShowVictoryModal(true);
        }
      }

      // Render canvas dengan avatar kustom siswa
      renderTectonicGameL2(ctx, state, canvas.width, canvas.height, avatarConfig);

      // Real-time update tracker posisi petualangan karakter (Level 2: 6 Area)
      if (journeyTrackerRef.current && state) {
        const maxW = state.zone.groundProfile ? state.zone.groundProfile.length : 2200;
        const localRatio = Math.max(0, Math.min(1, state.player.x / (maxW || 2200)));
        const totalPercent = ((state.currentAreaIndex + localRatio) / 6) * 100;
        const activeCfg = LEVEL2_TRACKER_AREAS[state.currentAreaIndex];
        const metricText = activeCfg ? `${activeCfg.shortName} • ${activeCfg.metricLabel}` : `${Math.round(localRatio * 100)}%`;
        journeyTrackerRef.current.updateProgress(totalPercent, state.player.dir, metricText);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPaused, student, avatarConfig, activeUserId, currentAreaIndex]);

  // ── CROSSWORD PUZZLE SUCCESS HANDLER (AREA 1, AREA 2, AREA 3, AREA 4, AREA 6) ──
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
          score: 85,
          currentMission: 3,
          completedMissions: [1, 2, 3],
          resiliencePoints: 85,
          badges: [
            'earthquake-prep',
            'earthquake-action',
            'post-disaster-master',
          ],
          isCompleted: false,
          statusText: 'Area 3 Tuntas (85 Poin)',
        });
        retroAudio.playWin();
        setShowCrossword(false);
        return;
      } else if (currentAreaIndex === 3) {
        state.unlockedGates.add('l2_gate_volcano_prep');
        saveLevel2Progress(state, activeUserId);
        syncLevel2Progress(student, {
          score: 100,
          currentMission: 4,
          completedMissions: [1, 2, 3, 4],
          resiliencePoints: 100,
          badges: [
            'earthquake-prep',
            'earthquake-action',
            'post-disaster-master',
            'volcano-prep-master',
          ],
          isCompleted: false,
          statusText: 'Area 4 Tuntas: Pos Pengamatan Merapi (100 Poin)',
        });
        retroAudio.playWin();
        setShowCrossword(false);
        return;
      } else if (currentAreaIndex === 5) {
        state.unlockedGates.add('l2_gate_shelter_recovery');
        saveLevel2Progress(state, activeUserId);
        syncLevel2Progress(student, {
          score: 100,
          currentMission: 6,
          completedMissions: [1, 2, 3, 4, 5, 6],
          resiliencePoints: 100,
          badges: [
            'earthquake-prep',
            'earthquake-action',
            'post-disaster-master',
            'volcano-prep-master',
            'volcano-sim-hero',
            'volcano-recovery-master',
          ],
          isCompleted: false,
          statusText: 'Area 6 Tuntas: Barak Pengungsian & Pemulihan (100 Poin)',
        });
        retroAudio.playWin();
        setShowCrossword(false);
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

    // 0a. Cek klik/tap layar saat fase Simulasi Gempa (Area 2)
    const isEarthquakeSimActive =
      state.currentAreaIndex === 1 &&
      Boolean(
        state.simulation &&
        state.simulation.phase !== 'idle' &&
        state.simulation.phase !== 'completed'
      );

    if (isEarthquakeSimActive) {
      if (state.simulation.phase === 'qte_cover') {
        const inputState = readPlayerInputL2();
        inputState.interactJustPressed = true;
      }
      return; // Jangan buka dialog Resqy atau NPC saat simulasi gempa sedang aktif!
    }

    // 0b. Cek klik/tap layar saat fase Simulasi Erupsi Merapi (Area 5)
    const isVolcanoSimActive =
      state.currentAreaIndex === 4 &&
      Boolean(
        state.volcanoSim &&
        state.volcanoSim.phase !== 'idle' &&
        state.volcanoSim.phase !== 'volcano_completed'
      );

    if (isVolcanoSimActive && state.volcanoSim) {
      const vSim = state.volcanoSim;
      if (vSim.phase === 'failed') {
        retroAudio.playSelect();
        retryVolcanoPhase(state);
        return;
      }
      if (
        vSim.phase === 'fase3_siaga_prep_evac' ||
        vSim.phase === 'fase4_awas_siren' ||
        vSim.phase === 'fase4_awas_rescue' ||
        vSim.phase === 'qte_run_kentongan' ||
        vSim.phase === 'qte_rescue_villagers'
      ) {
        const inputState = readPlayerInputL2();
        inputState.interactJustPressed = true;
        return;
      }
      // Selama fase simulasi lainnya, jangan izinkan interaksi atau dialog dengan NPC/Resqy
      return;
    }

    // 1. Cek klik pada maskot Resqy melayang di belakang pundak pemain (hanya saat simulasi TIDAK berjalan)
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
            : state.currentAreaIndex === 2
              ? 'resqy_briefing_area3'
              : state.currentAreaIndex === 3
                ? 'resqy_briefing_area4'
                : state.currentAreaIndex === 4
                  ? 'resqy_briefing_area5'
                  : 'resqy_briefing_area6';
      const tree = DIALOGUE_TREES_L2[dialogueId];
      if (tree) {
        state.activeDialogueTree = tree;
        setActiveDialogueTree(tree);
      }
      return;
    }

    // 2. Cek klik pada NPC terdekat (hanya saat simulasi TIDAK berjalan)
    if (state.npcs) {
      for (const npc of state.npcs.values()) {
        if (Math.hypot(worldX - npc.x, worldY - (npc.y - 20)) < 42) {
          if (Math.hypot(state.player.x - npc.x, state.player.y - npc.y) < 130) {
            retroAudio.playSelect();
            const tree = getNpcDialogueTreeL2(state, npc);
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
      <div className="fixed top-2 sm:top-2.5 left-2 sm:left-3 right-2 sm:right-3 flex flex-wrap items-start justify-between gap-1.5 pointer-events-none z-20">
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
              className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-amber-950 hover:bg-amber-900 text-amber-200 border-2 border-amber-600/80 font-sans font-bold text-[13px] sm:text-[15px] flex items-center gap-1.5 cursor-pointer transition-transform active:translate-y-0.5 shadow-[0_2px_0_#231206] whitespace-nowrap"
              title="Kembali ke Menu Utama"
            >
              <span className="text-amber-400 font-bold">&lt;</span>
              <span>MENU</span>
            </button>

            {/* Sound Toggle */}
            <button aria-label="Nyalakan atau matikan suara"
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
            <button aria-label="Masuk atau keluar dari layar penuh"
              onClick={handleToggleFullscreen}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center cursor-pointer transition-all active:translate-y-0.5"
              title="Layar Penuh"
            >
              <PixelIcon name="fullscreen" size={13} />
            </button>

            {/* Tombol Ulangi Simulasi (Reset) untuk Area 2 dan Area 5 (Gaya Seragam) */}
            {(currentAreaIndex === 1 || currentAreaIndex === 4) && (
              <button
                onClick={() => {
                  retroAudio.playSelect();
                  if (gameStateRef.current) {
                    if (currentAreaIndex === 4) {
                      startSimulationArea5(gameStateRef.current, activeVolcanoScenario);
                      if (gameStateRef.current.activeDialogueTree) {
                        setActiveDialogueTree(gameStateRef.current.activeDialogueTree);
                      }
                    } else {
                      startSimulationArea2(gameStateRef.current, activeScenario);
                      setSimPhase('teaching');
                      if (gameStateRef.current.activeDialogueTree) {
                        setActiveDialogueTree(gameStateRef.current.activeDialogueTree);
                      }
                    }
                  }
                }}
                className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-200 border-2 border-rose-600/80 font-sans font-bold text-[13px] sm:text-[15px] flex items-center gap-1.5 cursor-pointer transition-transform active:translate-y-0.5 shadow-[0_2px_0_#4c0519] whitespace-nowrap"
                title="Ulangi Simulasi dari Awal"
              >
                <span className="text-rose-400 font-bold">↺</span>
                <span className="hidden 2xl:inline">ULANG SIMULASI</span>
                <span className="hidden sm:inline 2xl:hidden">ULANG</span>
              </button>
            )}
          </div>

          {/* Row 2: Current Area Badge Pill (Disembunyikan saat simulasi sedang aktif agar tidak menutupi QTE & status gunung) */}
          {!(
            (currentAreaIndex === 1 && simPhase !== 'idle' && simPhase !== 'completed') ||
            (currentAreaIndex === 4 && gameStateRef.current?.volcanoSim && gameStateRef.current.volcanoSim.phase !== 'idle' && gameStateRef.current.volcanoSim.phase !== 'volcano_completed')
          ) && (
              <div
                onClick={() => {
                  if (currentAreaIndex === 1 && simPhase === 'idle') {
                    const tree = DIALOGUE_TREES_L2['resqy_briefing_area2'];
                    if (tree) {
                      retroAudio.playSelect();
                      setActiveDialogueTree(tree);
                      if (gameStateRef.current) gameStateRef.current.activeDialogueTree = tree;
                    }
                  } else if (currentAreaIndex === 4 && (!gameStateRef.current?.volcanoSim || gameStateRef.current.volcanoSim.phase === 'idle')) {
                    if (gameStateRef.current) {
                      startSimulationArea5(gameStateRef.current, activeVolcanoScenario);
                      if (gameStateRef.current.activeDialogueTree) {
                        setActiveDialogueTree(gameStateRef.current.activeDialogueTree);
                      }
                    }
                  }
                }}
                className={`bg-slate-950/95 backdrop-blur-md border-2 border-amber-600/90 px-3 sm:px-4 py-1 sm:py-1.5 rounded-xl text-amber-200 font-pixel text-[13px] sm:text-[15px] md:text-base font-bold shadow-[0_4px_0_#231206] flex items-center gap-2 whitespace-nowrap ${(currentAreaIndex === 1 && simPhase === 'idle') || (currentAreaIndex === 4 && (!gameStateRef.current?.volcanoSim || gameStateRef.current.volcanoSim.phase === 'idle'))
                    ? 'cursor-pointer hover:border-amber-400 hover:scale-105 transition-all'
                    : ''
                  }`}
                title={
                  currentAreaIndex === 1 && simPhase === 'idle'
                    ? 'Klik untuk Pengarahan Resqy & Mulai Simulasi'
                    : currentAreaIndex === 4 && (!gameStateRef.current?.volcanoSim || gameStateRef.current.volcanoSim.phase === 'idle')
                      ? 'Klik untuk Pengarahan Pak Joko & Mulai Simulasi Erupsi'
                      : undefined
                }
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full ${currentAreaIndex === 1 || currentAreaIndex === 4
                      ? 'bg-rose-500 animate-ping'
                      : 'bg-emerald-400 animate-pulse'
                    } shrink-0`}
                />
                <span className="font-bold text-amber-300 uppercase tracking-wider truncate max-w-[160px] sm:max-w-none">
                  {activeArea.name}
                </span>
                {((currentAreaIndex === 1 && simPhase === 'idle') || (currentAreaIndex === 4 && (!gameStateRef.current?.volcanoSim || gameStateRef.current.volcanoSim.phase === 'idle'))) && (
                  <span className="text-[13.5px] sm:text-[13px] bg-rose-900/80 text-rose-200 px-2 py-0.5 rounded border border-rose-600 animate-pulse font-bold">
                    MULAI
                  </span>
                )}
              </div>
            )}
        </div>

        {/* TOP CENTER/RIGHT: SKENARIO SIMULASI GEMPA (AREA 2) */}
        {currentAreaIndex === 1 && (
          <div className="pointer-events-auto z-20 flex flex-col items-center gap-1 animate-fadeIn select-none">
            <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-950/95 backdrop-blur-md border-2 border-amber-600/90 p-1 sm:p-1.5 rounded-2xl shadow-[0_4px_0_#231206]">
              <div className="items-center gap-1 px-1.5 sm:px-2 border-r border-amber-800/60 hidden 2xl:flex">
                <PixelIcon name="broadcast" size={13} className="text-amber-400 shrink-0" />
                <span className="font-sans text-[14.5px] sm:text-[13px] text-amber-300 font-bold uppercase tracking-wider">
                  SKENARIO GEMPA:
                </span>
              </div>

              {/* Tombol Gempa Sedang */}
              <button
                onClick={() => handleSelectScenario('moderate')}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl font-sans text-[13px] sm:text-[15px] font-bold flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer whitespace-nowrap active:translate-y-0.5 ${activeScenario === 'moderate'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border-2 border-yellow-200 shadow-[0_3px_0_#78350f] scale-105'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-amber-200/80 border border-amber-700/50 hover:text-amber-100'
                  }`}
                title="Skenario Gempa Sedang: Evakuasi cepat dengan tas melindungi kepala"
              >
                <PixelIcon name="dot-yellow" size={11} className="shrink-0" />
                <span className="hidden 2xl:inline">GEMPA </span><span>SEDANG</span>
                {activeScenario === 'moderate' && (
                  <span className="text-[12.5px] sm:text-[13.5px] bg-amber-900/90 text-amber-100 px-1.5 py-0.5 rounded font-bold uppercase hidden sm:inline">
                    AKTIF
                  </span>
                )}
              </button>

              {/* Tombol Gempa Besar */}
              <button
                onClick={() => handleSelectScenario('severe')}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl font-sans text-[13px] sm:text-[15px] font-bold flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer whitespace-nowrap active:translate-y-0.5 ${activeScenario === 'severe'
                    ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white border-2 border-rose-300 shadow-[0_3px_0_#881337] scale-105'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-rose-200/80 border border-rose-700/50 hover:text-rose-100'
                  }`}
                title="Skenario Gempa Besar: Drop, Cover, Hold On di kolong meja lalu evakuasi"
              >
                <PixelIcon name="dot-red" size={11} className="shrink-0" />
                <span className="hidden 2xl:inline">GEMPA </span><span>BESAR</span>
                {activeScenario === 'severe' && (
                  <span className="text-[12.5px] sm:text-[13.5px] bg-rose-950/90 text-rose-100 px-1.5 py-0.5 rounded font-bold uppercase hidden sm:inline">
                    AKTIF
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* TOP CENTER/RIGHT: SKENARIO SIMULASI ERUPSI MERAPI (AREA 5) */}
        {currentAreaIndex === 4 && (
          <div className="pointer-events-auto z-20 flex flex-col items-center gap-1 animate-fadeIn select-none">
            <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-950/95 backdrop-blur-md border-2 border-orange-600/90 p-1 sm:p-1.5 rounded-2xl shadow-[0_4px_0_#231206]">
              <div className="items-center gap-1 px-1.5 sm:px-2 border-r border-orange-800/60 hidden 2xl:flex">
                <PixelIcon name="broadcast" size={13} className="text-orange-400 shrink-0" />
                <span className="font-sans text-[14.5px] sm:text-[13px] text-orange-300 font-bold uppercase tracking-wider">
                  SKENARIO ERUPSI:
                </span>
              </div>

              {/* Tombol Ledakan Eksplosif */}
              <button
                onClick={() => handleSelectVolcanoScenario('explosive')}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl font-sans text-[13px] sm:text-[15px] font-bold flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer whitespace-nowrap active:translate-y-0.5 ${activeVolcanoScenario === 'explosive'
                    ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white border-2 border-rose-300 shadow-[0_3px_0_#881337] scale-105'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-rose-200/80 border border-rose-700/50 hover:text-rose-100'
                  }`}
                title="Skenario Ledakan Eksplosif: Tekanan gas sangat tinggi, awan panas, lontaran bom batuan piroklastik & hujan abu"
              >
                <PixelIcon name="dot-red" size={11} className="shrink-0" />
                <span className="hidden 2xl:inline">LEDAKAN </span><span>EKSPLOSIF</span>
                {activeVolcanoScenario === 'explosive' && (
                  <span className="text-[12.5px] sm:text-[13.5px] bg-rose-950/90 text-rose-100 px-1.5 py-0.5 rounded font-bold uppercase hidden sm:inline">
                    AKTIF
                  </span>
                )}
              </button>

              {/* Tombol Ledakan Efusif */}
              <button
                onClick={() => handleSelectVolcanoScenario('effusive')}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl font-sans text-[13px] sm:text-[15px] font-bold flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer whitespace-nowrap active:translate-y-0.5 ${activeVolcanoScenario === 'effusive'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-2 border-yellow-200 shadow-[0_3px_0_#78350f] scale-105'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-amber-200/80 border border-amber-700/50 hover:text-amber-100'
                  }`}
                title="Skenario Ledakan Efusif: Aliran lava kental / cair berpijar perlahan mengalir di lembah"
              >
                <PixelIcon name="dot-orange" size={11} className="shrink-0" />
                <span className="hidden 2xl:inline">LEDAKAN </span><span>EFUSIF</span>
                {activeVolcanoScenario === 'effusive' && (
                  <span className="text-[12.5px] sm:text-[13.5px] bg-amber-900/90 text-amber-100 px-1.5 py-0.5 rounded font-bold uppercase hidden sm:inline">
                    AKTIF
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* TOP CENTER: STREAMLINED REAL-TIME TELEMETRY PILL (Gaya Level 1 - Disembunyikan di Area 2 & Area 5 Simulasi) */}
        {currentAreaIndex !== 1 && currentAreaIndex !== 4 && (
          <div className="pointer-events-auto z-20">
            <TelemetryHUD
              crystalsCount={Math.min(totalCrystals, collectedCount)}
              totalCrystals={totalCrystals}
              areaDiscoveriesRead={discoveredInArea}
              areaDiscoveriesTotal={activeArea.discoveries.length}
              playerHp={playerHp}
            />
          </div>
        )}
      </div>

      {/* ── 2.8 REAL-TIME JOURNEY PROGRESS TRACKER (Level 2: 6 Area Mitigasi) ── */}
      <div className="absolute bottom-9 sm:bottom-10 lg:bottom-9 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <JourneyProgressTracker
          ref={journeyTrackerRef}
          totalAreas={6}
          currentAreaIndex={currentAreaIndex}
          areas={LEVEL2_TRACKER_AREAS}
          avatarConfig={avatarConfig}
        />
      </div>

      {/* ── 3. DISCREET KEYBOARD CONTROLS GUIDE (Desktop Bottom Persis Level 1) ── */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-3 px-3.5 py-1 rounded-full bg-black/70 border border-amber-900/50 text-[12.5px] font-pixel text-slate-300 pointer-events-none z-10 select-none font-semibold">
        <span>← → Gerak</span>
        <span>↑ / [Spasi] Lompat</span>
        <span>[E] Interaksi</span>
      </div>

      {/* ── 4. FLOATING INTERACTION HINT (BOTTOM CENTER PERSIS LEVEL 1) ── */}
      {nearInteractablePrompt && !isPaused && (
        <div className="absolute bottom-28 sm:bottom-32 left-1/2 -translate-x-1/2 pointer-events-auto z-30 select-none animate-bounce w-[min(94vw,860px)] px-2">
          <div className="bg-slate-950/98 text-amber-100 border-[3.5px] border-amber-400 px-5 sm:px-8 py-3.5 sm:py-4 rounded-3xl font-extrabold text-[15px] sm:text-base md:text-xl shadow-[0_12px_36px_rgba(0,0,0,0.95)] backdrop-blur-md flex items-center justify-center gap-3 sm:gap-4 text-center leading-snug">
            <PixelIcon name="broadcast" size={24} className="text-amber-400 shrink-0 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
            <span className="uppercase tracking-wide font-black">{nearInteractablePrompt}</span>
          </div>
        </div>
      )}

      {/* ── 5. MOBILE & TABLET TOUCH CONTROLS (4-Way D-Pad + Dedicated Jump & Interact 100% PERSIS LEVEL 1) ── */}
      {(isTouchDevice || (typeof window !== 'undefined' && window.innerWidth <= 1024)) && (
        <div 
          onContextMenu={(e) => e.preventDefault()}
          className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between pointer-events-none z-30 select-none touch-none"
        >
          {/* Left 4-Way D-Pad (Atas, Bawah, Kiri, Kanan) */}
          <div className="flex flex-col items-center pointer-events-auto touch-none" onContextMenu={(e) => e.preventDefault()}>
            {/* Up button */}
            <button
              onPointerDown={() => handleMobileBtnDown('up')}
              onPointerUp={() => handleMobileBtnUp('up')}
              onPointerLeave={() => handleMobileBtnUp('up')}
              onContextMenu={(e) => e.preventDefault()}
              className="touch-control w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-blue-600 border-2 border-slate-600 text-slate-100 font-bold text-base flex items-center justify-center touch-none shadow-sm cursor-pointer select-none"
              title="Lompat ke Atas"
            >
              ▲
            </button>
            {/* Left, Center indicator, Right */}
            <div className="flex items-center gap-1 sm:gap-1.5 my-1 touch-none">
              <button
                onPointerDown={() => handleMobileBtnDown('left')}
                onPointerUp={() => handleMobileBtnUp('left')}
                onPointerLeave={() => handleMobileBtnUp('left')}
                onContextMenu={(e) => e.preventDefault()}
                className="touch-control w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-blue-600 border-2 border-slate-600 text-slate-100 font-bold text-base flex items-center justify-center touch-none shadow-sm cursor-pointer select-none"
                title="Bergerak ke Kiri"
              >
                ◀
              </button>
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-slate-700/70 border border-slate-600/80" />
              <button
                onPointerDown={() => handleMobileBtnDown('right')}
                onPointerUp={() => handleMobileBtnUp('right')}
                onPointerLeave={() => handleMobileBtnUp('right')}
                onContextMenu={(e) => e.preventDefault()}
                className="touch-control w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-blue-600 border-2 border-slate-600 text-slate-100 font-bold text-base flex items-center justify-center touch-none shadow-sm cursor-pointer select-none"
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
              onContextMenu={(e) => e.preventDefault()}
              className="touch-control w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-blue-600 border-2 border-slate-600 text-slate-100 font-bold text-base flex items-center justify-center touch-none shadow-sm cursor-pointer select-none"
              title="Merunduk / Jongkok"
            >
              ▼
            </button>
          </div>

          {/* Right Action Buttons: Dedicated Jump (LONCAT) & Interact (AKSI) */}
          <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto touch-none" onContextMenu={(e) => e.preventDefault()}>
            {/* Tombol Loncat: LONCAT */}
            <button
              onPointerDown={() => handleMobileBtnDown('jump')}
              onPointerUp={() => handleMobileBtnUp('jump')}
              onPointerLeave={() => handleMobileBtnUp('jump')}
              onContextMenu={(e) => e.preventDefault()}
              className="touch-control w-14 h-12 sm:w-16 sm:h-13 rounded-xl bg-gradient-to-b from-blue-700 to-blue-900 active:from-blue-600 active:to-blue-800 border-2 border-blue-400 text-blue-100 font-pixel text-[14.5px] sm:text-[13px] flex flex-col items-center justify-center touch-none shadow-[0_3px_0_#1e3a8a] active:translate-y-0.5 cursor-pointer select-none font-semibold"
              title="Lompat"
            >
              <span className="text-[15px] font-bold leading-none">▲</span>
              <span className="text-[12.5px] font-pixel-title mt-0.5 tracking-wider font-semibold">LONCAT</span>
            </button>

            {/* Tombol Interaksi [E] AKSI */}
            <button
              onPointerDown={() => handleMobileBtnDown('interact')}
              onPointerUp={() => handleMobileBtnUp('interact')}
              onPointerLeave={() => handleMobileBtnUp('interact')}
              onContextMenu={(e) => e.preventDefault()}
              className="touch-control w-14 h-12 sm:w-16 sm:h-13 rounded-xl bg-gradient-to-b from-amber-600 to-amber-800 active:from-amber-500 active:to-amber-700 border-2 border-amber-400 text-amber-50 font-pixel text-[14.5px] sm:text-[13px] flex flex-col items-center justify-center touch-none shadow-[0_3px_0_#78350f] active:translate-y-0.5 cursor-pointer select-none font-semibold"
              title="Interaksi (E)"
            >
              <span className="text-[13px] font-bold leading-none">[E]</span>
              <span className="text-[12.5px] font-pixel-title mt-0.5 tracking-wider font-semibold">AKSI</span>
            </button>
          </div>
        </div>
      )}

      {/* ── POPUP PERINGATAN: AKSES TURUN / AREA TERKUNCI (100% PERSIS LEVEL 1) ── */}
      {isGateLockedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm select-none animate-fadeIn">
          <div className="relative w-full max-w-xl bg-[#fef3c7] border-4 border-[#451a03] rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-[0_16px_0_#1c0d02] text-[#451a03] font-pixel text-center">
            <h3 className="text-base sm:text-lg md:text-xl font-pixel-title text-rose-950 font-bold mb-3">
              AKSES TURUN TERKUNCI!
            </h3>

            <p className="font-sans text-base sm:text-lg md:text-xl font-bold text-[#351505] leading-relaxed mb-6">
              Jalur menuju area selanjutnya masih terkunci rapat. Kamu harus menyelesaikan tantangan dari Bu Tyas di area ini terlebih dahulu untuk membuka akses turun!
            </p>

            <button
              onClick={() => {
                retroAudio.playSelect();
                setIsGateLockedModalOpen(false);
              }}
              className="w-full py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-amber-50 border-3 border-[#451a03] shadow-[0_5px_0_#231206] text-[13px] sm:text-[15px] md:text-base font-pixel-title flex items-center justify-center gap-2 cursor-pointer transition-transform active:translate-y-0.5 font-medium"
            >
              <span>SIAP, SELESAIKAN TANTANGAN PENELITI DULU</span>
            </button>
          </div>
        </div>
      )}

      {/* ── POPUP SIMULASI GAGAL (AREA 2: GEMPA SEDANG / GEMPA BESAR) ── */}
      {simPhase === 'failed' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm select-none animate-fadeIn font-pixel">
          <div className="relative w-full max-w-xl sm:max-w-2xl bg-[#1e1b4b] border-4 border-rose-500 rounded-3xl p-6 sm:p-8 shadow-[0_16px_0_#4c0519] text-white text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-950/80 border-3 border-rose-400 flex items-center justify-center text-rose-300 font-pixel-title text-2xl font-bold shadow-[0_4px_0_#4c0519] animate-pulse">
              [!]
            </div>

            <h3 className="text-base sm:text-lg md:text-xl font-pixel-title text-rose-300 font-bold mb-3 tracking-wide">
              {activeScenario === 'moderate'
                ? 'SIMULASI GEMPA SEDANG: EVAKUASI TERLAMBAT!'
                : 'SIMULASI GEMPA BESAR: TERLAMBAT BERLINDUNG!'}
            </h3>

            <p className="font-sans text-base sm:text-lg md:text-xl font-bold text-slate-100 leading-relaxed mb-5">
              {activeScenario === 'moderate'
                ? 'Kamu terlambat mengambil tas sekolah dan memulai evakuasi tertib saat gempa sedang terjadi.'
                : 'Kamu terlambat merunduk dan berlindung di bawah meja saat gempa bumi besar terjadi.'}
            </p>

            <div className="bg-rose-950/80 border-2 border-rose-700/80 rounded-2xl p-4 sm:p-5 mb-6 text-left">
              <span className="font-bold text-rose-400 block mb-1.5 font-pixel-title text-[13px] sm:text-[15px]">[TIPS KESIAPSIAGAAN]</span>
              <p className="font-sans text-[15px] sm:text-base md:text-lg text-rose-100 leading-relaxed font-medium">
                {activeScenario === 'moderate'
                  ? 'Saat gempa bumi berkekuatan sedang, segera lindungi kepala menggunakan tas sekolah atau benda tebal lainnya dan jangan panik! Segera berbaris tertib mengikuti arahan guru menuju pintu keluar dan lapangan terbuka.'
                  : 'Saat gempa bumi besar mengguncang, jangan panik atau berdiri mematung! Segera terapkan protokol Drop, Cover, and Hold On di bawah meja kokoh dalam detik-detik pertama!'}
              </p>
            </div>

            <button
              onClick={() => {
                retroAudio.playSelect();
                if (gameStateRef.current) {
                  startSimulationArea2(gameStateRef.current, activeScenario);
                  if (gameStateRef.current.activeDialogueTree) {
                    setActiveDialogueTree(gameStateRef.current.activeDialogueTree);
                  }
                }
                setSimPhase('teaching');
              }}
              className="w-full py-4 sm:py-4.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white border-3 border-rose-400 shadow-[0_5px_0_#881337] text-[13px] sm:text-[15px] md:text-base font-pixel-title flex items-center justify-center gap-2 cursor-pointer transition-transform active:translate-y-0.5 font-bold"
            >
              <span>[ULANG] ULANGI SKENARIO GEMPA {activeScenario === 'moderate' ? 'SEDANG' : 'BESAR'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ── POPUP PERINGATAN: TEMUAN GEOLOGIS BELUM SELESAI (100% PERSIS LEVEL 1) ── */}
      {discoveryWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm select-none animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#fef3c7] border-4 border-[#451a03] rounded-2xl p-5 sm:p-6 shadow-[0_12px_0_#1c0d02] text-[#451a03] font-pixel text-center">
            <h3 className="text-[15px] sm:text-base font-pixel-title text-amber-950 font-bold mb-2.5">
              TEMUAN GEOLOGIS BELUM SELESAI!
            </h3>

            <p className="font-sans text-base sm:text-lg md:text-xl font-bold text-[#351505] leading-relaxed mb-6">
              Kamu harus mengamati dan membaca seluruh Temuan Geologis di area ini (<span className="text-amber-800 font-extrabold">{discoveryWarning.read}/{discoveryWarning.total}</span>) terlebih dahulu sebelum membuka Evaluasi Gerbang!
            </p>

            <button
              onClick={() => {
                retroAudio.playSelect();
                setDiscoveryWarning(null);
              }}
              className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-amber-50 border-3 border-[#451a03] shadow-[0_4px_0_#231206] text-[13px] font-pixel-title cursor-pointer active:translate-y-0.5 font-semibold"
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
              <span className="font-pixel-title text-[12.5px] sm:text-[13.5px] text-[#b45309] tracking-widest uppercase font-bold">
                CATATAN EKSPEDISI GEOLOGI
              </span>
            </div>

            {/* Content text */}
            <p className="font-pixel text-[14.5px] sm:text-[13px] text-[#291305] leading-relaxed font-semibold whitespace-pre-line">
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
            const closingTreeId = activeDialogueTree?.id;
            setActiveDialogueTree(null);
            if (gameStateRef.current) {
              gameStateRef.current.activeDialogueTree = null;
            }
            if (closingTreeId === 'satria_sim_victory') {
              // Otomatis langsung teleport/berangkat ke Area 6 (Barak Pengungsian)!
              if (gameStateRef.current) {
                switchAreaL2(gameStateRef.current, 5, true);
                setCurrentAreaIndex(5);
              }
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
              } else if (currentAreaIndex === 3) {
                if (state.discoveredPoints.has('disc-volcano-status')) readInArea++;
                if (state.discoveredPoints.has('disc-volcano-response')) readInArea++;
              } else if (currentAreaIndex === 5) {
                if (state.discoveredPoints.has('disc-post-ash')) readInArea++;
                if (state.discoveredPoints.has('disc-post-sanitation')) readInArea++;
                if (state.discoveredPoints.has('disc-post-lahar')) readInArea++;
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
            if (!isCurrentGateUnlocked()) {
              setShowCrossword(true);
            }
          }}
          onTriggerSimulation={(scenario) => {
            const chosenScenario = scenario || activeScenario;
            setActiveScenario(chosenScenario);
            if (gameStateRef.current) {
              if (currentAreaIndex === 4) {
                startSimulationArea5(gameStateRef.current, activeVolcanoScenario);
                if (gameStateRef.current.activeDialogueTree) {
                  setActiveDialogueTree(gameStateRef.current.activeDialogueTree);
                }
              } else {
                startSimulationArea2(gameStateRef.current, chosenScenario);
                setSimPhase('teaching');
                if (gameStateRef.current.activeDialogueTree) {
                  setActiveDialogueTree(gameStateRef.current.activeDialogueTree);
                }
              }
            }
          }}
          onTriggerSeismograph={() => setShowSeismographModal(true)}
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
              } else if (currentAreaIndex === 3) {
                if (activeDiscoveryIndex === 0) gameStateRef.current.discoveredPoints.add('disc-volcano-status');
                if (activeDiscoveryIndex === 1) gameStateRef.current.discoveredPoints.add('disc-volcano-response');
              } else if (currentAreaIndex === 5) {
                if (activeDiscoveryIndex === 0) gameStateRef.current.discoveredPoints.add('disc-post-ash');
                if (activeDiscoveryIndex === 1) gameStateRef.current.discoveredPoints.add('disc-post-sanitation');
                if (activeDiscoveryIndex === 2) gameStateRef.current.discoveredPoints.add('disc-post-lahar');
              }
              saveLevel2Progress(gameStateRef.current, activeUserId);

              let readInArea = 0;
              if (currentAreaIndex === 0) {
                if (gameStateRef.current.discoveredPoints.has('l2_q_disc_prep') || gameStateRef.current.discoveredPoints.has('disc-earthquake-prep')) readInArea++;
                if (gameStateRef.current.discoveredPoints.has('l2_q_disc_action') || gameStateRef.current.discoveredPoints.has('disc-earthquake-action')) readInArea++;
              } else if (currentAreaIndex === 2) {
                if (gameStateRef.current.discoveredPoints.has('disc-post-safety')) readInArea++;
                if (gameStateRef.current.discoveredPoints.has('disc-post-coordination')) readInArea++;
              } else if (currentAreaIndex === 3) {
                if (gameStateRef.current.discoveredPoints.has('disc-volcano-status')) readInArea++;
                if (gameStateRef.current.discoveredPoints.has('disc-volcano-response')) readInArea++;
              } else if (currentAreaIndex === 5) {
                if (gameStateRef.current.discoveredPoints.has('disc-post-ash')) readInArea++;
                if (gameStateRef.current.discoveredPoints.has('disc-post-sanitation')) readInArea++;
                if (gameStateRef.current.discoveredPoints.has('disc-post-lahar')) readInArea++;
              } else {
                readInArea = activeArea.discoveries.filter((d) => gameStateRef.current!.discoveredPoints.has(d.id)).length;
              }
              setDiscoveredInArea(readInArea);
            }
            setActiveDiscoveryIndex(null);
          }}
        />
      )}

      {/* ── 7. TEKA-TEKI SILANG (TTS) GERBANG EVALUASI (AREA 1, AREA 3 & AREA 4) ── */}
      {showCrossword && !isCurrentGateUnlocked() && (
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
          collectedCrystals={Math.min(totalCrystals, collectedCount)}
          totalCrystals={totalCrystals}
          onClose={() => setShowVictoryModal(false)}
        />
      )}

      {/* ── 10. MODAL PEMBELAJARAN SEISMOGRAF & 4 BENTUK GELOMBANG STATUS MERAPI ── */}
      {showSeismographModal && (
        <SeismographModal onClose={() => setShowSeismographModal(false)} />
      )}

      {/* ── 11. KUIS WORDLE KELUAR POS PENGAMATAN MERAPI (STATUS AWAS GELOMBANG SANGAT RAPAT) ── */}
      {showPgaWordle && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="w-full max-w-xl flex flex-col items-center">
            {/* Kartu Visual Seismogram Status AWAS */}
            <div className="w-full mb-3 p-3.5 sm:p-4 rounded-2xl bg-slate-900 border-2 border-red-500 shadow-lg text-white">
              <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                  <span className="font-pixel-title text-[13px] sm:text-[15px] text-red-400 font-semibold">
                    TELEMETRI SEISMOGRAF POS PGA
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-red-950 text-red-300 font-pixel text-[13.5px] border border-red-800 font-semibold">
                  KUIS AKSES KELUAR
                </span>
              </div>

              {/* Visual Waveform Mini SVG */}
              <div className="w-full h-16 sm:h-20 bg-slate-950 rounded-xl border border-red-900/50 p-2 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-1 left-2 text-[12.5px] font-mono text-red-400/80">
                  TREMOR MENERUS SANGAT RAPAT (CONTINUOUS TREMOR)
                </div>
                <svg className="w-full h-10 stroke-red-500" viewBox="0 0 400 40" fill="none">
                  <path
                    d="M0,20 Q5,5 10,35 T20,20 T30,2 T40,38 T50,20 T60,5 T70,35 T80,20 T90,2 T100,38 T110,20 T120,5 T130,35 T140,20 T150,2 T160,38 T170,20 T180,5 T190,35 T200,20 T210,2 T220,38 T230,20 T240,5 T250,35 T260,20 T270,2 T280,38 T290,20 T300,5 T310,35 T320,20 T330,2 T340,38 T350,20 T360,5 T370,35 T380,20 T390,2 T400,38"
                    strokeWidth="1.8"
                  />
                </svg>
              </div>

              <p className="mt-2 text-[13px] sm:text-[15px] text-slate-300 leading-relaxed font-pixel font-semibold">
                <span className="text-amber-400 font-bold">SOAL:</span> Gelombang seismogram berfluktuasi <span className="text-red-400 font-bold">SANGAT RAPAT</span> tanpa jeda dan beramplitudo tinggi. Magma mendesak kuat ke permukaan. Status Merapi apakah ini? (4 Huruf)
              </p>
            </div>

            <Wordle
              targetCount={1}
              isGateChallenge={true}
              gateTitle="KUIS GELOMBANG STATUS GUNUNG API"
              customWords={[
                {
                  word: 'AWAS',
                  hint: 'Gelombang tremor menerus sangat rapat tanpa jeda, erupsi utama sedang atau segera terjadi! (Level IV)',
                },
              ]}
              onSuccess={() => {
                const state = gameStateRef.current;
                if (state) {
                  state.pgaRoomQuizSolved = true;
                  state.isInsidePgaRoom = false;
                  state.player.x = 946;
                  state.player.y = 350;
                  saveLevel2Progress(state, state.userId);
                }
                setShowPgaWordle(false);
                retroAudio.playPowerup();
              }}
              onClose={() => {
                setShowPgaWordle(false);
              }}
            />
          </div>
        </div>
      )}

      {/* ── 12. MODAL TRANSISI 4 FASE STATUS GUNUNG MERAPI (SCREENSHOT 2 STYLE) ── */}
      {activeVolcanoPhaseModal && (
        <VolcanoPhaseModal
          phase={activeVolcanoPhaseModal}
          scenario={activeVolcanoScenario}
          onContinue={handleContinueVolcanoPhase}
        />
      )}

      {/* ── 13. POPUP MODAL KEGAGALAN EVAKUASI MERAPI (FASE 4 AWAS 15 DETIK) ── */}
      {isVolcanoFailed && (
        <VolcanoRescueFailedModal
          reason={volcanoFailureReason}
          onRetry={handleRetryVolcanoRescue}
        />
      )}

      {/* ── PANDUAN INTERAKTIF RESQY (ONBOARDING GAME TUTORIAL) ── */}
      <ResqyTutorialOverlay
        tour={TUTORIAL_TOURS.level2}
        userId={activeUserId}
      />
    </div>
  );
}
