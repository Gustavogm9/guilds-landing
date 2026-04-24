# Raio-X Guilds V2 — Especificação de Estrutura

**Data:** 2026-04-23
**Autor:** Gustavo + Claude (análise assistida)
**Status:** Aprovado para implementação (MVP)

---

## 1. Diagnóstico do que existe hoje

Hoje o Raio-X é um **quiz linear de 6 etapas** (`src/components/raiox/QuizEngine.tsx`, 664 linhas) com lógica determinística em `src/utils/raiox-logic.ts`. Fluxo:

1. Perfil (setor, funcionários, faturamento)
2. Sistemas digitais (quais, adoção, fantasmas, integração)
3. Processos manuais (horas, planilhas/WhatsApp, relatórios)
4. Histórico e risco (abandono, motivo, responsável)
5. Especificidades setoriais (saúde vs. operações)
6. Captura de lead (nome + e-mail)

**Entrega:** uma tela única com Score G-FORGE (0–100), perda anual estimada em R$, benchmark do setor, 3 gargalos críticos e roadmap de 90 dias — tudo **borrado atrás de paywall de R$97** (Hotmart mock hoje).

**Pontos fortes que devem permanecer:**
- Cálculo de perda financeira em R$ (é o gancho emocional/comercial mais forte)
- Score G-FORGE com 7 fases (Pré-FOUNDRY → EXPAND)
- Benchmark por setor
- Roadmap dinâmico adaptado à maturidade
- Lógica de gargalos priorizados

**Limitações do formato atual:**
- Sessão única, descartável: o usuário responde uma vez, recebe, some. Sem retorno, sem evolução.
- Uma única dimensão: "sistemas e processos". Nada de marca, concorrência, comunicação, comercial.
- Output estático (tela com blur + CTA). Não há dashboard explorável.
- Sem conta / sem persistência: se fecha a aba, perde o relatório.
- Motor 100% regra → diagnóstico "genérico premium", mas não soa realmente sob medida.

---

## 2. O que o DiagnosticoV4 mostra (referência)

O DiagnosticoV4.docx é na verdade o **screenshot do produto da V4 Company** (plataforma de marketing). Relevante como referência porque prova um padrão de mercado que funciona para "ultraqualificação" B2B:

**Arquitetura mental do V4:**

- **Onboarding profundo** — ~22 etapas, mistura múltipla escolha + texto livre (descreva seu produto, objeções de clientes, como equipe lida com elas, stack de ferramentas, logística, diferenciais…).
- **Diagnóstico = dashboard multi-aba persistente** (não relatório linear):
  - **Raio-X do negócio** → Maturidade digital · Análise de mercado · Sobre sua empresa · Auditoria de comunicação
  - **Planejamento** → Objetivos (SMART) · Plano de ação · Métricas/KPIs
- **Radar chart de maturidade** em 4 categorias (Marketing, Vendas, Tecnologia, Indicadores) com nota 0–5 por categoria **+ comparação com clientes semelhantes**.
- **Texto narrativo gerado dinamicamente** por categoria — diagnóstico + recomendações numeradas, escritas como se um consultor tivesse escrito.
- **Plano de ação priorizado** com cards (Prioridade Alta/Média, Meta, "Por que isso é importante agora?", "O que fazer?").
- **KPIs sugeridos** com metas (ex: "Taxa de conversão lead→reunião — Alvo 9%").
- **Chat AI com "skills"** — agentes especialistas pós-diagnóstico.
- **Integração de dados** (Meta/Google/CRM) como upgrade: "Vincular contas para comparar com o setor".
- **Monetização em dois níveis:** Plano Diagnóstico R$97 único + Plano Completo R$47/mês (anual) / R$97/mês com dashboards atualizados diariamente, alertas, API, features exclusivas.

---

## 3. Gaps — o que Guilds não tem e precisa ter

