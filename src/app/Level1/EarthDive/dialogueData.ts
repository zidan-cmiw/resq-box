// ── src/app/Level1/EarthDive/dialogueData.ts ──────────────────────────────────
// Struktur data pohon dialog Visual Novel & naskah edukatif untuk Level 1
// Mendukung percabangan respons pemain, potret karakter, dan integrasi kurikulum geologi.

export interface CharacterProfile {
  id: string;
  name: string;
  title: string;
  nameColor: string;      // Hex / Tailwind color untuk tag nama
  role: 'npc' | 'mascot' | 'player';
  portraitType:
    | 'prof_raditya'
    | 'kapten_maya'
    | 'resqy'
    | 'player'
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
    | 'komandan_guntur';
}

export interface DialogueChoice {
  id: string;
  text: string;
  nextNodeId: string;
  rewardBadge?: string;
  discoveryIdToMark?: string;     // Menandai temuan geologis agar gerbang seismik terbuka
  triggerDiscoveryModal?: number; // Menampilkan DiscoveryModal materi geologi
  triggerChallengeGate?: boolean; // Memicu mini challenge evaluasi gerbang seismik
}

export interface DialogueNode {
  id: string;
  speakerId: string;       // ID karakter yang berbicara
  text: string;            // Teks dialog (ditampilkan dengan efek ketik)
  expression?: 'normal' | 'happy' | 'thinking' | 'surprised' | 'serious';
  nextNodeId?: string;     // Lanjut otomatis ke node berikutnya saat diklik
  choices?: DialogueChoice[]; // Pilihan percabangan interaktif bagi pemain
  discoveryIdToMark?: string;
  triggerDiscoveryModal?: number;
  triggerChallengeGate?: boolean;
}

export interface DialogueTree {
  id: string;
  title: string;
  startNodeId: string;
  npcSpeakerId?: string; // ID pembicara NPC di sebelah kiri
  nodes: Record<string, DialogueNode>;
}

// ── PROFIL KARAKTER RESMI ──
export const CHARACTER_PROFILES: Record<string, CharacterProfile> = {
  prof_raditya: {
    id: 'prof_raditya',
    name: 'Prof. Raditya',
    title: 'Peneliti Batuan Bumi',
    nameColor: '#fbbf24', // Amber emas cerah
    role: 'npc',
    portraitType: 'prof_raditya',
  },
  kapten_maya: {
    id: 'kapten_maya',
    name: 'Kapten Maya',
    title: 'Pemandu Penyelaman Bumi',
    nameColor: '#f43f5e', // Magenta/Rose menonjol
    role: 'npc',
    portraitType: 'kapten_maya',
  },
  resqy: {
    id: 'resqy',
    name: 'Resqy',
    title: 'Robot Pemandu Penyelamat',
    nameColor: '#38bdf8', // Cyan futuristik
    role: 'mascot',
    portraitType: 'resqy',
  },
  player: {
    id: 'player',
    name: 'Siswa Penjelajah',
    title: 'Murid SMP Kelas 8',
    nameColor: '#a3e635', // Hijau limau segar
    role: 'player',
    portraitType: 'player',
  },
  dr_gea: {
    id: 'dr_gea',
    name: 'Dr. Gea',
    title: 'Peneliti Kerak Bumi',
    nameColor: '#38bdf8', // Cyan muda cerdas
    role: 'npc',
    portraitType: 'dr_gea',
  },
  prof_andini: {
    id: 'prof_andini',
    name: 'Prof. Andini',
    title: 'Guru Geologi',
    nameColor: '#c084fc', // Ungu/Violet elegan
    role: 'npc',
    portraitType: 'prof_andini',
  },
  inspektur_budi: {
    id: 'inspektur_budi',
    name: 'Inspektur Budi',
    title: 'Pengawas Batas Kerak',
    nameColor: '#4ade80', // Emerald cerah
    role: 'npc',
    portraitType: 'inspektur_budi',
  },
  komandan_hendra: {
    id: 'komandan_hendra',
    name: 'Komandan Hendra',
    title: 'Penjaga Pintu Mantel Bumi',
    nameColor: '#f59e0b', // Amber/Emas komando
    role: 'npc',
    portraitType: 'komandan_hendra',
  },
  prof_sarah: {
    id: 'prof_sarah',
    name: 'Prof. Sarah',
    title: 'Peneliti Arus Panas Mantel',
    nameColor: '#ea580c', // Oranye geotermal
    role: 'npc',
    portraitType: 'prof_sarah',
  },
  dr_bayu: {
    id: 'dr_bayu',
    name: 'Dr. Bayu',
    title: 'Ahli Geologi Mantel',
    nameColor: '#f59e0b', // Kuning emas amber
    role: 'npc',
    portraitType: 'dr_bayu',
  },
  dr_danang: {
    id: 'dr_danang',
    name: 'Dr. Danang',
    title: 'Ahli Batuan Mantel',
    nameColor: '#38bdf8', // Cyan cerdas
    role: 'npc',
    portraitType: 'dr_danang',
  },
  petugas_rudi: {
    id: 'petugas_rudi',
    name: 'Petugas Rudi',
    title: 'Pengawas Suhu Mantel Bawah',
    nameColor: '#22c55e', // Hijau keselamatan
    role: 'npc',
    portraitType: 'petugas_rudi',
  },
  komandan_surya: {
    id: 'komandan_surya',
    name: 'Komandan Surya',
    title: 'Penjaga Pintu Inti Luar',
    nameColor: '#ef4444', // Merah komando tegas
    role: 'npc',
    portraitType: 'komandan_surya',
  },
  dr_fajar: {
    id: 'dr_fajar',
    name: 'Dr. Fajar',
    title: 'Pemandu Lapangan Inti Luar',
    nameColor: '#38bdf8', // Cyan elektromagnetik
    role: 'npc',
    portraitType: 'dr_fajar',
  },
  prof_ratna: {
    id: 'prof_ratna',
    name: 'Prof. Ratna',
    title: 'Peneliti Logam Cair Inti Luar',
    nameColor: '#f59e0b', // Kuning emas lautan logam
    role: 'npc',
    portraitType: 'prof_ratna',
  },
  dr_aris: {
    id: 'dr_aris',
    name: 'Dr. Aris',
    title: 'Ahli Medan Magnet Bumi',
    nameColor: '#818cf8', // Indigo medan magnetosfer
    role: 'npc',
    portraitType: 'dr_aris',
  },
  petugas_joko: {
    id: 'petugas_joko',
    name: 'Petugas Joko',
    title: 'Pengawas Radiasi Magnetik',
    nameColor: '#4ade80', // Hijau keselamatan
    role: 'npc',
    portraitType: 'petugas_joko',
  },
  komandan_teguh: {
    id: 'komandan_teguh',
    name: 'Komandan Teguh',
    title: 'Penjaga Pintu Inti Dalam',
    nameColor: '#f43f5e', // Merah rose komando inti
    role: 'npc',
    portraitType: 'komandan_teguh',
  },
  dr_bagus: {
    id: 'dr_bagus',
    name: 'Dr. Bagus',
    title: 'Pemandu Geofisika Inti Dalam',
    nameColor: '#f59e0b', // Amber emas
    role: 'npc',
    portraitType: 'dr_bagus',
  },
  prof_lestari: {
    id: 'prof_lestari',
    name: 'Prof. Lestari',
    title: 'Peneliti Kristal Besi Inti Dalam',
    nameColor: '#c084fc', // Ungu violet kristal
    role: 'npc',
    portraitType: 'prof_lestari',
  },
  dr_farhan: {
    id: 'dr_farhan',
    name: 'Dr. Farhan',
    title: 'Ahli Gravitasi Pusat Bumi',
    nameColor: '#38bdf8', // Cyan kosmik
    role: 'npc',
    portraitType: 'dr_farhan',
  },
  petugas_dian: {
    id: 'petugas_dian',
    name: 'Petugas Dian',
    title: 'Pengawas Kapsul Evakuasi Inti',
    nameColor: '#4ade80', // Hijau keselamatan
    role: 'npc',
    portraitType: 'petugas_dian',
  },
  komandan_bintang: {
    id: 'komandan_bintang',
    name: 'Komandan Bintang',
    title: 'Kepala Ekspedisi Pusat Bumi',
    nameColor: '#facc15', // Emas bintang agung
    role: 'npc',
    portraitType: 'komandan_bintang',
  },
  dr_taufik: {
    id: 'dr_taufik',
    name: 'Dr. Taufik',
    title: 'Pemandu Geologis Pangea',
    nameColor: '#f59e0b', // Amber hangat
    role: 'npc',
    portraitType: 'dr_taufik',
  },
  prof_maya: {
    id: 'prof_maya',
    name: 'Prof. Maya',
    title: 'Ahli Superbenua Pangea',
    nameColor: '#c084fc', // Ungu elegan
    role: 'npc',
    portraitType: 'prof_maya',
  },
  dr_citra: {
    id: 'dr_citra',
    name: 'Dr. Citra',
    title: 'Peneliti Pegunungan Kembar',
    nameColor: '#fb923c', // Oranye terakota
    role: 'npc',
    portraitType: 'dr_citra',
  },
  prof_ilham: {
    id: 'prof_ilham',
    name: 'Prof. Ilham',
    title: 'Ahli Pemekaran Samudra',
    nameColor: '#38bdf8', // Cyan samudra
    role: 'npc',
    portraitType: 'prof_ilham',
  },
  komandan_satria: {
    id: 'komandan_satria',
    name: 'Komandan Satria',
    title: 'Penjaga Gerbang Lembah Retakan',
    nameColor: '#f43f5e', // Crimson komando
    role: 'npc',
    portraitType: 'komandan_satria',
  },
  komandan_arya: {
    id: 'komandan_arya',
    name: 'Komandan Arya',
    title: 'Penjaga Altar Batas Konvergen',
    nameColor: '#ef4444', // Merah lava menyala
    role: 'npc',
    portraitType: 'komandan_arya',
  },
  komandan_guntur: {
    id: 'komandan_guntur',
    name: 'Komandan Guntur',
    title: 'Kepala Sektor Sesar San Andreas',
    nameColor: '#f59e0b', // Emas gurun taktis
    role: 'npc',
    portraitType: 'komandan_guntur',
  },
};

// ── POHON DIALOG: MASKOT RESQY (PANDUAN AWAL) ──
export const MASCOT_INTRO_DIALOGUE: DialogueTree = {
  id: 'mascot_intro',
  title: 'Panduan Awal Resqy',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'resqy',
      text: 'Halo! Aku Resqy, robot pemandu yang akan menemanimu menjelajahi isi bumi!',
      expression: 'happy',
      nextNodeId: 'explain_controls',
    },
    explain_controls: {
      id: 'explain_controls',
      speakerId: 'resqy',
      text: 'Gunakan tombol [A] / [D] atau Panah untuk berjalan, dan [SPASI] untuk melompat!',
      expression: 'normal',
      nextNodeId: 'point_to_npc',
    },
    point_to_npc: {
      id: 'point_to_npc',
      speakerId: 'resqy',
      text: 'Di depan ada Prof. Raditya. Dekati beliau lalu tekan [E] atau [ENTER] untuk mengobrol ya!',
      expression: 'happy',
      choices: [
        {
          id: 'c1',
          text: 'Siap, aku temui Prof. Raditya!',
          nextNodeId: 'ready_resqy',
        },
        {
          id: 'c2',
          text: 'Apakah perjalanan ke dalam bumi ini panas?',
          nextNodeId: 'danger_resqy',
        },
      ],
    },
    danger_resqy: {
      id: 'danger_resqy',
      speakerId: 'resqy',
      text: 'Makin ke dalam bumi memang suhunya makin panas, tapi pakaian pelindungmu aman kok!',
      expression: 'serious',
      nextNodeId: 'ready_resqy',
    },
    ready_resqy: {
      id: 'ready_resqy',
      speakerId: 'resqy',
      text: 'Kumpulkan juga kristal kuning bercahaya di jalan ya. Selamat bertualang!',
      expression: 'happy',
    },
  },
};

// ── POHON DIALOG: PROF. RADITYA (LOKASI AWAL - PENGGANTI CATATAN PERTAMA) ──
export const PROF_RADITYA_DIALOGUE: DialogueTree = {
  id: 'prof_raditya_dialogue',
  title: 'Catatan Peneliti Batuan Bumi',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'prof_raditya',
      text: 'Halo penjelajah muda! Senang bertemu denganmu di permukaan bumi.',
      expression: 'happy',
      nextNodeId: 'question_dig',
    },
    question_dig: {
      id: 'question_dig',
      speakerId: 'prof_raditya',
      text: 'Tahukah kamu, seberapa dalam manusia pernah menggali lubang ke dalam bumi?',
      expression: 'thinking',
      choices: [
        {
          id: 'c1',
          text: 'Seberapa dalam yang pernah dicapai manusia, Prof?',
          nextNodeId: 'explain_depth',
        },
        {
          id: 'c2',
          text: 'Tinggal kita bor saja terus ke bawah, kan?',
          nextNodeId: 'explain_challenge',
        },
      ],
    },
    explain_depth: {
      id: 'explain_depth',
      speakerId: 'prof_raditya',
      text: 'Baru sekitar 12 kilometer di Rusia! Itu bahkan belum bisa menembus kulit terluar bumi.',
      expression: 'serious',
      nextNodeId: 'why_hard',
    },
    explain_challenge: {
      id: 'explain_challenge',
      speakerId: 'prof_raditya',
      text: 'Tidak semudah itu! Makin dalam kita mengebor, besi bor akan meleleh karena suhunya sangat panas dan tekanannya sangat tinggi.',
      expression: 'serious',
      nextNodeId: 'why_hard',
    },
    why_hard: {
      id: 'why_hard',
      speakerId: 'prof_raditya',
      text: 'Karena manusia belum bisa mengebor sampai dalam, para ilmuwan mempelajari getaran gempa bumi untuk mengetahui isi perut bumi kita.',
      expression: 'normal',
      nextNodeId: 'ready_question',
    },
    ready_question: {
      id: 'ready_question',
      speakerId: 'prof_raditya',
      text: 'Apakah kamu sudah siap melanjutkan perjalanan melintasi jembatan kayu di depan?',
      expression: 'thinking',
      choices: [
        {
          id: 'ready_yes',
          text: 'Siap Prof, saya paham!',
          nextNodeId: 'farewell_ready',
          discoveryIdToMark: 'surface_sign1',
        },
        {
          id: 'ready_wait',
          text: 'Boleh ingatkan poin pentingnya sekali lagi?',
          nextNodeId: 'recap_notes',
          discoveryIdToMark: 'surface_sign1',
        },
      ],
    },
    recap_notes: {
      id: 'recap_notes',
      speakerId: 'prof_raditya',
      text: 'Ingat dua hal: di dalam bumi itu suhunya sangat panas dan tekanannya luar biasa tinggi! Kita memakai getaran gempa untuk menelitinya.',
      expression: 'happy',
      nextNodeId: 'farewell_ready',
    },
    farewell_ready: {
      id: 'farewell_ready',
      speakerId: 'prof_raditya',
      text: 'Hebat! Terus jalan ke arah kanan ya. Di sana ada Kapten Maya yang sudah menyiapkan pintu penyelaman.',
      expression: 'happy',
      discoveryIdToMark: 'surface_sign1',
    },
  },
};

