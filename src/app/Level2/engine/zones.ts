export const TILE = 32;
export const MAP_WIDTH_PX = 2200;
export const MAP_HEIGHT_PX = 480;

export interface LandSection {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  isCooledCrustBridge?: boolean;
  isFoldedAndesite?: boolean;
  isBlackSandBeach?: boolean;
  label?: string;
}

export interface PlatformL2 {
  id: string;
  x1: number;
  x2: number;
  y: number;
  h?: number;
  type?: 'cooled_crust' | 'wood_bridge' | 'basalt_arch';
  label?: string;
}

export interface ChasmHazard {
  id: string;
  type: 'magma' | 'cooled_crust' | 'deep_trench';
  x: number;
  y: number;
  w: number;
  h: number;
  damage: number;
}

export interface MapObjectL2 {
  id: string;
  type: 'info_sign' | 'discovery' | 'crystal' | 'challenge_gate' | 'portal_exit' | 'portal_back' | 'lander_capsule';
  px: number;
  py: number;
  label?: string;
  data?: Record<string, unknown>;
}

export interface ZoneConfigL2 {
  id: string;
  name: string;
  subtitle: string;
  groundProfile: number[];
  platforms: PlatformL2[];
  landSections: LandSection[];
  chasmHazards: ChasmHazard[];
  objects: MapObjectL2[];
  playerSpawnX: number;
  playerSpawnY: number;
}

// ── PROFILE INTERPOLATION HELPER (SEPERTI LEVEL 1) ──
export function interpolateProfile(points: [number, number][], width: number = MAP_WIDTH_PX): number[] {
  const profile = new Array<number>(width);
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    const startX = Math.max(0, Math.floor(x0));
    const endX = Math.min(width - 1, Math.floor(x1));
    for (let x = startX; x <= endX; x++) {
      const t = (x - x0) / (x1 - x0);
      const smoothT = (1 - Math.cos(t * Math.PI)) / 2;
      profile[x] = y0 + (y1 - y0) * smoothT;
    }
  }
  const firstY = points[0][1];
  for (let x = 0; x < Math.floor(points[0][0]); x++) profile[x] = firstY;
  const lastY = points[points.length - 1][1];
  for (let x = Math.floor(points[points.length - 1][0]); x < width; x++) profile[x] = lastY;
  return profile;
}

// ── BUILD AREA 1: MITIGASI BENCANA GEMPA BUMI (KESIAPSIAGAAN & EVAKUASI) ──
export function buildArea1EarthquakeMitigation(): ZoneConfigL2 {
  // Lantai ruang kelas datar sempurna di y: 360
  const groundPoints: [number, number][] = [
    [0, 360],
    [2200, 360],
  ];

  const groundProfile = interpolateProfile(groundPoints, MAP_WIDTH_PX);
  const platforms: PlatformL2[] = [];

  const landSections: LandSection[] = [
    { id: 'land_q0_base', x: 0, y: 360, w: 350, h: 120, label: 'MEJA GURU & POSKO KELAS' },
    { id: 'land_q1_street', x: 350, y: 360, w: 450, h: 120, label: 'DERETAN BANGKU KELAS 8A' },
    { id: 'land_q2_square', x: 800, y: 360, w: 450, h: 120, label: 'AREA SIMULASI TAS SIAGA' },
    { id: 'land_q3_action', x: 1250, y: 360, w: 500, h: 120, label: 'ZONA MEJA DROP-COVER-HOLD' },
    { id: 'land_q4_assembly', x: 1750, y: 360, w: 450, h: 120, label: 'PINTU & KORIDOR EVAKUASI' },
  ];

  const chasmHazards: ChasmHazard[] = [];

  const objects: MapObjectL2[] = [
    // Kristal 1: Di Dekat Bangku Depan Kelas
    {
      id: 'l2_q_crystal_1',
      type: 'crystal',
      px: 750,
      py: 310,
    },

    // Kristal 2: Di Antara Deretan Bangku Belajar
    {
      id: 'l2_q_crystal_2',
      type: 'crystal',
      px: 1260,
      py: 310,
    },

    // Kristal 3: Menuju Koridor Evakuasi
    {
      id: 'l2_q_crystal_3',
      type: 'crystal',
      px: 1680,
      py: 310,
    },

    // Kristal 4: Di Dekat Meja Guru & Perlengkapan Siaga
    {
      id: 'l2_q_crystal_4',
      type: 'crystal',
      px: 420,
      py: 310,
    },

    // Pintu Keluar Ruang Kelas Menuju Area 2 (Simulasi Gempa Bumi)
    {
      id: 'l2_portal_to_area2',
      type: 'portal_exit',
      px: 2130,
      py: 360,
      label: 'PINTU AREA 2',
    },
  ];

  return {
    id: 'area-mitigasi-gempa',
    name: 'Mitigasi Gempa Bumi',
    subtitle: 'Kesiapsiagaan, Simulasi Ruang Kelas & Evakuasi',
    groundProfile,
    platforms,
    landSections,
    chasmHazards,
    objects,
    playerSpawnX: 80,
    playerSpawnY: 360,
  };
}

