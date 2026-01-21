"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Globe,
  Shield,
  UserCheck,
  UserX,
  MapPin,
  MessageSquare,
  Twitter,
  Linkedin,
  Edit,
  Trash2,
  Key,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Map,
  Activity,
  AlertTriangle,
} from "lucide-react";
import {
  useGetUserById,
  useDeleteUser,
  useActivateUser,
  useDeactivateUser,
  useSuperadminStatus,
} from "@/lib/hooks/useSuperadmin";
import DeleteConfirmModal from "../../../../components/superadmin/DeleteConfirmModal";
import StatusToggleModal from "../../../../components/superadmin/StatusToggleModal";

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const { data, isLoading, error } = useGetUserById(userId);
  const { canDeleteUsers } = useSuperadminStatus();

  const deleteUserMutation = useDeleteUser();
  const activateUserMutation = useActivateUser();
  const deactivateUserMutation = useDeactivateUser();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const user = data?.user;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-gray-800 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-red-100 rounded-full animate-ping"></div>
            <XCircle className="w-20 h-20 text-red-500 relative" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">User not found</h3>
          <p className="text-gray-600 mb-6">
            {error?.message || "The user you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDelete = () => {
    deleteUserMutation.mutate(userId, {
      onSuccess: () => {
        setShowDeleteModal(false);
        router.push("/superadmin/users");
      },
    });
  };

  const handleStatusToggle = () => {
    if (user.isActive) {
      deactivateUserMutation.mutate(userId, {
        onSuccess: () => setShowStatusModal(false),
      });
    } else {
      activateUserMutation.mutate(userId, {
        onSuccess: () => setShowStatusModal(false),
      });
    }
  };

  // Get role color
  const getRoleColor = (role: string) => {
    switch (role) {
      case "superadmin":
        return {
          bg: "bg-gradient-to-r from-purple-500 to-pink-600",
          light: "bg-gradient-to-r from-purple-50 to-pink-50",
          text: "text-purple-800",
          border: "border-purple-200",
        };
      case "admin":
        return {
          bg: "bg-gradient-to-r from-blue-500 to-cyan-600",
          light: "bg-gradient-to-r from-blue-50 to-cyan-50",
          text: "text-blue-800",
          border: "border-blue-200",
        };
      default:
        return {
          bg: "bg-gradient-to-r from-gray-500 to-gray-600",
          light: "bg-gradient-to-r from-gray-50 to-gray-100",
          text: "text-gray-800",
          border: "border-gray-200",
        };
    }
  };

  const roleColor = getRoleColor(user.role);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <button
                onClick={() => router.back()}
                className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-3 group"
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Users
              </button>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {user.name}
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${roleColor.light} ${roleColor.text} border ${roleColor.border}`}
                    >
                      {user.role === "superadmin" && <Shield className="w-3.5 h-3.5 mr-1.5" />}
                      {user.role === "admin" && <Key className="w-3.5 h-3.5 mr-1.5" />}
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        user.isActive
                          ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200"
                          : "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200"
                      }`}
                    >
                      {user.isActive ? (
                        <>
                          <UserCheck className="w-3.5 h-3.5 mr-1.5" />
                          Active
                        </>
                      ) : (
                        <>
                          <UserX className="w-3.5 h-3.5 mr-1.5" />
                          Inactive
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push(`/superadmin/users/${userId}/edit`)}
                className="inline-flex items-center px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-white transition-all duration-200 hover:shadow-md font-medium"
              >
                <Edit className="w-5 h-5 mr-2" />
                Edit
              </button>
              <button
                onClick={() => setShowStatusModal(true)}
                className={`inline-flex items-center px-5 py-2.5 rounded-xl transition-all duration-200 font-medium ${
                  user.isActive
                    ? "bg-gradient-to-r from-red-500 to-rose-600 text-white hover:shadow-lg"
                    : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg"
                }`}
              >
                {user.isActive ? (
                  <>
                    <UserX className="w-5 h-5 mr-2" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <UserCheck className="w-5 h-5 mr-2" />
                    Activate
                  </>
                )}
              </button>
              {canDeleteUsers && user.role !== "superadmin" && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - User Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Overview Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Profile Overview</h2>
                  <div className="p-2 bg-blue-50 rounded-xl">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact Info */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                      Contact Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center p-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl">
                        <div className="p-2 bg-blue-100 rounded-lg mr-3">
                          <Mail className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Email</div>
                          <div className="font-medium text-gray-900">{user.email}</div>
                        </div>
                      </div>

                      {user.phone && (
                        <div className="flex items-center p-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl">
                          <div className="p-2 bg-green-100 rounded-lg mr-3">
                            <Phone className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Phone</div>
                            <div className="font-medium text-gray-900">{user.phone}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Account Info */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                      Account Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center p-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl">
                        <div className="p-2 bg-purple-100 rounded-lg mr-3">
                          <Calendar className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Member Since</div>
                          <div className="font-medium text-gray-900">
                            {new Date(user.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center p-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl">
                        <div className="p-2 bg-amber-100 rounded-lg mr-3">
                          <Clock className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Last Updated</div>
                          <div className="font-medium text-gray-900">
                            {new Date(user.updatedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio Section */}
                {user.bio && (
                  <div className="mt-8">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                      About
                    </h3>
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl">
                      <div className="flex items-start">
                        <MessageSquare className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700 leading-relaxed">{user.bio}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Social Media Card */}
            {user.social && (user.social.twitter || user.social.linkedin) && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Social Profiles</h2>
                    <div className="p-2 bg-purple-50 rounded-xl">
                      <Globe className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.social.twitter && (
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center">
                          <div className="p-2.5 bg-blue-100 rounded-lg mr-3">
                            <Twitter className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-xs font-medium text-gray-500">Twitter</div>
                            <div className="font-medium text-blue-700">{user.social.twitter}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {user.social.linkedin && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center">
                          <div className="p-2.5 bg-blue-200 rounded-lg mr-3">
                            <Linkedin className="w-5 h-5 text-blue-700" />
                          </div>
                          <div>
                            <div className="text-xs font-medium text-gray-500">LinkedIn</div>
                            <div className="font-medium text-blue-800">{user.social.linkedin}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Address Card */}
            {user.address && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Address</h2>
                    <div className="p-2 bg-green-50 rounded-xl">
                      <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
                    <div className="flex items-start">
                      <Map className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <div className="space-y-2">
                        {user.address.street && (
                          <div className="font-medium text-gray-900">{user.address.street}</div>
                        )}
                        {(user.address.city || user.address.country) && (
                          <div className="text-gray-700">
                            {[user.address.city, user.address.country].filter(Boolean).join(", ")}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Stats & Actions */}
          <div className="space-y-6">
            {/* User ID Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">User ID</h3>
                  <div className="p-2 bg-gray-100 rounded-xl">
                    <Key className="w-5 h-5 text-gray-600" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-3">
                  <div className="text-xs font-mono text-gray-700 break-all bg-white/50 p-2 rounded-lg">
                    {user._id}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">Unique identifier for this user</div>
                </div>
              </div>
            </div>

            {/* Permissions Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Permissions</h3>
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                </div>

                {user.permissions && user.permissions.length > 0 ? (
                  <div className="space-y-3">
                    {user.permissions.map((permission) => (
                      <div
                        key={permission}
                        className="flex items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl hover:shadow-sm transition-shadow duration-200"
                      >
                        <CheckCircle className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-800">{permission}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="p-3 bg-gray-100 rounded-xl inline-block mb-3">
                      <AlertTriangle className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">No specific permissions assigned</p>
                    <p className="text-xs text-gray-400 mt-1">Using default role permissions</p>
                  </div>
                )}

                {user.permissions && user.permissions.length > 0 && (
                  <button className="w-full mt-4 px-4 py-2.5 text-sm bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:opacity-90 transition-all duration-200 font-medium">
                    Manage Permissions
                  </button>
                )}
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                  <div className="p-2 bg-purple-100 rounded-xl">
                    <Activity className="w-5 h-5 text-purple-600" />
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => router.push(`/superadmin/users/${userId}/edit`)}
                    className="w-full flex items-center justify-center px-4 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium group"
                  >
                    <Edit className="w-5 h-5 mr-2 text-gray-600 group-hover:text-blue-600 transition-colors" />
                    Edit Profile
                  </button>

                  <button
                    onClick={() => router.push(`/superadmin/users/${userId}/permissions`)}
                    className="w-full flex items-center justify-center px-4 py-3 border-2 border-blue-300 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl hover:shadow-md transition-all duration-200 font-medium text-blue-700 group"
                  >
                    <Key className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Manage Permissions
                  </button>

                  <button
                    onClick={() => setShowStatusModal(true)}
                    className={`w-full flex items-center justify-center px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                      user.isActive
                        ? "bg-gradient-to-r from-red-500 to-rose-600 text-white hover:shadow-lg"
                        : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg"
                    }`}
                  >
                    {user.isActive ? (
                      <>
                        <UserX className="w-5 h-5 mr-2" />
                        Deactivate Account
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-5 h-5 mr-2" />
                        Activate Account
                      </>
                    )}
                  </button>

                  {canDeleteUsers && user.role !== "superadmin" && (
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
                    >
                      <Trash2 className="w-5 h-5 mr-2" />
                      Delete Account
                    </button>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center text-sm text-gray-500">
                    <AlertTriangle className="w-4 h-4 mr-2 text-amber-500" />
                    Changes take effect immediately
                  </div>
                </div>
              </div>
            </div>

            {/* Account Statistics */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Account Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-300">Account Age</div>
                    <div className="font-semibold text-white">
                      {Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-300">Last Active</div>
                    <div className="font-semibold text-white">
                      {new Date(user.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-300">Status Duration</div>
                    <div className="font-semibold text-white">
                      {user.isActive ? "Active" : "Inactive"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        userName={user.name}
        userEmail={user.email}
        isLoading={deleteUserMutation.isPending}
      />

      <StatusToggleModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onConfirm={handleStatusToggle}
        user={user}
        isLoading={activateUserMutation.isPending || deactivateUserMutation.isPending}
      />
    </div>
  );
}