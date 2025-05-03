"use client"

import { useState } from "react"
import { Check } from "lucide-react"

interface ColorPaletteSelectorProps {
  onSelect: (colors: string[]) => void
  selectedColors: string[]
}

// Predefined color palettes
const COLOR_PALETTES = [
  {
    id: "vibrant",
    name: "Vibrant",
    colors: ["#FF5252", "#FF9800", "#FFEB3B", "#66BB6A", "#42A5F5"],
  },
  {
    id: "pastel",
    name: "Pastel",
    colors: ["#FFD3E0", "#FFF0D3", "#D3EAFF", "#D3FFE6", "#F0D3FF"],
  },
  {
    id: "earthy",
    name: "Earthy",
    colors: ["#8D6E63", "#A1887F", "#BCAAA4", "#D7CCC8", "#EFEBE9"],
  },
  {
    id: "monochrome",
    name: "Monochrome",
    colors: ["#212121", "#424242", "#616161", "#9E9E9E", "#E0E0E0"],
  },
  {
    id: "ocean",
    name: "Ocean",
    colors: ["#006064", "#00838F", "#0097A7", "#00ACC1", "#26C6DA"],
  },
]

export default function ColorPaletteSelector({ onSelect, selectedColors }: ColorPaletteSelectorProps) {
  const [selectedPalette, setSelectedPalette] = useState<string | null>(null)

  const handleSelectPalette = (paletteId: string, colors: string[]) => {
    setSelectedPalette(paletteId)
    onSelect(colors)
  }

  return (
    <div className="p-4">
      <h3 className="text-sm font-medium mb-4">Choose a color palette that matches your travel mood</h3>

      <div className="space-y-4">
        {COLOR_PALETTES.map((palette) => (
          <div
            key={palette.id}
            className={`border rounded-lg p-3 cursor-pointer transition-all ${
              selectedPalette === palette.id ? "ring-2 ring-gray-900" : "hover:bg-gray-50"
            }`}
            onClick={() => handleSelectPalette(palette.id, palette.colors)}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">{palette.name}</span>
              {selectedPalette === palette.id && <Check className="h-4 w-4" />}
            </div>

            <div className="flex space-x-2">
              {palette.colors.map((color, index) => (
                <div key={index} className="w-8 h-8 rounded-full" style={{ backgroundColor: color }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
