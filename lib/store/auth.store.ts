import { create } from "zustand";
import {
  persist,
  createJSONStorage,
} from "zustand/middleware";
import api from "../api/api";

// Types
export interface User {
  id: string; // Frontend uses 'id'
  _id?: string; // Backend returns '_id'
  role: "user" | "admin" | "superadmin";
  name: string;
  email: string;
  phone?: string;
  isActive: boolean;
  avatar?: string;
  createdAt: string;
  permissions: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  isLoading: boolean;
  permissions: string[];
  isSuperadmin: boolean; // Added
}

interface AuthActions {
  setAuthData: (
    token: string,
    user: User
  ) => void;
  clearAuthData: () => void;
  setHasHydrated: (state: boolean) => void;
  setLoading: (state: boolean) => void;
  setPermissions: (permissions: string[]) => void;
  addPermission: (permission: string) => void;
  removePermission: (permission: string) => void;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (
    permissions: string[]
  ) => boolean;
  hasAllPermissions: (
    permissions: string[]
  ) => boolean;
  refreshUser: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  setIsSuperadmin: (value: boolean) => void; // Added
}

export const useAuthStore = create<
  AuthState & AuthActions
>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      hasHydrated: false,
      isLoading: true,
      permissions: [],
      isSuperadmin: false, // Added default

      setAuthData: (
        token: string,
        user: User
      ) => {
        console.log("Setting auth data:", {
          user,
          token,
        });

        // Ensure user has both id and _id
        const normalizedUser: User = {
          ...user,
          id: user.id || user._id || "",
        };

        set({
          user: normalizedUser,
          token,
          isAuthenticated: true,
          isLoading: false,
          permissions: user.permissions || [],
          isSuperadmin:
            user.role === "superadmin", // Calculate here
        });
      },

      clearAuthData: () => {
        console.log("Clearing auth data");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          permissions: [],
          isSuperadmin: false, // Reset
        });
      },

      setHasHydrated: (state: boolean) => {
        console.log(
          "Setting hydration state:",
          state
        );
        set({ hasHydrated: state });

        if (state) {
          const { token, user, permissions } =
            get();
          if (token && user) {
            set({
              isAuthenticated: true,
              permissions:
                permissions.length > 0
                  ? permissions
                  : user.permissions || [],
              isSuperadmin:
                user.role === "superadmin", // Calculate on rehydration
            });
          }
          set({ isLoading: false });
        }
      },

      setLoading: (state: boolean) => {
        set({ isLoading: state });
      },

      setPermissions: (permissions: string[]) => {
        console.log(
          "Setting permissions:",
          permissions
        );
        const currentUser = get().user;
        set({
          permissions,
          user: currentUser
            ? { ...currentUser, permissions }
            : null,
        });
      },

      addPermission: (permission: string) => {
        const { permissions } = get();
        if (!permissions.includes(permission)) {
          const newPermissions = [
            ...permissions,
            permission,
          ];
          const currentUser = get().user;
          set({
            permissions: newPermissions,
            user: currentUser
              ? {
                  ...currentUser,
                  permissions: newPermissions,
                }
              : null,
          });
        }
      },

      removePermission: (permission: string) => {
        const { permissions } = get();
        const newPermissions = permissions.filter(
          (p) => p !== permission
        );
        const currentUser = get().user;
        set({
          permissions: newPermissions,
          user: currentUser
            ? {
                ...currentUser,
                permissions: newPermissions,
              }
            : null,
        });
      },

      hasPermission: (permission: string) => {
        const {
          permissions: storePermissions,
          user,
          isSuperadmin,
        } = get();
        const userPermissions =
          user?.permissions || storePermissions;

        if (isSuperadmin) return true;

        return userPermissions.includes(
          permission
        );
      },

      hasAnyPermission: (
        permissions: string[]
      ) => {
        const { hasPermission } = get();
        return permissions.some((permission) =>
          hasPermission(permission)
        );
      },

      hasAllPermissions: (
        permissions: string[]
      ) => {
        const { hasPermission } = get();
        return permissions.every((permission) =>
          hasPermission(permission)
        );
      },

      // Refresh user data

      // Refresh user data - using /users/profile endpoint
      refreshUser: async () => {
        const { token, user } = get();

        if (!token || !user) {
          console.warn(
            "No user or token found, cannot refresh"
          );
          return;
        }

        try {
          set({ isLoading: true });

          // Option 1: If your endpoint returns the user directly
          const response = await api.get(
            "/users/profile",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // For direct user response (no success wrapper)
          const updatedUser = response.data;

          const normalizedUser: User = {
            ...updatedUser,
            id:
              updatedUser.id ||
              updatedUser._id ||
              user.id,
          };

          set({
            user: normalizedUser,
            permissions:
              normalizedUser.permissions || [],
            isSuperadmin:
              normalizedUser.role ===
              "superadmin",
            isLoading: false,
          });

          console.log(
            "User data refreshed successfully"
          );
        } catch (error: any) {
          console.error(
            "Failed to refresh user data:",
            error
          );
          set({ isLoading: false });

          // Check error status
          if (error.response?.status === 401) {
            console.log(
              "Token expired, clearing auth data"
            );
            get().clearAuthData();
          }
        }
      },

      // Update user with partial data
      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (!currentUser) return;

        const updatedUser = {
          ...currentUser,
          ...updates,
          id:
            updates.id ||
            updates._id ||
            currentUser.id,
        };

        set({
          user: updatedUser,
          permissions:
            updatedUser.permissions ||
            get().permissions,
          isSuperadmin:
            updatedUser.role === "superadmin", // Update here
        });

        console.log(
          "User updated locally:",
          updatedUser
        );
      },

      // Set isSuperadmin manually if needed
      setIsSuperadmin: (value: boolean) => {
        set({ isSuperadmin: value });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      onRehydrateStorage:
        () => (state, error) => {
          if (error) {
            console.error(
              "Auth store rehydration error:",
              error
            );
            state?.setLoading(false);
            state?.setHasHydrated(true);
            return;
          }

          if (state) {
            state.setHasHydrated(true);

            const { token, user } = state;
            if (token && user) {
              console.log(
                "Auto-reauthenticating from storage"
              );
              state.isAuthenticated = true;
              state.isSuperadmin =
                user.role === "superadmin"; // Add this

              if (
                user.permissions &&
                user.permissions.length > 0
              ) {
                state.permissions =
                  user.permissions;
              }
            } else {
              state.isAuthenticated = false;
              state.permissions = [];
              state.isSuperadmin = false; // Add this
            }

            state.isLoading = false;
          }
        },
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        permissions: state.permissions,
        isSuperadmin: state.isSuperadmin, // Include in partialization
      }),
      skipHydration: false,
      version: 3, // Increment version
      migrate: (
        persistedState: any,
        version: number
      ) => {
        console.log(
          "Migrating auth store from version:",
          version
        );

        if (version === 0 || version === 1) {
          return {
            ...persistedState,
            permissions:
              persistedState.user?.permissions ||
              [],
            isSuperadmin:
              persistedState.user?.role ===
                "superadmin" || false,
          };
        }

        if (version === 2) {
          return {
            ...persistedState,
            isSuperadmin:
              persistedState.user?.role ===
                "superadmin" || false,
          };
        }

        return persistedState;
      },
    }
  )
);

