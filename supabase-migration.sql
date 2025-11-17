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

