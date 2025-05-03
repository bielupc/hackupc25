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
  const [selectedVideo, setSelectedVideo] = useState<{ activity: string; video: PexelsMedia } | null>(null);
  const [likedActivities, setLikedActivities] = useState<string[]>([]);

  useEffect(() => {
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
    setSelectedVideo(null);
  };

  const handleActivityDislike = () => {
    setSelectedVideo(null);
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

  if (selectedVideo) {
    return (
      <div className="absolute inset-0 bg-black flex flex-col">
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent z-10">
          <button
            onClick={() => setSelectedVideo(null)}
            className="p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-white font-medium">{selectedVideo.activity}</h2>
          <div className="w-10"></div>
        </div>

        <div className="flex-1 relative">
          <video
            src={selectedVideo.video.video_files?.[0].link}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-center space-x-8">
            <button
              onClick={handleActivityDislike}
              className="p-4 bg-white/50 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
            >
              <X size={32} className="text-white" />
            </button>
            <button
              onClick={() => handleActivityLike(selectedVideo.activity)}
              className="p-4 bg-white/50 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
            >
              <Heart size={32} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    );
  }

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
      <div className="relative h-1/3 w-full">
        {destinationImage && (
          <img
            src={destinationImage}
            alt={recommendation.destination}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="p-6 w-full">
            <h2 className="text-4xl font-bold text-white">{recommendation.destination}</h2>
          </div>
        </div>
      </div>

      {/* Activities Section */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="grid grid-cols-2 gap-4">
          {recommendation.activities.map((activity, index) => (
            <div key={index} className="aspect-square">
              {activityVideos[activity]?.[0] && (
                <button
                  onClick={() => setSelectedVideo({ activity, video: activityVideos[activity][0] })}
                  className="w-full h-full rounded-full overflow-hidden relative group"
                >
                  <video
                    src={activityVideos[activity][0].video_files?.[0].link}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <ChevronRight size={24} className="text-white" />
                    </div>
                  </div>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Next Button */}
      <div className="p-4 w-full">
        <button
          onClick={onNext}
          className="w-full bg-blue-600 text-white py-4 rounded-full font-semibold text-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          Continue Planning
        </button>
      </div>
    </div>
  );
} 