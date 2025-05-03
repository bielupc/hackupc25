'use client'

import { Facebook, Apple, CheckCircle, Circle } from 'lucide-react';
import React, { useState } from 'react';

// Dummy Google Icon component
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15.05 14.81v0a4.6 4.6 0 0 1-2.43.65 4.82 4.82 0 0 1-4.58-3.26h9.05a4.9 4.9 0 0 1 .12-1.21 4.83 4.83 0 0 1-4.7-4.58 4.83 4.83 0 0 1 4.7-4.58 4.75 4.75 0 0 1 3.9 1.94l-1.41 1.41a2.94 2.94 0 0 0-2.49-1.1 2.9 2.9 0 0 0-2.83 2.94 2.9 2.9 0 0 0 2.83 2.94 2.7 2.7 0 0 0 2.59-1.61h-2.59V11h5.1A4.87 4.87 0 0 1 15.05 14.81Z" />
  </svg>
);

interface SignInScreenProps {
  onNext: () => void;
}

export function SignInScreen({ onNext }: SignInScreenProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('facebook');

  const loginOptions = [
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600', textColor: 'text-blue-600' },
    { id: 'google', name: 'Google', icon: GoogleIcon, color: 'bg-gray-200', textColor: 'text-gray-700' },
    { id: 'apple', name: 'Apple', icon: Apple, color: 'bg-gray-200', textColor: 'text-gray-700' },
  ];

  return (
    <div className="flex flex-col h-full p-6 bg-white text-gray-900">
      <div className="mt-16 mb-8 text-center">
        <p className="text-gray-500 text-sm mb-1">Choose your</p>
        <h1 className="text-4xl font-bold">Sign in</h1>
        <p className="text-gray-500 mt-2">Select login method</p>
      </div>

      <div className="space-y-4 mb-auto">
        {loginOptions.map((option) => {
          const isSelected = selectedMethod === option.id;
          return (
            <button
              key={option.id}
              onClick={() => setSelectedMethod(option.id)}
              className={`w-full flex items-center p-4 rounded-full transition-all duration-200 ease-in-out ${isSelected ? 'bg-blue-50 border border-blue-500 shadow-lg' : 'bg-gray-100 border border-transparent'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${isSelected ? option.color : 'bg-gray-200'}`}>
                <option.icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
              </div>
              <span className={`font-medium ${isSelected ? option.textColor : 'text-gray-700'}`}>Use <span className='font-bold'>{option.name}</span></span>
              <div className="ml-auto">
                {isSelected ? (
                  <CheckCircle className="w-6 h-6 text-blue-600 fill-current" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-300" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <button className="w-full bg-blue-600 text-white py-4 rounded-full font-semibold text-lg shadow-md hover:bg-blue-700 transition-colors" onClick={onNext}>
        Next
      </button>
    </div>
  );
} 