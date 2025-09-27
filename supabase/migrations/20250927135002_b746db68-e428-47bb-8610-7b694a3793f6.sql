-- Adicionar campos pendentes na tabela legal_contracts para PDF e Clicksign
ALTER TABLE public.legal_contracts 
ADD COLUMN IF NOT EXISTS pdf_url TEXT,
ADD COLUMN IF NOT EXISTS pdf_generated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS clicksign_document_key TEXT,
ADD COLUMN IF NOT EXISTS clicksign_status TEXT DEFAULT 'not_sent',
ADD COLUMN IF NOT EXISTS signed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS signed_document_url TEXT;

-- Adicionar campo default_clauses na tabela legal_templates
ALTER TABLE public.legal_templates 
ADD COLUMN IF NOT EXISTS default_clauses JSONB DEFAULT '[]'::jsonb;

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_legal_contracts_clicksign_key ON public.legal_contracts(clicksign_document_key);
CREATE INDEX IF NOT EXISTS idx_legal_contracts_deal_id ON public.legal_contracts(deal_id);
CREATE INDEX IF NOT EXISTS idx_legal_contracts_pdf_status ON public.legal_contracts(pdf_url) WHERE pdf_url IS NOT NULL;