// ── POHON DIALOG: KAPTEN MAYA (DEKAT JEMBATAN / RIG BOR - PENGGANTI CATATAN KEDUA) ──
export const KAPTEN_MAYA_DIALOGUE: DialogueTree = {
  id: 'kapten_maya_dialogue',
  title: 'Pintu Penyelaman ke Dalam Bumi',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'kapten_maya',
      text: 'Halo! Selamat datang di pos penyelaman bumi.',
      expression: 'happy',
      nextNodeId: 'explain_crust',
    },
    explain_crust: {
      id: 'explain_crust',
      speakerId: 'kapten_maya',
      text: 'Kita akan turun ke lapisan Kerak Bumi. Kerak bumi adalah kulit paling luar planet kita, dan merupakan lapisan yang paling tipis!',
      expression: 'normal',
      choices: [
        {
          id: 'c1',
          text: 'Kerak bumi itu isinya apa saja, Kapten?',
          nextNodeId: 'oceanic_crust_info',
        },
        {
          id: 'c2',
          text: 'Saya siap meluncur ke bawah tanah!',
          nextNodeId: 'ready_dive',
        },
      ],
    },
    oceanic_crust_info: {
      id: 'oceanic_crust_info',
      speakerId: 'kapten_maya',
      text: 'Ada dua jenis: Kerak Benua di bawah daratan tempat kita berdiri, dan Kerak Samudra di dasar lautan!',
      expression: 'thinking',
      nextNodeId: 'ready_dive',
    },
    ready_dive: {
      id: 'ready_dive',
      speakerId: 'kapten_maya',
      text: 'Pintu kapsul penyelaman di sebelah kanan sudah siap digunakan.',
      expression: 'happy',
      nextNodeId: 'confirm_choice',
    },
    confirm_choice: {
      id: 'confirm_choice',
      speakerId: 'kapten_maya',
      text: 'Apakah kamu sudah siap menyelam ke lapisan kerak bumi sekarang?',
      expression: 'serious',
      choices: [
        {
          id: 'yes_dive',
          text: 'Siap meluncur, Kapten!',
          nextNodeId: 'farewell_dive',
          discoveryIdToMark: 'surface_sign2',
        },
        {
          id: 'wait_dive',
          text: 'Sebentar, saya mau lihat-lihat dulu.',
          nextNodeId: 'explore_more',
          discoveryIdToMark: 'surface_sign2',
        },
      ],
    },
    explore_more: {
      id: 'explore_more',
      speakerId: 'kapten_maya',
      text: 'Boleh! Kumpulkan kristal yang tersisa dulu. Kalau sudah siap, tinggal dekati pintu di sebelah kanan.',
      expression: 'happy',
      discoveryIdToMark: 'surface_sign2',
    },
    farewell_dive: {
      id: 'farewell_dive',
      speakerId: 'kapten_maya',
      text: 'Bagus! Berdirilah di lingkaran portal di sebelah kanan, lalu tekan tombol [E] atau Panah Bawah untuk meluncur!',
      expression: 'happy',
      discoveryIdToMark: 'surface_sign2',
    },
  },
};

// ── POHON DIALOG AREA 2: MASKOT RESQY (BRIEFING KERAK BUMI) ──
export const MASCOT_CRUST_INTRO_DIALOGUE: DialogueTree = {
  id: 'mascot_crust_intro',
  title: 'Selamat Datang di Kerak Bumi',
  npcSpeakerId: 'resqy',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'resqy',
      text: 'Bip-bip! Kita sudah mendarat di Zona Kerak Bumi! Ini adalah lapisan bumi paling luar tempat kita hidup.',
      expression: 'happy',
      nextNodeId: 'explain_team',
    },
    explain_team: {
      id: 'explain_team',
      speakerId: 'resqy',
      text: 'Di sini ada Dr. Gea di dekat turunan, Prof. Andini di atas bukit batu, dan Komandan Hendra yang menjaga pintu ke mantel bumi.',
      expression: 'normal',
      nextNodeId: 'mission_hint',
    },
    mission_hint: {
      id: 'mission_hint',
      speakerId: 'resqy',
      text: 'Sebelum membuka pintu ke bawah, Komandan Hendra akan menguji apakah kamu sudah paham tentang kerak bumi. Jadi pelajari materinya baik-baik ya!',
      expression: 'serious',
      choices: [
        {
          id: 'c1',
          text: 'Siap Resqy, aku temui Dr. Gea dan Prof. Andini dulu!',
          nextNodeId: 'ready_go',
        },
        {
          id: 'c2',
          text: 'Kenapa kerak bumi bisa bergerak?',
          nextNodeId: 'explain_plates',
        },
      ],
    },
    explain_plates: {
      id: 'explain_plates',
      speakerId: 'resqy',
      text: 'Karena kerak bumi terpecah menjadi kepingan-kepingan besar yang disebut lempeng bumi! Kepingan ini mengapung dan bergerak sangat pelan.',
      expression: 'thinking',
      nextNodeId: 'ready_go',
    },
    ready_go: {
      id: 'ready_go',
      speakerId: 'resqy',
      text: 'Ayo jalan ke kanan! Jangan lupa kumpulkan kristal bercahaya di jalan ya!',
      expression: 'happy',
    },
  },
};

export const MASCOT_CRUST_GUIDE_DIALOGUE: DialogueTree = {
  id: 'mascot_crust_guide',
  title: 'Petunjuk Arah Kerak Bumi',
  npcSpeakerId: 'resqy',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'resqy',
      text: 'Bip! Bingung mau ke mana? Ikuti langkah mudah ini:',
      expression: 'happy',
      nextNodeId: 'checklist',
    },
    checklist: {
      id: 'checklist',
      speakerId: 'resqy',
      text: '1. Bicara dengan Dr. Gea di bawah.\n2. Lompat ke atas bukit untuk temui Prof. Andini dan buka materi.\n3. Lewati jalan retak dan temui Inspektur Budi.\n4. Temui Komandan Hendra di pintu bawah untuk menjawab tantangan!',
      expression: 'normal',
    },
  },
};

// ── POHON DIALOG AREA 2: DR. GEA (MINERALOGI & LITOLOGI KERAK) ──
export const DR_GEA_DIALOGUE: DialogueTree = {
  id: 'dr_gea_dialogue',
  title: 'Mengenal Kerak Bumi',
  npcSpeakerId: 'dr_gea',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'dr_gea',
      text: 'Halo penjelajah! Kamu tahu tidak, kerak bumi tempat kita berpijak ini adalah lapisan bumi yang paling tipis?',
      expression: 'happy',
      nextNodeId: 'explain_crust',
    },
    explain_crust: {
      id: 'explain_crust',
      speakerId: 'dr_gea',
      text: 'Kerak bumi terbagi jadi dua jenis: Kerak Benua di bawah daratan, dan Kerak Samudra di bawah lautan.',
      expression: 'normal',
      choices: [
        {
          id: 'c1',
          text: 'Apa perbedaan daratan dan dasar laut itu, Dok?',
          nextNodeId: 'explain_rock_types',
        },
        {
          id: 'c2',
          text: 'Benarkah kerak bumi kita pecah-pecah?',
          nextNodeId: 'explain_plates',
        },
      ],
    },
    explain_rock_types: {
      id: 'explain_rock_types',
      speakerId: 'dr_gea',
      text: 'Kerak benua (daratan) itu tebal sekali, mencapai 100 kilometer! Kalau kerak samudra (dasar laut) jauh lebih tipis, cuma 5 sampai 15 kilometer saja.',
      expression: 'thinking',
      nextNodeId: 'point_to_andini',
    },
    explain_plates: {
      id: 'explain_plates',
      speakerId: 'dr_gea',
      text: 'Iya, betul sekali! Kerak bumi terbagi menjadi sekitar 20 lempeng besar yang terus bergeser secara perlahan.',
      expression: 'serious',
      nextNodeId: 'point_to_andini',
    },
    point_to_andini: {
      id: 'point_to_andini',
      speakerId: 'dr_gea',
      text: 'Lompatlah ke bukit batu di depan! Di sana ada Prof. Andini yang punya gambar dan materi perbandingannya.',
      expression: 'happy',
    },
  },
};

// ── POHON DIALOG AREA 2: PROF. ANDINI (TEMUAN GEOLOGIS KOMPARASI KERAK) ──
export const PROF_ANDINI_DIALOGUE: DialogueTree = {
  id: 'prof_andini_dialogue',
  title: 'Materi Kerak Benua & Kerak Samudra',
  npcSpeakerId: 'prof_andini',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'prof_andini',
      text: 'Halo! Hebat sekali kamu berhasil memanjat sampai ke bukit ini.',
      expression: 'happy',
      nextNodeId: 'ask_interest',
    },
    ask_interest: {
      id: 'ask_interest',
      speakerId: 'prof_andini',
      text: 'Apakah kamu mau melihat materi dan fakta menarik tentang kerak bumi?',
      expression: 'thinking',
      choices: [
        {
          id: 'see_facts_now',
          text: 'Iya Prof, saya ingin melihat materinya!',
          nextNodeId: 'open_discovery',
          discoveryIdToMark: 'crust_disc_compare',
        },
        {
          id: 'brief_first',
          text: 'Boleh tolong jelaskan intinya dulu, Prof?',
          nextNodeId: 'explain_brief',
          discoveryIdToMark: 'crust_disc_compare',
        },
      ],
    },
    explain_brief: {
      id: 'explain_brief',
      speakerId: 'prof_andini',
      text: 'Intinya sangat mudah: Kerak Benua (daratan) itu sangat tebal (sampai 100 km). Sedangkan Kerak Samudra (dasar laut) tipis (5-15 km), tapi lebih padat dan berat!',
      expression: 'normal',
      nextNodeId: 'open_discovery_prompt',
    },
    open_discovery_prompt: {
      id: 'open_discovery_prompt',
      speakerId: 'prof_andini',
      text: 'Sekarang yuk kita buka gambar materinya agar kamu bisa melihat perbandingannya dengan jelas!',
      expression: 'happy',
      choices: [
        {
          id: 'open_now',
          text: 'Buka Materi Kerak Bumi!',
          nextNodeId: 'open_discovery',
          discoveryIdToMark: 'crust_disc_compare',
        },
      ],
    },
    open_discovery: {
      id: 'open_discovery',
      speakerId: 'prof_andini',
      text: 'Ini dia materinya! Baca baik-baik ya, ini nanti akan ditanyakan oleh Komandan Hendra di bawah!',
      expression: 'happy',
      discoveryIdToMark: 'crust_disc_compare',
      triggerDiscoveryModal: 0,
    },
  },
};

export const PROF_ANDINI_REVIEW_DIALOGUE: DialogueTree = {
  id: 'prof_andini_review_dialogue',
  title: 'Melihat Ulang Materi Kerak Bumi',
  npcSpeakerId: 'prof_andini',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'prof_andini',
      text: 'Halo lagi! Apakah kamu ingin melihat kembali materi tentang kerak bumi?',
      expression: 'happy',
      choices: [
        {
          id: 'review_yes',
          text: 'Iya Prof, tolong buka kembali materinya!',
          nextNodeId: 'open_modal',
        },
        {
          id: 'review_no',
          text: 'Sudah cukup Prof, saya sudah ingat semua!',
          nextNodeId: 'done',
        },
      ],
    },
    open_modal: {
      id: 'open_modal',
      speakerId: 'prof_andini',
      text: 'Baik, silakan pelajari kembali materinya!',
      expression: 'happy',
      triggerDiscoveryModal: 0,
    },
    done: {
      id: 'done',
      speakerId: 'prof_andini',
      text: 'Bagus sekali! Lanjutkan perjalanan ke kanan, temui Inspektur Budi dan Komandan Hendra ya!',
      expression: 'happy',
    },
  },
};

// ── POHON DIALOG AREA 2: INSPEKTUR BUDI (PATAHAN & BATAS MOHO) ──
export const INSPEKTUR_BUDI_DIALOGUE: DialogueTree = {
  id: 'inspektur_budi_dialogue',
  title: 'Stasiun Batas Kerak Bumi',
  npcSpeakerId: 'inspektur_budi',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'inspektur_budi',
      text: 'Hati-hati melangkah! Kita sedang berada di dekat retakan besar batas kerak bumi.',
      expression: 'serious',
      nextNodeId: 'explain_moho',
    },
    explain_moho: {
      id: 'explain_moho',
      speakerId: 'inspektur_budi',
      text: 'Di bawah kita ada yang namanya Batas Moho, yaitu garis batas pemisah antara kerak bumi dan lapisan mantel di bawahnya.',
      expression: 'thinking',
      choices: [
        {
          id: 'c1',
          text: 'Kenapa dinamakan Batas Moho, Pak?',
          nextNodeId: 'explain_density',
        },
        {
          id: 'c2',
          text: 'Ada apa di sebelah kanan jalan ini?',
          nextNodeId: 'warn_gate',
        },
      ],
    },
    explain_density: {
      id: 'explain_density',
      speakerId: 'inspektur_budi',
      text: 'Namanya diambil dari penemunya, Mohorovicic! Di batas ini, batuan mantel di bawah jauh lebih padat sehingga getaran gempa merambat makin cepat.',
      expression: 'normal',
      nextNodeId: 'warn_gate',
    },
    warn_gate: {
      id: 'warn_gate',
      speakerId: 'inspektur_budi',
      text: 'Di sebelah kanan ada Komandan Hendra. Beliau menjaga pintu turun ke mantel bumi. Pastikan kamu sudah siap ya!',
      expression: 'happy',
    },
  },
};

// ── POHON DIALOG AREA 2: KOMANDAN HENDRA (PENJAGA GERBANG SEISMIK MOHO) ──
export const KOMANDAN_HENDRA_READY_DIALOGUE: DialogueTree = {
  id: 'komandan_hendra_ready_dialogue',
  title: 'Pintu Masuk Mantel Bumi',
  npcSpeakerId: 'komandan_hendra',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'komandan_hendra',
      text: 'Halo penjelajah! Aku Komandan Hendra, penjaga pintu masuk ke lapisan mantel bumi.',
      expression: 'serious',
      nextNodeId: 'ask_readiness',
    },
    ask_readiness: {
      id: 'ask_readiness',
      speakerId: 'komandan_hendra',
      text: 'Apakah kamu sudah paham mengenai kerak bumi sebelum kita membuka pintu turun ke mantel bumi?',
      expression: 'thinking',
      choices: [
        {
          id: 'ready_challenge',
          text: 'Sudah paham Komandan, saya siap tantangannya!',
          nextNodeId: 'start_challenge_node',
        },
        {
          id: 'wait_challenge',
          text: 'Sebentar Komandan, saya mau ingat-ingat materinya dulu.',
          nextNodeId: 'standby_node',
        },
      ],
    },
    start_challenge_node: {
      id: 'start_challenge_node',
      speakerId: 'komandan_hendra',
      text: 'Bagus! Jawab tebak kata ini dengan benar untuk membuka kunci pintunya!',
      expression: 'happy',
      triggerChallengeGate: true,
    },
    standby_node: {
      id: 'standby_node',
      speakerId: 'komandan_hendra',
      text: 'Bagus, jangan terburu-buru. Kamu bisa baca lagi materi di bukit Prof. Andini. Kalau sudah yakin, ajak aku bicara lagi ya!',
      expression: 'normal',
    },
  },
};

export const KOMANDAN_HENDRA_LOCKED_DIALOGUE: DialogueTree = {
  id: 'komandan_hendra_locked_dialogue',
  title: 'Pintu Masih Terkunci',
  npcSpeakerId: 'komandan_hendra',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'komandan_hendra',
      text: 'Tunggu sebentar! Pintu turun ke mantel bumi belum bisa dibuka.',
      expression: 'serious',
      nextNodeId: 'explain_protocol',
    },
    explain_protocol: {
      id: 'explain_protocol',
      speakerId: 'komandan_hendra',
      text: 'Kamu harus mempelajari dulu materi tentang kerak bumi dari Prof. Andini di atas bukit tadi. Temui beliau dan buka materinya ya!',
      expression: 'thinking',
      choices: [
        {
          id: 'ack',
          text: 'Baik Komandan, saya akan temui Prof. Andini dulu!',
          nextNodeId: 'farewell',
        },
      ],
    },
    farewell: {
      id: 'farewell',
      speakerId: 'komandan_hendra',
      text: 'Bagus! Naiklah ke bukit batu dan pelajari materinya. Setelah itu kembalilah ke sini!',
      expression: 'normal',
    },
  },
};

export const KOMANDAN_HENDRA_UNLOCKED_DIALOGUE: DialogueTree = {
  id: 'komandan_hendra_unlocked_dialogue',
  title: 'Pintu Mantel Bumi Terbuka',
  npcSpeakerId: 'komandan_hendra',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'komandan_hendra',
      text: 'Hebat sekali! Jawabanmu benar semua, kamu sudah paham materi kerak bumi dengan baik!',
      expression: 'happy',
      nextNodeId: 'instructions',
    },
    instructions: {
      id: 'instructions',
      speakerId: 'komandan_hendra',
      text: 'Pintu turun sudah terbuka. Masuklah ke lingkaran portal di sebelah kanan untuk menyelam ke Mantel Bumi. Hati-hati, di bawah suhunya jauh lebih panas!',
      expression: 'serious',
    },
  },
};

// ══════════════════════════════════════════════════════════════════════════
// AREA 3: MANTEL BUMI (POHON DIALOG RESQY & PARA PENELITI MANTEL)
// ══════════════════════════════════════════════════════════════════════════

