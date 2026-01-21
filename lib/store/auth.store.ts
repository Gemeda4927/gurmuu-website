import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/lib/api/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
}

interface AuthActions {
  setAuthData: (token: string, user: User) => void;
  clearAuthData: () => void;
  setHasHydrated: (state: boolean) => void;
}

const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      hasHydrated: false,

      setAuthData: (token: string, user: User) => {
        set({ 
          user, 
          token, 
          isAuthenticated: true 
        });
      },

      clearAuthData: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        });
      },

      setHasHydrated: (state: boolean) => {
        set({ hasHydrated: state });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
          
          // Auto-check auth based on stored data
          if (state.token && state.user) {
            state.isAuthenticated = true;
          }
        }
      },
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
      skipHydration: false,
    }
  )
);

export default useAuthStore;