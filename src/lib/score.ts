import { MIRROR_PAIRS, QUESTIONS, THEMES, TODAY, type Axis, type Direction, type Mode } from '@/data/perguntas';

export const OPTIONS = [
  { value: 2, key: '1', label: 'Concordo totalmente' },
  { value: 1, key: '2', label: 'Concordo em parte' },
  { value: 0, key: '3', label: 'Neutro' },
  { value: -1, key: '4', label: 'Discordo em parte' },
  { value: -2, key: '5', label: 'Discordo totalmente' },
] as const;

// null = pulou ("não sei"). Fica fora da conta, ao contrário do neutro (0).
export type Answers = Record<string, number | null>;

export type Result = {
  e: number;
  s: number;
  themes: Record<string, number | null>;
  today: { e: number | null; s: number | null } | null;
  mode: Mode;
  // Índices de MIRROR_PAIRS em que a pessoa se contradisse (só no teste completo)
  contradictions: number[];
};

// Diferença entre valores e pautas a partir da qual o resultado avisa (chute inicial, calibrar).
export const TODAY_GAP = 0.3;

// Quantos pares contraditórios disparam o aviso de consistência
export const CONTRADICTION_MIN = 2;

// Contradição = mesma direção (concorda ou discorda) nas duas frases opostas. Neutro e pulada não contam.
function findContradictions(answers: Answers): number[] {
  return MIRROR_PAIRS.flatMap(({ ids: [a, b] }, i) => {
    const va = answers[a];
    const vb = answers[b];
    return va && vb && Math.sign(va) === Math.sign(vb) ? [i] : [];
  });
}

// Média de (resposta × direção) normalizada para −1..+1. null se nada foi respondido.
function score(items: { id: string; d: Direction }[], answers: Answers): number | null {
  let sum = 0;
  let n = 0;
  for (const q of items) {
    const v = answers[q.id];
    if (v === null || v === undefined) continue;
    sum += v * q.d;
    n++;
  }
  return n ? sum / (2 * n) : null;
}

const byAxis = (axis: Axis) => QUESTIONS.filter((q) => THEMES.find((t) => t.id === q.theme)!.axis === axis);

export function computeResult(answers: Answers, includeToday: boolean, mode: Mode): Result {
  const themes: Record<string, number | null> = {};
  for (const t of THEMES) themes[t.id] = score(QUESTIONS.filter((q) => q.theme === t.id), answers);

  return {
    e: score(byAxis('E'), answers) ?? 0,
    s: score(byAxis('S'), answers) ?? 0,
    themes,
    today: includeToday
      ? {
          e: score(TODAY.filter((q) => q.axis === 'E'), answers),
          s: score(TODAY.filter((q) => q.axis === 'S'), answers),
        }
      : null,
    mode,
    contradictions: mode === 'completo' ? findContradictions(answers) : [],
  };
}

// ---------- URL do resultado ----------
// /resultado?e=-32&s=18&t=-40.10.-20.5.30.60.-10.0&h=-10._&m=r
// Valores inteiros de −100 a 100; "_" = sem resposta naquele tema; m=r = modo rápido;
// c=0.2 = índices dos pares espelhados contraditórios.

const toInt = (x: number) => Math.round(x * 100);
const clamp = (x: number) => Math.max(-1, Math.min(1, x));

function parseNum(raw: string | undefined): number | null {
  if (raw === undefined || raw === '_' || raw === '') return null;
  const n = Number(raw);
  return Number.isFinite(n) ? clamp(n / 100) : null;
}

export function encodeResult(r: Result): string {
  const p = new URLSearchParams();
  p.set('e', String(toInt(r.e)));
  p.set('s', String(toInt(r.s)));
  p.set('t', THEMES.map((t) => (r.themes[t.id] === null ? '_' : toInt(r.themes[t.id]!))).join('.'));
  if (r.today) {
    p.set('h', [r.today.e, r.today.s].map((v) => (v === null ? '_' : toInt(v))).join('.'));
  }
  if (r.mode === 'rapido') p.set('m', 'r');
  if (r.contradictions.length) p.set('c', r.contradictions.join('.'));
  return p.toString();
}

type RawParams = Record<string, string | string[] | undefined>;

export function decodeResult(params: RawParams): Result | null {
  const get = (k: string) => {
    const v = params[k];
    return Array.isArray(v) ? v[0] : v;
  };
  const e = parseNum(get('e'));
  const s = parseNum(get('s'));
  if (e === null || s === null) return null;

  const parts = (get('t') ?? '').split('.');
  const themes: Record<string, number | null> = {};
  THEMES.forEach((t, i) => (themes[t.id] = parseNum(parts[i])));

  const h = get('h');
  const [he, hs] = h ? h.split('.').map(parseNum) : [];
  const mode: Mode = get('m') === 'r' ? 'rapido' : 'completo';
  return {
    e,
    s,
    themes,
    today: h ? { e: he ?? null, s: hs ?? null } : null,
    mode,
    contradictions:
      mode === 'completo'
        ? [
            ...new Set(
              (get('c') ?? '')
                .split('.')
                .filter(Boolean)
                .map(Number)
                .filter((i) => Number.isInteger(i) && i >= 0 && i < MIRROR_PAIRS.length),
            ),
          ]
        : [],
  };
}

// ---------- Rótulos e textos ----------

export function econLabel(x: number) {
  if (x <= -0.5) return 'Esquerda';
  if (x < -0.15) return 'Centro-esquerda';
  if (x <= 0.15) return 'Centro';
  if (x < 0.5) return 'Centro-direita';
  return 'Direita';
}

export function socLabel(y: number) {
  if (y <= -0.5) return 'Progressista';
  if (y < -0.15) return 'Moderadamente progressista';
  if (y <= 0.15) return 'Moderado';
  if (y < 0.5) return 'Moderadamente conservador';
  return 'Conservador';
}

export function econText(x: number) {
  if (x < -0.15)
    return 'Você acredita que o Estado deve agir para reduzir desigualdades: serviços públicos fortes, mais imposto para quem ganha mais e proteção ao trabalhador.';
  if (x > 0.15)
    return 'Você acredita que o mercado e a iniciativa individual resolvem melhor: menos impostos, menos regras e um Estado mais enxuto.';
  return 'Você mistura ideias: concorda com parte do que a esquerda defende e com parte do que a direita defende.';
}

export function socText(y: number) {
  if (y < -0.15)
    return 'Você valoriza a liberdade individual e a mudança: mais direitos para grupos que historicamente ficaram de fora e menos interferência nas escolhas pessoais.';
  if (y > 0.15)
    return 'Você valoriza a tradição, a ordem e a segurança: família, religião e leis mais duras contra o crime pesam muito nas suas escolhas.';
  return 'Você fica no meio: apoia algumas mudanças e quer preservar algumas tradições.';
}

export const fmt = (x: number) => (x > 0 ? '+' : x < 0 ? '−' : '±') + Math.abs(x).toFixed(2);
