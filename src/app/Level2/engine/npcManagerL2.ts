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
  spokenPhase?: string;
  speechTimer?: number;
  speechText?: string;
  hasMaterial?: boolean;
  discoveryKey?: string;
}

export function createInitialNpcsL2(areaIndex: number): Map<string, NpcStateL2> {
  const map = new Map<string, NpcStateL2>();

  if (areaIndex === 0) {
    // ══════════════════════════════════════════════════════════════════════
    // AREA 1: MITIGASI PRABENCANA GEMPA BUMI (RUANG KELAS SMP KELAS 8)
    // ══════════════════════════════════════════════════════════════════════

    // 1. Zidane (Menganalisis Denah Kelas & Tata Ruang Aman Gempa)
    const zidane: NpcStateL2 = {
      id: 'l2_npc_zidane',
      type: 'zidane',
      name: 'Zidane',
      dialogueId: 'rian_dialogue',
      x: 280,
      y: 360,
      anchorX: 280,
      patrolRange: 24,
      speed: 0.35,
      dir: 'right',
      state: 'idle',
      timer: 80,
      animFrame: 0,
      isNearPlayer: false,
    };
    map.set(zidane.id, zidane);
    map.set('l2_npc_rian', zidane);

    // 2. Zahra (Menyiapkan Perlengkapan Tas Siaga Bencana 72 Jam)
    const zahra: NpcStateL2 = {
      id: 'l2_npc_zahra',
      type: 'zahra',
      name: 'Zahra',
      dialogueId: 'bu_rahma_dialogue',
      x: 580,
      y: 360,
      anchorX: 580,
      patrolRange: 20,
      speed: 0.3,
      dir: 'left',
      state: 'idle',
      timer: 120,
      animFrame: 0,
      isNearPlayer: false,
      hasMaterial: true,
      discoveryKey: 'l2_q_disc_prep',
    };
    map.set(zahra.id, zahra);
    map.set('l2_npc_bu_rahma', zahra);

    // 3. Ican (Pengamat Dinamika & Jalur Evakuasi)
    const ican: NpcStateL2 = {
      id: 'l2_npc_ican',
      type: 'ican',
      name: 'Ican',
      dialogueId: 'dito_dialogue',
      x: 980,
      y: 360,
      anchorX: 980,
      patrolRange: 28,
      speed: 0.4,
      dir: 'right',
      state: 'idle',
      timer: 70,
      animFrame: 0,
      isNearPlayer: false,
    };
    map.set(ican.id, ican);
    map.set('l2_npc_dito', ican);

    // 4. Lintang (Menganalisis Prosedur Drop, Cover, Hold On)
    const lintang: NpcStateL2 = {
      id: 'l2_npc_lintang',
      type: 'lintang',
      name: 'Lintang',
      dialogueId: 'pak_surya_dialogue',
      x: 1450,
      y: 360,
      anchorX: 1450,
      patrolRange: 24,
      speed: 0.3,
      dir: 'left',
      state: 'idle',
      timer: 100,
      animFrame: 0,
      isNearPlayer: false,
      hasMaterial: true,
      discoveryKey: 'l2_q_disc_action',
    };
    map.set(lintang.id, lintang);
    map.set('l2_npc_pak_surya', lintang);
    map.set('l2_npc_siti', lintang);

    // 5. Bu Tyas (Dosen Pembimbing & Evaluator Teka-Teki Silang Kesiapsiagaan)
    const buTyas: NpcStateL2 = {
      id: 'l2_npc_bu_tyas',
      type: 'bu_tyas',
      name: 'Bu Tyas',
      dialogueId: 'kak_fajar_dialogue',
      x: 1980,
      y: 360,
      anchorX: 1980,
      patrolRange: 16,
      speed: 0.25,
      dir: 'left',
      state: 'idle',
      timer: 110,
      animFrame: 0,
      isNearPlayer: false,
    };
    map.set(buTyas.id, buTyas);
    map.set('l2_npc_kak_fajar', buTyas);
  } else if (areaIndex === 1) {
    // ══════════════════════════════════════════════════════════════════════
    // AREA 2: SIMULASI TANGGAP GEMPA RUANG KELAS (DRILL & EVAKUASI)
    // ══════════════════════════════════════════════════════════════════════

    // 0. Resqy (Instruktur & Pemandu Simulasi di depan kelas dekat pintu & meja guru x: 140)
    map.set('l2_sim_npc_resqy', {
      id: 'l2_sim_npc_resqy',
      type: 'resqy',
      name: 'Resqy',
      dialogueId: 'resqy_briefing_area2',
      x: 140,
      y: 360,
      anchorX: 140,
      patrolRange: 0,
      speed: 0,
      dir: 'right',
      state: 'idle',
      timer: 100,
      animFrame: 0,
      isNearPlayer: false,
    });

    // 1. Bu Tyas (Guru Kelas di depan kelas dekat papan tulis x: 200)
    const buTyasClass: NpcStateL2 = {
      id: 'l2_sim_npc_bu_tyas',
      type: 'bu_tyas',
      name: 'Bu Tyas',
      dialogueId: 'bu_rahma_classroom_intro',
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
    };
    map.set(buTyasClass.id, buTyasClass);
    map.set('l2_sim_npc_bu_rahma', buTyasClass);

    // 2. Seluruh Murid Teman Sekelas di Seluruh Deretan Meja Belajar
    CLASSROOM_STUDENTS_L2.forEach((st) => {
      const dialogueId =
        st.id === 'l2_sim_npc_rian'
          ? 'rian_sim_dialogue'
          : st.id === 'l2_sim_npc_dito'
            ? 'dito_sim_dialogue'
            : st.id === 'l2_sim_npc_siti'
              ? 'siti_sim_dialogue'
              : 'rian_sim_dialogue';

      map.set(st.id, {
        id: st.id,
        type: st.type,
        name: st.name,
        dialogueId,
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

    // 1. Rian (Siswa SMP yang baru saja evakuasi dari kelas)
    const rian: NpcStateL2 = {
      id: 'l2_field_npc_rian',
      type: 'rian',
      name: 'Rian',
      dialogueId: 'rian_field_dialogue',
      x: 420,
      y: 360,
      anchorX: 420,
      patrolRange: 20,
      speed: 0.35,
      dir: 'right',
      state: 'idle',
      timer: 90,
      animFrame: 0,
      isNearPlayer: false,
    };
    map.set(rian.id, rian);

    // 2. Zahra (Petugas Medis PMI Posko Triage & Pertolongan Pertama)
    const zahra: NpcStateL2 = {
      id: 'l2_field_npc_zahra',
      type: 'zahra_medis',
      name: 'Zahra',
      dialogueId: 'dr_alisa_dialogue',
      x: 820,
      y: 360,
      anchorX: 820,
      patrolRange: 20,
      speed: 0.3,
      dir: 'left',
      state: 'idle',
      timer: 110,
      animFrame: 0,
      isNearPlayer: false,
      hasMaterial: true,
      discoveryKey: 'disc-post-safety',
    };
    map.set(zahra.id, zahra);

    // 3. Dito PMR (Siswa Palang Merah Remaja yang mendampingi evakuasi)
    const dito: NpcStateL2 = {
      id: 'l2_field_npc_dito',
      type: 'dito',
      name: 'Dito PMR',
      dialogueId: 'dito_field_dialogue',
      x: 1180,
      y: 360,
      anchorX: 1180,
      patrolRange: 24,
      speed: 0.35,
      dir: 'right',
      state: 'idle',
      timer: 80,
      animFrame: 0,
      isNearPlayer: false,
    };
    map.set(dito.id, dito);

    // 4. Siti OSIS (Ketua OSIS yang membantu pendataan presensi di titik kumpul)
    const siti: NpcStateL2 = {
      id: 'l2_field_npc_siti',
      type: 'siti',
      name: 'Siti OSIS',
      dialogueId: 'siti_field_dialogue',
      x: 1330,
      y: 360,
      anchorX: 1330,
      patrolRange: 18,
      speed: 0.3,
      dir: 'left',
      state: 'idle',
      timer: 100,
      animFrame: 0,
      isNearPlayer: false,
    };
    map.set(siti.id, siti);

    // 5. Lintang (Petugas Medis & Koordinator Sistem Komando Darurat Sekolah)
    const lintang: NpcStateL2 = {
      id: 'l2_field_npc_lintang',
      type: 'lintang_medis',
      name: 'Lintang',
      dialogueId: 'pak_bambang_dialogue',
      x: 1540,
      y: 360,
      anchorX: 1540,
      patrolRange: 20,
      speed: 0.3,
      dir: 'left',
      state: 'idle',
      timer: 100,
      animFrame: 0,
      isNearPlayer: false,
      hasMaterial: true,
      discoveryKey: 'disc-post-coordination',
    };
    map.set(lintang.id, lintang);

    // 6. Budi (Siswa SMP yang berkumpul di dekat jalur posko evakuasi)
    const budi: NpcStateL2 = {
      id: 'l2_field_npc_budi',
      type: 'rian',
      name: 'Budi',
      dialogueId: 'budi_field_dialogue',
      x: 1720,
      y: 360,
      anchorX: 1720,
      patrolRange: 20,
      speed: 0.3,
      dir: 'right',
      state: 'idle',
      timer: 95,
      animFrame: 0,
      isNearPlayer: false,
    };
    map.set(budi.id, budi);

    // 7. Bu Tyas (Guru Pendamping Evakuasi & Evaluator Teka-Teki Silang Pascabencana Gempa)
    const buTyas: NpcStateL2 = {
      id: 'l2_field_npc_bu_tyas',
      type: 'bu_tyas',
      name: 'Bu Tyas',
      dialogueId: 'komandan_satria_dialogue',
      x: 1940,
      y: 360,
      anchorX: 1940,
      patrolRange: 16,
      speed: 0.25,
      dir: 'left',
      state: 'idle',
      timer: 120,
      animFrame: 0,
      isNearPlayer: false,
    };
    map.set(buTyas.id, buTyas);
  } else if (areaIndex === 3) {
    // ══════════════════════════════════════════════════════════════════════
    // AREA 4: PRABENCANA ERUPSI MERAPI (POS PGA PVMBG & KRB III)
    // ══════════════════════════════════════════════════════════════════════

    // 1. Ican (Relawan Kaki Jalur Posko Merapi)
    const ican: NpcStateL2 = {
      id: 'l2_v_npc_ican',
      type: 'ican',
      name: 'Ican',
      dialogueId: 'relawan_budi_dialogue',
      x: 240,
      y: 360,
      anchorX: 240,
      patrolRange: 18,
      speed: 0.35,
      dir: 'right',
      state: 'idle',
      timer: 90,
      animFrame: 0,
      isNearPlayer: false,
    };
    map.set(ican.id, ican);
    map.set('l2_v_npc_relawan_budi', ican);

    // 2. Zahra (Meneliti 4 Tingkatan Status Gunung Api: Normal, Waspada, Siaga, Awas)
    // Dimajukan ke posisi Zidane sebelumnya di dekat papan digital Status Merapi PVMBG
    const zahra: NpcStateL2 = {
      id: 'l2_v_npc_zahra',
      type: 'zahra',
      name: 'Zahra',
      dialogueId: 'mbak_rina_dialogue',
      x: 380,
      y: 350,
      anchorX: 380,
      patrolRange: 16,
      speed: 0.3,
      dir: 'right',
      state: 'idle',
      timer: 110,
      animFrame: 0,
      isNearPlayer: false,
      hasMaterial: true,
      discoveryKey: 'disc-volcano-status',
    };
    map.set(zahra.id, zahra);
    map.set('l2_v_npc_mbak_rina', zahra);

    // 4. Lintang (Menganalisis Zonasi Kawasan Rawan Bencana KRB I, II, III Merapi)
    const lintang: NpcStateL2 = {
      id: 'l2_v_npc_lintang',
      type: 'lintang',
      name: 'Lintang',
      dialogueId: 'pak_joko_dialogue',
      x: 1380,
      y: 358,
      anchorX: 1380,
      patrolRange: 16,
      speed: 0.25,
      dir: 'left',
      state: 'idle',
      timer: 110,
      animFrame: 0,
      isNearPlayer: false,
      hasMaterial: true,
      discoveryKey: 'disc-volcano-response',
    };
    map.set(lintang.id, lintang);
    map.set('l2_v_npc_pak_joko', lintang);

    // 5. Bu Tyas (Dosen Pembimbing & Evaluator Teka-Teki Silang Kesiapsiagaan Erupsi)
    const buTyas: NpcStateL2 = {
      id: 'l2_v_npc_bu_tyas',
      type: 'bu_tyas',
      name: 'Bu Tyas',
      dialogueId: 'satria_volcano_dialogue',
      x: 1940,
      y: 360,
      anchorX: 1940,
      patrolRange: 14,
      speed: 0.25,
      dir: 'left',
      state: 'idle',
      timer: 120,
      animFrame: 0,
      isNearPlayer: false,
    };
    map.set(buTyas.id, buTyas);
    map.set('l2_v_npc_satria', buTyas);
  } else if (areaIndex === 4) {
    // ══════════════════════════════════════════════════════════════════════
    // AREA 5: SIMULASI TANGGAP ERUPSI GUNUNG MERAPI (DUSUN DESTANA KRB III)
    // ══════════════════════════════════════════════════════════════════════

    // 1. Resqy (Maskot Pemandu Taktis di dekat batas masuk dusun x: 140)
    map.set('l2_sim5_npc_resqy', {
      id: 'l2_sim5_npc_resqy',
      type: 'resqy',
      name: 'Resqy',
      dialogueId: 'resqy_briefing_area5',
      x: 140,
      y: 360,
      anchorX: 140,
      patrolRange: 0,
      speed: 0,
      dir: 'right',
      state: 'idle',
      timer: 100,
      animFrame: 0,
      isNearPlayer: false,
    });

    // 2. Pak Joko (Kepala Dusun Destana di Pos Ronda & Balai Desa x: 440)
    map.set('l2_sim5_npc_pak_joko', {
      id: 'l2_sim5_npc_pak_joko',
      type: 'pak_joko',
      name: 'Pak Joko (Kepala Dusun)',
      dialogueId: 'pak_joko_sim_intro',
      x: 440,
      y: 352,
      anchorX: 440,
      patrolRange: 12,
      speed: 0.2,
      dir: 'right',
      state: 'idle',
      timer: 110,
      animFrame: 0,
      isNearPlayer: false,
    });

    // 3. Mbak Rina (Relawan Warga Siaga di dekat Balai Desa x: 480)
    map.set('l2_sim5_npc_mbak_rina', {
      id: 'l2_sim5_npc_mbak_rina',
      type: 'mbak_rina',
      name: 'Mbak Rina (Warga Siaga)',
      dialogueId: 'mbak_rina_siaga_alert',
      x: 480,
      y: 350,
      anchorX: 480,
      patrolRange: 10,
      speed: 0.2,
      dir: 'left',
      state: 'idle',
      timer: 95,
      animFrame: 0,
      isNearPlayer: false,
    });

    // 4. Target 1: Mbah Tejo (Warga Lansia) di x: 820
    map.set('l2_sim5_npc_lansia', {
      id: 'l2_sim5_npc_lansia',
      type: 'pak_hendra',
      name: 'Mbah Tejo (Lansia)',
      dialogueId: 'mbak_rina_siaga_alert',
      x: 820,
      y: 356,
      anchorX: 820,
      patrolRange: 6,
      speed: 0.12,
      dir: 'right',
      state: 'idle',
      timer: 130,
      animFrame: 0,
      isNearPlayer: false,
    });

    // 5. Target 2: Bu Siti (Warga Rentan) di x: 1220
    map.set('l2_sim5_npc_warga_siti', {
      id: 'l2_sim5_npc_warga_siti',
      type: 'siti',
      name: 'Bu Siti (Warga Dusun)',
      dialogueId: 'mbak_rina_siaga_alert',
      x: 1220,
      y: 356,
      anchorX: 1220,
      patrolRange: 8,
      speed: 0.15,
      dir: 'left',
      state: 'idle',
      timer: 100,
      animFrame: 0,
      isNearPlayer: false,
    });

    // 6. Target 3: Dani (Anak Dusun) di x: 1560
    map.set('l2_sim5_npc_anak', {
      id: 'l2_sim5_npc_anak',
      type: 'rian',
      name: 'Dani (Anak Dusun)',
      dialogueId: 'mbak_rina_siaga_alert',
      x: 1560,
      y: 356,
      anchorX: 1560,
      patrolRange: 10,
      speed: 0.2,
      dir: 'left',
      state: 'idle',
      timer: 80,
      animFrame: 0,
      isNearPlayer: false,
    });

    // 7. Komandan Satria (Tim SAR/BPBD siaga di dekat Mobil Evakuasi x: 1880)
    map.set('l2_sim5_npc_satria', {
      id: 'l2_sim5_npc_satria',
      type: 'komandan_satria',
      name: 'Komandan Satria (SAR/BPBD)',
      dialogueId: 'satria_sim_victory',
      x: 1880,
      y: 360,
      anchorX: 1880,
      patrolRange: 10,
      speed: 0.2,
      dir: 'left',
      state: 'idle',
      timer: 120,
      animFrame: 0,
      isNearPlayer: false,
    });
  } else if (areaIndex === 5) {
    // ══════════════════════════════════════════════════════════════════════
    // AREA 6: PASCABENCANA ERUPSI MERAPI (BARAK PENGUNGSIAN & BAHAYA SEKUNDER)
    // ══════════════════════════════════════════════════════════════════════

    // 1. Resqy (Maskot Pemandu di dekat gerbang masuk barak x: 140)
    map.set('l2_shelter_npc_resqy', {
      id: 'l2_shelter_npc_resqy',
      type: 'resqy',
      name: 'Resqy',
      dialogueId: 'resqy_briefing_area6',
      x: 140,
      y: 360,
      anchorX: 140,
      patrolRange: 0,
      speed: 0,
      dir: 'right',
      state: 'idle',
      timer: 100,
      animFrame: 0,
      isNearPlayer: false,
    });

    // 2. Zidane (Menganalisis Penanganan Abu Vulkanik & Pembersihan Atap BNPB)
    const zidane: NpcStateL2 = {
      id: 'l2_shelter_npc_zidane',
      type: 'zidane',
      name: 'Zidane',
      dialogueId: 'bu_dini_dialogue',
      x: 460,
      y: 360,
      anchorX: 460,
      patrolRange: 20,
      speed: 0.35,
      dir: 'right',
      state: 'idle',
      timer: 110,
      animFrame: 0,
      isNearPlayer: false,
      hasMaterial: true,
      discoveryKey: 'disc-post-ash',
    };
    map.set(zidane.id, zidane);
    map.set('l2_shelter_npc_bu_dini', zidane);

    // 3. Zahra (Koordinator Sanitasi, Air Bersih Tertutup & Penanganan Medis)
    const zahra: NpcStateL2 = {
      id: 'l2_shelter_npc_zahra',
      type: 'zahra',
      name: 'Zahra',
      dialogueId: 'dr_alisa_shelter_dialogue',
      x: 820,
      y: 360,
      anchorX: 820,
      patrolRange: 18,
      speed: 0.3,
      dir: 'left',
      state: 'idle',
      timer: 120,
      animFrame: 0,
      isNearPlayer: false,
      hasMaterial: true,
      discoveryKey: 'disc-post-sanitation',
    };
    map.set(zahra.id, zahra);
    map.set('l2_shelter_npc_dr_alisa', zahra);

    // 4. Ican (Pengawas Logistik Dapur Umum & Distribusi Masker)
    const ican: NpcStateL2 = {
      id: 'l2_shelter_npc_ican',
      type: 'ican',
      name: 'Ican',
      dialogueId: 'dani_shelter_dialogue',
      x: 1180,
      y: 360,
      anchorX: 1180,
      patrolRange: 24,
      speed: 0.4,
      dir: 'right',
      state: 'idle',
      timer: 90,
      animFrame: 0,
      isNearPlayer: false,
    };
    map.set(ican.id, ican);
    map.set('l2_shelter_npc_warga_dani', ican);
    map.set('l2_shelter_npc_mbah_joyo', ican);

    // 5. Lintang (Menganalisis Bahaya Sekunder Lahar Hujan & Sensor EWS Sungai)
    const lintang: NpcStateL2 = {
      id: 'l2_shelter_npc_lintang',
      type: 'lintang',
      name: 'Lintang',
      dialogueId: 'pak_slamet_dialogue',
      x: 1540,
      y: 360,
      anchorX: 1540,
      patrolRange: 20,
      speed: 0.3,
      dir: 'left',
      state: 'idle',
      timer: 100,
      animFrame: 0,
      isNearPlayer: false,
      hasMaterial: true,
      discoveryKey: 'disc-post-lahar',
    };
    map.set(lintang.id, lintang);
    map.set('l2_shelter_npc_pak_slamet', lintang);

    // 6. Bu Tyas (Dosen Pembimbing & Evaluator Teka-Teki Silang Puncak Ekspedisi Level 2)
    const buTyas: NpcStateL2 = {
      id: 'l2_shelter_npc_bu_tyas',
      type: 'bu_tyas',
      name: 'Bu Tyas',
      dialogueId: 'satria_shelter_dialogue',
      x: 1980,
      y: 360,
      anchorX: 1980,
      patrolRange: 14,
      speed: 0.25,
      dir: 'left',
      state: 'idle',
      timer: 120,
      animFrame: 0,
      isNearPlayer: false,
    };
    map.set(buTyas.id, buTyas);
    map.set('l2_shelter_npc_satria', buTyas);
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
  animTick: number,
  allowInteraction: boolean = true
): NpcStateL2 | null {
  let closestInteractableNpc: NpcStateL2 | null = null;
  let minDistance = 46; // Radius deteksi interaksi 46 pixel

  // Reset semua isNearPlayer dulu agar prompt tidak tumpang tindih
  for (const npc of npcs.values()) {
    npc.isNearPlayer = false;
  }

  for (const npc of npcs.values()) {
    // 1. Hitung jarak pemain ke NPC
    const dist = Math.hypot(npc.x - playerX, npc.y - playerY);
    const isClose = dist < 46;

    if (allowInteraction && isClose && dist < minDistance) {
      minDistance = dist;
      closestInteractableNpc = npc;
    }

    // 2. Jika pemain dekat dan interaksi aktif, NPC otomatis menatap pemain
    if (allowInteraction && isClose) {
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
  if (closestInteractableNpc && allowInteraction) {
    closestInteractableNpc.isNearPlayer = true;
  }

  return closestInteractableNpc;
}
