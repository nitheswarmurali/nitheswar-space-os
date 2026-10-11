'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { NAV_ITEMS, isActive, BRAND_ICON as Radio } from './NavItems';

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:block w-60 shrink-0 border-r border-line bg-bg-2">
      <div className="sticky top-0 flex h-screen flex-col">
        <div className="flex h-12 items-center gap-2 border-b border-line px-4">
          <Radio className="h-4 w-4 text-fg" />
          <span className="text-sm font-semibold tracking-wide">ORBIT OS</span>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'flex items-center gap-2 rounded px-2.5 py-2 text-[13px]',
                  active
                    ? 'border border-line bg-card text-fg'
                    : 'text-fg-2 hover:bg-neutral-900 hover:text-fg'
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}