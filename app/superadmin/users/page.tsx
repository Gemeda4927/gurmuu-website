"use client";

import {
  useState,
  useMemo,
  useEffect,
} from "react";
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
  Sparkles,
  X,
  Zap,
  Target,
  BarChart3,
  Key,
  Crown,
  Star,
  Globe,
  Clock,
  Check,
  Loader2,
  Sparkle,
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
import { toast } from "sonner";

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
  const [isSearchFocused, setIsSearchFocused] =
    useState(false);
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
  const [currentPage, setCurrentPage] =
    useState(1);
  const [itemsPerPage] = useState(10);
  const [showFilters, setShowFilters] =
    useState(false);

  // Modals state
  const [modalState, setModalState] = useState({
    delete: { isOpen: false, user: null as any },
    status: { isOpen: false, user: null as any },
    role: { isOpen: false, user: null as any },
  });

  // Calculate dynamic stats
  const calculateStats = () => {
    if (!usersData?.users) return null;

    const users = usersData.users;
    const totalUsers = users.length;
    const activeUsers = users.filter(
      (u) => u.isActive
    ).length;
    const admins = users.filter(
      (u) => u.role === "admin"
    ).length;
    const superadmins = users.filter(
      (u) => u.role === "superadmin"
    ).length;
    const inactiveUsers = users.filter(
      (u) => !u.isActive
    ).length;

    return {
      totalUsers,
      activeUsers,
      admins,
      superadmins,
      inactiveUsers,
      activeRate:
        totalUsers > 0
          ? Math.round(
              (activeUsers / totalUsers) * 100
            )
          : 0,
      adminPercentage:
        totalUsers > 0
          ? Math.round(
              (admins / totalUsers) * 100
            )
          : 0,
    };
  };

  const dynamicStats = calculateStats();
  const displayStats =
    statsData?.stats || dynamicStats;

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
    const startIndex =
      (currentPage - 1) * itemsPerPage;
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
        toast.success(
          "User deleted successfully",
          {
            description: `${modalState.delete.user.name} has been removed from the system.`,
          }
        );
        refetch();
      } catch (error) {
        console.error(
          "Failed to delete user:",
          error
        );
        toast.error("Failed to delete user", {
          description: "Please try again later.",
        });
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
          toast.success("User deactivated", {
            description: `${user.name} has been deactivated.`,
          });
        } else {
          await activateUserMutation.mutateAsync(
            user._id
          );
          toast.success("User activated", {
            description: `${user.name} has been activated.`,
          });
        }
        setModalState({
          ...modalState,
          status: {
            isOpen: false,
            user: null,
          },
        });
        refetch();
      } catch (error) {
        console.error(
          "Failed to toggle status:",
          error
        );
        toast.error(
          "Failed to update user status",
          {
            description:
              "Please try again later.",
          }
        );
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
    newRole: "user" | "admin" | "superadmin"
  ) => {
    const user = modalState.role.user;
    if (user && canChangeRoles) {
      try {
        let message = "";

        if (
          newRole === "admin" &&
          user.role === "user"
        ) {
          await promoteMutation.mutateAsync({
            userId: user._id,
            reason: "Promoted by superadmin",
          });
          message = `Promoted ${user.name} to Administrator`;
        } else if (
          newRole === "user" &&
          user.role === "admin"
        ) {
          await demoteMutation.mutateAsync({
            userId: user._id,
            reason: "Demoted by superadmin",
          });
          message = `Demoted ${user.name} to Regular User`;
        } else if (
          newRole === "superadmin" &&
          user.role !== "superadmin"
        ) {
          // Handle superadmin promotion if your API supports it
          message = `Promoted ${user.name} to Super Administrator`;
        }

        toast.success(
          "Role updated successfully",
          {
            description: message,
          }
        );

        setModalState({
          ...modalState,
          role: {
            isOpen: false,
            user: null,
          },
        });
        refetch();
      } catch (error) {
        console.error(
          "Failed to change role:",
          error
        );
        toast.error(
          "Failed to update user role",
          {
            description:
              "Please try again later.",
          }
        );
      }
    }
  };

  // Bulk actions
  const handleBulkDelete = async () => {
    if (
      selectedUsers.size === 0 ||
      !canDeleteUsers
    ) {
      toast.warning("No users selected", {
        description:
          "Please select users to delete.",
      });
      return;
    }

    try {
      const deletePromises = Array.from(
        selectedUsers
      ).map((userId) =>
        deleteUserMutation.mutateAsync(userId)
      );
      await Promise.all(deletePromises);
      setSelectedUsers(new Set());
      toast.success("Bulk delete successful", {
        description: `${selectedUsers.size} users have been deleted.`,
      });
      refetch();
    } catch (error) {
      console.error("Bulk delete failed:", error);
      toast.error("Bulk delete failed", {
        description: "Please try again later.",
      });
    }
  };

  const handleBulkActivate = async () => {
    if (selectedUsers.size === 0) {
      toast.warning("No users selected", {
        description:
          "Please select users to activate.",
      });
      return;
    }

    try {
      const activatePromises = Array.from(
        selectedUsers
      ).map((userId) =>
        activateUserMutation.mutateAsync(userId)
      );
      await Promise.all(activatePromises);
      setSelectedUsers(new Set());
      toast.success(
        "Bulk activation successful",
        {
          description: `${selectedUsers.size} users have been activated.`,
        }
      );
      refetch();
    } catch (error) {
      console.error(
        "Bulk activate failed:",
        error
      );
      toast.error("Bulk activation failed", {
        description: "Please try again later.",
      });
    }
  };

  const handleBulkDeactivate = async () => {
    if (selectedUsers.size === 0) {
      toast.warning("No users selected", {
        description:
          "Please select users to deactivate.",
      });
      return;
    }

    try {
      const deactivatePromises = Array.from(
        selectedUsers
      ).map((userId) =>
        deactivateUserMutation.mutateAsync(userId)
      );
      await Promise.all(deactivatePromises);
      setSelectedUsers(new Set());
      toast.success(
        "Bulk deactivation successful",
        {
          description: `${selectedUsers.size} users have been deactivated.`,
        }
      );
      refetch();
    } catch (error) {
      console.error(
        "Bulk deactivate failed:",
        error
      );
      toast.error("Bulk deactivation failed", {
        description: "Please try again later.",
      });
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
    if (!dateString) return "Never";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime()))
        return "Invalid date";

      const now = new Date();
      const diffInDays = Math.floor(
        (now.getTime() - date.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      if (diffInDays === 0) return "Today";
      if (diffInDays === 1) return "Yesterday";
      if (diffInDays < 7)
        return `${diffInDays} days ago`;

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
  };

  // Handle create user success
  const handleCreateUserSuccess = () => {
    setShowCreateModal(false);
    refetch();
    toast.success("User created successfully", {
      description:
        "The new user has been added to the system.",
    });
  };

  // Handle body overflow when modal is open
  useEffect(() => {
    if (
      showCreateModal ||
      showExportModal ||
      modalState.delete.isOpen ||
      modalState.status.isOpen ||
      modalState.role.isOpen
    ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [
    showCreateModal,
    showExportModal,
    modalState,
  ]);

  // Loading and error states
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-spin border-t-transparent"></div>
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-purple-500 animate-pulse" />
          </div>
          <p className="mt-6 text-gray-600 font-medium text-lg">
            Loading users...
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Fetching the latest user data
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-red-100 rounded-full animate-ping"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Connection Lost
          </h3>
          <p className="text-gray-600 mb-6">
            {error.message ||
              "Unable to fetch user data. Please check your connection."}
          </p>
          <button
            onClick={() => refetch()}
            className="px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl hover:scale-105 transition-all shadow-lg hover:shadow-xl font-medium flex items-center justify-center mx-auto gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 md:p-6">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-40 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    User Management
                  </h1>
                  <p className="text-gray-600 mt-2 text-lg">
                    <span className="font-semibold">
                      Total:{" "}
                      {usersData?.users?.length ||
                        0}
                    </span>{" "}
                    accounts • Manage roles,
                    permissions & access
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => refetch()}
                className="p-3.5 bg-white border border-gray-300 rounded-2xl hover:bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5 text-gray-600 group-hover:rotate-180 transition-transform duration-500" />
              </button>
              <button
                onClick={() =>
                  setShowCreateModal(true)
                }
                className="inline-flex items-center px-6 py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-2xl hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-medium group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <UserPlus className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                <span className="relative">
                  Add New User
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {displayStats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                title: "Total Users",
                value:
                  displayStats.totalUsers || 0,
                icon: Users,
                color:
                  "from-blue-500 to-cyan-500",
                change: `${filteredUsers.length} filtered`,
                trend: "neutral",
                description: "All accounts",
              },
              {
                title: "Active Users",
                value:
                  displayStats.activeUsers || 0,
                icon: UserCheck,
                color:
                  "from-green-500 to-emerald-500",
                change: `${displayStats.activeRate || 0}% active rate`,
                trend: "up",
                description: "Currently online",
              },
              {
                title: "Administrators",
                value: displayStats.admins || 0,
                icon: Crown,
                color:
                  "from-purple-500 to-pink-500",
                change: `${displayStats.superadmins || 0} superadmins`,
                trend: "neutral",
                description: "With admin rights",
              },
              {
                title: "Inactive Users",
                value:
                  displayStats.inactiveUsers || 0,
                icon: UserX,
                color: "from-red-500 to-rose-500",
                change: "Needs attention",
                trend: "down",
                description:
                  "Awaiting activation",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-50 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-500"></div>
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        {stat.title}
                      </p>
                      <p className="text-4xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {stat.description}
                      </p>
                    </div>
                    <div
                      className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <stat.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    {stat.trend === "up" && (
                      <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
                    )}
                    {stat.trend === "down" && (
                      <TrendingUp className="w-4 h-4 mr-2 text-red-600 rotate-180" />
                    )}
                    <span
                      className={
                        stat.trend === "up"
                          ? "text-green-600 font-medium"
                          : stat.trend === "down"
                            ? "text-red-600 font-medium"
                            : "text-gray-600"
                      }
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg overflow-hidden">
          {/* Search and Filter Bar */}
          <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Enhanced Search Field */}
              <div className="flex-1 relative group">
                <div
                  className={`relative max-w-xl transition-all duration-500 ${isSearchFocused ? "scale-105" : ""}`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl blur-xl transition-opacity duration-500 ${isSearchFocused ? "opacity-100" : "opacity-0"}`}
                  ></div>
                  <div className="relative flex items-center">
                    <div
                      className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-500 ${isSearchFocused ? "scale-110 text-purple-600" : "text-gray-400"}`}
                    >
                      <Search className="w-6 h-6" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search users by name, email, or phone..."
                      value={searchTerm}
                      onChange={(e) =>
                        setSearchTerm(
                          e.target.value
                        )
                      }
                      onFocus={() =>
                        setIsSearchFocused(true)
                      }
                      onBlur={() =>
                        setIsSearchFocused(false)
                      }
                      className="w-full pl-14 pr-12 py-4 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white text-gray-900 placeholder-gray-500 font-medium shadow-sm"
                    />
                    {searchTerm && (
                      <button
                        onClick={clearSearch}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-700 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                    <div className="absolute right-14 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <div className="text-xs px-2 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 rounded-lg font-medium">
                        ⌘K
                      </div>
                    </div>
                  </div>
                  {searchTerm &&
                    filteredUsers.length > 0 && (
                      <div className="absolute left-0 right-0 mt-2 text-sm text-gray-600 animate-fadeIn">
                        <span className="font-medium text-purple-600">
                          {filteredUsers.length}
                        </span>{" "}
                        users found
                      </div>
                    )}
                </div>
              </div>

              {/* Filter Controls */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() =>
                    setShowFilters(!showFilters)
                  }
                  className={`inline-flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${showFilters ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg" : "border border-gray-300 hover:bg-gray-50 text-gray-700"}`}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </button>

                <div className="relative">
                  <select
                    value={filters.role}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        role: e.target.value,
                      })
                    }
                    className="appearance-none border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-700 transition-all duration-300 hover:shadow-md"
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
                    <Shield className="w-4 h-4 text-gray-400" />
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
                    className="appearance-none border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-700 transition-all duration-300 hover:shadow-md"
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
                  className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-medium group overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <Download className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Export
                </button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-6 p-6 bg-gradient-to-r from-gray-50/50 to-white/50 rounded-2xl border border-gray-200/50 animate-slideDown">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Sparkles className="w-4 h-4 inline mr-2" />
                      Advanced Filters
                    </label>
                    <div className="space-y-3">
                      <div className="text-sm text-gray-500">
                        More filters coming
                        soon...
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quick Actions
                    </label>
                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          setFilters({
                            role: "all",
                            status: "active",
                          });
                          setShowFilters(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm bg-gradient-to-r from-green-50 to-green-100 text-green-700 rounded-lg hover:shadow transition-colors"
                      >
                        Show Only Active Users
                      </button>
                      <button
                        onClick={() => {
                          setFilters({
                            role: "admin",
                            status: "all",
                          });
                          setShowFilters(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg hover:shadow transition-colors"
                      >
                        Show Administrators
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Target className="w-4 h-4 inline mr-2" />
                      User Stats
                    </label>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>
                        Filtered:{" "}
                        {filteredUsers.length}{" "}
                        users
                      </div>
                      <div>
                        Selected:{" "}
                        {selectedUsers.size} users
                      </div>
                      <div>
                        Page: {currentPage} of{" "}
                        {totalPages}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bulk Actions */}
          {selectedUsers.size > 0 && (
            <div className="px-6 py-5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-purple-200/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center">
                  <div className="relative">
                    <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-900">
                      {selectedUsers.size} user
                      {selectedUsers.size > 1
                        ? "s"
                        : ""}{" "}
                      selected
                    </span>
                    <p className="text-xs text-gray-600">
                      Apply actions to all
                      selected users
                    </p>
                  </div>
                </div>
                <div className="flex items-center flex-wrap gap-2">
                  <button
                    onClick={handleBulkActivate}
                    className="px-4 py-2.5 text-sm bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-medium flex items-center gap-2"
                  >
                    <UserCheck className="w-4 h-4" />
                    Activate All
                  </button>
                  <button
                    onClick={handleBulkDeactivate}
                    className="px-4 py-2.5 text-sm bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-medium flex items-center gap-2"
                  >
                    <UserX className="w-4 h-4" />
                    Deactivate All
                  </button>
                  {canDeleteUsers && (
                    <button
                      onClick={handleBulkDelete}
                      className="px-4 py-2.5 text-sm bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-medium flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete All
                    </button>
                  )}
                  <button
                    onClick={() =>
                      setSelectedUsers(new Set())
                    }
                    className="px-4 py-2.5 text-sm border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:shadow font-medium"
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
                <tr className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200/50">
                  <th className="py-5 px-6 text-left w-14">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={
                          selectedUsers.size ===
                            paginatedUsers.length &&
                          paginatedUsers.length >
                            0
                        }
                        onChange={handleSelectAll}
                        className="rounded-xl border-2 border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 h-5 w-5 transition-colors"
                      />
                    </div>
                  </th>
                  <th className="py-5 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4" />
                      User Profile
                    </div>
                  </th>
                  <th className="py-5 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Role & Permissions
                    </div>
                  </th>
                  <th className="py-5 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Status
                    </div>
                  </th>
                  <th className="py-5 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Activity
                    </div>
                  </th>
                  <th className="py-5 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Actions
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50">
                {paginatedUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-20 px-6 text-center"
                    >
                      <div className="max-w-md mx-auto text-center">
                        <div className="relative w-24 h-24 mx-auto mb-6">
                          <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full animate-pulse"></div>
                          <Users className="w-12 h-12 text-gray-400 relative top-6 left-6" />
                          <Sparkle className="absolute -top-2 -right-2 w-6 h-6 text-purple-500 animate-bounce" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                          No Users Found
                        </h3>
                        <p className="text-gray-600 mb-6 text-lg">
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
                          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-2xl hover:opacity-90 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 font-semibold text-lg flex items-center justify-center mx-auto gap-3"
                        >
                          <UserPlus className="w-6 h-6" />
                          Add First User
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map(
                    (user, index) => (
                      <tr
                        key={user._id}
                        className="hover:bg-gradient-to-r from-gray-50/50 to-white/50 transition-all duration-300 group"
                        style={{
                          animationDelay: `${index * 50}ms`,
                        }}
                      >
                        <td className="py-5 px-6">
                          <div className="flex items-center">
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
                              className="rounded-xl border-2 border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 h-5 w-5 transition-colors group-hover:scale-110"
                            />
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <div className="flex items-center">
                            <div className="relative h-14 w-14 flex-shrink-0">
                              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                              <img
                                className="h-14 w-14 rounded-2xl object-cover ring-2 ring-white shadow-lg group-hover:scale-105 transition-transform duration-300"
                                src={
                                  user.avatar ||
                                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff&bold=true&size=256`
                                }
                                alt={user.name}
                              />
                              <div
                                className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-3 border-white shadow-lg ${
                                  user.isActive
                                    ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                    : "bg-gradient-to-r from-red-500 to-rose-500"
                                }`}
                              />
                              {user.role ===
                                "superadmin" && (
                                <div className="absolute -top-1 -left-1 h-6 w-6 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center shadow-lg">
                                  <Crown className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="ml-5">
                              <div className="flex items-center gap-2">
                                <div className="text-base font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                                  {user.name}
                                </div>
                                {user.role ===
                                  "superadmin" && (
                                  <span className="text-xs px-2.5 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 rounded-full font-semibold flex items-center gap-1">
                                    <Crown className="w-3 h-3" />
                                    Superadmin
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-600 flex items-center mt-1.5">
                                <Mail className="w-4 h-4 mr-2 opacity-60" />
                                <span className="font-medium">
                                  {user.email}
                                </span>
                              </div>
                              {user.phone && (
                                <div className="text-sm text-gray-500 flex items-center mt-1.5">
                                  <Phone className="w-4 h-4 mr-2 opacity-60" />
                                  <span className="font-medium">
                                    {user.phone}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-bold ${
                                  user.role ===
                                  "superadmin"
                                    ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg"
                                    : user.role ===
                                        "admin"
                                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                                      : "bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg"
                                }`}
                              >
                                {user.role ===
                                  "superadmin" && (
                                  <Crown className="w-4 h-4 mr-2" />
                                )}
                                {user.role ===
                                  "admin" && (
                                  <Shield className="w-4 h-4 mr-2" />
                                )}
                                {user.role ===
                                  "user" && (
                                  <UserIcon className="w-4 h-4 mr-2" />
                                )}
                                {user.role
                                  .charAt(0)
                                  .toUpperCase() +
                                  user.role.slice(
                                    1
                                  )}
                              </span>
                            </div>
                            <div className="flex items-center text-xs text-gray-600">
                              <Key className="w-3.5 h-3.5 mr-1.5" />
                              <span className="font-semibold">
                                {user.permissions
                                  ?.length || 0}
                              </span>
                              <span className="mx-1">
                                permissions
                              </span>
                              <Star className="w-3.5 h-3.5 ml-2 mr-1.5 text-yellow-500" />
                              <span>
                                Level{" "}
                                {user.role ===
                                "superadmin"
                                  ? "3"
                                  : user.role ===
                                      "admin"
                                    ? "2"
                                    : "1"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <div className="flex flex-col gap-2">
                            <span
                              className={`inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg ${
                                user.isActive
                                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                                  : "bg-gradient-to-r from-red-500 to-rose-500 text-white"
                              }`}
                            >
                              {user.isActive ? (
                                <>
                                  <UserCheck className="w-4 h-4 mr-2" />
                                  Active
                                </>
                              ) : (
                                <>
                                  <UserX className="w-4 h-4 mr-2" />
                                  Inactive
                                </>
                              )}
                            </span>
                            <div className="text-xs text-gray-600 flex items-center">
                              <Clock className="w-3.5 h-3.5 mr-1.5" />
                              <span>
                                Last login:{" "}
                                {formatDate(
                                  user.updatedAt
                                )}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-900 font-semibold">
                              <Calendar className="w-5 h-5 mr-2.5 text-purple-500" />
                              Joined{" "}
                              {formatDate(
                                user.createdAt
                              )}
                            </div>
                            <div className="text-xs text-gray-600 flex items-center">
                              <Globe className="w-3.5 h-3.5 mr-1.5" />
                              <span>
                                Updated{" "}
                                {formatDate(
                                  user.updatedAt
                                )}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <div className="flex items-center space-x-1.5">
                            <button
                              onClick={() =>
                                handleViewUser(
                                  user
                                )
                              }
                              className="p-2.5 text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg group/action"
                              title="View Details"
                            >
                              <Eye className="w-5 h-5 group-hover/action:scale-110 transition-transform" />
                            </button>
                            <button
                              onClick={() =>
                                handleEditUser(
                                  user
                                )
                              }
                              className="p-2.5 text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg group/action"
                              title="Edit User"
                            >
                              <Edit className="w-5 h-5 group-hover/action:scale-110 transition-transform" />
                            </button>
                            <button
                              onClick={() =>
                                handleStatusToggle(
                                  user
                                )
                              }
                              className={`p-2.5 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg group/action ${
                                user.isActive
                                  ? "text-gray-600 hover:text-red-600 hover:bg-gradient-to-r from-red-50 to-red-100"
                                  : "text-gray-600 hover:text-green-600 hover:bg-gradient-to-r from-green-50 to-green-100"
                              }`}
                              title={
                                user.isActive
                                  ? "Deactivate"
                                  : "Activate"
                              }
                            >
                              {user.isActive ? (
                                <UserX className="w-5 h-5 group-hover/action:scale-110 transition-transform" />
                              ) : (
                                <UserCheck className="w-5 h-5 group-hover/action:scale-110 transition-transform" />
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
                                  className="p-2.5 text-gray-600 hover:text-purple-600 hover:bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg group/action"
                                  title="Change Role"
                                >
                                  <Shield className="w-5 h-5 group-hover/action:scale-110 transition-transform" />
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
                                  className="p-2.5 text-gray-600 hover:text-red-600 hover:bg-gradient-to-r from-red-50 to-red-100 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg group/action"
                                  title="Delete User"
                                >
                                  <Trash2 className="w-5 h-5 group-hover/action:scale-110 transition-transform" />
                                </button>
                              )}
                          </div>
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredUsers.length > 0 && (
            <div className="px-6 py-6 border-t border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-white/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-gray-700">
                  <span className="font-semibold">
                    {(currentPage - 1) *
                      itemsPerPage +
                      1}
                  </span>
                  -
                  <span className="font-semibold">
                    {Math.min(
                      currentPage * itemsPerPage,
                      filteredUsers.length
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-gray-900">
                    {filteredUsers.length}
                  </span>{" "}
                  users • Page{" "}
                  <span className="font-bold text-purple-600">
                    {currentPage}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-gray-900">
                    {totalPages}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.max(prev - 1, 1)
                      )
                    }
                    disabled={currentPage === 1}
                    className="p-3 border-2 border-gray-300 rounded-xl hover:bg-white hover:border-purple-500 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 group"
                    title="Previous"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-colors" />
                  </button>
                  {Array.from(
                    { length: totalPages },
                    (_, i) => i + 1
                  )
                    .slice(
                      Math.max(
                        0,
                        currentPage - 3
                      ),
                      Math.min(
                        totalPages,
                        currentPage + 2
                      )
                    )
                    .map((page) => (
                      <button
                        key={page}
                        onClick={() =>
                          setCurrentPage(page)
                        }
                        className={`px-5 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                          currentPage === page
                            ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-xl scale-105"
                            : "border-2 border-gray-300 hover:bg-white hover:border-purple-500 hover:shadow-lg hover:scale-105"
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
                    className="p-3 border-2 border-gray-300 rounded-xl hover:bg-white hover:border-purple-500 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 group"
                    title="Next"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-colors" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add CSS animations */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px)
              scale(1);
          }
          33% {
            transform: translate(30px, -50px)
              scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px)
              scale(0.9);
          }
          100% {
            transform: translate(0px, 0px)
              scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        body.modal-open {
          overflow: hidden;
        }
      `}</style>

      {/* Create User Modal */}
      {showCreateModal && (
        <CreateUserModal
          isOpen={showCreateModal}
          onClose={() =>
            setShowCreateModal(false)
          }
          onSuccess={handleCreateUserSuccess}
        />
      )}

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

      {showExportModal && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() =>
            setShowExportModal(false)
          }
          users={filteredUsers}
        />
      )}
    </div>
  );
}
