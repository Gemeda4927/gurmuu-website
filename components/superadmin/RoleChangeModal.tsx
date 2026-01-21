"use client";

import { Shield, User, X, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

interface RoleChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newRole: "user" | "admin") => void;
  user?: any;
  isLoading?: boolean;
}

export default function RoleChangeModal({
  isOpen,
  onClose,
  onConfirm,
  user,
  isLoading = false,
}: RoleChangeModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"user" | "admin">(
    user?.role === "user" ? "admin" : "user"
  );

  useEffect(() => {
    if (isOpen && user) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
      setSelectedRole(user.role === "user" ? "admin" : "user");
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, user]);

  if (!isVisible || !user) return null;

  const currentRole = user.role;
  const isSuperadmin = currentRole === "superadmin";

  if (isSuperadmin) {
    return null;
  }

  const isPromotion = selectedRole === "admin";
  const actionText = isPromotion ? "Promote" : "Demote";

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[100] transition-all duration-300 ${
          isAnimating
            ? "bg-black/70 backdrop-blur-sm"
            : "bg-black/0 backdrop-blur-0"
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[101] overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <div
            className={`relative w-full max-w-sm transform transition-all duration-300 ${
              isAnimating
                ? "translate-y-0 opacity-100 scale-100"
                : "translate-y-10 opacity-0 scale-95"
            }`}
          >
            <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className={`p-2.5 rounded-xl ${
                        isPromotion 
                          ? "bg-gradient-to-br from-purple-500 to-pink-500" 
                          : "bg-gradient-to-br from-blue-500 to-cyan-500"
                      }`}>
                        {isPromotion ? (
                          <Shield className="w-5 h-5 text-white" />
                        ) : (
                          <User className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">
                          {actionText} User Role
                        </h2>
                        <p className="text-xs text-gray-500">
                          {isPromotion ? "Elevate privileges" : "Reduce privileges"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* User Info */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-600 truncate max-w-[180px]">{user.email}</div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          currentRole === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {currentRole}
                        </span>
                        <span className="text-xs text-gray-500">• Since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Role Selection */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Select new role:
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Admin Button */}
                    <button
                      onClick={() => setSelectedRole("admin")}
                      className={`p-3 border rounded-xl transition-all duration-200 ${
                        selectedRole === "admin"
                          ? "border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-sm"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className={`p-2 rounded-lg mb-2 ${
                          selectedRole === "admin" 
                            ? "bg-gradient-to-r from-purple-100 to-pink-100" 
                            : "bg-gray-100"
                        }`}>
                          <Shield className={`w-6 h-6 ${
                            selectedRole === "admin" ? "text-purple-600" : "text-gray-400"
                          }`} />
                        </div>
                        <span className="font-medium text-gray-900 text-sm">Admin</span>
                        <span className="text-xs text-gray-500 mt-1">Manage users & permissions</span>
                        {selectedRole === "admin" && (
                          <div className="mt-2 w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-sm"></div>
                        )}
                      </div>
                    </button>

                    {/* User Button */}
                    <button
                      onClick={() => setSelectedRole("user")}
                      className={`p-3 border rounded-xl transition-all duration-200 ${
                        selectedRole === "user"
                          ? "border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 shadow-sm"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className={`p-2 rounded-lg mb-2 ${
                          selectedRole === "user" 
                            ? "bg-gradient-to-r from-blue-100 to-cyan-100" 
                            : "bg-gray-100"
                        }`}>
                          <User className={`w-6 h-6 ${
                            selectedRole === "user" ? "text-blue-600" : "text-gray-400"
                          }`} />
                        </div>
                        <span className="font-medium text-gray-900 text-sm">User</span>
                        <span className="text-xs text-gray-500 mt-1">Limited system access</span>
                        {selectedRole === "user" && (
                          <div className="mt-2 w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-sm"></div>
                        )}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Action Info */}
                <div className="mb-6">
                  <div className="flex items-start gap-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-3">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-medium text-amber-800 mb-0.5">
                        {isPromotion ? "Gaining admin privileges" : "Losing admin privileges"}
                      </div>
                      <div className="text-xs text-amber-700">
                        User will {isPromotion ? "gain" : "lose"} ability to manage other users.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer with Actions */}
              <div className="px-6 pb-6">
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => onConfirm(selectedRole)}
                    disabled={isLoading}
                    className={`flex-1 px-4 py-3 rounded-xl text-white transition-all duration-200 text-sm font-medium relative overflow-hidden group ${
                      isPromotion
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg"
                        : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-lg"
                    } ${isLoading ? "opacity-90 cursor-wait" : "hover:opacity-95"}`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Changing...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        {isPromotion ? "Promote to Admin" : "Demote to User"}
                      </div>
                    )}
                  </button>
                </div>
                <div className="text-center mt-3">
                  <div className="text-xs text-gray-500">
                    Changes take effect immediately
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}