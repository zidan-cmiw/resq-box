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
  | 'zidane'
  | 'zahra'
  | 'ican'
  | 'lintang'
  | 'bu_tyas'
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
  // ── 5 KARAKTER RESMI TIM EKSPEDISI RESQ-BOX ──
  zidane: {
    id: 'zidane',
    name: 'Zidane',
    title: 'Pakar Tektonik & Geofisika',
    nameColor: '#38bdf8', // Cyan cerdas & cool
    role: 'npc',
    portraitType: 'zidane',
  },
  zahra: {
    id: 'zahra',
    name: 'Zahra',
    title: 'Peneliti Mineralogi Ceria',
    nameColor: '#f472b6', // Pink ceria & imut
    role: 'npc',
    portraitType: 'zahra',
  },
  ican: {
    id: 'ican',
    name: 'Ican',
    title: 'Pengamat Dinamika Lempeng',
    nameColor: '#fb923c', // Oranye lincah & usil
    role: 'npc',
    portraitType: 'ican',
  },
  lintang: {
    id: 'lintang',
    name: 'Lintang',
    title: 'Analis Geologi Analitis',
    nameColor: '#4ade80', // Hijau emerald pintar
    role: 'npc',
    portraitType: 'lintang',
  },
  bu_tyas: {
    id: 'bu_tyas',
    name: 'Bu Tyas',
    title: 'Evaluator',
    nameColor: '#eab308', // Emas akademis & bijaksana
    role: 'npc',
    portraitType: 'bu_tyas',
  },
  // ── MAPPING LEGACY ID KE 5 KARAKTER RESMI (KONSISTENSI VISUAL & DIALOG) ──
  prof_raditya: {
    id: 'prof_raditya',
    name: 'Zidane',
    title: 'Pakar Tektonik & Geofisika',
    nameColor: '#38bdf8',
    role: 'npc',
    portraitType: 'zidane',
  },
  kapten_maya: {
    id: 'kapten_maya',
    name: 'Lintang',
    title: 'Analis Geologi Analitis',
    nameColor: '#4ade80',
    role: 'npc',
    portraitType: 'lintang',
  },
  resqy: {
    id: 'resqy',
    name: 'Resqy',
    title: 'Burung Hantu Pemandu Bijak',
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
    name: 'Zidane',
    title: 'Pakar Tektonik & Geofisika',
    nameColor: '#38bdf8',
    role: 'npc',
    portraitType: 'zidane',
  },
  prof_andini: {
    id: 'prof_andini',
    name: 'Lintang',
    title: 'Analis Geologi Analitis',
    nameColor: '#4ade80',
    role: 'npc',
    portraitType: 'lintang',
  },
  inspektur_budi: {
    id: 'inspektur_budi',
    name: 'Ican',
    title: 'Pengamat Dinamika Lempeng',
    nameColor: '#fb923c',
    role: 'npc',
    portraitType: 'ican',
  },
  komandan_hendra: {
    id: 'komandan_hendra',
    name: 'Bu Tyas',
    title: 'Evaluator',
    nameColor: '#eab308',
    role: 'npc',
    portraitType: 'bu_tyas',
  },
  prof_sarah: {
    id: 'prof_sarah',
    name: 'Zahra',
    title: 'Peneliti Mineralogi Ceria',
    nameColor: '#f472b6',
    role: 'npc',
    portraitType: 'zahra',
  },
  dr_bayu: {
    id: 'dr_bayu',
    name: 'Ican',
    title: 'Pengamat Dinamika Lempeng',
    nameColor: '#fb923c',
    role: 'npc',
    portraitType: 'ican',
  },
  dr_danang: {
    id: 'dr_danang',
    name: 'Lintang',
    title: 'Analis Geologi Analitis',
    nameColor: '#4ade80',
    role: 'npc',
    portraitType: 'lintang',
  },
  petugas_rudi: {
    id: 'petugas_rudi',
    name: 'Ican',
    title: 'Pengamat Dinamika Lempeng',
    nameColor: '#fb923c',
    role: 'npc',
    portraitType: 'ican',
  },
  komandan_surya: {
    id: 'komandan_surya',
    name: 'Bu Tyas',
    title: 'Evaluator',
    nameColor: '#eab308',
    role: 'npc',
    portraitType: 'bu_tyas',
  },
  dr_fajar: {
    id: 'dr_fajar',
    name: 'Zidane',
    title: 'Pakar Tektonik & Geofisika',
    nameColor: '#38bdf8',
    role: 'npc',
    portraitType: 'zidane',
  },
  prof_ratna: {
    id: 'prof_ratna',
    name: 'Zahra',
    title: 'Peneliti Mineralogi Ceria',
    nameColor: '#f472b6',
    role: 'npc',
    portraitType: 'zahra',
  },
  dr_aris: {
    id: 'dr_aris',
    name: 'Lintang',
    title: 'Analis Geologi Analitis',
    nameColor: '#4ade80',
    role: 'npc',
    portraitType: 'lintang',
  },
  petugas_joko: {
    id: 'petugas_joko',
    name: 'Ican',
    title: 'Pengamat Dinamika Lempeng',
    nameColor: '#fb923c',
    role: 'npc',
    portraitType: 'ican',
  },
  komandan_teguh: {
    id: 'komandan_teguh',
    name: 'Bu Tyas',
    title: 'Evaluator',
    nameColor: '#eab308',
    role: 'npc',
    portraitType: 'bu_tyas',
  },
  dr_bagus: {
    id: 'dr_bagus',
    name: 'Zidane',
    title: 'Pakar Tektonik & Geofisika',
    nameColor: '#38bdf8',
    role: 'npc',
    portraitType: 'zidane',
  },
  prof_lestari: {
    id: 'prof_lestari',
    name: 'Zahra',
    title: 'Peneliti Mineralogi Ceria',
    nameColor: '#f472b6',
    role: 'npc',
    portraitType: 'zahra',
  },
  dr_farhan: {
    id: 'dr_farhan',
    name: 'Lintang',
    title: 'Analis Geologi Analitis',
    nameColor: '#4ade80',
    role: 'npc',
    portraitType: 'lintang',
  },
  petugas_dian: {
    id: 'petugas_dian',
    name: 'Ican',
    title: 'Pengamat Dinamika Lempeng',
    nameColor: '#fb923c',
    role: 'npc',
    portraitType: 'ican',
  },
  komandan_bintang: {
    id: 'komandan_bintang',
    name: 'Bu Tyas',
    title: 'Evaluator',
    nameColor: '#eab308',
    role: 'npc',
    portraitType: 'bu_tyas',
  },
  dr_taufik: {
    id: 'dr_taufik',
    name: 'Zidane',
    title: 'Pakar Tektonik & Geofisika',
    nameColor: '#38bdf8',
    role: 'npc',
    portraitType: 'zidane',
  },
  prof_maya: {
    id: 'prof_maya',
    name: 'Zahra',
    title: 'Peneliti Mineralogi Ceria',
    nameColor: '#f472b6',
    role: 'npc',
    portraitType: 'zahra',
  },
  dr_citra: {
    id: 'dr_citra',
    name: 'Lintang',
    title: 'Analis Geologi Analitis',
    nameColor: '#4ade80',
    role: 'npc',
    portraitType: 'lintang',
  },
  prof_ilham: {
    id: 'prof_ilham',
    name: 'Ican',
    title: 'Pengamat Dinamika Lempeng',
    nameColor: '#fb923c',
    role: 'npc',
    portraitType: 'ican',
  },
  komandan_satria: {
    id: 'komandan_satria',
    name: 'Bu Tyas',
    title: 'Evaluator',
    nameColor: '#eab308',
    role: 'npc',
    portraitType: 'bu_tyas',
  },
  komandan_arya: {
    id: 'komandan_arya',
    name: 'Bu Tyas',
    title: 'Evaluator',
    nameColor: '#eab308',
    role: 'npc',
    portraitType: 'bu_tyas',
  },
  komandan_guntur: {
    id: 'komandan_guntur',
    name: 'Bu Tyas',
    title: 'Evaluator',
    nameColor: '#eab308',
    role: 'npc',
    portraitType: 'bu_tyas',
  },
};

// ── POHON DIALOG: MASKOT RESQY (BURUNG HANTU PEMANDU BIJAK) ──
export const MASCOT_INTRO_DIALOGUE: DialogueTree = {
  id: 'mascot_intro',
  title: 'Panduan Ekspedisi Burung Hantu Resqy',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'resqy',
      text: 'Kuk-kuuk! Halo! Aku Resqy, burung hantu pemandu ekspedisi geologimu! Dengan kacamata riset dan sayapku, aku akan membimbingmu menguak rahasia perut bumi!',
      expression: 'happy',
      nextNodeId: 'explain_team',
    },
    explain_team: {
      id: 'explain_team',
      speakerId: 'resqy',
      text: 'Di tiap lapisan bumi, kamu akan berpetualang bersama tim beranggotakan 5 orang: Zidane yang cerdas & cool, Zahra yang ceria & imut, Ican yang agak usil, Lintang yang analitis, serta guru kita, Bu Tyas!',
      expression: 'normal',
      nextNodeId: 'explain_rule',
    },
    explain_rule: {
      id: 'explain_rule',
      speakerId: 'resqy',
      text: 'PENTING SEKALI: Di tiap area, kamu WAJIB berkomunikasi dan berdialog dengan para rekan untuk mempelajari materi geologi! Perhatikan tanda kaca pembesar [🔍] yang melayang di atas kepala mereka — itu tandanya mereka menyimpan materi penting yang harus kamu pelajari!',
      expression: 'serious',
      choices: [
        {
          id: 'c1',
          text: 'Bagaimana cara membuka gerbang ke lapisan berikutnya, Resqy?',
          nextNodeId: 'explain_gate_eval',
        },
        {
          id: 'c2',
          text: 'Siap, aku akan temui semua rekan yang bertanda kaca pembesar [🔍]!',
          nextNodeId: 'explain_controls',
        },
      ],
    },
    explain_gate_eval: {
      id: 'explain_gate_eval',
      speakerId: 'resqy',
      text: 'Setelah membaca semua materi dari rekan timmu, temui Bu Tyas di ujung area! Bu Tyas akan memberikan evaluasi tantangan geologi (Wordle). Jika kamu berhasil menjawabnya, gerbang menuju lapisan berikutnya akan terbuka!',
      expression: 'happy',
      nextNodeId: 'explain_controls',
    },
    explain_controls: {
      id: 'explain_controls',
      speakerId: 'resqy',
      text: 'Gunakan tombol [A] / [D] atau Panah untuk berjalan, [SPASI] untuk melompat, dan tekan [E] atau [ENTER] saat berada di dekat rekanmu untuk berdialog!',
      expression: 'normal',
      nextNodeId: 'point_to_npc',
    },
    point_to_npc: {
      id: 'point_to_npc',
      speakerId: 'resqy',
      text: 'Di depan ada Zidane yang sedang meneliti batuan permukaan bumi. Dekati beliau lalu tekan [E] untuk mengobrol ya!',
      expression: 'happy',
      nextNodeId: 'ready_resqy',
    },
    ready_resqy: {
      id: 'ready_resqy',
      speakerId: 'resqy',
      text: 'Kumpulkan juga kristal kuning bercahaya di sepanjang jalan. Terbanglah dengan semangat penjelajah sejati! Kuk-kuuk!',
      expression: 'happy',
    },
  },
};

// ── POHON DIALOG: ZIDANE (LOKASI AWAL - PENGGANTI CATATAN PERTAMA) ──
export const PROF_RADITYA_DIALOGUE: DialogueTree = {
  id: 'prof_raditya_dialogue',
  title: 'Analisis Batuan Permukaan bersama Zidane',
  startNodeId: 'start',
  npcSpeakerId: 'zidane',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'zidane',
      text: 'Halo penjelajah. Selamat bergabung di tim ekspedisi kita. Aku Zidane, bertugas menganalisis data geofisika dan tektonik bumi.',
      expression: 'normal',
      nextNodeId: 'question_dig',
    },
    question_dig: {
      id: 'question_dig',
      speakerId: 'zidane',
      text: 'Tahukah kamu, seberapa dalam manusia pernah menggali lubang menembus kerak bumi?',
      expression: 'thinking',
      choices: [
        {
          id: 'c1',
          text: 'Seberapa dalam rekor pengeboran terdalam manusia, Zidane?',
          nextNodeId: 'explain_depth',
        },
        {
          id: 'c2',
          text: 'Tinggal kita bor saja terus lurus ke bawah, kan?',
          nextNodeId: 'explain_challenge',
        },
      ],
    },
    explain_depth: {
      id: 'explain_depth',
      speakerId: 'zidane',
      text: 'Baru sekitar 12 kilometer lewat proyek Kola Superdeep Borehole di Rusia. Itu bahkan belum menembus 0,2% dari total radius bumi kita.',
      expression: 'serious',
      nextNodeId: 'why_hard',
    },
    explain_challenge: {
      id: 'explain_challenge',
      speakerId: 'zidane',
      text: 'Tidak sesederhana itu. Semakin dalam kita mengebor, suhu dan tekanan oleh batuan terhadap daya kekuatan bor akan meningkat. Kekuatan mata bor yang tidak sebanding akan hancur dan membuat ekspedisi terhambat.',
      expression: 'serious',
      nextNodeId: 'why_hard',
    },
    why_hard: {
      id: 'why_hard',
      speakerId: 'zidane',
      text: 'Karena itulah kita memanfaatkan perambatan gelombang seismik gempa untuk meninjau struktur geologi bumi kita.',
      expression: 'normal',
      nextNodeId: 'tipe_gelombang',
    },
    tipe_gelombang: {
      id: 'tipe_gelombang',
      speakerId: 'zidane',
      text: 'Ada dua jenis gelombang seismik, loh! Pertama, gelombang primer (P) yang merambat paling cepat (5 km/s) dan bisa bergerak melalui batuan granit maupun cairan, Kedua, gelombang sekunder (S) yang merambat lebih lambat dan tidak bisa bergerak melalui cairan.',
      expression: 'happy',
      nextNodeId: 'lapisan_bumi',
    },
    lapisan_bumi: {
      id: 'lapisan_bumi',
      speakerId: 'zidane',
      text: 'Tahukah kamu, struktur bumi terdiri atas kerak bumi (listosfer), mantel bumi (astenosfer), dan inti yang terdiri atas inti luar serta inti dalam.',
      expression: 'happy',
      nextNodeId: 'ready_question',
    },

    ready_question: {
      id: 'ready_question',
      speakerId: 'zidane',
      text: 'Apakah kamu sudah siap melanjutkan perjalanan untuk mengeksplorasi lebih dalam tentang struktur bumi?',
      expression: 'thinking',
      choices: [
        {
          id: 'ready_yes',
          text: 'Siap Zidane, penjelasanmu sangat jelas!',
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
      speakerId: 'zidane',
      text: 'Ingat dua hal: struktur bumi memiliki tingkat suhu dan tekanan yang berbeda pada tiap lapisannya. Semakin dalam kamu menjelajah, maka suhu dan tekanannya akan semakin besar. Oleh karenanya, penting untuk menjaga keselamatanmu!',
      expression: 'happy',
      nextNodeId: 'farewell_ready',
    },
    farewell_ready: {
      id: 'farewell_ready',
      speakerId: 'zidane',
      text: 'Bagus. Terus jalan ke arah kanan melintasi jembatan, temui Zahra yang sedang bersiap di dekat portal penyelaman untuk menjelajahi struktur bumi lebih dalam.',
      expression: 'happy',
      discoveryIdToMark: 'surface_sign1',
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
      text: 'Kuk-kuuk! Kita sudah mendarat di Zona Kerak Bumi! Ini adalah lapisan bumi paling luar tempat manusia hidup.',
      expression: 'happy',
      nextNodeId: 'explain_team',
    },
    explain_team: {
      id: 'explain_team',
      speakerId: 'resqy',
      text: 'Di sini ada Zidane dan Lintang yang memiliki materi penting bertanda kaca pembesar [🔍], Ican yang berjaga, dan Bu Tyas di pintu keluar!',
      expression: 'normal',
      nextNodeId: 'mission_hint',
    },
    mission_hint: {
      id: 'mission_hint',
      speakerId: 'resqy',
      text: 'Sebelum membuka pintu ke mantel bumi, Bu Tyas akan menguji pemahamanmu tentang kerak bumi lewat tebak kata Wordle. Jadi pelajari materi dari rekanmu baik-baik ya!',
      expression: 'serious',
      choices: [
        {
          id: 'c1',
          text: 'Siap Resqy, aku temui Zidane dan Lintang dulu!',
          nextNodeId: 'ready_go',
        },
        {
          id: 'c2',
          text: 'Kenapa kerak bumi bisa pecah-pecah dan bergeser?',
          nextNodeId: 'explain_plates',
        },
      ],
    },
    explain_plates: {
      id: 'explain_plates',
      speakerId: 'resqy',
      text: 'Karena kerak bumi terpecah menjadi lempeng-lempeng tektonik raksasa yang mengapung di atas astenosfer mantel bumi yang panas dan plastis!',
      expression: 'thinking',
      nextNodeId: 'ready_go',
    },
    ready_go: {
      id: 'ready_go',
      speakerId: 'resqy',
      text: 'Ayo jalan ke kanan! Cari rekan bertanda kaca pembesar [🔍] dan kumpulkan kristal kuning di jalan ya! Kuk-kuuk!',
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
      text: 'Kuk-kuuk! Bingung mau ke mana? Ikuti panduan mudah ini:',
      expression: 'happy',
      nextNodeId: 'checklist',
    },
    checklist: {
      id: 'checklist',
      speakerId: 'resqy',
      text: '1. Bicara dengan Zidane di turunan jalan.\n2. Temui Zahra & Lintang yang bertanda kaca pembesar [🔍] untuk membaca materi.\n3. Lewati jalan retak dan sapa Ican.\n4. Temui Bu Tyas di pintu bawah untuk menjawab tantangan tebak kata Wordle!',
      expression: 'normal',
    },
  },
};

