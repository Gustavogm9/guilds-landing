/**
 * Dados mockados para o dashboard, inspirados no protótipo HTML (Medtrack Saúde).
 * Servem como fallback até a Edge Function gerar dados reais.
 */
import type { DimensionScores, SubScores, FinancialLoss, SectorBenchmark, GForgePhase } from '@/utils/raiox-scoring';

export interface DashboardData {
  companyName: string;
  sector: string;
  scores: DimensionScores;
  benchmark: SectorBenchmark;
  phase: GForgePhase;
  loss: FinancialLoss;
  fitScore: { total: number; signals: { label: string; score: number; max: number; reason: string }[] };
  narratives: {
    maturidade: MaturidadeNarrative;
    mercado: MercadoNarrative;
    comunicacao: ComunicacaoNarrative;
    empresa: EmpresaNarrative;
    plano: PlanoNarrative;
    kpis: KpiItem[];
  };
  inaction: InactionProjection[];
}

export interface MaturidadeNarrative {
  headline: string;
  body: string;
  majorGap: { label: string; detail: string };
  strength: { label: string; detail: string };
  gaps: GapItem[];
}

export interface GapItem {
  priority: number;
  severity: 'CRÍTICO' | 'ALTO' | 'MÉDIO';
  title: string;
  description: string;
  action: string;
  cost: string;
  isGuilds: boolean;
}

export interface MercadoNarrative {
  sectorChip: string;
  headline: string;
  competitors: { name: string; type: 'Ameaça direta' | 'Flanco lateral' | 'Indireto' | 'Pares'; detail: string }[];
  opportunities: string[];
  threats: string[];
  positioning: string;
  sources: string[];
}

export interface ComunicacaoNarrative {
  score: number;
  sectorAvg: number;
  headline: string;
  body: string;
  channels: { label: string; score: number; detail: string; severity: 'CRÍTICO' | 'ALTO' | 'MÉDIO' | 'BOM' }[];
  siteAudit: { url: string; annotations: { id: number; title: string; detail: string }[] };
}

export interface EmpresaNarrative {
  name: string;
  subtitle: string;
  stats: { label: string; value: string }[];
  synopsis: string;
}

export interface PlanoNarrative {
  smartGoals: SmartGoal[];
  actions: ActionItem[];
  summary: { yourEffort: string; teamEffort: string; guildsEffort: string };
}

export interface SmartGoal {
  isPrimary: boolean;
  title: string;
  smart: { specific: string; measurable: string; achievable: string; relevant: string; temporal: string };
  timeline?: string;
  impact?: string;
}

export interface ActionItem {
  id: number;
  title: string;
  priority: 'Alta' | 'Média' | 'Baixa';
  isGuilds: boolean;
  timeline: string;
  yourTime: string;
  teamTime: string;
  guildsTime: string;
  why: string;
  checklist: string[];
  template?: string;
}

export interface KpiItem {
  label: string;
  current: string;
  target: string;
  priority: 'Alta' | 'Média';
  barPercent: number;
}

export interface InactionProjection {
  label: string;
  oldValue: string;
  newValue: string;
  detail: string;
}

// ─── Mock Data ──────────────────────────────────────────────

