import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Brand, SectionLabel } from '@/components/Brand';
import { Fx } from '@/components/Fx';
import { PoliticalMap } from '@/components/PoliticalMap';
import { QUESTIONS, QUICK_ORDER, THEMES, TODAY, TODAY_EDITION } from '@/data/perguntas';

const STATS = [
  { label: 'FRASES', value: String(QUESTIONS.length) },
  { label: 'TEMPO', value: '~7 MIN' },
  { label: 'EIXOS', value: '2' },
  { label: 'DADOS SALVOS', value: '0' },
];

const AXES = [
  {
    tag: 'EIXO X',
    name: 'ECONOMIA',
    low: 'Esquerda',
    high: 'Direita',
    text: 'Quanto o Estado deve agir na economia: impostos, serviços públicos, trabalho, meio ambiente.',
    axis: 'E' as const,
  },
  {
    tag: 'EIXO Y',
    name: 'COSTUMES',
    low: 'Progressista',
    high: 'Conservador',
    text: 'Quanto a tradição deve orientar a vida em sociedade: segurança, drogas, família, religião, diversidade.',
    axis: 'S' as const,
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">
      <Fx />

      <header className="relative z-10 border-b border-line">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Brand />
          <span className="font-data text-[10px] text-muted uppercase tracking-widest">v1 · {TODAY_EDITION}</span>
        </div>
      </header>

      <main className="flex-1 w-full">
        {/* ============ HERO ============ */}
        <section className="relative overflow-hidden">
          <div className="glow-uv w-[420px] h-[420px] -left-40 -top-10" />
          <div className="glow-amber w-[360px] h-[360px] -right-20 bottom-0" />

          <div className="relative max-w-6xl mx-auto px-4 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 mb-4 font-data text-[10px] text-uv-soft uppercase tracking-widest animate-stack-1">
                <span className="w-1.5 h-1.5 rounded-full bg-uv pulse-dot" />
                <span>DIAGNÓSTICO POLÍTICO</span>
                <span className="text-dim">·</span>
                <span className="text-muted">ECONOMIA × COSTUMES</span>
              </div>

              <h1
                data-text="MAPA//BR"
                className="glitch glitch-intro font-display text-7xl sm:text-8xl md:text-9xl tracking-tight leading-[0.86] mb-5 animate-stack-2 drop-shadow-[0_0_30px_rgba(138,60,255,0.25)]"
              >
                MAPA//BR
              </h1>

              <h2 className="font-display text-2xl sm:text-3xl text-ink/90 tracking-wide mb-6 animate-stack-2">
                ONDE VOCÊ ESTÁ <span className="text-uv-soft">NO MAPA POLÍTICO?</span>
              </h2>

              <div className="border-l-2 border-uv pl-4 py-1 mb-8 max-w-xl animate-stack-3">
                <p className="text-base sm:text-lg text-ink/80 leading-relaxed">
                  Direita, esquerda, centro. Todo mundo fala, pouca gente sabe explicar. Responda {QUESTIONS.length} frases
                  sobre economia e costumes e veja onde você cai.
                </p>
                <p className="text-sm text-muted mt-2">Não tem resposta certa nem errada.</p>
              </div>

              <div className="grid grid-cols-4 gap-px bg-line border border-line mb-8 max-w-xl animate-stack-3">
                {STATS.map((s) => (
                  <div key={s.label} className="bg-bg px-2 py-3 text-center">
                    <span className="block font-display text-2xl sm:text-3xl text-ink leading-none">{s.value}</span>
                    <span className="block font-data text-[8px] sm:text-[9px] text-muted uppercase tracking-widest mt-1.5">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 animate-stack-4">
                <Link
                  href="/teste"
                  className="cta-shine bg-uv hover:bg-[#9a55ff] active:scale-[0.99] text-white font-display text-xl uppercase py-4 px-8 tracking-wider flex items-center justify-center gap-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  <span>INICIAR O TESTE</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/rapido"
                  className="border border-line-strong hover:border-amber bg-bg/60 backdrop-blur-sm text-ink font-data text-[11px] uppercase tracking-widest py-4 px-5 flex items-center justify-center gap-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
                >
                  <span className="text-amber">Sem tempo?</span> Modo rápido · {QUICK_ORDER.length} frases
                </Link>
              </div>
              <p className="font-data text-[10px] text-muted uppercase tracking-widest leading-relaxed mt-4 animate-stack-4">
                <span className="text-ink">[1]–[5]</span> responde · <span className="text-ink">[0]</span> pula · Nada é
                salvo nem enviado.
              </p>
            </div>

            <div className="lg:col-span-5 animate-stack-4">
              <div className="crosshair-corners bg-surface/60 backdrop-blur-sm p-4 sm:p-6 max-w-md mx-auto">
                <div className="flex items-center justify-between font-data text-[9px] text-muted uppercase tracking-widest mb-3">
                  <span>{'// '}PLANO</span>
                  <span className="cursor">x: ?? · y: ??</span>
                </div>
                <PoliticalMap />
              </div>
            </div>
          </div>
        </section>

        {/* ============ COMO FUNCIONA ============ */}
        <section className="relative max-w-6xl mx-auto px-4 py-16 md:py-24 border-t border-line">
          <SectionLabel index="01">COMO FUNCIONA</SectionLabel>
          <h2 className="font-display text-4xl sm:text-5xl leading-[0.92] tracking-tight mb-10">
            DOIS EIXOS.
            <br />
            <span className="text-muted">OITO TEMAS.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AXES.map((a) => (
              <article key={a.name} className="bg-surface border border-line p-5 sm:p-6">
                <div className="flex items-center justify-between font-data text-[10px] uppercase tracking-widest mb-4">
                  <span className="text-uv-soft">{a.tag}</span>
                  <span className="text-muted">
                    {a.low} ↔ {a.high}
                  </span>
                </div>
                <h3 className="font-display text-3xl tracking-wide mb-2">{a.name}</h3>
                <p className="text-sm text-ink/75 leading-relaxed mb-5">{a.text}</p>
                <ul className="flex flex-wrap gap-2">
                  {THEMES.filter((t) => t.axis === a.axis).map((t) => (
                    <li
                      key={t.id}
                      className="font-data text-[10px] uppercase tracking-wider border border-line-strong px-2 py-1 text-ink/80"
                    >
                      <span className="text-uv-soft">{t.id}</span> {t.name}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 font-data text-[11px] uppercase tracking-wide">
            {[
              ['RESPONDA', `${QUESTIONS.length} frases, de "concordo totalmente" a "discordo totalmente". Na dúvida, pule.`],
              ['VEJA SEU PONTO', 'Sua posição nos dois eixos e o detalhe de cada um dos oito temas.'],
              ['COMPARE COM HOJE', `Opcional: mais ${TODAY.length} pautas atuais do Brasil, para ver se elas batem com os seus valores.`],
            ].map(([title, text], i) => (
              <div key={title} className="flex gap-4 items-start">
                <span className="font-display text-4xl text-bg leading-none w-8 shrink-0" style={{ WebkitTextStroke: '1px var(--uv)' }}>
                  {i + 1}
                </span>
                <div>
                  <strong className="block text-ink tracking-widest mb-1">{title}</strong>
                  <span className="text-muted normal-case font-sans text-sm tracking-normal leading-relaxed">{text}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============ AVISO ============ */}
        <section className="max-w-6xl mx-auto px-4 pb-16 md:pb-24">
          <div className="border-l-2 border-amber pl-4 py-1 max-w-2xl">
            <p className="text-sm text-ink/75 leading-relaxed">
              Todo teste desse tipo é uma simplificação. Direita e esquerda mudam de país pra país: o que é esquerda no Brasil
              pode ser centro na Dinamarca. Use o resultado como ponto de partida para conversar, não como rótulo.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-line py-4 px-4 font-data text-[10px] text-muted uppercase tracking-widest">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            MAPA<span className="text-uv-soft">{'//'}</span>BR · DIAGNÓSTICO POLÍTICO
          </span>
          <span>Nenhuma resposta sai do seu navegador</span>
        </div>
      </footer>
    </div>
  );
}
