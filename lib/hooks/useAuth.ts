"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  signupUser,
  SignupRequest,
  SignupResponse,
  loginUser,
  LoginRequest,
  LoginResponse,
  User as ApiUser,
} from "@/lib/api/auth";
import { useAuthStore, User as StoreUser } from "@/lib/store/auth.store";
import { useRouter } from "next/navigation";

// Helper function to convert API user to store user
const normalizeUser = (apiUser: ApiUser): StoreUser => {
  return {
    id: apiUser._id || '',  // Use _id as id (fallback to empty string)
    _id: apiUser._id,
    role: apiUser.role,
    name: apiUser.name,
    email: apiUser.email,
    phone: apiUser.phone,
    isActive: apiUser.isActive,
    avatar: apiUser.avatar,
    createdAt: apiUser.createdAt,
    permissions: apiUser.permissions || [],
  };
};

export const useSignup = () => {
  const queryClient = useQueryClient();
  const { setAuthData } = useAuthStore();

  return useMutation<
    SignupResponse,
    Error,
    SignupRequest
  >({
    mutationFn: signupUser,

    onMutate: (variables) => {
      console.log("Starting signup mutation:", {
        email: variables.email,
      });
    },

    onSuccess: (data) => {
      console.log("Signup successful:", data);

      if (data.success && data.token && data.user) {
        // Normalize user object
        const normalizedUser = normalizeUser(data.user);
        
        // Store auth data
        setAuthData(data.token, normalizedUser);

        // Update React Query cache
        queryClient.invalidateQueries({
          queryKey: ["user"],
        });
        queryClient.setQueryData(["auth"], {
          user: normalizedUser,
          token: data.token,
          isAuthenticated: true,
        });
      }
    },

    onError: (error) => {
      console.error("Signup error:", error.message);
    },

    onSettled: () => {
      console.log("Signup mutation settled");
    },
  });
};

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setAuthData } = useAuthStore();

  return useMutation<
    LoginResponse,
    Error,
    LoginRequest
  >({
    mutationFn: loginUser,

    onMutate: (variables) => {
      console.log("Starting login mutation:", {
        email: variables.email,
      });
    },

    onSuccess: (data) => {
      console.log("Login successful:", data);
      console.log("User permissions from API:", data.user?.permissions);

      if (data.success && data.token && data.user) {
        // Normalize user object
        const normalizedUser = normalizeUser(data.user);
        
        // Store auth data
        setAuthData(data.token, normalizedUser);

        // Update React Query cache
        queryClient.invalidateQueries({
          queryKey: ["user"],
        });
        queryClient.setQueryData(["auth"], {
          user: normalizedUser,
          token: data.token,
          isAuthenticated: true,
        });

        console.log("Permissions stored in auth store:", normalizedUser.permissions);

        // Redirect based on role
        if (data.user.role === "superadmin" || data.user.role === "admin") {
          router.push("/superadmin");
        } else {
          router.push("/dashboard");
        }
      }
    },

    onError: (error) => {
      console.error("Login error:", error.message);
    },

    onSettled: () => {
      console.log("Login mutation settled");
    },
  });
};

// Additional mutation for fetching user permissions
export const useFetchUserPermissions = () => {
  const queryClient = useQueryClient();
  const { user, setPermissions } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      if (!user?._id) {
        throw new Error("No user ID available");
      }
      
      // This would be your API call to fetch permissions
      // Replace with actual API endpoint
      const response = await fetch(`/api/users/${user._id}/permissions`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch permissions');
      }
      
      const data = await response.json();
      return data.permissions || [];
    },

    onSuccess: (permissions) => {
      console.log("Permissions fetched successfully:", permissions);
      setPermissions(permissions);
      
      // Update React Query cache
      queryClient.setQueryData(['user-permissions', user?._id], permissions);
    },

    onError: (error) => {
      console.error("Failed to fetch permissions:", error);
    }
  });
};

// Hook to check if user has permission
export const useCheckPermission = () => {
  const { hasPermission, user } = useAuthStore();

  const checkPermission = (permission: string): boolean => {
    if (!user) return false;
    
    // Superadmin always has all permissions
    if (user.role === 'superadmin') return true;
    
    // Check using the store's hasPermission method
    return hasPermission(permission);
  };

  const checkAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(checkPermission);
  };

  const checkAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(checkPermission);
  };

  return {
    checkPermission,
    checkAnyPermission,
    checkAllPermissions,
    userRole: user?.role,
    userId: user?._id,
    userName: user?.name,
    userEmail: user?.email,
  };
};

