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
  content jsonb not null,                        -- schema por seção
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

-- ============================================================
-- RLS
-- ============================================================
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
