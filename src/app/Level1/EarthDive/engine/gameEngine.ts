// ── src/app/Level1/EarthDive/engine/gameEngine.ts ─────────────────────────
// Core game loop: ties together player, zones, camera, renderer, and interactions.

import type { ZoneConfig, MapObject, DivergentFish } from './zones';
import { ZONES, getZone, updateDivergentGroundProfile, updateConvergentGroundProfile, createInitialDivergentFish } from './zones';
import type { PlayerState, InputState } from './player';
import { createPlayer, updatePlayer, getEffectiveGround, isNearObject, initInput, readInput, mergeInput } from './player';
import type { Camera } from './renderer';
import { renderFrame, updateCamera, getGameScale, invalidateTileCache, drawTransitionOverlay } from './renderer';
import { TILE } from './sprites';
import type { CustomAvatarConfig } from '../../../../store/teacherStore';
import { retroAudio } from '../../../../utils/retroAudio';
import type { NpcState } from './npcManager';
import { createInitialNpcs, updateNpcs } from './npcManager';

// ── GAME STATE ──
export interface GameState {
  currentZone: number;
  player: PlayerState;
  camera: Camera;
  frame: number;
  collectedCrystals: Set<string>;
  discoveredPoints: Set<string>;
  unlockedGates: Set<string>;
  completedChallenges: Set<string>;
  purchasedSuits: Set<string>;
  nearObject: MapObject | null;

  // Transition state
  isTransitioning: boolean;
  transitionProgress: number;
  transitionTargetZone: number;
  transitionDirection: 'down' | 'up';

  // Modal triggers (read by React)
  pendingDiscovery: MapObject | null;
  pendingChallenge: MapObject | null;
  pendingInfoSign: MapObject | null;
  pendingNpcDialogue: MapObject | null;
  pendingSuitMerchant: MapObject | null;
  pendingSuitRequired: {
    requiredSuit: string;
    suitName: string;
    zoneName: string;
    reason: string;
    /**
     * `true` berarti pemain memang harus MEMBELI pakaian itu.
     *
     * Selalu `true` untuk saat ini, karena pakaian yang sudah dimiliki tidak
     * pernah sampai ke sini — `checkSuitRequirements` langsung memakainya.
     * Tetap disertakan supaya layar peringatan dapat membedakan "harus beli"
     * dari "harus memakai", bila aturannya berubah di kemudian hari.
     */
    harusBeli?: boolean;
  } | null;
  pendingCoreChallenge: boolean;
  pendingWordleEvaluation: boolean;
  pendingGateLocked: boolean;
  pendingDiscoveryRequired: { read: number; total: number } | null;
  pendingAreaUnderConstruction: string | null;
  lastAutoSignId: string | null;

  // NPC States
  npcStates: Map<string, NpcState>;

  // Stats
  totalCrystals: number;
  zonesVisited: Set<number>;
  userId?: string;

  // Dynamic Divergent Rift Animation State (Area 6)
  divergentProgress: number;
  divergentShake: number;
  divergentMagmaTimer: number;
  divergentCoolProgress: number;
  divergentSequencePhase?: 'calm' | 'quake' | 'temp_rise' | 'diverging' | 'cooling';
  divergentPhaseTimer?: number;
  divergentWiltProgress?: number;
  divergentFishScared?: boolean;
  divergentFish?: DivergentFish[];

  // Dynamic Convergent Collision Animation State (Area 7)
  convergentProgress: number;
  convergentShake: number;
  convergentMode: 'land' | 'ocean';

  // Dynamic Transform Strike-Slip Animation State (Area 8)
  transformProgress: number;
  transformShake: number;
}

// ── PERSISTENCE (LOCAL STORAGE PER-USER) ──
const BASE_STORAGE_KEY = 'resqbox_earthdive_progress';

export function getEarthDiveStorageKey(userId?: string): string {
  return `${BASE_STORAGE_KEY}_${userId || 'guest'}`;
}

export interface SavedEarthDiveProgress {
  currentZone: number;
  playerX: number;
  playerY: number;
  playerDir: 'left' | 'right';
  playerHealth?: number;
  collectedCrystals: string[];
  purchasedSuits?: string[];
  equippedSuit?: string | null;
  discoveredPoints: string[];
  unlockedGates: string[];
  completedChallenges: string[];
  zonesVisited: number[];
  zonePositions?: Record<number, { x: number; y: number; dir: 'left' | 'right' }>;
  divergentProgress?: number;
  convergentProgress?: number;
  convergentMode?: 'land' | 'ocean';
  transformProgress?: number;
}

export function saveEarthDiveProgress(state: GameState, userId?: string): void {
  if (typeof window === 'undefined') return;
  try {
    const id = userId || state.userId || 'guest';
    const key = getEarthDiveStorageKey(id);

    // Ambil histori posisi tiap zona yang sudah tersimpan khusus untuk akun ini
    let existingPositions: Record<number, { x: number; y: number; dir: 'left' | 'right' }> = {};
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as SavedEarthDiveProgress;
        if (parsed.zonePositions) existingPositions = parsed.zonePositions;
      }
    } catch {
      // Ignore
    }

    // Catat posisi dan arah hadap persis pada zona aktif saat ini
    existingPositions[state.currentZone] = {
      x: Math.round(state.player.x),
      y: Math.round(state.player.y),
      dir: state.player.dir,
    };

    const data: SavedEarthDiveProgress = {
      currentZone: state.currentZone,
      playerX: Math.round(state.player.x),
      playerY: Math.round(state.player.y),
      playerDir: state.player.dir,
      playerHealth: state.player.health,
      collectedCrystals: Array.from(state.collectedCrystals),
      purchasedSuits: Array.from(state.purchasedSuits),
      equippedSuit: state.player.equippedSuit,
      discoveredPoints: Array.from(state.discoveredPoints),
      unlockedGates: Array.from(state.unlockedGates),
      completedChallenges: Array.from(state.completedChallenges),
      zonesVisited: Array.from(state.zonesVisited),
      zonePositions: existingPositions,
      divergentProgress: state.divergentProgress,
      convergentProgress: state.convergentProgress,
      convergentMode: state.convergentMode,
      transformProgress: state.transformProgress,
    };

    const payload = JSON.stringify(data);
    localStorage.setItem(key, payload);
    // CATATAN: Dilarang keras mirror ke BASE_STORAGE_KEY un-scoped agar tidak membocorkan progres antar akun!
  } catch {
    // Ignore storage errors
  }
}

export function loadEarthDiveProgress(userId?: string): SavedEarthDiveProgress | null {
  if (typeof window === 'undefined') return null;
  try {
    const key = getEarthDiveStorageKey(userId);
    const raw = localStorage.getItem(key);
    // Murni ambil data spesifik akun ini. Jika akun baru / belum ada save, kembalikan null agar mulai dari Area 0!
    if (!raw) return null;
    return JSON.parse(raw) as SavedEarthDiveProgress;
  } catch {
    return null;
  }
}

export function clearEarthDiveProgress(userId?: string): void {
  if (typeof window === 'undefined') return;
  try {
    const key = getEarthDiveStorageKey(userId);
    localStorage.removeItem(key);
    // Bersihkan juga sisa key legacy un-scoped jika ada
    localStorage.removeItem(BASE_STORAGE_KEY);
  } catch {
    // Ignore
  }
}

