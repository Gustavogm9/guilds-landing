import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ResendWebhookEvent {
  type: string;
  created_at: string;
  data: {
    email_id: string;
    from: string;
    to: string[];
    subject: string;
    click?: {
      link: string;
      user_agent: string;
      ip: string;
    };
    open?: {
      user_agent: string;
      ip: string;
    };
    bounce?: {
      type: string;
    };
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const event: ResendWebhookEvent = await req.json();

    console.log("Received Resend webhook event:", event.type);

    // Extract enrollment_id from email metadata (stored in email subject or custom header)
    const emailId = event.data.email_id;
    const subject = event.data.subject;
    
    // Try to find enrollment from subject pattern or email metadata
    // Format: [ENROLLMENT:uuid] Subject
    const enrollmentMatch = subject.match(/\[ENROLLMENT:([a-f0-9-]+)\]/);
    if (!enrollmentMatch) {
      console.log("No enrollment ID found in subject, skipping tracking");
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const enrollmentId = enrollmentMatch[1];

    // Get enrollment details
    const { data: enrollment, error: enrollmentError } = await supabase
      .from("nurturing_enrollments")
      .select("id, contact_id, current_step_index")
      .eq("id", enrollmentId)
      .single();

    if (enrollmentError || !enrollment) {
      console.error("Enrollment not found:", enrollmentError);
      return new Response(JSON.stringify({ error: "Enrollment not found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      });
    }

    // Map Resend event types to our event types
    const eventTypeMap: Record<string, string> = {
      "email.sent": "sent",
      "email.delivered": "delivered",
      "email.delivery_delayed": "delivered",
      "email.opened": "opened",
      "email.clicked": "clicked",
      "email.bounced": "bounced",
      "email.complained": "complained",
    };

    const eventType = eventTypeMap[event.type];
    if (!eventType) {
      console.log("Unhandled event type:", event.type);
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Insert tracking event
    const trackingEvent = {
      enrollment_id: enrollmentId,
      contact_id: enrollment.contact_id,
      step_index: enrollment.current_step_index,
      event_type: eventType,
      resend_event_id: emailId,
      email_subject: subject.replace(/\[ENROLLMENT:[a-f0-9-]+\]\s*/, ""),
      link_clicked: event.data.click?.link || null,
      user_agent: event.data.click?.user_agent || event.data.open?.user_agent || null,
      ip_address: event.data.click?.ip || event.data.open?.ip || null,
      metadata: event.data,
    };

    const { error: insertError } = await supabase
      .from("email_tracking_events")
      .insert(trackingEvent);

    if (insertError) {
      console.error("Error inserting tracking event:", insertError);
      return new Response(JSON.stringify({ error: insertError.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    // Update automation_metrics
    const today = new Date().toISOString().split("T")[0];
    
    // Get sequence_id from enrollment
    const { data: enrollmentData } = await supabase
      .from("nurturing_enrollments")
      .select("sequence_id, contact_id")
      .eq("id", enrollmentId)
      .single();

    if (enrollmentData) {
      const { data: existingMetric } = await supabase
        .from("automation_metrics")
        .select("*")
        .eq("date", today)
        .eq("contact_id", enrollmentData.contact_id)
        .single();

      const updates: any = {};
      
      if (eventType === "sent") updates.emails_sent = (existingMetric?.emails_sent || 0) + 1;
      if (eventType === "opened") updates.emails_opened = (existingMetric?.emails_opened || 0) + 1;
      if (eventType === "clicked") updates.emails_clicked = (existingMetric?.emails_clicked || 0) + 1;

      if (Object.keys(updates).length > 0) {
        if (existingMetric) {
          await supabase
            .from("automation_metrics")
            .update(updates)
            .eq("id", existingMetric.id);
        } else {
          await supabase
            .from("automation_metrics")
            .insert({
              date: today,
              contact_id: enrollmentData.contact_id,
              ...updates,
            });
        }
      }
    }

    console.log(`Tracking event ${eventType} recorded for enrollment ${enrollmentId}`);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Error in email-tracking-webhook:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);
