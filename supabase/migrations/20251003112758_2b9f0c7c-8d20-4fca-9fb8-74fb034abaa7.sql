-- Adicionar campo is_default na tabela crm_pipelines
ALTER TABLE public.crm_pipelines 
ADD COLUMN is_default BOOLEAN NOT NULL DEFAULT false;

-- Criar função para garantir que apenas um pipeline por tipo seja padrão
CREATE OR REPLACE FUNCTION public.ensure_single_default_pipeline()
RETURNS TRIGGER AS $$
BEGIN
  -- Se o novo/atualizado pipeline está sendo marcado como padrão
  IF NEW.is_default = true THEN
    -- Desmarcar todos os outros pipelines do mesmo tipo como padrão
    UPDATE public.crm_pipelines
    SET is_default = false
    WHERE type = NEW.type 
      AND id != NEW.id 
      AND is_default = true;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Criar trigger para executar a função
CREATE TRIGGER ensure_single_default_pipeline_trigger
BEFORE INSERT OR UPDATE OF is_default ON public.crm_pipelines
FOR EACH ROW
EXECUTE FUNCTION public.ensure_single_default_pipeline();

-- Marcar o primeiro pipeline de cada tipo como padrão (se não houver nenhum marcado)
UPDATE public.crm_pipelines p1
SET is_default = true
WHERE p1.id IN (
  SELECT DISTINCT ON (type) id
  FROM public.crm_pipelines
  WHERE is_active = true
  ORDER BY type, display_order, created_at
)
AND NOT EXISTS (
  SELECT 1 FROM public.crm_pipelines p2
  WHERE p2.type = p1.type AND p2.is_default = true
);