// ── CREATE GAME ──
export function createGameState(userId?: string): GameState {
  const saved = loadEarthDiveProgress(userId);
  const zoneIndex = saved && saved.currentZone >= 0 && saved.currentZone < ZONES.length ? saved.currentZone : 0;
  const zone = getZone(zoneIndex);

  const initDivProg = 0;
  const initConvProg = 0;
  const initTransProg = 0;

  if (zoneIndex === 6) {
    updateConvergentGroundProfile(zone, 0);
  } else if (zoneIndex === 5) {
    updateDivergentGroundProfile(zone, 0);
  }

  // Posisi pemain: Utamakan posisi persis terakhir yang tersimpan di zona ini (TIDAK reset ke awal area)
  const savedZonePos = saved?.zonePositions?.[zoneIndex];
  const hasSavedInThisZone = savedZonePos !== undefined || (saved?.currentZone === zoneIndex && saved?.playerX !== undefined);
  let initialX = savedZonePos?.x ?? (saved?.currentZone === zoneIndex ? saved?.playerX : undefined) ?? (zoneIndex === 6 ? 110 : (zone.playerSpawnX ?? 80));
  let initialY = savedZonePos?.y ?? (saved?.currentZone === zoneIndex ? saved?.playerY : undefined) ?? (zone.playerSpawnY ?? 360);

  // Hanya jika benar-benar pertama kali masuk Batas Konvergen tanpa riwayat posisi sama sekali, spawn di perahu
  if (zoneIndex === 6 && !hasSavedInThisZone) {
    initialX = 110;
    initialY = 360;
  } else if (zoneIndex === 7 && !hasSavedInThisZone) {
    initialX = 120;
    initialY = 200;
  }

  // Batasi agar pemain tetap berada di dalam batas map yang aman
  const mapW = zone.cols * TILE;
  initialX = Math.max(40, Math.min(mapW - 60, initialX));
  if (zoneIndex === 5) {
    // Di Batas Divergen: Mengambang di air laut (~195px atau ~40px di atas dasar laut)
    const effectiveGround = getEffectiveGround(zone, initialX, initialY);
    initialY = Math.max(54, Math.min(effectiveGround - 35, initialY > 50 ? initialY : 195));
  } else {
    initialY = getEffectiveGround(zone, initialX, initialY);
  }

  const state: GameState = {
    userId,
    currentZone: zoneIndex,
    player: createPlayer(initialX, initialY),
    camera: { x: 0, y: 0 },
    frame: 0,
    collectedCrystals: new Set(saved?.collectedCrystals ?? []),
    purchasedSuits: new Set(saved?.purchasedSuits ?? []),
    discoveredPoints: new Set(saved?.discoveredPoints ?? []),
    unlockedGates: new Set(saved?.unlockedGates ?? []),
    completedChallenges: new Set(saved?.completedChallenges ?? []),
    nearObject: null,
    isTransitioning: false,
    transitionProgress: 0,
    transitionTargetZone: zoneIndex,
    transitionDirection: 'down',
    pendingDiscovery: null,
    pendingChallenge: null,
    pendingInfoSign: null,
    pendingNpcDialogue: null,
    pendingSuitMerchant: null,
    pendingSuitRequired: null,
    pendingCoreChallenge: false,
    pendingWordleEvaluation: false,
    pendingGateLocked: false,
    pendingDiscoveryRequired: null,
    pendingAreaUnderConstruction: null,
    lastAutoSignId: null,
    npcStates: createInitialNpcs(zoneIndex),
    totalCrystals: ZONES.reduce((n, z) => n + z.objects.filter(o => o.type === 'crystal').length, 0),
    zonesVisited: new Set(saved?.zonesVisited ?? [zoneIndex]),
    divergentProgress: initDivProg,
    divergentShake: 0,
    divergentMagmaTimer: initDivProg >= 1 ? 9999 : 0,
    divergentCoolProgress: initDivProg >= 1 ? 1.0 : 0,
    divergentSequencePhase: initDivProg >= 1 ? 'cooling' : 'calm',
    divergentPhaseTimer: 0,
    divergentWiltProgress: initDivProg >= 1 ? 1 : 0,
    divergentFishScared: initDivProg >= 1,
    divergentFish: createInitialDivergentFish(),
    convergentProgress: initConvProg,
    convergentShake: 0,
    convergentMode: saved?.convergentMode ?? 'land',
    transformProgress: initTransProg,
    transformShake: 0,
  };

  if (saved?.playerHealth !== undefined) {
    state.player.health = saved.playerHealth;
  }

  if (saved?.equippedSuit) {
    state.player.equippedSuit = saved.equippedSuit;
  } else {
    // Backward compatibility untuk save game lama yang sudah berada di zona bawah.
    // Memakai aturan yang sama dengan perpindahan zona, supaya keduanya tidak
    // dapat berbeda lagi.
    syncSuitToZone(state);
  }

  const savedDir = savedZonePos?.dir ?? saved?.playerDir;
  if (savedDir) {
    state.player.dir = savedDir;
  }

  if (zoneIndex === 5) {
    state.player.onGround = false;
  }

  // Center camera on restored player immediately
  const canvasEl = typeof document !== 'undefined' ? document.querySelector<HTMLCanvasElement>('#earth-dive-canvas') : null;
  const scale = canvasEl ? getGameScale(canvasEl.width, canvasEl.height) : 1.5;
  const viewW = canvasEl ? canvasEl.width / scale : 800;
  const viewH = canvasEl ? canvasEl.height / scale : 450;
  const currentZoneConfig = getZone(state.currentZone);
  const currentMapW = currentZoneConfig.cols * TILE;
  const currentMapH = currentZoneConfig.rows * TILE;
  if (currentMapW <= viewW) {
    state.camera.x = (currentMapW - viewW) / 2;
  } else {
    state.camera.x = Math.max(0, Math.min(currentMapW - viewW, state.player.x - viewW / 2));
  }
  if (currentMapH <= viewH) {
    state.camera.y = (currentMapH - viewH) / 2;
  } else {
    state.camera.y = Math.max(0, Math.min(currentMapH - viewH, state.player.y - state.player.height / 2 - viewH / 2));
  }

  return state;
}

// ── INIT ──
export function initGame(): void {
  initInput();
}

// ── FIND NEAREST INTERACTABLE ──
function findNearObject(
  player: PlayerState,
  zone: ZoneConfig,
  collectedIds: Set<string>,
  npcStates?: Map<string, NpcState>,
): MapObject | null {
  let closest: MapObject | null = null;
  let closestDist = Infinity;

  for (const obj of zone.objects) {
    if (collectedIds.has(obj.id)) continue;
    let targetX = obj.px !== undefined ? obj.px : obj.x;
    let targetY = obj.py !== undefined ? obj.py : obj.y;

    if (obj.type === 'npc' && npcStates) {
      const npcState = npcStates.get(obj.id);
      if (npcState) {
        targetX = npcState.x;
        targetY = npcState.y - 16;
      }
    }

    if (isNearObject(player, targetX, targetY, 1.8)) {
      const ox = targetX >= 30 ? targetX : targetX * TILE + TILE / 2;
      const oy = targetY >= 20 ? targetY : targetY * TILE + TILE / 2;
      const dist = Math.sqrt((player.x - ox) ** 2 + ((player.y - player.height / 2) - oy) ** 2);
      if (dist < closestDist) {
        closestDist = dist;
        closest = obj;
      }
    }
  }

  return closest;
}

// ── ZONE TRANSITION ──
const TRANSITION_DURATION = 240; // frames (~4 sec at 60fps agar murid dapat membaca nama zona & kedalaman dengan jelas)

function startTransition(state: GameState, targetZone: number, direction: 'down' | 'up'): void {
  if (targetZone < 0 || targetZone >= ZONES.length) return;
  state.isTransitioning = true;
  state.transitionProgress = 0;
  state.transitionTargetZone = targetZone;
  state.transitionDirection = direction;
}

