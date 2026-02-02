"use client";

import { useState } from "react";
import {
  Trash2,
  Archive,
  AlertTriangle,
  CheckCircle,
  X,
  Shield,
  Lock,
  Loader2,
  AlertCircle,
  Rocket,
  ShieldAlert,
  Database,
  CloudOff,
  FileX2,
  Skull,
  Ghost,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import { useBlogs } from "@/lib/hooks/useBlogs";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  blogId?: string;
  blogTitle?: string;
  type: "soft" | "hard";
  onSuccess?: () => void;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  blogId,
  blogTitle = "this blog",
  type,
  onSuccess,
}: DeleteConfirmationModalProps) {
  const { softDeleteBlog, hardDeleteBlog } = useBlogs();
  const [isConfirming, setIsConfirming] = useState(false);

  if (!isOpen) return null;

  const isSoftDelete = type === "soft";
  const mutation = isSoftDelete ? softDeleteBlog : hardDeleteBlog;
  const isLoading = mutation.isloading || isConfirming;

  const actionLabel = isSoftDelete ? "Archive" : "Delete Permanently";
  const actionDescription = isSoftDelete
    ? "Archiving will move the blog to the archive section where it can be restored later."
    : "Permanent deletion cannot be undone. This action will completely remove the blog from the system.";
  const icon = isSoftDelete ? Archive : Trash2;
  const iconColor = isSoftDelete
    ? "text-orange-500"
    : "text-red-500";
  const bgGradient = isSoftDelete
    ? "from-orange-500/10 to-amber-500/5"
    : "from-red-500/10 to-pink-500/5";
  const buttonGradient = isSoftDelete
    ? "from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
    : "from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700";
  const severityIcon = isSoftDelete ? (
    <Archive className="w-6 h-6 text-orange-500" />
  ) : (
    <AlertTriangle className="w-6 h-6 text-red-500" />
  );

  const handleConfirm = async () => {
    if (!blogId) {
      toast.error("No blog selected!", {
        style: {
          background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
          border: '1px solid #FBBF24',
          color: '#92400E',
          padding: '16px',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: '500',
        },
        icon: <AlertCircle className="w-5 h-5 text-amber-600" />,
        duration: 3000,
      });
      return;
    }

    setIsConfirming(true);
    
    // Create loading toast with beautiful animation
    const loadingToast = toast.loading(
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-ping opacity-50"></div>
          <div className="relative p-1.5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full">
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          </div>
        </div>
        <div>
          <p className="font-semibold text-blue-900">
            {isSoftDelete ? "Archiving Blog" : "Deleting Blog"}
          </p>
          <p className="text-sm text-blue-700">
            Please wait while we process your request...
          </p>
        </div>
      </div>,
      {
        style: {
          background: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)',
          border: '1px solid #7DD3FC',
          padding: '16px',
          borderRadius: '14px',
          minWidth: '320px',
          backdropFilter: 'blur(10px)',
        },
        duration: Infinity,
      }
    );

    try {
      if (isSoftDelete) {
        await softDeleteBlog.mutateAsync(blogId);
        
        // Success toast for archiving
        toast.success(
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
              <div className="relative p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full">
                <Archive className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <p className="font-semibold text-green-900">Successfully Archived!</p>
              <p className="text-sm text-green-700">
                "{blogTitle}" has been moved to archive
              </p>
            </div>
          </div>,
          {
            id: loadingToast,
            style: {
              background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
              border: '1px solid #34D399',
              padding: '16px',
              borderRadius: '14px',
              minWidth: '320px',
              backdropFilter: 'blur(10px)',
            },
            duration: 4000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#ECFDF5',
            },
          }
        );
      } else {
        await hardDeleteBlog.mutateAsync(blogId);
        
        // Success toast for permanent deletion
        toast.success(
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping"></div>
              <div className="relative p-2 bg-gradient-to-r from-red-500 to-rose-600 rounded-full">
                <Trash2 className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <p className="font-semibold text-red-900">Permanently Deleted!</p>
              <p className="text-sm text-red-700">
                "{blogTitle}" has been removed from the system
              </p>
            </div>
          </div>,
          {
            id: loadingToast,
            style: {
              background: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)',
              border: '1px solid #F87171',
              padding: '16px',
              borderRadius: '14px',
              minWidth: '320px',
              backdropFilter: 'blur(10px)',
            },
            duration: 4000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FEF2F2',
            },
          }
        );
      }

      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error("Delete error:", error.response?.data);
      
      // Error toast
      toast.error(
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-red-500 to-rose-600 rounded-full">
            <FileX2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-red-900">Action Failed!</p>
            <p className="text-sm text-red-700">
              {error.response?.data?.message ||
                error.message ||
                `Failed to ${isSoftDelete ? 'archive' : 'delete'} blog`}
            </p>
          </div>
        </div>,
        {
          id: loadingToast,
          style: {
            background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
            border: '1px solid #F59E0B',
            padding: '16px',
            borderRadius: '14px',
            minWidth: '320px',
            backdropFilter: 'blur(10px)',
          },
          duration: 5000,
        }
      );
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <>
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 animate-in fade-in-0"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`relative w-full max-w-md bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-sm rounded-2xl border border-white/30 shadow-2xl overflow-hidden transform transition-all duration-300 animate-in fade-in-0 zoom-in-95`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Decorative top gradient bar */}
          <div
            className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
              isSoftDelete
                ? "from-orange-500 via-amber-500 to-yellow-500"
                : "from-red-500 via-pink-500 to-rose-500"
            }`}
          />

          {/* Background pattern */}
          <div
            className={`absolute inset-0 opacity-5 ${bgGradient}`}
          />

          <div className="relative p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${
                    isSoftDelete
                      ? "from-orange-500/10 to-amber-500/10"
                      : "from-red-500/10 to-pink-500/10"
                  }`}
                >
                  {severityIcon}
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {actionLabel} Blog
                  </h3>
                  <p className="text-sm text-gray-500">
                    Confirm your action
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={isLoading}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-300 disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Warning message */}
            <div className="mb-6">
              <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50/80 to-gray-100/50 border border-gray-200/50">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      You are about to{" "}
                      <span className={isSoftDelete ? "text-orange-600" : "text-red-600"}>
                        {isSoftDelete ? "archive" : "permanently delete"}
                      </span>{" "}
                      <span className="font-semibold">"{blogTitle}"</span>
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      {actionDescription}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Critical info */}
            {!isSoftDelete && (
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-red-50/50 to-pink-50/30 border border-red-200/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-red-100 to-pink-100 rounded-lg">
                    <ShieldAlert className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-700">
                      Critical Action
                    </h4>
                    <p className="text-sm text-red-600">
                      This action cannot be undone. All associated data will be lost forever.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Visual indicators */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50/50 to-cyan-50/30 border border-blue-200/50 text-center">
                <Database className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                <p className="text-xs text-gray-500">Type</p>
                <p className="font-semibold text-gray-900 text-sm">
                  {isSoftDelete ? "Archive" : "Delete"}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-50/50 to-pink-50/30 border border-purple-200/50 text-center">
                {isSoftDelete ? (
                  <Ghost className="w-5 h-5 text-purple-500 mx-auto mb-2" />
                ) : (
                  <CloudOff className="w-5 h-5 text-pink-500 mx-auto mb-2" />
                )}
                <p className="text-xs text-gray-500">Recoverable</p>
                <p className={`font-semibold ${isSoftDelete ? "text-green-600" : "text-red-600"} text-sm`}>
                  {isSoftDelete ? "Yes" : "No"}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-gray-50/50 to-slate-50/30 border border-gray-200/50 text-center">
                {isSoftDelete ? (
                  <ShieldCheck className="w-5 h-5 text-gray-500 mx-auto mb-2" />
                ) : (
                  <Skull className="w-5 h-5 text-gray-500 mx-auto mb-2" />
                )}
                <p className="text-xs text-gray-500">Severity</p>
                <p className={`font-semibold ${isSoftDelete ? "text-yellow-600" : "text-red-600"} text-sm`}>
                  {isSoftDelete ? "Medium" : "High"}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleConfirm}
                disabled={isLoading || !blogId}
                className={`group relative overflow-hidden px-6 py-3.5 bg-gradient-to-r ${buttonGradient} text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex-1 flex items-center justify-center gap-2.5 font-semibold disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {isSoftDelete ? (
                      <Archive className="w-5 h-5" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                    {actionLabel}
                  </>
                )}
              </button>

              <button
                onClick={onClose}
                disabled={isLoading}
                className="px-6 py-3.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 border border-gray-300/50 shadow-lg hover:shadow-xl transition-all duration-300 flex-1 font-semibold disabled:opacity-50"
              >
                Cancel
              </button>
            </div>

            {/* Additional warning for permanent delete */}
            {!isSoftDelete && (
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" />
                  This is a secure irreversible action
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}