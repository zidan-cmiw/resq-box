// ── src/components/Tutorial/tutorialConfig.ts ────────────────────────────
// Konfigurasi Lengkap Panduan Interaktif Maskot Resqy (Onboarding Walkthrough)
// Mendukung diferensiasi Akun Siswa & Akun Guru di semua halaman aplikasi.

export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  badge?: string;
  targetSelector?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  actionHint?: string;
}

export interface TutorialTourConfig {
  key: string;
  pageTitle: string;
  steps: TutorialStep[];
}

// ── LOCAL STORAGE PERSISTENCE HELPERS ──
const STORAGE_PREFIX = 'resqbox_tour_completed_';

export function isTutorialCompleted(tourKey: string, userId?: string): boolean {
  try {
    const key = `${STORAGE_PREFIX}${tourKey}_${userId || 'guest'}`;
    return localStorage.getItem(key) === 'true';
  } catch {
    return false;
  }
}

export function setTutorialCompleted(tourKey: string, userId?: string): void {
  try {
    const key = `${STORAGE_PREFIX}${tourKey}_${userId || 'guest'}`;
    localStorage.setItem(key, 'true');
  } catch {
    // Ignore storage quota errors
  }
}

export function resetTutorial(tourKey: string, userId?: string): void {
  try {
    const key = `${STORAGE_PREFIX}${tourKey}_${userId || 'guest'}`;
    localStorage.removeItem(key);
  } catch {
    // Ignore storage errors
  }
}

export function resetAllTutorials(userId?: string): void {
  try {
    const suffix = `_${userId || 'guest'}`;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(STORAGE_PREFIX) && k.endsWith(suffix)) {
        localStorage.removeItem(k);
      }
    }
  } catch {
    // Ignore storage errors
  }
}

// ── TOUR DEFINITIONS PER PAGE ──

