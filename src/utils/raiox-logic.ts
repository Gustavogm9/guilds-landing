export interface QuizAnswers {
  q_setor?: string;
  q_funcionarios?: string;
  q_faturamento?: string;
  q_sistemas?: string[];
  q_adocao?: string;
  q_fantasmas?: string;
  q_integracao?: string;
  q_horas?: string;
  q_processos?: string;
  q_relatorios?: string;
  q_historico?: string;
  q_motivo?: string;
  q_dedicado?: string;
  q_setor1?: string;
  q_setor2?: string;
  q_setor3?: string;
  [key: string]: string | string[] | undefined;
}

export function calcScore(A: QuizAnswers): number {
  let s = 0;
  const adocaoMap: Record<string, number> = { menos20: 0, '20-40': 4, '40-60': 9, '60-80': 14, mais80: 20 };
  const fantasmasMap: Record<string, number> = { nenhum: 12, '1': 7, '2': 3, '3mais': 0 };
  const integracaoMap: Record<string, number> = { sim: 15, parcial: 8, nao: 0 };
  const horasMap: Record<string, number> = { menos2: 18, '2-5': 11, '5-10': 5, mais10: 0 };
  const processosMap: Record<string, number> = { nenhum: 15, '1-2': 9, '3-5': 4, mais5: 0 };
  const relatoriosMap: Record<string, number> = { automatico: 10, dias: 5, '1semana': 2, mais1sem: 0 };
  const historicoMap: Record<string, number> = { nao: 8, '1x': 2, mais1x: 0 };
  const dedicadoMap: Record<string, number> = { sim: 5, parcial: 3, nao: 0 };

  s += (adocaoMap[A.q_adocao as string] || 0) + (fantasmasMap[A.q_fantasmas as string] || 0) + (integracaoMap[A.q_integracao as string] || 0);
  s += (horasMap[A.q_horas as string] || 0) + (processosMap[A.q_processos as string] || 0) + (relatoriosMap[A.q_relatorios as string] || 0);
  s += (historicoMap[A.q_historico as string] || 0) + (dedicadoMap[A.q_dedicado as string] || 0);

  // Sector points
  const isHealth = ['saude_ocup', 'clinica'].includes(A.q_setor || '');
  if (isHealth) {
    const regMap: Record<string, number> = { menos5: 6, '5-10': 4, '10-20': 2, mais20: 0 };
    const nrMap: Record<string, number> = { adequados: 4, emprocesso: 2, naoiniciou: 0 };
    const sysMap: Record<string, number> = { '1': 4, '2-3': 3, '4-5': 1, mais5: 0 };
    s += (regMap[A.q_setor1 as string] || 0) + (nrMap[A.q_setor2 as string] || 0) + (sysMap[A.q_setor3 as string] || 0);
  } else {
    const onbMap: Record<string, number> = { ate2: 6, '3-7': 4, '8-14': 2, mais14: 0 };
    const aprovMap: Record<string, number> = { menos20: 6, '20-50': 4, '50-80': 2, mais80: 0 };
    const errMap: Record<string, number> = { raramente: 4, mensal: 2, semanal: 1, diario: 0 };
    s += (onbMap[A.q_setor1 as string] || 0) + (aprovMap[A.q_setor2 as string] || 0) + (errMap[A.q_setor3 as string] || 0);
  }

  return Math.round((s / 113) * 100);
}

export function calcLoss(A: QuizAnswers) {
  const rates: Record<string, number> = { ate1m: 22, '1m-5m': 32, '5m-20m': 48, acima20m: 65 };
  const rate = rates[A.q_faturamento as string] || 32;
  const empMap: Record<string, number> = { '10-20': 15, '21-50': 35, '51-100': 75, '101-150': 125, '150mais': 175 };
  const emp = empMap[A.q_funcionarios as string] || 35;
  const hrsMap: Record<string, number> = { menos2: 1, '2-5': 3, '5-10': 6, mais10: 10 };
  const hrs = hrsMap[A.q_horas as string] || 3;
  
  const workers = Math.round(emp * 0.45); // Assuming 45% of employees do admin/system tasks
  const manualCost = hrs * 52 * rate * workers;
  
  const ghostMap: Record<string, number> = { nenhum: 0, '1': 1, '2': 2, '3mais': 3 };
  const ghosts = ghostMap[A.q_fantasmas as string] || 0;
  const ghostCost = ghosts * 750 * 12; // 750 BRL/month per system
  
  const relMap: Record<string, number> = { automatico: 0, dias: rate * 4 * 12, '1semana': rate * 8 * 12, mais1sem: rate * 16 * 12 };
  const relCost = relMap[A.q_relatorios as string] || 0;
  
  return {
    total: Math.round(manualCost + ghostCost + relCost),
    manual: Math.round(manualCost),
    ghost: Math.round(ghostCost),
    rel: Math.round(relCost),
    rate,
    workers,
    hrs,
    emp
  };
}

