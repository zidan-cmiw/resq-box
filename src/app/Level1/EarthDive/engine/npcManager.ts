// ── src/app/Level1/EarthDive/engine/npcManager.ts ─────────────────────────────
// Pengelola State & Kecerdasan Buatan (AI Patrol) NPC 2D Level 1 Earth Dive
// Mendukung jalan santai bolak-balik (patrol/wander), pause idle, dan interaksi proximity pemain.

import type { ZoneConfig } from './zones';
import { getGroundY } from './zones';
import type { PlayerState } from './player';

export interface NpcState {
  id: string;
  npcType:
    | 'zidane'
    | 'zahra'
    | 'ican'
    | 'lintang'
    | 'bu_tyas'
    | 'prof_raditya'
    | 'kapten_maya'
    | 'dr_gea'
    | 'prof_andini'
    | 'inspektur_budi'
    | 'komandan_hendra'
    | 'prof_sarah'
    | 'dr_bayu'
    | 'dr_danang'
    | 'petugas_rudi'
    | 'komandan_surya'
    | 'dr_fajar'
    | 'prof_ratna'
    | 'dr_aris'
    | 'petugas_joko'
    | 'komandan_teguh'
    | 'dr_bagus'
    | 'prof_lestari'
    | 'dr_farhan'
    | 'petugas_dian'
    | 'komandan_bintang'
    | 'dr_taufik'
    | 'prof_maya'
    | 'dr_citra'
    | 'prof_ilham'
    | 'komandan_satria'
    | 'komandan_arya'
    | 'komandan_guntur'
    | 'dr_maya_trans'
    | 'prof_sarah_trans'
    | 'dr_taufik_trans'
    | 'petugas_rudi_trans';
  name: string;
  dialogueId: string;
  x: number;
  y: number;
  anchorX: number;
  patrolRange: number; // Jarak jelajah ke kiri & kanan (pixel)
  speed: number;
  dir: 'left' | 'right';
  state: 'idle_right' | 'walk_left' | 'idle_left' | 'walk_right';
  stateTimer: number;
  isTalking: boolean;
  animFrame: number;
  isFleeing?: boolean;
  hasMaterial?: boolean;
  discoveryKey?: string;
}