// Hook for permission-based access control
export const usePermissionGuard = () => {
  const router = useRouter();
  const { user, isAuthenticated, hasPermission } = useAuthStore();

  const protectRoute = (requiredPermissions: string[], redirectPath: string = '/dashboard'): boolean => {
    if (!isAuthenticated || !user) {
      router.push('/login');
      return false;
    }

    const hasRequiredPermissions = requiredPermissions.every(permission => 
      user.role === 'superadmin' || hasPermission(permission)
    );

    if (!hasRequiredPermissions) {
      console.log("Route protection failed:", {
        requiredPermissions,
        userRole: user.role,
        userPermissions: user.permissions,
        redirectPath
      });
      router.push(redirectPath);
      return false;
    }

    return true;
  };

  const protectByRole = (requiredRole: 'user' | 'admin' | 'superadmin', redirectPath: string = '/dashboard'): boolean => {
    if (!isAuthenticated || !user) {
      router.push('/login');
      return false;
    }

    const roleHierarchy = ['user', 'admin', 'superadmin'];
    const userRoleIndex = roleHierarchy.indexOf(user.role);
    const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);

    if (userRoleIndex < requiredRoleIndex) {
      console.log("Role protection failed:", {
        userRole: user.role,
        requiredRole,
        redirectPath
      });
      router.push(redirectPath);
      return false;
    }

    return true;
  };

  const protectSuperadminRoute = (): boolean => {
    return protectByRole('superadmin', '/dashboard');
  };

  const protectAdminRoute = (): boolean => {
    return protectByRole('admin', '/dashboard');
  };

  return {
    protectRoute,
    protectByRole,
    protectSuperadminRoute,
    protectAdminRoute,
    user,
    isAuthenticated,
    userRole: user?.role,
  };
};

// Hook for checking specific route permissions
export const useRoutePermissions = () => {
  const { hasPermission, user } = useAuthStore();

  // Define route permissions
  const routePermissions = {
    dashboard: ['view_dashboard'],
    superadmin: ['view_admin_panel'],
    users: ['view_users'],
    permissions: ['view_permissions'],
    events: ['view_events'],
    settings: ['view_settings'],
    manageUsers: ['manage_users'],
    managePermissions: ['manage_permissions'],
    manageEvents: ['manage_events'],
    manageSettings: ['manage_settings'],
  };

  // Check if user can access specific route
  const canAccess = (route: keyof typeof routePermissions): boolean => {
    if (!user) return false;
    
    // Superadmin can access everything
    if (user.role === 'superadmin') return true;
    
    // Check permissions for the route
    const requiredPermissions = routePermissions[route];
    return requiredPermissions.every(permission => hasPermission(permission));
  };

  // Get all accessible routes for current user
  const getAccessibleRoutes = (): (keyof typeof routePermissions)[] => {
    if (!user) return [];
    
    // Superadmin gets all routes
    if (user.role === 'superadmin') {
      return Object.keys(routePermissions) as (keyof typeof routePermissions)[];
    }
    
    // Filter routes based on permissions
    return (Object.keys(routePermissions) as (keyof typeof routePermissions)[]).filter(canAccess);
  };

  return {
    canAccess,
    getAccessibleRoutes,
    routePermissions,
    userRole: user?.role,
  };
};

// Hook for logging out
export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { clearAuthData } = useAuthStore();

  const logout = () => {
    console.log("Logging out user");
    
    // Clear auth store
    clearAuthData();
    
    // Clear React Query cache
    queryClient.clear();
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
    }
    
    // Redirect to login
    router.push('/login');
  };

  return logout;
};

// Hook for getting current user info
export const useCurrentUser = () => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  
  return {
    user,
    isAuthenticated,
    isLoading,
    isSuperadmin: user?.role === 'superadmin',
    isAdmin: user?.role === 'admin',
    isRegularUser: user?.role === 'user',
    permissions: user?.permissions || [],
    role: user?.role,
  };
};