// lib/hooks/usePersimmon.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { persimmonApi, permissionHelpers, AllPermissionsResponse, PermissionCheckResponse } from "@/lib/api/persimmon";
import useAuthStore from "@/lib/store/auth.store";

export const usePersimmon = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const currentUserRole = user?.role as 'user' | 'admin' | 'superadmin' | undefined;
  const isSuperadmin = currentUserRole === 'superadmin';
  const isAdmin = currentUserRole === 'admin' || isSuperadmin;

  // Get all permissions and roles
  const useGetAllPermissions = () => {
    return useQuery<AllPermissionsResponse>({
      queryKey: ["permissions", "all"],
      queryFn: persimmonApi.getAllPermissions,
      enabled: !!user && (isAdmin || isSuperadmin),
      staleTime: 5 * 60 * 1000,
    });
  };

  // Get user permissions
  const useGetUserPermissions = (userId: string) => {
    return useQuery<PermissionCheckResponse>({
      queryKey: ["permissions", "user", userId],
      queryFn: () => persimmonApi.getUserPermissions(userId),
      enabled: !!user && !!userId && (isAdmin || isSuperadmin),
    });
  };

  // Check user permission
  const useCheckUserPermission = (userId: string, permission: string) => {
    return useQuery<PermissionCheckResponse>({
      queryKey: ["permissions", "check", userId, permission],
      queryFn: () => persimmonApi.checkUserPermission(userId, permission),
      enabled: !!user && !!userId && !!permission && (isAdmin || isSuperadmin),
    });
  };

  // Grant permission mutation
  const useGrantPermission = () => {
    return useMutation({
      mutationFn: ({ userId, data }: { userId: string; data: { permission: string; reason: string } }) =>
        persimmonApi.grantPermission(userId, data),
      onSuccess: (_, { userId }) => {
        queryClient.invalidateQueries({ queryKey: ["permissions", "user", userId] });
        queryClient.invalidateQueries({ queryKey: ["permissions", "check"] });
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
    });
  };

  // Revoke permission mutation
  const useRevokePermission = () => {
    return useMutation({
      mutationFn: ({ userId, data }: { userId: string; data: { permission: string; reason: string } }) =>
        persimmonApi.revokePermission(userId, data),
      onSuccess: (_, { userId }) => {
        queryClient.invalidateQueries({ queryKey: ["permissions", "user", userId] });
        queryClient.invalidateQueries({ queryKey: ["permissions", "check"] });
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
    });
  };

  // Reset permissions mutation
  const useResetPermissions = () => {
    return useMutation({
      mutationFn: (userId: string) => persimmonApi.resetPermissions(userId),
      onSuccess: (_, userId) => {
        queryClient.invalidateQueries({ queryKey: ["permissions", "user", userId] });
        queryClient.invalidateQueries({ queryKey: ["permissions", "check"] });
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
    });
  };

  // Change user role mutation
  const useChangeUserRole = () => {
    return useMutation({
      mutationFn: ({ userId, data }: { userId: string; data: { role: string; reason: string } }) =>
        persimmonApi.changeUserRole(userId, data),
      onSuccess: (_, { userId }) => {
        queryClient.invalidateQueries({ queryKey: ["permissions", "user", userId] });
        queryClient.invalidateQueries({ queryKey: ["permissions", "check"] });
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
    });
  };

  // Promote to admin mutation
  const usePromoteToAdmin = () => {
    return useMutation({
      mutationFn: ({ userId, reason }: { userId: string; reason: string }) =>
        persimmonApi.promoteToAdmin(userId, { reason }),
      onSuccess: (_, { userId }) => {
        queryClient.invalidateQueries({ queryKey: ["permissions", "user", userId] });
        queryClient.invalidateQueries({ queryKey: ["permissions", "check"] });
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
    });
  };

  // Demote to user mutation
  const useDemoteToUser = () => {
    return useMutation({
      mutationFn: ({ userId, reason }: { userId: string; reason: string }) =>
        persimmonApi.demoteToUser(userId, { reason }),
      onSuccess: (_, { userId }) => {
        queryClient.invalidateQueries({ queryKey: ["permissions", "user", userId] });
        queryClient.invalidateQueries({ queryKey: ["permissions", "check"] });
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
    });
  };

  // Helper functions
  const isPermissionGranted = (userPermissions: string[] | undefined, permission: string): boolean => {
    return userPermissions?.includes(permission) || false;
  };

  const usePermissionCapabilities = () => {
    return {
      canManagePermissions: isSuperadmin,
      canChangeRoles: isSuperadmin,
      isSuperadmin,
      isAdmin,
      currentUserRole,
    };
  };

  return {
    persimmonApi,
    permissionHelpers,
    useGetAllPermissions,
    useGetUserPermissions,
    useCheckUserPermission,
    useGrantPermission,
    useRevokePermission,
    useResetPermissions,
    useChangeUserRole,
    usePromoteToAdmin,
    useDemoteToUser,
    usePermissionCapabilities,
    isPermissionGranted,
    isSuperadmin,
    isAdmin,
    currentUser: user,
    currentUserRole,
  };
};

export default usePersimmon;