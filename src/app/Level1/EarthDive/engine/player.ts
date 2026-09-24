// ── src/app/Level1/EarthDive/engine/player.ts ─────────────────────────────
// Karakter pemain & fisika pergerakan lereng mulus (Smooth Slope Traversal ala Terraria).
// Mendukung jalan di atas kontur gunung bergelombang, jembatan kayu, perancah,
// lompatan ganda dengan pendorong jet suit, dan deteksi langit-langit gua.

import { TILE, PLAYER_FRAME_W, PLAYER_FRAME_H } from './sprites';
import type { ZoneConfig } from './zones';
import { MAP_WIDTH_PX } from './zones';
import { retroAudio } from '../../../../utils/retroAudio';

export interface PlayerState {
  x: number;        // pixel position (center of character)
  y: number;        // pixel position (bottom of feet)
  vx: number;       // velocity X
  vy: number;       // velocity Y
  dir: 'left' | 'right';
  isWalking: boolean;
  walkFrame: number;
  walkTimer: number;
  onGround: boolean;
  width: number;
  height: number;
  canDoubleJump: boolean;
  thrusterTimer: number; // jet booster flame particle timer
  coyoteTimer: number;
  isJumping: boolean;
  isFalling: boolean;
  landingSquashTimer: number; // impact compression frames upon landing
  health: number; // 0 - 100
  invulnerableTimer: number; // invulnerability cooldown frames after damage
  jumpZ?: number; // Top-down elevation / height off ground for bird's-eye jumping
  jumpZVelocity?: number;
}

// ── CONSTANTS ──
const SPEED = 3.6;
const GRAVITY = 0.44;
const JUMP_FORCE = -8.8; // High leap (~88px clearance)
const DOUBLE_JUMP_FORCE = -7.8; // Explorer suit jet booster (~70px extra boost)
const MAX_FALL = 9.0;
const WALK_ANIM_SPEED = 6;
const COYOTE_FRAMES = 6;
const JUMP_BUFFER_FRAMES = 6;

// ── INPUT STATE ──
export interface InputState {
  left: boolean;
  right: boolean;
  up: boolean;
  upJustPressed: boolean;
  down: boolean;
  jump: boolean;
  jumpJustPressed: boolean;
  interact: boolean;
  interactJustPressed: boolean;
}

const keys: Record<string, boolean> = {};
let interactPressedLastFrame = false;
let upPressedLastFrame = false;
let jumpPressedLastFrame = false;
let jumpBuffer = 0;

export function initInput(): void {
  window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
  });
  window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
  });
  window.addEventListener('blur', () => {
    resetInputKeys();
  });
}

export function resetInputKeys(): void {
  for (const k in keys) {
    delete keys[k];
  }
  interactPressedLastFrame = false;
  upPressedLastFrame = false;
  jumpPressedLastFrame = false;
  jumpBuffer = 0;
  mobileInput.left = false;
  mobileInput.right = false;
  mobileInput.up = false;
  mobileInput.upJustPressed = false;
  mobileInput.down = false;
  mobileInput.jump = false;
  mobileInput.jumpJustPressed = false;
  mobileInput.interact = false;
  mobileInput.interactJustPressed = false;
}

export function readInput(): InputState {
  const interact = !!(keys['Enter'] || keys['KeyE']);
  const justPressed = interact && !interactPressedLastFrame;
  interactPressedLastFrame = interact;

  const up = !!(keys['ArrowUp'] || keys['KeyW']);
  const upJust = up && !upPressedLastFrame;
  upPressedLastFrame = up;

  // Space key is strictly for jumping
  const jump = !!keys['Space'];
  const jumpJust = jump && !jumpPressedLastFrame;
  jumpPressedLastFrame = jump;

  return {
    left: !!(keys['ArrowLeft'] || keys['KeyA']),
    right: !!(keys['ArrowRight'] || keys['KeyD']),
    up,
    upJustPressed: upJust,
    down: !!(keys['ArrowDown'] || keys['KeyS']),
    jump,
    jumpJustPressed: jumpJust,
    interact,
    interactJustPressed: justPressed,
  };
}

