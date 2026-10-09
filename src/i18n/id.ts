// ── i18n/id.ts ────────────────────────────────────────────────────────────
// Kamus Bahasa Indonesia — ANTARMUKA saja.
//
// LINGKUP (sengaja dibatasi)
//   Yang diterjemahkan: tombol, label, judul, pesan sistem, teks kesalahan,
//   dan navigasi.
//
//   Yang TIDAK diterjemahkan: dialog cerita (dialogueData.ts), narasi misi,
//   dan materi pelajaran. Berkas dialog berisi 432 baris naratif; itu proyek
//   terjemahan tersendiri, bukan sekadar penggantian label. Menerjemahkannya
//   setengah jalan justru menghasilkan cerita campur dua bahasa.
//
//   Bila kelak cerita perlu diterjemahkan, tambahkan sub-kamus `story` di
//   bawah dengan struktur yang sama seperti berkas dialog.
//
// STRUKTUR
//   Dikelompokkan per layar agar mudah dicari. Kunci memakai titik:
//   `login.title`, `teacher.printReport`, dan seterusnya.

export const id = {
  // ── Umum ────────────────────────────────────────────────────────────────
  common: {
    appName: 'RESQ-BOX',
    tagline: 'Media Pembelajaran Mitigasi Bencana',
    loading: 'Memuat…',
    saving: 'Menyimpan…',
    save: 'SIMPAN',
    cancel: 'BATAL',
    close: 'TUTUP',
    back: 'KEMBALI',
    next: 'LANJUT',
    finish: 'SELESAI',
    retry: 'COBA LAGI',
    reload: 'MUAT ULANG HALAMAN',
    home: 'KEMBALI KE MENU UTAMA',
    yes: 'Ya',
    no: 'Tidak',
    search: 'Cari',
    print: 'Cetak',
    download: 'Unduh',
    students: 'Siswa',
    student: 'Siswa',
    teacher: 'Guru',
    admin: 'Admin',
    score: 'Nilai',
    level: 'Level',
    status: 'Status',
    class: 'Kelas',
    name: 'Nama',
    username: 'Username',
    password: 'Password',
    school: 'Sekolah',
    absentNumber: 'No. Absen',
    completed: 'Tuntas',
    locked: 'Terkunci',
    active: 'Aktif',
    optional: 'opsional',
    required: 'wajib diisi',
    unknownError: 'Terjadi kesalahan yang tidak diketahui.',
  },

  // ── Navigasi utama ──────────────────────────────────────────────────────
  nav: {
    teacherMonitor: 'POSKO MONITORING GURU',
    level1: 'LEVEL 1. EARTH EXPLORER',
    level2: 'LEVEL 2. DISASTER ANALYST',
    level3: 'LEVEL 3. SIMULATION GAME',
    guideAndMissions: 'PANDUAN & MISI',
    teacherPost: 'POSKO GURU',
    credits: 'CREDITS',
    learningGuide: 'PETUNJUK BELAJAR',
  },

  // ── Halaman masuk & daftar ──────────────────────────────────────────────
  login: {
    title: 'MASUK RESQ-BOX',
    // CATATAN: kunci berikut sudah TIDAK ADA karena fiturnya dihapus.
    //   loginTab, registerTab  -> tab [ MASUK ] / [ DAFTAR AKUN BARU ] dihapus
    //   registerTitle, fullName, fullNamePlaceholder, absentPlaceholder,
    //   classCode, classCodePlaceholder, classCodeHint,
    //   usernamePlaceholderRegister, submitRegister
    //                          -> seluruh formulir pendaftaran mandiri dihapus
    //
    // Pendaftaran mandiri ditutup: akun siswa kini dibuat oleh guru lewat
    // Posko Guru, dan satu NISN hanya boleh memiliki satu akun.
    //
    // CATATAN LEBIH LUAS: seluruh bagian `login` di kamus ini sebenarnya sudah
    // tidak terpakai — halaman Login menuliskan teksnya langsung dan tidak
    // memanggil useTranslation sama sekali. Yang dihapus di sini hanya kunci
    // yang menjadi yatim AKIBAT perubahan ini; sisanya dibiarkan supaya
    // pembersihannya tidak tercampur dengan perubahan fitur.
    roleStudent: 'Siswa',
    roleTeacher: 'Guru',
    usernameLabel: 'Username',
    usernamePlaceholderStudent: 'Username siswa…',
    usernamePlaceholderTeacher: 'Misal: guru',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Masukkan password…',
    submitLogin: 'MASUK',
    loadingSession: 'Memeriksa sesi…',
    errorUsernameTaken: 'Username sudah dipakai. Coba username lain.',
    errorCredentials: 'Username atau password salah.',
    errorClassNotFound: 'Kode kelas tidak ditemukan. Periksa kembali atau tanyakan kepada gurumu.',
    errorRequired: 'Semua kolom bertanda * wajib diisi.',
    errorPasswordShort: 'Password minimal 6 karakter.',
    errorNetwork: 'Tidak dapat menghubungi server. Periksa koneksi internetmu.',
    errorTooManyAttempts: 'Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.',
    privacyLink: 'Kebijakan Privasi & Data Siswa',
  },

  // ── Profil siswa ────────────────────────────────────────────────────────
  profile: {
    title: 'PROFIL SISWA',
    editData: 'UBAH DATA',
    changePassword: 'GANTI PASSWORD AKUN SISWA',
    changePasswordHint: 'Ubah password untuk login akunmu (kosongkan jika tidak ingin ganti password)',
    newPassword: 'Password Baru',
    confirmPassword: 'Ulangi Password Baru',
    passwordMismatch: 'Kedua password tidak sama.',
    passwordChanged: 'Password berhasil diubah.',
    avatar: 'Avatar',
    customizeAvatar: 'UBAH TAMPILAN',
    dataSaver: 'MODE HEMAT DATA',
    dataSaverOn: 'AKTIF',
    dataSaverOff: 'MATI',
    dataSaverAuto: 'OTOMATIS',
    dataSaverEnable: 'NYALAKAN',
    dataSaverDisable: 'MATIKAN',
    dataSaverNote:
      'Materi pelajaran tetap lengkap. Yang diringankan hanya tampilan: scene 3D gunung dan animasi berat tidak dimuat, sehingga lebih cepat dan lebih hemat kuota.',
    progress: 'PROGRES BELAJAR',
  },

  // ── Posko Guru ──────────────────────────────────────────────────────────
  teacher: {
    title: 'POSKO GURU',
    subtitle: 'Pantau progres kelas dan nilai siswa',
    myClasses: 'KELAS SAYA',
    noClasses: 'Belum ada kelas. Buat kelas pertamamu.',
    createClass: 'BUAT KELAS',
    className: 'Nama Kelas',
    classCode: 'Kode Kelas',
    renameClass: 'UBAH NAMA KELAS',
    deleteClass: 'HAPUS KELAS',
    deleteClassConfirm: 'Hapus kelas ini? Seluruh data siswa di dalamnya ikut terhapus dan tidak dapat dikembalikan.',
    studentList: 'DAFTAR SISWA',
    noStudents: 'Belum ada siswa yang mendaftar di kelas ini.',
    addStudent: 'TAMBAH SISWA',
    deleteStudent: 'HAPUS SISWA',
    deleteStudentConfirm: 'Hapus akun siswa ini beserta seluruh hasil belajarnya? Tindakan ini tidak dapat dibatalkan.',
    viewDetail: 'LIHAT DETAIL',
    printReport: 'CETAK RAPOR',
    exportCsv: 'UNDUH CSV',
    lastActive: 'Terakhir aktif',
    neverActive: 'Belum pernah masuk',
    averageScore: 'Rata-rata Nilai',
    completedLevels: 'Level Tuntas',
    liveUpdate: 'Pembaruan otomatis aktif',
    refreshNow: 'SEGARKAN SEKARANG',
    classNotSelected: 'Pilih kelas terlebih dahulu.',
    reportTitle: 'RAPOR PROGRES BELAJAR',
    reportNote: 'Dokumen ini dihasilkan otomatis oleh RESQ-BOX.',
  },

  // ── Kebijakan privasi ───────────────────────────────────────────────────
  privacy: {
    title: 'KEBIJAKAN PRIVASI & DATA SISWA',
    lastUpdated: 'Terakhir diperbarui',
    intro:
      'RESQ-BOX adalah media pembelajaran IPA untuk SMP. Kami hanya menyimpan data yang benar-benar diperlukan untuk mencatat hasil belajar, dan kami tidak memakainya untuk iklan atau memperdagangkannya.',
    footerNote:
      'Halaman ini disediakan agar sekolah dan orang tua dapat memeriksa sendiri bagaimana data siswa ditangani. Bila ada bagian yang perlu dijelaskan lebih lanjut, silakan hubungi kami melalui kontak di bagian 8.',
  },

  // ── Mode hemat data & pemulihan kesalahan ───────────────────────────────
  dataSaver: {
    reasonManualOn: 'Mode hemat data dinyalakan manual. Scene 3D dan animasi berat dimatikan.',
    reasonManualOff: 'Mode hemat data dimatikan. Semua tampilan penuh (3D & animasi) dimuat.',
    reasonAutoMetered: 'Peramban menandai koneksi hemat data, jadi tampilan diringankan otomatis.',
    reasonAutoSlow: 'Koneksi terdeteksi lambat (2G/3G), jadi tampilan diringankan otomatis.',
    reasonOff: 'Koneksi terdeteksi cukup cepat. Semua tampilan dimuat penuh.',
    canvasTitle: 'MODE HEMAT DATA AKTIF',
    canvasBody:
      'Tampilan peta 3D tidak dimuat agar hemat kuota dan lebih cepat di perangkat ini. Simulasi evakuasi tetap berjalan — warga digital merespons aksi mitigasimu seperti biasa.',
    canvasHint:
      'Ingin melihat peta 3D? Matikan mode hemat data di halaman Profil, lalu buka kembali halaman ini.',
    canvasCta: 'BUKA PENGATURAN PROFIL',
  },

  error: {
    recoverableTitle: 'KONEKSI TERPUTUS SEBENTAR',
    technicalTitle: 'ADA GANGGUAN TEKNIS',
    recoverableBody:
      'Aplikasi gagal memuat sebagian materi. Ini biasanya karena koneksi internet terputus atau ada pembaruan versi. Coba muat ulang halaman.',
    technicalBody:
      'Aplikasi mengalami gangguan. Progres belajarmu tetap tersimpan, jadi kamu tidak akan kehilangan nilai atau posisi.',
    showTechnical: 'Lihat detail teknis',
    noMessage: 'Tanpa pesan',
    reportHint:
      'Bila masalah ini berulang, laporkan kepada gurumu dengan menyebutkan tulisan pada bagian “detail teknis” di atas.',
  },

  notFound: {
    heading: 'HALAMAN TIDAK DITEMUKAN',
    body: 'Sepertinya kamu tersesat di dalam gua vulkanik!',
    backHome: 'KEMBALI KE BERANDA',
  },

  // ── Ruang kerja & diorama ───────────────────────────────────────────────
  workspace: {
    title: 'RUANG KERJA',
    connectDiorama: 'HUBUNGKAN DIORAMA',
    disconnect: 'PUTUSKAN',
    ipAddress: 'Alamat IP',
    ipPlaceholder: '192.168.4.1',
    run: 'JALANKAN',
    stop: 'HENTIKAN',
    reset: 'ATUR ULANG',
    console: 'CATATAN KONSOL',
    clearConsole: 'Bersihkan catatan konsol',
    invalidIp: 'Format IP salah',
    connectionFailed: 'Gagal menyambung ke diorama. Periksa apakah perangkat menyala dan tersambung ke WiFi yang sama.',
    waitingDevice: 'Menunggu perangkat…',
    deviceReady: 'Diorama siap.',
  },

  // ── Aksesibilitas ───────────────────────────────────────────────────────
  a11y: {
    toggleSound: 'Nyalakan atau matikan suara',
    toggleFullscreen: 'Masuk atau keluar dari layar penuh',
    diveDeeper: 'Menyelam lebih dalam',
    ascend: 'Naik ke permukaan',
    toggleExplanation: 'Tampilkan atau sembunyikan penjelasan',
    runTectonicSim: 'Jalankan simulasi lempeng tektonik',
    testMitigation: 'Uji rencana mitigasi',
    nextStep: 'Lanjut ke langkah berikutnya',
    flipCard: 'Balikkan kartu untuk melihat penjelasan',
    unflipCard: 'Balikkan kembali kartu ke sisi depan',
    skipTyping: 'Tampilkan seluruh teks sekarang',
    openMaterial: 'Buka materi {name}',
  },
} as const;

export type IdDictionary = typeof id;
