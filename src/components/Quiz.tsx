'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { Brand } from '@/components/Brand';
import { ORDER_BY_MODE, TODAY, TODAY_EDITION, themeById, type Mode } from '@/data/perguntas';
import { OPTIONS, computeResult, encodeResult, type Answers } from '@/lib/score';

type Phase = 'core' | 'offer' | 'today';
type State = { phase: Phase; i: number; answers: Answers };

const storageKey = (mode: Mode) => `mapabr:progresso:${mode}:v1`;
const INITIAL: State = { phase: 'core', i: 0, answers: {} };

// Progresso fica no sessionStorage: sobrevive a trocar de app no celular, some ao fechar a aba
function loadState(mode: Mode): State {
  try {
    const raw = sessionStorage.getItem(storageKey(mode));
    if (raw) return { ...INITIAL, ...JSON.parse(raw) };
  } catch {}
  return INITIAL;
}

function saveState(mode: Mode, state: State | null) {
  try {
    if (state) sessionStorage.setItem(storageKey(mode), JSON.stringify(state));
    else sessionStorage.removeItem(storageKey(mode));
  } catch {}
}

function AsciiBar({ value, total, width = 24 }: { value: number; total: number; width?: number }) {
  const filled = Math.round((value / total) * width);
  return (
    <span aria-hidden className="tracking-[-0.05em]">
      <span className="text-uv">{'█'.repeat(filled)}</span>
      <span className="text-line-strong">{'░'.repeat(width - filled)}</span>
    </span>
  );
}

// Intensidade da opção: 2 barras acesas para "totalmente", 1 para "em parte"
function Scale({ value }: { value: number }) {
  return (
    <span aria-hidden className="hidden sm:inline-flex gap-[3px] items-end shrink-0">
      {[-2, -1, 0, 1, 2].map((k) => {
        const on = value === 0 ? k === 0 : Math.sign(k) === Math.sign(value) && Math.abs(k) <= Math.abs(value);
        return (
          <i
            key={k}
            className={`block w-[5px] rounded-[1px] ${on ? 'bg-uv' : 'bg-line-strong'}`}
            style={{ height: 6 + Math.abs(k) * 4 }}
          />
        );
      })}
    </span>
  );
}

