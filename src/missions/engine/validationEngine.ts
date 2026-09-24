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
          resq_led: 'Lampu Bahaya',
          resq_buzzer: 'Buzzer berbunyi',
          resq_buzzer_stop: 'Buzzer berhenti',
          resq_sensor_getar: 'Nilai Sensor Getaran',
          resq_sensor_suhu: 'Nilai Suhu',
          resq_tombol_1: 'Tombol 1 ditekan?',
          resq_tombol_2: 'Tombol 2 ditekan?',
          resq_jika: 'Kalau...Maka Lakukan',
          resq_jika_tidak: 'Kalau...Maka Lakukan...Selain Itu',
          resq_bandingkan: 'Blok Perbandingan (>, <, ==)',
          resq_dan_atau: 'Blok DAN / ATAU',
          resq_bukan: 'Blok BUKAN (Tidak Terjadi)',
          resq_ulangi: 'Blok Ulangi Aksi',
          resq_alarm_darurat: 'Alarm Darurat',
          resq_led_kedip: 'Lampu Kedip',
          resq_semua_led_mati: 'Matikan Semua Lampu',
          resq_getar_kuat: 'Getaran kuat?',
          resq_suhu_panas: 'Suhu panas?',
        };
        return {
          passed: false,
          failureReason: `Blok yang diperlukan belum ada di kanvas: ${labels[requiredType] ?? requiredType}`,
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
