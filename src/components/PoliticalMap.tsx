import type { CSSProperties } from 'react';

// Plano em unidades do viewBox: centro em (160,160), valor 1 = 130 unidades.
const C = 160;
const R = 130;
const CENTER_BOX = 0.15 * R; // faixa considerada "centro"

type Props = {
  // Sem ponto = mapa de abertura, com um "?" no meio
  point?: { x: number; y: number };
  className?: string;
};

export function PoliticalMap({ point, className = '' }: Props) {
  const grid = [-0.8, -0.6, -0.4, -0.2, 0.2, 0.4, 0.6, 0.8];
  // y positivo = conservador = para cima, então inverte no SVG
  const dx = point ? point.x * R : 0;
  const dy = point ? -point.y * R : 0;

  return (
    <svg
      viewBox="0 0 320 320"
      role="img"
      aria-label={
        point
          ? `Mapa político com a sua posição: economia ${point.x.toFixed(2)}, costumes ${point.y.toFixed(2)}`
          : 'Mapa político: esquerda e direita no eixo horizontal, progressista e conservador no vertical'
      }
      className={`block w-full h-auto ${className}`}
    >
      {/* Grade */}
      {grid.map((g) => (
        <g key={g} stroke="var(--line)" strokeWidth="1">
          <line x1={C + g * R} y1={C - R} x2={C + g * R} y2={C + R} />
          <line x1={C - R} y1={C + g * R} x2={C + R} y2={C + g * R} />
        </g>
      ))}
      <rect x={C - R} y={C - R} width={2 * R} height={2 * R} fill="none" stroke="var(--line-strong)" />

      {/* Eixos */}
      <line x1={C - R} y1={C} x2={C + R} y2={C} stroke="var(--dim)" strokeWidth="1.5" />
      <line x1={C} y1={C - R} x2={C} y2={C + R} stroke="var(--dim)" strokeWidth="1.5" />

      {/* Zona de centro */}
      <rect
        x={C - CENTER_BOX}
        y={C - CENTER_BOX}
        width={2 * CENTER_BOX}
        height={2 * CENTER_BOX}
        fill="none"
        stroke="var(--dim)"
        strokeDasharray="3 4"
      />

      {/* Rótulos dos eixos */}
      <g fontFamily="var(--font-space-mono)" fontSize="8.5" letterSpacing="1.2" fill="var(--muted)">
        <text x={C} y={C - R - 8} textAnchor="middle">CONSERVADOR</text>
        <text x={C} y={C + R + 15} textAnchor="middle">PROGRESSISTA</text>
        <text x={C - R + 4} y={C - 6}>ESQUERDA</text>
        <text x={C + R - 4} y={C - 6} textAnchor="end">DIREITA</text>
      </g>

      {/* Quadrantes */}
      <g fontFamily="var(--font-space-mono)" fontSize="7" letterSpacing="1" fill="var(--dim)">
        <text x={C - R + 6} y={C - R + 14}>ESQ. CONSERVADORA</text>
        <text x={C + R - 6} y={C - R + 14} textAnchor="end">DIR. CONSERVADORA</text>
        <text x={C - R + 6} y={C + R - 8}>ESQ. PROGRESSISTA</text>
        <text x={C + R - 6} y={C + R - 8} textAnchor="end">DIR. PROGRESSISTA</text>
      </g>

      {point ? (
        <>
          {/* Linhas de mira até os eixos */}
          <g className="map-guides" stroke="var(--uv)" strokeWidth="1" strokeDasharray="2 3" opacity="0.7">
            <line x1={C + dx} y1={C - R} x2={C + dx} y2={C + R} />
            <line x1={C - R} y1={C + dy} x2={C + R} y2={C + dy} />
          </g>
          <g transform={`translate(${C} ${C})`}>
            <g className="map-dot" style={{ '--tx': `${dx}px`, '--ty': `${dy}px` } as CSSProperties}>
              <circle className="map-ring" r="8" fill="none" stroke="var(--uv)" strokeWidth="1.5" />
              <circle r="8" fill="var(--uv)" />
              <circle r="2.5" fill="var(--ink)" />
            </g>
          </g>
        </>
      ) : (
        <text
          x={C}
          y={C + 16}
          textAnchor="middle"
          fontFamily="var(--font-anton)"
          fontSize="48"
          fill="var(--uv)"
          className="q-pulse"
        >
          ?
        </text>
      )}
    </svg>
  );
}
