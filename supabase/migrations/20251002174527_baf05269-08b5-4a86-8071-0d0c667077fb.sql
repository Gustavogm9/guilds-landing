-- Fix security warning: add search_path to calculate_next_occurrence function
DROP FUNCTION IF EXISTS public.calculate_next_occurrence(public.recurrence_frequency, INTEGER, DATE, INTEGER[], INTEGER[]);

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
SECURITY DEFINER
SET search_path = public
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
        v_current_weekday := EXTRACT(DOW FROM p_current_date);
        v_next_date := p_current_date + 1;
        
        WHILE NOT (EXTRACT(DOW FROM v_next_date)::INTEGER = ANY(p_by_weekday)) LOOP
          v_next_date := v_next_date + 1;
        END LOOP;
      ELSE
        v_next_date := p_current_date + (p_interval * 7 || ' days')::INTERVAL;
      END IF;
      
    WHEN 'monthly' THEN
      IF p_by_month_day IS NOT NULL AND array_length(p_by_month_day, 1) > 0 THEN
        v_next_date := (DATE_TRUNC('month', p_current_date) + (p_interval || ' months')::INTERVAL)::DATE + (p_by_month_day[1] - 1);
      ELSE
        v_next_date := p_current_date + (p_interval || ' months')::INTERVAL;
      END IF;
      
    WHEN 'quarterly' THEN
      v_next_date := p_current_date + (p_interval * 3 || ' months')::INTERVAL;
      
    WHEN 'yearly' THEN
      v_next_date := p_current_date + (p_interval || ' years')::INTERVAL;
      
    ELSE
      v_next_date := p_current_date + (p_interval || ' days')::INTERVAL;
  END CASE;
  
  RETURN v_next_date;
END;
$$;