function updateTransition(state: GameState): void {
  state.transitionProgress += 1 / TRANSITION_DURATION;
  if (state.transitionProgress >= 0.5 && state.currentZone !== state.transitionTargetZone) {
    // Switch zone at midpoint
    state.currentZone = state.transitionTargetZone;
    const zone = getZone(state.currentZone);

    // Pakaian disesuaikan dengan zona baru. Tanpa ini, pakaian dari zona
    // sebelumnya terbawa turun — misalnya pakaian selam tetap dipakai saat
    // sampai di Inti Dalam.
    syncSuitToZone(state);

    if (state.currentZone === 5) {
      state.divergentProgress = 0;
      state.divergentShake = 0;
      state.divergentMagmaTimer = 0;
      state.divergentCoolProgress = 0;
      state.divergentSequencePhase = 'calm';
      state.divergentPhaseTimer = 0;
      state.divergentWiltProgress = 0;
      state.divergentFishScared = false;
      state.divergentFish = createInitialDivergentFish();
      updateDivergentGroundProfile(zone, 0, 0);
    }

    if (state.currentZone === 6) {
      state.convergentProgress = 0;
      updateConvergentGroundProfile(zone, 0, state.convergentMode || 'land');
      const isOcean = (state.convergentMode || 'land') === 'ocean';
      const farhan = state.npcStates.get('z6_npc_zidane') || state.npcStates.get('npc_farhan');
      const initFarhanX = isOcean ? 615 : 460;
      if (farhan) {
        farhan.x = initFarhanX;
        farhan.anchorX = initFarhanX;
        farhan.dir = isOcean ? 'left' : 'right';
        farhan.state = isOcean ? 'idle_left' : 'idle_right';
        farhan.isFleeing = false;
        farhan.y = getEffectiveGround(zone, initFarhanX, 310);
        const farhanObj = zone.objects.find(o => o.id === 'z6_npc_zidane' || o.id === 'npc_farhan');
        if (farhanObj) {
          farhanObj.px = initFarhanX;
          farhanObj.py = farhan.y;
        }
      }
      const ratna = state.npcStates.get('z6_npc_zahra') || state.npcStates.get('npc_ratna');
      const initRatnaX = isOcean ? 800 : 740;
      if (ratna) {
        ratna.x = initRatnaX;
        ratna.anchorX = initRatnaX;
        ratna.dir = 'left';
        ratna.state = 'idle_left';
        ratna.isFleeing = false;
        ratna.y = getEffectiveGround(zone, initRatnaX, 310);
        const ratnaObj = zone.objects.find(o => o.id === 'z6_npc_zahra' || o.id === 'npc_ratna');
        if (ratnaObj) {
          ratnaObj.px = initRatnaX;
          ratnaObj.py = ratna.y;
        }
      }
    }

    if (state.currentZone === 7) {
      state.transformProgress = 0;
    }

    if (state.transitionDirection === 'down') {
      // 1. Menuju ke area selanjutnya: Spawn di TEMPAT AWAL (sebelah kiri / dekat portal_up / spawnX awal)
      const upPortal = zone.objects.find(o => o.type === 'portal_up');
      const targetX = upPortal?.px !== undefined ? upPortal.px + 50 : (zone.playerSpawnX ?? 80);
      const defaultY = state.currentZone === 7 ? 200 : (state.currentZone === 5 ? 195 : (zone.playerSpawnY ?? 360));
      const targetY = state.currentZone === 5 ? 195 : getEffectiveGround(zone, targetX, defaultY);
      state.player.x = targetX;
      state.player.y = targetY;
      state.player.dir = 'right';
    } else {
      // 2. Kembali ke area sebelumnya: Spawn di TEMPAT AKHIR (sebelah kanan / dekat portal_down)
      const downPortal = zone.objects.find(o => o.type === 'portal_down');
      const targetX = downPortal?.px !== undefined ? downPortal.px - 55 : (zone.cols * TILE - 120);
      const defaultY = state.currentZone === 7 ? 200 : (state.currentZone === 5 ? 195 : 360);
      const targetY = state.currentZone === 5 ? 195 : getEffectiveGround(zone, targetX, defaultY);
      state.player.x = targetX;
      state.player.y = targetY;
      state.player.dir = 'left';
    }

    state.player.vy = 0;
    state.player.onGround = state.currentZone !== 5; // Di Divergent (Area 6), pemain mengambang di air
    state.player.isWalking = false;
    state.player.isJumping = false;
    state.player.isFalling = false;
    state.player.landingSquashTimer = 0;

    // Arahkan kamera langsung ke posisi pemain baru secara presisi
    const canvasEl = typeof document !== 'undefined' ? document.querySelector<HTMLCanvasElement>('#earth-dive-canvas') : null;
    const scale = canvasEl ? getGameScale(canvasEl.width, canvasEl.height) : 1.5;
    const viewW = canvasEl ? canvasEl.width / scale : 800;
    const viewH = canvasEl ? canvasEl.height / scale : 450;
    const currentZoneConfig = getZone(state.currentZone);
    const currentMapW = currentZoneConfig.cols * TILE;
    const currentMapH = currentZoneConfig.rows * TILE;
    if (currentMapW <= viewW) {
      state.camera.x = (currentMapW - viewW) / 2;
    } else {
      state.camera.x = Math.max(0, Math.min(currentMapW - viewW, state.player.x - viewW / 2));
    }
    if (currentMapH <= viewH) {
      state.camera.y = (currentMapH - viewH) / 2;
    } else {
      state.camera.y = Math.max(0, Math.min(currentMapH - viewH, state.player.y - state.player.height / 2 - viewH / 2));
    }
    state.zonesVisited.add(state.currentZone);
    state.npcStates = createInitialNpcs(state.currentZone);
    invalidateTileCache();
  }
  if (state.transitionProgress >= 1) {
    state.isTransitioning = false;
    state.transitionProgress = 0;
    saveEarthDiveProgress(state);
  }
}

// ── SUIT HELPER & VALIDATION ──

/**
 * Pakaian yang WAJIB dipakai di setiap zona.
 *
 * MENGAPA DIBUAT TERPISAH
 *   Sebelumnya aturan ini hanya ada di satu tempat, yaitu saat memuat simpanan
 *   lama (loadEarthDiveProgress). Akibatnya pakaian diperbaiki saat memuat
 *   permainan, tetapi TIDAK diperbarui saat pemain berpindah zona di tengah
 *   permainan. Gejalanya persis seperti yang dilaporkan: dari Batas Divergen
 *   (memakai pakaian selam) turun ke Inti Dalam, pakaian selam itu tetap
 *   terpakai — padahal seharusnya pakaian Inti Dalam.
 *
 *   Dengan satu fungsi sebagai acuan tunggal, pemuatan simpanan dan
 *   perpindahan zona tidak dapat lagi berbeda aturan.
 *
 * Indeks zona (lihat ZONES di zones.ts):
 *   0 Permukaan, 1 Kerak, 2 Mantel, 3 Inti Luar, 4 Inti Dalam,
 *   5 Batas Divergen, 6 Batas Konvergen, 7 Batas Transform
 *
 * @returns nama pakaian, atau null bila zona itu tidak mewajibkan pakaian
 *          khusus (Permukaan dan Kerak).
 */
export function getRequiredSuitForZone(zoneIndex: number): string | null {
  if (zoneIndex === 2) return 'mantle_suit';       // Mantel
  if (zoneIndex === 3) return 'outer_core_suit';   // Inti Luar
  if (zoneIndex === 4) return 'inner_core_suit';   // Inti Dalam
  if (zoneIndex >= 5) return 'diver_suit';         // Batas lempeng (bawah laut)
  return null;                                     // Permukaan & Kerak
}

/**
 * Sesuaikan pakaian dengan zona sekarang.
 *
 * Dipanggil pada dua saat:
 *   1. Saat permainan dimuat (memperbaiki simpanan lama yang pakaiannya salah).
 *   2. Saat perpindahan zona mencapai titik tengah (pemain benar-benar pindah).
 *
 * Pakaian TIDAK diturunkan bila zona tidak mewajibkan pakaian khusus. Dengan
 * begitu pemain yang sudah membeli pakaian di zona bawah tidak kehilangannya
 * saat naik kembali ke Permukaan atau Kerak.
 */
