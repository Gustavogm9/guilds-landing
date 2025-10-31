import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CampaignExecution {
  id: string;
  campaign_id: string;
  project_id: string;
  contact_id: string;
  channel: string;
  status: string;
  message_sent: string;
  created_at: string;
}

interface Campaign {
  id: string;
  name: string;
  type: string;
  channel: string;
  message_template: string;
  trigger_delay_hours: number;
  is_active: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    console.log('Starting campaign execution process...');

    // Get pending executions with campaign details
    const { data: pendingExecutions, error: executionsError } = await supabase
      .from('feedback_campaign_executions')
      .select(`
        *,
        feedback_campaigns:campaign_id(*),
        crm_contacts:contact_id(*)
      `)
      .eq('status', 'pending')
      .limit(100); // Get more to filter by delay

    if (executionsError) {
      console.error('Error fetching executions:', executionsError);
      throw executionsError;
    }

    console.log(`Found ${pendingExecutions?.length || 0} pending executions`);

    if (!pendingExecutions || pendingExecutions.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No pending executions found',
          processed: 0 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Filter executions that are ready based on trigger_delay_hours
    const now = Date.now();
    const readyExecutions = pendingExecutions.filter((execution) => {
      const campaign = execution.feedback_campaigns;
      if (!campaign) return false;
      
      const createdAt = new Date(execution.created_at).getTime();
      const delayMs = (campaign.trigger_delay_hours || 0) * 60 * 60 * 1000;
      const isReady = (now - createdAt) >= delayMs;
      
      if (!isReady) {
        console.log(`Execution ${execution.id} not ready yet. Delay: ${campaign.trigger_delay_hours}h, Age: ${Math.round((now - createdAt) / (60 * 60 * 1000))}h`);
      }
      
      return isReady;
    });

    console.log(`Found ${pendingExecutions.length} pending, ${readyExecutions.length} ready to process`);

    if (readyExecutions.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No executions ready to process yet',
          processed: 0,
          pending: pendingExecutions.length
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let processedCount = 0;
    let errorCount = 0;

    // Process only first 50 ready executions
    const executionsToProcess = readyExecutions.slice(0, 50);

    for (const execution of executionsToProcess) {
      try {
        console.log(`Processing execution ${execution.id} for campaign ${execution.campaign_id}`);

        const campaign = execution.feedback_campaigns;
        const contact = execution.crm_contacts;

        if (!campaign?.is_active) {
          console.log(`Skipping inactive campaign ${execution.campaign_id}`);
          continue;
        }

        // Process based on channel
        let success = false;
        let errorMessage = null;

        switch (execution.channel) {
          case 'whatsapp':
            success = await processWhatsAppMessage(execution, campaign, contact);
            break;
          case 'email':
            success = await processEmailMessage(execution, campaign, contact);
            break;
          case 'inapp':
            success = await processInAppMessage(execution, campaign, contact);
            break;
          default:
            errorMessage = `Unsupported channel: ${execution.channel}`;
        }

        // Update execution status
        const updateData: any = {
          status: success ? 'sent' : 'failed',
          sent_at: success ? new Date().toISOString() : null,
          error_message: errorMessage
        };

        const { error: updateError } = await supabase
          .from('feedback_campaign_executions')
          .update(updateData)
          .eq('id', execution.id);

        if (updateError) {
          console.error(`Error updating execution ${execution.id}:`, updateError);
          errorCount++;
        } else {
          processedCount++;
          console.log(`Successfully processed execution ${execution.id}`);
        }

      } catch (error) {
        console.error(`Error processing execution ${execution.id}:`, error);
        errorCount++;

        // Update execution with error
        await supabase
          .from('feedback_campaign_executions')
          .update({
            status: 'failed',
            error_message: error instanceof Error ? error.message : String(error)
          })
          .eq('id', execution.id);
      }
    }

    console.log(`Campaign execution completed. Processed: ${processedCount}, Errors: ${errorCount}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: processedCount,
        errors: errorCount,
        message: `Processed ${processedCount} executions with ${errorCount} errors`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Campaign execution error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function processWhatsAppMessage(execution: any, campaign: any, contact: any): Promise<boolean> {
  console.log(`Processing WhatsApp message for contact ${contact?.email || 'unknown'}`);
  
  // TODO: Integrate with WhatsApp Business API
  // For now, just simulate the process
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Update execution with message content
  const messageContent = campaign.message_template
    .replace(/\{name\}/g, contact?.name || 'Cliente')
    .replace(/\{company\}/g, contact?.company || '');

  // Here you would make the actual WhatsApp API call
  console.log(`WhatsApp message would be sent: ${messageContent}`);
  
  return true; // Simulate success
}

async function processEmailMessage(execution: any, campaign: any, contact: any): Promise<boolean> {
  console.log(`Processing email message for contact ${contact?.email || 'unknown'}`);
  
  // TODO: Integrate with email provider (Resend, etc.)
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const messageContent = campaign.message_template
    .replace(/\{name\}/g, contact?.name || 'Cliente')
    .replace(/\{company\}/g, contact?.company || '');

  console.log(`Email would be sent to ${contact?.email}: ${messageContent}`);
  
  return true; // Simulate success
}

async function processInAppMessage(execution: any, campaign: any, contact: any): Promise<boolean> {
  console.log(`Processing in-app message for contact ${contact?.email || 'unknown'}`);
  
  // For in-app messages, we just mark as sent since they're displayed in the UI
  await new Promise(resolve => setTimeout(resolve, 50));
  
  return true;
}