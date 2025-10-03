-- Create CRM Audit Log table
CREATE TABLE public.crm_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('deal', 'contact', 'interaction')),
  entity_id UUID NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('created', 'updated', 'stage_changed', 'deleted')),
  field_name TEXT,
  old_value TEXT,
  new_value TEXT,
  changed_by UUID REFERENCES auth.users(id),
  change_description TEXT,
  is_manual_edit BOOLEAN DEFAULT false,
  event_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.crm_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Authenticated users can view audit logs"
  ON public.crm_audit_log FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create audit logs"
  ON public.crm_audit_log FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update their manual edits"
  ON public.crm_audit_log FOR UPDATE
  TO authenticated
  USING (is_manual_edit = true)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Indexes for performance
CREATE INDEX idx_crm_audit_log_entity ON public.crm_audit_log(entity_type, entity_id);
CREATE INDEX idx_crm_audit_log_timestamp ON public.crm_audit_log(event_timestamp DESC);
CREATE INDEX idx_crm_audit_log_changed_by ON public.crm_audit_log(changed_by);

-- Function to log CRM deal changes
CREATE OR REPLACE FUNCTION public.log_crm_deal_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_contact_name TEXT;
  v_stage_name TEXT;
  v_old_stage_name TEXT;
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Log deal creation
    SELECT c.name INTO v_contact_name 
    FROM public.crm_contacts c 
    WHERE c.id = NEW.contact_id;
    
    SELECT s.name INTO v_stage_name 
    FROM public.crm_stages s 
    WHERE s.id = NEW.stage_id;
    
    INSERT INTO public.crm_audit_log (
      entity_type, entity_id, action_type, changed_by, change_description, metadata
    ) VALUES (
      'deal', NEW.id, 'created', auth.uid(),
      'Deal criado: ' || NEW.title,
      jsonb_build_object(
        'title', NEW.title,
        'contact_name', v_contact_name,
        'stage_name', v_stage_name,
        'value', NEW.value,
        'currency', NEW.currency
      )
    );
    
    RETURN NEW;
    
  ELSIF TG_OP = 'UPDATE' THEN
    -- Log stage change
    IF OLD.stage_id != NEW.stage_id THEN
      SELECT s.name INTO v_old_stage_name FROM public.crm_stages s WHERE s.id = OLD.stage_id;
      SELECT s.name INTO v_stage_name FROM public.crm_stages s WHERE s.id = NEW.stage_id;
      
      INSERT INTO public.crm_audit_log (
        entity_type, entity_id, action_type, field_name, old_value, new_value, changed_by, change_description, metadata
      ) VALUES (
        'deal', NEW.id, 'stage_changed', 'stage_id', v_old_stage_name, v_stage_name, auth.uid(),
        'Stage alterado de "' || v_old_stage_name || '" para "' || v_stage_name || '"',
        jsonb_build_object('old_stage_id', OLD.stage_id, 'new_stage_id', NEW.stage_id)
      );
    END IF;
    
    -- Log value change
    IF COALESCE(OLD.value, 0) != COALESCE(NEW.value, 0) THEN
      INSERT INTO public.crm_audit_log (
        entity_type, entity_id, action_type, field_name, old_value, new_value, changed_by, change_description, metadata
      ) VALUES (
        'deal', NEW.id, 'updated', 'value', 
        COALESCE(OLD.value::TEXT, 'não definido'), 
        COALESCE(NEW.value::TEXT, 'não definido'), 
        auth.uid(),
        'Valor alterado de ' || COALESCE(OLD.currency || ' ' || OLD.value::TEXT, 'não definido') || 
        ' para ' || COALESCE(NEW.currency || ' ' || NEW.value::TEXT, 'não definido'),
        jsonb_build_object('old_value', OLD.value, 'new_value', NEW.value, 'currency', NEW.currency)
      );
    END IF;
    
    -- Log title change
    IF OLD.title != NEW.title THEN
      INSERT INTO public.crm_audit_log (
        entity_type, entity_id, action_type, field_name, old_value, new_value, changed_by, change_description
      ) VALUES (
        'deal', NEW.id, 'updated', 'title', OLD.title, NEW.title, auth.uid(),
        'Título alterado de "' || OLD.title || '" para "' || NEW.title || '"'
      );
    END IF;
    
    RETURN NEW;
    
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.crm_audit_log (
      entity_type, entity_id, action_type, changed_by, change_description, metadata
    ) VALUES (
      'deal', OLD.id, 'deleted', auth.uid(),
      'Deal deletado: ' || OLD.title,
      jsonb_build_object('title', OLD.title, 'value', OLD.value)
    );
    
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$;

-- Trigger for deal changes
CREATE TRIGGER trg_log_crm_deal_changes
AFTER INSERT OR UPDATE OR DELETE ON public.crm_deals
FOR EACH ROW EXECUTE FUNCTION public.log_crm_deal_changes();

-- Function to log contact changes
CREATE OR REPLACE FUNCTION public.log_crm_contact_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.crm_audit_log (
      entity_type, entity_id, action_type, changed_by, change_description, metadata
    ) VALUES (
      'contact', NEW.id, 'created', auth.uid(),
      'Contato criado: ' || NEW.name,
      jsonb_build_object('name', NEW.name, 'email', NEW.email, 'source', NEW.source)
    );
    RETURN NEW;
    
  ELSIF TG_OP = 'UPDATE' THEN
    -- Log lifecycle stage change
    IF OLD.lifecycle_stage != NEW.lifecycle_stage THEN
      INSERT INTO public.crm_audit_log (
        entity_type, entity_id, action_type, field_name, old_value, new_value, changed_by, change_description
      ) VALUES (
        'contact', NEW.id, 'updated', 'lifecycle_stage', OLD.lifecycle_stage, NEW.lifecycle_stage, auth.uid(),
        'Lifecycle alterado de "' || OLD.lifecycle_stage || '" para "' || NEW.lifecycle_stage || '"'
      );
    END IF;
    
    RETURN NEW;
  END IF;
  
  RETURN NULL;
END;
$$;

-- Trigger for contact changes
CREATE TRIGGER trg_log_crm_contact_changes
AFTER INSERT OR UPDATE ON public.crm_contacts
FOR EACH ROW EXECUTE FUNCTION public.log_crm_contact_changes();