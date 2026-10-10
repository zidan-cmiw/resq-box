import { create } from 'zustand';
import type { UserAccount } from '../utils/supabaseClient';
import { syncStudentToCloud, loginUser, updateTeacherProfile } from '../utils/supabaseClient';

export interface CustomAvatarConfig {
  skin: 'light' | 'warm' | 'tan' | 'brown' | 'dark' | 'robot';
  hairStyle: 'spiky' | 'parted' | 'curly' | 'ponytail' | 'bob' | 'hijab' | 'headband' | 'cap';
  hairColor: string;
  eyes: 'determined' | 'happy' | 'focus' | 'goggles' | 'glasses';
  outfit: 'vest-orange' | 'jacket-blue' | 'gear-red' | 'khaki' | 'cyber';
  accessory: 'none' | 'walkie' | 'headlamp' | 'mask' | 'badge';
  bgTheme: 'amber' | 'blue' | 'emerald' | 'rose' | 'purple' | 'cyan';
}

export const DEFAULT_CUSTOM_AVATAR: CustomAvatarConfig = {
  skin: 'warm',
  hairStyle: 'spiky',
  hairColor: '#3e2723',
  eyes: 'determined',
  outfit: 'vest-orange',
  accessory: 'walkie',
  bgTheme: 'amber',
};

export interface StudentProgress {
  missionCompletedIds: string[];
  mitigationScores: Record<string, number>;
}

export interface Student {
  id: string;
  name: string;
  username?: string;
  classroom_id: string;
  class_name?: string;
  absent_number?: string;
  school_name?: string;
  avatar_id?: string;
  custom_avatar?: CustomAvatarConfig;
  progress: StudentProgress;
}

export interface ClassroomSettings {
  unlocked_mission_category: number;
  unlocked_mitigation_level: number;
}

interface AuthState {
  currentUser: UserAccount | null;
  student: Student | null;
  settings: ClassroomSettings | null;
  unlockedLevel: number;
  
  // Actions
  login: (username: string, password: string, role: 'student' | 'teacher') => Promise<{ success: boolean; message?: string; user?: UserAccount }>;
  setCurrentUser: (user: UserAccount | null) => void;
  logout: () => void;
  updateProfile: (data: Partial<Student>) => void;
  updateCurrentUserName: (name: string, schoolName?: string) => Promise<boolean>;
  unlockLevel: (level: number) => void;
  completeMission: (missionId: string) => Promise<void>;
  saveMitigationScore: (scenarioId: string, score: number) => Promise<void>;
}

const getStoredUser = (): UserAccount | null => {
  try {
    const raw = localStorage.getItem('resqbox-current-user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const getActiveCustomAvatar = (): CustomAvatarConfig => {
  try {
    const p = localStorage.getItem('resqbox-student-profile');
    if (p) {
      const parsed = JSON.parse(p);
      if (parsed?.custom_avatar) return parsed.custom_avatar;
    }
    const u = localStorage.getItem('resqbox-current-user');
    if (u) {
      const parsed = JSON.parse(u);
      if (parsed?.avatar_config) return parsed.avatar_config;
    }
  } catch {}
  return DEFAULT_CUSTOM_AVATAR;
};

const getInitialStudent = (): Student | null => {
  const saved = localStorage.getItem('resqbox-student-profile');
  let savedProfile: Student | null = null;
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed) {
        if (!parsed.custom_avatar) parsed.custom_avatar = DEFAULT_CUSTOM_AVATAR;
        savedProfile = parsed;
      }
    } catch {}
  }

  const storedUser = getStoredUser();
  if (storedUser && storedUser.role === 'student') {
    return {
      id: storedUser.id,
      name: storedUser.name,
      username: storedUser.username,
      classroom_id: storedUser.classroom_code || 'RESQ-8A',
      class_name: `Kelas (${storedUser.classroom_code || 'RESQ-8A'})`,
      absent_number: storedUser.absent_number || '1',
      school_name: storedUser.school_name || 'SMP Negeri 1',
      custom_avatar: savedProfile?.custom_avatar || storedUser.avatar_config || DEFAULT_CUSTOM_AVATAR,
      progress: savedProfile?.progress || {
        missionCompletedIds: [],
        mitigationScores: {},
      },
    };
  }

  if (savedProfile && savedProfile.id !== 'std-budi' && savedProfile.id !== 'std-siti') {
    return savedProfile;
  }

  return null;
};

