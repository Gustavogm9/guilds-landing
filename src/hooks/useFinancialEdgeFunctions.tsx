import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FinancialAutomationRequest {
  action: 'process_overdue' | 'generate_reports' | 'send_alerts' | 'process_payments';
  params?: any;
}

interface ReportRequest {
  reportType: 'cash_flow' | 'aging' | 'profit_loss' | 'balance_sheet' | 'financial_summary';
  period: {
    start: string;
    end: string;
  };
  format: 'json' | 'pdf' | 'excel';
  recipients?: string[];
}

interface WebhookPayload {
  event_type: string;
  data: any;
  source: string;
  timestamp: string;
}

export const useFinancialEdgeFunctions = () => {
  // Financial Automation
  const executeFinancialAutomation = useMutation({
    mutationFn: async (request: FinancialAutomationRequest) => {
      const { data, error } = await supabase.functions.invoke('financial-automation', {
        body: request
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      const actionLabels = {
        process_overdue: 'processamento de vencimentos',
        generate_reports: 'geração de relatórios',
        send_alerts: 'envio de alertas',
        process_payments: 'processamento de pagamentos'
      };
      
      toast.success(`${actionLabels[variables.action]} concluído com sucesso!`);
    },
    onError: (error) => {
      toast.error(`Erro na automação: ${error.message}`);
    },
  });

  // Report Generator
  const generateFinancialReport = useMutation({
    mutationFn: async (request: ReportRequest) => {
      const { data, error } = await supabase.functions.invoke('financial-report-generator', {
        body: request
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      const reportLabels = {
        cash_flow: 'Fluxo de Caixa',
        aging: 'Aging de Contas',
        profit_loss: 'DRE',
        balance_sheet: 'Balanço Patrimonial',
        financial_summary: 'Resumo Financeiro'
      };
      
      toast.success(`Relatório ${reportLabels[variables.reportType]} gerado com sucesso!`);
    },
    onError: (error) => {
      toast.error(`Erro na geração do relatório: ${error.message}`);
    },
  });

  // Webhook Processor
  const processWebhook = useMutation({
    mutationFn: async (payload: WebhookPayload) => {
      const { data, error } = await supabase.functions.invoke('financial-webhook-processor', {
        body: payload
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      toast.success(`Webhook ${variables.event_type} processado com sucesso!`);
    },
    onError: (error) => {
      toast.error(`Erro no processamento do webhook: ${error.message}`);
    },
  });

  // Convenience methods for common operations
  const processOverdueAccounts = () => {
    return executeFinancialAutomation.mutate({
      action: 'process_overdue'
    });
  };

  const sendFinancialAlerts = () => {
    return executeFinancialAutomation.mutate({
      action: 'send_alerts'
    });
  };

  const generateWeeklyReport = () => {
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);

    return generateFinancialReport.mutate({
      reportType: 'financial_summary',
      period: {
        start: weekAgo.toISOString().split('T')[0],
        end: today.toISOString().split('T')[0]
      },
      format: 'json',
      recipients: ['financeiro@guilds.com.br', 'gestao@guilds.com.br']
    });
  };

  const generateMonthlyReport = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return generateFinancialReport.mutate({
      reportType: 'financial_summary',
      period: {
        start: firstDay.toISOString().split('T')[0],
        end: lastDay.toISOString().split('T')[0]
      },
      format: 'json',
      recipients: ['financeiro@guilds.com.br', 'gestao@guilds.com.br']
    });
  };

  const processPaymentWebhook = (paymentData: any) => {
    return processWebhook.mutate({
      event_type: 'payment_received',
      data: paymentData,
      source: 'payment_gateway',
      timestamp: new Date().toISOString()
    });
  };

  const processInvoiceWebhook = (invoiceData: any) => {
    return processWebhook.mutate({
      event_type: 'invoice_created',
      data: invoiceData,
      source: 'invoicing_system',
      timestamp: new Date().toISOString()
    });
  };

  const processBankTransaction = (transactionData: any) => {
    return processWebhook.mutate({
      event_type: 'bank_transaction',
      data: transactionData,
      source: 'banking_api',
      timestamp: new Date().toISOString()
    });
  };

  return {
    // Raw edge function calls
    executeFinancialAutomation,
    generateFinancialReport,
    processWebhook,
    
    // Convenience methods
    processOverdueAccounts,
    sendFinancialAlerts,
    generateWeeklyReport,
    generateMonthlyReport,
    processPaymentWebhook,
    processInvoiceWebhook,
    processBankTransaction,
    
    // Loading states
    isProcessingAutomation: executeFinancialAutomation.isPending,
    isGeneratingReport: generateFinancialReport.isPending,
    isProcessingWebhook: processWebhook.isPending
  };
};