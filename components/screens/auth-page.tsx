import React, { useState } from 'react';
import { SignInScreen } from './sign-in';
import { SignUpScreen } from './sign-up';
import { supabase } from '../../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthPageProps {
  onLoginSuccess: (user: User) => void;
  onBack: () => void;
}

export function AuthPage({ onLoginSuccess, onBack }: AuthPageProps) {
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [error, setError] = useState<string | null>(null);

  // Directly insert into users table
  const handleSignUp = async (user: { email: string; password: string; firstName: string; lastName: string }) => {
    try {
      const id = uuidv4();
      console.log(user);
      const { error: insertError } = await supabase.from('users').insert([
        {
          id,
          email: user.email,
          password: user.password,
          first_name: user.firstName,
          last_name: user.lastName,
        },
      ]);
      if (insertError) throw insertError;
      setError(null);
      setMode('sign-in');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating user');
      console.log(err);
      return false;
    }
  };

  // Directly query users table
  const handleSignIn = async (email: string, password: string) => {
    try {
      const { data, error: selectError } = await supabase
        .from('users')
        .select('id, email, first_name, last_name')
        .eq('email', email)
        .eq('password', password)
        .single();
      if (selectError || !data) throw selectError || new Error('Invalid credentials');
      setError(null);
      onLoginSuccess({
        id: data.id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
      });
      return true;
    } catch (err) {
      setError('Invalid credentials');
      return false;
    }
  };

  return mode === 'sign-in' ? (
    <SignInScreen
      onNext={handleSignIn}
      onSignUp={() => { setMode('sign-up'); setError(null); }}
      onBack={onBack}
      error={error}
    />
  ) : (
    <SignUpScreen
      onDone={handleSignUp}
      onBack={() => setMode('sign-in')}
      error={error}
    />
  );
} 