// Export helper functions
export const isAuthenticated = () => {
  const state = useAuthStore.getState();
  return (
    state.isAuthenticated &&
    !!state.token &&
    !!state.user
  );
};

export const getUserRole = () => {
  const state = useAuthStore.getState();
  return state.user?.role || null;
};

export const getUserPermissions = () => {
  const state = useAuthStore.getState();
  return (
    state.permissions ||
    state.user?.permissions ||
    []
  );
};

export const getIsSuperadmin = () => {
  const state = useAuthStore.getState();
  return state.isSuperadmin;
};

export const hasRole = (
  role: User["role"] | User["role"][]
) => {
  const userRole = getUserRole();
  if (!userRole) return false;

  if (Array.isArray(role)) {
    return role.includes(userRole);
  }
  return userRole === role;
};

export const hasPermission = (
  permission: string
) => {
  return useAuthStore
    .getState()
    .hasPermission(permission);
};

export const hasAnyPermission = (
  permissions: string[]
) => {
  return useAuthStore
    .getState()
    .hasAnyPermission(permissions);
};

export const hasAllPermissions = (
  permissions: string[]
) => {
  return useAuthStore
    .getState()
    .hasAllPermissions(permissions);
};

export const canAccessRoute = (
  requiredPermissions?: string[],
  requiredRole?: User["role"]
) => {
  const state = useAuthStore.getState();
  const { user, isAuthenticated, isSuperadmin } =
    state;

  if (!isAuthenticated || !user) return false;

  // Superadmin has access to everything
  if (isSuperadmin) return true;

  if (requiredRole) {
    const roleHierarchy = [
      "user",
      "admin",
      "superadmin",
    ];
    const userRoleIndex = roleHierarchy.indexOf(
      user.role
    );
    const requiredRoleIndex =
      roleHierarchy.indexOf(requiredRole);

    if (userRoleIndex < requiredRoleIndex) {
      return false;
    }
  }

  if (
    requiredPermissions &&
    requiredPermissions.length > 0
  ) {
    return state.hasAllPermissions(
      requiredPermissions
    );
  }

  return true;
};

// NEW: Export refresh function
export const refreshUser = () => {
  return useAuthStore.getState().refreshUser();
};

// NEW: Export update function
export const updateUser = (
  updates: Partial<User>
) => {
  return useAuthStore
    .getState()
    .updateUser(updates);
};

// NEW: Export isSuperadmin function
export const setIsSuperadmin = (
  value: boolean
) => {
  return useAuthStore
    .getState()
    .setIsSuperadmin(value);
};

export const usePermissions = () => {
  const store = useAuthStore();

  return {
    permissions: store.permissions,
    hasPermission: store.hasPermission,
    hasAnyPermission: store.hasAnyPermission,
    hasAllPermissions: store.hasAllPermissions,
    canAccessRoute: (
      requiredPermissions?: string[],
      requiredRole?: User["role"]
    ) => {
      return canAccessRoute(
        requiredPermissions,
        requiredRole
      );
    },
    userRole: store.user?.role,
    isSuperadmin: store.isSuperadmin, // Added
    setPermissions: store.setPermissions,
    addPermission: store.addPermission,
    removePermission: store.removePermission,
    refreshUser: store.refreshUser,
    updateUser: store.updateUser,
    setIsSuperadmin: store.setIsSuperadmin, // Added
  };
};

export default useAuthStore;
