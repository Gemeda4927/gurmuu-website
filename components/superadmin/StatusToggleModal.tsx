"use client";

import { UserCheck, UserX, X, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

interface StatusToggleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user?: any;
  isLoading?: boolean;
}

export default function StatusToggleModal({
  isOpen,
  onClose,
  onConfirm,
  user,
  isLoading = false,
}: StatusToggleModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible || !user) return null;

  const isActive = user.isActive;
  const actionText = isActive ? "Deactivate" : "Activate";

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
            <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100">
              {/* Header */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className={`p-2.5 rounded-xl ${
                      isActive 
                        ? "bg-gradient-to-br from-red-500 to-rose-500" 
                        : "bg-gradient-to-br from-green-500 to-emerald-500"
                    }`}>
                      {isActive ? (
                        <UserX className="w-5 h-5 text-white" />
                      ) : (
                        <UserCheck className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        {actionText} User Account
                      </h2>
                      <p className="text-xs text-gray-500">
                        {isActive ? "Temporarily disable access" : "Restore system access"}
                      </p>
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
                <div className={`bg-gradient-to-r border rounded-xl p-4 mb-6 ${
                  isActive 
                    ? "from-red-50 to-rose-50 border-red-100" 
                    : "from-green-50 to-emerald-50 border-green-100"
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm ${
                      isActive 
                        ? "bg-gradient-to-br from-red-500 to-rose-600" 
                        : "bg-gradient-to-br from-green-500 to-emerald-600"
                    }`}>
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-600 truncate max-w-[180px]">{user.email}</div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'superadmin' 
                            ? 'bg-purple-100 text-purple-800'
                            : user.role === 'admin'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Info */}
                <div className="mb-6">
                  <div className={`flex items-start gap-3 border rounded-xl p-3 mb-4 ${
                    isActive 
                      ? "bg-gradient-to-r from-red-50 to-rose-50 border-red-100" 
                      : "bg-gradient-to-r from-green-50 to-emerald-50 border-green-100"
                  }`}>
                    <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                      isActive ? "text-red-600" : "text-green-600"
                    }`} />
                    <div>
                      <div className={`text-xs font-medium mb-0.5 ${
                        isActive ? "text-red-800" : "text-green-800"
                      }`}>
                        {isActive ? "Access will be disabled" : "Access will be enabled"}
                      </div>
                      <div className={`text-xs ${
                        isActive ? "text-red-700" : "text-green-700"
                      }`}>
                        User will {isActive ? "lose" : "gain"} ability to access the system.
                      </div>
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="text-sm text-gray-600">
                    <div className="font-medium text-gray-900 mb-2">What will happen:</div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        {isActive ? (
                          <UserX className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                        ) : (
                          <UserCheck className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        )}
                        <span>{isActive ? "User will be logged out immediately" : "User can log in and access features"}</span>
                      </div>
                      <div className="flex items-center">
                        <AlertTriangle className={`w-4 h-4 mr-2 flex-shrink-0 ${
                          isActive ? "text-amber-500" : "text-blue-500"
                        }`} />
                        <span>{isActive ? "Account data will be preserved" : "Previous permissions will be restored"}</span>
                      </div>
                      <div className="flex items-center">
                        <UserCheck className={`w-4 h-4 mr-2 flex-shrink-0 ${
                          isActive ? "text-blue-500" : "text-purple-500"
                        }`} />
                        <span>Changes take effect immediately</span>
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
                    onClick={onConfirm}
                    disabled={isLoading}
                    className={`flex-1 px-4 py-3 rounded-xl text-white transition-all duration-200 text-sm font-medium relative overflow-hidden group ${
                      isActive
                        ? "bg-gradient-to-r from-red-600 to-rose-600 hover:shadow-lg"
                        : "bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg"
                    } ${isLoading ? "opacity-90 cursor-wait" : "hover:opacity-95"}`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        {isActive ? "Deactivating..." : "Activating..."}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        {isActive ? (
                          <>
                            <UserX className="w-4 h-4 mr-2" />
                            Deactivate Account
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-4 h-4 mr-2" />
                            Activate Account
                          </>
                        )}
                      </div>
                    )}
                  </button>
                </div>
                <div className="text-center mt-3">
                  <div className="text-xs text-gray-500">
                    {isActive 
                      ? "Deactivated accounts can be reactivated later" 
                      : "Changes apply immediately"}
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