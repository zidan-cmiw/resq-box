/**
 * Lapisan POLA REGEX untuk chatbot Resqy.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * MENGAPA PERLU LAPISAN INI
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  Sebelumnya chatbot hanya memakai dua jalur:
 *    1. pencocokan token + IDF ke bank QA (pencocokanQA.ts), dan
 *    2. panggilan AI bila pencocokan gagal.
 *
 *  Dua-duanya boros untuk pertanyaan yang jawabannya SUDAH PASTI, misalnya
 *  "cara buka level 2" atau "gimana ganti password". Pertanyaan seperti itu
 *  tidak perlu dikirim ke AI: jawabannya tetap, tidak berubah, dan tidak
 *  boleh salah. Mengirimnya ke AI hanya menghabiskan kuota siswa.
 *
 *  Lapisan ini menangkap pertanyaan seperti itu LEBIH DULU, sebelum AI
 *  dipanggil. Kalau tidak ada pola yang cocok, jalur lama tetap berjalan.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * SATU LAGI: PENJAGA JAWABAN
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  Tombol chatbot memang disembunyikan saat siswa mengerjakan Wordle dan TTS.
 *  Tetapi siswa masih dapat membuka chatbot di halaman lain dan mengetik
 *  "kunci jawaban TTS nomor 3". Model bahasa yang baik pun bisa saja menjawab.
 *
 *  Karena itu ada `cobaMintaJawaban()`: pola yang menangkap permintaan jawaban
 *  langsung, lalu dibalas dengan arahan belajar — bukan jawaban. Pemeriksaan
 *  ini berjalan SEBELUM AI, jadi jawaban tidak pernah berpeluang keluar.
 */

export interface HasilPola {
  /** Nama pola yang cocok, dipakai untuk pengujian. */
  nama: string;
  /** Jawaban siap tampil. */
  balasan: string;
}

/**
 * Normalisasi teks siswa.
 *
 * Banyak siswa menulis singkat: "gmn cara buka lv2", "gabisa login nih".
 * Tanpa normalisasi, pola harus dibuat untuk setiap variasi — tidak realistis.
 */
export function normalisasiTeks(teks: string): string {
  let t = teks.toLowerCase();

  // tanda baca dan karakter selain huruf/angka dijadikan spasi
  t = t.replace(/[^a-z0-9\s]/g, ' ');

  // singkatan yang sering dipakai siswa
  const singkatan: [RegExp, string][] = [
    [/\bgmn\b/g, 'gimana'],
    [/\bgimana\b/g, 'bagaimana'],
    [/\bbgm\b/g, 'bagaimana'],
    [/\bcaranya\b/g, 'cara'],
    [/\byg\b/g, 'yang'],
    [/\bgabisa\b|\bgbs\b/g, 'tidak bisa'],
    [/\bgk\b|\bga\b|\bgak\b|\btdk\b|\btidak\b/g, 'tidak'],
    [/\budh\b|\budah\b/g, 'sudah'],
    [/\bblm\b|\bbelom\b/g, 'belum'],
    [/\bsy\b/g, 'saya'],
    [/\bak\b|\baku\b/g, 'saya'],
    [/\bbgt\b|\bbanget\b/g, 'sekali'],
    [/\blv\s*([123])\b/g, 'level $1'],
    [/\bpassword\b|\bpass\b|\bsandi\b/g, 'password'],
  ];
  for (const [pola, ganti] of singkatan) t = t.replace(pola, ganti);

  // spasi berlebih
  t = t.replace(/\s+/g, ' ').trim();
  return t;
}

