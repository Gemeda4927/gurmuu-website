'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuthStore from '@/lib/store/auth.store';
import { useAdmin } from '@/lib/hooks/useAdmin';
import { 
  Shield, Users, Settings, BarChart, 
  FileText, CheckCircle, AlertCircle, TrendingUp,
  Building, Globe, Key, Lock,
  UserPlus, ShieldCheck, Filter,
  Bell, Search, LogOut, ChevronRight,
  User, Zap, Eye, Edit, Trash2,
  RefreshCw, Loader2, Crown,
  Activity, Database, Terminal,
  Download, Send, Mail, AlertTriangle,
  ClipboardList, History, ShieldAlert,
  UserCog, KeyRound, EyeOff,
  LayoutDashboard, Server, Network,
  Clock, Cpu, HardDrive, Wifi,
  ChartBar, ChartLine, ChartPie,
  Target, Users2, UserCheck, UserX,
  Briefcase, Globe2, ShieldX, KeySquare,
  FileKey, ServerCog, DatabaseBackup,
  FileSpreadsheet, MessageSquare, BellRing,
  MailOpen, ShieldHalf, UserSearch, FileEdit,
  GlobeLock, Cctv, FileSearch, BellIcon,
  Home, HelpCircle, DatabaseIcon,
  UserCircle, CreditCard, Calendar,
  FolderOpen, ShieldPlus, UsersIcon,
  ChartBarBig, ChartLine as ChartLineIcon,
  PieChart as PieChartIcon, LineChart,
  Settings2, FolderKey, NetworkIcon
} from 'lucide-react';
import { toast } from 'sonner';

// Color theme configuration
const THEME = {
  primary: {
    light: '#6366f1',
    DEFAULT: '#4f46e5',
    dark: '#4338ca'
  },
  secondary: {
    light: '#8b5cf6',
    DEFAULT: '#7c3aed',
    dark: '#6d28d9'
  },
  success: {
    light: '#10b981',
    DEFAULT: '#059669',
    dark: '#047857'
  },
  warning: {
    light: '#f59e0b',
    DEFAULT: '#d97706',
    dark: '#b45309'
  },
  danger: {
    light: '#ef4444',
    DEFAULT: '#dc2626',
    dark: '#b91c1c'
  },
  info: {
    light: '#3b82f6',
    DEFAULT: '#2563eb',
    dark: '#1d4ed8'
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827'
  }
};

// Enhanced permission categories with icons and descriptions
const PERMISSION_CATEGORIES = {
  users: {
    icon: UsersIcon,
    title: 'User Management',
    description: 'Manage user accounts and permissions',
    color: THEME.primary.DEFAULT,
    gradient: 'from-indigo-500 to-blue-500',
    permissions: ['manage_users', 'deactivate_users', 'view_all_users']
  },
  content: {
    icon: FileText,
    title: 'Content',
    description: 'Content creation and management',
    color: THEME.success.DEFAULT,
    gradient: 'from-emerald-500 to-teal-500',
    permissions: ['manage_content', 'create_content', 'edit_content', 'delete_content', 'publish_content']
  },
  settings: {
    icon: Settings2,
    title: 'System Settings',
    description: 'Configure system preferences',
    color: THEME.secondary.DEFAULT,
    gradient: 'from-violet-500 to-purple-500',
    permissions: ['manage_settings', 'update_system_settings']
  },
  security: {
    icon: ShieldPlus,
    title: 'Security',
    description: 'Security controls and monitoring',
    color: THEME.danger.DEFAULT,
    gradient: 'from-rose-500 to-red-500',
    permissions: ['view_audit_logs']
  },
  roles: {
    icon: FolderKey,
    title: 'Roles',
    description: 'Role and permission management',
    color: THEME.warning.DEFAULT,
    gradient: 'from-amber-500 to-orange-500',
    permissions: ['manage_roles', 'assign_permissions']
  },
  analytics: {
    icon: ChartBarBig,
    title: 'Analytics',
    description: 'Data insights and reporting',
    color: THEME.info.DEFAULT,
    gradient: 'from-blue-500 to-cyan-500',
    permissions: ['view_analytics', 'export_data']
  },
  notifications: {
    icon: BellIcon,
    title: 'Notifications',
    description: 'Communication management',
    color: THEME.secondary.DEFAULT,
    gradient: 'from-fuchsia-500 to-pink-500',
    permissions: ['send_notifications', 'manage_notifications']
  }
};

