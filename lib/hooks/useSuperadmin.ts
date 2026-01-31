"use client";

import {
  useMutation,
  useQueryClient,
  useQuery,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import * as superadminApi from "@/lib/api/superadmin";
import { User } from "@/lib/api/auth";
import {useAuthStore} from "@/lib/store/auth.store";

// ==================== QUERY KEYS ====================

export const superadminKeys = {
  all: ["superadmin"] as const,
  users: () => [...superadminKeys.all, "users"] as const,
  user: (id: string) => [...superadminKeys.users(), id] as const,
  permissions: () => [...superadminKeys.all, "permissions"] as const,
  stats: () => [...superadminKeys.all, "stats"] as const,
};

// ==================== USERS QUERIES ====================

export const useGetAllUsers = (options?: UseQueryOptions<superadminApi.GetAllUsersResponse, Error>) => {
  const { token } = useAuthStore();

  return useQuery<superadminApi.GetAllUsersResponse, Error>({
    queryKey: superadminKeys.users(),
    queryFn: () => {
      if (!token) throw new Error("No authentication token");
      return superadminApi.getAllUsers(token);
    },
    enabled: !!token,
    ...options,
  });
};

export const useGetUserById = (userId: string, options?: UseQueryOptions<{success: boolean; user: User}, Error>) => {
  const { token } = useAuthStore();

  return useQuery<{success: boolean; user: User}, Error>({
    queryKey: superadminKeys.user(userId),
    queryFn: () => {
      if (!token) throw new Error("No authentication token");
      return superadminApi.getUserById(token, userId);
    },
    enabled: !!token && !!userId,
    ...options,
  });
};

export const useGetUserPermissions = (userId: string, options?: UseQueryOptions<superadminApi.UserPermissionsResponse, Error>) => {
  const { token } = useAuthStore();

  return useQuery<superadminApi.UserPermissionsResponse, Error>({
    queryKey: [...superadminKeys.user(userId), "permissions"],
    queryFn: () => {
      if (!token) throw new Error("No authentication token");
      return superadminApi.getUserPermissions(token, userId);
    },
    enabled: !!token && !!userId,
    ...options,
  });
};

// ==================== PERMISSIONS QUERIES ====================

export const useGetAllPermissions = (options?: UseQueryOptions<superadminApi.GetAllPermissionsResponse, Error>) => {
  const { token } = useAuthStore();

  return useQuery<superadminApi.GetAllPermissionsResponse, Error>({
    queryKey: superadminKeys.permissions(),
    queryFn: () => {
      if (!token) throw new Error("No authentication token");
      return superadminApi.getAllPermissions(token);
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

export const useCheckUserPermission = (userId: string, permission: string, options?: UseQueryOptions<superadminApi.CheckPermissionResponse, Error>) => {
  const { token } = useAuthStore();

  return useQuery<superadminApi.CheckPermissionResponse, Error>({
    queryKey: [...superadminKeys.user(userId), "permission-check", permission],
    queryFn: () => {
      if (!token) throw new Error("No authentication token");
      return superadminApi.checkUserPermission(token, userId, permission);
    },
    enabled: !!token && !!userId && !!permission,
    ...options,
  });
};

// ==================== USERS MUTATIONS ====================

export const useCreateUser = (options?: UseMutationOptions<superadminApi.CreateUserResponse, Error, superadminApi.CreateUserRequest>) => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  return useMutation<superadminApi.CreateUserResponse, Error, superadminApi.CreateUserRequest>({
    mutationFn: (userData) => {
      if (!token) throw new Error("No authentication token");
      return superadminApi.createUser(token, userData);
    },
    onSuccess: () => {
      // Invalidate users query
      queryClient.invalidateQueries({
        queryKey: superadminKeys.users(),
      });
      // Invalidate stats
      queryClient.invalidateQueries({
        queryKey: superadminKeys.stats(),
      });
    },
    ...options,
  });
};

export const useUpdateUser = (options?: UseMutationOptions<superadminApi.UpdateUserResponse, Error, {userId: string; data: superadminApi.UpdateUserRequest}>) => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  return useMutation<superadminApi.UpdateUserResponse, Error, {userId: string; data: superadminApi.UpdateUserRequest}>({
    mutationFn: ({ userId, data }) => {
      if (!token) throw new Error("No authentication token");
      return superadminApi.updateUser(token, userId, data);
    },
    onSuccess: (data, variables) => {
      // Update specific user cache
      queryClient.setQueryData(superadminKeys.user(variables.userId), { success: true, user: data.user });
      // Invalidate users list
      queryClient.invalidateQueries({
        queryKey: superadminKeys.users(),
      });
    },
    ...options,
  });
};

export const useDeleteUser = (options?: UseMutationOptions<{success: boolean; message: string}, Error, string>) => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  return useMutation<{success: boolean; message: string}, Error, string>({
    mutationFn: (userId) => {
      if (!token) throw new Error("No authentication token");
      return superadminApi.deleteUser(token, userId);
    },
    onSuccess: (data, userId) => {
      // Remove user from cache
      queryClient.removeQueries({
        queryKey: superadminKeys.user(userId),
      });
      // Invalidate users list
      queryClient.invalidateQueries({
        queryKey: superadminKeys.users(),
      });
    },
    ...options,
  });
};

export const useActivateUser = (options?: UseMutationOptions<superadminApi.UserStatusResponse, Error, string>) => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  return useMutation<superadminApi.UserStatusResponse, Error, string>({
    mutationFn: (userId) => {
      if (!token) throw new Error("No authentication token");
      return superadminApi.activateUser(token, userId);
    },
    onSuccess: (data, userId) => {
      // Update user cache
      queryClient.setQueryData(superadminKeys.user(userId), { success: true, user: data.user });
      // Invalidate users list
      queryClient.invalidateQueries({
        queryKey: superadminKeys.users(),
      });
    },
    ...options,
  });
};

export const useDeactivateUser = (options?: UseMutationOptions<superadminApi.UserStatusResponse, Error, string>) => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  return useMutation<superadminApi.UserStatusResponse, Error, string>({
    mutationFn: (userId) => {
      if (!token) throw new Error("No authentication token");
      return superadminApi.deactivateUser(token, userId);
    },
    onSuccess: (data, userId) => {
      // Update user cache
      queryClient.setQueryData(superadminKeys.user(userId), { success: true, user: data.user });
      // Invalidate users list
      queryClient.invalidateQueries({
        queryKey: superadminKeys.users(),
      });
    },
    ...options,
  });
};

