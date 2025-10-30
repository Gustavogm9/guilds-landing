-- Adicionar coluna business_unit à tabela qualification_forms
ALTER TABLE qualification_forms 
ADD COLUMN business_unit TEXT NOT NULL DEFAULT 'guilds';

-- Criar índice para performance
CREATE INDEX idx_qualification_forms_business_unit 
ON qualification_forms(business_unit, is_active);

-- Atualizar forms existentes (assumir que são Guilds)
UPDATE qualification_forms 
SET business_unit = 'guilds' 
WHERE business_unit IS NULL;

-- Adicionar comentário na coluna
COMMENT ON COLUMN qualification_forms.business_unit IS 'Identifica qual produto/projeto (guilds, doavya, etc.) este formulário pertence';