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
import { onAuthStateChanged, getIdToken } from 'firebase/auth';
import {
  auth,
  signInWithGoogle,
  signOutFromFirebase,
  type User,
} from '../lib/firebase';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      
      // Set or clear auth cookie based on user state
      if (nextUser) {
        try {
          // Get ID token and set it in cookie via API route
          const idToken = await getIdToken(nextUser);
          await fetch('/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken }),
          });
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error setting auth session:', error);
          }
        }
      } else {
        // Clear auth cookie on logout
        try {
          await fetch('/api/auth/session', {
            method: 'DELETE',
          });
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error clearing auth session:', error);
          }
        }
      }
      
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = useCallback(async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      // Clear cookie first, then sign out from Firebase
      try {
        await fetch('/api/auth/session', {
          method: 'DELETE',
        });
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error clearing auth session:', error);
        }
      }
      await signOutFromFirebase();
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      signIn,
      signOut,
    }),
    [user, loading, signIn, signOut],
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



