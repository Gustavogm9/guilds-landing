-- Expand crm_contacts table with enhanced lead data
ALTER TABLE public.crm_contacts 
ADD COLUMN IF NOT EXISTS lead_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS icp_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS lifecycle_stage TEXT DEFAULT 'lead' CHECK (lifecycle_stage IN ('lead', 'mql', 'sql', 'customer', 'closed_lost')),
ADD COLUMN IF NOT EXISTS lead_source TEXT,
ADD COLUMN IF NOT EXISTS products_interest TEXT[],
ADD COLUMN IF NOT EXISTS engagement_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_interaction_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS next_action TEXT,
ADD COLUMN IF NOT EXISTS next_action_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS budget_range TEXT,
ADD COLUMN IF NOT EXISTS decision_timeline TEXT,
ADD COLUMN IF NOT EXISTS pain_points TEXT[],
ADD COLUMN IF NOT EXISTS company_size TEXT,
ADD COLUMN IF NOT EXISTS industry TEXT,
ADD COLUMN IF NOT EXISTS job_title TEXT,
ADD COLUMN IF NOT EXISTS social_media JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Create contact interactions table
CREATE TABLE IF NOT EXISTS public.crm_contact_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id UUID NOT NULL REFERENCES public.crm_contacts(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('email', 'phone', 'whatsapp', 'meeting', 'form', 'newsletter', 'website', 'social', 'other')),
  interaction_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  subject TEXT,
  description TEXT,
  outcome TEXT,
  next_steps TEXT,
  channel_data JSONB DEFAULT '{}',
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lead scoring table
CREATE TABLE IF NOT EXISTS public.crm_lead_scoring (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id UUID NOT NULL REFERENCES public.crm_contacts(id) ON DELETE CASCADE,
  score_type TEXT NOT NULL CHECK (score_type IN ('demographic', 'behavioral', 'engagement', 'fit')),
  score_value INTEGER NOT NULL DEFAULT 0,
  criteria JSONB NOT NULL DEFAULT '{}',
  calculated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create product interest tracking table
CREATE TABLE IF NOT EXISTS public.crm_product_interests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id UUID NOT NULL REFERENCES public.crm_contacts(id) ON DELETE CASCADE,
  product_category TEXT NOT NULL CHECK (product_category IN ('software_apps', 'automacao_ia', 'jogos_gamificacao', 'consultoria', 'workshops')),
  interest_level INTEGER NOT NULL DEFAULT 1 CHECK (interest_level BETWEEN 1 AND 5),
  specific_products TEXT[],
  budget_indicated NUMERIC,
  timeline_indicated TEXT,
  source_interaction TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.crm_contact_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_lead_scoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_product_interests ENABLE ROW LEVEL SECURITY;

-- Create policies for contact interactions
CREATE POLICY "Only authenticated users can manage contact interactions" 
ON public.crm_contact_interactions 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create policies for lead scoring
CREATE POLICY "Only authenticated users can manage lead scoring" 
ON public.crm_lead_scoring 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create policies for product interests
CREATE POLICY "Only authenticated users can manage product interests" 
ON public.crm_product_interests 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create triggers for updated_at
CREATE TRIGGER update_contact_interactions_updated_at
BEFORE UPDATE ON public.crm_contact_interactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lead_scoring_updated_at
BEFORE UPDATE ON public.crm_lead_scoring
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_product_interests_updated_at
BEFORE UPDATE ON public.crm_product_interests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically create contact from various sources
CREATE OR REPLACE FUNCTION public.create_contact_from_lead_source(
  p_name TEXT,
  p_email TEXT,
  p_phone TEXT DEFAULT NULL,
  p_company TEXT DEFAULT NULL,
  p_source TEXT DEFAULT 'unknown',
  p_source_data JSONB DEFAULT '{}',
  p_pipeline_name TEXT DEFAULT 'Inbound Marketing'
)
RETURNS UUID AS $$
DECLARE
  v_contact_id UUID;
  v_pipeline_id UUID;
  v_stage_id UUID;
BEGIN
  -- Find or create pipeline
  SELECT id INTO v_pipeline_id
  FROM public.crm_pipelines
  WHERE name = p_pipeline_name AND is_active = true
  LIMIT 1;
  
  -- If pipeline doesn't exist, use the first active one
  IF v_pipeline_id IS NULL THEN
    SELECT id INTO v_pipeline_id
    FROM public.crm_pipelines
    WHERE is_active = true
    ORDER BY display_order
    LIMIT 1;
  END IF;
  
  -- Get first stage of the pipeline
  SELECT id INTO v_stage_id
  FROM public.crm_stages
  WHERE pipeline_id = v_pipeline_id AND is_active = true
  ORDER BY display_order
  LIMIT 1;
  
  -- Check if contact already exists
  SELECT id INTO v_contact_id
  FROM public.crm_contacts
  WHERE email = p_email AND is_active = true
  LIMIT 1;
  
  IF v_contact_id IS NULL THEN
    -- Create new contact
    INSERT INTO public.crm_contacts (
      name, email, phone, company, source, 
      lead_source, lifecycle_stage, custom_fields
    )
    VALUES (
      p_name, p_email, p_phone, p_company, p_source,
      p_source, 'lead', p_source_data
    )
    RETURNING id INTO v_contact_id;
    
    -- Create initial interaction record
    INSERT INTO public.crm_contact_interactions (
      contact_id, interaction_type, subject, description, channel_data
    )
    VALUES (
      v_contact_id, 
      CASE 
        WHEN p_source = 'newsletter' THEN 'newsletter'
        WHEN p_source = 'contact_form' THEN 'form'
        WHEN p_source = 'qualification' THEN 'form'
        WHEN p_source = 'workshop' THEN 'form'
        ELSE 'other'
      END,
      'Primeiro contato via ' || p_source,
      'Lead capturado automaticamente do ' || p_source,
      p_source_data
    );
    
    -- Create deal if we have pipeline and stage
    IF v_pipeline_id IS NOT NULL AND v_stage_id IS NOT NULL THEN
      INSERT INTO public.crm_deals (
        pipeline_id, stage_id, contact_id, title, 
        description, source, tags
      )
      VALUES (
        v_pipeline_id, v_stage_id, v_contact_id,
        'Oportunidade - ' || p_name,
        'Lead capturado via ' || p_source,
        p_source,
        ARRAY[p_source]
      );
    END IF;
  ELSE
    -- Update existing contact with new interaction
    UPDATE public.crm_contacts 
    SET 
      last_interaction_date = now(),
      engagement_score = COALESCE(engagement_score, 0) + 10
    WHERE id = v_contact_id;
    
    -- Add interaction record
    INSERT INTO public.crm_contact_interactions (
      contact_id, interaction_type, subject, description, channel_data
    )
    VALUES (
      v_contact_id,
      CASE 
        WHEN p_source = 'newsletter' THEN 'newsletter'
        WHEN p_source = 'contact_form' THEN 'form'
        WHEN p_source = 'qualification' THEN 'form'
        WHEN p_source = 'workshop' THEN 'form'
        ELSE 'other'
      END,
      'Nova interação via ' || p_source,
      'Contato recorrente via ' || p_source,
      p_source_data
    );
  END IF;
  
  RETURN v_contact_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create default pipelines if they don't exist
INSERT INTO public.crm_pipelines (name, description, type, color, display_order)
VALUES 
  ('Inbound Marketing', 'Leads vindos de newsletter, blog e conteúdo', 'sales', 'hsl(210, 100%, 60%)', 1),
  ('Contato Direto', 'Leads vindos do formulário de contato', 'sales', 'hsl(150, 100%, 40%)', 2),
  ('Educacional', 'Leads vindos de workshops e lab', 'sales', 'hsl(45, 100%, 50%)', 3),
  ('Qualificação', 'Leads vindos de formulários de qualificação', 'sales', 'hsl(270, 100%, 60%)', 4)
ON CONFLICT DO NOTHING;

-- Create default stages for each pipeline
DO $$
DECLARE
  pipeline_record RECORD;
BEGIN
  FOR pipeline_record IN 
    SELECT id, name FROM public.crm_pipelines 
    WHERE name IN ('Inbound Marketing', 'Contato Direto', 'Educacional', 'Qualificação')
  LOOP
    INSERT INTO public.crm_stages (pipeline_id, name, description, color, display_order)
    VALUES 
      (pipeline_record.id, 'Novo Lead', 'Lead recém capturado', 'hsl(0, 0%, 60%)', 1),
      (pipeline_record.id, 'Qualificação', 'Verificando fit e interesse', 'hsl(45, 100%, 60%)', 2),
      (pipeline_record.id, 'Proposta', 'Elaborando proposta comercial', 'hsl(30, 100%, 60%)', 3),
      (pipeline_record.id, 'Negociação', 'Negociando termos e valores', 'hsl(270, 100%, 60%)', 4),
      (pipeline_record.id, 'Fechado Ganho', 'Cliente fechado', 'hsl(120, 100%, 40%)', 5),
      (pipeline_record.id, 'Fechado Perdido', 'Oportunidade perdida', 'hsl(0, 100%, 50%)', 6)
    ON CONFLICT DO NOTHING;
  END LOOP;
END $$;