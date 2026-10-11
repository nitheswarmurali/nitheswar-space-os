'use client';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
export default function IssPage() {
  const [d, setD] = useState<any>(null);
  const [err, setErr] = useState<string|null>(null);
  const load = () => fetch('/api/iss', { cache: 'no-store' })
    .then(r => r.json()).then(j => { setD(j); setErr(j.error ?? null); })
    .catch(e => setErr(String(e)));
  useEffect(() => { load(); const id = setInterval(load, 10000); return () => clearInterval(id); }, []);
  const f = d?.data?.feed;
  return (
    <div className="p-6 space-y-5">
      <header>
        <h1 className="text-xl font-semibold">International Space Station</h1>
        <p className="text-sm text-fg-2">Live measured feed</p>
      </header>
      <Card>
        <CardHeader title="Live position"
          right={d?.provenance ? <Badge tone={d.provenance.freshness}>{d.provenance.freshness}</Badge> : null} />
        <CardBody>
          {err && <p className="text-sm text-amber-500">Data unavailable: {err}</p>}
          {!err && !f && <p className="text-sm text-fg-3">Loading…</p>}
          {f && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <M label="Latitude"  v={f.latitude.toFixed(4)}  u="°" />
              <M label="Longitude" v={f.longitude.toFixed(4)} u="°" />
              <M label="Altitude"  v={f.altitude.toFixed(1)}  u="km" />
              <M label="Velocity"  v={f.velocity.toFixed(0)}  u="km/h" />
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
function M({ label, v, u }: { label: string; v: string; u: string }) {
  return (
    <div>
      <div className="text-2xs uppercase tracking-wide text-fg-3">{label}</div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="font-mono text-2xl text-fg">{v}</span>
        <span className="text-xs text-fg-3">{u}</span>
      </div>
    </div>
  );
}