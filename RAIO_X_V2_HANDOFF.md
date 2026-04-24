# Raio-X Guilds V2 · Handoff Técnico

**Documento:** PRD + Arquitetura + Design de Sistema
**Data:** 2026-04-23
**Owner produto:** Gustavo Macedo (Guilds)
**Status:** Aprovado para implementação
**Versão:** 1.0

---

## Sumário

- [1. PRD (Product Requirements)](#1-prd)
- [2. Arquitetura](#2-arquitetura)
- [3. Design de Sistema](#3-design-de-sistema)
- [4. Plano de Entrega](#4-plano-de-entrega)
- [5. Handoff Checklist](#5-handoff-checklist)

---

# 1. PRD

## 1.1. Visão do produto

O Raio-X G-FORGE é um diagnóstico digital de maturidade operacional que entrega ao cliente um relatório profissional utilizável internamente e, ao mesmo tempo, qualifica o lead para o time comercial da Guilds.

A premissa central é dupla: o cliente sai feliz com um entregável real que pode apresentar à sua diretoria, e a Guilds sai com um dossiê de qualificação comercial rico o suficiente para abrir uma reunião sem "descoberta inicial". Não é um quiz de lead magnet, é um produto consultivo automatizado.

## 1.2. Objetivos do negócio

**Objetivo primário.** Aumentar volume e qualidade de leads SQL para o time comercial Guilds. Meta: 40 diagnósticos completos por mês, dos quais 25% viram reunião agendada e 30% das reuniões viram proposta.

**Objetivos secundários.**

1. Gerar receita direta via plano Diagnóstico R$ 97 único e plano recorrente R$ 47 a R$ 97 por mês (fase 2).
2. Construir uma base de dados proprietária de benchmarks setoriais que alimenta o próprio diagnóstico.
3. Posicionar a Guilds como autoridade em metodologia (G-FORGE) e não como fornecedor de ferramenta.
4. Criar um ativo viral: cliente compartilha com sócios e diretoria, gerando leads indiretos.

## 1.3. Personas

### Persona 1: Decisor operacional (target primário)
- Cargo: Sócio, diretor, CEO ou COO de operação com 30 a 150 funcionários
- Faturamento da empresa: R$ 3M a R$ 30M por ano
- Setores principais: saúde, serviços profissionais, operações, fintech
- Dor: tentou modernizar sistemas antes, projeto travou, suspeita que o problema não é o software
- Critério de decisão: evidência concreta (números justificáveis, cases comparáveis, risco baixo)
- Barreira: ceticismo de consultoria genérica, medo de gastar R$ 50k e não resolver

### Persona 2: Líder de inovação (influenciador)
- Cargo: Head de TI, head de operações, líder de transformação
- Função no ciclo: faz o diagnóstico e leva pra decisão do sócio
- Necessidade: ferramenta que valide suas hipóteses internas com dados externos
- Critério: transparência metodológica, possibilidade de compartilhar read-only

### Persona 3: Vendedor Guilds (usuário interno)
- Cargo: Consultor comercial
- Uso: recebe o diagnóstico preenchido via CRM e abre a reunião de 30 min
- Necessidade: dossiê rico com sinais de intenção, dor específica, orçamento provável
- Critério: qualificação automática que filtra leads frios antes de ocupar sua agenda

## 1.4. Jornada completa do usuário

```
[Descoberta]          [Onboarding]          [Processamento]        [Entrega]              [Conversão]
 Landing page    →    Cadastro + 5 blocos →  Cálculo + Claude  →   Dashboard + PDF   →   Reunião 30min
 "Fazer Raio-X"        23 perguntas           45 a 90 segundos       Share com board       Proposta em 48h
                       Salvo a cada step      progress bar           Salvo 12 meses
```

### Fase 1: Descoberta
O usuário chega à página `/raio-x` vinda da landing principal ou de tráfego pago. O hero explica em uma linha a proposta: "Descubra em 10 minutos o que está travando sua operação, em R$ e em plano de ação". CTA único: "Fazer Raio-X Gratuito".

### Fase 2: Cadastro
Modal ou página dedicada com cadastro via e-mail e senha, ou magic link. Campos mínimos: nome, e-mail, nome da empresa. A conta é criada no Supabase auth e um registro em `profiles` é gerado. O diagnóstico em `draft` é criado na mesma ação.

### Fase 3: Onboarding (5 blocos, ~20 a 23 perguntas)

**Bloco 1. Perfil da empresa** (5 perguntas)
Setor, número de funcionários, faturamento, modelo de negócio, ticket médio.

**Bloco 2. Operação e sistemas** (5 perguntas)
Sistemas em uso, adoção percentual, sistemas fantasmas, integração entre sistemas, horas em tarefas repetitivas.

**Bloco 3. Comercial e marketing** (4 perguntas)
Estrutura da equipe de marketing, origem dos leads, objeções mais comuns (aberta), stack comercial.

**Bloco 4. Marca e comunicação** (4 perguntas)
URL do site, canais digitais ativos, diferenciais declarados (aberta), última revisão de posicionamento.

**Bloco 5. Objetivos e histórico** (5 perguntas)
Objetivos 12 meses (múltipla), histórico de abandono de sistemas, motivo do abandono, responsável por adoção de tecnologia, maior dor operacional (aberta).

Cada "Próximo" persiste as respostas em `diagnostic_answers` via `upsert`. Se o usuário fecha a aba, pode retomar do ponto exato.

### Fase 4: Processamento
Animação de 45 a 90 segundos mostrando o progresso real: "Calculando scores", "Analisando benchmarks", "Gerando recomendações", "Montando plano de ação". Por trás, a Edge Function `raiox-generate-report` roda em 3 estágios:

1. Motor de regras em TypeScript calcula scores, perda financeira, fase G-FORGE e Fit de parceria
2. Claude (via Anthropic SDK) gera narrativas por seção e plano de ação
3. Edge Function monta o JSON final e atualiza `diagnostic_scores` e `diagnostic_narratives`

### Fase 5: Entrega
Dashboard multi-aba (Raio-X, Planejamento, Caminho Guilds, Sua Empresa) renderiza o diagnóstico completo. Três ações primárias disponíveis:

- Agendar reunião de 30 min (redireciona ao Calendly)
- Baixar PDF (Edge Function `raiox-export-pdf` gera assíncrono e envia link por e-mail)
- Compartilhar com diretoria (gera link público read-only de 30 dias)

### Fase 6: Conversão
O lead entra no pipeline comercial. Se agenda Calendly, o webhook `calendly-booking` dispara um e-mail interno para o vendedor com link do diagnóstico e dossiê de qualificação.

### Fase 7: Retenção e reengajamento
Aos 30, 90, 180 e 330 dias, e-mails automáticos convidam o usuário a voltar ao diagnóstico, atualizar respostas ou refazer. Isso alimenta reengajamento e cria sinal para o vendedor ("cliente atualizou diagnóstico hoje").

## 1.5. Escopo do MVP e próximas fases

### MVP (v1.0) · 5 sprints
- Auth e onboarding de 5 blocos com persistência
- Motor de regras + Claude para narrativas
- Dashboard multi-aba completo conforme protótipo HTML
- Exportação PDF e share-with-board
- Integração Calendly para CTA
- Painel interno Guilds vendo leads e scores
- LGPD: política de privacidade publicada, criptografia em repouso e trânsito

### v1.1 · 2 sprints (pós-MVP)
- Plano recorrente R$ 47/mês com paywall via Stripe ou Hotmart
- E-mails automáticos de reengajamento (30, 90, 180, 330 dias)
- Dashboard com "última atualização" e comparativo histórico
- Integração com HubSpot ou RD Station CRM

### v2.0 · incremental
- Chat AI pós-diagnóstico com skills especializadas por setor
- Integrações de dados: Meta Ads, Google Ads, HubSpot para auditoria automática
- Auditoria visual do site automatizada (scraping + Claude Vision)
- Benchmark dinâmico: comparação em tempo real com clientes semelhantes

## 1.6. Critérios de aceitação do MVP

Um MVP pronto para produção precisa atender a todos os critérios abaixo:

1. Usuário cria conta e completa os 5 blocos em menos de 15 minutos
2. Dashboard renderiza em menos de 3 segundos após processamento
3. PDF é gerado em menos de 30 segundos e chega por e-mail
4. Todo número exibido tem fonte clicável ou composição auditável
5. Share-link funciona em anônimo e expira em 30 dias
6. Dois perfis de Fit (alto e baixo) geram dashboards visivelmente diferentes na aba Caminho Guilds
7. Motor de regras é 100% determinístico: mesmas respostas produzem mesmos scores
8. Claude não alucina números: fatos numéricos vêm do motor de regras, Claude só gera texto
9. Dados pessoais são acessíveis apenas pelo dono da conta e por admins Guilds autenticados (RLS)
10. Todos os CTAs comerciais passam pelo Calendly parametrizado via env var

## 1.7. KPIs de sucesso

### Produto
- Taxa de conclusão do onboarding: >= 70%
- Tempo médio de preenchimento: <= 12 minutos
- Taxa de geração de PDF: >= 40% dos diagnósticos completos
- Taxa de share-link gerado: >= 25% dos diagnósticos completos

### Comercial
- Taxa de agendamento de reunião: >= 25% dos diagnósticos completos
- Taxa de show-up na reunião: >= 80%
- Taxa de conversão reunião → proposta: >= 30%
- Ticket médio da proposta: >= R$ 45k

### Técnico
- Uptime: >= 99,5%
- Latência P95 do dashboard: <= 2s
- Latência P95 do processamento: <= 90s
- Erro de geração Claude: <= 2% por execução

---

# 2. Arquitetura

## 2.1. Stack

### Frontend
- React 18 + TypeScript (Vite)
- Tailwind CSS + shadcn/ui (já estabelecidos no `guilds-landing`)
- TanStack Query (React Query) para estado de servidor
- React Hook Form + Zod para formulários e validação
- Recharts para radar chart e visualizações
- Framer Motion para transições (opcional, já temos Tailwind animate-in)

### Backend
- Supabase (projeto dedicado: `guilds-raiox`, região sa-east-1)
- Edge Functions em Deno (Supabase Functions)
- PostgreSQL gerenciado pelo Supabase
- Supabase Auth (e-mail/senha + magic link)
- Supabase Storage para PDFs gerados

### LLM e serviços
- Anthropic Claude Sonnet 4.6 via Edge Function (nunca no cliente)
- Calendly (link parametrizado)
- Resend ou SendGrid para e-mails transacionais
- Puppeteer (via @sparticuz/chromium em Deno) ou react-pdf para geração de PDF

### Infraestrutura
- Vercel ou Cloudflare Pages para o frontend (o `guilds-landing` atual provavelmente já está em um dos dois)
- Supabase hosted (plano Pro recomendado para pronto uso em produção)
- Cloudflare para CDN e DDoS
- Sentry para observabilidade

## 2.2. Diagrama lógico

```
 ┌─────────────────────────────────────────────────────────────────────────┐
 │                            USUÁRIO                                       │
 └──────────────────────────────┬──────────────────────────────────────────┘
                                │ https
                                ▼
 ┌─────────────────────────────────────────────────────────────────────────┐
 │                     FRONTEND · guilds-landing                            │
 │    /raio-x  · React + Vite · TanStack Query · Tailwind · shadcn/ui       │
 │                                                                          │
 │   Pages:  RaioX (shell)                                                  │
 │            ├─ RaioXIntro       (landing + CTA)                           │
 │            ├─ RaioXAuth        (cadastro / login)                        │
 │            ├─ RaioXOnboarding  (5 blocos, persistência por step)         │
 │            ├─ RaioXProcessing  (polling de status)                       │
 │            └─ RaioXDashboard   (4 abas)                                  │
 │                                                                          │
 │   Hooks:   useRaioXSession · useDiagnostic · useGenerateReport           │
 │   Store:   Supabase Auth + TanStack Query cache                          │
 └──────────────────────────────┬──────────────────────────────────────────┘
                                │ JS SDK + REST + realtime
                                ▼
 ┌─────────────────────────────────────────────────────────────────────────┐
 │                   BACKEND · Supabase (guilds-raiox)                      │
 │                                                                          │
 │   ┌─────────────┐   ┌─────────────────┐   ┌──────────────────────────┐  │
 │   │  Auth       │   │  PostgreSQL     │   │  Edge Functions (Deno)   │  │
 │   │ e-mail+pwd  │   │  + RLS por user │   │                          │  │
 │   │ magic link  │   │                 │   │  raiox-generate-report   │  │
 │   └─────────────┘   │  profiles       │   │  raiox-calculate-scores  │  │
 │                     │  diagnostics    │   │  raiox-export-pdf        │  │
 │   ┌─────────────┐   │  answers        │   │  raiox-send-email        │  │
 │   │  Storage    │   │  scores         │   │  raiox-share-link        │  │
 │   │  pdfs/*     │   │  narratives     │   │  raiox-webhook-calendly  │  │
 │   └─────────────┘   │  purchases      │   │  raiox-webhook-payment   │  │
 │                     │  share_tokens   │   │                          │  │
 │                     └─────────────────┘   └──────────┬───────────────┘  │
 └─────────────────────────────────────────────────────┬┴──────────────────┘
                                                       │
                          ┌────────────────────────────┼────────────────────────────┐
                          ▼                            ▼                            ▼
               ┌────────────────────┐       ┌────────────────────┐        ┌─────────────────┐
               │  Anthropic API     │       │  Resend / SendGrid │        │    Calendly     │
               │  Claude Sonnet 4.6 │       │  (e-mails transac) │        │  (webhook bkng) │
               └────────────────────┘       └────────────────────┘        └─────────────────┘
```

## 2.3. Componentes principais

### Frontend: estrutura de pastas

```
src/
├── pages/
│   └── RaioX.tsx                    // Shell com roteamento interno
├── components/
│   └── raiox/
│       ├── intro/
│       │   ├── RaioXHero.tsx
│       │   └── RaioXFeatures.tsx
│       ├── auth/
│       │   ├── SignUpForm.tsx
│       │   └── LoginForm.tsx
│       ├── onboarding/
│       │   ├── OnboardingShell.tsx           // progresso + navegação
│       │   ├── Block1Profile.tsx
│       │   ├── Block2Systems.tsx
│       │   ├── Block3Commercial.tsx
│       │   ├── Block4Brand.tsx
│       │   ├── Block5Goals.tsx
│       │   └── fields/                        // inputs reutilizáveis
│       │       ├── OptionCard.tsx
│       │       ├── CheckCard.tsx
│       │       └── FreeTextField.tsx
│       ├── processing/
│       │   └── ProcessingAnimation.tsx
│       └── dashboard/
│           ├── DashboardShell.tsx             // layout com tabs + right rail
│           ├── HeroKpis.tsx                   // os 4 KPIs
│           ├── GForgeJourneyStrip.tsx
│           ├── IfYouDoNothing.tsx
│           ├── tabs/
│           │   ├── RaioXTab.tsx
│           │   ├── PlanningTab.tsx
│           │   ├── GuildsPathTab.tsx
│           │   └── CompanyTab.tsx
│           ├── subtabs/
│           │   ├── MaturityRadar.tsx          // inclui tabela delta
│           │   ├── MarketAnalysis.tsx
│           │   ├── CommunicationAudit.tsx
│           │   ├── SmartObjectives.tsx
│           │   ├── ActionPlan.tsx             // cards colapsáveis + Gantt
│           │   └── KpisPanel.tsx
│           ├── rails/
│           │   ├── FitScorePanel.tsx
│           │   ├── NextStepPanel.tsx
│           │   ├── ShareWithBoardPanel.tsx
│           │   └── AssetsPanel.tsx
│           └── common/
│               ├── HowWeCalculated.tsx        // <details> padronizado
│               ├── MethodologyModal.tsx
│               ├── ConsultantCard.tsx
│               └── CaseStudyCard.tsx
├── integrations/
│   └── supabase-raiox/
│       ├── client.ts                          // createClient(VITE_SUPABASE_RAIOX_URL, ...)
│       ├── types.ts                           // gerado via supabase gen types
│       └── queries/
│           ├── diagnostics.ts
│           ├── answers.ts
│           ├── scores.ts
│           └── narratives.ts
├── hooks/
│   ├── useRaioXSession.ts
│   ├── useDiagnostic.ts
│   ├── useSaveAnswer.ts
│   ├── useGenerateReport.ts
│   └── useShareLink.ts
├── utils/
│   ├── raiox-logic.ts                         // regras determinísticas
│   ├── raiox-calculations.ts                  // perda, score, fit
│   └── raiox-constants.ts                     // fases G-FORGE, setores
└── types/
    └── raiox.ts                               // tipos compartilhados
```

### Backend: Edge Functions

Cada Edge Function tem um contrato bem definido (ver seção 3.3).

```
supabase-raiox/
├── config.toml
├── migrations/
│   └── 20260424000000_initial_schema.sql
└── functions/
    ├── _shared/
    │   ├── cors.ts
    │   ├── supabase-admin.ts
    │   └── anthropic.ts
    ├── raiox-generate-report/
    │   ├── index.ts
    │   ├── rules-engine.ts
    │   └── prompts/
    │       ├── system.ts
    │       ├── maturity.ts
    │       ├── market.ts
    │       ├── communication.ts
    │       ├── smart-objectives.ts
    │       ├── action-plan.ts
    │       └── kpis.ts
    ├── raiox-export-pdf/
    │   ├── index.ts
    │   └── template.ts
    ├── raiox-send-email/
    │   └── index.ts
    ├── raiox-share-link/
    │   └── index.ts
    ├── raiox-webhook-calendly/
    │   └── index.ts
    └── raiox-webhook-payment/
        └── index.ts
```

## 2.4. Integrações externas

### Anthropic Claude Sonnet 4.6
- Uso: geração de narrativas e plano de ação
- Autenticação: API key em `ANTHROPIC_API_KEY` (só em Edge Functions, nunca no cliente)
- Rate limit: 50 requisições concorrentes, 4000 tokens por resposta
- Fallback: se a API falhar, Edge Function retorna `status=partial` com os scores prontos e retenta assincronamente

### Calendly
- Uso: CTA de agendamento
- Parametrização: URL base em `VITE_CALENDLY_URL` + query params (`?utm_source=raio-x&diagnostic_id={id}&fit_score={score}`)
- Webhook: Calendly notifica `raiox-webhook-calendly` quando reunião é marcada, que por sua vez atualiza o registro e dispara e-mail interno

### Resend (ou SendGrid)
- Uso: e-mails transacionais
- Eventos: conclusão de diagnóstico, PDF pronto, share-link compartilhado, reengajamento
- Templates: HTML + text em `supabase-raiox/functions/_shared/email-templates/`

### Stripe ou Hotmart (v1.1)
- Uso: cobrança do plano recorrente R$ 47/mês
- Webhook: `raiox-webhook-payment` valida assinatura e atualiza `diagnostic_purchases.status`

## 2.5. Segurança e LGPD

### Princípios
1. Dados do cliente são propriedade do cliente. Nunca compartilhados com terceiros sem consentimento explícito.
2. Mínimo privilégio: RLS garante que cada usuário só vê o próprio diagnóstico.
3. Dados criptografados em repouso (default Supabase) e em trânsito (TLS 1.3).
4. Retenção: 12 meses após último acesso. Após isso, dados ficam em estado `archived` com acesso restrito.
5. Direito ao esquecimento: usuário pode solicitar deleção completa via e-mail; hard-delete em até 72h.

### Implementação técnica
- Todas as tabelas têm RLS habilitado (ver 3.2)
- `service_role` key só existe em Edge Functions; cliente usa `anon` key
- Share-links são tokens aleatórios (nanoid, 8 chars) com expiração
- Logs de acesso em tabela `audit_log` para cada view/download de diagnóstico
- Consentimento LGPD registrado no onboarding (checkbox obrigatório + timestamp + IP)

### Política de privacidade (a ser publicada)
URL sugerida: `guilds.com.br/privacidade-raio-x`. Conteúdo mínimo obrigatório por LGPD:
1. Qual dado é coletado, para qual finalidade
2. Por quanto tempo é retido
3. Com quem é compartilhado (Anthropic é sub-processador)
4. Direitos do titular (acesso, correção, deleção)
5. Canal de contato do DPO (encarregado de dados)

## 2.6. Observabilidade

### Logging
- Todas as Edge Functions usam `console.log` estruturado com `{ level, event, diagnostic_id, user_id, duration_ms }`
- Logs capturados pelo Supabase Logs e exportados ao Sentry via integração

### Métricas
- Sentry: erros e exceptions
- Supabase Dashboard: latência de queries, uso de Edge Functions
- Google Analytics 4 ou PostHog: funil de onboarding (step 1 de 5 → step 5 de 5 → dashboard)

### Alertas
- Taxa de erro em `raiox-generate-report` > 5% em 10 min: alerta Slack imediato
- Latência P95 do dashboard > 5s: alerta em 30 min
- Queda de taxa de conclusão de onboarding (diária < 50%): alerta diário

---

# 3. Design de Sistema

## 3.1. Modelo de dados

Arquivo: `supabase-raiox/migrations/20260424000000_initial_schema.sql`

```sql
-- Habilitar extensões
create extension if not exists "pgcrypto";

-- ============================================================
-- PROFILES (1:1 com auth.users)
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text unique not null,
  phone text,
  company_name text,
  role_title text,                              -- cargo declarado
  lgpd_consent_at timestamptz not null,
  lgpd_consent_ip inet,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index profiles_email_idx on public.profiles(email);

-- ============================================================
-- DIAGNOSTICS (uma sessão completa por registro)
-- ============================================================
create type diagnostic_status as enum ('draft', 'processing', 'completed', 'archived', 'error');

create table public.diagnostics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  status diagnostic_status not null default 'draft',
  current_step int not null default 1,           -- 1 a 5 (blocos de onboarding)
  completed_at timestamptz,
  processing_started_at timestamptz,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index diagnostics_user_id_idx on public.diagnostics(user_id);
create index diagnostics_status_idx on public.diagnostics(status);

-- ============================================================
-- ANSWERS (chave-valor com 3 tipos possíveis)
-- ============================================================
create table public.diagnostic_answers (
  id uuid primary key default gen_random_uuid(),
  diagnostic_id uuid not null references public.diagnostics(id) on delete cascade,
  question_key text not null,                    -- ex: 'q_setor', 'q_sistemas', 'q_objecoes'
  block_number int not null,                     -- 1 a 5
  value_text text,                               -- escolha única
  value_array jsonb,                             -- múltipla escolha (array of strings)
  value_free text,                               -- resposta aberta
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(diagnostic_id, question_key)
);
create index diagnostic_answers_diagnostic_id_idx on public.diagnostic_answers(diagnostic_id);

-- ============================================================
-- SCORES (resultado do motor de regras, determinístico)
-- ============================================================
create type gforge_phase as enum (
  'pre_foundry', 'foundry', 'observe', 'refine', 'generate', 'empower', 'expand'
);

create table public.diagnostic_scores (
  diagnostic_id uuid primary key references public.diagnostics(id) on delete cascade,
  -- score geral
  score_overall int not null check (score_overall between 0 and 100),
  phase gforge_phase not null,
  -- scores por eixo (0.0 a 5.0)
  score_processos numeric(3,1) not null,
  score_sistemas numeric(3,1) not null,
  score_dados numeric(3,1) not null,
  score_pessoas numeric(3,1) not null,
  -- scores por dimensão do raio-x
  score_maturidade numeric(3,1) not null,        -- média ponderada dos 4 eixos
  score_mercado numeric(3,1) not null,
  score_empresa numeric(3,1) not null,
  score_comunicacao numeric(3,1) not null,
  -- benchmark
  benchmark_sector_label text not null,
  benchmark_sector_score int not null,
  benchmark_delta int not null,                  -- pode ser negativo
  -- perda financeira
  loss_annual_brl bigint not null,
  loss_breakdown jsonb not null,                 -- { manual, ghost, reports, other }
  -- fit de parceria Guilds
  fit_total int not null check (fit_total between 0 and 100),
  fit_signals jsonb not null,                    -- array com 5 sinais e pontuação
  -- gaps priorizados
  gaps jsonb not null,                           -- array de 3 a 7 gaps
  -- se você fizer nada (projeção 12 meses)
  inaction_projection jsonb not null,
  -- metadata
  rules_version text not null,                   -- ex: 'v1.0'
  calculated_at timestamptz not null default now()
);

-- ============================================================
-- NARRATIVES (texto gerado pelo Claude)
-- ============================================================
create type narrative_section as enum (
  'hero_summary', 'maturity', 'market', 'company', 'communication',
  'smart_objectives', 'action_plan', 'kpis', 'guilds_path'
);

create table public.diagnostic_narratives (
  id uuid primary key default gen_random_uuid(),
  diagnostic_id uuid not null references public.diagnostics(id) on delete cascade,
  section narrative_section not null,
  content jsonb not null,                        -- schema por seção (ver 3.5)
  prompt_version text not null,                  -- ex: 'v1.0'
  model text not null default 'claude-sonnet-4-6',
  tokens_in int,
  tokens_out int,
  generated_at timestamptz not null default now(),
  unique(diagnostic_id, section)
);
create index diagnostic_narratives_diagnostic_id_idx on public.diagnostic_narratives(diagnostic_id);

-- ============================================================
-- SHARE TOKENS (share-with-board)
-- ============================================================
create table public.share_tokens (
  token text primary key,                        -- nanoid de 8 chars
  diagnostic_id uuid not null references public.diagnostics(id) on delete cascade,
  created_by uuid not null references public.profiles(id),
  expires_at timestamptz not null,
  views int not null default 0,
  last_viewed_at timestamptz,
  revoked boolean not null default false,
  created_at timestamptz not null default now()
);
create index share_tokens_diagnostic_id_idx on public.share_tokens(diagnostic_id);

-- ============================================================
-- CALENDLY BOOKINGS
-- ============================================================
create table public.calendly_bookings (
  id uuid primary key default gen_random_uuid(),
  diagnostic_id uuid references public.diagnostics(id) on delete set null,
  user_id uuid references public.profiles(id),
  calendly_event_uri text unique not null,
  invitee_email text,
  scheduled_at timestamptz not null,
  status text not null default 'scheduled',      -- scheduled | canceled | completed | no_show
  payload jsonb,                                 -- payload bruto do webhook
  created_at timestamptz not null default now()
);

-- ============================================================
-- PURCHASES (v1.1)
-- ============================================================
create table public.diagnostic_purchases (
  id uuid primary key default gen_random_uuid(),
  diagnostic_id uuid references public.diagnostics(id),
  user_id uuid not null references public.profiles(id),
  product_code text not null,                    -- RAIO_X_UNICO | RAIO_X_RECORRENTE
  amount_brl int not null,
  currency text not null default 'BRL',
  coupon_code text,
  provider text not null,                        -- stripe | hotmart | pagarme
  provider_ref text,
  status text not null,                          -- pending | paid | canceled | refunded
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

-- ============================================================
-- AUDIT LOG (acessos e mudanças críticas)
-- ============================================================
create table public.audit_log (
  id bigserial primary key,
  actor_id uuid references public.profiles(id),
  diagnostic_id uuid references public.diagnostics(id),
  event text not null,                           -- ex: 'diagnostic.viewed', 'pdf.downloaded'
  metadata jsonb,
  ip inet,
  user_agent text,
  created_at timestamptz not null default now()
);
create index audit_log_diagnostic_id_idx on public.audit_log(diagnostic_id);
create index audit_log_created_at_idx on public.audit_log(created_at desc);

-- ============================================================
-- TRIGGERS
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger diagnostics_updated_at before update on public.diagnostics
  for each row execute function public.set_updated_at();
create trigger diagnostic_answers_updated_at before update on public.diagnostic_answers
  for each row execute function public.set_updated_at();
```

## 3.2. Row-Level Security (RLS)

```sql
-- Habilitar RLS em todas as tabelas
alter table public.profiles enable row level security;
alter table public.diagnostics enable row level security;
alter table public.diagnostic_answers enable row level security;
alter table public.diagnostic_scores enable row level security;
alter table public.diagnostic_narratives enable row level security;
alter table public.share_tokens enable row level security;
alter table public.calendly_bookings enable row level security;
alter table public.diagnostic_purchases enable row level security;
alter table public.audit_log enable row level security;

-- profiles: dono acessa o próprio
create policy "users_own_profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- diagnostics: dono acessa os próprios
create policy "users_own_diagnostics" on public.diagnostics
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- answers: dono do diagnostic acessa
create policy "users_own_answers" on public.diagnostic_answers
  for all using (
    exists (select 1 from public.diagnostics d
            where d.id = diagnostic_id and d.user_id = auth.uid())
  );

-- scores: read-only para o dono, escrita só via service_role
create policy "users_read_own_scores" on public.diagnostic_scores
  for select using (
    exists (select 1 from public.diagnostics d
            where d.id = diagnostic_id and d.user_id = auth.uid())
  );

-- narratives: read-only para o dono, escrita só via service_role
create policy "users_read_own_narratives" on public.diagnostic_narratives
  for select using (
    exists (select 1 from public.diagnostics d
            where d.id = diagnostic_id and d.user_id = auth.uid())
  );

-- share_tokens: dono cria e revoga
create policy "users_own_share_tokens" on public.share_tokens
  for all using (created_by = auth.uid()) with check (created_by = auth.uid());

-- audit_log: só service_role (invisível ao cliente)
-- (nenhuma policy pública → RLS bloqueia todas as operações do anon/authenticated)
```

### Acesso via share token (sem auth)
Para o share-link público funcionar sem o visitante ter conta, criar uma Edge Function `raiox-public-view` que recebe o token, valida expiração, e retorna o dashboard renderizado no servidor ou um JSON read-only. Nunca dar acesso direto via RLS anon.

## 3.3. Edge Functions · contratos

### 3.3.1. `raiox-generate-report`

**Trigger:** chamada pelo cliente após completar o bloco 5.

**Request:**
```json
POST /functions/v1/raiox-generate-report
Authorization: Bearer <user_jwt>
{
  "diagnostic_id": "uuid"
}
```

**Response (assíncrona, cliente faz polling):**
```json
202 Accepted
{
  "status": "processing",
  "diagnostic_id": "uuid",
  "estimated_seconds": 60
}
```

**Processamento interno:**
1. Valida que `diagnostic_id` pertence ao `user_id` do JWT
2. Valida que todas as respostas obrigatórias foram preenchidas
3. Marca `diagnostics.status = 'processing'` e `processing_started_at = now()`
4. Roda motor de regras (`rules-engine.ts`) → produz objeto `scores`
5. Persiste `diagnostic_scores`
6. Chama Claude em 4 prompts paralelos (maturity, market, communication, guilds_path)
7. Chama Claude em 3 prompts sequenciais (smart_objectives, action_plan, kpis) pois dependem dos anteriores
8. Persiste `diagnostic_narratives` por seção
9. Marca `diagnostics.status = 'completed'` e `completed_at = now()`
10. Dispara `raiox-send-email` com "Seu Raio-X está pronto"

**Erros:**
- 404: diagnóstico não encontrado ou não pertence ao usuário
- 409: diagnóstico já está em processamento
- 422: respostas obrigatórias faltando (retorna lista de `missing_questions`)
- 500: erro interno. Se falha foi no Claude, preserva scores e retenta em até 3 tentativas

### 3.3.2. `raiox-calculate-scores`

**Trigger:** opcional, só usado se quiser pré-visualização parcial durante onboarding. Cliente pode chamar após bloco 2 para mostrar "perda estimada" incremental.

**Request:**
```json
POST /functions/v1/raiox-calculate-scores
{
  "diagnostic_id": "uuid",
  "partial": true
}
```

**Response:**
```json
200 OK
{
  "partial": true,
  "loss_estimate_brl": 280000,
  "phase_estimate": "observe"
}
```

### 3.3.3. `raiox-export-pdf`

**Request:**
```json
POST /functions/v1/raiox-export-pdf
Authorization: Bearer <user_jwt>
{
  "diagnostic_id": "uuid",
  "template": "full" | "board_summary"
}
```

**Processamento:**
1. Valida ownership
2. Busca scores + narratives
3. Renderiza template HTML (reaproveita componentes do dashboard)
4. Converte via Puppeteer para PDF
5. Upload para Supabase Storage em `pdfs/{user_id}/{diagnostic_id}-{timestamp}.pdf`
6. Gera signed URL com expiração de 24h
7. Retorna URL + envia e-mail com link

**Response:**
```json
200 OK
{
  "pdf_url": "https://.../signed-url",
  "expires_at": "2026-04-24T10:00:00Z"
}
```

### 3.3.4. `raiox-share-link`

**Request:**
```json
POST /functions/v1/raiox-share-link
Authorization: Bearer <user_jwt>
{
  "diagnostic_id": "uuid",
  "expires_in_days": 30
}
```

**Response:**
```json
200 OK
{
  "token": "8FXm2p",
  "url": "https://guilds.com.br/r/8FXm2p",
  "expires_at": "2026-05-23T00:00:00Z"
}
```

### 3.3.5. `raiox-webhook-calendly`

**Trigger:** Calendly webhook quando evento é criado.

**Request:** payload padrão Calendly v2 (ver docs oficiais).

**Processamento:**
1. Valida signature do webhook (`calendly_webhook_signing_key`)
2. Extrai `diagnostic_id` dos query params do link de agendamento
3. Cria registro em `calendly_bookings`
4. Atualiza `diagnostics.metadata.calendly_scheduled = true`
5. Dispara e-mail interno para o vendedor com link do diagnóstico e dossiê

### 3.3.6. `raiox-webhook-payment` (v1.1)

**Trigger:** webhook Stripe ou Hotmart quando pagamento confirma.

Validação de signature, atualização de `diagnostic_purchases.status = 'paid'`, envio de e-mail de confirmação e desbloqueio de features do plano recorrente.

## 3.4. State machine do diagnóstico

```
             criação de conta + diagnóstico
                          │
                          ▼
                    ┌──────────┐
                    │  draft   │◄─────────┐
                    └────┬─────┘          │
                         │                │ usuário edita
                         │ bloco 5 OK     │ respostas
                         │ + consentimento│
                         ▼                │
                    ┌──────────┐          │
                    │processing│──────────┘
                    └────┬─────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
     sucesso         erro Claude    erro crítico
          │              │              │
          ▼              │              ▼
    ┌──────────┐         │         ┌──────┐
    │completed │         │         │ error│
    └────┬─────┘         │         └──────┘
         │               │ retry 3×
         │ 365 dias      │
         │ sem acesso    └────→ volta a processing
         ▼
    ┌──────────┐
    │ archived │
    └──────────┘
```

- `draft`: onboarding em andamento, respostas sendo salvas. Usuário pode retomar.
- `processing`: Edge Function rodando. Cliente mostra animação e faz polling.
- `completed`: dashboard disponível, CTAs ativos.
- `archived`: soft-archive pós 365 dias. Dados preservados, não aparecem no app, retorno via botão "reativar".
- `error`: falha irrecuperável. Usuário vê mensagem "tentaremos novamente em breve" e admin Guilds recebe alerta.

## 3.5. Prompts Claude · estrutura e guardrails

### Princípios obrigatórios
1. **Números nunca vêm do Claude.** Todo número no output final vem do motor de regras. Claude recebe os números prontos no prompt e só escreve em torno deles.
2. **Tom Guilds, não V4.** Claude recebe no system prompt a metodologia G-FORGE, casos de uso, anti-exemplos (o que não falar).
3. **Estrutura rígida.** Cada seção retorna um JSON schema pré-definido. Se Claude desvia, a Edge Function rejeita e retenta.
4. **Sem alucinação de case ou cliente.** Claude não inventa nomes de empresas. Se o sistema quiser citar case, é lookup em tabela curada.

### System prompt base (compartilhado por todas as seções)

```
Você é o consultor Guilds escrevendo um relatório diagnóstico para um cliente B2B.

CONTEXTO
- A Guilds aplica a metodologia proprietária G-FORGE: Foundry → Observe → Refine → Generate → Empower → Expand.
- Princípio central: problema raiz quase nunca é software, é processo ou adoção.
- Tom: direto, honesto, baseado em evidência. Nunca vendedor agressivo, nunca consultor vazio.
- Leitor típico: CEO ou diretor de operação, 40+, cético, vai ler em 3 minutos.

REGRAS
1. NÃO invente números. Todos os valores financeiros e percentuais já estão no objeto INPUT.
2. NÃO cite empresas ou cases específicos. Se precisar exemplificar, use "uma clínica similar" ou equivalente.
3. NÃO use emojis, bullet points excessivos ou linguagem de marketing ("revolucionário", "transformador").
4. NÃO use em-dash (—). Use ponto, vírgula ou dois-pontos.
5. NÃO diga "você tem que" ou "você precisa urgentemente". Diga o que a análise mostra.
6. SEMPRE responda em JSON estruturado no schema especificado. Nenhum texto fora do JSON.

FORMATO DO INPUT
{
  "answers": { ... },        // respostas do diagnóstico
  "scores": { ... },         // scores calculados por regra
  "section_context": { ... } // dados da seção específica
}
```

### Schema por seção (exemplo: maturidade)

```typescript
// supabase-raiox/functions/raiox-generate-report/prompts/maturity.ts

export const maturitySchema = {
  type: "object",
  required: ["headline", "narrative", "gaps"],
  properties: {
    headline: {
      type: "string",
      description: "Frase de 6 a 10 palavras resumindo o diagnóstico de maturidade",
      maxLength: 80
    },
    narrative: {
      type: "string",
      description: "Parágrafo de 3 a 5 frases explicando o que os scores revelam",
      minLength: 300,
      maxLength: 900
    },
    gaps: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        required: ["title", "description", "action", "impact_label"],
        properties: {
          title: { type: "string", maxLength: 80 },
          description: { type: "string", maxLength: 280 },
          action: { type: "string", maxLength: 160 },
          impact_label: { enum: ["CRÍTICO", "ALTO", "MÉDIO"] }
        }
      }
    }
  }
};

export const maturityPrompt = (input: MaturityInput) => `
INPUT:
${JSON.stringify(input, null, 2)}

TAREFA
Escreva a seção "Maturidade Digital" do raio-x.

Use os scores calculados (processos, sistemas, dados, pessoas) para construir a narrativa.
O cliente precisa entender em 30 segundos:
1. Qual é o diagnóstico central (headline)
2. Por que os scores são o que são (narrative)
3. Quais 3 gargalos atacar primeiro (gaps, ordenados por prioridade)

Responda APENAS com JSON no schema:
${JSON.stringify(maturitySchema, null, 2)}
`;
```

### Validação de output

Toda resposta do Claude passa por `ajv` (JSON Schema validator). Se falhar:
1. Primeira tentativa: retry com mensagem "sua resposta não seguiu o schema, veja o erro: X. Refaça."
2. Segunda tentativa: retry com temperatura 0.2 (mais determinístico)
3. Terceira falha: Edge Function marca seção como `fallback_used` e usa texto padrão por fase G-FORGE (pré-escrito)

## 3.6. Frontend · padrões e decisões

### Roteamento interno em `/raio-x`
Usar `react-router-dom` com rotas aninhadas:

```typescript
<Routes>
  <Route path="/raio-x" element={<RaioXShell />}>
    <Route index element={<RaioXIntro />} />
    <Route path="entrar" element={<RaioXAuth />} />
    <Route path="onboarding/:step" element={<RaioXOnboarding />} />
    <Route path="processando/:diagnosticId" element={<RaioXProcessing />} />
    <Route path="dashboard/:diagnosticId" element={<RaioXDashboard />} />
  </Route>
  <Route path="/r/:token" element={<SharedDashboard />} />
</Routes>
```

### Estado com TanStack Query

```typescript
// hooks/useDiagnostic.ts
export function useDiagnostic(diagnosticId: string) {
  return useQuery({
    queryKey: ['diagnostic', diagnosticId],
    queryFn: () => fetchDiagnostic(diagnosticId),
    staleTime: 60_000,
  });
}

// Polling de processamento
export function useDiagnosticStatus(diagnosticId: string) {
  return useQuery({
    queryKey: ['diagnostic-status', diagnosticId],
    queryFn: () => fetchDiagnosticStatus(diagnosticId),
    refetchInterval: (query) =>
      query.state.data?.status === 'processing' ? 2000 : false,
  });
}
```

### Persistência de respostas (a cada step)

```typescript
// hooks/useSaveAnswer.ts
export function useSaveAnswer(diagnosticId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (answer: Answer) =>
      supabase.from('diagnostic_answers').upsert({
        diagnostic_id: diagnosticId,
        question_key: answer.key,
        block_number: answer.block,
        value_text: answer.text ?? null,
        value_array: answer.array ?? null,
        value_free: answer.free ?? null,
      }),
    onSuccess: () => queryClient.invalidateQueries(['diagnostic', diagnosticId]),
  });
}
```

### Design tokens
Reutilizar o que já existe em `guilds-landing/src/index.css` e `tailwind.config.ts`. Tokens-chave do protótipo (se não existirem, adicionar):

- Cores: `--bg: #05070C`, `--panel: #0B1120`, `--brand: #3B82F6`, `--brand-soft: rgba(59,130,246,0.12)`
- Fonte: Inter 400–900
- Radius: 12px (cards pequenos), 18px (panels), 24px (panels hero)
- Chips: padrões `chip-brand`, `chip-guilds`, `chip-diy`, `chip-warn`, `chip-bad`

### Acessibilidade
- Todos os inputs com `<label>` ou `aria-label`
- Radar chart acompanhado de tabela acessível (já feito no protótipo)
- Foco visível em toda navegação por teclado
- Contraste AA mínimo (verificar no Lighthouse)
- Atributos `role` e `aria-*` onde semântica for ambígua

## 3.7. Variáveis de ambiente

### Frontend (`.env`)
```
VITE_SUPABASE_RAIOX_URL=https://xxxxx.supabase.co
VITE_SUPABASE_RAIOX_ANON_KEY=eyJhbGciOi...
VITE_CALENDLY_URL=https://calendly.com/guilds/raio-x-30min
VITE_PUBLIC_SHARE_BASE_URL=https://guilds.com.br/r
```

### Edge Functions (Supabase secrets)
```
SUPABASE_URL=                     # auto
SUPABASE_SERVICE_ROLE_KEY=        # auto
ANTHROPIC_API_KEY=sk-ant-...
RESEND_API_KEY=re_...
CALENDLY_WEBHOOK_SECRET=...
STRIPE_WEBHOOK_SECRET=...         # v1.1
PDF_STORAGE_BUCKET=pdfs
```

---

# 4. Plano de Entrega

## 4.1. Sprints

Cada sprint = 1 semana (5 dias úteis). Desenvolvedor sênior solo ou dupla.

### Sprint 1 · Fundação
**Objetivo:** projeto Supabase operante, auth funcionando, frontend esqueleto no lugar.

Entregas:
- Criar projeto Supabase `guilds-raiox` (região sa-east-1)
- Rodar migration inicial com schema completo + RLS
- Configurar auth (e-mail/senha + magic link)
- Criar `src/integrations/supabase-raiox/client.ts` apontando ao novo projeto
- Gerar types TypeScript via `supabase gen types`
- Implementar `RaioXIntro`, `RaioXAuth` (signup + login) e navegação
- Deploy em branch de preview
- CI rodando lint + type-check + build

Definition of Done:
- Usuário consegue criar conta, logar, deslogar
- Criação de conta dispara inserção em `profiles`
- Tests unitários básicos de auth passando

### Sprint 2 · Onboarding
**Objetivo:** os 5 blocos de perguntas funcionando com persistência.

Entregas:
- Componentes dos 5 blocos (Block1 a Block5)
- `OptionCard`, `CheckCard`, `FreeTextField` reutilizáveis
- `OnboardingShell` com barra de progresso e navegação entre blocos
- Hook `useSaveAnswer` com upsert otimista
- Validação com Zod por bloco
- Retomada: se usuário entra e tem diagnostic `draft`, continua de onde parou
- LGPD: checkbox de consentimento obrigatório antes do bloco 1

Definition of Done:
- Usuário completa os 5 blocos
- Respostas persistem ao recarregar a página
- Usuário consegue voltar ao bloco anterior e editar
- Ao fim do bloco 5, `current_step` vai a 5 e botão "Gerar meu Raio-X" fica ativo

### Sprint 3 · Motor e processamento
**Objetivo:** Edge Function gerando scores e narrativas.

Entregas:
- `rules-engine.ts` com todos os cálculos (port do `raiox-logic.ts` + novas dimensões)
- Edge Function `raiox-generate-report` com fluxo completo
- 4 prompts paralelos: maturity, market, communication, guilds_path
- 3 prompts sequenciais: smart_objectives, action_plan, kpis
- Validação de output Claude com `ajv`
- Retry + fallback para texto padrão em caso de falha
- Tabela `diagnostic_scores` e `diagnostic_narratives` sendo populadas
- `RaioXProcessing` com polling e animação
- Cálculo de Fit de parceria com 5 sinais

Definition of Done:
- Um diagnóstico completo processa em < 90s no P95
- Mesmas respostas produzem mesmos scores (determinismo)
- Claude falhando em uma seção não quebra as outras
- Logs estruturados em todas as etapas

### Sprint 4 · Dashboard
**Objetivo:** renderizar todo o dashboard conforme protótipo.

Entregas:
- `DashboardShell` com 4 tabs
- `HeroKpis`, `GForgeJourneyStrip`, `IfYouDoNothing`
- Todas as sub-abas com dados reais do backend
- `MaturityRadar` em SVG com tabela delta
- `CommunicationAudit` com mockup do site cliente (screenshot estático por enquanto)
- `ActionPlan` com cards expansíveis + Gantt
- Painel lateral: `FitScorePanel`, `NextStepPanel`, `ShareWithBoardPanel`, `AssetsPanel`
- `HowWeCalculated` expansível em todos os KPIs críticos
- CTAs integrados com Calendly

Definition of Done:
- Dashboard renderiza em < 3s P95
- Todas as 4 abas mostram conteúdo real
- Botão Calendly passa `diagnostic_id` e `fit_score` como query params
- Mobile e desktop funcionam
- Lighthouse: acessibilidade >= 90, performance >= 80

### Sprint 5 · PDF, share, webhook, QA
**Objetivo:** fechar o MVP com as funcionalidades acessórias.

Entregas:
- Edge Function `raiox-export-pdf` com Puppeteer
- Edge Function `raiox-send-email` com Resend e templates
- Edge Function `raiox-share-link`
- Página pública `/r/:token` renderizando dashboard read-only
- Edge Function `raiox-webhook-calendly` + e-mail interno para vendedor
- Política de privacidade publicada
- Audit log sendo gravado em eventos-chave
- Observabilidade: Sentry configurado, dashboard Supabase com alertas
- QA end-to-end: 10 fluxos de teste executados manualmente
- Deploy em produção atrás de feature flag
- Documentação interna de como o vendedor recebe e usa os leads

Definition of Done:
- Fluxo completo end-to-end funciona: signup → onboarding → dashboard → PDF → share
- Webhook Calendly dispara e-mail ao vendedor corretamente
- Política de privacidade linkada no cadastro
- Logs de auditoria populados

## 4.2. Dependências externas críticas

| Item | Responsável | Prazo crítico |
|---|---|---|
| Conta Anthropic com API key | Gustavo | Sprint 3 |
| Link Calendly parametrizado | Gustavo | Sprint 4 |
| Política de privacidade redigida | Gustavo + advogado | Sprint 5 |
| Conta Resend ou SendGrid | Gustavo | Sprint 5 |
| Domínio `guilds.com.br/r/*` configurado | Gustavo + DNS | Sprint 5 |
| Case real para substituir "Clínica C+" | Gustavo | pós-MVP antes de launch público |
| Foto e bio final do consultor | Gustavo | pós-MVP antes de launch público |

## 4.3. Riscos e mitigações

### Risco 1: Custo Claude estoura orçamento
**Mitigação:** monitorar tokens por diagnóstico na primeira semana. Se passar de US$ 0,40 por diagnóstico, otimizar prompts (reduzir contexto, usar Haiku para seções mais simples).

### Risco 2: Claude alucina números ou cases
**Mitigação:** validação JSON rígida, schema restritivo, temperatura 0.3, teste com 50 diagnósticos mock antes do launch.

### Risco 3: Tempo de processamento frustra usuário
**Mitigação:** animação honesta de 45 a 90s, pré-cálculo dos scores (visível em 5s), narrativas do Claude aparecem progressivamente.

### Risco 4: RLS mal configurado expõe dados
**Mitigação:** audit manual das policies no Sprint 1, testes automatizados de acesso cruzado em Sprint 2, pen-test interno antes do launch.

### Risco 5: Puppeteer pesado em Edge Function
**Mitigação:** se Puppeteer for muito lento ou caro, migrar para serviço externo (DocRaptor, Api2PDF) ou gerar PDF via react-pdf (client-side).

---

# 5. Handoff Checklist

Antes do desenvolvedor começar, confirmar:

- [ ] Acesso ao repositório `guilds-landing` (GitHub)
- [ ] Acesso à organização Supabase da Guilds para criar novo projeto
- [ ] Anthropic API key provisionada (Gustavo)
- [ ] Calendly link oficial parametrizado (Gustavo)
- [ ] Acesso ao Vercel ou Cloudflare onde o `guilds-landing` está hospedado
- [ ] Acesso ao Sentry da Guilds (ou criar conta)
- [ ] Acesso ao Resend ou SendGrid (ou conta criada)
- [ ] Acesso ao repositório do protótipo HTML (`raio-x-v2-prototipo.html`)
- [ ] Leitura do documento `RAIO_X_V2_SPEC.md` (spec original)
- [ ] Reunião de kickoff de 60 min com Gustavo para validar escopo e pedir esclarecimentos

## Referências

- Protótipo HTML aprovado: `raio-x-v2-prototipo.html`
- Spec funcional: `RAIO_X_V2_SPEC.md`
- Repositório atual da landing: `guilds-landing/`
- Código atual do Raio-X v1: `src/components/raiox/QuizEngine.tsx`, `src/utils/raiox-logic.ts`

## Contato

- **Gustavo Macedo** (product owner): gustavog.macedo16@gmail.com
- **Canal primário de dúvidas:** a definir (Slack / WhatsApp / outro)
- **Frequência de alinhamento sugerida:** daily de 15 min durante os sprints + review quinzenal

---

_Fim do documento. Versão 1.0, 2026-04-23._
