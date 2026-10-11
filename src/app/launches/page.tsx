'use client';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
export default function LaunchesPage() {
  const [win, setWin] = useState<'upcoming'|'recent'>('upcoming');
  const [data, setData] = useState<any>(null);
  const [prov, setProv] = useState<any>(null);
  const [err, setErr] = useState<string|null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true); setData(null); setErr(null);
    fetch(`/api/launches?window=${win}&limit=30`, { cache: 'no-store' })
      .then(r => r.json())
      .then(j => { setData(j.data); setProv(j.provenance); setErr(j.error ?? null); })
      .catch(e => setErr(String(e)))
      .finally(() => setLoading(false));
  }, [win]);
  return (
    <div className="p-6 space-y-5">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Launch Schedule</h1>
          <p className="text-sm text-fg-2">Source: Launch Library 2 — free, no key</p>
        </div>
        <div className="flex gap-1 rounded border border-line p-0.5 text-xs">
          {(['upcoming','recent'] as const).map(w => (
            <button key={w} onClick={() => setWin(w)}
              className={`rounded px-2.5 py-1.5 ${win === w ? 'bg-card text-fg' : 'text-fg-3 hover:text-fg'}`}>{w}</button>
          ))}
        </div>
      </header>
      {err && <div className="rounded border border-amber-900/60 bg-amber-950/30 p-3 text-sm text-amber-400">Data unavailable: {err}</div>}
      <Card>
        <CardHeader title={`${win} launches`} subtitle={data ? `${data.count} total` : 'loading…'}
          right={prov ? <Badge tone={prov.freshness}>{prov.freshness}</Badge> : null} />
        <CardBody className="p-0">
          {loading && <p className="p-4 text-sm text-fg-3">Loading…</p>}
          {!loading && data?.results?.length === 0 && <p className="p-4 text-sm text-fg-3">No launches returned.</p>}
          {data?.results?.length > 0 && (
            <ul className="divide-y divide-line">
              {data.results.map((l: any) => (
                <li key={l.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm text-fg">{l.name}</div>
                      <div className="mt-0.5 text-xs text-fg-3">
                        {l.launch_service_provider?.name ?? '—'}
                        {l.rocket?.configuration?.full_name ? ` · ${l.rocket.configuration.full_name}` : ''}
                        {l.pad?.location?.name ? ` · ${l.pad.location.name}` : ''}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="font-mono text-xs text-fg-2">
                        {l.net ? new Date(l.net).toISOString().replace('T',' ').slice(0,16) + ' UTC' : '—'}
                      </div>
                      {l.status?.abbrev && <Badge className="mt-1">{l.status.abbrev}</Badge>}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  );
}