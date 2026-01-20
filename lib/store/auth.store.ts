import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/lib/api/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  setAuthData: (token: string, user: User) => void;
  clearAuthData: () => void;
  checkAuth: () => Promise<boolean>;
  initializeAuth: () => void;
}

const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      setAuthData: (token: string, user: User) => {
        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Update store
        set({ 
          user, 
          token, 
          isAuthenticated: true, 
          isLoading: false 
        });
      },

      clearAuthData: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          isLoading: false 
        });
      },

      checkAuth: async () => {
        if (typeof window === 'undefined') return false;
        
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        if (!token || !userStr) {
          set({ isLoading: false });
          return false;
        }
        
        try {
          const user = JSON.parse(userStr);
          
          // Optional: Verify token with API
          // const response = await verifyToken(token);
          
          set({ 
            user, 
            token, 
            isAuthenticated: true, 
            isLoading: false 
          });
          return true;
        } catch (error) {
          console.error('Auth check failed:', error);
          get().clearAuthData();
          return false;
        }
      },

      initializeAuth: () => {
        if (typeof window === 'undefined') return;
        
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            set({ 
              user, 
              token, 
              isAuthenticated: true, 
              isLoading: false 
            });
          } catch (error) {
            get().clearAuthData();
          }
        } else {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);

export default useAuthStore;