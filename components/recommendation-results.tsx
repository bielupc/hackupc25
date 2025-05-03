"use client"

import { useEffect, useState } from "react"
import { ExternalLink, MapPin, Music } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface RecommendationResultsProps {
  image: string | null
  playlist: string | null
  colors: string[]
}

// Mock data for destinations
const DESTINATIONS = [
  {
    id: "1",
    name: "Santorini, Greece",
    description: "White-washed buildings with blue domes overlooking the Aegean Sea.",
    image: "/placeholder.svg?height=200&width=300",
    match: 98,
  },
  {
    id: "2",
    name: "Kyoto, Japan",
    description: "Ancient temples, traditional gardens and cherry blossoms.",
    image: "/placeholder.svg?height=200&width=300",
    match: 92,
  },
  {
    id: "3",
    name: "Marrakech, Morocco",
    description: "Vibrant markets, intricate architecture and rich cultural heritage.",
    image: "/placeholder.svg?height=200&width=300",
    match: 87,
  },
]

export default function RecommendationResults({ image, playlist, colors }: RecommendationResultsProps) {
  const [loading, setLoading] = useState(true)
  const [destinations, setDestinations] = useState<typeof DESTINATIONS>([])

  // Simulate API call to get recommendations
  useEffect(() => {
    const timer = setTimeout(() => {
      setDestinations(DESTINATIONS)
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [image, playlist, colors])

  return (
    <div className="space-y-6">
      {loading
        ? // Loading state
          Array(3)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-40 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))
        : // Results
          destinations.map((destination) => (
            <Card key={destination.id} className="overflow-hidden">
              <div className="relative">
                <img
                  src={destination.image || "/placeholder.svg"}
                  alt={destination.name}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-full">
                  {destination.match}% match
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-lg flex items-center">
                      <MapPin className="h-4 w-4 mr-1 inline-flex" />
                      {destination.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{destination.description}</p>
                  </div>
                </div>

                <div className="flex mt-4 gap-2">
                  <Button size="sm" className="rounded-full">
                    Explore
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-full">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

      {!loading && (
        <div className="pt-4 border-t">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <Music className="h-4 w-4 mr-1" />
            <span>Recommended playlist for your trip</span>
          </div>
          <Card className="p-3 flex items-center">
            <img src="/placeholder.svg?height=50&width=50" alt="Playlist cover" className="w-12 h-12 rounded mr-3" />
            <div className="flex-1">
              <h4 className="text-sm font-medium">Travel Vibes: Mediterranean</h4>
              <p className="text-xs text-gray-500">Based on your selections</p>
            </div>
            <Button variant="ghost" size="sm" className="rounded-full">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Card>
        </div>
      )}
    </div>
  )
}
