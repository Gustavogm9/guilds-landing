-- Create enum for recurrence frequency
CREATE TYPE public.recurrence_frequency AS ENUM (
  'daily',
  'weekly', 
  'biweekly',
  'monthly',
  'quarterly',
  'yearly',
  'custom'
);

-- Create table for recurring activity templates
CREATE TABLE public.crm_activity_recurrence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic info
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'note',
  
  -- Recurrence pattern
  frequency public.recurrence_frequency NOT NULL DEFAULT 'weekly',
  interval INTEGER NOT NULL DEFAULT 1,
  
  -- Advanced configuration (stored as arrays)
  by_weekday INTEGER[], -- 0=Sunday, 1=Monday, ..., 6=Saturday
  by_month_day INTEGER[], -- 1-31
  by_set_pos INTEGER[], -- For "first Monday", "last Friday", etc
  
  -- Time configuration
  default_time TIME NOT NULL DEFAULT '09:00:00',
  
  -- Start and end configuration
  start_date DATE NOT NULL,
  end_date DATE,
  max_occurrences INTEGER,
  
  -- Relationships
  deal_id UUID REFERENCES public.crm_deals(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id),
  
  -- Control fields
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_generated_date DATE,
  occurrences_generated INTEGER NOT NULL DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- At least one relationship must exist
  CHECK (deal_id IS NOT NULL OR contact_id IS NOT NULL)
);

-- Add columns to crm_activities for recurrence support
ALTER TABLE public.crm_activities
ADD COLUMN recurrence_id UUID REFERENCES public.crm_activity_recurrence(id) ON DELETE SET NULL,
ADD COLUMN is_recurring BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN occurrence_date DATE,
ADD COLUMN modified_from_template BOOLEAN NOT NULL DEFAULT false;

-- Create indexes for performance
CREATE INDEX idx_activity_recurrence_active ON public.crm_activity_recurrence(is_active) WHERE is_active = true;
CREATE INDEX idx_activity_recurrence_deal ON public.crm_activity_recurrence(deal_id) WHERE deal_id IS NOT NULL;
CREATE INDEX idx_activity_recurrence_contact ON public.crm_activity_recurrence(contact_id) WHERE contact_id IS NOT NULL;
CREATE INDEX idx_activity_recurrence_next_gen ON public.crm_activity_recurrence(last_generated_date, is_active) WHERE is_active = true;
CREATE INDEX idx_activities_recurrence ON public.crm_activities(recurrence_id) WHERE recurrence_id IS NOT NULL;
CREATE INDEX idx_activities_occurrence_date ON public.crm_activities(occurrence_date) WHERE occurrence_date IS NOT NULL;

-- Enable RLS
ALTER TABLE public.crm_activity_recurrence ENABLE ROW LEVEL SECURITY;

-- RLS Policies for crm_activity_recurrence
CREATE POLICY "Only authenticated users can manage recurring activities"
ON public.crm_activity_recurrence
FOR ALL
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Helper function to calculate next occurrence date
CREATE OR REPLACE FUNCTION public.calculate_next_occurrence(
  p_frequency public.recurrence_frequency,
  p_interval INTEGER,
  p_current_date DATE,
  p_by_weekday INTEGER[],
  p_by_month_day INTEGER[]
)
RETURNS DATE
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_next_date DATE;
  v_current_weekday INTEGER;
BEGIN
  CASE p_frequency
    WHEN 'daily' THEN
      v_next_date := p_current_date + (p_interval || ' days')::INTERVAL;
      
    WHEN 'weekly', 'biweekly' THEN
      IF p_by_weekday IS NOT NULL AND array_length(p_by_weekday, 1) > 0 THEN
        -- Find next matching weekday
        v_current_weekday := EXTRACT(DOW FROM p_current_date);
        v_next_date := p_current_date + 1;
        
        WHILE NOT (EXTRACT(DOW FROM v_next_date)::INTEGER = ANY(p_by_weekday)) LOOP
          v_next_date := v_next_date + 1;
        END LOOP;
      ELSE
        -- Default to same day next week/biweek
        v_next_date := p_current_date + (p_interval * 7 || ' days')::INTERVAL;
      END IF;
      
    WHEN 'monthly' THEN
      IF p_by_month_day IS NOT NULL AND array_length(p_by_month_day, 1) > 0 THEN
        -- Use first day from by_month_day array
        v_next_date := (DATE_TRUNC('month', p_current_date) + (p_interval || ' months')::INTERVAL)::DATE + (p_by_month_day[1] - 1);
      ELSE
        -- Same day next month
        v_next_date := p_current_date + (p_interval || ' months')::INTERVAL;
      END IF;
      
    WHEN 'quarterly' THEN
      v_next_date := p_current_date + (p_interval * 3 || ' months')::INTERVAL;
      
    WHEN 'yearly' THEN
      v_next_date := p_current_date + (p_interval || ' years')::INTERVAL;
      
    ELSE
      -- Custom or unknown, default to daily
      v_next_date := p_current_date + (p_interval || ' days')::INTERVAL;
  END CASE;
  
  RETURN v_next_date;
END;
$$;

-- Trigger to update updated_at on crm_activity_recurrence
CREATE TRIGGER update_crm_activity_recurrence_updated_at
BEFORE UPDATE ON public.crm_activity_recurrence
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();