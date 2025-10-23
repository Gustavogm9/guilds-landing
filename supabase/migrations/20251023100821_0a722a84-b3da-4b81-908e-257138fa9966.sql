-- Update trigger function to use correct URLs for notifications
CREATE OR REPLACE FUNCTION notify_deal_stage_change()
RETURNS TRIGGER AS $$
DECLARE
  v_stage_name TEXT;
  v_pipeline_name TEXT;
BEGIN
  -- Get stage and pipeline names
  SELECT s.name, p.name INTO v_stage_name, v_pipeline_name
  FROM crm_stages s
  JOIN crm_pipelines p ON s.pipeline_id = p.id
  WHERE s.id = NEW.stage_id;

  -- Create notification with correct URL format
  INSERT INTO crm_notifications (
    entity_type,
    entity_id,
    notification_type,
    priority,
    title,
    message,
    action_url,
    action_label,
    metadata
  ) VALUES (
    'deal',
    NEW.id,
    'deal_stage_change',
    CASE 
      WHEN v_stage_name ILIKE '%ganho%' OR v_stage_name ILIKE '%fechado%' THEN 'high'
      ELSE 'medium'
    END,
    'Oportunidade Movida',
    'A oportunidade "' || NEW.title || '" foi movida para ' || v_stage_name || ' no pipeline ' || v_pipeline_name,
    '/admin/crm/board?deal=' || NEW.id,
    'Ver Oportunidade',
    jsonb_build_object(
      'old_stage_id', OLD.stage_id,
      'new_stage_id', NEW.stage_id,
      'stage_name', v_stage_name,
      'pipeline_name', v_pipeline_name
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update trigger for new deals to use correct URL format
CREATE OR REPLACE FUNCTION notify_new_deal()
RETURNS TRIGGER AS $$
DECLARE
  v_stage_name TEXT;
  v_pipeline_name TEXT;
BEGIN
  -- Get stage and pipeline names
  SELECT s.name, p.name INTO v_stage_name, v_pipeline_name
  FROM crm_stages s
  JOIN crm_pipelines p ON s.pipeline_id = p.id
  WHERE s.id = NEW.stage_id;

  -- Create notification with correct URL format
  INSERT INTO crm_notifications (
    entity_type,
    entity_id,
    notification_type,
    priority,
    title,
    message,
    action_url,
    action_label,
    metadata
  ) VALUES (
    'deal',
    NEW.id,
    'new_deal',
    'medium',
    'Nova Oportunidade Criada',
    'Uma nova oportunidade "' || NEW.title || '" foi criada no pipeline ' || v_pipeline_name,
    '/admin/crm/board?deal=' || NEW.id,
    'Ver Oportunidade',
    jsonb_build_object(
      'stage_name', v_stage_name,
      'pipeline_name', v_pipeline_name,
      'value', NEW.value
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;