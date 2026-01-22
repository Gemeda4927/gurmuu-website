import useAuthStore from "../store/auth.store";
import { usePersimmonStore } from "../store/persimmon.store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://gurmuu.onrender.com/api/v1';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'superadmin';
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

export const signupUser = async (userData: SignupRequest): Promise<SignupResponse> => {
  console.log('Signup API Call:', {
    url: `${API_BASE_URL}/auth/signup`,
    data: { ...userData, password: '***' } 
  });

  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  console.log('Signup API Response:', { status: response.status, data });

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Signup failed');
  }

  return data;
};

export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  console.log('Login API Call:', {
    url: `${API_BASE_URL}/auth/login`,
    data: { ...credentials, password: '***' }
  });

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();
  console.log('Login API Response:', { status: response.status, data });

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Login failed');
  }

  return data;
};

export const verifyToken = async (token: string): Promise<{success: boolean; user: User}> => {
  const response = await fetch(`${API_BASE_URL}/auth/verify`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();
  
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Token verification failed');
  }

  return data;
};

export const useCurrentUserPermissions = () => {
  const { user } = useAuthStore();
  const store = usePersimmonStore();
  
  if (!user) return { permissions: [], rolePermissions: [] };
  
  // Get role permissions
  const rolePerms = Permissions[user.role as keyof typeof ROLES] || [];
  // Get custom permissions from store
  const customPerms = store.getUserPermissions(user.id) || [];
  
  // Merge and remove duplicates
  const allPerms = Array.from(new Set([...rolePerms, ...customPerms]));
  
  return {
    permissions: allPerms,
    rolePermissions: rolePerms,
    customPermissions: customPerms,
    count: allPerms.length,
  };
};