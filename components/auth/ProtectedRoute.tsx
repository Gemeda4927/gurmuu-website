"use client";

import { useEffect } from "react";
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
  const { user, isAuthenticated, isLoading } =
    useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (
        user &&
        !allowedRoles.includes(user.role)
      ) {
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
  }, [
    isAuthenticated,
    isLoading,
    user,
    allowedRoles,
    router,
  ]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-indigo-500 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">
            Verifying access...
          </p>
        </div>
      </div>
    );
  }

  if (
    !isAuthenticated ||
    !user ||
    !allowedRoles.includes(user.role)
  ) {
    return null;
  }

  return <>{children}</>;
}
