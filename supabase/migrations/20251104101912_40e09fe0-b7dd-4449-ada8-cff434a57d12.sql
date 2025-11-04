-- Create subscriptions table to track user plans
CREATE TABLE public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  paypal_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own subscription"
ON public.subscriptions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription"
ON public.subscriptions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Function to get user's monthly proposal count
CREATE OR REPLACE FUNCTION public.get_monthly_proposal_count(user_id_param UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  proposal_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO proposal_count
  FROM public.proposals
  WHERE user_id = user_id_param
    AND created_at >= date_trunc('month', CURRENT_DATE);
  
  RETURN proposal_count;
END;
$$;

-- Function to check if user can create proposal
CREATE OR REPLACE FUNCTION public.can_create_proposal(user_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  has_subscription BOOLEAN;
  proposal_count INTEGER;
BEGIN
  -- Check if user has active subscription
  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE user_id = user_id_param
      AND status = 'active'
      AND (expires_at IS NULL OR expires_at > now())
  ) INTO has_subscription;
  
  -- If has subscription, can create unlimited
  IF has_subscription THEN
    RETURN TRUE;
  END IF;
  
  -- Otherwise check monthly limit
  SELECT get_monthly_proposal_count(user_id_param) INTO proposal_count;
  
  RETURN proposal_count < 3;
END;
$$;