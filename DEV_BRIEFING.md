# Briefing · Raio-X Guilds V2

Olá,

Antes de começar a codar, preciso que você mergulhe no material e volte com perguntas, estimativas e eventuais apontamentos. O projeto é o Raio-X G-FORGE, uma evolução profunda do quiz atual da landing em `/raio-x`. Deixa de ser um formulário one-shot atrás de paywall e vira uma mini-plataforma persistente que ultraqualifica leads enquanto entrega um diagnóstico profissional ao cliente.

## O que anexo, e a ordem de leitura

1. **`raio-x-v2-prototipo.html`** · comece por aqui. Abra no navegador e navegue pelas 4 abas (Raio-X, Planejamento, Caminho Guilds, Sua Empresa) e pelo painel lateral. O visual está aprovado e é a referência pixel-a-pixel para o que a gente quer renderizar.

2. **`RAIO_X_V2_SPEC.md`** · spec funcional. Explica por que estamos fazendo, o que o produto atual falha em resolver, e como a evolução se compara com o benchmark V4 Company (o `DiagnosticoV4.docx` que está na pasta também, mas só use como referência visual se precisar).

3. **`RAIO_X_V2_HANDOFF.md`** · PRD + arquitetura + design de sistema. É o documento operacional. SQL completo, contratos de Edge Function, estrutura de pastas, state machine, prompts Claude, plano de 5 sprints com Definition of Done. Leia inteiro.

## O que eu preciso que você faça antes de estimar

- Reserve 2 horas para ler os 3 documentos com calma
- Clone o repositório `guilds-landing`, rode localmente e identifique o `QuizEngine.tsx` e o `raiox-logic.ts` atuais. Entenda o que vai ser reaproveitado
- Rode o protótipo HTML e valide se alguma parte do design é inviável no stack atual (React + Tailwind + shadcn/ui)
- Olhe a estrutura do Supabase atual do projeto (`supabase/migrations` e `supabase/functions`). O novo projeto Supabase vai ser criado do zero, mas entender o padrão da Guilds ajuda

## O que eu quero de volta antes do Sprint 1

Uma resposta escrita curta cobrindo:

- Estimativa de esforço por sprint (as 5 sprints descritas no handoff). Concorda? O que reestimaria?
- Pontos em que você discorda da arquitetura. Especialmente: escolha do Puppeteer para PDF, Resend vs SendGrid, uso de Claude Sonnet vs Haiku para seções mais curtas, região do Supabase
- Perguntas de ambiguidade que o handoff não resolveu
- Sugestão de como vamos alinhar (canal, frequência). Proponho daily de 15 min e review quinzenal, mas se preferir assíncrono eu me adapto
- Data proposta para começar o Sprint 1

## Decisões já fechadas (não precisa rediscutir)

- Stack: React + Vite + Tailwind + shadcn/ui + Supabase (mesmo do `guilds-landing`)
- Projeto Supabase novo e dedicado (`guilds-raiox`), separado do atual
- Motor híbrido: regras determinísticas em TypeScript + Claude só gerando narrativa
- Entrega dupla: dashboard web persistente + PDF exportável
- CTA comercial vai pro Calendly (eu passo o link parametrizado)
- LGPD e política de privacidade: vou cuidar da parte jurídica, você cuida da parte técnica (criptografia, RLS, audit log)

## Decisões abertas (quero seu input)

- Framework de geração de PDF (Puppeteer via Edge Function? react-pdf cliente? serviço externo?)
- Stripe vs Hotmart para o plano recorrente da v1.1
- Como estruturar o painel interno Guilds (para o time comercial ver os leads)
- Se faz sentido usar Haiku em alguma seção do Claude para economizar custo

## Contato

Me chama no WhatsApp para qualquer dúvida durante a leitura. Se precisar de uma call de 30 min antes de estimar, só avisar.

Vamos construir algo bom.

Gustavo Macedo
gustavog.macedo16@gmail.com
