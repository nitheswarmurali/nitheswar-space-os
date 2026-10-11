'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
const IssMap = dynamic(() => import('@/components/map/IssMap'), {
  ssr: false,
  loading: () => <div className="flex h-full w-full items-center justify-center text-sm text-fg-3">Loading map…</div>,
});
export default function LiveMapPage() {
  const [fix, setFix] = useState<any>(null);
  const [prov, setProv] = useState<any>(null);
  const [err, setErr] = useState<string|null>(null);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let cancelled = false;
    const load = () => {
      fetch('/api/iss', { cache: 'no-store' })
        .then(r => r.json())
        .then(j => {
          if (cancelled) return;
          setFix(j?.data?.feed ?? null);
          setProv(j?.provenance ?? null);
          setErr(j?.error ?? null);
          setTick(t => t + 1);
        })
        .catch(e => { if (!cancelled) setErr(String(e)); });
    };
    load();
    const id = setInterval(load, 10000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);
  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between gap-4 border-b border-line px-6 py-3">
        <div>
          <h1 className="text-lg font-semibold">Live Space Map</h1>
          <p className="text-xs text-fg-3">ISS position from a real feed. Tiles: OpenStreetMap.</p>
        </div>
        {prov && <Badge tone={prov.freshness}>{prov.freshness}</Badge>}
      </header>
      <div className="relative flex-1">
        <IssMap fix={fix} />
        <div className="pointer-events-none absolute left-4 top-4 z-[1000]">
          <Card className="pointer-events-auto w-64">
            <CardHeader title="ISS — current fix" />
            <CardBody className="space-y-1 text-xs font-mono">
              {!fix && !err && <p className="text-fg-3">Loading…</p>}
              {err && <p className="text-amber-500">Data unavailable: {err}</p>}
              {fix && (
                <>
                  <div className="flex justify-between"><span className="text-fg-3">lat</span><span>{fix.latitude.toFixed(4)}</span></div>
                  <div className="flex justify-between"><span className="text-fg-3">lon</span><span>{fix.longitude.toFixed(4)}</span></div>
                  <div className="flex justify-between"><span className="text-fg-3">alt</span><span>{fix.altitude.toFixed(1)} km</span></div>
                  <div className="flex justify-between"><span className="text-fg-3">vel</span><span>{fix.velocity.toFixed(0)} km/h</span></div>
                  <div className="mt-2 border-t border-line pt-1 text-2xs text-fg-3">
                    updated #{tick} · {new Date(fix.timestamp * 1000).toISOString().slice(11, 19)} UTC
                  </div>
                </>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}