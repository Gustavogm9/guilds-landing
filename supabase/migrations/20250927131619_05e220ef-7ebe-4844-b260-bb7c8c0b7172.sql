-- POPULAR ALGUMAS CLÁUSULAS BÁSICAS PARA TESTE (corrigido com JSONB)
INSERT INTO public.legal_clauses (group_id, title, content_markdown, is_locked_by_legal, variables, tags) 
SELECT 
  id, 
  'Contratante Pessoa Jurídica', 
  'CONTRATANTE: **{CONTRATANTE_NOME}**, pessoa jurídica de direito privado, inscrita no CNPJ sob nº {CONTRATANTE_CNPJ}, com sede na {CONTRATANTE_ENDERECO}, neste ato representada por {CONTRATANTE_REPRESENTANTE}.', 
  true, 
  '["CONTRATANTE_NOME", "CONTRATANTE_CNPJ", "CONTRATANTE_ENDERECO", "CONTRATANTE_REPRESENTANTE"]'::jsonb, 
  ARRAY['empresa', 'cnpj']::text[]
FROM public.legal_clause_groups WHERE name = 'Identificação das Partes'
LIMIT 1;

INSERT INTO public.legal_clauses (group_id, title, content_markdown, is_locked_by_legal, variables, tags) 
SELECT 
  id, 
  'Contratada Guilds', 
  'CONTRATADA: **GUILDS DESENVOLVIMENTO DE SOFTWARE LTDA**, pessoa jurídica de direito privado, inscrita no CNPJ sob nº 00.000.000/0001-00, com sede na Rua das Startups, 100, São Paulo/SP, neste ato representada por seus sócios administradores.', 
  true, 
  '[]'::jsonb, 
  ARRAY['guilds', 'prestadora']::text[]
FROM public.legal_clause_groups WHERE name = 'Identificação das Partes'
LIMIT 1;

INSERT INTO public.legal_clauses (group_id, title, content_markdown, is_locked_by_legal, variables, tags) 
SELECT 
  id, 
  'Desenvolvimento de Software', 
  'A CONTRATADA prestará serviços de **desenvolvimento de software personalizado** denominado "{OBJETO_TITULO}", conforme especificações técnicas e funcionais definidas em conjunto com o CONTRATANTE.', 
  false, 
  '["OBJETO_TITULO"]'::jsonb, 
  ARRAY['software', 'customizado']::text[]
FROM public.legal_clause_groups WHERE name = 'Objeto do Contrato'
LIMIT 1;

INSERT INTO public.legal_clauses (group_id, title, content_markdown, is_locked_by_legal, variables, tags) 
SELECT 
  id, 
  'Valor Total', 
  'O valor total dos serviços é de **R$ {VALOR_TOTAL}** ({VALOR_EXTENSO}), já inclusos todos os tributos incidentes.', 
  false, 
  '["VALOR_TOTAL", "VALOR_EXTENSO"]'::jsonb, 
  ARRAY['valor', 'preco']::text[]
FROM public.legal_clause_groups WHERE name = 'Valores e Pagamento'
LIMIT 1;

INSERT INTO public.legal_clauses (group_id, title, content_markdown, is_locked_by_legal, variables, tags) 
SELECT 
  id, 
  'Prazo de Entrega', 
  'O prazo total para conclusão dos serviços é de **{PRAZO_TOTAL}**, contado a partir da assinatura deste contrato e do primeiro pagamento.', 
  false, 
  '["PRAZO_TOTAL"]'::jsonb, 
  ARRAY['prazo', 'cronograma']::text[]
FROM public.legal_clause_groups WHERE name = 'Prazos e Cronograma'
LIMIT 1;