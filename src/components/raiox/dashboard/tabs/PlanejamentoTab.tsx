import React, { useState } from 'react';
import type { DashboardData } from '../mockData';
import { Flag, ListTodo, BarChart3, Clock, PlayCircle, ShieldCheck } from 'lucide-react';

interface PlanejamentoTabProps {
  data: DashboardData;
}

export function PlanejamentoTab({ data }: PlanejamentoTabProps) {
  const { narratives } = data;
  const { plano, kpis } = narratives;
  const [subTab, setSubTab] = useState<'smart' | 'action' | 'kpis'>('smart');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* Sub-navegação interna */}
      <div style={{ display: 'flex', gap: 12, borderBottom: '1px solid #1E293B', paddingBottom: 16 }}>
        <button
          onClick={() => setSubTab('smart')}
          style={{
            background: subTab === 'smart' ? 'rgba(59,130,246,0.1)' : 'transparent',
            color: subTab === 'smart' ? '#60A5FA' : '#94A3B8',
            border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s'
          }}
        >
          <Flag size={16} /> Objetivos SMART
        </button>
        <button
          onClick={() => setSubTab('action')}
          style={{
            background: subTab === 'action' ? 'rgba(59,130,246,0.1)' : 'transparent',
            color: subTab === 'action' ? '#60A5FA' : '#94A3B8',
            border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s'
          }}
        >
          <ListTodo size={16} /> Plano de Ação (90 dias)
        </button>
        <button
          onClick={() => setSubTab('kpis')}
          style={{
            background: subTab === 'kpis' ? 'rgba(59,130,246,0.1)' : 'transparent',
            color: subTab === 'kpis' ? '#60A5FA' : '#94A3B8',
            border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s'
          }}
        >
          <BarChart3 size={16} /> KPIs Sugeridos
        </button>
      </div>

      {/* Conteúdo Dinâmico */}
      <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: 12, padding: 24 }}>
        
        {subTab === 'smart' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#F8FAFC' }}>Objetivos Claros</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
              {plano.smartGoals.map((goal, i) => (
                <div key={i} style={{ background: '#1E293B', borderLeft: goal.isPrimary ? '4px solid #3B82F6' : '4px solid #334155', borderRadius: 8, padding: 20 }}>
                  {goal.isPrimary && (
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#3B82F6', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.05em' }}>Objetivo Principal</div>
                  )}
                  <h4 style={{ fontSize: 16, fontWeight: 600, color: '#F1F5F9', marginBottom: 16 }}>{goal.title}</h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                    <div style={{ background: 'rgba(15,23,42,0.5)', padding: 12, borderRadius: 6 }}>
                      <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, marginBottom: 4 }}>S (Specific)</div>
                      <div style={{ fontSize: 13, color: '#E2E8F0' }}>{goal.smart.specific}</div>
                    </div>
                    <div style={{ background: 'rgba(15,23,42,0.5)', padding: 12, borderRadius: 6 }}>
                      <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, marginBottom: 4 }}>M (Measurable)</div>
                      <div style={{ fontSize: 13, color: '#E2E8F0' }}>{goal.smart.measurable}</div>
                    </div>
                    <div style={{ background: 'rgba(15,23,42,0.5)', padding: 12, borderRadius: 6 }}>
                      <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, marginBottom: 4 }}>A (Achievable)</div>
                      <div style={{ fontSize: 13, color: '#E2E8F0' }}>{goal.smart.achievable}</div>
                    </div>
                    <div style={{ background: 'rgba(15,23,42,0.5)', padding: 12, borderRadius: 6 }}>
                      <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, marginBottom: 4 }}>R (Relevant)</div>
                      <div style={{ fontSize: 13, color: '#E2E8F0' }}>{goal.smart.relevant}</div>
                    </div>
                    <div style={{ background: 'rgba(15,23,42,0.5)', padding: 12, borderRadius: 6 }}>
                      <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, marginBottom: 4 }}>T (Temporal)</div>
                      <div style={{ fontSize: 13, color: '#E2E8F0' }}>{goal.smart.temporal}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {subTab === 'action' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#F8FAFC' }}>O que fazer agora</h3>
              <div style={{ background: 'rgba(34,197,94,0.1)', color: '#4ADE80', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                <ShieldCheck size={14} /> Solução G-FORGE inclusa onde aplicável
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
              {plano.actions.map((action) => (
                <div key={action.id} style={{ background: '#1E293B', border: action.isGuilds ? '1px solid rgba(59,130,246,0.3)' : '1px solid #334155', borderRadius: 8, padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#0F172A', color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                        {action.id}
                      </span>
                      <h4 style={{ fontSize: 15, fontWeight: 600, color: '#F1F5F9' }}>{action.title}</h4>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: action.priority === 'Alta' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)', color: action.priority === 'Alta' ? '#EF4444' : '#F59E0B' }}>
                        {action.priority}
                      </span>
                      {action.isGuilds && (
                        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: 'rgba(59,130,246,0.1)', color: '#60A5FA', border: '1px solid rgba(59,130,246,0.2)' }}>
                          Guilds
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p style={{ color: '#94A3B8', fontSize: 13, marginBottom: 16, paddingLeft: 36 }}>{action.why}</p>

                  <div style={{ display: 'flex', gap: 24, paddingLeft: 36, marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748B', fontSize: 12 }}><Clock size={14} /> Prazo: {action.timeline}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748B', fontSize: 12 }}>Seu tempo: {action.yourTime}</div>
                  </div>

                  <div style={{ paddingLeft: 36 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#E2E8F0', marginBottom: 8 }}>Checklist de Execução:</div>
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {action.checklist.map((item, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, color: '#94A3B8', fontSize: 13 }}>
                          <span style={{ color: '#4ADE80', marginTop: 2 }}><PlayCircle size={14} /></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {subTab === 'kpis' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#F8FAFC' }}>Indicadores Prioritários</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
              {kpis.map((kpi, i) => (
                <div key={i} style={{ background: '#1E293B', borderRadius: 8, padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
                    <div>
                      <div style={{ color: '#94A3B8', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{kpi.priority === 'Alta' ? '🔴 Prioridade Alta' : '🟡 Prioridade Média'}</div>
                      <div style={{ color: '#F1F5F9', fontSize: 15, fontWeight: 600 }}>{kpi.label}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#64748B', fontSize: 11, marginBottom: 4 }}>Alvo Recomendado</div>
                      <div style={{ color: '#4ADE80', fontSize: 18, fontWeight: 700 }}>{kpi.target}</div>
                    </div>
                  </div>
                  
                  {/* Progress bar visual representation */}
                  <div style={{ width: '100%', height: 6, background: '#0F172A', borderRadius: 3, overflow: 'hidden', marginTop: 12 }}>
                    <div style={{ width: `${kpi.barPercent}%`, height: '100%', background: kpi.priority === 'Alta' ? '#EF4444' : '#3B82F6', borderRadius: 3 }}></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: '#64748B' }}>
                    <span>Atual: {kpi.current}</span>
                    <span>Alvo: {kpi.target}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
