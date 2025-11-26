'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { createClient } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import { generateDeviceFingerprint, storeFingerprintForAuth } from '../lib/device-fingerprint';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithPhone: (phone: string) => Promise<void>;
  verifyPhoneOtp: (phone: string, token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    try {
      // Generate fingerprint before OAuth redirect
      const fingerprint = await generateDeviceFingerprint();
      
      // Store in localStorage for retrieval after OAuth redirect
      storeFingerprintForAuth(fingerprint);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?fingerprint=${encodeURIComponent(fingerprint)}`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const signInWithPhone = useCallback(async (phone: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          channel: 'sms',
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const verifyPhoneOtp = useCallback(async (phone: string, token: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms',
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      // Clear client-side session
      const { error: clientError } = await supabase.auth.signOut();
      if (clientError) throw clientError;

      // Clear server-side session cookies
      const response = await fetch('/api/auth/session', {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to clear server session');
      }
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const value = useMemo(
    () => ({
      user,
      loading,
      signInWithGoogle,
      signInWithPhone,
      verifyPhoneOtp,
      signOut,
    }),
    [user, loading, signInWithGoogle, signInWithPhone, verifyPhoneOtp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