// Enhanced permission icon mapping
const PERMISSION_ICONS: Record<string, any> = {
  'manage_users': UsersIcon,
  'deactivate_users': UserX,
  'view_all_users': UserSearch,
  'manage_content': FileEdit,
  'create_content': FileText,
  'edit_content': Edit,
  'delete_content': Trash2,
  'publish_content': Send,
  'manage_settings': Settings2,
  'update_system_settings': ServerCog,
  'view_audit_logs': ShieldAlert,
  'manage_roles': UserCog,
  'assign_permissions': KeySquare,
  'view_analytics': ChartLineIcon,
  'export_data': Download,
  'send_notifications': BellRing,
  'manage_notifications': MailOpen
};

export default function AdminDashboard() {
  const router = useRouter();
  const { user, clearAuthData, isAuthenticated } = useAuthStore();
  
  const {
    users,
    loading,
    error,
    activeUsers,
    inactiveUsers,
    usersByRole,
    
    // Actions
    fetchAllUsers,
    activateUser,
    deactivateUser,
    
    // UI Actions
    clearError,
    clearUsers,
  } = useAdmin();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [availablePermissions, setAvailablePermissions] = useState<Record<string, string>>({});
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Stats data
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalAdmins: 0,
    totalSuperadmins: 0,
    totalPermissions: 0,
    yourPermissions: 0,
    pendingApprovals: 12,
    systemUptime: '99.9%',
    avgResponseTime: '142ms'
  });

  // Fetch all permissions
  const fetchPermissions = useCallback(async () => {
    try {
      setIsLoadingPermissions(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await fetch('https://gurmuu.onrender.com/api/v1/permissions/all/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch permissions');
      }

      setAvailablePermissions(data.permissions || {});
      
      // Calculate stats
      const permKeys = Object.keys(data.permissions || {});
      setStats(prev => ({
        ...prev,
        totalPermissions: permKeys.length
      }));

    } catch (error: any) {
      console.error('Failed to fetch permissions:', error);
      toast.error(error.message || 'Failed to load permissions');
    } finally {
      setIsLoadingPermissions(false);
    }
  }, []);

  // Check authentication and admin role
  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated) {
        router.push('/login');
        return false;
      }
      
      if (user?.role !== 'admin' && user?.role !== 'superadmin') {
        router.push('/dashboard');
        return false;
      }
      
      return true;
    };

    if (checkAuth()) {
      fetchPermissions();
    }
  }, [isAuthenticated, user, router, fetchPermissions]);

  // Set user permissions
  useEffect(() => {
    if (user?.permissions) {
      setUserPermissions(user.permissions);
      setStats(prev => ({
        ...prev,
        yourPermissions: user.permissions.length
      }));
    }
  }, [user]);

  // Fetch initial data
  useEffect(() => {
    if (user?.permissions?.includes('view_all_users')) {
      const token = localStorage.getItem('token');
      if (token) {
        fetchInitialData(token);
      }
    }
  }, [user]);

  const fetchInitialData = async (token: string) => {
    try {
      await fetchAllUsers(token, 1, 10);
      calculateStats();
    } catch (error) {
      console.error('Failed to fetch initial data:', error);
      toast.error('Failed to load dashboard data');
    }
  };

  // Calculate statistics
  const calculateStats = useCallback(() => {
    const totalUsers = users.length;
    const activeUsersCount = activeUsers.length;
    const inactiveUsersCount = inactiveUsers.length;
    const totalAdmins = usersByRole.admins.length;
    const totalSuperadmins = usersByRole.superadmins.length;

    setStats(prev => ({
      ...prev,
      totalUsers,
      activeUsers: activeUsersCount,
      inactiveUsers: inactiveUsersCount,
      totalAdmins,
      totalSuperadmins
    }));
  }, [users, activeUsers, inactiveUsers, usersByRole]);

  // Update stats when users change
  useEffect(() => {
    if (users.length > 0) {
      calculateStats();
    }
  }, [users, calculateStats]);

  // Permission check helper
  const checkPermission = useCallback((permissionKey: string): boolean => {
    if (user?.role === 'superadmin') return true;
    return userPermissions.includes(permissionKey);
  }, [user, userPermissions]);

  // Get permission display name
  const getPermissionDisplayName = useCallback((permissionKey: string): string => {
    if (availablePermissions[permissionKey]) {
      return availablePermissions[permissionKey];
    }
    
    return permissionKey
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }, [availablePermissions]);

  // Get permission category
  const getPermissionCategory = useCallback((permissionKey: string): string => {
    for (const [category, catInfo] of Object.entries(PERMISSION_CATEGORIES)) {
      if (catInfo.permissions.includes(permissionKey)) {
        return category;
      }
    }
    return 'other';
  }, []);

  // Get user's permissions by category
  const getUserPermissionsByCategory = useMemo(() => {
    const categorized: Record<string, string[]> = {};
    
    userPermissions.forEach(perm => {
      const category = getPermissionCategory(perm);
      if (!categorized[category]) {
        categorized[category] = [];
      }
      categorized[category].push(perm);
    });
    
    return categorized;
  }, [userPermissions, getPermissionCategory]);

  // Get color classes based on permission category
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      users: 'bg-gradient-to-r from-indigo-500/10 to-blue-500/10 text-indigo-700 border-indigo-200',
      content: 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-700 border-emerald-200',
      settings: 'bg-gradient-to-r from-violet-500/10 to-purple-500/10 text-violet-700 border-violet-200',
      security: 'bg-gradient-to-r from-rose-500/10 to-red-500/10 text-rose-700 border-rose-200',
      roles: 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-700 border-amber-200',
      analytics: 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-700 border-blue-200',
      notifications: 'bg-gradient-to-r from-fuchsia-500/10 to-pink-500/10 text-fuchsia-700 border-fuchsia-200',
      other: 'bg-gradient-to-r from-gray-500/10 to-slate-500/10 text-gray-700 border-gray-200'
    };
    return colors[category] || colors.other;
  };

  // Get icon based on permission
  const getPermissionIcon = (permissionKey: string) => {
    const Icon = PERMISSION_ICONS[permissionKey] || Key;
    return <Icon className="w-4 h-4" />;
  };

  // Filter features based on permissions
  const getFilteredFeatures = useMemo(() => {
    const features = [];
    
    if (checkPermission('view_all_users') || checkPermission('manage_users')) {
      features.push({
        id: 'users',
        ...PERMISSION_CATEGORIES.users,
        actions: [
          { label: 'View All Users', href: '/admin/users', requires: 'view_all_users' },
          { label: 'Create New User', href: '/admin/users/create', requires: 'manage_users' },
          { label: 'User Analytics', href: '/admin/users/analytics', requires: 'view_analytics' }
        ]
      });
    }
    
    if (checkPermission('manage_content') || checkPermission('view_all_users')) {
      features.push({
        id: 'content',
        ...PERMISSION_CATEGORIES.content,
        actions: [
          { label: 'Manage Content', href: '/admin/content', requires: 'manage_content' },
          { label: 'Create Content', href: '/admin/content/create', requires: 'create_content' },
          { label: 'Content Analytics', href: '/admin/content/analytics', requires: 'view_analytics' }
        ]
      });
    }
    
    if (checkPermission('manage_settings')) {
      features.push({
        id: 'settings',
        ...PERMISSION_CATEGORIES.settings,
        actions: [
          { label: 'General Settings', href: '/admin/settings/general', requires: 'manage_settings' },
          { label: 'Security Settings', href: '/admin/settings/security', requires: 'manage_settings' },
          { label: 'API Configuration', href: '/admin/settings/api', requires: 'update_system_settings' }
        ]
      });
    }
    
    if (checkPermission('view_audit_logs')) {
      features.push({
        id: 'security',
        ...PERMISSION_CATEGORIES.security,
        actions: [
          { label: 'Audit Logs', href: '/admin/security/logs', requires: 'view_audit_logs' },
          { label: 'Login History', href: '/admin/security/login-history', requires: 'view_audit_logs' }
        ]
      });
    }
    
    if (checkPermission('manage_roles') || checkPermission('assign_permissions')) {
      features.push({
        id: 'roles',
        ...PERMISSION_CATEGORIES.roles,
        actions: [
          { label: 'Manage Roles', href: '/admin/roles', requires: 'manage_roles' },
          { label: 'Assign Permissions', href: '/admin/permissions/assign', requires: 'assign_permissions' }
        ]
      });
    }
    
    if (checkPermission('view_analytics')) {
      features.push({
        id: 'analytics',
        ...PERMISSION_CATEGORIES.analytics,
        actions: [
          { label: 'User Analytics', href: '/admin/analytics/users', requires: 'view_analytics' },
          { label: 'System Performance', href: '/admin/analytics/system', requires: 'view_analytics' }
        ]
      });
    }
    
    if (checkPermission('send_notifications') || checkPermission('manage_notifications')) {
      features.push({
        id: 'notifications',
        ...PERMISSION_CATEGORIES.notifications,
        actions: [
          { label: 'Send Notification', href: '/admin/notifications/send', requires: 'send_notifications' },
          { label: 'Notification Templates', href: '/admin/notifications/templates', requires: 'manage_notifications' }
        ]
      });
    }
    
    return features;
  }, [checkPermission]);

  // Handle user actions
  const handleUserAction = async (action: string, userId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Authentication required');
      return;
    }

    try {
      switch (action) {
        case 'activate':
          if (checkPermission('manage_users')) {
            await activateUser(token, userId);
            toast.success('User activated successfully');
          } else {
            toast.error('You need "manage_users" permission');
          }
          break;
        case 'deactivate':
          if (checkPermission('deactivate_users')) {
            await deactivateUser(token, userId);
            toast.success('User deactivated successfully');
          } else {
            toast.error('You need "deactivate_users" permission');
          }
          break;
        case 'edit':
          if (checkPermission('manage_users')) {
            router.push(`/admin/users/${userId}/edit`);
          } else {
            toast.error('You need "manage_users" permission');
          }
          break;
        case 'view':
          if (checkPermission('view_all_users')) {
            router.push(`/admin/users/${userId}`);
          } else {
            toast.error('You need "view_all_users" permission');
          }
          break;
      }
    } catch (error: any) {
      toast.error(error.message || 'Action failed');
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsRefreshing(true);
      try {
        await Promise.all([
          fetchPermissions(),
          checkPermission('view_all_users') ? fetchAllUsers(token, 1, 10) : Promise.resolve()
        ]);
        toast.success('Dashboard refreshed');
      } catch (error) {
        toast.error('Failed to refresh data');
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  // Handle logout
  const handleLogout = () => {
    clearAuthData();
    clearUsers();
    clearError();
    router.push('/');
    toast.success('Logged out successfully');
  };

  // Loading state
  if ((loading || isLoadingPermissions) && users.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="text-center">
          <div className="relative mx-auto w-20 h-20">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-xl opacity-30"></div>
            <div className="relative w-20 h-20 border-4 border-gray-200 rounded-full">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500 rounded-full animate-spin border-t-transparent border-r-transparent"></div>
            </div>
          </div>
          <p className="mt-6 text-lg font-semibold text-gray-800">Loading Dashboard</p>
          <p className="text-sm text-gray-500 mt-2">Preparing your workspace...</p>
        </div>
      </div>
    );
  }

  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Modern Sidebar Navigation */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 hidden lg:block">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
              <p className="text-xs text-gray-500">Permission System</p>
            </div>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 border border-indigo-100' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-medium">Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'users' ? 'bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 border border-indigo-100' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <UsersIcon className="w-5 h-5" />
              <span className="font-medium">Users</span>
              {stats.totalUsers > 0 && (
                <span className="ml-auto bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-1 rounded-full">
                  {stats.totalUsers}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('permissions')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'permissions' ? 'bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 border border-indigo-100' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <Key className="w-5 h-5" />
              <span className="font-medium">Permissions</span>
              {stats.yourPermissions > 0 && (
                <span className="ml-auto bg-amber-100 text-amber-700 text-xs font-medium px-2 py-1 rounded-full">
                  {stats.yourPermissions}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'analytics' ? 'bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 border border-indigo-100' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <ChartBarBig className="w-5 h-5" />
              <span className="font-medium">Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 border border-indigo-100' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <Settings2 className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </button>
          </nav>

          <div className="mt-auto pt-8 border-t border-gray-200">
            <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-xl">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                <div className="flex items-center">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${user.role === 'superadmin' ? 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'}`}>
                    {user.role}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <div className="hidden md:flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">System • {stats.systemUptime} uptime</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {isRefreshing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline text-sm font-medium">Refresh</span>
                </button>

                <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors relative">
                  <Bell className="w-5 h-5 text-gray-600" />
                  {stats.pendingApprovals > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {stats.pendingApprovals}
                    </span>
                  )}
                </button>

                <div className="lg:hidden">
                  <button className="p-2 hover:bg-gray-100 rounded-xl">
                    <Menu className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {/* Welcome Banner */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 text-white shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    Welcome back, {user.name.split(' ')[0]}! 👋
                  </h1>
                  <p className="text-indigo-100/90 mb-4 max-w-2xl">
                    You have <span className="font-bold">{userPermissions.length}</span> permission{
                      userPermissions.length !== 1 ? 's' : ''
                    } across <span className="font-bold">{Object.keys(getUserPermissionsByCategory).length}</span> categories. 
                    Everything you see is tailored to your access level.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                      Role: {user.role}
                    </span>
                    <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                      Permissions: {userPermissions.length}
                    </span>
                    <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                      Last login: Today
                    </span>
                  </div>
                </div>
                <div className="mt-6 md:mt-0">
                  <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <ShieldCheck className="w-12 h-12" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Users Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-2">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                  <div className="flex items-center mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 rounded-full" 
                        style={{ width: `${(stats.activeUsers / Math.max(stats.totalUsers, 1)) * 100}%` }}
                      ></div>
                    </div>
                    <span className="ml-3 text-xs font-medium text-gray-600">
                      {stats.activeUsers} active
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                  <UsersIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            {/* Your Permissions Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-2">Your Permissions</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.yourPermissions}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {Math.round((stats.yourPermissions / Math.max(stats.totalPermissions, 1)) * 100)}% of total
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl flex items-center justify-center">
                  <Key className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>

            {/* System Health Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-2">System Health</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.systemUptime}</p>
                  <div className="flex items-center mt-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-xs font-medium text-gray-600">All systems operational</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                  <Server className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Response Time Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-2">Avg Response Time</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.avgResponseTime}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-xs font-medium text-gray-600">2.4% faster</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {getFilteredFeatures.map((feature) => {
              const Icon = feature.icon;
              const hasAnyPermission = feature.permissions.some(perm => checkPermission(perm));
              
              return hasAnyPermission ? (
                <div 
                  key={feature.id} 
                  className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-start mb-5">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-bold text-gray-900">{feature.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {feature.actions.map((action, index) => {
                      const hasActionPermission = checkPermission(action.requires);
                      return hasActionPermission ? (
                        <Link
                          key={index}
                          href={action.href}
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 group/action transition-colors"
                        >
                          <span className="text-sm font-medium text-gray-700 group-hover/action:text-gray-900">
                            {action.label}
                          </span>
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover/action:text-gray-600" />
                        </Link>
                      ) : null;
                    })}
                  </div>
                </div>
              ) : null;
            })}
          </div>

          {/* Recent Activity & Permissions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Users */}
            {checkPermission('view_all_users') && users.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Recent Users</h3>
                    <p className="text-sm text-gray-500">Newly registered users</p>
                  </div>
                  <Link 
                    href="/admin/users"
                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity text-sm font-medium"
                  >
                    View All
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {users.slice(0, 4).map((userItem) => (
                    <div key={userItem._id} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                          {userItem.name.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-gray-900">{userItem.name}</p>
                          <p className="text-sm text-gray-500">{userItem.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          userItem.role === 'superadmin' 
                            ? 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800'
                            : userItem.role === 'admin'
                            ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800'
                            : 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800'
                        }`}>
                          {userItem.role}
                        </span>
                        <button 
                          onClick={() => handleUserAction('view', userItem._id!)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Your Permissions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Your Permissions</h3>
                  <p className="text-sm text-gray-500">Access rights assigned to you</p>
                </div>
                <span className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 rounded-full text-sm font-medium">
                  {userPermissions.length} total
                </span>
              </div>
              
              {userPermissions.length > 0 ? (
                <div className="space-y-3">
                  {userPermissions.slice(0, 5).map((permission) => {
                    const category = getPermissionCategory(permission);
                    return (
                      <div 
                        key={permission} 
                        className={`p-4 rounded-xl border ${getCategoryColor(category)} flex items-center justify-between`}
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg bg-white/50 flex items-center justify-center mr-3">
                            {getPermissionIcon(permission)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {getPermissionDisplayName(permission)}
                            </p>
                            <p className="text-xs text-gray-600 capitalize">{category}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    );
                  })}
                  
                  {userPermissions.length > 5 && (
                    <Link
                      href="/admin/permissions"
                      className="block text-center p-3 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl transition-colors text-sm font-medium"
                    >
                      View all {userPermissions.length} permissions
                    </Link>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <KeyRound className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">No permissions assigned</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Contact a superadmin to request access
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
                <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activeUsers}</p>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
                <div className="w-10 h-10 bg-gradient-to-r from-red-100 to-rose-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <p className="text-sm text-gray-600">Inactive Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.inactiveUsers}</p>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Crown className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-sm text-gray-600">Admins</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalAdmins + stats.totalSuperadmins}</p>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <DatabaseIcon className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600">Total Permissions</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalPermissions}</p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-8 border-t border-gray-200 bg-white py-6">
          <div className="px-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="font-bold text-gray-900">Admin Dashboard</span>
                  <p className="text-xs text-gray-500">Fine-grained permission control system</p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <div className="flex items-center space-x-6">
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    System operational
                  </span>
                  <span>v2.1.0</span>
                  <span>© {new Date().getFullYear()}</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden">
        <div className="flex justify-around p-4">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`flex flex-col items-center p-2 ${activeTab === 'overview' ? 'text-indigo-600' : 'text-gray-500'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-xs mt-1">Overview</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex flex-col items-center p-2 ${activeTab === 'users' ? 'text-indigo-600' : 'text-gray-500'}`}
          >
            <UsersIcon className="w-5 h-5" />
            <span className="text-xs mt-1">Users</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('permissions')}
            className={`flex flex-col items-center p-2 ${activeTab === 'permissions' ? 'text-indigo-600' : 'text-gray-500'}`}
          >
            <Key className="w-5 h-5" />
            <span className="text-xs mt-1">Perms</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center p-2 ${activeTab === 'settings' ? 'text-indigo-600' : 'text-gray-500'}`}
          >
            <Settings2 className="w-5 h-5" />
            <span className="text-xs mt-1">Settings</span>
          </button>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(-20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
        
        /* Smooth transitions */
        * {
          transition: background-color 0.2s ease, border-color 0.2s ease;
        }
      `}</style>
    </div>
  );
}

// Add missing Menu icon import
const Menu = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);