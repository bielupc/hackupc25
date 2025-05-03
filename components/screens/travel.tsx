import React from 'react';
import { Bookmark, ChevronRight, Star, UserCircle, SlidersHorizontal } from 'lucide-react';

interface TravelScreenProps {
  onNext: () => void;
  selectedPalette?: string;
  selectedImages?: string[];
  setSelectedImages?: React.Dispatch<React.SetStateAction<string[]>>;
  selectedAlbum?: string | null;
  setSelectedAlbum?: React.Dispatch<React.SetStateAction<string | null>>;
}

const places = [
  {
    name: 'Brooklyn Bridge',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    crowd: 'Sparsely Crowded',
    distance: '1.3km',
    time: '15 mins',
    crowdedness: 'bg-gray-700',
  },
  {
    name: 'Central Park',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
    crowd: 'Crowded',
    distance: '2.8km',
    time: '32 mins',
    crowdedness: 'bg-yellow-700',
  },
  {
    name: 'Tokyo Tower',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80',
    crowd: 'Not Crowded',
    distance: '5.1km',
    time: '1 hr',
    crowdedness: 'bg-green-700',
  },
];

export function TravelScreen({ onNext }: TravelScreenProps) {
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-zinc-900 to-zinc-800 text-white">
      {/* Cards */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-6 pt-12">
        {places.map((place, idx) => (
          <div key={place.name} className="relative rounded-3xl overflow-hidden shadow-lg group">
            <img src={place.image} alt={place.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform" />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            {/* Crowd label */}
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium bg-zinc-700/80 text-white shadow">{place.crowd}</div>
            {/* Bookmark icon */}
            <button className="absolute top-3 right-3 bg-zinc-900/70 rounded-full p-2 text-white hover:bg-zinc-800">
              <Bookmark size={18} />
            </button>
            {/* Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2">
              <div className="text-lg font-semibold">{place.name}</div>
              <div className="flex items-center gap-4 text-sm text-zinc-200">
                <span>{place.distance} away</span>
                <span>·</span>
                <span>🚶 {place.time}</span>
              </div>
              <button className="self-end flex items-center gap-2 px-4 py-1.5 rounded-full bg-lime-400 text-zinc-900 font-semibold shadow hover:bg-lime-300 transition-colors">
                Start <ChevronRight size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Next Button */}
      <div className="p-4 w-full">
        <button className="w-full bg-lime-400 text-zinc-900 py-4 rounded-full font-semibold text-lg shadow-md hover:bg-lime-300 transition-colors" onClick={onNext}>
          Next
        </button>
      </div>
    </div>
  );
} 