// lib/hooks/usePersimmon.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { usePersimmonStore } from "@/lib/store/persimmon.store";
import { useAuthStore } from "@/lib/store/auth.store";

import {
  AllPermissionsResponse,
  AuditLog,
  PermissionStats,
  Role,
  UserPermissionsResponse,
} from "@/lib/types/persimmon.types";
import { persimmonApi } from "../api/persimmon";
import api from "../api/api";

/* =========================
   QUERY KEYS
========================= */

const keys = {
  permissions: ["permissions"] as const,

  userPermissions: (userId: string) =>
    ["permissions", "user", userId] as const,

  userStats: (userId: string) =>
    ["permissions", "stats", userId] as const,

  userAudit: (userId: string) =>
    ["permissions", "audit", userId] as const,
};

/* =========================
   MAIN HOOK
========================= */

export const usePersimmon = () => {
  const queryClient = useQueryClient();
  const store = usePersimmonStore();
  const { user } = useAuthStore();

  /* =========================
     QUERIES
  ========================= */

  const useAllPermissions = () =>
    useQuery<AllPermissionsResponse>({
      queryKey: keys.permissions,
      queryFn: async () => {
        const res =
          await persimmonApi.getAllPermissions();

        // console.debug(
        //   "getAllPermissions:",
        //   res.data
        // );

        return res.data;
      },
      enabled: !!user,
      staleTime: 10 * 60 * 1000,
    });

  const useUserPermissions = (userId: string) =>
    useQuery<UserPermissionsResponse>({
      queryKey: keys.userPermissions(userId),
      queryFn: async () => {
        const res =
          await persimmonApi.getUserPermissions(
            userId
          );

        if (res.data) {
          store.setUserPermissions(
            userId,
            res.data.permissions
          );
        }

        return res.data;
      },
      enabled: !!userId,
    });

  const useUserPermissionStats = (
    userId: string
  ) =>
    useQuery<PermissionStats>({
      queryKey: keys.userStats(userId),
      queryFn: async () => {
        const res =
          await persimmonApi.getUserPermissionStats(
            userId
          );
        return res.data;
      },
      enabled: !!userId,
    });

  const useUserAuditLogs = (userId: string) =>
    useQuery<AuditLog[]>({
      queryKey: keys.userAudit(userId),
      queryFn: async () => {
        const res =
          await persimmonApi.getUserAuditLogs(
            userId
          );
        return res.data ?? [];
      },
      enabled: !!userId,
    });

  /* =========================
     MUTATIONS
  ========================= */

  const invalidateUser = (userId: string) => {
    queryClient.invalidateQueries({
      queryKey: keys.userPermissions(userId),
    });
    queryClient.invalidateQueries({
      queryKey: keys.userStats(userId),
    });
    queryClient.invalidateQueries({
      queryKey: keys.userAudit(userId),
    });
  };

  // useSuperadmin.ts
  const useGrantPermission = () => {
    return useMutation({
      mutationFn: async ({
        userId,
        data,
      }: {
        userId: string;
        data: {
          permission: string;
          reason: string;
        };
      }) => {
        const response = await api.post(
          `/permissions/user/${userId}/grant`,
          data
        );
        return response.data;
      },
    });
  };

  const useRevokePermission = () => {
    return useMutation({
      mutationFn: async ({
        userId,
        data,
      }: {
        userId: string;
        data: {
          permission: string;
          reason: string;
        };
      }) => {
        const response = await api.post(
          `/permissions/user/${userId}/revoke`,
          data
        );
        return response.data;
      },
    });
  };

  const useChangeUserRole = () =>
    useMutation({
      mutationFn: async ({
        userId,
        role,
        reason,
      }: {
        userId: string;
        role: Role;
        reason?: string;
      }) => {
        const res =
          await persimmonApi.changeUserRole(
            userId,
            { role, reason }
          );
        return res.data;
      },
      onSuccess: (_, { userId }) =>
        invalidateUser(userId),
    });

  const usePromoteToAdmin = () =>
    useMutation({
      mutationFn: async (userId: string) => {
        const res =
          await persimmonApi.promoteToAdmin(
            userId
          );
        return res.data;
      },
      onSuccess: (_, userId) =>
        invalidateUser(userId),
    });

  const useDemoteToUser = () =>
    useMutation({
      mutationFn: async (userId: string) => {
        const res =
          await persimmonApi.demoteToUser(userId);
        return res.data;
      },
      onSuccess: (_, userId) =>
        invalidateUser(userId),
    });

  /* =========================
     STORE HELPERS (SYNC)
  ========================= */

  const hasPermissionLocal = (
    permissionCode: string,
    userId?: string
  ) =>
    store.hasPermission(permissionCode, userId);

  const hasAnyPermissionLocal = (
    permissionCodes: string[],
    userId?: string
  ) =>
    store.hasAnyPermission(
      permissionCodes,
      userId
    );

  const hasAllPermissionsLocal = (
    permissionCodes: string[],
    userId?: string
  ) =>
    store.hasAllPermissions(
      permissionCodes,
      userId
    );

  const isSuperadminLocal = (userId?: string) =>
    store.isSuperadmin(userId);

  const isAdminLocal = (userId?: string) =>
    store.isAdmin(userId);

  const isUserLocal = (userId?: string) =>
    store.isUser(userId);

  const hasRoleLocal = (
    role: Role | Role[],
    userId?: string
  ) => store.hasRole(role, userId);

  /* =========================
     RETURN API
  ========================= */

  return {
    // Queries
    useAllPermissions,
    useUserPermissions,
    useUserPermissionStats,
    useUserAuditLogs,

    // Mutations
    useGrantPermission,
    useRevokePermission,
    useChangeUserRole,
    usePromoteToAdmin,
    useDemoteToUser,

    // Store (raw)
    ...store,

    // Permission helpers
    hasPermissionLocal,
    hasAnyPermissionLocal,
    hasAllPermissionsLocal,

    // Role helpers
    isSuperadminLocal,
    isAdminLocal,
    isUserLocal,
    hasRoleLocal,

    // Current user helpers
    currentUser: user,
    isAdmin:
      user?.role === "admin" ||
      user?.role === "superadmin",
    isSuperadmin: user?.role === "superadmin",
    isUser: !!user,
  };
};

export default usePersimmon;
