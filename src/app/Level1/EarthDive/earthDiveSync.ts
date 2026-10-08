// ── src/app/Level1/EarthDive/earthDiveSync.ts ─────────────────────────
// Sinkronisasi Evaluasi Geologi Level 1 (Earth Dive) ke Dashboard Guru & Supabase
// Menghitung perolehan nilai dinamis (20 poin per lapisan bumi tuntas) & pelaporan real-time

import type { GameState } from './engine/gameEngine';
import type { Student } from '../../../store/teacherStore';
import { submitLevelProgress } from '../../../utils/supabaseClient';

export interface EarthDiveProgressResult {
  score: number;
  currentLayer: string;
  isCompleted: boolean;
  crystalsCount: number;
  unlockedGates: string[];
  solvedWords: string[];
  badges: string[];
  statusText: 'TUNTAS' | 'SEDANG DIKERJAKAN' | 'BELUM';
}

export const STRATA_LAYERS = [
  { zoneIndex: 0, name: 'Permukaan Bumi (0 km)', gateId: 'surface_gate', points: 12 },
  { zoneIndex: 1, name: 'Kerak Bumi / Litosfer (0–100 km)', gateId: 'crust_challenge', points: 25 },
  { zoneIndex: 2, name: 'Mantel Bumi (100–2.900 km)', gateId: 'mantle_challenge', points: 38 },
  { zoneIndex: 3, name: 'Inti Luar (2.900–5.150 km)', gateId: 'oc_challenge', points: 50 },
  { zoneIndex: 4, name: 'Inti Dalam (5.150–6.371 km)', gateId: 'ic_challenge', points: 63 },
  { zoneIndex: 5, name: 'Batas Divergen & Retakan (East African Rift)', gateId: 'divergent_challenge', points: 75 },
  { zoneIndex: 6, name: 'Batas Konvergen & Subduksi', gateId: 'convergent_challenge', points: 88 },
  { zoneIndex: 7, name: 'Batas Transform & Sesar Geser', gateId: 'transform_challenge', points: 100 },
];

/**
 * Hitung capaian skor dan lapisan murid saat ini di Level 1
 */