// ── POHON DIALOG: MASKOT RESQY (BRIEFING AWAL MANTEL BUMI) ──
export const MASCOT_MANTLE_INTRO_DIALOGUE: DialogueTree = {
  id: 'mascot_mantle_intro',
  title: 'Briefing Mantel Bumi',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'resqy',
      text: 'Wah, kita sudah sampai di Mantel Bumi! Lapisan ini adalah lapisan tertebal di bumi, tebalnya mencapai 2.900 kilometer!',
      expression: 'surprised',
      nextNodeId: 'explain_heat',
    },
    explain_heat: {
      id: 'explain_heat',
      speakerId: 'resqy',
      text: 'Suhunya sangat panas, tapi batuan di sini tetap padat dan mengalir pelan seperti adonan dodol kental.',
      expression: 'happy',
      nextNodeId: 'point_ahead',
    },
    point_ahead: {
      id: 'point_ahead',
      speakerId: 'resqy',
      text: 'Ayo kumpulkan kristal energi di jalan dan temui Prof. Sarah serta Dr. Danang di depan ya!',
      expression: 'happy',
    },
  },
};

export const MASCOT_MANTLE_GUIDE_DIALOGUE: DialogueTree = {
  id: 'mascot_mantle_guide',
  title: 'Tips Mantel Bumi dari Resqy',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'resqy',
      text: 'Tips dari Resqy: Di Mantel Bumi, batuan mengalir perlahan karena adanya arus panas yang berputar (konveksi)!',
      expression: 'happy',
      nextNodeId: 'words_hint',
    },
    words_hint: {
      id: 'words_hint',
      speakerId: 'resqy',
      text: 'Ingat baik-baik kata kuncinya: MANTEL, PANAS, dan KONVEKSI. Nanti Komandan Surya akan menanyakannya!',
      expression: 'thinking',
    },
  },
};

// ── POHON DIALOG: DR. BAYU (PENGGANTI CATATAN PERTAMA PX 260) ──
export const DR_BAYU_DIALOGUE: DialogueTree = {
  id: 'dr_bayu_dialogue',
  title: 'Stasiun Pengamatan Mantel Bumi',
  npcSpeakerId: 'dr_bayu',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'dr_bayu',
      text: 'Halo penjelajah! Selamat datang di pos pengamatan Mantel Bumi.',
      expression: 'happy',
      nextNodeId: 'explain_mantle',
    },
    explain_mantle: {
      id: 'explain_mantle',
      speakerId: 'dr_bayu',
      text: 'Mantel bumi adalah lapisan paling tebal di planet kita. Di sini batuan mengalir sangat pelan karena panas yang luar biasa!',
      expression: 'normal',
      choices: [
        {
          id: 'c1',
          text: 'Apakah batuannya meleleh seperti air, Pak?',
          nextNodeId: 'answer_melt',
        },
        {
          id: 'c2',
          text: 'Siapa yang ada di bukit depan, Pak?',
          nextNodeId: 'answer_ahead',
        },
      ],
    },
    answer_melt: {
      id: 'answer_melt',
      speakerId: 'dr_bayu',
      text: 'Tidak seperti air, tapi mengalir kental dan sangat lambat seperti adonan aspal atau gulali panas!',
      expression: 'thinking',
      nextNodeId: 'answer_ahead',
    },
    answer_ahead: {
      id: 'answer_ahead',
      speakerId: 'dr_bayu',
      text: 'Di bukit depan ada Prof. Sarah dan Dr. Danang. Temui mereka untuk mempelajari arus panas dan batuan mantel ya!',
      expression: 'happy',
    },
  },
};

// ── POHON DIALOG: PROF. SARAH (TEMUAN GEOLOGIS 1: ARUS PANAS MANTEL PX 330) ──
export const PROF_SARAH_DIALOGUE: DialogueTree = {
  id: 'prof_sarah_dialogue',
  title: 'Peneliti Arus Panas Mantel',
  npcSpeakerId: 'prof_sarah',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'prof_sarah',
      text: 'Halo penjelajah muda! Apakah kamu ingin tahu bagaimana panas di dalam mantel bumi mengalir?',
      expression: 'happy',
      choices: [
        {
          id: 'open_direct',
          text: 'Iya Prof. Sarah, saya mau lihat materinya!',
          nextNodeId: 'open_discovery',
          discoveryIdToMark: 'mantle_disc1',
        },
        {
          id: 'brief_first',
          text: 'Boleh tolong jelaskan intinya dulu, Prof?',
          nextNodeId: 'explain_brief',
          discoveryIdToMark: 'mantle_disc1',
        },
      ],
    },
    explain_brief: {
      id: 'explain_brief',
      speakerId: 'prof_sarah',
      text: 'Intinya, panas dari dalam bumi membuat batuan mantel berputar naik dan turun seperti air mendidih. Arus perputaran ini disebut arus konveksi!',
      expression: 'normal',
      nextNodeId: 'open_prompt',
    },
    open_prompt: {
      id: 'open_prompt',
      speakerId: 'prof_sarah',
      text: 'Yuk kita buka gambar materinya agar kamu bisa melihat animasi arus panas ini dengan jelas!',
      expression: 'happy',
      choices: [
        {
          id: 'open_now',
          text: 'Buka Materi Arus Panas Mantel!',
          nextNodeId: 'open_discovery',
          discoveryIdToMark: 'mantle_disc1',
        },
      ],
    },
    open_discovery: {
      id: 'open_discovery',
      speakerId: 'prof_sarah',
      text: 'Ini dia materinya! Amati baik-baik ya, konsep arus panas ini nanti akan ditanyakan sebelum turun ke inti bumi!',
      expression: 'happy',
      discoveryIdToMark: 'mantle_disc1',
      triggerDiscoveryModal: 4,
    },
  },
};

export const PROF_SARAH_REVIEW_DIALOGUE: DialogueTree = {
  id: 'prof_sarah_review_dialogue',
  title: 'Melihat Ulang Materi Arus Panas',
  npcSpeakerId: 'prof_sarah',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'prof_sarah',
      text: 'Halo lagi! Apakah kamu ingin melihat kembali materi arus panas mantel bumi?',
      expression: 'happy',
      choices: [
        {
          id: 'review_yes',
          text: 'Iya Prof, tolong buka kembali materinya!',
          nextNodeId: 'open_modal',
        },
        {
          id: 'review_no',
          text: 'Sudah cukup Prof, saya masih ingat semuanya!',
          nextNodeId: 'done',
        },
      ],
    },
    open_modal: {
      id: 'open_modal',
      speakerId: 'prof_sarah',
      text: 'Bagus, silakan pelajari kembali materinya!',
      expression: 'happy',
      triggerDiscoveryModal: 4,
    },
    done: {
      id: 'done',
      speakerId: 'prof_sarah',
      text: 'Hebat! Lanjutkan perjalananmu ke kanan dan temui Dr. Danang di bukit batu tengah ya!',
      expression: 'happy',
    },
  },
};

// ── POHON DIALOG: DR. DANANG (TEMUAN GEOLOGIS 2: BATUAN MANTEL & TEKANAN PX 730) ──
export const DR_DANANG_DIALOGUE: DialogueTree = {
  id: 'dr_danang_dialogue',
  title: 'Peneliti Batuan Mantel Bumi',
  npcSpeakerId: 'dr_danang',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'dr_danang',
      text: 'Halo penjelajah! Apakah kamu ingin tahu kenapa batuan di dasar mantel tetap kokoh meski suhunya ribuan derajat?',
      expression: 'happy',
      choices: [
        {
          id: 'open_direct',
          text: 'Iya Dr. Danang, saya mau lihat materinya!',
          nextNodeId: 'open_discovery',
          discoveryIdToMark: 'mantle_disc2',
        },
        {
          id: 'brief_first',
          text: 'Kenapa batuannya tidak mencair, Pak?',
          nextNodeId: 'explain_brief',
          discoveryIdToMark: 'mantle_disc2',
        },
      ],
    },
    explain_brief: {
      id: 'explain_brief',
      speakerId: 'dr_danang',
      text: 'Karena di sini ada tekanan luar biasa dahsyat dari seluruh berat lapisan bumi di atasnya! Tekanan itu memadatkan batuan agar tetap kokoh.',
      expression: 'normal',
      nextNodeId: 'open_prompt',
    },
    open_prompt: {
      id: 'open_prompt',
      speakerId: 'dr_danang',
      text: 'Mari kita buka lembar materinya agar kamu bisa melihat rahasia batuan mantel ini!',
      expression: 'happy',
      choices: [
        {
          id: 'open_now',
          text: 'Buka Materi Batuan Mantel!',
          nextNodeId: 'open_discovery',
          discoveryIdToMark: 'mantle_disc2',
        },
      ],
    },
    open_discovery: {
      id: 'open_discovery',
      speakerId: 'dr_danang',
      text: 'Silakan pelajari baik-baik ya. Ingat tentang tekanan dahsyat yang menahan batuan tetap padat!',
      expression: 'happy',
      discoveryIdToMark: 'mantle_disc2',
      triggerDiscoveryModal: 5,
    },
  },
};

export const DR_DANANG_REVIEW_DIALOGUE: DialogueTree = {
  id: 'dr_danang_review_dialogue',
  title: 'Melihat Ulang Materi Batuan Mantel',
  npcSpeakerId: 'dr_danang',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'dr_danang',
      text: 'Halo lagi! Mau membaca ulang materi tentang batuan mantel dan tekanannya?',
      expression: 'happy',
      choices: [
        {
          id: 'review_yes',
          text: 'Iya Pak, tolong buka kembali materinya!',
          nextNodeId: 'open_modal',
        },
        {
          id: 'review_no',
          text: 'Sudah paham Pak, terima kasih!',
          nextNodeId: 'done',
        },
      ],
    },
    open_modal: {
      id: 'open_modal',
      speakerId: 'dr_danang',
      text: 'Silakan pelajari kembali ya!',
      expression: 'happy',
      triggerDiscoveryModal: 5,
    },
    done: {
      id: 'done',
      speakerId: 'dr_danang',
      text: 'Bagus sekali! Lanjutkan ke kanan, temui Petugas Rudi dan Komandan Surya di pintu turun ya!',
      expression: 'happy',
    },
  },
};

// ── POHON DIALOG: PETUGAS RUDI (PENGAWAS SUHU MANTEL BAWAH PX 990) ──
export const PETUGAS_RUDI_DIALOGUE: DialogueTree = {
  id: 'petugas_rudi_dialogue',
  title: 'Pos Pengawas Suhu Mantel Bawah',
  npcSpeakerId: 'petugas_rudi',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'petugas_rudi',
      text: 'Waspada saat melangkah! Semakin ke bawah, suhunya semakin panas mendekati inti bumi.',
      expression: 'serious',
      nextNodeId: 'warn_surya',
    },
    warn_surya: {
      id: 'warn_surya',
      speakerId: 'petugas_rudi',
      text: 'Di depan ada Komandan Surya. Beliau menjaga pintu turun menuju Inti Luar bumi.',
      expression: 'normal',
      choices: [
        {
          id: 'c1',
          text: 'Bagaimana cara membuka pintu turunnya, Pak?',
          nextNodeId: 'explain_gate',
        },
        {
          id: 'c2',
          text: 'Siap Pak, saya segera ke sana!',
          nextNodeId: 'farewell',
        },
      ],
    },
    explain_gate: {
      id: 'explain_gate',
      speakerId: 'petugas_rudi',
      text: 'Kamu harus menjawab tantangan tebak kata dari Komandan Surya. Semua jawabannya sudah diajarkan oleh Prof. Sarah dan Dr. Danang kok!',
      expression: 'happy',
      nextNodeId: 'farewell',
    },
    farewell: {
      id: 'farewell',
      speakerId: 'petugas_rudi',
      text: 'Semoga sukses! Buktikan bahwa kamu sudah memahami materi mantel bumi dengan baik!',
      expression: 'happy',
    },
  },
};

// ── POHON DIALOG: KOMANDAN SURYA (PENJAGA PINTU INTI LUAR PX 1100) ──
export const KOMANDAN_SURYA_LOCKED_DIALOGUE: DialogueTree = {
  id: 'komandan_surya_locked_dialogue',
  title: 'Pintu Inti Luar Masih Terkunci',
  npcSpeakerId: 'komandan_surya',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'komandan_surya',
      text: 'Tunggu sebentar penjelajah! Pintu menuju Inti Luar bumi belum bisa dibuka.',
      expression: 'serious',
      nextNodeId: 'explain_locked',
    },
    explain_locked: {
      id: 'explain_locked',
      speakerId: 'komandan_surya',
      text: 'Kamu harus mempelajari dulu materi dari Prof. Sarah dan Dr. Danang di bukit tadi. Temui mereka dan pelajari materinya ya!',
      expression: 'thinking',
      choices: [
        {
          id: 'ack',
          text: 'Siap Komandan, saya akan temui para peneliti dulu!',
          nextNodeId: 'farewell',
        },
      ],
    },
    farewell: {
      id: 'farewell',
      speakerId: 'komandan_surya',
      text: 'Bagus! Jangan terburu-buru. Setelah selesai mempelajari materi mantel bumi, kembalilah ke sini!',
      expression: 'normal',
    },
  },
};

export const KOMANDAN_SURYA_READY_DIALOGUE: DialogueTree = {
  id: 'komandan_surya_ready_dialogue',
  title: 'Tantangan Pintu Masuk Inti Luar',
  npcSpeakerId: 'komandan_surya',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'komandan_surya',
      text: 'Halo penjelajah! Aku Komandan Surya, penjaga pintu masuk menuju Inti Luar bumi.',
      expression: 'serious',
      nextNodeId: 'ask_readiness',
    },
    ask_readiness: {
      id: 'ask_readiness',
      speakerId: 'komandan_surya',
      text: 'Apakah kamu sudah paham mengenai mantel bumi sebelum kita membuka pintu turun ke Inti Luar?',
      expression: 'thinking',
      choices: [
        {
          id: 'ready_challenge',
          text: 'Sudah paham Komandan, saya siap tantangannya!',
          nextNodeId: 'start_challenge_node',
        },
        {
          id: 'wait_challenge',
          text: 'Sebentar Komandan, saya mau ingat-ingat materinya dulu.',
          nextNodeId: 'standby_node',
        },
      ],
    },
    start_challenge_node: {
      id: 'start_challenge_node',
      speakerId: 'komandan_surya',
      text: 'Bagus sekali! Jawab tebak kata ini dengan benar untuk membuka kunci pintunya!',
      expression: 'happy',
      triggerChallengeGate: true,
    },
    standby_node: {
      id: 'standby_node',
      speakerId: 'komandan_surya',
      text: 'Bagus, teliti itu penting. Kamu bisa baca lagi materi dari Prof. Sarah dan Dr. Danang. Kalau sudah yakin, ajak aku bicara lagi ya!',
      expression: 'normal',
    },
  },
};

export const KOMANDAN_SURYA_UNLOCKED_DIALOGUE: DialogueTree = {
  id: 'komandan_surya_unlocked_dialogue',
  title: 'Pintu Inti Luar Terbuka',
  npcSpeakerId: 'komandan_surya',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'komandan_surya',
      text: 'Luar biasa! Jawabanmu benar semua, pemahamanmu tentang mantel bumi terbukti hebat!',
      expression: 'happy',
      nextNodeId: 'instructions',
    },
    instructions: {
      id: 'instructions',
      speakerId: 'komandan_surya',
      text: 'Pintu menuju Inti Luar sudah terbuka lebar. Cukup dekati portal di sebelah kanan dan tekan [ENTER] untuk meluncur turun. Di bawah adalah lautan logam cair meleleh, hati-hati ya!',
      expression: 'serious',
    },
  },
};

// ══════════════════════════════════════════════════════════════════════════
// AREA 4: INTI LUAR (LAUTAN LOGAM CAIR & MEDAN MAGNET BUMI)
// ══════════════════════════════════════════════════════════════════════════

// ── POHON DIALOG: MASKOT RESQY (BRIEFING INTI LUAR) ──
export const MASCOT_OUTER_CORE_INTRO_DIALOGUE: DialogueTree = {
  id: 'mascot_outer_core_intro',
  title: 'Briefing Inti Luar Bersama Resqy',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'resqy',
      text: 'Bip-bop! Kita telah tiba di Inti Luar bumi pada kedalaman 2.900 kilometer!',
      expression: 'happy',
      nextNodeId: 'explain_heat',
    },
    explain_heat: {
      id: 'explain_heat',
      speakerId: 'resqy',
      text: 'Suhu di sini sangat panas mencapai 5.000 derajat Celsius! Panas ini membuat logam besi dan nikel meleleh menjadi cairan.',
      expression: 'surprised',
      nextNodeId: 'guide_forward',
    },
    guide_forward: {
      id: 'guide_forward',
      speakerId: 'resqy',
      text: 'Hati-hati melangkah di atas pelat logam ini. Temui Dr. Fajar dan para peneliti di depan untuk mempelajari rahasia inti luar ya!',
      expression: 'normal',
    },
  },
};

