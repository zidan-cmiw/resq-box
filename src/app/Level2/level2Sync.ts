// ── src/app/Level2/level2Sync.ts ─────────────────────────────────────
// Sinkronisasi real-time progres Level 2: Disaster Analyst & Response
// Mengirim data skor, misi tuntas, lencana, dan membuka Level 3 ke Dashboard Guru & Supabase.

import { submitLevelProgress } from '../../utils/supabaseClient';
import { useAuthStore, type Student } from '../../store/teacherStore';
import { loadLevel2Progress } from './engine/gameEngine';

export interface Level2ProgressPayload {
  score: number;
  currentMission: number;
  completedMissions: number[];
  resiliencePoints: number;
  badges: string[];
  isCompleted: boolean;
  statusText?: string;
}

export async function syncLevel2Progress(
  student: Student | null,
  progress: Level2ProgressPayload
): Promise<void> {
  const authState = useAuthStore.getState();
  const effectiveStudent: Student | null =
    student ||
    authState.student ||
    (authState.currentUser
      ? {
        id: authState.currentUser.id,
        name: authState.currentUser.name,
        username: authState.currentUser.username,
        classroom_id: authState.currentUser.classroom_code || 'RESQ-8A',
        class_name: `Kelas (${authState.currentUser.classroom_code || 'RESQ-8A'})`,
        absent_number: authState.currentUser.absent_number || '1',
        school_name: authState.currentUser.school_name || 'SMP Negeri 1',
        custom_avatar: authState.currentUser.avatar_config,
        progress: { missionCompletedIds: [], mitigationScores: {} },
      }
      : null);

  if (!effectiveStudent) return;

  const clampedScore = Math.min(100, Math.max(0, progress.score));
  const isDone = progress.isCompleted || clampedScore >= 100 || (progress.completedMissions && progress.completedMissions.includes(3));

  if (isDone) {
    authState.unlockLevel(3);
  }

  try {
    await submitLevelProgress({
      student_id: effectiveStudent.id,
      student_name: effectiveStudent.name,
      classroom_code: effectiveStudent.classroom_id || 'RESQ-8A',
      level_number: 2,
      score: clampedScore,
      details: {
        mode: 'tectonic_explorer',
        is_completed: isDone,
        current_mission: progress.currentMission,
        completed_missions: progress.completedMissions,
        resilience_points: progress.resiliencePoints,
        badges: progress.badges,
        status_text: isDone ? 'TUNTAS' : (progress.statusText || `${clampedScore} Poin`),
        stage_label: isDone
          ? 'Tuntas (Mitigasi Gempa, Simulasi & Pascabencana - 100 Poin)'
          : `Zona Mitigasi ${progress.currentMission} (${clampedScore} Poin)`,
        crystals: Math.min(21, loadLevel2Progress(effectiveStudent.id)?.collectedCrystals?.length ?? 0),
      },
    });
  } catch (err) {
    console.warn('[Level2Sync] Failed to broadcast level 2 progress:', err);
  }
}
