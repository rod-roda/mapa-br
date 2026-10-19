'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';

// No celular, manda a imagem direto para a folha de compartilhamento (Instagram, WhatsApp...).
// Onde não dá para compartilhar arquivo (desktop), baixa o PNG.
export function StoryButton({ query }: { query: string }) {
  const [busy, setBusy] = useState(false);
  const src = `/api/imagem?f=story&${query}`;

  const handle = async () => {
    setBusy(true);
    try {
      const blob = await fetch(src).then((r) => r.blob());
      const file = new File([blob], 'mapa-br.png', { type: 'image/png' });

      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file] });
        } catch {
          // Cancelado pela pessoa
        }
        return;
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mapa-br.png';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // Se o fetch falhar, abre a imagem numa aba para a pessoa salvar manualmente
      window.open(src, '_blank');
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={handle}
      disabled={busy}
      className="cta-shine bg-amber hover:bg-[#ffc04d] disabled:opacity-70 active:scale-[0.99] text-bg font-display text-xl uppercase py-4 px-6 tracking-wider flex items-center justify-center gap-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
      <span>IMAGEM PARA OS STORIES</span>
    </button>
  );
}
