-- Seed Data: Templates e Catálogo de Preços (estrutura correta)
-- Template padrão de proposta
INSERT INTO proposal_templates (
  name,
  schema,
  is_default,
  is_active
) VALUES (
  'Proposta Padrão Guilds',
  '{
    "sections": {
      "introducao": {
        "title": "Introdução",
        "content": "Agradecemos pela oportunidade de apresentar esta proposta comercial."
      },
      "problema": {
        "title": "Desafio Identificado",
        "content": "Desafios e oportunidades mapeadas."
      },
      "solucao": {
        "title": "Solução Proposta",
        "content": "Nossa proposta de solução sob medida."
      },
      "cronograma": {
        "title": "Cronograma de Entrega",
        "content": "Entrega em sprints incrementais."
      },
      "investimento": {
        "title": "Investimento",
        "content": "Investimento necessário."
      },
      "pagamento": {
        "title": "Condições de Pagamento",
        "content": "Modelo de pagamento parcelado."
      }
    }
  }'::jsonb,
  true,
  true
) ON CONFLICT DO NOTHING;

-- Catálogo de Preços: Planos de Manutenção (sem coluna description)
INSERT INTO proposal_pricing_catalog (
  category,
  name,
  value,
  currency,
  benefits,
  is_active,
  display_order
) VALUES 
(
  'maintenance',
  'Basic',
  500.00,
  'BRL',
  '["Monitoramento 24/7", "Backup diário automático", "Suporte por e-mail (48h)", "Atualizações de segurança", "1 hora/mês de suporte técnico"]'::jsonb,
  true,
  1
),
(
  'maintenance',
  'Steady',
  1200.00,
  'BRL',
  '["Tudo do Basic", "Suporte prioritário (24h)", "4 horas/mês de desenvolvimento", "Relatórios mensais de performance", "Otimizações de performance", "Chat direto com equipe técnica"]'::jsonb,
  true,
  2
),
(
  'maintenance',
  'Growth',
  2500.00,
  'BRL',
  '["Tudo do Steady", "Suporte 24/7 com SLA garantido", "10 horas/mês de desenvolvimento", "Reuniões mensais de planejamento", "Acesso a recursos experimentais", "Consultoria estratégica trimestral", "Prioridade máxima em novas features"]'::jsonb,
  true,
  3
)
ON CONFLICT DO NOTHING;