export function syncSuitToZone(state: GameState): void {
  const wajib = getRequiredSuitForZone(state.currentZone);
  if (wajib) state.player.equippedSuit = wajib;
}

export function buyAndEquipSuit(state: GameState, suitType: string): boolean {
  state.purchasedSuits.add(suitType);
  state.player.equippedSuit = suitType;
  retroAudio.playPowerup();
  saveEarthDiveProgress(state, state.userId);
  return true;
}

/**
 * Periksa apakah pemain boleh turun ke area berikutnya.
 *
 * MENGAPA PAKAIAN YANG SUDAH DIBELI OTOMATIS DIPAKAI
 *
 *   Gejala yang dilaporkan: pemain pergi ke Mantel, membeli baju pelindung di
 *   sana, lalu kembali ke Kerak untuk melihat-lihat. Saat hendak turun lagi ke
 *   Mantel, ia diminta MEMBELI LAGI — padahal baju itu sudah dibeli.
 *
 *   Penyebabnya: pemeriksaan di bawah hanya melihat `equippedSuit` (pakaian
 *   yang SEDANG dipakai). Pakaian itu memang dilepas saat pemain naik kembali
 *   ke Kerak, karena `syncSuitToZone` menyesuaikan pakaian dengan zona.
 *   Akibatnya pemain yang sudah membayar diminta membayar dua kali.
 *
 *   Perbaikannya: bila pakaiannya SUDAH DIMILIKI (`purchasedSuits`), pakaian
 *   itu langsung dipakai tanpa biaya dan tanpa peringatan. Pemain tidak perlu
 *   membeli ulang apa yang sudah ia bayar.
 *
 *   Peringatan "wajib beli" hanya muncul bila pakaiannya memang BELUM PERNAH
 *   dibeli — yaitu saat pertama kali menuju area itu.
 *
 * DIEKSPOR UNTUK DIUJI
 *   Fungsi ini sengaja diekspor supaya `scripts/uji_pakaian_teleport.mjs`
 *   dapat mengujinya langsung. Tanpa itu, perbaikan ini hanya dapat diperiksa
 *   dengan membuka permainan dan mencobanya secara manual — dan pada proyek
 *   ini, perbaikan yang tidak diuji terbukti berulang kali salah.
 */
export function checkSuitRequirements(state: GameState): boolean {
  let requiredSuit: string | null = null;
  let requiredSuitName = '';
  let nextZoneName = '';
  let suitReason = '';

  if (state.currentZone === 1) {
    requiredSuit = 'mantle_suit';
    requiredSuitName = 'Baju Pelindung Termal MK-1';
    nextZoneName = 'Mantel Bumi';
    suitReason = 'Suhu Mantel Bumi mencapai 1.000°C–3.700°C dan tekanan jutaan atmosfer! Kamu wajib membeli dan mengenakan Baju Pelindung Termal dari Teknisi Joko sebelum melangkah turun.';
  } else if (state.currentZone === 2) {
    requiredSuit = 'outer_core_suit';
    requiredSuitName = 'Baju Pelindung Elektromagnetik MK-2';
    nextZoneName = 'Inti Luar';
    suitReason = 'Lautan logam cair bersuhu 5.000°C dengan radiasi dinamo magnetik dahsyat! Kamu wajib membeli dan mengenakan Baju Pelindung Elektromagnetik dari Teknisi Rudi sebelum turun.';
  } else if (state.currentZone === 3) {
    requiredSuit = 'inner_core_suit';
    requiredSuitName = 'Exo-Suit Hiper-Tekanan Adamantine MK-3';
    nextZoneName = 'Inti Dalam';
    suitReason = 'Pusat bumi memiliki tekanan 3,6 juta atmosfer pada suhu 6.000°C! Kamu wajib membeli dan mengenakan Exo-Suit Adamantine dari Teknisi Dian sebelum turun.';
  } else if (state.currentZone === 4) {
    requiredSuit = 'diver_suit';
    requiredSuitName = 'Baju Penyelam Samudra Kedalaman';
    nextZoneName = 'Batas Divergen (Punggung Samudra)';
    suitReason = 'Zona berikutnya berada di palung samudra kedalaman 5.000 meter bertekanan tinggi! Kamu wajib membeli dan mengenakan Baju Penyelam dari Teknisi Arya.';
  }

  if (requiredSuit && state.player.equippedSuit !== requiredSuit) {
    // ── SUDAH DIBELI? PAKAI LANGSUNG, TANPA BIAYA ─────────────────────────
    //
    // Bila pemain sudah pernah membeli pakaian ini, ia TIDAK boleh diminta
    // membelinya lagi. Pakaian itu langsung dikenakan dan pemain boleh
    // melanjutkan.
    //
    // Mengapa sampai perlu: saat pemain naik kembali ke area sebelumnya,
    // `syncSuitToZone` melepas pakaiannya (karena area itu tidak mewajibkan
    // pakaian khusus). Ketika ia turun lagi, pakaian itu tidak sedang dipakai
    // — dan pemeriksaan lama menyimpulkan pemain belum memilikinya, lalu
    // meminta pembelian kedua atas barang yang sudah dibayar.
    if (state.purchasedSuits.has(requiredSuit)) {
      state.player.equippedSuit = requiredSuit;
      saveEarthDiveProgress(state, state.userId);
      return true;
    }

    // Belum pernah dibeli: tampilkan peringatan agar pemain menemui teknisi.
    state.pendingSuitRequired = {
      requiredSuit,
      suitName: requiredSuitName,
      zoneName: nextZoneName,
      reason: suitReason,
      // Ditandai supaya layar peringatan tahu bahwa pemain memang harus
      // MEMBELI, bukan sekadar memakai.
      harusBeli: true,
    };
    return false;
  }

  return true;
}

