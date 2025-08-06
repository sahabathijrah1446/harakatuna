import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-EXPIRED-SUBS] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    logStep("Starting subscription check");

    const now = new Date().toISOString();
    const gracePeriodDate = new Date();
    gracePeriodDate.setDate(gracePeriodDate.getDate() - 7); // 7-day grace period

    // Find users with expired subscriptions beyond grace period
    const { data: expiredUsers, error: fetchError } = await supabaseClient
      .from('profiles')
      .select('user_id, display_name, subscription_end_date, payment_status')
      .eq('plan_type', 'pro')
      .lt('subscription_end_date', gracePeriodDate.toISOString());

    if (fetchError) {
      logStep("Error fetching expired users", { error: fetchError.message });
      throw fetchError;
    }

    if (!expiredUsers || expiredUsers.length === 0) {
      logStep("No expired subscriptions found");
      return new Response(JSON.stringify({ 
        success: true, 
        message: "No expired subscriptions found",
        processed: 0 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    logStep("Found expired users", { count: expiredUsers.length });

    // Update expired users to free plan
    const userIds = expiredUsers.map(user => user.user_id);
    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update({
        plan_type: 'free',
        payment_status: 'expired',
        updated_at: now
      })
      .in('user_id', userIds);

    if (updateError) {
      logStep("Error updating expired users", { error: updateError.message });
      throw updateError;
    }

    // Log each downgrade for monitoring
    for (const user of expiredUsers) {
      logStep("User downgraded", {
        userId: user.user_id,
        displayName: user.display_name,
        expirationDate: user.subscription_end_date,
        previousStatus: user.payment_status
      });
    }

    // Find users in grace period and send warnings
    const gracePeriodUsers = await findGracePeriodUsers(supabaseClient, now);
    logStep("Grace period users found", { count: gracePeriodUsers?.length || 0 });

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Processed ${expiredUsers.length} expired subscriptions`,
      expired_users: expiredUsers.length,
      grace_period_users: gracePeriodUsers?.length || 0
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

async function findGracePeriodUsers(supabaseClient: any, now: string) {
  try {
    const { data: gracePeriodUsers, error } = await supabaseClient
      .from('profiles')
      .select('user_id, display_name, subscription_end_date, payment_status')
      .eq('plan_type', 'pro')
      .lt('subscription_end_date', now);

    if (error) {
      logStep("Error fetching grace period users", { error: error.message });
      return [];
    }

    return gracePeriodUsers || [];
  } catch (error) {
    logStep("Error in findGracePeriodUsers", { error });
    return [];
  }
}