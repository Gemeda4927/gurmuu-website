"use client";

import { ReactNode, useEffect, useMemo, useState, MouseEvent } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/auth.store";
import {
  Crown,
  Users,
  ShieldCheck,
  Settings,
  LogOut,
  Home,
  Bell,
  Search,
  BarChart3,
  Database,
  UserCheck,
  CheckCircle,
  Activity,
  Globe,
  Calendar,
  Clock,
} from "lucide-react";

interface SuperadminLayoutProps {
  children: ReactNode;
}

export default function SuperadminLayout({ children }: SuperadminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const {
    user,
    clearAuthData,
    isAuthenticated,
    hasHydrated,
    isLoading,
  } = useAuthStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const isSuperadminRoute = pathname.startsWith("/superadmin");

  /* ───────────────────── DEBUG ───────────────────── */
  useEffect(() => {
    console.log("🧠 Auth Debug", {
      pathname,
      isAuthenticated,
      hasHydrated,
      isLoading,
      role: user?.role,
      isSuperadminRoute,
      userExists: !!user,
    });
  }, [pathname, isAuthenticated, hasHydrated, isLoading, user, isSuperadminRoute]);

  /* ───────────────────── AUTH GUARD ───────────────────── */
  useEffect(() => {
    console.log("🔐 Auth Guard Check:", {
      hasHydrated,
      isLoading,
      isAuthenticated,
      userRole: user?.role,
      isSuperadminRoute,
      pathname
    });

    // Wait for hydration/loading to complete
    if (!hasHydrated || isLoading) {
      console.log("⏳ Waiting for hydration/loading to complete");
      return;
    }

    // Check if user exists
    if (!user) {
      console.log("❌ No user found, redirecting to login");
      router.replace("/login");
      return;
    }

    // Check authentication status
    if (!isAuthenticated) {
      console.log("❌ Not authenticated, redirecting to login");
      router.replace("/login");
      return;
    }

    // Check superadmin access for superadmin routes
    if (isSuperadminRoute && user.role !== "superadmin") {
      console.log("🚫 Unauthorized access to superadmin route, redirecting to dashboard");
      router.replace("/dashboard");
      return;
    }

    // User is authenticated and authorized
    console.log("✅ User authorized for route:", pathname);
  }, [hasHydrated, isLoading, isAuthenticated, user, isSuperadminRoute, router, pathname]);

  /* ───────────────────── NAV ───────────────────── */
  const navItems = useMemo(
    () => [
      { name: "Dashboard", icon: Home, path: "/superadmin" },
      { name: "Users", icon: Users, path: "/superadmin/users" },
      { name: "Permissions", icon: ShieldCheck, path: "/superadmin/permissions" },
      { name: "Events", icon: BarChart3, path: "/superadmin/events" },
      { name: "Settings", icon: Settings, path: "/superadmin/settings" },
    ],
    []
  );

  const stats = useMemo(
    () => [
      { label: "Active Users", value: "1,248", icon: UserCheck },
      { label: "System Health", value: "98.5%", icon: CheckCircle },
      { label: "API Requests", value: "24.5k", icon: Activity },
      { label: "Storage", value: "85%", icon: Database },
    ],
    []
  );

  /* ───────────────────── LOADING ───────────────────── */
  if (!hasHydrated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="relative inline-block mb-6">
            <div className="w-16 h-16 border-4 border-blue-100 rounded-full" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-blue-500 rounded-full animate-spin border-t-transparent" />
            <Crown className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-500" />
          </div>
          <p className="text-sm text-gray-500">Loading admin panel…</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated or no user
  if (!isAuthenticated || !user) {
    return null;
  }

  // Redirect protection for non-superadmin users on superadmin routes
  if (isSuperadminRoute && user.role !== "superadmin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <ShieldCheck className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have permission to access this area.</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`);

  const handleLogout = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("👋 Logging out user");
    clearAuthData();
    router.replace("/login");
  };

  /* ───────────────────── RENDER ───────────────────── */
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 shadow-sm">
          <div className="flex flex-col w-full">
            {/* Logo/Header */}
            <div className="px-5 py-4 border-b border-gray-200 flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                <Crown className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Admin Panel</p>
                <p className="text-xs text-blue-500 font-medium">{user.role}</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive(item.path)
                      ? "bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-500"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${isActive(item.path) ? "text-blue-500" : "text-gray-400"}`} />
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* User Info & Logout */}
            <div className="p-4 border-t border-gray-200 space-y-4">
              <div className="px-3">
                <p className="text-sm font-medium text-gray-800">{user.name || user.email}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:pl-64 flex-1 flex flex-col min-h-screen">
          {/* Top Header */}
          <header className="bg-white border-b border-gray-200 px-5 py-3.5 flex items-center justify-between sticky top-0 z-10">
            <div>
              <h2 className="font-semibold text-gray-800">
                {navItems.find(item => isActive(item.path))?.name || "Dashboard"}
              </h2>
              <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3 h-3" />
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bell className="w-4.5 h-4.5 text-gray-600" />
                </button>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                </div>
              </div>
            </div>
          </header>

          {/* Stats Cards (Only on Dashboard) */}
          {pathname === "/superadmin" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-5">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div 
                    key={stat.label} 
                    className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Icon className="w-5 h-5 text-blue-500" />
                      <span className="text-xs text-gray-500 font-medium">Today</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Main Content Area */}
          <main className="flex-1 p-5">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              {children}
            </div>
          </main>

          {/* Footer */}
          <footer className="border-t border-gray-200 px-5 py-3.5 bg-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2 mb-2 md:mb-0">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-gray-600">All systems operational</span>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  GMT+3 • {new Date().toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false 
                  })}
                </span>
                <span>v1.0.0</span>
                <span className="hidden md:inline">•</span>
                <span className="hidden md:inline">Last updated: Just now</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}