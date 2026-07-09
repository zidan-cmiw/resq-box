// ── npc.ts ─────────────────────────────────────────────────────────
// Kelas NPC — warga desa yang akan bergerak otomatis menuju
// Titik Kumpul saat kondisi darurat terpicu (lampu merah / sirine).

import { findPath } from './pathfinder';
import { SAFE_ZONE_TILES } from '../mapData';

export type NPCState = 'idle' | 'panic' | 'moving' | 'safe' | 'blocked';

export interface NPC {
  id: number;
  row: number;        // Current grid position (float for smooth movement)
  col: number;
  spawnRow: number;   // Original spawn point
  spawnCol: number;
  targetRow: number;  // Current wander target
  targetCol: number;
  path: [number, number][];
  pathIndex: number;
  state: NPCState;
  color: string;
  panicTimer: number; // frames to wait before starting evac
  wanderTimer: number; // wait time between wanders
  currentEmote: string | null;
  emoteTimer: number; // frames remaining to show emote
  emoteCooldown: number; // frames before next possible emote
}

const NPC_COLORS = [
  '#60a5fa', '#f472b6', '#34d399', '#fbbf24',
  '#a78bfa', '#f87171', '#4ade80', '#fb923c',
  '#22d3ee', '#e879f9',
];

export function createNPCs(spawnPoints: [number, number][]): NPC[] {
  return spawnPoints.map(([row, col], i) => ({
    id: i,
    row, col,
    spawnRow: row, spawnCol: col,
    targetRow: row + (Math.random() - 0.5), 
    targetCol: col + (Math.random() - 0.5),
    path: [], pathIndex: 0,
    state: 'idle' as NPCState,
    color: NPC_COLORS[i % NPC_COLORS.length],
    panicTimer: Math.floor(Math.random() * 60) + 10,
    wanderTimer: Math.floor(Math.random() * 60),
    currentEmote: null,
    emoteTimer: 0,
    emoteCooldown: Math.floor(Math.random() * 120),
  }));
}

