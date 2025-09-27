-- Add default_clauses column to legal_templates table
ALTER TABLE public.legal_templates 
ADD COLUMN IF NOT EXISTS default_clauses UUID[] DEFAULT '{}';

-- Update existing templates to have empty default_clauses array if null
UPDATE public.legal_templates 
SET default_clauses = '{}'
WHERE default_clauses IS NULL;