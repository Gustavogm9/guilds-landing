import React from 'react';
import type { DashboardData } from '../mockData';
import { Target, TrendingUp, AlertTriangle, Crosshair, Users } from 'lucide-react';

interface MercadoTabProps {
  data: DashboardData;
}

export function MercadoTab({ data }: MercadoTabProps) {
  const { narratives } = data;
  const { mercado } = narratives;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Ameaça direta': return { bg: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'rgba(239,68,68,0.2)' };
      case 'Flanco lateral': return { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: 'rgba(245,158,11,0.2)' };
      case 'Indireto': return { bg: 'rgba(148,163,184,0.1)', color: '#94A3B8', border: 'rgba(148,163,184,0.2)' };
      case 'Pares': return { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6', border: 'rgba(59,130,246,0.2)' };
      default: return { bg: 'rgba(148,163,184,0.1)', color: '#94A3B8', border: 'rgba(148,163,184,0.2)' };
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>
      
      {/* Coluna Esquerda: Análise e Oportunidades */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        {/* Cabeçalho de Mercado */}
        <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: 12, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', background: '#1E293B', padding: '4px 8px', borderRadius: 4 }}>
              {mercado.sectorChip}
            </span>
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: '#F8FAFC', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Target size={24} color="#3B82F6" />
            {mercado.headline}
          </h3>
          <p style={{ color: '#E2E8F0', fontSize: 15, lineHeight: 1.6, marginBottom: 24, padding: 16, background: 'rgba(59,130,246,0.05)', borderRadius: 8, borderLeft: '3px solid #3B82F6' }}>
            {mercado.positioning}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Oportunidades */}
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 600, color: '#4ADE80', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <TrendingUp size={16} /> Oportunidades
              </h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: 0, padding: 0, listStyle: 'none' }}>
                {mercado.opportunities.map((opp, i) => (
                  <li key={i} style={{ color: '#94A3B8', fontSize: 13, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <span style={{ color: '#4ADE80', marginTop: 2 }}>+</span> {opp}
                  </li>
                ))}
              </ul>
            </div>

            {/* Ameaças */}
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 600, color: '#F87171', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertTriangle size={16} /> Ameaças
              </h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: 0, padding: 0, listStyle: 'none' }}>
                {mercado.threats.map((threat, i) => (
                  <li key={i} style={{ color: '#94A3B8', fontSize: 13, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <span style={{ color: '#F87171', marginTop: 2 }}>-</span> {threat}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Mapeamento de Concorrentes */}
        <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: 12, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#E2E8F0', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={20} color="#94A3B8" />
            Tipologia de Concorrentes
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {mercado.competitors.map((comp, i) => {
              const colors = getTypeColor(comp.type);
              return (
                <div key={i} style={{ background: '#1E293B', border: `1px solid ${colors.border}`, borderRadius: 8, padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <h4 style={{ color: '#F1F5F9', fontSize: 14, fontWeight: 600 }}>{comp.name}</h4>
                    <span style={{ fontSize: 10, fontWeight: 600, background: colors.bg, color: colors.color, padding: '2px 6px', borderRadius: 4 }}>
                      {comp.type}
                    </span>
                  </div>
                  <p style={{ color: '#94A3B8', fontSize: 12, lineHeight: 1.5 }}>
                    {comp.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Coluna Direita: Fontes e Inação */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        {/* Custo da Inação */}
        <div style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(15,23,42,0) 100%)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#F59E0B', marginBottom: 16 }}>
            <Crosshair size={20} />
            <h3 style={{ fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Custo da Inação</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {data.inaction.slice(2, 4).map((item, idx) => (
              <div key={idx}>
                <div style={{ color: '#E2E8F0', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{item.label}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ color: '#94A3B8', fontSize: 14, textDecoration: 'line-through' }}>{item.oldValue}</span>
                  <span style={{ color: '#64748B', fontSize: 12 }}>→</span>
                  <span style={{ color: '#F59E0B', fontSize: 16, fontWeight: 700 }}>{item.newValue}</span>
                </div>
                <div style={{ color: '#64748B', fontSize: 12, lineHeight: 1.4 }}>{item.detail}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Fontes de Dados */}
        <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: 12, padding: 20 }}>
          <h4 style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8', marginBottom: 12, textTransform: 'uppercase' }}>Fontes desta análise</h4>
          <ul style={{ margin: 0, paddingLeft: 16, color: '#64748B', fontSize: 12, lineHeight: 1.6 }}>
            {mercado.sources.map((source, i) => (
              <li key={i}>{source}</li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
