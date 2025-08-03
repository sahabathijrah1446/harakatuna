-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'pro', 'admin')),
  daily_usage INTEGER DEFAULT 0,
  last_usage_reset DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create table for user analysis history
CREATE TABLE public.analysis_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  input_text TEXT NOT NULL,
  harakat_result TEXT,
  transliteration TEXT,
  translation TEXT,
  explanation TEXT,
  analysis_type TEXT DEFAULT 'manual' CHECK (analysis_type IN ('manual', 'ocr')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for analysis history
ALTER TABLE public.analysis_history ENABLE ROW LEVEL SECURITY;

-- Create policies for analysis history
CREATE POLICY "Users can view their own history" 
ON public.analysis_history 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own history" 
ON public.analysis_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to check and update daily usage
CREATE OR REPLACE FUNCTION public.check_daily_usage(user_uuid UUID)
RETURNS TABLE(can_use BOOLEAN, usage_count INTEGER, limit_count INTEGER) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_profile RECORD;
    current_limit INTEGER;
BEGIN
    -- Get user profile with plan type
    SELECT * INTO user_profile 
    FROM public.profiles 
    WHERE user_id = user_uuid;
    
    -- Reset daily usage if new day
    IF user_profile.last_usage_reset < CURRENT_DATE THEN
        UPDATE public.profiles 
        SET daily_usage = 0, last_usage_reset = CURRENT_DATE 
        WHERE user_id = user_uuid;
        user_profile.daily_usage := 0;
    END IF;
    
    -- Set limits based on plan
    IF user_profile.plan_type = 'pro' OR user_profile.plan_type = 'admin' THEN
        current_limit := 999999; -- Unlimited for pro users
    ELSE
        current_limit := 25; -- Free plan limit
    END IF;
    
    -- Return usage status
    RETURN QUERY SELECT 
        (user_profile.daily_usage < current_limit) as can_use,
        user_profile.daily_usage as usage_count,
        current_limit as limit_count;
END;
$$;