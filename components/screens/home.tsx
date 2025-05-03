import React from 'react';
import { MapPin, Search, Grid, Bell, ChevronDown } from 'lucide-react';

interface HomeScreenProps {
  onNext: () => void;
}

export function HomeScreen({ onNext }: HomeScreenProps) {
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-green-50 via-white to-white text-gray-900 overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm m-4">
        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-lg bg-gray-100 text-gray-600">
            <Grid size={20} />
          </button>
          <div className="w-8 h-8 rounded-full bg-blue-200 border-2 border-white shadow-md"></div> {/* Placeholder for avatar */}
          <div>
            <p className="text-xs text-gray-500">Hello,</p>
            <p className="font-semibold">Samms</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100">
            <Bell size={20} />
            <span className="absolute top-1 right-1 block h-4 w-4 rounded-full bg-blue-500 text-white text-[10px] font-bold leading-tight text-center border-2 border-white/80">
              3
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center px-6 text-center relative">
        {/* Background decorations */}
        <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-green-300/50 rounded-full blur-xl"></div>
        <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-green-500 rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-green-500 rounded-full"></div>

        {/* Location Pin */}
        <div className="relative mb-6">
          <div className="p-4 bg-green-100 rounded-full animate-pulse">
            <div className="p-3 bg-green-200 rounded-full">
              <MapPin size={32} className="text-green-600" />
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-2">Search around</h2>
        <h2 className="text-3xl font-bold mb-6">the world</h2>

        <button className="px-6 py-2 mb-12 bg-gray-100 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
          Skip
        </button>

        {/* Dashed line illustration */}
        <div className="absolute bottom-24 left-10 w-24 h-16">
          <svg width="100%" height="100%" viewBox="0 0 100 60" preserveAspectRatio="none">
            <path d="M5 50 Q 30 60, 50 40 T 95 5" stroke="#D1D5DB" strokeWidth="2" fill="none" strokeDasharray="4 4" markerEnd="url(#arrow)"/>
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#D1D5DB" />
              </marker>
            </defs>
          </svg>
        </div>
      </div>

      {/* Bottom Search Bar */}
      <div className="p-4 w-full">
        <div className="flex items-center bg-blue-600 text-white p-3 rounded-full shadow-lg">
          <MapPin size={20} className="ml-2 mr-3" />
          <span className="font-medium">Search in</span>
          <button className="flex items-center ml-2 mr-auto">
            <span className="font-bold">Location</span>
            <ChevronDown size={16} className="ml-1" />
          </button>
          <button className="p-2 bg-white/20 rounded-full hover:bg-white/30">
            <Search size={20} />
          </button>
        </div>
      </div>

      {/* Next Button */}
      <div className="p-4 w-full">
        <button className="w-full bg-blue-600 text-white py-4 rounded-full font-semibold text-lg shadow-md hover:bg-blue-700 transition-colors" onClick={onNext}>
          Next
        </button>
      </div>
    </div>
  );
} 