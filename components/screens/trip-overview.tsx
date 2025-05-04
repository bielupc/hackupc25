'use client'
import { HeroHighlight, Highlight } from "../ui/hero-highlight";
import type { User } from './auth-page';
import { ArrowLeft, Bell, Calendar, MapPin, Users, Clock, ChevronRight, Music } from "lucide-react"
import React, { useState, useRef, useEffect } from "react";
import { Image } from "lucide-react";
import { motion} from "framer-motion";
import { Header } from '../header';
import { supabase } from "@/lib/supabase";
import type { TravelRecommendation, TravelActivity } from "./travel";
const emoji = require("node-emoji");


interface TripOverviewProps {
  group: { id: string; name: string; code: string } | null;
  user: User | null;
  onBack: () => void;
  onSignOut: () => void;
}



export function TripOverview({ group, user, onBack, onSignOut }: TripOverviewProps) {
  const [showTitle, setShowTitle] = useState(true);
  const [recommendation, setRecommendation] = useState<TravelRecommendation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!group?.id) return;
      try {
        const { data: groupData, error: groupError } = await supabase
          .from('groups')
          .select('recommendations')
          .eq('id', group.id)
          .single();

        if (groupError || !groupData?.recommendations) {
          console.error('Error fetching group recommendations:', groupError);
          setLoading(false);
          return;
        }

        setRecommendation(groupData.recommendations);
        console.log('Fetched recommendations:', groupData);
      } catch (error) {
        console.error('Error in fetchRecommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [group?.id]);


  if (loading) {
    return (
      <div className="flex flex-col h-full bg-gradient-to-b from-blue-100 via-white to-white text-gray-900 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Loading overview...</p>
      </div>
    );
  }

  return (
    <div className='h-screen w-full overflow-y-auto bg-blue-100/40 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pt-2 sm:pt-4 pb-20'>

      {showTitle ? (
        <HeroHighlight>
          <motion.h1
            initial={{
              opacity: 0,
              y: 100,
              scale: 0.5,
              rotate: -15,
            }}
            animate={{
              opacity: 1,
              y: [100, -20, 10, 0],
              scale: [0.5, 1.2, 0.9, 1],
              rotate: [-15, 10, -5, 0],
            }}
            transition={{
              duration: 1.2,
              ease: [0.42, 0, 0.58, 1],
            }}
            exit={{
              opacity: 0,
              transition: { duration: 1 },
            }}
            onAnimationComplete={() => setTimeout(() => setShowTitle(false), 3000)}
            className="text-xl px-2 sm:px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
          >
            You're all set for your trip to... <br />
            <Highlight className="text-black dark:text-white mt-2">
              {recommendation?.destination}
            </Highlight>
          </motion.h1>
        </HeroHighlight>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0, duration: 0.5 }}
          className="mt-8 text-center h-full"
        >
      
            <div className="pt-0 py-4 sm:py-6">
        <Header
          user={user}
          onBack={onBack}
          onSignOut={onSignOut}
        />

            <TripSummary groupId={group.id} userId={user.id} recommendation={recommendation} />

            <ItinerarySection recommendations={recommendation} />
            <div className="p-2 sm:p-4 m-2 sm:m-4">
              <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">Your Trip Vibes</h2>
              <div className="py-2 sm:py-4 w-full">
                <TravelVibesSection groupId={group.id} />
              </div>
            </div>
            
            <div className="px-2 sm:px-4">
              <button onClick={onBack} className="bottom-4 w-full sm:w-3/4 bg-blue-500 hover:bg-blue-600 text-white rounded-full py-3 sm:py-4 font-medium">
                Save this trip
              </button>
            </div>

          </div>
        </motion.div>
      )}
    </div>
  );
}


