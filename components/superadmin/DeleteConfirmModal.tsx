"use client";

import { AlertTriangle, X } from "lucide-react";
import { useState, useEffect } from "react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName?: string;
  userEmail?: string;
  isLoading?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  userName = "Unknown User",
  userEmail,
  isLoading = false,
}: DeleteConfirmModalProps) {
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

  if (!isVisible) return null;

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
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-500 to-rose-500">
                      <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        Delete User Account
                      </h2>
                      <p className="text-xs text-gray-500">
                        This action cannot be undone
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
                <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-100 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{userName}</div>
                      {userEmail && (
                        <div className="text-xs text-gray-600 truncate max-w-[180px]">
                          {userEmail}
                        </div>
                      )}
                      <div className="text-xs text-red-600 font-medium mt-1">
                        ⚠️ Will be permanently deleted
                      </div>
                    </div>
                  </div>
                </div>

                {/* Warning Info */}
                <div className="mb-6">
                  <div className="flex items-start gap-3 bg-gradient-to-r from-red-50 to-rose-50 border border-red-100 rounded-xl p-3 mb-3">
                    <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-red-700">
                      All user data will be permanently removed from the system.
                    </div>
                  </div>

                  {/* Quick Warning List */}
                  <div className="text-sm text-gray-600">
                    <div className="font-medium text-gray-900 mb-2">What will be deleted:</div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center mr-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                        </div>
                        <span>User profile and personal information</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center mr-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                        </div>
                        <span>Associated permissions and roles</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center mr-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                        </div>
                        <span>Account history and activity logs</span>
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
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium relative overflow-hidden group"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Deleting...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        Delete User
                      </div>
                    )}
                  </button>
                </div>
                <div className="text-center mt-3">
                  <div className="text-xs text-gray-500">
                    This action is irreversible
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