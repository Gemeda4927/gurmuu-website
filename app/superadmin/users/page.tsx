"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Search,
  UserPlus,
  Download,
  RefreshCw,
  Filter,
  Shield,
  UserCheck,
  UserX,
  Activity,
  TrendingUp,
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useGetAllUsers,
  useDeleteUser,
  useActivateUser,
  useDeactivateUser,
  usePromoteToAdmin,
  useDemoteToUser,
  useSuperadminStatus,
  useGetUserStats,
} from "@/lib/hooks/useSuperadmin";
import DeleteConfirmModal from "../../../components/superadmin/DeleteConfirmModal";
import StatusToggleModal from "../../../components/superadmin/StatusToggleModal";
import RoleChangeModal from "../../../components/superadmin/RoleChangeModal";
import CreateUserModal from "../../../components/superadmin/CreateUserModal";
import ExportModal from "../../../components/superadmin/ExportModal";

export default function UsersPage() {
  const router = useRouter();
  const {
    canDeleteUsers,
    canChangeRoles,
    isSuperadmin,
  } = useSuperadminStatus();

  // Queries
  const {
    data: usersData,
    isLoading,
    error,
    refetch,
  } = useGetAllUsers();
  const { data: statsData } = useGetUserStats();

  // Mutations
  const deleteUserMutation = useDeleteUser();
  const activateUserMutation = useActivateUser();
  const deactivateUserMutation =
    useDeactivateUser();
  const promoteMutation = usePromoteToAdmin();
  const demoteMutation = useDemoteToUser();

  // State
  const [searchTerm, setSearchTerm] =
    useState("");
  const [filters, setFilters] = useState({
    role: "all",
    status: "all",
  });
  const [selectedUsers, setSelectedUsers] =
    useState<Set<string>>(new Set());
  const [showCreateModal, setShowCreateModal] =
    useState(false);
  const [showExportModal, setShowExportModal] =
    useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Modals state
  const [modalState, setModalState] = useState({
    delete: { isOpen: false, user: null as any },
    status: { isOpen: false, user: null as any },
    role: { isOpen: false, user: null as any },
  });

  // Filter users
  const filteredUsers = useMemo(() => {
    if (!usersData?.users) return [];

    return usersData.users.filter((user) => {
      // Search filter
      if (searchTerm) {
        const searchLower =
          searchTerm.toLowerCase();
        const matchesSearch =
          user.name
            .toLowerCase()
            .includes(searchLower) ||
          user.email
            .toLowerCase()
            .includes(searchLower) ||
          (user.phone &&
            user.phone
              .toLowerCase()
              .includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Role filter
      if (
        filters.role !== "all" &&
        user.role !== filters.role
      ) {
        return false;
      }

      // Status filter
      if (filters.status !== "all") {
        const isActive = user.isActive;
        if (
          filters.status === "active" &&
          !isActive
        )
          return false;
        if (
          filters.status === "inactive" &&
          isActive
        )
          return false;
      }

      return true;
    });
  }, [usersData?.users, searchTerm, filters]);

  // Pagination
  const totalPages = Math.ceil(
    filteredUsers.length / itemsPerPage
  );
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(
      startIndex,
      startIndex + itemsPerPage
    );
  }, [filteredUsers, currentPage, itemsPerPage]);

  // Handle user selection
  const handleSelectUser = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleSelectAll = () => {
    if (
      selectedUsers.size === paginatedUsers.length
    ) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(
        new Set(
          paginatedUsers.map((user) => user._id)
        )
      );
    }
  };

  // Handle delete
  const handleDelete = (user: any) => {
    setModalState({
      ...modalState,
      delete: { isOpen: true, user },
    });
  };

  const confirmDelete = async () => {
    if (modalState.delete.user) {
      try {
        await deleteUserMutation.mutateAsync(
          modalState.delete.user._id
        );
        setModalState({
          ...modalState,
          delete: { isOpen: false, user: null },
        });
        setSelectedUsers(new Set());
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  // Handle status toggle
  const handleStatusToggle = (user: any) => {
    setModalState({
      ...modalState,
      status: { isOpen: true, user },
    });
  };

  const confirmStatusToggle = async () => {
    const user = modalState.status.user;
    if (user) {
      try {
        if (user.isActive) {
          await deactivateUserMutation.mutateAsync(
            user._id
          );
        } else {
          await activateUserMutation.mutateAsync(
            user._id
          );
        }
        setModalState({
          ...modalState,
          status: {
            isOpen: false,
            user: null,
          },
        });
      } catch (error) {
        console.error("Failed to toggle status:", error);
      }
    }
  };

  // Handle role change
  const handleRoleChange = (user: any) => {
    setModalState({
      ...modalState,
      role: { isOpen: true, user },
    });
  };

  const confirmRoleChange = async (
    newRole: "user" | "admin"
  ) => {
    const user = modalState.role.user;
    if (user && canChangeRoles) {
      try {
        if (
          newRole === "admin" &&
          user.role === "user"
        ) {
          await promoteMutation.mutateAsync({
            userId: user._id,
            reason: "Promoted by superadmin",
          });
        } else if (
          newRole === "user" &&
          user.role === "admin"
        ) {
          await demoteMutation.mutateAsync({
            userId: user._id,
            reason: "Demoted by superadmin",
          });
        }
        setModalState({
          ...modalState,
          role: {
            isOpen: false,
            user: null,
          },
        });
      } catch (error) {
        console.error("Failed to change role:", error);
      }
    }
  };

  // Bulk actions
  const handleBulkDelete = async () => {
    if (
      selectedUsers.size === 0 ||
      !canDeleteUsers
    )
      return;

    try {
      const deletePromises = Array.from(
        selectedUsers
      ).map((userId) =>
        deleteUserMutation.mutateAsync(userId)
      );
      await Promise.all(deletePromises);
      setSelectedUsers(new Set());
    } catch (error) {
      console.error("Bulk delete failed:", error);
    }
  };

  const handleBulkActivate = async () => {
    if (selectedUsers.size === 0) return;

    try {
      const activatePromises = Array.from(
        selectedUsers
      ).map((userId) =>
        activateUserMutation.mutateAsync(userId)
      );
      await Promise.all(activatePromises);
      setSelectedUsers(new Set());
    } catch (error) {
      console.error("Bulk activate failed:", error);
    }
  };

  const handleBulkDeactivate = async () => {
    if (selectedUsers.size === 0) return;

    try {
      const deactivatePromises = Array.from(
        selectedUsers
      ).map((userId) =>
        deactivateUserMutation.mutateAsync(userId)
      );
      await Promise.all(deactivatePromises);
      setSelectedUsers(new Set());
    } catch (error) {
      console.error("Bulk deactivate failed:", error);
    }
  };

  // User action handlers
  const handleViewUser = (user: any) => {
    router.push(`/superadmin/users/${user._id}`);
  };

  const handleEditUser = (user: any) => {
    router.push(
      `/superadmin/users/${user._id}/edit`
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(
      dateString
    ).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Loading and error states
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-gray-900 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading users...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-red-100 rounded-full animate-ping"></div>
            <AlertCircle className="w-20 h-20 text-red-500 relative" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Failed to load users
          </h3>
          <p className="text-gray-600 mb-6">
            {error.message || "Something went wrong"}
          </p>
          <button
            onClick={() => refetch()}
            className="px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                User Management
              </h1>
              <p className="text-gray-600 mt-2 text-sm md:text-base">
                Manage all user accounts, roles, and permissions
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => refetch()}
                className="p-3 border border-gray-300 rounded-xl hover:bg-white transition-all duration-200 hover:shadow-md"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() =>
                  setShowCreateModal(true)
                }
                className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Add User
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {statsData?.stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                title: "Total Users",
                value: statsData.stats.totalUsers,
                icon: Users,
                color: "blue",
                change: "+12% from last month",
                trend: "up",
              },
              {
                title: "Active Users",
                value: statsData.stats.activeUsers,
                icon: UserCheck,
                color: "green",
                change: `${Math.round(
                  (statsData.stats.activeUsers /
                    statsData.stats.totalUsers) *
                    100
                )}% active rate`,
                trend: "up",
              },
              {
                title: "Administrators",
                value: statsData.stats.admins,
                icon: Shield,
                color: "purple",
                change: `${statsData.stats.superadmins} superadmins`,
                trend: "neutral",
              },
              {
                title: "Inactive Users",
                value: statsData.stats.inactiveUsers,
                icon: UserX,
                color: "red",
                change: "Needs attention",
                trend: "down",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-xl bg-${stat.color}-50`}
                  >
                    <stat.icon
                      className={`w-7 h-7 text-${stat.color}-600`}
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  {stat.trend === "up" && (
                    <TrendingUp className="w-4 h-4 mr-1 text-green-600" />
                  )}
                  <span
                    className={
                      stat.trend === "up"
                        ? "text-green-600"
                        : stat.trend === "down"
                        ? "text-red-600"
                        : "text-gray-600"
                    }
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Search and Filter Bar */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <div className="relative max-w-xl">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(
                        e.target.value
                      )
                    }
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-gray-50"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="relative">
                  <select
                    value={filters.role}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        role: e.target.value,
                      })
                    }
                    className="appearance-none border border-gray-300 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-gray-50"
                  >
                    <option value="all">
                      All Roles
                    </option>
                    <option value="superadmin">
                      Superadmin
                    </option>
                    <option value="admin">
                      Admin
                    </option>
                    <option value="user">
                      User
                    </option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <UserIcon className="w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div className="relative">
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        status: e.target.value,
                      })
                    }
                    className="appearance-none border border-gray-300 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-gray-50"
                  >
                    <option value="all">
                      All Status
                    </option>
                    <option value="active">
                      Active
                    </option>
                    <option value="inactive">
                      Inactive
                    </option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <Activity className="w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <button
                  onClick={() =>
                    setShowExportModal(true)
                  }
                  className="inline-flex items-center px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.size > 0 && (
            <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-gray-900">
                    {selectedUsers.size} user
                    {selectedUsers.size > 1
                      ? "s"
                      : ""}{" "}
                    selected
                  </span>
                </div>
                <div className="flex items-center flex-wrap gap-2">
                  <button
                    onClick={handleBulkActivate}
                    className="px-4 py-2 text-sm bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:opacity-90 transition-all font-medium"
                  >
                    Activate
                  </button>
                  <button
                    onClick={handleBulkDeactivate}
                    className="px-4 py-2 text-sm bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg hover:opacity-90 transition-all font-medium"
                  >
                    Deactivate
                  </button>
                  {canDeleteUsers && (
                    <button
                      onClick={handleBulkDelete}
                      className="px-4 py-2 text-sm bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg hover:opacity-90 transition-all font-medium"
                    >
                      Delete
                    </button>
                  )}
                  <button
                    onClick={() =>
                      setSelectedUsers(new Set())
                    }
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-4 px-6 text-left w-12">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={
                          selectedUsers.size ===
                            paginatedUsers.length &&
                          paginatedUsers.length > 0
                        }
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-gray-900 focus:ring-gray-900 h-5 w-5"
                      />
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Joined Date
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-16 px-6 text-center"
                    >
                      <div className="max-w-md mx-auto text-center">
                        <div className="relative w-20 h-20 mx-auto mb-6">
                          <div className="absolute inset-0 bg-gray-100 rounded-full"></div>
                          <Users className="w-12 h-12 text-gray-400 relative top-4 left-4" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          No users found
                        </h3>
                        <p className="text-gray-600 mb-6">
                          {searchTerm ||
                          filters.role !==
                            "all" ||
                          filters.status !== "all"
                            ? "Try adjusting your search or filters"
                            : "No users in the system yet"}
                        </p>
                        <button
                          onClick={() =>
                            setShowCreateModal(
                              true
                            )
                          }
                          className="px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl font-medium"
                        >
                          Add First User
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50/80 transition-colors duration-150"
                    >
                      <td className="py-4 px-6">
                        <input
                          type="checkbox"
                          checked={selectedUsers.has(
                            user._id
                          )}
                          onChange={() =>
                            handleSelectUser(
                              user._id
                            )
                          }
                          className="rounded border-gray-300 text-gray-900 focus:ring-gray-900 h-5 w-5"
                        />
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="h-11 w-11 flex-shrink-0 relative">
                            <img
                              className="h-11 w-11 rounded-xl object-cover ring-2 ring-white"
                              src={
                                user.avatar ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
                              }
                              alt={user.name}
                            />
                            <div
                              className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${
                                user.isActive
                                  ? "bg-green-500"
                                  : "bg-gray-400"
                              }`}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900 flex items-center">
                              {user.name}
                              {user.role ===
                                "superadmin" && (
                                <span className="ml-2 text-xs px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full">
                                  👑
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                              <Mail className="w-3.5 h-3.5 mr-2 opacity-60" />
                              {user.email}
                            </div>
                            {user.phone && (
                              <div className="text-xs text-gray-500 flex items-center mt-1">
                                <Phone className="w-3.5 h-3.5 mr-2 opacity-60" />
                                {user.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-2">
                          <span
                            className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium ${
                              user.role ===
                              "superadmin"
                                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                                : user.role ===
                                  "admin"
                                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                                : "bg-gradient-to-r from-gray-500 to-gray-600 text-white"
                            }`}
                          >
                            {user.role ===
                              "superadmin" && (
                              <Shield className="w-3.5 h-3.5 mr-1.5" />
                            )}
                            {user.role === "admin" && (
                              <Shield className="w-3.5 h-3.5 mr-1.5" />
                            )}
                            {user.role === "user" && (
                              <UserIcon className="w-3.5 h-3.5 mr-1.5" />
                            )}
                            {user.role
                              .charAt(0)
                              .toUpperCase() +
                              user.role.slice(1)}
                          </span>
                          <div className="text-xs text-gray-500">
                            {user.permissions?.length || 0}{" "}
                            permission
                            {user.permissions?.length !== 1
                              ? "s"
                              : ""}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium ${
                            user.isActive
                              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                              : "bg-gradient-to-r from-red-500 to-rose-500 text-white"
                          }`}
                        >
                          {user.isActive ? (
                            <>
                              <UserCheck className="w-3.5 h-3.5 mr-1.5" />
                              Active
                            </>
                          ) : (
                            <>
                              <UserX className="w-3.5 h-3.5 mr-1.5" />
                              Inactive
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {formatDate(
                            user.createdAt
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Updated{" "}
                          {formatDate(user.updatedAt)}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() =>
                              handleViewUser(user)
                            }
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                            title="View Details"
                          >
                            <Eye className="w-4.5 h-4.5" />
                          </button>
                          <button
                            onClick={() =>
                              handleEditUser(user)
                            }
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                            title="Edit User"
                          >
                            <Edit className="w-4.5 h-4.5" />
                          </button>
                          <button
                            onClick={() =>
                              handleStatusToggle(
                                user
                              )
                            }
                            className={`p-2 rounded-xl transition-all duration-200 ${
                              user.isActive
                                ? "text-gray-600 hover:text-red-600 hover:bg-red-50"
                                : "text-gray-600 hover:text-green-600 hover:bg-green-50"
                            }`}
                            title={
                              user.isActive
                                ? "Deactivate"
                                : "Activate"
                            }
                          >
                            {user.isActive ? (
                              <UserX className="w-4.5 h-4.5" />
                            ) : (
                              <UserCheck className="w-4.5 h-4.5" />
                            )}
                          </button>
                          {canChangeRoles &&
                            user.role !==
                              "superadmin" && (
                              <button
                                onClick={() =>
                                  handleRoleChange(
                                    user
                                  )
                                }
                                className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200"
                                title="Change Role"
                              >
                                <Shield className="w-4.5 h-4.5" />
                              </button>
                            )}
                          {canDeleteUsers &&
                            user.role !==
                              "superadmin" && (
                              <button
                                onClick={() =>
                                  handleDelete(
                                    user
                                  )
                                }
                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                                title="Delete User"
                              >
                                <Trash2 className="w-4.5 h-4.5" />
                              </button>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredUsers.length > 0 && (
            <div className="px-6 py-5 border-t border-gray-200 bg-gray-50/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-gray-700">
                  <span className="font-medium">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </span>
                  -
                  <span className="font-medium">
                    {Math.min(
                      currentPage * itemsPerPage,
                      filteredUsers.length
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">
                    {filteredUsers.length}
                  </span>{" "}
                  users
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.max(prev - 1, 1)
                      )
                    }
                    disabled={currentPage === 1}
                    className="p-2.5 border border-gray-300 rounded-xl hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Previous"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  {Array.from(
                    { length: totalPages },
                    (_, i) => i + 1
                  )
                    .slice(
                      Math.max(0, currentPage - 3),
                      Math.min(totalPages, currentPage + 2)
                    )
                    .map((page) => (
                      <button
                        key={page}
                        onClick={() =>
                          setCurrentPage(page)
                        }
                        className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-all ${
                          currentPage === page
                            ? "bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg"
                            : "border border-gray-300 hover:bg-white"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(
                          prev + 1,
                          totalPages
                        )
                      )
                    }
                    disabled={
                      currentPage === totalPages
                    }
                    className="p-2.5 border border-gray-300 rounded-xl hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Next"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <DeleteConfirmModal
        isOpen={modalState.delete.isOpen}
        onClose={() =>
          setModalState({
            ...modalState,
            delete: { isOpen: false, user: null },
          })
        }
        onConfirm={confirmDelete}
        userName={modalState.delete.user?.name}
        isLoading={deleteUserMutation.isPending}
      />

      <StatusToggleModal
        isOpen={modalState.status.isOpen}
        onClose={() =>
          setModalState({
            ...modalState,
            status: { isOpen: false, user: null },
          })
        }
        onConfirm={confirmStatusToggle}
        user={modalState.status.user}
        isLoading={
          activateUserMutation.isPending ||
          deactivateUserMutation.isPending
        }
      />

      <RoleChangeModal
        isOpen={modalState.role.isOpen}
        onClose={() =>
          setModalState({
            ...modalState,
            role: { isOpen: false, user: null },
          })
        }
        onConfirm={confirmRoleChange}
        user={modalState.role.user}
        isLoading={
          promoteMutation.isPending ||
          demoteMutation.isPending
        }
      />

      {showCreateModal && (
        <CreateUserModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            refetch();
          }}
        />
      )}

      {showExportModal && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          users={filteredUsers}
        />
      )}
    </div>
  );
}