// ── POHON DIALOG AREA 2: ZIDANE (MINERALOGI & LITOLOGI KERAK) ──
export const DR_GEA_DIALOGUE: DialogueTree = {
  id: 'dr_gea_dialogue',
  title: 'Mengenal Kerak Bumi bersama Zidane',
  npcSpeakerId: 'dr_gea',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'dr_gea',
      text: 'Halo penjelajah. Selamat datang, di kerak bumi, tempat di mana makhluk hidup tinggal dan beragam sumber daya alam ditemukan.',
      expression: 'normal',
      nextNodeId: 'chit_chat_1',
    },
    chit_chat_1: {
      id: 'chit_chat_1',
      speakerId: 'dr_gea',
      text: 'Menariknya, lapisan ini sebenarnya yang paling tipis dibanding lapisan bumi lainnya, loh!',
      expression: 'normal',
      nextNodeId: 'ask_crust_deep',
    },
    ask_crust_deep: {
      id: 'ask_crust_deep',
      speakerId: 'player',
      text: 'Luar biasa! Aku mau tahu lebih banyak. Zahra mengatakan bahwa aku akan mendapatkan informasi secara mendalam saat ekspedisi.',
      expression: 'normal',
      nextNodeId: 'explain_crust',
    },
    explain_crust: {
      id: 'explain_crust',
      speakerId: 'dr_gea',
      text: 'Secara geologi, kerak bumi itu terbagi menjadi dua tipe, yaitu kerak benua dan kerak samudra.',
      expression: 'normal',
      choices: [
        {
          id: 'c1',
          text: 'Apa perbedaan mendasar antara keduanya, Zidane?',
          nextNodeId: 'explain_rock_types',
        },
        {
          id: 'c2',
          text: 'Benarkah kerak bumi kita terpecah menjadi lempeng-lempeng?',
          nextNodeId: 'explain_plates',
        },
      ],
    },
    explain_rock_types: {
      id: 'explain_rock_types',
      speakerId: 'dr_gea',
      text: 'Lapisan kerak benua lebih tebal dibandingkan kerak samudra, tebalnya 70 hingga 100 kilometer. Sedangkan kerak samudra memiliki ketebalan 5 hingga 15 kilometer.',
      nextNodeId: 'explain_crust_structure1',
    },
    explain_crust_structure1: {
      id: 'explain_crust_structure1',
      speakerId: 'dr_gea',
      text: 'Namun, kerak benua tersusun atas batuan SiAl (Silicium Aluminium) yang kaya akan unsur ringan seperti silikon dan aluminium.',
      expression: 'thinking',
      nextNodeId: 'explain_crust_structure2',
    },
    explain_crust_structure2: {
      id: 'explain_crust_structure2',
      speakerId: 'dr_gea',
      text: 'Sementara itu, kerak samudra tersusun atas batuan SiMa (Silicium Magnesium) yang kaya akan unsur berat seperti silikon, magnesium, dan besi.',
      expression: 'thinking',
      nextNodeId: 'explain_plates_consequence',
    },
    explain_plates_consequence: {
      id: 'explain_plates_consequence',
      speakerId: 'dr_gea',
      text: 'Karena perbedaan jenis batuan ini, kerak benua menjadi lebih ringan. Oleh karena itu, kerak benua cenderung mengapung di atas kerak samudera yang lebih berat.',
      expression: 'thinking',
      nextNodeId: 'point_to_team',
    },
    explain_plates: {
      id: 'explain_plates',
      speakerId: 'dr_gea',
      text: 'Tepat sekali! Kerak bumi terbagi menjadi lempeng-lempeng tektonik besar yang terus bergerak dinamis di atas astenosfer.',
      expression: 'serious',
      nextNodeId: 'point_to_team',
    },
    point_to_team: {
      id: 'point_to_team',
      speakerId: 'dr_gea',
      text: 'Lompatlah ke bukit batu di depan! Di sana ada Lintang yang akan menjelaskan tentang lempeng tektonik sebagai bagian dari kerak bumi.',
      expression: 'happy',
      nextNodeId: 'hint_plates',
    },
    hint_plates: {
      id: 'hint_plates',
      speakerId: 'player',
      text: 'Dia memiliki materi bertanda kaca pembesar [🔍]. Pelajari baik-baik sebelum menghadap Bu Tyas, ya!',
      expression: 'serious',
    },


  },
};

// ── POHON DIALOG AREA 2: LINTANG (TEMUAN GEOLOGIS KOMPARASI KERAK) ──
export const PROF_ANDINI_DIALOGUE: DialogueTree = {
  id: 'prof_andini_dialogue',
  title: 'Materi Kerak Benua & Kerak Samudra bersama Lintang',
  npcSpeakerId: 'prof_andini',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'prof_andini',
      text: 'Halo! Saya Lintang, peneliti muda struktur geologi bumi. Apa yang bisa saya bantu?',
      expression: 'happy',
      nextNodeId: 'ask_interest',
    },
    ask_interest: {
      id: 'ask_interest',
      speakerId: 'player',
      text: 'Halo, Lintang. Saya ingin belajar lebih dalam terkait dengan lempeng bumi. Bisakah kamu menjelaskannya?',
      expression: 'thinking',
      nextNodeId: 'explain_brief',
    },
    explain_brief: {
      id: 'explain_brief',
      speakerId: 'prof_andini',
      text: 'Tentu saja! Lempeng bumi merupakan bagian dari pecahan segmen kerak bumi yang bergerak dinamis di atas astenosfer.',
      expression: 'normal',
      nextNodeId: 'explain_plate_types_brief',
    },
    explain_plate_types_brief: {
      id: 'explain_plate_types_brief',
      speakerId: 'prof_andini',
      text: 'Lempeng terbagi menjadi dua tipe dengan karakteristik yang sama dengan kerak bumi, yaitu lempeng benua dan lempeng samudra. Kini, telah tercatat ada 20 lempeng bumi yang bergerak aktif.',
      expression: 'normal',
      nextNodeId: 'ask_plate_types',
    },
    ask_plate_types: {
      id: 'ask_plate_types',
      speakerId: 'player',
      text: 'Jika lempeng itu pecahan segmen dari kerak bumi yang bergerak, maka berapa banyak jenis pergerakan lempeng itu?',
      expression: 'normal',
      nextNodeId: 'answer_plate_types',
    },
    answer_plate_types: {
      id: 'answer_plate_types',
      speakerId: 'prof_andini',
      text: 'Pertanyaan bagus! Pergerakan lempeng dibagi menjadi 3 jenis: konvergen, divergen, dan transform.',
      expression: 'normal',
      nextNodeId: 'start_adv_button',
    },
    start_adv_button: {
      id: 'start_adv_button',
      speakerId: 'prof_andini',
      text: 'Mau belajar yang mana, penjelajah muda?',
      expression: 'normal',
      choices: [
        {
          id: 'c1',
          text: 'Belajar lempeng konvergen',
          nextNodeId: 'explain_konvergent',
        },
        {
          id: 'c2',
          text: 'Belajar lempeng divergen',
          nextNodeId: 'explain_divergen',
        },
        {
          id: 'c3',
          text: 'Belajar lempeng transform',
          nextNodeId: 'explain_transform',
        },
      ],
    },
    explain_konvergent: {
      id: 'explain_konvergent',
      speakerId: 'prof_andini',
      text: 'Lempeng konvergen adalah gerakan lempeng yang saling mendekat. Akibatnya akan terjadi tumbukan, lalu salah satu lempeng akan menujam ke bawah.',
      expression: 'normal',
      choices: [
        {
          id: 'c1',
          text: 'Saya paham, lanjutkan',
          nextNodeId: 'explain_divergen',
        },
      ],
    },
    explain_divergen: {
      id: 'explain_divergen',
      speakerId: 'prof_andini',
      text: 'Lempeng divergen adalah gerakan lempeng yang saling menjauh. Akibatnya akan terbentuk celah di antara lempeng, dan magma naik untuk mengisi celah tersebut.',
      expression: 'normal',
      choices: [
        {
          id: 'c1',
          text: 'Saya paham, lanjutkan',
          nextNodeId: 'explain_transform',
        },
      ],
    },
    explain_transform: {
      id: 'explain_transform',
      speakerId: 'prof_andini',
      text: 'Lempeng transform adalah gerakan lempeng yang saling bergesekan. Akibatnya akan memicu gempa bumi dangkal dan menciptakan patahan di permukaan bumi',
      expression: 'normal',
      nextNodeId: 'understand_plate_types_depth',
    },
    understand_plate_types_depth: {
      id: 'understand_plate_types_depth',
      speakerId: 'player',
      text: 'Ah, saya mengerti sekarang!.',
      expression: 'normal',
      nextNodeId: 'appreciate_plate_types_depth',
    },
    appreciate_plate_types_depth: {
      id: 'appreciate_plate_types_depth',
      speakerId: 'prof_andini',
      text: 'Bagus, penjelajah muda!',
      expression: 'normal',
      nextNodeId: 'warning_gate',
    },
    warning_gate: {
      id: 'warning_gate',
      speakerId: 'prof_andini',
      text: 'Sebagai hadiahnya, saya akan memberikan pendalaman materi terkait kerak bumi sebelum menghadapi Ibu Tyas sebagai Guard of Area!',
      expression: 'happy',
      choices: [
        {
          id: 'open_now',
          text: 'Buka Materi Kerak Bumi [🔍]',
          nextNodeId: 'open_discovery',
          discoveryIdToMark: 'crust_disc_compare',
        },
        {
          id: 'skip',
          text: 'Oke, sekarang saya sudah siap menghadapi Ibu Tyas!',
          nextNodeId: 'done',
        },
      ],
    },
    open_discovery: {
      id: 'open_discovery',
      speakerId: 'prof_andini',
      text: 'Ini dia materinya! Cermati dan pahami baik-baik ya, konsep ini nanti akan dievaluasi oleh Bu Tyas di pintu gerbang bawah!',
      expression: 'happy',
      discoveryIdToMark: 'crust_disc_compare',
      triggerDiscoveryModal: 0,
    },
    done: {
      id: 'done',
      speakerId: 'prof_andini',
      text: 'Bagus sekali! Lanjutkan perjalanan ke kanan, sapa Ican dan bersiaplah untuk evaluasi Ibu Tyas, ya!',
      expression: 'happy',
    },
  },
};

export const PROF_ANDINI_REVIEW_DIALOGUE: DialogueTree = {
  id: 'prof_andini_review_dialogue',
  title: 'Melihat Ulang Materi Kerak Bumi bersama Lintang',
  npcSpeakerId: 'prof_andini',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'prof_andini',
      text: 'Halo lagi! Apakah kamu ingin meninjau kembali pendalaman materi kerak bumi?',
      expression: 'happy',
      choices: [
        {
          id: 'review_yes',
          text: 'Iya Lintang, tolong buka kembali materinya!',
          nextNodeId: 'open_modal',
        },
        {
          id: 'review_no',
          text: 'Oke, saya sudah ingat kembali parameternya!',
          nextNodeId: 'done',
        },
      ],
    },
    open_modal: {
      id: 'open_modal',
      speakerId: 'prof_andini',
      text: 'Silakan pelajari kembali materinya!',
      expression: 'happy',
      triggerDiscoveryModal: 0,
    },
    done: {
      id: 'done',
      speakerId: 'prof_andini',
      text: 'Bagus sekali! Lanjutkan perjalanan ke kanan, sapa Ican dan bersiaplah untuk evaluasi Ibu Tyas, ya!',
      expression: 'happy',
    },
  },
};

// ── POHON DIALOG AREA 2: ICAN (PATAHAN & BATAS MOHO) ──
export const INSPEKTUR_BUDI_DIALOGUE: DialogueTree = {
  id: 'inspektur_budi_dialogue',
  title: 'Peringatan Retakan Batas Moho bersama Ican',
  npcSpeakerId: 'inspektur_budi',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'inspektur_budi',
      text: 'Eits! Hati-hati melangkah dong, jangan buru-buru nyelonong! Kita sedang ada di situs penggalian arkeologi.',
      expression: 'serious',
      nextNodeId: 'start_player',
    },
    start_player: {
      id: 'start_player',
      speakerId: 'player',
      text: 'Wah, maaf, saya terlalu bersemangat ingin melihat lapisan kerak bumi selanjutnya!',
      expression: 'normal',
      nextNodeId: 'ask_player_one',
    },
    ask_player_one: {
      id: 'ask_player_one',
      speakerId: 'player',
      text: 'Tunggu, apa kamu Ican?',
      expression: 'normal',
      nextNodeId: 'explain_one',
    },
    explain_one: {
      id: 'explain_one',
      speakerId: 'inspektur_budi',
      text: 'Benar! Namaku Ican, seorang arkeolog yang sangat tertarik dengan geologi bumi.',
      expression: 'happy',
      nextNodeId: 'ask_Ican_fossil',
    },
    ask_Ican_fossil: {
      id: 'ask_Ican_fossil',
      speakerId: 'inspektur_budi',
      text: 'Tahukah kamu, bahwa di kerak bumi terdapat berbagai fosil hewan dan tumbuhan yang terkubur jutaan tahun yang lalu?',
      expression: 'normal',
      nextNodeId: 'ask_Ican_two',
    },
    ask_Ican_two: {
      id: 'ask_Ican_two',
      speakerId: 'player',
      text: 'Saya pernah mendengar itu, ceritakan lebih lanjut!',
      expression: 'happy',
      nextNodeId: 'explain_fossil_age_and_benefit',
    },
    explain_fossil_age_and_benefit: {
      id: 'explain_fossil_age_and_benefit',
      speakerId: 'inspektur_budi',
      text: 'Fosil tersebut membantu menentukan usia batuan, sehingga para ahli dapat mengkaji sejarah perubahan bumi.',
      expression: 'happy',
      nextNodeId: 'explain_fossil_age',
    },
    explain_fossil_age: {
      id: 'explain_fossil_age',
      speakerId: 'inspektur_budi',
      text: 'Semakin dalam fosil ditemukan, semakin tua lapisan batuan tersebut, loh!',
      expression: 'happy',
      nextNodeId: 'explain_fossil_benefit',
    },
    explain_fossil_benefit: {
      id: 'explain_fossil_benefit',
      speakerId: 'inspektur_budi',
      text: 'Selain itu, fosil juga digunakan untuk memproduksi sumber energi seperti batu bara, minyak bumi, dan gas alam. Menarik kan?',
      expression: 'happy',
      nextNodeId: 'explain_density',
    },
    explain_density: {
      id: 'explain_density',
      speakerId: 'player',
      text: 'Wah, itu sangat menarik! Aku jadi semakin semangat menjelajahi setiap lapisan bumi!',
      expression: 'happy',
      nextNodeId: 'start_tour_one',
    },
    start_tour_one: {
      id: 'start_tour_one',
      speakerId: 'inspektur_budi',
      text: 'Oh iya, sebelum lanjut ke mantel bumi, lebih baik kamu menukar energi kristal dengan pakaian pelindung khusus!',
      expression: 'happy',
      nextNodeId: 'start_tour_two',
    },
    start_tour_two: {
      id: 'start_tour_two',
      speakerId: 'inspektur_budi',
      text: 'Suhu dan tekanan pada area mantel lebih tinggi daripada kerak bumi. Pakaianmu itu belum cukup untuk melindungimu.',
      expression: 'happy',
      nextNodeId: 'start_tour_three',
    },
    start_tour_three: {
      id: 'start_tour_three',
      speakerId: 'inspektur_budi',
      text: 'Tukarkan kristal energimu untuk mendapatkan pakaian pelindung khusus di Teknisi Joko setelah kamu menghadapi Ibu Tyas. Semangat!',
      expression: 'happy',
    },
  },
};

// ── POHON DIALOG AREA 2: BU TYAS (EVALUASI GERBANG MOHO) ──
export const KOMANDAN_HENDRA_READY_DIALOGUE: DialogueTree = {
  id: 'komandan_hendra_ready_dialogue',
  title: 'Evaluasi Gerbang Mantel Bumi bersama Bu Tyas',
  npcSpeakerId: 'komandan_hendra',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'komandan_hendra',
      text: 'Halo penjelajah muda. Saya Ibu Tyas, Guard of Area dari ekspedisi ini.',
      expression: 'normal',
      nextNodeId: 'ask_readiness',
    },
    ask_readiness: {
      id: 'ask_readiness',
      speakerId: 'komandan_hendra',
      text: 'Apakah kamu sudah membaca dan memahami seluruh materi kerak bumi dari rekan-rekanmu sebelum Ibu izinkan turun ke mantel bumi?',
      expression: 'thinking',
      choices: [
        {
          id: 'ready_challenge',
          text: 'Sudah paham Bu Tyas, saya siap evaluasinya!',
          nextNodeId: 'start_challenge_node',
        },
        {
          id: 'wait_challenge',
          text: 'Sebentar Bu Tyas, saya mau meninjau materinya lagi.',
          nextNodeId: 'standby_node',
        },
      ],
    },
    start_challenge_node: {
      id: 'start_challenge_node',
      speakerId: 'komandan_hendra',
      text: 'Bagus! Selesaikan evaluasi tebak kata ilmiah (Wordle) ini dengan benar untuk membuka sistem kunci pintunya!',
      expression: 'happy',
      triggerChallengeGate: true,
    },
    standby_node: {
      id: 'standby_node',
      speakerId: 'komandan_hendra',
      text: 'Sangat bijak, jangan terburu-buru. Kamu bisa membaca lagi materi dari Lintang yang bertanda kaca pembesar [🔍]. Jika sudah yakin, temui Ibu lagi ya.',
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
      text: 'Tunggu sebentar. Pintu turun ke mantel bumi belum bisa dibuka.',
      expression: 'serious',
      nextNodeId: 'explain_protocol',
    },
    explain_protocol: {
      id: 'explain_protocol',
      speakerId: 'komandan_hendra',
      text: 'Kamu harus mempelajari materi tentang kerak bumi dari rekanmu yang memegang materi bertanda kaca pembesar [🔍] (Lintang). Silakan temui dia terlebih dahulu!',
      expression: 'thinking',
      choices: [
        {
          id: 'ack',
          text: 'Baik Bu Tyas, saya akan pelajari materinya dulu!',
          nextNodeId: 'farewell',
        },
      ],
    },
    farewell: {
      id: 'farewell',
      speakerId: 'komandan_hendra',
      text: 'Bagus! Naiklah ke bukit batu dan pelajari materinya bersama Lintang secara saksama. Setelah itu kembalilah ke Ibu!',
      expression: 'normal',
    },
  },
};

export const KOMANDAN_HENDRA_UNLOCKED_DIALOGUE: DialogueTree = {
  id: 'komandan_hendra_unlocked_dialogue',
  title: 'Instruksi Pakaian Pelindung Mantel Bumi',
  npcSpeakerId: 'komandan_hendra',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'komandan_hendra',
      text: 'Luar biasa! Jawabanmu tepat semua. Kamu telah membuktikan pemahaman ilmiah mengenai karakteristik kerak bumi!',
      expression: 'happy',
      nextNodeId: 'suit_warning',
    },
    suit_warning: {
      id: 'suit_warning',
      speakerId: 'komandan_hendra',
      text: 'Namun tunggu dulu! Suhu di Mantel Bumi sangat ekstrem mencapai ribuan derajat Celsius. Tubuhmu tidak akan mampu bertahan tanpa pakaian pelindung khusus!',
      expression: 'serious',
      nextNodeId: 'instructions',
    },
    instructions: {
      id: 'instructions',
      speakerId: 'komandan_hendra',
      text: 'Gunakan kristal energi yang kamu dapatkan di area kerak bumi ini untuk membeli Baju Pelindung Termal di Teknisi Joko tepat di sebelah kanan Ibu sebelum menuju portal!',
      expression: 'normal',
    },
  },
};

