"use client"

import { useState } from "react"
import { Camera, Music, Palette, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CameraCapture from "@/components/camera-capture"
import SpotifySelector from "@/components/spotify-selector"
import ColorPaletteSelector from "@/components/color-palette-selector"
import RecommendationResults from "@/components/recommendation-results"

export default function Home() {
  const [activeTab, setActiveTab] = useState("camera")
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null)
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)

  const handleNextStep = () => {
    if (activeTab === "camera" && capturedImage) {
      setActiveTab("music")
    } else if (activeTab === "music" && selectedPlaylist) {
      setActiveTab("palette")
    } else if (activeTab === "palette" && selectedColors.length > 0) {
      setShowResults(true)
    }
  }

  const resetFlow = () => {
    setCapturedImage(null)
    setSelectedPlaylist(null)
    setSelectedColors([])
    setShowResults(false)
    setActiveTab("camera")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 bg-white">
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-2xl font-light text-center mb-8 mt-8">wanderlust</h1>

        {!showResults ? (
          <>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="camera" disabled={showResults}>
                  <Camera className="h-4 w-4 mr-2" />
                  <span className="sr-only sm:not-sr-only sm:text-xs">Luggage</span>
                </TabsTrigger>
                <TabsTrigger value="music" disabled={!capturedImage || showResults}>
                  <Music className="h-4 w-4 mr-2" />
                  <span className="sr-only sm:not-sr-only sm:text-xs">Music</span>
                </TabsTrigger>
                <TabsTrigger value="palette" disabled={!selectedPlaylist || showResults}>
                  <Palette className="h-4 w-4 mr-2" />
                  <span className="sr-only sm:not-sr-only sm:text-xs">Colors</span>
                </TabsTrigger>
              </TabsList>

              <Card className="border-none shadow-sm">
                <CardContent className="p-0">
                  <TabsContent value="camera" className="mt-0">
                    <CameraCapture onCapture={setCapturedImage} capturedImage={capturedImage} />
                  </TabsContent>
                  <TabsContent value="music" className="mt-0">
                    <SpotifySelector onSelect={setSelectedPlaylist} selectedPlaylist={selectedPlaylist} />
                  </TabsContent>
                  <TabsContent value="palette" className="mt-0">
                    <ColorPaletteSelector onSelect={setSelectedColors} selectedColors={selectedColors} />
                  </TabsContent>
                </CardContent>
              </Card>
            </Tabs>

            <div className="flex justify-end mt-6">
              <Button
                onClick={handleNextStep}
                disabled={
                  (activeTab === "camera" && !capturedImage) ||
                  (activeTab === "music" && !selectedPlaylist) ||
                  (activeTab === "palette" && selectedColors.length === 0)
                }
                className="rounded-full"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-light">Your Travel Matches</h2>
              <Button variant="ghost" size="sm" onClick={resetFlow}>
                Start Over
              </Button>
            </div>
            <RecommendationResults image={capturedImage} playlist={selectedPlaylist} colors={selectedColors} />
          </>
        )}
      </div>
    </main>
  )
}
