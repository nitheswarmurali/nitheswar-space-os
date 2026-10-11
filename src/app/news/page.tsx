'use client';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
export default function NewsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [prov, setProv] = useState<any>(null);
  const [err, setErr] = useState<string|null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true); setErr(null);
    fetch('/api/news?limit=40', { cache: 'no-store' })
      .then(r => r.json())
      .then(j => { setItems(j.data?.results ?? []); setProv(j.provenance); setErr(j.error ?? null); })
      .catch(e => setErr(String(e)))
      .finally(() => setLoading(false));
  }, []);
  return (
    <div className="p-6 space-y-5">
      <header>
        <h1 className="text-xl font-semibold">Space News</h1>
        <p className="text-sm text-fg-2">Source: Spaceflight News API v4 — free, no key</p>
      </header>
      {err && <div className="rounded border border-amber-900/60 bg-amber-950/30 p-3 text-sm text-amber-400">Data unavailable: {err}</div>}
      <Card>
        <CardHeader title="Latest" subtitle={`${items.length} articles`}
          right={prov ? <Badge tone={prov.freshness}>{prov.freshness}</Badge> : null} />
        <CardBody className="p-0">
          {loading && <p className="p-4 text-sm text-fg-3">Loading…</p>}
          {!loading && items.length === 0 && !err && <p className="p-4 text-sm text-fg-3">No articles retrieved.</p>}
          <ul className="divide-y divide-line">
            {items.map(it => (
              <li key={it.id} className="px-4 py-3">
                <a href={it.url} target="_blank" rel="noreferrer noopener" className="block group">
                  <div className="text-sm text-fg group-hover:underline">{it.headline}</div>
                  {it.summary && <p className="mt-1 text-xs text-fg-3 line-clamp-2">{it.summary}</p>}
                  <div className="mt-1 text-2xs text-fg-3">
                    {it.publisher}
                    {it.publishedAt ? ` · ${new Date(it.publishedAt).toISOString().replace('T',' ').slice(0,16)} UTC` : ''}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}