export const MOCK_DASHBOARD_DATA: DashboardData = {
  companyName: 'Sua empresa',
  sector: 'Setor identificado',
  scores: {
    overall: 38,
    maturidade: 1.9,
    mercado: 2.8,
    empresa: 3.1,
    comunicacao: 2.4,
    subScores: { processos: 1.6, sistemas: 2.1, dados: 1.8, pessoas: 2.2 },
  },
  benchmark: { label: 'Setor', processos: 2.5, sistemas: 2.4, dados: 2.2, pessoas: 2.3, average: 2.35 },
  phase: { name: 'OBSERVE', color: '#F59E0B', index: 2, description: 'Gap entre processo documentado e processo real gera retrabalho.' },
  loss: {
    total: 412000,
    manual: 289000,
    ghost: 54000,
    reports: 69000,
    breakdown: [
      { label: 'Horas manuais da equipe', value: 289000, formula: '34 func. × 12h/sem × 52 sem × R$32/h' },
      { label: 'Sistemas fantasmas', value: 54000, formula: '2 sistemas × R$2.250/mês × 12 meses' },
      { label: 'Relatórios manuais', value: 69000, formula: 'R$32/h × 8h × 12 meses × 22 func.' },
    ],
  },
  fitScore: {
    total: 87,
    signals: [
      { label: 'Dor clara de adoção', score: 19, max: 20, reason: 'Histórico de abandono + baixa adoção atual' },
      { label: 'Orçamento compatível', score: 18, max: 20, reason: 'Faturamento na faixa R$ 5–20M' },
      { label: 'Decisor engajado', score: 20, max: 20, reason: 'Preencheu todas as etapas do diagnóstico' },
      { label: 'Urgência temporal', score: 15, max: 20, reason: 'Objetivos claros para 12 meses' },
      { label: 'Momento organizacional', score: 15, max: 20, reason: 'Precisa definir responsável tech no kickoff' },
    ],
  },
  narratives: {
    maturidade: {
      headline: 'Seus sistemas funcionam. Seu processo não.',
      body: 'A empresa tem CRM, ERP e sistemas operacionais, mas a equipe criou atalhos em planilhas e WhatsApp para dar conta do dia. O dado entra em um lugar, o processo decide em outro. Antes de automatizar qualquer coisa, isso precisa ser mapeado.',
      majorGap: { label: 'Processos manuais', detail: '12h/sem por funcionário em tarefas automatizáveis' },
      strength: { label: 'Pessoas engajadas', detail: 'Equipe demonstra interesse em melhorar processos' },
      gaps: [
        { priority: 1, severity: 'CRÍTICO', title: 'Adoção crítica dos sistemas', description: 'Menos da metade da equipe operacionaliza os sistemas diariamente. Cada R$ pago em licença entrega ~30% do potencial.', action: 'Fase EMPOWER · sprint de adoção ativa (6 semanas)', cost: 'Representa ~70% da perda anual', isGuilds: true },
        { priority: 2, severity: 'CRÍTICO', title: 'Equipe executa horas em tarefas que o sistema deveria fazer', description: 'Geração de relatórios, consolidação, confirmações: tudo manual. Em escala, isso custa centenas de milhares por ano.', action: 'Fase GENERATE · automações calibradas à adoção real', cost: 'R$ 289.000 por ano', isGuilds: true },
        { priority: 3, severity: 'ALTO', title: 'Sistemas pagos com baixo uso', description: 'Licenças ociosas que podem ser cortadas com uma auditoria de 2h.', action: 'Auditoria de licenças (template Guilds grátis)', cost: 'R$ 54.000/ano recuperados', isGuilds: false },
      ],
    },
    mercado: {
      sectorChip: 'Setor identificado · Região diagnosticada',
      headline: 'Posicionamento competitivo',
      competitors: [
        { name: 'Consolidadores de mercado', type: 'Ameaça direta', detail: 'Players maiores comprando empresas do seu porte. Estratégia: escala + ticket médio.' },
        { name: 'Concorrentes digitalizados', type: 'Flanco lateral', detail: 'Digitalização avançada. Força: execução. Fraqueza: atendimento impessoal.' },
        { name: 'Grandes players', type: 'Indireto', detail: 'Pressão via preço na sua faixa de ticket.' },
        { name: 'Empresas similares', type: 'Pares', detail: 'Mesmo porte, região e posicionamento. Benchmark mais justo do seu score.' },
      ],
      opportunities: [
        'Maioria do setor ainda não digitalizou processos corretamente',
        'Regulações exigem adequação, gerando diferencial competitivo',
        'Canais digitais crescendo na sua faixa de ticket',
      ],
      threats: [
        'Consolidadores ativos na sua região nos últimos 18 meses',
        'Pressão por integração digital com stakeholders',
        'Compliance crescente no setor',
      ],
      positioning: 'Em 12 meses: fortalecer sua vantagem de atendimento humanizado. Sua força está na retenção, não no preço.',
      sources: ['Dados setoriais 2024/25', 'Análise de mercado público', 'Base Guilds de 47 projetos'],
    },
    comunicacao: {
      score: 2.4,
      sectorAvg: 3.1,
      headline: 'Sua mensagem não sustenta seu preço',
      body: 'A comunicação é funcional (horários, serviços, contatos) mas não comunica o que diferencia. O cliente chega preparado para comparar preço, não para escolher você.',
      channels: [
        { label: 'Clareza da proposta de valor', score: 1.8, detail: 'O site lista funcionalidades. Ninguém contrata funcionalidades — contrata resultado.', severity: 'CRÍTICO' },
        { label: 'Prova social operacional', score: 1.9, detail: 'Depoimentos sem contexto, sem caso, sem número.', severity: 'CRÍTICO' },
        { label: 'Consistência entre canais', score: 3.1, detail: 'Cada canal conta uma história diferente.', severity: 'MÉDIO' },
        { label: 'Jornada de conversão', score: 2.8, detail: 'CTA único sem pré-qualificação. Perde lead de ticket alto.', severity: 'MÉDIO' },
      ],
      siteAudit: {
        url: 'seu-site.com.br',
        annotations: [
          { id: 1, title: 'Hero que não vende', detail: 'Troque frases genéricas por resultado concreto.' },
          { id: 2, title: 'Depoimento sem prova', detail: 'Troque por 3 casos com nome, foto e número.' },
          { id: 3, title: 'Canais inconsistentes', detail: 'Unifique a narrativa entre canais.' },
          { id: 4, title: 'CTA único perde ticket alto', detail: 'Adicione caminho premium para leads qualificados.' },
        ],
      },
    },
    empresa: {
      name: 'Sua empresa',
      subtitle: 'Perfil estratégico identificado',
      stats: [
        { label: 'Setor', value: 'Identificado no diagnóstico' },
        { label: 'Funcionários', value: 'Conforme declarado' },
        { label: 'Faturamento', value: 'Conforme declarado' },
        { label: 'Modelo', value: 'Conforme declarado' },
      ],
      synopsis: 'Empresa estabelecida, com equipe engajada, porém amarrada em processo manual. O gap não está em falta de recursos nem em falta de sistema; está na camada entre os dois. A fase OBSERVE do G-FORGE indica que existe energia para mudar, mas falta um método que respeite o processo real da equipe.',
    },
    plano: {
      smartGoals: [
        {
          isPrimary: true,
          title: 'Levar a adoção dos sistemas de X% para 85% em 90 dias, recuperando centenas de milhares por ano em horas operacionais.',
          smart: { specific: 'X% → 85% no uso diário', measurable: 'Log de acesso por usuário/dia', achievable: 'Benchmark empresas maduras: 89%', relevant: '70% da perda anual depende disso', temporal: '90 dias · checkpoints semanais' },
        },
        {
          isPrimary: false,
          title: 'Reduzir horas manuais por funcionário administrativo',
          smart: { specific: 'De X h/sem para 4h/sem', measurable: 'Timesheet automatizado', achievable: 'Meta de 6 meses', relevant: 'Economia de centenas de R$k/ano', temporal: '180 dias' },
          timeline: '180 dias',
          impact: 'Economia significativa',
        },
        {
          isPrimary: false,
          title: 'Reposicionar comunicação digital em torno do diferencial real',
          smart: { specific: 'Proposta de valor atualizada', measurable: 'Ticket médio +18%', achievable: 'Baseado em benchmark', relevant: 'Diferenciação competitiva', temporal: '120 dias' },
          timeline: '120 dias',
          impact: 'Ticket +18%',
        },
      ],
      actions: [
        { id: 1, title: 'Mapear o processo real da operação em 2 dias', priority: 'Alta', isGuilds: false, timeline: 'Semana 1', yourTime: '6h', teamTime: '4h', guildsTime: '0h', why: 'Antes de qualquer sistema ou automação, você precisa saber como a equipe realmente trabalha.', checklist: ['Observar equipe durante 1 dia (sem intervir)', 'Anotar saídas do sistema para WhatsApp/planilha', 'Mapear os 5 momentos de dor mais repetidos', 'Entrevistar 2 funcionários com menos de 1 ano'], template: 'Roteiro de Observação G-FORGE · fase OBSERVE' },
        { id: 2, title: 'Redesenhar fluxo antes de treinar (Sprint EMPOWER)', priority: 'Alta', isGuilds: true, timeline: 'Semanas 2–12', yourTime: '2h/sem', teamTime: '4h/sem', guildsTime: 'Squad dedicado', why: 'O método G-FORGE trata a causa (processo + adoção), não o sintoma.', checklist: ['Processo redesenhado + aprovado pela equipe', 'Sistema reconfigurado no fluxo real', '6 semanas de adoção ativa + coaching', 'Dashboard de uso por usuário'] },
        { id: 3, title: 'Cortar os sistemas fantasmas em 2 semanas', priority: 'Alta', isGuilds: false, timeline: 'Semana 1–2', yourTime: '4h', teamTime: '0h', guildsTime: '0h', why: 'Economia imediata. Sistemas com menos de 3 logins/mês.', checklist: ['Listar sistemas com baixo uso', 'Reunião de cancelamento com fornecedor', 'Migrar dados se necessário'], template: 'Carta-padrão de cancelamento + checklist de portabilidade' },
        { id: 4, title: 'Reescrever proposta de valor do site em 1 tarde', priority: 'Média', isGuilds: false, timeline: 'Semana 3', yourTime: '4h', teamTime: '2h', guildsTime: '0h', why: 'Trocar frases genéricas por resultado concreto. Template com 3 variações.', checklist: ['Reescrever hero copy', 'Publicar variação A', 'Medir em 30 dias'] },
      ],
      summary: { yourEffort: '~35h distribuídas em 12 semanas', teamEffort: '~60h (líderes e administrativo)', guildsEffort: 'Squad dedicado, fora dessa conta' },
    },
    kpis: [
      { label: 'Adoção diária dos sistemas (% da equipe)', current: 'Baixa', target: '85%', priority: 'Alta', barPercent: 34 },
      { label: 'Horas manuais por funcionário / semana', current: 'Alta', target: '4h', priority: 'Alta', barPercent: 25 },
      { label: 'Tempo de emissão de relatório gerencial', current: 'Lento', target: 'Tempo real', priority: 'Média', barPercent: 20 },
      { label: 'Satisfação dos stakeholders', current: 'Boa', target: 'Manter > 70', priority: 'Média', barPercent: 71 },
    ],
  },
  inaction: [
    { label: 'Perda anual projetada', oldValue: 'R$ 412k', newValue: 'R$ 461k', detail: 'Inflação salarial + sistemas que a equipe vai continuar subutilizando.' },
    { label: 'Rotatividade administrativa', oldValue: '12%/ano', newValue: '19%/ano', detail: 'Equipe satura em processo manual, gera turnover e custo de reposição.' },
    { label: 'Risco regulatório', oldValue: '—', newValue: 'Crescente', detail: 'Prazo para adequação em regulações setoriais se aproxima.' },
    { label: 'Janela competitiva', oldValue: '—', newValue: '~18 meses', detail: 'Prazo estimado antes de consolidadores fecharem o cerco.' },
  ],
};
