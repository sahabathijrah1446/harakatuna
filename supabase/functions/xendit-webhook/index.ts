import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-callback-token",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[XENDIT-WEBHOOK] ${step}${detailsStr}`);
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
    logStep("Webhook received");

    // Verify webhook token (optional security measure)
    const callbackToken = req.headers.get("x-callback-token");
    const expectedToken = Deno.env.get("XENDIT_WEBHOOK_TOKEN");
    
    if (expectedToken && callbackToken !== expectedToken) {
      logStep("Invalid webhook token");
      return new Response(JSON.stringify({ error: "Invalid webhook token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = await req.json();
    logStep("Payload received", { eventType: payload.event, invoiceId: payload.id });

    // Handle different Xendit events
    if (payload.event === "invoice.paid") {
      await handleInvoicePaid(supabaseClient, payload);
    } else if (payload.event === "invoice.expired") {
      await handleInvoiceExpired(supabaseClient, payload);
    } else if (payload.event === "invoice.failed") {
      await handleInvoiceFailed(supabaseClient, payload);
    }

    return new Response(JSON.stringify({ success: true }), {
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

async function handleInvoicePaid(supabaseClient: any, payload: any) {
  logStep("Processing paid invoice", { invoiceId: payload.id });
  
  const customerEmail = payload.payer_email;
  if (!customerEmail) {
    logStep("No customer email found in payload");
    return;
  }

  // Calculate subscription end date (30 days from now)
  const subscriptionEndDate = new Date();
  subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 30);

  // Update user profile
  const { error } = await supabaseClient
    .from('profiles')
    .update({
      plan_type: 'pro',
      payment_status: 'active',
      subscription_end_date: subscriptionEndDate.toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('user_id', payload.external_id); // Assuming external_id contains user_id

  if (error) {
    logStep("Error updating profile", { error: error.message });
    throw error;
  }

  logStep("Profile updated successfully", { 
    userId: payload.external_id, 
    endDate: subscriptionEndDate.toISOString() 
  });
}

async function handleInvoiceExpired(supabaseClient: any, payload: any) {
  logStep("Processing expired invoice", { invoiceId: payload.id });
  
  // Update payment status but keep plan_type as pro for grace period
  const { error } = await supabaseClient
    .from('profiles')
    .update({
      payment_status: 'expired',
      updated_at: new Date().toISOString()
    })
    .eq('user_id', payload.external_id);

  if (error) {
    logStep("Error updating expired status", { error: error.message });
    throw error;
  }

  logStep("Expired status updated", { userId: payload.external_id });
}

async function handleInvoiceFailed(supabaseClient: any, payload: any) {
  logStep("Processing failed invoice", { invoiceId: payload.id });
  
  // Update payment status to failed
  const { error } = await supabaseClient
    .from('profiles')
    .update({
      payment_status: 'failed',
      updated_at: new Date().toISOString()
    })
    .eq('user_id', payload.external_id);

  if (error) {
    logStep("Error updating failed status", { error: error.message });
    throw error;
  }

  logStep("Failed status updated", { userId: payload.external_id });
}
