import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    console.log('🔔 Starting CRM notification processor...');

    // Execute notification functions
    const results = {
      overdueFollowUps: { success: false, error: null as string | null },
      hotLeads: { success: false, error: null as string | null },
      staleDeals: { success: false, error: null as string | null }
    };

    // 1. Check for overdue follow-ups
    try {
      const { error } = await supabaseClient.rpc('notify_overdue_follow_ups');
      if (error) throw error;
      results.overdueFollowUps.success = true;
      console.log('✅ Processed overdue follow-ups');
    } catch (error) {
      results.overdueFollowUps.error = error.message;
      console.error('❌ Error processing overdue follow-ups:', error);
    }

    // 2. Check for hot leads
    try {
      const { error } = await supabaseClient.rpc('notify_hot_leads');
      if (error) throw error;
      results.hotLeads.success = true;
      console.log('✅ Processed hot leads');
    } catch (error) {
      results.hotLeads.error = error.message;
      console.error('❌ Error processing hot leads:', error);
    }

    // 3. Check for stale deals
    try {
      const { error } = await supabaseClient.rpc('notify_stale_deals');
      if (error) throw error;
      results.staleDeals.success = true;
      console.log('✅ Processed stale deals');
    } catch (error) {
      results.staleDeals.error = error.message;
      console.error('❌ Error processing stale deals:', error);
    }

    // Get notification count
    const { count } = await supabaseClient
      .from('crm_notifications')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    console.log(`📊 Total notifications created in last 24h: ${count}`);

    return new Response(
      JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        results,
        notificationsLast24h: count
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('💥 Fatal error in notification processor:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
