import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FeedbackRequest {
  project_key: string;
  module_key?: string;
  contact_id?: string;
  persona: 'gestor' | 'usuario_final' | 'parceiro';
  channel: 'inapp' | 'whatsapp' | 'email' | 'api';
  type: 'bug' | 'ideia' | 'duvida' | 'srs' | 'nps' | 'csat' | 'ces' | 'pmf' | 'usability';
  score?: number;
  severity?: 'blocker' | 'high' | 'medium' | 'low' | 'idea';
  verbatim: string;
  context?: Record<string, any>;
  attachments?: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const requestBody: FeedbackRequest = await req.json();
    
    // Validate required fields
    if (!requestBody.project_key || !requestBody.persona || !requestBody.channel || 
        !requestBody.type || !requestBody.verbatim) {
      throw new Error('Missing required fields');
    }

    // Get client IP and user agent for context
    const clientIP = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Rate limiting check
    const { data: rateLimitOk } = await supabase.rpc('check_rate_limit', {
      identifier: clientIP,
      max_requests: 10,
      time_window: '01:00:00'
    });

    if (!rateLimitOk) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded' }), 
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Find project by key (assuming project has a key field or using title)
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('title', requestBody.project_key)
      .maybeSingle();

    if (projectError) {
      console.error('Project lookup error:', projectError);
      throw new Error('Invalid project key');
    }

    if (!project) {
      throw new Error('Project not found');
    }

    // Find module if specified
    let moduleId = null;
    if (requestBody.module_key) {
      const { data: module } = await supabase
        .from('feedback_modules')
        .select('id')
        .eq('project_id', project.id)
        .eq('key', requestBody.module_key)
        .maybeSingle();
      
      moduleId = module?.id || null;
    }

    // Prepare feedback data
    const feedbackData = {
      project_id: project.id,
      module_id: moduleId,
      contact_id: requestBody.contact_id || null,
      persona: requestBody.persona,
      channel: requestBody.channel,
      type: requestBody.type,
      score: requestBody.score || null,
      severity: requestBody.severity || 'medium',
      verbatim: requestBody.verbatim.trim(),
      attachments: JSON.stringify(requestBody.attachments || []),
      context: JSON.stringify({
        ...requestBody.context,
        user_agent: userAgent,
        timestamp: new Date().toISOString(),
        ip_address: clientIP
      }),
      ip_address: clientIP,
      user_agent: userAgent,
      priority_score: calculatePriorityScore(requestBody.type, requestBody.severity || 'medium')
    };

    // Insert feedback
    const { data: feedback, error: insertError } = await supabase
      .from('feedback_entries')
      .insert(feedbackData)
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      throw new Error('Failed to save feedback');
    }

    // Log security event
    await supabase.rpc('log_security_event', {
      event_type: 'feedback_created',
      details: {
        feedback_id: feedback.id,
        type: requestBody.type,
        channel: requestBody.channel,
        project_id: project.id
      },
      ip_address: clientIP,
      user_agent: userAgent
    });

    console.log(`Feedback created: ${feedback.id} for project ${project.id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        feedback_id: feedback.id,
        message: 'Feedback recebido com sucesso!' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201
      }
    );

  } catch (error) {
    console.error('Feedback collection error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        success: false 
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function calculatePriorityScore(type: string, severity: string): number {
  const typeWeights = {
    'bug': 100,
    'duvida': 80,
    'usability': 70,
    'ideia': 60,
    'srs': 50,
    'nps': 30,
    'csat': 30,
    'ces': 25,
    'pmf': 20
  };

  const severityMultipliers = {
    'blocker': 2.0,
    'high': 1.5,
    'medium': 1.0,
    'low': 0.7,
    'idea': 0.5
  };

  const baseScore = typeWeights[type] || 50;
  const multiplier = severityMultipliers[severity] || 1.0;
  
  return Math.round(baseScore * multiplier);
}