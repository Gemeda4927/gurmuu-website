import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as adminApi from '../api/admin'; 

// ================= STORE INTERFACES =================
export interface AdminStoreState {
  // State
  users: adminApi.User[];
  loading: boolean;
  error: string | null;
  selectedUser: adminApi.User | null;
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  permissionsList: Record<string, string> | null;
  
  // Actions
  fetchAllUsers: (token: string, page?: number, limit?: number) => Promise<void>;
  fetchUserById: (token: string, userId: string) => Promise<void>;
  createNewUser: (token: string, userData: adminApi.CreateUserRequest) => Promise<adminApi.User | undefined>;
  updateUser: (token: string, userId: string, userData: adminApi.UpdateUserRequest) => Promise<adminApi.User | undefined>;
  activateUser: (token: string, userId: string) => Promise<adminApi.User | undefined>;
  deactivateUser: (token: string, userId: string) => Promise<adminApi.User | undefined>;
  fetchUserPermissions: (token: string, userId: string) => Promise<string[]>;
  fetchAllPermissions: (token: string) => Promise<void>;
  checkUserPermission: (token: string, userId: string, permission: string) => Promise<boolean>;
  
  // UI Actions
  setSelectedUser: (user: adminApi.User | null) => void;
  clearError: () => void;
  clearUsers: () => void;
}

