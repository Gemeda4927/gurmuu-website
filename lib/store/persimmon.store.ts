// lib/store/persimmon.store.ts
import { create } from "zustand";
import {
  devtools,
  persist,
} from "zustand/middleware";
import type {
  PersimmonStore,
  PersimmonState,
  Permission,
  UserPermissionsResponse,
  PermissionCheckResponse,
  Role,
} from "../types/persimmon.types";
import { persimmonApi } from "../api/persimmon";

const initialState: PersimmonState = {
  allPermissions: [],
  userPermissions: {},
  userRoles: {},
  permissionChecks: {},
  loading: false,
  error: null,
  successMessage: null,
  currentUserId: undefined,
  currentUserRole: undefined,
  currentUserPermissions: undefined,
};

export const usePersimmonStore =
  create<PersimmonStore>()(
    devtools(
      persist(
        (set, get) => ({
          ...initialState,

          // ========== API Actions ==========
          fetchAllPermissions: async () => {
            set({ loading: true, error: null });
            try {
              const response =
                await persimmonApi.getAllPermissions();
              const permissions = response.data
                ?.permissions
                ? Object.values(
                    response.data.permissions
                  )
                    .flat()
                    .map((code) => ({
                      id: code,
                      code,
                      name: code
                        .split("_")
                        .map(
                          (word) =>
                            word
                              .charAt(0)
                              .toUpperCase() +
                            word.slice(1)
                        )
                        .join(" "),
                      category:
                        Object.keys(
                          response.data
                            ?.permissions || {}
                        ).find((cat) =>
                          response.data?.permissions[
                            cat
                          ]?.includes(code)
                        ) || "Uncategorized",
                      createdAt:
                        new Date().toISOString(),
                      updatedAt:
                        new Date().toISOString(),
                    }))
                : [];

              set({
                allPermissions: permissions,
                loading: false,
              });
              return permissions;
            } catch (error: any) {
              set({
                error:
                  error.response?.data?.message ||
                  "Failed to fetch permissions",
                loading: false,
              });
              throw error;
            }
          },

          setPermissionsData: (
            permissions: Permission[]
          ) => {
            set({ allPermissions: permissions });
          },

          setUserPermissions: (
            userId: string,
            permissions: string[]
          ) => {
            set((state) => {
              const existingUserPerms =
                state.userPermissions[userId];
              const updatedUserPerms: UserPermissionsResponse =
                existingUserPerms
                  ? {
                      ...existingUserPerms,
                      permissions,
                    }
                  : {
                      userId,
                      role:
                        state.userRoles[userId] ||
                        "user",
                      permissions,
                      directPermissions:
                        permissions,
                      inheritedPermissions: [],
                      lastUpdated:
                        new Date().toISOString(),
                    };

              return {
                userPermissions: {
                  ...state.userPermissions,
                  [userId]: updatedUserPerms,
                },
              };
            });
          },

          checkPermission: async (
            userId: string,
            permissionCode: string
          ) => {
            set({ loading: true, error: null });
            try {
              const response =
                await persimmonApi.checkPermission(
                  userId,
                  permissionCode
                );
              const checkResult: PermissionCheckResponse =
                response.data;

              // Cache the result
              const cacheKey = `${userId}_${permissionCode}`;
              set((state) => ({
                permissionChecks: {
                  ...state.permissionChecks,
                  [cacheKey]: checkResult,
                },
                loading: false,
              }));

              return checkResult;
            } catch (error: any) {
              set({
                error:
                  error.response?.data?.message ||
                  "Failed to check permission",
                loading: false,
              });
              throw error;
            }
          },

          fetchUserPermissions: async (
            userId: string
          ) => {
            set({ loading: true, error: null });
            try {
              const response =
                await persimmonApi.getUserPermissions(
                  userId
                );
              const userPerms: UserPermissionsResponse =
                response.data;

              set((state) => ({
                userPermissions: {
                  ...state.userPermissions,
                  [userId]: userPerms,
                },
                userRoles: {
                  ...state.userRoles,
                  [userId]: userPerms.role,
                },
                loading: false,
              }));

              if (
                get().currentUserId === userId
              ) {
                set({
                  currentUserRole: userPerms.role,
                  currentUserPermissions:
                    userPerms.permissions,
                });
              }

              return userPerms;
            } catch (error: any) {
              set({
                error:
                  error.response?.data?.message ||
                  "Failed to fetch user permissions",
                loading: false,
              });
              throw error;
            }
          },

          grantPermissionToUser: async (
            userId: string,
            permissionCode: string
          ) => {
            set({ loading: true, error: null });
            try {
              await persimmonApi.grantPermission(
                userId,
                { permission: permissionCode }
              );

              set((state) => {
                const userPerms =
                  state.userPermissions[userId];
                if (userPerms) {
                  return {
                    userPermissions: {
                      ...state.userPermissions,
                      [userId]: {
                        ...userPerms,
                        permissions: [
                          ...new Set([
                            ...userPerms.permissions,
                            permissionCode,
                          ]),
                        ],
                        directPermissions: [
                          ...new Set([
                            ...userPerms.directPermissions,
                            permissionCode,
                          ]),
                        ],
                        lastUpdated:
                          new Date().toISOString(),
                      },
                    },
                    loading: false,
                    successMessage: `Permission "${permissionCode}" granted to user`,
                  };
                }
                return {
                  loading: false,
                  successMessage: `Permission "${permissionCode}" granted to user`,
                };
              });

              // Clear cache
              const newCache = {
                ...get().permissionChecks,
              };
              Object.keys(newCache).forEach(
                (key) => {
                  if (
                    key.startsWith(`${userId}_`)
                  )
                    delete newCache[key];
                }
              );
              set({ permissionChecks: newCache });
            } catch (error: any) {
              set({
                error:
                  error.response?.data?.message ||
                  "Failed to grant permission",
                loading: false,
              });
              throw error;
            }
          },

          revokePermissionFromUser: async (
            userId: string,
            permissionCode: string
          ) => {
            set({ loading: true, error: null });
            try {
              await persimmonApi.revokePermission(
                userId,
                { permission: permissionCode }
              );

              set((state) => {
                const userPerms =
                  state.userPermissions[userId];
                if (userPerms) {
                  return {
                    userPermissions: {
                      ...state.userPermissions,
                      [userId]: {
                        ...userPerms,
                        permissions:
                          userPerms.permissions.filter(
                            (p) =>
                              p !== permissionCode
                          ),
                        directPermissions:
                          userPerms.directPermissions.filter(
                            (p) =>
                              p !== permissionCode
                          ),
                        lastUpdated:
                          new Date().toISOString(),
                      },
                    },
                    loading: false,
                    successMessage: `Permission "${permissionCode}" revoked from user`,
                  };
                }
                return {
                  loading: false,
                  successMessage: `Permission "${permissionCode}" revoked from user`,
                };
              });

              // Clear cache
              const newCache = {
                ...get().permissionChecks,
              };
              Object.keys(newCache).forEach(
                (key) => {
                  if (
                    key.startsWith(`${userId}_`)
                  )
                    delete newCache[key];
                }
              );
              set({ permissionChecks: newCache });
            } catch (error: any) {
              set({
                error:
                  error.response?.data?.message ||
                  "Failed to revoke permission",
                loading: false,
              });
              throw error;
            }
          },

          resetUserPermissions: async (
            userId: string
          ) => {
            set({ loading: true, error: null });
            try {
              await persimmonApi.resetPermissions(
                userId,
                {}
              );

              set((state) => {
                const userPerms =
                  state.userPermissions[userId];
                if (userPerms) {
                  return {
                    userPermissions: {
                      ...state.userPermissions,
                      [userId]: {
                        ...userPerms,
                        permissions:
                          userPerms.inheritedPermissions ||
                          [],
                        directPermissions: [],
                        lastUpdated:
                          new Date().toISOString(),
                      },
                    },
                    loading: false,
                    successMessage:
                      "User permissions reset successfully",
                  };
                }
                return {
                  loading: false,
                  successMessage:
                    "User permissions reset successfully",
                };
              });

              // Clear cache
              const newCache = {
                ...get().permissionChecks,
              };
              Object.keys(newCache).forEach(
                (key) => {
                  if (
                    key.startsWith(`${userId}_`)
                  )
                    delete newCache[key];
                }
              );
              set({ permissionChecks: newCache });
            } catch (error: any) {
              set({
                error:
                  error.response?.data?.message ||
                  "Failed to reset permissions",
                loading: false,
              });
              throw error;
            }
          },

          changeUserRole: async (
            userId: string,
            newRole: Role
          ) => {
            set({ loading: true, error: null });
            try {
              await persimmonApi.changeUserRole(
                userId,
                { role: newRole }
              );
              set((state) => ({
                userRoles: {
                  ...state.userRoles,
                  [userId]: newRole,
                },
                loading: false,
                successMessage: `User role changed to ${newRole}`,
              }));

              const newCache = {
                ...get().permissionChecks,
              };
              Object.keys(newCache).forEach(
                (key) => {
                  if (
                    key.startsWith(`${userId}_`)
                  )
                    delete newCache[key];
                }
              );
              set({ permissionChecks: newCache });
            } catch (error: any) {
              set({
                error:
                  error.response?.data?.message ||
                  "Failed to change user role",
                loading: false,
              });
              throw error;
            }
          },

          promoteToAdmin: async (
            userId: string
          ) => {
            set({ loading: true, error: null });
            try {
              await persimmonApi.promoteToAdmin(
                userId
              );
              set((state) => ({
                userRoles: {
                  ...state.userRoles,
                  [userId]: "admin",
                },
                loading: false,
                successMessage:
                  "User promoted to admin",
              }));

              const newCache = {
                ...get().permissionChecks,
              };
              Object.keys(newCache).forEach(
                (key) => {
                  if (
                    key.startsWith(`${userId}_`)
                  )
                    delete newCache[key];
                }
              );
              set({ permissionChecks: newCache });
            } catch (error: any) {
              set({
                error:
                  error.response?.data?.message ||
                  "Failed to promote user",
                loading: false,
              });
              throw error;
            }
          },

          demoteToUser: async (
            userId: string
          ) => {
            set({ loading: true, error: null });
            try {
              await persimmonApi.demoteToUser(
                userId
              );
              set((state) => ({
                userRoles: {
                  ...state.userRoles,
                  [userId]: "user",
                },
                loading: false,
                successMessage:
                  "Admin demoted to user",
              }));

              const newCache = {
                ...get().permissionChecks,
              };
              Object.keys(newCache).forEach(
                (key) => {
                  if (
                    key.startsWith(`${userId}_`)
                  )
                    delete newCache[key];
                }
              );
              set({ permissionChecks: newCache });
            } catch (error: any) {
              set({
                error:
                  error.response?.data?.message ||
                  "Failed to demote user",
                loading: false,
              });
              throw error;
            }
          },

          // In persimmon.store.ts, update the hasPermission method to be safer:
          hasPermission: (
            permissionCode: string,
            userId?: string
          ) => {
            try {
              const targetUserId =
                userId || get().currentUserId;
              if (!targetUserId) return false;

              const userPerms =
                get().userPermissions[
                  targetUserId
                ];
              if (!userPerms) return false;

              const permissions =
                userPerms.permissions;
              if (
                !permissions ||
                !Array.isArray(permissions)
              )
                return false;

              return permissions.includes(
                permissionCode
              );
            } catch (error) {
              console.error(
                "Error checking permission:",
                error
              );
              return false;
            }
          },

          hasAnyPermission: (
            permissionCodes: string[],
            userId?: string
          ) => {
            const targetUserId =
              userId || get().currentUserId;
            if (!targetUserId) return false;
            const userPerms =
              get().userPermissions[targetUserId];
            return (
              !!userPerms &&
              permissionCodes.some((code) =>
                userPerms.permissions.includes(
                  code
                )
              )
            );
          },

          hasAllPermissions: (
            permissionCodes: string[],
            userId?: string
          ) => {
            const targetUserId =
              userId || get().currentUserId;
            if (!targetUserId) return false;
            const userPerms =
              get().userPermissions[targetUserId];
            return (
              !!userPerms &&
              permissionCodes.every((code) =>
                userPerms.permissions.includes(
                  code
                )
              )
            );
          },

          isSuperadmin: (userId?: string) => {
            const targetUserId =
              userId || get().currentUserId;
            if (!targetUserId) return false;
            return (
              get().userRoles[targetUserId] ===
              "superadmin"
            );
          },

          isAdmin: (userId?: string) => {
            const targetUserId =
              userId || get().currentUserId;
            if (!targetUserId) return false;
            const role =
              get().userRoles[targetUserId];
            return (
              role === "admin" ||
              role === "superadmin"
            );
          },

          isUser: (userId?: string) => {
            const targetUserId =
              userId || get().currentUserId;
            if (!targetUserId) return false;
            const role =
              get().userRoles[targetUserId];
            return (
              role === "user" ||
              role === "admin" ||
              role === "superadmin"
            );
          },

          hasRole: (
            role: Role | Role[],
            userId?: string
          ) => {
            const targetUserId =
              userId || get().currentUserId;
            if (!targetUserId) return false;
            const userRole =
              get().userRoles[targetUserId];
            if (!userRole) return false;
            return Array.isArray(role)
              ? role.includes(userRole)
              : userRole === role;
          },

          setCurrentUser: async (
            userId: string
          ) => {
            set({ currentUserId: userId });
            try {
              const userPerms =
                await get().fetchUserPermissions(
                  userId
                );
              set({
                currentUserRole: userPerms.role,
                currentUserPermissions:
                  userPerms.permissions,
              });
            } catch (error) {
              console.error(
                "Failed to fetch current user permissions:",
                error
              );
            }
          },

          clearCurrentUser: () => {
            set({
              currentUserId: undefined,
              currentUserRole: undefined,
              currentUserPermissions: undefined,
            });
          },

          clearError: () => set({ error: null }),
          clearSuccessMessage: () =>
            set({ successMessage: null }),
          reset: () => set(initialState),
        }),
        {
          name: "persimmon-store",
          partialize: (state) => ({
            allPermissions: state.allPermissions,
            userPermissions:
              state.userPermissions,
            userRoles: state.userRoles,
            currentUserId: state.currentUserId,
            currentUserRole:
              state.currentUserRole,
            currentUserPermissions:
              state.currentUserPermissions,
          }),
        }
      ),
      { name: "PersimmonStore" }
    )
  );