// ── BUILD AREA 2: SIMULASI TANGGAP GEMPA BUMI RUANG KELAS ──
export function buildArea2EarthquakeSimulation(): ZoneConfigL2 {
  // Lantai ruang kelas 8A datar sempurna pada y: 360
  const groundPoints: [number, number][] = [
    [0, 360],
    [2200, 360],
  ];

  const groundProfile = interpolateProfile(groundPoints, MAP_WIDTH_PX);
  const platforms: PlatformL2[] = [];

  const landSections: LandSection[] = [
    { id: 'land_s0_front', x: 0, y: 360, w: 320, h: 120, label: 'DEPAN KELAS & MEJA GURU' },
    { id: 'land_s1_row1', x: 320, y: 360, w: 460, h: 120, label: 'DERETAN MEJA BARIS 1' },
    { id: 'land_s2_row2', x: 780, y: 360, w: 460, h: 120, label: 'DERETAN MEJA BARIS 2' },
    { id: 'land_s3_row3', x: 1240, y: 360, w: 460, h: 120, label: 'DERETAN MEJA BARIS 3' },
    { id: 'land_s4_exit', x: 1700, y: 360, w: 500, h: 120, label: 'PINTU & JALUR EVAKUASI LAPANGAN' },
  ];

  const chasmHazards: ChasmHazard[] = [];

  const objects: MapObjectL2[] = [
    // Pintu Kembali ke Area 1 (Pintu Masuk Barat Kelas)
    {
      id: 'l2_sim_portal_back',
      type: 'portal_back',
      px: 60,
      py: 360,
      label: 'KEMBALI KE AREA 1',
    },

    // Papan Catatan Edukasi Kesiapan Simulasi
    {
      id: 'l2_sim_sign_drill',
      type: 'info_sign',
      px: 260,
      py: 360,
      data: {
        text:
          '"1. MERUNDUK (Drop) merendahkan tubuh\n2. BERLINDUNG (Cover) di bawah meja kokoh mendekap tengkuk\n3. BERTAHAN (Hold On) memegang erat kaki meja\n4. Setelah gempa reda, evakuasi tertib ke lapangan terbuka!"',
      },
    },

    // Kristal Simulasi 1
    {
      id: 'l2_s_crystal_1',
      type: 'crystal',
      px: 640,
      py: 310,
    },

    // Kristal Simulasi 2
    {
      id: 'l2_s_crystal_2',
      type: 'crystal',
      px: 1120,
      py: 310,
    },

    // Kristal Simulasi 3
    {
      id: 'l2_s_crystal_3',
      type: 'crystal',
      px: 1680,
      py: 310,
    },

    // Pintu Keluar Evakuasi Menuju Lapangan Terbuka
    {
      id: 'l2_portal_to_assembly',
      type: 'portal_exit',
      px: 2130,
      py: 360,
      label: 'PINTU EVAKUASI LAPANGAN',
    },
  ];

  return {
    id: 'area-simulasi-gempa',
    name: 'Simulasi Tanggap Gempa',
    subtitle: 'Latihan Kesiapsiagaan, Drop-Cover-Hold On & Evakuasi Kelas',
    groundProfile,
    platforms,
    landSections,
    chasmHazards,
    objects,
    playerSpawnX: 100,
    playerSpawnY: 360,
  };
}

