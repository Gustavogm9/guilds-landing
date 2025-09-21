-- Fase 1.1: Criar estrutura correta para cost_centers (já existe mas pode estar incompleta)
-- Verificar se precisa ajustar alguma estrutura

-- Criar tabela para logs de erros do sistema
CREATE TABLE IF NOT EXISTS system_error_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  error_type TEXT NOT NULL,
  error_message TEXT NOT NULL,
  error_stack TEXT,
  component_name TEXT,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  url TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE system_error_logs ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS
CREATE POLICY "Allow system to log errors" ON system_error_logs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only authenticated users can read error logs" ON system_error_logs
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can update error logs" ON system_error_logs
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Criar função para log de erros
CREATE OR REPLACE FUNCTION log_system_error(
  p_error_type TEXT,
  p_error_message TEXT,
  p_error_stack TEXT DEFAULT NULL,
  p_component_name TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO system_error_logs (
    error_type,
    error_message,
    error_stack,
    component_name,
    user_id,
    metadata
  )
  VALUES (
    p_error_type,
    p_error_message,
    p_error_stack,
    p_component_name,
    auth.uid(),
    p_metadata
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_system_error_logs_created_at ON system_error_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_system_error_logs_error_type ON system_error_logs(error_type);
CREATE INDEX IF NOT EXISTS idx_system_error_logs_resolved ON system_error_logs(resolved);

-- Verificar e ajustar estrutura das tabelas existentes se necessário
-- Adicionar campos que podem estar faltando em cost_centers
DO $$ 
BEGIN
  -- Adicionar campo budget_amount se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'cost_centers' AND column_name = 'budget_amount'
  ) THEN
    ALTER TABLE cost_centers ADD COLUMN budget_amount NUMERIC DEFAULT 0;
  END IF;
  
  -- Adicionar campo manager_id se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'cost_centers' AND column_name = 'manager_id'
  ) THEN
    ALTER TABLE cost_centers ADD COLUMN manager_id UUID REFERENCES auth.users(id);
  END IF;
END $$;