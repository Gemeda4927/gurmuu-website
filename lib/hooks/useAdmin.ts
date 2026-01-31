import { useCallback } from 'react';
import { useAdminStore, adminSelectors } from '../store/admin.store';
import * as adminApi from '../api/admin';

/**
 * Custom hook for admin functionality
 * Provides admin actions and state management
 */
export const useAdmin = () => {
  const store = useAdminStore();
  
  // ================= STATE SELECTORS =================
  
  // Users state
  const users = store.users;
  const selectedUser = store.selectedUser;
  const loading = store.loading;
  const error = store.error;
  
  // Pagination state
  const currentPage = store.currentPage;
  const totalPages = store.totalPages;
  const totalUsers = store.totalUsers;
  
  // Permissions state
  const permissionsList = store.permissionsList;
  
  // Derived state using selectors
  const activeUsers = adminSelectors.activeUsers(store);
  const inactiveUsers = adminSelectors.inactiveUsers(store);
  const usersByRole = adminSelectors.usersByRole(store);
  const permissionNames = adminSelectors.permissionNames(store);
  
  // ================= USER MANAGEMENT FUNCTIONS =================
  
  const fetchAllUsers = useCallback((
    token: string,
    page?: number,
    limit?: number
  ) => {
    return store.fetchAllUsers(token, page, limit);
  }, [store.fetchAllUsers]);
  
  const fetchUserById = useCallback((
    token: string,
    userId: string
  ) => {
    return store.fetchUserById(token, userId);
  }, [store.fetchUserById]);
  
  const createNewUser = useCallback((
    token: string,
    userData: adminApi.CreateUserRequest
  ) => {
    return store.createNewUser(token, userData);
  }, [store.createNewUser]);
  
  const updateUser = useCallback((
    token: string,
    userId: string,
    userData: adminApi.UpdateUserRequest
  ) => {
    return store.updateUser(token, userId, userData);
  }, [store.updateUser]);
  
  const activateUser = useCallback((
    token: string,
    userId: string
  ) => {
    return store.activateUser(token, userId);
  }, [store.activateUser]);
  
  const deactivateUser = useCallback((
    token: string,
    userId: string
  ) => {
    return store.deactivateUser(token, userId);
  }, [store.deactivateUser]);
  
  // ================= PERMISSION MANAGEMENT FUNCTIONS =================
  
  const fetchUserPermissions = useCallback((
    token: string,
    userId: string
  ) => {
    return store.fetchUserPermissions(token, userId);
  }, [store.fetchUserPermissions]);
  
  const fetchAllPermissions = useCallback((
    token: string
  ) => {
    return store.fetchAllPermissions(token);
  }, [store.fetchAllPermissions]);
  
  const checkUserPermission = useCallback((
    token: string,
    userId: string,
    permission: string
  ) => {
    return store.checkUserPermission(token, userId, permission);
  }, [store.checkUserPermission]);
  
  // ================= UI FUNCTIONS =================
  
  const setSelectedUser = useCallback((
    user: adminApi.User | null
  ) => {
    store.setSelectedUser(user);
  }, [store.setSelectedUser]);
  
  const clearError = useCallback(() => {
    store.clearError();
  }, [store.clearError]);
  
  const clearUsers = useCallback(() => {
    store.clearUsers();
  }, [store.clearUsers]);
  
  // ================= PERMISSION CHECK HELPERS =================
  
  /**
   * Check if current admin has a specific permission
   * This is for frontend UI visibility control
   */
  const hasPermission = useCallback((
    userPermissions: string[],
    permission: string
  ): boolean => {
    return userPermissions.includes(permission);
  }, []);
  
  /**
   * Check if admin can manage users (based on permissions)
   */
  const canManageUsers = useCallback((
    userPermissions: string[]
  ): boolean => {
    return hasPermission(userPermissions, 'manage_users') ||
           hasPermission(userPermissions, 'view_all_users');
  }, [hasPermission]);
  
  /**
   * Check if admin can deactivate users
   */
  const canDeactivateUsers = useCallback((
    userPermissions: string[]
  ): boolean => {
    return hasPermission(userPermissions, 'deactivate_users');
  }, [hasPermission]);
  
  /**
   * Check if admin can view analytics
   */
  const canViewAnalytics = useCallback((
    userPermissions: string[]
  ): boolean => {
    return hasPermission(userPermissions, 'view_analytics');
  }, [hasPermission]);
  
  /**
   * Check if admin can send notifications
   */
  const canSendNotifications = useCallback((
    userPermissions: string[]
  ): boolean => {
    return hasPermission(userPermissions, 'send_notifications');
  }, [hasPermission]);
  
  // ================= EXPORTS =================
  
  return {
    // State
    users,
    selectedUser,
    loading,
    error,
    currentPage,
    totalPages,
    totalUsers,
    permissionsList,
    activeUsers,
    inactiveUsers,
    usersByRole,
    permissionNames,
    
    // User Management Actions
    fetchAllUsers,
    fetchUserById,
    createNewUser,
    updateUser,
    activateUser,
    deactivateUser,
    
    // Permission Actions
    fetchUserPermissions,
    fetchAllPermissions,
    checkUserPermission,
    
    // UI Actions
    setSelectedUser,
    clearError,
    clearUsers,
    
    // Permission Helpers
    hasPermission,
    canManageUsers,
    canDeactivateUsers,
    canViewAnalytics,
    canSendNotifications,
    
    // Convenience methods
    refreshUsers: (token: string) => fetchAllUsers(token, currentPage),
    getUserById: fetchUserById,
  };
};

// ================= HOOK TYPES =================
export type UseAdminReturn = ReturnType<typeof useAdmin>;