'use client'

import { useState, useEffect } from "react";
import { MobileMockup } from "@/components/mobile-mockup";
import { HomeScreen } from "@/components/screens/home";
import { TravelScreen } from "@/components/screens/travel";
import { PaletteSelector } from "@/components/screens/palette-selector";
import { WelcomeScreen } from "@/components/screens/welcome";
import { AuthPage, User } from "@/components/screens/auth-page";
import { SongSelector} from "@/components/screens/songs-selector";
import { TripOverview } from "@/components/screens/trip-overview";
import type { Song } from "@/components/search-song";
import { GroupsScreen } from "@/components/screens/groups";
import { supabase } from "@/lib/supabase";

const screens = [
  WelcomeScreen, 
  AuthPage,
  HomeScreen,
  TravelScreen,
  // Add more screens here as needed
];

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'sign-in' | 'groups' | 'home' | 'travel' | 'palette-selector' | 'song-selector' | 'trip-overview'>('trip-overview');
  const [selectedPalette, setSelectedPalette] = useState('Sunset');
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [group, setGroup] = useState<{ id: string; name: string; code: string } | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load preferences when user or group changes
  useEffect(() => {
    const loadPreferences = async () => {
      if (!user?.id || !group?.id) return;
      const { data } = await supabase
        .from('group_preferences')
        .select('*')
        .eq('user_id', user.id)
        .eq('group_id', group.id)
        .single();
      if (data) {
        if (data.palette) setSelectedPalette(data.palette);
        if (data.selected_images) setSelectedImages(data.selected_images);
        if (data.selected_songs) setSelectedSongs(data.selected_songs);
      } else {
        setSelectedPalette('Sunset');
        setSelectedImages([]);
        setSelectedSongs([]);
      }
    };
    loadPreferences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, group?.id]);

  const handlePaletteSelect = (palette: string) => {
    setSelectedPalette(palette);
    setCurrentScreen('home');
  };

  const handleSongSelect = (song: Song) => {
    setSelectedSongs((prev) => [...prev, song]);
    setCurrentScreen('home');
  };

  const handleBack = () => {
    switch (currentScreen) {
      case 'travel':
        setCurrentScreen('groups');
        break;
      case 'palette-selector':
        setCurrentScreen('home');
        break;
      case 'song-selector':
        setCurrentScreen('home');
        break;
      case 'home':
        setCurrentScreen('groups');
        break;
      default:
        break;
    }
  };

  const handleSignOut = () => {
    setUser(null);
    setGroup(null);
    setCurrentScreen('welcome');
  };

  const handleLoginSuccess = (user: User) => {
    setUser(user);
    setCurrentScreen('groups');
  };

  const handleGroupSelected = async (group: { id: string; name: string; code: string }) => {
    setGroup(group);
    if (user?.id && group?.id) {
      const { data } = await supabase
        .from('group_preferences')
        .select('*')
        .eq('user_id', user.id)
        .eq('group_id', group.id)
        .single();
      if (data) {
        if (data.palette) setSelectedPalette(data.palette);
        if (data.selected_images) setSelectedImages(data.selected_images);
        if (data.selected_songs) setSelectedSongs(data.selected_songs);
      } else {
        setSelectedPalette('Sunset');
        setSelectedImages([]);
        setSelectedSongs([]);
      }
    }
    setCurrentScreen('home');
  };

  const handleGoToActivities = (group: { id: string; name: string; code: string }) => {
    setGroup(group);
    setCurrentScreen('travel');
  };

  const handleGoToTripOverview = (group: { id: string; name: string; code: string }) => {
    setGroup(group);
    setCurrentScreen('trip-overview');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return (
          <WelcomeScreen 
            onNext={() => setCurrentScreen('sign-in')}
          />
        );
      case 'sign-in':
        return <AuthPage onLoginSuccess={handleLoginSuccess} onBack={() => setCurrentScreen('welcome')} />;
      case 'groups':
        return user ? (
          <GroupsScreen
            user={user}
            onGroupSelected={handleGroupSelected}
            onGoToActivities={handleGoToActivities}
            onGoToTripOverview={handleGoToTripOverview}
            onBack={() => setCurrentScreen('sign-in')}
            onSignOut={handleSignOut}
          />
        ) : null;
      case 'home':
        return (
          <HomeScreen
            user={user}
            group={group}
            onBack={handleBack}
            onSignOut={handleSignOut}
            onNext={() => setCurrentScreen('groups')}
            onPaletteSelect={() => setCurrentScreen('palette-selector')}
            selectedPalette={selectedPalette}
            setSelectedPalette={setSelectedPalette}
            onSongSelect={() => setCurrentScreen('song-selector')}
            selectedSongs={selectedSongs}
            setSelectedSongs={setSelectedSongs}
            selectedImages={selectedImages}
            setSelectedImages={setSelectedImages}
          />
        );
      case 'travel':
        return (
          <TravelScreen
            onNext={() => setCurrentScreen('groups')}
            onBack={handleBack}
            onSignOut={handleSignOut}
            user={user}
            group={group}
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
      case 'song-selector':
        return (
          <SongSelector
            onBack={handleBack}
            onSelect={handleSongSelect}
            selectedSongs={selectedSongs}
          />
        );
      case 'trip-overview':
        return (
          <TripOverview
            group={group}
            user={user}
            onBack={() => setCurrentScreen('groups')}
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