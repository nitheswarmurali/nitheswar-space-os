import { clsx } from 'clsx';
import type { ReactNode } from 'react';
export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx('rounded-md border border-line bg-card', className)}>{children}</div>;
}
export function CardHeader({ title, subtitle, right }: { title: ReactNode; subtitle?: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-line px-4 py-3">
      <div className="min-w-0">
        <h3 className="truncate text-[13px] font-medium uppercase tracking-wide text-fg-2">{title}</h3>
        {subtitle ? <p className="mt-0.5 truncate text-xs text-fg-3">{subtitle}</p> : null}
      </div>
      {right}
    </div>
  );
}
export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx('p-4', className)}>{children}</div>;
}