// ==================== PERMISSIONS MUTATIONS ====================

export const useGrantPermission = (options?: UseMutationOptions<superadminApi.GrantPermissionResponse, Error, {userId: string; data: superadminApi.GrantPermissionRequest}>) => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  return useMutation<superadminApi.GrantPermissionResponse, Error, {userId: string; data: superadminApi.GrantPermissionRequest}>({
    mutationFn: ({ userId, data }) => {
      if (!token) throw new Error("No authentication token");
      return superadminApi.grantPermission(token, userId, data);
    },
    onSuccess: (data, variables) => {
      // Update user permissions cache
      queryClient.invalidateQueries({
        queryKey: [...superadminKeys.user(variables.userId), "permissions"],
      });
      // Update user data
      queryClient.setQueryData(superadminKeys.user(variables.userId), { success: true, user: data.user });
    },
    ...options,
  });
};

export const useRevokePermission = (options?: UseMutationOptions<superadminApi.RevokePermissionResponse, Error, {userId: string; data: superadminApi.RevokePermissionRequest}>) => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  return useMutation<superadminApi.RevokePermissionResponse, Error, {userId: string; data: superadminApi.RevokePermissionRequest}>({
    mutationFn: ({ userId, data }) => {
      if (!token) throw new Error("No authentication token");
      return superadminApi.revokePermission(token, userId, data);
    },
    onSuccess: (data, variables) => {
      // Update user permissions cache
      queryClient.invalidateQueries({
        queryKey: [...superadminKeys.user(variables.userId), "permissions"],
      });
      // Update user data
      queryClient.setQueryData(superadminKeys.user(variables.userId), { success: true, user: data.user });
    },
    ...options,
  });
};

export const useResetUserPermissions = (options?: UseMutationOptions<superadminApi.ResetPermissionsResponse, Error, {userId: string; reason: string}>) => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  return useMutation<superadminApi.ResetPermissionsResponse, Error, {userId: string; reason: string}>({
    mutationFn: ({ userId, reason }) => {
      if (!token) throw new Error("No authentication token");
      return superadminApi.resetUserPermissions(token, userId, { reason });
    },
    onSuccess: (data, variables) => {
      // Update user permissions cache
      queryClient.invalidateQueries({
        queryKey: [...superadminKeys.user(variables.userId), "permissions"],
      });
      // Update user data
      queryClient.setQueryData(superadminKeys.user(variables.userId), { success: true, user: data.user });
    },
    ...options,
  });
};

