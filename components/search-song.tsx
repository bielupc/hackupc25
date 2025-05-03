'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

export default function SongSearcher() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(async () => {
      const res = await fetch(`/api/itunes?q=${encodeURIComponent(query)}`);
      console.log(res)
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
        <ul className="mt-4 space-y-3">
          {results.map((song) => (
            <li
              key={song.trackId}
              className="p-3 border rounded-lg bg-white shadow-sm hover:bg-gray-50 transition"
            >
              <div className="font-medium">{song.trackName}</div>
              <div className="text-sm text-gray-500">{song.artistName}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}