import React from "react";

interface MobileMockupProps {
  children: React.ReactNode;
}

export function MobileMockup({ children }: MobileMockupProps) {
  // iPhone 14 Pro Max dimensions for realism
  const mockupHeight = 844;
  const mockupWidth = 390;
  const borderWidth = 12;
  const notchWidth = 120;
  const notchHeight = 32;
  const notchRadius = 16;
  const sideButtonHeight = 48;
  const sideButtonWidth = 5;
  const sideButtonOffset = 60;

  return (
    <div className="relative flex items-center justify-center" style={{ minHeight: '100vh' }}>
      <div
        className="relative bg-black rounded-[48px] shadow-2xl mx-auto"
        style={{
          height: `${mockupHeight}px`,
          width: `${mockupWidth}px`,
          boxShadow: '0 8px 40px 0 rgba(0,0,0,0.25)',
        }}
      >
        {/* Notch */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-0 bg-black z-20"
          style={{
            width: `${notchWidth}px`,
            height: `${notchHeight}px`,
            borderBottomLeftRadius: `${notchRadius}px`,
            borderBottomRightRadius: `${notchRadius}px`,
          }}
        />
        {/* Left side buttons */}
        <div className="absolute left-0" style={{ top: mockupHeight * 0.18, height: sideButtonHeight, width: sideButtonWidth, background: '#222', borderRadius: 4 }} />
        <div className="absolute left-0" style={{ top: mockupHeight * 0.32, height: sideButtonHeight, width: sideButtonWidth, background: '#222', borderRadius: 4 }} />
        {/* Right side button */}
        <div className="absolute right-0" style={{ top: mockupHeight * 0.25, height: sideButtonHeight * 1.5, width: sideButtonWidth, background: '#222', borderRadius: 4 }} />
        {/* Screen */}
        <div
          className="absolute top-0 left-0 right-0 bottom-0 m-[12px] bg-white rounded-[40px] overflow-hidden flex flex-col"
          style={{
            height: `${mockupHeight - borderWidth * 2}px`,
            width: `${mockupWidth - borderWidth * 2}px`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
} 