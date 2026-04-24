/**
 * Raio-X V2 — Scoring Engine
 * 
 * Calcula 4 dimensões de maturidade (0-5) + sub-eixos do radar (Processos, Sistemas, Dados, Pessoas)
 * Mantém compatibilidade com raiox-logic.ts (quiz V1)
 */

export interface RaioXAnswers {
  // Block 1 - Profile
  q_setor?: string;
  q_funcionarios?: string;
  q_faturamento?: string;
  q_modelo?: string;

  // Block 2 - Systems
  q_sistemas?: string[];
  q_adocao?: string;
  q_fantasmas?: string;
  q_integracao?: string;
  q_horas_manuais?: string;

  // Block 3 - Commercial
  q_equipe_marketing?: string;
  q_origem_leads?: string[];
  q_objecoes?: string;
  q_stack_comercial?: string[];

  // Block 4 - Brand
  q_site_url?: string;
  q_canais_ativos?: string[];
  q_diferenciais?: string;
  q_posicionamento?: string;

  // Block 5 - Goals
  q_objetivos_12m?: string[];
  q_abandono_historico?: string;
  q_responsavel_tech?: string;
  q_maior_dor?: string;

  [key: string]: string | string[] | undefined | null;
}

/** Sub-eixos do radar de maturidade */
export interface SubScores {
  processos: number;  // 0-5
  sistemas: number;   // 0-5
  dados: number;      // 0-5
  pessoas: number;    // 0-5
}

/** Scores completos de todas as dimensões */
export interface DimensionScores {
  overall: number;           // 0-100 (score geral como antes)
  maturidade: number;        // 0-5 (média dos sub-eixos)
  mercado: number;           // 0-5
  empresa: number;           // 0-5
  comunicacao: number;       // 0-5
  subScores: SubScores;
}

/** Perda financeira calculada */
export interface FinancialLoss {
  total: number;
  manual: number;
  ghost: number;
  reports: number;
  breakdown: { label: string; value: number; formula: string }[];
}

/** Benchmark do setor */
export interface SectorBenchmark {
  label: string;
  processos: number;
  sistemas: number;
  dados: number;
  pessoas: number;
  average: number;
}

/** Fase G-FORGE */
export interface GForgePhase {
  name: string;
  color: string;
  index: number;     // 0-6
  description: string;
}

// ─── Constantes ────────────────────────────────────────────

const SECTOR_BENCHMARKS: Record<string, SectorBenchmark> = {
  'Saúde (Clínicas, Consultórios)': { label: 'Saúde', processos: 2.5, sistemas: 2.4, dados: 2.2, pessoas: 2.3, average: 2.35 },
  'Serviços B2B': { label: 'Serviços B2B', processos: 2.8, sistemas: 2.6, dados: 2.4, pessoas: 2.7, average: 2.63 },
  'Tecnologia / SaaS': { label: 'Tecnologia', processos: 3.2, sistemas: 3.5, dados: 3.0, pessoas: 3.1, average: 3.2 },
  'Educação / Cursos': { label: 'Educação', processos: 2.4, sistemas: 2.1, dados: 2.0, pessoas: 2.5, average: 2.25 },
  'Varejo / E-commerce': { label: 'Varejo', processos: 2.9, sistemas: 3.0, dados: 2.6, pessoas: 2.3, average: 2.7 },
  'Outro': { label: 'Mercado geral', processos: 2.6, sistemas: 2.5, dados: 2.3, pessoas: 2.4, average: 2.45 },
};

const GFORGE_PHASES: GForgePhase[] = [
  { name: 'Pré-FOUNDRY', color: '#E63946', index: 0, description: 'Operação essencialmente analógica.' },
  { name: 'FOUNDRY', color: '#F97316', index: 1, description: 'Sistemas existem mas processos reais não foram mapeados.' },
  { name: 'OBSERVE', color: '#F59E0B', index: 2, description: 'Gap entre processo documentado e processo real gera retrabalho.' },
  { name: 'REFINE', color: '#84CC16', index: 3, description: 'Sistemas funcionam com workarounds. Equipe criou atalhos.' },
  { name: 'GENERATE', color: '#22C55E', index: 4, description: 'Boa adoção, falta integração. Dados em silos.' },
  { name: 'EMPOWER', color: '#3B82F6', index: 5, description: 'Operação integrada, equipe precisa de suporte ativo.' },
  { name: 'EXPAND', color: '#7C3AED', index: 6, description: 'Operação digital madura, pronta para escalar.' },
];

