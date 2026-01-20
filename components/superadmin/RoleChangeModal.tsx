"use client";

import { Shield, User, X } from "lucide-react";
import { useState } from "react";

interface RoleChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newRole: "user" | "admin") => void;
  user?: any;
}

export default function RoleChangeModal({
  isOpen,
  onClose,
  onConfirm,
  user,
}: RoleChangeModalProps) {
  const [selectedRole, setSelectedRole] =
    useState<"user" | "admin">(
      user?.role === "user" ? "admin" : "user"
    );

  if (!isOpen) return null;

  const isPromoting = user?.role === "user";
  const currentRole = user?.role;
  const newRole = isPromoting ? "admin" : "user";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="relative bg-white rounded-2xl p-6 max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-purple-600" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Change User Role
            </h3>

            <p className="text-gray-600 mb-6">
              {isPromoting ? (
                <>
                  Promote{" "}
                  <span className="font-semibold">
                    {user?.name}
                  </span>{" "}
                  from User to Administrator? This
                  will grant administrative
                  privileges.
                </>
              ) : (
                <>
                  Demote{" "}
                  <span className="font-semibold">
                    {user?.name}
                  </span>{" "}
                  from Administrator to User? This
                  will remove administrative
                  privileges.
                </>
              )}
            </p>

            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() =>
                  setSelectedRole("user")
                }
                className={`p-4 border rounded-xl text-center ${
                  selectedRole === "user"
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <User className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                <div className="font-medium text-gray-900">
                  User
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Standard access
                </div>
              </button>

              <button
                onClick={() =>
                  setSelectedRole("admin")
                }
                className={`p-4 border rounded-xl text-center ${
                  selectedRole === "admin"
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <Shield className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                <div className="font-medium text-gray-900">
                  Admin
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Admin privileges
                </div>
              </button>
            </div>

            {/* Permission Changes */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
              <h4 className="font-medium text-gray-900 mb-2">
                Changes:
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {isPromoting ? (
                  <>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
                      Grant administrative access
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
                      Allow user management
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
                      Enable system settings
                      access
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2" />
                      Remove administrative access
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2" />
                      Disable user management
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2" />
                      Revoke system settings
                      access
                    </li>
                  </>
                )}
              </ul>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm(selectedRole);
                  onClose();
                }}
                className="flex-1 py-3 rounded-xl bg-purple-600 text-white hover:bg-purple-700 font-medium"
              >
                {isPromoting
                  ? "Promote to Admin"
                  : "Demote to User"}
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
