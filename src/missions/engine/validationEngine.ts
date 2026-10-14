import type { Mission } from '../data/missions';
import type * as Blockly from 'blockly/core';

interface ValidationResult {
  passed: boolean;
  failureReason?: string;
}

/** Walk up the parent chain: returns true if any ancestor has the given type */
function hasAncestor(block: Blockly.Block, ancestorType: string): boolean {
  let parent = block.getParent();
  while (parent) {
    if (parent.type === ancestorType) return true;
    parent = parent.getParent();
  }
  return false;
}

/** Blok induk yang membungkus seluruh rangkaian blok misi ("Sistem Mitigasi"). */
const PROGRAM_ROOT = 'resq_program';

/** Nama ramah anak untuk setiap tipe blok, dipakai di pesan kegagalan. */
const BLOCK_LABELS: Record<string, string> = {
  resq_program: 'Sistem Mitigasi',
  resq_tunggu: 'Tunggu Waktu (Detik)',
  resq_ulangi: 'Ulangi Aksi',
  resq_layar_oled: 'Layar Info Publik',
  resq_stopall: 'Hentikan Semua Perangkat',
  resq_lampu_status: 'Atur Lampu Status',
  resq_sirine_ews: 'Sirine EWS',
  resq_sirine_stop: 'Sirine Berhenti',
  resq_alarm_darurat: 'Alarm Darurat',
  resq_gempa_sim: 'Simulasi Gempa Bumi',
  resq_gunung_sim: 'Simulasi Status Gunung',
  resq_tipe_gempa: 'Tipe Gempa (Ringan/Sedang/Besar)',
  resq_tipe_letusan: 'Tipe Letusan (Eksplosif/Efusif)',
  resq_evak_keluar_bangunan: 'Evakuasi Keluar Bangunan',
  resq_evak_tanah_lapang: 'Evakuasi ke Tanah Lapang Terdekat',
  resq_evak_krb: 'Evakuasi Warga ke Zona KRB',
  resq_evak_luar_map: 'Evakuasi Menjauh dari KRB I (Luar Area Peta)',
  resq_evak_jauhi_sungai: 'Evakuasi Menjauhi Wilayah Sungai',
  resq_jika: 'Kalau... Maka',
  resq_jika_tidak: 'Kalau... Maka... Selain Itu',
  resq_bandingkan: 'Blok Perbandingan (>, <, ==)',
  resq_dan_atau: 'Blok DAN / ATAU',
  resq_bukan: 'Blok BUKAN',
  resq_hitung: 'Hitung Angka',
  resq_buzzer: 'Sirine/Buzzer Berbunyi',
  resq_motor_getar: 'Motor Getar',
  resq_mist: 'Pengabut Asap',
  resq_audio: 'Putar Suara',
  resq_teks: 'Teks',
  math_number: 'Angka',
};

/** Kategori toolbox asal setiap blok, agar siswa tahu ke mana harus mencari. */
const CATEGORY_MAP: Record<string, string> = {
  resq_program: 'Sistem',
  resq_tunggu: 'Sistem',
  resq_ulangi: 'Sistem',
  resq_layar_oled: 'Sistem',
  resq_stopall: 'Sistem',
  resq_gempa_sim: 'Simulasi Bencana',
  resq_gunung_sim: 'Simulasi Bencana',
  resq_lampu_status: 'Peringatan & EWS',
  resq_sirine_ews: 'Peringatan & EWS',
  resq_sirine_stop: 'Peringatan & EWS',
  resq_alarm_darurat: 'Peringatan & EWS',
  resq_motor_getar: 'Perangkat Diorama',
  resq_mist: 'Perangkat Diorama',
  resq_buzzer: 'Perangkat Diorama',
  resq_audio: 'Perangkat Diorama',
  resq_evak_keluar_bangunan: 'Aksi & Evakuasi',
  resq_evak_tanah_lapang: 'Aksi & Evakuasi',
  resq_evak_krb: 'Aksi & Evakuasi',
  resq_evak_luar_map: 'Aksi & Evakuasi',
  resq_evak_jauhi_sungai: 'Aksi & Evakuasi',
  resq_tipe_gempa: 'Kondisi Bencana',
  resq_tipe_letusan: 'Kondisi Bencana',
  resq_jika: 'Pengambilan Keputusan',
  resq_jika_tidak: 'Pengambilan Keputusan',
  resq_bandingkan: 'Pengambilan Keputusan',
  resq_dan_atau: 'Pengambilan Keputusan',
  resq_bukan: 'Pengambilan Keputusan',
  resq_hitung: 'Pengambilan Keputusan',
  resq_teks: 'Pengambilan Keputusan',
  math_number: 'Pengambilan Keputusan',
};

