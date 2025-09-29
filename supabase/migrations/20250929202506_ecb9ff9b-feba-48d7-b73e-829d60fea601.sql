-- Adicionar Foreign Keys para garantir integridade referencial no CRM

-- FK: crm_deals.contact_id -> crm_contacts.id
-- ON DELETE SET NULL: se o contato for deletado, o deal permanece mas sem contato vinculado
ALTER TABLE public.crm_deals
  DROP CONSTRAINT IF EXISTS crm_deals_contact_id_fkey,
  ADD CONSTRAINT crm_deals_contact_id_fkey 
    FOREIGN KEY (contact_id) 
    REFERENCES public.crm_contacts(id) 
    ON DELETE SET NULL;

-- FK: crm_deals.pipeline_id -> crm_pipelines.id  
-- ON DELETE CASCADE: se o pipeline for deletado, deleta os deals associados
ALTER TABLE public.crm_deals
  DROP CONSTRAINT IF EXISTS crm_deals_pipeline_id_fkey,
  ADD CONSTRAINT crm_deals_pipeline_id_fkey 
    FOREIGN KEY (pipeline_id) 
    REFERENCES public.crm_pipelines(id) 
    ON DELETE CASCADE;

-- FK: crm_deals.stage_id -> crm_stages.id
-- ON DELETE CASCADE: se o stage for deletado, deleta os deals associados  
ALTER TABLE public.crm_deals
  DROP CONSTRAINT IF EXISTS crm_deals_stage_id_fkey,
  ADD CONSTRAINT crm_deals_stage_id_fkey 
    FOREIGN KEY (stage_id) 
    REFERENCES public.crm_stages(id) 
    ON DELETE CASCADE;

-- Criar índices para performance nas queries com JOIN
CREATE INDEX IF NOT EXISTS idx_crm_deals_contact_id ON public.crm_deals(contact_id);
CREATE INDEX IF NOT EXISTS idx_crm_deals_pipeline_id ON public.crm_deals(pipeline_id);
CREATE INDEX IF NOT EXISTS idx_crm_deals_stage_id ON public.crm_deals(stage_id);