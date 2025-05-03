"use client"

import { useState } from "react"
import { Search, Music } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SpotifySelectorProps {
  onSelect: (playlistId: string) => void
  selectedPlaylist: string | null
}

// Mock data for playlists
const MOCK_PLAYLISTS = [
  { id: "1", name: "Road Trip Vibes", image: "/placeholder.svg?height=60&width=60", creator: "Spotify" },
  { id: "2", name: "Beach Chill", image: "/placeholder.svg?height=60&width=60", creator: "wanderlust" },
  { id: "3", name: "City Explorer", image: "/placeholder.svg?height=60&width=60", creator: "Spotify" },
  { id: "4", name: "Mountain Hiking", image: "/placeholder.svg?height=60&width=60", creator: "wanderlust" },
  { id: "5", name: "Sunset Dreams", image: "/placeholder.svg?height=60&width=60", creator: "Spotify" },
]

export default function SpotifySelector({ onSelect, selectedPlaylist }: SpotifySelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPlaylists = MOCK_PLAYLISTS.filter((playlist) =>
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="p-4">
      <div className="relative mb-6">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search playlists..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredPlaylists.length > 0 ? (
        <div className="space-y-3">
          {filteredPlaylists.map((playlist) => (
            <div
              key={playlist.id}
              className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
                selectedPlaylist === playlist.id ? "bg-gray-100" : "hover:bg-gray-50"
              }`}
              onClick={() => onSelect(playlist.id)}
            >
              <img src={playlist.image || "/placeholder.svg"} alt={playlist.name} className="w-12 h-12 rounded mr-3" />
              <div className="flex-1">
                <h3 className="text-sm font-medium">{playlist.name}</h3>
                <p className="text-xs text-gray-500">By {playlist.creator}</p>
              </div>
              {selectedPlaylist === playlist.id && <div className="h-3 w-3 rounded-full bg-green-500 mr-1"></div>}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
          <Music className="h-12 w-12 mb-2" />
          <p className="text-sm">No playlists found</p>
        </div>
      )}
    </div>
  )
}
