'use client'

import React, { useState } from 'react';
import { MapPin, Search, Grid, Bell, ChevronDown, Camera, Music, Palette, Plus, X } from 'lucide-react';

interface HomeScreenProps {
  onNext: () => void;
  onPaletteSelect?: () => void;
  selectedPalette?: string;
}

const colorPalettes = [
  { name: 'Sunset', colors: ['#FF6B6B', '#FFE66D', '#4ECDC4'] },
  { name: 'Ocean', colors: ['#1A535C', '#4ECDC4', '#F7FFF7'] },
  { name: 'Forest', colors: ['#2D6A4F', '#74C69D', '#D8F3DC'] },
  { name: 'Desert', colors: ['#E9C46A', '#F4A261', '#E76F51'] },
];

export function HomeScreen({ onNext, onPaletteSelect, selectedPalette = 'Sunset' }: HomeScreenProps) {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [spotifyUrl, setSpotifyUrl] = useState<string>('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setSelectedImages(prev => [...prev, ...newImages].slice(0, 6));
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const currentPalette = colorPalettes.find(p => p.name === selectedPalette) || colorPalettes[0];

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-green-50 via-white to-white text-gray-900 overflow-y-auto">
      {/* Header */}
      <div className="p-4 flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm m-4 sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-lg bg-gray-100 text-gray-600">
            <Grid size={20} />
          </button>
          <div className="w-8 h-8 rounded-full bg-blue-200 border-2 border-white shadow-md"></div>
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
      <div className="flex-grow px-6 space-y-8 pb-6">
        {/* Image Upload Section */}
        <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 shadow-sm">
          <div className="grid grid-cols-3 gap-4">
            {selectedImages.map((image, index) => (
              <div key={index} className="relative aspect-square rounded-2xl overflow-hidden group">
                <img src={image} alt={`Uploaded ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black/70"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            {selectedImages.length < 6 && (
              <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-all duration-200 hover:bg-blue-50/50 group">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <Camera size={28} className="text-gray-400 group-hover:text-blue-500 mb-2" />
              </label>
            )}
          </div>
        </div>

        {/* Color Palette Preview */}
        <button 
          onClick={() => onPaletteSelect?.()}
          className="w-full bg-white/50 backdrop-blur-sm rounded-3xl p-6 shadow-sm hover:bg-white/70 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex -space-x-2">
                {currentPalette.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="font-medium text-gray-700">{currentPalette.name}</span>
            </div>
            <ChevronDown size={20} className="text-gray-400" />
          </div>
        </button>

        {/* Spotify Playlist Section */}
        <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 shadow-sm">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Music size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Add your Spotify playlist"
              value={spotifyUrl}
              onChange={(e) => setSpotifyUrl(e.target.value)}
              className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/50"
            />
            {spotifyUrl && (
              <button
                onClick={() => setSpotifyUrl('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Next Button */}
      <div className="p-4 w-full">
        <button
          className="w-full bg-blue-600 text-white py-4 rounded-full font-semibold text-lg shadow-md hover:bg-blue-700 transition-all duration-200"
          onClick={onNext}
        >
          Next
        </button>
      </div>
    </div>
  );
} 