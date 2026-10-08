// ── src/app/Level2/engine/gameEngine.ts ──────────────────────────────
// Game Engine Loop Level 2: Batas Divergen & Pecahnya Pangea
// Mengatur update pergerakan siswa, jurang magma & daratan magma beku,
// catatan geologis ("i"), temuan geologis, kristal tektonik, dan gerbang teka-teki silang.

import type { ZoneConfigL2 } from './zones';
import { getAreaZoneL2, TOTAL_CRYSTALS_L2 } from './zones';
import type { PlayerStateL2, InputStateL2 } from './player';
import { createPlayerL2, updatePlayerPhysicsL2 } from './player';
import { retroAudio } from '../../../utils/retroAudio';
import { createInitialNpcsL2, updateNpcsL2, CLASSROOM_STUDENTS_L2, type NpcStateL2 } from './npcManagerL2';
import { DIALOGUE_TREES_L2, type DialogueTreeL2 } from '../dialogueDataL2';
import { LEVEL2_AREAS } from '../level2Data';

// ============================================================================
// PENGATURAN GETARAN GEMPA AREA 2 (RUANG KELAS)
// Kamu bisa langsung ubah angka getaran di bawah ini sesuai selera kamu!
// ============================================================================
export const EARTHQUAKE_SHAKE_CONFIG = {
 // SKENARIO GEMPA SEDANG
  MODERATE: {
    // Kekuatan getaran (semakin besar angkanya, semakin kuat layar bergetar)
    intensity: 0.7,
    // Variasi ayunan gelombang sinusoidal getaran
    oscillation: 0.1,
    // Jumlah maksimal puing/debu di layar sekaligus
    maxDebris: 3,
    // Jeda antar puing yang jatuh (dalam frame: 60 frame = 1 detik)
    debrisInterval: 55,
  },

 // SKENARIO GEMPA BESAR
  SEVERE: {
    // Kekuatan getaran saat dialog peringatan awal Bu Rahma
    alertIntensity: 2.0,
    // Kekuatan getaran saat QTE dan saat bersembunyi 10 detik di bawah meja
    coverIntensity: 2.0,
    // Variasi ayunan gelombang sinusoidal getaran gempa besar
    oscillation: 0.1,
    // Hentakan sesaat ketika tertimpa puing (jika gagal QTE)
    impactIntensity: 5.0,
    // Jumlah maksimal material/puing yang jatuh di layar sekaligus (diatur ~10)
    maxDebris: 8,
    // Jeda antar material yang jatuh (dalam frame: semakin besar, semakin jarang/sedikit jatuhnya)
    debrisInterval: 60,
  },
};

export interface AreaTransitionBannerL2 {
  direction: 'enter' | 'return';
  areaName: string;
  subtitle: string;
  timer: number;
  maxTimer: number;
}

export type SimPhaseL2 =
  | 'idle'
  | 'briefing'
  | 'teaching'
  | 'quake_alert'
  | 'quake_start'
  | 'qte_cover'
  | 'failed_impact'
  | 'failed'
  | 'quake_holding'
  | 'quake_stopped'
  | 'evacuating'
  | 'completed';

// ── TIPE SIMULASI ERUPSI GUNUNG MERAPI (AREA 5) ──
export type VolcanoSimPhaseL2 =
  | 'idle'                 // Bebas eksplorasi dusun sebelum simulasi dimulai
  | 'fase1_normal_popup'   // Menampilkan popup Fase 1 Normal
  | 'fase1_normal_exploring' // Suasana gunung normal 2 detik & balon dialog karakter
  | 'fase2_waspada_popup'  // Menampilkan popup Fase 2 Waspada
  | 'fase2_waspada_evac'   // Gempa ringan, asap kawah, evakuasi menjauh 2 km ke kanan
  | 'teleport_to_map2'     // Transisi layar teleport ke Map 2
  | 'fase2_map2_arrived'   // Menjelajah Map 2 beberapa detik setelah tiba (STATUS MASIH WASPADA)
  | 'fase2_dark_screen'    // Layar jadi gelap: teks "Beberapa Hari Kemudian..."
  | 'fase2_map2_after_timeskip' // Layar kembali terang: 4 detik MASIH STATUS WASPADA
  | 'fase2_map2_calm'      // Alias kompatibilitas
  | 'fase3_beberapa_hari_kemudian' // Alias kompatibilitas
  | 'fase3_siaga_popup'    // Menampilkan popup Fase 3 Siaga
  | 'fase3_siaga_migration' // Asap tebal, abu tipis, migrasi satwa (burung, rusa, kera, macan)
  | 'fase3_siaga_prep_evac' // Siapkan tas siaga & pakai masker, mengungsi 3-5 km ke kanan
  | 'teleport_to_map3'     // Transisi layar teleport ke Map 3 (Kantor BPBD & Mobil Evakuasi)
  | 'fase3_map3_arrived'   // Menjelajah Map 3 6 detik setelah tiba (STATUS MASIH SIAGA)
  | 'fase3_map3_dark_screen' // Layar jadi gelap di Map 3: teks "Beberapa Hari Kemudian..."
  | 'fase3_map3_after_timeskip' // Layar kembali terang di Map 3: 6 detik MASIH STATUS SIAGA sebelum letusan
  | 'fase4_awas_popup'     // Menampilkan popup Fase 4 Awas
  | 'fase4_awas_earthquake' // Gempa besar 4,5 - 5,5 SR (2 detik)
  | 'fase4_awas_erupting'  // Letusan eksplosif: semburan gas kuat, awan panas, eflata/bom
  | 'fase4_awas_siren'     // Membunyikan sirine darurat di tiang EWS
  | 'fase4_awas_rescue'    // Membantu evakuasi warga dusun ke Mobil Evakuasi BPBD
  | 'fase4_awas_truck'     // Menuju dan menaiki Mobil Evakuasi bersama seluruh warga
  | 'volcano_evacuated'    // Truk melaju cepat membawa seluruh warga & pemain keluar
  | 'volcano_completed'    // Sukses, evaluasi & lencana
  // Kompatibilitas alur sebelumnya
  | 'cinematic_tremor'
  | 'qte_run_kentongan'
  | 'dark_ash_transition'
  | 'qte_rescue_villagers'
  | 'eruption_climax'
  | 'qte_truck_evac'
  | 'failed';

export interface BirdParticleL2 {
  x: number;
  y: number;
  vx: number;
  vy: number;
  wingAngle: number;
  size: number;
  facing?: 'left' | 'right';
}