// ── POHON DIALOG: MASKOT RESQY (TIPS EVALUASI INTI LUAR) ──
export const MASCOT_OUTER_CORE_GUIDE_DIALOGUE: DialogueTree = {
  id: 'mascot_outer_core_guide',
  title: 'Tips Penjelajah Inti Luar',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'resqy',
      text: 'Bip-bop! Tiga hal penting di Inti Luar: 1. Terbuat dari logam besi dan nikel. 2. Wujudnya cair karena suhu sangat panas.',
      expression: 'happy',
      nextNodeId: 'point_three',
    },
    point_three: {
      id: 'point_three',
      speakerId: 'resqy',
      text: '3. Putaran cairan logam ini menciptakan medan magnet sebagai perisai bumi. Pahami materi ini dari para peneliti ya!',
      expression: 'thinking',
    },
  },
};

// ── POHON DIALOG: DR. FAJAR (PEMANDU LAPANGAN INTI LUAR PX 270) ──
export const DR_FAJAR_DIALOGUE: DialogueTree = {
  id: 'dr_fajar_dialogue',
  title: 'Pos Pengamatan Inti Luar',
  npcSpeakerId: 'dr_fajar',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'dr_fajar',
      text: 'Halo penjelajah hebat! Selamat datang di pos pemantauan Inti Luar bumi.',
      expression: 'happy',
      nextNodeId: 'explain_layer',
    },
    explain_layer: {
      id: 'explain_layer',
      speakerId: 'dr_fajar',
      text: 'Setelah melewati mantel bumi, kita kini berada di atas teras pelat logam khusus. Di sekitar kita adalah lautan logam besi dan nikel yang meleleh!',
      expression: 'normal',
      choices: [
        {
          id: 'c1',
          text: 'Kenapa logam di sini bisa meleleh menjadi cairan, Dok?',
          nextNodeId: 'explain_melt',
        },
        {
          id: 'c2',
          text: 'Siapa saja peneliti yang ada di pelat depan, Dok?',
          nextNodeId: 'explain_ahead',
        },
      ],
    },
    explain_melt: {
      id: 'explain_melt',
      speakerId: 'dr_fajar',
      text: 'Karena suhunya mencapai 5.000 derajat Celsius! Suhu dahsyat ini sanggup mencairkan logam sekeras apa pun.',
      expression: 'thinking',
      nextNodeId: 'explain_ahead',
    },
    explain_ahead: {
      id: 'explain_ahead',
      speakerId: 'dr_fajar',
      text: 'Di teras depan ada Prof. Ratna yang meneliti lautan logam cair, dan Dr. Aris yang meneliti medan magnet bumi. Temui mereka ya!',
      expression: 'happy',
    },
  },
};

// ── POHON DIALOG: PROF. RATNA (TEMUAN GEOLOGIS 6: LAUTAN LOGAM CAIR PX 330) ──
export const PROF_RATNA_DIALOGUE: DialogueTree = {
  id: 'prof_ratna_dialogue',
  title: 'Peneliti Logam Cair Inti Luar',
  npcSpeakerId: 'prof_ratna',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'prof_ratna',
      text: 'Halo penjelajah muda! Apakah kamu ingin tahu bagaimana logam besi dan nikel bisa mencair menjadi lautan lahar logam di sini?',
      expression: 'happy',
      choices: [
        {
          id: 'open_direct',
          text: 'Iya Prof. Ratna, saya mau lihat materinya!',
          nextNodeId: 'open_discovery',
          discoveryIdToMark: 'oc_disc1',
        },
        {
          id: 'brief_first',
          text: 'Boleh tolong jelaskan intinya dulu, Prof?',
          nextNodeId: 'explain_brief',
          discoveryIdToMark: 'oc_disc1',
        },
      ],
    },
    explain_brief: {
      id: 'explain_brief',
      speakerId: 'prof_ratna',
      text: 'Intinya, inti luar memiliki tebal sekitar 2.200 kilometer. Logam besi dan nikel di sini mencair dan terus mengalir karena suhu yang luar biasa panas!',
      expression: 'normal',
      nextNodeId: 'open_prompt',
    },
    open_prompt: {
      id: 'open_prompt',
      speakerId: 'prof_ratna',
      text: 'Yuk kita buka gambar materinya agar kamu bisa melihat ilustrasi lautan logam cair ini dengan jelas!',
      expression: 'happy',
      choices: [
        {
          id: 'open_now',
          text: 'Buka Materi Lautan Logam Cair!',
          nextNodeId: 'open_discovery',
          discoveryIdToMark: 'oc_disc1',
        },
      ],
    },
    open_discovery: {
      id: 'open_discovery',
      speakerId: 'prof_ratna',
      text: 'Ini dia materinya! Amati baik-baik ya, sifat cairan logam ini nanti akan ditanyakan sebelum turun ke inti dalam!',
      expression: 'happy',
      discoveryIdToMark: 'oc_disc1',
      triggerDiscoveryModal: 6,
    },
  },
};

export const PROF_RATNA_REVIEW_DIALOGUE: DialogueTree = {
  id: 'prof_ratna_review_dialogue',
  title: 'Peneliti Logam Cair Inti Luar',
  npcSpeakerId: 'prof_ratna',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'prof_ratna',
      text: 'Halo lagi penjelajah! Kamu sudah mempelajari materi lautan logam cair. Ingat kuncinya: inti luar tersusun dari logam yang mencair!',
      expression: 'happy',
      choices: [
        {
          id: 'reopen',
          text: 'Buka kembali materi gambar logam cair',
          nextNodeId: 'reopen_node',
        },
        {
          id: 'continue',
          text: 'Terima kasih Prof, saya lanjut ke Dr. Aris!',
          nextNodeId: 'farewell',
        },
      ],
    },
    reopen_node: {
      id: 'reopen_node',
      speakerId: 'prof_ratna',
      text: 'Silakan baca dan amati kembali gambarnya ya!',
      expression: 'normal',
      triggerDiscoveryModal: 6,
    },
    farewell: {
      id: 'farewell',
      speakerId: 'prof_ratna',
      text: 'Semoga sukses! Jangan lupa ambil kristal energi di jembatan depan ya.',
      expression: 'happy',
    },
  },
};

// ── POHON DIALOG: DR. ARIS (TEMUAN GEOLOGIS 7: MEDAN MAGNET BUMI PX 730) ──
export const DR_ARIS_DIALOGUE: DialogueTree = {
  id: 'dr_aris_dialogue',
  title: 'Ahli Medan Magnet Bumi',
  npcSpeakerId: 'dr_aris',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'dr_aris',
      text: 'Halo! Tahukah kamu bahwa perputaran lautan logam cair di sini bekerja bagai dinamo listrik raksasa yang menciptakan medan magnet bumi?',
      expression: 'happy',
      choices: [
        {
          id: 'open_direct',
          text: 'Wah hebat! Buka materi medan magnet bumi, Dok!',
          nextNodeId: 'open_discovery',
          discoveryIdToMark: 'oc_disc2',
        },
        {
          id: 'brief_first',
          text: 'Boleh tolong jelaskan intinya dulu, Dok?',
          nextNodeId: 'explain_brief',
          discoveryIdToMark: 'oc_disc2',
        },
      ],
    },
    explain_brief: {
      id: 'explain_brief',
      speakerId: 'dr_aris',
      text: 'Bumi kita berputar, membuat lautan logam cair ikut teraduk kencang. Putaran cairan logam ini menghasilkan arus listrik yang menciptakan perisai magnet pelindung bumi!',
      expression: 'normal',
      nextNodeId: 'open_prompt',
    },
    open_prompt: {
      id: 'open_prompt',
      speakerId: 'dr_aris',
      text: 'Medan magnet ini sangat penting karena melindungi kita dari radiasi berbahaya badai matahari. Yuk kita amati gambarnya!',
      expression: 'happy',
      choices: [
        {
          id: 'open_now',
          text: 'Buka Materi Medan Magnet Bumi!',
          nextNodeId: 'open_discovery',
          discoveryIdToMark: 'oc_disc2',
        },
      ],
    },
    open_discovery: {
      id: 'open_discovery',
      speakerId: 'dr_aris',
      text: 'Ini dia materinya! Amati baik-baik perisai magnet pelindung bumi kita ya. Pahami konsep ini sebelum menemui Komandan Teguh!',
      expression: 'happy',
      discoveryIdToMark: 'oc_disc2',
      triggerDiscoveryModal: 7,
    },
  },
};

export const DR_ARIS_REVIEW_DIALOGUE: DialogueTree = {
  id: 'dr_aris_review_dialogue',
  title: 'Ahli Medan Magnet Bumi',
  npcSpeakerId: 'dr_aris',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'dr_aris',
      text: 'Halo penjelajah! Kamu sudah memahami rahasia medan magnet bumi. Perisai magnet inilah yang menjaga kehidupan di bumi tetap aman!',
      expression: 'happy',
      choices: [
        {
          id: 'reopen',
          text: 'Buka kembali materi medan magnet bumi',
          nextNodeId: 'reopen_node',
        },
        {
          id: 'continue',
          text: 'Saya sudah paham Dok, siap ke pos Komandan Teguh!',
          nextNodeId: 'farewell',
        },
      ],
    },
    reopen_node: {
      id: 'reopen_node',
      speakerId: 'dr_aris',
      text: 'Silakan pelajari lagi gambar ilustrasinya ya!',
      expression: 'normal',
      triggerDiscoveryModal: 7,
    },
    farewell: {
      id: 'farewell',
      speakerId: 'dr_aris',
      text: 'Bagus sekali! Ingat kata kuncinya: Logam, Cair, dan Magnet ya!',
      expression: 'happy',
    },
  },
};

// ── POHON DIALOG: PETUGAS JOKO (PENGAWAS RADIASI MAGNETIK PX 1020) ──
export const PETUGAS_JOKO_DIALOGUE: DialogueTree = {
  id: 'petugas_joko_dialogue',
  title: 'Pos Pengawas Radiasi Magnetik',
  npcSpeakerId: 'petugas_joko',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'petugas_joko',
      text: 'Waspada penjelajah! Kamu berada di dekat stasiun pemantau medan magnet inti luar bumi.',
      expression: 'serious',
      nextNodeId: 'guide_officer',
    },
    guide_officer: {
      id: 'guide_officer',
      speakerId: 'petugas_joko',
      text: 'Di sini kekuatan medan magnetnya sangat kuat! Di ujung pelat depan ada Komandan Teguh yang menjaga pintu poros menuju Inti Dalam bumi.',
      expression: 'normal',
      nextNodeId: 'remind_check',
    },
    remind_check: {
      id: 'remind_check',
      speakerId: 'petugas_joko',
      text: 'Kamu harus menjawab tantangan tebak kata dari Komandan Teguh. Semua jawabannya sudah diajarkan oleh Prof. Ratna dan Dr. Aris kok!',
      expression: 'happy',
    },
  },
};

// ── POHON DIALOG: KOMANDAN TEGUH (PENJAGA PINTU INTI DALAM PX 1120) ──
export const KOMANDAN_TEGUH_LOCKED_DIALOGUE: DialogueTree = {
  id: 'komandan_teguh_locked_dialogue',
  title: 'Pos Penjaga Pintu Inti Dalam',
  npcSpeakerId: 'komandan_teguh',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'komandan_teguh',
      text: 'Berhenti penjelajah! Akses menuju Inti Dalam bumi masih terkunci rapat.',
      expression: 'serious',
      nextNodeId: 'explain_lock',
    },
    explain_lock: {
      id: 'explain_lock',
      speakerId: 'komandan_teguh',
      text: 'Kamu harus mempelajari dulu materi dari Prof. Ratna dan Dr. Aris di teras tadi. Temui mereka dan pelajari materinya ya!',
      expression: 'thinking',
    },
  },
};

export const KOMANDAN_TEGUH_READY_DIALOGUE: DialogueTree = {
  id: 'komandan_teguh_ready_dialogue',
  title: 'Pos Penjaga Pintu Inti Dalam',
  npcSpeakerId: 'komandan_teguh',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'komandan_teguh',
      text: 'Lapor penjelajah! Kamu sudah tiba di pos penjagaan gerbang menuju Inti Dalam bumi.',
      expression: 'normal',
      nextNodeId: 'challenge_prompt',
    },
    challenge_prompt: {
      id: 'challenge_prompt',
      speakerId: 'komandan_teguh',
      text: 'Apakah kamu sudah paham mengenai sifat dan karakteristik inti luar bumi? Jawab tantangan tebak kata ini untuk membuka akses ke Inti Dalam!',
      expression: 'thinking',
      choices: [
        {
          id: 'accept_challenge',
          text: 'Sudah paham Komandan, saya siap tantangannya!',
          nextNodeId: 'start_challenge_node',
        },
        {
          id: 'review_materials',
          text: 'Saya mau melihat-lihat materi dulu, Komandan.',
          nextNodeId: 'standby_node',
        },
      ],
    },
    start_challenge_node: {
      id: 'start_challenge_node',
      speakerId: 'komandan_teguh',
      text: 'Bagus! Tunjukkan pemahamanmu mengenai Inti Luar bumi pada kuis tebak kata berikut ini!',
      expression: 'happy',
      triggerChallengeGate: true,
    },
    standby_node: {
      id: 'standby_node',
      speakerId: 'komandan_teguh',
      text: 'Siap! Silakan baca dan pelajari kembali materi dari Prof. Ratna dan Dr. Aris di teras sebelumnya. Kalau sudah siap, temui saya lagi ya!',
      expression: 'normal',
    },
  },
};

export const KOMANDAN_TEGUH_UNLOCKED_DIALOGUE: DialogueTree = {
  id: 'komandan_teguh_unlocked_dialogue',
  title: 'Pos Penjaga Pintu Inti Dalam',
  npcSpeakerId: 'komandan_teguh',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'komandan_teguh',
      text: 'Luar biasa! Jawabanmu benar semua, pemahamanmu tentang inti luar bumi terbukti hebat!',
      expression: 'happy',
      nextNodeId: 'instructions',
    },
    instructions: {
      id: 'instructions',
      speakerId: 'komandan_teguh',
      text: 'Pintu menuju Inti Dalam sudah terbuka lebar. Cukup melangkah ke poros di sebelah kanan dan tekan [ENTER] untuk meluncur ke pusat bumi!',
      expression: 'happy',
    },
  },
};

// ── POHON DIALOG: MASKOT RESQY (INTI DALAM) ──
export const MASCOT_INNER_CORE_INTRO_DIALOGUE: DialogueTree = {
  id: 'mascot_inner_core_intro',
  title: 'Panduan Masuk Inti Dalam',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'resqy',
      text: 'Bip-bop! Selamat penjelajah! Kita akhirnya tiba di lapisan terdalam: Inti Dalam bumi di kedalaman 5.150 km!',
      expression: 'happy',
      nextNodeId: 'step2',
    },
    step2: {
      id: 'step2',
      speakerId: 'resqy',
      text: 'Suhu di sini mencapai 6.000°C sepanas permukaan matahari. Ayo temui para peneliti hebat di teras depan!',
      expression: 'happy',
    },
  },
};

export const MASCOT_INNER_CORE_GUIDE_DIALOGUE: DialogueTree = {
  id: 'mascot_inner_core_guide',
  title: 'Tips Penjelajah Inti Dalam',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'resqy',
      text: 'Bip-bop! Inti dalam bumi adalah bola besi padat yang tahan leleh berkat tekanan dahsyat di pusat bumi.',
      expression: 'happy',
      nextNodeId: 'step2',
    },
    step2: {
      id: 'step2',
      speakerId: 'resqy',
      text: 'Pelajari penjelasan para peneliti mengenai wujud padat, tekanan luar biasa, dan titik pusat gravitasi bumi ya!',
      expression: 'thinking',
    },
  },
};

