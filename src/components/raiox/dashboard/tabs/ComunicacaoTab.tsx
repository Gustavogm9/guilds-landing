import React from 'react';
import type { DashboardData } from '../mockData';
import { MessageSquare, Globe, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ComunicacaoTabProps {
  data: DashboardData;
}

export function ComunicacaoTab({ data }: ComunicacaoTabProps) {
  const { narratives } = data;
  const { comunicacao } = narratives;

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRÍTICO': return <AlertCircle size={16} color="#EF4444" />;
      case 'ALTO': return <AlertCircle size={16} color="#F59E0B" />;
      case 'MÉDIO': return <AlertCircle size={16} color="#3B82F6" />;
      case 'BOM': return <CheckCircle2 size={16} color="#22C55E" />;
      default: return null;
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>
      
      {/* Coluna Esquerda: Auditoria e Score */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        {/* Cabeçalho */}
        <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: 12, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#F8FAFC', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <MessageSquare size={24} color="#8B5CF6" />
                {comunicacao.headline}
              </h3>
              <p style={{ color: '#94A3B8', fontSize: 15, lineHeight: 1.6, maxWidth: 600 }}>
                {comunicacao.body}
              </p>
            </div>
            
            <div style={{ textAlign: 'right', background: '#1E293B', padding: '12px 20px', borderRadius: 8, border: '1px solid #334155' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 }}>Score de Clareza</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#F1F5F9', lineHeight: 1 }}>
                {comunicacao.score.toFixed(1)}<span style={{ fontSize: 16, color: '#64748B' }}>/5</span>
              </div>
              <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>Média do setor: {comunicacao.sectorAvg.toFixed(1)}</div>
            </div>
          </div>
        </div>

        {/* Avaliação por Canal/Eixo */}
        <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: 12, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#E2E8F0', marginBottom: 16 }}>Análise de Touchpoints</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {comunicacao.channels.map((ch, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: 16, background: '#1E293B', borderRadius: 8 }}>
                <div style={{ marginTop: 2 }}>
                  {getSeverityIcon(ch.severity)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ color: '#F1F5F9', fontWeight: 600, fontSize: 14 }}>{ch.label}</div>
                    <div style={{ color: '#64748B', fontSize: 12, fontWeight: 600 }}>{ch.score.toFixed(1)} / 5</div>
                  </div>
                  <div style={{ color: '#94A3B8', fontSize: 13, lineHeight: 1.5 }}>{ch.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Coluna Direita: Auditoria do Site */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        {/* Site Audit Card */}
        <div style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(15,23,42,0) 100%)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 12, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#8B5CF6', marginBottom: 16 }}>
            <Globe size={20} />
            <h3 style={{ fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Auditoria de URL</h3>
          </div>
          
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: '#64748B', marginBottom: 4 }}>URL analisada</div>
            <a href={`https://${comunicacao.siteAudit.url}`} target="_blank" rel="noreferrer" style={{ color: '#A78BFA', fontSize: 14, fontWeight: 500, textDecoration: 'underline' }}>
              {comunicacao.siteAudit.url}
            </a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {comunicacao.siteAudit.annotations.map((ann) => (
              <div key={ann.id} style={{ position: 'relative', paddingLeft: 20 }}>
                <div style={{ position: 'absolute', left: 0, top: 2, width: 12, height: 12, borderRadius: '50%', background: 'rgba(139,92,246,0.2)', border: '2px solid #8B5CF6' }}></div>
                <div style={{ color: '#E2E8F0', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{ann.title}</div>
                <div style={{ color: '#94A3B8', fontSize: 12, lineHeight: 1.4 }}>{ann.detail}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
