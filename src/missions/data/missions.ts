export interface MissionValidation {
  requiredBlocks?: string[];
  codeContains?: string[];
  ancestorConstraints?: Record<string, string>; // { childType: requiredAncestorType }
}

export interface MissionStep {
  title: string;
  description: string;
  icon: string;
  tip?: string;
}

export type MissionCategory = 'pengenalan' | 'gempa' | 'gunung' | 'proyek';

export const CATEGORIES: { id: MissionCategory; title: string; icon: string; missions: number }[] = [
  { id: 'pengenalan', title: 'Perkenalan', icon: 'school', missions: 3 },
  { id: 'gempa', title: 'Gempa Bumi', icon: 'landslide', missions: 8 },
  { id: 'gunung', title: 'Gunung Meletus', icon: 'volcano', missions: 8 },
  { id: 'proyek', title: 'Proyek Akhir', icon: 'emoji_objects', missions: 4 },
];

export interface Mission {
  id: string;
  category: MissionCategory;
  level: number;
  title: string;
  icon: string;
  scenario: string;
  objective: string;
  hint: string;
  steps: MissionStep[];
  validation: MissionValidation;
}

const st = (title: string, description: string, icon: string, tip?: string): MissionStep => ({ title, description, icon, tip });

export const MISSIONS: Mission[] = [

  // ═══ KATEGORI 1: PERKENALAN (3 misi) ═══
  {
  id: 'pengenalan_01', category: 'pengenalan', level: 1,
  title: 'Nyalakan Lampu Pertama', icon: 'lightbulb',
  scenario: 'Desa Cikaret mengalami pemadaman listrik saat malam hari akibat badai. Kamu perlu membuat lampu darurat agar warga tidak panik.',
  objective: 'Buat program agar Lampu menyala terus-menerus.',
  hint: 'Buka kategori Peringatan & Lampu, ambil blok "Lampu", lalu taruh di dalam "Mulai Saat Dihidupkan" pada blok Sistem Mitigasi.',
  steps: [
  st('Kenali Misimu! ', 'Desa Cikaret gelap gulita karena badai. Tugasmu adalah membuat lampu darurat supaya warga tidak panik!', 'auto_stories'),
  st('Blok yang Kamu Butuhkan', 'Buka kategori Peringatan & Lampu di panel kiri, cari blok:\n• "Lampu Bahaya Nyala"\n\nBlok Sistem Mitigasi sudah ada di kanvas. Kamu tinggal menambahkan blok ke dalamnya!', 'inventory_2', 'Klik nama kategori di panel kiri untuk melihat semua blok yang tersedia.'),
  st('Susun Blok-nya', 'Seret blok "Lampu Bahaya Nyala" ke dalam kotak "Mulai Saat Dihidupkan" di blok Sistem Mitigasi.\n\nBlok "Mulai Saat Dihidupkan" dijalankan satu kali saat program dimulai — cocok untuk menyalakan lampu!', 'extension', 'Pastikan blok Lampu menempel (snap) di dalam "Mulai Saat Dihidupkan", bukan di luar.'),
  st('Jalankan & Validasi! ', 'Klik tombol "Mulai" di atas untuk menjalankan program. Kalau berhasil, klik tombol "VALIDASI MISI" di bawah ini.', 'rocket_launch'),
  ],
  validation: { requiredBlocks: ['resq_program', 'resq_led'], ancestorConstraints: { 'resq_led': 'resq_program' }, codeContains: ["api.setPin('10', 'HIGH')"] },
  },
  {
  id: 'pengenalan_02', category: 'pengenalan', level: 2,
  title: 'Lampu Berkedip', icon: 'flash_on',
  scenario: 'Lampu darurat saja tidak cukup untuk menarik perhatian. Warga butuh lampu yang berkedip agar tahu lokasi titik kumpul!',
  objective: 'Buat Lampu berkedip: nyala 1 detik, mati 1 detik, berulang terus.',
  hint: 'Pakai blok "Jeda Sebentar" dari Sistem, dan blok "Jalankan Terus-Menerus" agar kedip berlanjut.',
  steps: [
  st('Lampu Isyarat! ', 'Sekarang kita buat lampu yang berkedip supaya warga tahu jalan ke titik kumpul. Lampu ini akan terus berkedip tanpa henti!', 'auto_stories'),
  st('Blok yang Kamu Butuhkan', 'Cari blok-blok ini:\n• Peringatan & Lampu → "Lampu Bahaya Nyala" dan "Lampu Bahaya Mati"\n• Sistem → "Jeda Sebentar 1000 ms" (2x)', 'inventory_2', 'Blok "Jeda Sebentar" bisa kamu ganti angka waktunya (1000ms = 1 detik).'),
  st('Susun Pola Kedip', 'Di dalam "Jalankan Terus-Menerus" di Sistem, susun:\n1. Lampu Bahaya Nyala\n2. Jeda Sebentar 1000 ms\n3. Lampu Bahaya Mati\n4. Jeda Sebentar 1000 ms', 'extension', 'Pastikan di dalam Jalankan Terus-Menerus.'),
  st('Lihat Kedipnya! ', 'Klik "Mulai" — Lampu bahaya harus berkedip tiap 1 detik. Kalau sudah, klik "VALIDASI MISI" di bawah.', 'rocket_launch'),
  ],
  validation: { requiredBlocks: ['resq_program', 'resq_led', 'resq_tunggu'], ancestorConstraints: { 'resq_led': 'resq_program' }, codeContains: ["api.setPin('10', 'HIGH')", "api.setPin('10', 'LOW')", 'api.delay'] },
  },
  {
  id: 'pengenalan_03', category: 'pengenalan', level: 3,
  title: 'Tombol & Lampu', icon: 'touch_app',
  scenario: 'Relawan butuh tombol untuk menyalakan lampu tanda bahaya. Lampu hanya boleh menyala saat tombol ditekan.',
  objective: 'Jika Tombol 1 ditekan, nyalakan Lampu. Jika tidak, matikan Lampu.',
  hint: 'Gunakan blok "Jika...Kalau Tidak" dari Pengambilan Keputusan dan blok " Tombol Darurat 1 ditekan?" dari Pemantauan Alam.',
  steps: [
  st('Tombol Ajaib! ', 'Sekarang kita buat lampu yang cuma nyala kalau tombol ditekan. Ini berguna untuk memberi sinyal darurat!', 'auto_stories'),
  st('Blok yang Kamu Butuhkan', 'Cari blok-blok ini:\n• Pemantauan Alam → " Tombol Darurat 1 ditekan?"\n• Pengambilan Keputusan → "Kalau...Selain Itu"\n• Peringatan & Lampu → "Lampu Bahaya Nyala" dan "Lampu Bahaya Mati"', 'inventory_2'),
  st('Susun Logikanya', 'Di dalam "Jalankan Terus-Menerus", susun:\n\n Kalau →  Tombol Darurat 1 ditekan?\n  Maka Lakukan →  Lampu Bahaya Nyala\nSelain Itu →  Lampu Bahaya Mati', 'extension', 'Program harus terus mengecek tombol, makanya pakai "Jalankan Terus-Menerus".'),
  st('Coba Tekan Tombolnya!', 'Klik "Mulai", lalu tekan Tombol Darurat 1 di panel Sensor — Lampu harus menyala! Kalau berhasil, klik "VALIDASI MISI".', 'rocket_launch'),
  ],
  validation: { requiredBlocks: ['resq_jika_tidak', 'resq_tombol_1', 'resq_led'], ancestorConstraints: { 'resq_jika_tidak': 'resq_program', 'resq_led': 'resq_program' }, codeContains: ["api.getPin('D2')", "api.setPin('10', 'HIGH')"] },
  },

  // ═══ KATEGORI 2: GEMPA BUMI (5 misi) ═══
  {
  id: 'gempa_01', category: 'gempa', level: 1,
  title: 'Deteksi Getaran', icon: 'vibration',
  scenario: 'Wilayah Lombok rawan gempa. Warga butuh peringatan dini: Lampu Bahaya harus menyala begitu gempa terdeteksi.',
  objective: 'Gunakan sensor getaran. Jika getaran kuat, nyalakan Lampu Bahaya.',
  hint: 'Pakai blok " Gempa Terdeteksi Kuat?" dari Pemantauan Alam, gabungkan dengan "Kalau...Selain Itu".',
  steps: [
  st('Kenali Gempa! ', 'Lombok sering gempa. Kamu akan membuat sistem yang mendeteksi getaran dan menyalakan lampu peringatan!', 'auto_stories'),
  st('Blok yang Kamu Butuhkan', 'Cari:\n• Pemantauan Alam → " Gempa Terdeteksi Kuat?"\n• Pengambilan Keputusan → "Kalau...Selain Itu"\n• Peringatan & Lampu → "Lampu Bahaya Nyala" dan "Lampu Bahaya Mati"', 'inventory_2'),
  st('Susun Detektor Getaran', 'Di dalam "Jalankan Terus-Menerus":\n\n Kalau →  Gempa Terdeteksi Kuat?\n  Maka Lakukan →  Lampu Bahaya Nyala\nSelain Itu →  Lampu Bahaya Mati', 'extension'),
  st('Simulasikan Gempa! ', 'Klik "Mulai", buka panel Pemantauan Kondisi Alam, geser nilai getaran ke atas (>700). Lampu Bahaya harus menyala! Klik VALIDASI jika berhasil.', 'rocket_launch'),
  ],
  validation: { requiredBlocks: ['resq_jika_tidak', 'resq_getar_kuat', 'resq_led'], ancestorConstraints: { 'resq_jika_tidak': 'resq_program', 'resq_led': 'resq_program' }, codeContains: ["api.getSensor('A1') > 700"] },
  },
  {
  id: 'gempa_02', category: 'gempa', level: 2,
  title: 'Alarm Getaran', icon: 'notification_important',
  scenario: 'Lampu saja tidak cukup — warga perlu sirine keras supaya semua orang dengar peringatan gempa!',
  objective: 'Jika getaran kuat, bunyikan Sirine sebagai alarm peringatan.',
  hint: 'Ganti blok Lampu dengan blok "Sirine Peringatan" dan "Sirine Berhenti" dari Peringatan & Lampu.',
  steps: [
  st('Sirine Gempa! ', 'Lampu peringatan saja kurang keras. Sekarang kita tambahkan Sirine yang akan berbunyi saat gempa terdeteksi!', 'auto_stories'),
  st('Blok yang Kamu Butuhkan', 'Cari:\n• Pemantauan Alam → " Gempa Terdeteksi Kuat?"\n• Peringatan & Lampu → "Sirine Peringatan" dan "Sirine Berhenti"\n• Pengambilan Keputusan → "Kalau...Selain Itu"', 'inventory_2'),
  st('Susun Alarm', 'Di dalam "Jalankan Terus-Menerus":\n\n Kalau →  Gempa Terdeteksi Kuat?\n  Maka Lakukan → Sirine Peringatan\nSelain Itu → Sirine Berhenti', 'extension'),
  st('Bunyikan Sirine! ', 'Jalankan, geser sensor getaran ke tinggi — Sirine harus berbunyi! VALIDASI MISI kalau berhasil.', 'rocket_launch'),
  ],
  validation: { requiredBlocks: ['resq_jika_tidak', 'resq_getar_kuat', 'resq_buzzer', 'resq_buzzer_stop'], ancestorConstraints: { 'resq_jika_tidak': 'resq_program', 'resq_buzzer': 'resq_program', 'resq_buzzer_stop': 'resq_program' }, codeContains: ["api.getSensor('A1') > 700"] },
  },
  {
  id: 'gempa_03', category: 'gempa', level: 3,
  title: 'Level Getaran', icon: 'equalizer',
  scenario: 'Tidak semua getaran berbahaya. Petugas BPBD perlu tahu level getaran: ringan (Lampu Aman) atau kuat (Lampu Bahaya + Sirine).',
  objective: 'Bedakan 2 level getaran. Jika kuat → Lampu Bahaya + Sirine. Jika ringan → Lampu Aman saja.',
  hint: 'Gunakan "Kalau...Selain Itu" lalu di dalam "Situasi Lain" tambahkan pengaturan Lampu Aman.',
  steps: [
  st('Level Getaran ', 'Getaran ada yang ringan dan kuat. Kita akan buat 2 level peringatan berbeda!', 'auto_stories'),
  st('Blok yang Kamu Butuhkan', 'Cari:\n• Pemantauan Alam → " Gempa Terdeteksi Kuat?"\n• Pengambilan Keputusan → "Kalau...Selain Itu"\n• Peringatan & Lampu → Lampu Bahaya, Lampu Aman, Sirine, Matikan Semua Lampu', 'inventory_2', 'Lampu Aman untuk tanda AMAN. Lampu Bahaya + Sirine untuk tanda BAHAYA.'),
  st('Susun Level Peringatan', 'Di "Jalankan Terus-Menerus":\n\n Kalau →  Gempa Terdeteksi Kuat?\n  Maka Lakukan →  Lampu Bahaya Nyala + Sirine\nSelain Itu →  Matikan Semua Lampu\n  Lampu Aman Nyala', 'extension'),
  st('Uji Kedua Level! ', 'Run, lalu uji: 1) Getaran rendah → Lampu Aman. 2) Getaran tinggi → Lampu Bahaya + Sirine. VALIDASI kalau sukses!', 'rocket_launch'),
  ],
  validation: { requiredBlocks: ['resq_jika_tidak', 'resq_getar_kuat', 'resq_buzzer', 'resq_semua_led_mati'], ancestorConstraints: { 'resq_jika_tidak': 'resq_program', 'resq_buzzer': 'resq_program', 'resq_semua_led_mati': 'resq_program' }, codeContains: ["api.getSensor('A1') > 700"] },
  },
  {
  id: 'gempa_04', category: 'gempa', level: 4,
  title: 'Evakuasi Gempa', icon: 'directions_run',
  scenario: 'Gempa besar terdeteksi! Sistem harus otomatis menyalakan Alarm Evakuasi jika gempa kuat ATAU tombol panik ditekan.',
  objective: 'Gabungkan sensor getaran dan tombol darurat. Jika salah satu aktif, jalankan Alarm Evakuasi.',
  hint: 'Di Pengambilan Keputusan, pakai blok "ATAU" untuk menggabungkan dua kondisi.',
  steps: [
  st('Evakuasi Darurat! ', 'Saat gempa besar atau tombol panik ditekan, seluruh sistem evakuasi harus jalan otomatis!', 'auto_stories'),
  st('Blok yang Kamu Butuhkan', 'Kumpulkan:\n• Pemantauan Alam → " Gempa Terdeteksi Kuat?" + " Tombol Darurat 1 ditekan?"\n• Pengambilan Keputusan → "ATAU" + "Kalau...Selain Itu"\n• Peringatan & Lampu → " Alarm Evakuasi" + Lampu Aman', 'inventory_2'),
  st('Susun Kondisi ATAU', 'Pertama gabungkan kondisi:\n\n Blok "ATAU"\n  Kiri →  Gempa Terdeteksi Kuat?\n  Kanan →  Tombol Darurat 1 ditekan?\n\nLalu masukkan ke "Jika".', 'extension', 'Ubah opsi di blok logika jadi "ATAU", bukan "DAN".'),
  st('Aktifkan Evakuasi! ', 'Jika [Gempa ATAU Tombol] →  Alarm Evakuasi. Kalau tidak → Lampu Aman. Jalankan & uji kedua pemicunya!', 'rocket_launch'),
  ],
  validation: { requiredBlocks: ['resq_dan_atau', 'resq_jika_tidak', 'resq_getar_kuat', 'resq_tombol_1', 'resq_alarm_darurat'], ancestorConstraints: { 'resq_jika_tidak': 'resq_program', 'resq_alarm_darurat': 'resq_program' }, codeContains: ['||'] },
  },
  {
  id: 'gempa_05', category: 'gempa', level: 5,
  title: 'Sistem Peringatan Dini', icon: 'cell_tower',
  scenario: 'Kota besar butuh sistem monitoring 24 jam. Setiap jeda singkat, sistem cek getaran. Jika kuat, aktifkan semua output darurat.',
  objective: 'Buat loop monitoring dengan jeda tunggu. Jika getaran kuat, jalankan Lampu, Sirine, dan Kipas Ventilasi bersamaan.',
  hint: 'Gunakan blok "Jeda Sebentar" untuk jeda monitoring. Aktifkan 3 output bersamaan di dalam "Lakukan".',
  steps: [
  st('Monitoring 24 Jam! ', 'Sistem ini harus terus mengecek getaran secara berkala. Begitu ada gempa, SEMUA alarm langsung aktif!', 'auto_stories'),
  st('Blok yang Kamu Butuhkan', 'Kumpulkan:\n• Sistem → "Jeda Sebentar 1000 ms"\n• Pemantauan Alam → " Gempa Terdeteksi Kuat?"\n• Peringatan & Lampu → Lampu Bahaya + Sirine\n• Mekanik Evakuasi → Kipas Ventilasi\n• Pengambilan Keputusan → "Kalau...Selain Itu"', 'inventory_2'),
  st('Susun Loop Monitoring', 'Di dalam "Jalankan Terus-Menerus":\n1.  Jika getaran kuat → Lampu + Sirine + Kipas nyala\n2. Selain Itu → semuanya mati\n3. Jeda Sebentar (biar hemat daya)', 'extension', 'Blok "Jeda Sebentar" di akhir loop penting — tanpa ini sensor dicek terus-terusan!'),
  st('Uji Sistem Penuh! ', 'Run, geser sensor getaran naik. Lampu, Sirine, Kipas harus aktif bersamaan! VALIDASI MISI kalau sukses.', 'rocket_launch'),
  ],
  validation: { requiredBlocks: ['resq_tunggu', 'resq_getar_kuat', 'resq_jika_tidak', 'resq_led', 'resq_buzzer', 'resq_motor'], ancestorConstraints: { 'resq_jika_tidak': 'resq_program', 'resq_led': 'resq_program', 'resq_buzzer': 'resq_program', 'resq_motor': 'resq_program' }, codeContains: ['api.delay'] },
  },

  // ═══ KATEGORI 3: GUNUNG MELETUS (5 misi) ═══
  {
  id: 'gunung_01', category: 'gunung', level: 1,
  title: 'Sensor Suhu', icon: 'thermostat',
  scenario: 'Gunung Merapi menunjukkan peningkatan suhu. Pasang sensor suhu untuk mendeteksi panas berlebih dan menyalakan Lampu peringatan.',
  objective: 'Jika suhu panas (>35°C) terdeteksi, nyalakan Lampu Bahaya.',
  hint: 'Pakai blok " Suhu Berbahaya?" dari Pemantauan Alam, gabungkan dengan "Kalau...Selain Itu".',
  steps: [
  st('Gunung Memanas!', 'Gunung Merapi suhunya naik! Kamu akan memasang sensor suhu untuk memantau panas gunung.', 'auto_stories'),
  st('Blok yang Kamu Butuhkan', 'Cari:\n• Pemantauan Alam → " Suhu Berbahaya?"\n• Pengambilan Keputusan → "Kalau...Selain Itu"\n• Peringatan & Lampu → "Lampu Bahaya Nyala" + "Lampu Bahaya Mati"', 'inventory_2'),
  st('Susun Sensor Suhu', 'Di dalam "Jalankan Terus-Menerus":\n\n Kalau →  Suhu Berbahaya?\n  Maka Lakukan → Lampu Bahaya Nyala\nSelain Itu → Lampu Bahaya Mati', 'extension'),
  st('Simulasikan Panas! ', 'Run, buka panel Pemantauan Kondisi Alam, geser suhu di atas 35°C. Lampu Bahaya harus menyala! VALIDASI kalau berhasil.', 'rocket_launch'),
  ],
  validation: { requiredBlocks: ['resq_jika_tidak', 'resq_suhu_panas', 'resq_led'], ancestorConstraints: { 'resq_jika_tidak': 'resq_program', 'resq_led': 'resq_program' }, codeContains: ['0.4887'] },
  },
  {
  id: 'gunung_02', category: 'gunung', level: 2,
  title: 'Alarm Panas', icon: 'fireplace',
  scenario: 'Suhu gunung sudah di level berbahaya! Sirine harus berbunyi keras agar semua warga di lereng segera evakuasi.',
  objective: 'Jika suhu panas, bunyikan Sirine sebagai alarm evakuasi.',
  hint: 'Ganti Lampu dengan Sirine. Jangan lupa matikan saat suhu normal.',
  steps: [
  st('Sirine Panas! ', 'Suhu gunung sudah di atas 35°C! Sirine harus berbunyi untuk memperingatkan semua warga!', 'auto_stories'),
  st('Blok yang Kamu Butuhkan', 'Cari:\n• Pemantauan Alam → " Suhu Berbahaya?"\n• Peringatan & Lampu → "Sirine Peringatan" + "Sirine Berhenti"\n• Pengambilan Keputusan → "Kalau...Selain Itu"', 'inventory_2'),
  st('Susun Alarm Panas', 'Di "Jalankan Terus-Menerus":\n\n Kalau →  Suhu Berbahaya?\n  Maka Lakukan → Sirine Peringatan\nSelain Itu → Sirine Berhenti', 'extension'),
  st('Bunyikan Sirine! ', 'Run, geser suhu >35°C. Sirine harus bunyi! VALIDASI kalau berhasil.', 'rocket_launch'),
  ],
  validation: { requiredBlocks: ['resq_jika_tidak', 'resq_suhu_panas', 'resq_buzzer', 'resq_buzzer_stop'], ancestorConstraints: { 'resq_jika_tidak': 'resq_program', 'resq_buzzer': 'resq_program', 'resq_buzzer_stop': 'resq_program' }, codeContains: ['0.4887'] },
  },
  {
  id: 'gunung_03', category: 'gunung', level: 3,
  title: 'Status Gunung', icon: 'monitoring',
  scenario: 'PVMBG menetapkan status gunung berdasarkan suhu dan getaran vulkanik. Sistem harus merespons: Normal atau Awas.',
  objective: 'Jika suhu panas ATAU getaran kuat, status Awas: aktifkan Lampu, Sirine, dan Pintu Evakuasi. Jika tidak, Lampu Aman.',
  hint: 'Cek suhu panas dulu, gabungkan dengan getaran kuat pakai "ATAU". Di level Awas, aktifkan 3 output bersamaan.',
  steps: [
  st('Status Gunung ', 'PVMBG menetapkan status gunung berdasarkan suhu dan getaran vulkanik. Sistem harus merespons sesuai!', 'auto_stories'),
  st('Blok yang Kamu Butuhkan', 'Kumpulkan:\n• Pemantauan Alam → " Suhu Berbahaya?" + " Gempa Terdeteksi Kuat?"\n• Pengambilan Keputusan → "ATAU" + "Kalau...Selain Itu"\n• Peringatan & Lampu → Lampu Bahaya, Lampu Aman, Sirine\n• Mekanik Evakuasi → Pintu Evakuasi', 'inventory_2'),
  st('Susun Status Gunung', 'Di "Jalankan Terus-Menerus":\n Jika [Suhu Panas ATAU Getaran Kuat] → Lampu Bahaya + Sirine + Pintu Evakuasi Terbuka\nSelain Itu → Lampu Aman + matikan lainnya + Pintu Tertutup', 'extension', 'Pintu Evakuasi berguna untuk otomatis membuka rute evakuasi!'),
  st('Uji Semua Status! ', 'Run, uji kombinasi suhu dan getaran. Tiap status harus beda respons! VALIDASI kalau berhasil.', 'rocket_launch'),
  ],
  validation: { requiredBlocks: ['resq_jika_tidak', 'resq_suhu_panas', 'resq_getar_kuat', 'resq_dan_atau', 'resq_led', 'resq_buzzer', 'resq_servo'], ancestorConstraints: { 'resq_jika_tidak': 'resq_program', 'resq_led': 'resq_program', 'resq_buzzer': 'resq_program', 'resq_servo': 'resq_program' }, codeContains: ['||'] },
  },
  {
  id: 'gunung_04', category: 'gunung', level: 4,
  title: 'Evakuasi Gunung', icon: 'directions_walk',
  scenario: 'Status Awas! Semua pintu evakuasi harus terbuka, alarm berbunyi, lampu darurat dan kipas ventilasi menyala otomatis.',
  objective: 'Jika status Awas (suhu panas ATAU getaran kuat), aktifkan 4 output: Lampu Bahaya, Sirine, Kipas Ventilasi, dan Pintu Evakuasi.',
  hint: 'Gabungkan 2 sensor dengan "ATAU". Di dalam "Lakukan", susun 4 blok output berurutan.',
  steps: [
  st('Evakuasi Gunung! ', 'Gunung status AWAS! Semua sistem evakuasi harus jalan: alarm, lampu, kipas ventilasi, dan pintu otomatis!', 'auto_stories'),
  st('Blok yang Kamu Butuhkan', 'Kumpulkan:\n• Pemantauan Alam → " Suhu Berbahaya?" + " Gempa Terdeteksi Kuat?"\n• Pengambilan Keputusan → "ATAU" + "Kalau...Selain Itu"\n• Peringatan & Lampu → Lampu Bahaya + Sirine\n• Mekanik Evakuasi → Kipas Ventilasi + Pintu Evakuasi', 'inventory_2'),
  st('Susun Evakuasi Penuh', 'Di "Jalankan Terus-Menerus":\n\n Jika [ Suhu panas ATAU  Getaran kuat]\n  Maka Lakukan → Lampu Bahaya + Sirine + Kipas + Pintu\nSelain Itu → Matikan Semua', 'extension'),
  st('Aktifkan Evakuasi! ', 'Run, naikkan suhu atau getaran. Semua 4 output harus aktif! VALIDASI kalau berhasil.', 'rocket_launch'),
  ],
  validation: { requiredBlocks: ['resq_dan_atau', 'resq_jika_tidak', 'resq_suhu_panas', 'resq_getar_kuat', 'resq_led', 'resq_buzzer', 'resq_motor', 'resq_servo'], ancestorConstraints: { 'resq_jika_tidak': 'resq_program', 'resq_led': 'resq_program', 'resq_buzzer': 'resq_program', 'resq_motor': 'resq_program', 'resq_servo': 'resq_program' }, codeContains: ['||'] },
  },
  {
  id: 'gunung_05', category: 'gunung', level: 5,
  title: 'Sistem Monitoring Gunung', icon: 'satellite_alt',
  scenario: 'Pusat vulkanologi butuh sistem monitoring 24 jam: cek suhu dengan jeda, 3 level status, dan respon otomatis tiap level.',
  objective: 'Buat loop monitoring berulang dengan multi-sensor. Jika Awas → semua output. Normal → Lampu Aman.',
  hint: 'Gunakan "ATAU" untuk kondisi Awas. Di dalam "Situasi Lain", tambahkan "Jika" kedua untuk cek kondisi aman.',
  steps: [
  st('Pusat Vulkanologi', 'Sistem monitoring gunung terlengkap! Cek tiap beberapa waktu, 3 level status, respons otomatis penuh.', 'auto_stories'),
  st('Blok yang Kamu Butuhkan', 'Semua blok:\n• Sistem → "Jeda Sebentar"\n• Pemantauan Alam → Suhu panas + Getaran kuat\n• Output → Semua aksi yang ada\n• Pengambilan Keputusan → 2x "Jika" + "ATAU"', 'inventory_2'),
  st('Susun Sistem Lengkap', 'Di "Jalankan Terus-Menerus":\n Jika [Suhu Panas ATAU Getaran Kuat]\n  Maka Lakukan → Lampu Bahaya + Sirine + Kipas + Pintu Buka\nSelain Itu →\n  Jika suhu normal → Lampu Aman + matikan lainnya\nJeda Sebentar', 'extension'),
  st('Uji Sistem Penuh! ', 'Run dan uji semua kombinasi sensor. Tiap level harus respons tepat! VALIDASI kalau berhasil.', 'rocket_launch'),
  ],
  validation: { requiredBlocks: ['resq_tunggu', 'resq_jika_tidak', 'resq_dan_atau', 'resq_suhu_panas', 'resq_getar_kuat', 'resq_led', 'resq_buzzer', 'resq_servo'], ancestorConstraints: { 'resq_jika_tidak': 'resq_program', 'resq_led': 'resq_program', 'resq_buzzer': 'resq_program', 'resq_servo': 'resq_program' }, codeContains: ['0.4887', 'api.delay'] },
  },

  // ═══ KATEGORI 4: PROYEK AKHIR (4 proyek) ═══
  {
  id: 'proyek_01', category: 'proyek', level: 1,
  title: 'RS Darurat (Gempa)', icon: 'local_hospital',
  scenario: 'Rumah sakit "Harapan Desa" memiliki banyak pasien kritis. Jika terjadi gempa, listrik utama mati dan genset butuh waktu untuk menyala. Selain itu, pintu evakuasi tidak boleh langsung terbuka agar pasien bedah tetap aman, kecuali tombol override ditekan.',
  objective: 'Buat satu urutan mitigasi gempa: Jika Getaran > 600, nyalakan Genset lalu bunyikan alarm 3x. Setelah itu, buka pintu evakuasi HANYA JIKA Tombol 2 (Override) TIDAK ditekan.',
  hint: 'Semua ditaruh di dalam "Kalau Getaran > 600". Di bagian paling bawahnya, tambahkan "Kalau [BUKAN] Tombol 2 ditekan -> Pintu Terbuka".',
  steps: [
  st('Empathize & Define ', 'Pain Points: Pasien bedah rentan celaka jika pintu tiba-tiba terbuka saat operasi berlangsung akibat gempa. Pintu butuh sistem "Override" (pencegat).', 'psychology'),
  st('Ideate & Prototype ', 'Semua blok ditaruh di dalam "Kalau Getaran > 600":\n1. Matikan Semua Lampu -> Jeda Sebentar (1000ms) -> Nyalakan Lampu Aman.\n2. Di bawahnya, tambahkan blok "Ulangi 3 kali": Sirine Bunyi -> Jeda -> Sirine Berhenti -> Jeda.\n3. Paling bawah (masih di dalam Getaran > 600), tambahkan "Kalau... Selain Itu": Kalau [BUKAN] Tombol 2 Ditekan -> Pintu Terbuka.', 'design_services'),
  st('Test (Uji Coba) ', 'Uji: Kasih getaran > 600. Cek urutan nyala lampu dan bunyi sirine. Pastikan saat tombol 2 ditahan, pintu BATAL terbuka. Jika sukses, tekan Validasi!', 'science')
  ],
  validation: { requiredBlocks: ['resq_jika_tidak', 'resq_bandingkan', 'resq_sensor_getar', 'resq_tunggu', 'resq_led', 'resq_ulangi', 'resq_buzzer', 'resq_bukan', 'resq_servo'], codeContains: ["> 600"] }
  },
  {
  id: 'proyek_02', category: 'proyek', level: 2,
  title: 'Pabrik Kimia (Gempa & Suhu)', icon: 'factory',
  scenario: 'Pabrik Kimia berisiko ganda. Gempa bisa meruntuhkan bangunan, dan suhu panas bisa meledakkan tangki. Jika bahaya, gas beracun harus dibuang.',
  objective: 'Kondisi Kritis = (Getaran > 500) ATAU (Suhu > 45). Jika Kritis, Kipas Ventilasi menyala maksimal + Sirine. Pintu HANYA terbuka jika Tombol 1 (Konfirmasi Manajer) juga ditekan bersamaan dengan Kondisi Kritis.',
  hint: 'Gunakan blok ATAU untuk mendeteksi bahaya. Gunakan blok DAN untuk menggabungkan Bahaya dengan konfirmasi Tombol 1.',
  steps: [
  st('Empathize & Define ', 'Pain Points: Bahaya ganda ledakan gas. Kipas harus langsung jalan, tapi pintu keluar tidak boleh sembarangan dibuka tanpa konfirmasi manajer agar gas tidak bocor ke luar sebelum aman.', 'psychology'),
  st('Ideate & Prototype ', '1) Buat Kondisi Kritis: Getaran > 500 ATAU Suhu > 45.\n2) Kalau Kondisi Kritis -> Nyalakan Kipas Kencang & Sirine Darurat.\n3) Kalau [Kondisi Kritis] DAN [Tombol 1 Ditekan] -> Pintu Terbuka. Selain Itu -> Pintu Tertutup.', 'design_services'),
  st('Test (Uji Coba) ', 'Beri Suhu > 45. Kipas & Sirine harus aktif, tapi pintu tetap tutup. Lalu tekan Tombol 1, pintu baru boleh buka. Uji dengan Getaran juga. Sukses? Validasi!', 'science')
  ],
  validation: { requiredBlocks: ['resq_jika_tidak', 'resq_bandingkan', 'resq_dan_atau', 'resq_motor', 'resq_buzzer', 'resq_tombol_1', 'resq_servo'], codeContains: ["> 500", "> 45"] }
  },
  {
  id: 'proyek_03', category: 'proyek', level: 3,
  title: 'Posko Gunung Cerdas (Suhu)', icon: 'device_thermostat',
  scenario: 'PVMBG butuh posko otomatis 3 level yang akurat. Warga resah karena sirine sering bunyi mendadak di status waspada. Buat sistem berjenjang!',
  objective: 'Aman (<30): Lampu Info. Siaga (30-45): Lampu Aman Berkedip (Loop) + Kipas Pelan. Awas (>45): Lampu Bahaya + Sirine + Pintu Buka.',
  hint: 'Gunakan logika bertumpuk (nested if). Gunakan perbandingan (< 30), (> 30 DAN < 45), (> 45).',
  steps: [
  st('Empathize & Define ', 'Pain Points: Kepanikan warga akibat sirine yang salah waktu. Mereka butuh peringatan bertahap yang mulus dari Aman, Siaga, hingga Awas.', 'psychology'),
  st('Ideate & Prototype ', '1) Kalau Suhu < 30 -> Aman (Lampu Info Nyala, lain mati).\n2) Selain Itu, Kalau Suhu < 45 -> Siaga (Ulangi 3x: Lampu Aman Kedip, Kipas Pelan).\n3) Selain Itu (berarti Suhu >= 45) -> Awas (Lampu Bahaya, Sirine, Pintu Terbuka).', 'design_services'),
  st('Test (Uji Coba) ', 'Geser suhu pelan-pelan. Cek transisi dari lampu Info (Aman), ke lampu kuning berkedip (Siaga), hingga ke Sirine dan Pintu Terbuka (Awas). Sukses? Validasi!', 'science')
  ],
  validation: { requiredBlocks: ['resq_jika_tidak', 'resq_bandingkan', 'resq_sensor_suhu', 'resq_led', 'resq_ulangi', 'resq_motor', 'resq_buzzer', 'resq_servo'], codeContains: ["< 30", "< 45"] }
  },
  {
  id: 'proyek_04', category: 'proyek', level: 4,
  title: 'Pusat Komando (Final Boss)', icon: 'admin_panel_settings',
  scenario: 'BPBD Kota menugaskanmu membuat sistem "Super-Brain". Sistem ini harus menangkal alarm palsu, merespons letusan gunung, dan punya Protokol Kiamat (Doomsday).',
  objective: 'Ancaman Aktif jika: (Getaran > 700 DAN Bukan Tombol 2) ATAU Suhu > 50. Jika ada ancaman Gempa DAN Gunung BERSAMAAN -> Protokol Doomsday.',
  hint: 'Kombinasikan semua blok. Protokol Doomsday: Matikan semua lampu, Ulangi 5x (Sirine), Pintu Buka, Kipas Kencang.',
  steps: [
  st('Empathize & Define ', 'Pain Points: Multi-bencana bisa menghancurkan kota. Sistem harus tahan uji dari getaran palsu (filter) dan bereaksi maksimal jika gempa dan gunung terjadi BERSAMAAN.', 'psychology'),
  st('Ideate & Prototype ', 'Tantangan Master: Gunakan filter BUKAN Tombol 2 untuk gempa. Deteksi gempa asli DAN gunung meletus secara bersamaan. Jika terjadi, jalankan aksi paling ekstrem. Tidak ada petunjuk blok untuk level ini. Buktikan kamu layak lulus!', 'design_services'),
  st('Test (Uji Coba) ', 'Uji filter getaran palsu (Tombol 2 menahan sirine gempa). Uji gempa + gunung meletus bersamaan untuk memicu Doomsday. Jika sempurna, tekan Validasi. Selamat, Pahlawan!', 'science')
  ],
  validation: { requiredBlocks: ['resq_jika_tidak', 'resq_bandingkan', 'resq_dan_atau', 'resq_bukan', 'resq_tombol_2', 'resq_ulangi', 'resq_semua_led_mati', 'resq_buzzer', 'resq_motor', 'resq_servo'], codeContains: ["> 700", "> 50"] }
  }
];
