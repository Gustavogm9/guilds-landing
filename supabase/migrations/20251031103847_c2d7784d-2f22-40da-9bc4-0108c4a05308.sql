-- FASE 1: Adicionar business_unit às tabelas de campanhas
ALTER TABLE feedback_campaigns 
ADD COLUMN business_unit TEXT NOT NULL DEFAULT 'guilds';

ALTER TABLE feedback_campaign_executions 
ADD COLUMN business_unit TEXT NOT NULL DEFAULT 'guilds';

-- Criar índices de performance
CREATE INDEX idx_feedback_campaigns_business_unit 
ON feedback_campaigns(business_unit, is_active);

CREATE INDEX idx_feedback_campaign_executions_status 
ON feedback_campaign_executions(status, created_at);

CREATE INDEX idx_feedback_campaign_executions_campaign_status 
ON feedback_campaign_executions(campaign_id, status);

-- Atualizar registros existentes (se houver)
UPDATE feedback_campaigns 
SET business_unit = 'guilds' 
WHERE business_unit IS NULL;

UPDATE feedback_campaign_executions 
SET business_unit = 'guilds' 
WHERE business_unit IS NULL;