export function createInitialNpcs(zoneIndex: number): Map<string, NpcState> {
  const map = new Map<string, NpcState>();

  if (zoneIndex === 0) {
    // ── ZONA 0: PERMUKAAN BUMI (TIM EKSPEDISI RESQ-BOX) ──
    const zidane: NpcState = {
      id: 'z0_npc_zidane',
      npcType: 'zidane',
      name: 'Zidane',
      dialogueId: 'z0_zidane_dialogue',
      x: 180,
      y: 360,
      anchorX: 180,
      patrolRange: 32,
      speed: 0.45,
      dir: 'right',
      state: 'idle_right',
      stateTimer: 60,
      isTalking: false,
      animFrame: 0,
    };
    map.set(zidane.id, zidane);
    map.set('npc_raditya', zidane);

    const zahra: NpcState = {
      id: 'z0_npc_zahra',
      npcType: 'zahra',
      name: 'Zahra',
      dialogueId: 'z0_zahra_dialogue',
      x: 900,
      y: 325,
      anchorX: 900,
      patrolRange: 26,
      speed: 0.35,
      dir: 'right',
      state: 'idle_right',
      stateTimer: 80,
      isTalking: false,
      animFrame: 0,
    };
    map.set(zahra.id, zahra);
    map.set('npc_maya', zahra);
    map.set('z0_npc_lintang', zahra);
  } else if (zoneIndex === 1) {
    // ── ZONA 1: KERAK BUMI / LITOSFER ──
    const zidane: NpcState = {
      id: 'z1_npc_zidane',
      npcType: 'zidane',
      name: 'Zidane',
      dialogueId: 'z1_zidane_dialogue',
      x: 170,
      y: 370,
      anchorX: 170,
      patrolRange: 30,
      speed: 0.4,
      dir: 'right',
      state: 'idle_right',
      stateTimer: 65,
      isTalking: false,
      animFrame: 0,
    };
    map.set(zidane.id, zidane);
    map.set('npc_gea', zidane);

    const lintang: NpcState = {
      id: 'z1_npc_lintang',
      npcType: 'lintang',
      name: 'Lintang',
      dialogueId: 'z1_lintang_dialogue',
      x: 540,
      y: 295,
      anchorX: 540,
      patrolRange: 24,
      speed: 0.35,
      dir: 'left',
      state: 'idle_left',
      stateTimer: 80,
      isTalking: false,
      animFrame: 0,
      hasMaterial: true,
      discoveryKey: 'crust_disc_compare',
    };
    map.set(lintang.id, lintang);
    map.set('npc_andini', lintang);

    const ican: NpcState = {
      id: 'z1_npc_ican',
      npcType: 'ican',
      name: 'Ican',
      dialogueId: 'z1_ican_dialogue',
      x: 860,
      y: 360,
      anchorX: 860,
      patrolRange: 26,
      speed: 0.4,
      dir: 'right',
      state: 'idle_right',
      stateTimer: 70,
      isTalking: false,
      animFrame: 0,
    };
    map.set(ican.id, ican);
    map.set('npc_budi', ican);

    const buTyas: NpcState = {
      id: 'z1_npc_bu_tyas',
      npcType: 'bu_tyas',
      name: 'Bu Tyas',
      dialogueId: 'z1_bu_tyas_dialogue',
      x: 1080,
      y: 320,
      anchorX: 1080,
      patrolRange: 16,
      speed: 0.3,
      dir: 'left',
      state: 'idle_left',
      stateTimer: 90,
      isTalking: false,
      animFrame: 0,
    };
    map.set(buTyas.id, buTyas);
    map.set('npc_hendra', buTyas);

    const teknisiJoko: NpcState = {
      id: 'crust_suit_merchant',
      npcType: 'petugas_joko',
      name: 'Teknisi Joko',
      dialogueId: 'crust_merchant_dialogue',
      x: 1150,
      y: 340,
      anchorX: 1150,
      patrolRange: 8,
      speed: 0.25,
      dir: 'left',
      state: 'idle_left',
      stateTimer: 100,
      isTalking: false,
      animFrame: 0,
    };
    map.set(teknisiJoko.id, teknisiJoko);
  } else if (zoneIndex === 2) {
    // ── ZONA 2: MANTEL BUMI ──
    const zahra: NpcState = {
      id: 'z2_npc_zahra',
      npcType: 'zahra',
      name: 'Zahra',
      dialogueId: 'z2_zahra_dialogue',
      x: 240,
      y: 320,
      anchorX: 240,
      patrolRange: 18,
      speed: 0.35,
      dir: 'right',
      state: 'idle_right',
      stateTimer: 65,
      isTalking: false,
      animFrame: 0,
      hasMaterial: true,
      discoveryKey: 'mantle_disc1',
    };
    map.set(zahra.id, zahra);
    map.set('npc_sarah', zahra);

    const lintang: NpcState = {
      id: 'z2_npc_lintang',
      npcType: 'lintang',
      name: 'Lintang',
      dialogueId: 'z2_lintang_dialogue',
      x: 700,
      y: 320,
      anchorX: 700,
      patrolRange: 18,
      speed: 0.35,
      dir: 'left',
      state: 'idle_left',
      stateTimer: 75,
      isTalking: false,
      animFrame: 0,
      hasMaterial: true,
      discoveryKey: 'mantle_disc2',
    };
    map.set(lintang.id, lintang);
    map.set('npc_danang', lintang);

    const buTyas: NpcState = {
      id: 'z2_npc_bu_tyas',
      npcType: 'bu_tyas',
      name: 'Bu Tyas',
      dialogueId: 'z2_bu_tyas_dialogue',
      x: 1130,
      y: 320,
      anchorX: 1130,
      patrolRange: 14,
      speed: 0.3,
      dir: 'left',
      state: 'idle_left',
      stateTimer: 90,
      isTalking: false,
      animFrame: 0,
    };
    map.set(buTyas.id, buTyas);
    map.set('npc_surya', buTyas);

    const teknisiRudi: NpcState = {
      id: 'mantle_suit_merchant',
      npcType: 'petugas_rudi',
      name: 'Teknisi Rudi',
      dialogueId: 'mantle_merchant_dialogue',
      x: 1175,
      y: 320,
      anchorX: 1175,
      patrolRange: 8,
      speed: 0.25,
      dir: 'left',
      state: 'idle_left',
      stateTimer: 100,
      isTalking: false,
      animFrame: 0,
    };
    map.set(teknisiRudi.id, teknisiRudi);
  } else if (zoneIndex === 3) {
    // ── ZONA 3: INTI LUAR (OUTER CORE) ──
    const zahra: NpcState = {
      id: 'z3_npc_zahra',
      npcType: 'zahra',
      name: 'Zahra',
      dialogueId: 'z3_zahra_dialogue',
      x: 380,
      y: 350,
      anchorX: 380,
      patrolRange: 24,
      speed: 0.35,
      dir: 'right',
      state: 'idle_right',
      stateTimer: 65,
      isTalking: false,
      animFrame: 0,
      hasMaterial: true,
      discoveryKey: 'oc_disc1',
    };
    map.set(zahra.id, zahra);
    map.set('npc_ratna', zahra);

    const lintang: NpcState = {
      id: 'z3_npc_lintang',
      npcType: 'lintang',
      name: 'Lintang',
      dialogueId: 'z3_lintang_dialogue',
      x: 780,
      y: 350,
      anchorX: 780,
      patrolRange: 24,
      speed: 0.35,
      dir: 'left',
      state: 'idle_left',
      stateTimer: 80,
      isTalking: false,
      animFrame: 0,
      hasMaterial: true,
      discoveryKey: 'oc_disc2',
    };
    map.set(lintang.id, lintang);
    map.set('npc_aris', lintang);

    const buTyas: NpcState = {
      id: 'z3_npc_bu_tyas',
      npcType: 'bu_tyas',
      name: 'Bu Tyas',
      dialogueId: 'z3_bu_tyas_dialogue',
      x: 1080,
      y: 350,
      anchorX: 1080,
      patrolRange: 18,
      speed: 0.3,
      dir: 'left',
      state: 'idle_left',
      stateTimer: 90,
      isTalking: false,
      animFrame: 0,
    };
    map.set(buTyas.id, buTyas);
    map.set('npc_teguh', buTyas);

    const teknisiDian: NpcState = {
      id: 'oc_suit_merchant',
      npcType: 'petugas_dian',
      name: 'Teknisi Dian',
      dialogueId: 'oc_merchant_dialogue',
      x: 1140,
      y: 350,
      anchorX: 1140,
      patrolRange: 8,
      speed: 0.25,
      dir: 'left',
      state: 'idle_left',
      stateTimer: 100,
      isTalking: false,
      animFrame: 0,
    };
    map.set(teknisiDian.id, teknisiDian);
  } else if (zoneIndex === 4) {
    // ── ZONA 4: INTI DALAM (INNER CORE) ──
    const zahra: NpcState = {
      id: 'z4_npc_zahra',
      npcType: 'zahra',
      name: 'Zahra',
      dialogueId: 'z4_zahra_dialogue',
      x: 330,
      y: 310,
      anchorX: 330,
      patrolRange: 22,
      speed: 0.35,
      dir: 'right',
      state: 'idle_right',
      stateTimer: 70,
      isTalking: false,
      animFrame: 0,
      hasMaterial: true,
      discoveryKey: 'ic_disc1',
    };
    map.set(zahra.id, zahra);
    map.set('npc_lestari', zahra);

    const lintang: NpcState = {
      id: 'z4_npc_lintang',
      npcType: 'lintang',
      name: 'Lintang',
      dialogueId: 'z4_lintang_dialogue',
      x: 730,
      y: 310,
      anchorX: 730,
      patrolRange: 22,
      speed: 0.35,
      dir: 'left',
      state: 'idle_left',
      stateTimer: 75,
      isTalking: false,
      animFrame: 0,
      hasMaterial: true,
      discoveryKey: 'ic_disc2',
    };
    map.set(lintang.id, lintang);
    map.set('npc_farhan', lintang);

    const buTyas: NpcState = {
      id: 'z4_npc_bu_tyas',
      npcType: 'bu_tyas',
      name: 'Bu Tyas',
      dialogueId: 'z4_bu_tyas_dialogue',
      x: 1100,
      y: 330,
      anchorX: 1100,
      patrolRange: 16,
      speed: 0.3,
      dir: 'left',
      state: 'idle_left',
      stateTimer: 90,
      isTalking: false,
      animFrame: 0,
    };
    map.set(buTyas.id, buTyas);
    map.set('npc_bintang', buTyas);

    const teknisiArya: NpcState = {
      id: 'ic_suit_merchant',
      npcType: 'komandan_arya',
      name: 'Teknisi Arya',
      dialogueId: 'ic_merchant_dialogue',
      x: 1160,
      y: 330,
      anchorX: 1160,
      patrolRange: 8,
      speed: 0.25,
      dir: 'left',
      state: 'idle_left',
      stateTimer: 100,
      isTalking: false,
      animFrame: 0,
    };
    map.set(teknisiArya.id, teknisiArya);
  } else if (zoneIndex === 5) {
    // ── ZONA 5: BATAS DIVERGEN & LEMBAH RETAKAN ──
    const zidane: NpcState = {
      id: 'z5_npc_zidane',
      npcType: 'zidane',
      name: 'Zidane',
      dialogueId: 'z5_zidane_dialogue',
      x: 170,
      y: 345,
      anchorX: 170,
      patrolRange: 15,
      speed: 0.3,
      dir: 'right',
      state: 'idle_right',
      stateTimer: 65,
      isTalking: false,
      animFrame: 0,
    };
    map.set(zidane.id, zidane);
    map.set('npc_taufik', zidane);

    const zahra: NpcState = {
      id: 'z5_npc_zahra',
      npcType: 'zahra',
      name: 'Zahra',
      dialogueId: 'z5_zahra_dialogue',
      x: 290,
      y: 355,
      anchorX: 290,
      patrolRange: 15,
      speed: 0.3,
      dir: 'right',
      state: 'idle_right',
      stateTimer: 80,
      isTalking: false,
      animFrame: 0,
      hasMaterial: true,
      discoveryKey: 'div_disc1',
    };
    map.set(zahra.id, zahra);
    map.set('npc_maya', zahra);

    const lintang: NpcState = {
      id: 'z5_npc_lintang',
      npcType: 'lintang',
      name: 'Lintang',
      dialogueId: 'z5_lintang_dialogue',
      x: 880,
      y: 345,
      anchorX: 880,
      patrolRange: 15,
      speed: 0.3,
      dir: 'right',
      state: 'idle_right',
      stateTimer: 70,
      isTalking: false,
      animFrame: 0,
      hasMaterial: true,
      discoveryKey: 'div_disc2',
    };
    map.set(lintang.id, lintang);
    map.set('npc_ilham', lintang);

    const buTyas: NpcState = {
      id: 'z5_npc_bu_tyas',
      npcType: 'bu_tyas',
      name: 'Bu Tyas',
      dialogueId: 'z5_bu_tyas_dialogue',
      x: 1140,
      y: 355,
      anchorX: 1140,
      patrolRange: 12,
      speed: 0.3,
      dir: 'left',
      state: 'idle_left',
      stateTimer: 90,
      isTalking: false,
      animFrame: 0,
    };
    map.set(buTyas.id, buTyas);
    map.set('npc_satria', buTyas);
  } else if (zoneIndex === 6) {
    // ── ZONA 6: BATAS KONVERGEN (SUBDUKSI & PEGUNUNGAN) ──
    const zidane: NpcState = {
      id: 'z6_npc_zidane',
      npcType: 'zidane',
      name: 'Zidane',
      dialogueId: 'z6_zidane_dialogue',
      x: 460,
      y: 310,
      anchorX: 460,
      patrolRange: 16,
      speed: 0.3,
      dir: 'right',
      state: 'idle_right',
      stateTimer: 80,
      isTalking: false,
      animFrame: 0,
      hasMaterial: true,
      discoveryKey: 'conv_disc1',
    };
    map.set(zidane.id, zidane);
    map.set('npc_farhan', zidane);

    const zahra: NpcState = {
      id: 'z6_npc_zahra',
      npcType: 'zahra',
      name: 'Zahra',
      dialogueId: 'z6_zahra_dialogue',
      x: 740,
      y: 310,
      anchorX: 740,
      patrolRange: 15,
      speed: 0.3,
      dir: 'left',
      state: 'idle_left',
      stateTimer: 90,
      isTalking: false,
      animFrame: 0,
      hasMaterial: true,
      discoveryKey: 'conv_disc2',
    };
    map.set(zahra.id, zahra);
    map.set('npc_ratna', zahra);

    const ican: NpcState = {
      id: 'z6_npc_ican',
      npcType: 'ican',
      name: 'Ican',
      dialogueId: 'z6_ican_dialogue',
      x: 960,
      y: 310,
      anchorX: 960,
      patrolRange: 14,
      speed: 0.35,
      dir: 'right',
      state: 'idle_right',
      stateTimer: 75,
      isTalking: false,
      animFrame: 0,
    };
    map.set(ican.id, ican);
    map.set('npc_bayu', ican);

    const buTyas: NpcState = {
      id: 'z6_npc_bu_tyas',
      npcType: 'bu_tyas',
      name: 'Bu Tyas',
      dialogueId: 'z6_bu_tyas_dialogue',
      x: 1380,
      y: 310,
      anchorX: 1380,
      patrolRange: 10,
      speed: 0.25,
      dir: 'left',
      state: 'idle_left',
      stateTimer: 90,
      isTalking: false,
      animFrame: 0,
    };
    map.set(buTyas.id, buTyas);
    map.set('npc_arya', buTyas);
  } else if (zoneIndex === 7) {
    const ican: NpcState = {
      id: 'z7_npc_ican',
      npcType: 'ican',
      name: 'Ican',
      dialogueId: 'z7_ican_dialogue',
      x: 560,
      y: 170,
      anchorX: 560,
      patrolRange: 14,
      speed: 0.3,
      dir: 'left',
      state: 'idle_left',
      stateTimer: 75,
      isTalking: false,
      animFrame: 0,
    };
    map.set(ican.id, ican);
    map.set('npc_rudi_trans', ican);

    const zahra: NpcState = {
      id: 'z7_npc_zahra',
      npcType: 'zahra',
      name: 'Zahra',
      dialogueId: 'z7_zahra_dialogue',
      x: 880,
      y: 160,
      anchorX: 880,
      patrolRange: 15,
      speed: 0.3,
      dir: 'right',
      state: 'idle_right',
      stateTimer: 90,
      isTalking: false,
      animFrame: 0,
      hasMaterial: true,
      discoveryKey: 'trans_sanandreas',
    };
    map.set(zahra.id, zahra);
    map.set('npc_sarah_trans', zahra);
    map.set('npc_taufik_trans', zahra);

    const buTyas: NpcState = {
      id: 'z7_npc_bu_tyas',
      npcType: 'bu_tyas',
      name: 'Bu Tyas',
      dialogueId: 'z7_bu_tyas_dialogue',
      x: 1360,
      y: 315,
      anchorX: 1360,
      patrolRange: 10,
      speed: 0.25,
      dir: 'left',
      state: 'idle_left',
      stateTimer: 90,
      isTalking: false,
      animFrame: 0,
    };
    map.set(buTyas.id, buTyas);
    map.set('npc_guntur_trans', buTyas);
  }

  return map;
}