// ── POHON DIALOG: DR. BAGUS (PEMANDU GEOFISIKA INTI DALAM PX 270) ──
export const DR_BAGUS_DIALOGUE: DialogueTree = {
  id: 'dr_bagus_dialogue',
  title: 'Pos Pengamatan Inti Dalam',
  npcSpeakerId: 'dr_bagus',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'dr_bagus',
      text: 'Selamat datang penjelajah tangguh! Kamu telah menembus ribuan kilometer hingga tiba di monolit Inti Dalam bumi.',
      expression: 'happy',
      nextNodeId: 'intro2',
    },
    intro2: {
      id: 'intro2',
      speakerId: 'dr_bagus',
      text: 'Di teras depan ada Prof. Lestari yang sedang meneliti bola kristal besi padat bersuhu 6.000°C. Silakan temui beliau ya!',
      expression: 'normal',
      choices: [
        {
          id: 'c1',
          text: 'Siap Dok, saya akan menemui Prof. Lestari!',
          nextNodeId: 'farewell',
        },
        {
          id: 'c2',
          text: 'Apakah di sini aman dari panas sepanas matahari?',
          nextNodeId: 'safety_info',
        },
      ],
    },
    safety_info: {
      id: 'safety_info',
      speakerId: 'dr_bagus',
      text: 'Tentu! Baju pelindung ekspedisi kita dirancang khusus menahan suhu ekstrem. Jangan ragu melangkah maju!',
      expression: 'happy',
      nextNodeId: 'farewell',
    },
    farewell: {
      id: 'farewell',
      speakerId: 'dr_bagus',
      text: 'Semoga sukses mengungkap rahasia inti dalam bumi!',
      expression: 'happy',
    },
  },
};

// ── POHON DIALOG: PROF. LESTARI (PENELITI KRISTAL BESI PX 340 - TEMUAN 8) ──
export const PROF_LESTARI_DIALOGUE: DialogueTree = {
  id: 'prof_lestari_dialogue',
  title: 'Penelitian Kristal Besi Inti Dalam',
  npcSpeakerId: 'prof_lestari',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'prof_lestari',
      text: 'Halo penjelajah muda! Tahukah kamu bahwa inti dalam bumi ini berbentuk bola besi padat yang suhunya sepanas permukaan matahari?',
      expression: 'normal',
      nextNodeId: 'ask_discovery',
    },
    ask_discovery: {
      id: 'ask_discovery',
      speakerId: 'prof_lestari',
      text: 'Meskipun suhunya mencapai 6.000°C, logam di sini tidak meleleh karena adanya tekanan luar biasa dahsyat! Mau melihat data penelitiannya?',
      expression: 'thinking',
      choices: [
        {
          id: 'view_data',
          text: 'Tentu Prof, saya ingin melihat datanya!',
          nextNodeId: 'show_discovery_node',
        },
        {
          id: 'listen_story',
          text: 'Saya ingin mendengar penjelasannya dulu.',
          nextNodeId: 'explain_more',
        },
      ],
    },
    explain_more: {
      id: 'explain_more',
      speakerId: 'prof_lestari',
      text: 'Tekanan seluruh massa bumi mengunci atom besi begitu kuat sehingga tetap padat dan kokoh. Yuk buka catatan lengkapnya!',
      expression: 'happy',
      choices: [
        {
          id: 'confirm_view',
          text: 'Buka catatan penelitian',
          nextNodeId: 'show_discovery_node',
        },
      ],
    },
    show_discovery_node: {
      id: 'show_discovery_node',
      speakerId: 'prof_lestari',
      text: 'Ini dia catatannya! Amati baik-baik bagaimana tekanan dahsyat menjaga bola besi ini tetap padat ya!',
      expression: 'happy',
      triggerDiscoveryModal: 8,
    },
  },
};

export const PROF_LESTARI_REVIEW_DIALOGUE: DialogueTree = {
  id: 'prof_lestari_review_dialogue',
  title: 'Catatan Bola Besi Padat',
  npcSpeakerId: 'prof_lestari',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'prof_lestari',
      text: 'Halo lagi! Kamu bisa membuka kembali catatan penelitian bola besi padat dan tekanan dahsyat inti dalam kapan saja.',
      expression: 'normal',
      choices: [
        {
          id: 'open_again',
          text: 'Buka catatan materi lagi',
          nextNodeId: 'open_node',
        },
        {
          id: 'done',
          text: 'Saya sudah paham Prof, terima kasih!',
          nextNodeId: 'farewell',
        },
      ],
    },
    open_node: {
      id: 'open_node',
      speakerId: 'prof_lestari',
      text: 'Silakan pelajari kembali catatan bola besi padat ini ya!',
      expression: 'happy',
      triggerDiscoveryModal: 8,
    },
    farewell: {
      id: 'farewell',
      speakerId: 'prof_lestari',
      text: 'Bagus sekali! Lanjutkan langkahmu ke altar pusat bumi bersama Dr. Farhan!',
      expression: 'happy',
    },
  },
};

// ── POHON DIALOG: DR. FARHAN (AHLI GRAVITASI PUSAT BUMI PX 680 - TEMUAN 9) ──
export const DR_FARHAN_DIALOGUE: DialogueTree = {
  id: 'dr_farhan_dialogue',
  title: 'Pusat Gravitasi Bumi 6.371 KM',
  npcSpeakerId: 'dr_farhan',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'dr_farhan',
      text: 'Luar biasa! Kamu sedang berdiri tepat di altar pusat bumi pada kedalaman 6.371 kilometer!',
      expression: 'happy',
      nextNodeId: 'explain_zero_g',
    },
    explain_zero_g: {
      id: 'explain_zero_g',
      speakerId: 'dr_farhan',
      text: 'Di titik terdalam bumi ini, gaya gravitasi saling menarik seimbang dari segala arah sehingga gravitasi bernilai nol! Mau lihat datanya?',
      expression: 'thinking',
      choices: [
        {
          id: 'view_data',
          text: 'Wah menarik, tolong perlihatkan Dok!',
          nextNodeId: 'show_discovery_node',
        },
        {
          id: 'listen_more',
          text: 'Bagaimana rasanya di titik gravitasi nol?',
          nextNodeId: 'explain_more',
        },
      ],
    },
    explain_more: {
      id: 'explain_more',
      speakerId: 'dr_farhan',
      text: 'Semua tarikan gravitasi saling meniadakan di pusat planet kita ini! Yuk amati diagram lengkapnya.',
      expression: 'happy',
      choices: [
        {
          id: 'confirm_view',
          text: 'Buka data pusat bumi',
          nextNodeId: 'show_discovery_node',
        },
      ],
    },
    show_discovery_node: {
      id: 'show_discovery_node',
      speakerId: 'dr_farhan',
      text: 'Ini dia diagram pusat bumi! Perhatikan titik nol gravitasi di kedalaman 6.371 km ini ya!',
      expression: 'happy',
      triggerDiscoveryModal: 9,
    },
  },
};

export const DR_FARHAN_REVIEW_DIALOGUE: DialogueTree = {
  id: 'dr_farhan_review_dialogue',
  title: 'Altar Pusat Bumi 6.371 KM',
  npcSpeakerId: 'dr_farhan',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'dr_farhan',
      text: 'Altar pusat bumi 6.371 km ini adalah puncak penjelajahan. Buka kembali datanya jika ingin mengingat konsep titik gravitasi nol ya!',
      expression: 'normal',
      choices: [
        {
          id: 'open_again',
          text: 'Buka data pusat bumi lagi',
          nextNodeId: 'open_node',
        },
        {
          id: 'done',
          text: 'Saya sudah paham Dok, terima kasih!',
          nextNodeId: 'farewell',
        },
      ],
    },
    open_node: {
      id: 'open_node',
      speakerId: 'dr_farhan',
      text: 'Silakan pelajari kembali konsep pusat bumi dan gravitasi nol ini ya!',
      expression: 'happy',
      triggerDiscoveryModal: 9,
    },
    farewell: {
      id: 'farewell',
      speakerId: 'dr_farhan',
      text: 'Hebat! Di ujung teras ada Petugas Dian dan Komandan Bintang yang menjaga kapsul evakuasi akhir.',
      expression: 'happy',
    },
  },
};

// ── POHON DIALOG: PETUGAS DIAN (PENGAWAS KAPSUL EVAKUASI PX 900) ──
export const PETUGAS_DIAN_DIALOGUE: DialogueTree = {
  id: 'petugas_dian_dialogue',
  title: 'Pos Pengawas Kapsul Evakuasi',
  npcSpeakerId: 'petugas_dian',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'petugas_dian',
      text: 'Lapor penjelajah! Kapsul evakuasi akhir untuk kembali ke permukaan bumi sudah disiapkan di ujung teras depan.',
      expression: 'happy',
      nextNodeId: 'guide_commander',
    },
    guide_commander: {
      id: 'guide_commander',
      speakerId: 'petugas_dian',
      text: 'Komandan Bintang sedang mengawasi sistem kunci kapsul. Pastikan kamu sudah memahami materi dari Prof. Lestari dan Dr. Farhan sebelum menemuinya ya!',
      expression: 'normal',
      nextNodeId: 'farewell',
    },
    farewell: {
      id: 'farewell',
      speakerId: 'petugas_dian',
      text: 'Semangat! Kamu hanya tinggal selangkah lagi menuntaskan seluruh penjelajahan bumi!',
      expression: 'happy',
    },
  },
};

// ── POHON DIALOG: KOMANDAN BINTANG (KEPALA EKSPEDISI PUSAT BUMI PX 1040) ──
export const KOMANDAN_BINTANG_LOCKED_DIALOGUE: DialogueTree = {
  id: 'komandan_bintang_locked_dialogue',
  title: 'Akses Batas Divergen Terkunci',
  npcSpeakerId: 'komandan_bintang',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'komandan_bintang',
      text: 'Berhenti penjelajah! Akses portal menuju zona tektonik Batas Divergen masih terkunci rapat.',
      expression: 'serious',
      nextNodeId: 'explain_lock',
    },
    explain_lock: {
      id: 'explain_lock',
      speakerId: 'komandan_bintang',
      text: 'Kamu harus mempelajari materi dari Prof. Lestari dan Dr. Farhan di altar pusat bumi terlebih dahulu. Temui mereka dan pelajari materinya ya!',
      expression: 'thinking',
    },
  },
};

export const KOMANDAN_BINTANG_READY_DIALOGUE: DialogueTree = {
  id: 'komandan_bintang_ready_dialogue',
  title: 'Pos Komandan Menuju Batas Divergen',
  npcSpeakerId: 'komandan_bintang',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'komandan_bintang',
      text: 'Lapor penjelajah! Saya melihat kamu sudah menuntaskan penelitian di altar pusat bumi bersama para peneliti.',
      expression: 'normal',
      nextNodeId: 'challenge_prompt',
    },
    challenge_prompt: {
      id: 'challenge_prompt',
      speakerId: 'komandan_bintang',
      text: 'Apakah kamu sudah paham mengenai sifat dan karakteristik inti dalam bumi? Jawab tantangan tebak kata ini untuk membuka akses menuju Batas Divergen!',
      expression: 'thinking',
      choices: [
        {
          id: 'accept_challenge',
          text: 'Sudah paham Komandan, saya siap tantangannya!',
          nextNodeId: 'start_challenge_node',
        },
        {
          id: 'review_materials',
          text: 'Saya mau melihat-lihat materi dulu, Komandan.',
          nextNodeId: 'standby_node',
        },
      ],
    },
    start_challenge_node: {
      id: 'start_challenge_node',
      speakerId: 'komandan_bintang',
      text: 'Luar biasa! Buktikan pemahamanmu mengenai Inti Dalam bumi pada kuis tebak kata berikut ini!',
      expression: 'happy',
      triggerChallengeGate: true,
    },
    standby_node: {
      id: 'standby_node',
      speakerId: 'komandan_bintang',
      text: 'Siap! Silakan baca dan pelajari kembali materi dari Prof. Lestari dan Dr. Farhan di altar tadi. Kalau sudah siap, temui saya lagi ya!',
      expression: 'normal',
    },
  },
};

export const KOMANDAN_BINTANG_UNLOCKED_DIALOGUE: DialogueTree = {
  id: 'komandan_bintang_unlocked_dialogue',
  title: 'Akses Batas Divergen Terbuka',
  npcSpeakerId: 'komandan_bintang',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'komandan_bintang',
      text: 'Luar biasa hebat! Seluruh pemahaman mengenai Inti Dalam bumi telah kamu buktikan dengan sempurna!',
      expression: 'happy',
      nextNodeId: 'instructions',
    },
    instructions: {
      id: 'instructions',
      speakerId: 'komandan_bintang',
      text: 'Akses portal menuju Batas Divergen telah terbuka penuh. Silakan dekati portal dan tekan [E] untuk melanjutkan ekspedisi ke Batas Divergen!',
      expression: 'happy',
    },
  },
};

// ── POHON DIALOG AREA 6: MASKOT RESQY (BRIEFING BATAS DIVERGEN) ──
export const MASCOT_DIVERGENT_INTRO_DIALOGUE: DialogueTree = {
  id: 'mascot_divergent_intro',
  title: 'Briefing Lembah Retakan Divergen',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'resqy',
      text: 'Waspada penjelajah! Getaran seismik terdeteksi! Lempeng bumi di depan kita sedang mengalami regangan aktif yang membelah tanah menjadi dua!',
      expression: 'surprised',
      nextNodeId: 'guide_plate',
    },
    guide_plate: {
      id: 'guide_plate',
      speakerId: 'resqy',
      text: 'Dari rekahan celah yang menganga, cairan pijar mantel bumi menerobos naik mengisi rongga celah! Hati-hati jangan sampai tergelincir ke dalam magma!',
      expression: 'serious',
      nextNodeId: 'guide_mission',
    },
    guide_mission: {
      id: 'guide_mission',
      speakerId: 'resqy',
      text: 'Petunjuk Penjelajah: Pelajari bukti daratan purba dari Prof. Maya, lompati celah rekahan menuju Dr. Citra dan Prof. Ilham, lalu buktikan pemahamanmu kepada Komandan Satria di ujung tebing!',
      expression: 'happy',
    },
  },
};

export const MASCOT_DIVERGENT_GUIDE_DIALOGUE: DialogueTree = {
  id: 'mascot_divergent_guide',
  title: 'Tips Penjelajah Batas Divergen',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'resqy',
      text: 'Tips Penjelajah: Hati-hati jangan sampai tergelincir ke celah pijar di tengah! Pelajari bukti daratan purba, kesamaan formasi pegunungan, dan proses pembentukan kerak baru dari para peneliti sebelum melapor ke Komandan Satria!',
      expression: 'happy',
    },
  },
};

// ── POHON DIALOG: DR. TAUFIK (PEMANDU GEOLOGIS PANGEA PX 180) ──
export const DR_TAUFIK_DIALOGUE: DialogueTree = {
  id: 'dr_taufik_dialogue',
  title: 'Pos Pengamatan Lembah Retakan',
  npcSpeakerId: 'dr_taufik',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'dr_taufik',
      text: 'Luar biasa! Kamu tiba tepat saat retakan tektonik aktif ini sedang membelah tanah di depan mata kita!',
      expression: 'surprised',
      nextNodeId: 'explain_puzzle',
    },
    explain_puzzle: {
      id: 'explain_puzzle',
      speakerId: 'dr_taufik',
      text: 'Perhatikan bagaimana tepi-tepi rekahan saling cocok persis seperti kepingan puzzle sebelum terpisah. Dorongan dari bawah bahkan membuat bibir tanah terangkat menganga!',
      expression: 'normal',
      nextNodeId: 'guide_maya',
    },
    guide_maya: {
      id: 'guide_maya',
      speakerId: 'dr_taufik',
      text: 'Prof. Maya di depan sedang meneliti bagaimana seluruh benua di bumi pada zaman purba awalnya adalah satu daratan utuh. Temui beliau ya!',
      expression: 'happy',
    },
  },
};

// ── POHON DIALOG: PROF. MAYA (AHLI SUPERBENUA PANGEA PX 460 - TEMUAN 10) ──
export const PROF_MAYA_DIALOGUE: DialogueTree = {
  id: 'prof_maya_dialogue',
  title: 'Penelitian Superbenua Purba',
  npcSpeakerId: 'prof_maya',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'prof_maya',
      text: 'Halo penjelajah muda! Fenomena terbelahnya tanah di depan kita adalah bukti nyata bahwa permukaan bumi selalu bergerak dinamis.',
      expression: 'normal',
      nextNodeId: 'ask_discovery',
    },
    ask_discovery: {
      id: 'ask_discovery',
      speakerId: 'prof_maya',
      text: 'Ratusan juta tahun lalu, daratan di bumi pernah menyatu menjadi satu kesatuan daratan raksasa sebelum terpecah-pecah. Mau meneliti rekonstruksi petanya bersamaku?',
      expression: 'thinking',
      choices: [
        {
          id: 'view_pangea',
          text: 'Tentu Prof, saya ingin meneliti petanya!',
          nextNodeId: 'show_discovery_node',
        },
        {
          id: 'listen_more',
          text: 'Bagaimana benua bisa terpecah Prof?',
          nextNodeId: 'explain_more',
        },
      ],
    },
    explain_more: {
      id: 'explain_more',
      speakerId: 'prof_maya',
      text: 'Arus panas dari interior bumi merobek daratan purba perlahan selama jutaan tahun. Yuk amati rekonstruksi 4 tahapannya!',
      expression: 'happy',
      choices: [
        {
          id: 'confirm_view',
          text: 'Buka rekonstruksi daratan purba',
          nextNodeId: 'show_discovery_node',
        },
      ],
    },
    show_discovery_node: {
      id: 'show_discovery_node',
      speakerId: 'prof_maya',
      text: 'Ini dia modulnya! Cermati nama superbenua raksasa ini dan bagaimana potongan benua saling mengunci pas seperti puzzle ya!',
      expression: 'happy',
      triggerDiscoveryModal: 10,
    },
  },
};

