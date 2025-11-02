import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { plan, amount } = await req.json();
    
    console.log('Creating PayPal order for plan:', plan, 'amount:', amount);

    const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID');
    const PAYPAL_SECRET_KEY = Deno.env.get('PAYPAL_SECRET_KEY');
    const PAYPAL_API = 'https://api-m.paypal.com'; // Use sandbox URL for testing: https://api-m.sandbox.paypal.com

    if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET_KEY) {
      throw new Error('PayPal credentials not configured');
    }

    // Get PayPal access token
    const auth = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET_KEY}`);
    const tokenResponse = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error('PayPal token error:', error);
      throw new Error('Failed to get PayPal access token');
    }

    const { access_token } = await tokenResponse.json();
    console.log('Got PayPal access token');

    // Create order
    const orderResponse = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: amount,
          },
          description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan Subscription`,
        }],
        application_context: {
          return_url: `${req.headers.get('origin')}/payment-success`,
          cancel_url: `${req.headers.get('origin')}/pricing`,
          brand_name: 'Proposal Generator',
          user_action: 'PAY_NOW',
        },
      }),
    });

    if (!orderResponse.ok) {
      const error = await orderResponse.text();
      console.error('PayPal order error:', error);
      throw new Error('Failed to create PayPal order');
    }

    const order = await orderResponse.json();
    console.log('Created PayPal order:', order.id);

    // Get approval URL
    const approvalUrl = order.links.find((link: any) => link.rel === 'approve')?.href;

    return new Response(
      JSON.stringify({ 
        orderId: order.id,
        approvalUrl,
        status: order.status 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});