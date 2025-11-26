-- Create shots table
CREATE TABLE IF NOT EXISTS public.shots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_id TEXT NOT NULL,
  image_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  hue NUMERIC NOT NULL,
  saturation NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_shots_user_id ON public.shots(user_id);
CREATE INDEX IF NOT EXISTS idx_shots_created_at ON public.shots(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.shots ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Users can view own shots" ON public.shots;
DROP POLICY IF EXISTS "Users can insert own shots" ON public.shots;
DROP POLICY IF EXISTS "Users can delete own shots" ON public.shots;

-- Policy: Users can only read their own shots
CREATE POLICY "Users can view own shots"
  ON public.shots
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can only insert their own shots
CREATE POLICY "Users can insert own shots"
  ON public.shots
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only delete their own shots
CREATE POLICY "Users can delete own shots"
  ON public.shots
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- Device Fingerprinting Tables
-- ============================================

-- Device fingerprints table
CREATE TABLE IF NOT EXISTS public.device_fingerprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fingerprint TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  is_signup BOOLEAN DEFAULT TRUE, -- TRUE = account created, FALSE = signin only
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, fingerprint, is_signup)
);

CREATE INDEX IF NOT EXISTS idx_device_fingerprint ON public.device_fingerprints(fingerprint);
CREATE INDEX IF NOT EXISTS idx_device_user ON public.device_fingerprints(user_id);
CREATE INDEX IF NOT EXISTS idx_device_created ON public.device_fingerprints(fingerprint, created_at);

-- Drop existing function if it exists (for idempotency)
DROP FUNCTION IF EXISTS public.check_device_account_limit(TEXT, INTEGER);

-- Function to check device account limit (signups only)
CREATE OR REPLACE FUNCTION public.check_device_account_limit(
  fingerprint_text TEXT, 
  max_accounts INTEGER DEFAULT 2
)
RETURNS BOOLEAN AS $$
DECLARE
  account_count INTEGER;
BEGIN
  SELECT COUNT(DISTINCT device_fingerprints.user_id)
  INTO account_count
  FROM public.device_fingerprints
  WHERE device_fingerprints.fingerprint = fingerprint_text
    AND device_fingerprints.is_signup = TRUE -- Only count signups
    AND device_fingerprints.created_at > NOW() - INTERVAL '30 days';
  
  RETURN account_count < max_accounts;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Credits System Tables
-- ============================================

