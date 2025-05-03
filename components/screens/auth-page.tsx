import React, { useState } from 'react';
import { SignInScreen } from './sign-in';
import { SignUpScreen } from './sign-up';

export function AuthPage() {
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');

  return mode === 'sign-in' ? (
    <SignInScreen onNext={() => {}} onSignUp={() => setMode('sign-up')} />
  ) : (
    <SignUpScreen onDone={() => setMode('sign-in')} />
  );
} 