// ══════════════════════════════════════════════════════════════════════════
// AREA 3: MANTEL BUMI (POHON DIALOG RESQY & PARA PENELITI MANTEL)
// ══════════════════════════════════════════════════════════════════════════

// ── POHON DIALOG: MASKOT RESQY (BRIEFING AWAL MANTEL BUMI) ──
// ── POHON DIALOG: MASKOT RESQY (BRIEFING AWAL MANTEL BUMI) ──
export const MASCOT_MANTLE_INTRO_DIALOGUE: DialogueTree = {
  id: 'mascot_mantle_intro',
  title: 'Briefing Mantel Bumi bersama Resqy',
  npcSpeakerId: 'resqy',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'resqy',
      text: 'Kuk-kuuk! Wah, kita sudah sampai di Mantel Bumi! Lapisan ini adalah lapisan tertebal di planet kita, tebalnya mencapai 2.900 kilometer!',
      expression: 'surprised',
      nextNodeId: 'explain_heat',
    },
    explain_heat: {
      id: 'explain_heat',
      speakerId: 'resqy',
      text: 'Suhunya sangat panas, tapi batuan di sini tetap padat dan mengalir perlahan seperti adonan kental.',
      expression: 'happy',
      nextNodeId: 'explain_heat_2',
    },
    explain_heat_2: {
      id: 'explain_heat_2',
      speakerId: 'resqy',
      text: 'Aliran tersebut diakibatkan karena adanya aliran panas dari inti bumi, disebut sebagai aliran konveksi',
      expression: 'happy',
      nextNodeId: 'point_ahead',
    },
    point_ahead: {
      id: 'point_ahead',
      speakerId: 'resqy',
      text: 'Ayo kumpulkan kristal energi di jalan, lalu pelajari materi dari Zahra dan Lintang yang bertanda kaca pembesar [🔍] ya! Kuk-kuuk!',
      expression: 'happy',
    },
  },
};

export const MASCOT_MANTLE_GUIDE_DIALOGUE: DialogueTree = {
  id: 'mascot_mantle_guide',
  title: 'Tips Mantel Bumi dari Resqy',
  npcSpeakerId: 'resqy',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'resqy',
      text: 'Kuk-kuuk! Tips dari Resqy, pahami konsepnya dengan baik!',
      expression: 'happy',
      nextNodeId: 'words_hint',
    },
    words_hint: {
      id: 'words_hint',
      speakerId: 'resqy',
      text: 'Ingat baik-baik kata kuncinya: MANTEL, PANAS, dan KONVEKSI. Nanti Bu Tyas akan mengujinya sebelum portal Inti Luar dibuka!',
      expression: 'thinking',
    },
  },
};


// ── POHON DIALOG: ZAHRA (TEMUAN GEOLOGIS 1: ARUS PANAS MANTEL) ──
export const PROF_SARAH_DIALOGUE: DialogueTree = {
  id: 'prof_sarah_dialogue',
  title: 'Peneliti Arus Panas Mantel bersama Zahra',
  npcSpeakerId: 'prof_sarah',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'prof_sarah',
      text: 'Halo penjelajah ceria! Kita bertemu kembali!',
      expression: 'happy',
      nextNodeId: 'ask_enthusiasm',
    },
    ask_enthusiasm: {
      id: 'ask_enthusiasm',
      speakerId: 'prof_sarah',
      text: 'Kamu pasti sangat bersemangat, ya?',
      expression: 'happy',
      nextNodeId: 'player_one_response',
    },

    player_one_response: {
      id: 'player_one_response',
      speakerId: 'player',
      text: 'Iya Zahra, saya sudah tidak sabar!',
      expression: 'happy',
      nextNodeId: 'player_two_response'
    },
    player_two_response: {
      id: 'player_two_response',
      speakerId: 'player',
      text: 'Tadi Resqy mengatakan bahwa ada aliran konveksi di dalam mantel bumi, bagaimana maksuudnya itu?',
      expression: 'happy',
      nextNodeId: 'convection_flow_explain'
    },
    convection_flow_explain: {
      id: 'convection_flow_explain',
      speakerId: 'prof_sarah',
      text: 'Pertanyaan yang bagus! Jadi, aliran konveksi itu terjadi akibat adanya tekanan panas dari inti bumi.',
      expression: 'normal',
      nextNodeId: 'player_three_response1',
    },
    player_three_response1: {
      id: 'player_three_response1',
      speakerId: 'player',
      text: 'Panas dari dalam bumi membuat material mantel berputar naik dan turun seperti air mendidih, yang dikenal sebagai aliran konveksi!',
      expression: 'happy',
      nextNodeId: 'player_three_response2',
    },
    player_three_response2: {
      id: 'player_three_response2',
      speakerId: 'prof_sarah',
      text: 'Proses perputaran ini terus berulang dan mendorong pergerakan lempeng tektonik di kerak bumi.',
      expression: 'normal',
      nextNodeId: 'player_three_response3',
    },
    player_three_response3: {
      id: 'player_three_response3',
      speakerId: 'player',
      text: 'Oh, jadi pergerakan lempeng tektonik itu penyebabnya karena adanya aliran konveksi panas bumi, ya?',
      expression: 'happy',
      nextNodeId: 'prof_sarah_answer'
    },
    prof_sarah_answer: {
      id: 'prof_sarah_answer',
      speakerId: 'prof_sarah',
      text: 'Betul sekali!.',
      expression: 'happy',
      nextNodeId: 'player_three_response4',
    },
    player_three_response4: {
      id: 'player_three_response4',
      speakerId: 'prof_sarah',
      text: 'Nah, supaya kamu semakin paham, saya akan berikan penguatan materi melalui animasi.',
      expression: 'happy',
      choices: [
        {
          id: 'open_now',
          text: 'Buka Materi Arus Panas Mantel [🔍]',
          nextNodeId: 'open_discovery',
          discoveryIdToMark: 'mantle_disc1',
        },
      ],
    },
    open_discovery: {
      id: 'open_discovery',
      speakerId: 'prof_sarah',
      text: 'Ini dia materinya! Amati baik-baik ya, konsep aliran panas konveksi ini nanti akan ditanyakan Bu Tyas sebelum turun ke inti bumi!',
      expression: 'happy',
      discoveryIdToMark: 'mantle_disc1',
      triggerDiscoveryModal: 4,
    },
  },
};

export const PROF_SARAH_REVIEW_DIALOGUE: DialogueTree = {
  id: 'prof_sarah_review_dialogue',
  title: 'Melihat Ulang Materi Arus Panas bersama Zahra',
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
          text: 'Iya Zahra, tolong buka kembali materinya!',
          nextNodeId: 'open_modal',
        },
        {
          id: 'review_no',
          text: 'Oke, sekarang saya sudah ingat kembali materinya!',
          nextNodeId: 'done',
        },
      ],
    },
    open_modal: {
      id: 'open_modal',
      speakerId: 'prof_sarah',
      text: 'Silakan pelajari kembali materinya ya!',
      expression: 'happy',
      triggerDiscoveryModal: 4,
    },
    done: {
      id: 'done',
      speakerId: 'prof_sarah',
      text: 'Hebat! Lanjutkan perjalananmu ke kanan dan temui Lintang di bukit batu tengah ya!',
      expression: 'happy',
    },
  },
};

// ── POHON DIALOG: LINTANG (TEMUAN GEOLOGIS 2: BATUAN MANTEL & TEKANAN) ──
export const DR_DANANG_DIALOGUE: DialogueTree = {
  id: 'dr_danang_dialogue',
  title: 'Peneliti Batuan Mantel Bumi bersama Lintang',
  npcSpeakerId: 'dr_danang',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'dr_danang',
      text: 'Halo! Bertemu kembali dengan saya, Lintang. Apakah kamu ingin menganalisis secara ilmiah kenapa batuan di dasar mantel tetap kokoh meski suhunya ribuan derajat?',
      expression: 'happy',
      choices: [
        {
          id: 'open_direct',
          text: 'Tentu Lintang, saya mau menganalisis datanya!',
          nextNodeId: 'open_discovery',
          discoveryIdToMark: 'mantle_disc2',
        },
        {
          id: 'brief_first',
          text: 'Kenapa batuannya tidak mencair, Lintang?',
          nextNodeId: 'explain_brief',
          discoveryIdToMark: 'mantle_disc2',
        },
      ],
    },
    explain_brief: {
      id: 'explain_brief',
      speakerId: 'dr_danang',
      text: 'Secara analitis, ini karena tekanan litostatik luar biasa dahsyat dari seluruh massa lapisan bumi di atasnya! Tekanan super tinggi tersebut memaksa atom-atom batuan tetap terikat padat.',
      expression: 'normal',
      nextNodeId: 'open_prompt',
    },
    open_prompt: {
      id: 'open_prompt',
      speakerId: 'dr_danang',
      text: 'Mari kita buka lembar data ilmiahnya agar kamu bisa menelaah struktur batuan mantel ini!',
      expression: 'happy',
      choices: [
        {
          id: 'open_now',
          text: 'Buka Materi Batuan Mantel [🔍]',
          nextNodeId: 'open_discovery',
          discoveryIdToMark: 'mantle_disc2',
        },
      ],
    },
    open_discovery: {
      id: 'open_discovery',
      speakerId: 'dr_danang',
      text: 'Silakan pelajari secara komprehensif ya. Ingat korelasi antara tekanan dahsyat yang menahan batuan tetap padat!',
      expression: 'happy',
      discoveryIdToMark: 'mantle_disc2',
      triggerDiscoveryModal: 5,
    },
  },
};

export const DR_DANANG_REVIEW_DIALOGUE: DialogueTree = {
  id: 'dr_danang_review_dialogue',
  title: 'Melihat Ulang Materi Batuan Mantel bersama Lintang',
  npcSpeakerId: 'dr_danang',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'dr_danang',
      text: 'Halo lagi! Mau meninjau ulang analisis data batuan mantel dan tekanannya?',
      expression: 'happy',
      choices: [
        {
          id: 'review_yes',
          text: 'Iya Lintang, tolong buka kembali materinya!',
          nextNodeId: 'open_modal',
        },
        {
          id: 'review_no',
          text: 'Sudah paham Lintang, terima kasih!',
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
      text: 'Bagus sekali! Lanjutkan ke kanan, temui Ican dan Bu Tyas di pintu turun ya!',
      expression: 'happy',
    },
  },
};

// ── POHON DIALOG: ICAN (PENGAWAS SUHU MANTEL BAWAH) ──
export const PETUGAS_RUDI_DIALOGUE: DialogueTree = {
  id: 'petugas_rudi_dialogue',
  title: 'Peringatan Suhu Panas bersama Ican',
  npcSpeakerId: 'petugas_rudi',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'petugas_rudi',
      text: 'Waspada saat melangkah! Semakin ke bawah suhunya makin gerah dan ekstrem nih mendekati inti bumi.',
      expression: 'serious',
      nextNodeId: 'warn_surya',
    },
    warn_surya: {
      id: 'warn_surya',
      speakerId: 'petugas_rudi',
      text: 'Di depan sudah ada Bu Tyas. Beliau menjaga pintu turun menuju Inti Luar bumi.',
      expression: 'normal',
      choices: [
        {
          id: 'c1',
          text: 'Bagaimana cara membuka pintu turunnya, Can?',
          nextNodeId: 'explain_gate',
        },
        {
          id: 'c2',
          text: 'Siap Can, aku segera ke sana!',
          nextNodeId: 'farewell',
        },
      ],
    },
    explain_gate: {
      id: 'explain_gate',
      speakerId: 'petugas_rudi',
      text: 'Kamu harus menjawab tantangan tebak kata Wordle dari Bu Tyas. Semua jawabannya sudah dijelaskan sama Zahra dan Lintang tadi kok!',
      expression: 'happy',
      nextNodeId: 'farewell',
    },
    farewell: {
      id: 'farewell',
      speakerId: 'petugas_rudi',
      text: 'Semoga sukses! Buktikan bahwa kamu sudah memahami materi mantel bumi dengan baik ya!',
      expression: 'happy',
    },
  },
};

// ── POHON DIALOG: BU TYAS (EVALUASI GERBANG INTI LUAR) ──
export const KOMANDAN_SURYA_LOCKED_DIALOGUE: DialogueTree = {
  id: 'komandan_surya_locked_dialogue',
  title: 'Pintu Inti Luar Masih Terkunci',
  npcSpeakerId: 'komandan_surya',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'komandan_surya',
      text: 'Tunggu sebentar, penjelajah muda. Pintu menuju Inti Luar bumi belum bisa dibuka.',
      expression: 'serious',
      nextNodeId: 'explain_locked',
    },
    explain_locked: {
      id: 'explain_locked',
      speakerId: 'komandan_surya',
      text: 'Kamu harus mempelajari dulu materi dari Zahra dan Lintang di bukit tadi yang bertanda kaca pembesar [🔍]. Temui mereka dan pelajari materinya ya!',
      expression: 'thinking',
      choices: [
        {
          id: 'ack',
          text: 'Siap Bu Tyas, saya akan pelajari materi dulu!',
          nextNodeId: 'farewell',
        },
      ],
    },
    farewell: {
      id: 'farewell',
      speakerId: 'komandan_surya',
      text: 'Bagus. Ketelitian adalah kunci ilmuwan. Setelah selesai mempelajari materi mantel bumi, kembalilah ke Ibu!',
      expression: 'normal',
    },
  },
};

export const KOMANDAN_SURYA_READY_DIALOGUE: DialogueTree = {
  id: 'komandan_surya_ready_dialogue',
  title: 'Tantangan Pintu Masuk Inti Luar bersama Bu Tyas',
  npcSpeakerId: 'komandan_surya',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'komandan_surya',
      text: 'Halo penjelajah muda. Saya Bu Tyas, penjaga pintu masuk dan evaluator menuju Inti Luar bumi.',
      expression: 'normal',
      nextNodeId: 'ask_readiness',
    },
    ask_readiness: {
      id: 'ask_readiness',
      speakerId: 'komandan_surya',
      text: 'Apakah kamu sudah memahami konsep konveksi dan karakteristik mantel bumi sebelum Ibu izinkan turun ke Inti Luar?',
      expression: 'thinking',
      choices: [
        {
          id: 'ready_challenge',
          text: 'Sudah paham Bu Tyas, saya siap tantangannya!',
          nextNodeId: 'start_challenge_node',
        },
        {
          id: 'wait_challenge',
          text: 'Sebentar Bu Tyas, saya mau mengingat materinya dulu.',
          nextNodeId: 'standby_node',
        },
      ],
    },
    start_challenge_node: {
      id: 'start_challenge_node',
      speakerId: 'komandan_surya',
      text: 'Bagus sekali! Selesaikan evaluasi tebak kata ilmiah (Wordle) ini dengan benar untuk membuka kunci pintunya!',
      expression: 'happy',
      triggerChallengeGate: true,
    },
    standby_node: {
      id: 'standby_node',
      speakerId: 'komandan_surya',
      text: 'Bagus, teliti itu penting. Kamu bisa membaca lagi materi dari Zahra dan Lintang yang bertanda kaca pembesar [🔍]. Jika sudah yakin, temui Ibu lagi ya!',
      expression: 'normal',
    },
  },
};

export const KOMANDAN_SURYA_UNLOCKED_DIALOGUE: DialogueTree = {
  id: 'komandan_surya_unlocked_dialogue',
  title: 'Instruksi Baju Pelindung Inti Luar',
  npcSpeakerId: 'komandan_surya',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'komandan_surya',
      text: 'Luar biasa! Jawabanmu benar semua, pemahamanmu tentang dinamika mantel bumi terbukti sangat baik!',
      expression: 'happy',
      nextNodeId: 'suit_warning',
    },
    suit_warning: {
      id: 'suit_warning',
      speakerId: 'komandan_surya',
      text: 'Di bawah sana adalah Inti Luar: lautan logam cair membara 5.000°C dengan radiasi dinamo medan magnet dahsyat! Baju lamamu tidak akan sanggup menahannya.',
      expression: 'serious',
      nextNodeId: 'instructions',
    },
    instructions: {
      id: 'instructions',
      speakerId: 'komandan_surya',
      text: 'Tukarkan kristal energimu ke Teknisi Rudi di sebelah kanan Ibu untuk membeli Baju Pelindung Medan Elektromagnetik yang lebih canggih sebelum melompat ke portal!',
      expression: 'normal',
    },
  },
};

// ══════════════════════════════════════════════════════════════════════════
// AREA 4: INTI LUAR (LAUTAN LOGAM CAIR & MEDAN MAGNET BUMI)
// ══════════════════════════════════════════════════════════════════════════

// ── POHON DIALOG: MASKOT RESQY (BRIEFING INTI LUAR) ──
// ── POHON DIALOG: MASKOT RESQY (BRIEFING INTI LUAR) ──
export const MASCOT_OUTER_CORE_INTRO_DIALOGUE: DialogueTree = {
  id: 'mascot_outer_core_intro',
  title: 'Briefing Inti Luar Bersama Resqy',
  npcSpeakerId: 'resqy',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'resqy',
      text: 'Kuk-kuuk! Kita telah tiba di Inti Luar bumi pada kedalaman 2.900 kilometer!',
      expression: 'happy',
      nextNodeId: 'explain_heat',
    },
    explain_heat: {
      id: 'explain_heat',
      speakerId: 'resqy',
      text: 'Suhu di sini sangat panas mencapai 5.000 derajat Celsius! Panas dahsyat ini membuat logam besi dan nikel meleleh menjadi lautan cairan.',
      expression: 'surprised',
      nextNodeId: 'guide_forward',
    },
    guide_forward: {
      id: 'guide_forward',
      speakerId: 'resqy',
      text: 'Pelajari materi dari Zahra dan Lintang yang bertanda kaca pembesar [🔍] ya! Kuk-kuuk!',
      expression: 'normal',
    },
  },
};

