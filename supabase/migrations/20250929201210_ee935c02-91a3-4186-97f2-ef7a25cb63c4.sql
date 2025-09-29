-- Criar oportunidades para contatos existentes sem deals
-- Pipeline: Contato Direto (dc7f30e1-6af6-4608-9343-bb19df960d4a)
-- Stage: Novo Lead (6df9f52a-1702-40de-a2e3-41b299981208)

INSERT INTO public.crm_deals (
  pipeline_id,
  stage_id,
  contact_id,
  title,
  description,
  source,
  tags,
  probability,
  is_active
)
SELECT 
  'dc7f30e1-6af6-4608-9343-bb19df960d4a'::uuid,
  '6df9f52a-1702-40de-a2e3-41b299981208'::uuid,
  c.id,
  'Oportunidade - ' || c.name,
  'Lead capturado via ' || COALESCE(c.source, 'fonte desconhecida') || 
    COALESCE(' - Empresa: ' || c.company, '') ||
    COALESCE(' - Unidade: ' || (c.custom_fields->>'businessUnit')::text, ''),
  c.source,
  ARRAY[COALESCE(c.source, 'unknown')] || 
    CASE 
      WHEN (c.custom_fields->>'businessUnit') IS NOT NULL 
      THEN ARRAY[(c.custom_fields->>'businessUnit')::text]
      ELSE ARRAY[]::text[]
    END,
  10,
  true
FROM public.crm_contacts c
WHERE c.is_active = true
  AND NOT EXISTS (
    SELECT 1 
    FROM public.crm_deals d 
    WHERE d.contact_id = c.id AND d.is_active = true
  );