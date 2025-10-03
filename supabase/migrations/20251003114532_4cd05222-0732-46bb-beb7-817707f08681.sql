-- Create user_crm_preferences table
CREATE TABLE public.user_crm_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  
  -- Pipeline preferences
  default_pipeline_id UUID REFERENCES public.crm_pipelines(id) ON DELETE SET NULL,
  last_viewed_pipeline_id UUID REFERENCES public.crm_pipelines(id) ON DELETE SET NULL,
  
  -- Board display preferences
  board_density TEXT DEFAULT 'comfortable' CHECK (board_density IN ('compact', 'comfortable', 'spacious')),
  show_card_value BOOLEAN DEFAULT true,
  show_card_probability BOOLEAN DEFAULT true,
  show_card_close_date BOOLEAN DEFAULT true,
  show_stage_metrics BOOLEAN DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_crm_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own preferences"
  ON public.user_crm_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON public.user_crm_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON public.user_crm_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- Auto-update trigger
CREATE TRIGGER update_user_crm_preferences_updated_at
  BEFORE UPDATE ON public.user_crm_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();