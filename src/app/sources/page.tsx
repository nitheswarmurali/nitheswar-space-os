'use client';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
export default function SourcesPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [err, setErr] = useState<string|null>(null);
  useEffect(() => {
    fetch('/api/sources/health', { cache: 'no-store' })
      .then(r => r.json()).then(j => setRows(j.data ?? []))
      .catch(e => setErr(String(e)));
  }, []);
  return (
    <div className="p-6 space-y-5">
      <header>
        <h1 className="text-xl font-semibold">Data Sources</h1>
        <p className="text-sm text-fg-2">Every provider ORBIT OS uses.</p>
      </header>
      {err && <div className="rounded border border-amber-900/60 bg-amber-950/30 p-3 text-sm text-amber-400">{err}</div>}
      <Card>
        <CardHeader title="Registry" subtitle={`${rows.length} providers`} />
        <CardBody className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-line text-left text-2xs uppercase tracking-wide text-fg-3">
              <tr>
                <th className="px-4 py-2">Provider</th>
                <th className="px-4 py-2">Categories</th>
                <th className="px-4 py-2">Credentials</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Docs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map(r => (
                <tr key={r.key}>
                  <td className="px-4 py-2 text-fg">{r.name}</td>
                  <td className="px-4 py-2 text-xs text-fg-3">{r.categories.join(', ')}</td>
                  <td className="px-4 py-2 text-xs text-fg-3">{r.requiresCredentials ? 'optional' : 'none'}</td>
                  <td className="px-4 py-2"><Badge tone={r.status === 'active' ? 'live' : 'stale'}>{r.status}</Badge></td>
                  <td className="px-4 py-2"><a href={r.docsUrl} target="_blank" rel="noreferrer noopener"
                    className="text-xs text-fg-2 underline decoration-dotted">open</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}