"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Shield,
  User as UserIcon,
  Download,
  RefreshCw,
  MoreVertical,
} from "lucide-react";
import {
  useGetAllUsers,
  useDeleteUser,
  useActivateUser,
  useDeactivateUser,
  usePromoteToAdmin,
  useDemoteToUser,
  useSuperadminStatus,
} from "@/lib/hooks/useSuperadmin";
import UserTable from "@/components/superadmin/UserTable";
import DeleteConfirmModal from "@/components/superadmin/DeleteConfirmModal";
import StatusToggleModal from "@/components/superadmin/StatusToggleModal";
import RoleChangeModal from "@/components/superadmin/RoleChangeModal";

export default function UsersPage() {
  const router = useRouter();
  const { canDeleteUsers, canChangeRoles } =
    useSuperadminStatus();

  const {
    data: usersData,
    isLoading,
    refetch,
  } = useGetAllUsers();
  const deleteUserMutation = useDeleteUser();
  const activateUserMutation = useActivateUser();
  const deactivateUserMutation =
    useDeactivateUser();
  const promoteMutation = usePromoteToAdmin();
  const demoteMutation = useDemoteToUser();

  const [searchTerm, setSearchTerm] =
    useState("");
  const [roleFilter, setRoleFilter] =
    useState("all");
  const [statusFilter, setStatusFilter] =
    useState("all");
  const [selectedUser, setSelectedUser] =
    useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] =
    useState(false);
  const [showStatusModal, setShowStatusModal] =
    useState(false);
  const [showRoleModal, setShowRoleModal] =
    useState(false);

  const handleDelete = (userId: string) => {
    if (canDeleteUsers) {
      deleteUserMutation.mutate(userId, {
        onSuccess: () =>
          setShowDeleteModal(false),
      });
    }
  };

  const handleStatusToggle = (user: any) => {
    setSelectedUser(user);
    setShowStatusModal(true);
  };

  const confirmStatusToggle = () => {
    if (selectedUser) {
      if (selectedUser.isActive) {
        deactivateUserMutation.mutate(
          selectedUser._id,
          {
            onSuccess: () =>
              setShowStatusModal(false),
          }
        );
      } else {
        activateUserMutation.mutate(
          selectedUser._id,
          {
            onSuccess: () =>
              setShowStatusModal(false),
          }
        );
      }
    }
  };

  const handleRoleChange = (user: any) => {
    setSelectedUser(user);
    setShowRoleModal(true);
  };

  const confirmRoleChange = (
    newRole: "user" | "admin"
  ) => {
    if (selectedUser && canChangeRoles) {
      if (
        newRole === "admin" &&
        selectedUser.role === "user"
      ) {
        promoteMutation.mutate(
          {
            userId: selectedUser._id,
            reason: "Promoted by superadmin",
          },
          {
            onSuccess: () =>
              setShowRoleModal(false),
          }
        );
      } else if (
        newRole === "user" &&
        selectedUser.role === "admin"
      ) {
        demoteMutation.mutate(
          {
            userId: selectedUser._id,
            reason: "Demoted by superadmin",
          },
          {
            onSuccess: () =>
              setShowRoleModal(false),
          }
        );
      }
    }
  };

  // Filter users
  const filteredUsers =
    usersData?.users?.filter((user) => {
      if (
        searchTerm &&
        !user.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) &&
        !user.email
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      ) {
        return false;
      }
      if (
        roleFilter !== "all" &&
        user.role !== roleFilter
      )
        return false;
      if (statusFilter !== "all") {
        if (
          statusFilter === "active" &&
          !user.isActive
        )
          return false;
        if (
          statusFilter === "inactive" &&
          user.isActive
        )
          return false;
      }
      return true;
    }) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          User Management
        </h1>
        <p className="text-gray-600 mt-2">
          Manage all user accounts, roles, and
          permissions in the system
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={roleFilter}
              onChange={(e) =>
                setRoleFilter(e.target.value)
              }
              className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option value="all">
                All Roles
              </option>
              <option value="superadmin">
                Superadmin
              </option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option value="all">
                All Status
              </option>
              <option value="active">
                Active
              </option>
              <option value="inactive">
                Inactive
              </option>
            </select>

            <button
              onClick={() => refetch()}
              className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </button>

            <button
              onClick={() =>
                router.push(
                  "/superadmin/users/new"
                )
              }
              className="inline-flex items-center px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Add User
            </button>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div>
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredUsers.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {usersData?.total || 0}
              </span>{" "}
              users
            </div>
            <button className="inline-flex items-center text-gray-600 hover:text-gray-900">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>

          <UserTable
            users={filteredUsers}
            isLoading={isLoading}
            onView={(user) =>
              router.push(
                `/superadmin/users/${user._id}`
              )
            }
            onEdit={(user) =>
              router.push(
                `/superadmin/users/${user._id}/edit`
              )
            }
            onDelete={(user) => {
              setSelectedUser(user);
              setShowDeleteModal(true);
            }}
            onStatusToggle={handleStatusToggle}
            onRoleChange={handleRoleChange}
            canDelete={canDeleteUsers}
            canChangeRoles={canChangeRoles}
          />
        </div>
      </div>

      {/* Modals */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() =>
          handleDelete(selectedUser?._id)
        }
        userName={selectedUser?.name}
      />

      <StatusToggleModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onConfirm={confirmStatusToggle}
        user={selectedUser}
      />

      <RoleChangeModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        onConfirm={confirmRoleChange}
        user={selectedUser}
      />
    </div>
  );
}
