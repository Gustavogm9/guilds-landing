-- ================================================
-- FASE 1: SISTEMA DE GERAÇÃO DE PROPOSTAS
-- ================================================

-- 1.1 Templates de Propostas
CREATE TABLE IF NOT EXISTS proposal_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  business_unit TEXT CHECK (business_unit IN ('guilds', 'guilds_lab', 'guilds_craft')),
  schema JSONB NOT NULL,
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 1.2 Propostas
CREATE TABLE IF NOT EXISTS proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_number TEXT UNIQUE,
  deal_id UUID NOT NULL REFERENCES crm_deals(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES crm_contacts(id),
  template_id UUID NOT NULL REFERENCES proposal_templates(id),
  title TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft','internal_review','sent','negotiation','approved','rejected','expired')),
  current_version INTEGER NOT NULL DEFAULT 1,
  flags JSONB DEFAULT '{}'::jsonb,
  valid_until DATE NOT NULL,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 1.3 Versões de Propostas
CREATE TABLE IF NOT EXISTS proposal_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  sections JSONB NOT NULL,
  variables JSONB NOT NULL,
  pricing JSONB NOT NULL,
  pdf_url TEXT,
  docx_url TEXT,
  published_url TEXT,
  published_token TEXT,
  published_expires_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(proposal_id, version_number)
);

-- 1.4 Solicitações de Mudança
CREATE TABLE IF NOT EXISTS proposal_change_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  from_version INTEGER NOT NULL,
  to_version INTEGER NOT NULL,
  change_type TEXT CHECK (change_type IN ('client_request','internal_adjustment','pricing_update')),
  notes TEXT,
  requested_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 1.5 Aprovações de Propostas
CREATE TABLE IF NOT EXISTS proposal_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  approver_type TEXT CHECK (approver_type IN ('client','internal_manager','finance','legal')),
  approver_email TEXT NOT NULL,
  approved_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ip_address INET,
  user_agent TEXT,
  comments TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- 1.6 Catálogo de Preços
CREATE TABLE IF NOT EXISTS proposal_pricing_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT CHECK (category IN ('maintenance','partnership','whitelabel')),
  value NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'BRL',
  benefits JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 1.7 Função: Gerar número de proposta
CREATE OR REPLACE FUNCTION generate_proposal_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  v_year TEXT;
  v_sequence INTEGER;
BEGIN
  v_year := EXTRACT(YEAR FROM now())::TEXT;
  
  SELECT COALESCE(MAX(
    CASE 
      WHEN proposal_number ~ ('^PROP-' || v_year || '-\d+$') 
      THEN CAST(SUBSTRING(proposal_number FROM '\d+$') AS INTEGER)
      ELSE 0 
    END
  ), 0) + 1 INTO v_sequence
  FROM proposals;
  
  RETURN 'PROP-' || v_year || '-' || LPAD(v_sequence::TEXT, 4, '0');
END;
$$;

-- 1.8 Função: Setar número de proposta
CREATE OR REPLACE FUNCTION set_proposal_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.proposal_number IS NULL THEN
    NEW.proposal_number = generate_proposal_number();
  END IF;
  RETURN NEW;
END;
$$;

-- 1.9 Trigger: Auto-gerar número de proposta
DROP TRIGGER IF EXISTS set_proposal_number_trigger ON proposals;
CREATE TRIGGER set_proposal_number_trigger
  BEFORE INSERT ON proposals
  FOR EACH ROW
  EXECUTE FUNCTION set_proposal_number();

-- 1.10 Função: Auto-criar proposta quando deal entra em stage "Proposta"
CREATE OR REPLACE FUNCTION auto_create_proposal_from_deal()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_stage_name TEXT;
  v_template_id UUID;
  v_contact_id UUID;
  v_proposal_id UUID;
