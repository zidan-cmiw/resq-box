// ── src/app/Level2/engine/player.ts ──────────────────────────────────
// Fisika pergerakan karakter Siswa untuk Level 2: Batas Divergen
// Mendukung lompatan normal & jet thruster, berdiri di atas daratan alami & jembatan magma beku,
// serta deteksi jatuh ke jurang magma.

import { PLAYER_FRAME_W } from './sprites';
import type { ZoneConfigL2 } from './zones';
import { MAP_WIDTH_PX, MAP_HEIGHT_PX } from './zones';
import { retroAudio } from '../../../utils/retroAudio';

export interface PlayerStateL2 {
  x: number;
  y: number;
  vx: number;
  vy: number;
  dir: 'left' | 'right';
  isWalking: boolean;
  walkFrame: number;
  walkTimer: number;
  onGround: boolean;
  canDoubleJump: boolean;
  thrusterTimer: number;
  coyoteTimer: number;
  health: number; // 0 - 100
  invulnerableTimer: number; // immunity frames when damaged
  currentPlatformId: string | null;
}

// ── CONSTANTS ──
const SPEED = 3.6;
const GRAVITY = 0.42;
const JUMP_FORCE = -8.6;
const DOUBLE_JUMP_FORCE = -7.8;
const MAX_FALL = 9.5;
const COYOTE_FRAMES = 6;

// ── INPUT SYSTEM ──
export interface InputStateL2 {
  left: boolean;
  right: boolean;
  up: boolean;
  upJustPressed: boolean;
  interact: boolean;
  interactJustPressed: boolean;
}

const keys: Record<string, boolean> = {};
let interactPressedLastFrame = false;
let upPressedLastFrame = false;

export function initPlayerInputL2(): void {
  window.addEventListener('keydown', (e) => {
    if (e.code) keys[e.code] = true;
    if (e.key) keys[e.key] = true;
  });
  window.addEventListener('keyup', (e) => {
    if (e.code) keys[e.code] = false;
    if (e.key) keys[e.key] = false;
  });
}

export function readPlayerInputL2(): InputStateL2 {
  const interact = !!(
    keys['Enter'] ||
    keys['KeyE'] ||
    keys['e'] ||
    keys['E']
  );
  const justInteract = interact && !interactPressedLastFrame;
  interactPressedLastFrame = interact;

  const up = !!(
    keys['ArrowUp'] ||
    keys['KeyW'] ||
    keys['w'] ||
    keys['W'] ||
    keys['Space'] ||
    keys[' ']
  );
  const justUp = up && !upPressedLastFrame;
  upPressedLastFrame = up;

  return {
    left: !!(
      keys['ArrowLeft'] ||
      keys['KeyA'] ||
      keys['a'] ||
      keys['A']
    ) || mobileInputL2.left,
    right: !!(
      keys['ArrowRight'] ||
      keys['KeyD'] ||
      keys['d'] ||
      keys['D']
    ) || mobileInputL2.right,
    up: up || mobileInputL2.up,
    upJustPressed: justUp || mobileInputL2.upJustPressed,
    interact: interact || mobileInputL2.interact,
    interactJustPressed: justInteract || mobileInputL2.interactJustPressed,
  };
}

export const mobileInputL2 = {
  left: false,
  right: false,
  up: false,
  upJustPressed: false,
  interact: false,
  interactJustPressed: false,
};

export function setMobileControlL2(
  btn: 'left' | 'right' | 'up' | 'down' | 'jump' | 'interact',
  active: boolean
): void {
  if (btn === 'jump' || btn === 'up') {
    if (active && !mobileInputL2.up) mobileInputL2.upJustPressed = true;
    mobileInputL2.up = active;
  } else if (btn === 'interact') {
    if (active && !mobileInputL2.interact) mobileInputL2.interactJustPressed = true;
    mobileInputL2.interact = active;
  } else if (btn === 'left' || btn === 'right') {
    mobileInputL2[btn] = active;
  }
}

export function resetMobileJustPressedL2(): void {
  mobileInputL2.upJustPressed = false;
  mobileInputL2.interactJustPressed = false;
}