export function buildArea3AssemblyField(): ZoneConfigL2 {
  const groundPoints: [number, number][] = [
    [0, 360],
    [2200, 360],
  ];

  const groundProfile = interpolateProfile(groundPoints, MAP_WIDTH_PX);
  const platforms: PlatformL2[] = [];

  const landSections: LandSection[] = [
    { id: 'land_f0_exit', x: 0, y: 360, w: 320, h: 120, label: 'PINTU KELUAR GEDUNG SEKOLAH' },
    { id: 'land_f1_triage', x: 320, y: 360, w: 480, h: 120, label: 'TENDA MEDIS P3K & PERAWATAN' },
    { id: 'land_f2_assembly', x: 800, y: 360, w: 500, h: 120, label: 'TITIK KUMPUL LAPANGAN TERBUKA' },
    { id: 'land_f3_command', x: 1300, y: 360, w: 450, h: 120, label: 'POSKO PRESENSI & KOORDINASI' },
    { id: 'land_f4_gate', x: 1750, y: 360, w: 450, h: 120, label: 'GERBANG KELUAR & AMBULANS EVAKUASI' },
  ];

  const chasmHazards: ChasmHazard[] = [];

  const objects: MapObjectL2[] = [
    // Pintu Kembali ke Area 2 (Pintu Keluar Gedung Kelas)
    {
      id: 'l2_field_portal_back',
      type: 'portal_back',
      px: 60,
      py: 360,
      label: 'KEMBALI KE RUANG SIMULASI',
    },

    // Kristal Pascabencana 1: Di Sekitar Tenda P3K Medis
    {
      id: 'l2_f_crystal_1',
      type: 'crystal',
      px: 540,
      py: 310,
    },

    // Kristal Pascabencana 2: Di Samping Rambu Titik Kumpul
    {
      id: 'l2_f_crystal_2',
      type: 'crystal',
      px: 1120,
      py: 310,
    },

    // Kristal Pascabencana 3: Di Dekat Posko Presensi Kepala Sekolah
    {
      id: 'l2_f_crystal_3',
      type: 'crystal',
      px: 1680,
      py: 310,
    },

    // Kristal Pascabencana 4: Di Tengah Lapangan Evakuasi Terbuka
    {
      id: 'l2_f_crystal_4',
      type: 'crystal',
      px: 840,
      py: 310,
    },

    // Pintu Gerbang Keluar Sekolah / Kapsul Ambulans Evakuasi Akhir
    {
      id: 'l2_portal_finish_level2',
      type: 'portal_exit',
      px: 2130,
      py: 360,
      label: 'JALUR MENUJU POS PENGAMATAN MERAPI',
    },
  ];

  return {
    id: 'area-lapangan-evakuasi',
    name: 'Lapangan Evakuasi Sekolah',
    subtitle: 'Mitigasi Pascabencana Gempa, Titik Kumpul & Pertolongan Medis',
    groundProfile,
    platforms,
    landSections,
    chasmHazards,
    objects,
    playerSpawnX: 100,
    playerSpawnY: 360,
  };
}

