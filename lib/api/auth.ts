import { useAuthStore } from "../store/auth.store";
import api from "./api"; // Import your axios instance

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

export interface SignupResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
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

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface PermissionsResponse {
  success: boolean;
  permissions: string[];
  message?: string;
}

export const signupUser = async (
  userData: SignupRequest
): Promise<SignupResponse> => {
  console.log("Signup API Call:", {
    url: `/auth/signup`,
    data: { ...userData, password: "***" },
  });

  try {
    const response = await api.post(
      "/auth/signup",
      userData
    );
    const data = response.data;
    console.log("Signup API Response:", {
      status: response.status,
      data,
    });

    if (!data.success) {
      throw new Error(
        data.message || "Signup failed"
      );
    }

    // Store token if login is part of signup
    if (
      data.token &&
      typeof window !== "undefined"
    ) {
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );
    }

    return data;
  } catch (error: any) {
    console.error("Signup API Error:", error);
    throw new Error(
      error.response?.data?.message ||
        "Signup failed"
    );
  }
};

export const loginUser = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  console.log("Login API Call:", {
    url: `/auth/login`,
    data: { ...credentials, password: "***" },
  });

  try {
    const response = await api.post(
      "/auth/login",
      credentials
    );
    const data = response.data;
    console.log("Login API Response:", {
      status: response.status,
      data,
    });

    if (!data.success) {
      throw new Error(
        data.message || "Login failed"
      );
    }

    // Store token and user data
    if (typeof window !== "undefined") {
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );
      sessionStorage.setItem("token", data.token);
    }

    return data;
  } catch (error: any) {
    console.error("Login API Error:", error);
    throw new Error(
      error.response?.data?.message ||
        "Login failed"
    );
  }
};

export const verifyToken = async (): Promise<{
  success: boolean;
  user: User;
}> => {
  try {
    const response = await api.get(
      "/auth/verify"
    );
    const data = response.data;

    if (!data.success) {
      throw new Error(
        data.message ||
          "Token verification failed"
      );
    }

    return data;
  } catch (error: any) {
    console.error(
      "Token verification error:",
      error
    );
    throw new Error(
      error.response?.data?.message ||
        "Token verification failed"
    );
  }
};

export const getUserPermissions = async (
  userId: string
): Promise<PermissionsResponse> => {
  try {
    const response = await api.get(
      `/users/${userId}/permissions`
    );
    const data = response.data;

    if (!data.success) {
      throw new Error(
        data.message ||
          "Failed to fetch permissions"
      );
    }

    return data;
  } catch (error: any) {
    console.error(
      "Get permissions error:",
      error
    );
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch permissions"
    );
  }
};

export const getAllPermissions =
  async (): Promise<{
    success: boolean;
    permissions: Record<string, string>;
  }> => {
    try {
      const response = await api.get(
        "/permissions"
      );
      const data = response.data;

      if (!data.success) {
        throw new Error(
          data.message ||
            "Failed to fetch all permissions"
        );
      }

      return data;
    } catch (error: any) {
      console.error(
        "Get all permissions error:",
        error
      );
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch all permissions"
      );
    }
  };

export const updateUserPermissions = async (
  userId: string,
  permissions: string[]
): Promise<{
  success: boolean;
  message?: string;
}> => {
  try {
    const response = await api.put(
      `/users/${userId}/permissions`,
      { permissions }
    );
    const data = response.data;

    if (!data.success) {
      throw new Error(
        data.message ||
          "Failed to update permissions"
      );
    }

    return data;
  } catch (error: any) {
    console.error(
      "Update permissions error:",
      error
    );
    throw new Error(
      error.response?.data?.message ||
        "Failed to update permissions"
    );
  }
};

export const logoutUser = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
  }
};

// Hook for getting current user permissions
export const useCurrentUserPermissions = () => {
  const { user, isAuthenticated } =
    useAuthStore();

  if (!user || !isAuthenticated) {
    return {
      permissions: [],
      hasPermission: () => false,
      hasAnyPermission: () => false,
      hasAllPermissions: () => false,
      isLoading: false,
      error: null,
      refetch: () => Promise.resolve(),
    };
  }

  // This function will be used by React Query or similar
  const fetchPermissions = async (): Promise<
    string[]
  > => {
    try {
      const response = await getUserPermissions(
        user.id
      );
      return response.permissions;
    } catch (error) {
      console.error(
        "Failed to fetch permissions:",
        error
      );
      return user.permissions || []; // Fallback to user.permissions from auth store
    }
  };

  const hasPermission = (
    permission: string
  ): boolean => {
    return (user.permissions || []).includes(
      permission
    );
  };

  const hasAnyPermission = (
    permissions: string[]
  ): boolean => {
    const userPerms = user.permissions || [];
    return permissions.some((permission) =>
      userPerms.includes(permission)
    );
  };

  const hasAllPermissions = (
    permissions: string[]
  ): boolean => {
    const userPerms = user.permissions || [];
    return permissions.every((permission) =>
      userPerms.includes(permission)
    );
  };

  return {
    permissions: user.permissions || [],
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    userRole: user.role,
    userId: user._id,
    userName: user.name,
    fetchPermissions,
  };
};

// Helper function to check if user can access route
export const canAccessRoute = (
  user: User | null,
  requiredRole?: string,
  requiredPermissions?: string[]
): boolean => {
  if (!user) return false;

  // Check role
  if (requiredRole) {
    const roleHierarchy = [
      "user",
      "admin",
      "superadmin",
    ];
    const userRoleIndex = roleHierarchy.indexOf(
      user.role
    );
    const requiredRoleIndex =
      roleHierarchy.indexOf(requiredRole);

    if (userRoleIndex < requiredRoleIndex) {
      return false;
    }
  }

  // Check permissions
  if (
    requiredPermissions &&
    requiredPermissions.length > 0
  ) {
    const userPermissions =
      user.permissions || [];
    return requiredPermissions.every(
      (permission) =>
        userPermissions.includes(permission)
    );
  }

  return true;
};
