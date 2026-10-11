'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Rocket,
  Satellite,
  Newspaper,
  Radio,
  Database,
  Globe2,
  Tv,
  Globe,
  Building2,
  FileKey,
} from 'lucide-react';
import { clsx } from 'clsx';

const ITEMS = [
  { href: '/',                 label: 'Mission Control',  icon: LayoutDashboard },
  { href: '/map',              label: 'Live Space Map',   icon: Globe2 },
  { href: '/launches',         label: 'Launches',         icon: Rocket },
  { href: '/satellites',       label: 'Satellites',       icon: Satellite },
  { href: '/agencies',         label: 'Agencies',         icon: Building2 },
  { href: '/official-sources', label: 'Official Sources', icon: FileKey },
  { href: '/iss',              label: 'ISS',              icon: Globe },
  { href: '/broadcasts',       label: 'Live Broadcasts',  icon: Tv },
  { href: '/news',             label: 'News',             icon: Newspaper },
  { href: '/sources',          label: 'Data Sources',     icon: Database },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-60 shrink-0 border-r border-line bg-bg-2 lg:block">
      <div className="flex h-12 items-center gap-2 border-b border-line px-4">
        <Radio className="h-4 w-4 text-fg" />
        <span className="text-sm font-semibold tracking-wide">ORBIT OS</span>
      </div>
      <nav className="space-y-0.5 p-2">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
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
    </aside>
  );
}