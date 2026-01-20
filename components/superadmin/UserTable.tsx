// /components/superadmin/UserTable.tsx
import { Eye, Edit, Trash2, CheckCircle, AlertTriangle, Shield, User as UserIcon, MoreVertical } from 'lucide-react';

interface UserTableProps {
  users: any[];
  isLoading: boolean;
  onView: (user: any) => void;
  onEdit: (user: any) => void;
  onDelete: (user: any) => void;
  onStatusToggle: (user: any) => void;
  onRoleChange: (user: any) => void;
  canDelete: boolean;
  canChangeRoles: boolean;
}

export default function UserTable({
  users,
  isLoading,
  onView,
  onEdit,
  onDelete,
  onStatusToggle,
  onRoleChange,
  canDelete,
  canChangeRoles,
}: UserTableProps) {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-900 border-t-transparent"></div>
        <p className="mt-4 text-gray-600">Loading users...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <UserIcon className="w-12 h-12 text-gray-400 mx-auto" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">No users found</h3>
        <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">User</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Role</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Last Active</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-4 px-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-800 to-gray-900 flex items-center justify-center text-white font-bold mr-3">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="py-4 px-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  user.role === 'superadmin' ? 'bg-purple-100 text-purple-800' :
                  user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {user.role.toUpperCase()}
                </span>
              </td>
              <td className="py-4 px-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center w-fit ${
                  user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.isActive ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Inactive
                    </>
                  )}
                </span>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm text-gray-500">
                  {new Date(user.updatedAt).toLocaleDateString()}
                </span>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onView(user)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => onEdit(user)}
                    className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                    title="Edit User"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  {canChangeRoles && user.role !== 'superadmin' && (
                    <button
                      onClick={() => onRoleChange(user)}
                      className="p-2 hover:bg-purple-50 rounded-lg text-purple-600"
                      title={user.role === 'user' ? 'Promote to Admin' : 'Demote to User'}
                    >
                      <Shield className="w-4 h-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => onStatusToggle(user)}
                    className={`p-2 rounded-lg ${
                      user.isActive 
                        ? 'hover:bg-red-50 text-red-600' 
                        : 'hover:bg-green-50 text-green-600'
                    }`}
                    title={user.isActive ? 'Deactivate User' : 'Activate User'}
                  >
                    {user.isActive ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                  </button>
                  
                  {canDelete && user.role !== 'superadmin' && (
                    <button
                      onClick={() => onDelete(user)}
                      className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}