export const PROF_MAYA_REVIEW_DIALOGUE: DialogueTree = {
  id: 'prof_maya_review_dialogue',
  title: 'Peta Superbenua Purba',
  npcSpeakerId: 'prof_maya',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'prof_maya',
      text: 'Peta daratan purba membuktikan bahwa daratan bumi selalu bergerak dinamis. Mau melihat petanya lagi?',
      expression: 'normal',
      choices: [
        {
          id: 'open_again',
          text: 'Buka peta daratan purba lagi',
          nextNodeId: 'open_node',
        },
        {
          id: 'done',
          text: 'Saya sudah paham Prof, terima kasih!',
          nextNodeId: 'farewell',
        },
      ],
    },
    open_node: {
      id: 'open_node',
      speakerId: 'prof_maya',
      text: 'Silakan amati kembali 4 tahapan pergeseran daratan purba ini ya!',
      expression: 'happy',
      triggerDiscoveryModal: 10,
    },
    farewell: {
      id: 'farewell',
      speakerId: 'prof_maya',
      text: 'Hebat! Di seberang celah rekahan membara ada Dr. Citra. Berhati-hatilah saat melompat melewati celah ya!',
      expression: 'happy',
    },
  },
};

// ── POHON DIALOG: DR. CITRA (PENELITI PEGUNUNGAN KEMBAR PX 1040 - TEMUAN 11) ──
export const DR_CITRA_DIALOGUE: DialogueTree = {
  id: 'dr_citra_dialogue',
  title: 'Bukti Rantai Pegunungan Kembar',
  npcSpeakerId: 'dr_citra',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'dr_citra',
      text: 'Hebat! Kamu berhasil melompati rekahan cairan pijar yang menganga itu dengan selamat!',
      expression: 'happy',
      nextNodeId: 'ask_discovery',
    },
    ask_discovery: {
      id: 'ask_discovery',
      speakerId: 'dr_citra',
      text: 'Bukti bahwa benua dulunya menyatu dapat kita temukan pada formasi batuan pegunungan di dua benua yang kini terpisah samudra luas. Mau lihat buktinya?',
      expression: 'thinking',
      choices: [
        {
          id: 'view_mountains',
          text: 'Wah menarik, tolong perlihatkan Dok!',
          nextNodeId: 'show_discovery_node',
        },
        {
          id: 'listen_story',
          text: 'Mengapa batuan itu bisa terpisah jauh?',
          nextNodeId: 'explain_more',
        },
      ],
    },
    explain_more: {
      id: 'explain_more',
      speakerId: 'dr_citra',
      text: 'Saat lempeng bergerak saling memisah, cekungan samudra baru terbentuk di tengah dan memisahkan rangkaian pegunungan itu! Yuk lihat diagramnya.',
      expression: 'happy',
      choices: [
        {
          id: 'confirm_view',
          text: 'Buka diagram pegunungan kembar',
          nextNodeId: 'show_discovery_node',
        },
      ],
    },
    show_discovery_node: {
      id: 'show_discovery_node',
      speakerId: 'dr_citra',
      text: 'Ini dia diagram pegunungan kembar! Perhatikan bagaimana jalurnya menyambung lurus saat benua disatukan!',
      expression: 'happy',
      triggerDiscoveryModal: 11,
    },
  },
};

export const DR_CITRA_REVIEW_DIALOGUE: DialogueTree = {
  id: 'dr_citra_review_dialogue',
  title: 'Diagram Rantai Pegunungan Kembar',
  npcSpeakerId: 'dr_citra',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'dr_citra',
      text: 'Rantai pegunungan kembar adalah bukti tak terbantahkan bahwa benua pernah bersatu. Mau mempelajari diagramnya lagi?',
      expression: 'normal',
      choices: [
        {
          id: 'open_again',
          text: 'Buka diagram pegunungan lagi',
          nextNodeId: 'open_node',
        },
        {
          id: 'done',
          text: 'Saya sudah paham Dok, terima kasih!',
          nextNodeId: 'farewell',
        },
      ],
    },
    open_node: {
      id: 'open_node',
      speakerId: 'dr_citra',
      text: 'Silakan pelajari kembali kesamaan formasi batuan ini ya!',
      expression: 'happy',
      triggerDiscoveryModal: 11,
    },
    farewell: {
      id: 'farewell',
      speakerId: 'dr_citra',
      text: 'Bagus sekali! Selanjutnya ada Prof. Ilham yang meneliti pembentukan kerak baru dari batuan cair yang menerobos ke atas.',
      expression: 'happy',
    },
  },
};

// ── POHON DIALOG: PROF. ILHAM (AHLI PEMEKARAN SAMUDRA PX 1440 - TEMUAN 12) ──
export const PROF_ILHAM_DIALOGUE: DialogueTree = {
  id: 'prof_ilham_dialogue',
  title: 'Pemekaran Kerak Samudra Baru',
  npcSpeakerId: 'prof_ilham',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'prof_ilham',
      text: 'Perhatikan celah jurang retakan ini! Di batas divergen, lempeng tektonik mengalami pergerakan aktif yang merekah.',
      expression: 'normal',
      nextNodeId: 'ask_discovery',
    },
    ask_discovery: {
      id: 'ask_discovery',
      speakerId: 'prof_ilham',
      text: 'Cairan panas bersuhu ribuan derajat dari mantel bumi menerobos naik mengisi celah rekahan tersebut lalu membeku menjadi dasar laut baru. Mau mengamati simulasinya?',
      expression: 'thinking',
      choices: [
        {
          id: 'view_simulation',
          text: 'Tentu Prof, mari kita amati simulasinya!',
          nextNodeId: 'show_discovery_node',
        },
        {
          id: 'listen_cooling',
          text: 'Bagaimana proses pembekuan batuannya Prof?',
          nextNodeId: 'explain_more',
        },
      ],
    },
    explain_more: {
      id: 'explain_more',
      speakerId: 'prof_ilham',
      text: 'Suhu dingin air membekukan cairan panas tersebut dengan sangat cepat menjadi batuan basal dasar samudra. Yuk amati visual simulasinya!',
      expression: 'happy',
      choices: [
        {
          id: 'confirm_view',
          text: 'Buka simulator pemekaran lempeng',
          nextNodeId: 'show_discovery_node',
        },
      ],
    },
    show_discovery_node: {
      id: 'show_discovery_node',
      speakerId: 'prof_ilham',
      text: 'Ini dia simulasinya! Cermati arah panah pergerakan kedua lempeng dan nama batuan cair mantel yang menerobos naik ya!',
      expression: 'happy',
      triggerDiscoveryModal: 12,
    },
  },
};

export const PROF_ILHAM_REVIEW_DIALOGUE: DialogueTree = {
  id: 'prof_ilham_review_dialogue',
  title: 'Simulasi Batas Divergen',
  npcSpeakerId: 'prof_ilham',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'prof_ilham',
      text: 'Pemekaran lempeng divergen terus memperluas dasar laut setiap tahun. Mau melihat simulasinya lagi?',
      expression: 'normal',
      choices: [
        {
          id: 'open_again',
          text: 'Buka simulasi pemekaran lagi',
          nextNodeId: 'open_node',
        },
        {
          id: 'done',
          text: 'Saya sudah paham Prof, terima kasih!',
          nextNodeId: 'farewell',
        },
      ],
    },
    open_node: {
      id: 'open_node',
      speakerId: 'prof_ilham',
      text: 'Silakan amati kembali dinamika pemekaran lempeng divergen ini ya!',
      expression: 'happy',
      triggerDiscoveryModal: 12,
    },
    farewell: {
      id: 'farewell',
      speakerId: 'prof_ilham',
      text: 'Luar biasa! Di ujung tebing ada Komandan Satria yang mengawal gerbang batas lempeng.',
      expression: 'happy',
    },
  },
};

// ── POHON DIALOG: KOMANDAN SATRIA (PENJAGA GERBANG LEMBAH RETAKAN PX 1840) ──
export const KOMANDAN_SATRIA_LOCKED_DIALOGUE: DialogueTree = {
  id: 'komandan_satria_locked_dialogue',
  title: 'Gerbang Batas Konvergen Terkunci',
  npcSpeakerId: 'komandan_satria',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'komandan_satria',
      text: 'Berhenti penjelajah! Akses lintasan menuju area berikutnya masih terkunci rapat.',
      expression: 'serious',
      nextNodeId: 'explain_lock',
    },
    explain_lock: {
      id: 'explain_lock',
      speakerId: 'komandan_satria',
      text: 'Lembah retakan ini baru saja membelah dan memunculkan cairan panas. Kamu harus mempelajari seluruh materi dari Prof. Maya, Dr. Citra, dan Prof. Ilham sebelum diizinkan melintas. Temui mereka dan pelajari materinya ya!',
      expression: 'thinking',
      choices: [
        {
          id: 'ack',
          text: 'Baik Komandan, saya akan temui para peneliti dulu!',
          nextNodeId: 'farewell',
        },
      ],
    },
    farewell: {
      id: 'farewell',
      speakerId: 'komandan_satria',
      text: 'Bagus! Pelajari materinya dengan cermat, lalu kembali ke sini untuk membuktikan pemahamanmu!',
      expression: 'normal',
    },
  },
};

export const KOMANDAN_SATRIA_READY_DIALOGUE: DialogueTree = {
  id: 'komandan_satria_ready_dialogue',
  title: 'Pos Penjaga Gerbang Lembah Retakan',
  npcSpeakerId: 'komandan_satria',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'komandan_satria',
      text: 'Lapor penjelajah! Saya melihat kamu berhasil melintasi celah rekahan dan menuntaskan penelaahan data bersama para peneliti.',
      expression: 'normal',
      nextNodeId: 'challenge_prompt',
    },
    challenge_prompt: {
      id: 'challenge_prompt',
      speakerId: 'komandan_satria',
      text: 'Apakah kamu sudah mengamati seluruh materi batas divergen dari para peneliti di lembah retakan ini? Selesaikan tantangan tebak kata dariku untuk membuka akses menuju area berikutnya!',
      expression: 'thinking',
      choices: [
        {
          id: 'accept_challenge',
          text: 'Sudah paham Komandan, saya siap tantangannya!',
          nextNodeId: 'start_challenge_node',
        },
        {
          id: 'review_materials',
          text: 'Saya mau melihat-lihat materi dulu, Komandan.',
          nextNodeId: 'standby_node',
        },
      ],
    },
    start_challenge_node: {
      id: 'start_challenge_node',
      speakerId: 'komandan_satria',
      text: 'Bagus sekali! Tunjukkan pemahamanmu mengenai batas divergen, superbenua purba, dan cairan mantel pada kuis tebak kata berikut!',
      expression: 'happy',
      triggerChallengeGate: true,
    },
    standby_node: {
      id: 'standby_node',
      speakerId: 'komandan_satria',
      text: 'Siap! Silakan baca dan pelajari kembali materi dari Prof. Maya, Dr. Citra, dan Prof. Ilham di teras retakan. Kalau sudah siap, temui saya lagi ya!',
      expression: 'normal',
    },
  },
};

export const KOMANDAN_SATRIA_UNLOCKED_DIALOGUE: DialogueTree = {
  id: 'komandan_satria_unlocked_dialogue',
  title: 'Akses Batas Konvergen Terbuka',
  npcSpeakerId: 'komandan_satria',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'komandan_satria',
      text: 'Luar biasa penjelajah! Pemahamanmu mengenai dinamika batas divergen terbukti sempurna.',
      expression: 'happy',
      nextNodeId: 'farewell',
    },
    farewell: {
      id: 'farewell',
      speakerId: 'komandan_satria',
      text: 'Poros lintasan menuju Batas Konvergen di sebelah kanan sudah terbuka. Silakan meluncur ke area berikutnya!',
      expression: 'happy',
    },
  },
};

// ══════════════════════════════════════════════════════════════════════════
// AREA 7: BATAS KONVERGEN (ZONA PENUMBUKAN, SUBDUKSI & GUNUNG BERAPI)
// ══════════════════════════════════════════════════════════════════════════

// 1. MASKOT RESQY (PANDUAN AWAL AREA 7)
export const MASCOT_CONVERGENT_INTRO_DIALOGUE: DialogueTree = {
  id: 'mascot_convergent_intro',
  title: 'Penyambutan Batas Konvergen',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'resqy',
      text: 'Taruna, selamat datang di Batas Konvergen! Berbeda dengan area divergen yang saling memisah, di sini dua lempeng raksasa bumi saling bertabrakan!',
      expression: 'happy',
      nextNodeId: 'ocean_boat_step',
    },
    ocean_boat_step: {
      id: 'ocean_boat_step',
      speakerId: 'resqy',
      text: 'Kita saat ini menaiki perahu riset di atas perairan Kerak Samudra. Lihat ke depan: lempeng samudra yang padat menunjam ke bawah lempeng benua (subduksi)!',
      expression: 'thinking',
      nextNodeId: 'trench_mountain_step',
    },
    trench_mountain_step: {
      id: 'trench_mountain_step',
      speakerId: 'resqy',
      text: 'Tumbukan ini membentuk Palung Laut Dalam dan mendesak daratan terlipat ke atas menjadi Pegunungan & Gunung Berapi! Mari berlayar merapat ke daratan Kerak Benua untuk menemui tim ilmuwan!',
      expression: 'happy',
    },
  },
};

export const MASCOT_CONVERGENT_GUIDE_DIALOGUE: DialogueTree = {
  id: 'mascot_convergent_guide',
  title: 'Petunjuk Penjelajahan Konvergen',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'resqy',
      text: 'Petunjuk cepat konvergen: kemudikan perahu ke kanan hingga merapat di dermaga, lalu seberangi jembatan batu di atas palung.',
      expression: 'thinking',
      nextNodeId: 'guide_2',
    },
    guide_2: {
      id: 'guide_2',
      speakerId: 'resqy',
      text: 'Di daratan benua, temui Dr. Farhan dan Prof. Ratna untuk menelaah data subduksi serta 3 bentang alam sebelum melapor ke Komandan Arya di ujung altar!',
      expression: 'happy',
    },
  },
};

// 2. DR. FARHAN: AHLI OSEANOGRAFI & SUBDUKSI LEMPENG SAMUDRA (TEMUAN 13)
export const DR_FARHAN_CONV_DIALOGUE: DialogueTree = {
  id: 'dr_farhan_dialogue',
  title: 'Stasiun Riset Oseanografi Pesisir',
  npcSpeakerId: 'dr_farhan',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'dr_farhan',
      text: 'Selamat mendarat di pesisir Kerak Benua! Di belakangmu adalah garis pertemuan lempeng samudra yang menunjam ke bawah daratan kita.',
      expression: 'normal',
      nextNodeId: 'subduct_desc',
    },
    subduct_desc: {
      id: 'subduct_desc',
      speakerId: 'dr_farhan',
      text: 'Lempeng samudra memiliki massa jenis lebih padat dan berat. Saat menumbuk lempeng benua, lempeng samudra menyusup masuk menunjam ke kedalaman mantel bumi!',
      expression: 'thinking',
      choices: [
        {
          id: 'learn_subduction',
          text: 'Bagaimana proses penunjaman dan peleburan batuannya, Dokter?',
          nextNodeId: 'open_subduction_modal',
        },
      ],
    },
    open_subduction_modal: {
      id: 'open_subduction_modal',
      speakerId: 'dr_farhan',
      text: 'Mari kita teliti visual penampang 3D subduksi lempeng samudra dan peleburan mantel pada diagram instrumen ini!',
      expression: 'happy',
      discoveryIdToMark: 'conv_disc1',
      triggerDiscoveryModal: 13,
    },
  },
};

