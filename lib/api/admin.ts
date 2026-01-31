const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://gurmuu.onrender.com/api/v1";

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

// ================= PERMISSION CHECKING =================
export interface UserPermissionsResponse {
  success: boolean;
  permissions: string[];
  rolePermissions?: string[];
  directPermissions?: string[];
  message?: string;
}

// Get authorization header
const getAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

// ================= USER MANAGEMENT ENDPOINTS =================
// ✅ These endpoints match the admin's permissions

/**
 * Get all users - ✅ ADMIN CAN ACCESS (view_all_users)
 */
export const getAllUsers = async (
  token: string
): Promise<GetAllUsersResponse> => {
  console.log("Admin: Get All Users API Call:", {
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
  console.log("Admin: Get All Users API Response:", {
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
 * Get user by ID - ✅ ADMIN CAN ACCESS (view_all_users)
 */
export const getUserById = async (
  token: string,
  userId: string
): Promise<{ success: boolean; user: User }> => {
  console.log("Admin: Get User By ID API Call:", {
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
  console.log("Admin: Get User By ID API Response:", {
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
 * Create new user - ✅ ADMIN CAN ACCESS (manage_users)
 */
export const createUser = async (
  token: string,
  userData: CreateUserRequest
): Promise<CreateUserResponse> => {
  console.log("Admin: Create User API Call:", {
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
  console.log("Admin: Create User API Response:", {
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
 * Update user details - ✅ ADMIN CAN ACCESS (manage_users)
 */
export const updateUser = async (
  token: string,
  userId: string,
  userData: UpdateUserRequest
): Promise<UpdateUserResponse> => {
  console.log("Admin: Update User API Call:", {
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
  console.log("Admin: Update User API Response:", {
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
 * Deactivate user - ✅ ADMIN CAN ACCESS (deactivate_users)
 */
export const deactivateUser = async (
  token: string,
  userId: string
): Promise<UserStatusResponse> => {
  console.log("Admin: Deactivate User API Call:", {
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
  console.log("Admin: Deactivate User API Response:", {
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
 * Activate user - ✅ ADMIN CAN ACCESS (deactivate_users)
 */
export const activateUser = async (
  token: string,
  userId: string
): Promise<UserStatusResponse> => {
  console.log("Admin: Activate User API Call:", {
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
  console.log("Admin: Activate User API Response:", {
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
 * Get user permissions for admin view - ✅ ADMIN CAN ACCESS (view_all_users)
 */
export const getUserPermissionsForAdmin = async (
  token: string,
  userId: string
): Promise<UserPermissionsResponse> => {
  console.log(
    "Admin: Get User Permissions for Admin API Call:",
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
    "Admin: Get User Permissions for Admin API Response:",
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

// ================= PERMISSION CHECKING ENDPOINTS =================
// ✅ These are READ-ONLY permission checks that admin can use

/**
 * Get all available permissions - ✅ ADMIN CAN ACCESS (view only)
 */
export const getAllPermissions = async (
  token: string
): Promise<{
  success: boolean;
  permissions: Record<string, string>;
  roles: Record<string, string>;
  rolePermissions: Record<string, string>;
}> => {
  console.log("Admin: Get All Permissions API Call:", {
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
    "Admin: Get All Permissions API Response:",
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
 * Check if a user has a specific permission - ✅ ADMIN CAN ACCESS (view only)
 */
export const checkUserPermission = async (
  token: string,
  userId: string,
  permission: string
): Promise<{
  success: boolean;
  hasPermission: boolean;
  message?: string;
}> => {
  console.log("Admin: Check User Permission API Call:", {
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
    "Admin: Check User Permission API Response:",
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
 * Get specific user permissions - ✅ ADMIN CAN ACCESS (view only)
 */
export const getUserPermissions = async (
  token: string,
  userId: string
): Promise<UserPermissionsResponse> => {
  console.log("Admin: Get User Permissions API Call:", {
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
    "Admin: Get User Permissions API Response:",
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

