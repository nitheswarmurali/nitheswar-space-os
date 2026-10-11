'use client';
import { useState, useMemo } from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  ALL_AGENCIES,
  getAgenciesByRegion,
  REGION_COLORS,
  type Agency,
} from '@/lib/allAgencies';
import {
  Search, ExternalLink, Globe2, Database, Lock, Unlock, FileKey,
  Building2, MapPin, Calendar, Layers,
} from 'lucide-react';

const ACCESS_ICON = { free: Unlock, registration: FileKey, restricted: Lock };

function AccessBadge({ access }: { access: Agency['access'] }) {
  const Icon = ACCESS_ICON[access];
  const tone = access === 'free' ? 'live' : access === 'registration' ? 'scheduled' : 'stale';
  return <Badge tone={tone}><Icon className="mr-1 h-2.5 w-2.5" />{access}</Badge>;
}

export default function AgenciesPage() {
  const [q, setQ] = useState('');
  const [region, setRegion] = useState<string>('all');
  const [view, setView] = useState<'all' | 'region'>('all');

  const regions = useMemo(() => getAgenciesByRegion(), []);

  const filtered = useMemo(() => {
    let list = ALL_AGENCIES;
    if (region !== 'all') list = list.filter(a => a.region === region);
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      list = list.filter(a =>
        a.name.toLowerCase().includes(needle) ||
        a.abbreviation.toLowerCase().includes(needle) ||
        a.country.toLowerCase().includes(needle) ||
        a.description.toLowerCase().includes(needle)
      );
    }
    return list;
  }, [q, region]);

  return (
    <div className="p-6 space-y-5">
      <header>
        <h1 className="text-xl font-semibold">Global Space Agencies</h1>
        <p className="text-sm text-fg-2">
          {ALL_AGENCIES.length} space agencies worldwide. Every URL is the agency&apos;s own domain.
          Verified via web search. No community mirrors.
        </p>
      </header>

      {/* Region summary cards */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-6">
        <button onClick={() => { setRegion('all'); setView('all'); }}
          className={`rounded-md border px-3 py-2 text-left transition-colors ${
            region === 'all' ? 'border-fg-2 bg-card' : 'border-line bg-bg-2 hover:border-fg-3'
          }`}>
          <div className="text-2xs uppercase tracking-wide text-fg-3">All</div>
          <div className="mt-1 font-mono text-xl text-fg">{ALL_AGENCIES.length}</div>
        </button>
        {Object.entries(regions).map(([r, list]) => (
          <button key={r} onClick={() => { setRegion(r); setView('region'); }}
            className={`rounded-md border px-3 py-2 text-left transition-colors ${
              region === r ? 'border-fg-2 bg-card' : 'border-line bg-bg-2 hover:border-fg-3'
            }`}>
            <div className="text-2xs uppercase tracking-wide text-fg-3 truncate">{r}</div>
            <div className="mt-1 font-mono text-xl text-fg">{list.length}</div>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-fg-3" />
          <input value={q} onChange={e => setQ(e.target.value)}
            placeholder="Search by name, abbreviation, or country…"
            className="w-full rounded border border-line bg-bg-2 py-1.5 pl-8 pr-3 text-[13px] text-fg placeholder:text-fg-3 focus:border-neutral-600 focus:outline-none" />
        </div>
        {region !== 'all' && (
          <button onClick={() => { setRegion('all'); setView('all'); }}
            className="rounded border border-line px-2.5 py-1.5 text-xs text-fg-2 hover:bg-neutral-900 hover:text-fg">
            Clear region
          </button>
        )}
        <span className="text-xs text-fg-3">{filtered.length} shown</span>
      </div>

      {/* Agency list */}
      {view === 'all' && region === 'all' && !q.trim() ? (
        // Group by first letter when no filter is applied
        <div className="space-y-4">
          {Object.entries(
            filtered.reduce<Record<string, Agency[]>>((acc, a) => {
              const letter = a.name[0].toUpperCase();
              if (!acc[letter]) acc[letter] = [];
              acc[letter].push(a);
              return acc;
            }, {})
          ).sort(([a], [b]) => a.localeCompare(b)).map(([letter, list]) => (
            <Card key={letter}>
              <CardHeader title={`${letter} — ${list.length} agenc${list.length === 1 ? 'y' : 'ies'}`} />
              <CardBody className="p-0">
                <AgencyList list={list} />
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader
            title={region === 'all' ? 'All agencies' : `${region} — ${filtered.length} agencies`}
            subtitle={q.trim() ? `Filtered by "${q.trim()}"` : undefined}
          />
          <CardBody className="p-0">
            {filtered.length === 0 ? (
              <p className="p-4 text-sm text-fg-3">No agencies match your filter.</p>
            ) : (
              <AgencyList list={filtered} />
            )}
          </CardBody>
        </Card>
      )}

      {/* Honest disclaimer */}
      <div className="rounded border border-line bg-bg-2 px-3 py-3 text-2xs text-fg-3 leading-relaxed space-y-1.5">
        <p className="text-fg-2 font-medium">Data access notes</p>
        <p>
          <strong>Free:</strong> Open portals — no account required to browse or download.
        </p>
        <p>
          <strong>Registration:</strong> Free account required. Standard for most national space
          agencies. Not a limitation of ORBIT OS.
        </p>
        <p>
          <strong>Restricted:</strong> Programmatic access limited or requires special approval.
        </p>
        <p>
          <strong>Real-time telemetry:</strong> No space agency publishes unauthenticated raw
          telemetry streams to the public. Orbital positions shown elsewhere in ORBIT OS are
          derived from public TLE element sets (CelesTrak) and labelled as such.
        </p>
        <p>
          <strong>Live launch data:</strong> Sourced from Launch Library 2 (The Space Devs), a
          free aggregator that covers 200+ agencies and launch providers worldwide.
        </p>
      </div>
    </div>
  );
}

function AgencyList({ list }: { list: Agency[] }) {
  return (
    <ul className="divide-y divide-line">
      {list.map(a => (
        <li key={a.id} className="px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-fg">{a.abbreviation}</span>
                <span className="text-xs text-fg-3 truncate">{a.name}</span>
                <Badge className={REGION_COLORS[a.region] ?? ''}>{a.region}</Badge>
                <AccessBadge access={a.access} />
              </div>
              <p className="mt-1 text-xs text-fg-3 leading-relaxed">{a.description}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-3 text-2xs text-fg-3">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{a.country}</span>
                {a.founded && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />est. {a.founded}</span>}
                {a.dataTypes.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Layers className="h-3 w-3" />
                    {a.dataTypes.slice(0, 3).join(' · ')}
                    {a.dataTypes.length > 3 ? ` +${a.dataTypes.length - 3}` : ''}
                  </span>
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <a href={a.website} target="_blank" rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 rounded border border-line px-2 py-1 text-2xs text-fg-2 hover:bg-neutral-900 hover:text-fg">
                  <Globe2 className="h-3 w-3" /> website
                </a>
                {a.dataPortal && (
                  <a href={a.dataPortal} target="_blank" rel="noreferrer noopener"
                    className="inline-flex items-center gap-1 rounded border border-line px-2 py-1 text-2xs text-fg-2 hover:bg-neutral-900 hover:text-fg">
                    <Database className="h-3 w-3" /> data portal
                  </a>
                )}
                {a.apiEndpoint && (
                  <a href={a.apiEndpoint} target="_blank" rel="noreferrer noopener"
                    className="inline-flex items-center gap-1 rounded border border-line px-2 py-1 text-2xs text-fg-2 hover:bg-neutral-900 hover:text-fg">
                    <Building2 className="h-3 w-3" /> API
                  </a>
                )}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}