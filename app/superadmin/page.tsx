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
  } = useGetAllUsers();
  const { data: statsData } = useGetUserStats();

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

  if (isLoading || usersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-gray-800 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading Dashboard...
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

  const quickActions = [
    {
      title: "Add New User",
      description: "Create a new user account",
      icon: UserPlus,
      path: "/superadmin/users/new",
      color: "bg-blue-500",
    },
    {
      title: "Manage Permissions",
      description: "Configure user permissions",
      icon: Lock,
      path: "/superadmin/permissions",
      color: "bg-purple-500",
    },
    {
      title: "System Settings",
      description: "Configure system settings",
      icon: Shield,
      path: "/superadmin/settings",
      color: "bg-green-500",
    },
    {
      title: "View Analytics",
      description: "System performance analytics",
      icon: BarChart,
      path: "/superadmin/analytics",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user.name}! 👑
        </h1>
        <p className="text-gray-600 mt-2">
          You have complete control over the
          entire system. Manage users,
          permissions, and system settings.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers.toString()}
          icon={Users}
          change="+12% from last month"
          trend="up"
          color="blue"
        />
        <StatsCard
          title="Active Users"
          value={stats.activeUsers.toString()}
          icon={CheckCircle}
          change={`${Math.round((stats.activeUsers / stats.totalUsers) * 100)}% active`}
          trend="up"
          color="green"
        />
        <StatsCard
          title="Administrators"
          value={stats.admins.toString()}
          icon={Shield}
          change={`${stats.superadmins} superadmins`}
          trend="neutral"
          color="purple"
        />
        <StatsCard
          title="Inactive Users"
          value={stats.inactiveUsers.toString()}
          icon={AlertTriangle}
          change="Needs attention"
          trend="down"
          color="red"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <QuickActionCard
              key={index}
              {...action}
            />
          ))}
        </div>
      </div>

      {/* Recent Activity & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <SystemHealth />
      </div>

      {/* Users Overview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Users Overview
            </h2>
            <p className="text-sm text-gray-500">
              Manage all system users
            </p>
          </div>
          <Link
            href="/superadmin/users"
            className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            View All Users
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Role
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Count
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Active
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  role: "Superadmin",
                  count: stats.superadmins,
                  active: stats.superadmins,
                  status: "All Active",
                },
                {
                  role: "Admin",
                  count: stats.admins,
                  active: stats.admins,
                  status: `${Math.round((stats.admins / (stats.admins || 1)) * 100)}% Active`,
                },
                {
                  role: "User",
                  count:
                    stats.totalUsers -
                    stats.admins -
                    stats.superadmins,
                  active:
                    stats.activeUsers -
                    stats.admins -
                    stats.superadmins,
                  status: `${Math.round(((stats.activeUsers - stats.admins - stats.superadmins) / (stats.totalUsers - stats.admins - stats.superadmins || 1)) * 100)}% Active`,
                },
              ].map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full mr-3 ${
                          row.role ===
                          "Superadmin"
                            ? "bg-purple-500"
                            : row.role === "Admin"
                              ? "bg-blue-500"
                              : "bg-gray-400"
                        }`}
                      />
                      <span className="font-medium text-gray-900">
                        {row.role}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-lg font-semibold text-gray-900">
                      {row.count}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-900">
                      {row.active}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        row.status.includes(
                          "100%"
                        )
                          ? "bg-green-100 text-green-800"
                          : row.status.includes(
                                "Active"
                              )
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