const getInitialUnlockedLevel = (user: UserAccount | null): number => {
  if (typeof window === 'undefined') return 1;
  try {
    // Nilai dari SERVER selalu menang: dialah sumber kebenaran setelah
    // submit_level_result menaikkan level. Cache lokal hanya cadangan
    // supaya tampilan tetap benar saat luring.
    const userObjLevel = user?.unlocked_level;
    if (typeof userObjLevel === 'number' && userObjLevel >= 1) {
      return Math.min(3, userObjLevel);
    }
    const userId = user?.id;
    if (userId) {
      const byUser = localStorage.getItem(`resqbox-unlocked-level_${userId}`);
      if (byUser) {
        const parsedByUser = parseInt(byUser, 10);
        if (!isNaN(parsedByUser) && parsedByUser >= 1) return Math.min(3, parsedByUser);
      }
    }
  } catch {}
  return 1;
};

const initialStoredUser = getStoredUser();
let initialUnlockedLevel = getInitialUnlockedLevel(initialStoredUser);

if (initialStoredUser) {
  initialStoredUser.unlocked_level = initialUnlockedLevel;
}

export const useAuthStore = create<AuthState>()((set) => ({
  currentUser: initialStoredUser,
  student: getInitialStudent(),
  settings: null,
  unlockedLevel: initialUnlockedLevel,

  login: async (username: string, password: string, role: 'student' | 'teacher') => {
    const res = await loginUser(username, password, role);
    if (res.success && res.user) {
      const user = res.user;
      // Bersihkan progress guest un-scoped agar tidak bocor ke akun baru
      try {
        localStorage.removeItem('resqbox_level2_progress_guest');
        localStorage.removeItem('resqbox_earthdive_progress_guest');
        localStorage.removeItem('resqbox_earthdive_progress');
        localStorage.removeItem('resqbox_missions_guest');
        localStorage.removeItem('resqbox_workspace_guest');
        localStorage.removeItem('resqbox-mission-storage');
        localStorage.removeItem('resqbox-workspace-v2');
      } catch {}

      if (user.role === 'student') {
        const studentObj: Student = {
          id: user.id,
          name: user.name,
          username: user.username,
          classroom_id: user.classroom_code || 'RESQ-8A',
          class_name: `Kelas (${user.classroom_code || 'RESQ-8A'})`,
          absent_number: user.absent_number || '1',
          school_name: user.school_name || 'SMP Negeri 1',
          custom_avatar: user.avatar_config || DEFAULT_CUSTOM_AVATAR,
          progress: {
            missionCompletedIds: [],
            mitigationScores: {},
          },
        };
        localStorage.setItem('resqbox-student-profile', JSON.stringify(studentObj));
        const byUser = localStorage.getItem(`resqbox-unlocked-level_${user.id}`);
        const parsedByUser = byUser ? parseInt(byUser, 10) : 0;
        const level = Math.max(
          user.unlocked_level || 1,
          !isNaN(parsedByUser) ? parsedByUser : 1
        );
        localStorage.setItem(`resqbox-unlocked-level_${user.id}`, level.toString());
        localStorage.setItem('resqbox-unlocked-level', level.toString());
        try {
          localStorage.removeItem('resqbox_earthdive_progress');
        } catch {}

        // Sinkronisasi store Level 3 & Workspace Blockly khusus untuk akun ini
        import('./missionStore').then(({ useMissionStore }) => {
          useMissionStore.getState().syncUser(user.id);
        });
        import('./workspaceStore').then(({ useWorkspaceStore }) => {
          useWorkspaceStore.getState().syncUser(user.id);
        });

        set({
          currentUser: user,
          student: studentObj,
          unlockedLevel: level,
        });
      } else {
        set({
          currentUser: user,
          student: null,
        });
      }
      return { success: true, user };
    }
    // `res` berasal dari loginUser() di supabaseClient.ts, yang SELURUH
    // pesan galatnya ditulis sendiri oleh kode kita — bukan pesan mentah
    // dari server. Setiap cabang di sana mengembalikan kalimat yang sudah
    // diperiksa, mis. "Username atau password salah!" dan "Sesi Anda
    // berakhir". Karena itu tidak ada yang perlu disaring lagi di sini.
    return { success: false, message: res.message || 'Login gagal' }; // audit-kebocoran: aman
  },

  setCurrentUser: (user: UserAccount | null) => {
    if (user) {
      localStorage.setItem('resqbox-current-user', JSON.stringify(user));
      if (user.role === 'student') {
        const studentObj: Student = {
          id: user.id,
          name: user.name,
          username: user.username,
          classroom_id: user.classroom_code || 'RESQ-8A',
          class_name: `Kelas (${user.classroom_code || 'RESQ-8A'})`,
          absent_number: user.absent_number || '1',
          school_name: user.school_name || 'SMP Negeri 1',
          custom_avatar: user.avatar_config || DEFAULT_CUSTOM_AVATAR,
          progress: {
            missionCompletedIds: [],
            mitigationScores: {},
          },
        };
        localStorage.setItem('resqbox-student-profile', JSON.stringify(studentObj));
        const byUser = localStorage.getItem(`resqbox-unlocked-level_${user.id}`);
        const parsedByUser = byUser ? parseInt(byUser, 10) : 0;
        const level = Math.max(
          user.unlocked_level || 1,
          !isNaN(parsedByUser) ? parsedByUser : 1
        );
        localStorage.setItem(`resqbox-unlocked-level_${user.id}`, level.toString());
        localStorage.setItem('resqbox-unlocked-level', level.toString());
        try {
          localStorage.removeItem('resqbox_earthdive_progress');
        } catch {}

        import('./missionStore').then(({ useMissionStore }) => {
          useMissionStore.getState().syncUser(user.id);
        });
        import('./workspaceStore').then(({ useWorkspaceStore }) => {
          useWorkspaceStore.getState().syncUser(user.id);
        });

        set({
          currentUser: user,
          student: studentObj,
          unlockedLevel: level,
        });
        return;
      }
      set({ currentUser: user, student: null });
    } else {
      localStorage.removeItem('resqbox-current-user');
      localStorage.removeItem('resqbox-student-profile');
      localStorage.removeItem('resqbox-unlocked-level');
      try {
        localStorage.removeItem('resqbox_earthdive_progress');
        localStorage.removeItem('resqbox_level2_progress_guest');
        localStorage.removeItem('resqbox_earthdive_progress_guest');
        localStorage.removeItem('resqbox_missions_guest');
        localStorage.removeItem('resqbox_workspace_guest');
        localStorage.removeItem('resqbox-mission-storage');
        localStorage.removeItem('resqbox-workspace-v2');
      } catch {}

      import('./missionStore').then(({ useMissionStore }) => {
        useMissionStore.getState().syncUser('guest');
      });
      import('./workspaceStore').then(({ useWorkspaceStore }) => {
        useWorkspaceStore.getState().syncUser('guest');
      });

      set({ currentUser: null, student: null, unlockedLevel: 1 });
    }
  },

  logout: () => {
    localStorage.removeItem('resqbox-current-user');
    localStorage.removeItem('resqbox-student-profile');
    localStorage.removeItem('resqbox-unlocked-level');
    try {
      localStorage.removeItem('resqbox_level2_progress_guest');
      localStorage.removeItem('resqbox_earthdive_progress_guest');
      localStorage.removeItem('resqbox_earthdive_progress');
      localStorage.removeItem('resqbox_missions_guest');
      localStorage.removeItem('resqbox_workspace_guest');
      localStorage.removeItem('resqbox-mission-storage');
      localStorage.removeItem('resqbox-workspace-v2');
    } catch {}

    import('./missionStore').then(({ useMissionStore }) => {
      useMissionStore.getState().syncUser('guest');
    });
    import('./workspaceStore').then(({ useWorkspaceStore }) => {
      useWorkspaceStore.getState().syncUser('guest');
    });

    set({ currentUser: null, student: null, unlockedLevel: 1 });
  },

  updateProfile: (data: Partial<Student>) => {
    set((state) => {
      const baseStudent: Student = state.student || {
        id: state.currentUser?.id || `std-${Date.now()}`,
        name: state.currentUser?.name || 'Petualang RESQ',
        username: state.currentUser?.username,
        classroom_id: state.currentUser?.classroom_code || 'RESQ-8A',
        class_name: `Kelas (${state.currentUser?.classroom_code || 'RESQ-8A'})`,
        absent_number: state.currentUser?.absent_number || '1',
        school_name: state.currentUser?.school_name || 'SMP Negeri 1',
        custom_avatar: state.currentUser?.avatar_config || DEFAULT_CUSTOM_AVATAR,
        progress: {
          missionCompletedIds: [],
          mitigationScores: {},
        },
      };
      const updated: Student = {
        ...baseStudent,
        ...data,
        progress: {
          ...baseStudent.progress,
          ...(data.progress || {}),
        },
      };
      localStorage.setItem('resqbox-student-profile', JSON.stringify(updated));

      let updatedUser = state.currentUser;
      if (state.currentUser) {
        updatedUser = {
          ...state.currentUser,
          avatar_config: updated.custom_avatar || DEFAULT_CUSTOM_AVATAR,
          name: updated.name,
        };
        localStorage.setItem('resqbox-current-user', JSON.stringify(updatedUser));
      }

      // Sync to cloud / broadcast
      syncStudentToCloud({
        id: updated.id,
        classroom_code: updated.classroom_id || 'RESQ-8A',
        name: updated.name,
        username: updated.username,
        class_name: updated.class_name || 'Kelas VIII-A',
        absent_number: updated.absent_number || '1',
        avatar_config: updated.custom_avatar || DEFAULT_CUSTOM_AVATAR,
        unlocked_level: state.unlockedLevel,
      });

      return { student: updated, currentUser: updatedUser };
    });
  },

  updateCurrentUserName: async (name: string, schoolName?: string) => {
    const state = useAuthStore.getState();
    if (!state.currentUser) return false;
    const updates: { name?: string; school_name?: string } = { name };
    if (schoolName !== undefined) updates.school_name = schoolName;
    const res = await updateTeacherProfile(state.currentUser.username, updates);
    if (res.success && res.user) {
      set({ currentUser: res.user });
      return true;
    }
    return false;
  },

  unlockLevel: (level: number) => {
    set((state) => {
      const allowedLevel = level;
      const newLevel = Math.max(state.unlockedLevel, allowedLevel);

      // Cegah penulisan berulang: bila level tidak berubah, jangan sentuh
      // localStorage maupun cloud. Tanpa penjaga ini, setiap pemanggilan
      // unlockLevel() (dipanggil juga pada tiap sync level yang "selesai")
      // menghasilkan satu RPC tambahan yang sia-sia.
      if (newLevel === state.unlockedLevel) return state;

      const userId = state.student?.id || state.currentUser?.id;
      if (userId) {
        localStorage.setItem(`resqbox-unlocked-level_${userId}`, newLevel.toString());
      }
      localStorage.setItem('resqbox-unlocked-level', newLevel.toString());

      let updatedUser = state.currentUser;
      if (updatedUser) {
        updatedUser = { ...updatedUser, unlocked_level: newLevel };
        try {
          localStorage.setItem('resqbox-current-user', JSON.stringify(updatedUser));
        } catch {}
      }

      // Sinkronkan level baru ke cloud
      if (state.student) {
        syncStudentToCloud({
          id: state.student.id,
          classroom_code: state.student.classroom_id || 'RESQ-8A',
          name: state.student.name,
          username: state.student.username,
          class_name: state.student.class_name || 'Kelas VIII-A',
          absent_number: state.student.absent_number || '1',
          avatar_config: state.student.custom_avatar || DEFAULT_CUSTOM_AVATAR,
          unlocked_level: newLevel,
        });
      }

      return { unlockedLevel: newLevel, currentUser: updatedUser };
    });
  },

  completeMission: async (missionId: string) => {
    set((state) => {
      if (!state.student) return state;
      const currentIds = state.student.progress.missionCompletedIds;
      if (currentIds.includes(missionId)) return state;
      return {
        student: {
          ...state.student,
          progress: {
            ...state.student.progress,
            missionCompletedIds: [...currentIds, missionId],
          },
        },
      };
    });
  },

  saveMitigationScore: async (scenarioId: string, score: number) => {
    set((state) => {
      if (!state.student) return state;
      return {
        student: {
          ...state.student,
          progress: {
            ...state.student.progress,
            mitigationScores: {
              ...state.student.progress.mitigationScores,
              [scenarioId]: score,
            },
          },
        },
      };
    });
  },
}));
