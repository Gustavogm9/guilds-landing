export interface PaymentSchedule {
  parcelas: Array<{
    numero: number;
    percentual: number;
    valor: number;
    vencimento: string;
    descricao: string;
  }>;
  total: number;
}

export interface MaintenancePlan {
  nome: string;
  valor: number;
  beneficios?: string[];
  currency: string;
}

export interface RevShareCalculation {
  guildsImpl: number;
  parceiroImpl: number;
  guildsMensal: number;
  parceiroMensal: number;
}

export function calculatePaymentSchedule(
  totalValue: number,
  modelo: '30-20-20-30' | '50-50' | '100-0' | 'custom',
  customPercentages?: number[],
  dueDates?: string[]
): PaymentSchedule {
  let percentages: number[];
  
  switch (modelo) {
    case '30-20-20-30':
      percentages = [30, 20, 20, 30];
      break;
    case '50-50':
      percentages = [50, 50];
      break;
    case '100-0':
      percentages = [100];
      break;
    case 'custom':
      percentages = customPercentages || [100];
      break;
  }
  
  const parcelas = percentages.map((perc, idx) => ({
    numero: idx + 1,
    percentual: perc,
    valor: (totalValue * perc) / 100,
    vencimento: dueDates?.[idx] || `Parcela ${idx + 1}`,
    descricao: idx === 0 ? 'Entrada' : 
               idx === percentages.length - 1 ? 'Saldo final' : 
               `Parcela ${idx + 1}`
  }));
  
  return { parcelas, total: totalValue };
}

export function calculateMaintenancePlans(
  catalogPlans: any[]
): MaintenancePlan[] {
  return catalogPlans
    .filter(p => p.category === 'maintenance')
    .sort((a, b) => a.display_order - b.display_order)
    .map(plan => ({
      nome: plan.name,
      valor: plan.value,
      beneficios: plan.benefits,
      currency: plan.currency
    }));
}

export function calculateRevShare(
  totalValue: number,
  percentualImpl: number,
  percentualMensal: number,
  estimatedMonthlyRevenue: number
): RevShareCalculation {
  return {
    guildsImpl: (totalValue * percentualImpl) / 100,
    parceiroImpl: (totalValue * (100 - percentualImpl)) / 100,
    guildsMensal: (estimatedMonthlyRevenue * percentualMensal) / 100,
    parceiroMensal: (estimatedMonthlyRevenue * (100 - percentualMensal)) / 100
  };
}

export function formatCurrency(value: number, currency: string = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency
  }).format(value);
}

export function generateChangelog(fromVariables: any, toVariables: any): string {
  const changes: string[] = [];
  
  if (fromVariables?.investimento?.valor !== toVariables?.investimento?.valor) {
    changes.push(
      `Investimento alterado de ${formatCurrency(fromVariables?.investimento?.valor || 0)} para ${formatCurrency(toVariables?.investimento?.valor || 0)}`
    );
  }
  
  if (fromVariables?.pagamento?.modelo !== toVariables?.pagamento?.modelo) {
    changes.push(
      `Modelo de pagamento alterado de ${fromVariables?.pagamento?.modelo} para ${toVariables?.pagamento?.modelo}`
    );
  }
  
  const fromSprints = fromVariables?.prazos?.sprints?.length || 0;
  const toSprints = toVariables?.prazos?.sprints?.length || 0;
  if (fromSprints !== toSprints) {
    changes.push(`Número de sprints alterado de ${fromSprints} para ${toSprints}`);
  }
  
  if (fromVariables?.manutencao?.planoDefault !== toVariables?.manutencao?.planoDefault) {
    changes.push(
      `Plano de manutenção padrão alterado para ${toVariables?.manutencao?.planoDefault}`
    );
  }
  
  return changes.join('; ') || 'Sem alterações significativas';
}