// ── CREATE INITIAL PLAYER ──
export function createPlayerL2(spawnX: number, spawnY: number): PlayerStateL2 {
  return {
    x: spawnX,
    y: spawnY,
    vx: 0,
    vy: 0,
    dir: 'right',
    isWalking: false,
    walkFrame: 0,
    walkTimer: 0,
    onGround: true,
    canDoubleJump: true,
    thrusterTimer: 0,
    coyoteTimer: COYOTE_FRAMES,
    health: 100,
    invulnerableTimer: 0,
    currentPlatformId: null,
  };
}

// ── GROUND & PLATFORM ELEVATION RESOLVER (SEPERTI LEVEL 1 - ANTI-TUNNELING) ──
export function getEffectiveGroundL2(
  zone: ZoneConfigL2,
  x: number,
  currentY: number,
  prevY?: number
): number {
  const maxIdx = zone.groundProfile ? zone.groundProfile.length - 1 : MAP_WIDTH_PX - 1;
  const px = Math.max(0, Math.min(maxIdx, Math.floor(x)));
  let groundY = zone.groundProfile ? zone.groundProfile[px] : 360;

  // Periksa platform / jembatan di atas jurang atau palung
  if (zone.platforms) {
    const footMargin = 10;
    for (const plat of zone.platforms) {
      if (x >= plat.x1 - footMargin && x <= plat.x2 + footMargin) {
        if (plat.y < groundY) {
          const pY = prevY !== undefined ? prevY : currentY;
          // Anti-tunneling kokoh untuk lompatan tunggal maupun double jump:
          const isStanding = Math.abs(currentY - plat.y) <= 5 || Math.abs(pY - plat.y) <= 5;
          const isCrossingFromAbove = pY <= plat.y + 8 && currentY >= plat.y - 4 && currentY <= plat.y + 28;
          const isWithinDeck = currentY >= plat.y - 2 && currentY <= plat.y + (plat.h ? plat.h + 8 : 22);

          if (isStanding || isCrossingFromAbove || isWithinDeck) {
            groundY = plat.y;
          }
        }
      }
    }
  }

  // Fallback ke landSections lama jika groundProfile belum diisi
  if (!zone.groundProfile && zone.landSections) {
    let standY = 9999;
    for (const land of zone.landSections) {
      if (
        x >= land.x - 4 &&
        x <= land.x + land.w + 4 &&
        currentY >= land.y - 6 &&
        currentY <= land.y + 14
      ) {
        if (land.y < standY) standY = land.y;
      }
    }
    if (standY < 9999) groundY = standY;
  }

  return groundY;
}