-- User credits table
CREATE TABLE IF NOT EXISTS public.user_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  balance INTEGER NOT NULL DEFAULT 0 CHECK (balance >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Credit transactions table (for history/audit)
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- Positive = credit, Negative = debit
  type TEXT NOT NULL, -- 'free_trial', 'purchase', 'image_generation', 'concept_generation', 'refund'
  source TEXT, -- 'package_starter', 'payment_razorpay_order_xyz', etc.
  metadata JSONB, -- Additional context (order_id, image_id, etc.)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_credit_transactions_user ON public.credit_transactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_type ON public.credit_transactions(type, created_at);

-- User metadata tracking (Note: This requires Supabase admin access or manual migration)
-- ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS trial_credits_granted BOOLEAN DEFAULT FALSE;
-- ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS trial_granted_at TIMESTAMPTZ;

-- ============================================
-- Credit Management Functions
-- ============================================

-- Drop existing functions if they exist (for idempotency and parameter name changes)
DROP FUNCTION IF EXISTS public.grant_trial_credits(UUID);
DROP FUNCTION IF EXISTS public.has_sufficient_credits(UUID, INTEGER);
DROP FUNCTION IF EXISTS public.deduct_credits(UUID, INTEGER, TEXT, JSONB);
DROP FUNCTION IF EXISTS public.add_credits(UUID, INTEGER, TEXT, JSONB);

-- Function to grant trial credits
CREATE OR REPLACE FUNCTION public.grant_trial_credits(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Note: trial_credits_granted and trial_granted_at columns need to be added manually
  -- to auth.users table via Supabase dashboard or with service role key
  
  -- Add 3 credits to balance
  INSERT INTO public.user_credits (user_id, balance)
  VALUES (p_user_id, 3)
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    balance = user_credits.balance + 3,
    updated_at = NOW();
  
  -- Record transaction
  INSERT INTO public.credit_transactions (user_id, amount, type, source, metadata)
  VALUES (p_user_id, 3, 'free_trial', 'signup_bonus', jsonb_build_object('credits', 3));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has enough credits
CREATE OR REPLACE FUNCTION public.has_sufficient_credits(
  p_user_id UUID,
  required_credits INTEGER DEFAULT 1
)
RETURNS BOOLEAN AS $$
DECLARE
  current_balance INTEGER;
BEGIN
  SELECT user_credits.balance INTO current_balance
  FROM public.user_credits
  WHERE user_credits.user_id = p_user_id;
  
  RETURN COALESCE(current_balance, 0) >= required_credits;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to deduct credits (atomically)
CREATE OR REPLACE FUNCTION public.deduct_credits(
  p_user_id UUID,
  amount INTEGER,
  transaction_type TEXT,
  metadata JSONB DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  new_balance INTEGER;
BEGIN
  -- Deduct credits
  UPDATE public.user_credits
  SET 
    balance = user_credits.balance - amount,
    updated_at = NOW()
  WHERE user_credits.user_id = p_user_id
    AND user_credits.balance >= amount
  RETURNING user_credits.balance INTO new_balance;
  
  IF new_balance IS NULL THEN
    RAISE EXCEPTION 'Insufficient credits';
  END IF;
  
  -- Record transaction
  INSERT INTO public.credit_transactions (user_id, amount, type, metadata)
  VALUES (p_user_id, -amount, transaction_type, metadata);
  
  RETURN new_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add credits (for purchases)
CREATE OR REPLACE FUNCTION public.add_credits(
  p_user_id UUID,
  amount INTEGER,
  source TEXT,
  metadata JSONB DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  new_balance INTEGER;
BEGIN
  -- Add credits
  INSERT INTO public.user_credits (user_id, balance)
  VALUES (p_user_id, amount)
  ON CONFLICT (user_id)
  DO UPDATE SET 
    balance = user_credits.balance + amount,
    updated_at = NOW()
  RETURNING user_credits.balance INTO new_balance;
  
  -- Record transaction
  INSERT INTO public.credit_transactions (user_id, amount, type, source, metadata)
  VALUES (p_user_id, amount, 'purchase', source, metadata);
  
  RETURN new_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- RLS Policies for New Tables
-- ============================================

-- Enable RLS on new tables
ALTER TABLE public.device_fingerprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Users can view own device fingerprints" ON public.device_fingerprints;
DROP POLICY IF EXISTS "Users can insert own device fingerprints" ON public.device_fingerprints;
DROP POLICY IF EXISTS "Users can view own credits" ON public.user_credits;
DROP POLICY IF EXISTS "Users can view own credit transactions" ON public.credit_transactions;

-- Device fingerprints: Users can only read their own
CREATE POLICY "Users can view own device fingerprints"
  ON public.device_fingerprints FOR SELECT
  USING (auth.uid() = user_id);

-- Device fingerprints: Users can insert their own fingerprints (for signup/signin tracking)
CREATE POLICY "Users can insert own device fingerprints"
  ON public.device_fingerprints FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Credits: Users can only read their own balance
CREATE POLICY "Users can view own credits"
  ON public.user_credits FOR SELECT
  USING (auth.uid() = user_id);

-- Credits: Service role can insert/update (via SECURITY DEFINER functions)
-- Note: INSERT/UPDATE handled by functions with SECURITY DEFINER, so no policy needed

-- Credit transactions: Users can only read their own
CREATE POLICY "Users can view own credit transactions"
  ON public.credit_transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Credit transactions: Service role can insert (via SECURITY DEFINER functions)
-- Note: INSERT handled by functions with SECURITY DEFINER, so no policy needed