export function updateNPCs(
  npcs: NPC[],
  isEmergency: boolean,
  gateOpen: boolean,
  _dt: number,
): NPC[] {
  return npcs.map((npc) => {
    // --- Emote Logic ---
    let newEmote = npc.currentEmote;
    let newEmoteTimer = npc.emoteTimer;
    let newEmoteCooldown = npc.emoteCooldown;

    if (newEmoteTimer > 0) {
      newEmoteTimer--;
      if (newEmoteTimer <= 0) {
        newEmote = null;
        newEmoteCooldown = 120 + Math.random() * 180; // wait 2-5 seconds
      }
    } else {
      newEmoteCooldown--;
      if (newEmoteCooldown <= 0) {
        // Trigger a new emote!
        newEmoteTimer = 90; // show for 1.5 seconds
        if (npc.state === 'idle' || npc.state === 'safe') {
          newEmote = Math.random() > 0.5 ? '🙂' : '💬';
        } else if (npc.state === 'panic' || npc.state === 'moving') {
          newEmote = Math.random() > 0.5 ? '😱' : '⚠️';
        } else if (npc.state === 'blocked') {
          newEmote = Math.random() > 0.5 ? '🤬' : '❌';
        }
      }
    }

    const n = { ...npc, currentEmote: newEmote, emoteTimer: newEmoteTimer, emoteCooldown: newEmoteCooldown };

    // Idle Wandering
    if (!isEmergency && n.state === 'idle') {
      if (n.wanderTimer > 0) {
        return { ...n, wanderTimer: n.wanderTimer - 1 };
      }

      if (n.path && n.path.length > 0) {
        if (n.pathIndex >= n.path.length) {
          // Arrived at wander destination, wait a bit before moving again
          return { ...n, path: [], wanderTimer: 120 + Math.random() * 180 };
        }

        const [tr, tc] = n.path[n.pathIndex];
        const speed = 0.02; // Slower than emergency run
        const dr = tr - n.row;
        const dc = tc - n.col;
        const dist = Math.sqrt(dr * dr + dc * dc);

        if (dist < speed) {
          return { ...n, row: tr, col: tc, pathIndex: n.pathIndex + 1 };
        } else {
          return { ...n, row: n.row + (dr / dist) * speed, col: n.col + (dc / dist) * speed };
        }
      } else {
        // Pick a new random walkable tile in the village
        // Village is approx rows 16..30, cols 12..30
        let targetR = Math.floor(16 + Math.random() * 14);
        let targetC = Math.floor(12 + Math.random() * 18);
        
        // Find path
        let newPath = findPath(Math.round(n.row), Math.round(n.col), targetR, targetC, gateOpen);
        if (newPath.length > 0) {
          return { ...n, path: newPath, pathIndex: 1, wanderTimer: 0 };
        } else {
          // If no path found (e.g. tile is not walkable), wait briefly and retry
          return { ...n, wanderTimer: 30, path: [] };
        }
      }
    }

    // --- Movement Logic ---
    if (n.state === 'safe') {
      if (n.wanderTimer > 0) {
        return { ...n, wanderTimer: n.wanderTimer - 1 };
      }
      const speed = 0.015;
      const dr = n.targetRow - n.row;
      const dc = n.targetCol - n.col;
      const dist = Math.sqrt(dr * dr + dc * dc);
      
      if (dist > speed) {
        return { ...n, row: n.row + (dr/dist)*speed, col: n.col + (dc/dist)*speed };
      } else {
        // Pick random target inside their designated safe zone tile
        return {
          ...n,
          targetRow: n.spawnRow + (Math.random() - 0.5) * 1.5,
          targetCol: n.spawnCol + (Math.random() - 0.5) * 1.5,
          wanderTimer: 30 + Math.random() * 90
        };
      }
    }

    // Emergency triggered — calculate evacuation path
    if (isEmergency && n.state === 'idle') {
      return { ...n, state: 'panic' as NPCState };
    }

    if (n.state === 'panic') {
      // Countdown before running
      if (n.panicTimer > 0) {
        return { ...n, panicTimer: n.panicTimer - 1 };
      }
      // Find nearest safe zone
      let bestPath: [number, number][] = [];
      let bestLen = Infinity;
      for (const [sr, sc] of SAFE_ZONE_TILES) {
        const path = findPath(Math.round(n.row), Math.round(n.col), sr, sc, gateOpen);
        if (path.length > 0 && path.length < bestLen) {
          bestLen = path.length;
          bestPath = path;
        }
      }

      if (bestPath.length === 0) {
        // Gate is closed — NPC is blocked
        return { ...n, state: 'blocked' as NPCState, path: [], pathIndex: 0 };
      }
      return { ...n, state: 'moving' as NPCState, path: bestPath, pathIndex: 1 };
    }

    if (n.state === 'blocked') {
      // Re-attempt if gate opens
      if (gateOpen) {
        return { ...n, state: 'panic' as NPCState, panicTimer: 5 };
      }
      return n;
    }

    if (n.state === 'moving') {
      if (n.pathIndex >= n.path.length) {
        // Arrived at Safe Zone! Pick a random safe zone tile to spread out into.
        const randomSafeTile = SAFE_ZONE_TILES[Math.floor(Math.random() * SAFE_ZONE_TILES.length)];
        return { 
          ...n, 
          state: 'safe' as NPCState,
          spawnRow: randomSafeTile[0],
          spawnCol: randomSafeTile[1],
          targetRow: randomSafeTile[0] + (Math.random() - 0.5),
          targetCol: randomSafeTile[1] + (Math.random() - 0.5),
          wanderTimer: 0
        };
      }
      const [tr, tc] = n.path[n.pathIndex];
      const speed = 0.04; // tiles per frame
      const dr = tr - n.row;
      const dc = tc - n.col;
      const dist = Math.sqrt(dr * dr + dc * dc);

      if (dist < speed) {
        // Reached next waypoint — advance path index
        const nextIndex = n.pathIndex + 1;
        return {
          ...n,
          row: tr,
          col: tc,
          pathIndex: nextIndex,
        };
      } else {
        // Move towards waypoint
        return {
          ...n,
          row: n.row + (dr / dist) * speed,
          col: n.col + (dc / dist) * speed,
        };
      }
    }

    return n;
  });
}
