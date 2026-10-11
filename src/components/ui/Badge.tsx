import { clsx } from 'clsx';
const STYLES: Record<string, string> = {
  live:        'border-emerald-800/60 bg-emerald-950/40 text-emerald-400',
  recent:      'border-emerald-900/60 bg-emerald-950/20 text-emerald-500',
  scheduled:   'border-sky-900/60 bg-sky-950/30 text-sky-400',
  cached:      'border-neutral-700 bg-neutral-900/60 text-fg-2',
  stale:       'border-amber-900/60 bg-amber-950/30 text-amber-400',
  unavailable: 'border-red-900/60 bg-red-950/30 text-red-400',
  unverified:  'border-neutral-700 bg-neutral-900/60 text-fg-3',
};
export function Badge({ children, tone, className }: { children: React.ReactNode; tone?: string; className?: string }) {
  return (
    <span className={clsx(
      'inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-2xs font-medium uppercase tracking-wide',
      tone && STYLES[tone] ? STYLES[tone] : 'border-line bg-bg-2 text-fg-2',
      className
    )}>{children}</span>
  );
}