export function getPhase(score: number) {
  if (score <= 15) return { name: 'Pré-FOUNDRY', color: '#E63946', pos: 7, desc: 'Sua operação ainda é essencialmente analógica. A digitalização começa antes de qualquer sistema.' };
  if (score <= 30) return { name: 'FOUNDRY', color: '#F97316', pos: 19, desc: 'Você tem sistemas, mas os processos reais da equipe ainda não foram mapeados ou documentados.' };
  if (score <= 45) return { name: 'OBSERVE', color: '#F59E0B', pos: 33, desc: 'O processo documentado é diferente do processo que a equipe executa. Esse gap gera retrabalho invisível.' };
  if (score <= 60) return { name: 'REFINE', color: '#84CC16', pos: 47, desc: 'Seus sistemas funcionam, mas há muitos workarounds. A equipe criou atalhos fora do sistema.' };
  if (score <= 75) return { name: 'GENERATE', color: '#22C55E', pos: 62, desc: 'Boa adoção, mas falta integração. Os sistemas não conversam e o dado não alimenta decisão.' };
  if (score <= 90) return { name: 'EMPOWER', color: '#3B82F6', pos: 81, desc: 'Operação integrada, mas a equipe ainda precisa de suporte ativo para manter o nível de adoção.' };
  return { name: 'EXPAND', color: '#7C3AED', pos: 95, desc: 'Operação digital madura. Você está pronto para escalar com confiança metodológica.' };
}

export function getBenchmark(setor: string) {
  const map: Record<string, { score: number, label: string }> = {
    saude_ocup: { score: 38, label: 'Saúde Ocupacional' },
    clinica: { score: 42, label: 'Clínica / Saúde' },
    fintech: { score: 44, label: 'Fintech / Financeiro' },
    operacoes: { score: 36, label: 'Operações' }
  };
  return map[setor] || { score: 40, label: 'Seu setor' };
}

export interface Gap {
  priority: number;
  impact: string;
  cls: string;
  badge: string;
  title: string;
  desc: string;
  action: string;
  cost: string;
}

