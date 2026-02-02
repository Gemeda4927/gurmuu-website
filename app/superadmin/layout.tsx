"use client";

import {
  ReactNode,
  useEffect,
  useMemo,
  useState,
  MouseEvent,
} from "react";
import {
  useRouter,
  usePathname,
} from "next/navigation";
import Link from "next/link";
import useAuthStore from "@/lib/store/auth.store";
import {
  Crown,
  Users,
  ShieldCheck,
  Settings,
  LogOut,
  Home,
  Menu,
  X,
  Bell,
  Search,
  Shield,
  BarChart3,
  Database,
  UserCheck,
  CheckCircle,
  Activity,
  Filter,
  Globe,
  Calendar,
  Clock,
} from "lucide-react";

interface SuperadminLayoutProps {
  children: ReactNode;
}

export default function SuperadminLayout({
  children,
}: SuperadminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const {
    user,
    clearAuthData,
    isAuthenticated,
    hasHydrated,
    isLoading,
  } = useAuthStore();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);
  const [searchTerm, setSearchTerm] =
    useState("");
  const [isCheckingAuth, setIsCheckingAuth] =
    useState(true);
  const [
    hasInitialCheckPassed,
    setHasInitialCheckPassed,
  ] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log(
      "🔍 SuperadminLayout Auth State:",
      {
        hasHydrated,
        isAuthenticated,
        user: user
          ? { name: user.name, role: user.role }
          : null,
        isLoading,
        pathname,
        isCheckingAuth,
        hasInitialCheckPassed,
      }
    );
  }, [
    hasHydrated,
    isAuthenticated,
    user,
    isLoading,
    pathname,
    isCheckingAuth,
    hasInitialCheckPassed,
  ]);

  /* ───────────────────── NAV ITEMS (FIXED PATHS) ───────────────────── */
  const navItems = useMemo(
    () => [
      {
        name: "Dashboard",
        icon: Home,
        path: "/superadmin",
        color: "bg-blue-50 text-blue-600",
      },
      {
        name: "Users",
        icon: Users,
        path: "/superadmin/users",
        color: "bg-emerald-50 text-emerald-600",
        count: 245,
      },
      {
        name: "Permissions",
        icon: ShieldCheck,
        path: "/superadmin/permissions",
        color: "bg-purple-50 text-purple-600",
      },
      {
        name: "Events",
        icon: BarChart3,
        path: "/superadmin/events",
        color: "bg-amber-50 text-amber-600",
      },
      {
        name: "Settings",
        icon: Settings,
        path: "/superadmin/settings",
        color: "bg-gray-50 text-gray-600",
      },
      {
        name: "blogs",
        icon: Settings,
        path: "/superadmin/blogs",
        color: "bg-gray-50 text-gray-600",
      },
    ],
    []
  );

  /* ───────────────────── STATS ───────────────────── */
  const stats = useMemo(
    () => [
      {
        label: "Active Users",
        value: "1,248",
        change: "+12%",
        icon: UserCheck,
        color: "bg-blue-500",
      },
      {
        label: "System Health",
        value: "98.5%",
        change: "✓",
        icon: CheckCircle,
        color: "bg-emerald-500",
      },
      {
        label: "API Requests",
        value: "24.5k",
        change: "+23%",
        icon: Activity,
        color: "bg-purple-500",
      },
      {
        label: "Storage",
        value: "85%",
        change: "+5%",
        icon: Database,
        color: "bg-amber-500",
      },
    ],
    []
  );

  /* ───────────────────── AUTHENTICATION CHECK ───────────────────── */
  useEffect(() => {
    // Don't check until hydration is complete
    if (!hasHydrated || isLoading) {
      console.log("⏳ Waiting for hydration...");
      return;
    }

    // If initial check already passed, don't run again
    if (hasInitialCheckPassed) {
      console.log(
        "✅ Initial check already passed, skipping..."
      );
      return;
    }

    console.log(
      "🔐 Running initial authentication check..."
    );

    // If not authenticated at all, redirect to login
    if (!isAuthenticated) {
      console.log(
        "❌ Not authenticated, redirecting to login"
      );
      router.push("/login");
      return;
    }

    // If authenticated but no user data, redirect to login
    if (!user) {
      console.log(
        "❌ No user data, redirecting to login"
      );
      router.push("/login");
      return;
    }

    // If not superadmin, redirect to dashboard
    if (user.role !== "superadmin") {
      console.log(
        "❌ Not superadmin, redirecting to dashboard"
      );
      router.push("/dashboard");
      return;
    }

    // All checks passed
    console.log(
      "✅ Initial authentication checks passed"
    );
    setHasInitialCheckPassed(true);
    setIsCheckingAuth(false);
  }, [
    isAuthenticated,
    user,
    hasHydrated,
    isLoading,
    router,
    hasInitialCheckPassed,
  ]);

  /* ───────────────────── LOADING STATE ───────────────────── */
  if (
    !hasHydrated ||
    isLoading ||
    (!hasInitialCheckPassed && isCheckingAuth)
  ) {
    console.log("🔄 Showing loading state...");
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="relative inline-block mb-6">
            <div className="w-16 h-16 border-4 border-blue-100 rounded-full" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-blue-500 rounded-full animate-spin border-t-transparent" />
            <Crown className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-500" />
          </div>
          <p className="text-sm text-gray-500">
            Loading Superadmin Panel…
          </p>
          <p className="text-xs text-gray-400 mt-2">
            {!hasHydrated
              ? "Hydrating..."
              : isLoading
                ? "Loading..."
                : "Checking permissions..."}
          </p>
        </div>
      </div>
    );
  }

  // Final check before rendering - but allow rendering even if user changes
  if (!isAuthenticated || !user) {
    console.log(
      "🚫 No user or not authenticated"
    );
    return null;
  }

  // Warn but don't block if user role changes
  if (
    user.role !== "superadmin" &&
    hasInitialCheckPassed
  ) {
    console.warn(
      "⚠️ User role changed after initial check:",
      user.role
    );
    // Don't redirect here - let the page handle it
  }

  /* ───────────────────── HELPERS ───────────────────── */
  const isActive = (path: string) =>
    pathname === path ||
    pathname.startsWith(`${path}/`);

  const handleLogout = (
    e: MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    console.log("👋 Logging out...");
    clearAuthData();
    router.push("/login");
  };

  /* ───────────────────── RENDER ───────────────────── */
  console.log(
    "🎨 Rendering Superadmin Layout..."
  );
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="lg:flex">
        {/* ───────────── Sidebar ───────────── */}
        <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-white border-r">
          <div className="flex flex-col w-full">
            {/* Logo */}
            <div className="px-5 py-4 border-b flex items-center space-x-3">
              <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center">
                <Crown className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold">
                  Superadmin
                </p>
                <p className="text-xs text-blue-500">
                  Control Panel
                </p>
              </div>
            </div>

            {/* User */}
            <div className="px-5 py-4 border-b flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white border border-blue-500 rounded-full flex items-center justify-center">
                  <Shield className="w-2 h-2 text-blue-500" />
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email}
                </p>
                <p
                  className={`text-xs font-medium mt-1 ${
                    user.role === "superadmin"
                      ? "text-green-600"
                      : user.role === "admin"
                        ? "text-blue-600"
                        : "text-gray-600"
                  }`}
                >
                  {user.role}
                </p>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive(item.path)
                      ? `${item.color} border-l-4 border-blue-500`
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={(e) => {
                    console.log(
                      `Navigating to: ${item.path}`
                    );
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.count && (
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                      {item.count}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Logout */}
            <div className="px-5 py-4 border-t">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* ───────────── Main ───────────── */}
        <div className="lg:pl-64 flex-1 flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-30 bg-white border-b">
            <div className="px-5 py-3 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">
                  {pathname.includes(
                    "/permissions"
                  )
                    ? "Permissions"
                    : pathname.includes("/users")
                      ? "Users"
                      : pathname.includes(
                            "/settings"
                          )
                        ? "Settings"
                        : "Dashboard"}
                </h2>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date().toLocaleDateString()}
                  {user.role !== "superadmin" && (
                    <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded">
                      {user.role}
                    </span>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(
                        e.target.value
                      )
                    }
                    placeholder="Search…"
                    className="pl-9 pr-4 py-2 text-sm border rounded-lg"
                  />
                </div>
                <button className="p-2 rounded-lg hover:bg-gray-50">
                  <Bell className="w-4 h-4" />
                </button>
                <span className="hidden lg:flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          </header>

          {/* Stats - Only show on dashboard */}
          {pathname === "/superadmin" && (
            <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white border rounded-lg p-4"
                >
                  <div className="flex justify-between mb-3">
                    <div
                      className={`p-2 rounded-lg ${stat.color}`}
                    >
                      <stat.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs text-emerald-500">
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-xl font-semibold">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Content */}
          <main className="flex-1 px-5 pb-6">
            <div className="bg-white border rounded-lg">
              {children}
            </div>
          </main>

          {/* Footer */}
          <footer className="border-t px-5 py-3 text-xs text-gray-500 flex justify-between">
            <span>All systems operational</span>
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3" /> GMT+3
            </span>
          </footer>
        </div>
      </div>
    </div>
  );
}
