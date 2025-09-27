-- POPULAR TEMPLATES INICIAIS (corrigido com default_groups)
INSERT INTO public.legal_templates (name, description, contract_type, is_default, is_active, default_groups) VALUES
('Desenvolvimento Padrão', 'Template padrão para projetos de desenvolvimento de software sem licenciamento', 'software', true, true, ARRAY[]::uuid[]),
('White-Label Premium', 'Template completo para projetos white-label com licenciamento e manutenção', 'white_label', true, true, ARRAY[]::uuid[]),
('Projeto Empresarial', 'Template para grandes projetos empresariais com cláusulas completas', 'enterprise', false, true, ARRAY[]::uuid[]);