// ── POHON DIALOG: MASKOT RESQY (TIPS EVALUASI INTI LUAR) ──
export const MASCOT_OUTER_CORE_GUIDE_DIALOGUE: DialogueTree = {
  id: 'mascot_outer_core_guide',
  title: 'Tips Penjelajah Inti Luar',
  npcSpeakerId: 'resqy',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'resqy',
      text: 'Kuk-kuuk! Tiga hal penting di Inti Luar: 1. Terbuat dari logam besi dan nikel. 2. Wujudnya cair karena suhu sangat panas.',
      expression: 'happy',
      nextNodeId: 'point_three',
    },
    point_three: {
      id: 'point_three',
      speakerId: 'resqy',
      text: '3. Putaran cairan logam ini menciptakan medan magnet sebagai perisai bumi. Pahami materi bertanda [🔍] ini sebelum menghadapi evaluasi Bu Tyas ya!',
      expression: 'thinking',
    },
  },
};

// ── POHON DIALOG: ZIDANE (PEMANDU LAPANGAN INTI LUAR) ──
export const DR_FAJAR_DIALOGUE: DialogueTree = {
  id: 'dr_fajar_dialogue',
  title: 'Pos Pengamatan Inti Luar bersama Zidane',
  npcSpeakerId: 'dr_fajar',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'dr_fajar',
      text: 'Halo penjelajah. Selamat datang di pos pemantauan Inti Luar bumi.',
      expression: 'normal',
      nextNodeId: 'explain_layer',
    },
    explain_layer: {
      id: 'explain_layer',
      speakerId: 'dr_fajar',
      text: 'Setelah melewati mantel bumi, kita kini berada di atas teras pelat logam khusus. Di sekitar kita adalah lautan logam besi dan nikel yang meleleh pada suhu 5.000°C.',
      expression: 'normal',
      choices: [
        {
          id: 'c1',
          text: 'Kenapa logam di sini bisa meleleh menjadi cairan, Zidane?',
          nextNodeId: 'explain_melt',
        },
        {
          id: 'c2',
          text: 'Siapa saja rekan tim yang ada di depan?',
          nextNodeId: 'explain_ahead',
        },
      ],
    },
    explain_melt: {
      id: 'explain_melt',
      speakerId: 'dr_fajar',
      text: 'Karena suhunya mencapai 5.000 derajat Celsius. Suhu dahsyat ini sanggup mencairkan logam sekeras apa pun.',
      expression: 'thinking',
      nextNodeId: 'explain_ahead',
    },
    explain_ahead: {
      id: 'explain_ahead',
      speakerId: 'dr_fajar',
      text: 'Di teras depan ada Zahra yang meneliti lautan logam cair, dan Lintang yang menganalisis medan magnet bumi bertanda kaca pembesar [🔍]. Temui mereka ya.',
      expression: 'happy',
    },
  },
};

// ── POHON DIALOG: ZAHRA (TEMUAN GEOLOGIS 6: LAUTAN LOGAM CAIR) ──
export const PROF_RATNA_DIALOGUE: DialogueTree = {
  id: 'prof_ratna_dialogue',
  title: 'Peneliti Logam Cair Inti Luar bersama Zahra',
  npcSpeakerId: 'prof_ratna',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'prof_ratna',
      text: 'Halo penjelajah ceria! Lihat deh kilauan logam di sekitar sini, indah tapi panas banget ya! Kamu mau tahu bagaimana logam besi dan nikel bisa mencair di sini?',
      expression: 'happy',
      choices: [
        {
          id: 'open_direct',
          text: 'Iya Zahra, aku mau lihat materinya!',
          nextNodeId: 'open_discovery',
          discoveryIdToMark: 'oc_disc1',
        },
        {
          id: 'brief_first',
          text: 'Boleh tolong jelaskan intinya dulu, Zahra?',
          nextNodeId: 'explain_brief',
          discoveryIdToMark: 'oc_disc1',
        },
      ],
    },
    explain_brief: {
      id: 'explain_brief',
      speakerId: 'prof_ratna',
      text: 'Intinya seru banget! Inti luar memiliki tebal sekitar 2.200 kilometer. Logam besi dan nikel di sini mencair dan terus mengalir karena suhu yang luar biasa panas!',
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
          text: 'Buka Materi Lautan Logam Cair [🔍]',
          nextNodeId: 'open_discovery',
          discoveryIdToMark: 'oc_disc1',
        },
      ],
    },
    open_discovery: {
      id: 'open_discovery',
      speakerId: 'prof_ratna',
      text: 'Ini dia materinya! Amati baik-baik ya, sifat cairan logam ini nanti akan ditanyakan Bu Tyas sebelum turun ke inti dalam!',
      expression: 'happy',
      discoveryIdToMark: 'oc_disc1',
      triggerDiscoveryModal: 6,
    },
  },
};

export const PROF_RATNA_REVIEW_DIALOGUE: DialogueTree = {
  id: 'prof_ratna_review_dialogue',
  title: 'Peneliti Logam Cair Inti Luar bersama Zahra',
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
          text: 'Terima kasih Zahra, aku lanjut ke Lintang!',
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

// ── POHON DIALOG: LINTANG (TEMUAN GEOLOGIS 7: MEDAN MAGNET BUMI) ──
export const DR_ARIS_DIALOGUE: DialogueTree = {
  id: 'dr_aris_dialogue',
  title: 'Ahli Medan Magnet Bumi bersama Lintang',
  npcSpeakerId: 'dr_aris',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'dr_aris',
      text: 'Halo! Saya Lintang. Tahukah kamu bahwa perputaran lautan logam cair di sini bekerja bagai dinamo listrik raksasa yang menciptakan medan magnet bumi?',
      expression: 'happy',
      choices: [
        {
          id: 'open_direct',
          text: 'Wah hebat! Buka materi medan magnet bumi, Lintang!',
          nextNodeId: 'open_discovery',
          discoveryIdToMark: 'oc_disc2',
        },
        {
          id: 'brief_first',
          text: 'Boleh tolong jelaskan intinya dulu, Lintang?',
          nextNodeId: 'explain_brief',
          discoveryIdToMark: 'oc_disc2',
        },
      ],
    },
    explain_brief: {
      id: 'explain_brief',
      speakerId: 'dr_aris',
      text: 'Secara geodinamika: bumi kita berotasi, membuat lautan logam cair ikut berputar konvektif. Putaran cairan logam konduktif ini menghasilkan arus listrik yang menciptakan perisai magnet pelindung bumi!',
      expression: 'normal',
      nextNodeId: 'open_prompt',
    },
    open_prompt: {
      id: 'open_prompt',
      speakerId: 'dr_aris',
      text: 'Medan magnet ini sangat penting karena melindungi kehidupan dari radiasi berbahaya badai matahari. Mari kita amati diagramnya!',
      expression: 'happy',
      choices: [
        {
          id: 'open_now',
          text: 'Buka Materi Medan Magnet Bumi [🔍]',
          nextNodeId: 'open_discovery',
          discoveryIdToMark: 'oc_disc2',
        },
      ],
    },
    open_discovery: {
      id: 'open_discovery',
      speakerId: 'dr_aris',
      text: 'Ini dia materinya! Amati baik-baik perisai magnet pelindung bumi kita ya. Pahami konsep ini sebelum evaluasi bersama Bu Tyas!',
      expression: 'happy',
      discoveryIdToMark: 'oc_disc2',
      triggerDiscoveryModal: 7,
    },
  },
};

export const DR_ARIS_REVIEW_DIALOGUE: DialogueTree = {
  id: 'dr_aris_review_dialogue',
  title: 'Ahli Medan Magnet Bumi bersama Lintang',
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
          text: 'Saya sudah paham Lintang, siap ke evaluasi Bu Tyas!',
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

// ── POHON DIALOG: ICAN (PENGAWAS RADIASI MAGNETIK) ──
export const PETUGAS_JOKO_DIALOGUE: DialogueTree = {
  id: 'petugas_joko_dialogue',
  title: 'Pos Pengawas Radiasi Magnetik bersama Ican',
  npcSpeakerId: 'petugas_joko',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'petugas_joko',
      text: 'Waspada dong, jalan pelan-pelan! Kita lagi di stasiun pemantau medan magnet inti luar nih, rambut ikalku sampai kerasa berdiri kena radiasi magnetik haha!',
      expression: 'serious',
      nextNodeId: 'guide_officer',
    },
    guide_officer: {
      id: 'guide_officer',
      speakerId: 'petugas_joko',
      text: 'Di sini kekuatan medan magnetnya dahsyat banget! Di ujung pelat depan sudah ada Bu Tyas yang menjaga pintu poros menuju Inti Dalam bumi.',
      expression: 'normal',
      nextNodeId: 'remind_check',
    },
    remind_check: {
      id: 'remind_check',
      speakerId: 'petugas_joko',
      text: 'Kamu harus menjawab tantangan tebak kata dari Bu Tyas. Semua jawabannya sudah diajarkan oleh Zahra dan Lintang tadi kok!',
      expression: 'happy',
    },
  },
};

// ── POHON DIALOG: BU TYAS (EVALUASI GERBANG INTI DALAM) ──
export const KOMANDAN_TEGUH_LOCKED_DIALOGUE: DialogueTree = {
  id: 'komandan_teguh_locked_dialogue',
  title: 'Pos Evaluasi Pintu Inti Dalam',
  npcSpeakerId: 'komandan_teguh',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'komandan_teguh',
      text: 'Berhenti penjelajah muda. Akses menuju Inti Dalam bumi masih terkunci rapat.',
      expression: 'serious',
      nextNodeId: 'explain_lock',
    },
    explain_lock: {
      id: 'explain_lock',
      speakerId: 'komandan_teguh',
      text: 'Kamu harus mempelajari materi dari Zahra dan Lintang di teras tadi yang bertanda kaca pembesar [🔍]. Temui mereka dan pelajari materinya ya!',
      expression: 'thinking',
    },
  },
};

export const KOMANDAN_TEGUH_READY_DIALOGUE: DialogueTree = {
  id: 'komandan_teguh_ready_dialogue',
  title: 'Evaluasi Pintu Masuk Inti Dalam bersama Bu Tyas',
  npcSpeakerId: 'komandan_teguh',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'komandan_teguh',
      text: 'Halo penjelajah muda. Saya Bu Tyas, pembimbing dan evaluator ekspedisi ini.',
      expression: 'normal',
      nextNodeId: 'challenge_prompt',
    },
    challenge_prompt: {
      id: 'challenge_prompt',
      speakerId: 'komandan_teguh',
      text: 'Apakah kamu sudah memahami sifat dan karakteristik logam cair serta medan magnet inti luar bumi? Selesaikan evaluasi tebak kata ilmiah (Wordle) ini untuk membuka akses ke Inti Dalam!',
      expression: 'thinking',
      choices: [
        {
          id: 'accept_challenge',
          text: 'Sudah paham Bu Tyas, saya siap tantangannya!',
          nextNodeId: 'start_challenge_node',
        },
        {
          id: 'review_materials',
          text: 'Saya mau meninjau materi lagi, Bu Tyas.',
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
      text: 'Sangat bijak. Silakan baca dan pelajari kembali materi dari Zahra dan Lintang yang bertanda kaca pembesar [🔍]. Kalau sudah siap, temui Ibu lagi ya!',
      expression: 'normal',
    },
  },
};

export const KOMANDAN_TEGUH_UNLOCKED_DIALOGUE: DialogueTree = {
  id: 'komandan_teguh_unlocked_dialogue',
  title: 'Instruksi Exo-Suit Inti Dalam',
  npcSpeakerId: 'komandan_teguh',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'komandan_teguh',
      text: 'Luar biasa! Jawabanmu benar semua, pemahamanmu tentang geodinamika inti luar bumi terbukti hebat!',
      expression: 'happy',
      nextNodeId: 'suit_warning',
    },
    suit_warning: {
      id: 'suit_warning',
      speakerId: 'komandan_teguh',
      text: 'Inti Dalam bumi menyimpan suhu 6.000°C sepanas matahari dengan tekanan dahsyat 3,6 juta atmosfer! Kamu memerlukan setelan pelindung berteknologi paling mutakhir.',
      expression: 'serious',
      nextNodeId: 'instructions',
    },
    instructions: {
      id: 'instructions',
      speakerId: 'komandan_teguh',
      text: 'Gunakan kristal energimu untuk membeli Exo-Suit Hiper-Tekanan Adamantine di Teknisi Dian tepat di sebelah kanan Ibu sebelum menuju poros turun!',
      expression: 'normal',
    },
  },
};

// ── POHON DIALOG: MASKOT RESQY (INTI DALAM) ──
// ── POHON DIALOG: MASKOT RESQY (INTI DALAM) ──
export const MASCOT_INNER_CORE_INTRO_DIALOGUE: DialogueTree = {
  id: 'mascot_inner_core_intro',
  title: 'Panduan Masuk Inti Dalam bersama Resqy',
  npcSpeakerId: 'resqy',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'resqy',
      text: 'Kuk-kuuk! Selamat penjelajah hebat! Kita akhirnya tiba di lapisan terdalam: Inti Dalam bumi di kedalaman 5.150 km!',
      expression: 'happy',
      nextNodeId: 'step2',
    },
    step2: {
      id: 'step2',
      speakerId: 'resqy',
      text: 'Suhu di sini mencapai 6.000°C sepanas permukaan matahari! Ayo pelajari materi dari Zahra dan Lintang yang bertanda kaca pembesar [🔍], lalu bersiaplah dievaluasi Bu Tyas di Kapsul Akhir ya! Kuk-kuuk!',
      expression: 'happy',
    },
  },
};

export const MASCOT_INNER_CORE_GUIDE_DIALOGUE: DialogueTree = {
  id: 'mascot_inner_core_guide',
  title: 'Tips Penjelajah Inti Dalam',
  npcSpeakerId: 'resqy',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'resqy',
      text: 'Kuk-kuuk! Inti dalam bumi adalah bola kristal besi padat yang tahan leleh berkat tekanan dahsyat di pusat gravitasi bumi.',
      expression: 'happy',
      nextNodeId: 'step2',
    },
    step2: {
      id: 'step2',
      speakerId: 'resqy',
      text: 'Pahami penjelasan dari Zidane dan Zahra mengenai bola besi padat dan altar pusat gravitasi bumi sebelum Bu Tyas mengujimu di gerbang akhir ya!',
      expression: 'thinking',
    },
  },
};

// ── POHON DIALOG: ZIDANE (PEMANDU GEOFISIKA INTI DALAM) ──
export const DR_BAGUS_DIALOGUE: DialogueTree = {
  id: 'dr_bagus_dialogue',
  title: 'Pos Pengamatan Inti Dalam bersama Zidane',
  npcSpeakerId: 'dr_bagus',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'dr_bagus',
      text: 'Selamat datang penjelajah tangguh. Kamu telah menembus ribuan kilometer hingga tiba di monolit Inti Dalam bumi.',
      expression: 'normal',
      nextNodeId: 'intro2',
    },
    intro2: {
      id: 'intro2',
      speakerId: 'dr_bagus',
      text: 'Di sini kita meneliti bola kristal besi padat bersuhu 6.000°C, dan di altar depan ada Zahra bertanda kaca pembesar [🔍]. Pelajari materinya sebelum Bu Tyas menguji ya.',
      expression: 'normal',
      choices: [
        {
          id: 'c1',
          text: 'Siap Zidane, saya akan mempelajari materi bersama Zahra!',
          nextNodeId: 'farewell',
        },
        {
          id: 'c2',
          text: 'Apakah baju kita aman dari panas sepanas matahari ini?',
          nextNodeId: 'safety_info',
        },
      ],
    },
    safety_info: {
      id: 'safety_info',
      speakerId: 'dr_bagus',
      text: 'Tentu. Baju pelindung cryo-hazard ekspedisi kita dirancang khusus menahan suhu ekstrem dan anomali medan magnet. Maju terus.',
      expression: 'happy',
      nextNodeId: 'farewell',
    },
    farewell: {
      id: 'farewell',
      speakerId: 'dr_bagus',
      text: 'Semoga sukses mengungkap rahasia inti dalam bumi bersama tim!',
      expression: 'happy',
    },
  },
};

// ── POHON DIALOG: ZAHRA (PENELITI KRISTAL BESI - TEMUAN 8) ──
export const PROF_LESTARI_DIALOGUE: DialogueTree = {
  id: 'prof_lestari_dialogue',
  title: 'Penelitian Kristal Besi Inti Dalam bersama Zahra',
  npcSpeakerId: 'prof_lestari',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'prof_lestari',
      text: 'Halo penjelajah ceria! Tahukah kamu bahwa inti dalam bumi ini berbentuk bola besi padat yang suhunya sepanas permukaan matahari?',
      expression: 'normal',
      nextNodeId: 'ask_discovery',
    },
    ask_discovery: {
      id: 'ask_discovery',
      speakerId: 'prof_lestari',
      text: 'Meskipun suhunya mencapai 6.000°C, logam di sini tidak mencair karena adanya tekanan litostatik luar biasa dahsyat! Mau lihat data penelitiannya bersamaku?',
      expression: 'thinking',
      choices: [
        {
          id: 'view_data',
          text: 'Tentu Zahra, aku ingin melihat datanya!',
          nextNodeId: 'show_discovery_node',
        },
        {
          id: 'listen_story',
          text: 'Aku ingin mendengar penjelasannya dulu, Zahra.',
          nextNodeId: 'explain_more',
        },
      ],
    },
    explain_more: {
      id: 'explain_more',
      speakerId: 'prof_lestari',
      text: 'Tekanan seluruh massa bumi mengunci atom besi begitu kuat sehingga tetap berwujud padat dan kokoh. Yuk buka catatan lengkapnya!',
      expression: 'happy',
      choices: [
        {
          id: 'confirm_view',
          text: 'Buka Catatan Bola Besi Padat [🔍]',
          nextNodeId: 'show_discovery_node',
        },
      ],
    },
    show_discovery_node: {
      id: 'show_discovery_node',
      speakerId: 'prof_lestari',
      text: 'Ini dia catatannya! Amati baik-baik bagaimana tekanan dahsyat menjaga bola besi ini tetap padat ya! Nanti bakal ditanya Bu Tyas lho!',
      expression: 'happy',
      triggerDiscoveryModal: 8,
    },
  },
};

export const PROF_LESTARI_REVIEW_DIALOGUE: DialogueTree = {
  id: 'prof_lestari_review_dialogue',
  title: 'Catatan Bola Besi Padat bersama Zahra',
  npcSpeakerId: 'prof_lestari',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'prof_lestari',
      text: 'Halo lagi! Kamu bisa membuka kembali catatan penelitian bola besi padat dan tekanan dahsyat inti dalam kapan saja ya.',
      expression: 'normal',
      choices: [
        {
          id: 'open_again',
          text: 'Buka catatan materi lagi',
          nextNodeId: 'open_node',
        },
        {
          id: 'done',
          text: 'Aku sudah paham Zahra, terima kasih!',
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
      text: 'Bagus sekali! Lanjutkan langkahmu ke altar pusat bumi bersama Lintang ya!',
      expression: 'happy',
    },
  },
};

