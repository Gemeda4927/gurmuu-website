'use client';

import { useState, useEffect } from 'react';
import { 
  UserPlus, Shield, Key, Trash2, 
  CheckCircle, AlertTriangle, Edit, 
  Clock, ArrowUpRight, Users, Settings,
  Eye, Lock
} from 'lucide-react';

interface Activity {
  id: number;
  type: 'user_created' | 'user_updated' | 'user_deleted' | 'permission_granted' | 'permission_revoked' | 'role_changed' | 'user_activated' | 'user_deactivated';
  user: string;
  target: string;
  timestamp: string;
  details?: string;
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 1,
      type: 'user_created',
      user: 'John Smith',
      target: 'New User Account',
      timestamp: '2 minutes ago',
      details: 'Created user account for jane@example.com'
    },
    {
      id: 2,
      type: 'role_changed',
      user: 'Jane Doe',
      target: 'Admin Role',
      timestamp: '15 minutes ago',
      details: 'Promoted to Administrator'
    },
    {
      id: 3,
      type: 'permission_granted',
      user: 'Robert Johnson',
      target: 'Manage Users Permission',
      timestamp: '1 hour ago',
      details: 'Granted manage_users permission'
    },
    {
      id: 4,
      type: 'user_deactivated',
      user: 'Sarah Wilson',
      target: 'User Account',
      timestamp: '2 hours ago',
      details: 'Temporarily deactivated account'
    },
    {
      id: 5,
      type: 'user_updated',
      user: 'Mike Brown',
      target: 'Profile Information',
      timestamp: '3 hours ago',
      details: 'Updated email and phone number'
    },
  ]);

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'user_created':
        return <UserPlus className="w-4 h-4" />;
      case 'user_updated':
        return <Edit className="w-4 h-4" />;
      case 'user_deleted':
        return <Trash2 className="w-4 h-4" />;
      case 'permission_granted':
        return <Key className="w-4 h-4" />;
      case 'permission_revoked':
        return <Lock className="w-4 h-4" />;
      case 'role_changed':
        return <Shield className="w-4 h-4" />;
      case 'user_activated':
        return <CheckCircle className="w-4 h-4" />;
      case 'user_deactivated':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'user_created':
      case 'user_activated':
        return 'bg-green-100 text-green-600';
      case 'user_deleted':
      case 'user_deactivated':
        return 'bg-red-100 text-red-600';
      case 'role_changed':
      case 'permission_granted':
        return 'bg-purple-100 text-purple-600';
      case 'user_updated':
        return 'bg-blue-100 text-blue-600';
      case 'permission_revoked':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getActivityText = (type: Activity['type']) => {
    switch (type) {
      case 'user_created':
        return 'created';
      case 'user_updated':
        return 'updated';
      case 'user_deleted':
        return 'deleted';
      case 'permission_granted':
        return 'granted permission to';
      case 'permission_revoked':
        return 'revoked permission from';
      case 'role_changed':
        return 'changed role for';
      case 'user_activated':
        return 'activated';
      case 'user_deactivated':
        return 'deactivated';
      default:
        return 'modified';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <p className="text-sm text-gray-500">Latest system activities</p>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-1" />
          <span>Last 24 hours</span>
        </div>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 group">
            <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
              {getActivityIcon(activity.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">
                  <span className="font-semibold">{activity.user}</span>{' '}
                  {getActivityText(activity.type)}{' '}
                  <span className="font-semibold">{activity.target}</span>
                </p>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                  {activity.timestamp}
                </span>
              </div>
              
              {activity.details && (
                <p className="text-sm text-gray-500 mt-1 truncate">
                  {activity.details}
                </p>
              )}
            </div>
            
            <button className="p-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Eye className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <button className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
          <ArrowUpRight className="w-4 h-4 mr-2" />
          View All Activity
        </button>
      </div>
    </div>
  );
}