import api from "./api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://hayyuu.onrender.com/api/v1";

// ================= USER INTERFACES =================
export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "superadmin";
  phone?: string;
  avatar?: string;
  bio?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
  };
  address?: {
    street?: string;
    city?: string;
    country?: string;
  };
  isActive: boolean;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

// ================= USER MANAGEMENT =================
export interface GetAllUsersResponse {
  success: boolean;
  users: User[];
  total: number;
  page: number;
  limit: number;
  message?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin" | "superadmin";
  phone?: string;
  avatar?: string;
  bio?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
  };
  address?: {
    street?: string;
    city?: string;
    country?: string;
  };
}

export interface CreateUserResponse {
  success: boolean;
  user: User;
  message?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
  };
  address?: {
    street?: string;
    city?: string;
    country?: string;
  };
}

export interface UpdateUserResponse {
  success: boolean;
  user: User;
  message?: string;
}

export interface UserStatusResponse {
  success: boolean;
  user: User;
  message?: string;
}

// ================= PERMISSION MANAGEMENT =================
export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface GetAllPermissionsResponse {
  success: boolean;
  permissions: Permission[];
  message?: string;
}

export interface CheckPermissionResponse {
  success: boolean;
  hasPermission: boolean;
  message?: string;
}

export interface UserPermissionsResponse {
  success: boolean;
  permissions: string[];
  message?: string;
}

export interface GrantPermissionRequest {
  permission: string;
  reason: string;
}

export interface GrantPermissionResponse {
  success: boolean;
  user: User;
  message?: string;
}

export interface RevokePermissionRequest {
  permission: string;
  reason: string;
}

export interface RevokePermissionResponse {
  success: boolean;
  user: User;
  message?: string;
}

export interface ResetPermissionsRequest {
  reason: string;
}

export interface ResetPermissionsResponse {
  success: boolean;
  user: User;
  message?: string;
}

export interface ChangeRoleRequest {
  role: "user" | "admin" | "superadmin";
  reason: string;
}

export interface ChangeRoleResponse {
  success: boolean;
  user: User;
  message?: string;
}

export interface PromoteUserResponse {
  success: boolean;
  user: User;
  message?: string;
}

export interface DemoteUserResponse {
  success: boolean;
  user: User;
  message?: string;
}

// ================= SUPERADMIN API FUNCTIONS =================

// Get authorization header
const getAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

// ================= USER MANAGEMENT ENDPOINTS =================

/**
 * Get all users (Admin/Superadmin only)
 */
export const getAllUsers = async (
  token: string
): Promise<GetAllUsersResponse> => {
  console.log("Get All Users API Call:", {
    url: `${API_BASE_URL}/admin/users`,
  });

  const response = await fetch(
    `${API_BASE_URL}/admin/users`,
    {
      method: "GET",
      headers: getAuthHeaders(token),
    }
  );

  const data = await response.json();
  console.log("Get All Users API Response:", {
    status: response.status,
    data,
  });

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Failed to fetch users"
    );
  }

  return data;
};

/**
 * Get user by ID (Admin/Superadmin only)
 */
export const getUserById = async (
  token: string,
  userId: string
): Promise<{ success: boolean; user: User }> => {
  console.log("Get User By ID API Call:", {
    url: `${API_BASE_URL}/admin/users/${userId}`,
  });

  const response = await fetch(
    `${API_BASE_URL}/admin/users/${userId}`,
    {
      method: "GET",
      headers: getAuthHeaders(token),
    }
  );

  const data = await response.json();
  console.log("Get User By ID API Response:", {
    status: response.status,
    data,
  });

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Failed to fetch user"
    );
  }

  return data;
};

/**
 * Create new user (Admin/Superadmin only)
 */
export const createUser = async (
  token: string,
  userData: CreateUserRequest
): Promise<CreateUserResponse> => {
  console.log("Create User API Call:", {
    url: `${API_BASE_URL}/admin/users`,
    data: { ...userData, password: "***" },
  });

  const response = await fetch(
    `${API_BASE_URL}/admin/users`,
    {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(userData),
    }
  );

  const data = await response.json();
  console.log("Create User API Response:", {
    status: response.status,
    data,
  });

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Failed to create user"
    );
  }

  return data;
};

/**
 * Update user details (Admin/Superadmin only)
 */
export const updateUser = async (
  token: string,
  userId: string,
  userData: UpdateUserRequest
): Promise<UpdateUserResponse> => {
  console.log("Update User API Call:", {
    url: `${API_BASE_URL}/admin/users/${userId}`,
    data: userData,
  });

  const response = await fetch(
    `${API_BASE_URL}/admin/users/${userId}`,
    {
      method: "PUT",
      headers: getAuthHeaders(token),
      body: JSON.stringify(userData),
    }
  );

  const data = await response.json();
  console.log("Update User API Response:", {
    status: response.status,
    data,
  });

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Failed to update user"
    );
  }

  return data;
};

