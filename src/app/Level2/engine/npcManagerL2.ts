// ── src/app/Level2/engine/npcManagerL2.ts ─────────────────────────────
// Pengelola State & Perilaku AI NPC 2D Level 2: Disaster Analyst
// Mengatur penempatan NPC sekolah, patroli santai, hadap pemain saat dekat, dan deteksi interaksi radius 48px.

import type { NpcWorldTypeL2 } from './npcSpritesL2';

export interface NpcStateL2 {
  id: string;
  type: NpcWorldTypeL2;
  name: string;
  dialogueId: string;
  x: number;
  y: number;
  anchorX: number;
  patrolRange: number;
  speed: number;
  dir: 'left' | 'right';
  state: 'idle' | 'walk';
  timer: number;
  animFrame: number;
  isNearPlayer: boolean;
}

export function createInitialNpcsL2(areaIndex: number): Map<string, NpcStateL2> {
  const map = new Map<string, NpcStateL2>();

  if (areaIndex === 0) {
    // ══════════════════════════════════════════════════════════════════════
    // AREA 1: MITIGASI PRABENCANA GEMPA BUMI (RUANG KELAS SMP KELAS 8)
    // ══════════════════════════════════════════════════════════════════════

    // 1. Rian (Siswa Kelas 8A, dekat deretan meja awal x: 280)
    map.set('l2_npc_rian', {
      id: 'l2_npc_rian',
      type: 'rian',
      name: 'Rian',
      dialogueId: 'rian_dialogue',
      x: 280,
      y: 360,
      anchorX: 280,
      patrolRange: 32,
      speed: 0.4,
      dir: 'right',
      state: 'idle',
      timer: 80,
      animFrame: 0,
      isNearPlayer: false,
    });

    // 3. Bu Rahma (Guru IPA & Pembina PMR, di area Tas Siaga 72 Jam x: 520)
    map.set('l2_npc_bu_rahma', {
      id: 'l2_npc_bu_rahma',
      type: 'bu_rahma',
      name: 'Bu Rahma, M.Pd.',
      dialogueId: 'bu_rahma_dialogue',
      x: 520,
      y: 360,
      anchorX: 520,
      patrolRange: 24,
      speed: 0.3,
      dir: 'left',
      state: 'idle',
      timer: 120,
      animFrame: 0,
      isNearPlayer: false,
    });

    // 4. Dito (Ketua Regu PMR, di tengah deretan meja belajar x: 950)
    map.set('l2_npc_dito', {
      id: 'l2_npc_dito',
      type: 'dito',
      name: 'Dito PMR',
      dialogueId: 'dito_dialogue',
      x: 950,
      y: 360,
      anchorX: 950,
      patrolRange: 35,
      speed: 0.45,
      dir: 'right',
      state: 'idle',
      timer: 70,
      animFrame: 0,
      isNearPlayer: false,
    });

    // 5. Pak Surya (Instruktur BNPB, di area simulasi meja Drop-Cover-Hold On x: 1450)
    map.set('l2_npc_pak_surya', {
      id: 'l2_npc_pak_surya',
      type: 'pak_surya',
      name: 'Pak Surya (BNPB)',
      dialogueId: 'pak_surya_dialogue',
      x: 1450,
      y: 360,
      anchorX: 1450,
      patrolRange: 28,
      speed: 0.35,
      dir: 'left',
      state: 'idle',
      timer: 100,
      animFrame: 0,
      isNearPlayer: false,
    });

    // 6. Siti (Ketua OSIS, di koridor rambu evakuasi hijau x: 1820)
    map.set('l2_npc_siti', {
      id: 'l2_npc_siti',
      type: 'siti',
      name: 'Siti (Ketua OSIS)',
      dialogueId: 'siti_dialogue',
      x: 1820,
      y: 360,
      anchorX: 1820,
      patrolRange: 30,
      speed: 0.4,
      dir: 'right',
      state: 'idle',
      timer: 85,
      animFrame: 0,
      isNearPlayer: false,
    });

    // 7. Kak Fajar (Penguji Gerbang / Ketua Tim Relawan, di depan pintu koridor x: 1980)
    map.set('l2_npc_kak_fajar', {
      id: 'l2_npc_kak_fajar',
      type: 'kak_fajar',
      name: 'Kak Fajar (Penguji)',
      dialogueId: 'kak_fajar_dialogue',
      x: 1980,
      y: 360,
      anchorX: 1980,
      patrolRange: 16,
      speed: 0.3,
      dir: 'left',
      state: 'idle',
      timer: 110,
      animFrame: 0,
      isNearPlayer: false,
    });
  } else if (areaIndex === 1) {
    // ══════════════════════════════════════════════════════════════════════
    // AREA 2: SIMULASI TANGGAP GEMPA RUANG KELAS (DRILL & EVAKUASI)
    // ══════════════════════════════════════════════════════════════════════

    // 1. Bu Rahma (Guru Matematika di depan kelas dekat papan tulis x: 200)
    map.set('l2_sim_npc_bu_rahma', {
      id: 'l2_sim_npc_bu_rahma',
      type: 'bu_rahma',
      name: 'Bu Rahma, M.Pd.',
      dialogueId: 'bu_rahma_teaching_cutscene',
      x: 200,
      y: 360,
      anchorX: 200,
      patrolRange: 10,
      speed: 0.2,
      dir: 'right',
      state: 'idle',
      timer: 120,
      animFrame: 0,
      isNearPlayer: false,
    });

    // 3. Seluruh 11 Murid Teman Sekelas di Seluruh Deretan Meja Belajar
    CLASSROOM_STUDENTS_L2.forEach((st) => {
      map.set(st.id, {
        id: st.id,
        type: st.type,
        name: st.name,
        dialogueId: 'sim_student_dialogue',
        x: st.sitX,
        y: 360,
        anchorX: st.sitX,
        patrolRange: 0,
        speed: 0.2,
        dir: 'left',
        state: 'idle',
        timer: 80,
        animFrame: 0,
        isNearPlayer: false,
      });
    });
  } else if (areaIndex === 2) {
    // ══════════════════════════════════════════════════════════════════════
    // AREA 3: LAPANGAN SEKOLAH PASCABENCANA (TITIK KUMPUL & MEDIS DARURAT)
    // ══════════════════════════════════════════════════════════════════════

    // 1. Pak Hendra (Petugas Sarpras & Keamanan di dekat pos utilitas x: 320)
    map.set('l2_field_npc_pak_hendra', {
      id: 'l2_field_npc_pak_hendra',
      type: 'pak_hendra',
      name: 'Pak Hendra',
      dialogueId: 'pak_hendra_dialogue',
      x: 320,
      y: 360,
      anchorX: 320,
      patrolRange: 24,
      speed: 0.25,
      dir: 'right',
      state: 'idle',
      timer: 100,
      animFrame: 0,
      isNearPlayer: false,
    });

    // 3. Rian (Siswa Kelas 8A sedang beristirahat pasca evakuasi x: 480)
    map.set('l2_field_npc_rian', {
      id: 'l2_field_npc_rian',
      type: 'rian',
      name: 'Rian',
      dialogueId: 'rian_field_dialogue',
      x: 480,
      y: 360,
      anchorX: 480,
      patrolRange: 16,
      speed: 0.2,
      dir: 'left',
      state: 'idle',
      timer: 120,
      animFrame: 0,
      isNearPlayer: false,
    });

    // 4. Dito & Siti (PMR & OSIS di dekat tenda triage x: 640 & 675)
    map.set('l2_field_npc_dito', {
      id: 'l2_field_npc_dito',
      type: 'dito',
      name: 'Dito PMR',
      dialogueId: 'dito_field_dialogue',
      x: 640,
      y: 360,
      anchorX: 640,
      patrolRange: 20,
      speed: 0.3,
      dir: 'right',
      state: 'idle',
      timer: 90,
      animFrame: 0,
      isNearPlayer: false,
    });

    map.set('l2_field_npc_siti', {
      id: 'l2_field_npc_siti',
      type: 'siti',
      name: 'Siti OSIS',
      dialogueId: 'dito_field_dialogue',
      x: 675,
      y: 360,
      anchorX: 675,
      patrolRange: 15,
      speed: 0.25,
      dir: 'left',
      state: 'idle',
      timer: 85,
      animFrame: 0,
      isNearPlayer: false,
    });

    // 5. dr. Alisa (Dokter Relawan PMI di depan Tenda Medis Darurat x: 960)
    map.set('l2_field_npc_dr_alisa', {
      id: 'l2_field_npc_dr_alisa',
      type: 'dr_alisa',
      name: 'dr. Alisa (PMI)',
      dialogueId: 'dr_alisa_dialogue',
      x: 960,
      y: 360,
      anchorX: 960,
      patrolRange: 20,
      speed: 0.25,
      dir: 'left',
      state: 'idle',
      timer: 110,
      animFrame: 0,
      isNearPlayer: false,
    });

    // 6. Bu Rahma (Mendampingi murid di dekat tiang bendera x: 1320)
    map.set('l2_field_npc_bu_rahma', {
      id: 'l2_field_npc_bu_rahma',
      type: 'bu_rahma',
      name: 'Bu Rahma, M.Pd.',
      dialogueId: 'bu_rahma_field_dialogue',
      x: 1320,
      y: 360,
      anchorX: 1320,
      patrolRange: 18,
      speed: 0.2,
      dir: 'right',
      state: 'idle',
      timer: 130,
      animFrame: 0,
      isNearPlayer: false,
    });

    // 7. Pak Bambang (Kepala Sekolah di Tenda Komando / Titik Kumpul Utama x: 1520)
    map.set('l2_field_npc_pak_bambang', {
      id: 'l2_field_npc_pak_bambang',
      type: 'pak_bambang',
      name: 'Pak Bambang, M.Pd.',
      dialogueId: 'pak_bambang_dialogue',
      x: 1520,
      y: 360,
      anchorX: 1520,
      patrolRange: 16,
      speed: 0.2,
      dir: 'left',
      state: 'idle',
      timer: 115,
      animFrame: 0,
      isNearPlayer: false,
    });

    // 8. Beberapa Murid Tambahan di Lapangan Terbuka
    map.set('l2_field_npc_budi', {
      id: 'l2_field_npc_budi',
      type: 'rian',
      name: 'Budi',
      dialogueId: 'budi_field_dialogue',
      x: 1180,
      y: 360,
      anchorX: 1180,
      patrolRange: 15,
      speed: 0.2,
      dir: 'right',
      state: 'idle',
      timer: 95,
      animFrame: 0,
      isNearPlayer: false,
    });

    map.set('l2_field_npc_maya', {
      id: 'l2_field_npc_maya',
      type: 'siti',
      name: 'Maya',
      dialogueId: 'maya_field_dialogue',
      x: 1720,
      y: 360,
      anchorX: 1720,
      patrolRange: 20,
      speed: 0.25,
      dir: 'left',
      state: 'idle',
      timer: 105,
      animFrame: 0,
      isNearPlayer: false,
    });

    // 9. Komandan Satria (Ketua Tim SAR/BPBD di depan Gerbang Evakuasi Akhir x: 1940)
    map.set('l2_field_npc_komandan_satria', {
      id: 'l2_field_npc_komandan_satria',
      type: 'komandan_satria',
      name: 'Komandan Satria (SAR/BPBD)',
      dialogueId: 'komandan_satria_dialogue',
      x: 1940,
      y: 360,
      anchorX: 1940,
      patrolRange: 14,
      speed: 0.2,
      dir: 'left',
      state: 'idle',
      timer: 120,
      animFrame: 0,
      isNearPlayer: false,
    });
  }

  return map;
}