/** Nama tampilan sebuah tipe blok; jatuh ke tipe aslinya bila belum terdaftar. */
function label(type: string): string {
  return BLOCK_LABELS[type] ?? type;
}

export function validateMission(
  mission: Mission,
  workspace: Blockly.Workspace,
  generatedCode: string
): ValidationResult {
  const { validation } = mission;
  const allBlocks = workspace.getAllBlocks(false);
  const blockTypes = allBlocks.map((b) => b.type);

  // --- Check 1: Required Blocks ---
  if (validation.requiredBlocks) {
    for (const requiredType of validation.requiredBlocks) {
      if (!blockTypes.includes(requiredType)) {
        const catHint = CATEGORY_MAP[requiredType]
          ? ` (dapat diambil dari Kategori ${CATEGORY_MAP[requiredType]})`
          : '';
        return {
          passed: false,
          failureReason: `Blok yang diperlukan belum ada di kanvas: "${label(requiredType)}"${catHint}.`,
        };
      }
    }
  }

  // --- Check 2: Ancestor Constraints (block hierarchy) ---
  //
  // `ancestorConstraints` WAJIB ada di setiap misi (lihat `MissionValidation`),
  // jadi tidak ada lagi cabang "kalau ada". Misi yang lupa mencantumkannya
  // DITOLAK, bukan diloloskan tanpa pemeriksaan hierarki. Sebelumnya
  // pemeriksaan ini dilewati diam-diam, sehingga blok yang dijatuhkan terlepas
  // (tidak tersambung ke blok program) tetap dianggap lulus.
  if (!validation.ancestorConstraints || Object.keys(validation.ancestorConstraints).length === 0) {
    return {
      passed: false,
      failureReason:
        'Misi ini belum memiliki aturan susunan blok. Laporkan kepada gurumu — ' +
        'misi tidak dapat divalidasi dengan benar.',
    };
  }

  // Blok program ("Sistem Mitigasi") harus ada TEPAT SATU di kanvas, supaya
  // seluruh blok misi benar-benar tersusun dalam satu rangkaian yang dijalankan.
  const programBlocks = allBlocks.filter((b) => b.type === PROGRAM_ROOT);
  if (programBlocks.length === 0) {
    return {
      passed: false,
      failureReason:
        `Blok induk "${BLOCK_LABELS[PROGRAM_ROOT]}" belum ada di kanvas. ` +
        'Ambil dulu dari Kategori Sistem, lalu susun seluruh blok di dalamnya.',
    };
  }
  if (programBlocks.length > 1) {
    return {
      passed: false,
      failureReason:
        `Ada ${programBlocks.length} blok "${BLOCK_LABELS[PROGRAM_ROOT]}" di kanvas. ` +
        'Gunakan SATU blok program saja, lalu pindahkan seluruh blok ke dalamnya.',
    };
  }

  // Jaring pengaman: SETIAP blok yang diminta misi harus benar-benar tersambung
  // ke dalam blok program, bukan sekadar "ada" di kanvas. Aturan eksplisit di
  // `ancestorConstraints` tetap dipakai; blok yang belum punya aturan sendiri
  // otomatis diwajibkan berada di dalam blok program.
  const constraints: Record<string, string> = { ...validation.ancestorConstraints };
  for (const requiredType of validation.requiredBlocks ?? []) {
    if (requiredType !== PROGRAM_ROOT && !(requiredType in constraints)) {
      constraints[requiredType] = PROGRAM_ROOT;
    }
  }

  for (const [childType, ancestorType] of Object.entries(constraints)) {
    const childBlocks = allBlocks.filter((b) => b.type === childType);
    if (childBlocks.length === 0) {
      return {
        passed: false,
        failureReason: `Blok "${label(childType)}" tidak ditemukan di kanvas.`,
      };
    }
    // Setiap blok bertipe itu harus tersambung; bila ada satu saja yang
    // terlepas, misi belum dianggap selesai.
    const allInside = childBlocks.every((b) => hasAncestor(b, ancestorType));
    if (!allInside) {
      return {
        passed: false,
        failureReason: `Blok "${label(childType)}" harus diletakkan di DALAM blok "${label(ancestorType)}". Coba seret blok ke dalamnya!`,
      };
    }
  }

  // --- Check 3: Required Code Strings ---
  if (validation.codeContains) {
    for (const reqCode of validation.codeContains) {
      if (!generatedCode.includes(reqCode)) {
        return {
          passed: false,
          failureReason: `Susunan blok sepertinya belum tepat. Pastikan kamu meletakkan blok sesuai petunjuk misi. Coba cek lagi ya!`,
        };
      }
    }
  }

  return { passed: true };
}