// ── POHON DIALOG: LINTANG (AHLI GRAVITASI PUSAT BUMI - TEMUAN 9) ──
export const DR_FARHAN_DIALOGUE: DialogueTree = {
  id: 'dr_farhan_dialogue',
  title: 'Pusat Gravitasi Bumi 6.371 KM bersama Lintang',
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
      text: 'Secara fisik, di titik terdalam bumi ini gaya gravitasi saling menarik seimbang dari segala arah sehingga resultan gravitasinya bernilai nol! Mau menganalisis datanya?',
      expression: 'thinking',
      choices: [
        {
          id: 'view_data',
          text: 'Sangat menarik, tolong perlihatkan Lintang!',
          nextNodeId: 'show_discovery_node',
        },
        {
          id: 'listen_more',
          text: 'Bagaimana fenomena titik gravitasi nol bekerja?',
          nextNodeId: 'explain_more',
        },
      ],
    },
    explain_more: {
      id: 'explain_more',
      speakerId: 'dr_farhan',
      text: 'Semua tarikan massa bumi di sekitar kita saling meniadakan tepat di pusat planet ini! Mari kita telaah diagram lengkapnya.',
      expression: 'happy',
      choices: [
        {
          id: 'confirm_view',
          text: 'Buka Data Pusat Gravitasi Nol [🔍]',
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
  title: 'Altar Pusat Bumi 6.371 KM bersama Lintang',
  npcSpeakerId: 'dr_farhan',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'dr_farhan',
      text: 'Altar pusat bumi 6.371 km ini adalah puncak kedalaman ekspedisi kita. Buka kembali datanya jika ingin mengingat konsep titik gravitasi nol ya!',
      expression: 'normal',
      choices: [
        {
          id: 'open_again',
          text: 'Buka data pusat bumi lagi',
          nextNodeId: 'open_node',
        },
        {
          id: 'done',
          text: 'Saya sudah paham Lintang, terima kasih!',
          nextNodeId: 'farewell',
        },
      ],
    },
    open_node: {
      id: 'open_node',
      speakerId: 'dr_farhan',
      text: 'Silakan pelajari kembali konsep pusat bumi dan gravitasi nol ini!',
      expression: 'happy',
      triggerDiscoveryModal: 9,
    },
    farewell: {
      id: 'farewell',
      speakerId: 'dr_farhan',
      text: 'Hebat! Di ujung teras ada Ican dan Bu Tyas yang menjaga kapsul gerbang akhir.',
      expression: 'happy',
    },
  },
};

// ── POHON DIALOG: ICAN (PENGAWAS KAPSUL EVAKUASI) ──
export const PETUGAS_DIAN_DIALOGUE: DialogueTree = {
  id: 'petugas_dian_dialogue',
  title: 'Peringatan Kapsul Akhir bersama Ican',
  npcSpeakerId: 'petugas_dian',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'petugas_dian',
      text: 'Woy penjelajah hebat! Kapsul evakuasi akhir untuk naik menuju zona berikutnya sudah disiapkan di ujung teras depan nih.',
      expression: 'happy',
      nextNodeId: 'guide_commander',
    },
    guide_commander: {
      id: 'guide_commander',
      speakerId: 'petugas_dian',
      text: 'Bu Tyas lagi mengawasi sistem kunci kapsul. Pastikan lu beneran paham materi bola besi padat dan gravitasi nol dari Zahra & Lintang sebelum ngadep beliau ya!',
      expression: 'normal',
      nextNodeId: 'farewell',
    },
    farewell: {
      id: 'farewell',
      speakerId: 'petugas_dian',
      text: 'Semangat deh! Lu tinggal selangkah lagi menuntaskan lapisan interior bumi!',
      expression: 'happy',
    },
  },
};

// ── POHON DIALOG: BU TYAS (EVALUASI MENUJU BATAS DIVERGEN) ──
export const KOMANDAN_BINTANG_LOCKED_DIALOGUE: DialogueTree = {
  id: 'komandan_bintang_locked_dialogue',
  title: 'Akses Batas Divergen Terkunci',
  npcSpeakerId: 'komandan_bintang',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'komandan_bintang',
      text: 'Berhenti penjelajah muda. Akses portal menuju zona tektonik Batas Divergen masih terkunci rapat.',
      expression: 'serious',
      nextNodeId: 'explain_lock',
    },
    explain_lock: {
      id: 'explain_lock',
      speakerId: 'komandan_bintang',
      text: 'Kamu harus mempelajari materi dari Zahra dan Lintang di altar pusat bumi terlebih dahulu yang bertanda kaca pembesar [🔍]. Temui mereka dan pelajari materinya ya!',
      expression: 'thinking',
    },
  },
};

export const KOMANDAN_BINTANG_READY_DIALOGUE: DialogueTree = {
  id: 'komandan_bintang_ready_dialogue',
  title: 'Evaluasi Menuju Batas Divergen bersama Bu Tyas',
  npcSpeakerId: 'komandan_bintang',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'komandan_bintang',
      text: 'Halo penjelajah muda. Saya melihat kamu sudah menuntaskan penelaahan data di altar pusat bumi bersama para peneliti.',
      expression: 'normal',
      nextNodeId: 'challenge_prompt',
    },
    challenge_prompt: {
      id: 'challenge_prompt',
      speakerId: 'komandan_bintang',
      text: 'Apakah kamu sudah memahami karakteristik kristal besi padat dan gravitasi nol inti dalam bumi? Selesaikan evaluasi tebak kata ilmiah (Wordle) ini untuk membuka akses menuju Batas Divergen!',
      expression: 'thinking',
      choices: [
        {
          id: 'accept_challenge',
          text: 'Sudah paham Bu Tyas, saya siap tantangannya!',
          nextNodeId: 'start_challenge_node',
        },
        {
          id: 'review_materials',
          text: 'Saya mau meninjau materinya sebentar, Bu Tyas.',
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
      text: 'Sangat baik. Silakan baca dan pelajari kembali materi dari Zahra dan Lintang yang bertanda kaca pembesar [🔍]. Kalau sudah siap, temui Ibu lagi ya!',
      expression: 'normal',
    },
  },
};

export const KOMANDAN_BINTANG_UNLOCKED_DIALOGUE: DialogueTree = {
  id: 'komandan_bintang_unlocked_dialogue',
  title: 'Instruksi Baju Selam Batas Divergen',
  npcSpeakerId: 'komandan_bintang',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'komandan_bintang',
      text: 'Luar biasa hebat! Seluruh pemahaman mengenai Inti Dalam bumi telah kamu buktikan dengan sempurna!',
      expression: 'happy',
      nextNodeId: 'suit_warning',
    },
    suit_warning: {
      id: 'suit_warning',
      speakerId: 'komandan_bintang',
      text: 'Ekspedisi selanjutnya membawamu menembus dasar palung samudra terdalam di Batas Divergen! Kamu tidak bisa bernapas dan bergerak di bawah air tanpa pakaian selam khusus.',
      expression: 'serious',
      nextNodeId: 'instructions',
    },
    instructions: {
      id: 'instructions',
      speakerId: 'komandan_bintang',
      text: 'Tukarkan kristal energi yang kamu peroleh di inti dalam ini ke Teknisi Arya di sebelah kanan Ibu untuk membeli Baju Penyelam Samudra Kedalaman sebelum memasuki portal!',
      expression: 'normal',
    },
  },
};

// ── POHON DIALOG AREA 6: MASKOT RESQY (BRIEFING BATAS DIVERGEN) ──
// ── POHON DIALOG AREA 6: MASKOT RESQY (BRIEFING BATAS DIVERGEN) ──
export const MASCOT_DIVERGENT_INTRO_DIALOGUE: DialogueTree = {
  id: 'mascot_divergent_intro',
  title: 'Briefing Lembah Retakan Divergen bersama Resqy',
  npcSpeakerId: 'resqy',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'resqy',
      text: 'Kuk-kuuk! Waspada penjelajah! Getaran seismik terdeteksi! Dua lempeng tektonik di depan kita sedang merekah dan saling memisah (Batas Divergen)!',
      expression: 'surprised',
      nextNodeId: 'guide_plate',
    },
    guide_plate: {
      id: 'guide_plate',
      speakerId: 'resqy',
      text: 'Dari rekahan jurang yang menganga, magma cair dari mantel bumi menerobos naik membeku menjadi kerak samudra baru! Tetap di jalur aman ya!',
      expression: 'serious',
      nextNodeId: 'guide_mission',
    },
    guide_mission: {
      id: 'guide_mission',
      speakerId: 'resqy',
      text: 'Petunjuk Penjelajah: Temui Zidane, pelajari bukti Pangea dari Zahra dan pegunungan kembar dari Lintang, lalu bersiaplah dievaluasi Bu Tyas di ujung tebing! Kuk-kuuk!',
      expression: 'happy',
    },
  },
};

export const MASCOT_DIVERGENT_GUIDE_DIALOGUE: DialogueTree = {
  id: 'mascot_divergent_guide',
  title: 'Tips Penjelajah Batas Divergen',
  npcSpeakerId: 'resqy',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'resqy',
      text: 'Kuk-kuuk! Tips Penjelajah: Hati-hati jangan sampai tergelincir ke celah lava di tengah! Gunakan lompatan pendorongmu untuk melompati jurang dengan aman. Pelajari materi bertanda kaca pembesar [🔍] sebelum melapor ke Bu Tyas ya!',
      expression: 'happy',
    },
  },
};

// ── POHON DIALOG: ZIDANE (PEMANDU GEOLOGIS LEMBAH RETAKAN) ──
export const DR_TAUFIK_DIALOGUE: DialogueTree = {
  id: 'dr_taufik_dialogue',
  title: 'Pos Pengamatan Lembah Retakan bersama Zidane',
  npcSpeakerId: 'dr_taufik',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'dr_taufik',
      text: 'Menakjubkan. Kita tiba tepat saat retakan tektonik divergen ini sedang membelah tanah di depan mata kita.',
      expression: 'normal',
      nextNodeId: 'explain_puzzle',
    },
    explain_puzzle: {
      id: 'explain_puzzle',
      speakerId: 'dr_taufik',
      text: 'Perhatikan bagaimana batas rekahan saling cocok seperti potongan puzzle sebelum memisah. Tekanan magma dari mantel mendorong lempeng bergerak saling menjauh.',
      expression: 'normal',
      nextNodeId: 'guide_maya',
    },
    guide_maya: {
      id: 'guide_maya',
      speakerId: 'dr_taufik',
      text: 'Zahra dan Lintang di depan sedang meneliti bukti superbenua Pangea dan rantai pegunungan kembar bertanda kaca pembesar [🔍]. Temui mereka ya.',
      expression: 'happy',
    },
  },
};

// ── POHON DIALOG: ZAHRA (AHLI SUPERBENUA PANGEA - TEMUAN 10) ──
export const PROF_MAYA_DIALOGUE: DialogueTree = {
  id: 'prof_maya_dialogue',
  title: 'Penelitian Superbenua Purba bersama Zahra',
  npcSpeakerId: 'prof_maya',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'prof_maya',
      text: 'Halo penjelajah ceria! Fenomena terbelahnya daratan di depan kita adalah bukti nyata bahwa permukaan bumi selalu bergerak dinamis!',
      expression: 'normal',
      nextNodeId: 'ask_discovery',
    },
    ask_discovery: {
      id: 'ask_discovery',
      speakerId: 'prof_maya',
      text: 'Ratusan juta tahun lalu, seluruh benua pernah menyatu jadi satu daratan super raksasa bernama Pangea! Mau meneliti peta rekonstruksinya bersamaku?',
      expression: 'thinking',
      choices: [
        {
          id: 'view_pangea',
          text: 'Tentu Zahra, aku mau lihat rekonstruksinya!',
          nextNodeId: 'show_discovery_node',
        },
        {
          id: 'listen_more',
          text: 'Bagaimana benua bisa terpecah-pecah, Zahra?',
          nextNodeId: 'explain_more',
        },
      ],
    },
    explain_more: {
      id: 'explain_more',
      speakerId: 'prof_maya',
      text: 'Arus panas konveksi dari interior bumi merobek daratan purba perlahan selama ratusan juta tahun. Yuk kita amati rekonstruksi 4 tahapannya!',
      expression: 'happy',
      choices: [
        {
          id: 'confirm_view',
          text: 'Buka Rekonstruksi Superbenua Pangea [🔍]',
          nextNodeId: 'show_discovery_node',
        },
      ],
    },
    show_discovery_node: {
      id: 'show_discovery_node',
      speakerId: 'prof_maya',
      text: 'Ini dia petanya yang seru! Cermati nama superbenua raksasa ini dan bagaimana potongan benua saling pas seperti puzzle ya!',
      expression: 'happy',
      triggerDiscoveryModal: 10,
    },
  },
};

export const PROF_MAYA_REVIEW_DIALOGUE: DialogueTree = {
  id: 'prof_maya_review_dialogue',
  title: 'Peta Superbenua Purba bersama Zahra',
  npcSpeakerId: 'prof_maya',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'prof_maya',
      text: 'Peta daratan purba membuktikan bahwa benua bumi terus bergerak dinamis. Mau melihat petanya lagi?',
      expression: 'normal',
      choices: [
        {
          id: 'open_again',
          text: 'Buka peta daratan purba lagi',
          nextNodeId: 'open_node',
        },
        {
          id: 'done',
          text: 'Aku sudah paham Zahra, terima kasih!',
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
      text: 'Hebat! Di seberang celah rekahan ada Lintang. Berhati-hatilah saat melompat melewati celah lava ya!',
      expression: 'happy',
    },
  },
};

// ── POHON DIALOG: LINTANG (PENELITI DINAMIKA BATAS DIVERGEN - TEMUAN 11) ──
export const DR_CITRA_DIALOGUE: DialogueTree = {
  id: 'dr_citra_dialogue',
  title: 'Dinamika Batas Divergen bersama Lintang',
  npcSpeakerId: 'dr_citra',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'dr_citra',
      text: 'Hebat! Kamu berhasil melompati rekahan cairan mantel yang menganga itu dengan lincah dan selamat.',
      expression: 'happy',
      nextNodeId: 'ask_discovery',
    },
    ask_discovery: {
      id: 'ask_discovery',
      speakerId: 'dr_citra',
      text: 'Di batas divergen ini, lempeng tektonik bergerak saling memisah dan menjauh. Magma panas naik mengisi celah dan membeku membentuk kerak samudra baru. Mau menelaah simulasinya?',
      expression: 'thinking',
      choices: [
        {
          id: 'view_mountains',
          text: 'Sangat menarik, tolong perlihatkan simulasinya Lintang!',
          nextNodeId: 'show_discovery_node',
        },
        {
          id: 'listen_story',
          text: 'Bagaimana proses pemekaran kerak samudra ini terjadi?',
          nextNodeId: 'explain_more',
        },
      ],
    },
    explain_more: {
      id: 'explain_more',
      speakerId: 'dr_citra',
      text: 'Air laut yang dingin membekukan magma dengan cepat menjadi batuan basal baru, menciptakan punggungan tengah samudra (mid-ocean ridge). Mari kita amati simulasinya!',
      expression: 'happy',
      choices: [
        {
          id: 'confirm_view',
          text: 'Buka Simulator Dinamika Batas Divergen [🔍]',
          nextNodeId: 'show_discovery_node',
        },
      ],
    },
    show_discovery_node: {
      id: 'show_discovery_node',
      speakerId: 'dr_citra',
      text: 'Ini dia simulasinya! Cermati arah pergerakan lempeng yang saling menjauh dan pembentukan batuan kerak baru ya!',
      expression: 'happy',
      triggerDiscoveryModal: 11,
    },
  },
};

export const DR_CITRA_REVIEW_DIALOGUE: DialogueTree = {
  id: 'dr_citra_review_dialogue',
  title: 'Dinamika Batas Divergen bersama Lintang',
  npcSpeakerId: 'dr_citra',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'dr_citra',
      text: 'Pemekaran lempeng divergen terus memperluas dasar samudra secara bertahap. Mau mengamati simulasinya lagi?',
      expression: 'normal',
      choices: [
        {
          id: 'open_again',
          text: 'Buka simulator pemekaran lagi',
          nextNodeId: 'open_node',
        },
        {
          id: 'done',
          text: 'Saya sudah paham Lintang, terima kasih!',
          nextNodeId: 'farewell',
        },
      ],
    },
    open_node: {
      id: 'open_node',
      speakerId: 'dr_citra',
      text: 'Silakan pelajari kembali simulasi pemekaran dasar samudra ini ya!',
      expression: 'happy',
      triggerDiscoveryModal: 11,
    },
    farewell: {
      id: 'farewell',
      speakerId: 'dr_citra',
      text: 'Bagus sekali! Selanjutnya temui Bu Tyas di ujung tebing untuk menyelesaikan evaluasi gerbang ya.',
      expression: 'happy',
    },
  },
};


export const PROF_ILHAM_DIALOGUE: DialogueTree = {
  id: 'prof_ilham_dialogue',
  title: 'Pemekaran Kerak Samudra Baru bersama Ican',
  npcSpeakerId: 'prof_ilham',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'prof_ilham',
      text: 'Lihat celah retakan membara ini! Di batas divergen, lempeng tektonik geraknya saling menjauh alias merekah.',
      expression: 'normal',
      nextNodeId: 'ask_discovery',
    },
    ask_discovery: {
      id: 'ask_discovery',
      speakerId: 'prof_ilham',
      text: 'Magma panas dari mantel bumi terus nyembur naik ngisi celah itu lalu membeku jadi dasar laut baru. Mau liat simulasinya nggak?',
      expression: 'thinking',
      choices: [
        {
          id: 'view_simulation',
          text: 'Boleh Can, mari kita amati simulasinya!',
          nextNodeId: 'show_discovery_node',
        },
        {
          id: 'listen_cooling',
          text: 'Gimana proses pembekuan batuannya, Can?',
          nextNodeId: 'explain_more',
        },
      ],
    },
    explain_more: {
      id: 'explain_more',
      speakerId: 'prof_ilham',
      text: 'Air laut yang dingin membekukan magma dengan cepat jadi batuan basalt dasar samudra. Yuk buka simulasinya!',
      expression: 'happy',
      choices: [
        {
          id: 'confirm_view',
          text: 'Buka Simulator Pemekaran Lempeng [🔍]',
          nextNodeId: 'show_discovery_node',
        },
      ],
    },
    show_discovery_node: {
      id: 'show_discovery_node',
      speakerId: 'prof_ilham',
      text: 'Ini dia simulasinya! Cermati arah panah gerak lempeng dan batuan basal baru ya. Nanti bakal ditanya Bu Tyas lho!',
      expression: 'happy',
      triggerDiscoveryModal: 12,
    },
  },
};

