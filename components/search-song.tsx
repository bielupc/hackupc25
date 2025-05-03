'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

export interface Song {
  id: string;
  title: string;
  image: string;
}

interface SongSearcherProps {
  onSelect: (song: any) => void;
}

export default function SongSearcher({ onSelect }: SongSearcherProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch default songs on component mount
  useEffect(() => {
    const fetchDefaultSongs = async () => {
      const res = await fetch('/api/itunes?q=top');
      const data = await res.json();
      setResults(data.results || []);
    };
    fetchDefaultSongs();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(async () => {
      const res = await fetch(`/api/itunes?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results || []);
    }, 500); 

    setTypingTimeout(timeout);
  }, [query]);

  return (
    <div className="my-6 px-0 relative">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search for music..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
        />
      </div>

      {/* Search Results */}
      {results.length > 0 && (
        <ul className="mt-4 space-y-3 overflow-y-auto rounded-lg">
          {results.map((song) => (
            <li onClick={() => onSelect(formatSong(song))}
              key={song.trackId}
              className="p-3 border rounded-lg bg-white shadow-sm hover:bg-gray-50 transition flex items-center cursor-pointer"
            >
              <img
          src={song.artworkUrl100}
          alt={`${song.trackName} album cover`}
          className="w-16 h-16 rounded-lg mr-4"
              />
              <div>
          <div className="font-medium">{song.trackName}</div>
          <div className="text-sm text-gray-500">{song.artistName}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function formatSong(song: any): Song {
  return {
    id: song.trackId,
    title: song.trackName,
    image: song.artworkUrl100,
  };
}