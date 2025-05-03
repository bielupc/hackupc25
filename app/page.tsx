'use client'

import { useState, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(false);
  const ScreenComponent = screens[screenIndex];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNext = () => {
    if (screenIndex < screens.length - 1) {
      setScreenIndex(screenIndex + 1);
    }
  };

  const handlePaletteSelect = (palette: string) => {
    setSelectedPalette(palette);
    setShowPaletteSelector(false);
  };

  const renderContent = () => {
    if (showPaletteSelector) {
      return (
        <PaletteSelector
          onBack={() => setShowPaletteSelector(false)}
          onSelect={handlePaletteSelect}
          selectedPalette={selectedPalette}
        />
      );
    }

    if (screenIndex === 1) {
      return (
        <HomeScreen 
          onNext={handleNext} 
          onPaletteSelect={() => setShowPaletteSelector(true)}
          selectedPalette={selectedPalette}
        />
      );
    }

    return <ScreenComponent onNext={handleNext} />;
  };

  return (
    <main
      className={`flex h-screen flex-col items-center justify-center ${isMobile ? '' : 'p-12 bg-gray-100'}`}
    >
      {isMobile ? (
        <div className="w-full h-full">
          {renderContent()}
        </div>
      ) : (
        <MobileMockup>
          {renderContent()}
        </MobileMockup>
      )}
    </main>
  );
}
