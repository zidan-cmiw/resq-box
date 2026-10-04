import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  EARTH_STRATA_DATA,
  getDiscoveryItem,
  type EarthStrata,
  type DiscoveryPoint,
} from './earthDiveData';
import TelemetryHUD from './TelemetryHUD';
import PixelEarthDiagram from '../PixelEarthDiagram';
import DiscoveryModal from './DiscoveryModal';
import CoreChallengeModal from './CoreChallengeModal';
import { SuitMerchantModal } from './SuitMerchantModal';
import VisualNovelDialogue from './VisualNovelDialogue';
import { getDialogueTree, type DialogueTree } from './dialogueData';
import { retroAudio } from '../../../utils/retroAudio';
import { toggleFullscreen, isFullscreenActive } from '../../../utils/fullscreen';
import { useAuthStore, getActiveCustomAvatar, type CustomAvatarConfig } from '../../../store/teacherStore';
import { syncEarthDiveProgress } from './earthDiveSync';
import Wordle from '../Wordle';
import PixelIcon from '../../../components/PixelIcon';
import {
  createGameState,
  initGame,
  tickGame,
  renderGame,
  saveEarthDiveProgress,
  clearEarthDiveProgress,
  onDiscoveryComplete,
  onChallengeComplete,
  onCoreChallengeComplete,
  buyAndEquipSuit,
  triggerDiveDown,
  triggerAscendUp,
  triggerDivergentSimulation,
  triggerConvergentSimulation,
  setConvergentMode,
  triggerTransformSimulation,
  handleCanvasClick,
  type GameState,
} from './engine/gameEngine';
import { getZone, ZONES, TILE, type MapObject } from './engine/zones';
import { getGameScale } from './engine/renderer';
import { setMobileButton, resetInputKeys } from './engine/player';

// ── SOAL EVALUASI SEISMIK GERBANG AKHIR ZONA (GABUNGAN & LEBIH MENANTANG) ──────
const ZONE_GATE_QUESTIONS: Record<number, { word: string; hint: string }[]> = {
  0: [ // Surface Gate
    { word: 'KERAK', hint: 'Lapisan paling luar bumi tempat kita tinggal dan paling tipis.' },
    { word: 'BENUA', hint: 'Daratan luas tempat kita hidup di atas permukaan bumi.' },
    { word: 'BATUAN', hint: 'Benda padat alami yang menyusun lapisan kerak bumi.' },
  ],
  1: [ // Crust / Kerak Bumi Gate (Sesuai materi Dr. Gea & Prof. Andini)
    { word: 'KERAK', hint: 'Lapisan paling luar bumi tempat kita tinggal, dan merupakan lapisan yang paling tipis.' },
    { word: 'BENUA', hint: 'Jenis kerak bumi di bawah daratan yang memiliki ketebalan mencapai 100 kilometer.' },
    { word: 'SAMUDRA', hint: 'Jenis kerak bumi di bawah lautan yang tipis (5-15 km), tetapi lebih padat dan berat.' },
  ],
  2: [ // Mantle Gate (Sesuai materi SMP Kelas 8: Mantel, Panas, Konveksi)
    { word: 'MANTEL', hint: 'Lapisan di bawah kerak bumi yang merupakan lapisan paling tebal (2.900 km).' },
    { word: 'KONVEKSI', hint: 'Arus perputaran panas di dalam mantel yang menggerakkan lempeng bumi.' },
  ],
  3: [ // Outer Core Gate (Sesuai materi SMP Kelas 8: Logam, Cair, Magnet)
    { word: 'NIKEL', hint: 'Bahan yang menjadi penyusun utama lapisan inti bumi adalah besi dan...' },
    { word: 'CAIRAN', hint: 'Inti luar bumi wujudnya berupa...' },
    { word: 'MAGNET', hint: 'Lapisan inti bumi luar menghasilkan medan... yang melindungi bumi dari radiasi matahari.' },
  ],
  4: [ // Inner Core Gate (Sesuai materi SMP Kelas 8: Padat, Tekanan, Pusat)
    { word: 'INTIDALAM', hint: 'Lapisan terdalam planet bumi pada kedalaman 6.371 kilometer.' },
    { word: 'PADAT', hint: 'Inti dalam berbentuk sangat ... karena tekanan yang sangat besar dari segala arah.' },
  ],
  5: [ // Batas Divergen Gate (Sesuai materi SMP Kelas 8: Pangea, Menjauh, Magma)
    { word: 'PANGEA', hint: 'Nama superbenua raksasa purba yang dulunya menyatukan seluruh daratan bumi.' },
    { word: 'MENJAUH', hint: 'Arah pergerakan dua lempeng tektonik pada batas divergen saling...' },
    { word: 'MAGMA', hint: 'Batuan cair panas dari mantel bumi yang menerobos naik mengisi celah rekahan lempeng.' },
  ],
  6: [ // Batas Konvergen Gate (Sesuai materi SMP Kelas 8: Subduksi, Palung, Merapi)
    { word: 'PALUNG', hint: 'Jurang sempit yang sangat dalam di dasar samudra akibat penunjaman lempeng.' },
    { word: 'MERAPI', hint: 'Contoh gunung berapi aktif di Indonesia yang terbentuk dari jalur subduksi lempeng.' },
  ],
  7: [ // Batas Transform Gate (Sesuai materi SMP Kelas 8: Transform, San Andreas, Sismograf)
    { word: 'TRANSFORM', hint: 'Batas lempeng tektonik di mana dua lempeng saling bergesekan mendatar berlawanan arah.' },
    { word: 'SANANDREAS', hint: 'Patahan mendatar terkenal di California yang membentang sepanjang 1.200 kilometer.' }
  ],
};

interface ActiveChallengeState {
  strata: EarthStrata;
  isGate: boolean;
  title: string;
  words: { word: string; hint: string }[];
  targetCount?: number;
  gateId?: string;
}