// ── UPDATE PLAYER PHYSICS ──
export function updatePlayerPhysicsL2(
  player: PlayerStateL2,
  input: InputStateL2,
  zone: ZoneConfigL2
): void {
  // 1. Horizontal Movement
  let dx = 0;
  if (input.left) {
    dx = -SPEED;
    player.dir = 'left';
    player.isWalking = true;
  } else if (input.right) {
    dx = SPEED;
    player.dir = 'right';
    player.isWalking = true;
  } else {
    player.isWalking = false;
  }

  // Animation Walk Cycle
  if (player.isWalking && player.onGround) {
    player.walkTimer++;
    if (player.walkTimer > 5) {
      player.walkTimer = 0;
      player.walkFrame = (player.walkFrame + 1) % 4;
    }
  } else {
    player.walkFrame = 0;
  }

  // Smooth slope traversal along organic terrain profile (Menghilangkan kesan kaku / ngotak-ngotak)
  if (dx !== 0) {
    const targetX = player.x + dx;
    const clampedX = Math.max(PLAYER_FRAME_W / 2 + 4, Math.min(MAP_WIDTH_PX - PLAYER_FRAME_W / 2 - 4, targetX));

    if (player.onGround) {
      const targetGroundY = getEffectiveGroundL2(zone, clampedX, player.y);
      const slopeDy = targetGroundY - player.y;

      // Turunan curam / tebing jurang (jatuh bebas)
      if (slopeDy > 8) {
        player.x = clampedX;
        player.onGround = false;
        player.vy = 0.5;
      }
      // Dinding terjal menanjak terlalu tajam (> 8px dalam 1 frame jalan)
      else if (slopeDy < -8) {
        // Terhalang tebing terjal, pemain harus melompat untuk naik
      } else {
        // Lereng landai normal: ikuti kontur tanah dengan mulus tanpa tersangkut
        player.x = clampedX;
        player.y = targetGroundY;
      }
    } else {
      player.x = clampedX;
    }
  }

  // 2. Jumping & Double Jump
  if (player.onGround) {
    player.coyoteTimer = COYOTE_FRAMES;
    player.canDoubleJump = true;
  } else {
    if (player.coyoteTimer > 0) player.coyoteTimer--;
  }

  if (input.upJustPressed) {
    if (player.onGround || player.coyoteTimer > 0) {
      // First Jump
      player.vy = JUMP_FORCE;
      player.onGround = false;
      player.coyoteTimer = 0;
      retroAudio.playSelect();
    } else if (player.canDoubleJump) {
      // Jet Thruster Double Jump
      player.vy = DOUBLE_JUMP_FORCE;
      player.canDoubleJump = false;
      player.thrusterTimer = 16;
      retroAudio.playPowerup();
    }
  }

  if (player.thrusterTimer > 0) player.thrusterTimer--;

  // 3. Gravity
  player.vy += GRAVITY;
  if (player.vy > MAX_FALL) player.vy = MAX_FALL;

  // 4. Vertical Landing Resolution
  const prevY = player.y;
  player.y += player.vy;
  const currentGroundY = getEffectiveGroundL2(zone, player.x, player.y, prevY);

  if (player.vy >= 0 && (player.y >= currentGroundY || (prevY <= currentGroundY + 6 && player.y >= currentGroundY - 4))) {
    player.y = currentGroundY;
    player.vy = 0;
    player.onGround = true;
  } else {
    player.onGround = false;
  }

  // 6. Check Chasm Magma / Deep Trench Hazards (Hanya kena damage jika jatuh ke dasar jurang)
  for (const haz of zone.chasmHazards) {
    // 6a. Pemain aman sepenuhnya saat berpijak atau melintas di atas platform/jembatan
    let isSafeOnBridge = false;
    if (zone.platforms) {
      for (const plat of zone.platforms) {
        if (
          player.x >= plat.x1 - 6 &&
          player.x <= plat.x2 + 6 &&
          player.y <= plat.y + 16
        ) {
          isSafeOnBridge = true;
          break;
        }
      }
    }
    if (isSafeOnBridge) continue;

    // 6b. Pemain hanya terkena damage jika benar-benar terjatuh ke dasar palung laut (y >= 420) atau ke kolam magma (y >= 430)
    const hazardThresholdY = haz.type === 'deep_trench' ? 420 : haz.y - 10;
    if (
      player.x >= haz.x &&
      player.x <= haz.x + haz.w &&
      player.y >= hazardThresholdY
    ) {
      if (player.invulnerableTimer === 0) {
        player.health = Math.max(0, player.health - haz.damage);
        player.invulnerableTimer = 50;
        player.vy = -7.5; // High bounce upward out of hazard
        retroAudio.playExplosion();

        // Respawn if depleted
        if (player.health <= 0) {
          player.health = 100;
          player.x = zone.playerSpawnX;
          player.y = zone.playerSpawnY;
          player.vx = 0;
          player.vy = 0;
        }
      }
    }
  }

  // 7. Deep Pit Fall Check
  if (player.y > MAP_HEIGHT_PX + 20) {
    player.health = Math.max(0, player.health - 25);
    player.x = zone.playerSpawnX;
    player.y = zone.playerSpawnY;
    player.vx = 0;
    player.vy = 0;
    player.invulnerableTimer = 50;
    retroAudio.playExplosion();

    if (player.health <= 0) {
      player.health = 100;
    }
  }

  // 8. Invulnerability cooldown
  if (player.invulnerableTimer > 0) player.invulnerableTimer--;
}