// ── HANDLE INTERACTION ──
function handleInteraction(state: GameState, input: InputState): void {
  if (!state.nearObject) return;

  const obj = state.nearObject;

  // ONLY dedicated interact key [E] / Enter triggers object interaction!
  // UP key is strictly reserved for JUMPING and must NEVER open signs or modals!
  if (input.interactJustPressed) {
    switch (obj.type) {
      case 'crystal':
        state.collectedCrystals.add(obj.id);
        retroAudio.playPowerup();
        saveEarthDiveProgress(state);
        break;

      case 'npc':
        if (obj.data?.isSuitMerchant) {
          state.pendingSuitMerchant = obj;
          retroAudio.playSelect();
        } else {
          state.pendingNpcDialogue = obj;
          retroAudio.playSelect();
        }
        break;

      case 'discovery':
        // Selalu buka temuan geologis agar murid dapat membaca ulang catatan kapan pun
        state.pendingDiscovery = obj;
        break;

      case 'info_sign':
        // Papan catatan geologi otomatis muncul sebagai floating bubble di atas papan saat didekati
        break;

      case 'challenge_gate':
        if (!state.unlockedGates.has(obj.id)) {
          const zone = getZone(state.currentZone);
          const zoneDiscoveries = zone.objects.filter(o => o.type === 'discovery' || o.data?.isDiscoveryNpc);
          const readCount = zoneDiscoveries.filter(o => {
            const key = (o.data?.discoveryKey as string) || o.id;
            return (
              state.discoveredPoints.has(key) ||
              state.discoveredPoints.has(o.id) ||
              (o.data?.discoveryId !== undefined && (
                state.discoveredPoints.has(`disc_${o.data.discoveryId}`) ||
                state.discoveredPoints.has(String(o.data.discoveryId))
              ))
            );
          }).length;
          const totalCount = zoneDiscoveries.length;

          if (readCount < totalCount) {
            state.pendingDiscoveryRequired = { read: readCount, total: totalCount };
            return;
          }
          state.pendingChallenge = obj;
        } else if (state.currentZone >= ZONES.length - 1) {
          // Gerbang inti dalam sudah terbuka: tekan [E] untuk membuka menu kemenangan & pilihan Level 2 / Menu Utama
          state.pendingCoreChallenge = true;
        }
        break;

      case 'portal_down': {
        const zone = getZone(state.currentZone);
        const gateObj = zone.objects.find(o => o.type === 'challenge_gate');
        const gateId = gateObj
          ? gateObj.id
          : state.currentZone === 1
            ? 'crust_challenge'
            : state.currentZone === 2
              ? 'mantle_challenge'
              : state.currentZone === 3
                ? 'oc_challenge'
                : state.currentZone === 4
                  ? 'ic_challenge'
                  : state.currentZone === 5
                    ? 'divergent_challenge'
                    : state.currentZone === 6
                      ? 'convergent_challenge'
                      : state.currentZone === 7
                        ? 'transform_challenge'
                        : null;
        if (gateId && !state.unlockedGates.has(gateId)) {
          state.pendingGateLocked = true;
          return;
        }
        if (!checkSuitRequirements(state)) {
          return;
        }
        if (state.currentZone >= ZONES.length - 1) {
          // Kapsul akhir di zona terdalam (Batas Transform)
          state.pendingCoreChallenge = true;
          return;
        }
        startTransition(state, state.currentZone + 1, 'down');
        break;
      }

      case 'portal_up':
        startTransition(state, state.currentZone - 1, 'up');
        break;
    }
    return;
  }

  // Directional shortcut ONLY for portal_down with Down arrow key
  if (input.down && obj.type === 'portal_down') {
    const zone = getZone(state.currentZone);
    const gateObj = zone.objects.find(o => o.type === 'challenge_gate');
    const gateId = gateObj
      ? gateObj.id
      : state.currentZone === 1
        ? 'crust_challenge'
        : state.currentZone === 2
          ? 'mantle_challenge'
          : state.currentZone === 3
            ? 'oc_challenge'
            : state.currentZone === 4
              ? 'ic_challenge'
              : state.currentZone === 5
                ? 'divergent_challenge'
                : state.currentZone === 6
                  ? 'convergent_challenge'
                  : state.currentZone === 7
                    ? 'transform_challenge'
                    : null;
    if (gateId && !state.unlockedGates.has(gateId)) {
      state.pendingGateLocked = true;
      return;
    }
    if (!checkSuitRequirements(state)) {
      return;
    }
    if (state.currentZone >= ZONES.length - 1) {
      state.pendingCoreChallenge = true;
      return;
    }
    startTransition(state, state.currentZone + 1, 'down');
  }
}

