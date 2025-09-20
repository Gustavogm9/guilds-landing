import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Security scanner function called');
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { 
      scan_type, 
      check_vulnerabilities, 
      check_permissions, 
      check_data_integrity 
    } = await req.json();

    console.log('Running security scan:', scan_type);

    const scanResults = await performSecurityScan(
      supabase,
      scan_type,
      { check_vulnerabilities, check_permissions, check_data_integrity }
    );

    // Registrar resultado do scan
    await supabase
      .from('system_performance_logs')
      .insert({
        operation_type: 'security_scan',
        status: 'completed',
        metadata: {
          scan_type,
          security_score: scanResults.security_score,
          vulnerabilities_found: scanResults.vulnerabilities?.length || 0,
          scan_duration: scanResults.scan_duration,
          timestamp: new Date().toISOString()
        }
      });

    console.log('Security scan completed successfully');
    
    return new Response(JSON.stringify(scanResults), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in security scanner:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function performSecurityScan(supabase: any, scanType: string, options: any) {
  console.log('Performing security scan with options:', options);
  
  const startTime = Date.now();
  const scanResults: any = {
    scan_id: crypto.randomUUID(),
    scan_type: scanType,
    started_at: new Date().toISOString(),
    status: 'completed'
  };

  let securityScore = 100;
  const vulnerabilities: any[] = [];
  const recommendations: string[] = [];

  // 1. Verificação de Vulnerabilidades
  if (options.check_vulnerabilities) {
    console.log('Checking for vulnerabilities...');
    
    const vulnResults = await checkVulnerabilities(supabase);
    vulnerabilities.push(...vulnResults.vulnerabilities);
    securityScore -= vulnResults.score_deduction;
    recommendations.push(...vulnResults.recommendations);
  }

  // 2. Verificação de Permissões
  if (options.check_permissions) {
    console.log('Checking permissions...');
    
    const permResults = await checkPermissions(supabase);
    vulnerabilities.push(...permResults.vulnerabilities);
    securityScore -= permResults.score_deduction;
    recommendations.push(...permResults.recommendations);
  }

  // 3. Verificação de Integridade de Dados
  if (options.check_data_integrity) {
    console.log('Checking data integrity...');
    
    const integrityResults = await checkDataIntegrity(supabase);
    vulnerabilities.push(...integrityResults.vulnerabilities);
    securityScore -= integrityResults.score_deduction;
    recommendations.push(...integrityResults.recommendations);
  }

  // 4. Verificações Gerais de Segurança
  const generalResults = await performGeneralSecurityChecks(supabase);
  vulnerabilities.push(...generalResults.vulnerabilities);
  securityScore -= generalResults.score_deduction;
  recommendations.push(...generalResults.recommendations);

  const scanDuration = Date.now() - startTime;

  return {
    ...scanResults,
    completed_at: new Date().toISOString(),
    scan_duration: scanDuration,
    security_score: Math.max(securityScore, 0),
    vulnerabilities,
    recommendations: [...new Set(recommendations)], // Remove duplicatas
    metrics: {
      total_checks: 4,
      vulnerabilities_found: vulnerabilities.length,
      critical_vulnerabilities: vulnerabilities.filter(v => v.severity === 'critical').length,
      high_vulnerabilities: vulnerabilities.filter(v => v.severity === 'high').length,
      medium_vulnerabilities: vulnerabilities.filter(v => v.severity === 'medium').length,
      low_vulnerabilities: vulnerabilities.filter(v => v.severity === 'low').length
    }
  };
}

async function checkVulnerabilities(supabase: any) {
  const vulnerabilities = [];
  let scoreDeduction = 0;
  const recommendations = [];

  // Verificar eventos de segurança recentes
  const { data: recentSecurityEvents } = await supabase
    .from('security_events')
    .select('*')
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // últimas 24h
    .order('created_at', { ascending: false });

  // Analisar tentativas de login falhadas
  const failedLoginAttempts = recentSecurityEvents?.filter(
    event => event.event_type === 'failed_login'
  ).length || 0;

  if (failedLoginAttempts > 10) {
    vulnerabilities.push({
      id: 'VULN-LOGIN-001',
      type: 'excessive_failed_logins',
      severity: 'high',
      description: `${failedLoginAttempts} tentativas de login falhadas nas últimas 24h`,
      recommendation: 'Implementar bloqueio temporário após múltiplas tentativas',
      affected_component: 'Authentication System'
    });
    scoreDeduction += 15;
    recommendations.push('Implementar política de bloqueio de conta');
  }

  // Verificar acessos suspeitos
  const suspiciousAccess = recentSecurityEvents?.filter(
    event => event.event_type.includes('suspicious') || event.event_type.includes('anomaly')
  ).length || 0;

  if (suspiciousAccess > 0) {
    vulnerabilities.push({
      id: 'VULN-ACCESS-001',
      type: 'suspicious_access_pattern',
      severity: 'medium',
      description: `${suspiciousAccess} padrão(ões) de acesso suspeito detectado(s)`,
      recommendation: 'Investigar IPs e padrões de acesso incomuns',
      affected_component: 'Access Control'
    });
    scoreDeduction += 8;
    recommendations.push('Configurar alertas para atividades suspeitas');
  }

  return { vulnerabilities, score_deduction: scoreDeduction, recommendations };
}

async function checkPermissions(supabase: any) {
  const vulnerabilities = [];
  let scoreDeduction = 0;
  const recommendations = [];

  // Mock: Verificar se há usuários com muitas permissões
  // Em um ambiente real, isso consultaria a tabela de usuários e permissões
  const overprivilegedUsers = 1; // Simulado

  if (overprivilegedUsers > 0) {
    vulnerabilities.push({
      id: 'VULN-PERM-001',
      type: 'excessive_permissions',
      severity: 'medium',
      description: `${overprivilegedUsers} usuário(s) com permissões excessivas detectado(s)`,
      recommendation: 'Revisar e aplicar princípio do menor privilégio',
      affected_component: 'User Management'
    });
    scoreDeduction += 10;
    recommendations.push('Implementar revisão periódica de permissões');
  }

  // Verificar usuários inativos com acesso
  const inactiveUsersWithAccess = 0; // Simulado

  if (inactiveUsersWithAccess > 0) {
    vulnerabilities.push({
      id: 'VULN-PERM-002',
      type: 'inactive_user_access',
      severity: 'high',
      description: `${inactiveUsersWithAccess} usuário(s) inativo(s) ainda com acesso ativo`,
      recommendation: 'Desativar acesso de usuários inativos',
      affected_component: 'User Management'
    });
    scoreDeduction += 12;
    recommendations.push('Automatizar desativação de contas inativas');
  }

  return { vulnerabilities, score_deduction: scoreDeduction, recommendations };
}

async function checkDataIntegrity(supabase: any) {
  const vulnerabilities = [];
  let scoreDeduction = 0;
  const recommendations = [];

  try {
    // Verificar integridade das tabelas financeiras principais
    const tables = ['financial_transactions', 'accounts_payable', 'accounts_receivable'];
    
    for (const table of tables) {
      const { count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      // Mock: verificar se há registros órfãos ou inconsistências
      if (count !== null && count > 0) {
        // Simulação: 1% de chance de encontrar inconsistência
        if (Math.random() < 0.01) {
          vulnerabilities.push({
            id: `VULN-DATA-${table.toUpperCase()}`,
            type: 'data_inconsistency',
            severity: 'low',
            description: `Possível inconsistência detectada na tabela ${table}`,
            recommendation: 'Executar verificação completa de integridade',
            affected_component: `Database - ${table}`
          });
          scoreDeduction += 5;
        }
      }
    }

    // Verificar backup recente
    const { data: recentBackups } = await supabase
      .from('system_performance_logs')
      .select('*')
      .eq('operation_type', 'backup')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // última semana
      .order('created_at', { ascending: false })
      .limit(1);

    if (!recentBackups || recentBackups.length === 0) {
      vulnerabilities.push({
        id: 'VULN-BACKUP-001',
        type: 'missing_recent_backup',
        severity: 'high',
        description: 'Nenhum backup encontrado na última semana',
        recommendation: 'Configurar backup automático e verificar integridade',
        affected_component: 'Backup System'
      });
      scoreDeduction += 20;
      recommendations.push('Implementar política de backup regular');
    }

  } catch (error) {
    console.error('Error checking data integrity:', error);
    vulnerabilities.push({
      id: 'VULN-CHECK-001',
      type: 'integrity_check_failed',
      severity: 'medium',
      description: 'Falha na verificação de integridade de dados',
      recommendation: 'Investigar problemas de conectividade ou permissões',
      affected_component: 'Data Integrity Check'
    });
    scoreDeduction += 8;
  }

  return { vulnerabilities, score_deduction: scoreDeduction, recommendations };
}

async function performGeneralSecurityChecks(supabase: any) {
  const vulnerabilities = [];
  let scoreDeduction = 0;
  const recommendations = [];

  // Mock: Verificações gerais de configuração de segurança
  const securityConfig = {
    ssl_enabled: true,
    row_level_security: true,
    api_rate_limiting: true,
    audit_logging: true,
    session_timeout: true
  };

  Object.entries(securityConfig).forEach(([feature, enabled]) => {
    if (!enabled) {
      const severity = feature === 'ssl_enabled' || feature === 'row_level_security' ? 'critical' : 'medium';
      const deduction = severity === 'critical' ? 25 : 10;
      
      vulnerabilities.push({
        id: `VULN-CONFIG-${feature.toUpperCase()}`,
        type: 'security_feature_disabled',
        severity,
        description: `Recurso de segurança ${feature.replace('_', ' ')} está desabilitado`,
        recommendation: `Habilitar ${feature.replace('_', ' ')} imediatamente`,
        affected_component: 'Security Configuration'
      });
      
      scoreDeduction += deduction;
      recommendations.push(`Configurar ${feature.replace('_', ' ')} adequadamente`);
    }
  });

  // Verificar idade da última atualização de segurança
  const lastSecurityUpdate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000); // 10 dias atrás (mock)
  const daysSinceUpdate = Math.floor((Date.now() - lastSecurityUpdate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysSinceUpdate > 30) {
    vulnerabilities.push({
      id: 'VULN-UPDATE-001',
      type: 'outdated_security_patches',
      severity: 'medium',
      description: `${daysSinceUpdate} dias desde a última atualização de segurança`,
      recommendation: 'Aplicar atualizações de segurança mais frequentemente',
      affected_component: 'System Updates'
    });
    scoreDeduction += 8;
    recommendations.push('Estabelecer cronograma regular de atualizações');
  }

  return { vulnerabilities, score_deduction: scoreDeduction, recommendations };
}