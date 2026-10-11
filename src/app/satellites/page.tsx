'use client';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
const GROUPS = ['stations','active','weather','gps-ops','science','starlink','geo'] as const;
type Group = typeof GROUPS[number];
export default function SatellitesPage() {
  const [group, setGroup] = useState<Group>('stations');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [prov, setProv] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string|null>(null);
  useEffect(() => {
    setLoading(true); setErr(null);
    const id = setTimeout(() => {
      fetch(`/api/satellites?group=${group}&q=${encodeURIComponent(q)}&page=${page}&limit=25`, { cache: 'no-store' })
        .then(r => r.json())
        .then(j => {
          setRows(j.data?.results ?? []);
          setTotal(j.data?.total ?? 0);
          setProv(j.provenance);
          setErr(j.error ?? null);
        })
        .catch(e => setErr(String(e)))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(id);
  }, [group, q, page]);
  const totalPages = Math.max(1, Math.ceil(total / 25));
  return (
    <div className="p-6 space-y-5">
      <header>
        <h1 className="text-xl font-semibold">Satellite Catalog</h1>
        <p className="text-sm text-fg-2">Source: CelesTrak GP — OMM element sets, free</p>
      </header>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1 rounded border border-line p-0.5 text-xs">
          {GROUPS.map(g => (
            <button key={g} onClick={() => { setGroup(g); setPage(1); }}
              className={`rounded px-2 py-1 ${group === g ? 'bg-card text-fg' : 'text-fg-3 hover:text-fg'}`}>{g}</button>
          ))}
        </div>
        <input value={q} onChange={e => { setQ(e.target.value); setPage(1); }} placeholder="Search name or NORAD id…"
          className="w-64 rounded border border-line bg-bg-2 px-2.5 py-1.5 text-[13px] text-fg placeholder:text-fg-3 focus:border-neutral-600 focus:outline-none" />
        {prov && <Badge tone={prov.freshness}>{prov.freshness}</Badge>}
      </div>
      {err && <div className="rounded border border-amber-900/60 bg-amber-950/30 p-3 text-sm text-amber-400">Data unavailable: {err}</div>}
      <Card>
        <CardHeader title="Objects" subtitle={`${total} matching in current group`} />
        <CardBody className="p-0">
          {loading && rows.length === 0 && <p className="p-4 text-sm text-fg-3">Loading…</p>}
          {!loading && rows.length === 0 && !err && <p className="p-4 text-sm text-fg-3">No objects returned.</p>}
          {rows.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-line text-left text-2xs uppercase tracking-wide text-fg-3">
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">NORAD</th>
                    <th className="px-4 py-2">Regime</th>
                    <th className="px-4 py-2 text-right">Inc°</th>
                    <th className="px-4 py-2 text-right">Ecc</th>
                    <th className="px-4 py-2 text-right">MM rev/day</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {rows.map(r => (
                    <tr key={r.noradId} className="hover:bg-neutral-900/40">
                      <td className="px-4 py-2 text-fg">{r.name}</td>
                      <td className="px-4 py-2 font-mono text-fg-2">{r.noradId}</td>
                      <td className="px-4 py-2">{r.regime}</td>
                      <td className="px-4 py-2 text-right font-mono">{r.inclination.toFixed(2)}</td>
                      <td className="px-4 py-2 text-right font-mono">{r.eccentricity.toFixed(5)}</td>
                      <td className="px-4 py-2 text-right font-mono">{r.meanMotion.toFixed(4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {total > 25 && (
            <div className="flex items-center justify-between border-t border-line px-4 py-2 text-xs text-fg-3">
              <span>Page {page} / {totalPages}</span>
              <div className="flex gap-1">
                <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="rounded border border-line px-2 py-1 disabled:opacity-40">Prev</button>
                <button disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className="rounded border border-line px-2 py-1 disabled:opacity-40">Next</button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}