// ── GAME TICK ──
export function tickGame(state: GameState): void {
  state.frame++;

  // If transitioning, only update transition
  if (state.isTransitioning) {
    updateTransition(state);
    return;
  }

  const zone = getZone(state.currentZone);
  const kbInput = readInput();
  const input = mergeInput(kbInput);

  // Update player physics
  updatePlayer(state.player, input, zone);

  // Update NPC AI patrol & wander
  updateNpcs(state.npcStates, zone, state.player, state.isTransitioning);

  // Find nearby object
  state.nearObject = findNearObject(state.player, zone, state.collectedCrystals, state.npcStates);

  // Auto-collect crystals when near
  if (state.nearObject?.type === 'crystal') {
    state.collectedCrystals.add(state.nearObject.id);
    retroAudio.playPowerup();
    state.nearObject = findNearObject(state.player, zone, state.collectedCrystals, state.npcStates);
    saveEarthDiveProgress(state);
  }

  // Handle interaction
  handleInteraction(state, input);

  // Note: Papan catatan geologi (info_sign) ditampilkan secara reaktif melalui inWorldSign di EarthDiveGame

  // Auto-save frequently so position is kept up to date across refreshes and tab reloads
  // Saves every 45 frames (~0.75s) while moving, and immediately when player stops moving
  const justStopped = !state.player.isWalking && Math.abs(state.player.vx) < 0.1 && (state.frame % 15 === 0);
  if (state.frame % 45 === 0 || justStopped) {
    saveEarthDiveProgress(state);
  }

  // Dynamic Divergent Rift Animation (Area 6 - Batas Divergen)
  if (state.currentZone === 5) {
    if (!state.divergentFish || state.divergentFish.length === 0) {
      state.divergentFish = createInitialDivergentFish();
    }
    if (!state.divergentSequencePhase) {
      state.divergentSequencePhase = state.divergentProgress >= 1 ? 'cooling' : 'calm';
    }
    if (state.divergentPhaseTimer === undefined) {
      state.divergentPhaseTimer = 0;
    }

    // 1. Update Fish Movement
    for (const fish of state.divergentFish) {
      if (state.divergentFishScared) {
        // Ikan panik menjauh ke kiri/kanan keluar layar dengan kecepatan tinggi
        const fleeLeft = fish.x < 450;
        fish.dir = fleeLeft ? 'left' : 'right';
        const moveSpeed = Math.abs(fish.vx) * 2.8;
        fish.x += fleeLeft ? -moveSpeed : moveSpeed;
        fish.y += Math.sin(state.frame * 0.18 + fish.id) * 0.7;
      } else {
        // Ikan berenang damai mondar-mandir di air laut
        fish.x += fish.vx;
        fish.y += Math.sin(state.frame * 0.04 + fish.id) * 0.35;
        if (fish.x < 60) {
          fish.x = 60;
          fish.vx = Math.abs(fish.vx);
          fish.dir = 'right';
        } else if (fish.x > 840) {
          fish.x = 840;
          fish.vx = -Math.abs(fish.vx);
          fish.dir = 'left';
        }
      }
    }

    // 2. Multi-phase state machine
    switch (state.divergentSequencePhase) {
      case 'calm': {
        // Fase tenang awal: Ikan berenang santai & tumbuhan laut segar (~1.2 detik)
        state.divergentPhaseTimer++;
        state.divergentShake = 0;
        state.divergentWiltProgress = 0;
        state.divergentFishScared = false;
        if (state.divergentPhaseTimer >= 70) {
          state.divergentSequencePhase = 'quake';
          state.divergentPhaseTimer = 0;
          retroAudio.playEarthquakeRumble();
        }
        break;
      }

      case 'quake': {
        // Fase gempa awal: Guncangan seismik kuat (~1.5 detik)
        state.divergentPhaseTimer++;
        state.divergentShake = Math.sin(state.frame * 0.6) * 2.2 + Math.sin(state.frame * 1.2) * 1.2;
        state.divergentWiltProgress = 0;
        state.divergentFishScared = false;
        if (state.divergentPhaseTimer >= 90) {
          state.divergentSequencePhase = 'temp_rise';
          state.divergentPhaseTimer = 0;
          state.divergentShake = 0;
        }
        break;
      }

      case 'temp_rise': {
        // Fase kenaikan suhu drastis: Ikan kabur menjauh, tanaman laut layu & uap panas (~1.8 detik)
        state.divergentPhaseTimer++;
        state.divergentFishScared = true;
        state.divergentWiltProgress = Math.min(1, state.divergentPhaseTimer / 95);
        state.divergentShake = Math.sin(state.frame * 0.4) * 0.8;
        if (state.divergentPhaseTimer >= 105) {
          state.divergentSequencePhase = 'diverging';
          state.divergentPhaseTimer = 0;
          state.divergentShake = 0;
        }
        break;
      }

      case 'diverging': {
        // Fase pergerakan divergen: Lempeng membelah ke kiri dan kanan, magma naik dari mantel (~4.5 detik)
        state.divergentFishScared = true;
        state.divergentWiltProgress = 1;
        state.divergentProgress = Math.min(1, state.divergentProgress + 0.0035);
        if (state.divergentProgress > 0.05 && state.divergentProgress < 0.95) {
          state.divergentShake = Math.sin(state.frame * 0.45) * 1.5 * (1 - state.divergentProgress);
        } else {
          state.divergentShake = 0;
        }
        state.divergentMagmaTimer = 0;
        state.divergentCoolProgress = 0;
        updateDivergentGroundProfile(zone, state.divergentProgress, 0);
        if (state.player.onGround && !state.player.isJumping) {
          state.player.y = getEffectiveGround(zone, state.player.x, state.player.y);
        }
        if (state.divergentProgress >= 1) {
          state.divergentSequencePhase = 'cooling';
          state.divergentShake = 0;
          state.divergentMagmaTimer = 0;
        }
        break;
      }

      case 'cooling': {
        state.divergentFishScared = true;
        state.divergentWiltProgress = 1;
        state.divergentShake = 0;
        // Magma timer setelah patahan terbuka: dipercepat menjadi sekitar 5 detik (~300 tick total):
        // Magma membual aktif di air laut selama ~1.7 detik (100 tick),
        // kemudian mendingin & membeku membentuk kerak pillow basalt baru selama ~3.3 detik (180 tick)
        state.divergentMagmaTimer = (state.divergentMagmaTimer || 0) + 1;
        if (state.divergentMagmaTimer > 100) {
          const coolT = Math.min(1, (state.divergentMagmaTimer - 100) / 180);
          state.divergentCoolProgress = coolT;
          updateDivergentGroundProfile(zone, state.divergentProgress, state.divergentCoolProgress);
        }
        break;
      }
    }
  }

  // Dynamic Convergent Collision Animation (Area 7 - Batas Konvergen)
  if (state.currentZone === 6) {
    const p = state.convergentProgress;
    const isLand = (state.convergentMode || 'land') === 'land';

    if (p < 1) {
      // Penumbukan lempeng dinamis, megah, dan sinematik (~9.2 detik)
      state.convergentProgress = Math.min(1, p + 0.0018);
      if (p > 0.03 && p < 0.97) {
        state.convergentShake = Math.sin(state.frame * 0.35) * 1.5 * Math.sin(p * Math.PI);
        // Suara gemuruh gempa bumi tremor tektonik berkala
        if (state.frame % 55 === 0) {
          retroAudio.playEarthquakeRumble();
        }
      } else {
        state.convergentShake = 0;
      }
      updateConvergentGroundProfile(zone, state.convergentProgress, state.convergentMode || 'land');
      // Jika karakter sedang menapak tanah, sesuaikan posisi Y pemain naik mengikuti pegunungan secara real-time
      if (state.player.onGround && !state.player.isJumping) {
        state.player.y = getEffectiveGround(zone, state.player.x, state.player.y);
      }
    } else {
      state.convergentShake = 0;
    }

    // ── KEPANIKAN & EVAKUASI NPC MENJAUH DARI AREA BAHAYA SAAT GEMPA TEKTONIK ──
    const farhan = state.npcStates.get('z6_npc_zidane') || state.npcStates.get('npc_farhan');
    const ratna = state.npcStates.get('z6_npc_zahra') || state.npcStates.get('npc_ratna');
    const safeFarhanX = isLand ? 220 : 720; // Di daratan mundur ke barat, di lautan mundur ke daratan pantai timur
    const safeRatnaX = 1000; // Dataran timur yang aman

    if (p > 0.04 && p < 0.96) {
      // Saat gempa berlangsung: Zidane lari cepat menjauh dari titik tumbukan
      if (farhan) {
        farhan.isFleeing = true;
        if (isLand) {
          if (farhan.x > safeFarhanX) {
            farhan.x = Math.max(safeFarhanX, farhan.x - 1.4);
            farhan.dir = 'left';
            farhan.state = 'walk_left';
          } else {
            farhan.dir = 'right';
            farhan.state = 'idle_right';
          }
        } else {
          if (farhan.x < safeFarhanX) {
            farhan.x = Math.min(safeFarhanX, farhan.x + 1.4);
            farhan.dir = 'right';
            farhan.state = 'walk_right';
          } else {
            farhan.dir = 'left';
            farhan.state = 'idle_left';
          }
        }
        farhan.anchorX = safeFarhanX;
        farhan.y = getEffectiveGround(zone, farhan.x, farhan.y);
      }

      // Saat gempa berlangsung: Zahra lari cepat menjauh ke Timur
      if (ratna) {
        ratna.isFleeing = true;
        if (ratna.x < safeRatnaX) {
          ratna.x = Math.min(safeRatnaX, ratna.x + 1.4);
          ratna.dir = 'right';
          ratna.state = 'walk_right';
        } else {
          ratna.dir = 'left';
          ratna.state = 'idle_left';
        }
        ratna.anchorX = safeRatnaX;
        ratna.y = getEffectiveGround(zone, ratna.x, ratna.y);
      }
    } else if (p >= 0.96) {
      // Gempa telah selesai
      if (farhan && farhan.isFleeing) {
        farhan.isFleeing = false;
        farhan.x = safeFarhanX;
        farhan.anchorX = safeFarhanX;
        farhan.dir = isLand ? 'right' : 'left';
        farhan.state = isLand ? 'idle_right' : 'idle_left';
        farhan.y = getEffectiveGround(zone, farhan.x, farhan.y);
      }
      if (ratna && ratna.isFleeing) {
        ratna.isFleeing = false;
        ratna.x = safeRatnaX;
        ratna.anchorX = safeRatnaX;
        ratna.dir = 'left';
        ratna.state = 'idle_left';
        ratna.y = getEffectiveGround(zone, ratna.x, ratna.y);
      }
    }

    // Sinkronisasi koordinat objek interaksi dengan posisi NPC terkini
    const farhanObj = zone.objects.find(o => o.id === 'z6_npc_zidane' || o.id === 'npc_farhan');
    if (farhanObj && farhan) {
      farhanObj.px = Math.round(farhan.x);
      farhanObj.py = Math.round(farhan.y);
    }
    const ratnaObj = zone.objects.find(o => o.id === 'z6_npc_zahra' || o.id === 'npc_ratna');
    if (ratnaObj && ratna) {
      ratnaObj.px = Math.round(ratna.x);
      ratnaObj.py = Math.round(ratna.y);
    }
  }

  // Dynamic Transform Strike-Slip Animation (Area 8 - Batas Transform)
  if (state.currentZone === 7) {
    if (state.transformProgress < 1) {
      // Kecepatan diperlambat (~10.4 detik pada 60fps) agar fase: tanah utuh -> gempa dulu -> baru retak -> geseran lempeng teramati jelas
      state.transformProgress = Math.min(1, state.transformProgress + 0.0016);
      const p = state.transformProgress;

      // Fase Gempa: Gempa terjadi DULU mulai p = 0.08 s/d p = 0.90 (sebelum retakan muncul)
      if (p > 0.08 && p < 0.90) {
        // Intensitas gempa tektonik sinusoidal
        const quakeIntensity = Math.sin(((p - 0.08) / (0.90 - 0.08)) * Math.PI);
        state.transformShake = Math.sin(state.frame * 0.45) * 1.8 * quakeIntensity;
        if (state.frame % 50 === 0) {
          retroAudio.playEarthquakeRumble();
        }
      } else {
        state.transformShake = 0;
      }
    } else {
      state.transformShake = 0;
    }
  }

  // Update camera with responsive scale
  const canvasEl = document.querySelector<HTMLCanvasElement>('#earth-dive-canvas');
  if (canvasEl) {
    const scale = getGameScale(canvasEl.width, canvasEl.height);
    const viewW = canvasEl.width / scale;
    const viewH = canvasEl.height / scale;
    const currentZone = getZone(state.currentZone);
    const mapW = currentZone.cols * TILE;
    const mapH = currentZone.rows * TILE;
    updateCamera(state.camera, state.player, viewW, viewH, mapW, mapH);
    if (state.divergentShake !== 0) {
      state.camera.y += state.divergentShake;
    } else if (state.convergentShake !== 0) {
      state.camera.y += state.convergentShake;
    } else if (state.transformShake !== 0) {
      state.camera.x += state.transformShake;
    }
  }
}

