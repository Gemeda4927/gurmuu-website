'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/lib/store/auth.store';
import { 
  Shield, Users, Settings, BarChart, 
  FileText, Calendar, CreditCard, 
  CheckCircle, AlertCircle, TrendingUp,
  Building, Globe, Key, Lock,
  UserPlus, ShieldCheck, Filter,
  Bell, Search, LogOut, ChevronRight,
  User
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, clearAuthData, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user?.role !== 'admin' && user?.role !== 'superadmin') {
        // Redirect non-admins to their appropriate dashboard
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  const handleLogout = () => {
    clearAuthData();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <p className="mt-4 text-blue-600 font-medium">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-blue-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-xs text-gray-500">Administrative Controls</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <div className="flex items-center justify-end">
                    <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize">
                      {user.role}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Welcome, {user.name}! 👑
                </h1>
                <p className="text-blue-100">
                  You have administrative privileges to manage users, roles, and system settings.
                </p>
              </div>
              <div className="hidden lg:block">
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                  <Shield className="w-10 h-10" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Users</p>
                <p className="text-2xl font-bold mt-2">1,254</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Admins</p>
                <p className="text-2xl font-bold mt-2">12</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending Requests</p>
                <p className="text-2xl font-bold mt-2">23</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">System Health</p>
                <p className="text-2xl font-bold mt-2">99.9%</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Admin Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Management */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">User Management</h3>
                <p className="text-sm text-gray-600">Manage all users</p>
              </div>
            </div>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 text-sm">
                View All Users
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 text-sm">
                Create New User
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 text-sm">
                Manage Permissions
              </button>
            </div>
          </div>

          {/* Role Management */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Role Management</h3>
                <p className="text-sm text-gray-600">Configure roles & permissions</p>
              </div>
            </div>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-purple-50 text-sm">
                View All Roles
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-purple-50 text-sm">
                Create New Role
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-purple-50 text-sm">
                Permission Settings
              </button>
            </div>
          </div>

          {/* System Settings */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <Settings className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">System Settings</h3>
                <p className="text-sm text-gray-600">Configure system</p>
              </div>
            </div>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-green-50 text-sm">
                General Settings
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-green-50 text-sm">
                Security Settings
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-green-50 text-sm">
                API Configuration
              </button>
            </div>
          </div>

          {/* Analytics */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <BarChart className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Analytics</h3>
                <p className="text-sm text-gray-600">View system analytics</p>
              </div>
            </div>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-orange-50 text-sm">
                User Analytics
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-orange-50 text-sm">
                System Performance
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-orange-50 text-sm">
                Activity Reports
              </button>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                <Lock className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Security</h3>
                <p className="text-sm text-gray-600">Security controls</p>
              </div>
            </div>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 text-sm">
                Audit Logs
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 text-sm">
                Login History
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 text-sm">
                Security Settings
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                <Zap className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Quick Actions</h3>
                <p className="text-sm text-gray-600">Common admin tasks</p>
              </div>
            </div>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-indigo-50 text-sm flex items-center">
                <UserPlus className="w-4 h-4 mr-2" />
                Add New Admin
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-indigo-50 text-sm flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-indigo-50 text-sm flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                System Maintenance
              </button>
            </div>
          </div>
        </div>

        {/* Recent Admin Activity */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-blue-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Admin Activity</h3>
          <div className="space-y-3">
            {[
              { action: 'Updated user permissions', admin: 'You', time: '2 min ago' },
              { action: 'Created new admin account', admin: 'Jane Smith', time: '15 min ago' },
              { action: 'Changed system settings', admin: 'You', time: '1 hour ago' },
              { action: 'Reviewed security logs', admin: 'John Doe', time: '2 hours ago' },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center p-3 rounded-lg hover:bg-blue-50">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-500">By {activity.admin} • {activity.time}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 border-t border-blue-200 bg-white py-6">
        <div className="px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-gray-900">Admin Dashboard</span>
            </div>
            <div className="text-sm text-gray-600">
              © {new Date().getFullYear()} Gurmuu • Admin Access Only
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Logged in as admin: {user.email} • Last login: Today, 10:30 AM
          </div>
        </div>
      </footer>
    </div>
  );
}

// Add missing Zap icon
const Zap = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);