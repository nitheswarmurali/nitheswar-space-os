'use client';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
export default function Page() {
  const [iss, setIss] = useState<any>(null);
  const [err, setErr] = useState<string|null>(null);
  const load = () => fetch('/api/iss', { cache: 'no-store' })
    .then(r => r.json()).then(j => { setIss(j); setErr(j.error ?? null); })
    .catch(e => setErr(String(e)));
  useEffect(() => { load(); const id = setInterval(load, 10000); return () => clearInterval(id); }, []);
  const f = iss?.data?.feed;
  return (
    <main className="p-8 space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">ORBIT OS — Mission Control</h1>
        <p className="text-sm text-fg-2">Live ISS tracking from a real public provider feed.</p>
      </header>
      {err && <div className="rounded border border-amber-900/60 bg-amber-950/30 p-3 text-sm text-amber-400">Data unavailable: {err}</div>}
      <Card>
        <CardHeader title="International Space Station — live position" subtitle={iss?.provenance?.source ?? 'Where The ISS At?'}
          right={iss?.provenance ? <Badge tone={iss.provenance.freshness}>{iss.provenance.freshness}</Badge> : null} />
        <CardBody>
          {!f && !err && <p className="text-sm text-fg-3">Loading…</p>}
          {f && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <M label="Latitude"  v={f.latitude.toFixed(4)}  u="°" />
              <M label="Longitude" v={f.longitude.toFixed(4)} u="°" />
              <M label="Altitude"  v={f.altitude.toFixed(1)}  u="km" />
              <M label="Velocity"  v={f.velocity.toFixed(0)}  u="km/h" />
              <div className="col-span-2 md:col-span-4 border-t border-line pt-3 text-xs text-fg-3 space-y-0.5">
                <div>Observed: <span className="font-mono text-fg-2">{iss.provenance?.observedAt}</span></div>
                <div className="text-amber-500/80">{iss.provenance?.limitations}</div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </main>
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