'use client'

import { useState } from "react";
import { MobileMockup } from "@/components/mobile-mockup";
import { SignInScreen } from "@/components/screens/sign-in";
import { HomeScreen } from "@/components/screens/home";
import { TravelScreen } from "@/components/screens/travel";

const screens = [
  SignInScreen,
  HomeScreen,
  TravelScreen,
  // Add more screens here as needed
];

export default function Home() {
  const [screenIndex, setScreenIndex] = useState(0);
  const ScreenComponent = screens[screenIndex];

  const handleNext = () => {
    if (screenIndex < screens.length - 1) {
      setScreenIndex(screenIndex + 1);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12 bg-gray-100">
      <MobileMockup>
        <ScreenComponent onNext={handleNext} />
      </MobileMockup>
    </main>
  );
}
