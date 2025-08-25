import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ConfirmRequest {
  token: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    if (req.method === 'GET') {
      // Handle confirmation via URL link
      const url = new URL(req.url);
      const token = url.searchParams.get('token');
      
      if (!token) {
        return new Response(
          JSON.stringify({ error: 'Token is required' }), 
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Find subscription by confirmation token
      const { data: subscription, error: findError } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .eq('confirmation_token', token)
        .eq('status', 'pending')
        .maybeSingle();

      if (findError || !subscription) {
        return new Response(
          JSON.stringify({ error: 'Invalid or expired token' }), 
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Confirm subscription
      const { error: updateError } = await supabase
        .from('newsletter_subscriptions')
        .update({
          status: 'active',
          confirmed_at: new Date().toISOString(),
          confirmation_token: null, // Clear token after use
        })
        .eq('id', subscription.id);

      if (updateError) {
        console.error('Error confirming subscription:', updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to confirm subscription' }), 
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Return success response with redirect HTML
      const htmlResponse = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Newsletter Confirmada - Guilds</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f8fafc; }
            .container { max-width: 600px; margin: 50px auto; background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden; }
            .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 40px 30px; text-align: center; }
            .content { padding: 40px 30px; text-align: center; }
            .success-icon { width: 64px; height: 64px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: white; font-size: 24px; }
            .btn { background: #3b82f6; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; display: inline-block; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Newsletter Confirmada!</h1>
            </div>
            <div class="content">
              <div class="success-icon">✓</div>
              <h2>Obrigado por confirmar sua inscrição!</h2>
              <p>Seu e-mail foi confirmado com sucesso. A partir de agora você receberá nossas novidades e insights sobre tecnologia e inovação.</p>
              <a href="https://guilds.com.br" class="btn">Voltar ao Site</a>
            </div>
          </div>
          <script>
            setTimeout(() => {
              window.location.href = 'https://guilds.com.br';
            }, 5000);
          </script>
        </body>
        </html>
      `;

      return new Response(htmlResponse, {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    if (req.method === 'POST') {
      // Handle confirmation via API
      const { token }: ConfirmRequest = await req.json();

      if (!token) {
        return new Response(
          JSON.stringify({ error: 'Token is required' }), 
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Same logic as GET but return JSON
      const { data: subscription, error: findError } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .eq('confirmation_token', token)
        .eq('status', 'pending')
        .maybeSingle();

      if (findError || !subscription) {
        return new Response(
          JSON.stringify({ error: 'Invalid or expired token' }), 
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { error: updateError } = await supabase
        .from('newsletter_subscriptions')
        .update({
          status: 'active',
          confirmed_at: new Date().toISOString(),
          confirmation_token: null,
        })
        .eq('id', subscription.id);

      if (updateError) {
        console.error('Error confirming subscription:', updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to confirm subscription' }), 
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Newsletter subscription confirmed successfully',
          email: subscription.email
        }), 
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }), 
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in newsletter-confirm function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});