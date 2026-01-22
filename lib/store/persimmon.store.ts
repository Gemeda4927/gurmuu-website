import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types based on your backend responses
interface PermissionState {
  // Cached permissions from backend
  availablePermissions: string[];
  userPermissions: Record<string, string[]>; // userId -> permissions[]
  permissionChecks: Record<string, boolean>; // userId_permission -> boolean
  permissionsData: {
    permissions: Record<string, string>; // e.g., "MANAGE_USERS": "manage_users"
    roles: Record<string, string>; // e.g., "USER": "user"
    rolePermissions: Record<string, string>; // e.g., "user": "No default permissions"
  } | null;

  // UI State
  isLoading: boolean;
  error: string | null;

  // Actions
  setPermissionsData: (data: {
    permissions: Record<string, string>;
    roles: Record<string, string>;
    rolePermissions: Record<string, string>;
  }) => void;
  setAvailablePermissions: (permissions: string[]) => void;
  setUserPermissions: (userId: string, permissions: string[]) => void;
  setPermissionCheck: (userId: string, permission: string, hasPermission: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Getters
  getUserPermissions: (userId: string) => string[];
  hasPermission: (userId: string, permission: string) => boolean;
  getRolePermissions: (role: string) => string[];

  // Helper functions
  getPermissionLabel: (permission: string) => string;
  getRoleLabel: (role: string) => string;
  getAllPermissionValues: () => string[];
  getAllRoles: () => string[];
  getPermissionsByCategory: (permissions: string[]) => Record<string, string[]>;

  // Permission management (local cache only - real changes happen via API)
  grantPermission: (userId: string, permission: string) => void;
  revokePermission: (userId: string, permission: string) => void;
  resetUserPermissions: (userId: string) => void;

  // Cache management
  clearCache: () => void;
  clearUserCache: (userId: string) => void;
}

const initialState = {
  availablePermissions: [],
  userPermissions: {},
  permissionChecks: {},
  permissionsData: null,
  isLoading: false,
  error: null,
};

export const usePersimmonStore = create<PermissionState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Set permissions data from backend
      setPermissionsData: (data) =>
        set({
          permissionsData: data,
          availablePermissions: Object.values(data.permissions || {}),
        }),

      // Set available permissions
      setAvailablePermissions: (permissions) =>
        set({
          availablePermissions: permissions,
        }),

      // Set user permissions
      setUserPermissions: (userId, permissions) =>
        set((state) => ({
          userPermissions: {
            ...state.userPermissions,
            [userId]: permissions,
          },
        })),

      // Cache permission check results
      setPermissionCheck: (userId, permission, hasPermission) =>
        set((state) => ({
          permissionChecks: {
            ...state.permissionChecks,
            [`${userId}_${permission}`]: hasPermission,
          },
        })),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      // Get user's permissions from cache
      getUserPermissions: (userId) => {
        const state = get();
        return state.userPermissions[userId] || [];
      },

      // Check if user has permission (cached)
      hasPermission: (userId, permission) => {
        const state = get();
        const cacheKey = `${userId}_${permission}`;

        // Check cache first
        if (cacheKey in state.permissionChecks) {
          return state.permissionChecks[cacheKey];
        }

        // Check user's specific permissions
        const userPerms = state.userPermissions[userId] || [];
        const hasUserPermission = userPerms.includes(permission);

        // Cache the result
        get().setPermissionCheck(userId, permission, hasUserPermission);

        return hasUserPermission;
      },

      // Get permissions for a role - now dynamic based on backend data
      getRolePermissions: (role) => {
        const state = get();
        const rolePermissions = state.permissionsData?.rolePermissions;
        
        // Return empty array by default - actual permissions come from backend
        return [];
      },

      // Helper: Get permission label from backend data
      getPermissionLabel: (permission: string) => {
        const state = get();
        const permissionsData = state.permissionsData?.permissions;
        
        if (!permissionsData) {
          return permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        }
        
        const entry = Object.entries(permissionsData).find(([_, value]) => value === permission);
        return entry ? entry[0].replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : permission;
      },

      // Helper: Get role label from backend data
      getRoleLabel: (role: string) => {
        const state = get();
        const rolesData = state.permissionsData?.roles;
        
        if (!rolesData) {
          return role.charAt(0).toUpperCase() + role.slice(1);
        }
        
        const entry = Object.entries(rolesData).find(([_, value]) => value === role);
        return entry ? entry[0].replace(/_/g, ' ') : role;
      },

      // Helper: Get all permission values from backend data
      getAllPermissionValues: () => {
        const state = get();
        return state.availablePermissions;
      },

      // Helper: Get all roles from backend data
      getAllRoles: () => {
        const state = get();
        const rolesData = state.permissionsData?.roles;
        
        if (!rolesData) return ['user', 'admin', 'superadmin'];
        return Object.values(rolesData);
      },

