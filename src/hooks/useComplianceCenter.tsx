import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuditLog {
  id: string;
  event_type: string;
  user_id?: string;
  ip_address?: unknown;
  user_agent?: string;
  created_at: string;
  details?: any;
}

interface ComplianceReport {
  id: string;
  report_type: string;
  generated_at: string;
  status: string;
  file_path?: string;
  metadata: any;
}

interface AccessControl {
  user_id: string;
  permissions: string[];
  role: string;
  last_access: string;
  is_active: boolean;
}

interface BackupStatus {
  last_backup: string;
  status: 'success' | 'failed' | 'in_progress';
  size: string;
  next_scheduled: string;
  retention_policy: string;
}

export const useComplianceCenter = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [complianceReports, setComplianceReports] = useState<ComplianceReport[]>([]);
  const [accessControls, setAccessControls] = useState<AccessControl[]>([]);
  const [backupStatus, setBackupStatus] = useState<BackupStatus | null>(null);
  const [securityMetrics, setSecurityMetrics] = useState<any>({});

  // Buscar logs de auditoria
  const { data: auditData } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('security_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      setAuditLogs(data || []);
      return data;
    }
  });

  // Gerar relatório de compliance
  const generateComplianceReport = useMutation({
    mutationFn: async (reportType: string) => {
      const { data, error } = await supabase.functions.invoke('compliance-reporting', {
        body: {
          report_type: reportType,
          timeframe: '30d',
          include_audit_trail: true,
          include_security_scan: true
        }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      const reportLabels = {
        generate_audit: 'Auditoria',
        generate_compliance: 'Compliance',
        generate_security: 'Segurança'
      } as const;
      
      toast.success(`Relatório de ${reportLabels[variables as keyof typeof reportLabels]} gerado com sucesso!`);
    },
    onError: (error) => {
      toast.error(`Erro ao gerar relatório: ${error.message}`);
    },
  });

  // Exportar trilha de auditoria
  const exportAuditTrail = useMutation({
    mutationFn: async (timeframe: string) => {
      const { data, error } = await supabase.functions.invoke('audit-export', {
        body: {
          timeframe,
          format: 'xlsx',
          include_user_details: true,
          include_ip_tracking: true
        }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success('Trilha de auditoria exportada com sucesso!');
      // Trigger download
      if (data.download_url) {
        window.open(data.download_url, '_blank');
      }
    },
    onError: (error) => {
      toast.error(`Erro ao exportar auditoria: ${error.message}`);
    },
  });

  // Executar scan de segurança
  const runSecurityScan = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('security-scanner', {
        body: {
          scan_type: 'comprehensive',
          check_vulnerabilities: true,
          check_permissions: true,
          check_data_integrity: true
        }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setSecurityMetrics(data.metrics || {});
      toast.success(`Scan de segurança concluído! Score: ${data.security_score}/100`);
    },
    onError: (error) => {
      toast.error(`Erro no scan de segurança: ${error.message}`);
    },
  });

  // Realizar backup manual
  const performBackup = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('backup-manager', {
        body: {
          backup_type: 'manual',
          encrypt: true,
          compress: true,
          include_audit_logs: true
        }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setBackupStatus({
        last_backup: new Date().toISOString(),
        status: 'success',
        size: data.backup_size || '0 MB',
        next_scheduled: data.next_scheduled,
        retention_policy: '30 days'
      });
      toast.success('Backup realizado com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro no backup: ${error.message}`);
    },
  });

  // Monitorar atividade em tempo real
  const monitorRealTimeActivity = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('realtime-monitor', {
        body: {
          monitor_type: 'financial_activities',
          alert_thresholds: {
            suspicious_transactions: 1000000, // R$ 1M
            failed_login_attempts: 5,
            data_access_outside_hours: true
          }
        }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data.alerts && data.alerts.length > 0) {
        toast.warning(`${data.alerts.length} alerta(s) de segurança detectado(s)!`);
      }
    },
    onError: (error) => {
      toast.error(`Erro no monitoramento: ${error.message}`);
    },
  });

  // Verificar conformidade LGPD
  const checkLGPDCompliance = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('lgpd-compliance', {
        body: {
          check_data_processing: true,
          check_consent_records: true,
          check_data_retention: true,
          generate_report: true
        }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success(`Verificação LGPD: ${data.compliance_score}% conforme`);
    },
    onError: (error) => {
      toast.error(`Erro na verificação LGPD: ${error.message}`);
    },
  });

  // Configurar políticas de retenção
  const updateRetentionPolicies = useMutation({
    mutationFn: async (policies: any) => {
      const { data, error } = await supabase.functions.invoke('retention-manager', {
        body: {
          policies,
          apply_immediately: true,
          create_backup_before_deletion: true
        }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Políticas de retenção atualizadas!');
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar políticas: ${error.message}`);
    },
  });

  // Gerar certificado de conformidade
  const generateComplianceCertificate = useMutation({
    mutationFn: async (certificateType: string) => {
      const { data, error } = await supabase.functions.invoke('compliance-certificate', {
        body: {
          certificate_type: certificateType,
          include_audit_summary: true,
          include_security_metrics: true,
          digital_signature: true
        }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      toast.success(`Certificado de ${variables} gerado com sucesso!`);
    },
    onError: (error) => {
      toast.error(`Erro ao gerar certificado: ${error.message}`);
    },
  });

  return {
    // Data
    auditLogs,
    complianceReports, 
    accessControls,
    backupStatus,
    securityMetrics,
    
    // Actions
    generateComplianceReport: generateComplianceReport.mutate,
    exportAuditTrail: exportAuditTrail.mutate,
    runSecurityScan: runSecurityScan.mutate,
    performBackup: performBackup.mutate,
    monitorRealTimeActivity: monitorRealTimeActivity.mutate,
    checkLGPDCompliance: checkLGPDCompliance.mutate,
    updateRetentionPolicies: updateRetentionPolicies.mutate,
    generateComplianceCertificate: generateComplianceCertificate.mutate,
    
    // Loading states
    isGeneratingReport: generateComplianceReport.isPending,
    isExportingAudit: exportAuditTrail.isPending,
    isRunningSecurityScan: runSecurityScan.isPending,
    isPerformingBackup: performBackup.isPending,
    isMonitoringActivity: monitorRealTimeActivity.isPending,
    isCheckingLGPD: checkLGPDCompliance.isPending,
    isUpdatingPolicies: updateRetentionPolicies.isPending,
    isGeneratingCertificate: generateComplianceCertificate.isPending,
    
    // Utils
    setAuditLogs,
    setComplianceReports,
    setAccessControls,
    setBackupStatus,
    setSecurityMetrics
  };
};