export function updateNpcs(
  npcs: Map<string, NpcState>,
  zone: ZoneConfig,
  player: PlayerState,
  isPaused: boolean,
): void {
  if (isPaused) return;

  npcs.forEach((npc) => {
    npc.animFrame++;

    if (npc.isFleeing) {
      // NPC sedang dalam proses evakuasi darurat saat gempa konvergen
      return;
    }

    // Hitung jarak ke pemain
    const dx = player.x - npc.x;
    const dy = (player.y - player.height / 2) - (npc.y - 16);
    const distToPlayer = Math.sqrt(dx * dx + dy * dy);

    // Jika pemain sangat dekat (< 54px), NPC berhenti santai dan menghadap ke arah pemain
    if (distToPlayer < 54) {
      npc.isTalking = true;
      npc.dir = player.x < npc.x ? 'left' : 'right';
      return;
    }

    npc.isTalking = false;

    // ── FINITE STATE MACHINE: PATROL & IDLE SANTANG BOLAK-BALIK ──
    switch (npc.state) {
      case 'idle_right':
        npc.dir = 'right';
        npc.stateTimer--;
        if (npc.stateTimer <= 0) {
          npc.state = 'walk_left';
        }
        break;

      case 'walk_left':
        npc.dir = 'left';
        npc.x -= npc.speed;
        // Berbalik jika sudah mencapai batas patroli kiri
        if (npc.x <= npc.anchorX - npc.patrolRange) {
          npc.x = npc.anchorX - npc.patrolRange;
          npc.state = 'idle_left';
          npc.stateTimer = 90 + Math.floor(Math.random() * 60); // Jeda bernapas 1.5 - 2.5 detik
        }
        break;

      case 'idle_left':
        npc.dir = 'left';
        npc.stateTimer--;
        if (npc.stateTimer <= 0) {
          npc.state = 'walk_right';
        }
        break;

      case 'walk_right':
        npc.dir = 'right';
        npc.x += npc.speed;
        // Berbalik jika sudah mencapai batas patroli kanan
        if (npc.x >= npc.anchorX + npc.patrolRange) {
          npc.x = npc.anchorX + npc.patrolRange;
          npc.state = 'idle_right';
          npc.stateTimer = 90 + Math.floor(Math.random() * 60);
        }
        break;
    }

    // Pada zona transform (top-down), pertahankan koordinat Y 2D masing-masing NPC
    if (zone.id === 'transform') {
      return;
    }

    // Pada Batas Divergen (Area 6): NPC penyelam mengambang di air di atas dasar laut (buoyancy floating)
    if (zone.id === 'divergent') {
      const baseGroundY = getGroundY(zone, npc.x);
      const npcSeed = (npc.anchorX * 13 + (npc.npcType ? npc.npcType.length * 7 : 0)) % 100;
      const floatBob = Math.sin(npc.animFrame * 0.045 + npcSeed) * 4;
      npc.y = Math.round(baseGroundY - 42 + floatBob);
      return;
    }

    // Selalu tempelkan telapak kaki NPC tepat di atas kontur elevasi tanah / platform
    // Cek apakah NPC berada di atas platform (misal jembatan kayu Kapten Maya)
    let groundY = getGroundY(zone, npc.x);
    for (const plat of zone.platforms) {
      if (npc.x >= plat.x1 && npc.x <= plat.x2 && plat.y < groundY) {
        groundY = plat.y;
        break;
      }
    }
    npc.y = groundY;
  });
}
