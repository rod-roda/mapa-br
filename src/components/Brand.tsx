import Link from 'next/link';

export function Brand({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`font-display text-xl tracking-wide text-ink hover:text-uv-soft transition-colors ${className}`}
    >
      MAPA<span className="text-uv">{'//'}</span>BR
    </Link>
  );
}

export function SectionLabel({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 font-data text-[10px] uppercase tracking-widest mb-3">
      <span className="text-uv-soft">
        {'// '}
        {index}
      </span>
      <span className="h-px w-8 bg-line-strong" />
      <span className="text-muted">{children}</span>
    </div>
  );
}