export default function EarthDiveGame() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<GameState | null>(null);
  const rafRef = useRef<number>(0);
  const toastTimeoutRef = useRef<number>(0);

  // Sound & Fullscreen states
  const [soundOn, setSoundOn] = useState(() => retroAudio.isEnabled());
  const [, setIsFullscreen] = useState(() => isFullscreenActive());
  const [isTouchDevice, setIsTouchDevice] = useState(false);

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

  // Student Custom Avatar from Store or direct active storage
  const student = useAuthStore((state) => state.student);
  const currentUser = useAuthStore((state) => state.currentUser);
  const unlockLevel = useAuthStore((state) => state.unlockLevel);
  const activeUserId = student?.id || currentUser?.id || currentUser?.username || 'guest';
  const [avatarConfig, setAvatarConfig] = useState<CustomAvatarConfig>(() => {
    return student?.custom_avatar || currentUser?.avatar_config || getActiveCustomAvatar();
  });

  useEffect(() => {
    const active = student?.custom_avatar || currentUser?.avatar_config || getActiveCustomAvatar();
    setAvatarConfig(active);
  }, [student?.custom_avatar, currentUser?.avatar_config]);

  // Modal & Notification states (bridged from engine)
  const [activeDiscovery, setActiveDiscovery] = useState<{ discovery: DiscoveryPoint; strata: EarthStrata } | null>(null);
  const [activeChallenge, setActiveChallenge] = useState<ActiveChallengeState | null>(null);
  const [showCoreChallenge, setShowCoreChallenge] = useState(false);
  const [showWordleBonus, setShowWordleBonus] = useState(false);
  const [inWorldSign, setInWorldSign] = useState<{
    id: string;
    text: string;
    ox: number;
    oy: number;
  } | null>(null);
  const inWorldSignRef = useRef<{ id: string; text: string; ox: number; oy: number } | null>(null);
  const signBubbleRef = useRef<HTMLDivElement>(null);
  const [isGateLockedModalOpen, setIsGateLockedModalOpen] = useState(false);
  const [discoveryWarning, setDiscoveryWarning] = useState<{ read: number; total: number } | null>(null);
  const [isRadarOpen, setIsRadarOpen] = useState(true);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isToastFading, setIsToastFading] = useState(false);

  // Reactive HUD state (synced from engine each frame)
  const [hudData, setHudData] = useState<{
    depth?: number;
    temp?: number;
    pressure?: number;
    tempString?: string;
    energy: number;
    crystals: number;
    totalCrystals: number;
    strataName: string;
    zoneIndex: number;
    nearObjectType: 'npc' | 'crystal' | 'discovery' | 'portal_down' | 'portal_up' | 'info_sign' | 'challenge_gate' | null;
    nearNpcName?: string | null;
    areaDiscoveriesRead: number;
    areaDiscoveriesTotal: number;
  }>({
    depth: 0,
    temp: 25,
    pressure: 0.1,
    tempString: '25°C',
    energy: 100,
    crystals: 0,
    totalCrystals: 0,
    strataName: 'PERMUKAAN BUMI',
    zoneIndex: 0,
    nearObjectType: null,
    nearNpcName: null,
    areaDiscoveriesRead: 0,
    areaDiscoveriesTotal: 0,
  });

  const [playerHp, setPlayerHp] = useState<number>(100);
  const [convergentMode, setConvergentModeState] = useState<'land' | 'ocean'>('land');

  // Sinkronisasi convergentMode dari game state saat area berubah atau dimuat
  useEffect(() => {
    if (gameRef.current?.convergentMode) {
      setConvergentModeState(gameRef.current.convergentMode);
    }
  }, [hudData.zoneIndex]);

  const handleSelectConvergentMode = (mode: 'land' | 'ocean') => {
    setConvergentModeState(mode);
    if (gameRef.current) {
      setConvergentMode(gameRef.current, mode);
      showToast(
        mode === 'land'
          ? 'Kondisi 1: Tumbukan Benua Daratan aktif (Pegunungan Lipatan tanpa Palung Laut).'
          : 'Kondisi 2: Subduksi Samudra-Benua aktif (Perahu Riset & Palung Laut Dalam).'
      );
    }
  };

  const showToast = useCallback((msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    setIsToastFading(false);
    toastTimeoutRef.current = window.setTimeout(() => {
      setIsToastFading(true);
      toastTimeoutRef.current = window.setTimeout(() => {
        setToastMessage(null);
        setIsToastFading(false);
      }, 400);
    }, 2800);
  }, []);

  const [activeDialogue, setActiveDialogue] = useState<DialogueTree | null>(null);
  const [activeSuitMerchant, setActiveSuitMerchant] = useState<MapObject | null>(null);
  const [suitWarningModal, setSuitWarningModal] = useState<{
    requiredSuit: string;
    suitName: string;
    zoneName: string;
    reason: string;
  } | null>(null);

  // Track if engine is paused (modal open)
  const isPaused =
    activeDiscovery !== null ||
    activeChallenge !== null ||
    showCoreChallenge ||
    showWordleBonus ||
    isGateLockedModalOpen ||
    discoveryWarning !== null ||
    activeDialogue !== null ||
    activeSuitMerchant !== null ||
    suitWarningModal !== null;

  // ── INIT GAME (SCOPED TO ACTIVE USER) ──
  useEffect(() => {
    initGame();
    // Pastikan gameRef selalu dibuat/dimuat secara eksklusif untuk activeUserId.
    // Jika activeUserId berbeda dengan userId game yang ada di memory, re-create dari awal
    // untuk mencegah kebocoran state antar-akun!
    if (!gameRef.current || gameRef.current.userId !== activeUserId) {
      const newGame = createGameState(activeUserId);
      newGame.userId = activeUserId;
      if (!newGame.unlockedGates.has('ic_challenge')) {
        let hasReadLintang = false;
        try {
          hasReadLintang = localStorage.getItem(`resqbox_read_ic_disc2_${activeUserId}`) === 'true';
        } catch {}
        if (!hasReadLintang && newGame.discoveredPoints.has('ic_disc2')) {
          newGame.discoveredPoints.delete('ic_disc2');
          newGame.discoveredPoints.delete('disc_9');
          saveEarthDiveProgress(newGame, activeUserId);
        }
      }
      gameRef.current = newGame;
      setHudData(prev => ({
        ...prev,
        depth: Math.round(newGame.player.y * 3.5),
        crystals: newGame.collectedCrystals.size,
        totalCrystals: newGame.totalCrystals,
        strataName: ZONES[newGame.currentZone]?.name || 'PERMUKAAN BUMI',
        zoneIndex: newGame.currentZone,
        nearObjectType: null,
        areaDiscoveriesRead: 0,
        areaDiscoveriesTotal: 0,
      }));
      setPlayerHp(newGame.player.health);
    } else {
      // Pembersihan instan untuk game state yang sudah aktif di memori
      const activeGame = gameRef.current;
      if (activeGame && !activeGame.unlockedGates.has('ic_challenge')) {
        let hasReadLintang = false;
        try {
          hasReadLintang = localStorage.getItem(`resqbox_read_ic_disc2_${activeUserId}`) === 'true';
        } catch {}
        if (!hasReadLintang && activeGame.discoveredPoints.has('ic_disc2')) {
          activeGame.discoveredPoints.delete('ic_disc2');
          activeGame.discoveredPoints.delete('disc_9');
          saveEarthDiveProgress(activeGame, activeUserId);
        }
      }
    }
  }, [activeUserId]);

  // ── RESET PROGRESS HANDLER (MULAI ULANG DARI PERMUKAAN BUMI 0 KM) ──
  const handleResetProgress = useCallback(() => {
    clearEarthDiveProgress(activeUserId);
    try {
      localStorage.removeItem(`resqbox_mascot_intro_seen_${activeUserId}`);
      localStorage.removeItem(`resqbox_mascot_crust_seen_${activeUserId}`);
      localStorage.removeItem(`resqbox_mascot_mantle_seen_${activeUserId}`);
      localStorage.removeItem(`resqbox_mascot_outer_core_seen_${activeUserId}`);
      localStorage.removeItem(`resqbox_mascot_inner_core_seen_${activeUserId}`);
      localStorage.removeItem(`resqbox_mascot_divergent_seen_${activeUserId}`);
      localStorage.removeItem(`resqbox_mascot_divergent_session_${activeUserId}`);
      localStorage.removeItem(`resqbox_mascot_convergent_seen_${activeUserId}`);
      localStorage.removeItem(`resqbox_mascot_convergent_session_${activeUserId}`);
      localStorage.removeItem(`resqbox_mascot_transform_seen_${activeUserId}`);
      localStorage.removeItem(`resqbox_mascot_transform_session_${activeUserId}`);
      localStorage.removeItem('resqbox_earthdive_progress');
    } catch { }

    const freshGame = createGameState(activeUserId);
    freshGame.userId = activeUserId;
    gameRef.current = freshGame;
    setHudData(prev => ({
      ...prev,
      depth: 0,
      temp: 25,
      pressure: 0.1,
      tempString: '25°C (Kerak Permukaan)',
      energy: 100,
      crystals: 0,
      totalCrystals: freshGame.totalCrystals,
      strataName: ZONES[0]?.name || 'PERMUKAAN BUMI',
      zoneIndex: 0,
      nearObjectType: null,
      areaDiscoveriesRead: 0,
      areaDiscoveriesTotal: 0,
    }));
    setPlayerHp(freshGame.player.health);
    retroAudio.playPowerup();
    showToast('Progres berhasil direset! Petualangan dimulai dari Permukaan Bumi (0 km).');
  }, [activeUserId, showToast]);

  // Pasang reset handler ke window untuk keperluan uji coba/demo konsol
  useEffect(() => {
    (window as any).__resetEarthDive = handleResetProgress;
    return () => {
      delete (window as any).__resetEarthDive;
    };
  }, [handleResetProgress]);

  // ── SOUND & FULLSCREEN HANDLERS ──
  const handleSoundToggle = () => {
    const next = retroAudio.toggleSound();
    setSoundOn(next);
  };

  const handleFullscreenToggle = () => {
    retroAudio.playSelect();
    toggleFullscreen((state) => setIsFullscreen(state));
  };

  // ── CANVAS RESIZE TO FULL VIEWPORT (HIGH-DPI & ZOOM CRISP AWARE) ──
  // Mendukung window.devicePixelRatio sehingga saat siswa melakukan zoom-in (150%, 200%, 250%)
  // atau menggunakan layar Retina iPad/Tablet, tampilan kanvas dan teks tetap tajam 100% tanpa buram.
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
    const handleFsChange = () => {
      setIsFullscreen(isFullscreenActive());
      resizeCanvas();
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('fullscreenchange', handleFsChange);
    };
  }, [resizeCanvas]);

  // ── SAVE PROGRESS ON PAGE REFRESH, TAB CLOSE, OR VISIBILITY CHANGE ──
  useEffect(() => {
    const handleSave = () => {
      if (gameRef.current && gameRef.current.userId === activeUserId) {
        saveEarthDiveProgress(gameRef.current, activeUserId);
      }
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && gameRef.current && gameRef.current.userId === activeUserId) {
        saveEarthDiveProgress(gameRef.current, activeUserId);
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

  // ── AUTO-FOCUS CANVAS & RESET KEYS WHEN ALL MODALS CLOSE ──
  useEffect(() => {
    if (!isPaused) {
      resetInputKeys();
      canvasRef.current?.focus();
    }
  }, [isPaused]);

  // ── GAME LOOP ──
  useEffect(() => {
    const loop = () => {
      const game = gameRef.current;
      const canvas = canvasRef.current;
      if (!game || !canvas) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      // Only tick if not paused
      if (!isPaused) {
        tickGame(game);

        if (game.pendingGateLocked) {
          game.pendingGateLocked = false;
          setIsGateLockedModalOpen(true);
          retroAudio.playError();
        }

        if (game.pendingSuitMerchant) {
          setActiveSuitMerchant(game.pendingSuitMerchant);
          game.pendingSuitMerchant = null;
        }

        if (game.pendingSuitRequired) {
          setSuitWarningModal(game.pendingSuitRequired);
          game.pendingSuitRequired = null;
          retroAudio.playError();
        }

        if (game.pendingAreaUnderConstruction) {
          showToast(`Jalur menuju ${game.pendingAreaUnderConstruction} sedang disiapkan! Silakan jelajahi area ini terlebih dahulu.`);
          game.pendingAreaUnderConstruction = null;
          retroAudio.playSelect();
        }

        if (game.pendingDiscoveryRequired) {
          setDiscoveryWarning(game.pendingDiscoveryRequired);
          game.pendingDiscoveryRequired = null;
          retroAudio.playError();
        }

        setPlayerHp(game.player.health);

        // Check engine pending modal triggers
        if (game.pendingNpcDialogue) {
          let dialogueId = (game.pendingNpcDialogue.data?.dialogueId as string) || 'prof_raditya_dialogue';

          // Dynamic routing untuk NPC Area 2 (Kerak Bumi)
          if (dialogueId === 'prof_andini_dialogue' || dialogueId === 'z1_lintang_dialogue') {
            if (game.discoveredPoints.has('crust_disc_compare')) {
              dialogueId = 'prof_andini_review_dialogue';
            }
          } else if (dialogueId === 'komandan_hendra_dialogue' || dialogueId === 'z1_bu_tyas_dialogue') {
            const hasDiscovery = game.discoveredPoints.has('crust_disc_compare');
            const isUnlocked = game.unlockedGates.has('crust_challenge');
            if (isUnlocked) {
              dialogueId = 'komandan_hendra_unlocked_dialogue';
            } else if (!hasDiscovery) {
              dialogueId = 'komandan_hendra_locked_dialogue';
            } else {
              dialogueId = 'komandan_hendra_ready_dialogue';
            }
          }
          // Dynamic routing untuk NPC Area 3 (Mantel Bumi)
          else if (dialogueId === 'prof_sarah_dialogue' || dialogueId === 'z2_zahra_dialogue') {
            if (game.discoveredPoints.has('mantle_disc1')) {
              dialogueId = 'prof_sarah_review_dialogue';
            }
          } else if (dialogueId === 'dr_danang_dialogue' || dialogueId === 'z2_lintang_dialogue') {
            if (game.discoveredPoints.has('mantle_disc2')) {
              dialogueId = 'dr_danang_review_dialogue';
            }
          } else if (dialogueId === 'komandan_surya_dialogue' || dialogueId === 'z2_bu_tyas_dialogue') {
            const hasDiscoveries = game.discoveredPoints.has('mantle_disc1') && game.discoveredPoints.has('mantle_disc2');
            const isUnlocked = game.unlockedGates.has('mantle_challenge');
            if (isUnlocked) {
              dialogueId = 'komandan_surya_unlocked_dialogue';
            } else if (!hasDiscoveries) {
              dialogueId = 'komandan_surya_locked_dialogue';
            } else {
              dialogueId = 'komandan_surya_ready_dialogue';
            }
          }
          // Dynamic routing untuk NPC Area 4 (Inti Luar)
          else if (dialogueId === 'prof_ratna_dialogue' || dialogueId === 'z3_zahra_dialogue') {
            if (game.discoveredPoints.has('oc_disc1')) {
              dialogueId = 'prof_ratna_review_dialogue';
            }
          } else if (dialogueId === 'dr_aris_dialogue' || dialogueId === 'z3_lintang_dialogue') {
            if (game.discoveredPoints.has('oc_disc2')) {
              dialogueId = 'dr_aris_review_dialogue';
            }
          } else if (dialogueId === 'komandan_teguh_dialogue' || dialogueId === 'z3_bu_tyas_dialogue') {
            const hasDiscoveries = game.discoveredPoints.has('oc_disc1') && game.discoveredPoints.has('oc_disc2');
            const isUnlocked = game.unlockedGates.has('oc_challenge');
            if (isUnlocked) {
              dialogueId = 'komandan_teguh_unlocked_dialogue';
            } else if (!hasDiscoveries) {
              dialogueId = 'komandan_teguh_locked_dialogue';
            } else {
              dialogueId = 'komandan_teguh_ready_dialogue';
            }
          }
          // Dynamic routing untuk NPC Area 5 (Inti Dalam)
          else if (dialogueId === 'prof_lestari_dialogue' || dialogueId === 'z4_zahra_dialogue') {
            if (game.discoveredPoints.has('ic_disc1')) {
              dialogueId = 'prof_lestari_review_dialogue';
            }
          } else if (dialogueId === 'dr_farhan_dialogue' || dialogueId === 'z4_lintang_dialogue') {
            if (game.discoveredPoints.has('ic_disc2')) {
              dialogueId = 'dr_farhan_review_dialogue';
            }
          } else if (dialogueId === 'komandan_bintang_dialogue' || dialogueId === 'z4_bu_tyas_dialogue') {
            const hasDiscoveries = game.discoveredPoints.has('ic_disc1') && game.discoveredPoints.has('ic_disc2');
            const isUnlocked = game.unlockedGates.has('ic_challenge');
            if (isUnlocked) {
              dialogueId = 'komandan_bintang_unlocked_dialogue';
            } else if (!hasDiscoveries) {
              dialogueId = 'komandan_bintang_locked_dialogue';
            } else {
              dialogueId = 'komandan_bintang_ready_dialogue';
            }
          }
          // Dynamic routing untuk NPC Area 6 (Batas Divergen & Lembah Retakan)
          else if (dialogueId === 'prof_maya_dialogue' || dialogueId === 'z5_zahra_dialogue') {
            if (game.discoveredPoints.has('div_disc1')) {
              dialogueId = 'prof_maya_review_dialogue';
            }
          } else if (dialogueId === 'dr_citra_dialogue' || dialogueId === 'z5_lintang_dialogue') {
            if (game.discoveredPoints.has('div_disc2')) {
              dialogueId = 'dr_citra_review_dialogue';
            }
          } else if (dialogueId === 'komandan_satria_dialogue' || dialogueId === 'z5_bu_tyas_dialogue') {
            const hasDiscoveries =
              game.discoveredPoints.has('div_disc1') &&
              game.discoveredPoints.has('div_disc2');
            const isUnlocked = game.unlockedGates.has('divergent_challenge');
            if (isUnlocked) {
              dialogueId = 'komandan_satria_unlocked_dialogue';
            } else if (!hasDiscoveries) {
              dialogueId = 'komandan_satria_locked_dialogue';
            } else {
              dialogueId = 'komandan_satria_ready_dialogue';
            }
          }
          // Dynamic routing untuk NPC Area 7 (Batas Konvergen & Zona Subduksi)
          else if (dialogueId === 'dr_farhan_conv_dialogue' || dialogueId === 'z6_zidane_dialogue') {
            if (game.discoveredPoints.has('conv_disc1')) {
              dialogueId = 'dr_farhan_conv_review_dialogue';
            } else if (game.convergentMode === 'land') {
              dialogueId = 'dr_farhan_conv_land_dialogue';
            }
          } else if (dialogueId === 'prof_ratna_conv_dialogue' || dialogueId === 'z6_zahra_dialogue') {
            if (game.discoveredPoints.has('conv_disc2')) {
              dialogueId = 'prof_ratna_conv_review_dialogue';
            }
          } else if (dialogueId === 'komandan_arya_dialogue' || dialogueId === 'z6_bu_tyas_dialogue') {
            const hasDiscoveries =
              game.discoveredPoints.has('conv_disc1') &&
              game.discoveredPoints.has('conv_disc2');
            const isUnlocked = game.unlockedGates.has('convergent_challenge');
            if (isUnlocked) {
              dialogueId = 'komandan_arya_unlocked_dialogue';
            } else if (!hasDiscoveries) {
              dialogueId = 'komandan_arya_locked_dialogue';
            } else {
              dialogueId = 'komandan_arya_ready_dialogue';
            }
          }
          // Dynamic routing untuk NPC Area 8 (Batas Transform)
          else if (dialogueId === 'dr_taufik_trans_dialogue' || dialogueId === 'z7_zahra_dialogue') {
            if (
              game.discoveredPoints.has('trans_sanandreas') ||
              game.discoveredPoints.has('trans_disc2') ||
              game.discoveredPoints.has('disc_16')
            ) {
              dialogueId = 'dr_taufik_trans_review_dialogue';
            }
          } else if (dialogueId === 'komandan_guntur_dialogue' || dialogueId === 'z7_bu_tyas_dialogue') {
            const hasDiscoveries =
              game.discoveredPoints.has('trans_sanandreas') ||
              game.discoveredPoints.has('trans_disc2') ||
              game.discoveredPoints.has('disc_16');
            const isUnlocked = game.unlockedGates.has('transform_challenge');
            if (isUnlocked) {
              dialogueId = 'komandan_guntur_unlocked_dialogue';
            } else if (!hasDiscoveries) {
              dialogueId = 'komandan_guntur_locked_dialogue';
            } else {
              dialogueId = 'komandan_guntur_ready_dialogue';
            }
          }

          const tree = getDialogueTree(dialogueId);
          if (tree) {
            setActiveDialogue(tree);
          }
          game.pendingNpcDialogue = null;
        }

        if (game.pendingDiscovery) {
          const discoveryId = (game.pendingDiscovery.data?.discoveryId as number) ?? 0;
          const discItem = getDiscoveryItem(discoveryId);
          if (discItem) {
            setActiveDiscovery(discItem);
            onDiscoveryComplete(game, game.pendingDiscovery.id);
            const discKey = (game.pendingDiscovery.data?.discoveryKey as string) || '';
            if (discKey) onDiscoveryComplete(game, discKey);
            if (discoveryId === 15) {
              game.discoveredPoints.add('trans_seismo');
              game.discoveredPoints.add('trans_disc1');
              game.discoveredPoints.add('disc_15');
            } else if (discoveryId === 16) {
              game.discoveredPoints.add('trans_sanandreas');
              game.discoveredPoints.add('trans_disc2');
              game.discoveredPoints.add('disc_16');
            }
            saveEarthDiveProgress(game, activeUserId);
          } else {
            game.pendingDiscovery = null;
          }
        }

        if (game.pendingChallenge) {
          if (game.currentZone === 1) {
            // Rute interaksi gerbang Kerak Bumi melalui Komandan Hendra
            const hasDiscovery = game.discoveredPoints.has('crust_disc_compare');
            const isUnlocked = game.unlockedGates.has('crust_challenge');
            let dialogueId = 'komandan_hendra_ready_dialogue';
            if (isUnlocked) dialogueId = 'komandan_hendra_unlocked_dialogue';
            else if (!hasDiscovery) dialogueId = 'komandan_hendra_locked_dialogue';
            const tree = getDialogueTree(dialogueId);
            if (tree) setActiveDialogue(tree);
          } else if (game.currentZone === 2) {
            const hasDiscoveries = game.discoveredPoints.has('mantle_disc1') && game.discoveredPoints.has('mantle_disc2');
            const isUnlocked = game.unlockedGates.has('mantle_challenge');
            let dialogueId = 'komandan_surya_ready_dialogue';
            if (isUnlocked) dialogueId = 'komandan_surya_unlocked_dialogue';
            else if (!hasDiscoveries) dialogueId = 'komandan_surya_locked_dialogue';
            const tree = getDialogueTree(dialogueId);
            if (tree) setActiveDialogue(tree);
          } else if (game.currentZone === 3) {
            const hasDiscoveries = game.discoveredPoints.has('oc_disc1') && game.discoveredPoints.has('oc_disc2');
            const isUnlocked = game.unlockedGates.has('oc_challenge');
            let dialogueId = 'komandan_teguh_ready_dialogue';
            if (isUnlocked) dialogueId = 'komandan_teguh_unlocked_dialogue';
            else if (!hasDiscoveries) dialogueId = 'komandan_teguh_locked_dialogue';
            const tree = getDialogueTree(dialogueId);
            if (tree) setActiveDialogue(tree);
          } else if (game.currentZone === 4) {
            const hasDiscoveries = game.discoveredPoints.has('ic_disc1') && game.discoveredPoints.has('ic_disc2');
            const isUnlocked = game.unlockedGates.has('ic_challenge');
            let dialogueId = 'komandan_bintang_ready_dialogue';
            if (isUnlocked) dialogueId = 'komandan_bintang_unlocked_dialogue';
            else if (!hasDiscoveries) dialogueId = 'komandan_bintang_locked_dialogue';
            const tree = getDialogueTree(dialogueId);
            if (tree) setActiveDialogue(tree);
          } else if (game.currentZone === 5) {
            const hasDiscoveries =
              game.discoveredPoints.has('div_disc1') &&
              game.discoveredPoints.has('div_disc2');
            const isUnlocked = game.unlockedGates.has('divergent_challenge');
            let dialogueId = 'komandan_satria_ready_dialogue';
            if (isUnlocked) dialogueId = 'komandan_satria_unlocked_dialogue';
            else if (!hasDiscoveries) dialogueId = 'komandan_satria_locked_dialogue';
            const tree = getDialogueTree(dialogueId);
            if (tree) setActiveDialogue(tree);
          } else if (game.currentZone === 6) {
            const hasDiscoveries =
              game.discoveredPoints.has('conv_disc1') &&
              game.discoveredPoints.has('conv_disc2');
            const isUnlocked = game.unlockedGates.has('convergent_challenge');
            let dialogueId = 'komandan_arya_ready_dialogue';
            if (isUnlocked) dialogueId = 'komandan_arya_unlocked_dialogue';
            else if (!hasDiscoveries) dialogueId = 'komandan_arya_locked_dialogue';
            const tree = getDialogueTree(dialogueId);
            if (tree) setActiveDialogue(tree);
          } else if (game.currentZone === 7) {
            const hasDiscoveries =
              game.discoveredPoints.has('trans_sanandreas') ||
              game.discoveredPoints.has('trans_disc2') ||
              game.discoveredPoints.has('disc_16');
            const isUnlocked = game.unlockedGates.has('transform_challenge');
            let dialogueId = 'komandan_guntur_ready_dialogue';
            if (isUnlocked) dialogueId = 'komandan_guntur_unlocked_dialogue';
            else if (!hasDiscoveries) dialogueId = 'komandan_guntur_locked_dialogue';
            const tree = getDialogueTree(dialogueId);
            if (tree) setActiveDialogue(tree);
          }
          game.pendingChallenge = null;
        }

        // Deteksi apakah pemain sedang berada di dekat papan catatan geologi (info_sign)
        const isNearSign = game.nearObject?.type === 'info_sign' ? game.nearObject : null;
        if (isNearSign) {
          const signText = (isNearSign.data?.text as string) || '';
          const ox = isNearSign.px !== undefined ? isNearSign.px : isNearSign.x * TILE;
          const oy = isNearSign.py !== undefined ? isNearSign.py : isNearSign.y * TILE;

          if (inWorldSignRef.current?.id !== isNearSign.id) {
            const nextSign = { id: isNearSign.id, text: signText, ox, oy };
            inWorldSignRef.current = nextSign;
            setInWorldSign(nextSign);
            retroAudio.playSelect();
          }
        } else if (inWorldSignRef.current) {
          inWorldSignRef.current = null;
          setInWorldSign(null);
        }

        // Update posisi floating speech bubble secara real-time tepat di atas papan catatan
        if (signBubbleRef.current && inWorldSignRef.current) {
          const sign = inWorldSignRef.current;
          const scale = getGameScale(canvas.width, canvas.height);
          const sx = (sign.ox + 16 - Math.round(game.camera.x)) * scale;
          const sy = (sign.oy - Math.round(game.camera.y)) * scale;

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

        if (game.pendingCoreChallenge) {
          setShowCoreChallenge(true);
          game.pendingCoreChallenge = false;
        }

        // Wordle evaluation after core synthesis completed
        if (game.pendingWordleEvaluation) {
          setShowWordleBonus(true);
          game.pendingWordleEvaluation = false;
        }

        // Update HUD data
        const zone = getZone(game.currentZone);
        let strataData = null;
        if (zone.id === 'surface') strataData = null;
        else if (zone.id === 'crust') strataData = EARTH_STRATA_DATA.find((s) => s.id === 'litosfer') || null;
        else if (zone.id === 'mantle') strataData = EARTH_STRATA_DATA.find((s) => s.id === 'astenosfer') || null;
        else if (zone.id === 'outerCore') strataData = EARTH_STRATA_DATA.find((s) => s.id === 'inti-luar') || null;
        else if (zone.id === 'innerCore') strataData = EARTH_STRATA_DATA.find((s) => s.id === 'inti-dalam') || null;
        else if (zone.id === 'divergent') strataData = EARTH_STRATA_DATA.find((s) => s.id === 'divergen') || null;
        else if (zone.id === 'convergent') strataData = EARTH_STRATA_DATA.find((s) => s.id === 'konvergen') || null;
        else if (zone.id === 'transform') strataData = EARTH_STRATA_DATA.find((s) => s.id === 'transform') || null;
        else {
          const strataIdx = game.currentZone - 1;
          strataData = strataIdx >= 0 ? EARTH_STRATA_DATA[Math.min(strataIdx, EARTH_STRATA_DATA.length - 1)] : null;
        }
        const zoneDiscoveries = zone.objects.filter((o) => o.type === 'discovery' || o.data?.isDiscoveryNpc);
        const areaDiscoveriesTotal = zoneDiscoveries.length;
        const areaDiscoveriesRead = zoneDiscoveries.filter((o) => {
          const key = (o.data?.discoveryKey as string) || o.id;
          return (
            game.discoveredPoints.has(key) ||
            game.discoveredPoints.has(o.id) ||
            (o.data?.discoveryId !== undefined && (
              game.discoveredPoints.has(`disc_${o.data.discoveryId}`) ||
              game.discoveredPoints.has(String(o.data.discoveryId))
            )) ||
            (zone.id === 'transform' && (
              game.discoveredPoints.has('trans_sanandreas') ||
              game.discoveredPoints.has('trans_disc2') ||
              game.discoveredPoints.has('disc_16')
            ))
          );
        }).length;
        const isBoundaryZone = zone.id === 'divergent' || zone.id === 'convergent' || zone.id === 'transform';
        const tempString = isBoundaryZone ? undefined : (strataData?.tempRange ? strataData.tempRange.split('•')[0].trim() : `${strataData?.tempCelsius ?? 25}°C`);

        const nearNpcName = game.nearObject?.type === 'npc'
          ? ((game.nearObject.data?.name as string) || game.npcStates.get(game.nearObject.id)?.name || null)
          : null;

        setHudData({
          depth: isBoundaryZone ? undefined : (strataData?.targetDepthKm ?? 0),
          temp: isBoundaryZone ? undefined : (strataData?.tempCelsius ?? 25),
          tempString,
          pressure: isBoundaryZone ? undefined : (strataData?.pressureGpa ?? 1),
          strataName: zone.name,
          energy: Math.max(0, 100 - game.currentZone * 15),
          crystals: game.collectedCrystals.size,
          totalCrystals: game.totalCrystals,
          areaDiscoveriesRead,
          areaDiscoveriesTotal,
          zoneIndex: game.currentZone,
          nearObjectType: game.nearObject?.type ?? null,
          nearNpcName,
        });
      }

      // Render with student custom avatar
      renderGame(ctx, canvas.width, canvas.height, game, avatarConfig);

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPaused, avatarConfig]);

  // ── CHALLENGE SUCCESS HANDLER ──
  const handleChallengeSuccess = useCallback((challenge: ActiveChallengeState) => {
    const game = gameRef.current;
    if (!game) return;

    if (challenge.isGate) {
      const targetGateId =
        challenge.gateId ||
        game.pendingChallenge?.id ||
        (game.currentZone === 1 ? 'crust_challenge' : game.currentZone === 2 ? 'mantle_challenge' : game.currentZone === 3 ? 'oc_challenge' : `zone_${game.currentZone}_gate`);

      onChallengeComplete(game, targetGateId);
      game.unlockedGates.add(targetGateId);
      game.completedChallenges.add(targetGateId);

      if (game.currentZone === 1 || targetGateId === 'crust_challenge') {
        game.unlockedGates.add('crust_challenge');
        game.completedChallenges.add('crust_challenge');
        try {
          localStorage.setItem('crust_challenge_solved', 'true');
        } catch { }
      } else if (game.currentZone === 2 || targetGateId === 'mantle_challenge') {
        game.unlockedGates.add('mantle_challenge');
        game.completedChallenges.add('mantle_challenge');
        try {
          localStorage.setItem('mantle_challenge_solved', 'true');
        } catch { }
      } else if (game.currentZone === 3 || targetGateId === 'oc_challenge') {
        game.unlockedGates.add('oc_challenge');
        game.completedChallenges.add('oc_challenge');
        try {
          localStorage.setItem('oc_challenge_solved', 'true');
        } catch { }
      } else if (game.currentZone === 4 || targetGateId === 'ic_challenge') {
        game.unlockedGates.add('ic_challenge');
        game.completedChallenges.add('ic_challenge');
        try {
          localStorage.setItem('ic_challenge_solved', 'true');
        } catch { }
      } else if (game.currentZone === 5 || targetGateId === 'divergent_challenge') {
        game.unlockedGates.add('divergent_challenge');
        game.completedChallenges.add('divergent_challenge');
        try {
          localStorage.setItem('divergent_challenge_solved', 'true');
        } catch { }
      } else if (game.currentZone === 6 || targetGateId === 'convergent_challenge') {
        game.unlockedGates.add('convergent_challenge');
        game.completedChallenges.add('convergent_challenge');
        try {
          localStorage.setItem('convergent_challenge_solved', 'true');
        } catch { }
      } else if (game.currentZone === 7 || targetGateId === 'transform_challenge') {
        game.unlockedGates.add('transform_challenge');
        game.completedChallenges.add('transform_challenge');
        try {
          localStorage.setItem('transform_challenge_solved', 'true');
        } catch { }
      }

      // Hanya zona pamungkas Level 1 (Area 8) yang memicu pop-up kemenangan Level 1
      const isLevelEnd = game.currentZone >= 7 || (challenge.strata.index >= 7 && EARTH_STRATA_DATA.length >= 8);

      if (isLevelEnd) {
        unlockLevel(2);
        syncEarthDiveProgress(game, student, true).catch(console.error);

        showToast('★ SELURUH PETUALANGAN LEVEL 1 TUNTAS! KAPSUL AKHIR DIBUKA! ★');
        retroAudio.playWin();

        // Delay popup so the player sees the gate visibly unlock in the canvas
        setTimeout(() => {
          setShowCoreChallenge(true);
        }, 900);
      } else {
        syncEarthDiveProgress(game, student, false).catch(console.error);
        showToast('Selamat kamu berhasil menyelesaikan pertanyaan dari peneliti! Gerbang & Akses Turun Telah Terbuka!');
        retroAudio.playWin();

        // Otomatis buka instruksi Bu Tyas untuk membeli baju pelindung ke Teknisi
        let unlockedDialogueId = '';
        if (game.currentZone === 1) unlockedDialogueId = 'komandan_hendra_unlocked_dialogue';
        else if (game.currentZone === 2) unlockedDialogueId = 'komandan_surya_unlocked_dialogue';
        else if (game.currentZone === 3) unlockedDialogueId = 'komandan_teguh_unlocked_dialogue';
        else if (game.currentZone === 4) unlockedDialogueId = 'komandan_bintang_unlocked_dialogue';

        if (unlockedDialogueId) {
          const tree = getDialogueTree(unlockedDialogueId);
          if (tree) {
            setTimeout(() => {
              setActiveDialogue(tree);
            }, 350);
          }
        }
      }
    } else {
      syncEarthDiveProgress(game, student, false).catch(console.error);
      showToast('Mini Challenge Berhasil! Pemahaman Geologimu Terbukti!');
      retroAudio.playWin();
    }

    saveEarthDiveProgress(game, activeUserId);
    setActiveChallenge(null);
  }, [showToast, unlockLevel, student, activeUserId]);

  const handleBuyAndEquipSuit = useCallback((suitType: string) => {
    const game = gameRef.current;
    if (!game) return;
    buyAndEquipSuit(game, suitType);
    showToast('Baju Pelindung berhasil dibeli & dipakai! Kamu siap melangkah aman.');
    setActiveSuitMerchant(null);
  }, [showToast]);

  const playerName = student?.name || currentUser?.name || currentUser?.username || 'Vincent';


  // ── INTRODUKSI AWAL MASKOT RESQY (ZONA 0 PERMUKAAN & ZONA 1 KERAK BUMI) ──
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (hudData.zoneIndex === 0) {
      const seenKey = `resqbox_mascot_intro_seen_${activeUserId}`;
      const hasSeen = localStorage.getItem(seenKey);
      if (!hasSeen) {
        const timer = window.setTimeout(() => {
          const introTree = getDialogueTree('mascot_intro');
          if (introTree) {
            setActiveDialogue(introTree);
            localStorage.setItem(seenKey, 'true');
          }
        }, 650);
        return () => window.clearTimeout(timer);
      }
    } else if (hudData.zoneIndex === 1) {
      const seenCrustKey = `resqbox_mascot_crust_seen_${activeUserId}`;
      const hasSeenCrust = localStorage.getItem(seenCrustKey);
      if (!hasSeenCrust) {
        const timer = window.setTimeout(() => {
          const crustTree = getDialogueTree('mascot_crust_intro');
          if (crustTree) {
            setActiveDialogue(crustTree);
            localStorage.setItem(seenCrustKey, 'true');
          }
        }, 650);
        return () => window.clearTimeout(timer);
      }
    } else if (hudData.zoneIndex === 2) {
      const seenMantleKey = `resqbox_mascot_mantle_seen_${activeUserId}`;
      const hasSeenMantle = localStorage.getItem(seenMantleKey);
      if (!hasSeenMantle) {
        const timer = window.setTimeout(() => {
          const mantleTree = getDialogueTree('mascot_mantle_intro');
          if (mantleTree) {
            setActiveDialogue(mantleTree);
            localStorage.setItem(seenMantleKey, 'true');
          }
        }, 650);
        return () => window.clearTimeout(timer);
      }
    } else if (hudData.zoneIndex === 3) {
      const seenOuterCoreKey = `resqbox_mascot_outer_core_seen_${activeUserId}`;
      const hasSeenOuterCore = localStorage.getItem(seenOuterCoreKey);
      if (!hasSeenOuterCore) {
        const timer = window.setTimeout(() => {
          const outerCoreTree = getDialogueTree('mascot_outer_core_intro');
          if (outerCoreTree) {
            setActiveDialogue(outerCoreTree);
            localStorage.setItem(seenOuterCoreKey, 'true');
          }
        }, 650);
        return () => window.clearTimeout(timer);
      }
    } else if (hudData.zoneIndex === 4) {
      const seenInnerCoreKey = `resqbox_mascot_inner_core_seen_${activeUserId}`;
      const hasSeenInnerCore = localStorage.getItem(seenInnerCoreKey);
      if (!hasSeenInnerCore) {
        const timer = window.setTimeout(() => {
          const innerCoreTree = getDialogueTree('mascot_inner_core_intro');
          if (innerCoreTree) {
            setActiveDialogue(innerCoreTree);
            localStorage.setItem(seenInnerCoreKey, 'true');
          }
        }, 650);
        return () => window.clearTimeout(timer);
      }
    } else if (hudData.zoneIndex === 5) {
      const seenDivergentKey = `resqbox_mascot_divergent_seen_${activeUserId}`;
      const sessionDivergentKey = `resqbox_mascot_divergent_session_${activeUserId}`;
      const hasSeenDivergent = sessionStorage.getItem(sessionDivergentKey);
      if (!hasSeenDivergent) {
        const timer = window.setTimeout(() => {
          const divergentTree = getDialogueTree('mascot_divergent_intro');
          if (divergentTree) {
            setActiveDialogue(divergentTree);
            sessionStorage.setItem(sessionDivergentKey, 'true');
            localStorage.setItem(seenDivergentKey, 'true');
          }
        }, 650);
        return () => window.clearTimeout(timer);
      }
    } else if (hudData.zoneIndex === 6) {
      const seenConvergentKey = `resqbox_mascot_convergent_seen_${activeUserId}`;
      const sessionConvergentKey = `resqbox_mascot_convergent_session_${activeUserId}`;
      const hasSeenConvergent = sessionStorage.getItem(sessionConvergentKey);
      if (!hasSeenConvergent) {
        const timer = window.setTimeout(() => {
          const currentMode = gameRef.current?.convergentMode || convergentMode;
          const introId = currentMode === 'ocean' ? 'mascot_convergent_intro_ocean' : 'mascot_convergent_intro_land';
          const convergentTree = getDialogueTree(introId) || getDialogueTree('mascot_convergent_intro');
          if (convergentTree) {
            setActiveDialogue(convergentTree);
            sessionStorage.setItem(sessionConvergentKey, 'true');
            localStorage.setItem(seenConvergentKey, 'true');
          }
        }, 650);
        return () => window.clearTimeout(timer);
      }
    } else if (hudData.zoneIndex === 7) {
      const seenTransformKey = `resqbox_mascot_transform_seen_${activeUserId}`;
      const sessionTransformKey = `resqbox_mascot_transform_session_${activeUserId}`;
      const hasSeenTransform = sessionStorage.getItem(sessionTransformKey);
      if (!hasSeenTransform) {
        const timer = window.setTimeout(() => {
          const transformTree = getDialogueTree('mascot_transform_intro');
          if (transformTree) {
            setActiveDialogue(transformTree);
            sessionStorage.setItem(sessionTransformKey, 'true');
            localStorage.setItem(seenTransformKey, 'true');
          }
        }, 650);
        return () => window.clearTimeout(timer);
      }
    }
  }, [activeUserId, hudData.zoneIndex]);

  const handleMarkDiscovery = useCallback((discoveryId: string) => {
    const game = gameRef.current;
    if (!game) return;
    game.discoveredPoints.add(discoveryId);
    if (discoveryId === 'trans_seismo') {
      game.discoveredPoints.add('trans_disc1');
      game.discoveredPoints.add('disc_15');
    } else if (discoveryId === 'trans_sanandreas') {
      game.discoveredPoints.add('trans_disc2');
      game.discoveredPoints.add('disc_16');
    }
    saveEarthDiveProgress(game, activeUserId);
  }, [activeUserId]);

  const handleOpenDiscoveryModal = useCallback((discoveryIndex: number) => {
    const discItem = getDiscoveryItem(discoveryIndex);
    if (discItem) {
      setActiveDiscovery(discItem);
      const game = gameRef.current;
      if (game) {
        const discKey =
          discoveryIndex === 0
            ? 'crust_disc_compare'
            : discoveryIndex === 4
              ? 'mantle_disc1'
              : discoveryIndex === 5
                ? 'mantle_disc2'
                : discoveryIndex === 6
                  ? 'oc_disc1'
                  : discoveryIndex === 7
                    ? 'oc_disc2'
                    : discoveryIndex === 8
                      ? 'ic_disc1'
                      : discoveryIndex === 9
                        ? 'ic_disc2'
                        : discoveryIndex === 10
                          ? 'div_disc1'
                          : discoveryIndex === 11
                            ? 'div_disc2'
                            : discoveryIndex === 12
                              ? 'div_disc3'
                              : discoveryIndex === 13
                                ? 'conv_disc1'
                                : discoveryIndex === 14
                                  ? 'conv_disc2'
                                  : discoveryIndex === 15
                                    ? 'trans_seismo'
                                    : discoveryIndex === 16
                                      ? 'trans_sanandreas'
                                      : `disc_${discoveryIndex}`;
        onDiscoveryComplete(game, discKey);
        if (discoveryIndex === 8) {
          game.discoveredPoints.add('ic_disc1');
          game.discoveredPoints.add('disc_8');
        } else if (discoveryIndex === 9) {
          game.discoveredPoints.add('ic_disc2');
          game.discoveredPoints.add('disc_9');
          try {
            localStorage.setItem(`resqbox_read_ic_disc2_${activeUserId}`, 'true');
          } catch {}
        } else if (discoveryIndex === 15) {
          game.discoveredPoints.add('trans_seismo');
          game.discoveredPoints.add('trans_disc1');
          game.discoveredPoints.add('disc_15');
        } else if (discoveryIndex === 16) {
          game.discoveredPoints.add('trans_sanandreas');
          game.discoveredPoints.add('trans_disc2');
          game.discoveredPoints.add('disc_16');
        }
        saveEarthDiveProgress(game, activeUserId);
      }
    }
  }, [activeUserId]);

  const handleTriggerGateChallenge = useCallback(() => {
    const game = gameRef.current;
    if (!game) return;
    const zoneIdx = game.currentZone;
    const strata = EARTH_STRATA_DATA[zoneIdx] || EARTH_STRATA_DATA[1];
    if (strata) {
      const isTransform = zoneIdx === 7;
      const isConvergent = zoneIdx === 6;
      const isDivergent = zoneIdx === 5;
      const isInnerCore = zoneIdx === 4;
      const isOuterCore = zoneIdx === 3;
      const isMantle = zoneIdx === 2;
      const gateId = isTransform
        ? 'transform_challenge'
        : isConvergent
          ? 'convergent_challenge'
          : isDivergent
            ? 'divergent_challenge'
            : isInnerCore
              ? 'ic_challenge'
              : isOuterCore
                ? 'oc_challenge'
                : isMantle
                  ? 'mantle_challenge'
                  : 'crust_challenge';
      const title = isTransform
        ? 'TANTANGAN PENELITI: BATAS TRANSFORM & SESAR MENDATAR'
        : isConvergent
          ? 'TANTANGAN PENELITI: BATAS KONVERGEN & SUBDUKSI'
          : isDivergent
            ? 'TANTANGAN PENELITI: BATAS DIVERGEN & RETAKAN'
            : isInnerCore
              ? 'TANTANGAN PENELITI: INTI DALAM BUMI'
              : isOuterCore
                ? 'TANTANGAN PENELITI: INTI LUAR BUMI'
                : isMantle
                  ? 'TANTANGAN PENELITI: MANTEL BUMI'
                  : 'TANTANGAN PENELITI: KERAK BUMI';
      const words = ZONE_GATE_QUESTIONS[zoneIdx] || ZONE_GATE_QUESTIONS[1];
      setActiveChallenge({
        strata,
        isGate: true,
        gateId,
        title,
        words,
        targetCount: words.length,
      });
    }
  }, []);

  // ── CANVAS INTERACTION HANDLER ──
  const handleCanvasClickEvent = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      const game = gameRef.current;
      if (!canvas || !game) return;

      const rect = canvas.getBoundingClientRect();
      const clickX = (e.clientX - rect.left) * (canvas.width / rect.width);
      const clickY = (e.clientY - rect.top) * (canvas.height / rect.height);

      const res = handleCanvasClick(game, clickX, clickY, canvas.width, canvas.height);
      if (res) {
        if (res.action === 'dive_down') {
          retroAudio.playPowerup();
          showToast('Menyelam ke lapisan berikutnya...');
        } else if (res.action === 'gate_locked') {
          retroAudio.playError();
          if (res.target && res.target.includes('disiapkan')) {
            showToast(res.target);
          } else {
            setIsGateLockedModalOpen(true);
          }
        } else if (res.action === 'ascend_up') {
          retroAudio.playSelect();
          showToast('Naik ke lapisan atas...');
        } else if (res.action === 'npc_dialogue') {
          retroAudio.playSelect();
        } else if (res.action === 'info_sign') {
          retroAudio.playSelect();
        }
      }
    },
    [showToast],
  );

  // ── DIVE & ASCEND ACTIONS ──
  const handleDiveClick = useCallback(() => {
    const game = gameRef.current;
    if (!game) return;
    const res = triggerDiveDown(game);
    if (res.success) {
      retroAudio.playPowerup();
      showToast('Menyelam ke lapisan berikutnya...');
    } else {
      retroAudio.playError();
      if (res.reason && res.reason.includes('disiapkan')) {
        showToast(res.reason);
      } else {
        setIsGateLockedModalOpen(true);
      }
    }
  }, [showToast]);

  const handleAscendClick = useCallback(() => {
    const game = gameRef.current;
    if (!game) return;
    const ok = triggerAscendUp(game);
    if (ok) {
      retroAudio.playSelect();
      showToast('Naik ke lapisan atas...');
    }
  }, [showToast]);

  // ── MOBILE TOUCH CONTROLS ──
  const handleMobileBtnDown = useCallback((btn: 'left' | 'right' | 'up' | 'down' | 'jump' | 'interact') => {
    setMobileButton(btn, true);
  }, []);

  const handleMobileBtnUp = useCallback((btn: 'left' | 'right' | 'up' | 'down' | 'jump' | 'interact') => {
    setMobileButton(btn, false);
  }, []);

  // ── PREVIEW MAP CONFIGURATION (BASED ON ACTIVE ZONE) ──
  const getPreviewMapConfig = (zoneIdx: number) => {
    switch (zoneIdx) {
      case 0:
        return { activeLayerId: 'crust', depthPercent: 0.02 };
      case 1:
        return { activeLayerId: 'crust', depthPercent: 0.12 };
      case 2:
        return { activeLayerId: 'mantle', depthPercent: 0.40 };
      case 3:
        return { activeLayerId: 'outer-core', depthPercent: 0.72 };
      case 4:
        return { activeLayerId: 'inner-core', depthPercent: 0.95 };
      case 5:
        return { activeLayerId: 'crust', depthPercent: 0.18 };
      case 6:
        return { activeLayerId: 'crust', depthPercent: 0.22 };
      case 7:
        return { activeLayerId: 'crust', depthPercent: 0.25 };
      default:
        return { activeLayerId: 'crust', depthPercent: 0.05 };
    }
  };

  const previewConfig = getPreviewMapConfig(hudData.zoneIndex);

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black select-none font-pixel">
      {/* ── 1. FULLSCREEN RETRO GAME CANVAS ── */}
      <canvas
        ref={canvasRef}
        id="earth-dive-canvas"
        className="w-full h-full block cursor-pointer"
        style={{ imageRendering: 'pixelated' }}
        onClick={handleCanvasClickEvent}
        tabIndex={0}
      />

      {/* ── 2. TELEMETRY HUD INDIKATOR (RESPONSIF ZOOM & TABLET) ── */}
      {/* ── 2. TELEMETRY HUD INDIKATOR (RESPONSIF ZOOM & TABLET) ── */}
      {/* Sesuai permintaan pengguna: Sembunyikan telemetri di Area Konvergen (zoneIndex === 6) agar tombol kontrol lempeng dapat ditaruh di atas */}
      {hudData.zoneIndex !== 6 && (
        <div className="fixed top-2.5 sm:top-3 left-1/2 -translate-x-1/2 pointer-events-auto z-20 max-w-[calc(100vw-300px)] sm:max-w-none">
          <TelemetryHUD
            currentDepthKm={hudData.depth}
            currentTempLabel={hudData.tempString}
            currentPressureGpa={hudData.pressure}
            crystalsCount={hudData.crystals}
            totalCrystals={hudData.totalCrystals}
            areaDiscoveriesRead={hudData.areaDiscoveriesRead}
            areaDiscoveriesTotal={hudData.areaDiscoveriesTotal}
            playerHp={playerHp}
          />
        </div>
      )}

      {/* ── 3. TOP CORNER WIDGETS (LEFT & RIGHT) ── */}
      <div className="fixed top-2 sm:top-2.5 left-2 sm:left-3 right-2 sm:right-3 flex items-start justify-between pointer-events-none z-20">

        {/* TOP LEFT: COMPACT NAVIGATION & UTILITY BUTTONS + STRATA PILL & REPLAY BUTTON */}
        <div className="flex flex-col items-start gap-1.5 pointer-events-auto">
          {/* Row 1: Tombol Navigasi Menu, Sound, Fullscreen, serta (khusus Batas Konvergen) Strata Badge & Tombol Kontrol Naik ke Atas */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
            <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-950/85 backdrop-blur-md border-2 border-amber-800/80 p-1 sm:p-1.5 rounded-2xl shadow-[0_4px_0_#231206]">
              {/* Back to Menu */}
              <button
                onClick={() => {
                  retroAudio.playSelect();
                  navigate('/');
                }}
                className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-amber-950 hover:bg-amber-900 text-amber-200 border-2 border-amber-600/80 font-sans font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer transition-transform active:translate-y-0.5 shadow-[0_2px_0_#231206] whitespace-nowrap"
                title="Kembali ke Menu Utama"
              >
                <span className="text-amber-400 font-bold">&lt;</span>
                <span>MENU</span>
              </button>

              {/* Sound Toggle */}
              <button
                onClick={handleSoundToggle}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl border flex items-center justify-center cursor-pointer transition-all ${soundOn
                  ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-[0_2px_0_#78350f]'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                title="Musik & Efek Suara"
              >
                <PixelIcon name={soundOn ? "sound-on" : "sound-off"} size={13} />
              </button>

              {/* Fullscreen Toggle */}
              <button
                onClick={handleFullscreenToggle}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center cursor-pointer transition-all active:translate-y-0.5"
                title="Layar Penuh"
              >
                <PixelIcon name="fullscreen" size={13} />
              </button>
            </div>

            </div>

            {/* Row 2: Current Strata Badge Pill (Seragam untuk seluruh zona) */}
            <div className="flex flex-col xl:flex-row items-start xl:items-center gap-1 sm:gap-1.5">
              <div className="bg-slate-950/95 backdrop-blur-md border-2 border-amber-600/90 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-amber-200 font-pixel text-xs sm:text-sm md:text-base font-bold shadow-[0_4px_0_#231206] flex items-center gap-2 whitespace-nowrap">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="font-bold text-amber-300 uppercase tracking-wider truncate max-w-[180px] sm:max-w-none">
                  {hudData.strataName}
                </span>
              </div>
            </div>
          </div>

          {/* TOP RIGHT: PREVIEW MAP BUMI (HANYA AREA 0-4) ATAU KONTROL KONDISI / SIMULASI TEKTONIK (AREA 5-7) */}
          <div className="pointer-events-auto flex flex-col items-end gap-1 select-none">
            {/* 1. Radar Bumi: Hanya untuk lapisan dalam bumi (Permukaan, Kerak, Mantel, Inti Luar, Inti Dalam: Zone 0-4) */}
            {hudData.zoneIndex < 5 && (
              <div className="bg-slate-950/90 backdrop-blur-md border-2 sm:border-3 border-[#78350f] rounded-2xl p-1.5 sm:p-2 shadow-[0_6px_0_#231206] flex flex-col items-center transition-all">
                <button
                  onClick={() => setIsRadarOpen(!isRadarOpen)}
                  className="flex items-center justify-between gap-1.5 sm:gap-2 w-full px-1.5 sm:px-2 pb-1 text-[10px] sm:text-xs font-pixel text-amber-400 hover:text-amber-200 cursor-pointer select-none"
                  title={isRadarOpen ? "Kecilkan Radar" : "Buka Radar"}
                >
                  <span className="flex items-center gap-1 font-bold whitespace-nowrap">
                    <PixelIcon name="globe" size={13} />
                    <span className="tracking-wide">RADAR BUMI</span>
                  </span>
                  <span className="text-amber-500 hover:text-amber-300 text-[9px] sm:text-[10px] font-bold ml-1.5">
                    {isRadarOpen ? '▲' : '▼'}
                  </span>
                </button>
                {isRadarOpen && (
                  <div className="pt-1.5 border-t border-amber-900/50">
                    <PixelEarthDiagram
                      activeLayerId={previewConfig.activeLayerId}
                      depthPercent={previewConfig.depthPercent}
                      className="w-28 h-28 sm:w-34 sm:h-34 md:w-38 md:h-38 xl:w-42 xl:h-42"
                    />
                  </div>
                )}
              </div>
            )}

            {/* 2. Tombol Pemilih Kondisi & Ulang Animasi untuk Batas Konvergen (Area 7 / Zone Index 6) - DI POJOK KANAN ATAS */}
            {hudData.zoneIndex === 6 && (
              <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-950/95 backdrop-blur-md border-2 border-amber-800/80 p-1 sm:p-1.5 rounded-2xl shadow-[0_4px_0_#231206]">
                {/* Kondisi 1: Daratan (Tabrakan Benua & Pembentukan Gunung) */}
                <button
                  onClick={() => handleSelectConvergentMode('land')}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl font-sans text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap active:translate-y-0.5 ${convergentMode === 'land'
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white border-2 border-yellow-300 shadow-[0_2px_0_#78350f] scale-105'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-amber-200/80 border border-amber-700/50 hover:text-amber-100'
                    }`}
                  title="Kondisi 1 (Daratan): Dua lempeng benua bertabrakan, lempeng terlipat membentuk pegunungan megah"
                >
                  <span>DARATAN (TUMBUKAN BENUA)</span>
                  {convergentMode === 'land' && (
                    <span className="text-[9px] bg-amber-950/90 text-yellow-300 px-1.5 py-0.5 rounded font-bold uppercase">
                      AKTIF
                    </span>
                  )}
                </button>

                {/* Kondisi 2: Lautan & Pantai (Palung Samudra) */}
                <button
                  onClick={() => handleSelectConvergentMode('ocean')}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl font-sans text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap active:translate-y-0.5 ${convergentMode === 'ocean'
                    ? 'bg-gradient-to-r from-cyan-600 to-cyan-700 text-white border-2 border-cyan-200 shadow-[0_2px_0_#0e7490] scale-105'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-cyan-200/80 border border-cyan-700/50 hover:text-cyan-100'
                    }`}
                  title="Kondisi 2 (Lautan & Pantai): Lempeng samudra menunjam membentuk palung laut, lempeng benua kanan berupa pantai"
                >
                  <span>LAUTAN & PANTAI (PALUNG)</span>
                  {convergentMode === 'ocean' && (
                    <span className="text-[9px] bg-cyan-950/90 text-cyan-200 px-1.5 py-0.5 rounded font-bold uppercase">
                      AKTIF
                    </span>
                  )}
                </button>

                {/* Tombol Replay Animasi */}
                <button
                  onClick={() => {
                    if (gameRef.current) {
                      triggerConvergentSimulation(gameRef.current);
                      showToast(
                        convergentMode === 'land'
                          ? 'Memutar ulang animasi tumbukan dua lempeng benua & pembentukan gunung...'
                          : 'Memutar ulang animasi subduksi lempeng samudra & pembentukan palung...'
                      );
                    }
                  }}
                  className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-amber-950/95 hover:bg-amber-900 text-amber-200 border-2 border-amber-600/80 font-sans font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer transition-transform active:translate-y-0.5 shadow-[0_2px_0_#451a03] whitespace-nowrap"
                  title="Ulangi Animasi Tumbukan Lempeng Konvergen"
                >
                  <span className="text-amber-400 font-bold">↺</span>
                  <span>ULANG</span>
                </button>
              </div>
            )}

            {/* 3. Tombol Ulang Animasi untuk Batas Divergen (Area 6 / Zone Index 5) - DI POJOK KANAN ATAS */}
            {hudData.zoneIndex === 5 && (
              <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-950/95 backdrop-blur-md border-2 border-rose-600/90 p-1 sm:p-1.5 rounded-2xl shadow-[0_4px_0_#231206]">
                <button
                  onClick={() => {
                    if (gameRef.current) {
                      triggerDivergentSimulation(gameRef.current);
                      showToast('Memutar ulang animasi pemekaran lempeng & magma...');
                    }
                  }}
                  className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-rose-950/95 hover:bg-rose-900 text-rose-200 border-2 border-rose-600/80 font-sans font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer transition-transform active:translate-y-0.5 shadow-[0_2px_0_#4c0519] whitespace-nowrap"
                  title="Ulangi Animasi Pemekaran Lempeng & Pembekuan Magma"
                >
                  <span className="text-rose-400 font-bold">↺</span>
                  <span>ULANG ANIMASI</span>
                </button>
              </div>
            )}

            {/* 4. Tombol Replay Simulasi Tektonik untuk Batas Transform (Area 8 / Zone Index 7) - DI POJOK KANAN ATAS */}
            {hudData.zoneIndex === 7 && (
              <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-950/95 backdrop-blur-md border-2 border-amber-600/90 p-1 sm:p-1.5 rounded-2xl shadow-[0_4px_0_#231206]">
                <button
                  onClick={() => {
                    if (gameRef.current) {
                      triggerTransformSimulation(gameRef.current);
                      showToast('Memutar ulang pergeseran mendatar Sesar San Andreas...');
                    }
                  }}
                  className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-amber-950/95 hover:bg-amber-900 text-amber-200 border-2 border-amber-600/80 font-pixel-title text-[10px] sm:text-xs flex items-center gap-1.5 cursor-pointer transition-transform active:translate-y-0.5 shadow-[0_2px_0_#451a03] whitespace-nowrap"
                  title="Putar Ulang Animasi Sesar San Andreas"
                >
                  <span className="text-amber-400 font-bold">↻</span>
                  <span>ULANG ANIMASI</span>
                </button>
              </div>
            )}
          </div>

      </div>

      {/* ── 3. ACTION TOAST NOTIFICATION (Center Screen) ── */}
      {toastMessage && (
        <div className={`absolute top-18 left-1/2 -translate-x-1/2 bg-amber-950/95 border-2 border-amber-400 text-amber-200 px-4 py-2 rounded-xl font-pixel text-xs shadow-2xl z-30 flex items-center gap-2 pointer-events-none transition-opacity duration-300 ${isToastFading ? 'opacity-0' : 'opacity-100'}`}>
          <PixelIcon name="broadcast" size={14} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── 4. PAUSE INDICATOR WHEN MODAL IS OPEN ── */}
      {isPaused && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-black/80 px-4 py-1.5 rounded-full text-amber-300 font-pixel text-[10px] tracking-wider z-20 border border-amber-500/60 flex items-center gap-1.5 shadow-lg">
          <PixelIcon name="pause" size={10} />
          <span>SIMULASI DIJEDA</span>
        </div>
      )}

      {/* ── 5. DYNAMIC FLOATING INTERACTION PROMPT (BOTTOM CENTER) 100% PERSIS LEVEL 2 ── */}
      {hudData.nearObjectType && !isPaused && (
        <div className="absolute bottom-12 sm:bottom-14 left-1/2 -translate-x-1/2 z-20 pointer-events-auto select-none animate-bounce w-[min(94vw,860px)] px-2">
          {hudData.nearObjectType === 'portal_down' && (
            <button
              onClick={handleDiveClick}
              className="w-full bg-slate-950/98 text-amber-100 border-[3.5px] border-amber-400 px-5 sm:px-8 py-3.5 sm:py-4 rounded-3xl font-extrabold text-sm sm:text-base md:text-xl shadow-[0_12px_36px_rgba(0,0,0,0.95)] backdrop-blur-md flex items-center justify-center gap-3 sm:gap-4 text-center leading-snug font-sans cursor-pointer hover:border-amber-300 active:scale-95 transition-all"
            >
              <PixelIcon name="broadcast" size={24} className="text-amber-400 shrink-0 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
              <span className="uppercase tracking-wide font-black">
                {hudData.zoneIndex === 4
                  ? 'TEKAN [E] / KLIK UNTUK MENUJU KE BATAS DIVERGEN'
                  : hudData.zoneIndex === 5
                    ? 'TEKAN [E] / KLIK UNTUK MENUJU KE BATAS KONVERGEN'
                    : hudData.zoneIndex === 6
                      ? 'TEKAN [E] / KLIK UNTUK MENUJU KE BATAS TRANSFORM'
                      : hudData.zoneIndex >= 7
                        ? 'TEKAN [E] / KLIK UNTUK MEMASUKI KAPSUL EVAKUASI AKHIR (SELESAIKAN LEVEL 1)'
                        : 'TEKAN [E] / KLIK UNTUK TURUN MENUJU LAPISAN SELANJUTNYA'}
              </span>
            </button>
          )}

          {hudData.nearObjectType === 'portal_up' && (
            <button
              onClick={handleAscendClick}
              className="w-full bg-slate-950/98 text-amber-100 border-[3.5px] border-amber-400 px-5 sm:px-8 py-3.5 sm:py-4 rounded-3xl font-extrabold text-sm sm:text-base md:text-xl shadow-[0_12px_36px_rgba(0,0,0,0.95)] backdrop-blur-md flex items-center justify-center gap-3 sm:gap-4 text-center leading-snug font-sans cursor-pointer hover:border-amber-300 active:scale-95 transition-all"
            >
              <PixelIcon name="broadcast" size={24} className="text-amber-400 shrink-0 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
              <span className="uppercase tracking-wide font-black">
                {hudData.zoneIndex === 5
                  ? 'TEKAN [E] / KLIK UNTUK KEMBALI KE INTI DALAM'
                  : hudData.zoneIndex === 6
                    ? 'TEKAN [E] / KLIK UNTUK KEMBALI KE BATAS DIVERGEN'
                    : hudData.zoneIndex === 7
                      ? 'TEKAN [E] / KLIK UNTUK KEMBALI KE BATAS KONVERGEN'
                      : 'TEKAN [E] / KLIK UNTUK NAIK MENUJU LAPISAN SEBELUMNYA'}
              </span>
            </button>
          )}

          {hudData.nearObjectType === 'discovery' && (
            <div className="w-full bg-slate-950/98 text-amber-100 border-[3.5px] border-amber-400 px-5 sm:px-8 py-3.5 sm:py-4 rounded-3xl font-extrabold text-sm sm:text-base md:text-xl shadow-[0_12px_36px_rgba(0,0,0,0.95)] backdrop-blur-md flex items-center justify-center gap-3 sm:gap-4 text-center leading-snug font-sans">
              <PixelIcon name="broadcast" size={24} className="text-amber-400 shrink-0 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
              <span className="uppercase tracking-wide font-black">
                TEKAN [E] / KLIK UNTUK MEMERIKSA TEMUAN GEOLOGIS
              </span>
            </div>
          )}

          {hudData.nearObjectType === 'npc' && (
            <div className="w-full bg-slate-950/98 text-amber-100 border-[3.5px] border-amber-400 px-5 sm:px-8 py-3.5 sm:py-4 rounded-3xl font-extrabold text-sm sm:text-base md:text-xl shadow-[0_12px_36px_rgba(0,0,0,0.95)] backdrop-blur-md flex items-center justify-center gap-3 sm:gap-4 text-center leading-snug font-sans">
              <PixelIcon name="broadcast" size={24} className="text-amber-400 shrink-0 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
              <span className="uppercase tracking-wide font-black">
                TEKAN [E] / KLIK UNTUK BERBICARA DENGAN {hudData.nearNpcName ? hudData.nearNpcName.toUpperCase() : 'PENELITI'}
              </span>
            </div>
          )}

          {hudData.nearObjectType === 'challenge_gate' && (
            <div className="w-full bg-slate-950/98 text-amber-100 border-[3.5px] border-amber-400 px-5 sm:px-8 py-3.5 sm:py-4 rounded-3xl font-extrabold text-sm sm:text-base md:text-xl shadow-[0_12px_36px_rgba(0,0,0,0.95)] backdrop-blur-md flex items-center justify-center gap-3 sm:gap-4 text-center leading-snug font-sans">
              <PixelIcon name="broadcast" size={24} className="text-amber-400 shrink-0 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
              <span className="uppercase tracking-wide font-black">
                TEKAN [E] / KLIK UNTUK MENGHADAPI TANTANGAN GERBANG
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── 6. DISCREET KEYBOARD CONTROLS GUIDE (Desktop Bottom) ── */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-3 px-3.5 py-1 rounded-full bg-black/70 border border-amber-900/50 text-[9px] font-pixel text-slate-300 pointer-events-none z-10 select-none">
        {hudData.zoneIndex === 7 ? (
          <>
            <span>W A S D / Panah (Gerak 4 Arah)</span>
            <span>[Spasi] Lompat Celah Sesar</span>
            <span>[E] Interaksi</span>
          </>
        ) : hudData.zoneIndex === 5 ? (
          <>
            <span>W A S D / Panah (Renang 4 Arah)</span>
            <span>[Spasi] Renang Naik</span>
            <span>[E] Interaksi</span>
          </>
        ) : (
          <>
            <span>← → Gerak</span>
            <span>↑ / [Spasi] Lompat</span>
            <span>[E] Interaksi</span>
            <span>↓ Menyelam</span>
          </>
        )}
      </div>

      {/* ── 7. MOBILE & TABLET TOUCH CONTROLS (4-Way D-Pad + Dedicated Jump & Interact) ── */}
      {(isTouchDevice || (typeof window !== 'undefined' && window.innerWidth <= 1024)) && (
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between pointer-events-none z-30 select-none">
          {/* Left 4-Way D-Pad (Atas, Bawah, Kiri, Kanan) */}
          <div className="flex flex-col items-center pointer-events-auto">
            {/* Up button */}
            <button
              onPointerDown={() => handleMobileBtnDown('up')}
              onPointerUp={() => handleMobileBtnUp('up')}
              onPointerLeave={() => handleMobileBtnUp('up')}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-blue-600 border-2 border-slate-600 text-slate-100 font-bold text-base flex items-center justify-center touch-none shadow-sm cursor-pointer"
              title={hudData.zoneIndex === 7 ? "Bergerak ke Atas (Utara)" : hudData.zoneIndex === 5 ? "Berenang ke Atas" : "Lompat ke Atas"}
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
              title={hudData.zoneIndex === 7 ? "Bergerak ke Bawah (Selatan)" : hudData.zoneIndex === 5 ? "Berenang ke Bawah / Menyelam" : "Turun / Jongkok"}
            >
              ▼
            </button>
          </div>

          {/* Right Action Buttons: Dedicated Jump (LONCAT) & Interact (AKSI) */}
          <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
            {/* Tombol Loncat: Di area transform melompati celah, di area divergent renang naik, di platformer melompat tinggi */}
            <button
              onPointerDown={() => handleMobileBtnDown('jump')}
              onPointerUp={() => handleMobileBtnUp('jump')}
              onPointerLeave={() => handleMobileBtnUp('jump')}
              className="w-14 h-12 sm:w-16 sm:h-13 rounded-xl bg-gradient-to-b from-blue-700 to-blue-900 active:from-blue-600 active:to-blue-800 border-2 border-blue-400 text-blue-100 font-pixel text-[11px] sm:text-xs flex flex-col items-center justify-center touch-none shadow-[0_3px_0_#1e3a8a] active:translate-y-0.5 cursor-pointer"
              title={hudData.zoneIndex === 5 ? "Berenang Naik" : "Lompat"}
            >
              <span className="text-sm font-bold leading-none">▲</span>
              <span className="text-[9px] font-pixel-title mt-0.5 tracking-wider">{hudData.zoneIndex === 5 ? "RENANG" : "LONCAT"}</span>
            </button>

            {/* Tombol Interaksi [E] */}
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

      {/* ── 8. MODALS INTEGRATION ── */}
      {/* ── VISUAL NOVEL DIALOGUE (RPG NPC & MASCOT RESQY) ── */}
      {activeDialogue && (
        <VisualNovelDialogue
          dialogueTree={activeDialogue}
          playerName={playerName}
          avatarConfig={avatarConfig}
          zoneId={ZONES[hudData.zoneIndex]?.id}
          onClose={() => setActiveDialogue(null)}
          onMarkDiscovery={handleMarkDiscovery}
          onTriggerDiscovery={handleOpenDiscoveryModal}
          onTriggerChallenge={handleTriggerGateChallenge}
        />
      )}

      {activeDiscovery && (() => {
        const isBoundary = activeDiscovery.strata.id === 'divergen' || activeDiscovery.strata.id === 'konvergen' || activeDiscovery.strata.id === 'transform';
        return (
          <DiscoveryModal
            discovery={activeDiscovery.discovery}
            strataName={activeDiscovery.strata.name}
            depthRange={isBoundary ? '' : activeDiscovery.strata.depthRange}
            tempRange={isBoundary ? '' : activeDiscovery.strata.tempRange}
            composition={activeDiscovery.strata.composition}
            onClose={() => {
              const game = gameRef.current;
              if (game && activeDiscovery) {
                const ill = activeDiscovery.discovery.illustrationType;
                if (ill === 'transform-sanandreas') {
                  game.discoveredPoints.add('trans_sanandreas');
                  game.discoveredPoints.add('trans_disc2');
                  game.discoveredPoints.add('disc_16');
                  saveEarthDiveProgress(game, activeUserId);
                }
              }
              setActiveDiscovery(null);
            }}
          />
        );
      })()}

      {/* ── POPUP PERINGATAN: AKSES TURUN TERKUNCI (TANTANGAN GERBANG BELUM SELESAI) ── */}
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
              className="w-full py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-amber-50 border-3 border-[#451a03] shadow-[0_5px_0_#231206] text-xs sm:text-sm md:text-base font-pixel-title flex items-center justify-center gap-2 cursor-pointer transition-transform active:translate-y-0.5"
            >
              <span>SIAP, SELESAIKAN TANTANGAN PENELITI DULU</span>
            </button>
          </div>
        </div>
      )}

      {/* ── POPUP PERINGATAN: TEMUAN GEOLOGIS BELUM SELESAI ── */}
      {discoveryWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm select-none animate-fadeIn">
          <div className="relative w-full max-w-xl bg-[#fef3c7] border-4 border-[#451a03] rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-[0_16px_0_#1c0d02] text-[#451a03] font-pixel text-center">
            <h3 className="text-base sm:text-lg md:text-xl font-pixel-title text-amber-950 font-bold mb-3">
              TEMUAN GEOLOGIS BELUM SELESAI!
            </h3>

            <p className="font-sans text-base sm:text-lg md:text-xl font-bold text-[#351505] leading-relaxed mb-6">
              Kamu harus mengamati dan membaca seluruh Temuan Geologis di area ini (<span className="text-amber-800 font-extrabold">{discoveryWarning.read}/{discoveryWarning.total}</span>) terlebih dahulu sebelum membuka Tantangan Gerbang!
            </p>

            <button
              onClick={() => {
                retroAudio.playSelect();
                setDiscoveryWarning(null);
              }}
              className="w-full py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-amber-50 border-3 border-[#451a03] shadow-[0_5px_0_#231206] text-xs sm:text-sm md:text-base font-pixel-title cursor-pointer active:translate-y-0.5"
            >
              SIAP, AMATI TEMUAN DULU
            </button>
          </div>
        </div>
      )}

      {activeChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-3xl sm:max-w-4xl bg-amber-50 border-4 border-amber-950 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-[0_16px_0_#231206] max-h-[96vh] overflow-y-auto">
            <Wordle
              customWords={activeChallenge.words}
              targetCount={activeChallenge.targetCount ?? 3}
              gateTitle={activeChallenge.title}
              isGateChallenge={activeChallenge.isGate}
              onSuccess={() => handleChallengeSuccess(activeChallenge)}
              onClose={() => {
                const game = gameRef.current;
                if (game?.pendingChallenge) {
                  game.pendingChallenge = null;
                }
                setActiveChallenge(null);
              }}
            />
          </div>
        </div>
      )}

      {showCoreChallenge && (
        <CoreChallengeModal
          initialCompleted={gameRef.current ? gameRef.current.unlockedGates.has('ic_challenge') : true}
          onClose={() => {
            setShowCoreChallenge(false);
            const game = gameRef.current;
            if (game) {
              onCoreChallengeComplete(game);
              saveEarthDiveProgress(game, activeUserId);
              syncEarthDiveProgress(game, student, true).catch(console.error);
            }
          }}
        />
      )}

      {/* ── FLOATING IN-WORLD INFO SIGN SPEECH BUBBLE (LEVEL 1) ── */}
      {inWorldSign && (
        <div
          ref={signBubbleRef}
          className="fixed z-40 max-w-[420px] w-[90vw] sm:w-[380px] pointer-events-none animate-fadeIn select-none font-pixel"
        >
          <div className="relative bg-[#fef3c7] border-3 sm:border-4 border-[#451a03] rounded-2xl p-3.5 sm:p-4 shadow-[0_8px_0_#1c0d02] text-[#451a03]">
            {/* Header */}
            <div className="flex items-center gap-1.5 border-b-2 border-[#78350f] pb-1.5 mb-2">
              <PixelIcon name="clipboard" size={16} className="text-[#b45309] shrink-0" />
              <span className="font-sans text-[11px] sm:text-xs text-[#b45309] tracking-wider uppercase font-bold">
                CATATAN EKSPEDISI GEOLOGI
              </span>
            </div>

            {/* Content text */}
            <p className="font-sans text-xs sm:text-sm md:text-[14px] text-[#291305] leading-relaxed font-semibold whitespace-pre-line">
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

      {/* Wordle Bonus Quest Modal */}
      {showWordleBonus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-slate-950 border-4 border-amber-600 rounded-2xl p-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-amber-900">
              <div className="flex items-center gap-2">
                <PixelIcon name="target" size={14} />
                <span className="font-pixel-title text-xs text-amber-400">
                  BONUS QUEST: TEBAK KATA GEOLOGI
                </span>
              </div>
              <button
                onClick={() => {
                  retroAudio.playSelect();
                  setShowWordleBonus(false);
                }}
                className="w-7 h-7 rounded bg-amber-900 text-amber-200 font-pixel-title text-xs cursor-pointer flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <Wordle />
          </div>
        </div>
      )}

      {/* ── MODAL TOKO BAJU PELINDUNG (SUIT MERCHANT) ── */}
      {activeSuitMerchant && (
        <SuitMerchantModal
          isOpen={activeSuitMerchant !== null}
          merchantNpc={activeSuitMerchant}
          suitType={(activeSuitMerchant.data?.suitType as string) || 'mantle_suit'}
          playerCrystals={gameRef.current?.collectedCrystals.size ?? 0}
          hasPurchased={gameRef.current?.purchasedSuits.has((activeSuitMerchant.data?.suitType as string) || '') ?? false}
          isEquipped={gameRef.current?.player.equippedSuit === ((activeSuitMerchant.data?.suitType as string) || '')}
          onBuyAndEquip={handleBuyAndEquipSuit}
          onClose={() => setActiveSuitMerchant(null)}
        />
      )}

      {/* ── POPUP PERINGATAN: WAJIB MENGGUNAKAN BAJU PELINDUNG ── */}
      {suitWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md select-none animate-fadeIn font-sans">
          <div className="relative w-full max-w-2xl sm:max-w-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-amber-950 border-3 sm:border-4 border-amber-500 rounded-3xl p-7 sm:p-10 shadow-[0_0_50px_rgba(245,158,11,0.5)] text-white text-center overflow-hidden">
            {/* Background Grid Pattern */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            <div className="relative z-10 w-20 h-20 mx-auto mb-4 rounded-2xl bg-amber-500/25 border-3 border-amber-400 flex items-center justify-center text-4xl sm:text-5xl shadow-lg">
              ⚠️
            </div>

            <h3 className="relative z-10 text-2xl sm:text-3xl font-black text-amber-300 uppercase tracking-wide mb-3 font-mono drop-shadow-md">
              PERINGATAN BAHAYA LINGKUNGAN EKSTREM!
            </h3>

            <div className="relative z-10 my-4 px-6 py-3.5 rounded-2xl bg-slate-950/80 border-2 border-amber-500/40 text-sm sm:text-base font-extrabold text-amber-200 shadow-inner">
              Dibutuhkan: <span className="text-white underline font-black">{suitWarningModal.suitName}</span>
            </div>

            <p className="relative z-10 text-base sm:text-lg text-slate-100 leading-relaxed mb-8 font-medium max-w-2xl mx-auto">
              {suitWarningModal.reason}
            </p>

            <button
              onClick={() => {
                retroAudio.playSelect();
                setSuitWarningModal(null);
              }}
              className="relative z-10 w-full py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-base sm:text-lg border-2 border-yellow-200 shadow-[0_6px_25px_rgba(245,158,11,0.6)] transition-all cursor-pointer hover:scale-[1.02] active:scale-95 tracking-wide"
            >
              MENGERTI, BELI BAJU PELINDUNG DULU
            </button>
          </div>
        </div>
      )}

    </div>
  );
}