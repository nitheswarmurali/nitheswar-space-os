import {
  LayoutDashboard, Rocket, Satellite, Newspaper, Radio,
  Database, Globe2, Tv, Globe, Building2, FileKey,
} from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: any;
}

export const NAV_ITEMS: NavItem[] = [
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

export function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href);
}

export const BRAND_ICON = Radio;