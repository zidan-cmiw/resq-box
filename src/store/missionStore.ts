import { create } from 'zustand';
import { MISSIONS, CATEGORIES, type MissionCategory } from '../missions/data/missions';
import { useAuthStore, levelTertinggiYangBoleh } from './teacherStore';
import {
  kunciMisi,
  kunciYangBolehDibaca,
  pilihTerpanjang,
  saringIdMisi,
  type PenggunaAktif,
} from './misiKunci';

type ValidationStatus = 'idle' | 'checking' | 'pass' | 'fail';

export function getActiveUserId(): string {
  if (typeof window === 'undefined') return 'guest';
  try {
    const raw = localStorage.getItem('resqbox-current-user');
    if (raw) {
      const user = JSON.parse(raw);
      if (user?.id) return user.id;
      if (user?.username) return user.username;
    }
    const profileRaw = localStorage.getItem('resqbox-student-profile');
    if (profileRaw) {
      const profile = JSON.parse(profileRaw);
      if (profile?.id) return profile.id;
    }
  } catch { /* diabaikan: sesi pengguna tidak terbaca → anggap guest */ }
  return 'guest';
}

function getUserMissionKey(userId?: string): string {
  return kunciMisi(userId || 'guest');
}

/** Pengguna yang sedang aktif di peramban ini, bila ada. */
function bacaPenggunaAktif(): PenggunaAktif | null {
  try {
    const raw = localStorage.getItem('resqbox-current-user');
    if (!raw) return null;
    const u = JSON.parse(raw);
    if (!u || typeof u !== 'object') return null;
    return {
      id: typeof u.id === 'string' ? u.id : undefined,
      username: typeof u.username === 'string' ? u.username : undefined,
    };
  } catch {
    return null;
  }
}

export function loadMissionsForUser(userId?: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const validIds = new Set(MISSIONS.map((m) => m.id));
    const targetId = userId || getActiveUserId();

    // Hanya kunci MILIK PENGGUNA YANG DIMINTA.
    //
    // Sebelumnya kunci pengguna yang sedang login juga ikut dikumpulkan, lalu
    // yang dipilih adalah daftar TERPANJANG. Gabungan keduanya berbahaya: bila
    // guru membuka progres siswa B sementara yang login siswa A, dan A lebih
    // banyak menyelesaikan misi, progres A terbaca sebagai progres B.
    const candidateKeys = kunciYangBolehDibaca(targetId, bacaPenggunaAktif());

    const kandidat = candidateKeys.map((kunci) => {
      const raw = localStorage.getItem(kunci);
      if (!raw) return [];
      try {
        return saringIdMisi(JSON.parse(raw), validIds);
      } catch {
        return [];
      }
    });
    return pilihTerpanjang(kandidat);
  } catch { /* diabaikan: localStorage tidak tersedia → tidak ada misi tersimpan */ }
  return [];
}

export function saveMissionsForUser(userId: string | undefined, missionIds: string[]) {
  if (typeof window === 'undefined') return;
  try {
    const targetId = userId || getActiveUserId();
    const data = JSON.stringify(missionIds);
    localStorage.setItem(getUserMissionKey(targetId), data);

    // Hanya menulis ke kunci milik pengguna yang diminta.
    //
    // Sebelumnya kunci pengguna yang sedang login JUGA ditimpa. Jadi menyimpan
    // progres siswa B sementara siswa A sedang login akan MENGHAPUS progres A -
    // kerusakan data, bukan sekadar salah baca.
    for (const kunci of kunciYangBolehDibaca(targetId, bacaPenggunaAktif())) {
      localStorage.setItem(kunci, data);
    }
  } catch { /* diabaikan: gagal menyimpan misi tidak menghentikan permainan */ }
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
        // TIDAK memanggil unlockLevel dengan angka 4.
        //
        // Dulu di sini tertulis "Unlock beyond Level 3" dengan pemanggilan
        // unlockLevel bernilai 4. Itu keliru dan sia-sia:
        //   - Tidak ada Level 4. Kolom `unlocked_level` dibatasi 1..3 oleh
        //     database, dan trigger server mengabaikan perubahan dari klien.
        //   - Pemeriksaan `unlockedLevel >= 4` yang dulu memakainya sudah
        //     diganti aturan peran, sehingga angka 4 tidak dipakai siapa pun.
        // Jadi dulu nilai itu hanya membuat keadaan LOKAL bertambah tanpa pernah
        // tersimpan, lalu hilang saat login berikutnya.
        //
        // Menuntaskan seluruh misi tetap tercatat dengan benar lewat
        // `syncLevel3Progress` di bawah, yang menandai level 3 selesai.
      }

      // Sync progress for this mission immediately to cloud & teacher dashboard!
      import('../app/Level3/level3Sync').then(({ syncLevel3Progress }) => {
        syncLevel3Progress(authState.student, {
          completedMissions: next,
          completedCount: next.length,
          totalMissions: MISSIONS.length,
          lastCompletedId: id,
          isCompleted: allMissionsDone,
        });
      });
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
    // Guru dan admin dapat membuka seluruh kategori misi.
    //
    // Sebelumnya tertulis `unlockedLevel >= 4`, dan itu MUSTAHIL: kolom
    // `unlocked_level` dibatasi 1..3 oleh database, sehingga syarat itu
    // tidak pernah terpenuhi siapa pun — termasuk siswa yang sudah
    // menuntaskan semua level. Diganti memakai aturan peran yang sama.
    if (levelTertinggiYangBoleh(authState.currentUser?.role, authState.unlockedLevel) >= 3) return true;

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
