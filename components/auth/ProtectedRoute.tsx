"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/lib/store/auth.store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: (
    | "user"
    | "admin"
    | "superadmin"
  )[];
}

export default function ProtectedRoute({
  children,
  allowedRoles = ["user", "admin", "superadmin"],
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isAuthenticated, hasHydrated } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (hasHydrated) {
      setIsChecking(false);
      
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }
      
      if (user && !allowedRoles.includes(user.role)) {
        switch (user.role) {
          case "superadmin":
            router.push("/superadmin");
            break;
          case "admin":
            router.push("/admin");
            break;
          default:
            router.push("/dashboard");
        }
      }
    }
  }, [isAuthenticated, hasHydrated, user, allowedRoles, router]);

  if (!hasHydrated || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-gray-800 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}