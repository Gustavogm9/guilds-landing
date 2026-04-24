import React from 'react';
import type { DashboardData } from '../mockData';
import { Building2, Info } from 'lucide-react';

interface EmpresaTabProps {
  data: DashboardData;
}

export function EmpresaTab({ data }: EmpresaTabProps) {
  const { narratives } = data;
  const { empresa } = narratives;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>
      
      {/* Coluna Esquerda: Síntese */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: 12, padding: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={24} color="#3B82F6" />
            </div>
            <div>
              <h3 style={{ fontSize: 24, fontWeight: 700, color: '#F8FAFC', marginBottom: 4 }}>
                {empresa.name}
              </h3>
              <p style={{ color: '#94A3B8', fontSize: 14 }}>
                {empresa.subtitle}
              </p>
            </div>
          </div>

          <div style={{ background: 'rgba(15,23,42,0.5)', border: '1px solid #1E293B', borderRadius: 8, padding: 24, marginBottom: 32 }}>
            <h4 style={{ fontSize: 12, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Info size={14} /> Síntese Executiva
            </h4>
            <p style={{ color: '#E2E8F0', fontSize: 15, lineHeight: 1.7 }}>
              {empresa.synopsis}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {empresa.stats.map((stat, i) => (
              <div key={i} style={{ padding: '12px 16px', background: '#1E293B', borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: '#64748B', textTransform: 'uppercase', marginBottom: 4, fontWeight: 600 }}>{stat.label}</div>
                <div style={{ fontSize: 14, color: '#F1F5F9', fontWeight: 500 }}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Coluna Direita */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
         {/* Espaço para futuras expansões, como score histórico ou dados de integração */}
         <div style={{ background: '#0F172A', border: '1px dashed #334155', borderRadius: 12, padding: 24, textAlign: 'center' }}>
           <Building2 size={24} color="#475569" style={{ margin: '0 auto 12px' }} />
           <div style={{ color: '#94A3B8', fontSize: 13, marginBottom: 8 }}>Vincular dados de CRM / ERP</div>
           <div style={{ fontSize: 11, color: '#64748B', padding: '4px 8px', background: '#1E293B', borderRadius: 4, display: 'inline-block' }}>Disponível no Plano Completo</div>
         </div>
      </div>
    </div>
  );
}