// ── RENDER TICK ──
export function renderGame(
  ctx: CanvasRenderingContext2D,
  canvasW: number,
  canvasH: number,
  state: GameState,
  avatarConfig?: CustomAvatarConfig,
): void {
  const zone = getZone(state.currentZone);
  const scale = getGameScale(canvasW, canvasH);

  renderFrame(
    ctx,
    canvasW,
    canvasH,
    state.camera,
    zone,
    state.player,
    state.frame,
    state.collectedCrystals,
    state.unlockedGates,
    state.nearObject,
    scale,
    avatarConfig,
    state.npcStates,
    state.divergentProgress,
    state.convergentProgress,
    state.transformProgress,
    state.divergentCoolProgress ?? 0,
    state.divergentWiltProgress ?? 0,
    state.divergentFishScared ?? false,
    state.divergentFish,
    state.divergentSequencePhase ?? 'cooling',
    state.convergentMode || 'land',
    state.discoveredPoints,
  );

  // Transition overlay
  if (state.isTransitioning) {
    const targetZone = getZone(state.transitionTargetZone);
    drawTransitionOverlay(
      ctx,
      canvasW,
      canvasH,
      state.transitionProgress,
      targetZone.name,
      targetZone.depthLabel,
      state.transitionDirection === 'down',
    );
  }
}

// ── DIRECT ACTIONS (Button & Click triggers) ──

/**
 * Trigger descent to next layer
 */
export function triggerDiveDown(state: GameState): { success: boolean; reason?: string } {
  if (state.isTransitioning) return { success: false, reason: 'Sedang berpindah lapisan' };
  const zone = getZone(state.currentZone);
  const gateObj = zone.objects.find(o => o.type === 'challenge_gate');
  const gateId = gateObj
    ? gateObj.id
    : state.currentZone === 1
      ? 'crust_challenge'
      : state.currentZone === 2
        ? 'mantle_challenge'
        : state.currentZone === 3
          ? 'oc_challenge'
          : state.currentZone === 4
            ? 'ic_challenge'
            : state.currentZone === 5
              ? 'divergent_challenge'
              : state.currentZone === 6
                ? 'convergent_challenge'
                : state.currentZone === 7
                  ? 'transform_challenge'
                  : null;

  if (gateId && !state.unlockedGates.has(gateId)) {
    return {
      success: false,
      reason: 'Akses turun masih terkunci! Selesaikan tantangan terlebih dahulu.',
    };
  }

  if (state.currentZone >= ZONES.length - 1) {
    state.pendingCoreChallenge = true;
    return { success: true };
  }

  startTransition(state, state.currentZone + 1, 'down');
  return { success: true };
}

/**
 * Trigger ascent to previous layer
 */
export function triggerAscendUp(state: GameState): boolean {
  if (state.isTransitioning) return false;
  if (state.currentZone <= 0) return false;
  startTransition(state, state.currentZone - 1, 'up');
  return true;
}

/**
 * Teleport langsung ke zona tertentu — dipakai oleh tracker progres.
 *
 * MENGAPA ADA
 *   Saat demo, berpindah antar area dengan berjalan memakan waktu lama.
 *   Tracker progres menampilkan seluruh area, jadi area yang sudah dilewati
 *   dapat diklik untuk melompat ke sana.
 *
 * BATASAN: HANYA AREA YANG PERNAH DIKUNJUNGI
 *
 *   Aturannya memakai `zonesVisited` — daftar area yang PERNAH dimasuki —
 *   bukan perbandingan dengan area yang sedang ditempati.
 *
 *   Versi pertama memakai `targetZone > state.currentZone`, dan itu salah.
 *   Gejalanya: pemain sudah pernah sampai Mantel, lalu kembali ke Kerak, dan
 *   tidak dapat teleport kembali ke Mantel — padahal Mantel sudah terbuka.
 *   Membandingkan dengan area SEKARANG berarti kemajuan pemain "mundur"
 *   setiap kali ia naik ke area sebelumnya.
 *
 *   Dengan `zonesVisited`, area yang pernah dibuka tetap terbuka walaupun
 *   pemain sedang berada di area yang lebih dangkal.
 *
 *   Batasan ini juga menjaga keabsahan hasil belajar: area yang belum pernah
 *   dicapai tetap tidak dapat dituju, sehingga materi dan tantangan di
 *   antaranya tidak terlewat.
 *
 * Transisi tetap dijalankan (bukan lompat seketika) supaya layar perpindahan
 * zona, nama zona, dan kedalamannya tetap muncul seperti perpindahan biasa.
 *
 * ARAH PERPINDAHAN
 *   Ditentukan dari perbandingan zona sekarang dengan zona tujuan, supaya
 *   animasinya masuk akal: 'down' bila menuju area yang lebih dalam, 'up' bila
 *   menuju area yang lebih dangkal. Nama zona di layar transisi mengikuti arah
 *   itu, jadi pemain melihat "MEMASUKI AREA BARU" atau "KEMBALI KE AREA
 *   SEBELUMNYA" dengan benar.
 *
 * @returns `{ success, reason }` — reason berisi alasan bila ditolak.
 */
export function teleportToZone(
  state: GameState,
  targetZone: number
): { success: boolean; reason?: string } {
  if (state.isTransitioning) {
    return { success: false, reason: 'Sedang berpindah area. Tunggu sebentar.' };
  }
  if (!Number.isInteger(targetZone) || targetZone < 0 || targetZone >= ZONES.length) {
    return { success: false, reason: 'Area tidak dikenal.' };
  }
  if (targetZone === state.currentZone) {
    return { success: false, reason: 'Kamu sudah berada di area ini.' };
  }

  // Hanya area yang PERNAH dimasuki yang dapat dituju. Perhatikan: bukan
  // "area yang lebih dangkal dari area sekarang", melainkan "area yang sudah
  // pernah dibuka".
  if (!state.zonesVisited.has(targetZone)) {
    return {
      success: false,
      reason: 'Area itu belum terbuka. Selesaikan area sebelumnya dulu.',
    };
  }

  // Bila area tujuan memerlukan baju pelindung, pastikan sudah dimiliki atau
  // dipakai. Pemeriksaan yang sama dipakai saat turun lewat gerbang, supaya
  // teleport tidak menjadi jalan pintas melewati syarat pakaian.
  const wajib = getRequiredSuitForZone(targetZone);
  if (wajib && !state.purchasedSuits.has(wajib)) {
    return {
      success: false,
      reason: 'Kamu belum memiliki baju pelindung untuk area itu. Beli dulu dari teknisi.',
    };
  }

  // Arah ditentukan dari posisi relatif, supaya animasi perpindahan tetap
  // masuk akal (naik bila menuju area yang lebih dangkal, turun bila lebih dalam).
  startTransition(state, targetZone, targetZone > state.currentZone ? 'down' : 'up');
  return { success: true };
}

/**
 * Handle mouse/touch click on canvas to interact with world objects
 */
