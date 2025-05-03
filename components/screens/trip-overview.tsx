'use client'
import { HeroHighlight, Highlight } from "../ui/hero-highlight";
import type { User } from './auth-page';
import { ArrowLeft, Bell, Calendar, MapPin, Users, Clock, ChevronRight, Music } from "lucide-react"
import React, { useState, useRef, useEffect } from "react";
import { Image } from "lucide-react";
import { motion} from "framer-motion";
import { Header } from '../header';


interface TripOverviewProps {
  group: { id: string; name: string; code: string } | null;
  user: User | null;
  onBack: () => void;
  onSignOut: () => void;
}

export function TripOverview({ group, user, onBack, onSignOut }: TripOverviewProps) {
  const [showTitle, setShowTitle] = useState(true);

  return (
    <div className='h-[400rem] overflow-scroll bg-blue-100/40 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pt-4'>

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
            className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
          >
            You're all set for your trip to... <br />
            <Highlight className="text-black dark:text-white mt-2">
              Lisboa, Portugal
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
      
            <div className="pt-0 py-6">
        <Header
          user={user}
          onBack={onBack}
          onSignOut={onSignOut}
        />

            <TripSummary destination={tripData.destination} dates={tripData.dates} travelers={tripData.travelers} />
            <div className="p-4 m-4">
              <h2 className="text-xl font-bold mb-4">Your Trip Vibes</h2>
              <div className="py-4 w-full">
                <TravelVibesSection />
              </div>

            </div>
            <ItinerarySection itinerary={tripData.itinerary} />
            
            <div className="px-4 ">
              <button onClick={onBack} className="bottom-4 w-3/4 bg-blue-500 hover:bg-blue-600 text-white rounded-full py-4 font-medium">
                Save this trip
              </button>
            </div>

          </div>
        </motion.div>
      )}
    </div>
  );
}


function TripSummary({ destination, dates, travelers }) {
  return (
    <div className="mt-6 mb-8">
      <h1 className="text-3xl font-bold mb-2">
        Your trip to <span className="text-blue-500">{destination}</span>
      </h1>
      <p className="text-gray-500 mb-4">You're all set for an amazing adventure!</p>

      <div className="bg-white rounded-2xl m-4 p-4 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Calendar className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-left text-gray-500">Trip dates</p>
            <p className="font-medium">{dates}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-500 text-lg">€</span>
            </div>
            <div>
            <p className="text-sm text-left text-gray-500">Cost</p>
            <p className="font-medium">300€</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Users className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Travelers</p>
            <p className="font-medium">{travelers} friends</p>
          </div>
        </div>
      </div>
    </div>
  )
}


function ItinerarySection({ itinerary }) {
  return (
    <div className="mb-8 p-4 m-4">
      <h2 className="text-xl font-bold mb-4">Your Itinerary</h2>

      <div className="space-y-4">
        {itinerary.map((day, index) => (
          <DayCard key={index} day={day} />
        ))}
      </div>
    </div>
  )
}

function DayCard({ day }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm "
    >
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div className='flex flex-start flex-col'>
            <span className="text-sm text-left text-blue-500 font-medium">{day.day}</span>
            <h3 className="text-lg font-bold">{day.title}</h3>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-4">
          {day.activities.slice(0, 2).map((activity, actIndex) => (
            <div key={actIndex} className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg">
                {activity.emoji}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  <Clock className="h-3 w-3 text-blue-500" />
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
                <p className="text-sm">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}


 const tripData = {
    destination: "Lisbon",
    dates: "June 15-20, 2025",
    travelers: 4,
    itinerary: [
      {
        day: "Day 1",
        title: "Explore Alfama",
        activities: [
          { time: "09:00 - 11:00", description: "São Jorge Castle tour", emoji: "🏰" },
          { time: "12:00 - 14:00", description: "Lunch at Time Out Market", emoji: "🍽️" },
          { time: "15:00 - 17:00", description: "Alfama walking tour", emoji: "🚶" },
          { time: "19:00 - 21:00", description: "Fado dinner experience", emoji: "🎵" },
        ],
      },
      {
        day: "Day 2",
        title: "Belém District",
        activities: [
          { time: "10:00 - 12:00", description: "Jerónimos Monastery", emoji: "⛪" },
          { time: "12:30 - 13:30", description: "Pastéis de Belém tasting", emoji: "🍮" },
          { time: "14:00 - 16:00", description: "Belém Tower & Monument", emoji: "🗼" },
          { time: "17:00 - 19:00", description: "Sunset sailing on the Tagus", emoji: "⛵" },
        ],
      },
      {
        day: "Day 3",
        title: "Day Trip to Sintra",
        activities: [
          { time: "09:00 - 10:30", description: "Train to Sintra", emoji: "🚂" },
          { time: "11:00 - 13:00", description: "Pena Palace tour", emoji: "🏯" },
          { time: "14:00 - 15:30", description: "Quinta da Regaleira", emoji: "🌳" },
          { time: "16:00 - 17:30", description: "Moorish Castle", emoji: "🏔️" },
          { time: "19:00 - 21:00", description: "Group dinner in Sintra", emoji: "🍷" },
        ],
      },
      {
        day: "Day 4",
        title: "Modern Lisbon",
        activities: [
          { time: "10:00 - 12:00", description: "LX Factory exploration", emoji: "🎨" },
          { time: "13:00 - 14:30", description: "Lunch at riverside restaurant", emoji: "🦞" },
          { time: "15:00 - 17:00", description: "Oceanário de Lisboa", emoji: "🐠" },
          { time: "18:00 - 20:00", description: "Sunset at Parque Eduardo VII", emoji: "🌅" },
        ],
      },
      {
        day: "Day 5",
        title: "Beach Day",
        activities: [
          { time: "09:30 - 10:30", description: "Travel to Cascais", emoji: "🚌" },
          { time: "11:00 - 15:00", description: "Beach time at Praia do Guincho", emoji: "🏖️" },
          { time: "15:30 - 17:00", description: "Coastal walk to Boca do Inferno", emoji: "🌊" },
          { time: "18:00 - 21:00", description: "Seafood dinner in Cascais", emoji: "🦐" },
        ],
      },
    ],
  }


  function TravelVibesSection() {
    return (
      <div>
          <div className="grid grid-cols-12 gap-4">
            {/* Top left - large image */}
            <div className="col-span-7">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
              <img
              src="https://images.unsplash.com/photo-1746202382547-ecc40a122aed?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Aerial view of forest road"
              className="object-cover w-full h-full"
              />
            </div>
            </div>

            {/* Top right - medium image */}
            <div className="col-span-5">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md">
              <img
              src="https://images.unsplash.com/photo-1746202382547-ecc40a122aed?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Misty forest"
              className="object-cover w-full h-full"
              />
            </div>
            </div>

            {/* Bottom left - small image */}
            <div className="col-span-5">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
              <img
              src="https://images.unsplash.com/photo-1746202382547-ecc40a122aed?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Cottage with garden"
              className="object-cover w-full h-full"
              />
            </div>
            </div>

            {/* Bottom right - wide image */}
            <div className="col-span-7">
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-md">
              <img
              src="https://images.unsplash.com/photo-1746202382547-ecc40a122aed?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Mountain valley with river"
              className="object-cover w-full h-full"
              />
            </div>
            </div>
          </div>
      </div>
    )
  }