export interface SimStudentConfigL2 {
  id: string;
  name: string;
  type: NpcWorldTypeL2;
  deskX: number;
  sitX: number;
  coverX: number;
}

export const CLASSROOM_STUDENTS_L2: SimStudentConfigL2[] = [
  { id: 'l2_sim_npc_rian', name: 'Rian', type: 'rian', deskX: 260, sitX: 298, coverX: 282 },
  { id: 'l2_sim_npc_dito', name: 'Dito PMR', type: 'dito', deskX: 360, sitX: 398, coverX: 382 },
  // Meja 460 adalah Meja Karakter Pemain (sitX: 498, coverX: 482)
  { id: 'l2_sim_npc_siti', name: 'Siti OSIS', type: 'siti', deskX: 560, sitX: 598, coverX: 582 },
  { id: 'l2_sim_npc_budi', name: 'Budi', type: 'rian', deskX: 660, sitX: 698, coverX: 682 },
  { id: 'l2_sim_npc_fani', name: 'Fani', type: 'siti', deskX: 760, sitX: 798, coverX: 782 },
  { id: 'l2_sim_npc_edo', name: 'Edo', type: 'dito', deskX: 860, sitX: 898, coverX: 882 },
  { id: 'l2_sim_npc_maya', name: 'Maya', type: 'siti', deskX: 960, sitX: 998, coverX: 982 },
  { id: 'l2_sim_npc_reza', name: 'Reza', type: 'rian', deskX: 1060, sitX: 1098, coverX: 1082 },
  { id: 'l2_sim_npc_dewi', name: 'Dewi', type: 'siti', deskX: 1160, sitX: 1198, coverX: 1182 },
  { id: 'l2_sim_npc_bayu', name: 'Bayu', type: 'dito', deskX: 1260, sitX: 1298, coverX: 1282 },
  { id: 'l2_sim_npc_tari', name: 'Tari', type: 'siti', deskX: 1360, sitX: 1398, coverX: 1382 },
  { id: 'l2_sim_npc_doni', name: 'Doni', type: 'rian', deskX: 1460, sitX: 1498, coverX: 1482 },
  { id: 'l2_sim_npc_lina', name: 'Lina', type: 'siti', deskX: 1560, sitX: 1598, coverX: 1582 },
  { id: 'l2_sim_npc_agus', name: 'Agus', type: 'dito', deskX: 1660, sitX: 1698, coverX: 1682 },
  { id: 'l2_sim_npc_putri', name: 'Putri', type: 'siti', deskX: 1760, sitX: 1798, coverX: 1782 },
  { id: 'l2_sim_npc_gilang', name: 'Gilang', type: 'rian', deskX: 1860, sitX: 1898, coverX: 1882 },
];

