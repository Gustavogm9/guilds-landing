import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FinancialAutomationRequest {
  action: 'process_overdue' | 'generate_reports' | 'send_alerts' | 'process_payments';
  params?: any;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Financial automation function called');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, params }: FinancialAutomationRequest = await req.json();
    console.log(`Processing action: ${action}`, params);

    let result;

    switch (action) {
      case 'process_overdue':
        result = await processOverdueAccounts(supabase);
        break;
      case 'generate_reports':
        result = await generateFinancialReports(supabase, params);
        break;
      case 'send_alerts':
        result = await sendFinancialAlerts(supabase);
        break;
      case 'process_payments':
        result = await processPaymentUpdates(supabase, params);
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    console.log('Automation completed successfully:', result);

    return new Response(
      JSON.stringify({ success: true, result }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error('Error in financial automation:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

async function processOverdueAccounts(supabase: any) {
  console.log('Processing overdue accounts...');
  
  const today = new Date().toISOString().split('T')[0];
  
  // Get overdue receivables
  const { data: overdueReceivables, error: receivableError } = await supabase
    .from('accounts_receivable')
    .select('*')
    .eq('status', 'pending')
    .lt('due_date', today);
  
  if (receivableError) {
    console.error('Error fetching overdue receivables:', receivableError);
    throw receivableError;
  }

  // Update status to overdue
  const receivableUpdates = overdueReceivables.map(account => ({
    id: account.id,
    status: 'overdue'
  }));

  if (receivableUpdates.length > 0) {
    const { error: updateError } = await supabase
      .from('accounts_receivable')
      .upsert(receivableUpdates);
    
    if (updateError) {
      console.error('Error updating receivables status:', updateError);
      throw updateError;
    }
  }

  // Get overdue payables
  const { data: overduePayables, error: payableError } = await supabase
    .from('accounts_payable')
    .select('*')
    .eq('status', 'pending')
    .lt('due_date', today);
  
  if (payableError) {
    console.error('Error fetching overdue payables:', payableError);
    throw payableError;
  }

  // Update payables status
  const payableUpdates = overduePayables.map(account => ({
    id: account.id,
    status: 'overdue'
  }));

  if (payableUpdates.length > 0) {
    const { error: updatePayableError } = await supabase
      .from('accounts_payable')
      .upsert(payableUpdates);
    
    if (updatePayableError) {
      console.error('Error updating payables status:', updatePayableError);
      throw updatePayableError;
    }
  }

  // Create notifications for overdue accounts
  const notifications = [];
  
  for (const account of overdueReceivables) {
    notifications.push({
      project_id: account.project_id,
      recipient_email: 'financeiro@guilds.com.br',
      recipient_type: 'admin',
      notification_type: 'overdue_receivable',
      subject: `Conta a Receber Vencida: ${account.description}`,
      content: `A conta a receber "${account.description}" no valor de R$ ${account.amount.toLocaleString('pt-BR')} está em atraso desde ${new Date(account.due_date).toLocaleDateString('pt-BR')}.`,
      metadata: { account_id: account.id, amount: account.amount, due_date: account.due_date }
    });
  }

  for (const account of overduePayables) {
    notifications.push({
      project_id: account.project_id,
      recipient_email: 'financeiro@guilds.com.br',
      recipient_type: 'admin',
      notification_type: 'overdue_payable',
      subject: `Conta a Pagar Vencida: ${account.description}`,
      content: `A conta a pagar "${account.description}" no valor de R$ ${account.amount.toLocaleString('pt-BR')} está em atraso desde ${new Date(account.due_date).toLocaleDateString('pt-BR')}.`,
      metadata: { account_id: account.id, amount: account.amount, due_date: account.due_date }
    });
  }

  if (notifications.length > 0) {
    const { error: notificationError } = await supabase
      .from('project_email_notifications')
      .insert(notifications);
    
    if (notificationError) {
      console.error('Error creating notifications:', notificationError);
      throw notificationError;
    }
  }

  return {
    overdueReceivables: overdueReceivables.length,
    overduePayables: overduePayables.length,
    notificationsCreated: notifications.length
  };
}

async function generateFinancialReports(supabase: any, params: any) {
  console.log('Generating financial reports...');
  
  const { reportType = 'weekly', period } = params || {};
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  
  let startDate, endDate;
  
  if (reportType === 'weekly') {
    const dayOfWeek = now.getDay();
    startDate = new Date(now);
    startDate.setDate(now.getDate() - dayOfWeek);
    endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
  } else if (reportType === 'monthly') {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  }

  const startDateStr = startDate!.toISOString().split('T')[0];
  const endDateStr = endDate!.toISOString().split('T')[0];

  // Get financial data for the period
  const [receivables, payables, transactions] = await Promise.all([
    supabase
      .from('accounts_receivable')
      .select('*')
      .gte('created_at', startDateStr)
      .lte('created_at', endDateStr),
    supabase
      .from('accounts_payable')
      .select('*')
      .gte('created_at', startDateStr)
      .lte('created_at', endDateStr),
    supabase
      .from('financial_transactions')
      .select('*')
      .gte('transaction_date', startDateStr)
      .lte('transaction_date', endDateStr)
  ]);

  // Calculate metrics
  const totalReceivable = receivables.data?.reduce((sum: number, r: any) => sum + r.amount, 0) || 0;
  const totalPayable = payables.data?.reduce((sum: number, p: any) => sum + p.amount, 0) || 0;
  const totalCredits = transactions.data?.filter((t: any) => t.transaction_type === 'credit').reduce((sum: number, t: any) => sum + t.amount, 0) || 0;
  const totalDebits = transactions.data?.filter((t: any) => t.transaction_type === 'debit').reduce((sum: number, t: any) => sum + t.amount, 0) || 0;
  
  const reportContent = {
    period: `${startDateStr} a ${endDateStr}`,
    type: reportType,
    metrics: {
      totalReceivable,
      totalPayable,
      cashFlow: totalReceivable - totalPayable,
      totalCredits,
      totalDebits,
      netFlow: totalCredits - totalDebits
    },
    summary: {
      receivablesCount: receivables.data?.length || 0,
      payablesCount: payables.data?.length || 0,
      transactionsCount: transactions.data?.length || 0
    }
  };

  // Save report to database
  const { data: report, error: reportError } = await supabase
    .from('project_reports')
    .insert({
      title: `Relatório Financeiro ${reportType === 'weekly' ? 'Semanal' : 'Mensal'}`,
      report_type: 'financial',
      content: reportContent,
      period_start: startDateStr,
      period_end: endDateStr,
      template_used: 'financial_standard'
    })
    .select()
    .single();

  if (reportError) {
    console.error('Error saving report:', reportError);
    throw reportError;
  }

  // Create notification for report generation
  const { error: notificationError } = await supabase
    .from('project_email_notifications')
    .insert({
      recipient_email: 'gestao@guilds.com.br',
      recipient_type: 'admin',
      notification_type: 'report_generated',
      subject: `Relatório Financeiro ${reportType === 'weekly' ? 'Semanal' : 'Mensal'} Disponível`,
      content: `O relatório financeiro do período ${reportContent.period} foi gerado e está disponível para consulta.\n\nResumo:\n- Total a Receber: R$ ${totalReceivable.toLocaleString('pt-BR')}\n- Total a Pagar: R$ ${totalPayable.toLocaleString('pt-BR')}\n- Fluxo de Caixa: R$ ${(totalReceivable - totalPayable).toLocaleString('pt-BR')}`,
      metadata: { report_id: report.id, ...reportContent }
    });

  if (notificationError) {
    console.error('Error creating report notification:', notificationError);
    throw notificationError;
  }

  return {
    reportId: report.id,
    content: reportContent
  };
}

async function sendFinancialAlerts(supabase: any) {
  console.log('Sending financial alerts...');
  
  const today = new Date();
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(today.getDate() + 3);
  
  const todayStr = today.toISOString().split('T')[0];
  const threeDaysStr = threeDaysFromNow.toISOString().split('T')[0];

  // Get accounts due in 3 days
  const { data: dueSoonReceivables } = await supabase
    .from('accounts_receivable')
    .select('*')
    .eq('status', 'pending')
    .gte('due_date', todayStr)
    .lte('due_date', threeDaysStr);

  const { data: dueSoonPayables } = await supabase
    .from('accounts_payable')
    .select('*')
    .eq('status', 'pending')
    .gte('due_date', todayStr)
    .lte('due_date', threeDaysStr);

  const alerts = [];

  // Create alerts for receivables
  for (const account of dueSoonReceivables || []) {
    alerts.push({
      recipient_email: 'financeiro@guilds.com.br',
      recipient_type: 'admin',
      notification_type: 'payment_reminder',
      subject: `Lembrete: Conta a Receber vence em breve`,
      content: `A conta a receber "${account.description}" no valor de R$ ${account.amount.toLocaleString('pt-BR')} vence em ${new Date(account.due_date).toLocaleDateString('pt-BR')}.`,
      metadata: { account_id: account.id, account_type: 'receivable', due_date: account.due_date }
    });
  }

  // Create alerts for payables
  for (const account of dueSoonPayables || []) {
    alerts.push({
      recipient_email: 'financeiro@guilds.com.br',
      recipient_type: 'admin',
      notification_type: 'payment_reminder',
      subject: `Lembrete: Conta a Pagar vence em breve`,
      content: `A conta a pagar "${account.description}" no valor de R$ ${account.amount.toLocaleString('pt-BR')} vence em ${new Date(account.due_date).toLocaleDateString('pt-BR')}.`,
      metadata: { account_id: account.id, account_type: 'payable', due_date: account.due_date }
    });
  }

  // Check cash flow
  const { data: allReceivables } = await supabase
    .from('accounts_receivable')
    .select('amount')
    .eq('status', 'pending');

  const { data: allPayables } = await supabase
    .from('accounts_payable')
    .select('amount')
    .eq('status', 'pending');

  const totalReceivable = allReceivables?.reduce((sum, r) => sum + r.amount, 0) || 0;
  const totalPayable = allPayables?.reduce((sum, p) => sum + p.amount, 0) || 0;
  const cashFlow = totalReceivable - totalPayable;

  // Alert if cash flow is negative
  if (cashFlow < 0) {
    alerts.push({
      recipient_email: 'gestao@guilds.com.br',
      recipient_type: 'admin',
      notification_type: 'cash_flow_alert',
      subject: 'ALERTA: Fluxo de Caixa Negativo',
      content: `O fluxo de caixa está negativo em R$ ${Math.abs(cashFlow).toLocaleString('pt-BR')}. É necessário tomar medidas para equilibrar as finanças.`,
      metadata: { cash_flow: cashFlow, total_receivable: totalReceivable, total_payable: totalPayable }
    });
  }

  if (alerts.length > 0) {
    const { error: alertError } = await supabase
      .from('project_email_notifications')
      .insert(alerts);
    
    if (alertError) {
      console.error('Error creating alerts:', alertError);
      throw alertError;
    }
  }

  return {
    dueSoonReceivables: dueSoonReceivables?.length || 0,
    dueSoonPayables: dueSoonPayables?.length || 0,
    cashFlowAlert: cashFlow < 0,
    alertsCreated: alerts.length
  };
}

async function processPaymentUpdates(supabase: any, params: any) {
  console.log('Processing payment updates...', params);
  
  const { payments } = params || {};
  
  if (!payments || !Array.isArray(payments)) {
    throw new Error('Invalid payments data provided');
  }

  const results = {
    processed: 0,
    errors: []
  };

  for (const payment of payments) {
    try {
      const { id, type, status, payment_date, payment_method } = payment;
      const table = type === 'receivable' ? 'accounts_receivable' : 'accounts_payable';
      
      const { error } = await supabase
        .from(table)
        .update({
          status,
          payment_date,
          payment_method,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error(`Error updating payment ${id}:`, error);
        results.errors.push({ id, error: error.message });
      } else {
        results.processed++;
        
        // Create transaction record
        const { data: account } = await supabase
          .from(table)
          .select('amount, description, project_id')
          .eq('id', id)
          .single();
        
        if (account && status === 'paid') {
          await supabase
            .from('financial_transactions')
            .insert({
              transaction_type: type === 'receivable' ? 'credit' : 'debit',
              amount: account.amount,
              description: `Pagamento: ${account.description}`,
              reference_id: id,
              reference_type: type,
              transaction_date: payment_date || new Date().toISOString().split('T')[0],
              project_id: account.project_id
            });
        }
      }
    } catch (error: any) {
      console.error(`Error processing payment:`, error);
      results.errors.push({ id: payment.id, error: error.message });
    }
  }

  return results;
}

serve(handler);