/** Pertanyaan yang jawabannya pasti — tidak perlu AI. */
const POLA: { nama: string; pola: RegExp; balasan: string }[] = [
  {
    nama: 'sapaan',
    pola: /^(halo|hai|hi|hey|helo|assalamualaikum|selamat (pagi|siang|sore|malam))\b/,
    balasan:
      'Halo! Aku Resqy, pemandu RESQ-BOX. Kamu bisa tanya soal materi kebencanaan, cara memakai aplikasi, atau cara menyelesaikan misi.',
  },
  {
    nama: 'terimaKasih',
    pola: /\b(terima kasih|makasih|thanks|thx|tengkyu)\b/,
    balasan: 'Sama-sama! Kalau ada yang belum jelas, tanya saja lagi ya.',
  },
  {
    nama: 'siapaKamu',
    pola: /\b(siapa kamu|kamu siapa|kamu apa|apa itu resqy|resqy itu apa)\b/,
    balasan:
      'Aku Resqy, burung hantu pemandu di aplikasi RESQ-BOX. Tugasku membantu kamu memahami materi kebencanaan dan cara memakai aplikasi ini.',
  },
  {
    nama: 'bukaLevel2',
    pola: /\b(buka|akses|masuk|main)\b.{0,20}\blevel 2\b|\blevel 2\b.{0,20}\b(buka|akses|masuk|terkunci|gembok)\b/,
    balasan:
      'Level 2 terbuka setelah semua gerbang Wordle di Level 1 tuntas. Kalau Level 2 masih bergembok, berarti masih ada zona di Level 1 yang gerbangnya belum selesai. Buka zona yang tersisa itu dulu.',
  },
  {
    nama: 'bukaLevel3',
    pola: /\b(buka|akses|masuk|main)\b.{0,20}\blevel 3\b|\blevel 3\b.{0,20}\b(buka|akses|masuk|terkunci|gembok)\b/,
    balasan:
      'Level 3 terbuka setelah seluruh enam area di Level 2 tuntas. Guru juga bisa membuka semua level untuk demonstrasi di kelas.',
  },
  {
    nama: 'gantiPassword',
    pola: /\b(ganti|ubah|reset|lupa)\b.{0,20}\bpassword\b|\bpassword\b.{0,20}\b(lupa|salah|tidak bisa)\b/,
    balasan:
      'Buka halaman Profil, lalu tekan GANTI PASSWORD AKUN SISWA. Kalau kamu benar-benar lupa kata sandi dan tidak bisa masuk, hanya guru yang dapat membuat ulang akunmu.',
  },
  {
    nama: 'lupaUsername',
    pola: /\b(lupa|tidak ingat)\b.{0,20}\b(username|akun|nama pengguna)\b/,
    balasan:
      'Username-mu adalah nama depanmu yang ditulis kecil, tanpa spasi. Kalau tetap tidak bisa masuk, tanyakan kepada gurumu — guru dapat melihat daftar akun kelasmu di Posko Guru.',
  },
  {
    nama: 'tidakBisaMasuk',
    pola: /\btidak bisa\b.{0,15}\b(masuk|login)\b|\b(gagal|susah)\b.{0,15}\b(masuk|login)\b/,
    balasan:
      'Coba periksa tiga hal: penulisan username, kata sandi, dan koneksi internet. Siswa masuk memakai USERNAME, bukan email. Kalau masih gagal, minta gurumu membuat ulang akun.',
  },
  {
    nama: 'luring',
    pola: /\b(offline|luring|tanpa internet|tidak ada sinyal|kuota habis)\b/,
    balasan:
      'Aplikasi tetap bisa dibuka tanpa internet setelah sekali dimuat, dan bisa dimainkan lewat tombol COBA TANPA LOGIN. Yang memerlukan internet hanya penyimpanan nilai dan fitur AI seperti aku.',
  },
  {
    nama: 'diorama',
    pola: /\b(diorama|esp32|board|papan)\b.{0,25}\b(sambung|hubung|konek|connect|tidak)\b|\b(sambung|hubung|konek)\b.{0,25}\b(diorama|board|papan)\b/,
    balasan:
      'Ada dua cara menyambung diorama. Lewat WiFi: sambungkan perangkat ke hotspot DIORAMA_ESP32, lalu hubungkan dari aplikasi. Lewat kabel: pakai USB dan pilih mode USB. Sambungan bertahan saat kamu pindah misi.',
  },
  {
    nama: 'lihatNilai',
    pola: /\b(nilai|rapor|skor)\b.{0,25}\b(lihat|cek|dimana|mana|keluar)\b/,
    balasan:
      'Nilai tampil di akhir setiap level, dan guru dapat melihat rekapnya di Posko Guru. Nilai tidak disimpan bila kamu bermain lewat mode tamu.',
  },
  {
    nama: 'hematData',
    pola: /\b(hemat data|kuota|lemot|lambat|berat)\b/,
    balasan:
      'Nyalakan MODE HEMAT DATA di halaman Profil. Peta 3D dan animasi berat tidak dimuat, tetapi materi tetap lengkap dan simulasi evakuasi tetap berjalan.',
  },
  {
    nama: 'gantiBahasa',
    pola: /\b(bahasa inggris|english|ganti bahasa|bahasa indonesia)\b/,
    balasan:
      'Buka halaman Profil, lalu pilih BAHASA: Bahasa Indonesia atau English. Pilihan itu tersimpan dan berlaku untuk menu, tombol, dan pesan di aplikasi.',
  },
  {
    nama: 'caraIsiTTS',
    pola: /\b(cara|bagaimana)\b.{0,25}\b(isi|main|kerjakan|mulai)\b.{0,20}\b(tts|teka teki|teka teki silang)\b/,
    balasan:
      'Setiap kotak diisi satu huruf. Klik kotak pada papan, lalu ketik. Pilih petunjuk di daftar untuk melihat arah dan nomornya. Setelah semua terisi, tekan CEK JAWABAN. Aku tidak bisa menunjukkan jawabannya, tetapi aku bisa menunjukkan materi yang perlu kamu baca.',
  },
  {
    nama: 'caraWordle',
    pola: /\b(cara|bagaimana)\b.{0,25}\b(main|kerjakan)\b.{0,20}\b(wordle|gerbang|tebak kata)\b/,
    balasan:
      'Tebak kata sains sepanjang jumlah kotak yang tersedia. Warna hijau berarti huruf benar dan posisinya benar, kuning berarti hurufnya ada tetapi posisinya salah, abu-abu berarti huruf itu tidak dipakai.',
  },
];

