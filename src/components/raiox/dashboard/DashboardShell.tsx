import React, { useState } from 'react';
import type { DashboardData } from './mockData';
import { GForgeTimeline } from './GForgeTimeline';
import { MaturidadeTab } from './tabs/MaturidadeTab';
import { MercadoTab } from './tabs/MercadoTab';
import { ComunicacaoTab } from './tabs/ComunicacaoTab';
import { EmpresaTab } from './tabs/EmpresaTab';
import { PlanejamentoTab } from './tabs/PlanejamentoTab';
import { ShieldCheck, Calendar, Download, Share2, Loader2 } from 'lucide-react';
import { supabaseRaiox } from '@/lib/supabase-raiox';

interface DashboardShellProps {
  data: DashboardData;
  diagnosticId?: string;
}

export function DashboardShell({ data, diagnosticId }: DashboardShellProps) {
  const [activeTab, setActiveTab] = useState<'maturidade' | 'planejamento' | 'mercado' | 'comunicacao' | 'empresa'>('maturidade');
  const [sharing, setSharing] = useState(false);
  const [shareLink, setShareLink] = useState('');

  const handleShare = async () => {
    if (!diagnosticId) return;
    
    setSharing(true);
    try {
      const { data, error } = await supabaseRaiox.functions.invoke('raiox-share-link', {
        body: { diagnosticId }
      });
      
      if (error) throw error;
      if (data?.token) {
        const link = `${window.location.origin}/raio-x/share/${data.token}`;
        setShareLink(link);
        await navigator.clipboard.writeText(link);
        alert('Link copiado para a área de transferência! ' + link);
      }
    } catch (err) {
      console.error('Erro ao gerar link:', err);
      alert('Erro ao gerar link de compartilhamento.');
    } finally {
      setSharing(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: '#F8FAFC', paddingBottom: 64 }}>
      
      {/* Header Fixo */}
      <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Raio-X G-FORGE™</h1>
            <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{data.companyName}</div>
          </div>
          <div className="print:hidden" style={{ display: 'flex', gap: 12 }}>
            <button 
              onClick={handleShare}
              disabled={sharing || !diagnosticId}
              style={{ background: 'transparent', border: '1px solid #334155', color: '#E2E8F0', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', opacity: (sharing || !diagnosticId) ? 0.5 : 1 }}
            >
              {sharing ? <Loader2 size={16} className="animate-spin" /> : <Share2 size={16} />} 
              {sharing ? 'Gerando...' : 'Compartilhar'}
            </button>
            <button 
              onClick={() => window.print()}
              style={{ background: '#3B82F6', border: '1px solid #60A5FA', color: '#FFF', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', boxShadow: '0 4px 12px rgba(59,130,246,0.2)' }}
            >
              <Download size={16} /> Baixar PDF
            </button>
          </div>
        </div>
      </header>

      {/* Timeline G-FORGE */}
      <GForgeTimeline currentPhaseIndex={data.phase.index} score={data.scores.overall} />

      {/* Main Content Area */}
      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: '260px 1fr', gap: 40 }}>
        
        {/* Sidebar Nav & Info */}
        <aside className="print:hidden" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          
          {/* Navegação principal */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, paddingLeft: 12 }}>Diagnóstico</div>
            {[
              { id: 'maturidade', label: 'Raio-X Maturidade' },
              { id: 'planejamento', label: 'Plano de Ação' },
              { id: 'mercado', label: 'Mercado e Concorrentes' },
              { id: 'comunicacao', label: 'Auditoria de Marca' },
              { id: 'empresa', label: 'Sobre a Empresa' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  textAlign: 'left',
                  background: activeTab === tab.id ? 'rgba(59,130,246,0.1)' : 'transparent',
                  color: activeTab === tab.id ? '#60A5FA' : '#94A3B8',
                  border: '1px solid',
                  borderColor: activeTab === tab.id ? 'rgba(59,130,246,0.2)' : 'transparent',
                  padding: '10px 16px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: activeTab === tab.id ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Fit Score Widget */}
          <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <ShieldCheck size={18} color="#4ADE80" />
              <h3 style={{ fontSize: 13, fontWeight: 600, color: '#E2E8F0', margin: 0 }}>Guilds Fit Score</h3>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 16 }}>
              <span style={{ fontSize: 32, fontWeight: 800, color: '#F8FAFC', lineHeight: 1 }}>{data.fitScore.total}</span>
              <span style={{ fontSize: 14, color: '#64748B' }}>/100</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {data.fitScore.signals.slice(0, 3).map((sig, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                    <span style={{ color: '#94A3B8' }}>{sig.label}</span>
                    <span style={{ color: '#E2E8F0', fontWeight: 600 }}>{sig.score}/{sig.max}</span>
                  </div>
                  <div style={{ width: '100%', height: 4, background: '#1E293B', borderRadius: 2 }}>
                    <div style={{ width: `${(sig.score/sig.max)*100}%`, height: '100%', background: '#4ADE80', borderRadius: 2 }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Next Step */}
          <div className="print:hidden" style={{ background: 'linear-gradient(180deg, rgba(30,58,138,0.2) 0%, rgba(15,23,42,0.8) 100%)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 12, padding: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#F1F5F9', marginBottom: 8 }}>Acelere a Fase {data.phase.name}</h3>
            <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.5, marginBottom: 16 }}>
              Agende uma sessão gratuita para traduzir este plano de ação para a sua realidade.
            </p>
            <button 
              onClick={() => {
                const calendlyUrl = `https://calendly.com/gui-guilds/30min?name=${encodeURIComponent(data.companyName)}&a1=${data.fitScore.total}&a2=${diagnosticId || 'unknown'}`;
                window.open(calendlyUrl, '_blank');
              }}
              style={{ width: '100%', background: '#F8FAFC', color: '#0F172A', border: 'none', padding: '10px', borderRadius: 8, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}
            >
              <Calendar size={16} /> Agendar Sessão
            </button>
          </div>

        </aside>

        {/* Tab Content */}
        <section>
          {activeTab === 'maturidade' && <MaturidadeTab data={data} />}
          {activeTab === 'planejamento' && <PlanejamentoTab data={data} />}
          {activeTab === 'mercado' && <MercadoTab data={data} />}
          {activeTab === 'comunicacao' && <ComunicacaoTab data={data} />}
          {activeTab === 'empresa' && <EmpresaTab data={data} />}
        </section>

      </main>

    </div>
  );
}
