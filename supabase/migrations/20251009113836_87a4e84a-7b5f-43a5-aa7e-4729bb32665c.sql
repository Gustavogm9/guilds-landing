-- Sprint 4: Automação de Enrollment em Nurturing Sequences

-- Função para avaliar e inscrever automaticamente contatos em sequências
CREATE OR REPLACE FUNCTION public.auto_enroll_in_nurturing_sequence()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_sequence_id UUID;
  v_sequence_name TEXT;
  v_should_enroll BOOLEAN := false;
BEGIN
  -- Detectar mudanças significativas que devem acionar nurturing
  
  -- 1. Score mudou e atingiu threshold importante
  IF OLD.lead_score IS DISTINCT FROM NEW.lead_score THEN
    -- Lead Frio (score 0-30)
    IF NEW.lead_score <= 30 AND (OLD.lead_score IS NULL OR OLD.lead_score > 30) THEN
      SELECT id, name INTO v_sequence_id, v_sequence_name
      FROM nurturing_sequences
      WHERE name = 'Lead Frio - Aquecimento Inicial'
        AND is_active = true
        AND trigger_event = 'score_threshold'
      LIMIT 1;
      v_should_enroll := true;
    
    -- Lead Morno (score 31-60)
    ELSIF NEW.lead_score BETWEEN 31 AND 60 AND (OLD.lead_score IS NULL OR OLD.lead_score <= 30 OR OLD.lead_score > 60) THEN
      SELECT id, name INTO v_sequence_id, v_sequence_name
      FROM nurturing_sequences
      WHERE name = 'Lead Morno - Educação e Engajamento'
        AND is_active = true
        AND trigger_event = 'score_threshold'
      LIMIT 1;
      v_should_enroll := true;
    
    -- Lead Quente (score 61+)
    ELSIF NEW.lead_score > 60 AND (OLD.lead_score IS NULL OR OLD.lead_score <= 60) THEN
      SELECT id, name INTO v_sequence_id, v_sequence_name
      FROM nurturing_sequences
      WHERE name = 'Lead Quente - Conversão'
        AND is_active = true
        AND trigger_event = 'score_threshold'
      LIMIT 1;
      v_should_enroll := true;
    END IF;
  END IF;
  
  -- 2. Lifecycle stage mudou
  IF OLD.lifecycle_stage IS DISTINCT FROM NEW.lifecycle_stage THEN
    -- Se virou MQL (Marketing Qualified Lead)
    IF NEW.lifecycle_stage = 'mql' THEN
      SELECT id, name INTO v_sequence_id, v_sequence_name
      FROM nurturing_sequences
      WHERE trigger_event = 'lifecycle_change'
        AND conditions->>'lifecycle_stage' = 'mql'
        AND is_active = true
      LIMIT 1;
      v_should_enroll := true;
    
    -- Se virou SQL (Sales Qualified Lead)
    ELSIF NEW.lifecycle_stage = 'sql' THEN
      SELECT id, name INTO v_sequence_id, v_sequence_name
      FROM nurturing_sequences
      WHERE trigger_event = 'lifecycle_change'
        AND conditions->>'lifecycle_stage' = 'sql'
        AND is_active = true
      LIMIT 1;
      v_should_enroll := true;
    END IF;
  END IF;
  
  -- 3. Se deve inscrever e encontrou sequência adequada
  IF v_should_enroll AND v_sequence_id IS NOT NULL THEN
    -- Verificar se já não está inscrito nesta sequência
    IF NOT EXISTS (
      SELECT 1 FROM nurturing_enrollments
      WHERE contact_id = NEW.id
        AND sequence_id = v_sequence_id
        AND status IN ('active', 'paused')
    ) THEN
      -- Criar enrollment
      INSERT INTO nurturing_enrollments (
        contact_id,
        sequence_id,
        status,
        current_step_index,
        started_at,
        next_action_at,
        metadata
      )
      VALUES (
        NEW.id,
        v_sequence_id,
        'active',
        0,
        now(),
        now(), -- Executar primeiro step imediatamente
        jsonb_build_object(
          'trigger_reason', CASE
            WHEN OLD.lead_score IS DISTINCT FROM NEW.lead_score THEN 'score_change'
            WHEN OLD.lifecycle_stage IS DISTINCT FROM NEW.lifecycle_stage THEN 'lifecycle_change'
            ELSE 'auto_enroll'
          END,
          'previous_score', OLD.lead_score,
          'new_score', NEW.lead_score,
          'previous_lifecycle', OLD.lifecycle_stage,
          'new_lifecycle', NEW.lifecycle_stage,
          'enrolled_at', now()
        )
      );
      
      -- Log no audit
      INSERT INTO crm_audit_log (
        entity_type,
        entity_id,
        action_type,
        changed_by,
        change_description,
        metadata
      )
      VALUES (
        'contact',
        NEW.id,
        'nurturing_enrolled',
        auth.uid(),
        'Contato inscrito automaticamente na sequência: ' || v_sequence_name,
        jsonb_build_object(
          'sequence_id', v_sequence_id,
          'sequence_name', v_sequence_name,
          'score_change', OLD.lead_score || ' → ' || NEW.lead_score,
          'lifecycle_change', OLD.lifecycle_stage || ' → ' || NEW.lifecycle_stage
        )
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Criar trigger para auto-enrollment
DROP TRIGGER IF EXISTS trigger_auto_enroll_nurturing ON public.crm_contacts;
CREATE TRIGGER trigger_auto_enroll_nurturing
  AFTER INSERT OR UPDATE OF lead_score, lifecycle_stage
  ON public.crm_contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_enroll_in_nurturing_sequence();

-- Função auxiliar para inscrever manualmente um contato
CREATE OR REPLACE FUNCTION public.manual_enroll_contact(
  p_contact_id UUID,
  p_sequence_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_enrollment_id UUID;
  v_sequence_name TEXT;
BEGIN
  -- Verificar se sequência existe e está ativa
  SELECT name INTO v_sequence_name
  FROM nurturing_sequences
  WHERE id = p_sequence_id AND is_active = true;
  
  IF v_sequence_name IS NULL THEN
    RAISE EXCEPTION 'Sequência não encontrada ou inativa';
  END IF;
  
  -- Verificar se já não está inscrito
  IF EXISTS (
    SELECT 1 FROM nurturing_enrollments
    WHERE contact_id = p_contact_id
      AND sequence_id = p_sequence_id
      AND status IN ('active', 'paused')
  ) THEN
    RAISE EXCEPTION 'Contato já está inscrito nesta sequência';
  END IF;
  
  -- Criar enrollment
  INSERT INTO nurturing_enrollments (
    contact_id,
    sequence_id,
    status,
    current_step_index,
    started_at,
    next_action_at,
    metadata
  )
  VALUES (
    p_contact_id,
    p_sequence_id,
    'active',
    0,
    now(),
    now(),
    jsonb_build_object(
      'trigger_reason', 'manual_enrollment',
      'enrolled_by', auth.uid(),
      'enrolled_at', now()
    )
  )
  RETURNING id INTO v_enrollment_id;
  
  -- Log no audit
  INSERT INTO crm_audit_log (
    entity_type,
    entity_id,
    action_type,
    changed_by,
    change_description,
    metadata
  )
  VALUES (
    'contact',
    p_contact_id,
    'nurturing_enrolled',
    auth.uid(),
    'Contato inscrito manualmente na sequência: ' || v_sequence_name,
    jsonb_build_object(
      'sequence_id', p_sequence_id,
      'sequence_name', v_sequence_name,
      'enrollment_id', v_enrollment_id
    )
  );
  
  RETURN v_enrollment_id;
END;
$$;