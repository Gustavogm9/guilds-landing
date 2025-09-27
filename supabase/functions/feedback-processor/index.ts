import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Process new feedback entries that need analysis
    await processNewFeedback(supabase);
    
    // Update daily metrics
    await updateDailyMetrics(supabase);
    
    // Process pending campaign executions
    await processCampaignExecutions(supabase);

    return new Response(
      JSON.stringify({ success: true, message: 'Processing completed' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Feedback processing error:', error);
    
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function processNewFeedback(supabase: any) {
  // Get feedback entries from last hour that need processing
  const { data: newFeedback, error } = await supabase
    .from('feedback_entries')
    .select('*')
    .eq('status', 'new')
    .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching new feedback:', error);
    return;
  }

  console.log(`Processing ${newFeedback?.length || 0} new feedback entries`);

  for (const feedback of newFeedback || []) {
    try {
      // Auto-suggest RICE scores based on type and severity
      const riceScores = calculateRiceScores(feedback);
      
      // Update feedback with suggested scores
      await supabase
        .from('feedback_entries')
        .update({
          rice_reach: riceScores.reach,
          rice_impact: riceScores.impact,
          rice_confidence: riceScores.confidence,
          rice_effort: riceScores.effort,
          status: 'triaged'
        })
        .eq('id', feedback.id);

      // Create ticket for urgent issues
      if (feedback.severity === 'blocker' || feedback.severity === 'high') {
        await createTicketFromFeedback(supabase, feedback);
      }

      console.log(`Processed feedback ${feedback.id}`);
    } catch (err) {
      console.error(`Error processing feedback ${feedback.id}:`, err);
    }
  }
}

async function updateDailyMetrics(supabase: any) {
  const today = new Date().toISOString().split('T')[0];
  
  // Get all active projects
  const { data: projects } = await supabase
    .from('projects')
    .select('id')
    .eq('is_active', true);

  for (const project of projects || []) {
    try {
      // Count feedback by type for today
      const { data: feedbackStats } = await supabase
        .from('feedback_entries')
        .select('type, channel, score')
        .eq('project_id', project.id)
        .gte('created_at', today)
        .lt('created_at', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      // Count tickets created and closed today
      const { data: ticketStats } = await supabase
        .from('feedback_tickets')
        .select('status, created_at, closed_at')
        .eq('project_id', project.id)
        .gte('created_at', today);

      const metrics = calculateDailyMetrics(feedbackStats || [], ticketStats || []);
      
      // Upsert metrics
      await supabase
        .from('feedback_metrics_daily')
        .upsert({
          project_id: project.id,
          date: today,
          ...metrics
        }, {
          onConflict: 'project_id,date'
        });

    } catch (err) {
      console.error(`Error updating metrics for project ${project.id}:`, err);
    }
  }
}

async function processCampaignExecutions(supabase: any) {
  // Get pending campaign executions
  const { data: executions } = await supabase
    .from('feedback_campaign_executions')
    .select(`
      *,
      campaign:feedback_campaigns(*)
    `)
    .eq('status', 'pending')
    .limit(50);

  for (const execution of executions || []) {
    try {
      // Simulate sending message (integration with WhatsApp/Email would go here)
      console.log(`Processing campaign execution ${execution.id} via ${execution.channel}`);
      
      // Update status to sent
      await supabase
        .from('feedback_campaign_executions')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString()
        })
        .eq('id', execution.id);

    } catch (err) {
      console.error(`Error processing campaign execution ${execution.id}:`, err);
      
      // Mark as failed
      await supabase
        .from('feedback_campaign_executions')
        .update({
          status: 'failed',
          error_message: err instanceof Error ? err.message : String(err)
        })
        .eq('id', execution.id);
    }
  }
}

function calculateRiceScores(feedback: any) {
  // Auto-suggest RICE scores based on feedback type and severity
  const typeReach = {
    'bug': 8,
    'ideia': 5,
    'duvida': 6,
    'usability': 7,
    'srs': 4,
    'nps': 3,
    'csat': 3,
    'ces': 3,
    'pmf': 2
  };

  const severityImpact = {
    'blocker': 3,
    'high': 3,
    'medium': 2,
    'low': 1,
    'idea': 2
  };

  const typeEffort = {
    'bug': 3,
    'ideia': 6,
    'duvida': 2,
    'usability': 4,
    'srs': 1,
    'nps': 1,
    'csat': 1,
    'ces': 1,
    'pmf': 1
  };

  return {
    reach: (typeReach as any)[feedback.type] || 5,
    impact: (severityImpact as any)[feedback.severity] || 2,
    confidence: 70, // Default confidence
    effort: (typeEffort as any)[feedback.type] || 4
  };
}

async function createTicketFromFeedback(supabase: any, feedback: any) {
  const ticket = {
    project_id: feedback.project_id,
    feedback_id: feedback.id,
    contact_id: feedback.contact_id,
    subject: `${feedback.type.toUpperCase()}: ${feedback.verbatim.substring(0, 50)}...`,
    description: feedback.verbatim,
    priority: feedback.severity === 'blocker' ? 'urgent' : 'high',
    status: 'open'
  };

  const { error } = await supabase
    .from('feedback_tickets')
    .insert(ticket);

  if (error) {
    console.error('Error creating ticket:', error);
  } else {
    console.log(`Created ticket for feedback ${feedback.id}`);
  }
}

function calculateDailyMetrics(feedbackStats: any[], ticketStats: any[]) {
  const totalFeedback = feedbackStats.length;
  const bugCount = feedbackStats.filter(f => f.type === 'bug').length;
  const ideaCount = feedbackStats.filter(f => f.type === 'ideia').length;
  const questionCount = feedbackStats.filter(f => f.type === 'duvida').length;

  // Calculate NPS (Net Promoter Score) from NPS feedback
  const npsResponses = feedbackStats.filter(f => f.type === 'nps' && f.score !== null);
  let npsScore = null;
  if (npsResponses.length > 0) {
    const promoters = npsResponses.filter(f => f.score >= 9).length;
    const detractors = npsResponses.filter(f => f.score <= 6).length;
    npsScore = ((promoters - detractors) / npsResponses.length) * 100;
  }

  // Calculate CSAT from CSAT feedback  
  const csatResponses = feedbackStats.filter(f => f.type === 'csat' && f.score !== null);
  let csatScore = null;
  if (csatResponses.length > 0) {
    csatScore = csatResponses.reduce((sum, f) => sum + f.score, 0) / csatResponses.length;
  }

  // Channel breakdown
  const inappCount = feedbackStats.filter(f => f.channel === 'inapp').length;
  const whatsappCount = feedbackStats.filter(f => f.channel === 'whatsapp').length;
  const emailCount = feedbackStats.filter(f => f.channel === 'email').length;

  // Ticket metrics
  const ticketsCreatedToday = ticketStats.filter(t => t.created_at >= new Date().toISOString().split('T')[0]).length;
  const ticketsClosedToday = ticketStats.filter(t => t.closed_at && t.closed_at >= new Date().toISOString().split('T')[0]).length;

  return {
    total_feedback: totalFeedback,
    bugs_count: bugCount,
    ideas_count: ideaCount,
    questions_count: questionCount,
    nps_score: npsScore,
    nps_responses: npsResponses.length,
    csat_score: csatScore,
    csat_responses: csatResponses.length,
    tickets_created: ticketsCreatedToday,
    tickets_closed: ticketsClosedToday,
    inapp_feedback: inappCount,
    whatsapp_feedback: whatsappCount,
    email_feedback: emailCount
  };
}