'use client';

import { useState } from 'react';
import { Check, Share2 } from 'lucide-react';

export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;
    // No celular abre a folha de compartilhamento nativa; no desktop copia o link
    if (navigator.share) {
      try {
        await navigator.share({ title: `Deu ${title} no MAPA//BR`, url });
        return;
      } catch {
        // Cancelado pela pessoa: não faz nada
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <button
      onClick={share}
      className="cta-shine bg-uv hover:bg-[#9a55ff] active:scale-[0.99] text-white font-display text-xl uppercase py-4 px-6 tracking-wider flex items-center justify-center gap-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
      <span>{copied ? 'LINK COPIADO' : 'COMPARTILHAR RESULTADO'}</span>
    </button>
  );
}
