import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { RRule } from 'https://esm.sh/rrule@2.7.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RecurringActivity {
  id: string;
  title: string;
  description: string | null;
  type: string;
  frequency: string;
  interval: number;
  by_weekday: number[] | null;
  by_month_day: number[] | null;
  default_time: string;
  start_date: string;
  end_date: string | null;
  max_occurrences: number | null;
  deal_id: string | null;
  contact_id: string | null;
  created_by: string | null;
  last_generated_date: string | null;
  occurrences_generated: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('🔄 Starting recurring activities generation...');

    // Fetch active recurring activity templates
    const { data: recurrences, error: fetchError } = await supabase
      .from('crm_activity_recurrence')
      .select('*')
      .eq('is_active', true);

    if (fetchError) {
      throw new Error(`Failed to fetch recurrences: ${fetchError.message}`);
    }

    console.log(`Found ${recurrences?.length || 0} active recurring activity templates`);

    const today = new Date();
    const generateUntil = new Date(today);
    generateUntil.setDate(generateUntil.getDate() + 60); // Generate 60 days ahead

    let totalGenerated = 0;

    for (const recurrence of recurrences as RecurringActivity[]) {
      try {
        console.log(`Processing recurrence: ${recurrence.title} (${recurrence.id})`);

        // Build RRule options
        const rruleOptions: any = {
          freq: mapFrequencyToRRule(recurrence.frequency),
          interval: recurrence.interval,
          dtstart: new Date(recurrence.start_date),
        };

        if (recurrence.end_date) {
          rruleOptions.until = new Date(recurrence.end_date);
        }

        if (recurrence.max_occurrences) {
          rruleOptions.count = recurrence.max_occurrences;
        }

        if (recurrence.by_weekday && recurrence.by_weekday.length > 0) {
          rruleOptions.byweekday = recurrence.by_weekday.map((day: number) => {
            // Convert 0=Sunday to RRule format
            return day === 0 ? 6 : day - 1;
          });
        }

        if (recurrence.by_month_day && recurrence.by_month_day.length > 0) {
          rruleOptions.bymonthday = recurrence.by_month_day;
        }

        // Create RRule
        const rule = new RRule(rruleOptions);

        // Get dates from last_generated_date or start_date until generateUntil
        const startFrom = recurrence.last_generated_date 
          ? new Date(recurrence.last_generated_date)
          : new Date(recurrence.start_date);

        const occurrences = rule.between(startFrom, generateUntil, true);

        console.log(`Found ${occurrences.length} potential occurrences to generate`);

        // Check which activities already exist
        const { data: existingActivities } = await supabase
          .from('crm_activities')
          .select('occurrence_date')
          .eq('recurrence_id', recurrence.id)
          .gte('occurrence_date', startFrom.toISOString().split('T')[0])
          .lte('occurrence_date', generateUntil.toISOString().split('T')[0]);

        const existingDates = new Set(
          existingActivities?.map(a => a.occurrence_date) || []
        );

        // Filter out dates that already have activities
        const newOccurrences = occurrences.filter(date => {
          const dateStr = date.toISOString().split('T')[0];
          return !existingDates.has(dateStr);
        });

        console.log(`${newOccurrences.length} new activities to create`);

        // Create new activities
        if (newOccurrences.length > 0) {
          const [hours, minutes] = recurrence.default_time.split(':');
          
          const newActivities = newOccurrences.map(occurrenceDate => {
            const dueDate = new Date(occurrenceDate);
            dueDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

            return {
              recurrence_id: recurrence.id,
              is_recurring: true,
              occurrence_date: occurrenceDate.toISOString().split('T')[0],
              title: recurrence.title,
              description: recurrence.description,
              type: recurrence.type,
              due_date: dueDate.toISOString(),
              completed: false,
              deal_id: recurrence.deal_id,
              contact_id: recurrence.contact_id,
              created_by: recurrence.created_by,
              modified_from_template: false,
            };
          });

          const { error: insertError } = await supabase
            .from('crm_activities')
            .insert(newActivities);

          if (insertError) {
            console.error(`Error inserting activities for recurrence ${recurrence.id}:`, insertError);
            continue;
          }

          // Update recurrence metadata
          await supabase
            .from('crm_activity_recurrence')
            .update({
              last_generated_date: generateUntil.toISOString().split('T')[0],
              occurrences_generated: recurrence.occurrences_generated + newOccurrences.length,
            })
            .eq('id', recurrence.id);

          totalGenerated += newOccurrences.length;
          console.log(`✅ Created ${newOccurrences.length} activities for "${recurrence.title}"`);
        }
      } catch (error) {
        console.error(`Error processing recurrence ${recurrence.id}:`, error);
      }
    }

    console.log(`✅ Generation complete. Total activities created: ${totalGenerated}`);

    return new Response(
      JSON.stringify({
        success: true,
        totalGenerated,
        processedRecurrences: recurrences?.length || 0,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in generate-recurring-activities:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function mapFrequencyToRRule(frequency: string): number {
  const RRuleFreq = RRule;
  switch (frequency) {
    case 'daily':
      return RRuleFreq.DAILY;
    case 'weekly':
    case 'biweekly':
      return RRuleFreq.WEEKLY;
    case 'monthly':
      return RRuleFreq.MONTHLY;
    case 'quarterly':
      return RRuleFreq.MONTHLY; // Will use interval of 3
    case 'yearly':
      return RRuleFreq.YEARLY;
    default:
      return RRuleFreq.DAILY;
  }
}
