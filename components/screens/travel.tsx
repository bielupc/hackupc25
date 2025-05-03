import React, { useEffect, useState } from 'react';
import { ChevronRight, ChevronLeft, Bookmark, MapPin, Heart, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Header } from '../header';
import type { User } from './auth-page';

interface TravelScreenProps {
  onNext: () => void;
  onBack?: () => void;
  onSignOut: () => void;
  user: User | null;
  group: { id: string; name: string; code: string } | null;
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

export function TravelScreen({ onNext, onBack, user, group, onSignOut }: TravelScreenProps) {
  const [recommendation, setRecommendation] = useState<TravelRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [destinationImage, setDestinationImage] = useState<string>('');
  const [activityVideos, setActivityVideos] = useState<{ [key: string]: PexelsMedia[] }>({});
  const [selectedVideo, setSelectedVideo] = useState<{ activity: string; video: PexelsMedia } | null>(null);
  const [likedActivities, setLikedActivities] = useState<string[]>([]);
  const [lastSelected, setLastSelected] = useState<{ activity: string; video: PexelsMedia } | null>(null);
  const [activityFeedback, setActivityFeedback] = useState<{ [activity: string]: 'like' | 'dislike' }>({});

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!group?.id) return;
      
      // Fetch the group with its recommendations
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .select('recommendations')
        .eq('id', group.id)
        .single();

      if (groupError || !groupData?.recommendations) {
        console.error('Error fetching group recommendations:', groupError);
        return;
      }

      // Set the recommendations from the group record
      setRecommendation(groupData.recommendations);
      fetchDestinationImage(groupData.recommendations.destination);
      fetchActivityVideos(groupData.recommendations.activities);
    };

    fetchRecommendations();
    setLoading(false);
  }, [group?.id]);

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

  const handleActivityLike = async (activity: string) => {
    setLikedActivities(prev => [...prev, activity]);
    if (selectedVideo) setLastSelected(selectedVideo);
    setActivityFeedback(prev => ({ ...prev, [activity]: 'like' }));
    setSelectedVideo(null);

    // Save activity preference
    if (user?.id && group?.id) {
      await supabase.from('group_activities').upsert({
        user_id: user.id,
        group_id: group.id,
        liked_activities: [...likedActivities, activity],
        disliked_activities: Object.entries(activityFeedback)
          .filter(([_, feedback]) => feedback === 'dislike')
          .map(([activity]) => activity)
      });

      // Check if all members have submitted activity preferences
      const { data: groupMembers } = await supabase
        .from('user_groups')
        .select('user_id')
        .eq('group_id', group.id);

      const { data: submittedActivities } = await supabase
        .from('group_activities')
        .select('user_id')
        .eq('group_id', group.id);

      if (groupMembers && submittedActivities && 
          groupMembers.length === submittedActivities.length) {
        // All members have submitted, update group state
        await supabase
          .from('groups')
          .update({ state: 'final' })
          .eq('id', group.id);
      }
    }
  };

  const handleActivityDislike = async () => {
    if (selectedVideo) {
      setLastSelected(selectedVideo);
      setActivityFeedback(prev => ({ ...prev, [selectedVideo.activity]: 'dislike' }));
      setSelectedVideo(null);

      // Save activity preference
      if (user?.id && group?.id) {
        await supabase.from('group_activities').upsert({
          user_id: user.id,
          group_id: group.id,
          liked_activities: likedActivities,
          disliked_activities: [...Object.entries(activityFeedback)
            .filter(([_, feedback]) => feedback === 'dislike')
            .map(([activity]) => activity), selectedVideo.activity]
        });

        // Check if all members have submitted activity preferences
        const { data: groupMembers } = await supabase
          .from('user_groups')
          .select('user_id')
          .eq('group_id', group.id);

        const { data: submittedActivities } = await supabase
          .from('group_activities')
          .select('user_id')
          .eq('group_id', group.id);

        if (groupMembers && submittedActivities && 
            groupMembers.length === submittedActivities.length) {
          // All members have submitted, update group state
          await supabase
            .from('groups')
            .update({ state: 'final' })
            .eq('id', group.id);
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-gradient-to-b from-blue-100 via-white to-white text-gray-900 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Loading recommendations...</p>
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="flex flex-col h-full bg-gradient-to-b from-blue-100 via-white to-white text-gray-900 items-center justify-center p-6">
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
          <div className="w-10"></div>
        </div>

        <div className="absolute top-[5rem] left-0 right-0 px-8 z-50">
          <div className="bg-black/10 backdrop-blur-sm rounded-lg p-4">
            <h2 className="text-white text-center text-2xl font-medium">{selectedVideo.activity}</h2>
          </div>
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
    <div className="flex flex-col h-full bg-gradient-to-b from-blue-100 via-white to-white text-gray-900 overflow-hidden pt-5">
      <Header user={user} onBack={onBack} onSignOut={onSignOut} />
      {/* Hero Image Card */}
      <div className="flex justify-center items-center px-4 pt-4 mb-4">
        <div className="w-full rounded-2xl shadow-lg overflow-hidden bg-white" style={{ maxWidth: 480 }}>
          <div className="relative h-56 w-full">
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
        </div>
      </div>

      {/* Activities Section */}
      <div className="flex-1 overflow-y-auto px-4 py-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="grid grid-cols-2 gap-4 ">
          {recommendation.activities.map((activity, index) => {
            // If this activity was last selected, show its video as selected
            const isSelected = lastSelected && lastSelected.activity === activity;
            const video = isSelected ? lastSelected.video : activityVideos[activity]?.[0];
            const feedback = activityFeedback[activity];
            return (
              <div key={index} className="aspect-square">
                {video && (
                  <button
                    onClick={() => setSelectedVideo({ activity, video })}
                    className={`w-full h-full rounded-xl overflow-hidden relative group border-4 ${isSelected ? 'border-blue-500' : 'border-transparent'}`}
                  >
                    <video
                      src={video.video_files?.[0].link}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
  <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
    {feedback === 'like' ? (
      <Heart size={28} className="text-white" fill="#FFFFFF" />
    ) : feedback === 'dislike' ? (
      <X size={28} className="text-white" />
    ) : (
      <ChevronRight size={24} className="text-white" />
    )}
  </div>
</div>
                  </button>
                )}
              </div>
            );
          })}
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