export const DR_FARHAN_CONV_REVIEW_DIALOGUE: DialogueTree = {
  id: 'dr_farhan_conv_review_dialogue',
  title: 'Tinjauan Data Subduksi Lempeng',
  npcSpeakerId: 'dr_farhan',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'dr_farhan',
      text: 'Kerak samudra yang padat terus menunjam ke mantel bumi dan melebur. Lanjutkan penjelajahanmu mendaki lereng untuk menemui Prof. Ratna!',
      expression: 'normal',
      choices: [
        {
          id: 'reopen_modal',
          text: 'Saya ingin mengamati kembali penampang subduksi.',
          nextNodeId: 'reopen_subduction_node',
        },
        {
          id: 'continue_journey',
          text: 'Terima kasih Dokter, saya akan mendaki ke bukit!',
          nextNodeId: 'closing_node',
        },
      ],
    },
    reopen_subduction_node: {
      id: 'reopen_subduction_node',
      speakerId: 'dr_farhan',
      text: 'Tentu, silakan amati kembali diagram subduksi lempeng.',
      expression: 'happy',
      triggerDiscoveryModal: 13,
    },
    closing_node: {
      id: 'closing_node',
      speakerId: 'dr_farhan',
      text: 'Semoga sukses! Hati-hati saat melintasi lereng batuan andesit terlipat di depan.',
      expression: 'normal',
    },
  },
};

// 3. PROF. RATNA: AHLI VULKANOLOGI & BENTANG ALAM KONVERGEN (TEMUAN 14)
export const PROF_RATNA_CONV_DIALOGUE: DialogueTree = {
  id: 'prof_ratna_dialogue',
  title: 'Pos Pengamatan Morfologi Vulkanik',
  npcSpeakerId: 'prof_ratna',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'prof_ratna',
      text: 'Selamat datang di lereng pegunungan lipatan! Tumbukan lempeng konvergen melepaskan tenaga kompresi tektonik yang luar biasa dahsyat.',
      expression: 'normal',
      nextNodeId: 'landforms_desc',
    },
    landforms_desc: {
      id: 'landforms_desc',
      speakerId: 'prof_ratna',
      text: 'Tumbukan ini melahirkan 3 bentang alam utama di bumi: palung laut dalam, pegunungan lipatan, dan busur gunung berapi aktif!',
      expression: 'thinking',
      choices: [
        {
          id: 'learn_landforms',
          text: 'Bisa jelaskan detail ketiga bentang alam tersebut, Profesor?',
          nextNodeId: 'open_landforms_modal',
        },
      ],
    },
    open_landforms_modal: {
      id: 'open_landforms_modal',
      speakerId: 'prof_ratna',
      text: 'Bagus sekali rasa ingin tahumu! Buka modul observasi ini untuk mempelajari palung samudra, pegunungan lipatan, dan busur gunung api.',
      expression: 'happy',
      discoveryIdToMark: 'conv_disc2',
      triggerDiscoveryModal: 14,
    },
  },
};

export const PROF_RATNA_CONV_REVIEW_DIALOGUE: DialogueTree = {
  id: 'prof_ratna_conv_review_dialogue',
  title: 'Tinjauan 3 Bentang Alam Konvergen',
  npcSpeakerId: 'prof_ratna',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'prof_ratna',
      text: 'Kepulauan Indonesia adalah bukti nyata keajaiban konvergen, memiliki palung laut abisal sekaligus jajaran gunung api aktif megah.',
      expression: 'normal',
      choices: [
        {
          id: 'reopen_modal',
          text: 'Saya ingin mempelajari kembali ketiga bentang alam.',
          nextNodeId: 'reopen_landforms_node',
        },
        {
          id: 'continue_climb',
          text: 'Saya mengerti Profesor, saya akan menuju altar!',
          nextNodeId: 'closing_node',
        },
      ],
    },
    reopen_landforms_node: {
      id: 'reopen_landforms_node',
      speakerId: 'prof_ratna',
      text: 'Silakan pelajari kembali modul 3 bentang alam geologis.',
      expression: 'happy',
      triggerDiscoveryModal: 14,
    },
    closing_node: {
      id: 'closing_node',
      speakerId: 'prof_ratna',
      text: 'Lanjutkan perjalananmu menuju altar timur. Komandan Arya sedang menunggu laporan hasil kajianmu!',
      expression: 'happy',
    },
  },
};

// 4. DR. BAYU: PENELITI LABORATORIUM VULKANIK & DAPUR MAGMA INTERNAL
export const DR_BAYU_CONV_DIALOGUE: DialogueTree = {
  id: 'dr_bayu_conv_dialogue',
  title: 'Laboratorium Pemantau Rongga Magma',
  npcSpeakerId: 'dr_bayu',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'dr_bayu',
      text: 'Salam penjelajah! Kamu sedang berada di pos pengamatan penampang dalam gunung berapi.',
      expression: 'normal',
      nextNodeId: 'magma_chamber_desc',
    },
    magma_chamber_desc: {
      id: 'magma_chamber_desc',
      speakerId: 'dr_bayu',
      text: 'Perhatikan penampang di samping: lelehan batuan lempeng menunjam yang melebur di mantel bumi naik dan berkumpul di dapur magma internal ini.',
      expression: 'thinking',
      nextNodeId: 'magma_safe',
    },
    magma_safe: {
      id: 'magma_safe',
      speakerId: 'dr_bayu',
      text: 'Dapur magma ini terlindung kokoh di dalam tubuh batuan andesit gunung. Selama tekanan stabil, cairan magma tetap tenang di dalam perut bumi!',
      expression: 'happy',
    },
  },
};

// 5. KOMANDAN ARYA: PENJAGA ALTAR BATAS KONVERGEN
export const KOMANDAN_ARYA_LOCKED_DIALOGUE: DialogueTree = {
  id: 'komandan_arya_locked_dialogue',
  title: 'Pos Komando Altar Konvergen',
  npcSpeakerId: 'komandan_arya',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'komandan_arya',
      text: 'Berhenti penjelajah! Akses gerbang menuju Batas Transform di depan masih terkunci rapat.',
      expression: 'serious',
      nextNodeId: 'locked_guidance',
    },
    locked_guidance: {
      id: 'locked_guidance',
      speakerId: 'komandan_arya',
      text: 'Kamu harus menelaah data subduksi bersama Dr. Farhan di pesisir dan menguasai materi 3 bentang alam bersama Prof. Ratna di lereng gunung terlebih dahulu!',
      expression: 'thinking',
    },
  },
};

export const KOMANDAN_ARYA_READY_DIALOGUE: DialogueTree = {
  id: 'komandan_arya_ready_dialogue',
  title: 'Ujian Evaluasi Altar Batas Konvergen',
  npcSpeakerId: 'komandan_arya',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'komandan_arya',
      text: 'Lapor penjelajah! Saya menerima konfirmasi bahwa kamu telah mempelajari seluruh materi batas konvergen bersama para ilmuwan.',
      expression: 'normal',
      nextNodeId: 'challenge_prompt',
    },
    challenge_prompt: {
      id: 'challenge_prompt',
      speakerId: 'komandan_arya',
      text: 'Apakah kamu siap menuntaskan tantangan tebak kata geologi konvergen untuk mengaktifkan portal akses berikutnya?',
      expression: 'thinking',
      choices: [
        {
          id: 'accept_challenge',
          text: 'Saya sudah siap Komandan, mari mulai tantangannya!',
          nextNodeId: 'start_challenge_node',
        },
        {
          id: 'review_again',
          text: 'Saya ingin mempelajari materi sebentar lagi, Komandan.',
          nextNodeId: 'standby_node',
        },
      ],
    },
    start_challenge_node: {
      id: 'start_challenge_node',
      speakerId: 'komandan_arya',
      text: 'Bagus sekali! Tunjukkan pemahamanmu mengenai penunjaman lempeng, jurang laut dalam, dan gunung api aktif Nusantara!',
      expression: 'happy',
      triggerChallengeGate: true,
    },
    standby_node: {
      id: 'standby_node',
      speakerId: 'komandan_arya',
      text: 'Siap! Silakan tinjau kembali data di pos riset. Jika kamu sudah merasa yakin, kembali temui saya di altar ini!',
      expression: 'normal',
    },
  },
};

export const KOMANDAN_ARYA_UNLOCKED_DIALOGUE: DialogueTree = {
  id: 'komandan_arya_unlocked_dialogue',
  title: 'Akses Batas Transform Terbuka',
  npcSpeakerId: 'komandan_arya',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'komandan_arya',
      text: 'Luar biasa penjelajah! Pemahamanmu mengenai dinamika batas konvergen dan subduksi terbukti sempurna.',
      expression: 'happy',
      nextNodeId: 'farewell',
    },
    farewell: {
      id: 'farewell',
      speakerId: 'komandan_arya',
      text: 'Altar batas konvergen telah aktif sepenuhnya. Silakan bersiap meluncur ke zona tektonik berikutnya!',
      expression: 'happy',
    },
  },
};

// ══════════════════════════════════════════════════════════════════════════
// AREA 8: BATAS TRANSFORM (GURUN SESAR SAN ANDREAS - TOP DOWN POV)
// ══════════════════════════════════════════════════════════════════════════

// 1. MASKOT RESQY (PANDUAN & TUTORIAL BATAS TRANSFORM)
export const MASCOT_TRANSFORM_INTRO_DIALOGUE: DialogueTree = {
  id: 'mascot_transform_intro',
  title: 'Selamat Datang di Batas Transform',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'resqy',
      text: 'Bzzzt! Selamat datang di Area 8: Batas Transform, zona terakhir ekspedisi Earth Dive kita!',
      expression: 'happy',
      nextNodeId: 'explain_topdown',
    },
    explain_topdown: {
      id: 'explain_topdown',
      speakerId: 'resqy',
      text: 'Di sini kita melihat dari sudut pandang atas (top-down) di Gurun Sesar San Andreas, karena lempeng bergeser mendatar ke kanan dan ke kiri!',
      expression: 'normal',
      nextNodeId: 'explain_controls',
    },
    explain_controls: {
      id: 'explain_controls',
      speakerId: 'resqy',
      text: 'Gunakan tombol W, A, S, D atau tombol Panah untuk bergerak bebas ke 4 arah. Temui para peneliti di gurun ini!',
      expression: 'happy',
    },
  },
};

export const MASCOT_TRANSFORM_GUIDE_DIALOGUE: DialogueTree = {
  id: 'mascot_transform_guide',
  title: 'Panduan Lapangan Batas Transform',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'resqy',
      text: 'Perhatikan garis patahan di tengah gurun! Lempeng Pasifik di utara bergeser ke kiri, sedangkan Lempeng Amerika Utara di selatan bergeser ke kanan.',
      expression: 'thinking',
      nextNodeId: 'guide_steps',
    },
    guide_steps: {
      id: 'guide_steps',
      speakerId: 'resqy',
      text: 'Pelajari rekaman sismograf bersama Prof. Sarah dan peta Sesar San Andreas bersama Dr. Taufik sebelum melapor ke Komandan Guntur!',
      expression: 'happy',
    },
  },
};

// 2. DR. MAYA: PENGANTAR MEKANISME SESAR MENDATAR
export const DR_MAYA_TRANS_DIALOGUE: DialogueTree = {
  id: 'dr_maya_trans_dialogue',
  title: 'Pos Riset Batas Transform Gurun',
  npcSpeakerId: 'kapten_maya',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'kapten_maya',
      text: 'Halo penjelajah! Selamat tiba di pos pemantauan geologi Sesar San Andreas, California.',
      expression: 'happy',
      nextNodeId: 'explain_transform',
    },
    explain_transform: {
      id: 'explain_transform',
      speakerId: 'kapten_maya',
      text: 'Batas transform adalah batas antar-lempeng di mana dua lempeng litosfer saling bergesekan mendatar secara berlawanan arah.',
      expression: 'normal',
      nextNodeId: 'explain_conservative',
    },
    explain_conservative: {
      id: 'explain_conservative',
      speakerId: 'kapten_maya',
      text: 'Batas ini bersifat konservatif karena tidak menghasilkan kerak baru maupun menghancurkan kerak yang ada. Silakan telusuri jalur gurun ke arah timur!',
      expression: 'happy',
    },
  },
};

// 3. PROF. SARAH: PENGAMATAN SEISMOGRAF & PERGESERAN LEMPENG (DISCOVERY 15)
export const PROF_SARAH_TRANS_DIALOGUE: DialogueTree = {
  id: 'prof_sarah_trans_dialogue',
  title: 'Pos Pengamatan Seismik & Lempeng',
  npcSpeakerId: 'prof_sarah',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'prof_sarah',
      text: 'Lihatlah ke sekelilingmu! Jalur aspal dan alur sungai gurun ini terpotong dan bergeser akibat pergerakan mendatar lempeng tektonik.',
      expression: 'normal',
      nextNodeId: 'explain_seismo',
    },
    explain_seismo: {
      id: 'explain_seismo',
      speakerId: 'prof_sarah',
      text: 'Kami memasang jaringan sensor seismik presisi untuk mencatat getaran gempa dan mengukur pergeseran lempeng sekitar 5 sentimeter setiap tahunnya.',
      expression: 'thinking',
      nextNodeId: 'ask_modal',
    },
    ask_modal: {
      id: 'ask_modal',
      speakerId: 'prof_sarah',
      text: 'Apakah kamu ingin membuka lembar observasi seismograf dan dinamika pergerakan lempeng tektonik ini?',
      expression: 'normal',
      choices: [
        {
          id: 'open_seismo_modal',
          text: 'Ya, buka lembar observasi seismograf dan lempeng!',
          nextNodeId: 'open_seismo_node',
        },
        {
          id: 'later_seismo',
          text: 'Nanti saja Prof, saya ingin menjelajahi gurun dulu.',
          nextNodeId: 'later_seismo_node',
        },
      ],
    },
    open_seismo_node: {
      id: 'open_seismo_node',
      speakerId: 'prof_sarah',
      text: 'Bagus! Cermati grafik gelombang gempa dan mekanisme pergeseran mendatarnya baik-baik.',
      expression: 'happy',
      triggerDiscoveryModal: 15,
      discoveryIdToMark: 'trans_seismo',
    },
    later_seismo_node: {
      id: 'later_seismo_node',
      speakerId: 'prof_sarah',
      text: 'Tentu, silakan amati retakan tanah di sekitarmu terlebih dahulu. Temui saya kembali jika sudah siap!',
      expression: 'normal',
    },
  },
};

export const PROF_SARAH_TRANS_REVIEW_DIALOGUE: DialogueTree = {
  id: 'prof_sarah_trans_review_dialogue',
  title: 'Tinjau Lembar Seismograf & Lempeng',
  npcSpeakerId: 'prof_sarah',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'prof_sarah',
      text: 'Kamu sudah mencatat data seismograf. Apakah kamu ingin meninjau kembali lembar materi ini?',
      expression: 'normal',
      choices: [
        {
          id: 'review_seismo',
          text: 'Ya, buka kembali lembar materi seismograf!',
          nextNodeId: 'review_seismo_node',
        },
        {
          id: 'close_seismo',
          text: 'Data saya sudah cukup, terima kasih Prof.',
          nextNodeId: 'close_seismo_node',
        },
      ],
    },
    review_seismo_node: {
      id: 'review_seismo_node',
      speakerId: 'prof_sarah',
      text: 'Silakan pelajari kembali catatannya!',
      expression: 'happy',
      triggerDiscoveryModal: 15,
    },
    close_seismo_node: {
      id: 'close_seismo_node',
      speakerId: 'prof_sarah',
      text: 'Semangat melanjutkan observasi lapangan!',
      expression: 'happy',
    },
  },
};

// 4. DR. TAUFIK: SESAR SAN ANDREAS & WALLACE CREEK (DISCOVERY 16)
export const DR_TAUFIK_TRANS_DIALOGUE: DialogueTree = {
  id: 'dr_taufik_trans_dialogue',
  title: 'Pusat Analisis Sesar San Andreas',
  npcSpeakerId: 'dr_taufik',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'dr_taufik',
      text: 'Salam geologi! Tepat di tempat kita berdiri membentang Sesar San Andreas sepanjang lebih dari 1.200 kilometer.',
      expression: 'normal',
      nextNodeId: 'explain_strike_slip',
    },
    explain_strike_slip: {
      id: 'explain_strike_slip',
      speakerId: 'dr_taufik',
      text: 'Di sini, pergeseran mendatar sering terkunci oleh gaya gesek batuan. Saat kuncian terlepas tiba-tiba, energi elastis dilepaskan sebagai gempa bumi dangkal yang dahsyat!',
      expression: 'serious',
      nextNodeId: 'ask_modal',
    },
    ask_modal: {
      id: 'ask_modal',
      speakerId: 'dr_taufik',
      text: 'Maukah kamu membuka peta komprehensif Sesar San Andreas dan fenomena Wallace Creek?',
      expression: 'normal',
      choices: [
        {
          id: 'open_fault_modal',
          text: 'Ya, buka peta komprehensif Sesar San Andreas!',
          nextNodeId: 'open_fault_node',
        },
        {
          id: 'later_fault',
          text: 'Sebentar lagi Dr. Taufik, saya mau berkeliling dulu.',
          nextNodeId: 'later_fault_node',
        },
      ],
    },
    open_fault_node: {
      id: 'open_fault_node',
      speakerId: 'dr_taufik',
      text: 'Hebat! Pelajari alur sungai Wallace Creek yang terpotong dan dua lempeng raksasa yang saling berpapasan.',
      expression: 'happy',
      triggerDiscoveryModal: 16,
      discoveryIdToMark: 'trans_sanandreas',
    },
    later_fault_node: {
      id: 'later_fault_node',
      speakerId: 'dr_taufik',
      text: 'Baik, berhati-hatilah melangkah di dekat zona rekahan tanah. Datanglah lagi kapan saja!',
      expression: 'normal',
    },
  },
};