| # | Dimensão | Hoje no Guilds | V4 (referência) | Decisão MVP |
|---|---|---|---|---|
| 1 | **Persistência / conta** | Sem auth, sessão única | Auth + dashboard retornável | **Incluir** — auth simples Supabase |
| 2 | **Dimensões do diagnóstico** | Só "sistemas e processos" | 4 áreas (Maturidade / Mercado / Empresa / Comunicação) | **Incluir** — adaptar ao G-FORGE |
| 3 | **Maturidade por categoria** | Score único 0–100 | Radar 0–5 em 4 categorias | **Incluir** — radar G-FORGE |
| 4 | **Benchmark** | Média textual do setor | Radar sobreposto + CTA para vincular dados reais | **Incluir visual, sem integração real no MVP** |
| 5 | **Análise de concorrência** | Inexistente | Tendências, oportunidades, players | **Incluir** versão simplificada (Claude-gerada) |
| 6 | **Auditoria de comunicação** | Inexistente | Site, SEO, canais, copy | **Incluir** — input manual (URL do site) + análise por Claude |
| 7 | **Plano de ação SMART** | Roadmap genérico 3 fases | Cards priorizados com Meta / Por quê / O que fazer | **Incluir** — gerado por Claude com base nos gaps |
| 8 | **KPIs sugeridos** | Inexistente | Lista priorizada com alvo numérico | **Incluir** — derivados do setor + gaps |
| 9 | **Texto dinâmico (LLM)** | 100% regra | Texto narrativo por dimensão | **Incluir** — Claude gera diagnóstico + recomendações |
| 10 | **Exportação PDF** | Inexistente | PDF formatado | **Incluir** — via Edge Function |
| 11 | **Integração de dados reais** | Inexistente | Meta/Google/CRM | **Fora do MVP** (deixar o gancho visual "vincular contas") |
| 12 | **Chat AI pós-diagnóstico** | Inexistente | Agentes especialistas | **Fora do MVP** (v2) |
| 13 | **Plano recorrente** | Só R$97 único | R$97 + R$47/mês recorrente | **Incluir estrutura**, monetização recorrente em v2 |

---

## 4. Estrutura recomendada do novo Raio-X

### 4.1. Fluxo do usuário

```
Landing (/raio-x)
  └─ CTA "Fazer Raio-X Gratuito"
      └─ Sign-up (email + senha, Supabase Auth)
          └─ Onboarding (5 blocos × ~4 perguntas, salvo a cada etapa)
              └─ Processing (motor híbrido: regra + Claude)
                  └─ Dashboard persistente (multi-aba)
                        ├─ Raio-X do negócio
                        │    ├─ Maturidade digital (radar)
                        │    ├─ Análise de mercado
                        │    ├─ Sobre sua empresa
                        │    └─ Auditoria de comunicação
                        ├─ Planejamento
                        │    ├─ Objetivos SMART
                        │    ├─ Plano de ação
                        │    └─ KPIs / Métricas
                        └─ [Futuro] Chat AI · Integrações
              └─ CTA secundário: "Baixar PDF" · "Agendar sessão com consultor" · "Upgrade recorrente"
```

### 4.2. Onboarding — blocos de perguntas

Mantém o que funciona hoje e adiciona 3 blocos novos. Total: **~20 perguntas** em 5 blocos curtos, salvas a cada "Próximo" para não perder progresso.

**Bloco 1 — Perfil** *(existente, manter)*
- Setor · Funcionários · Faturamento anual · Modelo de negócio (B2B / B2C / Híbrido) · Ticket médio

**Bloco 2 — Operação & Sistemas** *(existente, enxugar)*
- Sistemas usados (múltipla) · Adoção (%) · Sistemas fantasmas · Integração entre sistemas · Horas/semana em tarefas repetitivas

**Bloco 3 — Comercial & Marketing** *(novo)*
- Equipe de marketing (tamanho, estrutura) · Origem dos leads (canais) · Objeções mais comuns dos clientes (texto livre) · Stack comercial (CRM, cadência, etc.)

**Bloco 4 — Marca & Comunicação** *(novo)*
- URL do site · Presença digital (canais ativos) · Diferenciais declarados (texto livre) · Última vez que revisou posicionamento

**Bloco 5 — Objetivos & Histórico** *(existente, enriquecer)*
- Objetivos 12 meses (múltipla: alcance, leads, pedidos, aquisição, reativação, diferenciação) · Histórico de abandono de sistemas · Responsável por adoção de tecnologia · Maior dor operacional hoje (texto livre)

**Última etapa — Lead capture**
- Nome · E-mail · Empresa · Telefone (opcional)

### 4.3. Saída do diagnóstico — 4 dimensões de análise

Cada dimensão tem **nota 0–5** (radar) + **benchmark visual** + **texto narrativo** (gerado por Claude) + **recomendações numeradas**.

