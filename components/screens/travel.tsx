import React, { useEffect, useState } from 'react';
import { ChevronRight, ChevronLeft, Bookmark, MapPin, Heart, X } from 'lucide-react';

interface TravelScreenProps {
  onNext: () => void;
  onBack?: () => void;
}

interface TravelRecommendation {
  destination: string;
  activities: string[];
  explanation: string;
}

interface PexelsMedia {
  id: number;
  src: {
    large?: string;
    medium?: string;
    small?: string;
    portrait?: string;
    landscape?: string;
    tiny?: string;
  };
  video_files?: Array<{
    link: string;
    quality: string;
    width: number;
    height: number;
  }>;
}

export function TravelScreen({ onNext, onBack }: TravelScreenProps) {
  const [recommendation, setRecommendation] = useState<TravelRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [destinationImage, setDestinationImage] = useState<string>('');
  const [activityVideos, setActivityVideos] = useState<{ [key: string]: PexelsMedia[] }>({});
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [likedActivities, setLikedActivities] = useState<string[]>([]);

  useEffect(() => {
    // Get the last recommendation from localStorage
    const lastRecommendation = localStorage.getItem('lastTravelRecommendation');
    if (lastRecommendation) {
      const parsedRecommendation = JSON.parse(lastRecommendation);
      setRecommendation(parsedRecommendation);
      fetchDestinationImage(parsedRecommendation.destination);
      fetchActivityVideos(parsedRecommendation.activities);
    }
    setLoading(false);
  }, []);

  const fetchDestinationImage = async (destination: string) => {
    try {
      const response = await fetch(`/api/pexels?query=${encodeURIComponent(destination)}&per_page=1`);
      const data = await response.json();
      if (data.photos && data.photos.length > 0) {
        setDestinationImage(data.photos[0].src.large);
      }
    } catch (error) {
      console.error('Error fetching destination image:', error);
    }
  };

  const fetchActivityVideos = async (activities: string[]) => {
    const videos: { [key: string]: PexelsMedia[] } = {};
    for (const activity of activities) {
      try {
        const response = await fetch(`/api/pexels?query=${encodeURIComponent(activity)}&type=video&per_page=3`);
        const data = await response.json();
        if (data.videos) {
          videos[activity] = data.videos;
        }
      } catch (error) {
        console.error('Error fetching activity videos:', error);
      }
    }
    setActivityVideos(videos);
  };

  const handleActivityLike = (activity: string) => {
    setLikedActivities(prev => [...prev, activity]);
    setShowVideo(false);
    setCurrentActivityIndex(prev => prev + 1);
  };

  const handleActivityDislike = () => {
    setShowVideo(false);
    setCurrentActivityIndex(prev => prev + 1);
  };

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

  const currentActivity = recommendation.activities[currentActivityIndex];
  const currentVideos = activityVideos[currentActivity] || [];

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-green-50 via-white to-white text-gray-900 overflow-hidden">
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

      {/* Hero Image */}
      <div className="relative h-1/2 w-full">
        {destinationImage && (
          <img
            src={destinationImage}
            alt={recommendation.destination}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="p-6 w-full">
            <h2 className="text-4xl font-bold text-white mb-2">{recommendation.destination}</h2>
            <p className="text-white/90">{recommendation.explanation}</p>
          </div>
        </div>
      </div>

      {/* Activities Section */}
      <div className="flex-1 overflow-hidden">
        {currentActivityIndex < recommendation.activities.length ? (
          <div className="h-full flex flex-col">
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">Activity {currentActivityIndex + 1}/{recommendation.activities.length}</h3>
              <p className="text-gray-600">{currentActivity}</p>
            </div>
            
            {!showVideo ? (
              <div className="flex-1 flex items-center justify-center p-4">
                <button
                  onClick={() => setShowVideo(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  Watch Video
                </button>
              </div>
            ) : (
              <div className="flex-1 relative">
                {currentVideos.length > 0 && (
                  <video
                    src={currentVideos[0].video_files?.[0].link}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                )}
                <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-center space-x-8">
                  <button
                    onClick={handleActivityDislike}
                    className="p-4 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                  >
                    <X size={32} className="text-white" />
                  </button>
                  <button
                    onClick={() => handleActivityLike(currentActivity)}
                    className="p-4 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                  >
                    <Heart size={32} className="text-white" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-6">
            <h3 className="text-xl font-semibold mb-4">You've reviewed all activities!</h3>
            <div className="space-y-4">
              <h4 className="font-medium">Liked Activities:</h4>
              <ul className="space-y-2">
                {likedActivities.map((activity, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <Heart size={16} className="text-red-500" />
                    <span>{activity}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={onNext}
              className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            >
              Continue Planning
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 