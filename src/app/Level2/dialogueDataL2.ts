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
    | 'pak_hendra';
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
  resqy: {
    id: 'resqy',
    name: 'Resqy',
    title: 'Robot Pemandu Penyelamat',
    nameColor: '#38bdf8', // Cyan futuristik
    role: 'mascot',
    portraitType: 'resqy',
  },
  rian: {
    id: 'rian',
    name: 'Rian',
    title: 'Siswa Kelas 8A',
    nameColor: '#60a5fa', // Biru muda ceria
    role: 'npc',
    portraitType: 'rian',
  },
  bu_rahma: {
    id: 'bu_rahma',
    name: 'Bu Rahma, M.Pd.',
    title: 'Guru IPA & Pembina PMR',
    nameColor: '#f59e0b', // Amber emas wibawa
    role: 'npc',
    portraitType: 'bu_rahma',
  },
  dito: {
    id: 'dito',
    name: 'Dito',
    title: 'Ketua Regu PMR Kelas',
    nameColor: '#fb7185', // Merah muda semangat
    role: 'npc',
    portraitType: 'dito',
  },
  pak_surya: {
    id: 'pak_surya',
    name: 'Pak Surya',
    title: 'Instruktur Tanggap Bencana',
    nameColor: '#ea580c', // Oranye penyelamat
    role: 'npc',
    portraitType: 'pak_surya',
  },
  siti: {
    id: 'siti',
    name: 'Siti',
    title: 'Ketua OSIS SMP',
    nameColor: '#c084fc', // Ungu cerdas
    role: 'npc',
    portraitType: 'siti',
  },
  kak_fajar: {
    id: 'kak_fajar',
    name: 'Kak Fajar',
    title: 'Ketua Tim Relawan Sekolah',
    nameColor: '#10b981', // Hijau emerald tangguh
    role: 'npc',
    portraitType: 'kak_fajar',
  },
  player: {
    id: 'player',
    name: 'Siswa Penjelajah',
    title: 'Murid SMP Kelas 8',
    nameColor: '#a3e635', // Hijau limau segar
    role: 'player',
    portraitType: 'player',
  },
  dr_alisa: {
    id: 'dr_alisa',
    name: 'dr. Alisa',
    title: 'Dokter Relawan Medis PMI',
    nameColor: '#ef4444', // Merah palang merah
    role: 'npc',
    portraitType: 'dr_alisa',
  },
  pak_bambang: {
    id: 'pak_bambang',
    name: 'Pak Bambang, M.Pd.',
    title: 'Kepala Sekolah SMP',
    nameColor: '#3b82f6', // Biru wibawa dinas
    role: 'npc',
    portraitType: 'pak_bambang',
  },
  komandan_satria: {
    id: 'komandan_satria',
    name: 'Komandan Satria',
    title: 'Komandan Regu SAR & BPBD',
    nameColor: '#f97316', // Oranye penyelamat tanggap bencana
    role: 'npc',
    portraitType: 'komandan_satria',
  },
  pak_hendra: {
    id: 'pak_hendra',
    name: 'Pak Hendra',
    title: 'Petugas Sarpras & Keamanan',
    nameColor: '#eab308', // Kuning rompi keselamatan
    role: 'npc',
    portraitType: 'pak_hendra',
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
        text: 'Bip-bip! Selamat kembali di permukaan bumi, Rekan Penjelajah! Sekarang kita berada di ruang kelas sekolah untuk mempelajari mitigasi gempa bumi.',
        expression: 'happy',
        nextNodeId: 'node_2',
      },
      node_2: {
        id: 'node_2',
        speakerId: 'resqy',
        text: 'Gunakan tombol [A] / [D] atau D-Pad untuk bergerak, [SPASI] atau LONCAT untuk melompat, dan tombol [E] atau AKSI untuk berinteraksi.',
        expression: 'normal',
        nextNodeId: 'node_3',
      },
      node_3: {
        id: 'node_3',
        speakerId: 'resqy',
        text: 'Apakah kamu sudah siap menjelajahi Zona Prabencana di ruang kelas ini?',
        expression: 'happy',
        choices: [
          {
            id: 'c1',
            text: 'Siap, aku temui Bu Rahma dan teman-teman!',
            nextNodeId: 'node_ready',
          },
          {
            id: 'c2',
            text: 'Apa misi utama kita di kelas ini?',
            nextNodeId: 'node_mission',
          },
        ],
      },
      node_mission: {
        id: 'node_mission',
        speakerId: 'resqy',
        text: 'Pelajari denah kelas, perlengkapan Tas Siaga 72 Jam bersama Bu Rahma, dan SOP aksi keselamatan sebelum melangkah ke koridor simulasi gempa!',
        expression: 'normal',
        nextNodeId: 'node_ready',
      },
      node_ready: {
        id: 'node_ready',
        speakerId: 'resqy',
        text: 'Bagus sekali! Kumpulkan juga kristal kuning di ruangan dan selamat belajar!',
        expression: 'happy',
      },
    },
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 2. NPC RIAN (SISWA KELAS 8A - TATA RUANG & DENAH KELAS)
  // ═════════════════════════════════════════════════════════════════════════
  rian_dialogue: {
    id: 'rian_dialogue',
    title: 'Kesiapan Ruang Kelas bersama Rian',
    startNodeId: 'node_1',
    npcSpeakerId: 'rian',
    nodes: {
      node_1: {
        id: 'node_1',
        speakerId: 'rian',
        text: 'Hai! Wah, hebat sekali kamu baru saja menuntaskan ekspedisi geologi lapisan bumi! Sekarang kamu sudah kembali ke kelas 8A bersama kami.',
        expression: 'happy',
        nextNodeId: 'node_2',
      },
      node_2: {
        id: 'node_2',
        speakerId: 'player',
        text: 'Hai Rian! Sedang apa kamu memeriksa dinding dan lemari kelas?',
        expression: 'normal',
        nextNodeId: 'node_3',
      },
      node_3: {
        id: 'node_3',
        speakerId: 'rian',
        text: 'Aku sedang mengecek keselamatan ruang kelas kita. Sesuai panduan prabencana, kita harus mengenali denah ruangan, memastikan jalur pintu tidak terhalang bangku, dan lemari buku harus terkunci kuat ke dinding agar tidak roboh menimpa siswa saat terjadi getaran!',
        expression: 'serious',
        choices: [
          {
            id: 'c1',
            text: 'Benar sekali, mitigasi prabencana dimulai dari ruangan tempat kita belajar setiap hari!',
            nextNodeId: 'node_4',
          },
          {
            id: 'c2',
            text: 'Lalu apa yang harus kita pelajari selanjutnya di kelas ini, Rian?',
            nextNodeId: 'node_5',
          },
        ],
      },
      node_4: {
        id: 'node_4',
        speakerId: 'rian',
        text: 'Tepat! Kesiapsiagaan yang baik akan meminimalkan risiko kepanikan. Coba kamu temui Bu Rahma di depan kelas, beliau sedang menyiapkan modul Tas Siaga Bencana!',
        expression: 'happy',
      },
      node_5: {
        id: 'node_5',
        speakerId: 'rian',
        text: 'Di depan kelas ada Bu Rahma, guru IPA kita. Beliau memiliki perlengkapan penting yang harus disiapkan setiap keluarga untuk bertahan hidup saat darurat.',
        expression: 'normal',
      },
    },
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 3. NPC BU RAHMA (GURU IPA & PMR - TEMUAN 1: TAS SIAGA BENCANA 72 JAM)
  // ═════════════════════════════════════════════════════════════════════════
  bu_rahma_dialogue: {
    id: 'bu_rahma_dialogue',
    title: 'Materi Kesiapsiagaan bersama Bu Rahma',
    startNodeId: 'node_1',
    npcSpeakerId: 'bu_rahma',
    nodes: {
      node_1: {
        id: 'node_1',
        speakerId: 'bu_rahma',
        text: 'Selamat datang kembali di kelas, anakku! Ibu sangat bangga kamu telah memahami struktur bumi dan lempeng tektonik di Level 1.',
        expression: 'happy',
        nextNodeId: 'node_2',
      },
      node_2: {
        id: 'node_2',
        speakerId: 'bu_rahma',
        text: 'Sekarang saatnya kita menerapkan ilmu sains tersebut dalam kehidupan nyata. Mengapa kesiapsiagaan prabencana itu mutlak diperlukan bagi masyarakat Indonesia?',
        expression: 'normal',
        nextNodeId: 'node_3',
      },
      node_3: {
        id: 'node_3',
        speakerId: 'player',
        text: 'Karena gempa bumi adalah peristiwa alam yang datang secara mendadak tanpa tanda peringatan dini, Bu Rahma.',
        expression: 'normal',
        nextNodeId: 'node_4',
      },
      node_4: {
        id: 'node_4',
        speakerId: 'bu_rahma',
        text: 'Tepat sekali! Oleh sebab itu, setiap keluarga dan sekolah wajib menyiapkan Tas Siaga Bencana (TSB) yang dirancang untuk bertahan hidup minimal 72 jam pertama sebelum bantuan tim SAR tiba.',
        expression: 'serious',
        choices: [
          {
            id: 'c_view_tsb',
            text: 'Bolehkah saya meneliti isi dan perlengkapan Tas Siaga Bencana 72 Jam tersebut, Bu?',
            nextNodeId: 'node_open_tsb',
            triggerDiscoveryModal: 0,
            discoveryIdToMark: 'l2_q_disc_prep',
          },
          {
            id: 'c_ask_golden',
            text: 'Mengapa harus 72 jam, Bu Rahma?',
            nextNodeId: 'node_golden_time',
          },
        ],
      },
      node_golden_time: {
        id: 'node_golden_time',
        speakerId: 'bu_rahma',
        text: 'Periode 72 jam (3 hari) adalah Golden Time masa tanggap darurat, di mana akses jalan atau listrik seringkali terputus sehingga kita harus mandiri memenuhi kebutuhan dasar air, makanan, dan P3K.',
        expression: 'serious',
        choices: [
          {
            id: 'c_view_tsb_after',
            text: 'Baik Bu, saya ingin mengamati modul rincian Tas Siaga Bencana sekarang!',
            nextNodeId: 'node_open_tsb',
            triggerDiscoveryModal: 0,
            discoveryIdToMark: 'l2_q_disc_prep',
          },
        ],
      },
      node_open_tsb: {
        id: 'node_open_tsb',
        speakerId: 'bu_rahma',
        text: 'Bagus sekali! Pelajarilah setiap benda wajib di dalam tas tersebut. Modul temuan telah Ibu buka untukmu!',
        expression: 'happy',
      },
    },
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 4. NPC DITO (KETUA REGU PMR - KESIAPAN MENTAL & SIMULASI)
  // ═════════════════════════════════════════════════════════════════════════
  dito_dialogue: {
    id: 'dito_dialogue',
    title: 'Kesiapan Mental bersama Dito PMR',
    startNodeId: 'node_1',
    npcSpeakerId: 'dito',
    nodes: {
      node_1: {
        id: 'node_1',
        speakerId: 'dito',
        text: 'Halo kawan! Dari regu Palang Merah Remaja (PMR), kami rutin mengedukasi bahwa musuh terbesar saat gempa bumi bukanlah getaran itu sendiri, melainkan KEPANIKAN!',
        expression: 'serious',
        nextNodeId: 'node_2',
      },
      node_2: {
        id: 'node_2',
        speakerId: 'player',
        text: 'Bagaimana cara melatih diri agar kita tidak panik saat guncangan tiba-tiba terjadi, Dito?',
        expression: 'normal',
        nextNodeId: 'node_3',
      },
      node_3: {
        id: 'node_3',
        speakerId: 'dito',
        text: 'Kuncinya adalah latihan simulasi (drill) berulang-ulang! Refleks tubuh kita harus terlatih untuk langsung merunduk dan mencari perlindungan di bawah meja kokoh tanpa ragu.',
        expression: 'happy',
        choices: [
          {
            id: 'c1',
            text: 'Saya mengerti! Latihan membuat respon keselamatan menjadi spontan dan tenang.',
            nextNodeId: 'node_4',
          },
          {
            id: 'c2',
            text: 'Siapa yang memandu simulasi aksi keselamatan di kelas kita?',
            nextNodeId: 'node_5',
          },
        ],
      },
      node_4: {
        id: 'node_4',
        speakerId: 'dito',
        text: 'Tepat sekali! Temuilah Pak Surya di deretan meja belakang, beliau instruktur BNPB yang akan memperagakan langkah baku penyelamatan diri!',
        expression: 'happy',
      },
      node_5: {
        id: 'node_5',
        speakerId: 'dito',
        text: 'Pak Surya ada di meja sebelah sana! Beliau telah menyiapkan peragaan aksi merunduk, berlindung, dan bertahan.',
        expression: 'normal',
      },
    },
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 5. NPC PAK SURYA (INSTRUKTUR BNPB - TEMUAN 2: AKSI DROP-COVER-HOLD ON)
  // ═════════════════════════════════════════════════════════════════════════
  pak_surya_dialogue: {
    id: 'pak_surya_dialogue',
    title: 'Simulasi Aksi Keselamatan bersama Pak Surya',
    startNodeId: 'node_1',
    npcSpeakerId: 'pak_surya',
    nodes: {
      node_1: {
        id: 'node_1',
        speakerId: 'pak_surya',
        text: 'Salam tanggap bencana, anak muda! Saya Pak Surya dari tim pembina mitigasi. Saat sirine gempa berbunyi keras di sekolah, apa tindakan pertama yang wajib kamu ambil?',
        expression: 'serious',
        nextNodeId: 'node_2',
      },
      node_2: {
        id: 'node_2',
        speakerId: 'player',
        text: 'Apakah kita langsung berlari berebut keluar pintu, Pak?',
        expression: 'thinking',
        nextNodeId: 'node_3',
      },
      node_3: {
        id: 'node_3',
        speakerId: 'pak_surya',
        text: 'JANGAN PERNAH berlari saat bumi masih berguncang keras! Berlari saat lantai bergetar akan membuatmu terjatuh atau tertimpa reruntuhan plafon, kaca, dan lampu gantung!',
        expression: 'serious',
        nextNodeId: 'node_4',
      },
      node_4: {
        id: 'node_4',
        speakerId: 'pak_surya',
        text: 'Standar keselamatan dunia dan BNPB adalah 3 langkah baku: MERUNDUK merendahkan badan, BERLINDUNG di bawah meja kokoh mendekap kepala, dan BERTAHAN memegang erat kaki meja!',
        expression: 'happy',
        choices: [
          {
            id: 'c_view_action',
            text: 'Saya ingin melihat peragaan visual realistis dari 4 tahapan aksi tersebut, Pak!',
            nextNodeId: 'node_open_action',
            triggerDiscoveryModal: 1,
            discoveryIdToMark: 'l2_q_disc_action',
          },
          {
            id: 'c_ask_after',
            text: 'Lalu setelah guncangannya berhenti, apa yang harus dilakukan, Pak Surya?',
            nextNodeId: 'node_after_quake',
          },
        ],
      },
      node_after_quake: {
        id: 'node_after_quake',
        speakerId: 'pak_surya',
        text: 'Setelah guncangan berhenti total, barulah kita melakukan evakuasi tertib menyusuri tangga darurat menuju titik kumpul terbuka, sambil melindungi kepala dengan tas ransel!',
        expression: 'serious',
        choices: [
          {
            id: 'c_view_action_after',
            text: 'Siap Pak Surya! Buka modul peragaan simulasinya untuk saya pelajari.',
            nextNodeId: 'node_open_action',
            triggerDiscoveryModal: 1,
            discoveryIdToMark: 'l2_q_disc_action',
          },
        ],
      },
      node_open_action: {
        id: 'node_open_action',
        speakerId: 'pak_surya',
        text: 'Bagus! Cermati baik-baik posisi anatomi tubuh pada setiap tahapan aksi simulasi yang saya tampilkan.',
        expression: 'happy',
      },
    },
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 6. NPC SITI (KETUA OSIS - JALUR EVAKUASI & TITIK KUMPUL)
  // ═════════════════════════════════════════════════════════════════════════
  siti_dialogue: {
    id: 'siti_dialogue',
    title: 'Jalur Evakuasi Sekolah bersama Siti',
    startNodeId: 'node_1',
    npcSpeakerId: 'siti',
    nodes: {
      node_1: {
        id: 'node_1',
        speakerId: 'siti',
        text: 'Halo! Sebagai pengurus OSIS, kami telah memasang rambu jalur evakuasi hijau di sepanjang koridor sekolah menuju lapangan utama.',
        expression: 'happy',
        nextNodeId: 'node_2',
      },
      node_2: {
        id: 'node_2',
        speakerId: 'player',
        text: 'Ada aturan khusus saat kita menuruni gedung sekolah menuju lapangan, Siti?',
        expression: 'normal',
        nextNodeId: 'node_3',
      },
      node_3: {
        id: 'node_3',
        speakerId: 'siti',
        text: 'Tentu ada 3 aturan emas: 1. Jangan memakai sepatu hak tinggi atau licin, 2. JANGAN SEKALI-KALI MENGGUNAKAN LIFT karena listrik bisa padam seketika, dan 3. Berjalan tertib menyusuri tangga darurat tanpa saling dorong!',
        expression: 'serious',
        choices: [
          {
            id: 'c1',
            text: 'Mengapa tujuannya harus ke lapangan terbuka sekolah?',
            nextNodeId: 'node_4',
          },
          {
            id: 'c2',
            text: 'Terima kasih informasinya Siti, saya siap menuju gerbang pengujian!',
            nextNodeId: 'node_5',
          },
        ],
      },
      node_4: {
        id: 'node_4',
        speakerId: 'siti',
        text: 'Karena lapangan terbuka adalah Titik Kumpul (Assembly Point) yang bebas dari ancaman robohnya tembok gedung, tiang listrik, dan pohon tinggi.',
        expression: 'happy',
      },
      node_5: {
        id: 'node_5',
        speakerId: 'siti',
        text: 'Semangat! Temui Kak Fajar di ujung koridor untuk menguji pemahaman mitigasimu sebelum simulasi gempa dimulai!',
        expression: 'happy',
      },
    },
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 7. NPC KAK FAJAR (PENGUJI GERBANG - TEKA-TEKI SILANG MITIGASI PRABENCANA)
  // ═════════════════════════════════════════════════════════════════════════
  kak_fajar_dialogue: {
    id: 'kak_fajar_dialogue',
    title: 'Evaluasi Kesiapsiagaan bersama Kak Fajar',
    startNodeId: 'node_1',
    npcSpeakerId: 'kak_fajar',
    nodes: {
      node_1: {
        id: 'node_1',
        speakerId: 'kak_fajar',
        text: 'Berhenti sejenak, Penjelajah Muda! Koridor di belakangku mengarah langsung ke ruang simulasi gempa bumi Area 2.',
        expression: 'serious',
        nextNodeId: 'node_2',
      },
      node_2: {
        id: 'node_2',
        speakerId: 'kak_fajar',
        text: 'Sebelum kamu diizinkan melangkah lebih jauh, saya sebagai koordinator relawan sekolah harus memastikan: apakah kamu sudah benar-benar menguasai seluruh materi mitigasi prabencana di kelas ini?',
        expression: 'normal',
        nextNodeId: 'node_3',
      },
      node_3: {
        id: 'node_3',
        speakerId: 'player',
        text: 'Saya sudah belajar tentang penataan kelas, Tas Siaga 72 Jam bersama Bu Rahma, serta aksi keselamatan bersama Pak Surya!',
        expression: 'happy',
        nextNodeId: 'node_4',
      },
      node_4: {
        id: 'node_4',
        speakerId: 'kak_fajar',
        text: 'Bagus sekali! Namun kata-kata saja belum cukup. Saya menantangmu memecahkan Teka-Teki Silang (TTS) Kesiapsiagaan Mitigasi. Seluruh soal diambil murni dari materi yang baru saja kamu pelajari.',
        expression: 'happy',
        choices: [
          {
            id: 'c_start_tts',
            text: 'Saya siap! Buka Teka-Teki Silang Kesiapsiagaan sekarang, Kak Fajar!',
            nextNodeId: 'node_launch_tts',
            triggerCrossword: true,
          },
          {
            id: 'c_review_first',
            text: 'Tunggu sebentar Kak, saya ingin membaca kembali catatan di kelas.',
            nextNodeId: 'node_cancel',
          },
        ],
      },
      node_launch_tts: {
        id: 'node_launch_tts',
        speakerId: 'kak_fajar',
        text: 'Gunakan ingatan dan logikamu dengan baik. Selamat mengerjakan evaluasi!',
        expression: 'happy',
      },
      node_cancel: {
        id: 'node_cancel',
        speakerId: 'kak_fajar',
        text: 'Silakan pelajari kembali dengan tenang. Kembali ke sini jika kamu sudah siap membuktikan pemahamanmu!',
        expression: 'normal',
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
        text: 'Bip-bip! Selamat datang di Area 2: Simulasi Tanggap Gempa Bumi Ruang Kelas! Di area ini kita akan mempraktikkan langsung respons penyelamatan diri yang sesungguhnya.',
        expression: 'happy',
        nextNodeId: 'sim_brief_2',
      },
      sim_brief_2: {
        id: 'sim_brief_2',
        speakerId: 'resqy',
        text: 'Kamu akan bergabung di meja belajar bersama Bu Rahma dan teman-teman sekelasmu. Saat gempa mengguncang, kamu harus sigap melakukan Drop (Merunduk), Cover (Berlindung), dan Hold On (Bertahan) di bawah meja!',
        expression: 'serious',
        nextNodeId: 'sim_brief_3',
      },
      sim_brief_3: {
        id: 'sim_brief_3',
        speakerId: 'resqy',
        text: 'Apakah kamu sudah siap melakukan simulasi gempa bumi sekarang?',
        expression: 'thinking',
        choices: [
          {
            id: 'c_start_sim',
            text: 'Siap, Mulai Simulasi!',
            nextNodeId: 'sim_start_go',
            triggerSimulation: true,
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
        text: 'Bagus! Duduklah di mejamu, perhatikan penjelasan Bu Rahma, dan bersiaplah bertindak cepat jika sirine gempa berbunyi!',
        expression: 'happy',
      },
      sim_cancel: {
        id: 'sim_cancel',
        speakerId: 'resqy',
        text: 'Baiklah! Silakan amati denah kelas dan jalur evakuasi terlebih dahulu. Bicaralah padaku lagi jika kamu sudah siap memulai simulasi!',
        expression: 'normal',
      },
    },
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 7. CUTSCENE PEMBELAJARAN KELAS BERSAMA BU RAHMA SEBELUM GEMPA
  // ═════════════════════════════════════════════════════════════════════════
  bu_rahma_teaching_cutscene: {
    id: 'bu_rahma_teaching_cutscene',
    title: 'Kegiatan Belajar Matematika Bersama Bu Rahma',
    startNodeId: 'teach_1',
    npcSpeakerId: 'bu_rahma',
    nodes: {
      teach_1: {
        id: 'teach_1',
        speakerId: 'bu_rahma',
        text: 'Baik anak-anak, mari kita mulai pelajaran matematika hari ini. Perhatikan rumus Teorema Pythagoras di papan tulis depan: a² + b² = c².',
        expression: 'normal',
        nextNodeId: 'teach_2',
      },
      teach_2: {
        id: 'teach_2',
        speakerId: 'bu_rahma',
        text: 'Jika sisi tegak a = 3 meter dan sisi alas b = 4 meter, maka kuadrat sisi miring adalah 9 + 16 = 25. Maka panjang sisi miring c adalah akar 25, yaitu 5 meter!',
        expression: 'happy',
        nextNodeId: 'teach_3',
      },
      teach_3: {
        id: 'teach_3',
        speakerId: 'rian',
        text: 'Wah, jelas sekali Bu! Jadi sisi miring c selalu merupakan sisi terpanjang pada segitiga siku-siku ya Bu?',
        expression: 'happy',
        nextNodeId: 'teach_4',
      },
      teach_4: {
        id: 'teach_4',
        speakerId: 'bu_rahma',
        text: 'Tepat sekali, Rian! Sekarang coba kalian semua buka buku paket matematika halaman 42 dan siapkan alat tulis... —',
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
        text: 'Wah, kamu sudah siap ikut simulasi gempa? Ingat ya, begitu lantai berguncang, langsung merunduk di bawah mejamu!',
        expression: 'happy',
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
  bu_rahma_quake_alert: {
    id: 'bu_rahma_quake_alert',
    title: 'Peringatan Darurat Gempa oleh Bu Rahma',
    startNodeId: 'alert_1',
    npcSpeakerId: 'bu_rahma',
    nodes: {
      alert_1: {
        id: 'alert_1',
        speakerId: 'bu_rahma',
        text: 'GEMPA BUMI! Semuanya, cepat MERUNDUK dan BERLINDUNG di bawah meja masing-masing! Dekap tengkuk dan pegang erat kaki meja!',
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
        text: 'Bip-bop! Selamat datang di Lapangan Terbuka Sekolah, zona titik kumpul resmi pasca-evakuasi gempa bumi!',
        expression: 'happy',
        nextNodeId: 'resqy_f_2',
      },
      resqy_f_2: {
        id: 'resqy_f_2',
        speakerId: 'resqy',
        text: 'Di area terbuka ini kita aman dari reruntuhan plafon dan pecahan kaca. Namun kita harus tetap siaga mengantisipasi getaran susulan!',
        expression: 'normal',
        nextNodeId: 'resqy_f_3',
      },
      resqy_f_3: {
        id: 'resqy_f_3',
        speakerId: 'resqy',
        text: 'Di sini kita mempelajari SOP instalasi darurat, pertolongan pertama (P3K) korban cedera, dan pendataan resmi sekolah.',
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
        text: 'Lapangan terbuka jauh dari bahaya reruntuhan dinding bangunan, pecahan kaca jendela, atau tiang listrik yang bisa roboh jika gempa susulan datang!',
        expression: 'serious',
        nextNodeId: 'resqy_f_mission',
      },
      resqy_f_mission: {
        id: 'resqy_f_mission',
        speakerId: 'resqy',
        text: 'Temui Pak Hendra di panel listrik & APAR, dr. Alisa di posko PMI, dan Pak Bambang selaku Kepala Sekolah. Lalu temui Komandan Satria di gerbang keluar!',
        expression: 'happy',
      },
    },
  },

  pak_hendra_dialogue: {
    id: 'pak_hendra_dialogue',
    title: 'Pemeriksaan Instalasi Vital bersama Pak Hendra',
    startNodeId: 'hendra_1',
    npcSpeakerId: 'pak_hendra',
    nodes: {
      hendra_1: {
        id: 'hendra_1',
        speakerId: 'pak_hendra',
        text: 'Halo Nak! Syukurlah kamu dan kawan-kawan berhasil keluar kelas dengan tertib dan selamat ke lapangan ini.',
        expression: 'happy',
        nextNodeId: 'hendra_2',
      },
      hendra_2: {
        id: 'hendra_2',
        speakerId: 'pak_hendra',
        text: 'Sebagai petugas sarpras, langkah pertama saya tadi adalah segera mematikan MCB sakelar utama listrik dan menutup rapat katup tabung gas di kantin.',
        expression: 'serious',
        choices: [
          {
            id: 'c_hendra_q',
            text: 'Mengapa sakelar listrik dan tabung gas harus segera dimatikan, Pak?',
            nextNodeId: 'hendra_3',
          },
        ],
      },
      hendra_3: {
        id: 'hendra_3',
        speakerId: 'pak_hendra',
        text: 'Karena guncangan sering merusak insulasi kabel dan meretakkan pipa gas. Percikan listrik kecil saja dapat menyulut kebakaran hebat!',
        expression: 'thinking',
        nextNodeId: 'hendra_4',
      },
      hendra_4: {
        id: 'hendra_4',
        speakerId: 'pak_hendra',
        text: 'Jauhi juga dinding retak dan tiang listrik gantung di tepi lapangan. Ayo temui dr. Alisa di tenda PMI untuk pemeriksaan kesehatan.',
        expression: 'normal',
      },
    },
  },

  dito_field_dialogue: {
    id: 'dito_field_dialogue',
    title: 'Koordinasi Regu PMR & OSIS di Lapangan',
    startNodeId: 'dito_f_1',
    npcSpeakerId: 'dito',
    nodes: {
      dito_f_1: {
        id: 'dito_f_1',
        speakerId: 'dito',
        text: 'Halo! Aku dan Siti dari PMR dan OSIS sedang membantu mendata teman-teman yang membutuhkan perban dan istirahat di tenda medis.',
        expression: 'serious',
        nextNodeId: 'dito_f_2',
      },
      dito_f_2: {
        id: 'dito_f_2',
        speakerId: 'siti',
        text: 'Kami juga membantu Bu Rahma mencatat presensi kehadiran tiap kelas. Tidak boleh ada satu pun siswa yang tertinggal di dalam gedung!',
        expression: 'happy',
      },
    },
  },

  dr_alisa_dialogue: {
    id: 'dr_alisa_dialogue',
    title: 'Posko Medis Pascabencana bersama dr. Alisa',
    startNodeId: 'alisa_1',
    npcSpeakerId: 'dr_alisa',
    nodes: {
      alisa_1: {
        id: 'alisa_1',
        speakerId: 'dr_alisa',
        text: 'Halo anak muda! Selamat datang di posko triage pertolongan pertama PMI. Kami sedang menangani siswa yang mengalami lecet dan syok ringan.',
        expression: 'happy',
        nextNodeId: 'alisa_2',
      },
      alisa_2: {
        id: 'alisa_2',
        speakerId: 'dr_alisa',
        text: 'Dalam penanganan pascabencana, luka gores segera dibersihkan dan dibalut. Namun korban cedera punggung berat jangan digeser tanpa tandu resmi!',
        expression: 'serious',
        choices: [
          {
            id: 'c_alisa_disc',
            text: 'Boleh saya pelajari modul SOP Keselamatan & Medis Pascabencana, Dok?',
            nextNodeId: 'alisa_teach',
            discoveryIdToMark: 'disc-post-safety',
            triggerDiscoveryModal: 0,
          },
        ],
      },
      alisa_teach: {
        id: 'alisa_teach',
        speakerId: 'dr_alisa',
        text: 'Luar biasa semangat belajarmu! Ingat, utamakan keselamatan dirimu terlebih dahulu sebelum memberikan pertolongan kepada orang lain.',
        expression: 'happy',
      },
    },
  },

  pak_bambang_dialogue: {
    id: 'pak_bambang_dialogue',
    title: 'Manajemen Titik Kumpul bersama Pak Bambang',
    startNodeId: 'bambang_1',
    npcSpeakerId: 'pak_bambang',
    nodes: {
      bambang_1: {
        id: 'bambang_1',
        speakerId: 'pak_bambang',
        text: 'Selamat siang anak-anakku. Bapak sangat bersyukur melihat ketertiban dan ketenangan kalian saat evakuasi menuju titik kumpul ini.',
        expression: 'happy',
        nextNodeId: 'bambang_2',
      },
      bambang_2: {
        id: 'bambang_2',
        speakerId: 'pak_bambang',
        text: 'Di lapangan terbuka ini, bapak guru dan wali kelas sedang memastikan presensi lengkap dan menyaring informasi agar tidak ada kabar bohong beredar.',
        expression: 'serious',
        choices: [
          {
            id: 'c_bambang_disc',
            text: 'Bolehkah saya mempelajari panduan Manajemen Titik Kumpul & Komunikasi Resmi, Pak?',
            nextNodeId: 'bambang_teach',
            discoveryIdToMark: 'disc-post-coordination',
            triggerDiscoveryModal: 1,
          },
        ],
      },
      bambang_teach: {
        id: 'bambang_teach',
        speakerId: 'pak_bambang',
        text: 'Sangat bijak! Pemahaman manajemen ini menjaga kita semua tetap solid, tenang, dan tidak panik terpengaruh hoaks.',
        expression: 'happy',
      },
    },
  },

  komandan_satria_dialogue: {
    id: 'komandan_satria_dialogue',
    title: 'Evaluasi Kelayakan Evakuasi bersama Komandan Satria',
    startNodeId: 'satria_1',
    npcSpeakerId: 'komandan_satria',
    nodes: {
      satria_1: {
        id: 'satria_1',
        speakerId: 'komandan_satria',
        text: 'Lapor komando! Saya Komandan Satria dari satuan SAR & BPBD. Seluruh area titik kumpul lapangan ini telah kami verifikasi keamanannya.',
        expression: 'serious',
        nextNodeId: 'satria_2',
      },
      satria_2: {
        id: 'satria_2',
        speakerId: 'komandan_satria',
        text: 'Sebelum gerbang evakuasi akhir kami buka menuju posko transit terpadu, saya ingin menguji pemahaman mitigasi pascabencana yang telah kamu pelajari.',
        expression: 'normal',
        nextNodeId: 'satria_3',
      },
      satria_3: {
        id: 'satria_3',
        speakerId: 'komandan_satria',
        text: 'Apakah kamu sudah paham mengenai kewaspadaan bahaya lanjutan, prosedur di titik kumpul, pertolongan pertama, dan sumber informasi resmi?',
        expression: 'thinking',
        choices: [
          {
            id: 'c_satria_challenge',
            text: 'Siap Komandan! Saya sudah mempelajari seluruh materi dan siap dievaluasi!',
            nextNodeId: 'satria_ready',
            triggerCrossword: true,
          },
          {
            id: 'c_satria_back',
            text: 'Beri saya waktu sebentar untuk mengulang materi di posko medis dan tenda komando.',
            nextNodeId: 'satria_later',
          },
        ],
      },
      satria_ready: {
        id: 'satria_ready',
        speakerId: 'komandan_satria',
        text: 'Luar biasa! Buktikan ketajaman wawasan mitigasimu dalam teka-teki silang ini!',
        expression: 'happy',
      },
      satria_later: {
        id: 'satria_later',
        speakerId: 'komandan_satria',
        text: 'Baik, silakan tinjau kembali posko dr. Alisa dan Pak Bambang. Saya berjaga di gerbang ini menunggumu.',
        expression: 'normal',
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

  budi_field_dialogue: {
    id: 'budi_field_dialogue',
    title: 'Pengalaman Budi Menghadapi Gempa',
    startNodeId: 'budi_f_1',
    npcSpeakerId: 'rian',
    nodes: {
      budi_f_1: {
        id: 'budi_f_1',
        speakerId: 'rian',
        text: 'Tadi aku sempat panik saat meja bergetar keras. Tapi melihat Bu Rahma dan kawan-kawan sigap memegang kaki meja, aku jadi ikut tenang.',
        expression: 'normal',
        nextNodeId: 'budi_f_2',
      },
      budi_f_2: {
        id: 'budi_f_2',
        speakerId: 'rian',
        text: 'Lapangan terbuka sekolah ini luas dan hijau. Selama kita tidak berdiri di bawah tiang listrik, kita aman dari bahaya gempa susulan!',
        expression: 'happy',
      },
    },
  },

  maya_field_dialogue: {
    id: 'maya_field_dialogue',
    title: 'Imbauan Menghindari Berita Hoaks bersama Maya',
    startNodeId: 'maya_f_1',
    npcSpeakerId: 'siti',
    nodes: {
      maya_f_1: {
        id: 'maya_f_1',
        speakerId: 'siti',
        text: 'Semua teman sekelas kita sudah berkumpul lengkap di dekat tiang bendera dan pos komando.',
        expression: 'happy',
        nextNodeId: 'maya_f_2',
      },
      maya_f_2: {
        id: 'maya_f_2',
        speakerId: 'siti',
        text: 'Ingat ya teman-teman, jangan mudah percaya atau menyebarkan pesan berantai yang menakut-nakuti di ponsel. Selalu dengarkan informasi resmi dari BMKG dan BPBD lewat pengeras suara Kepala Sekolah!',
        expression: 'serious',
      },
    },
  },

};