export function getGaps(A: QuizAnswers): Gap[] {
  const gaps: Gap[] = [];
  const adocao = A.q_adocao as string;
  const fantasmas = A.q_fantasmas as string;
  const integracao = A.q_integracao as string;
  const horas = A.q_horas as string;
  const processos = A.q_processos as string;
  const relatorios = A.q_relatorios as string;
  const historico = A.q_historico as string;

  if (['menos20', '20-40'].includes(adocao))
    gaps.push({ priority: adocao === 'menos20' ? 0 : 2, impact: 'CRÍTICO', cls: 'gap-critico', badge: 'badge-critico', title: 'Adoção crítica dos sistemas', desc: `Menos de ${adocao === 'menos20' ? '20%' : '40%'} da equipe usa os sistemas diariamente. Cada R$ investido em tecnologia entrega uma fração do potencial.`, action: 'Fase EMPOWER do G-FORGE™ — identificar resistências e adoção ativa por 60 dias', cost: 'Corresponde a ~70% da sua perda anual estimada' });

  if (['mais10', '5-10'].includes(horas))
    gaps.push({ priority: horas === 'mais10' ? 1 : 3, impact: 'CRÍTICO', cls: 'gap-critico', badge: 'badge-critico', title: 'Horas manuais — equipe trabalha para o processo', desc: `${horas === 'mais10' ? 'Mais de 10' : 'Entre 5 e 10'} horas por semana em tarefas automatizáveis por funcionário. Sua equipe está executando o que o sistema deveria fazer.`, action: 'Fase GENERATE do G-FORGE™ — automações calibradas para adoção real', cost: 'Principal componente do custo operacional calculado' });

  if (integracao === 'nao')
    gaps.push({ priority: 4, impact: 'ALTO', cls: 'gap-alto', badge: 'badge-alto', title: 'Zero integração — dado copiado manualmente', desc: 'Seus sistemas não conversam. A equipe faz a ponte manualmente — e cada cópia é um ponto de erro, atraso e retrabalho.', action: 'Fase REFINE + GENERATE — redesenho de fluxo antes da integração técnica', cost: 'Gera erros operacionais e retrabalho não quantificado' });

  if (['3mais', '2'].includes(fantasmas))
    gaps.push({ priority: 5, impact: 'ALTO', cls: 'gap-alto', badge: 'badge-alto', title: 'Sistemas fantasmas — você paga sem usar', desc: `${fantasmas === '3mais' ? '3 ou mais' : '2'} sistemas ativos com baixo ou nenhum uso. Custo fixo sem retorno — e ocupam espaço mental da equipe que poderia estar adotando o que funciona.`, action: 'Fase FOUNDRY do G-FORGE™ — mapeamento e consolidação de sistemas', cost: `Custo estimado: R$${(({'3mais': 27000, '2': 18000} as Record<string, number>)[fantasmas] || 0).toLocaleString('pt-BR')}/ano` });

  if (['mais5', '3-5'].includes(processos))
    gaps.push({ priority: 6, impact: 'ALTO', cls: 'gap-alto', badge: 'badge-alto', title: 'Processos em planilha — operação fora dos sistemas', desc: `${processos === 'mais5' ? 'Mais de 5' : 'De 3 a 5'} processos críticos em planilha ou e-mail. Dado sem rastreabilidade, sem histórico, sem possibilidade de análise.`, action: 'Fase OBSERVE do G-FORGE™ — mapeamento do processo real antes de digitalizar', cost: 'Risco de compliance e perda de histórico operacional' });

  if (['mais1sem', '1semana'].includes(relatorios))
    gaps.push({ priority: 7, impact: 'MÉDIO', cls: 'gap-medio', badge: 'badge-medio', title: 'Relatório lento — decisão com dado atrasado', desc: `Relatórios gerenciais levam ${relatorios === 'mais1sem' ? 'mais de 1 semana' : 'cerca de 1 semana'}. Você decide com dado de semana (ou mês) passada — em um mercado que muda diariamente.`, action: 'Fase GENERATE do G-FORGE™ — dashboard gerencial integrado aos processos adotados', cost: 'Custo de decisão baseada em informação desatualizada' });

  if (['mais1x', '1x'].includes(historico))
    gaps.push({ priority: 8, impact: 'ALTO', cls: 'gap-alto', badge: 'badge-alto', title: 'Histórico de abandono — padrão de repetição', desc: `Sua empresa já abandonou sistemas antes. Sem mudança de método, a probabilidade de repetição é alta — independente de qual sistema for implementado.`, action: 'G-FORGE™ completo — começa pelo diagnóstico do que falhou e por quê', cost: 'Risco de perder o investimento na próxima implementação' });

  return gaps.sort((a, b) => a.priority - b.priority).slice(0, 3);
}

export function getDynamicRoadmap(score: number) {
  const phase = getPhase(score);
  const isLowMaturity = score <= 45; // Pré-FOUNDRY, FOUNDRY, OBSERVE
  
  if (isLowMaturity) {
    return [
      { period: 'Semanas 1–2', title: 'Diagnóstico e mapeamento de processo real (Fase FOUNDRY + OBSERVE)', desc: 'Antes de qualquer sistema ou automação: mapear como a equipe trabalha de verdade, onde cria workarounds e onde o dado existe mas não é usado.', gain: 'Clareza sobre onde está o maior ROI — sem gastar em solução errada' },
      { period: 'Semanas 3–7', title: 'Redesenho de fluxo e entrega calibrada (Fase REFINE + GENERATE)', desc: 'Ajustar o processo antes de implementar o sistema. Entregar o sistema configurado para o nível de maturidade da equipe — não para o máximo que a ferramenta permite.', gain: 'Sistema que a equipe consegue usar desde o primeiro dia' },
      { period: 'Semanas 8–12', title: 'Adoção ativa e consolidação (Fase EMPOWER)', desc: 'Acompanhar o uso real durante as primeiras 4 semanas. Identificar quem está resistindo e por quê. Ajustar processo e sistema em tempo real.', gain: 'Redução de 80% do retrabalho manual' }
    ];
  } else {
    return [
      { period: 'Semanas 1–2', title: 'Auditoria de Gaps de Integração (Fase REFINE)', desc: 'Identificar silos de dados e pontos de gargalo onde a informação é perdida ou repassada manualmente entre sistemas.', gain: 'Visibilidade completa dos dados travados' },
      { period: 'Semanas 3–7', title: 'Implementação de Automações Core (Fase GENERATE)', desc: 'Construir pontes de integração (API/Webhooks) entre os sistemas existentes, eliminando a digitação dupla.', gain: 'Relatórios gerenciais em tempo real' },
      { period: 'Semanas 8–12', title: 'Treinamento e Expansão (Fase EMPOWER + EXPAND)', desc: 'Capacitação avançada da equipe nas novas automações e painéis gerenciais. Transição para cultura data-driven.', gain: 'Adoção de 90%+ sustentada e escalável' }
    ];
  }
}