export const DR_TAUFIK_TRANS_REVIEW_DIALOGUE: DialogueTree = {
  id: 'dr_taufik_trans_review_dialogue',
  title: 'Tinjau Peta Sesar San Andreas',
  npcSpeakerId: 'dr_taufik',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'dr_taufik',
      text: 'Catatan Sesar San Andreas sudah tersimpan. Mau memeriksa petanya lagi?',
      expression: 'normal',
      choices: [
        {
          id: 'review_fault',
          text: 'Buka kembali peta Sesar San Andreas!',
          nextNodeId: 'review_fault_node',
        },
        {
          id: 'close_fault',
          text: 'Sudah cukup jelas, terima kasih Dr. Taufik.',
          nextNodeId: 'close_fault_node',
        },
      ],
    },
    review_fault_node: {
      id: 'review_fault_node',
      speakerId: 'dr_taufik',
      text: 'Silakan, perhatikan kembali arah pergerakan kedua lempeng tektonik!',
      expression: 'happy',
      triggerDiscoveryModal: 16,
    },
    close_fault_node: {
      id: 'close_fault_node',
      speakerId: 'dr_taufik',
      text: 'Luar biasa, lanjutkan penelitianmu hingga gerbang akhir!',
      expression: 'happy',
    },
  },
};

// 5. PETUGAS RUDI: KEAMANAN ZONA PATAHAN
export const PETUGAS_RUDI_TRANS_DIALOGUE: DialogueTree = {
  id: 'petugas_rudi_trans_dialogue',
  title: 'Pos Siaga Keselamatan Patahan',
  npcSpeakerId: 'petugas_rudi',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'petugas_rudi',
      text: 'Lapor kondisi aman! Garis sesar di tengah sedang mengalami gesekan tektonik kontinu.',
      expression: 'normal',
      nextNodeId: 'safety_tip',
    },
    safety_tip: {
      id: 'safety_tip',
      speakerId: 'petugas_rudi',
      text: 'Pastikan kamu sudah mempelajari data seismograf dari Prof. Sarah dan analisis patahan dari Dr. Taufik sebelum menghadap Komandan Guntur di ujung gerbang!',
      expression: 'happy',
    },
  },
};

// 6. KOMANDAN GUNTUR: KEPALA SEKTOR SESAR SAN ANDREAS & GERBANG EVALUASI AKHIR
export const KOMANDAN_GUNTUR_LOCKED_DIALOGUE: DialogueTree = {
  id: 'komandan_guntur_locked_dialogue',
  title: 'Pos Komando Sektor Patahan',
  npcSpeakerId: 'komandan_guntur',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'komandan_guntur',
      text: 'Berhenti penjelajah! Gerbang evaluasi seismik terakhir belum dapat diaktifkan.',
      expression: 'serious',
      nextNodeId: 'locked_guidance',
    },
    locked_guidance: {
      id: 'locked_guidance',
      speakerId: 'komandan_guntur',
      text: 'Kamu harus menguasai catatan alat pencatat gempa bersama Prof. Sarah dan data patahan mendatar bersama Dr. Taufik terlebih dahulu!',
      expression: 'thinking',
      choices: [
        {
          id: 'read_seismo_direct',
          text: 'Buka lembar seismograf & lempeng (Prof. Sarah)',
          nextNodeId: 'open_seismo_node',
        },
        {
          id: 'read_fault_direct',
          text: 'Buka peta Sesar San Andreas (Dr. Taufik)',
          nextNodeId: 'open_fault_node',
        },
        {
          id: 'explore_desert',
          text: 'Baik, saya akan berkeliling mencari data di gurun.',
          nextNodeId: 'standby_locked',
        },
      ],
    },
    open_seismo_node: {
      id: 'open_seismo_node',
      speakerId: 'komandan_guntur',
      text: 'Silakan pelajari grafik seismograf dan gerak 20 lempeng bumi!',
      expression: 'happy',
      triggerDiscoveryModal: 15,
      discoveryIdToMark: 'trans_seismo',
    },
    open_fault_node: {
      id: 'open_fault_node',
      speakerId: 'komandan_guntur',
      text: 'Silakan pelajari patahan mendatar San Andreas dan Wallace Creek!',
      expression: 'happy',
      triggerDiscoveryModal: 16,
      discoveryIdToMark: 'trans_sanandreas',
    },
    standby_locked: {
      id: 'standby_locked',
      speakerId: 'komandan_guntur',
      text: 'Temui kembali saya jika catatanmu sudah lengkap!',
      expression: 'normal',
    },
  },
};

export const KOMANDAN_GUNTUR_READY_DIALOGUE: DialogueTree = {
  id: 'komandan_guntur_ready_dialogue',
  title: 'Evaluasi Akhir Sektor Sesar San Andreas',
  npcSpeakerId: 'komandan_guntur',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'komandan_guntur',
      text: 'Hormat, penjelajah! Seluruh data lapangan batas transform telah lengkap terverifikasi di sistem kami.',
      expression: 'normal',
      nextNodeId: 'challenge_prompt',
    },
    challenge_prompt: {
      id: 'challenge_prompt',
      speakerId: 'komandan_guntur',
      text: 'Apakah kamu siap menyelesaikan tebak kata geologi transform untuk menuntaskan seluruh ekspedisi Level 1?',
      expression: 'thinking',
      choices: [
        {
          id: 'accept_challenge',
          text: 'Saya siap, mari mulai tantangan akhir!',
          nextNodeId: 'start_challenge_node',
          triggerChallengeGate: true,
        },
        {
          id: 'review_again',
          text: 'Saya ingin meninjau data lapangan sebentar lagi, Komandan.',
          nextNodeId: 'standby_node',
        },
      ],
    },
    start_challenge_node: {
      id: 'start_challenge_node',
      speakerId: 'komandan_guntur',
      text: 'Bagus sekali! Buktikan penguasaanmu mengenai batas lempeng mendatar, patahan terkenal di California, dan alat pemantau getaran bumi!',
      expression: 'happy',
      triggerChallengeGate: true,
    },
    standby_node: {
      id: 'standby_node',
      speakerId: 'komandan_guntur',
      text: 'Siap! Silakan pelajari kembali dengan teliti. Segera temui saya di sini jika kamu sudah mantap.',
      expression: 'normal',
    },
  },
};

export const KOMANDAN_GUNTUR_UNLOCKED_DIALOGUE: DialogueTree = {
  id: 'komandan_guntur_unlocked_dialogue',
  title: 'Ekspedisi Level 1 Tuntas!',
  npcSpeakerId: 'komandan_guntur',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'komandan_guntur',
      text: 'Luar biasa membanggakan, penjelajah tangguh! Kamu telah memecahkan seluruh tantangan geologi dengan gemilang!',
      expression: 'happy',
      nextNodeId: 'farewell',
    },
    farewell: {
      id: 'farewell',
      speakerId: 'komandan_guntur',
      text: 'Kapsul evakuasi akhir di sebelah timur telah terbuka sepenuhnya. Masuklah ke kapsul untuk mengklaim gelar master penjelajah bumi dan membuka Level 2!',
      expression: 'happy',
    },
  },
};

// ── REGISTRY SEMUA DIALOG ──
export const DIALOGUE_REGISTRY: Record<string, DialogueTree> = {
  // Area 1: Permukaan Bumi
  mascot_intro: MASCOT_INTRO_DIALOGUE,
  prof_raditya_dialogue: PROF_RADITYA_DIALOGUE,
  kapten_maya_dialogue: KAPTEN_MAYA_DIALOGUE,

  // Area 2: Kerak Bumi / Litosfer
  mascot_crust_intro: MASCOT_CRUST_INTRO_DIALOGUE,
  mascot_crust_guide: MASCOT_CRUST_GUIDE_DIALOGUE,
  dr_gea_dialogue: DR_GEA_DIALOGUE,
  prof_andini_dialogue: PROF_ANDINI_DIALOGUE,
  prof_andini_review_dialogue: PROF_ANDINI_REVIEW_DIALOGUE,
  inspektur_budi_dialogue: INSPEKTUR_BUDI_DIALOGUE,
  komandan_hendra_dialogue: KOMANDAN_HENDRA_READY_DIALOGUE,
  komandan_hendra_ready_dialogue: KOMANDAN_HENDRA_READY_DIALOGUE,
  komandan_hendra_locked_dialogue: KOMANDAN_HENDRA_LOCKED_DIALOGUE,
  komandan_hendra_unlocked_dialogue: KOMANDAN_HENDRA_UNLOCKED_DIALOGUE,

  // Area 3: Mantel Bumi
  mascot_mantle_intro: MASCOT_MANTLE_INTRO_DIALOGUE,
  mascot_mantle_guide: MASCOT_MANTLE_GUIDE_DIALOGUE,
  dr_bayu_dialogue: DR_BAYU_DIALOGUE,
  prof_sarah_dialogue: PROF_SARAH_DIALOGUE,
  prof_sarah_review_dialogue: PROF_SARAH_REVIEW_DIALOGUE,
  dr_danang_dialogue: DR_DANANG_DIALOGUE,
  dr_danang_review_dialogue: DR_DANANG_REVIEW_DIALOGUE,
  petugas_rudi_dialogue: PETUGAS_RUDI_DIALOGUE,
  komandan_surya_dialogue: KOMANDAN_SURYA_READY_DIALOGUE,
  komandan_surya_ready_dialogue: KOMANDAN_SURYA_READY_DIALOGUE,
  komandan_surya_locked_dialogue: KOMANDAN_SURYA_LOCKED_DIALOGUE,
  komandan_surya_unlocked_dialogue: KOMANDAN_SURYA_UNLOCKED_DIALOGUE,

  // Area 4: Inti Luar
  mascot_outer_core_intro: MASCOT_OUTER_CORE_INTRO_DIALOGUE,
  mascot_outer_core_guide: MASCOT_OUTER_CORE_GUIDE_DIALOGUE,
  dr_fajar_dialogue: DR_FAJAR_DIALOGUE,
  prof_ratna_dialogue: PROF_RATNA_DIALOGUE,
  prof_ratna_review_dialogue: PROF_RATNA_REVIEW_DIALOGUE,
  dr_aris_dialogue: DR_ARIS_DIALOGUE,
  dr_aris_review_dialogue: DR_ARIS_REVIEW_DIALOGUE,
  petugas_joko_dialogue: PETUGAS_JOKO_DIALOGUE,
  komandan_teguh_dialogue: KOMANDAN_TEGUH_READY_DIALOGUE,
  komandan_teguh_ready_dialogue: KOMANDAN_TEGUH_READY_DIALOGUE,
  komandan_teguh_locked_dialogue: KOMANDAN_TEGUH_LOCKED_DIALOGUE,
  komandan_teguh_unlocked_dialogue: KOMANDAN_TEGUH_UNLOCKED_DIALOGUE,

  // Area 5: Inti Dalam
  mascot_inner_core_intro: MASCOT_INNER_CORE_INTRO_DIALOGUE,
  mascot_inner_core_guide: MASCOT_INNER_CORE_GUIDE_DIALOGUE,
  dr_bagus_dialogue: DR_BAGUS_DIALOGUE,
  prof_lestari_dialogue: PROF_LESTARI_DIALOGUE,
  prof_lestari_review_dialogue: PROF_LESTARI_REVIEW_DIALOGUE,
  dr_farhan_dialogue: DR_FARHAN_DIALOGUE,
  dr_farhan_review_dialogue: DR_FARHAN_REVIEW_DIALOGUE,
  petugas_dian_dialogue: PETUGAS_DIAN_DIALOGUE,
  komandan_bintang_dialogue: KOMANDAN_BINTANG_READY_DIALOGUE,
  komandan_bintang_ready_dialogue: KOMANDAN_BINTANG_READY_DIALOGUE,
  komandan_bintang_locked_dialogue: KOMANDAN_BINTANG_LOCKED_DIALOGUE,
  komandan_bintang_unlocked_dialogue: KOMANDAN_BINTANG_UNLOCKED_DIALOGUE,

  // Area 6: Batas Divergen
  mascot_divergent_intro: MASCOT_DIVERGENT_INTRO_DIALOGUE,
  mascot_divergent_guide: MASCOT_DIVERGENT_GUIDE_DIALOGUE,
  dr_taufik_dialogue: DR_TAUFIK_DIALOGUE,
  prof_maya_dialogue: PROF_MAYA_DIALOGUE,
  prof_maya_review_dialogue: PROF_MAYA_REVIEW_DIALOGUE,
  dr_citra_dialogue: DR_CITRA_DIALOGUE,
  dr_citra_review_dialogue: DR_CITRA_REVIEW_DIALOGUE,
  prof_ilham_dialogue: PROF_ILHAM_DIALOGUE,
  prof_ilham_review_dialogue: PROF_ILHAM_REVIEW_DIALOGUE,
  komandan_satria_dialogue: KOMANDAN_SATRIA_READY_DIALOGUE,
  komandan_satria_ready_dialogue: KOMANDAN_SATRIA_READY_DIALOGUE,
  komandan_satria_locked_dialogue: KOMANDAN_SATRIA_LOCKED_DIALOGUE,
  komandan_satria_unlocked_dialogue: KOMANDAN_SATRIA_UNLOCKED_DIALOGUE,

  // Area 7: Batas Konvergen
  mascot_convergent_intro: MASCOT_CONVERGENT_INTRO_DIALOGUE,
  mascot_convergent_guide: MASCOT_CONVERGENT_GUIDE_DIALOGUE,
  dr_farhan_conv_dialogue: DR_FARHAN_CONV_DIALOGUE,
  dr_farhan_conv_review_dialogue: DR_FARHAN_CONV_REVIEW_DIALOGUE,
  prof_ratna_conv_dialogue: PROF_RATNA_CONV_DIALOGUE,
  prof_ratna_conv_review_dialogue: PROF_RATNA_CONV_REVIEW_DIALOGUE,
  dr_bayu_conv_dialogue: DR_BAYU_CONV_DIALOGUE,
  komandan_arya_dialogue: KOMANDAN_ARYA_READY_DIALOGUE,
  komandan_arya_ready_dialogue: KOMANDAN_ARYA_READY_DIALOGUE,
  komandan_arya_locked_dialogue: KOMANDAN_ARYA_LOCKED_DIALOGUE,
  komandan_arya_unlocked_dialogue: KOMANDAN_ARYA_UNLOCKED_DIALOGUE,

  // Area 8: Batas Transform
  mascot_transform_intro: MASCOT_TRANSFORM_INTRO_DIALOGUE,
  mascot_transform_guide: MASCOT_TRANSFORM_GUIDE_DIALOGUE,
  dr_maya_trans_dialogue: DR_MAYA_TRANS_DIALOGUE,
  prof_sarah_trans_dialogue: PROF_SARAH_TRANS_DIALOGUE,
  prof_sarah_trans_review_dialogue: PROF_SARAH_TRANS_REVIEW_DIALOGUE,
  dr_taufik_trans_dialogue: DR_TAUFIK_TRANS_DIALOGUE,
  dr_taufik_trans_review_dialogue: DR_TAUFIK_TRANS_REVIEW_DIALOGUE,
  petugas_rudi_trans_dialogue: PETUGAS_RUDI_TRANS_DIALOGUE,
  komandan_guntur_dialogue: KOMANDAN_GUNTUR_READY_DIALOGUE,
  komandan_guntur_ready_dialogue: KOMANDAN_GUNTUR_READY_DIALOGUE,
  komandan_guntur_locked_dialogue: KOMANDAN_GUNTUR_LOCKED_DIALOGUE,
  komandan_guntur_unlocked_dialogue: KOMANDAN_GUNTUR_UNLOCKED_DIALOGUE,
};

export function getDialogueTree(id: string): DialogueTree | null {
  return DIALOGUE_REGISTRY[id] || null;
}

