import React from 'react';
import { Bell, ArrowLeft } from 'lucide-react';
import { LogOut } from 'lucide-react';

interface HeaderProps {
  user?: {
    firstName?: string;
  } | null;
  onBack?: () => void;
  onSignOut?: () => void;
}

export function Header({ user, onBack, onSignOut }: HeaderProps) {
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
      <div className="flex items-center">
        <button
         onClick={onSignOut}
         className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
         >
         <LogOut size={20} />
        </button>
      </div>
    </div>
  );
} 