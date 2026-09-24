// ── src/app/Level1/EarthDive/engine/gameEngine.ts ─────────────────────────
// Core game loop: ties together player, zones, camera, renderer, and interactions.

import type { ZoneConfig, MapObject } from './zones';
import { ZONES, getZone, updateDivergentGroundProfile, updateConvergentGroundProfile } from './zones';
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

  // Dynamic Convergent Collision Animation State (Area 7)
  convergentProgress: number;
  convergentShake: number;

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
  discoveredPoints: string[];
  unlockedGates: string[];
  completedChallenges: string[];
  zonesVisited: number[];
  zonePositions?: Record<number, { x: number; y: number; dir: 'left' | 'right' }>;
  divergentProgress?: number;
  convergentProgress?: number;
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
      discoveredPoints: Array.from(state.discoveredPoints),
      unlockedGates: Array.from(state.unlockedGates),
      completedChallenges: Array.from(state.completedChallenges),
      zonesVisited: Array.from(state.zonesVisited),
      zonePositions: existingPositions,
      divergentProgress: state.divergentProgress,
      convergentProgress: state.convergentProgress,
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
  let initialX = savedZonePos?.x ?? saved?.playerX ?? zone.playerSpawnX ?? 80;
  let initialY = savedZonePos?.y ?? saved?.playerY ?? zone.playerSpawnY ?? 360;

  // Hanya jika benar-benar pertama kali masuk Batas Konvergen tanpa riwayat posisi sama sekali, spawn di perahu
  if (zoneIndex === 6 && savedZonePos === undefined && saved?.playerX === undefined) {
    initialX = 110;
    initialY = 360;
  } else if (zoneIndex === 7 && savedZonePos === undefined && saved?.playerX === undefined) {
    initialX = 120;
    initialY = 200;
  }

  // Batasi agar pemain tetap berada di dalam batas map yang aman
  const mapW = zone.cols * TILE;
  initialX = Math.max(40, Math.min(mapW - 60, initialX));
  initialY = getEffectiveGround(zone, initialX, initialY);

  const state: GameState = {
    userId,
    currentZone: zoneIndex,
    player: createPlayer(initialX, initialY),
    camera: { x: 0, y: 0 },
    frame: 0,
    collectedCrystals: new Set(saved?.collectedCrystals ?? []),
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
    convergentProgress: initConvProg,
    convergentShake: 0,
    transformProgress: initTransProg,
    transformShake: 0,
  };

  if (saved?.playerHealth !== undefined) {
    state.player.health = saved.playerHealth;
  }

  const savedDir = savedZonePos?.dir ?? saved?.playerDir;
  if (savedDir) {
    state.player.dir = savedDir;
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
function findNearObject(player: PlayerState, zone: ZoneConfig, collectedIds: Set<string>): MapObject | null {
  let closest: MapObject | null = null;
  let closestDist = Infinity;

  for (const obj of zone.objects) {
    if (collectedIds.has(obj.id)) continue;
    const targetX = obj.px !== undefined ? obj.px : obj.x;
    const targetY = obj.py !== undefined ? obj.py : obj.y;

    if (isNearObject(player, targetX, targetY, 1.8)) {
      const ox = obj.px !== undefined ? obj.px + TILE / 2 : obj.x * TILE + TILE / 2;
      const oy = obj.py !== undefined ? obj.py + TILE / 2 : obj.y * TILE + TILE / 2;
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

    if (state.currentZone === 5) {
      state.divergentProgress = 0;
      updateDivergentGroundProfile(zone, 0);
    }

    if (state.currentZone === 6) {
      state.convergentProgress = 0;
      updateConvergentGroundProfile(zone, 0);
    }

    if (state.currentZone === 7) {
      state.transformProgress = 0;
    }

    if (state.transitionDirection === 'down') {
      // 1. Menuju ke area selanjutnya: Spawn di TEMPAT AWAL (sebelah kiri / dekat portal_up / spawnX awal)
      const upPortal = zone.objects.find(o => o.type === 'portal_up');
      const targetX = upPortal?.px !== undefined ? upPortal.px + 50 : (zone.playerSpawnX ?? 80);
      const defaultY = state.currentZone === 7 ? 200 : (zone.playerSpawnY ?? 360);
      const targetY = getEffectiveGround(zone, targetX, defaultY);
      state.player.x = targetX;
      state.player.y = targetY;
      state.player.dir = 'right';
    } else {
      // 2. Kembali ke area sebelumnya: Spawn di TEMPAT AKHIR (sebelah kanan / dekat portal_down)
      const downPortal = zone.objects.find(o => o.type === 'portal_down');
      const targetX = downPortal?.px !== undefined ? downPortal.px - 55 : (zone.cols * TILE - 120);
      const defaultY = state.currentZone === 7 ? 200 : 360;
      const targetY = getEffectiveGround(zone, targetX, defaultY);
      state.player.x = targetX;
      state.player.y = targetY;
      state.player.dir = 'left';
    }

    state.player.vy = 0;
    state.player.onGround = true;
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
        state.pendingNpcDialogue = obj;
        retroAudio.playSelect();
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
          const zoneDiscoveries = zone.objects.filter(o => o.type === 'discovery');
          const readCount = zoneDiscoveries.filter(o => state.discoveredPoints.has(o.id)).length;
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
  state.nearObject = findNearObject(state.player, zone, state.collectedCrystals);

  // Auto-collect crystals when near
  if (state.nearObject?.type === 'crystal') {
    state.collectedCrystals.add(state.nearObject.id);
    retroAudio.playPowerup();
    state.nearObject = findNearObject(state.player, zone, state.collectedCrystals);
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
    if (state.divergentProgress < 1) {
      // Pemekaran lempeng perlahan dan megah (~4.5 detik)
      state.divergentProgress = Math.min(1, state.divergentProgress + 0.0035);
      if (state.divergentProgress > 0.05 && state.divergentProgress < 0.95) {
        state.divergentShake = Math.sin(state.frame * 0.45) * 1.5 * (1 - state.divergentProgress);
      } else {
        state.divergentShake = 0;
      }
      updateDivergentGroundProfile(zone, state.divergentProgress);
      if (state.player.onGround && !state.player.isJumping) {
        state.player.y = getEffectiveGround(zone, state.player.x, state.player.y);
      }
    } else {
      state.divergentShake = 0;
    }
  }

  // Dynamic Convergent Collision Animation (Area 7 - Batas Konvergen)
  if (state.currentZone === 6) {
    if (state.convergentProgress < 1) {
      // Penumbukan lempeng perlahan dan megah (~4.5 detik)
      state.convergentProgress = Math.min(1, state.convergentProgress + 0.0035);
      if (state.convergentProgress > 0.05 && state.convergentProgress < 0.95) {
        state.convergentShake = Math.sin(state.frame * 0.45) * 1.5 * (1 - state.convergentProgress);
      } else {
        state.convergentShake = 0;
      }
      updateConvergentGroundProfile(zone, state.convergentProgress);
      // Jika karakter sedang menapak tanah, sesuaikan posisi Y pemain naik mengikuti pegunungan secara real-time
      if (state.player.onGround && !state.player.isJumping) {
        state.player.y = getEffectiveGround(zone, state.player.x, state.player.y);
      }
    } else {
      state.convergentShake = 0;
    }
  }

  // Dynamic Transform Strike-Slip Animation (Area 8 - Batas Transform)
  if (state.currentZone === 7) {
    if (state.transformProgress < 1) {
      // Pergeseran mendatar sesar San Andreas perlahan dan megah (~4.5 detik)
      state.transformProgress = Math.min(1, state.transformProgress + 0.0035);
      if (state.transformProgress > 0.05 && state.transformProgress < 0.95) {
        state.transformShake = Math.sin(state.frame * 0.45) * 1.5 * (1 - state.transformProgress);
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
export function triggerConvergentSimulation(state: GameState): void {
  if (state.currentZone !== 6) return;
  state.convergentProgress = 0;
  state.player.x = 110;
  state.player.y = 360;
  state.player.dir = 'right';
  const zone = getZone(6);
  updateConvergentGroundProfile(zone, 0);
  retroAudio.playPowerup();
}

export function triggerDivergentSimulation(state: GameState): void {
  if (state.currentZone !== 5) return;
  state.divergentProgress = 0;
  state.player.x = 120;
  state.player.y = 360;
  state.player.dir = 'right';
  const zone = getZone(5);
  updateDivergentGroundProfile(zone, 0);
  retroAudio.playPowerup();
}

export function triggerTransformSimulation(state: GameState): void {
  if (state.currentZone !== 7) return;
  state.transformProgress = 0;
  state.player.x = 120;
  state.player.y = 200;
  state.player.dir = 'right';
  retroAudio.playPowerup();
}

