// lib/api/persimmon.api.ts
import api from "./api";
import {
  PermissionCheckResponse,
  Role,
  UserPermissionsResponse,
  AllPermissionsResponse,
  ChangeRoleRequest,
} from "../types/persimmon.types";

/* ---------------------------------------------
 * Helpers
 * ------------------------------------------- */

export const normalizePermissionsResponse = (
  data: any
): AllPermissionsResponse => {
  if (!data) {
    return {
      permissions: {},
      categories: {},
      total: 0,
      allPermissionsList: [],
      roles: {},
    };
  }

  const permissions: Record<string, string[]> =
    {};
  const categories: Record<string, string> = {};

  if (data.categories) {
    Object.entries(data.categories).forEach(
      ([key, value]: [string, any]) => {
        permissions[key] =
          value.permissions || [];
        categories[key] = value.name || key;
      }
    );
  }

  const allPermissionsList: string[] =
    data.allPermissions || [];

  const roles: Record<string, any> = {};
  if (data.roles) {
    Object.entries(data.roles).forEach(
      ([roleName, roleData]: [string, any]) => {
        roles[roleName] = {
          label: roleData.label,
          description: roleData.description,
          defaultPermissions:
            roleData.defaultPermissions || [],
        };
      }
    );
  }

  return {
    permissions,
    categories,
    total:
      data.metadata?.totalPermissions ??
      allPermissionsList.length,
    allPermissionsList,
    roles,
    metadata: {
      totalPermissions:
        data.metadata?.totalPermissions ??
        allPermissionsList.length,
      totalCategories:
        Object.keys(categories).length,
      totalRoles: Object.keys(roles).length,
    },
  };
};

/* ---------------------------------------------
 * Mock APIs (until backend is ready)
 * ------------------------------------------- */

const mockApi = {
  getUserPermissionStats: async (
    userId: string
  ) => {
    console.warn(
      "getUserPermissionStats not implemented — using mock data"
    );

    return {
      data: {
        totalPermissions: 28,
        userPermissionsCount: 0,
        directPermissions: 0,
        inheritedPermissions: 0,
        role: "user" as Role,
      },
    };
  },

  getUserAuditLogs: async (_userId: string) => {
    console.warn(
      "getUserAuditLogs not implemented — using mock data"
    );

    return { data: [] };
  },
};

/* ---------------------------------------------
 * Persimmon API
 * ------------------------------------------- */

export const persimmonApi = {
  /* -------- Permissions -------- */

  // GET /permissions/all/
  getAllPermissions: async () => {
    const response = await api.get<any>(
      "/permissions/all/"
    );
    return {
      data: normalizePermissionsResponse(
        response.data
      ),
    };
  },

  // GET /permissions/check/{userId}/{permissionCode}
  checkPermission: (
    userId: string,
    permissionCode: string
  ) =>
    api.get<PermissionCheckResponse>(
      `/permissions/check/${userId}/${permissionCode}`
    ),

  // GET /permissions/user/{userId}
  getUserPermissions: (userId: string) =>
    api.get<UserPermissionsResponse>(
      `/permissions/user/${userId}`
    ),

  /* -------- Mutations -------- */

  // POST /permissions/user/{userId}/grant
  grantPermission: (
    userId: string,
    data: { permission: string; reason?: string }
  ) =>
    api.post(
      `/permissions/user/${userId}/grant`,
      data
    ),

  // POST /permissions/user/{userId}/revoke
  revokePermission: (
    userId: string,
    data: { permission: string; reason?: string }
  ) =>
    api.post(
      `/permissions/user/${userId}/revoke`,
      data
    ),

  // POST /permissions/user/{userId}/reset
  resetPermissions: (
    userId: string,
    data: { reason?: string }
  ) =>
    api.post(
      `/permissions/user/${userId}/reset`,
      data
    ),

  // PUT /permissions/user/{userId}/role
  changeUserRole: (
    userId: string,
    data: ChangeRoleRequest
  ) =>
    api.put(
      `/permissions/user/${userId}/role`,
      data
    ),

  /* -------- Role shortcuts -------- */

  // POST /permissions/user/{userId}/promote/admin
  promoteToAdmin: (userId: string) =>
    api.post(
      `/permissions/user/${userId}/promote/admin`
    ),

  // POST /permissions/user/{userId}/demote/user
  demoteToUser: (userId: string) =>
    api.post(
      `/permissions/user/${userId}/demote/user`
    ),

  /* -------- Mocked -------- */

  getUserPermissionStats:
    mockApi.getUserPermissionStats,

  getUserAuditLogs: mockApi.getUserAuditLogs,
};
