// lib/store/superadmin.store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/lib/api/persimmon";
import { persimmonApi } from "@/lib/api/persimmon";

// ==================== INTERFACES ====================
export interface SuperadminUser extends User {
  lastLogin?: string;
  loginCount?: number;
  status: "active" | "inactive" | "suspended";
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  superadmins: number;
  admins: number;
  regularUsers: number;
}

export interface BulkActionRequest {
  userIds: string[];
  action:
    | "activate"
    | "deactivate"
    | "delete"
    | "promote"
    | "demote";
  reason?: string;
}

// ==================== STORE ====================
interface SuperadminState {
  // State
  users: SuperadminUser[];
  selectedUser: SuperadminUser | null;
  loading: boolean;
  error: string | null;

  // Filters
  filters: {
    role: "all" | "user" | "admin" | "superadmin";
    status:
      | "all"
      | "active"
      | "inactive"
      | "suspended";
    search: string;
  };

  // Pagination
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    usersPerPage: number;
  };

  // Stats
  stats: UserStats | null;

  // Actions
  fetchAllUsers: () => Promise<void>;
  selectUser: (
    user: SuperadminUser | null
  ) => void;
  updateUser: (
    userId: string,
    updates: Partial<SuperadminUser>
  ) => void;
  setFilters: (
    filters: Partial<SuperadminState["filters"]>
  ) => void;
  setPage: (page: number) => void;
  clearError: () => void;
  resetStore: () => void;
}

// Initial State
const initialState: SuperadminState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,

  filters: {
    role: "all",
    status: "all",
    search: "",
  },

  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    usersPerPage: 20,
  },

  stats: null,
  fetchAllUsers: function (): Promise<void> {
    throw new Error("Function not implemented.");
  },
  selectUser: function (
    user: SuperadminUser | null
  ): void {
    throw new Error("Function not implemented.");
  },
  updateUser: function (
    userId: string,
    updates: Partial<SuperadminUser>
  ): void {
    throw new Error("Function not implemented.");
  },
  setFilters: function (
    filters: Partial<SuperadminState["filters"]>
  ): void {
    throw new Error("Function not implemented.");
  },
  setPage: function (page: number): void {
    throw new Error("Function not implemented.");
  },
  clearError: function (): void {
    throw new Error("Function not implemented.");
  },
  resetStore: function (): void {
    throw new Error("Function not implemented.");
  },
};

// Create Store
const useSuperadminStore =
  create<SuperadminState>()(
    persist(
      (set, get) => ({
        ...initialState,

        // Fetch all users (simplified - in real app, call your API)
        fetchAllUsers: async () => {
          set({ loading: true, error: null });
          try {
            // Note: This should call your actual user API
            // For now, using persimmonApi for permission-related user data
            const token =
              localStorage.getItem("token");
            if (!token)
              throw new Error(
                "No authentication token"
              );

            // In a real app, you would have a separate user management API
            // This is a placeholder for the structure
            set({
              users: [], // Populate from your actual API
              loading: false,
            });
          } catch (error: any) {
            set({
              loading: false,
              error:
                error.message ||
                "Failed to fetch users",
            });
          }
        },

        // Select user
        selectUser: (user) => {
          set({ selectedUser: user });
        },

        // Update user locally (optimistic update)
        updateUser: (userId, updates) => {
          set((state) => ({
            users: state.users.map((user) =>
              user._id === userId
                ? { ...user, ...updates }
                : user
            ),
            selectedUser:
              state.selectedUser?._id === userId
                ? {
                    ...state.selectedUser,
                    ...updates,
                  }
                : state.selectedUser,
          }));
        },

        // Set filters
        setFilters: (filters) => {
          set((state) => ({
            filters: {
              ...state.filters,
              ...filters,
            },
            pagination: {
              ...state.pagination,
              currentPage: 1,
            },
          }));
        },

        // Set page
        setPage: (page) => {
          set((state) => ({
            pagination: {
              ...state.pagination,
              currentPage: page,
            },
          }));
        },

        // Clear error
        clearError: () => {
          set({ error: null });
        },

        // Reset store
        resetStore: () => {
          set(initialState);
        },
      }),
      {
        name: "superadmin-store",
        partialize: (state) => ({
          filters: state.filters,
          pagination: state.pagination,
        }),
      }
    )
  );

export default useSuperadminStore;
