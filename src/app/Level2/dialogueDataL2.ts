// ── src/app/Level2/dialogueDataL2.ts ──────────────────────────────────
// Struktur data pohon dialog Visual Novel RPG & naskah edukatif untuk Level 2
// Menghadirkan atmosfer sekolah SMP: Guru, Siswa/Siswi, Instruktur Tanggap Bencana, dan Robot Maskot Resqy.
// Terhubung dengan kontinuitas alur cerita Level 1 (Kembali dari Inti Bumi menuju Mitigasi Sekolah).

export interface CharacterProfileL2 {
  id: string;
  name: string;
  title: string;
  nameColor: string;
  role: 'npc' | 'mascot' | 'player';
  portraitType:
  | 'zidane'
  | 'zahra'
  | 'ican'
  | 'lintang'
  | 'bu_tyas'
  | 'resqy'
  | 'rian'
  | 'bu_rahma'
  | 'dito'
  | 'pak_surya'
  | 'siti'
  | 'kak_fajar'
  | 'player'
  | 'dr_alisa'
  | 'pak_bambang'
  | 'komandan_satria'
  | 'pak_hendra'
  | 'pak_joko'
  | 'mbak_rina'
  | 'bu_dini'
  | 'pak_slamet'
  | 'zahra_medis'
  | 'lintang_medis';
}

export interface DialogueChoiceL2 {
  id: string;
  text: string;
  nextNodeId: string;
  rewardBadge?: string;
  discoveryIdToMark?: string;     // Menandai temuan sains agar gerbang terbuka
  triggerDiscoveryModal?: number; // Menampilkan DiscoveryModal materi mitigasi
  triggerCrossword?: boolean;     // Memicu Teka-Teki Silang (TTS) evaluasi gerbang
  triggerSimulation?: boolean;    // Memicu Simulasi Gempa Bumi Area 2
  simulationScenario?: 'moderate' | 'severe'; // Pilihan skenario: gempa sedang atau besar
  triggerSeismographModal?: boolean; // Memicu Modal Pembelajaran Seismograf & Gelombang Merapi
}

export interface DialogueNodeL2 {
  id: string;
  speakerId: string;
  text: string;
  expression?: 'normal' | 'happy' | 'thinking' | 'surprised' | 'serious';
  nextNodeId?: string;
  choices?: DialogueChoiceL2[];
}

export interface DialogueTreeL2 {
  id: string;
  title: string;
  startNodeId: string;
  npcSpeakerId: string;
  nodes: Record<string, DialogueNodeL2>;
}

// ── PROFIL KARAKTER SEKOLAH & MITIGASI LEVEL 2 ──
export const CHARACTER_PROFILES_L2: Record<string, CharacterProfileL2> = {
  // ── 5 KARAKTER RESMI LEVEL 2 ──
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
    title: 'Peneliti Mitigasi Ceria',
    nameColor: '#f472b6', // Pink ceria & imut
    role: 'npc',
    portraitType: 'zahra',
  },
  ican: {
    id: 'ican',
    name: 'Ican',
    title: 'Pengamat Dinamika Bencana',
    nameColor: '#fb923c', // Oranye lincah & usil
    role: 'npc',
    portraitType: 'ican',
  },
  lintang: {
    id: 'lintang',
    name: 'Lintang',
    title: 'Analis Mitigasi Sistematis',
    nameColor: '#4ade80', // Hijau emerald pintar
    role: 'npc',
    portraitType: 'lintang',
  },
  bu_tyas: {
    id: 'bu_tyas',
    name: 'Bu Tyas',
    title: 'Evaluator',
    nameColor: '#eab308', // Emas akademis
    role: 'npc',
    portraitType: 'bu_tyas',
  },

  // ── MASKOT BURUNG HANTU & PEMAIN ──
  resqy: {
    id: 'resqy',
    name: 'Resqy',
    title: 'Burung Hantu Pemandu Bijak',
    nameColor: '#38bdf8', // Cyan futuristik
    role: 'mascot',
    portraitType: 'resqy',
  },
  // ── PROFIL SISWA & TOKOH MITIGASI SEKOLAH ──
  rian: {
    id: 'rian',
    name: 'Rian',
    title: 'Siswa SMP (Evakuasi Gempa)',
    nameColor: '#38bdf8',
    role: 'npc',
    portraitType: 'rian',
  },
  bu_rahma: {
    id: 'bu_rahma',
    name: 'Bu Tyas',
    title: 'Guru Kelas & Evaluator',
    nameColor: '#eab308',
    role: 'npc',
    portraitType: 'bu_tyas',
  },
  zahra_medis: {
    id: 'zahra_medis',
    name: 'Zahra',
    title: 'Petugas Medis PMI',
    nameColor: '#38bdf8',
    role: 'npc',
    portraitType: 'zahra_medis',
  },
  lintang_medis: {
    id: 'lintang_medis',
    name: 'Lintang',
    title: 'Koordinator Triage & Medis',
    nameColor: '#4ade80',
    role: 'npc',
    portraitType: 'lintang_medis',
  },
  dito: {
    id: 'dito',
    name: 'Dito PMR',
    title: 'Siswa PMR Sekolah',
    nameColor: '#ef4444',
    role: 'npc',
    portraitType: 'dito',
  },
  pak_surya: {
    id: 'pak_surya',
    name: 'Lintang',
    title: 'Analis Mitigasi Sistematis',
    nameColor: '#4ade80',
    role: 'npc',
    portraitType: 'lintang',
  },
  siti: {
    id: 'siti',
    name: 'Siti OSIS',
    title: 'Ketua OSIS SMP',
    nameColor: '#facc15',
    role: 'npc',
    portraitType: 'siti',
  },
  budi: {
    id: 'budi',
    name: 'Budi',
    title: 'Siswa SMP (Evakuasi Gempa)',
    nameColor: '#34d399',
    role: 'npc',
    portraitType: 'rian',
  },
  maya: {
    id: 'maya',
    name: 'Maya',
    title: 'Siswi SMP (Evakuasi Gempa)',
    nameColor: '#c084fc',
    role: 'npc',
    portraitType: 'siti',
  },
  kak_fajar: {
    id: 'kak_fajar',
    name: 'Bu Tyas',
    title: 'Evaluator TTS',
    nameColor: '#eab308',
    role: 'npc',
    portraitType: 'bu_tyas',
  },
  player: {
    id: 'player',
    name: 'Siswa Penjelajah',
    title: 'Murid SMP Kelas 8',
    nameColor: '#a3e635',
    role: 'player',
    portraitType: 'player',
  },
  dr_alisa: {
    id: 'dr_alisa',
    name: 'Zahra',
    title: 'Peneliti Mitigasi Ceria',
    nameColor: '#f472b6',
    role: 'npc',
    portraitType: 'zahra',
  },
  pak_bambang: {
    id: 'pak_bambang',
    name: 'Lintang',
    title: 'Analis Mitigasi Sistematis',
    nameColor: '#4ade80',
    role: 'npc',
    portraitType: 'lintang',
  },
  komandan_satria: {
    id: 'komandan_satria',
    name: 'Komandan Satria',
    title: 'Komandan Tim SAR & BPBD',
    nameColor: '#f97316',
    role: 'npc',
    portraitType: 'komandan_satria',
  },
  pak_hendra: {
    id: 'pak_hendra',
    name: 'Pak Hendra',
    title: 'Petugas Sarpras & Logistik',
    nameColor: '#38bdf8',
    role: 'npc',
    portraitType: 'pak_hendra',
  },
  pak_joko: {
    id: 'pak_joko',
    name: 'Pak Joko',
    title: 'Kepala Dusun Destana',
    nameColor: '#22c55e',
    role: 'npc',
    portraitType: 'pak_joko',
  },
  mbak_rina: {
    id: 'mbak_rina',
    name: 'Mbak Rina',
    title: 'Warga Siaga Merapi',
    nameColor: '#f87171',
    role: 'npc',
    portraitType: 'mbak_rina',
  },
  bu_dini: {
    id: 'bu_dini',
    name: 'Zidane',
    title: 'Pakar Tektonik & Geofisika',
    nameColor: '#38bdf8',
    role: 'npc',
    portraitType: 'zidane',
  },
  pak_slamet: {
    id: 'pak_slamet',
    name: 'Lintang',
    title: 'Analis Mitigasi Sistematis',
    nameColor: '#4ade80',
    role: 'npc',
    portraitType: 'lintang',
  },
};

