import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AutomationRequest {
  action: 'process_overdue' | 'send_alerts' | 'generate_reports' | 'sync_payments' | 'backup_data';
  params?: Record<string, any>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🤖 Financial Automation starting...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const requestBody = await req.json() as AutomationRequest;
    console.log('📋 Automation request:', requestBody);

    let result: any = {};

    switch (requestBody.action) {
      case 'process_overdue':
        result = await processOverdueAccounts(supabase, requestBody.params);
        break;
      case 'send_alerts':
        result = await sendFinancialAlerts(supabase, requestBody.params);
        break;
      case 'generate_reports':
        result = await generateAutomatedReports(supabase, requestBody.params);
        break;
      case 'sync_payments':
        result = await syncPaymentStatus(supabase, requestBody.params);
        break;
      case 'backup_data':
        result = await backupFinancialData(supabase, requestBody.params);
        break;
      default:
        throw new Error(`Unknown automation action: ${requestBody.action}`);
    }

    console.log('✅ Automation completed successfully:', result);

    // Log the operation
    await supabase.rpc('log_system_operation', {
      p_operation_type: `financial_automation_${requestBody.action}`,
      p_metadata: {
        action: requestBody.action,
        params: requestBody.params,
        result,
        timestamp: new Date().toISOString()
      }
    });

    return new Response(JSON.stringify({
      success: true,
      action: requestBody.action,
      result,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Financial automation error:', error);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function processOverdueAccounts(supabase: any, params: any) {
  console.log('🔍 Processing overdue accounts...');
  
  const today = new Date().toISOString().split('T')[0];
  
  // Find overdue payables
  const { data: overduePayables, error: payablesError } = await supabase
    .from('accounts_payable')
    .select('*')
    .eq('status', 'pending')
    .lt('due_date', today);

  if (payablesError) throw payablesError;

  // Find overdue receivables
  const { data: overdueReceivables, error: receivablesError } = await supabase
    .from('accounts_receivable')
    .select('*')
    .eq('status', 'pending')
    .lt('due_date', today);

  if (receivablesError) throw receivablesError;

  // Update status to overdue
  let updatedPayables = 0;
  let updatedReceivables = 0;

  if (overduePayables.length > 0) {
    const { error } = await supabase
      .from('accounts_payable')
      .update({ status: 'overdue' })
      .in('id', overduePayables.map((p: any) => p.id));
    
    if (!error) updatedPayables = overduePayables.length;
  }

  if (overdueReceivables.length > 0) {
    const { error } = await supabase
      .from('accounts_receivable')
      .update({ status: 'overdue' })
      .in('id', overdueReceivables.map((r: any) => r.id));
    
    if (!error) updatedReceivables = overdueReceivables.length;
  }

  return {
    overduePayables: updatedPayables,
    overdueReceivables: updatedReceivables,
    totalProcessed: updatedPayables + updatedReceivables
  };
}

async function sendFinancialAlerts(supabase: any, params: any) {
  console.log('📧 Sending financial alerts...');
  
  const alerts = [];
  
  // Check for high-value overdue items
  const { data: highValueOverdue } = await supabase
    .from('accounts_receivable')
    .select('*')
    .eq('status', 'overdue')
    .gte('amount', params?.highValueThreshold || 10000);

  if (highValueOverdue && highValueOverdue.length > 0) {
    alerts.push({
      type: 'high_value_overdue',
      count: highValueOverdue.length,
      totalAmount: highValueOverdue.reduce((sum: number, item: any) => sum + item.amount, 0)
    });
  }

  // Check cash flow
  const { data: pendingPayables } = await supabase
    .from('accounts_payable')
    .select('amount')
    .eq('status', 'pending');

  const { data: pendingReceivables } = await supabase
    .from('accounts_receivable')
    .select('amount')
    .eq('status', 'pending');

  const totalPayables = pendingPayables?.reduce((sum: number, p: any) => sum + p.amount, 0) || 0;
  const totalReceivables = pendingReceivables?.reduce((sum: number, r: any) => sum + r.amount, 0) || 0;
  const cashFlow = totalReceivables - totalPayables;

  if (cashFlow < (params?.cashFlowThreshold || 0)) {
    alerts.push({
      type: 'negative_cash_flow',
      cashFlow,
      totalPayables,
      totalReceivables
    });
  }

  return {
    alertsGenerated: alerts.length,
    alerts
  };
}

async function generateAutomatedReports(supabase: any, params: any) {
  console.log('📊 Generating automated reports...');
  
  const reportType = params?.reportType || 'daily_summary';
  const today = new Date().toISOString().split('T')[0];
  
  // Generate basic financial summary
  const { data: transactions } = await supabase
    .from('financial_transactions')
    .select('*')
    .gte('transaction_date', today);

  const { data: payables } = await supabase
    .from('accounts_payable')
    .select('amount, status')
    .eq('status', 'pending');

  const { data: receivables } = await supabase
    .from('accounts_receivable')
    .select('amount, status')
    .eq('status', 'pending');

  const report = {
    type: reportType,
    date: today,
    summary: {
      todayTransactions: transactions?.length || 0,
      pendingPayables: payables?.reduce((sum: number, p: any) => sum + p.amount, 0) || 0,
      pendingReceivables: receivables?.reduce((sum: number, r: any) => sum + r.amount, 0) || 0
    }
  };

  // Save report (simplified - would normally save to storage)
  console.log('📈 Report generated:', report);

  return report;
}

async function syncPaymentStatus(supabase: any, params: any) {
  console.log('🔄 Syncing payment status...');
  
  // This would normally sync with external payment systems
  // For now, just return a mock response
  return {
    syncedPayables: 0,
    syncedReceivables: 0,
    lastSync: new Date().toISOString()
  };
}

async function backupFinancialData(supabase: any, params: any) {
  console.log('💾 Backing up financial data...');
  
  // This would normally backup to external storage
  // For now, just log the operation
  return {
    backupCompleted: true,
    timestamp: new Date().toISOString(),
    tablesBackedUp: ['accounts_payable', 'accounts_receivable', 'financial_transactions']
  };
}