// ── MOBILE CONTROLS ──
export const mobileInput: InputState = {
  left: false,
  right: false,
  up: false,
  upJustPressed: false,
  down: false,
  jump: false,
  jumpJustPressed: false,
  interact: false,
  interactJustPressed: false,
};

let mobileInteractPrev = false;
let mobileUpPrev = false;
let mobileJumpPrev = false;

export function setMobileButton(btn: 'left' | 'right' | 'up' | 'down' | 'jump' | 'interact', active: boolean): void {
  mobileInput[btn] = active;
  if (btn === 'interact') {
    mobileInput.interactJustPressed = active && !mobileInteractPrev;
    mobileInteractPrev = active;
  }
  if (btn === 'up') {
    mobileInput.upJustPressed = active && !mobileUpPrev;
    mobileUpPrev = active;
  }
  if (btn === 'jump') {
    mobileInput.jumpJustPressed = active && !mobileJumpPrev;
    mobileJumpPrev = active;
  }
}

export function mergeInput(kb: InputState): InputState {
  return {
    left: kb.left || mobileInput.left,
    right: kb.right || mobileInput.right,
    up: kb.up || mobileInput.up,
    upJustPressed: kb.upJustPressed || mobileInput.upJustPressed,
    down: kb.down || mobileInput.down,
    jump: kb.jump || mobileInput.jump,
    jumpJustPressed: kb.jumpJustPressed || mobileInput.jumpJustPressed,
    interact: kb.interact || mobileInput.interact,
    interactJustPressed: kb.interactJustPressed || mobileInput.interactJustPressed,
  };
}

// ── PLAYER FACTORY ──
export function createPlayer(spawnColOrX: number, spawnRowOrY: number): PlayerState {
  const x = spawnColOrX > 40 ? spawnColOrX : spawnColOrX * TILE + TILE / 2;
  const y = spawnRowOrY > 20 ? spawnRowOrY : spawnRowOrY * TILE;

  return {
    x,
    y,
    vx: 0,
    vy: 0,
    dir: 'right',
    isWalking: false,
    walkFrame: 0,
    walkTimer: 0,
    onGround: true,
    width: PLAYER_FRAME_W,
    height: PLAYER_FRAME_H,
    canDoubleJump: true,
    thrusterTimer: 0,
    coyoteTimer: 0,
    isJumping: false,
    isFalling: false,
    landingSquashTimer: 0,
    health: 100,
    invulnerableTimer: 0,
    jumpZ: 0,
    jumpZVelocity: 0,
  };
}

// ── GROUND & PLATFORM ELEVATION RESOLVER ──
export function getEffectiveGround(zone: ZoneConfig, x: number, currentY: number, prevY?: number): number {
  if (zone.id === 'transform') {
    return currentY;
  }

  const maxIdx = zone.groundProfile ? zone.groundProfile.length - 1 : MAP_WIDTH_PX - 1;
  const px = Math.max(0, Math.min(maxIdx, Math.floor(x)));
  let groundY = zone.groundProfile ? zone.groundProfile[px] : 360;

  // Periksa apakah pemain berdiri atau mendarat di atas platform (jembatan gantung, pilar basal, perancah)
  if (zone.platforms) {
    const footMargin = 10; // Lebar tapak kaki pemain (PLAYER_FRAME_W / 2) agar tidak tergelincir di tepian
    for (const plat of zone.platforms) {
      if (x >= plat.x1 - footMargin && x <= plat.x2 + footMargin) {
        if (plat.y < groundY) {
          const pY = prevY !== undefined ? prevY : currentY;
          // Anti-tunneling kokoh untuk lompatan tunggal maupun double jump berkecepatan tinggi:
          // 1. Sedang berpijak atau bergerak di atas platform
          const isStanding = Math.abs(currentY - plat.y) <= 5 || Math.abs(pY - plat.y) <= 5;
          // 2. Menembus/melewati garis permukaan platform dari atas ke bawah dalam 1 frame jatuh bebas
          const isCrossingFromAbove = pY <= plat.y + 8 && currentY >= plat.y - 4 && currentY <= plat.y + 28;
          // 3. Berada di dalam batas ketebalan slab platform
          const isWithinDeck = currentY >= plat.y - 2 && currentY <= plat.y + (plat.h ? plat.h + 8 : 22);

          if (isStanding || isCrossingFromAbove || isWithinDeck) {
            groundY = plat.y;
          }
        }
      }
    }
  }

  return groundY;
}

