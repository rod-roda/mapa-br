import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowRight, RotateCcw, TriangleAlert } from 'lucide-react';
import { Brand, SectionLabel } from '@/components/Brand';
import { Fx } from '@/components/Fx';
import { PoliticalMap } from '@/components/PoliticalMap';
import { ShareButton } from '@/components/ShareButton';
import { StoryButton } from '@/components/StoryButton';
import { MIRROR_PAIRS, QUICK_ORDER, THEMES, TODAY_EDITION, type Axis } from '@/data/perguntas';
import {
  CONTRADICTION_MIN,
  TODAY_GAP,
  decodeResult,
  encodeResult,
  econLabel,
  econText,
  fmt,
  socLabel,
  socText,
  type Result,
} from '@/lib/score';

// Cada link de resultado ganha o próprio título e a própria imagem de prévia
export async function generateMetadata({ searchParams }: PageProps<'/resultado'>): Promise<Metadata> {
  const result = decodeResult(await searchParams);
  if (!result) return { title: 'Resultado · MAPA//BR' };

  const title = `${econLabel(result.e)} · ${socLabel(result.s)}`;
  const description = 'Esse foi o meu resultado no MAPA//BR. Onde você fica no mapa político?';
  return {
    title: `${title} · MAPA//BR`,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: `/api/imagem?f=og&${encodeResult(result)}`, width: 1200, height: 630 }],
    },
  };
}

const pct = (v: number) => `${((v + 1) / 2) * 100}%`;

// ["a", "b", "c"] → "a, b e c"
const joinLabels = (items: string[]) =>
  items.length > 1 ? `${items.slice(0, -1).join(', ')} e ${items[items.length - 1]}` : (items[0] ?? '');

// Trilho de um eixo com o marcador na posição
function AxisTrack({ value, low, high, name }: { value: number; low: string; high: string; name: string }) {
  return (
    <div>
      <div className="flex justify-between font-data text-[10px] uppercase tracking-widest text-muted mb-2">
        <span>{low}</span>
        <span className="text-ink">
          {name} <span className="text-uv-soft">{fmt(value)}</span>
        </span>
        <span>{high}</span>
      </div>
      <div className="relative h-2 bg-line">
        <span className="absolute left-1/2 -top-1 -bottom-1 w-px bg-dim" />
        <span
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-uv border-2 border-bg rounded-full"
          style={{ left: pct(value) }}
        />
      </div>
    </div>
  );
}

// Barra de tema: cresce do centro para o lado da resposta
function ThemeBar({ value, delay }: { value: number | null; delay: number }) {
  if (value === null) {
    return (
      <div className="relative h-2 bg-line flex items-center justify-center">
        <span className="font-data text-[9px] text-muted uppercase tracking-widest bg-bg px-2">sem respostas</span>
      </div>
    );
  }
  const width = `${Math.abs(value) * 50}%`;
  return (
    <div className="relative h-2 bg-line">
      <span
        className={`bar-in absolute top-0 bottom-0 bg-uv ${value < 0 ? 'right-1/2 origin-right' : 'left-1/2 origin-left'}`}
        style={{ width, animationDelay: `${delay}ms` }}
      />
      <span className="absolute left-1/2 -top-1 -bottom-1 w-px bg-dim" />
    </div>
  );
}

// Dois marcadores no mesmo trilho: valores (roxo) e pautas de hoje (âmbar)
function CompareTrack({ core, today, low, high }: { core: number; today: number; low: string; high: string }) {
  return (
    <div>
      <div className="relative h-2 bg-line my-3">
        <span className="absolute left-1/2 -top-1 -bottom-1 w-px bg-dim" />
        <span
          className="absolute top-1/2 h-px bg-ink/30"
          style={{ left: pct(Math.min(core, today)), width: `${(Math.abs(today - core) / 2) * 100}%` }}
        />
        <span
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-uv border-2 border-bg rounded-full"
          style={{ left: pct(core) }}
        />
        <span
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-amber border-2 border-bg rotate-45"
          style={{ left: pct(today) }}
        />
      </div>
      <div className="flex justify-between font-data text-[10px] uppercase tracking-widest text-muted">
        <span>{low}</span>
        <span>{high}</span>
      </div>
    </div>
  );
}