| Dimensão | Inputs | Output |
|---|---|---|
| **Maturidade Digital** | Sistemas, adoção, integração, horas manuais, processos em planilha, histórico | Nota 0–5, radar 4 sub-eixos (Processos · Sistemas · Dados · Pessoas), perda R$ estimada, 3 gargalos críticos G-FORGE |
| **Mercado & Concorrência** | Setor, ticket, objetivos, objeções | Tendências do setor, players típicos, oportunidades/ameaças, posicionamento sugerido |
| **Sobre sua Empresa** | Todos os inputs | Síntese executiva do perfil: porte, estágio, dor central, potencial de ROI |
| **Auditoria de Comunicação** | URL do site, canais, diferenciais declarados | Score de clareza de mensagem, consistência de canais, recomendações de copy/posicionamento |

**Aba Planejamento** (3 sub-abas):
- **Objetivos SMART** — 3 a 5 metas geradas pelo Claude a partir dos objetivos declarados + gaps identificados
- **Plano de ação** — 6 a 10 cards com Prioridade (Alta/Média/Baixa), Meta, "Por que importa agora", "O que fazer" (checklist)
- **Métricas / KPIs** — 6 indicadores priorizados com alvo numérico de referência por setor

### 4.4. Motor híbrido (regras + Claude)

**Regras (determinísticas, TypeScript):**
- Cálculo de scores 0–5 por dimensão e sub-eixo (reaproveita lógica de `raiox-logic.ts`)
- Perda financeira em R$
- Classificação da fase G-FORGE
- Benchmark numérico por setor

**Claude (Edge Function `raiox-generate-report`):**
- Texto narrativo por dimensão (4 blocos × ~300 palavras)
- 3 a 5 Objetivos SMART contextualizados
- 6 a 10 cards de Plano de Ação priorizados
- Recomendações de auditoria de comunicação a partir da URL do site
- Prompt estruturado com os scores, respostas do onboarding e metodologia G-FORGE no system prompt

**Custo estimado:** ~R$0,30–0,80 por diagnóstico gerado (Claude Sonnet 4.6 a preços atuais, ~8–15k tokens por run).

---

## 5. Modelo de dados (novo Supabase)

Projeto Supabase dedicado. Schema sugerido:

```sql
-- usuários (herda auth.users)
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  email text unique not null,
  company_name text,
  phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- um diagnóstico = uma sessão completa
create table public.diagnostics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade not null,
  status text not null default 'draft',  -- draft | processing | completed | archived
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- respostas do onboarding (chave-valor versionado)
create table public.diagnostic_answers (
  id uuid primary key default gen_random_uuid(),
  diagnostic_id uuid references public.diagnostics on delete cascade not null,
  question_key text not null,            -- ex: 'q_setor', 'q_sistemas', 'q_objecoes'
  value_text text,                        -- string simples
  value_array jsonb,                      -- arrays (múltipla escolha)
  value_free text,                        -- resposta aberta
  created_at timestamptz default now(),
  unique(diagnostic_id, question_key)
);

-- resultado calculado pelas regras (determinístico)
create table public.diagnostic_scores (
  diagnostic_id uuid primary key references public.diagnostics on delete cascade,
  phase text not null,                    -- Pré-FOUNDRY, FOUNDRY, OBSERVE, REFINE...
  score_overall int not null,             -- 0-100
  score_maturidade numeric(3,1),          -- 0.0-5.0
  score_mercado numeric(3,1),
  score_empresa numeric(3,1),
  score_comunicacao numeric(3,1),
  sub_scores jsonb,                       -- {processos: 2.3, sistemas: 1.8, ...}
  benchmark jsonb,                        -- {setor_label, setor_score, delta}
  loss_annual_brl bigint,
  loss_breakdown jsonb,                   -- {manual, ghost, reports}
  gaps jsonb,                             -- array de gaps priorizados
  calculated_at timestamptz default now()
);

-- texto gerado pelo Claude (um registro por "seção")
create table public.diagnostic_narratives (
  id uuid primary key default gen_random_uuid(),
  diagnostic_id uuid references public.diagnostics on delete cascade not null,
  section text not null,                  -- maturidade | mercado | empresa | comunicacao | objetivos_smart | plano_acao | kpis
  content jsonb not null,                 -- estrutura depende da seção
  model text,                             -- 'claude-sonnet-4-6'
  tokens_in int,
  tokens_out int,
  generated_at timestamptz default now()
);

-- log de pagamento (quando abrir o paywall futuro)
create table public.diagnostic_purchases (
  id uuid primary key default gen_random_uuid(),
  diagnostic_id uuid references public.diagnostics not null,
  user_id uuid references public.profiles not null,
  product_code text not null,             -- RAIO_X_UNICO | RAIO_X_RECORRENTE
  amount_brl int not null,
  coupon_code text,
  provider text,                          -- hotmart | stripe | pagarme
  provider_ref text,
  status text not null,                   -- pending | paid | refunded
  paid_at timestamptz,
  created_at timestamptz default now()
);

-- row-level security
alter table public.profiles enable row level security;
alter table public.diagnostics enable row level security;
alter table public.diagnostic_answers enable row level security;
alter table public.diagnostic_scores enable row level security;
alter table public.diagnostic_narratives enable row level security;
alter table public.diagnostic_purchases enable row level security;

-- policy padrão: usuário só vê o que é dele
create policy "own_profile" on public.profiles for all using (auth.uid() = id);
create policy "own_diagnostics" on public.diagnostics for all using (auth.uid() = user_id);
-- (idem para as demais, via join em diagnostic_id → user_id)
```

