import React from 'react';

interface RadarChartProps {
  values: { processos: number; sistemas: number; dados: number; pessoas: number };
  benchmark?: { processos: number; sistemas: number; dados: number; pessoas: number };
  companyName?: string;
  sectorLabel?: string;
  size?: number;
}

/**
 * Radar chart SVG puro para 4 eixos (Processos, Sistemas, Dados, Pessoas).
 * Scale: 0–5. Inclui zona saudável (3.5–5), grid, benchmark overlay.
 */
export function RadarChart({
  values,
  benchmark,
  companyName = 'Sua empresa',
  sectorLabel = 'Setor',
  size = 340,
}: RadarChartProps) {
  const half = size / 2;
  const maxR = half - 30; // radius for score 5
  const r = (score: number) => (score / 5) * maxR;

  // Axes: top=Processos, right=Sistemas, bottom=Dados, left=Pessoas
  const toPoint = (axis: 'top' | 'right' | 'bottom' | 'left', score: number): [number, number] => {
    const dist = r(score);
    switch (axis) {
      case 'top': return [0, -dist];
      case 'right': return [dist, 0];
      case 'bottom': return [0, dist];
      case 'left': return [-dist, 0];
    }
  };

  const polygon = (scores: { processos: number; sistemas: number; dados: number; pessoas: number }) => {
    const pts = [
      toPoint('top', scores.processos),
      toPoint('right', scores.sistemas),
      toPoint('bottom', scores.dados),
      toPoint('left', scores.pessoas),
    ];
    return pts.map(([x, y]) => `${x},${y}`).join(' ');
  };

  const gridLevels = [1, 2, 3, 4, 5];
  const healthZone = { processos: 3.5, sistemas: 3.5, dados: 3.5, pessoas: 3.5 };

  return (
    <div className="radar-chart-wrapper">
      <svg
        width={size}
        height={size}
        viewBox={`${-half} ${-half} ${size} ${size}`}
        style={{ overflow: 'visible' }}
      >
        {/* Healthy zone (3.5-5) */}
        <polygon
          points={polygon(healthZone)}
          fill="rgba(34,197,94,0.06)"
          stroke="rgba(34,197,94,0.15)"
          strokeWidth="1"
          strokeDasharray="2 3"
        />

        {/* Grid rings */}
        {gridLevels.map(level => (
          <polygon
            key={level}
            points={polygon({ processos: level, sistemas: level, dados: level, pessoas: level })}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        ))}

        {/* Axis lines */}
        <line x1="0" y1={-maxR} x2="0" y2={maxR} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <line x1={-maxR} y1="0" x2={maxR} y2="0" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

        {/* Scale labels */}
        {[1, 2, 3, 4].map(n => (
          <text key={n} x="3" y={-r(n)} fill="#475569" fontSize="9" fontFamily="Inter">{n}</text>
        ))}

        {/* Benchmark polygon (dashed, subtle) */}
        {benchmark && (
          <polygon
            points={polygon(benchmark)}
            fill="rgba(148,163,184,0.04)"
            stroke="rgba(148,163,184,0.4)"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
        )}

        {/* Company polygon */}
        <polygon
          points={polygon(values)}
          fill="rgba(59,130,246,0.15)"
          stroke="rgba(96,165,250,0.8)"
          strokeWidth="2"
        />

        {/* Dots on company polygon */}
        {(['top', 'right', 'bottom', 'left'] as const).map((axis, i) => {
          const score = [values.processos, values.sistemas, values.dados, values.pessoas][i];
          const [x, y] = toPoint(axis, score);
          return (
            <circle key={axis} cx={x} cy={y} r="4" fill="#3B82F6" stroke="#1E3A5F" strokeWidth="2" />
          );
        })}

        {/* Axis labels */}
        <text x="0" y={-maxR - 12} textAnchor="middle" fill="#CBD5E1" fontSize="12" fontWeight="600" fontFamily="Inter">
          Processos
        </text>
        <text x={maxR + 12} y="5" textAnchor="start" fill="#CBD5E1" fontSize="12" fontWeight="600" fontFamily="Inter">
          Sistemas
        </text>
        <text x="0" y={maxR + 18} textAnchor="middle" fill="#CBD5E1" fontSize="12" fontWeight="600" fontFamily="Inter">
          Dados
        </text>
        <text x={-maxR - 12} y="5" textAnchor="end" fill="#CBD5E1" fontSize="12" fontWeight="600" fontFamily="Inter">
          Pessoas
        </text>

        {/* Healthy zone label */}
        <text x={-maxR + 5} y={-maxR - 5} fill="#4ADE80" fontSize="9" fontFamily="Inter" fontWeight="700" opacity="0.7">
          ◌ zona saudável (3.5–5)
        </text>
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', fontSize: '12px', marginTop: '8px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(59,130,246,0.6)', border: '1px solid #60A5FA' }} />
          <span style={{ color: '#E2E8F0' }}>{companyName}</span>
        </span>
        {benchmark && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, border: '1px dashed #64748B' }} />
            {sectorLabel}
          </span>
        )}
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4ADE80' }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }} />
          Saudável
        </span>
      </div>
    </div>
  );
}