// ── KATALOG LENGKAP POHON DIALOG AREA 1 LEVEL 2 ──
export const DIALOGUE_TREES_L2: Record<string, DialogueTreeL2> = {
  // ═════════════════════════════════════════════════════════════════════════
  // 1. TUTORIAL BRIEFING ROBOT RESQY (AREA 1 START)
  // ═════════════════════════════════════════════════════════════════════════
  resqy_briefing_area1: {
    id: 'resqy_briefing_area1',
    title: 'Pengarahan Kesiapsiagaan Sekolah oleh Resqy',
    startNodeId: 'node_1',
    npcSpeakerId: 'resqy',
    nodes: {
      node_1: {
        id: 'node_1',
        speakerId: 'resqy',
        text: 'Kuk-kuuk! Selamat kembali di permukaan bumi, Rekan Penjelajah! Sekarang kita melanjutkan misi di Level 2 untuk mempelajari mitigasi bencana bersama Zidane, Zahra, Ican, Lintang, dan dosen pembimbing kita, Bu Tyas!',
        expression: 'happy',
        nextNodeId: 'node_2',
      },
      node_2: {
        id: 'node_2',
        speakerId: 'resqy',
        text: 'Gunakan tombol [A] / [D] atau Panah untuk bergerak, [SPASI] untuk melompat, dan tekan [E] atau [ENTER] saat berada di dekat rekanmu untuk berdialog.',
        expression: 'normal',
        nextNodeId: 'node_3',
      },
      node_3: {
        id: 'node_3',
        speakerId: 'resqy',
 text: 'PENTING: Di tiap area, kamu harus berkomunikasi dengan rekan timmu yang memiliki tanda kaca pembesar untuk membaca dan mempelajari modul mitigasi bencana!',
        expression: 'thinking',
        choices: [
          {
            id: 'c1',
            text: 'Bagaimana cara membuka gerbang simulasi berikutnya, Resqy?',
            nextNodeId: 'node_eval',
          },
          {
            id: 'c2',
 text: 'Siap, aku temui rekan-rekan tim yang bertanda kaca pembesar!',
            nextNodeId: 'node_ready',
          },
        ],
      },
      node_eval: {
        id: 'node_eval',
        speakerId: 'resqy',
        text: 'Setelah membaca materi dari tim, temui Bu Tyas di ujung ruangan! Bu Tyas akan memberikan evaluasi Teka-Teki Silang (TTS). Selesaikan TTS tersebut untuk membuka gerbang ke area berikutnya!',
        expression: 'happy',
        nextNodeId: 'node_ready',
      },
      node_ready: {
        id: 'node_ready',
        speakerId: 'resqy',
        text: 'Kumpulkan juga kristal kuning keselamatan di sekitar ruangan. Selamat belajar dan buktikan ketangguhan analisamu! Kuk-kuuk!',
        expression: 'happy',
      },
    },
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 2. NPC ZIDANE (TATA RUANG & DENAH KELAS AMAN GEMPA)
  // ═════════════════════════════════════════════════════════════════════════
  rian_dialogue: {
    id: 'rian_dialogue',
    title: 'Tata Ruang Kelas bersama Zidane',
    startNodeId: 'node_1',
    npcSpeakerId: 'zidane',
    nodes: {
      node_1: {
        id: 'node_1',
        speakerId: 'zidane',
        text: 'Hai. Senang melihatmu kembali dengan selamat dari perut bumi. Sebagai pakar tektonik, perhatian utamaku langsung tertuju pada denah dan tata ruang kelas ini.',
        expression: 'normal',
        nextNodeId: 'node_2',
      },
      node_2: {
        id: 'node_2',
        speakerId: 'player',
        text: 'Hai Zidane! Sedang apa kamu memeriksa dinding, lemari, dan denah pintu kelas?',
        expression: 'normal',
        nextNodeId: 'node_3',
      },
      node_3: {
        id: 'node_3',
        speakerId: 'zidane',
        text: 'Aku menganalisis mitigasi non-struktural. Saat gelombang seismik mengguncang, lemari yang tidak dibaut ke dinding akan roboh dan kaca jendela bisa pecah berhamburan. Jalur pintu keluar harus selalu steril dari hambatan bangku.',
        expression: 'serious',
        choices: [
          {
            id: 'c1',
            text: 'Analisis yang sangat presisi, Zidane! Mitigasi dimulai dari ruangan harian kita.',
            nextNodeId: 'node_4',
          },
          {
            id: 'c2',
            text: 'Apa yang sedang disiapkan rekan-rekan kita yang lain, Zidane?',
            nextNodeId: 'node_5',
          },
        ],
      },
      node_4: {
        id: 'node_4',
        speakerId: 'zidane',
 text: 'Tepat. Kesiapsiagaan tata ruang mencegah korban terjebak. Selanjutnya, temui Zahra di dekat meja depan. Dia membawa materi Tas Siaga Bencana yang ditandai kaca pembesar!',
        expression: 'happy',
      },
      node_5: {
        id: 'node_5',
        speakerId: 'zidane',
 text: 'Zahra sedang meneliti isi Tas Siaga 72 Jam di depan, Ican mengawasi jalur mental, dan Lintang menyiapkan modul Drop-Cover-Hold On. Jangan lewatkan tanda kaca pembesar mereka ya.',
        expression: 'normal',
      },
    },
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 3. NPC ZAHRA (PENELITI MITIGASI CERIA - TEMUAN 1: TAS SIAGA BENCANA 72 JAM)
  // ═════════════════════════════════════════════════════════════════════════
  bu_rahma_dialogue: {
    id: 'bu_rahma_dialogue',
    title: 'Materi Tas Siaga Bencana bersama Zahra',
    startNodeId: 'node_1',
    npcSpeakerId: 'zahra',
    nodes: {
      node_1: {
        id: 'node_1',
        speakerId: 'zahra',
        text: 'Hai hai penjelajah! Wah, seru banget ya petualangan geologi kita kemarin! Sekarang giliran kita menyiapkan perlengkapan super penting di kelas ini!',
        expression: 'happy',
        nextNodeId: 'node_2',
      },
      node_2: {
        id: 'node_2',
        speakerId: 'zahra',
        text: 'Lihat ransel oranye ini! Ini adalah Tas Siaga Bencana (TSB) yang dirancang untuk bertahan hidup minimal 72 jam pertama saat darurat!',
        expression: 'happy',
        nextNodeId: 'node_3',
      },
      node_3: {
        id: 'node_3',
        speakerId: 'player',
        text: 'Kenapa harus disiapkan khusus untuk 72 jam pertama, Zahra?',
        expression: 'normal',
        nextNodeId: 'node_4',
      },
      node_4: {
        id: 'node_4',
        speakerId: 'zahra',
        text: 'Karena 72 jam (3 hari) adalah Golden Time masa tanggap darurat! Akses listrik dan jalanan seringkali lumpuh, jadi kita harus mandiri memenuhi kebutuhan dasar air, makanan, dan P3K sebelum bantuan SAR tiba!',
        expression: 'serious',
        choices: [
          {
            id: 'c_view_tsb',
            text: 'Wah menarik banget! Boleh aku pelajari modul perlengkapan Tas Siaga Bencana 72 Jam ini, Zahra?',
            nextNodeId: 'node_open_tsb',
            triggerDiscoveryModal: 0,
            discoveryIdToMark: 'l2_q_disc_prep',
          },
          {
            id: 'c_ask_golden',
            text: 'Apa saja barang wajib yang harus ada di dalam tas itu, Zahra?',
            nextNodeId: 'node_golden_time',
          },
        ],
      },
      node_golden_time: {
        id: 'node_golden_time',
        speakerId: 'zahra',
        text: 'Ada air mineral, biskuit energi, senter baterai, peluit darurat, obat P3K, masker, hingga dokumen penting yang dibungkus plastik kedap air!',
        expression: 'happy',
        choices: [
          {
            id: 'c_view_tsb_after',
            text: 'Keren! Aku ingin membaca modul rincian Tas Siaga Bencana sekarang!',
            nextNodeId: 'node_open_tsb',
            triggerDiscoveryModal: 0,
            discoveryIdToMark: 'l2_q_disc_prep',
          },
        ],
      },
      node_open_tsb: {
        id: 'node_open_tsb',
        speakerId: 'zahra',
 text: 'Silakan dipelajari ya! Tanda kaca pembesar di atas kepalaku kini sudah tersimpan di analisismu. Lanjut ngobrol ke Ican dan Lintang ya!',
        expression: 'happy',
      },
    },
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 4. NPC ICAN (PENGAMAT DINAMIKA BENCANA - KESIAPAN MENTAL & JALUR EVAKUASI)
  // ═════════════════════════════════════════════════════════════════════════
  dito_dialogue: {
    id: 'dito_dialogue',
    title: 'Kesiapan Mental & Jalur Evakuasi bersama Ican',
    startNodeId: 'node_1',
    npcSpeakerId: 'ican',
    nodes: {
      node_1: {
        id: 'node_1',
        speakerId: 'ican',
        text: 'Woy penjelajah! Yaelah, muka lu tegang amat kayak mau ulangan dadakan haha! Tapi lu harus tau nih, musuh paling konyol tapi mematikan pas gempa bumi itu KEPANIKAN!',
        expression: 'normal',
        nextNodeId: 'node_2',
      },
      node_2: {
        id: 'node_2',
        speakerId: 'player',
        text: 'Kenapa kepanikan bisa lebih berbahaya daripada getaran gempanya sendiri, Can?',
        expression: 'normal',
        nextNodeId: 'node_3',
      },
      node_3: {
        id: 'node_3',
        speakerId: 'ican',
        text: 'Ya bayangin aja, orang-orang lari histeris berebut pintu keluar, saling senggol, keinjak-injak, atau ketiban kaca jendela! Kalo lu panik, otak lu ngeblank dan refleks keselamatan lu buyar.',
        expression: 'serious',
        choices: [
          {
            id: 'c1',
            text: 'Benar juga ya, ketenangan dan latihan drill membuat tindakan kita tetap terkontrol!',
            nextNodeId: 'node_4',
          },
          {
            id: 'c2',
            text: 'Lalu apa yang harus kita lakukan saat getaran pertama mulai terasa, Ican?',
            nextNodeId: 'node_5',
          },
        ],
      },
      node_4: {
        id: 'node_4',
        speakerId: 'ican',
        text: 'Nah gitu dong, pinter! Makanya nanti di Area 2 kita bakal simulasi langsung. Sekarang lu samperin tuh Lintang di deretan meja belakang, dia punya modul aksi baku Drop-Cover-Hold On!',
        expression: 'happy',
      },
      node_5: {
        id: 'node_5',
        speakerId: 'ican',
 text: 'Jangan lari dulu pas bumi lagi goyang! Langsung merunduk dan ngumpet di bawah meja. Cek Lintang deh di belakang, dia punya materi lengkapnya bertanda kaca pembesar!',
        expression: 'normal',
      },
    },
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 5. NPC LINTANG (ANALIS MITIGASI SISTEMATIS - TEMUAN 2: AKSI DROP-COVER-HOLD ON)
  // ═════════════════════════════════════════════════════════════════════════
  pak_surya_dialogue: {
    id: 'pak_surya_dialogue',
    title: 'Aksi Drop, Cover, Hold On bersama Lintang',
    startNodeId: 'node_1',
    npcSpeakerId: 'lintang',
    nodes: {
      node_1: {
        id: 'node_1',
        speakerId: 'lintang',
        text: 'Halo! Selamat datang di pos analisis kesiapsiagaan kelas. Berdasarkan data statistik mitigasi, sebagian besar cedera fatal saat gempa di dalam gedung bukan akibat bangunan runtuh, melainkan kejatuhan material pecah!',
        expression: 'serious',
        nextNodeId: 'node_2',
      },
      node_2: {
        id: 'node_2',
        speakerId: 'player',
        text: 'Bagaimana cara terbaik melindungi diri saat guncangan gempa sedang berlangsung, Lintang?',
        expression: 'thinking',
        nextNodeId: 'node_3',
      },
      node_3: {
        id: 'node_3',
        speakerId: 'lintang',
        text: 'Prosedur keselamatan internasional yang terbukti paling efektif adalah 3 langkah baku: Drop (Merunduk merendahkan pusat gravitasi tubuh), Cover (Berlindung di bawah meja kokoh), dan Hold On (Bertahan memegang erat kaki meja)!',
        expression: 'normal',
        choices: [
          {
            id: 'c_view_action',
            text: 'Bolehkah aku mempelajari modul dan ilustrasi visual langkah Drop, Cover, Hold On ini, Lintang?',
            nextNodeId: 'node_open_action',
            triggerDiscoveryModal: 1,
            discoveryIdToMark: 'l2_q_disc_action',
          },
          {
            id: 'c_ask_after',
            text: 'Kapan saat yang tepat untuk mulai evakuasi keluar ruangan, Lintang?',
            nextNodeId: 'node_after_quake',
          },
        ],
      },
      node_after_quake: {
        id: 'node_after_quake',
        speakerId: 'lintang',
        text: 'Evakuasi HANYA dilakukan setelah guncangan berhenti total. Lindungi kepala dengan tas ransel, lalu berjalan tertib melalui tangga darurat menuju titik kumpul lapangan terbuka.',
        expression: 'serious',
        choices: [
          {
            id: 'c_view_action_after',
            text: 'Baik Lintang, buka modul simulasi penyelamatan Drop, Cover, Hold On sekarang!',
            nextNodeId: 'node_open_action',
            triggerDiscoveryModal: 1,
            discoveryIdToMark: 'l2_q_disc_action',
          },
        ],
      },
      node_open_action: {
        id: 'node_open_action',
        speakerId: 'lintang',
        text: 'Bagus sekali! Modul keselamatan telah terbuka. Pelajari posisinya dengan saksama, lalu temui Bu Tyas di ujung ruangan untuk evaluasi Teka-Teki Silang!',
        expression: 'happy',
      },
    },
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 6. NPC BU TYAS (DOSEN PEMBIMBING & EVALUATOR - TEKA-TEKI SILANG MITIGASI PRABENCANA)
  // ═════════════════════════════════════════════════════════════════════════
  kak_fajar_dialogue: {
    id: 'kak_fajar_dialogue',
    title: 'Evaluasi Kesiapsiagaan bersama Bu Tyas',
    startNodeId: 'node_1',
    npcSpeakerId: 'bu_tyas',
    nodes: {
      node_1: {
        id: 'node_1',
        speakerId: 'bu_tyas',
        text: 'Selamat siang anak-anakku para penjelajah tangguh. Ibu sangat bangga melihat kedisiplinan kalian berdiskusi dengan Zidane, Zahra, Ican, dan Lintang.',
        expression: 'happy',
        nextNodeId: 'node_2',
      },
      node_2: {
        id: 'node_2',
        speakerId: 'bu_tyas',
        text: 'Sebelum pintu menuju Ruang Simulasi Gempa (Area 2) Ibu izinkan terbuka, sebagai dosen pembimbing Ibu harus menguji pemahaman konsep mitigasi prabencana kalian.',
        expression: 'normal',
        nextNodeId: 'node_3',
      },
      node_3: {
        id: 'node_3',
        speakerId: 'player',
        text: 'Kami sudah mempelajari denah aman dari Zidane, Tas Siaga 72 Jam dari Zahra, ketenangan mental dari Ican, serta aksi Drop-Cover-Hold On dari Lintang, Bu Tyas!',
        expression: 'happy',
        nextNodeId: 'node_4',
      },
      node_4: {
        id: 'node_4',
        speakerId: 'bu_tyas',
        text: 'Bagus sekali! Buktikan penguasaan materi kalian dalam lembar evaluasi Teka-Teki Silang (TTS) Kesiapsiagaan Sekolah ini. Seluruh kata kunci berasal dari modul yang telah kalian pelajari.',
        expression: 'happy',
        choices: [
          {
            id: 'c_start_tts',
            text: 'Saya siap! Buka evaluasi Teka-Teki Silang sekarang, Bu Tyas!',
            nextNodeId: 'node_launch_tts',
            triggerCrossword: true,
          },
          {
            id: 'c_review_first',
            text: 'Tunggu sebentar Bu, saya ingin membaca kembali catatan materi dari rekan-rekan tim.',
            nextNodeId: 'node_cancel',
          },
        ],
      },
      node_launch_tts: {
        id: 'node_launch_tts',
        speakerId: 'bu_tyas',
        text: 'Gunakan ingatan dan logika ilmiah kalian dengan baik. Selamat mengerjakan evaluasi!',
        expression: 'happy',
      },
      node_cancel: {
        id: 'node_cancel',
        speakerId: 'bu_tyas',
        text: 'Silakan pelajari kembali dengan tenang. Kembali ke Ibu jika kamu sudah siap membuktikan pemahamanmu ya!',
        expression: 'normal',
      },
    },
  },

  kak_fajar_unlocked_dialogue: {
    id: 'kak_fajar_unlocked_dialogue',
    title: 'Evaluasi Tuntas bersama Bu Tyas',
    startNodeId: 'node_unlocked_1',
    npcSpeakerId: 'bu_tyas',
    nodes: {
      node_unlocked_1: {
        id: 'node_unlocked_1',
        speakerId: 'bu_tyas',
        text: 'Luar biasa, anak-anakku! Kalian telah berhasil menyelesaikan evaluasi Teka-Teki Silang Kesiapsiagaan Gempa ini dengan nilai memuaskan!',
        expression: 'happy',
        nextNodeId: 'node_unlocked_2',
      },
      node_unlocked_2: {
        id: 'node_unlocked_2',
        speakerId: 'bu_tyas',
        text: 'Pintu menuju Ruang Simulasi Gempa (Area 2) di sebelah kanan sudah Ibu buka. Silakan lanjut ke area simulasi praktis!',
        expression: 'happy',
      },
    },
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 6. BRIEFING RESQY AWAL AREA 2 (SIMULASI TANGGAP GEMPA)
  // ═════════════════════════════════════════════════════════════════════════
  resqy_briefing_area2: {
    id: 'resqy_briefing_area2',
    title: 'Pengarahan Simulasi Tanggap Gempa oleh Resqy',
    startNodeId: 'sim_brief_1',
    npcSpeakerId: 'resqy',
    nodes: {
      sim_brief_1: {
        id: 'sim_brief_1',
        speakerId: 'resqy',
        text: 'Kuk-kuuk! Selamat datang di Area 2: Simulasi Tanggap Gempa Bumi Ruang Kelas! Di area ini kita akan mempraktikkan langsung respons penyelamatan diri yang sesungguhnya.',
        expression: 'happy',
        nextNodeId: 'sim_brief_2',
      },
      sim_brief_2: {
        id: 'sim_brief_2',
        speakerId: 'resqy',
        text: 'Kamu akan bergabung di meja belajar bersama Bu Tyas dan teman-teman sekelasmu. Saat gempa mengguncang, kamu harus sigap melakukan Drop (Merunduk), Cover (Berlindung), dan Hold On (Bertahan) di bawah meja!',
        expression: 'serious',
        nextNodeId: 'sim_brief_3',
      },
      sim_brief_3: {
        id: 'sim_brief_3',
        speakerId: 'resqy',
        text: 'Apakah kamu sudah siap melakukan simulasi gempa bumi sekarang? Kamu bisa memilih skenario Gempa Sedang atau Gempa Besar!',
        expression: 'thinking',
        choices: [
          {
            id: 'c_start_mod',
            text: '[1] Mulai Skenario 1: Gempa Sedang (Evakuasi Tas Cepat)',
            nextNodeId: 'sim_start_go',
            triggerSimulation: true,
            simulationScenario: 'moderate',
          },
          {
            id: 'c_start_sev',
            text: '[2] Mulai Skenario 2: Gempa Besar (Drop, Cover, Hold On)',
            nextNodeId: 'sim_start_go',
            triggerSimulation: true,
            simulationScenario: 'severe',
          },
          {
            id: 'c_not_ready',
            text: 'Belum Siap, saya ingin melihat-lihat dulu',
            nextNodeId: 'sim_cancel',
          },
        ],
      },
      sim_start_go: {
        id: 'sim_start_go',
        speakerId: 'resqy',
        text: 'Bagus! Duduklah di mejamu, perhatikan penjelasan Bu Tyas, dan bersiaplah bertindak cepat sesuai skenario saat getaran gempa terjadi!',
        expression: 'happy',
      },
      sim_cancel: {
        id: 'sim_cancel',
        speakerId: 'resqy',
        text: 'Baiklah! Silakan amati denah kelas dan jalur evakuasi terlebih dahulu. Kamu juga bisa memilih skenario gempa melalui tombol di atas layar kapan saja!',
        expression: 'normal',
      },
    },
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 6.5. INTERAKSI AWAL BU TYAS DI KELAS 8A (SEBELUM SIMULASI DIMULAI)
  // ═════════════════════════════════════════════════════════════════════════
  bu_rahma_classroom_intro: {
    id: 'bu_rahma_classroom_intro',
    title: 'Kesiapan Simulasi bersama Bu Tyas',
    startNodeId: 'intro_1',
    npcSpeakerId: 'bu_rahma',
    nodes: {
      intro_1: {
        id: 'intro_1',
        speakerId: 'bu_rahma',
        text: 'Halo anak-anak! Saya Bu Tyas. Hari ini kita akan mempraktikkan simulasi tanggap darurat gempa bumi di ruang kelas 8A.',
        expression: 'normal',
        nextNodeId: 'intro_2',
      },
      intro_2: {
        id: 'intro_2',
        speakerId: 'bu_rahma',
        text: 'Kamu bisa memilih menjalankan skenario Gempa Sedang atau Gempa Besar untuk melatih kesiapsiagaan kita hari ini!',
        expression: 'happy',
        choices: [
          {
            id: 'c_start_mod',
            text: '[1] Siap Bu! Mari kita mulai Skenario Gempa Sedang.',
            nextNodeId: 'intro_start',
            triggerSimulation: true,
            simulationScenario: 'moderate',
          },
          {
            id: 'c_start_sev',
            text: '[2] Siap Bu! Mari kita mulai Skenario Gempa Besar.',
            nextNodeId: 'intro_start',
            triggerSimulation: true,
            simulationScenario: 'severe',
          },
          {
            id: 'c_talk_resqy',
            text: 'Baik Bu, saya akan bicara dengan Resqy dulu.',
            nextNodeId: 'intro_cancel',
          },
        ],
      },
      intro_start: {
        id: 'intro_start',
        speakerId: 'bu_rahma',
        text: 'Bagus! Silakan duduk di mejamu. Pelajaran IPA tentang struktur lapisan bumi akan segera kita mulai!',
        expression: 'happy',
      },
      intro_cancel: {
        id: 'intro_cancel',
        speakerId: 'bu_rahma',
        text: 'Baiklah, silakan pelajari tata tertib simulasi bersama Resqy di samping pintu ya!',
        expression: 'normal',
      },
    },
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 7. CUTSCENE PEMBELAJARAN KELAS BERSAMA BU TYAS SEBELUM GEMPA
  // ═════════════════════════════════════════════════════════════════════════
  bu_rahma_teaching_cutscene: {
    id: 'bu_rahma_teaching_cutscene',
    title: 'Kegiatan Belajar IPA: Struktur Lapisan Bumi Bersama Bu Tyas',
    startNodeId: 'teach_1',
    npcSpeakerId: 'bu_rahma',
    nodes: {
      teach_1: {
        id: 'teach_1',
        speakerId: 'bu_rahma',
        text: 'Baik anak-anak, hari ini kita belajar materi IPA tentang Struktur Lapisan Bumi. Bumi tempat kita berpijak tersusun dari kerak bumi, mantel bumi, dan inti bumi.',
        expression: 'normal',
        nextNodeId: 'teach_2',
      },
      teach_2: {
        id: 'teach_2',
        speakerId: 'bu_rahma',
        text: 'Kerak bumi tempat kita tinggal ini terpecah menjadi lempeng-lempeng tektonik raksasa yang selalu bergerak perlahan di atas lapisan mantel yang plastis.',
        expression: 'happy',
        nextNodeId: 'teach_3',
      },
      teach_3: {
        id: 'teach_3',
        speakerId: 'rian',
        text: 'Wah, menarik sekali Bu! Berarti gempa bumi itu terjadi karena pergeseran dan tumbukan antar-lempeng tektonik ya Bu?',
        expression: 'happy',
        nextNodeId: 'teach_4',
      },
      teach_4: {
        id: 'teach_4',
        speakerId: 'bu_rahma',
        text: 'Tepat sekali, Rian! Energi regangan lempeng yang terkunci suatu saat akan terlepas tiba-tiba dan menimbulkan guncang—',
        expression: 'normal',
      },
    },
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 8. DIALOG TEMAN SEKELAS DI AREA 2 SEBELUM SIMULASI
  // ═════════════════════════════════════════════════════════════════════════
  rian_sim_dialogue: {
    id: 'rian_sim_dialogue',
    title: 'Obrolan bersama Rian di Meja Belajar',
    startNodeId: 'r_sim_1',
    npcSpeakerId: 'rian',
    nodes: {
      r_sim_1: {
        id: 'r_sim_1',
        speakerId: 'rian',
        text: 'Wah, kamu sudah siap ikut simulasi gempa? Bicaralah dengan burung hantu Resqy di depan kelas dekat meja guru untuk memulai simulasinya!',
        expression: 'happy',
        choices: [
          {
            id: 'c_rian_start',
            text: 'Ayo kita mulai simulasinya sekarang!',
            nextNodeId: 'r_sim_start',
            triggerSimulation: true,
          },
          {
            id: 'c_rian_wait',
            text: 'Sebentar Rian, aku mau menemui Resqy dulu.',
            nextNodeId: 'r_sim_wait',
          },
        ],
      },
      r_sim_start: {
        id: 'r_sim_start',
        speakerId: 'rian',
        text: 'Mantap! Segera duduk di mejamu dan dengarkan pengantar dari Bu Tyas ya!',
        expression: 'happy',
      },
      r_sim_wait: {
        id: 'r_sim_wait',
        speakerId: 'rian',
        text: 'Siap! Kalau sudah siap langsung temui Resqy di depan pintu ya!',
        expression: 'normal',
      },
    },
  },

  dito_sim_dialogue: {
    id: 'dito_sim_dialogue',
    title: 'Kesiapan PMR bersama Dito',
    startNodeId: 'd_sim_1',
    npcSpeakerId: 'dito',
    nodes: {
      d_sim_1: {
        id: 'd_sim_1',
        speakerId: 'dito',
        text: 'Sebagai regu PMR kelas, aku sudah memeriksa jalur di bawah meja. Pastikan kamu memegang kaki meja kuat-kuat saat gempa berlangsung!',
        expression: 'serious',
      },
    },
  },

  siti_sim_dialogue: {
    id: 'siti_sim_dialogue',
    title: 'Panduan Evakuasi Tertib bersama Siti OSIS',
    startNodeId: 's_sim_1',
    npcSpeakerId: 'siti',
    nodes: {
      s_sim_1: {
        id: 's_sim_1',
        speakerId: 'siti',
        text: 'Kunci keselamatan saat evakuasi adalah: Jangan panik, lindungi kepala dengan tas, dan berjalan tertib menuju lapangan terbuka!',
        expression: 'happy',
      },
    },
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 9. PERINTAH DARURAT GURU BU RAHMA SAAT GEMPA & SAAT EVAKUASI
  // ═════════════════════════════════════════════════════════════════════════
  bu_rahma_quake_alert_moderate: {
    id: 'bu_rahma_quake_alert_moderate',
    title: 'Peringatan Gempa Sedang oleh Bu Rahma',
    startNodeId: 'alert_mod_1',
    npcSpeakerId: 'bu_rahma',
    nodes: {
      alert_mod_1: {
        id: 'alert_mod_1',
        speakerId: 'bu_rahma',
        text: 'Ada gempa! Anak-anak tetap tenang dan jangan panik, segera ambil tas sekolah untuk melindungi kepala dan bersiap evakuasi tertib keluar ruangan sekarang!',
        expression: 'serious',
      },
    },
  },

  bu_rahma_quake_alert: {
    id: 'bu_rahma_quake_alert',
    title: 'Peringatan Darurat Gempa Besar oleh Bu Rahma',
    startNodeId: 'alert_1',
    npcSpeakerId: 'bu_rahma',
    nodes: {
      alert_1: {
        id: 'alert_1',
        speakerId: 'bu_rahma',
        text: 'ADA GEMPA!! GEMPA BESAR! Semuanya, cepat MERUNDUK dan BERLINDUNG di bawah meja masing-masing! Lindungi kepala dan pegang erat kaki meja!',
        expression: 'serious',
      },
    },
  },

  bu_rahma_evac_order: {
    id: 'bu_rahma_evac_order',
    title: 'Instruksi Evakuasi Kelas oleh Bu Rahma',
    startNodeId: 'evac_1',
    npcSpeakerId: 'bu_rahma',
    nodes: {
      evac_1: {
        id: 'evac_1',
        speakerId: 'bu_rahma',
        text: 'Alhamdulillah, guncangan gempa sudah berhenti dan situasi sudah aman! Anak-anak, ayo segera berdiri dan keluar dari bawah meja masing-masing secara berhati-hati.',
        expression: 'happy',
        nextNodeId: 'evac_2',
      },
      evac_2: {
        id: 'evac_2',
        speakerId: 'bu_rahma',
        text: 'Ambil tas sekolah atau buku tebal untuk melindungi kepala dari reruntuhan, lalu berbaris tertib mengikuti Ibu keluar kelas menuju lapangan terbuka!',
        expression: 'serious',
      },
    },
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 10. DIALOG AREA 3: LAPANGAN SEKOLAH PASCABENCANA
  // ═════════════════════════════════════════════════════════════════════════
  resqy_briefing_area3: {
    id: 'resqy_briefing_area3',
    title: 'Arahan Titik Kumpul Pascabencana oleh Resqy',
    startNodeId: 'resqy_f_1',
    npcSpeakerId: 'resqy',
    nodes: {
      resqy_f_1: {
        id: 'resqy_f_1',
        speakerId: 'resqy',
        text: 'Kuk-kuuk! Selamat datang di Lapangan Terbuka Sekolah, zona titik kumpul resmi pasca-evakuasi gempa bumi! Kita kembali berkumpul bersama Zidane, Zahra, Ican, dan Bu Tyas!',
        expression: 'happy',
        nextNodeId: 'resqy_f_2',
      },
      resqy_f_2: {
        id: 'resqy_f_2',
        speakerId: 'resqy',
        text: 'Di area terbuka ini kita aman dari bahaya runtuhan plafon dan kaca gedung. Namun kita harus tetap waspada terhadap potensi gempa susulan!',
        expression: 'normal',
        nextNodeId: 'resqy_f_3',
      },
      resqy_f_3: {
        id: 'resqy_f_3',
        speakerId: 'resqy',
 text: 'Di sini kita mempelajari SOP utilitas listrik/gas, triage pertolongan pertama (P3K), dan sistem komando darurat sekolah. Ingat cari tanda kaca pembesar pada rekanmu!',
        expression: 'thinking',
        choices: [
          {
            id: 'c_resqy_f_ok',
            text: 'Siap Resqy, siapa saja yang harus saya temui di lapangan?',
            nextNodeId: 'resqy_f_mission',
          },
          {
            id: 'c_resqy_f_why',
            text: 'Mengapa lapangan terbuka menjadi titik kumpul paling aman?',
            nextNodeId: 'resqy_f_why',
          },
        ],
      },
      resqy_f_why: {
        id: 'resqy_f_why',
        speakerId: 'resqy',
        text: 'Lapangan terbuka bebas dari jangkauan robohnya dinding gedung, tiang listrik, atau pohon tinggi jika getaran susulan datang!',
        expression: 'serious',
        nextNodeId: 'resqy_f_mission',
      },
      resqy_f_mission: {
        id: 'resqy_f_mission',
        speakerId: 'resqy',
        text: 'Temui Zahra di tenda triage medis, Lintang di pos komando, dan teman-teman sekelasmu di lapangan terbuka. Lalu temui Bu Tyas di gerbang keluar untuk evaluasi Teka-Teki Silang!',
        expression: 'happy',
      },
    },
  },

  dr_alisa_dialogue: {
    id: 'dr_alisa_dialogue',
    title: 'Posko Medis & Triage Darurat bersama Zahra',
    startNodeId: 'alisa_1',
    npcSpeakerId: 'zahra_medis',
    nodes: {
      alisa_1: {
        id: 'alisa_1',
        speakerId: 'zahra_medis',
        text: 'Hai hai penjelajah! Selamat datang di posko triage pertolongan pertama! Di sini aku mengoordinasikan penanganan cedera ringan dan syok emosional teman-teman kita.',
        expression: 'happy',
        nextNodeId: 'alisa_2',
      },
      alisa_2: {
        id: 'alisa_2',
        speakerId: 'zahra_medis',
        text: 'Dalam penanganan darurat massal, kita menerapkan metode START Triage: Merah untuk korban darurat kritis, Kuning untuk cedera sedang, Hijau untuk luka ringan, dan Hitam untuk korban meninggal.',
        expression: 'serious',
        choices: [
          {
            id: 'c_alisa_disc',
            text: 'Wah penting sekali! Boleh saya pelajari modul SOP Keselamatan & Medis Triage ini, Zahra?',
            nextNodeId: 'alisa_teach',
            discoveryIdToMark: 'disc-post-safety',
            triggerDiscoveryModal: 0,
          },
        ],
      },
      alisa_teach: {
        id: 'alisa_teach',
        speakerId: 'zahra_medis',
 text: 'Hebat sekali semangat belajarmu! Tanda kaca pembesar di poskoku kini sudah kamu kuasai. Lanjut pelajari sistem komando di meja Lintang ya!',
        expression: 'happy',
      },
    },
  },

  pak_bambang_dialogue: {
    id: 'pak_bambang_dialogue',
    title: 'Sistem Komando Darurat Sekolah bersama Lintang',
    startNodeId: 'bambang_1',
    npcSpeakerId: 'lintang_medis',
    nodes: {
      bambang_1: {
        id: 'bambang_1',
        speakerId: 'lintang_medis',
        text: 'Halo penjelajah! Di pos komando ini, kita menerapkan Incident Command System (ICS) Sekolah untuk memastikan evakuasi dan pencatatan presensi siswa berjalan 100% akurat.',
        expression: 'happy',
        nextNodeId: 'bambang_2',
      },
      bambang_2: {
        id: 'bambang_2',
        speakerId: 'lintang_medis',
        text: 'Kunci keberhasilan posko komando adalah satu pintu informasi resmi untuk menangkal hoaks dan kepanikan massal di media sosial.',
        expression: 'serious',
        choices: [
          {
            id: 'c_bambang_disc',
            text: 'Bolehkah saya mempelajari panduan Manajemen Komando & Komunikasi Resmi ini, Lintang?',
            nextNodeId: 'bambang_teach',
            discoveryIdToMark: 'disc-post-coordination',
            triggerDiscoveryModal: 1,
          },
        ],
      },
      bambang_teach: {
        id: 'bambang_teach',
        speakerId: 'lintang_medis',
        text: 'Sangat bijak! Modul komando telah kamu catat. Sekarang saatnya menuju Bu Tyas di gerbang keluar untuk evaluasi Teka-Teki Silang!',
        expression: 'happy',
      },
    },
  },

  komandan_satria_dialogue: {
    id: 'komandan_satria_dialogue',
    title: 'Evaluasi Pascabencana bersama Bu Tyas',
    startNodeId: 'satria_1',
    npcSpeakerId: 'bu_rahma',
    nodes: {
      satria_1: {
        id: 'satria_1',
        speakerId: 'bu_rahma',
        text: 'Selamat anak-anakku para penjelajah tangguh! Ibu sangat bangga melihat kedisiplinan dan koordinasi kalian di lapangan bersama Zahra, Lintang, dan rekan-rekan sekelas.',
        expression: 'happy',
        nextNodeId: 'satria_2',
      },
      satria_2: {
        id: 'satria_2',
        speakerId: 'bu_rahma',
        text: 'Sebelum gerbang menuju Pos Pengamatan Merapi (Area 4) Ibu izinkan terbuka, kalian harus menyelesaikan evaluasi pemahaman mitigasi pascabencana gempa bumi.',
        expression: 'normal',
        nextNodeId: 'satria_3',
      },
      satria_3: {
        id: 'satria_3',
        speakerId: 'bu_rahma',
        text: 'Apakah kamu sudah menguasai materi instalasi utilitas, triage medis bencana, dan sistem komando sekolah?',
        expression: 'thinking',
        choices: [
          {
            id: 'c_satria_challenge',
            text: 'Siap Bu Tyas! Saya sudah mempelajari seluruh materi dan siap dievaluasi!',
            nextNodeId: 'satria_ready',
            triggerCrossword: true,
          },
          {
            id: 'c_satria_back',
            text: 'Beri saya waktu sebentar untuk membaca ulang materi di posko medis Zahra dan Lintang, Bu.',
            nextNodeId: 'satria_later',
          },
        ],
      },
      satria_ready: {
        id: 'satria_ready',
        speakerId: 'bu_rahma',
        text: 'Bagus sekali! Buktikan pemahaman ilmiah kalian dalam Teka-Teki Silang Pascabencana Gempa ini!',
        expression: 'happy',
      },
      satria_later: {
        id: 'satria_later',
        speakerId: 'bu_rahma',
        text: 'Baik, silakan tinjau kembali posko Zahra dan Lintang. Ibu menunggu di gerbang ini ya!',
        expression: 'normal',
      },
    },
  },

  satria_field_unlocked_dialogue: {
    id: 'satria_field_unlocked_dialogue',
    title: 'Gerbang Lapangan Terbuka bersama Bu Tyas',
    startNodeId: 'node_unlocked_1',
    npcSpeakerId: 'bu_rahma',
    nodes: {
      node_unlocked_1: {
        id: 'node_unlocked_1',
        speakerId: 'bu_rahma',
        text: 'Luar biasa, anak-anakku! Kalian telah berhasil menyelesaikan evaluasi Teka-Teki Silang Mitigasi Pascabencana ini dengan tuntas!',
        expression: 'happy',
        nextNodeId: 'node_unlocked_2',
      },
      node_unlocked_2: {
        id: 'node_unlocked_2',
        speakerId: 'bu_rahma',
        text: 'Gerbang menuju Pos Pengamatan Merapi (Area 4) di sebelah kanan sudah Ibu buka. Silakan lanjut ke penjelajahan berikutnya!',
        expression: 'happy',
      },
    },
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 11. DIALOG WARGA SEKOLAH DI LAPANGAN PASCABENCANA (AREA 3)
  // ═════════════════════════════════════════════════════════════════════════
  rian_field_dialogue: {
    id: 'rian_field_dialogue',
    title: 'Kelegaan Rian di Lapangan Terbuka',
    startNodeId: 'rian_f_1',
    npcSpeakerId: 'rian',
    nodes: {
      rian_f_1: {
        id: 'rian_f_1',
        speakerId: 'rian',
        text: 'Huff... Syukurlah kita semua berhasil keluar dari gedung kelas dengan selamat! Tadi saat gempa guncangannya kencang sekali.',
        expression: 'happy',
        nextNodeId: 'rian_f_2',
      },
      rian_f_2: {
        id: 'rian_f_2',
        speakerId: 'rian',
        text: 'Untung kita langsung merunduk di bawah meja dan melindungi kepala dengan tas. Berada di lapangan hijau terbuka seperti ini rasanya jauh lebih tenang, tidak takut kejatuhan plafon atau kaca!',
        expression: 'normal',
      },
    },
  },

  bu_rahma_field_dialogue: {
    id: 'bu_rahma_field_dialogue',
    title: 'Apresiasi & Arahan dari Bu Rahma di Titik Kumpul',
    startNodeId: 'rahma_f_1',
    npcSpeakerId: 'bu_rahma',
    nodes: {
      rahma_f_1: {
        id: 'rahma_f_1',
        speakerId: 'bu_rahma',
        text: 'Alhamdulillah anak-anakku, Ibu sangat bangga melihat kedisiplinan dan ketenangan kalian saat evakuasi tadi. Semua berjalan tertib dan tidak saling mendahului.',
        expression: 'happy',
        nextNodeId: 'rahma_f_2',
      },
      rahma_f_2: {
        id: 'rahma_f_2',
        speakerId: 'bu_rahma',
        text: 'Ibu sedang mendampingi teman-teman dan mengawasi presensi bersama Pak Bambang. Jika ada yang merasa pusing, lecet tergores, atau butuh pertolongan pertama, segera periksa ke posko dr. Alisa di tenda PMI ya!',
        expression: 'normal',
        choices: [
          {
            id: 'c_rahma_f_ok',
            text: 'Baik Bu Rahma! Saya akan pastikan kondisi teman-teman aman dan mematuhi arahan posko.',
            nextNodeId: 'rahma_f_end',
          },
        ],
      },
      rahma_f_end: {
        id: 'rahma_f_end',
        speakerId: 'bu_rahma',
        text: 'Tetap berada di lapangan terbuka ini bersama rombongan kelas ya. Jangan ada yang mencoba kembali ke dalam gedung sebelum ada instruksi resmi!',
        expression: 'serious',
      },
    },
  },

  dito_field_dialogue: {
    id: 'dito_field_dialogue',
    title: 'Kesiagaan Regu PMR bersama Dito',
    startNodeId: 'dito_f_1',
    npcSpeakerId: 'dito',
    nodes: {
      dito_f_1: {
        id: 'dito_f_1',
        speakerId: 'dito',
        text: 'Sebagai regu PMR, aku langsung bantu mendampingi teman-teman yang syok dan lecet saat evakuasi tadi. Beruntung Posko Medis PMI dan Zahra sudah bersiap di sebelah ini!',
        expression: 'normal',
        nextNodeId: 'dito_f_2',
      },
      dito_f_2: {
        id: 'dito_f_2',
        speakerId: 'dito',
        text: 'Untung semuanya mempraktikkan Drop, Cover, and Hold On dengan benar di kelas tadi, jadi tidak ada korban luka berat. Ingat ya kawan, jangan mencoba kembali masuk ke gedung kelas sebelum dinyatakan aman oleh pihak berwenang!',
        expression: 'happy',
      },
    },
  },

  siti_field_dialogue: {
    id: 'siti_field_dialogue',
    title: 'Koordinasi Titik Kumpul bersama Siti OSIS',
    startNodeId: 'siti_f_1',
    npcSpeakerId: 'siti',
    nodes: {
      siti_f_1: {
        id: 'siti_f_1',
        speakerId: 'siti',
        text: 'Alhamdulillah, seluruh rombongan kelas berhasil evakuasi tertib ke lapangan terbuka ini! Kami dari pengurus OSIS sedang membantu mendata presensi setiap teman sekelas.',
        expression: 'happy',
        nextNodeId: 'siti_f_2',
      },
      siti_f_2: {
        id: 'siti_f_2',
        speakerId: 'siti',
        text: 'Tetap bersama kelompok kelasmu ya! Jangan berdiri di dekat tiang listrik, dinding retak, atau pohon lapuk karena rawan roboh jika ada gempa susulan. Dengarkan selalu arahan pos komando sekolah!',
        expression: 'serious',
      },
    },
  },

  budi_field_dialogue: {
    id: 'budi_field_dialogue',
    title: 'Pengalaman Budi Menghadapi Gempa',
    startNodeId: 'budi_f_1',
    npcSpeakerId: 'budi',
    nodes: {
      budi_f_1: {
        id: 'budi_f_1',
        speakerId: 'budi',
        text: 'Tadi aku sempat panik saat meja bergetar keras. Tapi melihat Bu Guru dan kawan-kawan sigap merunduk dan memegang kaki meja, aku jadi ikut tenang.',
        expression: 'normal',
        nextNodeId: 'budi_f_2',
      },
      budi_f_2: {
        id: 'budi_f_2',
        speakerId: 'budi',
        text: 'Lapangan terbuka sekolah ini luas dan hijau. Selama kita tidak berdiri di bawah tiang listrik atau kaca, kita aman dari bahaya gempa susulan!',
        expression: 'happy',
      },
    },
  },

  maya_field_dialogue: {
    id: 'maya_field_dialogue',
    title: 'Imbauan Menghindari Berita Hoaks bersama Maya',
    startNodeId: 'maya_f_1',
    npcSpeakerId: 'maya',
    nodes: {
      maya_f_1: {
        id: 'maya_f_1',
        speakerId: 'maya',
        text: 'Semua teman sekelas kita sudah berkumpul lengkap di dekat tiang bendera dan pos komando.',
        expression: 'happy',
        nextNodeId: 'maya_f_2',
      },
      maya_f_2: {
        id: 'maya_f_2',
        speakerId: 'maya',
        text: 'Ingat ya teman-teman, jangan mudah percaya atau menyebarkan pesan berantai yang menakut-nakuti di ponsel. Selalu dengarkan informasi resmi dari BMKG dan BPBD lewat pengeras suara Kepala Sekolah!',
        expression: 'serious',
      },
    },
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 12. POHON DIALOG AREA 4: PRABENCANA ERUPSI MERAPI (POS PGA & KRB III)
  // ═════════════════════════════════════════════════════════════════════════

  // A. Briefing Pembuka Otomatis Resqy di Area 4
  resqy_briefing_area4: {
    id: 'resqy_briefing_area4',
    title: 'Pengarahan Kesiapsiagaan Lereng Merapi oleh Resqy',
    startNodeId: 'resqy_v_1',
    npcSpeakerId: 'resqy',
    nodes: {
      resqy_v_1: {
        id: 'resqy_v_1',
        speakerId: 'resqy',
        text: 'Kuk-kuuk! Selamat datang di Lereng Gunung Merapi, Rekan Penjelajah! Kita baru saja tiba di Pos Pengamatan Gunung Api (PGA) bersama Zidane, Zahra, Lintang, dan Bu Tyas!',
        expression: 'happy',
        nextNodeId: 'resqy_v_2',
      },
      resqy_v_2: {
        id: 'resqy_v_2',
        speakerId: 'resqy',
        text: 'Misi kita di Area 4 adalah mempelajari Kesiapsiagaan Prabencana Erupsi: 4 Tingkat Status Gunung Api PVMBG, data seismograf Merapi, dan Zonasi Bahaya KRB.',
        expression: 'serious',
        nextNodeId: 'resqy_v_3',
      },
      resqy_v_3: {
        id: 'resqy_v_3',
        speakerId: 'resqy',
 text: 'Perhatikan tanda kaca pembesar pada rekanmu untuk membuka modul edukasi, lalu temui Bu Tyas di posko gerbang untuk evaluasi Teka-Teki Silang!',
        expression: 'happy',
      },
    },
  },

  // B. Relawan Jalur Ican di Kaki Jalur Posko
  relawan_budi_dialogue: {
    id: 'relawan_budi_dialogue',
    title: 'Peringatan Santai di Kaki Merapi bersama Ican',
    startNodeId: 'budi_v_1',
    npcSpeakerId: 'ican',
    nodes: {
      budi_v_1: {
        id: 'budi_v_1',
        speakerId: 'ican',
        text: 'Woy kawan! Liat tuh ke atas, kepulan asap solfatara di kawah Merapi tebel banget! Udaranya sejuk tapi Merapi tuh gunung api paling aktif di Indonesia loh haha!',
        expression: 'happy',
        nextNodeId: 'budi_v_2',
      },
      budi_v_2: {
        id: 'budi_v_2',
        speakerId: 'player',
        text: 'Apakah abu vulkanik di lereng ini berbahaya bagi pernapasan kita, Can?',
        expression: 'thinking',
        nextNodeId: 'budi_v_3',
      },
      budi_v_3: {
        id: 'budi_v_3',
        speakerId: 'ican',
        text: 'Bahaya banget lah! Abu vulkanik itu serpihan kaca dan silika tajam, bukan debu tanah biasa! Makanya jangan lupa siapin masker. Sekarang cek Plaza Status di depan bersama Zahra, dan masuk ke gedung observasi buat liat seismograf Zidane!',
        expression: 'normal',
      },
    },
  },

  // C. Pakar Tektonik Zidane (Di Dalam Ruang Observasi Pos PGA - Seismograf & Bentuk Gelombang)
  pak_surya_volcano_dialogue: {
    id: 'pak_surya_volcano_dialogue',
    title: 'Laboratorium Seismograf bersama Zidane',
    startNodeId: 'surya_v_1',
    npcSpeakerId: 'zidane',
    nodes: {
      surya_v_1: {
        id: 'surya_v_1',
        speakerId: 'zidane',
        text: 'Halo penjelajah. Selamat datang di ruang observasi Pos PGA Merapi. Dari layar monitor ini, aku memantau getaran seismik pergerakan fluida magma 24 jam nonstop.',
        expression: 'normal',
        nextNodeId: 'surya_v_2',
      },
      surya_v_2: {
        id: 'surya_v_2',
        speakerId: 'player',
        text: 'Zidane, bagaimana seismograf membaca getaran di dalam perut Merapi dan apa kaitannya dengan penentuan status gunung api?',
        expression: 'thinking',
        nextNodeId: 'surya_v_3',
      },
      surya_v_3: {
        id: 'surya_v_3',
        speakerId: 'zidane',
        text: 'Seismograf mendeteksi gempa vulkanik dalam (VA) dan dangkal (VB). Kerapatan gelombang seismogram mencerminkan aktivitas: dari status Normal yang renggang tenang, hingga tremor menerus yang SANGAT RAPAT dan intens pada status Awas!',
        expression: 'serious',
        choices: [
          {
            id: 'c_surya_v_seismo',
            text: 'Bolehkah aku mempelajari rekaman seismograf & bentuk gelombang status Merapi, Zidane?',
            nextNodeId: 'surya_v_teach',
            triggerSeismographModal: true,
          },
        ],
      },
      surya_v_teach: {
        id: 'surya_v_teach',
        speakerId: 'zidane',
        text: 'Tepat sekali. Cermati baik-baik pola tremor menerus yang sangat rapat tanpa jeda pada status AWAS. Kamu akan membutuhkannya saat menghadapi evaluasi Bu Tyas nanti.',
        expression: 'happy',
      },
    },
  },

  // D. Peneliti Mitigasi Ceria Zahra (Di Plaza Status Merapi - Memicu Temuan 1: 4 Status PVMBG & MAGMA Indonesia)
  mbak_rina_dialogue: {
    id: 'mbak_rina_dialogue',
    title: 'Plaza Status Merapi bersama Zahra',
    startNodeId: 'rina_v_1',
    npcSpeakerId: 'zahra',
    nodes: {
      rina_v_1: {
        id: 'rina_v_1',
        speakerId: 'zahra',
        text: 'Hai hai penjelajah! Selamat datang di Plaza Pemantauan Status Merapi! Papan digital besar di belakangku ini terhubung langsung dengan sensor PVMBG lho!',
        expression: 'happy',
        nextNodeId: 'rina_v_2',
      },
      rina_v_2: {
        id: 'rina_v_2',
        speakerId: 'player',
        text: 'Papan digital bertuliskan Level I sampai IV ini penjelasannya bagaimana ya, Zahra?',
        expression: 'thinking',
        nextNodeId: 'rina_v_3',
      },
      rina_v_3: {
        id: 'rina_v_3',
        speakerId: 'zahra',
        text: 'PVMBG menetapkan 4 tingkatan status resmi yang dipantau setiap saat lewat MAGMA Indonesia: Level I (Normal), Level II (Waspada), Level III (Siaga), hingga Level IV (Awas)!',
        expression: 'serious',
        choices: [
          {
            id: 'c_rina_v_disc',
            text: 'Wah keren banget! Boleh aku pelajari modul 4 Tingkat Status Gunung Api ini, Zahra?',
            nextNodeId: 'rina_v_teach',
            discoveryIdToMark: 'disc-volcano-status',
            triggerDiscoveryModal: 0,
          },
        ],
      },
      rina_v_teach: {
        id: 'rina_v_teach',
        speakerId: 'zahra',
 text: 'Hebat sekali! Tanda kaca pembesar di poskoku sudah kamu pelajari. Jangan lupa masuk ke pos observasi untuk melihat seismograf Zidane, dan temui Lintang di depan ya!',
        expression: 'happy',
        nextNodeId: 'rina_v_extra',
      },
      rina_v_extra: {
        id: 'rina_v_extra',
        speakerId: 'zahra',
        text: 'Lintang punya peta zonasi bahaya KRB yang sangat penting untuk keselamatan warga lereng gunung api!',
        expression: 'normal',
      },
    },
  },

  // E. Analis Mitigasi Lintang (Memicu Temuan 2: Zonasi KRB & APD Perlindungan)
  pak_joko_dialogue: {
    id: 'pak_joko_dialogue',
    title: 'Zonasi KRB & Jalur Evakuasi bersama Lintang',
    startNodeId: 'joko_v_1',
    npcSpeakerId: 'lintang',
    nodes: {
      joko_v_1: {
        id: 'joko_v_1',
        speakerId: 'lintang',
        text: 'Halo penjelajah! Di kawasan lereng Merapi ini, analisis zonasi spasial mutlak diperlukan untuk menentukan wilayah yang wajib dikosongkan saat erupsi.',
        expression: 'happy',
        nextNodeId: 'joko_v_2',
      },
      joko_v_2: {
        id: 'joko_v_2',
        speakerId: 'player',
        text: 'Bagaimana pembagian zona Kawasan Rawan Bencana (KRB) di lereng Merapi, Lintang?',
        expression: 'thinking',
        nextNodeId: 'joko_v_3',
      },
      joko_v_3: {
        id: 'joko_v_3',
        speakerId: 'lintang',
        text: 'Wilayah dibagi menjadi KRB I (potensi lahar hujan di lembah sungai), KRB II (ancaman awan panas dan lontaran batu pijar), dan KRB III (zona paling berbahaya dekat puncak yang dilarang untuk hunian tetap)!',
        expression: 'serious',
        choices: [
          {
            id: 'c_joko_v_disc',
            text: 'Bolehkah saya mempelajari panduan Peta Zonasi KRB Merapi & APD Abu Vulkanik ini, Lintang?',
            nextNodeId: 'joko_v_teach',
            discoveryIdToMark: 'disc-volcano-response',
            triggerDiscoveryModal: 1,
          },
        ],
      },
      joko_v_teach: {
        id: 'joko_v_teach',
        speakerId: 'lintang',
 text: 'Sangat bijak! Modul zonasi KRB bertanda kaca pembesar ini telah tersimpan di catatan analisismu. Sekarang temui Bu Tyas di posko gerbang untuk evaluasi Teka-Teki Silang!',
        expression: 'happy',
      },
    },
  },

  // F. Bu Tyas (Tantangan Evaluasi TTS Area 4 di Gerbang Evakuasi)
  satria_volcano_dialogue: {
    id: 'satria_volcano_dialogue',
    title: 'Evaluasi Kesiapsiagaan Prabencana bersama Bu Tyas',
    startNodeId: 'satria_v_1',
    npcSpeakerId: 'bu_tyas',
    nodes: {
      satria_v_1: {
        id: 'satria_v_1',
        speakerId: 'bu_tyas',
        text: 'Halo, penjelajah muda! Ibu sangat bangga melihat ketekunan kalian mempelajari sistem pemantauan Merapi.',
        expression: 'happy',
        nextNodeId: 'satria_v_2',
      },
      satria_v_2: {
        id: 'satria_v_2',
        speakerId: 'bu_tyas',
        text: 'Sebelum gerbang jalur evakuasi menuju Area 5 Ibu izinkan terbuka, Ibu ingin menguji pemahaman mitigasi prabencana erupsi yang telah kalian pelajari dari Zidane, Zahra, Ican, dan Lintang.',
        expression: 'normal',
        nextNodeId: 'satria_v_3',
      },
      satria_v_3: {
        id: 'satria_v_3',
        speakerId: 'bu_tyas',
        text: 'Apakah kalian sudah memahami status gunung api, data seismograf tremor, zonasi KRB, dan penggunaan APD masker?',
        expression: 'thinking',
        choices: [
          {
            id: 'c_satria_v_challenge',
            text: 'Siap Bu Tyas! Saya sudah menguasai seluruh materi dan siap dievaluasi!',
            nextNodeId: 'satria_v_ready',
            triggerCrossword: true,
          },
          {
            id: 'c_satria_v_back',
            text: 'Beri saya waktu sebentar untuk membaca kembali modul di pos pengamatan, Bu.',
            nextNodeId: 'satria_v_later',
          },
        ],
      },
      satria_v_ready: {
        id: 'satria_v_ready',
        speakerId: 'bu_tyas',
        text: 'Bagus! Tunjukkan ketajaman analisa kalian dalam Teka-Teki Silang Kesiapsiagaan Erupsi Merapi ini!',
        expression: 'happy',
      },
      satria_v_later: {
        id: 'satria_v_later',
        speakerId: 'bu_tyas',
        text: 'Baik, silakan pelajari kembali dengan cermat. Ibu menunggu di gerbang ini ya!',
        expression: 'normal',
      },
    },
  },

  satria_volcano_unlocked_dialogue: {
    id: 'satria_volcano_unlocked_dialogue',
    title: 'Gerbang Jalur Evakuasi Terbuka bersama Bu Tyas',
    startNodeId: 'node_unlocked_1',
    npcSpeakerId: 'bu_tyas',
    nodes: {
      node_unlocked_1: {
        id: 'node_unlocked_1',
        speakerId: 'bu_tyas',
        text: 'Analisis yang sangat tajam dan membanggakan, anak-anakku! Kalian telah berhasil menuntaskan evaluasi Teka-Teki Silang Kesiapsiagaan Erupsi Merapi ini!',
        expression: 'happy',
        nextNodeId: 'node_unlocked_2',
      },
      node_unlocked_2: {
        id: 'node_unlocked_2',
        speakerId: 'bu_tyas',
        text: 'Gerbang menuju Dusun Destana KRB III (Area 5) di sebelah kanan sudah Ibu buka. Bersiaplah menghadapi simulasi evakuasi lapangan!',
        expression: 'happy',
      },
    },
  },

  // ═════════════════════════════════════════════════════════════════════════
  // POHON DIALOG AREA 5: SIMULASI TANGGAP ERUPSI GUNUNG MERAPI
  // ═════════════════════════════════════════════════════════════════════════

  // 0. Pengarahan Awal Resqy di Pintu Masuk Dusun Destana (Pilihan Mulai Simulasi / Eksplorasi)
  resqy_briefing_area5: {
    id: 'resqy_briefing_area5',
    title: 'Pengarahan Simulasi Erupsi Merapi oleh Resqy',
    startNodeId: 'resqy_b5_1',
    npcSpeakerId: 'resqy',
    nodes: {
      resqy_b5_1: {
        id: 'resqy_b5_1',
        speakerId: 'resqy',
        text: 'Kuk-kuuk! Selamat datang di Area 5: Simulasi Tanggap Erupsi Gunung Merapi di Dusun Destana!',
        expression: 'happy',
        nextNodeId: 'resqy_b5_2',
      },
      resqy_b5_2: {
        id: 'resqy_b5_2',
        speakerId: 'resqy',
        text: 'Dusun ini berada di Kawasan Rawan Bencana (KRB) III. Jika aktivitas vulkanik meningkat, kamu harus sigap membunyikan sirine bahaya di pos ronda, mencari & menyelamatkan 3 warga dusun yang membutuhkan pertolongan, lalu lari bersama menuju Mobil Evakuasi!',
        expression: 'serious',
        nextNodeId: 'resqy_b5_3',
      },
      resqy_b5_3: {
        id: 'resqy_b5_3',
        speakerId: 'resqy',
        text: 'Apakah kamu sudah siap memulai simulasi tanggap erupsi sekarang?',
        expression: 'thinking',
        choices: [
          {
            id: 'c_start_volcano_sim',
            text: 'Siap, Mulai Simulasi!',
            nextNodeId: 'resqy_b5_go',
            triggerSimulation: true,
          },
          {
            id: 'c_explore_volcano_area',
            text: 'Belum Siap, saya mau lihat-lihat kondisi sekitar dulu',
            nextNodeId: 'resqy_b5_cancel',
          },
        ],
      },
      resqy_b5_go: {
        id: 'resqy_b5_go',
        speakerId: 'resqy',
        text: 'Bagus! Siagakan dirimu di dusun. Tetap waspada jika merasakan getaran gempa vulkanik pertama!',
        expression: 'happy',
      },
      resqy_b5_cancel: {
        id: 'resqy_b5_cancel',
        speakerId: 'resqy',
        text: 'Baiklah! Silakan amati desa dan lingkungan sekitar lereng terlebih dahulu. Bicaralah padaku lagi atau tekan tombol [MULAI] jika kamu sudah siap memulai simulasi!',
        expression: 'normal',
      },
    },
  },

  // 1. Briefing Awal Suasana Pedesaan Tenang (Status Normal / Level I)
  pak_joko_sim_intro: {
    id: 'pak_joko_sim_intro',
    title: 'Kesiapsiagaan Dusun Destana bersama Pak Joko',
    startNodeId: 'joko_si_1',
    npcSpeakerId: 'pak_joko',
    nodes: {
      joko_si_1: {
        id: 'joko_si_1',
        speakerId: 'pak_joko',
        text: 'Sugeng rawuh di Dusun Destana lereng Merapi! Saat ini suasana pedesaan masih asri dan damai di Level I (NORMAL). Namun sebagai warga KRB III, kita harus selalu peka terhadap tanda-tanda alam.',
        expression: 'happy',
        nextNodeId: 'joko_si_2',
      },
      joko_si_2: {
        id: 'joko_si_2',
        speakerId: 'player',
        text: 'Siap Pak Joko! Kami siap memantau kondisi lereng dan membantu kesiapsiagaan warga.',
        expression: 'normal',
        nextNodeId: 'joko_si_3',
      },
      joko_si_3: {
        id: 'joko_si_3',
        speakerId: 'pak_joko',
        text: 'Bagus sekali anak-anakku. Jika kamu sudah siap, bicaralah dengan Resqy di pos depan untuk memulai simulasi tanggap darurat!',
        expression: 'serious',
      },
    },
  },

  // 2. Peringatan Tremor & Asap Putih (Status Waspada / Level II)
  pak_joko_waspada_alert: {
    id: 'pak_joko_waspada_alert',
    title: 'Peringatan Status WASPADA bersama Pak Joko',
    startNodeId: 'joko_wa_1',
    npcSpeakerId: 'pak_joko',
    nodes: {
      joko_wa_1: {
        id: 'joko_wa_1',
        speakerId: 'pak_joko',
        text: 'GEMPAAA! GEMPAAA! Tanah bergetar dan kawah Merapi mengepulkan asap putih! Status resmi naik ke LEVEL II (WASPADA)!',
        expression: 'surprised',
        nextNodeId: 'joko_wa_2',
      },
      joko_wa_2: {
        id: 'joko_wa_2',
        speakerId: 'pak_joko',
        text: 'Cepat lari ke pos ronda di samping balai! Pukul kentongan bambu 3 kali berturut-turut untuk membunyikan tanda bahaya waspada agar warga segera bersiap!',
        expression: 'serious',
      },
    },
  },

  // 3. Peringatan Abu Hitam, Langit Meredup & Hujan Abu (Status Siaga / Level III)
  mbak_rina_siaga_alert: {
    id: 'mbak_rina_siaga_alert',
    title: 'Peringatan Status SIAGA & Misi Evakuasi Warga',
    startNodeId: 'rina_sg_1',
    npcSpeakerId: 'mbak_rina',
    nodes: {
      rina_sg_1: {
        id: 'rina_sg_1',
        speakerId: 'mbak_rina',
        text: 'Perhatian Taruna! Asap kawah membubung hitam pekat! Burung-burung panik terbang turun menjauhi puncak, dan hujan abu mulai turun! Status resmi LEVEL III (SIAGA)!',
        expression: 'surprised',
        nextNodeId: 'rina_sg_2',
      },
      rina_sg_2: {
        id: 'rina_sg_2',
        speakerId: 'mbak_rina',
        text: 'Segera pasang masker N95-mu, lalu cari dan selamatkan 3 warga dusun yang masih tertinggal di pemukiman! Ikuti tanda seru penunjuk arah jika posisinya di luar layar!',
        expression: 'serious',
      },
    },
  },

  // 4. Perintah Evakuasi Cepat Erupsi Magma (Status Awas / Level IV)
  pak_joko_awas_evac: {
    id: 'pak_joko_awas_evac',
    title: 'Perintah Evakuasi Kilat Status AWAS bersama Pak Joko',
    startNodeId: 'joko_aw_1',
    npcSpeakerId: 'pak_joko',
    nodes: {
      joko_aw_1: {
        id: 'joko_aw_1',
        speakerId: 'pak_joko',
        text: 'DENTUMAN DAHSYAT!! Puncak Merapi meletus dan memuntahkan lava pijar membara! Status resmi naik ke LEVEL IV (AWAS - BAHAYA UTAMA)!',
        expression: 'surprised',
        nextNodeId: 'joko_aw_2',
      },
      joko_aw_2: {
        id: 'joko_aw_2',
        speakerId: 'pak_joko',
        text: 'Awan panas mulai meluncur turun lereng! Tinggalkan seluruh barang berat, sprint secepatnya dan naik ke atas bak truk evakuasi BPBD sekarang juga!!',
        expression: 'serious',
      },
    },
  },

  // 5. Epilog Kemenangan & Apresiasi Pasca Evakuasi Aman
  satria_sim_victory: {
    id: 'satria_sim_victory',
    title: 'Apresiasi Keberhasilan Evakuasi Erupsi Merapi',
    startNodeId: 'satria_vc_1',
    npcSpeakerId: 'komandan_satria',
    nodes: {
      satria_vc_1: {
        id: 'satria_vc_1',
        speakerId: 'komandan_satria',
        text: 'Kerja kepemimpinan yang sangat gemilang, Taruna! Berkat ketepatan reaksimu memukul kentongan, memakai APD masker, dan evakuasi kilat dengan truk, seluruh warga Dusun Destana tiba di tempat aman dengan selamat!',
        expression: 'happy',
        nextNodeId: 'satria_vc_2',
      },
      satria_vc_2: {
        id: 'satria_vc_2',
        speakerId: 'pak_joko',
        text: 'Matur nuwun sanget anakku! Kamu telah membuktikan arti sejati Desa Tangguh Bencana.',
        expression: 'happy',
        nextNodeId: 'satria_vc_3',
      },
      satria_vc_3: {
        id: 'satria_vc_3',
        speakerId: 'resqy',
        text: 'Analisis dan tindakan mitigasimu 100% sempurna! Kamu berhak menyandang gelar kehormatan: Merapi Volcano Survivor & Hero!',
        expression: 'happy',
        nextNodeId: 'satria_vc_4',
      },
      satria_vc_4: {
        id: 'satria_vc_4',
        speakerId: 'komandan_satria',
        text: 'Mobil evakuasi kita telah berhasil melaju kencang menembus hujan abu pekat dan sekarang kita tiba dengan selamat di Barak Pengungsian Terpadu (Area 6) di Zona Aman Dataran Rendah! Mari bersiap membantu penanganan dan pemulihan pascabencana bersama relawan BPBD & PMI!',
        expression: 'happy',
      },
    },
  },

  // ═════════════════════════════════════════════════════════════════════════
  // AREA 6: PASCABENCANA ERUPSI MERAPI (BARAK PENGUNGSIAN & BAHAYA SEKUNDER)
  // ═════════════════════════════════════════════════════════════════════════

  // 1. TUTORIAL BRIEFING MASKOT RESQY (AREA 6 START)
  resqy_briefing_area6: {
    id: 'resqy_briefing_area6',
    title: 'Pengarahan Pasca-Erupsi Merapi oleh Resqy',
    startNodeId: 'resqy_b6_1',
    npcSpeakerId: 'resqy',
    nodes: {
      resqy_b6_1: {
        id: 'resqy_b6_1',
        speakerId: 'resqy',
        text: 'Kuk-kuuk! Kerja penyelamatan yang sangat luar biasa di Lereng Merapi, Siswa Penjelajah! Rombongan truk evakuasi kita telah tiba dengan selamat di Barak Pengungsian Terpadu (Zona Aman KRB I).',
        expression: 'happy',
        nextNodeId: 'resqy_b6_2',
      },
      resqy_b6_2: {
        id: 'resqy_b6_2',
        speakerId: 'resqy',
        text: 'Meskipun bahaya primer awan panas telah terlewati, fase pascabencana menghadirkan tantangan baru yang krusial: penanganan timbunan abu vulkanik di atap rumah, sanitasi air bersih, dan ancaman bahaya sekunder banjir lahar dingin!',
        expression: 'serious',
        nextNodeId: 'resqy_b6_3',
      },
      resqy_b6_3: {
        id: 'resqy_b6_3',
        speakerId: 'resqy',
 text: 'Ayo temui Zidane di pos penanganan abu dan barak, Zahra di posko medis sanitasi, Ican di posko logistik, dan Lintang di posko lahar hujan untuk mempelajari seluruh modul bertanda kaca pembesar sebelum menempuh evaluasi akhir bersama Bu Tyas!',
        expression: 'normal',
        choices: [
          {
            id: 'c1',
            text: 'Siap Resqy! Saya akan segera menemui rekan-rekan tim dan mempelajari materi pemulihan.',
            nextNodeId: 'resqy_b6_ready',
          },
          {
            id: 'c2',
            text: 'Mengapa bahaya sekunder lahar dingin dan abu vulkanik tetap sangat mematikan pasca-erupsi?',
            nextNodeId: 'resqy_b6_explain',
          },
        ],
      },
      resqy_b6_ready: {
        id: 'resqy_b6_ready',
        speakerId: 'resqy',
        text: 'Hebat! Langkahkan kakimu menyusuri barak pengungsian ini. Setiap rekan memiliki catatan sains penting yang wajib kamu kuasai demi keselamatan warga!',
        expression: 'happy',
      },
      resqy_b6_explain: {
        id: 'resqy_b6_explain',
        speakerId: 'resqy',
        text: 'Karena abu vulkanik basah di atap sangat berat dan berpotensi merobohkan rumah! Selain itu, jutaan kubik endapan vulkanik di puncak dapat tersapu hujan lebat menjadi lahar dingin yang meluap di sungai. Pelajari selengkapnya dari rekan-rekan tim di barak!',
        expression: 'thinking',
      },
    },
  },

  // 2. DIALOG ZIDANE (PENANGANAN ABU VULKANIK & STANDAR BARAK)
  bu_dini_dialogue: {
    id: 'bu_dini_dialogue',
    title: 'Penanganan Abu Vulkanik & Hunian bersama Zidane',
    startNodeId: 'dini_1',
    npcSpeakerId: 'zidane',
    nodes: {
      dini_1: {
        id: 'dini_1',
        speakerId: 'zidane',
        text: 'Selamat datang di Barak Pengungsian Terpadu, penjelajah. Berdasarkan analisis beban struktural, endapan abu vulkanik basah memiliki massa jenis sangat tinggi yang dapat merobohkan atap pemukiman warga.',
        expression: 'normal',
        nextNodeId: 'dini_2',
      },
      dini_2: {
        id: 'dini_2',
        speakerId: 'zidane',
        text: 'Sesuai panduan Buku Saku BNPB, atap rumah warga wajib dibersihkan secara gotong royong sebelum turun hujan lebat, dan mobilitas kendaraan di jalanan berabu harus dibatasi ketat.',
        expression: 'serious',
        choices: [
          {
            id: 'c1',
            text: 'Bolehkah saya meneliti modul resmi BNPB tentang pembersihan atap dan tata kelola shelter ini, Zidane?',
            triggerDiscoveryModal: 0,
            discoveryIdToMark: 'disc-post-ash',
            nextNodeId: 'dini_teach',
          },
          {
            id: 'c2',
            text: 'Mengapa berkendara di jalanan berabu sangat dilarang kencang-kencang, Zidane?',
            nextNodeId: 'dini_motor_info',
          },
        ],
      },
      dini_motor_info: {
        id: 'dini_motor_info',
        speakerId: 'zidane',
        text: 'Partikel abu vulkanik bertindak seperti ampelas kaca mikroskopis. Selain membuat ban kehilangan traksi dan mudah tergelincir, abu yang terhisap ke saringan udara mesin kendaraan akan menyumbat dan merusak silinder mesin.',
        expression: 'thinking',
        nextNodeId: 'dini_motor_next',
      },
      dini_motor_next: {
        id: 'dini_motor_next',
        speakerId: 'zidane',
 text: 'Karena itu, batasi mobilitas kendaraan dan selalu bersihkan atap rumah secara gotong royong. Mari kita pelajari panduan lengkapnya dari modul resmi BNPB bertanda kaca pembesar!',
        expression: 'normal',
        choices: [
          {
            id: 'c1',
            text: 'Baik Zidane, buka modul penanganan abu vulkanik sekarang!',
            triggerDiscoveryModal: 0,
            discoveryIdToMark: 'disc-post-ash',
            nextNodeId: 'dini_teach',
          },
        ],
      },
      dini_teach: {
        id: 'dini_teach',
        speakerId: 'zidane',
        text: 'Analisis yang sangat baik. Ingat poin kuncinya: bersihkan atap secara gotong royong, kenakan APD masker, dan periksa modul sanitasi di posko Zahra.',
        expression: 'happy',
      },
    },
  },

  // 3. DIALOG ZAHRA (KESEHATAN, SANITASI & AIR BERSIH TERTUTUP)
  dr_alisa_shelter_dialogue: {
    id: 'dr_alisa_shelter_dialogue',
    title: 'Edukasi Kesehatan, Sanitasi & Mata bersama Zahra',
    startNodeId: 'alisa_s_1',
    npcSpeakerId: 'zahra',
    nodes: {
      alisa_s_1: {
        id: 'alisa_s_1',
        speakerId: 'zahra',
        text: 'Hai hai kembali penjelajah! Senang melihatmu tetap sehat dan ceria! Di posko medis pengungsian ini, aku mendistribusikan masker N95, kacamata goggle, dan obat tetes mata steril.',
        expression: 'happy',
        nextNodeId: 'alisa_s_2',
      },
      alisa_s_2: {
        id: 'alisa_s_2',
        speakerId: 'zahra',
        text: 'Abu vulkanik mengandung pecahan kristal silika tajam yang berbahaya bagi paru-paru. Selain itu, sumber air minum pengungsi wajib ditutup rapat agar tidak tercemar asam belerang beracun!',
        expression: 'serious',
        choices: [
          {
            id: 'c1',
            text: 'Wah penting sekali! Boleh aku pelajari modul kesehatan sanitasi air tertutup ini, Zahra?',
            triggerDiscoveryModal: 1,
            discoveryIdToMark: 'disc-post-sanitation',
            nextNodeId: 'alisa_s_teach',
          },
          {
            id: 'c2',
            text: 'Bagaimana pertolongan pertama jika mata terkena abu vulkanik, Zahra?',
            nextNodeId: 'alisa_s_eye_info',
          },
        ],
      },
      alisa_s_eye_info: {
        id: 'alisa_s_eye_info',
        speakerId: 'zahra',
        text: 'JANGAN PERNAH MENGUCEK MATA! Kristal silika tajam bisa merobek kornea mata kita! Basuh perlahan dengan air bersih yang mengalir atau gunakan larutan steril.',
        expression: 'serious',
        nextNodeId: 'alisa_s_eye_next',
      },
      alisa_s_eye_next: {
        id: 'alisa_s_eye_next',
        speakerId: 'zahra',
 text: 'Pastikan juga penutup tandon air minum selalu terkunci rapat. Buka modul bertanda kaca pembesar di poskoku agar kamu paham fakta ilmiahnya!',
        expression: 'normal',
        choices: [
          {
            id: 'c1',
            text: 'Siap Zahra, buka modul kesehatan dan sanitasi air bersih sekarang!',
            triggerDiscoveryModal: 1,
            discoveryIdToMark: 'disc-post-sanitation',
            nextNodeId: 'alisa_s_teach',
          },
        ],
      },
      alisa_s_teach: {
        id: 'alisa_s_teach',
        speakerId: 'zahra',
 text: 'Keren banget pemahamanmu! Tanda kaca pembesar di poskoku sudah tersimpan. Sekarang temui Lintang untuk materi ancaman lahar dingin ya!',
        expression: 'happy',
      },
    },
  },

  // 4. DIALOG LINTANG (BAHAYA SEKUNDER LAHAR DINGIN)
  pak_slamet_dialogue: {
    id: 'pak_slamet_dialogue',
    title: 'Kewaspadaan Bahaya Sekunder Lahar Dingin bersama Lintang',
    startNodeId: 'slamet_1',
    npcSpeakerId: 'lintang',
    nodes: {
      slamet_1: {
        id: 'slamet_1',
        speakerId: 'lintang',
        text: 'Salam tangguh penjelajah! Meskipun erupsi eksplosif telah reda, analisis geomorfologi lereng menunjukkan ancaman bahaya sekunder yang tak kalah mematikan: banjir lahar dingin!',
        expression: 'normal',
        nextNodeId: 'slamet_2',
      },
      slamet_2: {
        id: 'slamet_2',
        speakerId: 'lintang',
        text: 'Jutaan meter kubik material vulkanik lepas menumpuk di hulu sungai. Curah hujan tinggi di puncak akan mencairkan endapan tersebut menjadi aliran debris berkepadatan tinggi yang sanggup meremukkan jembatan!',
        expression: 'serious',
        choices: [
          {
            id: 'c1',
            text: 'Bolehkah saya mempelajari modul bahaya sekunder lahar dingin dan sensor EWS sungai ini, Lintang?',
            triggerDiscoveryModal: 2,
            discoveryIdToMark: 'disc-post-lahar',
            nextNodeId: 'slamet_teach',
          },
          {
            id: 'c2',
            text: 'Apa yang harus dilakukan warga di bantaran sungai saat sirine EWS berbunyi, Lintang?',
            nextNodeId: 'slamet_river_info',
          },
        ],
      },
      slamet_river_info: {
        id: 'slamet_river_info',
        speakerId: 'lintang',
        text: 'Segera evakuasi menjauhi bantaran sungai minimal 300-500 meter ke elevasi yang lebih tinggi! Dilarang keras menonton aliran lahar di atas jembatan.',
        expression: 'serious',
        nextNodeId: 'slamet_river_next',
      },
      slamet_river_next: {
        id: 'slamet_river_next',
        speakerId: 'lintang',
 text: 'Peralatan Early Warning System (EWS) sungai bekerja memicu sirine peringatan. Simak diagram mekanismenya di modul bertanda kaca pembesar ini!',
        expression: 'normal',
        choices: [
          {
            id: 'c1',
            text: 'Baik Lintang, buka modul bahaya sekunder lahar dingin sekarang!',
            triggerDiscoveryModal: 2,
            discoveryIdToMark: 'disc-post-lahar',
            nextNodeId: 'slamet_teach',
          },
        ],
      },
      slamet_teach: {
        id: 'slamet_teach',
        speakerId: 'lintang',
        text: 'Luar biasa! Pemahamanmu tentang siklus mitigasi gunung api kini lengkap dari pra hingga pascabencana. Bersiaplah menghadapi evaluasi puncak dari Bu Tyas di gerbang akhir!',
        expression: 'happy',
      },
    },
  },

  // 5. DIALOG ICAN (SEMANJAT & KESIAPAN DI BARAK PENGUNGSIAN)
  dani_shelter_dialogue: {
    id: 'dani_shelter_dialogue',
    title: 'Semangat & Disiplin Barak bersama Ican',
    startNodeId: 'dani_sh_1',
    npcSpeakerId: 'ican',
    nodes: {
      dani_sh_1: {
        id: 'dani_sh_1',
        speakerId: 'ican',
        text: 'Woy penjelajah! Liat tuh dapur umum Tagana, makanannya harum banget kan haha! Tapi inget, antre rapi dan jangan rebutan porsi ya!',
        expression: 'happy',
        nextNodeId: 'dani_sh_2',
      },
      dani_sh_2: {
        id: 'dani_sh_2',
        speakerId: 'ican',
        text: 'Di barak pengungsian gini, selain jaga kesehatan dan cuci tangan, saling menyemangati teman-teman dan warga lansia itu penting banget biar gak stres. Lu udah siap kan buat tes akhir sama Bu Tyas di ujung sana?',
        expression: 'normal',
      },
    },
  },

  // 6. DIALOG WARGA LANSIA DI BARAK PENGUNGSIAN
  mbah_joyo_shelter_dialogue: {
    id: 'mbah_joyo_shelter_dialogue',
    title: 'Doa Warga Sepuh di Barak Pengungsian',
    startNodeId: 'joyo_sh_1',
    npcSpeakerId: 'zidane',
    nodes: {
      joyo_sh_1: {
        id: 'joyo_sh_1',
        speakerId: 'zidane',
        text: 'Alhamdulillah... Para warga sepuh dan anak-anak telah beristirahat dengan nyaman di dalam barak berstandar aman ini.',
        expression: 'happy',
        nextNodeId: 'joyo_sh_2',
      },
      joyo_sh_2: {
        id: 'joyo_sh_2',
        speakerId: 'zidane',
        text: 'Keberhasilan evakuasi membuktikan pentingnya kesiapsiagaan komunitas. Sekarang selesaikan evaluasi akhirmu bersama Bu Tyas!',
        expression: 'happy',
      },
    },
  },

  // 7. DIALOG BU TYAS (GERBANG KELUAR & EVALUASI AKHIR TTS ERUPSI MERAPI)
  satria_shelter_dialogue: {
    id: 'satria_shelter_dialogue',
    title: 'Evaluasi Akhir Pascabencana bersama Bu Tyas',
    startNodeId: 'satria_sh_1',
    npcSpeakerId: 'bu_tyas',
    nodes: {
      satria_sh_1: {
        id: 'satria_sh_1',
        speakerId: 'bu_tyas',
        text: 'Kerja kepemimpinan yang sangat membanggakan, anak-anakku para penjelajah tangguh! Ibu mencatat kalian telah mempelajari ketiga modul pascabencana erupsi bersama Zidane, Zahra, Ican, dan Lintang dengan sangat tekun!',
        expression: 'happy',
        nextNodeId: 'satria_sh_2',
      },
      satria_sh_2: {
        id: 'satria_sh_2',
        speakerId: 'bu_tyas',
        text: 'Sekarang tibalah saatnya untuk menguji pemahaman dan analisis mitigasi kalian melalui Teka-Teki Silang (TTS) Erupsi Merapi Pascabencana! Ini adalah evaluasi puncak penuntas ekspedisi Level 2. Apakah kalian siap?',
        expression: 'serious',
        choices: [
          {
            id: 'c1',
            text: 'Siap Bu Tyas! Buka lembar Teka-Teki Silang evaluasi akhir sekarang!',
            triggerCrossword: true,
            nextNodeId: 'satria_sh_tts',
          },
          {
            id: 'c2',
            text: 'Saya ingin meneliti ulang catatan materi mitigasi di barak terlebih dahulu, Bu Tyas.',
            nextNodeId: 'satria_sh_wait',
          },
        ],
      },
      satria_sh_tts: {
        id: 'satria_sh_tts',
        speakerId: 'bu_tyas',
        text: 'Bagus sekali! Gunakan seluruh pengetahuanmu tentang pembersihan atap, sanitasi air tertutup, dan bahaya sekunder lahar dingin. Tuntaskan teka-teki penutup ini!',
        expression: 'happy',
      },
      satria_sh_wait: {
        id: 'satria_sh_wait',
        speakerId: 'bu_tyas',
        text: 'Keputusan yang sangat bijaksana. Ketelitian ilmiah adalah kunci mitigasi. Temui kembali Zidane, Zahra, atau Lintang jika ada materi yang ingin kalian perdalam ya!',
        expression: 'normal',
      },
    },
  },

  // 8. DIALOG BU TYAS (UNLOCKED / EVALUASI SELESAI & KAPSUL AKHIR TERBUKA)
  satria_shelter_unlocked_dialogue: {
    id: 'satria_shelter_unlocked_dialogue',
    title: 'Selamat! Level 2: Disaster Analyst Tuntas 100%',
    startNodeId: 'satria_unl_1',
    npcSpeakerId: 'bu_tyas',
    nodes: {
      satria_unl_1: {
        id: 'satria_unl_1',
        speakerId: 'bu_tyas',
        text: 'Luar biasa, anak-anakku para taruna tangguh! Kalian telah berhasil menyelesaikan evaluasi Teka-Teki Silang Pascabencana Erupsi Merapi ini dengan nilai sempurna!',
        expression: 'happy',
        nextNodeId: 'satria_unl_2',
      },
      satria_unl_2: {
        id: 'satria_unl_2',
        speakerId: 'bu_tyas',
        text: 'Dengan keberhasilan ini, kalian resmi menuntaskan seluruh 6 Area pembelajaran Level 2: Disaster Analyst! Kapsul Evakuasi Akhir di sebelah kanan telah AKTIF bercahaya. Silakan dekati dan masuki kapsul untuk merayakan kemenangan!',
        expression: 'happy',
      },
    },
  },
};

