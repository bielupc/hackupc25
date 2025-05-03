import React, { useState } from 'react';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react';

interface SignUpScreenProps {
  onDone: (user: { email: string; password: string; firstName: string; lastName: string }) => Promise<boolean>;
  onBack: () => void;
  error?: string | null;
}

export function SignUpScreen({ onDone, onBack, error }: SignUpScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSignUp = async () => {
    if (!email || !password || !firstName || !lastName) {
      setLocalError('All fields are required.');
      return;
    }
    setLocalError(null);
    setIsLoading(true);
    try {
      await onDone({ email, password, firstName, lastName });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative items-center flex flex-col justify-center bg-gradient-to-b from-blue-100 via-white to-white px-4 h-full">
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
          <h2 className="text-xl font-semibold mt-2 mb-1">Welcome!</h2>
          <h1 className="text-4xl font-bold mb-2">Sign up</h1>
          <p className="text-gray-500 mb-6">Please fill your information</p>
        </div>
        {(localError || error) && <div className="text-red-500 text-center mb-2">{localError || error}</div>}
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
          className={`w-full bg-blue-600 text-white py-4 rounded-full font-semibold text-lg shadow-md transition-colors mb-6 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
          onClick={handleSignUp}
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Done'}
        </button>
      </div>
    </div>
  );
}