/** Pertanyaan yang menuntut jawaban langsung — harus ditolak. */
const POLA_MINTA_JAWABAN: RegExp[] = [
  /\b(kunci|jawaban|jawabannya)\b.{0,25}\b(tts|teka teki|teka teki silang|wordle)\b/,
  /\bisi\b.{0,15}\b(jawaban|kunci)\b/,
  /\b(tts|wordle|teka teki)\b.{0,25}\b(kunci|jawaban|jawabannya)\b/,
  /\bjawaban\b.{0,15}\b(nomor|no)\s*\d+/,
  /\b(bocorkan|bocorin|kasih tahu|kasih tau|beri tahu|beri tau)\b.{0,25}\b(jawaban|kunci)\b/,
  /\b(kata|huruf)\b.{0,20}\b(apa|apa yang)\b.{0,20}\b(benar|diisi|dipasang)\b/,
];

/**
 * Periksa apakah siswa meminta jawaban langsung.
 *
 * Dipanggil SEBELUM AI. Bila benar, chatbot menolak dengan sopan dan
 * mengarahkan ke materi — jawaban tidak pernah dihasilkan.
 */
export function cobaMintaJawaban(teks: string): boolean {
  const t = normalisasiTeks(teks);
  return POLA_MINTA_JAWABAN.some((p) => p.test(t));
}

/** Balasan saat siswa meminta jawaban langsung. */
export const BALASAN_TOLAK_JAWABAN =
  'Aku tidak bisa memberikan jawabannya. Yang bisa kubantu: menunjukkan bagian materi yang perlu kamu baca, atau menjelaskan istilah yang belum kamu pahami. Coba sebutkan petunjuk yang sedang kamu kerjakan.';

/**
 * Cocokkan pertanyaan dengan pola yang tersedia.
 *
 * Mengembalikan `null` bila tidak ada yang cocok, sehingga jalur lama
 * (bank QA, lalu AI) tetap berjalan seperti biasa.
 */
export function deteksiPola(teks: string): HasilPola | null {
  const t = normalisasiTeks(teks);
  if (t === '') return null;
  for (const p of POLA) {
    if (p.pola.test(t)) return { nama: p.nama, balasan: p.balasan };
  }
  return null;
}

/** Daftar nama pola, dipakai pengujian agar tidak ada yang terlewat. */
export const DAFTAR_POLA = POLA.map((p) => p.nama);
