-- Fix security issues by updating function search paths

-- Update handle_new_user function with proper search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = 'public'
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

-- Update check_daily_usage function with proper search_path  
CREATE OR REPLACE FUNCTION public.check_daily_usage(user_uuid UUID)
RETURNS TABLE(can_use BOOLEAN, usage_count INTEGER, limit_count INTEGER) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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

-- Also update the update_updated_at_column function for consistency
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;