export const PROF_ILHAM_REVIEW_DIALOGUE: DialogueTree = {
  id: 'prof_ilham_review_dialogue',
  title: 'Simulasi Batas Divergen bersama Ican',
  npcSpeakerId: 'prof_ilham',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'prof_ilham',
      text: 'Pemekaran lempeng divergen bikin dasar samudra makin lebar tiap tahun. Mau liat simulasinya lagi?',
      expression: 'normal',
      choices: [
        {
          id: 'open_again',
          text: 'Buka simulasi pemekaran lagi',
          nextNodeId: 'open_node',
        },
        {
          id: 'done',
          text: 'Udah paham Can, makasih!',
          nextNodeId: 'farewell',
        },
      ],
    },
    open_node: {
      id: 'open_node',
      speakerId: 'prof_ilham',
      text: 'Silakan amati kembali animasi lempeng divergen ini ya!',
      expression: 'happy',
      triggerDiscoveryModal: 12,
    },
    farewell: {
      id: 'farewell',
      speakerId: 'prof_ilham',
      text: 'Mantap! Di ujung tebing ada Bu Tyas yang nungguin evaluasi tebak kata Wordle. Jangan grogi ya!',
      expression: 'happy',
    },
  },
};

// ── POHON DIALOG: BU TYAS (EVALUASI GERBANG LEMBAH RETAKAN) ──
export const KOMANDAN_SATRIA_LOCKED_DIALOGUE: DialogueTree = {
  id: 'komandan_satria_locked_dialogue',
  title: 'Gerbang Batas Konvergen Terkunci',
  npcSpeakerId: 'komandan_satria',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'komandan_satria',
      text: 'Berhenti penjelajah muda. Akses lintasan menuju Batas Konvergen masih terkunci rapat.',
      expression: 'serious',
      nextNodeId: 'explain_lock',
    },
    explain_lock: {
      id: 'explain_lock',
      speakerId: 'komandan_satria',
      text: 'Kamu harus mempelajari seluruh materi dari Zahra dan Lintang yang bertanda kaca pembesar [🔍] sebelum Ibu izinkan melintas. Temui mereka dan pelajari materinya ya!',
      expression: 'thinking',
      choices: [
        {
          id: 'ack',
          text: 'Baik Bu Tyas, saya akan pelajari materinya dulu!',
          nextNodeId: 'farewell',
        },
      ],
    },
    farewell: {
      id: 'farewell',
      speakerId: 'komandan_satria',
      text: 'Bagus. Pelajari materinya dengan cermat, lalu kembali ke sini untuk membuktikan pemahamanmu!',
      expression: 'normal',
    },
  },
};

export const KOMANDAN_SATRIA_READY_DIALOGUE: DialogueTree = {
  id: 'komandan_satria_ready_dialogue',
  title: 'Evaluasi Gerbang Lembah Retakan bersama Bu Tyas',
  npcSpeakerId: 'komandan_satria',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'komandan_satria',
      text: 'Halo penjelajah muda. Saya melihat kamu berhasil melintasi celah rekahan dan menuntaskan penelaahan data bersama para peneliti.',
      expression: 'normal',
      nextNodeId: 'challenge_prompt',
    },
    challenge_prompt: {
      id: 'challenge_prompt',
      speakerId: 'komandan_satria',
      text: 'Apakah kamu sudah menguasai seluruh materi batas divergen? Selesaikan evaluasi tebak kata ilmiah (Wordle) ini untuk membuka akses menuju Batas Konvergen!',
      expression: 'thinking',
      choices: [
        {
          id: 'accept_challenge',
          text: 'Sudah paham Bu Tyas, saya siap tantangannya!',
          nextNodeId: 'start_challenge_node',
        },
        {
          id: 'review_materials',
          text: 'Saya mau melihat-lihat materi dulu, Bu Tyas.',
          nextNodeId: 'standby_node',
        },
      ],
    },
    start_challenge_node: {
      id: 'start_challenge_node',
      speakerId: 'komandan_satria',
      text: 'Bagus sekali! Tunjukkan pemahamanmu mengenai batas divergen, superbenua Pangea, dan pemekaran lempeng pada kuis tebak kata berikut!',
      expression: 'happy',
      triggerChallengeGate: true,
    },
    standby_node: {
      id: 'standby_node',
      speakerId: 'komandan_satria',
      text: 'Sangat bijak. Silakan pelajari kembali materi bertanda kaca pembesar [🔍]. Kalau sudah siap, temui Ibu lagi ya!',
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
      text: 'Luar biasa! Pemahamanmu mengenai dinamika batas divergen terbukti sempurna.',
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

// 1. MASKOT RESQY (PANDUAN AWAL AREA 7 - 2 KONDISI: DARATAN & LAUTAN)
export const MASCOT_CONVERGENT_INTRO_DIALOGUE: DialogueTree = {
  id: 'mascot_convergent_intro',
  title: 'Penyambutan Batas Konvergen bersama Resqy',
  npcSpeakerId: 'resqy',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'resqy',
      text: 'Kuk-kuuk! Selamat datang di Batas Konvergen! Berbeda dengan area divergen yang saling memisah, di zona konvergen dua lempeng raksasa bumi saling bertabrakan karena gaya kompresi tektonik yang luar biasa dahsyat!',
      expression: 'happy',
      nextNodeId: 'two_conditions',
    },
    two_conditions: {
      id: 'two_conditions',
      speakerId: 'resqy',
      text: 'Penting untuk diketahui! Batas konvergen memiliki 2 KONDISI UTAMA berdasarkan jenis lempeng yang bertabrakan. Kamu bisa bebas beralih dan mengamati keduanya lewat tombol di bilah atas:\n\n1️⃣ DARATAN (Tumbukan Benua - Benua)\n2️⃣ LAUTAN & PANTAI (Subduksi Samudra - Benua)',
      expression: 'thinking',
      choices: [
        {
          id: 'choose_land',
          text: 'Jelaskan kondisi Daratan (Tumbukan Benua)!',
          nextNodeId: 'explain_land',
        },
        {
          id: 'choose_ocean',
          text: 'Jelaskan kondisi Lautan & Pantai (Subduksi Samudra)!',
          nextNodeId: 'explain_ocean',
        },
        {
          id: 'choose_both',
          text: 'Bagaimana cara menjelajahi area ini, Resqy?',
          nextNodeId: 'explain_nav',
        },
      ],
    },
    explain_land: {
      id: 'explain_land',
      speakerId: 'resqy',
      text: '🏔️ Kondisi Daratan (Tumbukan Benua - Benua): Dua lempeng benua yang sama-sama tebal saling bertabrakan! Kerak benua tertekan hebat dan terlipat ke atas membentuk jajaran pegunungan lipatan raksasa (seperti Pegunungan Himalaya) tanpa adanya palung laut!',
      expression: 'happy',
      choices: [
        {
          id: 'to_ocean',
          text: 'Lalu bagaimana dengan kondisi Lautan & Pantai?',
          nextNodeId: 'explain_ocean',
        },
        {
          id: 'ready_go',
          text: 'Paham! Bagaimana langkah penjelajahannya?',
          nextNodeId: 'explain_nav',
        },
      ],
    },
    explain_ocean: {
      id: 'explain_ocean',
      speakerId: 'resqy',
      text: '🌊 Kondisi Lautan & Pantai (Subduksi Samudra - Benua): Lempeng samudra yang padat dan berat menunjam ke bawah lempeng benua (subduksi)! Membentuk Palung Laut Dalam di perairan dan jajaran busur gunung api di pesisir. Di kondisi ini kamu akan menaiki perahu riset!',
      expression: 'thinking',
      choices: [
        {
          id: 'to_land',
          text: 'Bagaimana dengan kondisi Daratan?',
          nextNodeId: 'explain_land',
        },
        {
          id: 'ready_go_ocean',
          text: 'Paham! Bagaimana langkah penjelajahannya?',
          nextNodeId: 'explain_nav',
        },
      ],
    },
    explain_nav: {
      id: 'explain_nav',
      speakerId: 'resqy',
      text: 'Kuk-kuuk! Jika di mode Daratan, kamu berjalan kaki menjelajahi batuan terlipat. Jika di mode Lautan, kemudikan perahu ke kanan melintasi palung hingga merapat di dermaga pantai! Temui Zidane dan Zahra bertanda [🔍] sebelum menuju Bu Tyas di altar gerbang ya!',
      expression: 'happy',
    },
  },
};

// 1B. PANDUAN SPESIFIK MODE DARATAN (TUMBUKAN BENUA)
export const MASCOT_CONVERGENT_LAND_DIALOGUE: DialogueTree = {
  id: 'mascot_convergent_intro_land',
  title: 'Batas Konvergen: Kondisi Daratan (Tumbukan Benua)',
  npcSpeakerId: 'resqy',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'resqy',
      text: 'Kuk-kuuk! Selamat datang di Batas Konvergen! Di zona ini lempeng-lempeng bumi bergerak saling mendekat dan bertabrakan karena gaya kompresi tektonik!',
      expression: 'happy',
      nextNodeId: 'two_conditions',
    },
    two_conditions: {
      id: 'two_conditions',
      speakerId: 'resqy',
      text: 'Perlu diingat, batas konvergen memiliki 2 kondisi: Daratan (Tumbukan Benua) dan Lautan (Subduksi Samudra). Kamu bisa menggantinya kapan saja lewat tombol di bilah atas!',
      expression: 'thinking',
      nextNodeId: 'active_land_focus',
    },
    active_land_focus: {
      id: 'active_land_focus',
      speakerId: 'resqy',
      text: 'Saat ini kamu berada di mode DARATAN (TUMBUKAN BENUA)! Dua kerak benua saling menekan hingga batuannya terlipat dan terangkat ke atas membentuk jajaran pegunungan megah tanpa adanya palung laut!',
      expression: 'happy',
      nextNodeId: 'land_nav',
    },
    land_nav: {
      id: 'land_nav',
      speakerId: 'resqy',
      text: 'Berjalanlah ke kanan melintasi batuan terlipat menuju lereng pegunungan. Temui Zidane dan Zahra bertanda [🔍] untuk mengumpulkan data geologis sebelum melapor ke Bu Tyas di altar gerbang! Jangan lupa coba juga tombol LAUTAN di atas ya! Kuk-kuuk!',
      expression: 'happy',
    },
  },
};

// 1C. PANDUAN SPESIFIK MODE LAUTAN & PANTAI (SUBDUKSI SAMUDRA)
export const MASCOT_CONVERGENT_OCEAN_DIALOGUE: DialogueTree = {
  id: 'mascot_convergent_intro_ocean',
  title: 'Batas Konvergen: Kondisi Lautan (Palung Samudra)',
  npcSpeakerId: 'resqy',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'resqy',
      text: 'Kuk-kuuk! Selamat datang di Batas Konvergen Kondisi Lautan & Pantai! Di sini lempeng samudra bertemu dan bertabrakan dengan lempeng benua!',
      expression: 'happy',
      nextNodeId: 'two_conditions',
    },
    two_conditions: {
      id: 'two_conditions',
      speakerId: 'resqy',
      text: 'Batas konvergen memiliki 2 kondisi: Lautan (Subduksi Samudra) dan Daratan (Tumbukan Benua). Kamu bisa beralih kondisi lewat tombol di bilah atas kapan saja!',
      expression: 'thinking',
      nextNodeId: 'active_ocean_focus',
    },
    active_ocean_focus: {
      id: 'active_ocean_focus',
      speakerId: 'resqy',
      text: 'Saat ini kamu berada di mode LAUTAN & PANTAI (PALUNG SAMUDRA)! Kita menaiki perahu riset di atas perairan Kerak Samudra. Lempeng samudra yang padat menunjam ke bawah lempeng benua (subduksi), membentuk Palung Laut Dalam!',
      expression: 'thinking',
      nextNodeId: 'ocean_nav',
    },
    ocean_nav: {
      id: 'ocean_nav',
      speakerId: 'resqy',
      text: 'Kemudikan perahu ke kanan melintasi palung hingga merapat di dermaga pantai, lalu temui Zidane dan Zahra bertanda [🔍] untuk meneliti data subduksi serta bentang alam! Kamu juga bisa kembali ke mode Daratan lewat tombol di atas! Kuk-kuuk!',
      expression: 'happy',
    },
  },
};

export const MASCOT_CONVERGENT_GUIDE_LAND_DIALOGUE: DialogueTree = {
  id: 'mascot_convergent_guide_land',
  title: 'Petunjuk Penjelajahan Daratan Konvergen',
  npcSpeakerId: 'resqy',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'resqy',
      text: 'Kuk-kuuk! Petunjuk mode Daratan (Tumbukan Benua): Jelajahi daratan batuan yang terlipat ke arah kanan dengan berjalan kaki.',
      expression: 'thinking',
      nextNodeId: 'guide_2',
    },
    guide_2: {
      id: 'guide_2',
      speakerId: 'resqy',
      text: 'Temui Zidane dan Zahra bertanda [🔍] di daratan untuk menelaah data kompresi lempeng serta bentang alam, lalu lapor ke Bu Tyas di altar batu. Kamu juga bisa mengamati kondisi Lautan & Palung lewat tombol di atas!',
      expression: 'happy',
    },
  },
};

export const MASCOT_CONVERGENT_GUIDE_OCEAN_DIALOGUE: DialogueTree = {
  id: 'mascot_convergent_guide_ocean',
  title: 'Petunjuk Penjelajahan Lautan Konvergen',
  npcSpeakerId: 'resqy',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'resqy',
      text: 'Kuk-kuuk! Petunjuk mode Lautan & Pantai: Kemudikan perahu riset ke kanan melintasi perairan palung laut dalam hingga merapat di dermaga pantai lempeng benua.',
      expression: 'thinking',
      nextNodeId: 'guide_2',
    },
    guide_2: {
      id: 'guide_2',
      speakerId: 'resqy',
      text: 'Dari dermaga pantai, seberangi jembatan batu untuk menemui Zidane dan Zahra bertanda [🔍] guna menelaah data subduksi samudra, sebelum melapor ke Bu Tyas di ujung altar!',
      expression: 'happy',
    },
  },
};

export const MASCOT_CONVERGENT_GUIDE_DIALOGUE: DialogueTree = MASCOT_CONVERGENT_GUIDE_LAND_DIALOGUE;

// ZIDANE DALAM MODE DARATAN (TUMBUKAN BENUA)
export const DR_FARHAN_CONV_LAND_DIALOGUE: DialogueTree = {
  id: 'dr_farhan_conv_land_dialogue',
  title: 'Stasiun Riset Tumbukan Benua bersama Zidane',
  npcSpeakerId: 'zidane',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'zidane',
      text: 'Selamat datang di stasiun observasi batas konvergen daratan! Di belakangmu adalah zona tumbukan dua lempeng benua yang saling bertabrakan.',
      expression: 'normal',
      nextNodeId: 'land_desc',
    },
    land_desc: {
      id: 'land_desc',
      speakerId: 'zidane',
      text: 'Karena kedua lempeng benua memiliki massa jenis yang relatif seimbang dan ringan, tidak ada lempeng yang menunjam ke mantel bumi. Gaya kompresi raksasa ini melipat batuan kerak bumi menjadi pegunungan tinggi!',
      expression: 'normal',
      choices: [
        {
          id: 'learn_subduction',
          text: 'Bagaimana perbandingan tumbukan benua dan subduksi samudra, Zidane?',
          nextNodeId: 'open_subduction_modal',
        },
      ],
    },
    open_subduction_modal: {
      id: 'open_subduction_modal',
      speakerId: 'zidane',
      text: 'Mari kita telaah visual diagram perbandingan dinamika lempeng konvergen dan subduksi pada instrumen riset ini!',
      expression: 'happy',
      discoveryIdToMark: 'conv_disc1',
      triggerDiscoveryModal: 13,
    },
  },
};

// 2. ZIDANE: AHLI OSEANOGRAFI & SUBDUKSI LEMPENG SAMUDRA (TEMUAN 13)
export const DR_FARHAN_CONV_DIALOGUE: DialogueTree = {
  id: 'dr_farhan_dialogue',
  title: 'Stasiun Riset Oseanografi Pesisir bersama Zidane',
  npcSpeakerId: 'zidane',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'zidane',
      text: 'Selamat mendarat di pesisir Kerak Benua. Di belakangmu adalah garis pertemuan lempeng samudra yang menunjam ke bawah daratan kita.',
      expression: 'normal',
      nextNodeId: 'subduct_desc',
    },
    subduct_desc: {
      id: 'subduct_desc',
      speakerId: 'zidane',
      text: 'Lempeng samudra memiliki densitas lebih padat dan berat. Saat menumbuk lempeng benua, lempeng samudra menyusup masuk menunjam ke kedalaman mantel bumi (zona subduksi).',
      expression: 'normal',
      choices: [
        {
          id: 'learn_subduction',
          text: 'Bagaimana proses penunjaman dan peleburan batuannya, Zidane?',
          nextNodeId: 'open_subduction_modal',
        },
      ],
    },
    open_subduction_modal: {
      id: 'open_subduction_modal',
      speakerId: 'zidane',
      text: 'Mari kita teliti visual penampang 3D subduksi lempeng samudra dan peleburan mantel pada diagram instrumen ini!',
      expression: 'happy',
      discoveryIdToMark: 'conv_disc1',
      triggerDiscoveryModal: 13,
    },
  },
};

export const DR_FARHAN_CONV_REVIEW_DIALOGUE: DialogueTree = {
  id: 'dr_farhan_conv_review_dialogue',
  title: 'Tinjauan Data Subduksi Lempeng bersama Zidane',
  npcSpeakerId: 'zidane',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'zidane',
      text: 'Kerak samudra yang padat terus menunjam ke mantel bumi dan melebur. Lanjutkan penjelajahanmu mendaki lereng untuk menemui Zahra ya.',
      expression: 'normal',
      choices: [
        {
          id: 'reopen_modal',
          text: 'Saya ingin mengamati kembali penampang subduksi.',
          nextNodeId: 'reopen_subduction_node',
        },
        {
          id: 'continue_journey',
          text: 'Terima kasih Zidane, saya akan mendaki ke bukit!',
          nextNodeId: 'closing_node',
        },
      ],
    },
    reopen_subduction_node: {
      id: 'reopen_subduction_node',
      speakerId: 'zidane',
      text: 'Tentu, silakan amati kembali diagram subduksi lempeng.',
      expression: 'happy',
      triggerDiscoveryModal: 13,
    },
    closing_node: {
      id: 'closing_node',
      speakerId: 'zidane',
      text: 'Semoga sukses. Hati-hati saat melintasi lereng batuan andesit terlipat di depan.',
      expression: 'normal',
    },
  },
};