// ── UPDATE PLAYER PHYSICS & INPUT ──
export function updatePlayer(player: PlayerState, input: InputState, zone: ZoneConfig): void {
  // ── MODE PERGERAKAN TOP-DOWN (AREA 8: BATAS TRANSFORM) ──
  if (zone.id === 'transform') {
    let dx = 0;
    let dy = 0;

    if (input.left) {
      dx = -SPEED;
      player.dir = 'left';
    } else if (input.right) {
      dx = SPEED;
      player.dir = 'right';
    }

    if (input.up) {
      dy = -SPEED;
    } else if (input.down) {
      dy = SPEED;
    }

    // Fisika Lompatan Top-Down (Jump Z Elevation)
    player.jumpZ = player.jumpZ || 0;
    player.jumpZVelocity = player.jumpZVelocity || 0;

    const wantsJump = input.jumpJustPressed || (input.jump && player.jumpZ === 0);
    if (wantsJump && player.jumpZ === 0) {
      player.jumpZVelocity = 5.6; // Dorongan awal ke atas
      player.isJumping = true;
      player.onGround = false;
    }

    if (player.jumpZ > 0 || player.jumpZVelocity > 0) {
      player.jumpZ += player.jumpZVelocity;
      player.jumpZVelocity -= 0.36; // Gravitasi Z
      if (player.jumpZ <= 0) {
        player.jumpZ = 0;
        player.jumpZVelocity = 0;
        player.isJumping = false;
        player.onGround = true;
        player.landingSquashTimer = 4;
      }
    } else {
      player.isJumping = false;
      player.onGround = true;
    }

    player.isWalking = dx !== 0 || dy !== 0;
    player.vx = dx;
    player.vy = dy;

    // Batasi pergerakan di padang gurun
    const minX = player.width / 2 + 20;
    const maxX = zone.cols * TILE - player.width / 2 - 20;
    const minY = 90;
    const maxY = 410;

    const targetX = Math.max(minX, Math.min(maxX, player.x + dx));
    let targetY = Math.max(minY, Math.min(maxY, player.y + dy));

    // ── OBSTACLE PATAHAN SESAR (FAULT FISSURE COLLISION) ──
    // Celah retakan sesar membentang di tengah Y = 240 (tepi utara: 228, tepi selatan: 252).
    // Pemain yang berjalan di tanah (jumpZ <= 2) TIDAK BISA menembus atau lewat langsung!
    // Pemain WAJIB MELOMPAT (jumpZ > 2) untuk melompati lubang patahan.
    const faultNorthLip = 228;
    const faultSouthLip = 252;
    const isAirborne = (player.jumpZ || 0) > 2;

    if (!isAirborne) {
      // Pemain di Lempeng Pasifik (Utara) tertahan di bibir utara celah
      if (player.y <= faultNorthLip && targetY > faultNorthLip) {
        targetY = faultNorthLip;
      }
      // Pemain di Lempeng Amerika Utara (Selatan) tertahan di bibir selatan celah
      else if (player.y >= faultSouthLip && targetY < faultSouthLip) {
        targetY = faultSouthLip;
      }
      // Jika mendarat atau berada di dalam celah, dorong ke tepi terdekat
      else if (player.y > faultNorthLip && player.y < faultSouthLip) {
        targetY = player.y < 240 ? faultNorthLip : faultSouthLip;
      }
    }

    player.x = targetX;
    player.y = targetY;

    // Animasi langkah kaki
    if (player.isWalking) {
      player.walkTimer++;
      if (player.walkTimer >= WALK_ANIM_SPEED) {
        player.walkTimer = 0;
        player.walkFrame = (player.walkFrame + 1) % 4;
      }
    } else {
      player.walkTimer = 0;
      player.walkFrame = 0;
    }

    if (player.landingSquashTimer > 0) {
      player.landingSquashTimer--;
    }

    if (player.invulnerableTimer > 0) {
      player.invulnerableTimer--;
    }
    return;
  }

  // 1. Horizontal movement
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

  // Smooth slope traversal & realistic edge detachment (no instant teleporting)
  if (dx !== 0) {
    const targetX = player.x + dx;
    const clampedX = Math.max(player.width / 2 + 8, Math.min(zone.cols * TILE - player.width / 2 - 8, targetX));

    if (player.onGround) {
      const currentGroundY = getEffectiveGround(zone, player.x, player.y, player.y);
      const targetGroundY = getEffectiveGround(zone, clampedX, player.y, player.y);
      const slopeDy = targetGroundY - currentGroundY;

      // Jika pemain sedikit melesak di bawah tanah karena deformasi medan dinamis / pendaratan,
      // pulihkan posisi pijakan kembali ke permukaan tanah secara mulus
      if (player.y > currentGroundY + 1) {
        player.y = currentGroundY;
      }

      // Jurang / turunan curam (> 10px dalam 1 frame jalan)
      if (slopeDy > 10) {
        // Lepaskan kontak pijakan dengan tanah secara alami, masuk ke fisika jatuh bebas (freefall)
        player.x = clampedX;
        player.onGround = false;
        player.isFalling = true;
        player.vy = 0.5;
      }
      // Dinding / tebing terjal menanjak (> 10px dalam 1 frame jalan)
      else if (slopeDy < -10) {
        // Terhalang tebing terjal, pemain tidak bisa menembus dan harus melompat
      } else {
        // Lereng landai normal: ikuti kontur tanah dengan mulus tanpa tersangkut
        player.x = clampedX;
        player.y = targetGroundY;
      }
    } else {
      player.x = clampedX;
    }
  }

  // 2. Coyote time & double jump refresh
  if (player.onGround) {
    player.coyoteTimer = COYOTE_FRAMES;
    player.canDoubleJump = true;
  } else {
    if (player.coyoteTimer > 0) player.coyoteTimer--;
  }

  // 3. Jump buffer
  const jumpTriggered = input.upJustPressed || input.jumpJustPressed;
  if (jumpTriggered) {
    jumpBuffer = JUMP_BUFFER_FRAMES;
  } else if (jumpBuffer > 0) {
    jumpBuffer--;
  }

  // Thruster flame timer
  if (player.thrusterTimer > 0) {
    player.thrusterTimer--;
  }

  // 4. Gravity
  player.vy += GRAVITY;
  if (player.vy > MAX_FALL) player.vy = MAX_FALL;

  // 5. Jump triggers
  // Ground jump / Coyote jump
  if (jumpBuffer > 0 && (player.onGround || player.coyoteTimer > 0)) {
    player.vy = JUMP_FORCE;
    player.onGround = false;
    player.isJumping = true;
    player.isFalling = false;
    player.coyoteTimer = 0;
    jumpBuffer = 0;
  }
  // Double jump (jet booster)
  else if (jumpTriggered && !player.onGround && player.coyoteTimer === 0 && player.canDoubleJump) {
    player.vy = DOUBLE_JUMP_FORCE;
    player.canDoubleJump = false;
    player.isJumping = true;
    player.isFalling = false;
    player.thrusterTimer = 16;
    jumpBuffer = 0;
  }

  // Variable jump height (lepaskan tombol loncat untuk loncat pendek)
  const jumpHolding = input.up || input.jump;
  if (!jumpHolding && player.vy < -2.5) {
    player.vy *= 0.65;
  }

  // 6. Vertical movement & ceiling collision
  const prevY = player.y;
  const nextY = player.y + player.vy;
  const maxCIdx = zone.ceilingProfile ? zone.ceilingProfile.length - 1 : MAP_WIDTH_PX - 1;
  const cY = zone.ceilingProfile ? zone.ceilingProfile[Math.max(0, Math.min(maxCIdx, Math.floor(player.x)))] : 0;

  if (cY > 0 && nextY - player.height <= cY) {
    // Benturan kepala dengan atap langit-langit gua
    player.y = cY + player.height;
    player.vy = 0;
  } else {
    player.y = nextY;
  }

  // 7. Ground landing collision (HANYA mendarat saat bergerak turun vy >= 0)
  const effectiveGround = getEffectiveGround(zone, player.x, player.y, prevY);
  const wasInAir = !player.onGround;

  if (player.vy >= 0 && (player.y >= effectiveGround || (prevY <= effectiveGround + 6 && player.y >= effectiveGround - 4))) {
    player.y = effectiveGround;
    if (wasInAir && player.vy > 2.0) {
      // Landing impact compression (squash)
      player.landingSquashTimer = 6;
    }
    player.vy = 0;
    player.onGround = true;
    player.isJumping = false;
    player.isFalling = false;
  } else {
    // Sedang berada di udara bebas (melompat naik atau jatuh turun)
    if (player.y < effectiveGround - 1) {
      player.onGround = false;
      player.isJumping = player.vy < -0.5;
      player.isFalling = player.vy >= -0.5;
    }
  }

  // Decay landing squash
  if (player.landingSquashTimer > 0) {
    player.landingSquashTimer--;
  }

  // 8. Walk animation cycle
  if (player.isWalking && player.onGround) {
    player.walkTimer++;
    if (player.walkTimer >= WALK_ANIM_SPEED) {
      player.walkTimer = 0;
      player.walkFrame = (player.walkFrame + 1) % 4;
    }
  } else {
    player.walkFrame = 0;
    player.walkTimer = 0;
  }

  // 9. Hazard Collision Check (e.g. Lava / Magma Chasms)
  if (zone.hazards) {
    for (const haz of zone.hazards) {
      // Pemain aman sepenuhnya jika sedang berada di atas platform / jembatan
      let isSafeOnPlatform = false;
      if (zone.platforms) {
        for (const plat of zone.platforms) {
          if (
            player.x >= plat.x1 - 10 &&
            player.x <= plat.x2 + 10 &&
            player.y <= plat.y + 16
          ) {
            isSafeOnPlatform = true;
            break;
          }
        }
      }
      if (isSafeOnPlatform) continue;

      if (
        player.x >= haz.x &&
        player.x <= haz.x + haz.w &&
        player.y >= haz.y
      ) {
        if (player.invulnerableTimer === 0) {
          player.health = Math.max(0, player.health - haz.damage);
          player.invulnerableTimer = 50;
          player.vy = -7.5; // High bounce upward out of lava
          retroAudio.playExplosion();

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
  }

  // 10. Deep Pit & Divergent Rift Magma Fall Check
  const isDivergentMagmaFall =
    zone.id === 'divergent' && player.x >= 390 && player.x <= 510 && player.y > 384;

  if (player.y > 440 || isDivergentMagmaFall) {
    player.health = 100;
    player.x = zone.playerSpawnX;
    player.y = zone.playerSpawnY;
    player.vx = 0;
    player.vy = 0;
    player.invulnerableTimer = 60;
    retroAudio.playExplosion();
  }

  // 11. Invulnerability cooldown
  if (player.invulnerableTimer > 0) {
    player.invulnerableTimer--;
  }
}

// ── SPRITE FRAME INDEX ──
export function getPlayerSpriteFrame(player: PlayerState): number {
  if (!player.onGround) {
    // Air poses: Frame 6 (Jump rising), Frame 7 (Falling downward)
    if (player.vy < -0.5) return 6;
    if (player.vy > 0.5) return 7;
    return 6;
  }
  if (player.isWalking) {
    return player.walkFrame;
  }
  return 4; // Idle
}

// ── PROXIMITY CHECK (FOR OBJECTS & INTERACTION) ──
export function isNearObject(player: PlayerState, objX: number, objY: number, rangeTiles: number = 1.8): boolean {
  const ox = objX >= 30 ? objX : objX * TILE + TILE / 2;
  const oy = objY >= 20 ? objY : objY * TILE + TILE / 2;
  const px = player.x;
  const py = player.y - player.height / 2;
  const dist = Math.sqrt((px - ox) ** 2 + (py - oy) ** 2);
  return dist < rangeTiles * TILE;
}
