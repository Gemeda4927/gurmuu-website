"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Menu,
  X,
  LogIn,
  UserPlus,
  LogOut,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import { useAuthStore } from "@/lib/store/auth.store";

interface HeaderProps {
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
  onDashboardClick?: () => void;
  onLogoutClick?: () => void;
}

export default function Header({
  onLoginClick,
  onRegisterClick,
  onDashboardClick,
  onLogoutClick,
}: HeaderProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);
  const { user, isAuthenticated } =
    useAuthStore();

  const navigationItems = [
    { name: "Home", href: "/" },
    { name: "Training", href: "/training" },
    { name: "Services", href: "/services" },
    { name: "Partners", href: "/partners" },
    { name: "Projects", href: "/projects" },
    { name: "Blog", href: "/blog" },
    { name: "Events", href: "/events" },
  ];

  const handleLogin = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      router.push("/login");
    }
  };

  const handleRegister = () => {
    if (onRegisterClick) {
      onRegisterClick();
    } else {
      router.push("/register");
    }
  };

  const handleDashboard = () => {
    if (onDashboardClick) {
      onDashboardClick();
    } else if (isAuthenticated && user) {
      if (
        user.role === "admin" ||
        user.role === "superadmin"
      ) {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    }
  };

  const handleLogout = () => {
    if (onLogoutClick) {
      onLogoutClick();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-100/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-3 group"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
              }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
              <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-green-600 to-purple-600 bg-clip-text text-transparent">
                Nutii Organization
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                Gurmuu Volunteer Association
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2.5 text-gray-700 hover:text-blue-600 font-medium rounded-xl hover:bg-gray-50/50 transition-all duration-300 text-sm"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <div className="hidden md:flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {user?.name?.charAt(0) ||
                        "U"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {user?.role}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleDashboard}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-5 py-2.5 text-gray-700 font-medium rounded-xl hover:bg-gray-50/50 transition-all duration-300 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={handleLogin}
                  className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 text-gray-700 font-medium rounded-xl hover:bg-gray-50/50 transition-all duration-300"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </button>
                <button
                  onClick={handleRegister}
                  className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300"
                >
                  <UserPlus className="w-4 h-4" />
                  Register
                </button>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() =>
                setMobileMenuOpen(!mobileMenuOpen)
              }
              className="lg:hidden p-2.5 text-gray-700 hover:text-blue-600 hover:bg-gray-50/50 rounded-xl transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-gray-100/50 bg-white/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block py-3 text-gray-700 hover:text-blue-600 font-medium hover:bg-gray-50/50 rounded-xl px-4 transition-colors text-sm"
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                >
                  {item.name}
                </Link>
              ))}

              <div className="pt-4 border-t border-gray-100/50 space-y-3">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-3 bg-gray-50 rounded-xl">
                      <p className="font-medium text-gray-900">
                        {user?.name}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">
                        {user?.role}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        handleDashboard();
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full py-3 text-center bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-xl hover:shadow-lg"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full py-3 text-center text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        handleLogin();
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full py-3 text-center text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-50"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        handleRegister();
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full py-3 text-center bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-xl hover:shadow-lg"
                    >
                      Register
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
