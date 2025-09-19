import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReportRequest {
  reportType: 'cash_flow' | 'aging' | 'profit_loss' | 'balance_sheet' | 'financial_summary';
  period: {
    start: string;
    end: string;
  };
  format: 'json' | 'pdf' | 'excel';
  recipients?: string[];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Report generator function called');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { reportType, period, format, recipients }: ReportRequest = await req.json();
    console.log(`Generating ${reportType} report for period ${period.start} to ${period.end}`);

    let reportData;
    let reportTitle;

    switch (reportType) {
      case 'cash_flow':
        reportData = await generateCashFlowReport(supabase, period);
        reportTitle = 'Relatório de Fluxo de Caixa';
        break;
      case 'aging':
        reportData = await generateAgingReport(supabase, period);
        reportTitle = 'Relatório de Aging de Contas';
        break;
      case 'profit_loss':
        reportData = await generateProfitLossReport(supabase, period);
        reportTitle = 'Demonstrativo de Resultados';
        break;
      case 'balance_sheet':
        reportData = await generateBalanceSheetReport(supabase, period);
        reportTitle = 'Balanço Patrimonial';
        break;
      case 'financial_summary':
        reportData = await generateFinancialSummaryReport(supabase, period);
        reportTitle = 'Resumo Financeiro';
        break;
      default:
        throw new Error(`Unknown report type: ${reportType}`);
    }

    // Save report to database
    const { data: savedReport, error: saveError } = await supabase
      .from('project_reports')
      .insert({
        title: reportTitle,
        report_type: reportType,
        content: reportData,
        period_start: period.start,
        period_end: period.end,
        template_used: `${reportType}_template`,
        generated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving report:', saveError);
      throw saveError;
    }

    // Send notifications if recipients specified
    if (recipients && recipients.length > 0) {
      const notifications = recipients.map(email => ({
        recipient_email: email,
        recipient_type: 'admin',
        notification_type: 'report_generated',
        subject: `${reportTitle} - ${new Date().toLocaleDateString('pt-BR')}`,
        content: `O ${reportTitle.toLowerCase()} para o período de ${new Date(period.start).toLocaleDateString('pt-BR')} a ${new Date(period.end).toLocaleDateString('pt-BR')} foi gerado e está disponível para consulta.`,
        metadata: {
          report_id: savedReport.id,
          report_type: reportType,
          period: period,
          format: format
        }
      }));

      await supabase
        .from('project_email_notifications')
        .insert(notifications);
    }

    console.log('Report generated successfully:', savedReport.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        report: {
          id: savedReport.id,
          title: reportTitle,
          data: reportData,
          format: format
        }
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error('Error generating report:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

async function generateCashFlowReport(supabase: any, period: any) {
  console.log('Generating cash flow report...');
  
  // Get all transactions in period
  const { data: transactions, error: transError } = await supabase
    .from('financial_transactions')
    .select('*')
    .gte('transaction_date', period.start)
    .lte('transaction_date', period.end)
    .order('transaction_date');

  if (transError) throw transError;

  // Get receivables in period
  const { data: receivables, error: recError } = await supabase
    .from('accounts_receivable')
    .select('*')
    .gte('due_date', period.start)
    .lte('due_date', period.end);

  if (recError) throw recError;

  // Get payables in period
  const { data: payables, error: payError } = await supabase
    .from('accounts_payable')
    .select('*')
    .gte('due_date', period.start)
    .lte('due_date', period.end);

  if (payError) throw payError;

  // Calculate cash flow by day
  const cashFlowByDay = new Map();
  
  // Process transactions
  transactions.forEach((transaction: any) => {
    const date = transaction.transaction_date;
    if (!cashFlowByDay.has(date)) {
      cashFlowByDay.set(date, { inflow: 0, outflow: 0, net: 0 });
    }
    
    const dayFlow = cashFlowByDay.get(date);
    if (transaction.transaction_type === 'credit') {
      dayFlow.inflow += transaction.amount;
    } else {
      dayFlow.outflow += transaction.amount;
    }
    dayFlow.net = dayFlow.inflow - dayFlow.outflow;
  });

  // Summary calculations
  const totalInflow = transactions
    .filter((t: any) => t.transaction_type === 'credit')
    .reduce((sum: number, t: any) => sum + t.amount, 0);
    
  const totalOutflow = transactions
    .filter((t: any) => t.transaction_type === 'debit')
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  const pendingReceivables = receivables
    .filter((r: any) => r.status === 'pending')
    .reduce((sum: number, r: any) => sum + r.amount, 0);

  const pendingPayables = payables
    .filter((p: any) => p.status === 'pending')
    .reduce((sum: number, p: any) => sum + p.amount, 0);

  return {
    period,
    summary: {
      totalInflow,
      totalOutflow,
      netCashFlow: totalInflow - totalOutflow,
      pendingReceivables,
      pendingPayables,
      projectedCashFlow: (totalInflow + pendingReceivables) - (totalOutflow + pendingPayables)
    },
    dailyFlow: Array.from(cashFlowByDay.entries()).map(([date, flow]) => ({
      date,
      ...flow
    })),
    transactions: transactions.length,
    receivables: receivables.length,
    payables: payables.length
  };
}

async function generateAgingReport(supabase: any, period: any) {
  console.log('Generating aging report...');
  
  const today = new Date();
  
  // Get all pending receivables
  const { data: receivables, error: recError } = await supabase
    .from('accounts_receivable')
    .select('*')
    .eq('status', 'pending');

  if (recError) throw recError;

  // Get all pending payables
  const { data: payables, error: payError } = await supabase
    .from('accounts_payable')
    .select('*')
    .eq('status', 'pending');

  if (payError) throw payError;

  // Categorize by aging buckets
  const agingBuckets = {
    current: { receivables: 0, payables: 0 },        // Not due yet
    overdue1to30: { receivables: 0, payables: 0 },   // 1-30 days overdue
    overdue31to60: { receivables: 0, payables: 0 },  // 31-60 days overdue
    overdue61to90: { receivables: 0, payables: 0 },  // 61-90 days overdue
    overdue90plus: { receivables: 0, payables: 0 }   // 90+ days overdue
  };

  // Categorize receivables
  receivables.forEach((r: any) => {
    const dueDate = new Date(r.due_date);
    const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysOverdue < 0) {
      agingBuckets.current.receivables += r.amount;
    } else if (daysOverdue <= 30) {
      agingBuckets.overdue1to30.receivables += r.amount;
    } else if (daysOverdue <= 60) {
      agingBuckets.overdue31to60.receivables += r.amount;
    } else if (daysOverdue <= 90) {
      agingBuckets.overdue61to90.receivables += r.amount;
    } else {
      agingBuckets.overdue90plus.receivables += r.amount;
    }
  });

  // Categorize payables
  payables.forEach((p: any) => {
    const dueDate = new Date(p.due_date);
    const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysOverdue < 0) {
      agingBuckets.current.payables += p.amount;
    } else if (daysOverdue <= 30) {
      agingBuckets.overdue1to30.payables += p.amount;
    } else if (daysOverdue <= 60) {
      agingBuckets.overdue31to60.payables += p.amount;
    } else if (daysOverdue <= 90) {
      agingBuckets.overdue61to90.payables += p.amount;
    } else {
      agingBuckets.overdue90plus.payables += p.amount;
    }
  });

  const totalReceivables = receivables.reduce((sum: number, r: any) => sum + r.amount, 0);
  const totalPayables = payables.reduce((sum: number, p: any) => sum + p.amount, 0);

  return {
    period,
    generatedAt: today.toISOString(),
    summary: {
      totalReceivables,
      totalPayables,
      netPosition: totalReceivables - totalPayables
    },
    aging: {
      current: {
        ...agingBuckets.current,
        net: agingBuckets.current.receivables - agingBuckets.current.payables
      },
      overdue1to30: {
        ...agingBuckets.overdue1to30,
        net: agingBuckets.overdue1to30.receivables - agingBuckets.overdue1to30.payables
      },
      overdue31to60: {
        ...agingBuckets.overdue31to60,
        net: agingBuckets.overdue31to60.receivables - agingBuckets.overdue31to60.payables
      },
      overdue61to90: {
        ...agingBuckets.overdue61to90,
        net: agingBuckets.overdue61to90.receivables - agingBuckets.overdue61to90.payables
      },
      overdue90plus: {
        ...agingBuckets.overdue90plus,
        net: agingBuckets.overdue90plus.receivables - agingBuckets.overdue90plus.payables
      }
    },
    details: {
      receivables: receivables.map((r: any) => ({
        ...r,
        daysOverdue: Math.max(0, Math.floor((today.getTime() - new Date(r.due_date).getTime()) / (1000 * 60 * 60 * 24)))
      })),
      payables: payables.map((p: any) => ({
        ...p,
        daysOverdue: Math.max(0, Math.floor((today.getTime() - new Date(p.due_date).getTime()) / (1000 * 60 * 60 * 24)))
      }))
    }
  };
}

async function generateProfitLossReport(supabase: any, period: any) {
  console.log('Generating profit & loss report...');
  
  // Get transactions categorized as revenue and expenses
  const { data: transactions, error: transError } = await supabase
    .from('financial_transactions')
    .select('*')
    .gte('transaction_date', period.start)
    .lte('transaction_date', period.end);

  if (transError) throw transError;

  const revenue = transactions
    .filter((t: any) => t.transaction_type === 'credit')
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  const expenses = transactions
    .filter((t: any) => t.transaction_type === 'debit')
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  // Categorize expenses by category
  const expensesByCategory = transactions
    .filter((t: any) => t.transaction_type === 'debit')
    .reduce((acc: any, t: any) => {
      const category = t.category || 'other';
      acc[category] = (acc[category] || 0) + t.amount;
      return acc;
    }, {});

  return {
    period,
    summary: {
      totalRevenue: revenue,
      totalExpenses: expenses,
      grossProfit: revenue - expenses,
      profitMargin: revenue > 0 ? ((revenue - expenses) / revenue) * 100 : 0
    },
    revenue: {
      total: revenue,
      breakdown: transactions
        .filter((t: any) => t.transaction_type === 'credit')
        .reduce((acc: any, t: any) => {
          const category = t.category || 'other';
          acc[category] = (acc[category] || 0) + t.amount;
          return acc;
        }, {})
    },
    expenses: {
      total: expenses,
      breakdown: expensesByCategory
    },
    transactions: {
      count: transactions.length,
      revenue_count: transactions.filter((t: any) => t.transaction_type === 'credit').length,
      expense_count: transactions.filter((t: any) => t.transaction_type === 'debit').length
    }
  };
}

async function generateBalanceSheetReport(supabase: any, period: any) {
  console.log('Generating balance sheet report...');
  
  // Get current assets (receivables)
  const { data: receivables, error: recError } = await supabase
    .from('accounts_receivable')
    .select('*')
    .eq('status', 'pending');

  if (recError) throw recError;

  // Get current liabilities (payables)
  const { data: payables, error: payError } = await supabase
    .from('accounts_payable')
    .select('*')
    .eq('status', 'pending');

  if (payError) throw payError;

  // Calculate cash from transactions
  const { data: transactions, error: transError } = await supabase
    .from('financial_transactions')
    .select('amount, transaction_type')
    .lte('transaction_date', period.end);

  if (transError) throw transError;

  const cash = transactions.reduce((sum: number, t: any) => {
    return t.transaction_type === 'credit' ? sum + t.amount : sum - t.amount;
  }, 0);

  const currentAssets = {
    cash,
    accountsReceivable: receivables.reduce((sum: number, r: any) => sum + r.amount, 0)
  };

  const currentLiabilities = {
    accountsPayable: payables.reduce((sum: number, p: any) => sum + p.amount, 0)
  };

  const totalAssets = currentAssets.cash + currentAssets.accountsReceivable;
  const totalLiabilities = currentLiabilities.accountsPayable;
  const equity = totalAssets - totalLiabilities;

  return {
    period,
    asOf: period.end,
    assets: {
      current: currentAssets,
      total: totalAssets
    },
    liabilities: {
      current: currentLiabilities,
      total: totalLiabilities
    },
    equity: {
      retainedEarnings: equity,
      total: equity
    },
    totals: {
      assets: totalAssets,
      liabilitiesAndEquity: totalLiabilities + equity
    }
  };
}

async function generateFinancialSummaryReport(supabase: any, period: any) {
  console.log('Generating financial summary report...');
  
  // Get all data for comprehensive summary
  const [cashFlow, aging, profitLoss, balanceSheet] = await Promise.all([
    generateCashFlowReport(supabase, period),
    generateAgingReport(supabase, period),
    generateProfitLossReport(supabase, period),
    generateBalanceSheetReport(supabase, period)
  ]);

  // Calculate key performance indicators
  const kpis = {
    cashFlowRatio: balanceSheet.liabilities.total > 0 ? 
      cashFlow.summary.netCashFlow / balanceSheet.liabilities.total : 0,
    receivablesTurnover: profitLoss.summary.totalRevenue > 0 && balanceSheet.assets.current.accountsReceivable > 0 ? 
      profitLoss.summary.totalRevenue / balanceSheet.assets.current.accountsReceivable : 0,
    currentRatio: balanceSheet.liabilities.current.accountsPayable > 0 ?
      (balanceSheet.assets.current.cash + balanceSheet.assets.current.accountsReceivable) / balanceSheet.liabilities.current.accountsPayable : 0,
    profitMargin: profitLoss.summary.profitMargin
  };

  return {
    period,
    overview: {
      cashPosition: balanceSheet.assets.current.cash,
      netWorth: balanceSheet.equity.total,
      profitLoss: profitLoss.summary.grossProfit,
      cashFlow: cashFlow.summary.netCashFlow
    },
    kpis,
    highlights: {
      revenue: profitLoss.summary.totalRevenue,
      expenses: profitLoss.summary.totalExpenses,
      receivables: balanceSheet.assets.current.accountsReceivable,
      payables: balanceSheet.liabilities.current.accountsPayable
    },
    trends: {
      // This would be enhanced with historical data comparison
      cashFlowTrend: cashFlow.summary.netCashFlow > 0 ? 'positive' : 'negative',
      profitTrend: profitLoss.summary.grossProfit > 0 ? 'positive' : 'negative'
    },
    alerts: [
      ...(aging.aging.overdue90plus.receivables > 0 ? ['Contas a receber com mais de 90 dias em atraso'] : []),
      ...(aging.aging.overdue90plus.payables > 0 ? ['Contas a pagar com mais de 90 dias em atraso'] : []),
      ...(cashFlow.summary.netCashFlow < 0 ? ['Fluxo de caixa negativo no período'] : []),
      ...(kpis.currentRatio < 1 ? ['Liquidez corrente abaixo do recomendado'] : [])
    ]
  };
}

serve(handler);