const AXIS_WORDS: Record<Axis, { name: string; low: string; high: string; toLow: string; toHigh: string }> = {
  E: { name: 'Economia', low: 'Esquerda', high: 'Direita', toLow: 'mais à esquerda', toHigh: 'mais à direita' },
  S: { name: 'Costumes', low: 'Progressista', high: 'Conservador', toLow: 'mais progressista', toHigh: 'mais conservador' },
};

function TodaySection({ result }: { result: Result }) {
  const today = result.today!;
  const rows = (['E', 'S'] as const).map((axis) => {
    const core = axis === 'E' ? result.e : result.s;
    const now = axis === 'E' ? today.e : today.s;
    return { axis, core, now, gap: now === null ? 0 : now - core };
  });
  const diverging = rows.filter((r) => r.now !== null && Math.abs(r.gap) >= TODAY_GAP);

  return (
    <section className="max-w-6xl mx-auto px-4 py-14 border-t border-line">
      <SectionLabel index="03">BRASIL DE HOJE · {TODAY_EDITION}</SectionLabel>
      <h2 className="font-display text-4xl sm:text-5xl leading-[0.92] tracking-tight mb-3">
        SEUS VALORES <span className="text-muted">×</span> <span className="text-amber">AS PAUTAS ATUAIS</span>
      </h2>
      <p className="text-sm text-ink/70 leading-relaxed max-w-2xl mb-8">
        <span className="inline-block w-2.5 h-2.5 rounded-full bg-uv align-middle mr-1.5" />
        onde seus valores te colocam
        <span className="inline-block w-2.5 h-2.5 bg-amber rotate-45 align-middle ml-4 mr-1.5" />
        onde você ficou nas pautas de hoje
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {rows.map((r) => {
          const w = AXIS_WORDS[r.axis];
          return (
            <div key={r.axis} className="bg-surface border border-line p-5">
              <div className="flex justify-between font-data text-[10px] uppercase tracking-widest mb-1">
                <span className="text-ink">{w.name}</span>
                <span className="text-muted">
                  <span className="text-uv-soft">{fmt(r.core)}</span>
                  {' → '}
                  <span className="text-amber">{r.now === null ? '—' : fmt(r.now)}</span>
                </span>
              </div>
              {r.now === null ? (
                <p className="font-data text-[10px] text-muted uppercase tracking-widest mt-4">sem respostas neste eixo</p>
              ) : (
                <CompareTrack core={r.core} today={r.now} low={w.low} high={w.high} />
              )}
            </div>
          );
        })}
      </div>

      <div className={`border-l-2 pl-4 py-1 max-w-2xl ${diverging.length ? 'border-amber' : 'border-uv'}`}>
        {diverging.length ? (
          <>
            {diverging.map((r) => {
              const w = AXIS_WORDS[r.axis];
              return (
                <p key={r.axis} className="text-ink/85 leading-relaxed mb-2">
                  Em <strong className="text-ink">{w.name.toLowerCase()}</strong>, seus valores te colocam em{' '}
                  <strong className="text-uv-soft">{fmt(r.core)}</strong>, mas nas pautas atuais você ficou{' '}
                  <strong className="text-amber">{r.gap > 0 ? w.toHigh : w.toLow}</strong>.
                </p>
              );
            })}
            <p className="text-sm text-ink/65 leading-relaxed">
              Vale pensar se sua opinião sobre essas pautas vem das ideias ou de quem está defendendo cada lado.
            </p>
          </>
        ) : (
          <p className="text-ink/85 leading-relaxed">
            Suas posições nas pautas atuais estão alinhadas com os valores que você mostrou no teste.
          </p>
        )}
      </div>
    </section>
  );
}

