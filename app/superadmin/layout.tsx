'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useAuthStore from '@/lib/store/auth.store';
import Link from 'next/link';
import { 
  Crown, Users, Key, Settings, 
  LogOut, Home,
  Menu, X, Bell, Search,
  Shield,
  BarChart3,
  Database,
  ShieldCheck,
  UserCheck,
  CheckCircle,
  Activity,
  Filter,
  Globe,
  ChevronDown,
  MoreVertical,
  Calendar,
  Clock
} from 'lucide-react';

interface SuperadminLayoutProps {
  children: ReactNode;
}

export default function SuperadminLayout({ children }: SuperadminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, clearAuthData, isAuthenticated, hasHydrated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (hasHydrated) {
      setIsChecking(false);
      
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }
      
      if (user?.role !== 'superadmin') {
        router.push('/dashboard');
        return;
      }
    }
  }, [hasHydrated, isAuthenticated, user, router]);

  const handleLogout = () => {
    clearAuthData();
    router.push('/');
  };

  const navItems = [
    { 
      name: 'Dashboard', 
      icon: Home, 
      path: '/superadmin',
      color: 'bg-blue-50 text-blue-600'
    },
    { 
      name: 'Users', 
      icon: Users, 
      path: '/superadmin/users',
      color: 'bg-emerald-50 text-emerald-600',
      count: 245
    },
    { 
      name: 'Permissions', 
      icon: ShieldCheck, 
      path: '/superadmin/permissions',
      color: 'bg-purple-50 text-purple-600'
    },
    { 
      name: 'Analytics', 
      icon: BarChart3, 
      path: '/superadmin/analytics',
      color: 'bg-amber-50 text-amber-600'
    },
    { 
      name: 'Settings', 
      icon: Settings, 
      path: '/superadmin/settings',
      color: 'bg-gray-50 text-gray-600'
    },
  ];

  const stats = [
    { label: 'Active Users', value: '1,248', change: '+12%', icon: UserCheck, color: 'bg-blue-500' },
    { label: 'System Health', value: '98.5%', change: '✓', icon: CheckCircle, color: 'bg-emerald-500' },
    { label: 'API Requests', value: '24.5k', change: '+23%', icon: Activity, color: 'bg-purple-500' },
    { label: 'Storage', value: '85%', change: '+5%', icon: Database, color: 'bg-amber-500' },
  ];

  if (isChecking || !hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="relative inline-block mb-6">
            <div className="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
            <Crown className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Loading Dashboard</h3>
          <p className="text-gray-400 text-sm">Please wait...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'superadmin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-white z-50 lg:hidden shadow-xl">
            <div className="flex flex-col h-full">
              {/* Logo & Close */}
              <div className="px-5 py-4 border-b">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Crown className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h1 className="font-bold text-gray-800">Superadmin</h1>
                      <p className="text-xs text-blue-500">Control Panel</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 hover:bg-gray-50 rounded-lg"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                {/* User Profile - FIXED SPACING */}
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-base">
                      {user?.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white border border-blue-500 rounded-full flex items-center justify-center">
                      <Shield className="w-2 h-2 text-blue-500" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate text-sm">{user?.name || 'Admin'}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@example.com'}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                        Super Admin
                      </span>
                      <span className="flex items-center text-xs text-emerald-600">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1"></div>
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation - PROPER SPACING */}
              <div className="flex-1 px-3 py-3">
                <nav className="space-y-0.5">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg ${
                        pathname === item.path 
                          ? `${item.color} border-l-3 border-blue-500` 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="w-4 h-4" />
                        <span className="font-medium text-sm">{item.name}</span>
                      </div>
                      {item.count && (
                        <span className="px-1.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                          {item.count}
                        </span>
                      )}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Logout - PERFECT SPACING */}
              <div className="px-5 py-4 border-t">
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center w-full px-3 py-2.5 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout Session
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Desktop Layout */}
      <div className="lg:flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 fixed left-0 top-0 h-screen bg-white border-r border-gray-200">
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="px-5 py-4 border-b">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Crown className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-gray-800 text-base">Superadmin</h1>
                  <p className="text-xs text-blue-500">Control Panel</p>
                </div>
              </div>
            </div>

            {/* User Profile - PERFECTLY ALIGNED */}
            <div className="px-5 py-4 border-b">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-base">
                    {user?.name?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white border border-blue-500 rounded-full flex items-center justify-center">
                    <Shield className="w-2 h-2 text-blue-500" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@example.com'}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                      Super Admin
                    </span>
                    <span className="flex items-center text-xs text-emerald-600">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1"></div>
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation - PERFECT SPACING */}
            <div className="flex-1 px-3 py-4">
              <nav className="space-y-0.5">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                      pathname === item.path 
                        ? `${item.color} border-l-3 border-blue-500` 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-4 h-4" />
                      <span className="font-medium text-sm">{item.name}</span>
                    </div>
                    {item.count && (
                      <span className="px-1.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                        {item.count}
                      </span>
                    )}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Logout - PERFECT SPACING */}
            <div className="px-5 py-4 border-t">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center w-full px-3 py-2.5 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout Session
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:pl-64 flex flex-col flex-1">
          {/* Header - FIXED SPACING */}
          <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
            <div className="px-5 lg:px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden p-2 -ml-1 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-50 mr-3"
                  >
                    <Menu className="w-4 h-4" />
                  </button>
                  
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
                    <p className="text-xs text-gray-500 flex items-center mt-0.5">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Search - PERFECT SPACING */}
                  <div className="hidden md:block relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users, permissions, settings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 pr-4 py-2 w-56 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg">
                    <Filter className="w-4 h-4" />
                  </button>
                  
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg relative">
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  </button>

                  <div className="hidden lg:flex items-center space-x-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Stats Bar - PERFECT GRID SPACING */}
          <div className="px-5 lg:px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 ${stat.color} rounded-lg`}>
                      <stat.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className={`text-xs font-medium ${
                      stat.change.includes('+') ? 'text-emerald-500' : 
                      stat.change === '✓' ? 'text-blue-500' : 'text-gray-500'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-xl font-semibold text-gray-800">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Area - PROPER PADDING */}
          <main className="flex-1">
            <div className="px-5 lg:px-6 pb-6">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                {children}
              </div>
            </div>
          </main>

          {/* Footer - PERFECT ALIGNMENT */}
          <footer className="border-t border-gray-200">
            <div className="px-5 lg:px-6 py-3">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center space-x-4 mb-2 md:mb-0">
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></div>
                    <p className="text-xs text-gray-600">All systems operational</p>
                  </div>
                  <span className="hidden md:inline text-gray-300">•</span>
                  <p className="text-xs text-gray-500">Version 3.0.1</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-xs text-gray-500">
                    <Globe className="w-3 h-3 mr-1" />
                    <span>GMT+3</span>
                  </div>
                  <span className="hidden md:inline text-gray-300">•</span>
                  <p className="text-xs text-gray-500">© 2024 Superadmin Panel</p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}