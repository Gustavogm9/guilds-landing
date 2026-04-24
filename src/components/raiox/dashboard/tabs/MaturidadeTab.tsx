import React from 'react';
import type { DashboardData } from '../mockData';
import { RadarChart } from '../RadarChart';
import { AlertCircle, ArrowRight, Banknote, ShieldAlert, Zap } from 'lucide-react';

interface MaturidadeTabProps {
  data: DashboardData;
}

export function MaturidadeTab({ data }: MaturidadeTabProps) {
  const { scores, benchmark, loss, narratives } = data;
  const { maturidade } = narratives;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>
      
      {/* Coluna Esquerda: Radar e Narrativa */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        {/* Card Radar */}
        <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: 12, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#E2E8F0', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 4, height: 16, background: '#3B82F6', borderRadius: 2 }}></div>
            Maturidade Digital vs Setor
          </h3>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <RadarChart 
              values={scores.subScores} 
              benchmark={benchmark} 
              sectorLabel={benchmark.label}
              companyName={data.companyName}
            />
          </div>
        </div>

        {/* Narrativa do Claude */}
        <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: 12, padding: 24 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: '#F8FAFC', marginBottom: 12 }}>
            {maturidade.headline}
          </h3>
          <p style={{ color: '#94A3B8', fontSize: 15, lineHeight: 1.6, marginBottom: 20 }}>
            {maturidade.body}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)', padding: 16, borderRadius: 8 }}>
              <div style={{ fontSize: 12, color: '#EF4444', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>Principal Gargalo</div>
              <div style={{ color: '#F1F5F9', fontWeight: 500, fontSize: 14 }}>{maturidade.majorGap.label}</div>
              <div style={{ color: '#94A3B8', fontSize: 13, marginTop: 4 }}>{maturidade.majorGap.detail}</div>
            </div>
            <div style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.1)', padding: 16, borderRadius: 8 }}>
              <div style={{ fontSize: 12, color: '#22C55E', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>Ponto Forte</div>
              <div style={{ color: '#F1F5F9', fontWeight: 500, fontSize: 14 }}>{maturidade.strength.label}</div>
              <div style={{ color: '#94A3B8', fontSize: 13, marginTop: 4 }}>{maturidade.strength.detail}</div>
            </div>
          </div>
        </div>

      </div>

      {/* Coluna Direita: Perda Financeira e Gaps Priorizados */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        {/* Card de Perda */}
        <div style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(15,23,42,0) 100%)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#EF4444', marginBottom: 12 }}>
            <Banknote size={20} />
            <h3 style={{ fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Perda Financeira Anual</h3>
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#F8FAFC', marginBottom: 4, fontFamily: 'monospace' }}>
            R$ {loss.total.toLocaleString('pt-BR')}
          </div>
          <p style={{ color: '#94A3B8', fontSize: 13, marginBottom: 20 }}>
            Estimativa de perda por ineficiência, baseada no porte da sua operação.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {loss.breakdown.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 12, borderBottom: idx < loss.breakdown.length - 1 ? '1px solid #1E293B' : 'none' }}>
                <div>
                  <div style={{ color: '#E2E8F0', fontSize: 14, fontWeight: 500 }}>{item.label}</div>
                  <div style={{ color: '#64748B', fontSize: 12, marginTop: 2 }}>{item.formula}</div>
                </div>
                <div style={{ color: '#EF4444', fontWeight: 600, fontSize: 14 }}>
                  R$ {item.value.toLocaleString('pt-BR')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gaps Priorizados */}
        <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: 12, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#E2E8F0', marginBottom: 16 }}>Gaps Priorizados</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {maturidade.gaps.map((gap) => (
              <div key={gap.priority} style={{ background: '#1E293B', borderRadius: 8, padding: 16, borderLeft: gap.severity === 'CRÍTICO' ? '3px solid #EF4444' : '3px solid #F59E0B' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: gap.severity === 'CRÍTICO' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)', color: gap.severity === 'CRÍTICO' ? '#EF4444' : '#F59E0B' }}>
                    {gap.severity}
                  </span>
                  <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>Prioridade {gap.priority}</span>
                </div>
                <h4 style={{ color: '#F1F5F9', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{gap.title}</h4>
                <p style={{ color: '#94A3B8', fontSize: 13, lineHeight: 1.5, marginBottom: 12 }}>{gap.description}</p>
                
                <div style={{ background: '#0F172A', borderRadius: 6, padding: '8px 12px', fontSize: 12, color: '#60A5FA', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <ArrowRight size={14} style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <span style={{ fontWeight: 600 }}>Ação recomendada:</span> {gap.action}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
