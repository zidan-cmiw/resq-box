import { create } from 'zustand';
import { MISSIONS, CATEGORIES, type MissionCategory } from '../missions/data/missions';
import { useAuthStore } from './teacherStore';

type ValidationStatus = 'idle' | 'checking' | 'pass' | 'fail';

export function getActiveUserId(): string {
  if (typeof window === 'undefined') return 'guest';
  try {
    const raw = localStorage.getItem('resqbox-current-user');
    if (raw) {
      const user = JSON.parse(raw);
      if (user?.id) return user.id;
    }
  } catch {}
  return 'guest';
}

function getUserMissionKey(userId?: string): string {
  return `resqbox_missions_${userId || 'guest'}`;
}

export function loadMissionsForUser(userId?: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const key = getUserMissionKey(userId);
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const validIds = new Set(MISSIONS.map((m) => m.id));
        return parsed.filter((id) => validIds.has(id));
      }
    }
  } catch {}
  return [];
}

export function saveMissionsForUser(userId: string | undefined, missionIds: string[]) {
  if (typeof window === 'undefined') return;
  try {
    const key = getUserMissionKey(userId);
    localStorage.setItem(key, JSON.stringify(missionIds));
  } catch {}
}

interface MissionState {
  completedMissionIds: string[];
  activeMissionId: string | null;
  validationStatus: ValidationStatus;
  validationMessage: string;
  currentCategoryIndex: number;

  setActiveMission: (id: string | null) => void;
  completeMission: (id: string) => void;
  setValidationResult: (status: ValidationStatus, message: string) => void;
  resetValidation: () => void;
  isUnlocked: (missionId: string) => boolean;
  isCategoryUnlocked: (categoryIndex: number) => boolean;
  setCurrentCategoryIndex: (index: number) => void;
  getCategoryProgress: (categoryId: MissionCategory) => { completed: number; total: number };
  syncUser: (userId?: string) => void;
}

const initialUserId = getActiveUserId();
const initialMissions = loadMissionsForUser(initialUserId);

export const useMissionStore = create<MissionState>()((set, get) => ({
  completedMissionIds: initialMissions,
  activeMissionId: null,
  validationStatus: 'idle',
  validationMessage: '',
  currentCategoryIndex: 0,

  syncUser: (userId?: string) => {
    const targetUserId = userId || getActiveUserId();
    const ids = loadMissionsForUser(targetUserId);
    set({
      completedMissionIds: ids,
      activeMissionId: null,
      validationStatus: 'idle',
      validationMessage: '',
      currentCategoryIndex: 0,
    });
  },

  setActiveMission: (id) => set({ activeMissionId: id, validationStatus: 'idle', validationMessage: '' }),

  completeMission: (id) => {
    const userId = getActiveUserId();
    const current = get().completedMissionIds;
    const next = current.includes(id) ? current : [...current, id];

    // Save to user-scoped localStorage
    saveMissionsForUser(userId, next);
    set({ completedMissionIds: next });

    // Sync with teacher store
    import('./teacherStore').then(({ useAuthStore }) => {
      const authState = useAuthStore.getState();
      if (authState.student) {
        authState.completeMission(id);
      }

      // Check if ALL missions are now completed for this user → mark Level 3 as done
      const allIds = new Set(next);
      const allMissionsDone = MISSIONS.every((m) => allIds.has(m.id));

      if (allMissionsDone) {
        // Unlock beyond Level 3
        authState.unlockLevel(4);

        // Submit Level 3 completion to cloud
        import('../utils/supabaseClient').then(({ submitLevelProgress }) => {
          const student = authState.student;
          submitLevelProgress({
            student_id: student?.id || userId,
            student_name: student?.name || 'RESQ-Team',
            classroom_code: student?.classroom_id || 'RESQ-8A',
            level_number: 3,
            score: 100,
            details: {
              missions_completed: MISSIONS.length,
              categories_completed: CATEGORIES.map((c) => c.id),
            },
          });
        });
      }
    });
  },

  setValidationResult: (status, message) =>
    set({ validationStatus: status, validationMessage: message }),

  resetValidation: () => set({ validationStatus: 'idle', validationMessage: '' }),

  setCurrentCategoryIndex: (index) => set({ currentCategoryIndex: index }),

  isUnlocked: (missionId) => {
    const { completedMissionIds } = get();
    const missionIdx = MISSIONS.findIndex((m) => m.id === missionId);
    if (missionIdx === -1) return false;

    // Level 1 (misi pertama) selalu terbuka
    if (missionIdx === 0) return true;

    // Misi ke-i terbuka HANYA jika misi ke-(i - 1) sebelumnya sudah diselesaikan
    const prevMission = MISSIONS[missionIdx - 1];
    return completedMissionIds.includes(prevMission.id);
  },

  isCategoryUnlocked: (categoryIndex) => {
    if (categoryIndex === 0) return true;
    const currentCategory = CATEGORIES[categoryIndex];
    if (!currentCategory || currentCategory.id === 'proyek') return true;

    const authState = useAuthStore.getState();
    if (authState.currentUser?.username === 'demo' || authState.unlockedLevel >= 4) return true;

    let unlockedMax = 1;
    const settings = authState.settings;
    if (settings && typeof settings.unlocked_mission_category === 'number') {
      unlockedMax = settings.unlocked_mission_category;
    }

    if (categoryIndex < unlockedMax) return true;

    // Unlock naturally if previous category is completed
    const prevCategory = CATEGORIES[categoryIndex - 1];
    if (prevCategory) {
      const prevProgress = get().getCategoryProgress(prevCategory.id);
      if (prevProgress.completed >= prevProgress.total && prevProgress.total > 0) {
        return true;
      }
    }

    return false;
  },

  getCategoryProgress: (categoryId) => {
    const { completedMissionIds } = get();
    const missionsInCategory = MISSIONS.filter((m) => m.category === categoryId);
    const completed = missionsInCategory.filter((m) => completedMissionIds.includes(m.id)).length;
    return { completed, total: missionsInCategory.length };
  },
}));

// Automatic subscription to auth store changes
if (typeof window !== 'undefined') {
  import('./teacherStore').then(({ useAuthStore }) => {
    useAuthStore.subscribe((state, prevState) => {
      const currentId = state.currentUser?.id || 'guest';
      const prevId = prevState?.currentUser?.id || 'guest';
      if (currentId !== prevId) {
        useMissionStore.getState().syncUser(currentId);
      }
    });
  });
}
