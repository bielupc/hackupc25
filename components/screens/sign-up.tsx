import React, { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';

interface SignUpScreenProps {
  onDone: (user: { email: string; password: string; firstName: string; lastName: string }) => boolean;
  error?: string | null;
}

export function SignUpScreen({ onDone, error }: SignUpScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSignUp = () => {
    onDone({ email, password, firstName, lastName });
  };

  return (
    <div className="items-center flex flex-col justify-center bg-gradient-to-br from-white to-blue-50 px-4 h-full">
      <div className="w-full flex flex-col max-w-md justify-center flex-1">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-xl font-semibold mt-2 mb-1">Welcome!</h2>
          <h1 className="text-4xl font-bold mb-2">Sign up</h1>
          <p className="text-gray-500 mb-6">Please fill your information</p>
        </div>
        {error && <div className="text-red-500 text-center mb-2">{error}</div>}
        <div className="space-y-4 mb-8">
          <div className="bg-gray-200 rounded-2xl px-6 py-4 flex items-center">
            <div className="flex-1">
              <div className="text-sm text-gray-500 mb-1">Email</div>
              <input
                type="email"
                placeholder="john.doe@gmail.com"
                className="bg-transparent outline-none text-lg font-bold text-gray-900 placeholder-gray-400 w-full"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <Mail className="w-5 h-5 text-gray-400 ml-3" />
          </div>
          <div className="bg-gray-200 rounded-2xl px-6 py-4 flex items-center">
            <div className="flex-1">
              <div className="text-sm text-gray-500 mb-1">Password</div>
              <input
                type="password"
                placeholder=""
                className="bg-transparent outline-none text-lg font-bold text-gray-900 placeholder-gray-400 w-full"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <Lock className="w-5 h-5 text-gray-400 ml-3" />
          </div>
          <div className="bg-gray-200 rounded-2xl px-6 py-4 flex items-center">
            <div className="flex-1">
              <div className="text-sm text-gray-500 mb-1">First name</div>
              <input
                type="text"
                placeholder="John"
                className="bg-transparent outline-none text-lg font-bold text-gray-900 placeholder-gray-400 w-full"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
              />
            </div>
            <User className="w-5 h-5 text-gray-400 ml-3" />
          </div>
          <div className="bg-gray-200 rounded-2xl px-6 py-4 flex items-center">
            <div className="flex-1">
              <div className="text-sm text-gray-500 mb-1">Last name</div>
              <input
                type="text"
                placeholder="Doe"
                className="bg-transparent outline-none text-lg font-bold text-gray-900 placeholder-gray-400 w-full"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
              />
            </div>
            <User className="w-5 h-5 text-gray-400 ml-3" />
          </div>
        </div>
        <button
          className="w-full bg-blue-600 text-white py-4 rounded-full font-semibold text-lg shadow-md hover:bg-blue-700 transition-colors mb-6"
          onClick={handleSignUp}
        >
          Done
        </button>
      </div>
    </div>
  );
}