export function Quiz({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [state, setState] = useState<State>(() => loadState(mode));
  const { phase, i, answers } = state;
  const coreOrder = ORDER_BY_MODE[mode];

  useEffect(() => saveState(mode, state), [mode, state]);

  const questions = phase === 'today' ? TODAY : coreOrder;
  const q = phase === 'offer' ? null : questions[i];

  const finish = useCallback(
    (finalAnswers: Answers, includeToday: boolean) => {
      saveState(mode, null);
      router.push(`/resultado?${encodeResult(computeResult(finalAnswers, includeToday, mode))}`);
    },
    [router, mode],
  );

  const answer = useCallback(
    (value: number | null) => {
      if (!q) return;
      const next = { ...answers, [q.id]: value };
      if (i < questions.length - 1) {
        setState({ phase, i: i + 1, answers: next });
      } else if (phase === 'core') {
        setState({ phase: 'offer', i: 0, answers: next });
      } else {
        finish(next, true);
      }
    },
    [q, answers, i, questions.length, phase, finish],
  );

  const back = useCallback(() => {
    if (phase === 'offer') setState({ phase: 'core', i: coreOrder.length - 1, answers });
    else if (phase === 'today' && i === 0) setState({ phase: 'offer', i: 0, answers });
    else if (i > 0) setState({ phase, i: i - 1, answers });
  }, [phase, i, answers, coreOrder.length]);

  const restart = () => setState(INITIAL);

  const startToday = useCallback(() => setState({ phase: 'today', i: 0, answers }), [answers]);
  const skipToday = useCallback(() => finish(answers, false), [answers, finish]);

  // Atalhos de teclado: 1–5 responde, 0 pula, ⌫/← volta
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (phase === 'offer') {
        if (e.key === '1') startToday();
        else if (e.key === '2') skipToday();
        else if (e.key === 'Backspace' || e.key === 'ArrowLeft') back();
        return;
      }
      const opt = OPTIONS.find((o) => o.key === e.key);
      if (opt) answer(opt.value);
      else if (e.key === '0') answer(null);
      else if (e.key === 'Backspace' || e.key === 'ArrowLeft') back();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, answer, back, startToday, skipToday]);

  const position = phase === 'offer' ? coreOrder.length : i + 1;
  const total = phase === 'today' ? TODAY.length : coreOrder.length;
  const label =
    phase === 'today'
      ? `BRASIL DE HOJE · ${TODAY_EDITION}`
      : q && 'theme' in q
        ? `${q.theme} · ${themeById(q.theme).name}`
        : 'NÚCLEO CONCLUÍDO';
  const canGoBack = phase !== 'core' || i > 0;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-line">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brand />
            {mode === 'rapido' && (
              <span className="font-data text-[9px] text-amber border border-amber/40 px-1.5 py-0.5 uppercase tracking-widest">
                Rápido
              </span>
            )}
          </div>
          <button
            onClick={restart}
            className="flex items-center gap-1.5 font-data text-[10px] text-muted hover:text-ink uppercase tracking-widest transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Recomeçar
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 pt-6 pb-10 flex flex-col">
        {/* Progresso */}
        <div className="font-data text-[11px] uppercase tracking-widest mb-8">
          <div className="flex items-center justify-between gap-3 mb-2">
            <span className="text-ink">
              [{String(position).padStart(2, '0')}/{total}]
            </span>
            <span className="text-[10px] sm:text-[11px] overflow-hidden">
              <AsciiBar value={phase === 'offer' ? total : i} total={total} />
            </span>
          </div>
          <span className={phase === 'today' ? 'text-amber' : 'text-uv-soft'}>
            {'// '}
            {label}
          </span>
        </div>

        {phase === 'offer' ? (
          <section key="offer" className="question-in flex-1 flex flex-col" aria-live="polite">
            <p className="font-data text-[11px] text-uv-soft uppercase tracking-widest mb-3">{'> '}análise do núcleo pronta</p>
            <h1 className="font-display text-4xl sm:text-5xl leading-[0.95] tracking-tight mb-5">
              SEU MAPA ESTÁ PRONTO.
              <br />
              <span className="text-amber">QUER COMPARAR COM O BRASIL DE HOJE?</span>
            </h1>
            <p className="text-base sm:text-lg text-ink/80 leading-relaxed mb-8 max-w-xl">
              São mais {TODAY.length} frases sobre pautas atuais. Elas <strong className="text-ink">não mudam</strong> seu ponto no
              mapa: servem para ver se suas posições nas discussões de hoje batem com os valores que você mostrou até aqui.
            </p>
            <div className="grid gap-3">
              <button
                onClick={startToday}
                className="cta-shine bg-amber hover:bg-[#ffc04d] text-bg font-display text-xl uppercase py-4 px-6 tracking-wider flex items-center justify-between gap-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                <span>RESPONDER MAIS {TODAY.length}</span>
                <span className="font-data text-xs">[1]</span>
              </button>
              <button
                onClick={skipToday}
                className="border border-line-strong hover:border-uv bg-surface text-ink font-display text-xl uppercase py-4 px-6 tracking-wider flex items-center justify-between gap-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-uv"
              >
                <span className="flex items-center gap-3">
                  VER MEU RESULTADO <ArrowRight className="w-5 h-5" />
                </span>
                <span className="font-data text-xs text-muted">[2]</span>
              </button>
            </div>
          </section>
        ) : (
          q && (
            <section key={q.id} className="question-in flex-1 flex flex-col" aria-live="polite">
              <p className="text-2xl sm:text-3xl font-semibold leading-snug tracking-tight min-h-[6.5em] sm:min-h-[5em] mb-6">
                {q.text}
              </p>

              <div className="grid gap-2" role="group" aria-label="Sua resposta">
                {OPTIONS.map((o) => {
                  const chosen = answers[q.id] === o.value;
                  return (
                    <button
                      key={o.value}
                      onClick={() => answer(o.value)}
                      aria-pressed={chosen}
                      className={`group flex items-center gap-3 border px-4 py-3.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-uv ${
                        chosen
                          ? 'border-uv bg-uv/15'
                          : 'border-line-strong bg-surface hover:border-uv/60 hover:bg-[#18181d]'
                      }`}
                    >
                      <span
                        className={`font-data text-[11px] w-7 shrink-0 ${chosen ? 'text-uv-soft' : 'text-muted group-hover:text-uv-soft'}`}
                      >
                        [{o.key}]
                      </span>
                      <span className="flex-1 font-semibold">{o.label}</span>
                      <Scale value={o.value} />
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between mt-5 font-data text-[11px] uppercase tracking-widest">
                <button
                  onClick={back}
                  disabled={!canGoBack}
                  className="flex items-center gap-1.5 py-2 text-muted hover:text-ink disabled:invisible transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Voltar
                </button>
                <button
                  onClick={() => answer(null)}
                  className={`py-2 transition-colors hover:text-ink ${answers[q.id] === null ? 'text-amber' : 'text-muted'}`}
                >
                  {answers[q.id] === null ? 'Pulada · ' : ''}Não sei, pular <span className="text-dim">[0]</span>
                </button>
              </div>
            </section>
          )
        )}
      </main>
    </div>
  );
}
