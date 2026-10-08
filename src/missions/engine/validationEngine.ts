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
        const labels: Record<string, string> = {
          resq_program: 'Sistem Mitigasi',
          resq_lampu_status: 'Atur Lampu Status',
          resq_sirine_ews: 'Sirine EWS',
          resq_layar_oled: 'Layar Info Publik',
          resq_gempa_sim: 'Simulasi Gempa Bumi',
          resq_gunung_sim: 'Simulasi Status Gunung',
          resq_letusan_sim: 'Simulasi Letusan Merapi',
          resq_tipe_gempa: 'Tipe Gempa (Ringan/Sedang/Besar)',
          resq_status_gunung: 'Status Gunung (Waspada/Siaga/Awas)',
          resq_tipe_letusan: 'Tipe Letusan (Eksplosif/Efusif)',
          resq_evak_keluar_bangunan: 'Evakuasi Keluar Bangunan',
          resq_evak_tanah_lapang: 'Evakuasi ke Tanah Lapang Terdekat',
          resq_evak_krb: 'Evakuasi Warga ke Zona KRB',
          resq_evak_luar_map: 'Evakuasi Menjauh dari KRB I (Luar Area Peta)',
          resq_evak_jauhi_sungai: 'Evakuasi Menjauh dari Wilayah Sungai',
          resq_tunggu: 'Tunggu Waktu (Detik)',
          resq_ulangi: 'Ulangi Aksi',
          resq_jika: 'Kalau... Maka',
          resq_jika_tidak: 'Kalau... Maka... Selain Itu',
          resq_bandingkan: 'Blok Perbandingan (>, <, ==)',
          resq_dan_atau: 'Blok DAN / ATAU',
          resq_bukan: 'Blok BUKAN',
          resq_alarm_darurat: 'Alarm Darurat',
          resq_led_kedip: 'Lampu Kedip',
          resq_semua_led_mati: 'Matikan Semua Lampu',
          resq_buzzer: 'Sirine/Buzzer Berbunyi',
          resq_buzzer_stop: 'Sirine Berhenti',
        };
        const categoryMap: Record<string, string> = {
          resq_program: 'Sistem',
          resq_tunggu: 'Sistem',
          resq_ulangi: 'Sistem',
          resq_layar_oled: 'Sistem',
          resq_gempa_sim: 'Simulasi Bencana',
          resq_gunung_sim: 'Simulasi Bencana',
          resq_lampu_status: 'Peringatan & EWS',
          resq_sirine_ews: 'Peringatan & EWS',
          resq_sirine_stop: 'Peringatan & EWS',
          resq_alarm_darurat: 'Peringatan & EWS',
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
        };
        const catHint = categoryMap[requiredType] ? ` (dapat diambil dari Kategori ${categoryMap[requiredType]})` : '';
        return {
          passed: false,
          failureReason: `Blok yang diperlukan belum ada di kanvas: "${labels[requiredType] ?? requiredType}"${catHint}.`,
        };
      }
    }
  }

  // --- Check 2: Ancestor Constraints (block hierarchy) ---
  if (validation.ancestorConstraints) {
    for (const [childType, ancestorType] of Object.entries(validation.ancestorConstraints)) {
      const childBlocks = allBlocks.filter((b) => b.type === childType);
      if (childBlocks.length === 0) {
        return {
          passed: false,
          failureReason: `Blok "${childType}" tidak ditemukan di kanvas.`,
        };
      }
      const allInside = childBlocks.every((b) => hasAncestor(b, ancestorType));
      if (!allInside) {
        const labels: Record<string, string> = {
          resq_program: 'Sistem Mitigasi',
          resq_led: 'Lampu Bahaya',
          resq_jika: 'Kalau...Maka Lakukan',
          resq_jika_tidak: 'Kalau...Selain Itu',
          resq_ulangi: 'Berulang',
        };
        return {
          passed: false,
          failureReason: `Blok "${labels[childType] ?? childType}" harus diletakkan di DALAM blok "${labels[ancestorType] ?? ancestorType}". Coba seret blok ke dalamnya!`,
        };
      }
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
