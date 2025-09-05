-- CRM Tables Creation
-- Pipeline principal
CREATE TABLE public.crm_pipelines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'sales'::text, -- sales, support, projects
  color TEXT NOT NULL DEFAULT 'hsl(var(--primary))'::text,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Estágios/Colunas
CREATE TABLE public.crm_stages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pipeline_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL DEFAULT 'hsl(var(--muted))'::text,
  display_order INTEGER NOT NULL DEFAULT 0,
  auto_actions JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Contatos
CREATE TABLE public.crm_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  source TEXT,
  tags TEXT[] DEFAULT '{}',
  custom_fields JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Oportunidades/Cards
CREATE TABLE public.crm_deals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pipeline_id UUID NOT NULL,
  stage_id UUID NOT NULL,
  contact_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  value NUMERIC,
  currency TEXT DEFAULT 'BRL'::text,
  probability INTEGER DEFAULT 0,
  expected_close_date DATE,
  assigned_to UUID,
  source TEXT,
  tags TEXT[] DEFAULT '{}',
  custom_fields JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Atividades
CREATE TABLE public.crm_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_id UUID,
  contact_id UUID,
  type TEXT NOT NULL DEFAULT 'note'::text, -- note, call, email, meeting, task
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Campos personalizados
CREATE TABLE public.crm_custom_fields (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pipeline_id UUID NOT NULL,
  entity_type TEXT NOT NULL, -- deal, contact, activity
  field_name TEXT NOT NULL,
  field_label TEXT NOT NULL,
  field_type TEXT NOT NULL DEFAULT 'text'::text, -- text, number, date, select, multiselect, boolean
  field_options JSONB DEFAULT '[]'::jsonb,
  is_required BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.crm_pipelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_custom_fields ENABLE ROW LEVEL SECURITY;

-- RLS Policies for CRM Pipelines
CREATE POLICY "Pipelines are publicly readable" 
ON public.crm_pipelines 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Only authenticated users can manage pipelines" 
ON public.crm_pipelines 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- RLS Policies for CRM Stages
CREATE POLICY "Stages are publicly readable" 
ON public.crm_stages 
FOR SELECT 
USING (is_active = true AND EXISTS (
  SELECT 1 FROM crm_pipelines 
  WHERE crm_pipelines.id = crm_stages.pipeline_id 
  AND crm_pipelines.is_active = true
));

CREATE POLICY "Only authenticated users can manage stages" 
ON public.crm_stages 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- RLS Policies for CRM Contacts
CREATE POLICY "Only authenticated users can read contacts" 
ON public.crm_contacts 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can manage contacts" 
ON public.crm_contacts 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- RLS Policies for CRM Deals
CREATE POLICY "Only authenticated users can read deals" 
ON public.crm_deals 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can manage deals" 
ON public.crm_deals 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- RLS Policies for CRM Activities
CREATE POLICY "Only authenticated users can read activities" 
ON public.crm_activities 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can manage activities" 
ON public.crm_activities 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- RLS Policies for CRM Custom Fields
CREATE POLICY "Custom fields are publicly readable" 
ON public.crm_custom_fields 
FOR SELECT 
USING (is_active = true AND EXISTS (
  SELECT 1 FROM crm_pipelines 
  WHERE crm_pipelines.id = crm_custom_fields.pipeline_id 
  AND crm_pipelines.is_active = true
));

CREATE POLICY "Only authenticated users can manage custom fields" 
ON public.crm_custom_fields 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create indexes for better performance
CREATE INDEX idx_crm_stages_pipeline ON crm_stages(pipeline_id);
CREATE INDEX idx_crm_deals_pipeline ON crm_deals(pipeline_id);
CREATE INDEX idx_crm_deals_stage ON crm_deals(stage_id);
CREATE INDEX idx_crm_deals_contact ON crm_deals(contact_id);
CREATE INDEX idx_crm_activities_deal ON crm_activities(deal_id);
CREATE INDEX idx_crm_activities_contact ON crm_activities(contact_id);
CREATE INDEX idx_crm_custom_fields_pipeline ON crm_custom_fields(pipeline_id);

-- Create triggers for updated_at
CREATE TRIGGER update_crm_pipelines_updated_at
BEFORE UPDATE ON public.crm_pipelines
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crm_stages_updated_at
BEFORE UPDATE ON public.crm_stages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crm_contacts_updated_at
BEFORE UPDATE ON public.crm_contacts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crm_deals_updated_at
BEFORE UPDATE ON public.crm_deals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crm_activities_updated_at
BEFORE UPDATE ON public.crm_activities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crm_custom_fields_updated_at
BEFORE UPDATE ON public.crm_custom_fields
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default pipeline and stages
INSERT INTO public.crm_pipelines (name, description, type, color) 
VALUES ('Pipeline de Vendas', 'Pipeline principal para oportunidades de vendas', 'sales', 'hsl(240, 85%, 55%)');

-- Get the pipeline ID for stages
DO $$
DECLARE
  pipeline_uuid UUID;
BEGIN
  SELECT id INTO pipeline_uuid FROM crm_pipelines WHERE name = 'Pipeline de Vendas' LIMIT 1;
  
  INSERT INTO public.crm_stages (pipeline_id, name, description, color, display_order) VALUES
  (pipeline_uuid, 'Lead', 'Novos contatos e leads qualificados', 'hsl(200, 85%, 55%)', 1),
  (pipeline_uuid, 'Proposta', 'Propostas enviadas aguardando retorno', 'hsl(45, 85%, 55%)', 2),
  (pipeline_uuid, 'Negociação', 'Em processo de negociação', 'hsl(25, 85%, 55%)', 3),
  (pipeline_uuid, 'Fechado', 'Negócios fechados com sucesso', 'hsl(120, 85%, 55%)', 4),
  (pipeline_uuid, 'Perdido', 'Oportunidades perdidas', 'hsl(0, 85%, 55%)', 5);
END $$;