export interface AshFallParticleL2 {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

export interface MigratingAnimalL2 {
  id: string;
  type: 'burung' | 'rusa' | 'kera' | 'macan';
  kind?: 'burung' | 'rusa' | 'kera' | 'macan';
  dir?: 'left' | 'right';
  x: number;
  y: number;
  vx: number;
  vy: number;
  animFrame: number;
  size: number;
  state?: 'running' | 'leaping';
}

export interface VolcanoBombL2 {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  size: number;
  rot: number;
  rotation: number;
  rotSpeed: number;
  trail: { x: number; y: number; opacity: number }[];
}

export interface RescueVillagerL2 {
  id: string;
  npcId: string;
  name: string;
  role: string;
  x: number;
  y: number;
  rescued: boolean;
  bubbleText?: string;
  targetX?: number;
}

export interface VolcanoSimulationDataL2 {
  phase: VolcanoSimPhaseL2;
  statusLevel: 'NORMAL' | 'WASPADA' | 'SIAGA' | 'AWAS';
  scenario: 'explosive' | 'effusive';
  subMap: 1 | 2 | 3;
  skyDimFactor: number;        // 0.0 .. 1.0 (interpolasi langit cerah -> mendung gelap)
  vegetationWither: number;    // 0.0 .. 1.0 (interpolasi rumput/pohon hijau -> kuning kecokelatan)
  volcanoPlume: 'clear' | 'white_steam' | 'dark_ash' | 'magma_fountain';
  magmaFlowProgress?: number;  // 0.0 .. 1.0 (animasi lelehan magma mengalir turun dari puncak kawah)
  fleeingBirds: BirdParticleL2[];
  birdsSpawned: boolean;       // Burung kabur sekali saja!
  ashParticles: AshFallParticleL2[];
  migratingAnimals: MigratingAnimalL2[];
  animalsSpawned: boolean;
  volcanoBombs: VolcanoBombL2[];
  sirenActive: boolean;
  sirenSoundTimer: number;
  fase1Timer: number;
  speechBubbleTimer: number;
  speechBubbleText?: string;
  teleportTimer: number;
  map2ArrivalTimer?: number;    // Menjelajah Map 2 6 detik setelah tiba (MASIH WASPADA)
  darkScreenTimer?: number;     // Durasi layar gelap "Beberapa Hari Kemudian..."
  afterTimeskipTimer?: number;  // 6 detik eksplorasi Map 2 MASIH STATUS WASPADA
  migrationTimer?: number;      // 6 detik migrasi satwa liar lereng Fase 3 SIAGA
  map3ArrivalTimer?: number;    // Menjelajah Map 3 6 detik setelah tiba (STATUS MASIH SIAGA)
  map3AfterTimeskipTimer?: number; // 6 detik eksplorasi Map 3 setelah transisi kedua (STATUS MASIH SIAGA)
  map2CalmTimer?: number;       // Kompatibilitas
  timeSkipTimer?: number;       // Kompatibilitas
  earthquakeTimer: number;
  kentonganHits: number;       // hits recorded (target: 3)
  cinematicTremorTimer: number; // Durasi overlay peringatan gempa
  villagersToRescue: RescueVillagerL2[];
  qteTimer: number;
  qteMaxTimer: number;
  qteType?: 'kentongan' | 'rescue' | 'truck' | 'siren' | 'evac';
  qteSuccess?: boolean;
  apdEquipped: boolean;
  elderRescued?: boolean;
  truckSprintProgress: number; // 0 .. 100%
  truckX: number;
  truckDrivingSpeed: number;
  truckState: 'parked' | 'boarding' | 'driving';
  transitionTimer: number;
  failureReason?: string;
  activePhaseModal?: 'NORMAL' | 'WASPADA' | 'SIAGA' | 'AWAS' | null;
}

export interface FallingRockImpactL2 {
  x: number;
  y: number;
  vy: number;
  size: number;
  hit: boolean;
  shattered: boolean;
  shards: { x: number; y: number; vx: number; vy: number; size: number; color: string }[];
}

export interface DebrisParticleL2 {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  width?: number;
  height?: number;
  type?: 'tile' | 'rock' | 'dust';
  color: string;
  rotation: number;
  rotSpeed: number;
  bounced: boolean;
  settled: boolean;
  opacity?: number;
}

export interface SimulationStateL2 {
  quakeScenario?: 'moderate' | 'severe';
  phase: SimPhaseL2;
  qteTimer: number;        // in frames (600 = 10s)
  qteMaxTimer: number;     // 600
  quakeTimer: number;      // in frames (600 = 10s)
  quakeMaxTimer: number;   // 600
  shakeIntensity: number;  // 0..8
  alarmTick: number;
  shoutTimer: number;
  shoutIndex: number;
  panicShouts: { id: string; x: number; y: number; text: string; staggerY?: number }[];
  evacWalkFrame: number;
  evacProgress: number;
  particles: DebrisParticleL2[];
  playerAtDesk: boolean;
  playerCrouchedUnderDesk: boolean;
  qteSuccess?: boolean;
  failureImpactTimer?: number;
  fallingRock?: FallingRockImpactL2;
  damageProgress?: number; // 0.0 (utuh) -> 1.0 (rusak total) transisi bertahap selama gempa
}

export interface GameStateL2 {
  userId?: string;
  currentAreaIndex: number;
  player: PlayerStateL2;
  zone: ZoneConfigL2;
  animTick: number;
  collectedCrystals: Set<string>;
  discoveredPoints: Set<string>;
  unlockedGates: Set<string>;
  npcs: Map<string, NpcStateL2>;
  activeDialogueTree: DialogueTreeL2 | null;
  activeSignText: string | null;
  pendingDiscoveryIndex: number | null;
  pendingDiscoveryId: string | null;
  pendingCrossword: boolean;
  pendingMiniChallenge: boolean;
  nearInteractablePrompt: string | null;
  lastAutoSignId: string | null;
  pendingDiscoveryRequired: { read: number; total: number } | null;
  pendingGateLocked?: boolean;
  isAreaCompleted: boolean;
  transitionCooldown: number;
  areaTransitionBanner: AreaTransitionBannerL2 | null;
  simulation: SimulationStateL2;
  volcanoSim?: VolcanoSimulationDataL2;
  volcanoSimInitialBriefingDone?: boolean;
  isInsidePgaRoom?: boolean;
  pgaRoomQuizSolved?: boolean;
  pendingPgaWordle?: boolean;
}

export interface SavedLevel2Progress {
  currentAreaIndex?: number;
  playerX: number;
  playerY: number;
  playerDir: 'left' | 'right';
  playerHealth: number;
  collectedCrystals: string[];
  discoveredPoints: string[];
  unlockedGates: string[];
  isAreaCompleted: boolean;
  pgaRoomQuizSolved?: boolean;
}

export function getLevel2StorageKey(userId?: string): string {
  return `resqbox_level2_progress_${userId || 'guest'}`;
}

export function saveLevel2Progress(state: GameStateL2, userId?: string): void {
  if (typeof window === 'undefined') return;
  try {
    const key = getLevel2StorageKey(userId || state.userId);
    const data: SavedLevel2Progress = {
      currentAreaIndex: state.currentAreaIndex,
      playerX: Math.round(state.player.x),
      playerY: Math.round(state.player.y),
      playerDir: state.player.dir,
      playerHealth: state.player.health,
      collectedCrystals: Array.from(state.collectedCrystals).slice(0, TOTAL_CRYSTALS_L2),
      discoveredPoints: Array.from(state.discoveredPoints),
      unlockedGates: Array.from(state.unlockedGates),
      isAreaCompleted: state.isAreaCompleted,
      pgaRoomQuizSolved: !!state.pgaRoomQuizSolved,
    };
    localStorage.setItem(key, JSON.stringify(data));
  } catch { }
}

export function loadLevel2Progress(userId?: string): SavedLevel2Progress | null {
  if (typeof window === 'undefined') return null;
  try {
    const key = getLevel2StorageKey(userId);
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as SavedLevel2Progress;
  } catch {
    return null;
  }
}

export function clearLevel2Progress(userId?: string): void {
  if (typeof window === 'undefined') return;
  try {
    const key = getLevel2StorageKey(userId);
    localStorage.removeItem(key);
  } catch { }
}

export function createInitialGameStateL2(userId?: string): GameStateL2 {
  const saved = loadLevel2Progress(userId);
  const currentAreaIndex = saved?.currentAreaIndex ?? 0;
  const zone = getAreaZoneL2(currentAreaIndex);

  let initialX = zone.playerSpawnX;
  let initialY = zone.playerSpawnY;

  if (saved && typeof saved.playerX === 'number' && !isNaN(saved.playerX)) {
    if (saved.playerX >= 40 && saved.playerX <= 2360) {
      initialX = saved.playerX;
    }
  }
  if (saved && typeof saved.playerY === 'number' && !isNaN(saved.playerY)) {
    if (saved.playerY >= 50 && saved.playerY <= 450) {
      initialY = saved.playerY;
    }
  }

  const player = createPlayerL2(initialX, initialY);

  if (saved) {
    player.dir = saved.playerDir || 'right';
    player.health = saved.playerHealth ?? 100;
  }

  const initialGameState: GameStateL2 = {
    userId,
    currentAreaIndex,
    player,
    zone,
    animTick: 0,
    collectedCrystals: new Set<string>((saved?.collectedCrystals || []).slice(0, TOTAL_CRYSTALS_L2)),
    discoveredPoints: new Set<string>(saved?.discoveredPoints || []),
    unlockedGates: new Set<string>(saved?.unlockedGates || []),
    npcs: createInitialNpcsL2(currentAreaIndex),
    activeDialogueTree: null,
    activeSignText: null,
    pendingDiscoveryIndex: null,
    pendingDiscoveryId: null,
    pendingCrossword: false,
    pendingMiniChallenge: false,
    nearInteractablePrompt: null,
    lastAutoSignId: null,
    pendingDiscoveryRequired: null,
    pendingGateLocked: false,
    isAreaCompleted: saved?.isAreaCompleted || false,
    pgaRoomQuizSolved: saved?.pgaRoomQuizSolved || false,
    isInsidePgaRoom: false,
    pendingPgaWordle: false,
    transitionCooldown: 30,
    areaTransitionBanner: {
      direction: 'enter',
      areaName: zone.name,
      subtitle: currentAreaIndex === 0
        ? 'SIMULASI RUANG KELAS: KESIAPSIAGAAN & DROP-COVER-HOLD ON'
        : currentAreaIndex === 1
          ? 'SIMULASI TANGGAP GEMPA: DROP, COVER, HOLD ON & EVAKUASI'
          : currentAreaIndex === 2
            ? 'PASCABENCANA: TITIK KUMPUL & PENANGANAN MEDIS'
            : currentAreaIndex === 3
              ? 'PRABENCANA ERUPSI MERAPI: STATUS PVMBG & KESIAPSIAGAAN KRB'
              : currentAreaIndex === 4
                ? 'SIMULASI TANGGAP ERUPSI: 4 STATUS PVMBG & EVAKUASI DUSUN'
                : 'PASCABENCANA ERUPSI: BARAK PENGUNGSIAN & PEMULIHAN BAHAYA SEKUNDER',
      timer: 240,
      maxTimer: 240,
    },
    simulation: {
      phase: 'idle',
      qteTimer: 600,
      qteMaxTimer: 600,
      quakeTimer: 600,
      quakeMaxTimer: 600,
      shakeIntensity: 0,
      alarmTick: 0,
      shoutTimer: 0,
      shoutIndex: 0,
      panicShouts: [],
      evacWalkFrame: 0,
      evacProgress: 0,
      particles: [],
      playerAtDesk: false,
      playerCrouchedUnderDesk: false,
    },
  };

  if (currentAreaIndex === 1) {
    const isQuakeDone = initialGameState.unlockedGates.has('l2_gate_gempa_sim');
    if (isQuakeDone) {
      initialGameState.simulation = {
        phase: 'completed',
        qteTimer: 0,
        qteMaxTimer: 600,
        quakeTimer: 0,
        quakeMaxTimer: 600,
        shakeIntensity: 0,
        alarmTick: 0,
        shoutTimer: 0,
        shoutIndex: 0,
        panicShouts: [],
        evacWalkFrame: 0,
        evacProgress: 100,
        particles: [],
        playerAtDesk: false,
        playerCrouchedUnderDesk: false,
      };
      // Seluruh 16 murid dan guru Bu Rahma telah dievakuasi ke Area 3 (Lapangan Evakuasi)!
      initialGameState.npcs.clear();
    }
  }

  if (currentAreaIndex === 4) {
    const isSimDone = initialGameState.unlockedGates.has('l2_gate_volcano_sim');
    if (isSimDone) {
      initialGameState.volcanoSim = {
        phase: 'volcano_completed',
        statusLevel: 'AWAS',
        scenario: 'explosive',
        subMap: 3,
        skyDimFactor: 0.9,
        vegetationWither: 1.0,
        volcanoPlume: 'dark_ash',
        magmaFlowProgress: 1.0,
        fleeingBirds: [],
        birdsSpawned: false,
        ashParticles: [],
        migratingAnimals: [],
        animalsSpawned: false,
        volcanoBombs: [],
        sirenActive: false,
        sirenSoundTimer: 0,
        fase1Timer: 0,
        speechBubbleTimer: 0,
        speechBubbleText: undefined,
        teleportTimer: 0,
        earthquakeTimer: 0,
        kentonganHits: 0,
        cinematicTremorTimer: 0,
        villagersToRescue: [],
        qteTimer: 0,
        qteMaxTimer: 0,
        qteType: 'evac',
        qteSuccess: undefined,
        apdEquipped: true,
        truckSprintProgress: 100,
        truckX: 1840,
        truckDrivingSpeed: 0,
        truckState: 'driving',
        transitionTimer: 0,
        activePhaseModal: undefined,
      };
      // Seluruh warga dusun & tim evakuasi telah mengungsi ke Area 6 (Barak Pengungsian)
      initialGameState.npcs.clear();
      initialGameState.volcanoSimInitialBriefingDone = true;
    } else {
      startSimulationArea5(initialGameState);
    }
  }

  return initialGameState;
}

export function startSimulationArea2(state: GameStateL2, scenario: 'moderate' | 'severe' = 'severe'): void {
  // Pulihkan seluruh NPC murid kelas & guru Bu Rahma untuk memulai simulasi gempa kembali
  state.npcs = createInitialNpcsL2(1);
  state.unlockedGates.delete('l2_gate_gempa_sim');

  state.simulation = {
    quakeScenario: scenario,
    phase: 'teaching',
    qteTimer: 600,
    qteMaxTimer: 600,
    quakeTimer: 600,
    quakeMaxTimer: 600,
    shakeIntensity: 0,
    alarmTick: 0,
    shoutTimer: 0,
    shoutIndex: 0,
    panicShouts: [],
    evacWalkFrame: 0,
    evacProgress: 0,
    particles: [],
    playerAtDesk: true,
    playerCrouchedUnderDesk: false,
    qteSuccess: undefined,
    damageProgress: 0,
  };

  // Posisi siswa pemain di kursi meja belajar baris 2 (x: 498, meja 460) menghadap ke kiri (guru & papan tulis)
  state.player.x = 498;
  state.player.y = 360;
  state.player.dir = 'left';
  state.player.vx = 0;
  state.player.vy = 0;

  // Guru Bu Rahma di depan kelas (x: 200) dekat papan tulis menghadap ke kanan
  const buRahma = state.npcs.get('l2_sim_npc_bu_rahma');
  if (buRahma) {
    buRahma.x = 200;
    buRahma.y = 360;
    buRahma.dir = 'right';
    buRahma.state = 'idle';
  }

  // Resqy di depan kelas dekat pintu (x: 140) menghadap ke murid
  const resqy = state.npcs.get('l2_sim_npc_resqy');
  if (resqy) {
    resqy.x = 140;
    resqy.y = 360;
    resqy.dir = 'right';
    resqy.state = 'idle';
  }

  // Seluruh 11 murid duduk tertib di kursi meja belajar masing-masing menghadap ke kiri
  CLASSROOM_STUDENTS_L2.forEach((st) => {
    const npc = state.npcs.get(st.id);
    if (npc) {
      npc.x = st.sitX;
      npc.y = 360;
      npc.dir = 'left';
      npc.state = 'idle';
    }
  });

  // Mulai dialog pengantar materi Teorema Pythagoras
  state.activeDialogueTree = DIALOGUE_TREES_L2['bu_rahma_teaching_cutscene'];
}

// ── SIMULASI ERUPSI GUNUNG MERAPI (AREA 5): INISIALISASI ──
export function startSimulationArea5(
  state: GameStateL2,
  scenario: 'explosive' | 'effusive' = 'explosive'
): void {
  // Pulihkan seluruh NPC warga dusun & tim evakuasi untuk memulai simulasi evakuasi
  state.npcs = createInitialNpcsL2(4);
  for (const npc of state.npcs.values()) {
    npc.isNearPlayer = false;
  }
  state.activeDialogueTree = null;
  state.nearInteractablePrompt = null;

  state.volcanoSim = {
    phase: 'fase1_normal_popup',
    statusLevel: 'NORMAL',
    scenario,
    subMap: 1,
    skyDimFactor: 0,
    vegetationWither: 0,
    volcanoPlume: 'clear',
    magmaFlowProgress: 0,
    fleeingBirds: [],
    birdsSpawned: false,
    ashParticles: [],
    migratingAnimals: [],
    animalsSpawned: false,
    volcanoBombs: [],
    sirenActive: false,
    sirenSoundTimer: 0,
    fase1Timer: 120, // 2 detik mengamati keindahan lereng normal
    speechBubbleTimer: 0,
    speechBubbleText: undefined,
    teleportTimer: 0,
    map2ArrivalTimer: 360, // 6 detik keliling santai di Dusun Lereng Tengah Map 2
    darkScreenTimer: 180, // ~3 detik layar gelap "Beberapa Hari Kemudian..."
    afterTimeskipTimer: 360, // 6 detik status waspada setelah waktu berlalu
    migrationTimer: 360, // 6 detik migrasi satwa liar lereng Fase 3 SIAGA
    map3ArrivalTimer: 360, // 6 detik eksplorasi Dusun Bawah KRB III Map 3
    map3AfterTimeskipTimer: 360, // 6 detik eksplorasi Map 3 setelah transisi kedua
    map2CalmTimer: 360,
    timeSkipTimer: 180,
    earthquakeTimer: 120, // 2 detik gempa besar di Fase 4
    kentonganHits: 0,
    cinematicTremorTimer: 0,
    villagersToRescue: [
      { id: 'mbah_tejo', npcId: 'l2_sim5_npc_lansia', name: 'Mbah Tejo', role: 'Lansia', x: 820, y: 356, rescued: false },
      { id: 'bu_siti', npcId: 'l2_sim5_npc_warga_siti', name: 'Bu Siti', role: 'Warga Rentan', x: 1220, y: 356, rescued: false },
      { id: 'dani', npcId: 'l2_sim5_npc_anak', name: 'Dani', role: 'Anak Dusun', x: 1560, y: 356, rescued: false },
    ],
    qteTimer: 900,
    qteMaxTimer: 900,
    qteType: 'evac',
    qteSuccess: undefined,
    apdEquipped: false,
    truckSprintProgress: 0,
    truckX: 1840,
    truckDrivingSpeed: 0,
    truckState: 'parked',
    transitionTimer: 0,
    activePhaseModal: 'NORMAL',
  };

  // Posisi awal pemain di awal Dusun Destana Lereng Merapi (x: 100, y: 360)
  state.player.x = 100;
  state.player.y = 360;
  state.player.dir = 'right';
  state.player.vx = 0;
  state.player.vy = 0;
  state.simulation.shakeIntensity = 0;
  retroAudio.playSelect();

  // Reset posisi NPC warga ke lokasi awal Map 1
  const mbah = state.npcs.get('l2_sim5_npc_lansia');
  if (mbah) { mbah.x = 820; mbah.state = 'idle'; }
  const siti = state.npcs.get('l2_sim5_npc_warga_siti');
  if (siti) { siti.x = 1220; siti.state = 'idle'; }
  const dani = state.npcs.get('l2_sim5_npc_anak');
  if (dani) { dani.x = 1560; dani.state = 'idle'; }
  const joko = state.npcs.get('l2_sim5_npc_pak_joko');
  if (joko) { joko.x = 340; joko.state = 'idle'; }
  const rina = state.npcs.get('l2_sim5_npc_mbak_rina');
  if (rina) { rina.x = 390; rina.state = 'idle'; }
}

export function retryVolcanoRescuePhase(state: GameStateL2): void {
  if (!state.volcanoSim) return;
  const sim = state.volcanoSim;
  sim.phase = 'fase4_awas_rescue';
  sim.statusLevel = 'AWAS';
  sim.subMap = 3;
  sim.qteTimer = 15 * 60; // 15 detik = 900 frame
  sim.qteMaxTimer = 15 * 60;
  sim.failureReason = undefined;
  sim.sirenActive = true;
  sim.apdEquipped = true;
  sim.truckSprintProgress = 0;
  sim.truckDrivingSpeed = 0;
  sim.truckState = 'parked';
  sim.truckX = 1840;
  sim.magmaFlowProgress = 0.15; // Lava masih merayap perlahan di lereng atas saat mengulang evakuasi

  // Reset 3 warga dusun ke posisi semula
  sim.villagersToRescue = [
    { id: 'mbah_tejo', npcId: 'l2_sim5_npc_lansia', name: 'Mbah Tejo', role: 'Lansia', x: 820, y: 356, rescued: false },
    { id: 'bu_siti', npcId: 'l2_sim5_npc_warga_siti', name: 'Bu Siti', role: 'Warga Rentan', x: 1220, y: 356, rescued: false },
    { id: 'dani', npcId: 'l2_sim5_npc_anak', name: 'Dani', role: 'Anak Dusun', x: 1560, y: 356, rescued: false },
  ];

  const mbah = state.npcs.get('l2_sim5_npc_lansia');
  if (mbah) {
    mbah.x = 820;
    mbah.y = 356;
    mbah.state = 'idle';
    mbah.spokenPhase = undefined;
    mbah.speechText = undefined;
    mbah.speechTimer = 0;
  }
  const siti = state.npcs.get('l2_sim5_npc_warga_siti');
  if (siti) {
    siti.x = 1220;
    siti.y = 356;
    siti.state = 'idle';
    siti.spokenPhase = undefined;
    siti.speechText = undefined;
    siti.speechTimer = 0;
  }
  const dani = state.npcs.get('l2_sim5_npc_anak');
  if (dani) {
    dani.x = 1560;
    dani.y = 356;
    dani.state = 'idle';
    dani.spokenPhase = undefined;
    dani.speechText = undefined;
    dani.speechTimer = 0;
  }
  const joko = state.npcs.get('l2_sim5_npc_pak_joko');
  if (joko) { joko.x = 1780; joko.y = 356; joko.state = 'idle'; }
  const rina = state.npcs.get('l2_sim5_npc_mbak_rina');
  if (rina) { rina.x = 1800; rina.y = 356; rina.state = 'idle'; }
  const satria = state.npcs.get('l2_sim5_npc_satria');
  if (satria) { satria.x = 460; satria.y = 356; satria.state = 'idle'; }

  // Posisi pemain kembali ke dekat tiang sirine
  state.player.x = 420;
  state.player.y = 356;
  state.player.dir = 'right';
  state.player.vx = 0;
  state.player.vy = 0;
  state.player.isWalking = false;
  state.nearInteractablePrompt = 'BANTU 3 WARGA MENUJU MOBIL EVAKUASI BPBD (0/3)! (SISA WAKTU: 15 DETIK)';
  retroAudio.playSelect();
}

export function retryVolcanoPhase(state: GameStateL2): void {
  if (!state.volcanoSim) return;
  if (state.volcanoSim.phase === 'failed') {
    retryVolcanoRescuePhase(state);
  } else {
    startSimulationArea5(state, state.volcanoSim.scenario);
  }
}

export function switchAreaL2(
  state: GameStateL2,
  targetAreaIndex: number,
  spawnAtStart = true
): void {
  state.currentAreaIndex = targetAreaIndex;
  state.zone = getAreaZoneL2(targetAreaIndex);
  state.npcs = createInitialNpcsL2(targetAreaIndex);
  state.activeDialogueTree = null;
  state.simulation = {
    phase: 'idle',
    qteTimer: 600,
    qteMaxTimer: 600,
    quakeTimer: 600,
    quakeMaxTimer: 600,
    shakeIntensity: 0,
    alarmTick: 0,
    shoutTimer: 0,
    shoutIndex: 0,
    panicShouts: [],
    evacWalkFrame: 0,
    evacProgress: 0,
    particles: [],
    playerAtDesk: false,
    playerCrouchedUnderDesk: false,
  };

  // Titik spawn aman:
  // Masuk maju (spawnAtStart = true): spawn di pangkalan barat (playerSpawnX: 80, hadap kanan)
  // Mundur (spawnAtStart = false): spawn di depan portal timur (px: 2100, hadap kiri)
  if (spawnAtStart) {
    state.player.x = state.zone.playerSpawnX;
    state.player.dir = 'right';
  } else {
    state.player.x = targetAreaIndex === 4 ? 1960 : 2060;
    state.player.dir = 'left';
    if (targetAreaIndex === 0) {
      state.unlockedGates.add('l2_gate_gempa');
    } else if (targetAreaIndex === 1) {
      state.unlockedGates.add('l2_gate_gempa_sim');
    } else if (targetAreaIndex === 2) {
      state.unlockedGates.add('l2_gate_pascabencana');
    } else if (targetAreaIndex === 3) {
      state.unlockedGates.add('l2_gate_volcano_prep');
    } else if (targetAreaIndex === 4) {
      state.unlockedGates.add('l2_gate_volcano_sim');
    } else if (targetAreaIndex === 5) {
      state.unlockedGates.add('l2_gate_shelter_recovery');
    }
  }

  state.player.y = state.zone.playerSpawnY;
  state.player.vx = 0;
  state.player.vy = 0;
  state.player.invulnerableTimer = 40;
  state.transitionCooldown = 40; // Mencegah bleed-through tombol [E] saat tiba di area baru
  state.activeSignText = null;

  state.areaTransitionBanner = {
    direction: spawnAtStart ? 'enter' : 'return',
    areaName: state.zone.name,
    subtitle: targetAreaIndex === 0
      ? 'SIMULASI RUANG KELAS: KESIAPSIAGAAN & DROP-COVER-HOLD ON'
      : targetAreaIndex === 1
        ? 'SIMULASI TANGGAP GEMPA: DROP, COVER, HOLD ON & EVAKUASI'
        : targetAreaIndex === 2
          ? 'PASCABENCANA: TITIK KUMPUL & PENANGANAN MEDIS'
          : targetAreaIndex === 3
            ? 'PRABENCANA ERUPSI MERAPI: STATUS PVMBG & KESIAPSIAGAAN KRB'
            : targetAreaIndex === 4
              ? 'SIMULASI TANGGAP ERUPSI: 4 STATUS PVMBG & EVAKUASI DUSUN'
              : 'PASCABENCANA ERUPSI: BARAK PENGUNGSIAN & PEMULIHAN BAHAYA SEKUNDER',
    timer: 240,
    maxTimer: 240,
  };

  if (targetAreaIndex === 1) {
    const isQuakeDone = state.unlockedGates.has('l2_gate_gempa_sim');
    if (isQuakeDone) {
      // Guru Bu Rahma dan 16 murid telah berhasil dievakuasi ke Area 3 (Lapangan Evakuasi)!
      // Ruang kelas kosong dan berantakan pasca-gempa.
      state.npcs.clear();
      state.simulation = {
        phase: 'completed',
        qteTimer: 0,
        qteMaxTimer: 600,
        quakeTimer: 0,
        quakeMaxTimer: 600,
        shakeIntensity: 0,
        alarmTick: 0,
        shoutTimer: 0,
        shoutIndex: 0,
        panicShouts: [],
        evacWalkFrame: 0,
        evacProgress: 100,
        particles: [],
        playerAtDesk: false,
        playerCrouchedUnderDesk: false,
      };
    }
  }

  if (targetAreaIndex === 4) {
    const isSimDone = state.unlockedGates.has('l2_gate_volcano_sim');
    state.volcanoSim = {
      phase: isSimDone ? 'volcano_completed' : 'idle',
      statusLevel: isSimDone ? 'AWAS' : 'NORMAL',
      scenario: 'explosive',
      subMap: isSimDone ? 3 : 1,
      skyDimFactor: isSimDone ? 0.9 : 0,
      vegetationWither: isSimDone ? 1.0 : 0,
      volcanoPlume: isSimDone ? 'dark_ash' : 'clear',
      magmaFlowProgress: isSimDone ? 1.0 : 0,
      fleeingBirds: [],
      birdsSpawned: false,
      ashParticles: [],
      migratingAnimals: [],
      animalsSpawned: false,
      volcanoBombs: [],
      sirenActive: false,
      sirenSoundTimer: 0,
      fase1Timer: 0,
      speechBubbleTimer: 0,
      speechBubbleText: undefined,
      teleportTimer: 0,
      earthquakeTimer: 0,
      kentonganHits: 0,
      cinematicTremorTimer: 0,
      villagersToRescue: isSimDone
        ? []
        : [
          { id: 'mbah_tejo', npcId: 'l2_sim5_npc_lansia', name: 'Mbah Tejo', role: 'Lansia', x: 820, y: 356, rescued: false },
          { id: 'bu_siti', npcId: 'l2_sim5_npc_warga_siti', name: 'Bu Siti', role: 'Warga Rentan', x: 1220, y: 356, rescued: false },
          { id: 'dani', npcId: 'l2_sim5_npc_anak', name: 'Dani', role: 'Anak Dusun', x: 1560, y: 356, rescued: false },
        ],
      qteTimer: 0,
      qteMaxTimer: 0,
      qteType: 'evac',
      qteSuccess: undefined,
      apdEquipped: isSimDone,
      truckSprintProgress: isSimDone ? 100 : 0,
      truckX: 1840,
      truckDrivingSpeed: 0,
      truckState: 'parked',
      transitionTimer: 0,
      activePhaseModal: undefined,
    };
    if (isSimDone) {
      state.volcanoSimInitialBriefingDone = true;
      // Seluruh warga dusun & tim evakuasi telah mengungsi ke Area 6 (Barak Pengungsian)! Dusun Destana kosong pascaerupsi.
      state.npcs.clear();
    }
  } else {
    state.volcanoSim = undefined;
  }

  if (spawnAtStart && targetAreaIndex === 2) {
    state.activeDialogueTree = DIALOGUE_TREES_L2['resqy_briefing_area3'];
  } else if (spawnAtStart && targetAreaIndex === 3) {
    state.activeDialogueTree = DIALOGUE_TREES_L2['resqy_briefing_area4'];
  } else if (spawnAtStart && targetAreaIndex === 5) {
    state.activeDialogueTree = DIALOGUE_TREES_L2['resqy_briefing_area6'];
  }

  saveLevel2Progress(state);
}

// ── HELPER: SPAWN PUING-PUING RUANG KELAS YANG TAMPAK JELAS DI VIEWPORT ──
function spawnSimulationDebris(
  particles: DebrisParticleL2[],
  playerX: number,
  scenario: 'moderate' | 'severe' = 'severe'
): void {
  const isModerate = scenario === 'moderate';
  const maxCap = isModerate
    ? EARTHQUAKE_SHAKE_CONFIG.MODERATE.maxDebris
    : EARTHQUAKE_SHAKE_CONFIG.SEVERE.maxDebris;

  if (particles.length >= maxCap) {
    const settledIdx = particles.findIndex((p) => p.settled);
    if (settledIdx !== -1) {
      particles.splice(settledIdx, 1);
    } else {
      return;
    }
  }

  // Pusatkan spawn puing tepat di area kamera aktif ruang kelas (x: 180..880)
  const minX = Math.max(180, playerX - 320);
  const maxX = Math.min(880, playerX + 320);
  const x = minX + Math.random() * (maxX - minX);

  if (isModerate) {
    // Skenario Gempa Sedang: Puing sedikit & lebih kecil (debu kapur & serpihan plester 2-4px, tanpa semen/plafon balok)
    const sz = 2 + Math.floor(Math.random() * 3);
    particles.push({
      x,
      y: 12 + Math.random() * 16,
      vx: (Math.random() - 0.5) * 0.7,
      vy: 1.3 + Math.random() * 1.3,
      size: sz,
      width: sz,
      height: sz,
      type: 'dust',
      color: Math.random() > 0.5 ? '#f8fafc' : '#fef08a',
      rotation: 0,
      rotSpeed: (Math.random() - 0.5) * 0.08,
      bounced: false,
      settled: false,
      opacity: 0.9,
    });
    return;
  }

  // Skenario Gempa Besar: Puing besar & berhamburan banyak (plafon akustik 16-24px, beton 8-16px, debu)
  const randType = Math.random();

  if (randType < 0.45) {
    // 1. Papan Plafon Akustik (Ceiling Tile Slab)
    particles.push({
      x,
      y: 10 + Math.random() * 20,
      vx: (Math.random() - 0.5) * 1.2,
      vy: 2.2 + Math.random() * 2.2,
      size: 16,
      width: 14 + Math.floor(Math.random() * 9),
      height: 5 + Math.floor(Math.random() * 3),
      type: 'tile',
      color: Math.random() > 0.4 ? '#e2e8f0' : '#f1f5f9',
      rotation: (Math.random() - 0.5) * 0.25,
      rotSpeed: (Math.random() - 0.5) * 0.05,
      bounced: false,
      settled: false,
      opacity: 1,
    });
  } else if (randType < 0.8) {
    // 2. Bongkahan Batu Beton / Semen (Concrete Chunk)
    const sz = 8 + Math.floor(Math.random() * 6);
    particles.push({
      x,
      y: 10 + Math.random() * 20,
      vx: (Math.random() - 0.5) * 1.4,
      vy: 3.0 + Math.random() * 2.5,
      size: sz,
      width: sz,
      height: sz,
      type: 'rock',
      color: Math.random() > 0.5 ? '#64748b' : '#475569',
      rotation: 0,
      rotSpeed: (Math.random() - 0.5) * 0.1,
      bounced: false,
      settled: false,
      opacity: 1,
    });
  } else {
    // 3. Serpihan Plester & Debu Kapur (Dust / Chalk)
    const sz = 3 + Math.floor(Math.random() * 3);
    particles.push({
      x,
      y: 10 + Math.random() * 20,
      vx: (Math.random() - 0.5) * 1.0,
      vy: 1.8 + Math.random() * 2.0,
      size: sz,
      width: sz,
      height: sz,
      type: 'dust',
      color: Math.random() > 0.5 ? '#f8fafc' : '#fde047',
      rotation: 0,
      rotSpeed: (Math.random() - 0.5) * 0.15,
      bounced: false,
      settled: false,
      opacity: 1,
    });
  }
}

// ── HELPER PARTIKEL SIMULASI ERUPSI MERAPI (AREA 5) ──
export function spawnFleeingBirds(sim: VolcanoSimulationDataL2, originX?: number): void {
  // Burung menyebar keluar dari puncak kawah Merapi ke arah kiri dan kanan (bodi ramping & kecil)
  const peakX = originX ?? 650;
  const peakY = 88;

  // 1. Kawanan Burung Terbang Menuruni Lereng Kiri (vx < 0, menghadap kiri)
  for (let i = 0; i < 6; i++) {
    const spreadX = -8 - i * 14 + (Math.random() - 0.5) * 10;
    const spreadY = -4 + i * 7 + (Math.random() - 0.5) * 8;
    sim.fleeingBirds.push({
      x: peakX + spreadX,
      y: peakY + spreadY,
      vx: -(1.35 + Math.random() * 0.45), // Gerak perlahan & anggun menuruni lereng kiri
      vy: 0.16 + Math.random() * 0.14,    // Sudut luncur halus
      wingAngle: Math.random() * Math.PI,
      size: 3.2 + Math.random() * 1.2,    // Badan burung dikecilkan (size 3.2 .. 4.4)
      facing: 'left',
    });
  }

  // 2. Kawanan Burung Terbang Menuruni Lereng Kanan (vx > 0, menghadap kanan)
  for (let i = 0; i < 6; i++) {
    const spreadX = 8 + i * 14 + (Math.random() - 0.5) * 10;
    const spreadY = -4 + i * 7 + (Math.random() - 0.5) * 8;
    sim.fleeingBirds.push({
      x: peakX + spreadX,
      y: peakY + spreadY,
      vx: 1.35 + Math.random() * 0.45,   // Gerak perlahan & anggun menuruni lereng kanan
      vy: 0.16 + Math.random() * 0.14,    // Sudut luncur halus
      wingAngle: Math.random() * Math.PI,
      size: 3.2 + Math.random() * 1.2,    // Badan burung dikecilkan (size 3.2 .. 4.4)
      facing: 'right',
    });
  }
}

export function updateFleeingBirds(sim: VolcanoSimulationDataL2): void {
  // Update posisi kawanan burung (TIDAK ADA RESPAWN - kabur sekali saja)
  for (let i = sim.fleeingBirds.length - 1; i >= 0; i--) {
    const b = sim.fleeingBirds[i];
    b.x += b.vx;
    b.y += b.vy;
    b.wingAngle += 0.16; // Animasi kepak sayap halus
    if (b.x < -300 || b.x > 3000 || b.y > 450) {
      sim.fleeingBirds.splice(i, 1);
    }
  }
}

// Helper: Seluruh warga dusun yang sudah dievakuasi terus mengikuti jalan bersama pemain sampai naik mobil
export function updateRescuedVillagersFollow(state: GameStateL2, sim: VolcanoSimulationDataL2): void {
  const followFacing = state.player.dir;
  for (let idx = 0; idx < sim.villagersToRescue.length; idx++) {
    const v = sim.villagersToRescue[idx];
    if (v.rescued) {
      const npc = state.npcs.get(v.npcId);
      if (npc) {
        // Berada beriringan di belakang pemain sesuai arah hadap
        const offset = (idx + 1) * 26;
        const followTargetX = followFacing === 'right' ? state.player.x - offset : state.player.x + offset;
        const dist = Math.abs(npc.x - followTargetX);
        if (dist > 12) {
          npc.dir = npc.x < followTargetX ? 'right' : 'left';
          const speed = dist > 90 ? 3.5 : dist > 40 ? 2.6 : 2.0;
          npc.x += (npc.dir === 'right' ? speed : -speed);
          npc.state = 'walk';
          if (state.animTick % 5 === 0) npc.animFrame = (npc.animFrame + 1) % 4;
        } else {
          npc.state = 'idle';
          npc.animFrame = 0;
        }
        // Selalu sinkronkan posisi data dengan posisi riil NPC
        v.x = npc.x;
        v.y = npc.y;
      }
    }
  }
}

function spawnAshFallParticle(sim: VolcanoSimulationDataL2, playerX: number): void {
  if (sim.ashParticles.length >= 75) return;
  const minX = Math.max(0, playerX - 450);
  const maxX = Math.min(2200, playerX + 450);
  sim.ashParticles.push({
    x: minX + Math.random() * (maxX - minX),
    y: Math.random() * 50,
    vx: (Math.random() - 0.5) * 1.2 - 0.8,
    vy: 1.2 + Math.random() * 1.8,
    size: 2 + Math.floor(Math.random() * 3),
    opacity: 0.6 + Math.random() * 0.4,
    color: Math.random() > 0.4 ? '#94a3b8' : '#64748b',
  });
}

function updateAshFallParticles(sim: VolcanoSimulationDataL2): void {
  for (let i = sim.ashParticles.length - 1; i >= 0; i--) {
    const p = sim.ashParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    if (p.y >= 360) {
      sim.ashParticles.splice(i, 1);
    }
  }
}

// ── HELPER SATWA MIGRASI & BOM VULKANIK (AREA 5) ──
function spawnMigratingAnimals(sim: VolcanoSimulationDataL2): void {
  sim.migratingAnimals = [
    // 1. Burung (3 ekor terbang di langit)
    { id: 'bird_1', type: 'burung', kind: 'burung', dir: 'right', x: -60, y: 130, vx: 5.2, vy: -0.2, animFrame: 0, size: 9 },
    { id: 'bird_2', type: 'burung', kind: 'burung', dir: 'right', x: -120, y: 155, vx: 5.6, vy: 0.1, animFrame: 2, size: 8 },
    { id: 'bird_3', type: 'burung', kind: 'burung', dir: 'right', x: -180, y: 120, vx: 5.0, vy: -0.1, animFrame: 4, size: 10 },
    // 2. Rusa (2 ekor berlari kencang)
    { id: 'deer_1', type: 'rusa', kind: 'rusa', dir: 'right', x: -80, y: 356, vx: 4.8, vy: 0, animFrame: 0, size: 24, state: 'running' },
    { id: 'deer_2', type: 'rusa', kind: 'rusa', dir: 'right', x: -170, y: 356, vx: 5.2, vy: 0, animFrame: 2, size: 22, state: 'running' },
    // 3. Kera (2 ekor melompat lincah)
    { id: 'monkey_1', type: 'kera', kind: 'kera', dir: 'right', x: -130, y: 356, vx: 4.2, vy: 0, animFrame: 0, size: 18, state: 'leaping' },
    { id: 'monkey_2', type: 'kera', kind: 'kera', dir: 'right', x: -220, y: 356, vx: 4.6, vy: 0, animFrame: 3, size: 16, state: 'leaping' },
    // 4. Macan (1 ekor berlari kencang)
    { id: 'tiger_1', type: 'macan', kind: 'macan', dir: 'right', x: -270, y: 356, vx: 5.8, vy: 0, animFrame: 1, size: 26, state: 'running' },
  ];
}

function spawnAdditionalAnimalWave(sim: VolcanoSimulationDataL2, waveIndex: number): void {
  const wave: MigratingAnimalL2[] = [
    { id: `bird_wave_${waveIndex}`, type: 'burung', kind: 'burung', dir: 'right', x: -40, y: 120 + (waveIndex % 3) * 18, vx: 5.4, vy: 0, animFrame: 1, size: 9 },
    { id: `deer_wave_${waveIndex}`, type: 'rusa', kind: 'rusa', dir: 'right', x: -70, y: 356, vx: 5.0, vy: 0, animFrame: 0, size: 24, state: 'running' },
    { id: `monkey_wave_${waveIndex}`, type: 'kera', kind: 'kera', dir: 'right', x: -130, y: 356, vx: 4.5, vy: 0, animFrame: 2, size: 18, state: 'leaping' },
  ];
  sim.migratingAnimals.push(...wave);
}

function updateMigratingAnimals(sim: VolcanoSimulationDataL2, animTick: number): void {
  for (let i = sim.migratingAnimals.length - 1; i >= 0; i--) {
    const a = sim.migratingAnimals[i];
    a.x += a.vx;
    const aType = a.kind || a.type;
    if (aType === 'burung') {
      a.y += Math.sin(animTick * 0.15 + a.x * 0.02) * 0.35;
      a.animFrame = (a.animFrame + 1) % 8;
    } else if (aType === 'kera') {
      a.y = 356 - Math.abs(Math.sin(animTick * 0.18 + a.x * 0.05)) * 14;
      if (animTick % 6 === 0) a.animFrame = (a.animFrame + 1) % 4;
    } else {
      if (animTick % 5 === 0) a.animFrame = (a.animFrame + 1) % 4;
    }
    if (a.x > 2400) {
      sim.migratingAnimals.splice(i, 1);
    }
  }
}

function spawnVolcanoBombs(sim: VolcanoSimulationDataL2, targetX: number = 600): void {
  // Batasi batuan vulkanik jatuh agar tidak berlebihan (maksimal 3 batuan aktif di layar)
  if (sim.volcanoBombs.length >= 3) return;

  // Munculkan 1 atau 2 batuan jatuh ("gausah banyak banyak dikit aja")
  const count = 1 + (Math.random() < 0.25 ? 1 : 0);
  for (let i = 0; i < count; i++) {
    const rad = 3.2 + Math.random() * 3.2;
    const initialRot = Math.random() * Math.PI * 2;
    // Muncul dari ATAS langit (y: -25 sampai -10) di area layar dekat pemain
    const spawnX = targetX + (Math.random() - 0.5) * 420;
    sim.volcanoBombs.push({
      x: spawnX,
      y: -25 - Math.random() * 20,
      vx: (Math.random() - 0.5) * 1.1, // Sedikit melayang miring tertiup angin
      vy: 3.4 + Math.random() * 1.8,   // Jatuh dari atas ke bawah
      radius: rad,
      size: rad * 2,
      rot: initialRot,
      rotation: initialRot,
      rotSpeed: (Math.random() - 0.5) * 0.15,
      trail: [],
    });
  }
}

function updateVolcanoBombs(sim: VolcanoSimulationDataL2): void {
  for (let i = sim.volcanoBombs.length - 1; i >= 0; i--) {
    const b = sim.volcanoBombs[i];
    b.trail.unshift({ x: b.x, y: b.y, opacity: 0.85 });
    if (b.trail.length > 7) b.trail.pop();
    for (const t of b.trail) {
      t.opacity -= 0.11;
    }

    b.x += b.vx;
    b.y += b.vy;
    b.vy += 0.04; // Akselerasi jatuh alami
    b.rot += b.rotSpeed;
    b.rotation = b.rot;

    if (b.y > 365) {
      sim.volcanoBombs.splice(i, 1);
    }
  }
}

// ── MESIN STATE SIMULASI ERUPSI MERAPI (AREA 5) ──
export function updateVolcanoSimulationL2(
  state: GameStateL2,
  input: InputStateL2
): void {
  const sim = state.volcanoSim;
  if (!sim) return;

  // Update partikel bom vulkanik eflata secara kontinu saat meletus
  if (sim.volcanoBombs && sim.volcanoBombs.length > 0) {
    updateVolcanoBombs(sim);
  }

  // Update partikel hujan abu
  updateAshFallParticles(sim);

  // Update satwa liar bermigrasi secara kontinu di semua fase agar tidak berhenti saat fase berganti
  if (sim.migratingAnimals && sim.migratingAnimals.length > 0) {
    updateMigratingAnimals(sim, state.animTick);
  }

  // Update progresi dinamis lelehan magma mengalir turun dari kawah saat letusan meledak
  if (
    sim.volcanoPlume === 'magma_fountain' ||
    sim.phase === 'fase4_awas_siren' ||
    sim.phase === 'fase4_awas_rescue' ||
    sim.phase === 'fase4_awas_truck'
  ) {
    if (sim.magmaFlowProgress === undefined) {
      sim.magmaFlowProgress = 0;
    }
    if (sim.magmaFlowProgress < 1.0) {
      // Aliran lava diperlambat lagi agar merayap sangat kental dan lambat
      const flowRate = sim.scenario === 'effusive' ? 0.00030 : 0.00055;
      sim.magmaFlowProgress = Math.min(1.0, sim.magmaFlowProgress + flowRate);
    }
  } else if (sim.phase === 'volcano_completed') {
    sim.magmaFlowProgress = 1.0;
  }

  // 0. Fase Eksplorasi Bebas Sebelum Simulasi Dimulai
  if (sim.phase === 'idle') {
    state.simulation.shakeIntensity = 0;
    return;
  }

  // 0b. Fase Gagal Evakuasi Warga (Timer 15 Detik Habis)
  if (sim.phase === 'failed') {
    input.left = false;
    input.right = false;
    input.up = false;
    input.upJustPressed = false;
    state.player.vx = 0;
    state.player.isWalking = false;
    state.simulation.shakeIntensity = 0;
    state.nearInteractablePrompt = 'TEKAN [E] / [SPASI] / TAP UNTUK MENCOBA LAGI';

    if (input.interactJustPressed) {
      input.interactJustPressed = false;
      retryVolcanoRescuePhase(state);
    }
    return;
  }

  // 1. FASE 1: POPUP NORMAL (Menunggu pemain menutup popup)
  if (sim.phase === 'fase1_normal_popup') {
    input.left = false;
    input.right = false;
    input.up = false;
    input.upJustPressed = false;
    state.player.vx = 0;
    state.player.isWalking = false;
    state.simulation.shakeIntensity = 0;
    return;
  }

  // 1.1 FASE 1: EXPLORING (Kondisi gunung normal selama 2 detik + ucapan karakter)
  if (sim.phase === 'fase1_normal_exploring') {
    state.simulation.shakeIntensity = 0;
    sim.volcanoPlume = 'clear';

    if (sim.fase1Timer > 0) {
      sim.fase1Timer--;
      if (sim.fase1Timer === 0) {
        sim.speechBubbleText = 'Wuah indah banget tempat ini!';
        sim.speechBubbleTimer = 150; // ~2.5 detik
        retroAudio.playSelect();
      }
    } else if (sim.speechBubbleTimer > 0) {
      sim.speechBubbleTimer--;
      if (sim.speechBubbleTimer === 0) {
        sim.speechBubbleText = undefined;
        // Transisi otomatis ke Fase 2: Waspada!
        sim.phase = 'fase2_waspada_popup';
        sim.activePhaseModal = 'WASPADA';
        sim.statusLevel = 'WASPADA';
        retroAudio.playAlarm();
      }
    }
    return;
  }

  // 2. FASE 2: POPUP WASPADA
  if (sim.phase === 'fase2_waspada_popup') {
    input.left = false;
    input.right = false;
    input.up = false;
    input.upJustPressed = false;
    state.player.vx = 0;
    state.player.isWalking = false;
    state.simulation.shakeIntensity = 0;
    return;
  }

  // 2.1 FASE 2: EVAKUASI SEJAUH 2 KM (Map 1)
  if (sim.phase === 'fase2_waspada_evac') {
    // Gempa ringan & asap mulai keluar dari kawah
    state.simulation.shakeIntensity = 0.75 + Math.sin(state.animTick * 0.25) * 0.25;
    sim.volcanoPlume = 'white_steam';
    sim.skyDimFactor = Math.min(0.25, sim.skyDimFactor + 0.002);

    const distToRight = Math.max(0, 2100 - state.player.x);
    state.nearInteractablePrompt = `[STATUS WASPADA] MENJAUH SEJAUH 2 KM DARI LERENG! LARI KE KANAN MENTOK (${Math.round(distToRight)}M)`;

    // Seluruh NPC warga dusun & tim SAR berlari ke kanan menuju batas evakuasi Map 1
    for (const [nid, npc] of Array.from(state.npcs.entries())) {
      if (npc.id === 'l2_sim5_npc_resqy') continue; // Robot Resqy mendampingi pemain
      npc.x += 2.2;
      npc.dir = 'right';
      npc.state = 'walk';
      if (state.animTick % 5 === 0) npc.animFrame = (npc.animFrame + 1) % 4;
      // Saat mencapai batas kanan map (x >= 2100), NPC langsung menghilang seolah sudah tiba di map berikutnya!
      if (npc.x >= 2100) {
        state.npcs.delete(nid);
      }
    }

    // Pemain mencapai mentok kanan (x >= 2100): Teleport langsung pindah ke Map 2!
    if (state.player.x >= 2100) {
      sim.phase = 'teleport_to_map2';
      sim.teleportTimer = 45; // ~0.75s transisi
      state.simulation.shakeIntensity = 0;
      retroAudio.playPowerup();
      state.nearInteractablePrompt = null;
    }
    return;
  }

  // 2.2 TRANSISI KE MAP 2
  if (sim.phase === 'teleport_to_map2') {
    input.left = false;
    input.right = false;
    input.up = false;
    input.upJustPressed = false;
    state.player.vx = 0;
    state.player.isWalking = false;

    sim.teleportTimer--;
    if (sim.teleportTimer <= 0) {
      sim.subMap = 2; // Pindah ke Map 2!
      state.player.x = 100;
      state.player.y = 360;
      state.player.dir = 'right';
      state.player.vx = 0;

      // Gempa berhenti di Dusun Lereng Tengah! Status MASIH WASPADA!
      state.simulation.shakeIntensity = 0;
      sim.statusLevel = 'WASPADA';
      sim.volcanoPlume = 'white_steam';
      sim.skyDimFactor = 0.05;
      sim.vegetationWither = 0.1;

      // Hidupkan kembali NPC warga dusun yang sudah tiba di Dusun Lereng Tengah Map 2
      state.npcs = createInitialNpcsL2(4);
      const joko = state.npcs.get('l2_sim5_npc_pak_joko');
      if (joko) {
        joko.x = 340;
        joko.anchorX = 340;
        joko.patrolRange = 65;
        joko.speed = 0.65;
        joko.state = 'walk';
        joko.dir = 'right';
      }
      const rina = state.npcs.get('l2_sim5_npc_mbak_rina');
      if (rina) {
        rina.x = 440;
        rina.anchorX = 440;
        rina.patrolRange = 55;
        rina.speed = 0.7;
        rina.state = 'walk';
        rina.dir = 'left';
      }
      const mbah = state.npcs.get('l2_sim5_npc_lansia');
      if (mbah) {
        mbah.x = 680;
        mbah.anchorX = 680;
        mbah.patrolRange = 40;
        mbah.speed = 0.45;
        mbah.state = 'walk';
        mbah.dir = 'right';
      }
      const siti = state.npcs.get('l2_sim5_npc_warga_siti');
      if (siti) {
        siti.x = 920;
        siti.anchorX = 920;
        siti.patrolRange = 60;
        siti.speed = 0.6;
        siti.state = 'walk';
        siti.dir = 'left';
      }
      const dani = state.npcs.get('l2_sim5_npc_anak');
      if (dani) {
        dani.x = 1200;
        dani.anchorX = 1200;
        dani.patrolRange = 80;
        dani.speed = 0.8;
        dani.state = 'walk';
        dani.dir = 'right';
      }
      const satria = state.npcs.get('l2_sim5_npc_satria');
      if (satria) {
        satria.x = 1460;
        satria.anchorX = 1460;
        satria.patrolRange = 50;
        satria.speed = 0.55;
        satria.state = 'walk';
        satria.dir = 'left';
      }

      // Selang 6 detik keliling santai sebelum layar jadi gelap
      sim.phase = 'fase2_map2_arrived';
      sim.map2ArrivalTimer = 360; // 6 DETIK keliling santai
      retroAudio.playPowerup();
    }
    return;
  }

  // 2.3 FASE 2.5: JELAJAHI DUSUN LERENG TENGAH SESAAT SETELAH TIBA (6 DETIK, MASIH STATUS WASPADA)
  if (sim.phase === 'fase2_map2_arrived' || sim.phase === 'fase2_map2_calm') {
    state.simulation.shakeIntensity = 0; // Gempa berhenti
    sim.statusLevel = 'WASPADA';
    sim.volcanoPlume = 'white_steam';
    const secLeft = Math.ceil((sim.map2ArrivalTimer ?? 360) / 60);
    state.nearInteractablePrompt = `[ZONA AMAN MENENGAH] GEMPA MEREDA. SILAKAN KELILING & AMATI DUSUN LERENG TENGAH (${secLeft}S)`;

    sim.map2ArrivalTimer = (sim.map2ArrivalTimer ?? 360) - 1;
    if (sim.map2ArrivalTimer <= 0) {
      // Layar jadi gelap!
      sim.phase = 'fase2_dark_screen';
      sim.darkScreenTimer = 180; // ~3 detik layar gelap
      state.nearInteractablePrompt = null;
      retroAudio.playSelect();
    }
    return;
  }

  // 2.4 FASE 2.6: LAYAR JADI GELAP & TULISAN "BEBERAPA HARI KEMUDIAN..."
  if (sim.phase === 'fase2_dark_screen' || sim.phase === 'fase3_beberapa_hari_kemudian') {
    input.left = false;
    input.right = false;
    input.up = false;
    input.upJustPressed = false;
    state.player.vx = 0;
    state.player.isWalking = false;
    state.simulation.shakeIntensity = 0;
    sim.statusLevel = 'WASPADA';

    sim.darkScreenTimer = (sim.darkScreenTimer ?? 180) - 1;
    if (sim.darkScreenTimer <= 0) {
      // Layar kembali terang, jeda 6 detik penuh dan status MASIH WASPADA!
      sim.phase = 'fase2_map2_after_timeskip';
      sim.afterTimeskipTimer = 360; // 6 DETIK PENUH (6 * 60 ticks)
      sim.statusLevel = 'WASPADA';
      sim.volcanoPlume = 'white_steam';
      retroAudio.playPowerup();
    }
    return;
  }

  // 2.5 FASE 2.7: LAYAR KEMBALI TERANG, 6 DETIK EKSPLORASI (STATUS MASIH WASPADA)
  if (sim.phase === 'fase2_map2_after_timeskip') {
    state.simulation.shakeIntensity = 0;
    sim.statusLevel = 'WASPADA'; // STATUS MASIH WASPADA!
    sim.volcanoPlume = 'white_steam';
    const secLeft = Math.ceil((sim.afterTimeskipTimer ?? 360) / 60);
    state.nearInteractablePrompt = `[STATUS WASPADA] HARI KE-5 DI DUSUN LERENG TENGAH (${secLeft}S)`;

    sim.afterTimeskipTimer = (sim.afterTimeskipTimer ?? 360) - 1;
    if (sim.afterTimeskipTimer <= 0) {
      // Baru setelah 6 detik itu baru masuk ke fase 3!
      sim.phase = 'fase3_siaga_popup';
      sim.activePhaseModal = 'SIAGA';
      sim.statusLevel = 'SIAGA';
      sim.skyDimFactor = 0.45;
      sim.vegetationWither = 0.5;
      sim.volcanoPlume = 'dark_ash';
      state.nearInteractablePrompt = null;
      retroAudio.playAlarm();
    }
    return;
  }

  // 3. FASE 3: POPUP SIAGA
  if (sim.phase === 'fase3_siaga_popup') {
    input.left = false;
    input.right = false;
    input.up = false;
    input.upJustPressed = false;
    state.player.vx = 0;
    state.player.isWalking = false;
    state.simulation.shakeIntensity = 0;
    return;
  }

  // 3.1 FASE 3: MIGRASI SATWA (Map 2 - 6 DETIK PENUH TANDA ALAMI)
  if (sim.phase === 'fase3_siaga_migration') {
    // Getaran mikro halus di lereng (hawa panas memicu satwa turun lebih dahulu)
    state.simulation.shakeIntensity = 0.2 + Math.sin(state.animTick * 0.2) * 0.1;
    sim.volcanoPlume = 'dark_ash';

    // Suara gemuruh kawah tipis berkala
    if (state.animTick % 150 === 0) {
      retroAudio.playVolcanoBoom();
    }

    // Partikel abu tipis-tipis
    if (state.animTick % 12 === 0) {
      spawnAshFallParticle(sim, state.player.x);
    }

    // Spawn satwa migrasi jika belum
    if (!sim.animalsSpawned) {
      sim.animalsSpawned = true;
      sim.migrationTimer = 360; // 6 DETIK PENUH!
      spawnMigratingAnimals(sim);
      retroAudio.playPowerup();
    }

    // Spawn gelombang satwa berikutnya setiap 90 tick (~1.5s) selama migrasi berlangsung
    if (sim.migrationTimer !== undefined && sim.migrationTimer > 60 && sim.migrationTimer % 90 === 0) {
      spawnAdditionalAnimalWave(sim, Math.floor(sim.migrationTimer / 90));
    }

    const secLeft = Math.ceil((sim.migrationTimer ?? 360) / 60);
    state.nearInteractablePrompt = `[TANDA AWAL ALAMI] PERHATIKAN! SATWA LIAR LERENG BERMIGRASI TURUN KARENA HAWA PANAS & SUHU KAWAH MERAPI! (${secLeft}S)`;

    sim.migrationTimer = (sim.migrationTimer ?? 360) - 1;
    if (sim.migrationTimer <= 0) {
      // Satwa sudah selesai memberikan tanda awal -> Gempa vulkanik meningkat & evakuasi warga dimulai!
      sim.phase = 'fase3_siaga_prep_evac';
      retroAudio.playAlarm();
      state.nearInteractablePrompt = null;
    }
    return;
  }

  // 3.2 FASE 3: PERSIAPAN TAS SIAGA & EVAKUASI RADIUS 3-5 KM (Map 2)
  if (sim.phase === 'fase3_siaga_prep_evac') {
    state.simulation.shakeIntensity = 1.3 + Math.sin(state.animTick * 0.25) * 0.4;
    sim.volcanoPlume = 'dark_ash';

    if (state.animTick % 7 === 0) {
      spawnAshFallParticle(sim, state.player.x);
    }

    // SELURUH NPC LANGSUNG BERLARI PANIK KE KANAN TANPA MENUNGGU PEMAIN MEMAKAI MASKER!
    for (const [nid, npc] of Array.from(state.npcs.entries())) {
      if (npc.id === 'l2_sim5_npc_resqy') continue;
      npc.x += 3.4; // Berlari sangat kencang & panik
      npc.dir = 'right';
      npc.state = 'walk';
      if (state.animTick % 4 === 0) npc.animFrame = (npc.animFrame + 1) % 4;
      if (npc.x >= 2100) {
        state.npcs.delete(nid);
      }
    }

    if (!sim.apdEquipped) {
      state.nearInteractablePrompt = 'TEKAN [E] / [SPASI] / TAP UNTUK MENYIAPKAN TAS SIAGA & MEMAKAI MASKER N95!';
      if (input.interactJustPressed) {
        input.interactJustPressed = false;
        sim.apdEquipped = true;
        retroAudio.playPowerup();
      }
    } else {
      const distToRight = Math.max(0, 2100 - state.player.x);
      state.nearInteractablePrompt = `[SIAGA] TAS SIAGA & MASKER SIAP! MENGUNGSI 3-5 KM KE RADIUS AMAN (LARI KE KANAN ${Math.round(distToRight)}M)`;

      // Pemain mencapai mentok kanan (x >= 2100): Teleport ke Map 3!
      if (state.player.x >= 2100) {
        sim.phase = 'teleport_to_map3';
        sim.teleportTimer = 45;
        state.simulation.shakeIntensity = 0;
        retroAudio.playPowerup();
        state.nearInteractablePrompt = null;
      }
    }
    return;
  }

  // 3.3 TRANSISI KE MAP 3 (Posko Evakuasi / Radius 5 km)
  if (sim.phase === 'teleport_to_map3') {
    input.left = false;
    input.right = false;
    input.up = false;
    input.upJustPressed = false;
    state.player.vx = 0;
    state.player.isWalking = false;

    sim.teleportTimer--;
    if (sim.teleportTimer <= 0) {
      sim.subMap = 3; // Pindah ke Map 3!
      state.player.x = 100;
      state.player.y = 360;
      state.player.dir = 'right';

      // Reposisi warga di Map 3 (Posko Pengungsian / Radius 5 km)
      state.npcs = createInitialNpcsL2(4);
      const joko = state.npcs.get('l2_sim5_npc_pak_joko');
      if (joko) {
        joko.x = 420;
        joko.anchorX = 420;
        joko.patrolRange = 40;
        joko.speed = 0.6;
        joko.state = 'walk';
        joko.dir = 'right';
      }
      const rina = state.npcs.get('l2_sim5_npc_mbak_rina');
      if (rina) {
        rina.x = 520;
        rina.anchorX = 520;
        rina.patrolRange = 35;
        rina.speed = 0.65;
        rina.state = 'walk';
        rina.dir = 'left';
      }
      const mbah = state.npcs.get('l2_sim5_npc_lansia');
      if (mbah) {
        mbah.x = 780;
        mbah.anchorX = 780;
        mbah.patrolRange = 25;
        mbah.speed = 0.4;
        mbah.state = 'walk';
        mbah.dir = 'right';
      }
      const siti = state.npcs.get('l2_sim5_npc_warga_siti');
      if (siti) {
        siti.x = 1120;
        siti.anchorX = 1120;
        siti.patrolRange = 45;
        siti.speed = 0.55;
        siti.state = 'walk';
        siti.dir = 'left';
      }
      const dani = state.npcs.get('l2_sim5_npc_anak');
      if (dani) {
        dani.x = 1450;
        dani.anchorX = 1450;
        dani.patrolRange = 60;
        dani.speed = 0.75;
        dani.state = 'walk';
        dani.dir = 'right';
      }
      const satria = state.npcs.get('l2_sim5_npc_satria');
      if (satria) {
        satria.x = 1760;
        satria.anchorX = 1760;
        satria.patrolRange = 30;
        satria.speed = 0.5;
        satria.state = 'walk';
        satria.dir = 'left';
      }

      // Jeda 6 detik pertama di Map 3 (Eksplorasi Posko Evakuasi, Status MASIH SIAGA)
      sim.phase = 'fase3_map3_arrived';
      sim.map3ArrivalTimer = 360; // 6 detik
      sim.statusLevel = 'SIAGA';
      sim.volcanoPlume = 'dark_ash';
      sim.skyDimFactor = 0.45;
      retroAudio.playPowerup();
    }
    return;
  }

  // 3.4 FASE 3.4: JELAJAHI POSKO MAP 3 SETELAH TIBA (6 DETIK, MASIH STATUS SIAGA)
  if (sim.phase === 'fase3_map3_arrived') {
    state.simulation.shakeIntensity = 0; // Gempa mereda sementara di posko
    sim.statusLevel = 'SIAGA';
    sim.volcanoPlume = 'dark_ash';
    const secLeft = Math.ceil((sim.map3ArrivalTimer ?? 360) / 60);
    state.nearInteractablePrompt = `[STATUS SIAGA] TIBA DI POSKO EVAKUASI RADIUS 5 KM! AMATI WARGA & POSKO (${secLeft}S)`;

    sim.map3ArrivalTimer = (sim.map3ArrivalTimer ?? 360) - 1;
    if (sim.map3ArrivalTimer <= 0) {
      // Layar jadi gelap: Waktu berlalu ke fase krusial berikutnya!
      sim.phase = 'fase3_map3_dark_screen';
      sim.darkScreenTimer = 180; // ~3 detik layar gelap
      state.nearInteractablePrompt = null;
      retroAudio.playSelect();
    }
    return;
  }

  // 3.5 FASE 3.5: TRANSISI WAKTU MAP 3 (LAYAR GELAP "BEBERAPA HARI KEMUDIAN...")
  if (sim.phase === 'fase3_map3_dark_screen') {
    input.left = false;
    input.right = false;
    input.up = false;
    input.upJustPressed = false;
    state.player.vx = 0;
    state.player.isWalking = false;
    state.simulation.shakeIntensity = 0;
    sim.statusLevel = 'SIAGA';

    sim.darkScreenTimer = (sim.darkScreenTimer ?? 180) - 1;
    if (sim.darkScreenTimer <= 0) {
      // Layar kembali terang, jeda 6 detik kedua (STATUS MASIH SIAGA, tremor vulkanik meningkat)
      sim.phase = 'fase3_map3_after_timeskip';
      sim.map3AfterTimeskipTimer = 360; // 6 detik penuh
      sim.statusLevel = 'SIAGA';
      sim.volcanoPlume = 'dark_ash';
      sim.skyDimFactor = 0.55;
      retroAudio.playPowerup();
    }
    return;
  }

  // 3.6 FASE 3.6: 6 DETIK JEDA KEDUA SEBELUM STATUS AWAS (MASIH STATUS SIAGA)
  if (sim.phase === 'fase3_map3_after_timeskip') {
    // Getaran mikro semakin terasa menandakan magma naik cepat
    state.simulation.shakeIntensity = 0.3 + Math.sin(state.animTick * 0.2) * 0.15;
    sim.statusLevel = 'SIAGA';
    sim.volcanoPlume = 'dark_ash';

    if (state.animTick % 120 === 0) {
      retroAudio.playVolcanoBoom();
    }
    if (state.animTick % 14 === 0) {
      spawnAshFallParticle(sim, state.player.x);
    }

    const secLeft = Math.ceil((sim.map3AfterTimeskipTimer ?? 360) / 60);
    state.nearInteractablePrompt = `[STATUS SIAGA TINGGI] AKTIVITAS KAWAH MENINGKAT PESAT! WASPADA EVAKUASI TOTAL (${secLeft}S)`;

    sim.map3AfterTimeskipTimer = (sim.map3AfterTimeskipTimer ?? 360) - 1;
    if (sim.map3AfterTimeskipTimer <= 0) {
      // Setelah 6 detik jeda kedua, baru masuk ke Fase 4 Status Awas!
      sim.phase = 'fase4_awas_popup';
      sim.activePhaseModal = 'AWAS';
      sim.statusLevel = 'AWAS';
      sim.earthquakeTimer = 120; // 2 detik gempa besar
      sim.sirenActive = false;
      sim.sirenSoundTimer = 0;
      sim.truckState = 'parked';
      sim.truckX = 1840;
      state.nearInteractablePrompt = null;
      retroAudio.playAlarm();
    }
    return;
  }

  // 4. FASE 4: POPUP AWAS
  if (sim.phase === 'fase4_awas_popup') {
    input.left = false;
    input.right = false;
    input.up = false;
    input.upJustPressed = false;
    state.player.vx = 0;
    state.player.isWalking = false;
    state.simulation.shakeIntensity = 0;
    return;
  }

  // 4.1 FASE 4: GEMPA AWAS (2 Detik - Gempa Besar 5.2 SR untuk Eksplosif, Tremor Ringan untuk Efusif)
  if (sim.phase === 'fase4_awas_earthquake') {
    input.left = false;
    input.right = false;
    input.up = false;
    input.upJustPressed = false;
    state.player.vx = 0;
    state.player.isWalking = false;

    const isEffusive = sim.scenario === 'effusive';

    // Efusif: gempa kecil / tremor ringan. Eksplosif: guncangan dahsyat 5.2 SR
    state.simulation.shakeIntensity = isEffusive
      ? 1.0 + Math.sin(state.animTick * 0.25) * 0.3
      : 4.8 + Math.sin(state.animTick * 0.35) * 1.5;

    if (state.animTick % 40 === 0) {
      retroAudio.playEarthquakeRumble();
    }

    state.nearInteractablePrompt = isEffusive
      ? '[!] TREMOR VULKANIK RINGAN TERASA! MAGMA MULAI MELELEH KE PERMUKAAN!'
      : '[!] GEMPA BESAR VULKANIK 5.2 SR MENGGUNCANG! BERTAHAN!';

    sim.earthquakeTimer--;
    if (sim.earthquakeTimer <= 0) {
      // SETELAH 2 DETIK: GUNUNG MERAPI ERUPSI!
      sim.phase = 'fase4_awas_siren';
      sim.volcanoPlume = 'magma_fountain';
      sim.magmaFlowProgress = 0.01; // Mulai meluap dari dalam kawah dan merayap pelan turun lereng
      if (!isEffusive) {
        retroAudio.playVolcanoBoom();
        spawnVolcanoBombs(sim, state.player.x);
      } else {
        sim.volcanoBombs = [];
      }
      retroAudio.playAlarm();
    }
    return;
  }

  // 4.2 FASE 4: BUNYIKAN SIRINE DARURAT DI TIANG EWS (x: 376)
  if (sim.phase === 'fase4_awas_siren') {
    const isEffusive = sim.scenario === 'effusive';
    state.simulation.shakeIntensity = isEffusive
      ? 0.8 + Math.sin(state.animTick * 0.2) * 0.3
      : 3.6 + Math.sin(state.animTick * 0.28) * 1.0;
    sim.volcanoPlume = 'magma_fountain';

    // Hujan abu vulkanik
    if (state.animTick % (isEffusive ? 8 : 4) === 0) {
      spawnAshFallParticle(sim, state.player.x);
    }
    // Batuan jatuh dari atas HANYA untuk eksplosif (Efusif minim ledakan & tanpa bom batuan)
    if (!isEffusive && state.animTick % 150 === 0) {
      spawnVolcanoBombs(sim, state.player.x);
    }
    if (!isEffusive && state.animTick % 80 === 0) {
      retroAudio.playVolcanoBoom();
    }

    // SELURUH NPC BERLARI PANIK SAAT GUNUNG MELETUS (TIDAK DIAM DI TEMPAT!)
    for (const [nid, npc] of state.npcs.entries()) {
      if (npc.id === 'l2_sim5_npc_resqy') continue;
      if (npc.id === 'l2_sim5_npc_pak_joko' || npc.id === 'l2_sim5_npc_mbak_rina' || npc.id === 'l2_sim5_npc_satria') {
        // Petugas & relawan bergegas ke posko/truk evakuasi untuk mempersiapkan kendaraan
        if (npc.x < 1780) {
          npc.x += 2.2;
          npc.dir = 'right';
          npc.state = 'walk';
          if (state.animTick % 4 === 0) npc.animFrame = (npc.animFrame + 1) % 4;
        }
      } else {
        // Warga lainnya panik berlari-lari mencari perlindungan
        const wander = Math.sin(state.animTick * 0.06 + nid.length * 2);
        npc.x += wander * 1.5;
        npc.dir = wander >= 0 ? 'right' : 'left';
        npc.state = 'walk';
        if (state.animTick % 5 === 0) npc.animFrame = (npc.animFrame + 1) % 4;
      }
    }

    const sirenX = 376;
    const distToSiren = Math.abs(state.player.x - sirenX);

    if (distToSiren > 55) {
      state.nearInteractablePrompt = `LARI KE TIANG SIRINE EWS (x: 376)! TEKAN [E] UNTUK MEMBUNYIKAN SIRINE DARURAT! (${Math.round(distToSiren)}M)`;
    } else {
      state.nearInteractablePrompt = 'TEKAN [E] / [SPASI] / TAP UNTUK MEMBUNYIKAN SIRINE PERINGATAN DARURAT!';
      if (input.interactJustPressed) {
        input.interactJustPressed = false;
        sim.sirenActive = true;
        sim.phase = 'fase4_awas_rescue';
        sim.qteTimer = 15 * 60; // 15 detik batas waktu evakuasi
        sim.qteMaxTimer = 15 * 60;
        retroAudio.playEwsSiren();
        retroAudio.playPowerup();
      }
    }
    return;
  }

  // 4.3 FASE 4: BANTU WARGA DUSUN KE MOBIL EVAKUASI BPBD
  if (sim.phase === 'fase4_awas_rescue') {
    // Inisialisasi timer 15 detik jika belum terpasang
    if (sim.qteTimer === undefined || sim.qteTimer <= 0) {
      sim.qteTimer = 15 * 60;
      sim.qteMaxTimer = 15 * 60;
    }

    // Hitung mundur waktu evakuasi 15 detik (60 frame per detik)
    sim.qteTimer--;
    if (sim.qteTimer <= 0) {
      sim.phase = 'failed';
      sim.failureReason = 'Waktu evakuasi 15 detik telah habis! Awan panas dan material erupsi mulai meluncur turun lereng Merapi!';
      retroAudio.playError();
      state.nearInteractablePrompt = null;
      return;
    }
    const isEffusive = sim.scenario === 'effusive';
    state.simulation.shakeIntensity = isEffusive
      ? 0.7 + Math.sin(state.animTick * 0.2) * 0.25
      : 3.4 + Math.sin(state.animTick * 0.28) * 0.8;
    sim.volcanoPlume = 'magma_fountain';

    // Bunyi sirine berkala
    sim.sirenSoundTimer++;
    if (sim.sirenSoundTimer % 45 === 0) {
      retroAudio.playEwsSiren();
    }
    if (state.animTick % (isEffusive ? 8 : 4) === 0) {
      spawnAshFallParticle(sim, state.player.x);
    }
    // Batuan jatuh dari atas berkala HANYA untuk eksplosif
    if (!isEffusive && state.animTick % 160 === 0) {
      spawnVolcanoBombs(sim, state.player.x);
    }

    // Sinkronisasi koordinat posisi nyata NPC warga yang harus diselamatkan
    for (const v of sim.villagersToRescue) {
      const npc = state.npcs.get(v.npcId);
      if (npc) {
        v.x = npc.x;
        v.y = npc.y;
      }
    }

    // Deteksi warga terdekat yang belum diselamatkan
    let nearTarget: RescueVillagerL2 | null = null;
    let closestDist = 9999;
    for (const v of sim.villagersToRescue) {
      if (!v.rescued) {
        const npc = state.npcs.get(v.npcId);
        const curX = npc ? npc.x : v.x;
        const dist = Math.abs(state.player.x - curX);
        if (dist < 85 && dist < closestDist) {
          closestDist = dist;
          nearTarget = v;
        }
      }
    }

    const rescuedCount = sim.villagersToRescue.filter((v) => v.rescued).length;

    if (nearTarget) {
      state.nearInteractablePrompt = `TEKAN [E] / TAP UNTUK MENOLONG & MENGAJAK ${nearTarget.name.toUpperCase()} KE MOBIL EVAKUASI!`;
      if (input.interactJustPressed) {
        input.interactJustPressed = false;
        nearTarget.rescued = true;
        const npc = state.npcs.get(nearTarget.npcId);
        if (npc) {
          npc.speechText = 'Terima kasih! Aku ikut bersamamu ke mobil evakuasi!';
          npc.speechTimer = 150;
          npc.spokenPhase = 'rescued';
          npc.state = 'walk';
          npc.dir = state.player.dir;
        }
        retroAudio.playPowerup();
      }
    } else {
      state.nearInteractablePrompt = `BANTU 3 WARGA MENUJU MOBIL EVAKUASI BPBD (${rescuedCount}/3)!`;
    }

    // Warga yang telah diselamatkan berbaris rapi mengikuti pemain ke mana pun pemain bergerak
    const rescuedVillagers = sim.villagersToRescue.filter((v) => v.rescued);
    rescuedVillagers.forEach((v, idx) => {
      const npc = state.npcs.get(v.npcId);
      if (!npc) return;

      const followSpacing = 28;
      const followOffset = (idx + 1) * followSpacing;
      const targetX = state.player.dir === 'right'
        ? state.player.x - followOffset
        : state.player.x + followOffset;
      const diff = targetX - npc.x;
      const absDiff = Math.abs(diff);

      if (absDiff > 12) {
        npc.dir = diff > 0 ? 'right' : 'left';
        const speed = absDiff > 100 ? 4.2 : absDiff > 45 ? 3.4 : 2.2;
        npc.x += (npc.dir === 'right' ? speed : -speed);
        npc.state = 'walk';
        if (state.animTick % 4 === 0) {
          npc.animFrame = (npc.animFrame + 1) % 4;
        }
      } else {
        npc.state = 'idle';
        npc.animFrame = 0;
        npc.dir = state.player.dir;
      }
      npc.y = 356;
      v.x = npc.x;
      v.y = npc.y;
    });

    // Warga yang belum diselamatkan panik melambaikan tangan / bergerak cemas
    for (const v of sim.villagersToRescue) {
      if (!v.rescued) {
        const npc = state.npcs.get(v.npcId);
        if (npc) {
          if (state.animTick % 40 < 20) {
            npc.animFrame = 1;
            npc.dir = state.player.x < npc.x ? 'left' : 'right';
          } else {
            npc.animFrame = 0;
          }
        }
      }
    }

    // Petugas Pak Joko & Relawan Mbak Rina membantu mengarahkan warga di Mobil Evakuasi
    const joko = state.npcs.get('l2_sim5_npc_pak_joko');
    if (joko && joko.x < 1780) {
      joko.x += 2.5; joko.dir = 'right'; joko.state = 'walk';
      if (state.animTick % 4 === 0) joko.animFrame = (joko.animFrame + 1) % 4;
    }
    const rina = state.npcs.get('l2_sim5_npc_mbak_rina');
    if (rina && rina.x < 1800) {
      rina.x += 2.6; rina.dir = 'right'; rina.state = 'walk';
      if (state.animTick % 4 === 0) rina.animFrame = (rina.animFrame + 1) % 4;
    }

    // Komandan Satria mengawal dari barisan belakang jika bersama warga
    const satriaRescue = state.npcs.get('l2_sim5_npc_satria');
    if (satriaRescue) {
      if (satriaRescue.x < 1760) {
        const escortOffset = (rescuedVillagers.length + 1) * 28 + 10;
        const targetX = state.player.dir === 'right' ? state.player.x - escortOffset : state.player.x + escortOffset;
        const diff = targetX - satriaRescue.x;
        if (Math.abs(diff) > 14) {
          satriaRescue.dir = diff > 0 ? 'right' : 'left';
          const speed = Math.abs(diff) > 100 ? 4.2 : 3.0;
          satriaRescue.x += (satriaRescue.dir === 'right' ? speed : -speed);
          satriaRescue.state = 'walk';
          if (state.animTick % 4 === 0) satriaRescue.animFrame = (satriaRescue.animFrame + 1) % 4;
        } else {
          satriaRescue.state = 'idle';
          satriaRescue.animFrame = 0;
          satriaRescue.dir = state.player.dir;
        }
      } else {
        satriaRescue.state = 'idle';
        satriaRescue.dir = 'left';
      }
    }

    // Jika seluruh 3 warga telah diselamatkan
    if (rescuedCount === 3) {
      sim.phase = 'fase4_awas_truck';
      retroAudio.playSuccess();
      state.nearInteractablePrompt = null;
    }
    return;
  }

  // 4.4 FASE 4: LARI DAN NAIK KE MOBIL EVAKUASI BERSAMA
  if (sim.phase === 'fase4_awas_truck') {
    const isEffusive = sim.scenario === 'effusive';
    state.simulation.shakeIntensity = isEffusive
      ? 0.7 + Math.sin(state.animTick * 0.2) * 0.25
      : (3.2 + Math.sin(state.animTick * 0.28) * 0.8);
    sim.volcanoPlume = 'magma_fountain';

    sim.sirenSoundTimer++;
    if (sim.sirenSoundTimer % 50 === 0) retroAudio.playEwsSiren();
    if (state.animTick % 4 === 0) spawnAshFallParticle(sim, state.player.x);
    if (!isEffusive && state.animTick % 160 === 0) spawnVolcanoBombs(sim, state.player.x);

    const distToTruck = Math.max(0, 1800 - state.player.x);
    state.nearInteractablePrompt = `SEMUA WARGA TELAH SIAP! LARI KE MOBIL EVAKUASI BPBD! (${Math.round(distToTruck)}M)`;

    // Seluruh warga yang telah diselamatkan terus mengikuti lari bersama karakter pemain menuju mobil
    for (let idx = 0; idx < sim.villagersToRescue.length; idx++) {
      const v = sim.villagersToRescue[idx];
      const npc = state.npcs.get(v.npcId);
      if (!npc) continue;

      const followOffset = (idx + 1) * 28;
      const targetX = state.player.dir === 'right'
        ? state.player.x - followOffset
        : state.player.x + followOffset;
      const diff = targetX - npc.x;
      const absDiff = Math.abs(diff);

      if (absDiff > 12) {
        npc.dir = diff > 0 ? 'right' : 'left';
        const speed = absDiff > 120 ? 4.6 : absDiff > 50 ? 3.6 : 2.5;
        npc.x += (npc.dir === 'right' ? speed : -speed);
        npc.state = 'walk';
        if (state.animTick % 4 === 0) {
          npc.animFrame = (npc.animFrame + 1) % 4;
        }
      } else {
        npc.state = 'idle';
        npc.animFrame = 0;
        npc.dir = state.player.dir;
      }
      npc.y = 356;
      v.x = npc.x;
      v.y = npc.y;
    }

    // Komandan Satria mengawal di barisan belakang
    const satriaTruck = state.npcs.get('l2_sim5_npc_satria');
    if (satriaTruck) {
      if (satriaTruck.x < 1760) {
        const escortOffset = 4 * 28 + 10;
        const targetX = state.player.dir === 'right' ? state.player.x - escortOffset : state.player.x + escortOffset;
        const diff = targetX - satriaTruck.x;
        if (Math.abs(diff) > 14) {
          satriaTruck.dir = diff > 0 ? 'right' : 'left';
          const speed = Math.abs(diff) > 100 ? 4.6 : 3.4;
          satriaTruck.x += (satriaTruck.dir === 'right' ? speed : -speed);
          satriaTruck.state = 'walk';
          if (state.animTick % 4 === 0) satriaTruck.animFrame = (satriaTruck.animFrame + 1) % 4;
        }
      } else {
        satriaTruck.state = 'idle';
        satriaTruck.dir = 'left';
      }
    }

    if (state.player.x >= 1780) {
      sim.truckState = 'boarding';
      sim.phase = 'volcano_evacuated';
      sim.transitionTimer = 220; // 3.6 detik cutscene evakuasi mobil BPBD
      sim.truckDrivingSpeed = 0;
      state.nearInteractablePrompt = null;
      retroAudio.playPowerup();
      retroAudio.playWin();
    }
    return;
  }

  // 5. MOBIL EVAKUASI MELAJU CEPAT MENUJU TEA
  if (sim.phase === 'volcano_evacuated') {
    input.left = false;
    input.right = false;
    input.up = false;
    input.upJustPressed = false;
    state.player.vx = 0;
    state.player.isWalking = false;

    sim.transitionTimer--;

    // Fase 1: BOARDING (pertama ~70 frame) - Seluruh warga & pemain naik ke bak mobil
    if (sim.transitionTimer > 150) {
      sim.truckState = 'boarding';
      sim.truckDrivingSpeed = 0;
    } else {
      // Fase 2: DRIVING - Mobil evakuasi melaju kencang menuju TEA
      sim.truckState = 'driving';
      sim.truckDrivingSpeed = (sim.truckDrivingSpeed || 0) + 0.18;
      sim.truckX += sim.truckDrivingSpeed;
    }

    state.player.x = sim.truckX + 2;
    state.player.y = 328;
    state.simulation.shakeIntensity = Math.max(0, state.simulation.shakeIntensity - 0.02);

    // Seluruh warga ikut melaju di dalam Mobil Evakuasi
    const villagersOnTruck = [
      'l2_sim5_npc_pak_joko',
      'l2_sim5_npc_mbak_rina',
      'l2_sim5_npc_lansia',
      'l2_sim5_npc_warga_siti',
      'l2_sim5_npc_anak',
      'l2_sim5_npc_satria',
    ];
    for (const nid of villagersOnTruck) {
      const npc = state.npcs.get(nid);
      if (npc) {
        npc.x = sim.truckX - 20;
        npc.y = 328;
      }
    }

    if (sim.transitionTimer <= 0) {
      sim.phase = 'volcano_completed';
      state.simulation.shakeIntensity = 0;
      retroAudio.playWin();
      state.unlockedGates.add('l2_gate_volcano_sim');
      state.npcs.clear();
      state.activeDialogueTree = DIALOGUE_TREES_L2['satria_sim_victory'];
      saveLevel2Progress(state, state.userId);
    }
    return;
  }

  // 6. VOLCANO COMPLETED
  if (sim.phase === 'volcano_completed') {
    state.simulation.shakeIntensity = 0;
    return;
  }
}

/**
 * Mengambil DialogueTree yang sesuai untuk NPC berdasarkan status progres & gerbang level.
 * Mencegah pengulangan evaluasi Teka-Teki Silang (TTS) jika gerbang area telah terbuka,
 * serta menampilkan arahan bagi siswa untuk melanjutkan ke area berikutnya (sesuai konsep Level 1).
 */
export function getNpcDialogueTreeL2(state: GameStateL2, npc: NpcStateL2): DialogueTreeL2 | null {
  const isTyasOrEvaluator =
    npc.type === 'bu_tyas' ||
    npc.type === 'bu_rahma' ||
    npc.type === 'kak_fajar' ||
    npc.type === 'komandan_satria' ||
    npc.id.includes('bu_tyas') ||
    npc.id.includes('bu_rahma') ||
    npc.id.includes('kak_fajar') ||
    npc.id.includes('komandan_satria');

  if (isTyasOrEvaluator) {
    // Area 1 / Index 0: Mitigasi Prabencana Gempa Bumi (Ruang Kelas)
    if (state.zone.id === 'area-mitigasi-gempa' || state.currentAreaIndex === 0 || npc.id === 'l2_npc_bu_tyas' || npc.id === 'l2_npc_kak_fajar') {
      if (state.unlockedGates.has('l2_gate_gempa')) {
        return DIALOGUE_TREES_L2['kak_fajar_unlocked_dialogue'] || null;
      }
      const hasPrep = state.discoveredPoints.has('l2_q_disc_prep') || state.discoveredPoints.has('disc-earthquake-prep');
      const hasAction = state.discoveredPoints.has('l2_q_disc_action') || state.discoveredPoints.has('disc-earthquake-action');
      if (!hasPrep || !hasAction) {
        return {
          id: 'kak_fajar_reminder',
          title: 'Kesiapan Ujian bersama Bu Tyas',
          startNodeId: 'remind_1',
          npcSpeakerId: 'bu_tyas',
          nodes: {
            remind_1: {
              id: 'remind_1',
              speakerId: 'bu_tyas',
              text: 'Halo penjelajah! Kamu perlu mempelajari materi Tas Siaga 72 Jam bersama Zahra dan Simulasi Aksi bersama Lintang terlebih dahulu sebelum menempuh evaluasi Teka-Teki Silang ini!',
              expression: 'normal',
            },
          },
        };
      }
      return DIALOGUE_TREES_L2['kak_fajar_dialogue'] || null;
    }

    // Area 6 / Index 5: Barak Pengungsian & Pemulihan Pascabencana Erupsi
    if (state.zone.id === 'area-barak-pengungsian' || state.currentAreaIndex === 5 || npc.id === 'l2_shelter_npc_bu_tyas' || npc.id === 'l2_shelter_npc_satria') {
      if (state.unlockedGates.has('l2_gate_shelter_recovery')) {
        return DIALOGUE_TREES_L2['satria_shelter_unlocked_dialogue'] || null;
      }
      const hasAsh = state.discoveredPoints.has('disc-post-ash');
      const hasSanitation = state.discoveredPoints.has('disc-post-sanitation');
      const hasLahar = state.discoveredPoints.has('disc-post-lahar');
      if (!hasAsh || !hasSanitation || !hasLahar) {
        return {
          id: 'satria_shelter_reminder',
          title: 'Kesiapan Evaluasi Akhir bersama Bu Tyas',
          startNodeId: 'remind_1',
          npcSpeakerId: 'bu_tyas',
          nodes: {
            remind_1: {
              id: 'remind_1',
              speakerId: 'bu_tyas',
              text: 'Laporan posko menunjukkan kamu belum menyelesaikan seluruh pembelajaran pemulihan pascabencana!\n\nSilakan pelajari penanganan abu vulkanik bersama Zidane, sanitasi & kesehatan bersama Zahra, dan waspada lahar dingin bersama Lintang sebelum menempuh evaluasi akhir Teka-Teki Silang!',
              expression: 'serious',
            },
          },
        };
      }
      return DIALOGUE_TREES_L2['satria_shelter_dialogue'] || null;
    }

    // Area 4 / Index 3: Pos Pengamatan Merapi (Prabencana Erupsi)
    if (state.zone.id === 'area-pos-pengamatan-merapi' || state.currentAreaIndex === 3 || npc.id === 'l2_v_npc_bu_tyas' || npc.id === 'l2_v_npc_satria') {
      if (state.unlockedGates.has('l2_gate_volcano_prep')) {
        return DIALOGUE_TREES_L2['satria_volcano_unlocked_dialogue'] || null;
      }
      const hasStatus = state.discoveredPoints.has('disc-volcano-status');
      const hasResponse = state.discoveredPoints.has('disc-volcano-response');
      if (!hasStatus || !hasResponse) {
        return {
          id: 'satria_volcano_reminder',
          title: 'Kesiapan Evaluasi bersama Bu Tyas',
          startNodeId: 'remind_1',
          npcSpeakerId: 'bu_tyas',
          nodes: {
            remind_1: {
              id: 'remind_1',
              speakerId: 'bu_tyas',
              text: 'Siap siaga, Penjelajah! Sebelum menempuh evaluasi Teka-Teki Silang Kesiapsiagaan Erupsi Merapi, kamu harus mempelajari modul di Pos Pengamatan terlebih dahulu.\n\nPelajari 4 Tingkat Status Gunung Api bersama Zahra dan Zonasi KRB Merapi bersama Lintang!',
              expression: 'serious',
            },
          },
        };
      }
      return DIALOGUE_TREES_L2['satria_volcano_dialogue'] || null;
    }

    // Area 3 / Index 2: Lapangan Evakuasi Pascabencana Gempa
    if (state.zone.id === 'area-lapangan-evakuasi' || state.currentAreaIndex === 2 || npc.id === 'l2_field_npc_bu_tyas' || npc.id === 'l2_field_npc_komandan_satria') {
      if (state.unlockedGates.has('l2_gate_pascabencana')) {
        return DIALOGUE_TREES_L2['satria_field_unlocked_dialogue'] || null;
      }
      const hasSafety = state.discoveredPoints.has('disc-post-safety');
      const hasCoord = state.discoveredPoints.has('disc-post-coordination');
      if (!hasSafety || !hasCoord) {
        return {
          id: 'satria_reminder',
          title: 'Kesiapan Evaluasi bersama Bu Tyas',
          startNodeId: 'remind_1',
          npcSpeakerId: 'bu_rahma',
          nodes: {
            remind_1: {
              id: 'remind_1',
              speakerId: 'bu_rahma',
              text: 'Tunggu dulu, Penjelajah! Catatan posko menunjukkan kamu belum mempelajari seluruh modul mitigasi di lapangan.\n\nSilakan pelajari materi keselamatan medis bersama Zahra dan manajemen komando bersama Lintang terlebih dahulu sebelum menempuh evaluasi Teka-Teki Silang ini!',
              expression: 'serious',
            },
          },
        };
      }
      return DIALOGUE_TREES_L2['komandan_satria_dialogue'] || null;
    }
  }

  // NPC Lainnya: Gunakan dialogueId bawaan
  return DIALOGUE_TREES_L2[npc.dialogueId] || null;
}

export function updateGameEngineL2(
  state: GameStateL2,
  input: InputStateL2
): void {
  state.animTick++;

  // 0. Update Cooldown & Notifikasi Peralihan Area
  if (state.transitionCooldown > 0) {
    state.transitionCooldown--;
    input.interactJustPressed = false;
  }

  if (state.areaTransitionBanner) {
    state.areaTransitionBanner.timer--;
    if (state.areaTransitionBanner.timer <= 0) {
      state.areaTransitionBanner = null;
      // Saat popup banner masuk area selesai, barulah Resqy menyapa & memberi pengarahan
      if (
        state.zone.id === 'area-simulasi-merapi' &&
        state.volcanoSim?.phase === 'idle' &&
        !state.volcanoSimInitialBriefingDone
      ) {
        state.volcanoSimInitialBriefingDone = true;
        state.activeDialogueTree = DIALOGUE_TREES_L2['resqy_briefing_area5'];
      }
    }
    // Bekukan kontrol & gerak karakter selama banner informasi area aktif (persis seperti di Level 1)
    input.left = false;
    input.right = false;
    input.up = false;
    input.upJustPressed = false;
    input.interact = false;
    input.interactJustPressed = false;
    state.player.vx = 0;
    state.player.isWalking = false;
    return;
  }

  // ── SIMULASI GEMPA BUMI AREA 2 STATE MACHINE ──
  if (state.zone.id === 'area-simulasi-gempa' && state.simulation.phase !== 'idle') {
    const sim = state.simulation;
    const isModerate = sim.quakeScenario === 'moderate';

    // Hitung damageProgress secara progresif
    if (isModerate) {
      // Gempa Sedang: Tidak ada kerusakan struktural, ruangan hanya sedikit berantakan (maksimal 0.14)
      if (sim.phase === 'teaching') {
        sim.damageProgress = 0;
      } else if (sim.phase === 'quake_start' || sim.phase === 'quake_alert') {
        sim.damageProgress = Math.min(0.10, (sim.alarmTick || 0) * 0.005);
      } else if (sim.phase === 'qte_cover') {
        const qRatio = 1 - Math.max(0, sim.qteTimer / (sim.qteMaxTimer || 600));
        sim.damageProgress = 0.06 + qRatio * 0.08;
      } else if (sim.phase === 'evacuating' || sim.phase === 'completed') {
        sim.damageProgress = 0.14;
      } else if (sim.phase === 'failed_impact' || sim.phase === 'failed') {
        sim.damageProgress = 0.10;
      }
    } else {
      // Gempa Besar: Kerusakan bertahap penuh sampai 1.0 (retak dinding, lampu padam, meja bergeser & retak)
      if (sim.phase === 'teaching') {
        sim.damageProgress = 0;
      } else if (sim.phase === 'quake_start' || sim.phase === 'quake_alert') {
        sim.damageProgress = Math.min(0.12, (sim.alarmTick || 0) * 0.003);
      } else if (sim.phase === 'qte_cover') {
        const qRatio = 1 - Math.max(0, sim.qteTimer / (sim.qteMaxTimer || 600));
        sim.damageProgress = 0.12 + qRatio * 0.13; // 0.12 -> 0.25
      } else if (sim.phase === 'quake_holding') {
        const holdRatio = 1 - Math.max(0, sim.quakeTimer / (sim.quakeMaxTimer || 600));
        sim.damageProgress = 0.25 + holdRatio * 0.75; // 0.25 -> 1.00
      } else if (sim.phase === 'quake_stopped' || sim.phase === 'evacuating' || sim.phase === 'completed') {
        sim.damageProgress = 1.0;
      } else if (sim.phase === 'failed_impact' || sim.phase === 'failed') {
        sim.damageProgress = 0.45;
      }
    }

    // 1. Fase Pembelajaran Struktur Bumi (Bu Rahma Cutscene)
    if (sim.phase === 'teaching') {
      input.left = false;
      input.right = false;
      input.up = false;
      input.upJustPressed = false;
      state.player.vx = 0;
      state.player.isWalking = false;
      state.player.x = 498;
      state.player.y = 360;
      state.player.dir = 'left';

      // Jika dialog Bu Rahma mengajar sudah selesai ditutup, gempa terjadi terlebih dahulu selama ~1 detik!
      if (!state.activeDialogueTree) {
        sim.phase = 'quake_start';
        sim.quakeTimer = 60; // 60 ticks = 1 detik gempa awal
        sim.alarmTick = 1;
        if (isModerate) {
          sim.shakeIntensity = EARTHQUAKE_SHAKE_CONFIG.MODERATE.intensity;
          retroAudio.playAlarm();
        } else {
          sim.shakeIntensity = EARTHQUAKE_SHAKE_CONFIG.SEVERE.alertIntensity;
          retroAudio.playAlarm();
          retroAudio.playExplosion();
        }
      }
    }

    // 1.25. Fase Gempa Terjadi Terlebih Dahulu (~1 Detik) Sebelum Bu Rahma Bereaksi
    else if (sim.phase === 'quake_start') {
      input.left = false;
      input.right = false;
      input.up = false;
      input.upJustPressed = false;
      state.player.vx = 0;
      state.player.isWalking = false;
      state.player.x = 498;
      state.player.y = 360;
      state.player.dir = 'left';

      sim.alarmTick++;
      if (sim.alarmTick % (isModerate ? 60 : 45) === 0) retroAudio.playAlarm();

      if (isModerate) {
        sim.shakeIntensity = EARTHQUAKE_SHAKE_CONFIG.MODERATE.intensity + Math.sin(state.animTick * 0.28) * EARTHQUAKE_SHAKE_CONFIG.MODERATE.oscillation;
        if (state.animTick % EARTHQUAKE_SHAKE_CONFIG.MODERATE.debrisInterval === 0) {
          spawnSimulationDebris(sim.particles, state.player.x, 'moderate');
        }
      } else {
        sim.shakeIntensity = EARTHQUAKE_SHAKE_CONFIG.SEVERE.alertIntensity + Math.sin(state.animTick * 0.28) * EARTHQUAKE_SHAKE_CONFIG.SEVERE.oscillation;
        if (state.animTick % EARTHQUAKE_SHAKE_CONFIG.SEVERE.debrisInterval === 0) {
          spawnSimulationDebris(sim.particles, state.player.x, 'severe');
        }
      }

      sim.quakeTimer--;
      // Setelah 1 detik gempa berguncang, barulah Bu Rahma berseru memberi peringatan darurat!
      if (sim.quakeTimer <= 0) {
        sim.phase = 'quake_alert';
        if (isModerate) {
          state.activeDialogueTree = DIALOGUE_TREES_L2['bu_rahma_quake_alert_moderate'];
        } else {
          state.activeDialogueTree = DIALOGUE_TREES_L2['bu_rahma_quake_alert'];
        }
      }
    }

    // 1.5. Fase Peringatan Darurat Bu Rahma (Gempa Mulai Mengguncang)
    else if (sim.phase === 'quake_alert') {
      input.left = false;
      input.right = false;
      input.up = false;
      input.upJustPressed = false;
      state.player.vx = 0;
      state.player.isWalking = false;
      state.player.x = 498;
      state.player.y = 360;
      state.player.dir = 'left';

      sim.alarmTick++;
      if (sim.alarmTick % (isModerate ? 60 : 45) === 0) retroAudio.playAlarm();

      if (isModerate) {
        sim.shakeIntensity = EARTHQUAKE_SHAKE_CONFIG.MODERATE.intensity + Math.sin(state.animTick * 0.28) * EARTHQUAKE_SHAKE_CONFIG.MODERATE.oscillation;
        if (state.animTick % EARTHQUAKE_SHAKE_CONFIG.MODERATE.debrisInterval === 0) {
          spawnSimulationDebris(sim.particles, state.player.x, 'moderate');
        }
      } else {
        sim.shakeIntensity = EARTHQUAKE_SHAKE_CONFIG.SEVERE.alertIntensity + Math.sin(state.animTick * 0.28) * EARTHQUAKE_SHAKE_CONFIG.SEVERE.oscillation;
        if (state.animTick % EARTHQUAKE_SHAKE_CONFIG.SEVERE.debrisInterval === 0) {
          spawnSimulationDebris(sim.particles, state.player.x, 'severe');
        }
      }

      // Begitu dialog peringatan Bu Rahma selesai dibaca, barulah QTE dimulai!
      if (!state.activeDialogueTree) {
        sim.phase = 'qte_cover';
        sim.qteTimer = 600; // 10 detik
        sim.qteMaxTimer = 600;

        if (isModerate) {
          sim.panicShouts = [
            { id: 'rian', x: 282, y: 360, text: 'GEMPA SEDANG!', staggerY: 0 },
            { id: 'dito', x: 382, y: 360, text: 'AMBIL TAS!', staggerY: -12 },
            { id: 'siti', x: 582, y: 360, text: 'TUTUP KEPALA!', staggerY: 0 },
            { id: 'edo', x: 882, y: 360, text: 'SIAP EVAKUASI!', staggerY: -12 },
            { id: 'dewi', x: 1182, y: 360, text: 'JANGAN PANIK!', staggerY: 0 },
            { id: 'lina', x: 1582, y: 360, text: 'IKUTI BU GURU!', staggerY: -12 },
            { id: 'putri', x: 1782, y: 360, text: 'TETAP TERTIB!', staggerY: 0 },
          ];
        } else {
          sim.panicShouts = [
            { id: 'rian', x: 282, y: 360, text: 'GEMPA BESAR!', staggerY: 0 },
            { id: 'dito', x: 382, y: 360, text: 'MERUNDUK!', staggerY: -12 },
            { id: 'siti', x: 582, y: 360, text: 'TAHAN MEJA!', staggerY: 0 },
            { id: 'edo', x: 882, y: 360, text: 'TUTUP KEPALA!', staggerY: -12 },
            { id: 'dewi', x: 1182, y: 360, text: 'PEGANG KAKI MEJA!', staggerY: 0 },
            { id: 'lina', x: 1582, y: 360, text: 'AWAS PUING!', staggerY: -12 },
            { id: 'putri', x: 1782, y: 360, text: 'LINDUNGI LEHER!', staggerY: 0 },
          ];
        }
      }
    }

    // 2. Fase QTE 10 Detik
    else if (sim.phase === 'qte_cover') {
      input.left = false;
      input.right = false;
      input.up = false;
      input.upJustPressed = false;
      state.player.vx = 0;
      state.player.isWalking = false;
      state.player.x = 498;
      state.player.y = 360;

      sim.qteTimer--;
      sim.alarmTick++;
      if (sim.alarmTick % (isModerate ? 60 : 45) === 0) retroAudio.playAlarm();

      if (isModerate) {
        // SKENARIO GEMPA SEDANG: Murid langsung dievakuasi keluar sambil membawa tas lindungi kepala
        sim.shakeIntensity = EARTHQUAKE_SHAKE_CONFIG.MODERATE.intensity + Math.sin(state.animTick * 0.28) * EARTHQUAKE_SHAKE_CONFIG.MODERATE.oscillation;
        if (state.animTick % EARTHQUAKE_SHAKE_CONFIG.MODERATE.debrisInterval === 0) {
          spawnSimulationDebris(sim.particles, state.player.x, 'moderate');
        }

        const secLeft = Math.ceil(sim.qteTimer / 60);
        state.nearInteractablePrompt = `[${secLeft}s] TEKAN [E] / TAP UNTUK AMBIL TAS & MULAI EVAKUASI!`;

        if (input.interactJustPressed) {
          // SUKSES QTE Gempa Sedang: Langsung evakuasi berbaris bersama Bu Rahma & murid!
          input.interactJustPressed = false;
          retroAudio.playSelect();
          retroAudio.playPowerup();
          sim.qteSuccess = true;
          sim.phase = 'evacuating';
          sim.damageProgress = 0.14;
          state.unlockedGates.add('l2_gate_gempa_sim');
          sim.playerCrouchedUnderDesk = false;
          sim.playerAtDesk = false;
          state.nearInteractablePrompt = null;
          sim.shakeIntensity = EARTHQUAKE_SHAKE_CONFIG.MODERATE.intensity; // Tetap sama dengan getaran saat gempa terjadi

          // Bariskan Bu Rahma dan seluruh 16 murid menuju pintu keluar
          const buRahma = state.npcs.get('l2_sim_npc_bu_rahma');
          if (buRahma) {
            buRahma.x = 550;
            buRahma.dir = 'right';
            buRahma.state = 'walk';
          }
          CLASSROOM_STUDENTS_L2.forEach((st, idx) => {
            const npc = state.npcs.get(st.id);
            if (npc) {
              let startX: number;
              if (idx === 0) startX = 524;
              else if (idx === 1) startX = 502;
              else startX = 460 - (idx - 2) * 22;
              npc.x = startX;
              npc.dir = 'right';
              npc.state = 'walk';
            }
          });
        } else if (sim.qteTimer <= 0) {
          // GAGAL QTE Gempa Sedang (>10s): Cutscene serpihan mengenai pemain
          retroAudio.playError();
          sim.qteSuccess = false;
          sim.playerCrouchedUnderDesk = false;
          sim.phase = 'failed_impact';
          sim.failureImpactTimer = 0;
          sim.fallingRock = {
            x: 498,
            y: 30,
            vy: 6.5,
            size: 14,
            hit: false,
            shattered: false,
            shards: [],
          };
          state.nearInteractablePrompt = null;
        }
      } else {
        // SKENARIO GEMPA BESAR: Murid berlindung di bawah meja & berpegangan (Drop, Cover, Hold On)
        sim.shakeIntensity = EARTHQUAKE_SHAKE_CONFIG.SEVERE.coverIntensity + Math.sin(state.animTick * 0.28) * EARTHQUAKE_SHAKE_CONFIG.SEVERE.oscillation;
        if (state.animTick % EARTHQUAKE_SHAKE_CONFIG.SEVERE.debrisInterval === 0) {
          spawnSimulationDebris(sim.particles, state.player.x, 'severe');
        }

        const secLeft = Math.ceil(sim.qteTimer / 60);
        state.nearInteractablePrompt = `[${secLeft}s] TEKAN [E] / TAP SEKARANG UNTUK BERLINDUNG DI KOLONG MEJA!`;

        if (input.interactJustPressed) {
          // SUKSES QTE Gempa Besar tepat waktu!
          input.interactJustPressed = false;
          retroAudio.playSelect();
          sim.qteSuccess = true;
          sim.playerCrouchedUnderDesk = true;
          sim.playerAtDesk = false;
          sim.phase = 'quake_holding';
          sim.quakeTimer = 600; // Guncangan gempa besar 10 detik!
          sim.quakeMaxTimer = 600;
          state.nearInteractablePrompt = null;
        } else if (sim.qteTimer <= 0) {
          // GAGAL QTE Gempa Besar (>10s): Cutscene batu besar menimpa pemain
          retroAudio.playError();
          sim.qteSuccess = false;
          sim.playerCrouchedUnderDesk = false;
          sim.phase = 'failed_impact';
          sim.failureImpactTimer = 0;
          sim.fallingRock = {
            x: 498,
            y: 30,
            vy: 8.5,
            size: 28,
            hit: false,
            shattered: false,
            shards: [],
          };
          state.nearInteractablePrompt = null;
        }
      }
    }

    // 2.3. Fase Cutscene Batu Besar Menimpa Pemain (Saat Telat QTE)
    else if (sim.phase === 'failed_impact') {
      input.left = false;
      input.right = false;
      input.up = false;
      input.upJustPressed = false;
      input.interactJustPressed = false;
      state.player.vx = 0;
      state.player.isWalking = false;
      state.player.x = 498;
      state.player.y = 360;

      sim.failureImpactTimer = (sim.failureImpactTimer || 0) + 1;
      const rock = sim.fallingRock;

      if (rock) {
        if (!rock.hit) {
          rock.y += rock.vy;
          rock.vy += 0.85;

          // Hantaman batu besar tepat mengenai kepala pemain di atas meja (y = 315)
          if (rock.y >= 315) {
            rock.y = 315;
            rock.hit = true;
            rock.shattered = true;
            retroAudio.playHurt();
            sim.shakeIntensity = EARTHQUAKE_SHAKE_CONFIG.SEVERE.impactIntensity; // Hentakan benturan sesaat

            // Hasilkan 14 serpihan batu beton berhamburan ke segala arah
            for (let i = 0; i < 14; i++) {
              const angle = (Math.PI * 2 * i) / 14 + (Math.random() - 0.5) * 0.5;
              const spd = 2.5 + Math.random() * 4.5;
              rock.shards.push({
                x: 498 + (Math.random() - 0.5) * 8,
                y: 315 + (Math.random() - 0.5) * 6,
                vx: Math.cos(angle) * spd,
                vy: Math.sin(angle) * spd - 2.5,
                size: 4 + Math.floor(Math.random() * 5),
                color: Math.random() > 0.4 ? '#475569' : '#64748b',
              });
            }
          }
        } else {
          // Redam getaran kamera pasca benturan secara mulus
          sim.shakeIntensity = Math.max(0, sim.shakeIntensity - 0.35);
          for (const sh of rock.shards) {
            sh.x += sh.vx;
            sh.y += sh.vy;
            sh.vy += 0.35;
            if (sh.y >= 358) {
              sh.y = 358;
              sh.vy = -sh.vy * 0.3;
              sh.vx *= 0.6;
            }
          }
        }
      }

      // Setelah cutscene 95 frame (~1.6 detik), buka popup modal gagal ulangi
      if (sim.failureImpactTimer >= 95) {
        retroAudio.playError();
        sim.phase = 'failed';
        sim.shakeIntensity = 0;
      }
    }

    // 2.5. Fase Gagal (Menunggu pemain klik tombol ulangi dari awal)
    else if (sim.phase === 'failed') {
      input.left = false;
      input.right = false;
      input.up = false;
      input.upJustPressed = false;
      input.interactJustPressed = false;
      state.player.vx = 0;
      state.player.isWalking = false;
      sim.shakeIntensity = 0;
    }

    // 3. Fase Guncangan Gempa Berlanjut 10 Detik (Hold On)
    else if (sim.phase === 'quake_holding') {
      input.left = false;
      input.right = false;
      input.up = false;
      input.upJustPressed = false;
      input.interactJustPressed = false;
      state.player.vx = 0;
      state.player.isWalking = false;
      state.player.x = 482; // Berlindung di bawah meja 460
      state.player.y = 360;

      sim.quakeTimer--;
      sim.shakeIntensity = EARTHQUAKE_SHAKE_CONFIG.SEVERE.coverIntensity + Math.sin(state.animTick * 0.25) * EARTHQUAKE_SHAKE_CONFIG.SEVERE.oscillation;
      sim.alarmTick++;
      if (sim.alarmTick % 50 === 0) retroAudio.playAlarm();

      // Puing plafon berjatuhan di viewport kelas
      if (state.animTick % EARTHQUAKE_SHAKE_CONFIG.SEVERE.debrisInterval === 0) {
        spawnSimulationDebris(sim.particles, state.player.x, 'severe');
      }

      // Rotasi seruan panik teman sekelas (teks ringkas & tidak bertabrakan)
      sim.shoutTimer++;
      if (sim.shoutTimer > 90) {
        sim.shoutTimer = 0;
        sim.shoutIndex = (sim.shoutIndex + 1) % 3;
        const shoutSets = [
          [
            { id: 'rian', x: 282, y: 360, text: 'TUTUP KEPALA!', staggerY: 0 },
            { id: 'dito', x: 382, y: 360, text: 'PEGANG MEJA!', staggerY: -12 },
            { id: 'siti', x: 582, y: 360, text: 'JANGAN PANIK!', staggerY: 0 },
          ],
          [
            { id: 'rian', x: 282, y: 360, text: 'GEMPA KUAT!', staggerY: 0 },
            { id: 'dito', x: 382, y: 360, text: 'TETAP DI KOLONG!', staggerY: -12 },
            { id: 'siti', x: 582, y: 360, text: 'LINDUNGI LEHER!', staggerY: 0 },
          ],
          [
            { id: 'rian', x: 282, y: 360, text: 'BERTAHAN!', staggerY: 0 },
            { id: 'dito', x: 382, y: 360, text: 'AWAS PUING!', staggerY: -12 },
            { id: 'siti', x: 582, y: 360, text: 'TAHAN KAKI MEJA!', staggerY: 0 },
          ],
        ];
        sim.panicShouts = shoutSets[sim.shoutIndex];
      }

      if (sim.quakeTimer <= 0) {
        // Guncangan gempa 10 detik selesai!
        sim.phase = 'quake_stopped';
        sim.shakeIntensity = 0;
        sim.panicShouts = [];
        retroAudio.playPowerup();
        // Bu Rahma langsung memberikan dialog instruksi evakuasi
        state.activeDialogueTree = DIALOGUE_TREES_L2['bu_rahma_evac_order'];
      }
    }

    // 4. Fase Gempa Berhenti (Bu Rahma memberi aba-aba evakuasi via percakapan dialog)
    else if (sim.phase === 'quake_stopped') {
      input.left = false;
      input.right = false;
      input.up = false;
      input.upJustPressed = false;
      state.player.vx = 0;
      state.player.isWalking = false;
      state.player.x = 482;
      state.player.y = 360;

      // Jika aba-aba percakapan dari Bu Rahma telah selesai dibaca, langsung mulai evakuasi!
      if (!state.activeDialogueTree) {
        sim.phase = 'evacuating';
        sim.damageProgress = 1.0;
        state.unlockedGates.add('l2_gate_gempa_sim');
        sim.playerCrouchedUnderDesk = false;
        sim.playerAtDesk = false;
        state.nearInteractablePrompt = null;
        state.activeSignText = null;
        retroAudio.playPowerup();

        // Bu Rahma dan seluruh 16 murid berbaris tertib menuju pintu keluar evakuasi di kanan (x: 2130)
        const buRahma = state.npcs.get('l2_sim_npc_bu_rahma');
        if (buRahma) {
          buRahma.x = 550;
          buRahma.dir = 'right';
          buRahma.state = 'walk';
        }

        CLASSROOM_STUDENTS_L2.forEach((st, idx) => {
          const npc = state.npcs.get(st.id);
          if (npc) {
            let startX: number;
            if (idx === 0) startX = 524;
            else if (idx === 1) startX = 502;
            else startX = 460 - (idx - 2) * 22;

            npc.x = startX;
            npc.dir = 'right';
            npc.state = 'walk';
          }
        });
      }
    }

    // 5. Fase Evakuasi Menuju Pintu Lapangan Terbuka (Tetap Berjalan Walau Siswa Melewati Barisan)
    else if (sim.phase === 'evacuating' || sim.phase === 'completed') {
      if (isModerate && sim.phase === 'evacuating') {
        // Pertahankan getaran gempa sedang persis sama dengan saat gempa terjadi hingga tiba di pintu keluar
        sim.alarmTick++;
        if (sim.alarmTick % 60 === 0) retroAudio.playAlarm();
        sim.shakeIntensity = EARTHQUAKE_SHAKE_CONFIG.MODERATE.intensity + Math.sin(state.animTick * 0.28) * EARTHQUAKE_SHAKE_CONFIG.MODERATE.oscillation;
        if (state.animTick % EARTHQUAKE_SHAKE_CONFIG.MODERATE.debrisInterval === 0) {
          spawnSimulationDebris(sim.particles, state.player.x, 'moderate');
        }
      } else if (sim.phase === 'completed') {
        sim.shakeIntensity = 0;
      }

      // Guru Bu Rahma dan SELURUH murid sekelas terus berjalan evakuasi ke kanan sampai tiba di titik kumpul pintu
      const buRahma = state.npcs.get('l2_sim_npc_bu_rahma');
      if (buRahma) {
        if (buRahma.x < 2130) {
          buRahma.x += 2.4;
          buRahma.dir = 'right';
          buRahma.state = 'walk';
          if (state.animTick % 6 === 0) buRahma.animFrame = (buRahma.animFrame + 1) % 4;
        } else {
          buRahma.state = 'idle';
          buRahma.animFrame = 0;
        }
      }

      CLASSROOM_STUDENTS_L2.forEach((st, idx) => {
        const npc = state.npcs.get(st.id);
        const stopTarget = 2110 - idx * 18;
        if (npc) {
          if (npc.x < stopTarget) {
            npc.x += 2.35 - idx * 0.008;
            npc.dir = 'right';
            npc.state = 'walk';
            if (state.animTick % 6 === 0) npc.animFrame = (npc.animFrame + 1) % 4;
          } else {
            npc.state = 'idle';
            npc.animFrame = 0;
          }
        }
      });

      // Deteksi siswa pemain mencapai pintu keluar evakuasi
      if (sim.phase === 'evacuating' && state.player.x >= 2080) {
        sim.phase = 'completed';
        sim.shakeIntensity = 0;
        state.npcs.clear(); // Seluruh murid dan guru telah berhasil keluar ke lapangan evakuasi
        retroAudio.playPowerup();
        state.unlockedGates.add('l2_gate_gempa_sim');
        state.activeSignText = isModerate
          ? '[SIMULASI GEMPA SEDANG SUKSES! ★★★★★]\n"Kerja luar biasa! Kamu dan seluruh kelas 8A berhasil melakukan evakuasi mandiri dengan sigap melindungi kepala menggunakan tas sekolah saat gempa sedang terjadi!\n\nLangkah berikutnya: Lapangan terbuka sudah aman, dekati pintu dan tekan [E] untuk menuju Titik Kumpul (Area 3)!"'
          : '[SIMULASI GEMPA BESAR SUKSES! ★★★★★]\n"Luar biasa! Kamu dan seluruh kelas 8A berhasil menerapkan protokol keselamatan Drop, Cover, and Hold On di bawah meja, lalu evakuasi dengan tas pelindung kepala saat gempa besar terjadi!\n\nLangkah berikutnya: Gerbang menuju Lapangan Terbuka (Area 3) kini telah terbuka lebar!"';
        saveLevel2Progress(state, state.userId);
      }
    }

    // Update Debris Particles physics (memantul di atas meja tinggi 324 & lantai 360)
    if (sim.particles.length > 0) {
      for (let i = sim.particles.length - 1; i >= 0; i--) {
        const p = sim.particles[i];
        if (!p.settled) {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.26;
          p.rotation += p.rotSpeed;

          const isOverDesk = [260, 360, 460, 560, 660, 760, 860].some(
            (dx) => p.x >= dx - 6 && p.x <= dx + 48
          );
          if (isOverDesk && p.y >= 324 && !p.bounced) {
            p.y = 324;
            p.vy = -p.vy * 0.35;
            p.vx *= 0.6;
            p.bounced = true;
          } else if (p.y >= 360) {
            p.y = 360;
            p.vx = 0;
            p.vy = 0;
            p.settled = true;
          }
        } else {
          // Fade out partikel yang sudah mendarat perlahan agar array tetap segar
          p.opacity = (p.opacity ?? 1) - 0.015;
          if (p.opacity <= 0) {
            sim.particles.splice(i, 1);
          }
        }
      }
    }
  }

  // 1. Update Player Physics (Berjalan di atas daratan & jembatan, melompati jurang)
  updatePlayerPhysicsL2(state.player, input, state.zone);

  state.nearInteractablePrompt = null;

  // ── MODE INTERIOR RUANG POS PENGAMATAN MERAPI (PGA) ──
  if (state.isInsidePgaRoom) {
    // Batas dinding kiri & kanan ruangan
    state.player.x = Math.max(130, Math.min(690, state.player.x));
    if (state.player.y >= 360) {
      state.player.y = 360;
      state.player.onGround = true;
      state.player.vy = 0;
    }

    // 1. Interaksi dengan Zidane di dalam ruangan (x: 530)
    if (Math.abs(state.player.x - 530) < 55) {
      state.nearInteractablePrompt = 'Tekan [E] atau Tap untuk Bicara dengan Zidane (PVMBG)';
      if (input.interactJustPressed && !state.activeDialogueTree) {
        input.interactJustPressed = false;
        retroAudio.playSelect();
        state.activeDialogueTree = DIALOGUE_TREES_L2['pak_surya_volcano_dialogue'];
      }
    }
    // 2. Interaksi dengan Pintu Keluar di dinding kiri (x <= 165)
    else if (state.player.x <= 165) {
      state.nearInteractablePrompt = 'Tekan [E] untuk Keluar Ruangan';
      if (input.interactJustPressed) {
        input.interactJustPressed = false;
        if (!state.pgaRoomQuizSolved) {
          retroAudio.playSelect();
          state.pendingPgaWordle = true;
        } else {
          retroAudio.playPowerup();
          state.isInsidePgaRoom = false;
          state.player.x = 946;
          state.player.y = 350;
        }
      }
    }

    return; // Bypass objek & NPC luar ruangan saat berada di dalam posko
  }

  // ── DETEKSI PINTU MASUK KE GEDUNG POS PENGAMATAN MERAPI (DI LUAR) ──
  if (state.zone.id === 'area-pos-pengamatan-merapi' && !state.isInsidePgaRoom) {
    // Pintu Pos PGA di x: 946
    if (Math.abs(state.player.x - 946) < 52) {
      state.nearInteractablePrompt = 'Tekan [E] atau Enter untuk Masuk ke Pos Pengamatan Merapi';
      if (input.interactJustPressed) {
        input.interactJustPressed = false;
        retroAudio.playPowerup();
        state.isInsidePgaRoom = true;
        state.player.x = 220;
        state.player.y = 360;
        state.player.vx = 0;
        state.player.vy = 0;
      }
    }
  }

  // ── SIMULASI ERUPSI MERAPI AREA 5 STATE MACHINE ──
  if (state.zone.id === 'area-simulasi-merapi' && state.volcanoSim) {
    updateVolcanoSimulationL2(state, input);
  }

  // 1.5. Update NPCs & Proximity Interaction Level 2
  if (state.npcs) {
    const isSimActive = state.zone.id === 'area-simulasi-gempa' && state.simulation.phase !== 'idle';
    const isVolcanoSimActive =
      state.zone.id === 'area-simulasi-merapi' &&
      Boolean(
        state.volcanoSim &&
        state.volcanoSim.phase !== 'idle' &&
        state.volcanoSim.phase !== 'volcano_completed'
      );

    // Di Area 5 Simulasi Erupsi: NPC hanya di-bypass update patroli jika SEDANG DALAM FASE EVAKUASI BERLARI / QTE!
    // Di fase santai/kedatangan Map 2 (fase2_map2_arrived, fase2_map2_after_timeskip, dll) NPC TETAP BERJALAN PATROLI!
    const isVolcanoEvacRunning =
      isVolcanoSimActive &&
      (state.volcanoSim!.phase === 'fase2_waspada_evac' ||
        state.volcanoSim!.phase === 'fase3_siaga_prep_evac' ||
        state.volcanoSim!.phase === 'fase4_awas_siren' ||
        state.volcanoSim!.phase === 'fase4_awas_truck' ||
        state.volcanoSim!.phase === 'fase4_awas_rescue' ||
        state.volcanoSim!.phase === 'failed');

    if (isSimActive || isVolcanoSimActive) {
      // Selama simulasi aktif, pastikan balon interaksi [E] tidak muncul di atas NPC
      for (const npc of state.npcs.values()) {
        npc.isNearPlayer = false;
      }
    }

    if (!isSimActive && !isVolcanoEvacRunning) {
      // Selama simulasi erupsi aktif, jangan izinkan interaksi atau dialog dengan NPC
      const allowInteraction = !isVolcanoSimActive;
      const interactableNpc = updateNpcsL2(
        state.npcs,
        state.player.x,
        state.player.y,
        state.animTick,
        allowInteraction
      );
      if (interactableNpc && allowInteraction) {
        state.nearInteractablePrompt = `Tekan [E] atau Tap untuk Bicara dengan ${interactableNpc.name}`;
        if (input.interactJustPressed && !state.activeDialogueTree) {
          input.interactJustPressed = false;
          retroAudio.playSelect();

          const tree = getNpcDialogueTreeL2(state, interactableNpc);
          if (tree) {
            state.activeDialogueTree = tree;
          }
        }
      }
    }
  }

  // 2. Check Nearby Objects & Interaction (di-bypass jika masih dalam transition cooldown)
  if (state.transitionCooldown > 0) {
    return;
  }

  for (const obj of state.zone.objects) {
    const dist = Math.hypot(state.player.x - obj.px, state.player.y - obj.py);

    // 2a. Kristal Tektonik (otomatis terambil saat lewat dekat)
    if (obj.type === 'crystal') {
      if (!state.collectedCrystals.has(obj.id) && dist < 32) {
        state.collectedCrystals.add(obj.id);
        retroAudio.playPowerup();
        saveLevel2Progress(state);
      }
    }

    // 2b. Catatan Geologis ("i") - Ditampilkan secara reaktif via floating bubble di TectonicGame
    else if (obj.type === 'info_sign') {
      // Ditangani oleh inWorldSign di komponen TectonicGame
    }

    // 2c. Temuan Geologis (Discovery Totem)
    else if (obj.type === 'discovery') {
      if (dist < 48) {
        state.nearInteractablePrompt = 'Tekan [E] atau Tap untuk Mengamati Temuan Geologis';
        if (input.interactJustPressed) {
          retroAudio.playPowerup();
          const discIdx = (obj.data?.discoveryIndex as number) ?? 0;
          state.pendingDiscoveryIndex = discIdx;
          state.pendingDiscoveryId = obj.id;
          state.discoveredPoints.add(obj.id);
          const currentAreaObj = LEVEL2_AREAS[state.currentAreaIndex];
          if (currentAreaObj?.discoveries[discIdx]) {
            state.discoveredPoints.add(currentAreaObj.discoveries[discIdx].id);
          }
          saveLevel2Progress(state, state.userId);
        }
      }
    }

    // 2d. Gerbang Tantangan Evaluasi (Teka-Teki Silang Geologi)
    else if (obj.type === 'challenge_gate') {
      if (dist < 56) {
        const currentGateId =
          state.zone.id === 'area-pos-pengamatan-merapi'
            ? 'l2_gate_volcano_prep'
            : state.zone.id === 'area-lapangan-evakuasi'
              ? 'l2_gate_pascabencana'
              : state.zone.id === 'area-simulasi-merapi'
                ? 'l2_gate_volcano_sim'
                : state.zone.id === 'area-simulasi-gempa'
                  ? 'l2_gate_gempa_sim'
                  : 'l2_gate_gempa';

        if (state.unlockedGates.has(obj.id) || state.unlockedGates.has(currentGateId)) {
          state.nearInteractablePrompt = 'Kamu sudah menyelesaikan evaluasi ini! Silakan lanjut ke area selanjutnya';
        } else {
          // Periksa apakah semua temuan edukasi di area ini telah dibaca
          let requiredKeys: string[] = [];
          if (state.zone.id === 'area-mitigasi-gempa' || state.currentAreaIndex === 0) {
            requiredKeys = ['l2_q_disc_prep', 'l2_q_disc_action'];
          } else if (state.zone.id === 'area-lapangan-evakuasi' || state.currentAreaIndex === 2) {
            requiredKeys = ['disc-post-safety', 'disc-post-coordination'];
          } else if (state.zone.id === 'area-pos-pengamatan-merapi' || state.currentAreaIndex === 3) {
            requiredKeys = ['disc-volcano-status', 'disc-volcano-response'];
          } else if (state.zone.id === 'area-barak-pengungsian' || state.currentAreaIndex === 5) {
            requiredKeys = ['disc-post-ash', 'disc-post-sanitation', 'disc-post-lahar'];
          }

          let readCount = 0;
          const totalCount = requiredKeys.length;
          for (const key of requiredKeys) {
            if (key === 'l2_q_disc_prep' && (state.discoveredPoints.has('l2_q_disc_prep') || state.discoveredPoints.has('disc-earthquake-prep'))) {
              readCount++;
            } else if (key === 'l2_q_disc_action' && (state.discoveredPoints.has('l2_q_disc_action') || state.discoveredPoints.has('disc-earthquake-action'))) {
              readCount++;
            } else if (state.discoveredPoints.has(key)) {
              readCount++;
            }
          }

          if (readCount < totalCount) {
            state.nearInteractablePrompt = `Baca Semua Materi Pembelajaran Dulu (${readCount}/${totalCount})!`;
            if (input.interactJustPressed) {
              retroAudio.playError();
              state.pendingDiscoveryRequired = { read: readCount, total: totalCount };
            }
          } else {
            state.nearInteractablePrompt = 'Tekan [E] atau Tap untuk Membuka Teka-Teki Silang Gerbang';
            if (input.interactJustPressed) {
              retroAudio.playSelect();
              state.pendingCrossword = true;
            }
          }
        }
      }
    }

    // 2e. Portal Exit
    else if (obj.type === 'portal_exit') {
      if (dist < 50) {
        if (state.zone.id === 'area-simulasi-merapi') {
          // Jika simulasi masih berlangsung, abaikan portal exit karena evakuasi ditangani alur subMap
          if (state.volcanoSim && state.volcanoSim.phase !== 'volcano_completed') {
            continue;
          }
          // Area 5: Gerbang Keluar Menuju Barak Pengungsian (Area 6)
          if (state.unlockedGates.has('l2_gate_volcano_sim')) {
            state.nearInteractablePrompt = 'Tekan [E] untuk Berangkat ke Barak Pengungsian (Area 6)';
            if (input.interactJustPressed) {
              input.interactJustPressed = false;
              retroAudio.playPowerup();
              switchAreaL2(state, 5, true);
            }
          } else {
            state.nearInteractablePrompt = 'Jalur Evakuasi Terbuka Setelah Simulasi Evakuasi Dusun Berhasil Diselesaikan';
            if (input.interactJustPressed) {
              input.interactJustPressed = false;
              retroAudio.playError();
            }
          }
        } else if (state.zone.id === 'area-pos-pengamatan-merapi') {
          // Area 4: Gerbang Jalur Menuju Area 5 (Simulasi Erupsi Merapi)
          if (state.unlockedGates.has('l2_gate_volcano_prep')) {
            state.nearInteractablePrompt = 'Tekan [E] untuk Masuk ke Simulasi Erupsi Merapi (Area 5)';
            if (input.interactJustPressed) {
              input.interactJustPressed = false;
              retroAudio.playPowerup();
              switchAreaL2(state, 4, true);
            }
          } else {
            state.nearInteractablePrompt = 'Gerbang Evakuasi Terkunci (Selesaikan Evaluasi Bersama Bu Tyas Terlebih Dahulu)';
            if (input.interactJustPressed) {
              input.interactJustPressed = false;
              retroAudio.playError();
              state.pendingGateLocked = true;
            }
          }
        } else if (state.zone.id === 'area-lapangan-evakuasi') {
          // Area 3: Gerbang Keluar Menuju Pos Pengamatan Merapi (Area 4)
          if (state.unlockedGates.has('l2_gate_pascabencana')) {
            state.nearInteractablePrompt = 'Tekan [E] untuk Berangkat ke Pos Pengamatan Merapi (Area 4)';
            if (input.interactJustPressed) {
              input.interactJustPressed = false;
              retroAudio.playPowerup();
              switchAreaL2(state, 3, true);
            }
          } else {
            state.nearInteractablePrompt = 'Gerbang Evakuasi Terkunci (Selesaikan Evaluasi Bersama Bu Tyas Terlebih Dahulu)';
            if (input.interactJustPressed) {
              input.interactJustPressed = false;
              retroAudio.playError();
              state.pendingGateLocked = true;
            }
          }
        } else if (state.zone.id === 'area-simulasi-gempa') {
          // Area 2: Pintu Evakuasi ke Lapangan Terbuka (Area 3)
          if (state.unlockedGates.has('l2_gate_gempa_sim')) {
            state.nearInteractablePrompt = 'Tekan [E] untuk Keluar Menuju Lapangan Terbuka (Area 3)';
            if (input.interactJustPressed) {
              input.interactJustPressed = false;
              retroAudio.playPowerup();
              switchAreaL2(state, 2, true);
            }
          } else {
            state.nearInteractablePrompt = 'Pintu Evakuasi Terkunci (Selesaikan Simulasi Gempa Terlebih Dahulu)';
            if (input.interactJustPressed) {
              input.interactJustPressed = false;
              retroAudio.playError();
              state.pendingGateLocked = true;
            }
          }
        } else if (state.zone.id === 'area-mitigasi-erupsi' || state.zone.id === 'area-barak-pengungsian') {
          if (state.unlockedGates.has('l2_gate_shelter_recovery') || state.unlockedGates.has('l2_gate_erupsi')) {
            state.nearInteractablePrompt = 'Tekan [E] untuk Menyelesaikan Seluruh Ekspedisi Level 2';
            if (input.interactJustPressed) {
              input.interactJustPressed = false;
              retroAudio.playWin();
              state.isAreaCompleted = true;
              saveLevel2Progress(state, state.userId);
            }
          } else {
            state.nearInteractablePrompt = 'Kapsul Evakuasi Terkunci (Selesaikan Evaluasi TTS Bersama Bu Tyas Terlebih Dahulu)';
            if (input.interactJustPressed) {
              input.interactJustPressed = false;
              retroAudio.playError();
              state.pendingGateLocked = true;
            }
          }
        } else {
          // Area 1: Mitigasi Gempa Bumi
          if (state.unlockedGates.has('l2_gate_gempa')) {
            state.nearInteractablePrompt = 'Tekan [E] untuk Masuk ke Ruang Simulasi Gempa (Area 2)';
            if (input.interactJustPressed) {
              input.interactJustPressed = false;
              retroAudio.playPowerup();
              switchAreaL2(state, 1, true);
            }
          } else {
            state.nearInteractablePrompt = 'Pintu Terkunci (Selesaikan Evaluasi TTS Bersama Bu Tyas Terlebih Dahulu)';
            if (input.interactJustPressed) {
              input.interactJustPressed = false;
              retroAudio.playError();
              state.pendingGateLocked = true;
            }
          }
        }
      }
    }

    // 2f. Portal Kembali (Mundur Antar Area)
    else if (obj.type === 'portal_back') {
      if (dist < 52) {
        if (state.zone.id === 'area-barak-pengungsian') {
          state.nearInteractablePrompt = 'Tekan [E] untuk Kembali ke Dusun Destana (Area 5)';
          if (input.interactJustPressed) {
            input.interactJustPressed = false;
            retroAudio.playPowerup();
            switchAreaL2(state, 4, false);
          }
        } else if (state.zone.id === 'area-simulasi-merapi') {
          // Gerbang ke area sebelumnya: HANYA aktif di Map 1 dan Map 3 (ketika simulasi selesai)
          if (state.volcanoSim) {
            const allowBack =
              state.volcanoSim.subMap === 1 ||
              (state.volcanoSim.subMap === 3 && state.volcanoSim.phase === 'volcano_completed');
            if (!allowBack) {
              continue;
            }
          }
          state.nearInteractablePrompt = 'Tekan [E] untuk Kembali ke Pos Pengamatan Merapi (Area 4)';
          if (input.interactJustPressed) {
            input.interactJustPressed = false;
            retroAudio.playPowerup();
            switchAreaL2(state, 3, false);
          }
        } else if (state.zone.id === 'area-pos-pengamatan-merapi') {
          state.nearInteractablePrompt = 'Tekan [E] untuk Kembali ke Lapangan Evakuasi Sekolah (Area 3)';
          if (input.interactJustPressed) {
            input.interactJustPressed = false;
            retroAudio.playPowerup();
            switchAreaL2(state, 2, false);
          }
        } else if (state.zone.id === 'area-lapangan-evakuasi') {
          state.nearInteractablePrompt = 'Tekan [E] untuk Kembali ke Area 2 (Ruang Simulasi Gempa)';
          if (input.interactJustPressed) {
            input.interactJustPressed = false;
            retroAudio.playPowerup();
            switchAreaL2(state, 1, false);
          }
        } else {
          state.nearInteractablePrompt = 'Tekan [E] untuk Kembali ke Area 1 (Mitigasi Gempa Bumi)';
          if (input.interactJustPressed) {
            input.interactJustPressed = false;
            retroAudio.playPowerup();
            switchAreaL2(state, 0, false);
          }
        }
      }
    }

    // 2g. Kapsul Siaga Lander di Titik Awal & Kapsul Evakuasi Kemenangan Akhir Level 2
    else if (obj.type === 'lander_capsule') {
      if (dist < 55) {
        if (state.zone.id === 'area-barak-pengungsian') {
          // Mobil Evakuasi Kemenangan Akhir Penuntas Seluruh Level 2
          if (state.unlockedGates.has('l2_gate_shelter_recovery')) {
            state.nearInteractablePrompt = 'Tekan [E] untuk Naik ke Mobil Evakuasi (Menuntaskan Level 2!)';
            if (input.interactJustPressed) {
              input.interactJustPressed = false;
              retroAudio.playWin();
              state.isAreaCompleted = true;
              state.activeSignText =
                '[PASCABENCANA ERUPSI TUNTAS! ★★★★★]\n"Selamat Taruna! Seluruh materi pemulihan pascabencana, tata tertib barak pengungsian, sanitasi air bersih, penanganan abu vulkanik, hingga peringatan bahaya sekunder lahar dingin telah kamu kuasai secara paripurna!"';
              saveLevel2Progress(state, state.userId);
            }
          } else {
            state.nearInteractablePrompt = 'Mobil Evakuasi Terkunci (Selesaikan Evaluasi TTS Bersama Bu Tyas Terlebih Dahulu)';
            if (input.interactJustPressed) {
              input.interactJustPressed = false;
              retroAudio.playError();
              state.pendingGateLocked = true;
            }
          }
        } else {
          state.nearInteractablePrompt = 'Tekan [E] untuk Memeriksa Stasiun Observasi Kapsul Siaga';
          if (input.interactJustPressed) {
            retroAudio.playSelect();
            if (state.zone.id === 'area-mitigasi-erupsi') {
              state.activeSignText =
                '[POSKO PVMBG - PENGAMATAN ERUPSI MERAPI]\n"Pos Pengamatan Gunung Merapi aktif. Seismometer dan kamera termal memantau kubah lava 24 jam. Siapkan masker pelindung dan pantau zona KRB!"';
            } else {
              state.activeSignText =
                '[MEJA GURU - POSKO SIMULASI KELAS 8]\n"Posko simulasi mitigasi kelas aktif! Di ruangan ini kita mempelajari kesiapsiagaan 72 jam, teknik Drop-Cover-Hold On di bawah meja belajar, hingga jalur evakuasi menuju lapangan terbuka sekolah!"';
            }
          }
        }
      }
    }
  }

  // ── PROKSIMITAS RAMBU JALUR EVAKUASI RESMI DI AREA 5 (SEMUA SUBMAP & KONDISI) ──
  if (state.zone.id === 'area-simulasi-merapi' && !state.nearInteractablePrompt) {
    const evaqSigns = [680, 1220, 1720];
    for (const sx of evaqSigns) {
      if (Math.abs(state.player.x - sx) < 28) {
        state.nearInteractablePrompt = 'PAPAN JALUR EVAKUASI MERAPI (BNPB): IKUTI ARAH KE KANAN (➔)';
        break;
      }
    }
  }
}