/**
 * Deactivate user (Admin/Superadmin only)
 */
export const deactivateUser = async (
  token: string,
  userId: string
): Promise<UserStatusResponse> => {
  console.log("Deactivate User API Call:", {
    url: `${API_BASE_URL}/admin/users/${userId}/deactivate`,
  });

  const response = await fetch(
    `${API_BASE_URL}/admin/users/${userId}/deactivate`,
    {
      method: "PUT",
      headers: getAuthHeaders(token),
    }
  );

  const data = await response.json();
  console.log("Deactivate User API Response:", {
    status: response.status,
    data,
  });

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Failed to deactivate user"
    );
  }

  return data;
};

/**
 * Activate user (Admin/Superadmin only)
 */
export const activateUser = async (
  token: string,
  userId: string
): Promise<UserStatusResponse> => {
  console.log("Activate User API Call:", {
    url: `${API_BASE_URL}/admin/users/${userId}/activate`,
  });

  const response = await fetch(
    `${API_BASE_URL}/admin/users/${userId}/activate`,
    {
      method: "PUT",
      headers: getAuthHeaders(token),
    }
  );

  const data = await response.json();
  console.log("Activate User API Response:", {
    status: response.status,
    data,
  });

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Failed to activate user"
    );
  }

  return data;
};

/**
 * Delete user permanently (Superadmin only)
 */
