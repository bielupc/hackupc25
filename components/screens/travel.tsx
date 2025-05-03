import React, { useEffect, useState } from 'react';
import { ChevronRight, ChevronLeft, Bookmark, MapPin } from 'lucide-react';

interface TravelScreenProps {
  onNext: () => void;
  onBack?: () => void;
}

interface TravelRecommendation {
  destination: string;
  activities: string[];
  explanation: string;
}

export function TravelScreen({ onNext, onBack }: TravelScreenProps) {
  const [recommendation, setRecommendation] = useState<TravelRecommendation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the last recommendation from localStorage
    const lastRecommendation = localStorage.getItem('lastTravelRecommendation');
    if (lastRecommendation) {
      setRecommendation(JSON.parse(lastRecommendation));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-gradient-to-b from-green-50 via-white to-white text-gray-900 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Loading recommendations...</p>
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="flex flex-col h-full bg-gradient-to-b from-green-50 via-white to-white text-gray-900 items-center justify-center p-6">
        <p className="text-gray-600 text-center">No recommendations available. Please try generating new ideas.</p>
        <button
          onClick={onBack}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-green-50 via-white to-white text-gray-900 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* Header */}
      <div className="p-4 flex items-center justify-between bg-white/80 backdrop-blur-sm shadow-sm">
        <button
          onClick={onBack}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold">Your Travel Recommendation</h1>
        <div className="w-10"></div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Destination Card */}
        <div className="bg-white rounded-3xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{recommendation.destination}</h2>
                <p className="mt-4 text-gray-600">{recommendation.explanation}</p>
              </div>
              <button className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100">
                <Bookmark size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Activities */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold px-2">Recommended Activities</h3>
          {recommendation.activities.map((activity, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <MapPin size={20} />
                </div>
                <p className="text-gray-800">{activity}</p>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </div>
          ))}
        </div>
      </div>

      {/* Next Button */}
      <div className="p-4 w-full">
        <button
          className="w-full bg-blue-600 text-white py-4 rounded-full font-semibold text-lg shadow-md hover:bg-blue-700 transition-colors"
          onClick={onNext}
        >
          Continue Planning
        </button>
      </div>
    </div>
  );
} 