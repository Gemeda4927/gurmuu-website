// types/persimmon.types.ts

export type Permission = {
  id: string;
  name: string;
  code: string;
  description?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
};

export type Role =
  | "superadmin"
  | "admin"
  | "user";

export type PermissionCheckResponse = {
  hasPermission: boolean;
  userId: string;
  permissionCode: string;
  userRole: Role;
  message?: string;
  timestamp: string;
};

export type UserPermissionsResponse = {
  userId: string;
  role: Role;
  permissions: string[];
  directPermissions: string[];
  inheritedPermissions: string[];
  lastUpdated: string;
  updatedBy?: string;
};

export type AllPermissionsResponse = {
  permissions: Record<string, string[]>; // categoryKey -> permission codes
  categories: Record<string, string>; // categoryKey -> category name
  total: number;
  allPermissionsList: string[]; // flat list of all permissions
  roles: Record<
    string,
    {
      label: string;
      description: string;
      defaultPermissions: string[];
    }
  >;
  metadata?: {
    totalPermissions: number;
    totalCategories: number;
    totalRoles: number;
  };
};

export type PermissionStats = {
  totalPermissions: number;
  userPermissionsCount: number;
  directPermissions: number;
  inheritedPermissions: number;
  role: Role;
};

export type AuditLog = {
  id: string;
  userId: string;
  action: string;
  permission?: string;
  performedBy: string;
  reason?: string;
  timestamp: string;
};

export type GrantPermissionRequest = {
  permission: string;
  reason?: string;
};

export type RevokePermissionRequest = {
  permission: string;
  reason?: string;
};

export type ChangeRoleRequest = {
  role: Role;
  reason?: string;
};

export type ResetPermissionsRequest = {
  reason?: string;
};

export type PersimmonState = {
  // Data
  allPermissions: Permission[];
  userPermissions: Record<
    string,
    UserPermissionsResponse
  >; // userId -> permissions
  userRoles: Record<string, Role>; // userId -> role
  permissionChecks: Record<
    string,
    PermissionCheckResponse
  >; // cache for permission checks

  // UI State
  loading: boolean;
  error: string | null;
  successMessage: string | null;

  // Current User
  currentUserId?: string;
  currentUserRole?: Role;
  currentUserPermissions?: string[];
};

export type PersimmonStore = PersimmonState & {
  // Actions
  fetchAllPermissions: () => Promise<
    Permission[]
  >;
  checkPermission: (
    userId: string,
    permissionCode: string
  ) => Promise<PermissionCheckResponse>;
  fetchUserPermissions: (
    userId: string
  ) => Promise<UserPermissionsResponse>;

  // Superadmin Actions
  grantPermissionToUser: (
    userId: string,
    permissionCode: string
  ) => Promise<void>;
  revokePermissionFromUser: (
    userId: string,
    permissionCode: string
  ) => Promise<void>;
  resetUserPermissions: (
    userId: string
  ) => Promise<void>;
  changeUserRole: (
    userId: string,
    newRole: Role
  ) => Promise<void>;
  promoteToAdmin: (
    userId: string
  ) => Promise<void>;
  demoteToUser: (userId: string) => Promise<void>;

  // Permission checks (client-side)
  hasPermission: (
    permissionCode: string,
    userId?: string
  ) => boolean;
  hasAnyPermission: (
    permissionCodes: string[],
    userId?: string
  ) => boolean;
  hasAllPermissions: (
    permissionCodes: string[],
    userId?: string
  ) => boolean;

  // Role checks (client-side)
  isSuperadmin: (userId?: string) => boolean;
  isAdmin: (userId?: string) => boolean;
  isUser: (userId?: string) => boolean;
  hasRole: (
    role: Role | Role[],
    userId?: string
  ) => boolean;

  // Current user management
  setCurrentUser: (
    userId: string
  ) => Promise<void>;
  clearCurrentUser: () => void;

  // Store sync helpers
  setPermissionsData: (
    permissions: Permission[]
  ) => void;
  setUserPermissions: (
    userId: string,
    permissions: string[]
  ) => void;

  // Utility
  clearError: () => void;
  clearSuccessMessage: () => void;
  reset: () => void;
};