// ── BUILD AREA 4: PRABENCANA ERUPSI MERAPI (POS PENGAMATAN PVMBG & KRB III) ──
export function buildArea4VolcanoPrabencana(): ZoneConfigL2 {
  // Profil tanah lereng pegunungan asri bergelombang halus (y: 350 - 360)
  const groundPoints: [number, number][] = [
    [0, 360],
    [300, 358],
    [550, 350],
    [850, 352],
    [1250, 358],
    [1750, 360],
    [2200, 360],
  ];

  const groundProfile = interpolateProfile(groundPoints, MAP_WIDTH_PX);
  const platforms: PlatformL2[] = [];

  const landSections: LandSection[] = [
    { id: 'land_v0_entrance', x: 0, y: 360, w: 320, h: 120, label: 'BATAS JALUR LERENG MERAPI' },
    { id: 'land_v1_monument', x: 320, y: 350, w: 480, h: 130, label: 'PLAZA DATA STATUS & RAMBU KRB III' },
    { id: 'land_v2_pga', x: 800, y: 352, w: 450, h: 128, label: 'POS PENGAMATAN GUNUNG API (PGA)' },
    { id: 'land_v3_village', x: 1250, y: 358, w: 500, h: 122, label: 'Desa TANGGUH BENCANA (DESTANA)' },
    { id: 'land_v4_gate', x: 1750, y: 360, w: 450, h: 120, label: 'POSKO RELAWAN & JALUR EVAKUASI' },
  ];

  const chasmHazards: ChasmHazard[] = [];

  const objects: MapObjectL2[] = [
    // Pintu Kembali ke Area 3 (Lapangan Sekolah)
    {
      id: 'l2_volcano_portal_back',
      type: 'portal_back',
      px: 60,
      py: 360,
      label: 'KEMBALI KE LAPANGAN SEKOLAH',
    },

    // Kristal Vulkanik 1: Di Sekitar Plaza Status Merapi
    {
      id: 'l2_v_crystal_1',
      type: 'crystal',
      px: 590,
      py: 310,
    },

    // Kristal Vulkanik 2: Di Samping Pos Pengamatan Merapi (PGA)
    {
      id: 'l2_v_crystal_2',
      type: 'crystal',
      px: 1040,
      py: 310,
    },

    // Kristal Vulkanik 3: Di Dekat Balai Dusun Destana
    {
      id: 'l2_v_crystal_3',
      type: 'crystal',
      px: 1680,
      py: 310,
    },

    // Gerbang Keluar / Pintu Jalur Evakuasi Menuju Area 5
    {
      id: 'l2_portal_volcano_to_sim',
      type: 'portal_exit',
      px: 2130,
      py: 360,
      label: 'JALUR MENUJU SIMULASI ERUPSI',
    },
  ];

  return {
    id: 'area-pos-pengamatan-merapi',
    name: 'Pos Pengamatan Merapi',
    subtitle: 'Prabencana Erupsi Merapi: Status PVMBG & Kesiapsiagaan KRB',
    groundProfile,
    platforms,
    landSections,
    chasmHazards,
    objects,
    playerSpawnX: 100,
    playerSpawnY: 360,
  };
}

