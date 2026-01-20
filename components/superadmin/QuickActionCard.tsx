'use client';

import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  color: string;
}

export default function QuickActionCard({ title, description, icon: Icon, path, color }: QuickActionCardProps) {
  return (
    <Link
      href={path}
      className="group block p-6 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-lg ${color} group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 group-hover:text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
          Take action →
        </span>
      </div>
    </Link>
  );
}