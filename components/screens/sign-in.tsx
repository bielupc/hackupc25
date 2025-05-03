'use client'

import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';

// Dummy Logo component
const Logo = () => (
  <div className="flex items-center justify-center mb-6">
    <div className="bg-green-500 rounded-full w-10 h-10 flex items-center justify-center mr-2">
      <span className="text-white text-lg font-bold">U</span>
    </div>
    <span className="text-2xl font-bold font-serif">Unpackr</span>
  </div>
);

interface SignInScreenProps {
  onNext: () => void;
}

export function SignInScreen({ onNext }: SignInScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-gradient-to-br from-white to-blue-50 px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mt-8 mb-8">
          <Logo />
          <h2 className="text-xl font-semibold mt-2 mb-1">Wellcome!</h2>
          <h1 className="text-4xl font-bold mb-2">Sign in</h1>
          <p className="text-gray-500 mb-6">Please fill your informations</p>
        </div>
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
          className="w-full bg-blue-600 text-white py-4 rounded-full font-semibold text-lg shadow-md hover:bg-blue-700 transition-colors mb-6"
          onClick={onNext}
        >
          Sign in now
        </button>
        <div className="flex justify-center">
          <button className="text-lg font-semibold text-gray-900 hover:underline" type="button">
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
} 