export function computeEarthDiveProgress(game: GameState): EarthDiveProgressResult {
  const isTransformGateUnlocked = game.unlockedGates.has('transform_challenge');
  const isConvergentGateUnlocked = game.unlockedGates.has('convergent_challenge');
  const isDivergentGateUnlocked = game.unlockedGates.has('divergent_challenge');
  const isInnerCoreGateUnlocked = game.unlockedGates.has('ic_challenge');
  const isOuterCoreGateUnlocked = game.unlockedGates.has('oc_challenge');
  const isMantleGateUnlocked = game.unlockedGates.has('mantle_challenge');
  const isCrustGateUnlocked = game.unlockedGates.has('crust_challenge');

  let score = 0;
  let currentLayer = 'Permukaan Bumi (0 km)';
  const solvedWords: string[] = [];
  const badges: string[] = [];

  // Area 1: Permukaan
  if (game.currentZone >= 0) {
    badges.push('Surface Scout');
    score = 12;
    currentLayer = 'Permukaan Bumi (0 km)';
  }

  // Area 2: Kerak Bumi
  if (isCrustGateUnlocked || game.currentZone >= 2) {
    solvedWords.push('KERAK', 'BENUA', 'SAMUDRA');
    score = 25;
    currentLayer = 'Kerak Bumi (0–100 km)';
  }

  // Area 3: Mantel Bumi
  if (isMantleGateUnlocked || game.currentZone >= 3) {
    solvedWords.push('MANTEL', 'PANAS', 'KONVEKSI');
    if (!badges.includes('Mantle Explorer')) badges.push('Mantle Explorer');
    score = 38;
    currentLayer = 'Mantel Bumi (100–2.900 km)';
  }

  // Area 4: Inti Luar
  if (isOuterCoreGateUnlocked || game.currentZone >= 4) {
    solvedWords.push('NIKEL', 'CAIRAN', 'MAGNET');
    if (!badges.includes('Magnetic Shield')) badges.push('Magnetic Shield');
    score = 50;
    currentLayer = 'Inti Luar (2.900–5.150 km)';
  }

  // Area 5: Inti Dalam
  if (isInnerCoreGateUnlocked || game.currentZone >= 5) {
    solvedWords.push('BOLABESIPADAT', 'SEPULUHRIBU', 'INTIDALAM');
    if (!badges.includes('Core Specialist')) badges.push('Core Specialist');
    score = 63;
    currentLayer = 'Inti Dalam (5.150–6.371 km)';
  }

  // Area 6: Batas Divergen (East African Rift & Pangea)
  if (isDivergentGateUnlocked || game.currentZone >= 6) {
    solvedWords.push('PANGEA', 'MENJAUH', 'MAGMA');
    if (!badges.includes('Rift Explorer')) badges.push('Rift Explorer');
    score = 75;
    currentLayer = 'Batas Divergen & Lembah Retakan';
  }

  // Area 7: Batas Konvergen
  if (isConvergentGateUnlocked || game.currentZone >= 7) {
    solvedWords.push('SUBDUKSI', 'PALUNG');
    if (!badges.includes('Subduction Tracker')) badges.push('Subduction Tracker');
    score = 88;
    currentLayer = 'Batas Konvergen & Subduksi';
  }

  // Area 8: Batas Transform (Puncak Level 1)
  if (isTransformGateUnlocked || game.completedChallenges.has('core_synthesis')) {
    solvedWords.push('SESAR', 'TRANSFORM', 'GEMPA');
    if (!badges.includes('Master of Tectonics')) badges.push('Master of Tectonics');
    score = 100;
    currentLayer = 'Batas Transform (Tuntas Level 1)';
  }

  const isCompleted = isTransformGateUnlocked || game.completedChallenges.has('core_synthesis');
  const statusText: 'TUNTAS' | 'SEDANG DIKERJAKAN' | 'BELUM' = isCompleted
    ? 'TUNTAS'
    : score > 12 || game.currentZone > 0 || game.collectedCrystals.size > 0
      ? 'SEDANG DIKERJAKAN'
      : 'BELUM';

  return {
    score,
    currentLayer,
    isCompleted,
    crystalsCount: game.collectedCrystals.size,
    unlockedGates: Array.from(game.unlockedGates),
    solvedWords,
    badges,
    statusText,
  };
}

/**
 * Kirim update progres Level 1 secara otomatis ke Supabase & Dashboard Guru
 */
export async function syncEarthDiveProgress(
  game: GameState,
  student: Student | null,
  forceCompleted = false,
): Promise<void> {
  if (!student) return;

  const progress = computeEarthDiveProgress(game);
  if (forceCompleted) {
    progress.score = 100;
    progress.isCompleted = true;
    progress.statusText = 'TUNTAS';
  }

  // Jumlah area yang sudah tuntas. Indeks zona 0..7, jadi zona terakhir = 8 area.
  const zonesCompleted = Math.min(8, Math.max(0, game.currentZone + 1));

  await submitLevelProgress({
    student_id: student.id,
    student_name: student.name,
    classroom_code: student.classroom_id || 'RESQ-8A',
    level_number: 1,
    // Nilai versi klien hanya dipakai sebagai batas atas; server menghitung
    // nilai resmi dari `missions` (jumlah area tuntas).
    score: progress.score,
    missions: zonesCompleted,
    isCompleted: progress.isCompleted,
    details: {
      mode: 'earth_dive_descent',
      is_completed: progress.isCompleted,
      current_layer: progress.currentLayer,
      current_zone: game.currentZone,
      zones_completed: zonesCompleted,
      crystals: progress.crystalsCount,
      total_crystals: 16,
      unlocked_gates: progress.unlockedGates,
      badges: progress.badges,
      words: progress.solvedWords,
      status_text: progress.statusText,
      stage_label: progress.isCompleted
        ? 'Tuntas (Inti Bumi 6.371 km)'
        : `${progress.currentLayer.split(' ')[0]} (${progress.score} Poin)`,
    },
  });
}
