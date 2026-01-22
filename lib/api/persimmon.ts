// lib/api/persimmon.ts
import api from './api';


export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  role: 'user' | 'admin' | 'superadmin';
  isActive: boolean;
  permissions: string[];
  social?: {
    twitter?: string;
    linkedin?: string;
  };
  address?: {
    street?: string;
    city?: string;
    country?: string;
  };
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
  createdBy?: string;
  id?: string;
}

export interface PermissionCheckResponse {
  success: boolean;
  hasPermission: boolean;
  permission: string;
  user: User;
}

export interface AllPermissionsResponse {
  success: boolean;
  permissions: {
    [key: string]: string;
  };
  roles: {
    USER: string;
    ADMIN: string;
    SUPERADMIN: string;
  };
  rolePermissions: {
    [key: string]: string;
  };
}

export interface GrantPermissionRequest {
  permission: string;
  reason: string;
}

export interface PermissionOperationResponse {
  success: boolean;
  message: string;
  user: User;
  oldRole?: string;
  newRole?: string;
}

// Main API functions
export const persimmonApi = {
  // 1. Get all permissions and roles
  getAllPermissions: async (): Promise<AllPermissionsResponse> => {
    const response = await api.get('/permissions/all/');
    return response.data;
  },

  // 2. Check if user has specific permission
  checkUserPermission: async (userId: string, permission: string): Promise<PermissionCheckResponse> => {
    const response = await api.get(`/permissions/check/${userId}/${permission}`);
    return response.data;
  },

  // 3. Get user permissions (from user object in check response)
  getUserPermissions: async (userId: string): Promise<PermissionCheckResponse> => {
    // Use check endpoint to get user data
    const response = await api.get(`/permissions/check/${userId}/view_all_users`);
    return response.data;
  },

  // 4. Grant permission to user
  grantPermission: async (userId: string, data: GrantPermissionRequest): Promise<PermissionOperationResponse> => {
    const response = await api.post(`/permissions/user/${userId}/grant`, data);
    return response.data;
  },

  // 5. Revoke permission from user
  revokePermission: async (userId: string, data: GrantPermissionRequest): Promise<PermissionOperationResponse> => {
    const response = await api.post(`/permissions/user/${userId}/revoke`, data);
    return response.data;
  },

  // 6. Reset all permissions for user
  resetPermissions: async (userId: string): Promise<PermissionOperationResponse> => {
    const response = await api.post(`/permissions/user/${userId}/reset`);
    return response.data;
  },

  // 7. Change user role
  changeUserRole: async (userId: string, data: { role: string; reason: string }): Promise<PermissionOperationResponse> => {
    const response = await api.post(`/permissions/user/${userId}/role`, data);
    return response.data;
  },

  // 8. Promote user to admin
  promoteToAdmin: async (userId: string, data: { reason: string }): Promise<PermissionOperationResponse> => {
    const response = await api.post(`/permissions/user/${userId}/promote/admin`, data);
    return response.data;
  },

  // 9. Demote admin to user
  demoteToUser: async (userId: string, data: { reason: string }): Promise<PermissionOperationResponse> => {
    const response = await api.post(`/permissions/user/${userId}/demote/user`, data);
    return response.data;
  },

  // Helper: Check current user's permission
  hasPermission: async (permission: string): Promise<boolean> => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (!user?._id) return false;
      
      const response = await persimmonApi.checkUserPermission(user._id, permission);
      return response.success && response.hasPermission;
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  },
};

// Helper functions for UI - Updated to accept undefined
export const permissionHelpers = {
  // Get all permission values from backend data
  getAllPermissionValues: (permissionsData: AllPermissionsResponse | null | undefined): string[] => {
    if (!permissionsData?.success || !permissionsData.permissions) return [];
    return Object.values(permissionsData.permissions);
  },

  // Get permissions with labels
  getPermissionsWithLabels: (permissionsData: AllPermissionsResponse | null | undefined): Array<{value: string, label: string}> => {
    if (!permissionsData?.success || !permissionsData.permissions) return [];
    
    return Object.entries(permissionsData.permissions).map(([key, value]) => ({
      value,
      label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }));
  },

  // Get permission label from value
  getPermissionLabel: (permission: string, permissionsData: AllPermissionsResponse | null | undefined): string => {
    if (!permissionsData?.success || !permissionsData.permissions) {
      return permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    
    const entry = Object.entries(permissionsData.permissions).find(([_, value]) => value === permission);
    return entry ? entry[0].replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : permission;
  },

  // Check if permission requires superadmin
  requiresSuperadmin: (permission: string, permissionsData: AllPermissionsResponse | null | undefined): boolean => {
    const superadminPermissions = [
      'manage_roles',
      'assign_permissions',
      'update_system_settings',
      'view_audit_logs',
    ];
    
    return superadminPermissions.includes(permission);
  },

  // Group permissions by category
  getPermissionsByCategory: (permissions: string[], permissionsData: AllPermissionsResponse | null | undefined): Record<string, string[]> => {
    const result: Record<string, string[]> = {};
    
    if (!permissionsData?.success) return result;
    
    const categories = {
      user_management: ['manage_users', 'deactivate_users', 'view_all_users'],
      content_management: ['manage_content', 'create_content', 'edit_content', 'delete_content', 'publish_content'],
      settings: ['manage_settings', 'update_system_settings', 'view_audit_logs'],
      roles_permissions: ['manage_roles', 'assign_permissions'],
      analytics: ['view_analytics', 'export_data'],
      notifications: ['send_notifications', 'manage_notifications'],
    };

    Object.entries(categories).forEach(([category, categoryPerms]) => {
      const matching = permissions.filter(p => categoryPerms.includes(p));
      if (matching.length > 0) {
        result[category] = matching;
      }
    });

    return result;
  },

  // Get category name
  getCategoryName: (category: string): string => {
    const names: Record<string, string> = {
      user_management: 'User Management',
      content_management: 'Content Management',
      settings: 'System Settings',
      roles_permissions: 'Roles & Permissions',
      analytics: 'Analytics',
      notifications: 'Notifications',
    };
    return names[category] || category.replace('_', ' ').toUpperCase();
  },

  // Get role label
  getRoleLabel: (role: string, permissionsData: AllPermissionsResponse | null | undefined): string => {
    if (!permissionsData?.success || !permissionsData.roles) {
      return role.charAt(0).toUpperCase() + role.slice(1);
    }
    
    const entry = Object.entries(permissionsData.roles).find(([_, value]) => value === role);
    return entry ? entry[0].replace(/_/g, ' ') : role;
  },

  // Get all roles
  getAllRoles: (permissionsData: AllPermissionsResponse | null | undefined): string[] => {
    if (!permissionsData?.success || !permissionsData.roles) return ['user', 'admin', 'superadmin'];
    return Object.values(permissionsData.roles);
  },
};

export default persimmonApi;