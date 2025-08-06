import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionStatus {
  isActive: boolean;
  isExpired: boolean;
  isInGracePeriod: boolean;
  daysUntilExpiry: number;
  subscriptionEndDate: string | null;
  paymentStatus: string;
}

export const useSubscriptionGuard = () => {
  const { user, profile, loading } = useAuth();
  const { toast } = useToast();
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    isActive: false,
    isExpired: false,
    isInGracePeriod: false,
    daysUntilExpiry: 0,
    subscriptionEndDate: null,
    paymentStatus: 'unknown'
  });
  const [isChecking, setIsChecking] = useState(false);

  const checkSubscriptionStatus = async () => {
    if (!user || !profile || loading) return;

    setIsChecking(true);
    try {
      // Get latest profile data
      const { data: latestProfile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error checking subscription:', error);
        return;
      }

      const now = new Date();
      const endDate = (latestProfile as any).subscription_end_date ? new Date((latestProfile as any).subscription_end_date) : null;
      const daysUntilExpiry = endDate ? Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0;
      
      const isActive = latestProfile.plan_type === 'pro' && ((latestProfile as any).payment_status === 'active' || !(latestProfile as any).payment_status);
      const isExpired = endDate ? now > endDate : false;
      const isInGracePeriod = latestProfile.plan_type === 'pro' && isExpired && daysUntilExpiry > -7; // 7-day grace period

      setSubscriptionStatus({
        isActive,
        isExpired,
        isInGracePeriod,
        daysUntilExpiry,
        subscriptionEndDate: (latestProfile as any).subscription_end_date || null,
        paymentStatus: (latestProfile as any).payment_status || 'unknown'
      });

      // Show warnings for grace period users
      if (isInGracePeriod && daysUntilExpiry < 0) {
        toast({
          title: "Subscription Expired",
          description: `Your subscription expired ${Math.abs(daysUntilExpiry)} days ago. Please renew to continue using Pro features.`,
          variant: "destructive",
        });
      } else if (daysUntilExpiry <= 3 && daysUntilExpiry > 0) {
        toast({
          title: "Subscription Expiring Soon",
          description: `Your subscription expires in ${daysUntilExpiry} days. Please renew to avoid service interruption.`,
          variant: "default",
        });
      }

    } catch (error) {
      console.error('Subscription check error:', error);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkSubscriptionStatus();
  }, [user, profile]);

  // Check subscription status every 5 minutes
  useEffect(() => {
    const interval = setInterval(checkSubscriptionStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user, profile]);

  const requireProAccess = (action: () => void, redirectToUpgrade: () => void) => {
    if (!subscriptionStatus.isActive && !subscriptionStatus.isInGracePeriod) {
      toast({
        title: "Pro Subscription Required",
        description: "This feature requires an active Pro subscription.",
        variant: "destructive",
      });
      redirectToUpgrade();
      return false;
    }

    if (subscriptionStatus.isInGracePeriod) {
      toast({
        title: "Subscription Expired",
        description: "Your subscription has expired. Please renew to continue using Pro features.",
        variant: "destructive",
      });
    }

    action();
    return true;
  };

  return {
    subscriptionStatus,
    isChecking,
    checkSubscriptionStatus,
    requireProAccess,
  };
};