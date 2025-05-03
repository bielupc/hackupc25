'use client'

import React, { useState } from 'react';
import { MapPin, Search, Grid, Bell, ChevronDown, Camera, Music, Palette, Plus, X, Sparkles, Check } from 'lucide-react';
import { colorPalettes } from './palette-selector';
import type { User } from './auth-page';
import type { Song } from '../search-song';



interface HomeScreenProps {
  user?: User | null;
  onNext: () => void;
  onPaletteSelect?: () => void;
  selectedPalette?: string;
  onSongSelect?: () => void;
  selectedSongs: Song[];

  selectedImages: string[];
  setSelectedImages: React.Dispatch<React.SetStateAction<string[]>>;
  selectedAlbum: string | null;
  setSelectedAlbum: React.Dispatch<React.SetStateAction<string | null>>;
}

export function HomeScreen({ 
  user,
  onNext, 
  onPaletteSelect, 
  selectedPalette = 'Sunset',
  onSongSelect,
  selectedSongs,

  selectedImages,
  setSelectedImages,
  selectedAlbum,
  setSelectedAlbum
}: HomeScreenProps) {
  const [showAlbumSelector, setShowAlbumSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = await Promise.all(
        Array.from(files).map(async (file) => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result as string);
            };
            reader.readAsDataURL(file);
          });
        })
      );
      setSelectedImages(prev => [...prev, ...newImages].slice(0, 6));
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const currentPalette = colorPalettes.find(p => p.name === selectedPalette) || colorPalettes[0];

  const handleGenerateIdeas = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/travel/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          images: selectedImages,
          palette: selectedPalette,
          songs: selectedSongs.map(song => song.title),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate recommendations');
      }

      const data = await response.json();
      localStorage.setItem('lastTravelRecommendation', JSON.stringify(data));

      // After successful API call, proceed to next screen
      onNext();
    } catch (error) {
      console.error('Error generating travel ideas:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-green-50 via-white to-white text-gray-900 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

      {/* Header */}
      <div className="p-4 flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm m-4 sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-lg bg-gray-100 text-gray-600">
            <Grid size={20} />
          </button>
          <div className="w-8 h-8 rounded-full bg-blue-200 border-2 border-white shadow-md"></div>
          <div>
            <p className="text-xs text-gray-500">Hello,</p>
            <p className="font-semibold">{user?.firstName || 'User'}</p>
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
        {/* Mood Board Section */}
        <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <Sparkles className="mr-2 text-blue-500" size={20} />
              Your Mood Board
            </h2>
            <span className="text-sm text-gray-500">{selectedImages.length}/6 images</span>
          </div>
          
          <div className="space-y-4">
            {selectedImages.map((image, index) => (
              <div key={index} className="relative w-full aspect-square rounded-2xl overflow-hidden group">
                <img src={image} alt={`Uploaded ${index + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black/70"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            {selectedImages.length < 6 && (
              <div className="w-full aspect-square rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-all duration-200 hover:bg-blue-50/50 group">
                <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <Camera size={28} className="text-gray-400 group-hover:text-blue-500 mb-2" />
                  <span className="text-sm text-gray-500 group-hover:text-blue-500">Add inspiration</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Album Selection */}
        <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <Music className="mr-2 text-blue-500" size={20} />
              Select Mood Music
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 py-4">
            {selectedSongs.map((song) => (
              <div
                key={song.id}
                className="relative aspect-square rounded-2xl overflow-hidden group transition-all duration-200 hover:shadow-md"
              >
                <img
                  src={song.image}
                  alt={song.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-medium truncate">{song.title}</p>
                </div>
              </div>
            ))}
            {selectedSongs.length < 2 && (
              <div className="w-full aspect-square rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-all duration-200 hover:bg-blue-50/50 group">
                <button
                  onClick={() => onSongSelect?.()}
                  className="w-full h-full flex flex-col items-center justify-center"
                >
                  <Music size={28} className="text-gray-400 group-hover:text-blue-500 mb-2" />
                  <span className="text-sm text-gray-500 group-hover:text-blue-500">Add song</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Color Palette Preview */}
        <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <Palette className="mr-2 text-blue-500" size={20} />
              Select Color Palette
            </h2>
          </div>

          <button 
            onClick={() => onPaletteSelect?.()}
            className="relative w-full aspect-[3/1] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group"
          >
            <div className="w-full h-full flex transition-all duration-300 ease-in-out">
              {currentPalette.colors.map((color, i) => (
                <div
                  key={i}
                  className="flex-1 transition-colors duration-300 ease-in-out"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200" />
            <div className="absolute bottom-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700">
              {selectedPalette}
            </div>
          </button>
        </div>
      </div>

      {/* Next Button */}
      <div className="p-4 w-full">
        <button
          className={`w-full py-4 rounded-full font-semibold text-lg shadow-md transition-all duration-200 ${
            isLoading 
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
          onClick={handleGenerateIdeas}
          disabled={isLoading}
        >
          {isLoading ? 'Generating Ideas...' : 'Generate Travel Ideas'}
        </button>
      </div>
    </div>
  );
} 