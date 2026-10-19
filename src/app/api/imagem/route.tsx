import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { QUESTIONS, THEMES } from '@/data/perguntas';
import { decodeResult, econLabel, socLabel, type Result } from '@/lib/score';

// GET /api/imagem?f=og|story&e=..&s=..&t=..
// og    = 1200×630, card do link (WhatsApp, Instagram, X)
// story = 1080×1920, imagem para os stories
// Sem e/s, gera a versão genérica (mapa com "?").

const fontDir = join(process.cwd(), 'src/assets/fonts');
const fonts = Promise.all([
  readFile(join(fontDir, 'Anton-Regular.ttf')),
  readFile(join(fontDir, 'SpaceMono-Regular.ttf')),
  readFile(join(fontDir, 'SpaceMono-Bold.ttf')),
]);

const COLOR = {
  bg: '#0B0B0D',
  surface: '#141418',
  line: '#1F1F24',
  lineStrong: '#2A2A32',
  dim: '#5B5B66',
  muted: '#9494A0',
  ink: '#E8E8EF',
  uv: '#8A3CFF',
  uvSoft: '#A77BFF',
  amber: '#FFB224',
};

const MONO = 'Space Mono';
const DISPLAY = 'Anton';

// Space Mono não tem o sinal de menos tipográfico (−), então usa hífen nas imagens
const fmt = (x: number) => (x > 0 ? '+' : x < 0 ? '-' : '±') + Math.abs(x).toFixed(2);

// Mesmo plano do site: viewBox 320, centro 160, valor 1 = 130 unidades
function MapGraphic({ size, point }: { size: number; point?: { x: number; y: number } }) {
  const C = 160;
  const R = 130;
  const k = size / 320;
  const box = 0.15 * R;
  const grid = [-0.8, -0.6, -0.4, -0.2, 0.2, 0.4, 0.6, 0.8];
  const px = point ? C + point.x * R : C;
  const py = point ? C - point.y * R : C;
  const label = { position: 'absolute' as const, fontFamily: MONO, fontSize: 9 * k, letterSpacing: 1.5 * k, color: COLOR.muted };
  const corner = { ...label, fontSize: 7 * k, color: COLOR.dim };

  return (
    <div style={{ display: 'flex', position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 320 320">
        {grid.map((g) => (
          <g key={g}>
            <line x1={C + g * R} y1={C - R} x2={C + g * R} y2={C + R} stroke={COLOR.line} strokeWidth="1" />
            <line x1={C - R} y1={C + g * R} x2={C + R} y2={C + g * R} stroke={COLOR.line} strokeWidth="1" />
          </g>
        ))}
        <rect x={C - R} y={C - R} width={2 * R} height={2 * R} fill="none" stroke={COLOR.lineStrong} />
        <line x1={C - R} y1={C} x2={C + R} y2={C} stroke={COLOR.dim} strokeWidth="1.5" />
        <line x1={C} y1={C - R} x2={C} y2={C + R} stroke={COLOR.dim} strokeWidth="1.5" />
        <rect x={C - box} y={C - box} width={2 * box} height={2 * box} fill="none" stroke={COLOR.dim} strokeDasharray="3 4" />
        {point && (
          <g>
            <line x1={px} y1={C - R} x2={px} y2={C + R} stroke={COLOR.uv} strokeWidth="1" strokeDasharray="2 3" />
            <line x1={C - R} y1={py} x2={C + R} y2={py} stroke={COLOR.uv} strokeWidth="1" strokeDasharray="2 3" />
            <circle cx={px} cy={py} r="16" fill={COLOR.uv} fillOpacity="0.25" />
            <circle cx={px} cy={py} r="8" fill={COLOR.uv} />
            <circle cx={px} cy={py} r="2.5" fill={COLOR.ink} />
          </g>
        )}
      </svg>

      <div style={{ ...label, top: 12 * k, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>CONSERVADOR</div>
      <div style={{ ...label, top: (C + R + 5) * k, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        PROGRESSISTA
      </div>
      <div style={{ ...label, top: (C - 18) * k, left: (C - R + 4) * k }}>ESQUERDA</div>
      <div style={{ ...label, top: (C - 18) * k, right: (320 - C - R + 4) * k }}>DIREITA</div>
      <div style={{ ...corner, top: (C - R + 6) * k, left: (C - R + 6) * k }}>ESQ. CONSERVADORA</div>
      <div style={{ ...corner, top: (C - R + 6) * k, right: (320 - C - R + 6) * k }}>DIR. CONSERVADORA</div>
      <div style={{ ...corner, top: (C + R - 16) * k, left: (C - R + 6) * k }}>ESQ. PROGRESSISTA</div>
      <div style={{ ...corner, top: (C + R - 16) * k, right: (320 - C - R + 6) * k }}>DIR. PROGRESSISTA</div>

      {!point && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: DISPLAY,
            fontSize: 56 * k,
            color: COLOR.uv,
          }}
        >
          ?
        </div>
      )}
    </div>
  );
}

function Brand({ size }: { size: number }) {
  return (
    <div style={{ display: 'flex', fontFamily: DISPLAY, fontSize: size, color: COLOR.ink, letterSpacing: 1 }}>
      MAPA<span style={{ color: COLOR.uv }}>{'//'}</span>BR
    </div>
  );
}

function ThemeRow({ name, value, width }: { name: string; value: number | null; width: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width, marginBottom: 26 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 19, color: COLOR.ink, marginBottom: 10 }}>
        <span>{name}</span>
        <span style={{ color: COLOR.uvSoft, marginLeft: 12 }}>{value === null ? '--' : fmt(value)}</span>
      </div>
      <div style={{ display: 'flex', position: 'relative', height: 12, background: COLOR.line }}>
        {value !== null && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              background: COLOR.uv,
              width: `${Math.abs(value) * 50}%`,
              ...(value < 0 ? { right: '50%' } : { left: '50%' }),
            }}
          />
        )}
        <div style={{ position: 'absolute', left: '50%', top: -5, bottom: -5, width: 2, background: COLOR.dim }} />
      </div>
    </div>
  );
}

