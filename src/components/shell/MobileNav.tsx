'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { clsx } from 'clsx';
import { NAV_ITEMS, isActive, BRAND_ICON as Radio } from './NavItems';

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Top bar (mobile only) */}
      <div className="lg:hidden sticky top-0 z-40 flex h-12 items-center gap-3 border-b border-line bg-bg-2 px-3">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="inline-flex h-9 w-9 items-center justify-center rounded border border-line text-fg-2 hover:bg-neutral-900 hover:text-fg"
        >
          <Menu className="h-4 w-4" />
        </button>
        <Link href="/" className="flex items-center gap-2">
          <Radio className="h-4 w-4 text-fg" />
          <span className="text-sm font-semibold tracking-wide">ORBIT OS</span>
        </Link>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-in drawer */}
      <aside
        className={clsx(
          'lg:hidden fixed top-0 left-0 z-[60] h-full w-72 max-w-[85vw] transform bg-bg-2 border-r border-line',
          'transition-transform duration-200 ease-out',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-hidden={!open}
      >
        <div className="flex h-12 items-center justify-between border-b border-line px-3">
          <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <Radio className="h-4 w-4 text-fg" />
            <span className="text-sm font-semibold tracking-wide">ORBIT OS</span>
          </Link>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded border border-line text-fg-2 hover:bg-neutral-900 hover:text-fg"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="space-y-0.5 p-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 3rem)' }}>
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={clsx(
                  'flex items-center gap-3 rounded px-3 py-2.5 text-sm',
                  active
                    ? 'border border-line bg-card text-fg'
                    : 'text-fg-2 hover:bg-neutral-900 hover:text-fg'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}