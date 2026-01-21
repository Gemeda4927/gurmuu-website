"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/lib/store/auth.store";
import {
  Users,
  Shield,
  BarChart,
  Activity,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Database,
  Server,
  Globe,
  Lock,
  UserPlus,
  ArrowRight,
  Crown,
  Zap,
  Target,
  PieChart,
  Bell,
  Settings,
  Search,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  ChevronRight,
  Sparkles,
  Rocket,
  BarChart3,
  LineChart,
  ShieldCheck,
  UserCog,
  Cog,
  BellRing,
  Calendar,
  Clock,
  Download,
  Filter,
  RefreshCw,
} from "lucide-react";
import {
  useGetAllUsers,
  useGetUserStats,
  useSuperadminStatus,
} from "@/lib/hooks/useSuperadmin";
import Link from "next/link";
import StatsCard from "@/components/superadmin/StatsCard";
import QuickActionCard from "@/components/superadmin/QuickActionCard";
import RecentActivity from "@/components/superadmin/RecentActivity";
import SystemHealth from "@/components/superadmin/SystemHealth";

export default function SuperadminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } =
    useAuthStore();
  const { isSuperadmin } = useSuperadminStatus();

  const {
    data: usersData,
    isLoading: usersLoading,
    refetch,
  } = useGetAllUsers();
  const { data: statsData, refetch: refetchStats } = useGetUserStats();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (!isSuperadmin) {
        router.push("/dashboard");
      }
    }
  }, [
    isAuthenticated,
    isLoading,
    isSuperadmin,
    router,
  ]);

  const handleRefresh = () => {
    refetch();
    refetchStats();
  };

  if (isLoading || usersLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-gray-900 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium text-lg">
            Loading Superadmin Dashboard...
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Gathering all system insights
          </p>
        </div>
      </div>
    );
  }

  if (!user || !isSuperadmin) {
    return null;
  }

  // Calculate stats
  const stats = {
    totalUsers: usersData?.total || 0,
    activeUsers:
      usersData?.users?.filter((u) => u.isActive)
        .length || 0,
    admins:
      usersData?.users?.filter(
        (u) => u.role === "admin"
      ).length || 0,
    superadmins:
      usersData?.users?.filter(
        (u) => u.role === "superadmin"
      ).length || 0,
    inactiveUsers:
      usersData?.users?.filter((u) => !u.isActive)
        .length || 0,
  };

  const activityRate = Math.round((stats.activeUsers / stats.totalUsers) * 100) || 0;
  const adminPercentage = Math.round((stats.admins / stats.totalUsers) * 100) || 0;

  const quickActions = [
    {
      title: "Add New User",
      description: "Create a new user account",
      icon: UserPlus,
      path: "/superadmin/users/new",
      color: "from-blue-500 to-cyan-500",
      iconBg: "bg-gradient-to-br from-blue-100 to-cyan-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Manage Permissions",
      description: "Configure user permissions",
      icon: Lock,
      path: "/superadmin/permissions",
      color: "from-purple-500 to-pink-500",
      iconBg: "bg-gradient-to-br from-purple-100 to-pink-100",
      iconColor: "text-purple-600",
    },
    {
      title: "System Settings",
      description: "Configure system settings",
      icon: Cog,
      path: "/superadmin/settings",
      color: "from-green-500 to-emerald-500",
      iconBg: "bg-gradient-to-br from-green-100 to-emerald-100",
      iconColor: "text-green-600",
    },
    {
      title: "View Analytics",
      description: "System performance analytics",
      icon: BarChart3,
      path: "/superadmin/analytics",
      color: "from-orange-500 to-red-500",
      iconBg: "bg-gradient-to-br from-orange-100 to-red-100",
      iconColor: "text-orange-600",
    },
  ];

  const recentUsers = usersData?.users?.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-lg">
                <Crown className="w-7 h-7 text-yellow-400" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Welcome back, {user.name}!
                </h1>
                <p className="text-gray-600 mt-2 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-amber-500" />
                  You have complete control over the entire system
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
              title="Refresh Data"
            >
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </button>
            <div className="relative">
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-rose-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                3
              </div>
              <button className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-md">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Users className="w-7 h-7" />
              </div>
              <TrendingUp className="w-5 h-5 text-white/80" />
            </div>
            <div className="text-4xl font-bold mb-2">{stats.totalUsers}</div>
            <div className="text-sm font-medium opacity-90">Total Users</div>
            <div className="mt-4 text-sm flex items-center">
              <div className="bg-white/20 px-3 py-1 rounded-full text-xs">
                +12% from last month
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <CheckCircle className="w-7 h-7" />
              </div>
              <Activity className="w-5 h-5 text-white/80" />
            </div>
            <div className="text-4xl font-bold mb-2">{stats.activeUsers}</div>
            <div className="text-sm font-medium opacity-90">Active Users</div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span>Activity Rate</span>
                <span className="font-bold">{activityRate}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-white rounded-full h-2 transition-all duration-500" 
                  style={{ width: `${activityRate}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Shield className="w-7 h-7" />
              </div>
              <Zap className="w-5 h-5 text-white/80" />
            </div>
            <div className="text-4xl font-bold mb-2">{stats.admins}</div>
            <div className="text-sm font-medium opacity-90">Administrators</div>
            <div className="mt-4 flex items-center gap-4">
              <div className="text-xs bg-white/20 px-3 py-1 rounded-full">
                {stats.superadmins} superadmins
              </div>
              <div className="text-xs bg-white/20 px-3 py-1 rounded-full">
                {adminPercentage}% of total
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <Target className="w-5 h-5 text-white/80" />
            </div>
            <div className="text-4xl font-bold mb-2">{stats.inactiveUsers}</div>
            <div className="text-sm font-medium opacity-90">Inactive Users</div>
            <div className="mt-4 text-sm">
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs">
                Needs attention
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl">
                      <Rocket className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
                  </div>
                  <div className="text-sm text-gray-500">
                    Need help? <span className="text-blue-600 font-medium">View docs</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <Link
                      key={index}
                      href={action.path}
                      className="group block"
                    >
                      <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-5 hover:border-gray-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 ${action.iconBg} rounded-xl`}>
                            <action.icon className={`w-6 h-6 ${action.iconColor}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 group-hover:text-gray-700">
                              {action.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {action.description}
                            </p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
                    <UserCog className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Recent Users</h2>
                </div>
                <span className="text-sm text-gray-500">{recentUsers.length} users</span>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {recentUsers.map((user, index) => (
                <div
                  key={user._id}
                  className="p-4 hover:bg-gray-50 transition-colors duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${
                        user.isActive ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900 truncate">
                          {user.name}
                        </h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          user.role === 'superadmin'
                            ? 'bg-purple-100 text-purple-800'
                            : user.role === 'admin'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{user.email}</p>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-gray-100 rounded-lg transition-all duration-200">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
              
              {recentUsers.length === 0 && (
                <div className="p-8 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500">No users found</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100">
              <Link
                href="/superadmin/users"
                className="flex items-center justify-center text-blue-600 hover:text-blue-700 font-medium text-sm group"
              >
                View All Users
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* System Overview & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* System Health */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl">
                      <ShieldCheck className="w-5 h-5 text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">System Health</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-xs text-gray-600">Good</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">99.9%</div>
                    <div className="text-sm text-gray-600">Uptime</div>
                    <div className="mt-2 text-xs text-green-600 flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      All systems operational
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">42ms</div>
                    <div className="text-sm text-gray-600">Response Time</div>
                    <div className="mt-2 text-xs text-green-600 flex items-center justify-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Optimal performance
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">2.3K</div>
                    <div className="text-sm text-gray-600">Daily Requests</div>
                    <div className="mt-2 text-xs text-blue-600 flex items-center justify-center">
                      <Activity className="w-3 h-3 mr-1" />
                      +15% from yesterday
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Last updated: Just now</span>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                      View detailed metrics →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-white/10 rounded-xl">
                <LineChart className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Quick Stats</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <div className="text-sm text-gray-300">Avg. Session Duration</div>
                <div className="font-medium text-white">4m 32s</div>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <div className="text-sm text-gray-300">API Success Rate</div>
                <div className="font-medium text-green-400">99.7%</div>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <div className="text-sm text-gray-300">Active Sessions</div>
                <div className="font-medium text-white">247</div>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <div className="text-sm text-gray-300">Error Rate</div>
                <div className="font-medium text-red-400">0.03%</div>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <div className="text-sm text-gray-300">Data Storage</div>
                <div className="font-medium text-white">78%</div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="text-xs text-gray-400">
                Real-time monitoring enabled • Auto-scaling active
              </div>
            </div>
          </div>
        </div>

        {/* Users Overview Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl">
                  <PieChart className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Users Overview</h2>
                  <p className="text-sm text-gray-600">Detailed breakdown of user roles and status</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium">
                  <Download className="w-4 h-4 mr-2 inline" />
                  Export
                </button>
                <Link
                  href="/superadmin/users"
                  className="px-5 py-2.5 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl hover:opacity-90 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  Manage Users
                  <ArrowRight className="w-4 h-4 ml-2 inline" />
                </Link>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Role Distribution */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Role Distribution
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      role: "Superadmin",
                      count: stats.superadmins,
                      percentage: Math.round((stats.superadmins / stats.totalUsers) * 100),
                      color: "from-purple-500 to-pink-500",
                      bg: "bg-purple-100",
                      text: "text-purple-800",
                    },
                    {
                      role: "Admin",
                      count: stats.admins,
                      percentage: adminPercentage,
                      color: "from-blue-500 to-cyan-500",
                      bg: "bg-blue-100",
                      text: "text-blue-800",
                    },
                    {
                      role: "User",
                      count: stats.totalUsers - stats.admins - stats.superadmins,
                      percentage: Math.round(((stats.totalUsers - stats.admins - stats.superadmins) / stats.totalUsers) * 100),
                      color: "from-gray-500 to-gray-600",
                      bg: "bg-gray-100",
                      text: "text-gray-800",
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full bg-gradient-to-r ${item.color}`}></div>
                        <span className="font-medium text-gray-900">{item.role}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-900">{item.count}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.bg} ${item.text}`}>
                          {item.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Overview */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Status Overview
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">Active Users</span>
                      <span className="font-bold text-gray-900">{stats.activeUsers}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-full h-2 transition-all duration-700" 
                        style={{ width: `${activityRate}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">Inactive Users</span>
                      <span className="font-bold text-gray-900">{stats.inactiveUsers}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-full h-2 transition-all duration-700" 
                        style={{ width: `${Math.round((stats.inactiveUsers / stats.totalUsers) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Quick User Actions
                </h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <UserPlus className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-gray-900">Add New User</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </button>
                  
                  <button className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-purple-600" />
                      <span className="font-medium text-gray-900">Bulk Actions</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </button>
                  
                  <button className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <Settings className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-gray-900">System Audit</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center py-6">
          <p className="text-sm text-gray-500">
            Last refreshed: Just now • 
            <span className="mx-2">•</span>
            <span className="text-green-600 font-medium">All systems operational</span>
            <span className="mx-2">•</span>
            Need help? <span className="text-blue-600 cursor-pointer hover:underline">Contact support</span>
          </p>
        </div>
      </div>
    </div>
  );
}