// Anton é estreita, mas rótulos como "CENTRO-ESQUERDA" ainda precisam encolher
const titleSize = (text: string, base: number) => (text.length > 10 ? Math.round(base * 0.72) : base);

function OgImage({ result, host }: { result: Result | null; host: string }) {
  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', background: COLOR.bg, padding: 56, position: 'relative' }}>
      <div style={{ position: 'absolute', left: -160, top: -120, width: 520, height: 520, borderRadius: 9999, background: COLOR.uv, opacity: 0.18, filter: 'blur(120px)' }} />

      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 600 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Brand size={44} />
          <span style={{ fontFamily: MONO, fontSize: 16, color: COLOR.muted, letterSpacing: 3 }}>DIAGNÓSTICO POLÍTICO</span>
        </div>

        {result ? (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: MONO, fontSize: 20, color: COLOR.uvSoft, letterSpacing: 3, marginBottom: 14 }}>
              {'> '}RESULTADO
            </span>
            <span style={{ fontFamily: DISPLAY, fontSize: titleSize(econLabel(result.e), 124), color: COLOR.ink, lineHeight: 1 }}>
              {econLabel(result.e).toUpperCase()}
            </span>
            <span style={{ fontFamily: DISPLAY, fontSize: 38, color: COLOR.uvSoft, lineHeight: 1.1, marginTop: 14 }}>
              NOS COSTUMES: {socLabel(result.s).toUpperCase()}
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: DISPLAY, fontSize: 92, color: COLOR.ink, lineHeight: 1 }}>ONDE VOCÊ ESTÁ</span>
            <span style={{ fontFamily: DISPLAY, fontSize: 92, color: COLOR.uvSoft, lineHeight: 1 }}>NO MAPA POLÍTICO?</span>
          </div>
        )}

        <div style={{ display: 'flex', fontFamily: MONO, fontSize: 18, color: COLOR.muted, letterSpacing: 2 }}>
          {result ? `x: ${fmt(result.e)} · y: ${fmt(result.s)}  ·  ` : `${QUESTIONS.length} FRASES · ECONOMIA × COSTUMES  ·  `}
          <span style={{ color: COLOR.amber, marginLeft: 8 }}>{host.toUpperCase()}</span>
        </div>
      </div>

      <div style={{ display: 'flex', marginLeft: 'auto', alignItems: 'center' }}>
        <MapGraphic size={500} point={result ? { x: result.e, y: result.s } : undefined} />
      </div>
    </div>
  );
}

