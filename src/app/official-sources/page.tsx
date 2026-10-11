'use client';
import { useState } from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ExternalLink, Building2, Database, Globe2, Lock, Unlock, FileKey } from 'lucide-react';
import { OFFICIAL_SOURCES, type OfficialSource } from '@/lib/officialSources';

const AGENCY_COLORS: Record<string, string> = {
  ISRO: 'border-orange-900/60 bg-orange-950/30 text-orange-400',
  CNSA: 'border-red-900/60 bg-red-950/30 text-red-400',
  JAXA: 'border-sky-900/60 bg-sky-950/30 text-sky-400',
};

const ACCESS_ICON = {
  free: Unlock,
  registration: FileKey,
  restricted: Lock,
};

function AccessBadge({ access }: { access: OfficialSource['access'] }) {
  const Icon = ACCESS_ICON[access];
  const tone = access === 'free' ? 'live' : access === 'registration' ? 'scheduled' : 'stale';
  return (
    <Badge tone={tone}>
      <Icon className="mr-1 h-2.5 w-2.5" />
      {access}
    </Badge>
  );
}

export default function OfficialSourcesPage() {
  const agencies: Array<'ISRO' | 'CNSA' | 'JAXA'> = ['ISRO', 'CNSA', 'JAXA'];
  const [filter, setFilter] = useState<'all' | 'ISRO' | 'CNSA' | 'JAXA'>('all');

  const visible = filter === 'all'
    ? OFFICIAL_SOURCES
    : OFFICIAL_SOURCES.filter(s => s.agency === filter);

  return (
    <div className="p-6 space-y-5">
      <header>
        <h1 className="text-xl font-semibold">Official Agency Sources</h1>
        <p className="text-sm text-fg-2">
          Every URL here is the agency&apos;s own domain. No community mirrors, no third-party APIs.
          Verified via web search.
        </p>
      </header>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-1 rounded border border-line p-0.5 text-xs">
        <button
          onClick={() => setFilter('all')}
          className={`rounded px-3 py-1.5 ${filter === 'all' ? 'bg-card text-fg' : 'text-fg-3 hover:text-fg'}`}
        >
          All ({OFFICIAL_SOURCES.length})
        </button>
        {agencies.map(a => {
          const count = OFFICIAL_SOURCES.filter(s => s.agency === a).length;
          return (
            <button
              key={a}
              onClick={() => setFilter(a)}
              className={`rounded px-3 py-1.5 ${filter === a ? 'bg-card text-fg' : 'text-fg-3 hover:text-fg'}`}
            >
              {a} ({count})
            </button>
          );
        })}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {agencies.map(a => {
          const count = OFFICIAL_SOURCES.filter(s => s.agency === a).length;
          return (
            <Card key={a} className="p-3">
              <div className="flex items-center justify-between">
                <span className="text-2xs uppercase tracking-wide text-fg-3">{a}</span>
                <Building2 className="h-3.5 w-3.5 text-fg-3" />
              </div>
              <div className="mt-1.5 font-mono text-2xl text-fg">{count}</div>
              <div className="mt-1 text-2xs text-fg-3">official sources</div>
            </Card>
          );
        })}
      </div>

      {/* Source list grouped by agency */}
      {agencies
        .filter(a => filter === 'all' || filter === a)
        .map(a => {
          const group = visible.filter(s => s.agency === a);
          if (group.length === 0) return null;
          return (
            <Card key={a}>
              <CardHeader
                title={`${a} — Official Sources`}
                subtitle={`${group.length} verified URLs`}
                right={<Badge className={AGENCY_COLORS[a]}>{a}</Badge>}
              />
              <CardBody className="p-0">
                <ul className="divide-y divide-line">
                  {group.map((s, i) => (
                    <li key={i} className="px-4 py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-medium text-fg">{s.name}</span>
                            <span className="rounded border border-line bg-bg-2 px-1.5 py-0.5 text-2xs text-fg-3">
                              {s.category}
                            </span>
                            <AccessBadge access={s.access} />
                          </div>
                          <p className="mt-1 text-xs text-fg-3 leading-relaxed">
                            {s.description}
                          </p>
                          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-2xs text-fg-3">
                            <Database className="h-3 w-3" />
                            <span>{s.dataType}</span>
                          </div>
                        </div>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="shrink-0 inline-flex items-center gap-1 rounded border border-line px-2 py-1 text-2xs text-fg-2 hover:bg-neutral-900 hover:text-fg"
                          title={s.url}
                        >
                          open <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <div className="mt-1.5 font-mono text-2xs text-fg-3 truncate">
                        {s.url}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          );
        })}

      {/* Honest disclaimer */}
      <div className="rounded border border-line bg-bg-2 px-3 py-2 text-2xs text-fg-3 leading-relaxed space-y-1">
        <p>
          <strong className="text-fg-2">Note on access:</strong> Many official agency portals require
          free registration before you can download data. This is standard practice — not a
          limitation of ORBIT OS.
        </p>
        <p>
          <strong className="text-fg-2">Note on CNSA:</strong> The China National Space Administration
          does not publish an English-language API. The URLs above are the closest authoritative
          sources available. English news is aggregated via the Apify scraper.
        </p>
        <p>
          <strong className="text-fg-2">Note on real-time telemetry:</strong> No space agency
          publishes unauthenticated raw telemetry streams to the public. Orbital positions in the
          main ORBIT OS catalog are derived from public TLE element sets (CelesTrak) and labelled
          as such.
        </p>
      </div>
    </div>
  );
}