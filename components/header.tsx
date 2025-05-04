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
    <>
      {/* Floating back button for small screens only */}
      {onBack && (
        <div className="flex sm:hidden">
          <button
            onClick={onBack}
            className="fixed bottom-8 left-4 z-20 p-3 rounded-full bg-white shadow-lg text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft size={24} />
          </button>
        </div>
      )}
      {/* Original header for screens sm and up */}
      <div className="hidden sm:flex w-full">
        <div className="p-4 flex items-center justify-between bg-white backdrop-blur-sm rounded-2xl shadow-sm m-4 sticky top-0 z-10 w-full">
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
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-200 border-2 border-white shadow-md"></div>
              <div>
                <p className="text-xs text-gray-500">Hello,</p>
                <p className="font-semibold -mt-1">{user?.firstName || 'User'}</p>
              </div>
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
      </div>
    </>
  );
} 