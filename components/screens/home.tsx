'use client'

import React, { useState, useEffect } from 'react';
import { MapPin, Search, Grid, Bell, ChevronDown, Camera, Music, Palette, Plus, X, Sparkles, Check } from 'lucide-react';
import { colorPalettes } from './palette-selector';
import type { User } from './auth-page';
import type { Song } from '../search-song';
import { supabase } from '../../lib/supabase';
import { Header } from '../header';

interface HomeScreenProps {
  user?: User | null;
  group?: { id: string; name: string; code: string } | null;
  onNext: () => void;
  onBack: () => void;
  onSignOut: () => void;
  onPaletteSelect?: () => void;
  selectedPalette?: string;
  setSelectedPalette: React.Dispatch<React.SetStateAction<string>>;
  onSongSelect?: () => void;
  selectedSongs: Song[];
  setSelectedSongs: React.Dispatch<React.SetStateAction<Song[]>>;
  selectedImages: string[];
  setSelectedImages: React.Dispatch<React.SetStateAction<string[]>>;
}

export function HomeScreen({ 
  user,
  group,
  onNext, 
  onBack,
  onSignOut,
  onPaletteSelect, 
  selectedPalette = 'Sunset',
  setSelectedPalette,
  onSongSelect,
  selectedSongs,
  setSelectedSongs,
  selectedImages,
  setSelectedImages,
}: HomeScreenProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Save preferences when they change
  useEffect(() => {
    const savePreferences = async () => {
      if (!user?.id || !group?.id) return;
      await supabase.from('group_preferences').upsert({
        user_id: user.id,
        group_id: group.id,
        palette: selectedPalette,
        selected_images: selectedImages,
        selected_songs: selectedSongs,
      });
    };
    savePreferences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, group?.id, selectedPalette, selectedImages, selectedSongs]);

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

  const removeSong = (index: number) => {
    setSelectedSongs((prev) => prev.filter((_, i) => i !== index));
  }

  const currentPalette = colorPalettes.find(p => p.name === selectedPalette) || colorPalettes[0];

  const handleSubmitPreferences = async () => {
    try {
      setIsLoading(true);
      
      // Check if both images and songs are selected
      if (!selectedImages.length || !selectedSongs.length) {
        console.error('Both images and songs must be selected');
        return;
      }

      // Save preferences
      if (!user?.id || !group?.id) return;
      await supabase.from('group_preferences').upsert({
        user_id: user.id,
        group_id: group.id,
        palette: selectedPalette,
        selected_images: selectedImages,
        selected_songs: selectedSongs,
      });

      // Check if all members have submitted preferences
      const { data: groupMembers, error: membersError } = await supabase
        .from('user_groups')
        .select('user_id')
        .eq('group_id', group.id);
      
      const { data: submittedPreferences, error: preferencesError } = await supabase
        .from('group_preferences')
        .select('user_id, selected_images, selected_songs, palette')
        .eq('group_id', group.id);

      if (membersError || preferencesError) {
        console.error('Error checking group members or preferences:', membersError || preferencesError);
        return;
      }

      // Check if all members have submitted complete preferences
      const allMembersSubmitted = groupMembers && submittedPreferences && 
        groupMembers.length === submittedPreferences.length &&
        groupMembers.every(member => {
          const memberPreferences = submittedPreferences.find(pref => pref.user_id === member.user_id);
          return memberPreferences && 
                 memberPreferences.selected_images && 
                 memberPreferences.selected_images.length > 0 &&
                 memberPreferences.selected_songs && 
                 memberPreferences.selected_songs.length > 0;
        });

      if (allMembersSubmitted) {
        // All members have submitted complete preferences, generate activities
        try {
          // Combine all preferences
          const allImages = submittedPreferences.flatMap(pref => pref.selected_images || []);
          const allSongs = submittedPreferences.flatMap(pref => pref.selected_songs || []);
          const allPalettes = submittedPreferences.map(pref => pref.palette);

          // Get unique values
          const uniqueImages = [...new Set(allImages)];
          const uniquePalettes = [...new Set(allPalettes)];

          // Generate recommendations
          const response = await fetch('/api/travel/recommendations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              images: uniqueImages,
              palette: uniquePalettes.join(', '),
              albumMood: allSongs.map(song => song.title).join(', ')
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to generate recommendations');
          }

          const recommendations = await response.json();
          
          // Save recommendations to the group
          const { error: updateError } = await supabase
            .from('groups')
            .update({ 
              state: 'activities',
              recommendations: recommendations
            })
            .eq('id', group.id);

          if (updateError) {
            console.error('Error updating group state:', updateError);
          }
        } catch (error) {
          console.error('Error generating recommendations:', error);
        }
      }

      // Always redirect to groups screen after submission
      onNext();
    } catch (error) {
      console.error('Error submitting preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-blue-100 via-white to-white text-gray-900 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-4">
      <Header user={user} onBack={onBack} onSignOut={onSignOut} />
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
            {selectedSongs.map((song, index) => (
              <div
                key={song.id}
                className="relative aspect-square rounded-2xl overflow-hidden group transition-all duration-200 hover:shadow-md"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <img
                  src={song.image}
                  alt={song.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-medium truncate">{song.title}</p>
                </div>
                <button
                  onClick={() => removeSong(index)}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black/70"
                >
                  <X size={16} />
                </button>
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
              : selectedImages.length === 0 || selectedSongs.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
          onClick={handleSubmitPreferences}
          disabled={isLoading || selectedImages.length === 0 || selectedSongs.length === 0}
        >
          {isLoading 
            ? 'Submitting...' 
            : selectedImages.length === 0 
              ? 'Add at least one image'
              : selectedSongs.length === 0
                ? 'Add at least one song'
                : 'Submit Preferences'
          }
        </button>
      </div>
    </div>
  );
} 