export const deleteUser = async (
  token: string,
  userId: string
): Promise<{
  success: boolean;
  message: string;
}> => {
  console.log("Delete User API Call:", {
    url: `${API_BASE_URL}/admin/users/${userId}`,
  });

  const response = await fetch(
    `${API_BASE_URL}/admin/users/${userId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(token),
    }
  );

  const data = await response.json();
  console.log("Delete User API Response:", {
    status: response.status,
    data,
  });

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Failed to delete user"
    );
  }

  return data;
};

// ================= PERMISSION MANAGEMENT ENDPOINTS =================

/**
 * Get all available permissions
 */
export const getAllPermissions = async (
  token: string
): Promise<GetAllPermissionsResponse> => {
  console.log("Get All Permissions API Call:", {
    url: `${API_BASE_URL}/permissions/all`,
  });

  const response = await fetch(
    `${API_BASE_URL}/permissions/all`,
    {
      method: "GET",
      headers: getAuthHeaders(token),
    }
  );

  const data = await response.json();
  console.log(
    "Get All Permissions API Response:",
    { status: response.status, data }
  );

  if (!response.ok || !data.success) {
    throw new Error(
      data.message ||
        "Failed to fetch permissions"
    );
  }

  return data;
};

/**
 * Check if a user has a specific permission
 */
export const checkUserPermission = async (
  token: string,
  userId: string,
  permission: string
): Promise<CheckPermissionResponse> => {
  console.log("Check User Permission API Call:", {
    url: `${API_BASE_URL}/permissions/check/${userId}/${permission}`,
  });

  const response = await fetch(
    `${API_BASE_URL}/permissions/check/${userId}/${permission}`,
    {
      method: "GET",
      headers: getAuthHeaders(token),
    }
  );

  const data = await response.json();
  console.log(
    "Check User Permission API Response:",
    { status: response.status, data }
  );

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Failed to check permission"
    );
  }

  return data;
};

/**
 * Get specific user permissions
 */
export const getUserPermissions = async (
  token: string,
  userId: string
): Promise<UserPermissionsResponse> => {
  console.log("Get User Permissions API Call:", {
    url: `${API_BASE_URL}/permissions/check/${userId}/grant`,
  });

  const response = await fetch(
    `${API_BASE_URL}/permissions/check/${userId}/grant`,
    {
      method: "GET",
      headers: getAuthHeaders(token),
    }
  );

  const data = await response.json();
  console.log(
    "Get User Permissions API Response:",
    { status: response.status, data }
  );

  if (!response.ok || !data.success) {
    throw new Error(
      data.message ||
        "Failed to fetch user permissions"
    );
  }

  return data;
};

// ================= SUPERADMIN-ONLY PERMISSION ENDPOINTS =================

/**
 * Grant a permission to a user (Superadmin only)
 */
export const grantPermission = async (
  token: string,
  userId: string,
  request: GrantPermissionRequest
): Promise<GrantPermissionResponse> => {
  console.log("Grant Permission API Call:", {
    url: `${API_BASE_URL}/permissions/user/${userId}/grant`,
    data: request,
  });

  const response = await fetch(
    `${API_BASE_URL}/permissions/user/${userId}/grant`,
    {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(request),
    }
  );

  const data = await response.json();
  console.log("Grant Permission API Response:", {
    status: response.status,
    data,
  });

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Failed to grant permission"
    );
  }

  return data;
};

/**
 * Revoke a permission from a user (Superadmin only)
 */

export const revokePermission = async (
  token: string,
  userId: string,
  request: GrantPermissionRequest
): Promise<GrantPermissionResponse> => {
  console.log("Grant Permission API Call:", {
    url: `${API_BASE_URL}/permissions/user/${userId}/revoke`,
    data: request,
  });

  const response = await fetch(
    `${API_BASE_URL}/permissions/user/${userId}/revoke`,
    {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(request),
    }
  );

  const data = await response.json();
  console.log("Grant Permission API Response:", {
    status: response.status,
    data,
  });

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Failed to grant permission"
    );
  }

  return data;
};


/**
 * Reset all permissions for a user (Superadmin only)
 */
export const resetUserPermissions = async (
  token: string,
  userId: string,
  request: ResetPermissionsRequest
): Promise<ResetPermissionsResponse> => {
  console.log("Reset Permissions API Call:", {
    url: `${API_BASE_URL}/permissions/user/${userId}/reset`,
    data: request,
  });

  const response = await fetch(
    `${API_BASE_URL}/permissions/user/${userId}/reset`,
    {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(request),
    }
  );

  const data = await response.json();
  console.log("Reset Permissions API Response:", {
    status: response.status,
    data,
  });

  if (!response.ok || !data.success) {
    throw new Error(
      data.message ||
        "Failed to reset permissions"
    );
  }

  return data;
};

/**
 * Change user role (Superadmin only)
 */
export const changeUserRole = async (
  token: string,
  userId: string,
  request: ChangeRoleRequest
): Promise<ChangeRoleResponse> => {
  console.log("Change User Role API Call:", {
    url: `${API_BASE_URL}/permissions/user/${userId}/role`,
    data: request,
  });

  const response = await fetch(
    `${API_BASE_URL}/permissions/user/${userId}/role`,
    {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(request),
    }
  );

  const data = await response.json();
  console.log("Change User Role API Response:", {
    status: response.status,
    data,
  });

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Failed to change user role"
    );
  }

  return data;
};

/**
 * Promote user to admin (Superadmin only)
 */
export const promoteToAdmin = async (
  token: string,
  userId: string,
  reason: string
): Promise<PromoteUserResponse> => {
  console.log("Promote to Admin API Call:", {
    url: `${API_BASE_URL}/permissions/user/${userId}/promote/admin`,
    data: { reason },
  });

  const response = await fetch(
    `${API_BASE_URL}/permissions/user/${userId}/promote/admin`,
    {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify({ reason }),
    }
  );

  const data = await response.json();
  console.log("Promote to Admin API Response:", {
    status: response.status,
    data,
  });

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Failed to promote user"
    );
  }

  return data;
};

/**
 * Demote admin to user (Superadmin only)
 */
export const demoteToUser = async (
  token: string,
  userId: string,
  reason: string
): Promise<DemoteUserResponse> => {
  console.log("Demote to User API Call:", {
    url: `${API_BASE_URL}/permissions/user/${userId}/demote/user`,
    data: { reason },
  });

  const response = await fetch(
    `${API_BASE_URL}/permissions/user/${userId}/demote/user`,
    {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify({ reason }),
    }
  );

  const data = await response.json();
  console.log("Demote to User API Response:", {
    status: response.status,
    data,
  });

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Failed to demote user"
    );
  }

  return data;
};

/**
 * Get user permissions for admin view (Admin/Superadmin only)
 */
export const getUserPermissionsForAdmin = async (
  token: string,
  userId: string
): Promise<UserPermissionsResponse> => {
  console.log(
    "Get User Permissions for Admin API Call:",
    {
      url: `${API_BASE_URL}/admin/users/${userId}/permissions`,
    }
  );

  const response = await fetch(
    `${API_BASE_URL}/admin/users/${userId}/permissions`,
    {
      method: "GET",
      headers: getAuthHeaders(token),
    }
  );

  const data = await response.json();
  console.log(
    "Get User Permissions for Admin API Response:",
    { status: response.status, data }
  );

  if (!response.ok || !data.success) {
    throw new Error(
      data.message ||
        "Failed to fetch user permissions"
    );
  }

  return data;
};