export function handleCanvasClick(
  state: GameState,
  clickX: number,
  clickY: number,
  canvasW: number,
  canvasH: number,
): { action: string; target?: string } | null {
  if (state.isTransitioning) return null;

  const scale = getGameScale(canvasW, canvasH);
  // Convert canvas pixel to world pixel
  const worldX = state.camera.x + clickX / scale;
  const worldY = state.camera.y + clickY / scale;

  const zone = getZone(state.currentZone);

  for (const obj of zone.objects) {
    if (state.collectedCrystals.has(obj.id)) continue;
    const ox = obj.px !== undefined ? obj.px : obj.x * TILE;
    const oy = obj.py !== undefined ? obj.py : obj.y * TILE;

    // Check if click was within/near object (allowing 20px margin)
    if (
      worldX >= ox - 16 &&
      worldX <= ox + TILE + 16 &&
      worldY >= oy - 16 &&
      worldY <= oy + TILE + 16
    ) {
      // If portal down clicked
      if (obj.type === 'portal_down') {
        const res = triggerDiveDown(state);
        return { action: res.success ? 'dive_down' : 'gate_locked', target: res.reason };
      }
      if (obj.type === 'portal_up') {
        triggerAscendUp(state);
        return { action: 'ascend_up' };
      }
      if (obj.type === 'npc') {
        state.pendingNpcDialogue = obj;
        return { action: 'npc_dialogue', target: obj.id };
      }
      if (obj.type === 'discovery') {
        state.pendingDiscovery = obj;
        return { action: 'discovery', target: obj.id };
      }
      if (obj.type === 'info_sign') {
        state.pendingInfoSign = obj;
        return { action: 'info_sign', target: obj.id };
      }
      if (obj.type === 'challenge_gate' && !state.unlockedGates.has(obj.id)) {
        state.pendingChallenge = obj;
        return { action: 'challenge', target: obj.id };
      }
    }
  }

  return null;
}

// ── CALLBACKS from React modals ──
export function onDiscoveryComplete(state: GameState, objId: string): void {
  state.discoveredPoints.add(objId);
  state.pendingDiscovery = null;
  saveEarthDiveProgress(state);
}

export function onChallengeComplete(state: GameState, objId: string): void {
  state.unlockedGates.add(objId);
  state.completedChallenges.add(objId);
  state.pendingChallenge = null;
  saveEarthDiveProgress(state);
}

export function onCoreChallengeComplete(state: GameState): void {
  state.completedChallenges.add('core_synthesis');
  state.pendingCoreChallenge = false;
  state.pendingWordleEvaluation = false;
  saveEarthDiveProgress(state);
}

export function dismissInfoSign(state: GameState): void {
  state.pendingInfoSign = null;
}

// ── SIMULASI ULANG INTERAKTIF ANIMASI TEKTONIK (AREA 6 & AREA 7) ──
export function setConvergentMode(state: GameState, mode: 'land' | 'ocean'): void {
  if (state.currentZone !== 6) return;
  state.convergentMode = mode;
  state.convergentProgress = 0;
  state.convergentShake = 0;
  const zone = getZone(6);
  updateConvergentGroundProfile(zone, 0, mode);

  // Update teks papan informasi sesuai mode
  const signObj = zone.objects.find(o => o.id === 'conv_sign_dock');
  if (signObj && signObj.data) {
    if (mode === 'ocean') {
      signObj.data.text = '"Zona Subduksi Samudra & Benua! Lempeng samudra yang lebih padat menumbuk dan menunjam ke bawah lempeng benua, membentuk Palung Laut (Trench) yang sangat dalam di tepi pantai berpasir."';
    } else {
      signObj.data.text = '"Dua lempeng benua saling bertabrakan (Batas Konvergen)! Lempeng kiri menunjam ke bawah, gaya kompresi melipat kerak bumi dan membentuk gunung dengan dapur magma di dalamnya."';
    }
  }

  // Reset NPC ke titik pengamatan awal sebelum gempa
  const farhan = state.npcStates.get('z6_npc_zidane') || state.npcStates.get('npc_farhan');
  const initFarhanX = mode === 'ocean' ? 615 : 460;
  if (farhan) {
    farhan.x = initFarhanX;
    farhan.anchorX = initFarhanX;
    farhan.dir = mode === 'ocean' ? 'left' : 'right';
    farhan.state = mode === 'ocean' ? 'idle_left' : 'idle_right';
    farhan.isFleeing = false;
    farhan.y = getEffectiveGround(zone, initFarhanX, 310);
    const farhanObj = zone.objects.find(o => o.id === 'z6_npc_zidane' || o.id === 'npc_farhan');
    if (farhanObj) {
      farhanObj.px = initFarhanX;
      farhanObj.py = farhan.y;
    }
  }
  const ratna = state.npcStates.get('z6_npc_zahra') || state.npcStates.get('npc_ratna');
  const initRatnaX = mode === 'ocean' ? 800 : 740;
  if (ratna) {
    ratna.x = initRatnaX;
    ratna.anchorX = initRatnaX;
    ratna.dir = 'left';
    ratna.state = 'idle_left';
    ratna.isFleeing = false;
    ratna.y = getEffectiveGround(zone, initRatnaX, 310);
    const ratnaObj = zone.objects.find(o => o.id === 'z6_npc_zahra' || o.id === 'npc_ratna');
    if (ratnaObj) {
      ratnaObj.px = initRatnaX;
      ratnaObj.py = ratna.y;
    }
  }

  if (state.player.onGround && !state.player.isJumping) {
    state.player.y = getEffectiveGround(zone, state.player.x, state.player.y);
  }
  retroAudio.playPowerup();
  saveEarthDiveProgress(state, state.userId);
}

export function triggerConvergentSimulation(state: GameState): void {
  if (state.currentZone !== 6) return;
  state.convergentProgress = 0;
  state.convergentShake = 0;
  const isOcean = (state.convergentMode || 'land') === 'ocean';
  const zone = getZone(6);
  updateConvergentGroundProfile(zone, 0, state.convergentMode || 'land');

  // Reset NPC ke titik pengamatan awal sebelum gempa
  const farhan = state.npcStates.get('z6_npc_zidane') || state.npcStates.get('npc_farhan');
  const initFarhanX = isOcean ? 615 : 460;
  if (farhan) {
    farhan.x = initFarhanX;
    farhan.anchorX = initFarhanX;
    farhan.dir = isOcean ? 'left' : 'right';
    farhan.state = isOcean ? 'idle_left' : 'idle_right';
    farhan.isFleeing = false;
    farhan.y = getEffectiveGround(zone, initFarhanX, 310);
    const farhanObj = zone.objects.find(o => o.id === 'z6_npc_zidane' || o.id === 'npc_farhan');
    if (farhanObj) {
      farhanObj.px = initFarhanX;
      farhanObj.py = farhan.y;
    }
  }
  const ratna = state.npcStates.get('z6_npc_zahra') || state.npcStates.get('npc_ratna');
  const initRatnaX = isOcean ? 800 : 740;
  if (ratna) {
    ratna.x = initRatnaX;
    ratna.anchorX = initRatnaX;
    ratna.dir = 'left';
    ratna.state = 'idle_left';
    ratna.isFleeing = false;
    ratna.y = getEffectiveGround(zone, initRatnaX, 310);
    const ratnaObj = zone.objects.find(o => o.id === 'z6_npc_zahra' || o.id === 'npc_ratna');
    if (ratnaObj) {
      ratnaObj.px = initRatnaX;
      ratnaObj.py = ratna.y;
    }
  }

  if (state.player.onGround && !state.player.isJumping) {
    state.player.y = getEffectiveGround(zone, state.player.x, state.player.y);
  }
  retroAudio.playPowerup();
}

export function triggerDivergentSimulation(state: GameState): void {
  if (state.currentZone !== 5) return;
  state.divergentProgress = 0;
  state.divergentShake = 0;
  state.divergentMagmaTimer = 0;
  state.divergentCoolProgress = 0;
  state.divergentSequencePhase = 'calm';
  state.divergentPhaseTimer = 0;
  state.divergentWiltProgress = 0;
  state.divergentFishScared = false;
  state.divergentFish = createInitialDivergentFish();
  const zone = getZone(5);
  updateDivergentGroundProfile(zone, 0, 0);
  if (state.player.onGround && !state.player.isJumping) {
    state.player.y = getEffectiveGround(zone, state.player.x, state.player.y);
  }
  retroAudio.playPowerup();
}

export function triggerTransformSimulation(state: GameState): void {
  if (state.currentZone !== 7) return;
  state.transformProgress = 0;
  state.transformShake = 0;
  state.player.x = 120;
  state.player.y = 200;
  state.player.dir = 'right';
  retroAudio.playPowerup();
}

