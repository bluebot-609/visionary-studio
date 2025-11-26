import { useCreditsContext } from '../providers/credits-provider';

export interface CreditBalance {
  balance: number;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Hook to access credit balance.
 * This is a wrapper around the CreditsContext to maintain backward compatibility.
 * Make sure CreditsProvider is wrapped around components using this hook.
 */
export const useCredits = (): CreditBalance => {
  return useCreditsContext();
};