function TripSummary({userId, groupId, recommendation }) {

  const [costAnada, setCostAnada] = useState(null);
  const [costTornada, setCostTornada] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const fetchInfo = async () => {
  const { data, error } = await supabase
    .from('user_groups')
    .select(`
      cost_anada,
      cost_tornada,
      groups (
        trip_start_date,
        trip_end_date
      )
    `)
    .eq('user_id', userId)
    .eq('group_id', groupId)
    .single();
  if (error) {
    console.error('Error fetching trip info:', error);
    return;
  }


      console.log('Cost data:', data);
  
      if (data) {
        setCostAnada(data.cost_anada);
        setCostTornada(data.cost_tornada);
        setStartDate(data.groups.trip_start_date);
        setEndDate(data.groups.trip_end_date);
      }
    };
  
    fetchInfo();
  }, [groupId]);


  return (
    <div className="mt-4 sm:mt-6 mb-4 sm:mb-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 px-2 sm:px-4">
        Your trip to <span className="text-blue-500">{recommendation.destination}</span>
      </h1>
      <p className="text-sm sm:text-base text-gray-500 mb-2 sm:mb-4 px-2 sm:px-4">You're all set for an amazing adventure!</p>

      <div className="bg-white rounded-2xl m-2 sm:m-4 p-3 sm:p-4 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Calendar className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-xs sm:text-sm text-left text-gray-500">Trip dates</p>
            <p className="text-sm sm:text-base font-medium">{`${startDate ? startDate.split('T')[0] : ""} | ${endDate ? endDate.split("T")[0] : ""}`}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-500 text-lg">€</span>
            </div>
            <div>
            <p className="text-xs sm:text-sm text-left text-gray-500">Cost</p>
            <p className="text-sm sm:text-base font-medium">🛫{costAnada ?? (400 + Math.random() * 200).toFixed(2)}€ | 🛬{costTornada ?? (400 + Math.random() * 200).toFixed(2)}€ </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Users className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-500">Travelers</p>
            <p className="text-sm sm:text-base font-medium">2 friends</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ItinerarySection({ recommendations }: { recommendations: TravelRecommendation | null }) {
  // Function to format the time
  const formatTime = (timeString) => {
    const date = new Date(timeString)
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
  }

  // Function to get category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case "performing-arts":
        return "🎭"
      case "concerts":
        return "🎵"
      case "conferences":
        return "🎤"
      default:
        return "🎪"
    }
  }

  if (!recommendations) return null;
  
  return (
    <div className="mb-4 sm:mb-8">
      <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 px-2 sm:px-4">Local Activities</h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl overflow-hidden shadow-sm mx-2 sm:mx-4 py-2"
      >
        <div className="py-3 sm:py-4 px-3 sm:px-5">
          <div className="space-y-3 sm:space-y-4">
            {recommendations.activities.map((activity, index) => (
              <React.Fragment key={index}>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg">
                    {getCategoryIcon(activity.category)}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <p className="text-sm sm:text-base font-medium text-left">{activity.title}</p>
                      {activity.start_local && (
                        <span className="text-[10px] sm:text-xs text-blue-500 bg-blue-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full w-fit">
                          {activity.start_local.split("T")[0]} <br/> {formatTime(activity.start_local)}
                        </span>
                      )}
                    </div>
                    {activity.description && (
                        <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2 text-left">
                        {activity.description.replace(/Sourced from predicthq\.com( - )?/i, "").trim()}
                        </p>
                    )}
                    {activity.phq_attendance && (
                      <div className="flex items-center gap-1 mt-1">
                        <Users className="h-3 w-3 text-gray-400" />
                        <span className="text-[10px] sm:text-xs text-gray-400">{activity.phq_attendance} attendees</span>
                      </div>
                    )}
                  </div>
                </div>
                {index < recommendations.activities.length - 1 && <hr className="border-t border-gray-100" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function TravelVibesSection({ groupId }: { groupId: string }) {
  const [submittedPreferences, setSubmittedPreferences] = useState<any>(null);

  useEffect(() => {
    const fetchPreferences = async () => {
      const { data, error } = await supabase
        .from('group_preferences')
        .select('user_id, selected_images, selected_songs, palette')
        .eq('group_id', groupId);

      if (error) {
        console.error('Error fetching preferences:', error);
        return;
      }

      console.log('Submitted preferences:', data);
      setSubmittedPreferences(data);
    };

    fetchPreferences();
  }, [groupId]);

  if (!submittedPreferences) {
    return <p>Loading images...</p>;
  }

      return (
      <div>
        <div className="grid grid-cols-12 gap-4">
          {/* Top left - large image */}
          <div className="col-span-7">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
              <img
                src={submittedPreferences[0]?.selected_images[0]}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* Top right - medium image */}
          <div className="col-span-5">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md">
              <img
                src={submittedPreferences[1]?.selected_images[0]}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* Bottom left - small image */}
          <div className="col-span-5">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
              <img
                src={submittedPreferences[2]?.selected_images[0]}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* Bottom right - wide image */}
          <div className="col-span-7">
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-md">
              <img
                src={submittedPreferences[3]?.selected_images[0]}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    );
}
