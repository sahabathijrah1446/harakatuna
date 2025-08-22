import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  plan_type: string;
  daily_usage: number;
  last_usage_reset: string;
  subscription_end_date: string | null;
  payment_status: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
        return;
      }

      if (!data) {
        console.log('No profile found for user, profile will be null');
        setProfile(null);
        return;
      }

      // Map data with only existing fields
      const profileData: UserProfile = {
        id: data.id,
        user_id: data.user_id,
        display_name: data.display_name,
        plan_type: data.plan_type || 'free',
        daily_usage: data.daily_usage || 0,
        last_usage_reset: data.last_usage_reset,
        subscription_end_date: null, // Remove non-existent field
        payment_status: 'unknown' // Remove non-existent field
      };

      console.log('Profile fetched successfully:', profileData);
      setProfile(profileData);
    } catch (error) {
      console.error('Profile fetch error:', error);
      setProfile(null);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id || 'No user');
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      
      console.log('Setting loading to false - initial session');
      setLoading(false);
    }).catch((error) => {
      console.error('Session fetch error:', error);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id || 'No user');
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        
        console.log('Setting loading to false - auth state change');
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      signOut,
      refreshProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};