import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MISSIONS, CATEGORIES, type MissionCategory } from '../missions/data/missions';
import { useAuthStore } from './teacherStore';

type ValidationStatus = 'idle' | 'checking' | 'pass' | 'fail';

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
}

export const useMissionStore = create<MissionState>()(
  persist(
    (set, get) => ({
      completedMissionIds: [],
      activeMissionId: null,
      validationStatus: 'idle',
      validationMessage: '',
      currentCategoryIndex: 0,

      setActiveMission: (id) => set({ activeMissionId: id, validationStatus: 'idle', validationMessage: '' }),

      completeMission: (id) => {
        set((state) => ({
          completedMissionIds: state.completedMissionIds.includes(id)
            ? state.completedMissionIds
            : [...state.completedMissionIds, id],
        }));

        // Sync with teacher store
        import('./teacherStore').then(({ useAuthStore }) => {
          const authState = useAuthStore.getState();
          if (authState.student) {
            authState.completeMission(id);
          }

          // Check if ALL missions are now completed → mark Level 3 as done
          const { completedMissionIds } = get();
          const allIds = new Set([...completedMissionIds, id]);
          const allMissionsDone = MISSIONS.every((m) => allIds.has(m.id));

          if (allMissionsDone) {
            // Unlock beyond Level 3 (signals completion)
            authState.unlockLevel(4);

            // Submit Level 3 completion to cloud
            import('../utils/supabaseClient').then(({ submitLevelProgress }) => {
              const student = authState.student;
              submitLevelProgress({
                student_id: student?.id || 'std-1',
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
        const mission = MISSIONS.find((m) => m.id === missionId);
        if (!mission) return false;
        
        // Kategori proyek selalu terbuka semua misinya
        if (mission.category === 'proyek') return true;

        // Cek dulu apakah kategori ini diizinkan oleh guru
        const catIndex = CATEGORIES.findIndex((c) => c.id === mission.category);
        if (!get().isCategoryUnlocked(catIndex)) return false;

        // Level 1 selalu terbuka selama kategorinya diizinkan
        if (mission.level === 1) return true;

        // Mission N requires mission N-1 in the same category to be completed
        const prevMission = MISSIONS.find(
          (m) => m.category === mission.category && m.level === mission.level - 1
        );
        if (!prevMission) return true;
        return completedMissionIds.includes(prevMission.id);
      },

      isCategoryUnlocked: (categoryIndex) => {
        // Categories: 0: Persiapan, 1: Gempa Bumi, 2: Kebakaran, 3: Proyek
        const currentCategory = CATEGORIES[categoryIndex];
        if (currentCategory && currentCategory.id === 'proyek') return true;

        // Fetch unlocked category from authStore settings
        let unlockedMax = 1; // Default to first category
        const settings = useAuthStore.getState().settings;
        if (settings) {
            unlockedMax = settings.unlocked_mission_category;
        }

        // categoryIndex is 0-based. Settings unlocked is 1-based.
        // If settings.unlocked_mission_category is 2, then index 0 and 1 are unlocked.
        return categoryIndex < unlockedMax;
      },

      getCategoryProgress: (categoryId) => {
        const { completedMissionIds } = get();
        const missionsInCategory = MISSIONS.filter((m) => m.category === categoryId);
        const completed = missionsInCategory.filter((m) => completedMissionIds.includes(m.id)).length;
        return { completed, total: missionsInCategory.length };
      },
    }),
    {
      name: 'resqbox-mission-storage',
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error || !state) return;
          // ── Integrity check: validate completedMissionIds ──
          const { completedMissionIds } = state;
          const validIds = new Set(MISSIONS.map((m) => m.id));
          const cleaned = completedMissionIds.filter((id) => {
            if (!validIds.has(id)) return false;
            const mission = MISSIONS.find((m) => m.id === id)!;
            if (mission.level === 1) return true;
            const prevMission = MISSIONS.find(
              (m) => m.category === mission.category && m.level === mission.level - 1
            );
            if (!prevMission) return true;
            return completedMissionIds.includes(prevMission.id);
          });
          if (cleaned.length !== completedMissionIds.length) {
            console.warn(
              `[Security] Removed ${completedMissionIds.length - cleaned.length} tampered mission(s).`
            );
            state.completedMissionIds = cleaned;
          }
        };
      },
    }
  )
);
