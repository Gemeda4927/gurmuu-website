import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/lib/api/auth';
import * as superadminApi from '@/lib/api/superadmin';

// ==================== INTERFACES ====================

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface SuperadminUser extends User {
  // Additional fields for superadmin view
  lastLogin?: string;
  loginCount?: number;
  status: 'active' | 'inactive' | 'suspended';
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  superadmins: number;
  admins: number;
  regularUsers: number;
}

export interface BulkActionRequest {
  userIds: string[];
  action: 'activate' | 'deactivate' | 'delete' | 'promote' | 'demote';
  reason?: string;
}

export interface BulkActionResponse {
  success: boolean;
  processed: number;
  failed: number;
  failedIds: string[];
  message?: string;
}

// ==================== STORE STATE ====================

interface SuperadminState {
  // Users Management
  users: SuperadminUser[];
  selectedUser: SuperadminUser | null;
  usersLoading: boolean;
  usersError: string | null;
  
  // Permissions Management
  allPermissions: Permission[];
  permissionsLoading: boolean;
  permissionsError: string | null;
  
  // Bulk Actions
  bulkActionInProgress: boolean;
  bulkActionResult: BulkActionResponse | null;
  
  // Filters & Search
  filters: {
    role: 'all' | 'user' | 'admin' | 'superadmin';
    status: 'all' | 'active' | 'inactive' | 'suspended';
    search: string;
  };
  
  // Pagination
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    usersPerPage: number;
  };
  
  // Stats
  stats: UserStats | null;
  statsLoading: boolean;
}

// ==================== STORE ACTIONS ====================

interface SuperadminActions {
  // Users Management
  fetchAllUsers: (token: string) => Promise<void>;
  fetchUserById: (token: string, userId: string) => Promise<void>;
  createUser: (token: string, userData: superadminApi.CreateUserRequest) => Promise<void>;
  updateUser: (token: string, userId: string, userData: superadminApi.UpdateUserRequest) => Promise<void>;
  deleteUser: (token: string, userId: string) => Promise<void>;
  activateUser: (token: string, userId: string) => Promise<void>;
  deactivateUser: (token: string, userId: string) => Promise<void>;
  
  // Permissions Management
  fetchAllPermissions: (token: string) => Promise<void>;
  grantPermission: (token: string, userId: string, permissionData: superadminApi.GrantPermissionRequest) => Promise<void>;
  revokePermission: (token: string, userId: string, permissionData: superadminApi.RevokePermissionRequest) => Promise<void>;
  resetUserPermissions: (token: string, userId: string, reason: string) => Promise<void>;
  getUserPermissions: (token: string, userId: string) => Promise<string[]>;
  
  // Role Management
  changeUserRole: (token: string, userId: string, roleData: superadminApi.ChangeRoleRequest) => Promise<void>;
  promoteToAdmin: (token: string, userId: string, reason: string) => Promise<void>;
  demoteToUser: (token: string, userId: string, reason: string) => Promise<void>;
  
  // Bulk Actions
  performBulkAction: (token: string, request: BulkActionRequest) => Promise<void>;
  
  // Stats
  fetchUserStats: (token: string) => Promise<void>;
  
  // Filters & Search
  setFilters: (filters: Partial<SuperadminState['filters']>) => void;
  clearFilters: () => void;
  searchUsers: (searchTerm: string) => void;
  
  // User Selection
  selectUser: (user: SuperadminUser | null) => void;
  clearSelectedUser: () => void;
  
  // Pagination
  setPage: (page: number) => void;
  setUsersPerPage: (perPage: number) => void;
  
  // Reset
  resetSuperadminStore: () => void;
  clearErrors: () => void;
}

// ==================== STORE CREATION ====================

const initialState: SuperadminState = {
  users: [],
  selectedUser: null,
  usersLoading: false,
  usersError: null,
  
  allPermissions: [],
  permissionsLoading: false,
  permissionsError: null,
  
  bulkActionInProgress: false,
  bulkActionResult: null,
  
  filters: {
    role: 'all',
    status: 'all',
    search: '',
  },
  
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    usersPerPage: 10,
  },
  
  stats: null,
  statsLoading: false,
};

