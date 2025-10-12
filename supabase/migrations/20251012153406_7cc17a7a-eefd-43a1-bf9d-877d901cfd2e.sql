-- Corrigir search_path mutable nas novas funções de propostas

CREATE OR REPLACE FUNCTION generate_proposal_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_year TEXT;
  v_sequence INTEGER;
BEGIN
  v_year := EXTRACT(YEAR FROM now())::TEXT;
  
  SELECT COALESCE(MAX(
    CASE 
      WHEN proposal_number ~ ('^PROP-' || v_year || '-\d+$') 
      THEN CAST(SUBSTRING(proposal_number FROM '\d+$') AS INTEGER)
      ELSE 0 
    END
  ), 0) + 1 INTO v_sequence
  FROM proposals;
  
  RETURN 'PROP-' || v_year || '-' || LPAD(v_sequence::TEXT, 4, '0');
END;
$$;

CREATE OR REPLACE FUNCTION set_proposal_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.proposal_number IS NULL THEN
    NEW.proposal_number = generate_proposal_number();
  END IF;
  RETURN NEW;
END;
$$;