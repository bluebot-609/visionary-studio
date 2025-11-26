'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef, useMemo, type ReactNode } from 'react';
import { useAuth } from '../hooks/use-auth';

interface CreditsContextValue {
  balance: number;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const CreditsContext = createContext<CreditsContextValue | undefined>(undefined);

export const CreditsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const fetchedUserIdRef = useRef<string | null>(null);
  const isFetchingRef = useRef<boolean>(false);

  const fetchBalance = useCallback(async () => {
    if (!user) {
      setBalance(0);
      setLoading(false);
      fetchedUserIdRef.current = null;
      return;
    }

    // Prevent duplicate fetches for the same user
    if (fetchedUserIdRef.current === user.id && !isFetchingRef.current) {
      return;
    }

    // Prevent concurrent fetches
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/credits/balance');
      if (!response.ok) {
        throw new Error('Failed to fetch credits');
      }

      const data = await response.json();
      setBalance(data.balance || 0);
      fetchedUserIdRef.current = user.id;
    } catch (err) {
      console.error('Error fetching credits:', err);
      setError(err instanceof Error ? err.message : 'Failed to load credits');
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [user]);

  useEffect(() => {
    // Only fetch if user changed or we haven't fetched for this user yet
    if (user && fetchedUserIdRef.current !== user.id) {
      fetchBalance();
    } else if (!user && fetchedUserIdRef.current !== null) {
      // User logged out
      setBalance(0);
      setLoading(false);
      fetchedUserIdRef.current = null;
    }
  }, [user?.id, fetchBalance]);

  const refresh = useCallback(async () => {
    // Force refresh by clearing the cache
    fetchedUserIdRef.current = null;
    await fetchBalance();
  }, [fetchBalance]);

  const value = useMemo(
    () => ({
      balance,
      loading,
      error,
      refresh,
    }),
    [balance, loading, error, refresh]
  );

  return <CreditsContext.Provider value={value}>{children}</CreditsContext.Provider>;
};

export const useCreditsContext = () => {
  const context = useContext(CreditsContext);
  if (!context) {
    throw new Error('useCreditsContext must be used within a CreditsProvider');
  }
  return context;
};

