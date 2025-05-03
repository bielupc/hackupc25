'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { Mail, Lock, ArrowLeft } from 'lucide-react';

const Logo = () => (
  <div className="flex flex-col items-center justify-center mb-6">
    <Image src="/logo_black.svg" alt="Unpackr Logo" width={300} height={75} /> 
  </div>
);

interface SignInScreenProps {
  onNext: (email: string, password: string) => Promise<boolean>;
  onSignUp: () => void;
  onBack: () => void;
  error?: string | null;
}

export function SignInScreen({ onNext, onSignUp, onBack, error }: SignInScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await onNext(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative items-center flex flex-col justify-center bg-gradient-to-br from-white to-blue-50 px-4 h-full">
      {/* Back Button at the very top */}
      <button
        className="absolute top-6 left-6 flex items-center text-gray-600 hover:text-gray-900"
        onClick={onBack}
        type="button"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>
      <div className="w-full flex flex-col max-w-md justify-center flex-1">
        <div className="flex flex-col items-center mb-8">
          <Logo />
          <h1 className="text-4xl font-bold mb-2">Sign in</h1>
          <p className="text-gray-500 mb-6">Please fill your information</p>
        </div>
        {error && <div className="text-red-500 text-center mb-2">{error}</div>}
        <div className="space-y-4 mb-8">
          <div className="bg-gray-100 rounded-2xl px-6 py-4 flex items-center">
            <Mail className="w-5 h-5 text-gray-400 mr-3" />
            <input
              type="email"
              placeholder="Email"
              className="bg-transparent flex-1 outline-none text-lg font-semibold text-gray-900 placeholder-gray-400"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="bg-gray-100 rounded-2xl px-6 py-4 flex items-center">
            <Lock className="w-5 h-5 text-gray-400 mr-3" />
            <input
              type="password"
              placeholder="Password"
              className="bg-transparent flex-1 outline-none text-lg text-gray-900 placeholder-gray-400"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
        </div>
        <button
          className={`w-full bg-blue-600 text-white py-4 rounded-full font-semibold text-lg shadow-md transition-colors mb-6 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
          onClick={handleSignIn}
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign in now'}
        </button>
        <div className="flex justify-center">
          <button className="text-lg font-semibold text-gray-900 hover:underline" type="button" onClick={onSignUp}>
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
} 