// ── UPDATE SIKLUS HIDUP & AI NPC LEVEL 2 ──
export function updateNpcsL2(
  npcs: Map<string, NpcStateL2>,
  playerX: number,
  playerY: number,
  animTick: number
): NpcStateL2 | null {
  let closestInteractableNpc: NpcStateL2 | null = null;
  let minDistance = 52; // Radius deteksi interaksi 52 pixel

  // Reset semua isNearPlayer dulu agar prompt tidak tumpang tindih
  for (const npc of npcs.values()) {
    npc.isNearPlayer = false;
  }

  for (const npc of npcs.values()) {
    // 1. Hitung jarak pemain ke NPC
    const dist = Math.hypot(npc.x - playerX, npc.y - playerY);
    const isClose = dist < 50;

    if (isClose && dist < minDistance) {
      minDistance = dist;
      closestInteractableNpc = npc;
    }

    // 2. Jika pemain dekat, NPC otomatis menatap pemain
    if (isClose) {
      npc.dir = playerX < npc.x ? 'left' : 'right';
      npc.state = 'idle';
      continue;
    }

    // 3. AI Patroli Santai
    npc.timer--;
    if (npc.timer <= 0) {
      if (npc.state === 'idle') {
        npc.state = 'walk';
        npc.timer = 60 + Math.floor(Math.random() * 60);
        npc.dir = Math.random() > 0.5 ? 'right' : 'left';
      } else {
        npc.state = 'idle';
        npc.timer = 80 + Math.floor(Math.random() * 90);
      }
    }

    if (npc.state === 'walk') {
      const step = npc.dir === 'right' ? npc.speed : -npc.speed;
      npc.x += step;

      // Animasi langkah berjalan
      if (animTick % 8 === 0) {
        npc.animFrame = (npc.animFrame + 1) % 4;
      }

      // Batasi jelajah pada patrolRange dari anchorX
      if (npc.x > npc.anchorX + npc.patrolRange) {
        npc.x = npc.anchorX + npc.patrolRange;
        npc.dir = 'left';
      } else if (npc.x < npc.anchorX - npc.patrolRange) {
        npc.x = npc.anchorX - npc.patrolRange;
        npc.dir = 'right';
      }
    } else {
      npc.animFrame = 0;
    }
  }

  // Hanya SATU NPC terdekat yang menampilkan prompt interaksi (mencegah prompt bertumpuk)
  if (closestInteractableNpc) {
    closestInteractableNpc.isNearPlayer = true;
  }

  return closestInteractableNpc;
}