function StoryImage({ result, host }: { result: Result; host: string }) {
  const econ = econLabel(result.e).toUpperCase();
  const colWidth = 440;
  // O Satori encolhe filhos que não cabem (flexShrink 1); aqui cada bloco mantém o tamanho
  const block = { display: 'flex', flexShrink: 0 } as const;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: COLOR.bg, padding: '80px 80px', position: 'relative' }}>
      <div style={{ position: 'absolute', left: -260, top: 300, width: 800, height: 800, borderRadius: 9999, background: COLOR.uv, opacity: 0.16, filter: 'blur(160px)' }} />
      <div style={{ position: 'absolute', right: -300, bottom: 200, width: 700, height: 700, borderRadius: 9999, background: COLOR.amber, opacity: 0.08, filter: 'blur(160px)' }} />

      <div style={{ ...block, alignItems: 'center', justifyContent: 'space-between' }}>
        <Brand size={64} />
        <span style={{ fontFamily: MONO, fontSize: 22, color: COLOR.muted, letterSpacing: 4 }}>
          {result.mode === 'rapido' ? 'MODO RÁPIDO' : 'DIAGNÓSTICO POLÍTICO'}
        </span>
      </div>

      <span style={{ ...block, fontFamily: MONO, fontSize: 26, color: COLOR.uvSoft, letterSpacing: 4, marginTop: 56 }}>
        {'> '}MEU RESULTADO
      </span>
      <span style={{ ...block, fontFamily: DISPLAY, fontSize: titleSize(econ, 170), color: COLOR.ink, lineHeight: 1.05, marginTop: 14 }}>
        {econ}
      </span>
      <span style={{ ...block, fontFamily: DISPLAY, fontSize: 54, color: COLOR.uvSoft, lineHeight: 1.1, marginTop: 10 }}>
        NOS COSTUMES: {socLabel(result.s).toUpperCase()}
      </span>

      <div style={{ ...block, flexDirection: 'column', alignItems: 'center', marginTop: 36 }}>
        <div style={{ display: 'flex', fontFamily: MONO, fontSize: 24, color: COLOR.muted, letterSpacing: 3, marginBottom: 6 }}>
          x: <span style={{ color: COLOR.uvSoft, margin: '0 18px 0 10px' }}>{fmt(result.e)}</span> y:
          <span style={{ color: COLOR.uvSoft, marginLeft: 10 }}>{fmt(result.s)}</span>
        </div>
        <MapGraphic size={700} point={{ x: result.e, y: result.s }} />
      </div>

      <div style={{ ...block, justifyContent: 'space-between', marginTop: 30 }}>
        {(['E', 'S'] as const).map((axis) => (
          <div key={axis} style={{ display: 'flex', flexDirection: 'column', width: colWidth }}>
            <span style={{ fontFamily: MONO, fontSize: 20, color: COLOR.uvSoft, letterSpacing: 3, marginBottom: 22 }}>
              {axis === 'E' ? '// ECONOMIA' : '// COSTUMES'}
            </span>
            {THEMES.filter((t) => t.axis === axis).map((t) => (
              <ThemeRow key={t.id} name={t.name.toUpperCase()} value={result.themes[t.id]} width={colWidth} />
            ))}
          </div>
        ))}
      </div>

      <div style={{ ...block, justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', borderTop: `2px solid ${COLOR.line}`, paddingTop: 26 }}>
        <span style={{ fontFamily: DISPLAY, fontSize: 48, color: COLOR.ink }}>E VOCÊ?</span>
        <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, color: COLOR.amber, letterSpacing: 2 }}>{host.toUpperCase()}</span>
      </div>
    </div>
  );
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const format = url.searchParams.get('f') === 'story' ? 'story' : 'og';
  const result = decodeResult(Object.fromEntries(url.searchParams));
  const host = url.host;

  // Story sem resultado não faz sentido: cai no card genérico
  const isStory = format === 'story' && result !== null;
  const [anton, monoRegular, monoBold] = await fonts;

  return new ImageResponse(
    isStory ? <StoryImage result={result!} host={host} /> : <OgImage result={result} host={host} />,
    {
      width: isStory ? 1080 : 1200,
      height: isStory ? 1920 : 630,
      fonts: [
        { name: DISPLAY, data: anton, weight: 400, style: 'normal' },
        { name: MONO, data: monoRegular, weight: 400, style: 'normal' },
        { name: MONO, data: monoBold, weight: 700, style: 'normal' },
      ],
      // A imagem depende só da URL: pode ficar em cache para sempre
      headers: { 'Cache-Control': 'public, max-age=31536000, immutable' },
    },
  );
}