async function ResultContent({ searchParams }: Pick<PageProps<'/resultado'>, 'searchParams'>) {
  const result = decodeResult(await searchParams);

  if (!result) {
    return (
      <section className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="font-data text-[11px] text-amber uppercase tracking-widest mb-3">{'> '}nenhum resultado encontrado</p>
        <h1 className="font-display text-5xl leading-[0.92] tracking-tight mb-8">ESSE LINK NÃO TEM UM MAPA.</h1>
        <Link
          href="/teste"
          className="inline-flex items-center gap-3 bg-uv hover:bg-[#9a55ff] text-white font-display text-xl uppercase py-4 px-8 tracking-wider transition-colors"
        >
          FAZER O TESTE <ArrowRight className="w-5 h-5" />
        </Link>
      </section>
    );
  }

  const title = econLabel(result.e);
  const subtitle = socLabel(result.s);

  return (
    <>
      {/* ============ MAPA ============ */}
      <section className="relative overflow-hidden">
        <div className="glow-uv w-[420px] h-[420px] -left-40 top-0" />
        <div className="glow-amber w-[320px] h-[320px] -right-20 bottom-0" />

        <div className="relative max-w-6xl mx-auto px-4 py-10 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6 order-2 animate-stack-2">
            <div className="crosshair-corners bg-surface/60 backdrop-blur-sm p-4 sm:p-6 max-w-md mx-auto">
              <div className="flex items-center justify-between font-data text-[9px] text-muted uppercase tracking-widest mb-3">
                <span>{'// '}SUA POSIÇÃO</span>
                <span className="text-ink">
                  x: <span className="text-uv-soft">{fmt(result.e)}</span> · y:{' '}
                  <span className="text-uv-soft">{fmt(result.s)}</span>
                </span>
              </div>
              <PoliticalMap point={{ x: result.e, y: result.s }} />
            </div>
          </div>

          <div className="lg:col-span-6 order-1">
            <p className="font-data text-[11px] text-uv-soft uppercase tracking-widest mb-3 animate-stack-1">
              {'> '}análise concluída
            </p>
            <h1
              data-text={title}
              className="glitch glitch-intro font-display text-6xl sm:text-7xl md:text-8xl tracking-tight leading-[0.88] mb-3 animate-stack-1"
            >
              {title}
            </h1>
            <p className="font-display text-2xl sm:text-3xl text-uv-soft tracking-wide mb-8 animate-stack-2">
              NOS COSTUMES: {subtitle}
            </p>

            {result.mode === 'rapido' && (
              <Link
                href="/teste"
                className="group flex items-center justify-between gap-3 border border-amber/40 hover:border-amber bg-amber/5 px-4 py-3 mb-8 transition-colors animate-stack-2"
              >
                <span className="text-sm text-ink/85 leading-snug">
                  <span className="font-data text-[10px] text-amber uppercase tracking-widest block mb-0.5">Modo rápido</span>
                  Com {QUICK_ORDER.length} frases, o resultado é uma estimativa. Faça o completo para um mapa mais preciso.
                </span>
                <ArrowRight className="w-4 h-4 text-amber shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            )}

            {result.contradictions.length >= CONTRADICTION_MIN && (
              <div className="border border-amber/40 bg-amber/5 px-4 py-3 mb-8 animate-stack-2" role="note">
                <span className="font-data text-[10px] text-amber uppercase tracking-widest flex items-center gap-1.5 mb-1">
                  <TriangleAlert className="w-3 h-3" /> Respostas que se contradizem
                </span>
                <p className="text-sm text-ink/85 leading-snug">
                  Em {result.contradictions.length} de {MIRROR_PAIRS.length} pares de frases opostas (
                  {joinLabels(result.contradictions.map((i) => MIRROR_PAIRS[i].label))}), você concordou ou discordou das
                  duas. Respostas assim se anulam e podem puxar seu resultado para o centro.{' '}
                  <Link href="/teste" className="text-amber underline underline-offset-2 hover:text-ink">
                    Refazer com calma
                  </Link>
                </p>
              </div>
            )}

            <div className="space-y-6 animate-stack-3">
              <div>
                <AxisTrack value={result.e} name="Economia" low="Esquerda" high="Direita" />
                <p className="text-sm text-ink/75 leading-relaxed mt-3">{econText(result.e)}</p>
              </div>
              <div>
                <AxisTrack value={result.s} name="Costumes" low="Progressista" high="Conservador" />
                <p className="text-sm text-ink/75 leading-relaxed mt-3">{socText(result.s)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ POR TEMA ============ */}
      <section className="max-w-6xl mx-auto px-4 py-14 border-t border-line">
        <SectionLabel index="02">POR TEMA</SectionLabel>
        <h2 className="font-display text-4xl sm:text-5xl leading-[0.92] tracking-tight mb-3">
          O MAPA NÃO CONTA TUDO.
          <br />
          <span className="text-muted">OS TEMAS CONTAM.</span>
        </h2>
        <p className="text-sm text-ink/70 leading-relaxed max-w-2xl mb-10">
          Ninguém é de esquerda ou de direita em tudo. Veja para que lado você puxa em cada um dos oito temas.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-7">
          {(['E', 'S'] as const).map((axis) => (
            <div key={axis} className="space-y-7">
              <span className="block font-data text-[10px] text-uv-soft uppercase tracking-widest border-b border-line pb-2">
                {AXIS_WORDS[axis].name}
              </span>
              {THEMES.filter((t) => t.axis === axis).map((t, i) => {
                const v = result.themes[t.id];
                return (
                  <div key={t.id}>
                    <div className="flex items-baseline justify-between gap-3 mb-2">
                      <span className="font-semibold text-ink">
                        <span className="font-data text-[10px] text-muted mr-2">{t.id}</span>
                        {t.name}
                      </span>
                      <span className="font-data text-[11px] text-uv-soft">{v === null ? '—' : fmt(v)}</span>
                    </div>
                    <ThemeBar value={v} delay={200 + i * 100} />
                    <div className="flex justify-between font-data text-[9px] uppercase tracking-widest text-muted mt-1.5">
                      <span>{t.low}</span>
                      <span>{t.high}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </section>

      {result.today && <TodaySection result={result} />}

      {/* ============ FECHAMENTO ============ */}
      <section className="max-w-6xl mx-auto px-4 py-14 border-t border-line">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="border-l-2 border-amber pl-4 py-1">
            <p className="text-sm text-ink/75 leading-relaxed mb-3">
              Esse teste é uma simplificação. Direita e esquerda mudam de país pra país: o que é esquerda no Brasil pode ser
              centro na Dinamarca.
            </p>
            <p className="text-sm text-ink/75 leading-relaxed">Dá pra discordar e conviver. Isso é democracia.</p>
          </div>

          <div className="flex flex-col gap-3">
            <StoryButton query={encodeResult(result)} />
            <ShareButton title={`${title} · ${subtitle}`} />
            <Link
              href={result.mode === 'rapido' ? '/rapido' : '/teste'}
              className="border border-line-strong hover:border-uv bg-surface text-ink font-data text-[11px] uppercase tracking-widest py-4 px-5 flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Refazer o teste
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default function ResultadoPage(props: PageProps<'/resultado'>) {
  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">
      <Fx />
      <header className="relative z-10 border-b border-line">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Brand />
          <span className="font-data text-[10px] text-muted uppercase tracking-widest">resultado</span>
        </div>
      </header>

      <main className="flex-1 w-full">
        <Suspense
          fallback={
            <div className="py-32 text-center font-data text-[11px] text-muted uppercase tracking-widest">
              <span className="cursor">processando</span>
            </div>
          }
        >
          <ResultContent searchParams={props.searchParams} />
        </Suspense>
      </main>

      <footer className="border-t border-line py-4 px-4 font-data text-[10px] text-muted uppercase tracking-widest">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            MAPA<span className="text-uv-soft">{'//'}</span>BR · DIAGNÓSTICO POLÍTICO
          </span>
          <span>O resultado vive só no link</span>
        </div>
      </footer>
    </div>
  );
}
