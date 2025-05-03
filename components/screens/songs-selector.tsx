import React from 'react';
import { ChevronLeft, Check, ArrowLeft } from 'lucide-react';
import SongSearcher, { Song } from '@/components/search-song';

interface SongSelectorProps {
  onBack: () => void;
  onSelect: (song: Song) => void;
  selectedSongs: Song[]; 
}

export function SongSelector({ onBack, onSelect, selectedSongs}: SongSelectorProps) {
  return (
     <div className="flex flex-col h-full bg-gradient-to-b from-blue-100 via-white to-white">
      {/* Header */}
      <div className="p-4 flex items-center bg-white/80 backdrop-blur-sm shadow-sm">
        <button
          onClick={onBack}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all duration-200 flex items-center"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Back</span>
        </button>
      </div>

      {/* Song Grid */}
      <div className="my-2 px-4 relative overflow-scroll">
        <SongSearcher onSelect={onSelect} />
      </div>
          
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-4">
        </div>
      </div>
    </div>
    
  );
} 