// ================= ADMIN STORE =================
export const useAdminStore = create<AdminStoreState>()(
  persist(
    (set, get) => ({
      // Initial State
      users: [],
      loading: false,
      error: null,
      selectedUser: null,
      currentPage: 1,
      totalPages: 1,
      totalUsers: 0,
      permissionsList: null,

      // ================= USER MANAGEMENT ACTIONS =================
      
      /**
       * Fetch all users with pagination
       */
      fetchAllUsers: async (token: string, page: number = 1, limit: number = 10) => {
        try {
          set({ loading: true, error: null });
          
          // Note: The API might not support pagination yet, but we'll handle it
          const response = await adminApi.getAllUsers(token);
          
          set({
            users: response.users || [],
            loading: false,
            currentPage: page,
            totalUsers: response.total || response.users?.length || 0,
            totalPages: Math.ceil((response.total || response.users?.length || 0) / limit),
          });
        } catch (error: any) {
          console.error('Failed to fetch users:', error);
          set({
            loading: false,
            error: error.message || 'Failed to fetch users',
            users: [],
          });
        }
      },

      /**
       * Fetch single user by ID
       */
      fetchUserById: async (token: string, userId: string) => {
        try {
          set({ loading: true, error: null });
          
          const response = await adminApi.getUserById(token, userId);
          
          set({
            selectedUser: response.user,
            loading: false,
          });
        } catch (error: any) {
          console.error('Failed to fetch user:', error);
          set({
            loading: false,
            error: error.message || 'Failed to fetch user',
            selectedUser: null,
          });
        }
      },

      /**
       * Create new user
       */
      createNewUser: async (token: string, userData: adminApi.CreateUserRequest) => {
        try {
          set({ loading: true, error: null });
          
          const response = await adminApi.createUser(token, userData);
          
          // Add new user to the list
          const currentUsers = get().users;
          set({
            users: [response.user, ...currentUsers],
            loading: false,
            totalUsers: get().totalUsers + 1,
          });
          
          return response.user;
        } catch (error: any) {
          console.error('Failed to create user:', error);
          set({
            loading: false,
            error: error.message || 'Failed to create user',
          });
          throw error;
        }
      },

      /**
       * Update user details
       */
      updateUser: async (token: string, userId: string, userData: adminApi.UpdateUserRequest) => {
        try {
          set({ loading: true, error: null });
          
          const response = await adminApi.updateUser(token, userId, userData);
          
          // Update user in the list
          const currentUsers = get().users;
          const updatedUsers = currentUsers.map(user =>
            user._id === userId ? response.user : user
          );
          
          set({
            users: updatedUsers,
            loading: false,
            selectedUser: get().selectedUser?._id === userId ? response.user : get().selectedUser,
          });
          
          return response.user;
        } catch (error: any) {
          console.error('Failed to update user:', error);
          set({
            loading: false,
            error: error.message || 'Failed to update user',
          });
          throw error;
        }
      },

      /**
       * Activate user
       */
      activateUser: async (token: string, userId: string) => {
        try {
          set({ loading: true, error: null });
          
          const response = await adminApi.activateUser(token, userId);
          
          // Update user in the list
          const currentUsers = get().users;
          const updatedUsers = currentUsers.map(user =>
            user._id === userId ? response.user : user
          );
          
          set({
            users: updatedUsers,
            loading: false,
            selectedUser: get().selectedUser?._id === userId ? response.user : get().selectedUser,
          });
          
          return response.user;
        } catch (error: any) {
          console.error('Failed to activate user:', error);
          set({
            loading: false,
            error: error.message || 'Failed to activate user',
          });
          throw error;
        }
      },

      /**
       * Deactivate user
       */
      deactivateUser: async (token: string, userId: string) => {
        try {
          set({ loading: true, error: null });
          
          const response = await adminApi.deactivateUser(token, userId);
          
          // Update user in the list
          const currentUsers = get().users;
          const updatedUsers = currentUsers.map(user =>
            user._id === userId ? response.user : user
          );
          
          set({
            users: updatedUsers,
            loading: false,
            selectedUser: get().selectedUser?._id === userId ? response.user : get().selectedUser,
          });
          
          return response.user;
        } catch (error: any) {
          console.error('Failed to deactivate user:', error);
          set({
            loading: false,
            error: error.message || 'Failed to deactivate user',
          });
          throw error;
        }
      },

      // ================= PERMISSION MANAGEMENT ACTIONS =================

      /**
       * Fetch user permissions
       */
      fetchUserPermissions: async (token: string, userId: string) => {
        try {
          set({ loading: true, error: null });
          
          const response = await adminApi.getUserPermissionsForAdmin(token, userId);
          
          set({ loading: false });
          return response.permissions || [];
        } catch (error: any) {
          console.error('Failed to fetch user permissions:', error);
          set({
            loading: false,
            error: error.message || 'Failed to fetch user permissions',
          });
          return [];
        }
      },

      /**
       * Fetch all available permissions (read-only)
       */
      fetchAllPermissions: async (token: string) => {
        try {
          set({ loading: true, error: null });
          
          const response = await adminApi.getAllPermissions(token);
          
          set({
            permissionsList: response.permissions,
            loading: false,
          });
        } catch (error: any) {
          console.error('Failed to fetch permissions:', error);
          set({
            loading: false,
            error: error.message || 'Failed to fetch permissions',
          });
        }
      },

      /**
       * Check if user has specific permission
       */
      checkUserPermission: async (token: string, userId: string, permission: string) => {
        try {
          const response = await adminApi.checkUserPermission(token, userId, permission);
          return response.hasPermission;
        } catch (error: any) {
          console.error('Failed to check permission:', error);
          return false;
        }
      },

      // ================= UI ACTIONS =================

      /**
       * Set selected user for detailed view
       */
      setSelectedUser: (user: adminApi.User | null) => {
        set({ selectedUser: user });
      },

      /**
       * Clear error message
       */
      clearError: () => {
        set({ error: null });
      },

      /**
       * Clear users list
       */
      clearUsers: () => {
        set({ users: [], currentPage: 1, totalPages: 1, totalUsers: 0 });
      },
    }),
    {
      name: 'admin-storage',
      partialize: (state) => ({
        // Only persist these fields
        selectedUser: state.selectedUser,
        currentPage: state.currentPage,
      }),
    }
  )
);

// ================= STORE SELECTORS =================
export const adminSelectors = {
  // Get active users only
  activeUsers: (state: AdminStoreState) => 
    state.users.filter(user => user.isActive),
  
  // Get inactive users only
  inactiveUsers: (state: AdminStoreState) => 
    state.users.filter(user => !user.isActive),
  
  // Get users by role
  usersByRole: (state: AdminStoreState) => ({
    users: state.users.filter(user => user.role === 'user'),
    admins: state.users.filter(user => user.role === 'admin'),
    superadmins: state.users.filter(user => user.role === 'superadmin'),
  }),
  
  // Get permission names from keys
  permissionNames: (state: AdminStoreState) => {
    if (!state.permissionsList) return [];
    return Object.entries(state.permissionsList).map(([key, value]) => ({
      key,
      name: value,
    }));
  },
};