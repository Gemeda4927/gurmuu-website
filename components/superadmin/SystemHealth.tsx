'use client';

import { 
  Server, Database, Network, Cpu,
  HardDrive, Shield, Activity, Zap,
  AlertTriangle, CheckCircle, XCircle,
  TrendingUp, Clock, RefreshCw
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface SystemComponent {
  id: number;
  name: string;
  type: 'database' | 'server' | 'network' | 'storage' | 'api' | 'auth';
  status: 'healthy' | 'degraded' | 'down' | 'maintenance';
  uptime: string;
  responseTime: number;
  usage: number;
  capacity: string;
}

export default function SystemHealth() {
  const [components, setComponents] = useState<SystemComponent[]>([
    {
      id: 1,
      name: 'Main Database',
      type: 'database',
      status: 'healthy',
      uptime: '99.9%',
      responseTime: 45,
      usage: 65,
      capacity: '2.4TB / 4TB'
    },
    {
      id: 2,
      name: 'API Server',
      type: 'server',
      status: 'healthy',
      uptime: '100%',
      responseTime: 12,
      usage: 42,
      capacity: '16GB / 32GB'
    },
    {
      id: 3,
      name: 'Authentication Service',
      type: 'auth',
      status: 'healthy',
      uptime: '99.95%',
      responseTime: 8,
      usage: 28,
      capacity: '4GB / 8GB'
    },
    {
      id: 4,
      name: 'File Storage',
      type: 'storage',
      status: 'degraded',
      uptime: '98.7%',
      responseTime: 120,
      usage: 85,
      capacity: '1.8TB / 2TB'
    },
    {
      id: 5,
      name: 'Load Balancer',
      type: 'network',
      status: 'healthy',
      uptime: '99.99%',
      responseTime: 5,
      usage: 35,
      capacity: '50K req/s'
    },
  ]);

  const [lastChecked, setLastChecked] = useState<string>('Just now');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getComponentIcon = (type: SystemComponent['type']) => {
    switch (type) {
      case 'database':
        return <Database className="w-5 h-5" />;
      case 'server':
        return <Server className="w-5 h-5" />;
      case 'network':
        return <Network className="w-5 h-5" />;
      case 'storage':
        return <HardDrive className="w-5 h-5" />;
      case 'api':
        return <Activity className="w-5 h-5" />;
      case 'auth':
        return <Shield className="w-5 h-5" />;
      default:
        return <Server className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: SystemComponent['status']) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-600';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-600';
      case 'down':
        return 'bg-red-100 text-red-600';
      case 'maintenance':
        return 'bg-blue-100 text-blue-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status: SystemComponent['status']) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4" />;
      case 'degraded':
        return <AlertTriangle className="w-4 h-4" />;
      case 'down':
        return <XCircle className="w-4 h-4" />;
      case 'maintenance':
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getUsageColor = (usage: number) => {
    if (usage < 70) return 'bg-green-500';
    if (usage < 85) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      const now = new Date();
      setLastChecked(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setIsRefreshing(false);
    }, 1000);
  };

  // Calculate overall system health
  const healthyComponents = components.filter(c => c.status === 'healthy').length;
  const totalComponents = components.length;
  const systemHealth = Math.round((healthyComponents / totalComponents) * 100);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">System Health</h2>
          <p className="text-sm text-gray-500">Monitor system components</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            <span>Updated {lastChecked}</span>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Overall Health */}
      <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg flex items-center justify-center mr-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Overall System Health</h3>
              <p className="text-sm text-gray-500">All components status</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{systemHealth}%</div>
            <div className="text-sm text-gray-500">
              {healthyComponents} of {totalComponents} healthy
            </div>
          </div>
        </div>
        
        {/* Health Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>System Status</span>
            <span>{systemHealth}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                systemHealth >= 90 ? 'bg-green-500' :
                systemHealth >= 75 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${systemHealth}%` }}
            />
          </div>
        </div>
      </div>

      {/* Components List */}
      <div className="space-y-4">
        {components.map((component) => (
          <div key={component.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {getComponentIcon(component.type)}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{component.name}</h4>
                  <p className="text-sm text-gray-500">{component.type.toUpperCase()}</p>
                </div>
              </div>
              
              <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(component.status)}`}>
                {getStatusIcon(component.status)}
                <span className="ml-1 capitalize">{component.status}</span>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div>
                <p className="text-xs text-gray-500">Uptime</p>
                <p className="font-medium text-gray-900">{component.uptime}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Response Time</p>
                <p className="font-medium text-gray-900">{component.responseTime}ms</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Usage</p>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mr-2">
                    <div 
                      className={`h-1.5 rounded-full ${getUsageColor(component.usage)}`}
                      style={{ width: `${component.usage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{component.usage}%</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Capacity</p>
                <p className="font-medium text-gray-900">{component.capacity}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* System Alerts */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-900">System Alerts</h4>
          <span className="text-sm text-gray-500">1 Active</span>
        </div>
        
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Storage Usage High</p>
              <p className="text-sm text-gray-600 mt-1">
                File storage is at 85% capacity. Consider expanding storage soon.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}