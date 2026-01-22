// app/permissions/page.tsx
"use client";

import { useState, useMemo } from "react";
import { usePersimmon } from "@/lib/hooks/usePersimmon";
import { useAuthStore } from "@/lib/store/auth.store";
import { useGetAllUsers } from "@/lib/hooks/useSuperadmin";
import {
  Shield,
  User,
  Users,
  Key,
  Lock,
  Unlock,
  RefreshCw,
  Search,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Crown,
  Settings,
  FileText,
  BarChart3,
  Bell,
  Mail,
  Phone,
  Calendar,
  Loader2,
  Sparkles,
  Grid,
  List,
  UserCheck,
  UserX,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  ShieldOff,
  TrendingUp,
  Users as UsersIcon,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

interface UserType {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  phone?: string;
  avatar?: string;
  createdAt: string;
  permissions?: string[];
}

export default function PermissionsPage() {
  const { user: currentUser } = useAuthStore();
  const { data: usersData, isLoading: isLoadingUsers, refetch: refetchUsers } = useGetAllUsers();
  
  const {
    useGetAllPermissions,
    useGetUserPermissions,
    useGrantPermission,
    useRevokePermission,
    useResetPermissions,
    useChangeUserRole,
    usePromoteToAdmin,
    useDemoteToUser,
    usePermissionCapabilities,
    permissionHelpers,
    isPermissionGranted,
  } = usePersimmon();

  // Get all permissions
  const { 
    data: permissionsData, 
    isLoading: isLoadingPermissions,
    refetch: refetchPermissions 
  } = useGetAllPermissions();

  // Mutations
  const { mutate: grantPermission, isPending: isGranting } = useGrantPermission();
  const { mutate: revokePermission, isPending: isRevoking } = useRevokePermission();
  const { mutate: resetPermissions, isPending: isResetting } = useResetPermissions();
  const { mutate: changeRole, isPending: isChangingRole } = useChangeUserRole();
  const { mutate: promoteToAdmin, isPending: isPromoting } = usePromoteToAdmin();
  const { mutate: demoteToUser, isPending: isDemoting } = useDemoteToUser();

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [grantReason, setGrantReason] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get selected user permissions
  const { 
    data: selectedUserPermissions, 
    isLoading: isLoadingUserPerms,
    refetch: refetchUserPerms 
  } = useGetUserPermissions(selectedUserId || "");

  const { 
    canManagePermissions, 
    canChangeRoles, 
    isSuperadmin, 
    isAdmin 
  } = usePermissionCapabilities();

  // Helper functions that handle undefined permissionsData
  const getAllPermissionValues = () => {
    return permissionHelpers.getAllPermissionValues(permissionsData);
  };

  const getAllRoles = () => {
    return permissionHelpers.getAllRoles(permissionsData);
  };

  const getPermissionLabel = (permission: string) => {
    return permissionHelpers.getPermissionLabel(permission, permissionsData);
  };

  const getRoleLabel = (role: string) => {
    return permissionHelpers.getRoleLabel(role, permissionsData);
  };

  const getCategoryName = (category: string) => {
    return permissionHelpers.getCategoryName(category);
  };

  const requiresSuperadmin = (permission: string) => {
    return permissionHelpers.requiresSuperadmin(permission, permissionsData);
  };

  const getPermissionsByCategory = (permissions: string[]) => {
    return permissionHelpers.getPermissionsByCategory(permissions, permissionsData);
  };

  // Extract data using helper functions
  const allPermissionValues = useMemo(() => {
    return getAllPermissionValues();
  }, [permissionsData]);

  const allRoleValues = useMemo(() => {
    return getAllRoles();
  }, [permissionsData]);

  // Statistics
  const stats = useMemo(() => {
    if (!usersData?.users) return null;
    
    const users = usersData.users || [];
    const totalUsers = users.length;
    const superadmins = users.filter(u => u.role === 'superadmin').length;
    const admins = users.filter(u => u.role === 'admin').length;
    const regularUsers = users.filter(u => u.role === 'user').length;
    const activeUsers = users.filter(u => u.isActive).length;

    return {
      totalUsers,
      superadmins,
      admins,
      regularUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      adminRatio: totalUsers > 0 ? (admins / totalUsers * 100).toFixed(1) : "0",
      activeRatio: totalUsers > 0 ? (activeUsers / totalUsers * 100).toFixed(1) : "0",
    };
  }, [usersData]);

  // Filter users
  const filteredUsers = useMemo(() => {
    if (!usersData?.users) return [];
    
    const users = usersData.users || [];
    
    return users.filter((userItem: UserType) => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          userItem.name.toLowerCase().includes(searchLower) ||
          userItem.email.toLowerCase().includes(searchLower) ||
          (userItem.phone && userItem.phone.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Role filter
      if (selectedRole !== "all" && userItem.role !== selectedRole) {
        return false;
      }

      return true;
    });
  }, [usersData, searchTerm, selectedRole]);

  // Get categorized permissions
  const categorizedPermissions = useMemo(() => {
    if (!selectedUserPermissions?.user?.permissions) return {};
    
    const userPerms = selectedUserPermissions.user.permissions || [];
    return getPermissionsByCategory(userPerms);
  }, [selectedUserPermissions, permissionsData]);

  // Handle toggle permission
  const handleTogglePermission = async (permission: string) => {
    if (!selectedUserId || !canManagePermissions) return;

    const isGranted = isPermissionGranted(selectedUserPermissions?.user?.permissions, permission);
    const reason = grantReason || (isGranted ? "Permission revoked" : "Permission granted");
    const userName = filteredUsers.find(u => u._id === selectedUserId)?.name;

    try {
      if (isGranted) {
        await revokePermission({
          userId: selectedUserId,
          data: { permission, reason }
        });
        toast.success(`Permission revoked from ${userName}`);
      } else {
        await grantPermission({
          userId: selectedUserId,
          data: { permission, reason }
        });
        toast.success(`Permission granted to ${userName}`);
      }
      
      setGrantReason("");
    } catch (error) {
      toast.error(`Failed to ${isGranted ? 'revoke' : 'grant'} permission`);
    }
  };

  // Handle role change
  const handleRoleChange = async (newRole: string) => {
    if (!selectedUserId || !canChangeRoles) return;

    const currentRole = selectedUserPermissions?.user?.role;
    const userName = filteredUsers.find(u => u._id === selectedUserId)?.name;
    const reason = grantReason || `Role changed from ${currentRole} to ${newRole}`;

    try {
      if (newRole === 'admin' && currentRole === 'user') {
        await promoteToAdmin({
          userId: selectedUserId,
          reason
        });
        toast.success(`Promoted ${userName} to Admin`);
      } else if (newRole === 'user' && currentRole === 'admin') {
        await demoteToUser({
          userId: selectedUserId,
          reason
        });
        toast.success(`Demoted ${userName} to User`);
      } else {
        await changeRole({
          userId: selectedUserId,
          data: { role: newRole as any, reason }
        });
        toast.success(`Changed ${userName}'s role to ${getRoleLabel(newRole)}`);
      }
      
      setGrantReason("");
    } catch (error) {
      toast.error(`Failed to change role`);
    }
  };

  // Handle reset permissions
  const handleResetPermissions = async () => {
    if (!selectedUserId || !canManagePermissions) return;
    
    const userName = filteredUsers.find(u => u._id === selectedUserId)?.name;
    
    if (window.confirm(`Reset ALL permissions for ${userName}?`)) {
      try {
        await resetPermissions(selectedUserId);
        toast.success(`Permissions reset for ${userName}`);
      } catch (error) {
        toast.error(`Failed to reset permissions`);
      }
    }
  };

  // Refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetchUsers(),
        refetchPermissions(),
        selectedUserId && refetchUserPerms()
      ]);
      toast.success('Data refreshed');
    } catch (error) {
      toast.error('Failed to refresh');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Get role badge config
  const getRoleConfig = (role: string) => {
    const label = getRoleLabel(role);
    
    switch (role) {
      case 'superadmin':
        return {
          icon: <Crown className="w-4 h-4" />,
          color: "from-yellow-400 to-orange-400",
          textColor: "text-yellow-800",
          bgColor: "bg-yellow-100",
          label
        };
      case 'admin':
        return {
          icon: <Shield className="w-4 h-4" />,
          color: "from-blue-500 to-cyan-500",
          textColor: "text-blue-800",
          bgColor: "bg-blue-100",
          label
        };
      default:
        return {
          icon: <User className="w-4 h-4" />,
          color: "from-gray-500 to-gray-700",
          textColor: "text-gray-800",
          bgColor: "bg-gray-100",
          label
        };
    }
  };

  // Get category config
  const getCategoryConfig = (category: string) => {
    const configs = {
      user_management: {
        icon: <UsersIcon className="w-5 h-5" />,
        color: "from-blue-500 to-cyan-500",
        bgColor: "bg-blue-50",
        textColor: "text-blue-700",
        borderColor: "border-blue-200"
      },
      content_management: {
        icon: <FileText className="w-5 h-5" />,
        color: "from-green-500 to-emerald-500",
        bgColor: "bg-green-50",
        textColor: "text-green-700",
        borderColor: "border-green-200"
      },
      settings: {
        icon: <Settings className="w-5 h-5" />,
        color: "from-purple-500 to-pink-500",
        bgColor: "bg-purple-50",
        textColor: "text-purple-700",
        borderColor: "border-purple-200"
      },
      roles_permissions: {
        icon: <Shield className="w-5 h-5" />,
        color: "from-yellow-500 to-orange-500",
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-700",
        borderColor: "border-yellow-200"
      },
      analytics: {
        icon: <BarChart3 className="w-5 h-5" />,
        color: "from-indigo-500 to-violet-500",
        bgColor: "bg-indigo-50",
        textColor: "text-indigo-700",
        borderColor: "border-indigo-200"
      },
      notifications: {
        icon: <Bell className="w-5 h-5" />,
        color: "from-red-500 to-rose-500",
        bgColor: "bg-red-50",
        textColor: "text-red-700",
        borderColor: "border-red-200"
      }
    };
    
    return configs[category as keyof typeof configs] || {
      icon: <Key className="w-5 h-5" />,
      color: "from-gray-500 to-gray-700",
      bgColor: "bg-gray-50",
      textColor: "text-gray-700",
      borderColor: "border-gray-200"
    };
  };

  // Loading state
  if (isLoadingUsers || isLoadingPermissions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              {isSuperadmin && (
                <div className="absolute -top-2 -right-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                    <Crown className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Permission Management
              </h1>
              <p className="text-gray-600 mt-1 flex items-center gap-2">
                <span>Manage user permissions and role assignments</span>
                {isSuperadmin && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800">
                    <Crown className="w-3 h-3 mr-1" />
                    Superadmin Mode
                  </span>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 group"
              title="Refresh Data"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
            </button>
            
            <div className="flex items-center bg-white rounded-xl p-1 border border-gray-300">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-purple-100 text-purple-600" : "text-gray-600 hover:text-purple-600"}`}
                title="Grid View"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg ${viewMode === "list" ? "bg-purple-100 text-purple-600" : "text-gray-600 hover:text-purple-600"}`}
                title="List View"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Dashboard */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalUsers}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50">
                <UsersIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              <TrendingUp className="w-3 h-3 inline mr-1 text-green-500" />
              <span className="text-green-600 font-medium">{stats.activeRatio}% active</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Superadmins</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.superadmins}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50">
                <Crown className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              Full system access
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Administrators</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.admins}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              <span className="text-blue-600 font-medium">{stats.adminRatio}%</span> of users
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Regular Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.regularUsers}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100">
                <User className="w-6 h-6 text-gray-600" />
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              Basic access level
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activeUsers}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              Currently online
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.inactiveUsers}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-red-50 to-rose-50">
                <UserX className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              Needs attention
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - User Selection */}
        <div className="lg:col-span-1 space-y-6">
          {/* User Search and Filter */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Select User</h3>
                <span className="text-sm text-gray-500">{filteredUsers.length} users</span>
              </div>
              
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedRole("all")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedRole === "all" ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  All
                </button>
                {allRoleValues.map((role) => {
                  const roleConfig = getRoleConfig(role);
                  return (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${selectedRole === role ? `bg-gradient-to-r ${roleConfig.color} text-white shadow-md` : `${roleConfig.bgColor} ${roleConfig.textColor} hover:opacity-90`}`}
                    >
                      {roleConfig.icon}
                      {roleConfig.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* User List */}
            <div className="p-4 max-h-[500px] overflow-y-auto">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No users found</p>
                  <p className="text-sm text-gray-400 mt-1">Try adjusting your search</p>
                </div>
              ) : (
                filteredUsers.map((userItem: UserType) => {
                  const roleConfig = getRoleConfig(userItem.role);
                  const isSelected = selectedUserId === userItem._id;
                  
                  return (
                    <div
                      key={userItem._id}
                      onClick={() => setSelectedUserId(userItem._id)}
                      className={`p-4 rounded-xl mb-3 cursor-pointer transition-all duration-300 ${isSelected ? "bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 shadow-lg transform scale-[1.02]" : "bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 hover:shadow-md"}`}
                    >
                      <div className="flex items-center">
                        <div className="relative">
                          <div className="h-12 w-12 rounded-xl bg-gray-300 flex items-center justify-center ring-2 ring-white shadow-sm overflow-hidden">
                            {userItem.avatar ? (
                              <img
                                src={userItem.avatar}
                                alt={userItem.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <User className="w-6 h-6 text-gray-500" />
                            )}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${userItem.isActive ? "bg-green-500" : "bg-red-500"}`} />
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-900 truncate">{userItem.name}</h4>
                            <div className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${roleConfig.bgColor} ${roleConfig.textColor}`}>
                              {roleConfig.icon}
                              {roleConfig.label}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 truncate mt-1">{userItem.email}</p>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(userItem.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Permission Stats</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Available Permissions</span>
                  <span className="font-semibold">{allPermissionValues.length}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: '100%' }}></div>
                </div>
              </div>
              
              {selectedUserId && selectedUserPermissions && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Custom Permissions</span>
                    <span className="font-semibold text-green-600">
                      {selectedUserPermissions.user?.permissions?.length || 0}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500" 
                      style={{ 
                        width: `${Math.min((selectedUserPermissions.user?.permissions?.length || 0) / allPermissionValues.length * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                    <span>Total available: {allPermissionValues.length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
                    <span>Default admin permissions included</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Permission Management */}
        <div className="lg:col-span-2">
          {selectedUserId ? (
            <div className="space-y-6">
              {/* User Profile Header */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="relative">
                        <div className="h-16 w-16 rounded-2xl bg-gray-300 flex items-center justify-center ring-4 ring-white shadow-lg overflow-hidden">
                          {filteredUsers.find(u => u._id === selectedUserId)?.avatar ? (
                            <img
                              src={filteredUsers.find(u => u._id === selectedUserId)?.avatar}
                              alt={filteredUsers.find(u => u._id === selectedUserId)?.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User className="w-8 h-8 text-gray-500" />
                          )}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-3 border-white ${filteredUsers.find(u => u._id === selectedUserId)?.isActive ? "bg-green-500" : "bg-red-500"}`}>
                          {filteredUsers.find(u => u._id === selectedUserId)?.isActive ? (
                            <Check className="w-3 h-3 text-white mx-auto mt-1" />
                          ) : (
                            <X className="w-3 h-3 text-white mx-auto mt-1" />
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center gap-3">
                          <h2 className="text-2xl font-bold text-gray-900">
                            {filteredUsers.find(u => u._id === selectedUserId)?.name}
                          </h2>
                          <div className={`px-3 py-1 rounded-xl text-sm font-bold flex items-center gap-2 bg-gradient-to-r ${getRoleConfig(selectedUserPermissions?.user?.role || 'user').color} text-white`}>
                            {getRoleConfig(selectedUserPermissions?.user?.role || 'user').icon}
                            {getRoleLabel(selectedUserPermissions?.user?.role || 'user')}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center text-gray-600">
                            <Mail className="w-4 h-4 mr-2" />
                            {filteredUsers.find(u => u._id === selectedUserId)?.email}
                          </div>
                          {filteredUsers.find(u => u._id === selectedUserId)?.phone && (
                            <div className="flex items-center text-gray-600">
                              <Phone className="w-4 h-4 mr-2" />
                              {filteredUsers.find(u => u._id === selectedUserId)?.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                      {canChangeRoles && selectedUserPermissions?.user?.role !== 'superadmin' && (
                        <>
                          {selectedUserPermissions?.user?.role === 'user' ? (
                            <button
                              onClick={() => handleRoleChange('admin')}
                              disabled={isPromoting}
                              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:opacity-90 transition-all disabled:opacity-50 font-medium flex items-center gap-2 shadow-lg"
                            >
                              {isPromoting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <ArrowUpRight className="w-4 h-4" />
                              )}
                              Promote to Admin
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRoleChange('user')}
                              disabled={isDemoting}
                              className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-700 text-white rounded-xl hover:opacity-90 transition-all disabled:opacity-50 font-medium flex items-center gap-2 shadow-lg"
                            >
                              {isDemoting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <ArrowDownRight className="w-4 h-4" />
                              )}
                              Demote to User
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="text-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                      <div className="text-2xl font-bold text-gray-900">
                        {selectedUserPermissions?.user?.permissions?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">Custom Permissions</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                      <div className="text-2xl font-bold text-gray-900">
                        {selectedUserPermissions?.user?.role === 'admin' ? '10' : '0'}
                      </div>
                      <div className="text-sm text-gray-600">Role Permissions</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                      <div className="text-2xl font-bold text-gray-900">
                        {(selectedUserPermissions?.user?.permissions?.length || 0)}
                      </div>
                      <div className="text-sm text-gray-600">Total Permissions</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Permission Management */}
              {canManagePermissions ? (
                <div className="space-y-6">
                  {/* Action Bar */}
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Manage Permissions</h3>
                        <p className="text-gray-600 text-sm">Grant or revoke permissions for this user</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <div className="relative">
                          <input
                            type="text"
                            value={grantReason}
                            onChange={(e) => setGrantReason(e.target.value)}
                            placeholder="Reason for changes..."
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full sm:w-auto"
                          />
                          {grantReason && (
                            <button
                              onClick={() => setGrantReason("")}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <button
                          onClick={handleResetPermissions}
                          disabled={isResetting || !selectedUserPermissions?.user?.permissions?.length}
                          className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50 font-medium flex items-center gap-2"
                        >
                          {isResetting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <RefreshCw className="w-4 h-4" />
                          )}
                          Reset All
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Permission Categories */}
                  {Object.entries(categorizedPermissions).map(([category, permissions]) => {
                    const categoryConfig = getCategoryConfig(category);
                    const grantedCount = permissions.filter(p => isPermissionGranted(selectedUserPermissions?.user?.permissions, p)).length;
                    const isExpanded = expandedCategories[category];
                    
                    return (
                      <div key={category} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div
                          onClick={() => setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }))}
                          className={`p-6 cursor-pointer transition-all ${categoryConfig.bgColor} ${categoryConfig.borderColor} border-b`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`p-3 rounded-xl ${categoryConfig.textColor} ${categoryConfig.bgColor}`}>
                                {categoryConfig.icon}
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  {getCategoryName(category)}
                                </h4>
                                <div className="flex items-center gap-4 mt-1">
                                  <span className="text-sm text-gray-600">
                                    {permissions.length} permissions
                                  </span>
                                  <span className="text-sm font-medium text-green-600">
                                    {grantedCount} granted
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className={`px-3 py-1 rounded-lg text-sm font-medium ${grantedCount === permissions.length ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                                {Math.round(grantedCount / permissions.length * 100)}%
                              </div>
                              {isExpanded ? (
                                <ChevronUp className="w-5 h-5 text-gray-500" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-500" />
                              )}
                            </div>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="p-6 space-y-3 animate-fadeIn">
                            {permissions.map((permission) => {
                              const isGranted = isPermissionGranted(selectedUserPermissions?.user?.permissions, permission);
                              const requiresSuperadminCheck = requiresSuperadmin(permission);
                              
                              return (
                                <div
                                  key={permission}
                                  className={`p-4 rounded-xl border transition-all ${isGranted ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-3">
                                        {isGranted ? (
                                          <ShieldCheck className="w-5 h-5 text-green-500" />
                                        ) : (
                                          <ShieldOff className="w-5 h-5 text-gray-400" />
                                        )}
                                        <div>
                                          <h5 className="font-medium text-gray-900">
                                            {getPermissionLabel(permission)}
                                          </h5>
                                          <p className="text-sm text-gray-600 mt-1">{permission}</p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      {requiresSuperadminCheck && (
                                        <span className="px-2 py-1 text-xs bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 rounded-full font-medium">
                                          <Crown className="w-3 h-3 inline mr-1" />
                                          Superadmin
                                        </span>
                                      )}
                                      <button
                                        onClick={() => handleTogglePermission(permission)}
                                        disabled={isGranting || isRevoking}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${isGranted ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white hover:opacity-90' : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:opacity-90'}`}
                                      >
                                        {isGranted ? (
                                          <>
                                            <Lock className="w-4 h-4" />
                                            Revoke
                                          </>
                                        ) : (
                                          <>
                                            <Unlock className="w-4 h-4" />
                                            Grant
                                          </>
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* No Permission Message */
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="relative w-20 h-20 mx-auto mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full animate-pulse"></div>
                      <Lock className="w-10 h-10 text-gray-400 relative top-5 left-5" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Permission Management Restricted
                    </h3>
                    <p className="text-gray-600 mb-6">
                      You need to be a Superadmin to manage permissions. Contact your system administrator for access.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                      <Crown className="w-4 h-4 text-yellow-500" />
                      <span>Superadmin access required</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Empty Selection State */
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-full flex flex-col items-center justify-center p-12">
              <div className="text-center max-w-md">
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full"></div>
                  <Shield className="w-12 h-12 text-purple-500 relative top-6 left-6" />
                  <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-purple-500 animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Select a User to Begin
                </h3>
                <p className="text-gray-600 mb-8">
                  Choose a user from the list to view and manage their permissions.
                  You can grant, revoke, or reset permissions for each user.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Unlock className="w-6 h-6 text-blue-500" />
                    </div>
                    <p className="text-sm font-medium">Grant Permissions</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <ArrowUpRight className="w-6 h-6 text-green-500" />
                    </div>
                    <p className="text-sm font-medium">Change Roles</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Shield className="w-6 h-6 text-purple-500" />
                    </div>
                    <p className="text-sm font-medium">Manage Access</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}