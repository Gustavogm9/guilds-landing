// Update the edge functions to include performance logging
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0'
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailNotification {
  id: string;
  project_id: string;
  recipient_email: string;
  recipient_type: string;
  notification_type: string;
  subject: string;
  content: string;
  metadata?: any;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Log operation start
  const { data: logData } = await supabase.rpc('log_system_operation', {
    p_operation_type: 'email_batch',
    p_metadata: { scheduled: req.headers.get('x-scheduled') === 'true' }
  });
  
  const logId = logData;
  let processedCount = 0;
  let successCount = 0;
  let errorCount = 0;

  try {
    // Get pending email notifications
    const { data: notifications, error } = await supabase
      .from('project_email_notifications')
      .select('*')
      .eq('status', 'pending')
      .lt('retry_count', 3)
      .order('created_at', { ascending: true })
      .limit(10);

    if (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }

    console.log(`Processing ${notifications?.length || 0} email notifications`);
    processedCount = notifications?.length || 0;

    const results = [];

    for (const notification of notifications || []) {
      try {
        // Send email using Resend
        const emailResponse = await resend.emails.send({
          from: "Guilds <projetos@guilds.com.br>",
          to: [notification.recipient_email],
          subject: notification.subject,
          html: formatEmailContent(notification),
        });

        console.log('Email sent successfully:', emailResponse);

        // Update notification status to sent
        await supabase
          .from('project_email_notifications')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString()
          })
          .eq('id', notification.id);

        successCount++;
        results.push({
          id: notification.id,
          status: 'sent',
          email_id: emailResponse.data?.id
        });

      } catch (emailError) {
        console.error('Error sending email:', emailError);
        errorCount++;

        // Update retry count and status
        await supabase
          .from('project_email_notifications')
          .update({
            status: notification.retry_count >= 2 ? 'failed' : 'pending',
            retry_count: notification.retry_count + 1
          })
          .eq('id', notification.id);

        results.push({
          id: notification.id,
          status: 'failed',
          error: emailError instanceof Error ? emailError.message : 'Unknown error'
        });
      }
    }

    // Complete operation log
    if (logId) {
      await supabase.rpc('complete_system_operation', {
        p_log_id: logId,
        p_records_processed: processedCount,
        p_success_count: successCount,
        p_error_count: errorCount,
        p_status: 'completed'
      });
    }

    return new Response(JSON.stringify({
      processed: processedCount,
      successful: successCount,
      failed: errorCount,
      results
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error) {
    console.error("Error in project-email-service function:", error);
    
    // Complete operation log with error
    if (logId) {
      await supabase.rpc('complete_system_operation', {
        p_log_id: logId,
        p_records_processed: processedCount,
        p_success_count: successCount,
        p_error_count: errorCount + 1,
        p_status: 'failed'
      });
    }
    
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

function formatEmailContent(notification: EmailNotification): string {
  const baseStyles = `
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(135deg, hsl(240, 85%, 55%), hsl(165, 85%, 45%)); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
      .content { background: white; padding: 30px 20px; border: 1px solid #e5e7eb; }
      .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; color: #6b7280; font-size: 14px; }
      .button { display: inline-block; background: hsl(240, 85%, 55%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
      .alert { background: #fef3cd; border: 1px solid #fad02c; padding: 15px; border-radius: 6px; margin: 20px 0; }
    </style>
  `;

  let portalLink = '';
  if (notification.metadata?.token) {
    portalLink = `<a href="https://guilds.com.br/portal/cliente?token=${notification.metadata.token}" class="button">Acessar Portal do Cliente</a>`;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${notification.subject}</title>
      ${baseStyles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Guilds</h1>
          <p>Sistemas inteligentes, resultados reais.</p>
        </div>
        <div class="content">
          ${notification.content.replace(/\n/g, '<br>')}
          ${portalLink}
          ${notification.notification_type.includes('client_action') ? 
            '<div class="alert">⚠️ Esta mensagem requer sua atenção.</div>' : ''}
        </div>
        <div class="footer">
          <p>Guilds - Tecnologia e Inovação</p>
          <p>Este é um email automático do sistema de gerenciamento de projetos.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

serve(handler);