export const TUTORIAL_TOURS: Record<string, TutorialTourConfig> = {
  // ── 1. HALAMAN LOGIN ──
  login: {
    key: 'login',
    pageTitle: 'Gerbang Masuk RESQ-BOX',
    steps: [
      {
        id: 'welcome',
        title: 'Kuk-kuuk! Selamat Datang di RESQ-BOX!',
        badge: 'GERBANG MASUK',
        placement: 'center',
        content:
          'Halo penjelajah muda! Aku Resqy, burung hantu pemandu ekspedisi RESQ-BOX. Platform ini adalah media pembelajaran IPA SMP Kelas 8 berbasis petualangan pixel untuk mempelajari struktur bumi dan kesiapsiagaan bencana geologis!',
        actionHint: 'Klik "Lanjut" untuk melihat cara masuk ke permainan.',
      },
      {
        id: 'roles',
        title: 'Pilih Peran Akunmu',
        badge: 'PILIHAN PERAN',
        targetSelector: '#tour-login-roles',
        placement: 'bottom',
        content:
          'Pilih peranmu terlebih dahulu: [AKUN SISWA] untuk bermain petualangan sains Level 1-3, atau [AKUN GURU] untuk bapak/ibu guru yang ingin mengelola kelas dan memantau rapor nilai siswa.',
      },
      // Langkah tour "auth_modes" (Masuk Akun atau Daftar Baru) DIHAPUS.
      //
      // Langkah itu menunjuk `#tour-login-modes` dan menyuruh siswa menekan
      // [DAFTAR AKUN BARU]. Keduanya sudah tidak ada: pendaftaran mandiri
      // ditutup, akun siswa dibuat oleh guru, dan tombolnya dihapus dari
      // halaman login.
      //
      // Kalau langkah ini dibiarkan, panduan akan menyorot elemen yang tidak
      // ada — sehingga kotak panduannya muncul tanpa arah, dan siswa disuruh
      // menekan tombol yang tidak terlihat.
      //
      // Petunjuk "belum punya akun" kini tampil tetap di bawah formulir login,
      // jadi tidak lagi memerlukan langkah panduan tersendiri.
      {
        id: 'form_inputs',
        title: 'Formulir Username & Password',
        badge: 'INPUT DATA',
        targetSelector: '#tour-login-inputs',
        placement: 'top',
        content:
          'Ayo masukkan username dan password akunmu di sini, lalu tekan tombol [MASUK SEKARANG] untuk meluncur ke markas utama permainan!',
      },
      // Langkah tour "Uji Coba Cepat (Akun Demo)" DIHAPUS bersama kotak akun
      // demo di halaman login. Langkah itu menyuruh siswa memakai akun demo
      // yang membuka seluruh level, dan kredensialnya ditampilkan terbuka.
    ],
  },

  // ── 2. HALAMAN DASHBOARD (SISWA) ──
  dashboard_student: {
    key: 'dashboard_student',
    pageTitle: 'Beranda Markas RESQ-BOX',
    steps: [
      {
        id: 'dash_intro',
        title: 'Kuk-kuuk! Selamat Datang di RESQ-BOX!',
        badge: 'TENTANG RESQ-BOX',
        placement: 'center',
        content:
          'Hai, selamat datang di RESQ-BOX!\n\nWebsite ini adalah media pembelajaran interaktif IPA SMP Kelas 8 berbasis petualangan eksplorasi dan gamifikasi mitigasi bencana geologis.\n\nDi sini, kamu akan mempelajari 3 materi utama:\n1. Struktur Interior Bumi & Batas Lempeng: Menembus interior bumi dari kerak (0 km), mantel, hingga inti dalam (6.371 km) serta dinamika 3 batas lempeng tektonik.\n2. Kesiapsiagaan Bencana Geologis: Mengenal bahaya gempa bumi dan erupsi Gunung Merapi, mempraktikkan SOP 72 Jam & Tas Siaga Bencana (TSB), drill evakuasi, pembacaan seismograf, hingga peta KRB.\n3. Sistem Peringatan Dini Bencana (EWS): Menyusun balok aksi-reaksi penyelamatan bencana (sirine bahaya & tanda peringatan) serta mengamati respon evakuasi warga desa pada simulasi 3D lereng Gunung Merapi!\n\nMari kita kenali alur petualangan dan fitur yang ada di markas ini bersama Resqy!',
        actionHint: 'Klik "Lanjut" untuk melihat alur 3 tahap pembelajaran.',
      },
      {
        id: 'dash_curriculum',
        title: 'Alur 3 Tahap Petualangan Pembelajaran',
        badge: 'STRATEGI BELAJAR',
        placement: 'center',
        content:
          'Petualangan belajarmu dirancang dalam 3 Tahap Berjenjang:\n\n• Tahap 1 (Earth Explorer): Menjelajahi 8 area geologis interior bumi & memecahkan tebak kata Wordle Sains bersama Bu Tyas\n• Tahap 2 (Disaster Analyst): Menuntaskan 6 pos mitigasi lereng Merapi & menjawab kuis Teka-Teki Silang (TTS Mitigasi).\n• Tahap 3 (Simulation Game): Menyelesaikan 20 misi simulasi penyelamatan bencana di lab mitigasi & mengamati dampaknya pada model 3D lereng Merapi.\n\nSemua skor dan progres belajarmu akan otomatis tersimpan ke Rapor Posko Gurumu!',
      },
      {
        id: 'dash_level1',
        title: 'Level 1: Earth Explorer',
        badge: 'TAHAP 1',
        targetSelector: '#tour-dash-level1',
        placement: 'right',
        content:
          'Tombol ini membuka Level 1: Earth Explorer! Kamu akan meluncur menembus kerak, mantel, hingga inti dalam bumi melintasi 8 area geologis dan memecahkan Wordle Sains bersama Bu Tyas',
      },
      {
        id: 'dash_level2',
        title: 'Level 2: Disaster Analyst',
        badge: 'TAHAP 2',
        targetSelector: '#tour-dash-level2',
        placement: 'right',
        content:
          'Tombol ini membuka Level 2: Disaster Analyst! Di sini kamu menelusuri 6 pos kesiapsiagaan lereng Merapi, SOP 72 Jam TSB, simulasi drill gempa, status PVMBG, hingga barak BNPB. Selesaikan Level 1 terlebih dahulu untuk membukanya!',
      },
      {
        id: 'dash_level3',
        title: 'Level 3: Simulation Game',
        badge: 'TAHAP 3',
        targetSelector: '#tour-dash-level3',
        placement: 'right',
        content:
          'Tombol ini membuka Level 3: Simulation Game! Kamu akan menyusun balok aksi-reaksi penyelamatan bencana dan menguji dampaknya pada simulasi 3D lereng Merapi serta alat peraga diorama fisik RESQ-BOX. Terbuka setelah lulus Level 2!',
      },
      {
        id: 'dash_guide',
        title: 'Tombol Panduan & Misi Belajar',
        badge: 'PAPAN PANDUAN',
        targetSelector: '#tour-dash-guide',
        placement: 'right',
        content:
          'Klik tombol [PANDUAN & MISI] kapan saja untuk membuka Papan Pengumuman resmi! Terdapat 4 tab lengkap yang memuat ringkasan materi, target kelulusan tiap level, dan panduan kontrol.',
      },
      {
        id: 'dash_profile',
        title: 'Tombol Profil & Kustomisasi Avatar',
        badge: 'PROFIL SISWA',
        targetSelector: '#tour-dash-profile',
        placement: 'right',
        content:
          'Klik [PROFIL SISWA] untuk merancang avatar karakter pixel unikmu di Bengkel Avatar, melengkapi data diri (kelas & absen), serta memantau tingkat kesiapsiagaan belajarmu!',
      },
      {
        id: 'dash_hud',
        title: 'Kartu HUD Siswa & Kontrol Audio',
        badge: 'STATUS PEMAIN',
        targetSelector: '#tour-dash-hud',
        placement: 'bottom',
        content:
          'Di sudut atas terdapat HUD identitasmu (nama, kelas, avatar, dan level aktif), tombol musik retro chiptune 8-bit, serta tombol mode layar penuh (fullscreen) untuk pengalaman bermain yang lebih imersif!',
        actionHint: 'Siap menjelajah? Klik Level 1 untuk memulai petualangan pertamamu!',
      },
    ],
  },

  // ── 3. HALAMAN DASHBOARD (GURU) ──
  dashboard_teacher: {
    key: 'dashboard_teacher',
    pageTitle: 'Beranda Guru RESQ-BOX',
    steps: [
      {
        id: 'dash_teacher_intro',
        title: 'Kuk-kuuk! Selamat Datang, Bapak/Ibu Guru!',
        badge: 'PORTAL MEDIA AJAR',
        placement: 'center',
        content:
          'Selamat datang di platform RESQ-BOX, Bapak/Ibu Guru!\n\nRESQ-BOX adalah media pembelajaran interaktif IPA SMP Kelas 8 berbasis gamifikasi edukatif untuk materi Struktur Lapisan Bumi dan Mitigasi Bencana Geologis.\n\nPlatform ini memuat 3 level pembelajaran:\n• Level 1: Eksplorasi Interior Lapisan Bumi & Lempeng Tektonik.\n• Level 2: Mitigasi Bahaya Gempa & Erupsi Lereng Gunung Merapi (SOP 72 Jam TSB & Drill).\n• Level 3: Lab Simulasi Sistem Peringatan Dini (EWS) dengan Balok Aksi-Reaksi Mitigasi & Diorama 3D Lereng Merapi.\n\nBapak/Ibu dapat menguji ketiga level ini atau membuka Posko Guru untuk memantau kemajuan belajar siswa.',
        actionHint: 'Klik "Lanjut" untuk melihat fitur beranda guru.',
      },
      {
        id: 'dash_teacher_levels',
        title: 'Eksplorasi Level Pembelajaran',
        badge: 'LEVEL AJAR',
        targetSelector: '#tour-dash-level1',
        placement: 'right',
        content:
          'Sebagai akun Guru, Bapak/Ibu dapat membuka dan menguji ketiga level pembelajaran (Level 1: Struktur Bumi, Level 2: Mitigasi Bencana, dan Level 3: Lab Simulasi) untuk demonstrasi di kelas.',
      },
      {
        id: 'dash_teacher_portal_btn',
        title: 'Akses Langsung ke Posko Guru',
        badge: 'POSKO GURU',
        targetSelector: '#tour-dash-profile',
        placement: 'right',
        content:
          'Klik tombol [POSKO GURU] ini untuk membuka ruang manajemen kelas, membagikan kode kelas, memantau nilai tugas siswa real-time, serta mencetak rapor evaluasi!',
      },
    ],
  },

  // ── 4. HALAMAN PROFIL SISWA ──
  profile: {
    key: 'profile',
    pageTitle: 'Halaman Profil Penjelajah',
    steps: [
      {
        id: 'profile_intro',
        title: 'Kuk-kuuk! Ini Halaman Profilmu!',
        badge: 'IDENTITAS SISWA',
        placement: 'center',
        content:
          'Di halaman ini, kamu bisa mempercantik tampilan karakter penjelajahmu, melengkapi data sekolah, mengganti password akun, dan memeriksa pencapaian kesiapsiagaanmu!',
      },
      {
        id: 'profile_avatar',
        title: 'Bengkel Avatar Pixel Kustom',
        badge: 'BENGKEL AVATAR',
        targetSelector: '#tour-profile-avatar',
        placement: 'bottom',
        content:
          'Klik tombol oranye [Buka Bengkel Avatar] untuk merancang karaktermu sendiri! Kamu bebas memilih warna kulit, gaya rambut, pakaian seragam, mata, dan aksesoris keren.',
      },
      {
        id: 'profile_fields',
        title: 'Formulir Identitas Siswa',
        badge: 'DATA DIRI',
        targetSelector: '#tour-profile-fields',
        placement: 'top',
        content:
          'Pastikan Nama Lengkap, Kelas, Nomor Absen, dan Nama Sekolahmu terisi dengan benar agar nilai tugasmu tercatat akurat pada rapor evaluasi bapak/ibu guru.',
      },
      {
        id: 'profile_password',
        title: 'Keamanan & Ganti Password',
        badge: 'KEAMANAN AKUN',
        targetSelector: '#tour-profile-password',
        placement: 'top',
        content:
          'Ingin mengganti password akunmu? Cukup ketik password baru di kedua kolom ini (minimal 6 karakter). Kosongkan bila tidak ingin mengubah password.',
      },
      {
        id: 'profile_readiness',
        title: 'Rekam Jejak Kesiapsiagaan Belajar',
        badge: 'STATUS LEVEL',
        targetSelector: '#tour-profile-readiness',
        placement: 'top',
        content:
          'Di kotak ini, kamu bisa memantau status Stage 1 (Earth Explorer), Stage 2 (Disaster Analyst), dan Stage 3 (Simulation Game) yang telah berhasil kamu selesaikan!',
      },
      {
        id: 'profile_actions',
        title: 'Simpan Perubahan & Kembali',
        badge: 'SIMPAN DATA',
        targetSelector: '#tour-profile-actions',
        placement: 'top',
        content:
          'Setelah selesai mengubah avatar atau data diri, jangan lupa klik tombol [SIMPAN PROFIL]! Kemudian klik [KEMBALI KE MENU UTAMA] untuk kembali ke beranda.',
      },
    ],
  },

  // ── 5. HALAMAN LEVEL 1 (EARTH EXPLORER) ──
  level1: {
    key: 'level1',
    pageTitle: 'Tahap 1: Earth Explorer',
    steps: [
      {
        id: 'l1_intro',
        title: 'Kuk-kuuk! Selamat Datang di Earth Explorer!',
        badge: 'STRUKTUR BUMI',
        placement: 'center',
        content:
          'Kamu memulai ekspedisi menembus perut bumi sedalam 6.371 km! Misimu adalah mempelajari struktur interior bumi (kerak, mantel, inti luar, inti dalam) serta dinamika 3 batas lempeng tektonik.',
      },
      {
        id: 'l1_controls',
        title: 'Kontrol Navigasi Penjelajah',
        badge: 'CARA BERGERAK',
        placement: 'center',
        content:
          '• Berjalan: Tekan tombol [A] / [D] atau Tombol Panah Kiri / Kanan (atau D-Pad Sentuh di tablet/HP).\n• Melompat: Tekan tombol [Spasi] atau tombol [LONCAT].\n• Berinteraksi: Tekan tombol [E] atau tombol [AKSI] di dekat objek/NPC.',
      },
      {
        id: 'l1_npcs',
 title: 'Temui Rekan Tim & Modul Sains ',
        badge: 'EDUKASI SAINS',
        placement: 'center',
        content:
 'Dekati rekan ekspedisimu (Zidane, Zahra, Ican, Lintang). Rekan yang memiliki lencana kaca pembesar memegang materi sains penting. Bacalah modulnya karena menjadi kunci menjawab kuis gerbang!',
      },
      {
        id: 'l1_tracker',
        title: 'Radar Bumi & Journey Progress Tracker',
        badge: 'PELACAK KEDALAMAN',
        placement: 'center',
        content:
          'Di kanan atas terdapat Radar Bumi yang menyorot lapisan aktifmu. Di bawah layar terdapat bar pelacak 8 area geologis dengan miniatur avatarmu yang meluncur mulus secara real-time!',
      },
      {
        id: 'l1_wordle',
        title: 'Tantangan Gerbang Bu Tyas (Wordle)',
        badge: 'EVALUASI STRATA',
        placement: 'center',
        content:
          'Di setiap ujung lapisan, temui Bu Tyas dan selesaikan tantangan tebak kata Wordle Sains! Semua kata kunci diambil dari materi rekan timmu. Tuntaskan 8 area untuk membuka Level 2!',
        actionHint: 'Selamat menjelajah, kumpulkan kristal geotermal dan tembus inti bumi!',
      },
    ],
  },

  // ── 6. HALAMAN LEVEL 2 (DISASTER ANALYST) ──
  level2: {
    key: 'level2',
    pageTitle: 'Tahap 2: Disaster Analyst',
    steps: [
      {
        id: 'l2_intro',
        title: 'Kuk-kuuk! Selamat Datang di Disaster Analyst!',
        badge: 'ANALISIS BENCANA',
        placement: 'center',
        content:
          'Di Level 2, kamu berada di kawasan lereng Gunung Merapi untuk mempelajari analisis risiko gempa bumi dan erupsi vulkanik serta prosedur kesiapsiagaan darurat mandiri!',
      },
      {
        id: 'l2_zones',
        title: '6 Pos Mitigasi Kebencanaan',
        badge: 'POS MITIGASI',
        placement: 'center',
        content:
          'Jelajahi 6 pos berurutan:\n1. Ruang Kelas: SOP 72 Jam & Tas Siaga Bencana (TSB)\n2. Simulasi Drill Gempa: Drop, Cover, and Hold On\n3. Lapangan Evakuasi: Titik Kumpul terbuka aman\n4. Pos PGA Merapi: Seismograf & Status PVMBG\n5. Simulasi Erupsi: Peta KRB I-III saat AWAS\n6. Barak BNPB: Posko pengungsian mandiri.',
      },
      {
        id: 'l2_quiz',
        title: 'Evaluasi Teka-Teki Silang (TTS Crossword)',
        badge: 'EVALUASI MITIGASI',
        placement: 'center',
        content:
 'Pelajari materi buku saku BNPB bertanda dan temui Bu Tyas di pos pengujian untuk menjawab Teka-Teki Silang Mitigasi. Menuntaskan seluruh 6 pos akan membuka Level 3!',
        actionHint: 'Langkahkan kakimu, pelajari mitigasi, dan selamatkan warga!',
      },
    ],
  },

  // ── 7. HALAMAN LEVEL 3 (SIMULATION GAME) ──
  level3: {
    key: 'level3',
    pageTitle: 'Tahap 3: Simulation Game',
    steps: [
      {
        id: 'l3_intro',
        title: 'Kuk-kuuk! Selamat Datang di Action Lab!',
        badge: 'LAB SIMULASI',
        placement: 'center',
        content:
          'Di Level 3 ini, kamu berperan sebagai komandan sistem peringatan dini cerdas untuk menyelamatkan warga desa dari ancaman gempa dan erupsi Gunung Merapi!',
      },
      {
        id: 'l3_sectors',
        title: '20 Misi Studi Kasus Bertingkat',
        badge: 'SEKTOR MISI',
        placement: 'center',
        content:
          'Terdapat 20 Misi Studi Kasus dalam 4 sektor pembelajaran mitigasi:\n• Sektor 1: Pengenalan Peringatan Dini (EWS) & Deteksi Tanda Bahaya Bencana\n• Sektor 2: Kesiapsiagaan Gempa Bumi (Ringan, Sedang, Kuat)\n• Sektor 3: Mitigasi Erupsi Efusif (Lelehan Lava & Alur Lahar Dingin)\n• Sektor 4: Mitigasi Erupsi Eksplosif (Awan Panas) & Tantangan Terpadu Penyelamatan.',
      },
      {
        id: 'l3_blockly',
        title: 'Balok Aksi-Reaksi Mitigasi Bencana',
        badge: 'BALOK PENYELAMATAN',
        placement: 'center',
        content:
          'Susun rantai penyelamatan bencana dengan mudah: Hubungkan Tanda Bahaya Bencana ➔ Lampu Status Siaga (Normal, Waspada, Siaga, Awas) ➔ Bunyi Sirine Bahaya ➔ Aksi Evakuasi Warga. Setiap misi memiliki panduan balok yang jelas!',
      },
      {
        id: 'l3_twin',
        title: 'Simulasi 3D Merapi & Pengamatan Bencana',
        badge: 'SIMULATOR 3D',
        placement: 'center',
        content:
          'Jalankan simulasimu! Amati respon warga desa (berlindung di kolong meja aman, lari ke titik kumpul, atau evakuasi ke barak) pada maket 3D bentang alam Gunung Merapi asli. Simulasi dapat dihentikan kapan saja dengan tombol [BERHENTI], dan dampak bencana dapat diulang dengan tombol [Reset Kondisi]!',
      },
      {
        id: 'l3_my_projects',
        title: 'Fitur Proyek Saya (Eksperimen Bebas)',
        badge: 'EKSPERIMEN BEBAS',
        targetSelector: '#tour-level3-my-projects',
        placement: 'bottom',
        content:
          'Kuk-kuuk! Selain 20 misi skenario terstruktur, kamu juga bisa bereksperimen secara bebas lewat tombol [PROYEK SAYA] ini!\n\nDi Ruang Eksperimen Bebas ini, kamu bisa:\n• Merancang skenario penyelamatan bencana alam kreasimu sendiri tanpa batasan misi.\n• Mencoba berbagai kombinasi tanda bahaya gempa/gunung api, lampu status siaga, dan sirine peringatan dini.\n• Menyimpan hasil karyamu dan membukanya kembali kapan saja!',
        actionHint: 'Klik tombol "PROYEK SAYA" di sudut kanan atas untuk membuat dan mengelola karya eksperimen sainsmu!',
      },
      {
        id: 'l3_sync',
        title: 'Laporan Nilai Guru & Alat Peraga Fisik',
        badge: 'TERHUBUNG POSKO',
        placement: 'center',
        content:
          'Setiap misi yang tuntas otomatis menyumbang 5 poin (total 100 poin penuh) ke Rapor Belajarmu di Posko Guru. Lab simulasi ini juga dapat terhubung langsung ke alat peraga kotak diorama fisik RESQ-BOX!',
        actionHint: 'Pilih misi pertama dan buktikan rencana penyelamatan bencanamu!',
      },
    ],
  },

  // ── 8. HALAMAN POSKO GURU ──
  teacher_dashboard: {
    key: 'teacher_dashboard',
    pageTitle: 'Posko Pemantauan Guru',
    steps: [
      {
        id: 'teacher_intro',
        title: 'Kuk-kuuk! Selamat Datang di Posko Guru!',
        badge: 'MANAJEMEN KELAS',
        placement: 'center',
        content:
          'Selamat datang Bapak/Ibu Guru IPA! Di Posko Guru ini, Bapak/Ibu dapat mengelola kelas, membagikan kode kelas, memantau kemajuan belajar siswa real-time, dan mengunduh laporan nilai resmi.',
      },
      {
        id: 'teacher_classroom',
        title: 'Manajemen Kelas & Kode Kelas',
        badge: 'KODE KELAS',
        targetSelector: '#tour-teacher-classroom',
        placement: 'bottom',
        content:
          'Pilih kelas aktif dari dropdown atau buat kelas baru. Salin Kode Kelas (misal: RESQ-8A) dan bagikan kepada siswa agar mereka terdaftar ke dalam kelas Bapak/Ibu.',
      },
      {
        id: 'teacher_kpi',
        title: 'Statistik & Indikator Ketuntasan Siswa',
        badge: 'REKAP KPI',
        targetSelector: '#tour-teacher-kpi',
        placement: 'bottom',
        content:
          'Pantau ringkasan performa kelas secara instan: Total Siswa Aktif, Rata-Rata Nilai Gabungan, serta Persentase Ketuntasan Level 1, Level 2, dan Level 3.',
      },
      {
        id: 'teacher_table',
        title: 'Tabel Pemantauan Hasil Belajar Siswa',
        badge: 'REKAP KELAS',
        targetSelector: '#tour-teacher-table',
        placement: 'top',
        content:
          'Tabel ini menampilkan hasil belajar setiap siswa secara langsung: Skor Level 1 (Struktur Bumi), Level 2 (Kesiapsiagaan Merapi), dan Level 3 (Simulasi Mitigasi). Bapak/Ibu dapat mencari nama siswa atau menyaring berdasarkan tahapan level.',
      },
      {
        id: 'teacher_actions',
        title: 'Cetak Rapor Resmi & Ekspor Nilai CSV',
        badge: 'LAPORAN NILAI',
        targetSelector: '#tour-teacher-actions',
        placement: 'top',
        content:
          'Gunakan tombol [Cetak Rekap Nilai] untuk mencetak lembar rapor penilaian resmi bertanda tangan guru, atau [Ekspor Nilai (CSV)] untuk mengunduh rekap spreadsheet yang siap diolah ke Excel!',
        actionHint: 'Semoga pembelajaran IPA dan mitigasi bencana bersama RESQ-BOX sukses dan bermakna!',
      },
    ],
  },

  // ── 9. HALAMAN WORKSPACE STUDIO (BALOK AKSI-REAKSI & SIMULASI 3D) ──
  workspace: {
    key: 'workspace',
    pageTitle: 'Studio Lab Mitigasi Bencana',
    steps: [
      {
        id: 'ws_intro',
        title: 'Kuk-kuuk! Selamat Datang di Studio Lab Mitigasi!',
        badge: 'LAB MITIGASI',
        placement: 'center',
        content:
          'Di studio ini kamu dapat menyusun langkah penyelamatan bencana menggunakan balok aksi-reaksi dan melihat langsung dampaknya pada simulasi 3D Gunung Merapi serta alat peraga diorama fisik RESQ-BOX!',
      },
      {
        id: 'ws_diorama',
        title: 'Simulasi 3D Diorama Merapi',
        badge: 'DIORAMA 3D',
        targetSelector: '#tour-ws-canvas',
        placement: 'bottom',
        content:
          'Area di atas adalah simulasi 3D bentang alam Gunung Merapi dan desa di lerengnya! Saat simulasi berjalan, kamu bisa mengamati getaran gempa bumi, asap erupsi, lelehan lahar, serta gerakan warga desa saat menyelamatkan diri.',
      },
      {
        id: 'ws_telemetry',
        title: 'Panel Pemantau Kondisi Alam & Siaga Bencana',
        badge: 'STATUS BENCANA',
        targetSelector: '#tour-ws-telemetry',
        placement: 'left',
        content:
          'Panel ini menampilkan status resmi aktivitas Gunung Merapi dari PVMBG (Normal, Waspada, Siaga, Awas), rekaman getaran gempa bumi, bunyi sirine peringatan dini, dan lampu tanda bahaya secara langsung.',
      },
      {
        id: 'ws_blockly',
        title: 'Lembar Susun Balok Penyelamatan Bencana',
        badge: 'BALOK AKSI-REAKSI',
        targetSelector: '#tour-ws-editor',
        placement: 'top',
        content:
          'Tarik balok dari kotak pilihan (Peringatan & EWS, Simulasi Bencana, Aksi & Evakuasi, Kondisi Bencana) ke lembar kerja. Rangkai urutan aksi mitigasi yang tepat untuk menyelamatkan warga desa dari bahaya bencana!',
      },
      {
        id: 'ws_actions',
        title: 'Tombol Mulai Simulasi & Uji Mitigasi',
        badge: 'UJI SIMULASI',
        targetSelector: '#tour-ws-actions',
        placement: 'bottom',
        content:
          'Tekan tombol hijau [▶ MULAI] untuk menjalankan simulasi penyelamatan bencanamu dan amati respon warga! Kamu juga bisa menghentikan simulasi kapan saja dengan tombol [BERHENTI] atau menghubungkannya ke alat peraga kotak diorama fisik melalui tombol WiFi atau USB.',
        actionHint: 'Susun balok penyelamatan terbaikmu dan amati warga menyelamatkan diri!',
      },
    ],
  },
};

