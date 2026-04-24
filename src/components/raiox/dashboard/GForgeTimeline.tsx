import React from 'react';
import { GFORGE_PHASES } from '@/utils/raiox-scoring';

interface GForgeTimelineProps {
  currentPhaseIndex: number;
  score: number;
}

export function GForgeTimeline({ currentPhaseIndex, score }: GForgeTimelineProps) {
  const phases = GFORGE_PHASES;
  const labels = ['F', 'O', 'R', 'G', 'E', 'X', '+'];

  return (
    <section style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(180deg, rgba(15,23,42,0.8), rgba(15,23,42,0.4))' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 24px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <div>
            <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: phases[currentPhaseIndex].color, background: `${phases[currentPhaseIndex].color}15`, border: `1px solid ${phases[currentPhaseIndex].color}30`, padding: '3px 10px', borderRadius: 999 }}>
              Fase {phases[currentPhaseIndex].name} · Score {score}/100
            </span>
            <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 22, fontWeight: 800, marginTop: 10, color: '#F1F5F9' }}>
              Jornada G-FORGE™
            </h2>
            <p style={{ color: '#94A3B8', fontSize: 13, marginTop: 4 }}>
              {phases[currentPhaseIndex].description}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          {phases.map((phase, i) => {
            const isActive = i === currentPhaseIndex;
            const isPast = i < currentPhaseIndex;
            const isFuture = i > currentPhaseIndex;

            return (
              <div key={phase.name} style={{ textAlign: 'center', opacity: isFuture ? 0.4 : 1, flex: 1 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, margin: '0 auto',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, fontSize: 16, fontFamily: 'Inter, sans-serif',
                  color: phase.color,
                  background: isPast ? `${phase.color}15` : isActive ? `${phase.color}25` : `${phase.color}08`,
                  border: isActive ? `2px solid ${phase.color}60` : 'none',
                  transition: 'all 0.3s',
                }}>
                  {labels[i]}
                </div>
                <div style={{ fontSize: 10, fontWeight: isActive ? 700 : 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: 8, color: isActive ? phase.color : isPast ? phase.color : '#64748B' }}>
                  {phase.name === 'Pré-FOUNDRY' ? 'PRÉ' : phase.name}
                </div>
                {isActive && (
                  <div style={{ fontSize: 10, color: `${phase.color}CC`, marginTop: 2 }}>
                    você está aqui
                  </div>
                )}
                {!isActive && !isFuture && (
                  <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>
                    concluída
                  </div>
                )}
                {i === currentPhaseIndex + 1 && (
                  <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>
                    próxima
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