BEGIN
  SELECT name INTO v_stage_name
  FROM crm_stages
  WHERE id = NEW.stage_id;

  IF v_stage_name IN ('Proposta', 'Proposal') 
     AND (OLD.stage_id IS NULL OR OLD.stage_id != NEW.stage_id) THEN
    
    SELECT id INTO v_template_id
    FROM proposal_templates
    WHERE is_default = true 
      AND is_active = true
    LIMIT 1;
    
    SELECT contact_id INTO v_contact_id FROM crm_deals WHERE id = NEW.id;
    
    IF NOT EXISTS (
      SELECT 1 FROM proposals 
      WHERE deal_id = NEW.id 
        AND status NOT IN ('rejected', 'expired')
    ) AND v_template_id IS NOT NULL AND v_contact_id IS NOT NULL THEN
      
      INSERT INTO proposals (
        deal_id,
        contact_id,
        template_id,
        title,
        status,
        valid_until,
        flags,
        created_by
      )
      VALUES (
        NEW.id,
        v_contact_id,
        v_template_id,
        'Proposta: ' || NEW.title,
        'draft',
        CURRENT_DATE + INTERVAL '30 days',
        jsonb_build_object(
          'partnership', 'partnership' = ANY(NEW.tags),
          'whitelabel', 'whitelabel' = ANY(NEW.tags),
          'maintenanceEnabled', true
        ),
        auth.uid()
      )
      RETURNING id INTO v_proposal_id;
      
      INSERT INTO crm_audit_log (
        entity_type, entity_id, action_type, changed_by,
        change_description, metadata
      ) VALUES (
        'deal', NEW.id, 'proposal_auto_created', auth.uid(),
        'Proposta criada automaticamente ao mover para stage Proposta',
        jsonb_build_object('proposal_id', v_proposal_id)
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- 1.11 Trigger: Criar proposta ao mudar stage do deal
DROP TRIGGER IF EXISTS auto_create_proposal_trigger ON crm_deals;
CREATE TRIGGER auto_create_proposal_trigger
  AFTER UPDATE OF stage_id ON crm_deals
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_proposal_from_deal();

-- 1.12 Função: Criar contrato quando proposta é aprovada
CREATE OR REPLACE FUNCTION proposal_approved_to_contract()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_template_id UUID;
BEGIN
  IF NEW.status = 'approved' 
     AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    
    SELECT id INTO v_template_id
    FROM legal_templates
    WHERE is_active = true AND is_default = true
    LIMIT 1;
    
    IF NOT EXISTS (
      SELECT 1 FROM legal_contracts WHERE deal_id = NEW.deal_id
    ) AND v_template_id IS NOT NULL THEN
      
      INSERT INTO legal_contracts (
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
        NEW.deal_id,
        v_template_id,
        'Contrato: ' || NEW.title,
        jsonb_build_object(
          'proposal_id', NEW.id,
          'proposal_version', NEW.current_version
        ),
        'draft',
        auth.uid()
      );
      
      INSERT INTO crm_audit_log (
        entity_type, entity_id, action_type, changed_by,
        change_description, metadata
      ) VALUES (
        'proposal', NEW.id, 'contract_auto_created', auth.uid(),
        'Contrato criado automaticamente após aprovação da proposta',
        jsonb_build_object('deal_id', NEW.deal_id)
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- 1.13 Trigger: Criar contrato ao aprovar proposta
DROP TRIGGER IF EXISTS proposal_approved_creates_contract_trigger ON proposals;
CREATE TRIGGER proposal_approved_creates_contract_trigger
  AFTER UPDATE OF status ON proposals
  FOR EACH ROW
  EXECUTE FUNCTION proposal_approved_to_contract();

-- ================================================
-- RLS POLICIES
-- ================================================

ALTER TABLE proposal_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_change_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_pricing_catalog ENABLE ROW LEVEL SECURITY;

-- Templates: públicos para leitura, auth para gestão
CREATE POLICY "Templates are publicly readable"
  ON proposal_templates FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage templates"
  ON proposal_templates FOR ALL
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Propostas: auth para gestão
CREATE POLICY "Authenticated users can view proposals"
  ON proposals FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create proposals"
  ON proposals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update proposals"
  ON proposals FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Versões: auth + acesso público via token
CREATE POLICY "Authenticated users can view versions"
  ON proposal_versions FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Public access via token"
  ON proposal_versions FOR SELECT
  USING (
    published_token IS NOT NULL 
    AND published_expires_at > now()
  );

CREATE POLICY "Authenticated users can create versions"
  ON proposal_versions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Change Requests
CREATE POLICY "Authenticated users can manage change requests"
  ON proposal_change_requests FOR ALL
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Aprovações
CREATE POLICY "Authenticated users can view approvals"
  ON proposal_approvals FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can create approval"
  ON proposal_approvals FOR INSERT
  WITH CHECK (true);

-- Catálogo de Preços
CREATE POLICY "Catalog is publicly readable"
  ON proposal_pricing_catalog FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage catalog"
  ON proposal_pricing_catalog FOR ALL
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ================================================
-- SEED DATA
-- ================================================

-- Template padrão
INSERT INTO proposal_templates (name, description, business_unit, schema, is_default, is_active)
VALUES (
  'Guilds - Software Sob Medida',
  'Template padrão para projetos de desenvolvimento custom',
  'guilds',
  '{
    "meta": {
      "name": "Guilds – Software Sob Medida",
      "locale": "pt-BR"
    },
    "sections": [
      {"key":"cover","title":"Capa","type":"cover","visible":true},
      {"key":"executive_summary","title":"Resumo Executivo","type":"md","body":"# Resumo Executivo\n\n**Cliente:** {{cliente.razaoSocial}}\n**Projeto:** {{projeto.nome}}\n**Objetivos:** {{#each projeto.objetivos}}\n- {{this}}\n{{/each}}"},
      {"key":"context","title":"Contexto & Desafios","type":"md","body":"## Entendimento do Cenário\n\n{{#each contexto.itens}}\n- {{this}}\n{{/each}}"},
      {"key":"solution","title":"Solução (G-FORGE)","type":"md","body":"## Solução: G-FORGE\n\nNossa metodologia proprietária combina agilidade com qualidade enterprise."},
      {"key":"sprints","title":"Sprints de Entrega","type":"table","body":"{{> sprints_table}}"},
      {"key":"investment","title":"Investimento","type":"table","body":"**Valor Total:** {{currency investimento.valor}}"},
      {"key":"payment","title":"Estrutura de Pagamento","type":"table","body":"{{> payment_table}}"},
      {"key":"maintenance","title":"Manutenção","type":"table","condition":"{{flags.maintenanceEnabled}}","body":"{{> maintenance_table}}"},
      {"key":"partnership","title":"Programa de Parceria","type":"md","condition":"{{flags.partnership}}","body":"## Parceria RevShare\n\nPercentual implementação: {{parceria.percentualImpl}}%"},
      {"key":"whitelabel","title":"Whitelabel","type":"md","condition":"{{flags.whitelabel}}","body":"## Modelo Whitelabel\n\nSolução sob sua marca."},
      {"key":"about","title":"Sobre a Guilds","type":"md","body":"## Sobre a Guilds\n\nSistemas inteligentes, resultados reais."}
    ],
    "partials": {
      "sprints_table": "| Sprint | Início | Fim | Entregas |\n|--------|--------|-----|----------|\n{{#each prazos.sprints}}\n| {{nome}} | {{inicio}} | {{fim}} | {{#each entregas}}{{this}}, {{/each}} |\n{{/each}}",
      "payment_table": "| Parcela | Percentual | Valor | Vencimento |\n|---------|------------|-------|------------|\n{{#each pagamento.parcelas}}\n| {{nome}} | {{percentual}}% | {{valor}} | {{vencimento}} |\n{{/each}}",
      "maintenance_table": "| Plano | Valor/mês | Benefícios |\n|-------|-----------|------------|\n{{#each manutencao.planos}}\n| {{nome}} | R$ {{valor}} | {{#each beneficios}}{{this}}, {{/each}} |\n{{/each}}"
    }
  }'::jsonb,
  true,
  true
)
ON CONFLICT DO NOTHING;

-- Planos de manutenção
INSERT INTO proposal_pricing_catalog (name, category, value, currency, benefits, display_order, is_active)
VALUES
  ('Basic', 'maintenance', 765.00, 'BRL', '["Suporte em horário comercial","0.5 FTE/mês","Correções de bugs","Atualizações de segurança"]'::jsonb, 1, true),
  ('Steady', 'maintenance', 1147.50, 'BRL', '["Suporte estendido","1 FTE/mês","Melhorias contínuas","Prioridade média"]'::jsonb, 2, true),
  ('Growth', 'maintenance', 1530.00, 'BRL', '["Suporte premium 24/7","1.5 FTE/mês","Novas features","Prioridade alta"]'::jsonb, 3, true)
ON CONFLICT DO NOTHING;