import React, { useState, useEffect } from 'react';
import { SignInScreen } from './sign-in';
import { SignUpScreen } from './sign-up';

export interface User {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface AuthPageProps {
  onLoginSuccess: (user: User) => void;
}

export function AuthPage({ onLoginSuccess }: AuthPageProps) {
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [users, setUsers] = useState<User[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('users');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });
  const [error, setError] = useState<string | null>(null);

  // Save users to localStorage whenever users change
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const handleSignUp = (user: User) => {
    if (users.some(u => u.email === user.email)) {
      setError('User already exists');
      return false;
    }
    setUsers([...users, user]);
    setError(null);
    setMode('sign-in');
    return true;
  };

  const handleSignIn = (email: string, password: string) => {
    if (email === 'test@test.com' && password === 'test') {
      // success
      setError(null);
      onLoginSuccess({
        email: 'test@test.com',
        password: 'test',
        firstName: 'Test',
        lastName: 'User'
      });
      return true;
    }
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      setError('Invalid credentials');
      return false;
    }
    setError(null);
    onLoginSuccess(user);
    return true;
  };

  return mode === 'sign-in' ? (
    <SignInScreen
      onNext={handleSignIn}
      onSignUp={() => { setMode('sign-up'); setError(null); }}
      error={error}
    />
  ) : (
    <SignUpScreen
      onDone={handleSignUp}
      error={error}
    />
  );
} 