// 3. ZAHRA: AHLI VULKANOLOGI & BENTANG ALAM KONVERGEN (TEMUAN 14)
export const PROF_RATNA_CONV_DIALOGUE: DialogueTree = {
  id: 'prof_ratna_dialogue',
  title: 'Pos Pengamatan Morfologi Vulkanik bersama Zahra',
  npcSpeakerId: 'zahra',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'zahra',
      text: 'Selamat datang di lereng pegunungan lipatan! Tumbukan lempeng konvergen melepaskan tenaga kompresi tektonik yang luar biasa dahsyat!',
      expression: 'normal',
      nextNodeId: 'landforms_desc',
    },
    landforms_desc: {
      id: 'landforms_desc',
      speakerId: 'zahra',
      text: 'Tumbukan ini melahirkan 3 bentang alam megah di bumi: palung laut dalam, pegunungan lipatan, dan busur gunung berapi aktif!',
      expression: 'happy',
      choices: [
        {
          id: 'learn_landforms',
          text: 'Bisa jelaskan detail ketiga bentang alam tersebut, Zahra?',
          nextNodeId: 'open_landforms_modal',
        },
      ],
    },
    open_landforms_modal: {
      id: 'open_landforms_modal',
      speakerId: 'zahra',
      text: 'Bagus banget rasa ingin tahumu! Buka modul observasi ini untuk mempelajari palung samudra, pegunungan lipatan, dan busur gunung api ya!',
      expression: 'happy',
      discoveryIdToMark: 'conv_disc2',
      triggerDiscoveryModal: 14,
    },
  },
};

export const PROF_RATNA_CONV_REVIEW_DIALOGUE: DialogueTree = {
  id: 'prof_ratna_conv_review_dialogue',
  title: 'Tinjauan 3 Bentang Alam Konvergen bersama Zahra',
  npcSpeakerId: 'zahra',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'zahra',
      text: 'Kepulauan Indonesia adalah bukti nyata keajaiban konvergen, memiliki palung laut abisal sekaligus jajaran gunung api aktif megah!',
      expression: 'normal',
      choices: [
        {
          id: 'reopen_modal',
          text: 'Saya ingin mempelajari kembali ketiga bentang alam.',
          nextNodeId: 'reopen_landforms_node',
        },
        {
          id: 'continue_climb',
          text: 'Aku mengerti Zahra, aku akan menuju altar!',
          nextNodeId: 'closing_node',
        },
      ],
    },
    reopen_landforms_node: {
      id: 'reopen_landforms_node',
      speakerId: 'zahra',
      text: 'Silakan pelajari kembali modul 3 bentang alam geologis ya!',
      expression: 'happy',
      triggerDiscoveryModal: 14,
    },
    closing_node: {
      id: 'closing_node',
      speakerId: 'zahra',
      text: 'Lanjutkan perjalananmu menuju altar timur. Bu Tyas sedang menunggu laporan hasil kajianmu!',
      expression: 'happy',
    },
  },
};

// 4. ICAN: PENELITI LABORATORIUM VULKANIK & DAPUR MAGMA INTERNAL
export const DR_BAYU_CONV_DIALOGUE: DialogueTree = {
  id: 'dr_bayu_conv_dialogue',
  title: 'Laboratorium Pemantau Rongga Magma bersama Ican',
  npcSpeakerId: 'ican',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'ican',
      text: 'Halo penjelajah! Lu lagi ada di pos pengamatan penampang dalam gunung berapi nih.',
      expression: 'normal',
      nextNodeId: 'magma_chamber_desc',
    },
    magma_chamber_desc: {
      id: 'magma_chamber_desc',
      speakerId: 'ican',
      text: 'Liat penampang di samping: lelehan batuan lempeng menunjam yang melebur di mantel bumi naik dan ngumpul di dapur magma internal ini.',
      expression: 'thinking',
      nextNodeId: 'magma_safe',
    },
    magma_safe: {
      id: 'magma_safe',
      speakerId: 'ican',
      text: 'Dapur magma ini terlindung kokoh di dalam tubuh batuan andesit gunung. Di ujung altar ada Bu Tyas yang siap menguji pemahaman konvergen lu. Jangan grogi ya!',
      expression: 'happy',
    },
  },
};

// 5. BU TYAS: EVALUATOR ALTAR BATAS KONVERGEN
export const KOMANDAN_ARYA_LOCKED_DIALOGUE: DialogueTree = {
  id: 'komandan_arya_locked_dialogue',
  title: 'Pos Altar Konvergen Terkunci',
  npcSpeakerId: 'komandan_arya',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'komandan_arya',
      text: 'Berhenti penjelajah muda. Akses gerbang menuju Batas Transform di depan masih terkunci rapat.',
      expression: 'serious',
      nextNodeId: 'locked_guidance',
    },
    locked_guidance: {
      id: 'locked_guidance',
      speakerId: 'komandan_arya',
      text: 'Kamu harus menelaah data subduksi bersama Zidane di pesisir dan menguasai materi 3 bentang alam bersama Zahra di lereng gunung terlebih dahulu yang bertanda kaca pembesar [🔍]!',
      expression: 'thinking',
    },
  },
};

export const KOMANDAN_ARYA_READY_DIALOGUE: DialogueTree = {
  id: 'komandan_arya_ready_dialogue',
  title: 'Evaluasi Altar Batas Konvergen bersama Bu Tyas',
  npcSpeakerId: 'komandan_arya',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'komandan_arya',
      text: 'Halo penjelajah muda. Saya menerima konfirmasi bahwa kamu telah mempelajari seluruh materi batas konvergen bersama para peneliti.',
      expression: 'normal',
      nextNodeId: 'challenge_prompt',
    },
    challenge_prompt: {
      id: 'challenge_prompt',
      speakerId: 'komandan_arya',
      text: 'Apakah kamu siap menyelesaikan evaluasi tebak kata ilmiah (Wordle) geologi konvergen untuk mengaktifkan portal akses berikutnya?',
      expression: 'thinking',
      choices: [
        {
          id: 'accept_challenge',
          text: 'Saya sudah siap Bu Tyas, mari mulai evaluasinya!',
          nextNodeId: 'start_challenge_node',
        },
        {
          id: 'review_again',
          text: 'Saya ingin mempelajari materi sebentar lagi, Bu Tyas.',
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
      text: 'Sangat baik. Silakan tinjau kembali data bertanda kaca pembesar [🔍]. Jika kamu sudah merasa yakin, temui Ibu lagi di altar ini!',
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
      text: 'Luar biasa! Pemahamanmu mengenai dinamika batas konvergen dan subduksi terbukti sempurna.',
      expression: 'happy',
      nextNodeId: 'farewell',
    },
    farewell: {
      id: 'farewell',
      speakerId: 'komandan_arya',
      text: 'Altar batas konvergen telah aktif sepenuhnya. Silakan bersiap meluncur ke zona tektonik terakhir: Batas Transform!',
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
  title: 'Selamat Datang di Batas Transform bersama Resqy',
  npcSpeakerId: 'resqy',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'resqy',
      text: 'Kuk-kuuk! Selamat datang di Batas Transform, zona pamungkas ekspedisi Earth Dive kita!',
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
      text: 'Gunakan tombol W, A, S, D atau tombol Panah untuk bergerak bebas ke 4 arah. Temui Zahra yang bertanda kaca pembesar [🔍], Ican, dan bersiaplah dievaluasi Bu Tyas di kapsul akhir! Kuk-kuuk!',
      expression: 'happy',
    },
  },
};

export const MASCOT_TRANSFORM_GUIDE_DIALOGUE: DialogueTree = {
  id: 'mascot_transform_guide',
  title: 'Panduan Lapangan Batas Transform',
  npcSpeakerId: 'resqy',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'resqy',
      text: 'Kuk-kuuk! Perhatikan garis patahan di tengah gurun! Lempeng Pasifik di utara bergeser ke kiri, sedangkan Lempeng Amerika Utara di selatan bergeser ke kanan.',
      expression: 'thinking',
      nextNodeId: 'guide_steps',
    },
    guide_steps: {
      id: 'guide_steps',
      speakerId: 'resqy',
      text: 'Pelajari materi dan peta Sesar San Andreas dari Zahra yang bertanda [🔍] sebelum menghadapi evaluasi pamungkas bersama Bu Tyas ya!',
      expression: 'happy',
    },
  },
};

// 2. ICAN: PENGANTAR MEKANISME SESAR MENDATAR
export const DR_MAYA_TRANS_DIALOGUE: DialogueTree = {
  id: 'dr_maya_trans_dialogue',
  title: 'Pos Riset Batas Transform bersama Ican',
  npcSpeakerId: 'ican',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'ican',
      text: 'Woy penjelajah! Selamat tiba di pos pemantauan geologi Sesar San Andreas, California!',
      expression: 'happy',
      nextNodeId: 'explain_transform',
    },
    explain_transform: {
      id: 'explain_transform',
      speakerId: 'ican',
      text: 'Batas transform itu batas antar-lempeng di mana dua lempeng saling bergesekan mendatar dengan arah berlawanan.',
      expression: 'normal',
      nextNodeId: 'explain_conservative',
    },
    explain_conservative: {
      id: 'explain_conservative',
      speakerId: 'ican',
      text: 'Sifatnya konservatif, artinya nggak bikin kerak baru dan nggak ngancurin kerak lama. Jelajahi jalur gurun ke arah timur ya, Zahra sudah nungguin!',
      expression: 'happy',
    },
  },
};

// 3. ZIDANE: PENGAMATAN SEISMOGRAF & PERGESERAN LEMPENG (DISCOVERY 15)
export const PROF_SARAH_TRANS_DIALOGUE: DialogueTree = {
  id: 'prof_sarah_trans_dialogue',
  title: 'Pos Pengamatan Seismik bersama Zidane',
  npcSpeakerId: 'zidane',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'zidane',
      text: 'Perhatikan sekelilingmu. Jalur aspal dan alur sungai gurun ini terpotong dan bergeser akibat pergerakan mendatar lempeng tektonik.',
      expression: 'normal',
      nextNodeId: 'explain_seismo',
    },
    explain_seismo: {
      id: 'explain_seismo',
      speakerId: 'zidane',
      text: 'Kami memasang jaringan sensor seismik presisi untuk mencatat getaran gempa dan mengukur pergeseran lempeng sekitar 5 sentimeter per tahun.',
      expression: 'normal',
      nextNodeId: 'ask_modal',
    },
    ask_modal: {
      id: 'ask_modal',
      speakerId: 'zidane',
      text: 'Apakah kamu ingin membuka lembar observasi seismograf dan dinamika pergerakan lempeng transform ini?',
      expression: 'normal',
      choices: [
        {
          id: 'open_seismo_modal',
          text: 'Ya, buka lembar observasi seismograf [🔍]',
          nextNodeId: 'open_seismo_node',
        },
        {
          id: 'later_seismo',
          text: 'Nanti saja Zidane, saya ingin menjelajahi gurun dulu.',
          nextNodeId: 'later_seismo_node',
        },
      ],
    },
    open_seismo_node: {
      id: 'open_seismo_node',
      speakerId: 'zidane',
      text: 'Bagus. Cermati grafik gelombang gempa dan mekanisme pergeseran mendatarnya dengan teliti.',
      expression: 'happy',
      triggerDiscoveryModal: 15,
      discoveryIdToMark: 'trans_seismo',
    },
    later_seismo_node: {
      id: 'later_seismo_node',
      speakerId: 'zidane',
      text: 'Tentu. Amati retakan tanah di sekitarmu terlebih dahulu. Temui saya kembali jika sudah siap.',
      expression: 'normal',
    },
  },
};

export const PROF_SARAH_TRANS_REVIEW_DIALOGUE: DialogueTree = {
  id: 'prof_sarah_trans_review_dialogue',
  title: 'Tinjau Lembar Seismograf bersama Zidane',
  npcSpeakerId: 'zidane',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'zidane',
      text: 'Data seismograf sudah tersimpan di sistemmu. Apakah kamu ingin meninjau kembali lembar materi ini?',
      expression: 'normal',
      choices: [
        {
          id: 'review_seismo',
          text: 'Ya, buka kembali lembar materi seismograf!',
          nextNodeId: 'review_seismo_node',
        },
        {
          id: 'close_seismo',
          text: 'Data saya sudah cukup, terima kasih Zidane.',
          nextNodeId: 'close_seismo_node',
        },
      ],
    },
    review_seismo_node: {
      id: 'review_seismo_node',
      speakerId: 'zidane',
      text: 'Silakan pelajari kembali catatannya.',
      expression: 'happy',
      triggerDiscoveryModal: 15,
    },
    close_seismo_node: {
      id: 'close_seismo_node',
      speakerId: 'zidane',
      text: 'Semangat melanjutkan observasi lapangan ke arah Zahra.',
      expression: 'happy',
    },
  },
};

// 4. ZAHRA: SESAR SAN ANDREAS & WALLACE CREEK (DISCOVERY 16)
export const DR_TAUFIK_TRANS_DIALOGUE: DialogueTree = {
  id: 'dr_taufik_trans_dialogue',
  title: 'Pusat Analisis Sesar San Andreas bersama Zahra',
  npcSpeakerId: 'zahra',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'zahra',
      text: 'Halo penjelajah ceria! Tepat di tempat kita berdiri membentang Sesar San Andreas sepanjang lebih dari 1.200 kilometer lho!',
      expression: 'happy',
      nextNodeId: 'explain_strike_slip',
    },
    explain_strike_slip: {
      id: 'explain_strike_slip',
      speakerId: 'zahra',
      text: 'Di sini, pergeseran lempeng sering terkunci oleh gaya gesek batuan. Saat kuncian terlepas tiba-tiba, energi elastis dilepaskan sebagai gempa bumi dangkal yang dahsyat!',
      expression: 'serious',
      nextNodeId: 'ask_modal',
    },
    ask_modal: {
      id: 'ask_modal',
      speakerId: 'zahra',
      text: 'Maukah kamu membuka peta komprehensif Sesar San Andreas dan fenomena Wallace Creek bersamaku?',
      expression: 'happy',
      choices: [
        {
          id: 'open_fault_modal',
          text: 'Ya, buka peta komprehensif Sesar San Andreas [🔍]',
          nextNodeId: 'open_fault_node',
          discoveryIdToMark: 'trans_sanandreas',
        },
        {
          id: 'later_fault',
          text: 'Sebentar lagi Zahra, aku mau berkeliling dulu.',
          nextNodeId: 'later_fault_node',
        },
      ],
    },
    open_fault_node: {
      id: 'open_fault_node',
      speakerId: 'zahra',
      text: 'Hebat! Pelajari alur sungai Wallace Creek yang terpotong dan dua lempeng raksasa yang saling berpapasan ya! Nanti bakal ditanya Bu Tyas!',
      expression: 'happy',
      triggerDiscoveryModal: 16,
      discoveryIdToMark: 'trans_sanandreas',
    },
    later_fault_node: {
      id: 'later_fault_node',
      speakerId: 'zahra',
      text: 'Baik, berhati-hatilah melangkah di dekat zona rekahan tanah. Datanglah lagi kapan saja ya!',
      expression: 'normal',
    },
  },
};

export const DR_TAUFIK_TRANS_REVIEW_DIALOGUE: DialogueTree = {
  id: 'dr_taufik_trans_review_dialogue',
  title: 'Tinjau Peta Sesar San Andreas bersama Zahra',
  npcSpeakerId: 'zahra',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'zahra',
      text: 'Catatan Sesar San Andreas sudah tersimpan rapi. Mau memeriksa petanya lagi?',
      expression: 'happy',
      choices: [
        {
          id: 'review_fault',
          text: 'Buka kembali peta Sesar San Andreas!',
          nextNodeId: 'review_fault_node',
        },
        {
          id: 'close_fault',
          text: 'Sudah cukup jelas, terima kasih Zahra.',
          nextNodeId: 'close_fault_node',
        },
      ],
    },
    review_fault_node: {
      id: 'review_fault_node',
      speakerId: 'zahra',
      text: 'Silakan, perhatikan kembali arah pergerakan kedua lempeng tektonik ya!',
      expression: 'happy',
      triggerDiscoveryModal: 16,
    },
    close_fault_node: {
      id: 'close_fault_node',
      speakerId: 'zahra',
      text: 'Luar biasa, lanjutkan langkahmu menemui Lintang dan Bu Tyas di gerbang akhir!',
      expression: 'happy',
    },
  },
};

// 5. LINTANG: KEAMANAN ZONA PATAHAN
export const PETUGAS_RUDI_TRANS_DIALOGUE: DialogueTree = {
  id: 'petugas_rudi_trans_dialogue',
  title: 'Pos Analisis Keselamatan Patahan bersama Lintang',
  npcSpeakerId: 'lintang',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'lintang',
      text: 'Salam! Kondisi seismik stabil. Garis sesar di tengah sedang mengalami akumulasi tegangan tektonik kontinu.',
      expression: 'normal',
      nextNodeId: 'safety_tip',
    },
    safety_tip: {
      id: 'safety_tip',
      speakerId: 'lintang',
      text: 'Pastikan kamu sudah mempelajari analisis patahan dari Zahra yang bertanda [🔍] sebelum menghadap Bu Tyas di ujung gerbang akhir!',
      expression: 'happy',
    },
  },
};

// 6. BU TYAS: EVALUASI AKHIR SEKTOR SESAR SAN ANDREAS
export const KOMANDAN_GUNTUR_LOCKED_DIALOGUE: DialogueTree = {
  id: 'komandan_guntur_locked_dialogue',
  title: 'Pos Evaluasi Sektor Patahan',
  npcSpeakerId: 'komandan_guntur',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'komandan_guntur',
      text: 'Berhenti penjelajah muda. Gerbang evaluasi seismik terakhir belum dapat diaktifkan.',
      expression: 'serious',
      nextNodeId: 'locked_guidance',
    },
    locked_guidance: {
      id: 'locked_guidance',
      speakerId: 'komandan_guntur',
      text: 'Kamu harus menguasai data batas transform dan patahan mendatar San Andreas bersama Zahra yang bertanda kaca pembesar [🔍] terlebih dahulu!',
      expression: 'thinking',
      choices: [
        {
          id: 'read_fault_direct',
          text: 'Buka materi Batas Transform & Patahan San Andreas',
          nextNodeId: 'open_fault_node',
        },
        {
          id: 'explore_desert',
          text: 'Baik Bu Tyas, saya akan berkeliling mencari data di gurun.',
          nextNodeId: 'standby_locked',
        },
      ],
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
      text: 'Temui kembali Ibu jika catatan ilmiahmu sudah lengkap!',
      expression: 'normal',
    },
  },
};

