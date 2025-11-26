import { createClient } from '@/lib/supabase-server';
import type { Database } from '@/lib/database.types';

type CreditTransactionType = 'free_trial' | 'purchase' | 'image_generation' | 'concept_generation' | 'refund';

export interface CreditBalance {
  balance: number;
  userId: string;
}

export interface CreditTransaction {
  id: string;
  amount: number;
  type: CreditTransactionType;
  source?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

/**
 * Get user's current credit balance
 */
export async function getCreditBalance(userId: string): Promise<number> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('user_credits')
    .select('balance')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching credit balance:', error);
    // Return 0 on error (user has no credits or error occurred)
    return 0;
  }
  
  if (!data) {
    return 0;
  }
  
  return data.balance;
}

/**
 * Check if user has sufficient credits
 */
export async function hasSufficientCredits(
  userId: string,
  requiredCredits: number = 1
): Promise<boolean> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .rpc('has_sufficient_credits', {
      p_user_id: userId,
      required_credits: requiredCredits
    });
  
  if (error) {
    console.error('Error checking credits:', error);
    // On error, be conservative and deny access
    return false;
  }
  
  return data === true;
}

/**
 * Deduct credits for an operation (e.g., image generation)
 */
export async function deductCredits(
  userId: string,
  amount: number,
  transactionType: CreditTransactionType,
  metadata?: Record<string, any>
): Promise<{ success: boolean; newBalance: number | null; error?: string }> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .rpc('deduct_credits', {
      p_user_id: userId,
      amount: amount,
      transaction_type: transactionType,
      metadata: metadata || null
    });
  
  if (error) {
    console.error('Error deducting credits:', error);
    return {
      success: false,
      newBalance: null,
      error: error.message
    };
  }
  
  return {
    success: true,
    newBalance: data as number
  };
}

/**
 * Add credits (for purchases)
 */
export async function addCredits(
  userId: string,
  amount: number,
  source: string,
  metadata?: Record<string, any>
): Promise<{ success: boolean; newBalance: number | null; error?: string }> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .rpc('add_credits', {
      p_user_id: userId,
      amount: amount,
      source: source,
      metadata: metadata || null
    });
  
  if (error) {
    console.error('Error adding credits:', error);
    return {
      success: false,
      newBalance: null,
      error: error.message
    };
  }
  
  return {
    success: true,
    newBalance: data as number
  };
}

/**
 * Grant trial credits to new user
 */
export async function grantTrialCredits(userId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .rpc('grant_trial_credits', {
      p_user_id: userId
    });
  
  if (error) {
    console.error('Error granting trial credits:', error);
    return {
      success: false,
      error: error.message
    };
  }
  
  return { success: true };
}

/**
 * Get credit transaction history
 */
export async function getCreditTransactions(
  userId: string,
  limit: number = 50
): Promise<CreditTransaction[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('credit_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error || !data) {
    return [];
  }
  
  return data as CreditTransaction[];
}

