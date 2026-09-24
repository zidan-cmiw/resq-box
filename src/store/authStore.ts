import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isTeacherLoggedIn: boolean;
  login: (pin: string) => boolean;
  logout: () => void;
}

// Default PIN for teacher access
const TEACHER_PIN = 'guru123';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isTeacherLoggedIn: false,
      login: (pin: string) => {
        if (pin === TEACHER_PIN) {
          set({ isTeacherLoggedIn: true });
          return true;
        }
        return false;
      },
      logout: () => set({ isTeacherLoggedIn: false }),
    }),
    {
      name: 'resqbox-auth-storage',
    }
  )
);
