import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { orderId, userId, planId, planName } = await req.json();

    console.log('Processing payment completion:', { orderId, userId, planId, planName });

    // Verify the order with PayPal
    const paypalAuth = btoa(`${Deno.env.get('PAYPAL_CLIENT_ID')}:${Deno.env.get('PAYPAL_SECRET_KEY')}`);
    const orderResponse = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}`, {
      headers: {
        'Authorization': `Basic ${paypalAuth}`,
        'Content-Type': 'application/json',
      },
    });

    const orderData = await orderResponse.json();
    console.log('PayPal order status:', orderData.status);

    if (orderData.status === 'COMPLETED') {
      // Create or update subscription
      const { data, error } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: userId,
          plan_id: planId,
          plan_name: planName,
          status: 'active',
          paypal_subscription_id: orderId,
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error creating subscription:', error);
        throw error;
      }

      console.log('Subscription created successfully:', data);

      return new Response(
        JSON.stringify({ success: true, message: 'Subscription activated' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, message: 'Payment not completed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );

  } catch (error) {
    console.error('Error processing webhook:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