// ── BUILD AREA 5: SIMULASI TANGGAP ERUPSI MERAPI (DUSUN DESTANA KRB III) ──
export function buildArea5VolcanoSimulation(): ZoneConfigL2 {
  // Profil tanah lereng pedesaan bergelombang halus (y: 350 - 360)
  const groundPoints: [number, number][] = [
    [0, 360],
    [300, 358],
    [550, 352],
    [850, 350],
    [1250, 356],
    [1750, 360],
    [2200, 360],
  ];

  const groundProfile = interpolateProfile(groundPoints, MAP_WIDTH_PX);
  const platforms: PlatformL2[] = [];

  const landSections: LandSection[] = [
    { id: 'land_s5_0_entrance', x: 0, y: 360, w: 320, h: 120, label: 'BATAS DUSUN KRB III LERENG MERAPI' },
    { id: 'land_s5_1_posko', x: 320, y: 352, w: 480, h: 128, label: 'BALAI DESTANA & POS RONDA KENTONGAN' },
    { id: 'land_s5_2_houses', x: 800, y: 350, w: 500, h: 130, label: 'PEKARANGAN PEMUKIMAN WARGA LERENG' },
    { id: 'land_s5_3_assembly', x: 1300, y: 356, w: 450, h: 124, label: 'TITIK KUMPUL SEMENTARA KELOMPOK RENTAN' },
    { id: 'land_s5_4_road', x: 1750, y: 360, w: 450, h: 120, label: 'JALUR UTAMA & TRUK EVAKUASI BPBD' },
  ];

  const chasmHazards: ChasmHazard[] = [];

  const objects: MapObjectL2[] = [
    // Pintu Kembali ke Area 4 (Pos Pengamatan)
    {
      id: 'l2_sim5_portal_back',
      type: 'portal_back',
      px: 60,
      py: 360,
      label: 'KEMBALI KE POS PENGAMATAN',
    },

    // Kristal Simulasi Erupsi 1: Di Sekitar Balai Destana & Pos Kentongan
    {
      id: 'l2_s5_crystal_1',
      type: 'crystal',
      px: 560,
      py: 310,
    },

    // Kristal Simulasi Erupsi 2: Di Samping Pekarangan Rumah Warga
    {
      id: 'l2_s5_crystal_2',
      type: 'crystal',
      px: 1120,
      py: 310,
    },

    // Kristal Simulasi Erupsi 3: Di Dekat Titik Kumpul Sementara
    {
      id: 'l2_s5_crystal_3',
      type: 'crystal',
      px: 1620,
      py: 310,
    },

    // Gerbang Keluar Menuju Tempat Evakuasi Akhir (TEA)
    {
      id: 'l2_portal_finish_volcano_sim',
      type: 'portal_exit',
      px: 2130,
      py: 360,
      label: 'JALUR MENUJU TEMPAT EVAKUASI AKHIR (TEA)',
    },
  ];

  return {
    id: 'area-simulasi-merapi',
    name: 'Simulasi Erupsi Merapi',
    subtitle: 'Simulasi Tanggap Erupsi: Fenomena Geologis, 4 Status PVMBG & Evakuasi Dusun',
    groundProfile,
    platforms,
    landSections,
    chasmHazards,
    objects,
    playerSpawnX: 100,
    playerSpawnY: 360,
  };
}

