-- Adicionar campos para rastreamento de fechamento de deals
ALTER TABLE crm_deals 
ADD COLUMN IF NOT EXISTS closed_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS is_won boolean DEFAULT null;

-- Criar índices para melhor performance nas queries
CREATE INDEX IF NOT EXISTS idx_crm_deals_closed_at ON crm_deals(closed_at) WHERE closed_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_crm_deals_is_won ON crm_deals(is_won) WHERE is_won IS NOT NULL;

-- Comentários para documentação
COMMENT ON COLUMN crm_deals.closed_at IS 'Timestamp de quando o deal foi fechado (ganho ou perdido)';
COMMENT ON COLUMN crm_deals.is_won IS 'Status do deal: true = ganho, false = perdido, null = ainda ativo';