// ==================== ROLE MANAGEMENT MUTATIONS ====================

export const useChangeUserRole = (options?: UseMutationOptions<superadminApi.ChangeRoleResponse, Error, {userId: string; data: superadminApi.ChangeRoleRequest}>) => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  return useMutation<superadminApi.ChangeRoleResponse, Error, {userId: string; data: superadminApi.ChangeRoleRequest}>({
    mutationFn: ({ userId, data }) => {
      if (!token) throw new Error("No authentication token");
      return superadminApi.changeUserRole(token, userId, data);
    },
    onSuccess: (data, variables) => {
      // Update user cache
      queryClient.setQueryData(superadminKeys.user(variables.userId), { success: true, user: data.user });
      // Invalidate users list
      queryClient.invalidateQueries({
        queryKey: superadminKeys.users(),
      });
    },
    ...options,
  });
};

export const usePromoteToAdmin = (options?: UseMutationOptions<superadminApi.PromoteUserResponse, Error, {userId: string; reason: string}>) => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  return useMutation<superadminApi.PromoteUserResponse, Error, {userId: string; reason: string}>({
    mutationFn: ({ userId, reason }) => {
      if (!token) throw new Error("No authentication token");
      return superadminApi.promoteToAdmin(token, userId, reason);
    },
    onSuccess: (data, variables) => {
      // Update user cache
      queryClient.setQueryData(superadminKeys.user(variables.userId), { success: true, user: data.user });
      // Invalidate users list
      queryClient.invalidateQueries({
        queryKey: superadminKeys.users(),
      });
    },
    ...options,
  });
};

export const useDemoteToUser = (options?: UseMutationOptions<superadminApi.DemoteUserResponse, Error, {userId: string; reason: string}>) => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  return useMutation<superadminApi.DemoteUserResponse, Error, {userId: string; reason: string}>({
    mutationFn: ({ userId, reason }) => {
      if (!token) throw new Error("No authentication token");
      return superadminApi.demoteToUser(token, userId, reason);
    },
    onSuccess: (data, variables) => {
      // Update user cache
      queryClient.setQueryData(superadminKeys.user(variables.userId), { success: true, user: data.user });
      // Invalidate users list
      queryClient.invalidateQueries({
        queryKey: superadminKeys.users(),
      });
    },
    ...options,
  });
};

// ==================== UTILITY HOOKS ====================

export const useSuperadminStatus = () => {
  const { user } = useAuthStore();
  const isSuperadmin = user?.role === 'superadmin';
  const isAdmin = user?.role === 'admin';
  
  return {
    isSuperadmin,
    isAdmin,
    canManageUsers: isAdmin || isSuperadmin,
    canManagePermissions: isSuperadmin,
    canDeleteUsers: isSuperadmin,
    canChangeRoles: isSuperadmin,
    canGrantPermissions: isSuperadmin,
    canRevokePermissions: isSuperadmin,
  };
};

export const useSuperadminPermissions = () => {
  const { user } = useAuthStore();
  
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    // Superadmin has all permissions
    if (user.role === 'superadmin') return true;
    
    // Admin has specific permissions based on API
    if (user.role === 'admin') {
      // From your API, admin can:
      // - Get all users
      // - Create users
      // - Update users
      // - Activate/Deactivate users
      // - View user permissions
      const adminPermissions = [
        'view_users',
        'create_users',
        'update_users',
        'activate_users',
        'deactivate_users',
        'view_permissions',
      ];
      return adminPermissions.includes(permission);
    }
    
    return false;
  };
  
  return {
    hasPermission,
    userRole: user?.role,
    userPermissions: user?.permissions || [],
  };
};

// ==================== STATS QUERY ====================

export const useGetUserStats = (options?: UseQueryOptions<any, Error>) => {
  const { token } = useAuthStore();

  return useQuery<any, Error>({
    queryKey: superadminKeys.stats(),
    queryFn: async () => {
      if (!token) throw new Error("No authentication token");
      
      // Get all users and calculate stats
      const usersResponse = await superadminApi.getAllUsers(token);
      const users = usersResponse.users;
      
      return {
        success: true,
        stats: {
          totalUsers: users.length,
          activeUsers: users.filter(user => user.isActive).length,
          inactiveUsers: users.filter(user => !user.isActive).length,
          superadmins: users.filter(user => user.role === 'superadmin').length,
          admins: users.filter(user => user.role === 'admin').length,
          regularUsers: users.filter(user => user.role === 'user').length,
        }
      };
    },
    enabled: !!token,
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
};