// ── BUILD AREA 6: PASCABENCANA ERUPSI MERAPI (BARAK PENGUNGSIAN & PEMULIHAN BAHAYA SEKUNDER) ──
export function buildArea6ShelterRecovery(): ZoneConfigL2 {
  // Dataran rendah zona aman KRB I (y: 360)
  const groundPoints: [number, number][] = [
    [0, 360],
    [400, 360],
    [900, 360],
    [1400, 360],
    [1800, 360],
    [2200, 360],
  ];

  const groundProfile = interpolateProfile(groundPoints, MAP_WIDTH_PX);
  const platforms: PlatformL2[] = [];

  const landSections: LandSection[] = [
    { id: 'land_s6_0_gate', x: 0, y: 360, w: 350, h: 120, label: 'GAPURA & POSKO PENDAFTARAN PENGUNGSI' },
    { id: 'land_s6_1_tents', x: 350, y: 360, w: 450, h: 120, label: 'TENDA PLETON BPBD & TANDON AIR BERSIH TERTUTUP' },
    { id: 'land_s6_2_medis', x: 800, y: 360, w: 450, h: 120, label: 'POSKO MEDIS PMI & PENANGANAN SANITASI' },
    { id: 'land_s6_3_dapur', x: 1250, y: 360, w: 400, h: 120, label: 'DAPUR UMUM TAGANA & LOGISTIK MAKANAN' },
    { id: 'land_s6_4_pemukiman', x: 1650, y: 360, w: 550, h: 120, label: 'PEMUKIMAN ATAP ABU & BANTARAN SUNGAI LAHAR DINGIN' },
  ];

  const chasmHazards: ChasmHazard[] = [];

  const objects: MapObjectL2[] = [
    // Pintu Kembali ke Area 5 (Simulasi Erupsi)
    {
      id: 'l2_s6_portal_back',
      type: 'portal_back',
      px: 60,
      py: 360,
      label: 'KEMBALI KE DUSUN DESTANA',
    },

    // Kristal Pemulihan 1: Di Sekitar Tenda Pleton BPBD
    {
      id: 'l2_s6_crystal_1',
      type: 'crystal',
      px: 580,
      py: 310,
    },

    // Kristal Pemulihan 2: Di Samping Posko Medis PMI & Tandon Air
    {
      id: 'l2_s6_crystal_2',
      type: 'crystal',
      px: 1080,
      py: 310,
    },

    // Kristal Pemulihan 3: Di Dekat Dapur Umum Tagana
    {
      id: 'l2_s6_crystal_3',
      type: 'crystal',
      px: 1540,
      py: 310,
    },

    // Kristal Pemulihan 4: Di Pemukiman Warga & Titik Aman Pengungsian
    {
      id: 'l2_s6_crystal_4',
      type: 'crystal',
      px: 1850,
      py: 310,
    },

    // Mobil Evakuasi BNPB Kemenangan Akhir Level 2 (Penuntas Ekspedisi 100%)
    {
      id: 'l2_portal_finish_level2',
      type: 'lander_capsule',
      px: 2130,
      py: 360,
      label: '★ MOBIL EVAKUASI BNPB ★',
    },
  ];

  return {
    id: 'area-barak-pengungsian',
    name: 'Barak Pengungsian & Pemulihan',
    subtitle: 'Pascabencana Erupsi: Barak Terpadu, Penanganan Abu & Waspada Lahar',
    groundProfile,
    platforms,
    landSections,
    chasmHazards,
    objects,
    playerSpawnX: 100,
    playerSpawnY: 360,
  };
}

const OBJECT_GROUND_OFFSETS_L2: Record<string, number> = {
  lander_capsule: 10,
  portal_back: 2,
  portal_exit: 0,
  challenge_gate: 2,
  info_sign: 32,
  discovery: 34,
  crystal: 24,
};

function snapObjectsToGroundL2(zone: ZoneConfigL2): void {
  const gProf = zone.groundProfile;
  if (!gProf) return;

  for (const obj of zone.objects) {
    if (obj.px === undefined) continue;
    const clampedX = Math.max(0, Math.min(MAP_WIDTH_PX - 1, Math.floor(obj.px)));
    let surfaceY = gProf[clampedX] ?? 360;

    if (zone.platforms) {
      for (const plat of zone.platforms) {
        if (clampedX >= plat.x1 && clampedX <= plat.x2 && plat.y < surfaceY) {
          if (obj.py !== undefined && Math.abs(obj.py - plat.y) < 70) {
            surfaceY = plat.y;
            break;
          }
        }
      }
    }

    const groundOffset = OBJECT_GROUND_OFFSETS_L2[obj.type] ?? 0;
    obj.py = surfaceY - groundOffset;
  }
}

// ── GET ZONE BY AREA INDEX ──
export function getAreaZoneL2(areaIndex: number): ZoneConfigL2 {
  const zone = areaIndex === 5
    ? buildArea6ShelterRecovery()
    : areaIndex === 4
      ? buildArea5VolcanoSimulation()
      : areaIndex === 3
        ? buildArea4VolcanoPrabencana()
        : areaIndex === 2
          ? buildArea3AssemblyField()
          : areaIndex === 1
            ? buildArea2EarthquakeSimulation()
            : buildArea1EarthquakeMitigation();
  snapObjectsToGroundL2(zone);
  return zone;
}

// ── TOTAL KRISTAL LEVEL 2: 21 KRISTAL (4 DI AREA 1, 3 DI AREA 2, 4 DI AREA 3, 3 DI AREA 4, 3 DI AREA 5, 4 DI AREA 6) ──
export const TOTAL_CRYSTALS_L2 = 21;
