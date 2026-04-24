import React from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { DashboardShell } from './DashboardShell';
import { Loader2 } from 'lucide-react';

export function DashboardContainer() {
  const { data, loading, error, diagnostic } = useDashboardData();

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-400 text-sm">Carregando seu dashboard...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 24px' }}>
        <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 9v4M12 17h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Erro ao carregar Dashboard</h2>
        <p className="text-slate-400 text-sm">{error || 'Dados não encontrados.'}</p>
      </div>
    );
  }

  // DashboardShell já inclui seu próprio layout full-screen (header customizado, timeline, etc.)
  // Então o DashboardContainer apenas monta ele com os dados.
  return <DashboardShell data={data} diagnosticId={diagnostic?.id} />;
}
