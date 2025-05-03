'use client'

import { useState } from "react";
import { MobileMockup } from "@/components/mobile-mockup";
import { SignInScreen } from "@/components/screens/sign-in";
import { HomeScreen } from "@/components/screens/home";
import { TravelScreen } from "@/components/screens/travel";
import { PaletteSelector } from "@/components/screens/palette-selector";

const screens = [
  SignInScreen,
  HomeScreen,
  TravelScreen,
  // Add more screens here as needed
];

export default function Home() {
  const [screenIndex, setScreenIndex] = useState(0);
  const [showPaletteSelector, setShowPaletteSelector] = useState(false);
  const [selectedPalette, setSelectedPalette] = useState('Sunset');
  const ScreenComponent = screens[screenIndex];

  const handleNext = () => {
    if (screenIndex < screens.length - 1) {
      setScreenIndex(screenIndex + 1);
    }
  };

  const handlePaletteSelect = (palette: string) => {
    setSelectedPalette(palette);
    setShowPaletteSelector(false);
  };

  if (showPaletteSelector) {
    return (
      <main className="flex h-screen flex-col items-center justify-center p-12 bg-gray-100">
        <MobileMockup>
          <PaletteSelector
            onBack={() => setShowPaletteSelector(false)}
            onSelect={handlePaletteSelect}
            selectedPalette={selectedPalette}
          />
        </MobileMockup>
      </main>
    );
  }

  return (
    <main className="flex h-screen flex-col items-center justify-center p-12 bg-gray-100">
      <MobileMockup>
        {screenIndex === 1 ? (
          <HomeScreen 
            onNext={handleNext} 
            onPaletteSelect={() => setShowPaletteSelector(true)}
            selectedPalette={selectedPalette}
          />
        ) : (
          <ScreenComponent onNext={handleNext} />
        )}
      </MobileMockup>
    </main>
  );
}
