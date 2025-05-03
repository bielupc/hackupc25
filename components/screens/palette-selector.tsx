import React from 'react';
import { ChevronLeft, Check } from 'lucide-react';

interface PaletteSelectorProps {
  onBack: () => void;
  onSelect: (palette: string) => void;
  selectedPalette: string;
}

const colorPalettes = [
  { name: 'Sunset', colors: ['#FF6B6B', '#FFE66D', '#4ECDC4'] },
  { name: 'Ocean', colors: ['#1A535C', '#4ECDC4', '#F7FFF7'] },
  { name: 'Forest', colors: ['#2D6A4F', '#74C69D', '#D8F3DC'] },
  { name: 'Desert', colors: ['#E9C46A', '#F4A261', '#E76F51'] },
  { name: 'Nordic', colors: ['#2E3440', '#88C0D0', '#ECEFF4'] },
  { name: 'Pastel', colors: ['#FFB3BA', '#BAFFC9', '#BAE1FF'] },
  { name: 'Vintage', colors: ['#D4B483', '#C1666B', '#F4D03F'] },
  { name: 'Neon', colors: ['#FF00FF', '#00FFFF', '#FFFF00'] },
  { name: 'Muted', colors: ['#A5A5A5', '#D4D4D4', '#F5F5F5'] },
  { name: 'Warm', colors: ['#FF7F50', '#FFA07A', '#FFDAB9'] },
  { name: 'Cool', colors: ['#4682B4', '#87CEEB', '#B0E0E6'] },
  { name: 'Nature', colors: ['#556B2F', '#8FBC8F', '#F0FFF0'] },
];

export function PaletteSelector({ onBack, onSelect, selectedPalette }: PaletteSelectorProps) {
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-green-50 via-white to-white">
      {/* Header */}
      <div className="p-4 flex items-center bg-white/80 backdrop-blur-sm shadow-sm">
        <button
          onClick={onBack}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all duration-200"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold ml-4">Select Color Palette</h1>
      </div>

      {/* Palette Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-4">
          {colorPalettes.map((palette) => (
            <button
              key={palette.name}
              onClick={() => onSelect(palette.name)}
              className={`relative aspect-square rounded-3xl overflow-hidden group transition-all duration-200 ${
                selectedPalette === palette.name
                  ? 'ring-4 ring-blue-500 shadow-lg'
                  : 'hover:shadow-md'
              }`}
            >
              <div className="absolute inset-0 flex flex-col">
                {palette.colors.map((color, i) => (
                  <div
                    key={i}
                    className="flex-1"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200" />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-white font-medium">{palette.name}</p>
              </div>
              {selectedPalette === palette.name && (
                <div className="absolute top-4 right-4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg">
                  <Check size={20} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 