const useSuperadminStore = create<SuperadminState & SuperadminActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // ==================== USERS MANAGEMENT ====================
      
      fetchAllUsers: async (token: string) => {
        set({ usersLoading: true, usersError: null });
        try {
          const response = await superadminApi.getAllUsers(token);
          
          const users: SuperadminUser[] = response.users.map(user => ({
            ...user,
            status: user.isActive ? 'active' : 'inactive',
            lastLogin: user.updatedAt, // You might want to fetch this from actual API
            loginCount: 0, // You might want to fetch this from actual API
          }));
          
          set({
            users,
            usersLoading: false,
            pagination: {
              ...get().pagination,
              totalUsers: response.total,
              totalPages: Math.ceil(response.total / get().pagination.usersPerPage),
            }
          });
        } catch (error: any) {
          set({
            usersLoading: false,
            usersError: error.message || 'Failed to fetch users'
          });
        }
      },
      
      fetchUserById: async (token: string, userId: string) => {
        set({ usersLoading: true, usersError: null });
        try {
          const response = await superadminApi.getUserById(token, userId);
          
          const user: SuperadminUser = {
            ...response.user,
            status: response.user.isActive ? 'active' : 'inactive',
            lastLogin: response.user.updatedAt,
            loginCount: 0,
          };
          
          set({
            selectedUser: user,
            usersLoading: false,
          });
        } catch (error: any) {
          set({
            usersLoading: false,
            usersError: error.message || 'Failed to fetch user'
          });
        }
      },
      
      createUser: async (token: string, userData: superadminApi.CreateUserRequest) => {
        set({ usersLoading: true, usersError: null });
        try {
          const response = await superadminApi.createUser(token, userData);
          
          const newUser: SuperadminUser = {
            ...response.user,
            status: 'active',
            lastLogin: response.user.createdAt,
            loginCount: 0,
          };
          
          set(state => ({
            users: [...state.users, newUser],
            usersLoading: false,
            pagination: {
              ...state.pagination,
              totalUsers: state.pagination.totalUsers + 1,
              totalPages: Math.ceil((state.pagination.totalUsers + 1) / state.pagination.usersPerPage),
            }
          }));
        } catch (error: any) {
          set({
            usersLoading: false,
            usersError: error.message || 'Failed to create user'
          });
        }
      },
      
      updateUser: async (token: string, userId: string, userData: superadminApi.UpdateUserRequest) => {
        set({ usersLoading: true, usersError: null });
        try {
          const response = await superadminApi.updateUser(token, userId, userData);
          
          const updatedUser: SuperadminUser = {
            ...response.user,
            status: response.user.isActive ? 'active' : 'inactive',
            lastLogin: response.user.updatedAt,
            loginCount: 0,
          };
          
          set(state => ({
            users: state.users.map(user => 
              user._id === userId ? updatedUser : user
            ),
            selectedUser: state.selectedUser?._id === userId ? updatedUser : state.selectedUser,
            usersLoading: false,
          }));
        } catch (error: any) {
          set({
            usersLoading: false,
            usersError: error.message || 'Failed to update user'
          });
        }
      },
      
      deleteUser: async (token: string, userId: string) => {
        set({ usersLoading: true, usersError: null });
        try {
          await superadminApi.deleteUser(token, userId);
          
          set(state => ({
            users: state.users.filter(user => user._id !== userId),
            selectedUser: state.selectedUser?._id === userId ? null : state.selectedUser,
            usersLoading: false,
            pagination: {
              ...state.pagination,
              totalUsers: state.pagination.totalUsers - 1,
              totalPages: Math.ceil((state.pagination.totalUsers - 1) / state.pagination.usersPerPage),
            }
          }));
        } catch (error: any) {
          set({
            usersLoading: false,
            usersError: error.message || 'Failed to delete user'
          });
        }
      },
      
      activateUser: async (token: string, userId: string) => {
        set({ usersLoading: true, usersError: null });
        try {
          const response = await superadminApi.activateUser(token, userId);
          
          set(state => ({
            users: state.users.map(user => 
              user._id === userId 
                ? { ...user, isActive: true, status: 'active' as const }
                : user
            ),
            selectedUser: state.selectedUser?._id === userId 
              ? { ...state.selectedUser, isActive: true, status: 'active' as const }
              : state.selectedUser,
            usersLoading: false,
          }));
        } catch (error: any) {
          set({
            usersLoading: false,
            usersError: error.message || 'Failed to activate user'
          });
        }
      },
      
      deactivateUser: async (token: string, userId: string) => {
        set({ usersLoading: true, usersError: null });
        try {
          const response = await superadminApi.deactivateUser(token, userId);
          
          set(state => ({
            users: state.users.map(user => 
              user._id === userId 
                ? { ...user, isActive: false, status: 'inactive' as const }
                : user
            ),
            selectedUser: state.selectedUser?._id === userId 
              ? { ...state.selectedUser, isActive: false, status: 'inactive' as const }
              : state.selectedUser,
            usersLoading: false,
          }));
        } catch (error: any) {
          set({
            usersLoading: false,
            usersError: error.message || 'Failed to deactivate user'
          });
        }
      },
      
      // ==================== PERMISSIONS MANAGEMENT ====================
      
      fetchAllPermissions: async (token: string) => {
        set({ permissionsLoading: true, permissionsError: null });
        try {
          const response = await superadminApi.getAllPermissions(token);
          set({
            allPermissions: response.permissions,
            permissionsLoading: false,
          });
        } catch (error: any) {
          set({
            permissionsLoading: false,
            permissionsError: error.message || 'Failed to fetch permissions'
          });
        }
      },
      
      grantPermission: async (token: string, userId: string, permissionData: superadminApi.GrantPermissionRequest) => {
        set({ usersLoading: true, usersError: null });
        try {
          const response = await superadminApi.grantPermission(token, userId, permissionData);
          
          set(state => ({
            users: state.users.map(user => 
              user._id === userId 
                ? { ...user, permissions: [...user.permissions, permissionData.permission] }
                : user
            ),
            selectedUser: state.selectedUser?._id === userId 
              ? { ...state.selectedUser, permissions: [...state.selectedUser.permissions, permissionData.permission] }
              : state.selectedUser,
            usersLoading: false,
          }));
        } catch (error: any) {
          set({
            usersLoading: false,
            usersError: error.message || 'Failed to grant permission'
          });
        }
      },
      
      revokePermission: async (token: string, userId: string, permissionData: superadminApi.RevokePermissionRequest) => {
        set({ usersLoading: true, usersError: null });
        try {
          const response = await superadminApi.revokePermission(token, userId, permissionData);
          
          set(state => ({
            users: state.users.map(user => 
              user._id === userId 
                ? { ...user, permissions: user.permissions.filter(p => p !== permissionData.permission) }
                : user
            ),
            selectedUser: state.selectedUser?._id === userId 
              ? { ...state.selectedUser, permissions: state.selectedUser.permissions.filter(p => p !== permissionData.permission) }
              : state.selectedUser,
            usersLoading: false,
          }));
        } catch (error: any) {
          set({
            usersLoading: false,
            usersError: error.message || 'Failed to revoke permission'
          });
        }
      },
      
      resetUserPermissions: async (token: string, userId: string, reason: string) => {
        set({ usersLoading: true, usersError: null });
        try {
          const response = await superadminApi.resetUserPermissions(token, userId, { reason });
          
          set(state => ({
            users: state.users.map(user => 
              user._id === userId 
                ? { ...user, permissions: [] }
                : user
            ),
            selectedUser: state.selectedUser?._id === userId 
              ? { ...state.selectedUser, permissions: [] }
              : state.selectedUser,
            usersLoading: false,
          }));
        } catch (error: any) {
          set({
            usersLoading: false,
            usersError: error.message || 'Failed to reset permissions'
          });
        }
      },
      
      getUserPermissions: async (token: string, userId: string) => {
        try {
          const response = await superadminApi.getUserPermissions(token, userId);
          return response.permissions;
        } catch (error: any) {
          throw new Error(error.message || 'Failed to get user permissions');
        }
      },
      
      // ==================== ROLE MANAGEMENT ====================
      
      changeUserRole: async (token: string, userId: string, roleData: superadminApi.ChangeRoleRequest) => {
        set({ usersLoading: true, usersError: null });
        try {
          const response = await superadminApi.changeUserRole(token, userId, roleData);
          
          set(state => ({
            users: state.users.map(user => 
              user._id === userId 
                ? { ...user, role: roleData.role }
                : user
            ),
            selectedUser: state.selectedUser?._id === userId 
              ? { ...state.selectedUser, role: roleData.role }
              : state.selectedUser,
            usersLoading: false,
          }));
        } catch (error: any) {
          set({
            usersLoading: false,
            usersError: error.message || 'Failed to change user role'
          });
        }
      },
      
      promoteToAdmin: async (token: string, userId: string, reason: string) => {
        set({ usersLoading: true, usersError: null });
        try {
          const response = await superadminApi.promoteToAdmin(token, userId, reason);
          
          set(state => ({
            users: state.users.map(user => 
              user._id === userId 
                ? { ...user, role: 'admin' as const }
                : user
            ),
            selectedUser: state.selectedUser?._id === userId 
              ? { ...state.selectedUser, role: 'admin' as const }
              : state.selectedUser,
            usersLoading: false,
          }));
        } catch (error: any) {
          set({
            usersLoading: false,
            usersError: error.message || 'Failed to promote user'
          });
        }
      },
      
      demoteToUser: async (token: string, userId: string, reason: string) => {
        set({ usersLoading: true, usersError: null });
        try {
          const response = await superadminApi.demoteToUser(token, userId, reason);
          
          set(state => ({
            users: state.users.map(user => 
              user._id === userId 
                ? { ...user, role: 'user' as const }
                : user
            ),
            selectedUser: state.selectedUser?._id === userId 
              ? { ...state.selectedUser, role: 'user' as const }
              : state.selectedUser,
            usersLoading: false,
          }));
        } catch (error: any) {
          set({
            usersLoading: false,
            usersError: error.message || 'Failed to demote user'
          });
        }
      },
      
      // ==================== BULK ACTIONS ====================
      
      performBulkAction: async (token: string, request: BulkActionRequest) => {
        set({ bulkActionInProgress: true, bulkActionResult: null });
        try {
          // Simulate bulk action - you might want to create actual bulk endpoints
          let processed = 0;
          let failed = 0;
          const failedIds: string[] = [];
          
          for (const userId of request.userIds) {
            try {
              switch (request.action) {
                case 'activate':
                  await superadminApi.activateUser(token, userId);
                  break;
                case 'deactivate':
                  await superadminApi.deactivateUser(token, userId);
                  break;
                case 'delete':
                  await superadminApi.deleteUser(token, userId);
                  break;
                case 'promote':
                  await superadminApi.promoteToAdmin(token, userId, request.reason || 'Bulk promotion');
                  break;
                case 'demote':
                  await superadminApi.demoteToUser(token, userId, request.reason || 'Bulk demotion');
                  break;
              }
              processed++;
            } catch (error) {
              failed++;
              failedIds.push(userId);
            }
          }
          
          // Refresh users list
          if (processed > 0) {
            await get().fetchAllUsers(token);
          }
          
          set({
            bulkActionInProgress: false,
            bulkActionResult: {
              success: true,
              processed,
              failed,
              failedIds,
              message: `Bulk action completed. Processed: ${processed}, Failed: ${failed}`
            }
          });
        } catch (error: any) {
          set({
            bulkActionInProgress: false,
            bulkActionResult: {
              success: false,
              processed: 0,
              failed: request.userIds.length,
              failedIds: request.userIds,
              message: error.message || 'Bulk action failed'
            }
          });
        }
      },
      
      // ==================== STATS ====================
      
      fetchUserStats: async (token: string) => {
        set({ statsLoading: true });
        try {
          const response = await superadminApi.getAllUsers(token);
          
          const stats: UserStats = {
            totalUsers: response.total,
            activeUsers: response.users.filter(user => user.isActive).length,
            inactiveUsers: response.users.filter(user => !user.isActive).length,
            superadmins: response.users.filter(user => user.role === 'superadmin').length,
            admins: response.users.filter(user => user.role === 'admin').length,
            regularUsers: response.users.filter(user => user.role === 'user').length,
          };
          
          set({ stats, statsLoading: false });
        } catch (error: any) {
          set({ statsLoading: false });
        }
      },
      
      // ==================== FILTERS & SEARCH ====================
      
      setFilters: (filters) => {
        set(state => ({
          filters: { ...state.filters, ...filters },
          pagination: { ...state.pagination, currentPage: 1 },
        }));
      },
      
      clearFilters: () => {
        set({
          filters: initialState.filters,
          pagination: { ...initialState.pagination, currentPage: 1 },
        });
      },
      
      searchUsers: (searchTerm) => {
        set(state => ({
          filters: { ...state.filters, search: searchTerm },
          pagination: { ...state.pagination, currentPage: 1 },
        }));
      },
      
      // ==================== USER SELECTION ====================
      
      selectUser: (user) => {
        set({ selectedUser: user });
      },
      
      clearSelectedUser: () => {
        set({ selectedUser: null });
      },
      
      // ==================== PAGINATION ====================
      
      setPage: (page) => {
        set(state => ({
          pagination: { ...state.pagination, currentPage: page },
        }));
      },
      
      setUsersPerPage: (perPage) => {
        set(state => ({
          pagination: {
            ...state.pagination,
            usersPerPage: perPage,
            currentPage: 1,
            totalPages: Math.ceil(state.pagination.totalUsers / perPage),
          },
        }));
      },
      
      // ==================== RESET ====================
      
      resetSuperadminStore: () => {
        set(initialState);
      },
      
      clearErrors: () => {
        set({ usersError: null, permissionsError: null });
      },
    }),
    {
      name: 'superadmin-storage',
      partialize: (state) => ({
        filters: state.filters,
        pagination: state.pagination,
        stats: state.stats,
      }),
    }
  )
);

export default useSuperadminStore;