// ─── Funções de scoring ────────────────────────────────────

/** Extrai o número de uma string como "50%" → 50 */
function extractNumber(val: string | undefined | null): number {
  if (!val) return 0;
  const match = val.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Sub-eixo: Processos (0-5)
 * Inputs: horas manuais, integração, abandono, responsável
 */
function scoreProcessos(a: RaioXAnswers): number {
  let s = 0;

  // Horas manuais (0-2)
  const hrs = extractNumber(a.q_horas_manuais);
  if (hrs <= 4) s += 2;
  else if (hrs <= 10) s += 1.5;
  else if (hrs <= 20) s += 0.8;
  else s += 0.3;

  // Integração (0-1.5)
  const int = a.q_integracao;
  if (int === 'Totalmente integrado') s += 1.5;
  else if (int === 'Bem integrado') s += 1.2;
  else if (int === 'Parcialmente integrado') s += 0.6;
  else s += 0;

  // Abandono histórico (0-1)
  const ab = a.q_abandono_historico;
  if (ab === 'Nunca abandonamos um sistema') s += 1;
  else if (ab === 'Sim, 1 vez') s += 0.5;
  else s += 0;

  // Responsável tech (0-0.5)
  const resp = a.q_responsavel_tech;
  if (resp === 'Gerente / Coordenador de TI') s += 0.5;
  else if (resp === 'CEO / Sócio decide tudo') s += 0.3;
  else if (resp === 'Agência / consultoria externa') s += 0.3;
  else if (resp === 'Equipe operacional escolhe') s += 0.2;
  else s += 0;

  return Math.min(5, Math.round(s * 10) / 10);
}

/**
 * Sub-eixo: Sistemas (0-5)
 * Inputs: qtd de sistemas, fantasmas, stack comercial
 */
function scoreSistemas(a: RaioXAnswers): number {
  let s = 0;

  // Quantidade de sistemas (0-1.5)
  const sysCt = a.q_sistemas?.length || 0;
  if (sysCt >= 5) s += 1.5;
  else if (sysCt >= 3) s += 1.2;
  else if (sysCt >= 1) s += 0.6;
  else s += 0;

  // Fantasmas (0-1.5)
  const gh = a.q_fantasmas;
  if (gh === 'Não') s += 1.5;
  else if (gh === 'Sim, 1 ou 2') s += 0.6;
  else s += 0;

  // Stack comercial (0-1)
  const crmCount = a.q_stack_comercial?.length || 0;
  const hasRealCRM = a.q_stack_comercial?.some(t =>
    ['HubSpot', 'Pipedrive', 'RD Station CRM', 'Salesforce'].includes(t)
  );
  if (hasRealCRM && crmCount >= 2) s += 1;
  else if (hasRealCRM) s += 0.7;
  else if (crmCount >= 1) s += 0.3;
  else s += 0;

  // Integração (0-1)
  const int = a.q_integracao;
  if (int === 'Totalmente integrado') s += 1;
  else if (int === 'Bem integrado') s += 0.7;
  else if (int === 'Parcialmente integrado') s += 0.3;
  else s += 0;

  return Math.min(5, Math.round(s * 10) / 10);
}

/**
 * Sub-eixo: Dados (0-5)
 * Inputs: integração, horas manuais, canais, CRM
 */
function scoreDados(a: RaioXAnswers): number {
  let s = 0;

  // Integração determina fluxo de dados (0-2)
  const int = a.q_integracao;
  if (int === 'Totalmente integrado') s += 2;
  else if (int === 'Bem integrado') s += 1.5;
  else if (int === 'Parcialmente integrado') s += 0.8;
  else s += 0.2;

  // Horas manuais inversas (menos = melhor dado) (0-1.5)
  const hrs = extractNumber(a.q_horas_manuais);
  if (hrs <= 4) s += 1.5;
  else if (hrs <= 10) s += 1;
  else if (hrs <= 20) s += 0.5;
  else s += 0.2;

  // Tem CRM real (0-1)
  const hasRealCRM = a.q_stack_comercial?.some(t =>
    ['HubSpot', 'Pipedrive', 'RD Station CRM', 'Salesforce'].includes(t)
  );
  if (hasRealCRM) s += 1;
  else if (a.q_stack_comercial?.includes('Planilhas / Excel')) s += 0.3;

  // Canais para captura de dados (0-0.5)
  const channels = a.q_canais_ativos?.length || 0;
  if (channels >= 4) s += 0.5;
  else if (channels >= 2) s += 0.3;

  return Math.min(5, Math.round(s * 10) / 10);
}

/**
 * Sub-eixo: Pessoas (0-5)
 * Inputs: adoção, equipe marketing, abandono, responsável
 */
function scorePessoas(a: RaioXAnswers): number {
  let s = 0;

  // Adoção % (0-2)
  const adocao = extractNumber(a.q_adocao);
  if (adocao >= 80) s += 2;
  else if (adocao >= 60) s += 1.5;
  else if (adocao >= 40) s += 1;
  else if (adocao >= 20) s += 0.5;
  else s += 0.2;

  // Estrutura de equipe (0-1.5)
  const eq = a.q_equipe_marketing;
  if (eq === 'Equipe estruturada (6+)') s += 1.5;
  else if (eq === 'Equipe pequena (2–5)') s += 1.2;
  else if (eq === 'Agência externa') s += 0.8;
  else if (eq === '1 pessoa faz tudo') s += 0.5;
  else s += 0;

  // Abandono histórico (0-1)
  const ab = a.q_abandono_historico;
  if (ab === 'Nunca abandonamos um sistema') s += 1;
  else if (ab === 'Sim, 1 vez') s += 0.5;
  else s += 0;

  // Responsável tech definido (0-0.5)
  const resp = a.q_responsavel_tech;
  if (resp && resp !== 'Não tem responsável definido') s += 0.5;

  return Math.min(5, Math.round(s * 10) / 10);
}

/**
 * Dimensão: Mercado (0-5)
 * Baseado no modelo de negócio, origens de lead, objetivos, objeções
 */
function scoreMercado(a: RaioXAnswers): number {
  let s = 0;

  // Diversidade de fontes de leads (0-2)
  const leads = a.q_origem_leads?.length || 0;
  if (leads >= 5) s += 2;
  else if (leads >= 3) s += 1.5;
  else if (leads >= 1) s += 0.8;
  else s += 0;

  // Objetivos claros (0-1.5)
  const obj = a.q_objetivos_12m?.length || 0;
  if (obj >= 3) s += 1.5;
  else if (obj >= 2) s += 1;
  else if (obj >= 1) s += 0.5;

  // Modelo de negócio (0-1)
  if (a.q_modelo === 'Híbrido') s += 1;
  else if (a.q_modelo) s += 0.7;

  // Objeções mapeadas (0-0.5) — ter texto = consciência
  if (a.q_objecoes && a.q_objecoes.length > 20) s += 0.5;
  else if (a.q_objecoes && a.q_objecoes.length > 0) s += 0.2;

  return Math.min(5, Math.round(s * 10) / 10);
}

/**
 * Dimensão: Empresa (0-5)
 * Baseado no porte, faturamento, estrutura
 */
function scoreEmpresa(a: RaioXAnswers): number {
  let s = 0;

  // Porte / funcionários (0-1.5)
  const func = a.q_funcionarios;
  if (func === 'Mais de 200') s += 1.5;
  else if (func === '51 a 200') s += 1.3;
  else if (func === '11 a 50') s += 1;
  else s += 0.5;

  // Faturamento (0-1.5)
  const fat = a.q_faturamento;
  if (fat === 'Acima de R$ 20 Milhões') s += 1.5;
  else if (fat === 'R$ 5M a R$ 20 Milhões') s += 1.3;
  else if (fat === 'R$ 1M a R$ 5 Milhões') s += 1;
  else s += 0.5;

  // Equipe marketing (0-1)
  const eq = a.q_equipe_marketing;
  if (eq === 'Equipe estruturada (6+)') s += 1;
  else if (eq === 'Equipe pequena (2–5)') s += 0.7;
  else if (eq === 'Agência externa') s += 0.5;
  else s += 0.2;

  // Diferenciais claros (0-1) — ter texto = consciência
  if (a.q_diferenciais && a.q_diferenciais.length > 30) s += 1;
  else if (a.q_diferenciais && a.q_diferenciais.length > 0) s += 0.4;

  return Math.min(5, Math.round(s * 10) / 10);
}

/**
 * Dimensão: Comunicação (0-5)
 * Baseado em canais, site, posicionamento, diferenciais
 */
function scoreComunicacao(a: RaioXAnswers): number {
  let s = 0;

  // Canais ativos (0-1.5)
  const ch = a.q_canais_ativos?.length || 0;
  if (ch >= 5) s += 1.5;
  else if (ch >= 3) s += 1.2;
  else if (ch >= 1) s += 0.5;
  else s += 0;

  // Tem site (0-1)
  if (a.q_site_url && a.q_site_url.startsWith('http')) s += 1;
  else if (a.q_site_url && a.q_site_url.length > 3) s += 0.5;

  // Posicionamento revisado recentemente (0-1.5)
  const pos = a.q_posicionamento;
  if (pos === 'Nos últimos 6 meses') s += 1.5;
  else if (pos === 'Entre 6 meses e 1 ano') s += 1;
  else if (pos === 'Mais de 1 ano atrás') s += 0.4;
  else s += 0;

  // Diferenciais declarados (0-1)
  if (a.q_diferenciais && a.q_diferenciais.length > 30) s += 1;
  else if (a.q_diferenciais && a.q_diferenciais.length > 0) s += 0.4;

  return Math.min(5, Math.round(s * 10) / 10);
}

// ─── API pública ────────────────────────────────────────────

/**
 * Calcula todos os scores a partir das respostas do onboarding.
 */
export function calcDimensionScores(answers: RaioXAnswers): DimensionScores {
  const sub: SubScores = {
    processos: scoreProcessos(answers),
    sistemas: scoreSistemas(answers),
    dados: scoreDados(answers),
    pessoas: scorePessoas(answers),
  };

  const maturidade = Math.round(((sub.processos + sub.sistemas + sub.dados + sub.pessoas) / 4) * 10) / 10;
  const mercado = scoreMercado(answers);
  const empresa = scoreEmpresa(answers);
  const comunicacao = scoreComunicacao(answers);

  // Score overall (0-100): média ponderada das 4 dimensões
  const overall = Math.round(((maturidade + mercado + empresa + comunicacao) / 4 / 5) * 100);

  return { overall, maturidade, mercado, empresa, comunicacao, subScores: sub };
}

/**
 * Calcula perda financeira anual estimada.
 */
export function calcFinancialLoss(answers: RaioXAnswers): FinancialLoss {
  const funcMap: Record<string, number> = {
    '1 a 10': 8, '11 a 50': 35, '51 a 200': 100, 'Mais de 200': 250,
  };
  const fatMap: Record<string, number> = {
    'Até R$ 1 Milhão': 22, 'R$ 1M a R$ 5 Milhões': 35,
    'R$ 5M a R$ 20 Milhões': 52, 'Acima de R$ 20 Milhões': 70,
  };

  const employees = funcMap[answers.q_funcionarios || ''] || 35;
  const hourlyRate = fatMap[answers.q_faturamento || ''] || 35;
  const hoursPerWeek = extractNumber(answers.q_horas_manuais);

  const adminWorkers = Math.round(employees * 0.45);
  const manualCost = hoursPerWeek * 52 * hourlyRate * adminWorkers;

  const ghostCount = answers.q_fantasmas === 'Sim, vários' ? 3 : answers.q_fantasmas === 'Sim, 1 ou 2' ? 1.5 : 0;
  const ghostCost = Math.round(ghostCount * 900 * 12); // R$900/mês por sistema

  const reportCost = Math.round(hourlyRate * 8 * 12 * (hoursPerWeek > 10 ? 2 : 1));

  const breakdown = [
    { label: 'Horas manuais da equipe', value: Math.round(manualCost), formula: `${adminWorkers} func. × ${hoursPerWeek}h/sem × 52 sem × R$${hourlyRate}/h` },
    { label: 'Sistemas fantasmas', value: ghostCost, formula: `${ghostCount} sistemas × R$900/mês × 12 meses` },
    { label: 'Relatórios manuais', value: reportCost, formula: `R$${hourlyRate}/h × 8h × 12 meses` },
  ];

  return {
    total: Math.round(manualCost + ghostCost + reportCost),
    manual: Math.round(manualCost),
    ghost: ghostCost,
    reports: reportCost,
    breakdown,
  };
}

/**
 * Retorna a fase G-FORGE baseada no score overall (0-100).
 */
export function getGForgePhase(score: number): GForgePhase {
  if (score <= 15) return GFORGE_PHASES[0];
  if (score <= 30) return GFORGE_PHASES[1];
  if (score <= 45) return GFORGE_PHASES[2];
  if (score <= 60) return GFORGE_PHASES[3];
  if (score <= 75) return GFORGE_PHASES[4];
  if (score <= 90) return GFORGE_PHASES[5];
  return GFORGE_PHASES[6];
}

/**
 * Retorna benchmark do setor.
 */
export function getSectorBenchmark(sector: string): SectorBenchmark {
  return SECTOR_BENCHMARKS[sector] || SECTOR_BENCHMARKS['Outro'];
}

/**
 * Calcula Fit Score (0-100) para parceria com Guilds.
 */
export function calcFitScore(answers: RaioXAnswers, scores: DimensionScores): {
  total: number;
  signals: { label: string; score: number; max: number; reason: string }[];
} {
  const signals = [];

  // Sinal 1: Dor clara de adoção (0-20)
  const adocao = extractNumber(answers.q_adocao);
  const adocaoScore = adocao <= 30 ? 19 : adocao <= 50 ? 16 : adocao <= 70 ? 12 : 8;
  signals.push({ label: 'Dor clara de adoção', score: adocaoScore, max: 20, reason: `${adocao}% de adoção dos sistemas` });

  // Sinal 2: Orçamento compatível (0-20)
  const fatScore = answers.q_faturamento === 'Acima de R$ 20 Milhões' ? 20 :
    answers.q_faturamento === 'R$ 5M a R$ 20 Milhões' ? 18 :
    answers.q_faturamento === 'R$ 1M a R$ 5 Milhões' ? 14 : 8;
  signals.push({ label: 'Orçamento compatível', score: fatScore, max: 20, reason: `Faturamento: ${answers.q_faturamento || 'N/I'}` });

  // Sinal 3: Decisor engajado (0-20) — completou todo o formulário
  signals.push({ label: 'Decisor engajado', score: 20, max: 20, reason: 'Preencheu todas as etapas do diagnóstico' });

  // Sinal 4: Urgência temporal (0-20)
  const objCount = answers.q_objetivos_12m?.length || 0;
  const urgScore = objCount >= 4 ? 18 : objCount >= 3 ? 15 : objCount >= 2 ? 12 : 8;
  signals.push({ label: 'Urgência temporal', score: urgScore, max: 20, reason: `${objCount} objetivos definidos para 12 meses` });

  // Sinal 5: Momento organizacional (0-20)
  const momScore = answers.q_responsavel_tech === 'Gerente / Coordenador de TI' ? 18 :
    answers.q_responsavel_tech === 'CEO / Sócio decide tudo' ? 16 :
    answers.q_responsavel_tech === 'Agência / consultoria externa' ? 14 :
    answers.q_responsavel_tech === 'Não tem responsável definido' ? 10 : 12;
  signals.push({ label: 'Momento organizacional', score: momScore, max: 20, reason: `Responsável tech: ${answers.q_responsavel_tech || 'N/D'}` });

  const total = signals.reduce((acc, s) => acc + s.score, 0);
  return { total, signals };
}

export { GFORGE_PHASES, SECTOR_BENCHMARKS };
