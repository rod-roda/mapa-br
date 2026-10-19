'use client';

import dynamic from 'next/dynamic';

// O quiz lê o progresso do sessionStorage ao montar, então não faz sentido renderizar no servidor
export const QuizLoader = dynamic(() => import('@/components/Quiz').then((m) => m.Quiz), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center font-data text-[11px] text-muted uppercase tracking-widest">
      <span className="cursor">carregando</span>
    </div>
  ),
});
