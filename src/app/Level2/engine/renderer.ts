// ── src/app/Level2/engine/renderer.ts ────────────────────────────────
// Multi-Layer Canvas Renderer untuk Level 2: Batas Divergen & Pecahnya Pangea
// Menampilkan:
// - Latar belakang atmosfer retakan vulkanik (siluet gunung celah, asap, retakan tebing menyala)
// - Daratan alami basalt & jembatan daratan baru dari magma yang membeku
// - Jurang-jurang magma aktif di dasar celah sempit
// - Kapsul Siaga, Catatan Geologis ("i"), Temuan Geologis, Kristal, dan Gerbang TTS
// - Karakter Siswa Kustom (Sama persis dengan Level 1)

import type { GameStateL2, AreaTransitionBannerL2 } from './gameEngine';
import { MAP_WIDTH_PX, MAP_HEIGHT_PX } from './zones';
import {
  drawStudentCharacter,
  drawChasmMagma,
  drawClassroomFloorRubble,
  drawCrystal,
  drawInfoSign,
  drawDiscoveryTotem,
  getOrganicTerrainCacheL2,
  drawPlatformL2,
  drawSeismicVaultGate,
  PLAYER_FRAME_W,
  PLAYER_FRAME_H,
} from './sprites';
import {
  drawNpcWorldL2,
  drawMascotWorldL2,
  drawStudentSittingInDesk,
  drawStudentCoverUnderDesk,
  drawTeacherCoverUnderDesk,
  drawStudentEvacuatingPose,
  drawTeacherEvacuatingPose,
  drawPanicSpeechBubble,
  drawPlayerStunnedByRockImpact,
} from './npcSpritesL2';
import { CLASSROOM_STUDENTS_L2 } from './npcManagerL2';
import type { CustomAvatarConfig } from '../../../store/teacherStore';

