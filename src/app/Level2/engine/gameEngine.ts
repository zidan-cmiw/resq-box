// ── src/app/Level2/engine/gameEngine.ts ──────────────────────────────
// Game Engine Loop Level 2: Batas Divergen & Pecahnya Pangea
// Mengatur update pergerakan siswa, jurang magma & daratan magma beku,
// catatan geologis ("i"), temuan geologis, kristal tektonik, dan gerbang teka-teki silang.

import type { ZoneConfigL2 } from './zones';
import { getAreaZoneL2 } from './zones';
import type { PlayerStateL2, InputStateL2 } from './player';
import { createPlayerL2, updatePlayerPhysicsL2 } from './player';
import { retroAudio } from '../../../utils/retroAudio';
import { createInitialNpcsL2, updateNpcsL2, CLASSROOM_STUDENTS_L2, type NpcStateL2 } from './npcManagerL2';
import { DIALOGUE_TREES_L2, type DialogueTreeL2 } from '../dialogueDataL2';
import { LEVEL2_AREAS } from '../level2Data';

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
      collectedCrystals: Array.from(state.collectedCrystals),
      discoveredPoints: Array.from(state.discoveredPoints),
      unlockedGates: Array.from(state.unlockedGates),
      isAreaCompleted: state.isAreaCompleted,
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

  return {
    userId,
    currentAreaIndex,
    player,
    zone,
    animTick: 0,
    collectedCrystals: new Set<string>(saved?.collectedCrystals || []),
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
    transitionCooldown: 30,
    areaTransitionBanner: {
      direction: 'enter',
      areaName: zone.name,
      subtitle: currentAreaIndex === 0
        ? 'SIMULASI RUANG KELAS: KESIAPSIAGAAN & DROP-COVER-HOLD ON'
        : 'SIMULASI TANGGAP GEMPA: DROP, COVER, HOLD ON & EVAKUASI',
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
}

export function startSimulationArea2(state: GameStateL2): void {
  state.simulation = {
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
    state.player.x = 2060;
    state.player.dir = 'left';
    if (targetAreaIndex === 0) {
      state.unlockedGates.add('l2_gate_gempa');
    } else if (targetAreaIndex === 1) {
      state.unlockedGates.add('l2_gate_gempa_sim');
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
      : 'PASCABENCANA: TITIK KUMPUL & PENANGANAN MEDIS',
    timer: 240,
    maxTimer: 240,
  };

  if (spawnAtStart && targetAreaIndex === 2) {
    state.activeDialogueTree = DIALOGUE_TREES_L2['resqy_briefing_area3'];
  }

  saveLevel2Progress(state);
}

// ── HELPER: SPAWN PUING-PUING RUANG KELAS YANG TAMPAK JELAS DI VIEWPORT ──
function spawnSimulationDebris(particles: DebrisParticleL2[], playerX: number): void {
  if (particles.length >= 65) {
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

    // 1. Fase Pembelajaran Matematika (Bu Rahma Cutscene)
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

      // Jika dialog Bu Rahma mengajar sudah selesai ditutup, gempa langsung mengguncang!
      if (!state.activeDialogueTree) {
        sim.phase = 'quake_alert';
        sim.shakeIntensity = 2.0; // Getaran tremor realistis awal
        sim.alarmTick = 1;
        retroAudio.playAlarm();
        retroAudio.playExplosion();
        // Bu Rahma langsung memperingatkan kelas untuk merunduk & berlindung sebelum QTE!
        state.activeDialogueTree = DIALOGUE_TREES_L2['bu_rahma_quake_alert'];
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
      if (sim.alarmTick % 45 === 0) retroAudio.playAlarm();
      sim.shakeIntensity = 1.6 + Math.sin(state.animTick * 0.3) * 0.8;

      // Puing-puing plafon mulai berjatuhan nampak
      if (state.animTick % 7 === 0) {
        spawnSimulationDebris(sim.particles, state.player.x);
      }

      // Begitu dialog peringatan Bu Rahma selesai dibaca, barulah QTE 10 detik dimulai!
      if (!state.activeDialogueTree) {
        sim.phase = 'qte_cover';
        sim.qteTimer = 600; // 10 detik
        sim.qteMaxTimer = 600;
        sim.panicShouts = [
          { id: 'rian', x: 282, y: 360, text: 'GEMPA!', staggerY: 0 },
          { id: 'dito', x: 382, y: 360, text: 'MERUNDUK!', staggerY: -12 },
          { id: 'siti', x: 582, y: 360, text: 'TAHAN MEJA!', staggerY: 0 },
          { id: 'edo', x: 882, y: 360, text: 'TUTUP KEPALA!', staggerY: -12 },
          { id: 'dewi', x: 1182, y: 360, text: 'PEGANG MEJA!', staggerY: 0 },
          { id: 'lina', x: 1582, y: 360, text: 'JANGAN PANIK!', staggerY: -12 },
          { id: 'putri', x: 1782, y: 360, text: 'LINDUNGI LEHER!', staggerY: 0 },
        ];
      }
    }

    // 2. Fase QTE 10 Detik (Drop to Cover under desk)
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
      sim.shakeIntensity = 2.0 + Math.sin(state.animTick * 0.3) * 0.8;
      sim.alarmTick++;
      if (sim.alarmTick % 45 === 0) retroAudio.playAlarm();

      // Munculkan puing plafon & batu jatuh di viewport kelas
      if (state.animTick % 5 === 0) {
        spawnSimulationDebris(sim.particles, state.player.x);
      }

      const secLeft = Math.ceil(sim.qteTimer / 60);
      state.nearInteractablePrompt = `[${secLeft}s] TEKAN [E] / ENTER ATAU TAP UNTUK BERLINDUNG DI BAWAH MEJA!`;

      if (input.interactJustPressed) {
        // SUKSES QTE tepat waktu!
        input.interactJustPressed = false;
        retroAudio.playSelect();
        sim.qteSuccess = true;
        sim.playerCrouchedUnderDesk = true;
        sim.playerAtDesk = false;
        sim.phase = 'quake_holding';
        sim.quakeTimer = 600; // Guncangan gempa 10 detik!
        sim.quakeMaxTimer = 600;
        state.nearInteractablePrompt = null;
      } else if (sim.qteTimer <= 0) {
        // GAGAL QTE (>10s): Mulai cutscene batu besar menimpa pemain!
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
            sim.shakeIntensity = 7.5; // Hentakan benturan sesaat

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
      sim.shakeIntensity = 2.2 + Math.sin(state.animTick * 0.25) * 0.8; // Tremor realistis halus
      sim.alarmTick++;
      if (sim.alarmTick % 55 === 0) retroAudio.playAlarm();

      // Puing plafon berjatuhan di viewport kelas
      if (state.animTick % 6 === 0) {
        spawnSimulationDebris(sim.particles, state.player.x);
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

    // 5. Fase Evakuasi Menuju Pintu Lapangan Terbuka
    else if (sim.phase === 'evacuating') {
      // Guru Bu Rahma dan SELURUH 16 murid sekelas berjalan evakuasi ke kanan
      const buRahma = state.npcs.get('l2_sim_npc_bu_rahma');
      if (buRahma && buRahma.x < 2130) {
        buRahma.x += 1.6;
        buRahma.dir = 'right';
        buRahma.state = 'walk';
        if (state.animTick % 6 === 0) buRahma.animFrame = (buRahma.animFrame + 1) % 4;
      }

      CLASSROOM_STUDENTS_L2.forEach((st, idx) => {
        const npc = state.npcs.get(st.id);
        const stopTarget = 2110 - idx * 18;
        if (npc && npc.x < stopTarget) {
          npc.x += 1.55 - idx * 0.008;
          npc.dir = 'right';
          npc.state = 'walk';
          if (state.animTick % 6 === 0) npc.animFrame = (npc.animFrame + 1) % 4;
        }
      });

      // Deteksi siswa pemain mencapai pintu keluar evakuasi
      if (state.player.x >= 2080) {
        sim.phase = 'completed';
        retroAudio.playPowerup();
        state.unlockedGates.add('l2_gate_gempa_sim');
        state.activeSignText =
          '[SIMULASI TANGGAP GEMPA SUKSES! ★★★★★]\n"Guncangan gempa telah berakhir! Pintu keluar ke Lapangan Evakuasi (Area 3) kini telah TERBUKA. Dekati pintu dan tekan [E] untuk menuju titik kumpul!"';
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

  // 1.5. Update NPCs & Proximity Interaction Level 2 (Bypass AI patroli santai selama simulasi gempa)
  state.nearInteractablePrompt = null;

  if (state.npcs) {
    const isSimActive = state.zone.id === 'area-simulasi-gempa' && state.simulation.phase !== 'idle';
    if (!isSimActive) {
      const interactableNpc = updateNpcsL2(state.npcs, state.player.x, state.player.y, state.animTick);
      if (interactableNpc) {
        state.nearInteractablePrompt = `Tekan [E] atau Tap untuk Bicara dengan ${interactableNpc.name}`;
        if (input.interactJustPressed && !state.activeDialogueTree) {
          input.interactJustPressed = false;
          retroAudio.playSelect();

        // Pengecekan Khusus Kak Fajar (Penguji Gerbang):
        // Jika belum membaca kedua temuan, ingatkan siswa untuk membaca materi dulu
        if (interactableNpc.type === 'kak_fajar') {
          const hasPrep = state.discoveredPoints.has('l2_q_disc_prep') || state.discoveredPoints.has('disc-earthquake-prep');
          const hasAction = state.discoveredPoints.has('l2_q_disc_action') || state.discoveredPoints.has('disc-earthquake-action');
          if (!hasPrep || !hasAction) {
            state.activeDialogueTree = {
              id: 'kak_fajar_reminder',
              title: 'Kesiapan Ujian bersama Kak Fajar',
              startNodeId: 'remind_1',
              npcSpeakerId: 'kak_fajar',
              nodes: {
                remind_1: {
                  id: 'remind_1',
                  speakerId: 'kak_fajar',
                  text: 'Halo penjelajah! Kamu perlu mempelajari materi Tas Siaga 72 Jam bersama Bu Rahma dan Simulasi Aksi bersama Pak Surya terlebih dahulu sebelum menempuh evaluasi Teka-Teki Silang ini!',
                  expression: 'normal',
                },
              },
            };
            return;
          }
        }

        // Pengecekan Khusus Komandan Satria (Penguji Evaluasi Pascabencana Area 3):
        // Jika belum membaca kedua modul mitigasi lapangan, ingatkan siswa untuk belajar dulu
        if (interactableNpc.type === 'komandan_satria') {
          const hasSafety = state.discoveredPoints.has('disc-post-safety');
          const hasCoord = state.discoveredPoints.has('disc-post-coordination');
          if (!hasSafety || !hasCoord) {
            state.activeDialogueTree = {
              id: 'satria_reminder',
              title: 'Kesiapan Evaluasi bersama Komandan Satria',
              startNodeId: 'remind_1',
              npcSpeakerId: 'komandan_satria',
              nodes: {
                remind_1: {
                  id: 'remind_1',
                  speakerId: 'komandan_satria',
                  text: 'Tunggu dulu, Rekan Siswa! Catatan posko menunjukkan kamu belum mempelajari seluruh modul mitigasi di lapangan.\n\nSilakan pelajari materi bersama dr. Alisa di posko medis PMI dan Pak Bambang di tenda komando terlebih dahulu sebelum menempuh evaluasi Teka-Teki Silang ini!',
                  expression: 'serious',
                },
              },
            };
            return;
          }
        }

        const tree = DIALOGUE_TREES_L2[interactableNpc.dialogueId];
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
        if (state.unlockedGates.has(obj.id)) {
          state.nearInteractablePrompt = 'Gerbang Terbuka! Lanjut ke Portal Berikutnya';
        } else {
          // Periksa apakah semua temuan geologis di area ini telah dibaca
          const areaDiscoveries = state.zone.objects.filter(o => o.type === 'discovery');
          const readCount = areaDiscoveries.filter(o => state.discoveredPoints.has(o.id)).length;
          const totalCount = areaDiscoveries.length;

          if (readCount < totalCount) {
            state.nearInteractablePrompt = `Baca Semua Temuan Geologis Dulu (${readCount}/${totalCount})!`;
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
        if (state.zone.id === 'area-lapangan-evakuasi') {
          // Area 3: Gerbang Akhir Kelulusan Level 2
          if (state.unlockedGates.has('l2_gate_pascabencana')) {
            state.nearInteractablePrompt = 'Tekan [E] untuk Menyelesaikan Seluruh Ekspedisi Level 2';
            if (input.interactJustPressed) {
              input.interactJustPressed = false;
              retroAudio.playWin();
              state.isAreaCompleted = true;
              state.activeSignText =
                '[EKSPEDISI LEVEL 2 TUNTAS! ★★★★★]\n"Selamat Taruna! Kamu telah berhasil menuntaskan seluruh 3 Zona Mitigasi Gempa Bumi:\n1. Prabencana: Kesiapsiagaan 72 Jam\n2. Tanggap Bencana: Drop-Cover-Hold On & Evakuasi\n3. Pascabencana: Titik Kumpul & Medis Darurat\n\nLevel 3: SIMULATION GAME (Action Lab Blockly & Digital Twin) kini telah TERBUKA!"';
              saveLevel2Progress(state, state.userId);
            }
          } else {
            state.nearInteractablePrompt = 'Gerbang Evakuasi Akhir Terkunci (Selesaikan Evaluasi Bersama Komandan Satria Terlebih Dahulu)';
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
            state.nearInteractablePrompt = 'Pintu Evakuasi Terkunci (Selesaikan Simulasi Gempa Bersama Bu Rahma Terlebih Dahulu)';
            if (input.interactJustPressed) {
              input.interactJustPressed = false;
              retroAudio.playError();
              state.pendingGateLocked = true;
            }
          }
        } else if (state.zone.id === 'area-mitigasi-erupsi') {
          if (state.unlockedGates.has('l2_gate_erupsi')) {
            state.nearInteractablePrompt = 'Tekan [E] untuk Menyelesaikan Seluruh Ekspedisi Level 2';
            if (input.interactJustPressed) {
              input.interactJustPressed = false;
              retroAudio.playWin();
              state.isAreaCompleted = true;
              saveLevel2Progress(state, state.userId);
            }
          } else {
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
            state.nearInteractablePrompt = 'Pintu Terkunci (Selesaikan Evaluasi TTS Bersama Kak Fajar Terlebih Dahulu)';
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
        if (state.zone.id === 'area-lapangan-evakuasi') {
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

    // 2g. Kapsul Siaga Lander di Titik Awal
    else if (obj.type === 'lander_capsule') {
      if (dist < 54) {
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