export const KOMANDAN_GUNTUR_READY_DIALOGUE: DialogueTree = {
  id: 'komandan_guntur_ready_dialogue',
  title: 'Evaluasi Akhir Level 1 bersama Bu Tyas',
  npcSpeakerId: 'komandan_guntur',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'komandan_guntur',
      text: 'Halo penjelajah muda. Seluruh data lapangan batas transform telah lengkap terverifikasi di sistem kami.',
      expression: 'normal',
      nextNodeId: 'challenge_prompt',
    },
    challenge_prompt: {
      id: 'challenge_prompt',
      speakerId: 'komandan_guntur',
      text: 'Apakah kamu siap menyelesaikan evaluasi tebak kata ilmiah (Wordle) geologi transform untuk menuntaskan seluruh ekspedisi Level 1?',
      expression: 'thinking',
      choices: [
        {
          id: 'accept_challenge',
          text: 'Saya siap Bu Tyas, mari mulai tantangan akhir!',
          nextNodeId: 'start_challenge_node',
          triggerChallengeGate: true,
        },
        {
          id: 'review_again',
          text: 'Saya ingin meninjau data lapangan sebentar lagi, Bu Tyas.',
          nextNodeId: 'standby_node',
        },
      ],
    },
    start_challenge_node: {
      id: 'start_challenge_node',
      speakerId: 'komandan_guntur',
      text: 'Bagus sekali! Buktikan penguasaanmu mengenai batas lempeng mendatar, patahan California, dan seismograf!',
      expression: 'happy',
      triggerChallengeGate: true,
    },
    standby_node: {
      id: 'standby_node',
      speakerId: 'komandan_guntur',
      text: 'Sangat baik. Silakan pelajari kembali dengan teliti. Segera temui Ibu di sini jika kamu sudah mantap.',
      expression: 'normal',
    },
  },
};

export const KOMANDAN_GUNTUR_UNLOCKED_DIALOGUE: DialogueTree = {
  id: 'komandan_guntur_unlocked_dialogue',
  title: 'Ekspedisi Level 1 Tuntas bersama Bu Tyas!',
  npcSpeakerId: 'komandan_guntur',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'komandan_guntur',
      text: 'Luar biasa membanggakan, penjelajah muda! Kamu telah memecahkan seluruh tantangan geologi dengan gemilang!',
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

// ── DIALOG TAMBAHAN 5 KARAKTER RESMI (SURFACE & CRUST) ──
export const ZAHRA_SURFACE_DIALOGUE: DialogueTree = {
  id: 'z0_zahra_dialogue',
  title: 'Pintu Penyelaman bersama Zahra',
  npcSpeakerId: 'zahra',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'zahra',
      text: 'Hai hai penjelajah! Selamat datang di area portal penyelaman bumi!',
      expression: 'happy',
      nextNodeId: 'portal_penyelaman_1',
    },
    portal_penyelaman_1: {
      id: 'portal_penyelaman_1',
      speakerId: 'zahra',
      text: 'Portal itu ada di sisi kanan yang difungsikan untuk melakukan eksplorasi mendalam terkait struktur geologis bumi. Portal ini ajaib dan dapat terhubung dengan setiap lapisan geologis yang berbeda, loh! Pertama kita akan pergi ke lapisan crust atau kerak yang berada di bagian paling luar dan paling tipis dari bumi.',
      expression: 'happy',
      choices: [
        {
          id: 'c1',
          text: 'Bagaimana karakteristik kerak bumi, Zahra?',
          nextNodeId: 'oceanic_crust_info',
        },
        {
          id: 'c2',
          text: 'Wah asyik! Saya sudah siap meluncur ke bawah tanah!',
          nextNodeId: 'ready_dive',
        },
      ],
    },
    oceanic_crust_info: {
      id: 'oceanic_crust_info',
      speakerId: 'zahra',
      text: 'Kerak bumi itu terbagi menjadi dua, yaitu kerak benua dan kerak samudera dengan tipe kepadatan dan susunan batuan yang berbeda. Kamu bisa mengeksplorasinya lebih dalam saat ekspedisi nanti.',
      expression: 'thinking',
      nextNodeId: 'ready_dive',
    },
    ready_dive: {
      id: 'ready_dive',
      speakerId: 'zahra',
      text: 'Portal penyelaman di sebelah kanan sudah siap beroperasi. Apakah kamu siap menjelajahi perut bumi sekarang?',
      expression: 'happy',
      choices: [
        {
          id: 'yes_dive',
          text: 'Siap meluncur, Zahra!',
          nextNodeId: 'farewell_dive',
          discoveryIdToMark: 'surface_sign2',
        },
        {
          id: 'wait_dive',
          text: 'Sebentar, aku mau kumpulkan kristal dulu.',
          nextNodeId: 'explore_more',
          discoveryIdToMark: 'surface_sign2',
        },
      ],
    },
    explore_more: {
      id: 'explore_more',
      speakerId: 'zahra',
      text: 'Boleh banget! Kumpulkan kristal kuning energi yang berkilau di bukit, setelah itu pergilah ke portal penyelaman di sebelah kanan ya!',
      expression: 'happy',
      discoveryIdToMark: 'surface_sign2',
    },
    farewell_dive: {
      id: 'farewell_dive',
      speakerId: 'zahra',
      text: 'Berdirilah di atas portal di sebelah kanan, lalu tekan [E] atau Panah Bawah untuk meluncur ke Kerak Bumi!',
      expression: 'happy',
      discoveryIdToMark: 'surface_sign2',
    },
  },
};

export const ICAN_SURFACE_DIALOGUE: DialogueTree = {
  id: 'z0_ican_dialogue',
  title: 'Peringatan Santai dari Ican',
  npcSpeakerId: 'ican',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'ican',
      text: 'Woy penjelajah! Yakin lu berani turun ke dalam bumi? Di bawah tuh panas dan ekstrem banget loh, jangan sampai nangis minta pulang haha!',
      expression: 'normal',
      nextNodeId: 'node_2',
    },
    node_2: {
      id: 'node_2',
      speakerId: 'ican',
      text: 'Tapi santai, selama lu rajin ajak ngobrol rekan tim dan baca materi yang ada tanda kaca pembesarnya [🔍], lu bakal lolos tes Wordle dari Bu Tyas kok. Semangat deh!',
      expression: 'happy',
    },
  },
};

export const BU_TYAS_SURFACE_DIALOGUE: DialogueTree = {
  id: 'z0_bu_tyas_dialogue',
  title: 'Pengarahan Dosen Pembimbing Bu Tyas',
  npcSpeakerId: 'bu_tyas',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'bu_tyas',
      text: 'Selamat datang di gerbang ekspedisi penjelajahan perut bumi, para mahasiswa sekalian. Sebagai dosen pembimbing kalian, saya mengingatkan pentingnya ketelitian ilmiah.',
      expression: 'normal',
      nextNodeId: 'node_2',
    },
    node_2: {
      id: 'node_2',
      speakerId: 'bu_tyas',
      text: 'Di tiap lapisan bumi, kalian WAJIB berdiskusi dengan rekan-rekan tim (Zidane, Zahra, Ican, dan Lintang) serta membaca materi edukasi yang mereka simpan (ditandai dengan kaca pembesar [🔍]).',
      expression: 'thinking',
      nextNodeId: 'node_3',
    },
    node_3: {
      id: 'node_3',
      speakerId: 'bu_tyas',
      text: 'Di akhir setiap zona, saya akan mengevaluasi pemahaman konsep kalian dengan tantangan tebak kata ilmiah (Wordle) sebelum gerbang berikutnya saya izinkan terbuka. Selamat belajar dan buktikan dedikasi kalian!',
      expression: 'happy',
    },
  },
};

export const Z1_ZAHRA_DIALOGUE: DialogueTree = {
  id: 'z1_zahra_dialogue',
  title: 'Materi Batas Moho bersama Zahra',
  npcSpeakerId: 'zahra',
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      speakerId: 'zahra',
      text: 'Halo penjelajah! Liat deh formasi batuan di sekitar sini, indah banget kan? Kita sudah sampai di batas terbawah kerak bumi!',
      expression: 'happy',
      nextNodeId: 'node_moho',
    },
    node_moho: {
      id: 'node_moho',
      speakerId: 'zahra',
      text: 'Di sini ada batas diskontinuitas Mohorovicic atau biasa disingkat Batas Moho. Batas ini memisahkan kerak bumi yang kita pijak dengan mantel bumi di bawahnya.',
      expression: 'thinking',
      choices: [
        {
          id: 'c_read_moho',
          text: 'Wah menarik! Boleh aku pelajari catatan materi Batas Moho selengkapnya?',
          nextNodeId: 'node_modal',
          triggerDiscoveryModal: 1,
          discoveryIdToMark: 'crust_disc_moho',
        },
      ],
    },
    node_modal: {
      id: 'node_modal',
      speakerId: 'zahra',
      text: 'Silakan dipelajari ya! Setelah paham, lanjutkan perjalanan ke Lintang dan bersiaplah menghadapi evaluasi dari Bu Tyas di ujung gua!',
      expression: 'happy',
    },
  },
};

// ── REGISTRY SEMUA DIALOG ──
export const DIALOGUE_REGISTRY: Record<string, DialogueTree> = {
  // Area 1: Permukaan Bumi
  mascot_intro: MASCOT_INTRO_DIALOGUE,
  prof_raditya_dialogue: PROF_RADITYA_DIALOGUE,
  kapten_maya_dialogue: ZAHRA_SURFACE_DIALOGUE,
  z0_zidane_dialogue: PROF_RADITYA_DIALOGUE,
  z0_zahra_dialogue: ZAHRA_SURFACE_DIALOGUE,
  z0_ican_dialogue: ICAN_SURFACE_DIALOGUE,
  z0_bu_tyas_dialogue: BU_TYAS_SURFACE_DIALOGUE,

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
  z1_zidane_dialogue: DR_GEA_DIALOGUE,
  z1_zahra_dialogue: Z1_ZAHRA_DIALOGUE,
  z1_ican_dialogue: INSPEKTUR_BUDI_DIALOGUE,
  z1_lintang_dialogue: PROF_ANDINI_DIALOGUE,
  z1_bu_tyas_dialogue: KOMANDAN_HENDRA_READY_DIALOGUE,
  z1_bu_tyas_ready_dialogue: KOMANDAN_HENDRA_READY_DIALOGUE,
  z1_bu_tyas_locked_dialogue: KOMANDAN_HENDRA_LOCKED_DIALOGUE,
  z1_bu_tyas_unlocked_dialogue: KOMANDAN_HENDRA_UNLOCKED_DIALOGUE,

  // Area 3: Mantel Bumi
  mascot_mantle_intro: MASCOT_MANTLE_INTRO_DIALOGUE,
  mascot_mantle_guide: MASCOT_MANTLE_GUIDE_DIALOGUE,
  prof_sarah_dialogue: PROF_SARAH_DIALOGUE,
  prof_sarah_review_dialogue: PROF_SARAH_REVIEW_DIALOGUE,
  dr_danang_dialogue: DR_DANANG_DIALOGUE,
  dr_danang_review_dialogue: DR_DANANG_REVIEW_DIALOGUE,
  petugas_rudi_dialogue: PETUGAS_RUDI_DIALOGUE,
  komandan_surya_dialogue: KOMANDAN_SURYA_READY_DIALOGUE,
  komandan_surya_ready_dialogue: KOMANDAN_SURYA_READY_DIALOGUE,
  komandan_surya_locked_dialogue: KOMANDAN_SURYA_LOCKED_DIALOGUE,
  komandan_surya_unlocked_dialogue: KOMANDAN_SURYA_UNLOCKED_DIALOGUE,
  z2_zahra_dialogue: PROF_SARAH_DIALOGUE,
  z2_ican_dialogue: PETUGAS_RUDI_DIALOGUE,
  z2_lintang_dialogue: DR_DANANG_DIALOGUE,
  z2_bu_tyas_dialogue: KOMANDAN_SURYA_READY_DIALOGUE,
  z2_bu_tyas_ready_dialogue: KOMANDAN_SURYA_READY_DIALOGUE,
  z2_bu_tyas_locked_dialogue: KOMANDAN_SURYA_LOCKED_DIALOGUE,
  z2_bu_tyas_unlocked_dialogue: KOMANDAN_SURYA_UNLOCKED_DIALOGUE,

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
  z3_zidane_dialogue: DR_FAJAR_DIALOGUE,
  z3_zahra_dialogue: PROF_RATNA_DIALOGUE,
  z3_ican_dialogue: PETUGAS_JOKO_DIALOGUE,
  z3_lintang_dialogue: DR_ARIS_DIALOGUE,
  z3_bu_tyas_dialogue: KOMANDAN_TEGUH_READY_DIALOGUE,
  z3_bu_tyas_ready_dialogue: KOMANDAN_TEGUH_READY_DIALOGUE,
  z3_bu_tyas_locked_dialogue: KOMANDAN_TEGUH_LOCKED_DIALOGUE,
  z3_bu_tyas_unlocked_dialogue: KOMANDAN_TEGUH_UNLOCKED_DIALOGUE,

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
  z4_zidane_dialogue: DR_BAGUS_DIALOGUE,
  z4_zahra_dialogue: PROF_LESTARI_DIALOGUE,
  z4_ican_dialogue: PETUGAS_DIAN_DIALOGUE,
  z4_lintang_dialogue: DR_FARHAN_DIALOGUE,
  z4_bu_tyas_dialogue: KOMANDAN_BINTANG_READY_DIALOGUE,
  z4_bu_tyas_ready_dialogue: KOMANDAN_BINTANG_READY_DIALOGUE,
  z4_bu_tyas_locked_dialogue: KOMANDAN_BINTANG_LOCKED_DIALOGUE,
  z4_bu_tyas_unlocked_dialogue: KOMANDAN_BINTANG_UNLOCKED_DIALOGUE,

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
  z5_zidane_dialogue: DR_TAUFIK_DIALOGUE,
  z5_zahra_dialogue: PROF_MAYA_DIALOGUE,
  z5_ican_dialogue: PROF_ILHAM_DIALOGUE,
  z5_lintang_dialogue: DR_CITRA_DIALOGUE,
  z5_bu_tyas_dialogue: KOMANDAN_SATRIA_READY_DIALOGUE,
  z5_bu_tyas_ready_dialogue: KOMANDAN_SATRIA_READY_DIALOGUE,
  z5_bu_tyas_locked_dialogue: KOMANDAN_SATRIA_LOCKED_DIALOGUE,
  z5_bu_tyas_unlocked_dialogue: KOMANDAN_SATRIA_UNLOCKED_DIALOGUE,

  // Area 7: Batas Konvergen
  mascot_convergent_intro: MASCOT_CONVERGENT_INTRO_DIALOGUE,
  mascot_convergent_intro_land: MASCOT_CONVERGENT_LAND_DIALOGUE,
  mascot_convergent_intro_ocean: MASCOT_CONVERGENT_OCEAN_DIALOGUE,
  mascot_convergent_guide: MASCOT_CONVERGENT_GUIDE_DIALOGUE,
  mascot_convergent_guide_land: MASCOT_CONVERGENT_GUIDE_LAND_DIALOGUE,
  mascot_convergent_guide_ocean: MASCOT_CONVERGENT_GUIDE_OCEAN_DIALOGUE,
  dr_farhan_conv_dialogue: DR_FARHAN_CONV_DIALOGUE,
  dr_farhan_conv_land_dialogue: DR_FARHAN_CONV_LAND_DIALOGUE,
  dr_farhan_conv_review_dialogue: DR_FARHAN_CONV_REVIEW_DIALOGUE,
  prof_ratna_conv_dialogue: PROF_RATNA_CONV_DIALOGUE,
  prof_ratna_conv_review_dialogue: PROF_RATNA_CONV_REVIEW_DIALOGUE,
  dr_bayu_conv_dialogue: DR_BAYU_CONV_DIALOGUE,
  komandan_arya_dialogue: KOMANDAN_ARYA_READY_DIALOGUE,
  komandan_arya_ready_dialogue: KOMANDAN_ARYA_READY_DIALOGUE,
  komandan_arya_locked_dialogue: KOMANDAN_ARYA_LOCKED_DIALOGUE,
  komandan_arya_unlocked_dialogue: KOMANDAN_ARYA_UNLOCKED_DIALOGUE,
  z6_zidane_dialogue: DR_FARHAN_CONV_DIALOGUE,
  z6_zidane_land_dialogue: DR_FARHAN_CONV_LAND_DIALOGUE,
  z6_zahra_dialogue: PROF_RATNA_CONV_DIALOGUE,
  z6_ican_dialogue: DR_BAYU_CONV_DIALOGUE,
  z6_lintang_dialogue: DR_BAYU_CONV_DIALOGUE,
  z6_bu_tyas_dialogue: KOMANDAN_ARYA_READY_DIALOGUE,
  z6_bu_tyas_ready_dialogue: KOMANDAN_ARYA_READY_DIALOGUE,
  z6_bu_tyas_locked_dialogue: KOMANDAN_ARYA_LOCKED_DIALOGUE,
  z6_bu_tyas_unlocked_dialogue: KOMANDAN_ARYA_UNLOCKED_DIALOGUE,

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
  z7_zidane_dialogue: PROF_SARAH_TRANS_DIALOGUE,
  z7_zahra_dialogue: DR_TAUFIK_TRANS_DIALOGUE,
  z7_ican_dialogue: DR_MAYA_TRANS_DIALOGUE,
  z7_lintang_dialogue: PETUGAS_RUDI_TRANS_DIALOGUE,
  z7_bu_tyas_dialogue: KOMANDAN_GUNTUR_READY_DIALOGUE,
  z7_bu_tyas_ready_dialogue: KOMANDAN_GUNTUR_READY_DIALOGUE,
  z7_bu_tyas_locked_dialogue: KOMANDAN_GUNTUR_LOCKED_DIALOGUE,
  z7_bu_tyas_unlocked_dialogue: KOMANDAN_GUNTUR_UNLOCKED_DIALOGUE,
};

export function getDialogueTree(id: string): DialogueTree | null {
  return DIALOGUE_REGISTRY[id] || null;
}