export function renderTectonicGameL2(
  ctx: CanvasRenderingContext2D,
  state: GameStateL2,
  viewW: number,
  viewH: number,
  avatarConfig?: CustomAvatarConfig
): void {
  // ── 0. RESPONSIVE VIEWPORT SCALE (MATCH 480PX GAMEPLAY HEIGHT) ──
  const scale = Math.max(0.5, viewH / MAP_HEIGHT_PX);
  const effectiveW = viewW / scale;
  const effectiveH = MAP_HEIGHT_PX;

  // ── 1. CAMERA OFFSET ──
  const targetCamX = state.player.x - effectiveW / 2;
  const camX = Math.max(0, Math.min(MAP_WIDTH_PX - effectiveW, targetCamX));

  ctx.clearRect(0, 0, viewW, viewH);

  ctx.save();
  ctx.scale(scale, scale);

  // Efek guncangan kamera dinamis saat gempa (Earthquake Camera Shake)
  let camShakeX = 0;
  let camShakeY = 0;
  if (state.simulation && state.simulation.shakeIntensity > 0) {
    camShakeX = (Math.random() - 0.5) * state.simulation.shakeIntensity;
    camShakeY = (Math.random() - 0.5) * state.simulation.shakeIntensity;
  }
  ctx.translate(-camX + camShakeX, camShakeY);

  // ── 2. SKY & BACKGROUND (RUANG KELAS, SIMULASI, LAPANGAN EVAKUASI, & MERAPI) ──
  if (state.zone.id === 'area-lapangan-evakuasi') {
    drawAssemblyFieldAtmosphere(ctx, camX, effectiveW, effectiveH, state.animTick);
  } else if (state.zone.id === 'area-simulasi-gempa') {
    drawClassroomAtmosphereArea2(ctx, camX, effectiveW, effectiveH, state);
  } else if (state.zone.id === 'area-mitigasi-erupsi') {
    drawVolcanoMitigationAtmosphere(ctx, camX, effectiveW, effectiveH, state.animTick);
  } else {
    drawClassroomAtmosphere(ctx, camX, effectiveW, effectiveH, state.animTick);
  }

  // ── 3. CHASM HAZARDS (RETAKAN LANTAI KELAS ATAU MAGMA AKTIF) ──
  for (const haz of state.zone.chasmHazards) {
    if (state.zone.id === 'area-mitigasi-gempa' || state.zone.id === 'area-lapangan-evakuasi') {
      drawClassroomFloorRubble(ctx, haz.x, haz.y, haz.w, haz.h, state.animTick);
    } else {
      drawChasmMagma(ctx, haz.x, haz.y, haz.w, haz.h, state.animTick);
    }
  }

  // ── 4. KONTUR MEDAN ORGANIK KONTINU / LANTAI KERAMIK / LAPANGAN RUMPUT ──
  if (state.zone.id === 'area-lapangan-evakuasi') {
    drawAssemblyFieldGrassFloor(ctx, camX, effectiveW);
  } else if (state.zone.id === 'area-simulasi-gempa') {
    drawWhiteClassroomTileFloor(ctx, camX, effectiveW);
  } else {
    ctx.drawImage(getOrganicTerrainCacheL2(state.zone), 0, 0);
  }

  // Prop Dekorasi Lantai Ruang Kelas (Penghapus, Bolpoin, Tempat Pensil, Penggaris, Pesawat Kertas)
  if (state.zone.id === 'area-mitigasi-gempa') {
    drawClassroomFloorProps(ctx, camX, effectiveW, state.animTick);
  }

  // Platform & Jembatan Kerak Baru (Magma Beku) / Karang Andesit
  if (state.zone.platforms) {
    for (const plat of state.zone.platforms) {
      drawPlatformL2(ctx, plat, state.animTick);
    }
  }

  // ── 5. MAP OBJECTS (CATATAN GEOLOGIS, DISCOVERIES, GATES, PINTU KELAS) ──
  for (const obj of state.zone.objects) {
    if (obj.type === 'crystal') {
      if (!state.collectedCrystals.has(obj.id)) {
        drawCrystal(ctx, obj.px, obj.py, state.animTick);
      }
    } else if (obj.type === 'info_sign') {
      drawInfoSign(ctx, obj.px, obj.py);
    } else if (obj.type === 'discovery') {
      drawDiscoveryTotem(ctx, obj.px, obj.py, state.animTick);
    } else if (obj.type === 'challenge_gate') {
      const isUnlocked = state.unlockedGates.has(obj.id);
      const label = state.zone.id === 'area-mitigasi-erupsi'
        ? 'TTS ERUPSI MERAPI'
        : 'TTS SIAGA GEMPA';
      drawSeismicVaultGate(ctx, obj.px, obj.py, isUnlocked, state.animTick, label);
    } else if (obj.type === 'portal_exit') {
      const isUnlocked = state.zone.id === 'area-lapangan-evakuasi'
        ? state.unlockedGates.has('l2_gate_pascabencana')
        : state.zone.id === 'area-mitigasi-erupsi'
        ? state.unlockedGates.has('l2_gate_erupsi')
        : state.zone.id === 'area-simulasi-gempa'
        ? state.unlockedGates.has('l2_gate_gempa_sim')
        : state.unlockedGates.has('l2_gate_gempa');
      const labelText = isUnlocked
        ? (state.zone.id === 'area-lapangan-evakuasi'
            ? '[GERBANG KELUAR TERBUKA]'
            : state.zone.id === 'area-mitigasi-erupsi'
            ? '[KELULUSAN LEVEL 2]'
            : state.zone.id === 'area-simulasi-gempa'
            ? '[PINTU EVAKUASI LAPANGAN]'
            : '[PINTU AREA 2 TERBUKA]')
        : (state.zone.id === 'area-lapangan-evakuasi'
            ? '[GERBANG KELUAR TERKUNCI]'
            : state.zone.id === 'area-mitigasi-erupsi'
            ? '[PINTU AKHIR LEVEL 2]'
            : state.zone.id === 'area-simulasi-gempa'
            ? '[PINTU EVAKUASI TERKUNCI]'
            : '[PINTU AREA 2 TERKUNCI]');
      drawClassroomExitDoor(ctx, obj.px, obj.py, state.animTick, isUnlocked, labelText);
    } else if (obj.type === 'portal_back') {
      if (state.zone.id === 'area-lapangan-evakuasi') {
        drawAssemblyFieldBackDoor(ctx, obj.px, obj.py);
      } else {
        drawClassroomEntranceDoor(ctx, obj.px, obj.py);
      }
    }

    // Prompt interaksi untuk objek pintu
    const distToPlayer = Math.hypot(state.player.x - obj.px, state.player.y - obj.py);
    if (distToPlayer < 50 && (obj.type === 'portal_exit' || obj.type === 'portal_back')) {
      drawInteractionPromptL2(ctx, obj.px, obj.py - 40, state.animTick);
    }
  }

  // ── 5.5. RENDER NPC SEKOLAH LEVEL 2 & SIMULASI GEMPA ──
  const isArea2SimActive =
    state.zone.id === 'area-simulasi-gempa' &&
    state.simulation &&
    state.simulation.phase !== 'idle';

  if (isArea2SimActive) {
    const sim = state.simulation;

    // A. RENDER NPC KELAS SESUAI FASE SIMULASI
    if (sim.phase === 'teaching' || sim.phase === 'quake_alert') {
      // Guru Bu Rahma di depan kelas (x: 200) menghadap ke murid (kanan)
      drawNpcWorldL2(ctx, 'bu_rahma', 200, 360, 'right', 0, false, state.animTick);
      // Seluruh 16 murid duduk tertib di kursi meja belajar masing-masing menghadap kiri (ke guru)
      CLASSROOM_STUDENTS_L2.forEach((st) => {
        drawStudentSittingInDesk(ctx, st.sitX, 360, st.type, undefined, state.animTick);
      });
      drawNpcWorldL2(ctx, 'resqy', 100, 360, 'right', 0, false, state.animTick);
    } else if (
      sim.phase === 'qte_cover' ||
      sim.phase === 'quake_holding' ||
      sim.phase === 'failed_impact' ||
      sim.phase === 'failed'
    ) {
      // Guru Bu Rahma BERLINDUNG di bawah meja guru
      drawTeacherCoverUnderDesk(ctx, 180, 360, state.animTick);
      // Semua 16 murid merunduk dan mendekap tengkuk di bawah meja masing-masing dengan tas di atas kepala
      CLASSROOM_STUDENTS_L2.forEach((st) => {
        drawStudentCoverUnderDesk(ctx, st.coverX, 360, st.type, undefined, state.animTick, true);
      });

      // Balon Seruan Teriakan Panik Murid (hanya di fase qte_cover & quake_holding)
      if (sim.phase === 'qte_cover' || sim.phase === 'quake_holding') {
        for (const shout of sim.panicShouts) {
          drawPanicSpeechBubble(ctx, shout.x, shout.y, shout.text, state.animTick, shout.staggerY || 0);
        }
      }
    } else if (sim.phase === 'quake_stopped') {
      // Guru Bu Rahma berdiri di depan kelas memberikan aba-aba evakuasi
      drawNpcWorldL2(ctx, 'bu_rahma', 190, 360, 'right', 0, false, state.animTick);
      // Murid-murid masih bersiap di bawah meja (tas di kepala)
      CLASSROOM_STUDENTS_L2.forEach((st) => {
        drawStudentCoverUnderDesk(ctx, st.coverX, 360, st.type, undefined, state.animTick, false);
      });
    } else if (sim.phase === 'evacuating' || sim.phase === 'completed') {
      // Bu Rahma memimpin di depan dan seluruh 16 siswa berbaris tertib dievakuasi menuju pintu keluar
      const buRahmaNpc = state.npcs.get('l2_sim_npc_bu_rahma');
      if (buRahmaNpc) {
        drawTeacherEvacuatingPose(ctx, buRahmaNpc.x, buRahmaNpc.y, state.animTick, buRahmaNpc.animFrame);
      }
      CLASSROOM_STUDENTS_L2.forEach((st) => {
        const npc = state.npcs.get(st.id);
        if (npc) {
          drawStudentEvacuatingPose(ctx, npc.x, npc.y, st.type, undefined, state.animTick, npc.animFrame);
        }
      });
    }

    // B. RENDER PUING-PUING ATAP JATUH (DEBRIS PARTICLES DENGAN VARIAN JELAS)
    if (sim.particles.length > 0) {
      for (const p of sim.particles) {
        ctx.save();
        ctx.translate(Math.round(p.x), Math.round(p.y));
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity ?? 1));

        if (p.type === 'tile') {
          // Papan Plafon Akustik (14-22px lebar)
          const w = p.width || 18;
          const h = p.height || 6;
          ctx.fillStyle = p.color;
          ctx.fillRect(-w / 2, -h / 2, w, h);
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 1;
          ctx.strokeRect(-w / 2, -h / 2, w, h);
          // Retakan halus plafon
          ctx.strokeStyle = '#cbd5e1';
          ctx.beginPath();
          ctx.moveTo(-w / 4, -h / 2);
          ctx.lineTo(0, h / 2);
          ctx.stroke();
        } else if (p.type === 'rock') {
          // Bongkahan Batu Beton / Semen (8-14px)
          const sz = p.size || 10;
          ctx.fillStyle = p.color;
          ctx.fillRect(-sz / 2, -sz / 2, sz, sz);
          ctx.fillStyle = '#94a3b8';
          ctx.fillRect(-sz / 2, -sz / 2, sz, 2); // Highlight atas
          ctx.fillStyle = '#334155';
          ctx.fillRect(-sz / 2, sz / 2 - 2, sz, 2); // Bayangan bawah
        } else {
          // Serpihan Plester & Debu Kapur
          const sz = p.size || 3;
          ctx.fillStyle = p.color;
          ctx.fillRect(-sz / 2, -sz / 2, sz, sz);
        }

        ctx.restore();
      }
    }

    // C. RENDER SISWA PEMAIN SESUAI FASE SIMULASI
    if (sim.phase === 'failed_impact') {
      const rock = sim.fallingRock;
      // Gambar animasi karakter tersungkur pusing atau panik melihat ke atas
      drawPlayerStunnedByRockImpact(
        ctx,
        498,
        360,
        avatarConfig,
        state.animTick,
        sim.failureImpactTimer || 0,
        rock?.hit ?? false,
        rock?.shards ?? []
      );

      // Jika batu belum menabrak kepala: render batu besar yang meluncur dari plafon
      if (rock && !rock.hit) {
        ctx.save();
        // Speed lines di atas batu yang meluncur
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(rock.x - 7, rock.y - 18);
        ctx.lineTo(rock.x - 7, rock.y - 6);
        ctx.moveTo(rock.x + 7, rock.y - 24);
        ctx.lineTo(rock.x + 7, rock.y - 8);
        ctx.stroke();

        // Bongkahan Batu Beton Besar Runtuh (28px)
        ctx.translate(rock.x, rock.y);
        ctx.fillStyle = '#475569';
        ctx.fillRect(-rock.size / 2, -rock.size / 2, rock.size, rock.size);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(-rock.size / 2 + 2, -rock.size / 2 + 2, rock.size - 4, rock.size - 4);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(-rock.size / 2, -rock.size / 2, rock.size, 3);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-rock.size / 2, rock.size / 2 - 3, rock.size, 3);
        // Garis retak batu
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-rock.size / 4, -rock.size / 2);
        ctx.lineTo(2, 0);
        ctx.lineTo(-2, rock.size / 2);
        ctx.stroke();
        ctx.restore();
      }
      drawMascotWorldL2(ctx, 498, 330, 'left', state.animTick);
    } else if (sim.playerCrouchedUnderDesk) {
      drawStudentCoverUnderDesk(ctx, 482, 360, 'player', avatarConfig, state.animTick, sim.phase === 'quake_holding');
      drawMascotWorldL2(ctx, 482, 330, 'left', state.animTick);
    } else if (sim.playerAtDesk) {
      drawStudentSittingInDesk(ctx, 498, 360, 'player', avatarConfig, state.animTick);
      drawMascotWorldL2(ctx, 498, 330, 'left', state.animTick);
    } else if (sim.phase === 'evacuating') {
      drawStudentEvacuatingPose(ctx, state.player.x, state.player.y, 'player', avatarConfig, state.animTick, state.player.walkFrame);
      drawMascotWorldL2(ctx, state.player.x, state.player.y - 12, state.player.dir, state.animTick);
    } else {
      drawStudentCharacter(
        ctx,
        state.player.x,
        state.player.y,
        state.player.dir,
        state.player.isWalking,
        state.player.walkFrame,
        state.player.onGround,
        state.player.vy,
        avatarConfig,
        state.zone.id
      );
      drawMascotWorldL2(ctx, state.player.x, state.player.y, state.player.dir, state.animTick);
    }
  } else {
    // ── MODE NORMAL DI LUAR SIMULASI (AREA 1 & AREA 2 EKSPLORASI) ──
    if (state.npcs) {
      for (const npc of state.npcs.values()) {
        if (npc.x + 40 < camX || npc.x - 40 > camX + viewW) continue;
        drawNpcWorldL2(
          ctx,
          npc.type,
          npc.x,
          npc.y,
          npc.dir,
          npc.animFrame,
          npc.isNearPlayer,
          state.animTick
        );

        if (npc.isNearPlayer) {
          drawNpcInteractionPromptL2(ctx, npc.x, npc.y, state.animTick);
        }
      }
    }

    const isInvul = state.player.invulnerableTimer > 0;
    if (!isInvul || Math.floor(state.animTick / 4) % 2 === 0) {
      if (state.player.thrusterTimer > 0) {
        const drawX = Math.round(state.player.x - PLAYER_FRAME_W / 2);
        const drawY = Math.round(state.player.y - PLAYER_FRAME_H);
        ctx.save();
        const tAlpha = state.player.thrusterTimer / 16;
        ctx.globalAlpha = tAlpha;
        const flameH = 6 + (state.player.thrusterTimer % 4) * 2;

        ctx.fillStyle = '#00e5ff';
        ctx.fillRect(drawX + 6, drawY + PLAYER_FRAME_H - 1, 4, flameH);
        ctx.fillRect(drawX + 14, drawY + PLAYER_FRAME_H - 1, 4, flameH);

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(drawX + 7, drawY + PLAYER_FRAME_H, 2, Math.max(2, flameH - 3));
        ctx.fillRect(drawX + 15, drawY + PLAYER_FRAME_H, 2, Math.max(2, flameH - 3));

        ctx.fillStyle = '#38bdf8';
        const sparkY = drawY + PLAYER_FRAME_H + flameH + (16 - state.player.thrusterTimer) * 1.2;
        const wobble = (state.animTick + state.player.thrusterTimer) % 3;
        ctx.fillRect(drawX + 6 + wobble, sparkY, 2, 2);
        ctx.fillRect(drawX + 14 - wobble, sparkY + 2, 2, 2);

        ctx.fillStyle = 'rgba(0, 229, 255, 0.2)';
        ctx.beginPath();
        ctx.arc(state.player.x, state.player.y + 4, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      drawStudentCharacter(
        ctx,
        state.player.x,
        state.player.y,
        state.player.dir,
        state.player.isWalking,
        state.player.walkFrame,
        state.player.onGround,
        state.player.vy,
        avatarConfig,
        state.zone.id
      );

      drawMascotWorldL2(ctx, state.player.x, state.player.y, state.player.dir, state.animTick);
    }
  }

  ctx.restore();

  // ── 7.5. OVERLAY SIMULASI GEMPA BUMI (QTE 10s & TIMER GEMPA 30s) ──
  if (isArea2SimActive && state.simulation) {
    if (state.simulation.phase === 'qte_cover') {
      drawSimulationQteOverlay(ctx, viewW, viewH, state.simulation.qteTimer, state.simulation.qteMaxTimer);
    } else if (state.simulation.phase === 'quake_holding') {
      drawSimulationQuakeTimerOverlay(ctx, viewW, viewH, state.simulation.quakeTimer, state.simulation.quakeMaxTimer);
    }
  }

  // ── 8. NOTIFIKASI PERALIHAN AREA ALA LEVEL 1 (POPUP KARTU EMAS SCREENSHOT 3) ──
  if (state.areaTransitionBanner) {
    drawAreaTransitionBannerL2(ctx, state.areaTransitionBanner, viewW, viewH);
  }
}

// ── RENDER BANNER PERALIHAN AREA ALA LEVEL 1 (SCREENSHOT 3) ──
export function drawAreaTransitionBannerL2(
  ctx: CanvasRenderingContext2D,
  banner: AreaTransitionBannerL2,
  canvasW: number,
  canvasH: number
): void {
  const { direction, areaName, subtitle, timer, maxTimer } = banner;
  const progress = 1 - timer / maxTimer;

  // Transisi fade in 0..0.10, tahan 0.10..0.88, fade out 0.88..1.0
  let alpha = 1;
  if (progress < 0.10) {
    alpha = progress / 0.10;
  } else if (progress > 0.88) {
    alpha = (1 - progress) / 0.12;
  }
  alpha = Math.max(0, Math.min(1, alpha));

  ctx.save();
  ctx.globalAlpha = alpha;

  // Backdrop gelap fokus (Level 1 style)
  ctx.fillStyle = 'rgba(5, 8, 15, 0.88)';
  ctx.fillRect(0, 0, canvasW, canvasH);

  const cx = canvasW / 2;
  const cy = canvasH / 2;

  // Panel kartu pengantar zona (Diperbesar proporsional ala Level 1)
  const isCompact = canvasW < 760;
  const cardW = Math.min(canvasW - 32, isCompact ? 580 : 780);
  const cardH = isCompact ? 160 : 190;
  const cardX = cx - cardW / 2;
  const cardY = cy - cardH / 2;

  // Bayangan luar kartu retro (Deep Drop Shadow)
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
  ctx.shadowBlur = 28;
  ctx.shadowOffsetY = 10;

  // Panel gradien slate gelap mewah
  const cardGrad = ctx.createLinearGradient(cardX, cardY, cardX, cardY + cardH);
  cardGrad.addColorStop(0, '#0f172a');
  cardGrad.addColorStop(0.5, '#0b1120');
  cardGrad.addColorStop(1, '#020617');
  ctx.fillStyle = cardGrad;
  ctx.fillRect(cardX, cardY, cardW, cardH);
  ctx.restore();

  // Border emas tebal (Frame Utama)
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = isCompact ? 3.5 : 4.5;
  ctx.strokeRect(cardX, cardY, cardW, cardH);

  // Border kedua bagian dalam (Inner Inset Frame)
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 1.5;
  const inset = isCompact ? 5 : 7;
  ctx.strokeRect(cardX + inset, cardY + inset, cardW - inset * 2, cardH - inset * 2);

  // Aksen sudut pixel emas besar (Pixel Corner L-brackets)
  const bLen = isCompact ? 12 : 16;
  const bThick = isCompact ? 3.5 : 4.5;
  ctx.fillStyle = '#fbbf24';
  // Top-left
  ctx.fillRect(cardX + inset - 1, cardY + inset - 1, bLen, bThick);
  ctx.fillRect(cardX + inset - 1, cardY + inset - 1, bThick, bLen);
  // Top-right
  ctx.fillRect(cardX + cardW - inset - bLen + 1, cardY + inset - 1, bLen, bThick);
  ctx.fillRect(cardX + cardW - inset - bThick + 1, cardY + inset - 1, bThick, bLen);
  // Bottom-left
  ctx.fillRect(cardX + inset - 1, cardY + cardH - inset - bThick + 1, bLen, bThick);
  ctx.fillRect(cardX + inset - 1, cardY + cardH - inset - bLen + 1, bThick, bLen);
  // Bottom-right
  ctx.fillRect(cardX + cardW - inset - bLen + 1, cardY + cardH - inset - bThick + 1, bLen, bThick);
  ctx.fillRect(cardX + cardW - inset - bThick + 1, cardY + cardH - inset - bLen + 1, bThick, bLen);

  ctx.textAlign = 'center';

  // 1. Label Arah Perpindahan (Warna Biru Langit Cyan Terang)
  const headerFontSize = isCompact ? 11 : 13.5;
  ctx.font = `bold ${headerFontSize}px "Press Start 2P", monospace`;
  ctx.fillStyle = '#38bdf8';
  const headerY = isCompact ? cy - 42 : cy - 50;
  ctx.fillText(
    direction === 'enter' ? '▼ MEMASUKI AREA BARU ▼' : '▲ KEMBALI KE AREA SEBELUMNYA ▲',
    cx,
    headerY
  );

  // 2. Nama Area (Judul Utama Kuning Emas Cerah - Besar dan Jelas)
  const titleFontSize = isCompact
    ? (areaName.length > 20 ? 14 : 17)
    : (areaName.length > 22 ? 18 : 21);
  ctx.font = `bold ${titleFontSize}px "Press Start 2P", monospace`;
  ctx.fillStyle = '#fef08a';
  const titleY = isCompact ? cy + 4 : cy + 6;
  ctx.fillText(areaName, cx, titleY);

  // 3. Subtitle / Deskripsi Karakteristik Area (Kuning Amber Hangat)
  if (subtitle && subtitle.trim() !== '') {
    const subFontSize = isCompact
      ? (subtitle.length > 40 ? 8 : 9.5)
      : (subtitle.length > 45 ? 10 : 11.5);
    ctx.font = `bold ${subFontSize}px "Press Start 2P", monospace`;
    ctx.fillStyle = '#fbbf24';
    const subY = isCompact ? cy + 46 : cy + 54;
    ctx.fillText(subtitle, cx, subY);
  }

  ctx.restore();
}

// ── ATMOSPHERE: CLASSROOM INTERIOR, CHALKBOARDS, WINDOWS & HANGING LAMPS (AREA 1: MITIGASI GEMPA) ──
function drawClassroomAtmosphere(
  ctx: CanvasRenderingContext2D,
  camX: number,
  viewW: number,
  viewH: number,
  animTick: number
): void {
  // 1. Dinding Atas Ruang Kelas (Cat Dinding Krem Bersih & Lembut)
  const wallGrad = ctx.createLinearGradient(0, 0, 0, 240);
  wallGrad.addColorStop(0, '#f8fafc'); // Putih gading bersih dekat plafon
  wallGrad.addColorStop(0.5, '#f1f5f9'); // Abu-abu terang lembut
  wallGrad.addColorStop(1, '#e2e8f0'); // Gradasi halus ke lis kayu
  ctx.fillStyle = wallGrad;
  ctx.fillRect(camX, 0, viewW, 240);

  // 1B. Plafon Ruang Kelas & Balok Struktur (Ceiling Cornice & Acoustic Tiles)
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(camX, 0, viewW, 16);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(camX, 15, viewW, 2);

  // Garis Nat Plafon Akustik Kelas setiap 120px
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
  ctx.lineWidth = 1;
  const ceilingOffset = ((camX % 120) + 120) % 120;
  ctx.beginPath();
  for (let cx = camX - ceilingOffset; cx < camX + viewW + 120; cx += 120) {
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, 16);
  }
  ctx.stroke();

  // 2. Lis Dinding Kayu Tengah (Classroom Dado Rail Moulding pada y: 236 - 246)
  ctx.fillStyle = '#92400e';
  ctx.fillRect(camX, 236, viewW, 10);
  ctx.fillStyle = '#b45309';
  ctx.fillRect(camX, 236, viewW, 3);
  ctx.fillStyle = '#451a03';
  ctx.fillRect(camX, 244, viewW, 2);

  // 3. Panel Dinding Kayu Bawah (Wainscoting Paneling y: 246 - 360)
  ctx.fillStyle = '#78350f';
  ctx.fillRect(camX, 246, viewW, 114);

  // Bilah Panel Kayu Vertikal (Wainscot Slats) setiap 40px
  const slatOffset = ((camX % 40) + 40) % 40;
  for (let sx = camX - slatOffset; sx < camX + viewW + 40; sx += 40) {
    ctx.fillStyle = '#451a03';
    ctx.fillRect(sx, 246, 2, 114);
    ctx.fillStyle = '#92400e';
    ctx.fillRect(sx + 2, 246, 2, 114);
  }

  // 3B. Dinding Samping Kiri Kelas & Pintu Masuk Terbuka (x: 0 .. 80)
  if (camX < 140) {
    ctx.save();
    // Tiang Dinding Pembatas Kiri Kelas
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 16, 360);
    ctx.fillStyle = '#334155';
    ctx.fillRect(16, 0, 8, 360);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(0, 350, 24, 10); // Baseboard

    // Pintu Masuk Ruang Kelas Terbuka Menempel Dinding Kiri
    drawClassroomEntranceDoor(ctx, 48, 360);
    ctx.restore();
  }

  // 3C. Dinding Samping Kanan Kelas (x: 2180 .. 2208)
  if (camX + viewW > 2150) {
    ctx.save();
    ctx.fillStyle = '#334155';
    ctx.fillRect(2184, 0, 8, 360);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(2192, 0, 16, 360);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(2184, 350, 24, 10); // Baseboard
    ctx.restore();
  }

  // 4. Jendela Kaca Besar Ruang Kelas (Classroom Windows with Daylight & Trees)
  // Jendela berada pada posisi dunia tetap: x = 180, 760, 1380, 1920
  const windowPositions = [180, 760, 1380, 1920];
  for (const winX of windowPositions) {
    if (winX + 160 < camX || winX > camX + viewW) continue;

    ctx.save();
    // Kusen Jendela Kayu Jati Luar
    ctx.fillStyle = '#451a03';
    ctx.fillRect(winX - 4, 46, 148, 148);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(winX, 50, 140, 140);

    // Kaca Jendela & Kliping Pemandangan Luar (Mencegah Daun Tembus ke Dalam Kelas)
    ctx.save();
    ctx.beginPath();
    ctx.rect(winX + 6, 56, 128, 128);
    ctx.clip(); // 100% Terklip di dalam kaca jendela

    // Langit Cerah di Luar Sekolah
    const skyGrad = ctx.createLinearGradient(0, 56, 0, 184);
    skyGrad.addColorStop(0, '#38bdf8');
    skyGrad.addColorStop(0.7, '#7dd3fc');
    skyGrad.addColorStop(1, '#bae6fd');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(winX + 6, 56, 128, 128);

    // Siluet Atap Gedung Kampus Sekolah di Luar
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(winX + 12, 135, 116, 49);
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(winX + 10, 135);
    ctx.lineTo(winX + 55, 115);
    ctx.lineTo(winX + 100, 115);
    ctx.lineTo(winX + 128, 135);
    ctx.closePath();
    ctx.fill();

    // Batang & Ranting Pohon Sekolah di Luar Kaca
    ctx.fillStyle = '#5c2605';
    ctx.fillRect(winX + 62, 120, 12, 64);
    ctx.fillRect(winX + 45, 135, 20, 4);
    ctx.fillRect(winX + 70, 130, 24, 4);

    // Rimbun Daun Pohon Sekolah (Solid, Tertiup Angin Perlahan di Luar Jendela)
    const treeSway = Math.sin(animTick * 0.03 + winX) * 3;
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(winX + 38 + treeSway, 125, 26, 0, Math.PI * 2);
    ctx.arc(winX + 74 - treeSway, 112, 32, 0, Math.PI * 2);
    ctx.arc(winX + 106 + treeSway, 128, 22, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.arc(winX + 44 + treeSway, 118, 18, 0, Math.PI * 2);
    ctx.arc(winX + 78 - treeSway, 105, 22, 0, Math.PI * 2);
    ctx.arc(winX + 102 + treeSway, 120, 16, 0, Math.PI * 2);
    ctx.fill();

    // Kilau Kaca Diagonal di Luar
    ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.beginPath();
    ctx.moveTo(winX + 14, 56);
    ctx.lineTo(winX + 35, 56);
    ctx.lineTo(winX + 10, 184);
    ctx.lineTo(winX + 6, 184);
    ctx.closePath();
    ctx.fill();

    ctx.restore(); // Tutup kliping kaca

    // Bingkai Salib Pemisah Kaca (Window Mullions) DIGAMBAR DI DEPAN KACA & DAUN
    ctx.fillStyle = '#451a03';
    ctx.fillRect(winX + 67, 56, 8, 128);
    ctx.fillRect(winX + 6, 116, 128, 8);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(winX + 68, 56, 6, 128);
    ctx.fillRect(winX + 6, 117, 128, 6);

    // Ambang Bawah Jendela (Window Sill)
    ctx.fillStyle = '#b45309';
    ctx.fillRect(winX - 8, 184, 156, 8);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(winX - 8, 191, 156, 2);

    // Berkas Sinar Matahari Masuk ke Dalam Kelas (God Rays)
    const rayGrad = ctx.createLinearGradient(winX + 70, 56, winX + 140, 320);
    rayGrad.addColorStop(0, 'rgba(254, 240, 138, 0.16)');
    rayGrad.addColorStop(0.6, 'rgba(254, 240, 138, 0.07)');
    rayGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = rayGrad;
    ctx.beginPath();
    ctx.moveTo(winX + 10, 56);
    ctx.lineTo(winX + 134, 56);
    ctx.lineTo(winX + 210, 340);
    ctx.lineTo(winX + 30, 340);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // 5. Tiga Papan Tulis Kapur Hijau Besar dengan Catatan & Rumus Berbeda-beda
  const boards = [
    { x: 380, type: 'math_physics' },
    { x: 1100, type: 'mitigation' }, // Diposisikan rapi di tengah koridor antara jendela 760 dan 1380
    { x: 1600, type: 'evacuation' },
  ];

  for (const b of boards) {
    const bX = b.x;
    if (bX + 230 < camX || bX > camX + viewW) continue;

    ctx.save();
    // Bingkai Kayu Papan Tulis
    ctx.fillStyle = '#451a03';
    ctx.fillRect(bX - 3, 57, 226, 126);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(bX, 60, 220, 120);

    // Permukaan Hijau Tua Papan Tulis Kapur
    ctx.fillStyle = '#064e3b';
    ctx.fillRect(bX + 6, 66, 208, 108);

    // Baki Kapur di Bawah Papan
    ctx.fillStyle = '#92400e';
    ctx.fillRect(bX - 4, 180, 228, 7);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(bX - 2, 180, 224, 2);

    // Kapur & Penghapus di Atas Baki
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(bX + 24, 176, 12, 4);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(bX + 40, 176, 10, 4);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(bX + 60, 174, 24, 6); // Badan kayu penghapus
    ctx.fillStyle = '#64748b';
    ctx.fillRect(bX + 60, 178, 24, 3); // Kain felt hitam

    ctx.font = "7px 'Press Start 2P', monospace";

    if (b.type === 'math_physics') {
      // ── PAPAN 1: IPA KELAS 8 (RUMUS 1+1=2, v=s/t, F=m*a) ──
      ctx.fillStyle = '#fef08a';
      ctx.fillText('IPA: KELAS 8', bX + 16, 82);

      ctx.fillStyle = '#ffffff';
      ctx.fillText('1 + 1 = 2', bX + 16, 98);
      ctx.fillText('v = s / t', bX + 16, 114);
      ctx.fillText('F = m . a', bX + 16, 130);

      // Grafik Sinusoida Gelombang Seismik Kapur
      ctx.strokeStyle = '#6ee7b7';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      // Garis Sumbu Koordinat
      ctx.moveTo(bX + 120, 150);
      ctx.lineTo(bX + 195, 150);
      ctx.moveTo(bX + 130, 160);
      ctx.lineTo(bX + 130, 95);
      ctx.stroke();

      // Gelombang Primer (P-Wave)
      ctx.strokeStyle = '#a7f3d0';
      ctx.beginPath();
      for (let gx = 0; gx <= 60; gx++) {
        const gy = Math.sin(gx * 0.2) * 14;
        if (gx === 0) ctx.moveTo(bX + 132 + gx, 125 + gy);
        else ctx.lineTo(bX + 132 + gx, 125 + gy);
      }
      ctx.stroke();

      ctx.fillStyle = '#a7f3d0';
      ctx.font = "6px 'Press Start 2P', monospace";
      ctx.fillText('GEL. P', bX + 140, 92);
    } else if (b.type === 'mitigation') {
      // ── PAPAN 2: SIMULASI GEMPA KE KANAN (DI TENGAH SEGMEN KORIDOR) ──
      ctx.fillStyle = '#fde047';
      ctx.fillText('SIMULASI GEMPA KE KANAN', bX + 14, 82);

      ctx.fillStyle = '#ffffff';
      ctx.font = "6px 'Press Start 2P', monospace";
      ctx.fillText('1. MERUNDUK (DROP)', bX + 16, 100);
      ctx.fillText('2. BERLINDUNG (COVER)', bX + 16, 116);
      ctx.fillText('3. BERTAHAN (HOLD ON)', bX + 16, 132);

      // Panah Kapur Kuning Besar Mengarah ke Kanan Menuju Area 2
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(bX + 140, 152);
      ctx.lineTo(bX + 195, 152);
      ctx.lineTo(bX + 185, 144);
      ctx.moveTo(bX + 195, 152);
      ctx.lineTo(bX + 185, 160);
      ctx.stroke();

      ctx.fillStyle = '#fde047';
      ctx.font = "6px 'Press Start 2P', monospace";
      ctx.fillText('AREA 2 \u2794', bX + 60, 156);
    } else {
      // ── PAPAN 3: JALUR EVAKUASI KELAS ──
      ctx.fillStyle = '#4ade80';
      ctx.fillText('JALUR EVAKUASI', bX + 16, 82);

      ctx.fillStyle = '#ffffff';
      ctx.font = "6px 'Press Start 2P', monospace";
      ctx.fillText('IKUTI PETUNJUK GURU', bX + 16, 100);
      ctx.fillText('JANGAN PAKAI LIFT!', bX + 16, 116);
      ctx.fillText('KE LAPANGAN SEGERA', bX + 16, 132);

      // Panah Kapur Hijau Menuju Pintu
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(bX + 155, 155);
      ctx.lineTo(bX + 195, 155);
      ctx.lineTo(bX + 185, 149);
      ctx.moveTo(bX + 195, 155);
      ctx.lineTo(bX + 185, 161);
      ctx.stroke();

      // Lambang Bendera Titik Kumpul
      ctx.fillStyle = '#f87171';
      ctx.beginPath();
      ctx.moveTo(bX + 175, 96);
      ctx.lineTo(bX + 192, 102);
      ctx.lineTo(bX + 175, 108);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(bX + 173, 96, 2, 22);
    }

    ctx.restore();
  }

  // 6. Papan Mading Gabus Sekolah (Cork Bulletin Board dipisah di x: 920 agar TIDAK tumpang tindih)
  const corkX = 920;
  if (corkX + 160 >= camX && corkX <= camX + viewW) {
    ctx.save();
    ctx.fillStyle = '#451a03';
    ctx.fillRect(corkX - 2, 68, 154, 104);
    ctx.fillStyle = '#b45309'; // Tekstur gabus
    ctx.fillRect(corkX, 70, 150, 100);

    // Kertas-kertas Pengumuman 3 Pilar Mitigasi: PRABENCANA, BENCANA, PASCABENCANA
    // Lembar 1: PRABENCANA (Kuning)
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(corkX + 8, 80, 42, 76);
    ctx.fillStyle = '#ef4444'; // Jarum Pin Merah
    ctx.beginPath();
    ctx.arc(corkX + 29, 83, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#78350f';
    ctx.font = "5px 'Press Start 2P', monospace";
    ctx.fillText('PRA-', corkX + 12, 95);
    ctx.fillText('BENCANA', corkX + 10, 104);
    ctx.fillStyle = '#92400e';
    ctx.fillText('\u2022SIAGA', corkX + 10, 118);
    ctx.fillText('\u2022TSB 72', corkX + 10, 128);
    ctx.fillText('\u2022DENAH', corkX + 10, 138);

    // Lembar 2: BENCANA (Biru)
    ctx.fillStyle = '#bae6fd';
    ctx.fillRect(corkX + 54, 80, 42, 76);
    ctx.fillStyle = '#2563eb'; // Jarum Pin Biru
    ctx.beginPath();
    ctx.arc(corkX + 75, 83, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0c4a6e';
    ctx.font = "5px 'Press Start 2P', monospace";
    ctx.fillText('SAAT', corkX + 62, 95);
    ctx.fillText('GEMPA', corkX + 58, 104);
    ctx.fillStyle = '#0369a1';
    ctx.fillText('\u2022RUNDUK', corkX + 56, 118);
    ctx.fillText('\u2022LINDUNG', corkX + 56, 128);
    ctx.fillText('\u2022TAHAN', corkX + 56, 138);

    // Lembar 3: PASCABENCANA (Hijau)
    ctx.fillStyle = '#dcfce7';
    ctx.fillRect(corkX + 100, 80, 44, 76);
    ctx.fillStyle = '#16a34a'; // Jarum Pin Hijau
    ctx.beginPath();
    ctx.arc(corkX + 122, 83, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#14532d';
    ctx.font = "5px 'Press Start 2P', monospace";
    ctx.fillText('PASCA-', corkX + 102, 95);
    ctx.fillText('BENCANA', corkX + 101, 104);
    ctx.fillStyle = '#15803d';
    ctx.fillText('\u2022TANGGA', corkX + 102, 118);
    ctx.fillText('\u2022NO LIFT', corkX + 102, 128);
    ctx.fillText('\u2022KUMPUL', corkX + 102, 138);

    ctx.restore();
  }

  // 7. Jam Dinding Sekolah (School Clock at x: 700)
  const clockX = 700;
  if (clockX + 30 >= camX && clockX - 30 <= camX + viewW) {
    ctx.save();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(clockX, 42, 17, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(clockX, 42, 14, 0, Math.PI * 2);
    ctx.fill();

    // Jarum Jam & Menit
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(clockX, 42);
    ctx.lineTo(clockX, 33);
    ctx.moveTo(clockX, 42);
    ctx.lineTo(clockX + 7, 42);
    ctx.stroke();

    // Titik Poros Merah
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(clockX, 42, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // 8. Rambu Hijau Titik Evakuasi / Running Man di Atas Pintu (x: 1880)
  const exitSignX = 1880;
  if (exitSignX + 40 >= camX && exitSignX <= camX + viewW) {
    ctx.save();
    ctx.fillStyle = '#14532d';
    ctx.fillRect(exitSignX, 36, 42, 18);
    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(exitSignX + 1, 37, 40, 16);

    // Siluet Orang Berlari Putih
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(exitSignX + 12, 41, 4, 4); // Kepala
    ctx.fillRect(exitSignX + 14, 46, 3, 5); // Badan
    ctx.fillRect(exitSignX + 12, 49, 3, 3); // Kaki
    ctx.fillRect(exitSignX + 17, 48, 3, 3);

    // Panah Evakuasi Putih
    ctx.beginPath();
    ctx.moveTo(exitSignX + 25, 45);
    ctx.lineTo(exitSignX + 32, 45);
    ctx.lineTo(exitSignX + 29, 42);
    ctx.moveTo(exitSignX + 32, 45);
    ctx.lineTo(exitSignX + 29, 48);
    ctx.stroke();

    ctx.restore();
  }

  // 9. Lampu Neon Gantung Berayun Halus (Hanging Fluorescent Fixtures with Light Beams)
  for (let l = 0; l < 8; l++) {
    const lampWorldX = 120 + l * 280;
    if (lampWorldX + 70 < camX || lampWorldX - 70 > camX + viewW) continue;

    // Ayunan halus respons seismik
    const sway = Math.sin(animTick * 0.05 + l) * 3;
    const lampY = 48;

    ctx.save();
    // Kabel Penggantung Hitam dari Plafon
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(lampWorldX - 22, 16);
    ctx.lineTo(lampWorldX - 22 + sway * 0.5, lampY);
    ctx.moveTo(lampWorldX + 22, 16);
    ctx.lineTo(lampWorldX + 22 + sway * 0.5, lampY);
    ctx.stroke();

    // Kap Lampu Neon Logam Abu-abu
    ctx.translate(sway, 0);
    ctx.fillStyle = '#334155';
    ctx.fillRect(lampWorldX - 32, lampY, 64, 7);

    // Tabung Neon Menyala Terang
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(lampWorldX - 28, lampY + 5, 56, 4);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(lampWorldX - 24, lampY + 6, 48, 2);

    // Berkas Cahaya Sorot Lampu ke Bawah (Volumetric Downward Cone)
    const coneGrad = ctx.createLinearGradient(0, lampY + 9, 0, 240);
    coneGrad.addColorStop(0, 'rgba(254, 240, 138, 0.14)');
    coneGrad.addColorStop(0.5, 'rgba(254, 240, 138, 0.06)');
    coneGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = coneGrad;
    ctx.beginPath();
    ctx.moveTo(lampWorldX - 28, lampY + 9);
    ctx.lineTo(lampWorldX + 28, lampY + 9);
    ctx.lineTo(lampWorldX + 65, 240);
    ctx.lineTo(lampWorldX - 65, 240);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // 10. Perabot Meja Ganda & Kursi Siswa SMP di Latar Belakang (DIAM DI TEMPAT / STATIS KOORDINAT DUNIA)
  const deskWorldPositions = [200, 480, 780, 1080, 1380, 1680, 1920];
  ctx.save();
  for (const deskX of deskWorldPositions) {
    if (deskX + 90 < camX || deskX - 30 > camX + viewW) continue;

    // ── MEJA GANDA SISWA KAYU JATI & BESI HITAM ──
    // Daun Meja Kayu Solid dengan Tepi Bevel
    ctx.fillStyle = '#b45309';
    ctx.fillRect(deskX, 308, 64, 6);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(deskX + 1, 308, 62, 2);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(deskX, 313, 64, 1);

    // Rak Kolong Buku di Bawah Meja
    ctx.fillStyle = '#451a03';
    ctx.fillRect(deskX + 4, 320, 56, 4);

    // Tumpukan Buku Warna-Warni di Kolong Meja
    ctx.fillStyle = '#0284c7'; // Buku Biru
    ctx.fillRect(deskX + 8, 316, 16, 4);
    ctx.fillStyle = '#ef4444'; // Buku Merah
    ctx.fillRect(deskX + 10, 314, 14, 2);
    ctx.fillStyle = '#10b981'; // Buku Hijau
    ctx.fillRect(deskX + 38, 317, 18, 3);

    // Kaki Meja Besi Hollow Hitam
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(deskX + 2, 314, 4, 46);
    ctx.fillRect(deskX + 58, 314, 4, 46);
    // Palang Besi Penyangga Kaki Meja
    ctx.fillStyle = '#334155';
    ctx.fillRect(deskX + 2, 344, 60, 3);
    // Sepatu Karet Kaki Meja
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(deskX + 1, 358, 6, 2);
    ctx.fillRect(deskX + 57, 358, 6, 2);

    // ── 2 KURSI BELAJAR SISWA SMP DENGAN SANDARAN BILAH KAYU ──
    // Kursi Kiri
    const c1X = deskX - 16;
    ctx.fillStyle = '#b45309';
    ctx.fillRect(c1X, 322, 14, 4); // Dudukan kursi
    ctx.fillRect(c1X + 1, 300, 12, 5); // Sandaran atas
    ctx.fillRect(c1X + 1, 308, 12, 3); // Sandaran tengah
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(c1X + 1, 300, 2, 60); // Tiang sandaran & kaki belakang
    ctx.fillRect(c1X + 12, 326, 2, 34); // Kaki depan kursi

    // Kursi Kanan
    const c2X = deskX + 68;
    ctx.fillStyle = '#b45309';
    ctx.fillRect(c2X, 322, 14, 4); // Dudukan kursi
    ctx.fillRect(c2X + 1, 300, 12, 5); // Sandaran atas
    ctx.fillRect(c2X + 1, 308, 12, 3); // Sandaran tengah
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(c2X + 11, 300, 2, 60); // Tiang sandaran & kaki belakang
    ctx.fillRect(c2X, 326, 2, 34); // Kaki depan kursi
  }
  ctx.restore();

  // 11. Partikel Debu Ruang Kelas & Butir Kapur Melayang Halus di Udara
  for (let p = 0; p < 22; p++) {
    const pSpeed = 0.5 + (p % 3) * 0.25;
    const px = camX + ((animTick * pSpeed + p * 95) % (viewW + 20)) - 10;
    const py = 60 + ((p * 27 + Math.sin(animTick * 0.03 + p) * 14) % (viewH - 120));

    // Bintik partikel kapur / debu sinar matahari keemasan
    ctx.fillStyle = p % 3 === 0 ? 'rgba(254, 240, 138, 0.45)' : 'rgba(241, 245, 249, 0.35)';
    ctx.fillRect(Math.round(px), Math.round(py), 2, 2);
  }
}

// ── PROPS DEKORASI LANTAI KELAS (PENGHAPUS, BOLPOIN, TEMPAT PENSIL, DLL) ──
function drawClassroomFloorProps(
  ctx: CanvasRenderingContext2D,
  camX: number,
  viewW: number,
  _animTick?: number
): void {
  const floorY = 360;

  // 1. Penghapus Papan Tulis Jatuh (x: 250)
  const e1X = 250;
  if (e1X + 24 >= camX && e1X <= camX + viewW) {
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
    ctx.fillRect(e1X + 1, floorY, 20, 2);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(e1X, floorY - 3, 20, 3);
    ctx.fillStyle = '#92400e';
    ctx.fillRect(e1X, floorY - 8, 20, 5);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(e1X + 1, floorY - 8, 18, 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillRect(e1X + 3, floorY - 4, 6, 2);
    ctx.restore();
  }

  // 2. Bolpoin Biru & Pensil Kuning (x: 440)
  const penX = 440;
  if (penX + 30 >= camX && penX <= camX + viewW) {
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
    ctx.fillRect(penX, floorY, 22, 1);
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(penX, floorY - 3, 18, 3);
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(penX + 2, floorY - 4, 6, 1);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(penX + 18, floorY - 2, 4, 1);

    ctx.fillStyle = '#eab308';
    ctx.fillRect(penX + 8, floorY - 6, 20, 2);
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(penX + 6, floorY - 6, 3, 2);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(penX + 9, floorY - 6, 2, 2);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(penX + 28, floorY - 5, 2, 1);
    ctx.restore();
  }

  // 3. Tempat Pensil Kain / Kotak Pensil Ritsleting (x: 720)
  const caseX = 720;
  if (caseX + 32 >= camX && caseX <= camX + viewW) {
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
    ctx.fillRect(caseX + 2, floorY, 28, 2);
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(caseX, floorY - 9, 28, 9);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(caseX + 2, floorY - 8, 24, 7);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(caseX + 3, floorY - 9, 22, 2);
    ctx.fillStyle = '#f97316';
    ctx.fillRect(caseX + 24, floorY - 7, 3, 4);
    ctx.restore();
  }

  // 4. Penggaris Plastik Bening Kuning 30cm (x: 940)
  const rulerX = 940;
  if (rulerX + 38 >= camX && rulerX <= camX + viewW) {
    ctx.save();
    ctx.fillStyle = 'rgba(253, 224, 71, 0.85)';
    ctx.fillRect(rulerX, floorY - 4, 36, 4);
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(rulerX, floorY - 1, 36, 1);
    ctx.fillStyle = '#713f12';
    for (let m = rulerX + 4; m < rulerX + 34; m += 4) {
      ctx.fillRect(m, floorY - 4, 1, 2);
    }
    ctx.restore();
  }

  // 5. Pesawat Kertas Putih (x: 1180)
  const planeX = 1180;
  if (planeX + 24 >= camX && planeX <= camX + viewW) {
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
    ctx.beginPath();
    ctx.moveTo(planeX, floorY);
    ctx.lineTo(planeX + 18, floorY);
    ctx.lineTo(planeX + 8, floorY + 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(planeX, floorY - 2);
    ctx.lineTo(planeX + 16, floorY - 8);
    ctx.lineTo(planeX + 10, floorY - 2);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.moveTo(planeX, floorY - 2);
    ctx.lineTo(planeX + 10, floorY - 2);
    ctx.lineTo(planeX + 14, floorY);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // 6. Buku Tulis Sekolah Terbuka (x: 1400)
  const bookX = 1400;
  if (bookX + 34 >= camX && bookX <= camX + viewW) {
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
    ctx.fillRect(bookX + 1, floorY, 30, 2);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(bookX, floorY - 5, 32, 5);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(bookX + 2, floorY - 5, 13, 4);
    ctx.fillRect(bookX + 17, floorY - 5, 13, 4);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(bookX + 15, floorY - 5, 2, 4);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(bookX + 4, floorY - 4, 9, 1);
    ctx.fillRect(bookX + 4, floorY - 2, 8, 1);
    ctx.fillRect(bookX + 19, floorY - 4, 9, 1);
    ctx.fillRect(bookX + 19, floorY - 2, 7, 1);
    ctx.restore();
  }

  // 7. Botol Minum / Tumbler Sekolah (x: 1640)
  const botX = 1640;
  if (botX + 18 >= camX && botX <= camX + viewW) {
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
    ctx.fillRect(botX + 1, floorY, 14, 2);
    ctx.fillStyle = '#059669';
    ctx.fillRect(botX + 2, floorY - 14, 12, 14);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(botX + 4, floorY - 13, 8, 12);
    ctx.fillStyle = '#334155';
    ctx.fillRect(botX + 3, floorY - 17, 10, 3);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(botX + 8, floorY - 18, 4, Math.PI, 0);
    ctx.stroke();
    ctx.restore();
  }

  // 8. Batang Kapur Tulis Putih & Oranye (x: 1870)
  const chX = 1870;
  if (chX + 22 >= camX && chX <= camX + viewW) {
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(chX, floorY - 3, 10, 3);
    ctx.fillStyle = '#fde047';
    ctx.fillRect(chX + 12, floorY - 2, 7, 2);
    ctx.restore();
  }
}

// ── LANTAI KERAMIK PUTIH BERSIH RUANG KELAS SIMULASI (AREA 2) ──
function drawWhiteClassroomTileFloor(
  ctx: CanvasRenderingContext2D,
  camX: number,
  viewW: number
): void {
  const floorY = 360;
  const floorH = 120;

  // 1. Dasar Ubin Keramik Putih Bersih
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(camX, floorY, viewW, floorH);

  // 2. Lis Dinding Bawah / Plinth Slate
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(camX, floorY - 5, viewW, 5);
  ctx.fillStyle = '#334155';
  ctx.fillRect(camX, floorY - 5, viewW, 2);

  // 3. Grid Nat Keramik (40x40 pixel)
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  const tileOffX = ((camX % 40) + 40) % 40;
  ctx.beginPath();
  for (let tx = camX - tileOffX; tx < camX + viewW + 40; tx += 40) {
    ctx.moveTo(tx, floorY);
    ctx.lineTo(tx, floorY + floorH);
  }
  for (let ty = floorY; ty <= floorY + floorH; ty += 40) {
    ctx.moveTo(camX, ty);
    ctx.lineTo(camX + viewW, ty);
  }
  ctx.stroke();

  // 4. Pola Kilau Lembut Selang-Seling Ubin Keramik
  for (let tx = camX - tileOffX; tx < camX + viewW + 40; tx += 40) {
    for (let ty = floorY; ty < floorY + floorH; ty += 40) {
      const tileIndex = Math.floor(tx / 40) + Math.floor(ty / 40);
      if (tileIndex % 2 === 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillRect(tx + 1, ty + 1, 38, 38);
      }
    }
  }

  // 5. Pantulan Cahaya Kilap Permukaan Keramik (Glossy Sheen)
  const sheenGrad = ctx.createLinearGradient(0, floorY, 0, floorY + 24);
  sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
  sheenGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.15)');
  sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = sheenGrad;
  ctx.fillRect(camX, floorY, viewW, 24);
}

// ══════════════════════════════════════════════════════════════════════════
// 2B. ATMOSPHERE: RUANG KELAS AREA 2 (SIMULASI TANGGAP GEMPA)
// - Menghadap ke kanan (depan kelas di sebelah kiri x: 0..250)
// - Papan tulis samping di dinding paling kiri (hanya kelihatan tebal/pinggirnya)
// - Meja guru di depan (x: 170) menghadap kanan
// - Meja & kursi murid berukuran proporsional natural (meja 44px, kursi 18px) menghadap kiri
// - Pintu evakuasi ke lapangan terbuka di ujung kanan (x: 2130)
// ══════════════════════════════════════════════════════════════════════════
function drawClassroomAtmosphereArea2(
  ctx: CanvasRenderingContext2D,
  camX: number,
  viewW: number,
  _viewH: number,
  state: GameStateL2
): void {
  const animTick = state.animTick;
  const shakeIntensity = state.simulation?.shakeIntensity || 0;

  // 1. Dinding Atas Ruang Kelas (Cat Krem & Abu Halus)
  const wallGrad = ctx.createLinearGradient(0, 0, 0, 240);
  wallGrad.addColorStop(0, '#f8fafc');
  wallGrad.addColorStop(0.5, '#f1f5f9');
  wallGrad.addColorStop(1, '#e2e8f0');
  ctx.fillStyle = wallGrad;
  ctx.fillRect(camX, 0, viewW, 240);

  // Plafon Akustik & Balok Struktur (y: 0..16)
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(camX, 0, viewW, 16);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(camX, 15, viewW, 2);

  // Nat Plafon setiap 120px
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
  ctx.lineWidth = 1;
  const ceilingOffset = ((camX % 120) + 120) % 120;
  ctx.beginPath();
  for (let cx = camX - ceilingOffset; cx < camX + viewW + 120; cx += 120) {
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, 16);
  }
  ctx.stroke();

  // 2. Lis Dinding Kayu Tengah (y: 236..246)
  ctx.fillStyle = '#92400e';
  ctx.fillRect(camX, 236, viewW, 10);
  ctx.fillStyle = '#b45309';
  ctx.fillRect(camX, 236, viewW, 3);
  ctx.fillStyle = '#451a03';
  ctx.fillRect(camX, 244, viewW, 2);

  // 3. Panel Kayu Bawah (y: 246..360)
  ctx.fillStyle = '#78350f';
  ctx.fillRect(camX, 246, viewW, 114);
  const slatOffset = ((camX % 40) + 40) % 40;
  for (let sx = camX - slatOffset; sx < camX + viewW + 40; sx += 40) {
    ctx.fillStyle = '#451a03';
    ctx.fillRect(sx, 246, 2, 114);
    ctx.fillStyle = '#92400e';
    ctx.fillRect(sx + 2, 246, 2, 114);
  }

  // 4. DINDING DEPAN PALING KIRI & PAPAN TULIS SAMPING (x: 0..40)
  if (camX < 120) {
    ctx.save();
    // Tiang Struktur Dinding Depan Kelas
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 18, 360);
    ctx.fillStyle = '#334155';
    ctx.fillRect(18, 0, 8, 360);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(0, 350, 26, 10); // Baseboard

    // ── PAPAN TULIS MENEMPEL DI DINDING KIRI MENGHADAP KE KANAN (SIDE PROFILE) ──
    // Braket Besi Penyangga Papan di Dinding
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(16, 95, 8, 8);
    ctx.fillRect(16, 260, 8, 8);

    // Frame Kayu Sisi Samping Papan Tulis (y: 90..274)
    ctx.fillStyle = '#451a03';
    ctx.fillRect(22, 90, 4, 184);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(24, 92, 2, 180);

    // Sisi Permukaan Papan Tulis Hijau Tua yang Menghadap ke Kanan
    ctx.fillStyle = '#064e3b';
    ctx.fillRect(26, 94, 6, 176);
    ctx.fillStyle = '#047857';
    ctx.fillRect(28, 98, 2, 168); // Highlight garis hijau papan tulis

    // Baki Kapur di Bagian Bawah Mencuat ke Kanan (x: 24..38, y: 270..276)
    ctx.fillStyle = '#92400e';
    ctx.fillRect(24, 270, 16, 6);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(24, 270, 16, 2);

    // Batang Kapur Putih & Kuning di Atas Baki
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(28, 267, 4, 3);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(33, 267, 3, 3);

    // Penghapus Papan Kayu di Ujung Baki
    ctx.fillStyle = '#451a03';
    ctx.fillRect(36, 265, 4, 5);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(36, 269, 4, 2);

    ctx.restore();
  }

  // 5. MEJA GURU DI DEPAN KELAS (x: 150) MENGHADAP KE KANAN (TINGGI MEJA 324)
  const tDeskX = 150;
  if (tDeskX + 70 >= camX && tDeskX - 30 <= camX + viewW) {
    ctx.save();
    // Kursi Guru di Sebelah Kiri Meja (x: 126) Menghadap ke Kanan
    const tChairX = 126;
    ctx.fillStyle = '#92400e';
    ctx.fillRect(tChairX + 4, 308, 3, 52); // Tiang sandaran
    ctx.fillRect(tChairX, 308, 14, 8); // Sandaran kursi
    ctx.fillRect(tChairX, 338, 16, 4); // Dudukan kursi
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(tChairX + 2, 342, 3, 18); // Kaki depan & belakang
    ctx.fillRect(tChairX + 12, 342, 3, 18);

    // Daun Meja Guru Kayu Jati Taller (x: 150, lebar 56px, y: 324..360)
    ctx.fillStyle = '#b45309';
    ctx.fillRect(tDeskX, 324, 56, 5);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(tDeskX + 1, 324, 54, 2);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(tDeskX, 328, 56, 1);

    // Lemari Laci Meja di Sisi Kiri (Dekat Kursi Guru)
    ctx.fillStyle = '#78350f';
    ctx.fillRect(tDeskX + 2, 329, 18, 29);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(tDeskX + 2, 338, 18, 1);
    ctx.fillRect(tDeskX + 2, 348, 18, 1);
    // Gagang Laci Logam Emas
    ctx.fillStyle = '#facc15';
    ctx.fillRect(tDeskX + 9, 333, 4, 2);
    ctx.fillRect(tDeskX + 9, 343, 4, 2);
    ctx.fillRect(tDeskX + 9, 353, 4, 2);

    // Kaki Meja Logam Hitam di Sisi Kanan (Terbuka luas 36px untuk berlindung Bu Rahma)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(tDeskX + 52, 329, 3, 31);
    ctx.fillRect(tDeskX + 20, 357, 33, 2); // Palang bawah
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(tDeskX + 51, 358, 5, 2); // Sepatu karet

    // Props di Atas Meja Guru (Tumpukan Buku, Tempat Pensil, Agenda)
    ctx.fillStyle = '#0284c7'; // Buku agenda biru
    ctx.fillRect(tDeskX + 6, 318, 14, 6);
    ctx.fillStyle = '#ef4444'; // Buku merah
    ctx.fillRect(tDeskX + 7, 316, 12, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(tDeskX + 8, 319, 8, 3);
    // Tempat Pensil
    ctx.fillStyle = '#475569';
    ctx.fillRect(tDeskX + 26, 315, 6, 9);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(tDeskX + 27, 311, 1, 4);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(tDeskX + 29, 312, 1, 3);
    ctx.fillStyle = '#eab308';
    ctx.fillRect(tDeskX + 31, 310, 1, 5);

    ctx.restore();
  }

  // 6. JENDELA KACA PROPORSIONAL NATURAL (Lebar 84px, Tinggi 96px pada y: 80..176)
  const windowPositions = [390, 880, 1370, 1860];
  for (const winX of windowPositions) {
    if (winX + 90 < camX || winX - 10 > camX + viewW) continue;

    ctx.save();
    // Kusen Kayu Jati
    ctx.fillStyle = '#451a03';
    ctx.fillRect(winX - 3, 77, 90, 102);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(winX, 80, 84, 96);

    // Kaca Jendela & Pemandangan Luar
    ctx.save();
    ctx.beginPath();
    ctx.rect(winX + 4, 84, 76, 88);
    ctx.clip();

    // Langit Biru Siang Hari
    const skyGrad = ctx.createLinearGradient(0, 84, 0, 172);
    skyGrad.addColorStop(0, '#38bdf8');
    skyGrad.addColorStop(0.7, '#7dd3fc');
    skyGrad.addColorStop(1, '#bae6fd');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(winX + 4, 84, 76, 88);

    // Atap Gedung Sekolah di Luar
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(winX + 8, 136, 68, 36);
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(winX + 6, 136);
    ctx.lineTo(winX + 35, 122);
    ctx.lineTo(winX + 65, 122);
    ctx.lineTo(winX + 78, 136);
    ctx.closePath();
    ctx.fill();

    // Pohon Sekolah
    const sway = Math.sin(animTick * 0.03 + winX) * 2;
    ctx.fillStyle = '#5c2605';
    ctx.fillRect(winX + 38, 128, 8, 44);
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(winX + 26 + sway, 130, 16, 0, Math.PI * 2);
    ctx.arc(winX + 48 - sway, 120, 20, 0, Math.PI * 2);
    ctx.arc(winX + 64 + sway, 132, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.arc(winX + 30 + sway, 126, 11, 0, Math.PI * 2);
    ctx.arc(winX + 50 - sway, 116, 14, 0, Math.PI * 2);
    ctx.fill();

    // Pantulan Kilau Kaca Diagonal
    ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.beginPath();
    ctx.moveTo(winX + 12, 84);
    ctx.lineTo(winX + 28, 84);
    ctx.lineTo(winX + 8, 172);
    ctx.lineTo(winX + 4, 172);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // Bingkai Salib Pemisah Kaca
    ctx.fillStyle = '#451a03';
    ctx.fillRect(winX + 40, 84, 5, 88);
    ctx.fillRect(winX + 4, 126, 76, 5);

    // Ambang Bawah Jendela
    ctx.fillStyle = '#b45309';
    ctx.fillRect(winX - 5, 176, 94, 6);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(winX - 5, 181, 94, 2);

    ctx.restore();
  }

  // 7. POSTER EDUKASI MITIGASI PADA DINDING KELAS
  // Poster 1: SOP 3B (Drop, Cover, Hold On) di x: 260 — Lebar Frame Diperpanjang Rapi & Lega
  const p1X = 260;
  const p1W = 104;
  const p1H = 98;
  if (p1X + p1W + 10 >= camX && p1X - 10 <= camX + viewW) {
    ctx.save();
    // Bingkai Kayu Jati Kokoh
    ctx.fillStyle = '#3e1a06';
    ctx.fillRect(p1X - 3, 95, p1W + 6, p1H + 6);
    // Kertas Poster Putih Gading
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(p1X, 98, p1W, p1H);

    // Header Merah Tebal
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(p1X, 98, p1W, 22);
    ctx.fillStyle = '#ffffff';
    ctx.font = "bold 6.5px 'Press Start 2P', monospace";
    ctx.textAlign = 'center';
    ctx.fillText('SOP GEMPA', p1X + p1W / 2, 113);

    // Garis Aksen Emas Bawah Header
    ctx.fillStyle = '#facc15';
    ctx.fillRect(p1X, 120, p1W, 2);

    // Butir SOP 3B (Drop, Cover, Hold On) — Rapi dengan Margin Kiri & Kanan yang Luas
    ctx.textAlign = 'left';
    ctx.font = "bold 5.5px 'Press Start 2P', monospace";
    ctx.fillStyle = '#1e3a8a';
    ctx.fillText('1. MERUNDUK', p1X + 8, 136);
    ctx.fillText('2. BERLINDUNG', p1X + 8, 151);
    ctx.fillText('3. BERTAHAN', p1X + 8, 166);

    ctx.fillStyle = '#15803d';
    ctx.fillText('DI BAWAH MEJA', p1X + 8, 183);

    ctx.restore();
  }

  // Poster 2: Denah Jalur Evakuasi Sekolah di x: 1120
  const p2X = 1120;
  const p2W = 96;
  const p2H = 98;
  if (p2X + p2W + 10 >= camX && p2X - 10 <= camX + viewW) {
    ctx.save();
    ctx.fillStyle = '#3e1a06';
    ctx.fillRect(p2X - 3, 95, p2W + 6, p2H + 6);
    ctx.fillStyle = '#f0f9ff';
    ctx.fillRect(p2X, 98, p2W, p2H);

    // Header Biru
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(p2X, 98, p2W, 22);
    ctx.fillStyle = '#ffffff';
    ctx.font = "bold 6px 'Press Start 2P', monospace";
    ctx.textAlign = 'center';
    ctx.fillText('JALUR KELAS', p2X + p2W / 2, 113);

    // Garis Aksen
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(p2X, 120, p2W, 2);

    // Panah Evakuasi Hijau
    ctx.strokeStyle = '#16a34a';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(p2X + 20, 146);
    ctx.lineTo(p2X + 76, 146);
    ctx.lineTo(p2X + 66, 138);
    ctx.moveTo(p2X + 76, 146);
    ctx.lineTo(p2X + 66, 154);
    ctx.stroke();

    ctx.fillStyle = '#15803d';
    ctx.textAlign = 'center';
    ctx.font = "bold 5px 'Press Start 2P', monospace";
    ctx.fillText('MENUJU', p2X + p2W / 2, 168);
    ctx.fillText('LAPANGAN', p2X + p2W / 2, 180);
    ctx.restore();
  }

  // Poster 3: Rambu Resmi Jalur Evakuasi (Persis Sesuai Gambar 3 K3/BNPB) di x: 1620
  const p3X = 1620;
  const p3W = 86;
  const p3H = 114;
  if (p3X + p3W + 10 >= camX && p3X - 10 <= camX + viewW) {
    ctx.save();
    // Bingkai Luar Gelap
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(p3X - 3, 85, p3W + 6, p3H + 6);

    // Latar Belakang Hijau Keselamatan (Safety Green)
    ctx.fillStyle = '#007a3d';
    ctx.fillRect(p3X, 88, p3W, p3H);

    // Garis Tepi Putih Ganda Khas Rambu Jalur Evakuasi
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(p3X + 3, 91, p3W - 6, p3H - 6);

    // ── BAGIAN ATAS: PINTU DARURAT PUTIH DENGAN SOSOK BERLARI HIJAU ──
    const doorX = p3X + 27;
    const doorY = 96;
    const doorW = 36;
    const doorH = 46;

    // Kusen & Daun Pintu Putih Terbuka
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(doorX, doorY, doorW, doorH);

    // Sudut Bayangan Ambang Pintu
    ctx.fillStyle = '#007a3d';
    ctx.beginPath();
    ctx.moveTo(doorX + doorW - 5, doorY + doorH);
    ctx.lineTo(doorX + doorW, doorY + doorH - 4);
    ctx.lineTo(doorX + doorW, doorY + doorH);
    ctx.closePath();
    ctx.fill();

    // Sosok Orang Berlari Hijau (Running Man Icon)
    const runX = doorX + 17;
    const runY = doorY + 6;

    // 1. Kepala (Lingkaran)
    ctx.fillStyle = '#007a3d';
    ctx.beginPath();
    ctx.arc(runX + 2, runY + 5, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // 2. Tubuh Condong Maju
    ctx.strokeStyle = '#007a3d';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(runX + 2, runY + 10);
    ctx.lineTo(runX - 2, runY + 23);
    ctx.stroke();

    // 3. Lengan Berlari (Satu ke depan kanan, satu ke belakang kiri)
    ctx.beginPath();
    // Lengan depan (kanan)
    ctx.moveTo(runX + 1, runY + 13);
    ctx.lineTo(runX + 8, runY + 12);
    ctx.lineTo(runX + 14, runY + 17);
    // Lengan belakang (kiri)
    ctx.moveTo(runX - 1, runY + 14);
    ctx.lineTo(runX - 8, runY + 12);
    ctx.lineTo(runX - 11, runY + 19);
    ctx.stroke();

    // 4. Kaki Berlari Cepat (Langkah Kanan Maju, Langkah Kiri Menolak)
    ctx.beginPath();
    // Kaki depan
    ctx.moveTo(runX - 2, runY + 23);
    ctx.lineTo(runX + 5, runY + 30);
    ctx.lineTo(runX + 10, runY + 38);
    // Kaki belakang
    ctx.moveTo(runX - 2, runY + 23);
    ctx.lineTo(runX - 8, runY + 28);
    ctx.lineTo(runX - 11, runY + 27);
    ctx.stroke();

    // ── PEMBATAS GARIS PUTIH HORIZONTAL ──
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(p3X + 3, 148);
    ctx.lineTo(p3X + p3W - 3, 148);
    ctx.stroke();

    // ── BAGIAN BAWAH: TEKS "JALUR EVAKUASI" & PANAH KANAN ──
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.font = "bold 6.5px 'Press Start 2P', monospace";
    ctx.fillText('JALUR', p3X + 8, 165);
    ctx.fillText('EVAKUASI', p3X + 8, 178);

    // Panah Tebal Putih Menunjuk ke Kanan (Ke Arah Pintu Keluar)
    const arrX = p3X + 64;
    const arrY = 168;

    // Batang Panah
    ctx.fillRect(arrX - 2, arrY - 4, 8, 8);

    // Kepala Panah Segitiga
    ctx.beginPath();
    ctx.moveTo(arrX + 6, arrY - 8);
    ctx.lineTo(arrX + 15, arrY);
    ctx.lineTo(arrX + 6, arrY + 8);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // Jam Dinding Sekolah di x: 640
  const clockX = 640;
  if (clockX + 25 >= camX && clockX - 25 <= camX + viewW) {
    ctx.save();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(clockX, 48, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(clockX, 48, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(clockX, 48);
    ctx.lineTo(clockX, 41);
    ctx.moveTo(clockX, 48);
    ctx.lineTo(clockX + 6, 48);
    ctx.stroke();
    ctx.restore();
  }

  // 8. LAMPU NEON GANTUNG PROPORSIONAL BERAYUN (y: 44)
  for (let l = 0; l < 8; l++) {
    const lampX = 160 + l * 260;
    if (lampX + 60 < camX || lampX - 60 > camX + viewW) continue;

    const baseSway = Math.sin(animTick * 0.05 + l) * 2;
    const quakeSway = shakeIntensity > 0 ? Math.sin(animTick * 0.2 + l) * (5 + shakeIntensity) : 0;
    const totalSway = baseSway + quakeSway;
    const lampY = 44;

    ctx.save();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(lampX - 16, 16);
    ctx.lineTo(lampX - 16 + totalSway * 0.5, lampY);
    ctx.moveTo(lampX + 16, 16);
    ctx.lineTo(lampX + 16 + totalSway * 0.5, lampY);
    ctx.stroke();

    ctx.translate(totalSway, 0);
    ctx.fillStyle = '#334155';
    ctx.fillRect(lampX - 22, lampY, 44, 6);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(lampX - 18, lampY + 4, 36, 3);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(lampX - 14, lampY + 5, 28, 1);
    ctx.restore();
  }

  // 9. MEJA & KURSI MURID PROPORSIONAL TALLER & LEBIH RAPAT (MEJA TINGGI 324, JARAK ANTAR MEJA 100px)
  // Letak deretan meja murid: 260, 360, 460 (meja pemain), 560, 660, 760, 860, 960, 1060, 1160, 1260, 1360, 1460, 1560, 1660, 1760, 1860
  const deskPositions = [
    260, 360, 460, 560, 660, 760, 860, 960, 1060, 1160, 1260, 1360, 1460, 1560, 1660, 1760, 1860,
  ];
  ctx.save();
  for (const deskX of deskPositions) {
    if (deskX + 60 < camX || deskX - 20 > camX + viewW) continue;

    // Daun Meja Murid Kayu Jati Taller (Tinggi 324, ketebalan 5px, y: 324..329)
    ctx.fillStyle = '#b45309';
    ctx.fillRect(deskX, 324, 46, 5);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(deskX + 1, 324, 44, 2);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(deskX, 328, 46, 1);

    // Rak Kolong Buku Meja (Tinggi 330..334, menyisakan 26px kolong bersih untuk berlindung)
    ctx.fillStyle = '#451a03';
    ctx.fillRect(deskX + 3, 330, 40, 4);
    // Buku di Kolong Meja
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(deskX + 6, 331, 12, 3);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(deskX + 22, 331, 14, 3);

    // Kaki Meja Besi Hollow Hitam & Sepatu Karet (y: 329..360)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(deskX + 2, 329, 3, 31);
    ctx.fillRect(deskX + 41, 329, 3, 31);
    ctx.fillStyle = '#334155';
    ctx.fillRect(deskX + 2, 355, 42, 2);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(deskX + 1, 358, 5, 2);
    ctx.fillRect(deskX + 40, 358, 5, 2);

    // BUKU & ALAT TULIS DI ATAS PERMUKAAN MEJA
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(deskX + 26, 322, 12, 2);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(deskX + 28, 321, 8, 1);

    // KURSI MURID DI SEBELAH KANAN MEJA (MENGHADAP KE KIRI KE ARAH MEJA & PAPAN TULIS)
    const chairX = deskX + 38;
    ctx.fillStyle = '#b45309';
    ctx.fillRect(chairX - 4, 338, 16, 4); // Dudukan kursi (y: 338..342)
    ctx.fillRect(chairX + 9, 312, 3, 30); // Sandaran atas
    ctx.fillRect(chairX + 5, 312, 7, 5); // Bilah sandaran kayu
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(chairX + 9, 342, 2, 18); // Kaki belakang
    ctx.fillRect(chairX - 2, 342, 2, 18); // Kaki depan
  }
  ctx.restore();
}

export function drawSimulationQteOverlay(
  ctx: CanvasRenderingContext2D,
  viewW: number,
  _viewH: number,
  timer: number,
  maxTimer: number
): void {
  const cx = viewW / 2;
  const cardW = Math.min(viewW - 40, 720);
  const cardH = 118;
  const cardX = cx - cardW / 2;
  const cardY = 44;

  ctx.save();
  // Background card semi-translucent dark slate
  ctx.fillStyle = '#0b1120';
  ctx.fillRect(cardX, cardY, cardW, cardH);
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 3;
  ctx.strokeRect(cardX, cardY, cardW, cardH);

  // Sudut-sudut retro pixel merah menyala
  ctx.fillStyle = '#f87171';
  ctx.fillRect(cardX + 4, cardY + 4, 10, 4);
  ctx.fillRect(cardX + 4, cardY + 4, 4, 10);
  ctx.fillRect(cardX + cardW - 14, cardY + 4, 10, 4);
  ctx.fillRect(cardX + cardW - 8, cardY + 4, 4, 10);
  ctx.fillRect(cardX + 4, cardY + cardH - 8, 10, 4);
  ctx.fillRect(cardX + 4, cardY + cardH - 14, 4, 10);
  ctx.fillRect(cardX + cardW - 14, cardY + cardH - 8, 10, 4);
  ctx.fillRect(cardX + cardW - 8, cardY + cardH - 14, 4, 10);

  // Judul peringatan guncangan kelas
  ctx.textAlign = 'center';
  ctx.font = 'bold 12.5px "Press Start 2P", monospace';
  ctx.fillStyle = '#f87171';
  ctx.fillText('[!] PERINGATAN: GEMPA BUMI MENGGUNCANG KELAS!', cx, cardY + 28);

  // Bar progress waktu QTE berlindung
  const barW = Math.min(cardW - 60, 480);
  const barH = 16;
  const barX = cx - barW / 2;
  const barY = cardY + 42;

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(barX, barY, barW, barH);
  const progress = Math.max(0, Math.min(1, timer / maxTimer));
  ctx.fillStyle = progress > 0.4 ? '#eab308' : '#ef4444';
  ctx.fillRect(barX, barY, barW * progress, barH);
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barY, barW, barH);

  const secondsLeft = (timer / 60).toFixed(1);
  ctx.font = 'bold 9.5px "Press Start 2P", monospace';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`SISA WAKTU: ${secondsLeft} DETIK`, cx, barY + 12);

  // Tombol aba-aba instruksi berlindung
  const btnW = Math.min(cardW - 40, 640);
  const btnH = 32;
  const btnY = cardY + 70;
  ctx.fillStyle = '#78350f';
  ctx.fillRect(cx - btnW / 2, btnY, btnW, btnH);
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(cx - btnW / 2, btnY, btnW, btnH);

  ctx.font = 'bold 10px "Press Start 2P", monospace';
  ctx.fillStyle = '#fef08a';
  ctx.fillText('TEKAN [E] / ENTER ATAU TAP UNTUK MERUNDUK KE BAWAH MEJA!', cx, btnY + 21);

  ctx.restore();
}

export function drawSimulationQuakeTimerOverlay(
  ctx: CanvasRenderingContext2D,
  viewW: number,
  viewH: number,
  timer: number,
  maxTimer: number
): void {
  const cx = viewW / 2;
  const cardW = Math.min(viewW - 40, 680);
  const cardH = 80;
  const cardX = cx - cardW / 2;
  const cardY = 48;

  ctx.save();
  // Flash halus tepi layar
  ctx.fillStyle = 'rgba(239, 68, 68, 0.08)';
  ctx.fillRect(0, 0, viewW, 16);
  ctx.fillRect(0, viewH - 16, viewW, 16);

  // Kartu utama gelap dengan border kuning amber tebal
  ctx.fillStyle = '#0b1120';
  ctx.fillRect(cardX, cardY, cardW, cardH);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3;
  ctx.strokeRect(cardX, cardY, cardW, cardH);

  // Aksen retro corner
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(cardX + 3, cardY + 3, 6, 2);
  ctx.fillRect(cardX + 3, cardY + 3, 2, 6);
  ctx.fillRect(cardX + cardW - 9, cardY + 3, 6, 2);
  ctx.fillRect(cardX + cardW - 5, cardY + 3, 2, 6);
  ctx.fillRect(cardX + 3, cardY + cardH - 5, 6, 2);
  ctx.fillRect(cardX + 3, cardY + cardH - 9, 2, 6);
  ctx.fillRect(cardX + cardW - 9, cardY + cardH - 5, 6, 2);
  ctx.fillRect(cardX + cardW - 5, cardY + cardH - 9, 2, 6);

  // Indikator kedip merah/amber
  const flash = Math.sin(timer * 0.15) > 0;
  ctx.fillStyle = flash ? '#ef4444' : '#f59e0b';
  ctx.beginPath();
  ctx.arc(cardX + 26, cardY + 36, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = flash ? '#fca5a5' : '#fde68a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cardX + 26, cardY + 36, 12, 0, Math.PI * 2);
  ctx.stroke();

  const secLeft = Math.ceil(timer / 60);
  const timeStr = `00:${secLeft.toString().padStart(2, '0')}`;

  // Teks Judul Timer Gempa
  ctx.textAlign = 'left';
  ctx.font = 'bold 14px "Press Start 2P", monospace';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText(`GUNCANGAN GEMPA: ${timeStr}`, cardX + 50, cardY + 30);

  // Subtitle instruksi SOP
  ctx.font = 'bold 9.5px "Press Start 2P", monospace';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('TETAP MERUNDUK & BERTAHAN DI KAKI MEJA (HOLD ON)', cardX + 50, cardY + 50);

  // Progress Bar timer guncangan
  const barW = cardW - 74;
  const barH = 7;
  const barX = cardX + 50;
  const barY = cardY + 60;
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(barX, barY, barW, barH);

  const progW = barW * Math.max(0, Math.min(1, timer / maxTimer));
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(barX, barY, progW, barH);
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1;
  ctx.strokeRect(barX, barY, barW, barH);

  ctx.restore();
}

export function drawSimulationEvacuationPrompt(
  ctx: CanvasRenderingContext2D,
  viewW: number,
  _viewH: number
): void {
  const cx = viewW / 2;
  const cardW = Math.min(viewW - 40, 680);
  const cardH = 78;
  const cardX = cx - cardW / 2;
  const cardY = 48;

  ctx.save();
  ctx.fillStyle = '#064e3b';
  ctx.fillRect(cardX, cardY, cardW, cardH);
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 3;
  ctx.strokeRect(cardX, cardY, cardW, cardH);

  // Sudut retro emerald
  ctx.fillStyle = '#34d399';
  ctx.fillRect(cardX + 3, cardY + 3, 6, 2);
  ctx.fillRect(cardX + 3, cardY + 3, 2, 6);
  ctx.fillRect(cardX + cardW - 9, cardY + 3, 6, 2);
  ctx.fillRect(cardX + cardW - 5, cardY + 3, 2, 6);
  ctx.fillRect(cardX + 3, cardY + cardH - 5, 6, 2);
  ctx.fillRect(cardX + 3, cardY + cardH - 9, 2, 6);
  ctx.fillRect(cardX + cardW - 9, cardY + cardH - 5, 6, 2);
  ctx.fillRect(cardX + cardW - 5, cardY + cardH - 9, 2, 6);

  ctx.textAlign = 'center';
  ctx.font = 'bold 12px "Press Start 2P", monospace';
  ctx.fillStyle = '#6ee7b7';
  ctx.fillText('[AMAN] GUNCANGAN SELESAI! AMBIL TAS LINDUNGI KEPALA', cx, cardY + 30);

  ctx.font = 'bold 9.5px "Press Start 2P", monospace';
  ctx.fillStyle = '#fef08a';
  ctx.fillText('TEKAN [E] ATAU TAP UNTUK KELUAR MEJA & MULAI EVAKUASI', cx, cardY + 56);

  ctx.restore();
}

// ── ATMOSPHERE: MOUNT MERAPI ASH, ERUPTION SMOKE & PVMBG SIREN (AREA 5) ──
function drawVolcanoMitigationAtmosphere(
  ctx: CanvasRenderingContext2D,
  camX: number,
  viewW: number,
  viewH: number,
  animTick: number
): void {
  // 1. Dark Volcanic Ash & Magma Twilight Sky Gradient (Langit Abu Merapi Menegangkan)
  const skyGrad = ctx.createLinearGradient(0, 0, 0, viewH);
  skyGrad.addColorStop(0, '#090505'); // Puncak langit jelaga hitam
  skyGrad.addColorStop(0.3, '#1e0a07'); // Merah jelaga vulkanik
  skyGrad.addColorStop(0.6, '#38120b'); // Bara tembaga gelap
  skyGrad.addColorStop(0.85, '#5c1d12'); // Hawa panas kawah
  skyGrad.addColorStop(1, '#7f1d1d'); // Pijar horizon
  ctx.fillStyle = skyGrad;
  ctx.fillRect(camX, 0, viewW, viewH);

  // 2. Siluet Megah Gunung Merapi dengan Asap Kawah Solfatara (Parallax 0.12)
  const paraFar = camX * 0.12;
  const merapiPeakX = camX + viewW * 0.5 - (paraFar % 300);
  const merapiPeakY = 120;

  // Gunung Merapi (Stratovolcano)
  ctx.save();
  ctx.fillStyle = '#1c0c08';
  ctx.beginPath();
  ctx.moveTo(merapiPeakX - 380, viewH);
  ctx.lineTo(merapiPeakX - 40, merapiPeakY + 15);
  ctx.lineTo(merapiPeakX, merapiPeakY); // Puncak kawah
  ctx.lineTo(merapiPeakX + 45, merapiPeakY + 20);
  ctx.lineTo(merapiPeakX + 420, viewH);
  ctx.closePath();
  ctx.fill();

  // Pendaran Kubah Lava Pijar di Puncak
  const lavaGlow = ctx.createRadialGradient(merapiPeakX, merapiPeakY + 5, 4, merapiPeakX, merapiPeakY + 5, 45);
  lavaGlow.addColorStop(0, 'rgba(239, 68, 68, 0.9)');
  lavaGlow.addColorStop(0.4, 'rgba(249, 115, 22, 0.5)');
  lavaGlow.addColorStop(1, 'rgba(239, 68, 68, 0)');
  ctx.fillStyle = lavaGlow;
  ctx.beginPath();
  ctx.arc(merapiPeakX, merapiPeakY + 5, 45, 0, Math.PI * 2);
  ctx.fill();

  // Asap Sulfatara & Awan Abu Membubung dari Puncak
  for (let s = 0; s < 6; s++) {
    const puffAge = (animTick * 0.8 + s * 30) % 180;
    const puffY = merapiPeakY - puffAge * 0.7;
    const puffScale = 14 + puffAge * 0.35;
    const puffDrift = Math.sin(puffAge * 0.05 + s) * 20 + puffAge * 0.25;
    const puffAlpha = Math.max(0, 0.65 - puffAge / 180);

    ctx.fillStyle = `rgba(120, 113, 108, ${puffAlpha})`;
    ctx.beginPath();
    ctx.arc(merapiPeakX + puffDrift, puffY, puffScale, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 3. Menara Sirene Early Warning System (EWS) PVMBG di Bukit Antara (Parallax 0.3)
  const paraMid = camX * 0.3;
  ctx.save();
  const ewsX = camX + ((600 - (paraMid % 1200) + 1200) % 1200);
  // Rangka menara EWS
  ctx.fillStyle = '#292524';
  ctx.fillRect(ewsX, 220, 6, 90);
  ctx.fillRect(ewsX - 8, 240, 22, 3);
  ctx.fillRect(ewsX - 6, 270, 18, 3);
  // Lampu Sirine Merah Strobo Berkedip Cepat (Status AWAS)
  const isSirenOn = Math.floor(animTick / 10) % 2 === 0;
  ctx.fillStyle = isSirenOn ? '#ef4444' : '#7f1d1d';
  ctx.fillRect(ewsX - 3, 214, 12, 8);
  if (isSirenOn) {
    ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
    ctx.beginPath();
    ctx.arc(ewsX + 3, 218, 22, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 4. Hujan Abu Vulkanik & Percikan Piroklastik Halus Berjatuhan
  for (let v = 0; v < 35; v++) {
    const fallSpeed = 0.9 + (v % 3) * 0.5;
    const vy = (viewH + ((animTick * fallSpeed + v * 30) % viewH)) % viewH;
    const vx = camX + ((v * 75 + animTick * 0.5 + Math.sin(animTick * 0.04 + v) * 10) % viewW);

    if (v % 7 === 0) {
      // Pijar abu panas
      ctx.fillStyle = 'rgba(248, 113, 113, 0.9)';
      ctx.fillRect(vx, vy, 2, 2);
    } else {
      // Abu silika kelabu
      ctx.fillStyle = 'rgba(168, 162, 158, 0.65)';
      ctx.fillRect(vx, vy, 2, 2);
    }
  }
}

// ── PROMPT INTERAKSI NPC MELAYANG [E] BICARA (100% PERSIS LEVEL 1) ──
export function drawNpcInteractionPromptL2(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number
): void {
  const bounce = Math.sin(frame * 0.1) * 3;
  const px = x;
  const py = y - 36 + bounce;

  // Background pill persis Level 1
  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
  ctx.fillRect(px - 28, py - 6, 56, 14);
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 1;
  ctx.strokeRect(px - 28, py - 6, 56, 14);

  // Teks tombol
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 8px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('[E] / Enter', px, py + 4);
  ctx.textAlign = 'start';
}

// ── PROMPT INTERAKSI OBJEK MELAYANG (PORTAL / LANDER) PERSIS LEVEL 1 ──
export function drawInteractionPromptL2(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number
): void {
  const bounce = Math.sin(frame * 0.1) * 3;
  const px = x;
  const py = y - 14 + bounce;

  // Background pill
  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
  ctx.fillRect(px - 28, py - 6, 56, 14);
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 1;
  ctx.strokeRect(px - 28, py - 6, 56, 14);

  // Teks tombol
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 8px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('[E] / Enter', px, py + 4);
  ctx.textAlign = 'start';
}

// ── PINTU MASUK RUANG KELAS DI DINDING KIRI (TITIK AWAL PEMAIN DATANG) ──
export function drawClassroomEntranceDoor(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number
): void {
  ctx.save();
  const doorW = 52;
  const doorH = 96;
  const topY = y - doorH;

  // 1. Kusen Kayu Pintu Kelas Sisi Kiri Menempel di Dinding
  ctx.fillStyle = '#451a03';
  ctx.fillRect(x - doorW / 2 - 4, topY - 4, doorW + 8, doorH + 4);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x - doorW / 2 - 2, topY - 2, doorW + 4, doorH + 2);

  // 2. Ruang Bukaan Pintu: Lorong Sekolah Terang di Sebelah Kiri
  const hallGrad = ctx.createLinearGradient(x - doorW / 2, topY, x + doorW / 2, topY);
  hallGrad.addColorStop(0, '#94a3b8');
  hallGrad.addColorStop(0.3, '#cbd5e1');
  hallGrad.addColorStop(1, '#e2e8f0');
  ctx.fillStyle = hallGrad;
  ctx.fillRect(x - doorW / 2, topY, doorW, doorH);

  // Lantai Koridor Ubin di Luar Ruang Kelas
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(x - doorW / 2, topY + 50, doorW, doorH - 50);
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - doorW / 2 + 16, topY + 50);
  ctx.lineTo(x - doorW / 2 + 8, y);
  ctx.moveTo(x - doorW / 2 + 36, topY + 50);
  ctx.lineTo(x - doorW / 2 + 30, y);
  ctx.stroke();

  // Daun Pintu Kayu Terbuka Menempel Rata ke Dinding Kiri
  ctx.fillStyle = '#92400e';
  ctx.fillRect(x - doorW / 2 - 12, topY + 2, 12, doorH - 2);
  ctx.fillStyle = '#b45309';
  ctx.fillRect(x - doorW / 2 - 10, topY + 20, 9, 44);

  // Plakat Nama Kelas di Atas Pintu
  const plaqueW = 56;
  const plaqueH = 15;
  const plaqueY = topY - 20;
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x - plaqueW / 2, plaqueY, plaqueW, plaqueH);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x - plaqueW / 2, plaqueY, plaqueW, plaqueH);

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 6.5px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('KELAS 8A', x, plaqueY + 11);

  ctx.restore();
}

// ── PINTU KELUAR RUANG KELAS MENJELANG AREA 2 (PINTU DI DINDING KANAN) ──
export function drawClassroomExitDoor(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  animTick: number,
  isUnlocked: boolean,
  labelText: string = 'PINTU AREA 2'
): void {
  ctx.save();
  const doorW = 58;
  const doorH = 96;
  const topY = y - doorH;

  // 1. Kusen Kayu Pintu Ganda Sekolah Menempel di Dinding
  ctx.fillStyle = '#451a03';
  ctx.fillRect(x - doorW / 2 - 5, topY - 5, doorW + 10, doorH + 5);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x - doorW / 2 - 2, topY - 2, doorW + 4, doorH + 2);

  if (isUnlocked) {
    // Pintu Terbuka: Cahaya Terang dari Lorong Area 2 Memancar
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(x - doorW / 2, topY, doorW, doorH);

    // Gradasi Sorotan Cahaya Ke Lantai Kelas
    const lightGlow = ctx.createLinearGradient(x, topY, x, y + 30);
    lightGlow.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
    lightGlow.addColorStop(0.6, 'rgba(254, 240, 138, 0.18)');
    lightGlow.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = lightGlow;
    ctx.beginPath();
    ctx.moveTo(x - doorW / 2, topY);
    ctx.lineTo(x + doorW / 2, topY);
    ctx.lineTo(x + doorW / 2 + 35, y + 25);
    ctx.lineTo(x - doorW / 2 - 35, y + 25);
    ctx.closePath();
    ctx.fill();

    // Daun Pintu Kayu Terbuka Miring ke Luar Kiri & Kanan
    ctx.fillStyle = '#92400e';
    ctx.fillRect(x - doorW / 2 - 8, topY + 4, 8, doorH - 4);
    ctx.fillRect(x + doorW / 2, topY + 4, 8, doorH - 4);

    // Lorong Sekolah Terbuka di Kejauhan Menuju Area 2
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(x - 16, topY + 25, 32, doorH - 25);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(x - 2, topY + 35, 4, doorH - 35);
  } else {
    // Pintu Tertutup Rapat (Sebelum Lulus TTS Kak Fajar)
    ctx.fillStyle = '#92400e';
    ctx.fillRect(x - doorW / 2, topY, doorW, doorH);

    // Pemisah Daun Pintu Ganda Kiri & Kanan
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x - 1, topY, 2, doorH);

    // Panel Kayu Berukir pada Daun Pintu
    ctx.fillStyle = '#b45309';
    ctx.fillRect(x - doorW / 2 + 4, topY + 46, 22, 44);
    ctx.fillRect(x + 2, topY + 46, 22, 44);

    // Kaca Intip Persegi Panjang dengan Kisi Pengaman (Wire Glass)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x - doorW / 2 + 5, topY + 10, 20, 30);
    ctx.fillRect(x + 3, topY + 10, 20, 30);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(x - doorW / 2 + 7, topY + 12, 16, 26);
    ctx.fillRect(x + 5, topY + 12, 16, 26);
    // Kisi Kawat Pengaman
    ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
    ctx.fillRect(x - doorW / 2 + 14, topY + 12, 2, 26);
    ctx.fillRect(x + 12, topY + 12, 2, 26);

    // Gagang Pintu Baja Vertikal (Push Handle Bar)
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(x - 8, topY + 50, 3, 16);
    ctx.fillRect(x + 5, topY + 50, 3, 16);

    // Gembok / Ikon Terkunci Retro di Tengah Pintu
    const lockY = topY + 56;
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(x - 6, lockY, 12, 9);
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 6, lockY, 12, 9);
    ctx.beginPath();
    ctx.arc(x, lockY - 2, 4, Math.PI, 0);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // 2. Rambu Evakuasi Hijau di Atas Pintu (Green Evacuation / Exit Sign)
  const signW = 64;
  const signH = 17;
  const signY = topY - 26;
  ctx.fillStyle = isUnlocked ? '#15803d' : '#14532d';
  ctx.fillRect(x - signW / 2, signY, signW, signH);
  ctx.strokeStyle = isUnlocked ? '#86efac' : '#22c55e';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x - signW / 2, signY, signW, signH);

  // Teks Rambu Evakuasi
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 6px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(isUnlocked ? 'KELUAR ➔' : 'JALUR KELUAR', x, signY + 11);

  // Label Mengambang Pintu (Sesuai Gaya Level 1)
  const bannerY = signY - 14 + Math.sin(animTick * 0.08) * 2;
  const labelW = 104;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
  ctx.fillRect(x - labelW / 2, bannerY - 7, labelW, 15);
  ctx.strokeStyle = isUnlocked ? '#22c55e' : '#f59e0b';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x - labelW / 2, bannerY - 7, labelW, 15);

  ctx.fillStyle = isUnlocked ? '#4ade80' : '#fbbf24';
  ctx.font = 'bold 6.5px "Press Start 2P", monospace';
  ctx.fillText(labelText, x, bannerY + 3.5);

  ctx.restore();
}

// ══════════════════════════════════════════════════════════════════════════
// 3. ATMOSPHERE: LAPANGAN SEKOLAH PASCABENCANA (AREA 3)
// ══════════════════════════════════════════════════════════════════════════

// A. LANTAI LAPANGAN HIJAU TERBUKA PASCABENCANA (AREA 3 FLOOR)
export function drawAssemblyFieldGrassFloor(
  ctx: CanvasRenderingContext2D,
  camX: number,
  viewW: number
): void {
  const floorY = 360;
  const floorH = 120;

  // 1. Dasar Rumput Lapangan Hijau Sejuk (Lush Green Grass Gradient)
  const grassGrad = ctx.createLinearGradient(0, floorY, 0, floorY + floorH);
  grassGrad.addColorStop(0, '#16a34a'); // Hijau cerah atas
  grassGrad.addColorStop(0.3, '#15803d');
  grassGrad.addColorStop(0.7, '#166534');
  grassGrad.addColorStop(1, '#14532d'); // Hijau gelap dasar
  ctx.fillStyle = grassGrad;
  ctx.fillRect(camX, floorY, viewW, floorH);

  // 2. Garis Pembatas Trotoar / Tepi Paving Gedung Sekolah (y: 356 - 360)
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(camX, floorY - 4, viewW, 4);
  ctx.fillStyle = '#475569';
  ctx.fillRect(camX, floorY - 4, viewW, 1);
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(camX, floorY, viewW, 2); // Highlight rumput paling atas

  // 3. Tekstur Rerumputan & Bintik Lapangan Terbuka Alami (Statis Sempurna, Tidak Berubah Saat Berjalan)
  const stepX = 28;
  const startX = Math.floor(camX / stepX) * stepX - stepX * 2;
  const endX = camX + viewW + stepX * 2;

  for (let px = startX; px < endX; px += stepX) {
    // Koordinat X selalu tetap di dunia (kelipatan stepX), tidak bergeser saat kamera bergerak
    const hash1 = Math.abs(Math.sin(px * 12.9898) * 43758.5453);
    const fract1 = hash1 - Math.floor(hash1);
    const randY = floorY + 10 + Math.floor(fract1 * (floorH - 28));

    const hash2 = Math.abs(Math.sin(px * 78.233) * 43758.5453);
    const fract2 = hash2 - Math.floor(hash2);

    ctx.fillStyle = fract2 > 0.45 ? '#4ade80' : '#22c55e';
    ctx.fillRect(px, randY, 2, 4);
    ctx.fillRect(px + 2, randY - 2, 2, 6);
    ctx.fillRect(px + 4, randY + 1, 2, 3);
  }

  // 4. Lapisan Bawah Tanah Subur Lapangan (y: 462 - 480)
  const groundSubGrad = ctx.createLinearGradient(0, 462, 0, 480);
  groundSubGrad.addColorStop(0, '#14532d');
  groundSubGrad.addColorStop(1, '#052e16');
  ctx.fillStyle = groundSubGrad;
  ctx.fillRect(camX, 462, viewW, 18);
  ctx.fillStyle = '#15803d';
  ctx.fillRect(camX, 462, viewW, 2);
}

// B. ATMOSFER LAPANGAN SEKOLAH TERBUKA PASCABENCANA (AREA 3 SKY & PROPS)
function drawAssemblyFieldAtmosphere(
  ctx: CanvasRenderingContext2D,
  camX: number,
  viewW: number,
  _viewH: number,
  animTick: number
): void {
  // 1. Langit Terbuka Siang Hari Pasca Gempa (Sky Gradient)
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 260);
  skyGrad.addColorStop(0, '#38bdf8'); // Biru langit cerah
  skyGrad.addColorStop(0.5, '#7dd3fc');
  skyGrad.addColorStop(0.85, '#bae6fd');
  skyGrad.addColorStop(1, '#e2e8f0'); // Kabut debu tipis di cakrawala
  ctx.fillStyle = skyGrad;
  ctx.fillRect(camX, 0, viewW, 260);

  // Awan Mengambang Halus di Langit (Stylized Pixel Clouds)
  const cloudOffsets = [40, 380, 820, 1260, 1720, 2100];
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  for (const cx of cloudOffsets) {
    const driftX = (cx + animTick * 0.15) % 2400;
    if (driftX + 120 > camX && driftX - 40 < camX + viewW) {
      ctx.beginPath();
      ctx.arc(driftX, 48, 16, 0, Math.PI * 2);
      ctx.arc(driftX + 20, 42, 22, 0, Math.PI * 2);
      ctx.arc(driftX + 46, 46, 18, 0, Math.PI * 2);
      ctx.arc(driftX + 66, 52, 12, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 2. Siluet Gedung Sekolah di Latar Belakang (y: 110 - 360)
  // Menampilkan bangunan kelas 2 lantai dari mana siswa baru saja dievakuasi
  const bldgGrad = ctx.createLinearGradient(0, 110, 0, 360);
  bldgGrad.addColorStop(0, '#f1f5f9');
  bldgGrad.addColorStop(1, '#cbd5e1');
  ctx.fillStyle = bldgGrad;
  ctx.fillRect(camX, 120, viewW, 240);

  // Atap Genteng Merah Bata Sekolah (Terracotta Roof)
  ctx.fillStyle = '#991b1b';
  ctx.fillRect(camX, 105, viewW, 16);
  ctx.fillStyle = '#b91c1c';
  ctx.fillRect(camX, 105, viewW, 4);
  ctx.fillStyle = '#450a0a';
  ctx.fillRect(camX, 120, viewW, 2);

  // Deretan Jendela Kelas Lantai 2 & Lantai 1 (setiap 60px)
  const winOff = ((camX % 60) + 60) % 60;
  for (let wx = camX - winOff; wx < camX + viewW + 60; wx += 60) {
    // Jendela Lantai 2
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(wx + 8, 140, 36, 48);
    ctx.fillStyle = '#60a5fa';
    ctx.fillRect(wx + 10, 142, 15, 20);
    ctx.fillRect(wx + 27, 142, 15, 20);
    ctx.fillRect(wx + 10, 165, 15, 20);
    ctx.fillRect(wx + 27, 165, 15, 20);

    // Lis Pembatas Lantai 2 dan Lantai 1
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(camX, 204, viewW, 8);

    // Jendela Lantai 1
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(wx + 8, 224, 36, 48);
    ctx.fillStyle = '#93c5fd';
    ctx.fillRect(wx + 10, 226, 15, 20);
    ctx.fillRect(wx + 27, 226, 15, 20);
    ctx.fillRect(wx + 10, 249, 15, 20);
    ctx.fillRect(wx + 27, 249, 15, 20);
  }

  // 3. Efek Kerusakan Gempa di Dinding Luar Gedung (Cracked Walls & Warning Signs)
  // Retakan dinding di x: 420, 800, 1200, 1680
  const crackPoints = [420, 800, 1200, 1680];
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2.5;
  for (const cpx of crackPoints) {
    if (cpx + 60 > camX && cpx - 60 < camX + viewW) {
      ctx.beginPath();
      ctx.moveTo(cpx, 120);
      ctx.lineTo(cpx + 12, 160);
      ctx.lineTo(cpx - 6, 210);
      ctx.lineTo(cpx + 15, 270);
      ctx.lineTo(cpx + 4, 340);
      ctx.stroke();
    }
  }

  // 4. Pos Utilitas & Panel Listrik Darurat Pak Hendra (x: 290 - 350)
  if (camX < 380 && camX + viewW > 260) {
    ctx.save();
    // Tiang/Boks Panel Listrik
    ctx.fillStyle = '#475569';
    ctx.fillRect(300, 260, 36, 100);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(303, 263, 30, 48);

    // Indikator Listrik Padam [OFF]
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(308, 270, 26, 16);
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 6px monospace';
    ctx.fillText('[OFF]', 310, 281);

    // Tabung APAR Merah (Alat Pemadam Api Ringan)
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(344, 300, 10, 26);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(346, 308, 6, 6);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(347, 296, 4, 4); // Nozzle
    ctx.restore();
  }

  // 5. POSKO TENDA MEDIS PMI & TRIAGE LAPANGAN (x: 880 - 1080)
  if (camX < 1120 && camX + viewW > 840) {
    ctx.save();
    const tentX = 940;
    const tentY = 210;

    // Kanopi Tenda Segitiga PMI Putih Bersih
    ctx.beginPath();
    ctx.moveTo(tentX, tentY);
    ctx.lineTo(tentX - 80, 360);
    ctx.lineTo(tentX + 80, 360);
    ctx.closePath();
    ctx.fillStyle = '#f8fafc';
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Sisi samping tenda (bayangan abu-abu lembut)
    ctx.beginPath();
    ctx.moveTo(tentX, tentY);
    ctx.lineTo(tentX + 80, 360);
    ctx.lineTo(tentX + 115, 360);
    ctx.lineTo(tentX + 35, tentY + 15);
    ctx.closePath();
    ctx.fillStyle = '#e2e8f0';
    ctx.fill();

    // Logo Palang Merah (PMI Red Cross) Besar di Tengah Tenda
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(tentX - 4, tentY + 45, 8, 26);
    ctx.fillRect(tentX - 13, tentY + 54, 26, 8);

    // Spanduk Posko Medis
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(tentX - 55, tentY + 80, 110, 16);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(tentX - 55, tentY + 80, 110, 16);
    ctx.fillStyle = '#b91c1c';
    ctx.font = 'bold 5.5px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('POSKO MEDIS PMI', tentX, tentY + 91);

    // Velbed Darurat (Tempat Tidur Pasien P3K)
    ctx.fillStyle = '#15803d'; // Rangka hijau tentara/medis
    ctx.fillRect(tentX - 60, 335, 42, 6);
    ctx.fillStyle = '#166534';
    ctx.fillRect(tentX - 60, 341, 4, 18);
    ctx.fillRect(tentX - 22, 341, 4, 18);
    // Bantal & Selimut
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(tentX - 58, 331, 10, 5);
    ctx.fillStyle = '#86efac';
    ctx.fillRect(tentX - 46, 333, 26, 4);

    // Kotak Obat P3K Putih dengan Palang Merah
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(tentX + 35, 340, 16, 14);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(tentX + 41, 343, 4, 8);
    ctx.fillRect(tentX + 39, 345, 8, 4);

    // Tiang Infus (IV Drip Stand)
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(tentX - 65, 305);
    ctx.lineTo(tentX - 65, 360);
    ctx.stroke();
    ctx.fillStyle = '#60a5fa'; // Kantung cairan infus
    ctx.fillRect(tentX - 69, 308, 8, 12);

    ctx.restore();
  }

  // 6. TIANG BENDERA MERAH PUTIH INDONESIA (x: 1380)
  if (camX < 1440 && camX + viewW > 1320) {
    ctx.save();
    const poleX = 1380;
    // Pondasi Tiang Bendera Beton 3 Tingkat
    ctx.fillStyle = '#475569';
    ctx.fillRect(poleX - 24, 350, 48, 10);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(poleX - 16, 344, 32, 6);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(poleX - 8, 340, 16, 4);

    // Tiang Stainless Steel Tinggi (y: 80 - 340)
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(poleX - 2, 80, 4, 260);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(poleX - 1, 80, 2, 260); // Highlight kilau

    // Puncak Tiang Emas
    ctx.beginPath();
    ctx.arc(poleX, 78, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#fbbf24';
    ctx.fill();

    // Bendera Merah Putih Berkibar Dinamis
    const flagW = 46;
    const flagH = 28;
    const wave = Math.sin(animTick * 0.08) * 3;

    // Warna Merah
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(poleX + 2, 84);
    ctx.quadraticCurveTo(poleX + flagW / 2, 84 + wave, poleX + flagW, 84 - wave);
    ctx.lineTo(poleX + flagW, 84 + flagH / 2 - wave);
    ctx.quadraticCurveTo(poleX + flagW / 2, 84 + flagH / 2 + wave, poleX + 2, 84 + flagH / 2);
    ctx.closePath();
    ctx.fill();

    // Warna Putih
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(poleX + 2, 84 + flagH / 2);
    ctx.quadraticCurveTo(poleX + flagW / 2, 84 + flagH / 2 + wave, poleX + flagW, 84 + flagH / 2 - wave);
    ctx.lineTo(poleX + flagW, 84 + flagH - wave);
    ctx.quadraticCurveTo(poleX + flagW / 2, 84 + flagH + wave, poleX + 2, 84 + flagH);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // 7. RAMBU TITIK KUMPUL RESMI BNPB / ISO 7010 (SESUAI SS GAMBAR 3)
  if (camX < 1550 && camX + viewW > 1410) {
    ctx.save();
    const signX = 1480;
    const signW = 66;
    const signH = 80;
    const signTopY = 135;

    // Tiang Rambu Baja Kuat
    ctx.fillStyle = '#475569';
    ctx.fillRect(signX - 3.5, signTopY + signH, 7, 360 - (signTopY + signH));
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(signX - 1.5, signTopY + signH, 2, 360 - (signTopY + signH)); // Kilau tiang

    // Latar Papan Rambu Hijau Tua BNPB (#14532d)
    ctx.fillStyle = '#14532d';
    ctx.fillRect(signX - signW / 2, signTopY, signW, signH);

    // Bingkai Putih Tepi Rambu (Inset Border)
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(signX - signW / 2 + 3, signTopY + 3, signW - 6, signH - 6);

    // ── 4 PANAH PUTIH MENUNJUK KE TITIK TENGAH (SESUAI SS GAMBAR 3) ──
    ctx.fillStyle = '#ffffff';

    // 1. Panah Pojok Kiri Atas (Menunjuk ke Tengah Bawah-Kanan)
    ctx.beginPath();
    ctx.moveTo(signX - signW / 2 + 6, signTopY + 6);
    ctx.lineTo(signX - signW / 2 + 14, signTopY + 6);
    ctx.lineTo(signX - signW / 2 + 6, signTopY + 14);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(signX - signW / 2 + 11, signTopY + 11);
    ctx.lineTo(signX - signW / 2 + 17, signTopY + 17);
    ctx.lineTo(signX - signW / 2 + 14, signTopY + 19);
    ctx.lineTo(signX - signW / 2 + 8, signTopY + 13);
    ctx.closePath();
    ctx.fill();

    // 2. Panah Pojok Kanan Atas (Menunjuk ke Tengah Bawah-Kiri)
    ctx.beginPath();
    ctx.moveTo(signX + signW / 2 - 6, signTopY + 6);
    ctx.lineTo(signX + signW / 2 - 14, signTopY + 6);
    ctx.lineTo(signX + signW / 2 - 6, signTopY + 14);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(signX + signW / 2 - 11, signTopY + 11);
    ctx.lineTo(signX + signW / 2 - 17, signTopY + 17);
    ctx.lineTo(signX + signW / 2 - 14, signTopY + 19);
    ctx.lineTo(signX + signW / 2 - 8, signTopY + 13);
    ctx.closePath();
    ctx.fill();

    // 3. Panah Pojok Kiri Bawah (Di Atas Teks)
    ctx.beginPath();
    ctx.moveTo(signX - signW / 2 + 6, signTopY + 54);
    ctx.lineTo(signX - signW / 2 + 14, signTopY + 54);
    ctx.lineTo(signX - signW / 2 + 6, signTopY + 46);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(signX - signW / 2 + 11, signTopY + 49);
    ctx.lineTo(signX - signW / 2 + 17, signTopY + 43);
    ctx.lineTo(signX - signW / 2 + 14, signTopY + 41);
    ctx.lineTo(signX - signW / 2 + 8, signTopY + 47);
    ctx.closePath();
    ctx.fill();

    // 4. Panah Pojok Kanan Bawah (Di Atas Teks)
    ctx.beginPath();
    ctx.moveTo(signX + signW / 2 - 6, signTopY + 54);
    ctx.lineTo(signX + signW / 2 - 14, signTopY + 54);
    ctx.lineTo(signX + signW / 2 - 6, signTopY + 46);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(signX + signW / 2 - 11, signTopY + 49);
    ctx.lineTo(signX + signW / 2 - 17, signTopY + 43);
    ctx.lineTo(signX + signW / 2 - 14, signTopY + 41);
    ctx.lineTo(signX + signW / 2 - 8, signTopY + 47);
    ctx.closePath();
    ctx.fill();

    // ── 4 SILUET ORANG DI TENGAH (1 DEPAN, 3 BELAKANG SESUAI SS GAMBAR 3) ──
    // Kepala Belakang Atas
    ctx.beginPath();
    ctx.arc(signX, signTopY + 19, 4, 0, Math.PI * 2);
    ctx.fill();

    // Kepala Belakang Kiri
    ctx.beginPath();
    ctx.arc(signX - 9, signTopY + 25, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(signX - 14, signTopY + 29, 10, 14);

    // Kepala Belakang Kanan
    ctx.beginPath();
    ctx.arc(signX + 9, signTopY + 25, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(signX + 4, signTopY + 29, 10, 14);

    // Badan Belakang Atas
    ctx.fillRect(signX - 5, signTopY + 23, 10, 14);

    // Figur Orang Utama di Depan (Kepala & Badan Lengkap dengan Garis Pemisah)
    ctx.beginPath();
    ctx.arc(signX, signTopY + 31, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Lengan & Tubuh Depan
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(signX - 7, signTopY + 36, 14, 17);
    // Garis leher/pemisah lengan gelap tipis
    ctx.fillStyle = '#14532d';
    ctx.fillRect(signX - 4, signTopY + 40, 2, 13);
    ctx.fillRect(signX + 2, signTopY + 40, 2, 13);

    // ── TEKS BOLD BESAR: TITIK KUMPUL (PERSIS GAMBAR 3) ──
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = '900 7px "Press Start 2P", monospace';
    ctx.fillText('TITIK', signX, signTopY + 62);
    ctx.font = '900 6px "Press Start 2P", monospace';
    ctx.fillText('KUMPUL', signX, signTopY + 72);

    ctx.restore();
  }

  // 8. TENDA KOMANDO KEPALA SEKOLAH & PRESENSI GURU (x: 1560 - 1700)
  if (camX < 1740 && camX + viewW > 1520) {
    ctx.save();
    const cTentX = 1620;
    // Tenda Kanopi Biru-Oranye
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(cTentX - 50, 240, 100, 16);
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(cTentX - 50, 256, 100, 6);

    // Tiang Penyangga Tenda
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(cTentX - 48, 262, 4, 98);
    ctx.fillRect(cTentX + 44, 262, 4, 98);

    // Meja Presensi & Koordinasi
    ctx.fillStyle = '#78350f';
    ctx.fillRect(cTentX - 32, 324, 64, 8);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(cTentX - 28, 332, 4, 28);
    ctx.fillRect(cTentX + 24, 332, 4, 28);

    // Megaphone / Pengeras Suara TOA Putih-Merah di Meja
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(cTentX - 18, 314, 12, 8);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(cTentX - 6, 312, 6, 12);

    // Papan Catatan Presensi Siswa (Clipboard)
    ctx.fillStyle = '#d97706';
    ctx.fillRect(cTentX + 6, 312, 14, 12);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cTentX + 8, 314, 10, 8);

    // Spanduk Posko Komando
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(cTentX - 44, 266, 88, 14);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1;
    ctx.strokeRect(cTentX - 44, 266, 88, 14);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 5px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('POSKO PRESENSI', cTentX, 276);

    ctx.restore();
  }

  // 9. AMBULANS TRANSIT EVAKUASI (DI SEBELAH KIRI PINTU KELUAR, x: 1840)
  if (camX + viewW > 1750 && camX < 1960) {
    ctx.save();
    const ambX = 1840;
    const ambY = 281; // Posisi vertikal presisi agar roda napak tanah sempurna di y = 360

    // 1. Bayangan Kontak Tanah (Ground Contact Shadow di Bawah Roda)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
    ctx.fillRect(ambX - 60, 358, 142, 2.5);
    ctx.fillRect(ambX - 38, 359, 20, 2);
    ctx.fillRect(ambX + 36, 359, 20, 2);

    // 2. Bumper Baja Depan & Belakang
    ctx.fillStyle = '#475569';
    ctx.fillRect(ambX - 60, ambY + 46, 4, 18); // Bumper belakang
    ctx.fillRect(ambX + 74, ambY + 46, 5, 18); // Bumper depan

    // 3. Bodi Utama Ambulans Putih Bersih (Kotak Kabin Pasien Belakang)
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(ambX - 56, ambY, 104, 64);
    // Moncong Depan Kap Mesin & Grille (Menghadap Kanan)
    ctx.fillRect(ambX + 48, ambY + 22, 26, 42);

    // Grille Depan & Lampu Utama
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(ambX + 71, ambY + 38, 3, 16);
    ctx.fillStyle = '#fef08a'; // Lampu depan kuning keemasan
    ctx.fillRect(ambX + 71, ambY + 26, 3, 8);

    // 4. Jendela Kaca Biru Presisi (Tercakup 100% di Dalam Kabin Tanpa Menggantung di Udara)
    // Jendela 1: Pasien Belakang
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(ambX - 48, ambY + 7, 30, 18);
    // Jendela 2: Pintu Samping Pasien
    ctx.fillRect(ambX - 12, ambY + 7, 28, 18);
    // Jendela 3: Kabin Pengemudi
    ctx.fillRect(ambX + 22, ambY + 7, 22, 18);

    // Kaca Depan Miring (Windshield Glass Slope) Menghubungkan Atap ke Kap Mesin
    ctx.beginPath();
    ctx.moveTo(ambX + 44, ambY + 7);
    ctx.lineTo(ambX + 50, ambY + 22);
    ctx.lineTo(ambX + 44, ambY + 22);
    ctx.closePath();
    ctx.fill();

    // Bingkai & Pilar Putih Antar Kaca
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(ambX - 18, ambY + 5, 6, 22); // Pilar 1
    ctx.fillRect(ambX + 16, ambY + 5, 6, 22); // Pilar 2

    // 5. Garis Stripping Oranye & Merah Tanggap Bencana di Bodi Ambulans
    ctx.fillStyle = '#f97316';
    ctx.fillRect(ambX - 56, ambY + 36, 130, 6);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(ambX - 56, ambY + 42, 130, 3);

    // 6. Simbol Palang Biru Ambulans (Star of Life Cross)
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(ambX - 31, ambY + 13, 4, 14);
    ctx.fillRect(ambX - 36, ambY + 18, 14, 4);

    // 7. Spatbor / Lengkungan Roda (Wheel Wells)
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(ambX - 28, 346, 16, Math.PI, 0);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ambX + 46, 346, 16, Math.PI, 0);
    ctx.fill();

    // 8. Roda Ambulans Napak Tanah Sempurna (Pusat Y: 346, Radius: 14, Dasar: 360)
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(ambX - 28, 346, 14, 0, Math.PI * 2);
    ctx.arc(ambX + 46, 346, 14, 0, Math.PI * 2);
    ctx.fill();

    // Velg Perak & Dop Roda
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(ambX - 28, 346, 6, 0, Math.PI * 2);
    ctx.arc(ambX + 46, 346, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.arc(ambX - 28, 346, 2.5, 0, Math.PI * 2);
    ctx.arc(ambX + 46, 346, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // 9. Lampu Strobo Sirine Darurat Berkelip di Atap Kabin Pengemudi
    const flashTick = Math.floor(animTick / 8) % 2;
    // Dudukan Sirine
    ctx.fillStyle = '#334155';
    ctx.fillRect(ambX + 24, ambY - 3, 24, 3);

    // Lampu Merah (Kiri) & Biru (Kanan)
    ctx.fillStyle = flashTick === 1 ? '#ef4444' : '#7f1d1d';
    ctx.fillRect(ambX + 25, ambY - 9, 10, 6);
    ctx.fillStyle = flashTick === 0 ? '#38bdf8' : '#1e3a8a';
    ctx.fillRect(ambX + 37, ambY - 9, 10, 6);

    // Efek Cahaya Pendaran Strobo
    ctx.fillStyle = flashTick === 0 ? 'rgba(56, 189, 248, 0.28)' : 'rgba(239, 68, 68, 0.28)';
    ctx.beginPath();
    ctx.arc(ambX + 36, ambY - 6, 26, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

// ── PINTU KEMBALI MENUJU KELAS 8A DARI LAPANGAN (PORTAL BACK AREA 3) ──
export function drawAssemblyFieldBackDoor(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number
): void {
  ctx.save();
  const doorW = 56;
  const doorH = 96;
  const topY = y - doorH;

  // 1. Kusen Pintu Kaca Masuk Gedung Sekolah
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x - doorW / 2 - 4, topY - 4, doorW + 8, doorH + 4);
  ctx.fillStyle = '#334155';
  ctx.fillRect(x - doorW / 2 - 2, topY - 2, doorW + 4, doorH + 2);

  // 2. Ruang Masuk Lorong Menuju Kelas 8A (Terang dari Dalam Gedung)
  const hallGrad = ctx.createLinearGradient(x - doorW / 2, topY, x + doorW / 2, topY);
  hallGrad.addColorStop(0, '#64748b');
  hallGrad.addColorStop(0.5, '#cbd5e1');
  hallGrad.addColorStop(1, '#f1f5f9');
  ctx.fillStyle = hallGrad;
  ctx.fillRect(x - doorW / 2, topY, doorW, doorH);

  // Kaca Pintu Reflektif Biru & Gagang Baja
  ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.fillRect(x - doorW / 2 + 4, topY + 8, doorW / 2 - 6, doorH - 16);
  ctx.fillRect(x + 2, topY + 8, doorW / 2 - 6, doorH - 16);

  // Garis Pemisah Daun Pintu Ganda
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x - 1, topY, 2, doorH);

  // Gagang Pintu Vertikal
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(x - 6, topY + 44, 3, 16);
  ctx.fillRect(x + 3, topY + 44, 3, 16);

  // Plakat Nama Pintu di Atas
  const plaqueW = 76;
  const plaqueH = 15;
  const plaqueY = topY - 20;
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x - plaqueW / 2, plaqueY, plaqueW, plaqueH);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x - plaqueW / 2, plaqueY, plaqueW, plaqueH);

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 5.5px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('RUANG KELAS 8A', x, plaqueY + 11);

  // Rambu Hijau Evakuasi Balik
  const signW = 56;
  const signH = 12;
  const signY = plaqueY - 14;
  ctx.fillStyle = '#15803d';
  ctx.fillRect(x - signW / 2, signY, signW, signH);
  ctx.strokeStyle = '#4ade80';
  ctx.lineWidth = 1;
  ctx.strokeRect(x - signW / 2, signY, signW, signH);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 5px "Press Start 2P", monospace';
  ctx.fillText('EVAKUASI', x, signY + 9);

  ctx.restore();
}
