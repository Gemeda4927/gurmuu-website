'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/lib/store/auth.store';
import { 
  Shield, User, LogOut, Settings, Bell, Search, 
  Home, BarChart, Users, FileText, Calendar, 
  CreditCard, HelpCircle, ChevronRight, 
  TrendingUp, CheckCircle, AlertCircle, 
  Clock, DollarSign, Package, Globe,
  ShieldCheck, Zap, Eye, Download, Share2,
  MoreVertical, Edit, Trash2, Star,
  MessageSquare, TrendingDown, Activity,
  Building, Target, Filter, ArrowRight,
  Plus
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, clearAuthData, isAuthenticated, isLoading } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications] = useState([
    { id: 1, title: 'New user registered', time: '2 min ago', read: false },
    { id: 2, title: 'System update available', time: '1 hour ago', read: true },
    { id: 3, title: 'Payment received', time: '3 hours ago', read: true },
  ]);

  // Mock data
  const [dashboardData] = useState({
    stats: {
      totalUsers: 1254,
      activeUsers: 987,
      pendingRequests: 23,
      revenue: 45230,
      storageUsed: 78,
      uptime: 99.9
    },
    recentActivity: [
      { id: 1, user: 'John Doe', action: 'created new project', time: '2 min ago', role: 'user' },
      { id: 2, user: 'Jane Smith', action: 'updated profile', time: '15 min ago', role: 'admin' },
      { id: 3, user: 'Bob Johnson', action: 'changed role to admin', time: '1 hour ago', role: 'superadmin' },
      { id: 4, user: 'Alice Brown', action: 'uploaded document', time: '2 hours ago', role: 'user' },
    ],
    projects: [
      { id: 1, name: 'Website Redesign', progress: 75, status: 'active', deadline: 'Dec 30, 2023' },
      { id: 2, name: 'Mobile App', progress: 45, status: 'in-progress', deadline: 'Jan 15, 2024' },
      { id: 3, name: 'API Integration', progress: 90, status: 'completed', deadline: 'Dec 10, 2023' },
      { id: 4, name: 'Security Audit', progress: 30, status: 'pending', deadline: 'Jan 30, 2024' },
    ],
    teamMembers: [
      { id: 1, name: 'Alex Johnson', role: 'Developer', status: 'active', avatar: 'AJ' },
      { id: 2, name: 'Sarah Miller', role: 'Designer', status: 'active', avatar: 'SM' },
      { id: 3, name: 'Mike Wilson', role: 'Admin', status: 'away', avatar: 'MW' },
      { id: 4, name: 'Lisa Brown', role: 'Manager', status: 'offline', avatar: 'LB' },
    ]
  });

  // Add role-based redirection logic
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user) {
        // Redirect based on role
        switch (user.role) {
          case 'superadmin':
            router.push('/superadmin');
            break;
          case 'admin':
            router.push('/admin');
            break;
          case 'user':
            // User stays on this dashboard
            break;
          default:
            router.push('/login');
        }
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  const handleLogout = () => {
    clearAuthData();
    router.push('/');
  };

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'superadmin': return 'from-purple-600 to-pink-600';
      case 'admin': return 'from-blue-600 to-indigo-600';
      default: return 'from-green-600 to-teal-600';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'superadmin': return <ShieldCheck className="w-4 h-4" />;
      case 'admin': return <Shield className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'away': return 'bg-orange-100 text-orange-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-indigo-500 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show nothing while redirecting or if user is not a regular user
  if (!user || user.role !== 'user') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Logo and Search */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Gurmuu
                  </h1>
                  <p className="text-xs text-gray-500">User Dashboard</p>
                </div>
              </div>

              <div className="hidden lg:block relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search dashboard..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-80 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                />
              </div>
            </div>

            {/* Right: User Menu */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="flex items-center space-x-3">
                <div className="text-right hidden md:block">
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                
                <div className="relative">
                  <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => setShowLogoutConfirm(!showLogoutConfirm)}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white bg-gradient-to-r ${getRoleColor(user.role)}`}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${showLogoutConfirm ? 'rotate-90' : ''}`} />
                  </div>

                  {/* Dropdown Menu */}
                  {showLogoutConfirm && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <div className="flex items-center mt-1">
                          <div className={`px-2 py-1 rounded-full text-xs text-white bg-gradient-to-r ${getRoleColor(user.role)} flex items-center`}>
                            {getRoleIcon(user.role)}
                            <span className="ml-1 capitalize">{user.role}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="py-2">
                        <button className="w-full px-4 py-3 text-left flex items-center text-gray-700 hover:bg-gray-50">
                          <User className="w-4 h-4 mr-3" />
                          My Profile
                        </button>
                        <button className="w-full px-4 py-3 text-left flex items-center text-gray-700 hover:bg-gray-50">
                          <Settings className="w-4 h-4 mr-3" />
                          Settings
                        </button>
                        <button className="w-full px-4 py-3 text-left flex items-center text-gray-700 hover:bg-gray-50">
                          <HelpCircle className="w-4 h-4 mr-3" />
                          Help & Support
                        </button>
                      </div>

                      <div className="border-t border-gray-100 py-2">
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-3 text-left flex items-center text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4 flex space-x-6 border-b border-gray-200">
            {['overview', 'analytics', 'users', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 px-1 text-sm font-medium capitalize transition-colors ${
                  activeTab === tab 
                    ? 'text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6">
        {/* Welcome Banner */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Welcome back, {user.name}! 👋
                </h1>
                <p className="text-indigo-100 max-w-2xl">
                  Here's what's happening with your Gurmuu account today. 
                  You have user access to view and manage your projects.
                </p>
                <div className="mt-4 flex items-center space-x-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span>Last login: Today, 10:30 AM</span>
                  </div>
                  <div className="flex items-center">
                    <Activity className="w-4 h-4 mr-2" />
                    <span>Account status: Active</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
                  {getRoleIcon(user.role)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm mb-2">My Projects</p>
                <p className="text-3xl font-bold">8</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+2 this month</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm mb-2">Tasks Completed</p>
                <p className="text-3xl font-bold">42</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+15% from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm mb-2">Pending Tasks</p>
                <p className="text-3xl font-bold">12</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-xl">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <AlertCircle className="w-4 h-4 mr-1" />
              <span>Needs attention</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm mb-2">Storage Used</p>
                <p className="text-3xl font-bold">{dashboardData.stats.storageUsed}%</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>8.5 GB of 10 GB</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700 flex items-center">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              
              <div className="space-y-4">
                {dashboardData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center p-4 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center mr-4">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900">
                          <span className="font-semibold">{activity.user}</span> {activity.action}
                        </p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          activity.role === 'superadmin' ? 'bg-purple-100 text-purple-800' :
                          activity.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {activity.role}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects Progress */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">My Projects</h2>
                <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700 flex items-center">
                  <Plus className="w-4 h-4 mr-1" />
                  Create New
                </button>
              </div>
              
              <div className="space-y-6">
                {dashboardData.projects.map((project) => (
                  <div key={project.id} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{project.name}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                          <span className="text-sm text-gray-600">{project.progress}%</span>
                          <span className="text-xs text-gray-500">• Due: {project.deadline}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <Edit className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          project.status === 'completed' ? 'bg-green-500' :
                          project.status === 'active' ? 'bg-blue-500' :
                          project.status === 'in-progress' ? 'bg-yellow-500' :
                          'bg-gray-400'
                        }`}
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* User Profile Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex flex-col items-center text-center mb-6">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 bg-gradient-to-r ${getRoleColor(user.role)}`}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
                <div className={`mt-2 px-4 py-1 rounded-full text-white text-sm flex items-center bg-gradient-to-r ${getRoleColor(user.role)}`}>
                  {getRoleIcon(user.role)}
                  <span className="ml-1 capitalize">{user.role}</span>
                </div>
                <p className="mt-2 text-gray-600">{user.email}</p>
                
                {user.phone && (
                  <p className="mt-1 text-gray-600">{user.phone}</p>
                )}
              </div>

              <div className="space-y-4">
                <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-shadow flex items-center justify-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
                
                <button className="w-full py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center">
                  <Eye className="w-4 h-4 mr-2" />
                  View Profile
                </button>
              </div>
            </div>

            {/* Team Members */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Team Members</h3>
              
              <div className="space-y-4">
                {dashboardData.teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center mr-3">
                        <span className="font-semibold text-blue-600">{member.avatar}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${
                        member.status === 'active' ? 'bg-green-500' :
                        member.status === 'away' ? 'bg-yellow-500' :
                        'bg-gray-400'
                      }`}></span>
                      <span className="text-xs text-gray-500">{member.status}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 py-2 border border-dashed border-gray-300 text-gray-500 rounded-lg hover:bg-gray-50 transition-colors">
                + Invite Team Member
              </button>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">System Status</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">API Server</span>
                  </div>
                  <span className="text-green-600 font-medium">Online</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">Database</span>
                  </div>
                  <span className="text-green-600 font-medium">Connected</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">Storage</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="h-2 bg-indigo-500 rounded-full"
                        style={{ width: `${dashboardData.stats.storageUsed}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-600">{dashboardData.stats.storageUsed}%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">Uptime</span>
                  </div>
                  <span className="text-gray-600">{dashboardData.stats.uptime}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors flex flex-col items-center">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-2">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-sm font-medium">My Projects</span>
          </button>
          
          <button className="p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors flex flex-col items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm font-medium">Calendar</span>
          </button>
          
          <button className="p-4 bg-white rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors flex flex-col items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm font-medium">Team</span>
          </button>
          
          <button className="p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors flex flex-col items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium">Settings</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 bg-white">
        <div className="px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <Shield className="h-6 w-6 text-indigo-600" />
              <span className="text-lg font-bold text-gray-900">Gurmuu User Dashboard</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <span>© {new Date().getFullYear()} Gurmuu Access Control</span>
              <span>•</span>
              <a href="#" className="hover:text-indigo-600">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-indigo-600">Terms of Service</a>
              <span>•</span>
              <a href="#" className="hover:text-indigo-600">Support</a>
            </div>
          </div>
          
          <div className="text-center md:text-right mt-4">
            <p className="text-xs text-gray-500">
              Logged in as: {user.email} • Role: <span className="font-medium capitalize">{user.role}</span> • Version: 1.0.0
            </p>
          </div>
        </div>
      </footer>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Logout Confirmation</h3>
              <p className="text-gray-600">
                Are you sure you want to logout from your account?
              </p>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-shadow"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}