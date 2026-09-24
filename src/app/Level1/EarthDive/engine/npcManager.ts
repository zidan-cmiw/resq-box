// ── src/app/Level1/EarthDive/engine/npcManager.ts ─────────────────────────────
// Pengelola State & Kecerdasan Buatan (AI Patrol) NPC 2D Level 1 Earth Dive
// Mendukung jalan santai bolak-balik (patrol/wander), pause idle, dan interaksi proximity pemain.

import type { ZoneConfig } from './zones';
import { getGroundY } from './zones';
import type { PlayerState } from './player';

export interface NpcState {
  id: string;
  npcType:
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
}

export function createInitialNpcs(zoneIndex: number): Map<string, NpcState> {
  const map = new Map<string, NpcState>();

  if (zoneIndex === 0) {
    // ── ZONA 0: PERMUKAAN BUMI ──
    // NPC 1: Prof. Raditya (Dekat Base Awal, px: 180)
    map.set('npc_raditya', {
      id: 'npc_raditya',
      npcType: 'prof_raditya',
      name: 'Prof. Raditya',
      dialogueId: 'prof_raditya_dialogue',
      x: 180,
      y: 360,
      anchorX: 180,
      patrolRange: 42,
      speed: 0.45,
      dir: 'right',
      state: 'idle_right',
      stateTimer: 60,
      isTalking: false,
      animFrame: 0,
    });

    // NPC 2: Kapten Maya (Di atas jembatan kayu / dekat rig pemboran, px: 920)
    map.set('npc_maya', {
      id: 'npc_maya',
      npcType: 'kapten_maya',
      name: 'Kapten Maya',
      dialogueId: 'kapten_maya_dialogue',
      x: 920,
      y: 325,
      anchorX: 920,
      patrolRange: 38,
      speed: 0.45,
      dir: 'left',
      state: 'idle_left',
      stateTimer: 75,
      isTalking: false,
      animFrame: 0,
    });
  } else if (zoneIndex === 1) {
    // ── ZONA 1: KERAK BUMI / LITOSFER ──
    // NPC 1: Dr. Gea (Ahli Mineralogi Kerak, di lereng awal dekat portal turun)
    map.set('npc_gea', {
      id: 'npc_gea',
      npcType: 'dr_gea',
      name: 'Dr. Gea',
      dialogueId: 'dr_gea_dialogue',
      x: 170,
      y: 370,
      anchorX: 170,
      patrolRange: 35,
      speed: 0.4,
      dir: 'right',
      state: 'idle_right',
      stateTimer: 65,
      isTalking: false,
      animFrame: 0,
    });

    // NPC 2: Prof. Andini (Peneliti Komparasi Kerak, di atas teras litosfer)
    map.set('npc_andini', {
      id: 'npc_andini',
      npcType: 'prof_andini',
      name: 'Prof. Andini',
      dialogueId: 'prof_andini_dialogue',
      x: 540,
      y: 295,
      anchorX: 540,
      patrolRange: 28,
      speed: 0.35,
      dir: 'left',
      state: 'idle_left',
      stateTimer: 80,
      isTalking: false,
      animFrame: 0,
    });

    // NPC 3: Inspektur Budi (Geofisikawan Stasiun Moho, dekat sesar patahan)
    map.set('npc_budi', {
      id: 'npc_budi',
      npcType: 'inspektur_budi',
      name: 'Inspektur Budi',
      dialogueId: 'inspektur_budi_dialogue',
      x: 860,
      y: 360,
      anchorX: 860,
      patrolRange: 32,
      speed: 0.4,
      dir: 'right',
      state: 'idle_right',
      stateTimer: 70,
      isTalking: false,
      animFrame: 0,
    });

    // NPC 4: Komandan Hendra (Kepala Penjaga Gerbang Seismik Moho)
    map.set('npc_hendra', {
      id: 'npc_hendra',
      npcType: 'komandan_hendra',
      name: 'Komandan Hendra',
      dialogueId: 'komandan_hendra_dialogue',
      x: 1060,
      y: 320,
      anchorX: 1060,
      patrolRange: 16,
      speed: 0.3,
      dir: 'left',
      state: 'idle_left',
      stateTimer: 90,
      isTalking: false,
      animFrame: 0,
    });
  } else if (zoneIndex === 2) {
    // ── ZONA 2: MANTEL BUMI ──
    // NPC 1: Dr. Bayu (Ahli Geologi Mantel, px: 260)
    map.set('npc_bayu', {
      id: 'npc_bayu',
      npcType: 'dr_bayu',
      name: 'Dr. Bayu',
      dialogueId: 'dr_bayu_dialogue',
      x: 260,
      y: 320,
      anchorX: 260,
      patrolRange: 20,
      speed: 0.35,
      dir: 'right',
      state: 'idle_right',
      stateTimer: 80,
      isTalking: false,
      animFrame: 0,
    });

    // NPC 2: Prof. Sarah (Peneliti Arus Panas Mantel, px: 330)
    map.set('npc_sarah', {
      id: 'npc_sarah',
      npcType: 'prof_sarah',
      name: 'Prof. Sarah',
      dialogueId: 'prof_sarah_dialogue',
      x: 330,
      y: 320,
      anchorX: 330,
      patrolRange: 24,
      speed: 0.35,
      dir: 'right',
      state: 'idle_right',
      stateTimer: 65,
      isTalking: false,
      animFrame: 0,
    });

    // NPC 3: Dr. Danang (Ahli Batuan Mantel, px: 730)
    map.set('npc_danang', {
      id: 'npc_danang',
      npcType: 'dr_danang',
      name: 'Dr. Danang',
      dialogueId: 'dr_danang_dialogue',
      x: 730,
      y: 320,
      anchorX: 730,
      patrolRange: 22,
      speed: 0.35,
      dir: 'right',
      state: 'idle_right',
      stateTimer: 70,
      isTalking: false,
      animFrame: 0,
    });

    // NPC 4: Petugas Rudi (Pengawas Suhu Mantel Bawah, px: 990)
    map.set('npc_rudi', {
      id: 'npc_rudi',
      npcType: 'petugas_rudi',
      name: 'Petugas Rudi',
      dialogueId: 'petugas_rudi_dialogue',
      x: 990,
      y: 330,
      anchorX: 990,
      patrolRange: 20,
      speed: 0.35,
      dir: 'left',
      state: 'idle_left',
      stateTimer: 80,
      isTalking: false,
      animFrame: 0,
    });

    // NPC 5: Komandan Surya (Penjaga Pintu Inti Luar, px: 1100)
    map.set('npc_surya', {
      id: 'npc_surya',
      npcType: 'komandan_surya',
      name: 'Komandan Surya',
      dialogueId: 'komandan_surya_dialogue',
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
    });
  } else if (zoneIndex === 3) {
    // ── ZONA 3: INTI LUAR ──
    // NPC 1: Dr. Fajar (Ahli Geologi Inti Luar, px: 270)
    map.set('npc_fajar', {
      id: 'npc_fajar',
      npcType: 'dr_fajar',
      name: 'Dr. Fajar',
      dialogueId: 'dr_fajar_dialogue',
      x: 270,
      y: 310,
      anchorX: 270,
      patrolRange: 20,
      speed: 0.35,
      dir: 'right',
      state: 'idle_right',
      stateTimer: 80,
      isTalking: false,
      animFrame: 0,
    });

    // NPC 2: Prof. Ratna (Peneliti Logam Cair Inti Luar, px: 330)
    map.set('npc_ratna', {
      id: 'npc_ratna',
      npcType: 'prof_ratna',
      name: 'Prof. Ratna',
      dialogueId: 'prof_ratna_dialogue',
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
    });

    // NPC 3: Dr. Aris (Ahli Medan Magnet Bumi, px: 730)
    map.set('npc_aris', {
      id: 'npc_aris',
      npcType: 'dr_aris',
      name: 'Dr. Aris',
      dialogueId: 'dr_aris_dialogue',
      x: 730,
      y: 310,
      anchorX: 730,
      patrolRange: 24,
      speed: 0.35,
      dir: 'right',
      state: 'idle_right',
      stateTimer: 65,
      isTalking: false,
      animFrame: 0,
    });

    // NPC 4: Petugas Joko (Pengawas Radiasi Magnetik, px: 1020)
    map.set('npc_joko', {
      id: 'npc_joko',
      npcType: 'petugas_joko',
      name: 'Petugas Joko',
      dialogueId: 'petugas_joko_dialogue',
      x: 1020,
      y: 330,
      anchorX: 1020,
      patrolRange: 18,
      speed: 0.35,
      dir: 'left',
      state: 'idle_left',
      stateTimer: 85,
      isTalking: false,
      animFrame: 0,
    });

    // NPC 5: Komandan Teguh (Penjaga Pintu Inti Dalam, px: 1120)
    map.set('npc_teguh', {
      id: 'npc_teguh',
      npcType: 'komandan_teguh',
      name: 'Komandan Teguh',
      dialogueId: 'komandan_teguh_dialogue',
      x: 1120,
      y: 330,
      anchorX: 1120,
      patrolRange: 16,
      speed: 0.3,
      dir: 'left',
      state: 'idle_left',
      stateTimer: 90,
      isTalking: false,
      animFrame: 0,
    });
  } else if (zoneIndex === 4) {
    // ══════════════════════════════════════════════════════════════════════════
    // ZONA 4: INTI DALAM (Bola Besi Padat & Altar Pusat Bumi 6.371 KM)
    // ══════════════════════════════════════════════════════════════════════════

    // NPC 1: Dr. Bagus (Pemandu Geofisika Inti Dalam, px: 270)
    map.set('npc_bagus', {
      id: 'npc_bagus',
      npcType: 'dr_bagus',
      name: 'Dr. Bagus',
      dialogueId: 'dr_bagus_dialogue',
      x: 270,
      y: 300,
      anchorX: 270,
      patrolRange: 18,
      speed: 0.35,
      dir: 'right',
      state: 'idle_right',
      stateTimer: 60,
      isTalking: false,
      animFrame: 0,
    });

    // NPC 2: Prof. Lestari (Peneliti Kristal Besi Inti Dalam, px: 340)
    map.set('npc_lestari', {
      id: 'npc_lestari',
      npcType: 'prof_lestari',
      name: 'Prof. Lestari',
      dialogueId: 'prof_lestari_dialogue',
      x: 340,
      y: 300,
      anchorX: 340,
      patrolRange: 16,
      speed: 0.3,
      dir: 'right',
      state: 'idle_right',
      stateTimer: 80,
      isTalking: false,
      animFrame: 0,
    });

    // NPC 3: Dr. Farhan (Ahli Gravitasi Pusat Bumi, px: 680 di Altar Mahkota)
    map.set('npc_farhan', {
      id: 'npc_farhan',
      npcType: 'dr_farhan',
      name: 'Dr. Farhan',
      dialogueId: 'dr_farhan_dialogue',
      x: 680,
      y: 240,
      anchorX: 680,
      patrolRange: 15,
      speed: 0.35,
      dir: 'left',
      state: 'idle_left',
      stateTimer: 75,
      isTalking: false,
      animFrame: 0,
    });

    // NPC 4: Petugas Dian (Pengawas Kapsul Evakuasi Inti, px: 900)
    map.set('npc_dian', {
      id: 'npc_dian',
      npcType: 'petugas_dian',
      name: 'Petugas Dian',
      dialogueId: 'petugas_dian_dialogue',
      x: 900,
      y: 310,
      anchorX: 900,
      patrolRange: 18,
      speed: 0.35,
      dir: 'right',
      state: 'idle_right',
      stateTimer: 85,
      isTalking: false,
      animFrame: 0,
    });

    // NPC 5: Komandan Bintang (Kepala Ekspedisi Pusat Bumi, px: 1040)
    map.set('npc_bintang', {
      id: 'npc_bintang',
      npcType: 'komandan_bintang',
      name: 'Komandan Bintang',
      dialogueId: 'komandan_bintang_dialogue',
      x: 1040,
      y: 310,
      anchorX: 1040,
      patrolRange: 16,
      speed: 0.3,
      dir: 'left',
      state: 'idle_left',
      stateTimer: 90,
      isTalking: false,
      animFrame: 0,
    });
  } else if (zoneIndex === 5) {
    // ══════════════════════════════════════════════════════════════════════════
    // ZONA 5: BATAS DIVERGEN & LEMBAH RETAKAN (East African Rift & Pangea)
    // ══════════════════════════════════════════════════════════════════════════

    // NPC 1: Dr. Taufik (Pemandu & Geologis Batas Divergen, px: 170)
    map.set('npc_taufik', {
      id: 'npc_taufik',
      npcType: 'dr_taufik',
      name: 'Dr. Taufik',
      dialogueId: 'dr_taufik_dialogue',
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
    });

    // NPC 2: Prof. Maya (Ahli Teori Drift Benua & Superbenua Purba, px: 290)
    map.set('npc_maya', {
      id: 'npc_maya',
      npcType: 'prof_maya',
      name: 'Prof. Maya',
      dialogueId: 'prof_maya_dialogue',
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
    });

    // NPC 3: Dr. Citra (Peneliti Pegunungan Kembar, px: 600)
    map.set('npc_citra', {
      id: 'npc_citra',
      npcType: 'dr_citra',
      name: 'Dr. Citra',
      dialogueId: 'dr_citra_dialogue',
      x: 600,
      y: 355,
      anchorX: 600,
      patrolRange: 15,
      speed: 0.3,
      dir: 'left',
      state: 'idle_left',
      stateTimer: 75,
      isTalking: false,
      animFrame: 0,
    });

    // NPC 4: Prof. Ilham (Pengamat Dinamika Pemekaran Divergen, px: 880)
    map.set('npc_ilham', {
      id: 'npc_ilham',
      npcType: 'prof_ilham',
      name: 'Prof. Ilham',
      dialogueId: 'prof_ilham_dialogue',
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
    });

    // NPC 5: Komandan Satria (Kepala Pengawas Gerbang Patahan Divergen, px: 1140)
    map.set('npc_satria', {
      id: 'npc_satria',
      npcType: 'komandan_satria',
      name: 'Komandan Satria',
      dialogueId: 'komandan_satria_dialogue',
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
    });
  } else if (zoneIndex === 6) {
    // ── ZONA 6: BATAS KONVERGEN (SUBDUKSI & PEGUNUNGAN VULKANIK) ──
    // NPC 1: Dr. Farhan (Ahli Geologi Subduksi Lempeng, px: 620 di pesisir Kerak Benua)
    map.set('npc_farhan', {
      id: 'npc_farhan',
      npcType: 'dr_farhan',
      name: 'Dr. Farhan',
      dialogueId: 'dr_farhan_conv_dialogue',
      x: 620,
      y: 360,
      anchorX: 620,
      patrolRange: 16,
      speed: 0.3,
      dir: 'right',
      state: 'idle_right',
      stateTimer: 80,
      isTalking: false,
      animFrame: 0,
    });

    // NPC 2: Prof. Ratna (Ahli Vulkanologi & 3 Bentang Alam Tumbukan, px: 840 di lereng gunung)
    map.set('npc_ratna', {
      id: 'npc_ratna',
      npcType: 'prof_ratna',
      name: 'Prof. Ratna',
      dialogueId: 'prof_ratna_conv_dialogue',
      x: 840,
      y: 280,
      anchorX: 840,
      patrolRange: 15,
      speed: 0.3,
      dir: 'left',
      state: 'idle_left',
      stateTimer: 90,
      isTalking: false,
      animFrame: 0,
    });

    // NPC 3: Dr. Bayu (Peneliti Vulkanologi & Teras Batuan Andesit, px: 1100 di lereng timur)
    map.set('npc_bayu', {
      id: 'npc_bayu',
      npcType: 'dr_bayu',
      name: 'Dr. Bayu',
      dialogueId: 'dr_bayu_conv_dialogue',
      x: 1100,
      y: 280,
      anchorX: 1100,
      patrolRange: 14,
      speed: 0.3,
      dir: 'right',
      state: 'idle_right',
      stateTimer: 75,
      isTalking: false,
      animFrame: 0,
    });

    // NPC 4: Komandan Arya (Kepala Pengawas Altar Batas Konvergen, px: 1380 di altar akhir)
    map.set('npc_arya', {
      id: 'npc_arya',
      npcType: 'komandan_arya',
      name: 'Komandan Arya',
      dialogueId: 'komandan_arya_dialogue',
      x: 1380,
      y: 345,
      anchorX: 1380,
      patrolRange: 10,
      speed: 0.25,
      dir: 'left',
      state: 'idle_left',
      stateTimer: 90,
      isTalking: false,
      animFrame: 0,
    });
  } else if (zoneIndex === 7) {
    // ── ZONA 7 (AREA 8): BATAS TRANSFORM (SESAR SAN ANDREAS - TOP-DOWN PERSPECTIVE) ──
    // NPC 1: Dr. Maya (Pemberhentian awal lempeng utara dekat perkemahan riset, px: 240, py: 160)
    map.set('npc_maya_trans', {
      id: 'npc_maya_trans',
      npcType: 'dr_maya_trans',
      name: 'Dr. Maya',
      dialogueId: 'dr_maya_trans_dialogue',
      x: 240,
      y: 160,
      anchorX: 240,
      patrolRange: 12,
      speed: 0.3,
      dir: 'right',
      state: 'idle_right',
      stateTimer: 80,
      isTalking: false,
      animFrame: 0,
    });

    // NPC 2: Prof. Sarah (Di sebelah timur jalan terpotong lempeng utara, px: 560, py: 170)
    map.set('npc_sarah_trans', {
      id: 'npc_sarah_trans',
      npcType: 'prof_sarah_trans',
      name: 'Prof. Sarah',
      dialogueId: 'prof_sarah_trans_dialogue',
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
    });

    // NPC 3: Dr. Taufik (Di dekat tikungan offset Wallace Creek lempeng selatan, px: 880, py: 310)
    map.set('npc_taufik_trans', {
      id: 'npc_taufik_trans',
      npcType: 'dr_taufik_trans',
      name: 'Dr. Taufik',
      dialogueId: 'dr_taufik_trans_dialogue',
      x: 880,
      y: 310,
      anchorX: 880,
      patrolRange: 15,
      speed: 0.3,
      dir: 'right',
      state: 'idle_right',
      stateTimer: 90,
      isTalking: false,
      animFrame: 0,
    });

    // NPC 4: Petugas Rudi (Pos pantau keselamatan zona patahan, px: 1140, py: 320)
    map.set('npc_rudi_trans', {
      id: 'npc_rudi_trans',
      npcType: 'petugas_rudi_trans',
      name: 'Petugas Rudi',
      dialogueId: 'petugas_rudi_trans_dialogue',
      x: 1140,
      y: 320,
      anchorX: 1140,
      patrolRange: 12,
      speed: 0.25,
      dir: 'left',
      state: 'idle_left',
      stateTimer: 85,
      isTalking: false,
      animFrame: 0,
    });

    // NPC 5: Komandan Guntur (Kepala Sektor Sesar San Andreas & Gerbang Terakhir, px: 1360, py: 315 di tanah padat selatan)
    map.set('npc_guntur_trans', {
      id: 'npc_guntur_trans',
      npcType: 'komandan_guntur',
      name: 'Komandan Guntur',
      dialogueId: 'komandan_guntur_dialogue',
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
    });
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
