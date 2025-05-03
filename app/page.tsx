'use client'

import { useState, useEffect } from "react";
import { MobileMockup } from "@/components/mobile-mockup";
import { HomeScreen } from "@/components/screens/home";
import { TravelScreen } from "@/components/screens/travel";
import { PaletteSelector } from "@/components/screens/palette-selector";
import { WelcomeScreen } from "@/components/screens/welcome";
import { AuthPage, User } from "@/components/screens/auth-page";

const screens = [
  WelcomeScreen, 
  AuthPage,
  HomeScreen,
  TravelScreen,
  // Add more screens here as needed
];

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'sign-in' | 'home' | 'travel' | 'palette-selector'>('welcome');
  const [selectedPalette, setSelectedPalette] = useState('Sunset');
  const [isMobile, setIsMobile] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePaletteSelect = (palette: string) => {
    setSelectedPalette(palette);
    setCurrentScreen('home');
  };

  const handleBack = () => {
    switch (currentScreen) {
      case 'travel':
        setCurrentScreen('home');
        break;
      case 'palette-selector':
        setCurrentScreen('home');
        break;
      default:
        break;
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return (
          <WelcomeScreen 
            onNext={() => setCurrentScreen('sign-in')}
            selectedPalette={selectedPalette}
            selectedImages={selectedImages}
            setSelectedImages={setSelectedImages}
            selectedAlbum={selectedAlbum}
            setSelectedAlbum={setSelectedAlbum}
          />
        );
      case 'sign-in':
        return <AuthPage onLoginSuccess={(user) => { setUser(user); setCurrentScreen('home'); }} />;
      case 'home':
        return (
          <HomeScreen
            user={user}
            onNext={() => setCurrentScreen('travel')}
            onPaletteSelect={() => setCurrentScreen('palette-selector')}
            selectedPalette={selectedPalette}
            selectedImages={selectedImages}
            setSelectedImages={setSelectedImages}
            selectedAlbum={selectedAlbum}
            setSelectedAlbum={setSelectedAlbum}
          />
        );
      case 'travel':
        return (
          <TravelScreen
            onNext={() => setCurrentScreen('home')}
            onBack={handleBack}
          />
        );
      case 'palette-selector':
        return (
          <PaletteSelector
            onBack={handleBack}
            onSelect={handlePaletteSelect}
            selectedPalette={selectedPalette}
          />
        );
      default:
        return null;
    }
  };

  return (
    <main
      className={`flex h-screen flex-col items-center justify-center ${isMobile ? '' : 'p-12 bg-gray-100'}`}
    >
      {isMobile ? (
        <div className="w-full h-full">
          {renderScreen()}
        </div>
      ) : (
        <MobileMockup>
          {renderScreen()}
        </MobileMockup>
      )}
    </main>
  );
}
