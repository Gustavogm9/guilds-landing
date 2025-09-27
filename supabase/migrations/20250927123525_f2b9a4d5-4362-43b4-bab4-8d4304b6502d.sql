-- Criar estrutura de dados para sistema jurídico
-- Aproveitando máximo das tabelas existentes (crm_contacts, crm_deals, projects)

-- 1. Grupos de cláusulas (ex: PI/White-Label, Manutenção, LGPD)
CREATE TABLE public.legal_clause_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  icon_name TEXT,
  color TEXT NOT NULL DEFAULT 'hsl(var(--muted))',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Cláusulas individuais
CREATE TABLE public.legal_clauses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.legal_clause_groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content_markdown TEXT NOT NULL,
  variables JSONB NOT NULL DEFAULT '[]', -- placeholders como {CONTRATANTE_NOME}
  conditions JSONB NOT NULL DEFAULT '{}', -- regras condicionais
  tags TEXT[] DEFAULT '{}',
  is_locked_by_legal BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Templates de contratos (presets/playbooks)
CREATE TABLE public.legal_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  contract_type TEXT NOT NULL, -- 'software', 'white_label', 'maintenance', etc
  default_groups UUID[] DEFAULT '{}', -- grupos incluídos por padrão
  variables_mapping JSONB NOT NULL DEFAULT '{}', -- mapeamento CRM -> template
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_by UUID,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Contratos gerados
CREATE TABLE public.legal_contracts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_number TEXT UNIQUE, -- numeração sequencial
  client_contact_id UUID NOT NULL REFERENCES public.crm_contacts(id) ON DELETE RESTRICT,
  deal_id UUID REFERENCES public.crm_deals(id) ON DELETE SET NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  template_id UUID NOT NULL REFERENCES public.legal_templates(id) ON DELETE RESTRICT,
  
  -- Dados do contrato
  title TEXT NOT NULL,
  content_markdown TEXT, -- conteúdo final gerado
  variables_data JSONB NOT NULL DEFAULT '{}', -- valores das variáveis
  selected_clauses UUID[] DEFAULT '{}', -- cláusulas selecionadas
  
  -- Status e controle
  status TEXT NOT NULL DEFAULT 'draft', -- draft, review, approved, signed, cancelled
  pdf_url TEXT, -- URL do PDF final
  pdf_hash TEXT, -- hash para auditoria
  
  -- IA reviews
  ai_draft_review JSONB, -- resultado da IA de review
  ai_risk_score INTEGER, -- 0-100
  ai_law_design_summary TEXT, -- versão simplificada
  
  -- Auditoria
  created_by UUID,
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. Controle de assinaturas (integração Clicksign)
CREATE TABLE public.legal_contract_signatures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID NOT NULL REFERENCES public.legal_contracts(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'clicksign',
  envelope_id TEXT, -- ID no Clicksign
  status TEXT NOT NULL DEFAULT 'pending', -- pending, sent, signed, cancelled
  signers JSONB NOT NULL DEFAULT '[]', -- dados dos signatários
  sent_at TIMESTAMP WITH TIME ZONE,
  signed_at TIMESTAMP WITH TIME ZONE,
  webhook_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_legal_clauses_group_id ON public.legal_clauses(group_id);
CREATE INDEX idx_legal_contracts_client_id ON public.legal_contracts(client_contact_id);
CREATE INDEX idx_legal_contracts_deal_id ON public.legal_contracts(deal_id);
CREATE INDEX idx_legal_contracts_status ON public.legal_contracts(status);
CREATE INDEX idx_legal_contract_signatures_contract_id ON public.legal_contract_signatures(contract_id);

-- Função para gerar numeração de contratos
CREATE OR REPLACE FUNCTION public.generate_contract_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_year TEXT;
  v_sequence INTEGER;
  v_contract_number TEXT;
BEGIN
  v_year := EXTRACT(YEAR FROM now())::TEXT;
  
  -- Buscar próximo número sequencial do ano
  SELECT COALESCE(MAX(
    CASE 
      WHEN contract_number ~ ('^GLD-' || v_year || '-\d+$') 
      THEN CAST(SUBSTRING(contract_number FROM '\d+$') AS INTEGER)
      ELSE 0 
    END
  ), 0) + 1 
  INTO v_sequence
  FROM public.legal_contracts;
  
  v_contract_number := 'GLD-' || v_year || '-' || LPAD(v_sequence::TEXT, 4, '0');
  
  RETURN v_contract_number;
END;
$$;

-- Trigger para auto-gerar numeração
CREATE OR REPLACE FUNCTION public.set_contract_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.contract_number IS NULL THEN
    NEW.contract_number := public.generate_contract_number();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_set_contract_number
  BEFORE INSERT ON public.legal_contracts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_contract_number();

-- Trigger para atualizar updated_at
CREATE TRIGGER update_legal_clause_groups_updated_at
  BEFORE UPDATE ON public.legal_clause_groups
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_legal_clauses_updated_at
  BEFORE UPDATE ON public.legal_clauses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_legal_templates_updated_at
  BEFORE UPDATE ON public.legal_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_legal_contracts_updated_at
  BEFORE UPDATE ON public.legal_contracts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_legal_contract_signatures_updated_at
  BEFORE UPDATE ON public.legal_contract_signatures
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies
ALTER TABLE public.legal_clause_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_clauses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_contract_signatures ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (apenas usuários autenticados)
CREATE POLICY "Only authenticated users can manage clause groups"
ON public.legal_clause_groups FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can manage clauses"
ON public.legal_clauses FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can manage templates"
ON public.legal_templates FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can manage contracts"
ON public.legal_contracts FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can manage signatures"
ON public.legal_contract_signatures FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Inserir dados base (grupos padrão baseados no PRD)
INSERT INTO public.legal_clause_groups (name, description, display_order, icon_name, color) VALUES
('Objeto e Escopo', 'Definição do objeto do contrato e escopo do projeto', 1, 'Target', 'hsl(var(--primary))'),
('Propriedade Intelectual', 'Cláusulas de PI, white-label e exclusividade', 2, 'Copyright', 'hsl(200, 85%, 55%)'),
('Sprints e Prazos', 'Cronograma de desenvolvimento e entregas', 3, 'Calendar', 'hsl(150, 85%, 55%)'),
('Pagamentos', 'Valores, formas de pagamento e vencimentos', 4, 'CreditCard', 'hsl(120, 85%, 55%)'),
('Suporte e Manutenção', 'Planos de manutenção e suporte técnico', 5, 'Wrench', 'hsl(50, 85%, 55%)'),
('Multas e Juros', 'Penalidades por atraso e inadimplência', 6, 'AlertTriangle', 'hsl(15, 85%, 55%)'),
('Carência e Fidelidade', 'Períodos de carência e fidelização', 7, 'Shield', 'hsl(250, 85%, 55%)'),
('Rescisão', 'Hipóteses e procedimentos de rescisão', 8, 'XCircle', 'hsl(350, 85%, 55%)'),
('Confidencialidade', 'Proteção de informações confidenciais', 9, 'Lock', 'hsl(280, 85%, 55%)'),
('LGPD', 'Proteção de dados pessoais e privacidade', 10, 'UserCheck', 'hsl(190, 85%, 55%)'),
('Comissionamento', 'Comissões para parceiros (quando aplicável)', 11, 'Percent', 'hsl(60, 85%, 55%)'),
('Foro e Legislação', 'Foro competente e legislação aplicável', 12, 'MapPin', 'hsl(300, 85%, 55%)');

-- Função para criar contrato automaticamente quando deal avança
CREATE OR REPLACE FUNCTION public.auto_create_contract_from_deal()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_stage_name TEXT;
  v_template_id UUID;
BEGIN
  -- Verificar se o deal mudou para stage de "Proposta Aprovada" ou similar
  SELECT cs.name INTO v_stage_name
  FROM public.crm_stages cs
  WHERE cs.id = NEW.stage_id;

  -- Se o deal está em "Proposta Aprovada" e ainda não tem contrato, criar automaticamente
  IF v_stage_name IN ('Proposta Aprovada', 'Contrato', 'Contract') AND OLD.stage_id != NEW.stage_id THEN
    
    -- Buscar template padrão baseado nos tags do deal
    SELECT lt.id INTO v_template_id
    FROM public.legal_templates lt
    WHERE lt.is_default = true 
      AND lt.is_active = true
      AND (
        CASE 
          WHEN 'white_label' = ANY(NEW.tags) THEN lt.contract_type = 'white_label'
          WHEN 'software' = ANY(NEW.tags) THEN lt.contract_type = 'software'
          ELSE lt.contract_type = 'standard'
        END
      )
    LIMIT 1;
    
    -- Se não encontrou template específico, usar o primeiro ativo
    IF v_template_id IS NULL THEN
      SELECT lt.id INTO v_template_id
      FROM public.legal_templates lt
      WHERE lt.is_active = true
      ORDER BY lt.is_default DESC, lt.created_at
      LIMIT 1;
    END IF;
    
    -- Criar contrato apenas se existe template e não existe contrato para este deal
    IF v_template_id IS NOT NULL AND NOT EXISTS (
      SELECT 1 FROM public.legal_contracts lc WHERE lc.deal_id = NEW.id
    ) THEN
      INSERT INTO public.legal_contracts (
        client_contact_id,
        deal_id,
        template_id,
        title,
        variables_data,
        status,
        created_by
      )
      VALUES (
        NEW.contact_id,
        NEW.id,
        v_template_id,
        'Contrato: ' || NEW.title,
        jsonb_build_object(
          'valor_total', COALESCE(NEW.value, 0),
          'deal_tags', NEW.tags,
          'currency', NEW.currency
        ),
        'draft',
        auth.uid()
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Aplicar trigger no CRM deals
CREATE TRIGGER trigger_auto_create_contract_from_deal
  AFTER UPDATE ON public.crm_deals
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_create_contract_from_deal();