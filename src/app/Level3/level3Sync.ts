// ── src/app/Level3/level3Sync.ts ─────────────────────────────────────
// Sinkronisasi real-time progres Level 3: Action Lab & Simulation Game
// Mengirim data skor, misi tuntas (Job 01-20), dan status ke Dashboard Guru & Supabase.

import { submitLevelProgress, getLocalStudents } from '../../utils/supabaseClient';
import { useAuthStore, type Student, DEFAULT_CUSTOM_AVATAR } from '../../store/teacherStore';
import { MISSIONS } from '../../missions/data/missions';
import { loadMissionsForUser, getActiveUserId } from '../../store/missionStore';

export interface Level3ProgressPayload {
  score: number;
  completedMissions: string[];
  completedCount: number;
  totalMissions: number;
  lastCompletedId?: string;
  isCompleted: boolean;
  statusText?: string;
  stageLabel?: string;
}

export function loadLevel3Progress(userId?: string): {
  completedMissions: string[];
  score: number;
  isCompleted: boolean;
} {
  const missions = loadMissionsForUser(userId);
  const total = MISSIONS.length; // 20
  const score = Math.min(100, Math.round((missions.length / total) * 100));
  const isCompleted = missions.length >= total || score >= 100;
  return { completedMissions: missions, score, isCompleted };
}

export async function syncLevel3Progress(
  student?: Student | null,
  progressOverride?: Partial<Level3ProgressPayload>
): Promise<void> {
  const authState = useAuthStore.getState();
  const activeUserId = getActiveUserId();

  let effectiveStudent: Student | null = student || authState.student;
  if (!effectiveStudent && authState.currentUser) {
    effectiveStudent = {
      id: authState.currentUser.id,
      name: authState.currentUser.name,
      username: authState.currentUser.username,
      classroom_id: authState.currentUser.classroom_code || 'RESQ-8A',
      class_name: `Kelas (${authState.currentUser.classroom_code || 'RESQ-8A'})`,
      absent_number: authState.currentUser.absent_number || '1',
      school_name: authState.currentUser.school_name || 'SMP Negeri 1',
      custom_avatar: authState.currentUser.avatar_config || DEFAULT_CUSTOM_AVATAR,
      progress: { missionCompletedIds: [], mitigationScores: {} },
    };
  }

  // Fallback to local student registry if needed
  if (!effectiveStudent) {
    const localStudents = getLocalStudents();
    const match = localStudents.find((s) => s.id === activeUserId || s.username === activeUserId);
    if (match) {
      effectiveStudent = {
        id: match.id,
        name: match.name,
        username: match.username,
        classroom_id: match.classroom_code || 'RESQ-8A',
        class_name: match.class_name || 'Kelas VIII-A',
        absent_number: match.absent_number || '1',
        school_name: 'SMP Negeri 1',
        custom_avatar: match.avatar_config || DEFAULT_CUSTOM_AVATAR,
        progress: { missionCompletedIds: [], mitigationScores: {} },
      };
    }
  }

  const effectiveId = effectiveStudent?.id || activeUserId;
  const effectiveName =
    effectiveStudent?.name ||
    authState.currentUser?.name ||
    (effectiveId === 'std-demo-all-unlocked' ? 'Taruna Demo (Semua Level Terbuka)' : 'Petualang RESQ');
  const effectiveClassroom =
    effectiveStudent?.classroom_id ||
    authState.currentUser?.classroom_code ||
    'RESQ-8A';

  const completedMissions =
    progressOverride?.completedMissions ?? loadMissionsForUser(effectiveId);
  const completedCount = completedMissions.length;
  const totalMissions = MISSIONS.length; // 20

  const computedScore = Math.min(100, Math.round((completedCount / totalMissions) * 100));
  const score = progressOverride?.score !== undefined ? progressOverride.score : computedScore;
  const isCompleted =
    progressOverride?.isCompleted !== undefined
      ? progressOverride.isCompleted
      : (completedCount >= totalMissions || score >= 100);

  const lastCompletedId =
    progressOverride?.lastCompletedId ||
    (completedMissions.length > 0 ? completedMissions[completedMissions.length - 1] : undefined);
  const lastMissionObj = lastCompletedId ? MISSIONS.find((m) => m.id === lastCompletedId) : undefined;

  const statusText = isCompleted
    ? 'TUNTAS'
    : completedCount > 0
      ? `${score} Poin`
      : 'BELUM';

  const stageLabel = isCompleted
    ? 'Tuntas (20/20 Misi Simulasi Selesai - 100 Poin)'
    : completedCount > 0
      ? `Selesai ${completedCount}/20 Misi (${score} Poin)${lastMissionObj ? ` - Terakhir: ${lastMissionObj.title}` : ''}`
      : 'Belum Mulai Misi';

  try {
    await submitLevelProgress({
      student_id: effectiveId,
      student_name: effectiveName,
      classroom_code: effectiveClassroom,
      level_number: 3,
      score,
      // 20 misi × 5 poin. Server memakai angka ini sebagai sumber nilai resmi.
      missions: completedCount,
      isCompleted,
      details: {
        mode: 'action_lab_simulation',
        is_completed: isCompleted,
        completed_missions: completedMissions,
        completed_count: completedCount,
        missions: completedCount,
        total_missions: totalMissions,
        last_completed_id: lastCompletedId,
        last_completed_title: lastMissionObj?.title,
        status_text: statusText,
        stage_label: stageLabel,
      },
    });
  } catch (err) {
    console.warn('[Level3Sync] Failed to broadcast level 3 progress:', err);
  }
}
