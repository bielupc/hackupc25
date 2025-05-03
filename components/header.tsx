import React from 'react';
import { Bell, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  user?: {
    firstName?: string;
  } | null;
  onBack?: () => void;
}

export function Header({ user, onBack }: HeaderProps) {
  return (
    <div className="p-4 flex items-center justify-between bg-white backdrop-blur-sm rounded-2xl shadow-sm m-4 sticky top-0 z-10">
      <div className="flex items-center space-x-3">
        {onBack && (
          <button
            onClick={onBack}
            className="mr-2 p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <div className="w-8 h-8 rounded-full bg-blue-200 border-2 border-white shadow-md"></div>
        <div>
          <p className="text-xs text-gray-500">Hello,</p>
          <p className="font-semibold -mt-1">{user?.firstName || 'User'}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100" aria-label="Notifications">
          <Bell size={24} />
          <span className="absolute -top-1 -right-1 block h-4 w-4 rounded-full bg-blue-500 text-white text-[10px] font-bold leading-tight text-center border-2 border-white/80">
            3
          </span>
        </button>
      </div>
    </div>
  );
} 