      // Helper: Group permissions by category based on backend data
      getPermissionsByCategory: (permissions: string[]) => {
        const state = get();
        const permissionsData = state.permissionsData?.permissions;
        
        if (!permissionsData) return {};
        
        const categories: Record<string, string[]> = {
          user_management: [
            'MANAGE_USERS',
            'DEACTIVATE_USERS',
            'VIEW_ALL_USERS',
          ],
          content_management: [
            'MANAGE_CONTENT',
            'CREATE_CONTENT',
            'EDIT_CONTENT',
            'DELETE_CONTENT',
            'PUBLISH_CONTENT',
          ],
          settings: [
            'MANAGE_SETTINGS',
            'UPDATE_SYSTEM_SETTINGS',
            'VIEW_AUDIT_LOGS',
          ],
          roles_permissions: [
            'MANAGE_ROLES',
            'ASSIGN_PERMISSIONS',
          ],
          analytics: [
            'VIEW_ANALYTICS',
            'EXPORT_DATA',
          ],
          notifications: [
            'SEND_NOTIFICATIONS',
            'MANAGE_NOTIFICATIONS',
          ],
        };

        const result: Record<string, string[]> = {};
        
        Object.entries(categories).forEach(([category, categoryPerms]) => {
          // Find which permissions in the list belong to this category
          const matchingPermissions = permissions.filter(permission => {
            // Get the key for this permission value
            const permissionKey = Object.entries(permissionsData).find(([key, value]) => value === permission)?.[0];
            if (!permissionKey) return false;
            
            // Check if it's in this category
            return categoryPerms.includes(permissionKey);
          });
          
          if (matchingPermissions.length > 0) {
            result[category] = matchingPermissions;
          }
        });

        return result;
      },

      // Grant permission to user (local cache only - real changes via API)
      grantPermission: (userId, permission) => {
        const state = get();
        const currentPerms = state.userPermissions[userId] || [];

        if (!currentPerms.includes(permission)) {
          const newPerms = [...currentPerms, permission];
          get().setUserPermissions(userId, newPerms);

          // Update cache
          get().setPermissionCheck(userId, permission, true);
        }
      },

      // Revoke permission from user (local cache only - real changes via API)
      revokePermission: (userId, permission) => {
        const state = get();
        const currentPerms = state.userPermissions[userId] || [];

        const newPerms = currentPerms.filter((p) => p !== permission);
        get().setUserPermissions(userId, newPerms);

        // Update cache
        get().setPermissionCheck(userId, permission, false);
      },

      // Reset all permissions for user (local cache only - real changes via API)
      resetUserPermissions: (userId) => {
        set((state) => {
          const newUserPerms = { ...state.userPermissions };
          delete newUserPerms[userId];

          // Clear permission checks for this user
          const newPermissionChecks = { ...state.permissionChecks };
          Object.keys(newPermissionChecks).forEach((key) => {
            if (key.startsWith(`${userId}_`)) {
              delete newPermissionChecks[key];
            }
          });

          return {
            userPermissions: newUserPerms,
            permissionChecks: newPermissionChecks,
          };
        });
      },

      // Clear user cache
      clearUserCache: (userId) => {
        set((state) => {
          const newUserPerms = { ...state.userPermissions };
          delete newUserPerms[userId];

          const newPermissionChecks = { ...state.permissionChecks };
          Object.keys(newPermissionChecks).forEach((key) => {
            if (key.startsWith(`${userId}_`)) {
              delete newPermissionChecks[key];
            }
          });

          return {
            userPermissions: newUserPerms,
            permissionChecks: newPermissionChecks,
          };
        });
      },

      // Clear all cache
      clearCache: () => set(initialState),
    }),
    {
      name: "persimmon-store",
      partialize: (state) => ({
        userPermissions: state.userPermissions,
        permissionChecks: state.permissionChecks,
        permissionsData: state.permissionsData,
        availablePermissions: state.availablePermissions,
      }),
    }
  )
);

// Helper hooks that use the store with real backend data
export const usePermission = (permission: string, targetUserId?: string) => {
  const store = usePersimmonStore();
  const { user } = useAuthStore(); // You need to import your auth store
  
  const userId = targetUserId || user?._id;
  if (!userId) return { hasPermission: false, isLoading: store.isLoading };
  
  const hasPermission = store.hasPermission(userId, permission);
  
  return {
    hasPermission,
    isLoading: store.isLoading,
    permissionLabel: store.getPermissionLabel(permission),
  };
};

export const useUserPermissions = (userId: string) => {
  const store = usePersimmonStore();
  const permissions = store.getUserPermissions(userId);
  
  const grantPermission = (permission: string) => {
    store.grantPermission(userId, permission);
  };
  
  const revokePermission = (permission: string) => {
    store.revokePermission(userId, permission);
  };
  
  const resetPermissions = () => {
    store.resetUserPermissions(userId);
  };
  
  return {
    permissions,
    grantPermission,
    revokePermission,
    resetPermissions,
    isLoading: store.isLoading,
    getPermissionLabel: store.getPermissionLabel,
    getPermissionsByCategory: () => store.getPermissionsByCategory(permissions),
  };
};

// You'll need to import your auth store
import useAuthStore from "./auth.store";