import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscriptionGuard } from "@/hooks/useSubscriptionGuard";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock } from "lucide-react";

interface SubscriptionGuardProps {
  children: React.ReactNode;
  requiredPlan?: 'pro' | 'admin';
  showGracePeriodWarning?: boolean;
  redirectPath?: string;
}

export const SubscriptionGuard = ({ 
  children, 
  requiredPlan = 'pro',
  showGracePeriodWarning = true,
  redirectPath = '/pro'
}: SubscriptionGuardProps) => {
  const { profile, loading } = useAuth();
  const { subscriptionStatus } = useSubscriptionGuard();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading || !profile) return;

    // Admin bypass
    if (profile.plan_type === 'admin') return;

    // Check if user needs to be redirected
    if (requiredPlan === 'pro' && !subscriptionStatus.isActive && !subscriptionStatus.isInGracePeriod) {
      navigate(redirectPath);
    }
  }, [profile, subscriptionStatus, loading, navigate, requiredPlan, redirectPath]);

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  // Admin bypass
  if (profile?.plan_type === 'admin') {
    return <>{children}</>;
  }

  // Show grace period warning
  if (showGracePeriodWarning && subscriptionStatus.isInGracePeriod) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Your subscription has expired {Math.abs(subscriptionStatus.daysUntilExpiry)} days ago. 
            You have {7 + subscriptionStatus.daysUntilExpiry} days remaining in your grace period.
            <Button 
              className="ml-2" 
              size="sm" 
              onClick={() => navigate('/pro')}
            >
              Renew Now
            </Button>
          </AlertDescription>
        </Alert>
        {children}
      </div>
    );
  }

  // Show expiring soon warning
  if (subscriptionStatus.daysUntilExpiry <= 7 && subscriptionStatus.daysUntilExpiry > 0) {
    return (
      <div className="space-y-4">
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            Your subscription expires in {subscriptionStatus.daysUntilExpiry} days.
            <Button 
              className="ml-2" 
              size="sm" 
              variant="outline"
              onClick={() => navigate('/pro')}
            >
              Renew Subscription
            </Button>
          </AlertDescription>
        </Alert>
        {children}
      </div>
    );
  }

  return <>{children}</>;
};