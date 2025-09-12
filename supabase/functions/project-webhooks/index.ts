import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WebhookEvent {
  id: string;
  project_id: string;
  event_type: string;
  payload: any;
  webhook_url?: string;
  retry_count: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get pending webhook events
    const { data: events, error } = await supabase
      .from('project_webhook_events')
      .select('*')
      .eq('status', 'pending')
      .lt('retry_count', 3)
      .order('created_at', { ascending: true })
      .limit(10);

    if (error) {
      console.error('Error fetching webhook events:', error);
      throw error;
    }

    console.log(`Processing ${events?.length || 0} webhook events`);

    const results = [];

    for (const event of events || []) {
      try {
        // Get webhook URL from project settings or use default
        const webhookUrl = event.webhook_url || await getProjectWebhookUrl(event.project_id);
        
        if (!webhookUrl) {
          console.log(`No webhook URL configured for project ${event.project_id}`);
          
          // Mark as sent since no webhook is configured
          await supabase
            .from('project_webhook_events')
            .update({
              status: 'sent',
              sent_at: new Date().toISOString(),
              response_code: 0,
              response_body: 'No webhook URL configured'
            })
            .eq('id', event.id);

          results.push({
            id: event.id,
            status: 'skipped',
            reason: 'No webhook URL configured'
          });
          continue;
        }

        // Send webhook
        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Guilds-Webhook/1.0',
            'X-Event-Type': event.event_type,
            'X-Project-ID': event.project_id,
          },
          body: JSON.stringify({
            event_type: event.event_type,
            project_id: event.project_id,
            timestamp: new Date().toISOString(),
            data: event.payload
          })
        });

        const responseText = await webhookResponse.text();

        console.log(`Webhook sent to ${webhookUrl}:`, {
          status: webhookResponse.status,
          response: responseText.substring(0, 200)
        });

        // Update webhook event status
        await supabase
          .from('project_webhook_events')
          .update({
            status: webhookResponse.ok ? 'sent' : 'failed',
            sent_at: new Date().toISOString(),
            response_code: webhookResponse.status,
            response_body: responseText.substring(0, 1000), // Limit response body size
            retry_count: event.retry_count + (webhookResponse.ok ? 0 : 1)
          })
          .eq('id', event.id);

        results.push({
          id: event.id,
          status: webhookResponse.ok ? 'sent' : 'failed',
          response_code: webhookResponse.status,
          webhook_url: webhookUrl
        });

      } catch (webhookError: any) {
        console.error('Error sending webhook:', webhookError);

        // Update retry count and status
        await supabase
          .from('project_webhook_events')
          .update({
            status: event.retry_count >= 2 ? 'failed' : 'pending',
            retry_count: event.retry_count + 1,
            response_body: webhookError.message
          })
          .eq('id', event.id);

        results.push({
          id: event.id,
          status: 'failed',
          error: webhookError.message
        });
      }
    }

    return new Response(JSON.stringify({
      processed: results.length,
      results
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in project-webhooks function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

async function getProjectWebhookUrl(projectId: string): Promise<string | null> {
  try {
    // This could be extended to store webhook URLs in project settings
    // For now, return null - webhooks need to be configured per event
    return null;
  } catch (error) {
    console.error('Error getting webhook URL:', error);
    return null;
  }
}

serve(handler);