**Edge Functions necessárias:**

1. `raiox-calculate-scores` — roda as regras determinísticas em Deno/TS (ou chama cliente; opcional servidor)
2. `raiox-generate-report` — chama Anthropic API, salva em `diagnostic_narratives`
3. `raiox-export-pdf` — renderiza PDF com Puppeteer/jsPDF e retorna URL assinada
4. `raiox-email-report` — envia PDF por e-mail (SendGrid/Resend) após conclusão
5. `raiox-webhook-payment` — recebe confirmação da Hotmart/Stripe e desbloqueia

---

## 6. O que isso muda na landing atual

**Arquivos a ajustar:**

- `src/pages/RaioX.tsx` → vira shell com roteamento interno (onboarding vs. dashboard)
- `src/components/raiox/QuizEngine.tsx` → fatiar em 5 componentes (um por bloco) + adicionar persistência a cada `handleNext`
- `src/utils/raiox-logic.ts` → expandir para calcular 4 notas de dimensão + sub-eixos, manter assinatura compatível
- **Novo:** `src/components/raiox/Dashboard/` com `<MaturidadeTab />`, `<MercadoTab />`, `<EmpresaTab />`, `<ComunicacaoTab />`, `<PlanejamentoTab />`, `<RadarChart />` (recharts)
- **Novo:** `src/integrations/supabase-raiox/` — client separado apontando para o novo projeto
- **Novo:** `supabase-raiox/` (ou repositório separado) com migrations + functions

**CTA da landing:** trocar "Gerar Meu Raio-X" (que hoje pede nome+email depois de responder) por **"Criar conta e fazer Raio-X"** logo de cara — a conta ancora a persistência.

---

## 7. Roadmap de implementação sugerido

| Fase | Entregável | Duração |
|---|---|---|
| **Semana 1** | Setup Supabase novo · Schema + RLS · Auth (e-mail/senha + magic link) · Client integrado | 1 semana |
| **Semana 2** | Novos 3 blocos de onboarding (Comercial, Marca, Objetivos enriquecidos) · Persistência de respostas a cada etapa | 1 semana |
| **Semana 3** | Motor híbrido · Edge Function `raiox-generate-report` · Prompts Claude por seção · Cálculo das 4 notas de dimensão | 1 semana |
| **Semana 4** | Dashboard multi-aba · Radar chart · Cards de plano de ação · Exportação PDF | 1 semana |
| **Semana 5** | Integração de pagamento (Hotmart/Stripe) · E-mail de confirmação · QA end-to-end | 1 semana |
| **Pós-MVP** | Chat AI · Integrações Meta/Google/CRM · Plano recorrente com dashboard atualizado | — |

---

## 8. Próximos passos concretos

1. **Criar projeto Supabase** chamado `guilds-raiox` (região sa-east-1 / São Paulo).
2. Rodar migration inicial com o schema acima.
3. Configurar variáveis de ambiente no guilds-landing:
   - `VITE_SUPABASE_RAIOX_URL`
   - `VITE_SUPABASE_RAIOX_ANON_KEY`
   - `ANTHROPIC_API_KEY` (só na Edge Function, nunca no cliente)
4. Escrever os prompts do Claude por seção (cada prompt vira arquivo em `supabase-raiox/functions/raiox-generate-report/prompts/`).
5. Prototipar `<MaturidadeTab />` com dados mockados antes de plugar o backend.

---

## Referências
- `src/components/raiox/QuizEngine.tsx` — engine atual (664 linhas)
- `src/utils/raiox-logic.ts` — lógica G-FORGE atual
- `DiagnosticoV4.docx` — referência visual V4 Company (74 screenshots)
- Metodologia G-FORGE Guilds (FOUNDRY → OBSERVE → REFINE → GENERATE → EMPOWER → EXPAND)
